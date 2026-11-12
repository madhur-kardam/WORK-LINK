const mongoose = require('mongoose');

const connectDB = () =>
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

module.exports = connectDB;
