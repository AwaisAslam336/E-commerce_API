const Cart = require('../models/cartModel');

const addToCart = async (req, res) => {
    try {
        const newCartProduct = new Cart({
            product_id: req.body.product_id,
            price: req.body.price,
            user_id: req.body.user_id,
            store_id: req.body.store_id
        });
        const cart_data = await newCartProduct.save();
        res.status(200).json({ success: true, message: 'Product added to cart successfully', Data: cart_data });

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

module.exports = { addToCart }