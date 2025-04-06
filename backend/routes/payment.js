const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const transactions = [];
// API to create payment request
router.post("/request-payment",fetchuser,(req, res) => {
  const { name, number, amount, upiId } = req.body;

  if (!name || !number || !amount || !upiId) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    name
  )}&am=${amount}&cu=INR`;

  // Store the transaction (mock)
  const transaction = {
    id: transactions.length + 1,
    name,
    number,
    amount,
    upiId,
    upiUrl,
    status: "pending", // you can later simulate a 'success'
  };
  transactions.push(transaction);

  res.json({
    message: "UPI payment link generated",
    transaction,
  });
});