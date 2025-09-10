import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getDatabase, ref, onValue, set, onDisconnect, update } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';

window.addEventListener('DOMContentLoaded', () => {
  const firebaseConfig = {
    apiKey: "AIzaSyDSJNYIQbex4Ce0J2l2O3kVaC_QEuC5brk",
    authDomain: "elishappyland.firebaseapp.com",
    databaseURL: "https://elishappyland-default-rtdb.firebaseio.com",
    projectId: "elishappyland"
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const printCanvas = document.getElementById('printCanvas');
  const printCtx = printCanvas.getContext('2d');

  const nameInput = document.getElementById('nameInput');
  const colorPicker = document.getElementById('colorPicker');

  const playerId = Math.random().toString(36).substr(2, 9);
  let x = 100, y = 100;
  let playerName = '';
  let playerColor = '#0000ff';

  const moveDistance = 5;
  const keysPressed = {};
  const keyTimers = {};
  const initialDelay = 200;
  const repeatInterval = 50;

  const boxWidth = canvas.width;
  const boxHeight = canvas.height;
  const playerSize = 20;

  const playerRef = ref(db, 'players/' + playerId);
  onDisconnect(playerRef).remove();

  function setPlayerData() {
    set(playerRef, {
      x, y,
      name: playerName,
      color: playerColor
    });
  }

  nameInput.addEventListener('input', () => {
    playerName = nameInput.value || 'Player';
    update(playerRef, { name: playerName });
  });

  colorPicker.addEventListener('input', () => {
    playerColor = colorPicker.value;
    update(playerRef, { color: playerColor });
  });

  document.addEventListener('keydown', (e) => {
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) {
      if (!keysPressed[e.key]) {
        keysPressed[e.key] = true;

        if (e.key === ' ') {
          // Draw selected color to printCanvas
          printCtx.fillStyle = playerColor;
          printCtx.fillRect(0, 0, printCanvas.width, printCanvas.height);
        } else {
          movePlayer(e.key);
          keyTimers[e.key] = setTimeout(() => {
            keyTimers[e.key] = setInterval(() => movePlayer(e.key), repeatInterval);
          }, initialDelay);
        }
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

  function movePlayer(key) {
    switch(key) {
      case 'ArrowUp': y -= moveDistance; break;
      case 'ArrowDown': y += moveDistance; break;
      case 'ArrowLeft': x -= moveDistance; break;
      case 'ArrowRight': x += moveDistance; break;
    }

    // Keep player inside the canvas
    x = Math.max(0, Math.min(boxWidth - playerSize, x));
    y = Math.max(0, Math.min(boxHeight - playerSize, y));

    setPlayerData();
  }

  function listenToPlayers(callback) {
    onValue(ref(db, 'players'), (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
  }

  listenToPlayers((players) => {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    if (!players) return;

    for (let id in players) {
      const p = players[id];
      const px = p.x;
      const py = p.y;

      // Draw player
      ctx.fillStyle = (id === playerId) ? playerColor : 'gray';
      ctx.fillRect(px, py, playerSize, playerSize);

      if (id === playerId) {
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 2;
        ctx.strokeRect(px - 1, py - 1, playerSize + 2, playerSize + 2);
      }

      // Draw player name
      ctx.fillStyle = 'black';
      ctx.font = '10px Arial';
      ctx.fillText(p.name || 'Player', px, py - 2);
    }
  });
});
