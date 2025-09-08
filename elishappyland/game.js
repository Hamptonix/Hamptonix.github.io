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
  onDisconnect(playerRef).remove();

  setPlayerPosition(playerId, x, y);

  const moveDistance = 5;
  const keysPressed = {};
  const keyTimers = {};
  const initialDelay = 500; // ms delay before repeat starts
  const repeatInterval = 50; // ms between repeated moves

  function movePlayer(dx, dy) {
    x += dx;
    y += dy;
    setPlayerPosition(playerId, x, y);
  }

  document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      if (!keysPressed[e.key]) {
        keysPressed[e.key] = true;

        // Immediate move on first keydown
        switch (e.key) {
          case 'ArrowRight': movePlayer(moveDistance, 0); break;
          case 'ArrowLeft': movePlayer(-moveDistance, 0); break;
          case 'ArrowUp': movePlayer(0, -moveDistance); break;
          case 'ArrowDown': movePlayer(0, moveDistance); break;
        }

        // After delay, start continuous movement
        keyTimers[e.key] = setTimeout(() => {
          keyTimers[e.key] = setInterval(() => {
            switch (e.key) {
              case 'ArrowRight' : movePlayer(moveDistance, 0); break;
              case 'ArrowLeft': movePlayer(-moveDistance, 0); break;
              case 'ArrowUp': movePlayer(0, -moveDistance); break;
              case 'ArrowDown': movePlayer(0, moveDistance); break;
            }
          }, repeatInterval);
        }, initialDelay);
      }
      e.preventDefault();
    }
  });

  document.addEventListener('keyup', (e) => {
    if (keysPressed[e.key]) {
      keysPressed[e.key] = false;

      if (keyTimers[e.key]) {
        clearTimeout(keyTimers[e.key]);
        clearInterval(keyTimers[e.key]);
        keyTimers[e.key] = null;
      }
      e.preventDefault();
    }
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
