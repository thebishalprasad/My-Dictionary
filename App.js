
const primaryBtn = document.querySelector('[data-primary-btn]');

const input = document.querySelector('[data-input]');
const searchBtn = document.querySelector('[data-search-btn]');


let searchData = [];
searchBtn.addEventListener('click', () => {
    
    if(input.value.trim() === ''){
        createNotification('Please enter a word');
        return;
    }
    
    const word = input.value.trim().split(' ')[0].toLowerCase();
    input.value = '';
    
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    
    fetchData(url);
    

})

function fetchData(url){
    fetch(url)
    .then(res => res.json())
    .then(data => {
        //check if the word is not found
        if(data.title === 'No Definitions Found'){
            createNotification('Word not found');
            return;
        }
        let definition = data[0].meanings[0].definitions[0].definition;
        let word = data[0].word;
        console.log(definition);
        console.log(word);
        
        searchData = [word, definition];
        puttingObjectInLocalStorage(searchData);
        displayDataSearch();
    });
    
}

function displayDataSearch(){
    const main = document.querySelector('main');
    
    if(main.contains(document.querySelector('.card'))){
        main.removeChild(document.querySelector('.card'))
    }
    const card = `
        <div class="card">
            <h2 class="word">word: ${searchData[0]}</h2>
            <p class="description">${searchData[1]}</p>
        </div>
    `
    main.insertAdjacentHTML('beforeend', card);
}

//togelling between search and history
primaryBtn.addEventListener('click', () => {
    const history = document.querySelector('.history');
    const main = document.querySelector('main');

    if (primaryBtn.getAttribute('data-primary-btn') === 'history') {
        primaryBtn.setAttribute('data-primary-btn', 'search');
        primaryBtn.innerText = 'SEARCH';
        console.log("search is set");
        main.style.display = 'none';
        history.style.display = 'flex';
        displayDataHistory();
    } else if(primaryBtn.getAttribute('data-primary-btn') === 'search') {
        primaryBtn.setAttribute('data-primary-btn', 'history');
        primaryBtn.innerText = 'HISTORY';
        console.log("History is set");
        main.style.display = 'flex';
        history.style.display = 'none';
    }

});

function puttingObjectInLocalStorage(searchData){
    const object = {
        word: searchData[0],
        definition: searchData[1]
    }

     // Retrieve the existing array from local storage
     let searches = JSON.parse(localStorage.getItem('searches'));

     // If the array doesn't exist yet, create it
     if (!searches) {
         searches = [];
     }
 
     // Add the new object to the array
     searches.push(object);
 
     // Store the updated array back in local storage
     localStorage.setItem('searches', JSON.stringify(searches));
    
}


//displaying the history
function displayDataHistory(){
    let searches = JSON.parse(localStorage.getItem('searches'));
    const history = document.querySelector('.history');
    history.innerHTML = '';
    for(let i = 0; i < searches.length; i++) {
        let card = `
        <div class="hcard">
            <h2 class="word">word: ${searches[i].word}</h2>
            <p class="description">${searches[i].definition}</p>
            <i class="fa-regular fa-trash-can trash" data-trash="${i}"></i>
        </div>
        `
        history.insertAdjacentHTML('beforeend', card);
    }
    trash();
}


function trash(){
    let trashs = document.querySelectorAll('[data-trash]');
    trashs.forEach(trash => {
        trash.addEventListener('click', () => {
            // Retrieve the existing array from local storage
            let searches = JSON.parse(localStorage.getItem('searches'));

            // Get the index from the data-trash attribute
            let index = parseInt(trash.getAttribute('data-trash'));

            // Remove the item at the index from the array
            searches.splice(index, 1);

            // Store the updated array back in local storage
            localStorage.setItem('searches', JSON.stringify(searches));

            displayDataHistory();
        })
            
    })

}


// Tost Notification 
function createNotification(text) {
    const notif = document.createElement('div');
    notif.classList.add('toast');
    notif.innerText = text;
    toasts.appendChild(notif);

    setTimeout(() => {
        notif.remove();
    
    }, 2000)
}