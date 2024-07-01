import { RiEqualizer3Fill } from "react-icons/ri"
import Notification from "../models/notificationModel.js"
import Post from "../models/postModel.js"
import User from "../models/userModel.js"
import { CreatePostSchema, PostCommentSchema } from "../schema/postSchema.js"
import AppError from "../utils/AppError.js"
import { v2 as cloudinary } from "cloudinary"


export const CreatePostHandler = async (req, res, next) => {
    try {
        const request = CreatePostSchema.parse(req.body)
        console.log(req.body)
        const userId = req.user._id.toString()
        const user = await User.findById(userId)
        if (!user) {
            throw new AppError("User not found", 404)
        }
        if (!req.file) {
            throw new AppError("Image is required", 400)
        }
        const image = req.file
        const base64Image = Buffer.from(image.buffer).toString("base64")
        const dataURI = `data:${image.mimetype};base64,${base64Image}`;
        const uploadedImage = await cloudinary.uploader.upload(dataURI)
        const newImage = uploadedImage.secure_url
        const newPost = new Post({
            user: userId,
            text: request.text,
            img: newImage
        })
        await newPost.save()
        res.status(201).json(newPost)
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const DeletePosthandler = async(req,res,next)=>{
    try{
      const post = await Post.findById(req.params.id)
      if(!post){
        throw new AppError("Post not found",404)
      }
      if(post.user._id.toString() !== req.user._id.toString()){
        throw new AppError("you are not authorized to delete this post",400)
      }
      if(post.img){
        const imgId = post.img.split("/").pop().split(".")[0]
        await cloudinary.uploader.destroy(imgId);
      }
      await Post.findByIdAndDelete(req.params.id)
      res.status(200).json({message:"Post deleted successfully!"})
    }catch(error){
        console.log(error)
        next(error)
    }
}

export const CommentOnPostHandler = async(req,res,next)=>{
    try{
       const request = PostCommentSchema.parse(req.body)
       const postId = req.params.id;
       const userId = req.user._id
       const post = await Post.findById(postId)
       if(!post){
         throw new AppError("Post not Found",404)
       }
       const comment = {user:userId,text:request.text}
       post.comments.push(comment)
       await post.save();
       res.status(201).json(post.comments)
    }catch(error){
      console.log(error)
      next(error)
    }
}

export const LikeUnlikePostHandler = async(req,res,next)=>{
    try{
      const userId = req.user._id
      const postId = req.params.id
      const post = await Post.findById(postId)
      if(!post){
        throw new AppError("Post not found")
      }
      const existingLike = post.likes.includes(userId)
      if(existingLike){
        //user already like the post before,unlike the post
        await post.updateOne({ $pull: { likes: userId } });
        await User.updateOne({_id:userId},{$pull:{likedPosts:postId}})

        const updatedLikes = post.likes.filter((id)=> id.toString() !== userId.toString());
        res.status(200).json(updatedLikes)
      }else{
         post.likes.push(userId);
         await User.updateOne({_id:userId},{$push:{likedPosts:postId}})
         await post.save()
         // create a notification
         const notification  = new Notification({
            from:userId,
            to:post.user._id,
            type:"like"
         })
         await notification.save();
         const updatedLikes = post.likes
         res.status(200).json(updatedLikes)
      }
    }catch(error){
        console.log(error)
        next(error)
    }
}

export const GetAllPostHandler = async(req,res,next)=>{
    try{
     const posts = await Post.find().sort({createAt:-1}).populate({
        path:"user",
        select:"-password"
     }).populate({
        path:"comments.user",
        select:"-password"
     })
     if(posts.length === 0){
        return res.status(200).json([])
     }
     res.status(200).json(posts)
    }catch(error){
      console.log(error)
      next(error)
    }
}


export const GetLikedPostHandler = async(req,res,next)=>{
    try{
      const userId= req.params.id;
      const user = await User.findById(userId)
      if(!user){
        throw new AppError("User not found",404)
      }
      const likedPosts = await Post.find({_id:{$in:user.likedPosts}}).populate({
        path:"user",
        select:"-password"
      }).populate({
        path:"comments.user",
        select:"-password"
      })
      res.status(200).json(likedPosts)
    }catch(error){
      console.log(error)
      next(error)
    }
}

export const GetFollowingPost = async (req,res,next)=>{
    try{
     const userId = req.user._id
     const user = await User.findById(userId);
     if(!user){
        throw new AppError("User not found",404)
     }
     const following = user.following
     const feedPost = await Post.find({user:{$in:following}}).sort({createdAt:-1}).populate({
        path:"user",
        select:"-password"
     })
     .populate({
        path:"comments.user",
        select:"-password"
     })
     res.status(200).json(feedPost)
    }catch(error){
        console.log(error)
        next(error)
    }
}

export const GetUserPostHandler = async (req,res,next)=>{
    try{
     const {username} = req.params
     const user = await User.findOne({username})
     if(!user){
        throw new AppError("User not found")
     }
     const posts = await Post.find({user:user._id}).sort({createdAt: -1}).populate({
        path:"user",
        select:"-password"
     }).populate({
        path:"comments.user",
        select:"-password"
     })
     res.status(200).json(posts)
    }catch(error){
        console.log(error)
        next(error)
    }
}