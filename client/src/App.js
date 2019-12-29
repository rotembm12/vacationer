import './styles.scss';
import React, {useState, useEffect} from 'react';
import Nav from './components/Nav.jsx';
import Wishlist from './components/Wishlist.jsx';
import Search from './components/Search.jsx';


function App() {
    const [airports, setAirports] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    const [isWishlist, setIsWishlist] = useState(false);
    const [refresh, setRefresh] = useState(1);
    //effect for fetching airports data from cloud db.
    useEffect(() => {
        (async () => {
            try {
                const url = 'http://localhost:3000/api/airports';
                const response = await fetch(url);
                const airports = await response.json();
                setAirports(airports);
            } catch (err) {
                console.error(err);
            }
        })()
    },[])

    const addFlightToFav = async (flight) => {
        const {
            id,
            dTimeUTC,
            aTimeUTC,
            cityFrom, 
            cityTo,
            price, 
            flyFrom, 
            flyTo
        } = flight;
        const fromAirport = getRelatedAirports(flyFrom);
        const toAirport = getRelatedAirports(flyTo);
        const _flight = {
            departure: new Date(dTimeUTC*1000),
            arrival: new Date(aTimeUTC*1000),
            origin: cityFrom,
            destination: cityTo,
            price,
            fromAirport,
            toAirport,
            apiId: id
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

    const removeFlightFromFav = async (flight) => {
        try {
            const response = await fetch(`http://localhost:3000/api/flights/${flight._id}`,{
                method: 'DELETE'
            });
            const deletedFlight = await response.json();
            console.log(deletedFlight);
        } catch(err) {
            console.error(err);
        }
    }

    const getRelatedAirports = (apCode) => {
        const airport = airports.find(airport => {
            return airport.code === apCode;
        });
        return airport;
    }

    const handleViewChange = (targetId) => {
        switch(targetId){
            case 'search':
                setIsSearch(true);
                setIsWishlist(false);
                break;
            case 'wishlist': 
                setIsWishlist(true);
                setIsSearch(false);
                break;
        }
    }
    return(
        <div className="container">
            <Nav handleViewChange={handleViewChange}/>
            {isSearch ? <Search 
                            airports={airports} 
                            addFlightToFav={addFlightToFav}
                        /> :
             ''}
            {isWishlist ? <Wishlist
                            removeFlightFromFav={removeFlightFromFav}
                          /> :
             ''}            
        </div>
    )
}
export default App;
