const Resume = require("../models/Resume");
const User = require("../models/User");

// =======================
// Save Resume
// =======================
const saveResume = async (req, res) => {
  try {
    console.log("========== SAVE RESUME ==========");
    console.log("Request Body:", req.body);

    const {
      clerkId,
      fileName,
      jobDescription,
      analysis,
    } = req.body;

    if (!clerkId || !fileName || !analysis || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: "clerkId, fileName, jobDescription and analysis are required",
      });
    }

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resume = await Resume.create({
      user: user._id,
    
      fileName,
      jobDescription,
    
      atsScore: analysis.atsScore || 0,
      jobMatch: analysis.jobMatch || 0,

      skills: analysis.skills || [],
      missingSkills: analysis.missingKeywords || [],
      strengths: analysis.strengths || [],
      weaknesses: analysis.weaknesses || [],

      suggestions: analysis.suggestions || [],

      analysis,
    });

    console.log("✅ Resume Saved Successfully");

    return res.status(201).json({
      success: true,
      resume,
    });

  } catch (error) {
    console.error("❌ Save Resume Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Resume History
// =======================
const getResumeHistory = async (req, res) => {
  try {
    const { clerkId } = req.params;

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const resumes = await Resume.find({
      user: user._id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      resumes,
    });

  } catch (error) {
    console.error("❌ History Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Delete Resume
// =======================
const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;

    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    await Resume.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });

  } catch (error) {
    console.error("❌ Delete Resume Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =======================
// Update Resume
// =======================
const updateResume = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      jobDescription,
      analysis,
    } = req.body;

    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    resume.jobDescription = jobDescription;

    resume.analysis = analysis;

    resume.atsScore = analysis.atsScore || 0;
    resume.jobMatch = analysis.jobMatch || 0;

    resume.skills = analysis.skills || [];
    resume.missingSkills = analysis.missingKeywords || [];
    resume.strengths = analysis.strengths || [];
    resume.weaknesses = analysis.weaknesses || [];
    resume.suggestions = analysis.suggestions || [];

    await resume.save();

    return res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      resume,
    });

  } catch (error) {

    console.error("Update Resume Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
module.exports = {
  saveResume,
  getResumeHistory,
  deleteResume,
  updateResume,
};