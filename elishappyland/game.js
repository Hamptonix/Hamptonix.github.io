import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import {
  getDatabase, ref, onValue, set, onDisconnect, update, push
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js';

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
  const resetCountdownEl = document.getElementById('resetCountdown');

  const WORLD_WIDTH = 4000;
  const WORLD_HEIGHT = 4000;
  let zoomLevel = 1;
  const MIN_ZOOM = 0.15;
  const MAX_ZOOM = 5;

  const playerId = Math.random().toString(36).substr(2, 9);
  let x = WORLD_WIDTH / 2;
  let y = WORLD_HEIGHT / 2;
  let playerName = '';
  let playerColor = '#0000ff';
  const playerSize = 20;

  const moveDistance = 5;
  const keysPressed = {};
  const keyTimers = {};
  const initialDelay = 200;
  const repeatInterval = 50;

  const playersRef = ref(db, 'players');
  const printsRef = ref(db, 'prints');
  const playerRef = ref(db, 'players/' + playerId);
  onDisconnect(playerRef).remove();

  const coordDisplay = document.createElement('div');
  Object.assign(coordDisplay.style, {
    marginTop: '10px', fontSize: '14px', color: '#1e90ff'
  });
  document.querySelector('.player-setup-container').appendChild(coordDisplay);

  const minimap = document.createElement('canvas');
  minimap.width = minimap.height = 200;
  minimap.style.border = '1px solid #000';
  minimap.style.marginTop = '20px';
  document.querySelector('.player-setup-container').appendChild(minimap);
  const mCtx = minimap.getContext('2d');

  function setPlayerData() {
    set(playerRef, { x, y, name: playerName, color: playerColor });
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
    switch (key) {
      case 'ArrowUp':
      case 'KeyW':
        y -= moveDistance; break;
      case 'ArrowDown':
      case 'KeyS':
        y += moveDistance; break;
      case 'ArrowLeft':
      case 'KeyA':
        x -= moveDistance; break;
      case 'ArrowRight':
      case 'KeyD':
        x += moveDistance; break;
    }
    x = Math.max(0, Math.min(WORLD_WIDTH, x));
    y = Math.max(0, Math.min(WORLD_HEIGHT, y));
    setPlayerData();
  }

  function printColor() {
    const newPrintRef = push(printsRef);
    set(newPrintRef, { x, y, color: playerColor, playerId, timestamp: Date.now() });
  }

  function teleportToRandomPlayer(players) {
    const others = Object.values(players).filter(p => p && p.playerId !== playerId);
    if (!others.length) return;
    const target = others[Math.floor(Math.random() * others.length)];
    x = target.x; y = target.y;
    setPlayerData();
  }

  document.addEventListener('keydown', (e) => {
  const active = document.activeElement;
  if (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA') return;

  const code = e.code;
  const controlKeys = [
    'ArrowUp','ArrowDown','ArrowLeft','ArrowRight',
    'KeyW','KeyA','KeyS','KeyD', 'Space', 'Equal', 'Minus', 'KeyT'
  ];
  if (!controlKeys.includes(code)) return;

  e.preventDefault();

  if (!keysPressed[code]) {
    keysPressed[code] = true;

    switch (code) {
      case 'Space':
        printColor();
        keyTimers[code] = setInterval(printColor, 200);
        break;
      case 'Equal':
        zoomLevel = Math.min(MAX_ZOOM, zoomLevel * 1.2);
        draw();
        break;
      case 'Minus':
        zoomLevel = Math.max(MIN_ZOOM, zoomLevel / 1.2);
        draw();
        break;
      case 'KeyT':
        if (window._latestPlayers) teleportToRandomPlayer(window._latestPlayers);
        break;
      default:
        movePlayer(code);
        keyTimers[code] = setTimeout(() => {
          keyTimers[code] = setInterval(() => movePlayer(code), repeatInterval);
        }, initialDelay);
        break;
    }
  }
});


document.addEventListener('keyup', (e) => {
  const active = document.activeElement;
  if (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA') return;

  const code = e.code;
  if (!keysPressed[code]) return;

  keysPressed[code] = false;
  if (keyTimers[code]) {
    clearInterval(keyTimers[code]);
    clearTimeout(keyTimers[code]);
    keyTimers[code] = null;
  }

  e.preventDefault();
});


  let players = {};
  let prints = {};

  onValue(playersRef, (snapshot) => {
  players = snapshot.val() || {};
  window._latestPlayers = players;
  updatePlayerCount();
  draw();
});


  onValue(printsRef, (snapshot) => {
    prints = snapshot.val() || {};
    draw();
  });

  function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const viewW = canvas.width / zoomLevel;
    const viewH = canvas.height / zoomLevel;
    let offsetX = x - viewW / 2;
    let offsetY = y - viewH / 2;

    offsetX = Math.max(0, Math.min(WORLD_WIDTH - viewW, offsetX));
    offsetY = Math.max(0, Math.min(WORLD_HEIGHT - viewH, offsetY));

    ctx.scale(zoomLevel, zoomLevel);
    ctx.translate(-offsetX, -offsetY);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4 / zoomLevel;
    ctx.strokeRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    for (const id in prints) {
      const p = prints[id];
      if (!p) continue;
      if (
        p.x + playerSize < offsetX ||
        p.x > offsetX + viewW ||
        p.y + playerSize < offsetY ||
        p.y > offsetY + viewH
      ) continue;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, playerSize, playerSize);
    }

    for (const pid in players) {
      const p = players[pid];
      if (!p || pid === playerId) continue;
      if (
        p.x + playerSize < offsetX ||
        p.x > offsetX + viewW ||
        p.y + playerSize < offsetY ||
        p.y > offsetY + viewH
      ) continue;
      ctx.fillStyle = 'gray';
      ctx.fillRect(p.x, p.y, playerSize, playerSize);
      ctx.fillStyle = 'black';
      ctx.font = `${10 / zoomLevel}px Arial`;
      const nm = p.name || 'Player';
      const w = ctx.measureText(nm).width;
      ctx.fillText(nm, p.x + playerSize / 2 - w / 2, p.y - 2 / zoomLevel);
    }

    ctx.fillStyle = playerColor;
    ctx.fillRect(x, y, playerSize, playerSize);
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2 / zoomLevel;
    ctx.strokeRect(x - 1, y - 1, playerSize + 2, playerSize + 2);
    ctx.fillStyle = 'black';
    ctx.font = `${10 / zoomLevel}px Arial`;
    const wSelf = ctx.measureText(playerName || 'Player').width;
    ctx.fillText(playerName || 'Player', x + playerSize / 2 - wSelf / 2, y - 2 / zoomLevel);

    ctx.setTransform(1, 0, 0, 1, 0, 0);

    coordDisplay.textContent = `Coordinates: (${Math.round(x)}, ${Math.round(y)})  Zoom: ${zoomLevel.toFixed(2)}×`;

    drawMinimap(offsetX, offsetY, viewW, viewH);
  }

  function drawMinimap(offsetX, offsetY, viewW, viewH) {
    const w = minimap.width, h = minimap.height;
    const scaleX = w / WORLD_WIDTH, scaleY = h / WORLD_HEIGHT;

    mCtx.clearRect(0, 0, w, h);
    mCtx.fillStyle = '#eee'; mCtx.fillRect(0, 0, w, h);

    for (const id in prints) {
      const p = prints[id];
      if (!p) continue;
      mCtx.fillStyle = p.color;
      mCtx.fillRect(p.x * scaleX, p.y * scaleY, 2, 2);
    }
    for (const pid in players) {
      const p = players[pid];
      if (!p) continue;
      mCtx.fillStyle = (pid === playerId ? 'yellow' : 'red');
      mCtx.fillRect(p.x * scaleX, p.y * scaleY, 4, 4);
    }
    mCtx.strokeStyle = 'blue';
    mCtx.lineWidth = 2;
    mCtx.strokeRect(offsetX * scaleX, offsetY * scaleY, viewW * scaleX, viewH * scaleY);
  }

  function updatePlayerCount() {
  const playerCountEl = document.getElementById('playerCount');
  const total = players ? Object.keys(players).length : 0;
  playerCountEl.textContent = `Players Online: ${total}`;
}

  let lastResetKey = null;
    function getNextResetTimestamp() {
    const MS_IN_TWO_WEEKS = 14 * 24 * 60 * 60 * 1000;
    const startDate = new Date('2024-01-01T00:00:00Z').getTime(); // fixed reset start
    const now = Date.now();
    const cycles = Math.ceil((now - startDate) / MS_IN_TWO_WEEKS);
    return startDate + cycles * MS_IN_TWO_WEEKS;
  }

  // Countdown timer
  setInterval(() => {
  const now = Date.now();
  const next = getNextResetTimestamp();
  const delta = next - now;

  const hrs = Math.floor(delta / (1000 * 60 * 60));
  const mins = Math.floor((delta % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((delta % (1000 * 60)) / 1000);

  if (resetCountdownEl) {
    resetCountdownEl.textContent =
      `Resetting in: ${String(hrs).padStart(2, '0')}:` +
      `${String(mins).padStart(2, '0')}:` +
      `${String(secs).padStart(2, '0')}`;
  }

  const resetTimeEl = document.getElementById('resetTime');
  if (resetTimeEl) {
    const date = new Date(next);
    resetTimeEl.textContent = `Next Reset: ${date.toLocaleString()}`;
  }
}, 1000);



  // Reset board every 2 weeks
  setInterval(() => {
    const now = Date.now();
    const nextReset = getNextResetTimestamp();
    const key = `${nextReset}`;

    if (now >= nextReset - 1000 && now <= nextReset + 5000 && key !== lastResetKey) {
      lastResetKey = key;
      set(printsRef, null)
        .then(() => {
          console.log(`[RESET] Canvas reset at ${new Date().toLocaleTimeString()}`);
          const msgBox = document.getElementById('messageBox');
          if (msgBox) msgBox.value = `[${new Date().toLocaleTimeString()}] Canvas was reset.`;
        })
        .catch(err => console.error('Reset error:', err));
    }
  }, 1000);

  setPlayerData();
});

