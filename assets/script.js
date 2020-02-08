$(document).ready(function () {
    $("#search-button").on("click", function newSearch(e) {
        e.preventDefault();
        $("#icon").empty();
        var city = $('#city-search').val().trim();
        localStorage.setItem('history', city);
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=166a433c57516f51dfab1f7edaed8413";


        $.ajax({
            url: queryURL,
            method: "GET"
        })

            .then(function (response) {

                var longitude = response.coord.lon;
                var latitude = response.coord.lat;

                console.log(response);
                console.log(longitude);
                console.log(latitude);


                $("#city").html("<h5>" + response.name + "</h5>");
                $('#date').text(moment().format("dddd, MMMM Do YYYY"));

                $("#wind").text("Wind Speed: " + response.wind.speed);
                $("#humidity").text("Humidity: " + response.main.humidity + "%");
                $("#temp").text("Temperature (F) " + response.main.temp);
                var icon = $('<img>');
                icon.attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
                $('#icon').append(icon);

                var cities = localStorage.getItem('history');
                var searchHistory = $("<h5>" + cities + "</h5>");
                $(".history").append(searchHistory);






                $('#city-search').val("");

            });


    });
})












