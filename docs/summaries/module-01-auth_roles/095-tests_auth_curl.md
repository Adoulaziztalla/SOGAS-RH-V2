# Tests d'authentification avec cURL

**Date de création :** 2025-09-29  
**Version :** 1.0.0  
**Module :** auth_roles  
**Environnement :** Développement local

---

## Table des matières

1. [Pré-requis](#pré-requis)
2. [Tests positifs](#tests-positifs)
3. [Tests négatifs](#tests-négatifs)
4. [Astuces Postman](#astuces-postman)
5. [Dépannage rapide](#dépannage-rapide)

---

## Pré-requis

Avant d'exécuter les tests, assurez-vous que :

- ✅ Le serveur backend est démarré (`npm run dev` dans le dossier `backend/`)
- ✅ Le serveur écoute sur le port configuré (par défaut `3000`)
- ✅ La base de données contient l'utilisateur admin seed :
  - **Email :** `admin@sogas.local`
  - **Mot de passe :** `Admin@123`
  - **Rôle :** `admin`
- ✅ Les variables d'environnement sont correctement configurées (`.env`)

### Vérification rapide

```bash
# Bash/Linux/macOS
curl http://localhost:3000/health

# Windows PowerShell
curl http://localhost:3000/health
```

Si le serveur répond, vous pouvez procéder aux tests.

---

## Tests positifs

### 1. Connexion (Login)

#### Windows PowerShell

```powershell
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@sogas.local\",\"password\":\"Admin@123\"}"
```

#### Bash/Linux/macOS

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sogas.local","password":"Admin@123"}'
```

#### Réponse attendue (200 OK)

```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    },
    "user": {
      "id": "uuid-here",
      "email": "admin@sogas.local",
      "firstName": "Admin",
      "lastName": "SOGAS",
      "role": "admin",
      "isActive": true
    },
    "sessionId": "session-uuid-here"
  }
}
```

**💡 Important :** Sauvegardez les tokens pour les tests suivants.

---

### 2. Rafraîchissement du token (Refresh)

#### Windows PowerShell

```powershell
curl -X POST http://localhost:3000/api/auth/refresh ^
  -H "Content-Type: application/json" ^
  -d "{\"refreshToken\":\"VOTRE_REFRESH_TOKEN_ICI\"}"
```

#### Bash/Linux/macOS

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"VOTRE_REFRESH_TOKEN_ICI"}'
```

#### Réponse attendue (200 OK)

```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    },
    "sessionId": "session-uuid-here"
  }
}
```

---

### 3. Déconnexion (Logout)

#### Option A : Avec Bearer Token

##### Windows PowerShell

```powershell
curl -X POST http://localhost:3000/api/auth/logout ^
  -H "Authorization: Bearer VOTRE_ACCESS_TOKEN_ICI"
```

##### Bash/Linux/macOS

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer VOTRE_ACCESS_TOKEN_ICI"
```

#### Option B : Avec sessionId dans le body

##### Windows PowerShell

```powershell
curl -X POST http://localhost:3000/api/auth/logout ^
  -H "Content-Type: application/json" ^
  -d "{\"sessionId\":\"VOTRE_SESSION_ID_ICI\"}"
```

##### Bash/Linux/macOS

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"VOTRE_SESSION_ID_ICI"}'
```

#### Réponse attendue (200 OK)

```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

---

## Tests négatifs

### 1. Login avec mauvais mot de passe

#### Windows PowerShell

```powershell
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@sogas.local\",\"password\":\"MauvaisMotDePasse\"}"
```

#### Bash/Linux/macOS

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sogas.local","password":"MauvaisMotDePasse"}'
```

#### Réponse attendue (401 Unauthorized)

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email ou mot de passe incorrect",
    "timestamp": "2025-09-29T10:30:00.000Z"
  }
}
```

---

### 2. Login avec email inexistant

#### Windows PowerShell

```powershell
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"inconnu@example.com\",\"password\":\"Admin@123\"}"
```

#### Bash/Linux/macOS

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"inconnu@example.com","password":"Admin@123"}'
```

#### Réponse attendue (401 Unauthorized)

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email ou mot de passe incorrect",
    "timestamp": "2025-09-29T10:30:00.000Z"
  }
}
```

---

### 3. Refresh avec token expiré

#### Windows PowerShell

```powershell
curl -X POST http://localhost:3000/api/auth/refresh ^
  -H "Content-Type: application/json" ^
  -d "{\"refreshToken\":\"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.EXPIRED_TOKEN\"}"
```

#### Bash/Linux/macOS

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.EXPIRED_TOKEN"}'
```

#### Réponse attendue (401 Unauthorized)

```json
{
  "success": false,
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "Le refresh token a expiré",
    "timestamp": "2025-09-29T10:30:00.000Z"
  }
}
```

---

### 4. Refresh avec token révoqué

#### Windows PowerShell

```powershell
curl -X POST http://localhost:3000/api/auth/refresh ^
  -H "Content-Type: application/json" ^
  -d "{\"refreshToken\":\"VOTRE_TOKEN_DEJA_UTILISE\"}"
```

#### Bash/Linux/macOS

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"VOTRE_TOKEN_DEJA_UTILISE"}'
```

#### Réponse attendue (401 Unauthorized)

```json
{
  "success": false,
  "error": {
    "code": "TOKEN_REVOKED",
    "message": "Le refresh token est invalide ou révoqué",
    "timestamp": "2025-09-29T10:30:00.000Z"
  }
}
```

---

### 5. Logout sans authentification

#### Windows PowerShell

```powershell
curl -X POST http://localhost:3000/api/auth/logout ^
  -H "Content-Type: application/json"
```

#### Bash/Linux/macOS

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Content-Type: application/json"
```

#### Réponse attendue (400 Bad Request)

```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Token d'authentification ou sessionId requis",
    "timestamp": "2025-09-29T10:30:00.000Z"
  }
}
```

---

### 6. Logout avec token invalide

#### Windows PowerShell

```powershell
curl -X POST http://localhost:3000/api/auth/logout ^
  -H "Authorization: Bearer TOKEN_INVALIDE_OU_MALFORMED"
```

#### Bash/Linux/macOS

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer TOKEN_INVALIDE_OU_MALFORMED"
```

#### Réponse attendue (401 Unauthorized)

```json
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Token d'authentification invalide",
    "timestamp": "2025-09-29T10:30:00.000Z"
  }
}
```

---

## Astuces Postman

### Configuration des variables d'environnement

1. **Créer un environnement** (ex: "SOGAS Dev")
2. **Ajouter les variables suivantes :**

| Variable | Valeur initiale | Valeur courante |
|----------|----------------|-----------------|
| `baseUrl` | `http://localhost:3000/api` | `http://localhost:3000/api` |
| `accessToken` | _(vide)_ | _(auto-rempli)_ |
| `refreshToken` | _(vide)_ | _(auto-rempli)_ |
| `sessionId` | _(vide)_ | _(auto-rempli)_ |

### Scripts de test automatiques

#### Pour la requête POST /auth/login

**Onglet "Tests" dans Postman :**

```javascript
// Sauvegarder automatiquement les tokens
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("accessToken", response.data.tokens.accessToken);
    pm.environment.set("refreshToken", response.data.tokens.refreshToken);
    pm.environment.set("sessionId", response.data.sessionId);
    console.log("✅ Tokens sauvegardés");
}
```

#### Pour la requête POST /auth/refresh

**Onglet "Tests" dans Postman :**

```javascript
// Mettre à jour les tokens après refresh
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("accessToken", response.data.tokens.accessToken);
    pm.environment.set("refreshToken", response.data.tokens.refreshToken);
    console.log("✅ Tokens mis à jour");
}
```

### Utilisation du Bearer Token

Pour les requêtes authentifiées :

1. Aller dans l'onglet **Authorization**
2. Choisir **Type : Bearer Token**
3. Dans le champ **Token**, saisir : `{{accessToken}}`

Postman remplacera automatiquement `{{accessToken}}` par la valeur de la variable d'environnement.

### Conseil pour les tests séquentiels

Créer une **Collection** avec l'ordre suivant :

1. 📝 POST Login (sauvegarde les tokens)
2. 🔄 POST Refresh (met à jour les tokens)
3. 🚪 POST Logout (termine la session)

Utiliser **"Run collection"** pour exécuter tous les tests d'un coup.

---

## Dépannage rapide

### Erreur 401 : INVALID_CREDENTIALS

**Cause possible :**
- Mauvais email ou mot de passe
- L'utilisateur n'existe pas dans la base de données
- Le compte utilisateur est désactivé (`isActive: false`)

**Solution :**
1. Vérifier que le seed admin a bien été exécuté : `npm run seed:admin`
2. Vérifier les credentials : `admin@sogas.local` / `Admin@123`
3. Consulter les logs du serveur pour plus de détails

---

### Erreur 401 : TOKEN_EXPIRED

**Cause possible :**
- Le token a dépassé sa durée de validité (15 minutes par défaut pour l'access token)
- L'horloge système est désynchronisée

**Solution :**
1. Utiliser la route `/auth/refresh` pour obtenir un nouveau token
2. Vérifier la configuration `JWT_EXPIRES_IN` dans `.env`

---

### Erreur 401 : TOKEN_REVOKED

**Cause possible :**
- Le refresh token a déjà été utilisé (rotation des tokens)
- La session a été révoquée côté serveur
- Le token appartient à une session expirée ou supprimée

**Solution :**
1. Se reconnecter via `/auth/login` pour obtenir de nouveaux tokens
2. Ne jamais réutiliser un refresh token après l'avoir consommé

---

### Erreur 403 : FORBIDDEN

**Cause possible :**
- L'utilisateur n'a pas les permissions nécessaires pour accéder à la ressource
- Le rôle de l'utilisateur ne correspond pas aux rôles autorisés

**Solution :**
1. Vérifier que l'utilisateur a le bon rôle (admin, manager, user)
2. Consulter la documentation des endpoints pour connaître les rôles requis

---

### Erreur 400 : BAD_REQUEST

**Cause possible :**
- Paramètres manquants dans la requête
- Format JSON invalide
- Données de validation incorrectes

**Solution :**
1. Vérifier que le `Content-Type: application/json` est bien présent
2. Valider la syntaxe JSON (utiliser un validateur en ligne)
3. S'assurer que tous les champs requis sont présents

---

### Erreur de connexion (Cannot connect)

**Cause possible :**
- Le serveur backend n'est pas démarré
- Mauvais port configuré
- Firewall bloquant la connexion

**Solution :**
1. Démarrer le serveur : `npm run dev`
2. Vérifier que le port 3000 est disponible
3. Tester avec : `curl http://localhost:3000/health`

---

### Windows PowerShell : Erreur de syntaxe JSON

**Problème :** PowerShell interprète les guillemets différemment de bash.

**Solution :**
- Utiliser des guillemets doubles (`"`) pour la chaîne JSON
- Échapper les guillemets internes avec un backslash (`\"`)
- Utiliser `^` pour les retours à la ligne au lieu de `\`

**Exemple correct :**
```powershell
curl -X POST http://localhost:3000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@sogas.local\",\"password\":\"Admin@123\"}"
```

---

## Notes supplémentaires

### Sécurité

- ⚠️ Ne jamais commiter les tokens dans le code source ou les fichiers de configuration
- ⚠️ Ne jamais partager vos tokens dans les issues GitHub ou les messages publics
- ⚠️ En production, toujours utiliser HTTPS pour les communications

### Durée de vie des tokens

| Token | Durée par défaut | Configuration |
|-------|------------------|---------------|
| Access Token | 15 minutes | `JWT_EXPIRES_IN=15m` |
| Refresh Token | 7 jours | `JWT_REFRESH_EXPIRES_IN=7d` |

### Workflow recommandé

1. **Login** → Obtenir les tokens initiaux
2. **Utiliser l'access token** → Pour toutes les requêtes authentifiées
3. **Refresh** → Quand l'access token expire (avant de recevoir 401)
4. **Logout** → À la fin de la session utilisateur

---

**Dernière mise à jour :** 2025-09-29  
**Auteur :** Équipe SOGAS  
**Statut :** ✅ Validé