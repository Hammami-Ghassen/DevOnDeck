// controllers/adminController.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';

/**
 * GET /developers
 * Return list of all developers (optionally you may paginate/filter later)
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });

    return res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ message: 'Server error fetching users' });
  }
};

/**
 * POST /developers
 * Create a new developer
 * Required: name, email, password
 */
export const createDeveloper = async (req, res) => {
  try {
    const { name, email, password, role = 'developer', bio = '', skills = [], frameworks = [], avatar = '', localisation = '', contact = {} } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role,
      bio,
      skills,
      frameworks,
      avatar,
      localisation,
      contact
    });

    const saved = await newUser.save();
    // Do not return the password
    const savedObj = saved.toObject();
    delete savedObj.password;

    return res.status(201).json(savedObj);
  } catch (err) {
    console.error('Error creating developer:', err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: err.errors });
    }

    if (err.code === 11000) {
      return res.status(409).json({ message: 'Duplicate field', detail: err.keyValue });
    }

    return res.status(500).json({ message: 'Server error creating developer' });
  }
};

/**
 * PUT /developers/:id
 * Update developer by id. Accepts any fields; if password is present it will be hashed.
 */
export const updateDeveloper = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid developer id' });
  }

  try {
    const updates = { ...req.body };

    if (updates.email) updates.email = updates.email.toLowerCase();

    // If password present, hash it
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const updated = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
      context: 'query',
    });

    if (!updated) {
      return res.status(404).json({ message: 'Developer not found' });
    }

    const obj = updated.toObject();
    delete obj.password;

    return res.status(200).json(obj);
  } catch (err) {
    console.error(`Error updating developer ${id}:`, err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: err.errors });
    }

    if (err.code === 11000) {
      return res.status(409).json({ message: 'Duplicate field', detail: err.keyValue });
    }

    return res.status(500).json({ message: 'Server error updating developer' });
  }
};

/**
 * DELETE /developers/:id
 * Delete developer by id
 */
export const deleteDeveloper = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid developer id' });
  }

  try {
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Developer not found' });
    }

    return res.status(200).json({ message: 'Developer deleted successfully', id });
  } catch (err) {
    console.error(`Error deleting developer ${id}:`, err);
    return res.status(500).json({ message: 'Server error deleting developer' });
  }
};
