/* eslint-disable @typescript-eslint/camelcase */

import { Geocode } from "openrouteservice-js";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const openrouteservice = require("openrouteservice-js");

let directions;
let geocode;
let matrix;
let coordinates;

async function setupAPIKey(apiKey) {
  // console.log("registering api key!");
  directions = new openrouteservice.Directions({
    api_key: apiKey
  });
  geocode = new openrouteservice.Geocode({
    api_key: apiKey
  });
  matrix = new openrouteservice.Matrix({
    api_key: apiKey
  });
  // console.log("API key has successfully been applied");
}

async function toCoordinates(data, boundingBox) {
  const coords = [];
  let localCoord;
  // if the location is an address, convert it to coords
  if (typeof boundingBox == "string") {
    localCoord = await geocode.geocode({
      // look at orsGeocode.js... is there another way to make this more accurate?
      text: boundingBox,
      boundary_country: ["USA"]
      //boundary_circle: { lat_lng: [localCoord[1], localCoord[0]], radius: 80 }
    });
  } else {
    localCoord = boundingBox;
  }
  for (let i = 0; i < data.addresses.length; ++i) {
    // console.log("starting, i=" + i);
    const result = await geocode.geocode({
      // look at orsGeocode.js... is there another way to make this more accurate?
      text: data.addresses[i],
      boundary_country: ["USA"],
      boundary_circle: { lat_lng: [localCoord[1], localCoord[0]], radius: 80 }
    });
    try {
      // See response format at bottom: Geocode Response
      // console.log("response", result.features[0].geometry.coordinates);
      coords.push(result.features[0].geometry.coordinates);
    } catch (err) {
      const str = "An error occured: " + err;
      console.warn(str);
    }
    // console.log("finished, i=" + i);
  }
  return coords;
}

async function getMatrix(coords) {
  // console.log("hopefully this is an array of arrays", coords);
  const result = await matrix.calculate({
    locations: coords,
    profile: "driving-car",
    sources: [0],
    destinations: ["all"]
  });
  try {
    // console.log("response matrix:", result);
    return result;
  } catch (err) {
    const str = "An error occured: " + err;
    console.warn(str);
    return null;
  }
}
async function sortMatrix(matrix) {
  const matrixDestinations = [...matrix.destinations];
  const matrixDurations = [...matrix.durations[0]];
  // Courtesy of stack overflow: https://stackoverflow.com/a/11499391
  const matrixObjects = [];
  for (let j = 0; j < matrixDestinations.length; j++) {
    matrixObjects.push({
      duration: matrixDurations[j],
      destination: matrixDestinations[j]
    });
  }
  // console.log("pre sort, matrix objects", matrixObjects);
  matrixObjects.sort(function(a, b) {
    return a.duration < b.duration ? -1 : a.duration == b.duration ? 0 : 1;
  });

  // console.log("post sort, matrix objects", matrixObjects);

  for (let k = 0; k < matrixObjects.length; k++) {
    matrixDestinations[k] = matrixObjects[k].destination;
    matrixDurations[k] = matrixObjects[k].duration;
  }
  // console.log(
  //   "the final (sorted by duration) dest, duration",
  //   matrixDestinations,
  //   matrixDurations
  // );
  // matrix.destinations = matrixDestinations;
  // matrix.durations[0] = matrixDurations;
  return matrixObjects;
}

async function getDirections(sortedMatrix) {
  const baseURL = "https://www.google.com/maps/dir/?api=1";
  const origin =
    "origin=" +
    sortedMatrix[0].destination.location[1] +
    "%2C" +
    sortedMatrix[0].destination.location[0];
  let waypoints = "waypoints=";
  for (let i = 1; i < sortedMatrix.length - 1; ++i) {
    waypoints +=
      sortedMatrix[i].destination.location[1] +
      "%2C" +
      sortedMatrix[i].destination.location[0] +
      "%7C";
  }
  waypoints = waypoints.slice(0, waypoints.lastIndexOf("%7C"));
  const destination =
    "destination=" +
    sortedMatrix[sortedMatrix.length - 1].destination.location[1] +
    "%2C" +
    sortedMatrix[sortedMatrix.length - 1].destination.location[0];

  const finalResult =
    baseURL +
    "&" +
    origin +
    "&" +
    waypoints +
    "&" +
    destination +
    "&" +
    "dir_action=navigate";
  return finalResult;
}

export async function addressToCoords(address, apiKey) {
  const geo = new openrouteservice.Geocode({
    api_key: apiKey
  });
  const result = await geo.geocode({
    text: address,
    // Where do we get these from?? current location??
    //boundary_circle: { lat_lng: [49.412388, 8.681247], radius: 50 },
    // no bounding box here because this is used for the users current location
    // boundary_circle: { lat_lng: [36.967259, -122.035505], radius: 80 },
    //boundary_bbox: [[49.260929, 8.40063], [49.504102, 8.941707]],
    boundary_country: ["US"]
  });
  try {
    // See response format at bottom: Geocode Response
    // console.log("response", result.features[0].geometry.coordinates);
    return result.features[0].geometry.coordinates;
  } catch (err) {
    const str = "An error occured: " + err;
    console.warn(str);
    return null;
  }
}

export async function validateAddress(address, apiKey, boundingBox) {
  const geo = new openrouteservice.Geocode({
    api_key: apiKey
  });
  let result;
  if (typeof boundingBox == "string") {
    const coords = await addressToCoords(boundingBox, apiKey);
    // it is an address string
    result = await geo.geocode({
      // look at orsGeocode.js... is there another way to make this more accurate?
      text: address,
      boundary_country: ["USA"],
      boundary_circle: { lat_lng: [coords[1], coords[0]], radius: 80 }
    });
  } else {
    // it is an array of coordinates
    result = await geo.geocode({
      text: address,
      boundary_country: ["USA"],
      boundary_circle: { lat_lng: [boundingBox[1], boundingBox[0]], radius: 80 }
    });
  }
  const allResults = result.features.map(feature => {
    return feature.properties.label;
  });
  return allResults;
}

export async function calculateRoute(data) {
  // In the future: optimization: https://github.com/VROOM-Project/vroom/blob/master/docs/API.md#input
  await setupAPIKey(data["api-key"]);
  const coordinates = await toCoordinates(data, data.currentLocation);
  coordinates.unshift(data.currentLocation); // add the current location at the beginning of the array
  const matrix = await getMatrix(coordinates);
  const sortedMatrix = await sortMatrix(matrix);
  const directionsURL = await getDirections(sortedMatrix);
  return directionsURL;
  //setupAPIKey(data["api-key"]);
  //toCoordinates(data);
}

//http://www.openstreetmap.org/?mlat=latitude&mlon=longitude&zoom=12
// Geocode Response
// response.features[0].geometry.coordinates
// {
//   "geocoding":{
//     "version":"0.2",
//     "attribution":"https://openrouteservice.org/terms-of-service/#attribution-geocode",
//     "query":{
//       "text":"True Olive Connection, Santa Cruz",
//       "size":10,
//       "layers":[
//         "venue",
//         "street",
//         "country",
//         "macroregion",
//         "region",
//         "county",
//         "localadmin",
//         "locality",
//         "borough",
//         "neighbourhood",
//         "continent",
//         "empire",
//         "dependency",
//         "macrocounty",
//         "macrohood",
//         "microhood",
//         "disputed",
//         "postalcode",
//         "ocean",
//         "marinearea"
//       ],
//       "private":false,
//       "boundary.country":[
//         "USA"
//       ],
//       "lang":{
//         "name":"English",
//         "iso6391":"en",
//         "iso6393":"eng",
//         "defaulted":false
//       },
//       "querySize":20,
//       "parser":"pelias",
//       "parsed_text":{
//         "subject":"True Olive Connection",
//         "street":"True Olive Connection",
//         "locality":"Santa Cruz",
//         "admin":"Santa Cruz"
//       }
//     },
//     "warnings":[
//       "performance optimization: excluding 'address' layer"
//     ],
//     "engine":{
//       "name":"Pelias",
//       "author":"Mapzen",
//       "version":"1.0"
//     },
//     "timestamp":1598764068998
//   },
//   "type":"FeatureCollection",
//   "features":[
//     {
//       "type":"Feature",
//       "geometry":{
//         "type":"Point",
//         "coordinates":[ // Use these! https://www.openstreetmap.org/#map=19/36.97270/-122.02620
//           -122.026199,
//           36.972746
//         ]
//       },
//       "properties":{
//         "id":"node/1535843098",
//         "gid":"openstreetmap:venue:node/1535843098",
//         "layer":"venue",
//         "source":"openstreetmap",
//         "source_id":"node/1535843098",
//         "name":"True Olive Connection",
//         "housenumber":"106",
//         "street":"Lincoln Street",
//         "confidence":0.8,
//         "match_type":"fallback",
//         "accuracy":"point",
//         "country":"United States",
//         "country_gid":"whosonfirst:country:85633793",
//         "country_a":"USA",
//         "region":"California",
//         "region_gid":"whosonfirst:region:85688637",
//         "region_a":"CA",
//         "county":"Santa Cruz County",
//         "county_gid":"whosonfirst:county:102087581",
//         "county_a":"SZ",
//         "locality":"Santa Cruz",
//         "locality_gid":"whosonfirst:locality:85921769",
//         "neighbourhood":"Downtown",
//         "neighbourhood_gid":"whosonfirst:neighbourhood:85880729",
//         "continent":"North America",
//         "continent_gid":"whosonfirst:continent:102191575",
//         "label":"True Olive Connection, Santa Cruz, CA, USA"
//       }
//     }
//   ],
//   "bbox":[
//     -122.026199,
//     36.972746,
//     -122.026199,
//     36.972746
//   ]
// }
