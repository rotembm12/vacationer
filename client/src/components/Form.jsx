import React, {useState} from 'react';
import {MDBBtn, MDBInput} from 'mdbreact';
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
        <div className="form row justify-content-center">
            <div className="col-10">
                <MDBInput 
                    type="text"
                    label="From Destination"
                    name="from"
                    value={from}
                    onChange={handleChange}
                />
            </div>
            <div className="col-10">
                <MDBInput 
                    type="text"
                    label="To Destination"
                    name="to"
                    value={to}
                    onChange={handleChange}
                />
            </div>
            <div className="col-10">
                <MDBInput 
                    type="date"
                    label="Departure Date"
                    name="departure"
                    value={depart}
                    onChange={handleChange}
                />
            </div>
            <div className="col-10">
                <MDBInput 
                    type="date"
                    label="Arrival Date"
                    name="arrival"
                    value={arrival}
                    onChange={handleChange}
                />
            </div>
        
            <MDBBtn 
                color="light-blue"
                size="lg"
                onClick={handleSubmit}>
                Search
            </MDBBtn>
        </div>
    );
}
export default Form;