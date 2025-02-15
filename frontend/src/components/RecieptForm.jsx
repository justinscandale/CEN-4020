import React, { useState } from "react";

function ReceiptForm() {
  const [receiptData, setReceiptData] = useState({
    date: "",
    items: [{ name: "", price: "", quantity: "" }],
    store: "",
    creditCardNumber: "",  // Add creditCardNumber field
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate credit card number (must be exactly 16 digits)
    const creditCardNumber = receiptData.creditCardNumber;
    const cardRegex = /^\d{16}$/;
    if (!cardRegex.test(creditCardNumber)) {
      setError("Credit card number must be exactly 16 digits.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. Please log in first.");
      setError("Please log in first.");
      return;
    }

    console.log("Token from localStorage:", token);

    // Data to submit, include creditCardNumber field
    const dataToSubmit = {
      date: receiptData.date,
      items: receiptData.items,
      store: receiptData.store,
      creditCardNumber: receiptData.creditCardNumber,
    };

    console.log("Data to submit:", dataToSubmit);

    fetch("http://localhost:5000/api/receipts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataToSubmit),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create receipt. Server responded with " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Receipt submitted successfully:", data);
        setSubmitted(true);
        setError("");
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Failed to create receipt. Please try again.");
        setSubmitted(false);
      });
  };

  return (
    <div className="ReceiptForm">
      <h1>Receipt Form</h1>

      <form onSubmit={handleSubmit}>
        {/* Display success or error messages */}
        {submitted && (
          <div style={{ color: "green", fontWeight: "bold", marginBottom: "10px" }}>
            Submitted
          </div>
        )}
        {error && (
          <div style={{ color: "red", fontWeight: "bold", marginBottom: "10px" }}>
            {error}
          </div>
        )}

        <input
          type="text"
          name="store"
          value={receiptData.store}
          placeholder="Enter Store"
          onChange={handleInputChange}
        />
        <br />
        <input
          type="date"
          name="date"
          value={receiptData.date}
          onChange={handleInputChange}
        />
        <br />

        {/* Add credit card number field */}
        <input
          type="text"
          name="creditCardNumber"
          value={receiptData.creditCardNumber}
          placeholder="Enter Credit Card Number"
          onChange={handleInputChange}
        />
        <br />

        {receiptData.items.map((item, index) => (
          <div key={index}>
            <input
              type="text"
              name="name"
              value={item.name}
              placeholder="Item Name"
              onChange={(e) => handleItemChange(e, index)}
            />
            <input
              type="number"
              name="price"
              value={item.price}
              placeholder="Item Price"
              onChange={(e) => handleItemChange(e, index)}
            />
            <input
              type="number"
              name="quantity"
              value={item.quantity}
              placeholder="Item Quantity"
              onChange={(e) => handleItemChange(e, index)}
            />
            <br />
          </div>
        ))}

        <button type="button" onClick={addItem}>
          Add Item
        </button>
        <br />
        <button type="submit">Submit Receipt</button>
      </form>
    </div>
  );
}

export default ReceiptForm;

