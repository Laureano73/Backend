// app.js
const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const port = 3080;

const productManager = new ProductManager('productos.json');

app.use(express.json());

// Función para inicializar productos
async function initializeProducts() {
    try {
        // Agregar productos al iniciar la aplicación
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

// Rutas existentes
app.get('/products', async (req, res) => {
    // Lógica para obtener productos
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();

        if (limit) {
            const limitedProducts = products.slice(0, limit);
            res.json(limitedProducts);
        } else {
            res.json(products);
        }
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/products/:pid', async (req, res) => {
    // Lógica para obtener un producto por ID
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Inicia la aplicación y luego inicializa los productos
app.listen(port, async () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
    await initializeProducts();
});
