const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Directorio para almacenar las imágenes subidas
const uploadDirectory = path.join(__dirname, 'uploads');

// Si la carpeta 'uploads' no existe, la creamos
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

// Configuración de Multer para guardar archivos en la carpeta 'uploads'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Manejo de la solicitud POST para cargar la imagen
app.post('/upload', upload.single('image'), (req, res) => {
    res.send('¡La imagen se ha subido correctamente!');
});

// Servir los archivos estáticos en la carpeta 'uploads'
app.use(express.static(uploadDirectory));

app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
