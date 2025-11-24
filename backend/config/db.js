import mongoose from "mongoose";

export const connectDB = async()=>{
    (await mongoose.connect('mongodb+srv://RaviBhatiya:Ravi2005@cluster0.58d2doq.mongodb.net/Happy_Street'))
}
















