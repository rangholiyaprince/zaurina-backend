// require('dotenv').config({path: "../.env"});
import dotenv from "dotenv";
dotenv.config({path: "./env"});

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";

import express from "express";
import connectDB from "./db/index.js";

connectDB();

const app = express();

// ( async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`)
//         console.log("MongoDB connected");
//         app.on("error", () => {
//             console.error("Error",error);
//             process.exit(1);
//             throw error;
//         });

//         app.listen(process.env.PORT, () => {
//             console.log(`Server running on port ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.error(error);
//         process.exit(1);
//     }
// });

