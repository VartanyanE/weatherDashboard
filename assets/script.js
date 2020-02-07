$(document).ready(function () {
    $("#search-button").on("click", function (e) {
        e.preventDefault();
        $("#icon").empty();
        var city = $('#city-search').val().trim();
        // var APIKey = "166a433c57516f51dfab1f7edaed8413";
        // var city = $('#city-search').val().trim();
        // Here we are building the URL we need to query the database
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=166a433c57516f51dfab1f7edaed8413";

        // Here we run our AJAX call to the OpenWeatherMap API
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            // We store all of the retrieved data inside of an object called "response"
            .then(function (response) {
                // $("#search-button").on("click", function (e) {
                // e.preventDefault();
                // Log the queryURL
                // console.log(queryURL);
                var longitude = response.coord.lon;
                var latitude = response.coord.lat;
                // Log the resulting object
                // var city = $('#city-search').val().trim();
                console.log(response);
                console.log(longitude);
                console.log(latitude);

                // Transfer content to HTML
                $("#city").html("<h3>" + response.name + " Weather Details</h3>");
                $("#wind").text("Wind Speed: " + response.wind.speed);
                $("#humidity").text("Humidity: " + response.main.humidity + "%");
                $("#temp").text("Temperature (F) " + response.main.temp);
                var icon = $('<img>');
                icon.attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
                $('#icon').append(icon);


                // // Converts the temp to Kelvin with the below formula
                // var tempF = (response.main.temp - 273.15) * 1.80 + 32;
                // $(".tempF").text("Temperature (Kelvin) " + tempF);

                // Log the data in the console as well
                // console.log("Wind Speed: " + response.wind.speed);
                // console.log("Humidity: " + response.main.humidity);
                // console.log("Temperature (F): " + response.main.temp);
            });
        // var forecastURL = "api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=166a433c57516f51dfab1f7edaed8413";

        // $.ajax({
        //     url: forecastURL,
        //     method: "GET"
        // })
        //     // We store all of the retrieved data inside of an object called "response"
        //     .then(function (response) {
        //         console.log(response);

    });
})












