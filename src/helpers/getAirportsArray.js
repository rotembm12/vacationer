const fetch = require('node-fetch');
const url =
   'https://api.skypicker.com/locations?type=dump&locale=en-US&location_types=airport&limit=4000&active_only=true&sort=name';

const getAirports = async () => {
   try {
      const response = await fetch(url);
      const airports = await response.json();
      return airports;
   } catch (err) {
      return console.log(err);
   }
};

const insertAirports = async () => {
   const airports = await getAirports();
   console.log(airports.locations);

   const filteredAirports = airports.locations.map(airport => {
      const name = airport.name.replace("'", '');
      const country = airport.city.country.name.replace("'", '');
      const city = airport.city.name.replace("'", '');
      const filteredAirport = {
         name,
         country,
         city,
         longitude: airport.location.lon,
         latitude: airport.location.lat,
         code: airport.code
      };
      return filteredAirport;
   });
   try {
      filteredAirports.forEach(async airport => {
         const response = await fetch(`http://localhost:3000/api/airports`, {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
               'Content-Type': 'application/json'
               // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(airport)
         });
         console.log(response);
      });
   } catch (err) {
      console.error(err);
   }
};

insertAirports();
