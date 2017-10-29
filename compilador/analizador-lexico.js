const _ = require('underscore');

const componentesLexicos = /(int|float|[-]|[\+]|[\/]|[\*]|^[a-z]+$|[$][A-Za-z$_]+|[_][A-Za-z_]+|[A-Za-z_]+|[A-Za-z$]+|[_]|[$]|[\(]|[\)]|[\;]|[ ]|[=]|[\t]+|[\r]|[\d]+[\.]\d+|[0-9]+|[\.])/g;

/* const operadores = /([-]|[\+]|[\/]|[\*])/g; */

/* OPERADORES */
const sum = /([\+])/g;
const res = /([-])/g;
const mul = /([\/])/g;
const div = /([\*])/g;

const llave_aper = /([\(])/g;
const llave_cerr = /([\)])/g;
const identificadores = /(^[a-z]+$|[$][A-Za-z$_]+|[_][A-Za-z_]+|[A-Za-z_]+|[A-Za-z$]+[_]|[$])/g;
const numeros = /([\d]+[\.]\d+|[0-9]+)/g;
const palabrasReservadas = /(int|float)/g;
const puntoycoma = /([\;])/g;
const igualacion = /([=])/g;
const punto = /[\.]/g


let tablaLexico = [];
let array_identificadores = [];
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
                    /* case e == e.match(operadores):
                        tablaLexico.push({ identificador: "OPERADOR", token:e });
                        array_identificadores.push("OPERADOR");
                        break; */
                    case e == e.match(sum):
                        tablaLexico.push({ identificador: "OPERADOR", token:e });
                        array_identificadores.push("SUMA");
                        break;
                    case e == e.match(res):
                        tablaLexico.push({ identificador: "OPERADOR", token:e });
                        array_identificadores.push("RESTA");
                        break;
                    case e == e.match(mul):
                        tablaLexico.push({ identificador: "OPERADOR", token:e });
                        array_identificadores.push("MULTIPLICACION");
                        break;
                    case e == e.match(div):
                        tablaLexico.push({ identificador: "OPERADOR", token:e });
                        array_identificadores.push("DIVISION");
                        break;               
                    case e == e.match(llave_cerr):
                        tablaLexico.push({ identificador: "PARENTESIS_CERRAR", token:e });
                        array_identificadores.push("PARENTESIS_CERRAR");                        
                    break;    
                    case e == e.match(llave_aper):
                        tablaLexico.push({ identificador: "PARENTESIS_APERTURA", token:e });
                        array_identificadores.push("PARENTESIS_APERTURA");                        
                        break;    
                    case e == e.match(palabrasReservadas):
                        tablaLexico.push({ identificador: "PALABRA_RESERVADA", token:e });
                        array_identificadores.push("PALABRA_RESERVADA");                                                
                        break;    
                    case e == e.match(identificadores):
                        tablaLexico.push({ identificador: "IDENTIFICADOR", token:e });
                        array_identificadores.push("IDENTIFICADOR");  
                        break;
                    case e == e.match(numeros):
                        tablaLexico.push({ identificador: "CONSTANTE", token:e });
                        array_identificadores.push("CONSTANTE");
                        break;
                    case e == e.match(puntoycoma):
                        tablaLexico.push({ identificador: "PUNTOYCOMA", token:e });
                        array_identificadores.push("PUNTOYCOMA");                        
                        break;
                    case e == e.match(igualacion):
                        tablaLexico.push({ identificador: "IGUALACION", token:e });
                        array_identificadores.push("IGUALACION");                                                
                        break;       
                    case e == e.match(punto):
                        tablaLexico.push({ identificador: "PUNTO", token: e });
                        array_identificadores.push("PUNTO");                                                                        
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
        tablaLexico,
        array_identificadores
    };

};

let cleanTablas = () => {
    tablaLexico = [];
    erroresLexicos = [];
    array_identificadores = [];
};

module.exports = { analizarTokens, cleanTablas };