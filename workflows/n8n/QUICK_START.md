# Guide de Démarrage Rapide - Health Monitor

## Installation en 5 minutes

### Étape 1: Configuration de la Base de Données

```bash
# Connectez-vous à votre projet Supabase et exécutez:
psql -h db.xxx.supabase.co -U postgres -d postgres < setup.sql
```

Ou via l'interface Supabase:
1. Ouvrez le SQL Editor
2. Copiez le contenu de `setup.sql`
3. Exécutez le script

### Étape 2: Configuration de n8n

#### Option A: n8n Cloud
1. Connectez-vous à [n8n.cloud](https://n8n.cloud)
2. Allez dans **Settings** > **Environment Variables**
3. Ajoutez toutes les variables du fichier `.env.example`

#### Option B: n8n Self-Hosted
```bash
# Ajoutez les variables dans votre docker-compose.yml
environment:
  - SUPABASE_URL=https://...
  - SUPABASE_ANON_KEY=...
  # ... etc
```

### Étape 3: Import du Workflow

1. Dans n8n, cliquez sur **Workflows** > **Add Workflow**
2. Cliquez sur **Import from File**
3. Sélectionnez `health-monitor.json`
4. Le workflow est importé!

### Étape 4: Configuration des Credentials

#### Telegram Bot
1. Credentials > Add Credential > Telegram
2. Name: `Telegram Bot`
3. Access Token: votre token de @BotFather
4. Save

#### SMTP Account
1. Credentials > Add Credential > SMTP
2. Name: `SMTP Account`
3. Configurez avec vos paramètres SMTP
4. Test Connection
5. Save

### Étape 5: Test & Activation

```bash
# Dans n8n:
1. Ouvrez le workflow "Health Monitor Workflow"
2. Cliquez sur "Execute Workflow" (mode test)
3. Vérifiez que tous les nodes s'exécutent correctement
4. Si OK, cliquez sur "Active" en haut à droite
```

## Vérification de l'Installation

### Test 1: Vérifier la Base de Données

```sql
-- Vérifier que les tables existent
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('health_logs', 'health_incidents', 'error_logs', 'jobs');

-- Tester les fonctions
SELECT health_check();
SELECT check_queue_health();
SELECT get_error_summary(1);
```

### Test 2: Vérifier les Variables d'Environnement

Dans n8n, créez un nouveau workflow temporaire avec un node Code:
```javascript
return {
  json: {
    supabase: !!process.env.SUPABASE_URL,
    openai: !!process.env.OPENAI_API_KEY,
    telegram: !!process.env.TELEGRAM_ALERT_CHAT_ID,
    // Vérifiez toutes vos variables
  }
};
```

### Test 3: Tester Telegram

Envoyez un message test:
```javascript
// Dans n8n, node Telegram
chatId: process.env.TELEGRAM_ALERT_CHAT_ID
text: "🧪 Test du Health Monitor - Installation réussie!"
```

### Test 4: Tester l'Email

Envoyez un email test via le node Email Send.

## Fréquence d'Exécution

Le workflow est configuré pour s'exécuter **toutes les 5 minutes**.

Pour modifier:
1. Ouvrez le workflow
2. Cliquez sur le node "Schedule Trigger"
3. Modifiez "Minutes Interval"
4. Save

## Premiers Pas Après Installation

### 1. Vérifier les Logs

```sql
-- Voir les derniers health checks
SELECT * FROM health_logs
ORDER BY created_at DESC
LIMIT 10;

-- Voir les incidents
SELECT * FROM health_incidents
WHERE resolved_at IS NULL;
```

### 2. Configurer les Seuils

Éditez le node "Generate Report" pour ajuster:
- Seuils de temps de réponse database
- Nombre de jobs échoués avant alerte
- Pourcentage d'utilisation storage
- Nombre d'erreurs avant alerte

### 3. Personnaliser les Alertes

Modifiez les templates dans:
- **Send Telegram Alert**: Format du message
- **Send Email Alert**: Template HTML

### 4. Ajouter des Checks Personnalisés

Dupliquez un node de check existant et ajoutez votre logique.

## Dépannage Rapide

### ❌ Le workflow ne s'exécute pas

**Solutions:**
- Vérifier que le workflow est activé (toggle "Active")
- Vérifier les logs d'exécution dans n8n
- Vérifier que le schedule trigger est correctement configuré

### ❌ Erreur "Database connection failed"

**Solutions:**
- Vérifier `SUPABASE_URL` et `SUPABASE_ANON_KEY`
- Vérifier que le projet Supabase est actif
- Vérifier les politiques RLS

### ❌ Pas d'alertes reçues

**Solutions:**
- Vérifier les credentials Telegram/SMTP
- Vérifier `TELEGRAM_ALERT_CHAT_ID`
- Tester les nodes individuellement (Execute Node)
- Vérifier que le node "If Issues Detected" fonctionne

### ❌ Erreur "Function does not exist"

**Solutions:**
- Réexécuter le script `setup.sql`
- Vérifier les permissions de la fonction
- Vérifier la syntaxe PostgreSQL

### ❌ Erreur API (OpenAI, Anthropic, etc.)

**Solutions:**
- Vérifier que les clés API sont valides
- Vérifier les quotas/limites
- Vérifier la connectivité réseau de n8n

## Commandes Utiles

### Vérifier le Status du Système

```sql
-- Status actuel
SELECT * FROM latest_health_status;

-- Statistiques 24h
SELECT * FROM health_stats_24h;

-- Incidents actifs
SELECT * FROM active_incidents;

-- Statistiques 7 jours
SELECT get_health_statistics(7);
```

### Résoudre un Incident

```sql
-- Marquer un incident comme résolu
SELECT resolve_incident(
  'incident_id_here'::UUID,
  'Problème résolu: redémarrage du service'
);
```

### Nettoyer les Anciens Logs

```sql
-- Garder seulement 30 jours
SELECT cleanup_old_logs(30);
```

## Monitoring du Workflow

### Dans n8n

1. **Executions**: Voir l'historique des exécutions
2. **Logs**: Consulter les logs détaillés
3. **Settings** > **Error Workflow**: Configurer un workflow de gestion d'erreurs

### Dans Supabase

1. **Table Editor**: Consulter les tables
2. **SQL Editor**: Exécuter des requêtes
3. **API Logs**: Voir les appels API

## Optimisations Recommandées

### 1. Cache Redis (optionnel)

Pour réduire la charge, ajoutez un cache Redis:
```javascript
// Dans le node Generate Report
const cacheKey = 'health_report';
// Vérifier le cache avant de générer
```

### 2. Alertes Intelligentes

Évitez le spam d'alertes:
```javascript
// Vérifier si une alerte a été envoyée récemment
const lastAlert = await getLastAlert();
if (Date.now() - lastAlert < 300000) { // 5 minutes
  return; // Ne pas envoyer
}
```

### 3. Métriques Détaillées

Ajoutez plus de métriques:
- Temps de réponse API par endpoint
- Taux de succès des jobs par type
- Distribution géographique des erreurs

## Dashboard Recommandé

### Option 1: Grafana

Connectez Grafana à Supabase et créez des dashboards avec:
- Graphique de ligne: uptime %
- Jauge: utilisation storage
- Table: services status
- Alerte: incidents actifs

### Option 2: Metabase

Connectez Metabase et créez:
- Question: "Uptime last 7 days"
- Dashboard: "System Health"
- Alert: "When incidents > 0"

### Option 3: Superset

Pour des visualisations avancées.

## Alertes Avancées

### Webhook Slack

Ajoutez un node HTTP Request:
```javascript
{
  "url": "https://hooks.slack.com/services/...",
  "method": "POST",
  "body": {
    "text": "🚨 Health Alert",
    "blocks": [...]
  }
}
```

### PagerDuty

Pour des alertes on-call critiques.

### SMS via Twilio

Pour les incidents critiques.

## Maintenance

### Hebdomadaire
- Vérifier les incidents résolus
- Analyser les tendances
- Ajuster les seuils si nécessaire

### Mensuel
- Nettoyer les anciens logs
- Vérifier les credentials expirés
- Mettre à jour la documentation

### Trimestriel
- Review complète du système
- Optimisation des seuils
- Ajout de nouveaux checks

## Support

**Documentation complète**: Voir `README.md`

**En cas de problème**:
1. Vérifier les logs n8n
2. Vérifier les logs Supabase
3. Consulter la documentation
4. Contacter l'équipe technique

## Ressources

- [n8n Documentation](https://docs.n8n.io)
- [Supabase Documentation](https://supabase.com/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Félicitations!** Votre système de monitoring est opérationnel. 🎉

Pour toute question, consultez le README.md ou contactez l'équipe.
