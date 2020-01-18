import './styles.scss';
import React, {useState, useEffect} from 'react';
import Nav from './components/Nav.jsx';
import Search from './components/Search.jsx';
import Wishlist from './components/Wishlist.jsx';
import Login from './components/Login.jsx';
import Statistics from './components/Statistics.jsx'
import Discounts from './components/Discounts.jsx';

import { MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBInput } from 'mdbreact';

function App() {
    const [airports, setAirports] = useState([]);
    const [flights, setFlights] = useState([]);
    const [isLogin, setIsLogin] = useState(true);
    const [isSearch, setIsSearch] = useState(false);
    const [isWishlist, setIsWishlist] = useState(false);
    const [isStatistics, setIsStatistics] = useState(false);
    const [isDiscounts, setIsDiscounts] = useState(false);
    const [wishlist, setWishlist] = useState([]);
    const [loggedUser, setLoggedUser] = useState({});


    //ORDER MODAL STATE
    const [passports, setPassports]= useState({
        //name1: "",
        //phone1: ""
        //......
    })
    const [price, setPrice] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState(1);

    //effect for fetching airports data from cloud db.
    useEffect(() => {
        (async () => {
            try {
                const url = '/api/airports';
                const response = await fetch(url);
                const airports = await response.json();
                setAirports(airports);
            } catch (err) {
                console.error(err);
            }
        })();
    },[]);


    useEffect(() => {
        if(localStorage.hasOwnProperty('flights')){
            const flights = localStorage.getItem('flights').split(',');
            setWishlist(flights);
        }
    },[]);
    
    const handleSearchedFlights = (flights) => {
        const selectedFlights = flights.length > 25 ? flights.slice(0,25) : flights;
        setFlights(selectedFlights);
        console.log(selectedFlights);
    }

    const handleLogin = async user => {
        try {
            const response = await fetch('/api/users/login', {
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
            flyTo,
            airlines
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
            apiId: id,
            airline: airlines[0]
        }
        try {
            const response = await fetch('/api/flights/wishlist', {
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
                localStorage.setItem('flights', [...customerSavedFlights, myFlight.apiId])
            } else {
                localStorage.setItem('flights', [myFlight.apiId]);
            }
        } catch(err) {
            console.error(err);
        }
    }
 
    const removeFlightFromFav = async (flight) => {
        try {
            const response = await fetch(`/api/flights/wishlist/${flight._id}`,{
                method: 'DELETE'
            });
            const deletedFlight = await response.json();
            const tmpWishlist = wishlist.filter(flgId => {
                return flgId !== deletedFlight.apiId;
            });    
            setWishlist(tmpWishlist);
            
            const wishlistIds = localStorage['flights'].split(',');
            const updatedWishlistIds = wishlistIds.filter(id => {
                return id !== deletedFlight.apiId
            });
            if(!updatedWishlistIds.length){
                return localStorage.removeItem('flights');
            }
            localStorage.setItem('flights', updatedWishlistIds);
        } catch(err) {
            console.error(err);
        }
    }

    const handleOrder = async () => {
        for(let i = 0; i < amount; i++){
            if(!passports[`name${i}`] || passports[`name${i}`] === "" || !passports[`phone${i}`] || passports[`phone${i}`] === ""){
                return console.log('empty fields', passports);
            }
        }
        const flight = JSON.parse(localStorage.getItem('flightOrder'));
        const {
            id,
            dTimeUTC,
            aTimeUTC,
            cityFrom, 
            cityTo,
            price, 
            flyFrom, 
            flyTo,  
            airlines
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
            apiId: id,
            airline: airlines ? airlines[0] : ''
        }
        console.log(_flight);
        try {
            const response = await fetch('/api/flights/order', {
                method: 'post',
                headers: {
                'Content-Type': 'application/json'
                },
                body: !isWishlist ? JSON.stringify(_flight) : JSON.stringify(flight)
            });
            const orderedFlight = await response.json();
            if(orderedFlight){
                setPassports({});
                setIsOpen(false);
                alert('purchase success');
            }
        } catch(err) {
            console.error(err);
        }
    }

    const openOrderModal = (flight) => {
        localStorage.setItem('flightOrder', JSON.stringify(flight));
        setIsOpen(true);
    }

    useEffect(() => {
        if(!isOpen){
            setAmount(1);
            setPrice(0);
            return;
        }
        const flight = localStorage.getItem('flightOrder');
        const flightToOrder = JSON.parse(flight);        
        setPrice(flightToOrder.price * parseInt(amount));
    },[isOpen])

    useEffect(() => {
        if(price){
            const flightToOrder = JSON.parse(localStorage.getItem('flightOrder'));
            setPrice(amount*flightToOrder.price);
        }
    }, [amount])

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
                setIsStatistics(false);
                setIsDiscounts(false);
                break;

            case 'wishlist': 
                setIsWishlist(true);
                setIsSearch(false);
                setIsLogin(false);
                setIsStatistics(false);
                setIsDiscounts(false);
                break;

            case 'login':
                setIsWishlist(false);
                setIsSearch(false);
                setIsLogin(true);
                setIsStatistics(false);
                setIsDiscounts(false);
                break;

            case 'statistics':
                setIsStatistics(true);
                setIsSearch(false);
                setIsLogin(false);
                setIsWishlist(false);
                setIsDiscounts(false);
                break;

            case 'discounts':
                setIsDiscounts(true);
                setIsStatistics(false);
                setIsSearch(false);
                setIsLogin(false);
                setIsWishlist(false);
                break;

            default:
                break;
        }
    }

    const createFlightCards = (flights) => {
        return flights.map(flight => {
            let isInList = false;
            if(wishlist.length > 0){
                isInList = wishlist.find(flgId => flgId === flight.id) ? true : false;
            }
            if(flight.discount){
                const {discount, price} = flight;
                flight['newPrice'] = price - price * (discount/100);
            }
            return (
                <div 
                    className='my-card row justify-content-center' 
                    key={flight.id}
                >
                    <div className="c-item col-5 text-center">
                        <MDBBtn
                            onClick={() => openOrderModal(flight)}
                            color="light-green"
                        >
                            Order
                        </MDBBtn>
                        <br/>
                        <MDBBtn 
                            onClick={!isInList ? () => addFlightToFav(flight) : null}
                            color={!isInList ? "secondary" : "warning"}
                        >
                            {!isInList ? 'add to wishlist' : 'in list'}
                        </MDBBtn>
                    </div>
                        
                    <div className="c-item col-5">
                        {flight.cityFrom} -> {flight.cityTo}
                        <br />
                        {flight.discount ? ( flight.discount + '% SALE') : ''}
                    </div>
                    <div className="c-item col-2 text-center">
                        {flight.newPrice || flight.price} EUR
                    </div>
                </div>
            )
        });
    }
    const renderPassportInputs = () => {
        const inputs = [];
        for(let i = 0; i < amount; i++){
            inputs.push(
                <div key={`passport${i}`}>
                    <MDBInput
                        label = "FULL NAME"
                        value = {passports[`name${i}`]}
                        onChange={(e) => {setPassports({
                                ...passports,
                                [`name${i}`]:e.target.value
                            })}}
                    />
                    <MDBInput
                        label = "PHONE"
                        value = {passports[`phone${i}`]}
                        onChange={(e) => {setPassports({
                                ...passports,
                                [`phone${i}`]:e.target.value
                            })}}
                    />
                </div>
            );
        } 
        return inputs;
    }
    return(
        <div className="app container">
            <Nav 
                handleViewChange={handleViewChange} 
                isLogged={loggedUser.name ? true : false}
                handleLogout={handleLogout}
            />

            {isStatistics ? <Statistics /> : '' }

            {isDiscounts ? <Discounts/> : '' }
            
            {isLogin ? <Login
                            handleLogin={handleLogin}
                            isLogged={loggedUser.name ? true : false}
                       /> : ''}

            {isSearch ? <Search 
                            airports={airports} 
                            handleFlights={handleSearchedFlights}
                            wishlist={wishlist}
                        /> :
            ''}

            {isWishlist ? <Wishlist
                            removeFlightFromFav={removeFlightFromFav}
                            handleOrder={openOrderModal}
                          /> :
            ''}         
            {isSearch ? createFlightCards(flights) : ''}
            {isOpen ? <MDBModal isOpen={isOpen} >
                <MDBModalHeader>order details</MDBModalHeader>
                <MDBModalBody>
                    <MDBInput
                        label="TICKETS AMOUNT"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <h4>PRICE {price}EURO</h4>
                    {renderPassportInputs()}
                </MDBModalBody>
                <MDBModalFooter>
                <MDBBtn color="danger" onClick={() => {setIsOpen(false)}}>Close</MDBBtn>
                <MDBBtn color="success" onClick={handleOrder}>order</MDBBtn>
                </MDBModalFooter>
            </MDBModal>:null}
        </div>
    )
}
export default App;
