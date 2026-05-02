(() => {

// ─── UTILS ──────────────────────────────────────────────────────────────────

// waitForElement: waits for a CSS selector inside the gameframe (or document)
var B = (selector, inFrame = true) => new Promise((resolve, reject) => {
  let frame = document.getElementsByClassName("gameframe")[0];
  if (!frame?.contentDocument) { reject(new Error("Gameframe not found")); return; }
  let target = inFrame ? frame.contentDocument.querySelector(selector) : document.querySelector(selector);
  if (target) { resolve(target); return; }
  let obs = new MutationObserver(mutations => {
    for (let m of mutations)
      for (let node of Array.from(m.addedNodes))
        if (node instanceof Element && node.matches(selector)) { resolve(node); obs.disconnect(); return; }
  });
  obs.observe(frame.contentDocument, { childList: true, subtree: true });
});

// clearRightbar: removes the default right sidebar content
var K = async () => {
  let rb = await B("body > div > div.rightbar", false);
  document.getElementsByClassName("rightbar")[0].innerHTML = "";
};

// ─── F2 JOIN ROOM MODAL ─────────────────────────────────────────────────────

function openJoinRoomPanel() {
  // Toggle: if already open, close it
  const existing = document.getElementById('hxs-f2-panel');
  if (existing) { existing.remove(); return; }

  const overlay = document.createElement("div");
  overlay.id = "hxs-f2-panel";
  Object.assign(overlay.style, {
    position: "fixed", top: "0", left: "0", width: "100%", height: "100%",
    background: "rgba(0, 0, 0, 0.5)", zIndex: "99999",
    display: "flex", justifyContent: "center", alignItems: "center",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    opacity: "0", transition: "opacity 0.2s ease"
  });

  overlay.addEventListener("mousedown", (e) => { if (e.target === overlay) closePanel(); });

  const modal = document.createElement("div");
  Object.assign(modal.style, {
    background: "rgba(28, 28, 30, 0.98)", border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "14px", padding: "24px", width: "380px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)", color: "#fff",
    transform: "scale(0.95)", transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    boxSizing: "border-box"
  });

  const title = document.createElement("h2");
  title.textContent = "Join Room";
  Object.assign(title.style, {
    margin: "0 0 16px 0", fontSize: "20px", fontWeight: "600",
    textAlign: "center", letterSpacing: "0.4px"
  });

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Paste the room link or 11-char code";
  Object.assign(input.style, {
    width: "100%", padding: "12px 14px", fontSize: "15px",
    border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "8px",
    background: "rgba(255, 255, 255, 0.05)", color: "#fff", outline: "none",
    boxSizing: "border-box", marginBottom: "16px",
    transition: "border-color 0.2s, background 0.2s"
  });
  input.addEventListener("focus", () => { input.style.borderColor = "#0a84ff"; input.style.background = "rgba(255, 255, 255, 0.08)"; });
  input.addEventListener("blur", () => { input.style.borderColor = "rgba(255, 255, 255, 0.15)"; input.style.background = "rgba(255, 255, 255, 0.05)"; });

  const joinBtn = document.createElement("button");
  joinBtn.textContent = "Connect";
  joinBtn.disabled = true;
  Object.assign(joinBtn.style, {
    width: "100%", padding: "12px", fontSize: "15px", fontWeight: "600",
    border: "none", borderRadius: "8px", background: "#0a84ff", color: "#fff",
    cursor: "not-allowed", opacity: "0.5", transition: "opacity 0.2s"
  });
  joinBtn.addEventListener("mousedown", () => { if (!joinBtn.disabled) joinBtn.style.transform = "scale(0.98)"; });
  joinBtn.addEventListener("mouseup", () => { joinBtn.style.transform = "scale(1)"; });
  joinBtn.addEventListener("mouseleave", () => { joinBtn.style.transform = "scale(1)"; });

  const validate = (val) => {
    const linkPattern = /^https:\/\/(www\.)?hqxball\.com\/play\?c=[A-Za-z0-9_-]+$/i;
    const codePattern = /^[A-Za-z0-9_-]{4,20}$/;
    return linkPattern.test(val) || codePattern.test(val);
  };

  const closePanel = () => {
    overlay.style.opacity = "0"; modal.style.transform = "scale(0.95)";
    setTimeout(() => overlay.remove(), 200);
  };

  const doJoin = () => {
    if (joinBtn.disabled) return;
    const val = input.value.trim();
    if (validate(val)) {
      const isCode = /^[A-Za-z0-9_-]{4,20}$/.test(val);
      const finalUrl = isCode ? `https://www.hqxball.com/play?c=${val}` : val;
      closePanel();
      window.location.href = finalUrl;
    }
  };

  joinBtn.addEventListener("click", doJoin);

  input.addEventListener("input", () => {
    const val = input.value.trim();
    if (validate(val)) {
      joinBtn.disabled = false; joinBtn.style.opacity = "1"; joinBtn.style.cursor = "pointer";
    } else {
      joinBtn.disabled = true; joinBtn.style.opacity = "0.5"; joinBtn.style.cursor = "not-allowed";
    }
  });

  input.addEventListener("keydown", ev => {
    if (ev.key === "Enter") { ev.preventDefault(); doJoin(); }
    if (ev.key === "Escape") { ev.preventDefault(); closePanel(); }
  });

  modal.appendChild(title);
  modal.appendChild(input);
  modal.appendChild(joinBtn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
    modal.style.transform = "scale(1)";
    input.focus();
  });
}

// F2 global shortcut
document.addEventListener('keydown', (e) => {
  if (e.key === 'F2' || e.code === 'F2') {
    e.preventDefault();
    openJoinRoomPanel();
  }
});

// ─── F2 HINT TOOLTIP (shown once on main menu) ──────────────────────────────

(function() {
  const HINT_KEY = 'hxs_f2_hint_shown';
  if (localStorage.getItem(HINT_KEY)) return;
  const hint = document.createElement('div');
  hint.id = 'hxs-f2-hint';
  Object.assign(hint.style, {
    position: 'fixed', bottom: '24px', right: '24px', zIndex: '99998',
    background: 'rgba(20,20,25,0.92)', border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px', padding: '12px 18px', color: '#fff',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: '14px', lineHeight: '1.5', boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
    opacity: '0', transform: 'translateY(12px)',
    transition: 'opacity 0.4s ease, transform 0.4s ease',
    pointerEvents: 'none', maxWidth: '260px',
  });
  hint.innerHTML = '<div style="font-weight:600;margin-bottom:4px;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Join a Room</div>' +
    'Press <kbd style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25);border-radius:5px;padding:2px 8px;font-family:monospace;font-weight:700;">F2</kbd> to join by link or room code';
  document.body.appendChild(hint);

  const isInGame = () => {
    try {
      const doc = document.getElementsByClassName('gameframe')[0]?.contentDocument;
      return doc ? (doc.body?.classList?.contains('showing-room-view') || !!doc.querySelector('.room-view')) : false;
    } catch(_) { return false; }
  };

  setTimeout(() => {
    if (isInGame()) { hint.remove(); return; }
    requestAnimationFrame(() => { hint.style.opacity = '1'; hint.style.transform = 'translateY(0)'; });
    setTimeout(() => {
      hint.style.opacity = '0'; hint.style.transform = 'translateY(12px)';
      setTimeout(() => hint.remove(), 400);
      localStorage.setItem(HINT_KEY, '1');
    }, 6000);
  }, 1800);
})();

// ─── HEADER TOGGLE ──────────────────────────────────────────────────────────

var D;

// ─── PROFILE + AUTH SYSTEM ──────────────────────────────────────────────────

// Load auth key from saved profile into the game's auth input
var ee = async () => {
  let frame = document.getElementsByClassName("gameframe")[0];
  let prefs = await window.electronAPI.getAppPreferences();
  let profiles = prefs.profiles;
  let currentId = localStorage.getItem("current_profile") || "default";
  let profile = profiles.find(p => p.id === currentId) || profiles.find(p => p.id === "default");
  if (!profile || !profile.player_auth_key) return;
  try {
    let input = frame?.contentDocument?.querySelector('[data-hook="input"]');
    if (input) {
      if (!input.value) input.value = profile.player_auth_key;
    }
  } catch(_) {}
};

// Save current auth key to the active profile
var q = async () => {
  let frame = document.getElementsByClassName("gameframe")[0];
  let prefs = await window.electronAPI.getAppPreferences();
  let currentId = localStorage.getItem("current_profile") || "default";
  let profile = prefs.profiles.find(p => p.id === currentId) || prefs.profiles.find(p => p.id === "default");
  if (!profile) return;
  try {
    let input = frame?.contentDocument?.querySelector('[data-hook="input"]');
    if (input?.value) {
      profile.player_auth_key = input.value;
      await window.electronAPI.setAppPreferences(prefs);
    }
  } catch(_) {}
};

// Load profile: set player name, geo, extrapolation, auth key
var M = (profileId) => {
  window.electronAPI.getAppPreferences().then(prefs => {
    let profile = prefs.profiles.find(p => p.id === profileId) || prefs.profiles.find(p => p.id === "default");
    if (!profile) return;
    if (profile.player_name) localStorage.setItem("player_name", profile.player_name);
    if (profile.extrapolation) localStorage.setItem("extrapolation", profile.extrapolation);
    if (profile.geo_override) localStorage.setItem("geo_override", JSON.stringify(profile.geo_override));
    if (profile.player_auth_key) {
      try {
        let frame = document.getElementsByClassName("gameframe")[0];
        let input = frame?.contentDocument?.querySelector('[data-hook="input"]');
        if (input) input.value = profile.player_auth_key;
      } catch(_) {}
    }
  }).catch(() => {});
};

// ─── DISCORD RPC ─────────────────────────────────────────────────────────────

const HXS_RPC_KEY = 'hxs_last_room_name';
function hxsDoc() { try { return document.getElementsByClassName('gameframe')[0]?.contentDocument || null; } catch(_) { return null; } }
function hxsSetRpc(msg) { try { window.electronAPI.updateDiscordRPC(msg); } catch(_) {} }
function hxsSetRoomName(name) { try { if (name) localStorage.setItem(HXS_RPC_KEY, name); } catch(_) {} }
function hxsGetRoomName() { try { return localStorage.getItem(HXS_RPC_KEY) || ''; } catch(_) { return ''; } }
function hxsClearRoomName() { try { localStorage.removeItem(HXS_RPC_KEY); } catch(_) {} }

// Watch roomlist selection to seed room name before joining
function hxsWatchRoomlistSelection() {
  try {
    const doc = hxsDoc(); if (!doc) return;
    const split = doc.getElementsByClassName('splitter')[0]; if (!split) return;
    if (!split.__hxs_listened) {
      split.addEventListener('click', () => {
        try {
          const sel = split.getElementsByClassName('selected')[0];
          const nm = (sel?.querySelector('[data-hook="name"], .name')?.textContent || '').trim();
          if (nm) hxsSetRoomName(nm);
        } catch(_) {}
      });
      split.__hxs_listened = true;
    }
  } catch(_) {}
}

// Watch room-view overlay to capture room name while in a room
function hxsWatchRoomOverlay() {
  try {
    const doc = hxsDoc(); if (!doc) return;
    if (doc.__hxs_overlay_observer) return;
    const grab = () => {
      try {
        const root = doc.querySelector('.room-view > .container') || doc.querySelector('.room-view') || doc;
        const nm = (root?.querySelector('[data-hook="name"], .title, .name, .room-name, h1, h2')?.textContent || '').trim();
        if (nm) { hxsSetRoomName(nm); hxsSetRpc(`${nm} odasında oynuyor`); }
      } catch(_) {}
    };
    const mo = new MutationObserver((muts) => {
      if ((doc.body?.className || '').includes('room-view') || doc.querySelector('.room-view')) grab();
      else for (const m of muts) { for (const n of (m.addedNodes || [])) { if (n?.className && String(n.className).includes('room-view')) { grab(); return; } } }
    });
    mo.observe(doc.body || doc.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
    doc.__hxs_overlay_observer = mo;
  } catch(_) {}
}

function hxsRpcPlayingNow() {
  const nm = hxsGetRoomName();
  hxsSetRpc(nm ? `${nm} odasında oynuyor` : 'Bir odada oynuyor');
}

// ─── VIEW STATE HANDLER ──────────────────────────────────────────────────────

var re = (viewClass) => {
  switch (true) {
    case viewClass === "dropdown":
      if (localStorage.getItem("header_visible") === "false") D?.();
      hxsSetRpc("Oda Listesinde Bekliyor");
      hxsClearRoomName();
      break;

    case ["game-view", "game-view showing-room-view chat-bg-full", "game-view showing-room-view"].includes(viewClass):
      if (localStorage.getItem("header_visible") === "true") D?.();
      hxsRpcPlayingNow();
      setTimeout(hxsRpcPlayingNow, 600);
      setTimeout(hxsRpcPlayingNow, 1500);
      hxsWatchRoomOverlay();
      break;

    case viewClass === "room-view":
      if (localStorage.getItem("header_visible") === "true") D?.();
      try { hxsWatchRoomOverlay(); } catch(_) {}
      break;

    case viewClass === "roomlist-view":
      try { hxsClearRoomName(); hxsWatchRoomlistSelection(); hxsSetRpc('Oda Listesinde Geziniyor'); } catch(_) {}
      break;
  }
};

// ─── PROFILE INITIALIZER + VIEW OBSERVER ────────────────────────────────────

var ne = async () => { await K(); await ee(); };

async function fe() {
  await ne();
  let prefs = await window.electronAPI.getAppPreferences();
  let profiles = prefs.profiles;
  let currentId = localStorage.getItem("current_profile") || "default";
  let profile = profiles.find(p => p.id === currentId) || profiles.find(p => p.id === "default");

  if (!sessionStorage.getItem("profileInitialized")) {
    console.log("Setting profile for the first time...");
    sessionStorage.setItem("profileInitialized", "true");
    if (profile?.autosave) {
      await q();
    } else {
      M(profile?.id || "default");
    }
    location.reload();
    return;
  }

  window.electronAPI.notifyReadyToShow();

  try {
    let n = await B("div[class$='view']");
    const parent = n.parentElement || n;
    const obs = new MutationObserver(ms => {
      try {
        for (const m of ms) {
          if (m.type === 'attributes' && m.attributeName === 'class') {
            const cn = String(m.target?.className || '');
            if (cn) { re(cn); return; }
          }
        }
        const added = ms.flatMap(r => Array.from(r.addedNodes || [])).filter(x => x && x.className);
        if (added.length === 1) { re(added[0].className); return; }
      } catch(_) {}
    });
    obs.observe(parent, { characterData: false, childList: true, attributes: true, subtree: true });
    try {
      const body = n.ownerDocument?.body;
      if (body) {
        new MutationObserver(ms => {
          for (const m of ms) {
            if (m.type === 'attributes' && m.attributeName === 'class') {
              try { re(body.className || ''); } catch(_) {}
            }
          }
        }).observe(body, { attributes: true, attributeFilter: ['class'] });
      }
    } catch(_) {}
    try { if (n?.className) re(n.className); } catch(_) {}

    console.log("HQXBALL client bridge ready.");

    // ── Header toggle (D) ──────────────────────────────────────────────────
    (function() {
      const ensureBtn = () => {
        let btn = document.getElementById("hxs-header-toggle");
        if (!btn) {
          btn = document.createElement("div");
          btn.id = "hxs-header-toggle";
          Object.assign(btn.style, {
            background: "rgba(26,33,37,0.063)",
            padding: "6px 10px",
            borderRadius: "6px",
            fontSize: "15px",
            color: "white",
            opacity: "0.85",
            cursor: "pointer",
            userSelect: "none",
            position: "fixed",
            left: "8px",
            zIndex: "9999"
          });
          btn.addEventListener("mouseenter", () => btn.style.opacity = "1");
          btn.addEventListener("mouseleave", () => btn.style.opacity = "0.85");
          btn.addEventListener("click", D);
          document.body.appendChild(btn);
        }
        return btn;
      };

      const setVisible = (vis) => {
        const hdr = document.querySelector('.header');
        if (!hdr) return;
        hdr.style.transition = "height 0.3s";
        hdr.style.overflow = "hidden";
        const btn = ensureBtn();
        if (vis) {
          localStorage.setItem("header_visible", "true");
          hdr.style.height = "35px";
          btn.innerHTML = '<i class="fa fa-arrow-circle-up" aria-hidden="true" style="margin-right:5px;"></i> Menüyü Gizle';
          btn.style.top = "42px";
        } else {
          localStorage.setItem("header_visible", "false");
          hdr.style.height = "0px";
          btn.innerHTML = '<i class="fa fa-arrow-circle-down" aria-hidden="true" style="margin-right:5px;"></i> Menüyü Göster';
          btn.style.top = "5px";
        }
      };

      D = () => {
        const hdr = document.querySelector('.header');
        if (!hdr) return;
        const visible = getComputedStyle(hdr).height !== '0px';
        setVisible(!visible);
      };

      setTimeout(() => {
        try {
          const hdr = document.querySelector('.header');
          if (!hdr) return;
          const visible = getComputedStyle(hdr).height !== '0px';
          const btn = ensureBtn();
          if (visible) {
            btn.innerHTML = '<i class="fa fa-arrow-circle-up" aria-hidden="true" style="margin-right:5px;"></i> Menüyü Gizle';
            btn.style.top = "42px";
          } else {
            btn.innerHTML = '<i class="fa fa-arrow-circle-down" aria-hidden="true" style="margin-right:5px;"></i> Menüyü Göster';
            btn.style.top = "5px";
          }
        } catch(_) {}
      }, 900);
    })();

    // ── Profile name in header ─────────────────────────────────────────────
    try {
      const header = document.querySelector(".header");
      if (header) {
        let n = header.querySelector(".right-container");
        if (!n) { n = document.createElement("div"); n.className = "right-container"; header.appendChild(n); }
        n.style.display = "flex";
        n.style.alignItems = "center";
        n.style.justifyContent = "flex-end";
        n.style.marginRight = "0";

        let s = localStorage.getItem("current_profile") || "default";
        let a = document.createElement("a");
        a.textContent = s;
        a.href = "#";
        a.style.marginRight = "15px";
        n.appendChild(a);
      }
    } catch(_) {}

  } catch(err) { console.error("Failed to initialize bridge:", err); }
}

fe();

})();
