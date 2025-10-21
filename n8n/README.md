# N8N Workflows - NFLIX

Ce dossier contient les workflows N8N pour l'application NFLIX.

## Workflows Disponibles

### 1. Module_Router_Main

**Type:** Workflow classique (pas d'IA)

**Description:** Workflow principal qui gère le routing des nouveaux projets vidéo, la validation des données, la vérification des crédits et l'ajout en file d'attente.

#### URL du Webhook
```
https://n8n.nflix.io/webhook/new-project
```

#### Architecture du Workflow

```
Webhook_Receiver
    ↓
Data_Validator
    ↓ (valid)           ↓ (invalid)
Save_To_Database    Error_Invalid_Data
    ↓
Check_Credits
    ↓
Credits_Validator
    ↓ (sufficient)      ↓ (insufficient)
Route_By_Action     Error_Insufficient_Credits
    ↓
    ├── create_scenario → Queue_Scenario
    ├── upload_complete → Queue_Montage
    └── request_revision → Queue_Revision
            ↓
    Return_Response
```

#### Nodes Détaillés

1. **Webhook_Receiver**
   - Type: Webhook
   - Method: POST
   - Path: `/webhook/new-project`
   - Response: Immédiate via node de réponse

2. **Data_Validator**
   - Type: IF (Condition)
   - Vérifie la présence des champs requis:
     - `brief`
     - `genre`
     - `duration`
     - `tier`
     - `user_id`
   - En cas d'échec → `Error_Invalid_Data`

3. **Save_To_Database**
   - Type: HTTP Request
   - Method: POST
   - Endpoint: `${DATABASE_API_URL}/projects`
   - Sauvegarde le projet avec status='pending'
   - Retourne: `project_id`

4. **Check_Credits**
   - Type: HTTP Request
   - Method: GET
   - Endpoint: `${DATABASE_API_URL}/users/{user_id}/credits`
   - Récupère le solde de crédits de l'utilisateur

5. **Credits_Validator**
   - Type: IF (Condition)
   - Vérifie: `credits_balance >= credits_required`
   - En cas d'échec → `Error_Insufficient_Credits`

6. **Route_By_Action**
   - Type: Switch
   - Route selon le champ `action`:
     - `create_scenario` → Queue_Scenario
     - `upload_complete` → Queue_Montage
     - `request_revision` → Queue_Revision

7. **Queue_Scenario / Queue_Montage / Queue_Revision**
   - Type: HTTP Request
   - Method: POST
   - Endpoint: `${DATABASE_API_URL}/queue`
   - Ajoute à la table `queue_management`
   - Priority:
     - Premium: 1
     - Normal: 5

8. **Return_Response**
   - Type: Respond to Webhook
   - Format: JSON
   - Retourne:
     - `status`: 'queued'
     - `project_id`: ID du projet créé
     - `estimated_time`: Temps estimé selon tier

9. **Error_Invalid_Data**
   - Type: Respond to Webhook
   - Status Code: 400
   - Retourne un message d'erreur de validation

10. **Error_Insufficient_Credits**
    - Type: Respond to Webhook
    - Status Code: 402
    - Retourne un message d'erreur de crédits insuffisants

#### Format de Requête

```json
{
  "brief": "Description du projet vidéo",
  "genre": "action|comédie|drame|...",
  "duration": "30s|60s|90s",
  "tier": "Premium|Normal",
  "user_id": "user_123",
  "action": "create_scenario|upload_complete|request_revision",
  "email": "user@example.com",
  "cultural_references": ["ref1", "ref2"]
}
```

#### Format de Réponse (Succès)

```json
{
  "status": "queued",
  "project_id": "proj_xyz789",
  "queue_type": "scenario|montage|revision",
  "estimated_time": "5-10 minutes|15-30 minutes",
  "message": "Votre projet a été ajouté à la file d'attente avec succès"
}
```

#### Format de Réponse (Erreur - Données Invalides)

```json
{
  "status": "error",
  "error": "Invalid request data",
  "message": "Les champs requis sont manquants: brief, genre, duration, tier, user_id",
  "received_data": { ... }
}
```

#### Format de Réponse (Erreur - Crédits Insuffisants)

```json
{
  "status": "error",
  "error": "Insufficient credits",
  "message": "Solde de crédits insuffisant pour cette opération",
  "current_balance": 10,
  "required_credits": 50
}
```

## Installation

### 1. Importer le Workflow dans N8N

1. Connectez-vous à votre instance N8N
2. Allez dans **Workflows** → **Add Workflow** → **Import from File**
3. Sélectionnez le fichier `workflows/Module_Router_Main.json`
4. Le workflow sera importé avec tous les nodes configurés

### 2. Configuration des Variables d'Environnement

Dans votre instance N8N, configurez les variables d'environnement suivantes:

```bash
DATABASE_API_URL=https://api.nflix.io/v1
```

### 3. Configuration des Credentials

Le workflow utilise `httpHeaderAuth` pour l'authentification avec l'API de base de données.

1. Allez dans **Settings** → **Credentials**
2. Créez une nouvelle credential de type **Header Auth**
3. Configurez:
   - Name: `Database API Auth`
   - Header Name: `Authorization`
   - Header Value: `Bearer YOUR_API_TOKEN`

### 4. Activation du Workflow

1. Ouvrez le workflow `Module_Router_Main`
2. Cliquez sur **Active** pour activer le webhook
3. Le webhook sera disponible à l'URL: `https://n8n.nflix.io/webhook/new-project`

## Prérequis Base de Données

### Table: projects

```sql
CREATE TABLE projects (
  project_id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  brief TEXT NOT NULL,
  genre VARCHAR(100) NOT NULL,
  duration VARCHAR(10) NOT NULL,
  tier VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  email VARCHAR(255),
  cultural_references JSON,
  credits_required INT DEFAULT 50,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Table: queue_management

```sql
CREATE TABLE queue_management (
  queue_id VARCHAR(255) PRIMARY KEY,
  project_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  queue_type VARCHAR(50) NOT NULL,
  priority INT NOT NULL,
  status VARCHAR(50) DEFAULT 'queued',
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(project_id)
);
```

### Table: users (credits)

```sql
-- Ajouter une colonne credits_balance à la table users existante
ALTER TABLE users ADD COLUMN credits_balance INT DEFAULT 100;
```

## API Endpoints Requis

Le workflow s'attend à ce que les endpoints API suivants soient disponibles:

### 1. Créer un Projet

```
POST ${DATABASE_API_URL}/projects
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

Body: {
  "brief": "...",
  "genre": "...",
  "duration": "...",
  "tier": "...",
  "user_id": "...",
  "status": "pending",
  "cultural_references": [...],
  "email": "..."
}

Response: {
  "project_id": "proj_xyz",
  "credits_required": 50,
  ...
}
```

### 2. Vérifier les Crédits

```
GET ${DATABASE_API_URL}/users/{user_id}/credits
Authorization: Bearer YOUR_TOKEN

Response: {
  "user_id": "...",
  "credits_balance": 100
}
```

### 3. Ajouter à la File d'Attente

```
POST ${DATABASE_API_URL}/queue
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

Body: {
  "project_id": "...",
  "queue_type": "scenario|montage|revision",
  "priority": 1-5,
  "user_id": "...",
  "status": "queued",
  "metadata": "{...}"
}

Response: {
  "queue_id": "queue_abc",
  ...
}
```

## Testing

### Test avec cURL

```bash
curl -X POST https://n8n.nflix.io/webhook/new-project \
  -H "Content-Type: application/json" \
  -d '{
    "brief": "Vidéo de démonstration d'\''une nouvelle fonctionnalité",
    "genre": "tech",
    "duration": "60s",
    "tier": "Premium",
    "user_id": "user_123",
    "action": "create_scenario",
    "email": "user@example.com",
    "cultural_references": ["Silicon Valley", "The Social Network"]
  }'
```

### Test avec Postman

1. Créez une nouvelle requête POST
2. URL: `https://n8n.nflix.io/webhook/new-project`
3. Headers:
   - `Content-Type`: `application/json`
4. Body (raw JSON):
   ```json
   {
     "brief": "Test vidéo",
     "genre": "comédie",
     "duration": "30s",
     "tier": "Normal",
     "user_id": "user_456",
     "action": "create_scenario",
     "email": "test@example.com",
     "cultural_references": ["The Office"]
   }
   ```

## Monitoring et Logs

Dans N8N:
- **Executions** → Voir l'historique de toutes les exécutions
- Filtrer par status (success, error, waiting)
- Inspecter les données à chaque étape du workflow

## Troubleshooting

### Erreur: "Invalid request data"
- Vérifiez que tous les champs requis sont présents
- Vérifiez le format JSON

### Erreur: "Insufficient credits"
- L'utilisateur n'a pas assez de crédits
- Vérifiez le solde dans la base de données

### Erreur: Database connection failed
- Vérifiez la variable `DATABASE_API_URL`
- Vérifiez les credentials d'authentification
- Vérifiez que l'API est accessible

### Webhook ne répond pas
- Vérifiez que le workflow est **activé**
- Vérifiez l'URL du webhook
- Vérifiez les logs N8N

## Support

Pour toute question ou problème, contactez l'équipe technique NFLIX.
