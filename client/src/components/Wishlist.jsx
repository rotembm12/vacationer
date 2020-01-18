import React, {useState,useEffect} from 'react';
import { MDBBtn, MDBRow, MDBCol} from 'mdbreact';
const Wishlist = ({removeFlightFromFav, handleOrder}) => {
    const [flights, setFlights] = useState([]);
    const [isEmptyWishlist, setIsEmptyWishlist] = useState(false);
    useEffect(() => {
        (async () => {
            try {
                const flightsIds = localStorage.hasOwnProperty('flights') ? localStorage['flights'].split(',') : [];
                if(flightsIds.length > 0){
                    const url = `/api/flights/?flights=${localStorage['flights']}`;
                    const response = await fetch(url);
                    const flights = await response.json();
                    console.log(flights);
                    if(!(flights.length > 0)){
                        return setIsEmptyWishlist(true);
                    }
                    setFlights(flights);
                }else {
                    setIsEmptyWishlist(true);
                }
            } catch (err) {
                console.error(err);
            }
        })();
    },[])

    const handleRemove = _flight => {
        removeFlightFromFav(_flight);
        const _flights = flights.filter(flight => flight._id !== _flight._id);
        if(_flights.length == 0 ){
            setIsEmptyWishlist(true);
        }
        setFlights(_flights);
    }
    
    const createFlightCards = flights => {
        if(flights.length == 0){
            return (
                <MDBRow center> 
                    <h4 className="text-info mt-5">Your wishlist is empty</h4>
                </MDBRow>
            )
        }
        const cards = flights.map(flight => {
            if(flight.discount){
                const {discount, price} = flight;
                flight['newPrice'] = Math.round(price - price * (discount/100));
            }
            return (
                <div className={flight['newPrice'] ? 'my-card sale row justify-content-center' : 'my-card row justify-content-center'}
                     key={flight._id}
                >
                    <div className="c-item col-4 c-item badges-col text-center align-items-center">
                        <MDBBtn
                            onClick={() => {handleOrder(flight, true)}}
                            color="light-green"
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
                    <div className="sale c-item col-5 p-3">
                        {flight.discount && flight.discount > 0 ? ( <>
                            <span className="span-sale">{flight.discount + '% SALE'}</span>
                            <br/>
                        </> ) : ''}
                        {flight.origin} &rarr; {flight.destination}
                        <br/>
                        Airline {flight.airline}
                        <br/>
                        Departure {new Date(Date.parse(flight.departure)).toLocaleString()}
                        <br/>
                        Arrival {new Date(Date.parse(flight.arrival)).toLocaleString()}
                    </div>
                    <div className="c-item col-3 text-center">
                        <span>{flight.newPrice || flight.price} EUR</span>
                    </div>
                </div>
            );
        });
        return cards;
    }
    return (
        <div className="wishlist-page">
            <div className='flight-cards'>
                {flights.length > 0 || isEmptyWishlist ? createFlightCards(flights) : (
                    <MDBRow around = {true}>
                        <MDBCol
                            size="1"
                            around={true}
                        >
                            <div className="spinner-border text-primary" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </MDBCol>
                    </MDBRow>
                )}
            </div>
        </div>
    )
}
export default Wishlist;
