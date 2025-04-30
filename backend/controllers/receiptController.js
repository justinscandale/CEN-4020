const asyncHandler = require('express-async-handler');
const { Receipt, categories, defaultSubcategories } = require('../models/receiptModel');
const imagekit = require('../config/imagekit');

// @desc Get All Receipts
// @route GET /api/receipts
// @access Private
const getReceipts = asyncHandler(async (req, res) => {
    const receipts = await Receipt.find({ user: req.user.id });
    res.status(200).json(receipts);
});

// @desc Get All Receipts for department
// @route GET /api/department-receipts
// @access Private
const getDepartmentReceipts = asyncHandler(async (req, res) => {
    const receipts = await Receipt.find(); // TODO: Filter by department
    res.status(200).json(receipts);
});

// @desc Create New Receipt
// @route POST /api/receipts/create
// @access Private
const setReceipt = asyncHandler(async (req, res) => {
    const { date, total, store, category, subcategory, justification, manuallyCreated } = req.body;
    const items = JSON.parse(req.body.items);
    const user_id = req.user.id;
    const image = req.file;

    // Validate required fields
    if (!date || !items || !total || !store || !category || !subcategory) {
        res.status(400);
        throw new Error('Missing required fields');
    }

    // Validate category
    if (!Object.values(categories).includes(category)) {
        res.status(400);
        throw new Error('Invalid category');
    }

    // Validate items structure
    if (!Array.isArray(items) || items.length === 0) {
        res.status(400);
        throw new Error('Items must be a non-empty array');
    }

    for (const item of items) {
        if (!item.name || !item.price || !item.quantity) {
            res.status(400);
            throw new Error('Each item must have name, price, and quantity');
        }
    }

    try {
        let imageUrl = null;

        if (image && image.buffer) {
            // Upload to ImageKit
            const uploadResponse = await new Promise((resolve, reject) => {
                imagekit.upload({
                    file: image.buffer,
                    fileName: `receipt-${Date.now()}`,
                    folder: '/receipts',
                }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
            });

            imageUrl = uploadResponse.url;
        }

        const receipt = await Receipt.create({
            date,
            items,
            total,
            store,
            category,
            subcategory,
            user: user_id,
            image: imageUrl,
            manuallyCreated: manuallyCreated === 'true',
            justification: manuallyCreated === 'true' ? justification : undefined
        });

        res.status(201).json(receipt);
    } catch (error) {
        res.status(500);
        throw new Error('Error processing receipt: ' + error.message);
    }
});

// @desc Delete Receipt
// @route DELETE /api/receipts/:id
// @access Private
const deleteReceipt = asyncHandler(async (req, res) => {
    const receipt = await Receipt.findById(req.params.id);

    if (!receipt) {
        res.status(404);
        throw new Error('Receipt not found');
    }

    if (receipt.report) {
        res.status(400);
        throw new Error('Receipt is part of a report and cannot be deleted');
    }

    // TODO: Add role-based access check here
    await Receipt.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Successfully deleted", id: req.params.id });
});

// @desc Get Categories and Subcategories
// @route GET /api/receipts/categories
// @access Private
const getCategories = asyncHandler(async (req, res) => {
    res.status(200).json({
        categories,
        subcategories: defaultSubcategories
    });
});

// @desc Approve Receipt
// @route PUT /api/receipts/approve
// @access Private
const approve = asyncHandler(async (req, res) => {
    const { id } = req.body;

    const receipt = await Receipt.findById(id);

    if (!receipt) {
        res.status(404);
        throw new Error('Receipt not found');
    }

    receipt.approval = true;
    await receipt.save();

    res.status(200).json({ message: 'Receipt approved successfully', receipt });
});

// @desc Flag Receipt
// @route POST /api/receipts/flag
// @access Private
const flagReceipt = asyncHandler(async (req, res) => {
    const { id } = req.body;

    const receipt = await Receipt.findById(id);

    if (!receipt) {
        res.status(404);
        throw new Error('Receipt not found');
    }

    receipt.flag = !receipt.flag; // Toggle the flag status
    await receipt.save();

    res.status(200).json({ message: 'Receipt flag status updated', receipt });
});

// @desc Reimburse Receipt
// @route POST /api/receipts/reimburse
// @access Private
const reimburseReceipt = asyncHandler(async (req, res) => {
    const { id } = req.body;

    const receipt = await Receipt.findById(id);

    if (!receipt) {
        res.status(404);
        throw new Error('Receipt not found');
    }

    receipt.reimburse = true;
    await receipt.save();

    res.status(200).json({ message: 'Reimbursement request sent successfully', receipt });
});

module.exports = {
    getReceipts,
    getDepartmentReceipts,
    setReceipt,
    deleteReceipt,
    getCategories,
    approve,
    flagReceipt,
    reimburseReceipt
};
