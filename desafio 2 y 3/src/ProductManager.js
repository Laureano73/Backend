// ProductManager.js
const fs = require('fs/promises');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.initializeFile(); // Método para inicializar el archivo si no existe
    }

    async initializeFile() {
        try {
            await fs.access(this.path); // Verifica si el archivo existe
        } catch (error) {
            // Si no existe, crea el archivo con un arreglo vacío
            await this.saveProducts([]); // Corrección aquí
        }
    }

    async addProduct(product) {
        try {
            const currentProducts = await this.readFile(); // Lee los productos actuales

            const newProduct = {
                id: this.generateId(currentProducts), // Genera un ID autoincremental
                status: true, // Agregado
                ...product,
            };

            currentProducts.push(newProduct); // Agrega el nuevo producto al arreglo

            await this.saveProducts(currentProducts); // Guarda el arreglo actualizado en el archivo

            console.log(`Producto "${newProduct.title}" agregado.`);
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            throw error; // Lanza la excepción para manejar errores en el código que llama a este método
        }
    }

    async getProducts() {
        try {
            return await this.readFile(); // Lee el archivo y devuelve los productos
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const products = await this.readFile(); // Lee el archivo y busca el producto por ID
            console.log('All products:', products); // Agregado para imprimir todos los productos
            console.log('Searching for product with ID:', id); // Agregado para imprimir el ID que estás buscando

            const product = products.find((p) => p.id === id);

            if (product) {
                return product;
            } else {
                console.error('Producto no encontrado.');
                return null;
            }
        } catch (error) {
            console.error('Error al obtener el producto por ID:', error);
            return null;
        }
    }


    async updateProduct(id, updatedProduct) {
        try {
            const currentProducts = await this.readFile(); // Lee el archivo actual

            const index = currentProducts.findIndex((p) => p.id === id); // Busca el índice del producto a actualizar

            if (index !== -1) {
                currentProducts[index] = { id, ...updatedProduct, status: true }; // Actualiza el producto en el arreglo
                await this.saveProducts(currentProducts); // Guarda el arreglo actualizado en el archivo

                console.log(`Producto con ID ${id} actualizado.`);
            } else {
                console.error('Producto no encontrado.');
            }
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const currentProducts = await this.readFile(); // Lee el archivo actual

            const updatedProducts = currentProducts.filter((p) => p.id !== id); // Filtra los productos, excluyendo el que tiene el ID especificado

            await this.saveProducts(updatedProducts); // Guarda el arreglo actualizado en el archivo

            console.log(`Producto con ID ${id} eliminado.`);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw error;
        }
    }

    async readFile() {
        try {
            const data = await fs.readFile(this.path, 'utf-8'); // Lee el archivo y parsea el contenido a formato JSON
            const existingProducts = data ? JSON.parse(data) : [];

            return existingProducts;
        } catch (error) {
            console.error('Error al leer los productos:', error);
            return [];
        }
    }

    async saveProducts(products) {
        try {
            const jsonData = JSON.stringify(products, null, 2); // Convierte el arreglo de productos a formato JSON
            await fs.writeFile(this.path, jsonData, 'utf-8'); // Guarda el JSON en el archivo
        } catch (error) {
            console.error('Error al guardar los productos:', error);
            throw error;
        }
    }

    generateId(products) {
        const maxId = products.reduce((max, p) => (p.id > max ? p.id : max), 0); // Genera un ID autoincrementable basado en el máximo ID existente
        return maxId + 1;
    }
}

module.exports = ProductManager;
