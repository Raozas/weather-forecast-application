document.getElementById("search-btn").addEventListener("click", function () {
  const city = document.getElementById("search-input").value;
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=94b9f515a44744232656d4d09b9644d3`
  )
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("city-name").innerText = data.name;
      // document.getElementById('temperature').innerText = data.main.temp;
      const tempInCelsius = data.main.temp - 273.15;
      document.getElementById("temperature").innerText =
        tempInCelsius.toFixed(2);
      document.getElementById("weather-condition").innerText =
        data.weather[0].main;
      document.getElementById("weather-icon").src =
        "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
      document.getElementById("search-input").value = "";

      if (data.weather[0].main == "Rain") {
        rain();
      }

      function rain() {
        let amount = 20;
        let body = document.querySelector("body");
        let i = 0;
        while (i < amount) {
          let drop = document.createElement("i");

          let size = Math.random() * 5;
          let posX = Math.floor(Math.random() * window.innerWidth);
          let delay = Math.random() * -20;
          let duration = Math.random() * 5;
          drop.style.width = 0.2 + size + "px";
          drop.style.left = posX + "px";
          drop.style.animationDelay = delay + "s";
          drop.style.animationDuration = 1 + duration + "s";
          body.appendChild(drop);
          i++;
        }
      }
    })
    .catch((error) => console.error("Error:", error));
});

window.onload = function () {
  var divs = document.getElementsByClassName("drop");
  for (var i = 0; i < divs.length; i++) {
    var randomLeft = Math.floor(Math.random() * window.innerWidth);
    var randomTop = Math.floor(Math.random() * window.innerHeight);
    divs[i].style.left = randomLeft + "px";
    divs[i].style.top = randomTop + "px";
  }
};

navigator.geolocation.getCurrentPosition(
  function (position) {
    // success callback
  },
  function (error) {
    // error callback
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.");
        break;
    }
  }
);

document
  .getElementById("search-input")
  .addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("search-btn").click();
    }
  });
