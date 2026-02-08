const mongoose = require('mongoose');

// Define the Schema for tracked asteroids
const WatchlistSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        unique: true // Prevents tracking the same asteroid twice
    },
    isHazardous: { 
        type: Boolean, 
        default: false 
    },
    addedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Export the Model
module.exports = mongoose.model('Watchlist', WatchlistSchema);
