import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import jwt from 'jsonwebtoken';

export const verifyToken = async (req,res,next)=>{
  try{
    const token = req.cookies.token
    if(!token){
        throw new AppError("Unauthorized: No Token provided",401)
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
    if(!decoded){
        throw new AppError("Unauthorized: Invalid token",401)
    }
    const user = await User.findById(decoded.userId).select("-password");
    if(!user){
        throw new AppError("User not found",404)
    }
    req.user = user
    next()
  }catch(error){
    console.log(error)
    next(error)
  }
}