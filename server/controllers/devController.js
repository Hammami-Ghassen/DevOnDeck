import Application from "../models/applicationModel.js";
import Offer from "../models/offerModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

// Fonction pour calculer le matching entre un développeur et une offre
const calculateMatching = (developer, offer) => {
    let totalPoints = 0;
    let matchedPoints = 0;

    // Matching des skills (50% du score)
    const offerSkills = offer.requiredSkills || [];
    const devSkills = developer.skills || [];
    if (offerSkills.length > 0) {
        totalPoints += 50;
        const matchedSkills = devSkills.filter(skill =>
            offerSkills.some(os => os.toLowerCase() === skill.toLowerCase())
        );
        matchedPoints += (matchedSkills.length / offerSkills.length) * 50;
    }

    // Matching des frameworks (30% du score)
    const offerFrameworks = offer.requiredFrameworks || [];
    const devFrameworks = developer.frameworks || [];
    if (offerFrameworks.length > 0) {
        totalPoints += 30;
        const matchedFrameworks = devFrameworks.filter(fw =>
            offerFrameworks.some(of => of.toLowerCase() === fw.toLowerCase())
        );
        matchedPoints += (matchedFrameworks.length / offerFrameworks.length) * 30;
    }

    // Matching de la localisation (20% du score)
    const offerLocation = offer.preferredLocalisation?.toLowerCase() || '';
    const devLocation = developer.localisation?.toLowerCase() || '';
    if (offerLocation) {
        totalPoints += 20;
        if (devLocation && devLocation.includes(offerLocation)) {
            matchedPoints += 20;
        }
    }

    if (totalPoints === 0) return 0;
    return Math.round((matchedPoints / totalPoints) * 100);
};

// Route pour obtenir le matching d'un développeur avec une offre
export const getMatchingScore = async (req, res) => {
    try {
        const { offerId, developerId } = req.params;

        // Valider les ObjectIds
        if (!mongoose.Types.ObjectId.isValid(offerId) || !mongoose.Types.ObjectId.isValid(developerId)) {
            return res.status(400).json({ message: 'ID invalide' });
        }

        const offer = await Offer.findById(offerId);
        const developer = await User.findById(developerId);

        if (!offer || !developer) {
            return res.status(404).json({ message: 'Offre ou développeur non trouvé' });
        }

        const matchingScore = calculateMatching(developer, offer);

        return res.status(200).json({ 
            matchingScore,
            developerId,
            offerId
        });
    } catch (error) {
        console.error('Erreur getMatchingScore:', error);
        return res.status(500).json({ 
            message: 'Erreur serveur', 
            error: error.message 
        });
    }
};

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