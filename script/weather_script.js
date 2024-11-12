const apiKey = 'ebd3c573a40f2629f09bc3a11a8c5b69'; 
let currentUnit = 'metric';

async function getWeather() {
    const city = document.getElementById('cityInput').value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${currentUnit}&appid=${apiKey}&lang=ru`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.cod === '404') {
            alert('Город не найден!');
            return;
        }

        document.getElementById('cityName').innerText = `${data.name}, ${data.sys.country}`;
        document.getElementById('temp').innerText = `Температура: ${data.main.temp}°`;
        document.getElementById('humidity').innerText = `Влажность: ${data.main.humidity}%`;
        document.getElementById('wind').innerText = `Ветер: ${data.wind.speed} м/с`;
        document.getElementById('weatherIcon').innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">`;

        getForecast(data.coord.lat, data.coord.lon);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

async function getCitySuggestions() {
    const query = document.getElementById('cityInput').value;
    if (query.length < 3) {
        document.getElementById('suggestionsList').innerHTML = '';
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/find?q=${query}&units=${currentUnit}&appid=${apiKey}&lang=ru`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const suggestions = data.list;

        let suggestionsHtml = '';
        suggestions.forEach(city => {
            suggestionsHtml += `<li onclick="selectCity('${city.name}')">${city.name}, ${city.sys.country}</li>`;
        });
        document.getElementById('suggestionsList').innerHTML = suggestionsHtml;
    } catch (error) {
        console.error('Error fetching city suggestions:', error);
    }
}

function selectCity(cityName) {
    document.getElementById('cityInput').value = cityName;
    document.getElementById('suggestionsList').innerHTML = '';
    getWeather(); 
}

async function getForecast(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${apiKey}&lang=ru`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const forecastList = document.getElementById('forecastList');
        forecastList.innerHTML = '';
        data.list.forEach((forecast, index) => {
            if (index % 8 === 0) { 
                const day = new Date(forecast.dt * 1000);
                forecastList.innerHTML += `
                    <div>
                        <p>${day.toLocaleDateString()}</p>
                        <p>${forecast.main.temp_max}°/${forecast.main.temp_min}°</p>
                        <p>${forecast.weather[0].description}</p>
                        <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
                    </div>
                `;
            }
        });
    } catch (error) {
        console.error('Error fetching forecast data:', error);
    }
}

async function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function (position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${apiKey}&lang=ru`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                document.getElementById('cityName').innerText = `${data.name}, ${data.sys.country}`;
                document.getElementById('temp').innerText = `Температура: ${data.main.temp}°`;
                document.getElementById('humidity').innerText = `Влажность: ${data.main.humidity}%`;
                document.getElementById('wind').innerText = `Ветер: ${data.wind.speed} м/с`;
                document.getElementById('weatherIcon').innerHTML = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">`;
                getForecast(data.coord.lat, data.coord.lon);
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        });
    } else {
        alert('Геолокация не поддерживается этим браузером.');
    }
}

function toggleUnits() {
    currentUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
    getWeather();
}
