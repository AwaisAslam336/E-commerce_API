const Product = require('../models/productModel');
const { getCategories } = require('./categoryController');
const { getStore } = require('./storeController');

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

const getAllProduct = async (req, res) => {
    try {
        const finalData = [];
        const categories = await getCategories();

        if (categories.length > 0) {
            // loop all categories & get all products of each category one by one
            for (let i = 0; i < categories.length; i++) {
                const product_data = [];
                const cat_id = categories[i]._id.toString();
                const cat_products = await Product.find({ category_id: cat_id });

                if (cat_products.length > 0) {
                    // in specific category, loop all found products
                    // save those products info in product_data array one by one
                    for (let j = 0; j < cat_products.length; j++) {
                        const product_store = await getStore(cat_products[j].store_id);
                        product_data.push({
                            "product_name": cat_products[j].name,
                            "images": cat_products[j].images,
                            "store_address": product_store.address
                        });
                    }
                }
                // save each category and its products data, one by one, in finalData array 
                finalData.push({
                    "category": categories[i].category,
                    "products": product_data,
                })
            }
            res.status(200).json({ success: true, message: "Product Details", data: finalData });
        }
        else {
            res.status(200).json({ success: false, message: "No Category Found!" });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

const searchProduct = async (req, res) => {
    try {
        const search = req.query.search;
        const productData = await Product.find({ name: { $regex: '.*' + search + '.*', $options: 'i' } });
        if (productData.length > 0) {
            res.status(200).json({ success: true, message: "Founded Products", data: productData });
        }
        else {
            res.status(200).json({ success: true, message: "No Products Found"});
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }

}

module.exports = {
    addProduct,
    getAllProduct,
    searchProduct
}