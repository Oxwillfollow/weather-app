import "./styles.css";

const API_KEY = "WZB9B9LMLQWNKL6KHUA54M3GS";

const getUrlByLocation = function (location) {
  const currentDate = new Date();
  return `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/${currentDate.toISOString()}?key=${API_KEY}&contentType=json&include=current`;
};

async function fetchData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) throw new Error(response.status);

    const data = await response.json();
    return data; // returning resolves the promise, executes the cb from .then()
  } catch (error) {
    console.error(error);
  }
}

const promptLocation = prompt("Enter location: ");

fetchData(getUrlByLocation(promptLocation)).then(function (data) {
  const location = data.resolvedAddress;
  const localTime = new Date().toLocaleString({ timeZone: data.timeZone });
  const measuredAtTime = data.currentConditions.datetime.slice(0, -3);
  const condition = data.currentConditions.conditions;
  const tempF = data.currentConditions.temp.toFixed(0);
  const tempC = ((tempF - 32) / 1.8).toFixed(0);
  console.log(data);
  console.log(`${location}, ${localTime}. ${condition}. ${tempC} C`);
  console.log(`Measured at: ${measuredAtTime}`);
});
