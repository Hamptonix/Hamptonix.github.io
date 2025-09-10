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

  function movePlayer(key) {
    switch (key.toLowerCase()) {
      case 'arrowup':
      case 'w':
        y -= moveDistance;
        break;
      case 'arrowdown':
      case 's':
        y += moveDistance;
        break;
      case 'arrowleft':
      case 'a':
        x -= moveDistance;
        break;
      case 'arrowright':
      case 'd':
        x += moveDistance;
        break;
    }

    x = Math.max(0, Math.min(boxWidth - playerSize, x));
    y = Math.max(0, Math.min(boxHeight - playerSize, y));

    setPlayerData();
  }

  function printColor() {
    const newPrintRef = push(printsRef);
    set(newPrintRef, {
      x,
      y,
      color: playerColor,
      playerId,
      timestamp: Date.now()
    });
  }

  document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    const moveKeys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'];

    if (moveKeys.includes(key) || key === ' ') {
      if (!keysPressed[e.key]) {
        keysPressed[e.key] = true;

        if (key === ' ') {
          printColor();
          keyTimers[' '] = setInterval(printColor, 200); // continuous print
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

      if (e.key === ' ') {
        clearInterval(keyTimers[' ']);
      }

      e.preventDefault();
    }
  });

  let players = {};
  let prints = {};

  onValue(playersRef, (snapshot) => {
    players = snapshot.val() || {};
    draw();
  });

  onValue(printsRef, (snapshot) => {
    prints = snapshot.val() || {};
    draw();
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let id in prints) {
      const p = prints[id];
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, playerSize, playerSize);
    }

    for (let id in players) {
      if (id === playerId) continue;
      const p = players[id];
      ctx.fillStyle = 'gray';
      ctx.fillRect(p.x, p.y, playerSize, playerSize);

      ctx.fillStyle = 'black';
      ctx.font = '10px Arial';
      const textWidth = ctx.measureText(p.name || 'Player').width;
      ctx.fillText(p.name || 'Player', p.x + playerSize / 2 - textWidth / 2, p.y - 2);
    }

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
      ctx.fillText(me.name || 'Player', me.x + playerSize / 2 - textWidth / 2, me.y - 2);
    }
  }

  // --- Canvas Reset Countdown and Logic ---
  const resetCountdownEl = document.getElementById('resetCountdown');

  function getNextResetTimestamp() {
    const now = new Date();
    const next = new Date(now);
    next.setMinutes(0);
    next.setSeconds(0);
    next.setMilliseconds(0);
    next.setHours(now.getHours() + 1);
    return next.getTime();
  }

  let lastResetKey = null;

  setInterval(() => {
    const now = Date.now();
    const nextReset = getNextResetTimestamp();
    const timeLeft = nextReset - now;

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    resetCountdownEl.textContent =
      `Resetting in: ${String(hours).padStart(2, '0')}:` +
      `${String(minutes).padStart(2, '0')}:` +
      `${String(seconds).padStart(2, '0')}`;
  }, 1000);

  setInterval(() => {
    const now = new Date();
    const isTopOfHour = now.getMinutes() === 0 && now.getSeconds() < 5;

    if (isTopOfHour) {
      const currentResetKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;

      if (lastResetKey !== currentResetKey) {
        lastResetKey = currentResetKey;

        set(printsRef, null)
          .then(() => {
            console.log(`[RESET] Canvas reset at ${now.toLocaleTimeString()}`);
            const msgBox = document.getElementById('messageBox');
            if (msgBox) {
              msgBox.value = `[${now.toLocaleTimeString()}] Canvas was reset.`;
            }
          })
          .catch((err) => {
            console.error('Error resetting canvas:', err);
          });
      }
    }
  }, 1000);
});
