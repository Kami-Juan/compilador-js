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

    let analizadorSintactico = ( lex, errores ) => 
    {
        var cont = 0;
        if( errores.length > 0 )
        {
            console.log("hay errores en el léxico, por favor repárelos primero.");            
        }else
        {
            if( ( lex[0] == "PALABRA_RESERVADA" || lex[0] == "IDENTIFICADOR" ) && lex[lex.length-1] == "PUNTOYCOMA" )
            {
                /* console.log(lex); */
                var pila = ["PUNTOYCOMA","Z"];
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
                            if( lex.length > 0 )
                            {
                                pila.push("PUNTOYCOMA");
                                pila.push("Z");
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
                            else if( pila[pila.length-1] == "e" )
                            {
                                pila.pop();
                            }
                        }
                    }
                    else if( lex[0] == "PUNTO" )
                    {
                        console.log("La sintaxis es incorrecta");                        
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
                if( pila.length == 0 && lex.length == 0 )
                { 
                    console.log("Exito!!!");
                }else if( pila.length > 0 )
                {
                    console.log("La sintaxis es incorrecta");
                }else if(cont > 100)
                {		
                    resultado.push("Es inválida la frase. Prueba con otra :D");
                }

            }else
            {
                console.log("Debe iniciar con palabra reservada o identificador");
            }
        }
    };  

    module.exports = {analizadorSintactico};
