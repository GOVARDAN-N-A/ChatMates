import mongoose from "mongoose";

mongoose.set('debug', true);

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 50000
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);

    throw error;
    
  }



};
