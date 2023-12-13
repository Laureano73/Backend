const express = require('express');
const router = express.Router();
const CartManager = require('../CartManager');

const cartManager = new CartManager('data/carrito.json');

router.post('/', async (req, res) => {
    try {
        const newCart = req.body;
        await cartManager.createCart(newCart);
        res.status(201).send('Carrito creado correctamente');
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartProducts = await cartManager.getCartProducts(cartId);

        if (Array.isArray(cartProducts) && cartProducts.length > 0) {
            res.json(cartProducts);
        } else {
            res.status(404).send('Carrito no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener los productos del carrito:', error);
        res.status(500).send('Error interno del servidor');
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;
        await cartManager.addProductToCart(cartId, productId, quantity);
        res.status(201).send('Producto agregado al carrito correctamente');
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;
