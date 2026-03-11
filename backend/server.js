import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ["http://localhost:5173", "http://localhost:5174"];

// Vérification au démarrage
if (!DISCORD_WEBHOOK_URL) {
  console.error("❌ ERREUR: DISCORD_WEBHOOK_URL non définie dans .env");
  process.exit(1);
}

// Rate limiting simple (en mémoire)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 3; // 3 messages par minute max

function checkRateLimit(ip) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return false;
  }
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true;
}

// Sanitize input (retire les caractères dangereux)
function sanitize(str) {
  if (!str) return '';
  return str
    .replace(/[<>]/g, '') // Retire < et >
    .replace(/javascript:/gi, '') // Retire javascript:
    .replace(/on\w+=/gi, '') // Retire onclick=, onerror=, etc.
    .trim()
    .substring(0, 1000); // Limite la longueur
}

// Validation email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

app.use(cors({
  origin: ALLOWED_ORIGINS,
  methods: ["POST"],
}));

// Limite la taille du body à 10kb
app.use(express.json({ limit: '10kb' }));

app.post("/contact", async (req, res) => {
  // Rate limiting
  const clientIp = req.ip || req.connection.remoteAddress;
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: "Trop de requêtes. Réessayez dans 1 minute." });
  }

  const { firstname, lastname, email, message, website } = req.body;

  // Honeypot (Sécurité anti-bot)
  if (website && website.trim() !== "") {
    return res.status(400).json({ error: "Bot detected" });
  }

  // Validation
  if (!firstname || !lastname || !email || !message) {
    return res.status(400).json({ error: "Champs manquants" });
  }

  // Validation email
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Email invalide" });
  }

  // Sanitize inputs
  const cleanFirstname = sanitize(firstname);
  const cleanLastname = sanitize(lastname);
  const cleanEmail = sanitize(email);
  const cleanMessage = sanitize(message);

  // Préparation du message pour Discord
  const discordPayload = {
    embeds: [
      {
        title: "📬 Nouveau message de contact - Portfolio",
        color: 5814783,
        fields: [
          { name: "Nom Complet", value: `${cleanFirstname} ${cleanLastname}`, inline: true },
          { name: "Email", value: cleanEmail, inline: true },
          { name: "Message", value: cleanMessage },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(discordPayload),
    });

    if (!response.ok) throw new Error("Erreur Discord");

    console.log("✅ Message envoyé à Discord");
    return res.json({ success: true });
  } catch (error) {
    console.error("❌ Erreur:", error);
    return res.status(500).json({ error: "Impossible d'envoyer le message" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend Portfolio prêt sur http://localhost:${PORT}`);
});
