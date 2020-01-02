import './styles.scss';
import React, {useState, useEffect} from 'react';
import Nav from './components/Nav.jsx';
import Search from './components/Search.jsx';
import Wishlist from './components/Wishlist.jsx';
import Login from './components/Login.jsx';

function App() {
    const [airports, setAirports] = useState([]);
    const [flights, setFlights] = useState([]);
    const [isLogin, setIsLogin] = useState(true);
    const [isSearch, setIsSearch] = useState(false);
    const [isWishlist, setIsWishlist] = useState(false);
    const [wishlist, setWishlist] = useState([]);
    const [loggedUser, setLoggedUser] = useState({});

    useEffect(() => {
        console.log(loggedUser);
    }, [loggedUser]);

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

    const handleSearchedFlights = (flights) => {
        const selectedFlights = flights.slice(0,25);
        setFlights(selectedFlights);
    }

    const handleLogin = async user => {
        try {
            const response = await fetch('http://localhost:3000/api/users/login', {
                method: 'post',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            const res = await response.json();
            if(res.name){
                setLoggedUser(res);
                handleViewChange('search');
            }
        } catch(err) {
            console.log(err);
        }
    }

    const handleLogout = () => {
        setLoggedUser({});
        handleViewChange('login');
    }

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
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(_flight)
            });
            const myFlight = await response.json();
            setWishlist([...wishlist, id]);
            if(localStorage.hasOwnProperty('flights')){
                const customerSavedFlights = localStorage['flights'].split(',');
                localStorage.setItem('flights', [...customerSavedFlights, myFlight._id])
            } else {
                localStorage.setItem('flights', [myFlight._id]);
            }
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
            const tmpWishlist = wishlist.filter(flight => {
                return flight.apiId !== deletedFlight.apiId;
            });    
            setWishlist(tmpWishlist);
            
            const wishlistIds = localStorage['flights'].split(',');
            const updatedWishlistIds = wishlistIds.filter(id => {
                return id !== deletedFlight._id
            });
            if(!updatedWishlistIds.length){
                return localStorage.removeItem('flights');
            }
            localStorage.setItem('flights', updatedWishlistIds);
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
                setIsLogin(false);
                break;
            case 'wishlist': 
                setIsWishlist(true);
                setIsSearch(false);
                setIsLogin(false);
                break;
            case 'login':
                setIsWishlist(false);
                setIsSearch(false);
                setIsLogin(true);
        }
    }

    const createFlightCards = (flights) => {
        return flights.map(flight => {
            let isInList = wishlist.indexOf(flight.id) > -1;
            console.log(isInList)
            return (
                <div 
                    className='card' 
                    key={flight.id}
                >
                    <div className="c-item">
                        <button onClick={!isInList ? () => addFlightToFav(flight) : null}>
                            {!isInList ? 'add to wishlist' : 'in list'}
                        </button>
                        <button>Order</button>
                    </div>
                    <div className="c-item">
                        {flight.cityFrom} -> {flight.cityTo}
                    </div>
                    <div className="c-item">
                        {flight.price} EUR
                    </div>
                </div>
            )
        });
    }

    return(
        <div className="app container">
            <Nav 
                handleViewChange={handleViewChange} 
                isLogged={loggedUser.name ? true : false}
                handleLogout={handleLogout}
            />

            {isLogin ? <Login handleLogin={handleLogin}/> : ''}

            {isSearch ? <Search 
                            airports={airports} 
                            handleFlights={handleSearchedFlights}
                            wishlist={wishlist}
                        /> :
            ''}

            {isWishlist ? <Wishlist
                            removeFlightFromFav={removeFlightFromFav}
                          /> :
            ''}         
            {isSearch ? createFlightCards(flights) : ''}
        </div>
    )
}
export default App;
