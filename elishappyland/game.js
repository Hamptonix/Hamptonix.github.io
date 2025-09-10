import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getDatabase, ref, onValue, set, onDisconnect, update, push } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';

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

  const playersRef = ref(db, 'players');
  const printsRef = ref(db, 'prints');

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
          // Add a print at the current player position
          const newPrintRef = push(printsRef);
          set(newPrintRef, {
            x, y,
            color: playerColor,
            playerId,
            timestamp: Date.now()
          });
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

  let players = {};
  let prints = {};

  // Listen to players
  onValue(playersRef, (snapshot) => {
    players = snapshot.val() || {};
    draw();
  });

  // Listen to prints
  onValue(printsRef, (snapshot) => {
    prints = snapshot.val() || {};
    draw();
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all prints first
    for (let id in prints) {
      const p = prints[id];
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, playerSize, playerSize);
    }

    // Draw all other players
    for (let id in players) {
      if (id === playerId) continue; // draw local player last
      const p = players[id];
      ctx.fillStyle = 'gray';
      ctx.fillRect(p.x, p.y, playerSize, playerSize);

      // Player name (centered above square)
      ctx.fillStyle = 'black';
      ctx.font = '10px Arial';
      const textWidth = ctx.measureText(p.name || 'Player').width;
      ctx.fillText(p.name || 'Player', p.x + playerSize/2 - textWidth/2, p.y - 2);
    }

    // Draw local player on top
    const me = players[playerId];
    if (me) {
      ctx.fillStyle = playerColor;
      ctx.fillRect(me.x, me.y, playerSize, playerSize);

      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 2;
      ctx.strokeRect(me.x - 1, me.y - 1, playerSize + 2, playerSize + 2);

      ctx.fillStyle = 'black';
      ctx.font = '10px Arial';
      const textWidth = ctx.measureText(me.name || 'Player').width;
      ctx.fillText(me.name || 'Player', me.x + playerSize/2 - textWidth/2, me.y - 2);
    }
  }
});
