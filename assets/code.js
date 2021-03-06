//GLOBAL VARS

var apiKey = '9f7f37d7070c769fe52dc778ea34c92e';
var currentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather'
var uvIndexURL = 'https://api.openweathermap.org/data/2.5/uvi'
var fiveDayForecastURL = 'https://api.openweathermap.org/data/2.5/forecast'

var displayedCityName = "Houston"; //Used to keep track of the name typed through the AJAX request
//WARNING: displayedCityName is not always accurate. to get the currently displayed name, use jq_city_name.text()

var addCity = false; //Used to keep track of how the AJAX method was run, to determine if a city should be added to the list or not

//DOM ELEMENTS

//  Input
var jq_city_search_box = $("#city_search_box")

var jq_city_search_button = $("#city_search_button")

var jq_city_links = [
    $("#city_link1"),
    $("#city_link2"),
    $("#city_link3")
]

//  Main Info
var jq_city_name = $("#city_name")

var jq_current_date = $("#current_date")

var jq_current_temp = $("#current_temp")

var jq_current_humidity = $("#current_humidity")

var jq_current_wind_speed = $("#current_wind_speed")

var jq_current_uv_index = $("#current_uv_index")

//  5 Day Forecast

//      Dates
var jq_fiveDay_dates =
    [
        $("#fiveDay_date1"),
        $("#fiveDay_date2"),
        $("#fiveDay_date3"),
        $("#fiveDay_date4"),
        $("#fiveDay_date5")
    ];

//      Icons
var jq_fiveDay_icons =
    [
        $("#fiveDay_icon1"),
        $("#fiveDay_icon2"),
        $("#fiveDay_icon3"),
        $("#fiveDay_icon4"),
        $("#fiveDay_icon5")
    ]

//      Temp
var jq_fiveDay_temps =
    [
        $("#fiveDay_temp1"),
        $("#fiveDay_temp2"),
        $("#fiveDay_temp3"),
        $("#fiveDay_temp4"),
        $("#fiveDay_temp5")
    ]

var jq_fiveDay_humidity =
    [
        $("#fiveDay_humidity1"),
        $("#fiveDay_humidity2"),
        $("#fiveDay_humidity3"),
        $("#fiveDay_humidity4"),
        $("#fiveDay_humidity5")
    ]

// Misc

var jq_error_box = $("#error_box")

//LOCAL STORAGE

var stored_city_info = JSON.parse(localStorage.getItem("cities"))

if (!stored_city_info) {
    stored_city_info = ["Houston", "Austin", "Denver", "Tokyo"];
}

jq_city_links[0].text(stored_city_info[1]);
jq_city_links[1].text(stored_city_info[2]);
jq_city_links[2].text(stored_city_info[3]);


//USEFUL FUNCTIONS

function updateLocalStorage() {
    stored_city_info[0] = jq_city_name.text();
    stored_city_info[1] = jq_city_links[0].text();
    stored_city_info[2] = jq_city_links[1].text();
    stored_city_info[3] = jq_city_links[2].text();

    localStorage.setItem("cities", JSON.stringify(stored_city_info));
}

function getDateFromUNIX(unixDate) {
    const currentDate = new Date(unixDate * 1000);
    return currentDate.toDateString().substring(4).replace(/\s/g, '/');
}

function convertKelvinToFahrenheit(tempKelvin) {
    return (tempKelvin - 273.15) * 9 / 5 + 32
}

function updateCurrentWeatherInfo(currentWeatherData) {

    //city name

    jq_city_name.text(displayedCityName);

    //  current date

    const currentUNIXtime = currentWeatherData.dt + currentWeatherData.timezone;

    jq_current_date.text(getDateFromUNIX(currentUNIXtime));

    //  current temp

    jq_current_temp.text(convertKelvinToFahrenheit(currentWeatherData.main.temp).toFixed(1));

    //  current humid

    jq_current_humidity.text(currentWeatherData.main.humidity);

    //  current wind speed

    jq_current_wind_speed.text(currentWeatherData.wind.speed);


    //In that AJAX call Make a call to get the UV index

    const lon = currentWeatherData.coord.lon;
    const lat = currentWeatherData.coord.lat;

    $.ajax(uvIndexURL + '?appid=' + apiKey + '&lat=' + lat + '&lon=' + lon,   // request url
        {
            type: 'GET',
            success: function (uvData) {
                const uvValue = uvData.value
                const redValue = (uvValue / 10) * 255
                const greenValue = 255 - redValue;
                let hexColorCode = "#" + parseInt(redValue).toString(16) + parseInt(greenValue).toString(16) + "00";
                if (redValue > 255)//if extreme UV rays are present
                {
                    hexColorCode = "#AA00FF";
                };
                jq_current_uv_index.text(uvValue);
                jq_current_uv_index.css("background-color", hexColorCode);
            }
        })

    //code to run on successful ajax call

    if (addCity) {

        for (let i = 0; i < jq_city_links.length; i++) {
            const city = jq_city_links[i].text();
            if (city == displayedCityName) {
                updateLocalStorage();
                return true;
            }
        }

        //Push the new search onto the city buttons

        for (let i = 0; i < jq_city_links.length; i++) {
            const cityButton = jq_city_links[i];
            if (!(i == 2)) {
                cityButton.text(jq_city_links[i + 1].text());
            } else {
                cityButton.text(displayedCityName);
            }
        }
        updateLocalStorage();
    }
}

function updateFiveDayForecast(fiveDayData) {
    let days = [[], [], [], [], []];
    let dates = ['', '', '', '', ''];
    let icons = ['', '', '', '', ''];
    let averageTemp = [0, 0, 0, 0, 0];
    let averageHumidity = [0, 0, 0, 0, 0];
    //  Group them into groups of 8 based on index.
    for (let i = 0; i < fiveDayData.list.length; i++) {
        const weatherData = fiveDayData.list[i];
        dayIndex = Math.floor(i / 8) //Get the day in the 5 day period based on the index
        days[dayIndex].push(weatherData)//Add the data for this 3 hour period onto the list based on what day it is.
        averageTemp[dayIndex] += convertKelvinToFahrenheit(weatherData.main.temp);
        averageHumidity[dayIndex] += weatherData.main.humidity;
    }

    for (let i = 0; i < days.length; i++) {
        dates[i] = getDateFromUNIX(days[i][4].dt)
        icons[i] = days[i][5].weather[0].icon;
        averageTemp[i] = (averageTemp[i] / 8).toFixed(1);
        averageHumidity[i] = (averageHumidity[i] / 8).toFixed(1);

        jq_fiveDay_dates[i].text(dates[i]);
        jq_fiveDay_icons[i].attr('src', "Assets/Weather_Icons/" + icons[i] + ".png");
        jq_fiveDay_temps[i].text(averageTemp[i]);
        jq_fiveDay_humidity[i].text(averageHumidity[i]);
    }
}

function showError() {
    jq_error_box.css("display", "block");
}

function hideError() {
    jq_error_box.css("display", "none");
}

function updateAJAXInfo(city) {
    hideError();

    displayedCityName = city;

    //Make an AJAX call to get the info for the citY
    $.ajax(currentWeatherURL + '?q=' + city + '&appid=' + apiKey,   // request url
        {
            type: 'GET',
            success: updateCurrentWeatherInfo,
            error: showError
        });
    //Make an AJAX call to get the five day forecast

    $.ajax(fiveDayForecastURL + '?q=' + city + '&appid=' + apiKey,   // request url
        {
            type: 'GET',
            success: updateFiveDayForecast
        });
}

//EVENT FUNCTIONS

function searchButtonClicked() {
    let city = jq_city_search_box.val();
    if (!city) {
        return false;
    }

    city = city.charAt(0).toUpperCase() + city.slice(1); //Capitalize the first letter of city

    addCity = true;

    updateAJAXInfo(city);

}

function cityButtonClicked(button) {
    let city = jq_city_links[button].text();

    addCity = false;

    updateAJAXInfo(city);
}

//EVENT ASSIGNMENT
for (let i = 0; i < jq_city_links.length; i++) {
    jq_city_links[i].click(function () { cityButtonClicked(i) });
}

jq_city_search_button.click(searchButtonClicked);

jq_city_search_box.on('keypress', function (event) {
    if (event.which == 13) {
        searchButtonClicked();
    }
});

//CODE TO RUN AT LAUNCH

updateAJAXInfo(stored_city_info[0]);