var express  = require('express');
var router   = express.Router();
var Firebase = require('firebase');
var fbRef    = new Firebase('https://recordz.firebaseio.com');
var multer   = require('multer');
var upload   = multer({ dest: './public/images/uploads' });

// Home page:
router.get('/', function(req, res, next){
    var albumRef = fbRef.child('albums');

    albumRef.once('value', function(snapshot){
        var myAlbum = [];

        snapshot.forEach(function(childSnapshot){
            var myKey = childSnapshot.key();
            var childData = childSnapshot.val();

            myAlbum.push({
                id: myKey,
                artist: childData.artist,
                genre: childData.genre,
                info: childData.info,
                title: childData.title,
                label: childData.label,
                tracks: childData.tracks,
                cover: childData.cover
            });
        });
        res.render('albums/index.ejs', {albums: myAlbum});
    });
}); //------------------------------------------------------------------------

//
router.get('/add', function(req, res, next){
    var genreRef = fbRef.child('genres');

    genreRef.once('value', function(snapshot){
        var myData = [];

        snapshot.forEach(function(childSnapshot){
            var myKey = childSnapshot.key(); // for ID
            var childData = childSnapshot.val(); // for name

            console.log("myKey = " + myKey);
            console.log("childData = " + childData.name);

            myData.push({
                id: myKey,
                name: childData.name
            });
        });
        res.render('albums/add', {genres: myData});
    });
}); //------------------------------------------------------------------------

// POST new album
router.post('/add', upload.single('cover'), function(req, res, next){
    if (req.file) {
        console.log("Uploading file...");
        var cover = req.file.filename;
    } else {
        console.log("No File Uploaded...");
        var cover = 'no-image.jpg'; // self created image
    }

    var album = {
        title: req.body.title,
        artist: req.body.artist,
        genre: req.body.genre,
        info: req.body.info,
        year: req.body.year,
        label: req.body.label,
        tracks: req.body.tracks,
        cover: cover
    }
    // create reference
    var albumRef = fbRef.child('albums');

    // push album:
    albumRef.push().set(album);

    req.flash('success_msg', 'Album Saved!');
    res.redirect('/albums');
}); //------------------------------------------------------------------------

// DETAILS:
router.get('/details/:id', function(req, res){
    var id = req.params.id;
    console.log("-----> id = " + id);
    // new Firebase reference:
    var albumRef = new Firebase('https://recordz.firebaseio.com/albums/' + id);
    console.log("albumRef = " + albumRef);

    albumRef.once('value', function(snapshot){
        var album = snapshot.val();
        res.render('albums/details', {album: album, id: id});
    });
}); //------------------------------------------------------------------------

// EDIT album:
router.get('/edit/:id', function(req, res, next){
    var id = req.params.id;
    // get reference to a specific genre:
    var albumRef = new Firebase('https://recordz.firebaseio.com/albums/' + id);

    var genreRef = fbRef.child('genres');

    genreRef.once('value', function(snapshot){
        var genres = [];

        snapshot.forEach(function(childSnapshot){
            var myKey = childSnapshot.key(); // for ID
            var childData = childSnapshot.val(); // for name

            genres.push({
                id: myKey,
                name: childData.name
            });
        });

        albumRef.once('value', function(snapshot){
            var album = snapshot.val();
            res.render('albums/edit', {album: album, id: id, genres, genres});
        });
    });
}); //------------------------------------------------------------------------

// EDIT album:
router.post('/edit/:id', upload.single('cover'), function(req, res, next){
    var id = req.params.id;
    // get reference to a specific album:
    var albumRef = new Firebase('https://recordz.firebaseio.com/albums/' + id);

    if (req.file) {
        var cover = req.file.filename; // update cover

        albumRef.update({
            title: req.body.title,
            artist: req.body.artist,
            genre: req.body.genre,
            info: req.body.info,
            year: req.body.year,
            label: req.body.label,
            tracks: req.body.tracks,
            cover: cover
        });
    } else {
        // update with NO cover
        albumRef.update({
            title: req.body.title,
            artist: req.body.artist,
            genre: req.body.genre,
            info: req.body.info,
            year: req.body.year,
            label: req.body.label,
            tracks: req.body.tracks
        });
    }

    req.flash('success_msg', 'Album Updated!');
    res.redirect('/albums/details/' + id);
}); //------------------------------------------------------------------------

// DELETE album:
router.delete('/delete/:id', function(req, res, next){
    console.log("------------DELETE Album-----------------");
    var id = req.params.id;
    var albumRef = new Firebase('https://recordz.firebaseio.com/albums/' + id);

    albumRef.remove();

    req.flash('success_msg', 'Album Deleted!');
    res.sendStatus(200);
}); //------------------------------------------------------------------------









// export
module.exports = router;
