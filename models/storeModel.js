const mongoose = require('mongoose');
const storeSchema = mongoose.Schema({
    vendor_id: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        required: true,
    },
    business_email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    pin: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,
            required: true,
        },
        coordinates: []
    },
});

storeSchema.index({ location: "2dsphere" });
const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
