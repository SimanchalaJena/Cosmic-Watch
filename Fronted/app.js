// --- CONFIGURATION ---
// Point this to YOUR Node.js Backend URL, NOT NASA directly
const BACKEND_URL = "http://localhost:5000/api/asteroids";
const WATCHLIST_URL = "http://localhost:5000/api/watchlist";

/**
 * Fetches real-time asteroid data from YOUR Backend
 */
async function fetchAsteroidData() {
    const feedContainer = document.getElementById('live-feed');
    
    try {
        const response = await fetch(BACKEND_URL);
        
        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();
        // NASA data is organized by date; your backend should send the array for today
        renderAsteroids(data); 
    } catch (error) {
        console.error("Connection Error:", error);
        feedContainer.innerHTML = `<p class="error">System Offline: Unable to reach Radar Station.</p>`;
    }
}

/**
 * Risk Analysis Engine: Categorizes and displays data
 */
function renderAsteroids(asteroids) {
    const feedContainer = document.getElementById('live-feed');
    feedContainer.innerHTML = ''; // Clear loading spinner

    // If no asteroids are found for today
    if (!asteroids || asteroids.length === 0) {
        feedContainer.innerHTML = "<p>No Near-Earth Objects detected for this trajectory.</p>";
        return;
    }

    asteroids.forEach(neo => {
        const isHazardous = neo.is_potentially_hazardous_asteroid;
        const velocity = Math.round(neo.close_approach_data[0].relative_velocity.kilometers_per_hour);
        const distance = Math.round(neo.close_approach_data[0].miss_distance.kilometers);
        const diameter = neo.estimated_diameter.meters.estimated_diameter_max.toFixed(2);

        const card = document.createElement('div');
        card.className = `neo-card ${isHazardous ? 'hazardous' : 'safe'}`;
        
        card.innerHTML = `
            <span class="risk-badge">${isHazardous ? '<i class="fas fa-biohazard"></i> HIGH RISK' : '<i class="fas fa-check-circle"></i> SAFE'}</span>
            <h3>${neo.name.replace(/[()]/g, '')}</h3>
            <div class="stats">
                <p><strong><i class="fas fa-tachometer-alt"></i> Velocity:</strong> ${Number(velocity).toLocaleString()} km/h</p>
                <p><strong><i class="fas fa-ruler-horizontal"></i> Max:</strong> ${diameter} m</p>
                <p><strong><i class="fas fa-map-marker-alt"></i> Miss:</strong> ${Number(distance).toLocaleString()} km</p>
            </div>
            <button class="btn-primary" style="margin-top:10px; font-size:12px;" 
                    onclick="saveToWatchlist('${neo.name}', ${isHazardous})">
                <i class="fas fa-plus"></i> Track Object
            </button>
        `;
        feedContainer.appendChild(card);
    });
}

/**
 * Watchlist Logic: Sends data to Backend Database
 */
async function saveToWatchlist(name, risk) {
    try {
        const response = await fetch(WATCHLIST_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, isHazardous: risk })
        });

        if (response.ok) {
            updateWatchlistUI(name, risk);
        }
    } catch (error) {
        alert("Database Connection Failed.");
    }
}

function updateWatchlistUI(name, risk) {
    const list = document.getElementById('asteroidList');
    const li = document.createElement('li');
    li.className = "watchlist-item";
    li.innerHTML = `
        <span><i class="fas fa-satellite"></i> ${name} ${risk ? '⚠️' : '✅'}</span>
        <button class="delete-btn" onclick="this.parentElement.remove()">
            <i class="fas fa-trash"></i>
        </button>
    `;
    list.appendChild(li);
}

// --- INITIALIZE DASHBOARD ---
document.addEventListener('DOMContentLoaded', fetchAsteroidData);
