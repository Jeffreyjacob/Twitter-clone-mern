import express from 'express'
import dotenv from "dotenv";
import authRoutes from './routes/auth.js'
import cors from "cors";
import cookieParser from 'cookie-parser';
import connectToDB from './db/connect.js';
import errorMiddleware from './middleware/errorHandler.js';

dotenv.config();

const app = express()
const PORT = process.env.PORT || 6000

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use(cookieParser())


app.use("/api/v2/auth",authRoutes)

app.use(errorMiddleware)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
    connectToDB()
})