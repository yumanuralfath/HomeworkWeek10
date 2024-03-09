import express from "express";
import db from "./config/connection.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 2070;

app.use(express.json());

// try {
//   await db.authenticate();
//   console.log("connection established successfully");
// } catch (error) {
//   console.error("unable to connect to database");
// };

app.listen(port, console.log("Server started http://localhost:" + port));
