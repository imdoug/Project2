const bcrypt = require('bcrypt')
const express = require('express')
const users = express.Router()
const User = require('../models/users.js')
const Restaurant = require('../models/restaurant.js')
const { isValidObjectId } = require('mongoose')

//SIGN UP ROUTE
users.get('/', (req,res)=>{
    res.render('users/signup.ejs',
    {currentUser: req.session.currentUser})
})
// SIGN UP POST
users.post('/', (req,res)=>{
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    User.create(req.body, (err, createdUser)=>{
        if(err){
            console.log(err)
        }else{
            console.log('user is created', createdUser)
            res.redirect('/sessions')
        }
    })
})
users.get('/kart', (req,res)=>{
    if(!req.session.currentUser.kart){
        console.log(req.session.currentUser.kart)
        res.render('users/kart.ejs',
        {currentUser: req.session.currentUser})
    }else{
        console.log(req.session.currentUser.kart)
        res.render('users/kart.ejs',
        {currentUser: req.session.currentUser,
        kart: req.session.currentUser.kart
    })
    }
})

users.put('/:id', (req,res)=>{
    User.findById(req.session.currentUser._id, (err,foundUser)=>{
        Restaurant.findById(req.params.id, (err,myDish)=>{
            if(err){
                console.log(err)
            }else{
                foundUser.kart.push(myDish)
                foundUser.save()
                res.redirect('/restaurant/show')   
            }
        })
    })
})
users.delete('/:id', (req,res)=>{

})

module.exports = users