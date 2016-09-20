var express  = require('express');
var router   = express.Router();
var Firebase = require('firebase');
var fbRef    = new Firebase('https://recordz.firebaseio.com');

// Home page:
router.get('/register', function(req, res, next){
    res.render('users/register.ejs');
}); //-------------------------------------------------------------------------

// LOGIN
router.get('/login', function(req, res, next){
    res.render('users/login');
}); //-------------------------------------------------------------------------

// REGISTER page:
router.post('/register', function(req, res, next){
    // values from register.ejs (name field of input tags):
    var first_name  = req.body.first_name;
    var last_name   = req.body.last_name;
    var email       = req.body.email;
    var password    = req.body.password;
    var password2   = req.body.password2;
    var location    = req.body.location;
    var fav_genres  = req.body.fav_genres;
    var fav_artists = req.body.fav_artists;

    // Validation:
    req.checkBody('first_name', 'First name is required!').notEmpty();
    req.checkBody('email', 'Email is required!').notEmpty();
    req.checkBody('email', 'Email is not valid!').isEmail();
    req.checkBody('password', 'Password is required!').notEmpty();
    req.checkBody('password2', 'Passwords do not match!').equals(req.body.password);

    var errors = req.validationErrors();

    console.log("ERRORS:");
    console.log(errors);

    if (errors) {
        res.render('users/register', { errors: errors });
    } else {
        fbRef.createUser({
            email: email,
            password: password
        }, function(err, userData){
            if (err) {
                console.log("Error creating user...");
                console.log(err);
            } else {
                console.log("Successfully create user with uid: ", userData.uid);
                var user = {
                    uid: userData.uid,
                    email: email,
                    first_name: first_name,
                    last_name: last_name,
                    location: location,
                    fav_genres: fav_genres,
                    fav_artists: fav_artists
                }

                var userRef = fbRef.child('users');
                userRef.push().set(user);

                req.flash('success_msg', 'You are now resistered and can login!');
                res.redirect('/users/login');
            }
        });
    }
}); //-------------------------------------------------------------------------

// LOGiN page:
router.post('/login', function(req, res, next){
    // values from register.ejs (name field of input tags):
    var email       = req.body.email;
    var password    = req.body.password;

    // Validation:
    req.checkBody('email', 'Email is required!').notEmpty();
    req.checkBody('email', 'Email is not valid!').isEmail();
    req.checkBody('password', 'Password is required!').notEmpty();

    var errors = req.validationErrors();

    console.log("ERRORS:");
    console.log(errors);

    if (errors) {
        res.render('users/login', { errors: errors });
    } else {
        fbRef.authWithPassword({
            email: email,
            password: password
        }, function(err, authData){
            if (err) {
                console.log("Login failed...", err);

                req.flash('error_msg', 'Login Failed.');
                res.redirect('/users/login');

            } else {
                console.log("Authenticated user with uid: ", authData);

                req.flash('success_msg', 'You are now logged in!');
                res.redirect('/albums');
            }
        });
    }
}); //-------------------------------------------------------------------------

// LOGOUT user:
router.get('/logout', function(){

    fbRef.unauth(); // firebase unAuthentication

    req.flash('success_msg', 'You are logged out!');
    res.redirect('/users/login');
});









// export
module.exports = router;
