const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir carpetas (Importante para Hostinger)
app.use('/fotos', express.static(path.join(__dirname, 'fotos')));

// Ruta principal: Carga tu página del DMV
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Base de datos persistente en archivo (No se borra al reiniciar)
const db = new sqlite3.Database(path.join(__dirname, 'database.db'));

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS clientes (id_cliente TEXT, nombre TEXT, estatus TEXT, foto_url TEXT)");

    // Insertar tus datos si no existen
    const checkUser = "SELECT * FROM clientes WHERE id_cliente = ?";
    db.get(checkUser, ['30616577'], (err, row) => {
        if (!row) {
            db.run("INSERT INTO clientes VALUES ('30616577', 'JOSE ARELLANO', 'VERIFIED - ADMIN', '/fotos/jose.jpg')");
        }
    });
});

// API de búsqueda
app.post('/api/verificar', (req, res) => {
    const { nombre, id_cliente } = req.body;
    const query = "SELECT * FROM clientes WHERE LOWER(nombre) = LOWER(?) AND id_cliente = ?";
    
    db.get(query, [nombre, id_cliente], (err, fila) => {
        if (err) return res.status(500).json({ success: false });
        if (fila) {
            res.json({ success: true, datos: fila });
        } else {
            res.json({ success: false });
        }
    });
});

// Puerto dinámico para Hostinger
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { 
    console.log("========================================");
    console.log("   DMV CAR LOW GROUP - SERVER READY     ");
    console.log(`   Running on port: ${PORT}             `);
    console.log("========================================");
});