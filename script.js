let players = [];
let currentPlayerIndex = 0;
let finishedPlayers = [];
let characters = [];
let currentCategory = "";

function addPlayer() {
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = `Player ${players.length + 1} name`;
  document.getElementById('players').appendChild(input);
  document.getElementById('players').appendChild(document.createElement('br'));
}

async function startGame() {
  const inputs = document.querySelectorAll('#players input');
  players = [];
  for (let input of inputs) {
    if (input.value.trim() !== "") {
      players.push({ name: input.value.trim(), guessed: false, character: "" });
    }
  }

  currentCategory = document.getElementById('category').value;
  const response = await fetch(`${currentCategory}.json`);
  const data = await response.json();
  characters = [...data.characters];

  for (let i = 0; i < players.length; i++) {
    const randIndex = Math.floor(Math.random() * characters.length);
    players[i].character = characters[randIndex];
    characters.splice(randIndex, 1);
  }

  document.getElementById('setupScreen').style.display = 'none';
  document.getElementById('gameScreen').style.display = 'block';

  showTurn();
}

function showTurn() {
  const player = players[currentPlayerIndex];
  if (player.guessed) {
    nextTurn();
    return;
  }
  document.getElementById('roundInfo').innerText = `${player.name}'s Turn`;
  document.getElementById('characterDisplay').style.display = 'none';
  document.getElementById('characterDisplay').innerText = player.character;
}

function toggleReveal() {
  const charBox = document.getElementById('characterDisplay');
  charBox.style.display = (charBox.style.display === 'none') ? 'inline-block' : 'none';
}

function submitGuess() {
  players[currentPlayerIndex].guessed = true;
  finishedPlayers.push({ name: players[currentPlayerIndex].name });
  alert(`${players[currentPlayerIndex].name} guessed their character!`);
  nextTurn();
}

function nextTurn() {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  if (players.every(p => p.guessed)) {
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

async function restartSameCategory() {
  finishedPlayers = [];
  currentPlayerIndex = 0;
  const response = await fetch(`${currentCategory}.json`);
  const data = await response.json();
  characters = [...data.characters];
  for (let i = 0; i < players.length; i++) {
    players[i].guessed = false;
    const randIndex = Math.floor(Math.random() * characters.length);
    players[i].character = characters[randIndex];
    characters.splice(randIndex, 1);
  }
  document.getElementById('resultScreen').style.display = 'none';
  document.getElementById('gameScreen').style.display = 'block';
  showTurn();
}

function goToHome() {
  location.reload();
}
