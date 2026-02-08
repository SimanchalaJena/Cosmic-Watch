let watchlist = [];

function addToWatchlist(asteroid) {
    watchlist.push({ ...asteroid, timestamp: new Date() });
    return { success: true, count: watchlist.length };
}

function getWatchlist() {
    return watchlist;
}

module.exports = { addToWatchlist, getWatchlist };
