# Portfolio - Ethan Manzi

Portfolio personnel moderne avec design glassmorphic, animations et formulaire de contact Discord.

## 🚀 Technologies

- **Frontend:** Vite.js + TypeScript
- **Backend:** Node.js + Express
- **Styling:** CSS3 (Glassmorphism, Animations)
- **Intégration:** Discord Webhook

## 📦 Installation

```bash
# Cloner le projet
git clone https://github.com/Ethanmzi/Portfolio.git
cd Portofolio

# Installer les dépendances frontend
npm install

# Installer les dépendances backend
cd backend
npm install
cd ..
```

## 🖥️ Lancement

### Méthode rapide (2 terminaux)

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
npm start
```

### URLs

| Service  | URL                     |
|----------|-------------------------|
| Frontend | http://localhost:5173   |
| Backend  | http://localhost:3001   |

## 📬 Configuration Discord Webhook

Pour recevoir les messages du formulaire sur ton serveur Discord :

1. Ouvre Discord → Paramètres du serveur → Intégrations → Webhooks
2. Crée un nouveau webhook et choisis le salon
3. Copie l'URL du webhook
4. Modifie `backend/server.js` ligne 5 :

```javascript
const DISCORD_WEBHOOK_URL = "TON_URL_WEBHOOK_ICI";
```

## 📁 Structure

```
Portofolio/
├── backend/
│   ├── server.js        # Serveur Express + Discord
│   └── package.json
├── public/
├── src/
│   ├── main.ts          # JavaScript/Animations
│   └── style.css        # Styles CSS
├── index.html           # Page principale
├── package.json
└── README.md
```

## ✨ Fonctionnalités

- Design moderne glassmorphic
- Effet de curseur personnalisé
- Particules animées en arrière-plan
- Effet de typing dynamique
- Animations au scroll
- Barres de compétences animées
- Formulaire de contact → Discord
- Responsive (mobile/desktop)

## 🔗 Projets GitHub

- [DATA-IA-Projet](https://github.com/Ethanmzi/DATA-IA-Projet)
- [E-Commerce-PHP](https://github.com/Ethanmzi/E-Commerce-PHP)
- [Guess-The-Rank](https://github.com/Ethanmzi/Guess-The-Rank)
- [Bot-DiscordB2](https://github.com/Ethanmzi/Bot-DiscordB2)
- [Groupie-Tracker](https://github.com/Ethanmzi/Groupie-Tracker)
- [Projet-labyrinthe](https://github.com/Ethanmzi/Projet-labyrinthe)
- [Jeu-Dames](https://github.com/Ethanmzi/Jeu-Dames)

## 📝 Licence

© 2026 Ethan Manzi. Tous droits réservés.
