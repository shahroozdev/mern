import { checkUserExists } from "../lib/generalFunc.js";
import Notification from "../models/notification.model.js";

export const getAllNotifications = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await checkUserExists(userId, res)

    const notifications = await Notification.find({to:userId}).sort({createdAt: -1})
    .populate({
        path:'from',
        select:'username profileImage'
    })


    if(!notifications){
        return res.status(404).json({error:'Notifications not found.'})
    }

    await Notification.updateMany({to:userId}, {read:true})

    return res.status(200).json(notifications)
  } catch (error) {
    return res.status(500).json({
      error: `Some error occurs on Sever. Try again. ${error.message}`,
    });
  }
};
export const deleteNotifications = async (req, res) => {
  const userId = req.user._id;
  try {
    await Notification.deleteMany({to:userId})

    return res.status(200).json({message:'All notifications deleted successfully'})
  } catch (error) {
    return res.status(500).json({
      error: `Some error occurs on Sever. Try again. ${error.message}`,
    });
  }
};
export const deleteNotification = async (req, res) => {
  const {id} = req.params;
  try {
   const notification= await Notification.findById(id)
    if(!notification){
        return res.status(404).json({message:'Notification not found.'})
    }
    if(notification.to.toString() !== req.user._id){
        return res.status(200).json({message:'You are not authorized to delete this notification.'})
    }
    await Notification.findByIdAndDelete(id)
    return res.status(200).json({message:'Notification deleted successfully.'})
  } catch (error) {
    return res.status(500).json({
      error: `Some error occurs on Sever. Try again. ${error.message}`,
    });
  }
};
