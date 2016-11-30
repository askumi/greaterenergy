var express = require('express');
var router = express.Router();
var Product = require('../models/product');

router.get('/', function(req, res, next){
    Product.find(function(err, products){
        if(err){
            console.log(err);
            res.render('error');
        }
        else{
            res.render('products',
			{
				user: req.user,
                products: products
            });
        }
    });
});

module.exports = router;