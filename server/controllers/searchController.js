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

        const offers = await Offer.find(query).sort({ createdAt: -1 });
        res.status(200).json(offers);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des offres", error: error.message });
    }
};

export const getCandidateSearches = async (req, res) => {
    // Placeholder for searches logic
    res.status(200).json([]);
};
