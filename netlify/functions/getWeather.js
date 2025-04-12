// netlify/functions/getWeather.js

export async function handler(event) {
	const API_KEY = process.env.WEATHER_API_KEY;
	const { city } = event.queryStringParameters;

	if (!city) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: 'City is required' }),
		};
	}

	try {
		const weatherRes = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
		);

		if (!weatherRes.ok) {
			const errData = await weatherRes.json();
			return {
				statusCode: weatherRes.status,
				body: JSON.stringify({
					error: errData.message || 'Failed to fetch weather',
				}),
			};
		}

		const data = await weatherRes.json();

		return {
			statusCode: 200,
			body: JSON.stringify(data),
		};
	} catch (err) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Internal Server Error' }),
		};
	}
}
