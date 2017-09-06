'use strict'

const mongoose = require('mongoose')

var db = function(){
    return {
        config: function(conf){
            console.log(conf);
            mongoose.Promise = global.Promise
            mongoose.connect('mongodb://localhost/tekbooks', {
                useMongoClient: true,
                user: 'myUserAdmin',
                pass: 'abc123',
                authSource: 'admin'
            })
            let db = mongoose.connection
            db.on('error', console.error.bind(console, 'Connection Error'))
            db.once('open', () =>{
                console.log("DB Connected");
            })
        }
    }
}

module.exports = db();