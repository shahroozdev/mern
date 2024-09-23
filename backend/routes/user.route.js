import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js'
import { changePassword, followUnfollowUser, getSuggestedUsers, getUserProfileByUsername, updateUserProfile } from '../controllers/profile.controller.js'

const route = express.Router()

route.get("/profile/:username", getUserProfileByUsername)
route.get("/suggested", getSuggestedUsers)
route.get("/follow/:id", protectRoute, followUnfollowUser)
route.post("/update", protectRoute, updateUserProfile)
route.put("/changePassword", protectRoute, changePassword)

export default route