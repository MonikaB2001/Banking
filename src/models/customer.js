const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    mobile_no: {
        type: Number,
        required: true,
        trim: true,
        min: 1000000000,
        max: 9999999999
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowerCase: true
    },
    status: {
        type: String,
        trim: true,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
    }
}, {
    timestamps: true
});

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;