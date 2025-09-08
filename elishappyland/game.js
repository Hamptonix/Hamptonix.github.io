import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getDatabase, ref, onValue, set, onDisconnect } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';

window.addEventListener('DOMContentLoaded', () => {
  const firebaseConfig = {
    apiKey: "AIzaSyDSJNYIQbex4Ce0J2l2O3kVaC_QEuC5brk",
    authDomain: "elishappyland.firebaseapp.com",
    databaseURL: "https://elishappyland-default-rtdb.firebaseio.com",
    projectId: "elishappyland"
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  function setPlayerPosition(playerId, x, y) {
    set(ref(db, 'players/' + playerId), { x, y });
  }

  function listenToPlayers(callback) {
    onValue(ref(db, 'players'), (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
  }

  const playerId = Math.random().toString(36).substr(2, 9);
  let x = 100, y = 100;

  const playerRef = ref(db, 'players/' + playerId);

  // Remove player data automatically on disconnect
  onDisconnect(playerRef).remove();

  // Set initial position
  setPlayerPosition(playerId, x, y);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') x += 5;
    if (e.key === 'ArrowLeft') x -= 5;
    if (e.key === 'ArrowUp') y -= 5;
    if (e.key === 'ArrowDown') y += 5;
    setPlayerPosition(playerId, x, y);
  });

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  listenToPlayers((players) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!players) return;

    for (let id in players) {
      const p = players[id];
      ctx.fillStyle = (id === playerId) ? 'blue' : 'red';
      ctx.fillRect(p.x, p.y, 20, 20);
    }
  });
});
