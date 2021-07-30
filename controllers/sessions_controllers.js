const bcrypt = require('bcrypt')
const express = require('express')
const sessions = express.Router()
const User = require('../models/users.js')
const Restaurant = require('../models/restaurant.js')

//LOG IN ROUTE
sessions.get('/', (req,res)=>{
    res.render('session/login.ejs',
    {currentUser: req.session.currentUser})
})
//CREATING THE SECTION
sessions.post('/',(req,res)=>{
    User.findOne({username: req.body.username}, (err,foundUser)=>{
        if(err){
            console.log(err)
            res.send('oops the db had a problem')
        }else if(!foundUser){
            res.send('<a href="/restaurant">Sorry, no username found<a/>')
        }else{
            console.log(foundUser)
            if(bcrypt.compareSync(req.body.password, foundUser.password)){
                req.session.currentUser = foundUser
                res.redirect('/restaurant')
            }else{
                res.send('<a href="/">Password does not match</a>')
            }
        }
    })
})

//Cheking if user is logged in to show cart options
sessions.get('/kart', (req,res)=>{
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
sessions.put('/:id', (req,res)=>{
    User.findById(req.session.currentUser._id, (err,foundUser)=>{
        Restaurant.findById(req.params.id, (err,foundDish)=>{
            if(err){
                console.log(err)
            }else{
                foundUser.kart.push(foundDish)
                foundUser.save((err, savedUser)=>{
                    req.session.currentUser = savedUser
                    res.redirect('/restaurant/show')
                })
            }
        })
    })
})

//DELETING FROM THE CART
sessions.delete('/:index', (req,res)=>{
    User.findById(req.session.currentUser._id, (err,foundUser)=>{
        foundUser.kart.splice(Number(req.params.index), 1)
        foundUser.save((err, savedUser)=>{
            req.session.currentUser = savedUser
            res.redirect('/sessions/kart')
        })
    })        
})


sessions.delete('/', (req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/restaurant')
    })
})

module.exports = sessions