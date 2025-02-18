const express = require("express")
const router = express.Router();
const {protect} = require("../middleware/authMiddleware");
const multer = require('multer');
const storage = multer.memoryStorage();

const upload = multer({ storage: storage });
const {
    getReceipts,
    setReceipt,
    deleteReceipt,
    getCategories,
    } = require("../controllers/receiptController");

router.get('/get', protect, getReceipts);
router.post("/create", protect,upload.single("image"), setReceipt);
router.delete("/delete/:id", protect, deleteReceipt);
router.get("/categories", protect, getCategories);


module.exports = router;