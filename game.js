const boardSize = 16;
const maxObjects = 5;
const inventorySize = 5;
const goodDespawnTime = 15000;
const badDespawnTime = 10000;
const discoDespawnTime = 10000;
const minimumWormLength = 3;
const magnetRadius = 2;

const boardElement = document.getElementById("board");
const wormLayerElement = document.getElementById("wormLayer");
const scoreElement = document.getElementById("score");
const highscoreElement = document.getElementById("highscore");
const statusElement = document.getElementById("status");
const effectElement = document.getElementById("effect");
const overlayElement = document.getElementById("overlay");
const overlayTextElement = document.getElementById("overlayText");
const inventoryElement = document.getElementById("inventory");
const pageElement = document.querySelector(".page");
const speedSelectElement = document.getElementById("speedSelect");
const spawnSelectElement = document.getElementById("spawnSelect");
const safetyToggleElement = document.getElementById("safetyToggle");
const durationInputs = {
  slow: document.getElementById("slowDuration"),
  ghost: document.getElementById("ghostDuration"),
  magnet: document.getElementById("magnetDuration"),
  timeStop: document.getElementById("timeStopDuration"),
  disturbance: document.getElementById("disturbanceDuration"),
  disco: document.getElementById("discoDuration"),
  acid: document.getElementById("acidDuration")
};
const toggleElements = {
  slow: document.getElementById("toggleSlow"),
  trim: document.getElementById("toggleTrim"),
  ghost: document.getElementById("toggleGhost"),
  magnet: document.getElementById("toggleMagnet"),
  timeStop: document.getElementById("toggleTimeStop"),
  teleport: document.getElementById("toggleTeleport"),
  bad: document.getElementById("toggleBad"),
  disco: document.getElementById("toggleDisco"),
  acid: document.getElementById("toggleAcid")
};

const cells = [];
const inventorySlots = [];
const highscoreStorageKey = "worm.highscore";

const directions = {
  w: { x: 0, y: -1, name: "oben" },
  s: { x: 0, y: 1, name: "unten" },
  a: { x: -1, y: 0, name: "links" },
  d: { x: 1, y: 0, name: "rechts" }
};

const objectDefinitions = {
  apple: { label: "Apfel", cssClass: "apple", kind: "food", despawnTime: null },
  slow: { label: "Slowmotion", cssClass: "power-slow", kind: "good", despawnTime: goodDespawnTime },
  trim: { label: "Kürzer", cssClass: "power-trim", kind: "good", despawnTime: goodDespawnTime },
  ghost: { label: "Ghost", cssClass: "power-ghost", kind: "good", despawnTime: goodDespawnTime },
  magnet: { label: "Magnet", cssClass: "power-magnet", kind: "good", despawnTime: goodDespawnTime },
  teleport: { label: "Teleport", cssClass: "power-teleport", kind: "bad", despawnTime: badDespawnTime },
  timeStop: { label: "Time Stop", cssClass: "power-time-stop", kind: "good", despawnTime: goodDespawnTime },
  bad: { label: "Störung", cssClass: "bad-apple", kind: "bad", despawnTime: badDespawnTime },
  disco: { label: "Disco", cssClass: "disco", kind: "disco", despawnTime: discoDespawnTime },
  acid: { label: "Gruener Apfel", cssClass: "acid-apple", kind: "bad", despawnTime: badDespawnTime }
};

let worm = [];
let currentDirection = directions.d;
let nextDirection = directions.d;
let objects = [];
let inventory = [];
let score = 0;
let gameState = "start";
let gameLoopId = null;
let currentTickDelay = 170;
let nextSpawnAt = 0;
let nextObjectId = 1;
let specialSpawnsWithoutBad = 0;
let highscore = loadHighscore();
let magnetizedObjectIds = [];
let boardPixelSize = 0;
let cellPixelSize = 0;
let wormSvg = null;
let wormBodyPath = null;
let wormHeadCircle = null;
let wormEyeOne = null;
let wormEyeTwo = null;
let wormSvgPadding = 0;

const settings = {
  speed: "normal",
  spawnRate: "normal",
  antiEpilepsy: false,
  enabledTypes: {
    slow: true,
    trim: true,
    ghost: true,
    magnet: true,
    timeStop: true,
    teleport: true,
    bad: true,
    disco: true,
    acid: true
  },
  durations: {
    slow: 5000,
    ghost: 5000,
    magnet: 5000,
    timeStop: 5000,
    disturbance: 4000,
    disco: 5000,
    acid: 5000
  }
};

const activeEffects = {
  slowUntil: 0,
  disturbedUntil: 0,
  discoUntil: 0,
  acidUntil: 0,
  ghostUntil: 0,
  magnetUntil: 0,
  timeStopUntil: 0
};

createBoard();
createInventorySlots();
resetGame();
render();

window.addEventListener("keydown", handleKeydown, { capture: true });
window.addEventListener("resize", handleWindowResize);
inventoryElement.addEventListener("click", handleInventoryClick);
speedSelectElement.addEventListener("change", handleSpeedChange);
spawnSelectElement.addEventListener("change", handleSpawnChange);
safetyToggleElement.addEventListener("change", handleSafetyToggle);
for (const [type, element] of Object.entries(toggleElements)) {
  element.addEventListener("change", () => handleTypeToggle(type, element.checked));
}
for (const [key, element] of Object.entries(durationInputs)) {
  element.addEventListener("change", () => handleDurationChange(key, element.value));
}

function createBoard() {
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const cell = document.createElement("div");
      const isLight = (x + y) % 2 === 0;

      cell.className = `cell ${isLight ? "light" : "dark"}`;
      boardElement.appendChild(cell);
      cells.push(cell);
    }
  }
}

function createInventorySlots() {
  for (let slotIndex = 0; slotIndex < inventorySize; slotIndex++) {
    const button = document.createElement("button");
    button.className = "inventory-slot";
    button.type = "button";
    button.dataset.slot = String(slotIndex);
    button.textContent = "+";
    inventoryElement.appendChild(button);
    inventorySlots.push(button);
  }
}

function handleWindowResize() {
  updateBoardMetrics();
  renderWormLayer();
}

function updateBoardMetrics() {
  const nextBoardPixelSize = boardElement.clientWidth;

  if (!nextBoardPixelSize || nextBoardPixelSize === boardPixelSize) {
    return;
  }

  boardPixelSize = nextBoardPixelSize;
  cellPixelSize = boardPixelSize / boardSize;
  wormSvgPadding = cellPixelSize * 3;
}

function ensureWormSvg() {
  if (wormSvg) {
    return;
  }

  wormSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  wormBodyPath = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  wormHeadCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  wormEyeOne = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  wormEyeTwo = document.createElementNS("http://www.w3.org/2000/svg", "circle");

  wormSvg.setAttribute("class", "worm-svg");
  wormBodyPath.setAttribute("class", "worm-path");
  wormBodyPath.setAttribute("fill", "none");
  wormBodyPath.setAttribute("stroke-linecap", "round");
  wormBodyPath.setAttribute("stroke-linejoin", "round");
  wormHeadCircle.setAttribute("class", "worm-head-shape");
  wormEyeOne.setAttribute("class", "worm-head-eye");
  wormEyeTwo.setAttribute("class", "worm-head-eye");

  wormSvg.appendChild(wormBodyPath);
  wormSvg.appendChild(wormHeadCircle);
  wormSvg.appendChild(wormEyeOne);
  wormSvg.appendChild(wormEyeTwo);
  wormLayerElement.appendChild(wormSvg);
}

function resetGame() {
  worm = [
    { x: 7, y: 8 },
    { x: 6, y: 8 },
    { x: 5, y: 8 }
  ];
  currentDirection = directions.d;
  nextDirection = directions.d;
  objects = [];
  inventory = [];
  score = 0;
  gameState = "start";
  currentTickDelay = getNormalTickDelay();
  nextSpawnAt = 0;
  nextObjectId = 1;
  specialSpawnsWithoutBad = 0;
  activeEffects.slowUntil = 0;
  activeEffects.disturbedUntil = 0;
  activeEffects.discoUntil = 0;
  activeEffects.acidUntil = 0;
  activeEffects.ghostUntil = 0;
  activeEffects.magnetUntil = 0;
  activeEffects.timeStopUntil = 0;
  ensureAtLeastOneApple();
  scoreElement.textContent = "0";
  renderHighscore();
  statusElement.textContent = "Bereit";
  updateEffectLabel();
  updateInventory();
  boardElement.classList.remove("disco-mode");
  pageElement.classList.remove("lsd-mode");
  showOverlay("Drücke Leertaste zum Starten.");
}

function startGame() {
  gameState = "running";
  nextSpawnAt = Date.now() + getSpecialRespawnDelay();
  statusElement.textContent = "Läuft";
  hideOverlay();
  restartGameLoop();
}

function restartGameLoop() {
  if (gameLoopId) {
    clearInterval(gameLoopId);
  }

  gameLoopId = setInterval(updateGame, currentTickDelay);
}

function gameOver(reason) {
  gameState = "gameover";
  statusElement.textContent = "Game Over";
  saveHighscoreIfNeeded();

  if (gameLoopId) {
    clearInterval(gameLoopId);
    gameLoopId = null;
  }

  showOverlay(`${reason} Drücke Leertaste für einen Neustart.`);
}

function handleKeydown(event) {
  const key = getNormalizedInputKey(event);

  if (!key) {
    return;
  }

  if (key === " ") {
    event.preventDefault();

    if (gameState === "start") {
      startGame();
    } else if (gameState === "gameover") {
      resetGame();
      render();
      startGame();
    }

    return;
  }

  if (handleInventoryHotkey(key)) {
    return;
  }

  const mappedKey = getMappedKey(key);
  const selectedDirection = directions[mappedKey];
  if (!selectedDirection || gameState === "gameover") {
    return;
  }

  event.preventDefault();

  if (isOppositeDirection(selectedDirection, currentDirection)) {
    return;
  }

  if (isTimeStopActive()) {
    currentDirection = selectedDirection;
    nextDirection = selectedDirection;
    moveWormOneStep(selectedDirection, Date.now());
    return;
  }

  nextDirection = selectedDirection;
}

function handleInventoryClick(event) {
  const slotButton = event.target.closest(".inventory-slot");
  if (!slotButton) {
    return;
  }

  const slotIndex = Number(slotButton.dataset.slot);
  const powerType = inventory[slotIndex];

  if (!powerType || gameState !== "running") {
    return;
  }

  useInventorySlot(slotIndex);
}

function activatePowerUp(powerType) {
  if (powerType === "slow") {
    activeEffects.slowUntil = Date.now() + settings.durations.slow;
    currentTickDelay = getSlowTickDelay();
    restartGameLoop();
    updateEffectLabel();
    return;
  }

  if (powerType === "trim") {
    worm = worm.slice(0, Math.max(minimumWormLength, worm.length - 3));
    updateEffectLabel();
    return;
  }

  if (powerType === "ghost") {
    activeEffects.ghostUntil = Date.now() + settings.durations.ghost;
    updateEffectLabel();
    return;
  }

  if (powerType === "magnet") {
    activeEffects.magnetUntil = Date.now() + settings.durations.magnet;
    updateEffectLabel();
    return;
  }

  if (powerType === "timeStop") {
    activeEffects.timeStopUntil = Date.now() + settings.durations.timeStop;
    updateEffectLabel();
  }
}

function updateGame() {
  const now = Date.now();

  updateTimedEffects(now);
  updateDespawns(now);
  maybeSpawnObject(now);

  if (isTimeStopActive()) {
    magnetizedObjectIds = [];
    render();
    return;
  }

  currentDirection = nextDirection;
  moveWormOneStep(currentDirection, now);
}

function moveWormOneStep(direction, now) {
  const activeNow = now || Date.now();
  const ghostActive = isGhostActive(activeNow);

  const head = worm[0];
  const nextHead = {
    x: head.x + direction.x,
    y: head.y + direction.y
  };

  if (!ghostActive && hitsWall(nextHead)) {
    render();
    gameOver("Du bist gegen die Wand gefahren.");
    return;
  }

  const objectAtNextHead = getObjectAt(nextHead.x, nextHead.y);
  const grows = objectAtNextHead && objectAtNextHead.type === "apple";
  const bodyToCheck = grows ? worm : worm.slice(0, -1);

  if (!ghostActive && bodyToCheck.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y)) {
    worm = [nextHead, ...worm];
    render();
    gameOver("Du bist in deinen eigenen Körper gefahren.");
    return;
  }

  worm.unshift(nextHead);

  if (objectAtNextHead) {
    handleCollectedObject(objectAtNextHead);
  }

  if (!grows) {
    worm.pop();
  }

  if (isMagnetActive(activeNow)) {
    applyMagnetEffect();
  } else {
    magnetizedObjectIds = [];
  }

  ensureAtLeastOneApple();

  if (!hasAnyFreeCell()) {
    render();
    gameOver("Kein freies Feld mehr. Du hast das Spielfeld vollgemacht.");
    return;
  }

  render();
}

function handleCollectedObject(boardObject, options = {}) {
  removeObject(boardObject.id);

  if (boardObject.type === "apple") {
    score += 1;
    scoreElement.textContent = String(score);

    if (options.magnet) {
      growWormByOne();
    }

    return;
  }

  if (
    boardObject.type === "slow" ||
    boardObject.type === "trim" ||
    boardObject.type === "ghost" ||
    boardObject.type === "magnet" ||
    boardObject.type === "timeStop"
  ) {
    addToInventory(boardObject.type);
    return;
  }

  if (boardObject.type === "bad") {
    activeEffects.disturbedUntil = Date.now() + settings.durations.disturbance;
    updateEffectLabel();
    return;
  }

  if (boardObject.type === "teleport") {
    teleportWorm();
    return;
  }

  if (boardObject.type === "disco") {
    if (settings.antiEpilepsy) {
      return;
    }

    activeEffects.discoUntil = Date.now() + settings.durations.disco;
    boardElement.classList.add("disco-mode");
    updateEffectLabel();
    return;
  }

  if (boardObject.type === "acid") {
    if (settings.antiEpilepsy) {
      return;
    }

    activeEffects.acidUntil = Date.now() + settings.durations.acid;
    pageElement.classList.add("lsd-mode");
    updateEffectLabel();
  }
}

function updateTimedEffects(now) {
  if (activeEffects.slowUntil && now >= activeEffects.slowUntil) {
    activeEffects.slowUntil = 0;
    currentTickDelay = getNormalTickDelay();
    restartGameLoop();
  }

  if (activeEffects.disturbedUntil && now >= activeEffects.disturbedUntil) {
    activeEffects.disturbedUntil = 0;
  }

  if (activeEffects.discoUntil && now >= activeEffects.discoUntil) {
    activeEffects.discoUntil = 0;
    boardElement.classList.remove("disco-mode");
  }

  if (activeEffects.acidUntil && now >= activeEffects.acidUntil) {
    activeEffects.acidUntil = 0;
    pageElement.classList.remove("lsd-mode");
  }

  if (activeEffects.ghostUntil && now >= activeEffects.ghostUntil) {
    activeEffects.ghostUntil = 0;

    if (!isWormHeadInsideBoard()) {
      render();
      gameOver("Ghost ist vorbei, aber dein Kopf ist noch außerhalb vom Spielfeld.");
      return;
    }
  }

  if (activeEffects.magnetUntil && now >= activeEffects.magnetUntil) {
    activeEffects.magnetUntil = 0;
  }

  if (activeEffects.timeStopUntil && now >= activeEffects.timeStopUntil) {
    activeEffects.timeStopUntil = 0;
  }

  updateEffectLabel();
}

function updateDespawns(now) {
  const expiredIds = objects
    .filter((boardObject) => boardObject.expiresAt && now >= boardObject.expiresAt)
    .map((boardObject) => boardObject.id);

  if (expiredIds.length === 0) {
    return;
  }

  objects = objects.filter((boardObject) => !expiredIds.includes(boardObject.id));
  scheduleNextSpawn();
}

function maybeSpawnObject(now) {
  if (gameState !== "running") {
    return;
  }

  if (objects.length >= maxObjects || now < nextSpawnAt) {
    return;
  }

  spawnRandomObject(now);
  nextSpawnAt = now + getSpecialRespawnDelay();
}

function spawnRandomObject(now) {
  const freeCell = getRandomFreeCell();
  if (!freeCell) {
    return;
  }

  const randomValue = Math.random();
  let type = "apple";

  if (randomValue >= getAppleSpawnThreshold()) {
    type = getRandomSpecialType() || "apple";
  }

  const definition = objectDefinitions[type];
  objects.push({
    id: nextObjectId++,
    type,
    x: freeCell.x,
    y: freeCell.y,
    expiresAt: definition.despawnTime ? now + definition.despawnTime : null
  });
}

function getRandomSpecialType() {
  const pool = settings.antiEpilepsy ? getSafeSpecialPool() : getNormalSpecialPool();
  const enabledPool = pool.filter((entry) => isTypeEnabled(entry.type));

  if (enabledPool.length === 0) {
    return null;
  }

  const badOptions = enabledPool.filter((entry) => objectDefinitions[entry.type].kind === "bad");
  if (specialSpawnsWithoutBad >= 2 && badOptions.length > 0) {
    const forcedBad = pickWeightedType(badOptions);
    specialSpawnsWithoutBad = 0;
    return forcedBad;
  }

  const pickedType = pickWeightedType(enabledPool);
  if (!pickedType) {
    return null;
  }

  if (objectDefinitions[pickedType].kind === "bad") {
    specialSpawnsWithoutBad = 0;
  } else {
    specialSpawnsWithoutBad += 1;
  }

  return pickedType;
}

function ensureAtLeastOneApple() {
  const appleCount = objects.filter((boardObject) => boardObject.type === "apple").length;

  if (appleCount > 0 || objects.length >= maxObjects) {
    return;
  }

  const freeCell = getRandomFreeCell();
  if (!freeCell) {
    return;
  }

  objects.push({
    id: nextObjectId++,
    type: "apple",
    x: freeCell.x,
    y: freeCell.y,
    expiresAt: null
  });
}

function addToInventory(powerType) {
  if (inventory.length < inventorySize) {
    inventory.push(powerType);
    updateInventory();
    return;
  }

  score += 1;
  scoreElement.textContent = String(score);
  saveHighscoreIfNeeded();
}

function handleInventoryHotkey(key) {
  const slotIndex = Number(key) - 1;

  if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex >= inventorySize) {
    return false;
  }

  if (gameState !== "running") {
    return true;
  }

  useInventorySlot(slotIndex);
  return true;
}

function useInventorySlot(slotIndex) {
  const powerType = inventory[slotIndex];
  if (!powerType) {
    return;
  }

  activatePowerUp(powerType);
  inventory.splice(slotIndex, 1);
  updateInventory();
  render();
}

function updateInventory() {
  inventorySlots.forEach((slot, index) => {
    const powerType = inventory[index];
    slot.className = "inventory-slot";

    if (!powerType) {
      slot.textContent = "+";
      slot.disabled = true;
      return;
    }

    slot.disabled = false;
    slot.classList.add("filled", powerType);
    slot.textContent = getInventoryLabel(powerType);
  });
}

function getInventoryLabel(powerType) {
  if (powerType === "slow") {
    return "Slow";
  }

  if (powerType === "trim") {
    return "Kurz";
  }

  if (powerType === "ghost") {
    return "Ghost";
  }

  if (powerType === "magnet") {
    return "Magnet";
  }

  if (powerType === "teleport") {
    return "Teleport";
  }

  if (powerType === "timeStop") {
    return "Stop";
  }

  return "?";
}

function updateEffectLabel() {
  const effectTexts = [];

  if (activeEffects.slowUntil) {
    effectTexts.push("Slowmotion");
  }

  if (activeEffects.disturbedUntil) {
    effectTexts.push("Bewegung gestört");
  }

  if (activeEffects.discoUntil) {
    effectTexts.push("Disco");
  }

  if (activeEffects.acidUntil) {
    effectTexts.push("Farbrausch");
  }

  if (activeEffects.ghostUntil) {
    effectTexts.push("Ghost");
  }

  if (activeEffects.magnetUntil) {
    effectTexts.push("Magnet");
  }

  if (activeEffects.timeStopUntil) {
    effectTexts.push("Time Stop");
  }

  effectElement.textContent = effectTexts.length > 0 ? effectTexts.join(", ") : "Keiner";
}

function loadHighscore() {
  try {
    const rawValue = window.localStorage.getItem(highscoreStorageKey);
    const parsedValue = Number(rawValue);

    if (Number.isFinite(parsedValue) && parsedValue >= 0) {
      return parsedValue;
    }
  } catch (error) {
    return 0;
  }

  return 0;
}

function saveHighscoreIfNeeded() {
  if (score <= highscore) {
    return;
  }

  highscore = score;
  renderHighscore();

  try {
    window.localStorage.setItem(highscoreStorageKey, String(highscore));
  } catch (error) {
    return;
  }
}

function renderHighscore() {
  highscoreElement.textContent = `Highscore: ${highscore}`;
}

function render() {
  const objectPositions = new Map();
  const magnetizedIds = new Set(magnetizedObjectIds);

  for (const boardObject of objects) {
    objectPositions.set(`${boardObject.x},${boardObject.y}`, boardObject);
  }

  for (let index = 0; index < cells.length; index++) {
    const x = index % boardSize;
    const y = Math.floor(index / boardSize);
    const cell = cells[index];
    const boardObject = objectPositions.get(`${x},${y}`) || null;

    cell.classList.remove(
      "apple",
      "power-slow",
      "power-trim",
      "power-ghost",
      "power-magnet",
      "power-teleport",
      "power-time-stop",
      "bad-apple",
      "disco",
      "acid-apple",
      "magnetized"
    );

    if (boardObject) {
      cell.classList.add(objectDefinitions[boardObject.type].cssClass);

      if (magnetizedIds.has(boardObject.id)) {
        cell.classList.add("magnetized");
      }
    }
  }

  renderWormLayer();
}

function renderWormLayer() {
  updateBoardMetrics();
  ensureWormSvg();

  if (!cellPixelSize || !boardPixelSize) {
    return;
  }

  const svgSize = boardPixelSize + wormSvgPadding * 2;
  const head = worm[0];
  const bodyWidth = cellPixelSize * 0.56;
  const headRadius = cellPixelSize * 0.28;
  const eyeRadius = Math.max(1.6, cellPixelSize * 0.05);

  wormSvg.setAttribute("width", String(svgSize));
  wormSvg.setAttribute("height", String(svgSize));
  wormSvg.setAttribute("viewBox", `0 0 ${svgSize} ${svgSize}`);
  wormSvg.style.position = "absolute";
  wormSvg.style.left = `${-wormSvgPadding}px`;
  wormSvg.style.top = `${-wormSvgPadding}px`;

  wormBodyPath.setAttribute(
    "points",
    worm
      .map((segment) => {
        const centerX = wormSvgPadding + (segment.x + 0.5) * cellPixelSize;
        const centerY = wormSvgPadding + (segment.y + 0.5) * cellPixelSize;
        return `${centerX},${centerY}`;
      })
      .join(" ")
  );
  wormBodyPath.setAttribute("stroke-width", String(bodyWidth));

  const headCenterX = wormSvgPadding + (head.x + 0.5) * cellPixelSize;
  const headCenterY = wormSvgPadding + (head.y + 0.5) * cellPixelSize;
  const headDirection = getHeadVector();
  const perpendicular = { x: -headDirection.y, y: headDirection.x };
  const eyeForward = cellPixelSize * 0.11;
  const eyeSide = cellPixelSize * 0.1;

  wormHeadCircle.setAttribute("cx", String(headCenterX));
  wormHeadCircle.setAttribute("cy", String(headCenterY));
  wormHeadCircle.setAttribute("r", String(headRadius));

  wormEyeOne.setAttribute("r", String(eyeRadius));
  wormEyeTwo.setAttribute("r", String(eyeRadius));
  wormEyeOne.setAttribute("cx", String(headCenterX + headDirection.x * eyeForward + perpendicular.x * eyeSide));
  wormEyeOne.setAttribute("cy", String(headCenterY + headDirection.y * eyeForward + perpendicular.y * eyeSide));
  wormEyeTwo.setAttribute("cx", String(headCenterX + headDirection.x * eyeForward - perpendicular.x * eyeSide));
  wormEyeTwo.setAttribute("cy", String(headCenterY + headDirection.y * eyeForward - perpendicular.y * eyeSide));
}

function getHeadVector() {
  if (worm.length > 1) {
    const neck = worm[1];
    const head = worm[0];
    const xOffset = head.x - neck.x;
    const yOffset = head.y - neck.y;

    if (xOffset !== 0 || yOffset !== 0) {
      return { x: xOffset, y: yOffset };
    }
  }

  return { x: currentDirection.x, y: currentDirection.y };
}

function getObjectAt(x, y) {
  return objects.find((boardObject) => boardObject.x === x && boardObject.y === y) || null;
}

function removeObject(objectId) {
  objects = objects.filter((boardObject) => boardObject.id !== objectId);
  scheduleNextSpawn();
}

function scheduleNextSpawn() {
  if (gameState === "running") {
    nextSpawnAt = Date.now() + getSpecialRespawnDelay();
  }
}

function getWormSegmentIndexAt(x, y) {
  return worm.findIndex((segment) => segment.x === x && segment.y === y);
}

function getSegmentClasses(segmentIndex) {
  if (segmentIndex === 0) {
    return ["head", `head-${getDirectionNameFromOffset(currentDirection.x, currentDirection.y)}`];
  }

  if (segmentIndex === worm.length - 1) {
    const previousSegment = worm[segmentIndex - 1];
    const tailSegment = worm[segmentIndex];
    const xOffset = previousSegment.x - tailSegment.x;
    const yOffset = previousSegment.y - tailSegment.y;

    return ["tail", `tail-${getDirectionNameFromOffset(xOffset, yOffset)}`];
  }

  const previousSegment = worm[segmentIndex - 1];
  const currentSegment = worm[segmentIndex];
  const nextSegment = worm[segmentIndex + 1];
  const previousDirection = {
    x: previousSegment.x - currentSegment.x,
    y: previousSegment.y - currentSegment.y
  };
  const nextDirectionPart = {
    x: nextSegment.x - currentSegment.x,
    y: nextSegment.y - currentSegment.y
  };
  const directionNames = [
    getDirectionNameFromOffset(previousDirection.x, previousDirection.y),
    getDirectionNameFromOffset(nextDirectionPart.x, nextDirectionPart.y)
  ].sort();

  if (directionNames.includes("left") && directionNames.includes("right")) {
    return ["worm", "body-horizontal"];
  }

  if (directionNames.includes("up") && directionNames.includes("down")) {
    return ["worm", "body-vertical"];
  }

  if (directionNames.includes("right") && directionNames.includes("up")) {
    return ["worm", "corner-up-right"];
  }

  if (directionNames.includes("down") && directionNames.includes("right")) {
    return ["worm", "corner-right-down"];
  }

  if (directionNames.includes("down") && directionNames.includes("left")) {
    return ["worm", "corner-down-left"];
  }

  return ["worm", "corner-left-up"];
}

function getDirectionNameFromOffset(x, y) {
  if (x === 1) {
    return "right";
  }

  if (x === -1) {
    return "left";
  }

  if (y === 1) {
    return "down";
  }

  return "up";
}

function getMappedKey(key) {
  const normalizedKeyMap = {
    arrowup: "w",
    arrowdown: "s",
    arrowleft: "a",
    left: "a",
    up: "w",
    right: "d",
    down: "s",
    arrowright: "d"
  };
  const normalizedKey = normalizedKeyMap[key] || key;

  if (!activeEffects.disturbedUntil) {
    return normalizedKey;
  }

  const disturbedMap = {
    w: "s",
    s: "w",
    a: "d",
    d: "a"
  };

  return disturbedMap[normalizedKey] || normalizedKey;
}

function getNormalizedInputKey(event) {
  const rawKey = typeof event.key === "string" ? event.key.toLowerCase() : "";
  if (rawKey) {
    return rawKey;
  }

  const codeMap = {
    arrowup: "arrowup",
    arrowdown: "arrowdown",
    arrowleft: "arrowleft",
    arrowright: "arrowright",
    keyw: "w",
    keya: "a",
    keys: "s",
    keyd: "d",
    digit1: "1",
    digit2: "2",
    digit3: "3",
    digit4: "4",
    digit5: "5",
    space: " "
  };
  const rawCode = typeof event.code === "string" ? event.code.toLowerCase() : "";

  return codeMap[rawCode] || "";
}

function getRandomFreeCell() {
  const freeCells = [];

  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      if (isCellFree(x, y)) {
        freeCells.push({ x, y });
      }
    }
  }

  if (freeCells.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * freeCells.length);
  return freeCells[randomIndex];
}

function hasAnyFreeCell() {
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      if (isCellFree(x, y)) {
        return true;
      }
    }
  }

  return false;
}

function isCellFree(x, y) {
  const wormOccupiesCell = worm.some((segment) => segment.x === x && segment.y === y);
  const objectOccupiesCell = objects.some((boardObject) => boardObject.x === x && boardObject.y === y);

  return !wormOccupiesCell && !objectOccupiesCell;
}

function teleportWorm() {
  const possiblePositions = [];
  const currentHead = worm[0];

  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const xOffset = x - currentHead.x;
      const yOffset = y - currentHead.y;

      if (xOffset === 0 && yOffset === 0) {
        continue;
      }

      const translatedWorm = worm.map((segment) => ({
        x: segment.x + xOffset,
        y: segment.y + yOffset
      }));

      if (translatedWorm.every((segment) => isTeleportCellFree(segment.x, segment.y))) {
        possiblePositions.push(translatedWorm);
      }
    }
  }

  if (possiblePositions.length === 0) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * possiblePositions.length);
  worm = possiblePositions[randomIndex];
}

function isTimeStopActive() {
  return activeEffects.timeStopUntil && Date.now() < activeEffects.timeStopUntil;
}

function isGhostActive(now) {
  const activeNow = now || Date.now();
  return Boolean(activeEffects.ghostUntil && activeNow < activeEffects.ghostUntil);
}

function isMagnetActive(now) {
  const activeNow = now || Date.now();
  return Boolean(activeEffects.magnetUntil && activeNow < activeEffects.magnetUntil);
}

function isTeleportCellFree(x, y) {
  if (x < 0 || y < 0 || x >= boardSize || y >= boardSize) {
    return false;
  }

  return !objects.some((boardObject) => boardObject.x === x && boardObject.y === y);
}

function isWormHeadInsideBoard() {
  const head = worm[0];

  return (
    head.x >= 0 &&
    head.y >= 0 &&
    head.x < boardSize &&
    head.y < boardSize
  );
}

function hitsWall(position) {
  if (isGhostActive()) {
    return false;
  }

  return (
    position.x < 0 ||
    position.y < 0 ||
    position.x >= boardSize ||
    position.y >= boardSize
  );
}

function isOppositeDirection(next, current) {
  return next.x === current.x * -1 && next.y === current.y * -1;
}

function showOverlay(text) {
  overlayTextElement.textContent = text;
  overlayElement.classList.remove("hidden");
}

function hideOverlay() {
  overlayElement.classList.add("hidden");
}

function getNormalTickDelay() {
  if (settings.speed === "slow") {
    return 220;
  }

  if (settings.speed === "fast") {
    return 130;
  }

  return 170;
}

function getSlowTickDelay() {
  if (settings.speed === "slow") {
    return 320;
  }

  if (settings.speed === "fast") {
    return 200;
  }

  return 260;
}

function getSpecialRespawnDelay() {
  if (settings.spawnRate === "low") {
    return 3200;
  }

  if (settings.spawnRate === "high") {
    return 1100;
  }

  return 2000;
}

function getAppleSpawnThreshold() {
  if (settings.spawnRate === "low") {
    return 0.75;
  }

  if (settings.spawnRate === "high") {
    return 0.45;
  }

  return 0.6;
}

function handleSpeedChange(event) {
  settings.speed = event.target.value;

  currentTickDelay = activeEffects.slowUntil ? getSlowTickDelay() : getNormalTickDelay();

  if (gameState === "running") {
    restartGameLoop();
  }
}

function handleSpawnChange(event) {
  settings.spawnRate = event.target.value;

  if (gameState === "running") {
    nextSpawnAt = Date.now() + getSpecialRespawnDelay();
  }
}

function handleSafetyToggle(event) {
  settings.antiEpilepsy = event.target.checked;

  if (settings.antiEpilepsy) {
    disableVisualHazards();
  }
}

function handleTypeToggle(type, isEnabled) {
  settings.enabledTypes[type] = isEnabled;
  removeDisabledContent();
}

function handleDurationChange(key, value) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    durationInputs[key].value = String(settings.durations[key] / 1000);
    return;
  }

  const clampedSeconds = Math.min(30, Math.max(1, parsedValue));
  settings.durations[key] = clampedSeconds * 1000;
  durationInputs[key].value = String(clampedSeconds);
}

function disableVisualHazards() {
  activeEffects.discoUntil = 0;
  activeEffects.acidUntil = 0;
  boardElement.classList.remove("disco-mode");
  pageElement.classList.remove("lsd-mode");
  objects = objects.filter((boardObject) => {
    return boardObject.type !== "disco" && boardObject.type !== "acid";
  });
  updateEffectLabel();
  render();
}

function applyMagnetEffect() {
  const head = worm[0];
  magnetizedObjectIds = [];
  const targets = objects.filter((boardObject) => {
    return (
      isMagnetTargetType(boardObject.type) &&
      Math.abs(boardObject.x - head.x) <= magnetRadius &&
      Math.abs(boardObject.y - head.y) <= magnetRadius
    );
  });

  for (const target of targets) {
    magnetizedObjectIds.push(target.id);
    pullObjectTowardHead(target, head);
  }
}

function isMagnetTargetType(type) {
  return (
    type === "apple" ||
    type === "slow" ||
    type === "trim" ||
    type === "ghost" ||
    type === "magnet" ||
    type === "timeStop" ||
    type === "disco" ||
    type === "acid"
  );
}

function growWormByOne() {
  const tail = worm[worm.length - 1];
  worm.push({ x: tail.x, y: tail.y });
}

function pullObjectTowardHead(boardObject, head) {
  const nextX = boardObject.x + Math.sign(head.x - boardObject.x);
  const nextY = boardObject.y + Math.sign(head.y - boardObject.y);

  if (nextX === head.x && nextY === head.y) {
    handleCollectedObject(boardObject, { magnet: true });
    return;
  }

  const collidesWithWorm = worm.some((segment) => segment.x === nextX && segment.y === nextY);
  const collidesWithObject = objects.some((otherObject) => {
    return otherObject.id !== boardObject.id && otherObject.x === nextX && otherObject.y === nextY;
  });

  if (collidesWithWorm || collidesWithObject) {
    return;
  }

  boardObject.x = nextX;
  boardObject.y = nextY;
}

function removeDisabledContent() {
  objects = objects.filter((boardObject) => {
    if (boardObject.type === "apple") {
      return true;
    }

    return isTypeEnabled(boardObject.type);
  });

  inventory = inventory.filter((powerType) => isTypeEnabled(powerType));

  if (!isTypeEnabled("disco")) {
    activeEffects.discoUntil = 0;
    boardElement.classList.remove("disco-mode");
  }

  if (!isTypeEnabled("acid")) {
    activeEffects.acidUntil = 0;
    pageElement.classList.remove("lsd-mode");
  }

  updateInventory();
  updateEffectLabel();
  render();
}

function isTypeEnabled(type) {
  if (!settings.enabledTypes[type]) {
    return false;
  }

  if (settings.antiEpilepsy && (type === "disco" || type === "acid")) {
    return false;
  }

  return true;
}

function getNormalSpecialPool() {
  return [
    { type: "slow", weight: 24 },
    { type: "trim", weight: 14 },
    { type: "ghost", weight: 18 },
    { type: "magnet", weight: 12 },
    { type: "teleport", weight: 12 },
    { type: "timeStop", weight: 12 },
    { type: "bad", weight: 8 },
    { type: "disco", weight: 5 },
    { type: "acid", weight: 3 }
  ];
}

function getSafeSpecialPool() {
  return [
    { type: "slow", weight: 26 },
    { type: "trim", weight: 20 },
    { type: "ghost", weight: 18 },
    { type: "magnet", weight: 22 },
    { type: "timeStop", weight: 16 },
    { type: "teleport", weight: 10 }
  ];
}

function pickWeightedType(pool) {
  const totalWeight = pool.reduce((sum, entry) => sum + entry.weight, 0);
  if (totalWeight <= 0) {
    return null;
  }

  let roll = Math.random() * totalWeight;

  for (const entry of pool) {
    roll -= entry.weight;
    if (roll <= 0) {
      return entry.type;
    }
  }

  return pool[pool.length - 1].type;
}
