const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {protect}=require("../middleware/authMiddleware")
const router = express.Router();

// @route   POST /api/users/login
// @desc    authenticate user
// @access  Public

router.post("/login", async (req, res) => {
  const {email, password } = req.body;

  try {
    // find the user by email
    let user=await User.findOne({email});
    if(!user) return res.status(400).json({message:"invalid credentials"})
    const isMatch=await user.matchPassword(password)
    if(!isMatch) return res.status(400).json({message:"invalid credentials"})

    //create JWT payload 
    const payload={user:{id: user._id,role: user.role}};
    //sign and return the token along with user data
    // a method to generate the token
    jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"40h"},(err,token)=>{
      if (err) throw err;
      //send user and token in response
      res.json({
        user:{
          _id:user._id,
          name:user.name,
          email:user.email,
          role:user.role,
        },
        token,
      })
    })
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Registration logic placeholder
    let user=await User.findOne({email});
    if(user) return res.status(400).json({message:"user already exist"})
    user=new User({name,email,password});
    await user.save();
    //create JWT payload 
    const payload={user:{id: user._id,role: user.role}};
    //sign and return the tyoken along with user data
    // a method to generate the token
    jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"40h"},(err,token)=>{
      if (err) throw err;
      //send user and token in response
      res.status(201).json({
        user:{
          _id:user._id,
          name:user.name,
          email:user.email,
          role:user.role,
        },
        token,
      })
    })
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// @route   POST /api/users/profile
// @desc    fet logged-in user's profile(Protected route)
// @access  Private

router.get("/profile" ,protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
