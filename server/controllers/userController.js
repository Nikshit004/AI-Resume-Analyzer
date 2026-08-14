const User = require("../models/User");

const saveUser = async (req, res) => {
  try {
    const { clerkId, fullName, email, image } = req.body;

    if (!clerkId || !email) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({
        clerkId,
        fullName,
        email,
        image,
      });
    } else {
      user.fullName = fullName;
      user.email = email;
      user.image = image;

      await user.save();
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  saveUser,
};