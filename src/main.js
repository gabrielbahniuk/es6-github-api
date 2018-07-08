import api from './api';

class App {
    constructor() {
        this.repositories = [];
        this.form = document.getElementById('form');
        this.listEl = document.getElementById('repo-list');
        this.inputEl = document.querySelector('[name="repository"]'); 
        this.registerHandlers();
    }

    registerHandlers() {
        this.form.onsubmit = event => this.addRepository(event);
    }    
    
    setLoading(loading = true) {
        if (loading === true) {
            let loadingEl = document.createElement('span');
            loadingEl.appendChild(document.createTextNode('Loading...'));
            loadingEl.setAttribute('id', 'loading');
            this.form.appendChild(loadingEl);
            return;
        } 
        document.getElementById('loading').remove();        
    }

    async addRepository(event) {
        event.preventDefault();
        
        try {
            const repoInput = this.inputEl.value;
            if (repoInput.length === 0)
                return;
            this.setLoading();
            const response = await api.get(`/repos/${repoInput}`);
            const {name, description, html_url, owner : { avatar_url } } = response.data;        

            this.repositories.push({
                name, description, avatar_url, html_url
            });   
            this.render();              
        } catch (err) {
            alert('Repository does not exist');
        }        
        this.setLoading(false);   
        this.inputEl.value = '';             
    }

    render() {
        this.listEl.innerHTML = '';

        this.repositories.forEach(repo => {
            
            let imgEl = document.createElement('img');            
            
            imgEl.setAttribute('src', repo.avatar_url);            

            let titleEl = document.createElement('strong');
            titleEl.appendChild(document.createTextNode(repo.name));

            let descriptionEl = document.createElement('p');
            descriptionEl.appendChild(document.createTextNode(repo.description));

            let imagem = document.createElement('img');
            imagem.src = './img/keyboard-right-arrow-button.png';        

            let divText = document.createElement('div');
            divText.classList.add('w-25');
            divText.appendChild(titleEl);
            divText.appendChild(descriptionEl);

            let linkEl = document.createElement('a');                        
            linkEl.setAttribute('target', '_blank');
            linkEl.setAttribute('href', repo.html_url);   
            linkEl.appendChild(imagem);

            let listItem = document.createElement('li');            
            listItem.appendChild(imgEl);
            listItem.appendChild(divText);            
            listItem.appendChild(linkEl);
            listItem.classList.add('list-group-item');
            this.listEl.appendChild(listItem);
        });
    }
}

new App();