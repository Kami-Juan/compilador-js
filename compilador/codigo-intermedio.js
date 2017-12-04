const _ = require('underscore');
let { obtener_fin_exp, obtener_inicio_exp, obtener_lineas_codigo_do, obtener_pos_do, filas_do, obtener_final_do, set_post_do, obtener_inicio_exp_do, obtener_fin_exp_do, generarPostfijoDO } = require('./funciones-do/do');
let { obtener_final_while, obtener_lineas_codigo_while, obtener_pos_while, filas_while, generarPostfijoWhile } = require('./funciones-while/while');

let codigos_infijo = [];
let codigos_posfijo = [];


let codigos_do = [];
let codigo_while = [];

let codigos_do_post = [];
let codigos_while_post = [];

let lineas_codigo_do_pos_inicio = [];
let lineas_codigo_do_pos_final = [];


let generarCodigoIntermedio = ( tabla_lexico, errores_semanticos ) =>
{
    if( errores_semanticos.length > 0 )
    {
        console.log("Repare el semántico");
    }else
    {
        let pos_do = obtener_pos_do( tabla_lexico );
        let pos_while = obtener_pos_while( tabla_lexico );
       
        
        let pos_final_do = [];
        for( let x = 0; x < pos_do.length; x++ )
        {
            pos_final_do.push(obtener_final_do( pos_do[x], tabla_lexico ));
        }

        //console.log( `posiciones de inicio do: ${ pos_do }` );        
        //console.log( `posiciones de final do: ${ pos_final_do }` );        

        let pos_final_while = [];
        for( let z = 0; z < pos_while.length; z++ )
        {
            pos_final_while.push(obtener_final_while( pos_while[z], tabla_lexico ));
        }

        //console.log( `posiciones de inicio while: ${ pos_while }` );        
        //console.log( `posiciones de final while: ${ pos_final_while }` );        
    
        /*----------------------------------------------------*/

        for( let y = 0; y < pos_do.length; y++ )
        {
            codigos_do.push(obtener_lineas_codigo_do( pos_do[y], pos_final_do[y], tabla_lexico ));
        }

        //console.log(`Filas de los do por do existentes: `);
        //console.log(codigos_do);

        for( let w = 0; w < pos_while.length; w++ )
        {
            codigo_while.push( obtener_lineas_codigo_while( pos_while[w], pos_final_while[w], tabla_lexico ) );
        }

        //console.log(`Filas de los while por whiles existentes: `);
        //console.log(codigo_while);

        /*--------------------------------------------------*/

        for( let s = 0; s < codigos_do.length; s++ )
        {
            codigos_do_post.push( set_post_do( codigos_do[s] ) );
        }  

        /*------------------------------------------------*/
        //SETEA LA JERARQUIA DE LOS OPERADORES
        for( let q = 0; q < codigos_do_post.length; q++ )
        {
            for( let p = 0; p < codigos_do_post[q].length; p++ )
            {
                setearJerarquia( codigos_do_post[q][p] );
            }
        }

        for( let q = 0; q < codigo_while.length; q++ )
        {
            for( let p = 0; p < codigo_while[q].length; p++ )
            {
                setearJerarquia( codigo_while[q][p] );
            }
        }

        //console.log(`Filas nuevas con POST do jerarquizado: `);
        //console.log(codigos_do_post);
        //console.log(`Filas nuevas while jerarquizado: `);
        //console.log(codigo_while);

        /*----------------------------------------------*/
        //OBTIENE LAS POSICIONES DEL ARREGLO DONDE SE ENCUENTRAN LOS POST AL DO
        
        for( let f = 0; f < codigos_do_post.length; f++ )
        {
            lineas_codigo_do_pos_inicio.push( obtener_inicio_exp_do( codigos_do_post[f] ) );
            lineas_codigo_do_pos_final.push( obtener_fin_exp_do( codigos_do_post[f] ) );
        }

        // console.log(`Posiciones de las lineas de codigo inicio do: `);
        // console.log(lineas_codigo_do_pos_inicio);
        // console.log(`Posiciones de las lineas de codigo final do: `);
        // console.log(lineas_codigo_do_pos_final);

        /*-------------------------------------------------------------*/
        //OBTIENE LAS LINEAS DE CODIGO DE LOS DO POR CADA DO EXISTENTE
        let lineas_codigo = [];

        for( let f = 0; f < codigos_do_post.length; f++ )
        {
            let ln_code_uno = [];
            for( let c = 0; c <  lineas_codigo_do_pos_inicio[f].length; c++)
            {
                let ln_code = [];
                for( let n = lineas_codigo_do_pos_inicio[f][c]; n < lineas_codigo_do_pos_final[f][c]; n++)
                {   
                    ln_code.push(codigos_do_post[f][n]);
                }
                ln_code_uno.push( ln_code );
                
            }
            lineas_codigo.push( ln_code_uno );
        }

        /*------------------------------------------------*/
        //OBTIENE LAS LINEAS DE CODIGO EN FORMATO POSTFIJO DO

        let postfijo_do = [];
        for( let g = 0; g < lineas_codigo.length; g++ )
        {   
            let posfijo_lineas_do = [];
            for (let j = 0; j < lineas_codigo[g].length; j++)
            {                                  
                posfijo_lineas_do.push(generarPostfijoDO( lineas_codigo[g][j] ));                
            }
            postfijo_do.push(posfijo_lineas_do);
        }

        let postfijo_while = [];
        for( let g = 0; g < codigo_while.length; g++ )
        {   
            postfijo_while.push(generarPostfijoWhile( codigo_while[g] ));                
        }

        //console.log(`CODIGOS POSFIJO`);
        //console.log( postfijo_do[0] );
        //console.log(`CODIGOS POSFIJO WHILE`);
        //console.log( postfijo_while );

        /* -------------------------------------- */
        //CREAR TABLAS:

        let tablas_codigo_intermedio_do = [];

        for( let g = 0; g < postfijo_do.length; g++ )
        {   
            let tablas_codigo_intermedio_do_fila = [];        
            for (let j = 0; j < postfijo_do[g].length; j++)
            {
                tablas_codigo_intermedio_do_fila.push(generarTablas( postfijo_do[g][j] ));
            }
            tablas_codigo_intermedio_do.push(tablas_codigo_intermedio_do_fila);
        }    

        console.log( tablas_codigo_intermedio_do[2] );
        



        /*---------------------------------------*/

        filas_do = [];
        filas_while = [];
        codigos_infijo = [];
        codigos_posfijo = [];
        codigos_do = [];
        codigos_do_post = [];
        lineas_codigo_do_pos_inicio = [];
        lineas_codigo_do_pos_final = [];
        lineas_codigo = [];
        opstack = [];
        resultado = [];
        postfijo_do = [];
        postfijo_while = [];
        codigo_while = [];
        tablas_codigo_intermedio = [];
    }
};

let setearJerarquia = ( simbolo ) =>{

    if( simbolo.token == "=" ){
        simbolo.jerarquia = 0;
    }else if( simbolo.token == "|" ){
        simbolo.jerarquia = 1;        
    }else if( simbolo.token == "&" ){
        simbolo.jerarquia = 2;        
    }else if( simbolo.token == "EQ" ){
        simbolo.jerarquia = 3;        
    }else if( simbolo.token == "<" ){
        simbolo.jerarquia = 4;        
    }else if( simbolo.token == ">" ){
        simbolo.jerarquia = 4;        
    }else if( simbolo.token == "MAI" ){
        simbolo.jerarquia = 4;        
    }else if( simbolo.token == "MNI" ){
        simbolo.jerarquia = 4;        
    }else if( simbolo.token == "+" ){
        simbolo.jerarquia = 5;        
    }else if( simbolo.token == "-" ){
        simbolo.jerarquia = 5;        
    }else if( simbolo.token == "*" ){
        simbolo.jerarquia = 6;        
    }else if( simbolo.token == "/" ){
        simbolo.jerarquia = 6;        
    }else if( simbolo.token == "(" ){
        simbolo.jerarquia = "PARENTESIS_APERTURA";        
    }else if( simbolo.token == ")" ){
        simbolo.jerarquia = "PARENTESIS_CERRAR";        
    }else if( simbolo.token ){
        simbolo.jerarquia = "ID";
    }
};

let generarTablas = ( filas_do ) => {
    let cadena_aux_uno = [];
    let cadena_aux_dos = [];
    let pos_break = 1;
    let cont_iteracion = 0;
    let tablas_codigo_intermedio = [];

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
                    cadena_aux_uno.push({
                        token: "T1",
                        identificador: "REGISTRO_TEMPORAL"
                    });
                    
                    cadena_aux_dos = [];
                }else{
                    cadena_aux_dos[0] = cadena_aux_uno[cadena_aux_uno.length-1];
                    cadena_aux_dos[1] = cadena_aux_uno[cadena_aux_uno.length-2];
                    cadena_aux_dos[2] = cadena_aux_uno[cadena_aux_uno.length-3];

                    tablas_codigo_intermedio.push({
                        data_objeto: cadena_aux_dos[2].token,
                        dato_fuente: cadena_aux_dos[1].token,
                        operacion: cadena_aux_dos[0].token
                    });
                    
                    cadena_aux_uno.pop();
                    cadena_aux_uno.pop();
                    cadena_aux_uno.pop();

                    //console.log("**");
                    //console.log(tablas_codigo_intermedio);
                    //console.log("**");

                    console.log(`tamaño cadena aux 1 : ${ cadena_aux_uno.length }`);

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

                break;
            }
            
        }
        cont_iteracion++;        
    }

    return tablas_codigo_intermedio;

};

module.exports = {
    generarCodigoIntermedio
};