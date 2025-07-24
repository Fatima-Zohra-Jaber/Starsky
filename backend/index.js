import express from "express"; // Correct pour ESM (avec "type": "module")
import cors from "cors";  // middleware pour Cross-Origin Resource Sharing
import dotenv from "dotenv"; // gestion des variables d’environnement
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import "./db.js";

// const express = require("express"); Backend Node.js classique 

// Chargement des variables d’environnement
dotenv.config(); 

// Initialisation du serveur
const app = express();
app.use(cors()); // autorise les requêtes cross-origin
app.use(express.json()); // pour parser le corps des requêtes en JSON

// Définition des routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
