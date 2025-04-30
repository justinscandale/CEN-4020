import React, { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ReceiptForm() {
  const { user } = useAuth();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [manualMode, setManualMode] = useState(false);
  const [justification, setJustification] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [user, navigate]);

  const [receiptData, setReceiptData] = useState({
    date: new Date().toISOString().split('T')[0],
    items: [{ name: "", price: "", quantity: "" }],
    store: "",
    category: "",
    subcategory: "",
    customSubcategory: "",
    total: 0,
  });

  const [total, setTotal] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BASE_URL;
        const response = await axios.get(`${baseUrl}/api/receipts/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCategories(response.data.categories);
        setSubcategories(response.data.subcategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const newTotal = receiptData.items.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return sum + price * quantity;
    }, 0);
    setTotal(newTotal);
  }, [receiptData.items]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      setReceiptData({
        ...receiptData,
        category: value,
        subcategory: "",
      });
    } else if (name === "subcategory") {
      setReceiptData({
        ...receiptData,
        subcategory: value,
      });
    } else if (name === "customSubcategory") {
      setReceiptData({
        ...receiptData,
        customSubcategory: value,
      });
    } else {
      setReceiptData({
        ...receiptData,
        [name]: value,
      });
    }
  };

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...receiptData.items];
    updatedItems[index][name] = value;
    setReceiptData({
      ...receiptData,
      items: updatedItems,
    });
  };

  const addItem = () => {
    setReceiptData({
      ...receiptData,
      items: [...receiptData.items, { name: "", price: "", quantity: "" }],
    });
  };

  const deleteItem = (index) => {
    const updatedItems = receiptData.items.filter((_, i) => i !== index);
    setReceiptData({
      ...receiptData,
      items: updatedItems,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setImageFile(file);
    setUploadedImage(URL.createObjectURL(file));
    try {
      const result = await Tesseract.recognize(file, "eng", {
        logger: (m) => console.log(m),
      });

      const text = result.data.text;
      const lines = text.split("\n");

      const storeName = lines.find((line) => line.trim().length > 0);
      if (storeName) {
        setReceiptData((prev) => ({ ...prev, store: storeName.trim() }));
      }

      const dateMatch = text.match(/\d{2}[/-]\d{2}[/-]\d{4}/);
      if (dateMatch) {
        const date = new Date(dateMatch[0]);
        if (!isNaN(date.getTime())) {
          setReceiptData((prev) => ({
            ...prev,
            date: date.toISOString().split("T")[0],
          }));
        }
      }

      const items = [];
      const ignoredKeywords = [
        "subtotal",
        "total",
        "tax",
        "tip",
        "%",
        "gratuity",
        "cash",
        "change",
        "balance",
        "card",
        "credit",
        "debit",
        "tota]",
        "total["
      ];

      lines.forEach((line) => {
        const lowerLine = line.toLowerCase().trim();
        if (!lowerLine || ignoredKeywords.some((kw) => lowerLine.includes(kw))) return;

        const priceMatch = line.match(/\$?\s*(\d+\.\d{2})/);
        if (priceMatch) {
          const price = parseFloat(priceMatch[1]);
          let name = line.substring(0, priceMatch.index).trim().replace(/^\d+\s*/, "");
          const qtyMatch = line.match(/^\d+/);
          const quantity = qtyMatch ? qtyMatch[0] : "1";

          if (name && !isNaN(price)) {
            items.push({ name, price: price.toString(), quantity });
          }
        }
      });

      if (items.length > 0) {
        setReceiptData((prev) => ({ ...prev, items }));
      }
    } catch (err) {
      console.error("OCR Error:", err);
      setError("Failed to process receipt image. Please fill in details manually.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile && !manualMode) {
      setError("Please upload a receipt image or enable manual mode.");
      return;
    }

    if (manualMode && total > 25) {
      setError("Manual receipts are only allowed for expenses below $25.");
      return;
    }

    if (manualMode && justification.trim().length < 5) {
      setError("Justification is required for manual receipts.");
      return;
    }

    receiptData.subcategory =
      receiptData.subcategory === "custom"
        ? receiptData.customSubcategory
        : receiptData.subcategory;

    const formData = new FormData();
    if (imageFile) formData.append("image", imageFile);
    formData.append("date", receiptData.date);
    formData.append("store", receiptData.store);
    formData.append("category", receiptData.category);
    formData.append("subcategory", receiptData.subcategory);
    formData.append("items", JSON.stringify(receiptData.items));
    formData.append("total", total);
    formData.append("manuallyCreated", manualMode);
    if (manualMode) formData.append("justification", justification);

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const response = await fetch(`${baseUrl}/api/receipts/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create receipt");

      alert("Receipt Successfully Created");
      setSubmitted(true);
      setError("");
      setReceiptData({
        date: "",
        items: [{ name: "", price: "", quantity: "" }],
        store: "",
        category: "",
        subcategory: "",
        customSubcategory: "",
        total: 0,
      });
      setJustification("");
      setTotal(0);
      setUploadedImage(null);
      setImageFile(null);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to create receipt. Please try again.");
      setSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {manualMode ? "Create Manual Receipt" : "Upload Receipt"}
          </h1>

          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={() => setManualMode(!manualMode)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {manualMode ? "Switch to Image Upload" : "Create Manual Receipt"}
            </button>
          </div>

          {!manualMode && (
            <div className="mb-8">
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                {isProcessing ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-2"></div>
                ) : uploadedImage ? (
                  <>
                    <img src={uploadedImage} alt="Uploaded" className="max-h-48 mx-auto" />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 px-4 py-2 text-sm text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
                    >
                      Upload Different Image
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600">Upload a receipt image</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 px-4 py-2 text-sm text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
                    >
                      Upload
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {submitted && (
              <div className="p-4 bg-green-50 rounded-md">
                <p className="text-green-800 font-medium">
                  Receipt submitted successfully!
                </p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 rounded-md">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <input
              type="text"
              name="store"
              value={receiptData.store}
              placeholder="Store"
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />

            <input
              type="date"
              name="date"
              value={receiptData.date}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />

            <select
              name="category"
              value={receiptData.category}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Category</option>
              {Object.entries(categories).map(([key, value]) => (
                <option key={key} value={value}>
                  {key.replace("_", " ")}
                </option>
              ))}
            </select>

            {receiptData.category && (
              <>
                <select
                  name="subcategory"
                  value={receiptData.subcategory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Subcategory</option>
                  {subcategories[receiptData.category]?.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub.replace("_", " ")}
                    </option>
                  ))}
                  <option value="custom">Other (Custom)</option>
                </select>

                {receiptData.subcategory === "custom" && (
                  <input
                    type="text"
                    name="customSubcategory"
                    placeholder="Custom Subcategory"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                )}
              </>
            )}

            {receiptData.items.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  name="name"
                  value={item.name}
                  placeholder="Item Name"
                  onChange={(e) => handleItemChange(e, i)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  name="price"
                  value={item.price}
                  placeholder="Price"
                  onChange={(e) => handleItemChange(e, i)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="number"
                  name="quantity"
                  value={item.quantity}
                  placeholder="Qty"
                  onChange={(e) => handleItemChange(e, i)}
                  className="w-16 px-3 py-2 border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={() => deleteItem(i)}
                  className="text-red-600"
                >
                  ✕
                </button>
              </div>
            ))}

            <div className="text-right text-lg font-semibold">
              Total: ${total.toFixed(2)}
            </div>

            <button
              type="button"
              onClick={addItem}
              className="w-full px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Add Another Item
            </button>

            {manualMode && (
              <textarea
                placeholder="Justification for manual receipt"
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            )}

            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Submit Receipt
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReceiptForm;
