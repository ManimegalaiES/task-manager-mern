const admin = require(
  "../config/firebaseAdmin"
);

const User = require(
  "../models/User"
);

const generateToken = require(
  "../utils/generateToken"
);

const googleLogin = async (
  req,
  res
) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token missing"
      });
    }

    // Verify Firebase Token
    const decodedToken =
      await admin
        .auth()
        .verifyIdToken(token);

    const {
      uid,
      name,
      email,
      picture
    } = decodedToken;

    // Check if user exists
    let user =
      await User.findOne({
        email
      });

    // Create user if not exists
    if (!user) {
      user =
        await User.create({
          name,
          email,
          googleId: uid,
          profilePic: picture
        });
    }

    // Generate JWT
    const jwtToken =
      generateToken(user._id);

    return res.status(200).json({
      success: true,
      token: jwtToken,
      user
    });
  } catch (error) {
    console.error(
      "Auth Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Authentication Failed",
      error: error.message
    });
  }
};

module.exports = {
  googleLogin
};