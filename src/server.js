require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./app');

const startServer = async () => {
  try {
    await connectDB();

    const port = process.env.PORT || 8000;

    app.listen(port, () => {
      console.log(`Server is running at port : ${port}`);
    });

  } catch (err) {
    console.log("MONGO db connection failed !!! ", err);
  }
};

startServer();
