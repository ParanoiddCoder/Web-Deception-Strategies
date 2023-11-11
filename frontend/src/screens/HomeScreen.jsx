import { Row,Col } from "react-bootstrap"
import Product from "../components/Products";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useParams } from "react-router";
import Paginate from "../components/Paginate";

const HomeScreen = () => {
    const {pageNumber,keyword} = useParams()

    const { data , isLoading , error } = useGetProductsQuery({keyword,pageNumber});


    return (
        <>
            {isLoading ? (<Loader />) : error ? (<Message variant = 'danger'>{error?.data?.message || error.error }</Message>) : (<><h1>Latest Products</h1>
            <Row>
                {data.products.map((product)=> (
                    <Col key={product._id} sm={12} md={12} lg={4} xl={3}>
                        <Product product={product} />
                    </Col>
                ))}
            </Row>
            <Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ''}/>
            </>) }
        </>
    );
};

export default HomeScreen;
