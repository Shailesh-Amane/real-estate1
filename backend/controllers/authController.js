const authController = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

authController.post('/register', async(req, res) => {
    try {
      
      const isExisting = await User.findOne({email: req.body.email})
      
      if(isExisting){
        return res.status(500).json({msg: "Email is already taken by another user."})
        
      }
      // const hashedPassword = await bcrypt.hash(req.body.password, 10 )
      const hashedPassword = await bcrypt.hash(req.body.password,11 )
      // const hashedPassword = await bcrypt.hash("Shailesh_2", 10 )
      
      const newUser = await User.create({...req.body, password: hashedPassword})
      // console.log("hey")
      const {password, ...others} = newUser._doc
      const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '4h'})

      return res.status(201).json({others, token})
    } catch (error) {
        return res.status(500).json(error.message)
        // return res.status(500).json({msg: 'this is it'})
    }
})

authController.post("/login", async(req, res) => {
    try {
       const user = await User.findOne({email: req.body.email})
       if(!user){
        return res.status(500).json({msg: 'Wrong credentials. Try again!'})
       }


      //  const comparePass = await bcrypt.compare(req.body.password, user.password)
       const comparePass = await bcrypt.compare(req.body.password, user.password)
      //  const comparePass = await bcrypt.compare("Shailesh_2", user.password)
       if(!comparePass){
         return res.status(500 ).json({msg: 'Wrong credentials.'})
        }
        
        const {password, ...others} = user._doc
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '4h'})
        
        console.log({others, token})
       return res.status(200).json({others, token})
    } catch (error) {
        // return res.status(500).json(error.message)
        return res.status(500).json("This is it")
    }
})


module.exports = authController