const express = require('express');
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
    try {
        // Agrega productos al iniciar la aplicación
        await productManager.addProduct({
            title: 'Producto 1',
            description: 'Descripción 1',
            price: 20,
            thumbnail: 'imagen 1',
            code: 'P1',
            stock: 5,
        });

        await productManager.addProduct({
            title: 'Producto 2',
            description: 'Descripción 2',
            price: 30,
            thumbnail: 'imagen 2',
            code: 'P2',
            stock: 8,
        });

        console.log('Productos inicializados.');
    } catch (error) {
        console.error('Error al inicializar productos:', error);
    }
}

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(port, async () => {
    try {
        console.log(`Servidor escuchando en http://localhost:${port}`);
        await initializeProducts();
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
});
