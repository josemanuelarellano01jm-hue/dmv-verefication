const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Ajuste para tu carpeta específica
const carpetaPublica = path.join(__dirname, 'sistema de verificacion');

app.use(express.static(carpetaPublica));
app.use(express.json());

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    // Creamos la tabla
    db.run(`CREATE TABLE IF NOT EXISTS clientes (
        id TEXT PRIMARY KEY,
        nombre TEXT,
        direccion TEXT,
        estado TEXT,
        tipo_licencia TEXT,
        email TEXT,
        foto TEXT
    )`);

    // RECUPERAMOS A TUS CLIENTES (Usando INSERT OR IGNORE para evitar errores de duplicado)
    const stmt = db.prepare("INSERT OR IGNORE INTO clientes VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    // Cliente 1: EDWIN SMITH
    stmt.run(
        '1091384595', 
        'EDWIN SMITH', 
        '2621 E Sahara Ave', 
        'NEVADA', 
        'CLASS C - OPERATOR', 
        'SMITH.dmv@gmail.com', 
        '/fotos/edwin.jpg'
    );
    
    // Cliente 2: MARIA HERNANDES DEL ROSARIO
    stmt.run(
        'Y12345678', 
        'MARIA HERNANDES DEL ROSARIO', 
        '2621 E Sahara Ave', 
        'TEXAS', 
        'CLASS C - OPERATOR', 
        'MARIA.HERNANDEZ@gmail.com', 
        '/fotos/MARIA.jpg'
    );
    
    stmt.finalize();
});

// Ruta principal para evitar el error "Cannot GET /"
app.get('/', (req, res) => {
    res.sendFile(path.join(carpetaPublica, 'index.html'));
});

// API de búsqueda
app.get('/api/verificar/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM clientes WHERE id = ?", [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ message: "No encontrado" });
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor activo en puerto ${port}`);
});
