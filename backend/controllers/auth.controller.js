import User from "../models/user.model.js";
import { validEmailRegix } from "../constant/constant.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const signUp = async (req, res) => {
  try {
    const { email, username, fullName, password } = req.body;

    if (!validEmailRegix.test(email)) {
      return res.status(422).json({ error: "Email is not Valid." });
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(422).json({ error: "Username already Exist." });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(422).json({ error: "Email already Exist." });
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      username,
      password: hashedPass,
    });
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
    res
      .status(201)
      .json({user:{
        _id: newUser?._id,
        fullName: newUser?.fullName,
        username: newUser?.username,
        email: newUser?.email,
        followers: newUser?.followers, 
        following: newUser?.following, 
        profileImage:newUser?.profileImage,
        coverImage:newUser?.coverImage,
        bio:newUser?.bio
      },message:'User created successfully.'});
    }else{
        res.status(422).json({error:"Invalid user data."})
    }
  } catch (error) {
    res.status(500).json({error:`Some error occurs on Sever. Try again. ${error.message}`})
  }
};
export const login = async(req, res) => {
    try {
        const { username, password } = req.body;
    
        const isExistingUsername = await User.findOne({ username });
        if (!isExistingUsername) {
          return res.status(422).json({ error: "No user found with this Username." });
        }
        const isPasswordCorrect = await bcrypt.compare(password,isExistingUsername.password || "")
        if(!isPasswordCorrect){
            return res.status(422).json({ error: "Wrong Password" });
        }
        generateTokenAndSetCookie(isExistingUsername._id, res);
        res
      .status(201)
      .json({user:{
        _id: isExistingUsername._id,
        fullName: isExistingUsername.fullName,
        username: isExistingUsername.username,
        email: isExistingUsername.email,
        followers: isExistingUsername.followers, 
        following: isExistingUsername.following, 
        profileImage:isExistingUsername.profileImage,
        coverImage:isExistingUsername.coverImage,
        bio:isExistingUsername.bio
      },message:"Log in successfully."});
      } catch (error) {
        res.status(500).json({error:`Some error occurs on Sever. Try again. ${error.message}`})
      }
};
export const logout = (req, res) => {
  try {
        res.cookie("jwt" ,"",{maxAge:0})
        res.status(200).json({message:"Logged out successfully."})
  } catch (error) {
    res.status(500).json({error:`Some error occurs on Sever. Try again. ${error.message}`})
  }
};
export const getMe = async (req, res) => {
  try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user)
  } catch (error) {
    res.status(500).json({error:`Some error occurs on Sever. Try again. ${error.message}`})
  }
};
