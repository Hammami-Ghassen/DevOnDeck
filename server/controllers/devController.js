import Application from "../models/applicationModel.js";
import mongoose from "mongoose";

export const getDevelopersByOfferId = async (req, res) => {
    try {
        const { offerId } = req.params;
        
        // Valider l'ObjectId
        if (!mongoose.Types.ObjectId.isValid(offerId)) {
            return res.status(400).json({ message: 'ID d\'offre invalide' });
        }
        
        // Récupérer les candidatures pour cette offre avec les détails des développeurs
        const applications = await Application.find({ offerId })
            .populate('developerId', 'name email profile contact skills frameworks')
            .sort({ createdAt: -1 });

        // Extraire les IDs des développeurs
        const applicantIds = applications.map(app => app.developerId._id.toString());
        
        return res.status(200).json({ 
            applicants: applicantIds,
            applications: applications
        });
    } catch (error) {
        console.error('Erreur getDevelopersByOfferId:', error);
        return res.status(500).json({ 
            message: 'Erreur serveur', 
            error: error.message 
        });
    }
};