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
//Cheking if user is logged in to show cart options
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
//ADDING TO THE CART 
users.put('/:id', (req,res)=>{
    User.findById(req.session.currentUser._id, (err,foundUser)=>{
        Restaurant.findById(req.params.id, (err,foundDish)=>{
            if(err){
                console.log(err)
            }else{
                foundUser.kart.push(foundDish)
                foundUser.save()
                    res.redirect('/users/kart')
            }
        })
    })
})
//DELETING FROM THE CART
users.delete('/:index', (req,res)=>{
    User.findById(req.session.currentUser._id, (err,foundUser)=>{
        foundUser.kart.splice(req.params.index, 1)
        foundUser.save()
        res.redirect('/users/kart')
    })        
})

module.exports = users