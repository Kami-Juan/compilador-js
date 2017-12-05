let filas_while = [];
const _ = require('underscore');

let obtener_pos_while = ( tabla_lexico_optimizado ) => {
    let pos_while = [];
    for( let x = 0; x < tabla_lexico_optimizado.length; x++)
    {       
        if( tabla_lexico_optimizado[x].identificador == "LLAVE_CERRAR"  && tabla_lexico_optimizado[x+1].token == "while"){
            pos_while.push(x+3);
        }
    }
    return pos_while;
};

let obtener_final_while = ( pos_inicio_while, tabla_lexico_optimizado  ) => {
    let pos_fin_while = "";
    for (let i = pos_inicio_while; i < tabla_lexico_optimizado.length; i++) {
        if( tabla_lexico_optimizado[i].identificador == "PARENTESIS_CERRAR" ){
            pos_fin_while = i;
            break;
        }   
    }
    return pos_fin_while;
};

let obtener_lineas_codigo_while = ( pos_inicio_while, pos_final_while, tabla_lexico_optimizado ) => {
    let arreglo_fila = [];
    //arreglo_fila.push({ token: "%" });
    for( let x = pos_inicio_while; x < pos_final_while; x++  ){
        arreglo_fila.push(tabla_lexico_optimizado[x]);
    }
    //arreglo_fila.push({ token: "%%" });    
    return arreglo_fila;
};

let generarPostfijoWhile = ( lineas_codigo ) => {
    let opstack = [];
    let resultado = [];
    let op;
    
    for( let v = 0; v < lineas_codigo.length; v++ )
    {
        if( resultado.length == 0 && lineas_codigo[v].jerarquia == "ID" ){
            resultado.push(lineas_codigo[v]);
        }else if( opstack.length == 0 && (lineas_codigo[v].token == "|"|| lineas_codigo[v].token == "&" || lineas_codigo[v].token == "EQ" || lineas_codigo[v].token == "<" || lineas_codigo[v].token == ">" || lineas_codigo[v].token == "MAI" || lineas_codigo[v].token == "MNI")){
            opstack.push(lineas_codigo[v]);
        }else if( lineas_codigo[v].jerarquia == "ID" ){
                resultado.push(lineas_codigo[v]);
        }else if( (opstack[opstack.length-1].jerarquia > lineas_codigo[v].jerarquia) && opstack.length > 0){
            let topePilaop = opstack.pop();
            resultado.push(topePilaop);
            if( opstack.length > 0 ){
                for( let r = opstack.length-1; r >= 0; r-- ){ 
                    if(  lineas_codigo[v].jerarquia < opstack[r].jerarquia ){
                        let topePilaop35 = opstack.pop();
                        resultado.push(topePilaop35);
                    }else if(opstack[r].jerarquia == lineas_codigo[v].jerarquia){
                        let topePilaop33 = opstack.pop();
                        resultado.push(topePilaop33);
                    }else if( lineas_codigo[v].jerarquia > opstack[r].jerarquia ){
                        opstack.push(lineas_codigo[v]);
                        break;
                    }
                }
            }else{
                opstack.push( lineas_codigo[v] );
            }

        }else if( typeof parseFloat(_.last(opstack).jerarquia) == "number" && _.last(opstack).jerarquia < lineas_codigo[v].jerarquia){
            opstack.push(lineas_codigo[v]);
        }else if( typeof parseFloat(_.last(opstack).jerarquia) == "number" && _.last(opstack).jerarquia == lineas_codigo[v].jerarquia){
            let topePilaop2 = opstack.pop();
            resultado.push(topePilaop2);
            opstack.push(lineas_codigo[v]);
        }
    }
    
    while( opstack.length != 0  ){
        op = opstack.pop();
        resultado.push(op);
    }
    
    return resultado;
};

let generarTablasWhile = ( filas_while, sizefila ) => {
    let cadena_aux_uno = [];
    let cadena_aux_dos = [];
    let pos_break = 1;
    let cont_iteracion = 0;
    let contador_variable_temp = 1;
    let tablas_codigo_intermedio = [];

    cadena_aux_uno.push(filas_while[0]);

    while( cadena_aux_uno.length > 0 ){
        
        for( let f = pos_break; f < filas_while.length; f++ ){   
            cadena_aux_uno.push(filas_while[f]);            
            if( filas_while[f].identificador == "COMPARADOR" || filas_while[f].identificador == "COMPARACION"){
                pos_break = f+1;
                if( cont_iteracion == 0  ){
                    cadena_aux_dos[0] = cadena_aux_uno[cadena_aux_uno.length-1];
                    cadena_aux_dos[1] = cadena_aux_uno[cadena_aux_uno.length-2];
                    cadena_aux_dos[2] = cadena_aux_uno[cadena_aux_uno.length-3];

                    tablas_codigo_intermedio.push({
                        data_objeto: "T1",
                        dato_fuente: cadena_aux_dos[2].token,
                        operacion: "="
                    });
                    tablas_codigo_intermedio.push({
                        data_objeto: "T1",
                        dato_fuente: cadena_aux_dos[1].token,
                        operacion: cadena_aux_dos[0].token
                    });

                    cadena_aux_uno.pop();
                    cadena_aux_uno.pop();
                    cadena_aux_uno.pop();
                    if( cadena_aux_uno.length == 0 && sizefila <= 3 ){                        
                        break;
                    }else{
                        cadena_aux_uno.push({
                            token: "T1",
                            identificador: "REGISTRO_TEMPORAL"
                        });
                        cadena_aux_dos = [];
                    }
                }else{
                    cadena_aux_dos[0] = cadena_aux_uno[cadena_aux_uno.length-1];
                    cadena_aux_dos[1] = cadena_aux_uno[cadena_aux_uno.length-2];
                    cadena_aux_dos[2] = cadena_aux_uno[cadena_aux_uno.length-3];

                    if( cadena_aux_dos[2].token != "T1" && cadena_aux_dos[0].token != "="){
                        contador_variable_temp++;

                        tablas_codigo_intermedio.push({
                            data_objeto: `T${contador_variable_temp}`,
                            dato_fuente: cadena_aux_dos[2].token,
                            operacion: "="
                        });

                        tablas_codigo_intermedio.push({
                            data_objeto: `T${contador_variable_temp}`,
                            dato_fuente: cadena_aux_dos[1].token,
                            operacion: cadena_aux_dos[0].token
                        });
    
                        cadena_aux_uno.pop();
                        cadena_aux_uno.pop();
                        cadena_aux_uno.pop();
    
                        if( cadena_aux_uno.length > 0 ){    
                            cadena_aux_uno.push({
                                token: `T${contador_variable_temp}`,
                                identificador: "REGISTRO_TEMPORAL" 
                            });
                            cadena_aux_dos = [];
                        }else{
                            break;
                        }
                    }else{
                        tablas_codigo_intermedio.push({
                            data_objeto: cadena_aux_dos[2].token,
                            dato_fuente: cadena_aux_dos[1].token,
                            operacion: cadena_aux_dos[0].token
                        });
                        
                        cadena_aux_uno.pop();
                        cadena_aux_uno.pop();
                        cadena_aux_uno.pop();

    
                        if( cadena_aux_uno.length > 0 ){
                            cadena_aux_uno.push({
                                token: "T1",
                                identificador: "REGISTRO_TEMPORAL" 
                            });
                            cadena_aux_dos = [];                    
                        }else{
                            break;
                        }
                    }

                    
                }
                break;
            }
            
        }
        cont_iteracion++;        
    }
    tablas_codigo_intermedio.push({
        data_objeto: "JR",
        dato_fuente: true,
        operacion: 1   
    },
    {
        data_objeto: "JR",
        dato_fuente: false,
        operacion: "FIN DEL CICLO"   
    });
    return tablas_codigo_intermedio;
};

module.exports = {
    obtener_pos_while,
    obtener_final_while,
    obtener_lineas_codigo_while,
    filas_while,
    generarPostfijoWhile,
    generarTablasWhile
};