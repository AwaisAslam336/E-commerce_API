const mongoose = require('mongoose');
const sub_categorySchema = mongoose.Schema({
    category_id: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
        required: true,
    }
});

const subCategory = mongoose.model('SubCategory', sub_categorySchema);

module.exports = subCategory;
