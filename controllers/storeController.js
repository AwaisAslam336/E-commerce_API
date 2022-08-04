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
        res.status(400).send(error.message);
    }
};

module.exports = {
    createStore,
}