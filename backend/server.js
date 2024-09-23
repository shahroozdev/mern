import express from "express"
import authRoute from "./routes/auth.route.js"
import dotenv from "dotenv"
import connectMongoDB from "./db/db.connect.js";

const app = express();

dotenv.config()

app.use("/api/auth", authRoute)

app.listen(process.env.PORT ||8000, ()=>{
    console.log("Server is runing on port 8000.")
    connectMongoDB();
})
