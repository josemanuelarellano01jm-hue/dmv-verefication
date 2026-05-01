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
    db.run(`
        CREATE TABLE IF NOT EXISTS clientes (
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
            telefono TEXT,
            pin TEXT
        )
    `);

    // ====================== DATOS DE CLIENTES CON PIN PARA TODOS ======================
    const clientes = [
        {
            id_cliente: 'Y12345678',
            nombre: 'MARIA HERNANDEZ',
            direccion: '2312 A Texas Av 32',
            estado: 'TEXAS',
            tipo_licencia: 'CLASS C',
            correo: 'MARIAN.HERNANDEZ@GMAIL.COM',
            foto_url: '/fotos/MARIA.png',
            fecha_nacimiento: '1990-07-22',
            sexo: 'F',
            estatura: `5'5"`,
            peso: '140 lb',
            color_ojos: 'BROWN',
            color_cabello: 'BROWN',
            telefono: '+1 214-555-0199',
            pin: '123'
        },
        {
            id_cliente: 'C473652870230',
            nombre: 'LUZ CARTER',
            direccion: '3059 SE LIME TREE TER ATUART, FL 34997',
            estado: 'FLORIDA',
            tipo_licencia: 'CLASS E',
            correo: 'LUCY@GMAIL.COM',
            foto_url: '/fotos/LUZ_CARTER.png',
            fecha_nacimiento: '1965-02-25',
            sexo: 'F',
            estatura: `5'6"`,
            peso: '128 lb',
            color_ojos: 'GREY',
            color_cabello: 'BROWN',
            telefono: '786 906 4756',
            pin: '12'
        },
        {
            id_cliente: '37850640',
            nombre: 'DARWIN G ALVAREZ MARTINEZ',
            direccion: '1012 RIO BRAVO DR FORNEY, TX 75126',
            estado: 'TEXAS',
            tipo_licencia: 'CLASS C',
            correo: 'D.ALVAREZ@GMAIL.COM',
            foto_url: '/fotos/DARWIN_ALVAREZ.jpeg',
            fecha_nacimiento: '1980-04-11',
            sexo: 'M',
            estatura: `6'2"`,
            peso: '',
            color_ojos: 'BROWN',
            color_cabello: 'BLACK',
            telefono: '469 866 73 63',
            pin: '123'
        },
        {
            id_cliente: 'MC254168',
            nombre: 'PORTUGUEZ JACOBO MISAEL',
            direccion: '3305 VANCE RD DAYTON, OH 45439',
            estado: 'OHIO',
            tipo_licencia: 'CLASS D',
            correo: 'NONE',
            foto_url: '/fotos/JACOBO_MISAEL.png',
            fecha_nacimiento: '1981-06-28',
            sexo: 'M',
            estatura: `6'0"`,
            peso: '',
            color_ojos: 'BROWN',
            color_cabello: 'NONE',
            telefono: '859 509 6002',
            pin: '123'
        },
        {
            id_cliente: 'SA4051752',
            nombre: 'ALVARADO BARAHONA WALTER RAMIRO',
            direccion: '12 GEORGE, APT 2 LYNN, MA 01905-2986',
            estado: 'MASSACHUSETTS',
            tipo_licencia: 'CLASS D',
            correo: 'WALTERBARAHONA447@GMAIL.COM',
            foto_url: '/fotos/WALTER_RAMIRO.png',
            fecha_nacimiento: '1975-04-05',
            sexo: 'M',
            estatura: `5'03"`,
            peso: '',
            color_ojos: 'BROWN',
            color_cabello: 'BLACK',
            telefono: '859 509 6002',
            pin: '123'
        }
    ];

    // Insertar todos los clientes
    const stmt = db.prepare(`
        INSERT OR REPLACE INTO clientes (
            id_cliente, nombre, direccion, estado, tipo_licencia, correo, foto_url,
            fecha_nacimiento, sexo, estatura, peso, color_ojos, color_cabello, telefono, pin
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const c of clientes) {
        stmt.run(
            c.id_cliente, c.nombre, c.direccion, c.estado, c.tipo_licencia, c.correo, c.foto_url,
            c.fecha_nacimiento, c.sexo, c.estatura, c.peso, c.color_ojos, c.color_cabello, c.telefono, c.pin
        );
    }
    stmt.finalize();

    console.log(`✅ ${clientes.length} clientes cargados correctamente (todos con pin 123).`);
});

// ====================== RUTAS API ======================
app.post('/api/verificar', (req, res) => {
    const { nombre, id_cliente } = req.body;
    // Permitir búsqueda por nombre O por id (coincidencia cualquiera)
    const query = `SELECT * FROM clientes WHERE LOWER(nombre) = LOWER(?) OR id_cliente = ?`;
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`========================================`);
    console.log(`  Servidor corriendo en el puerto ${PORT}`);
    console.log(`========================================`);
});
