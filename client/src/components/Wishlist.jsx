import React, {useState,useEffect} from 'react';
import { MDBBtn, MDBBadge} from 'mdbreact';
const Wishlist = ({removeFlightFromFav, handleOrder}) => {
    const [flights, setFlights] = useState([]);
    
    useEffect(() => {
        (async () => {
            try {
                const flightsIds = localStorage.hasOwnProperty('flights') ? localStorage['flights'].split(',') : [];
                if(flightsIds.length > 0){
                    const url = `http://localhost:3000/api/flights/?flights=${localStorage['flights']}`;
                    const response = await fetch(url);
                    const flights = await response.json();
                    console.log(flights);
                    setFlights(flights);
                }
                return;
            } catch (err) {
                console.error(err);
            }
        })();
    },[])

    const handleRemove = _flight => {
        removeFlightFromFav(_flight);
        const _flights = flights.filter(flight => flight._id !== _flight._id);
        setFlights(_flights);
    }
    
    const createFlightCards = flights => {
        const cards = flights.map(flight => {
            return (
                <div className='my-card row justify-content-center' key={flight._id}>
                    <div className="col-4 c-item badges-col text-center align-items-center">
                        <MDBBtn
                            onClick={() => {handleOrder(flight, true)}}
                            color="light"
                        >
                            Order
                        </MDBBtn>
                        <MDBBtn 
                            onClick={() => handleRemove(flight)}
                            color="danger"
                        >
                            Remove
                        </MDBBtn>
                        
                    </div>
                    <div className="col-5 p-3">
                        {flight.origin} -> {flight.destination}
                    </div>
                    <div className="col-3 text-center">
                        {flight.price}EUR
                    </div>
                </div>
            );
        });
        return cards;
    }
    return (
        <div className="wishlist-page">
            <div className='flight-cards'>
                {createFlightCards(flights)}
            </div>
        </div>
    )
}
export default Wishlist;
