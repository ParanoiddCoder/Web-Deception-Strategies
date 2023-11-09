import { useGetOrdersQuery } from "../../slices/ordersApiSlice"
import Loader from "../../components/Loader";
import Message from '../../components/Message';
import { FaTimes } from 'react-icons/fa';
import {  Button , Table } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap";


const OrderListScreen = () => {
    const { data: orders, isLoading, error } = useGetOrdersQuery();
    
    return (
        <div>
           { isLoading ? <Loader /> : error ? (<Message variant = 'danger'> {error?.data?.message || error.error}</Message>) : ( 
                 <Table striped hover responsive className = 'table-sm'>
                 <thead>
                     <tr>
                     <th>ID</th>
                     <th>USER</th>
                     <th>DATE</th>
                     <th>TOTAL</th>
                     <th>PAID</th>
                     <th>DELIVERED</th>
                     <th></th>
                     </tr> 
                 </thead>
                 <tbody>
                 {orders.map((order) =>
    (
        <tr key = {order._id}>
            <td> {order._id} </td>
            <td> {order.user && order.user.name} </td>
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
                <LinkContainer to={`/order/${order._id}`}>
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
        </div>
    )
}

export default OrderListScreen
