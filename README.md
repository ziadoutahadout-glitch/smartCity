# 🏙️ SMARTCity — Centre de Recherche Smart City

A full-stack web platform for the **Centre de Recherche Smart City**, built with Node.js, Express, EJS and MySQL. It features a dynamic public-facing website and a complete admin panel for managing projects, events, publications, formations, and site settings.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Database Setup](#-database-setup)
- [Running the App](#-running-the-app)
- [Usage](#-usage)
- [Environment Variables](#-environment-variables)

---

## ✨ Features

### Public Website
- **Dynamic Hero Slider** — Admin-configurable homepage hook slides highlighting projects, events, publications or formations.
- **Key Figures Section** — Animated counters (e.g. projects count, partners count) managed from the admin panel.
- **Dedicated Pages** — Projects, Events, Publications, Formations, Research Axes, About Us.
- **SPA-like Navigation** — AJAX-powered page transitions with smooth animations.
- **Fully Responsive** — Works on desktop, tablet and mobile.

### Admin Panel (`/admin`)
- **Dashboard** — Overview of all content counts.
- **CRUD Operations** — Add and delete Projects, Events, Publications and Formations directly from the admin interface (data stored in MySQL).
- **Homepage Selection** — Choose which items to feature on the homepage hero slider (up to 4 slots).
- **Key Figures** — Edit the animated counters displayed on the public site.
- **Site Settings** — Manage site name, contact info, director info, and section content.
- **Delete Confirmation** — All deletions trigger a native browser confirmation dialog to prevent accidental data loss.

### Architecture
- **Repository Pattern** — Database-agnostic controllers. Switching from MySQL to PostgreSQL or MongoDB only requires updating the repository files, not the controllers.
- **MVC Structure** — Clean separation of Models, Views, Controllers and Repositories.

---

## 🛠️ Tech Stack

| Layer        | Technology                     |
|--------------|--------------------------------|
| Runtime      | Node.js                        |
| Framework    | Express 5                      |
| Templating   | EJS + express-ejs-layouts       |
| Database     | MySQL (via mysql2)              |
| Env Config   | dotenv                         |
| Frontend     | Vanilla CSS + JS (no framework) |

---

## 📁 Project Structure

```
SMARTCity/
├── config/
│   └── db.js                  # MySQL connection pool
├── controllers/
│   ├── adminController.js     # Admin panel logic
│   └── publicController.js    # Public pages logic
├── models/                    # JSON config files (settings, slides, etc.)
├── repositories/              # Database abstraction layer (Repository Pattern)
│   ├── ProjectRepository.js
│   ├── EventRepository.js
│   ├── PublicationRepository.js
│   └── FormationRepository.js
├── routes/
│   ├── admin.js               # Admin routes (/admin/*)
│   └── public.js              # Public routes (/, /projets, etc.)
├── services/
│   └── uploadService.js       # File upload abstraction (multer)
├── views/
│   ├── admin/                 # Admin panel views
│   ├── layouts/               # EJS layout templates
│   ├── partials/              # Reusable UI components
│   └── public/                # Public page views
├── public/
│   ├── css/                   # Stylesheets
│   └── js/                    # Client-side JavaScript
├── init-db.js                 # Database initialization & seed script
├── server.js                  # App entry point
├── .env                       # Environment variables (not tracked)
├── .gitignore
└── package.json
```

---

## 📦 Prerequisites

Make sure you have the following installed on your machine:

1. **Node.js** (v18 or higher) — [Download](https://nodejs.org/)
2. **MySQL Server** (v8.0+) — [Download](https://dev.mysql.com/downloads/mysql/)
   - Make sure the MySQL service is **running** before proceeding.

---

## 🚀 Installation & Setup

### 1. Installation en local

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/votre-user/smartCity.git
   ```
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Configurer les variables d'environnement (`.env`) :
   ```env
   PORT=3002
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=0000
   DB_NAME=smartcity
   GOOGLE_DRIVE_FOLDER_ID="VOTRE_ID_DE_DOSSIER_ICI"
   GOOGLE_APPLICATION_CREDENTIALS="./credentials.json"
   ```

### 🔐 Configuration de l'Upload Google Drive (Important)

L'application envoie automatiquement les fichiers uploadés (images, PDF) sur Google Drive.
Pour cela, vous devez configurer un "Compte de Service" (Service Account) Google Cloud :

**Étape 1 : Créer le Compte de Service (Le serveur)**
1. Allez sur la [Google Cloud Console](https://console.cloud.google.com/).
2. Créez un nouveau projet et activez l'API **"Google Drive API"**.
3. *Attention : N'utilisez pas l'assistant de création d'identifiants (OAuth).* Ouvrez le menu de gauche (☰) > **IAM et administration** > **Comptes de service**.
4. Cliquez sur **"+ CRÉER UN COMPTE DE SERVICE"**. Donnez-lui un nom (ex: `smartcity-upload`), cliquez sur Continuer puis Terminer.
5. Dans la liste, vous verrez l'e-mail de ce compte (ex: `smartcity-upload@votre-projet...gserviceaccount.com`). **Copiez cette adresse e-mail**.
6. Cliquez sur cette adresse e-mail, allez dans l'onglet **"Clés"** (Keys) > **"Ajouter une clé"** > **"Créer une clé"** au format **JSON**.
7. Le fichier se télécharge. Placez-le à la racine de ce projet sous le nom strict de `credentials.json`.

**Étape 2 : Configurer le Dossier de Réception (Votre Drive)**
1. Allez sur votre Google Drive personnel (dans votre navigateur).
2. Créez un nouveau dossier (ex: "Uploads SmartCity").
3. Faites un clic-droit sur ce dossier > **Partager**.
4. Collez l'adresse e-mail de votre compte de service (copiée à l'étape 1.5) et donnez-lui le rôle **"Éditeur"**. Décochez "Envoyer une notification" et validez.
5. Double-cliquez pour ouvrir ce dossier. Regardez la barre d'adresse (URL) de votre navigateur.
   - Exemple : `https://drive.google.com/drive/folders/1A2b3C4d5E6f7G8h9I0jK-LMNOPqrstU`
6. La longue série de caractères à la fin de l'URL est votre ID de dossier.
7. Copiez cet ID et collez-le dans votre fichier `.env` à la ligne `GOOGLE_DRIVE_FOLDER_ID="VOTRE_ID_ICI"`.

> ⚠️ Replace `your_mysql_password` with your actual MySQL root password.

---

## 🗄️ Database Setup

The project includes an automatic initialization script that:
- Creates the `smartcity` database if it doesn't exist.
- Creates all required tables (`axes`, `projects`, `events`, `publications`, `formations`, `site_counters`).
- Adds advanced columns (`axe_id`, `image_url`, `pdf_url`) to handle relationships and file uploads.
- Seeds the tables with sample data and official research axes.

### Run the init script:

```bash
node init-db.js
```

**Expected output:**
```
Creating database smartcity if not exists...
Creating tables...
Seeding data from JSON files...
Database initialization completed successfully!
```

> 💡 You only need to run this **once**. Running it again is safe — it won't duplicate data (uses `WHERE NOT EXISTS` checks).

---

## ▶️ Running the App

### Start the server:

```bash
node server.js
```

**Output:**
```
Server running on http://localhost:3000
```

### Access the site:

| Page              | URL                              |
|-------------------|----------------------------------|
| 🏠 Homepage       | http://localhost:3000/            |
| 📊 Admin Panel    | http://localhost:3000/admin       |
| 📁 Projects       | http://localhost:3000/projets     |
| 📅 Events         | http://localhost:3000/evenements  |
| 📄 Publications   | http://localhost:3000/publications|
| 🎓 Formations     | http://localhost:3000/formations  |
| ℹ️ About          | http://localhost:3000/qui         |
| 🔬 Research Axes  | http://localhost:3000/axes        |

---

## 📖 Usage

### Adding Content (Admin)

1. Navigate to `http://localhost:3000/admin`.
2. Select a section (e.g., **Projets**).
3. Fill in the form fields (Title, Description, URL, etc.).
4. Click **Enregistrer** — the item is saved to MySQL immediately.

### Deleting Content (Admin)

1. In the table of existing items, click the **✕** button next to any entry.
2. A confirmation dialog appears: *"Êtes-vous sûr de vouloir supprimer définitivement..."*.
3. Confirm to permanently delete the item from the database.

### Configuring the Homepage Slider (Admin)

1. Go to `http://localhost:3000/admin/selection`.
2. Choose up to 4 items to highlight using the slot dropdowns.
3. Activate each slot and select the type (Project, Event, etc.) and specific item.
4. Save — the homepage hero slider updates automatically.

### Editing Site Settings (Admin)

1. Go to `http://localhost:3000/admin/settings`.
2. Update site name, contact info, director section, etc.
3. Save to apply changes across the public site.

---

## 🔧 Environment Variables

| Variable   | Description                | Default      |
|------------|----------------------------|--------------|
| `PORT`     | Server port                | `3000`       |
| `DB_HOST`  | MySQL host                 | `localhost`   |
| `DB_USER`  | MySQL username             | `root`        |
| `DB_PASS`  | MySQL password             | *(required)*  |
| `DB_NAME`  | MySQL database name        | `smartcity`   |
| `CLOUDINARY_URL` | *(Optional)* Cloudinary credentials for cloud uploads | `''` |

---

## 📝 Notes

- **JSON config files** in `models/` (settings.json, selection.json, chiffres.json, slides.json) are used for site-wide configuration and remain file-based by design.
- **Dynamic content** (projects, events, publications, formations) is stored in MySQL and managed via the Repository pattern.
- **Switching databases**: To migrate from MySQL to another DB (PostgreSQL, SQLite, etc.), only the files in `repositories/` and `config/db.js` need to change. Controllers remain untouched.

---

## 📄 License

ISC
