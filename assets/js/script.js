// Your Mapbox access token
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZ2F2aW5raW5nY29tZSIsImEiOiJjbWR2amlyOTEwN3NoMmtzNzZtNXFlM3dhIn0.FJhUkI7d1lCFa4LsJQdQUw";

// Initialize map centered on Camberwell
const map = L.map("map").setView([51.4749, -0.0875], 13);

// Add tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Geocoding function
const geocodeAddress = async (address) => {
  const encodedAddress = encodeURIComponent(address);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_TOKEN}&limit=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      return { lat: latitude, lng: longitude };
    } else {
      throw new Error("No coordinates found for address");
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

// Add school markers function call using full address
const addSchoolWithFullAddress = async (school) => {
  const fullAddress = `${school.name}, ${school.address}, ${school.postcode}, London, UK`;
  const coords = await geocodeAddress(fullAddress);

  if (coords) {
    const marker = L.marker([coords.lat, coords.lng]).addTo(map);
    marker.bindPopup(`
            <h3>${school.name}</h3>
            <p><strong>Address:</strong> ${school.address}</p>
            <p><strong>Postcode:</strong> ${school.postcode}</p>
            <p>Loading air quality data...</p>
        `);

    // Here you'd call your LAQN API function
    // const airData = await fetchAirQuality(schoolId);
    // Update popup with air quality data
  }
};

// Camberwell area nurseries with full address
const camberwellSchools = [
  {
    name: "Burgess Park Community Nursery",
    address: "183 Glengall Road, Camberwell",
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
    address: "3-15 Brisbane Street",
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
// Add all school markers to the map
camberwellSchools.forEach((school) => {
  addSchoolWithFullAddress(school);
});
