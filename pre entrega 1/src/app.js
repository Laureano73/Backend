const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const ProductManager = require('./ProductManager');
const CartManager = require('./CartManager');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();
const port = 3080;

const productManager = new ProductManager('data/productos.json');
const cartManager = new CartManager('data/carrito.json');

app.use(express.json());

// Función para inicializar productos
async function initializeProducts() {
    // ... lógica para inicializar productos ...
}

// Función para obtener y filtrar productos
async function getFilteredProducts() {
    try {
        const products = await productManager.getProducts();

        // Filtra los productos para asegurarte de que tengan las propiedades necesarias
        return products.filter(product => product.id && product.title && product.description && product.price);
    } catch (error) {
        console.error('Error al obtener la lista de productos:', error);
        throw new Error('Error al obtener la lista de productos');
    }
}

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Configuración de Handlebars
const hbs = exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Crear el servidor HTTP
const server = http.createServer(app);

// Configuración de Socket.io
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

app.get('/', async (req, res) => {
    console.log('Accediendo a la página principal');

    try {
        const products = await getFilteredProducts();
        console.log('Products:', products);

        res.render('layouts/main', { title: 'Página Principal', products });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await getFilteredProducts();
        console.log('Filtered Products:', products);

        res.render('realtimeproducts', { products });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);

        // Emite el evento de producto agregado a todos los clientes conectados
        io.emit('productAdded', { product: newProduct });

        res.json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        await productManager.deleteProduct(productId);

        // Emite el evento de producto eliminado a todos los clientes conectados
        io.emit('productDeleted', { productId });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

server.listen(port, async () => {
    try {
        console.log(`Servidor escuchando en http://localhost:${port}`);
        await initializeProducts();
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
});
