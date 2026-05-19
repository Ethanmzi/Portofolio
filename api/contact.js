// Serverless function pour Vercel
// Remplace le backend Express

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
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

function sanitize(str) {
  if (!str) return '';
  return str
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .substring(0, 1000);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // Vérification webhook
  if (!DISCORD_WEBHOOK_URL) {
    console.error('DISCORD_WEBHOOK_URL non définie');
    return res.status(500).json({ error: 'Configuration serveur manquante' });
  }

  // Rate limiting
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: 'Trop de requêtes. Réessayez dans 1 minute.' });
  }

  const { firstname, lastname, email, message, website } = req.body;

  // Honeypot
  if (website && website.trim() !== '') {
    return res.status(400).json({ error: 'Bot detected' });
  }

  // Validation
  if (!firstname || !lastname || !email || !message) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  const cleanFirstname = sanitize(firstname);
  const cleanLastname = sanitize(lastname);
  const cleanEmail = sanitize(email);
  const cleanMessage = sanitize(message);

  // Discord embed
  const discordPayload = {
    embeds: [
      {
        title: '📬 Nouveau message de contact - Portfolio',
        color: 5814783,
        fields: [
          { name: 'Nom Complet', value: `${cleanFirstname} ${cleanLastname}`, inline: true },
          { name: 'Email', value: cleanEmail, inline: true },
          { name: 'Message', value: cleanMessage, inline: false }
        ],
        footer: { text: 'Portfolio Contact Form' },
        timestamp: new Date().toISOString()
      }
    ]
  };

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload)
    });

    if (!response.ok) {
      throw new Error(`Discord returned ${response.status}`);
    }

    res.status(200).json({ success: true, message: 'Message envoyé avec succès !' });
  } catch (error) {
    console.error('Erreur Discord:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message' });
  }
}
