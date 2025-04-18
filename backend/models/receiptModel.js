const mongoose = require('mongoose');

const categories = {
   TRAVEL: 'Travel',
   MEALS: 'Meals', 
   OFFICE_SUPPLIES: 'Office_supplies',
   ENTERTAINMENT: 'Entertainment',
   TRAINING: 'Training',
   TRANSPORTATION: 'Transportation'
};

const defaultSubcategories = {
    Transportation: ['Parking', 'Auto_repair', 'Gas'],
    Meals: ['Breakfast', 'Lunch', 'Dinner'],
    Travel: ['Hotel', 'Flight', 'Car_rental'],
    Office_supplies: ['Stationery', 'Electronics', 'Furniture'],
    Entertainment: ['Client_meals', 'Events', 'Gifts'],
    Training: ['Courses', 'Conferences', 'Materials']
};

const receiptSchema = mongoose.Schema({
   date: {
       type: Date,
       required: [true, 'Please add a date']
   },

   store: {
       type: String,
       required: [true, 'Please add a store name']
   },

   category: {
       type: String,
       enum: Object.values(categories),
       required: [true, 'Please select a category']
   },

   subcategory: {
       type: String,
       required: [true, 'Please select or add a subcategory']
   },
   
   items: [{
       name: {
           type: String,
           required: [true, 'Please add an item name']
       },
       price: {
           type: Number,
           required: [true, 'Please add an item price']
       },
       quantity: {
           type: Number,
           required: [true, 'Please add an item quantity']
       }
   }],
   
   approval: {
       type: Boolean,
       default: false,
   },
   
   user: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User',
       required: true
   },

   total: {
       type: Number,
       required: [true, 'Please add a total']
   },
   report: {
 type: Boolean,
 default: false
   },
   image: {
    type: String,  
    //optional: [true, 'Please add an image']
},
}, 
{
   timestamps: true
});

const subcategorySchema = mongoose.Schema({
   category: {
       type: String,
       required: true,
       enum: Object.values(categories)
   },
   name: {
       type: String,
       required: true
   },
   isCustom: {
       type: Boolean,
       default: true
   }
});

const Receipt = mongoose.model('Receipt', receiptSchema);
const Subcategory = mongoose.model('Subcategory', subcategorySchema);

module.exports = {
   Receipt,
   Subcategory,
   categories,
   defaultSubcategories
};