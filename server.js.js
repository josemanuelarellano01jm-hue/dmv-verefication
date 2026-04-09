const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/fotos', express.static(path.join(__dirname, 'fotos')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Base de datos en memoria para Render
const db = new sqlite3.Database(':memory:'); 

db.serialize(() => {
    // Tabla actualizada con Dirección, Estado, Tipo de Licencia y Correo
    db.run(`CREATE TABLE clientes (
        id_cliente TEXT, 
        nombre TEXT, 
        direccion TEXT, 
        estado TEXT, 
        tipo_licencia TEXT, 
        correo TEXT, 
        foto_url TEXT
    )`);
    
    // REGISTRO DE CLIENTE (EJEMPLO CON TUS DATOS)
    // Puedes copiar esta línea para agregar más clientes
    db.run(`INSERT INTO clientes VALUES (
        '1091384595', 
        'EDWIN SMITH', 
        '2621 E Sahara Ave', 
        'NEVADA', 
        'CLASS C - OPERATOR', 
        'SMITH.dmv@gmail.com', 
        '/fotos/edwin.jpg'


    db.run(`INSERT INTO clientes VALUES (
        'Y12345678', 
        'MARIA HERNANDES DEL ROSARIO ', 
        '2621 E Sahara Ave', 
        'TEXAS', 
        'CLASS C - OPERATOR', 
        'MARIA.HERNANDEZ@gmail.com', 
        '/fotos/MARIA.jpg'
        
    )`);
});

app.post('/api/verificar', (req, res) => {
    const { nombre, id_cliente } = req.body;
    const query = "SELECT * FROM clientes WHERE LOWER(nombre) = LOWER(?) AND id_cliente = ?";
    
    db.get(query, [nombre, id_cliente], (err, fila) => {
        if (fila) {
            res.json({ success: true, datos: fila });
        } else {
            res.json({ success: false });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("DMV CAR LOW GROUP - SERVER UPDATED");
});
