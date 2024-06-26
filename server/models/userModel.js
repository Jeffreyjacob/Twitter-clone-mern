import mongoose from "mongoose";
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    fullname:{type:String,required:true},
    password:{type:String,required:true,minLength:6},
    email:{type:String,required:true,unique:true},
    followers:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:[]
       },
    ],
    following:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:[]
       },
    ],
    profileImg:{type:String,default:""},
    coverImage:{type:String,default:""},
    bio:{type:String,default:""},
    link:{type:String,default:""}

},{timestamps:true})

userSchema.pre("save",async function(next){
  if(!this.isModified("password")){
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password,salt)
  next()
})

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
 }

const User = mongoose.model("User",userSchema);

export default User