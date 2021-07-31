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

sessions.get('/profile', (req,res)=>{
    res.render('not_available.ejs',
    {currentUser: req.session.currentUser})
})

//Cheking if user is logged in to show cart options
sessions.get('/kart', (req,res)=>{
    if(!req.session.currentUser.kart){
        res.render('users/kart.ejs',
        {currentUser: req.session.currentUser})
    }else{
        res.render('users/kart.ejs',
        {currentUser: req.session.currentUser,
        kart: req.session.currentUser.kart
    })
    }
})

sessions.get('/checkout', (req,res)=>{
    User.findById(req.session.currentUser._id, (err, foundUser)=>{
        if(err){
            console.log(err)
        }else{
            let itemsName = []
            let sum = 0
            for(let i = 0; i < foundUser.kart.length; i++){
                itemsName.push(foundUser.kart[i].name)
                sum += foundUser.kart[i].price
            }
            foundUser.kart.splice(0, foundUser.kart.length)
            foundUser.save((err, savedUser)=>{
                req.session.currentUser = savedUser
                console.log(savedUser.kart)
            res.send(`<div style="display: flex; justify-content: center; align-items: center; height: 700px; width: 100%"><div style="padding: 40px; box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.2);"><h1><span style="text-transform: capitalize; text-align: center;">${savedUser.username},</span> thank you for Shopping with us!</h1><p style="text-align: center; align-items: center;">You order Was <b>${itemsName}</b></p><p style="text-align: center; align-items: center;">Your Total is <b>$${sum}.00</b></p><p style="text-align: center;">You should be getting your food in the next 45mins</p>
            <h4 style="text-align: center;">Hope you enjoy it</h4><div style="display: flex; justify-content: center;"><a style="text-decoration: none; padding: 5px; border: 1px solid #000; color: black; text-align: center;"href="/restaurant">BACK TO RESTAURANT<a></div></div></div>`)
            })
        }
    })
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