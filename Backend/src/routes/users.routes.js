const express = require('express');
const User = require('../models/users.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

//Register 
router.post('/register', async (req,res)=>{
    try{
        const {name , email , password} = req.body;

        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            });
        }

        const user = new User({name,email,password});
        await user.save();

        res.status(201).json({
            message:"User created successfully",
            user
        })

    }catch(error){
        res.status(500).json({
        error: error.message
        })
    }
});


//Login
router.post('/login', async (req,res)=>{

    try{
        const {email , password} = req.body;

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: "Invaild email or password" })
        }

        //Compare Password

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid email or password"})
        };

        //Generate JWT Token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET,{
            expiresIn:'3d'
        });

        res.status(200).json({message:"Login Successful",token});
    }catch(error){
        res.status(500).json({ error: error.message });
    }

});

//Protected Route
router.get('/profile', authMiddleware , async (req,res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({ user });
    }catch(error){
        res.status(500).json({error: error.message})
    }
});

//Update Profile Route
router.put('/update', authMiddleware, async(req,res)=>{
    try{
        const { name, email } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {name , email},
            {new: true}
        ).select('-password');
    }catch(error){
        res.status(500).json({error: error.message})
    }
});

//Delete Account Route
router.delete('/delete', authMiddleware , async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.user.id);
        res.status(200).json({message: "Account Deleted Successfully"})
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

module.exports = router;