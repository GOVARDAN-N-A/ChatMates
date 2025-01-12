import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.lib.js";
import { getReceiverSocketId, io } from "../lib/socket.lib.js";

// Message.deleteMany({}).then(() => console.log("Messages deleted"));


export const getUsersForSidebar = async (req, res) => {

  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    
        const messages = await Message.find({
      
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    
    console.log("messages:", messages);
    
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;  // image will be a Base64 string
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ error: "Message text or image must be provided" });
    }

    // If the image is provided, it will be a Base64 string
    let imageBase64 = null;

    if (image) {
      console.log("Received image:", image);
      
      imageBase64 = image;  // Directly use the Base64 string from the request
    }

    // Create a new message
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageBase64,  // Store image as Base64 string in MongoDB
    });

    await newMessage.save();

    // Notify the receiver if they are online
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};