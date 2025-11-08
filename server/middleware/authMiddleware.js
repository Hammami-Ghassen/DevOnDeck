import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

/**
 * Middleware to verify JWT token and attach user to request
 */
export const protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from "Bearer TOKEN"
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (without password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }

      next(); // Continue to next middleware/controller
    } catch (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({ message: 'Token invalide ou expiré' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé, token manquant' });
  }
};

/**
 * Middleware to check if user is admin
 */
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Accès refusé. Administrateur requis.' });
  }
};

/**
 * Middleware to check if user is developer
 */
export const developerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'developer') {
    next();
  } else {
    return res.status(403).json({ message: 'Accès refusé. Développeur requis.' });
  }
};

/**
 * Middleware to check if user is organization
 */
export const organizationOnly = (req, res, next) => {
  if (req.user && req.user.role === 'organization') {
    next();
  } else {
    return res.status(403).json({ message: 'Accès refusé. Organisation requise.' });
  }
};