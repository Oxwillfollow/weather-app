import imgDayClear from "./images/weather-sunny.svg";
import imgNightClear from "./images/weather-night.svg";
import imgPartlyCloudyDay from "./images/weather-partly-cloudy.svg";
import imgPartlyCloudyNight from "./images/weather-night-partly-cloudy.svg";
import imgCloudy from "./images/weather-cloudy.svg";
import imgRainy from "./images/weather-rainy.svg";
import imgSearch from "./images/magnify.svg";

const API_KEY = "WZB9B9LMLQWNKL6KHUA54M3GS";

const cacheDOM = function () {
  const searchForm = document.getElementById("search-form");
  const searchbar = document.getElementById("searchbar");
  const btnSearch = document.getElementById("btn-search");
  const dataTemp = document.querySelector(".data-temp");
  const dataDatetime = document.querySelector(".data-datetime");
  const dataLocation = document.querySelector(".data-location");
  const dataConditions = document.querySelector(".data-conditions");
  const dataIcon = document.querySelector(".data-icon");

  return {
    searchForm,
    searchbar,
    btnSearch,
    dataTemp,
    dataDatetime,
    dataLocation,
    dataConditions,
    dataIcon,
  };
};

let myDOM = {};

export function initDOM() {
  myDOM = cacheDOM();
  const searchIcon = document.createElement("img");
  searchIcon.src = imgSearch;
  searchIcon.style.width = "32px";
  document.getElementById("label-searchbar").appendChild(searchIcon);

  myDOM.searchForm.addEventListener("submit", (e) => fetchAndDisplayData(e));
}

function fetchAndDisplayData(e) {
  e.preventDefault();
  const input = myDOM.searchbar.value;
  myDOM.searchbar.value = "";

  fetchData(getUrlByLocation(input)).then(function (data) {
    if (data === null || data === undefined) return;
    const location = data.resolvedAddress;
    const localTime = new Date().toLocaleString(undefined, {
      timeZone: data.timezone,
      hour12: false,
    });
    console.log(data);
    const measuredAtTime = data.currentConditions.datetime.slice(0, -3);
    const conditions = data.currentConditions.conditions;
    const tempF = data.currentConditions.temp.toFixed(0);
    const tempC = ((tempF - 32) / 1.8).toFixed(0);

    myDOM.dataTemp.textContent = `${tempC}° C`;
    myDOM.dataLocation.textContent = location.toUpperCase();
    myDOM.dataDatetime.textContent = `${localTime} (Last measured at ${measuredAtTime})`;
    myDOM.dataConditions.textContent = conditions;
    myDOM.dataIcon.src = getWeatherIcon(data.currentConditions.icon);
    myDOM.dataIcon.style.width = "64px";
  });
}

function getWeatherIcon(iconName) {
  // API icon name list:
  //"icon": ["partly-cloudy-day", "rain", "clear-day", "clear-night", "partly-cloudy-night", "cloudy"]

  switch (iconName) {
    case "partly-cloudy-day":
      return imgPartlyCloudyDay;
    case "rain":
      return imgRainy;
    case "clear-day":
      return imgDayClear;
    case "clear-night":
      return imgNightClear;
    case "partly-cloudy-night":
      return imgPartlyCloudyNight;
    case "cloudy":
      return imgCloudy;
    default:
      return undefined;
  }
}

const getUrlByLocation = function (location) {
  const currentDate = new Date();
  return `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${currentDate.toISOString()}?key=${API_KEY}&contentType=json&include=current`;
};

async function fetchData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) return;

    const data = await response.json();
    return data; // returning resolves the promise, executes the cb from .then()
  } catch (error) {
    console.error(error);
  }
}
