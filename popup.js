// access html elements
let city = document.getElementById("city");
let content = document.getElementById("content");
let weatherImage = document.getElementById("weather-image");
let temp = document.getElementById("temp");
let weather = document.getElementById("weather");
let loadingContainer = document.getElementById("loading-container");
let clock = document.getElementById("clock");
let humidity = document.getElementById("humidity");
let humidityImage = document.getElementById("humidity-image")
let windSpeed = document.getElementById("wind-speed");
let windSpeedImage = document.getElementById("wind-speed-image")
let rawTemp; // for temperature conversion no rounding error
let rawWind;

// date object helper function
function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

// API key
const apiKey = "e159204fad8c305ce5401517cc46c680"

// get location - lat/long coords
function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (_position) => {
          lat = _position.coords.latitude;
          lon = _position.coords.longitude;
          fetchWeatherData(lat, lon);
          fetchCityName(lat,lon);
          fetchForecast(lat,lon);
        },
        () => {
          alert("The system didn't approve location");
        }
      );
    } else {
      alert("The system didn't approve location");
    }
  }
  
  // use openweathermap api to access granular weather data
  function fetchWeatherData(lat, lon) {
    //API URL
    const base =
          `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
    fetch(
        base,
      {
        method: "GET"
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        // weather description and associated icon
        weather.innerText = data.current.weather[0].description;
        const weatherIcon = data.current.weather[0].icon
        // temperature
        rawTemp = data.current.temp;
        temp.innerText = Math.round(data.current.temp) + '\u00B0' + 'F';
        // humidity img
        humidity.innerText = data.current.humidity + '%';
        // wind speed img 
        rawWind = data.current.wind_speed;
        windSpeed.innerText = data.current.wind_speed + 'mph'
        // stop loading icon flashing once data is ingested
        loadingContainer.style.opacity = 0;
        content.style.opacity = 1;
        // obtain weather icon based off current weather
        weatherImage.src = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
        humidityImage.src = 'https://cdn-icons-png.freepik.com/512/9342/9342439.png'
        windSpeedImage.src = 'https://static-00.iconduck.com/assets.00/wind-icon-2048x1563-xzh65ux5.png'
        // time data 
        const date = new Date(Date.now());
        console.log(typeof(date.toString()))
        clock.innerText = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear() + ','
        + ' ' + formatAMPM(date);
      })
      .catch((e) => {
        console.log(e);
      });
  }


  function fetchCityName(lat,lon) {
    //API URL --> reverse geocodes lat/lon and returns city information
    const base =
          `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
    fetch(
        base
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const reverseGeo = data[0]; //city,state,country level information
        console.log(reverseGeo)
        city.innerText = `${reverseGeo.name}, ${reverseGeo.state}`;
    })
    .catch((e) => {
      console.log(e);
    });
    }

function fetchForecast(lat,lon) {
    //API URL --> gets 5 day forecast into the future
    const base =
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    fetch(
        base
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
    })
    .catch((e) => {
      console.log(e);
    });
}
  getLocation();


temp.addEventListener("click", (e) => {
  // convert C to F and F to C.
  if (temp.innerText[temp.innerText.length - 1] === 'F') {
    rawTemp = (rawTemp - 32) * (5/9);
    rawWind = rawWind * 1.60934;
    temp.innerText = Math.round(rawTemp) + '\u00B0' + 'C';
    windSpeed.innerText = Math.round(rawWind * 100) / 100 + 'kph'
  } else if (temp.innerText[temp.innerText.length - 1] === 'C') {
    rawTemp = (rawTemp) * (9/5) + 32;
    rawWind = rawWind / 1.60934;
    temp.innerText = Math.round(rawTemp) + '\u00B0' + 'F';
    windSpeed.innerText = Math.round(rawWind * 100) / 100 + 'mph'
  }
})