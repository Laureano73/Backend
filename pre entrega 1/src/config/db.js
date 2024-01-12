const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://laureanotrilo:Laureano3773@coder1.bk02hvj.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a la base de datos:'));
db.once('open', () => {
    console.log('Conexión exitosa a la base de datos');
});

module.exports = db;
