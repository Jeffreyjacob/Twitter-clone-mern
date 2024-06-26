import mongoose from 'mongoose';


const connectToDB = async()=>{
    try{
      const conn = await mongoose.connect(process.env.MONOGODB_URI)
      console.log(`MongoDB connected: ${conn.connection.host}`)
    }catch(error){
        console.error(`Error connection to mongoDB: ${error}`)
        process.exit(1)
    }
}

export default connectToDB;