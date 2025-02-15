import React, { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";

function ReceiptForm() {
  const [receiptData, setReceiptData] = useState({
    date: "",
    items: [{ name: "", price: "", quantity: "" }],
    store: "",
    creditCardNumber: "",
  });

  const [total, setTotal] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);

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
    setReceiptData({
      ...receiptData,
      [name]: value,
    });
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
    setUploadedImage(URL.createObjectURL(file));
    try {
      const result = await Tesseract.recognize(file, "eng", {
        logger: (m) => console.log(m),
      });

      const text = result.data.text;
      console.log("Extracted text:", text);

      // Parse the extracted text
      const lines = text.split("\n");

      // Extract store name (first non-empty line)
      const storeName = lines.find((line) => line.trim().length > 0);
      if (storeName) {
        setReceiptData((prev) => ({ ...prev, store: storeName.trim() }));
      }

      // Extract date
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

      // Extract items and prices while filtering out unwanted lines
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
      ];

      lines.forEach((line) => {
        // Convert line to lowercase for comparison
        const lowerLine = line.toLowerCase().trim();

        // Skip empty lines or lines containing ignored keywords
        if (
          !lowerLine ||
          ignoredKeywords.some((keyword) => lowerLine.includes(keyword))
        ) {
          return;
        }

        // Look for price patterns ($XX.XX)
        const priceMatch = line.match(/\$?\s*(\d+\.\d{2})/);
        if (priceMatch) {
          const price = parseFloat(priceMatch[1]);

          // Get the text before the price as the item name
          let name = line.substring(0, priceMatch.index).trim();

          // Remove any leading numbers (like quantity indicators)
          name = name.replace(/^\d+\s*/, "");

          // Only add if we have a valid name and price
          if (name && !isNaN(price) && name.length > 1) {
            // Try to extract quantity if present
            const qtyMatch = line.match(/^\d+/);
            const quantity = qtyMatch ? qtyMatch[0] : "1";

            items.push({
              name,
              price: price.toString(),
              quantity,
            });
          }
        }
      });

      if (items.length > 0) {
        setReceiptData((prev) => ({ ...prev, items }));
      }
    } catch (err) {
      console.error("OCR Error:", err);
      setError(
        "Failed to process receipt image. Please fill in details manually."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate credit card number
    const creditCardNumber = receiptData.creditCardNumber;
    const cardRegex = /^\d{16}$/;
    if (!cardRegex.test(creditCardNumber)) {
      setError("Credit card number must be exactly 16 digits.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in first.");
      return;
    }
    receiptData.total = total;

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const response = await fetch(`${baseUrl}/api/receipts/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(receiptData),
      });

      if (!response.ok) {
        throw new Error("Failed to create receipt");
      }

      const data = await response.json();
      setSubmitted(true);
      setError("");
      setReceiptData({
        date: "",
        items: [{ name: "", price: "", quantity: "" }],
        store: "",
        creditCardNumber: "",
      });
      setTotal(0);
      setUploadedImage(null);
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
            Upload Receipt
          </h1>

          {/* Image Upload Section */}
          <div className="mb-8">
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              {isProcessing ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  <p className="text-sm text-gray-500">
                    Processing your receipt...
                  </p>
                </div>
              ) : uploadedImage ? (
                <div className="space-y-4 w-full">
                  <img
                    src={uploadedImage}
                    alt="Uploaded receipt"
                    className="max-h-48 mx-auto"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-2 text-sm text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
                  >
                    Upload Different Image
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="mt-4 flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Upload a receipt image</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    We'll extract information automatically from your receipt
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Form Section */}
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

            <div className="space-y-4">
              <input
                type="text"
                name="store"
                value={receiptData.store}
                placeholder="Enter Store"
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />

              <input
                type="date"
                name="date"
                value={receiptData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />

              <input
                type="text"
                name="creditCardNumber"
                value={receiptData.creditCardNumber}
                placeholder="Enter Credit Card Number"
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />

              <div className="space-y-4">
                {receiptData.items.map((item, index) => (
                  <div key={index} className="flex space-x-4">
                    <input
                      type="text"
                      name="name"
                      value={item.name}
                      placeholder="Item Name"
                      onChange={(e) => handleItemChange(e, index)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                      type="number"
                      name="price"
                      value={item.price}
                      placeholder="Price"
                      onChange={(e) => handleItemChange(e, index)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                      type="number"
                      name="quantity"
                      value={item.quantity}
                      placeholder="Qty"
                      onChange={(e) => handleItemChange(e, index)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => deleteItem(index)}
                      className="px-2 py-2 text-red-600 hover:text-red-800 focus:outline-none"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Total Display */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={addItem}
                className="w-full px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 border border-transparent rounded-md hover:bg-indigo-100"
              >
                Add Another Item
              </button>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
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
