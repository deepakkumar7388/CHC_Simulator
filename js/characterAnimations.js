/**
 * characterAnimations.js
 * Cartoon Character DOM Builder + Animation API
 */

// ============================================================
//  Upgrade .person divs to full cartoon HTML
//  parent: optional parent element to scope the query
// ============================================================
function upgradeCharacters(parent) {
    const root = parent || document;
    root.querySelectorAll('.person').forEach(p => {
        // Skip if already upgraded
        if (p.querySelector('.c-character')) return;

        // Determine role
        let type = 'patient';
        let roleName = 'Patient';
        if (p.classList.contains('doc'))   { type = 'doctor'; roleName = 'Doctor'; }
        if (p.classList.contains('nurse')) { type = 'nurse'; roleName = 'Nurse'; }
        if (p.classList.contains('admin')) { type = 'admin'; roleName = 'Admin'; }
        if (p.classList.contains('recep')) { type = 'recep'; roleName = 'Receptionist'; }

        // Keep any existing children that are not .head/.body (e.g. speech labels)
        const extras = Array.from(p.children).filter(c =>
            !c.classList.contains('head') && !c.classList.contains('body')
        );

        p.innerHTML = `
            <div class="c-role-tag">${roleName}</div>
            <div class="c-shadow"></div>
            <div class="c-character ${type}">
                <div class="c-head">
                    <div class="c-hair"></div>
                    <div class="c-face">
                        <div class="c-eyebrow c-left"></div>
                        <div class="c-eyebrow c-right"></div>
                        <div class="c-eye c-left"><div class="c-pupil"></div></div>
                        <div class="c-eye c-right"><div class="c-pupil"></div></div>
                        <div class="c-nose"></div>
                        <div class="c-mouth"></div>
                    </div>
                </div>
                <div class="c-body-wrap">
                    <div class="c-arm c-left-arm"><div class="c-hand"></div></div>
                    <div class="c-torso"></div>
                    <div class="c-arm c-right-arm">
                        <div class="c-hand"></div>
                        <div class="c-item-hold"></div>
                    </div>
                </div>
                <div class="c-legs">
                    <div class="c-leg c-left-leg"><div class="c-shoe"></div></div>
                    <div class="c-leg c-right-leg"><div class="c-shoe"></div></div>
                </div>
            </div>
        `;

        // Re-attach extra children (speech labels etc.)
        extras.forEach(el => p.appendChild(el));

        // Start idle breathing immediately
        p.classList.add('anim-idle');
    });
}

// ============================================================
//  Utility delay
// ============================================================
const delay = ms => new Promise(res => setTimeout(res, ms));

// ============================================================
//  CHARACTER ACTIONS
// ============================================================

async function walkCharacter(charEl, targetX, targetY = null, durationMs = 3000) {
    if (!charEl) return;
    charEl.classList.remove('anim-idle');
    charEl.classList.add('anim-walking');

    const char = charEl.querySelector('.c-character');
    if (char) char.style.transform = targetX < 0
        ? 'translateX(-50%) scaleX(-1)'
        : 'translateX(-50%)';

    charEl.style.transition = `transform ${durationMs}ms cubic-bezier(0.45,0,0.55,1)`;
    let t = `translateX(${targetX}px)`;
    if (targetY !== null) t += ` translateY(${targetY}px)`;
    charEl.style.transform = t;

    await delay(durationMs);
    charEl.classList.remove('anim-walking');
    charEl.classList.add('anim-idle');
}

async function sitCharacter(charEl) {
    if (!charEl) return;
    charEl.classList.remove('anim-idle', 'anim-walking');
    charEl.classList.add('anim-sitting');
}

async function standCharacter(charEl) {
    if (!charEl) return;
    charEl.classList.remove('anim-sitting');
    charEl.classList.add('anim-idle');
}

async function waveCharacter(charEl, durationMs = 2000) {
    if (!charEl) return;
    charEl.classList.add('anim-waving');
    await delay(durationMs);
    charEl.classList.remove('anim-waving');
}

async function talkCharacter(charEl, durationMs = 2000) {
    if (!charEl) return;
    charEl.classList.add('anim-talking');
    await delay(durationMs);
    charEl.classList.remove('anim-talking');
}

async function pointCharacter(charEl, durationMs = 2000) {
    if (!charEl) return;
    charEl.classList.add('anim-pointing');
    await delay(durationMs);
    charEl.classList.remove('anim-pointing');
}

async function lookAround(charEl, durationMs = 3000) {
    if (!charEl) return;
    charEl.classList.add('anim-looking');
    await delay(durationMs);
    charEl.classList.remove('anim-looking');
}

async function useComputer(charEl, durationMs = 3000) {
    if (!charEl) return;
    charEl.classList.add('anim-typing');
    await delay(durationMs);
    charEl.classList.remove('anim-typing');
}

async function pickupFile(charEl) {
    if (!charEl) return;
    const c = charEl.querySelector('.c-character');
    if (c) c.classList.add('has-file');
}

async function dropFile(charEl) {
    if (!charEl) return;
    const c = charEl.querySelector('.c-character');
    if (c) c.classList.remove('has-file');
}

// ============================================================
//  Sound
// ============================================================
function playSoundEffect() {
    try { if (window.playPopSound) window.playPopSound(); } catch (e) {}
}

// ============================================================
//  Environment enhancements (called after each scene builds)
// ============================================================
function enhanceEnvironment(parent) {
    const root = parent || document;
    root.querySelectorAll('.prop-reception, .prop-big-dashboard').forEach(el => el.classList.add('env-glow'));
    root.querySelectorAll('.prop-building').forEach(el => el.classList.add('env-pulse'));
}

// ============================================================
//  INIT
// ============================================================
function initCartoonSimulator() {
    // Do NOT upgrade all characters on load — sceneController builds stages on demand
    // Just ensure the function is available globally
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCartoonSimulator);
} else {
    initCartoonSimulator();
}

// Expose globally
window.upgradeCharacters = upgradeCharacters;
window.walkCharacter     = walkCharacter;
window.sitCharacter      = sitCharacter;
window.standCharacter    = standCharacter;
window.waveCharacter     = waveCharacter;
window.talkCharacter     = talkCharacter;
window.pointCharacter    = pointCharacter;
window.lookAround        = lookAround;
window.useComputer       = useComputer;
window.pickupFile        = pickupFile;
window.dropFile          = dropFile;
window.enhanceEnvironment= enhanceEnvironment;
