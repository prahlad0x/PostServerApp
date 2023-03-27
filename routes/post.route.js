const {PostModel} = require('../models/post.model')
const express = require('express')
require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const postRouter = express.Router()
postRouter.use(express.json())


postRouter.get('/',async(req,res)=>{
    try {
        const {userId } = req.body;
        const {device = ["Laptop", "Tablet", "Mobile"],page,min,max} = req.query
        // const posts = await PostModel.find({userId})
        const posts = await PostModel.find({$and : [{userId}, {device : {$in:device}}]})
        res.status(200).send({msg:"Posts",posts: posts})
    } catch (error) {
        res.status(400).send({msg: error.message})
    }
})
postRouter.get('/top',async(req,res)=>{
    try {
        const {userId } = req.body;
        const {device = ["Laptop", "Tablet", "Mobile"],page,min,max} = req.query
        // const posts = await PostModel.find({userId})
        const posts = await PostModel.find({$and : [{userId}, {device : {$in:device}}]})
        let m = 0;
        let x  = ''
        for(let i of posts){
            if(posts[i].no_of_comments > m){
                m = posts[i].no_of_comments
                x = posts[i]
            }
        }
        res.status(200).send({msg:"Posts",posts: x})
    } catch (error) {
        res.status(400).send({msg: error.message})
    }
})


postRouter.get('/:id' , async(req,res)=>{
    try {
        let postID = req.params.id
        const post = await PostModel.findOne({_id : postID})
        res.status(200).send({msg:"Post",post: post})
    } catch (err) {
        res.status(400).send({msg: error.message})
    }
})



postRouter.post('/add',async(req,res)=>{
    try {
        let post = new PostModel(req.body)
        await post.save()
        res.status(200).send({msg: "Post Added Successfully."})
    } catch (error) {
        res.status(400).send({msg: error.message})
    }
})


postRouter.patch('/update/:id',async(req,res)=>{
    try {
        let id = req.params.id;
        await PostModel.findByIdAndUpdate({_id:id}, req.body)
        res.status(200).send({msg: "Post Updated Successfully."})
    } catch (error) {
        res.status(400).send({msg: error.message})
    }
})

postRouter.delete('/delete/:id',async(req,res)=>{
    try {
        let id = req.params.id;
        await PostModel.findByIdAndDelete({_id:id})
        res.status(200).send({msg: "Post Deleted Successfully."})
    } catch (error) {
        res.status(400).send({msg: error.message})
    }
})

module.exports = {postRouter}