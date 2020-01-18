import React, {useState, useEffect} from 'react';
import {MDBBtn} from 'mdbreact';
import ReactDatatable from '@ashvin27/react-datatable';
const Statistics = ({flights}) => {
    const [rows, setRows] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const url = '3000/api/flights';
                const response = await fetch(url);
                const returnedFlights = await response.json();
                const rows = Array.from(returnedFlights);
                console.log(rows);
                setRows(rows);
            } catch(err) {
                console.log(err);
            }
        })();
    },[])
    
    const config = {
        page_size: 10,
        length_menu: [10,20,50]
    }

    const columns = [
        {
            text: 'ID',
            key: '_id',
            width: 50
        },
        {
            text: 'ORIGIN',
            key: 'origin',
            sortable: true,
        },
        {
            text: 'DESTINATION',
            key: 'destination',
            sortable: true,
        },
        {
            text: 'PRICE',
            key: 'price',
            sortable: true,
        },
        {
            text: 'WISHLIST',
            key: 'wishlist',
            sortable: true,
        },
        {
            text: 'ORDERS',
            key: 'orders',
            sortable: true,
        },
        {
            text:'AIRLINE',
            key: 'airline',
            sortable: true
        },
        {
            text: 'DEPARTURE',
            key: 'departure',
            sortable: true,
        },
        {
            text: 'ARRIVAL',
            key: 'arrival',
            sortable: true,
        }
        
    ];

    return(
        <div id="statistics">
            <ReactDatatable
                config={config}
                records={rows}
                columns={columns}
            />
        </div>
    )
}
export default Statistics