import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js';
import { deleteNotifications, getAllNotifications, deleteNotification } from '../controllers/notification.controller.js';

const route  = express.Router();

route.get('/allNotifications', protectRoute, getAllNotifications)
route.get('/delete', protectRoute, deleteNotifications)
route.get('/delete/:id', protectRoute, deleteNotification)

export default route