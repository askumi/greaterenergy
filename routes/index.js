var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next){
	res.render('index',
	{
		title: 'Greater Energy',
		content: 'Welcome to Greater Energy'
	});
});

module.exports = router;
