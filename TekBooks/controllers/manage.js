'use strict'
const Book = require('../models/bookModel')
const Category = require('../models/categoryModel')

module.exports = function(router){
    router.get('/', (req, res) => {
        res.render('manage/index')
    })
    router.get('/books', (req, res) => {
        Book.find({}, (err, books) => {
            if(err){
                console.error(err);
            }
            res.render('manage/books/index', {books})

        })
    })

    router.get('/books/add', (req, res) =>{
        Category.find({}, (err, categories) =>{
            if(err)
                console.error(err)

            res.render('manage/books/add', {categories})
        })
    })

    router.post('/books', (req, res) => {
        const {title, category, author, 
            publisher, price, description, 
            cover} = req.body
            if(title === '' || price === ''){
                req.flash('error', 'Please fill out required fields')
                res.location('/manage/books/add')
                return res.redirect('/manage/books/add')
            }
            if(isNaN(price)){
                req.flash('error', 'Please fill out required fields')
                res.location('/manage/books/add')
                return res.redirect('/manage/books/add')

            }
            const newBook = new Book({title, category, author, 
            publisher, price, description, cover})

            newBook.save((err) => {
                if(err){
                    console.error(err);
                }
                console.log("Locals B4", res.locals);
                req.flash('success', 'Book Created!')
                console.log("Locals After", res.locals);
                res.location('/manage/books')
                return res.redirect('/manage/books')
            })
        })

    router.get('/categories', (req, res) => {
        res.render('manage/categories/index')
    })
    
}