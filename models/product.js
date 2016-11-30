var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'No name entered'
    },
    partID: {
        type: String,
        required: 'No id entered'
    },
    category: {
        type: String,
        required: 'No catagory entered'
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: 'No Price entered'
    }
});

productSchema.methods.getDescription = function() { 
	if(this.description == null || this.description === "")
		return 'No Description Found';
    return this.description;
}

module.exports = mongoose.model('Product', productSchema);