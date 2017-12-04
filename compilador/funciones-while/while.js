let filas_while = [];
const _ = require('underscore');

let obtener_pos_while = ( tabla_lexico ) => {
    let pos_while = [];
    for( let x = 0; x < tabla_lexico.length; x++)
    {       
        if( tabla_lexico[x].identificador == "LLAVE_CERRAR"  && tabla_lexico[x+1].token == "while"){
            pos_while.push(x+3);
        }
    }
    return pos_while;
};

let obtener_final_while = ( pos_inicio_while, tabla_lexico  ) => {
    let pos_fin_while = "";
    for (let i = pos_inicio_while; i < tabla_lexico.length; i++) {
        if( tabla_lexico[i].identificador == "PARENTESIS_CERRAR" ){
            pos_fin_while = i;
            break;
        }   
    }
    return pos_fin_while;
};

let obtener_lineas_codigo_while = ( pos_inicio_while, pos_final_while, tabla_lexico ) => {
    let arreglo_fila = [];
    //arreglo_fila.push({ token: "%" });
    for( let x = pos_inicio_while; x < pos_final_while; x++  ){
        arreglo_fila.push(tabla_lexico[x]);
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

module.exports = {
    obtener_pos_while,
    obtener_final_while,
    obtener_lineas_codigo_while,
    filas_while,
    generarPostfijoWhile
};