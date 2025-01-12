import multer from "multer";

// Set up storage for incoming files
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload.single("image"); // Middleware for single file upload
