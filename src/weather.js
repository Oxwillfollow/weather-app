import imgDayClear from "./images/weather-sunny.svg";
import imgNightClear from "./images/weather-night.svg";
import imgPartlyCloudyDay from "./images/weather-partly-cloudy.svg";
import imgPartlyCloudyNight from "./images/weather-night-partly-cloudy.svg";
import imgCloudy from "./images/weather-cloudy.svg";
import imgRainy from "./images/weather-rainy.svg";
import imgSnowy from "./images/weather-snowy.svg";
import imgSearch from "./images/magnify.svg";
import imgRefresh from "./images/refresh.svg";

const API_KEY = "WZB9B9LMLQWNKL6KHUA54M3GS";

const cacheDOM = function () {
  const searchForm = document.getElementById("search-form");
  const searchbar = document.getElementById("searchbar");
  const btnSearch = document.getElementById("btn-search");
  const dataTemp = document.querySelector(".data-temp");
  const dataDatetime = document.querySelector(".data-datetime");
  const dataLocation = document.querySelector(".data-location");
  const dataIcon = document.querySelector(".data-icon");
  const dataUpdate = document.querySelector(".data-update-container");

  return {
    searchForm,
    searchbar,
    btnSearch,
    dataTemp,
    dataDatetime,
    dataLocation,
    dataIcon,
    dataUpdate,
  };
};

let myDOM = {};
let myClock = undefined;

export function initDOM() {
  myDOM = cacheDOM();
  const searchIcon = document.createElement("img");
  searchIcon.src = imgSearch;
  searchIcon.classList.add("search-icon");
  document.getElementById("label-searchbar").appendChild(searchIcon);

  myDOM.searchForm.addEventListener("submit", (e) => fetchAndDisplayData(e));
}

function fetchAndDisplayData(e) {
  if (e !== undefined) e.preventDefault();
  const input = myDOM.searchbar.value;
  myDOM.searchbar.value = "";

  fetchData(getUrlByLocation(input)).then(function (data) {
    if (data === null || data === undefined) return;
    const location = data.resolvedAddress;
    console.log(data);
    const tempF = data.currentConditions.temp.toFixed(0);
    const tempC = ((tempF - 32) / 1.8).toFixed(0);

    myDOM.dataLocation.textContent = location.toUpperCase();
    myDOM.dataTemp.textContent = `${tempC}° C`;
    myDOM.dataIcon.src = getWeatherIcon(data.currentConditions.icon);
    myDOM.dataIcon.style.width = "64px";
    myDOM.dataUpdate.textContent = `Last updated: ${new Date().toLocaleString(undefined, { month: "numeric", day: "numeric", hour12: false, hour: "numeric", minute: "numeric", second: "numeric" })}`;

    updateTime(data.timezone);

    if (myClock !== undefined) clearInterval(myClock);

    myClock = setInterval(() => {
      updateTime(data.timezone);
    }, 1000);

    // Add a refresh button for user to update the weather data
    if (myDOM.dataUpdate.refreshBtn) {
      myDOM.refreshBtn.remove();
      myDOM.dataUpdate.refreshBtn = undefined;
    }

    const refreshBtn = document.createElement("button");
    const refreshIcon = document.createElement("img");
    refreshIcon.src = imgRefresh;
    refreshIcon.style.width = "28px";
    refreshBtn.append(refreshIcon);
    refreshBtn.addEventListener("click", () => {
      myDOM.searchbar.value = input;
      fetchAndDisplayData(undefined);
    });
    myDOM.refreshBtn = refreshBtn;
    myDOM.dataUpdate.appendChild(refreshBtn);
  });
}

function getWeatherIcon(iconName) {
  // API icon name list:
  //"icon": ["partly-cloudy-day", "rain", "snow", "clear-day", "clear-night", "partly-cloudy-night", "cloudy"]

  switch (iconName) {
    case "partly-cloudy-day":
      return imgPartlyCloudyDay;
    case "rain":
      return imgRainy;
    case "snow":
      return imgSnowy;
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

function updateTime(timezone) {
  let now = new Date();
  let weekday = now.toLocaleString(undefined, {
    timeZone: timezone,
    weekday: "long",
  });
  let time = now.toLocaleString(undefined, {
    timeZone: timezone,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });
  myDOM.dataDatetime.textContent = `${weekday}, ${time}`;
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
