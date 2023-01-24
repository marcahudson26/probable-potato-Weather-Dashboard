const element = document.getElementById("search-button")

fetch("https://api.openweathermap.org/data/2.5/forecast?appid=9f3e00ee293195271d6dd820014bfe03")
    .then(Response => Response.json())

    .then(function (Response) {
        console.log(Response)
    })


//click  event to catch the user input
element.addEventListener('click', (event) => {

    event.preventDefault();
    const input = document.querySelector('.form-input').value;
    if (input === "" || !isNaN(input)) {
        return
    }
    console.log(input);

});

