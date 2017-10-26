new Vue({
    el: "#app",
    data: {
        isError: false,
        time: moment().format('LTS'),
        date: moment().format('l'),
        resultLexico: '',
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

                if(res.data.resultado.erroresLexicos.length > 0){
                    this.isError = true;
                    this.resultLexico = res.data.resultado.erroresLexicos;
                
                }else{
                    this.isError = false;
                    this.resultLexico = res.data.resultado.tablaLexico;                               
                }
            });
        },
        onSubmitAnalisis(){
            let texto = document.getElementById('textarea1').value;    
            axios.post('http://localhost:3000/analizar', { texto: texto }).then( res => {
                console.log(res.data.resultado);   
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