import mongoose from "mongoose";

const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    resumeName: {
      type: String,
      required: true,
    },

    resumeUrl: {
      type: String,
      default: "",
    },

    atsScore: {
      type: Number,
      default: 0,
    },

    skillMatch: {
      type: Number,
      default: 0,
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },

    aiResponse: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "ResumeAnalysis",
  resumeAnalysisSchema
);