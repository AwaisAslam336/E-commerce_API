const Product = require('../models/productModel');

const addProduct = async (req, res) => {
    try {
        const arrImages = [];
        for (let i = 0; i < req.files.length; i++) {
            arrImages[i] = req.files[i].filename;
        }
        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            discount: req.body.discount,
            vendor_id: req.body.vendor_id,
            store_id: req.body.store_id,
            category_id: req.body.category_id,
            subCategory_id: req.body.subCategory_id,
            images: arrImages
        });
        
        const productData = await product.save();
        res.status(201).json({ success: true, message: "Product saved successfully.", data: productData });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

module.exports = {
    addProduct,
}