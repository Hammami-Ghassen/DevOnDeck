import Offer from '../models/offerModel.js';

export const getOrganizationOffers = async (req, res) => {
    try {
        const organizationId = req.user._id;
        const { q } = req.query;

        let query = { organizationId };

        if (q) {
            // Escape special characters to prevent regex errors
            const safeQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const searchRegex = new RegExp(safeQ, 'i');
            query = {
                ...query,
                $or: [
                    { title: searchRegex },
                    { description: searchRegex },
                    { requiredSkills: { $in: [searchRegex] } }
                ]
            };
        }

        const offers = await Offer.find(query).populate('organizationId', 'name email').sort({ createdAt: -1 });
        res.status(200).json(offers);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des offres", error: error.message });
    }
};

export const getCandidateSearches = async (req, res) => {
    // Placeholder for searches logic
    res.status(200).json([]);
};

export const createOffer = async (req, res) => {
    try {
        const organizationId = req.user._id;
        const {
            title,
            description,
            requiredSkills,
            requiredFrameworks,
            preferredLocalisation,
            experienceLevel,
            contractType,
            salary,
            status
        } = req.body;

        // Validation
        if (!title || !description) {
            return res.status(400).json({ 
                message: "Le titre et la description sont obligatoires" 
            });
        }

        // Create offer
        const offer = await Offer.create({
            organizationId,
            title,
            description,
            requiredSkills: requiredSkills || [],
            requiredFrameworks: requiredFrameworks || [],
            preferredLocalisation: preferredLocalisation || '',
            experienceLevel,
            contractType,
            salary: {
                min: salary?.min || 0,
                max: salary?.max || 0
            },
            status: status || 'active'
        });

        res.status(201).json({
            message: "Offre créée avec succès",
            offer
        });
    } catch (error) {
        console.error('Create offer error:', error);
        res.status(500).json({ 
            message: "Erreur lors de la création de l'offre", 
            error: error.message 
        });
    }
};
