const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // Récupérer le token depuis les headers
  const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé. Token manquant.' });
  }

  try {
    // Vérification du token avec la clé secrète
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attacher l'utilisateur à la requête pour pouvoir l'utiliser dans les routes suivantes
    req.user = decoded;
    next();  // Passer à la route suivante si le token est valide
  } catch (err) {
    return res.status(401).json({ message: 'Accès non autorisé. Token invalide.' });
  }
};

module.exports = authenticate;
