import React, {useState, useEffect} from 'react';
import Form from './Form.jsx';
import Card from './Card';
const Search = ({airports, handleFlights}) => {
    const [flights, setFlights] = useState(flights || []);

    const getFlights = async (search) => {
        const {from, to, departure, arrival} = search;
        const url = `
         https://api.skypicker.com/flights?to_type=city&flyFrom=${from}&to=${to}&dateFrom=${departure}&dateTo=${arrival}&partner=rotke
        `;
        try {
            const response = await fetch(url);
            const flights = await response.json();
            if(flights.data.length > 0){
                handleFlights(flights.data);
            }
            setFlights(flights.data);
        } catch(err){
            console.log(err);
        }
    }

    // const addToFav = (flight) => {
    //     addFlightToFav(flight);
    //     if(!localStorage.getItem('wishlistId')){
    //         localStorage.setItem('wishlistId', 123);
    //     } else {

    //     }
    // }

    const createFlightCards = () => {
        return flights.map(flight => {
            return (
                <div 
                    className='card' 
                    key={flight.id}
                >
                    <div className="c-item">
                        <button onClick={() => addToFav(flight)}>
                            Add to wishlist
                        </button>
                        <button>Order</button>
                    </div>
                    <div className="c-item">
                        {flight.origin} -> {flight.destination}
                    </div>
                    <div className="c-item">
                        {flight.price}EUR
                    </div>
                </div>
            )
        })
    }
    return (
        <div className="search-page">
            This is your search page
            <Form submitAction={getFlights}/>
        </div>
    );
}
export default Search;