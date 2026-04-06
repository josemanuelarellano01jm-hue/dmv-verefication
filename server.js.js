const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

// --- CONFIGURACIÓN ---
app.use(cors());
app.use(express.json());

// Servir la carpeta de fotos para que se vean en el navegador
app.use('/fotos', express.static(path.join(__dirname, 'fotos')));

// Ruta principal: Carga tu nueva página de inicio (Home)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- BASE DE DATOS ---
// Usamos :memory: para que sea rápido y compatible con el plan gratis de Render
const db = new sqlite3.Database(':memory:'); 

db.serialize(() => {
    // Crear la tabla de clientes
    db.run("CREATE TABLE clientes (id_cliente TEXT, nombre TEXT, estatus TEXT, foto_url TEXT)");
    
    // ============================================================
    // SECCIÓN DE REGISTRO DE CLIENTES
    // Para agregar más clientes, solo copia y pega la línea de abajo
    // y cambia los datos.
    // ============================================================
    
    // Cliente 1 (Tus datos)
    db.run("INSERT INTO clientes VALUES ('30616577', 'JOSE ARELLANO', 'VERIFIED - ADMIN', '/fotos/jose.jpg')");

    // Cliente 2 (Ejemplo de cómo agregar otro)
    // db.run("INSERT INTO clientes VALUES ('12345678', 'JUAN PEREZ', 'VERIFIED', '/fotos/juan.jpg')");

    console.log("Base de datos de DMV CAR LOW GROUP cargada correctamente.");
});

// --- API DE VERIFICACIÓN ---
app.post('/api/verificar', (req, res) => {
    const { nombre, id_cliente } = req.body;
    
    // Buscamos ignorando mayúsculas/minúsculas para evitar errores del usuario
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

// --- INICIO DEL SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("========================================");
    console.log("   DMV CAR LOW GROUP - SERVER READY     ");
    console.log(`   Accede en el puerto: ${PORT}         `);
    console.log("========================================");
});
