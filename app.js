const fs = require('fs');
var cors = require('cors');
var express = require('express');
var hbs = require('hbs');
var multer = require('multer');
var bodyParse = require('body-parser');

/* SON LOS METODOS QUE SE UTILIZAN PARA EL PROGRAMA */
const { analizarTokens,cleanTablas } = require('./compilador/analizador-lexico');
const { analizadorSintactico, cleanTablaSintac } = require('./compilador/analizador-sintactico');
const { analizadorSemantico, cleanTablaSemantico } = require('./compilador/analizador-semantico');
const { generarCodigoIntermedio, limpiarTablasCodigoIntermedio } = require('./compilador/codigo-intermedio');

/* INICIALIZA EL SERVER */
var app = express();
var port = process.env.PORT || 3000;

/* ES USADO PARA QUE EXISTA LA CARPETA /PUBLIC, ACEPTE ARCHIVOS .HBS Y PUEDA ENVIAR PETICIONES HTTP*/
app.use(express.static( __dirname + '/public' ));
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(bodyParse.json());
app.use(cors());



/* GUARDA LOS DATOS QUE SE ENVIAN AL SERVER */
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
      /* LEE EL DATO QUE SE ENVIÓ AL SERVER */
      fs.readFile('./'+ req.file.path, 'utf8', function( err, data ){
        if( err ){
            return console.log(err);
        }
            /* GUARDA EN UNA VARIABLE LOS DATOS DE ENTRADA Y SE LOS ENVIA A LOS DEMAS METODOS */
            var datos = data.split("\n");
            var resultado = analizarTokens(datos);
            cleanTablas();

            let identificador = resultado.array_identificadores;


            var res_sem = analizadorSemantico(resultado.tablaLexico, []);

            let codigo_intermedio = generarCodigoIntermedio( resultado.tablaLexico, res_sem.errores_semanticos );
            
            res.send({ resultado, sintac: [], res_sem,  codigo_intermedio,datos });
            cleanTablaSemantico();
            limpiarTablasCodigoIntermedio();

            // res.send({ resultado, sintac, res_sem, datos });
            // cleanTablaSemantico();

            fs.unlinkSync('./'+ req.file.path);
        });

       
    });
});

app.post('/analizar', ( req, res ) => {
    /* LEE LSO DATOS DE ENTRADA DEL TEXTAREA Y APLICA LOS METODOS */
    let datosAnalisis = req.body.texto.split("\n");

    var resultado = analizarTokens(datosAnalisis);
    cleanTablas();
    
    //  var sintac = analizadorSintactico( resultado.tablaLexico, resultado.erroresLexicos);
    // cleanTablaSintac();

    let identificador = resultado.array_identificadores;
    
    var res_sem = analizadorSemantico(resultado.tablaLexico, [] );

    let codigo_intermedio = generarCodigoIntermedio( resultado.tablaLexico, res_sem.errores_semanticos );
    
    res.send({ resultado, sintac: [], res_sem,  codigo_intermedio });
    cleanTablaSemantico();
    limpiarTablasCodigoIntermedio();
    
});

/* REDERIZA EL HOME */
app.get('/', ( req, res ) => {
     res.render('index.hbs');
});

/* PRENDE EL SERVER */
app.listen( port, () =>  {
    console.log(`Se está iniciando en el puerto ${ port }`);
});