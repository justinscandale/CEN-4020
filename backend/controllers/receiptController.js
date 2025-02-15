const asyncHandler = require('express-async-handler');
const Receipt = require('../models/receiptModel');

// @desc Get All Receipts
// @route GET /api/receipts
// @access Private
const getReceipts = asyncHandler(async (req, res) => {
    const receipts = await Receipt.find({ user: req.user.id });
    res.status(200).json(receipts);
});

// @desc Create New Receipt
// @route POST /api/receipts
// @access Private
const setReceipt = asyncHandler(async (req, res) => {
    const { date, items, creditCardNumber } = req.body;
    const user_id = req.user.id;

    // Check if essential fields are provided
    if (!date || !items || !creditCardNumber) {
        res.status(400);
        throw new Error('Missing required fields: date, items, or creditCardNumber');
    }

    const receipt = await Receipt.create({
        date,
        items,
        creditCardNumber,
        user: user_id
    });

    if (receipt) {
        res.status(200).json(receipt);
    } else {
        res.status(400);
        throw new Error('Invalid receipt data');
    }
});

// @desc Delete Receipt
// @route DELETE /api/receipts/:id
// @access Private
const deleteReceipt = asyncHandler(async (req, res) => {
    const receipt = await Receipt.findById(req.params.id);
    if (receipt) {
        if (receipt.user.toString() === req.user.id || req.user.status === 'admin') {
            await Receipt.findByIdAndDelete(req.params.id);
            res.status(200).json({ id: req.params.id });
        }
    } else {
        res.status(400);
        throw new Error('Receipt not found');
    }
});

module.exports = {
    getReceipts,
    setReceipt,
    deleteReceipt
};
