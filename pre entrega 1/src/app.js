import express from 'express';
import http from 'http';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import path from 'path';
import mongoose from 'mongoose';
import { default as MessageModel } from './dao/models/message.js';
import viewsRouters from './dao/routes/views.routes.js';


const PORT = 8080;

// Establecer la conexión a la base de datos
const MONGODB_URI = 'mongodb+srv://laureanotrilo:Laureano3773@coder1.bk02hvj.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const dbConnection = mongoose.connection;

// Manejar eventos de conexión y error en la base de datos
dbConnection.on('error', console.error.bind(console, 'Error de conexión a la base de datos:'));
dbConnection.once('open', () => {
    console.log('Conexión exitosa a la base de datos');
});

// Configurar la aplicación Express
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const hbs = handlebars.create();
app.engine('handlebars', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Rutas de la aplicación
app.use('/', viewsRouters);

// Manejar eventos de conexión y desconexión en Socket.io
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    socket.on('message', (data) => {
        console.log(`Nuevo mensaje: ${data.user}: ${data.message}`);
        messages.push(data);
        io.emit('messageLogs', messages);

        // Guardar el mensaje en la base de datos
        try {
            MessageModel.create({ user: data.user, message: data.message });
        } catch (error) {
            console.error('Error al guardar el mensaje en la base de datos:', error);
        }
    });

    socket.on('newUser', (user) => {
        io.emit('newConnection', 'Un nuevo usuario se conectó');
        socket.broadcast.emit('notification', user);
    });
});

app.get('/chat', async (req, res) => {
    try {
        const messagesFromDB = await MessageModel.find();
        res.render('chat', { messages: messagesFromDB });
    } catch (error) {
        console.error('Error al obtener mensajes:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/', (req, res) => {
    res.send('¡Hola, esta es la página principal!');
});

// Iniciar el servidor en el puerto especificado
httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
