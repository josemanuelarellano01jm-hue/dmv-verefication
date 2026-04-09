const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Servir la carpeta de fotos
app.use('/fotos', express.static(path.join(__dirname, 'fotos')));

// Ruta principal para cargar el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Base de datos en memoria
const db = new sqlite3.Database(':memory:'); 

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS clientes (
        id_cliente TEXT PRIMARY KEY, 
        nombre TEXT, 
        direccion TEXT, 
        estado TEXT, 
        tipo_licencia TEXT, 
        correo TEXT, 
        foto_url TEXT
    )`);
    
    const stmt = db.prepare("INSERT OR IGNORE INTO clientes VALUES (?, ?, ?, ?, ?, ?, ?)");

    // CLIENTE 1: JOSE ARELLANO
    stmt.run(
        '30616577', 
        'JOSE ARELLANO', 
        '2621 E Sahara Ave', 
        'NEVADA', 
        'CLASS C - OPERATOR', 
        'jose.dmv@example.com', 
        '/fotos/jose.jpg'
    );
    
    // CLIENTE 2: MARIA HERNANDEZ DEL ROSARIO (NUEVA)
    stmt.run(
        'Y12345678', 
        'MARIA HERNANDEZ DEL ROSARIO', 
        '2312 A Texas Av 32', 
        'TEXAS', 
        'CLASS C', 
        'MARIAN.HERNANDEZ@GMAIL.COM', 
        '/fotos/MARIA.jpg'
    );

    stmt.finalize();
});

app.post('/api/verificar', (req, res) => {
    const { nombre, id_cliente } = req.body;
    const query = "SELECT * FROM clientes WHERE LOWER(nombre) = LOWER(?) AND id_cliente = ?";
    
    db.get(query, [nombre, id_cliente], (err, fila) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false });
        }
        if (fila) {
            res.json({ success: true, datos: fila });
        } else {
            res.json({ success: false });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("========================================");
    console.log("    DMV CAR LOW GROUP - SERVER READY     ");
    console.log(`    Accede en el puerto: ${PORT}         `);
    console.log("========================================");
});
