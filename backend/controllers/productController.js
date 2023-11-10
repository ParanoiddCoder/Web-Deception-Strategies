import asyncHandler from '../middleware/asyncHandler.js';
import Product from '../models/productModel.js';

// @desc    fetch all products
// @route GET /api/products
// @access public
const getProducts = asyncHandler(async(req,res) => {
    const products = await Product.find({});
    res.json(products);
});

// @desc    fetch a products
// @route GET /api/products/:id
// @access public
const getProductById = asyncHandler(async(req,res) => {
    const product = await Product.findById(req.params.id);

    if(product){
    return res.json(product);
    }
    else{
        res.status(404); 
        throw new Error('Resource not found');
    }
});

// @desc    create new products
// @route POST /api/products
// @access private/admin
const createProduct = asyncHandler(async(req,res) => {
  const product = new Product({
      name: 'sample name',
      price: 0,
      user: req.user._id,
      image: '/images/sample.jpg',
      brand: 'sample brand',
      category: 'sample category',
      countInStock: 0,
      numReviews: 0,
      description: 'sample description'
  })

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc   Update a product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async(req,res) => {
    const {name,price,description,image,brand,category,countInStock} = req.body;

    const product = await Product.findById(req.params.id)

    if(product)
    {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    }else{
        res.status(404);
        throw new Error('resource not found')
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async(req,res) => {
    const {name,price,description,image,brand,category,countInStock} = req.body;

    const product = await Product.findById(req.params.id)

    if(product)
    {
       await Product.deleteOne({ _id : product._id});
        res.status(200).json({message : 'product deleted'});
    }else{
        res.status(404);
        throw new Error('resource not found')
    }
});



export {getProducts,getProductById,createProduct,updateProduct,deleteProduct};