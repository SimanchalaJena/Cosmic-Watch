const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { fetchNasaData } = require('./nasaApi'); // Ensure this file exists
const Watchlist = require('./Watchlist'); // Import the model above

const app = express();

// --- MIDDLEWARE ---
app.use(cors()); // Critical: Allows frontend to talk to backend
app.use(express.json()); // Parses JSON data from frontend

// --- DATABASE CONNECTION ---
const mongoURI = 'mongodb://127.0.0.1:27017/cosmic_watch';
mongoose.connect(mongoURI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- API ROUTES ---

// 1. Fetch live data from NASA (via your nasaApi.js)
app.get('/api/asteroids', async (req, res) => {
    try {
        const data = await fetchNasaData();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "NASA API unreachable" });
    }
});

// 2. Save an asteroid to the Database
app.post('/api/watchlist', async (req, res) => {
    try {
        const { name, isHazardous } = req.body;
        const newEntry = new Watchlist({ name, isHazardous });
        await newEntry.save();
        res.status(201).json({ message: "Successfully tracked!" });
    } catch (err) {
        res.status(400).json({ error: "Item already in watchlist or invalid data" });
    }
});

// 3. Get all items from the Watchlist
app.get('/api/watchlist', async (req, res) => {
    try {
        const items = await Watchlist.find().sort({ addedAt: -1 });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch watchlist" });
    }
});

// --- START SERVER ---
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Cosmic Watch Server running on http://localhost:${PORT}`);
});
