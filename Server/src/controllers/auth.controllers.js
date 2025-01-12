
import { generateToken } from "../lib/utils.lib.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.lib.js";

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  console.log(" signup controller", req.body);
  
  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const uploadToCloudinary = async (profilePic) => {
  let retries = 3;
  while (retries > 0) {
    try {
      const uploadResult = await cloudinary.uploader.upload(profilePic, {
        folder: "ChatMates",
        timeout: 60000, // Ensure this is properly handled
      });
      return uploadResult;
    } catch (cloudinaryError) {
      console.error("Cloudinary upload failed:", cloudinaryError);
      retries -= 1;
      if (retries > 0) {
        await delay(2000); // 2-second delay
      } else {
        throw cloudinaryError; // Throw after all retries
      }
    }
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, profilePic } = req.body;

    // Fetch the existing user from the database
    const existingUser = await User.findById(req.user.id);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    let cloudinaryUrl = existingUser.profilePic;

    // If a new profilePic is provided and it's different from the existing one, upload it
    if (profilePic && profilePic !== existingUser.profilePic) {
      try {
        const uploadResult = await uploadToCloudinary(profilePic);
        cloudinaryUrl = uploadResult.secure_url; // Use the uploaded image URL
      } catch (cloudinaryError) {
        console.error("Error uploading to Cloudinary:", cloudinaryError);
        return res.status(500).json({
          message: "Error uploading image to Cloudinary",
          error: cloudinaryError.message,
        });
      }
    }

    // Update the user profile with the new information
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        fullname,
        email,
        profilePic: cloudinaryUrl, // Updated or unchanged Cloudinary URL
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "User update failed" });
    }

    res.status(200).json(updatedUser); // Return the updated user info
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      message: "Error updating profile",
      error: error.message,
    });
  }
};


export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
