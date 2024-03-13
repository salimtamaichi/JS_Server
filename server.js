const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const formidable = require('formidable');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
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

app.post('/persona', (req, res) => {
    console.log(1);
    const form = new formidable.IncomingForm();
    console.log(req.body);
    form.parse(req, async (err, fields, files) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        console.log(2);
        console.log(files['arxiu']);
        console.log(files);

        let imageName = null;
        if (files['arxiu']) {
            console.log(3);

            const arxiu = files["arxiu"][0];
            const originalFilename = arxiu.originalFilename;
            const extension = originalFilename.match(/\.[^.]+$/);

            form.uploadDir = __dirname + '/uploads';
            let charactertoSave = JSON.parse(fields.characterInfo);
            const fileName = charactertoSave.name.replace(/ /g, '_');
            imageName = fileName + extension[0];
            fs.rename(arxiu.filepath, form.uploadDir + '/' + fileName + extension[0], async (err) => {
                if (err) {
                    console.log(4);

                    res.statusCode = 400;
                    // res.end(JSON.stringify({ error: "no al guardar la imatge" })); return;
                }
            });
        }
        if (fields) {
            console.log('fields.characterInfo:', fields.characterInfo);
            let charactertoSave = JSON.parse(fields.characterInfo);
            charactertoSave.img = imageName;
            const fileName = charactertoSave.name.replace(/ /g, '_');
            const directorioDestino = path.join(__dirname, 'persona');
            const filePath = path.join(directorioDestino, fileName + '.json');

            fs.writeFile(filePath, JSON.stringify(charactertoSave), async (err) => {
                if (err) {
                } else {
                    fs.readFile(filePath, async (err, data) => {
                        if (err) {
                        } else {
                            let json_llegit = JSON.parse(data);
                            // console.log(json_llegit)
                        }
                    });
                }
            });
        }
    });
});