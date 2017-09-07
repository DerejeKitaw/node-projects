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
        const {title, category, author, publisher, price, description, cover} = req.body
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

    router.get('/books/edit/:_id', (req, res) =>{
        let {_id} = req.params
        console.log("edit")
        Category.find({}, (err, categories) =>{
            Book.findOne({_id}, (err, book) => {
                if(err){
                    console.log(err)
                }
                res.render('manage/books/edit', {categories, book})
            })
        })
    })

    router.post('/books/edit/:_id', (req, res) =>{
        const { title, category, author, publisher, price, description, cover} = req.body
        const {_id} = req.params
        if(title === '' || price === ''){
            req.flash('error', 'Please fill out required fields')
            res.location(`/manage/books/edit/${_id}`)
            return res.redirect(`/manage/books/edit/${_id}`)
        }
        if(isNaN(price)){
            req.flash('error', 'Please fill out required fields')
            res.location(`/manage/books/edit/${_id}`)
            return res.redirect(`/manage/books/edit/${_id}`)

        }
        Book.update({_id}, { title, category, author, 
            publisher, price, description, 
            cover}, (err, book) => {
                if(err){
                    console.error(err);
                }
                req.flash('success', "Book Updated")
                res.location('/manage/books')
                res.redirect('/manage/books')
            })
    })

    router.post('/books/delete/:_id', (req, res) =>{
        const {_id} = req.params
        Book.remove({_id}, (err) => {
            if(err){
                return console.err(err)
            }
            req.flash("success", 'Book Deleted')
            res.location('/manage/books')
            res.redirect('/manage/books')
        })
    })

    router.get('/categories', (req, res) => {
        res.render('manage/categories/index')
    })
}