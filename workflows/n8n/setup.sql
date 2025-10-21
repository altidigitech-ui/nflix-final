-- ============================================
-- NFLIX Health Monitor - Database Setup
-- ============================================
-- Version: 1.0.0
-- Date: 2025-10-21
-- Description: Tables et fonctions pour le monitoring de santé

-- ============================================
-- 1. TABLES
-- ============================================

-- Table pour l'historique des checks de santé
CREATE TABLE IF NOT EXISTS health_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('healthy', 'degraded', 'down')),
  metrics JSONB,
  services JSONB,
  issues_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_health_logs_timestamp ON health_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_health_logs_status ON health_logs(status);
CREATE INDEX IF NOT EXISTS idx_health_logs_created_at ON health_logs(created_at DESC);

-- Commentaires
COMMENT ON TABLE health_logs IS 'Historique de tous les health checks effectués';
COMMENT ON COLUMN health_logs.status IS 'État global du système: healthy, degraded, ou down';
COMMENT ON COLUMN health_logs.metrics IS 'Métriques collectées (queue, storage, errors)';
COMMENT ON COLUMN health_logs.services IS 'État de chaque service surveillé';
COMMENT ON COLUMN health_logs.issues_count IS 'Nombre de problèmes détectés';

-- ============================================

-- Table pour les incidents de santé
CREATE TABLE IF NOT EXISTS health_incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('degraded', 'down')),
  issues JSONB NOT NULL,
  metrics JSONB,
  services JSONB,
  alert_sent BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_health_incidents_timestamp ON health_incidents(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_health_incidents_status ON health_incidents(status);
CREATE INDEX IF NOT EXISTS idx_health_incidents_resolved ON health_incidents(resolved_at);
CREATE INDEX IF NOT EXISTS idx_health_incidents_severity ON health_incidents(severity);
CREATE INDEX IF NOT EXISTS idx_health_incidents_unresolved ON health_incidents(resolved_at) WHERE resolved_at IS NULL;

-- Commentaires
COMMENT ON TABLE health_incidents IS 'Incidents de santé détectés nécessitant une attention';
COMMENT ON COLUMN health_incidents.issues IS 'Liste des problèmes détectés';
COMMENT ON COLUMN health_incidents.alert_sent IS 'Indique si une alerte a été envoyée';
COMMENT ON COLUMN health_incidents.resolved_at IS 'Date de résolution de l''incident';
COMMENT ON COLUMN health_incidents.severity IS 'Gravité de l''incident';

-- ============================================

-- Table pour les logs d'erreurs (si elle n'existe pas déjà)
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  error_type TEXT NOT NULL,
  error_message TEXT,
  error_stack TEXT,
  context JSONB,
  user_id UUID,
  job_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at ON error_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_type ON error_logs(error_type);
CREATE INDEX IF NOT EXISTS idx_error_logs_user ON error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_job ON error_logs(job_id);

-- Commentaires
COMMENT ON TABLE error_logs IS 'Logs de toutes les erreurs applicatives';
COMMENT ON COLUMN error_logs.error_type IS 'Type/catégorie de l''erreur';
COMMENT ON COLUMN error_logs.context IS 'Contexte additionnel de l''erreur (JSON)';

-- ============================================

-- Table pour les jobs (si elle n'existe pas déjà)
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  payload JSONB,
  result JSONB,
  error TEXT,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_updated_at ON jobs(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);
CREATE INDEX IF NOT EXISTS idx_jobs_stuck ON jobs(status, updated_at) WHERE status = 'processing';

-- Commentaires
COMMENT ON TABLE jobs IS 'Queue de jobs asynchrones';
COMMENT ON COLUMN jobs.attempts IS 'Nombre de tentatives d''exécution';
COMMENT ON COLUMN jobs.max_attempts IS 'Nombre maximum de tentatives';

-- ============================================
-- 2. FONCTIONS
-- ============================================

-- Fonction de health check basique
CREATE OR REPLACE FUNCTION health_check()
RETURNS JSON AS $$
DECLARE
  start_time TIMESTAMPTZ;
  end_time TIMESTAMPTZ;
  response_time INTEGER;
BEGIN
  start_time := clock_timestamp();

  -- Simple query pour tester la connexion
  PERFORM 1;

  end_time := clock_timestamp();
  response_time := EXTRACT(MILLISECONDS FROM (end_time - start_time))::INTEGER;

  RETURN json_build_object(
    'database', 'supabase',
    'status', 'healthy',
    'responseTime', response_time,
    'timestamp', NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION health_check() IS 'Vérifie la santé de la base de données et mesure le temps de réponse';

-- ============================================

-- Fonction pour vérifier la santé de la queue
CREATE OR REPLACE FUNCTION check_queue_health(time_threshold INTEGER DEFAULT 3600)
RETURNS JSON AS $$
DECLARE
  stuck_count INTEGER;
  failed_count INTEGER;
  pending_count INTEGER;
  processing_count INTEGER;
BEGIN
  -- Compter les jobs bloqués (en processing depuis plus de time_threshold secondes)
  SELECT COUNT(*) INTO stuck_count
  FROM jobs
  WHERE status = 'processing'
  AND updated_at < NOW() - (time_threshold || ' seconds')::INTERVAL;

  -- Compter les jobs échoués dans la dernière heure
  SELECT COUNT(*) INTO failed_count
  FROM jobs
  WHERE status = 'failed'
  AND created_at > NOW() - INTERVAL '1 hour';

  -- Compter les jobs en attente
  SELECT COUNT(*) INTO pending_count
  FROM jobs
  WHERE status = 'pending';

  -- Compter les jobs en cours
  SELECT COUNT(*) INTO processing_count
  FROM jobs
  WHERE status = 'processing';

  RETURN json_build_object(
    'stuckJobs', stuck_count,
    'failedJobs', failed_count,
    'pendingJobs', pending_count,
    'processingJobs', processing_count,
    'timestamp', NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION check_queue_health(INTEGER) IS 'Vérifie la santé de la queue de jobs';

-- ============================================

-- Fonction pour obtenir un résumé des erreurs
CREATE OR REPLACE FUNCTION get_error_summary(hours_back INTEGER DEFAULT 1)
RETURNS JSON AS $$
DECLARE
  total_errors INTEGER;
  errors_by_type JSON;
BEGIN
  -- Compter les erreurs totales
  SELECT COUNT(*) INTO total_errors
  FROM error_logs
  WHERE created_at > NOW() - (hours_back || ' hours')::INTERVAL;

  -- Regrouper par type
  SELECT json_object_agg(error_type, count)
  INTO errors_by_type
  FROM (
    SELECT error_type, COUNT(*) as count
    FROM error_logs
    WHERE created_at > NOW() - (hours_back || ' hours')::INTERVAL
    GROUP BY error_type
    ORDER BY count DESC
    LIMIT 10
  ) sub;

  RETURN json_build_object(
    'errorCount', total_errors,
    'errorsByType', COALESCE(errors_by_type, '{}'::json),
    'periodHours', hours_back,
    'timestamp', NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_error_summary(INTEGER) IS 'Retourne un résumé des erreurs sur une période donnée';

-- ============================================

-- Fonction pour obtenir les statistiques de stockage
CREATE OR REPLACE FUNCTION get_storage_stats()
RETURNS JSON AS $$
DECLARE
  total_size BIGINT;
  file_count INTEGER;
  usage_percent NUMERIC;
  storage_limit BIGINT := 107374182400; -- 100GB en bytes par défaut
BEGIN
  -- Cette fonction est un placeholder
  -- Dans un environnement réel, vous devriez interroger l'API Supabase Storage
  -- ou avoir une table qui track l'utilisation du storage

  -- Pour l'instant, retournons des valeurs fictives
  total_size := 0;
  file_count := 0;
  usage_percent := 0;

  RETURN json_build_object(
    'totalSizeBytes', total_size,
    'totalSizeGB', ROUND(total_size / 1073741824.0, 2),
    'fileCount', file_count,
    'usagePercent', usage_percent,
    'limitGB', ROUND(storage_limit / 1073741824.0, 2),
    'timestamp', NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_storage_stats() IS 'Retourne les statistiques d''utilisation du storage';

-- ============================================

-- Fonction pour nettoyer les anciens logs
CREATE OR REPLACE FUNCTION cleanup_old_logs(retention_days INTEGER DEFAULT 30)
RETURNS JSON AS $$
DECLARE
  deleted_health_logs INTEGER;
  deleted_error_logs INTEGER;
BEGIN
  -- Supprimer les anciens health_logs
  DELETE FROM health_logs
  WHERE created_at < NOW() - (retention_days || ' days')::INTERVAL;
  GET DIAGNOSTICS deleted_health_logs = ROW_COUNT;

  -- Supprimer les anciens error_logs
  DELETE FROM error_logs
  WHERE created_at < NOW() - (retention_days || ' days')::INTERVAL;
  GET DIAGNOSTICS deleted_error_logs = ROW_COUNT;

  RETURN json_build_object(
    'deletedHealthLogs', deleted_health_logs,
    'deletedErrorLogs', deleted_error_logs,
    'retentionDays', retention_days,
    'timestamp', NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION cleanup_old_logs(INTEGER) IS 'Nettoie les logs plus anciens que le nombre de jours spécifié';

-- ============================================

-- Fonction pour obtenir les incidents non résolus
CREATE OR REPLACE FUNCTION get_unresolved_incidents()
RETURNS TABLE (
  id UUID,
  timestamp TIMESTAMPTZ,
  status TEXT,
  severity TEXT,
  issues JSONB,
  age_hours NUMERIC,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    hi.id,
    hi.timestamp,
    hi.status,
    hi.severity,
    hi.issues,
    ROUND(EXTRACT(EPOCH FROM (NOW() - hi.created_at)) / 3600, 2) as age_hours,
    hi.created_at
  FROM health_incidents hi
  WHERE hi.resolved_at IS NULL
  ORDER BY hi.severity DESC, hi.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_unresolved_incidents() IS 'Retourne tous les incidents non résolus';

-- ============================================

-- Fonction pour marquer un incident comme résolu
CREATE OR REPLACE FUNCTION resolve_incident(
  incident_id UUID,
  notes TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  incident_record health_incidents%ROWTYPE;
BEGIN
  -- Mettre à jour l'incident
  UPDATE health_incidents
  SET
    resolved_at = NOW(),
    resolution_notes = notes,
    updated_at = NOW()
  WHERE id = incident_id
  AND resolved_at IS NULL
  RETURNING * INTO incident_record;

  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'message', 'Incident non trouvé ou déjà résolu'
    );
  END IF;

  RETURN json_build_object(
    'success', true,
    'message', 'Incident résolu avec succès',
    'incident', row_to_json(incident_record)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION resolve_incident(UUID, TEXT) IS 'Marque un incident comme résolu';

-- ============================================

-- Fonction pour obtenir les statistiques globales
CREATE OR REPLACE FUNCTION get_health_statistics(days_back INTEGER DEFAULT 7)
RETURNS JSON AS $$
DECLARE
  total_checks INTEGER;
  healthy_checks INTEGER;
  degraded_checks INTEGER;
  down_checks INTEGER;
  uptime_percent NUMERIC;
  total_incidents INTEGER;
  avg_resolution_time NUMERIC;
BEGIN
  -- Compter les checks
  SELECT COUNT(*) INTO total_checks
  FROM health_logs
  WHERE created_at > NOW() - (days_back || ' days')::INTERVAL;

  SELECT COUNT(*) INTO healthy_checks
  FROM health_logs
  WHERE created_at > NOW() - (days_back || ' days')::INTERVAL
  AND status = 'healthy';

  SELECT COUNT(*) INTO degraded_checks
  FROM health_logs
  WHERE created_at > NOW() - (days_back || ' days')::INTERVAL
  AND status = 'degraded';

  SELECT COUNT(*) INTO down_checks
  FROM health_logs
  WHERE created_at > NOW() - (days_back || ' days')::INTERVAL
  AND status = 'down';

  -- Calculer l'uptime
  IF total_checks > 0 THEN
    uptime_percent := ROUND((healthy_checks::NUMERIC / total_checks) * 100, 2);
  ELSE
    uptime_percent := 0;
  END IF;

  -- Compter les incidents
  SELECT COUNT(*) INTO total_incidents
  FROM health_incidents
  WHERE created_at > NOW() - (days_back || ' days')::INTERVAL;

  -- Calculer le temps moyen de résolution (en heures)
  SELECT ROUND(AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600), 2)
  INTO avg_resolution_time
  FROM health_incidents
  WHERE created_at > NOW() - (days_back || ' days')::INTERVAL
  AND resolved_at IS NOT NULL;

  RETURN json_build_object(
    'periodDays', days_back,
    'totalChecks', total_checks,
    'healthyChecks', healthy_checks,
    'degradedChecks', degraded_checks,
    'downChecks', down_checks,
    'uptimePercent', uptime_percent,
    'totalIncidents', total_incidents,
    'avgResolutionTimeHours', COALESCE(avg_resolution_time, 0),
    'timestamp', NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_health_statistics(INTEGER) IS 'Retourne les statistiques de santé sur une période donnée';

-- ============================================
-- 3. TRIGGERS
-- ============================================

-- Fonction trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger aux tables
DROP TRIGGER IF EXISTS update_health_logs_updated_at ON health_logs;
CREATE TRIGGER update_health_logs_updated_at
  BEFORE UPDATE ON health_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_health_incidents_updated_at ON health_incidents;
CREATE TRIGGER update_health_incidents_updated_at
  BEFORE UPDATE ON health_incidents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_jobs_updated_at ON jobs;
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. POLITIQUES RLS (Row Level Security)
-- ============================================

-- Activer RLS sur les tables
ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Politique pour health_logs (lecture seule pour tous, écriture pour service role)
CREATE POLICY "Allow read access to health_logs" ON health_logs
  FOR SELECT USING (true);

CREATE POLICY "Allow insert for service role" ON health_logs
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Politique pour health_incidents
CREATE POLICY "Allow read access to health_incidents" ON health_incidents
  FOR SELECT USING (true);

CREATE POLICY "Allow insert for service role on health_incidents" ON health_incidents
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow update for service role on health_incidents" ON health_incidents
  FOR UPDATE USING (auth.role() = 'service_role');

-- Politique pour error_logs
CREATE POLICY "Allow read access to error_logs" ON error_logs
  FOR SELECT USING (true);

CREATE POLICY "Allow insert for service role on error_logs" ON error_logs
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Politique pour jobs
CREATE POLICY "Allow read access to jobs" ON jobs
  FOR SELECT USING (true);

CREATE POLICY "Allow all for service role on jobs" ON jobs
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 5. VUES UTILES
-- ============================================

-- Vue pour le dernier status de santé
CREATE OR REPLACE VIEW latest_health_status AS
SELECT DISTINCT ON (1)
  status,
  metrics,
  services,
  issues_count,
  timestamp,
  created_at
FROM health_logs
ORDER BY 1, created_at DESC;

COMMENT ON VIEW latest_health_status IS 'Dernier status de santé enregistré';

-- Vue pour les incidents actifs
CREATE OR REPLACE VIEW active_incidents AS
SELECT
  id,
  timestamp,
  status,
  severity,
  issues,
  alert_sent,
  ROUND(EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600, 2) as hours_open,
  created_at
FROM health_incidents
WHERE resolved_at IS NULL
ORDER BY severity DESC, created_at DESC;

COMMENT ON VIEW active_incidents IS 'Incidents non résolus';

-- Vue pour les statistiques des dernières 24h
CREATE OR REPLACE VIEW health_stats_24h AS
SELECT
  COUNT(*) as total_checks,
  SUM(CASE WHEN status = 'healthy' THEN 1 ELSE 0 END) as healthy_count,
  SUM(CASE WHEN status = 'degraded' THEN 1 ELSE 0 END) as degraded_count,
  SUM(CASE WHEN status = 'down' THEN 1 ELSE 0 END) as down_count,
  ROUND((SUM(CASE WHEN status = 'healthy' THEN 1 ELSE 0 END)::NUMERIC / COUNT(*)) * 100, 2) as uptime_percent
FROM health_logs
WHERE created_at > NOW() - INTERVAL '24 hours';

COMMENT ON VIEW health_stats_24h IS 'Statistiques de santé des dernières 24 heures';

-- ============================================
-- FIN DU SCRIPT
-- ============================================

-- Afficher un message de confirmation
DO $$
BEGIN
  RAISE NOTICE 'Health Monitor setup completed successfully!';
  RAISE NOTICE 'Tables créées: health_logs, health_incidents, error_logs, jobs';
  RAISE NOTICE 'Fonctions créées: health_check, check_queue_health, get_error_summary, etc.';
  RAISE NOTICE 'Vues créées: latest_health_status, active_incidents, health_stats_24h';
END $$;
