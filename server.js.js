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

const db = new sqlite3.Database(':memory:'); 

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS clientes (
        id_cliente TEXT PRIMARY KEY, 
        nombre TEXT, 
        direccion TEXT, 
        estado TEXT, 
        tipo_licencia TEXT, 
        correo TEXT, 
        foto_url TEXT,
        fecha_nacimiento TEXT,
        sexo TEXT,
        estatura TEXT,
        peso TEXT,
        color_ojos TEXT,
        color_cabello TEXT,
        telefono TEXT
    )`);
    
    const stmt = db.prepare(`INSERT OR IGNORE INTO clientes VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    // CLIENTE 1: JOSE ARELLANO
    stmt.run(
        '30616577', 
        'JOSE ARELLANO', 
        '2621 E Sahara Ave', 
        'NEVADA', 
        'CLASS C - OPERATOR', 
        'jose.dmv@example.com', 
        '/fotos/jose.jpg',
        '1985-03-15',      // fecha_nacimiento
        'M',               // sexo
        '5\'10" (178 cm)', // estatura
        '180 lb',          // peso
        'BROWN',           // color_ojos
        'BLACK',           // color_cabello
        '+1 702-555-0101'  // telefono
    );
    
    // CLIENTE 2: MARIA HERNANDEZ
    stmt.run(
        'Y12345678', 
        'MARIA HERNANDEZ', 
        '2312 A Texas Av 32', 
        'TEXAS', 
        'CLASS C', 
        'MARIAN.HERNANDEZ@GMAIL.COM', 
        '/fotos/MARIA.png',
        '1990-07-22',
        'F',
        '5\'5" (165 cm)',
        '140 lb',
        'BROWN',
        'BROWN',
        '+1 214-555-0199'
    );

    // CLIENTE 3: MARCO CHAVEZ
    stmt.run(
        'G44244365', 
        'Chavez Ortiz Marco Antonio', 
        '3612 Royal Crest Dr Fort Worth, Tx 76140', 
        'TEXAS', 
        'CLASS C', 
        'Marcochavez0973@gmail.com', 
        '/fotos/Chavez Ortiz.png',
        '1988-11-03',
        'M',
        '5\'9" (175 cm)',
        '175 lb',
        'BROWN',
        'BLACK',
        '+1 817-555-0142'
    );

    // CLIENTE 4: LUIS RAMIREZ
    stmt.run(
        'L98765432', 
        'LUIS RAMIREZ GOMEZ', 
        '1450 Main St, Houston, TX 77002', 
        'TEXAS', 
        'CLASS C', 
        'luis.ramirez@gmail.com', 
        '/fotos/luis.png',
        '1992-05-18',
        'M',
        '5\'11" (180 cm)',
        '190 lb',
        'HAZEL',
        'BROWN',
        '+1 713-555-0177'
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

// Listar todos los clientes
app.get('/api/clientes', (req, res) => {
    db.all("SELECT * FROM clientes", [], (err, filas) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(filas);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("========================================");
    console.log("    DMV CAR LOW GROUP - SERVER READY     ");
    console.log(`    Accede en el puerto: ${PORT}         `);
    console.log("========================================");
});
