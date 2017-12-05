const _ = require('underscore');
let { obtener_fin_exp, obtener_inicio_exp, obtener_lineas_codigo_do, obtener_pos_do, filas_do, obtener_final_do, set_post_do, obtener_inicio_exp_do, obtener_fin_exp_do, generarPostfijoDO, generarTablasDo } = require('./funciones-do/do');
let { obtener_final_while, obtener_lineas_codigo_while, obtener_pos_while, filas_while, generarPostfijoWhile, generarTablasWhile } = require('./funciones-while/while');

let codigos_infijo = [];
let codigos_posfijo = [];


let codigos_do = [];
let codigo_while = [];

let codigos_do_post = [];
let codigos_while_post = [];

let lineas_codigo_do_pos_inicio = [];
let lineas_codigo_do_pos_final = [];

let lineas_codigo = [];

let postfijo_do = [];
let postfijo_while = [];

let tablas_codigo_intermedio_do = [];
let tablas_finales_code_intermedio_do = [];

let tablas_codigo_intermedio_while = [];

let generarCodigoIntermedio = ( tabla_lexico, errores_semanticos ) =>
{   

        //console.log(tabla_lexico);
        let tabla_lex = _.clone(tabla_lexico);
        
        for( let y = 0; y < tabla_lex.length; y++ ){
            if( (tabla_lex[y].token == "+" && tabla_lex[y+1].token == 0) || (tabla_lex[y].token == "-" && tabla_lex[y+1].token == 0)){
                tabla_lex[y] = " ";
                tabla_lex[y+1] = " ";
            }
        }

        let tabla_lexico_optimizado = tabla_lex.filter( (e) => {
            return e !== " ";
        });

        //console.log( tabla_lex );
        

        //console.log(tabla_lexico_optimizado);


        let pos_do = obtener_pos_do( tabla_lexico_optimizado );
        let pos_while = obtener_pos_while( tabla_lexico_optimizado );
       
        
        let pos_final_do = [];
        for( let x = 0; x < pos_do.length; x++ )
        {
            pos_final_do.push(obtener_final_do( pos_do[x], tabla_lexico_optimizado ));
        }

        //console.log( `posiciones de inicio do: ${ pos_do }` );        
        //console.log( `posiciones de final do: ${ pos_final_do }` );        

        let pos_final_while = [];
        for( let z = 0; z < pos_while.length; z++ )
        {
            pos_final_while.push(obtener_final_while( pos_while[z], tabla_lexico_optimizado ));
        }

        //console.log( `posiciones de inicio while: ${ pos_while }` );        
        //console.log( `posiciones de final while: ${ pos_final_while }` );        
    
        /*----------------------------------------------------*/

        for( let y = 0; y < pos_do.length; y++ )
        {
            codigos_do.push(obtener_lineas_codigo_do( pos_do[y], pos_final_do[y], tabla_lexico_optimizado ));
        }

        //console.log(`Filas de los do por do existentes: `);
        //console.log(codigos_do);

        for( let w = 0; w < pos_while.length; w++ )
        {
            codigo_while.push( obtener_lineas_codigo_while( pos_while[w], pos_final_while[w], tabla_lexico_optimizado ) );
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

        for( let g = 0; g < lineas_codigo.length; g++ )
        {   
            let posfijo_lineas_do = [];
            for (let j = 0; j < lineas_codigo[g].length; j++)
            {                                  
                posfijo_lineas_do.push(generarPostfijoDO( lineas_codigo[g][j] ));                
            }
            postfijo_do.push(posfijo_lineas_do);
        }

        for( let g = 0; g < codigo_while.length; g++ )
        {   
            postfijo_while.push(generarPostfijoWhile( codigo_while[g] ));                
        }

        console.log(`CODIGOS POSFIJO`);
        console.log( postfijo_do[0] );
        //console.log(`CODIGOS POSFIJO WHILE`);
        //console.log( postfijo_while );

        /* -------------------------------------- */
        //CREAR TABLAS:


        for( let g = 0; g < postfijo_do.length; g++ )
        {   
            let tablas_codigo_intermedio_do_fila = [];        
            for (let j = 0; j < postfijo_do[g].length; j++)
            {
                tablas_codigo_intermedio_do_fila.push(generarTablasDo( postfijo_do[g][j] ));
            }
            tablas_codigo_intermedio_do.push(tablas_codigo_intermedio_do_fila);
        }    

        for( let x = 0; x < tablas_codigo_intermedio_do.length; x++ ){
            let tablas_finales_do = [];                
            for( let y = 0; y < tablas_codigo_intermedio_do[x].length; y++ ){
                for( let z = 0; z < tablas_codigo_intermedio_do[x][y].length; z++ ){
                    tablas_finales_do.push(tablas_codigo_intermedio_do[x][y][z]);
                }
            }
            tablas_finales_code_intermedio_do.push(tablas_finales_do);
        }

        // console.log("TABLAS FINALES DO: ");
        // console.log(tablas_finales_code_intermedio_do);
        // console.log("-------------------");        

        for( let r = 0; r <  postfijo_while.length; r++){
            tablas_codigo_intermedio_while.push( generarTablasWhile( postfijo_while[r] , codigo_while[r].length) );
        }

        // console.log("TABLAS FINALES WHILE"); 
        // console.log(tablas_codigo_intermedio_while);
        // console.log("-------------------"); 

        tabla_lexico_optimizado = [];

        return {
            tablas_finales_code_intermedio_do,
            tablas_codigo_intermedio_while
        };
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


let limpiarTablasCodigoIntermedio = () =>{
    tablas_finales_code_intermedio_do = [];
    tablas_codigo_intermedio_do= [];
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
    tablas_codigo_intermedio_while = [];
    
};

module.exports = {
    generarCodigoIntermedio,
    limpiarTablasCodigoIntermedio
};