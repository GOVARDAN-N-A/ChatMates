import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import mongoose from "mongoose";

// Ensure you have a MongoDB connection string available
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/ChatMates"; // Use your actual connection string here. You may need to use the same connection string that you use to connect to your MongoDB server.

const storage = new GridFsStorage({
    url: mongoURI,
     options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        // Customize how you name the files in GridFS
        const filename =  Date.now() + '-' + file.originalname;
        return {
            bucketName: 'profilePics', // The name of the bucket to store images
            filename: filename
        };
    }
});

const upload = multer({ storage });

export default upload.single("image");