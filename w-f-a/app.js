const weatherIconMap = {
    "Clear": "sun",
    "Clouds": "cloud",
    "Rain": "cloud-rain",
    "Drizzle": "cloud-rain",
    "Thunderstorm": "cloud-lightning",
    "Snow": "cloud-snow",
    "Mist": "cloud-fog",
    "Fog": "cloud-fog",
    "Smoke": "cloud-fog",
    "Haze": "cloud-fog",
    "Dust": "cloud-fog",
    "Sand": "cloud-fog",
    "Ash": "cloud-fog",
    "Squall": "wind",
    "Tornado": "tornado"
};

const weatherBackgroundMap = {
    "Clear": "clear",
    "Clouds": "cloudy",
    "Rain": "rainy",
    "Drizzle": "rainy",
    "Thunderstorm": "stormy",
    "Snow": "snowy",
    "Mist": "misty",
    "Fog": "misty",
    "Smoke": "misty",
    "Haze": "misty",
    "Dust": "misty",
    "Sand": "misty",
    "Ash": "misty",
    "Squall": "windy",
    "Tornado": "tornado"
};

// Fetch weather data from OpenWeatherMap API
async function fetchWeather(city) {
    const apiKey = 'OPENAI_API_KEY'; //94b9f515a44744232656d4d09b9644d3
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        // Convert temperature from Kelvin to Celsius
        data.main.temp = (data.main.temp - 273.15).toFixed(2);
        return data;
    } catch (error) {
        throw error;
    }
}
// Fetch weather data by coordinates
async function fetchWeatherByCoords(lat, lon) {
    const apiKey = '94b9f515a44744232656d4d09b9644d3';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Weather data unavailable');
        }
        const data = await response.json();
        data.main.temp = (data.main.temp - 273.15).toFixed(2);
        return data;
    } catch (error) {
        throw error;
    }
}

// Update the UI with weather data
function updateWeatherUI(data) {
    document.getElementById('city-name').innerText = data.name;
    document.getElementById('temperature').innerText = `Temperature: ${data.main.temp}°C`;
    document.getElementById('weather-condition').innerText = `Condition: ${data.weather[0].description}`;
    document.getElementById('humidity').innerText = `Humidity: ${data.main.humidity}%`;
    document.getElementById('wind-speed').innerText = `Wind Speed: ${data.wind.speed} m/s`;

    const iconName = weatherIconMap[data.weather[0].main] || 'cloud';
    document.getElementById('weather-icon').src = `icons/${iconName}.svg`;

    const weatherClass = weatherBackgroundMap[data.weather[0].main] || 'default';
    document.body.className = `${weatherClass} ${document.body.classList.contains('dark') ? 'dark' : 'light'}`;

    if (data.weather[0].main === 'Rain') {
        rain();
    }
}

// Handle search input
function handleSearch() {
    const city = document.getElementById('search-input').value.trim();
    if (!city) {
        document.getElementById('message').innerText = 'Please enter a city name';
        return;
    }
    document.getElementById('loading').style.display = 'block';
    document.getElementById('message').innerText = '';
    fetchWeather(city)
        .then(data => {
            updateWeatherUI(data);
            document.getElementById('loading').style.display = 'none';
            document.getElementById('search-input').value = '';
        })
        .catch(error => {
            document.getElementById('message').innerText = error.message;
            document.getElementById('loading').style.display = 'none';
        });
}
// Handle geolocation
function handleGeolocation() {
    if (navigator.geolocation) {
        document.getElementById('loading').style.display = 'block';
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude)
                    .then(data => {
                        updateWeatherUI(data);
                        document.getElementById('loading').style.display = 'none';
                    })
                    .catch(error => {
                        document.getElementById('message').innerText = 'Unable to fetch weather';
                        document.getElementById('loading').style.display = 'none';
                    });
            },
            () => {
                document.getElementById('message').innerText = 'Geolocation permission denied';
                document.getElementById('loading').style.display = 'none';
            }
        );
    } else {
        document.getElementById('message').innerText = 'Geolocation not supported';
    }
}
// Rain animation/i don't think that's working
function rain() {
    for (let i = 0; i < 20; i++) {
        const drop = document.createElement('i');
        const size = Math.random() * 5 + 0.2;
        const posX = Math.random() * window.innerWidth;
        const delay = Math.random() * -20;
        const duration = Math.random() * 5 + 0.5;

        drop.style.width = `${size}px`;
        drop.style.left = `${posX}px`;
        drop.style.animationDelay = `${delay}s`;
        drop.style.animationDuration = `${duration}s`;
        drop.className = 'drop';
        document.body.appendChild(drop);
    }
}

// Toggle theme between light and dark
function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.classList.remove(currentTheme);
    document.body.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
    // Update body class to maintain weather background
    const weatherClass = document.body.className.split(' ').find(cls => cls !== 'light' && cls !== 'dark') || 'default';
    document.body.className = `${weatherClass} ${newTheme}`;
}

// Event listeners
document.getElementById('search-btn').addEventListener('click', handleSearch);
document.getElementById('search-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        handleSearch();
    }
});
document.getElementById('location-btn').addEventListener('click', handleGeolocation);
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.classList.add(savedTheme);
