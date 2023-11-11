import { useGetProductsQuery,useCreateProductMutation,useDeleteProductMutation } from "../../slices/productsApiSlice"
import Loader from "../../components/Loader";
import Message from '../../components/Message';
import { FaEdit , FaTrash } from 'react-icons/fa';
import {  Button , Table , Row , Col } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";
import { useParams } from "react-router";
import Paginate from "../../components/Paginate";

const ProductListScreen = () => {

    const { pageNumber } = useParams();

    const {data , isLoading , error, refetch} = useGetProductsQuery({pageNumber});

    const [createProduct , {isLoading: loadingCreate}] = useCreateProductMutation();

    const [deleteProduct , {isLoading: loadingDelete}] = useDeleteProductMutation();

    const createProductHandler = async() => {
        if(window.confirm('are you sure you want to make a new product?'))
        {
            try{
                await createProduct();
                toast.success('product created');
                refetch();
            }catch(err){
                toast.error(err?.data?.message || err.error);
            }
        }
    }

    const deleteHandler = async(id) => {
      if(window.confirm('are you sure?'))
        {
          try {
            await deleteProduct(id);
            toast.success('product deleted');
            refetch();
          } catch (err) {
            toast.error(err?.data?.message || err?.error);
          }
        }
    }
    return (
        <>
        <Row className="align-items-center">
            <Col>
               <h1>Products</h1>
            </Col>
            <Col className = "text-end">
               <Button className = "my-3" onClick = {createProductHandler}>
                   <FaEdit /> create product
               </Button>
            </Col>
        </Row>
        {loadingDelete && <Loader />}
        {loadingCreate && <Loader />}
        {isLoading ? (<Loader />) : error ? (<Message variant = 'danger'> {error?.data?.message || error.error}</Message>):(
            <>
            <Table striped hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages = {data.pages} page = {data.page} isAdmin= {true} />
            </>
        )}
    </>
    )
}

export default ProductListScreen;
