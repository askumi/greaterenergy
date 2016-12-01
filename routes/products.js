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
                products: products,
				filter: -1
            });
        }
    });
});
router.get('/add', function(req, res, next) {
	res.render('add-product', {user: req.user});
});
router.post('/add', function(req, res, next){
	Product.create({
		name: req.body.name,
		category: req.body.category,
		partID: req.body.partID,
		description: req.body.description,
		price: req.body.price
	}, function(err, Product){
		if(err){
			console.log(err)
			res.render('error');
		}
		else{
			res.redirect('/products');
		}
	})
});
router.get('/category/:filter', function(req, res, next){
	var filter = req.params.filter;
    Product.find(function(err, products){
        if(err){
            console.log(err);
            res.render('error');
        }
        else{
            res.render('products',
			{
				user: req.user,
                products: products,
				filter: filter
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
	//Save image if uploaded one
	if(req.body.image != null){
		var fs = require('fs');
		var request = require('request');
		var path = "./public/images/"+req.body.partID+".png";
		console.log("FILES::"+req.files);
		console.log("IMAGE::"+req.files.image);
		request(req.body.image, {encoding: 'binary'}, function(err, res, body){
			fs.writeFile(path, body, 'binary', function(err){});
	});
	}
	var _id = req.params._id;
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
			res.render('error', {message: 'Could not Update Product'});
		}
			else {
			res.redirect('/products/'+_id);
		}
    });
});
router.get('/delete/:_id', function(req, res, next) {
	var _id = req.params._id;
	Product.remove({_id: _id}, function(err){
		if(err){
			console.log(err);
			res.render('error', {message: 'Delete Error'});
		}
		else{
			res.redirect('/products');
		}
	});
});

module.exports = router;