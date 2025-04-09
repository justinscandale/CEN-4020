const asyncHandler = require('express-async-handler');
const {Receipt, categories, defaultSubcategories} = require('../models/receiptModel');
const imagekit = require('../config/imagekit');


// @desc Get All Receipts
// @route GET /api/receipts
// @access Private
const getReceipts = asyncHandler(async (req, res) => {
    const receipts = await Receipt.find({ user: req.user.id });
    res.status(200).json(receipts);
});

// @desc Get All Receipts for deparment
// @route GET /api/department-receipts
// @access Private
const getDepartmentReceipts = asyncHandler(async (req, res) => {
    const receipts = await Receipt.find(); //update with proper find condition! for departmen
    res.status(200).json(receipts);
});

// @desc Create New Receipt
// @route POST /api/receipts/create
// @access Private
const setReceipt = asyncHandler(async (req, res) => {
    const { date, total, store, category, subcategory } = req.body;
    const items = JSON.parse(req.body.items);
    const image = req.file;
    const user_id = req.user.id;

    // Validate required fields
    if (!date || !items || !total || !store || !category || !subcategory) {
        console.log(date, items, total, store, category, subcategory);
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

        const receipt = await Receipt.create({
            date,
            items,
            total,
            store,
            category,
            subcategory,
            user: user_id,
            image: uploadResponse.url
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

    // Check user condtions to delete 
    //IMPLEMENT
    // if (receipt.user.toString() !== req.user.id && req.user.role !== 'supervisor') {
    //     res.status(403);
    //     throw new Error('Not authorized');
    // }

    await Receipt.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "sucesdully deleted",
                        id: req.params.id });
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

// @desc Get Categories and Subcategories
// @route PUT /api/receipts/approve
// @access Private
const approve = asyncHandler(async (req, res) => {
    const {id} = req.body;
    console.log(id)
    const receipt = await Receipt.findById(id);
    
    if (!receipt) {
        res.status(404);
        throw new Error('Receipt not found');
    }
    else{
        receipt.approval = true;
        await receipt.save(); //save back to db
        res.status(200).json({ message: 'Receipt approved successfully', receipt });
    }
    
});

module.exports = {
    getReceipts,
    getDepartmentReceipts,
    setReceipt,
    deleteReceipt,
    getCategories,
    approve
};