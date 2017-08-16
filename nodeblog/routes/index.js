var express = require('express');
var router = express.Router();
//const db = require('monk')('nodebloguser:nodebloguser@localhost:27017/nodeblog');

/* GET home page. */
router.get('/', function(req, res, next) {
	var db = req.db;
	var posts = db.get('posts');
	posts.find({},{},function(err, posts) {
		res.render('index', {title:"JS Node Blog", posts, preview:true})
	})
});

module.exports = router;
