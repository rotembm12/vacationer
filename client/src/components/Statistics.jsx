import React, {useState, useEffect} from 'react';
import {MDBDataTable} from 'mdbreact';

const Statistics = ({flights}) => {
    const [rows, setRows] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const url = 'http://localhost:3000/api/flights';
                const response = await fetch(url);
                const returnedFlights = await response.json();
                setRows(returnedFlights);
            } catch(err) {
                console.log(err);
            }
        })();
    },[])
    
    useEffect(() => {

    },[rows])
    const columns = [
        {
            label: 'ID',
            field: '_id',
            sort: 'asc',
        },
        {
            label: 'ORIGIN',
            field: 'origin',
            sort: 'asc',
        },
        {
            label: 'DESTINATION',
            field: 'destination',
            sort: 'asc',
        },
        {
            label: 'PRICE',
            field: 'price',
            sort: 'asc',
        },
        {
            label: 'DEPARTURE',
            field: 'departure',
            sort: 'asc',
        },
        {
            label: 'ARRIVAL',
            field: 'arrival',
            sort: 'asc',
        },
        {
            label: 'WISHLIST',
            field: 'wishlist',
            sort: 'asc',
        },
        {
            label: 'ORDERS',
            field: 'orders',
            sort: 'asc',
        },
    ];

    return(
        <div id="statistics">
            <MDBDataTable 
                responsive
                striped
                bordered
                hover
                data={ { columns, rows } }
            />
        </div>
    )
}
export default Statistics