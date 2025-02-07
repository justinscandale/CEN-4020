const express = require("express")
const router = express.Router();
const {protect} = require("../middleware/authMiddleware");

const {
    getReceipts,
    setReceipt,
//   updateReceipt,
    deleteReceipt,
    } = require("../controllers/receiptController");

router.get('/get', protect, getReceipts);
router.post("/create", protect, setReceipt);
// router.put("/receipts/:id", updateReceipt);
router.delete("/delete/:id", protect, deleteReceipt);

module.exports = router;