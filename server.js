const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors()); // Permite peticiones desde GitHub Pages
app.use(express.json());

// Puerto: Railway asigna process.env.PORT, si no, usa 3000
const PORT = process.env.PORT || 3000;

// Base de datos de ejemplo (en memoria)
// En un caso real, esto debería ser una base de datos real (MongoDB, PostgreSQL, etc.)
const clientesDB = {
    'C473652870230': {
        id_cliente: 'C473652870230',
        nombre: 'Luz Carter',
        documento: 'Approval',
        fecha_nacimiento: '1985-03-12',
        estado: 'FLORIDA',
        direccion: '123 Main St, Miami, FL',
        foto_url: 'https://i.pravatar.cc/300?img=10',  // URL de ejemplo
        foto_doc_url: 'https://i.pravatar.cc/300?img=11',
        pin: '123'
    },
    'C478512345678': {
        id_cliente: 'C478512345678',
        nombre: 'Carlos Martinez',
        documento: 'Pending',
        fecha_nacimiento: '1990-07-22',
        estado: 'TEXAS',
        direccion: '456 Oak Ave, Houston, TX',
        foto_url: '',
        foto_doc_url: '',
        pin: '456'
    }
};

// Ruta POST /api/verificar
app.post('/api/verificar', (req, res) => {
    const { nombre, id_cliente } = req.body;
    console.log(`Buscando cliente: ${nombre} / ${id_cliente}`);

    // Buscar en la base de datos
    const cliente = clientesDB[id_cliente];
    
    if (cliente && cliente.nombre.toLowerCase() === nombre.toLowerCase()) {
        // Éxito: devolver datos del cliente
        return res.json({
            success: true,
            datos: cliente
        });
    } else {
        // No encontrado
        return res.status(404).json({
            success: false,
            message: 'Record not found'
        });
    }
});

// Ruta de prueba para verificar que el servidor funciona
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
    console.log(`👉 Health check: http://localhost:${PORT}/api/health`);
});
