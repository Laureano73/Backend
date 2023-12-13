const fs = require('fs/promises');

class CartManager {
    constructor(filePath) {
        this.path = filePath;
        this.initializeFile();
    }

    async initializeFile() {
        try {
            await fs.access(this.path);
        } catch (error) {
            await this.saveCarts([]); // Crea el archivo si no existe
        }
    }

    async createCart(cart) {
        try {
            const currentCarts = await this.readCarts();
            const newCart = {
                id: this.generateId(currentCarts),
                products: [],
                ...cart,
            };
            currentCarts.push(newCart);
            await this.saveCarts(currentCarts);
            console.log(`Carrito creado con ID ${newCart.id}`);
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            throw error;
        }
    }

    async getCartProducts(cartId) {
        try {
            const carts = await this.readCarts();
            const cart = carts.find((c) => c.id === cartId);

            if (cart) {
                return cart.products;
            } else {
                console.error('Carrito no encontrado.');
                return null;
            }
        } catch (error) {
            console.error('Error al obtener los productos del carrito:', error);
            return null;
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const carts = await this.readCarts();
            const cartIndex = carts.findIndex((c) => c.id === cartId);

            if (cartIndex !== -1) {
                const productIndex = carts[cartIndex].products.findIndex((p) => p.id === productId);

                if (productIndex !== -1) {
                    carts[cartIndex].products[productIndex].quantity += quantity;
                } else {
                    carts[cartIndex].products.push({ id: productId, quantity });
                }

                await this.saveCarts(carts);
                console.log(`Producto agregado al carrito con ID ${cartId}`);
            } else {
                console.error('Carrito no encontrado.');
            }
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
            throw error;
        }
    }

    async readCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            const existingCarts = data ? JSON.parse(data) : [];
            return existingCarts;
        } catch (error) {
            console.error('Error al leer los carritos:', error);
            return [];
        }
    }

    async saveCarts(carts) {
        try {
            const jsonData = JSON.stringify(carts, null, 2);
            await fs.writeFile(this.path, jsonData, 'utf-8');
        } catch (error) {
            console.error('Error al guardar los carritos:', error);
            throw error;
        }
    }

    generateId(carts) {
        const maxId = carts.reduce((max, c) => (c.id > max ? c.id : max), 0);
        return maxId + 1;
    }
}

module.exports = CartManager;
