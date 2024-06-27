import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import { v2 as cloudinary } from "cloudinary";



export const GetUserHandler = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("-password")
        res.status(200).json(user);
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const GetProfilebyUsername = async (req, res, next) => {
    try {
        const { username } = req.params
        const findUser = await User.findOne({ username }).select("-password")
        console.log(findUser)
        if (!findUser) {
            throw new AppError("User not found", 404)
        }
        res.status(200).json(findUser)
    } catch (error) {
        console.log(error)
        next(error)
    }
}
export const FollowUnfollowUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const userToModify = await User.findById(id)
        const currentuser = await User.findById(req.user._id)
        if (id === req.user._id.toString()) {
            throw new AppError("You can't follow/unfollow yourself", 400)
        }
        if (!userToModify || !currentuser) {
            throw new AppError("User not found")
        }
        const isFollowing = currentuser.following.includes(id);
        if (isFollowing) {
            //unfollow the user 
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } })
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } })
            // const newNotification = new Notification({
            //     type:"follow",
            //     from: req.user._id,
            //     to: userToModify._id,
            //  });
            //  await newNotification.save();
            res.status(200).json({ message: "User unfollowed successfully!" })
        } else {
            //follow the user
            // adding my id to the follower array of the people that following n
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } })
            // adding the peoples id to my array of following
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } })
            //send notification to the user
            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToModify._id,
            });
            await newNotification.save();
            res.status(200).json({ message: "User followed Successfully!" })
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
}


export const GetSuggestedUser = async (req, res, next) => {
    try {
        const userId = req.user._id
        const usersFollowByMe = await User.findById(userId).select("following");
        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId }
                }
            },
            { $sample: { size: 10 } }
        ])
        const filteredUsers = users.filter(user => !usersFollowByMe.following.includes(user._id))
        const suggestedUser = filteredUsers.slice(0, 4)
        suggestedUser.forEach(user => user.password = null)
        res.status(200).json(suggestedUser)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const UpdateUserProfile = async (req, res, next) => {
    try {
        let { fullName, email, userName, currentPassword, newPassword, bio, link } = req.body;
        let { profileImg, coverImg } = req.body;
        const userId = req.user._id;
        let user = await User.findById(userId);
        if (!user) {
            throw new AppError("User not found", 404)
        }
        if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
            throw new AppError("Please provide both current password and new password", 400)
        }
        if (currentPassword && newPassword) {
            const isMatch = user.comparePassword(currentPassword);
            if (!isMatch) {
                throw new AppError("Current password is incorrect", 400)
            }
            if (newPassword.length < 6) {
                throw new AppError("Password must be at least 6 characters long", 400)
            }
            user.password = newPassword
        }
        if (profileImg) {
            //deleting the previous image in cloudinary,which make use of the image id
             if(user.profileImg){
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
             }
             //uploading new image in cloudinary
            const uploadedResponse = await cloudinary.uploader.upload(profileImg)
            profileImg = uploadedResponse.secure_url
        }
        if (coverImg) {
            if(user.coverImage){
                await cloudinary.uploader.destroy(user.coverImage.split("/").pop().split(".")[0])
             }
            const uploadResponse = await cloudinary.uploader.upload(coverImg)
            coverImg = uploadResponse.secure_url
        }
        user.fullname = fullName || user.fullname;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.username = userName || user.username;
        user.profileImg = profileImg || user.profileImg;
        user.coverImage = coverImg || user.coverImage;

        user = await user.save()
        user.password = null
        return res.status(200).json(user)
    } catch (error) {
     console.log(error)
     next(error)
    }
}