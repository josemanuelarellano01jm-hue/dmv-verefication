const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Configuración de archivos estáticos
app.use(express.static('public'));
app.use(express.json());

// Conectar a la base de datos
const db = new sqlite3.Database('./database.db');

// Crear tabla si no existe
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS clientes (
        id TEXT PRIMARY KEY,
        nombre TEXT,
        direccion TEXT,
        estado TEXT,
        tipo_licencia TEXT,
        email TEXT,
        foto TEXT
    )`);

    // REGISTRO DE CLIENTES (Usamos INSERT OR IGNORE para que no de error si ya existen)
    const stmt = db.prepare("INSERT OR IGNORE INTO clientes VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    // Cliente 1: Edwin
    stmt.run('1091384595', 'EDWIN SMITH', '2621 E Sahara Ave', 'NEVADA', 'CLASS C - OPERATOR', 'SMITH.dmv@gmail.com', '/fotos/edwin.jpg');
    
    // Cliente 2: Maria
    stmt.run('Y12345678', 'MARIA HERNANDES DEL ROSARIO', '2621 E Sahara Ave', 'TEXAS', 'CLASS C - OPERATOR', 'MARIA.HERNANDEZ@gmail.com', '/fotos/MARIA.jpg');
    
    stmt.finalize();
});

// Ruta para buscar clientes
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
    console.log(`Servidor corriendo en puerto ${port}`);
});
