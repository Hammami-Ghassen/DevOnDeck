import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Helper function to generate JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

/**
 * POST /auth/register
 * Register a new user (developer or organization)
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'developer' } = req.body;

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
      contact: { mail: email.toLowerCase(), numero: '' }
    });

    const savedUser = await newUser.save();

    // Generate JWT token
    const token = generateToken(savedUser);

    // Return user without password
    const userObj = savedUser.toObject();
    delete userObj.password;

    return res.status(201).json({
      message: 'Inscription réussie',
      token,
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

    // Generate token
    const token = generateToken(user);

    // Return user without password
    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: userObj
    });

  } catch (err) {
    console.error('Error during login:', err);
    return res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
};

/**
 * GET /auth/me
 * Get current logged in user
 */
export const getMe = async (req, res) => {
  try {
    // req.user is set by protect middleware
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};