const express = require('express')
const Restaurant = require('../models/restaurant.js')
const restaurant = express.Router()

restaurant.get('/new', (req,res)=>{
    res.render('new.ejs')
})
restaurant.post('/', (req,res)=>{
    console.log(req.body)
    res.send(req.body)
})

module.exports = restaurant