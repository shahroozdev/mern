import { v2 as cloudaniry } from "cloudinary";
import Post from "../models/post.model.js";
import { checkUserExists } from "../lib/generalFunc.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export const createPost = async (req, res) => {
  let { text, img } = req.body;

  try {
    const userId = req.user._id;
    await checkUserExists(userId, res);

    if (!text && !img) {
      return res.status(422).json({ error: "Post must have text or image." });
    }
    if (img) {
      const response = await cloudaniry.uploader.upload(img).catch((err)=> {console.log(err)});
      img = response.secure_url;
    }
    const newPost = new Post({
      user: userId,
      text,
      img,
    });
    await newPost.save();
    return res.status(200).json({ message: "Post created successfully." ,post:newPost});
  } catch (error) {
    return res.status(500).json({
      error: `Some error occurs on Sever. Try again. ${error.message}`,
    });
  }
};
export const likeUnlikePost = async (req, res) => {
  try {
    let {id} = req.params;
    const userId = req.user._id;
    const post = await Post.findById(id);
    if(!post){
        return res.status(404).json({error:"Post not found."})
    }
    const isUserLikedPostBefore = post.likes.includes(userId)
    if(isUserLikedPostBefore){
        await Post.updateOne({_id:id},{$pull:{likes:userId}})
        await User.updateOne({_id:userId},{$pull:{likedPosts:id}})
        const updatedLikes = post.likes.filter((key)=>(key._id.toString() !== userId.toString()))
        return res.status(200).json({message:"Post unliked.", updatedLikes})
    }else{
        post.likes.push(userId)
        await post.save();
        await User.updateOne({_id:userId},{$push:{likedPosts:id}})
        const notification = new Notification({
            from:userId,
            to:post.user,
            type:"like"
        })
        await notification.save();
        const updatedLikes = post.likes
        return res.status(200).json({message:"Post liked.", updatedLikes})
    }
  } catch (error) {
    return res.status(500).json({
      error: `Some error occurs on Sever. Try again. ${error.message}`,
    });
  }
};
export const commentOnPost = async (req, res) => {
  const userId = req.user._id;
  const {id} = req.params;
  const {text}= req.body;
  try {
    const post = await Post.findById(id)
    if(!id){
        return res.status(404).json({error:"Post not found."})
    }
    if(!text){
        return res.status(422).json({error:"comment should not be empty."})
    }
    const comment = {user:userId, text}
    
    post.comments.push(comment);
    await post.save();
    return res.status(200).json({message:"comment send successfully."})
  } catch (error) {
    return res.status(500).json({
      error: `Some error occurs on Sever. Try again. ${error.message}`,
    });
  }
};
export const deletePost = async (req, res) => {
  try {
    const {id} = req.params;
    const post = await Post.findById(id)
    if(!post){
        return res.status(422).json({error:"Post not found."})
    }
    if(post.user.toString() !== req.user._id.toString()){
        return res.status(422).json({error:"You are not authorized to delete this post."})
    }
    if(post.img){
        const imgName= post.img.split('/').pop().split('.')[0]
        await cloudaniry.uploader.destroy(imgName)
    }
    await Post.findByIdAndDelete(id)
    return res.status(200).json({message:"Post deleted successfully."})
  } catch (error) {
    return res.status(500).json({
      error: `Some error occurs on Sever. Try again. ${error.message}`,
    });
  }
};
export const getAllPosts = async (req, res) => {
  try {
    const allpost = await Post.find().sort({createdAt: -1}).populate({
        path:'user',
        select:'-password'
    }).populate({
        path:'comments.user',
        select:'-password'
    })

    if(allpost.legth === 0){
        return res.status(200).json({allpost:[]})
    }

    return res.status(200).json(allpost)
  } catch (error) {
    return res.status(500).json({
      error: `Some error occurs on Sever. Try again. ${error.message}`,
    });
  }
};
export const getAllFollowingPosts = async (req, res) => {
    const userId = req.user._id;
  try {
    const user = await checkUserExists(userId, res)
    const following = user.following;
    const allFollowingPost = await Post.find({user:{$in:following}}).sort({createdAt:-1}).populate({
        path:'user',
        select:'-password'
    }).populate({
        path:'comments.user',
        select:'-password'
    })

    if(allFollowingPost.legth === 0){
        return res.status(200).json({allFollowingPost:[]})
    }

    return res.status(200).json(allFollowingPost)
  } catch (error) {
    return res.status(500).json({
      error: `Some error occurs on Sever. Try again. ${error.message}`,
    });
  }
};
export const getAllLikedPosts = async (req, res) => {
    const userId = req.params.id;
  try {
    const user = await checkUserExists(userId, res)
    const likedPosts = await Post.find({_id:{$in: user.likedPosts}}).populate({
        path:'user',
        select:'-password'
    }).populate({
        path:'comments.user',
        select:'-password'
    })

    if(likedPosts.legth === 0){
        return res.status(200).json({allLikePost:[]})
    }

    return res.status(200).json(likedPosts)
  } catch (error) {
    return res.status(500).json({
      error: `Some error occurs on Sever. Try again. ${error.message}`,
    });
  }
};
export const getUserPosts = async (req, res) => {
    const username = req.params.username;
  try {
    const user = await User.findOne({username})
    const allPosts = await Post.find({user:user._id}).sort({createdAt:-1}).populate({
        path:'user',
        select:'-password'
    }).populate({
        path:'comments.user',
        select:'-password'
    })

    if(allPosts.legth === 0){
        return res.status(200).json({allPosts:[]})
    }

    return res.status(200).json(allPosts)
  } catch (error) {
    return res.status(500).json({
      error: `Some error occurs on Sever. Try again. ${error.message}`,
    });
  }
};
