const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    account_no: {
        type: Number,
        required: true,
        trim: true,
        min: 1000000000,
        max: 9999999999,
        unique: true
    },
    account_balance: {
        type: Number,
        required: true,
        trim: true
    },
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    account_type: {
        type: String,
        required: true,
        enum: ["SAVING", "CURRENT","DEMAT"],
        default: "SAVING"
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

const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;