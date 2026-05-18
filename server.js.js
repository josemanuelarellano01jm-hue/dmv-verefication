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
    // Actualizamos el esquema para incluir foto_doc_url
    db.run(`
        CREATE TABLE IF NOT EXISTS clientes (
            id_cliente TEXT PRIMARY KEY,
            nombre TEXT,
            direccion TEXT,
            estado TEXT,
            tipo_licencia TEXT,
            correo TEXT,
            foto_url TEXT,
            foto_doc_url TEXT,  -- NUEVA COLUMNA
            fecha_nacimiento TEXT, -- Recomendado formato YYYY-MM-DD
            sexo TEXT,
            estatura TEXT,
            peso TEXT,
            color_ojos TEXT,
            color_cabello TEXT,
            telefono TEXT,
            pin TEXT,
            documento TEXT DEFAULT 'Pending'
        )
    `);

    // ====================== DATOS DE CLIENTES CORREGIDOS ======================
    const clientes = [
        {
            id_cliente: 'SA4051752',
            nombre: 'ALVARADO BARAHONA WALTER RAMIRO',
            direccion: '12 GEORGE, APT 2 LYNN, MA 01905-2986',
            estado: 'MASSACHUSETTS',
            tipo_licencia: 'CLASS D',
            correo: 'WALTERBARAHONA447@GMAIL.COM',
            foto_url: '/fotos/WALTER_RAMIRO.png',
            foto_doc_url: '/fotos/WALTER_RAMIRO_doc.png',
            fecha_nacimiento: '1975-04-05',
            sexo: 'M',
            estatura: `5'03"`,
            peso: '',
            color_ojos: 'BROWN',
            color_cabello: 'BLACK',
            telefono: '859 509 6002',
            pin: '123',
            documento: 'Approval'
        },
        {
            id_cliente: 'C473652870230',
            nombre: 'LUZ CARTER',
            direccion: '3059 SE LIME TREE TER ATUART, FL 34997',
            estado: 'FLORIDA',
            tipo_licencia: 'CLASS E',
            correo: 'LUCY@GMAIL.COM',
            foto_url: '/fotos/LUZ_CARTER.png',
            foto_doc_url: '', // Añadido para consistencia
            fecha_nacimiento: '1965-02-25',
            sexo: 'F',
            estatura: `5'6"`,
            peso: '128 lb',
            color_ojos: 'GREY',
            color_cabello: 'BROWN',
            telefono: '786 906 4756',
            pin: '12',
            documento: 'Pending'
        },
        {
            id_cliente: '37850640',
            nombre: 'DARWIN G ALVAREZ MARTINEZ',
            direccion: '1012 RIO BRAVO DR FORNEY, TX 75126',
            estado: 'TEXAS',
            tipo_licencia: 'CLASS C',
            correo: 'D.ALVAREZ@GMAIL.COM',
            foto_url: '/fotos/DARWIN_ALVAREZ.jpeg',
            foto_doc_url: '', // Añadido para consistencia
            fecha_nacimiento: '1980-04-11',
            sexo: 'M',
            estatura: `6'2"`,
            peso: '',
            color_ojos: 'BROWN',
            color_cabello: 'BLACK',
            telefono: '469 866 73 63',
            pin: '123',
            documento: 'Pending'
        },
        {
            id_cliente: 'MC254168',
            nombre: 'PORTUGUEZ JACOBO MISAEL',
            direccion: '3305 VANCE RD DAYTON, OH 45439',
            estado: 'OHIO',
            tipo_licencia: 'CLASS D',
            correo: 'NONE',
            foto_url: '/fotos/JACOBO_MISAEL.png',
            foto_doc_url: '', // Añadido para consistencia
            fecha_nacimiento: '1981-06-28',
            sexo: 'M',
            estatura: `6'0"`,
            peso: '',
            color_ojos: 'BROWN',
            color_cabello: 'NONE',
            telefono: '859 509 6002',
            pin: '123',
            documento: 'Pending'
        },
        // ELIMINADO EL DUPLICADO DE SA4051752
        {
            id_cliente: 'Y0706961',
            nombre: 'MARTINEZ JAZMIN JUAN MANUEL',
            direccion: '579 ENTERPRISE ST ESCENDIDO CAL. 920029',
            estado: 'CALIFORNIA',
            tipo_licencia: 'REAL ID',
            correo: 'Jmchinohes84@gmail.com',
            foto_url: '/fotos/MARTINEZ.png',
            foto_doc_url: '', // Añadido para consistencia
            fecha_nacimiento: '1974-06-05', // Corregido formato DD/MM/YYYY -> YYYY-MM-DD
            sexo: 'M',
            estatura: `5'52"`,
            peso: '160',
            color_ojos: 'BLACK',
            color_cabello: 'BLACK',
            telefono: '422 351 1286',
            pin: '',
            documento: 'Pending'
        },
        {
            id_cliente: 'Y0706960', 
            nombre: 'ALFREDO ISLAS BARRIOS',
            direccion: '1974 Concordia Walk Los Angeles CA 90062',
            estado: 'CALIFORNIA',
            tipo_licencia: 'REAL ID',
            correo: 'NONE',
            foto_url: '/fotos/ISLAS_BARRIOS.png',
            foto_doc_url: '/fotos/barrios_islas_doc.png',
            fecha_nacimiento: '1982-01-12', // Corregido formato DD/MM/YYYY -> YYYY-MM-DD
            sexo: 'M',
            estatura: `5'58"`,
            peso: '175',
            color_ojos: 'BROWN',
            color_cabello: 'BROWN',
            telefono: '2132145816',
            pin: '',
            documento: 'Pending'
        },


{
            id_cliente: 'Y0706962', 
            nombre: 'PABLO MORALES ABEL',
            direccion: '1109 Allison st Newton Kansas 67114',
            estado: 'CALIFORNIA',
            tipo_licencia: 'REAL ID',
            correo: '1018 Texas st Redlands CA 92374',
            foto_url: 'fotos/PABLO_MORALES1.png',
            foto_doc_url: '/fotos/PABLO_MORALES.doc.png',
            fecha_nacimiento: '1987-11-05', // Corregido formato DD/MM/YYYY -> YYYY-MM-DD
            sexo: 'M',
            estatura: `5'06"`,
            peso: '145',
            color_ojos: 'BROWN',
            color_cabello: 'BLACK',
            telefono: '909 8108975',
            pin: '123',
            documento: 'Pending'
        },

        
{
            id_cliente: 'K04578522', 
            nombre: 'FIGUEROA CRUZ CARLOS GUSTAVO',
            direccion: '1109 Allison st Newton Kansas 67114',
            estado: 'CALIFORNIA',
            tipo_licencia: 'REAL ID',
            correo: 'gabyhonduras1995@gmail.com',
            foto_url: 'fotos/carlos_cruz.png',
            foto_doc_url: '/fotos/carlos_cruz1.doc.png',
            fecha_nacimiento: '1987-11-05', // Corregido formato DD/MM/YYYY -> YYYY-MM-DD
            sexo: 'M',
            estatura: `5'08"`,
            peso: '180',
            color_ojos: 'BROWN',
            color_cabello: 'BLACK',
            telefono: '909 8108975',
            pin: '123',
            documento: 'Pending'
        },

                
{
            id_cliente: 'R316-2517', 
            nombre: 'Rosendo garcia Jose Alberto',
            direccion: '5273 N BUSINESS CEN N BUSINESS CEN N, LADYSMITH, WI 54848',
            estado: 'WISCONSIN',
            tipo_licencia: 'REGULAR',
            correo: 'Jose13252@icloud.com',
            foto_url: '/fotos/jose _alberto1.png',
            foto_doc_url: '/fotos/jose_alberto.doc.png',
            fecha_nacimiento: '23/12/2003', // Corregido formato DD/MM/YYYY -> YYYY-MM-DD
            sexo: 'M',
            estatura: `5'0"`,
            peso: '180',
            color_ojos: 'BROWN',
            color_cabello: 'BLACK',
            telefono: 'NONE',
            pin: '',
            documento: 'Pending'
        },



{
            id_cliente: 'A19799679', 
            nombre: 'MARADIAGA ARBIS JOB',
            direccion: '5100 MCMANUS DR FREDEEICKSBURG, VA 22407-7772',
            estado: 'VIRGINIA',
            tipo_licencia: 'REGULAR',
            correo: 'Arbimaradiaga@gmail.com',
            foto_url: '/fotos/MARADIAGA_png',
            foto_doc_url: '/fotos/MARADIAGA_doc.png',
            fecha_nacimiento: '12/05/1980', // Corregido formato DD/MM/YYYY -> YYYY-MM-DD
            sexo: 'M',
            estatura: `5'05"`,
            peso: '180',
            color_ojos: 'BLACK',
            color_cabello: 'BLACK',
            telefono: '5407349476',
            pin: '',
            documento: 'Pending'
        },


        

        
        
    ];

    // Actualizamos la sentencia preparada para incluir foto_doc_url
    const stmt = db.prepare(`
        INSERT OR REPLACE INTO clientes (
            id_cliente, nombre, direccion, estado, tipo_licencia, correo, foto_url, foto_doc_url,
            fecha_nacimiento, sexo, estatura, peso, color_ojos, color_cabello, telefono, pin, documento
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            c.foto_doc_url || '', // Manejo de valor por defecto si no existe
            c.fecha_nacimiento, 
            c.sexo, 
            c.estatura, 
            c.peso, 
            c.color_ojos, 
            c.color_cabello, 
            c.telefono, 
            c.pin,
            c.documento
        );
    }
    stmt.finalize();

    console.log(`✅ ${clientes.length} clientes cargados correctamente.`);
});

// ====================== RUTAS API MEJORADAS ======================
app.post('/api/verificar', (req, res) => {
    const { nombre, id_cliente } = req.body;
    
    // Mejor rendimiento normalizando el nombre en la aplicación antes de la consulta
    const nombreNormalizado = nombre ? nombre.trim().toLowerCase() : '';
    const idClienteNormalizado = id_cliente ? id_cliente.trim() : '';

    if (!nombreNormalizado && !idClienteNormalizado) {
        return res.status(400).json({ success: false, error: 'Se requiere nombre o id_cliente para verificar.' });
    }

    const query = `SELECT * FROM clientes WHERE LOWER(nombre) = ? OR id_cliente = ?`;
    
    db.get(query, [nombreNormalizado, idClienteNormalizado], (err, fila) => {
        if (err) {
            console.error('Error al verificar cliente:', err.message);
            return res.status(500).json({ success: false, error: 'Error interno del servidor.' });
        }
        res.json({ success: !!fila, datos: fila || null });
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
        return res.status(400).json({ success: false, error: 'El campo "documento" es requerido y debe ser una cadena de texto.' });
    }
    
    db.run("UPDATE clientes SET documento = ? WHERE id_cliente = ?", [documento.trim(), id_cliente.trim()], function(err) {
        if (err) {
            console.error('Error al actualizar documento del cliente:', err.message);
            return res.status(500).json({ success: false, error: 'Error interno del servidor.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ success: false, error: `No se encontró el cliente con id: ${id_cliente}` });
        }
        res.json({ success: true, changes: this.changes });
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal en el servidor!');
});

const PORT = process.env.PORT || 3000;
// Por seguridad en desarrollo local, es mejor '127.0.0.1'
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';

app.listen(PORT, HOST, () => {
    console.log(`========================================`);
    console.log(`  Servidor corriendo en http://${HOST}:${PORT}`);
    console.log(`  Entorno: ${process.env.NODE_ENV || 'desarrollo'}`);
    console.log(`========================================`);
});
