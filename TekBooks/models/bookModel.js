'use strict'

const mongoose = require('mongoose')
const bookModel = function(){
    var bookSchema = mongoose.Schema({
        title: String,
        category: String,
        author: String,
        description: String,
        publisher: String,
        cover: String,
        price: Number
    })

    bookSchema.methods.truncText = function(length) {
        return this.description.substring(0, length) + "…"
    }
    return mongoose.model('Book', bookSchema)
}

module.exports = new bookModel()