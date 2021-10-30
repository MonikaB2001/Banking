const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    from_acc: {
        type: Number,
        required: true,
        trim: true
    },
    to_acc: {
        type: Number,
        required: true,
        trim: true
    },
    amt: {
        type: Number,
        required: true,
        trim: true
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

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;