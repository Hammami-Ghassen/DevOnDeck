import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// GET un développeur par id
export const getDeveloperById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid developer id" });
  }

  try {
    const developer = await User.findById(id).lean();
    if (!developer) {
      return res.status(404).json({ message: "Developer not found" });
    }
    delete developer.password;
    res.status(200).json(developer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching developer" });
  }
};

// UPDATE un développeur
export const updateDeveloper = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid developer id" });
  }

  try {
    const {
      name,
      email,
      password,
      role,
      bio,
      skills,
      frameworks,
      avatar,
      localisation,
      contact,
    } = req.body;

    const updates = {};

    if (name) updates.name = name.trim();
    if (email) updates.email = email.toLowerCase();
    if (role) updates.role = role;
    if (bio !== undefined) updates.bio = bio;
    if (skills) updates.skills = skills;
    if (frameworks) updates.frameworks = frameworks;
    if (avatar !== undefined) updates.avatar = avatar;
    if (localisation !== undefined) updates.localisation = localisation;

    if (contact) {
      updates.contact = {};
      if (contact.mail !== undefined) updates.contact.mail = contact.mail;
      if (contact.numero !== undefined) updates.contact.numero = contact.numero;
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const updated = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (!updated) {
      return res.status(404).json({ message: "Developer not found" });
    }

    const obj = updated.toObject();
    delete obj.password;

    return res.status(200).json(obj);
  } catch (err) {
    console.error(`Error updating developer ${id}:`, err);

    if (err.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error", errors: err.errors });
    }

    if (err.code === 11000) {
      return res.status(409).json({ message: "Duplicate field", detail: err.keyValue });
    }

    return res.status(500).json({ message: "Server error updating developer" });
  }
};
