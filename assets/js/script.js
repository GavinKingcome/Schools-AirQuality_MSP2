// Your Mapbox access token
// Get API keys from config
const MAPBOX_TOKEN = CONFIG.MAPBOX_TOKEN;
const IQAIR_API_KEY = CONFIG.IQAIR_API_KEY;

// Initialize map centered on Camberwell
const map = L.map("map").setView([51.4749, -0.0875], 14);

// Add tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Geocoding function
const geocodeAddress = async (address) => {
  const url = `https://api.mapbox.com/search/geocode/v6/forward?access_token=${MAPBOX_TOKEN}`;
  const body = JSON.stringify({
    q: address,
    limit: 1,
    types: ["address"],
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].geometry.coordinates;
      return { lat: latitude, lng: longitude };
    } else {
      throw new Error("No coordinates found for address");
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

// Fetch air quality data from IQAir API
const fetchAirQualityData = async (lat, lng) => {
  try {
    const url = `https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lng}&key=${IQAIR_API_KEY}`;

    const response = await fetch(url);

    const data = await response.json();

    if (data && data.status === "success" && data.data) {
      const current = data.data.current;

      // Add safety checks for the data structure
      if (!current || !current.pollution) {
        return null;
      }

      const pollution = current.pollution;
      const weather = current.weather;

      // Define aqi first
      const aqi = pollution.aqius || "N/A";

      //function to estimate PM2.5 from AQI
      const estimatePM25FromAQI = (aqi) => {
        if (aqi === "N/A" || aqi === null) return "N/A";

        // EPA AQI to PM2.5 conversion (approximate). Calculations from EPA (Environemntal Protection Agency)
        if (aqi <= 50) return Math.round(aqi * 0.24); // 0-12 µg/m³
        if (aqi <= 100) return Math.round(12 + (aqi - 50) * 0.27); // 12-35.4 µg/m³
        if (aqi <= 150) return Math.round(35.4 + (aqi - 100) * 0.29); // 35.4-55.4 µg/m³
        if (aqi <= 200) return Math.round(55.4 + (aqi - 150) * 0.43); // 55.4-150.4 µg/m³
        if (aqi <= 300) return Math.round(150.4 + (aqi - 200) * 1.0); // 150.4-250.4 µg/m³
        return Math.round(250.4 + (aqi - 300) * 1.25); // 250.4+ µg/m³
      };
      // Function to estimate NO2 from AQI. Calculations from EPA (Environemntal Protection Agency)
      const estimateNO2FromAQI = (aqi) => {
        if (aqi === "N/A" || aqi === null) return "N/A";

        // EPA AQI to NO2 conversion (ppb - parts per billion).
        if (aqi <= 50) return Math.round(aqi * 1.07); // 0-53 ppb
        if (aqi <= 100) return Math.round(53 + (aqi - 50) * 0.41); // 54-100 ppb
        if (aqi <= 150) return Math.round(100 + (aqi - 100) * 1.2); // 101-360 ppb
        if (aqi <= 200) return Math.round(360 + (aqi - 150) * 3.68); // 361-649 ppb
        if (aqi <= 300) return Math.round(649 + (aqi - 200) * 6.25); // 650-1249 ppb
        return Math.round(1249 + (aqi - 300) * 6.25); // 1250+ ppb
      };

      // Update your fetchAirQualityData function:
      const pm25 = pollution.p2 ? pollution.p2.conc : estimatePM25FromAQI(aqi);
      const no2 = pollution.n2 ? pollution.n2.conc : estimateNO2FromAQI(aqi);

      // ...existing code...

      // IQAir uses US AQI scale (0-500)
      const getAQIText = (aqi) => {
        if (aqi === "N/A") return "No data";
        if (aqi <= 50) return "Good";
        if (aqi <= 100) return "Moderate";
        if (aqi <= 150) return "Unhealthy for Sensitive";
        if (aqi <= 200) return "Unhealthy";
        if (aqi <= 300) return "Very Unhealthy";
        return "Hazardous";
      };

      return {
        aqi: aqi,
        aqiText: getAQIText(aqi),
        pm25: pm25,
        no2: no2,
        city: data.data.city,
        country: data.data.country,
        temperature: weather ? weather.tp : "N/A",
        humidity: weather ? weather.hu : "N/A",
      };
    }

    return null;
  } catch (error) {
    return null;
  }
};

// ADD function for batch geocoding:
const addSchoolWithFullAddress = (school) => {
  const fullAddress = `${school.name}, ${school.address}, ${school.postcode}, London, UK`;
  return fullAddress;
};

// Create Footer
const createFooter = () => {
  const footer = document.createElement("div");
  footer.className = "map-footer";

  footer.innerHTML = `
    <span>Data: <a href="https://www.iqair.com" target="_blank">IQAir</a> | 
    <a href="https://www.londonair.org.uk" target="_blank">LAQN</a> | 
    <a href="#" onclick="showEPAInfo()">EPA calculations</a></span>
  `;

  document.getElementById("map").appendChild(footer);
};

const showEPAInfo = () => {
  alert(`When direct PM2.5 and NO2 measurements aren't available, this app estimates them from AQI using EPA conversion formulas.

Source: EPA Environmental Protection Agency Air Quality Index guidelines.`);
};

const createSchoolSearch = (schoolMarkers) => {
  const isMobile = window.innerWidth <= 1200;

  // Create search container with CSS classes
  const searchContainer = document.createElement("div");
  searchContainer.className = `school-search ${isMobile ? "mobile" : ""}`;

  // Create search input with CSS classes
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Search for a school...";
  searchInput.className = `search-input ${isMobile ? "mobile" : ""}`;

  // Create results container with CSS classes
  const resultsContainer = document.createElement("div");
  resultsContainer.className = `search-results ${isMobile ? "mobile" : ""}`;

  // Stop Leaflet from intercepting scroll / clicks on the dropdown
  L.DomEvent.disableScrollPropagation(resultsContainer);
  L.DomEvent.disableClickPropagation(resultsContainer);

  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(resultsContainer);
  document.getElementById("map").appendChild(searchContainer);

  // Search functionality
  // Helper to show dropdown with a given list
  function showDropdown(list) {
    resultsContainer.innerHTML = "";
    if (list.length === 0) {
      resultsContainer.style.display = "none";
      return;
    }
    resultsContainer.style.display = "block";
    list.forEach((school) => {
      const resultItem = document.createElement("div");
      resultItem.className = "result-item";
      resultItem.innerHTML = `
      <strong>${school.name}</strong><br>
      <small>${school.address}</small>
    `;
      resultItem.addEventListener("click", () => {
        const isMobile = window.innerWidth <= 1200;
        const panOffset = isMobile ? [0, -120] : [0, -80];

        map.setView([school.lat, school.lng], 16, {
          animate: true,
          pan: {
            animate: true,
            duration: 0.5,
          },
        });

        setTimeout(() => {
          map.panBy(panOffset);
          school.marker.openPopup();
        }, 300);

        searchInput.value = "";
        resultsContainer.innerHTML = "";
        resultsContainer.style.display = "none";
      });
      resultsContainer.appendChild(resultItem);
    });
  }

  // Show all schools when input is focused
  searchInput.addEventListener("focus", () => {
    showDropdown(schoolMarkers);
  });

  // Filter schools as user types
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    if (query.length === 0) {
      showDropdown(schoolMarkers);
      return;
    }
    const matches = schoolMarkers.filter((school) =>
      school.name.toLowerCase().includes(query)
    );
    showDropdown(matches);
  });

  // Hide dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!searchContainer.contains(e.target)) {
      resultsContainer.style.display = "none";
    }
  });
};
// Schools array with correct syntax
const camberwellSchools = [
  {
    name: "Burgess Park Community Nursery",
    address: "183 Glengall Road",
    postcode: "SE15 6RS",
  },
  {
    name: "Lyndhurst Primary School",
    address: "80 Grove Lane",
    postcode: "SE5 8SN",
  },
  {
    name: "Crawford Primary School",
    address: "5 Crawford Road",
    postcode: "SE5 9NF",
  },
  {
    name: "Nicki Day Nursery",
    address: "190 Southampton Way",
    postcode: "SE5 7EU",
  },
  {
    name: "The Fruit Tree Day Nursery",
    address: "3 Brisbane Street, Camberwell",
    postcode: "SE5 7NL",
  },
  {
    name: "Sunshine Fruits Nursery",
    address: "29 Peckham Road",
    postcode: "SE5 8QW",
  },
  {
    name: "Mini Treasures",
    address: "238 Camberwell Rd",
    postcode: "SE5 0ET",
  },
  {
    name: "Bright Explorers Day Nursery",
    address: "84 Camberwell Church St",
    postcode: "SE5 8QZ",
  },
];

// fetchBatchGeocodes (Add all school markers to the map)

async function fetchBatchGeoCodes() {
  const schoolMarkers = [];
  try {
    const batchRequests = camberwellSchools.map((school) => ({
      types: ["address"],
      limit: 1,
      q: addSchoolWithFullAddress(school),
    }));
    const response = await fetch(
      `https://api.mapbox.com/search/geocode/v6/batch?access_token=${MAPBOX_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(batchRequests),
      }
    );
    const { batch } = await response.json();

    batch.forEach((result, index) => {
      const school = camberwellSchools[index];

      // check if geocoding was successful
      if (result.features && result.features.length > 0) {
        const feature = result.features[0];
        const coords =
          feature.properties?.coordinates || feature.geometry?.coordinates;

        let lat, lng;
        if (Array.isArray(coords)) {
          // geometry.coordinates: [lng, lat]
          lng = coords[0];
          lat = coords[1];
        } else if (coords && typeof coords === "object") {
          // properties.coordinates: { latitude, longitude }
          lat = coords.latitude;
          lng = coords.longitude;
        }

        if (lat && lng) {
          const marker = L.marker([lat, lng]).addTo(map);

          marker.on("click", () => {
            const isMobile = window.innerWidth <= 1200;
            const panOffset = isMobile ? [0, -120] : [0, -80];
            setTimeout(() => {
              map.panBy(panOffset);
            }, 100);
          });

          // Store marker for search functionality
          schoolMarkers.push({
            name: school.name,
            address: school.address,
            lat: lat,
            lng: lng,
            marker: marker,
          });

          // Initial popup content (no air quality data yet)
          marker.bindPopup(`
        <h3>${school.name}</h3>
        <p><strong>Address:</strong> ${school.address}</p>
        <p><strong>Postcode:</strong> ${school.postcode}</p>
        <p><em>Click to load air quality data...</em></p>
      `);

          // Fetch air quality data only when popup is opened (prevents rate limiting)
          marker.on("popupopen", async () => {
            const iqairData = await fetchAirQualityData(lat, lng);

            // Build comprehensive popup content
            let popupContent = `
          <h3>${school.name}</h3>
          <p><strong>Address:</strong> ${school.address}</p>
          <p><strong>Postcode:</strong> ${school.postcode}</p>
          <hr>
        `;

            // Add IQAir data (local London monitoring)
            if (iqairData) {
              popupContent += `
            <h4>🌍 IQAir Global Monitoring</h4>
            <p><strong>AQI:</strong> ${iqairData.aqi} (${iqairData.aqiText})</p>
            <p><strong>PM2.5:</strong> ${iqairData.pm25} µg/m³</p>
            <p><strong>NO2:</strong> ${iqairData.no2} ppb</p>
            <p><strong>Location:</strong> ${iqairData.city}, ${iqairData.country}</p>
            <p><strong>Temperature:</strong> ${iqairData.temperature}°C</p>
          `;
            } else {
              popupContent += `<p><em>Air quality data unavailable</em></p>`;
            }

            marker.setPopupContent(popupContent);
          });
        }
      }
    }); // <-- closes batch.forEach

    // Initialize search functionality after all markers are created
    if (schoolMarkers.length > 0) {
      createSchoolSearch(schoolMarkers);
      createFooter();
    }
  } catch (err) {
    // TODO (implement better interface to communicate errors with users)
  }
}

fetchBatchGeoCodes();
