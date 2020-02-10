$(document).ready(function () {
    var apiKey = '166a433c57516f51dfab1f7edaed8413';
    var currentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather'
    var uvIndexURL = 'https://api.openweathermap.org/data/2.5/uvi'
    var fiveDayForecastURL = 'https://api.openweathermap.org/data/2.5/forecast'
    var uvIndex = $("#uv");
    // var searchButton = $(".search-button")

    $('.my-card1').hide();
    $('.my-card2').hide();
    $('.my-card3').hide();
    $('.my-card4').hide();
    $('.my-card5').hide();
    $('#search-history').hide();

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



    function buttonClicked() {
        var city = $('#city-search').val().trim();
        ajaxCall(city);
        ajaxCallFiveDay(city);
        localStorage.setItem('history', city);
        $('.my-card1').show();
        $('.my-card2').show();
        $('.my-card3').show();
        $('.my-card4').show();
        $('.my-card5').show();
        $('#search-history').show();
        createButton();

    }

    function ajaxCall(city) {
        $.ajax(currentWeatherURL + '?q=' + city + '&appid=' + apiKey,
            {
                type: 'GET',
                success: getWeather,

            });

    }

    function ajaxCallFiveDay(city) {
        $.ajax(fiveDayForecastURL + '?q=' + city + '&appid=' + apiKey,
            {
                type: 'GET',
                success: getFiveDay,

            });

    }



    function getWeather(response) {
        $("#city").html("<h5>" + response.name + "</h5>");
        $('#date').text(moment().format("dddd, MMMM Do YYYY"));
        $("#wind").text("Wind Speed: " + response.wind.speed);
        $("#humidity").text("Humidity: " + response.main.humidity + "%");
        $("#temp").text("Temp: " + convertKelvinToFahrenheit(response.main.temp).toFixed(2) + " F");
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

    function getFiveDay(grabFiveDay) {
        console.log(grabFiveDay);

        var icon1 = $('<img>');
        icon1.attr("src", "http://openweathermap.org/img/w/" + grabFiveDay.list[0].weather[0].icon + ".png");
        $('#icon-fiveday1').append(icon1);
        var icon2 = $('<img>');
        icon2.attr("src", "http://openweathermap.org/img/w/" + grabFiveDay.list[1].weather[0].icon + ".png");
        $('#icon-fiveday2').append(icon2);
        var icon3 = $('<img>');
        icon3.attr("src", "http://openweathermap.org/img/w/" + grabFiveDay.list[2].weather[0].icon + ".png");
        $('#icon-fiveday3').append(icon3);
        var icon4 = $('<img>');
        icon4.attr("src", "http://openweathermap.org/img/w/" + grabFiveDay.list[3].weather[0].icon + ".png");
        $('#icon-fiveday4').append(icon4);
        var icon5 = $('<img>');
        icon5.attr("src", "http://openweathermap.org/img/w/" + grabFiveDay.list[4].weather[0].icon + ".png");
        $('#icon-fiveday5').append(icon5);

        $("#temp-fiveday1").text("Temp: " + convertKelvinToFahrenheit(grabFiveDay.list[0].main.temp).toFixed(2) + " F");
        $("#temp-fiveday2").text("Temp: " + convertKelvinToFahrenheit(grabFiveDay.list[1].main.temp).toFixed(2) + " F");
        $("#temp-fiveday3").text("Temp: " + convertKelvinToFahrenheit(grabFiveDay.list[2].main.temp).toFixed(2) + " F");
        $("#temp-fiveday4").text("Temp: " + convertKelvinToFahrenheit(grabFiveDay.list[3].main.temp).toFixed(2) + " F");
        $("#temp-fiveday5").text("Temp: " + convertKelvinToFahrenheit(grabFiveDay.list[4].main.temp).toFixed(2) + " F");

        $("#humidity-fiveday1").text("Humidity: " + grabFiveDay.list[0].main.humidity + "%");
        $("#humidity-fiveday2").text("Humidity: " + grabFiveDay.list[1].main.humidity + "%");
        $("#humidity-fiveday3").text("Humidity: " + grabFiveDay.list[2].main.humidity + "%");
        $("#humidity-fiveday4").text("Humidity: " + grabFiveDay.list[3].main.humidity + "%");
        $("#humidity-fiveday5").text("Humidity: " + grabFiveDay.list[4].main.humidity + "%");

        var addDay1 = (moment().add(1, 'd').format("dddd, MMMM Do"));
        $('#fiveday1').text(addDay1);
        var addDay2 = (moment().add(2, 'd').format("dddd, MMMM Do"));
        $('#fiveday2').text(addDay2);
        var addDay3 = (moment().add(3, 'd').format("dddd, MMMM Do"));
        $('#fiveday3').text(addDay3);
        var addDay4 = (moment().add(4, 'd').format("dddd, MMMM Do"));
        $('#fiveday4').text(addDay4);
        var addDay5 = (moment().add(5, 'd').format("dddd, MMMM Do"));
        $('#fiveday5').text(addDay5);

    }


    function searchHistory(button) {
        let city = searchButton[button].text();



        ajaxCall(city);
        ajaxCallFiveDay(city);
    }
    function createButton() {


        var cities = localStorage.getItem('history');
        var searchHistory = $("<button>" + cities + "</button>");
        searchHistory.addClass("search-button")
        $(".history").append(searchHistory);






    }
    $('.search-button').on("click", function () {
        console.log("clicked");
        searchHistory(button);
    })
});










