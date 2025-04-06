import React, { useState,useContext } from "react";
import noteContext from '../context/noteContext'

export const Payment = () => {
const { state} = useContext(noteContext);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    amount: "",
    upiId: "",
  });

  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://${state.backend}:${state.port}/api/request-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.transaction?.upiUrl) {
        // Redirect to UPI payment app
        window.location.href = data.transaction.upiUrl;
        // Simulate payment confirmation
        setTimeout(() => {
          setReceiptData(data.transaction);
          setLoading(false);
        }, 3000);
      } else {
        alert("Failed to generate UPI link.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while requesting payment.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {!receiptData ? (
          <form onSubmit={handleSubmit} style={styles.form}>
            <h2 style={styles.title}>UPI Payment</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <input
              type="tel"
              name="number"
              placeholder="Phone Number"
              value={formData.number}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <input
              type="text"
              name="upiId"
              placeholder="UPI ID (e.g. name@upi)"
              value={formData.upiId}
              onChange={handleChange}
              required
              style={styles.input}
            />

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Processing..." : "Pay via UPI"}
            </button>
          </form>
        ) : (
          <div style={styles.receipt}>
            <h3>Payment Successful ✅</h3>
            <p><strong>Name:</strong> {receiptData.name}</p>
            <p><strong>Phone:</strong> {receiptData.number}</p>
            <p><strong>UPI ID:</strong> {receiptData.upiId}</p>
            <p><strong>Amount Paid:</strong> ₹{receiptData.amount}</p>
            <button onClick={() => window.location.reload()} style={styles.link}>
              Make Another Payment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    width:"100vw",
    backgroundColor: "#f3f4f6",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    maxWidth: 400,
    width: "100%",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  title: {
    textAlign: "center",
    marginBottom: 12,
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#10b981",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    border: "none",
    fontSize: 16,
    cursor: "pointer",
  },
  receipt: {
    textAlign: "center",
  },
  link: {
    marginTop: 16,
    backgroundColor: "#3b82f6",
    color: "#fff",
    padding: 10,
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
  },
};
