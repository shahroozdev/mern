import express from "express";
import dotenv from "dotenv";
import connectMongoDB from "./db/db.connect.js";
import {v2 as cloudinary} from "cloudinary"
import cookieParser from "cookie-parser";

//routes
import authRoute from "./routes/auth.route.js";
import userRoute  from "./routes/user.route.js";
import postRoute  from "./routes/post.route.js";
import notificationRoute  from "./routes/notification.route.js";

const app = express();

dotenv.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

cloudinary.config();
const port = process.env.PORT || 8000

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to parse from data(urlencoded)

app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/notification", notificationRoute);

app.listen(port, () => {
  console.log(`Server is runing on port ${port}.`);
  connectMongoDB();
});
