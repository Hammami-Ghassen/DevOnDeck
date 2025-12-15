import Application from '../models/applicationModel.js';

// Get developer's applications
export const getDeveloperApplications = async (req, res) => {
  try {
    const developerId = req.user._id;
    
    const applications = await Application.find({ developerId })
      .populate({
        path: 'offerId',
        populate: {
          path: 'organizationId',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });
    
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ 
      message: "Erreur lors de la récupération des candidatures",
      error: error.message 
    });
  }
};