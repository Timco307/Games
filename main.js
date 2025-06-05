// --- Game Meta (import from game.js or define here if not present) ---
var GAME_VERSION = typeof GAME_VERSION !== 'undefined' ? GAME_VERSION : '1.0.0';
var GAME_MODEL = typeof GAME_MODEL !== 'undefined' ? GAME_MODEL : 'z';

// --- Game State ---
let totalClicks = 0;
let rarestFind = null;
let log = [];
let achievements = [
  { id: 'firstClick', name: 'First Click!', desc: 'Click the button once.', unlocked: false },
  { id: 'tenClicks', name: 'Click Novice', desc: 'Click 10 times.', unlocked: false },
  { id: 'fiftyClicks', name: 'Click Pro', desc: 'Click 50 times.', unlocked: false }
];

// ==== RARITIES & POINTS ====
const rarities = [
  { name: "Common", chance: 18 },
  { name: "Uncommon", chance: 14 },
  { name: "Unusual", chance: 10 },
  { name: "Weird", chance: 7 },
  { name: "Odd", chance: 6 },
  { name: "Curious", chance: 5.5 },
  { name: "Rare", chance: 5 },
  { name: "Unreal", chance: 4.6 },
  { name: "Super Rare", chance: 4.2 },
  { name: "Ultra Rare", chance: 3.8 },
  { name: "Epic", chance: 3.4 },
  { name: "Very Epic", chance: 3.0 },
  { name: "Insane", chance: 2.7 },
  { name: "Legendary", chance: 2.4 },
  { name: "Mythic", chance: 2.1 },
  { name: "Chroma", chance: 1.9 },
  { name: "Godly", chance: 1.7 },
  { name: "Impossible", chance: 1.5 },
  { name: "Ethereal", chance: 1.3 },
  { name: "Extraordinary", chance: 1.1 },
  { name: "Cosmic", chance: 0.95 },
  { name: "Transcendent", chance: 0.9 },
  { name: "Paradoxical", chance: 0.8 },
  { name: "Absolute", chance: 0.7 },
  { name: "Omniversal", chance: 0.65 },
  { name: "Impossible+", chance: 0.6 },
  { name: "Divine", chance: 0.55 },
  { name: "Singular", chance: 0.5 },
  { name: "Eternal", chance: 0.48 },
  { name: "Quantum", chance: 0.46 },
  { name: "Quantum+", chance: 0.44 },
  { name: "Fractal", chance: 0.42 },
  { name: "Glitched", chance: 0.4 },
  { name: "Exotic", chance: 0.38 },
  { name: "Hallowed", chance: 0.36 },
  { name: "Primordial", chance: 0.34 },
  { name: "Nuclear", chance: 0.32 },
  { name: "Radiant", chance: 0.3 },
  { name: "Corrupted", chance: 0.28 },
  { name: "Frozen", chance: 0.25 },
  { name: "Infernal", chance: 0.22 },
  { name: "Parallel", chance: 0.2 },
  { name: "Temporal", chance: 0.19 },
  { name: "Anomalous", chance: 0.18 },
  { name: "Ascended", chance: 0.17 },
  { name: "Unobtainium", chance: 0.16 },
  { name: "Galactic", chance: 0.15 },
  { name: "Supreme", chance: 0.14 },
  { name: "Ancient", chance: 0.13 },
  { name: "Enigmatic", chance: 0.12 },
  { name: "Spectral", chance: 0.11 },
  { name: "Astral", chance: 0.1 },
  { name: "Solar", chance: 0.09 },
  { name: "Lunar", chance: 0.085 },
  { name: "Stellar", chance: 0.08 },
  { name: "Nebulous", chance: 0.075 },
  { name: "Void", chance: 0.07 },
  { name: "Dimensional", chance: 0.065 },
  { name: "Hyper", chance: 0.06 },
  { name: "Ultra", chance: 0.055 },
  { name: "Mega", chance: 0.05 },
  { name: "Nano", chance: 0.045 },
  { name: "Micro", chance: 0.04 },
  { name: "Pico", chance: 0.035 },
  { name: "Femto", chance: 0.03 },
  { name: "Atto", chance: 0.025 },
  { name: "Zepto", chance: 0.021 },
  { name: "Yocto", chance: 0.019 },
  { name: "Planck", chance: 0.017 },
  { name: "Infinity", chance: 0.015 },
  { name: "Omega", chance: 0.013 },
  { name: "Alpha", chance: 0.011 },
  { name: "Beta", chance: 0.009 },
  { name: "Gamma", chance: 0.008 },
  { name: "Delta", chance: 0.007 },
  { name: "Epsilon", chance: 0.006 },
  { name: "Zeta", chance: 0.005 },
  { name: "Theta", chance: 0.004 },
  { name: "Iota", chance: 0.003 },
  { name: "Kappa", chance: 0.0025 },
  { name: "Lambda", chance: 0.002 },
  { name: "Sigma", chance: 0.0018 },
  { name: "Tau", chance: 0.0016 },
  { name: "Upsilon", chance: 0.0014 },
  { name: "Phi", chance: 0.0012 },
  { name: "Chi", chance: 0.0011 },
  { name: "Psi", chance: 0.001 },
  { name: "Omega+", chance: 0.0009 },
  { name: "Reality", chance: 0.0008 },
  { name: "Oblivion", chance: 0.0007 },
  { name: "Unseen", chance: 0.0006 },
  { name: "Shadow", chance: 0.0005 },
  { name: "Ghost", chance: 0.0004 },
  { name: "Phantom", chance: 0.0003 },
  { name: "Ultra Secret", chance: 0.0002 },
  { name: "Secret", chance: 0.0001 },
  { name: "???", chance: 0.00005 }
];
const rarityPoints = {};
rarities.forEach((r, i) => {
  if (r.name === "Uncommon") {
    rarityPoints[r.name] = -20;
  } else {
    rarityPoints[r.name] = Math.max(1, Math.floor(10 - i / 10));
  }
});

// --- Points State ---
let points = 0;
let unlockedRarities = [];

function updatePointsDisplay() {
  const el = document.getElementById('pointsDisplayShop');
  if (el) el.textContent = points;
}

// --- Modal and Button Logic ---
function toggleSettingsModal() {
  const modal = document.getElementById('settingsModal');
  modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
}
function toggleShopModal() {
  const modal = document.getElementById('shopModal');
  modal.style.display = (modal.style.display === 'block') ? 'none' : 'block';
}
function openSaveModal(mode) {
  const modal = document.getElementById('saveModal');
  modal.style.display = 'block';
  document.getElementById('saveModalTitle').textContent = mode === 'export' ? 'Export Save' : 'Import Save';
  document.getElementById('copySaveBtn').style.display = mode === 'export' ? '' : 'none';
  document.getElementById('downloadSaveBtn').style.display = mode === 'export' ? '' : 'none';
  document.getElementById('importSaveBtn').style.display = mode === 'import' ? '' : 'none';
  document.getElementById('saveTextarea').value = '';
  document.getElementById('importError').textContent = '';
}
function closeSaveModal() {
  document.getElementById('saveModal').style.display = 'none';
}
function copySaveToClipboard() {
  const textarea = document.getElementById('saveTextarea');
  textarea.select();
  document.execCommand('copy');
}
function downloadSave() {
  const textarea = document.getElementById('saveTextarea');
  const blob = new Blob([textarea.value], {type: 'text/plain'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'rarity_clicker_save.txt';
  a.click();
}
function importSave() {
  alert('Import not implemented.');
}
function resetGame() {
  // Hard reset: everything
  points = 0;
  totalClicks = 0;
  rarestFind = null;
  log = [];
  unlockedRarities = [];
  autoClickers = 0;
  doublePointsActive = false;
  goldenClickActive = false;
  luckBoostActive = false;
  timeFreezeActive = false;
  goldenModeActive = false;
  timer = 0;
  stage = 1;
  achievements.forEach(a => a.unlocked = false);
  updateStageDisplay();
  updateShopButtonLabels();
  rarities.forEach(r => { r.scaledChance = r.chance; });
  document.getElementById('totalClicks').textContent = totalClicks;
  document.getElementById('rarestFind').textContent = 'None';
  document.getElementById('timer').textContent = `Time: 0s`;
  updateBuffTimers();
  updateAchievementsDisplay();
  updatePointsDisplay();
  updateUnlockedRaritiesBox();
  updateShopStatus();
  updateShopButtonLabels();
  updateStageDisplay();
  const logList = document.getElementById('log');
  logList.innerHTML = '<li id="logFallback">No finds yet. Start clicking!</li>';
  saveGameToStorage();
}

function softResetGame() {
  // Soft reset: keep achievements, reset everything else
  points = 0;
  totalClicks = 0;
  rarestFind = null;
  log = [];
  unlockedRarities = [];
  autoClickers = 0;
  doublePointsActive = false;
  goldenClickActive = false;
  luckBoostActive = false;
  timeFreezeActive = false;
  goldenModeActive = false;
  timer = 0;
  stage = 1;
  updateStageDisplay();
  updateShopButtonLabels();
  rarities.forEach(r => { r.scaledChance = r.chance; });
  document.getElementById('totalClicks').textContent = totalClicks;
  document.getElementById('rarestFind').textContent = 'None';
  document.getElementById('timer').textContent = `Time: 0s`;
  updateBuffTimers();
  updateAchievementsDisplay();
  updatePointsDisplay();
  updateUnlockedRaritiesBox();
  updateShopStatus();
  updateShopButtonLabels();
  updateStageDisplay();
  const logList = document.getElementById('log');
  logList.innerHTML = '<li id="logFallback">No finds yet. Start clicking!</li>';
  saveGameToStorage();
}

// --- Achievements Logic ---
// Add rarity achievements
const rarityAchievements = rarities.map(r => ({
  id: 'rarity_' + r.name.replace(/\s+/g, '').toLowerCase(),
  name: r.name + ' Found',
  desc: 'Unlock the ' + r.name + ' rarity.',
  unlocked: false,
  rarity: r.name
}));
achievements = achievements.concat(rarityAchievements);

function updateLogDisplay() {
  const logList = document.getElementById('log');
  logList.innerHTML = '';
  // Make the log box itself two columns using flex
  logList.style.display = 'flex';
  logList.style.flexDirection = 'row';
  logList.style.justifyContent = 'space-between';
  logList.style.alignItems = 'flex-start';
  logList.style.width = '100%';
  // Split log into two columns
  const half = Math.ceil(log.length / 2);
  const col1 = log.slice(0, half);
  const col2 = log.slice(half);
  const colDiv1 = document.createElement('div');
  const colDiv2 = document.createElement('div');
  colDiv1.style.width = colDiv2.style.width = '48%';
  col1.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    colDiv1.appendChild(li);
  });
  col2.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    colDiv2.appendChild(li);
  });
  logList.appendChild(colDiv1);
  logList.appendChild(colDiv2);
  if (log.length === 0) {
    logList.innerHTML = '<li id="logFallback">No finds yet. Start clicking!</li>';
  }
}

function updateAchievementsDisplay() {
  const container = document.getElementById('achievementsContainer');
  if (!container) return;
  container.innerHTML = '';
  let any = false;
  // Make the achievements box two columns using flex
  container.style.display = 'flex';
  container.style.flexDirection = 'row';
  container.style.justifyContent = 'space-between';
  container.style.alignItems = 'flex-start';
  container.style.width = '100%';
  // Sort achievements by rarity order for rarity achievements
  const rarityOrder = rarities.map(r => r.name);
  const sorted = achievements.slice().sort((a, b) => {
    if (a.id.startsWith('rarity_') && b.id.startsWith('rarity_')) {
      return rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity);
    }
    return 0;
  });
  // Split achievements into two columns
  const half = Math.ceil(sorted.length / 2);
  const col1 = sorted.slice(0, half);
  const col2 = sorted.slice(half);
  const colDiv1 = document.createElement('div');
  const colDiv2 = document.createElement('div');
  colDiv1.style.width = colDiv2.style.width = '48%';
  col1.forEach(a => {
    if (a.unlocked) {
      any = true;
      const div = document.createElement('div');
      div.className = 'achievement unlocked';
      div.style.background = '#2ecc40';
      div.style.color = 'white';
      div.innerHTML = `<b>${a.name}</b><br><span style='font-size:0.9em;'>${a.desc}</span>`;
      colDiv1.appendChild(div);
    }
  });
  col2.forEach(a => {
    if (a.unlocked) {
      any = true;
      const div = document.createElement('div');
      div.className = 'achievement unlocked';
      div.style.background = '#2ecc40';
      div.style.color = 'white';
      div.innerHTML = `<b>${a.name}</b><br><span style='font-size:0.9em;'>${a.desc}</span>`;
      colDiv2.appendChild(div);
    }
  });
  container.appendChild(colDiv1);
  container.appendChild(colDiv2);
  if (!any) {
    container.innerHTML = '<div style="color:#888;">No achievements yet.</div>';
  }
}
function checkAchievements() {
  achievements.forEach(a => {
    if (!a.unlocked) {
      if (a.id === 'firstClick' && totalClicks >= 1) a.unlocked = true;
      if (a.id === 'tenClicks' && totalClicks >= 10) a.unlocked = true;
      if (a.id === 'fiftyClicks' && totalClicks >= 50) a.unlocked = true;
      // Rarity achievements
      if (a.id.startsWith('rarity_') && unlockedRarities.includes(a.rarity)) a.unlocked = true;
    }
  });
  updateAchievementsDisplay();
}

// --- Buff State ---
let autoClickers = 0;
let doublePointsActive = false;
let doublePointsTimeout = null;
let goldenClickActive = false;
let luckBoostActive = false;
let luckBoostTimeout = null;
let timeFreezeActive = false;
let timeFreezeTimeout = null;
let goldenModeActive = false;
let goldenModeTimeout = null;
let autoClickerInterval = null;
let timer = 0;
let timerInterval = null;

function updateBuffTimers() {
  const buffDiv = document.getElementById('buffTimers');
  if (!buffDiv) return;
  let buffs = [];
  if (doublePointsActive && doublePointsTimeout) {
    let ms = 0;
    if (typeof doublePointsTimeout._idleStart !== 'undefined' && typeof doublePointsTimeout._idleTimeout !== 'undefined') {
      ms = Math.max(0, Math.ceil((doublePointsTimeout._idleStart + doublePointsTimeout._idleTimeout - Date.now()) / 1000));
    } else if (doublePointsTimeout.expires) {
      ms = Math.max(0, Math.ceil((doublePointsTimeout.expires - Date.now()) / 1000));
    }
    buffs.push(`<span style="color:gold;">Double Points: ${ms}s</span>`);
  }
  if (goldenClickActive) buffs.push('<span style="color:orange;">Golden Click Ready</span>');
  if (luckBoostActive && luckBoostTimeout) {
    let ms = 0;
    if (typeof luckBoostTimeout._idleStart !== 'undefined' && typeof luckBoostTimeout._idleTimeout !== 'undefined') {
      ms = Math.max(0, Math.ceil((luckBoostTimeout._idleStart + luckBoostTimeout._idleTimeout - Date.now()) / 1000));
    } else if (luckBoostTimeout.expires) {
      ms = Math.max(0, Math.ceil((luckBoostTimeout.expires - Date.now()) / 1000));
    }
    buffs.push(`<span style="color:lime;">Luck Boost: ${ms}s</span>`);
  }
  if (timeFreezeActive && timeFreezeTimeout) {
    let ms = 0;
    if (typeof timeFreezeTimeout._idleStart !== 'undefined' && typeof timeFreezeTimeout._idleTimeout !== 'undefined') {
      ms = Math.max(0, Math.ceil((timeFreezeTimeout._idleStart + timeFreezeTimeout._idleTimeout - Date.now()) / 1000));
    } else if (timeFreezeTimeout.expires) {
      ms = Math.max(0, Math.ceil((timeFreezeTimeout.expires - Date.now()) / 1000));
    }
    buffs.push(`<span style="color:cyan;">Time Freeze: ${ms}s</span>`);
  }
  if (goldenModeActive && goldenModeTimeout) {
    let ms = 0;
    if (typeof goldenModeTimeout._idleStart !== 'undefined' && typeof goldenModeTimeout._idleTimeout !== 'undefined') {
      ms = Math.max(0, Math.ceil((goldenModeTimeout._idleStart + goldenModeTimeout._idleTimeout - Date.now()) / 1000));
    } else if (goldenModeTimeout.expires) {
      ms = Math.max(0, Math.ceil((goldenModeTimeout.expires - Date.now()) / 1000));
    }
    buffs.push(`<span style="color:gold;">Golden Mode: ${ms}s</span>`);
  }
  buffDiv.innerHTML = buffs.join(' ');
}

function startAutoClicker() {
  if (!autoClickerInterval) {
    autoClickerInterval = setInterval(() => {
      for (let i = 0; i < autoClickers; i++) mainClick(true);
    }, 1000);
  }
}

function startTimer() {
  if (!timerInterval) {
    timerInterval = setInterval(() => {
      if (!timeFreezeActive) {
        timer++;
        document.getElementById('timer').textContent = `Time: ${timer}s`;
      }
    }, 1000);
  }
}

// --- Main Click Button Logic ---
function getRarityChance(rarity) {
  // Dynamically calculate the chance for a rarity based on current stage
  if (stage <= 1) return rarity.chance;
  if (rarity.name === 'Common') {
    // Common gets all the chance removed from others
    let totalRemoved = 0;
    rarities.forEach(r => {
      if (r.name !== 'Common') {
        let prev = r.chance;
        for (let s = 2; s <= stage; s++) {
          prev = prev * 0.95;
        }
        totalRemoved += (r.chance - prev);
      }
    });
    return rarity.chance + totalRemoved;
  } else {
    let c = rarity.chance;
    for (let s = 2; s <= stage; s++) {
      c = c * 0.95;
    }
    return c;
  }
}

function mainClick(isAuto) {
  totalClicks++;
  document.getElementById('totalClicks').textContent = totalClicks;
  // Pick a rarity
  let roll = Math.random() * 100;
  let sum = 0;
  let found = 'Common';
  let pool = rarities;
  if (luckBoostActive) {
    pool = rarities.filter(r => r.name !== 'Common');
  }
  if (goldenModeActive || (goldenClickActive && !isAuto)) {
    // Only allow legendary or above
    pool = rarities.filter(r => {
      const order = rarities.map(r => r.name);
      return order.indexOf(r.name) >= order.indexOf('Legendary');
    });
    goldenClickActive = false;
    updateBuffTimers();
  }
  sum = 0;
  for (let r of pool) {
    let chance = getRarityChance(r);
    sum += chance;
    if (roll < sum) { found = r.name; break; }
  }
  // Only show new unlocks, in order
  if (!unlockedRarities.includes(found)) {
    unlockedRarities.push(found);
    // Sort unlockedRarities by rarity order
    const rarityOrder = rarities.map(r => r.name);
    unlockedRarities.sort((a, b) => rarityOrder.indexOf(a) - rarityOrder.indexOf(b));
    if (!isAuto) document.getElementById('result').textContent = `Unlocked: ${found}`;
    updateUnlockedRaritiesBox();
  } else if (!isAuto) {
    document.getElementById('result').textContent = '';
  }
  // Update log
  log.unshift(found);
  if (log.length > 50) log.pop();
  updateLogDisplay();
  // Update rarest find
  const rarityOrder = rarities.map(r => r.name);
  if (!rarestFind || rarityOrder.indexOf(found) > rarityOrder.indexOf(rarestFind)) {
    rarestFind = found;
    document.getElementById('rarestFind').textContent = rarestFind;
  }
  // Award points
  let pts = rarityPoints[found] || 0;
  if (doublePointsActive) pts *= 2;
  points += pts;
  updatePointsDisplay();
  checkAchievements();
}

function updateUnlockedRaritiesBox() {
  const listDiv = document.getElementById('unlockedRaritiesList');
  if (!listDiv) return;
  listDiv.innerHTML = '';
  if (!unlockedRarities || unlockedRarities.length === 0) {
    listDiv.textContent = 'None yet!';
    return;
  }
  // Sort by rarity order
  const rarityOrder = rarities.map(r => r.name);
  const sorted = unlockedRarities.slice().sort((a, b) => rarityOrder.indexOf(a) - rarityOrder.indexOf(b));
  sorted.forEach(rarityName => {
    const rObj = rarities.find(r => r.name === rarityName);
    const chance = rObj ? getRarityChance(rObj) : 0;
    const div = document.createElement('div');
    div.className = 'rarity-unlocked';
    div.innerHTML = `<b>${rarityName}</b> | chance %: ${chance.toFixed(5)} | <span style='color:#888;font-size:0.9em;'>(Unlocked!)</span>`;
    listDiv.appendChild(div);
  });
}

// --- Shop Purchase Logic ---
let stage = 1;
let baseShopCosts = {
  'Auto Clicker': 50,
  'Double Points': 150,
  'Golden Click': 200,
  'Luck Boost': 300,
  'Time Freeze': 200,
  'Golden Mode': 1000
};
function getShopCost(name) {
  // Exponential scaling for shop prices
  return Math.floor(baseShopCosts[name] * Math.pow(1.5, stage - 1));
}
function updateShopButtonLabels() {
  document.getElementById('autoClickerBtn').textContent = `Buy Auto Clicker (${getShopCost('Auto Clicker')} pts)`;
  document.getElementById('doublePointsBtn').textContent = `Buy Double Points (${getShopCost('Double Points')} pts)`;
  document.getElementById('goldenClickBtn').textContent = `Buy Golden Click (${getShopCost('Golden Click')} pts)`;
  document.getElementById('luckBoostBtn').textContent = `Buy Luck Boost (${getShopCost('Luck Boost')} pts)`;
  document.getElementById('timeFreezeBtn').textContent = `Buy Time Freeze (${getShopCost('Time Freeze')} pts)`;
  document.getElementById('goldenModeBtn').textContent = `Buy Golden Mode (${getShopCost('Golden Mode')} pts)`;
}
function updateStageDisplay() {
  document.getElementById('stageDisplay').textContent = stage;
}
function nextStage() {
  stage++;
  updateStageDisplay();
  updateShopButtonLabels();
  // Make rarities harder: decrease all non-Common chances by 5% (relative), add the total removed to Common
  let totalRemoved = 0;
  rarities.forEach(r => {
    if (r.name !== 'Common') {
      let prev = r.scaledChance !== undefined ? r.scaledChance : r.chance;
      let removed = prev * 0.05;
      r.scaledChance = prev - removed;
      totalRemoved += removed;
    }
  });
  // Add the total removed to Common
  let common = rarities.find(r => r.name === 'Common');
  if (common) {
    let prev = common.scaledChance !== undefined ? common.scaledChance : common.chance;
    common.scaledChance = prev + totalRemoved;
  }
  // Optionally, reset some buffs or give a reward
}

function updateShopStatus() {
  document.getElementById('autoCountShop').textContent = autoClickers;
  document.getElementById('doubleStatusShop').textContent = doublePointsActive ? 'On' : 'Off';
  document.getElementById('goldenStatusShop').textContent = goldenClickActive ? 'Ready' : 'Not Ready';
  document.getElementById('luckBoostStatusShop').textContent = luckBoostActive ? 'Active' : 'Inactive';
  document.getElementById('timeFreezeStatusShop').textContent = timeFreezeActive ? 'Active' : 'Inactive';
  document.getElementById('goldenModeStatusShop').textContent = goldenModeActive ? 'Active' : 'Inactive';
}

function buyShopItem(cost, name) {
  cost = getShopCost(name);
  const shopMsg = document.getElementById('shopMessage');
  if (points < cost) {
    if (shopMsg) shopMsg.textContent = 'Not enough points!';
    return;
  }
  if (name === 'Auto Clicker') {
    points -= cost;
    autoClickers++;
    startAutoClicker();
    updatePointsDisplay();
    if (shopMsg) shopMsg.textContent = 'Purchased: Auto Clicker! (' + autoClickers + ' total)';
  } else if (name === 'Double Points') {
    points -= cost;
    updatePointsDisplay();
    doublePointsActive = true;
    updateBuffTimers();
    doublePointsTimeout = setTimeout(() => {
      doublePointsActive = false;
      updateBuffTimers();
      updateShopStatus();
    }, 60000);
    if (shopMsg) shopMsg.textContent = 'Double Points active for 60 seconds!';
  } else if (name === 'Golden Click') {
    points -= cost;
    updatePointsDisplay();
    goldenClickActive = true;
    updateBuffTimers();
    if (shopMsg) shopMsg.textContent = 'Golden Click ready! Next click is Legendary or above.';
  } else if (name === 'Luck Boost') {
    points -= cost;
    updatePointsDisplay();
    luckBoostActive = true;
    updateBuffTimers();
    luckBoostTimeout = setTimeout(() => {
      luckBoostActive = false;
      updateBuffTimers();
      updateShopStatus();
    }, 60000);
    if (shopMsg) shopMsg.textContent = 'Luck Boost active for 60 seconds!';
  } else if (name === 'Time Freeze') {
    points -= cost;
    updatePointsDisplay();
    timeFreezeActive = true;
    updateBuffTimers();
    timeFreezeTimeout = setTimeout(() => {
      timeFreezeActive = false;
      updateBuffTimers();
      updateShopStatus();
    }, 60000);
    if (shopMsg) shopMsg.textContent = 'Timer frozen for 60 seconds!';
  } else if (name === 'Golden Mode') {
    points -= cost;
    updatePointsDisplay();
    goldenModeActive = true;
    updateBuffTimers();
    goldenModeTimeout = setTimeout(() => {
      goldenModeActive = false;
      updateBuffTimers();
      updateShopStatus();
    }, 5000);
    if (shopMsg) shopMsg.textContent = 'Golden Mode: All clicks are Legendary or above for 5 seconds!';
  }
  updateShopStatus();
}

// --- Achievements Section Toggle ---
function toggleAchievementsSection() {
  const section = document.getElementById('achievementsSection');
  section.style.display = (section.style.display === 'none') ? '' : 'none';
}

// --- Shop and Settings Icon Logic ---
window.addEventListener('DOMContentLoaded', function() {
  // Modal open/close
  document.getElementById('shopIcon').addEventListener('click', toggleShopModal);
  document.getElementById('settingsIcon').addEventListener('click', toggleSettingsModal);
  document.querySelector('#shopModal .close').addEventListener('click', function(e) {
    document.getElementById('shopModal').style.display = 'none';
  });
  document.querySelector('#settingsModal .close').addEventListener('click', function(e) {
    document.getElementById('settingsModal').style.display = 'none';
  });
  document.querySelector('#saveModal .close').addEventListener('click', closeSaveModal);
  // Save modal
  document.querySelectorAll('button[onclick^="openSaveModal"]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const mode = btn.textContent.includes('Export') ? 'export' : 'import';
      if (mode === 'export') exportSave();
      document.getElementById('saveModalTitle').textContent = mode === 'export' ? 'Export Save' : 'Import Save';
      document.getElementById('copySaveBtn').style.display = mode === 'export' ? '' : 'none';
      document.getElementById('downloadSaveBtn').style.display = mode === 'export' ? '' : 'none';
      document.getElementById('importSaveBtn').style.display = mode === 'import' ? '' : 'none';
      document.getElementById('saveTextarea').value = mode === 'export' ? JSON.stringify({
        totalClicks, rarestFind, log, achievements: achievements.map(a => ({...a})), points, unlockedRarities, timer
      }) : '';
      document.getElementById('importError').textContent = '';
    });
  });
  document.getElementById('importSaveBtn').addEventListener('click', importSave);
  // Reset buttons
  document.getElementById('softResetButton').addEventListener('click', softResetGame);
  document.getElementById('resetButton').addEventListener('click', resetGame);
  const cheaterBtn = document.getElementById('resetButtonCheater');
  if (cheaterBtn) cheaterBtn.addEventListener('click', resetGame);
  // Shop buttons
  document.getElementById('autoClickerBtn').onclick = function() { buyShopItem(50, 'Auto Clicker'); };
  document.getElementById('doublePointsBtn').onclick = function() { buyShopItem(150, 'Double Points'); };
  document.getElementById('goldenClickBtn').onclick = function() { buyShopItem(200, 'Golden Click'); };
  document.getElementById('luckBoostBtn').onclick = function() { buyShopItem(300, 'Luck Boost'); };
  document.getElementById('timeFreezeBtn').onclick = function() { buyShopItem(200, 'Time Freeze'); };
  document.getElementById('goldenModeBtn').onclick = function() { buyShopItem(1000, 'Golden Mode'); };
  // Main click button
  document.getElementById('clickButton').addEventListener('click', mainClick);
  // Achievements section toggle
  document.getElementById('achievementsHeader').addEventListener('click', toggleAchievementsSection);
  // Hide all modals on page load
  document.getElementById('settingsModal').style.display = 'none';
  document.getElementById('shopModal').style.display = 'none';
  document.getElementById('saveModal').style.display = 'none';
  document.getElementById('result').textContent = '';
  document.getElementById('totalClicks').textContent = totalClicks;
  document.getElementById('rarestFind').textContent = 'None';
  startTimer();
  document.getElementById('timer').textContent = `Time: 0s`;
  updateBuffTimers();
  updateAchievementsDisplay();
  updatePointsDisplay();
  updateUnlockedRaritiesBox();
  // Load from cookie on start
  loadGameFromStorage();
  document.getElementById('totalClicks').textContent = totalClicks;
  document.getElementById('rarestFind').textContent = rarestFind || 'None';
  document.getElementById('timer').textContent = `Time: ${timer}s`;
  updatePointsDisplay();
  updateAchievementsDisplay();
  updateUnlockedRaritiesBox();
  // Update log
  const logList = document.getElementById('log');
  logList.innerHTML = '';
  log.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    logList.appendChild(li);
  });
  if (log.length === 0) {
    logList.innerHTML = '<li id="logFallback">No finds yet. Start clicking!</li>';
  }
  // Show game version and model in settings
  document.getElementById('gameVersion').textContent = GAME_VERSION;
  document.getElementById('gameModel').textContent = GAME_MODEL;
  // Add notification div
  let notif = document.createElement('div');
  notif.id = 'saveNotification';
  notif.style.position = 'fixed';
  notif.style.top = '16px';
  notif.style.right = '16px';
  notif.style.background = '#2ecc40';
  notif.style.color = 'white';
  notif.style.padding = '10px 18px';
  notif.style.borderRadius = '8px';
  notif.style.fontWeight = 'bold';
  notif.style.fontSize = '16px';
  notif.style.zIndex = 9999;
  notif.style.display = 'none';
  document.body.appendChild(notif);

  function showSaveNotification(msg) {
    notif.textContent = msg;
    notif.style.display = 'block';
    setTimeout(() => { notif.style.display = 'none'; }, 1800);
  }

  // Listen for Ctrl+Alt+S to save
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 's') {
      saveGameToStorage();
      showSaveNotification('Game saved to local storage!');
    }
  });

  // Patch saveGameToStorage to show notification on auto-save
  const origSaveGameToStorage = saveGameToStorage;
  saveGameToStorage = function() {
    origSaveGameToStorage();
    showSaveNotification('Game auto-saved!');
  };
  // Auto-save every 10 seconds
  setInterval(saveGameToStorage, 10000);

  // Next Stage (Ascend) button logic
  document.getElementById('nextStageBtn').onclick = function() {
    // Ascend: reset all except achievements
    points = 0;
    totalClicks = 0;
    rarestFind = null;
    log = [];
    unlockedRarities = [];
    autoClickers = 0;
    doublePointsActive = false;
    goldenClickActive = false;
    luckBoostActive = false;
    timeFreezeActive = false;
    goldenModeActive = false;
    timer = 0;
    // Stage up and make game harder
    stage++;
    updateStageDisplay();
    updateShopButtonLabels();
    rarities.forEach(r => { r.scaledChance = r.chance / Math.pow(1.5, stage - 1); });
    // Update UI
    document.getElementById('totalClicks').textContent = totalClicks;
    document.getElementById('rarestFind').textContent = 'None';
    document.getElementById('timer').textContent = `Time: 0s`;
    updateBuffTimers();
    updateAchievementsDisplay();
    updatePointsDisplay();
    updateUnlockedRaritiesBox();
    updateShopStatus();
    updateShopButtonLabels();
    updateStageDisplay();
    // Clear log
    const logList = document.getElementById('log');
    logList.innerHTML = '<li id="logFallback">No finds yet. Start clicking!</li>';
    showSaveNotification('Ascended! Stage up: game is harder and shop is more expensive.');
    saveGameToStorage();
  };
});
// --- Cookie & Local Storage Save/Load Helpers ---
function saveGameToStorage() {
  const saveData = getSaveData();
  document.cookie = 'rc_save=' + encodeURIComponent(JSON.stringify(saveData)) + ';path=/;max-age=31536000';
  localStorage.setItem('rc_save', JSON.stringify(saveData));
}
function loadGameFromStorage() {
  let data = null;
  if (localStorage.getItem('rc_save')) {
    try { data = JSON.parse(localStorage.getItem('rc_save')); } catch (e) {}
  }
  if (!data) {
    const match = document.cookie.match(/(?:^|;)\s*rc_save=([^;]*)/);
    if (match) {
      try { data = JSON.parse(decodeURIComponent(match[1])); } catch (e) {}
    }
  }
  if (data && typeof data === 'object') {
    points = data.points || 0;
    totalClicks = data.totalClicks || 0;
    rarestFind = data.rarestFind || null;
    unlockedRarities = Array.isArray(data.logData) ? data.logData : [];
    log = Array.isArray(data.log) ? data.log : [];
    timer = data.timer || 0;
    stage = data.stage || 1;
    autoClickers = data.autoClickers || 0;
    doublePointsActive = !!data.doublePointsActive;
    goldenClickActive = !!data.goldenClickActive;
    luckBoostActive = !!data.luckBoostActive;
    timeFreezeActive = !!data.timeFreezeActive;
    goldenModeActive = !!data.goldenModeActive;
    // Restore achievements
    if (data.achievements) {
      achievements.forEach(a => {
        a.unlocked = !!data.achievements[a.id];
      });
    }
    updateStageDisplay();
    updateShopButtonLabels();
    // Re-apply rarity scaling
    rarities.forEach(r => { r.scaledChance = r.chance / Math.pow(1.25, stage - 1); });
  }
}

// --- Save System ---
function getSaveData() {
  return {
    version: GAME_VERSION,
    model: GAME_MODEL,
    points,
    totalClicks,
    rarestFind,
    logData: unlockedRarities.slice(),
    log: log.slice(),
    achievements: Object.fromEntries(achievements.map(a => [a.id, !!a.unlocked])),
    autoClickers,
    doublePointsActive,
    goldenClickActive,
    luckBoostActive,
    timeFreezeActive,
    goldenModeActive,
    stage,
    timer,
    backgrounds: (typeof backgrounds !== 'undefined' ? backgrounds : []),
    settings: (typeof settings !== 'undefined' ? settings : {}),
    gameVersion: GAME_VERSION,
    gameModel: GAME_MODEL
  };
}
function checksum(str) {
  // Simple checksum: sum char codes
  let c1 = 0, c2 = 5381;
  for (let i = 0; i < str.length; i++) {
    c1 = (c1 + str.charCodeAt(i)) % 1000000007;
    c2 = ((c2 << 5) + c2) + str.charCodeAt(i);
    c2 = c2 % 1000000007;
  }
  return [c1.toString(36), c2.toString(36)];
}
function encodeSave(data) {
  const json = JSON.stringify(data);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  const [c1, c2] = checksum(b64);
  return `RARITYCLICKER-SAVE-V1\n${c1}\n${c2}\n${b64}`;
}
function decodeSave(str) {
  const lines = str.trim().split(/\r?\n/);
  if (lines[0] !== 'RARITYCLICKER-SAVE-V1') return { error: 'Invalid save header.' };
  const [c1, c2, b64] = [lines[1], lines[2], lines.slice(3).join('')];
  const [ec1, ec2] = checksum(b64);
  if (c1 !== ec1 || c2 !== ec2) return { error: 'Checksum failed.' };
  try {
    const json = decodeURIComponent(escape(atob(b64)));
    const data = JSON.parse(json);
    return { data };
  } catch (e) {
    return { error: 'Corrupt save data.' };
  }
}

// --- Export/Import Save ---
function exportSave() {
  const saveStr = encodeSave(getSaveData());
  document.getElementById('saveTextarea').value = saveStr;
  document.getElementById('copySaveBtn').style.display = '';
  document.getElementById('downloadSaveBtn').style.display = '';
  document.getElementById('importSaveBtn').style.display = 'none';
  document.getElementById('importError').textContent = '';
}
function importSave() {
  let val = document.getElementById('saveTextarea').value;
  const { data, error } = decodeSave(val);
  if (error) {
    document.getElementById('importError').textContent = error;
    if (error === 'Checksum failed.') {
      document.getElementById('cheaterOverlay').style.display = 'block';
    }
    return;
  }
  if (data.model !== GAME_MODEL) {
    document.getElementById('importError').textContent = 'Wrong model! This save is for a different version of the game.';
    return;
  }
  // Overwrite all state
  points = data.points || 0;
  totalClicks = data.totalClicks || 0;
  rarestFind = data.rarestFind || null;
  unlockedRarities = Array.isArray(data.logData) ? data.logData : [];
  log = Array.isArray(data.log) ? data.log : [];
  timer = data.timer || 0;
  stage = data.stage || 1;
  autoClickers = data.autoClickers || 0;
  doublePointsActive = !!data.doublePointsActive;
  goldenClickActive = !!data.goldenClickActive;
  luckBoostActive = !!data.luckBoostActive;
  timeFreezeActive = !!data.timeFreezeActive;
  goldenModeActive = !!data.goldenModeActive;
  // Achievements
  if (data.achievements) {
    achievements.forEach(a => {
      a.unlocked = !!data.achievements[a.id];
    });
  }
  // Optionally restore backgrounds/settings if present
  if (data.backgrounds) window.backgrounds = data.backgrounds;
  if (data.settings) window.settings = data.settings;
  // Save to storage
  saveGameToStorage();
  // Update UI
  document.getElementById('totalClicks').textContent = totalClicks;
  document.getElementById('rarestFind').textContent = rarestFind || 'None';
  document.getElementById('timer').textContent = `Time: ${timer}s`;
  updatePointsDisplay();
  updateAchievementsDisplay();
  updateUnlockedRaritiesBox();
  updateShopStatus();
  updateShopButtonLabels();
  updateStageDisplay();
  // Update log
  updateLogDisplay();
  document.getElementById('importError').textContent = 'Import successful!';
}

// --- Save on interval only (not on every change) ---
setInterval(saveGameToStorage, 10000);

// --- On page load ---
window.addEventListener('DOMContentLoaded', function() {
  // Modal open/close
  document.getElementById('shopIcon').addEventListener('click', toggleShopModal);
  document.getElementById('settingsIcon').addEventListener('click', toggleSettingsModal);
  document.querySelector('#shopModal .close').addEventListener('click', function(e) {
    document.getElementById('shopModal').style.display = 'none';
  });
  document.querySelector('#settingsModal .close').addEventListener('click', function(e) {
    document.getElementById('settingsModal').style.display = 'none';
  });
  document.querySelector('#saveModal .close').addEventListener('click', closeSaveModal);
  // Save modal
  document.querySelectorAll('button[onclick^="openSaveModal"]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const mode = btn.textContent.includes('Export') ? 'export' : 'import';
      if (mode === 'export') exportSave();
      document.getElementById('saveModalTitle').textContent = mode === 'export' ? 'Export Save' : 'Import Save';
      document.getElementById('copySaveBtn').style.display = mode === 'export' ? '' : 'none';
      document.getElementById('downloadSaveBtn').style.display = mode === 'export' ? '' : 'none';
      document.getElementById('importSaveBtn').style.display = mode === 'import' ? '' : 'none';
      document.getElementById('saveTextarea').value = mode === 'export' ? JSON.stringify({
        totalClicks, rarestFind, log, achievements: achievements.map(a => ({...a})), points, unlockedRarities, timer
      }) : '';
      document.getElementById('importError').textContent = '';
    });
  });
  document.getElementById('importSaveBtn').addEventListener('click', importSave);
  // Reset buttons
  document.getElementById('softResetButton').addEventListener('click', softResetGame);
  document.getElementById('resetButton').addEventListener('click', resetGame);
  const cheaterBtn = document.getElementById('resetButtonCheater');
  if (cheaterBtn) cheaterBtn.addEventListener('click', resetGame);
  // Shop buttons
  document.getElementById('autoClickerBtn').onclick = function() { buyShopItem(50, 'Auto Clicker'); };
  document.getElementById('doublePointsBtn').onclick = function() { buyShopItem(150, 'Double Points'); };
  document.getElementById('goldenClickBtn').onclick = function() { buyShopItem(200, 'Golden Click'); };
  document.getElementById('luckBoostBtn').onclick = function() { buyShopItem(300, 'Luck Boost'); };
  document.getElementById('timeFreezeBtn').onclick = function() { buyShopItem(200, 'Time Freeze'); };
  document.getElementById('goldenModeBtn').onclick = function() { buyShopItem(1000, 'Golden Mode'); };
  // Main click button
  document.getElementById('clickButton').addEventListener('click', mainClick);
  // Achievements section toggle
  document.getElementById('achievementsHeader').addEventListener('click', toggleAchievementsSection);
  // Hide all modals on page load
  document.getElementById('settingsModal').style.display = 'none';
  document.getElementById('shopModal').style.display = 'none';
  document.getElementById('saveModal').style.display = 'none';
  document.getElementById('result').textContent = '';
  document.getElementById('totalClicks').textContent = totalClicks;
  document.getElementById('rarestFind').textContent = 'None';
  startTimer();
  document.getElementById('timer').textContent = `Time: 0s`;
  updateBuffTimers();
  updateAchievementsDisplay();
  updatePointsDisplay();
  updateUnlockedRaritiesBox();
  // Load from cookie on start
  loadGameFromStorage();
  document.getElementById('totalClicks').textContent = totalClicks;
  document.getElementById('rarestFind').textContent = rarestFind || 'None';
  document.getElementById('timer').textContent = `Time: ${timer}s`;
  updatePointsDisplay();
  updateAchievementsDisplay();
  updateUnlockedRaritiesBox();
  // Update log
  const logList = document.getElementById('log');
  logList.innerHTML = '';
  log.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    logList.appendChild(li);
  });
  if (log.length === 0) {
    logList.innerHTML = '<li id="logFallback">No finds yet. Start clicking!</li>';
  }
});
// --- Patch Save Modal Buttons ---
window.addEventListener('DOMContentLoaded', function() {
  // Modal open/close
  document.getElementById('shopIcon').addEventListener('click', toggleShopModal);
  document.getElementById('settingsIcon').addEventListener('click', toggleSettingsModal);
  document.querySelector('#shopModal .close').addEventListener('click', function(e) {
    document.getElementById('shopModal').style.display = 'none';
  });
  document.querySelector('#settingsModal .close').addEventListener('click', function(e) {
    document.getElementById('settingsModal').style.display = 'none';
  });
  document.querySelector('#saveModal .close').addEventListener('click', closeSaveModal);
  // Save modal
  document.querySelectorAll('button[onclick^="openSaveModal"]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const mode = btn.textContent.includes('Export') ? 'export' : 'import';
      if (mode === 'export') exportSave();
      document.getElementById('saveModalTitle').textContent = mode === 'export' ? 'Export Save' : 'Import Save';
      document.getElementById('copySaveBtn').style.display = mode === 'export' ? '' : 'none';
      document.getElementById('downloadSaveBtn').style.display = mode === 'export' ? '' : 'none';
      document.getElementById('importSaveBtn').style.display = mode === 'import' ? '' : 'none';
      document.getElementById('saveTextarea').value = mode === 'export' ? JSON.stringify({
        totalClicks, rarestFind, log, achievements: achievements.map(a => ({...a})), points, unlockedRarities, timer
      }) : '';
      document.getElementById('importError').textContent = '';
    });
  });
  document.getElementById('importSaveBtn').addEventListener('click', importSave);
  // Reset buttons
  document.getElementById('softResetButton').addEventListener('click', softResetGame);
  document.getElementById('resetButton').addEventListener('click', resetGame);
  const cheaterBtn = document.getElementById('resetButtonCheater');
  if (cheaterBtn) cheaterBtn.addEventListener('click', resetGame);
  // Shop buttons
  document.getElementById('autoClickerBtn').onclick = function() { buyShopItem(50, 'Auto Clicker'); };
  document.getElementById('doublePointsBtn').onclick = function() { buyShopItem(150, 'Double Points'); };
  document.getElementById('goldenClickBtn').onclick = function() { buyShopItem(200, 'Golden Click'); };
  document.getElementById('luckBoostBtn').onclick = function() { buyShopItem(300, 'Luck Boost'); };
  document.getElementById('timeFreezeBtn').onclick = function() { buyShopItem(200, 'Time Freeze'); };
  document.getElementById('goldenModeBtn').onclick = function() { buyShopItem(1000, 'Golden Mode'); };
  // Main click button
  document.getElementById('clickButton').addEventListener('click', mainClick);
  // Achievements section toggle
  document.getElementById('achievementsHeader').addEventListener('click', toggleAchievementsSection);
  // Hide all modals on page load
  document.getElementById('settingsModal').style.display = 'none';
  document.getElementById('shopModal').style.display = 'none';
  document.getElementById('saveModal').style.display = 'none';
  document.getElementById('result').textContent = '';
  document.getElementById('totalClicks').textContent = totalClicks;
  document.getElementById('rarestFind').textContent = 'None';
  startTimer();
  document.getElementById('timer').textContent = `Time: 0s`;
  updateBuffTimers();
  updateAchievementsDisplay();
  updatePointsDisplay();
  updateUnlockedRaritiesBox();
  // Load from cookie on start
  loadGameFromStorage();
  document.getElementById('totalClicks').textContent = totalClicks;
  document.getElementById('rarestFind').textContent = rarestFind || 'None';
  document.getElementById('timer').textContent = `Time: ${timer}s`;
  updatePointsDisplay();
  updateAchievementsDisplay();
  updateUnlockedRaritiesBox();
  // Update log
  const logList = document.getElementById('log');
  logList.innerHTML = '';
  log.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    logList.appendChild(li);
  });
  if (log.length === 0) {
    logList.innerHTML = '<li id="logFallback">No finds yet. Start clicking!</li>';
  }
});
//# sourceMappingURL=rarity_clicker.js.map
