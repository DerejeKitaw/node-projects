const express = require('express');
const router = express.Router();

/* GET add posts page. */
router.get('/add', function(req, res, next) {
  res.render('addcategory', {
        title: "Add Category"
    });
});

router.post('/add', function(req, res, next) {


    req.checkBody('name', 'Name can\'t be empty').notEmpty();

    req.getValidationResult().then(function(result){
        if(!result.isEmpty()){
            console.log("Errors found: ", result.array());
            res.render('addcategory', {errors: result.array()});
        } else{
            var { name } = req.body;
            var db = req.db;
            var categories = db.get('categories');
            categories.insert({name}, function(err, post){
                if(err){
                    res.send(err);
                } else {
                    req.flash('success', 'Category Created 👍🏼')
                    res.redirect("/");
                }
            })
        }


    });
})

module.exports = router;