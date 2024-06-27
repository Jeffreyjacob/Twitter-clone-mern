import express from 'express'
import dotenv from "dotenv";
import authRoutes from './routes/auth.js'
import cors from "cors";
import cookieParser from 'cookie-parser';
import connectToDB from './db/connect.js';
import errorMiddleware from './middleware/errorHandler.js';
import userRoutes from "./routes/user.js"
import { v2 as cloudinary} from 'cloudinary';

dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const app = express()
const PORT = process.env.PORT || 6000

//middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(cookieParser())

// routes
app.use("/api/v2/auth",authRoutes)
app.use("/api/v2/user",userRoutes)

app.use(errorMiddleware)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
    connectToDB()
})