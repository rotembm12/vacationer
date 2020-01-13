import React, {useState, useEffect} from 'react';
import _ from 'lodash';
import ReactDatatable from '@ashvin27/react-datatable';
import {MDBBtn, MDBInput, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter} from 'mdbreact';

const Discounts = () => {
    const [rows, setRows] = useState([]);
    //inputs controllers//
    const [airline,setAirline] = useState("");
    const [discount, setDiscount] = useState("");
    const [minWishlists, setMinWishlists] = useState("");
    const [minOrders,setMinOrders] = useState("");
    //-----------------//
    const [isEditMode, setIsEditMode] = useState(false);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [isUpdateTime, setIsUpdateTime] = useState(false);
    const [currentRecord, setCurrentRecord] = useState({});
    
    useEffect(() => {
        (async () => {
            try {
                const url = 'http://localhost:3000/api/discount';
                const response = await fetch(url);
                const returnedDiscounts = await response.json();
                setRows(returnedDiscounts);
            } catch(err) {
                console.error(err);
            }
        })();
    },[])

    const onStartEditMode = (discountRecord) => {
        const {airline, minOrders, minWishlists, discount } = discountRecord;
        setAirline(airline);
        setMinOrders(minOrders);
        setMinWishlists(minWishlists);
        setDiscount(discount);
        setIsEditMode(true);
        setCurrentRecord(discountRecord);
    }

    const onEditDiscount = () => {
        setCurrentRecord({
            ...currentRecord,
            airline,
            minOrders,
            minWishlists,
            discount
        });
        setIsUpdateTime(true);
    }

    //effect for u
    useEffect(() => {
        (async () => {
            if(_.isEmpty(currentRecord) || !isUpdateTime){
                return console.warn(`
                stopped updating currentRecord due to emptiness or its not time to ship
                `);
            }
            try {
                const response = await fetch(`http://localhost:3000/api/discount/${currentRecord._id}`,{
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(currentRecord)
                });
                const updatedDiscount = await response.json();
                const filteredRows = rows.filter(discount => {
                    return discount._id !== updatedDiscount._id;
                })
                console.log(updatedDiscount);
                setRows([updatedDiscount, ...filteredRows]);
                setIsUpdateTime(false);
                onCancelMode('edit');
            } catch(err){
                console.error(err);
            }
        })();
    },[currentRecord])

    const onCreateDiscount = async () => {
        const discountObj = {
            airline,
            minOrders,
            minWishlists,
            discount
        }
        if(airline === "" || minOrders === "" || minWishlists === "" || discount === ""){
            return alert('Please fill all fields');
        }
        try {
            const response = await fetch('http://localhost:3000/api/discount',{
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(discountObj)
            });
            const createdDiscount = await response.json();
            console.log(createdDiscount);
            setRows([...rows, createdDiscount]);
            onCancelMode('create');
        } catch(err){
             console.error(err);
        }
    }

    const onDeleteDiscount = async (discount) => {
        try {
            const response = await fetch(`http://localhost:3000/api/discount/${discount._id}`,{
                method: 'delete'
            });
            const deletedDiscount = await response.json();
            if(deletedDiscount._id === discount._id){
                const filteredDiscounts = rows.filter(disc => {
                    return disc._id !== discount._id;
                });
                setRows(filteredDiscounts);
            }
        } catch(err){
            console.error(err);
        }
    }

    const onCancelMode = (mode) => {
        switch(mode){
            case 'edit':
                setIsEditMode(false);
                break;
            case 'create':
                setIsCreateMode(false)
                break;
            default:
                break;
        }
        clearState();
    }

    const clearState = () => {
        setAirline("");
        setMinOrders("");
        setMinWishlists("");
        setDiscount("");
    }

    const extraButtons = [
        {
            className: 'btn btn-info',
            title: 'Create new Discount',
            onClick: () => {
                console.log('creating');
            }
        }
    ]
    const columns = [
        {
            text: 'ID',
            key: '_id',
            sortable:true
        },
        {
            text: 'MIN WISHLIST',
            key: 'minWishlists',
            sortable:true
        },
        {
            text: 'MIN ORDERS',
            key: 'minOrders',
            sortable:true
        },
        {
            text: 'AIRLINE',
            key: 'airline',
            sortable:true
        },
        {
            text: 'DISCOUNT',
            key: 'discount',
            sortable:true
        },
        {
            text: 'ACTIONS',
            key: 'actions',
            cell: record => {
                return(
                    <>
                        <MDBBtn
                            color="purple"
                            onClick={() => onStartEditMode(record)}
                        >
                            Edit
                        </MDBBtn>
                        <MDBBtn
                            color="danger"
                            onClick={() => onDeleteDiscount(record)}
                        >
                            Delete
                        </MDBBtn>
                    </>
                )
            }    
        }
    ];
    const config = {
        page_size: 10,
        length_menu: [10,20,50],
        
    }
    return (
        <>
            <ReactDatatable
                config={config}
                columns={columns}
                records={rows}
                extraButtons={extraButtons}
            />
            { !isEditMode ? (
                <div className="row justify-content-center">
                    <MDBBtn
                        onClick={() => {setIsCreateMode(true)}}
                    >
                        Create new Discount
                    </MDBBtn>
                </div>) 
            : null}
            
            {isEditMode ? (
                <div className="row justify-content-center p-3">
                    <hr/>
                    <div className="col-6">
                        <MDBInput
                            label="Airline" 
                            value={airline}
                            onChange={(e) => setAirline(e.target.value)}
                        />
                    </div>
                    <div className="col-6">
                        <MDBInput
                            label="Minimum wishlists" 
                            value={minWishlists}
                            onChange={(e) => setMinWishlists(e.target.value)}
                        />
                    </div>
                    <br/>
                    <div className="col-6">
                        <MDBInput
                            label="Minimum Orders" 
                            value={minOrders}
                            onChange={(e) => setMinOrders(e.target.value)}
                        />
                    </div>
                    <div className="col-6">
                        <MDBInput
                            label="%discount" 
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                        />
                    </div>
                    <br/>
                    <MDBBtn
                        color="deep-orange"
                        onClick={() => onCancelMode('edit')}
                    >
                        Cancel Edit
                    </MDBBtn>
                    <MDBBtn 
                        color="green"
                        onClick={onEditDiscount}
                    >
                        Edit discount
                    </MDBBtn>
                </div>
            ) : null}

            <MDBModal isOpen={isCreateMode} toggle={() => {setIsCreateMode(false)}}>
                <MDBModalHeader toggle={() => {setIsCreateMode(false)}}>MDBModal title</MDBModalHeader>
                <MDBModalBody>
                <MDBInput
                        label="Airline" 
                        value={airline}
                        onChange={(e) => setAirline(e.target.value)}
                    /><br/>
                    <MDBInput
                        label="Minimum wishlists" 
                        value={minWishlists}
                        onChange={(e) => setMinWishlists(e.target.value)}
                    /><br/>
                    <MDBInput
                        label="Minimum Orders" 
                        value={minOrders}
                        onChange={(e) => setMinOrders(e.target.value)}
                    /><br/>
                    <MDBInput
                        label="%discount" 
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                    />
                </MDBModalBody>
                <MDBModalFooter>
                <MDBBtn
                        color="deep-orange"
                        onClick={() => onCancelMode('create')}
                    >
                        Cancel
                    </MDBBtn>
                    <MDBBtn 
                        color="green"
                        onClick={onCreateDiscount}
                    >
                        Create
                    </MDBBtn>
                </MDBModalFooter>
            </MDBModal>

        </>
    )
}
export default Discounts;