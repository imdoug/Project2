const express = require('express')
const Restaurant = require('../models/restaurant.js')
const restaurant = express.Router()

//NEW PAGE
restaurant.get('/new', (req,res)=>{
    res.render('new.ejs')
})
//CREATE ON DATABASE
restaurant.post('/', (req,res)=>{
    Restaurant.create(req.body, (err, createdDish)=>{
        if(err){
            console.log(err)
        }else{
            console.log(createdDish)
            res.redirect('/restaurant') 
        }
    })
})
//INDEX ROUTE
restaurant.get('/', (req,res)=>{
    Restaurant.find({}, (err, allDishes)=>{
        if(err){
            console.log(err)
        }else{
            res.render('index.ejs', 
            {
                dishes: allDishes,
                currentUser: req.session.currentUser
            }
            )
        }
    })
})
//EDIT ROUTE
restaurant.get('/:id/edit', (req,res)=>{
    Restaurant.findById(req.params.id, (err, foundDish)=>{
        res.render('edit.ejs',
        {
            dish:foundDish,
            id: req.params.id
        }
        )
    })
})
// EDIT DATABASE
restaurant.post('/:id/edit', (req,res)=>{
    Restaurant.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, foundDish)=>{
        if(err){
            console.log(err)
        }else{
            res.redirect(`/restaurant/${req.params.id}`)
        }
    })
})
//DELETE
restaurant.delete('/:id', (req,res)=>{
    Restaurant.findByIdAndDelete(req.params.id, (err,foundDish)=>{
        console.log('removing ...',foundDish)
        if(err){
            console.log(err)
        }else{
            res.redirect('/restaurant')
        }
    })
})
//SHOW ROUTE
restaurant.get('/:id', (req,res)=>{
    Restaurant.findById(req.params.id, (err, foundDish)=>{
        if(err){
            console.log(err)
        }else{
            res.render('show.ejs',
            {
                dish: foundDish,
                id: req.params.id
            }
            )
        }
    })
})

module.exports = restaurant