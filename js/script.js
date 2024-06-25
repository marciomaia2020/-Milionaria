var state = {
  currentNumbers: [],
  currentTrevos: [],
  savedGames: [],
  numbers: [],
  trevos: []
};

function start() {
  readLocalStorage();
  createNumbers();
  createTrevos();
  newGame();
}

function readLocalStorage() {
  if (!window.localStorage) {
    return;
  }

  var savedGames = window.localStorage.getItem('saved-games');

  if (savedGames) {
    state.savedGames = JSON.parse(savedGames);
  }
}

function writeLocalStorage() {
  window.localStorage.setItem('saved-games', JSON.stringify(state.savedGames));
}

function createNumbers() {
  state.numbers = [];

  for (var i = 1; i <= 50; i++) {
    state.numbers.push(i);
  }
}

function createTrevos() {
  state.trevos = [];

  for (var i = 1; i <= 6; i++) {
    state.trevos.push(i);
  }
}

function newGame() {
  state.currentNumbers = [];
  state.currentTrevos = [];
  render();
}

function render() {
  renderNumbers();
  renderTrevos();
  renderButtons();
  renderSavedGames();
}

function renderNumbers() {
  var divNumbers = document.querySelector('#megasena-numbers');
  divNumbers.innerHTML = '';
  
  var ulNumbers = document.createElement('ul');
  ulNumbers.classList.add('numbers');

  for (var i = 0; i < state.numbers.length; i++) {
    var number = state.numbers[i];

    var liNumber = document.createElement('li');
    liNumber.textContent = number.toString().padStart(2, '0');
    liNumber.classList.add('number');

    liNumber.addEventListener('click', handleNumberClick);

    if (state.currentNumbers.includes(number)) {
      liNumber.classList.add('selected-number');
    }

    ulNumbers.appendChild(liNumber);
  }

  divNumbers.appendChild(ulNumbers);
}

function renderTrevos() {
  var divTrevos = document.querySelector('#megasena-trevos');
  divTrevos.innerHTML = '';

  var ulTrevos = document.createElement('ul');
  ulTrevos.classList.add('trevos');

  for (var i = 0; i < state.trevos.length; i++) {
    var trevo = state.trevos[i];

    var liTrevo = document.createElement('li');
    liTrevo.textContent = trevo.toString();
    liTrevo.classList.add('trevo');

    liTrevo.addEventListener('click', handleTrevoClick);

    if (state.currentTrevos.includes(trevo)) {
      liTrevo.classList.add('selected-trevo');
    }

    ulTrevos.appendChild(liTrevo);
  }

  divTrevos.appendChild(ulTrevos);
}

function handleNumberClick(event) {
  var element = event.currentTarget;
  var number = parseInt(element.textContent);

  if (state.currentNumbers.includes(number)) {
    state.currentNumbers = state.currentNumbers.filter(num => num !== number);
  } else {
    if (state.currentNumbers.length < 6) {
      state.currentNumbers.push(number);
    }
  }

  renderNumbers();
}

function handleTrevoClick(event) {
  var element = event.currentTarget;
  var trevo = parseInt(element.textContent);

  if (state.currentTrevos.includes(trevo)) {
    state.currentTrevos = state.currentTrevos.filter(num => num !== trevo);
  } else {
    if (state.currentTrevos.length < 2) {
      state.currentTrevos.push(trevo);
    }
  }

  renderTrevos();
}

function renderButtons() {
  var divButtons = document.querySelector('#megasena-buttons');
  divButtons.innerHTML = '';

  var ulButtons = document.createElement('ul');
  ulButtons.classList.add('buttons');

  var liNewGameButton = renderNewGameButton();
  var liRandomGameButton = renderRandomGameButton();
  var liSaveGameButton = renderSaveGameButton();
  var liClearSavedGamesButton = renderClearSavedGamesButton();
  var liExportGamesButton = renderExportGamesButton();

  ulButtons.appendChild(liNewGameButton);
  ulButtons.appendChild(liRandomGameButton);
  ulButtons.appendChild(liSaveGameButton);
  ulButtons.appendChild(liClearSavedGamesButton);
  ulButtons.appendChild(liExportGamesButton);

  divButtons.appendChild(ulButtons);
}

function renderNewGameButton() {
  var li = document.createElement('li');
  li.classList.add('button');

  var button = document.createElement('button');
  button.textContent = 'Novo jogo';
  button.addEventListener('click', newGame);

  li.appendChild(button);

  return li;
}

function renderRandomGameButton() {
  var li = document.createElement('li');
  li.classList.add('button');

  var button = document.createElement('button');
  button.textContent = 'Jogo aleatório';
  button.addEventListener('click', generateRandomGame);

  li.appendChild(button);

  return li;
}

function renderSaveGameButton() {
  var li = document.createElement('li');
  li.classList.add('button');

  var button = document.createElement('button');
  button.textContent = 'Salvar jogo';
  button.disabled = state.currentNumbers.length !== 6 || state.currentTrevos.length !== 2;
  button.addEventListener('click', saveGame);

  li.appendChild(button);

  return li;
}

function renderClearSavedGamesButton() {
  var li = document.createElement('li');
  li.classList.add('button');

  var button = document.createElement('button');
  button.textContent = 'Limpar jogos salvos';
  button.addEventListener('click', clearSavedGames);

  li.appendChild(button);

  return li;
}

function renderExportGamesButton() {
  var li = document.createElement('li');
  li.classList.add('button');

  var button = document.createElement('button');
  button.textContent = 'Exportar jogos salvos';
  button.addEventListener('click', exportSavedGames);

  li.appendChild(button);

  return li;
}

function exportSavedGames() {
  if (state.savedGames.length === 0) {
    alert('Não há jogos salvos para exportar.');
    return;
  }

  var csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Numeros,Trevos\n";

  state.savedGames.forEach(function(game) {
    var numbers = game.slice(0, 6).map(number => number.toString().padStart(2, '0')).join(' ');
    var trevos = game.slice(6, 8).join(' ');

    var row = numbers + ',' + trevos + '\n';
    csvContent += row;
  });

  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "jogos_salvos_megamilionaria.csv");
  document.body.appendChild(link); // Required for FF

  link.click(); // This will download the CSV file
}

function generateRandomGame() {
  state.currentNumbers = [];
  state.currentTrevos = [];

  while (state.currentNumbers.length < 6) {
    var randomNum = Math.floor(Math.random() * 50) + 1;
    if (!state.currentNumbers.includes(randomNum)) {
      state.currentNumbers.push(randomNum);
    }
  }

  while (state.currentTrevos.length < 2) {
    var randomTrevo = Math.floor(Math.random() * 6) + 1;
    if (!state.currentTrevos.includes(randomTrevo)) {
      state.currentTrevos.push(randomTrevo);
    }
  }

  render();
}

function saveGame() {
  var sortedNumbers = [...state.currentNumbers].sort((a, b) => a - b); // Ordena as dezenas
  var game = sortedNumbers.concat(state.currentTrevos);
  state.savedGames.push(game);
  writeLocalStorage();
  newGame();
}

function clearSavedGames() {
  state.savedGames = [];
  writeLocalStorage();
  render();
}

function renderSavedGames() {
  var divSavedGames = document.querySelector('#megasena-saved-games');
  divSavedGames.innerHTML = '';

  if (state.savedGames.length === 0) {
    divSavedGames.innerHTML = '<p>Nenhum jogo gravado até o momento.</p>';
  } else {
    var h2 = document.createElement('h2');
    h2.textContent = 'Jogos salvos';

    var ul = document.createElement('ul');
    ul.classList.add('saved-games');

    for (var i = 0; i < state.savedGames.length; i++) {
      var currentGame = state.savedGames[i];

      var li = document.createElement('li');

      var numbers = currentGame.slice(0, 6).map(number => number.toString().padStart(2, '0')).join(' ');
      var trevos = currentGame.slice(6, 8).join(' '); // Mostra apenas os Numeros dos trevos

      li.textContent = numbers + ' | ' + trevos;

      ul.appendChild(li);
    }

    divSavedGames.appendChild(h2);
    divSavedGames.appendChild(ul);
  }
}
function exportSavedGames() {
  if (state.savedGames.length === 0) {
    alert('Não há jogos salvos para exportar.');
    return;
  }

  var csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Numeros,Trevos\n";

  state.savedGames.forEach(function(game) {
    var numbers = game.slice(0, 6).map(number => number.toString().padStart(2, '0')).join(','); // Números separados por vírgula
    var trevos = game.slice(6, 8).join(','); // Trevos separados por vírgula

    var row = numbers + ',' + trevos + '\n';
    csvContent += row;
  });

  var encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "jogos_salvos_megamilionaria.csv");
  document.body.appendChild(link); // Required for FF

  link.click(); // This will download the CSV file
}


start();