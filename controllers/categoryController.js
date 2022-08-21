const Category = require('../models/categoryModel');

function capitalizeFirstLetter(str) {
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
}

const addCatogory = async (req, res) => {
    try {
        let category = req.body.category;
        category = category ? capitalizeFirstLetter(category.toLowerCase()) : '';
        const categoryData = await Category.findOne({ category: category });
        if (categoryData) {
            res.status(409).json({ success: false, message: `${category} category already exists` });
        }
        else {
            const newCategory = new Category({
                category: category
            });
            const cat_data = await newCategory.save();
            res.status(201).json({ success: true, message: 'Category saved successfully', Data: cat_data });
        }

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

const getCategories = async (req, res) => {
    try {
        return await Category.find();
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

const countCategories = async (req, res) => {
    try {
        const countData = await Category.find().count();
        res.status(200).json({ success: true, Categories: countData });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

module.exports = {
    addCatogory,
    getCategories,
    countCategories,
}