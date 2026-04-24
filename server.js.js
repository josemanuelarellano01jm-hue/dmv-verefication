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
        '1985-03-15',
        'M',
        '5\'10" (178 cm)',
        '180 lb',
        'BROWN',
        'BLACK',
        '+1 702-555-0101'
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

    // CLIENTE 3: LUZ CARTER (Aquí estaba el error de la coma)
    stmt.run(
        'C473652870230', 
        'LUZ CARTER', 
        '3059 SE LIME TREE TER ATUART, FL 34997', 
        'FLORIDA',
        'CLASS E', 
        'LUCYROACHAP1975@GMAIL.COM', 
        '/fotos/LUZ CARTER.png',
        '02/25/1965',
        'F',
        '5\'6" ',
        '128 lb',
        'GREY',
        'BROWN',
        '786 906 4756'
    );

    // CLIENTE 4: DARWIN ALVAREZ
    stmt.run(
        '37850640', 
        'DARWIN G ALVAREZ MARTINEZ', 
        '1012 RIO BRAVO DR FORNEY, TX 75126', 
        'TEXAS', 
        'CLASS C', 
        'D.ALVAREZ77779@GMAIL.COM', 
        '/fotos/DARWIN ALVAREZ.jpeg',
        '04/11/1980',
        'M',
        '6\'2"',
        '',
        'BROWN',
        'NONE',
        '469 866 73 63'
    );


 // CLIENTE 5: LUZ CARTER
 'C473652870230', 
        'LUZ CARTER', 
        '3059 SE LIME TREE TER ATUART, FL 34997', 
        'FLORIDA',
        'CLASS E', 
        'LUCYROACHAP1975@GMAIL.COM', 
        '/fotos/LUZ CARTER.png',
        '02/25/1965',
        'F',
        '5\'6" ',
        '128 lb',
        'GREY',
        'BROWN',
        '786 906 4756'
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
