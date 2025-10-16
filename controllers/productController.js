const products = require('../data/product');

const getAllProducts = (req, res) => {
  let filteredProducts = [...products];
  
  if (req.query.id) {
    const id = parseInt(req.query.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    filteredProducts = filteredProducts.filter(product => product.id === id);
  }
  
  if (req.query.category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category.toLowerCase().includes(req.query.category.toLowerCase())
    );
  }
  
  if (req.query.price) {
    const price = parseFloat(req.query.price);
    if (!isNaN(price)) {
      filteredProducts = filteredProducts.filter(product => product.price <= price);
    }
  }
  
  if (req.query.sortBy) {
    const validFields = ['name', 'category', 'price', 'id'];
    if (!validFields.includes(req.query.sortBy)) {
      return res.status(400).json({ error: 'Invalid sort field' });
    }
    
    const sortOrder = req.query.sortOrder || 'asc';
    if (!['asc', 'desc'].includes(sortOrder)) {
      return res.status(400).json({ error: 'Invalid sort order' });
    }
    
    filteredProducts.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[req.query.sortBy] > b[req.query.sortBy] ? 1 : -1;
      } else {
        return a[req.query.sortBy] < b[req.query.sortBy] ? 1 : -1;
      }
    });
  }
  
  res.json(filteredProducts);
};

const getProductById = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }
  
  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json(product);
};

const createProduct = (req, res) => {
  const { name, category, price } = req.body;
  
  if (!name || !category || price === undefined) {
    return res.status(400).json({ error: 'Name, category, and price are required' });
  }
  
  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }
  
  const newProduct = {
    id: Math.max(...products.map(p => p.id)) + 1,
    name,
    category,
    price,
    inStock: req.body.inStock || true
  };
  
  products.push(newProduct);
  res.status(201).json(newProduct);
};

const updateProduct = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }
  
  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const { name, category, price } = req.body;
  if (!name || !category || price === undefined) {
    return res.status(400).json({ error: 'Name, category, and price are required' });
  }
  
  products[productIndex] = { ...products[productIndex], ...req.body };
  res.json(products[productIndex]);
};

const patchProduct = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }
  
  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  Object.assign(product, req.body);
  res.json(product);
};

const deleteProduct = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }
  
  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const deleted = products.splice(productIndex, 1)[0];
  res.json({ message: 'Product deleted', product: deleted });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct
};