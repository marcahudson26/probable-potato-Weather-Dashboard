const inputButton = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const historyElem = document.getElementById("history");
const weatherTodayElem = document.getElementById("today");
const clearButton = document.getElementById("clear-history");
// this function puts openweather map data into a new object
function translateToWeatherObject(data) {
    return {
        location: data.name,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        description: data.weather[0].description,
        date: new Date(data.dt * 1000).toLocaleDateString("en-GB"),
        temp: `${data.main.temp}°C`,
        humidity: `${data.main.humidity}%`,
        windSpeed: `${data.wind.speed} m/s`,
    }
}
// this function gets the current weather and the wether outputs 
function getCurrentWeather(city) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=9f3e00ee293195271d6dd820014bfe03`)
        .then(response => response.json())
        .then(weather => translateToWeatherObject(weather))
}

function getNearestMultipleOf3(number) {
    return Math.floor(number / 3.0) * 3
}
// gets current and future weather 
function getWeatherForecast(city) {
    return fetch(`https://api.openweathermap.org/data/2.5/forecast?appid=9f3e00ee293195271d6dd820014bfe03&q=${city}&units=metric`)
        .then(response => response.json())
        .then(data => {
            const forecasts = []

            for (let i = 0; i < data.list.length; i++) {
                const weather = data.list[i];
                // can't use daily api since it need premium account
                // do using 3 hour api but only want one weather reading a day
                const isSameTimeAsNow = new Date(weather.dt_txt).getHours() === getNearestMultipleOf3(new Date().getHours())
                if (isSameTimeAsNow) {
                    forecasts.push(translateToWeatherObject(weather))
                }
            }
            return forecasts
        })
}
// render current weather to page
function addCurrentWeather(weather) {
    // remove class d-none from #today
    document.querySelector("#today").classList.remove("d-none")
    // create element for html
    // append to #today
    document.querySelector("#today").innerHTML = `
        <div class="card text-center w-100">
            <div class="card-body">
                <h5 class="card-title">
                    ${weather.location}: ${weather.date}
                </h5>
                <img src="${weather.icon}" alt="${weather.description}">
                <p class="card-text">
                <span class="material-icons align-bottom">device_thermostat</span>
                    ${weather.temp}</p>
                <p>
                <span class="material-icons align-bottom">air</span>
                    ${weather.windSpeed}</p>
                <p>
                <span class="material-symbols-outlined align-bottom">humidity_mid</span>
                    ${weather.humidity} humidity
                </p>
            </div>
        </div>
    `;
}
// render 5 day forecasts on page
function add5DayForecast(weathers) {
    // remove all children from .forecast-grid so previous weather not showing
    document.querySelector(".forecast-grid").innerHTML = "";
    // remove class d-none from #forecast
    document.querySelector("#forecast").classList.remove("d-none")
    // this loops and renders the cards to the 5 day forecast 
    weathers.forEach(weather => {
        const card = document.createElement("div");
        card.innerHTML += `
            <div class="card text-center bg-secondary text-white">
                <div class="card-body">
                <h5 class="card-title">${weather.date}</h5>
                <img src="${weather.icon}" alt="${weather.description}">
                <p class="card-text">
                    <span class="material-icons align-bottom">device_thermostat</span>
                    ${weather.temp}
                </p>
                <p>
                    <span class="material-icons align-bottom">air</span>
                    ${weather.windSpeed}
                </p>
                <p>
                    <span class="material-symbols-outlined align-bottom">humidity_mid</span>
                    ${weather.humidity} humidity
                </p>
                </div>
            </div>
        `
        document.querySelector(".forecast-grid").append(card)
    })
}
// this adds history buttons to the html
function addHistoryButton(city) {
    const button = document.createElement("button")
    button.textContent = city
    button.classList.add("btn", "btn-secondary", "history-button")
    button.dataset.id = city
    // if a history button is presses=d this renders the corresponding weather to the cards
    button.addEventListener('click', (event) => {
        event.preventDefault()

        const city = event.target.dataset.id
        getCurrentWeather(city)
            .then(weather => {
                addCurrentWeather(weather);
            })

        getWeatherForecast(city)
            .then(weathers => {
                add5DayForecast(weathers)
            })
    })
    historyElem.prepend(button)
}
// this function control's history 
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
// this checks if the city entered is already in local storage and if it is wont allow another to be added to storage
function doesCityExistInHistory(city) {
    const historyString = localStorage.getItem("history")
    if (!historyString) {
        return false;
    }
    const history = JSON.parse(historyString);
    return history.includes(city)
}
// this is the search input click event 
inputButton.addEventListener('click', (event) => {
    event.preventDefault();
    const input = document.querySelector('#search-input').value;
    if (input === "" || !isNaN(input)) {
        return
    }

    getCurrentWeather(input)
        .then(weather => {
            if (!doesCityExistInHistory(weather.location)) {
                saveNewCityToHistory(weather.location)
                addHistoryButton(weather.location)
            }
            addCurrentWeather(weather);
        })

    getWeatherForecast(input)
        .then(weathers => {
            add5DayForecast(weathers)
        })

});
// this is the click event for the clear local history button and will clear the local storage and page reload 
clearButton.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.clear();
    location.reload();

})

getHistory();

function getLocation(place) {
    return fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${place}&type=city&format=json&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(result => result.results[0].place_id);
}

function getRestaurants(placeId) {
    return fetch(`https://api.geoapify.com/v2/places?categories=catering.restaurant&filter=place:${placeId}&limit=20&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(result => result.features.map(x => x.properties.name).filter(x => x))
}

getLocation(userInput).then(placeId => {
    getRestaurants(placeId).then(restaurants => {
        console.log(restaurants)
    })
})