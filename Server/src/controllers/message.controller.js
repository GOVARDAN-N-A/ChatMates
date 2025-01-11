import User from "../models/user.model.js";
import Message from "../models/message.model.js"; 

export const getUsersForSidebar = async (req, res) => {
    try{
        const loggedInUserId = req.user._id;
        const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        // const users = await User.find({}).select("-password");
        res.status(200).json(users);

    }
    catch(error){
        console.log("Error in getUsersForSidebar controller",error);
        res.status(500).json({ message: "Internal server error" })
    }
}; 


export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                {  senderId: senderId, receiverId: userToChatId },
                {  senderId: userToChatId, receiverId: senderId }
            ]
        })

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller",error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl = "";
        if (image) {
            const uploadedResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadedResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text, 
            image: imageUrl
        });

        await newMessage.save()

        res.status(200).json(newMessage)
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}