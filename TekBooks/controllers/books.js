'use strict'

module.exports = function (router) {
    router.get('/', function (req, res) {
        res.render('index');
    })
    router.get('/details/:_id', function (req, res) {
        res.render('books/details');
    })
}
