const express = require('express');
const router = express.Router();
const Post = require('../models/post.model');
const authMiddleware = require('../middlewares/auth.middleware');

//Create Post Route
router.post('/', authMiddleware , async (req,res)=>{
    try{
        const {title , content} = req.body;
        const post = new Post({
            title,
            content,
            user: req.user.id
        });

        await post.save();

        res.status(201).json({ message: "Post Created Successfully", post});
    }catch(error){
        res.status(500).json({error: error.message});
    }
});

//Get All Posts
router.get('/', authMiddleware, async (req, res)=>{
    try{
        const posts = await Post.find({user: req.user.id}).sort({ createdAt: -1});
        res.status(200).json({ posts});
    }catch(error){
        res.status(500).json({ error : error.message});
    }
});

//Delete Post Route
router.delete('/:id', authMiddleware, async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);

        if(!post){
            return res.status(404).json({ message: "Post not Found"});
        };

        if(post.user.toString() !== req.user.id){
            return res.status(401).json({message: "Not authorized to delete this post"})
        };

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"Post deleted successfully"});
    }catch(error){
        res.status(500).json({error: error.message})
    }
})

module.exports = router;