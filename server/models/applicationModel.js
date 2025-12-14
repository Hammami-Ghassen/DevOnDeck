import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  developerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  offerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Offer",
    required: true,
  },
  
  status: {
    type: String,
    enum: ["pending", "reviewed", "accepted", "rejected"],
    default: "pending",
  },
  
  coverLetter: {
    type: String,
    default: "",
  },
  
  // Track if the developer has been notified
  notified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// Prevent duplicate applications
applicationSchema.index({ developerId: 1, offerId: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);