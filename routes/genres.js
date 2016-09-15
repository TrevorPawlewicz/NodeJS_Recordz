var express  = require('express');
var router   = express.Router();
var Firebase = require('firebase');
var fbRef = new Firebase('https://recordz.firebaseio.com');

// Home page:
router.get('/', function(req, res, next){
    var genreRef = fbRef.child('genres');

    genreRef.once('value', function(snapshot){
        var myGenre = [];

        snapshot.forEach(function(childSnapshot){
            var myKey = childSnapshot.key();
            var childData = childSnapshot.val();

            myGenre.push({
                id: myKey,
                name: childData.name
            });
        });
        res.render('genres/index.ejs', {genres: myGenre});
    });
});

// Add page:
router.get('/add', function(req, res, next){
    res.render('genres/add.ejs');
});

//
router.post('/add', function(req, res, next){
    var genre = {
        name: req.body.name
    }
    // if 'genres' doens't exist in the BD, its created/added here
    var genreRef = fbRef.child('genres');
    genreRef.push().set(genre);

    req.flash('success_msg', 'Genre Saved!');
    res.redirect('/genres');
});
















// export
module.exports = router;
