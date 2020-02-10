$(document).ready(function () {
    var apiKey = '166a433c57516f51dfab1f7edaed8413';
    var currentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather'
    var uvIndexURL = 'https://api.openweathermap.org/data/2.5/uvi'
    var fiveDayForecastURL = 'https://api.openweathermap.org/data/2.5/forecast'
    var uvIndex = $("#uv");

    $("#search-button").on("click", function (e) {

        buttonClicked();
        e.preventDefault();
        $("#icon").empty();

        // var city = $('#city-search').val().trim();
        // localStorage.setItem('history', city);
        // var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;


        // $.ajax({
        //     url: queryURL,
        //     method: "GET"
        // })

        //     .then(function (response) {

        //         var longitude = response.coord.lon;
        //         var latitude = response.coord.lat;

        //         console.log(response);
        //         console.log(longitude);
        //         console.log(latitude);


        //         $("#city").html("<h5>" + response.name + "</h5>");
        //         $('#date').text(moment().format("dddd, MMMM Do YYYY"));

        //         $("#wind").text("Wind Speed: " + response.wind.speed);
        //         $("#humidity").text("Humidity: " + response.main.humidity + "%");
        //         $("#temp").text("Temperature (F) " + response.main.temp);
        //         var icon = $('<img>');

        //         icon.attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
        //         $('#icon').append(icon);

        //         function createButton() {


        //             var cities = localStorage.getItem('history');
        //             var searchHistory = $("<button>" + cities + "</button>");
        //             searchHistory.on("click", function () {


        //             })



        //             searchHistory.addClass("btn btn-light")
        //             $(".history").append(searchHistory);

        //         }


        //         createButton();


        //         $('#city-search').val("");

        //     });

    });

    function convertKelvinToFahrenheit(tempKelvin) {
        return (tempKelvin - 273.15) * 9 / 5 + 32
    }

    function createButton() {


        var cities = localStorage.getItem('history');
        var searchHistory = $("<button>" + cities + "</button>");
        searchHistory.on("click", function () {
            // buttonClicked();
            // $("#icon").empty();
        })

        searchHistory.addClass("btn btn-light")
        $(".history").append(searchHistory);

    }

    function buttonClicked() {
        var city = $('#city-search').val().trim();
        ajaxCall(city);
        localStorage.setItem('history', city);
        createButton();

    }

    function ajaxCall(city) {
        $.ajax(currentWeatherURL + '?q=' + city + '&appid=' + apiKey,
            {
                type: 'GET',
                success: getWeather,

            });

    }



    function getWeather(response) {
        $("#city").html("<h5>" + response.name + "</h5>");
        $('#date').text(moment().format("dddd, MMMM Do YYYY"));
        $("#wind").text("Wind Speed: " + response.wind.speed);
        $("#humidity").text("Humidity: " + response.main.humidity + "%");
        $("#temp").text("Temp: " + convertKelvinToFahrenheit(response.main.temp).toFixed(2));
        var icon = $('<img>');
        icon.attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
        $('#icon').append(icon);



        var lon = response.coord.lon;
        var lat = response.coord.lat;

        $.ajax(uvIndexURL + '?appid=' + apiKey + '&lat=' + lat + '&lon=' + lon,
            {
                type: 'GET',
                success: function (uvData) {
                    var uvValue = uvData.value;
                    uvIndex.text("UV Index: " + uvValue);
                }

            })


    }

});










