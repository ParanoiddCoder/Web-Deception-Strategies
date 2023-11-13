import FormContainer from "../components/FormContainer"
import { useState } from "react";
import {Form , Button, FormLabel} from 'react-bootstrap'
import { useDispatch , useSelector } from "react-redux";
import { saveShippingAddress } from "../slices/cartSlice.js";
import { useNavigate } from "react-router";
import CheckoutSteps from "../components/CheckoutSteps";
import { toast } from "react-toastify";
import Meta from "../components/Meta";

const ShippingScreen = () => {
    const cart = useSelector((state) => state.cart);

    const {shippingAddress} = cart;

    const [address,setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode,setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        if(!address){
            toast.error('address is required')
        }
        else if(!city){
            toast.error('city is required')
        }
        else if(!postalCode){
            toast.error('postal code is required')
        }
        else if(!country){
            toast.error('country is required')
        }
        else{
            dispatch(saveShippingAddress({address , city , postalCode , country}));
            navigate('/payment');
        }
    }

    return (<>
    <Meta title = 'shipping details' />
    <CheckoutSteps step1 step2 />
    <FormContainer>
        <h1>shipping</h1>

        <Form onSubmit = {submitHandler}>
            <Form.Group controlId = 'address' className = 'my-2'>
            <FormLabel>Address</FormLabel>
            <Form.Control 
            type = 'text'
            value = {address} 
            placeholder = 'enter address'
            onChange = {(e) => setAddress(e.target.value)}>
            </Form.Control>
            </Form.Group>
            <Form.Group controlId = 'city' className = 'my-2'>
            <FormLabel>city</FormLabel>
            <Form.Control 
            type = 'text'
            value = {city} 
            placeholder = 'enter city'
            onChange = {(e) => setCity(e.target.value)}>
            </Form.Control>
            </Form.Group>
            <Form.Group controlId = 'postal code' className = 'my-2'>
            <FormLabel>postal code</FormLabel>
            <Form.Control 
            type = 'text'
            value = {postalCode} 
            placeholder = 'enter postal code'
            onChange = {(e) => setPostalCode(e.target.value)}>
            </Form.Control>
            </Form.Group>
            <Form.Group controlId = 'country' className = 'my-2'>
            <FormLabel>country</FormLabel>
            <Form.Control 
            type = 'text'
            value = {country} 
            placeholder = 'enter country'
            onChange = {(e) => setCountry(e.target.value)}>
            </Form.Control>
            </Form.Group>

            <Button type = 'submit' variant = 'primary' className = 'my-2'>
                continue
            </Button>
        </Form>
    </FormContainer>
    </>)
}

export default ShippingScreen; 