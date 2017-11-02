const _ = require("underscore");
/*
     VN/VT| =  |-   |+   |*   |/   |id  |cte  |(   |)   |int  |float |$
     -----|---------------------------------------------------------------
		Z |    |    |    |    |    |S    |    |    |    |R    |R     |
		E |    |    |    |    |    |Ae   |Ae  |Ae  |    |     |      |
        e |=Ae |    |    |    |    |     |    |    |Ɛ   |     |      |Ɛ
        A |    |    |    |    |    |Ba   |Ba  |Ba  |    |     |      |
        a |Ɛ   |-Ba |    |    |    |     |    |    |Ɛ   |     |      |Ɛ
        B |    |    |    |    |    |Cb   |Cb  |Cb  |    |     |      |
        b |Ɛ   |Ɛ   |+Cb |    |    |     |    |    |Ɛ   |     |      |Ɛ
        C |    |    |    |    |    |Dc   |Dc  |Dc  |    |     |      |
        c |Ɛ   |Ɛ   |Ɛ   |*Dc |    |     |    |    |Ɛ   |     |      |Ɛ
        D |    |    |    |    |    |Fd   |Fd  |Fd  |    |     |      |
        d |Ɛ   |Ɛ   |Ɛ   |Ɛ   |/Fd |     |    |    |Ɛ   |     |      |Ɛ
        F |    |    |    |    |    |id   |cte |(E) |    |     |      |
        S |    |    |    |    |    |ide  |    |    |    |     |      |
        R |    |    |    |    |    |     |    |    |    |int  |float |


*/

let errores_sintacticos = [];
let exito_sintacticos = [];

const tabla_sintactica =
    [      /*  =    |-      |+      |*      |/     |id    |cte    |(     |)  |wr    |$ */
      /*Z*/["",     "",     "",     "",     "",    "S",   "",     "",    "", "RE",   ""  ],
      /*E*/["",     "",     "",     "",     "",    "Ae",  "Ae",   "Ae",  "",  "",    ""  ],
      /*e*/["=Ae",  "",     "",     "",     "",    "",    "",     "",    "Ɛ", "",    "Ɛ" ],
      /*A*/["",     "",     "",     "",     "",    "Ba",  "Ba",   "Ba",  "",  "",    ""  ],
      /*a*/["Ɛ",    "-Ba",  "",     "",     "",    "",    "",     "",    "Ɛ", "",    "Ɛ" ],
      /*B*/["",     "",     "",     "",     "",    "Cb",  "Cb",   "Cb",  "",  "",    ""  ],
      /*b*/["Ɛ",    "Ɛ",    "+Cb",  "",     "",    "",    "",     "",    "Ɛ", "",    "Ɛ" ],
      /*C*/["",     "",     "",     "",     "",    "Dc",  "Dc",   "Dc",  "",  "",    ""  ],
      /*c*/["Ɛ",    "Ɛ",    "Ɛ",    "*Dc",  "",    "",    "",     "",    "Ɛ", "",    "Ɛ" ],
      /*D*/["",     "",     "",     "",     "",    "Fd",  "Fd",   "Fd",  "",  "",    ""  ],
      /*d*/["Ɛ",    "Ɛ",    "Ɛ",    "Ɛ",    "/Fd", "",    "",     "",    "Ɛ", "",    "Ɛ" ],
      /*F*/["",     "",     "",     "",     "",    "id",  "cte",  "(E)", "",  "",    ""  ],
      /*S*/["",     "",     "",     "",     "",    "ide", "",     "",    "",  "",    ""  ],
      /*R*/["",     "",     "",     "",     "",    "",    "",     "",    "",  "wr",  ""  ],
    ];

    let analizadorSintactico = ( lex, errores,fila ) => 
    {
        
        var cont = 0;
        var pila = ["PUNTOYCOMA","Z"];   
        if( errores.length > 0 )
        {
            errores_sintacticos.push({
                mensaje_error: `hay errores en el léxico, por favor repárelos primero: ${(fila+1)}`, 
                fila_error: `${(fila+1)}`,
                token_error: null
            });           
        }else
        {   
            if( lex.length == 0)
            {
               pila.pop();
               pila.pop();
            }
            else if( ( lex[0] == "PALABRA_RESERVADA" || lex[0] == "IDENTIFICADOR" ) && lex[lex.length-1] == "PUNTOYCOMA")
            {
                /* console.log(lex); */
                while( pila.length !== 0 && lex.length !== 0)
                {
                    if( lex[0] == "PALABRA_RESERVADA" )
                    {
                        if( pila[pila.length-1] == "Z" )
                        {
                            pila.pop();
                            pila.push("E");
                            pila.push("R");
                            if( pila[pila.length-1] == "R" )
                            {
                                pila.pop();
                                pila.push("wr");
                                if( pila[pila.length-1] == "wr" )
                                {
                                    pila.pop();
                                    lex.shift();
                                }
                            }
                        }
                        
                    }
                    else if( lex[0] == "IDENTIFICADOR" )
                    {
                        if( pila[pila.length-1] == "Z" )
                        {
                            pila.pop();
                            pila.push("S");
                            if( pila[pila.length-1] == "S" )
                            {
                                pila.pop();
                                pila.push("E");
                                if( pila[pila.length-1] == "E" )
                                {
                                    pila.pop();
                                    pila.push("e");
                                    pila.push("A");
                                    if( pila[pila.length-1] == "A" )
                                    {
                                        pila.pop();
                                        pila.push("a");
                                        pila.push("B");
                                        if( pila[pila.length-1] == "B" )
                                        {
                                            pila.pop();
                                            pila.push("b");
                                            pila.push("C");
                                            if( pila[pila.length-1] == "C" )
                                            {
                                                pila.pop();
                                                pila.push("c");
                                                pila.push("D");
                                                if ( pila[pila.length-1] == "D" )
                                                {
                                                    pila.pop();
                                                    pila.push("d");
                                                    pila.push("F");
                                                    if( pila[pila.length-1] == "F" )
                                                    {
                                                        pila.pop();
                                                        pila.push("id");
                                                        if ( pila[pila.length-1] == "id" )
                                                        {
                                                            pila.pop();
                                                            lex.shift();
                                                        }
                                                    }
                                                }
                                            } 
                                        }
                                    }
                                }
                            }
                        }
                        if( pila[pila.length-1] == "E" )
                        {
                            pila.pop();
                            pila.push("e");
                            pila.push("A");
                            if( pila[pila.length-1] == "A" )
                            {
                                pila.pop();
                                pila.push("a");
                                pila.push("B");
                                if( pila[pila.length-1] == "B" )
                                {
                                    pila.pop();
                                    pila.push("b");
                                    pila.push("C");
                                    if( pila[pila.length-1] == "C" )
                                    {
                                        pila.pop();
                                        pila.push("c");
                                        pila.push("D");
                                        if ( pila[pila.length-1] == "D" )
                                        {
                                            pila.pop();
                                            pila.push("d");
                                            pila.push("F");
                                            if( pila[pila.length-1] == "F" )
                                            {
                                                pila.pop();
                                                pila.push("id");
                                                if ( pila[pila.length-1] == "id" )
                                                {
                                                    pila.pop();
                                                    lex.shift();
                                                }
                                            }
                                        }
                                    } 
                                }
                            }
                        }
                        if( pila[pila.length-1] == "A" )
                        {
                            pila.pop();
                            pila.push("a");
                            pila.push("B");
                            if( pila[pila.length-1] == "B" )
                            {
                                pila.pop();
                                pila.push("b");
                                pila.push("C");
                                if( pila[pila.length-1] == "C" )
                                {
                                    pila.pop();
                                    pila.push("c");
                                    pila.push("D");
                                    if ( pila[pila.length-1] == "D" )
                                    {
                                        pila.pop();
                                        pila.push("d");
                                        pila.push("F");
                                        if( pila[pila.length-1] == "F" )
                                        {
                                            pila.pop();
                                            pila.push("id");
                                            if ( pila[pila.length-1] == "id" )
                                            {
                                                pila.pop();
                                                lex.shift();
                                            }
                                        }
                                    }
                                } 
                            }
                        }
                        if( pila[pila.length-1] == "B" )
                        {
                            pila.pop();
                            pila.push("b");
                            pila.push("C");
                            if( pila[pila.length-1] == "C" )
                            {
                                pila.pop();
                                pila.push("c");
                                pila.push("D");
                                if ( pila[pila.length-1] == "D" )
                                {
                                    pila.pop();
                                    pila.push("d");
                                    pila.push("F");
                                    if( pila[pila.length-1] == "F" )
                                    {
                                        pila.pop();
                                        pila.push("id");
                                        if ( pila[pila.length-1] == "id" )
                                        {
                                            pila.pop();
                                            lex.shift();
                                        }
                                    }
                                }
                            }
                        }
                        if( pila[pila.length-1] == "C" )
                        {
                            pila.pop();
                            pila.push("c");
                            pila.push("D");
                            if ( pila[pila.length-1] == "D" )
                            {
                                pila.pop();
                                pila.push("d");
                                pila.push("F");
                                if( pila[pila.length-1] == "F" )
                                {
                                    pila.pop();
                                    pila.push("id");
                                    if ( pila[pila.length-1] == "id" )
                                    {
                                        pila.pop();
                                        lex.shift();
                                    }
                                }
                            }
                        }
                        if( pila[pila.length-1] == "D" )
                        {
                            pila.pop();
                            pila.push("d");
                            pila.push("F");
                            if( pila[pila.length-1] == "F" )
                            {
                                pila.pop();
                                pila.push("id");
                                if ( pila[pila.length-1] == "id" )
                                {
                                    pila.pop();
                                    lex.shift();
                                }
                            }
                        }
                        if( pila[pila.length-1] == "F" )
                        {
                            pila.pop();
                            pila.push("id");
                            if ( pila[pila.length-1] == "id" )
                            {
                                pila.pop();
                                lex.shift();
                            }
                        }
                    }
                    else if( lex[0] == "CONSTANTE" )
                    {
                        if( pila[pila.length-1] == "E" )
                        {
                            pila.pop();
                            pila.push("e");
                            pila.push("A");
                            if( pila[pila.length-1] == "A" )
                            {
                                pila.pop();
                                pila.push("a");
                                pila.push("B");
                                if( pila[pila.length-1] == "B" )
                                {
                                    pila.pop();
                                    pila.push("b");
                                    pila.push("C");
                                    if( pila[pila.length-1] == "C" )
                                    {
                                        pila.pop();
                                        pila.push("c");
                                        pila.push("D");
                                        if ( pila[pila.length-1] == "D" )
                                        {
                                            pila.pop();
                                            pila.push("d");
                                            pila.push("F");
                                            if( pila[pila.length-1] == "F" )
                                            {
                                                pila.pop();
                                                pila.push("cte");
                                                if ( pila[pila.length-1] == "cte" )
                                                {
                                                    pila.pop();
                                                    lex.shift();
                                                }
                                            }
                                        }
                                    } 
                                }
                            }
                        }
                        if( pila[pila.length-1] == "A" )
                        {
                            pila.pop();
                            pila.push("a");
                            pila.push("B");
                            if( pila[pila.length-1] == "B" )
                            {
                                pila.pop();
                                pila.push("b");
                                pila.push("C");
                                if( pila[pila.length-1] == "C" )
                                {
                                    pila.pop();
                                    pila.push("c");
                                    pila.push("D");
                                    if ( pila[pila.length-1] == "D" )
                                    {
                                        pila.pop();
                                        pila.push("d");
                                        pila.push("F");
                                        if( pila[pila.length-1] == "F" )
                                        {
                                            pila.pop();
                                            pila.push("cte");
                                            if ( pila[pila.length-1] == "cte" )
                                            {
                                                pila.pop();
                                                lex.shift();
                                            }
                                        }
                                    }
                                } 
                            }
                        }
                        if( pila[pila.length-1] == "B" )
                        {
                            pila.pop();
                            pila.push("b");
                            pila.push("C");
                            if( pila[pila.length-1] == "C" )
                            {
                                pila.pop();
                                pila.push("c");
                                pila.push("D");
                                if ( pila[pila.length-1] == "D" )
                                {
                                    pila.pop();
                                    pila.push("d");
                                    pila.push("F");
                                    if( pila[pila.length-1] == "F" )
                                    {
                                        pila.pop();
                                        pila.push("cte");
                                        if ( pila[pila.length-1] == "cte" )
                                        {
                                            pila.pop();
                                            lex.shift();
                                        }
                                    }
                                }
                            }
                        }
                        if( pila[pila.length-1] == "C" )
                        {
                            pila.pop();
                            pila.push("c");
                            pila.push("D");
                            if ( pila[pila.length-1] == "D" )
                            {
                                pila.pop();
                                pila.push("d");
                                pila.push("F");
                                if( pila[pila.length-1] == "F" )
                                {
                                    pila.pop();
                                    pila.push("cte");
                                    if ( pila[pila.length-1] == "cte" )
                                    {
                                        pila.pop();
                                        lex.shift();
                                    }
                                }
                            }
                        }
                        if( pila[pila.length-1] == "D" )
                        {
                            pila.pop();
                            pila.push("d");
                            pila.push("F");
                            if( pila[pila.length-1] == "F" )
                            {
                                pila.pop();
                                pila.push("cte");
                                if ( pila[pila.length-1] == "cte" )
                                {
                                    pila.pop();
                                    lex.shift();
                                }
                            }
                        }
                        if( pila[pila.length-1] == "F" )
                        {
                            pila.pop();
                            pila.push("cte");
                            if ( pila[pila.length-1] == "cte" )
                            {
                                pila.pop();
                                lex.shift();
                            }
                        }
                    }
                    else if( lex[0] == "PARENTESIS_APERTURA" )
                    {
                        if( pila[pila.length-1] == "E" )
                        {
                            pila.pop();
                            pila.push("e");
                            pila.push("A");
                            if( pila[pila.length-1] == "A" )
                            {
                                pila.pop();
                                pila.push("a");
                                pila.push("B");
                                if( pila[pila.length-1] == "B" )
                                {
                                    pila.pop();
                                    pila.push("b");
                                    pila.push("C");
                                    if( pila[pila.length-1] == "C" )
                                    {
                                        pila.pop();
                                        pila.push("c");
                                        pila.push("D");
                                        if ( pila[pila.length-1] == "D" )
                                        {
                                            pila.pop();
                                            pila.push("d");
                                            pila.push("F");
                                            if( pila[pila.length-1] == "F" )
                                            {
                                                pila.pop();
                                                pila.push(")");
                                                pila.push("E");
                                                pila.push("(");
                                                if ( pila[pila.length-1] == "(" )
                                                {
                                                    pila.pop();
                                                    lex.shift();
                                                }
                                            }
                                        }
                                    } 
                                }
                            }
                        }
                        if( pila[pila.length-1] == "A" )
                        {
                            pila.pop();
                            pila.push("a");
                            pila.push("B");
                            if( pila[pila.length-1] == "B" )
                            {
                                pila.pop();
                                pila.push("b");
                                pila.push("C");
                                if( pila[pila.length-1] == "C" )
                                {
                                    pila.pop();
                                    pila.push("c");
                                    pila.push("D");
                                    if ( pila[pila.length-1] == "D" )
                                    {
                                        pila.pop();
                                        pila.push("d");
                                        pila.push("F");
                                        if( pila[pila.length-1] == "F" )
                                        {
                                            pila.pop();
                                            pila.push(")");
                                            pila.push("E");
                                            pila.push("(");
                                            if ( pila[pila.length-1] == "(" )
                                            {
                                                pila.pop();
                                                lex.shift();
                                            }
                                        }
                                    }
                                } 
                            }
                        }
                        if( pila[pila.length-1] == "B" )
                        {
                            pila.pop();
                            pila.push("b");
                            pila.push("C");
                            if( pila[pila.length-1] == "C" )
                            {
                                pila.pop();
                                pila.push("c");
                                pila.push("D");
                                if ( pila[pila.length-1] == "D" )
                                {
                                    pila.pop();
                                    pila.push("d");
                                    pila.push("F");
                                    if( pila[pila.length-1] == "F" )
                                    {
                                        pila.pop();
                                        pila.push(")");
                                        pila.push("E");
                                        pila.push("(");
                                        if ( pila[pila.length-1] == "(" )
                                        {
                                            pila.pop();
                                            lex.shift();
                                        }
                                    }
                                }
                            }
                        }
                        if( pila[pila.length-1] == "C" )
                        {
                            pila.pop();
                            pila.push("c");
                            pila.push("D");
                            if ( pila[pila.length-1] == "D" )
                            {
                                pila.pop();
                                pila.push("d");
                                pila.push("F");
                                if( pila[pila.length-1] == "F" )
                                {
                                    pila.pop();
                                    pila.push(")");
                                    pila.push("E");
                                    pila.push("(");
                                    if ( pila[pila.length-1] == "(" )
                                    {
                                        pila.pop();
                                        lex.shift();
                                    }
                                }
                            }
                        }
                        if( pila[pila.length-1] == "D" )
                        {
                            pila.pop();
                            pila.push("d");
                            pila.push("F");
                            if( pila[pila.length-1] == "F" )
                            {
                                pila.pop();
                                pila.push(")");
                                pila.push("E");
                                pila.push("(");
                                if ( pila[pila.length-1] == "(" )
                                {
                                    pila.pop();
                                    lex.shift();
                                }
                            }
                        }
                        if( pila[pila.length-1] == "F" )
                        {
                            pila.pop();
                            pila.push(")");
                            pila.push("E");
                            pila.push("(");
                            if ( pila[pila.length-1] == "(" )
                            {
                                pila.pop();
                                lex.shift();
                            }
                        }
                    }
                    else if( lex[0] == "SUMA" )
                    {   /* +Cb */
                        if( pila[pila.length-1] == "b" )
                        {
                            pila.pop();
                            pila.push("b");
                            pila.push("C");
                            pila.push("+");
                            if( pila[pila.length-1] == "+" )
                            {
                                pila.pop();
                                lex.shift();
                            }
                        }
                        else
                        {
                            if( pila[pila.length-1] == "d" )
                            {
                                pila.pop();
                            }
                            else if( pila[pila.length-1] == "c" )
                            {
                                pila.pop();
                            }   
                        }
                    }
                    else if( lex[0] == "RESTA" )
                    {   /* -Ba */
                        if ( pila[pila.length-1] == "a" )
                        {
                            pila.pop();
                            pila.push("a");
                            pila.push("B");
                            pila.push("-");
                            if( pila[pila.length-1] == "-")
                            {
                                pila.pop();
                                lex.shift();
                            }
                        }else{
                            if( pila[pila.length-1] == "b" )
                            {
                                pila.pop();
                            }
                            else if( pila[pila.length-1] == "c" )
                            {
                                pila.pop();
                            }
                            else if( pila[pila.length-1] == "d" )
                            {
                                pila.pop();
                            }
                        }
                    }
                    else if( lex[0] == "MULTIPLICACION" )
                    {   /* *Dc */
                        if( pila[pila.length-1] == "c" )
                        {
                            pila.pop();
                            pila.push("c");
                            pila.push("D");
                            pila.push("*");
                            if( pila[pila.length-1] == "*")
                            {
                                pila.pop();
                                lex.shift();
                            }
                        }else{
                            if( pila[pila.length-1] == "d" )
                            {
                                pila.pop();
                            }
                        }
                    }
                    else if( lex[0] == "DIVISION")
                    {   /* /Fd */
                        if( pila[pila.length-1] == "d" )
                        {
                            pila.pop();
                            pila.push("d");
                            pila.push("F");
                            pila.push("/");
                            if( pila[pila.length-1] == "/" )
                            {
                                pila.pop();
                                lex.shift();
                            }
                        }
                    }
                    else if( lex[0] == "IGUALACION" )
                    {   /* =Ae */
                        if( pila[pila.length-1] == "e" )
                        {
                            pila.pop();
                            pila.push("e");
                            pila.push("A");
                            pila.push("=");
                            if( pila[pila.length-1] == "=" ){
                                pila.pop();
                                lex.shift();
                            }
                        }else{
                            if( pila[pila.length-1] == "a" )
                            {
                                pila.pop();
                            }
                            else if( pila[pila.length-1] == "b" )
                            {
                                pila.pop();
                            }
                            else if( pila[pila.length-1] == "c" )
                            {
                                pila.pop();
                            }
                            else if( pila[pila.length-1] == "d" )
                            {
                                pila.pop();
                            }
                        }
                    }
                    else if( lex[0] == "PARENTESIS_CERRAR" )
                    {
                        if( pila[pila.length-1] == ")")
                        {
                            pila.pop();
                            lex.shift();
                        }else{
                            if( pila[pila.length-1] == "a" )
                            {
                                pila.pop();
                            }
                            else if( pila[pila.length-1] == "b" )
                            {
                                pila.pop();
                            }
                            else if( pila[pila.length-1] == "c" )
                            {
                                pila.pop();
                            }
                            else if( pila[pila.length-1] == "d" )
                            {
                                pila.pop();
                            }
                            else if( pila[pila.length-1] == "e" )
                            {
                                pila.pop();
                            }
                        }
                    }
                    else if( lex[0] == "PUNTOYCOMA" )
                    {
                        if( pila[pila.length-1] == "PUNTOYCOMA")
                        {
                            pila.pop();
                            lex.shift();
                            /* if( lex.length > 0 )
                            {
                                pila.push("PUNTOYCOMA");
                                pila.push("Z");
                            } */
                        }else{
                            if( pila[pila.length-1] == "a" )
                            {
                                pila.pop();
                            }
                            else if( pila[pila.length-1] == "b" )
                            {
                                pila.pop();
                            }
                            else if( pila[pila.length-1] == "c" )
                            {
                                pila.pop();
                            }
                            else if( pila[pila.length-1] == "d" )
                            {
                                pila.pop();
                            }
                            else if( pila[pila.length-1] == "e" )
                            {
                                pila.pop();
                            }
                        }
                    }
                    else if( lex[0] == "PUNTO" )
                    {                      
                        break;
                    }

                    cont = cont + 1;		
                    
                    if(cont > 100)
                    {
                        break;
                    }
                }
                /* console.log(pila);
                console.log(lex); */
                //console.log(fila);
                if( pila.length == 0 && lex.length == 0 )
                { 
                    //console.log(`Exito en la fila ${(fila+1)}`);
                    exito_sintacticos.push({
                        mensaje: `Exito en la fila ${(fila+1)}`,
                        fila_exito: `${(fila+1)}`
                    });
                }else if( pila.length > 0 )
                {
                    errores_sintacticos.push({
                        mensaje_error: `La sintaxis es incorrecta: ${(fila+1)} en ${ lex[0]}`, 
                        fila_error: `${(fila+1)}`,
                        token_error: `${ lex[0]}`
                    });
                    //console.log(`La sintaxis es incorrecta: fila ${(fila+1)}, token ${ lex[0]}`);
                }else if(cont > 100)
                {		
                    resultado.push("Es inválida la frase. Prueba con otra :D");
                }

            }else
            {
                //console.log(`Debe iniciar con palabra reservada o identificador: fila ${(fila+1)}, token ${lex[0]}`);
                errores_sintacticos.push({
                    mensaje_error: `Debe iniciar con palabra reservada o identificador: fila ${(fila+1)}, token ${lex[0]}`, 
                    fila_error: `${(fila+1)}`,
                    token_error: `${ lex[0]}`
                });
            }
            
        }
        if( errores_sintacticos.length > 1 )
        {
            errores_sintacticos = errores_sintacticos.filter((x)=>
            {
                return x.fila_error !== "NaN";
            });
            //errores_sintacticos = [];
            //console.log(ex);
        }
        if( exito_sintacticos.length > 1 )
        {
            exito_sintacticos = exito_sintacticos.filter((z) =>
            {
                return z.fila_exito !== "NaN"
            });
            //console.log(fx)
        }

        return {
            errores_sintacticos,
            exito_sintacticos
        }
    };
    
    let cleanTablaSintac = () => {
        errores_sintacticos = [];
        exito_sintacticos = [];
    }

    module.exports = { analizadorSintactico, cleanTablaSintac };
