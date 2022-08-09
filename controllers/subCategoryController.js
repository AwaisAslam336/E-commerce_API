const SubCategory = require('../models/SubCategoryModel');

function capitalizeFirstLetter(str) {
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
}

const addSubCatogory = async (req, res) => {
    try {
        let category_id = req.body.category_id;
        let subCategory = req.body.subCategory;

        subCategory = subCategory ? capitalizeFirstLetter(subCategory.toLowerCase()) : '';

        const subCategoryData = await SubCategory.findOne({subCategory:subCategory, category_id: category_id});

        if (subCategoryData && subCategoryData.category_id === category_id) {
            res.status(409).json({ success: false, message: `${subCategory} subCategory already exists for ${category_id}` });
        }
        else{
            const newSubCategory = new SubCategory({
                category_id: category_id,
                subCategory: subCategory,
            });
            const cat_data = await newSubCategory.save();
            res.status(200).json({ success: true, message: 'SubCategory saved successfully', Data: cat_data });
        }

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

const countSubCategories = async (req, res) => {
    try {
        const countData = await SubCategory.find().count();
        res.status(200).json({ success: true, SubCategories: countData });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

module.exports = {
    addSubCatogory,
    countSubCategories
}