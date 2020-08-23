/* eslint-disable @typescript-eslint/camelcase */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const openrouteservice = require("openrouteservice-js");

let directions;
let geocode;
let matrix;
let coordinates;
function setupAPIKey(apiKey) {
  console.log("registering api key!");
  directions = new openrouteservice.Directions({
    api_key: apiKey
  });
  geocode = new openrouteservice.Geocode({
    api_key: apiKey
  });
  matrix = new openrouteservice.Matrix({
    api_key: apiKey
  });
  console.log("API key has successfully been applied");
}

export function toCoordinates(data) {
  console.log("to coordinates");
  data.stores.forEach(store => {
    console.log(store);
  });
}

export function calculateRoute(data) {
  setupAPIKey(data["api-key"]);
  toCoordinates(data);
}
