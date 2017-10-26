const _ = require('underscore');

const componentesLexicos = /(int|float|[-]|[\+]|[\/]|[\*]|^[a-z]+$|[$][A-Za-z$_]+|[_][A-Za-z_]+|[A-Za-z_]+|[A-Za-z$]+|[_]|[$]|[\[]|[\]]|[\(]|[\)]|[\;]|[ ]|[=]|[\,]|[\t]+|[\r]|[\d]+[\.]\d+|[0-9]+|[\.])/g;

const operadores = /([-]|[\+]|[\/]|[\*])/g;
const llaves = /([\[]|[\]]|[\(]|[\)])/g;
const identificadores = /(^[a-z]+$|[$][A-Za-z$_]+|[_][A-Za-z_]+|[A-Za-z_]+|[A-Za-z$]+[_]|[$])/g;
const numeros = /([\d]+[\.]\d+|[0-9]+)/g;
const palabrasReservadas = /(int|float)/g;
const puntoycoma = /([\;])/g;
const igualacion = /([=])/g;
const coma = /([\,])/g;
const punto = /[\.]/g


let tablaLexico = [];
let erroresLexicos = [];

let findErrores = ( linea, index_datos ) => {

    var errores = _.filter(linea, function (x) {
        return  x != x.match(componentesLexicos);
     });
     errores.forEach(function(datos, index){
        if(!_.findKey(erroresLexicos, { datos: datos })){
            erroresLexicos.push({ error: datos, num_linea: index_datos+1 });                                
        }
     });
};


let llenarTablaLexico = ( match ) => {
    var match0 = _.filter(match, function(z){
        return z !== null && z !== " "  && z !== "\r" && z !== _.isEmpty(z);
    });

    var match = _.without(match0, "\t");
    match.forEach(function(e){
                switch (true) {
                    case e == e.match(operadores):
                        tablaLexico.push({ identificador: "operador", token:e });
                        break;
                    case e == e.match(llaves):
                        tablaLexico.push({ identificador: "cierre", token:e });
                        break;
                    case e == e.match(palabrasReservadas):
                        tablaLexico.push({ identificador: "palabra reservada", token:e });
                        break;    
                    case e == e.match(identificadores):
                        tablaLexico.push({ identificador: "identificador", token:e });
                        break;
                    case e == e.match(numeros):
                        tablaLexico.push({ identificador: "constante", token:e });
                        break;
                    case e == e.match(puntoycoma):
                        tablaLexico.push({ identificador: "punto y coma", token:e });
                        break;
                    case e == e.match(igualacion):
                        tablaLexico.push({ identificador: "igualación", token:e });
                        break;    
                    case e == e.match(coma):
                        tablaLexico.push({ identificador: "coma", token:e });
                        break;    
                    case e == e.match(punto):
                        tablaLexico.push({ identificador: "punto", token: e });
                        break;    
                }
    });

};

let analizarTokens = ( entrada ) => {

    var componentes;
    
    entrada.forEach(function(e, i) 
    {
        findErrores(e,i);
        llenarTablaLexico(e.match(componentesLexicos));
    }); 

    return {
        erroresLexicos,
        tablaLexico
    };

};

let cleanTablas = () => {
    tablaLexico = [];
    erroresLexicos = [];
};

module.exports = { analizarTokens, cleanTablas };