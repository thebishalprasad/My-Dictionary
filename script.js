const searches = [];

const searchButton = document.querySelector('#search-button');
const inputField = document.querySelector('#input-field');

searchButton.addEventListener('click', () => {
  const word = inputField.value;

  // Make an API request to fetch the definition of the word.
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((response) => response.json())
    .then((data) => {
      // Display the definition of the word in the search results.
      const definition = data[0].meanings[0].definitions[0].definition;
      const wordCard = createWordCard(word, definition);
      document.querySelector('#search-results').appendChild(wordCard);
    });
});

const historyButton = document.querySelector('#history-button');
const historyList = document.querySelector('#history-list');

historyButton.addEventListener('click', () => {
  // Get the search history from local storage.
  const searches = JSON.parse(localStorage.getItem('searches'));

  // Display the search history in the history list.
  searches.forEach((search) => {
    const wordCard = createWordCard(search.word, search.meaning);
    historyList.appendChild(wordCard);
  });
});

const deleteButtons = document.querySelectorAll('.delete-button');

deleteButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // Get the index of the word card to be deleted.
    const index = button.parentElement.getAttribute('data-index');

    // Remove the word card from the DOM.
    button.parentElement.remove();

    // Update the search history in local storage.
    const searches = JSON.parse(localStorage.getItem('searches'));
    searches.splice(index, 1);
    localStorage.setItem('searches', JSON.stringify(searches));
  });
});

function saveSearchesToLocalStorage(searches) {
    localStorage.setItem('searches', JSON.stringify(searches));
  }

  // Save the new search to local storage.
saveSearchesToLocalStorage([...searches, { word, meaning }]);
