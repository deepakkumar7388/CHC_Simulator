let currentScene = 0;
const scenes      = document.querySelectorAll('.sc');
const totalScenes = scenes.length;
const audios = [];

for (let i = 1; i <= totalScenes; i++) {
    audios.push(document.getElementById(`audio-${i}`));
}

// ──────────────────────────────────────────────────────────────
//  WEB AUDIO — premium glass tap
// ──────────────────────────────────────────────────────────────
let audioCtx;
function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}

function playPopSound() {
    try {
        const ctx = getAudioCtx();
        if (ctx.state === 'suspended') ctx.resume();
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.07, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    } catch(e) {}
}

function playWhooshSound() {
    try {
        const ctx = getAudioCtx();
        if (ctx.state === 'suspended') ctx.resume();
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
        const src = ctx.createBufferSource();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1200;
        filter.Q.value = 0.5;
        src.buffer = buf;
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        src.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        src.start();
    } catch(e) {}
}

// ──────────────────────────────────────────────────────────────
//  SCENE NUMBER DISPLAY
// ──────────────────────────────────────────────────────────────
function updateSceneBadge(idx) {
    let badge = document.getElementById('scene-badge');
    if (!badge) {
        badge = document.createElement('div');
        badge.id = 'scene-badge';
        badge.className = 'scene-badge';
        document.getElementById('canvas').appendChild(badge);
    }
    const isProb = idx < 10;
    badge.textContent = `SCENE ${idx + 1} / ${totalScenes} — ${isProb ? 'PROBLEM' : 'SOLUTION'}`;
    badge.style.color = isProb ? 'rgba(239,68,68,0.8)' : 'rgba(16,185,129,0.8)';
    badge.style.borderColor = isProb ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)';
}

// ──────────────────────────────────────────────────────────────
//  PARTICLE BURST — fires on key moments
// ──────────────────────────────────────────────────────────────
function burstParticles(x, y, color = '#8b5cf6', count = 12) {
    const canvas = document.getElementById('canvas');
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        const angle = (i / count) * Math.PI * 2;
        const dist  = 40 + Math.random() * 60;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;
        p.style.cssText = `
            position:absolute; left:${x}px; top:${y}px;
            width:8px; height:8px; border-radius:50%;
            background:${color};
            box-shadow:0 0 10px ${color};
            pointer-events:none; z-index:900;
            animation: particleBurst 0.7s ease-out forwards;
            --tx:${tx}px; --ty:${ty}px;
        `;
        canvas.appendChild(p);
        setTimeout(() => p.remove(), 800);
    }
}

// Inject particle keyframe once
(function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleBurst {
            0%   { opacity:1; transform:translate(0,0) scale(1); }
            100% { opacity:0; transform:translate(var(--tx),var(--ty)) scale(0); }
        }
        @keyframes glowPulse {
            0%,100% { filter: brightness(1); }
            50%      { filter: brightness(1.5) drop-shadow(0 0 20px currentColor); }
        }
    `;
    document.head.appendChild(style);
})();

// ──────────────────────────────────────────────────────────────
//  SCENE TRANSITION — cinematic
// ──────────────────────────────────────────────────────────────
let transitionOverlay = null;

function createTransitionOverlay() {
    if (transitionOverlay) return;
    transitionOverlay = document.createElement('div');
    transitionOverlay.style.cssText = `
        position: fixed; inset: 0; z-index: 500;
        background: radial-gradient(ellipse at center, rgba(79,70,229,0.3) 0%, rgba(5,8,22,1) 80%);
        opacity: 0; pointer-events: none;
        transition: opacity 0.4s ease;
    `;
    document.body.appendChild(transitionOverlay);
}

function flashTransition(callback) {
    createTransitionOverlay();
    transitionOverlay.style.pointerEvents = 'auto';
    transitionOverlay.style.opacity = '1';
    playWhooshSound();
    setTimeout(() => {
        callback();
        setTimeout(() => {
            transitionOverlay.style.opacity = '0';
            transitionOverlay.style.pointerEvents = 'none';
        }, 200);
    }, 380);
}

// ──────────────────────────────────────────────────────────────
//  DATA STREAM — flowing particles between nodes
// ──────────────────────────────────────────────────────────────
function spawnDataStream(fromEl, toEl, color = '#8b5cf6', count = 5) {
    if (!fromEl || !toEl) return;
    const canvas = document.getElementById('canvas');
    const fr = fromEl.getBoundingClientRect();
    const tr = toEl.getBoundingClientRect();
    const canvasR = canvas.getBoundingClientRect();

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const p = document.createElement('div');
            const sx = fr.left - canvasR.left + fr.width / 2;
            const sy = fr.top  - canvasR.top  + fr.height / 2;
            const ex = tr.left - canvasR.left + tr.width / 2;
            const ey = tr.top  - canvasR.top  + tr.height / 2;

            p.style.cssText = `
                position:absolute; left:${sx}px; top:${sy}px;
                width:10px; height:10px; border-radius:50%;
                background:${color};
                box-shadow: 0 0 12px ${color}, 0 0 24px ${color};
                pointer-events:none; z-index:900;
                transition: left 0.8s cubic-bezier(0.34,1.56,0.64,1),
                            top 0.8s cubic-bezier(0.34,1.56,0.64,1),
                            opacity 0.2s ease;
            `;
            canvas.appendChild(p);

            requestAnimationFrame(() => {
                p.style.left = ex + 'px';
                p.style.top  = ey + 'px';
            });

            setTimeout(() => {
                p.style.opacity = '0';
                setTimeout(() => p.remove(), 300);
            }, 650);
        }, i * 160);
    }
}

// ──────────────────────────────────────────────────────────────
//  START SIMULATOR
// ──────────────────────────────────────────────────────────────
window.startSim = function () {
    const startScreen = document.getElementById('start');
    startScreen.style.transition = 'opacity 0.6s, transform 0.6s';
    startScreen.style.opacity = '0';
    startScreen.style.transform = 'scale(1.05)';

    setTimeout(() => {
        startScreen.style.display = 'none';
        document.getElementById('canvas').style.display = 'block';
        document.getElementById('nav-overlay').style.display = 'flex'; // SHOW NAV OVERLAY
        playScene(0);
    }, 600);
};

// ──────────────────────────────────────────────────────────────
//  JUMP TO SCENE
// ──────────────────────────────────────────────────────────────
window.jumpToScene = function(idx) {
    if(idx < 0 || idx >= totalScenes) return;
    
    // Stop all audio & timers
    audios.forEach(a => {
        if(a) {
            a.pause();
            a.currentTime = 0;
            a.ontimeupdate = null;
            a.onended = null;
        }
    });

    // Reset ALL scene timelines via controller
    if (window.SceneController) {
        for(let i=0; i<totalScenes; i++) {
            window.SceneController.reset(i);
        }
    }
    
    // Quick fade transition effect
    const canvas = document.getElementById('canvas');
    canvas.style.opacity = '0';
    canvas.style.transition = 'opacity 0.3s';
    
    setTimeout(() => {
        currentScene = idx;
        const selector = document.getElementById('scene-selector');
        if(selector) selector.value = idx;
        
        playScene(idx);
        canvas.style.opacity = '1';
    }, 350);
};

// ──────────────────────────────────────────────────────────────
//  PLAY SCENE
// ──────────────────────────────────────────────────────────────
function playScene(idx) {
    if (idx >= totalScenes) return;

    // Remove active from all
    scenes.forEach(s => {
        s.classList.remove('active', 'entering');
    });

    // Activate target scene with cinematic entry
    const scene = scenes[idx];
    scene.classList.add('active', 'entering');

    // Update badge and dropdown selector
    updateSceneBadge(idx);
    const selector = document.getElementById('scene-selector');
    if(selector) selector.value = idx;

    // Build stage
    if (window.SceneController) {
        window.SceneController.buildStage(idx);
    }

    // Problem/solution tint on wide-scene
    const wideScene = scene.querySelector('.wide-scene');
    if (wideScene) {
        wideScene.style.borderColor = idx < 10
            ? 'rgba(239,68,68,0.15)'
            : 'rgba(16,185,129,0.15)';
        wideScene.style.boxShadow = idx < 10
            ? '0 0 60px rgba(239,68,68,0.05), 0 20px 60px rgba(0,0,0,0.6)'
            : '0 0 60px rgba(16,185,129,0.05), 0 20px 60px rgba(0,0,0,0.6)';
    }

    // Collect data-time elements
    const animEls = scene.querySelectorAll('[data-time],[data-time-shake],[data-time-explode]');

    // Play audio
    const audio = audios[idx];
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log('Audio error:', e));

        audio.ontimeupdate = () => {
            const t = audio.currentTime;

            animEls.forEach(el => {
                if (el.hasAttribute('data-time') && !el.classList.contains('on') &&
                    t >= parseFloat(el.getAttribute('data-time'))) {
                    el.classList.add('on');
                    if (el.classList.contains('pipe-arrow') || el.classList.contains('pipe-node')) {
                        setTimeout(() => el.classList.add('active'), 200);
                    }
                    playPopSound();
                }

                ['shake', 'explode'].forEach(action => {
                    const attr = `data-time-${action}`;
                    if (el.hasAttribute(attr)) {
                        const at = parseFloat(el.getAttribute(attr));
                        if (t >= at && !el.classList.contains(`trigger-${action}`)) {
                            el.classList.add(`trigger-${action}`);
                            playPopSound();
                        }
                    }
                });
            });

            if (window.SceneController) {
                window.SceneController.tick(idx, t);
            }
        };

        audio.onended = () => {
            audio.ontimeupdate = null;
            if (window.SceneController) window.SceneController.reset(idx);

            if (idx === totalScenes - 1) {
                shootConfetti();
                return;
            }

            flashTransition(() => {
                currentScene++;
                playScene(currentScene);
            });
        };

    } else {
        // Fallback — no audio
        animEls.forEach(el => el.classList.add('on', 'active'));

        if (window.SceneController) {
            const tl = window.SceneController;
            for (let ms = 0; ms <= 15; ms += 0.5) {
                setTimeout(() => { if(tl) tl.tick(idx, ms); }, ms * 200);
            }
        }

        if (idx === totalScenes - 1) { shootConfetti(); return; }

        setTimeout(() => {
            flashTransition(() => {
                currentScene++;
                playScene(currentScene);
            });
        }, 5000);
    }
}

// ──────────────────────────────────────────────────────────────
//  CONFETTI — premium burst
// ──────────────────────────────────────────────────────────────
function shootConfetti() {
    const colors = ['#ef4444','#3b82f6','#10b981','#f59e0b','#ec4899','#8b5cf6','#06b6d4'];
    const canvas  = document.getElementById('canvas');

    for (let i = 0; i < 200; i++) {
        const c = document.createElement('div');
        const isCircle = Math.random() > 0.6;
        c.className = 'conf';
        c.style.left       = Math.random() * 100 + 'vw';
        c.style.top        = '-40px';
        c.style.background = colors[Math.floor(Math.random() * colors.length)];
        c.style.borderRadius = isCircle ? '50%' : '2px';
        c.style.width      = (isCircle ? 12 : 8) + 'px';
        c.style.height     = (isCircle ? 12 : 24) + 'px';
        c.style.animation  = `cfall ${1.5 + Math.random() * 2.5}s linear forwards`;
        c.style.animationDelay = Math.random() * 2.5 + 's';
        canvas.appendChild(c);

        // Clean up
        c.addEventListener('animationend', () => c.remove());
    }
}

window.shootConfetti   = shootConfetti;
window.spawnDataStream = spawnDataStream;
window.burstParticles  = burstParticles;
window.playPopSound    = playPopSound;
