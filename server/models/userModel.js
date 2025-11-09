import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
      // 🔐 Authentication fields
      name: {
        type: String,
        required: true,
        trim: true,
      },
  
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
  
      password: {
        type: String,
        required: true,
        minlength: 6,
      },
  
      role: {
        type: String,
        enum: ["developer", "admin","organization"],
        default: "developer",
      },

      // 🔄 Refresh tokens array (allow multiple devices)
      refreshTokens: [{
        token: {
          type: String,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now,
          expires: 604800 // 7 days in seconds
        }
      }],
  
      // 👤 Developer profile information
      bio: {
        type: String,
        trim: true,
      },
  
      skills: {
        type: [String],
        default: [],
      },
  
      frameworks: {
        type: [String],
        default: [],
      },
  
      avatar: {
        type: String,
        default: "",
      },
  
      localisation: {
        type: String,
        default: "",
      },
  
      contact: {
        mail: {
          type: String,
          default: "",
        },
        numero: {
          type: String,
          default: "",
        },
      },
    },
    { timestamps: true }
  );
  
  export default mongoose.model("User", userSchema);