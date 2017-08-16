const multer           = require('multer');
const upload           = multer({dest: 'public/uploads/'});
const express = require('express');
const router = express.Router();

/* GET add posts page. */
router.get('/show/:_id', function(req, res, next) {
    var _id = req.params._id
    req.db.get("posts").find({_id}, {}, function(err, posts) {
        if(err){
            throw err
        } else {
            console.log(posts);
            res.render('index', {
                title: posts[0].title,
                posts,
                preview:false
            });
        }

    });
});

/* GET add posts page. */
router.get('/add', function(req, res, next) {
    req.db.get("categories").find({}, {}, function(err, categories) {
        if(err){
            throw err
        } else {
          res.render('addpost', {
            title: "Add Post",
            categories
        });
      }

  });
});

router.post('/add', upload.single('mainimage'), function(req, res, next) {
    var {title, category, body, author} = req.body;
    var date = new Date();
    var mainimage = "noimage.jpeg";
    if(req.file){
        mainimage = req.file.filename;
    }
    console.log("Fields: ", {title, category, body, author});
    console.log("All Fields: ", req.body);

    console.log("Image: ", mainimage);

    req.checkBody('title', 'Title can\'t be empty').notEmpty();
    req.checkBody('body', 'Body can\'t be empty').notEmpty();

    req.getValidationResult().then(function(result){
        if(!result.isEmpty()){
            console.log("Errors found: ", result.array());
            res.render('addpost', {errors: result.array()});
        } else{
            var db = req.db;
            var posts = db.get('posts');
            posts.insert({
                title,
                body,
                category,
                date,
                author,
                mainimage
            }, function(err, post){
                if(err){
                    res.send(err);
                } else {
                    req.flash('success', 'Post posted!! 👍🏼')
                    res.redirect("/");
                }
            })
        }


    });
})

router.get('/category/:category', function(req, res) {
    console.log(req.params);
    var { category } = req.params;

    req.db.get("posts").find({category}, {}, function(err, posts) {
        console.log("params:", {category, posts} );
        if(err){
            console.error("Error querying posts: ", err);
        } else {
           res.render('index', {title: `Posts in ${category}`, posts});
       }
   })
})

router.post('/:_id/comment/', function(req, res) {

    var {_id} = req.body

    console.log(req.body);
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').isEmail()
    req.checkBody('body', 'Comment must be between 10 and 255 characters').notEmpty()

    req.getValidationResult().then(function(result) {
        if(!result.isEmpty()){
            var posts = req.db.get('posts');
            posts.find({_id}, {}, function(err, posts) {
                console.dir(err);
                console.dir(posts);
                if(err){
                    throw err
                } else{
                    res.render('index', {
                        title   : posts[0].title,
                        preview : false,
                        errors  : result.array(),
                        posts
                    });
                }
            })

        } else{
            var { body, name, email } = req.body

            var date = new Date()

            var posts = req.db.get('posts')
            posts.findOneAndUpdate({_id}, {$push:{comments: {"name":name, "email":email, "body":body, "date":date}}}, function(err, post) {
                if(err){
                    throw err
                }
                req.flash('success', 'Comment added succesfully')
                res.render('index', {title: post.title,
                    preview: false,
                    posts: [post]
                })

            })

        }
        
    })
    
})

module.exports = router;