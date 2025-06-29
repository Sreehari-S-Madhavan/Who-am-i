let players = [];
let currentPlayerIndex = 0;
let finishedPlayers = [];

function addPlayer() {
  const id = `player${players.length}`;
  const container = document.getElementById('players');
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = `Player ${players.length + 1} name`;
  input.id = id;
  container.appendChild(input);
  container.appendChild(document.createElement('br'));
}

async function startGame() {
  const inputs = document.querySelectorAll('#players input');
  players = [];

  for (let input of inputs) {
    if (input.value.trim() !== "") {
      players.push({ name: input.value.trim(), guessed: false, character: "" });
    }
  }

  const category = document.getElementById('category').value;
  const response = await fetch(`${category}.json`);
  const data = await response.json();

  const availableCharacters = [...data.characters];
  for (let i = 0; i < players.length; i++) {
    const randIndex = Math.floor(Math.random() * availableCharacters.length);
    players[i].character = availableCharacters[randIndex];
    availableCharacters.splice(randIndex, 1);
  }

  document.getElementById('setupScreen').style.display = 'none';
  document.getElementById('gameScreen').style.display = 'block';

  showTurn();
}

function showTurn() {
  const player = players[currentPlayerIndex];
  if (player.guessed) {
    nextTurn(); return;
  }

  document.getElementById('roundInfo').innerText = `${player.name}'s Turn`;

  document.getElementById('characterReveal').innerText = player.character;


  document.getElementById('guessInput').value = '';
}

function submitGuess() {
  const guess = document.getElementById('guessInput').value.trim().toLowerCase();
  const current = players[currentPlayerIndex];

  if (guess === current.character.toLowerCase()) {
    current.guessed = true;
    finishedPlayers.push({ name: current.name });
    alert(`${current.name} guessed correctly! 🎉`);
  } else {
    alert(`Wrong guess!`);
  }

  nextTurn();
}

function nextTurn() {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;

  if (finishedPlayers.length === players.length) {
    endGame();
  } else {
    showTurn();
  }
}

function endGame() {
  document.getElementById('gameScreen').style.display = 'none';
  document.getElementById('resultScreen').style.display = 'block';

  let html = '<ol>';
  finishedPlayers.forEach(p => {
    html += `<li>${p.name}</li>`;
  });
  html += '</ol>';
  document.getElementById('ranking').innerHTML = html;
}
