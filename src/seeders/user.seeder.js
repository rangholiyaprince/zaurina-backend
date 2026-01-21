require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const { DB_NAME } = require('../constants');

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
    console.log(`\n MongoDB connected regarding seeder !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
}

const users = [
  {
    first_name: "Hardik",
    last_name: "Kanani",
    email: "user1@zaurina.com",
    phone_code: "+91",
    phone_number: "9000000001",
    password: "Password@123",
    user_type: "user",
    is_active: true,
    is_verified: true
  },
  {
    first_name: "Amit",
    last_name: "Shah",
    email: "user2@zaurina.com",
    phone_code: "+91",
    phone_number: "9000000002",
    password: "Password@123",
    user_type: "user",
    is_active: true,
    is_verified: true
  },
  {
    first_name: "Rahul",
    last_name: "Patel",
    email: "user3@zaurina.com",
    phone_code: "+91",
    phone_number: "9000000003",
    password: "Password@123",
    user_type: "user",
    is_active: true,
    is_verified: true
  },
  {
    first_name: "Neha",
    last_name: "Mehta",
    email: "user4@zaurina.com",
    phone_code: "+91",
    phone_number: "9000000004",
    password: "Password@123",
    user_type: "user",
    is_active: true,
    is_verified: true
  },
  {
    first_name: "Priya",
    last_name: "Desai",
    email: "user5@zaurina.com",
    phone_code: "+91",
    phone_number: "9000000005",
    password: "Password@123",
    user_type: "user",
    is_active: true,
    is_verified: true
  },
  {
    first_name: "Admin",
    last_name: "Zaurina",
    email: "admin@zaurina.com",
    phone_code: "+91",
    phone_number: "9999999999",
    password: "Password@123",
    user_type: "admin",
    is_active: true,
    is_verified: true
  }
];

const seedUsers = async () => {
  try {
    await connectDB();

    console.log("Starting user seeding...");

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        console.log(`Skipping: User with email ${userData.email} already exists.`);
        continue;
      }

      // Password encryption is handled by the pre-save hook in User model
      // so we pass the plain password
      await User.create(userData);
      console.log(`Success: Created user ${userData.first_name} ${userData.last_name} (${userData.email})`);
    }

    console.log("User seeding completed successfully.");
    process.exit(0);

  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
};

seedUsers();
