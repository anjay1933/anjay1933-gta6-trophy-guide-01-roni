// Leonida Legend — offline GTA VI trophy tracker.
// Loads app/data/trophies.json (same folder, no network), renders the 55 trophies
// with their official name, description and grade, and keeps progress in localStorage.
const STORE_KEY = 'leonida-legend-progress-v1';
const SETTINGS_KEY = 'leonida-legend-settings-v1';
const listEl = document.getElementById('list');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const statusEl = document.getElementById('status');
const spoilerEl = document.getElementById('spoiler');
const countLine = document.getElementById('countLine');

const params = new URLSearchParams(location.search);
const demoEarned = ['Just Like Paradise', 'Paradise Lost', 'T**s Ass Drug Money', 'Vice City, Baby!', 'Trust', 'Break the Bank', 'Cunning Stunts', 'Top Fun', 'Baited My Tackle', 'Stick Fiddler', 'Let’s Go Bowling', 'In The Beginning…'];

let earned = new Set(readJson(STORE_KEY, []));
if (params.get('demo') === 'earned' && earned.size === 0) {
  earned = new Set(demoEarned);
  saveProgress();
}
let settings = Object.assign({ kind: 'all', spoiler: true }, readJson(SETTINGS_KEY, {}));
if (params.get('kind')) settings.kind = params.get('kind');
if (params.get('grade')) gradeEl.value = params.get('grade');
if (params.get('status')) statusEl.value = params.get('status');
if (params.get('spoiler') === 'off') settings.spoiler = false;
if (params.get('spoiler') === 'on') settings.spoiler = true;
if (params.get('q')) searchEl.value = params.get('q');
spoilerEl.checked = settings.spoiler;

const data = await (await fetch('data/trophies.json')).json();
const trophies = data.trophies;

function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback; }
  catch { return fallback; }
}

function saveProgress() {
  localStorage.setItem(STORE_KEY, JSON.stringify([...earned]));
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function isHiddenFromSpoilers(trophy) {
  return settings.spoiler && trophy.kind === 'story' && !earned.has(trophy.name);
}

function trophyMatches(trophy) {
  const q = searchEl.value.trim().toLowerCase();
  if (settings.kind === 'missable' && !trophy.missable) return false;
  if (settings.kind === 'online') return false; // No online trophies: all 55 are single-player.
  if (settings.kind !== 'all' && settings.kind !== 'missable' && trophy.kind !== settings.kind) return false;
  if (gradeEl.value !== 'all' && trophy.grade !== gradeEl.value) return false;
  if (statusEl.value === 'earned' && !earned.has(trophy.name)) return false;
  if (statusEl.value === 'remaining' && earned.has(trophy.name)) return false;
  if (q && !(trophy.name.toLowerCase().includes(q) || trophy.description.toLowerCase().includes(q) || trophy.guide.toLowerCase().includes(q))) return false;
  return true;
}

function renderProgress() {
  const total = trophies.length;
  const done = earned.size;
  document.getElementById('progressBig').textContent = `${done} / ${total}`;
  document.getElementById('progressLine').textContent = `${Math.round((done / total) * 100)}% to the Platinum`;
  document.getElementById('progressFill').style.width = `${(done / total) * 100}%`;
  const byGrade = {};
  for (const t of trophies) if (earned.has(t.name)) byGrade[t.grade] = (byGrade[t.grade] || 0) + 1;
  const totals = { platinum: 1, gold: 2, silver: 6, bronze: 46 };
  document.getElementById('gradeChips').textContent =
    ['platinum', 'gold', 'silver', 'bronze'].map(g => `${g} ${byGrade[g] || 0}/${totals[g]}`).join(' · ');
}

function trophyCard(trophy) {
  const card = document.createElement('article');
  card.className = 'card' + (earned.has(trophy.name) ? ' earned' : '') + (trophy.missable ? ' missable' : '');
  const head = document.createElement('div');
  head.className = 'card-head';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(trophy.name);
  box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(trophy.name); else earned.delete(trophy.name);
    saveProgress();
    renderAll();
  });
  head.append(box);
  const text = document.createElement('div');
  const name = document.createElement('h3');
  name.textContent = isHiddenFromSpoilers(trophy) ? 'Hidden story trophy — earn it to reveal' : trophy.name;
  text.append(name);
  const desc = document.createElement('p');
  desc.className = 'desc';
  desc.textContent = isHiddenFromSpoilers(trophy)
    ? 'Spoiler-safe mode hides this story trophy’s name and description until you earn it.'
    : `“${trophy.description}”`;
  text.append(desc);
  head.append(text);
  card.append(head);

  const tags = document.createElement('p');
  tags.className = 'tags';
  const tagList = [[trophy.grade, trophy.grade], [trophy.kind, trophy.kind]];
  if (trophy.count) tagList.push([`Count: ${trophy.count}`, '']);
  if (trophy.missable) tagList.push(['MISSABLE', 'miss']);
  if (trophy.hidden) tagList.push(['Hidden on PSN', 'hidden']);
  for (const [label, cls] of tagList) {
    const span = document.createElement('span');
    span.className = `tag ${cls}`.trim();
    span.textContent = label;
    tags.append(span);
  }
  card.append(tags);

  if (!isHiddenFromSpoilers(trophy)) {
    const guide = document.createElement('p');
    guide.className = 'guide';
    // Each guide already ends with its own "Source: ..." sentence, so no
    // separate source line — one citation per guide, never shown twice.
    guide.textContent = trophy.guide;
    card.append(guide);
  } else {
    const note = document.createElement('p');
    note.className = 'spoiled';
    note.textContent = 'Guide hidden with the spoiler setting — tick the box once you earn it.';
    card.append(note);
  }
  return card;
}

function renderAll() {
  renderProgress();
  document.querySelectorAll('#kindFilters button').forEach(b =>
    b.classList.toggle('on', b.dataset.kind === settings.kind));
  const shown = trophies.filter(trophyMatches);
  listEl.replaceChildren();
  if (settings.kind === 'online') {
    const note = document.createElement('p');
    note.className = 'empty';
    note.textContent = 'No online trophies — all 55 GTA VI trophies are single-player and offline (GTABase + PowerPyx; cryptogames.gg). Nothing to track here.';
    listEl.append(note);
  } else if (shown.length === 0) {
    const note = document.createElement('p');
    note.className = 'empty';
    note.textContent = 'No trophies match these filters. Clear the search or pick another kind.';
    listEl.append(note);
  } else {
    for (const trophy of shown) listEl.append(trophyCard(trophy));
  }
  const earnedShown = shown.filter(t => earned.has(t.name)).length;
  countLine.textContent = `Showing ${shown.length} of ${trophies.length} trophies · ${earnedShown} earned in this view` +
    (settings.kind === 'missable' ? ' · 1 missable trophy in the whole list' : '');
  // Deep links (#roadmap, #list) must land after the async list renders,
  // not before it — otherwise the browser scrolls to an empty page position.
  if (!renderAll.scrolled && location.hash) {
    renderAll.scrolled = true;
    const target = document.querySelector(location.hash);
    if (target) target.scrollIntoView();
  }
}

document.querySelectorAll('#kindFilters button').forEach(button => {
  button.addEventListener('click', () => {
    settings.kind = button.dataset.kind;
    saveSettings();
    renderAll();
  });
});
gradeEl.addEventListener('change', renderAll);
statusEl.addEventListener('change', renderAll);
searchEl.addEventListener('input', renderAll);
spoilerEl.addEventListener('change', () => {
  settings.spoiler = spoilerEl.checked;
  saveSettings();
  renderAll();
});

document.getElementById('export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned], exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
document.getElementById('import').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const names = Array.isArray(parsed) ? parsed : parsed.earned;
    const known = new Set(trophies.map(t => t.name));
    earned = new Set(names.filter(n => known.has(n)));
    saveProgress();
    renderAll();
  } catch {
    countLine.textContent = 'That file could not be imported — it is not a Leonida Legend progress file.';
  }
});
document.getElementById('reset').addEventListener('click', () => {
  if (confirm('Clear all earned trophies? Export first if you want a backup.')) {
    earned = new Set();
    saveProgress();
    renderAll();
  }
});

renderAll();
