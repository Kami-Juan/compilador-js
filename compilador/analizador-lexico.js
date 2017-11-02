const _ = require('underscore');
const { analizadorSintactico } = require('./analizador-sintactico');

const componentesLexicos = /(int|float|[-]|[\+]|[\/]|[\*]|^[a-z]+$|[$][A-Za-z$_]+|[_][A-Za-z_]+|[A-Za-z_]+|[A-Za-z$]+|[_]|[$]|[\(]|[\)]|[\;]|[ ]|[=]|[\t]+|[\r]|[\d]+[\.]\d+|[0-9]+|[\.])/g;

/* const operadores = /([-]|[\+]|[\/]|[\*])/g; */

/* OPERADORES */
const sum = /([\+])/g;
const res = /([-])/g;
const div = /([\/])/g;
const mul = /([\*])/g;

const llave_aper = /([\(])/g;
const llave_cerr = /([\)])/g;
const identificadores = /(^[a-z]+$|[$][A-Za-z$_]+|[_][A-Za-z_]+|[A-Za-z_]+|[A-Za-z$]+[_]|[$])/g;
const numeros = /([\d]+[\.]\d+|[0-9]+)/g;

/* PALABRAS RESERVADAS */
const word_reserv_float = /(float)/g;
const word_reserv_int = /(int)/g;

const palabrasReservadas = /(int|float)/g;
const puntoycoma = /([\;])/g;
const igualacion = /([=])/g;
const punto = /[\.]/g


let tablaLexico = [];
let tablaPura = [];
let array_identificadores = [];
let erroresLexicos = [];
let match_replace = [];


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


let llenarTablaLexico = ( match,index ) => {
    var match0 = _.filter(match, function(z){
        return z !== null && z !== " "  && z !== "\r" && z !== _.isEmpty(z);
    });

    var match = _.without(match0, "\t");

    let replace_array_match = match.map(function(e){
                switch (true) {
                    /* case e == e.match(operadores):
                        tablaLexico.push({ identificador: "OPERADOR", token:e });
                        array_identificadores.push("OPERADOR");
                        break; */
                    case e == e.match(sum):
                        tablaLexico.push({ identificador: "OPERADOR", token:e, fila: index+1 });
                        array_identificadores.push("SUMA");
                        return e = "SUMA";
                        break;
                    case e == e.match(res):
                        tablaLexico.push({ identificador: "OPERADOR", token:e, fila: index+1 });
                        array_identificadores.push("RESTA");
                        return e = "RESTA";
                        break;
                    case e == e.match(mul):
                        tablaLexico.push({ identificador: "OPERADOR", token:e, fila: index+1 });
                        array_identificadores.push("MULTIPLICACION");
                        return e = "MULTIPLICACION";
                        break;
                    case e == e.match(div):
                        tablaLexico.push({ identificador: "OPERADOR", token:e, fila: index+1 });
                        array_identificadores.push("DIVISION");
                        return e = "DIVISION";
                        break;               
                    case e == e.match(llave_cerr):
                        tablaLexico.push({ identificador: "PARENTESIS_CERRAR", token:e, fila: index+1 });
                        array_identificadores.push("PARENTESIS_CERRAR");
                        return e = "PARENTESIS_CERRAR";                        
                    break;    
                    case e == e.match(llave_aper):
                        tablaLexico.push({ identificador: "PARENTESIS_APERTURA", token:e, fila: index+1 });
                        array_identificadores.push("PARENTESIS_APERTURA");
                        return e = "PARENTESIS_APERTURA";                        
                        break;      
                    case e == e.match(palabrasReservadas):
                        tablaLexico.push({ identificador: "PALABRA_RESERVADA", token:e, fila: index+1, tipo: e});
                        array_identificadores.push("PALABRA_RESERVADA");
                        return e = "PALABRA_RESERVADA";                                                
                        break;    
                    case e == e.match(identificadores):
                        tablaLexico.push({ identificador: "IDENTIFICADOR", token: e, fila: index + 1, tipo: "" });
                        array_identificadores.push("IDENTIFICADOR");
                        return e = "IDENTIFICADOR";
                        break;
                    case e == e.match(numeros):
                        tablaLexico.push({ identificador: "CONSTANTE", token:e, fila: index+1, tipo:"" });
                        array_identificadores.push("CONSTANTE");
                        return e = "CONSTANTE";                        
                        break;
                    case e == e.match(puntoycoma):
                        tablaLexico.push({ identificador: "PUNTOYCOMA", token:e, fila: index+1 });
                        array_identificadores.push("PUNTOYCOMA");
                        return e = "PUNTOYCOMA";                        
                        break;
                    case e == e.match(igualacion):
                        tablaLexico.push({ identificador: "IGUALACION", token:e, fila: index+1 });
                        array_identificadores.push("IGUALACION");
                        return e = "IGUALACION";
                        break;       
                    case e == e.match(punto):
                        tablaLexico.push({ identificador: "PUNTO", token: e, fila: index+1 });
                        array_identificadores.push("PUNTO");                                                          
                        return e = "PUNTO";              
                        break;    
                }
    });
    match_replace =  replace_array_match;
};

let analizarTokens = ( entrada ) => {
    
    entrada.forEach(function(e, i) 
    {
        findErrores(e,i);
        llenarTablaLexico(e.match(componentesLexicos),i);
        analizadorSintactico(match_replace, erroresLexicos, i);
    }); 
    return {
        erroresLexicos,
        tablaLexico,
        array_identificadores,
        match_replace,
        tablaPura
    };

};

let cleanTablas = () => {
    tablaLexico = [];
    erroresLexicos = [];
    array_identificadores = [];
};

module.exports = { analizarTokens, cleanTablas };