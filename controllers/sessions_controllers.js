const bcrypt = require('bcrypt')
const express = require('express')
const sessions = express.Router()
const User = require('../models/users.js')

//LOG IN ROUTE
sessions.get('/', (req,res)=>{
    res.render('session/login.ejs')
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
            if(bcrypt.compareSync(req.body.password, foundUser.password)){
                req.session.currentUser = foundUser
                res.redirect('/restaurant')
            }else{
                res.send('<a href="/">Password does not match</a>')
            }
        }
    })
})

sessions.delete('/', (req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/restaurant')
    })
})


module.exports = sessions