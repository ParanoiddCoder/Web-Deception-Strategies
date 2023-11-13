import { useParams,Link } from "react-router-dom";
import Message from "../components/Message";
import { useSelector } from "react-redux";
import { useDeliverOrderMutation, useGetOrderDetailsQuery,useGetPayPalClientIdQuery,usePayOrderMutation } from "../slices/ordersApiSlice";
import { Row, Col, ListGroup, Image, Card, Button} from 'react-bootstrap';
import Loader from "../components/Loader";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from 'react-toastify';
import { useEffect } from "react";
import Meta from "../components/Meta";

const OrderScreen = () => {
    const {id: orderId} = useParams();

    const { data:order,refetch,isLoading,error } = useGetOrderDetailsQuery(orderId);

    const [payOrder , { isLoading: loadingPay }] = usePayOrderMutation();

    const [deliverOrder , {isLoading: loadingDeliver}] = useDeliverOrderMutation();

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

    const { data:paypal , isLoading: loadingPayPal, error: errorPayPal } = useGetPayPalClientIdQuery(); 

    const {userInfo} = useSelector((state) => state.auth);

    useEffect(() => {
        if (!errorPayPal && !loadingPayPal && paypal.clientId) {
          const loadPaypalScript = async () => {
            paypalDispatch({
              type: 'resetOptions',
              value: {
                'client-id': paypal.clientId,
                currency: 'USD',
              },
            });
            paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
          };
          if (order && !order.isPaid) {
            if (!window.paypal) {
              loadPaypalScript();
            }
          }
        }
      }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

      function onApprove(data,action){
        return action.order.capture().then(async function(details) {
            try {
                await payOrder({orderId,details}).unwrap();
                refetch();
                toast.success('order is paid');
            } catch (error) {
                toast.error(error?.data?.message || error.error);
            }
        });
      }
    // async  function onApproveTest(){
    //     try{
    //     await payOrder({orderId,details : { payer: {} }});
    //     refetch();
    //     toast.success('order is paid');
    //     }
    //     catch(error)
    //     {
    //         toast.error(error);
    //     }
    //   }
      function onError(){
        toast.error(error.message);
      }
      function createOrder(data,action){
          return action.order.create({
            purchase_units: [
                {
                  amount: { value: order.totalPrice },
                },
              ],
          })
          .then((orderId) => {
              return orderId;
          });
      }
      const deliverOrderHandler = async() => {
          try {
           const updated = await deliverOrder(orderId);
           console.log(updated);
            refetch();
            toast.success('order delivered');
          } catch (error) {
            toast.error('error');
          }
      }
    return (
        isLoading ?  (<Loader />) : error ? (<Message variant='danger'>{error?.data?.message || error.error}</Message>) : 
        (<>
        <Meta title = 'order summary' />
        <Row>
      <Col md={8}>

      <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid on {order.paidAt}</Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
    </ListGroup> 
    </Col>
    <Col md={4}>
      
    <Card>
        <ListGroup variant='flush'>
            <ListGroup.Item>
            <h2>Order Summary</h2>
            </ListGroup.Item>
            <ListGroup.Item>
            <Row>
                <Col>Items</Col>
                <Col>₹{order.itemsPrice}</Col>
            </Row>
            </ListGroup.Item>
            <ListGroup.Item>
            <Row>
                <Col>Shipping</Col>
                <Col>₹{order.shippingPrice}</Col>
            </Row>
            </ListGroup.Item>
            <ListGroup.Item>
            <Row>
                <Col>Tax</Col>
                <Col>₹{order.taxPrice}</Col>
            </Row>
            </ListGroup.Item>
            <ListGroup.Item>
            <Row>
                <Col>Total</Col>
                <Col>₹{order.totalPrice}</Col>
            </Row>
            </ListGroup.Item>
            {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      {/* THIS BUTTON IS FOR TESTING! REMOVE BEFORE PRODUCTION! */}
                      {/* { <Button
                        style={{ marginBottom: '10px' }}
                        onClick={onApproveTest}
                      >
                        Test Pay Order
                      </Button>} */}

                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}
            { loadingDeliver && <Loader />}

            { userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                     <Button
                        type = 'button'
                        className = 'btn btn-block'
                        onClick={deliverOrderHandler}
                      >
                        Mark As Delivered
                      </Button>
                </ListGroup.Item>
            )}
            </ListGroup>
    </Card>
    </Col>
    </Row>
        </>)
    );
};

export default OrderScreen;

