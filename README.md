# ⭐ Starsky AI Chat‑Generator

## Description
Ce projet est une application web full-stack construite avec React (frontend), Express (backend), Supabase (base de données et authentification), et intégrant des fonctionnalités d'IA pour générer des projets web (HTML/CSS/JS) avec sauvegarde côté back‑end.


## Fonctionnalités
* **Authentification Utilisateur :** Gestion des utilisateurs avec Supabase (inscription, connexion, déconnexion)
* **Génération de code via IA :** envoi de prompts à un modèle (ex. Gemini), pour générer un ensemble de fichiers
* **Affichage & édition de code :** interface React avec Monaco Editor pour modifier les fichiers générés.
* **Live Preview :** Affichage en direct des modifications dans un iframe.
* **Historique des projets :** Sauvegarde et consultation des projets générés
* **Téléchargement ZIP :** Export des fichiers dans une archive via JSZip.
* **Interface réactive :** Frontend développé avec React pour une expérience fluide
* **API RESTful :** Backend Express pour fournir l’API au frontend
* **Base de données Supabase :** Stockage des données et authentification


## Technologies utilisées
**Frontend :** React, Vite, Tailwind CSS, Monaco Editor, Lucide React, React Router DOM
**Backend :** Node.js, Express
**Base de données :** Supabase (authentification + base de données PostgreSQL)
**IA :** Gemini from Google Cloud
**Autres :** JSZip, dotenv


## Prérequis
Node.js (version >= 16)
npm ou yarn
Un compte Supabase
Une clé API pour l'API d'IA utilisée

## Installation & Exécution

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Remplir les variables (URL Supabase, KEY, etc.)
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```


## Structure du projet
```
/Starsky
│
├── backend/              # Serveur Express (API, Supabase)
│   ├── controllers/      # Logique métier (auth, projets)
│   ├── routes/           # Routes de l'API
│   ├── middlewares/      # Authentification
│   ├── db.js             # Connexion Supabase
│   ├── index.js          # Point d’entrée backend (Express)
│   ├── .env              # Variables d’environnement
│   ├── package.json      # Dépendances backend
│
├── frontend/             # Application React avec Vite
│   ├── public/           # Images et fichiers statiques
│   ├── src/
│   │   ├── Components/   # Composants UI réutilisables
│   │   ├── services/     # Appels API (fetch)
│   │   ├── App.jsx       # Composant principal
│   │   ├── main.jsx      # Point d’entrée React
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── package.json      # Dépendances frontend
│
└── README.md             # Documentation
```


## API

Le backend expose une API RESTful avec les endpoints suivants :

- `POST /api/users/register` : Enregistrement d'un nouvel utilisateur
- `POST /api/users/login` : Connexion d'un utilisateur existant
- `GET /api/users/me` : Récupération des informations de l'utilisateur connecté (avec token)
- `POST /api/projects/` : Sauvegarder un projet (addProject)
- `GET /api/projects/:user_id` : Récupérer l’historique des projets d’un utilisateur (getProjects)

