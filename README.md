# API REST TSOA + Prisma
REST API built with TypeScript, TSOA and Prisma, featuring JWT authentication and email verification.

## 📚 Documentation

#### Setup

- [English](#setup)
- [French](#installation)

#### Endpoints

- [English](#endpoints-1)
- [French](#endpoints-2)

## Setup 

### 1. Clone the repository : 

```bash
git clone git@github.com:louis1131/api-tsoa-prisma.git
cd api-tsoa-prisma
```

---

### 2. Install dependencies :

```bash
yarn install
```

---

### 3. Create file `.env` :

```bash
cp .env.example .env
# or
touch .env
```

- Minimal example :
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/db_name
JWT_SECRET="secret_key1"

## NODEMAILER
JWT_SECRET_EMAIL="secret_key2"
GOOGLE_MAIL="user@gmail.com"
GOOGLE_APP_PASSWORD="google_app_password"
EMAIL_VERIFICATION_URL="http://your-api.com/auth/verify-email?token="
```

- Infos
    - This example uses Gmail SMTP for sending emails.

    - Environment variables are named accordingly to match the Gmail SMTP   configuration.

        - You can rename them if you wish, **but remember** to check their **usage** in the **corresponding files**.

    - GOOGLE_APP_PASSWORD must be a Google App Password, not your Gmail account password.

    - EMAIL_VERIFICATION_URL is used to build the email verification link sent to users.

---

### 4. Run the API :

#### Development

```bash
yarn prisma migrate dev
yarn dev
```

- Applies migrations
- Generates Prisma client
- Runs database seed
- Automatically regenerates TSOA routes
- Starts the API with hot reload

#### Production 

```
yarn prepare-prod
yarn start
```

- Generates Prisma client
- Applies migrations
- Runs database seed
- Generates TSOA routes
- Builds the application
- Starts the compiled server

### Notes

- In development, TSOA routes are regenerated automatically via `yarn dev`.
- In production, `prepare-prod` handles everything before starting the server.

### Test the API

After starting the API, you can access the interactive Swagger documentation at this URL :

``http://localhost:3000/docs``

- You can test queries directly from the interface.

### Endpoints

#### Authentication

```
POST | auth/register
```

```
POST | auth/login
```

```
GET | auth/verify-email
```

#### User management

- Accessible only to administrators

```
GET | users
```

```
GET | users/{userId}
```

```
PATCH | users/{userId}
```

```
DELETE | users/{userId}
```

- Accessible to all users

```
GET | users/me
```

```
PATCH | users/me
```

#### Private

```
GET | private
```

# Installation

### 1. Cloner le dépôt : 

```bash
git clone git@github.com:louis1131/api-tsoa-prisma.git
cd api-tsoa-prisma
```

---

### 2. Installer les dépendances :

```bash
yarn install
```

---

### 3. Créer le fichier `.env` :

```bash
cp .env.example .env
# or
touch .env
```

- Exemple minimal :
```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/db_name
JWT_SECRET="secret_key1"

## NODEMAILER
JWT_SECRET_EMAIL="secret_key2"
GOOGLE_MAIL="user@gmail.com"
GOOGLE_APP_PASSWORD="google_app_password"
EMAIL_VERIFICATION_URL="http://your-api.com/auth/verify-email?token="
```

- Infos
    - Cet exemple utilise le SMTP Gmail pour envoyer des e-mails.

    - Les variables d'environnement sont nommées de manière à correspondre à la configuration SMTP de Gmail.
        - Vous pouvez les renommer si vous le souhaitez, mais **n'oubliez pas** de vérifier leur **utilisation** dans les **fichiers correspondants**.

    - GOOGLE_APP_PASSWORD doit être un mot de passe d'application google, et non le mot de passe de votre compte Gmail.

    - EMAIL_VERIFICATION_URL est utilisé pour créer le lien de vérification par e-mail envoyé aux utilisateurs.

---

### 4. Exécutez l'API :

#### Développement

```bash
yarn prisma migrate dev
yarn dev
```

- Applique les migrations
- Génère le client Prisma
- Exécute l'initialisation de la base de données
- Régénère automatiquement les routes TSOA
- Démarre l'API avec rechargement à chaud

#### Production 

```
yarn prepare-prod
yarn start
```

- Génère le client Prisma
- Applique les migrations
- Exécute l'initialisation de la base de données
- Génère les routes TSOA
- Compile l'application
- Démarre le serveur compilé

### Notes

- En développement, les routes TSOA sont régénérées automatiquement via `yarn dev`.
- En production, `prepare-prod` gère tout avant de démarrer le serveur.

### Tester l'API

Après avoir démarré l'API, vous pouvez accéder à la documentation interactive Swagger à l'adresse suivante :

``http://localhost:3000/docs``

- Vous pouvez tester les requêtes directement depuis l'interface.

### Endpoints

#### Authentificiation

```
POST | auth/register
```

```
POST | auth/login
```

```
GET | auth/verify-email
```

#### Gestion des utilisateurs

- Accessible uniquement aux administrateurs

```
GET | users
```

```
GET | users/{userId}
```

```
PATCH | users/{userId}
```

```
DELETE | users/{userId}
```

- Accessible à tous les utilisateurs

```
GET | users/me
```

```
PATCH | users/me
```

#### Privée

```
GET | private
```

