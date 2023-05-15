const mongoose = require("mongoose")

const TransactionSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Please provide transaction description'],
        maxlength: [30, 'Description can not be more than 20 characters'],
    },
    amount: {
        type: Number,
        required: [true, 'Please provide transaction amount'],
        default: 0,
    },
    type: {
        type: String,
        required: [true, 'Please provide transaction type'],
        enum: ['credit', 'debit', 'savings', 'investment'],
        default: 'credit'
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    
},
    { timestamps: true }
);

module.exports = mongoose.model('Transaction', TransactionSchema);