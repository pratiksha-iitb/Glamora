// this filw will connect our application to mongodb database
const mongoose=require("mongoose");
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongodb connected successfully");
    }catch(err){
        console.error("mongodb connection failed")
        process.exit(1);
    }
}
module.exports=connectDB;
