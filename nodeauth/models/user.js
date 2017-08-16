const bcrypt = require('bcryptjs');

const mongoose = require('mongoose')
mongoose.connect('mongodb://nodeauthuser:nodeauthuser@localhost:27017/nodeauth',{
	useMongoClient: true
});

var db = mongoose.connection;

var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	profile_image: {
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        	// Store hash in your password DB.
        	newUser.password = hash;
       		newUser.save(callback);
    	});
	});

}

module.exports.comparePassword = function(password, userPassword, callback) {
	bcrypt.compare(password, userPassword, function(err, isMatch) {
    	callback(null, isMatch)
	});

}

module.exports.getUserByUsername = function(username, callback) {
	var query = {username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback) {
	User.findById(id, callback);
}