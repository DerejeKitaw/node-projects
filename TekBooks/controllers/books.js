'use strict'

const Book = require('../models/bookModel')
const Category = require('../models/categoryModel')

module.exports = function (router) {
    router.get('/', function (req, res) {
        res.render('index');
    })
    router.get('/details/:_id', function (req, res) {
        const {_id} = req.params
        Book.findOne({_id}, (err, book)=>{
            if(err){
                console.error(err);
            }
            const model = {
                book
            }
            res.render('books/details', model);
        })
    })
}
