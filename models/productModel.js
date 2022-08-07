const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    vendor_id: {
        type: String,
        required: true,
    },
    store_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    discount: {
        type: String,
        required: true,
    },
    category_id: {
        type: String,
        required: true,
    },
    subCategory_id: {
        type: String,
        required: true,
    },
    images: {
        type: Array,
        required: true,
        validate: [arrayLimit,'you must not provide more than 5 images']
    },
});

function arrayLimit(value) {
    return value.length <= 5;
}
const Product = mongoose.model('Product', productSchema);

module.exports = Product;