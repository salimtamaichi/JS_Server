const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

// Directorio para almacenar las imágenes subidas
const uploadDirectory = path.join(__dirname, 'uploads');

// Si la carpeta 'uploads' no existe, la creamos
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

// Configuración de Multer para manejar la carga de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + extension);
    }
});
const upload = multer({ storage: storage });

// Middleware para permitir CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Ruta para cargar una imagen
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        res.status(400).send('No se ha proporcionado ninguna imagen.');
        return;
    }

    console.log('Imagen subida:', req.file.filename);
    res.send('¡Imagen subida correctamente!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
