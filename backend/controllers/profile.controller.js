import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {v2 as cloudaniry} from "cloudinary"

export const getUserProfileByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne(username).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({
        error: `Some error occurs on Sever. Try again. ${error.message}`,
      });
  }
};
export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const usersFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          id: { $ne: userId },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users?.filter(
      (key) => !usersFollowedByMe?.following?.includes(key._id)
    );
    const suggestedUsers = filteredUsers
      ?.slice(0, 4)
      ?.map(({ password, ...rest }) => rest);
    res.status(200).json(suggestedUsers);
  } catch (error) {
    res
      .status(500)
      .json({
        error: `Some error occurs on Sever. Try again. ${error.message}`,
      });
  }
};
export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res
        .status(422)
        .json({ error: "You cannot follow/unfollow youself." });
    }

    if (!userToModify || !currentUser) {
      return res.status(404).json({ error: "User not found." });
    }
    const isFollowing = currentUser.followers.includes(id);

    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      const newNotification = await Notification({
        type: "follow",
        from: req.user._id,
        to: id,
      });
      return res.status(200).json({ error: "User unfollow successfully." });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      return res.status(200).json({ error: "User follow successfully." });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        error: `Some error occurs on Sever. Try again. ${error.message}`,
      });
  }
};
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, username, profileImage, coverImage, bio, link ,email} =req.body;

    let user = await User.findById(userId);

    console.log(user, 'user',req.body)
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    if(profileImage){
        if(user?.profileImage){
            const image_url = user?.profileImage?.split('/')?.pop()?.split('.')[0]
            await cloudaniry.uploader.destroy(image_url)
        }

        const response = await cloudaniry.uploader.upload(profileImage)
          profileImage = response.secure_url
          console.log(response)
    }
    if(coverImage){
        if(user?.coverImage){
            const image_url = user?.coverImage?.split('/')?.pop()?.split('.')[0]
            await cloudaniry.uploader.destroy(image_url)
        }

        const response = await cloudaniry.uploader.upload(coverImage)
            coverImage = response.secure_url
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImage = profileImage || user.profileImage;
    user.coverImage = coverImage || user.coverImage;

    user = await user.save();

    const {password, ...rest} = user

    res.status(200).json({message:'User updated successfully.', user:rest})
  } catch (error) {
    res
      .status(500)
      .json({
        error: `Some error occurs on Sever. Try again. ${error.message}`,
      });
  }
};
export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    if (!oldPassword || !newPassword) {
      return res
        .status(422)
        .json({ error: "Both password should not be empty." });
    }
    const isPasswordCorrect = await bcrypt.compare(oldPassword, user?.password);
    if (!isPasswordCorrect) {
    return res
      .status(422)
      .json({ error: "Old password not match." });
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({message:'Password updated successfully.'})
  } catch (error) {
    res
      .status(500)
      .json({
        error: `Some error occurs on Sever. Try again. ${error.message}`,
      });
  }
};
