const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser'); // Para procesar datos del formulario
const HOST = '0.0.0.0'; // Esto hará que el servidor escuche en todas las interfaces de red


app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose');

//conexion a la base de datos
mongoose.connect('mongodb://localhost:27017/baseUsage', {});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
    console.log('Conectado a la base de datos MongoDB');
});
// Definir un esquema de usuario
const reporteSchema = new mongoose.Schema({
    cedula: String,
    fecha: Date,
    mayorConsumo: String,
    packageName1: String,
    packageName2: String,
    packageName3: String,
    packageName4: String,
    packageName5: String,
    tiempoUso1: String,
    tiempoUso2: String,
    tiempoUso3: String,
    tiempoUso4: String,
    tiempoUso5: String,

});

// Definir un modelo basado en el esquema
const Reporte = mongoose.model('Reporte', reporteSchema);

// Ruta principal para cargar el archivo HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/web.html');
});

// Ruta para agregar un nuevo reporte desde la aplicación móvil Flutter
app.post('/enviar-datos', (req, res) => {
    const { cedula, fecha, mayorConsumo, usageData } = req.body;
    
    if (usageData) {
        // Parsear los datos enviados desde el móvil
        const parsedDataToSend = JSON.parse(usageData);

        // Construir un objeto Reporte con los datos recibidos
        const nuevoReporte = new Reporte({
            cedula,
            fecha,
            mayorConsumo,
         });
         // Definir una función para obtener los campos packageName y tiempoUso
         const getFieldData = (index, field) => {
            return parsedDataToSend[index] ? parsedDataToSend[index][field] : '-';
        };
        // Iterar sobre un número máximo de elementos y asignar los valores correspondientes
        const maxElements = 5;
        for (let i = 0; i < maxElements; i++) {
            nuevoReporte[`packageName${i + 1}`] = getFieldData(i, 'packageName');
            nuevoReporte[`tiempoUso${i + 1}`] = getFieldData(i, 'totalTimeInForeground');
        }

        nuevoReporte.save()
            .then(reporte => {
                res.status(200).send('Datos recibidos correctamente'); // Enviar una respuesta exitosa
            })
            .catch(err => {
                console.error('Error al agregar nuevo reporte:', err);
                res.status(500).send('Error al procesar los datos'); // Enviar una respuesta de error en caso de problemas
            });
    } else {
        // Si no se recibieron datos de uso de aplicaciones, enviar una lista vacía
        const nuevoReporte = new Reporte({
            cedula,
            fecha,
            mayorConsumo,
            packageName1: '-',
            packageName2: '-',
            packageName3: '-',
            packageName4: '-',
            packageName5: '-',
            tiempoUso1: 0,
            tiempoUso2: 0,
            tiempoUso3: 0,
            tiempoUso4: 0,
            tiempoUso5: 0,
        });
        nuevoReporte.save()
            .then(reporte => {
                res.status(200).send('Datos recibidos correctamente'); // Enviar una respuesta exitosa
            })
            .catch(err => {
                console.error('Error al agregar nuevo reporte:', err);
                res.status(500).send('Error al procesar los datos'); // Enviar una respuesta de error en caso de problemas
            });
    }
});

// Ruta para agregar un nuevo reporte desde el formulario HTML
app.post('/add-reporte', (req, res) => {
    const nuevoReporte = new Reporte({
        cedula: req.body.cedula,
        fecha: req.body.fecha,
        mayorConsumo: req.body.mayorConsumo,
        packageName1: req.body.packageName1,
        packageName2: req.body.packageName2,
        packageName3: req.body.packageName3,
        packageName4: req.body.packageName4,
        packageName5: req.body.packageName5,
        tiempoUso1: req.body.tiempoUso1,
        tiempoUso2: req.body.tiempoUso2,
        tiempoUso3: req.body.tiempoUso3,
        tiempoUso4: req.body.tiempoUso4,
        tiempoUso5: req.body.tiempoUso5
    });
    nuevoReporte.save()
        .then(reporte => {
            res.redirect('/'); // Redirigir de vuelta a la página principal después de agregar usuario
        })
        .catch(err => {
            console.error('Error al agregar nuevo reporte:', err);
            res.redirect('/'); // Redirigir de vuelta a la página principal en caso de error
        });
});

// Ruta para eliminar un usuario
app.post('/delete-reporte', (req, res) => {
    Reporte.findOneAndDelete({ _id: req.body.reporteId })
        .then(() => {
            res.redirect('/'); // Redirigir de vuelta a la página principal después de eliminar usuario
        })
        .catch(err => {
            console.error('Error al eliminar usuario:', err);
            res.redirect('/'); // Redirigir de vuelta a la página principal en caso de error
        });
});

// Ruta para obtener y mostrar todos los usuarios en formato JSON
app.get('/get-reportes', (req, res) => {
    Reporte.find()
        .then(reportes => {
            res.json(reportes); // Devolver todos los usuarios en formato JSON
        })
        .catch(err => {
            console.error('Error al consultar reportes:', err);
            res.status(500).send('Error al obtener reportes'); // Devolver un mensaje de error si hay algún problema
        });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});