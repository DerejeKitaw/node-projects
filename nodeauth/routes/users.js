var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest:'./uploads'});
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
	User.getUserByUsername(username, function(err, user) {
		if(err) throw err;
		if(!user){
			return done(null, false, {message: 'Unknown User'});
		}
		User.comparePassword(password, user.password, function(err, isMatch) {
			if(err) return done(err);
			if(isMatch){
				return done(null, user)
			} else {
				return done(null, false, {message: 'Invalid password'});
			}
		})
	} )
}))
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.post('/register', upload.single('profile_image'), function(req, res, next) {
  var {name, email, username, password, password2, } = req.body;
  var image = req.file;
  var profile_image = 'noimage.jpg'
  if(image){
  	var profile_image = req.file.filename;
  }

  //form validator
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email field is not valid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  req.getValidationResult().then(function(result){
  	if(!result.isEmpty()){
  		console.log("Errors found: ", result.array());
  		res.render('register', {title: 'Register', errors: result.array()});
  	} else {
  		newUser = new User({name, email, username, password, profile_image});
  		User.createUser(newUser, function(err, user){
  			if(err){
  				console.log("error creating user: ", err);
  				throw err
  			}
  			console.log("User created: ", user);
  		})
  		req.flash('success', 'Registration Succesful');
  		res.location('/');
  		res.redirect('/');
  	}
  })
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login', passport.authenticate('local',{failureRedirect: '/users/login', failureFlash: 'Invalid username or password'}), function(req, res, next) {
  req.flash('success', 'You are now logged in');
  res.redirect('/');
});

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/users/login')
})

module.exports = router;
