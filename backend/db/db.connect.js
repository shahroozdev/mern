import mongoose from "mongoose";

const connectMongoDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB_URI)
        console.log(`MongoBD connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error connection to MongoDB: ${error.message}`)
        process.exit(1)
    }
}

export default connectMongoDB