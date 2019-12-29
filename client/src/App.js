import './styles.scss';
import React, {useState, useEffect} from 'react';
import Form from './components/Form.jsx';
import Card from './components/Card';

function App() {

    const [store, setStore] = useState({
        airports: [],
        currentSearch: {}
    })
    const [cards, setCards] = useState([]);
    const [flights, setFlights] = useState([]);
    const [myFlights, setMyFlights] = useState([]);

    const getRelatedAirports = (flight) => {
        const {routes} = flight;
        const relAirports = store.airports.filter(airport => {
            return routes.join('').includes(airport.code);
        });
        console.log(relAirports);
        addFlightToDb(flight, relAirports);
    }

    //effect for fetching airports data from cloud db.
    useEffect(() => {
        (async () => {
            try {
                const url = 'http://localhost:3000/api/airports';
                const response = await fetch(url);
                const airports = await response.json();
                setStore({...store, airports});
            } catch (err) {
                console.error(err);
            }
        })()
    },[])

    useEffect(() => {
        console.log(store, flights);
    },[flights])

    useEffect(() => {
        console.log(myFlights);
    },[myFlights])

    const handleFavorite = (_flight) => {
        console.log(_flight)
    }
    //building array that contains the card components.
    const buildFlightsCards = (flightsArr) => {
        const cards = flightsArr.map(flight => {
            return <Card 
                        key={flight.id}
                        flight={flight}
                        getRelatedAirports={getRelatedAirports}
                        handleFavorite={handleFavorite}
                    />
        });
        return cards;
    }

    const getFlights = async (search) => {
        const {from, to, departure, arrival} = search;
        const url = `
         https://api.skypicker.com/flights?to_type=city&flyFrom=${from}&to=${to}&dateFrom=${departure}&dateTo=${arrival}&partner=rotke
        `;
        try {
            const response = await fetch(url);
            const flights = await response.json();
            setStore({...store, currentSearch:search});
            setFlights(flights.data);
            setCards(buildFlightsCards(flights.data))
        } catch(err){
            console.log(err);
        }
    }
    const getMyFlights = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/flights');
            const _flights = await response.json();
            setMyFlights(_flights);
        } catch(err) {
            console.error(err);
        }
    }
    const addFlightToDb = async (flight, airports) => {
        const {dTimeUTC, aTimeUTC, cityFrom, cityTo, price} = flight;
        const _flight = {
            departure: new Date(dTimeUTC*1000),
            arrival: new Date(aTimeUTC*1000),
            origin: cityFrom,
            destination: cityTo,
            price,
            fromAirport: airports[0],
            toAirport: airports[1]
        }
        try {
            const response = await fetch('http://localhost:3000/api/flights', {
                method: 'post',
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify(_flight)
            });
            const myFlight = await response.json();
            console.log(myFlight);
        } catch(err) {
            console.error(err);
        }
        

    }

    return(
        <div>
            <Form submitAction={getFlights}/>
            {cards.map(card => card)}
            <button onClick={getMyFlights}>Get my flights</button>
        </div>
    )
}
export default App;
