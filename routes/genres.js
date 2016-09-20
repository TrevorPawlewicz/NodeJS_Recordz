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
}); //------------------------------------------------------------------------

// Add page:
router.get('/add', function(req, res, next){
    res.render('genres/add.ejs');
}); //------------------------------------------------------------------------

// POST genre
router.post('/add', function(req, res, next){
    var genre = {
        name: req.body.name
    }
    // if 'genres' doens't exist in the BD, its created/added here
    var genreRef = fbRef.child('genres');
    genreRef.push().set(genre);

    req.flash('success_msg', 'Genre Saved!');
    res.redirect('/genres');
}); //------------------------------------------------------------------------

// EDIT genre:
router.get('/edit/:id', function(req, res, next){
    var id = req.params.id;
    // get reference to a specific genre:
    var genreRef = new Firebase('https://recordz.firebaseio.com/genres/' + id);

    genreRef.once('value', function(snapshot){
        var genre = snapshot.val();
        res.render('genres/edit', {genre: genre, id: id});
    });
}); //------------------------------------------------------------------------

// UPDATE genre:
router.post('/edit/:id', function(req, res, next){
    console.log("--------EDIT-----------------");
    var id = req.params.id;
    var name = req.body.name;
    var genreRef = new Firebase('https://recordz.firebaseio.com/genres/' + id);

    genreRef.update({
        name: name
    });

    res.redirect('/genres');
}); //------------------------------------------------------------------------

// DELETE genre:
router.delete('/delete/:id', function(req, res, next){
    var id = req.params.id;
    var genreRef = new Firebase('https://recordz.firebaseio.com/genres/' + id);

    genreRef.remove();

    req.flash('success_msg', 'Genre Deleted!');
    res.send(200);
}); //------------------------------------------------------------------------









// export
module.exports = router;
