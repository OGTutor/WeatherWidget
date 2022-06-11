const link = '';

const root = document.getElementById('root');
const popup = document.getElementById('popup');
const textInput = document.getElementById('text-input');
const form = document.getElementById('form');

let store = {
	city: 'Kiev',
	temperature: 0,
	observationTime: '00:00 AM',
	isDay: 'yes',
	weatherDescriptions: '',
	properties: {
		cloudCover: {},
		humidity: {},
		windSpeed: {},
		pressure: {},
		uvIndex: {},
		visibility: {},
	},
};

const fetchData = async () => {
	try {
		const query = localStorage.getItem('query') || store.city;
		const result = await fetch(`${link}&query=${query}`);
		const data = await result.json();

		const {
			current: {
				cloudcover: cloudCover,
				feelslike: feelsLike,
				humidity,
				is_day: isDay,
				observation_time: observationTime,
				temperature,
				uv_index: uvIndex,
				visibility,
				wind_speed: windSpeed,
				weather_descriptions: weatherDescriptions,
				pressure,
			},
			location: { name },
		} = data;

		store = {
			...store,
			temperature,
			city: name,
			observationTime,
			isDay,
			weatherDescriptions: weatherDescriptions[0],
			properties: {
				cloudCover: {
					name: 'Cloud cover',
					value: `${cloudCover}%`,
					icon: 'cloud.png',
				},
				humidity: {
					name: 'Humidity',
					value: `${humidity}%`,
					icon: 'humidity.png',
				},
				windSpeed: {
					name: 'Wind speed',
					value: `${windSpeed} km/h`,
					icon: 'wind.png',
				},
				pressure: {
					name: 'Pressure',
					value: `${pressure}%`,
					icon: 'gauge.png',
				},
				uvIndex: {
					name: 'uv Index',
					value: `${uvIndex} / 100`,
					icon: 'uv-index.png',
				},
				visibility: {
					name: 'Visibility',
					value: `${visibility}%`,
					icon: 'visibility.png',
				},
			},
		};
		renderComponent();
	} catch (err) {
		console.log(err);
	}
};

const getImage = description => {
	const value = description.toLowerCase();

	switch (value) {
		case 'partly cloudy':
			return 'partly.png';
		case 'cloud':
			return 'cloud.png';
		case 'fog':
			return 'fog.png';
		case 'sunny':
			return 'sunny.png';
		default:
			return 'the.png';
	}
};

const renderProperty = properties => {
	return Object.values(properties)
		.map(({ name, value, icon }) => {
			return `<div class="property">
            <div class="property-icon">
              <img src="./img/icons/${icon}" alt="">
            </div>
            <div class="property-info">
              <div class="property-info__value">${value}</div>
              <div class="property-info__description">${name}</div>
            </div>
          </div>`;
		})
		.join('');
};

const markup = () => {
	const {
		city,
		weatherDescriptions,
		observationTime,
		temperature,
		isDay,
		properties,
	} = store;

	const containerClass = isDay === 'yes' ? 'is-day' : '';

	return `<div class="container ${containerClass}">
            <div class="top">
              <div class="city">
                <div class="city-subtitle">Weather Today in</div>
                  <div class="city-title" id="city">
                  <span>${city}</span>
                </div>
              </div>
              <div class="city-info">
                <div class="top-left">
                <img class="icon" src="./img/${getImage(
									weatherDescriptions
								)}" alt="" />
                <div class="description">${weatherDescriptions}</div>
              </div>
            
              <div class="top-right">
                <div class="city-info__subtitle">as of ${observationTime}</div>
                <div class="city-info__title">${temperature}°</div>
              </div>
            </div>
          </div>
        <div id="properties">${renderProperty(properties)}</div>
      </div>`;
};

const togglePopupClass = () => {
	popup.classList.toggle('active');
};

const renderComponent = () => {
	root.innerHTML = markup();

	const city = document.getElementById('city');
	city.addEventListener('click', togglePopupClass);
};

const handleInput = e => {
	store = {
		...store,
		city: e.target.value,
	};
};

const handleSubmit = e => {
	e.preventDefault();
	const value = store.city;

	if (!value) return null;

	localStorage.setItem('query', value);

	fetchData();
	togglePopupClass();
};

textInput.addEventListener('input', handleInput);
form.addEventListener('submit', handleSubmit);

fetchData();
