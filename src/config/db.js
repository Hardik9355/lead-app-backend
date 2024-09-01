import mongoose from "mongoose";

const MONGOURI = process.env.MONGOURI;

if (!MONGOURI) {
  console.error(
    "MONGOURI is not defined. Please check your environment variables."
  );
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGOURI);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

export default connectDB;
