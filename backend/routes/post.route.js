import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js';
import { commentOnPost, createPost, deletePost, likeUnlikePost, getAllPosts, getAllLikedPosts, getAllFollowingPosts, getUserPosts} from '../controllers/post.controller.js';

const route = express.Router();

route.get('/all',protectRoute, getAllPosts)
route.get('/allLikedPost/:id',protectRoute, getAllLikedPosts)
route.get('/allFollowingPost',protectRoute, getAllFollowingPosts)
route.get('/userPosts/:username',protectRoute, getUserPosts)
route.post('/create',protectRoute, createPost)
route.get('/like/:id',protectRoute, likeUnlikePost)
route.post('/comment/:id',protectRoute, commentOnPost)
route.delete('/:id',protectRoute, deletePost)

export default route