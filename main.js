// API Key
const API_KEY = process.env.WEATHER_API_KEY;

// DOM Elements - Weather Details
let cityName = document.querySelector('.weather_city');
let dateTime = document.querySelector('.weather_date_time');
let w_forecast = document.querySelector('.weather_forecast');
let w_temperature = document.querySelector('.weather_temperature');
let w_icon = document.querySelector('.weather_icon');
let w_minTem = document.querySelector('.weather_min');
let w_maxTem = document.querySelector('.weather_max');
let w_feelsLike = document.querySelector('.weather_feelsLike');
let w_humidity = document.querySelector('.weather_humidity');
let w_wind = document.querySelector('.weather_wind');
let w_pressure = document.querySelector('.weather_pressure');
let displayError = document.querySelector('.display_error');

// DOM Elements - Search
let citySearch = document.querySelector('.weather_search');

// Default City
let city = 'sydney';

// Get Actual Country Name
function getCountryName(code) {
	return new Intl.DisplayNames(['en'], {
		type: 'region',
	}).of(code);
}

// Get the Formatted Date and Time
function getDateTime(dt) {
	const curDate = new Date(dt * 1000);
	const options = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
	};
	const formatter = new Intl.DateTimeFormat('en-US', options);
	console.log(formatter);
	const formattedDate = formatter.format(curDate);
	return formattedDate;

	// OR (return new Intl.DateTimeFormat('en-US', options).format(curDate);)
}

// Search Functionality - Triggered when the user submits a city name
citySearch.addEventListener('submit', (e) => {
	e.preventDefault(); // Prevent page reload
	displayError.innerHTML = ''; // Clear any previous error messages

	// Fetch City Name
	let placeName = document.querySelector('.city_name');
	console.log(placeName.value);
	city = placeName.value.trim(); // Remove extra spaces

	if (city) {
		getWeatherData(); // Fetch new weather data
		placeName.value = ''; // Clear input field
	} else {
		displayError.innerHTML = 'Please enter a valid city name.'; // Show error message
	}
});

async function getWeatherData() {
	try {
		const response = await fetch(`/.netlify/functions/getWeather?city=${city}`);
		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.error || 'Failed to fetch weather data.');
		}

		// Destructure and update DOM (same as before)
		const {
			name,
			main: { temp, temp_min, temp_max, feels_like, pressure, humidity },
			weather: [{ main, icon }],
			wind: { speed },
			sys: { country },
			dt,
		} = data;

		cityName.innerHTML = `${name} ${getCountryName(country)}`;
		dateTime.innerHTML = getDateTime(dt);
		w_forecast.innerHTML = main;
		w_icon.innerHTML = `<img src=http://openweathermap.org/img/wn/${icon}@4x.png>`;
		w_temperature.innerHTML = `${temp.toFixed()}&#176`;
		w_minTem.innerHTML = `Min: ${Math.floor(temp_min)}&#176`;
		w_maxTem.innerHTML = `Max: ${Math.ceil(temp_max)}&#176`;
		w_feelsLike.innerHTML = `${feels_like.toFixed(2)}&#176`;
		w_humidity.innerHTML = `${humidity}%`;
		w_wind.innerHTML = `${speed} m/s`;
		w_pressure.innerHTML = `${pressure} hPa`;
	} catch (error) {
		displayError.innerHTML = error.message || 'Failed to fetch weather data.';
	}
}

// Call the function initially to display default data
getWeatherData();
