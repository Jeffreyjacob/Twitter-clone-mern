import User from "../models/userModel.js"
import { LoginSchema, SignUpSchema } from "../schema/authSchema.js"
import AppError from "../utils/AppError.js"
import { genereateTokenAndSetCookie } from "../utils/token.js"


export const SignUpHandler = async(req,res,next)=>{
    try{
      const request = SignUpSchema.parse(req.body)
      const existingUser = await User.findOne({username:request.username})
      if(existingUser){
        throw new AppError("Username is already taken",400)
      }
      const existingEmail = await User.findOne({email:request.email})
      if(existingEmail){
        throw new AppError("Email is already taken",400)
      }
      const newUser = new User(request)
       genereateTokenAndSetCookie(newUser._id,res)
       await newUser.save()
       res.status(201).json({
        _id:newUser._id,
        fullname:newUser.fullname,
        username:newUser.username,
        email:newUser.email
       })
    }catch(error){
      console.log(error)
      next(error)
    }
}

export const LoginHandleer = async (req,res,next)=>{
    try{
       const request = LoginSchema.parse(req.body)
       const user = await User.findOne({username:request.username})
       if(!user){
        throw new AppError("Invalid user credentials",401)
       }
       const password = await user.comparePassword(request.password);
       if(!password){
        throw new AppError("Invalid user credentials",401)
       }
       genereateTokenAndSetCookie(user._id,res)
       res.status(200).json({
        _id:user._id,
        fullname:user.fullname,
        username:user.username,
        email:user.email
       })
    }catch(error){
     console.log(error)
     next(error)
    }
}

export const LogOutHandler = async(req,res,next)=>{
    try{
       res.cookie("token","",{maxAge:0})
       res.status(200).json({message:"Logout successfully!"})
    }catch(error){
      console.log(error)
      next(error)
    }
}

export const GetUserHandler = async (req,res,next)=>{
    try{
       const user = await User.findById(req.user._id).select("-password")
       res.status(200).json(user);
    }catch(error){
        console.log(error)
        next(error)
    }
}