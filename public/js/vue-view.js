new Vue({
    el: "#app",
    data: {
        isError: false,
        
        time: moment().format('LTS'),
        date: moment().format('l'),
        resultLexico: '',
        resultSemantico: '',
        resultSintac: '',
        resultLexemas: '',
        result_tablas_codigo_intermedio: '',
        fileEntry: '',
        datos: ''
    },
    delimiters: ['${', '}'],
    methods: {
        onSubmit(){
            let data = new FormData();
            let file = document.getElementById('file').files[0];
            data.append('entrada', file);
            if( !file  ){
                alert("Por favor introduce un dato");
                return;
            }

            /* http://compiladorjsitm.herokuapp.com/ 
               https://compiladorjsitm.herokuapp.com
               http://localhost:3000/
            */
            axios.post('https://compiladorjsitm.herokuapp.com/upload', data).then( res => {
                console.log(res.data);
                this.fileEntry =  res.data.datos;
                this.datos = this.fileEntry.toString().replace(/\,/g,"");

                if (res.data.resultado.erroresLexicos.length > 0 || res.data.res_sem.errores_semanticos.length > 0 ) {
                    this.isError = true;
                    this.resultLexico = res.data.resultado.erroresLexicos;
                    this.resultSemantico = res.data.res_sem.errores_semanticos;
                    this.resultSintac = res.data.sintac.errores_sintacticos;
                    this.resultLexemas = res.data.res_sem.array_lex;
                    this.result_tablas_codigo_intermedio =  res.data.codigo_intermedio;
                    if( $('.tabla_codigo_intermedio') ){
                        $('.tabla_codigo_intermedio').remove();
                        $('.titulo_tab_').remove();
                        this.imprimircodigointermedio(this.result_tablas_codigo_intermedio);
                    }else{
                        this.imprimircodigointermedio(this.result_tablas_codigo_intermedio);                     
                    }
                } else {
                    this.isError = false;
                    this.resultLexico = res.data.resultado.tablaLexico;
                    this.resultSemantico = res.data.res_sem.exito_semantico;
                    this.resultSintac = res.data.sintac.exito_sintacticos;
                    this.resultLexemas = res.data.res_sem.array_lex;
                    this.result_tablas_codigo_intermedio =  res.data.codigo_intermedio;
                    if( $('.tabla_codigo_intermedio') ){
                        $('.tabla_codigo_intermedio').remove();
                        $('.titulo_tab_').remove();
                        this.imprimircodigointermedio(this.result_tablas_codigo_intermedio);
                    }else{
                        this.imprimircodigointermedio(this.result_tablas_codigo_intermedio);                     
                    }
                }
            });
        },

        /* https://compiladorjsitm.herokuapp.com/ 
           http://localhost:3000/ 
        */
        onSubmitAnalisis(){
            let texto = document.getElementById('textarea1').value;    
            axios.post('https://compiladorjsitm.herokuapp.com//analizar', { texto: texto }).then( res => {
                //console.log(res.data.resultado);   
                //console.log(res.data.sintac);
                //console.log(res.data.res_sem);
                //console.log( res.data.codigo_intermedio );
                if (res.data.resultado.erroresLexicos.length > 0 || res.data.res_sem.errores_semanticos.length > 0 ){
                    this.isError = true;
                    this.resultLexico = res.data.resultado.erroresLexicos;
                    this.resultSemantico = res.data.res_sem.errores_semanticos;
                    this.resultSintac = res.data.sintac.errores_sintacticos;
                    this.resultLexemas = res.data.res_sem.array_lex;
                    this.result_tablas_codigo_intermedio =  res.data.codigo_intermedio;
                    if( $('.tabla_codigo_intermedio') ){
                        $('.tabla_codigo_intermedio').remove();
                        $('.titulo_tab_').remove();
                        this.imprimircodigointermedio(this.result_tablas_codigo_intermedio);
                    }else{
                        this.imprimircodigointermedio(this.result_tablas_codigo_intermedio);                     
                    }           
                }else{
                    this.isError = false;
                    this.resultLexico = res.data.resultado.tablaLexico;
                    this.resultSemantico = res.data.res_sem.exito_semantico;
                    this.resultSintac = res.data.sintac.exito_sintacticos;
                    this.resultLexemas = res.data.res_sem.array_lex;
                    this.result_tablas_codigo_intermedio =  res.data.codigo_intermedio;
                    if( $('.tabla_codigo_intermedio') ){
                        $('.tabla_codigo_intermedio').remove();
                        $('.titulo_tab_').remove();
                        this.imprimircodigointermedio(this.result_tablas_codigo_intermedio);
                    }else{
                        this.imprimircodigointermedio(this.result_tablas_codigo_intermedio);                     
                    }
                }
            });

        },
        imprimircodigointermedio( codigos ){
            var contador_filas = [];

            codigos.tablas_finales_code_intermedio_do.forEach( (e,i) => {
                $('#codigo_intermedio').append('<h1 class="titulo_tab_">TABLA CODIGO INTERMEDIO'+(i+1)+'</h1><table class="tabla_codigo_intermedio" ><thead><th>FILA</th><th>DATO OBJETO</th><th>DATO FUENTE</th><th>OPERACION</th></thead><tbody id="'+(i+1)+'"></tbody></table>');
                e.forEach( (a,index) => {
                    $('#'+(i+1)).append('<tr><th>'+(index+1)+'</th><th>'+a.data_objeto+'</th><th>'+a.dato_fuente+'</th><th>'+a.operacion+'</th></tr>');
                });
            });
            
            codigos.tablas_finales_code_intermedio_do.forEach( (e,i) => {
                console.log(i);
                contador_filas.push(document.getElementById((i+1)).rows.length+1);
            });

            codigos.tablas_codigo_intermedio_while.forEach( (e,i) => {
                $('#codigo_while').append('<h1 class="titulo_tab_">TABLA CODIGO INTERMEDIO WHILE'+(i+1)+'</h1><table class="tabla"><thead><th>DATO OBJETO</th><th>DATO FUENTE</th><th>OPERACION</th></thead><tbody id="'+(i+1)+'"></tbody></table>');
                e.forEach( (a,index) => {
                    $('#'+(i+1)).append('<tr><th>'+(contador_filas[i]+index)+'</th><th>'+a.data_objeto+'</th><th>'+a.dato_fuente+'</th><th>'+a.operacion+'</th></tr>');
                });
            });

        }    
    },
    mounted: function() {
        setInterval(()=>{
            this.time = moment().format('LTS');
            this.date = moment().format('l');
        },1000);
}
});