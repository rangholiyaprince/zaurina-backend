const mongoose = require('mongoose');
const Color = require('./src/models/Color.model');
const connectDB = require('./src/config/db');
require('dotenv').config();

const verifyMasterData = async () => {
  try {
    await connectDB();
    const color = await Color.findOne({ name: 'Rose Gold' });
    if (color) {
      console.log('✅ Found Color: Rose Gold');
    } else {
      console.log('❌ Color Not Found');
    }
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

verifyMasterData();
