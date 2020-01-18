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
        const reqBody = {
            url
        }
        try {
            const response = await fetch(`/api/flights/outerapi`,{
                method: 'post',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqBody)
            });
            const flights = await response.json();
            if(flights.length > 0){
                handleFlights(flights);
            }
            setFlights(flights);
        } catch(err){
            console.log(err);
        }
    }
    
    return (
        <div className="search-page">
            <Form submitAction={getFlights}/>
        </div>
    );
}
export default Search;