# NFLIX Health Monitor Workflow

## Description

Ce workflow n8n surveille automatiquement la santé de l'ensemble de l'infrastructure NFLIX toutes les 5 minutes.

## Fonctionnalités

### 1. Surveillance de la Base de Données
- Ping Supabase pour vérifier la disponibilité
- Mesure du temps de réponse
- Alerte si le temps de réponse > 3 secondes

### 2. Surveillance des APIs Externes
- **OpenAI**: Vérification de l'endpoint `/v1/models`
- **Anthropic**: Vérification de l'API Claude
- **Shotstack**: Vérification du service de montage vidéo
- **Resend**: Vérification du service d'email

### 3. Surveillance de la Queue de Jobs
- Détection des jobs bloqués (en traitement depuis > 1 heure)
- Comptage des jobs échoués
- Alertes si plus de 10 jobs échoués

### 4. Surveillance du Stockage
- Vérification de l'utilisation du stockage Supabase
- Alerte si utilisation > 80%
- Alerte critique si > 90%

### 5. Surveillance des Erreurs
- Comptage des erreurs de la dernière heure
- Regroupement par type d'erreur
- Alertes si > 10 erreurs/heure

### 6. Système d'Alertes
En cas de problème détecté:
- **Telegram**: Message d'alerte immédiat
- **Email**: Rapport détaillé HTML
- **Database**: Enregistrement de l'incident pour analyse

## Variables d'Environnement Requises

```env
# Supabase
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_KEY=votre_service_key

# APIs Externes
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
SHOTSTACK_API_KEY=votre_shotstack_key
RESEND_API_KEY=re_...

# Alertes
TELEGRAM_ALERT_CHAT_ID=votre_chat_id
ALERT_FROM_EMAIL=alerts@nflix.app
ALERT_TO_EMAIL=team@nflix.app
```

## Configuration n8n

### Credentials Requises

1. **Telegram Bot**
   - Créer un bot via @BotFather sur Telegram
   - Obtenir le token du bot
   - Ajouter les credentials dans n8n

2. **SMTP Account**
   - Configurer un compte SMTP (Gmail, SendGrid, etc.)
   - Ajouter les credentials dans n8n

### Installation du Workflow

1. Ouvrir n8n
2. Cliquer sur "Import from File"
3. Sélectionner `health-monitor.json`
4. Configurer les credentials
5. Vérifier les variables d'environnement
6. Activer le workflow

## Structure des Tables Supabase

Le workflow nécessite les tables suivantes:

### health_logs
```sql
CREATE TABLE health_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL,
  metrics JSONB,
  services JSONB,
  issues_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_health_logs_timestamp ON health_logs(timestamp DESC);
CREATE INDEX idx_health_logs_status ON health_logs(status);
```

### health_incidents
```sql
CREATE TABLE health_incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMPTZ,
  status TEXT NOT NULL,
  issues JSONB,
  metrics JSONB,
  services JSONB,
  alert_sent BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_health_incidents_timestamp ON health_incidents(timestamp DESC);
CREATE INDEX idx_health_incidents_status ON health_incidents(status);
CREATE INDEX idx_health_incidents_resolved ON health_incidents(resolved_at);
```

## Fonctions PostgreSQL Requises

### check_queue_health
```sql
CREATE OR REPLACE FUNCTION check_queue_health(time_threshold INTEGER)
RETURNS JSON AS $$
DECLARE
  stuck_count INTEGER;
  failed_count INTEGER;
BEGIN
  -- Compter les jobs bloqués
  SELECT COUNT(*) INTO stuck_count
  FROM jobs
  WHERE status = 'processing'
  AND updated_at < NOW() - (time_threshold || ' seconds')::INTERVAL;

  -- Compter les jobs échoués
  SELECT COUNT(*) INTO failed_count
  FROM jobs
  WHERE status = 'failed'
  AND created_at > NOW() - INTERVAL '1 hour';

  RETURN json_build_object(
    'stuckJobs', stuck_count,
    'failedJobs', failed_count
  );
END;
$$ LANGUAGE plpgsql;
```

### get_error_summary
```sql
CREATE OR REPLACE FUNCTION get_error_summary(hours_back INTEGER)
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
  ) sub;

  RETURN json_build_object(
    'errorCount', total_errors,
    'errorsByType', COALESCE(errors_by_type, '{}'::json)
  );
END;
$$ LANGUAGE plpgsql;
```

### health_check
```sql
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
    'responseTime', response_time
  );
END;
$$ LANGUAGE plpgsql;
```

## Statuts du Système

Le workflow génère trois niveaux de statut:

- **healthy**: Tous les services fonctionnent normalement
- **degraded**: Certains services sont lents ou ont des problèmes mineurs
- **down**: Un ou plusieurs services critiques sont hors ligne

## Métriques Surveillées

1. **Database Response Time**
   - healthy: < 1000ms
   - degraded: 1000-3000ms
   - down: > 3000ms

2. **API Status Codes**
   - healthy: 200-299
   - degraded: 400-499
   - down: 500-599 ou timeout

3. **Queue Health**
   - healthy: 0 stuck jobs, < 10 failed jobs
   - degraded: 0 stuck jobs, 10-50 failed jobs
   - down: > 0 stuck jobs ou > 50 failed jobs

4. **Storage Usage**
   - healthy: < 80%
   - degraded: 80-90%
   - critical: > 90%

5. **Error Rate**
   - healthy: < 10 errors/hour
   - degraded: 10-50 errors/hour
   - critical: > 50 errors/hour

## Format des Alertes

### Telegram
```
🚨 NFLIX Health Alert

Status: DEGRADED
Time: 2025-10-21T12:00:00Z

Issues:
1. Database response time is slow
2. 15 failed jobs detected

Services Summary:
✅ Healthy: 4
⚠️ Degraded: 1
❌ Down: 0

Metrics:
- Queue: 0 stuck, 15 failed
- Storage: 65%
- Errors (1h): 8
```

### Email
Rapport HTML détaillé avec:
- Statut global coloré
- Liste des problèmes détectés
- Résumé des services
- Métriques complètes
- Timestamp de génération

## Personnalisation

### Modifier la Fréquence
Dans le node "Schedule Trigger", modifier le paramètre `minutesInterval` (défaut: 5 minutes)

### Ajouter d'Autres Services
1. Dupliquer le node "Check APIs"
2. Ajouter votre logique de vérification
3. Connecter au node "Generate Report"
4. Mettre à jour la logique du rapport

### Modifier les Seuils d'Alerte
Éditer le node "Generate Report" et ajuster les conditions dans le code JavaScript

## Troubleshooting

### Le workflow ne s'exécute pas
- Vérifier que le workflow est activé
- Vérifier les credentials n8n
- Vérifier les variables d'environnement

### Pas d'alertes reçues
- Vérifier les credentials Telegram/SMTP
- Vérifier les IDs de chat/emails
- Vérifier les logs du workflow dans n8n

### Erreurs de connexion
- Vérifier que les URLs Supabase sont correctes
- Vérifier que les clés API sont valides
- Vérifier la connectivité réseau de n8n

## Monitoring du Workflow

Pour surveiller le workflow lui-même:
1. Consulter l'historique d'exécution dans n8n
2. Vérifier la table `health_logs` pour l'historique
3. Analyser les incidents dans `health_incidents`

## Dashboard Recommandé

Créer un dashboard Grafana/Metabase avec:
- Graphique de disponibilité globale (%)
- Temps de réponse database (ligne)
- Nombre d'incidents par jour (bar)
- Status des services (table)
- Alertes actives (liste)

## Maintenance

### Nettoyage des Logs
```sql
-- Garder seulement 30 jours de logs
DELETE FROM health_logs
WHERE created_at < NOW() - INTERVAL '30 days';

-- Garder tous les incidents mais archiver les anciens
UPDATE health_incidents
SET archived = true
WHERE created_at < NOW() - INTERVAL '90 days';
```

### Optimisation
- Ajuster la fréquence selon les besoins
- Désactiver certains checks si non nécessaires
- Implémenter un cache pour réduire la charge

## Support

Pour toute question ou problème:
1. Consulter les logs n8n
2. Vérifier la documentation Supabase
3. Contacter l'équipe technique

## Version

- Version: 1.0.0
- Dernière mise à jour: 2025-10-21
- Auteur: NFLIX Team
