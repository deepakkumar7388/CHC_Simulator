/**
 * sceneController.js
 * Story-Driven Animation Timeline Controller with Camera Rig
 * Builds scene stages + fires character actions at audio timestamps
 */

function moveChar(el, targetLeft, durationMs = 2500, goLeft = false) {
    if (!el) return;
    el.classList.remove('anim-idle', 'anim-sitting');
    el.classList.add('anim-walking');
    const char = el.querySelector('.c-character');
    if (char) char.style.transform = goLeft ? 'translateX(-50%) scaleX(-1)' : 'translateX(-50%)';
    el.style.transition = `left ${durationMs}ms cubic-bezier(0.45,0,0.55,1)`;
    el.style.left = targetLeft;
    setTimeout(() => {
        el.classList.remove('anim-walking');
        el.classList.add('anim-idle');
    }, durationMs);
}

function openDoor(doorEl) { if (doorEl) doorEl.classList.add('door-open'); }
function closeDoor(doorEl) { if (doorEl) doorEl.classList.remove('door-open'); }

function countUp(el, target, dur = 2000, prefix = '', suffix = '') {
    if (!el) return;
    const start = Date.now();
    const step = () => {
        const p = Math.min((Date.now() - start) / dur, 1);
        el.textContent = prefix + Math.floor(p * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = prefix + target + suffix;
    };
    requestAnimationFrame(step);
}

function popIn(el) {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'scale(0.2)';
    el.style.transition = 'none';
    el.style.display = '';
    requestAnimationFrame(() => {
        el.style.transition = 'all 0.55s cubic-bezier(0.34,1.56,0.64,1)';
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
    });
}

function showBubble(el) {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'scale(0.5) translateY(12px)';
    el.style.transition = 'none';
    requestAnimationFrame(() => {
        el.style.transition = 'all 0.45s cubic-bezier(0.34,1.56,0.64,1)';
        el.style.opacity = '1';
        el.style.transform = 'scale(1) translateY(0)';
    });
}

function darkenScene(overlayEl, opacity = 0.3) {
    if (!overlayEl) return;
    overlayEl.style.background = `rgba(15,23,42,${opacity})`;
}

function flyCard(el, tx, ty, dur = 1300) {
    if (!el) return;
    el.style.opacity = '1';
    el.style.transition = 'none';
    requestAnimationFrame(() => {
        el.style.transition = `transform ${dur}ms cubic-bezier(0.34,1.56,0.64,1)`;
        el.style.transform = `translate(${tx}px, ${ty}px) scale(0.85)`;
    });
}

function fadeIn(el, dur = 500) {
    if (!el) return;
    el.style.transition = `opacity ${dur}ms ease`;
    el.style.opacity = '1';
}

function doAction(el, cls, durationMs) {
    if (!el) return;
    const classes = cls.split(' ');
    el.classList.add(...classes);
    if (durationMs) setTimeout(() => el.classList.remove(...classes), durationMs);
}

function moveCamera(sceneId, x, y, scale = 1, durationMs = 3000) {
    let stage = document.getElementById(`rig-${sceneId}`);
    if (!stage) stage = document.getElementById(sceneId);
    if (!stage) return;
    stage.style.transition = `transform ${durationMs}ms cubic-bezier(0.45,0,0.55,1)`;
    stage.style.transformOrigin = 'center center';
    stage.style.transform = `scale(${scale}) translate(${x}px, ${y}px)`;
}

const SCENE_STAGES = {
    0: `<div class="camera-rig" id="rig-s1" style="width:100%;height:100%;position:absolute;left:0;top:0;">
            <!-- SKY GRADIENT -->
            <div style="position:absolute;inset:0;background:linear-gradient(180deg,#0a0e1f 0%,#0d1b38 40%,#0f172a 70%,#050816 100%);border-radius:inherit;"></div>
            <!-- STARS -->
            <div style="position:absolute;inset:0;background-image:radial-gradient(1px 1px at 15% 10%,rgba(255,255,255,0.6) 0%,transparent 100%),radial-gradient(1px 1px at 45% 25%,rgba(255,255,255,0.4) 0%,transparent 100%),radial-gradient(1px 1px at 75% 8%,rgba(255,255,255,0.5) 0%,transparent 100%),radial-gradient(1px 1px at 90% 20%,rgba(255,255,255,0.3) 0%,transparent 100%),radial-gradient(2px 2px at 30% 40%,rgba(255,255,255,0.25) 0%,transparent 100%);"></div>
            <div class="prop-sun" id="sun-s1"></div>
            <div class="prop-building" id="bldg-s1" style="right:15%;top:10%;"><div class="hosp-cross">+</div><div class="prop-door" id="door-s1"><div class="door-handle"></div></div></div>
            <div class="prop-building" id="clinic-s1" style="left:15%;top:15%;width:120px;height:140px;"><div style="font-weight:900;font-size:11px;color:#94a3b8;margin-top:-55px;letter-spacing:1px;">CONSULTATION</div><div class="prop-door" id="door-clinic-s1"><div class="door-handle"></div></div></div>
            <div class="prop-floor"></div>
            <div class="prop-reception" id="desk-s1" style="position:absolute;right:25%;bottom:20%;"><div class="prop-computer-screen" id="comp-s1"></div><div class="prop-desk-body"></div></div>
            <div class="person doc" id="doc-s1" style="position:absolute;bottom:20%;right:15%;opacity:0;"></div>
            <div class="person nurse" id="nurse-s1" style="position:absolute;bottom:20%;left:-10%;opacity:0;"></div>
            <div class="person" id="recep-s1" style="position:absolute;bottom:20%;right:33%;opacity:0;"></div>
            <div class="person patient" id="pat1-s1" style="position:absolute;bottom:20%;left:-20%;opacity:0;"></div>
            <div class="person patient" id="pat2-s1" style="position:absolute;bottom:20%;left:-30%;opacity:0;"></div>
            <div class="scene-overlay" id="ov-s1"></div>
        </div>`,
    1: `<div class="camera-rig" id="rig-s2" style="width:100%;height:100%;position:absolute;left:0;top:0;">
            <div class="prop-floor"></div>
            <div class="prop-reception" id="desk-s2" style="position:absolute;left:14%;bottom:20%;"><div class="prop-computer-screen" id="comp-s2"></div><div class="prop-desk-body"></div></div>
            <div class="person" id="recep-s2" style="position:absolute;bottom:20%;left:26%;opacity:0;"></div>
            <div class="person patient" id="pat-s2" style="position:absolute;bottom:20%;left:-15%;opacity:0;"></div>
            <div class="dept-node" id="dn-doc" style="position:absolute;top:10%;right:10%;opacity:0;"><i class="fas fa-user-md"></i><span>Doctor</span></div>
            <div class="dept-node" id="dn-nur" style="position:absolute;bottom:10%;right:10%;opacity:0;"><i class="fas fa-user-nurse"></i><span>Nurse</span></div>
            <div class="dept-node" id="dn-bil" style="position:absolute;top:40%;right:30%;opacity:0;"><i class="fas fa-file-invoice-dollar"></i><span>Billing</span></div>
            <div class="fly-card" id="fc-name" style="position:absolute;left:26%;top:65%;opacity:0;">Name: John</div>
            <div class="fly-card" id="fc-mob" style="position:absolute;left:26%;top:65%;opacity:0;">Mob: 9876XXXXX</div>
            <div class="fly-card" id="fc-iss" style="position:absolute;left:26%;top:65%;opacity:0;">Issue: Fever</div>
            <div class="scene-overlay" id="ov-s2"></div>
        </div>`,
    2: `<div class="camera-rig" id="rig-s3" style="width:100%;height:100%;position:absolute;left:0;top:0;">
            <div class="prop-floor"></div>
            <div class="prop-shelf" id="shelf-s3" style="position:absolute;right:15%;top:20%;"><div class="prop-file-book" style="background:#ef4444;"></div><div class="prop-file-book" style="background:#3b82f6;"></div><div class="prop-file-book" style="background:#10b981;"></div><div class="prop-file-book" style="background:#f59e0b;"></div></div>
            <div class="prop-desk-small" style="position:absolute;right:25%;bottom:20%;"><div class="prop-register"></div></div>
            <div class="prop-reception" id="desk-s3" style="position:absolute;left:10%;bottom:20%;"><div class="prop-desk-body"></div></div>
            <div class="person" id="recep-s3" style="position:absolute;bottom:20%;left:22%;"></div>
            <div class="person doc" id="doc-s3" style="position:absolute;bottom:20%;left:45%;opacity:0;"></div>
            <div class="q-bubble" id="qb-file" style="position:absolute;left:40%;top:10%;opacity:0;">File kahan hai? 📂</div>
            <div class="q-bubble" id="qb-treat" style="position:absolute;right:15%;top:30%;opacity:0;">Purana Treatment?</div>
            <div class="q-bubble" id="qb-allergy" style="position:absolute;left:12%;top:40%;opacity:0;">Allergy thi kya?</div>
            <i class="fas fa-clock" id="clock-s3" style="position:absolute;top:10%;left:8%;font-size:55px;color:#ef4444;opacity:0;animation:spin 2s infinite linear;"></i>
            <div class="scene-overlay" id="ov-s3"></div>
        </div>`,
    3: `<div class="camera-rig" id="rig-s4" style="width:100%;height:100%;position:absolute;left:0;top:0;">
            <div class="prop-floor"></div>
            <div class="prop-ambulance" id="amb-s4" style="position:absolute;bottom:20%;left:-30%;"><span style="font-size:90px;line-height:1;">🚑</span><div class="amb-light" id="aml-s4"></div></div>
            <div class="prop-hosp-bed" id="bed-s4" style="position:absolute;right:5%;bottom:20%;opacity:0;"></div>
            <div class="person patient" id="emg-s4" style="position:absolute;bottom:20%;left:10%;opacity:0;"></div>
            <div class="person doc" id="doc-s4" style="position:absolute;bottom:20%;right:35%;opacity:0;"></div>
            <div class="person nurse" id="nurse-s4" style="position:absolute;bottom:20%;left:35%;opacity:0;"></div>
            <div class="q-bubble" id="qb-bed" style="position:absolute;top:15%;left:45%;opacity:0;color:#ef4444;border-color:#ef4444;">Bed Available?! 🛏️</div>
            <i class="fas fa-clock" id="timer-s4" style="position:absolute;top:8%;right:8%;font-size:55px;color:#ef4444;opacity:0;animation:spin 1.5s infinite linear;"></i>
            <div class="scene-overlay" id="ov-s4"></div>
        </div>`,
    4: `<div class="camera-rig" id="rig-s5" style="width:100%;height:100%;position:absolute;left:0;top:0;">
            <div class="prop-floor"></div>
            <div class="prop-hosp-bed" id="bed-s5" style="position:absolute;left:15%;bottom:20%;"><div class="bed-patient-icon">🤒</div></div>
            <div class="person nurse" id="nurse-s5" style="position:absolute;bottom:20%;left:35%;opacity:0;"></div>
            <div class="vital-tag" id="vt-bp" style="position:absolute;top:20%;left:50%;opacity:0;background:#fef2f2;color:#ef4444;border:2px solid #fca5a5;">🫀 BP: 120/80</div>
            <div class="vital-tag" id="vt-tmp" style="position:absolute;top:35%;left:55%;opacity:0;background:#fffbeb;color:#d97706;border:2px solid #fde68a;">🌡️ Temp: 98°F</div>
            <div class="vital-tag" id="vt-spo" style="position:absolute;top:50%;left:48%;opacity:0;background:#f0fdf4;color:#059669;border:2px solid #6ee7b7;">💉 SpO2: 98%</div>
            <div class="vital-tag" id="vt-med" style="position:absolute;top:65%;left:60%;opacity:0;background:#eff6ff;color:#1d4ed8;border:2px solid #93c5fd;">💊 Meds: Paracetamol</div>
            <div class="paper-stack" id="pstack-s5" style="position:absolute;right:15%;bottom:20%;"><div class="s-paper sp1"></div><div class="s-paper sp2"></div><div class="s-paper sp3"></div></div>
            <div class="q-bubble" id="qb-kal" style="position:absolute;right:10%;top:15%;opacity:0;color:#ef4444;border-color:#ef4444;">Kal ka record kahan? 😰</div>
            <div class="scene-overlay" id="ov-s5"></div>
        </div>`,
    5: `<div class="camera-rig" id="rig-s6" style="width:100%;height:100%;position:absolute;left:0;top:0;">
            <div class="prop-floor"></div>
            <div class="person patient" id="pat-s6" style="position:absolute;bottom:20%;left:15%;opacity:0;"><div class="speech-label" style="position:absolute;top:-38px;left:-10px;background:#10b981;color:white;padding:5px 14px;border-radius:20px;font-size:13px;font-weight:800;white-space:nowrap;border:2px solid #2d1a0e;">✅ Ready for Discharge!</div></div>
            <div class="prop-reception" id="bil-desk-s6" style="position:absolute;right:15%;bottom:20%;"><div class="prop-computer-screen" id="bil-comp-s6"></div><div class="prop-desk-body"></div></div>
            <div class="person admin" id="bil-staff-s6" style="position:absolute;bottom:20%;right:26%;opacity:0;"></div>
            <div class="fly-card" id="bc-1" style="position:absolute;left:15%;top:20%;opacity:0;border-left-color:#4f46e5;">Doctor Charges ₹₹₹</div>
            <div class="fly-card" id="bc-2" style="position:absolute;left:15%;top:35%;opacity:0;border-left-color:#ef4444;">Medicines ₹₹₹</div>
            <div class="fly-card" id="bc-3" style="position:absolute;left:15%;top:50%;opacity:0;border-left-color:#10b981;">Nursing ₹₹₹</div>
            <i class="fas fa-calculator" id="calc-s6" style="position:absolute;top:20%;right:35%;font-size:40px;color:#334155;opacity:0;"></i>
            <i class="fas fa-hourglass-half" id="hglass-s6" style="position:absolute;top:10%;left:45%;font-size:60px;color:#ef4444;opacity:0;animation:spin 3s infinite linear;"></i>
            <div class="scene-overlay" id="ov-s6"></div>
        </div>`,
    6: `<div class="camera-rig" id="rig-s7" style="width:100%;height:100%;position:absolute;left:0;top:0;">
            <div class="data-orb" id="orb-s7" style="position:absolute;top:30%;left:42%;opacity:0;transform:scale(0);"><i class="fas fa-database" style="font-size:48px;color:#4f46e5;display:block;margin-bottom:6px;"></i><div style="font-size:13px;font-weight:800;color:#4f46e5;text-align:center;">Patient Data</div></div>
            <div class="person doc" id="doc-s7" style="position:absolute;top:10%;left:10%;opacity:0;"></div>
            <div class="person nurse" id="nurse-s7" style="position:absolute;top:10%;right:10%;opacity:0;"></div>
            <div class="person admin" id="admin-s7" style="position:absolute;bottom:10%;left:10%;opacity:0;"></div>
            <div class="person" id="recep-s7" style="position:absolute;bottom:10%;right:10%;opacity:0;"></div>
            <div class="access-tag at-yes" id="ac-d1" style="position:absolute;top:20%;left:25%;opacity:0;">✓ Clinical</div>
            <div class="access-tag at-no" id="ac-d2" style="position:absolute;top:30%;left:25%;opacity:0;">✕ Revenue</div>
            <div class="access-tag at-yes" id="ac-n1" style="position:absolute;top:20%;right:25%;opacity:0;">✓ Treatment</div>
            <div class="access-tag at-no" id="ac-n2" style="position:absolute;top:30%;right:25%;opacity:0;">✕ Billing</div>
            <div class="access-tag at-yes" id="ac-a1" style="position:absolute;bottom:30%;left:25%;opacity:0;">✓ Full Overview</div>
            <div class="access-tag at-yes" id="ac-r1" style="position:absolute;bottom:30%;right:25%;opacity:0;">✓ Admission</div>
            <div class="scene-overlay" id="ov-s7"></div>
        </div>`,
    7: `<div class="camera-rig" id="rig-s8" style="width:100%;height:100%;position:absolute;left:0;top:0;">
            <div class="prop-floor"></div>
            <div class="person doc" id="doc-s8" style="position:absolute;bottom:20%;left:15%;opacity:0;"></div>
            <div class="person nurse" id="nurse-s8" style="position:absolute;bottom:20%;right:15%;opacity:0;"></div>
            <div class="file-card" id="fc-instr" style="position:absolute;top:25%;left:20%;opacity:0;">📋 Give Medicines Now</div>
            <div class="msg-arrow-wrap" id="msg-s8" style="position:absolute;top:45%;left:30%;width:40%;opacity:0;"><div class="msg-line"></div><div class="msg-blocker" id="mb-s8" style="opacity:0;"><div style="font-size:28px;">❌</div><div style="font-size:12px;font-weight:800;color:#ef4444;">STUCK</div></div></div>
            <i class="fas fa-clock" id="timer-s8" style="position:absolute;top:15%;left:47%;font-size:52px;color:#ef4444;opacity:0;animation:spin 3s infinite linear;"></i>
            <div class="q-bubble" id="qb-late" style="position:absolute;bottom:35%;right:10%;opacity:0;color:#ef4444;border-color:#ef4444;">Information Late! 😤</div>
            <div class="scene-overlay" id="ov-s8"></div>
        </div>`,
    8: `<div class="camera-rig" id="rig-s9" style="width:100%;height:100%;position:absolute;left:0;top:0;">
            <div class="prop-floor"></div>
            <div class="person admin" id="admin-s9" style="position:absolute;bottom:20%;left:-10%;opacity:0;"></div>
            <div class="prop-big-dashboard" id="dash-s9" style="position:absolute;right:10%;top:10%;width:50%;height:70%;opacity:0;transform:scale(0.8);border-color:rgba(239,68,68,0.5);box-shadow:0 0 40px rgba(239,68,68,0.3), inset 0 0 20px rgba(239,68,68,0.1);">
                <div class="dash-inner-title" style="color:#f87171;border-bottom-color:rgba(239,68,68,0.3);text-shadow:0 0 10px rgba(239,68,68,0.5);">⚠️ SYNC FAILED</div>
                <div class="dash-2x2">
                    <div class="dash-counter-card" style="border-color:rgba(239,68,68,0.3);"><div class="dc-label">Patients Today</div><div class="dc-num" id="cnt-pat" style="color:#ef4444;font-size:20px;text-shadow:0 0 10px rgba(239,68,68,0.6);">WAITING...</div></div>
                    <div class="dash-counter-card" style="border-color:rgba(239,68,68,0.3);"><div class="dc-label">Beds Occupied</div><div class="dc-num" id="cnt-bed" style="color:#ef4444;font-size:20px;text-shadow:0 0 10px rgba(239,68,68,0.6);">NO DATA</div></div>
                    <div class="dash-counter-card" style="border-color:rgba(239,68,68,0.3);"><div class="dc-label">Revenue</div><div class="dc-num" id="cnt-rev" style="color:#ef4444;font-size:20px;text-shadow:0 0 10px rgba(239,68,68,0.6);">ERROR</div></div>
                    <div class="dash-counter-card" style="border-color:rgba(239,68,68,0.3);"><div class="dc-label">Pending</div><div class="dc-num" id="cnt-pen" style="color:#ef4444;font-size:20px;text-shadow:0 0 10px rgba(239,68,68,0.6);">OFFLINE</div></div>
                </div>
                <div id="loader-s9" style="position:absolute;top:55%;left:50%;transform:translate(-50%,-50%);font-size:50px;color:#ef4444;animation:spin 1s infinite linear;text-shadow:0 0 20px rgba(239,68,68,0.8);"><i class="fas fa-sync"></i></div>
            </div>
            <div class="scene-overlay" id="ov-s9"></div>
        </div>`,
    9: `<div class="camera-rig" id="rig-s10" style="width:100%;height:100%;position:absolute;left:0;top:0;">
            <svg style="position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:-1;" id="lines-s10"></svg>
            <div class="dept-node" id="d10-pat" style="position:absolute;top:20%;left:20%;opacity:0;border-color:rgba(239,68,68,0.5);box-shadow:0 0 20px rgba(239,68,68,0.3);"><i class="fas fa-user" style="color:#f87171;text-shadow:0 0 10px rgba(239,68,68,0.6);"></i><span>Patient</span></div>
            <div class="dept-node" id="d10-doc" style="position:absolute;bottom:20%;left:40%;opacity:0;border-color:rgba(239,68,68,0.5);box-shadow:0 0 20px rgba(239,68,68,0.3);"><i class="fas fa-user-md" style="color:#f87171;text-shadow:0 0 10px rgba(239,68,68,0.6);"></i><span>Staff</span></div>
            <div class="dept-node" id="d10-bed" style="position:absolute;top:20%;right:40%;opacity:0;border-color:rgba(239,68,68,0.5);box-shadow:0 0 20px rgba(239,68,68,0.3);"><i class="fas fa-bed" style="color:#f87171;text-shadow:0 0 10px rgba(239,68,68,0.6);"></i><span>Beds</span></div>
            <div class="dept-node" id="d10-file" style="position:absolute;bottom:20%;right:20%;opacity:0;border-color:rgba(239,68,68,0.5);box-shadow:0 0 20px rgba(239,68,68,0.3);"><i class="fas fa-file-alt" style="color:#f87171;text-shadow:0 0 10px rgba(239,68,68,0.6);"></i><span>Files</span></div>
            <div class="fly-card" id="fc10-1" style="position:absolute;left:25%;top:25%;opacity:0;border-left-color:#ef4444;color:#f87171;">Connection Lost...</div>
            <div class="fly-card" id="fc10-2" style="position:absolute;left:65%;top:65%;opacity:0;border-left-color:#ef4444;color:#f87171;">Timeout...</div>
            <div id="prob-warn" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:36px;color:#ef4444;font-weight:900;opacity:0;text-shadow:0 0 30px rgba(239,68,68,1);white-space:nowrap;letter-spacing:4px;background:rgba(15,23,42,0.85);padding:20px 40px;border:2px solid rgba(239,68,68,0.5);border-radius:15px;backdrop-filter:blur(10px);box-shadow:0 0 50px rgba(239,68,68,0.4);">SYSTEM DELAY</div>
        </div>`,
    10: `<div class="camera-rig" id="rig-s11" style="width:100%;height:100%;position:absolute;left:0;top:0;">
            <!-- Chaotic Elements (Old System) -->
            <div id="chaos-container" style="position:absolute;width:100%;height:100%;pointer-events:none;z-index:5;">
                <div class="chaos-item" id="c-1" style="position:absolute;top:15%;left:10%;opacity:0;background:rgba(239,68,68,0.15);border:2px solid rgba(239,68,68,0.6);padding:12px 20px;border-radius:12px;color:#fca5a5;font-weight:900;display:flex;align-items:center;gap:12px;box-shadow:0 0 20px rgba(239,68,68,0.3);backdrop-filter:blur(5px);"><span style="font-size:30px;">📄</span> Papers & Files</div>
                <div class="chaos-item" id="c-2" style="position:absolute;bottom:20%;left:25%;opacity:0;background:rgba(239,68,68,0.15);border:2px solid rgba(239,68,68,0.6);padding:12px 20px;border-radius:12px;color:#fca5a5;font-weight:900;display:flex;align-items:center;gap:12px;box-shadow:0 0 20px rgba(239,68,68,0.3);backdrop-filter:blur(5px);"><span style="font-size:30px;">📒</span> Separate Registers</div>
                <div class="chaos-item" id="c-3" style="position:absolute;top:20%;right:10%;opacity:0;background:rgba(239,68,68,0.15);border:2px solid rgba(239,68,68,0.6);padding:12px 20px;border-radius:12px;color:#fca5a5;font-weight:900;display:flex;align-items:center;gap:12px;box-shadow:0 0 20px rgba(239,68,68,0.3);backdrop-filter:blur(5px);"><span style="font-size:30px;">🛏️</span> Bed Information</div>
                <div class="chaos-item" id="c-4" style="position:absolute;bottom:20%;right:25%;opacity:0;background:rgba(239,68,68,0.15);border:2px solid rgba(239,68,68,0.6);padding:12px 20px;border-radius:12px;color:#fca5a5;font-weight:900;display:flex;align-items:center;gap:12px;box-shadow:0 0 20px rgba(239,68,68,0.3);backdrop-filter:blur(5px);"><span style="font-size:30px;">🧾</span> Billing Papers</div>
                <div class="chaos-item" id="c-5" style="position:absolute;top:40%;left:5%;opacity:0;background:rgba(239,68,68,0.15);border:2px solid rgba(239,68,68,0.6);padding:12px 20px;border-radius:12px;color:#fca5a5;font-weight:900;display:flex;align-items:center;gap:12px;box-shadow:0 0 20px rgba(239,68,68,0.3);backdrop-filter:blur(5px);"><span style="font-size:30px;">👨‍⚕️</span> Doctor Records</div>
                <div class="chaos-item" id="c-6" style="position:absolute;top:10%;left:45%;opacity:0;background:rgba(239,68,68,0.15);border:2px solid rgba(239,68,68,0.6);padding:12px 20px;border-radius:12px;color:#fca5a5;font-weight:900;display:flex;align-items:center;gap:12px;box-shadow:0 0 20px rgba(239,68,68,0.3);backdrop-filter:blur(5px);"><span style="font-size:30px;">👩‍⚕️</span> Nurse Records</div>
                <div class="chaos-item" id="c-7" style="position:absolute;bottom:10%;left:45%;opacity:0;background:rgba(239,68,68,0.15);border:2px solid rgba(239,68,68,0.6);padding:12px 20px;border-radius:12px;color:#fca5a5;font-weight:900;display:flex;align-items:center;gap:12px;box-shadow:0 0 20px rgba(239,68,68,0.3);backdrop-filter:blur(5px);"><span style="font-size:30px;">📝</span> Reception Records</div>
                <div class="chaos-item" id="c-8" style="position:absolute;top:40%;right:5%;opacity:0;background:rgba(239,68,68,0.15);border:2px solid rgba(239,68,68,0.6);padding:12px 20px;border-radius:12px;color:#fca5a5;font-weight:900;display:flex;align-items:center;gap:12px;box-shadow:0 0 20px rgba(239,68,68,0.3);backdrop-filter:blur(5px);"><span style="font-size:30px;">🔌</span> Disconnected!</div>
            </div>

            <!-- Outer Ring Nodes (New System) - Start in center -->
            <div class="dept-node" id="s11-n1" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);opacity:0;border-color:rgba(59,130,246,0.5);box-shadow:0 0 20px rgba(59,130,246,0.3);"><i class="fas fa-file" style="color:#60a5fa;text-shadow:0 0 10px rgba(59,130,246,0.6);"></i><span>Records</span></div>
            <div class="dept-node" id="s11-n2" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);opacity:0;border-color:rgba(16,185,129,0.5);box-shadow:0 0 20px rgba(16,185,129,0.3);"><i class="fas fa-bed" style="color:#34d399;text-shadow:0 0 10px rgba(16,185,129,0.6);"></i><span>Beds</span></div>
            <div class="dept-node" id="s11-n3" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);opacity:0;border-color:rgba(245,158,11,0.5);box-shadow:0 0 20px rgba(245,158,11,0.3);"><i class="fas fa-user-md" style="color:#fbbf24;text-shadow:0 0 10px rgba(245,158,11,0.6);"></i><span>Staff</span></div>
            <div class="dept-node" id="s11-n4" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(0);opacity:0;border-color:rgba(236,72,153,0.5);box-shadow:0 0 20px rgba(236,72,153,0.3);"><i class="fas fa-file-invoice-dollar" style="color:#f472b6;text-shadow:0 0 10px rgba(236,72,153,0.6);"></i><span>Billing</span></div>
            
            <!-- Central HMS Hub -->
            <div id="hms-hub-s11" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(0);opacity:0;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:white;border-radius:50%;box-shadow:0 0 80px rgba(139,92,246,1), inset 0 0 30px rgba(255,255,255,0.4);font-size:24px;font-weight:900;text-align:center;border:4px solid rgba(255,255,255,0.4);text-shadow:0 2px 8px rgba(0,0,0,0.6);width:180px;height:180px;display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:20;">
                <i class="fas fa-hospital" style="font-size:55px;margin-bottom:8px;text-shadow:0 0 20px rgba(255,255,255,0.8);"></i>
                <div style="line-height:1.2;">Chaudhary<br><span style="font-size:16px;font-weight:600;color:#e2e8f0;">HMS HUB</span></div>
            </div>
            <!-- Connection Lines -->
            <svg style="position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:-1;" id="lines-s11"></svg>
            <div class="scene-overlay" id="ov-s11"></div>
        </div>`,
    11: `<div class="camera-rig" id="rig-s12" style="width:100%;height:100%;position:absolute;left:0;top:0;">
            <!-- Fixed Layout replacing massive zooming map to avoid clipping -->
            <!-- TOP ROW -->
            <!-- Reception -->
            <div class="person patient" id="p12" style="position:absolute;top:10%;left:10%;opacity:0;"></div>
            <div class="person recep" id="r12" style="position:absolute;top:10%;left:18%;opacity:0;"></div>
            <div id="prof12" style="position:absolute;top:5%;left:25%;opacity:0;background:rgba(16,185,129,0.1);padding:8px 12px;border-radius:10px;border:1px solid rgba(16,185,129,0.4);font-size:12px;box-shadow:0 0 15px rgba(16,185,129,0.2);color:#e2e8f0;backdrop-filter:blur(8px);">
                <div style="color:#10b981;font-weight:bold;text-shadow:0 0 8px rgba(16,185,129,0.5);">✓ Profile Created</div>
                <div>Name: John</div><div>Mob: 9876X</div>
            </div>
            
            <!-- Ward Map -->
            <div id="bed-map12" style="position:absolute;top:5%;right:10%;opacity:0;background:rgba(59,130,246,0.1);padding:12px;border-radius:10px;border:1px solid rgba(59,130,246,0.4);font-size:12px;box-shadow:0 0 15px rgba(59,130,246,0.2);color:#e2e8f0;backdrop-filter:blur(8px);">
                <div style="font-weight:bold;color:#3b82f6;text-shadow:0 0 8px rgba(59,130,246,0.5);">Live Ward Map</div>
                <div style="display:flex;gap:5px;margin-top:5px;">
                    <div style="width:25px;height:25px;background:rgba(239,68,68,0.2);border:1px solid rgba(239,68,68,0.5);border-radius:4px;box-shadow:0 0 8px rgba(239,68,68,0.3);"></div>
                    <div style="width:25px;height:25px;background:rgba(239,68,68,0.2);border:1px solid rgba(239,68,68,0.5);border-radius:4px;box-shadow:0 0 8px rgba(239,68,68,0.3);"></div>
                    <div id="b12-avail" style="width:25px;height:25px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:4px;"></div>
                </div>
                <div id="b12-text" style="color:#10b981;font-weight:bold;margin-top:5px;opacity:0;text-shadow:0 0 8px rgba(16,185,129,0.5);">✓ Bed Assigned</div>
            </div>

            <!-- BOTTOM ROW -->
            <!-- Doctor -->
            <div class="person doc" id="d12" style="position:absolute;bottom:20%;left:10%;opacity:0;"></div>
            <div id="hist12" style="position:absolute;bottom:15%;left:18%;opacity:0;background:rgba(245,158,11,0.1);padding:8px 12px;border-radius:10px;border:1px solid rgba(245,158,11,0.4);font-size:12px;box-shadow:0 0 15px rgba(245,158,11,0.2);color:#e2e8f0;backdrop-filter:blur(8px);">
                <div style="color:#f59e0b;font-weight:bold;text-shadow:0 0 8px rgba(245,158,11,0.5);">★ Patient History</div>
                <div>Allergy: None</div><div>Treatment: Yes</div>
            </div>

            <!-- Nurse Vitals -->
            <div class="person nurse" id="n12" style="position:absolute;bottom:20%;left:45%;opacity:0;"></div>
            <div id="vit12" style="position:absolute;bottom:15%;left:52%;opacity:0;background:rgba(239,68,68,0.1);padding:8px 12px;border-radius:10px;border:1px solid rgba(239,68,68,0.4);font-size:12px;box-shadow:0 0 15px rgba(239,68,68,0.2);color:#e2e8f0;backdrop-filter:blur(8px);">
                <div style="color:#ef4444;font-weight:bold;text-shadow:0 0 8px rgba(239,68,68,0.5);">♥ Vitals Timeline</div>
                <div id="v12-bp" style="opacity:0;background:rgba(16,185,129,0.15);padding:2px;border-radius:3px;margin-top:3px;border:1px solid rgba(16,185,129,0.3);color:#10b981;">09:00 - BP 120/80 ✓</div>
                <div id="v12-t" style="opacity:0;background:rgba(16,185,129,0.15);padding:2px;border-radius:3px;margin-top:3px;border:1px solid rgba(16,185,129,0.3);color:#10b981;">09:05 - Temp 98.6 ✓</div>
            </div>
            <i class="fas fa-bell" id="bell12" style="position:absolute;bottom:45%;left:48%;color:#ef4444;font-size:30px;opacity:0;text-shadow:0 0 15px rgba(239,68,68,0.6);"></i>

            <!-- Billing -->
            <div id="bill12" style="position:absolute;bottom:15%;right:10%;opacity:0;background:rgba(79,70,229,0.1);padding:8px 12px;border-radius:10px;border:1px solid rgba(79,70,229,0.4);font-size:12px;box-shadow:0 0 15px rgba(79,70,229,0.2);color:#e2e8f0;backdrop-filter:blur(8px);">
                <div style="color:#8b5cf6;font-weight:bold;text-shadow:0 0 8px rgba(139,92,246,0.5);">₹ Auto Billing</div>
                <div id="v12-c1" style="opacity:0;margin-top:2px;">+ Doctor ₹500</div>
                <div id="v12-c2" style="opacity:0;margin-top:2px;">+ Nursing ₹200</div>
                <div id="v12-c3" style="opacity:0;margin-top:2px;">+ Meds ₹300</div>
                <div style="border-top:1px solid rgba(255,255,255,0.2);margin-top:4px;padding-top:4px;">Total: <span id="v12-sub" style="color:#10b981;">₹0</span></div>
                <div id="v12-billdone" style="color:#10b981;font-weight:bold;opacity:0;margin-top:2px;text-shadow:0 0 8px rgba(16,185,129,0.5);">✓ GENERATED</div>
            </div>
        </div>`,
    12: `<div class="camera-rig" id="rig-s13" style="width:100%;height:100%;position:absolute;left:0;top:0;">
            <div id="hms-center13" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#4f46e5,#7c3aed);color:white;padding:15px;border-radius:50%;width:80px;height:80px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:18px;box-shadow:0 0 30px rgba(139,92,246,0.6);border:2px solid rgba(255,255,255,0.2);">HMS</div>
            
            <div class="person admin" id="p13-a" style="position:absolute;top:20%;left:50%;transform:translateX(-50%);opacity:0;"></div>
            <div id="dash-admin" style="position:absolute;top:15%;left:58%;opacity:0;background:rgba(16,185,129,0.1);padding:8px 12px;border-radius:8px;box-shadow:0 0 15px rgba(16,185,129,0.2);border-left:4px solid #10b981;border-top:1px solid rgba(255,255,255,0.1);border-right:1px solid rgba(255,255,255,0.1);border-bottom:1px solid rgba(255,255,255,0.1);font-weight:bold;font-size:13px;white-space:nowrap;color:#10b981;backdrop-filter:blur(8px);text-shadow:0 0 8px rgba(16,185,129,0.5);">Overview ✓</div>
            
            <div class="person doc" id="p13-d" style="position:absolute;bottom:20%;left:50%;transform:translateX(-50%);opacity:0;"></div>
            <div id="dash-doc" style="position:absolute;bottom:20%;left:58%;opacity:0;background:rgba(16,185,129,0.1);padding:8px 12px;border-radius:8px;box-shadow:0 0 15px rgba(16,185,129,0.2);border-left:4px solid #10b981;border-top:1px solid rgba(255,255,255,0.1);border-right:1px solid rgba(255,255,255,0.1);border-bottom:1px solid rgba(255,255,255,0.1);font-weight:bold;font-size:13px;white-space:nowrap;color:#10b981;backdrop-filter:blur(8px);text-shadow:0 0 8px rgba(16,185,129,0.5);">Clinical ✓</div>
            <div id="lock-doc" style="position:absolute;bottom:8%;left:58%;opacity:0;background:rgba(239,68,68,0.1);color:#ef4444;padding:8px 12px;border-radius:8px;border:1px solid rgba(239,68,68,0.5);font-weight:bold;font-size:13px;white-space:nowrap;backdrop-filter:blur(8px);text-shadow:0 0 8px rgba(239,68,68,0.5);box-shadow:0 0 15px rgba(239,68,68,0.2);">Revenue 🔒</div>

            <div class="person nurse" id="p13-n" style="position:absolute;top:50%;left:25%;transform:translateY(-50%);opacity:0;"></div>
            <div id="dash-nurse" style="position:absolute;top:55%;left:22%;opacity:0;background:rgba(16,185,129,0.1);padding:8px 12px;border-radius:8px;box-shadow:0 0 15px rgba(16,185,129,0.2);border-left:4px solid #10b981;border-top:1px solid rgba(255,255,255,0.1);border-right:1px solid rgba(255,255,255,0.1);border-bottom:1px solid rgba(255,255,255,0.1);font-weight:bold;font-size:13px;white-space:nowrap;color:#10b981;backdrop-filter:blur(8px);text-shadow:0 0 8px rgba(16,185,129,0.5);">Patient Care ✓</div>

            <div class="person recep" id="p13-r" style="position:absolute;top:50%;right:25%;transform:translateY(-50%);opacity:0;"></div>
            <div id="dash-recep" style="position:absolute;top:55%;right:15%;opacity:0;background:rgba(16,185,129,0.1);padding:8px 12px;border-radius:8px;box-shadow:0 0 15px rgba(16,185,129,0.2);border-left:4px solid #10b981;border-top:1px solid rgba(255,255,255,0.1);border-right:1px solid rgba(255,255,255,0.1);border-bottom:1px solid rgba(255,255,255,0.1);font-weight:bold;font-size:13px;white-space:nowrap;color:#10b981;backdrop-filter:blur(8px);text-shadow:0 0 8px rgba(16,185,129,0.5);">Registration ✓</div>
        </div>`,
    13: `<div class="camera-rig" id="rig-s14" style="width:100%;height:100%;position:absolute;left:0;top:0;">
            <div id="final-before" style="position:absolute;left:15%;top:35%;font-size:24px;color:#ef4444;font-weight:bold;opacity:0;">BEFORE<br><span style="font-size:16px;color:#64748b;">Searching Files...</span></div>
            <div id="final-after" style="position:absolute;right:15%;top:35%;font-size:24px;color:#10b981;font-weight:bold;opacity:0;">AFTER<br><span style="font-size:16px;color:#64748b;">Digital Information ✓</span></div>
            <div class="person doc" id="fdoc" style="position:absolute;left:30%;bottom:20%;opacity:0;"></div>
            <div class="person doc" id="fdoc2" style="position:absolute;right:30%;bottom:20%;opacity:0;"></div>
            <div class="fly-card" id="ffile" style="position:absolute;left:25%;top:45%;opacity:0;background:#fef2f2;font-size:14px;">File?</div>
            <div class="fly-card" id="fdig" style="position:absolute;right:25%;top:45%;opacity:0;border-left-color:#10b981;font-size:14px;">Data Arrived ✓</div>

            <div id="live-dash" style="position:absolute;top:10%;left:10%;width:80%;height:80%;background:rgba(15,23,42,0.85);backdrop-filter:blur(12px);border:2px solid rgba(148,163,184,0.3);border-radius:20px;box-shadow:0 25px 50px rgba(0,0,0,0.6), inset 0 0 30px rgba(0,0,0,0.5);opacity:0;padding:20px;display:flex;flex-direction:column;align-items:center;z-index:10;box-sizing:border-box;">
                <h1 style="color:#a78bfa;font-size:28px;margin-bottom:20px;margin-top:0;text-shadow:0 0 15px rgba(167,139,250,0.6);">LIVE HOSPITAL DASHBOARD</h1>
                <div style="display:flex;gap:30px;width:100%;justify-content:center;">
                    <div style="text-align:center;"><div style="font-size:40px;color:#34d399;font-weight:900;text-shadow:0 0 15px rgba(52,211,153,0.4);">142</div><div style="font-size:14px;font-weight:bold;color:#cbd5e1;">Patients Today</div></div>
                    <div style="text-align:center;"><div style="font-size:40px;color:#60a5fa;font-weight:900;text-shadow:0 0 15px rgba(96,165,250,0.4);">85%</div><div style="font-size:14px;font-weight:bold;color:#cbd5e1;">Beds Occupied</div></div>
                    <div style="text-align:center;"><div style="font-size:40px;color:#fbbf24;font-weight:900;text-shadow:0 0 15px rgba(251,191,36,0.4);">12</div><div style="font-size:14px;font-weight:bold;color:#cbd5e1;">Active Staff</div></div>
                    <div style="text-align:center;"><div style="font-size:40px;color:#c084fc;font-weight:900;text-shadow:0 0 15px rgba(192,132,252,0.4);">₹1.2M</div><div style="font-size:14px;font-weight:bold;color:#cbd5e1;">Revenue</div></div>
                </div>
                <div style="display:flex;gap:20px;margin-top:40px;flex-wrap:wrap;justify-content:center;">
                    <div style="background:rgba(16,185,129,0.15);color:#34d399;padding:10px 20px;border-radius:10px;font-weight:bold;font-size:16px;border:1px solid rgba(16,185,129,0.5);text-shadow:0 0 8px rgba(52,211,153,0.5);box-shadow:0 0 15px rgba(16,185,129,0.2);">Reception ✓</div>
                    <div style="background:rgba(16,185,129,0.15);color:#34d399;padding:10px 20px;border-radius:10px;font-weight:bold;font-size:16px;border:1px solid rgba(16,185,129,0.5);text-shadow:0 0 8px rgba(52,211,153,0.5);box-shadow:0 0 15px rgba(16,185,129,0.2);">Doctor ✓</div>
                    <div style="background:rgba(16,185,129,0.15);color:#34d399;padding:10px 20px;border-radius:10px;font-weight:bold;font-size:16px;border:1px solid rgba(16,185,129,0.5);text-shadow:0 0 8px rgba(52,211,153,0.5);box-shadow:0 0 15px rgba(16,185,129,0.2);">Nurse ✓</div>
                    <div style="background:rgba(16,185,129,0.15);color:#34d399;padding:10px 20px;border-radius:10px;font-weight:bold;font-size:16px;border:1px solid rgba(16,185,129,0.5);text-shadow:0 0 8px rgba(52,211,153,0.5);box-shadow:0 0 15px rgba(16,185,129,0.2);">Billing ✓</div>
                </div>
            </div>
            
            <div id="final-brand" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);opacity:0;text-align:center;z-index:20;background:rgba(15,23,42,0.9);backdrop-filter:blur(16px);border:2px solid rgba(139,92,246,0.4);padding:30px 40px;border-radius:20px;width:80%;max-width:550px;box-shadow:0 20px 50px rgba(0,0,0,0.8), inset 0 0 30px rgba(139,92,246,0.2);">
                <div style="font-size:48px;line-height:1;margin-bottom:10px;text-shadow:0 0 20px rgba(255,255,255,0.3);">🏥</div>
                <h1 style="color:#a78bfa;font-size:32px;margin:10px 0;white-space:nowrap;text-shadow:0 0 15px rgba(167,139,250,0.6);">CHAUDHARY HEALTH CARE</h1>
                <h2 style="color:#34d399;font-size:20px;margin:0;white-space:nowrap;text-shadow:0 0 10px rgba(52,211,153,0.6);">HOSPITAL MANAGEMENT SYSTEM</h2>
                <div style="margin-top:20px;display:flex;justify-content:center;gap:15px;flex-wrap:wrap;">
                    <span style="background:rgba(59,130,246,0.15);color:#60a5fa;border:1px solid rgba(59,130,246,0.5);padding:8px 16px;border-radius:20px;font-weight:bold;font-size:13px;text-shadow:0 0 8px rgba(96,165,250,0.5);box-shadow:0 0 10px rgba(59,130,246,0.2);">✓ CONNECTED</span>
                    <span style="background:rgba(59,130,246,0.15);color:#60a5fa;border:1px solid rgba(59,130,246,0.5);padding:8px 16px;border-radius:20px;font-weight:bold;font-size:13px;text-shadow:0 0 8px rgba(96,165,250,0.5);box-shadow:0 0 10px rgba(59,130,246,0.2);">✓ ORGANIZED</span>
                    <span style="background:rgba(59,130,246,0.15);color:#60a5fa;border:1px solid rgba(59,130,246,0.5);padding:8px 16px;border-radius:20px;font-weight:bold;font-size:13px;text-shadow:0 0 8px rgba(96,165,250,0.5);box-shadow:0 0 10px rgba(59,130,246,0.2);">✓ REAL-TIME</span>
                </div>
            </div>
        </div>`
};

const SCENE_TIMELINES = [
    // SCENE 1
    [
        { t: 0.2, fired: false, fn: () => {
            const b = document.getElementById('bldg-s1');
            if (b) { b.style.opacity='0'; b.style.transform='translateY(30px)'; b.style.transition='all 0.9s'; requestAnimationFrame(()=> { b.style.opacity='1'; b.style.transform='translateY(0)'; }); }
        }},
        { t: 1.0, fired: false, fn: () => moveCamera('s1', 0, 20, 1.1) },
        { t: 2.0, fired: false, fn: () => {
            openDoor(document.getElementById('door-s1'));
            const doc = document.getElementById('doc-s1');
            if (doc) { doc.style.opacity='1'; moveChar(doc, '55%', 3500); }
        }},
        { t: 3.5, fired: false, fn: () => {
            const nur = document.getElementById('nurse-s1');
            if (nur) { nur.style.opacity='1'; moveChar(nur, '20%', 3500); }
        }},
        { t: 4.5, fired: false, fn: () => {
            const r = document.getElementById('recep-s1');
            if (r) { r.style.opacity='1'; r.classList.add('anim-idle'); }
            const p1 = document.getElementById('pat1-s1');
            if (p1) { p1.style.opacity='1'; moveChar(p1, '10%', 3000); }
        }},
        { t: 5.5, fired: false, fn: () => {
            const p2 = document.getElementById('pat2-s1');
            if (p2) { p2.style.opacity='1'; moveChar(p2, '2%', 2800); }
            const r = document.getElementById('recep-s1');
            if (r) r.classList.add('anim-typing');
        }},
        { t: 6.5, fired: false, fn: () => {
            moveCamera('s1', -150, 20, 1.2, 4000);
            openDoor(document.getElementById('door-clinic-s1'));
            const doc = document.getElementById('doc-s1');
            if (doc) { moveChar(doc, '20%', 2000, true); }
        }},
        { t: 8.5, fired: false, fn: () => {
            closeDoor(document.getElementById('door-clinic-s1'));
            const doc = document.getElementById('doc-s1');
            if (doc) doc.style.opacity='0';
            darkenScene(document.getElementById('ov-s1'), 0.3);
            const r = document.getElementById('recep-s1');
            if (r) r.classList.remove('anim-typing');
        }},
    ],
    // SCENE 2
    [
        { t: 0.2, fired: false, fn: () => {
            const r = document.getElementById('recep-s2');
            if (r) { r.style.opacity='1'; r.classList.add('anim-idle'); }
        }},
        { t: 1.0, fired: false, fn: () => {
            const p = document.getElementById('pat-s2');
            if (p) { p.style.opacity='1'; moveChar(p, '4%', 3000); }
        }},
        { t: 3.5, fired: false, fn: () => {
            moveCamera('s2', 100, 0, 1.1, 2000);
            const r = document.getElementById('recep-s2');
            if (r) r.classList.add('anim-typing');
            const c = document.getElementById('comp-s2');
            if (c) c.classList.add('sc-active');
        }},
        { t: 5.5, fired: false, fn: () => {
            moveCamera('s2', -50, 0, 0.9, 3000);
            ['dn-doc','dn-nur','dn-bil'].forEach((id,i)=> setTimeout(()=> popIn(document.getElementById(id)), i*300));
        }},
        { t: 7.0, fired: false, fn: () => flyCard(document.getElementById('fc-name'), 400, -250, 1500) },
        { t: 7.8, fired: false, fn: () => flyCard(document.getElementById('fc-mob'), 400, 0, 1500) },
        { t: 8.6, fired: false, fn: () => flyCard(document.getElementById('fc-iss'), 150, -150, 1500) },
        { t: 9.5, fired: false, fn: () => {
            const p = document.getElementById('pat-s2');
            if (p) doAction(p, 'anim-looking', 3000);
            darkenScene(document.getElementById('ov-s2'), 0.1);
        }}
    ],
    // SCENE 3
    [
        { t: 0.2, fired: false, fn: () => {
            const d = document.getElementById('doc-s3');
            const r = document.getElementById('recep-s3');
            if (d) { d.style.opacity='1'; d.classList.add('anim-idle'); }
            if (r) { r.style.opacity='1'; r.classList.add('anim-typing'); }
        }},
        { t: 1.0, fired: false, fn: () => moveCamera('s3', -100, 0, 1.2, 2000) },
        { t: 2.0, fired: false, fn: () => {
            const d = document.getElementById('doc-s3');
            if (d) { d.classList.remove('anim-idle'); d.classList.add('anim-looking'); }
        }},
        { t: 3.5, fired: false, fn: () => showBubble(document.getElementById('qb-file')) },
        { t: 5.0, fired: false, fn: () => showBubble(document.getElementById('qb-treat')) },
        { t: 6.0, fired: false, fn: () => {
            moveCamera('s3', 50, 0, 1.1, 2000);
            showBubble(document.getElementById('qb-allergy'));
        }},
        { t: 7.5, fired: false, fn: () => fadeIn(document.getElementById('clock-s3')) },
        { t: 8.5, fired: false, fn: () => {
            moveCamera('s3', 0, 0, 1, 2000);
            const d = document.getElementById('doc-s3');
            if (d) { d.classList.remove('anim-looking'); d.classList.add('anim-talking'); doAction(d, 'action-shake trigger-shake', 1000); }
        }}
    ],
    // SCENE 4
    [
        { t: 0.2, fired: false, fn: () => {
            const d = document.getElementById('doc-s4');
            const n = document.getElementById('nurse-s4');
            if (d) { d.style.opacity='1'; d.classList.add('anim-idle'); }
            if (n) { n.style.opacity='1'; n.classList.add('anim-idle'); }
        }},
        { t: 1.5, fired: false, fn: () => {
            const amb = document.getElementById('amb-s4');
            if (amb) { amb.style.opacity='1'; amb.style.transition='left 2s ease'; amb.style.left='0%'; }
            moveCamera('s4', 100, 0, 1.1, 2000);
        }},
        { t: 3.0, fired: false, fn: () => {
            const pat = document.getElementById('emg-s4');
            if (pat) { pat.style.opacity='1'; moveChar(pat, '20%', 1500); }
            const d = document.getElementById('doc-s4');
            if (d) { doAction(d, 'anim-waving', 1000); }
        }},
        { t: 4.0, fired: false, fn: () => showBubble(document.getElementById('qb-bed')) },
        { t: 4.5, fired: false, fn: () => {
            const n = document.getElementById('nurse-s4');
            if (n) moveChar(n, '75%', 2000);
            moveCamera('s4', -100, 0, 1.1, 2000);
            setTimeout(() => popIn(document.getElementById('bed-s4')), 1000);
        }},
        { t: 6.5, fired: false, fn: () => {
            fadeIn(document.getElementById('timer-s4'));
            const n = document.getElementById('nurse-s4');
            if (n) n.classList.add('anim-looking');
        }},
        { t: 7.5, fired: false, fn: () => {
            const n = document.getElementById('nurse-s4');
            if (n) { n.classList.remove('anim-looking'); moveChar(n, '40%', 1800, true); }
            moveCamera('s4', 0, 0, 1, 2000);
        }}
    ],
    // SCENE 5
    [
        { t: 0.2, fired: false, fn: () => {
            const n = document.getElementById('nurse-s5');
            if (n) { n.style.opacity='1'; n.classList.add('anim-idle'); }
            moveCamera('s5', 0, 20, 1.2, 2000);
        }},
        { t: 2.0, fired: false, fn: () => {
            const n = document.getElementById('nurse-s5');
            if (n) n.classList.add('anim-talking');
        }},
        { t: 3.0, fired: false, fn: () => fadeIn(document.getElementById('vt-bp')) },
        { t: 4.5, fired: false, fn: () => fadeIn(document.getElementById('vt-tmp')) },
        { t: 5.5, fired: false, fn: () => fadeIn(document.getElementById('vt-spo')) },
        { t: 6.5, fired: false, fn: () => fadeIn(document.getElementById('vt-med')) },
        { t: 7.5, fired: false, fn: () => {
            moveCamera('s5', -50, 0, 1, 2000);
            const ps = document.getElementById('pstack-s5');
            if (ps) ps.classList.add('papers-grow');
        }},
        { t: 8.5, fired: false, fn: () => showBubble(document.getElementById('qb-kal')) },
        { t: 9.5, fired: false, fn: () => {
            const n = document.getElementById('nurse-s5');
            if (n) { n.classList.remove('anim-talking'); n.classList.add('anim-looking'); doAction(n, 'action-shake trigger-shake', 1000); }
        }}
    ],
    // SCENE 6
    [
        { t: 0.2, fired: false, fn: () => {
            const p = document.getElementById('pat-s6');
            const b = document.getElementById('bil-staff-s6');
            if (p) { p.style.opacity='1'; p.classList.add('anim-sitting'); }
            if (b) { b.style.opacity='1'; b.classList.add('anim-idle'); }
        }},
        { t: 1.5, fired: false, fn: () => {
            moveCamera('s6', -80, 0, 1.1, 2000);
            const b = document.getElementById('bil-staff-s6');
            if (b) b.classList.add('anim-typing');
        }},
        { t: 3.0, fired: false, fn: () => flyCard(document.getElementById('bc-1'), 400, 0, 1000) },
        { t: 4.0, fired: false, fn: () => flyCard(document.getElementById('bc-2'), 400, 0, 1000) },
        { t: 5.0, fired: false, fn: () => flyCard(document.getElementById('bc-3'), 400, 0, 1000) },
        { t: 6.0, fired: false, fn: () => {
            fadeIn(document.getElementById('calc-s6'));
            const c = document.getElementById('calc-s6');
            if (c) doAction(c, 'anim-pulse', 3000);
        }},
        { t: 7.5, fired: false, fn: () => {
            moveCamera('s6', 50, 0, 1.1, 2000);
            fadeIn(document.getElementById('hglass-s6'));
        }}
    ],
    // SCENE 7
    [
        { t: 0.2, fired: false, fn: () => moveCamera('s7', 0, 0, 0.9, 2000) },
        { t: 1.5, fired: false, fn: () => popIn(document.getElementById('orb-s7')) },
        { t: 3.0, fired: false, fn: () => {
            ['doc-s7','nurse-s7','admin-s7','recep-s7'].forEach((id,i)=>
                setTimeout(()=>{ const el=document.getElementById(id); if(el){el.style.opacity='1'; el.classList.add('anim-idle');} }, i*300));
        }},
        { t: 5.0, fired: false, fn: () => { popIn(document.getElementById('ac-d1')); setTimeout(()=>popIn(document.getElementById('ac-d2')),300); }},
        { t: 7.0, fired: false, fn: () => { popIn(document.getElementById('ac-n1')); setTimeout(()=>popIn(document.getElementById('ac-n2')),300); }},
        { t: 8.5, fired: false, fn: () => popIn(document.getElementById('ac-a1')) },
        { t: 9.5, fired: false, fn: () => popIn(document.getElementById('ac-r1')) },
        { t: 10.5, fired: false, fn: () => showBubble(document.getElementById('qb-why')) }
    ],
    // SCENE 8
    [
        { t: 0.2, fired: false, fn: () => {
            const d = document.getElementById('doc-s8');
            const n = document.getElementById('nurse-s8');
            if (d) { d.style.opacity='1'; d.classList.add('anim-idle'); }
            if (n) { n.style.opacity='1'; n.classList.add('anim-idle'); }
        }},
        { t: 1.5, fired: false, fn: () => moveCamera('s8', 80, 0, 1.1, 2000) },
        { t: 3.0, fired: false, fn: () => {
            const d = document.getElementById('doc-s8');
            if (d) d.classList.add('anim-talking');
            fadeIn(document.getElementById('fc-instr'));
        }},
        { t: 4.5, fired: false, fn: () => {
            moveCamera('s8', 0, 0, 1.1, 2000);
            fadeIn(document.getElementById('msg-s8'));
        }},
        { t: 5.5, fired: false, fn: () => {
            const mb = document.getElementById('mb-s8');
            if (mb) { mb.style.opacity='1'; doAction(mb, 'action-shake trigger-shake', 1000); }
            fadeIn(document.getElementById('timer-s8'));
        }},
        { t: 7.5, fired: false, fn: () => {
            moveCamera('s8', -80, 0, 1.1, 2000);
            showBubble(document.getElementById('qb-late'));
        }}
    ],
    // SCENE 9
    [
        { t: 0.2, fired: false, fn: () => {
            const a = document.getElementById('admin-s9');
            if (a) { a.style.opacity='1'; a.classList.add('anim-walking'); moveChar(a, '5%', 2500); }
        }},
        { t: 2.0, fired: false, fn: () => {
            const a = document.getElementById('admin-s9');
            if (a) { a.classList.add('anim-typing'); }
            const dash = document.getElementById('dash-s9');
            if (dash) { dash.style.transition='all 0.8s cubic-bezier(0.34,1.56,0.64,1)'; dash.style.opacity='1'; dash.style.transform='scale(1)'; }
            moveCamera('s9', -100, 0, 1.1, 2500);
        }},
        { t: 4.5, fired: false, fn: () => {
            const l = document.getElementById('loader-s9');
            if (l) l.style.display = 'none';
        }},
        { t: 5.0, fired: false, fn: () => {
            document.getElementById('dash-s9').style.borderColor = 'red';
            doAction(document.getElementById('dash-s9'), 'action-shake trigger-shake', 1000);
        }}
    ],
    // SCENE 10 (Summary of problems)
    [
        { t: 0.2, fired: false, fn: () => moveCamera('s10', 0, 0, 0.85, 2000) },
        { t: 1.0, fired: false, fn: () => {
            ['d10-pat','d10-doc','d10-bed','d10-file'].forEach((id,i) => setTimeout(() => popIn(document.getElementById(id)), i*200));
        }},
        { t: 3.0, fired: false, fn: () => {
            // Draw red broken lines between nodes
            const svg = document.getElementById('lines-s10');
            if(svg) {
                const colors = ['#ef4444','#ef4444','#ef4444','#ef4444'];
                ['d10-pat','d10-doc','d10-bed','d10-file'].forEach((id,i) => {
                    const el = document.getElementById(id);
                    if(el) {
                        const line = document.createElementNS('http://www.w3.org/2000/svg','line');
                        let targetX, targetY;
                        if(i===0) { targetX='20%'; targetY='20%'; }
                        if(i===1) { targetX='40%'; targetY='80%'; }
                        if(i===2) { targetX='60%'; targetY='20%'; }
                        if(i===3) { targetX='80%'; targetY='80%'; }
                        line.setAttribute('x1','50%'); line.setAttribute('y1','50%');
                        line.setAttribute('x2', targetX); line.setAttribute('y2', targetY);
                        line.setAttribute('stroke',colors[i]); line.setAttribute('stroke-width','3');
                        line.setAttribute('stroke-dasharray','10,10');
                        line.style.opacity='0.5';
                        svg.appendChild(line);
                    }
                });
            }
            fadeIn(document.getElementById('fc10-1'), 500);
            fadeIn(document.getElementById('fc10-2'), 500);
        }},
        { t: 5.0, fired: false, fn: () => {
            const w = document.getElementById('prob-warn');
            if(w) { w.style.opacity='1'; doAction(w, 'action-shake trigger-shake', 2000); }
            moveCamera('s10', 0, 0, 0.75, 3000);
        }}
    ],
    // SCENE 11 (The Transformation - Epic Length)
    [
        { t: 0.2, fired: false, fn: () => moveCamera('s11', 0, 0, 1.1, 1000) }, 
        { t: 1.0, fired: false, fn: () => {
            // Show chaotic papers and make them shake
            for(let i=1; i<=8; i++) {
                const el = document.getElementById('c-'+i);
                if(el) {
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transition = 'all 0.5s cubic-bezier(0.34,1.56,0.64,1)';
                        el.style.transform = 'scale(1.2)';
                        setTimeout(() => el.style.transform = 'scale(1)', 200);
                        if (typeof playPopSound === 'function') playPopSound();
                        doAction(el, 'action-shake trigger-shake', 5000);
                    }, i * 400); // 400ms delay between each to sync with voice listing them
                }
            }
        }},
        { t: 4.5, fired: false, fn: () => {
            // "एक ऐसी जगह जहाँ patient की information बिखरी हुई ना हो।"
            // HMS HUB Appears like a black hole
            const hub = document.getElementById('hms-hub-s11');
            if(hub) {
                hub.style.transition = 'all 1.5s cubic-bezier(0.34,1.56,0.64,1)';
                hub.style.opacity = '1';
                hub.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        }},
        { t: 6.0, fired: false, fn: () => {
            // Suck all papers into the hub
            for(let i=1; i<=8; i++) {
                const el = document.getElementById('c-'+i);
                if(el) {
                    el.style.transition = 'all 1.0s cubic-bezier(0.34,1.56,0.64,1)';
                    el.style.top = '50%';
                    el.style.left = '50%';
                    el.style.transform = 'translate(-50%, -50%) scale(0) rotate(360deg)';
                    el.style.opacity = '0';
                }
            }
        }},
        { t: 8.0, fired: false, fn: () => {
            // "जहाँ bed की स्थिति तुरंत पता चले।"
            if (typeof playPopSound === 'function') playPopSound();
            const el = document.getElementById('s11-n2'); // Beds
            if(el) {
                el.style.transition = 'all 1.5s cubic-bezier(0.34,1.56,0.64,1)';
                el.style.opacity = '1';
                el.style.top = '85%'; el.style.left = '25%';
                el.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        }},
        { t: 10.0, fired: false, fn: () => {
            // "जहाँ doctor और nurse अपना clinical record आसानी से maintain कर सकें।"
            if (typeof playPopSound === 'function') playPopSound();
            const el1 = document.getElementById('s11-n3'); // Staff
            const el2 = document.getElementById('s11-n1'); // Records
            if(el1) {
                el1.style.transition = 'all 1.5s cubic-bezier(0.34,1.56,0.64,1)';
                el1.style.opacity = '1';
                el1.style.top = '15%'; el1.style.left = '75%';
                el1.style.transform = 'translate(-50%, -50%) scale(1)';
            }
            if(el2) {
                setTimeout(() => {
                    if (typeof playPopSound === 'function') playPopSound();
                    el2.style.transition = 'all 1.5s cubic-bezier(0.34,1.56,0.64,1)';
                    el2.style.opacity = '1';
                    el2.style.top = '15%'; el2.style.left = '15%';
                    el2.style.transform = 'translate(-50%, -50%) scale(1)';
                }, 400);
            }
        }},
        { t: 13.0, fired: false, fn: () => {
            // "जहाँ billing automatically organized हो।"
            if (typeof playPopSound === 'function') playPopSound();
            const el = document.getElementById('s11-n4'); // Billing
            if(el) {
                el.style.transition = 'all 1.5s cubic-bezier(0.34,1.56,0.64,1)';
                el.style.opacity = '1';
                el.style.top = '85%'; el.style.left = '85%';
                el.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        }},
        { t: 15.0, fired: false, fn: () => {
            // "जहाँ हर व्यक्ति को सिर्फ वही information मिले जिसकी उसे जरूरत है।"
            // Draw glowing data streams connecting nodes to hub
            const svg = document.getElementById('lines-s11');
            if(svg) {
                const colors = ['#60a5fa','#34d399','#fbbf24','#f472b6'];
                ['s11-n1','s11-n2','s11-n3','s11-n4'].forEach((id,i) => {
                    const el = document.getElementById(id);
                    if(el) {
                        const line = document.createElementNS('http://www.w3.org/2000/svg','line');
                        let targetX, targetY;
                        if(i===0) { targetX='15%'; targetY='15%'; }
                        if(i===1) { targetX='25%'; targetY='85%'; }
                        if(i===2) { targetX='75%'; targetY='15%'; }
                        if(i===3) { targetX='85%'; targetY='85%'; }
                        
                        line.setAttribute('x1','50%'); line.setAttribute('y1','50%');
                        line.setAttribute('x2', targetX); line.setAttribute('y2', targetY);
                        line.setAttribute('stroke',colors[i]); line.setAttribute('stroke-width','4');
                        line.style.strokeDasharray = '1000';
                        line.style.strokeDashoffset = '1000';
                        line.style.animation = 'dashDraw 1.5s ease-out forwards';
                        line.style.filter = `drop-shadow(0 0 8px ${colors[i]})`;
                        svg.appendChild(line);
                    }
                });
            }
        }},
        { t: 19.0, fired: false, fn: () => {
            // "और जहाँ hospital management पूरे hospital को एक नजर में समझ सके।"
            // Hub pulses immensely
            const hub = document.getElementById('hms-hub-s11');
            if(hub) {
                hub.style.transform = 'translate(-50%, -50%) scale(1.3)';
                hub.style.boxShadow = '0 0 150px rgba(139,92,246,1), inset 0 0 60px rgba(255,255,255,1)';
            }
        }},
        { t: 23.5, fired: false, fn: () => {
            // Final transition OUT
            const hub = document.getElementById('hms-hub-s11');
            if(hub) {
                hub.style.transition = 'all 1.0s ease-in';
                hub.style.transform = 'translate(-50%, -50%) scale(1.5)';
                hub.style.opacity = '0';
            }
            const nodes = ['s11-n1','s11-n2','s11-n3','s11-n4'];
            nodes.forEach(id => {
                const el = document.getElementById(id);
                if(el) {
                    el.style.transition = 'all 1.0s ease-in';
                    el.style.opacity = '0';
                }
            });
            const lines = document.getElementById('lines-s11');
            if (lines) {
                lines.style.opacity = '0';
                lines.style.transition = 'opacity 1s ease';
            }
            moveCamera('s11', 0, 0, 0.95, 3000); 
            
            // flash white
            const ov = document.getElementById('ov-s11');
            if(ov) {
                ov.style.background = 'white';
                ov.style.opacity = '1';
                setTimeout(() => ov.style.opacity='0', 800);
            }
        }}
    ],
    // SCENE 12 (Pipeline Digital Journey - SLOWED DOWN)
    [
        { t: 0.2, fired: false, fn: () => moveCamera('s12', 0, 0, 1.0, 10) }, 
        { t: 4.0, fired: false, fn: () => {
            const p = document.getElementById('p12');
            const r = document.getElementById('r12');
            if (p) { p.style.opacity='1'; moveChar(p, '5%', 2000); }
            if (r) { r.style.opacity='1'; r.classList.add('anim-typing'); }
        }},
        { t: 7.0, fired: false, fn: () => popIn(document.getElementById('prof12')) }, 
        { t: 12.0, fired: false, fn: () => {
            popIn(document.getElementById('bed-map12'));
            setTimeout(() => {
                const avail = document.getElementById('b12-avail');
                if(avail) avail.style.background = '#10b981'; 
                fadeIn(document.getElementById('b12-text'));
            }, 800);
        }},
        { t: 16.0, fired: false, fn: () => {
            const d = document.getElementById('d12');
            if(d) { d.style.opacity='1'; d.classList.add('anim-idle'); }
            setTimeout(() => popIn(document.getElementById('hist12')), 500);
        }},
        { t: 20.0, fired: false, fn: () => {
            const n = document.getElementById('n12');
            if(n) { n.style.opacity='1'; n.classList.add('anim-typing'); }
            popIn(document.getElementById('vit12'));
            setTimeout(() => fadeIn(document.getElementById('v12-bp')), 500);
            setTimeout(() => fadeIn(document.getElementById('v12-t')), 1000);
        }},
        { t: 25.0, fired: false, fn: () => {
            popIn(document.getElementById('bill12'));
            setTimeout(() => { fadeIn(document.getElementById('v12-c1')); document.getElementById('v12-sub').textContent='₹500'; }, 500);
            setTimeout(() => { fadeIn(document.getElementById('v12-c2')); document.getElementById('v12-sub').textContent='₹700'; }, 1000);
            setTimeout(() => { fadeIn(document.getElementById('v12-c3')); document.getElementById('v12-sub').textContent='₹1,000'; }, 1500);
            setTimeout(() => { fadeIn(document.getElementById('v12-billdone')); }, 2000);
        }},
        { t: 29.0, fired: false, fn: () => {
            const bell = document.getElementById('bell12');
            if(bell) { fadeIn(bell); doAction(bell, 'anim-pulse', 2000); setTimeout(()=>bell.style.opacity='0', 2000); }
        }}
    ],
    // SCENE 13 (RBAC - SLOWED DOWN)
    [
        { t: 0.2, fired: false, fn: () => moveCamera('s13', 0, 0, 1.0, 1000) },
        { t: 2.0, fired: false, fn: () => {
            ['p13-a','p13-d','p13-n','p13-r'].forEach((id,i) => setTimeout(() => popIn(document.getElementById(id)), i*200));
        }},
        { t: 6.0, fired: false, fn: () => popIn(document.getElementById('dash-admin')) },
        { t: 10.0, fired: false, fn: () => popIn(document.getElementById('dash-doc')) },
        { t: 13.0, fired: false, fn: () => popIn(document.getElementById('dash-nurse')) },
        { t: 17.0, fired: false, fn: () => popIn(document.getElementById('dash-recep')) },
        { t: 19.0, fired: false, fn: () => {
            popIn(document.getElementById('lock-doc'));
            doAction(document.getElementById('lock-doc'), 'action-shake trigger-shake', 1000);
        }}
    ],
    // SCENE 14 (Finale - SLOWED DOWN)
    [
        { t: 0.2, fired: false, fn: () => moveCamera('s14', 0, 0, 1.0, 1000) },
        // Before
        { t: 2.0, fired: false, fn: () => {
            fadeIn(document.getElementById('final-before'));
            const d = document.getElementById('fdoc');
            if(d) { d.style.opacity='1'; d.classList.add('anim-looking'); }
            fadeIn(document.getElementById('ffile'));
        }},
        // Transition
        { t: 6.0, fired: false, fn: () => {
            document.getElementById('final-before').style.opacity='0';
            document.getElementById('fdoc').style.opacity='0';
            document.getElementById('ffile').style.opacity='0';
            
            fadeIn(document.getElementById('final-after'));
            const d2 = document.getElementById('fdoc2');
            if(d2) { d2.style.opacity='1'; d2.classList.add('anim-idle'); }
            fadeIn(document.getElementById('fdig'));
        }},
        // Dashboard
        { t: 12.0, fired: false, fn: () => {
            document.getElementById('final-after').style.opacity='0';
            document.getElementById('fdoc2').style.opacity='0';
            document.getElementById('fdig').style.opacity='0';
            
            popIn(document.getElementById('live-dash'));
        }},
        // Final zoom out & brand
        { t: 19.0, fired: false, fn: () => {
            const dash = document.getElementById('live-dash');
            if(dash) {
                dash.style.transition = 'all 2s ease';
                dash.style.transform = 'scale(0.4) translateY(-120%)';
                dash.style.opacity = '0.3';
            }
            setTimeout(() => {
                popIn(document.getElementById('final-brand'));
                if (typeof shootConfetti === 'function') shootConfetti();
            }, 1000);
        }}
    ]
];

const SceneController = {
    buildStage(sceneIdx) {
        const html = SCENE_STAGES[sceneIdx];
        if (!html) return;
        const sceneEl = document.querySelectorAll('.sc')[sceneIdx];
        if (!sceneEl) return;
        const stage = sceneEl.querySelector('.css-scene');
        if (stage) {
            stage.innerHTML = html;
            if (typeof upgradeCharacters === 'function') upgradeCharacters(stage);
        }
    },
    tick(sceneIdx, currentTime) {
        const tl = SCENE_TIMELINES[sceneIdx];
        if (!tl) return;
        tl.forEach(trigger => {
            if (!trigger.fired && currentTime >= trigger.t) {
                trigger.fired = true;
                try { trigger.fn(); } catch (e) { console.warn('[SC]', e); }
            }
        });
    },
    reset(sceneIdx) {
        const tl = SCENE_TIMELINES[sceneIdx];
        if (tl) tl.forEach(t => { t.fired = false; });
    },
};

window.SceneController = SceneController;
window.moveChar        = moveChar;
window.openDoor        = openDoor;
window.closeDoor       = closeDoor;
window.popIn           = popIn;
window.showBubble      = showBubble;
window.countUp         = countUp;
window.flyCard         = flyCard;
window.darkenScene     = darkenScene;
window.fadeIn          = fadeIn;
window.doAction        = doAction;
window.moveCamera      = moveCamera;
