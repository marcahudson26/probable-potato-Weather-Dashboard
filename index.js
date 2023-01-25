const inputButton = document.getElementById("search-button")
const searchInput = document.getElementById("search-input")

function translateToWeatherObject (data) {
    return {
        location: data.name,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
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
                if(new Date(weather.dt_txt).getHours() === 12){
                    forecasts.push(translateToWeatherObject(weather))
                }
            }
            return forecasts
        })
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
        getCurrentWeather(input)
            .then(weather => {
                console.log(weather.location)
            })

        getWeatherForecast(input)
            .then(weathers => {
                console.log(weathers)
            })

    });

/*
{
    "dt_txt": "2023-01-29 03:00:00"
    "dt": 1674961200,
    "main": {
        "temp": 277.05,
        "feels_like": 275.43,
        "temp_min": 277.05,
        "temp_max": 277.05,
        "pressure": 1030,
        "sea_level": 1030,
        "grnd_level": 1027,
        "humidity": 84,
        "temp_kf": 0
    },
    "weather": [
        {
            "id": 804,
            "main": "Clouds",
            "description": "overcast clouds",
            "icon": "04n"
        }
    ],
    "clouds": {
        "all": 91
    },
    "wind": {
        "speed": 1.83,
        "deg": 280,
        "gust": 3.99
    },
    "visibility": 10000,
    "pop": 0,
    "sys": {
        "pod": "n"
    },
    
}
*/


 


// function renderButtons(list) {
//     $("#buttons-view").empty()
//     for (let i = 0; i < list.length; i++) {
//       let element = list[i];
//       let button = $("<button></button>").text(element)
//       // console.log(button)
  
//       $("#buttons-view").append(button)
  
//     }




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


