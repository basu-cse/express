const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

// Data storage (in-memory for simplicity)
const users = [];
const products = [];
const orders = [];

// MIDDLEWARES
// CLIENT SIDE -> MIDDLEWARE1 (logging) -> MIDDLEWARE2 (auth guard) -> SERVER SIDE (req)
// CLIENT SIDE <- MIDDLEWARE (logging) <- SERVER SIDE(res)

// Middleware to log request details
function logRequest(req, res, next) {
    console.log(`[${new Date().toISOString()}] - ${req.method} - ${req.url}`);
    next();
}

// Middleware to validate required fields in the request body for user
function validateUserRequiredFields(req, res, next) {
    const requiredFields = ['name', 'email', 'password'];
    const missingFields = requiredFields.filter(field => !(field in req.body));

    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    next();
}

// Middleware to validate required fields in the request body for product
function validateProductRequiredFields(req, res, next) {
    const requiredFields = ['title', 'description', 'price'];
    const missingFields = requiredFields.filter(field => !(field in req.body));


    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    next();
}

// Middleware to validate required fields in the request body for order
function validateOrderRequiredFields(req, res, next) {
    const requiredFields = ['userId', 'productId', 'quantity'];
    const missingFields = requiredFields.filter(field => !(field in req.body));

    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    next();
}

// Middleware to handle errors
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
}

// Mounting the error handling middleware
app.use(errorHandler);

// USER ENDPOINTS

// Create a new user
app.post('/api/users', logRequest, validateUserRequiredFields, (req, res) => {
    // const { name, email, password } = req.body;
    const user = {
        id: uuidv4(),
        ...req.body,
        // name,
        // email,
        // password
    };

    users.push(user);
    res.status(201).json(user);
});

// Retrieve all users
app.get('/api/users', logRequest, (req, res) => {
    res.json(users);
});

// Retrieve a specific user
app.get('/api/users/:id', logRequest, (req, res) => {
    const user = users.find(user => user.id == req.params.id);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
});

// Update a specific user
app.put('/api/users/:id', logRequest, validateUserRequiredFields, (req, res) => {
    const userIndex = users.findIndex(user => user.id == req.params.id);

    if (userIndex < 0) {
        return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = {
        ...users[userIndex],
        ...req.body
    };

    users[userIndex] = updatedUser;
    res.json(updatedUser);
});

// Delete a specific user
app.delete('/api/users/:id', logRequest, (req, res) => {
    const userIndex = users.findIndex(user => user.id == req.params.id);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    const deletedUser = users.splice(userIndex, 1)[0];
    res.status(200).json(deletedUser);
});

// PRODUCT ENDPOINTS

// Retrieve all products
app.get('/api/products', logRequest, (req, res) => {
    res.json(products);
});

// Create a new product
app.post('/api/products', logRequest, validateProductRequiredFields, (req, res) => {
    // const { title, description, price } = req.body;
    const product = {
        id: uuidv4(),
        ...req.body,
    };

    products.push(product);
    res.status(201).json(product);
});


// Retrieve a specific product
app.get('/api/products/:id', logRequest, (req, res) => {
    const product = products.find(product => product.id == req.params.id);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
});

// Update a specific product
app.put('/api/products/:id', logRequest, validateProductRequiredFields, (req, res) => {
    const productIndex = products.findIndex(product => product.id == req.params.id);

    if (productIndex < 0) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const updatedProduct = {
        ...products[productIndex],
        ...req.body
    };

    products[productIndex] = updatedProduct;
    res.json(updatedProduct);
});

// Delete a specific product
app.delete('/api/products/:id', logRequest, (req, res) => {
    const productIndex = products.findIndex(product => product.id == req.params.id);

    if (productIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    const deletedProduct = products.splice(productIndex, 1)[0];
    res.status(200).json(deletedProduct);
});


// ORDERS ENDPOINTS

// Retrieve all orders
app.get('/api/orders', logRequest, (req, res) => {
    res.json(orders);
});

// Create a new order
app.post('/api/orders', logRequest, validateOrderRequiredFields, (req, res) => {
    // const { title, description, price } = req.body;
    const order = {
        id: uuidv4(),
        ...req.body,
    };

    orders.push(order);
    res.status(201).json(order);
});


// Retrieve a specific order
app.get('/api/orders/:id', logRequest, (req, res) => {
    const order = orders.find(order => order.id == req.params.id);

    if (!order) {
        return res.status(404).json({ error: 'order not found' });
    }

    res.json(order);
});

// Update a specific order
app.put('/api/orders/:id', logRequest, validateOrderRequiredFields, (req, res) => {
    const orderIndex = orders.findIndex(order => order.id == req.params.id);

    if (orderIndex < 0) {
        return res.status(404).json({ error: 'order not found' });
    }

    const updatedOrder = {
        ...orders[orderIndex],
        ...req.body
    };

    orders[orderIndex] = updatedOrder;
    res.json(updatedOrder);
});

// Delete a specific order
app.delete('/api/orders/:id', logRequest, (req, res) => {
    const orderIndex = orders.findIndex(order => order.id == req.params.id);

    if (orderIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    const deletedOrder = orders.splice(orderIndex, 1)[0];
    res.status(200).json(deletedOrder);
});


// Start the server
app.listen(3300, () => {
    console.log('Server listening on port 3300');

    // Create a default user
    users.push({
        id: uuidv4(),
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '123456'
    });

    // Create a default product
    products.push({
        id: uuidv4(),
        title: 'Product 1',
        description: 'Product 1 description',
        price: 100
    });

    // Create default orders
    orders.push({
        id: uuidv4(),
        userId: users[0].id,
        productId: products[0].id,
        quantity: 1
    });
    orders.push({
        id: uuidv4(),
        userId: users[0].id,
        productId: products[0].id,
        quantity: 2
    });
});