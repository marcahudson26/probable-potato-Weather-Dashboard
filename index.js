const inputButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const history = document.getElementById("list-group");
const weatherToday = document.getElementById("#today");
const fiveDayForcast = document.getElementById("#forecast");



function translateToWeatherObject(data) {
    return {
        location: data.name,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
        description: data.description,
        date: new Date(data.dt * 1000).toLocaleDateString("en-GB"),
        temp: `${data.main.temp}°C`,
        humidity: `${data.main.humidity}%`,
        windSpeed: `${data.wind.speed} meter/sec`,
    }
}

// this function gets the current weather and the wether outputs 
function getCurrentWeather(city) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=9f3e00ee293195271d6dd820014bfe03`)
        .then(response => response.json())
        .then(weather => translateToWeatherObject(weather))
}

// gets current and future weather 
function getWeatherForecast(city) {
    return fetch(`https://api.openweathermap.org/data/2.5/forecast?appid=9f3e00ee293195271d6dd820014bfe03&q=${city}&units=metric`)
        .then(response => response.json())
        .then(data => {
            const forecasts = []
            for (let i = 0; i < data.list.length; i++) {
                const weather = data.list[i];
                // only get midday weather each day
                if (new Date(weather.dt_txt).getHours() === 12) {
                    forecasts.push(translateToWeatherObject(weather))
                }
            }
            return forecasts
        })
}

inputButton.addEventListener('click', (event) => {
    event.preventDefault();
    const input = document.querySelector('#search-input').value;
    if (input === "" || !isNaN(input)) {
        return
    }
    getCurrentWeather(input)
        .then(weather => {
            console.log(weather.location)
        })

    getWeatherForecast(input)
        .then(weathers => {
            console.log(weathers)
        })

});

