const User = require('../models/userModel');
const Store = require('../models/storeModel');


const createStore = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.vendor_id });
        if (user && user.type === 1) {
            if (req.body.longitude && req.body.latitude) {
                const vendorData = await Store.findOne({ vendor_id: req.body.vendor_id });
                if (vendorData) {
                    res.status(200).json({ success: false, message: 'This Vendor already have a store.' });
                }
                else {
                    const store = new Store({
                        vendor_id: req.body.vendor_id,
                        logo: req.file.filename,
                        business_email: req.body.business_email,
                        address: req.body.address,
                        pin: req.body.pin,
                        location: {
                            type: 'Point',
                            coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
                        },
                    });

                    const storeData = await store.save();
                    res.status(200).json({ success: true, message: 'Successfully saved the store.', data: storeData });
                }
            }
            else {
                res.status(200).json({ success: false, message: 'Longitude and latitude are required' });
            }
        }
        else {
            res.status(200).json({ success: false, message: 'Vendor not found' });
        }

    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getStore = async (id) => {
    return await Store.findById({ _id: id });
}

const findNearestStore = async (req, res) => {
    try {
        const longitude = req.body.longitude;
        const latitude = req.body.latitude;
        const nearestStoresData = await Store.aggregate([
            {
                $geoNear: {
                    near: { type: 'point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
                    key: 'location',
                    maxDistance: parseFloat(20000) * 1609,
                    distanceField: "dist.calculated",
                    spherical: true,
                }
            }
        ]);

        res.status(200).json({ success: true, message: "Nearest Stores", data: nearestStoresData });

    } 
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

const countStores = async (req, res) => {
    try {
        const countData = await Store.find().count();
        res.status(200).json({ success: true, Stores: countData });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

module.exports = {
    createStore,
    getStore,
    findNearestStore,
    countStores
}