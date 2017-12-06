const _ = require('underscore');

/* Aqui se guardan los resultados */
let errores_semanticos = [];
let exito_semantico = [];

/* Este método verifica la semántica del programa */
let analizadorSemantico = ( array_lex, err_sintac  ) =>
{
    if (err_sintac.length > 0 || (array_lex[0].identificador == "IDENTIFICADOR" && array_lex[1].identificador == "PUNTOYCOMA") || array_lex[0].identificador !== "PALABRA_RESERVADA")
    {
        console.log("Repare la sintaxis por favor");
        console.log(err_sintac);
        
    }else
    {
        /* AGREGA EL VALOR A LAS CONSTANTES DEPENDIENDO DE SU TOKEN: ej -> 2.333 = float*/
        for( var x = 0; x < array_lex.length; x++ )
        {
            if( array_lex[x].identificador == "CONSTANTE" ){
                let dato = parseFloat(array_lex[x].token);
                if( dato % 1 !== 0 ){
                    array_lex[x].tipo = "float";
                }else{
                    array_lex[x].tipo = "int";
                }
            }
        }
        
        /* MARCA ERROR SI ES UNA CONSTANTES DESPUES DE LA PALABRA RESERVADA */
        for (var x = 0; x < array_lex.length; x++)
        {
            if (array_lex[x].identificador == "PALABRA_RESERVADA" && array_lex[x+1].identificador == "CONSTANTE") 
            {
                errores_semanticos.push({
                    codigo_err: "ID_ERROR",
                    msg: "EL IDENTIFICADOR NO PUEDE SER CONSTANTE",
                    fila_err: array_lex[x + 1].fila,
                    lexema: array_lex[x + 1].token,
                    tipo: array_lex[x + 1].tipo
                });
            }
        }

        /* INICIALIZA LAS VARIABLES DEPENDIENDO SI LA CONSTATES ES IGUAL AL TIPO DE LA PALABRA RESERVADA */
        for (var x = 0; x < array_lex.length; x++)
        {
            if (array_lex[x].identificador == "PALABRA_RESERVADA") 
            {
                if (array_lex[x+1].identificador == "IDENTIFICADOR") 
                {
                    if (array_lex[x + 2].identificador == "IGUALACION" && array_lex[x + 3].identificador == "CONSTANTE" && array_lex[x + 4].identificador == "PUNTOYCOMA") 
                    {
                        if (array_lex[x].token !== array_lex[x + 3].tipo)
                        {
                            errores_semanticos.push({
                                codigo_err: "DATA_TYPE_ERROR",
                                msg: "LOS TIPOS DE DATOS SON INCOMPATIBLES",
                                fila_err: array_lex[x + 1].fila,
                                lexema: array_lex[x + 1].token,
                                tipo: array_lex[x + 1].tipo
                            });
                        }else{
                            array_lex[x + 1].tipo = array_lex[x].token;                            
                            exito_semantico.push({
                                codigo_exito: "INIT->SUCCESSFULL",
                                msg: "LA VARIABLE SE INICIALIZO SATISFACTORIAMENTE",
                                filla_exito: array_lex[x + 1].fila,
                                lexema: array_lex[x + 1].token,
                                tipo: array_lex[x + 1].tipo
                            });
                        }
                    } 
                }    
            }   
        }
        
        /* VERIFICA CUANDO SE ASIGNA UN VALOR A UNA VARIABLE YA INICIALZADA CONCUERDE CON EL TIPO DE DATO QUE SE GUARDÓ, SI NO TIENE UN VALOR Y NO EXISTE EN LOS VALORES DE ENTRADA SIGNIFICA QUE NO ESTA INICIALIZADA */
        for (var x = 0; x < array_lex.length; x++) 
        {
            if (array_lex[x].identificador == "IDENTIFICADOR") {
                if (array_lex[x].tipo.length == 0) {
                    if(buscarSimbolo(array_lex[x], array_lex))
                    {
                        
                    }else
                    {
                        errores_semanticos.push({
                            codigo_err: "INIT->ERROR",
                            msg: "LA VARIABLE NO ESTA INICIALIZADA",
                            fila_err: array_lex[x].fila,
                            lexema: array_lex[x].token,
                            tipo: array_lex[x].tipo
                        });
                    }                    
                } 
            }
        }
        
               
        /* CUANDO SE L ASIGNA UN NUEVO VALOR A UNA VARIABLE VERIFICA QUE EL NUEVO VALOR SEA IGUAL AL TIPO DE VALOR CON EL QUE SE GUARDÓ */
        for (var x = 0; x < array_lex.length; x++) 
        {
            
            if (array_lex[x].identificador == "IDENTIFICADOR" && array_lex[x + 1].identificador == "IGUALACION" && array_lex[x + 2].identificador == "CONSTANTE" && array_lex[x + 3].identificador == "PUNTOYCOMA" && array_lex[x - 1].identificador != "PALABRA_RESERVADA")
            {
                if (array_lex[x].tipo !== array_lex[x + 2].tipo ){
                    array_lex[x].tipo = "ERROR_TYPE";
                    errores_semanticos.push({
                        codigo_err: "CHANGE_VALUE->ERROR",
                        msg: "EL CAMBIO DE VALOR DE LA VARIABLE ES INCOMPATIBLE",
                        fila_err: array_lex[x].fila,
                        lexema: array_lex[x].token,
                        tipo: array_lex[x].tipo
                    });
                }
            }
        }    
        
        /* VERIFICA QUE CUANDO SE ASIGNA CON VARIOS IDENTIFICADORES Y/O CONSTANTES, VERIFICA QUE CONCUERDEN CON EL TIPO DE VARIABLE QUE ESTÁN IGUALANDO */
        for (var x = 0; x < array_lex.length; x++) 
        {
            if (array_lex[x].identificador == "IDENTIFICADOR" && array_lex[x - 1].identificador != "PALABRA_RESERVADA") {
                if (array_lex[x + 1].identificador == "IGUALACION") {
                    var contErr = realizarOperacion(array_lex[x], array_lex[x].fila, array_lex);
                    if( contErr == 0 )
                    {
                        exito_semantico.push({
                            codigo_exito: "OP_TYPE->SUCCESSFULL",
                            msg: "LAS VARIABLES TIENEN EL MISMO TIPO QUE EL OPERANDO",
                            filla_exito: array_lex[x].fila,
                            lexema: array_lex[x].token,
                            tipo: array_lex[x].tipo
                        });
                    }
                }
            }
        }
    }

    /* LIMPIA LA TABLA DE SIMBOLOS PARA QUE SOLO QUEDEN LOS QUE SE NECESITAN PARA LA SIGUINTE FASE */
    array_lex = array_lex.filter((e) => {
        return e.identificador != "OPERADOR" && e.identificador != "PUNTOYCOMA" && e.identificador != "IGUALACION"; 
    });

    /* RETORNA LAS TABLAS */
    return {
        errores_semanticos,
        exito_semantico, 
        array_lex
    }
    
};

/* LIMPIA LAS TABLAS DESPUES DE MOSTRAR LOS RESULTADOS */
let cleanTablaSemantico = (  ) =>
{
    errores_semanticos = [];
    exito_semantico = []; 
}; 

/* ESTE METODO BUSCA Y ASIGNA SU VALOR CORRESPONDIENTE */
let buscarSimbolo = ( simbolo, lex ) => 
{
    var si_existe = false;
    for (var s = 0; s < lex.length; s++  ){
        if( lex[s].token ==  simbolo.token && lex[s].tipo.length > 0){
            simbolo.tipo = lex[s].tipo;
            si_existe = true;
        }
    }

    return si_existe;
};

/* VERIFICA QUE EL TIPO DE DATO SEA IGUAL QUE LOS DEMÁS */
let realizarOperacion = ( simbolo, fila, lex ) =>
{
    var contErrTipo = 0;
    var contadorError = 0;
    
    errores_semanticos.forEach(e => {
        if( e.codigo_err == "INIT->ERROR" &&( simbolo.token == e.lexema ) ){
            contadorError++;
        }
    });

    console.log(contadorError);

    for (var s = 0; s < lex.length; s++) 
    {
        if ((lex[s].identificador == "IDENTIFICADOR" || lex[s].identificador == "CONSTANTE") && lex[s].fila == fila && lex[s].tipo == simbolo.tipo)
        {

        } else if ((lex[s].identificador == "IDENTIFICADOR" || lex[s].identificador == "CONSTANTE" ) && lex[s].fila == fila && lex[s].tipo !== simbolo.tipo )
        {
            if( contadorError <= 0 && lex[s].tipo != ""){
                errores_semanticos.push({
                    codigo_err: "OP_TYPE->ERROR",
                    msg: "EL TIPO DE DATO ES INCOMPATIBLE CON LA OPERACION",
                    fila_err: lex[s].fila,
                    lexema: lex[s].token,
                    tipo: lex[s].tipo
                });
                contErrTipo++;
            }
        }
    }

    return contErrTipo;
    
}

module.exports = { analizadorSemantico, cleanTablaSemantico };