import User from "../models/user.model.js";

export const checkUserExists = async ( userId, res)=>{
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return user;
}