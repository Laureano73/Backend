class ProductManager {
    constructor() {
        this.products = [];
        this.productIdCounter = 1;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error('Todos los campos son obligatorios.');
            return;
        }

        if (this.products.some(product => product.code === code)) {
            console.error('Ya existe un producto con el mismo código.');
            return;
        }

        const newProduct = {
            id: this.productIdCounter++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };

        this.products.push(newProduct);
        console.log(`Producto "${title}" agregado.`);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.error('Producto no encontrado.');
            return null;
        }
    }
}

const productManager = new ProductManager();

productManager.addProduct('Producto A', 'Descripción A', 50, 'imagen_A.jpg', 'A1', 15);
productManager.addProduct('Producto B', 'Descripción B', 30, 'imagen_B.jpg', 'b2', 20);

const allProducts = productManager.getProducts();
console.log('Todos los productos:', allProducts);

const productById = productManager.getProductById(1);
console.log('Mostrar producto por ID:', productById);

const nonExistentProduct = productManager.getProductById(1);


