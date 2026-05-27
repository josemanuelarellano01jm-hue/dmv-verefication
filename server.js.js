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
            foto_doc_url TEXT,
            fecha_nacimiento TEXT,
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
            foto_doc_url: '',
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
            foto_doc_url: '',
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
            foto_doc_url: '',
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
        {
            id_cliente: 'Y0706961',
            nombre: 'MARTINEZ JAZMIN JUAN MANUEL',
            direccion: '579 ENTERPRISE ST ESCENDIDO CAL. 920029',
            estado: 'CALIFORNIA',
            tipo_licencia: 'REAL ID',
            correo: 'Jmchinohes84@gmail.com',
            foto_url: '/fotos/MARTINEZ.png',
            foto_doc_url: '',
            fecha_nacimiento: '1974-06-05',
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
            fecha_nacimiento: '1982-01-12',
            sexo: 'M',
            estatura: `5'58"`,
            peso: '175',
            color_ojos: 'BROWN',
            color_cabello: 'B
