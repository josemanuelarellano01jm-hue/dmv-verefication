const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use('/fotos', express.static(path.join(__dirname, 'fotos')));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Base de datos
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
    
    const stmt = db.prepare(`INSERT OR IGNORE INTO clientes VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    // CLIENTES (Normalizados con guiones bajos en fotos para evitar errores de URL)
    stmt.run('30616577', 'JOSE ARELLANO', '2621 E Sahara Ave', 'NEVADA', 'CLASS C', 'jose.dmv@example.com', '/fotos/jose.jpg', '1985-03-15', 'M', '5\'10"', '180 lb', 'BROWN', 'BLACK', '+1 702-555-0101');
    stmt.run('Y12345678', 'MARIA HERNANDEZ', '2312 A Texas Av 32', 'TEXAS', 'CLASS C', 'MARIAN.HERNANDEZ@GMAIL.COM', '/fotos/MARIA.png', '1990-07-22', 'F', '5\'5"', '140 lb', 'BROWN', 'BROWN', '+1 214-555-0199');
    stmt.run('C473652870230', 'LUZ CARTER', '3059 SE LIME TREE TER ATUART, FL 34997', 'FLORIDA', 'CLASS E', 'LUCY@GMAIL.COM', '/fotos/LUZ_CARTER.png', '1965-02-25', 'F', '5\'6"', '128 lb', 'GREY', 'BROWN', '786 906 4756');
    stmt.run('37850640', 'DARWIN G ALVAREZ MARTINEZ', '1012 RIO BRAVO DR FORNEY, TX 75126', 'TEXAS', 'CLASS C', 'D.ALVAREZ@GMAIL.COM', '/fotos/DARWIN_ALVAREZ.jpeg', '1980-04-11', 'M', '6\'2"', '', 'BROWN', 'BLACK', '469 866 73 63');
    stmt.run('MC254168', 'PORTUGUEZ JACOBO MISAEL', '3305 VANCE RD DAYTON, OH 45439', 'OHIO', 'CLASS D', 'NONE', '/fotos/JACOBO_MISAEL.png', '06/28/1981', 'M', '6\'0"', '', 'BROWN', 'NONE', '859 509 6002');
    stmt.run('SA4051752', 'ALVARADO BARAHONA WALTER RAMIRO', '12 GEORGE, APT 2 LYNN, MA 01905-2986', 'MASSACHUSETTS', 'CLASS D', 'WALTERBARAHONA447@GMAIL.COM', '/fotos/fotos/WALTER RAMIRO.png', '04/05/1975', 'M', '5\'03"', '', 'BROWN', 'BLACK', '859 509 6002');

    stmt.finalize();
});

// APIs
app.post('/api/verificar', (req, res) => {
    const { nombre, id_cliente } = req.body;
    const query = "SELECT * FROM clientes WHERE LOWER(nombre) = LOWER(?) AND id_cliente = ?";
    db.get(query, [nombre, id_cliente], (err, fila) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: !!fila, datos: fila || null });
    });
});

app.get('/api/clientes', (req, res) => {
    db.all("SELECT * FROM clientes", [], (err, filas) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(filas);
    });
});

// Esto toma el puerto que Railway te da, y si no hay uno, usa el 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`========================================`);
    console.log(`  Servidor corriendo en el puerto ${PORT}`);
    console.log(`========================================`);
});
