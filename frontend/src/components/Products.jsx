import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from './Rating'

const Product = ({product}) => {
    const cardStyle = {
        // Set a fixed height for the card
        height: '100%', // Adjust this value as needed
      };
    
      const imageStyle = {
        // Set a fixed height for the image
        height: '200px', // Adjust this value as needed
        // Ensure the image covers the entire container while maintaining its aspect ratio
        objectFit: 'cover',
      };

    return (
        <Card style = {cardStyle} className='my-3 p-3 rounded'>
            <Link to = {`/product/${product._id}`}>
               <Card.Img style = {imageStyle} src={product.image} variant='top' />
            </Link>
            
            <Card.Body>
            <Link to = {`/product/${product._id}`}>
                <Card.Title as = 'div' className='product-title'>
                    <strong>
                        {product.name}
                    </strong>
                </Card.Title>
            </Link>

            <Card.Text as='div'>
                <Rating value={product.rating} text={`${product.numReviews} reviews`} />
            </Card.Text>

            <Card.Text as='h3'>₹{product.price}</Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Product
