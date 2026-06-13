const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

// ====================== MIDDLEWARES ======================
app.use(cors());
app.use(express.json());
app.use('/fotos', express.static(path.join(__dirname, 'fotos')));

// ====================== VISTAS ======================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ====================== BASE DE DATOS (SQLITE IN-MEMORY) ======================
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
            foto_doc_url TEXT,
            fecha_nacimiento TEXT,
            sexo TEXT,
            estatura TEXT,
            peso TEXT,
            color_ojos TEXT,
            color_cabello TEXT,
            telefono TEXT,
            pin TEXT,
            documento TEXT DEFAULT 'Pending',
            tipo_restriccion TEXT DEFAULT 'MED'
        )
    `);

    // ====================== DATOS DE CLIENTES CORREGIDOS ======================
    const clientes = [
        {
            id_cliente: '050685014',
            nombre: 'FLORES MARTINEZ MANUEL DE JESUS',
            direccion: '4214 MAGNOLIA PL GAINESVILLE GA 30504-5893',
            estado: 'GEORGIA',
            tipo_licencia: 'CDL',
            correo: 'manuelfloresmar1@yahoo.com',
            foto_url: 'manueld.png',        
            foto_doc_url: 'manuel.doc.png', 
            fecha_nacimiento: '1968-12-31',
            sexo: 'M',
            estatura: `5'06"`,
            peso: '180 lb',
            color_ojos: 'BROWN',
            color_cabello: 'BLACK',
            telefono: '',
            pin: '123',
            documento: 'Pending',
            tipo_restriccion: 'MED'
        },
        {
            id_cliente: 'A7810895',
            nombre: 'VASQUEZ ANTONIO SIERRA',
            direccion: '1828 FLORES ST SEASIDE CA 93955',
            estado: 'CALIFORNIA',
            tipo_licencia: 'COMERCIAL',
            correo: 'antoniosierra63@yahoo.com',
            foto_url: 'antonio.png',          
            foto_doc_url: '/fotos/antonio_doc_.png',   
            fecha_nacimiento: '1972-07-11',
            sexo: 'M',
            estatura: `5'04"`,
            peso: '140 lb',
            color_ojos: 'BROWN',
            color_cabello: 'BLACK',
            telefono: '8312385293',
            pin: '123',
            documento: 'Pending',
            tipo_restriccion: 'USP'
        }
    ];

    const stmt = db.prepare(`
        INSERT OR REPLACE INTO clientes (
            id_cliente, nombre, direccion, estado, tipo_licencia, correo, foto_url, foto_doc_url,
            fecha_nacimiento, sexo, estatura, peso, color_ojos, color_cabello, telefono, pin, documento, tipo_restriccion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const c of clientes) {
        stmt.run(
            c.id_cliente, 
            c.nombre, 
            c.direccion, 
            c.estado, 
            c.tipo_licencia, 
            c.correo, 
            c.foto_url, 
            c.foto_doc_url || '', 
            c.fecha_nacimiento, 
            c.sexo, 
            c.estatura, 
            c.peso, 
            c.color_ojos, 
            c.color_cabello, 
            c.telefono, 
            c.pin,
            c.documento,
            c.tipo_restriccion || 'MED'
        );
    }
    stmt.finalize();
    console.log(`✅ ${clientes.length} clientes cargados correctamente.`);
});

// ====================== RUTAS API ======================
app.post('/api/verificar', (req, res) => {
    const { nombre, id_cliente } = req.body;
    
    const nombreNormalizado = nombre ? nombre.trim().toLowerCase() : null;
    const idClienteNormalizado = id_cliente ? id_cliente.trim().toUpperCase() : null;

    if (!nombreNormalizado && !idClienteNormalizado) {
        return res.status(400).json({ success: false, error: 'Se requiere nombre o id_cliente para verificar.' });
    }

    // Solución definitiva para ignorar si el usuario escribe con S o con Z
    const query = `
        SELECT * FROM clientes 
        WHERE (? IS NOT NULL AND (REPLACE(LOWER(nombre), 'z', 's') = REPLACE(?, 'z', 's'))) 
           OR (? IS NOT NULL AND UPPER(id_cliente) = ?)
    `;
    
    db.get(query, [nombreNormalizado, nombreNormalizado, idClienteNormalizado, idClienteNormalizado], (err, fila) => {
        if (err) {
            console.error('Error al verificar cliente:', err.message);
            return res.status(500).json({ success: false, error: 'Error interno del servidor.' });
        }
        
        if (!fila) {
            return res.json({ success: false, datos: null });
        }

        const datosCorregidos = {
            ...fila,
            fotos_url: fila.foto_url ? `/fotos/${fila.foto_url}` : '',      
            fotos_doc_url: fila.foto_doc_url ? `/fotos/${fila.foto_doc_url}` : '' 
        };

        res.json({ success: true, datos: datosCorregidos });
    });
});

app.get('/api/clientes', (req, res) => {
    db.all("SELECT * FROM clientes", [], (err, filas) => {
        if (err) {
            console.error('Error al obtener clientes:', err.message);
            return res.status(500).json({ success: false, error: 'Error interno del servidor.' });
        }
        res.json(filas);
    });
});

app.put('/api/clientes/:id_cliente/documento', (req, res) => {
    const { documento } = req.body;
    const { id_cliente } = req.params;
    
    if (!documento || typeof documento !== 'string') {
        return res.status(400).json({ success: false, error: 'El campo "documento" es requerido.' });
    }
    
    db.run("UPDATE clientes SET documento = ? WHERE UPPER(id_cliente) = UPPER(?)", [documento.trim(), id_cliente.trim()], function(err) {
        if (err) {
            console.error('Error al actualizar documento del cliente:', err.message);
            return res.status(500).json({ success: false, error: 'Error interno del servidor.' });
        }
        res.json({ success: true, changes: this.changes });
    });
});

app.put('/api/clientes/:id_cliente/restriccion', (req, res) => {
    const { tipo_restriccion } = req.body;
    const { id_cliente } = req.params;
    
    if (!tipo_restriccion || typeof tipo_restriccion !== 'string') {
        return res.status(400).json({ success: false, error: 'El campo "tipo_restriccion" es requerido.' });
    }
    
    db.run("UPDATE clientes SET tipo_restriccion = ? WHERE UPPER(id_cliente) = UPPER(?)", [tipo_restriccion.trim().toUpperCase(), id_cliente.trim()], function(err) {
        if (err) {
            console.error('Error al actualizar restricción:', err.message);
            return res.status(500).json({ success: false, error: 'Error interno del servidor.' });
        }
        res.json({ success: true, changes: this.changes });
    });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal en el servidor!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`  Servidor backend activo en puerto: ${PORT}`);
    console.log(`========================================`);
});
