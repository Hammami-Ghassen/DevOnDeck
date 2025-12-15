import Offer from "../models/offerModel.js";
import mongoose from "mongoose";

export const getDevelopersByOfferId = async (req, res) => {
    try {
        const { offerId } = req.params;
        
        // Valider l'ObjectId
        if (!mongoose.Types.ObjectId.isValid(offerId)) {
            return res.status(400).json({ message: 'ID d\'offre invalide' });
        }
        
        const offer = await Offer.findById(offerId);

        if (!offer) {
            return res.status(404).json({ message: 'Offre non trouvée' });
        }
        
        // Convertir les ObjectId en strings
        const applicantIds = offer.applicants.map(id => id.toString());
        
        return res.status(200).json({ applicants: applicantIds });
    } catch (error) {
        console.error('Erreur getDevelopersByOfferId:', error);
        return res.status(500).json({ 
            message: 'Erreur serveur', 
            error: error.message 
        });
    }
};