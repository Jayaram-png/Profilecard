// ========= APP.JS =========

// ---------- DATA ----------
const hobbies = ["reading", "hiking", "gaming", "cooking", "photography", "yoga", "cycling", "music", "painting"];
let skills = ["JavaScript", "HTML", "CSS"]; // initial demo

// Local avatar files (same folder as index.html). Change these if you move the images.
const AVATARS = {
  female: ["./female1.jpg", "./female2.webp"],
  male:   ["./male1.jpg",   "./male2.jpg"],
};

// ---------- DOM ----------
const card = document.getElementById('card');
const nameEl  = document.getElementById('name');
const titleEl = document.getElementById('title');
const bioEl   = document.getElementById('bio');
const viewsEl = document.getElementById('views');
const hobbyEl = document.getElementById('hobby');
const avatarImg  = document.getElementById('avatarImg');
const avatarHint = document.getElementById('avatarHint');
const availDot = document.getElementById('availDot');

const specLocation = document.getElementById('specLocation');
const specAge = document.getElementById('specAge');
const specExp = document.getElementById('specExp');
const specEmail = document.getElementById('specEmail');

const nameInput   = document.getElementById('nameInput');
const titleInput  = document.getElementById('titleInput');
const bioInput    = document.getElementById('bioInput');
const genderSelect= document.getElementById('genderSelect');
const avatarInput = document.getElementById('avatarInput');

const locationInput = document.getElementById('locationInput');
const ageInput = document.getElementById('ageInput');
const expInput = document.getElementById('expInput');
const emailInput = document.getElementById('emailInput');
const availableToggle = document.getElementById('availableToggle');

const skillInput = document.getElementById('skillInput');
const addSkillBtn = document.getElementById('addSkillBtn');
const skillsList = document.getElementById('skillsList');

const applyBtn        = document.getElementById('applyBtn');
const randomHobbyBtn  = document.getElementById('randomHobbyBtn');
const addViewBtn      = document.getElementById('addViewBtn');
const floatToggle     = document.getElementById('floatToggle');

// ---------- AVATAR (random from local files; optional URL override) ----------
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const hideAvatar = () => {
  avatarImg.classList.add('hidden');
  avatarImg.removeAttribute('src');
  avatarImg.alt = '';
  if (avatarHint) avatarHint.classList.remove('hidden'); // show hint
};

const showAvatar = (src, alt) => {
  avatarImg.src = src;
  avatarImg.alt = alt || 'avatar';
  avatarImg.classList.remove('hidden');
  if (avatarHint) avatarHint.classList.add('hidden');   // hide hint
};

// Try to load a URL; if it fails, try a fallback from the same gender once
const tryLoadAvatar = (url, gender, name, triedFallback = false) => {
  const probe = new Image();
  probe.onload = () => showAvatar(url, `${name} avatar`);
  probe.onerror = () => {
    if (!triedFallback) {
      const fallback = pickRandom(AVATARS[gender] || []);
      if (fallback && fallback !== url) {
        tryLoadAvatar(fallback, gender, name, true);
        return;
      }
    }
    hideAvatar(); // nothing worked; hint stays visible
  };
  probe.src = url;
};

// Show avatar only if gender chosen; URL overrides when valid
const updateAvatar = () => {
  const gender = genderSelect.value; // "" | "female" | "male"
  if (!gender) { hideAvatar(); return; }

  const name = (nameInput.value || nameEl.textContent || "User").trim();
  const customUrl = avatarInput.value.trim();

  // If user typed a URL, prefer it; otherwise pick random by gender
  const chosen = customUrl || pickRandom(AVATARS[gender] || []);
  if (!chosen) { hideAvatar(); return; }

  tryLoadAvatar(chosen, gender, name);
};

// ---------- SKILLS ----------
const renderSkills = () => {
  skillsList.innerHTML = '';
  skills.forEach((s, i) => {
    const chip = document.createElement('button');
    chip.className = 'skill-chip';
    chip.textContent = s;
    chip.title = 'Click to remove';
    chip.dataset.index = i;
    skillsList.appendChild(chip);
  });
};
skillsList.addEventListener('click', (e) => {
  if (!e.target.classList.contains('skill-chip')) return;
  const idx = Number(e.target.dataset.index);
  skills.splice(idx, 1);
  renderSkills();
});
addSkillBtn.addEventListener('click', () => {
  const raw = skillInput.value.trim();
  if (!raw) return;
  // dedupe case-insensitive, keep max 12
  const candidate = raw.replace(/\s+/g, ' ');
  if (!skills.some(s => s.toLowerCase() === candidate.toLowerCase())) {
    skills.push(candidate);
    if (skills.length > 12) skills.shift();
    renderSkills();
  }
  skillInput.value = '';
});

// ---------- APPLY / INTERACTIONS ----------
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const applyChanges = () => {
  const nm = nameInput.value.trim();
  const tl = titleInput.value.trim();
  const bi = bioInput.value.trim();

  // specs inputs
  const loc = locationInput.value.trim();
  const age = ageInput.value.trim();
  const exp = expInput.value.trim();
  const eml = emailInput.value.trim();
  const avail = availableToggle.checked;

  if (!nm && !tl && !bi && !genderSelect.value && !loc && !age && !exp && !eml && !avatarInput.value.trim()) {
    alert("Enter some details (name/title/bio/specs) and choose a gender to show avatar.");
    return;
  }

  if (nm) nameEl.textContent   = nm;
  if (tl) titleEl.textContent  = tl;
  if (bi) bioEl.textContent    = bi;

  // specs render with basic validation
  specLocation.textContent = loc || '—';
  specAge.textContent = age ? `${age}` : '—';
  specExp.textContent = exp ? `${exp} yrs` : '—';
  if (eml && !emailPattern.test(eml)) {
    alert("Please enter a valid email (e.g., name@example.com).");
  }
  specEmail.textContent = eml && emailPattern.test(eml) ? eml : '—';

  // availability dot
  availDot.style.background = avail ? '#22c55e' : '#ef4444';
  availDot.style.boxShadow = avail
    ? '0 0 0 2px rgba(34,197,94,.25) inset'
    : '0 0 0 2px rgba(239,68,68,.25) inset';

  updateAvatar(); // only shows if gender chosen
};

// Array methods + randomness
const pickRandomHobby = () => {
  const pool = hobbies.map(h => h.trim()).filter(Boolean);
  const choice = pool[Math.floor(Math.random() * pool.length)];
  hobbyEl.textContent = `Hobby: ${choice}`;
};

// Closure for views counter
const makeCounter = (initial = 0) => {
  let count = initial;
  return () => { count += 1; viewsEl.textContent = `Views: ${count}`; };
};
const incrementViews = makeCounter(0);

// ---------- EVENTS ----------
applyBtn.addEventListener('click', () => applyChanges());
randomHobbyBtn.addEventListener('click', () => pickRandomHobby());
addViewBtn.addEventListener('click', () => incrementViews());
floatToggle.addEventListener('change', (e) => {
  card.classList.toggle('use-float', e.target.checked);
});

// Live avatar updates (will only show when a gender is selected)
nameInput.addEventListener('input', () => updateAvatar());
genderSelect.addEventListener('change', () => updateAvatar());
avatarInput.addEventListener('input', () => updateAvatar());

// ---------- INIT ----------
(() => {
  hideAvatar();      // start hidden; hint visible
  renderSkills();
})();
