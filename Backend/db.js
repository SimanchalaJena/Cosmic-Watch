const mongoose = require('mongoose');

// Use 127.0.0.1 instead of localhost for Node.js 18+ compatibility
const mongoURI = 'mongodb://127.0.0.1:27017/cosmic_watch';

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("✅ MongoDB Connected Successfully");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1); // Stop the app if it can't connect
    }
};

module.exports = connectDB;
