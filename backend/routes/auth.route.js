import express from "express"
import { getMe, login, logout, signUp } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const route =express.Router();

route.post("/signUp",signUp);
route.post("/logIn", login);
route.post("/logOut", logout);
route.get("/getMe",protectRoute, getMe)



export default route;