import express from "express";
import authRoute from "./routes/auth.route.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/db.connect.js";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config();
const port = process.env.PORT || 8000

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // to parse from data(urlencoded)
app.use("/api/auth", authRoute);
app.listen(port, () => {
  console.log(`Server is runing on port ${port}.`);
  connectMongoDB();
});
