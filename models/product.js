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

module.exports = mongoose.model('Product', productSchema);