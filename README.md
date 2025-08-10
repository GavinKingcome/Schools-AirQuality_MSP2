# Schools-AirQuality_MSP2

# Schools Air Quality Monitor - Camberwell

A responsive web application that displays real-time air quality data for schools in the Camberwell area of London. The app provides interactive mapping with EPA-based air quality calculations and mobile-optimized search functionality.

## Live Demo

[View the live application](https://gavinkingcome.github.io/Schools-AirQuality_MSP2/)

## Features

### School Monitoring
- **8 Educational Facilities**: Nurseries and primary schools in Camberwell
- **Interactive Map Markers**: Click any school for detailed information
- **Real-time Data**: Air quality information fetched on-demand

### Air Quality Data
- **AQI (Air Quality Index)**: US EPA standard (0-500 scale)
- **PM2.5 Measurements**: Particulate matter concentration
- **NO2 Levels**: Nitrogen dioxide measurements
- **EPA Calculations**: Automatic estimation when direct measurements unavailable
- **Weather Data**: Temperature and humidity information

### Smart Search
- **Real-time School Search**: Find schools instantly as you type
- **Mobile Optimized**: Responsive design for all device sizes
- **Map Navigation**: Automatic pan and zoom to selected schools

### Responsive Design
- **Mobile-First**: Optimized for smartphones and tablets
- **Adaptive Layout**: 1200px breakpoint for mobile/desktop
- **Touch-Friendly**: Enhanced mobile interaction patterns

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Mapping**: Leaflet.js with OpenStreetMap tiles
- **APIs**: 
  - IQAir API for air quality data
  - Mapbox Geocoding API for location services
- **Responsive**: CSS Grid/Flexbox with mobile-first approach

## Security & API Keys

- The `.gitignore` file is set to ignore only `/config.js` in the project root, so you can safely commit `assets/js/config.js` for deployment.
- Always use restricted API tokens for public repositories.
- Never commit unrestricted or production secrets.

## Data Sources

- **[IQAir](https://www.iqair.com)**: Global air quality monitoring network
- **[London Air Quality Network (LAQN)](https://www.londonair.org.uk)**: Environmental Research Group, Imperial College London
- **[EPA](https://www.epa.gov)**: Environmental Protection Agency calculation standards

## Quick Start

### Prerequisites
- Modern web browser with JavaScript enabled
- API keys for IQAir and Mapbox services

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Schools-AirQuality_MSP2.git
   cd Schools-AirQuality_MSP2
   ```

2. **Configure API keys**
   Create `assets/js/config.js`:
   ```javascript
   const CONFIG = {
     MAPBOX_TOKEN: 'your_mapbox_token_here',
     IQAIR_API_KEY: 'your_iqair_api_key_here'
   };
   ```

3. **Open the application**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Or simply open index.html in your browser
   ```

### API Key Setup

#### IQAir API
1. Visit [IQAir API](https://www.iqair.com/air-pollution-data-api)
2. Sign up for a free account
3. Get your API key from the dashboard

#### Mapbox API
1. Visit [Mapbox](https://www.mapbox.com)
2. Create a free account
3. Generate an access token with geocoding permissions

## Project Structure

```
Schools-AirQuality_MSP2/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css        # All styling (refactored from inline)
│   └── js/
│       ├── script.js        # Main application logic
│       └── config.js        # API keys (not in repo)
├── README.md
└── .gitignore
```

## Key Functions

### Air Quality Processing
- **EPA Conversion Algorithms**: Convert AQI to PM2.5 and NO2 when direct measurements unavailable
- **Real-time API Integration**: Fetch current conditions from IQAir network
- **Error Handling**: Graceful fallbacks for API failures

### Search & Navigation
- **Fuzzy Search**: Find schools by partial name matching
- **Smart Pan**: Automatic map positioning with mobile-optimized offsets
- **Responsive UI**: Adaptive search bar sizing for different screen sizes

### Performance Optimizations
- **On-demand Loading**: Air quality data fetched only when needed
- **Batch Geocoding**: Efficient address-to-coordinate conversion
- **CSS Separation**: Clean code architecture with separated concerns

## Supported Schools

1. **Burgess Park Community Nursery** - 183 Glengall Road, SE15 6RS
2. **Lyndhurst Primary School** - 80 Grove Lane, SE5 8SN
3. **Crawford Primary School** - 5 Crawford Road, SE5 9NF
4. **Nicki Day Nursery** - 190 Southampton Way, SE5 7EU
5. **The Fruit Tree Day Nursery** - 3 Brisbane Street, SE5 7NL
6. **Sunshine Fruits Nursery** - 29 Peckham Road, SE5 8QW
7. **Mini Treasures** - 238 Camberwell Rd, SE5 0ET
8. **Bright Explorers Day Nursery** - 84 Camberwell Church St, SE5 8QZ

## Mobile Features

- **Responsive Search Bar**: Compact design for mobile screens
- **Touch Optimization**: Enhanced tap targets and gestures
- **Smart Positioning**: Mobile-specific map pan offsets
- **Readable Typography**: Optimized font sizes across devices

## Recent Updates

### v2.0.0 - Code Refactor & Enhancement
- **CSS Separation**: Moved all inline styles to external stylesheet
- **Code Organization**: 40% reduction in JavaScript file size
- **Professional Attribution**: Added comprehensive data source credits
- **Enhanced Mobile UX**: Improved responsive design patterns
- **EPA Integration**: Added detailed air quality calculation methods

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/descriptive-name`)
3. Commit your changes (`git commit -m 'Add descriptive commit message'`)
4. Push to the branch (`git push origin feature/descriptive-name`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

### Data Sources & APIs
- **IQAir** for providing comprehensive air quality data
- **Environmental Research Group (ERG), Imperial College London** for operating the London Air Quality Network
- **EPA** for standardized air quality calculation methods
- **Mapbox** for geocoding services and location data
- **OpenStreetMap** contributors for mapping data
- **Leaflet.js** for the mapping library

### Learning & Development
- **Code Institute** for their comprehensive lessons and video content for the "Build an Interactive Front-End Site" module
- **Victor Miclovich** for invaluable mentorship and guidance throughout the project development
- **Dr Raghav Kovvuri** (HE Lecturer - Computing), University of Peterborough, for his support and encouragement
- **Perplexity.ai** for assistance with code structure and technical explanations
- **GitHub Copilot (VS Code)** for code suggestions and syntax support

## Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the [API documentation](https://www.iqair.com/air-pollution-data-api)
- Review browser console for debugging information