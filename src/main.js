import api from './api';

class App{
    //contrutor
    constructor(){
        this.repositorios = [];

        //form
        this.formulario = document.querySelector('form');

        //lista
        this.lista= document.querySelector('.list-group');

        //Metodo para registrar os eventos do form
        this.registrarEventos();
    }

    registrarEventos(){
        this.formulario.onsubmit = evento => this.adicionarRepositorio(evento);
    }

    async adicionarRepositorio(evento){
        //evitar o recarregamento do formulario
        evento.preventDefault();

        //recuperar valor do input
        let input = this.formulario.querySelector('input[id=repositorio]').value;

        //se o input vier vazio sai da aplicação
        if(input.length === 0){
            return;
        }

        this.apresentarBuscando(input);

        try {
            let response = await api.get(`/repos/${input}`);

            //console.log(response);
            let{name,description,html_url,owner:{avatar_url}}=response.data;
            
            //adiciona o repositorio na lista
            this.repositorios.push({
                nome:name,
                descricao:description,
                avatar_url,
                link: html_url,
            });
    
            // renderizar a tela
            this.renderizarTela();
        } catch (error) {

            //Limpar erro existente
            this.lista.removeChild(document.querySelector('.list-group-item-warning'));

            //limpar erro existente
            let er = this.lista.querySelector('.list-group-item-danger');
            if(er !== null){
                this.lista.removeChild(er);
            }

            //li
            let li = document.createElement('li');
            li.setAttribute('class','list-group-item list-group-item-danger');
            let txtErro = document.createTextNode(`O repositório ${input} não existe.`);
            li.appendChild(txtErro);
            this.lista.appendChild(li);
        }  
    }

    apresentarBuscando(input){
        let li = document.createElement('li');
        li.setAttribute('class','list-group-item list-group-item-warning');
        let txtBuscando = document.createTextNode(`Aguarde, buscando o repositório ${input}...`);
        li.appendChild(txtBuscando);
        this.lista.appendChild(li);
    }

    renderizarTela(){
        //Limpar o documento de lista
        this.lista.innerHTML='';

        //Percorrer toda a lista de repositorios e criar os elementos
        this.repositorios.forEach(repositorio => {

            //<li>
            let li = document.createElement('li');
            li.setAttribute('class','list-group-item list-group-item-action');
            
            //<img>
            let img = document.createElement('img');
            img.setAttribute('src', repositorio.avatar_url);
            li.appendChild(img);

            //<strong>
            let strong = document.createElement('strong');
            let txtNome = document.createTextNode(repositorio.nome);
            strong.appendChild(txtNome);
            li.appendChild(strong);

            //<p>
            let p = document.createElement('p');
            let txtDescricao = document.createTextNode(repositorio.descricao);
            p.appendChild(txtDescricao);
            li.appendChild(p);

            //<a>
            let a = document.createElement('a');
            a.setAttribute('target','_blank');
            a.setAttribute('href',repositorio.link);
            let txtA = document.createTextNode('Acessar');
            a.appendChild(txtA);
            li.appendChild(a);

            //Adicionar <li> como filho da ul
            this.lista.appendChild(li);

            //lispar o conteudo do input
            this.formulario.querySelector('input[id=repositorio]').value = '';

            //adiciona o foco no input
            this.formulario.querySelector('input[id=repositorio]').focus();
        });
    }
}
new App();