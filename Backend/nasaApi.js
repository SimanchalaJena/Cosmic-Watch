const axios = require('axios');

const NASA_API_KEY = "v5ax3OT06DN0Qs0dOgts8m7TwW6ISDUPVnTTSfxk";
const BASE_URL = "https://api.nasa.gov";

async function fetchNasaData() {
    const today = new Date().toISOString().split('T')[0];
    const response = await axios.get(`${BASE_URL}?start_date=${today}&api_key=${NASA_API_KEY}`);
    return response.data.near_earth_objects[today];
}

module.exports = { fetchNasaData };
