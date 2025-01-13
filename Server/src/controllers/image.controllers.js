import { GridFSBucket } from "mongodb";
import mongoose from "mongoose";

 const mongoURI = process.env.MONGO_URI  // Use your actual connection string here. You may need to use the same connection string that you use to connect to your MongoDB server.

 export const getImage = async (req, res) => {
 try {
     const filename = req.params.filename;
     const conn = mongoose.connection;
     const bucket = new GridFSBucket(conn.db, {
         bucketName: 'profilePics'
     });

     const downloadStream = bucket.openDownloadStreamByName(filename);
     downloadStream.on('data', (chunk) => {
         res.write(chunk);
     });
     downloadStream.on('error', () => {
         res.sendStatus(404);
     });
     downloadStream.on('end', () => {
         res.end();
     });

 } catch (error) {
     console.log("Error fetching image from database: ", error);
     res.status(500).json({ message: "Internal Server Error" });
 }
}