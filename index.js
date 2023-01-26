const inputButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const historyElem = document.getElementById("history");
const weatherTodayElem = document.getElementById("today");

// this function puts openweathermap data into a new object
function translateToWeatherObject(data) {
    return {
        location: data.name,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
        description: data.weather[0].description,
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

// render current weather to page
function addCurrentWeather(weather) {
    // Example:
    // {
    //     "location": "London",
    //     "icon": "https://openweathermap.org/img/wn/04n.png",
    //     "description": "overcast clouds",
    //     "date": "26/01/2023",
    //     "temp": "5.01°C",
    //     "humidity": "94%",
    //     "windSpeed": "3.6 meter/sec"
    // }
    console.log(weather);
}

// render 5 day forecasts on page
function addForecasts(weathers) {
    // Example (array):
    // [{
    //     "icon": "https://openweathermap.org/img/wn/04n.png",
    //     "description": "overcast clouds",
    //     "date": "26/01/2023",
    //     "temp": "5.01°C",
    //     "humidity": "94%",
    //     "windSpeed": "3.6 meter/sec"
    // }]
    console.log(weathers)
}

function addHistoryButton(city) {
    const button = document.createElement("button")
    button.textContent = city
    button.classList.add("btn", "btn-secondary", "history-button")
    button.dataset.id = city
    button.addEventListener('click', (event) => {
        event.preventDefault()

        const city = event.target.dataset.id
        getCurrentWeather(city)
            .then(weather => {
                addCurrentWeather(weather);
            })

        getWeatherForecast(city)
            .then(weathers => {
                addForecasts(weathers)
            })
    })
    historyElem.prepend(button)
}

function getHistory() {
    const citys = getCityHistory()

    citys.forEach(city => {
        // add buttons to page
        addHistoryButton(city)

    })


}

function getCityHistory() {
    // make sure something is in storage
    if (localStorage.getItem("history") === null) {
        localStorage.setItem("history", JSON.stringify([]));
    }

    return JSON.parse(localStorage.getItem("history"));
}

function saveNewCityToHistory(city) {
    // make sure something is in storage
    if (localStorage.getItem("history") === null) {
        localStorage.setItem("history", JSON.stringify([]));
    }

    // get history array from localstorage
    const history = JSON.parse(localStorage.getItem("history"));

    // add new city
    history.push(city);

    // save new history array in localstorage
    localStorage.setItem("history", JSON.stringify(history))
}

inputButton.addEventListener('click', (event) => {
    event.preventDefault();
    const input = document.querySelector('#search-input').value;
    if (input === "" || !isNaN(input)) {
        return
    }


    getCurrentWeather(input)
        .then(weather => {
            console.log(weather)
            saveNewCityToHistory(weather.location)
            addHistoryButton(weather.location)
            addCurrentWeather(weather);
            console.log(weather);
        })

    getWeatherForecast(input)
        .then(weathers => {
            addForecasts(weathers)
            console.log(weathers)
        })

});

getHistory();