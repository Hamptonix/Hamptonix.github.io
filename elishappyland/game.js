// game.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.24.0/firebase-app.js';
import { getDatabase, ref, onValue, set } from 'https://www.gstatic.com/firebasejs/9.24.0/firebase-database.js';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Set player position
function setPlayerPosition(playerId, x, y) {
  set(ref(db, 'players/' + playerId), {
    x, y
  });
}

// Listen to all players
function listenToPlayers(callback) {
  onValue(ref(db, 'players'), (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
}

const playerId = Math.random().toString(36).substr(2, 9);
let x = 100, y = 100;

// Simulate movement
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') x += 5;
  if (e.key === 'ArrowLeft') x -= 5;
  if (e.key === 'ArrowUp') y -= 5;
  if (e.key === 'ArrowDown') y += 5;
  setPlayerPosition(playerId, x, y);
});

listenToPlayers((players) => {
  // Clear and redraw all players
  const ctx = document.getElementById('gameCanvas').getContext('2d');
  ctx.clearRect(0, 0, 800, 600);
  for (let id in players) {
    const p = players[id];
    ctx.fillStyle = (id === playerId) ? 'blue' : 'red';
    ctx.fillRect(p.x, p.y, 20, 20);
  }
});

