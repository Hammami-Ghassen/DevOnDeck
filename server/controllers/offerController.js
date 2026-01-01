import Offer from '../models/offerModel.js';
import Application from "../models/applicationModel.js"

// Get all offers (public route)
export const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ status: 'active' })
      .populate('organizationId', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ 
      message: "Erreur lors de la récupération des offres", 
      error: error.message 
    });
  }
};

// Get single offer by ID
export const getOfferById = async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await Offer.findById(id)
      .populate('organizationId', 'name email');
    
    if (!offer) {
      return res.status(404).json({ message: "Offre non trouvée" });
    }
    
    res.status(200).json(offer);
  } catch (error) {
    res.status(500).json({ 
      message: "Erreur lors de la récupération de l'offre", 
      error: error.message 
    });
  }
};

// Apply to offer
export const applyToOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const developerId = req.user._id;
    const { coverLetter, cv, cvFilename } = req.body;
    
    // Check if offer exists and is active
    const offer = await Offer.findById(id);
    if (!offer) {
      return res.status(404).json({ message: "Offre non trouvée" });
    }
    
    if (offer.status !== 'active') {
      return res.status(400).json({ message: "Cette offre n'est plus active" });
    }
    
    // Check if already applied
    const existingApplication = await Application.findOne({
      developerId,
      offerId: id
    });
    
    if (existingApplication) {
      return res.status(400).json({ message: "Vous avez déjà postulé à cette offre" });
    }
    
    // Create application
    const application = await Application.create({
      developerId,
      offerId: id,
      coverLetter: coverLetter || "",
      cv: cv || "",
      cvFilename: cvFilename || ""
    });
    
    res.status(201).json({ 
      message: "Candidature envoyée avec succès",
      application
    });
  } catch (error) {
    console.error('Apply error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Vous avez déjà postulé à cette offre" });
    }
    res.status(500).json({ 
      message: "Erreur lors de l'envoi de la candidature", 
      error: error.message 
    });
  }
};