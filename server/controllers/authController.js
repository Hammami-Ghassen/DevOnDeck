import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Generate Access Token (short-lived: 15 minutes)
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

/**
 * Generate Refresh Token (long-lived: 7 days)
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      role: user.role 
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * POST /auth/register
 * Register a new user
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      bio: '',
      skills: [],
      frameworks: [],
      avatar: '',
      localisation: '',
      contact: { mail: email.toLowerCase(), numero: '' },
      refreshTokens: []
    });

    const savedUser = await newUser.save();

    // Generate tokens
    const accessToken = generateAccessToken(savedUser);
    const refreshToken = generateRefreshToken(savedUser);

    // Store refresh token in database
    savedUser.refreshTokens.push({ token: refreshToken });
    await savedUser.save();

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return user without password
    const userObj = savedUser.toObject();
    delete userObj.password;
    delete userObj.refreshTokens;

    return res.status(201).json({
      message: 'Inscription réussie',
      accessToken,
      user: userObj
    });

  } catch (err) {
    console.error('Error during registration:', err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Données invalides', errors: err.errors });
    }

    return res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
  }
};

/**
 * POST /auth/login
 * Login user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in database
    user.refreshTokens.push({ token: refreshToken });
    
    // Keep only last 5 refresh tokens (limit active sessions)
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }
    
    await user.save();

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Return user without password
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshTokens;

    return res.status(200).json({
      message: 'Connexion réussie',
      accessToken,
      user: userObj
    });

  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
};

/**
 * POST /auth/refresh
 * Refresh access token using refresh token from cookie
 */
export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token manquant' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user and check if refresh token exists
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    // Check if refresh token exists in database
    const tokenExists = user.refreshTokens.some(rt => rt.token === refreshToken);
    
    if (!tokenExists) {
      return res.status(401).json({ message: 'Refresh token invalide' });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    return res.status(200).json({
      accessToken: newAccessToken
    });

  } catch (err) {
    console.error('Error refreshing token:', err);
    return res.status(401).json({ message: 'Refresh token invalide ou expiré' });
  }
};

/**
 * POST /auth/logout
 * Logout user (remove refresh token from cookie and database)
 */
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      try {
        // Decode token to get user ID
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        
        // Remove refresh token from database
        await User.findByIdAndUpdate(decoded.id, {
          $pull: { refreshTokens: { token: refreshToken } }
        });
      } catch (err) {
        console.error('Error decoding refresh token during logout:', err);
      }
    }

    // Clear cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return res.status(200).json({ message: 'Déconnexion réussie' });

  } catch (err) {
    console.error('Error during logout:', err);
    return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
  }
};

/**
 * GET /auth/me
 * Get current logged in user
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshTokens');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};