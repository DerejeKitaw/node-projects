'use strict';

var IndexModel = require('../models/index');
const Book = require('../models/bookModel')

module.exports = function (router) {


    router.get('/', function (req, res) {
        Book.find({}, (err, books) =>{
            if(err){
                console.error(err);
            }
            for(var book of books){
                book.truncText = book.truncText(50)
            }
            let model = {
                books
            }
            res.render('index', model)
        })
    });

};
