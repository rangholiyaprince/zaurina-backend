require('dotenv').config();
const mongoose = require('mongoose');
const { DB_NAME } = require('../constants');

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
    console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
}

const dropIndex = async () => {
  try {
    await connectDB();

    console.log("Attempting to drop 'phone_number_1' index...");

    try {
      await mongoose.connection.collection('users').dropIndex('phone_number_1');
      console.log("Success: 'phone_number_1' index dropped.");
    } catch (err) {
      if (err.code === 27) {
        console.log("Index not found (already dropped).");
      } else {
        console.error("Error dropping index:", err.message);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("Script failed:", error);
    process.exit(1);
  }
};

dropIndex();
