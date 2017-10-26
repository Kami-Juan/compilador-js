const fs = require('fs');
var express = require('express');
var hbs = require('hbs');
var multer = require('multer');
var bodyParse = require('body-parser');
const { analizarTokens,cleanTablas } = require('./compilador/analizador-lexico');

var app = express();
var port = 3000;

app.use(express.static( __dirname + '/public' ));
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(bodyParse.json());

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './data');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
      
    }
});

var upload = multer({ storage: storage }).single('entrada');

app.post('/upload', function (req, res) {
    upload(req, res, function (err) {
      if (err) {
        return err;
      }
      
      fs.readFile('./'+ req.file.path, 'utf8', function( err, data ){
        if( err ){
            return console.log(err);
        }
            var datos = data.split("\n");
            var resultado = analizarTokens(datos);
            res.send({ resultado, datos });
            cleanTablas();

            fs.unlinkSync('./'+ req.file.path);
        });

       
    });
});

app.post('/analizar', ( req, res ) => {
    let datosAnalisis = req.body.texto.split("\n");
    var resultado = analizarTokens(datosAnalisis);
    res.send({ resultado });
    cleanTablas();
});

app.get('/', ( req, res ) => {
     res.render('index.hbs');
});


app.listen( port, () =>  {
    console.log(`Se está iniciando en el puerto ${ port }`);
});