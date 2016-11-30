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

router.get('/:_id', function(req, res, next){
	var _id = req.params._id;
    Product.findById(_id, function(err, product){
        if(err){
            console.log(err);
            res.render('error');
        }
        else{
            res.render('product',
			{
				user: req.user,
                product: product
            });
        }
    });
});
// Editing Products
router.get('/edit/:_id', function(req, res, next){
	if(!req.user){
		res.redirect('/login');
	}
	var _id = req.params._id;
    Product.findById(_id, function(err, product){
        if(err){
            console.log(err);
            res.render('error');
        }
        else{
            res.render('edit-product',
			{
				user: req.user,
                product: product
            });
        }
    });
});
router.post('/edit/:_id', function(req, res, next){
	if(!req.user){
		res.redirect('/login');
	}
	var _id = req.params._id;
	if(req.body.image != null){
		var userImage = req.body.image;
		var imgData = getBase64Image(userImage);
		localStorage.setItem(req.body.name, imgData);
	}

    var product = new Product( {
		_id: _id,
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        price: req.body.price
    });

    Product.update( { _id: _id }, product, function(err) {
       if (err) {
           console.log(err);
           res.render('error', {message: 'Could not Update Game'});
       }
        else {
           res.redirect('/products/'+_id);
       }
    });
});


module.exports = router;