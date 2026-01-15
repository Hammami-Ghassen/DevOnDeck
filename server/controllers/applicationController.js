import Application from '../models/applicationModel.js';

// Update application status (accept/reject)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    ).populate('developerId', 'name email');

    if (!application) {
      return res.status(404).json({ message: "Candidature non trouvée" });
    }

    res.status(200).json({
      message: `Candidature ${status === 'accepted' ? 'acceptée' : status === 'rejected' ? 'refusée' : 'mise à jour'}`,
      application
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de la candidature",
      error: error.message
    });
  }
};

// Get developer's applications
export const getDeveloperApplications = async (req, res) => {
  try {
    const developerId = req.user._id;
    const applications = await Application.find({developerId})
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