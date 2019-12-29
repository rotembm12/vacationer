import React, {useState,useEffect} from 'react';

const Wishlist = ({removeFlightFromFav}) => {
    const [flights, setFlights] = useState([]);
    
    useEffect(() => {
        (async () => {
            try {
                const url = 'http://localhost:3000/api/flights';
                const response = await fetch(url);
                const flights = await response.json();
                setFlights(flights);
                console.log(flights);
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
                <div className='card' key={flight._id}>
                    <div className="c-item">
                        <button onClick={() => handleRemove(flight)}>
                            Remove from fav
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
            );
        });
        return cards;
    }
    return (
        <div className="wishlist-page">
            <header>
                this is your wishlist page
            </header>
            <div className='flight-cards'>
                {createFlightCards(flights)}
            </div>
        </div>
    )
}
export default Wishlist;
