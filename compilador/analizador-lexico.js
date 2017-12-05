const _ = require('underscore');
const { analizadorSintactico } = require('./analizador-sintactico');

/* Esta expresion regular determina que lexemas acepta el programa */
const componentesLexicos = /(int|float|[-]|[\+]|[\/]|[\*]|^[a-z]+$|[$][A-Za-z$_]+|[_][A-Za-z_]+|[A-Za-z_]+|[A-Za-z$]+|[_]|[$]|[\(]|[\)]|[\;]|[ ]|[=]|[\t]+|[\r]|[\d]+[\.]\d+|[0-9]+|[\.]|[>]|[<]|MAI|MNI|EQ|[\{]|[\}]|[\|]|[&])/g;

/* const operadores = /([-]|[\+]|[\/]|[\*])/g; */

/* OPERADORES */
const sum = /([\+])/g;
const res = /([-])/g;
const div = /([\/])/g;
const mul = /([\*])/g;

/* BOOLEANOS */
const mayor = /([>])/g;
const menor = /([<])/g;
const mayor_igual = /(MAI)/g;
const menor_igual = /(MNI)/g;
const igual_igual = /(EQ)/g;

/* COMPARATIVOS */

const or = /([\|])/g;
const and = /([&])/g;

/* PARENTESIS */
const llave_aper = /([\(])/g;
const llave_cerr = /([\)])/g;

/*LLAVES */
const llave_inicio = /([\{])/g;
const llave_final = /([\}])/g;

/* IDENTIFICADORES */
const identificadores = /(^[a-z]+$|[$][A-Za-z$_]+|[_][A-Za-z_]+|[A-Za-z_]+|[A-Za-z$]+[_]|[$])/g;

/* CONSTANTES */
const numeros = /([\d]+[\.]\d+|[0-9]+)/g;

/* PALABRAS RESERVADAS */
const word_reserv_float = /(float)/g;
const word_reserv_int = /(int)/g;
const word_reserv_do = /(do)/g;
const word_reserv_while = /(while)/g;
const palabrasReservadas = /(int|float|do|while)/g;

/* PUNTOYCOMA */
const puntoycoma = /([\;])/g;

/* IGUALACION */
const igualacion = /([=])/g;

/* PUNTO */
const punto = /[\.]/g


/* Aquí se guardan los valores que cada método devuelve */
let tablaLexico = [];
let tablaPura = [];
let array_identificadores = [];
let erroresLexicos = [];
let match_replace = [];

/* Busca los lexemas que no concuerdan en las expresion regular que se formuló */
let findErrores = ( linea, index_datos ) => {

    var errores = _.filter(linea, function (x) {
        return  x != x.match(componentesLexicos);
     });

     /* Se guarda en un la tabla erroresLexico como un objeto que lo compone de que lexema es incorrecto y en qué linea*/
     errores.forEach(function(datos, index){
        if(!_.findKey(erroresLexicos, { datos: datos })){
            erroresLexicos.push({ error: datos, num_linea: index_datos+1 });                                
        }
     });
};

/* Este método llena la tabla con los lexemas correctos en forma de objetos */
let llenarTablaLexico = ( match,index ) => {

    // for( let z = 0; z < match.length; z++ ){
    //     if( (match[z] == "+" && match[z+1] == 0) ||  (match[z] == "-" && match[z+1] == 0) ){
    //          match[z] = " ";
    //          match[z+1] = " ";
    //      }
    // }

    /* Este metodo borra todas las impuresas de los valores de entrada */
    var match0 = _.filter(match, function(z){
        return z !== null && z !== " "  && z !== "\r" && z !== _.isEmpty(z);
    });

    /* Le quita los tabs a los valores de entrada */
    var match = _.without(match0, "\t");

    /* Aqui verifica que sean igual a la expresion regular y lo llena a la tabla de simbolos */
    let replace_array_match = match.map(function(e){
                switch (true) {
                    /* case e == e.match(operadores):
                        tablaLexico.push({ identificador: "OPERADOR", token:e });
                        array_identificadores.push("OPERADOR");
                        break; */
                    case e == e.match(or):
                        tablaLexico.push({ identificador: "COMPARACION", token:e, fila: index+1 });
                        array_identificadores.push("OR");
                        return e = "OR";
                        break;  
                    case e == e.match(and):
                        tablaLexico.push({ identificador: "COMPARACION", token:e, fila: index+1 });
                        array_identificadores.push("AND");
                        return e = "AND";
                        break;  
                    case e == e.match(igualacion):
                        tablaLexico.push({ identificador: "IGUALACION", token:e, fila: index+1 });
                        array_identificadores.push("IGUALACION");
                        return e = "IGUALACION";
                        break;       
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
                    
                    case e == e.match(mayor_igual):
                        tablaLexico.push({ identificador: "COMPARADOR", token:e, fila: index+1 });
                        array_identificadores.push("MAYOR_IGUAL_QUE");
                        return e = "MAYOR_IGUAL_QUE";
                        break;
                    case e == e.match(menor_igual):
                        tablaLexico.push({ identificador: "COMPARADOR", token:e, fila: index+1 });
                        array_identificadores.push("MENOR_IGUAL_QUE");
                        return e = "MENOR_IGUAL_QUE";
                        break;
                        case e == e.match(mayor):
                        tablaLexico.push({ identificador: "COMPARADOR", token:e, fila: index+1 });
                        array_identificadores.push("MAYOR_QUE");
                        return e = "MAYOR_QUE";
                        break;
                    case e == e.match(menor):
                        tablaLexico.push({ identificador: "COMPARADOR", token:e, fila: index+1 });
                        array_identificadores.push("MENOR_QUE");
                        return e = "MENOR_QUE";
                        break;    
                    case e == e.match(igual_igual):
                        tablaLexico.push({ identificador: "COMPARADOR", token:e, fila: index+1 });
                        array_identificadores.push("COMPARAR");
                        return e = "COMPARAR";
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
                    case e == e.match(llave_inicio):
                        tablaLexico.push({ identificador: "LLAVE_APERTURA", token:e, fila: index+1 });
                        array_identificadores.push("LLAVE_APERTURA");
                        return e = "LLAVE_APERTURA";                        
                        break; 
                    case e == e.match(llave_final):
                        tablaLexico.push({ identificador: "LLAVE_CERRAR", token:e, fila: index+1 });
                        array_identificadores.push("LLAVE_CERRAR");
                        return e = "LLAVE_CERRAR";                        
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
                    case e == e.match(punto):
                        tablaLexico.push({ identificador: "PUNTO", token: e, fila: index+1 });
                        array_identificadores.push("PUNTO");                                                          
                        return e = "PUNTO";              
                        break;    
                }
    });

    /* Se necesitó el uso de una tabla pivote para el sintactico, por lo que el resultado de todo se almacena en esa variable */
    match_replace =  replace_array_match;
};

/* Lee fila por fila los tokens y los envia a los metodos correspondientes*/
let analizarTokens = ( entrada ) => {
    
    entrada.forEach(function(e, i) 
    {

        findErrores(e,i);
        llenarTablaLexico(e.match(componentesLexicos),i);
        /* Se envía el atributo de llenarTabla para determinar si la sintaxis es correcta, mas la tabla de sus errores y la fila en la que esta leyyendo */
        analizadorSintactico(match_replace, erroresLexicos, i);
    }); 

    //console.log(tablaLexico);

    return {
        erroresLexicos,
        tablaLexico,
        array_identificadores,
        match_replace,
        tablaPura
    };

};

/* Este metodo sirve para limpiar las tablas después de obtener la información que se necesitaba */
let cleanTablas = () => {
    tablaLexico = [];
    erroresLexicos = [];
    array_identificadores = [];
};

module.exports = { analizarTokens, cleanTablas };