const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
    name: {type: String, required: true},
    ingredients: {type: String, required: true},
    img: String,
    price: {type: Number, required: true},
    tags: {type: String, required:true}
})

const Restaurant = mongoose.model('Restaurant', restaurantSchema)

module.exports = Restaurant