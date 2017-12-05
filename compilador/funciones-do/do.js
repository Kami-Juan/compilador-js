const _ = require('underscore');

let filas_do = [];

let obtener_pos_do = ( tabla_lexico_optimizadotabla_lexico_optimizado) => 
{
    let pos_do = [];
    for( let x = 0; x < tabla_lexico_optimizadotabla_lexico_optimizado.length; x++)
    {       
        if( tabla_lexico_optimizadotabla_lexico_optimizado[x].identificador == "LLAVE_APERTURA"  && tabla_lexico_optimizadotabla_lexico_optimizado[x-1].token == "do"){
            pos_do.push(x+1);
        }
    }
    return pos_do; 
};

let obtener_lineas_codigo_do = ( pos_do_inicio, pos_do_final, tabla_lexico_optimizadotabla_lexico_optimizado ) => {

    let arreglo_fila = [];
    for( let x = pos_do_inicio; x < pos_do_final; x++  ){
        arreglo_fila.push(tabla_lexico_optimizadotabla_lexico_optimizado[x]);
    }

    return arreglo_fila;
};


let obtener_inicio_exp_do = ( do_actual ) => {
    let pos_inicio = [];
    for( let x = 0; x < do_actual.length; x++)
    {       
        if( do_actual[x].token == "%"){
            pos_inicio.push(x+1);
        }
    }
    return pos_inicio;
};

let obtener_fin_exp_do = ( do_actual ) => {
    let pos_fin = [];
    for( let x = 0; x < do_actual.length; x++)
    {       
        if( do_actual[x].token == "%%"){
            pos_fin.push(x);
        }
    }
    return pos_fin;
};

let obtener_final_do = ( pos_inicio_do, tabla_lexico_optimizado ) => {
    let pos_fin_do = "";
    for (let i = pos_inicio_do; i < tabla_lexico_optimizado.length; i++) {
        //console.log(tabla_lexico[i].token, i);
        if( tabla_lexico_optimizado[i].identificador == "LLAVE_CERRAR" ){
            pos_fin_do = i-1;
            break;
        }   
    }
    return pos_fin_do;
};

let set_post_do = ( codigos_do ) => 
{   
    let codigos_post = [];
    codigos_post.push({ token: "%" });
    for( let i = 0; i < codigos_do.length; i++ )
    {   
        if( codigos_do[i].identificador == "PUNTOYCOMA" )
        {
            codigos_post.push({ token: "%%" });
            codigos_post.push({ token: "%"  });
        }else{
            codigos_post.push(codigos_do[i]);                
        }
    }
    codigos_post.push({token: "%%"});
    return codigos_post;
};

let generarPostfijoDO = ( lineas_codigo ) => 
{
    let opstack = [];
    let resultado = [];
    let op;
    
    for( let v = 0; v < lineas_codigo.length; v++ )
    {
        if( resultado.length == 0 && lineas_codigo[v].jerarquia == "ID" ){
            resultado.push(lineas_codigo[v]);
        }else if( lineas_codigo[v].jerarquia == "PARENTESIS_APERTURA" ){
            opstack.push(lineas_codigo[v]);
        }else if( opstack.length == 0 && (lineas_codigo[v].token == "+" || lineas_codigo[v].token == "-" || lineas_codigo[v].token == "/" || lineas_codigo[v].token == "*" || lineas_codigo[v].token == "("  || lineas_codigo[v].token == "=")){
            opstack.push(lineas_codigo[v]);
        }else if( _.last(opstack).jerarquia == "PARENTESIS_APERTURA" && (lineas_codigo[v].token == "+" || lineas_codigo[v].token == "-" || lineas_codigo[v].token == "/" || lineas_codigo[v].token == "*" || lineas_codigo[v].token == "=" )){
            opstack.push(lineas_codigo[v]);
        }else if( lineas_codigo[v].jerarquia == "ID" ){
                resultado.push(lineas_codigo[v]);
        }else if( lineas_codigo[v].token == ")" ){
            for( let d = opstack.length-1; d >= 0; d-- )
            {
                if( opstack[d].token != "(" ){
                    let parentesis = opstack.pop();
                                    
                    resultado.push(parentesis);
                }else{
                    opstack.pop();
                    break;
                }  
            }
        }else if( (opstack[opstack.length-1].jerarquia > lineas_codigo[v].jerarquia) && opstack.length > 0){
            let topePilaop = opstack.pop();
            resultado.push(topePilaop);
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

let generarTablasDo = ( filas_do ) => {
    
        let cadena_aux_uno = [];
        let cadena_aux_dos = [];
        let pos_break = 1;
        let cont_iteracion = 0;
        let tablas_codigo_intermedio = [];
        let contador_variable_temp = 1;
        let isIgualAlgo = false;
    
        // Seteo el primer valor a la cadena auxiliar uno:
        cadena_aux_uno.push(filas_do[0]);
    
        while( cadena_aux_uno.length > 0 ){
            
            for( let f = pos_break; f < filas_do.length; f++ ){   
                cadena_aux_uno.push(filas_do[f]);            
                
                if( filas_do[f].identificador == "OPERADOR" || filas_do[f].identificador == "IGUALACION" ){
                    pos_break = f+1;
                    if( cont_iteracion == 0 ){
                        cadena_aux_dos[0] = cadena_aux_uno[cadena_aux_uno.length-1];
                        cadena_aux_dos[1] = cadena_aux_uno[cadena_aux_uno.length-2];
                        cadena_aux_dos[2] = cadena_aux_uno[cadena_aux_uno.length-3];

                        if( cadena_aux_uno.length === 3 && cadena_aux_dos[0].token == "=" ){
                            tablas_codigo_intermedio.push({
                                data_objeto: "T1",
                                dato_fuente: cadena_aux_dos[2].token,
                                operacion: "="
                            });
                            tablas_codigo_intermedio.push({
                                data_objeto: cadena_aux_dos[1].token,
                                dato_fuente: "T1",
                                operacion: cadena_aux_dos[0].token
                            });
                            isIgualAlgo = true;
                        }else{
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
                        }
                        
    
                        cadena_aux_uno.pop();
                        cadena_aux_uno.pop();
                        cadena_aux_uno.pop();

                        if( cadena_aux_uno.length == 0 ){
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
                        
                        if( cadena_aux_dos[2].token != "T1" && cadena_aux_dos[0].token != "=" && isIgualAlgo == false){
                            contador_variable_temp++;
                            // console.log()
                            // console.log(contador_variable_temp);

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
    
        return tablas_codigo_intermedio;
    
};

module.exports = {
    obtener_pos_do,
    obtener_lineas_codigo_do,
    obtener_final_do,
    filas_do,
    set_post_do,
    obtener_inicio_exp_do,
    obtener_fin_exp_do,
    generarPostfijoDO,
    generarTablasDo
};