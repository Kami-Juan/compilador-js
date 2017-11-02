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

                axios.post('http://localhost:3000/upload', data).then( res => {
                console.log(res.data);
                this.fileEntry =  res.data.datos;
                this.datos = this.fileEntry.toString().replace(/\,/g,"");

                if (res.data.resultado.erroresLexicos.length > 0 || res.data.res_sem.errores_semanticos.length > 0 || res.data.sintac.errores_sintacticos.length > 0) {
                    this.isError = true;
                    this.resultLexico = res.data.resultado.erroresLexicos;
                    this.resultSemantico = res.data.res_sem.errores_semanticos;
                    this.resultSintac = res.data.sintac.errores_sintacticos;
                } else {
                    this.isError = false;
                    this.resultLexico = res.data.resultado.tablaLexico;
                    this.resultSemantico = res.data.res_sem.exito_semantico;
                    this.resultSintac = res.data.sintac.exito_sintacticos;
                }
            });
        },
        onSubmitAnalisis(){
            let texto = document.getElementById('textarea1').value;    
            axios.post('http://localhost:3000/analizar', { texto: texto }).then( res => {
                console.log(res.data.resultado);   
                console.log(res.data.sintac);
                console.log(res.data.res_sem);
                
                if (res.data.resultado.erroresLexicos.length > 0 || res.data.res_sem.errores_semanticos.length > 0 || res.data.sintac.errores_sintacticos.length > 0){
                    this.isError = true;
                    this.resultLexico = res.data.resultado.erroresLexicos;
                    this.resultSemantico = res.data.res_sem.errores_semanticos;
                    this.resultSintac = res.data.sintac.errores_sintacticos;
                    this.resultLexemas = res.data.res_sem.array_lex;                
                }else{
                    this.isError = false;
                    this.resultLexico = res.data.resultado.tablaLexico;
                    this.resultSemantico = res.data.res_sem.exito_semantico;
                    this.resultSintac = res.data.sintac.exito_sintacticos;
                    this.resultLexemas = res.data.res_sem.array_lex;
                    
                }
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