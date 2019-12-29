
    // const {origin, destination, setoff, arrive} = document.forms[0].elements;
    // // const setoffDate = formatDate(setoff.value);
    // // const arriveDate = formatDate(arrive.value);
    // origin.value = "tlv".toUpperCase();
    // destination.value = "prg".toUpperCase();
    // const setoffDate = "26/12/2019";
    // const arriveDate = "29/12/2019"
    // const url = `
    // https://api.skypicker.com/flights?to_type=city&flyFrom=${origin.value}&to=${destination.value}&dateFrom=${setoffDate}&dateTo=${arriveDate}&partner=rotke
    // `;
    // const response = await fetch(url);
    // const data = await response.json();
    // const flights = data.data;

import React, {useState} from 'react';

const Form = ({submitAction}) => {
    const [from,setFrom] = useState('TLV');
    const [to, setTo] = useState('PRG');
    const [depart, setDepart] = useState('');
    const [arrival, setArrival] = useState('');
    const handleChange = (e) => {
        switch(e.target.name){
            case 'from':
                setFrom(e.target.value);
                break;
            case 'to':
                setTo(e.target.value);
                break;
            case 'departure':
                setDepart(e.target.value);
                break;
            case 'arrival':
                setArrival(e.target.value);
                break;    
        }
    }
    const handleSubmit = e => {
        const searchData = {
            from,
            to, 
            departure: formatDate(depart),
            arrival: formatDate(arrival)
        }
        return submitAction(searchData);
    }

    const formatDate = (input) => {
        var datePart = input.match(/\d+/g),
            year = datePart[0],
            month = datePart[1],
            day = datePart[2];
        return day + "/" + month + "/" + year;
    }

    return (
        <div className="form">
            <label htmlFor="">From</label>
            <input 
                type="text"
                name="from"
                value={from}
                onChange={handleChange}
            />
            <label htmlFor="">To</label>
            <input 
                type="text"
                name="to"
                value={to}
                onChange={handleChange}
            />
            <label htmlFor="">To</label>
            <input 
                type="date"
                name="departure"
                value={depart}
                onChange={handleChange}
            />
            <label htmlFor="">To</label>
            <input 
                type="date"
                name="arrival"
                value={arrival}
                onChange={handleChange}
            />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}
export default Form;