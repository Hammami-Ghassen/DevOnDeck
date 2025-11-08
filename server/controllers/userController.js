import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";



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

    // Préparer l'objet d'update
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

    // Si mot de passe envoyé → le hacher
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    // Mise à jour avec validation du schéma
    const updated = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (!updated) {
      return res.status(404).json({ message: "Developer not found" });
    }

    const obj = updated.toObject();
    delete obj.password; // on ne renvoie jamais le mot de passe

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


// ✅ Récupérer un développeur par ID
export const fetchDeveloper = async (req, res) => {
  const { id } = req.params;
  console.log("Fetching developer with ID:", id);
  // Vérifie si l'ID est valide
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid developer id" });
  }

  try {
    const developer = await User.findById(id).select("-password"); // On exclut le mot de passe

    if (!developer) {
      return res.status(404).json({ message: "Developer not found" });
    }

    return res.status(200).json(developer);
  } catch (err) {
    console.error(`Error fetching developer ${id}:`, err);
    return res.status(500).json({ message: "Server error fetching developer" });
  }
};

