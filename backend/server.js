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

dotenv.config();

cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET,
});
const port = process.env.PORT || 8000

const __dirname = path.resolve();
app.use(express.json({limit:"5mb"}));
app.use(express.urlencoded({ extended: true })); // to parse from data(urlencoded)

app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/notification", notificationRoute);

if(process.env.NODE_ENV ==="production"){
  app.use(express.static(path.join(__dirname, "frontend/dist")))

  app.use("*", (res, req)=>{
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  })
}

app.listen(port, () => {
  console.log(`Server is runing on port ${port}.`);
  connectMongoDB();
});

export default app;