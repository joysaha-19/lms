const asynchandler = require("express-async-handler");
const Users = require("../models/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const register = asynchandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400).send("All fields are mandatory");
    return 
    
  }
  const emailinuse = await Users.findOne({ email: email });
  if (emailinuse) {
    res.status(400).send("Email already in use");
    return 
  }
  const usernameinuse = await Users.findOne({ username: username });
  if (usernameinuse) {
    res.status(400).send("Username already in use");
    return 
  }
  const hashedpassword = await bcrypt.hash(password, 10);
  const added = await Users.create({
    username: username,
    email: email,
    password: hashedpassword,
    courses:[],
    progressReports:[]
  });
  if (added) {
    res.status(200).send("Registration Successful. Redirecting...");
    
  } else {
    res.status(400).send("User registration unsuccessful");
    
  }
});
const login= asynchandler(async(req,res)=>{
  const {username,password}=req.body;
  if(!username||!password){
      res.status(200).send("All fields are mandatory");
      
  }
  console.log(username)
  const usercheck=await Users.findOne({"username":username});
  if (usercheck&&await bcrypt.compare(password,usercheck.password))
      {
      //     const accesstoken=jwt.sign({
      //         user:{
      //             username:usercheck.username,
      //             email:usercheck.email,
      //             id:usercheck.id
      //              },
      //         },
              
      //         process.env.ACC_TOKEN,
              
      //         {expiresIn:"1d"}
      //     );
      //     res.status(200).send(accesstoken);
      //     // req.headers.authorization = `Bearer ${accesstoken}`;
      // }
      // else{
      // res.status(400).send("Incorrect email id or password");
      res.status(200).send("Logged in successfully. Redirecting...")
      
  }
  else{
    res.status(400).send("Invalid username or password.")
      
  }
  });

const current = asynchandler(async (req, res) => {
  res.json(req.user); //req.user=decoded.user in accesstokenhandler
});

const logout = (req, res) => {
  process.env.ACCESSTOKEN = " ";
  res.json("logged out successfully");
};

const update_profile = asynchandler(async (req, res) => {
  const { username, email } = req.body;

 try {
   // Find the user by their ID in the database

   const user = await Users.findById(req.user["id"]);
   console.log(user);
   if (!user) {
     return res.status(404).json({ message: 'User not found' });
   }

   // Update the username and email
   user.username = username;
   user.email = email;
   // console.log(user);
   // Save the updated user data to the database
   await user.save();

   // Return a success message
   res.json({ message: 'Profile updated successfully' });
 } catch (error) {
   // Handle any errors that occurred during the update process
   res.status(500).json({ message: 'Error updating profile', error: error.message });
 }
})
module.exports = { register, login, current, logout, update_profile };