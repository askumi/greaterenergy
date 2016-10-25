var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next){
	res.render('index',{user: req.user});
});

//Authentication
router.get('/register',function(req, res, next){
	res.render('auth/register',{user: req.user});
});
router.post('/register', function(req, res, next){
	User.register(new User({username: req.body.username}), req.body.password, function(err){
		if (err){
			console.log('error registering');
			console.log(err);
			return res.render('auth/register',{user: req.user});
		}
		req.login(user, function(err){
			res.redirect('/');
		});
	});
});
router.get('/login', function(req, res, next){
	res.render('auth/login', {user: req.user});
});
router.post('/login', passport.authenticate('local'), function(req, res, next){
	res.redirect('/');
});
router.all('/logout', function(req, res, next){
	req.logout();
	res.redirect('/');
});

module.exports = router;
