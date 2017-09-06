'use strict'

const mongoose = require('mongoose')
const categoryModel = function(){
    var categorySchema = mongoose.Schema({
        name: String    
    })


    return mongoose.model('Category', categorySchema)
}

module.exports = new categoryModel()