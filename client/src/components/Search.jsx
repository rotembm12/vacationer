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
    
    return (
        <div className="search-page">
            This is your search page
            <Form submitAction={getFlights}/>
        </div>
    );
}
export default Search;