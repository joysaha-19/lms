const mongoose= require("mongoose");
const connectDb= async()=>{
   try{
    const connect= await mongoose.connect('mongodb+srv://Joydeep:nathandrake01@lms.vqlo6ym.mongodb.net/?retryWrites=true&w=majority&appName=LMS');
    console.log("Database connected: ",connect.connection.host,connect.connection.name);
   }
   catch(err)
   {
    console.log(err);
    process.exit(1);
   }

};
module.exports=connectDb;