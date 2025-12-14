import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  // Organisation qui publie
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  title: {
    type: String,
    required: true,
  },
  
  description: {
    type: String,
    required: true,
  },
  
  // Critères de recherche
  requiredSkills: {
    type: [String],
    default: [],
  },
  
  requiredFrameworks: {
    type: [String],
    default: [],
  },
  
  preferredLocalisation: {
    type: String,
    default: "",
  },
  
  experienceLevel: {
    type: String,
    enum: ["junior", "intermediate", "senior", "expert"],
  },
  
  contractType: {
    type: String,
    enum: ["CDI", "CDD", "freelance", "stage"],
  },
  
  salary: {
    min: Number,
    max: Number,
  },
  
  status: {
    type: String,
    enum: ["active", "closed", "draft"],
    default: "active",
  },
}, { timestamps: true });

export default mongoose.model("Offer", offerSchema);