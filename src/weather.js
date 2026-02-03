const API_KEY = "WZB9B9LMLQWNKL6KHUA54M3GS";

const cacheDOM = function () {
  const searchbar = document.getElementById("searchbar");
  const btnSearch = document.getElementById("btn-search");
  const dataTemp = document.querySelector(".data-temp");
  const dataDatetime = document.querySelector(".data-datetime");
  const dataLocation = document.querySelector(".data-location");
  const dataConditions = document.querySelector(".data-conditions");
  const dataIcon = document.querySelector(".data-icon");

  return {
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

  myDOM.searchbar.parentNode.addEventListener("submit", (e) =>
    fetchAndDisplayData(e),
  );
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
    console.log(data.timezone);
    const measuredAtTime = data.currentConditions.datetime.slice(0, -3);
    const condition = data.currentConditions.conditions;
    const tempF = data.currentConditions.temp.toFixed(0);
    const tempC = ((tempF - 32) / 1.8).toFixed(0);

    myDOM.dataTemp.textContent = `${tempC}° C`;
    myDOM.dataLocation.textContent = location.toUpperCase();
    myDOM.dataDatetime.textContent = `${localTime} (measured at ${measuredAtTime})`;
    myDOM.dataConditions.textContent = condition;
  });
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
