import { useSelector, useDispatch } from "react-redux"
import { Form , Row , Col, Button , Table } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap";
import { useState , useEffect } from 'react';
import { useProfileMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import Message from '../components/Message';
import { FaTimes } from 'react-icons/fa';


const ProfileScreen = () => {

    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');

    

    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const {data:orders , isLoading , error} = useGetMyOrdersQuery();

    const [update,{isloading : loadingUpdate}] = useProfileMutation();

    useEffect(() => {
        setName(userInfo.name);
        setEmail(userInfo.email);
    }, [userInfo.name,userInfo.email])

    const submitHandler = async(e) => {
        e.preventDefault();
        if(password !== confirmPassword)
        {
            toast.error('passwords dont match');
        }
        else
        {
            try{
            const newProfile = await update({id:userInfo._id,name,email,password}).unwrap();
            dispatch(setCredentials({...newProfile}));
            toast.success('profile updated successfully');
            }
            catch(err){
                toast.error(err?.data?.message || err.error);
            }
        }
    }

    return (
        <Row>
            <Col md={3}>
            <Form onSubmit = {submitHandler}>
                <h1>User Profile</h1>
                <Form.Group>
                    <Form.Label> name </Form.Label>
                    <Form.Control 
                    type = 'text'
                    placeholder = 'enter name'
                    value = {name}
                    onChange ={(e) => setName(e.target.value)} 
                    ></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label> email </Form.Label>
                    <Form.Control 
                    type = 'email'
                    placeholder = 'enter email'
                    value = {email}
                    onChange ={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label> password </Form.Label>
                    <Form.Control 
                    type = 'password'
                    placeholder = 'enter password'
                    value = {password}
                    onChange ={(e) => setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label> confirm password </Form.Label>
                    <Form.Control 
                    type = 'password'
                    placeholder = 'confirm password'
                    value = {confirmPassword}
                    onChange ={(e) => setConfirmPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type = 'submit' variant = 'primary' className='my-2'>
                    update
                </Button>
                {loadingUpdate && <Loader />}
            </Form>
            </Col>
            <Col md = {9}>
            { isLoading ? <Loader /> : error ? (<Message variant = 'danger'> {error?.data?.message || error.error}</Message>) : ( 
                 <Table striped hover responsive className = 'table-sm'>
                 <thead>
                     <tr>
                     <th>ID</th>
                     <th>Date</th>
                     <th>Total</th>
                     <th>Paid</th>
                     <th>Delivered</th>
                     </tr> 
                 </thead>
                 <tbody>
                 {orders.map((order) =>
    (
        <tr key = {order._id}>
            <td> {order._id} </td>
            <td> {order.createdAt.substring(0,10)} </td>
            <td> {order.totalPrice} </td>
            <td>
                {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                ) : (
                    <FaTimes style={{ color: 'red' }} />
                )}
            </td>
            <td>
                {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                ) : (
                    <FaTimes style={{ color: 'red' }} />
                )}
            </td>
            <td>
                <LinkContainer to={`order/${order._id}`}>
                    <Button className = 'btn-sm' variant = 'light'> 
                        Details
                    </Button>
                </LinkContainer>
            </td>
        </tr>
))}
                 </tbody>
                 </Table>
            )}
            </Col>
        </Row>
    )
}

export default ProfileScreen;

