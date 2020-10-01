const express = require('express')
const app = express();
const cors = require('cors')
const reg_model = require('../models/user_reg_model')
const jwt = require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const mongoose=require('mongoose')
const ss=require('../models/model_ss')

//post request for signup
app.post('/signup', async (req, res) => {
    try {        
        const user = await reg_model.create(req.body)
        const token=jwt.sign({id:user._id},'super-secret',{expiresIn:'30d'})
        res.status(201).json({
            status: 'user registered successfully',
            data: user,
            token
        })
    }
    catch (err) {
        res.status(401).json({
            err
        })
        }
});
//get request for signup data
app.get('/signup_get',async (req, res) => {
    const data=await reg_model.find();
    res.status(201).json({
        data
    })
})
//post request for login
app.post('/login', async (req,res)=>{
  const {email,password} = req.body
  if(!email || !password) res.send('please enter email and password')

 const user = await reg_model.findOne({email}).select('+password')
 const a=await bcrypt.compare(password,user.password)
 if(email===user.email && a)
 {
     res.status(201).json({
         status:'success',
         message:'You have logged in successfuly'
     })
 }
 else if(email!==user.email || !a){
    res.status(401).json({
        status:'failure',
        message:'Incorrect email id or password combination'
    })
 }

 })
//post request for slot selection
 app.post('/select_slot',async (req,res)=>{
    const sst=await ss.create(req.body)
    res.status(202).json({        
        customer_slot:sst        
    })        
})
//get request for display slot
app.get('/display_slot',async (req,res)=>{
    const slots=await ss.find();
    res.json({
        number_of_requested_slots:slots.length,
        data:slots
    })
})


module.exports = app;
