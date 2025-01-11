import { v2 as cloudinary } from "cloudinary";

import { config } from "dotenv";

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log(process.env.CLOUDINARY_CLOUD_NAME); // Should print your cloud name
console.log(process.env.CLOUDINARY_API_KEY); // Should print your API key
console.log(process.env.CLOUDINARY_API_SECRET); // Should print your API secret


export default cloudinary;