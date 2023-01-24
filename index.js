const inputButton = document.getElementById("search-button")
const searchInput = document.getElementById("search-input")



// this function gets the current weather and the wether outputs 
function getCurrentWeather(lat, lon) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=9f3e00ee293195271d6dd820014bfe03`)
        .then(response => {
            return response.json()
        })
        .then(function (response) {
            return {
                location: response.name,
                icon: `http://openweathermap.org/img/wn/${response.weather[0].icon}.png`,
                date: new Date(response.dt * 1000).toLocaleDateString("en-GB"),
                temp: `${response.main.temp}°C`,
                humidity: `${response.main.humidity}%`,
                windSpeed: `${response.wind.speed} meter/sec`,
            }
        })
}

// gets current and future weather 
function getWeatherForecast(lat, lon) {
    getCurrentWeather(lat, lon).then(response => {
        const img = document.createElement("img")
        img.src = response.icon;
        document.getElementById("form-heading").appendChild(img)
    })

    // get5DayForecast(lat, lon).then(response => {
    // })
}

// on load, get history of searched locations from localstorage
// JSON.parse(localStorage.setItem("searches")) - this is an array
// show all buttons
// add click event to all buttons

//click  event to catch the user input
inputButton.addEventListener('click', (event) => {
    event.preventDefault();
    const input = document.querySelector('.form-input').value;
    if (input === "" || !isNaN(input)) {
        return
    }
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=1&appid=9f3e00ee293195271d6dd820014bfe03`)
        .then(response => response.json())
        .then(response => {
            const { lat, lon, name } = response[0]
            localStorage.setItem("searches", JSON.stringify([{ location: name, lat, lon }]))
            getWeatherForecast(lat, lon);
        })
});




// find long and lat of user input
//save long and lat



//get the response of the api result ie weather


// current day and 4 days into the future
// get values of weather for the 5 days
// display the weather on the page


// {
//     "coord": {
//         "lon": -0.1278,
//         "lat": 51.5074
//     },
//     "weather": [
//         {
//             "id": 803,
//             "main": "Clouds",
//             "description": "broken clouds",
//             "icon": "04n"
//         }
//     ],
//     "base": "stations",
//     "main": {
//         "temp": 274.71,
//         "feels_like": 273.11,
//         "temp_min": 270.64,
//         "temp_max": 277.06,
//         "pressure": 1037,
//         "humidity": 88
//     },
//     "visibility": 10000,
//     "wind": {
//         "speed": 1.54,
//         "deg": 60
//     },
//     "clouds": {
//         "all": 75
//     },
//     "dt": 1674598605,
//     "sys": {
//         "type": 2,
//         "id": 2075535,
//         "country": "GB",
//         "sunrise": 1674546628,
//         "sunset": 1674578053
//     },
//     "timezone": 0,
//     "id": 2643743,
//     "name": "London",
//     "cod": 200
// }


