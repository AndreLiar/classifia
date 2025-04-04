# ♻️ ClassifIA – Classificateur de déchets intelligent

> Un projet IA for Good pour sensibiliser au tri sélectif grâce à l’intelligence artificielle.  
> 🧠 Propulsé par Gemini + React

---

## 🌍 À propos

**ClassifIA** est une application web éducative et interactive qui aide les utilisateurs à trier leurs déchets de manière **simple, rapide et ludique**.  
Il suffit d’écrire un objet (ou d’en sélectionner un), et l’IA indique la **bonne poubelle** à utiliser (jaune, verte, marron, grise), accompagnée d’une **explication claire**, d’une **image** et d’une **lecture vocale automatique**.

Ce projet a été conçu dans le cadre du **Hackathon “IA for Good”**.

---

## 🚀 Démo

![Demo GIF](public/demo.gif) <!-- Remplace par ton GIF ou vidéo -->

👉 [Lien de l'application (si déployée)](https://ton-deploiement.vercel.app) *(optionnel)*

---

## 🧪 Fonctionnalités

- 🧠 **Classification intelligente** des déchets via Gemini
- 💡 Suggestions d’objets courants à trier
- 🖼️ Affichage d’une **image de la bonne poubelle**
- 📜 Historique local des requêtes
- 🌙 **Mode sombre** activable
- ♿ Accessibilité améliorée (voix, contrastes)
- 🧭 Navigation fluide (Accueil / À propos)

---

## 🧱 Stack technique

- **Frontend** : React + TypeScript
- **IA** : Gemini API (Google Generative AI)
- **Speech** : Web Speech API (Text-to-Speech)
- **UI** : Bootstrap 5
- **Routing** : React Router DOM
- **Déploiement** : Vite

---

## 🛠️ Installation

```bash
# 1. Clone le projet
git clone https://github.com/AndreLiar/classifia.git
cd classifia

# 2. Installe les dépendances
npm install

# 3. Crée un fichier .env avec ta clé Gemini
VITE_GEMINI_API_KEY=ta-cle-api
VITE_GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent

# 4. Lance l’application
npm run dev


👨‍💻 Équipe projet
Noms: Kanmegne Tabouguie , Wahab Mounirou et Keneth Francisco Esse

Rôle : Développeur fullstack

Projet créé pour : Hackathon IA for Good – 2024–2025
