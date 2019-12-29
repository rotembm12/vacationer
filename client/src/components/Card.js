import React from 'react';

const Card  = ({flight, getRelatedAirports, handleFavorite}) => {
    const handleClick = (e) => {
        getRelatedAirports(flight);
    }
    const addToFav = e => {
        handleFavorite(flight);
    }
    return (
        <div
         onClick={handleClick}
         className='card'
        >
            <div className="c-item">
                {handleFavorite ? (
                    <button onClick={addToFav}>Add to fav</button>
                ):(
                    <button>Remove from fav</button>
                )}
                <button>Order</button>
            </div>
            <div className="c-item">
                {flight.cityFrom || flight.origin} -> {flight.cityTo || flight.destination}
            </div>
            <div className="c-item">
                {flight.price}EUR
            </div>
        </div>
    )
}
export default Card;