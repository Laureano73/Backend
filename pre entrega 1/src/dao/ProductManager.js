const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const MessageModel = require('./dao/models/message');

const MONGODB_URI = 'mongodb+srv://laureanotrilo:Laureano3773@coder1.bk02hvj.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const dbConnection = mongoose.connection;
dbConnection.on('error', console.error.bind(console, 'Error de conexión a la base de datos:'));
dbConnection.once('open', () => {
    console.log('Conexión exitosa a la base de datos');
});

const app = express();
const port = 3080;

app.use(express.json());

const hbs = exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));  // Agrega esta línea

const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    socket.on('sendMessage', async (data) => {
        console.log(`Nuevo mensaje: ${data.user}: ${data.message}`);
        try {
            await MessageModel.create({ user: data.user, message: data.message });
            io.emit('chatMessage', { user: data.user, message: data.message });
        } catch (error) {
            console.error('Error al guardar el mensaje en la base de datos:', error);
        }
    });
});

app.get('/chat', async (req, res) => {
    try {
        const messages = await MessageModel.find();
        res.render('chat', { messages });
    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/realtimeproducts', async (req, res) => {
    try {
        console.log('Request to /realtimeproducts received');
        const products = await ProductModel.find();
        console.log('Filtered Products:', products);

        res.json({ products });
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({ error: error.message });
    }
});


// Ruta para la página principal
app.get('/', (req, res) => {
    res.send('¡Hola, esta es la página principal!');
});

server.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});


module.exports = ProductManager;
