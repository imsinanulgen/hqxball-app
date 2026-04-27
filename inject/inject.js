(()=>{
var B=(o,e=!0)=>new Promise((i,_)=>{let n=document.getElementsByClassName("gameframe")[0];
    if(!n?.contentDocument){_(new Error("Gameframe or contentDocument not found"));return}
let t=e?n.contentDocument.querySelector(o):document.querySelector(o);if(t){i(t);return}
let c=new MutationObserver(d=>{for(let r of d)for(let a of Array.from(r.addedNodes))if(a instanceof Element&&a.matches(o)){i(a),c.disconnect();return}});c.observe(n.contentDocument,{childList:!0,subtree:!0})});
var K=async()=>{let o=await B("body > div > div.rightbar",!1);document.getElementsByClassName("rightbar")[0].innerHTML=""};

          // === Palette utils: tek hex'ten tonlar üret ===
          function _hexToRgb(hex){hex=hex.replace('#','');if(hex.length===3)hex=hex.split('').map(x=>x+x).join('');const num=parseInt(hex,16);return {r:(num>>16)&255,g:(num>>8)&255,b:num&255};}
          function _rgbToHsl(r,g,b){r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b);let h,s,l=(max+min)/2;if(max===min){h=s=0;}else{const d=max-min;s=l>0.5?d/(2-max-min):d/(max+min);switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break;}h/=6;}return {h,s,l};}
          function _hslToHex(h,s,l){function f(n){const k=(n+h*12)%12,a=l-s*Math.min(l,1-l)*Math.max(-1,Math.min(k-3,9-k,1));return Math.round(255*a);}return '#'+[f(0),f(8),f(4)].map(x=>x.toString(16).padStart(2,'0')).join('');}
          function _shade(hex,{dl=0,ds=0}){const {r,g,b}=_hexToRgb(hex); let {h,s,l}=_rgbToHsl(r,g,b); s=Math.min(1,Math.max(0,s+ds)); l=Math.min(1,Math.max(0,l+dl)); return _hslToHex(h,s,l);}
          function _tintedSurfaces(base){
            // Baz rengin hue’sini kullanıp düşük satürasyonlu koyu gri tonlar üret
            const {r,g,b}=_hexToRgb(base); const {h}= _rgbToHsl(r,g,b);
            const mk=(sat,light)=>_hslToHex(h, sat, light);
            return {
              panelBg:  mk(0.18, 0.12),  // en koyu: ana panel (dialog/container)
              surface:  mk(0.18, 0.16),  // orta: kartlar
              surface2: mk(0.18, 0.20),  // biraz daha açık ara yüzeyler
            };
          }
          function _derivePalette(base){
            const hover=_shade(base,{dl:-0.08});
            const surf=_tintedSurfaces(base);
            return {
              primary: base,
              hover,
              panelBg:  surf.panelBg,
              surface:  surf.surface,
              surface2: surf.surface2,
              border:  "rgba(255,255,255,.12)",
              text:    "#ffffff",
              subtle:  "#94a3b8"
            };
          }

          function openJoinRoomPanel(){
            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = "Oda bağlantısını veya 11 haneli kodu girin";
            input.style.width = "calc(100% - 4px)";
            input.style.padding = "10px";
            input.style.fontSize = "15px";
            input.style.border = "1px solid var(--hxs-panel-border, #444)";
            input.style.borderRadius = "6px";
            input.style.background = "var(--hxs-surface, #1b2125)";
            input.style.color = "#fff";
            input.style.outline = "none";
            input.style.boxSizing = "border-box";

            const joinBtn = document.createElement("button");
            joinBtn.textContent = "Bağlan";
            joinBtn.className = "hxs-join";
            joinBtn.style.padding = "10px 30px";
            joinBtn.style.fontSize = "15px";
            joinBtn.style.alignSelf = "center";
            joinBtn.style.minWidth = "120px";
            joinBtn.disabled = true; // başlangıçta kapalı
            joinBtn.style.opacity = "0.6"; // gri görünüm
            joinBtn.style.cursor = "not-allowed";

            // Geçerli mi kontrol
            const validate = (val)=>{
              const linkPattern = /^https:\/\/www\.(haxball|hqxball)\.com\/play\?c=.{11}$/;
              const codePattern = /^[A-Za-z0-9_-]{11}$/;
              return linkPattern.test(val) || codePattern.test(val);
            };

            const doJoin = ()=>{
              const val = input.value.trim();
              if (validate(val)){
                // eğer sadece kod girdiyse linke dönüştür
                const finalUrl = val.length === 11 ? `https://www.hqxball.com/play?c=${val}` : val;
                window.location.href = finalUrl;
              }
            };

            joinBtn.addEventListener("click", doJoin);

            input.addEventListener("input", ()=>{
              const val = input.value.trim();
              if(validate(val)){
                joinBtn.disabled = false;
                joinBtn.style.opacity = "1";
                joinBtn.style.cursor = "pointer";
              } else {
                joinBtn.disabled = true;
                joinBtn.style.opacity = "0.6";
                joinBtn.style.cursor = "not-allowed";
              }
            });

            input.addEventListener("keydown", ev=>{
              if(ev.key==="Enter" && !joinBtn.disabled){
                ev.preventDefault(); doJoin();
              }
            });

            const wrap = document.createElement("div");
            wrap.style.display = "flex";
            wrap.style.flexDirection = "column";
            wrap.style.gap = "16px";
            wrap.appendChild(input);

            b("Odaya Bağlan", wrap, [joinBtn]);
          }




           // HaxScipt Odaları paneli — code match + 🆚 çiftiyle sağlam eşleştirme + refresh
            var xe = () => {
            // --- Odalar + kodlar ---
            const codeOf = url => (url.match(/[?&]c=([A-Za-z0-9_\-]+)/) || [])[1] || null;
            const ROOMS = [
                { name: "🆁🆂 🟡🔵 FB 🆚 TS 🟣🔵 | v6 Real Soccer",  url: "https://www.haxball.com/play?c=fWMroZMVe4M" },
                { name: "🆁🆂 🟡🔴 GS 🆚 FB 🟡🔵 | v6 Real Soccer",  url: "https://www.haxball.com/play?c=YgcPlB0_kQ4" },
                { name: "🆁🆂 ⚫️⚪️ BJK - FB 🔵🟡 | v6 Real Soccer", url: "https://www.haxball.com/play?c=8V68V-eiEiM" },
                { name: "🆁🆂 🟡🔴 GS 🆚 BJK ⚫️🔘 | v6 Gerçek Top!", url: "https://www.haxball.com/play?c=JxNMECjZXD0" },
                { name: "🆁🆂 🔴🟡 GÖZ 🆚 ALT 🔘⚫️ | v6 Real Soccer",url: "https://www.haxball.com/play?c=eNOc7d2OhP0" },
                { name: "🆁🆂 🔴🔘 SVS 🆚 BUR 🟢🔘 | v6 Real Soccer",url: "https://www.haxball.com/play?c=sAXjWnpYO2M" },
                { name: "🆁🆂 ACEMİ ⚫️🔴 ESK 🆚 KOC 🟢⚫️ | v6 Real Soccer",url: "https://www.haxball.com/play?c=-oSf5h5mU0s" },
            ].map(r => ({ ...r, code: codeOf(r.url) }));
            const MAX_OVERRIDE = Object.fromEntries(ROOMS.map(r => [r.code, 16])); // senin odalar 16

            // --- helpers ---
            const frameDoc = () => document.getElementsByClassName("gameframe")[0]?.contentDocument || null;
            const norm = s => (s||"").normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim().replace(/\s+/g," ");
            const isRoomlistOpen = d => !!d && ( /roomlist-view/.test(d.body?.className||"") || !!d.querySelector("[data-hook='list'], .roomlist-view, .roomlist") );

            // "GS 🆚 FB" gibi çift çıkar (emoji / vs / x / × hepsi)
            function pairFrom(text){
                const raw = String(text||"").normalize("NFD").replace(/\p{Diacritic}/gu,"");
                const m = raw.match(/([A-ZÇĞİÖŞÜ]{2,4})\s*(?:🆚|vs\.?|v|x|×|\/|\|)\s*([A-ZÇĞİÖŞÜ]{2,4})/i);
                if(!m) return null;
                const a = m[1].toUpperCase().replace(/[^A-ZÇĞİÖŞÜ]/g,"");
                const b = m[2].toUpperCase().replace(/[^A-ZÇĞİÖŞÜ]/g,"");
                return [a,b].map(t=>t.normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase());
            }
            const samePair = (p1,p2)=> p1 && p2 && ((p1[0]===p2[0] && p1[1]===p2[1]) || (p1[0]===p2[1] && p1[1]===p2[0]));

            // satırdan ?c=... kodunu olabildiğince çıkar
            function extractCodeFromRow(row){
                if(row.dataset) for(const v of Object.values(row.dataset)){ if(typeof v==="string"){ const m=v.match(/play\?c=([A-Za-z0-9_\-]+)/); if(m) return m[1]; } }
                const linky = row.querySelector("a[href*='play?c='], [title*='play?c='], [aria-label*='play?c=']");
                if(linky){ const vv=linky.getAttribute("href")||linky.getAttribute("title")||linky.getAttribute("aria-label")||""; const m=vv.match(/play\?c=([A-Za-z0-9_\-]+)/); if(m) return m[1]; }
                for(const attr of Array.from(row.attributes||[])){ const m=(attr.value||"").match(/play\?c=([A-Za-z0-9_\-]+)/); if(m) return m[1]; }
                const subs=row.querySelectorAll("button,a,[role='button']");
                for(const el of subs){
                for(const v of Object.values(el.dataset||{})){ if(typeof v==="string"){ const m=v.match(/play\?c=([A-Za-z0-9_\-]+)/); if(m) return m[1]; } }
                const vv=el.getAttribute("href")||el.getAttribute("title")||el.getAttribute("aria-label")||"";
                const m=vv.match(/play\?c=([A-Za-z0-9_\-]+)/); if(m) return m[1];
                }
                const html=row.outerHTML||""; const m=html.match(/play\?c=([A-Za-z0-9_\-]+)/); return m?m[1]:null;
            }

            // roomlist'i gerçekten yenile (refresh butonuna tıkla + DOM değişimini bekle)
            function forceRoomlistRefresh(doc, timeout=1200){
                return new Promise(res=>{
                if(!doc) return res(false);
                const btn=doc.querySelector("[data-hook='refresh'], .refresh, button.refresh");
                const list=doc.querySelector(".list [data-hook='list']")||doc.querySelector("[data-hook='list']")||doc;
                const before=list?.textContent||""; let done=false;
                const obs=new MutationObserver(()=>{ if(done) return; const after=list?.textContent||""; if(after.length!==before.length){ done=true; obs.disconnect(); res(true); } });
                if(list) obs.observe(list,{childList:true,subtree:true});
                try{ btn?.dispatchEvent(new MouseEvent("click",{bubbles:true,cancelable:true})); }catch(_){}
                setTimeout(()=>{ if(!done){ try{obs.disconnect();}catch(_){} res(false);} }, timeout);
                });
            }

            // roomlist'ten satır bilgilerini oku
            function readList(){
                const d=frameDoc(); if(!isRoomlistOpen(d)) return null;
                const root=d.querySelector(".list [data-hook='list']")||d.querySelector("[data-hook='list']")||d.querySelector(".roomlist-view")||d;
                const rows=Array.from(root.querySelectorAll("tr, .row, [data-hook='row']"));
                const byCode=new Map();       // code -> entry
                const entries=[];             // entry = {name, pair, now, max, code}

                rows.forEach(row=>{
                const nameEl = row.querySelector("[data-hook='name'], .name, td:nth-child(1)");
                const name = (nameEl?.textContent||"").trim();
                if(!name) return;

                const pair = pairFrom(row.textContent||name); // 🆚 desteği
                const cntEl = row.querySelector("[data-hook='count'],[data-hook='players'], .count") || row;
                const txt = (cntEl.textContent || row.textContent || "").replace(/\s+/g," ");
                const m = txt.match(/(\d{1,2})\s*\/\s*(\d{1,2})/); if(!m) return;
                const now=parseInt(m[1],10), max=parseInt(m[2],10);
                const code=extractCodeFromRow(row);

                const entry={name, pair, now, max, code};
                if(code) byCode.set(code, entry);
                entries.push(entry);
                });

                return { byCode, entries };
            }

            // Bir oda için en iyi eşleşmeyi bul
            function findOcc(room, maps){
                if(!maps) return null;
                const wantPair = pairFrom(room.name) || pairFrom(room.name.replace("-", " 🆚 "));
                // 1) KOD
                if(room.code && maps.byCode.has(room.code)) return maps.byCode.get(room.code);
                // 2) 🆚 çifti
                if(wantPair){
                const hits = maps.entries.filter(e => samePair(wantPair, e.pair));
                if(hits.length===1) return hits[0];
                if(hits.length>1){
                    // aynı çifte sahip birden fazla varsa en yüksek now'u al
                    return hits.sort((a,b)=>b.now-a.now)[0];
                }
                }
                // 3) isim normalize (son çare)
                const target = norm(room.name);
                let best=null, bestScore=-1;
                maps.entries.forEach(e=>{
                const sc = norm(e.name).includes(target) || target.includes(norm(e.name)) ? 1 : 0;
                if(sc>bestScore){ best=e; bestScore=sc; }
                });
                return bestScore>0 ? best : null;
            }

            // --- UI ---
            const wrap=document.createElement("div");
            wrap.style.display="flex"; wrap.style.flexDirection="column"; wrap.style.gap="10px"; wrap.style.minWidth="420px";

            // üst bar
            const top = document.createElement("div");
            top.className = "hxs-rooms-top";
            const hint = document.createElement("div");
            hint.style.fontSize="12px"; hint.style.color="#94a3b8";
            hint.textContent="Oda listesinden okundu.";

            // Yenile (tema uyumlu)
            const refreshBtn = document.createElement("button");
            refreshBtn.type="button"; refreshBtn.className="hxs-refresh";
            refreshBtn.textContent="Yenile";
            refreshBtn.addEventListener("click", async ()=>{ await refresh(true); });

            top.appendChild(hint); top.appendChild(refreshBtn);
            wrap.appendChild(top);

            // GRID kapsayıcı
            const grid = document.createElement("div");
            grid.className = "hxs-rooms-grid";
            wrap.appendChild(grid);


            const rowsRef = [];

            ROOMS.forEach(r=>{
              const card = document.createElement("div");
              card.className = "hxs-room";

              const title = document.createElement("div");
              title.className = "hxs-title";
              title.textContent = r.name;

              const meta = document.createElement("div");
              meta.className = "hxs-meta";
              meta.textContent = "Doluluk: —";

              const join = document.createElement("button");
              join.type="button";
              join.className="hxs-join";
              join.textContent="Odaya Gir";
              join.addEventListener("click", ()=>{ try{ localStorage.setItem('hxs_last_room_name', r.name); }catch(_){ } window.location.href = r.url; });

              card.appendChild(title);
              card.appendChild(meta);
              card.appendChild(join);
              grid.appendChild(card);

              rowsRef.push({ room:r, meta });
            });



            async function refresh(forceClick=false){
                const d=frameDoc();
                if(!isRoomlistOpen(d)){ hint.textContent="Oda listesi açık değil. Listeye geçip ‘Yenile’ deyin."; rowsRef.forEach(x=>x.meta.textContent="Doluluk: —"); return; }
                if(forceClick) await forceRoomlistRefresh(d);
                const maps=readList(); if(!maps){ hint.textContent="Liste okunamadı."; return; }

                hint.textContent="Oda listesinden okundu.";
                rowsRef.forEach(({room,meta})=>{
                const occ=findOcc(room, maps);
                if(!occ){ meta.textContent="Doluluk: —"; return; }
                const max = MAX_OVERRIDE[room.code] ?? occ.max;
                meta.textContent = `Doluluk: ${occ.now}/${max}`;
                });
            }

            b("HaxScipt Odaları", wrap, []);

            // açıkken 3sn'de bir (liste açıksa) otomatik yenile
            const T=setInterval(async()=>{
                if(!document.getElementById("custom-alert")){ clearInterval(T); return; }
                if(isRoomlistOpen(frameDoc())) await refresh(false);
            },3000);

            setTimeout(()=>{ if(isRoomlistOpen(frameDoc())) refresh(false); },150);
            };

            // global
            window.xe = xe;






var b=(o,e,i=[])=>{if(!document.getElementById("custom-alert-style")){let a=document.createElement("style");a.id="custom-alert-style",a.innerHTML=`
                dialog#custom-alert {
                    background-color: #1b2125;
                    border: none;
                    border-radius: 10px;
                    padding: 20px 20px 30px 20px;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.5);
                    color: white;
                    max-width: 500px;
                    width: 90%;
                    text-align: center;
                    transition: opacity 0.3s ease, transform 0.3s ease;
                    transform: scale(0.8);
                    opacity: 0;
                }
                dialog#custom-alert::backdrop {
                    background: transparent;
                }
                #custom-alert h1 {
                    margin: 0 0 10px 0;
                    font-size: 24px;
                    font-weight: bold;
                    text-align: left; /* Left aligned */
                }
                #custom-alert hr {
                    border: none;
                    border-top: 3px solid #b2413b;
                    margin: 0 0 20px 0;
                }
                #custom-alert-message {
                    font-size: 15px;
                    margin-bottom: 20px;
                    text-align: left;
                }
                #custom-alert-message a {
                    color: #ffe7cc; /* Default color for the link */
                }
                #custom-alert-message b, #custom-alert-message strong {
                    font-weight: bold;
                }
                
                #custom-alert-message i {
                    font-style: italic;
                }

                #custom-alert-message a:hover {
                    color: #ffe7cc;
                    text-decoration: none;
                    transition: text-decoration 0.2s ease;
                }
                #custom-alert-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    flex-wrap: wrap;
                }
                #custom-alert-buttons button {
                    padding: 8px 16px;
                    font-size: 15px;
                    font-weight: bold;
                    border: none;
                    border-radius: 5px;
                    background-color: #244967;
                    color: white;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                #custom-alert-buttons button:hover {
                    background-color: #3b5d82;
                }
                #blur-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    backdrop-filter: blur(5px);
                    background: rgba(0, 0, 0, 0.2);
                    z-index: 9999;
                    display: none;
                    opacity: 0; /* Make sure this is here */
                    transition: opacity 0.3s ease; /* Add this if missing */
                }
                #custom-alert-close {
                    position: absolute;
                    top: 10px;
                    right: 15px;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    font-weight: bold;
                }
                #custom-alert-close:hover {
                    color: #c2cecf;
                }
            `,document.head.appendChild(a)}let _=document.getElementById("blur-overlay");_||(_=document.createElement("div"),_.id="blur-overlay",document.body.appendChild(_));
            let n=document.getElementById("custom-alert");n&&n.remove();
            let t=document.createElement("dialog");t.id="custom-alert",t.innerHTML=`
            <button id="custom-alert-close">&times;</button>
            <h1>${o}</h1>
            <hr>
            <div id="custom-alert-message"></div>
            <div id="custom-alert-buttons"></div>
        `;let c=t.querySelector("#custom-alert-message");typeof e=="string"?c.innerHTML=e.replace(/\n/g,"<br>"):(c.innerHTML="",c.appendChild(e)),document.body.appendChild(t);
        let d=t.querySelector("#custom-alert-buttons");i.forEach(a=>d.appendChild(a)),_.style.display="block",requestAnimationFrame(()=>{_.style.opacity="1"}),document.body.style.overflow="hidden",t.showModal(),requestAnimationFrame(()=>{t.style.opacity="1",t.style.transform="scale(1)"});
        let r=document.getElementById("custom-alert-close");r.onclick=()=>{H()},t.addEventListener("close",()=>{H()})},H=()=>{let o=document.getElementById("custom-alert"),e=document.getElementById("blur-overlay");o&&(e&&(e.style.opacity="0",setTimeout(()=>{e.style.display="none"},300)),o.style.opacity="0",o.style.transform="scale(0.8)",setTimeout(()=>{o.close(),o.remove(),document.body.style.overflow=""},300))};
        var j={releases:"https://api.github.com/repos/HaxScipt/haxscipt-client/releases",website:"https://www.haxscipt.com",faq:"https://github.com/HaxScipt/haxscipt-client/blob/main/FAQ.md",github_issue:"https://github.com/HaxScipt/haxscipt-client/issues",discord:"https://www.discord.gg/haxscipt"},$="Bir komut girin (c tuşuna basarak gizleyin)";
        var M=o=>{window.electronAPI.getAppPreferences().then(e=>{let i=e.profiles,_=i.find(n=>n.id===o)||i[0];localStorage.setItem("current_profile",_.id),Object.keys(_).filter(n=>!["id","name","autosave"].includes(n)).forEach(n=>{let t=_[n];t===null?localStorage.removeItem(n):(n==="geo_override"&&(t=JSON.stringify(t)),n==="fav_rooms"&&(t=t.length!==0?JSON.stringify(t):"[]"),localStorage.setItem(n,t))})}).catch(e=>{console.error("Failed to load settings:",e)})},U=o=>{console.log(`Switching to profile: ${o}`),M(o),sessionStorage.removeItem("profileInitialized"),window.electronAPI.restartApp()},q=()=>window.electronAPI.getAppPreferences().then(o=>{let e=o.profiles,i=localStorage.getItem("current_profile")||"default",_=e.findIndex(n=>n.id==i);if(_!==-1)return Object.keys(e[_]).filter(n=>!["id","name","autosave"].includes(n)).forEach(n=>{let t=localStorage.getItem(n);n=="geo_override"&&(t=JSON.parse(t)),n=="fav_rooms"&&(t=JSON.parse(t||"[]")),e[_][n]=t}),window.electronAPI.setAppPreference("profiles",e)}).catch(o=>{console.error("Failed to load settings:",o)}),se=o=>window.electronAPI.getAppPreferences().then(e=>{let i=e.profiles.filter(_=>!o.includes(_.id));return console.log("Removing profiles",o),window.electronAPI.setAppPreference("profiles",i)}).catch(e=>{console.error("Failed to load settings:",e)});
        function me(o){if(!document.getElementById("font-awesome-4")){let l=document.createElement("link");l.id="font-awesome-4",l.rel="stylesheet",l.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",document.head.appendChild(l)}let e=localStorage.getItem("current_profile"),i=e,_=new Set,n=new Set,t="custom-modal-style";document.getElementById(t)?.remove(),document.getElementById("custom-modal")?.remove(),document.getElementById("blur-overlay")?.remove();
        let c=document.createElement("style");c.id=t,c.innerHTML=`
        #custom-modal {
            background-color: #1b2125;
            border: none;
            border-radius: 10px;
            padding: 20px 20px 30px 20px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.5);
            color: white;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            text-align: center;
            opacity: 0;
            transform: scale(0.8) translate(-50%, -50%);
            transition: opacity 0.3s ease, transform 0.3s ease;
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 50%;
            left: 50%;
            overflow: hidden;
            z-index: 10000;
            box-sizing: border-box;
        }
        #profile-list {
            overflow-y: auto;
            margin-bottom: 20px;
            flex-grow: 1;
            min-height: 100px;
        }
        #custom-modal h1 {
            margin: 0 0 10px 0;
            font-size: 24px;
            font-weight: bold;
            text-align: left;
        }
        #custom-modal hr {
            border: none;
            border-top: 3px solid #b2413b;
            margin: 0 0 20px 0;
        }
        .profile-card {
            border: 1px solid #3b5d82;
            border-radius: 5px;
            padding: 10px;
            margin-bottom: 10px;
            text-align: left;
            display: flex;
            flex-direction: column;
            gap: 5px;
            position: relative;
        }
        .profile-card button {
            padding: 6px 10px;
            font-size: 15px;
            font-weight: bold;
            border: none;
            border-radius: 5px;
            background-color: #244967;
            color: white;
            cursor: pointer;
            transition: background-color 0.2s;
            margin-top: 5px;
            width: 120px;
        }
        .profile-card button:hover {
            background-color: #3b5d82;
        }
        .button-row {
            display: flex;
            gap: 10px;
            margin-top: 10px;
        }
        .delete-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: #b2413b;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            display: none;
        }
        .save-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: #3b5d82;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            display: none;
        }
        #custom-modal-buttons {
            display: flex;
            justify-content: center;
            gap: 10px;
            flex-wrap: wrap;
        }
        #custom-modal-buttons button {
            padding: 8px 16px;
            font-size: 15px;
            font-weight: bold;
            border: none;
            border-radius: 5px;
            background-color: #244967;
            color: white;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        #custom-modal-buttons button:hover {
            background-color: #3b5d82;
        }
        #custom-modal-close {
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            font-weight: bold;
        }
        #custom-modal-close:hover {
            color: #c2cecf;
        }
        #blur-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            backdrop-filter: blur(5px);
            background: rgba(0, 0, 0, 0.2);
            z-index: 9999;
            display: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .profile-field-label {
            font-weight: bold;
        }
        .profile-field-label-mod {
            font-weight: bold;
            color: #67b64f;
        }
        .profile-field-mod {
            color: #67b64f;
        }
        .profile-name {
            font-weight: bold;
            font-size: 20px;
        }
    `,document.head.appendChild(c);
    let d=document.createElement("div");d.id="blur-overlay",document.body.appendChild(d);
    let r=document.createElement("div");r.id="custom-modal";
    let a=document.createElement("button");a.id="custom-modal-close",a.innerHTML="&times;",a.addEventListener("click",u),r.appendChild(a);
    let s=document.createElement("h1");s.textContent="Profilleri Y\xF6net",r.appendChild(s);
    let h=document.createElement("hr");r.appendChild(h);
    let g=document.createElement("button");g.innerHTML='<i class="fa fa-user-plus" aria-hidden="true"></i> Yeni Profil Olu\u015Ftur',g.style.padding="8px 16px",g.style.fontSize="15px",g.style.fontWeight="bold",g.style.border="none",g.style.borderRadius="5px",g.style.backgroundColor="#244967",g.style.color="white",g.style.cursor="pointer",g.style.transition="background-color 0.2s",g.style.margin="0px 0 20px 0",g.addEventListener("mouseover",()=>{g.style.backgroundColor="#3b5d82"}),g.addEventListener("mouseout",()=>{g.style.backgroundColor="#244967"}),g.addEventListener("click",()=>{u(),le()}),r.appendChild(g);
    let y=document.createElement("div");y.id="profile-list",r.appendChild(y);
    let m=new Map;o.forEach(l=>{let p=document.createElement("div");p.className="profile-card";
    let I=document.createElement("div");I.className="profile-name",I.textContent=l.name,p.appendChild(I),[{label:"Nick",value:e===l.id?localStorage.getItem("player_name"):l.player_name,modified:e===l.id&&l.player_name!==localStorage.getItem("player_name")},{label:"Avatar",value:e===l.id?localStorage.getItem("avatar")||"(no avatar)":l.avatar||"(no avatar)",modified:e===l.id&&l.avatar!==localStorage.getItem("avatar")},{label:"Extrapolation",value:e===l.id?localStorage.getItem("extrapolation")||"0":l.extrapolation||"0",modified:e===l.id&&(l.extrapolation||"0")!==(localStorage.getItem("extrapolation")||"0")},{label:"Bayrak",value:e===l.id?localStorage.getItem("geo_override")?JSON.parse(localStorage.getItem("geo_override")).code.toUpperCase():"(no override)":l.geo_override?l.geo_override.code.toUpperCase():"(no override)",modified:e===l.id&&(l.geo_override?.code||"")!==((JSON.parse(localStorage.getItem("geo_override"))||{})?.code||"")},{label:"Favori Odalar",value:e===l.id?localStorage.getItem("fav_rooms")!==null&&localStorage.getItem("fav_rooms")!=="[]"?"<br>\u2022 "+JSON.parse(localStorage.getItem("fav_rooms")).join("<br>\u2022 "):"(no rooms)":l.fav_rooms.length!==0?"<br>\u2022 "+l.fav_rooms.join("<br>\u2022 "):"(no rooms)",modified:e===l.id&&JSON.stringify(l.fav_rooms)!==String(localStorage.getItem("fav_rooms")||"[]")},{label:"Auth",value:e===l.id?localStorage.getItem("player_auth_key").split(".")[1]:l.player_auth_key.split(".")[1],modified:e===l.id&&l.player_auth_key!==localStorage.getItem("player_auth_key")},{label:"Otomatik Kaydetme",value:l.autosave?"A\xC7IK":"KAPALI",modified:!1}].forEach(k=>{let E=document.createElement("div");k.modified?E.innerHTML=`
                <span class="profile-field-label-mod">${k.label}:</span> <span class="profile-field-mod">${k.value}</span>
                `:E.innerHTML=`
                <span class="profile-field-label">${k.label}:</span> ${k.value}
                `,p.appendChild(E)});
    let S=document.createElement("div");S.className="delete-badge",S.textContent="Silinecek",p.appendChild(S);
    let w=document.createElement("div");w.className="save-badge",w.textContent="Kaydedilecek",p.appendChild(w);
    let f=document.createElement("div");f.className="button-row";
    let L=document.createElement("button");L.textContent=e===l.id?"Se\xE7ilmi\u015F":"Se\xE7";
    function C(k,E){E?(k.textContent="Se\xE7ilmi\u015F",k.style.backgroundColor="#559742",k.style.color="white"):(k.textContent="Se\xE7",k.style.backgroundColor="#244967",k.style.color="white")}
    let T=[i,e].includes(l.id);if(C(L,T),L.addEventListener("click",()=>{i=l.id,m.forEach((k,E)=>{C(k,E===l.id)})}),f.appendChild(L),m.set(l.id,L),l.id===e){let k=document.createElement("button");k.textContent="Profili Kaydet",k.addEventListener("click",()=>{n.has(l.id)?(n.delete(l.id),k.textContent="Profili Kaydet",w.style.display="none"):(n.add(l.id),k.textContent="Kaydetmeyi Geri Al",w.style.display="block")}),f.appendChild(k)}if(l.id!=="default"){let k=document.createElement("button");k.textContent="Sil",k.addEventListener("click",()=>{_.has(l.id)?(_.delete(l.id),k.textContent="Sil",S.style.display="none"):(_.add(l.id),k.textContent="Silmeyi Geri Al",S.style.display="block")}),f.appendChild(k)}p.appendChild(f),y.appendChild(p)});
    let v=document.createElement("div");v.id="custom-modal-buttons";
    let x=document.createElement("button");x.textContent="De\u011Fi\u015Fiklikleri Uygula",x.addEventListener("click",async()=>{console.log("Se\xE7ilen Profil:",i),console.log("Kaydedilecek Profiller:",Array.from(n)),console.log("Kald\u0131r\u0131lacak Profiller:",Array.from(_)),Array.from(n).length!==0&&await q(),Array.from(_).length!==0&&await se(Array.from(_)),Array.from(_).includes(i)&&(i="default"),u(),i!==e&&(b("De\u011Fi\u015Fiklikler Uyguland\u0131!","Uygulama birka\xE7 saniye i\xE7inde yeniden ba\u015Flayacakt\u0131r (veya manuel olarak ba\u015Flat\u0131n)..",[]),setTimeout(()=>U(i),4e3))}),v.appendChild(x),r.appendChild(v),document.body.appendChild(r),d.style.display="block",requestAnimationFrame(()=>{d.style.opacity="1",r.style.opacity="1",r.style.transform="scale(1) translate(-50%, -50%)"});
    function u(){d.style.opacity="0",r.style.opacity="0",r.style.transform="scale(0.8) translate(-50%, -50%)",r.remove(),d.remove()}}
    var le=async()=>{let e=(await window.electronAPI.getAppPreferences()).profiles,i=document.getElementById("commandline"),_=document.createElement("button");_.innerText="Profil Olu\u015Ftur",_.disabled=!0,_.style.backgroundColor="#3e3e3e",_.style.cursor="not-allowed",_.style.color="white",_.style.padding="8px 16px",_.style.fontSize="14px",_.style.fontWeight="bold",_.style.border="none",_.style.borderRadius="5px",_.style.transition="background-color 0.2s",_.addEventListener("mouseenter",()=>{_.disabled||(_.style.backgroundColor="#3b5d82")}),_.addEventListener("mouseleave",()=>{_.disabled||(_.style.backgroundColor="#244967")});
    let n={id:null,name:null,autosave:!0,avatar:null,extrapolation:null,fav_rooms:[],geo_override:null,player_name:null,player_auth_key:null},t=(m,v,x)=>{let u=document.createElement("div");u.className="label-input",u.style.display="flex",u.style.backgroundColor="#244967",u.style.alignItems="baseline",u.style.borderRadius="5px",u.style.padding="3px 3px 3px 5px",u.style.marginBottom="15px";
    let l=document.createElement("label");l.textContent=v,l.style.marginRight="8px";
    let p=document.createElement("input");return p.id=m,p.placeholder=x,p.type="text",p.maxLength=25,p.style.flex="1",p.style.padding="3px",p.style.paddingLeft="6px",p.style.border="none",p.style.borderRadius="5px",p.style.background="#1b2125",p.style.color="white",p.style.fontSize="14px",p.style.width="10ch",p.style.outline="none",u.appendChild(l),u.appendChild(p),{box:u,input:p}},{box:c,input:d}=t("profile-name-input","Profil ad\u0131:","Profil ad\u0131 girin"),{box:r,input:a}=t("nickname-input","Nick:","Bir takma ad se\xE7in (daha sonra de\u011Fi\u015Ftirilebilir)"),s=(m,v,x,u)=>{let l=w=>{w.addEventListener("mouseenter",()=>{w.disabled||(w.dataset.active==="true"?w.style.backgroundColor="#3b5d82":w.style.color="white")}),w.addEventListener("mouseleave",()=>{w.disabled||(w.dataset.active==="true"?(w.style.backgroundColor="#244967",w.style.color="white"):(w.style.backgroundColor="#1b2125",w.style.color="#aaa"))})},p=document.createElement("div");p.style.marginBottom="15px";
    let I=document.createElement("div");I.textContent=m,I.style.marginBottom="5px",I.style.fontWeight="bold",p.appendChild(I);
    let z=document.createElement("div");z.style.display="flex",z.style.gap="10px";
    let S={};return v.forEach(w=>{let f=document.createElement("button");f.textContent=w,f.style.flex="1",f.style.padding="8px 16px",f.style.fontSize="14px",f.style.fontWeight="bold",f.style.border="none",f.style.borderRadius="5px",f.style.cursor="pointer",f.style.transition="background-color 0.2s, color 0.2s";
    let L=C=>{f.style.backgroundColor=C?"#244967":"#1b2125",f.style.color=C?"white":"#aaa",f.dataset.active=C?"true":"false"};f.addEventListener("click",()=>{Object.entries(S).forEach(([C,T])=>{(P=>{T.style.backgroundColor=P?"#244967":"#1b2125",T.style.color=P?"white":"#aaa",T.dataset.active=P?"true":"false"})(C===w)}),u(w)}),L(w===x),l(f),S[w]=f,z.appendChild(f)}),p.appendChild(z),p},h=s("Otomatik kaydetme",["A\xC7IK","KAPALI"],"ON",m=>{n.autosave=m==="ON"}),g=s("Auth",["Yeni Auth","Mevcut Auth"],"New Identity",async m=>{m==="Current Identity"?n.player_auth_key=localStorage.getItem("player_auth_key"):n.player_auth_key=await window.electronAPI.generatePlayerAuthKey()}),y=()=>{let m=d.value.trim(),v=a.value,x=e.some(u=>u.id===m.toLowerCase().replace(/\s+/g,"-"));m.length===0||v.length===0||x?(_.disabled=!0,_.style.backgroundColor="#3e3e3e",_.style.cursor="not-allowed",x&&m.length>0?d.style.color="#b2413b":d.style.color="white"):(_.disabled=!1,_.style.backgroundColor="#244967",_.style.cursor="pointer",d.style.color="white")};d.addEventListener("input",y),d.addEventListener("keydown",y),a.addEventListener("input",y),_.onclick=()=>{let m=d.value.trim(),v=a.value,x=m.toLowerCase().replace(/\s+/g,"-");n.id=x,n.name=m,n.player_name=v,e.push(n);
    let u=e.findIndex(l=>l.id==="default");e[u].player_name===null&&(e[u].player_name=localStorage.getItem("player_name")),window.electronAPI.setAppPreference("profiles",e),b("Yeni profil olu\u015Fturuldu!","Uygulama birka\xE7 saniye i\xE7inde yeniden ba\u015Flayacakt\u0131r (veya manuel olarak ba\u015Flat\u0131n)..",[]),setTimeout(()=>U(x),4e3)},b("Yeni Profil",`Yeni bir profil olu\u015Fturuyorsunuz.

        Bu profilin kendine ait
        \u2022 Nick
        \u2022 Auth
        \u2022 Avatar
        \u2022 Extrapolation
        \u2022 Bayrak
        \u2022 Favori odalar

        Otomatik kaydetme seçeneği:
        \u2022 Otomatik kaydetme AÇIK olduğunda, uygulamayı kapattığınızda mevcut profildeki değişiklikler kaydedilir.
        \u2022 Otomatik kaydetme KAPALI olduğunda, değişiklikler otomatik olarak kaydedilmez.

        Kimlik seçeneği:
        \u2022 “Yeni Kimlik” seçeneği etkinleştirildiğinde, bu profil için yeni bir kimlik oluşturulur.
        \u2022 “Mevcut Kimlik” seçeneği etkinleştirildiğinde, şu anda kullandığınız profilin kimliği kullanılır. 

        Profil oluşturma işlemi başarılı olursa, uygulama yeni profil seçili olarak yeniden başlatılır.

        <div id="profile-creation-container"></div>`,[_]),setTimeout(()=>{let m=document.querySelector("#profile-creation-container");m&&(m.appendChild(c),m.appendChild(r),m.appendChild(h),m.appendChild(g))},0),setTimeout(()=>{i.placeholder=$},3e3)},V=()=>{window.electronAPI.getAppPreferences().then(o=>{let e=o.profiles;me(e)})};

        // Profili Yeniden Adlandır (modal)
        var renameCurrentProfile = async () => {
        try {
            const prefs = await window.electronAPI.getAppPreferences();
            const currId = localStorage.getItem("current_profile") || "default";
            const idx = prefs.profiles.findIndex(p => p.id === currId);
            if (idx === -1) { b("Hata", "Geçerli profil bulunamadı.", []); return; }

            // input kutusu
            const box = document.createElement("div");
            box.style.display = "flex";
            box.style.flexDirection = "column";
            box.style.gap = "10px";

            const wrap = document.createElement("div");
            wrap.className = "label-input";
            wrap.style.display = "flex";
            wrap.style.backgroundColor = "#244967";
            wrap.style.alignItems = "baseline";
            wrap.style.borderRadius = "5px";
            wrap.style.padding = "3px 3px 3px 5px";

            const label = document.createElement("label");
            label.textContent = "Profil adı:";
            label.style.marginRight = "8px";

            const input = document.createElement("input");
            input.type = "text";
            input.maxLength = 25;
            input.value = prefs.profiles[idx].name || currId;
            input.style.flex = "1";
            input.style.padding = "3px";
            input.style.paddingLeft = "6px";
            input.style.border = "none";
            input.style.borderRadius = "5px";
            input.style.background = "#1b2125";
            input.style.color = "white";
            input.style.fontSize = "14px";
            input.style.outline = "none";

            wrap.appendChild(label);
            wrap.appendChild(input);
            box.appendChild(wrap);

            const saveBtn = A("Kaydet", "#244967", "#3b5d82", async () => {
            const newName = (input.value || "").trim();
            if (!newName) return;

            prefs.profiles[idx].name = newName;
            await window.electronAPI.setAppPreference("profiles", prefs.profiles);

            // Header'daki yazıyı anında güncelle
            const a = document.querySelector(".header .right-container .title a");
            if (a) a.innerHTML = `<i class="fa fa-user" aria-hidden="true"></i> ${newName}`;

            H(); // modalı kapat
            });

            b("Profili Yeniden Adlandır", box, [saveBtn]);
        } catch (e) {
            b("Hata", "Profil adı değiştirilemedi.", []);
            console.error(e);
        }
        };


        var A=(o,e,i,_)=>{let n=document.createElement("button");return n.textContent=o,n.style.flex="1",n.style.padding="8px 0",n.style.fontSize="14px",n.style.fontWeight="bold",n.style.border="none",n.style.borderRadius="5px",n.style.cursor="pointer",n.style.transition="background-color 0.2s, color 0.2s",n.style.backgroundColor=e,n.style.color="white",n.addEventListener("click",_),n.addEventListener("mouseenter",()=>{n.style.backgroundColor=i}),n.addEventListener("mouseleave",()=>{n.style.backgroundColor=e}),n};
        var Y=(o,e)=>{let i=document.createElement("button");i.id="copy-public-auth-button",i.textContent="Copy Public Auth",i.addEventListener("click",()=>{navigator.clipboard.writeText(o).then(()=>{console.log("Copied to clipboard!"),i.textContent="Copied to clipboard!",setTimeout(()=>i.textContent="Copy Public Auth",2e3)}).catch(n=>{console.error("Failed to copy: ",n)})});
        let _=document.createElement("button");_.id="copy-private-key-button",_.textContent="Copy Private Key",_.addEventListener("click",()=>{navigator.clipboard.writeText(e).then(()=>{console.log("Copied to clipboard!"),_.textContent="Copied to clipboard!",setTimeout(()=>_.textContent="Copy Private Key",2e3)}).catch(n=>{console.error("Failed to copy: ",n)})}),b("Auth",`Genel kimlik bilgileriniz, oda yöneticileri tarafından odalarına katıldığınızda sizi tanımlamak için kullanılır.

		Özel anahtarınız sadece sizin tarafınızdan görülebilir ve genel kimlik doğrulamanızı değiştirmek için kullanılabilir. 
        
        Dikkatli olun! Birisi özel anahtarınızı keşfederse, onu sizin kimliğinizi taklit etmek için kullanabilir.

		<b>Public auth</b>
		${o}

		<b>Private key</b>
		idkey.${o}.[hidden]`,[i,_])},G=()=>{let o=A("Sıfırlamayı Onayla","#b2413b","#D04D46",async()=>{let i=(await window.electronAPI.getAppPreferences()).profiles,_=await window.electronAPI.generatePlayerAuthKey(),n=i.findIndex(t=>t.id===localStorage.getItem("current_profile"));n!==-1&&(i[n].player_auth_key=_),await window.electronAPI.setAppPreference("profiles",i),localStorage.setItem("player_auth_key",_),b("Reset successful","The page will reload in a few seconds.",[]),setTimeout(()=>window.location.reload(),4e3)});b("Emin misiniz?","Kimlik doğrulamanızı sıfırladığınızda, genel odalarda kimliğinizi kaybedebilirsiniz.",[o])},W=()=>{let o=(t,c,d)=>{let r=document.createElement("div");r.className="label-input",r.style.display="flex",r.style.backgroundColor="#244967",r.style.alignItems="baseline",r.style.borderRadius="5px",r.style.padding="3px 3px 3px 5px",r.style.marginBottom="15px";
            let a=document.createElement("label");a.textContent=c,a.style.marginRight="8px";
            let s=document.createElement("input");return s.id=t,s.placeholder=d,s.type="text",s.maxLength=137,s.style.flex="1",s.style.padding="3px",s.style.paddingLeft="6px",s.style.border="none",s.style.borderRadius="5px",s.style.background="#1b2125",s.style.color="white",s.style.fontSize="13px",s.style.width="10ch",s.style.outline="none",r.appendChild(a),r.appendChild(s),{box:r,input:s}},e=document.createElement("button");e.innerText="Yeni Auth Doğrulama Uygula",e.disabled=!0,e.style.backgroundColor="#3e3e3e",e.style.cursor="not-allowed",e.style.color="white",e.style.padding="8px 16px",e.style.fontSize="14px",e.style.fontWeight="bold",e.style.border="none",e.style.borderRadius="5px",e.style.transition="background-color 0.2s";
            let{box:i,input:_}=o("idkey-input","Private Key:","Metin kırmızıya dönerse, yanlış şeyi kopyalıyorsunuz demektir."),n=()=>{let t=_.value.trim();/^idkey\.([A-Za-z0-9_-]{43})\.([A-Za-z0-9_-]{43})\.([A-Za-z0-9_-]{43})$/.test(t)?(e.disabled=!1,e.style.backgroundColor="#244967",e.style.cursor="pointer",_.style.color="white"):(e.disabled=!0,e.style.backgroundColor="#3e3e3e",e.style.cursor="not-allowed",_.style.color="#b2413b")};_.addEventListener("input",n),_.addEventListener("keydown",n),e.addEventListener("click",()=>{let t=_.value.trim();localStorage.setItem("player_auth_key",t),b("Auth Değiştirildi","Sayfa birkaç saniye içinde yeniden yüklenecektir. Eğer yüklenmez ise 10 saniye sonra uygulamayı kapatıp tekrar aç.",[]),setTimeout(()=>window.location.reload(),4e3)}),b("Auth Değiştir",`Aşağıya özel anahtarını girerek farklı bir kimlik doğrulama yöntemi kullanabilirsiniz.

		Örneğin, daha önce farklı bir tarayıcı veya cihaz kullandıysanız, şu adresi ziyaret ederek eski kimliğinizi geri yükleyebilirsiniz:
		
		<a target="_blank" href=https://hqxball.com/playerauth>https://hqxball.com/playerauth</a> (veya haxball.com/playerauth)

		O sayfadan Özel Anahtarı kopyalayın ve aşağıdaki kutuya yapıştırın.

        <div id="auth-change-container"></div>`,[e]),setTimeout(()=>{let t=document.querySelector("#auth-change-container");t&&t.appendChild(i)},0)};
        var R=async()=>{if(!document.getElementById("font-awesome-4")){let h=document.createElement("link");h.id="font-awesome-4",h.rel="stylesheet",h.href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css",document.head.appendChild(h)}let o=h=>{let g=document.createElement("input");return g.type="text",g.placeholder=h,g.maxLength=137,g.style.flex="1",g.style.padding="3px",g.style.paddingLeft="6px",g.style.border="none",g.style.borderRadius="5px",g.style.background="#1b2125",g.style.color="white",g.style.fontSize="13px",g.style.width="100%",g.style.outline="none",g.style.boxShadow="inset 0 0 0 1px rgba(255,255,255,0.15)",g},e=await window.electronAPI.getAppPreferences(),eShort=(Array.isArray(e.shortcuts)?e.shortcuts:[]),i=eShort.flat(),_=document.createElement("div");_.id="shortcut-create-container",_.style.display="flex",_.style.flexDirection="column",_.style.gap="20px";
        let n=document.createElement("div");n.style.display="flex",n.style.gap="10px";
        let t=o("Buraya yazd\u0131klar\u0131n\u0131z..."),c=o("...burada yazd\u0131\u011F\u0131n\u0131z \u015Feye d\xF6n\xFC\u015F\xFCr"),d=document.createElement("i");d.className="fa fa-arrow-right",d.style.alignSelf="center",d.style.margin="0 8px",d.style.fontSize="16px",d.style.fontStyle="normal",n.appendChild(t),n.appendChild(d),n.appendChild(c);
        let r="K\u0131sayolu Kaydet",a=document.createElement("button");a.textContent=r,a.disabled=!0,a.style.flex="1",a.style.padding="8px 0",a.style.fontSize="14px",a.style.fontWeight="bold",a.style.border="none",a.style.borderRadius="5px",a.style.cursor="not-allowed",a.style.transition="background-color 0.2s",a.style.backgroundColor="#3e3e3e",a.style.color="white";
        let s=async()=>{let h=t.value.trim()&&c.value.trimStart(),g=!i.includes(t.value.trim())&&!i.includes(c.value.trimStart()),y=t.value.trim()!==c.value.trimStart(),m=h&&g&&y;a.disabled=!m,a.style.cursor=m?"pointer":"not-allowed",a.style.backgroundColor=m?"#244967":"#3e3e3e"};a.addEventListener("mouseenter",()=>{a.disabled||(a.style.backgroundColor="#2e5c87")}),a.addEventListener("mouseleave",()=>{a.disabled||(a.style.backgroundColor="#244967")}),a.addEventListener("click",async()=>{if(a.disabled)return;
        let h=Array.isArray(e.shortcuts)?e.shortcuts:[];h.push([t.value.trim(),c.value.trimStart()]),i=h.flat(),await window.electronAPI.setAppPreference("shortcuts",h),t.value="",c.value="",a.textContent="K\u0131sayol Kaydedildi!",a.style.backgroundColor="#67b64f",a.disabled=!0,setTimeout(()=>{a.textContent=r,a.style.backgroundColor="#3e3e3e"},3e3)}),t.addEventListener("input",s),c.addEventListener("input",s),_.appendChild(n),b("Yeni K\u0131sayol",`Sohbette yaz\u0131ld\u0131\u011F\u0131nda geni\u015Fleyen bir metin k\u0131sayolu olu\u015Fturun.
		
		<div id="shortcut-dialog-body"></div>`,[a]),setTimeout(()=>{let h=document.querySelector("#shortcut-dialog-body");h&&h.appendChild(_)},0)},J=async()=>{let e=(await window.electronAPI.getAppPreferences()).shortcuts||[],i=document.createElement("div");i.style.display="flex",i.style.flexDirection="column",i.style.gap="12px",i.style.alignItems="center";
            let _=()=>{i.innerHTML="",e.forEach(([t,c],d)=>{let r=document.createElement("div");r.style.display="flex",r.style.alignItems="center",r.style.justifyContent="space-between",r.style.width="100%";
            let a=document.createElement("div");a.style.display="flex",a.style.alignItems="center",a.style.gap="8px",a.style.margin="0 auto";
            let s={background:"#1b2125",color:"white",fontSize:"13px",borderRadius:"5px",padding:"4px 6px",overflowX:"auto",whiteSpace:"nowrap",boxShadow:"inset 0 0 0 1px rgba(255,255,255,0.15)",width:"200px",flexShrink:"0"},h=document.createElement("div");h.textContent=t,Object.assign(h.style,s);
            let g=document.createElement("div");g.textContent=c,Object.assign(g.style,s);
            let y=document.createElement("i");y.className="fa fa-arrow-right",y.style.fontSize="14px",y.style.fontStyle="normal",y.style.color="white",a.appendChild(h),a.appendChild(y),a.appendChild(g);
            let m=document.createElement("button");m.innerHTML='<i class="fa fa-trash" aria-hidden="true"></i>';
            let v=m.querySelector("i");v.style.fontStyle="normal",m.style.background="transparent",m.style.border="none",m.style.color="#999",m.style.cursor="pointer",m.style.fontSize="14px",m.style.width="24px",m.style.height="24px",m.style.borderRadius="4px",m.style.transition="background 0.2s",m.addEventListener("mouseenter",()=>{m.style.background="#333",m.style.color="#f55"}),m.addEventListener("mouseleave",()=>{m.style.background="transparent",m.style.color="#999"}),m.addEventListener("click",async()=>{e.splice(d,1),await window.electronAPI.setAppPreference("shortcuts",e),_()}),r.appendChild(a),r.appendChild(m),i.appendChild(r),i.appendChild(O())})};_();
            let n=A("Yeni bir k\u0131sayol olu\u015Fturun","#244967","#3b5d82",()=>{R()});e.length>0?(b("K\u0131sayollar\u0131n\u0131z",'<div id="shortcut-list-body"></div>',[n]),setTimeout(()=>{let t=document.querySelector("#shortcut-list-body");t&&(t.appendChild(i),t.style.maxHeight="300px",t.style.overflowY="auto",t.style.paddingLeft="0")},0)):b("K\u0131sayollar\u0131n\u0131z","Hi\xE7bir k\u0131sayol kaydetmediniz!",[n])};
            var X=(o,e,i,_)=>{let n=document.createElement("div");n.style.display="flex",n.style.justifyContent="space-between",n.style.alignItems="center",n.style.marginBottom="15px",n.style.gap="12px";
            let t=document.createElement("div");t.textContent=o,t.style.flex="0 0 180px",t.style.fontWeight="bold";
            let c=document.createElement("div");c.style.display="flex",c.style.gap="10px",c.style.minWidth="300px";
            let d=`${Math.floor(280/e.length)}px`,r={};return e.forEach(a=>{let s=document.createElement("button");s.textContent=a,s.style.width=d,s.style.padding="8px 0",s.style.fontSize="14px",s.style.fontWeight="bold",s.style.border="none",s.style.borderRadius="5px",s.style.cursor="pointer",s.style.transition="background-color 0.2s, color 0.2s",s.style.backgroundColor="#1b2125",s.style.color="#aaa";
            let h=g=>{s.style.backgroundColor=g?"#244967":"#1b2125",s.style.color=g?"white":"#aaa",s.dataset.active=g?"true":"false"};s.addEventListener("click",()=>{Object.entries(r).forEach(([g,y])=>{let m=g===a;y.style.backgroundColor=m?"#244967":"#1b2125",y.style.color=m?"white":"#aaa",y.dataset.active=m?"true":"false"}),_(a)}),s.addEventListener("mouseenter",()=>{s.dataset.active!=="true"?s.style.color="white":s.style.backgroundColor="#3b5d82"}),s.addEventListener("mouseleave",()=>{s.dataset.active!=="true"?s.style.color="#aaa":s.style.backgroundColor="#244967"}),h(a===i),r[a]=s,c.appendChild(s)}),n.appendChild(t),n.appendChild(c),n},O=()=>{let o=document.createElement("hr");return o.style.border="none",o.style.borderTop="1px solid #444",o.style.margin="20px 0",o},de=()=>{let o=A("S\u0131f\u0131rlamay\u0131 Onayla","#b2413b","#D04D46",()=>{window.electronAPI.deletePreferencesFile().then(e=>{e&&(localStorage.clear(),b("S\u0131f\u0131rlama ba\u015Far\u0131l\u0131!","Uygulama birka\xE7 saniye i\xE7inde yeniden ba\u015Flayacakt\u0131r (veya manuel olarak ba\u015Flat\u0131n)..",[]),setTimeout(()=>window.electronAPI.restartApp(),4e3))})});b("Emin misiniz?","Bu i\u015Flem uygulamay\u0131 s\u0131f\u0131rlayacak ve t\xFCm ayarlar\u0131n\u0131z\u0131 silecektir.",[o])},
            Z=async()=>{let o=await window.electronAPI.getAppPreferences(),e=document.createElement("div"),i=document.createElement("div");i.textContent="Genel",i.style.fontSize="18px",i.style.fontWeight="bold",i.style.marginBottom="10px";
            let _=document.createElement("div");_.textContent="Bu ayarlar uygulanmadan \xF6nce uygulamay\u0131 yeniden ba\u015Flatman\u0131z gerekir!",_.style.fontSize="13px",_.style.marginBottom="15px",_.style.color="#ccc";
            let n=o.fps_unlock?"S\u0131n\u0131rs\u0131z":"Varsay\u0131lan",t=X("FPS",["Varsay\u0131lan","S\u0131n\u0131rs\u0131z"],n,E=>{let P=E!=="Varsay\u0131lan";window.electronAPI.setAppPreference("fps_unlock",P)}),c=o.hasOwnProperty("discord_rpc")?o.discord_rpc?"Etkin":"Kapal\u0131":"Etkin",d=X("Discord Etkinlik",["Etkin","Kapal\u0131"],c,E=>{let P=E==="Etkin";window.electronAPI.setAppPreference("discord_rpc",P)});e.appendChild(i),e.appendChild(_),e.appendChild(t),e.appendChild(d),e.appendChild(O());
            let r=document.createElement("div"),a=document.createElement("div");a.textContent="Kısayollar",a.style.fontSize="18px",a.style.fontWeight="bold",a.style.marginBottom="10px";
            let s=document.createElement("div");s.textContent="K\u0131sayollar, sohbet s\u0131ras\u0131nda yaz\u0131lan metni otomatik olarak geni\u015Fleterek s\u0131k kulland\u0131\u011F\u0131n\u0131z komutlar\u0131, mesajlar\u0131 veya emojileri yazman\u0131za olanak tan\u0131r.",s.style.fontSize="13px",s.style.marginBottom="10px",s.style.lineHeight="1.4",s.style.color="#ccc";
            let h=document.createElement("div");h.style.display="flex",h.style.justifyContent="space-between",h.style.gap="10px";
            let g=A("Yeni k\u0131sayol olu\u015Ftur","#244967","#3b5d82",()=>{R()}),y=A("K\u0131sayollar\u0131 g\xF6r\xFCnt\xFCle","#244967","#3b5d82",()=>{J()});h.appendChild(g),h.appendChild(y),r.appendChild(a),r.appendChild(s),r.appendChild(h),r.appendChild(O());
            let m=document.createElement("div"),v=document.createElement("div");v.textContent="Auth",v.style.fontSize="18px",v.style.fontWeight="bold",v.style.marginBottom="10px";
            let x=document.createElement("div");x.textContent="Oturum a\xE7ma bilgilerin genellikle oda y\xF6neticileri taraf\u0131ndan oturum a\xE7mak i\xE7in kullan\u0131l\u0131r. Burada mevcut oturum a\xE7ma bilgilerinizi g\xF6r\xFCnt\xFCleyebilir veya de\u011Fi\u015Ftirebilirsiniz, \xF6rne\u011Fin taray\u0131c\u0131n\u0131zda bulunan oda hesaplar\u0131n\u0131z\u0131 geri almak istedi\u011Finizde.",x.style.fontSize="13px",x.style.marginBottom="10px",x.style.lineHeight="1.4",x.style.color="#ccc";
            let u=document.createElement("div");u.style.display="flex",u.style.justifyContent="space-between",u.style.gap="10px";
            let l=A("Auth G\xF6r\xFCnt\xFCle","#244967","#3b5d82",()=>{let E=localStorage.getItem("player_auth_key"),P=E.split(".")[1];Y(P,E)}),p=A("Auth De\u011Fi\u015Ftir","#244967","#3b5d82",()=>{W()}),I=A("Auth SIf\u0131rla","#b2413b","#D04D46",()=>{G()});u.appendChild(l),u.appendChild(p),u.appendChild(I),m.appendChild(v),m.appendChild(x),m.appendChild(u),m.appendChild(O());
            
            // --- TEMA bölümü (Ayarlar içinde) ---
            let themeBlock = document.createElement("div");

            let themeTitle = document.createElement("div");
            themeTitle.textContent = "Tema & Arka Plan";
            themeTitle.style.fontSize = "18px";
            themeTitle.style.fontWeight = "bold";
            themeTitle.style.marginBottom = "10px";

            let themeDesc = document.createElement("div");
            themeDesc.textContent = "Uygulama ve oyun içi buton, çerçeve ve panellerin renklerini değiştirin. Ayrıca özel arka planınızı ayarlayabilirsiniz.";
            themeDesc.style.fontSize = "13px";
            themeDesc.style.marginBottom = "10px";
            themeDesc.style.lineHeight = "1.4";
            themeDesc.style.color = "#ccc";

            let themeRow = document.createElement("div");
            themeRow.style.display = "flex";
            themeRow.style.justifyContent = "space-between";
            themeRow.style.gap = "10px";

            // Temayı Aç: Ayarlar kapanır, Tema paneli açılır
            let themeOpenBtn = A("Temayı Aç", "#244967", "#3b5d82", () => {
            H();                          // ayarlar modalını kapat
            setTimeout(() => {
                (window.hxsOpenThemePanel || window.openThemePanel)?.();
            }, 350);
            });

            // Arka Plan: özel arka plan panelini aç
            let themeResetBtn = A("Arka Plan", "#244967", "#3b5d82", () => {
            try{ (window.hxsOpenBackgroundPanel || openBackgroundPanel)?.(); }catch(_){ }
            });

            themeRow.appendChild(themeOpenBtn);
            themeRow.appendChild(themeResetBtn);

            themeBlock.appendChild(themeTitle);
            themeBlock.appendChild(themeDesc);
            themeBlock.appendChild(themeRow);

            
            let z=document.createElement("div"),S=document.createElement("div");S.textContent="Yedekleme ve S\u0131f\u0131rlama",S.style.fontSize="18px",S.style.fontWeight="bold",S.style.marginBottom="10px";
            let w=document.createElement("div");w.textContent="Profil, k\u0131sayol ve notlar dahil olmak \xFCzere ayarlar\u0131n\u0131z\u0131n tam yede\u011Fini d\u0131\u015Fa aktarabilir veya geri y\xFCkleyebilirsiniz. Ya da uygulamay\u0131 tamamen s\u0131f\u0131rlayabilirsiniz.",w.style.fontSize="13px",w.style.marginBottom="10px",w.style.lineHeight="1.4",w.style.color="#ccc";
            let f=document.createElement("div");f.style.display="flex",f.style.justifyContent="space-between",f.style.gap="10px";
            let L=A("Yedeklemeyi D\u0131\u015Fa Aktar","#244967","#3b5d82",()=>{window.electronAPI.exportPreferencesFile().then(E=>{E.success&&(L.textContent="D\u0131\u015Fa Aktar\u0131ld\u0131!",setTimeout(()=>L.textContent="Yedeklemeyi D\u0131\u015Fa Aktar",2e3))})}),C=A("Yedeklemeyi Geri Y\xFCkle","#244967","#3b5d82",()=>{window.electronAPI.importPreferencesFile().then(E=>{E.success?(b("Yedekleme geri y\xFCklendi","Uygulama birka\xE7 saniye i\xE7inde yeniden ba\u015Flayacakt\u0131r (veya manuel olarak ba\u015Flat\u0131n)..",[]),M("default"),setTimeout(()=>window.electronAPI.restartApp(),4e3)):(C.textContent="Ge\xE7ersiz yedekleme!",C.disabled=!0,C.style.backgroundColor="#D04D46",setTimeout(()=>{C.textContent="Yedeklemeyi Geri Y\xFCkle",C.style.backgroundColor="#244967",C.disabled=!1},2e3))})}),T=A("Uygulamay\u0131 S\u0131f\u0131rla","#b2413b","#D04D46",()=>{de()});f.appendChild(L),f.appendChild(C),f.appendChild(T),z.appendChild(S),z.appendChild(w),z.appendChild(f);
            let k=document.createElement("div");k.appendChild(e),k.appendChild(r),k.appendChild(m),k.appendChild(themeBlock),k.appendChild(O()),k.appendChild(z),b("Ayarlar",k,[])};
            var ge=()=>{b("Hakkımızda",`Bu uygulama, <b>Hipnoz (dc: .lexa.)</b> tarafından HaxBall deneyimini geliştirip, orijinaline sadık kalacak şekilde geliştirilmiştir. (og client baz alınmıştır ve HaxScipt sunucusu adına düzenlenmiştir.)

        Benzer projelerden farklı olarak, açık kaynaklıdır ve herhangi bir kayıt olmaksızın indirilebilir.

        Bu uygulamayı yalnızca HaxScipt github ya da resmi web sitesinden indirdiğinizden emin olun:
        <a target="_blank" href=https://www.haxscipt.com>https://www.haxscipt.com</a>
        <a target="_blank" href=https://github.com/HaxScipt/haxscipt-client>https://github.com/HaxScipt/haxscipt-client</a>
        

        <b>Emeği Geçenler</b>
        \u2022 Hipnoz - Developer / Proje Yöneticisi
        \u2022 iam JV - Proje Yöneticisi
        \u2022 Muzlera - Tasarım

        <b>Resmi Discord sunucusuna katılın:</b>
        <a target="_blank" href=https://www.discord.gg/haxscipt/>https://www.discord.gg/haxscipt</a>

        
        <b>© HaxScipt Global League</b>
        \u2022 <a target="_blank" href=https://www.discord.gg/haxscipt>Discord</a>
        \u2022 <a target="_blank" href=https://www.haxscipt.com>Website</a>
        \u2022 <a target="_blank" href=https://www.youtube.com/@HaxScipt>YouTube</a>
        \u2022 <a target="_blank" href=https://www.instagram.com/haxscipt>Instagram</a>
        \u2022 <a target="_blank" href=https://www.tiktok.com/@haxsciptgl>TikTok</a>
        \u2022 <a target="_blank" href=https://kick.com/haxscipt>Kick</a>
        \u2022 <a target="_blank" href=https://www.twitch.tv/haxsciptgl>Twitch</a>
        \u2022 <a target="_blank" href=https://soundcloud.com/haxscipt>SoundCloud</a>
        `,[])},ce=()=>{let o=document.createElement("button");o.innerText="Website",o.onclick=()=>{window.open(j.website,"_blank")};
        let e=document.createElement("button");e.innerText="Discord",e.onclick=()=>{window.open(j.discord,"_blank")},b("Yardım",`Resmi web sitesini veya Discord sunucumuzu ziyaret edin.
        `,[o,e])},Q=()=>{let o=document.getElementsByClassName("center-container")[0];if(!o)return;o.innerHTML="";
        let e=document.createElement("input");e.type="text",e.placeholder="Oda bağlantısını girin",e.classList.add("address-bar-input"),e.style.backgroundColor="black",e.style.color="white",e.style.border="1px solid #444",e.style.borderRadius="6px",e.style.padding="2px 6px",e.style.width="200px",e.style.maxWidth="100%",e.style.boxSizing="border-box",e.style.fontSize="16px",e.style.outline="none",e.style.transition="width 0.4s ease, border-color 0.3s ease, box-shadow 0.3s ease",e.style.textAlign="center",e.addEventListener("focus",()=>{e.style.width="100%",e.style.border="2px solid #b3413b",e.style.boxShadow="0 0 6px rgba(179, 65, 59, 0.3)"}),e.addEventListener("blur",()=>{e.value===""&&(e.style.width="200px"),e.style.border="1px solid #444",e.style.boxShadow="none"}),e.addEventListener("input",()=>{let _=e.value.trim(),n=/^https:\/\/www\.haxball\.com\/play\?c=.{11}$/.test(_);_===""||n?e.style.color="white":e.style.color="rgba(179, 65, 59, 0.8)"});
        let i=document.createElement("style");i.innerHTML=`
        @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            50% { transform: translateX(4px); }
            75% { transform: translateX(-4px); }
            100% { transform: translateX(0); }
        }
        .shake {
            animation: shake 0.3s ease;
        }
    `,document.head.appendChild(i),o.appendChild(e),window.triggerInvalidInput=_=>{e.placeholder="Invalid room link!",e.value="";
        let n=document.createElement("style");n.textContent=`
			.address-bar-input::placeholder {
				color: rgba(179, 65, 59, 1) !important;
				opacity: 0.8;
			}
		`,document.head.appendChild(n),e.classList.add("shake"),setTimeout(()=>{e.placeholder="Oda bağlantısını girin",e.value=_,e.classList.remove("shake"),document.head.removeChild(n)},600)},e.addEventListener("keydown",_=>{if(_.key==="Enter"){_.preventDefault();
            let n=e.value.trim();/^https:\/\/www\.haxball\.com\/play\?c=.{11}$/.test(n)?(e.value="",e.placeholder="Joining room...",setTimeout(()=>{window.location.href=n},1e3)):window.triggerInvalidInput(n)}})},
            ee = async () => {
            let o = await B("body > div > div.flexCol.flexGrow > div", !1);
            if (!document.getElementById("font-awesome-4")) {
              let u = document.createElement("link");
              u.id = "font-awesome-4";
              u.rel = "stylesheet";
              u.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
              document.head.appendChild(u);
            }

            let e = document.getElementsByClassName("header")[0];
            e.innerHTML = "";
            e.style.display = "grid";
            e.style.gridTemplateColumns = "1fr 1fr 1fr";
            e.style.alignItems = "center";
            e.style.width = "100%";

            // === SOL KISIM ===
            let i = document.createElement("div");
            i.classList.add("left-container");
            i.style.display = "flex";
            i.style.alignItems = "center";
            i.style.justifyContent = "flex-start";

            let t = document.createElement("span");
            t.classList.add("title");
            let c = document.createElement("a");
            c.textContent = "HaxScipt Client v1";
            c.href = "";
            c.classList.add("hxs-no-theme");
            c.addEventListener("click", function (ev) {
              ev.preventDefault();
              try {
                const msg = document.createElement("div");
                msg.textContent = "Gerçekten ana menüye dönmek istiyor musun?";
                const cancel = document.createElement("button");
                cancel.textContent = "Vazgeç";
                cancel.className = "hxs-danger";
                cancel.addEventListener("click", ()=> { H(); });
                const ok = A("Ana menüye dön", "#244967", "#3b5d82", ()=> { window.location.href = "https://www.haxball.com/play"; });
                b("Ana Menü", msg, [ok, cancel]);
              } catch (e) { console.error("Failed to open main menu confirm:", e); }
            });
            t.appendChild(c);

            let d = document.createElement("a");
            d.textContent = "Hakkımızda";
            d.href = "";
            d.style.marginLeft = "15px";
            d.addEventListener("click", function (u) { u.preventDefault(), ge(); });

            let r = document.createElement("a");
            r.textContent = "Yardım";
            r.href = "";
            r.style.marginLeft = "15px";
            r.addEventListener("click", function (u) { u.preventDefault(), ce(); });

            let a = document.createElement("a");
            a.textContent = "Ayarlar";
            a.href = "";
            a.style.marginLeft = "15px";
            a.addEventListener("click", function (u) { u.preventDefault(), Z(); });

            // Linkle Bağlan (Ayarlar’ın sağında)
            let joinLink = document.createElement("a");
            joinLink.textContent = "Linkle Bağlan";
            joinLink.href = "";
            joinLink.style.marginLeft = "15px";
            joinLink.addEventListener("click", function (ev) {
              ev.preventDefault();
              openJoinRoomPanel();
            });

            i.appendChild(t);
            i.appendChild(d);
            i.appendChild(r);
            i.appendChild(a);
            i.appendChild(joinLink);

            // === ORTA KISIM ===
            let _ = document.createElement("div");
            _.classList.add("center-container");
            _.style.display = "flex";
            _.style.alignItems = "center";
            _.style.justifyContent = "center";

            // === SAĞ KISIM ===
            let n = document.createElement("div");
            n.classList.add("right-container");
            n.style.display = "flex";
            n.style.alignItems = "center";
            n.style.justifyContent = "flex-end";
            n.style.marginRight = "0";

            // HaxScipt Odaları (profilin soluna)
            let hr = document.createElement("a");
            hr.textContent = "HaxScipt Odaları";
            hr.href = "#";
            hr.style.marginRight = "15px";
            hr.addEventListener("click", function (u) {
              u.preventDefault();
              if (window.xe) window.xe();
            });
            n.appendChild(hr);

            // Profil adı
            let s = localStorage.getItem("current_profile") || "default";
            localStorage.setItem("current_profile", s);
            let g = (await window.electronAPI.getAppPreferences()).profiles.find(u => u.id === s),
                y = g !== void 0 ? g.name : "(unknown)";
            let m = document.createElement("span");
            m.classList.add("title");
            m.style.marginLeft = "15px";

            let v = document.createElement("a");
            v.href = "";
            v.innerHTML = `<i class="fa fa-user" aria-hidden="true"></i> ${y}`;
            v.classList.add("hxs-no-theme");
            m.appendChild(v);

            // Normal tık = profilleri yönet, SHIFT+tık = yeniden adlandır
            m.addEventListener("click", function (u) {
              u.preventDefault();
              if (u.shiftKey) { renameCurrentProfile(); } else { V(); }
            });

            // Kalem ikonu
            let edit = document.createElement("a");
            edit.href = "";
            edit.textContent = "✎";
            edit.classList.add("hxs-no-theme");
            edit.style.marginLeft = "8px";
            edit.addEventListener("click", function (u) { u.preventDefault(); renameCurrentProfile(); });
            m.appendChild(edit);

            n.appendChild(m);

            // === Header'a ekle ===
            e.appendChild(i);
            e.appendChild(_);
            e.appendChild(n);

            localStorage.setItem("header_visible", "true");
          };

            D=()=>{let o=document.getElementsByClassName("header")[0],e=document.getElementById("header-toggle-arrow");if(o.style.transition="height 0.3s",o.style.overflow="hidden",!(getComputedStyle(o).height!=="0px"))localStorage.setItem("header_visible","true"),o.style.height="35px",e&&e.remove();else if(localStorage.setItem("header_visible","false"),o.style.height="0px",!e){let _=document.createElement("div");_.id="header-toggle-arrow",_.innerHTML=`
                <i class="fa fa-arrow-circle-down" aria-hidden="true" style="margin-right: 5px;"></i> Menüyü Göster
            `,_.style.background="rgba(26, 33, 37, 0.063)",_.style.padding="6px 10px",_.style.borderRadius="6px",_.style.fontSize="15px",_.style.color="white",_.style.opacity="0.8",_.style.cursor="pointer",_.style.userSelect="none",_.style.position="fixed",_.style.top="5px",_.style.left="8px",_.style.zIndex="9999",_.addEventListener("mouseenter",()=>{_.style.opacity="1"}),_.addEventListener("mouseleave",()=>{_.style.opacity="0.8"}),_.addEventListener("click",D),setTimeout(()=>{document.body.appendChild(_)},300)}};
            // === Header Toggle: Menüyü Göster/Gizle (V2) ===
            (function(){
              // D: toggle header and update fixed control
              D = () => {
                const header = document.getElementsByClassName("header")[0];
                if(!header) return;
                header.style.transition = "height 0.3s";
                header.style.overflow = "hidden";

                // remove legacy arrow if exists
                const old = document.getElementById("header-toggle-arrow");
                try { old?.remove(); } catch(_) {}

                // ensure control exists
                let btn = document.getElementById("hxs-header-toggle");
                if(!btn){
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
                  btn.addEventListener("mouseenter", ()=> btn.style.opacity = "1");
                  btn.addEventListener("mouseleave", ()=> btn.style.opacity = "0.85");
                  btn.addEventListener("click", D);
                  document.body.appendChild(btn);
                }

                const visible = getComputedStyle(header).height !== "0px";
                if(visible){
                  // hide header
                  localStorage.setItem("header_visible","false");
                  header.style.height = "0px";
                  btn.innerHTML = '<i class="fa fa-arrow-circle-down" aria-hidden="true" style="margin-right: 5px;"></i> Menuyu Goster';
                  btn.style.top = "5px";
                } else {
                  // show header
                  localStorage.setItem("header_visible","true");
                  header.style.height = "35px";
                  btn.innerHTML = '<i class="fa fa-arrow-circle-up" aria-hidden="true" style="margin-right: 5px;"></i> Menuyu Gizle';
                  btn.style.top = "42px"; // slightly below header
                }
              };

              // initialize control once header exists
              setTimeout(()=>{
                try {
                  const header = document.getElementsByClassName("header")[0];
                  if(!header) return;
                  let btn = document.getElementById("hxs-header-toggle");
                  if(!btn){
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
                    btn.addEventListener("mouseenter", ()=> btn.style.opacity = "1");
                    btn.addEventListener("mouseleave", ()=> btn.style.opacity = "0.85");
                    btn.addEventListener("click", D);
                    document.body.appendChild(btn);
                  }
                  const visible = getComputedStyle(header).height !== "0px";
                  if(visible){
                    btn.innerHTML = '<i class="fa fa-arrow-circle-up" aria-hidden="true" style="margin-right: 5px;"></i> Menüyü Gizle';
                    btn.style.top = "42px";
                  } else {
                    btn.innerHTML = '<i class="fa fa-arrow-circle-down" aria-hidden="true" style="margin-right: 5px;"></i> Menüyü Göster';
                    btn.style.top = "5px";
                  }
                } catch(_) {}
              }, 900);
            })();

                var ne=async()=>{await K(),await ee()};
                var ue=o=>{let e=document.createElement("button");e.innerText="Şimdi İndir",e.onclick=()=>{console.log("Download clicked"),window.location.href=o.url.standard,H()},b(`Changelog ${o.version} (${o.date})`,o.notes,[e])};
                function he(){return navigator.userAgent.indexOf("Windows")!==-1?"win":navigator.userAgent.indexOf("Macintosh")!==-1?"macOS":"linux"}
                async function ke(){let e=await(await fetch(j.releases,{method:"GET",headers:{Accept:"application/vnd.github.v3+json"}})).json(),i=e[0].assets.filter(n=>n.name.indexOf(he())!==-1).map(n=>n.browser_download_url);return{version:e[0].tag_name,url:{standard:i.find(n=>n.indexOf("Lite")===-1),lite:i.find(n=>n.indexOf("Lite")!==-1)},notes:e[0].body,date:e[0].published_at.substr(0,10)}}
                async function _e(){let o=await ke(),e=`v${await window.electronAPI.getAppVersion()}`;if(o.version!==e){let i=document.getElementsByClassName("right-container")[0];if(!i.querySelector(".new-update-header-link")){let _=document.createElement("a");_.textContent="\u{1F525} Yeni Güncelleme Mevcut!",_.href="",_.classList.add("new-update-header-link"),_.addEventListener("click",function(n){n.preventDefault(),ue(o)}),i.insertBefore(_,i.firstChild)}}}var te=()=>{let o=document.getElementsByClassName("gameframe")[0],e=o.contentDocument?.getElementsByClassName("splitter")[0];if(!e)return;
                let i=e.getElementsByClassName("buttons")[0],_=o.contentDocument?.createElement("button");_.id="addfav-btn",_.innerHTML='<i class="icon-star"></i><div>Add Room</div>',i.insertBefore(_,i.childNodes[3]);
                let n=o.contentDocument?.createElement("button");n.id="showfav-btn",n.innerHTML='<i class="icon-star"></i><div>Show Rooms</div>',i.insertBefore(n,i.childNodes[4]);
                const SHOWFAV_KEY="hxs_showfav";
                let t=(localStorage.getItem(SHOWFAV_KEY)==="1");
                const getRows=()=>o.contentDocument?.getElementsByClassName("list")[0]?.querySelector('[data-hook="list"]')?.querySelectorAll("tr");
                const applyFavFilter=u=>{let r=getRows(),a=JSON.parse(localStorage.getItem("fav_rooms")||"[]");if(!r)return;u?(r.forEach(s=>{let h=s.querySelector('[data-hook="name"]')?.innerHTML;h&&!a.includes(h)&&(s.style.display="none")}),n.innerHTML='<i class="icon-star"></i><div>Show All</div>'):(r.forEach(s=>{s.style.display=""}),n.innerHTML='<i class="icon-star"></i><div>Show Rooms</div>')};
                _.addEventListener("click",()=>{let d=e.getElementsByClassName("selected")[0];if(!d)return;let r=d.querySelector('[data-hook="name"]')?.innerHTML;if(!r)return;let a=JSON.parse(localStorage.getItem("fav_rooms")||"[]");a.includes(r)?a=a.filter(s=>s!==r):a.push(r),a.length!==0?localStorage.setItem("fav_rooms",JSON.stringify(a)):localStorage.setItem("fav_rooms","[]"),oe(_,e)});
                n.addEventListener("click",()=>{t=!t,localStorage.setItem(SHOWFAV_KEY,t?"1":"0"),applyFavFilter(t)});
                // İlk durum: kayıttan geri yükle ve uygula
                try{applyFavFilter(t)}catch(_){}
                // Liste güncellenince (refresh dâhil) aktifse filtreyi tekrar uygula
                try{let listRoot=o.contentDocument?.getElementsByClassName("list")[0]?.querySelector('[data-hook="list"]');if(listRoot){let obs=new MutationObserver(()=>{if(t)try{applyFavFilter(!0)}catch(_){}});obs.observe(listRoot,{childList:!0,subtree:!0})}}catch(_){}
                e.addEventListener("click",function(){let d=e.querySelector("#addfav-btn");d&&oe(d,e)});
                let c=o.contentDocument?.querySelector('[data-hook="refresh"]');c&&c.addEventListener("click",()=>{setTimeout(()=>{try{applyFavFilter(t)}catch(_){}} ,600)})};
                function oe(o,e){let i=e.getElementsByClassName("selected")[0];if(!i)return;
                let _=i.querySelector('[data-hook="name"]')?.innerHTML;if(!_)return;
                let n=JSON.parse(localStorage.getItem("fav_rooms")||"[]");o.innerHTML=n.includes(_)?'<i class="icon-star"></i><div>Del Room</div>':'<i class="icon-star"></i><div>Add Room</div>'}
                var ie={":grinning:":"\u{1F600}",":smiley:":"\u{1F603}",":smile:":"\u{1F604}",":grin:":"\u{1F601}",":laughing:":"\u{1F606}",":satisfied:":"\u{1F606}",":sweat_smile:":"\u{1F605}",":joy:":"\u{1F602}",":rofl:":"\u{1F923}",":rolling_on_the_floor_laughing:":"\u{1F923}",":relaxed:":"\u263A\uFE0F",":blush:":"\u{1F60A}",":innocent:":"\u{1F607}",":slight_smile:":"\u{1F642}",":slightly_smiling_face:":"\u{1F642}",":upside_down:":"\u{1F643}",":upside_down_face:":"\u{1F643}",":wink:":"\u{1F609}",":relieved:":"\u{1F60C}",":smiling_face_with_tear:":"\u{1F972}",":heart_eyes:":"\u{1F60D}",":smiling_face_with_3_hearts:":"\u{1F970}",":kissing_heart:":"\u{1F618}",":kissing:":"\u{1F617}",":kissing_smiling_eyes:":"\u{1F619}",":kissing_closed_eyes:":"\u{1F61A}",":yum:":"\u{1F60B}",":stuck_out_tongue:":"\u{1F61B}",":stuck_out_tongue_closed_eyes:":"\u{1F61D}",":stuck_out_tongue_winking_eye:":"\u{1F61C}",":zany_face:":"\u{1F92A}",":face_with_raised_eyebrow:":"\u{1F928}",":face_with_monocle:":"\u{1F9D0}",":nerd:":"\u{1F913}",":nerd_face:":"\u{1F913}",":sunglasses:":"\u{1F60E}",":star_struck:":"\u{1F929}",":partying_face:":"\u{1F973}",":smirk:":"\u{1F60F}",":unamused:":"\u{1F612}",":disappointed:":"\u{1F61E}",":pensive:":"\u{1F614}",":worried:":"\u{1F61F}",":confused:":"\u{1F615}",":slight_frown:":"\u{1F641}",":slightly_frowning_face:":"\u{1F641}",":frowning2:":"\u2639\uFE0F",":white_frowning_face:":"\u2639\uFE0F",":persevere:":"\u{1F623}",":confounded:":"\u{1F616}",":tired_face:":"\u{1F62B}",":weary:":"\u{1F629}",":pleading_face:":"\u{1F97A}",":cry:":"\u{1F622}",":sob:":"\u{1F62D}",":triumph:":"\u{1F624}",":angry:":"\u{1F620}",":rage:":"\u{1F621}",":face_with_symbols_over_mouth:":"\u{1F92C}",":exploding_head:":"\u{1F92F}",":flushed:":"\u{1F633}",":hot_face:":"\u{1F975}",":cold_face:":"\u{1F976}",":scream:":"\u{1F631}",":fearful:":"\u{1F628}",":cold_sweat:":"\u{1F630}",":disappointed_relieved:":"\u{1F625}",":sweat:":"\u{1F613}",":hugging:":"\u{1F917}",":hugging_face:":"\u{1F917}",":thinking:":"\u{1F914}",":thinking_face:":"\u{1F914}",":face_with_hand_over_mouth:":"\u{1F92D}",":yawning_face:":"\u{1F971}",":shushing_face:":"\u{1F92B}",":lying_face:":"\u{1F925}",":liar:":"\u{1F925}",":no_mouth:":"\u{1F636}",":neutral_face:":"\u{1F610}",":expressionless:":"\u{1F611}",":grimacing:":"\u{1F62C}",":rolling_eyes:":"\u{1F644}",":face_with_rolling_eyes:":"\u{1F644}",":hushed:":"\u{1F62F}",":frowning:":"\u{1F626}",":anguished:":"\u{1F627}",":open_mouth:":"\u{1F62E}",":astonished:":"\u{1F632}",":sleeping:":"\u{1F634}",":drooling_face:":"\u{1F924}",":drool:":"\u{1F924}",":sleepy:":"\u{1F62A}",":dizzy_face:":"\u{1F635}",":zipper_mouth:":"\u{1F910}",":zipper_mouth_face:":"\u{1F910}",":woozy_face:":"\u{1F974}",":nauseated_face:":"\u{1F922}",":sick:":"\u{1F922}",":face_vomiting:":"\u{1F92E}",":sneezing_face:":"\u{1F927}",":sneeze:":"\u{1F927}",":mask:":"\u{1F637}",":thermometer_face:":"\u{1F912}",":face_with_thermometer:":"\u{1F912}",":head_bandage:":"\u{1F915}",":face_with_head_bandage:":"\u{1F915}",":money_mouth:":"\u{1F911}",":money_mouth_face:":"\u{1F911}",":cowboy:":"\u{1F920}",":face_with_cowboy_hat:":"\u{1F920}",":disguised_face:":"\u{1F978}",":smiling_imp:":"\u{1F608}",":imp:":"\u{1F47F}",":japanese_ogre:":"\u{1F479}",":japanese_goblin:":"\u{1F47A}",":clown:":"\u{1F921}",":clown_face:":"\u{1F921}",":poop:":"\u{1F4A9}",":shit:":"\u{1F4A9}",":hankey:":"\u{1F4A9}",":poo:":"\u{1F4A9}",":ghost:":"\u{1F47B}",":skull:":"\u{1F480}",":skeleton:":"\u{1F480}",":skull_crossbones:":"\u2620\uFE0F",":skull_and_crossbones:":"\u2620\uFE0F",":alien:":"\u{1F47D}",":space_invader:":"\u{1F47E}",":robot:":"\u{1F916}",":robot_face:":"\u{1F916}",":jack_o_lantern:":"\u{1F383}",":smiley_cat:":"\u{1F63A}",":smile_cat:":"\u{1F638}",":joy_cat:":"\u{1F639}",":heart_eyes_cat:":"\u{1F63B}",":smirk_cat:":"\u{1F63C}",":kissing_cat:":"\u{1F63D}",":scream_cat:":"\u{1F640}",":crying_cat_face:":"\u{1F63F}",":pouting_cat:":"\u{1F63E}",":palms_up_together:":"\u{1F932}",":palms_up_together_tone1:":"\u{1F932}\u{1F3FB}",":palms_up_together_light_skin_tone:":"\u{1F932}\u{1F3FB}",":palms_up_together_tone2:":"\u{1F932}\u{1F3FC}",":palms_up_together_medium_light_skin_tone:":"\u{1F932}\u{1F3FC}",":palms_up_together_tone3:":"\u{1F932}\u{1F3FD}",":palms_up_together_medium_skin_tone:":"\u{1F932}\u{1F3FD}",":palms_up_together_tone4:":"\u{1F932}\u{1F3FE}",":palms_up_together_medium_dark_skin_tone:":"\u{1F932}\u{1F3FE}",":palms_up_together_tone5:":"\u{1F932}\u{1F3FF}",":palms_up_together_dark_skin_tone:":"\u{1F932}\u{1F3FF}",":open_hands:":"\u{1F450}",":open_hands_tone1:":"\u{1F450}\u{1F3FB}",":open_hands_tone2:":"\u{1F450}\u{1F3FC}",":open_hands_tone3:":"\u{1F450}\u{1F3FD}",":open_hands_tone4:":"\u{1F450}\u{1F3FE}",":open_hands_tone5:":"\u{1F450}\u{1F3FF}",":raised_hands:":"\u{1F64C}",":raised_hands_tone1:":"\u{1F64C}\u{1F3FB}",":raised_hands_tone2:":"\u{1F64C}\u{1F3FC}",":raised_hands_tone3:":"\u{1F64C}\u{1F3FD}",":raised_hands_tone4:":"\u{1F64C}\u{1F3FE}",":raised_hands_tone5:":"\u{1F64C}\u{1F3FF}",":clap:":"\u{1F44F}",":clap_tone1:":"\u{1F44F}\u{1F3FB}",":clap_tone2:":"\u{1F44F}\u{1F3FC}",":clap_tone3:":"\u{1F44F}\u{1F3FD}",":clap_tone4:":"\u{1F44F}\u{1F3FE}",":clap_tone5:":"\u{1F44F}\u{1F3FF}",":handshake:":"\u{1F91D}",":shaking_hands:":"\u{1F91D}",":thumbsup:":"\u{1F44D}",":+1:":"\u{1F44D}",":thumbup:":"\u{1F44D}",":thumbsup_tone1:":"\u{1F44D}\u{1F3FB}",":+1_tone1:":"\u{1F44D}\u{1F3FB}",":thumbup_tone1:":"\u{1F44D}\u{1F3FB}",":thumbsup_tone2:":"\u{1F44D}\u{1F3FC}",":+1_tone2:":"\u{1F44D}\u{1F3FC}",":thumbup_tone2:":"\u{1F44D}\u{1F3FC}",":thumbsup_tone3:":"\u{1F44D}\u{1F3FD}",":+1_tone3:":"\u{1F44D}\u{1F3FD}",":thumbup_tone3:":"\u{1F44D}\u{1F3FD}",":thumbsup_tone4:":"\u{1F44D}\u{1F3FE}",":+1_tone4:":"\u{1F44D}\u{1F3FE}",":thumbup_tone4:":"\u{1F44D}\u{1F3FE}",":thumbsup_tone5:":"\u{1F44D}\u{1F3FF}",":+1_tone5:":"\u{1F44D}\u{1F3FF}",":thumbup_tone5:":"\u{1F44D}\u{1F3FF}",":thumbsdown:":"\u{1F44E}",":-1:":"\u{1F44E}",":thumbdown:":"\u{1F44E}",":thumbsdown_tone1:":"\u{1F44E}\u{1F3FB}",":_1_tone1:":"\u{1F44E}\u{1F3FB}",":thumbdown_tone1:":"\u{1F44E}\u{1F3FB}",":thumbsdown_tone2:":"\u{1F44E}\u{1F3FC}",":_1_tone2:":"\u{1F44E}\u{1F3FC}",":thumbdown_tone2:":"\u{1F44E}\u{1F3FC}",":thumbsdown_tone3:":"\u{1F44E}\u{1F3FD}",":_1_tone3:":"\u{1F44E}\u{1F3FD}",":thumbdown_tone3:":"\u{1F44E}\u{1F3FD}",":thumbsdown_tone4:":"\u{1F44E}\u{1F3FE}",":_1_tone4:":"\u{1F44E}\u{1F3FE}",":thumbdown_tone4:":"\u{1F44E}\u{1F3FE}",":thumbsdown_tone5:":"\u{1F44E}\u{1F3FF}",":_1_tone5:":"\u{1F44E}\u{1F3FF}",":thumbdown_tone5:":"\u{1F44E}\u{1F3FF}",":punch:":"\u{1F44A}",":punch_tone1:":"\u{1F44A}\u{1F3FB}",":punch_tone2:":"\u{1F44A}\u{1F3FC}",":punch_tone3:":"\u{1F44A}\u{1F3FD}",":punch_tone4:":"\u{1F44A}\u{1F3FE}",":punch_tone5:":"\u{1F44A}\u{1F3FF}",":fist:":"\u270A",":fist_tone1:":"\u270A\u{1F3FB}",":fist_tone2:":"\u270A\u{1F3FC}",":fist_tone3:":"\u270A\u{1F3FD}",":fist_tone4:":"\u270A\u{1F3FE}",":fist_tone5:":"\u270A\u{1F3FF}",":left_facing_fist:":"\u{1F91B}",":left_fist:":"\u{1F91B}",":left_facing_fist_tone1:":"\u{1F91B}\u{1F3FB}",":left_fist_tone1:":"\u{1F91B}\u{1F3FB}",":left_facing_fist_tone2:":"\u{1F91B}\u{1F3FC}",":left_fist_tone2:":"\u{1F91B}\u{1F3FC}",":left_facing_fist_tone3:":"\u{1F91B}\u{1F3FD}",":left_fist_tone3:":"\u{1F91B}\u{1F3FD}",":left_facing_fist_tone4:":"\u{1F91B}\u{1F3FE}",":left_fist_tone4:":"\u{1F91B}\u{1F3FE}",":left_facing_fist_tone5:":"\u{1F91B}\u{1F3FF}",":left_fist_tone5:":"\u{1F91B}\u{1F3FF}",":right_facing_fist:":"\u{1F91C}",":right_fist:":"\u{1F91C}",":right_facing_fist_tone1:":"\u{1F91C}\u{1F3FB}",":right_fist_tone1:":"\u{1F91C}\u{1F3FB}",":right_facing_fist_tone2:":"\u{1F91C}\u{1F3FC}",":right_fist_tone2:":"\u{1F91C}\u{1F3FC}",":right_facing_fist_tone3:":"\u{1F91C}\u{1F3FD}",":right_fist_tone3:":"\u{1F91C}\u{1F3FD}",":right_facing_fist_tone4:":"\u{1F91C}\u{1F3FE}",":right_fist_tone4:":"\u{1F91C}\u{1F3FE}",":right_facing_fist_tone5:":"\u{1F91C}\u{1F3FF}",":right_fist_tone5:":"\u{1F91C}\u{1F3FF}",":fingers_crossed:":"\u{1F91E}",":hand_with_index_and_middle_finger_crossed:":"\u{1F91E}",":fingers_crossed_tone1:":"\u{1F91E}\u{1F3FB}",":hand_with_index_and_middle_fingers_crossed_tone1:":"\u{1F91E}\u{1F3FB}",":fingers_crossed_tone2:":"\u{1F91E}\u{1F3FC}",":hand_with_index_and_middle_fingers_crossed_tone2:":"\u{1F91E}\u{1F3FC}",":fingers_crossed_tone3:":"\u{1F91E}\u{1F3FD}",":hand_with_index_and_middle_fingers_crossed_tone3:":"\u{1F91E}\u{1F3FD}",":fingers_crossed_tone4:":"\u{1F91E}\u{1F3FE}",":hand_with_index_and_middle_fingers_crossed_tone4:":"\u{1F91E}\u{1F3FE}",":fingers_crossed_tone5:":"\u{1F91E}\u{1F3FF}",":hand_with_index_and_middle_fingers_crossed_tone5:":"\u{1F91E}\u{1F3FF}",":v:":"\u270C\uFE0F",":v_tone1:":"\u270C\u{1F3FB}",":v_tone2:":"\u270C\u{1F3FC}",":v_tone3:":"\u270C\u{1F3FD}",":v_tone4:":"\u270C\u{1F3FE}",":v_tone5:":"\u270C\u{1F3FF}",":love_you_gesture:":"\u{1F91F}",":love_you_gesture_tone1:":"\u{1F91F}\u{1F3FB}",":love_you_gesture_light_skin_tone:":"\u{1F91F}\u{1F3FB}",":love_you_gesture_tone2:":"\u{1F91F}\u{1F3FC}",":love_you_gesture_medium_light_skin_tone:":"\u{1F91F}\u{1F3FC}",":love_you_gesture_tone3:":"\u{1F91F}\u{1F3FD}",":love_you_gesture_medium_skin_tone:":"\u{1F91F}\u{1F3FD}",":love_you_gesture_tone4:":"\u{1F91F}\u{1F3FE}",":love_you_gesture_medium_dark_skin_tone:":"\u{1F91F}\u{1F3FE}",":love_you_gesture_tone5:":"\u{1F91F}\u{1F3FF}",":love_you_gesture_dark_skin_tone:":"\u{1F91F}\u{1F3FF}",":metal:":"\u{1F918}",":sign_of_the_horns:":"\u{1F918}",":metal_tone1:":"\u{1F918}\u{1F3FB}",":sign_of_the_horns_tone1:":"\u{1F918}\u{1F3FB}",":metal_tone2:":"\u{1F918}\u{1F3FC}",":sign_of_the_horns_tone2:":"\u{1F918}\u{1F3FC}",":metal_tone3:":"\u{1F918}\u{1F3FD}",":sign_of_the_horns_tone3:":"\u{1F918}\u{1F3FD}",":metal_tone4:":"\u{1F918}\u{1F3FE}",":sign_of_the_horns_tone4:":"\u{1F918}\u{1F3FE}",":metal_tone5:":"\u{1F918}\u{1F3FF}",":sign_of_the_horns_tone5:":"\u{1F918}\u{1F3FF}",":ok_hand:":"\u{1F44C}",":ok_hand_tone1:":"\u{1F44C}\u{1F3FB}",":ok_hand_tone2:":"\u{1F44C}\u{1F3FC}",":ok_hand_tone3:":"\u{1F44C}\u{1F3FD}",":ok_hand_tone4:":"\u{1F44C}\u{1F3FE}",":ok_hand_tone5:":"\u{1F44C}\u{1F3FF}",":pinching_hand:":"\u{1F90F}",":pinching_hand_tone1:":"\u{1F90F}\u{1F3FB}",":pinching_hand_light_skin_tone:":"\u{1F90F}\u{1F3FB}",":pinching_hand_tone2:":"\u{1F90F}\u{1F3FC}",":pinching_hand_medium_light_skin_tone:":"\u{1F90F}\u{1F3FC}",":pinching_hand_tone3:":"\u{1F90F}\u{1F3FD}",":pinching_hand_medium_skin_tone:":"\u{1F90F}\u{1F3FD}",":pinching_hand_tone4:":"\u{1F90F}\u{1F3FE}",":pinching_hand_medium_dark_skin_tone:":"\u{1F90F}\u{1F3FE}",":pinching_hand_tone5:":"\u{1F90F}\u{1F3FF}",":pinching_hand_dark_skin_tone:":"\u{1F90F}\u{1F3FF}",":pinched_fingers:":"\u{1F90C}",":pinched_fingers_tone2:":"\u{1F90C}\u{1F3FC}",":pinched_fingers_medium_light_skin_tone:":"\u{1F90C}\u{1F3FC}",":pinched_fingers_tone1:":"\u{1F90C}\u{1F3FB}",":pinched_fingers_light_skin_tone:":"\u{1F90C}\u{1F3FB}",":pinched_fingers_tone3:":"\u{1F90C}\u{1F3FD}",":pinched_fingers_medium_skin_tone:":"\u{1F90C}\u{1F3FD}",":pinched_fingers_tone4:":"\u{1F90C}\u{1F3FE}",":pinched_fingers_medium_dark_skin_tone:":"\u{1F90C}\u{1F3FE}",":pinched_fingers_tone5:":"\u{1F90C}\u{1F3FF}",":pinched_fingers_dark_skin_tone:":"\u{1F90C}\u{1F3FF}",":point_left:":"\u{1F448}",":point_left_tone1:":"\u{1F448}\u{1F3FB}",":point_left_tone2:":"\u{1F448}\u{1F3FC}",":point_left_tone3:":"\u{1F448}\u{1F3FD}",":point_left_tone4:":"\u{1F448}\u{1F3FE}",":point_left_tone5:":"\u{1F448}\u{1F3FF}",":point_right:":"\u{1F449}",":point_right_tone1:":"\u{1F449}\u{1F3FB}",":point_right_tone2:":"\u{1F449}\u{1F3FC}",":point_right_tone3:":"\u{1F449}\u{1F3FD}",":point_right_tone4:":"\u{1F449}\u{1F3FE}",":point_right_tone5:":"\u{1F449}\u{1F3FF}",":point_up_2:":"\u{1F446}",":point_up_2_tone1:":"\u{1F446}\u{1F3FB}",":point_up_2_tone2:":"\u{1F446}\u{1F3FC}",":point_up_2_tone3:":"\u{1F446}\u{1F3FD}",":point_up_2_tone4:":"\u{1F446}\u{1F3FE}",":point_up_2_tone5:":"\u{1F446}\u{1F3FF}",":point_down:":"\u{1F447}",":point_down_tone1:":"\u{1F447}\u{1F3FB}",":point_down_tone2:":"\u{1F447}\u{1F3FC}",":point_down_tone3:":"\u{1F447}\u{1F3FD}",":point_down_tone4:":"\u{1F447}\u{1F3FE}",":point_down_tone5:":"\u{1F447}\u{1F3FF}",":point_up:":"\u261D\uFE0F",":point_up_tone1:":"\u261D\u{1F3FB}",":point_up_tone2:":"\u261D\u{1F3FC}",":point_up_tone3:":"\u261D\u{1F3FD}",":point_up_tone4:":"\u261D\u{1F3FE}",":point_up_tone5:":"\u261D\u{1F3FF}",":raised_hand:":"\u270B",":raised_hand_tone1:":"\u270B\u{1F3FB}",":raised_hand_tone2:":"\u270B\u{1F3FC}",":raised_hand_tone3:":"\u270B\u{1F3FD}",":raised_hand_tone4:":"\u270B\u{1F3FE}",":raised_hand_tone5:":"\u270B\u{1F3FF}",":raised_back_of_hand:":"\u{1F91A}",":back_of_hand:":"\u{1F91A}",":raised_back_of_hand_tone1:":"\u{1F91A}\u{1F3FB}",":back_of_hand_tone1:":"\u{1F91A}\u{1F3FB}",":raised_back_of_hand_tone2:":"\u{1F91A}\u{1F3FC}",":back_of_hand_tone2:":"\u{1F91A}\u{1F3FC}",":raised_back_of_hand_tone3:":"\u{1F91A}\u{1F3FD}",":back_of_hand_tone3:":"\u{1F91A}\u{1F3FD}",":raised_back_of_hand_tone4:":"\u{1F91A}\u{1F3FE}",":back_of_hand_tone4:":"\u{1F91A}\u{1F3FE}",":raised_back_of_hand_tone5:":"\u{1F91A}\u{1F3FF}",":back_of_hand_tone5:":"\u{1F91A}\u{1F3FF}",":hand_splayed:":"\u{1F590}\uFE0F",":raised_hand_with_fingers_splayed:":"\u{1F590}\uFE0F",":hand_splayed_tone1:":"\u{1F590}\u{1F3FB}",":raised_hand_with_fingers_splayed_tone1:":"\u{1F590}\u{1F3FB}",":hand_splayed_tone2:":"\u{1F590}\u{1F3FC}",":raised_hand_with_fingers_splayed_tone2:":"\u{1F590}\u{1F3FC}",":hand_splayed_tone3:":"\u{1F590}\u{1F3FD}",":raised_hand_with_fingers_splayed_tone3:":"\u{1F590}\u{1F3FD}",":hand_splayed_tone4:":"\u{1F590}\u{1F3FE}",":raised_hand_with_fingers_splayed_tone4:":"\u{1F590}\u{1F3FE}",":hand_splayed_tone5:":"\u{1F590}\u{1F3FF}",":raised_hand_with_fingers_splayed_tone5:":"\u{1F590}\u{1F3FF}",":vulcan:":"\u{1F596}",":raised_hand_with_part_between_middle_and_ring_fingers:":"\u{1F596}",":vulcan_tone1:":"\u{1F596}\u{1F3FB}",":raised_hand_with_part_between_middle_and_ring_fingers_tone1:":"\u{1F596}\u{1F3FB}",":vulcan_tone2:":"\u{1F596}\u{1F3FC}",":raised_hand_with_part_between_middle_and_ring_fingers_tone2:":"\u{1F596}\u{1F3FC}",":vulcan_tone3:":"\u{1F596}\u{1F3FD}",":raised_hand_with_part_between_middle_and_ring_fingers_tone3:":"\u{1F596}\u{1F3FD}",":vulcan_tone4:":"\u{1F596}\u{1F3FE}",":raised_hand_with_part_between_middle_and_ring_fingers_tone4:":"\u{1F596}\u{1F3FE}",":vulcan_tone5:":"\u{1F596}\u{1F3FF}",":raised_hand_with_part_between_middle_and_ring_fingers_tone5:":"\u{1F596}\u{1F3FF}",":wave:":"\u{1F44B}",":wave_tone1:":"\u{1F44B}\u{1F3FB}",":wave_tone2:":"\u{1F44B}\u{1F3FC}",":wave_tone3:":"\u{1F44B}\u{1F3FD}",":wave_tone4:":"\u{1F44B}\u{1F3FE}",":wave_tone5:":"\u{1F44B}\u{1F3FF}",":call_me:":"\u{1F919}",":call_me_hand:":"\u{1F919}",":call_me_tone1:":"\u{1F919}\u{1F3FB}",":call_me_hand_tone1:":"\u{1F919}\u{1F3FB}",":call_me_tone2:":"\u{1F919}\u{1F3FC}",":call_me_hand_tone2:":"\u{1F919}\u{1F3FC}",":call_me_tone3:":"\u{1F919}\u{1F3FD}",":call_me_hand_tone3:":"\u{1F919}\u{1F3FD}",":call_me_tone4:":"\u{1F919}\u{1F3FE}",":call_me_hand_tone4:":"\u{1F919}\u{1F3FE}",":call_me_tone5:":"\u{1F919}\u{1F3FF}",":call_me_hand_tone5:":"\u{1F919}\u{1F3FF}",":muscle:":"\u{1F4AA}",":muscle_tone1:":"\u{1F4AA}\u{1F3FB}",":muscle_tone2:":"\u{1F4AA}\u{1F3FC}",":muscle_tone3:":"\u{1F4AA}\u{1F3FD}",":muscle_tone4:":"\u{1F4AA}\u{1F3FE}",":muscle_tone5:":"\u{1F4AA}\u{1F3FF}",":mechanical_arm:":"\u{1F9BE}",":middle_finger:":"\u{1F595}",":reversed_hand_with_middle_finger_extended:":"\u{1F595}",":middle_finger_tone1:":"\u{1F595}\u{1F3FB}",":reversed_hand_with_middle_finger_extended_tone1:":"\u{1F595}\u{1F3FB}",":middle_finger_tone2:":"\u{1F595}\u{1F3FC}",":reversed_hand_with_middle_finger_extended_tone2:":"\u{1F595}\u{1F3FC}",":middle_finger_tone3:":"\u{1F595}\u{1F3FD}",":reversed_hand_with_middle_finger_extended_tone3:":"\u{1F595}\u{1F3FD}",":middle_finger_tone4:":"\u{1F595}\u{1F3FE}",":reversed_hand_with_middle_finger_extended_tone4:":"\u{1F595}\u{1F3FE}",":middle_finger_tone5:":"\u{1F595}\u{1F3FF}",":reversed_hand_with_middle_finger_extended_tone5:":"\u{1F595}\u{1F3FF}",":writing_hand:":"\u270D\uFE0F",":writing_hand_tone1:":"\u270D\u{1F3FB}",":writing_hand_tone2:":"\u270D\u{1F3FC}",":writing_hand_tone3:":"\u270D\u{1F3FD}",":writing_hand_tone4:":"\u270D\u{1F3FE}",":writing_hand_tone5:":"\u270D\u{1F3FF}",":pray:":"\u{1F64F}",":pray_tone1:":"\u{1F64F}\u{1F3FB}",":pray_tone2:":"\u{1F64F}\u{1F3FC}",":pray_tone3:":"\u{1F64F}\u{1F3FD}",":pray_tone4:":"\u{1F64F}\u{1F3FE}",":pray_tone5:":"\u{1F64F}\u{1F3FF}",":foot:":"\u{1F9B6}",":foot_tone1:":"\u{1F9B6}\u{1F3FB}",":foot_light_skin_tone:":"\u{1F9B6}\u{1F3FB}",":foot_tone2:":"\u{1F9B6}\u{1F3FC}",":foot_medium_light_skin_tone:":"\u{1F9B6}\u{1F3FC}",":foot_tone3:":"\u{1F9B6}\u{1F3FD}",":foot_medium_skin_tone:":"\u{1F9B6}\u{1F3FD}",":foot_tone4:":"\u{1F9B6}\u{1F3FE}",":foot_medium_dark_skin_tone:":"\u{1F9B6}\u{1F3FE}",":foot_tone5:":"\u{1F9B6}\u{1F3FF}",":foot_dark_skin_tone:":"\u{1F9B6}\u{1F3FF}",":leg:":"\u{1F9B5}",":leg_tone1:":"\u{1F9B5}\u{1F3FB}",":leg_light_skin_tone:":"\u{1F9B5}\u{1F3FB}",":leg_tone2:":"\u{1F9B5}\u{1F3FC}",":leg_medium_light_skin_tone:":"\u{1F9B5}\u{1F3FC}",":leg_tone3:":"\u{1F9B5}\u{1F3FD}",":leg_medium_skin_tone:":"\u{1F9B5}\u{1F3FD}",":leg_tone4:":"\u{1F9B5}\u{1F3FE}",":leg_medium_dark_skin_tone:":"\u{1F9B5}\u{1F3FE}",":leg_tone5:":"\u{1F9B5}\u{1F3FF}",":leg_dark_skin_tone:":"\u{1F9B5}\u{1F3FF}",":mechanical_leg:":"\u{1F9BF}",":lipstick:":"\u{1F484}",":kiss:":"\u{1F48B}",":lips:":"\u{1F444}",":tooth:":"\u{1F9B7}",":bone:":"\u{1F9B4}",":tongue:":"\u{1F445}",":ear:":"\u{1F442}",":ear_tone1:":"\u{1F442}\u{1F3FB}",":ear_tone2:":"\u{1F442}\u{1F3FC}",":ear_tone3:":"\u{1F442}\u{1F3FD}",":ear_tone4:":"\u{1F442}\u{1F3FE}",":ear_tone5:":"\u{1F442}\u{1F3FF}",":ear_with_hearing_aid:":"\u{1F9BB}",":ear_with_hearing_aid_tone1:":"\u{1F9BB}\u{1F3FB}",":ear_with_hearing_aid_light_skin_tone:":"\u{1F9BB}\u{1F3FB}",":ear_with_hearing_aid_tone2:":"\u{1F9BB}\u{1F3FC}",":ear_with_hearing_aid_medium_light_skin_tone:":"\u{1F9BB}\u{1F3FC}",":ear_with_hearing_aid_tone3:":"\u{1F9BB}\u{1F3FD}",":ear_with_hearing_aid_medium_skin_tone:":"\u{1F9BB}\u{1F3FD}",":ear_with_hearing_aid_tone4:":"\u{1F9BB}\u{1F3FE}",":ear_with_hearing_aid_medium_dark_skin_tone:":"\u{1F9BB}\u{1F3FE}",":ear_with_hearing_aid_tone5:":"\u{1F9BB}\u{1F3FF}",":ear_with_hearing_aid_dark_skin_tone:":"\u{1F9BB}\u{1F3FF}",":nose:":"\u{1F443}",":nose_tone1:":"\u{1F443}\u{1F3FB}",":nose_tone2:":"\u{1F443}\u{1F3FC}",":nose_tone3:":"\u{1F443}\u{1F3FD}",":nose_tone4:":"\u{1F443}\u{1F3FE}",":nose_tone5:":"\u{1F443}\u{1F3FF}",":footprints:":"\u{1F463}",":eye:":"\u{1F441}\uFE0F",":eyes:":"\u{1F440}",":brain:":"\u{1F9E0}",":anatomical_heart:":"\u{1FAC0}",":lungs:":"\u{1FAC1}",":speaking_head:":"\u{1F5E3}\uFE0F",":speaking_head_in_silhouette:":"\u{1F5E3}\uFE0F",":bust_in_silhouette:":"\u{1F464}",":busts_in_silhouette:":"\u{1F465}",":people_hugging:":"\u{1FAC2}",":baby:":"\u{1F476}",":baby_tone1:":"\u{1F476}\u{1F3FB}",":baby_tone2:":"\u{1F476}\u{1F3FC}",":baby_tone3:":"\u{1F476}\u{1F3FD}",":baby_tone4:":"\u{1F476}\u{1F3FE}",":baby_tone5:":"\u{1F476}\u{1F3FF}",":girl:":"\u{1F467}",":girl_tone1:":"\u{1F467}\u{1F3FB}",":girl_tone2:":"\u{1F467}\u{1F3FC}",":girl_tone3:":"\u{1F467}\u{1F3FD}",":girl_tone4:":"\u{1F467}\u{1F3FE}",":girl_tone5:":"\u{1F467}\u{1F3FF}",":child:":"\u{1F9D2}",":child_tone1:":"\u{1F9D2}\u{1F3FB}",":child_light_skin_tone:":"\u{1F9D2}\u{1F3FB}",":child_tone2:":"\u{1F9D2}\u{1F3FC}",":child_medium_light_skin_tone:":"\u{1F9D2}\u{1F3FC}",":child_tone3:":"\u{1F9D2}\u{1F3FD}",":child_medium_skin_tone:":"\u{1F9D2}\u{1F3FD}",":child_tone4:":"\u{1F9D2}\u{1F3FE}",":child_medium_dark_skin_tone:":"\u{1F9D2}\u{1F3FE}",":child_tone5:":"\u{1F9D2}\u{1F3FF}",":child_dark_skin_tone:":"\u{1F9D2}\u{1F3FF}",":boy:":"\u{1F466}",":boy_tone1:":"\u{1F466}\u{1F3FB}",":boy_tone2:":"\u{1F466}\u{1F3FC}",":boy_tone3:":"\u{1F466}\u{1F3FD}",":boy_tone4:":"\u{1F466}\u{1F3FE}",":boy_tone5:":"\u{1F466}\u{1F3FF}",":woman:":"\u{1F469}",":woman_tone1:":"\u{1F469}\u{1F3FB}",":woman_tone2:":"\u{1F469}\u{1F3FC}",":woman_tone3:":"\u{1F469}\u{1F3FD}",":woman_tone4:":"\u{1F469}\u{1F3FE}",":woman_tone5:":"\u{1F469}\u{1F3FF}",":adult:":"\u{1F9D1}",":adult_tone1:":"\u{1F9D1}\u{1F3FB}",":adult_light_skin_tone:":"\u{1F9D1}\u{1F3FB}",":adult_tone2:":"\u{1F9D1}\u{1F3FC}",":adult_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FC}",":adult_tone3:":"\u{1F9D1}\u{1F3FD}",":adult_medium_skin_tone:":"\u{1F9D1}\u{1F3FD}",":adult_tone4:":"\u{1F9D1}\u{1F3FE}",":adult_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FE}",":adult_tone5:":"\u{1F9D1}\u{1F3FF}",":adult_dark_skin_tone:":"\u{1F9D1}\u{1F3FF}",":man:":"\u{1F468}",":man_tone1:":"\u{1F468}\u{1F3FB}",":man_tone2:":"\u{1F468}\u{1F3FC}",":man_tone3:":"\u{1F468}\u{1F3FD}",":man_tone4:":"\u{1F468}\u{1F3FE}",":man_tone5:":"\u{1F468}\u{1F3FF}",":person_curly_hair:":"\u{1F9D1}\u200D\u{1F9B1}",":person_tone1_curly_hair:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F9B1}",":person_light_skin_tone_curly_hair:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F9B1}",":person_tone2_curly_hair:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F9B1}",":person_medium_light_skin_tone_curly_hair:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F9B1}",":person_tone3_curly_hair:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F9B1}",":person_medium_skin_tone_curly_hair:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F9B1}",":person_tone4_curly_hair:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F9B1}",":person_medium_dark_skin_tone_curly_hair:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F9B1}",":person_tone5_curly_hair:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F9B1}",":person_dark_skin_tone_curly_hair:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F9B1}",":woman_curly_haired:":"\u{1F469}\u200D\u{1F9B1}",":woman_curly_haired_tone1:":"\u{1F469}\u{1F3FB}\u200D\u{1F9B1}",":woman_curly_haired_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F9B1}",":woman_curly_haired_tone2:":"\u{1F469}\u{1F3FC}\u200D\u{1F9B1}",":woman_curly_haired_medium_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F9B1}",":woman_curly_haired_tone3:":"\u{1F469}\u{1F3FD}\u200D\u{1F9B1}",":woman_curly_haired_medium_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F9B1}",":woman_curly_haired_tone4:":"\u{1F469}\u{1F3FE}\u200D\u{1F9B1}",":woman_curly_haired_medium_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F9B1}",":woman_curly_haired_tone5:":"\u{1F469}\u{1F3FF}\u200D\u{1F9B1}",":woman_curly_haired_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F9B1}",":man_curly_haired:":"\u{1F468}\u200D\u{1F9B1}",":man_curly_haired_tone1:":"\u{1F468}\u{1F3FB}\u200D\u{1F9B1}",":man_curly_haired_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F9B1}",":man_curly_haired_tone2:":"\u{1F468}\u{1F3FC}\u200D\u{1F9B1}",":man_curly_haired_medium_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F9B1}",":man_curly_haired_tone3:":"\u{1F468}\u{1F3FD}\u200D\u{1F9B1}",":man_curly_haired_medium_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F9B1}",":man_curly_haired_tone4:":"\u{1F468}\u{1F3FE}\u200D\u{1F9B1}",":man_curly_haired_medium_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F9B1}",":man_curly_haired_tone5:":"\u{1F468}\u{1F3FF}\u200D\u{1F9B1}",":man_curly_haired_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F9B1}",":person_red_hair:":"\u{1F9D1}\u200D\u{1F9B0}",":person_tone1_red_hair:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F9B0}",":person_light_skin_tone_red_hair:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F9B0}",":person_tone2_red_hair:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F9B0}",":person_medium_light_skin_tone_red_hair:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F9B0}",":person_tone3_red_hair:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F9B0}",":person_medium_skin_tone_red_hair:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F9B0}",":person_tone4_red_hair:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F9B0}",":person_medium_dark_skin_tone_red_hair:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F9B0}",":person_tone5_red_hair:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F9B0}",":person_dark_skin_tone_red_hair:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F9B0}",":woman_red_haired:":"\u{1F469}\u200D\u{1F9B0}",":woman_red_haired_tone1:":"\u{1F469}\u{1F3FB}\u200D\u{1F9B0}",":woman_red_haired_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F9B0}",":woman_red_haired_tone2:":"\u{1F469}\u{1F3FC}\u200D\u{1F9B0}",":woman_red_haired_medium_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F9B0}",":woman_red_haired_tone3:":"\u{1F469}\u{1F3FD}\u200D\u{1F9B0}",":woman_red_haired_medium_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F9B0}",":woman_red_haired_tone4:":"\u{1F469}\u{1F3FE}\u200D\u{1F9B0}",":woman_red_haired_medium_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F9B0}",":woman_red_haired_tone5:":"\u{1F469}\u{1F3FF}\u200D\u{1F9B0}",":woman_red_haired_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F9B0}",":man_red_haired:":"\u{1F468}\u200D\u{1F9B0}",":man_red_haired_tone1:":"\u{1F468}\u{1F3FB}\u200D\u{1F9B0}",":man_red_haired_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F9B0}",":man_red_haired_tone2:":"\u{1F468}\u{1F3FC}\u200D\u{1F9B0}",":man_red_haired_medium_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F9B0}",":man_red_haired_tone3:":"\u{1F468}\u{1F3FD}\u200D\u{1F9B0}",":man_red_haired_medium_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F9B0}",":man_red_haired_tone4:":"\u{1F468}\u{1F3FE}\u200D\u{1F9B0}",":man_red_haired_medium_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F9B0}",":man_red_haired_tone5:":"\u{1F468}\u{1F3FF}\u200D\u{1F9B0}",":man_red_haired_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F9B0}",":blond_haired_woman:":"\u{1F471}\u200D\u2640\uFE0F",":blond_haired_woman_tone1:":"\u{1F471}\u{1F3FB}\u200D\u2640\uFE0F",":blond_haired_woman_light_skin_tone:":"\u{1F471}\u{1F3FB}\u200D\u2640\uFE0F",":blond_haired_woman_tone2:":"\u{1F471}\u{1F3FC}\u200D\u2640\uFE0F",":blond_haired_woman_medium_light_skin_tone:":"\u{1F471}\u{1F3FC}\u200D\u2640\uFE0F",":blond_haired_woman_tone3:":"\u{1F471}\u{1F3FD}\u200D\u2640\uFE0F",":blond_haired_woman_medium_skin_tone:":"\u{1F471}\u{1F3FD}\u200D\u2640\uFE0F",":blond_haired_woman_tone4:":"\u{1F471}\u{1F3FE}\u200D\u2640\uFE0F",":blond_haired_woman_medium_dark_skin_tone:":"\u{1F471}\u{1F3FE}\u200D\u2640\uFE0F",":blond_haired_woman_tone5:":"\u{1F471}\u{1F3FF}\u200D\u2640\uFE0F",":blond_haired_woman_dark_skin_tone:":"\u{1F471}\u{1F3FF}\u200D\u2640\uFE0F",":blond_haired_person:":"\u{1F471}",":person_with_blond_hair:":"\u{1F471}",":blond_haired_person_tone1:":"\u{1F471}\u{1F3FB}",":person_with_blond_hair_tone1:":"\u{1F471}\u{1F3FB}",":blond_haired_person_tone2:":"\u{1F471}\u{1F3FC}",":person_with_blond_hair_tone2:":"\u{1F471}\u{1F3FC}",":blond_haired_person_tone3:":"\u{1F471}\u{1F3FD}",":person_with_blond_hair_tone3:":"\u{1F471}\u{1F3FD}",":blond_haired_person_tone4:":"\u{1F471}\u{1F3FE}",":person_with_blond_hair_tone4:":"\u{1F471}\u{1F3FE}",":blond_haired_person_tone5:":"\u{1F471}\u{1F3FF}",":person_with_blond_hair_tone5:":"\u{1F471}\u{1F3FF}",":blond_haired_man:":"\u{1F471}\u200D\u2642\uFE0F",":blond_haired_man_tone1:":"\u{1F471}\u{1F3FB}\u200D\u2642\uFE0F",":blond_haired_man_light_skin_tone:":"\u{1F471}\u{1F3FB}\u200D\u2642\uFE0F",":blond_haired_man_tone2:":"\u{1F471}\u{1F3FC}\u200D\u2642\uFE0F",":blond_haired_man_medium_light_skin_tone:":"\u{1F471}\u{1F3FC}\u200D\u2642\uFE0F",":blond_haired_man_tone3:":"\u{1F471}\u{1F3FD}\u200D\u2642\uFE0F",":blond_haired_man_medium_skin_tone:":"\u{1F471}\u{1F3FD}\u200D\u2642\uFE0F",":blond_haired_man_tone4:":"\u{1F471}\u{1F3FE}\u200D\u2642\uFE0F",":blond_haired_man_medium_dark_skin_tone:":"\u{1F471}\u{1F3FE}\u200D\u2642\uFE0F",":blond_haired_man_tone5:":"\u{1F471}\u{1F3FF}\u200D\u2642\uFE0F",":blond_haired_man_dark_skin_tone:":"\u{1F471}\u{1F3FF}\u200D\u2642\uFE0F",":person_white_hair:":"\u{1F9D1}\u200D\u{1F9B3}",":person_tone1_white_hair:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F9B3}",":person_light_skin_tone_white_hair:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F9B3}",":person_tone2_white_hair:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F9B3}",":person_medium_light_skin_tone_white_hair:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F9B3}",":person_tone3_white_hair:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F9B3}",":person_medium_skin_tone_white_hair:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F9B3}",":person_tone4_white_hair:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F9B3}",":person_medium_dark_skin_tone_white_hair:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F9B3}",":person_tone5_white_hair:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F9B3}",":person_dark_skin_tone_white_hair:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F9B3}",":woman_white_haired:":"\u{1F469}\u200D\u{1F9B3}",":woman_white_haired_tone1:":"\u{1F469}\u{1F3FB}\u200D\u{1F9B3}",":woman_white_haired_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F9B3}",":woman_white_haired_tone2:":"\u{1F469}\u{1F3FC}\u200D\u{1F9B3}",":woman_white_haired_medium_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F9B3}",":woman_white_haired_tone3:":"\u{1F469}\u{1F3FD}\u200D\u{1F9B3}",":woman_white_haired_medium_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F9B3}",":woman_white_haired_tone4:":"\u{1F469}\u{1F3FE}\u200D\u{1F9B3}",":woman_white_haired_medium_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F9B3}",":woman_white_haired_tone5:":"\u{1F469}\u{1F3FF}\u200D\u{1F9B3}",":woman_white_haired_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F9B3}",":man_white_haired:":"\u{1F468}\u200D\u{1F9B3}",":man_white_haired_tone1:":"\u{1F468}\u{1F3FB}\u200D\u{1F9B3}",":man_white_haired_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F9B3}",":man_white_haired_tone2:":"\u{1F468}\u{1F3FC}\u200D\u{1F9B3}",":man_white_haired_medium_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F9B3}",":man_white_haired_tone3:":"\u{1F468}\u{1F3FD}\u200D\u{1F9B3}",":man_white_haired_medium_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F9B3}",":man_white_haired_tone4:":"\u{1F468}\u{1F3FE}\u200D\u{1F9B3}",":man_white_haired_medium_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F9B3}",":man_white_haired_tone5:":"\u{1F468}\u{1F3FF}\u200D\u{1F9B3}",":man_white_haired_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F9B3}",":person_bald:":"\u{1F9D1}\u200D\u{1F9B2}",":person_tone1_bald:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F9B2}",":person_light_skin_tone_bald:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F9B2}",":person_tone2_bald:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F9B2}",":person_medium_light_skin_tone_bald:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F9B2}",":person_tone3_bald:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F9B2}",":person_medium_skin_tone_bald:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F9B2}",":person_tone4_bald:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F9B2}",":person_medium_dark_skin_tone_bald:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F9B2}",":person_tone5_bald:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F9B2}",":person_dark_skin_tone_bald:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F9B2}",":woman_bald:":"\u{1F469}\u200D\u{1F9B2}",":woman_bald_tone1:":"\u{1F469}\u{1F3FB}\u200D\u{1F9B2}",":woman_bald_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F9B2}",":woman_bald_tone2:":"\u{1F469}\u{1F3FC}\u200D\u{1F9B2}",":woman_bald_medium_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F9B2}",":woman_bald_tone3:":"\u{1F469}\u{1F3FD}\u200D\u{1F9B2}",":woman_bald_medium_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F9B2}",":woman_bald_tone4:":"\u{1F469}\u{1F3FE}\u200D\u{1F9B2}",":woman_bald_medium_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F9B2}",":woman_bald_tone5:":"\u{1F469}\u{1F3FF}\u200D\u{1F9B2}",":woman_bald_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F9B2}",":man_bald:":"\u{1F468}\u200D\u{1F9B2}",":man_bald_tone1:":"\u{1F468}\u{1F3FB}\u200D\u{1F9B2}",":man_bald_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F9B2}",":man_bald_tone2:":"\u{1F468}\u{1F3FC}\u200D\u{1F9B2}",":man_bald_medium_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F9B2}",":man_bald_tone3:":"\u{1F468}\u{1F3FD}\u200D\u{1F9B2}",":man_bald_medium_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F9B2}",":man_bald_tone4:":"\u{1F468}\u{1F3FE}\u200D\u{1F9B2}",":man_bald_medium_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F9B2}",":man_bald_tone5:":"\u{1F468}\u{1F3FF}\u200D\u{1F9B2}",":man_bald_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F9B2}",":bearded_person:":"\u{1F9D4}",":bearded_person_tone1:":"\u{1F9D4}\u{1F3FB}",":bearded_person_light_skin_tone:":"\u{1F9D4}\u{1F3FB}",":bearded_person_tone2:":"\u{1F9D4}\u{1F3FC}",":bearded_person_medium_light_skin_tone:":"\u{1F9D4}\u{1F3FC}",":bearded_person_tone3:":"\u{1F9D4}\u{1F3FD}",":bearded_person_medium_skin_tone:":"\u{1F9D4}\u{1F3FD}",":bearded_person_tone4:":"\u{1F9D4}\u{1F3FE}",":bearded_person_medium_dark_skin_tone:":"\u{1F9D4}\u{1F3FE}",":bearded_person_tone5:":"\u{1F9D4}\u{1F3FF}",":bearded_person_dark_skin_tone:":"\u{1F9D4}\u{1F3FF}",":older_woman:":"\u{1F475}",":grandma:":"\u{1F475}",":older_woman_tone1:":"\u{1F475}\u{1F3FB}",":grandma_tone1:":"\u{1F475}\u{1F3FB}",":older_woman_tone2:":"\u{1F475}\u{1F3FC}",":grandma_tone2:":"\u{1F475}\u{1F3FC}",":older_woman_tone3:":"\u{1F475}\u{1F3FD}",":grandma_tone3:":"\u{1F475}\u{1F3FD}",":older_woman_tone4:":"\u{1F475}\u{1F3FE}",":grandma_tone4:":"\u{1F475}\u{1F3FE}",":older_woman_tone5:":"\u{1F475}\u{1F3FF}",":grandma_tone5:":"\u{1F475}\u{1F3FF}",":older_adult:":"\u{1F9D3}",":older_adult_tone1:":"\u{1F9D3}\u{1F3FB}",":older_adult_light_skin_tone:":"\u{1F9D3}\u{1F3FB}",":older_adult_tone2:":"\u{1F9D3}\u{1F3FC}",":older_adult_medium_light_skin_tone:":"\u{1F9D3}\u{1F3FC}",":older_adult_tone3:":"\u{1F9D3}\u{1F3FD}",":older_adult_medium_skin_tone:":"\u{1F9D3}\u{1F3FD}",":older_adult_tone4:":"\u{1F9D3}\u{1F3FE}",":older_adult_medium_dark_skin_tone:":"\u{1F9D3}\u{1F3FE}",":older_adult_tone5:":"\u{1F9D3}\u{1F3FF}",":older_adult_dark_skin_tone:":"\u{1F9D3}\u{1F3FF}",":older_man:":"\u{1F474}",":older_man_tone1:":"\u{1F474}\u{1F3FB}",":older_man_tone2:":"\u{1F474}\u{1F3FC}",":older_man_tone3:":"\u{1F474}\u{1F3FD}",":older_man_tone4:":"\u{1F474}\u{1F3FE}",":older_man_tone5:":"\u{1F474}\u{1F3FF}",":man_with_chinese_cap:":"\u{1F472}",":man_with_gua_pi_mao:":"\u{1F472}",":man_with_chinese_cap_tone1:":"\u{1F472}\u{1F3FB}",":man_with_gua_pi_mao_tone1:":"\u{1F472}\u{1F3FB}",":man_with_chinese_cap_tone2:":"\u{1F472}\u{1F3FC}",":man_with_gua_pi_mao_tone2:":"\u{1F472}\u{1F3FC}",":man_with_chinese_cap_tone3:":"\u{1F472}\u{1F3FD}",":man_with_gua_pi_mao_tone3:":"\u{1F472}\u{1F3FD}",":man_with_chinese_cap_tone4:":"\u{1F472}\u{1F3FE}",":man_with_gua_pi_mao_tone4:":"\u{1F472}\u{1F3FE}",":man_with_chinese_cap_tone5:":"\u{1F472}\u{1F3FF}",":man_with_gua_pi_mao_tone5:":"\u{1F472}\u{1F3FF}",":person_wearing_turban:":"\u{1F473}",":man_with_turban:":"\u{1F473}",":person_wearing_turban_tone1:":"\u{1F473}\u{1F3FB}",":man_with_turban_tone1:":"\u{1F473}\u{1F3FB}",":person_wearing_turban_tone2:":"\u{1F473}\u{1F3FC}",":man_with_turban_tone2:":"\u{1F473}\u{1F3FC}",":person_wearing_turban_tone3:":"\u{1F473}\u{1F3FD}",":man_with_turban_tone3:":"\u{1F473}\u{1F3FD}",":person_wearing_turban_tone4:":"\u{1F473}\u{1F3FE}",":man_with_turban_tone4:":"\u{1F473}\u{1F3FE}",":person_wearing_turban_tone5:":"\u{1F473}\u{1F3FF}",":man_with_turban_tone5:":"\u{1F473}\u{1F3FF}",":woman_wearing_turban:":"\u{1F473}\u200D\u2640\uFE0F",":woman_wearing_turban_tone1:":"\u{1F473}\u{1F3FB}\u200D\u2640\uFE0F",":woman_wearing_turban_light_skin_tone:":"\u{1F473}\u{1F3FB}\u200D\u2640\uFE0F",":woman_wearing_turban_tone2:":"\u{1F473}\u{1F3FC}\u200D\u2640\uFE0F",":woman_wearing_turban_medium_light_skin_tone:":"\u{1F473}\u{1F3FC}\u200D\u2640\uFE0F",":woman_wearing_turban_tone3:":"\u{1F473}\u{1F3FD}\u200D\u2640\uFE0F",":woman_wearing_turban_medium_skin_tone:":"\u{1F473}\u{1F3FD}\u200D\u2640\uFE0F",":woman_wearing_turban_tone4:":"\u{1F473}\u{1F3FE}\u200D\u2640\uFE0F",":woman_wearing_turban_medium_dark_skin_tone:":"\u{1F473}\u{1F3FE}\u200D\u2640\uFE0F",":woman_wearing_turban_tone5:":"\u{1F473}\u{1F3FF}\u200D\u2640\uFE0F",":woman_wearing_turban_dark_skin_tone:":"\u{1F473}\u{1F3FF}\u200D\u2640\uFE0F",":man_wearing_turban:":"\u{1F473}\u200D\u2642\uFE0F",":man_wearing_turban_tone1:":"\u{1F473}\u{1F3FB}\u200D\u2642\uFE0F",":man_wearing_turban_light_skin_tone:":"\u{1F473}\u{1F3FB}\u200D\u2642\uFE0F",":man_wearing_turban_tone2:":"\u{1F473}\u{1F3FC}\u200D\u2642\uFE0F",":man_wearing_turban_medium_light_skin_tone:":"\u{1F473}\u{1F3FC}\u200D\u2642\uFE0F",":man_wearing_turban_tone3:":"\u{1F473}\u{1F3FD}\u200D\u2642\uFE0F",":man_wearing_turban_medium_skin_tone:":"\u{1F473}\u{1F3FD}\u200D\u2642\uFE0F",":man_wearing_turban_tone4:":"\u{1F473}\u{1F3FE}\u200D\u2642\uFE0F",":man_wearing_turban_medium_dark_skin_tone:":"\u{1F473}\u{1F3FE}\u200D\u2642\uFE0F",":man_wearing_turban_tone5:":"\u{1F473}\u{1F3FF}\u200D\u2642\uFE0F",":man_wearing_turban_dark_skin_tone:":"\u{1F473}\u{1F3FF}\u200D\u2642\uFE0F",":woman_with_headscarf:":"\u{1F9D5}",":woman_with_headscarf_tone1:":"\u{1F9D5}\u{1F3FB}",":woman_with_headscarf_light_skin_tone:":"\u{1F9D5}\u{1F3FB}",":woman_with_headscarf_tone2:":"\u{1F9D5}\u{1F3FC}",":woman_with_headscarf_medium_light_skin_tone:":"\u{1F9D5}\u{1F3FC}",":woman_with_headscarf_tone3:":"\u{1F9D5}\u{1F3FD}",":woman_with_headscarf_medium_skin_tone:":"\u{1F9D5}\u{1F3FD}",":woman_with_headscarf_tone4:":"\u{1F9D5}\u{1F3FE}",":woman_with_headscarf_medium_dark_skin_tone:":"\u{1F9D5}\u{1F3FE}",":woman_with_headscarf_tone5:":"\u{1F9D5}\u{1F3FF}",":woman_with_headscarf_dark_skin_tone:":"\u{1F9D5}\u{1F3FF}",":police_officer:":"\u{1F46E}",":cop:":"\u{1F46E}",":police_officer_tone1:":"\u{1F46E}\u{1F3FB}",":cop_tone1:":"\u{1F46E}\u{1F3FB}",":police_officer_tone2:":"\u{1F46E}\u{1F3FC}",":cop_tone2:":"\u{1F46E}\u{1F3FC}",":police_officer_tone3:":"\u{1F46E}\u{1F3FD}",":cop_tone3:":"\u{1F46E}\u{1F3FD}",":police_officer_tone4:":"\u{1F46E}\u{1F3FE}",":cop_tone4:":"\u{1F46E}\u{1F3FE}",":police_officer_tone5:":"\u{1F46E}\u{1F3FF}",":cop_tone5:":"\u{1F46E}\u{1F3FF}",":woman_police_officer:":"\u{1F46E}\u200D\u2640\uFE0F",":woman_police_officer_tone1:":"\u{1F46E}\u{1F3FB}\u200D\u2640\uFE0F",":woman_police_officer_light_skin_tone:":"\u{1F46E}\u{1F3FB}\u200D\u2640\uFE0F",":woman_police_officer_tone2:":"\u{1F46E}\u{1F3FC}\u200D\u2640\uFE0F",":woman_police_officer_medium_light_skin_tone:":"\u{1F46E}\u{1F3FC}\u200D\u2640\uFE0F",":woman_police_officer_tone3:":"\u{1F46E}\u{1F3FD}\u200D\u2640\uFE0F",":woman_police_officer_medium_skin_tone:":"\u{1F46E}\u{1F3FD}\u200D\u2640\uFE0F",":woman_police_officer_tone4:":"\u{1F46E}\u{1F3FE}\u200D\u2640\uFE0F",":woman_police_officer_medium_dark_skin_tone:":"\u{1F46E}\u{1F3FE}\u200D\u2640\uFE0F",":woman_police_officer_tone5:":"\u{1F46E}\u{1F3FF}\u200D\u2640\uFE0F",":woman_police_officer_dark_skin_tone:":"\u{1F46E}\u{1F3FF}\u200D\u2640\uFE0F",":man_police_officer:":"\u{1F46E}\u200D\u2642\uFE0F",":man_police_officer_tone1:":"\u{1F46E}\u{1F3FB}\u200D\u2642\uFE0F",":man_police_officer_light_skin_tone:":"\u{1F46E}\u{1F3FB}\u200D\u2642\uFE0F",":man_police_officer_tone2:":"\u{1F46E}\u{1F3FC}\u200D\u2642\uFE0F",":man_police_officer_medium_light_skin_tone:":"\u{1F46E}\u{1F3FC}\u200D\u2642\uFE0F",":man_police_officer_tone3:":"\u{1F46E}\u{1F3FD}\u200D\u2642\uFE0F",":man_police_officer_medium_skin_tone:":"\u{1F46E}\u{1F3FD}\u200D\u2642\uFE0F",":man_police_officer_tone4:":"\u{1F46E}\u{1F3FE}\u200D\u2642\uFE0F",":man_police_officer_medium_dark_skin_tone:":"\u{1F46E}\u{1F3FE}\u200D\u2642\uFE0F",":man_police_officer_tone5:":"\u{1F46E}\u{1F3FF}\u200D\u2642\uFE0F",":man_police_officer_dark_skin_tone:":"\u{1F46E}\u{1F3FF}\u200D\u2642\uFE0F",":construction_worker:":"\u{1F477}",":construction_worker_tone1:":"\u{1F477}\u{1F3FB}",":construction_worker_tone2:":"\u{1F477}\u{1F3FC}",":construction_worker_tone3:":"\u{1F477}\u{1F3FD}",":construction_worker_tone4:":"\u{1F477}\u{1F3FE}",":construction_worker_tone5:":"\u{1F477}\u{1F3FF}",":woman_construction_worker:":"\u{1F477}\u200D\u2640\uFE0F",":woman_construction_worker_tone1:":"\u{1F477}\u{1F3FB}\u200D\u2640\uFE0F",":woman_construction_worker_light_skin_tone:":"\u{1F477}\u{1F3FB}\u200D\u2640\uFE0F",":woman_construction_worker_tone2:":"\u{1F477}\u{1F3FC}\u200D\u2640\uFE0F",":woman_construction_worker_medium_light_skin_tone:":"\u{1F477}\u{1F3FC}\u200D\u2640\uFE0F",":woman_construction_worker_tone3:":"\u{1F477}\u{1F3FD}\u200D\u2640\uFE0F",":woman_construction_worker_medium_skin_tone:":"\u{1F477}\u{1F3FD}\u200D\u2640\uFE0F",":woman_construction_worker_tone4:":"\u{1F477}\u{1F3FE}\u200D\u2640\uFE0F",":woman_construction_worker_medium_dark_skin_tone:":"\u{1F477}\u{1F3FE}\u200D\u2640\uFE0F",":woman_construction_worker_tone5:":"\u{1F477}\u{1F3FF}\u200D\u2640\uFE0F",":woman_construction_worker_dark_skin_tone:":"\u{1F477}\u{1F3FF}\u200D\u2640\uFE0F",":man_construction_worker:":"\u{1F477}\u200D\u2642\uFE0F",":man_construction_worker_tone1:":"\u{1F477}\u{1F3FB}\u200D\u2642\uFE0F",":man_construction_worker_light_skin_tone:":"\u{1F477}\u{1F3FB}\u200D\u2642\uFE0F",":man_construction_worker_tone2:":"\u{1F477}\u{1F3FC}\u200D\u2642\uFE0F",":man_construction_worker_medium_light_skin_tone:":"\u{1F477}\u{1F3FC}\u200D\u2642\uFE0F",":man_construction_worker_tone3:":"\u{1F477}\u{1F3FD}\u200D\u2642\uFE0F",":man_construction_worker_medium_skin_tone:":"\u{1F477}\u{1F3FD}\u200D\u2642\uFE0F",":man_construction_worker_tone4:":"\u{1F477}\u{1F3FE}\u200D\u2642\uFE0F",":man_construction_worker_medium_dark_skin_tone:":"\u{1F477}\u{1F3FE}\u200D\u2642\uFE0F",":man_construction_worker_tone5:":"\u{1F477}\u{1F3FF}\u200D\u2642\uFE0F",":man_construction_worker_dark_skin_tone:":"\u{1F477}\u{1F3FF}\u200D\u2642\uFE0F",":guard:":"\u{1F482}",":guardsman:":"\u{1F482}",":guard_tone1:":"\u{1F482}\u{1F3FB}",":guardsman_tone1:":"\u{1F482}\u{1F3FB}",":guard_tone2:":"\u{1F482}\u{1F3FC}",":guardsman_tone2:":"\u{1F482}\u{1F3FC}",":guard_tone3:":"\u{1F482}\u{1F3FD}",":guardsman_tone3:":"\u{1F482}\u{1F3FD}",":guard_tone4:":"\u{1F482}\u{1F3FE}",":guardsman_tone4:":"\u{1F482}\u{1F3FE}",":guard_tone5:":"\u{1F482}\u{1F3FF}",":guardsman_tone5:":"\u{1F482}\u{1F3FF}",":woman_guard:":"\u{1F482}\u200D\u2640\uFE0F",":woman_guard_tone1:":"\u{1F482}\u{1F3FB}\u200D\u2640\uFE0F",":woman_guard_light_skin_tone:":"\u{1F482}\u{1F3FB}\u200D\u2640\uFE0F",":woman_guard_tone2:":"\u{1F482}\u{1F3FC}\u200D\u2640\uFE0F",":woman_guard_medium_light_skin_tone:":"\u{1F482}\u{1F3FC}\u200D\u2640\uFE0F",":woman_guard_tone3:":"\u{1F482}\u{1F3FD}\u200D\u2640\uFE0F",":woman_guard_medium_skin_tone:":"\u{1F482}\u{1F3FD}\u200D\u2640\uFE0F",":woman_guard_tone4:":"\u{1F482}\u{1F3FE}\u200D\u2640\uFE0F",":woman_guard_medium_dark_skin_tone:":"\u{1F482}\u{1F3FE}\u200D\u2640\uFE0F",":woman_guard_tone5:":"\u{1F482}\u{1F3FF}\u200D\u2640\uFE0F",":woman_guard_dark_skin_tone:":"\u{1F482}\u{1F3FF}\u200D\u2640\uFE0F",":man_guard:":"\u{1F482}\u200D\u2642\uFE0F",":man_guard_tone1:":"\u{1F482}\u{1F3FB}\u200D\u2642\uFE0F",":man_guard_light_skin_tone:":"\u{1F482}\u{1F3FB}\u200D\u2642\uFE0F",":man_guard_tone2:":"\u{1F482}\u{1F3FC}\u200D\u2642\uFE0F",":man_guard_medium_light_skin_tone:":"\u{1F482}\u{1F3FC}\u200D\u2642\uFE0F",":man_guard_tone3:":"\u{1F482}\u{1F3FD}\u200D\u2642\uFE0F",":man_guard_medium_skin_tone:":"\u{1F482}\u{1F3FD}\u200D\u2642\uFE0F",":man_guard_tone4:":"\u{1F482}\u{1F3FE}\u200D\u2642\uFE0F",":man_guard_medium_dark_skin_tone:":"\u{1F482}\u{1F3FE}\u200D\u2642\uFE0F",":man_guard_tone5:":"\u{1F482}\u{1F3FF}\u200D\u2642\uFE0F",":man_guard_dark_skin_tone:":"\u{1F482}\u{1F3FF}\u200D\u2642\uFE0F",":detective:":"\u{1F575}\uFE0F",":spy:":"\u{1F575}\uFE0F",":sleuth_or_spy:":"\u{1F575}\uFE0F",":detective_tone1:":"\u{1F575}\u{1F3FB}",":spy_tone1:":"\u{1F575}\u{1F3FB}",":sleuth_or_spy_tone1:":"\u{1F575}\u{1F3FB}",":detective_tone2:":"\u{1F575}\u{1F3FC}",":spy_tone2:":"\u{1F575}\u{1F3FC}",":sleuth_or_spy_tone2:":"\u{1F575}\u{1F3FC}",":detective_tone3:":"\u{1F575}\u{1F3FD}",":spy_tone3:":"\u{1F575}\u{1F3FD}",":sleuth_or_spy_tone3:":"\u{1F575}\u{1F3FD}",":detective_tone4:":"\u{1F575}\u{1F3FE}",":spy_tone4:":"\u{1F575}\u{1F3FE}",":sleuth_or_spy_tone4:":"\u{1F575}\u{1F3FE}",":detective_tone5:":"\u{1F575}\u{1F3FF}",":spy_tone5:":"\u{1F575}\u{1F3FF}",":sleuth_or_spy_tone5:":"\u{1F575}\u{1F3FF}",":woman_detective:":"\u{1F575}\uFE0F\u200D\u2640\uFE0F",":woman_detective_tone1:":"\u{1F575}\u{1F3FB}\u200D\u2640\uFE0F",":woman_detective_light_skin_tone:":"\u{1F575}\u{1F3FB}\u200D\u2640\uFE0F",":woman_detective_tone2:":"\u{1F575}\u{1F3FC}\u200D\u2640\uFE0F",":woman_detective_medium_light_skin_tone:":"\u{1F575}\u{1F3FC}\u200D\u2640\uFE0F",":woman_detective_tone3:":"\u{1F575}\u{1F3FD}\u200D\u2640\uFE0F",":woman_detective_medium_skin_tone:":"\u{1F575}\u{1F3FD}\u200D\u2640\uFE0F",":woman_detective_tone4:":"\u{1F575}\u{1F3FE}\u200D\u2640\uFE0F",":woman_detective_medium_dark_skin_tone:":"\u{1F575}\u{1F3FE}\u200D\u2640\uFE0F",":woman_detective_tone5:":"\u{1F575}\u{1F3FF}\u200D\u2640\uFE0F",":woman_detective_dark_skin_tone:":"\u{1F575}\u{1F3FF}\u200D\u2640\uFE0F",":man_detective:":"\u{1F575}\uFE0F\u200D\u2642\uFE0F",":man_detective_tone1:":"\u{1F575}\u{1F3FB}\u200D\u2642\uFE0F",":man_detective_light_skin_tone:":"\u{1F575}\u{1F3FB}\u200D\u2642\uFE0F",":man_detective_tone2:":"\u{1F575}\u{1F3FC}\u200D\u2642\uFE0F",":man_detective_medium_light_skin_tone:":"\u{1F575}\u{1F3FC}\u200D\u2642\uFE0F",":man_detective_tone3:":"\u{1F575}\u{1F3FD}\u200D\u2642\uFE0F",":man_detective_medium_skin_tone:":"\u{1F575}\u{1F3FD}\u200D\u2642\uFE0F",":man_detective_tone4:":"\u{1F575}\u{1F3FE}\u200D\u2642\uFE0F",":man_detective_medium_dark_skin_tone:":"\u{1F575}\u{1F3FE}\u200D\u2642\uFE0F",":man_detective_tone5:":"\u{1F575}\u{1F3FF}\u200D\u2642\uFE0F",":man_detective_dark_skin_tone:":"\u{1F575}\u{1F3FF}\u200D\u2642\uFE0F",":health_worker:":"\u{1F9D1}\u200D\u2695\uFE0F",":health_worker_tone1:":"\u{1F9D1}\u{1F3FB}\u200D\u2695\uFE0F",":health_worker_light_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u2695\uFE0F",":health_worker_tone2:":"\u{1F9D1}\u{1F3FC}\u200D\u2695\uFE0F",":health_worker_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u2695\uFE0F",":health_worker_tone3:":"\u{1F9D1}\u{1F3FD}\u200D\u2695\uFE0F",":health_worker_medium_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u2695\uFE0F",":health_worker_tone4:":"\u{1F9D1}\u{1F3FE}\u200D\u2695\uFE0F",":health_worker_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u2695\uFE0F",":health_worker_tone5:":"\u{1F9D1}\u{1F3FF}\u200D\u2695\uFE0F",":health_worker_dark_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u2695\uFE0F",":woman_health_worker:":"\u{1F469}\u200D\u2695\uFE0F",":woman_health_worker_tone1:":"\u{1F469}\u{1F3FB}\u200D\u2695\uFE0F",":woman_health_worker_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u2695\uFE0F",":woman_health_worker_tone2:":"\u{1F469}\u{1F3FC}\u200D\u2695\uFE0F",":woman_health_worker_medium_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u2695\uFE0F",":woman_health_worker_tone3:":"\u{1F469}\u{1F3FD}\u200D\u2695\uFE0F",":woman_health_worker_medium_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u2695\uFE0F",":woman_health_worker_tone4:":"\u{1F469}\u{1F3FE}\u200D\u2695\uFE0F",":woman_health_worker_medium_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u2695\uFE0F",":woman_health_worker_tone5:":"\u{1F469}\u{1F3FF}\u200D\u2695\uFE0F",":woman_health_worker_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u2695\uFE0F",":man_health_worker:":"\u{1F468}\u200D\u2695\uFE0F",":man_health_worker_tone1:":"\u{1F468}\u{1F3FB}\u200D\u2695\uFE0F",":man_health_worker_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u2695\uFE0F",":man_health_worker_tone2:":"\u{1F468}\u{1F3FC}\u200D\u2695\uFE0F",":man_health_worker_medium_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u2695\uFE0F",":man_health_worker_tone3:":"\u{1F468}\u{1F3FD}\u200D\u2695\uFE0F",":man_health_worker_medium_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u2695\uFE0F",":man_health_worker_tone4:":"\u{1F468}\u{1F3FE}\u200D\u2695\uFE0F",":man_health_worker_medium_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u2695\uFE0F",":man_health_worker_tone5:":"\u{1F468}\u{1F3FF}\u200D\u2695\uFE0F",":man_health_worker_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u2695\uFE0F",":farmer:":"\u{1F9D1}\u200D\u{1F33E}",":farmer_tone1:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F33E}",":farmer_light_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F33E}",":farmer_tone2:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F33E}",":farmer_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F33E}",":farmer_tone3:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F33E}",":farmer_medium_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F33E}",":farmer_tone4:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F33E}",":farmer_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F33E}",":farmer_tone5:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F33E}",":farmer_dark_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F33E}",":woman_farmer:":"\u{1F469}\u200D\u{1F33E}",":woman_farmer_tone1:":"\u{1F469}\u{1F3FB}\u200D\u{1F33E}",":woman_farmer_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F33E}",":woman_farmer_tone2:":"\u{1F469}\u{1F3FC}\u200D\u{1F33E}",":woman_farmer_medium_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F33E}",":woman_farmer_tone3:":"\u{1F469}\u{1F3FD}\u200D\u{1F33E}",":woman_farmer_medium_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F33E}",":woman_farmer_tone4:":"\u{1F469}\u{1F3FE}\u200D\u{1F33E}",":woman_farmer_medium_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F33E}",":woman_farmer_tone5:":"\u{1F469}\u{1F3FF}\u200D\u{1F33E}",":woman_farmer_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F33E}",":man_farmer:":"\u{1F468}\u200D\u{1F33E}",":man_farmer_tone1:":"\u{1F468}\u{1F3FB}\u200D\u{1F33E}",":man_farmer_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F33E}",":man_farmer_tone2:":"\u{1F468}\u{1F3FC}\u200D\u{1F33E}",":man_farmer_medium_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F33E}",":man_farmer_tone3:":"\u{1F468}\u{1F3FD}\u200D\u{1F33E}",":man_farmer_medium_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F33E}",":man_farmer_tone4:":"\u{1F468}\u{1F3FE}\u200D\u{1F33E}",":man_farmer_medium_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F33E}",":man_farmer_tone5:":"\u{1F468}\u{1F3FF}\u200D\u{1F33E}",":man_farmer_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F33E}",":cook:":"\u{1F9D1}\u200D\u{1F373}",":cook_tone1:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F373}",":cook_light_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F373}",":cook_tone2:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F373}",":cook_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F373}",":cook_tone3:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F373}",":cook_medium_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F373}",":cook_tone4:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F373}",":cook_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F373}",":cook_tone5:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F373}",":cook_dark_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F373}",":woman_cook:":"\u{1F469}\u200D\u{1F373}",":woman_cook_tone1:":"\u{1F469}\u{1F3FB}\u200D\u{1F373}",":woman_cook_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F373}",":woman_cook_tone2:":"\u{1F469}\u{1F3FC}\u200D\u{1F373}",":woman_cook_medium_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F373}",":woman_cook_tone3:":"\u{1F469}\u{1F3FD}\u200D\u{1F373}",":woman_cook_medium_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F373}",":woman_cook_tone4:":"\u{1F469}\u{1F3FE}\u200D\u{1F373}",":woman_cook_medium_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F373}",":woman_cook_tone5:":"\u{1F469}\u{1F3FF}\u200D\u{1F373}",":woman_cook_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F373}",":man_cook:":"\u{1F468}\u200D\u{1F373}",":man_cook_tone1:":"\u{1F468}\u{1F3FB}\u200D\u{1F373}",":man_cook_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F373}",":man_cook_tone2:":"\u{1F468}\u{1F3FC}\u200D\u{1F373}",":man_cook_medium_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F373}",":man_cook_tone3:":"\u{1F468}\u{1F3FD}\u200D\u{1F373}",":man_cook_medium_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F373}",":man_cook_tone4:":"\u{1F468}\u{1F3FE}\u200D\u{1F373}",":man_cook_medium_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F373}",":man_cook_tone5:":"\u{1F468}\u{1F3FF}\u200D\u{1F373}",":man_cook_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F373}",":student:":"\u{1F9D1}\u200D\u{1F393}",":student_tone1:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F393}",":student_light_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F393}",":student_tone2:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F393}",":student_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F393}",":student_tone3:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F393}",":student_medium_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F393}",":student_tone4:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F393}",":student_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F393}",":student_tone5:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F393}",":student_dark_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F393}",":woman_student:":"\u{1F469}\u200D\u{1F393}",":woman_student_tone1:":"\u{1F469}\u{1F3FB}\u200D\u{1F393}",":woman_student_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F393}",":woman_student_tone2:":"\u{1F469}\u{1F3FC}\u200D\u{1F393}",":woman_student_medium_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F393}",":woman_student_tone3:":"\u{1F469}\u{1F3FD}\u200D\u{1F393}",":woman_student_medium_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F393}",":woman_student_tone4:":"\u{1F469}\u{1F3FE}\u200D\u{1F393}",":woman_student_medium_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F393}",":woman_student_tone5:":"\u{1F469}\u{1F3FF}\u200D\u{1F393}",":woman_student_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F393}",":man_student:":"\u{1F468}\u200D\u{1F393}",":man_student_tone1:":"\u{1F468}\u{1F3FB}\u200D\u{1F393}",":man_student_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F393}",":man_student_tone2:":"\u{1F468}\u{1F3FC}\u200D\u{1F393}",":man_student_medium_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F393}",":man_student_tone3:":"\u{1F468}\u{1F3FD}\u200D\u{1F393}",":man_student_medium_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F393}",":man_student_tone4:":"\u{1F468}\u{1F3FE}\u200D\u{1F393}",":man_student_medium_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F393}",":man_student_tone5:":"\u{1F468}\u{1F3FF}\u200D\u{1F393}",":man_student_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F393}",":singer:":"\u{1F9D1}\u200D\u{1F3A4}",":singer_tone1:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F3A4}",":singer_light_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F3A4}",":singer_tone2:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F3A4}",":singer_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F3A4}",":singer_tone3:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F3A4}",":singer_medium_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F3A4}",":singer_tone4:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F3A4}",":singer_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F3A4}",":singer_tone5:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F3A4}",":singer_dark_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F3A4}",":woman_singer:":"\u{1F469}\u200D\u{1F3A4}",":woman_singer_tone1:":"\u{1F469}\u{1F3FB}\u200D\u{1F3A4}",":woman_singer_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F3A4}",":woman_singer_tone2:":"\u{1F469}\u{1F3FC}\u200D\u{1F3A4}",":woman_singer_medium_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F3A4}",":woman_singer_tone3:":"\u{1F469}\u{1F3FD}\u200D\u{1F3A4}",":woman_singer_medium_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F3A4}",":woman_singer_tone4:":"\u{1F469}\u{1F3FE}\u200D\u{1F3A4}",":woman_singer_medium_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F3A4}",":woman_singer_tone5:":"\u{1F469}\u{1F3FF}\u200D\u{1F3A4}",":woman_singer_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F3A4}",":man_singer:":"\u{1F468}\u200D\u{1F3A4}",":man_singer_tone1:":"\u{1F468}\u{1F3FB}\u200D\u{1F3A4}",":man_singer_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F3A4}",":man_singer_tone2:":"\u{1F468}\u{1F3FC}\u200D\u{1F3A4}",":man_singer_medium_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F3A4}",":man_singer_tone3:":"\u{1F468}\u{1F3FD}\u200D\u{1F3A4}",":man_singer_medium_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F3A4}",":man_singer_tone4:":"\u{1F468}\u{1F3FE}\u200D\u{1F3A4}",":man_singer_medium_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F3A4}",":man_singer_tone5:":"\u{1F468}\u{1F3FF}\u200D\u{1F3A4}",":man_singer_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F3A4}",":teacher:":"\u{1F9D1}\u200D\u{1F3EB}",":teacher_tone1:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F3EB}",":teacher_light_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F3EB}",":teacher_tone2:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F3EB}",":teacher_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F3EB}",":teacher_tone3:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F3EB}",":teacher_medium_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F3EB}",":teacher_tone4:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F3EB}",":teacher_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F3EB}",":teacher_tone5:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F3EB}",":teacher_dark_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F3EB}",":woman_teacher:":"\u{1F469}\u200D\u{1F3EB}",":woman_teacher_tone1:":"\u{1F469}\u{1F3FB}\u200D\u{1F3EB}",":woman_teacher_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F3EB}",":woman_teacher_tone2:":"\u{1F469}\u{1F3FC}\u200D\u{1F3EB}",":woman_teacher_medium_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F3EB}",":woman_teacher_tone3:":"\u{1F469}\u{1F3FD}\u200D\u{1F3EB}",":woman_teacher_medium_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F3EB}",":woman_teacher_tone4:":"\u{1F469}\u{1F3FE}\u200D\u{1F3EB}",":woman_teacher_medium_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F3EB}",":woman_teacher_tone5:":"\u{1F469}\u{1F3FF}\u200D\u{1F3EB}",":woman_teacher_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F3EB}",":man_teacher:":"\u{1F468}\u200D\u{1F3EB}",":man_teacher_tone1:":"\u{1F468}\u{1F3FB}\u200D\u{1F3EB}",":man_teacher_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F3EB}",":man_teacher_tone2:":"\u{1F468}\u{1F3FC}\u200D\u{1F3EB}",":man_teacher_medium_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F3EB}",":man_teacher_tone3:":"\u{1F468}\u{1F3FD}\u200D\u{1F3EB}",":man_teacher_medium_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F3EB}",":man_teacher_tone4:":"\u{1F468}\u{1F3FE}\u200D\u{1F3EB}",":man_teacher_medium_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F3EB}",":man_teacher_tone5:":"\u{1F468}\u{1F3FF}\u200D\u{1F3EB}",":man_teacher_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F3EB}",":factory_worker:":"\u{1F9D1}\u200D\u{1F3ED}",":factory_worker_tone1:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F3ED}",":factory_worker_light_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F3ED}",":factory_worker_tone2:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F3ED}",":factory_worker_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F3ED}",":factory_worker_tone3:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F3ED}",":factory_worker_medium_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F3ED}",":factory_worker_tone4:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F3ED}",":factory_worker_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F3ED}",":factory_worker_tone5:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F3ED}",":factory_worker_dark_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F3ED}",":woman_factory_worker:":"\u{1F469}\u200D\u{1F3ED}",":woman_factory_worker_tone1:":"\u{1F469}\u{1F3FB}\u200D\u{1F3ED}",":woman_factory_worker_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F3ED}",":woman_factory_worker_tone2:":"\u{1F469}\u{1F3FC}\u200D\u{1F3ED}",":woman_factory_worker_medium_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F3ED}",":woman_factory_worker_tone3:":"\u{1F469}\u{1F3FD}\u200D\u{1F3ED}",":woman_factory_worker_medium_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F3ED}",":woman_factory_worker_tone4:":"\u{1F469}\u{1F3FE}\u200D\u{1F3ED}",":woman_factory_worker_medium_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F3ED}",":woman_factory_worker_tone5:":"\u{1F469}\u{1F3FF}\u200D\u{1F3ED}",":woman_factory_worker_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F3ED}",":man_factory_worker:":"\u{1F468}\u200D\u{1F3ED}",":man_factory_worker_tone1:":"\u{1F468}\u{1F3FB}\u200D\u{1F3ED}",":man_factory_worker_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F3ED}",":man_factory_worker_tone2:":"\u{1F468}\u{1F3FC}\u200D\u{1F3ED}",":man_factory_worker_medium_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F3ED}",":man_factory_worker_tone3:":"\u{1F468}\u{1F3FD}\u200D\u{1F3ED}",":man_factory_worker_medium_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F3ED}",":man_factory_worker_tone4:":"\u{1F468}\u{1F3FE}\u200D\u{1F3ED}",":man_factory_worker_medium_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F3ED}",":man_factory_worker_tone5:":"\u{1F468}\u{1F3FF}\u200D\u{1F3ED}",":man_factory_worker_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F3ED}",":technologist:":"\u{1F9D1}\u200D\u{1F4BB}",":technologist_tone1:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F4BB}",":technologist_light_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F4BB}",":technologist_tone2:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F4BB}",":technologist_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F4BB}",":technologist_tone3:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F4BB}",":technologist_medium_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F4BB}",":technologist_tone4:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F4BB}",":technologist_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F4BB}",":technologist_tone5:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F4BB}",":technologist_dark_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F4BB}",":woman_technologist:":"\u{1F469}\u200D\u{1F4BB}",":woman_technologist_tone1:":"\u{1F469}\u{1F3FB}\u200D\u{1F4BB}",":woman_technologist_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F4BB}",":woman_technologist_tone2:":"\u{1F469}\u{1F3FC}\u200D\u{1F4BB}",":woman_technologist_medium_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F4BB}",":woman_technologist_tone3:":"\u{1F469}\u{1F3FD}\u200D\u{1F4BB}",":woman_technologist_medium_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F4BB}",":woman_technologist_tone4:":"\u{1F469}\u{1F3FE}\u200D\u{1F4BB}",":woman_technologist_medium_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F4BB}",":woman_technologist_tone5:":"\u{1F469}\u{1F3FF}\u200D\u{1F4BB}",":woman_technologist_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F4BB}",":man_technologist:":"\u{1F468}\u200D\u{1F4BB}",":man_technologist_tone1:":"\u{1F468}\u{1F3FB}\u200D\u{1F4BB}",":man_technologist_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F4BB}",":man_technologist_tone2:":"\u{1F468}\u{1F3FC}\u200D\u{1F4BB}",":man_technologist_medium_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F4BB}",":man_technologist_tone3:":"\u{1F468}\u{1F3FD}\u200D\u{1F4BB}",":man_technologist_medium_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F4BB}",":man_technologist_tone4:":"\u{1F468}\u{1F3FE}\u200D\u{1F4BB}",":man_technologist_medium_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F4BB}",":man_technologist_tone5:":"\u{1F468}\u{1F3FF}\u200D\u{1F4BB}",":man_technologist_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F4BB}",":office_worker:":"\u{1F9D1}\u200D\u{1F4BC}",":office_worker_tone1:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F4BC}",":office_worker_light_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F4BC}",":office_worker_tone2:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F4BC}",":office_worker_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F4BC}",":office_worker_tone3:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F4BC}",":office_worker_medium_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F4BC}",":office_worker_tone4:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F4BC}",":office_worker_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F4BC}",":office_worker_tone5:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F4BC}",":office_worker_dark_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F4BC}",":woman_office_worker:":"\u{1F469}\u200D\u{1F4BC}",":woman_office_worker_tone1:":"\u{1F469}\u{1F3FB}\u200D\u{1F4BC}",":woman_office_worker_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F4BC}",":woman_office_worker_tone2:":"\u{1F469}\u{1F3FC}\u200D\u{1F4BC}",":woman_office_worker_medium_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F4BC}",":woman_office_worker_tone3:":"\u{1F469}\u{1F3FD}\u200D\u{1F4BC}",":woman_office_worker_medium_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F4BC}",":woman_office_worker_tone4:":"\u{1F469}\u{1F3FE}\u200D\u{1F4BC}",":woman_office_worker_medium_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F4BC}",":woman_office_worker_tone5:":"\u{1F469}\u{1F3FF}\u200D\u{1F4BC}",":woman_office_worker_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F4BC}",":man_office_worker:":"\u{1F468}\u200D\u{1F4BC}",":man_office_worker_tone1:":"\u{1F468}\u{1F3FB}\u200D\u{1F4BC}",":man_office_worker_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F4BC}",":man_office_worker_tone2:":"\u{1F468}\u{1F3FC}\u200D\u{1F4BC}",":man_office_worker_medium_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F4BC}",":man_office_worker_tone3:":"\u{1F468}\u{1F3FD}\u200D\u{1F4BC}",":man_office_worker_medium_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F4BC}",":man_office_worker_tone4:":"\u{1F468}\u{1F3FE}\u200D\u{1F4BC}",":man_office_worker_medium_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F4BC}",":man_office_worker_tone5:":"\u{1F468}\u{1F3FF}\u200D\u{1F4BC}",":man_office_worker_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F4BC}",":mechanic:":"\u{1F9D1}\u200D\u{1F527}",":mechanic_tone1:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F527}",":mechanic_light_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F527}",":mechanic_tone2:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F527}",":mechanic_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F527}",":mechanic_tone3:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F527}",":mechanic_medium_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F527}",":mechanic_tone4:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F527}",":mechanic_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F527}",":mechanic_tone5:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F527}",":mechanic_dark_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F527}",":woman_mechanic:":"\u{1F469}\u200D\u{1F527}",":woman_mechanic_tone1:":"\u{1F469}\u{1F3FB}\u200D\u{1F527}",":woman_mechanic_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F527}",":woman_mechanic_tone2:":"\u{1F469}\u{1F3FC}\u200D\u{1F527}",":woman_mechanic_medium_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F527}",":woman_mechanic_tone3:":"\u{1F469}\u{1F3FD}\u200D\u{1F527}",":woman_mechanic_medium_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F527}",":woman_mechanic_tone4:":"\u{1F469}\u{1F3FE}\u200D\u{1F527}",":woman_mechanic_medium_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F527}",":woman_mechanic_tone5:":"\u{1F469}\u{1F3FF}\u200D\u{1F527}",":woman_mechanic_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F527}",":man_mechanic:":"\u{1F468}\u200D\u{1F527}",":man_mechanic_tone1:":"\u{1F468}\u{1F3FB}\u200D\u{1F527}",":man_mechanic_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F527}",":man_mechanic_tone2:":"\u{1F468}\u{1F3FC}\u200D\u{1F527}",":man_mechanic_medium_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F527}",":man_mechanic_tone3:":"\u{1F468}\u{1F3FD}\u200D\u{1F527}",":man_mechanic_medium_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F527}",":man_mechanic_tone4:":"\u{1F468}\u{1F3FE}\u200D\u{1F527}",":man_mechanic_medium_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F527}",":man_mechanic_tone5:":"\u{1F468}\u{1F3FF}\u200D\u{1F527}",":man_mechanic_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F527}",":scientist:":"\u{1F9D1}\u200D\u{1F52C}",":scientist_tone1:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F52C}",":scientist_light_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F52C}",":scientist_tone2:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F52C}",":scientist_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F52C}",":scientist_tone3:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F52C}",":scientist_medium_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F52C}",":scientist_tone4:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F52C}",":scientist_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F52C}",":scientist_tone5:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F52C}",":scientist_dark_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F52C}",":woman_scientist:":"\u{1F469}\u200D\u{1F52C}",":woman_scientist_tone1:":"\u{1F469}\u{1F3FB}\u200D\u{1F52C}",":woman_scientist_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F52C}",":woman_scientist_tone2:":"\u{1F469}\u{1F3FC}\u200D\u{1F52C}",":woman_scientist_medium_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F52C}",":woman_scientist_tone3:":"\u{1F469}\u{1F3FD}\u200D\u{1F52C}",":woman_scientist_medium_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F52C}",":woman_scientist_tone4:":"\u{1F469}\u{1F3FE}\u200D\u{1F52C}",":woman_scientist_medium_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F52C}",":woman_scientist_tone5:":"\u{1F469}\u{1F3FF}\u200D\u{1F52C}",":woman_scientist_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F52C}",":man_scientist:":"\u{1F468}\u200D\u{1F52C}",":man_scientist_tone1:":"\u{1F468}\u{1F3FB}\u200D\u{1F52C}",":man_scientist_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F52C}",":man_scientist_tone2:":"\u{1F468}\u{1F3FC}\u200D\u{1F52C}",":man_scientist_medium_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F52C}",":man_scientist_tone3:":"\u{1F468}\u{1F3FD}\u200D\u{1F52C}",":man_scientist_medium_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F52C}",":man_scientist_tone4:":"\u{1F468}\u{1F3FE}\u200D\u{1F52C}",":man_scientist_medium_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F52C}",":man_scientist_tone5:":"\u{1F468}\u{1F3FF}\u200D\u{1F52C}",":man_scientist_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F52C}",":artist:":"\u{1F9D1}\u200D\u{1F3A8}",":artist_tone1:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F3A8}",":artist_light_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F3A8}",":artist_tone2:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F3A8}",":artist_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F3A8}",":artist_tone3:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F3A8}",":artist_medium_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F3A8}",":artist_tone4:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F3A8}",":artist_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F3A8}",":artist_tone5:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F3A8}",":artist_dark_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F3A8}",":woman_artist:":"\u{1F469}\u200D\u{1F3A8}",":woman_artist_tone1:":"\u{1F469}\u{1F3FB}\u200D\u{1F3A8}",":woman_artist_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F3A8}",":woman_artist_tone2:":"\u{1F469}\u{1F3FC}\u200D\u{1F3A8}",":woman_artist_medium_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F3A8}",":woman_artist_tone3:":"\u{1F469}\u{1F3FD}\u200D\u{1F3A8}",":woman_artist_medium_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F3A8}",":woman_artist_tone4:":"\u{1F469}\u{1F3FE}\u200D\u{1F3A8}",":woman_artist_medium_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F3A8}",":woman_artist_tone5:":"\u{1F469}\u{1F3FF}\u200D\u{1F3A8}",":woman_artist_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F3A8}",":man_artist:":"\u{1F468}\u200D\u{1F3A8}",":man_artist_tone1:":"\u{1F468}\u{1F3FB}\u200D\u{1F3A8}",":man_artist_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F3A8}",":man_artist_tone2:":"\u{1F468}\u{1F3FC}\u200D\u{1F3A8}",":man_artist_medium_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F3A8}",":man_artist_tone3:":"\u{1F468}\u{1F3FD}\u200D\u{1F3A8}",":man_artist_medium_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F3A8}",":man_artist_tone4:":"\u{1F468}\u{1F3FE}\u200D\u{1F3A8}",":man_artist_medium_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F3A8}",":man_artist_tone5:":"\u{1F468}\u{1F3FF}\u200D\u{1F3A8}",":man_artist_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F3A8}",":firefighter:":"\u{1F9D1}\u200D\u{1F692}",":firefighter_tone1:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F692}",":firefighter_light_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F692}",":firefighter_tone2:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F692}",":firefighter_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F692}",":firefighter_tone3:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F692}",":firefighter_medium_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F692}",":firefighter_tone4:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F692}",":firefighter_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F692}",":firefighter_tone5:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F692}",":firefighter_dark_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F692}",":woman_firefighter:":"\u{1F469}\u200D\u{1F692}",":woman_firefighter_tone1:":"\u{1F469}\u{1F3FB}\u200D\u{1F692}",":woman_firefighter_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F692}",":woman_firefighter_tone2:":"\u{1F469}\u{1F3FC}\u200D\u{1F692}",":woman_firefighter_medium_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F692}",":woman_firefighter_tone3:":"\u{1F469}\u{1F3FD}\u200D\u{1F692}",":woman_firefighter_medium_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F692}",":woman_firefighter_tone4:":"\u{1F469}\u{1F3FE}\u200D\u{1F692}",":woman_firefighter_medium_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F692}",":woman_firefighter_tone5:":"\u{1F469}\u{1F3FF}\u200D\u{1F692}",":woman_firefighter_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F692}",":man_firefighter:":"\u{1F468}\u200D\u{1F692}",":man_firefighter_tone1:":"\u{1F468}\u{1F3FB}\u200D\u{1F692}",":man_firefighter_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F692}",":man_firefighter_tone2:":"\u{1F468}\u{1F3FC}\u200D\u{1F692}",":man_firefighter_medium_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F692}",":man_firefighter_tone3:":"\u{1F468}\u{1F3FD}\u200D\u{1F692}",":man_firefighter_medium_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F692}",":man_firefighter_tone4:":"\u{1F468}\u{1F3FE}\u200D\u{1F692}",":man_firefighter_medium_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F692}",":man_firefighter_tone5:":"\u{1F468}\u{1F3FF}\u200D\u{1F692}",":man_firefighter_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F692}",":pilot:":"\u{1F9D1}\u200D\u2708\uFE0F",":pilot_tone1:":"\u{1F9D1}\u{1F3FB}\u200D\u2708\uFE0F",":pilot_light_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u2708\uFE0F",":pilot_tone2:":"\u{1F9D1}\u{1F3FC}\u200D\u2708\uFE0F",":pilot_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u2708\uFE0F",":pilot_tone3:":"\u{1F9D1}\u{1F3FD}\u200D\u2708\uFE0F",":pilot_medium_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u2708\uFE0F",":pilot_tone4:":"\u{1F9D1}\u{1F3FE}\u200D\u2708\uFE0F",":pilot_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u2708\uFE0F",":pilot_tone5:":"\u{1F9D1}\u{1F3FF}\u200D\u2708\uFE0F",":pilot_dark_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u2708\uFE0F",":woman_pilot:":"\u{1F469}\u200D\u2708\uFE0F",":woman_pilot_tone1:":"\u{1F469}\u{1F3FB}\u200D\u2708\uFE0F",":woman_pilot_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u2708\uFE0F",":woman_pilot_tone2:":"\u{1F469}\u{1F3FC}\u200D\u2708\uFE0F",":woman_pilot_medium_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u2708\uFE0F",":woman_pilot_tone3:":"\u{1F469}\u{1F3FD}\u200D\u2708\uFE0F",":woman_pilot_medium_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u2708\uFE0F",":woman_pilot_tone4:":"\u{1F469}\u{1F3FE}\u200D\u2708\uFE0F",":woman_pilot_medium_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u2708\uFE0F",":woman_pilot_tone5:":"\u{1F469}\u{1F3FF}\u200D\u2708\uFE0F",":woman_pilot_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u2708\uFE0F",":man_pilot:":"\u{1F468}\u200D\u2708\uFE0F",":man_pilot_tone1:":"\u{1F468}\u{1F3FB}\u200D\u2708\uFE0F",":man_pilot_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u2708\uFE0F",":man_pilot_tone2:":"\u{1F468}\u{1F3FC}\u200D\u2708\uFE0F",":man_pilot_medium_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u2708\uFE0F",":man_pilot_tone3:":"\u{1F468}\u{1F3FD}\u200D\u2708\uFE0F",":man_pilot_medium_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u2708\uFE0F",":man_pilot_tone4:":"\u{1F468}\u{1F3FE}\u200D\u2708\uFE0F",":man_pilot_medium_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u2708\uFE0F",":man_pilot_tone5:":"\u{1F468}\u{1F3FF}\u200D\u2708\uFE0F",":man_pilot_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u2708\uFE0F",":astronaut:":"\u{1F9D1}\u200D\u{1F680}",":astronaut_tone1:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F680}",":astronaut_light_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F680}",":astronaut_tone2:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F680}",":astronaut_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F680}",":astronaut_tone3:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F680}",":astronaut_medium_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F680}",":astronaut_tone4:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F680}",":astronaut_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F680}",":astronaut_tone5:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F680}",":astronaut_dark_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F680}",":woman_astronaut:":"\u{1F469}\u200D\u{1F680}",":woman_astronaut_tone1:":"\u{1F469}\u{1F3FB}\u200D\u{1F680}",":woman_astronaut_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F680}",":woman_astronaut_tone2:":"\u{1F469}\u{1F3FC}\u200D\u{1F680}",":woman_astronaut_medium_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F680}",":woman_astronaut_tone3:":"\u{1F469}\u{1F3FD}\u200D\u{1F680}",":woman_astronaut_medium_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F680}",":woman_astronaut_tone4:":"\u{1F469}\u{1F3FE}\u200D\u{1F680}",":woman_astronaut_medium_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F680}",":woman_astronaut_tone5:":"\u{1F469}\u{1F3FF}\u200D\u{1F680}",":woman_astronaut_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F680}",":man_astronaut:":"\u{1F468}\u200D\u{1F680}",":man_astronaut_tone1:":"\u{1F468}\u{1F3FB}\u200D\u{1F680}",":man_astronaut_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F680}",":man_astronaut_tone2:":"\u{1F468}\u{1F3FC}\u200D\u{1F680}",":man_astronaut_medium_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F680}",":man_astronaut_tone3:":"\u{1F468}\u{1F3FD}\u200D\u{1F680}",":man_astronaut_medium_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F680}",":man_astronaut_tone4:":"\u{1F468}\u{1F3FE}\u200D\u{1F680}",":man_astronaut_medium_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F680}",":man_astronaut_tone5:":"\u{1F468}\u{1F3FF}\u200D\u{1F680}",":man_astronaut_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F680}",":judge:":"\u{1F9D1}\u200D\u2696\uFE0F",":judge_tone1:":"\u{1F9D1}\u{1F3FB}\u200D\u2696\uFE0F",":judge_light_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u2696\uFE0F",":judge_tone2:":"\u{1F9D1}\u{1F3FC}\u200D\u2696\uFE0F",":judge_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u2696\uFE0F",":judge_tone3:":"\u{1F9D1}\u{1F3FD}\u200D\u2696\uFE0F",":judge_medium_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u2696\uFE0F",":judge_tone4:":"\u{1F9D1}\u{1F3FE}\u200D\u2696\uFE0F",":judge_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u2696\uFE0F",":judge_tone5:":"\u{1F9D1}\u{1F3FF}\u200D\u2696\uFE0F",":judge_dark_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u2696\uFE0F",":woman_judge:":"\u{1F469}\u200D\u2696\uFE0F",":woman_judge_tone1:":"\u{1F469}\u{1F3FB}\u200D\u2696\uFE0F",":woman_judge_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u2696\uFE0F",":woman_judge_tone2:":"\u{1F469}\u{1F3FC}\u200D\u2696\uFE0F",":woman_judge_medium_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u2696\uFE0F",":woman_judge_tone3:":"\u{1F469}\u{1F3FD}\u200D\u2696\uFE0F",":woman_judge_medium_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u2696\uFE0F",":woman_judge_tone4:":"\u{1F469}\u{1F3FE}\u200D\u2696\uFE0F",":woman_judge_medium_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u2696\uFE0F",":woman_judge_tone5:":"\u{1F469}\u{1F3FF}\u200D\u2696\uFE0F",":woman_judge_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u2696\uFE0F",":man_judge:":"\u{1F468}\u200D\u2696\uFE0F",":man_judge_tone1:":"\u{1F468}\u{1F3FB}\u200D\u2696\uFE0F",":man_judge_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u2696\uFE0F",":man_judge_tone2:":"\u{1F468}\u{1F3FC}\u200D\u2696\uFE0F",":man_judge_medium_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u2696\uFE0F",":man_judge_tone3:":"\u{1F468}\u{1F3FD}\u200D\u2696\uFE0F",":man_judge_medium_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u2696\uFE0F",":man_judge_tone4:":"\u{1F468}\u{1F3FE}\u200D\u2696\uFE0F",":man_judge_medium_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u2696\uFE0F",":man_judge_tone5:":"\u{1F468}\u{1F3FF}\u200D\u2696\uFE0F",":man_judge_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u2696\uFE0F",":person_with_veil:":"\u{1F470}",":person_with_veil_tone1:":"\u{1F470}\u{1F3FB}",":person_with_veil_tone2:":"\u{1F470}\u{1F3FC}",":person_with_veil_tone3:":"\u{1F470}\u{1F3FD}",":person_with_veil_tone4:":"\u{1F470}\u{1F3FE}",":person_with_veil_tone5:":"\u{1F470}\u{1F3FF}",":woman_with_veil:":"\u{1F470}\u200D\u2640\uFE0F",":bride_with_veil:":"\u{1F470}\u200D\u2640\uFE0F",":woman_with_veil_tone1:":"\u{1F470}\u{1F3FB}\u200D\u2640\uFE0F",":woman_with_veil_light_skin_tone:":"\u{1F470}\u{1F3FB}\u200D\u2640\uFE0F",":woman_with_veil_tone2:":"\u{1F470}\u{1F3FC}\u200D\u2640\uFE0F",":woman_with_veil_medium_light_skin_tone:":"\u{1F470}\u{1F3FC}\u200D\u2640\uFE0F",":woman_with_veil_tone3:":"\u{1F470}\u{1F3FD}\u200D\u2640\uFE0F",":woman_with_veil_medium_skin_tone:":"\u{1F470}\u{1F3FD}\u200D\u2640\uFE0F",":woman_with_veil_tone4:":"\u{1F470}\u{1F3FE}\u200D\u2640\uFE0F",":woman_with_veil_medium_dark_skin_tone:":"\u{1F470}\u{1F3FE}\u200D\u2640\uFE0F",":woman_with_veil_tone5:":"\u{1F470}\u{1F3FF}\u200D\u2640\uFE0F",":woman_with_veil_dark_skin_tone:":"\u{1F470}\u{1F3FF}\u200D\u2640\uFE0F",":man_with_veil:":"\u{1F470}\u200D\u2642\uFE0F",":man_with_veil_tone1:":"\u{1F470}\u{1F3FB}\u200D\u2642\uFE0F",":man_with_veil_light_skin_tone:":"\u{1F470}\u{1F3FB}\u200D\u2642\uFE0F",":man_with_veil_tone2:":"\u{1F470}\u{1F3FC}\u200D\u2642\uFE0F",":man_with_veil_medium_light_skin_tone:":"\u{1F470}\u{1F3FC}\u200D\u2642\uFE0F",":man_with_veil_tone3:":"\u{1F470}\u{1F3FD}\u200D\u2642\uFE0F",":man_with_veil_medium_skin_tone:":"\u{1F470}\u{1F3FD}\u200D\u2642\uFE0F",":man_with_veil_tone4:":"\u{1F470}\u{1F3FE}\u200D\u2642\uFE0F",":man_with_veil_medium_dark_skin_tone:":"\u{1F470}\u{1F3FE}\u200D\u2642\uFE0F",":man_with_veil_tone5:":"\u{1F470}\u{1F3FF}\u200D\u2642\uFE0F",":man_with_veil_dark_skin_tone:":"\u{1F470}\u{1F3FF}\u200D\u2642\uFE0F",":person_in_tuxedo:":"\u{1F935}",":person_in_tuxedo_tone1:":"\u{1F935}\u{1F3FB}",":tuxedo_tone1:":"\u{1F935}\u{1F3FB}",":person_in_tuxedo_tone2:":"\u{1F935}\u{1F3FC}",":tuxedo_tone2:":"\u{1F935}\u{1F3FC}",":person_in_tuxedo_tone3:":"\u{1F935}\u{1F3FD}",":tuxedo_tone3:":"\u{1F935}\u{1F3FD}",":person_in_tuxedo_tone4:":"\u{1F935}\u{1F3FE}",":tuxedo_tone4:":"\u{1F935}\u{1F3FE}",":person_in_tuxedo_tone5:":"\u{1F935}\u{1F3FF}",":tuxedo_tone5:":"\u{1F935}\u{1F3FF}",":woman_in_tuxedo:":"\u{1F935}\u200D\u2640\uFE0F",":woman_in_tuxedo_tone1:":"\u{1F935}\u{1F3FB}\u200D\u2640\uFE0F",":woman_in_tuxedo_light_skin_tone:":"\u{1F935}\u{1F3FB}\u200D\u2640\uFE0F",":woman_in_tuxedo_tone2:":"\u{1F935}\u{1F3FC}\u200D\u2640\uFE0F",":woman_in_tuxedo_medium_light_skin_tone:":"\u{1F935}\u{1F3FC}\u200D\u2640\uFE0F",":woman_in_tuxedo_tone3:":"\u{1F935}\u{1F3FD}\u200D\u2640\uFE0F",":woman_in_tuxedo_medium_skin_tone:":"\u{1F935}\u{1F3FD}\u200D\u2640\uFE0F",":woman_in_tuxedo_tone4:":"\u{1F935}\u{1F3FE}\u200D\u2640\uFE0F",":woman_in_tuxedo_medium_dark_skin_tone:":"\u{1F935}\u{1F3FE}\u200D\u2640\uFE0F",":woman_in_tuxedo_tone5:":"\u{1F935}\u{1F3FF}\u200D\u2640\uFE0F",":woman_in_tuxedo_dark_skin_tone:":"\u{1F935}\u{1F3FF}\u200D\u2640\uFE0F",":man_in_tuxedo:":"\u{1F935}\u200D\u2642\uFE0F",":man_in_tuxedo_tone1:":"\u{1F935}\u{1F3FB}\u200D\u2642\uFE0F",":man_in_tuxedo_light_skin_tone:":"\u{1F935}\u{1F3FB}\u200D\u2642\uFE0F",":man_in_tuxedo_tone2:":"\u{1F935}\u{1F3FC}\u200D\u2642\uFE0F",":man_in_tuxedo_medium_light_skin_tone:":"\u{1F935}\u{1F3FC}\u200D\u2642\uFE0F",":man_in_tuxedo_tone3:":"\u{1F935}\u{1F3FD}\u200D\u2642\uFE0F",":man_in_tuxedo_medium_skin_tone:":"\u{1F935}\u{1F3FD}\u200D\u2642\uFE0F",":man_in_tuxedo_tone4:":"\u{1F935}\u{1F3FE}\u200D\u2642\uFE0F",":man_in_tuxedo_medium_dark_skin_tone:":"\u{1F935}\u{1F3FE}\u200D\u2642\uFE0F",":man_in_tuxedo_tone5:":"\u{1F935}\u{1F3FF}\u200D\u2642\uFE0F",":man_in_tuxedo_dark_skin_tone:":"\u{1F935}\u{1F3FF}\u200D\u2642\uFE0F",":princess:":"\u{1F478}",":princess_tone1:":"\u{1F478}\u{1F3FB}",":princess_tone2:":"\u{1F478}\u{1F3FC}",":princess_tone3:":"\u{1F478}\u{1F3FD}",":princess_tone4:":"\u{1F478}\u{1F3FE}",":princess_tone5:":"\u{1F478}\u{1F3FF}",":prince:":"\u{1F934}",":prince_tone1:":"\u{1F934}\u{1F3FB}",":prince_tone2:":"\u{1F934}\u{1F3FC}",":prince_tone3:":"\u{1F934}\u{1F3FD}",":prince_tone4:":"\u{1F934}\u{1F3FE}",":prince_tone5:":"\u{1F934}\u{1F3FF}",":superhero:":"\u{1F9B8}",":superhero_tone1:":"\u{1F9B8}\u{1F3FB}",":superhero_light_skin_tone:":"\u{1F9B8}\u{1F3FB}",":superhero_tone2:":"\u{1F9B8}\u{1F3FC}",":superhero_medium_light_skin_tone:":"\u{1F9B8}\u{1F3FC}",":superhero_tone3:":"\u{1F9B8}\u{1F3FD}",":superhero_medium_skin_tone:":"\u{1F9B8}\u{1F3FD}",":superhero_tone4:":"\u{1F9B8}\u{1F3FE}",":superhero_medium_dark_skin_tone:":"\u{1F9B8}\u{1F3FE}",":superhero_tone5:":"\u{1F9B8}\u{1F3FF}",":superhero_dark_skin_tone:":"\u{1F9B8}\u{1F3FF}",":woman_superhero:":"\u{1F9B8}\u200D\u2640\uFE0F",":woman_superhero_tone1:":"\u{1F9B8}\u{1F3FB}\u200D\u2640\uFE0F",":woman_superhero_light_skin_tone:":"\u{1F9B8}\u{1F3FB}\u200D\u2640\uFE0F",":woman_superhero_tone2:":"\u{1F9B8}\u{1F3FC}\u200D\u2640\uFE0F",":woman_superhero_medium_light_skin_tone:":"\u{1F9B8}\u{1F3FC}\u200D\u2640\uFE0F",":woman_superhero_tone3:":"\u{1F9B8}\u{1F3FD}\u200D\u2640\uFE0F",":woman_superhero_medium_skin_tone:":"\u{1F9B8}\u{1F3FD}\u200D\u2640\uFE0F",":woman_superhero_tone4:":"\u{1F9B8}\u{1F3FE}\u200D\u2640\uFE0F",":woman_superhero_medium_dark_skin_tone:":"\u{1F9B8}\u{1F3FE}\u200D\u2640\uFE0F",":woman_superhero_tone5:":"\u{1F9B8}\u{1F3FF}\u200D\u2640\uFE0F",":woman_superhero_dark_skin_tone:":"\u{1F9B8}\u{1F3FF}\u200D\u2640\uFE0F",":man_superhero:":"\u{1F9B8}\u200D\u2642\uFE0F",":man_superhero_tone1:":"\u{1F9B8}\u{1F3FB}\u200D\u2642\uFE0F",":man_superhero_light_skin_tone:":"\u{1F9B8}\u{1F3FB}\u200D\u2642\uFE0F",":man_superhero_tone2:":"\u{1F9B8}\u{1F3FC}\u200D\u2642\uFE0F",":man_superhero_medium_light_skin_tone:":"\u{1F9B8}\u{1F3FC}\u200D\u2642\uFE0F",":man_superhero_tone3:":"\u{1F9B8}\u{1F3FD}\u200D\u2642\uFE0F",":man_superhero_medium_skin_tone:":"\u{1F9B8}\u{1F3FD}\u200D\u2642\uFE0F",":man_superhero_tone4:":"\u{1F9B8}\u{1F3FE}\u200D\u2642\uFE0F",":man_superhero_medium_dark_skin_tone:":"\u{1F9B8}\u{1F3FE}\u200D\u2642\uFE0F",":man_superhero_tone5:":"\u{1F9B8}\u{1F3FF}\u200D\u2642\uFE0F",":man_superhero_dark_skin_tone:":"\u{1F9B8}\u{1F3FF}\u200D\u2642\uFE0F",":supervillain:":"\u{1F9B9}",":supervillain_tone1:":"\u{1F9B9}\u{1F3FB}",":supervillain_light_skin_tone:":"\u{1F9B9}\u{1F3FB}",":supervillain_tone2:":"\u{1F9B9}\u{1F3FC}",":supervillain_medium_light_skin_tone:":"\u{1F9B9}\u{1F3FC}",":supervillain_tone3:":"\u{1F9B9}\u{1F3FD}",":supervillain_medium_skin_tone:":"\u{1F9B9}\u{1F3FD}",":supervillain_tone4:":"\u{1F9B9}\u{1F3FE}",":supervillain_medium_dark_skin_tone:":"\u{1F9B9}\u{1F3FE}",":supervillain_tone5:":"\u{1F9B9}\u{1F3FF}",":supervillain_dark_skin_tone:":"\u{1F9B9}\u{1F3FF}",":woman_supervillain:":"\u{1F9B9}\u200D\u2640\uFE0F",":woman_supervillain_tone1:":"\u{1F9B9}\u{1F3FB}\u200D\u2640\uFE0F",":woman_supervillain_light_skin_tone:":"\u{1F9B9}\u{1F3FB}\u200D\u2640\uFE0F",":woman_supervillain_tone2:":"\u{1F9B9}\u{1F3FC}\u200D\u2640\uFE0F",":woman_supervillain_medium_light_skin_tone:":"\u{1F9B9}\u{1F3FC}\u200D\u2640\uFE0F",":woman_supervillain_tone3:":"\u{1F9B9}\u{1F3FD}\u200D\u2640\uFE0F",":woman_supervillain_medium_skin_tone:":"\u{1F9B9}\u{1F3FD}\u200D\u2640\uFE0F",":woman_supervillain_tone4:":"\u{1F9B9}\u{1F3FE}\u200D\u2640\uFE0F",":woman_supervillain_medium_dark_skin_tone:":"\u{1F9B9}\u{1F3FE}\u200D\u2640\uFE0F",":woman_supervillain_tone5:":"\u{1F9B9}\u{1F3FF}\u200D\u2640\uFE0F",":woman_supervillain_dark_skin_tone:":"\u{1F9B9}\u{1F3FF}\u200D\u2640\uFE0F",":man_supervillain:":"\u{1F9B9}\u200D\u2642\uFE0F",":man_supervillain_tone1:":"\u{1F9B9}\u{1F3FB}\u200D\u2642\uFE0F",":man_supervillain_light_skin_tone:":"\u{1F9B9}\u{1F3FB}\u200D\u2642\uFE0F",":man_supervillain_tone2:":"\u{1F9B9}\u{1F3FC}\u200D\u2642\uFE0F",":man_supervillain_medium_light_skin_tone:":"\u{1F9B9}\u{1F3FC}\u200D\u2642\uFE0F",":man_supervillain_tone3:":"\u{1F9B9}\u{1F3FD}\u200D\u2642\uFE0F",":man_supervillain_medium_skin_tone:":"\u{1F9B9}\u{1F3FD}\u200D\u2642\uFE0F",":man_supervillain_tone4:":"\u{1F9B9}\u{1F3FE}\u200D\u2642\uFE0F",":man_supervillain_medium_dark_skin_tone:":"\u{1F9B9}\u{1F3FE}\u200D\u2642\uFE0F",":man_supervillain_tone5:":"\u{1F9B9}\u{1F3FF}\u200D\u2642\uFE0F",":man_supervillain_dark_skin_tone:":"\u{1F9B9}\u{1F3FF}\u200D\u2642\uFE0F",":ninja:":"\u{1F977}",":ninja_tone1:":"\u{1F977}\u{1F3FB}",":ninja_light_skin_tone:":"\u{1F977}\u{1F3FB}",":ninja_tone2:":"\u{1F977}\u{1F3FC}",":ninja_medium_light_skin_tone:":"\u{1F977}\u{1F3FC}",":ninja_tone3:":"\u{1F977}\u{1F3FD}",":ninja_medium_skin_tone:":"\u{1F977}\u{1F3FD}",":ninja_tone4:":"\u{1F977}\u{1F3FE}",":ninja_medium_dark_skin_tone:":"\u{1F977}\u{1F3FE}",":ninja_tone5:":"\u{1F977}\u{1F3FF}",":ninja_dark_skin_tone:":"\u{1F977}\u{1F3FF}",":mx_claus:":"\u{1F9D1}\u200D\u{1F384}",":mx_claus_tone1:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F384}",":mx_claus_light_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F384}",":mx_claus_tone2:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F384}",":mx_claus_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F384}",":mx_claus_tone3:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F384}",":mx_claus_medium_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F384}",":mx_claus_tone4:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F384}",":mx_claus_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F384}",":mx_claus_tone5:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F384}",":mx_claus_dark_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F384}",":mrs_claus:":"\u{1F936}",":mother_christmas:":"\u{1F936}",":mrs_claus_tone1:":"\u{1F936}\u{1F3FB}",":mother_christmas_tone1:":"\u{1F936}\u{1F3FB}",":mrs_claus_tone2:":"\u{1F936}\u{1F3FC}",":mother_christmas_tone2:":"\u{1F936}\u{1F3FC}",":mrs_claus_tone3:":"\u{1F936}\u{1F3FD}",":mother_christmas_tone3:":"\u{1F936}\u{1F3FD}",":mrs_claus_tone4:":"\u{1F936}\u{1F3FE}",":mother_christmas_tone4:":"\u{1F936}\u{1F3FE}",":mrs_claus_tone5:":"\u{1F936}\u{1F3FF}",":mother_christmas_tone5:":"\u{1F936}\u{1F3FF}",":santa:":"\u{1F385}",":santa_tone1:":"\u{1F385}\u{1F3FB}",":santa_tone2:":"\u{1F385}\u{1F3FC}",":santa_tone3:":"\u{1F385}\u{1F3FD}",":santa_tone4:":"\u{1F385}\u{1F3FE}",":santa_tone5:":"\u{1F385}\u{1F3FF}",":mage:":"\u{1F9D9}",":mage_tone1:":"\u{1F9D9}\u{1F3FB}",":mage_light_skin_tone:":"\u{1F9D9}\u{1F3FB}",":mage_tone2:":"\u{1F9D9}\u{1F3FC}",":mage_medium_light_skin_tone:":"\u{1F9D9}\u{1F3FC}",":mage_tone3:":"\u{1F9D9}\u{1F3FD}",":mage_medium_skin_tone:":"\u{1F9D9}\u{1F3FD}",":mage_tone4:":"\u{1F9D9}\u{1F3FE}",":mage_medium_dark_skin_tone:":"\u{1F9D9}\u{1F3FE}",":mage_tone5:":"\u{1F9D9}\u{1F3FF}",":mage_dark_skin_tone:":"\u{1F9D9}\u{1F3FF}",":woman_mage:":"\u{1F9D9}\u200D\u2640\uFE0F",":woman_mage_tone1:":"\u{1F9D9}\u{1F3FB}\u200D\u2640\uFE0F",":woman_mage_light_skin_tone:":"\u{1F9D9}\u{1F3FB}\u200D\u2640\uFE0F",":woman_mage_tone2:":"\u{1F9D9}\u{1F3FC}\u200D\u2640\uFE0F",":woman_mage_medium_light_skin_tone:":"\u{1F9D9}\u{1F3FC}\u200D\u2640\uFE0F",":woman_mage_tone3:":"\u{1F9D9}\u{1F3FD}\u200D\u2640\uFE0F",":woman_mage_medium_skin_tone:":"\u{1F9D9}\u{1F3FD}\u200D\u2640\uFE0F",":woman_mage_tone4:":"\u{1F9D9}\u{1F3FE}\u200D\u2640\uFE0F",":woman_mage_medium_dark_skin_tone:":"\u{1F9D9}\u{1F3FE}\u200D\u2640\uFE0F",":woman_mage_tone5:":"\u{1F9D9}\u{1F3FF}\u200D\u2640\uFE0F",":woman_mage_dark_skin_tone:":"\u{1F9D9}\u{1F3FF}\u200D\u2640\uFE0F",":man_mage:":"\u{1F9D9}\u200D\u2642\uFE0F",":man_mage_tone1:":"\u{1F9D9}\u{1F3FB}\u200D\u2642\uFE0F",":man_mage_light_skin_tone:":"\u{1F9D9}\u{1F3FB}\u200D\u2642\uFE0F",":man_mage_tone2:":"\u{1F9D9}\u{1F3FC}\u200D\u2642\uFE0F",":man_mage_medium_light_skin_tone:":"\u{1F9D9}\u{1F3FC}\u200D\u2642\uFE0F",":man_mage_tone3:":"\u{1F9D9}\u{1F3FD}\u200D\u2642\uFE0F",":man_mage_medium_skin_tone:":"\u{1F9D9}\u{1F3FD}\u200D\u2642\uFE0F",":man_mage_tone4:":"\u{1F9D9}\u{1F3FE}\u200D\u2642\uFE0F",":man_mage_medium_dark_skin_tone:":"\u{1F9D9}\u{1F3FE}\u200D\u2642\uFE0F",":man_mage_tone5:":"\u{1F9D9}\u{1F3FF}\u200D\u2642\uFE0F",":man_mage_dark_skin_tone:":"\u{1F9D9}\u{1F3FF}\u200D\u2642\uFE0F",":elf:":"\u{1F9DD}",":elf_tone1:":"\u{1F9DD}\u{1F3FB}",":elf_light_skin_tone:":"\u{1F9DD}\u{1F3FB}",":elf_tone2:":"\u{1F9DD}\u{1F3FC}",":elf_medium_light_skin_tone:":"\u{1F9DD}\u{1F3FC}",":elf_tone3:":"\u{1F9DD}\u{1F3FD}",":elf_medium_skin_tone:":"\u{1F9DD}\u{1F3FD}",":elf_tone4:":"\u{1F9DD}\u{1F3FE}",":elf_medium_dark_skin_tone:":"\u{1F9DD}\u{1F3FE}",":elf_tone5:":"\u{1F9DD}\u{1F3FF}",":elf_dark_skin_tone:":"\u{1F9DD}\u{1F3FF}",":woman_elf:":"\u{1F9DD}\u200D\u2640\uFE0F",":woman_elf_tone1:":"\u{1F9DD}\u{1F3FB}\u200D\u2640\uFE0F",":woman_elf_light_skin_tone:":"\u{1F9DD}\u{1F3FB}\u200D\u2640\uFE0F",":woman_elf_tone2:":"\u{1F9DD}\u{1F3FC}\u200D\u2640\uFE0F",":woman_elf_medium_light_skin_tone:":"\u{1F9DD}\u{1F3FC}\u200D\u2640\uFE0F",":woman_elf_tone3:":"\u{1F9DD}\u{1F3FD}\u200D\u2640\uFE0F",":woman_elf_medium_skin_tone:":"\u{1F9DD}\u{1F3FD}\u200D\u2640\uFE0F",":woman_elf_tone4:":"\u{1F9DD}\u{1F3FE}\u200D\u2640\uFE0F",":woman_elf_medium_dark_skin_tone:":"\u{1F9DD}\u{1F3FE}\u200D\u2640\uFE0F",":woman_elf_tone5:":"\u{1F9DD}\u{1F3FF}\u200D\u2640\uFE0F",":woman_elf_dark_skin_tone:":"\u{1F9DD}\u{1F3FF}\u200D\u2640\uFE0F",":man_elf:":"\u{1F9DD}\u200D\u2642\uFE0F",":man_elf_tone1:":"\u{1F9DD}\u{1F3FB}\u200D\u2642\uFE0F",":man_elf_light_skin_tone:":"\u{1F9DD}\u{1F3FB}\u200D\u2642\uFE0F",":man_elf_tone2:":"\u{1F9DD}\u{1F3FC}\u200D\u2642\uFE0F",":man_elf_medium_light_skin_tone:":"\u{1F9DD}\u{1F3FC}\u200D\u2642\uFE0F",":man_elf_tone3:":"\u{1F9DD}\u{1F3FD}\u200D\u2642\uFE0F",":man_elf_medium_skin_tone:":"\u{1F9DD}\u{1F3FD}\u200D\u2642\uFE0F",":man_elf_tone4:":"\u{1F9DD}\u{1F3FE}\u200D\u2642\uFE0F",":man_elf_medium_dark_skin_tone:":"\u{1F9DD}\u{1F3FE}\u200D\u2642\uFE0F",":man_elf_tone5:":"\u{1F9DD}\u{1F3FF}\u200D\u2642\uFE0F",":man_elf_dark_skin_tone:":"\u{1F9DD}\u{1F3FF}\u200D\u2642\uFE0F",":vampire:":"\u{1F9DB}",":vampire_tone1:":"\u{1F9DB}\u{1F3FB}",":vampire_light_skin_tone:":"\u{1F9DB}\u{1F3FB}",":vampire_tone2:":"\u{1F9DB}\u{1F3FC}",":vampire_medium_light_skin_tone:":"\u{1F9DB}\u{1F3FC}",":vampire_tone3:":"\u{1F9DB}\u{1F3FD}",":vampire_medium_skin_tone:":"\u{1F9DB}\u{1F3FD}",":vampire_tone4:":"\u{1F9DB}\u{1F3FE}",":vampire_medium_dark_skin_tone:":"\u{1F9DB}\u{1F3FE}",":vampire_tone5:":"\u{1F9DB}\u{1F3FF}",":vampire_dark_skin_tone:":"\u{1F9DB}\u{1F3FF}",":woman_vampire:":"\u{1F9DB}\u200D\u2640\uFE0F",":woman_vampire_tone1:":"\u{1F9DB}\u{1F3FB}\u200D\u2640\uFE0F",":woman_vampire_light_skin_tone:":"\u{1F9DB}\u{1F3FB}\u200D\u2640\uFE0F",":woman_vampire_tone2:":"\u{1F9DB}\u{1F3FC}\u200D\u2640\uFE0F",":woman_vampire_medium_light_skin_tone:":"\u{1F9DB}\u{1F3FC}\u200D\u2640\uFE0F",":woman_vampire_tone3:":"\u{1F9DB}\u{1F3FD}\u200D\u2640\uFE0F",":woman_vampire_medium_skin_tone:":"\u{1F9DB}\u{1F3FD}\u200D\u2640\uFE0F",":woman_vampire_tone4:":"\u{1F9DB}\u{1F3FE}\u200D\u2640\uFE0F",":woman_vampire_medium_dark_skin_tone:":"\u{1F9DB}\u{1F3FE}\u200D\u2640\uFE0F",":woman_vampire_tone5:":"\u{1F9DB}\u{1F3FF}\u200D\u2640\uFE0F",":woman_vampire_dark_skin_tone:":"\u{1F9DB}\u{1F3FF}\u200D\u2640\uFE0F",":man_vampire:":"\u{1F9DB}\u200D\u2642\uFE0F",":man_vampire_tone1:":"\u{1F9DB}\u{1F3FB}\u200D\u2642\uFE0F",":man_vampire_light_skin_tone:":"\u{1F9DB}\u{1F3FB}\u200D\u2642\uFE0F",":man_vampire_tone2:":"\u{1F9DB}\u{1F3FC}\u200D\u2642\uFE0F",":man_vampire_medium_light_skin_tone:":"\u{1F9DB}\u{1F3FC}\u200D\u2642\uFE0F",":man_vampire_tone3:":"\u{1F9DB}\u{1F3FD}\u200D\u2642\uFE0F",":man_vampire_medium_skin_tone:":"\u{1F9DB}\u{1F3FD}\u200D\u2642\uFE0F",":man_vampire_tone4:":"\u{1F9DB}\u{1F3FE}\u200D\u2642\uFE0F",":man_vampire_medium_dark_skin_tone:":"\u{1F9DB}\u{1F3FE}\u200D\u2642\uFE0F",":man_vampire_tone5:":"\u{1F9DB}\u{1F3FF}\u200D\u2642\uFE0F",":man_vampire_dark_skin_tone:":"\u{1F9DB}\u{1F3FF}\u200D\u2642\uFE0F",":zombie:":"\u{1F9DF}",":woman_zombie:":"\u{1F9DF}\u200D\u2640\uFE0F",":man_zombie:":"\u{1F9DF}\u200D\u2642\uFE0F",":genie:":"\u{1F9DE}",":woman_genie:":"\u{1F9DE}\u200D\u2640\uFE0F",":man_genie:":"\u{1F9DE}\u200D\u2642\uFE0F",":merperson:":"\u{1F9DC}",":merperson_tone1:":"\u{1F9DC}\u{1F3FB}",":merperson_light_skin_tone:":"\u{1F9DC}\u{1F3FB}",":merperson_tone2:":"\u{1F9DC}\u{1F3FC}",":merperson_medium_light_skin_tone:":"\u{1F9DC}\u{1F3FC}",":merperson_tone3:":"\u{1F9DC}\u{1F3FD}",":merperson_medium_skin_tone:":"\u{1F9DC}\u{1F3FD}",":merperson_tone4:":"\u{1F9DC}\u{1F3FE}",":merperson_medium_dark_skin_tone:":"\u{1F9DC}\u{1F3FE}",":merperson_tone5:":"\u{1F9DC}\u{1F3FF}",":merperson_dark_skin_tone:":"\u{1F9DC}\u{1F3FF}",":mermaid:":"\u{1F9DC}\u200D\u2640\uFE0F",":mermaid_tone1:":"\u{1F9DC}\u{1F3FB}\u200D\u2640\uFE0F",":mermaid_light_skin_tone:":"\u{1F9DC}\u{1F3FB}\u200D\u2640\uFE0F",":mermaid_tone2:":"\u{1F9DC}\u{1F3FC}\u200D\u2640\uFE0F",":mermaid_medium_light_skin_tone:":"\u{1F9DC}\u{1F3FC}\u200D\u2640\uFE0F",":mermaid_tone3:":"\u{1F9DC}\u{1F3FD}\u200D\u2640\uFE0F",":mermaid_medium_skin_tone:":"\u{1F9DC}\u{1F3FD}\u200D\u2640\uFE0F",":mermaid_tone4:":"\u{1F9DC}\u{1F3FE}\u200D\u2640\uFE0F",":mermaid_medium_dark_skin_tone:":"\u{1F9DC}\u{1F3FE}\u200D\u2640\uFE0F",":mermaid_tone5:":"\u{1F9DC}\u{1F3FF}\u200D\u2640\uFE0F",":mermaid_dark_skin_tone:":"\u{1F9DC}\u{1F3FF}\u200D\u2640\uFE0F",":merman:":"\u{1F9DC}\u200D\u2642\uFE0F",":merman_tone1:":"\u{1F9DC}\u{1F3FB}\u200D\u2642\uFE0F",":merman_light_skin_tone:":"\u{1F9DC}\u{1F3FB}\u200D\u2642\uFE0F",":merman_tone2:":"\u{1F9DC}\u{1F3FC}\u200D\u2642\uFE0F",":merman_medium_light_skin_tone:":"\u{1F9DC}\u{1F3FC}\u200D\u2642\uFE0F",":merman_tone3:":"\u{1F9DC}\u{1F3FD}\u200D\u2642\uFE0F",":merman_medium_skin_tone:":"\u{1F9DC}\u{1F3FD}\u200D\u2642\uFE0F",":merman_tone4:":"\u{1F9DC}\u{1F3FE}\u200D\u2642\uFE0F",":merman_medium_dark_skin_tone:":"\u{1F9DC}\u{1F3FE}\u200D\u2642\uFE0F",":merman_tone5:":"\u{1F9DC}\u{1F3FF}\u200D\u2642\uFE0F",":merman_dark_skin_tone:":"\u{1F9DC}\u{1F3FF}\u200D\u2642\uFE0F",":fairy:":"\u{1F9DA}",":fairy_tone1:":"\u{1F9DA}\u{1F3FB}",":fairy_light_skin_tone:":"\u{1F9DA}\u{1F3FB}",":fairy_tone2:":"\u{1F9DA}\u{1F3FC}",":fairy_medium_light_skin_tone:":"\u{1F9DA}\u{1F3FC}",":fairy_tone3:":"\u{1F9DA}\u{1F3FD}",":fairy_medium_skin_tone:":"\u{1F9DA}\u{1F3FD}",":fairy_tone4:":"\u{1F9DA}\u{1F3FE}",":fairy_medium_dark_skin_tone:":"\u{1F9DA}\u{1F3FE}",":fairy_tone5:":"\u{1F9DA}\u{1F3FF}",":fairy_dark_skin_tone:":"\u{1F9DA}\u{1F3FF}",":woman_fairy:":"\u{1F9DA}\u200D\u2640\uFE0F",":woman_fairy_tone1:":"\u{1F9DA}\u{1F3FB}\u200D\u2640\uFE0F",":woman_fairy_light_skin_tone:":"\u{1F9DA}\u{1F3FB}\u200D\u2640\uFE0F",":woman_fairy_tone2:":"\u{1F9DA}\u{1F3FC}\u200D\u2640\uFE0F",":woman_fairy_medium_light_skin_tone:":"\u{1F9DA}\u{1F3FC}\u200D\u2640\uFE0F",":woman_fairy_tone3:":"\u{1F9DA}\u{1F3FD}\u200D\u2640\uFE0F",":woman_fairy_medium_skin_tone:":"\u{1F9DA}\u{1F3FD}\u200D\u2640\uFE0F",":woman_fairy_tone4:":"\u{1F9DA}\u{1F3FE}\u200D\u2640\uFE0F",":woman_fairy_medium_dark_skin_tone:":"\u{1F9DA}\u{1F3FE}\u200D\u2640\uFE0F",":woman_fairy_tone5:":"\u{1F9DA}\u{1F3FF}\u200D\u2640\uFE0F",":woman_fairy_dark_skin_tone:":"\u{1F9DA}\u{1F3FF}\u200D\u2640\uFE0F",":man_fairy:":"\u{1F9DA}\u200D\u2642\uFE0F",":man_fairy_tone1:":"\u{1F9DA}\u{1F3FB}\u200D\u2642\uFE0F",":man_fairy_light_skin_tone:":"\u{1F9DA}\u{1F3FB}\u200D\u2642\uFE0F",":man_fairy_tone2:":"\u{1F9DA}\u{1F3FC}\u200D\u2642\uFE0F",":man_fairy_medium_light_skin_tone:":"\u{1F9DA}\u{1F3FC}\u200D\u2642\uFE0F",":man_fairy_tone3:":"\u{1F9DA}\u{1F3FD}\u200D\u2642\uFE0F",":man_fairy_medium_skin_tone:":"\u{1F9DA}\u{1F3FD}\u200D\u2642\uFE0F",":man_fairy_tone4:":"\u{1F9DA}\u{1F3FE}\u200D\u2642\uFE0F",":man_fairy_medium_dark_skin_tone:":"\u{1F9DA}\u{1F3FE}\u200D\u2642\uFE0F",":man_fairy_tone5:":"\u{1F9DA}\u{1F3FF}\u200D\u2642\uFE0F",":man_fairy_dark_skin_tone:":"\u{1F9DA}\u{1F3FF}\u200D\u2642\uFE0F",":angel:":"\u{1F47C}",":angel_tone1:":"\u{1F47C}\u{1F3FB}",":angel_tone2:":"\u{1F47C}\u{1F3FC}",":angel_tone3:":"\u{1F47C}\u{1F3FD}",":angel_tone4:":"\u{1F47C}\u{1F3FE}",":angel_tone5:":"\u{1F47C}\u{1F3FF}",":pregnant_woman:":"\u{1F930}",":expecting_woman:":"\u{1F930}",":pregnant_woman_tone1:":"\u{1F930}\u{1F3FB}",":expecting_woman_tone1:":"\u{1F930}\u{1F3FB}",":pregnant_woman_tone2:":"\u{1F930}\u{1F3FC}",":expecting_woman_tone2:":"\u{1F930}\u{1F3FC}",":pregnant_woman_tone3:":"\u{1F930}\u{1F3FD}",":expecting_woman_tone3:":"\u{1F930}\u{1F3FD}",":pregnant_woman_tone4:":"\u{1F930}\u{1F3FE}",":expecting_woman_tone4:":"\u{1F930}\u{1F3FE}",":pregnant_woman_tone5:":"\u{1F930}\u{1F3FF}",":expecting_woman_tone5:":"\u{1F930}\u{1F3FF}",":breast_feeding:":"\u{1F931}",":breast_feeding_tone1:":"\u{1F931}\u{1F3FB}",":breast_feeding_light_skin_tone:":"\u{1F931}\u{1F3FB}",":breast_feeding_tone2:":"\u{1F931}\u{1F3FC}",":breast_feeding_medium_light_skin_tone:":"\u{1F931}\u{1F3FC}",":breast_feeding_tone3:":"\u{1F931}\u{1F3FD}",":breast_feeding_medium_skin_tone:":"\u{1F931}\u{1F3FD}",":breast_feeding_tone4:":"\u{1F931}\u{1F3FE}",":breast_feeding_medium_dark_skin_tone:":"\u{1F931}\u{1F3FE}",":breast_feeding_tone5:":"\u{1F931}\u{1F3FF}",":breast_feeding_dark_skin_tone:":"\u{1F931}\u{1F3FF}",":person_feeding_baby:":"\u{1F9D1}\u200D\u{1F37C}",":person_feeding_baby_tone1:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F37C}",":person_feeding_baby_light_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F37C}",":person_feeding_baby_tone2:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F37C}",":person_feeding_baby_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F37C}",":person_feeding_baby_tone3:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F37C}",":person_feeding_baby_medium_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F37C}",":person_feeding_baby_tone4:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F37C}",":person_feeding_baby_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F37C}",":person_feeding_baby_tone5:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F37C}",":person_feeding_baby_dark_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F37C}",":woman_feeding_baby:":"\u{1F469}\u200D\u{1F37C}",":woman_feeding_baby_tone1:":"\u{1F469}\u{1F3FB}\u200D\u{1F37C}",":woman_feeding_baby_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F37C}",":woman_feeding_baby_tone2:":"\u{1F469}\u{1F3FC}\u200D\u{1F37C}",":woman_feeding_baby_medium_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F37C}",":woman_feeding_baby_tone3:":"\u{1F469}\u{1F3FD}\u200D\u{1F37C}",":woman_feeding_baby_medium_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F37C}",":woman_feeding_baby_tone4:":"\u{1F469}\u{1F3FE}\u200D\u{1F37C}",":woman_feeding_baby_medium_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F37C}",":woman_feeding_baby_tone5:":"\u{1F469}\u{1F3FF}\u200D\u{1F37C}",":woman_feeding_baby_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F37C}",":man_feeding_baby:":"\u{1F468}\u200D\u{1F37C}",":man_feeding_baby_tone1:":"\u{1F468}\u{1F3FB}\u200D\u{1F37C}",":man_feeding_baby_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F37C}",":man_feeding_baby_tone2:":"\u{1F468}\u{1F3FC}\u200D\u{1F37C}",":man_feeding_baby_medium_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F37C}",":man_feeding_baby_tone3:":"\u{1F468}\u{1F3FD}\u200D\u{1F37C}",":man_feeding_baby_medium_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F37C}",":man_feeding_baby_tone4:":"\u{1F468}\u{1F3FE}\u200D\u{1F37C}",":man_feeding_baby_medium_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F37C}",":man_feeding_baby_tone5:":"\u{1F468}\u{1F3FF}\u200D\u{1F37C}",":man_feeding_baby_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F37C}",":person_bowing:":"\u{1F647}",":bow:":"\u{1F647}",":person_bowing_tone1:":"\u{1F647}\u{1F3FB}",":bow_tone1:":"\u{1F647}\u{1F3FB}",":person_bowing_tone2:":"\u{1F647}\u{1F3FC}",":bow_tone2:":"\u{1F647}\u{1F3FC}",":person_bowing_tone3:":"\u{1F647}\u{1F3FD}",":bow_tone3:":"\u{1F647}\u{1F3FD}",":person_bowing_tone4:":"\u{1F647}\u{1F3FE}",":bow_tone4:":"\u{1F647}\u{1F3FE}",":person_bowing_tone5:":"\u{1F647}\u{1F3FF}",":bow_tone5:":"\u{1F647}\u{1F3FF}",":woman_bowing:":"\u{1F647}\u200D\u2640\uFE0F",":woman_bowing_tone1:":"\u{1F647}\u{1F3FB}\u200D\u2640\uFE0F",":woman_bowing_light_skin_tone:":"\u{1F647}\u{1F3FB}\u200D\u2640\uFE0F",":woman_bowing_tone2:":"\u{1F647}\u{1F3FC}\u200D\u2640\uFE0F",":woman_bowing_medium_light_skin_tone:":"\u{1F647}\u{1F3FC}\u200D\u2640\uFE0F",":woman_bowing_tone3:":"\u{1F647}\u{1F3FD}\u200D\u2640\uFE0F",":woman_bowing_medium_skin_tone:":"\u{1F647}\u{1F3FD}\u200D\u2640\uFE0F",":woman_bowing_tone4:":"\u{1F647}\u{1F3FE}\u200D\u2640\uFE0F",":woman_bowing_medium_dark_skin_tone:":"\u{1F647}\u{1F3FE}\u200D\u2640\uFE0F",":woman_bowing_tone5:":"\u{1F647}\u{1F3FF}\u200D\u2640\uFE0F",":woman_bowing_dark_skin_tone:":"\u{1F647}\u{1F3FF}\u200D\u2640\uFE0F",":man_bowing:":"\u{1F647}\u200D\u2642\uFE0F",":man_bowing_tone1:":"\u{1F647}\u{1F3FB}\u200D\u2642\uFE0F",":man_bowing_light_skin_tone:":"\u{1F647}\u{1F3FB}\u200D\u2642\uFE0F",":man_bowing_tone2:":"\u{1F647}\u{1F3FC}\u200D\u2642\uFE0F",":man_bowing_medium_light_skin_tone:":"\u{1F647}\u{1F3FC}\u200D\u2642\uFE0F",":man_bowing_tone3:":"\u{1F647}\u{1F3FD}\u200D\u2642\uFE0F",":man_bowing_medium_skin_tone:":"\u{1F647}\u{1F3FD}\u200D\u2642\uFE0F",":man_bowing_tone4:":"\u{1F647}\u{1F3FE}\u200D\u2642\uFE0F",":man_bowing_medium_dark_skin_tone:":"\u{1F647}\u{1F3FE}\u200D\u2642\uFE0F",":man_bowing_tone5:":"\u{1F647}\u{1F3FF}\u200D\u2642\uFE0F",":man_bowing_dark_skin_tone:":"\u{1F647}\u{1F3FF}\u200D\u2642\uFE0F",":person_tipping_hand:":"\u{1F481}",":information_desk_person:":"\u{1F481}",":person_tipping_hand_tone1:":"\u{1F481}\u{1F3FB}",":information_desk_person_tone1:":"\u{1F481}\u{1F3FB}",":person_tipping_hand_tone2:":"\u{1F481}\u{1F3FC}",":information_desk_person_tone2:":"\u{1F481}\u{1F3FC}",":person_tipping_hand_tone3:":"\u{1F481}\u{1F3FD}",":information_desk_person_tone3:":"\u{1F481}\u{1F3FD}",":person_tipping_hand_tone4:":"\u{1F481}\u{1F3FE}",":information_desk_person_tone4:":"\u{1F481}\u{1F3FE}",":person_tipping_hand_tone5:":"\u{1F481}\u{1F3FF}",":information_desk_person_tone5:":"\u{1F481}\u{1F3FF}",":woman_tipping_hand:":"\u{1F481}\u200D\u2640\uFE0F",":woman_tipping_hand_tone1:":"\u{1F481}\u{1F3FB}\u200D\u2640\uFE0F",":woman_tipping_hand_light_skin_tone:":"\u{1F481}\u{1F3FB}\u200D\u2640\uFE0F",":woman_tipping_hand_tone2:":"\u{1F481}\u{1F3FC}\u200D\u2640\uFE0F",":woman_tipping_hand_medium_light_skin_tone:":"\u{1F481}\u{1F3FC}\u200D\u2640\uFE0F",":woman_tipping_hand_tone3:":"\u{1F481}\u{1F3FD}\u200D\u2640\uFE0F",":woman_tipping_hand_medium_skin_tone:":"\u{1F481}\u{1F3FD}\u200D\u2640\uFE0F",":woman_tipping_hand_tone4:":"\u{1F481}\u{1F3FE}\u200D\u2640\uFE0F",":woman_tipping_hand_medium_dark_skin_tone:":"\u{1F481}\u{1F3FE}\u200D\u2640\uFE0F",":woman_tipping_hand_tone5:":"\u{1F481}\u{1F3FF}\u200D\u2640\uFE0F",":woman_tipping_hand_dark_skin_tone:":"\u{1F481}\u{1F3FF}\u200D\u2640\uFE0F",":man_tipping_hand:":"\u{1F481}\u200D\u2642\uFE0F",":man_tipping_hand_tone1:":"\u{1F481}\u{1F3FB}\u200D\u2642\uFE0F",":man_tipping_hand_light_skin_tone:":"\u{1F481}\u{1F3FB}\u200D\u2642\uFE0F",":man_tipping_hand_tone2:":"\u{1F481}\u{1F3FC}\u200D\u2642\uFE0F",":man_tipping_hand_medium_light_skin_tone:":"\u{1F481}\u{1F3FC}\u200D\u2642\uFE0F",":man_tipping_hand_tone3:":"\u{1F481}\u{1F3FD}\u200D\u2642\uFE0F",":man_tipping_hand_medium_skin_tone:":"\u{1F481}\u{1F3FD}\u200D\u2642\uFE0F",":man_tipping_hand_tone4:":"\u{1F481}\u{1F3FE}\u200D\u2642\uFE0F",":man_tipping_hand_medium_dark_skin_tone:":"\u{1F481}\u{1F3FE}\u200D\u2642\uFE0F",":man_tipping_hand_tone5:":"\u{1F481}\u{1F3FF}\u200D\u2642\uFE0F",":man_tipping_hand_dark_skin_tone:":"\u{1F481}\u{1F3FF}\u200D\u2642\uFE0F",":person_gesturing_no:":"\u{1F645}",":no_good:":"\u{1F645}",":person_gesturing_no_tone1:":"\u{1F645}\u{1F3FB}",":no_good_tone1:":"\u{1F645}\u{1F3FB}",":person_gesturing_no_tone2:":"\u{1F645}\u{1F3FC}",":no_good_tone2:":"\u{1F645}\u{1F3FC}",":person_gesturing_no_tone3:":"\u{1F645}\u{1F3FD}",":no_good_tone3:":"\u{1F645}\u{1F3FD}",":person_gesturing_no_tone4:":"\u{1F645}\u{1F3FE}",":no_good_tone4:":"\u{1F645}\u{1F3FE}",":person_gesturing_no_tone5:":"\u{1F645}\u{1F3FF}",":no_good_tone5:":"\u{1F645}\u{1F3FF}",":woman_gesturing_no:":"\u{1F645}\u200D\u2640\uFE0F",":woman_gesturing_no_tone1:":"\u{1F645}\u{1F3FB}\u200D\u2640\uFE0F",":woman_gesturing_no_light_skin_tone:":"\u{1F645}\u{1F3FB}\u200D\u2640\uFE0F",":woman_gesturing_no_tone2:":"\u{1F645}\u{1F3FC}\u200D\u2640\uFE0F",":woman_gesturing_no_medium_light_skin_tone:":"\u{1F645}\u{1F3FC}\u200D\u2640\uFE0F",":woman_gesturing_no_tone3:":"\u{1F645}\u{1F3FD}\u200D\u2640\uFE0F",":woman_gesturing_no_medium_skin_tone:":"\u{1F645}\u{1F3FD}\u200D\u2640\uFE0F",":woman_gesturing_no_tone4:":"\u{1F645}\u{1F3FE}\u200D\u2640\uFE0F",":woman_gesturing_no_medium_dark_skin_tone:":"\u{1F645}\u{1F3FE}\u200D\u2640\uFE0F",":woman_gesturing_no_tone5:":"\u{1F645}\u{1F3FF}\u200D\u2640\uFE0F",":woman_gesturing_no_dark_skin_tone:":"\u{1F645}\u{1F3FF}\u200D\u2640\uFE0F",":man_gesturing_no:":"\u{1F645}\u200D\u2642\uFE0F",":man_gesturing_no_tone1:":"\u{1F645}\u{1F3FB}\u200D\u2642\uFE0F",":man_gesturing_no_light_skin_tone:":"\u{1F645}\u{1F3FB}\u200D\u2642\uFE0F",":man_gesturing_no_tone2:":"\u{1F645}\u{1F3FC}\u200D\u2642\uFE0F",":man_gesturing_no_medium_light_skin_tone:":"\u{1F645}\u{1F3FC}\u200D\u2642\uFE0F",":man_gesturing_no_tone3:":"\u{1F645}\u{1F3FD}\u200D\u2642\uFE0F",":man_gesturing_no_medium_skin_tone:":"\u{1F645}\u{1F3FD}\u200D\u2642\uFE0F",":man_gesturing_no_tone4:":"\u{1F645}\u{1F3FE}\u200D\u2642\uFE0F",":man_gesturing_no_medium_dark_skin_tone:":"\u{1F645}\u{1F3FE}\u200D\u2642\uFE0F",":man_gesturing_no_tone5:":"\u{1F645}\u{1F3FF}\u200D\u2642\uFE0F",":man_gesturing_no_dark_skin_tone:":"\u{1F645}\u{1F3FF}\u200D\u2642\uFE0F",":person_gesturing_ok:":"\u{1F646}",":ok_woman:":"\u{1F646}",":person_gesturing_ok_tone1:":"\u{1F646}\u{1F3FB}",":ok_woman_tone1:":"\u{1F646}\u{1F3FB}",":person_gesturing_ok_tone2:":"\u{1F646}\u{1F3FC}",":ok_woman_tone2:":"\u{1F646}\u{1F3FC}",":person_gesturing_ok_tone3:":"\u{1F646}\u{1F3FD}",":ok_woman_tone3:":"\u{1F646}\u{1F3FD}",":person_gesturing_ok_tone4:":"\u{1F646}\u{1F3FE}",":ok_woman_tone4:":"\u{1F646}\u{1F3FE}",":person_gesturing_ok_tone5:":"\u{1F646}\u{1F3FF}",":ok_woman_tone5:":"\u{1F646}\u{1F3FF}",":woman_gesturing_ok:":"\u{1F646}\u200D\u2640\uFE0F",":woman_gesturing_ok_tone1:":"\u{1F646}\u{1F3FB}\u200D\u2640\uFE0F",":woman_gesturing_ok_light_skin_tone:":"\u{1F646}\u{1F3FB}\u200D\u2640\uFE0F",":woman_gesturing_ok_tone2:":"\u{1F646}\u{1F3FC}\u200D\u2640\uFE0F",":woman_gesturing_ok_medium_light_skin_tone:":"\u{1F646}\u{1F3FC}\u200D\u2640\uFE0F",":woman_gesturing_ok_tone3:":"\u{1F646}\u{1F3FD}\u200D\u2640\uFE0F",":woman_gesturing_ok_medium_skin_tone:":"\u{1F646}\u{1F3FD}\u200D\u2640\uFE0F",":woman_gesturing_ok_tone4:":"\u{1F646}\u{1F3FE}\u200D\u2640\uFE0F",":woman_gesturing_ok_medium_dark_skin_tone:":"\u{1F646}\u{1F3FE}\u200D\u2640\uFE0F",":woman_gesturing_ok_tone5:":"\u{1F646}\u{1F3FF}\u200D\u2640\uFE0F",":woman_gesturing_ok_dark_skin_tone:":"\u{1F646}\u{1F3FF}\u200D\u2640\uFE0F",":man_gesturing_ok:":"\u{1F646}\u200D\u2642\uFE0F",":man_gesturing_ok_tone1:":"\u{1F646}\u{1F3FB}\u200D\u2642\uFE0F",":man_gesturing_ok_light_skin_tone:":"\u{1F646}\u{1F3FB}\u200D\u2642\uFE0F",":man_gesturing_ok_tone2:":"\u{1F646}\u{1F3FC}\u200D\u2642\uFE0F",":man_gesturing_ok_medium_light_skin_tone:":"\u{1F646}\u{1F3FC}\u200D\u2642\uFE0F",":man_gesturing_ok_tone3:":"\u{1F646}\u{1F3FD}\u200D\u2642\uFE0F",":man_gesturing_ok_medium_skin_tone:":"\u{1F646}\u{1F3FD}\u200D\u2642\uFE0F",":man_gesturing_ok_tone4:":"\u{1F646}\u{1F3FE}\u200D\u2642\uFE0F",":man_gesturing_ok_medium_dark_skin_tone:":"\u{1F646}\u{1F3FE}\u200D\u2642\uFE0F",":man_gesturing_ok_tone5:":"\u{1F646}\u{1F3FF}\u200D\u2642\uFE0F",":man_gesturing_ok_dark_skin_tone:":"\u{1F646}\u{1F3FF}\u200D\u2642\uFE0F",":person_raising_hand:":"\u{1F64B}",":raising_hand:":"\u{1F64B}",":person_raising_hand_tone1:":"\u{1F64B}\u{1F3FB}",":raising_hand_tone1:":"\u{1F64B}\u{1F3FB}",":person_raising_hand_tone2:":"\u{1F64B}\u{1F3FC}",":raising_hand_tone2:":"\u{1F64B}\u{1F3FC}",":person_raising_hand_tone3:":"\u{1F64B}\u{1F3FD}",":raising_hand_tone3:":"\u{1F64B}\u{1F3FD}",":person_raising_hand_tone4:":"\u{1F64B}\u{1F3FE}",":raising_hand_tone4:":"\u{1F64B}\u{1F3FE}",":person_raising_hand_tone5:":"\u{1F64B}\u{1F3FF}",":raising_hand_tone5:":"\u{1F64B}\u{1F3FF}",":woman_raising_hand:":"\u{1F64B}\u200D\u2640\uFE0F",":woman_raising_hand_tone1:":"\u{1F64B}\u{1F3FB}\u200D\u2640\uFE0F",":woman_raising_hand_light_skin_tone:":"\u{1F64B}\u{1F3FB}\u200D\u2640\uFE0F",":woman_raising_hand_tone2:":"\u{1F64B}\u{1F3FC}\u200D\u2640\uFE0F",":woman_raising_hand_medium_light_skin_tone:":"\u{1F64B}\u{1F3FC}\u200D\u2640\uFE0F",":woman_raising_hand_tone3:":"\u{1F64B}\u{1F3FD}\u200D\u2640\uFE0F",":woman_raising_hand_medium_skin_tone:":"\u{1F64B}\u{1F3FD}\u200D\u2640\uFE0F",":woman_raising_hand_tone4:":"\u{1F64B}\u{1F3FE}\u200D\u2640\uFE0F",":woman_raising_hand_medium_dark_skin_tone:":"\u{1F64B}\u{1F3FE}\u200D\u2640\uFE0F",":woman_raising_hand_tone5:":"\u{1F64B}\u{1F3FF}\u200D\u2640\uFE0F",":woman_raising_hand_dark_skin_tone:":"\u{1F64B}\u{1F3FF}\u200D\u2640\uFE0F",":man_raising_hand:":"\u{1F64B}\u200D\u2642\uFE0F",":man_raising_hand_tone1:":"\u{1F64B}\u{1F3FB}\u200D\u2642\uFE0F",":man_raising_hand_light_skin_tone:":"\u{1F64B}\u{1F3FB}\u200D\u2642\uFE0F",":man_raising_hand_tone2:":"\u{1F64B}\u{1F3FC}\u200D\u2642\uFE0F",":man_raising_hand_medium_light_skin_tone:":"\u{1F64B}\u{1F3FC}\u200D\u2642\uFE0F",":man_raising_hand_tone3:":"\u{1F64B}\u{1F3FD}\u200D\u2642\uFE0F",":man_raising_hand_medium_skin_tone:":"\u{1F64B}\u{1F3FD}\u200D\u2642\uFE0F",":man_raising_hand_tone4:":"\u{1F64B}\u{1F3FE}\u200D\u2642\uFE0F",":man_raising_hand_medium_dark_skin_tone:":"\u{1F64B}\u{1F3FE}\u200D\u2642\uFE0F",":man_raising_hand_tone5:":"\u{1F64B}\u{1F3FF}\u200D\u2642\uFE0F",":man_raising_hand_dark_skin_tone:":"\u{1F64B}\u{1F3FF}\u200D\u2642\uFE0F",":deaf_person:":"\u{1F9CF}",":deaf_person_tone1:":"\u{1F9CF}\u{1F3FB}",":deaf_person_light_skin_tone:":"\u{1F9CF}\u{1F3FB}",":deaf_person_tone2:":"\u{1F9CF}\u{1F3FC}",":deaf_person_medium_light_skin_tone:":"\u{1F9CF}\u{1F3FC}",":deaf_person_tone3:":"\u{1F9CF}\u{1F3FD}",":deaf_person_medium_skin_tone:":"\u{1F9CF}\u{1F3FD}",":deaf_person_tone4:":"\u{1F9CF}\u{1F3FE}",":deaf_person_medium_dark_skin_tone:":"\u{1F9CF}\u{1F3FE}",":deaf_person_tone5:":"\u{1F9CF}\u{1F3FF}",":deaf_person_dark_skin_tone:":"\u{1F9CF}\u{1F3FF}",":deaf_woman:":"\u{1F9CF}\u200D\u2640\uFE0F",":deaf_woman_tone1:":"\u{1F9CF}\u{1F3FB}\u200D\u2640\uFE0F",":deaf_woman_light_skin_tone:":"\u{1F9CF}\u{1F3FB}\u200D\u2640\uFE0F",":deaf_woman_tone2:":"\u{1F9CF}\u{1F3FC}\u200D\u2640\uFE0F",":deaf_woman_medium_light_skin_tone:":"\u{1F9CF}\u{1F3FC}\u200D\u2640\uFE0F",":deaf_woman_tone3:":"\u{1F9CF}\u{1F3FD}\u200D\u2640\uFE0F",":deaf_woman_medium_skin_tone:":"\u{1F9CF}\u{1F3FD}\u200D\u2640\uFE0F",":deaf_woman_tone4:":"\u{1F9CF}\u{1F3FE}\u200D\u2640\uFE0F",":deaf_woman_medium_dark_skin_tone:":"\u{1F9CF}\u{1F3FE}\u200D\u2640\uFE0F",":deaf_woman_tone5:":"\u{1F9CF}\u{1F3FF}\u200D\u2640\uFE0F",":deaf_woman_dark_skin_tone:":"\u{1F9CF}\u{1F3FF}\u200D\u2640\uFE0F",":deaf_man:":"\u{1F9CF}\u200D\u2642\uFE0F",":deaf_man_tone1:":"\u{1F9CF}\u{1F3FB}\u200D\u2642\uFE0F",":deaf_man_light_skin_tone:":"\u{1F9CF}\u{1F3FB}\u200D\u2642\uFE0F",":deaf_man_tone2:":"\u{1F9CF}\u{1F3FC}\u200D\u2642\uFE0F",":deaf_man_medium_light_skin_tone:":"\u{1F9CF}\u{1F3FC}\u200D\u2642\uFE0F",":deaf_man_tone3:":"\u{1F9CF}\u{1F3FD}\u200D\u2642\uFE0F",":deaf_man_medium_skin_tone:":"\u{1F9CF}\u{1F3FD}\u200D\u2642\uFE0F",":deaf_man_tone4:":"\u{1F9CF}\u{1F3FE}\u200D\u2642\uFE0F",":deaf_man_medium_dark_skin_tone:":"\u{1F9CF}\u{1F3FE}\u200D\u2642\uFE0F",":deaf_man_tone5:":"\u{1F9CF}\u{1F3FF}\u200D\u2642\uFE0F",":deaf_man_dark_skin_tone:":"\u{1F9CF}\u{1F3FF}\u200D\u2642\uFE0F",":person_facepalming:":"\u{1F926}",":face_palm:":"\u{1F926}",":facepalm:":"\u{1F926}",":person_facepalming_tone1:":"\u{1F926}\u{1F3FB}",":face_palm_tone1:":"\u{1F926}\u{1F3FB}",":facepalm_tone1:":"\u{1F926}\u{1F3FB}",":person_facepalming_tone2:":"\u{1F926}\u{1F3FC}",":face_palm_tone2:":"\u{1F926}\u{1F3FC}",":facepalm_tone2:":"\u{1F926}\u{1F3FC}",":person_facepalming_tone3:":"\u{1F926}\u{1F3FD}",":face_palm_tone3:":"\u{1F926}\u{1F3FD}",":facepalm_tone3:":"\u{1F926}\u{1F3FD}",":person_facepalming_tone4:":"\u{1F926}\u{1F3FE}",":face_palm_tone4:":"\u{1F926}\u{1F3FE}",":facepalm_tone4:":"\u{1F926}\u{1F3FE}",":person_facepalming_tone5:":"\u{1F926}\u{1F3FF}",":face_palm_tone5:":"\u{1F926}\u{1F3FF}",":facepalm_tone5:":"\u{1F926}\u{1F3FF}",":woman_facepalming:":"\u{1F926}\u200D\u2640\uFE0F",":woman_facepalming_tone1:":"\u{1F926}\u{1F3FB}\u200D\u2640\uFE0F",":woman_facepalming_light_skin_tone:":"\u{1F926}\u{1F3FB}\u200D\u2640\uFE0F",":woman_facepalming_tone2:":"\u{1F926}\u{1F3FC}\u200D\u2640\uFE0F",":woman_facepalming_medium_light_skin_tone:":"\u{1F926}\u{1F3FC}\u200D\u2640\uFE0F",":woman_facepalming_tone3:":"\u{1F926}\u{1F3FD}\u200D\u2640\uFE0F",":woman_facepalming_medium_skin_tone:":"\u{1F926}\u{1F3FD}\u200D\u2640\uFE0F",":woman_facepalming_tone4:":"\u{1F926}\u{1F3FE}\u200D\u2640\uFE0F",":woman_facepalming_medium_dark_skin_tone:":"\u{1F926}\u{1F3FE}\u200D\u2640\uFE0F",":woman_facepalming_tone5:":"\u{1F926}\u{1F3FF}\u200D\u2640\uFE0F",":woman_facepalming_dark_skin_tone:":"\u{1F926}\u{1F3FF}\u200D\u2640\uFE0F",":man_facepalming:":"\u{1F926}\u200D\u2642\uFE0F",":man_facepalming_tone1:":"\u{1F926}\u{1F3FB}\u200D\u2642\uFE0F",":man_facepalming_light_skin_tone:":"\u{1F926}\u{1F3FB}\u200D\u2642\uFE0F",":man_facepalming_tone2:":"\u{1F926}\u{1F3FC}\u200D\u2642\uFE0F",":man_facepalming_medium_light_skin_tone:":"\u{1F926}\u{1F3FC}\u200D\u2642\uFE0F",":man_facepalming_tone3:":"\u{1F926}\u{1F3FD}\u200D\u2642\uFE0F",":man_facepalming_medium_skin_tone:":"\u{1F926}\u{1F3FD}\u200D\u2642\uFE0F",":man_facepalming_tone4:":"\u{1F926}\u{1F3FE}\u200D\u2642\uFE0F",":man_facepalming_medium_dark_skin_tone:":"\u{1F926}\u{1F3FE}\u200D\u2642\uFE0F",":man_facepalming_tone5:":"\u{1F926}\u{1F3FF}\u200D\u2642\uFE0F",":man_facepalming_dark_skin_tone:":"\u{1F926}\u{1F3FF}\u200D\u2642\uFE0F",":person_shrugging:":"\u{1F937}",":shrug:":"\u{1F937}",":person_shrugging_tone1:":"\u{1F937}\u{1F3FB}",":shrug_tone1:":"\u{1F937}\u{1F3FB}",":person_shrugging_tone2:":"\u{1F937}\u{1F3FC}",":shrug_tone2:":"\u{1F937}\u{1F3FC}",":person_shrugging_tone3:":"\u{1F937}\u{1F3FD}",":shrug_tone3:":"\u{1F937}\u{1F3FD}",":person_shrugging_tone4:":"\u{1F937}\u{1F3FE}",":shrug_tone4:":"\u{1F937}\u{1F3FE}",":person_shrugging_tone5:":"\u{1F937}\u{1F3FF}",":shrug_tone5:":"\u{1F937}\u{1F3FF}",":woman_shrugging:":"\u{1F937}\u200D\u2640\uFE0F",":woman_shrugging_tone1:":"\u{1F937}\u{1F3FB}\u200D\u2640\uFE0F",":woman_shrugging_light_skin_tone:":"\u{1F937}\u{1F3FB}\u200D\u2640\uFE0F",":woman_shrugging_tone2:":"\u{1F937}\u{1F3FC}\u200D\u2640\uFE0F",":woman_shrugging_medium_light_skin_tone:":"\u{1F937}\u{1F3FC}\u200D\u2640\uFE0F",":woman_shrugging_tone3:":"\u{1F937}\u{1F3FD}\u200D\u2640\uFE0F",":woman_shrugging_medium_skin_tone:":"\u{1F937}\u{1F3FD}\u200D\u2640\uFE0F",":woman_shrugging_tone4:":"\u{1F937}\u{1F3FE}\u200D\u2640\uFE0F",":woman_shrugging_medium_dark_skin_tone:":"\u{1F937}\u{1F3FE}\u200D\u2640\uFE0F",":woman_shrugging_tone5:":"\u{1F937}\u{1F3FF}\u200D\u2640\uFE0F",":woman_shrugging_dark_skin_tone:":"\u{1F937}\u{1F3FF}\u200D\u2640\uFE0F",":man_shrugging:":"\u{1F937}\u200D\u2642\uFE0F",":man_shrugging_tone1:":"\u{1F937}\u{1F3FB}\u200D\u2642\uFE0F",":man_shrugging_light_skin_tone:":"\u{1F937}\u{1F3FB}\u200D\u2642\uFE0F",":man_shrugging_tone2:":"\u{1F937}\u{1F3FC}\u200D\u2642\uFE0F",":man_shrugging_medium_light_skin_tone:":"\u{1F937}\u{1F3FC}\u200D\u2642\uFE0F",":man_shrugging_tone3:":"\u{1F937}\u{1F3FD}\u200D\u2642\uFE0F",":man_shrugging_medium_skin_tone:":"\u{1F937}\u{1F3FD}\u200D\u2642\uFE0F",":man_shrugging_tone4:":"\u{1F937}\u{1F3FE}\u200D\u2642\uFE0F",":man_shrugging_medium_dark_skin_tone:":"\u{1F937}\u{1F3FE}\u200D\u2642\uFE0F",":man_shrugging_tone5:":"\u{1F937}\u{1F3FF}\u200D\u2642\uFE0F",":man_shrugging_dark_skin_tone:":"\u{1F937}\u{1F3FF}\u200D\u2642\uFE0F",":person_pouting:":"\u{1F64E}",":person_with_pouting_face:":"\u{1F64E}",":person_pouting_tone1:":"\u{1F64E}\u{1F3FB}",":person_with_pouting_face_tone1:":"\u{1F64E}\u{1F3FB}",":person_pouting_tone2:":"\u{1F64E}\u{1F3FC}",":person_with_pouting_face_tone2:":"\u{1F64E}\u{1F3FC}",":person_pouting_tone3:":"\u{1F64E}\u{1F3FD}",":person_with_pouting_face_tone3:":"\u{1F64E}\u{1F3FD}",":person_pouting_tone4:":"\u{1F64E}\u{1F3FE}",":person_with_pouting_face_tone4:":"\u{1F64E}\u{1F3FE}",":person_pouting_tone5:":"\u{1F64E}\u{1F3FF}",":person_with_pouting_face_tone5:":"\u{1F64E}\u{1F3FF}",":woman_pouting:":"\u{1F64E}\u200D\u2640\uFE0F",":woman_pouting_tone1:":"\u{1F64E}\u{1F3FB}\u200D\u2640\uFE0F",":woman_pouting_light_skin_tone:":"\u{1F64E}\u{1F3FB}\u200D\u2640\uFE0F",":woman_pouting_tone2:":"\u{1F64E}\u{1F3FC}\u200D\u2640\uFE0F",":woman_pouting_medium_light_skin_tone:":"\u{1F64E}\u{1F3FC}\u200D\u2640\uFE0F",":woman_pouting_tone3:":"\u{1F64E}\u{1F3FD}\u200D\u2640\uFE0F",":woman_pouting_medium_skin_tone:":"\u{1F64E}\u{1F3FD}\u200D\u2640\uFE0F",":woman_pouting_tone4:":"\u{1F64E}\u{1F3FE}\u200D\u2640\uFE0F",":woman_pouting_medium_dark_skin_tone:":"\u{1F64E}\u{1F3FE}\u200D\u2640\uFE0F",":woman_pouting_tone5:":"\u{1F64E}\u{1F3FF}\u200D\u2640\uFE0F",":woman_pouting_dark_skin_tone:":"\u{1F64E}\u{1F3FF}\u200D\u2640\uFE0F",":man_pouting:":"\u{1F64E}\u200D\u2642\uFE0F",":man_pouting_tone1:":"\u{1F64E}\u{1F3FB}\u200D\u2642\uFE0F",":man_pouting_light_skin_tone:":"\u{1F64E}\u{1F3FB}\u200D\u2642\uFE0F",":man_pouting_tone2:":"\u{1F64E}\u{1F3FC}\u200D\u2642\uFE0F",":man_pouting_medium_light_skin_tone:":"\u{1F64E}\u{1F3FC}\u200D\u2642\uFE0F",":man_pouting_tone3:":"\u{1F64E}\u{1F3FD}\u200D\u2642\uFE0F",":man_pouting_medium_skin_tone:":"\u{1F64E}\u{1F3FD}\u200D\u2642\uFE0F",":man_pouting_tone4:":"\u{1F64E}\u{1F3FE}\u200D\u2642\uFE0F",":man_pouting_medium_dark_skin_tone:":"\u{1F64E}\u{1F3FE}\u200D\u2642\uFE0F",":man_pouting_tone5:":"\u{1F64E}\u{1F3FF}\u200D\u2642\uFE0F",":man_pouting_dark_skin_tone:":"\u{1F64E}\u{1F3FF}\u200D\u2642\uFE0F",":person_frowning:":"\u{1F64D}",":person_frowning_tone1:":"\u{1F64D}\u{1F3FB}",":person_frowning_tone2:":"\u{1F64D}\u{1F3FC}",":person_frowning_tone3:":"\u{1F64D}\u{1F3FD}",":person_frowning_tone4:":"\u{1F64D}\u{1F3FE}",":person_frowning_tone5:":"\u{1F64D}\u{1F3FF}",":woman_frowning:":"\u{1F64D}\u200D\u2640\uFE0F",":woman_frowning_tone1:":"\u{1F64D}\u{1F3FB}\u200D\u2640\uFE0F",":woman_frowning_light_skin_tone:":"\u{1F64D}\u{1F3FB}\u200D\u2640\uFE0F",":woman_frowning_tone2:":"\u{1F64D}\u{1F3FC}\u200D\u2640\uFE0F",":woman_frowning_medium_light_skin_tone:":"\u{1F64D}\u{1F3FC}\u200D\u2640\uFE0F",":woman_frowning_tone3:":"\u{1F64D}\u{1F3FD}\u200D\u2640\uFE0F",":woman_frowning_medium_skin_tone:":"\u{1F64D}\u{1F3FD}\u200D\u2640\uFE0F",":woman_frowning_tone4:":"\u{1F64D}\u{1F3FE}\u200D\u2640\uFE0F",":woman_frowning_medium_dark_skin_tone:":"\u{1F64D}\u{1F3FE}\u200D\u2640\uFE0F",":woman_frowning_tone5:":"\u{1F64D}\u{1F3FF}\u200D\u2640\uFE0F",":woman_frowning_dark_skin_tone:":"\u{1F64D}\u{1F3FF}\u200D\u2640\uFE0F",":man_frowning:":"\u{1F64D}\u200D\u2642\uFE0F",":man_frowning_tone1:":"\u{1F64D}\u{1F3FB}\u200D\u2642\uFE0F",":man_frowning_light_skin_tone:":"\u{1F64D}\u{1F3FB}\u200D\u2642\uFE0F",":man_frowning_tone2:":"\u{1F64D}\u{1F3FC}\u200D\u2642\uFE0F",":man_frowning_medium_light_skin_tone:":"\u{1F64D}\u{1F3FC}\u200D\u2642\uFE0F",":man_frowning_tone3:":"\u{1F64D}\u{1F3FD}\u200D\u2642\uFE0F",":man_frowning_medium_skin_tone:":"\u{1F64D}\u{1F3FD}\u200D\u2642\uFE0F",":man_frowning_tone4:":"\u{1F64D}\u{1F3FE}\u200D\u2642\uFE0F",":man_frowning_medium_dark_skin_tone:":"\u{1F64D}\u{1F3FE}\u200D\u2642\uFE0F",":man_frowning_tone5:":"\u{1F64D}\u{1F3FF}\u200D\u2642\uFE0F",":man_frowning_dark_skin_tone:":"\u{1F64D}\u{1F3FF}\u200D\u2642\uFE0F",":person_getting_haircut:":"\u{1F487}",":haircut:":"\u{1F487}",":person_getting_haircut_tone1:":"\u{1F487}\u{1F3FB}",":haircut_tone1:":"\u{1F487}\u{1F3FB}",":person_getting_haircut_tone2:":"\u{1F487}\u{1F3FC}",":haircut_tone2:":"\u{1F487}\u{1F3FC}",":person_getting_haircut_tone3:":"\u{1F487}\u{1F3FD}",":haircut_tone3:":"\u{1F487}\u{1F3FD}",":person_getting_haircut_tone4:":"\u{1F487}\u{1F3FE}",":haircut_tone4:":"\u{1F487}\u{1F3FE}",":person_getting_haircut_tone5:":"\u{1F487}\u{1F3FF}",":haircut_tone5:":"\u{1F487}\u{1F3FF}",":woman_getting_haircut:":"\u{1F487}\u200D\u2640\uFE0F",":woman_getting_haircut_tone1:":"\u{1F487}\u{1F3FB}\u200D\u2640\uFE0F",":woman_getting_haircut_light_skin_tone:":"\u{1F487}\u{1F3FB}\u200D\u2640\uFE0F",":woman_getting_haircut_tone2:":"\u{1F487}\u{1F3FC}\u200D\u2640\uFE0F",":woman_getting_haircut_medium_light_skin_tone:":"\u{1F487}\u{1F3FC}\u200D\u2640\uFE0F",":woman_getting_haircut_tone3:":"\u{1F487}\u{1F3FD}\u200D\u2640\uFE0F",":woman_getting_haircut_medium_skin_tone:":"\u{1F487}\u{1F3FD}\u200D\u2640\uFE0F",":woman_getting_haircut_tone4:":"\u{1F487}\u{1F3FE}\u200D\u2640\uFE0F",":woman_getting_haircut_medium_dark_skin_tone:":"\u{1F487}\u{1F3FE}\u200D\u2640\uFE0F",":woman_getting_haircut_tone5:":"\u{1F487}\u{1F3FF}\u200D\u2640\uFE0F",":woman_getting_haircut_dark_skin_tone:":"\u{1F487}\u{1F3FF}\u200D\u2640\uFE0F",":man_getting_haircut:":"\u{1F487}\u200D\u2642\uFE0F",":man_getting_haircut_tone1:":"\u{1F487}\u{1F3FB}\u200D\u2642\uFE0F",":man_getting_haircut_light_skin_tone:":"\u{1F487}\u{1F3FB}\u200D\u2642\uFE0F",":man_getting_haircut_tone2:":"\u{1F487}\u{1F3FC}\u200D\u2642\uFE0F",":man_getting_haircut_medium_light_skin_tone:":"\u{1F487}\u{1F3FC}\u200D\u2642\uFE0F",":man_getting_haircut_tone3:":"\u{1F487}\u{1F3FD}\u200D\u2642\uFE0F",":man_getting_haircut_medium_skin_tone:":"\u{1F487}\u{1F3FD}\u200D\u2642\uFE0F",":man_getting_haircut_tone4:":"\u{1F487}\u{1F3FE}\u200D\u2642\uFE0F",":man_getting_haircut_medium_dark_skin_tone:":"\u{1F487}\u{1F3FE}\u200D\u2642\uFE0F",":man_getting_haircut_tone5:":"\u{1F487}\u{1F3FF}\u200D\u2642\uFE0F",":man_getting_haircut_dark_skin_tone:":"\u{1F487}\u{1F3FF}\u200D\u2642\uFE0F",":person_getting_massage:":"\u{1F486}",":massage:":"\u{1F486}",":person_getting_massage_tone1:":"\u{1F486}\u{1F3FB}",":massage_tone1:":"\u{1F486}\u{1F3FB}",":person_getting_massage_tone2:":"\u{1F486}\u{1F3FC}",":massage_tone2:":"\u{1F486}\u{1F3FC}",":person_getting_massage_tone3:":"\u{1F486}\u{1F3FD}",":massage_tone3:":"\u{1F486}\u{1F3FD}",":person_getting_massage_tone4:":"\u{1F486}\u{1F3FE}",":massage_tone4:":"\u{1F486}\u{1F3FE}",":person_getting_massage_tone5:":"\u{1F486}\u{1F3FF}",":massage_tone5:":"\u{1F486}\u{1F3FF}",":woman_getting_face_massage:":"\u{1F486}\u200D\u2640\uFE0F",":woman_getting_face_massage_tone1:":"\u{1F486}\u{1F3FB}\u200D\u2640\uFE0F",":woman_getting_face_massage_light_skin_tone:":"\u{1F486}\u{1F3FB}\u200D\u2640\uFE0F",":woman_getting_face_massage_tone2:":"\u{1F486}\u{1F3FC}\u200D\u2640\uFE0F",":woman_getting_face_massage_medium_light_skin_tone:":"\u{1F486}\u{1F3FC}\u200D\u2640\uFE0F",":woman_getting_face_massage_tone3:":"\u{1F486}\u{1F3FD}\u200D\u2640\uFE0F",":woman_getting_face_massage_medium_skin_tone:":"\u{1F486}\u{1F3FD}\u200D\u2640\uFE0F",":woman_getting_face_massage_tone4:":"\u{1F486}\u{1F3FE}\u200D\u2640\uFE0F",":woman_getting_face_massage_medium_dark_skin_tone:":"\u{1F486}\u{1F3FE}\u200D\u2640\uFE0F",":woman_getting_face_massage_tone5:":"\u{1F486}\u{1F3FF}\u200D\u2640\uFE0F",":woman_getting_face_massage_dark_skin_tone:":"\u{1F486}\u{1F3FF}\u200D\u2640\uFE0F",":man_getting_face_massage:":"\u{1F486}\u200D\u2642\uFE0F",":man_getting_face_massage_tone1:":"\u{1F486}\u{1F3FB}\u200D\u2642\uFE0F",":man_getting_face_massage_light_skin_tone:":"\u{1F486}\u{1F3FB}\u200D\u2642\uFE0F",":man_getting_face_massage_tone2:":"\u{1F486}\u{1F3FC}\u200D\u2642\uFE0F",":man_getting_face_massage_medium_light_skin_tone:":"\u{1F486}\u{1F3FC}\u200D\u2642\uFE0F",":man_getting_face_massage_tone3:":"\u{1F486}\u{1F3FD}\u200D\u2642\uFE0F",":man_getting_face_massage_medium_skin_tone:":"\u{1F486}\u{1F3FD}\u200D\u2642\uFE0F",":man_getting_face_massage_tone4:":"\u{1F486}\u{1F3FE}\u200D\u2642\uFE0F",":man_getting_face_massage_medium_dark_skin_tone:":"\u{1F486}\u{1F3FE}\u200D\u2642\uFE0F",":man_getting_face_massage_tone5:":"\u{1F486}\u{1F3FF}\u200D\u2642\uFE0F",":man_getting_face_massage_dark_skin_tone:":"\u{1F486}\u{1F3FF}\u200D\u2642\uFE0F",":person_in_steamy_room:":"\u{1F9D6}",":person_in_steamy_room_tone1:":"\u{1F9D6}\u{1F3FB}",":person_in_steamy_room_light_skin_tone:":"\u{1F9D6}\u{1F3FB}",":person_in_steamy_room_tone2:":"\u{1F9D6}\u{1F3FC}",":person_in_steamy_room_medium_light_skin_tone:":"\u{1F9D6}\u{1F3FC}",":person_in_steamy_room_tone3:":"\u{1F9D6}\u{1F3FD}",":person_in_steamy_room_medium_skin_tone:":"\u{1F9D6}\u{1F3FD}",":person_in_steamy_room_tone4:":"\u{1F9D6}\u{1F3FE}",":person_in_steamy_room_medium_dark_skin_tone:":"\u{1F9D6}\u{1F3FE}",":person_in_steamy_room_tone5:":"\u{1F9D6}\u{1F3FF}",":person_in_steamy_room_dark_skin_tone:":"\u{1F9D6}\u{1F3FF}",":woman_in_steamy_room:":"\u{1F9D6}\u200D\u2640\uFE0F",":woman_in_steamy_room_tone1:":"\u{1F9D6}\u{1F3FB}\u200D\u2640\uFE0F",":woman_in_steamy_room_light_skin_tone:":"\u{1F9D6}\u{1F3FB}\u200D\u2640\uFE0F",":woman_in_steamy_room_tone2:":"\u{1F9D6}\u{1F3FC}\u200D\u2640\uFE0F",":woman_in_steamy_room_medium_light_skin_tone:":"\u{1F9D6}\u{1F3FC}\u200D\u2640\uFE0F",":woman_in_steamy_room_tone3:":"\u{1F9D6}\u{1F3FD}\u200D\u2640\uFE0F",":woman_in_steamy_room_medium_skin_tone:":"\u{1F9D6}\u{1F3FD}\u200D\u2640\uFE0F",":woman_in_steamy_room_tone4:":"\u{1F9D6}\u{1F3FE}\u200D\u2640\uFE0F",":woman_in_steamy_room_medium_dark_skin_tone:":"\u{1F9D6}\u{1F3FE}\u200D\u2640\uFE0F",":woman_in_steamy_room_tone5:":"\u{1F9D6}\u{1F3FF}\u200D\u2640\uFE0F",":woman_in_steamy_room_dark_skin_tone:":"\u{1F9D6}\u{1F3FF}\u200D\u2640\uFE0F",":man_in_steamy_room:":"\u{1F9D6}\u200D\u2642\uFE0F",":man_in_steamy_room_tone1:":"\u{1F9D6}\u{1F3FB}\u200D\u2642\uFE0F",":man_in_steamy_room_light_skin_tone:":"\u{1F9D6}\u{1F3FB}\u200D\u2642\uFE0F",":man_in_steamy_room_tone2:":"\u{1F9D6}\u{1F3FC}\u200D\u2642\uFE0F",":man_in_steamy_room_medium_light_skin_tone:":"\u{1F9D6}\u{1F3FC}\u200D\u2642\uFE0F",":man_in_steamy_room_tone3:":"\u{1F9D6}\u{1F3FD}\u200D\u2642\uFE0F",":man_in_steamy_room_medium_skin_tone:":"\u{1F9D6}\u{1F3FD}\u200D\u2642\uFE0F",":man_in_steamy_room_tone4:":"\u{1F9D6}\u{1F3FE}\u200D\u2642\uFE0F",":man_in_steamy_room_medium_dark_skin_tone:":"\u{1F9D6}\u{1F3FE}\u200D\u2642\uFE0F",":man_in_steamy_room_tone5:":"\u{1F9D6}\u{1F3FF}\u200D\u2642\uFE0F",":man_in_steamy_room_dark_skin_tone:":"\u{1F9D6}\u{1F3FF}\u200D\u2642\uFE0F",":nail_care:":"\u{1F485}",":nail_care_tone1:":"\u{1F485}\u{1F3FB}",":nail_care_tone2:":"\u{1F485}\u{1F3FC}",":nail_care_tone3:":"\u{1F485}\u{1F3FD}",":nail_care_tone4:":"\u{1F485}\u{1F3FE}",":nail_care_tone5:":"\u{1F485}\u{1F3FF}",":selfie:":"\u{1F933}",":selfie_tone1:":"\u{1F933}\u{1F3FB}",":selfie_tone2:":"\u{1F933}\u{1F3FC}",":selfie_tone3:":"\u{1F933}\u{1F3FD}",":selfie_tone4:":"\u{1F933}\u{1F3FE}",":selfie_tone5:":"\u{1F933}\u{1F3FF}",":dancer:":"\u{1F483}",":dancer_tone1:":"\u{1F483}\u{1F3FB}",":dancer_tone2:":"\u{1F483}\u{1F3FC}",":dancer_tone3:":"\u{1F483}\u{1F3FD}",":dancer_tone4:":"\u{1F483}\u{1F3FE}",":dancer_tone5:":"\u{1F483}\u{1F3FF}",":man_dancing:":"\u{1F57A}",":male_dancer:":"\u{1F57A}",":man_dancing_tone1:":"\u{1F57A}\u{1F3FB}",":male_dancer_tone1:":"\u{1F57A}\u{1F3FB}",":man_dancing_tone2:":"\u{1F57A}\u{1F3FC}",":male_dancer_tone2:":"\u{1F57A}\u{1F3FC}",":man_dancing_tone3:":"\u{1F57A}\u{1F3FD}",":male_dancer_tone3:":"\u{1F57A}\u{1F3FD}",":man_dancing_tone5:":"\u{1F57A}\u{1F3FF}",":male_dancer_tone5:":"\u{1F57A}\u{1F3FF}",":man_dancing_tone4:":"\u{1F57A}\u{1F3FE}",":male_dancer_tone4:":"\u{1F57A}\u{1F3FE}",":people_with_bunny_ears_partying:":"\u{1F46F}",":dancers:":"\u{1F46F}",":women_with_bunny_ears_partying:":"\u{1F46F}\u200D\u2640\uFE0F",":men_with_bunny_ears_partying:":"\u{1F46F}\u200D\u2642\uFE0F",":levitate:":"\u{1F574}\uFE0F",":man_in_business_suit_levitating:":"\u{1F574}\uFE0F",":levitate_tone1:":"\u{1F574}\u{1F3FB}",":man_in_business_suit_levitating_tone1:":"\u{1F574}\u{1F3FB}",":man_in_business_suit_levitating_light_skin_tone:":"\u{1F574}\u{1F3FB}",":levitate_tone2:":"\u{1F574}\u{1F3FC}",":man_in_business_suit_levitating_tone2:":"\u{1F574}\u{1F3FC}",":man_in_business_suit_levitating_medium_light_skin_tone:":"\u{1F574}\u{1F3FC}",":levitate_tone3:":"\u{1F574}\u{1F3FD}",":man_in_business_suit_levitating_tone3:":"\u{1F574}\u{1F3FD}",":man_in_business_suit_levitating_medium_skin_tone:":"\u{1F574}\u{1F3FD}",":levitate_tone4:":"\u{1F574}\u{1F3FE}",":man_in_business_suit_levitating_tone4:":"\u{1F574}\u{1F3FE}",":man_in_business_suit_levitating_medium_dark_skin_tone:":"\u{1F574}\u{1F3FE}",":levitate_tone5:":"\u{1F574}\u{1F3FF}",":man_in_business_suit_levitating_tone5:":"\u{1F574}\u{1F3FF}",":man_in_business_suit_levitating_dark_skin_tone:":"\u{1F574}\u{1F3FF}",":person_in_manual_wheelchair:":"\u{1F9D1}\u200D\u{1F9BD}",":person_in_manual_wheelchair_tone1:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F9BD}",":person_in_manual_wheelchair_light_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F9BD}",":person_in_manual_wheelchair_tone2:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F9BD}",":person_in_manual_wheelchair_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F9BD}",":person_in_manual_wheelchair_tone3:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F9BD}",":person_in_manual_wheelchair_medium_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F9BD}",":person_in_manual_wheelchair_tone4:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F9BD}",":person_in_manual_wheelchair_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F9BD}",":person_in_manual_wheelchair_tone5:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F9BD}",":person_in_manual_wheelchair_dark_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F9BD}",":woman_in_manual_wheelchair:":"\u{1F469}\u200D\u{1F9BD}",":woman_in_manual_wheelchair_tone1:":"\u{1F469}\u{1F3FB}\u200D\u{1F9BD}",":woman_in_manual_wheelchair_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F9BD}",":woman_in_manual_wheelchair_tone2:":"\u{1F469}\u{1F3FC}\u200D\u{1F9BD}",":woman_in_manual_wheelchair_medium_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F9BD}",":woman_in_manual_wheelchair_tone3:":"\u{1F469}\u{1F3FD}\u200D\u{1F9BD}",":woman_in_manual_wheelchair_medium_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F9BD}",":woman_in_manual_wheelchair_tone4:":"\u{1F469}\u{1F3FE}\u200D\u{1F9BD}",":woman_in_manual_wheelchair_medium_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F9BD}",":woman_in_manual_wheelchair_tone5:":"\u{1F469}\u{1F3FF}\u200D\u{1F9BD}",":woman_in_manual_wheelchair_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F9BD}",":man_in_manual_wheelchair:":"\u{1F468}\u200D\u{1F9BD}",":man_in_manual_wheelchair_tone1:":"\u{1F468}\u{1F3FB}\u200D\u{1F9BD}",":man_in_manual_wheelchair_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F9BD}",":man_in_manual_wheelchair_tone2:":"\u{1F468}\u{1F3FC}\u200D\u{1F9BD}",":man_in_manual_wheelchair_medium_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F9BD}",":man_in_manual_wheelchair_tone3:":"\u{1F468}\u{1F3FD}\u200D\u{1F9BD}",":man_in_manual_wheelchair_medium_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F9BD}",":man_in_manual_wheelchair_tone4:":"\u{1F468}\u{1F3FE}\u200D\u{1F9BD}",":man_in_manual_wheelchair_medium_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F9BD}",":man_in_manual_wheelchair_tone5:":"\u{1F468}\u{1F3FF}\u200D\u{1F9BD}",":man_in_manual_wheelchair_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F9BD}",":person_in_motorized_wheelchair:":"\u{1F9D1}\u200D\u{1F9BC}",":person_in_motorized_wheelchair_tone1:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F9BC}",":person_in_motorized_wheelchair_light_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F9BC}",":person_in_motorized_wheelchair_tone2:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F9BC}",":person_in_motorized_wheelchair_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F9BC}",":person_in_motorized_wheelchair_tone3:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F9BC}",":person_in_motorized_wheelchair_medium_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F9BC}",":person_in_motorized_wheelchair_tone4:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F9BC}",":person_in_motorized_wheelchair_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F9BC}",":person_in_motorized_wheelchair_tone5:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F9BC}",":person_in_motorized_wheelchair_dark_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F9BC}",":woman_in_motorized_wheelchair:":"\u{1F469}\u200D\u{1F9BC}",":woman_in_motorized_wheelchair_tone1:":"\u{1F469}\u{1F3FB}\u200D\u{1F9BC}",":woman_in_motorized_wheelchair_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F9BC}",":woman_in_motorized_wheelchair_tone2:":"\u{1F469}\u{1F3FC}\u200D\u{1F9BC}",":woman_in_motorized_wheelchair_medium_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F9BC}",":woman_in_motorized_wheelchair_tone3:":"\u{1F469}\u{1F3FD}\u200D\u{1F9BC}",":woman_in_motorized_wheelchair_medium_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F9BC}",":woman_in_motorized_wheelchair_tone4:":"\u{1F469}\u{1F3FE}\u200D\u{1F9BC}",":woman_in_motorized_wheelchair_medium_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F9BC}",":woman_in_motorized_wheelchair_tone5:":"\u{1F469}\u{1F3FF}\u200D\u{1F9BC}",":woman_in_motorized_wheelchair_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F9BC}",":man_in_motorized_wheelchair:":"\u{1F468}\u200D\u{1F9BC}",":man_in_motorized_wheelchair_tone1:":"\u{1F468}\u{1F3FB}\u200D\u{1F9BC}",":man_in_motorized_wheelchair_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F9BC}",":man_in_motorized_wheelchair_tone2:":"\u{1F468}\u{1F3FC}\u200D\u{1F9BC}",":man_in_motorized_wheelchair_medium_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F9BC}",":man_in_motorized_wheelchair_tone3:":"\u{1F468}\u{1F3FD}\u200D\u{1F9BC}",":man_in_motorized_wheelchair_medium_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F9BC}",":man_in_motorized_wheelchair_tone4:":"\u{1F468}\u{1F3FE}\u200D\u{1F9BC}",":man_in_motorized_wheelchair_medium_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F9BC}",":man_in_motorized_wheelchair_tone5:":"\u{1F468}\u{1F3FF}\u200D\u{1F9BC}",":man_in_motorized_wheelchair_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F9BC}",":person_walking:":"\u{1F6B6}",":walking:":"\u{1F6B6}",":person_walking_tone1:":"\u{1F6B6}\u{1F3FB}",":walking_tone1:":"\u{1F6B6}\u{1F3FB}",":person_walking_tone2:":"\u{1F6B6}\u{1F3FC}",":walking_tone2:":"\u{1F6B6}\u{1F3FC}",":person_walking_tone3:":"\u{1F6B6}\u{1F3FD}",":walking_tone3:":"\u{1F6B6}\u{1F3FD}",":person_walking_tone4:":"\u{1F6B6}\u{1F3FE}",":walking_tone4:":"\u{1F6B6}\u{1F3FE}",":person_walking_tone5:":"\u{1F6B6}\u{1F3FF}",":walking_tone5:":"\u{1F6B6}\u{1F3FF}",":woman_walking:":"\u{1F6B6}\u200D\u2640\uFE0F",":woman_walking_tone1:":"\u{1F6B6}\u{1F3FB}\u200D\u2640\uFE0F",":woman_walking_light_skin_tone:":"\u{1F6B6}\u{1F3FB}\u200D\u2640\uFE0F",":woman_walking_tone2:":"\u{1F6B6}\u{1F3FC}\u200D\u2640\uFE0F",":woman_walking_medium_light_skin_tone:":"\u{1F6B6}\u{1F3FC}\u200D\u2640\uFE0F",":woman_walking_tone3:":"\u{1F6B6}\u{1F3FD}\u200D\u2640\uFE0F",":woman_walking_medium_skin_tone:":"\u{1F6B6}\u{1F3FD}\u200D\u2640\uFE0F",":woman_walking_tone4:":"\u{1F6B6}\u{1F3FE}\u200D\u2640\uFE0F",":woman_walking_medium_dark_skin_tone:":"\u{1F6B6}\u{1F3FE}\u200D\u2640\uFE0F",":woman_walking_tone5:":"\u{1F6B6}\u{1F3FF}\u200D\u2640\uFE0F",":woman_walking_dark_skin_tone:":"\u{1F6B6}\u{1F3FF}\u200D\u2640\uFE0F",":man_walking:":"\u{1F6B6}\u200D\u2642\uFE0F",":man_walking_tone1:":"\u{1F6B6}\u{1F3FB}\u200D\u2642\uFE0F",":man_walking_light_skin_tone:":"\u{1F6B6}\u{1F3FB}\u200D\u2642\uFE0F",":man_walking_tone2:":"\u{1F6B6}\u{1F3FC}\u200D\u2642\uFE0F",":man_walking_medium_light_skin_tone:":"\u{1F6B6}\u{1F3FC}\u200D\u2642\uFE0F",":man_walking_tone3:":"\u{1F6B6}\u{1F3FD}\u200D\u2642\uFE0F",":man_walking_medium_skin_tone:":"\u{1F6B6}\u{1F3FD}\u200D\u2642\uFE0F",":man_walking_tone4:":"\u{1F6B6}\u{1F3FE}\u200D\u2642\uFE0F",":man_walking_medium_dark_skin_tone:":"\u{1F6B6}\u{1F3FE}\u200D\u2642\uFE0F",":man_walking_tone5:":"\u{1F6B6}\u{1F3FF}\u200D\u2642\uFE0F",":man_walking_dark_skin_tone:":"\u{1F6B6}\u{1F3FF}\u200D\u2642\uFE0F",":person_with_probing_cane:":"\u{1F9D1}\u200D\u{1F9AF}",":person_with_probing_cane_tone1:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F9AF}",":person_with_probing_cane_light_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F9AF}",":person_with_probing_cane_tone2:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F9AF}",":person_with_probing_cane_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F9AF}",":person_with_probing_cane_tone3:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F9AF}",":person_with_probing_cane_medium_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F9AF}",":person_with_probing_cane_tone4:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F9AF}",":person_with_probing_cane_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F9AF}",":person_with_probing_cane_tone5:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F9AF}",":person_with_probing_cane_dark_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F9AF}",":woman_with_probing_cane:":"\u{1F469}\u200D\u{1F9AF}",":woman_with_probing_cane_tone1:":"\u{1F469}\u{1F3FB}\u200D\u{1F9AF}",":woman_with_probing_cane_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F9AF}",":woman_with_probing_cane_tone2:":"\u{1F469}\u{1F3FC}\u200D\u{1F9AF}",":woman_with_probing_cane_medium_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F9AF}",":woman_with_probing_cane_tone3:":"\u{1F469}\u{1F3FD}\u200D\u{1F9AF}",":woman_with_probing_cane_medium_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F9AF}",":woman_with_probing_cane_tone4:":"\u{1F469}\u{1F3FE}\u200D\u{1F9AF}",":woman_with_probing_cane_medium_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F9AF}",":woman_with_probing_cane_tone5:":"\u{1F469}\u{1F3FF}\u200D\u{1F9AF}",":woman_with_probing_cane_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F9AF}",":man_with_probing_cane:":"\u{1F468}\u200D\u{1F9AF}",":man_with_probing_cane_tone1:":"\u{1F468}\u{1F3FB}\u200D\u{1F9AF}",":man_with_probing_cane_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F9AF}",":man_with_probing_cane_tone3:":"\u{1F468}\u{1F3FD}\u200D\u{1F9AF}",":man_with_probing_cane_medium_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F9AF}",":man_with_probing_cane_tone2:":"\u{1F468}\u{1F3FC}\u200D\u{1F9AF}",":man_with_probing_cane_medium_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F9AF}",":man_with_probing_cane_tone4:":"\u{1F468}\u{1F3FE}\u200D\u{1F9AF}",":man_with_probing_cane_medium_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F9AF}",":man_with_probing_cane_tone5:":"\u{1F468}\u{1F3FF}\u200D\u{1F9AF}",":man_with_probing_cane_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F9AF}",":person_kneeling:":"\u{1F9CE}",":person_kneeling_tone1:":"\u{1F9CE}\u{1F3FB}",":person_kneeling_light_skin_tone:":"\u{1F9CE}\u{1F3FB}",":person_kneeling_tone2:":"\u{1F9CE}\u{1F3FC}",":person_kneeling_medium_light_skin_tone:":"\u{1F9CE}\u{1F3FC}",":person_kneeling_tone3:":"\u{1F9CE}\u{1F3FD}",":person_kneeling_medium_skin_tone:":"\u{1F9CE}\u{1F3FD}",":person_kneeling_tone4:":"\u{1F9CE}\u{1F3FE}",":person_kneeling_medium_dark_skin_tone:":"\u{1F9CE}\u{1F3FE}",":person_kneeling_tone5:":"\u{1F9CE}\u{1F3FF}",":person_kneeling_dark_skin_tone:":"\u{1F9CE}\u{1F3FF}",":woman_kneeling:":"\u{1F9CE}\u200D\u2640\uFE0F",":woman_kneeling_tone1:":"\u{1F9CE}\u{1F3FB}\u200D\u2640\uFE0F",":woman_kneeling_light_skin_tone:":"\u{1F9CE}\u{1F3FB}\u200D\u2640\uFE0F",":woman_kneeling_tone2:":"\u{1F9CE}\u{1F3FC}\u200D\u2640\uFE0F",":woman_kneeling_medium_light_skin_tone:":"\u{1F9CE}\u{1F3FC}\u200D\u2640\uFE0F",":woman_kneeling_tone3:":"\u{1F9CE}\u{1F3FD}\u200D\u2640\uFE0F",":woman_kneeling_medium_skin_tone:":"\u{1F9CE}\u{1F3FD}\u200D\u2640\uFE0F",":woman_kneeling_tone4:":"\u{1F9CE}\u{1F3FE}\u200D\u2640\uFE0F",":woman_kneeling_medium_dark_skin_tone:":"\u{1F9CE}\u{1F3FE}\u200D\u2640\uFE0F",":woman_kneeling_tone5:":"\u{1F9CE}\u{1F3FF}\u200D\u2640\uFE0F",":woman_kneeling_dark_skin_tone:":"\u{1F9CE}\u{1F3FF}\u200D\u2640\uFE0F",":man_kneeling:":"\u{1F9CE}\u200D\u2642\uFE0F",":man_kneeling_tone1:":"\u{1F9CE}\u{1F3FB}\u200D\u2642\uFE0F",":man_kneeling_light_skin_tone:":"\u{1F9CE}\u{1F3FB}\u200D\u2642\uFE0F",":man_kneeling_tone2:":"\u{1F9CE}\u{1F3FC}\u200D\u2642\uFE0F",":man_kneeling_medium_light_skin_tone:":"\u{1F9CE}\u{1F3FC}\u200D\u2642\uFE0F",":man_kneeling_tone3:":"\u{1F9CE}\u{1F3FD}\u200D\u2642\uFE0F",":man_kneeling_medium_skin_tone:":"\u{1F9CE}\u{1F3FD}\u200D\u2642\uFE0F",":man_kneeling_tone4:":"\u{1F9CE}\u{1F3FE}\u200D\u2642\uFE0F",":man_kneeling_medium_dark_skin_tone:":"\u{1F9CE}\u{1F3FE}\u200D\u2642\uFE0F",":man_kneeling_tone5:":"\u{1F9CE}\u{1F3FF}\u200D\u2642\uFE0F",":man_kneeling_dark_skin_tone:":"\u{1F9CE}\u{1F3FF}\u200D\u2642\uFE0F",":person_running:":"\u{1F3C3}",":runner:":"\u{1F3C3}",":person_running_tone1:":"\u{1F3C3}\u{1F3FB}",":runner_tone1:":"\u{1F3C3}\u{1F3FB}",":person_running_tone2:":"\u{1F3C3}\u{1F3FC}",":runner_tone2:":"\u{1F3C3}\u{1F3FC}",":person_running_tone3:":"\u{1F3C3}\u{1F3FD}",":runner_tone3:":"\u{1F3C3}\u{1F3FD}",":person_running_tone4:":"\u{1F3C3}\u{1F3FE}",":runner_tone4:":"\u{1F3C3}\u{1F3FE}",":person_running_tone5:":"\u{1F3C3}\u{1F3FF}",":runner_tone5:":"\u{1F3C3}\u{1F3FF}",":woman_running:":"\u{1F3C3}\u200D\u2640\uFE0F",":woman_running_tone1:":"\u{1F3C3}\u{1F3FB}\u200D\u2640\uFE0F",":woman_running_light_skin_tone:":"\u{1F3C3}\u{1F3FB}\u200D\u2640\uFE0F",":woman_running_tone2:":"\u{1F3C3}\u{1F3FC}\u200D\u2640\uFE0F",":woman_running_medium_light_skin_tone:":"\u{1F3C3}\u{1F3FC}\u200D\u2640\uFE0F",":woman_running_tone3:":"\u{1F3C3}\u{1F3FD}\u200D\u2640\uFE0F",":woman_running_medium_skin_tone:":"\u{1F3C3}\u{1F3FD}\u200D\u2640\uFE0F",":woman_running_tone4:":"\u{1F3C3}\u{1F3FE}\u200D\u2640\uFE0F",":woman_running_medium_dark_skin_tone:":"\u{1F3C3}\u{1F3FE}\u200D\u2640\uFE0F",":woman_running_tone5:":"\u{1F3C3}\u{1F3FF}\u200D\u2640\uFE0F",":woman_running_dark_skin_tone:":"\u{1F3C3}\u{1F3FF}\u200D\u2640\uFE0F",":man_running:":"\u{1F3C3}\u200D\u2642\uFE0F",":man_running_tone1:":"\u{1F3C3}\u{1F3FB}\u200D\u2642\uFE0F",":man_running_light_skin_tone:":"\u{1F3C3}\u{1F3FB}\u200D\u2642\uFE0F",":man_running_tone2:":"\u{1F3C3}\u{1F3FC}\u200D\u2642\uFE0F",":man_running_medium_light_skin_tone:":"\u{1F3C3}\u{1F3FC}\u200D\u2642\uFE0F",":man_running_tone3:":"\u{1F3C3}\u{1F3FD}\u200D\u2642\uFE0F",":man_running_medium_skin_tone:":"\u{1F3C3}\u{1F3FD}\u200D\u2642\uFE0F",":man_running_tone4:":"\u{1F3C3}\u{1F3FE}\u200D\u2642\uFE0F",":man_running_medium_dark_skin_tone:":"\u{1F3C3}\u{1F3FE}\u200D\u2642\uFE0F",":man_running_tone5:":"\u{1F3C3}\u{1F3FF}\u200D\u2642\uFE0F",":man_running_dark_skin_tone:":"\u{1F3C3}\u{1F3FF}\u200D\u2642\uFE0F",":person_standing:":"\u{1F9CD}",":person_standing_tone1:":"\u{1F9CD}\u{1F3FB}",":person_standing_light_skin_tone:":"\u{1F9CD}\u{1F3FB}",":person_standing_tone2:":"\u{1F9CD}\u{1F3FC}",":person_standing_medium_light_skin_tone:":"\u{1F9CD}\u{1F3FC}",":person_standing_tone3:":"\u{1F9CD}\u{1F3FD}",":person_standing_medium_skin_tone:":"\u{1F9CD}\u{1F3FD}",":person_standing_tone4:":"\u{1F9CD}\u{1F3FE}",":person_standing_medium_dark_skin_tone:":"\u{1F9CD}\u{1F3FE}",":person_standing_tone5:":"\u{1F9CD}\u{1F3FF}",":person_standing_dark_skin_tone:":"\u{1F9CD}\u{1F3FF}",":woman_standing:":"\u{1F9CD}\u200D\u2640\uFE0F",":woman_standing_tone1:":"\u{1F9CD}\u{1F3FB}\u200D\u2640\uFE0F",":woman_standing_light_skin_tone:":"\u{1F9CD}\u{1F3FB}\u200D\u2640\uFE0F",":woman_standing_tone2:":"\u{1F9CD}\u{1F3FC}\u200D\u2640\uFE0F",":woman_standing_medium_light_skin_tone:":"\u{1F9CD}\u{1F3FC}\u200D\u2640\uFE0F",":woman_standing_tone3:":"\u{1F9CD}\u{1F3FD}\u200D\u2640\uFE0F",":woman_standing_medium_skin_tone:":"\u{1F9CD}\u{1F3FD}\u200D\u2640\uFE0F",":woman_standing_tone4:":"\u{1F9CD}\u{1F3FE}\u200D\u2640\uFE0F",":woman_standing_medium_dark_skin_tone:":"\u{1F9CD}\u{1F3FE}\u200D\u2640\uFE0F",":woman_standing_tone5:":"\u{1F9CD}\u{1F3FF}\u200D\u2640\uFE0F",":woman_standing_dark_skin_tone:":"\u{1F9CD}\u{1F3FF}\u200D\u2640\uFE0F",":man_standing:":"\u{1F9CD}\u200D\u2642\uFE0F",":man_standing_tone1:":"\u{1F9CD}\u{1F3FB}\u200D\u2642\uFE0F",":man_standing_light_skin_tone:":"\u{1F9CD}\u{1F3FB}\u200D\u2642\uFE0F",":man_standing_tone2:":"\u{1F9CD}\u{1F3FC}\u200D\u2642\uFE0F",":man_standing_medium_light_skin_tone:":"\u{1F9CD}\u{1F3FC}\u200D\u2642\uFE0F",":man_standing_tone3:":"\u{1F9CD}\u{1F3FD}\u200D\u2642\uFE0F",":man_standing_medium_skin_tone:":"\u{1F9CD}\u{1F3FD}\u200D\u2642\uFE0F",":man_standing_tone4:":"\u{1F9CD}\u{1F3FE}\u200D\u2642\uFE0F",":man_standing_medium_dark_skin_tone:":"\u{1F9CD}\u{1F3FE}\u200D\u2642\uFE0F",":man_standing_tone5:":"\u{1F9CD}\u{1F3FF}\u200D\u2642\uFE0F",":man_standing_dark_skin_tone:":"\u{1F9CD}\u{1F3FF}\u200D\u2642\uFE0F",":people_holding_hands:":"\u{1F9D1}\u200D\u{1F91D}\u200D\u{1F9D1}",":people_holding_hands_tone1:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FB}",":people_holding_hands_light_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FB}",":people_holding_hands_tone1_tone2:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FC}",":people_holding_hands_light_skin_tone_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FC}",":people_holding_hands_tone1_tone3:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FD}",":people_holding_hands_light_skin_tone_medium_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FD}",":people_holding_hands_tone1_tone4:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FE}",":people_holding_hands_light_skin_tone_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FE}",":people_holding_hands_tone1_tone5:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FF}",":people_holding_hands_light_skin_tone_dark_skin_tone:":"\u{1F9D1}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FF}",":people_holding_hands_tone2_tone1:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FB}",":people_holding_hands_medium_light_skin_tone_light_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FB}",":people_holding_hands_tone2:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FC}",":people_holding_hands_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FC}",":people_holding_hands_tone2_tone3:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FD}",":people_holding_hands_medium_light_skin_tone_medium_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FD}",":people_holding_hands_tone2_tone4:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FE}",":people_holding_hands_medium_light_skin_tone_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FE}",":people_holding_hands_tone2_tone5:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FF}",":people_holding_hands_medium_light_skin_tone_dark_skin_tone:":"\u{1F9D1}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FF}",":people_holding_hands_tone3_tone1:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FB}",":people_holding_hands_medium_skin_tone_light_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FB}",":people_holding_hands_tone3_tone2:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FC}",":people_holding_hands_medium_skin_tone_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FC}",":people_holding_hands_tone3:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FD}",":people_holding_hands_medium_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FD}",":people_holding_hands_tone3_tone4:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FE}",":people_holding_hands_medium_skin_tone_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FE}",":people_holding_hands_tone3_tone5:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FF}",":people_holding_hands_medium_skin_tone_dark_skin_tone:":"\u{1F9D1}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FF}",":people_holding_hands_tone4_tone1:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FB}",":people_holding_hands_medium_dark_skin_tone_light_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FB}",":people_holding_hands_tone4_tone2:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FC}",":people_holding_hands_medium_dark_skin_tone_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FC}",":people_holding_hands_tone4_tone3:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FD}",":people_holding_hands_medium_dark_skin_tone_medium_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FD}",":people_holding_hands_tone4:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FE}",":people_holding_hands_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FE}",":people_holding_hands_tone4_tone5:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FF}",":people_holding_hands_medium_dark_skin_tone_dark_skin_tone:":"\u{1F9D1}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FF}",":people_holding_hands_tone5_tone1:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FB}",":people_holding_hands_dark_skin_tone_light_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FB}",":people_holding_hands_tone5_tone2:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FC}",":people_holding_hands_dark_skin_tone_medium_light_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FC}",":people_holding_hands_tone5_tone3:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FD}",":people_holding_hands_dark_skin_tone_medium_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FD}",":people_holding_hands_tone5_tone4:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FE}",":people_holding_hands_dark_skin_tone_medium_dark_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FE}",":people_holding_hands_tone5:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FF}",":people_holding_hands_dark_skin_tone:":"\u{1F9D1}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F9D1}\u{1F3FF}",":couple:":"\u{1F46B}",":woman_and_man_holding_hands_tone1:":"\u{1F46B}\u{1F3FB}",":woman_and_man_holding_hands_light_skin_tone:":"\u{1F46B}\u{1F3FB}",":woman_and_man_holding_hands_tone1_tone2:":"\u{1F469}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FC}",":woman_and_man_holding_hands_light_skin_tone_medium_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FC}",":woman_and_man_holding_hands_tone1_tone3:":"\u{1F469}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FD}",":woman_and_man_holding_hands_light_skin_tone_medium_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FD}",":woman_and_man_holding_hands_tone1_tone4:":"\u{1F469}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FE}",":woman_and_man_holding_hands_light_skin_tone_medium_dark_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FE}",":woman_and_man_holding_hands_tone1_tone5:":"\u{1F469}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FF}",":woman_and_man_holding_hands_light_skin_tone_dark_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FF}",":woman_and_man_holding_hands_tone2_tone1:":"\u{1F469}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FB}",":woman_and_man_holding_hands_medium_light_skin_tone_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FB}",":woman_and_man_holding_hands_tone2:":"\u{1F46B}\u{1F3FC}",":woman_and_man_holding_hands_medium_light_skin_tone:":"\u{1F46B}\u{1F3FC}",":woman_and_man_holding_hands_tone2_tone3:":"\u{1F469}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FD}",":woman_and_man_holding_hands_medium_light_skin_tone_medium_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FD}",":woman_and_man_holding_hands_tone2_tone4:":"\u{1F469}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FE}",":woman_and_man_holding_hands_medium_light_skin_tone_medium_dark_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FE}",":woman_and_man_holding_hands_tone2_tone5:":"\u{1F469}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FF}",":woman_and_man_holding_hands_medium_light_skin_tone_dark_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FF}",":woman_and_man_holding_hands_tone3_tone1:":"\u{1F469}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FB}",":woman_and_man_holding_hands_medium_skin_tone_light_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FB}",":woman_and_man_holding_hands_tone3_tone2:":"\u{1F469}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FC}",":woman_and_man_holding_hands_medium_skin_tone_medium_light_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FC}",":woman_and_man_holding_hands_tone3:":"\u{1F46B}\u{1F3FD}",":woman_and_man_holding_hands_medium_skin_tone:":"\u{1F46B}\u{1F3FD}",":woman_and_man_holding_hands_tone3_tone4:":"\u{1F469}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FE}",":woman_and_man_holding_hands_medium_skin_tone_medium_dark_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FE}",":woman_and_man_holding_hands_tone3_tone5:":"\u{1F469}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FF}",":woman_and_man_holding_hands_medium_skin_tone_dark_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FF}",":woman_and_man_holding_hands_tone4_tone1:":"\u{1F469}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FB}",":woman_and_man_holding_hands_medium_dark_skin_tone_light_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FB}",":woman_and_man_holding_hands_tone4_tone2:":"\u{1F469}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FC}",":woman_and_man_holding_hands_medium_dark_skin_tone_medium_light_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FC}",":woman_and_man_holding_hands_tone4_tone3:":"\u{1F469}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FD}",":woman_and_man_holding_hands_medium_dark_skin_tone_medium_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FD}",":woman_and_man_holding_hands_tone4:":"\u{1F46B}\u{1F3FE}",":woman_and_man_holding_hands_medium_dark_skin_tone:":"\u{1F46B}\u{1F3FE}",":woman_and_man_holding_hands_tone4_tone5:":"\u{1F469}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FF}",":woman_and_man_holding_hands_medium_dark_skin_tone_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FF}",":woman_and_man_holding_hands_tone5_tone1:":"\u{1F469}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FB}",":woman_and_man_holding_hands_dark_skin_tone_light_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FB}",":woman_and_man_holding_hands_tone5_tone2:":"\u{1F469}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FC}",":woman_and_man_holding_hands_dark_skin_tone_medium_light_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FC}",":woman_and_man_holding_hands_tone5_tone3:":"\u{1F469}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FD}",":woman_and_man_holding_hands_dark_skin_tone_medium_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FD}",":woman_and_man_holding_hands_tone5_tone4:":"\u{1F469}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FE}",":woman_and_man_holding_hands_dark_skin_tone_medium_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FE}",":woman_and_man_holding_hands_tone5:":"\u{1F46B}\u{1F3FF}",":woman_and_man_holding_hands_dark_skin_tone:":"\u{1F46B}\u{1F3FF}",":two_women_holding_hands:":"\u{1F46D}",":women_holding_hands_tone1:":"\u{1F46D}\u{1F3FB}",":women_holding_hands_light_skin_tone:":"\u{1F46D}\u{1F3FB}",":women_holding_hands_tone1_tone2:":"\u{1F469}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FC}",":women_holding_hands_light_skin_tone_medium_light_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FC}",":women_holding_hands_tone1_tone3:":"\u{1F469}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FD}",":women_holding_hands_light_skin_tone_medium_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FD}",":women_holding_hands_tone1_tone4:":"\u{1F469}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FE}",":women_holding_hands_light_skin_tone_medium_dark_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FE}",":women_holding_hands_tone1_tone5:":"\u{1F469}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FF}",":women_holding_hands_light_skin_tone_dark_skin_tone:":"\u{1F469}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FF}",":women_holding_hands_tone2_tone1:":"\u{1F469}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FB}",":women_holding_hands_medium_light_skin_tone_light_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FB}",":women_holding_hands_tone2:":"\u{1F46D}\u{1F3FC}",":women_holding_hands_medium_light_skin_tone:":"\u{1F46D}\u{1F3FC}",":women_holding_hands_tone2_tone3:":"\u{1F469}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FD}",":women_holding_hands_medium_light_skin_tone_medium_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FD}",":women_holding_hands_tone2_tone4:":"\u{1F469}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FE}",":women_holding_hands_medium_light_skin_tone_medium_dark_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FE}",":women_holding_hands_tone2_tone5:":"\u{1F469}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FF}",":women_holding_hands_medium_light_skin_tone_dark_skin_tone:":"\u{1F469}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FF}",":women_holding_hands_tone3_tone1:":"\u{1F469}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FB}",":women_holding_hands_medium_skin_tone_light_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FB}",":women_holding_hands_tone3_tone2:":"\u{1F469}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FC}",":women_holding_hands_medium_skin_tone_medium_light_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FC}",":women_holding_hands_tone3:":"\u{1F46D}\u{1F3FD}",":women_holding_hands_medium_skin_tone:":"\u{1F46D}\u{1F3FD}",":women_holding_hands_tone3_tone4:":"\u{1F469}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FE}",":women_holding_hands_medium_skin_tone_medium_dark_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FE}",":women_holding_hands_tone3_tone5:":"\u{1F469}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FF}",":women_holding_hands_medium_skin_tone_dark_skin_tone:":"\u{1F469}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FF}",":women_holding_hands_tone4_tone1:":"\u{1F469}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FB}",":women_holding_hands_medium_dark_skin_tone_light_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FB}",":women_holding_hands_tone4_tone2:":"\u{1F469}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FC}",":women_holding_hands_medium_dark_skin_tone_medium_light_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FC}",":women_holding_hands_tone4_tone3:":"\u{1F469}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FD}",":women_holding_hands_medium_dark_skin_tone_medium_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FD}",":women_holding_hands_tone4:":"\u{1F46D}\u{1F3FE}",":women_holding_hands_medium_dark_skin_tone:":"\u{1F46D}\u{1F3FE}",":women_holding_hands_tone4_tone5:":"\u{1F469}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FF}",":women_holding_hands_medium_dark_skin_tone_dark_skin_tone:":"\u{1F469}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FF}",":women_holding_hands_tone5_tone1:":"\u{1F469}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FB}",":women_holding_hands_dark_skin_tone_light_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FB}",":women_holding_hands_tone5_tone2:":"\u{1F469}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FC}",":women_holding_hands_dark_skin_tone_medium_light_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FC}",":women_holding_hands_tone5_tone3:":"\u{1F469}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FD}",":women_holding_hands_dark_skin_tone_medium_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FD}",":women_holding_hands_tone5_tone4:":"\u{1F469}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FE}",":women_holding_hands_dark_skin_tone_medium_dark_skin_tone:":"\u{1F469}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F469}\u{1F3FE}",":women_holding_hands_tone5:":"\u{1F46D}\u{1F3FF}",":women_holding_hands_dark_skin_tone:":"\u{1F46D}\u{1F3FF}",":two_men_holding_hands:":"\u{1F46C}",":men_holding_hands_tone1:":"\u{1F46C}\u{1F3FB}",":men_holding_hands_light_skin_tone:":"\u{1F46C}\u{1F3FB}",":men_holding_hands_tone1_tone2:":"\u{1F468}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FC}",":men_holding_hands_light_skin_tone_medium_light_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FC}",":men_holding_hands_tone1_tone3:":"\u{1F468}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FD}",":men_holding_hands_light_skin_tone_medium_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FD}",":men_holding_hands_tone1_tone4:":"\u{1F468}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FE}",":men_holding_hands_light_skin_tone_medium_dark_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FE}",":men_holding_hands_tone1_tone5:":"\u{1F468}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FF}",":men_holding_hands_light_skin_tone_dark_skin_tone:":"\u{1F468}\u{1F3FB}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FF}",":men_holding_hands_tone2_tone1:":"\u{1F468}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FB}",":men_holding_hands_medium_light_skin_tone_light_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FB}",":men_holding_hands_tone2:":"\u{1F46C}\u{1F3FC}",":men_holding_hands_medium_light_skin_tone:":"\u{1F46C}\u{1F3FC}",":men_holding_hands_tone2_tone3:":"\u{1F468}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FD}",":men_holding_hands_medium_light_skin_tone_medium_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FD}",":men_holding_hands_tone2_tone4:":"\u{1F468}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FE}",":men_holding_hands_medium_light_skin_tone_medium_dark_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FE}",":men_holding_hands_tone2_tone5:":"\u{1F468}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FF}",":men_holding_hands_medium_light_skin_tone_dark_skin_tone:":"\u{1F468}\u{1F3FC}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FF}",":men_holding_hands_tone3_tone1:":"\u{1F468}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FB}",":men_holding_hands_medium_skin_tone_light_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FB}",":men_holding_hands_tone3_tone2:":"\u{1F468}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FC}",":men_holding_hands_medium_skin_tone_medium_light_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FC}",":men_holding_hands_tone3:":"\u{1F46C}\u{1F3FD}",":men_holding_hands_medium_skin_tone:":"\u{1F46C}\u{1F3FD}",":men_holding_hands_tone3_tone4:":"\u{1F468}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FE}",":men_holding_hands_medium_skin_tone_medium_dark_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FE}",":men_holding_hands_tone3_tone5:":"\u{1F468}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FF}",":men_holding_hands_medium_skin_tone_dark_skin_tone:":"\u{1F468}\u{1F3FD}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FF}",":men_holding_hands_tone4_tone1:":"\u{1F468}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FB}",":men_holding_hands_medium_dark_skin_tone_light_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FB}",":men_holding_hands_tone4_tone2:":"\u{1F468}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FC}",":men_holding_hands_medium_dark_skin_tone_medium_light_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FC}",":men_holding_hands_tone4_tone3:":"\u{1F468}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FD}",":men_holding_hands_medium_dark_skin_tone_medium_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FD}",":men_holding_hands_tone4:":"\u{1F46C}\u{1F3FE}",":men_holding_hands_medium_dark_skin_tone:":"\u{1F46C}\u{1F3FE}",":men_holding_hands_tone4_tone5:":"\u{1F468}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FF}",":men_holding_hands_medium_dark_skin_tone_dark_skin_tone:":"\u{1F468}\u{1F3FE}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FF}",":men_holding_hands_tone5_tone1:":"\u{1F468}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FB}",":men_holding_hands_dark_skin_tone_light_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FB}",":men_holding_hands_tone5_tone2:":"\u{1F468}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FC}",":men_holding_hands_dark_skin_tone_medium_light_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FC}",":men_holding_hands_tone5_tone3:":"\u{1F468}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FD}",":men_holding_hands_dark_skin_tone_medium_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FD}",":men_holding_hands_tone5_tone4:":"\u{1F468}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FE}",":men_holding_hands_dark_skin_tone_medium_dark_skin_tone:":"\u{1F468}\u{1F3FF}\u200D\u{1F91D}\u200D\u{1F468}\u{1F3FE}",":men_holding_hands_tone5:":"\u{1F46C}\u{1F3FF}",":men_holding_hands_dark_skin_tone:":"\u{1F46C}\u{1F3FF}",":couple_with_heart:":"\u{1F491}",":couple_with_heart_woman_man:":"\u{1F469}\u200D\u2764\uFE0F\u200D\u{1F468}",":couple_ww:":"\u{1F469}\u200D\u2764\uFE0F\u200D\u{1F469}",":couple_with_heart_ww:":"\u{1F469}\u200D\u2764\uFE0F\u200D\u{1F469}",":couple_mm:":"\u{1F468}\u200D\u2764\uFE0F\u200D\u{1F468}",":couple_with_heart_mm:":"\u{1F468}\u200D\u2764\uFE0F\u200D\u{1F468}",":couplekiss:":"\u{1F48F}",":kiss_woman_man:":"\u{1F469}\u200D\u2764\uFE0F\u200D\u{1F48B}\u200D\u{1F468}",":kiss_ww:":"\u{1F469}\u200D\u2764\uFE0F\u200D\u{1F48B}\u200D\u{1F469}",":couplekiss_ww:":"\u{1F469}\u200D\u2764\uFE0F\u200D\u{1F48B}\u200D\u{1F469}",":kiss_mm:":"\u{1F468}\u200D\u2764\uFE0F\u200D\u{1F48B}\u200D\u{1F468}",":couplekiss_mm:":"\u{1F468}\u200D\u2764\uFE0F\u200D\u{1F48B}\u200D\u{1F468}",":family:":"\u{1F46A}",":family_man_woman_boy:":"\u{1F468}\u200D\u{1F469}\u200D\u{1F466}",":family_mwg:":"\u{1F468}\u200D\u{1F469}\u200D\u{1F467}",":family_mwgb:":"\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}",":family_mwbb:":"\u{1F468}\u200D\u{1F469}\u200D\u{1F466}\u200D\u{1F466}",":family_mwgg:":"\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F467}",":family_wwb:":"\u{1F469}\u200D\u{1F469}\u200D\u{1F466}",":family_wwg:":"\u{1F469}\u200D\u{1F469}\u200D\u{1F467}",":family_wwgb:":"\u{1F469}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}",":family_wwbb:":"\u{1F469}\u200D\u{1F469}\u200D\u{1F466}\u200D\u{1F466}",":family_wwgg:":"\u{1F469}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F467}",":family_mmb:":"\u{1F468}\u200D\u{1F468}\u200D\u{1F466}",":family_mmg:":"\u{1F468}\u200D\u{1F468}\u200D\u{1F467}",":family_mmgb:":"\u{1F468}\u200D\u{1F468}\u200D\u{1F467}\u200D\u{1F466}",":family_mmbb:":"\u{1F468}\u200D\u{1F468}\u200D\u{1F466}\u200D\u{1F466}",":family_mmgg:":"\u{1F468}\u200D\u{1F468}\u200D\u{1F467}\u200D\u{1F467}",":family_woman_boy:":"\u{1F469}\u200D\u{1F466}",":family_woman_girl:":"\u{1F469}\u200D\u{1F467}",":family_woman_girl_boy:":"\u{1F469}\u200D\u{1F467}\u200D\u{1F466}",":family_woman_boy_boy:":"\u{1F469}\u200D\u{1F466}\u200D\u{1F466}",":family_woman_girl_girl:":"\u{1F469}\u200D\u{1F467}\u200D\u{1F467}",":family_man_boy:":"\u{1F468}\u200D\u{1F466}",":family_man_girl:":"\u{1F468}\u200D\u{1F467}",":family_man_girl_boy:":"\u{1F468}\u200D\u{1F467}\u200D\u{1F466}",":family_man_boy_boy:":"\u{1F468}\u200D\u{1F466}\u200D\u{1F466}",":family_man_girl_girl:":"\u{1F468}\u200D\u{1F467}\u200D\u{1F467}",":yarn:":"\u{1F9F6}",":thread:":"\u{1F9F5}",":coat:":"\u{1F9E5}",":lab_coat:":"\u{1F97C}",":safety_vest:":"\u{1F9BA}",":womans_clothes:":"\u{1F45A}",":shirt:":"\u{1F455}",":jeans:":"\u{1F456}",":briefs:":"\u{1FA72}",":shorts:":"\u{1FA73}",":necktie:":"\u{1F454}",":dress:":"\u{1F457}",":bikini:":"\u{1F459}",":one_piece_swimsuit:":"\u{1FA71}",":kimono:":"\u{1F458}",":sari:":"\u{1F97B}",":womans_flat_shoe:":"\u{1F97F}",":high_heel:":"\u{1F460}",":sandal:":"\u{1F461}",":boot:":"\u{1F462}",":mans_shoe:":"\u{1F45E}",":athletic_shoe:":"\u{1F45F}",":hiking_boot:":"\u{1F97E}",":thong_sandal:":"\u{1FA74}",":socks:":"\u{1F9E6}",":gloves:":"\u{1F9E4}",":scarf:":"\u{1F9E3}",":tophat:":"\u{1F3A9}",":billed_cap:":"\u{1F9E2}",":womans_hat:":"\u{1F452}",":mortar_board:":"\u{1F393}",":helmet_with_cross:":"\u26D1\uFE0F",":helmet_with_white_cross:":"\u26D1\uFE0F",":military_helmet:":"\u{1FA96}",":crown:":"\u{1F451}",":ring:":"\u{1F48D}",":pouch:":"\u{1F45D}",":purse:":"\u{1F45B}",":handbag:":"\u{1F45C}",":briefcase:":"\u{1F4BC}",":school_satchel:":"\u{1F392}",":luggage:":"\u{1F9F3}",":eyeglasses:":"\u{1F453}",":dark_sunglasses:":"\u{1F576}\uFE0F",":goggles:":"\u{1F97D}",":closed_umbrella:":"\u{1F302}",":dog:":"\u{1F436}",":cat:":"\u{1F431}",":mouse:":"\u{1F42D}",":hamster:":"\u{1F439}",":rabbit:":"\u{1F430}",":fox:":"\u{1F98A}",":fox_face:":"\u{1F98A}",":bear:":"\u{1F43B}",":panda_face:":"\u{1F43C}",":polar_bear:":"\u{1F43B}\u200D\u2744\uFE0F",":koala:":"\u{1F428}",":tiger:":"\u{1F42F}",":lion_face:":"\u{1F981}",":lion:":"\u{1F981}",":cow:":"\u{1F42E}",":pig:":"\u{1F437}",":pig_nose:":"\u{1F43D}",":frog:":"\u{1F438}",":monkey_face:":"\u{1F435}",":see_no_evil:":"\u{1F648}",":hear_no_evil:":"\u{1F649}",":speak_no_evil:":"\u{1F64A}",":monkey:":"\u{1F412}",":chicken:":"\u{1F414}",":penguin:":"\u{1F427}",":bird:":"\u{1F426}",":baby_chick:":"\u{1F424}",":hatching_chick:":"\u{1F423}",":hatched_chick:":"\u{1F425}",":duck:":"\u{1F986}",":dodo:":"\u{1F9A4}",":eagle:":"\u{1F985}",":owl:":"\u{1F989}",":bat:":"\u{1F987}",":wolf:":"\u{1F43A}",":boar:":"\u{1F417}",":horse:":"\u{1F434}",":unicorn:":"\u{1F984}",":unicorn_face:":"\u{1F984}",":bee:":"\u{1F41D}",":bug:":"\u{1F41B}",":butterfly:":"\u{1F98B}",":snail:":"\u{1F40C}",":worm:":"\u{1FAB1}",":lady_beetle:":"\u{1F41E}",":ant:":"\u{1F41C}",":fly:":"\u{1FAB0}",":mosquito:":"\u{1F99F}",":cockroach:":"\u{1FAB3}",":beetle:":"\u{1FAB2}",":cricket:":"\u{1F997}",":spider:":"\u{1F577}\uFE0F",":spider_web:":"\u{1F578}\uFE0F",":scorpion:":"\u{1F982}",":turtle:":"\u{1F422}",":snake:":"\u{1F40D}",":lizard:":"\u{1F98E}",":t_rex:":"\u{1F996}",":sauropod:":"\u{1F995}",":octopus:":"\u{1F419}",":squid:":"\u{1F991}",":shrimp:":"\u{1F990}",":lobster:":"\u{1F99E}",":crab:":"\u{1F980}",":blowfish:":"\u{1F421}",":tropical_fish:":"\u{1F420}",":fish:":"\u{1F41F}",":seal:":"\u{1F9AD}",":dolphin:":"\u{1F42C}",":whale:":"\u{1F433}",":whale2:":"\u{1F40B}",":shark:":"\u{1F988}",":crocodile:":"\u{1F40A}",":tiger2:":"\u{1F405}",":leopard:":"\u{1F406}",":zebra:":"\u{1F993}",":gorilla:":"\u{1F98D}",":orangutan:":"\u{1F9A7}",":elephant:":"\u{1F418}",":mammoth:":"\u{1F9A3}",":bison:":"\u{1F9AC}",":hippopotamus:":"\u{1F99B}",":rhino:":"\u{1F98F}",":rhinoceros:":"\u{1F98F}",":dromedary_camel:":"\u{1F42A}",":camel:":"\u{1F42B}",":giraffe:":"\u{1F992}",":kangaroo:":"\u{1F998}",":water_buffalo:":"\u{1F403}",":ox:":"\u{1F402}",":cow2:":"\u{1F404}",":racehorse:":"\u{1F40E}",":pig2:":"\u{1F416}",":ram:":"\u{1F40F}",":sheep:":"\u{1F411}",":llama:":"\u{1F999}",":goat:":"\u{1F410}",":deer:":"\u{1F98C}",":dog2:":"\u{1F415}",":poodle:":"\u{1F429}",":guide_dog:":"\u{1F9AE}",":service_dog:":"\u{1F415}\u200D\u{1F9BA}",":cat2:":"\u{1F408}",":black_cat:":"\u{1F408}\u200D\u2B1B",":rooster:":"\u{1F413}",":turkey:":"\u{1F983}",":peacock:":"\u{1F99A}",":parrot:":"\u{1F99C}",":swan:":"\u{1F9A2}",":flamingo:":"\u{1F9A9}",":dove:":"\u{1F54A}\uFE0F",":dove_of_peace:":"\u{1F54A}\uFE0F",":rabbit2:":"\u{1F407}",":raccoon:":"\u{1F99D}",":skunk:":"\u{1F9A8}",":badger:":"\u{1F9A1}",":beaver:":"\u{1F9AB}",":otter:":"\u{1F9A6}",":sloth:":"\u{1F9A5}",":mouse2:":"\u{1F401}",":rat:":"\u{1F400}",":chipmunk:":"\u{1F43F}\uFE0F",":hedgehog:":"\u{1F994}",":feet:":"\u{1F43E}",":paw_prints:":"\u{1F43E}",":dragon:":"\u{1F409}",":dragon_face:":"\u{1F432}",":cactus:":"\u{1F335}",":christmas_tree:":"\u{1F384}",":evergreen_tree:":"\u{1F332}",":deciduous_tree:":"\u{1F333}",":palm_tree:":"\u{1F334}",":seedling:":"\u{1F331}",":herb:":"\u{1F33F}",":shamrock:":"\u2618\uFE0F",":four_leaf_clover:":"\u{1F340}",":bamboo:":"\u{1F38D}",":tanabata_tree:":"\u{1F38B}",":leaves:":"\u{1F343}",":fallen_leaf:":"\u{1F342}",":maple_leaf:":"\u{1F341}",":feather:":"\u{1FAB6}",":mushroom:":"\u{1F344}",":shell:":"\u{1F41A}",":rock:":"\u{1FAA8}",":wood:":"\u{1FAB5}",":ear_of_rice:":"\u{1F33E}",":potted_plant:":"\u{1FAB4}",":bouquet:":"\u{1F490}",":tulip:":"\u{1F337}",":rose:":"\u{1F339}",":wilted_rose:":"\u{1F940}",":wilted_flower:":"\u{1F940}",":hibiscus:":"\u{1F33A}",":cherry_blossom:":"\u{1F338}",":blossom:":"\u{1F33C}",":sunflower:":"\u{1F33B}",":sun_with_face:":"\u{1F31E}",":full_moon_with_face:":"\u{1F31D}",":first_quarter_moon_with_face:":"\u{1F31B}",":last_quarter_moon_with_face:":"\u{1F31C}",":new_moon_with_face:":"\u{1F31A}",":full_moon:":"\u{1F315}",":waning_gibbous_moon:":"\u{1F316}",":last_quarter_moon:":"\u{1F317}",":waning_crescent_moon:":"\u{1F318}",":new_moon:":"\u{1F311}",":waxing_crescent_moon:":"\u{1F312}",":first_quarter_moon:":"\u{1F313}",":waxing_gibbous_moon:":"\u{1F314}",":crescent_moon:":"\u{1F319}",":earth_americas:":"\u{1F30E}",":earth_africa:":"\u{1F30D}",":earth_asia:":"\u{1F30F}",":ringed_planet:":"\u{1FA90}",":dizzy:":"\u{1F4AB}",":star:":"\u2B50",":star2:":"\u{1F31F}",":sparkles:":"\u2728",":zap:":"\u26A1",":comet:":"\u2604\uFE0F",":boom:":"\u{1F4A5}",":fire:":"\u{1F525}",":flame:":"\u{1F525}",":cloud_tornado:":"\u{1F32A}\uFE0F",":cloud_with_tornado:":"\u{1F32A}\uFE0F",":rainbow:":"\u{1F308}",":sunny:":"\u2600\uFE0F",":white_sun_small_cloud:":"\u{1F324}\uFE0F",":white_sun_with_small_cloud:":"\u{1F324}\uFE0F",":partly_sunny:":"\u26C5",":white_sun_cloud:":"\u{1F325}\uFE0F",":white_sun_behind_cloud:":"\u{1F325}\uFE0F",":cloud:":"\u2601\uFE0F",":white_sun_rain_cloud:":"\u{1F326}\uFE0F",":white_sun_behind_cloud_with_rain:":"\u{1F326}\uFE0F",":cloud_rain:":"\u{1F327}\uFE0F",":cloud_with_rain:":"\u{1F327}\uFE0F",":thunder_cloud_rain:":"\u26C8\uFE0F",":thunder_cloud_and_rain:":"\u26C8\uFE0F",":cloud_lightning:":"\u{1F329}\uFE0F",":cloud_with_lightning:":"\u{1F329}\uFE0F",":cloud_snow:":"\u{1F328}\uFE0F",":cloud_with_snow:":"\u{1F328}\uFE0F",":snowflake:":"\u2744\uFE0F",":snowman2:":"\u2603\uFE0F",":snowman:":"\u26C4",":wind_blowing_face:":"\u{1F32C}\uFE0F",":dash:":"\u{1F4A8}",":droplet:":"\u{1F4A7}",":sweat_drops:":"\u{1F4A6}",":umbrella:":"\u2614",":umbrella2:":"\u2602\uFE0F",":ocean:":"\u{1F30A}",":fog:":"\u{1F32B}\uFE0F",":green_apple:":"\u{1F34F}",":apple:":"\u{1F34E}",":pear:":"\u{1F350}",":tangerine:":"\u{1F34A}",":lemon:":"\u{1F34B}",":banana:":"\u{1F34C}",":watermelon:":"\u{1F349}",":grapes:":"\u{1F347}",":blueberries:":"\u{1FAD0}",":strawberry:":"\u{1F353}",":melon:":"\u{1F348}",":cherries:":"\u{1F352}",":peach:":"\u{1F351}",":mango:":"\u{1F96D}",":pineapple:":"\u{1F34D}",":coconut:":"\u{1F965}",":kiwi:":"\u{1F95D}",":kiwifruit:":"\u{1F95D}",":tomato:":"\u{1F345}",":eggplant:":"\u{1F346}",":avocado:":"\u{1F951}",":olive:":"\u{1FAD2}",":broccoli:":"\u{1F966}",":leafy_green:":"\u{1F96C}",":bell_pepper:":"\u{1FAD1}",":cucumber:":"\u{1F952}",":hot_pepper:":"\u{1F336}\uFE0F",":corn:":"\u{1F33D}",":carrot:":"\u{1F955}",":garlic:":"\u{1F9C4}",":onion:":"\u{1F9C5}",":potato:":"\u{1F954}",":sweet_potato:":"\u{1F360}",":croissant:":"\u{1F950}",":bagel:":"\u{1F96F}",":bread:":"\u{1F35E}",":french_bread:":"\u{1F956}",":baguette_bread:":"\u{1F956}",":flatbread:":"\u{1FAD3}",":pretzel:":"\u{1F968}",":cheese:":"\u{1F9C0}",":cheese_wedge:":"\u{1F9C0}",":egg:":"\u{1F95A}",":cooking:":"\u{1F373}",":butter:":"\u{1F9C8}",":pancakes:":"\u{1F95E}",":waffle:":"\u{1F9C7}",":bacon:":"\u{1F953}",":cut_of_meat:":"\u{1F969}",":poultry_leg:":"\u{1F357}",":meat_on_bone:":"\u{1F356}",":hotdog:":"\u{1F32D}",":hot_dog:":"\u{1F32D}",":hamburger:":"\u{1F354}",":fries:":"\u{1F35F}",":pizza:":"\u{1F355}",":sandwich:":"\u{1F96A}",":stuffed_flatbread:":"\u{1F959}",":stuffed_pita:":"\u{1F959}",":falafel:":"\u{1F9C6}",":taco:":"\u{1F32E}",":burrito:":"\u{1F32F}",":tamale:":"\u{1FAD4}",":salad:":"\u{1F957}",":green_salad:":"\u{1F957}",":shallow_pan_of_food:":"\u{1F958}",":paella:":"\u{1F958}",":fondue:":"\u{1FAD5}",":canned_food:":"\u{1F96B}",":spaghetti:":"\u{1F35D}",":ramen:":"\u{1F35C}",":stew:":"\u{1F372}",":curry:":"\u{1F35B}",":sushi:":"\u{1F363}",":bento:":"\u{1F371}",":dumpling:":"\u{1F95F}",":oyster:":"\u{1F9AA}",":fried_shrimp:":"\u{1F364}",":rice_ball:":"\u{1F359}",":rice:":"\u{1F35A}",":rice_cracker:":"\u{1F358}",":fish_cake:":"\u{1F365}",":fortune_cookie:":"\u{1F960}",":moon_cake:":"\u{1F96E}",":oden:":"\u{1F362}",":dango:":"\u{1F361}",":shaved_ice:":"\u{1F367}",":ice_cream:":"\u{1F368}",":icecream:":"\u{1F366}",":pie:":"\u{1F967}",":cupcake:":"\u{1F9C1}",":cake:":"\u{1F370}",":birthday:":"\u{1F382}",":custard:":"\u{1F36E}",":pudding:":"\u{1F36E}",":flan:":"\u{1F36E}",":lollipop:":"\u{1F36D}",":candy:":"\u{1F36C}",":chocolate_bar:":"\u{1F36B}",":popcorn:":"\u{1F37F}",":doughnut:":"\u{1F369}",":cookie:":"\u{1F36A}",":chestnut:":"\u{1F330}",":peanuts:":"\u{1F95C}",":shelled_peanut:":"\u{1F95C}",":honey_pot:":"\u{1F36F}",":milk:":"\u{1F95B}",":glass_of_milk:":"\u{1F95B}",":baby_bottle:":"\u{1F37C}",":coffee:":"\u2615",":tea:":"\u{1F375}",":teapot:":"\u{1FAD6}",":mate:":"\u{1F9C9}",":bubble_tea:":"\u{1F9CB}",":beverage_box:":"\u{1F9C3}",":cup_with_straw:":"\u{1F964}",":sake:":"\u{1F376}",":beer:":"\u{1F37A}",":beers:":"\u{1F37B}",":champagne_glass:":"\u{1F942}",":clinking_glass:":"\u{1F942}",":wine_glass:":"\u{1F377}",":tumbler_glass:":"\u{1F943}",":whisky:":"\u{1F943}",":cocktail:":"\u{1F378}",":tropical_drink:":"\u{1F379}",":champagne:":"\u{1F37E}",":bottle_with_popping_cork:":"\u{1F37E}",":ice_cube:":"\u{1F9CA}",":spoon:":"\u{1F944}",":fork_and_knife:":"\u{1F374}",":fork_knife_plate:":"\u{1F37D}\uFE0F",":fork_and_knife_with_plate:":"\u{1F37D}\uFE0F",":bowl_with_spoon:":"\u{1F963}",":takeout_box:":"\u{1F961}",":chopsticks:":"\u{1F962}",":salt:":"\u{1F9C2}",":soccer:":"\u26BD",":basketball:":"\u{1F3C0}",":football:":"\u{1F3C8}",":baseball:":"\u26BE",":softball:":"\u{1F94E}",":tennis:":"\u{1F3BE}",":volleyball:":"\u{1F3D0}",":rugby_football:":"\u{1F3C9}",":flying_disc:":"\u{1F94F}",":boomerang:":"\u{1FA83}",":8ball:":"\u{1F3B1}",":yo_yo:":"\u{1FA80}",":ping_pong:":"\u{1F3D3}",":table_tennis:":"\u{1F3D3}",":badminton:":"\u{1F3F8}",":hockey:":"\u{1F3D2}",":field_hockey:":"\u{1F3D1}",":lacrosse:":"\u{1F94D}",":cricket_game:":"\u{1F3CF}",":cricket_bat_ball:":"\u{1F3CF}",":goal:":"\u{1F945}",":goal_net:":"\u{1F945}",":golf:":"\u26F3",":kite:":"\u{1FA81}",":bow_and_arrow:":"\u{1F3F9}",":archery:":"\u{1F3F9}",":fishing_pole_and_fish:":"\u{1F3A3}",":diving_mask:":"\u{1F93F}",":boxing_glove:":"\u{1F94A}",":boxing_gloves:":"\u{1F94A}",":martial_arts_uniform:":"\u{1F94B}",":karate_uniform:":"\u{1F94B}",":running_shirt_with_sash:":"\u{1F3BD}",":skateboard:":"\u{1F6F9}",":roller_skate:":"\u{1F6FC}",":sled:":"\u{1F6F7}",":ice_skate:":"\u26F8\uFE0F",":curling_stone:":"\u{1F94C}",":ski:":"\u{1F3BF}",":skier:":"\u26F7\uFE0F",":snowboarder:":"\u{1F3C2}",":snowboarder_tone1:":"\u{1F3C2}\u{1F3FB}",":snowboarder_light_skin_tone:":"\u{1F3C2}\u{1F3FB}",":snowboarder_tone2:":"\u{1F3C2}\u{1F3FC}",":snowboarder_medium_light_skin_tone:":"\u{1F3C2}\u{1F3FC}",":snowboarder_tone3:":"\u{1F3C2}\u{1F3FD}",":snowboarder_medium_skin_tone:":"\u{1F3C2}\u{1F3FD}",":snowboarder_tone4:":"\u{1F3C2}\u{1F3FE}",":snowboarder_medium_dark_skin_tone:":"\u{1F3C2}\u{1F3FE}",":snowboarder_tone5:":"\u{1F3C2}\u{1F3FF}",":snowboarder_dark_skin_tone:":"\u{1F3C2}\u{1F3FF}",":parachute:":"\u{1FA82}",":person_lifting_weights:":"\u{1F3CB}\uFE0F",":lifter:":"\u{1F3CB}\uFE0F",":weight_lifter:":"\u{1F3CB}\uFE0F",":person_lifting_weights_tone1:":"\u{1F3CB}\u{1F3FB}",":lifter_tone1:":"\u{1F3CB}\u{1F3FB}",":weight_lifter_tone1:":"\u{1F3CB}\u{1F3FB}",":person_lifting_weights_tone2:":"\u{1F3CB}\u{1F3FC}",":lifter_tone2:":"\u{1F3CB}\u{1F3FC}",":weight_lifter_tone2:":"\u{1F3CB}\u{1F3FC}",":person_lifting_weights_tone3:":"\u{1F3CB}\u{1F3FD}",":lifter_tone3:":"\u{1F3CB}\u{1F3FD}",":weight_lifter_tone3:":"\u{1F3CB}\u{1F3FD}",":person_lifting_weights_tone4:":"\u{1F3CB}\u{1F3FE}",":lifter_tone4:":"\u{1F3CB}\u{1F3FE}",":weight_lifter_tone4:":"\u{1F3CB}\u{1F3FE}",":person_lifting_weights_tone5:":"\u{1F3CB}\u{1F3FF}",":lifter_tone5:":"\u{1F3CB}\u{1F3FF}",":weight_lifter_tone5:":"\u{1F3CB}\u{1F3FF}",":woman_lifting_weights:":"\u{1F3CB}\uFE0F\u200D\u2640\uFE0F",":woman_lifting_weights_tone1:":"\u{1F3CB}\u{1F3FB}\u200D\u2640\uFE0F",":woman_lifting_weights_light_skin_tone:":"\u{1F3CB}\u{1F3FB}\u200D\u2640\uFE0F",":woman_lifting_weights_tone2:":"\u{1F3CB}\u{1F3FC}\u200D\u2640\uFE0F",":woman_lifting_weights_medium_light_skin_tone:":"\u{1F3CB}\u{1F3FC}\u200D\u2640\uFE0F",":woman_lifting_weights_tone3:":"\u{1F3CB}\u{1F3FD}\u200D\u2640\uFE0F",":woman_lifting_weights_medium_skin_tone:":"\u{1F3CB}\u{1F3FD}\u200D\u2640\uFE0F",":woman_lifting_weights_tone4:":"\u{1F3CB}\u{1F3FE}\u200D\u2640\uFE0F",":woman_lifting_weights_medium_dark_skin_tone:":"\u{1F3CB}\u{1F3FE}\u200D\u2640\uFE0F",":woman_lifting_weights_tone5:":"\u{1F3CB}\u{1F3FF}\u200D\u2640\uFE0F",":woman_lifting_weights_dark_skin_tone:":"\u{1F3CB}\u{1F3FF}\u200D\u2640\uFE0F",":man_lifting_weights:":"\u{1F3CB}\uFE0F\u200D\u2642\uFE0F",":man_lifting_weights_tone1:":"\u{1F3CB}\u{1F3FB}\u200D\u2642\uFE0F",":man_lifting_weights_light_skin_tone:":"\u{1F3CB}\u{1F3FB}\u200D\u2642\uFE0F",":man_lifting_weights_tone2:":"\u{1F3CB}\u{1F3FC}\u200D\u2642\uFE0F",":man_lifting_weights_medium_light_skin_tone:":"\u{1F3CB}\u{1F3FC}\u200D\u2642\uFE0F",":man_lifting_weights_tone3:":"\u{1F3CB}\u{1F3FD}\u200D\u2642\uFE0F",":man_lifting_weights_medium_skin_tone:":"\u{1F3CB}\u{1F3FD}\u200D\u2642\uFE0F",":man_lifting_weights_tone4:":"\u{1F3CB}\u{1F3FE}\u200D\u2642\uFE0F",":man_lifting_weights_medium_dark_skin_tone:":"\u{1F3CB}\u{1F3FE}\u200D\u2642\uFE0F",":man_lifting_weights_tone5:":"\u{1F3CB}\u{1F3FF}\u200D\u2642\uFE0F",":man_lifting_weights_dark_skin_tone:":"\u{1F3CB}\u{1F3FF}\u200D\u2642\uFE0F",":people_wrestling:":"\u{1F93C}",":wrestlers:":"\u{1F93C}",":wrestling:":"\u{1F93C}",":women_wrestling:":"\u{1F93C}\u200D\u2640\uFE0F",":men_wrestling:":"\u{1F93C}\u200D\u2642\uFE0F",":person_doing_cartwheel:":"\u{1F938}",":cartwheel:":"\u{1F938}",":person_doing_cartwheel_tone1:":"\u{1F938}\u{1F3FB}",":cartwheel_tone1:":"\u{1F938}\u{1F3FB}",":person_doing_cartwheel_tone2:":"\u{1F938}\u{1F3FC}",":cartwheel_tone2:":"\u{1F938}\u{1F3FC}",":person_doing_cartwheel_tone3:":"\u{1F938}\u{1F3FD}",":cartwheel_tone3:":"\u{1F938}\u{1F3FD}",":person_doing_cartwheel_tone4:":"\u{1F938}\u{1F3FE}",":cartwheel_tone4:":"\u{1F938}\u{1F3FE}",":person_doing_cartwheel_tone5:":"\u{1F938}\u{1F3FF}",":cartwheel_tone5:":"\u{1F938}\u{1F3FF}",":woman_cartwheeling:":"\u{1F938}\u200D\u2640\uFE0F",":woman_cartwheeling_tone1:":"\u{1F938}\u{1F3FB}\u200D\u2640\uFE0F",":woman_cartwheeling_light_skin_tone:":"\u{1F938}\u{1F3FB}\u200D\u2640\uFE0F",":woman_cartwheeling_tone2:":"\u{1F938}\u{1F3FC}\u200D\u2640\uFE0F",":woman_cartwheeling_medium_light_skin_tone:":"\u{1F938}\u{1F3FC}\u200D\u2640\uFE0F",":woman_cartwheeling_tone3:":"\u{1F938}\u{1F3FD}\u200D\u2640\uFE0F",":woman_cartwheeling_medium_skin_tone:":"\u{1F938}\u{1F3FD}\u200D\u2640\uFE0F",":woman_cartwheeling_tone4:":"\u{1F938}\u{1F3FE}\u200D\u2640\uFE0F",":woman_cartwheeling_medium_dark_skin_tone:":"\u{1F938}\u{1F3FE}\u200D\u2640\uFE0F",":woman_cartwheeling_tone5:":"\u{1F938}\u{1F3FF}\u200D\u2640\uFE0F",":woman_cartwheeling_dark_skin_tone:":"\u{1F938}\u{1F3FF}\u200D\u2640\uFE0F",":man_cartwheeling:":"\u{1F938}\u200D\u2642\uFE0F",":man_cartwheeling_tone1:":"\u{1F938}\u{1F3FB}\u200D\u2642\uFE0F",":man_cartwheeling_light_skin_tone:":"\u{1F938}\u{1F3FB}\u200D\u2642\uFE0F",":man_cartwheeling_tone2:":"\u{1F938}\u{1F3FC}\u200D\u2642\uFE0F",":man_cartwheeling_medium_light_skin_tone:":"\u{1F938}\u{1F3FC}\u200D\u2642\uFE0F",":man_cartwheeling_tone3:":"\u{1F938}\u{1F3FD}\u200D\u2642\uFE0F",":man_cartwheeling_medium_skin_tone:":"\u{1F938}\u{1F3FD}\u200D\u2642\uFE0F",":man_cartwheeling_tone4:":"\u{1F938}\u{1F3FE}\u200D\u2642\uFE0F",":man_cartwheeling_medium_dark_skin_tone:":"\u{1F938}\u{1F3FE}\u200D\u2642\uFE0F",":man_cartwheeling_tone5:":"\u{1F938}\u{1F3FF}\u200D\u2642\uFE0F",":man_cartwheeling_dark_skin_tone:":"\u{1F938}\u{1F3FF}\u200D\u2642\uFE0F",":person_bouncing_ball:":"\u26F9\uFE0F",":basketball_player:":"\u26F9\uFE0F",":person_with_ball:":"\u26F9\uFE0F",":person_bouncing_ball_tone1:":"\u26F9\u{1F3FB}",":basketball_player_tone1:":"\u26F9\u{1F3FB}",":person_with_ball_tone1:":"\u26F9\u{1F3FB}",":person_bouncing_ball_tone2:":"\u26F9\u{1F3FC}",":basketball_player_tone2:":"\u26F9\u{1F3FC}",":person_with_ball_tone2:":"\u26F9\u{1F3FC}",":person_bouncing_ball_tone3:":"\u26F9\u{1F3FD}",":basketball_player_tone3:":"\u26F9\u{1F3FD}",":person_with_ball_tone3:":"\u26F9\u{1F3FD}",":person_bouncing_ball_tone4:":"\u26F9\u{1F3FE}",":basketball_player_tone4:":"\u26F9\u{1F3FE}",":person_with_ball_tone4:":"\u26F9\u{1F3FE}",":person_bouncing_ball_tone5:":"\u26F9\u{1F3FF}",":basketball_player_tone5:":"\u26F9\u{1F3FF}",":person_with_ball_tone5:":"\u26F9\u{1F3FF}",":woman_bouncing_ball:":"\u26F9\uFE0F\u200D\u2640\uFE0F",":woman_bouncing_ball_tone1:":"\u26F9\u{1F3FB}\u200D\u2640\uFE0F",":woman_bouncing_ball_light_skin_tone:":"\u26F9\u{1F3FB}\u200D\u2640\uFE0F",":woman_bouncing_ball_tone2:":"\u26F9\u{1F3FC}\u200D\u2640\uFE0F",":woman_bouncing_ball_medium_light_skin_tone:":"\u26F9\u{1F3FC}\u200D\u2640\uFE0F",":woman_bouncing_ball_tone3:":"\u26F9\u{1F3FD}\u200D\u2640\uFE0F",":woman_bouncing_ball_medium_skin_tone:":"\u26F9\u{1F3FD}\u200D\u2640\uFE0F",":woman_bouncing_ball_tone4:":"\u26F9\u{1F3FE}\u200D\u2640\uFE0F",":woman_bouncing_ball_medium_dark_skin_tone:":"\u26F9\u{1F3FE}\u200D\u2640\uFE0F",":woman_bouncing_ball_tone5:":"\u26F9\u{1F3FF}\u200D\u2640\uFE0F",":woman_bouncing_ball_dark_skin_tone:":"\u26F9\u{1F3FF}\u200D\u2640\uFE0F",":man_bouncing_ball:":"\u26F9\uFE0F\u200D\u2642\uFE0F",":man_bouncing_ball_tone1:":"\u26F9\u{1F3FB}\u200D\u2642\uFE0F",":man_bouncing_ball_light_skin_tone:":"\u26F9\u{1F3FB}\u200D\u2642\uFE0F",":man_bouncing_ball_tone2:":"\u26F9\u{1F3FC}\u200D\u2642\uFE0F",":man_bouncing_ball_medium_light_skin_tone:":"\u26F9\u{1F3FC}\u200D\u2642\uFE0F",":man_bouncing_ball_tone3:":"\u26F9\u{1F3FD}\u200D\u2642\uFE0F",":man_bouncing_ball_medium_skin_tone:":"\u26F9\u{1F3FD}\u200D\u2642\uFE0F",":man_bouncing_ball_tone4:":"\u26F9\u{1F3FE}\u200D\u2642\uFE0F",":man_bouncing_ball_medium_dark_skin_tone:":"\u26F9\u{1F3FE}\u200D\u2642\uFE0F",":man_bouncing_ball_tone5:":"\u26F9\u{1F3FF}\u200D\u2642\uFE0F",":man_bouncing_ball_dark_skin_tone:":"\u26F9\u{1F3FF}\u200D\u2642\uFE0F",":person_fencing:":"\u{1F93A}",":fencer:":"\u{1F93A}",":fencing:":"\u{1F93A}",":person_playing_handball:":"\u{1F93E}",":handball:":"\u{1F93E}",":person_playing_handball_tone1:":"\u{1F93E}\u{1F3FB}",":handball_tone1:":"\u{1F93E}\u{1F3FB}",":person_playing_handball_tone2:":"\u{1F93E}\u{1F3FC}",":handball_tone2:":"\u{1F93E}\u{1F3FC}",":person_playing_handball_tone3:":"\u{1F93E}\u{1F3FD}",":handball_tone3:":"\u{1F93E}\u{1F3FD}",":person_playing_handball_tone4:":"\u{1F93E}\u{1F3FE}",":handball_tone4:":"\u{1F93E}\u{1F3FE}",":person_playing_handball_tone5:":"\u{1F93E}\u{1F3FF}",":handball_tone5:":"\u{1F93E}\u{1F3FF}",":woman_playing_handball:":"\u{1F93E}\u200D\u2640\uFE0F",":woman_playing_handball_tone1:":"\u{1F93E}\u{1F3FB}\u200D\u2640\uFE0F",":woman_playing_handball_light_skin_tone:":"\u{1F93E}\u{1F3FB}\u200D\u2640\uFE0F",":woman_playing_handball_tone2:":"\u{1F93E}\u{1F3FC}\u200D\u2640\uFE0F",":woman_playing_handball_medium_light_skin_tone:":"\u{1F93E}\u{1F3FC}\u200D\u2640\uFE0F",":woman_playing_handball_tone3:":"\u{1F93E}\u{1F3FD}\u200D\u2640\uFE0F",":woman_playing_handball_medium_skin_tone:":"\u{1F93E}\u{1F3FD}\u200D\u2640\uFE0F",":woman_playing_handball_tone4:":"\u{1F93E}\u{1F3FE}\u200D\u2640\uFE0F",":woman_playing_handball_medium_dark_skin_tone:":"\u{1F93E}\u{1F3FE}\u200D\u2640\uFE0F",":woman_playing_handball_tone5:":"\u{1F93E}\u{1F3FF}\u200D\u2640\uFE0F",":woman_playing_handball_dark_skin_tone:":"\u{1F93E}\u{1F3FF}\u200D\u2640\uFE0F",":man_playing_handball:":"\u{1F93E}\u200D\u2642\uFE0F",":man_playing_handball_tone1:":"\u{1F93E}\u{1F3FB}\u200D\u2642\uFE0F",":man_playing_handball_light_skin_tone:":"\u{1F93E}\u{1F3FB}\u200D\u2642\uFE0F",":man_playing_handball_tone2:":"\u{1F93E}\u{1F3FC}\u200D\u2642\uFE0F",":man_playing_handball_medium_light_skin_tone:":"\u{1F93E}\u{1F3FC}\u200D\u2642\uFE0F",":man_playing_handball_tone3:":"\u{1F93E}\u{1F3FD}\u200D\u2642\uFE0F",":man_playing_handball_medium_skin_tone:":"\u{1F93E}\u{1F3FD}\u200D\u2642\uFE0F",":man_playing_handball_tone4:":"\u{1F93E}\u{1F3FE}\u200D\u2642\uFE0F",":man_playing_handball_medium_dark_skin_tone:":"\u{1F93E}\u{1F3FE}\u200D\u2642\uFE0F",":man_playing_handball_tone5:":"\u{1F93E}\u{1F3FF}\u200D\u2642\uFE0F",":man_playing_handball_dark_skin_tone:":"\u{1F93E}\u{1F3FF}\u200D\u2642\uFE0F",":person_golfing:":"\u{1F3CC}\uFE0F",":golfer:":"\u{1F3CC}\uFE0F",":person_golfing_tone1:":"\u{1F3CC}\u{1F3FB}",":person_golfing_light_skin_tone:":"\u{1F3CC}\u{1F3FB}",":person_golfing_tone2:":"\u{1F3CC}\u{1F3FC}",":person_golfing_medium_light_skin_tone:":"\u{1F3CC}\u{1F3FC}",":person_golfing_tone3:":"\u{1F3CC}\u{1F3FD}",":person_golfing_medium_skin_tone:":"\u{1F3CC}\u{1F3FD}",":person_golfing_tone4:":"\u{1F3CC}\u{1F3FE}",":person_golfing_medium_dark_skin_tone:":"\u{1F3CC}\u{1F3FE}",":person_golfing_tone5:":"\u{1F3CC}\u{1F3FF}",":person_golfing_dark_skin_tone:":"\u{1F3CC}\u{1F3FF}",":woman_golfing:":"\u{1F3CC}\uFE0F\u200D\u2640\uFE0F",":woman_golfing_tone1:":"\u{1F3CC}\u{1F3FB}\u200D\u2640\uFE0F",":woman_golfing_light_skin_tone:":"\u{1F3CC}\u{1F3FB}\u200D\u2640\uFE0F",":woman_golfing_tone2:":"\u{1F3CC}\u{1F3FC}\u200D\u2640\uFE0F",":woman_golfing_medium_light_skin_tone:":"\u{1F3CC}\u{1F3FC}\u200D\u2640\uFE0F",":woman_golfing_tone3:":"\u{1F3CC}\u{1F3FD}\u200D\u2640\uFE0F",":woman_golfing_medium_skin_tone:":"\u{1F3CC}\u{1F3FD}\u200D\u2640\uFE0F",":woman_golfing_tone4:":"\u{1F3CC}\u{1F3FE}\u200D\u2640\uFE0F",":woman_golfing_medium_dark_skin_tone:":"\u{1F3CC}\u{1F3FE}\u200D\u2640\uFE0F",":woman_golfing_tone5:":"\u{1F3CC}\u{1F3FF}\u200D\u2640\uFE0F",":woman_golfing_dark_skin_tone:":"\u{1F3CC}\u{1F3FF}\u200D\u2640\uFE0F",":man_golfing:":"\u{1F3CC}\uFE0F\u200D\u2642\uFE0F",":man_golfing_tone1:":"\u{1F3CC}\u{1F3FB}\u200D\u2642\uFE0F",":man_golfing_light_skin_tone:":"\u{1F3CC}\u{1F3FB}\u200D\u2642\uFE0F",":man_golfing_tone2:":"\u{1F3CC}\u{1F3FC}\u200D\u2642\uFE0F",":man_golfing_medium_light_skin_tone:":"\u{1F3CC}\u{1F3FC}\u200D\u2642\uFE0F",":man_golfing_tone3:":"\u{1F3CC}\u{1F3FD}\u200D\u2642\uFE0F",":man_golfing_medium_skin_tone:":"\u{1F3CC}\u{1F3FD}\u200D\u2642\uFE0F",":man_golfing_tone4:":"\u{1F3CC}\u{1F3FE}\u200D\u2642\uFE0F",":man_golfing_medium_dark_skin_tone:":"\u{1F3CC}\u{1F3FE}\u200D\u2642\uFE0F",":man_golfing_tone5:":"\u{1F3CC}\u{1F3FF}\u200D\u2642\uFE0F",":man_golfing_dark_skin_tone:":"\u{1F3CC}\u{1F3FF}\u200D\u2642\uFE0F",":horse_racing:":"\u{1F3C7}",":horse_racing_tone1:":"\u{1F3C7}\u{1F3FB}",":horse_racing_tone2:":"\u{1F3C7}\u{1F3FC}",":horse_racing_tone3:":"\u{1F3C7}\u{1F3FD}",":horse_racing_tone4:":"\u{1F3C7}\u{1F3FE}",":horse_racing_tone5:":"\u{1F3C7}\u{1F3FF}",":person_in_lotus_position:":"\u{1F9D8}",":person_in_lotus_position_tone1:":"\u{1F9D8}\u{1F3FB}",":person_in_lotus_position_light_skin_tone:":"\u{1F9D8}\u{1F3FB}",":person_in_lotus_position_tone2:":"\u{1F9D8}\u{1F3FC}",":person_in_lotus_position_medium_light_skin_tone:":"\u{1F9D8}\u{1F3FC}",":person_in_lotus_position_tone3:":"\u{1F9D8}\u{1F3FD}",":person_in_lotus_position_medium_skin_tone:":"\u{1F9D8}\u{1F3FD}",":person_in_lotus_position_tone4:":"\u{1F9D8}\u{1F3FE}",":person_in_lotus_position_medium_dark_skin_tone:":"\u{1F9D8}\u{1F3FE}",":person_in_lotus_position_tone5:":"\u{1F9D8}\u{1F3FF}",":person_in_lotus_position_dark_skin_tone:":"\u{1F9D8}\u{1F3FF}",":woman_in_lotus_position:":"\u{1F9D8}\u200D\u2640\uFE0F",":woman_in_lotus_position_tone1:":"\u{1F9D8}\u{1F3FB}\u200D\u2640\uFE0F",":woman_in_lotus_position_light_skin_tone:":"\u{1F9D8}\u{1F3FB}\u200D\u2640\uFE0F",":woman_in_lotus_position_tone2:":"\u{1F9D8}\u{1F3FC}\u200D\u2640\uFE0F",":woman_in_lotus_position_medium_light_skin_tone:":"\u{1F9D8}\u{1F3FC}\u200D\u2640\uFE0F",":woman_in_lotus_position_tone3:":"\u{1F9D8}\u{1F3FD}\u200D\u2640\uFE0F",":woman_in_lotus_position_medium_skin_tone:":"\u{1F9D8}\u{1F3FD}\u200D\u2640\uFE0F",":woman_in_lotus_position_tone4:":"\u{1F9D8}\u{1F3FE}\u200D\u2640\uFE0F",":woman_in_lotus_position_medium_dark_skin_tone:":"\u{1F9D8}\u{1F3FE}\u200D\u2640\uFE0F",":woman_in_lotus_position_tone5:":"\u{1F9D8}\u{1F3FF}\u200D\u2640\uFE0F",":woman_in_lotus_position_dark_skin_tone:":"\u{1F9D8}\u{1F3FF}\u200D\u2640\uFE0F",":man_in_lotus_position:":"\u{1F9D8}\u200D\u2642\uFE0F",":man_in_lotus_position_tone1:":"\u{1F9D8}\u{1F3FB}\u200D\u2642\uFE0F",":man_in_lotus_position_light_skin_tone:":"\u{1F9D8}\u{1F3FB}\u200D\u2642\uFE0F",":man_in_lotus_position_tone2:":"\u{1F9D8}\u{1F3FC}\u200D\u2642\uFE0F",":man_in_lotus_position_medium_light_skin_tone:":"\u{1F9D8}\u{1F3FC}\u200D\u2642\uFE0F",":man_in_lotus_position_tone3:":"\u{1F9D8}\u{1F3FD}\u200D\u2642\uFE0F",":man_in_lotus_position_medium_skin_tone:":"\u{1F9D8}\u{1F3FD}\u200D\u2642\uFE0F",":man_in_lotus_position_tone4:":"\u{1F9D8}\u{1F3FE}\u200D\u2642\uFE0F",":man_in_lotus_position_medium_dark_skin_tone:":"\u{1F9D8}\u{1F3FE}\u200D\u2642\uFE0F",":man_in_lotus_position_tone5:":"\u{1F9D8}\u{1F3FF}\u200D\u2642\uFE0F",":man_in_lotus_position_dark_skin_tone:":"\u{1F9D8}\u{1F3FF}\u200D\u2642\uFE0F",":person_surfing:":"\u{1F3C4}",":surfer:":"\u{1F3C4}",":person_surfing_tone1:":"\u{1F3C4}\u{1F3FB}",":surfer_tone1:":"\u{1F3C4}\u{1F3FB}",":person_surfing_tone2:":"\u{1F3C4}\u{1F3FC}",":surfer_tone2:":"\u{1F3C4}\u{1F3FC}",":person_surfing_tone3:":"\u{1F3C4}\u{1F3FD}",":surfer_tone3:":"\u{1F3C4}\u{1F3FD}",":person_surfing_tone4:":"\u{1F3C4}\u{1F3FE}",":surfer_tone4:":"\u{1F3C4}\u{1F3FE}",":person_surfing_tone5:":"\u{1F3C4}\u{1F3FF}",":surfer_tone5:":"\u{1F3C4}\u{1F3FF}",":woman_surfing:":"\u{1F3C4}\u200D\u2640\uFE0F",":woman_surfing_tone1:":"\u{1F3C4}\u{1F3FB}\u200D\u2640\uFE0F",":woman_surfing_light_skin_tone:":"\u{1F3C4}\u{1F3FB}\u200D\u2640\uFE0F",":woman_surfing_tone2:":"\u{1F3C4}\u{1F3FC}\u200D\u2640\uFE0F",":woman_surfing_medium_light_skin_tone:":"\u{1F3C4}\u{1F3FC}\u200D\u2640\uFE0F",":woman_surfing_tone3:":"\u{1F3C4}\u{1F3FD}\u200D\u2640\uFE0F",":woman_surfing_medium_skin_tone:":"\u{1F3C4}\u{1F3FD}\u200D\u2640\uFE0F",":woman_surfing_tone4:":"\u{1F3C4}\u{1F3FE}\u200D\u2640\uFE0F",":woman_surfing_medium_dark_skin_tone:":"\u{1F3C4}\u{1F3FE}\u200D\u2640\uFE0F",":woman_surfing_tone5:":"\u{1F3C4}\u{1F3FF}\u200D\u2640\uFE0F",":woman_surfing_dark_skin_tone:":"\u{1F3C4}\u{1F3FF}\u200D\u2640\uFE0F",":man_surfing:":"\u{1F3C4}\u200D\u2642\uFE0F",":man_surfing_tone1:":"\u{1F3C4}\u{1F3FB}\u200D\u2642\uFE0F",":man_surfing_light_skin_tone:":"\u{1F3C4}\u{1F3FB}\u200D\u2642\uFE0F",":man_surfing_tone2:":"\u{1F3C4}\u{1F3FC}\u200D\u2642\uFE0F",":man_surfing_medium_light_skin_tone:":"\u{1F3C4}\u{1F3FC}\u200D\u2642\uFE0F",":man_surfing_tone3:":"\u{1F3C4}\u{1F3FD}\u200D\u2642\uFE0F",":man_surfing_medium_skin_tone:":"\u{1F3C4}\u{1F3FD}\u200D\u2642\uFE0F",":man_surfing_tone4:":"\u{1F3C4}\u{1F3FE}\u200D\u2642\uFE0F",":man_surfing_medium_dark_skin_tone:":"\u{1F3C4}\u{1F3FE}\u200D\u2642\uFE0F",":man_surfing_tone5:":"\u{1F3C4}\u{1F3FF}\u200D\u2642\uFE0F",":man_surfing_dark_skin_tone:":"\u{1F3C4}\u{1F3FF}\u200D\u2642\uFE0F",":person_swimming:":"\u{1F3CA}",":swimmer:":"\u{1F3CA}",":person_swimming_tone1:":"\u{1F3CA}\u{1F3FB}",":swimmer_tone1:":"\u{1F3CA}\u{1F3FB}",":person_swimming_tone2:":"\u{1F3CA}\u{1F3FC}",":swimmer_tone2:":"\u{1F3CA}\u{1F3FC}",":person_swimming_tone3:":"\u{1F3CA}\u{1F3FD}",":swimmer_tone3:":"\u{1F3CA}\u{1F3FD}",":person_swimming_tone4:":"\u{1F3CA}\u{1F3FE}",":swimmer_tone4:":"\u{1F3CA}\u{1F3FE}",":person_swimming_tone5:":"\u{1F3CA}\u{1F3FF}",":swimmer_tone5:":"\u{1F3CA}\u{1F3FF}",":woman_swimming:":"\u{1F3CA}\u200D\u2640\uFE0F",":woman_swimming_tone1:":"\u{1F3CA}\u{1F3FB}\u200D\u2640\uFE0F",":woman_swimming_light_skin_tone:":"\u{1F3CA}\u{1F3FB}\u200D\u2640\uFE0F",":woman_swimming_tone2:":"\u{1F3CA}\u{1F3FC}\u200D\u2640\uFE0F",":woman_swimming_medium_light_skin_tone:":"\u{1F3CA}\u{1F3FC}\u200D\u2640\uFE0F",":woman_swimming_tone3:":"\u{1F3CA}\u{1F3FD}\u200D\u2640\uFE0F",":woman_swimming_medium_skin_tone:":"\u{1F3CA}\u{1F3FD}\u200D\u2640\uFE0F",":woman_swimming_tone4:":"\u{1F3CA}\u{1F3FE}\u200D\u2640\uFE0F",":woman_swimming_medium_dark_skin_tone:":"\u{1F3CA}\u{1F3FE}\u200D\u2640\uFE0F",":woman_swimming_tone5:":"\u{1F3CA}\u{1F3FF}\u200D\u2640\uFE0F",":woman_swimming_dark_skin_tone:":"\u{1F3CA}\u{1F3FF}\u200D\u2640\uFE0F",":man_swimming:":"\u{1F3CA}\u200D\u2642\uFE0F",":man_swimming_tone1:":"\u{1F3CA}\u{1F3FB}\u200D\u2642\uFE0F",":man_swimming_light_skin_tone:":"\u{1F3CA}\u{1F3FB}\u200D\u2642\uFE0F",":man_swimming_tone2:":"\u{1F3CA}\u{1F3FC}\u200D\u2642\uFE0F",":man_swimming_medium_light_skin_tone:":"\u{1F3CA}\u{1F3FC}\u200D\u2642\uFE0F",":man_swimming_tone3:":"\u{1F3CA}\u{1F3FD}\u200D\u2642\uFE0F",":man_swimming_medium_skin_tone:":"\u{1F3CA}\u{1F3FD}\u200D\u2642\uFE0F",":man_swimming_tone4:":"\u{1F3CA}\u{1F3FE}\u200D\u2642\uFE0F",":man_swimming_medium_dark_skin_tone:":"\u{1F3CA}\u{1F3FE}\u200D\u2642\uFE0F",":man_swimming_tone5:":"\u{1F3CA}\u{1F3FF}\u200D\u2642\uFE0F",":man_swimming_dark_skin_tone:":"\u{1F3CA}\u{1F3FF}\u200D\u2642\uFE0F",":person_playing_water_polo:":"\u{1F93D}",":water_polo:":"\u{1F93D}",":person_playing_water_polo_tone1:":"\u{1F93D}\u{1F3FB}",":water_polo_tone1:":"\u{1F93D}\u{1F3FB}",":person_playing_water_polo_tone2:":"\u{1F93D}\u{1F3FC}",":water_polo_tone2:":"\u{1F93D}\u{1F3FC}",":person_playing_water_polo_tone3:":"\u{1F93D}\u{1F3FD}",":water_polo_tone3:":"\u{1F93D}\u{1F3FD}",":person_playing_water_polo_tone4:":"\u{1F93D}\u{1F3FE}",":water_polo_tone4:":"\u{1F93D}\u{1F3FE}",":person_playing_water_polo_tone5:":"\u{1F93D}\u{1F3FF}",":water_polo_tone5:":"\u{1F93D}\u{1F3FF}",":woman_playing_water_polo:":"\u{1F93D}\u200D\u2640\uFE0F",":woman_playing_water_polo_tone1:":"\u{1F93D}\u{1F3FB}\u200D\u2640\uFE0F",":woman_playing_water_polo_light_skin_tone:":"\u{1F93D}\u{1F3FB}\u200D\u2640\uFE0F",":woman_playing_water_polo_tone2:":"\u{1F93D}\u{1F3FC}\u200D\u2640\uFE0F",":woman_playing_water_polo_medium_light_skin_tone:":"\u{1F93D}\u{1F3FC}\u200D\u2640\uFE0F",":woman_playing_water_polo_tone3:":"\u{1F93D}\u{1F3FD}\u200D\u2640\uFE0F",":woman_playing_water_polo_medium_skin_tone:":"\u{1F93D}\u{1F3FD}\u200D\u2640\uFE0F",":woman_playing_water_polo_tone4:":"\u{1F93D}\u{1F3FE}\u200D\u2640\uFE0F",":woman_playing_water_polo_medium_dark_skin_tone:":"\u{1F93D}\u{1F3FE}\u200D\u2640\uFE0F",":woman_playing_water_polo_tone5:":"\u{1F93D}\u{1F3FF}\u200D\u2640\uFE0F",":woman_playing_water_polo_dark_skin_tone:":"\u{1F93D}\u{1F3FF}\u200D\u2640\uFE0F",":man_playing_water_polo:":"\u{1F93D}\u200D\u2642\uFE0F",":man_playing_water_polo_tone1:":"\u{1F93D}\u{1F3FB}\u200D\u2642\uFE0F",":man_playing_water_polo_light_skin_tone:":"\u{1F93D}\u{1F3FB}\u200D\u2642\uFE0F",":man_playing_water_polo_tone2:":"\u{1F93D}\u{1F3FC}\u200D\u2642\uFE0F",":man_playing_water_polo_medium_light_skin_tone:":"\u{1F93D}\u{1F3FC}\u200D\u2642\uFE0F",":man_playing_water_polo_tone3:":"\u{1F93D}\u{1F3FD}\u200D\u2642\uFE0F",":man_playing_water_polo_medium_skin_tone:":"\u{1F93D}\u{1F3FD}\u200D\u2642\uFE0F",":man_playing_water_polo_tone4:":"\u{1F93D}\u{1F3FE}\u200D\u2642\uFE0F",":man_playing_water_polo_medium_dark_skin_tone:":"\u{1F93D}\u{1F3FE}\u200D\u2642\uFE0F",":man_playing_water_polo_tone5:":"\u{1F93D}\u{1F3FF}\u200D\u2642\uFE0F",":man_playing_water_polo_dark_skin_tone:":"\u{1F93D}\u{1F3FF}\u200D\u2642\uFE0F",":person_rowing_boat:":"\u{1F6A3}",":rowboat:":"\u{1F6A3}",":person_rowing_boat_tone1:":"\u{1F6A3}\u{1F3FB}",":rowboat_tone1:":"\u{1F6A3}\u{1F3FB}",":person_rowing_boat_tone2:":"\u{1F6A3}\u{1F3FC}",":rowboat_tone2:":"\u{1F6A3}\u{1F3FC}",":person_rowing_boat_tone3:":"\u{1F6A3}\u{1F3FD}",":rowboat_tone3:":"\u{1F6A3}\u{1F3FD}",":person_rowing_boat_tone4:":"\u{1F6A3}\u{1F3FE}",":rowboat_tone4:":"\u{1F6A3}\u{1F3FE}",":person_rowing_boat_tone5:":"\u{1F6A3}\u{1F3FF}",":rowboat_tone5:":"\u{1F6A3}\u{1F3FF}",":woman_rowing_boat:":"\u{1F6A3}\u200D\u2640\uFE0F",":woman_rowing_boat_tone1:":"\u{1F6A3}\u{1F3FB}\u200D\u2640\uFE0F",":woman_rowing_boat_light_skin_tone:":"\u{1F6A3}\u{1F3FB}\u200D\u2640\uFE0F",":woman_rowing_boat_tone2:":"\u{1F6A3}\u{1F3FC}\u200D\u2640\uFE0F",":woman_rowing_boat_medium_light_skin_tone:":"\u{1F6A3}\u{1F3FC}\u200D\u2640\uFE0F",":woman_rowing_boat_tone3:":"\u{1F6A3}\u{1F3FD}\u200D\u2640\uFE0F",":woman_rowing_boat_medium_skin_tone:":"\u{1F6A3}\u{1F3FD}\u200D\u2640\uFE0F",":woman_rowing_boat_tone4:":"\u{1F6A3}\u{1F3FE}\u200D\u2640\uFE0F",":woman_rowing_boat_medium_dark_skin_tone:":"\u{1F6A3}\u{1F3FE}\u200D\u2640\uFE0F",":woman_rowing_boat_tone5:":"\u{1F6A3}\u{1F3FF}\u200D\u2640\uFE0F",":woman_rowing_boat_dark_skin_tone:":"\u{1F6A3}\u{1F3FF}\u200D\u2640\uFE0F",":man_rowing_boat:":"\u{1F6A3}\u200D\u2642\uFE0F",":man_rowing_boat_tone1:":"\u{1F6A3}\u{1F3FB}\u200D\u2642\uFE0F",":man_rowing_boat_light_skin_tone:":"\u{1F6A3}\u{1F3FB}\u200D\u2642\uFE0F",":man_rowing_boat_tone2:":"\u{1F6A3}\u{1F3FC}\u200D\u2642\uFE0F",":man_rowing_boat_medium_light_skin_tone:":"\u{1F6A3}\u{1F3FC}\u200D\u2642\uFE0F",":man_rowing_boat_tone3:":"\u{1F6A3}\u{1F3FD}\u200D\u2642\uFE0F",":man_rowing_boat_medium_skin_tone:":"\u{1F6A3}\u{1F3FD}\u200D\u2642\uFE0F",":man_rowing_boat_tone4:":"\u{1F6A3}\u{1F3FE}\u200D\u2642\uFE0F",":man_rowing_boat_medium_dark_skin_tone:":"\u{1F6A3}\u{1F3FE}\u200D\u2642\uFE0F",":man_rowing_boat_tone5:":"\u{1F6A3}\u{1F3FF}\u200D\u2642\uFE0F",":man_rowing_boat_dark_skin_tone:":"\u{1F6A3}\u{1F3FF}\u200D\u2642\uFE0F",":person_climbing:":"\u{1F9D7}",":person_climbing_tone1:":"\u{1F9D7}\u{1F3FB}",":person_climbing_light_skin_tone:":"\u{1F9D7}\u{1F3FB}",":person_climbing_tone2:":"\u{1F9D7}\u{1F3FC}",":person_climbing_medium_light_skin_tone:":"\u{1F9D7}\u{1F3FC}",":person_climbing_tone3:":"\u{1F9D7}\u{1F3FD}",":person_climbing_medium_skin_tone:":"\u{1F9D7}\u{1F3FD}",":person_climbing_tone4:":"\u{1F9D7}\u{1F3FE}",":person_climbing_medium_dark_skin_tone:":"\u{1F9D7}\u{1F3FE}",":person_climbing_tone5:":"\u{1F9D7}\u{1F3FF}",":person_climbing_dark_skin_tone:":"\u{1F9D7}\u{1F3FF}",":woman_climbing:":"\u{1F9D7}\u200D\u2640\uFE0F",":woman_climbing_tone1:":"\u{1F9D7}\u{1F3FB}\u200D\u2640\uFE0F",":woman_climbing_light_skin_tone:":"\u{1F9D7}\u{1F3FB}\u200D\u2640\uFE0F",":woman_climbing_tone2:":"\u{1F9D7}\u{1F3FC}\u200D\u2640\uFE0F",":woman_climbing_medium_light_skin_tone:":"\u{1F9D7}\u{1F3FC}\u200D\u2640\uFE0F",":woman_climbing_tone3:":"\u{1F9D7}\u{1F3FD}\u200D\u2640\uFE0F",":woman_climbing_medium_skin_tone:":"\u{1F9D7}\u{1F3FD}\u200D\u2640\uFE0F",":woman_climbing_tone4:":"\u{1F9D7}\u{1F3FE}\u200D\u2640\uFE0F",":woman_climbing_medium_dark_skin_tone:":"\u{1F9D7}\u{1F3FE}\u200D\u2640\uFE0F",":woman_climbing_tone5:":"\u{1F9D7}\u{1F3FF}\u200D\u2640\uFE0F",":woman_climbing_dark_skin_tone:":"\u{1F9D7}\u{1F3FF}\u200D\u2640\uFE0F",":man_climbing:":"\u{1F9D7}\u200D\u2642\uFE0F",":man_climbing_tone1:":"\u{1F9D7}\u{1F3FB}\u200D\u2642\uFE0F",":man_climbing_light_skin_tone:":"\u{1F9D7}\u{1F3FB}\u200D\u2642\uFE0F",":man_climbing_tone2:":"\u{1F9D7}\u{1F3FC}\u200D\u2642\uFE0F",":man_climbing_medium_light_skin_tone:":"\u{1F9D7}\u{1F3FC}\u200D\u2642\uFE0F",":man_climbing_tone3:":"\u{1F9D7}\u{1F3FD}\u200D\u2642\uFE0F",":man_climbing_medium_skin_tone:":"\u{1F9D7}\u{1F3FD}\u200D\u2642\uFE0F",":man_climbing_tone4:":"\u{1F9D7}\u{1F3FE}\u200D\u2642\uFE0F",":man_climbing_medium_dark_skin_tone:":"\u{1F9D7}\u{1F3FE}\u200D\u2642\uFE0F",":man_climbing_tone5:":"\u{1F9D7}\u{1F3FF}\u200D\u2642\uFE0F",":man_climbing_dark_skin_tone:":"\u{1F9D7}\u{1F3FF}\u200D\u2642\uFE0F",":person_mountain_biking:":"\u{1F6B5}",":mountain_bicyclist:":"\u{1F6B5}",":person_mountain_biking_tone1:":"\u{1F6B5}\u{1F3FB}",":mountain_bicyclist_tone1:":"\u{1F6B5}\u{1F3FB}",":person_mountain_biking_tone2:":"\u{1F6B5}\u{1F3FC}",":mountain_bicyclist_tone2:":"\u{1F6B5}\u{1F3FC}",":person_mountain_biking_tone3:":"\u{1F6B5}\u{1F3FD}",":mountain_bicyclist_tone3:":"\u{1F6B5}\u{1F3FD}",":person_mountain_biking_tone4:":"\u{1F6B5}\u{1F3FE}",":mountain_bicyclist_tone4:":"\u{1F6B5}\u{1F3FE}",":person_mountain_biking_tone5:":"\u{1F6B5}\u{1F3FF}",":mountain_bicyclist_tone5:":"\u{1F6B5}\u{1F3FF}",":woman_mountain_biking:":"\u{1F6B5}\u200D\u2640\uFE0F",":woman_mountain_biking_tone1:":"\u{1F6B5}\u{1F3FB}\u200D\u2640\uFE0F",":woman_mountain_biking_light_skin_tone:":"\u{1F6B5}\u{1F3FB}\u200D\u2640\uFE0F",":woman_mountain_biking_tone2:":"\u{1F6B5}\u{1F3FC}\u200D\u2640\uFE0F",":woman_mountain_biking_medium_light_skin_tone:":"\u{1F6B5}\u{1F3FC}\u200D\u2640\uFE0F",":woman_mountain_biking_tone3:":"\u{1F6B5}\u{1F3FD}\u200D\u2640\uFE0F",":woman_mountain_biking_medium_skin_tone:":"\u{1F6B5}\u{1F3FD}\u200D\u2640\uFE0F",":woman_mountain_biking_tone4:":"\u{1F6B5}\u{1F3FE}\u200D\u2640\uFE0F",":woman_mountain_biking_medium_dark_skin_tone:":"\u{1F6B5}\u{1F3FE}\u200D\u2640\uFE0F",":woman_mountain_biking_tone5:":"\u{1F6B5}\u{1F3FF}\u200D\u2640\uFE0F",":woman_mountain_biking_dark_skin_tone:":"\u{1F6B5}\u{1F3FF}\u200D\u2640\uFE0F",":man_mountain_biking:":"\u{1F6B5}\u200D\u2642\uFE0F",":man_mountain_biking_tone1:":"\u{1F6B5}\u{1F3FB}\u200D\u2642\uFE0F",":man_mountain_biking_light_skin_tone:":"\u{1F6B5}\u{1F3FB}\u200D\u2642\uFE0F",":man_mountain_biking_tone2:":"\u{1F6B5}\u{1F3FC}\u200D\u2642\uFE0F",":man_mountain_biking_medium_light_skin_tone:":"\u{1F6B5}\u{1F3FC}\u200D\u2642\uFE0F",":man_mountain_biking_tone3:":"\u{1F6B5}\u{1F3FD}\u200D\u2642\uFE0F",":man_mountain_biking_medium_skin_tone:":"\u{1F6B5}\u{1F3FD}\u200D\u2642\uFE0F",":man_mountain_biking_tone4:":"\u{1F6B5}\u{1F3FE}\u200D\u2642\uFE0F",":man_mountain_biking_medium_dark_skin_tone:":"\u{1F6B5}\u{1F3FE}\u200D\u2642\uFE0F",":man_mountain_biking_tone5:":"\u{1F6B5}\u{1F3FF}\u200D\u2642\uFE0F",":man_mountain_biking_dark_skin_tone:":"\u{1F6B5}\u{1F3FF}\u200D\u2642\uFE0F",":person_biking:":"\u{1F6B4}",":bicyclist:":"\u{1F6B4}",":person_biking_tone1:":"\u{1F6B4}\u{1F3FB}",":bicyclist_tone1:":"\u{1F6B4}\u{1F3FB}",":person_biking_tone2:":"\u{1F6B4}\u{1F3FC}",":bicyclist_tone2:":"\u{1F6B4}\u{1F3FC}",":person_biking_tone3:":"\u{1F6B4}\u{1F3FD}",":bicyclist_tone3:":"\u{1F6B4}\u{1F3FD}",":person_biking_tone4:":"\u{1F6B4}\u{1F3FE}",":bicyclist_tone4:":"\u{1F6B4}\u{1F3FE}",":person_biking_tone5:":"\u{1F6B4}\u{1F3FF}",":bicyclist_tone5:":"\u{1F6B4}\u{1F3FF}",":woman_biking:":"\u{1F6B4}\u200D\u2640\uFE0F",":woman_biking_tone1:":"\u{1F6B4}\u{1F3FB}\u200D\u2640\uFE0F",":woman_biking_light_skin_tone:":"\u{1F6B4}\u{1F3FB}\u200D\u2640\uFE0F",":woman_biking_tone2:":"\u{1F6B4}\u{1F3FC}\u200D\u2640\uFE0F",":woman_biking_medium_light_skin_tone:":"\u{1F6B4}\u{1F3FC}\u200D\u2640\uFE0F",":woman_biking_tone3:":"\u{1F6B4}\u{1F3FD}\u200D\u2640\uFE0F",":woman_biking_medium_skin_tone:":"\u{1F6B4}\u{1F3FD}\u200D\u2640\uFE0F",":woman_biking_tone4:":"\u{1F6B4}\u{1F3FE}\u200D\u2640\uFE0F",":woman_biking_medium_dark_skin_tone:":"\u{1F6B4}\u{1F3FE}\u200D\u2640\uFE0F",":woman_biking_tone5:":"\u{1F6B4}\u{1F3FF}\u200D\u2640\uFE0F",":woman_biking_dark_skin_tone:":"\u{1F6B4}\u{1F3FF}\u200D\u2640\uFE0F",":man_biking:":"\u{1F6B4}\u200D\u2642\uFE0F",":man_biking_tone1:":"\u{1F6B4}\u{1F3FB}\u200D\u2642\uFE0F",":man_biking_light_skin_tone:":"\u{1F6B4}\u{1F3FB}\u200D\u2642\uFE0F",":man_biking_tone2:":"\u{1F6B4}\u{1F3FC}\u200D\u2642\uFE0F",":man_biking_medium_light_skin_tone:":"\u{1F6B4}\u{1F3FC}\u200D\u2642\uFE0F",":man_biking_tone3:":"\u{1F6B4}\u{1F3FD}\u200D\u2642\uFE0F",":man_biking_medium_skin_tone:":"\u{1F6B4}\u{1F3FD}\u200D\u2642\uFE0F",":man_biking_tone4:":"\u{1F6B4}\u{1F3FE}\u200D\u2642\uFE0F",":man_biking_medium_dark_skin_tone:":"\u{1F6B4}\u{1F3FE}\u200D\u2642\uFE0F",":man_biking_tone5:":"\u{1F6B4}\u{1F3FF}\u200D\u2642\uFE0F",":man_biking_dark_skin_tone:":"\u{1F6B4}\u{1F3FF}\u200D\u2642\uFE0F",":trophy:":"\u{1F3C6}",":first_place:":"\u{1F947}",":first_place_medal:":"\u{1F947}",":second_place:":"\u{1F948}",":second_place_medal:":"\u{1F948}",":third_place:":"\u{1F949}",":third_place_medal:":"\u{1F949}",":medal:":"\u{1F3C5}",":sports_medal:":"\u{1F3C5}",":military_medal:":"\u{1F396}\uFE0F",":rosette:":"\u{1F3F5}\uFE0F",":reminder_ribbon:":"\u{1F397}\uFE0F",":ticket:":"\u{1F3AB}",":tickets:":"\u{1F39F}\uFE0F",":admission_tickets:":"\u{1F39F}\uFE0F",":circus_tent:":"\u{1F3AA}",":person_juggling:":"\u{1F939}",":juggling:":"\u{1F939}",":juggler:":"\u{1F939}",":person_juggling_tone1:":"\u{1F939}\u{1F3FB}",":juggling_tone1:":"\u{1F939}\u{1F3FB}",":juggler_tone1:":"\u{1F939}\u{1F3FB}",":person_juggling_tone2:":"\u{1F939}\u{1F3FC}",":juggling_tone2:":"\u{1F939}\u{1F3FC}",":juggler_tone2:":"\u{1F939}\u{1F3FC}",":person_juggling_tone3:":"\u{1F939}\u{1F3FD}",":juggling_tone3:":"\u{1F939}\u{1F3FD}",":juggler_tone3:":"\u{1F939}\u{1F3FD}",":person_juggling_tone4:":"\u{1F939}\u{1F3FE}",":juggling_tone4:":"\u{1F939}\u{1F3FE}",":juggler_tone4:":"\u{1F939}\u{1F3FE}",":person_juggling_tone5:":"\u{1F939}\u{1F3FF}",":juggling_tone5:":"\u{1F939}\u{1F3FF}",":juggler_tone5:":"\u{1F939}\u{1F3FF}",":woman_juggling:":"\u{1F939}\u200D\u2640\uFE0F",":woman_juggling_tone1:":"\u{1F939}\u{1F3FB}\u200D\u2640\uFE0F",":woman_juggling_light_skin_tone:":"\u{1F939}\u{1F3FB}\u200D\u2640\uFE0F",":woman_juggling_tone2:":"\u{1F939}\u{1F3FC}\u200D\u2640\uFE0F",":woman_juggling_medium_light_skin_tone:":"\u{1F939}\u{1F3FC}\u200D\u2640\uFE0F",":woman_juggling_tone3:":"\u{1F939}\u{1F3FD}\u200D\u2640\uFE0F",":woman_juggling_medium_skin_tone:":"\u{1F939}\u{1F3FD}\u200D\u2640\uFE0F",":woman_juggling_tone4:":"\u{1F939}\u{1F3FE}\u200D\u2640\uFE0F",":woman_juggling_medium_dark_skin_tone:":"\u{1F939}\u{1F3FE}\u200D\u2640\uFE0F",":woman_juggling_tone5:":"\u{1F939}\u{1F3FF}\u200D\u2640\uFE0F",":woman_juggling_dark_skin_tone:":"\u{1F939}\u{1F3FF}\u200D\u2640\uFE0F",":man_juggling:":"\u{1F939}\u200D\u2642\uFE0F",":man_juggling_tone1:":"\u{1F939}\u{1F3FB}\u200D\u2642\uFE0F",":man_juggling_light_skin_tone:":"\u{1F939}\u{1F3FB}\u200D\u2642\uFE0F",":man_juggling_tone2:":"\u{1F939}\u{1F3FC}\u200D\u2642\uFE0F",":man_juggling_medium_light_skin_tone:":"\u{1F939}\u{1F3FC}\u200D\u2642\uFE0F",":man_juggling_tone3:":"\u{1F939}\u{1F3FD}\u200D\u2642\uFE0F",":man_juggling_medium_skin_tone:":"\u{1F939}\u{1F3FD}\u200D\u2642\uFE0F",":man_juggling_tone4:":"\u{1F939}\u{1F3FE}\u200D\u2642\uFE0F",":man_juggling_medium_dark_skin_tone:":"\u{1F939}\u{1F3FE}\u200D\u2642\uFE0F",":man_juggling_tone5:":"\u{1F939}\u{1F3FF}\u200D\u2642\uFE0F",":man_juggling_dark_skin_tone:":"\u{1F939}\u{1F3FF}\u200D\u2642\uFE0F",":performing_arts:":"\u{1F3AD}",":ballet_shoes:":"\u{1FA70}",":art:":"\u{1F3A8}",":clapper:":"\u{1F3AC}",":microphone:":"\u{1F3A4}",":headphones:":"\u{1F3A7}",":musical_score:":"\u{1F3BC}",":musical_keyboard:":"\u{1F3B9}",":drum:":"\u{1F941}",":drum_with_drumsticks:":"\u{1F941}",":long_drum:":"\u{1FA98}",":saxophone:":"\u{1F3B7}",":trumpet:":"\u{1F3BA}",":guitar:":"\u{1F3B8}",":banjo:":"\u{1FA95}",":violin:":"\u{1F3BB}",":accordion:":"\u{1FA97}",":game_die:":"\u{1F3B2}",":chess_pawn:":"\u265F\uFE0F",":dart:":"\u{1F3AF}",":bowling:":"\u{1F3B3}",":video_game:":"\u{1F3AE}",":slot_machine:":"\u{1F3B0}",":jigsaw:":"\u{1F9E9}",":red_car:":"\u{1F697}",":taxi:":"\u{1F695}",":blue_car:":"\u{1F699}",":pickup_truck:":"\u{1F6FB}",":bus:":"\u{1F68C}",":trolleybus:":"\u{1F68E}",":race_car:":"\u{1F3CE}\uFE0F",":racing_car:":"\u{1F3CE}\uFE0F",":police_car:":"\u{1F693}",":ambulance:":"\u{1F691}",":fire_engine:":"\u{1F692}",":minibus:":"\u{1F690}",":truck:":"\u{1F69A}",":articulated_lorry:":"\u{1F69B}",":tractor:":"\u{1F69C}",":probing_cane:":"\u{1F9AF}",":manual_wheelchair:":"\u{1F9BD}",":motorized_wheelchair:":"\u{1F9BC}",":scooter:":"\u{1F6F4}",":bike:":"\u{1F6B2}",":motor_scooter:":"\u{1F6F5}",":motorbike:":"\u{1F6F5}",":motorcycle:":"\u{1F3CD}\uFE0F",":racing_motorcycle:":"\u{1F3CD}\uFE0F",":auto_rickshaw:":"\u{1F6FA}",":rotating_light:":"\u{1F6A8}",":oncoming_police_car:":"\u{1F694}",":oncoming_bus:":"\u{1F68D}",":oncoming_automobile:":"\u{1F698}",":oncoming_taxi:":"\u{1F696}",":aerial_tramway:":"\u{1F6A1}",":mountain_cableway:":"\u{1F6A0}",":suspension_railway:":"\u{1F69F}",":railway_car:":"\u{1F683}",":train:":"\u{1F68B}",":mountain_railway:":"\u{1F69E}",":monorail:":"\u{1F69D}",":bullettrain_side:":"\u{1F684}",":bullettrain_front:":"\u{1F685}",":light_rail:":"\u{1F688}",":steam_locomotive:":"\u{1F682}",":train2:":"\u{1F686}",":metro:":"\u{1F687}",":tram:":"\u{1F68A}",":station:":"\u{1F689}",":airplane:":"\u2708\uFE0F",":airplane_departure:":"\u{1F6EB}",":airplane_arriving:":"\u{1F6EC}",":airplane_small:":"\u{1F6E9}\uFE0F",":small_airplane:":"\u{1F6E9}\uFE0F",":seat:":"\u{1F4BA}",":satellite_orbital:":"\u{1F6F0}\uFE0F",":rocket:":"\u{1F680}",":flying_saucer:":"\u{1F6F8}",":helicopter:":"\u{1F681}",":canoe:":"\u{1F6F6}",":kayak:":"\u{1F6F6}",":sailboat:":"\u26F5",":speedboat:":"\u{1F6A4}",":motorboat:":"\u{1F6E5}\uFE0F",":cruise_ship:":"\u{1F6F3}\uFE0F",":passenger_ship:":"\u{1F6F3}\uFE0F",":ferry:":"\u26F4\uFE0F",":ship:":"\u{1F6A2}",":anchor:":"\u2693",":fuelpump:":"\u26FD",":construction:":"\u{1F6A7}",":vertical_traffic_light:":"\u{1F6A6}",":traffic_light:":"\u{1F6A5}",":busstop:":"\u{1F68F}",":map:":"\u{1F5FA}\uFE0F",":world_map:":"\u{1F5FA}\uFE0F",":moyai:":"\u{1F5FF}",":statue_of_liberty:":"\u{1F5FD}",":tokyo_tower:":"\u{1F5FC}",":european_castle:":"\u{1F3F0}",":japanese_castle:":"\u{1F3EF}",":stadium:":"\u{1F3DF}\uFE0F",":ferris_wheel:":"\u{1F3A1}",":roller_coaster:":"\u{1F3A2}",":carousel_horse:":"\u{1F3A0}",":fountain:":"\u26F2",":beach_umbrella:":"\u26F1\uFE0F",":umbrella_on_ground:":"\u26F1\uFE0F",":beach:":"\u{1F3D6}\uFE0F",":beach_with_umbrella:":"\u{1F3D6}\uFE0F",":island:":"\u{1F3DD}\uFE0F",":desert_island:":"\u{1F3DD}\uFE0F",":desert:":"\u{1F3DC}\uFE0F",":volcano:":"\u{1F30B}",":mountain:":"\u26F0\uFE0F",":mountain_snow:":"\u{1F3D4}\uFE0F",":snow_capped_mountain:":"\u{1F3D4}\uFE0F",":mount_fuji:":"\u{1F5FB}",":camping:":"\u{1F3D5}\uFE0F",":tent:":"\u26FA",":house:":"\u{1F3E0}",":house_with_garden:":"\u{1F3E1}",":homes:":"\u{1F3D8}\uFE0F",":house_buildings:":"\u{1F3D8}\uFE0F",":house_abandoned:":"\u{1F3DA}\uFE0F",":derelict_house_building:":"\u{1F3DA}\uFE0F",":hut:":"\u{1F6D6}",":construction_site:":"\u{1F3D7}\uFE0F",":building_construction:":"\u{1F3D7}\uFE0F",":factory:":"\u{1F3ED}",":office:":"\u{1F3E2}",":department_store:":"\u{1F3EC}",":post_office:":"\u{1F3E3}",":european_post_office:":"\u{1F3E4}",":hospital:":"\u{1F3E5}",":bank:":"\u{1F3E6}",":hotel:":"\u{1F3E8}",":convenience_store:":"\u{1F3EA}",":school:":"\u{1F3EB}",":love_hotel:":"\u{1F3E9}",":wedding:":"\u{1F492}",":classical_building:":"\u{1F3DB}\uFE0F",":church:":"\u26EA",":mosque:":"\u{1F54C}",":synagogue:":"\u{1F54D}",":hindu_temple:":"\u{1F6D5}",":kaaba:":"\u{1F54B}",":shinto_shrine:":"\u26E9\uFE0F",":railway_track:":"\u{1F6E4}\uFE0F",":railroad_track:":"\u{1F6E4}\uFE0F",":motorway:":"\u{1F6E3}\uFE0F",":japan:":"\u{1F5FE}",":rice_scene:":"\u{1F391}",":park:":"\u{1F3DE}\uFE0F",":national_park:":"\u{1F3DE}\uFE0F",":sunrise:":"\u{1F305}",":sunrise_over_mountains:":"\u{1F304}",":stars:":"\u{1F320}",":sparkler:":"\u{1F387}",":fireworks:":"\u{1F386}",":city_sunset:":"\u{1F307}",":city_sunrise:":"\u{1F307}",":city_dusk:":"\u{1F306}",":cityscape:":"\u{1F3D9}\uFE0F",":night_with_stars:":"\u{1F303}",":milky_way:":"\u{1F30C}",":bridge_at_night:":"\u{1F309}",":foggy:":"\u{1F301}",":watch:":"\u231A",":mobile_phone:":"\u{1F4F1}",":iphone:":"\u{1F4F1}",":calling:":"\u{1F4F2}",":computer:":"\u{1F4BB}",":keyboard:":"\u2328\uFE0F",":desktop:":"\u{1F5A5}\uFE0F",":desktop_computer:":"\u{1F5A5}\uFE0F",":printer:":"\u{1F5A8}\uFE0F",":mouse_three_button:":"\u{1F5B1}\uFE0F",":three_button_mouse:":"\u{1F5B1}\uFE0F",":trackball:":"\u{1F5B2}\uFE0F",":joystick:":"\u{1F579}\uFE0F",":compression:":"\u{1F5DC}\uFE0F",":minidisc:":"\u{1F4BD}",":floppy_disk:":"\u{1F4BE}",":cd:":"\u{1F4BF}",":dvd:":"\u{1F4C0}",":vhs:":"\u{1F4FC}",":camera:":"\u{1F4F7}",":camera_with_flash:":"\u{1F4F8}",":video_camera:":"\u{1F4F9}",":movie_camera:":"\u{1F3A5}",":projector:":"\u{1F4FD}\uFE0F",":film_projector:":"\u{1F4FD}\uFE0F",":film_frames:":"\u{1F39E}\uFE0F",":telephone_receiver:":"\u{1F4DE}",":telephone:":"\u260E\uFE0F",":pager:":"\u{1F4DF}",":fax:":"\u{1F4E0}",":tv:":"\u{1F4FA}",":radio:":"\u{1F4FB}",":microphone2:":"\u{1F399}\uFE0F",":studio_microphone:":"\u{1F399}\uFE0F",":level_slider:":"\u{1F39A}\uFE0F",":control_knobs:":"\u{1F39B}\uFE0F",":compass:":"\u{1F9ED}",":stopwatch:":"\u23F1\uFE0F",":timer:":"\u23F2\uFE0F",":timer_clock:":"\u23F2\uFE0F",":alarm_clock:":"\u23F0",":clock:":"\u{1F570}\uFE0F",":mantlepiece_clock:":"\u{1F570}\uFE0F",":hourglass:":"\u231B",":hourglass_flowing_sand:":"\u23F3",":satellite:":"\u{1F4E1}",":battery:":"\u{1F50B}",":electric_plug:":"\u{1F50C}",":bulb:":"\u{1F4A1}",":flashlight:":"\u{1F526}",":candle:":"\u{1F56F}\uFE0F",":diya_lamp:":"\u{1FA94}",":fire_extinguisher:":"\u{1F9EF}",":oil:":"\u{1F6E2}\uFE0F",":oil_drum:":"\u{1F6E2}\uFE0F",":money_with_wings:":"\u{1F4B8}",":dollar:":"\u{1F4B5}",":yen:":"\u{1F4B4}",":euro:":"\u{1F4B6}",":pound:":"\u{1F4B7}",":coin:":"\u{1FA99}",":moneybag:":"\u{1F4B0}",":credit_card:":"\u{1F4B3}",":gem:":"\u{1F48E}",":scales:":"\u2696\uFE0F",":ladder:":"\u{1FA9C}",":toolbox:":"\u{1F9F0}",":screwdriver:":"\u{1FA9B}",":wrench:":"\u{1F527}",":hammer:":"\u{1F528}",":hammer_pick:":"\u2692\uFE0F",":hammer_and_pick:":"\u2692\uFE0F",":tools:":"\u{1F6E0}\uFE0F",":hammer_and_wrench:":"\u{1F6E0}\uFE0F",":pick:":"\u26CF\uFE0F",":nut_and_bolt:":"\u{1F529}",":gear:":"\u2699\uFE0F",":bricks:":"\u{1F9F1}",":chains:":"\u26D3\uFE0F",":hook:":"\u{1FA9D}",":knot:":"\u{1FAA2}",":magnet:":"\u{1F9F2}",":gun:":"\u{1F52B}",":bomb:":"\u{1F4A3}",":firecracker:":"\u{1F9E8}",":axe:":"\u{1FA93}",":carpentry_saw:":"\u{1FA9A}",":knife:":"\u{1F52A}",":dagger:":"\u{1F5E1}\uFE0F",":dagger_knife:":"\u{1F5E1}\uFE0F",":crossed_swords:":"\u2694\uFE0F",":shield:":"\u{1F6E1}\uFE0F",":smoking:":"\u{1F6AC}",":coffin:":"\u26B0\uFE0F",":headstone:":"\u{1FAA6}",":urn:":"\u26B1\uFE0F",":funeral_urn:":"\u26B1\uFE0F",":amphora:":"\u{1F3FA}",":magic_wand:":"\u{1FA84}",":crystal_ball:":"\u{1F52E}",":prayer_beads:":"\u{1F4FF}",":nazar_amulet:":"\u{1F9FF}",":barber:":"\u{1F488}",":alembic:":"\u2697\uFE0F",":telescope:":"\u{1F52D}",":microscope:":"\u{1F52C}",":hole:":"\u{1F573}\uFE0F",":window:":"\u{1FA9F}",":adhesive_bandage:":"\u{1FA79}",":stethoscope:":"\u{1FA7A}",":pill:":"\u{1F48A}",":syringe:":"\u{1F489}",":drop_of_blood:":"\u{1FA78}",":dna:":"\u{1F9EC}",":microbe:":"\u{1F9A0}",":petri_dish:":"\u{1F9EB}",":test_tube:":"\u{1F9EA}",":thermometer:":"\u{1F321}\uFE0F",":mouse_trap:":"\u{1FAA4}",":broom:":"\u{1F9F9}",":basket:":"\u{1F9FA}",":sewing_needle:":"\u{1FAA1}",":roll_of_paper:":"\u{1F9FB}",":toilet:":"\u{1F6BD}",":plunger:":"\u{1FAA0}",":bucket:":"\u{1FAA3}",":potable_water:":"\u{1F6B0}",":shower:":"\u{1F6BF}",":bathtub:":"\u{1F6C1}",":bath:":"\u{1F6C0}",":bath_tone1:":"\u{1F6C0}\u{1F3FB}",":bath_tone2:":"\u{1F6C0}\u{1F3FC}",":bath_tone3:":"\u{1F6C0}\u{1F3FD}",":bath_tone4:":"\u{1F6C0}\u{1F3FE}",":bath_tone5:":"\u{1F6C0}\u{1F3FF}",":toothbrush:":"\u{1FAA5}",":soap:":"\u{1F9FC}",":razor:":"\u{1FA92}",":sponge:":"\u{1F9FD}",":squeeze_bottle:":"\u{1F9F4}",":bellhop:":"\u{1F6CE}\uFE0F",":bellhop_bell:":"\u{1F6CE}\uFE0F",":key:":"\u{1F511}",":key2:":"\u{1F5DD}\uFE0F",":old_key:":"\u{1F5DD}\uFE0F",":door:":"\u{1F6AA}",":chair:":"\u{1FA91}",":mirror:":"\u{1FA9E}",":couch:":"\u{1F6CB}\uFE0F",":couch_and_lamp:":"\u{1F6CB}\uFE0F",":bed:":"\u{1F6CF}\uFE0F",":sleeping_accommodation:":"\u{1F6CC}",":person_in_bed_tone1:":"\u{1F6CC}\u{1F3FB}",":person_in_bed_light_skin_tone:":"\u{1F6CC}\u{1F3FB}",":person_in_bed_tone2:":"\u{1F6CC}\u{1F3FC}",":person_in_bed_medium_light_skin_tone:":"\u{1F6CC}\u{1F3FC}",":person_in_bed_tone3:":"\u{1F6CC}\u{1F3FD}",":person_in_bed_medium_skin_tone:":"\u{1F6CC}\u{1F3FD}",":person_in_bed_tone4:":"\u{1F6CC}\u{1F3FE}",":person_in_bed_medium_dark_skin_tone:":"\u{1F6CC}\u{1F3FE}",":person_in_bed_tone5:":"\u{1F6CC}\u{1F3FF}",":person_in_bed_dark_skin_tone:":"\u{1F6CC}\u{1F3FF}",":teddy_bear:":"\u{1F9F8}",":frame_photo:":"\u{1F5BC}\uFE0F",":frame_with_picture:":"\u{1F5BC}\uFE0F",":shopping_bags:":"\u{1F6CD}\uFE0F",":shopping_cart:":"\u{1F6D2}",":shopping_trolley:":"\u{1F6D2}",":gift:":"\u{1F381}",":balloon:":"\u{1F388}",":flags:":"\u{1F38F}",":ribbon:":"\u{1F380}",":confetti_ball:":"\u{1F38A}",":tada:":"\u{1F389}",":pi\xF1ata:":"\u{1FA85}",":nesting_dolls:":"\u{1FA86}",":dolls:":"\u{1F38E}",":izakaya_lantern:":"\u{1F3EE}",":wind_chime:":"\u{1F390}",":red_envelope:":"\u{1F9E7}",":envelope:":"\u2709\uFE0F",":envelope_with_arrow:":"\u{1F4E9}",":incoming_envelope:":"\u{1F4E8}",":e_mail:":"\u{1F4E7}",":email:":"\u{1F4E7}",":love_letter:":"\u{1F48C}",":inbox_tray:":"\u{1F4E5}",":outbox_tray:":"\u{1F4E4}",":package:":"\u{1F4E6}",":label:":"\u{1F3F7}\uFE0F",":mailbox_closed:":"\u{1F4EA}",":mailbox:":"\u{1F4EB}",":mailbox_with_mail:":"\u{1F4EC}",":mailbox_with_no_mail:":"\u{1F4ED}",":postbox:":"\u{1F4EE}",":postal_horn:":"\u{1F4EF}",":placard:":"\u{1FAA7}",":scroll:":"\u{1F4DC}",":page_with_curl:":"\u{1F4C3}",":page_facing_up:":"\u{1F4C4}",":bookmark_tabs:":"\u{1F4D1}",":receipt:":"\u{1F9FE}",":bar_chart:":"\u{1F4CA}",":chart_with_upwards_trend:":"\u{1F4C8}",":chart_with_downwards_trend:":"\u{1F4C9}",":notepad_spiral:":"\u{1F5D2}\uFE0F",":spiral_note_pad:":"\u{1F5D2}\uFE0F",":calendar_spiral:":"\u{1F5D3}\uFE0F",":spiral_calendar_pad:":"\u{1F5D3}\uFE0F",":calendar:":"\u{1F4C6}",":date:":"\u{1F4C5}",":wastebasket:":"\u{1F5D1}\uFE0F",":card_index:":"\u{1F4C7}",":card_box:":"\u{1F5C3}\uFE0F",":card_file_box:":"\u{1F5C3}\uFE0F",":ballot_box:":"\u{1F5F3}\uFE0F",":ballot_box_with_ballot:":"\u{1F5F3}\uFE0F",":file_cabinet:":"\u{1F5C4}\uFE0F",":clipboard:":"\u{1F4CB}",":file_folder:":"\u{1F4C1}",":open_file_folder:":"\u{1F4C2}",":dividers:":"\u{1F5C2}\uFE0F",":card_index_dividers:":"\u{1F5C2}\uFE0F",":newspaper2:":"\u{1F5DE}\uFE0F",":rolled_up_newspaper:":"\u{1F5DE}\uFE0F",":newspaper:":"\u{1F4F0}",":notebook:":"\u{1F4D3}",":notebook_with_decorative_cover:":"\u{1F4D4}",":ledger:":"\u{1F4D2}",":closed_book:":"\u{1F4D5}",":green_book:":"\u{1F4D7}",":blue_book:":"\u{1F4D8}",":orange_book:":"\u{1F4D9}",":books:":"\u{1F4DA}",":book:":"\u{1F4D6}",":bookmark:":"\u{1F516}",":safety_pin:":"\u{1F9F7}",":link:":"\u{1F517}",":paperclip:":"\u{1F4CE}",":paperclips:":"\u{1F587}\uFE0F",":linked_paperclips:":"\u{1F587}\uFE0F",":triangular_ruler:":"\u{1F4D0}",":straight_ruler:":"\u{1F4CF}",":abacus:":"\u{1F9EE}",":pushpin:":"\u{1F4CC}",":round_pushpin:":"\u{1F4CD}",":scissors:":"\u2702\uFE0F",":pen_ballpoint:":"\u{1F58A}\uFE0F",":lower_left_ballpoint_pen:":"\u{1F58A}\uFE0F",":pen_fountain:":"\u{1F58B}\uFE0F",":lower_left_fountain_pen:":"\u{1F58B}\uFE0F",":black_nib:":"\u2712\uFE0F",":paintbrush:":"\u{1F58C}\uFE0F",":lower_left_paintbrush:":"\u{1F58C}\uFE0F",":crayon:":"\u{1F58D}\uFE0F",":lower_left_crayon:":"\u{1F58D}\uFE0F",":pencil:":"\u{1F4DD}",":memo:":"\u{1F4DD}",":pencil2:":"\u270F\uFE0F",":mag:":"\u{1F50D}",":mag_right:":"\u{1F50E}",":lock_with_ink_pen:":"\u{1F50F}",":closed_lock_with_key:":"\u{1F510}",":lock:":"\u{1F512}",":unlock:":"\u{1F513}",":100:":"\u{1F4AF}",":1234:":"\u{1F522}",":heart:":"\u2764\uFE0F",":orange_heart:":"\u{1F9E1}",":yellow_heart:":"\u{1F49B}",":green_heart:":"\u{1F49A}",":blue_heart:":"\u{1F499}",":purple_heart:":"\u{1F49C}",":black_heart:":"\u{1F5A4}",":brown_heart:":"\u{1F90E}",":white_heart:":"\u{1F90D}",":broken_heart:":"\u{1F494}",":heart_exclamation:":"\u2763\uFE0F",":heavy_heart_exclamation_mark_ornament:":"\u2763\uFE0F",":two_hearts:":"\u{1F495}",":revolving_hearts:":"\u{1F49E}",":heartbeat:":"\u{1F493}",":heartpulse:":"\u{1F497}",":sparkling_heart:":"\u{1F496}",":cupid:":"\u{1F498}",":gift_heart:":"\u{1F49D}",":heart_decoration:":"\u{1F49F}",":peace:":"\u262E\uFE0F",":peace_symbol:":"\u262E\uFE0F",":cross:":"\u271D\uFE0F",":latin_cross:":"\u271D\uFE0F",":star_and_crescent:":"\u262A\uFE0F",":om_symbol:":"\u{1F549}\uFE0F",":wheel_of_dharma:":"\u2638\uFE0F",":star_of_david:":"\u2721\uFE0F",":six_pointed_star:":"\u{1F52F}",":menorah:":"\u{1F54E}",":yin_yang:":"\u262F\uFE0F",":orthodox_cross:":"\u2626\uFE0F",":place_of_worship:":"\u{1F6D0}",":worship_symbol:":"\u{1F6D0}",":ophiuchus:":"\u26CE",":aries:":"\u2648",":taurus:":"\u2649",":gemini:":"\u264A",":cancer:":"\u264B",":leo:":"\u264C",":virgo:":"\u264D",":libra:":"\u264E",":scorpius:":"\u264F",":sagittarius:":"\u2650",":capricorn:":"\u2651",":aquarius:":"\u2652",":pisces:":"\u2653",":id:":"\u{1F194}",":atom:":"\u269B\uFE0F",":atom_symbol:":"\u269B\uFE0F",":accept:":"\u{1F251}",":radioactive:":"\u2622\uFE0F",":radioactive_sign:":"\u2622\uFE0F",":biohazard:":"\u2623\uFE0F",":biohazard_sign:":"\u2623\uFE0F",":mobile_phone_off:":"\u{1F4F4}",":vibration_mode:":"\u{1F4F3}",":u6709:":"\u{1F236}",":u7121:":"\u{1F21A}",":u7533:":"\u{1F238}",":u55b6:":"\u{1F23A}",":u6708:":"\u{1F237}\uFE0F",":eight_pointed_black_star:":"\u2734\uFE0F",":vs:":"\u{1F19A}",":white_flower:":"\u{1F4AE}",":ideograph_advantage:":"\u{1F250}",":secret:":"\u3299\uFE0F",":congratulations:":"\u3297\uFE0F",":u5408:":"\u{1F234}",":u6e80:":"\u{1F235}",":u5272:":"\u{1F239}",":u7981:":"\u{1F232}",":a:":"\u{1F170}\uFE0F",":b:":"\u{1F171}\uFE0F",":ab:":"\u{1F18E}",":cl:":"\u{1F191}",":o2:":"\u{1F17E}\uFE0F",":sos:":"\u{1F198}",":x:":"\u274C",":o:":"\u2B55",":octagonal_sign:":"\u{1F6D1}",":stop_sign:":"\u{1F6D1}",":no_entry:":"\u26D4",":name_badge:":"\u{1F4DB}",":no_entry_sign:":"\u{1F6AB}",":anger:":"\u{1F4A2}",":hotsprings:":"\u2668\uFE0F",":no_pedestrians:":"\u{1F6B7}",":do_not_litter:":"\u{1F6AF}",":no_bicycles:":"\u{1F6B3}",":non_potable_water:":"\u{1F6B1}",":underage:":"\u{1F51E}",":no_mobile_phones:":"\u{1F4F5}",":no_smoking:":"\u{1F6AD}",":exclamation:":"\u2757",":grey_exclamation:":"\u2755",":question:":"\u2753",":grey_question:":"\u2754",":bangbang:":"\u203C\uFE0F",":interrobang:":"\u2049\uFE0F",":low_brightness:":"\u{1F505}",":high_brightness:":"\u{1F506}",":part_alternation_mark:":"\u303D\uFE0F",":warning:":"\u26A0\uFE0F",":children_crossing:":"\u{1F6B8}",":trident:":"\u{1F531}",":fleur_de_lis:":"\u269C\uFE0F",":beginner:":"\u{1F530}",":recycle:":"\u267B\uFE0F",":white_check_mark:":"\u2705",":u6307:":"\u{1F22F}",":chart:":"\u{1F4B9}",":sparkle:":"\u2747\uFE0F",":eight_spoked_asterisk:":"\u2733\uFE0F",":negative_squared_cross_mark:":"\u274E",":globe_with_meridians:":"\u{1F310}",":diamond_shape_with_a_dot_inside:":"\u{1F4A0}",":m:":"\u24C2\uFE0F",":cyclone:":"\u{1F300}",":zzz:":"\u{1F4A4}",":atm:":"\u{1F3E7}",":wc:":"\u{1F6BE}",":wheelchair:":"\u267F",":parking:":"\u{1F17F}\uFE0F",":u7a7a:":"\u{1F233}",":sa:":"\u{1F202}\uFE0F",":passport_control:":"\u{1F6C2}",":customs:":"\u{1F6C3}",":baggage_claim:":"\u{1F6C4}",":left_luggage:":"\u{1F6C5}",":elevator:":"\u{1F6D7}",":mens:":"\u{1F6B9}",":womens:":"\u{1F6BA}",":baby_symbol:":"\u{1F6BC}",":restroom:":"\u{1F6BB}",":put_litter_in_its_place:":"\u{1F6AE}",":cinema:":"\u{1F3A6}",":signal_strength:":"\u{1F4F6}",":koko:":"\u{1F201}",":symbols:":"\u{1F523}",":information_source:":"\u2139\uFE0F",":abc:":"\u{1F524}",":abcd:":"\u{1F521}",":capital_abcd:":"\u{1F520}",":ng:":"\u{1F196}",":ok:":"\u{1F197}",":up:":"\u{1F199}",":cool:":"\u{1F192}",":new:":"\u{1F195}",":free:":"\u{1F193}",":zero:":"0\uFE0F\u20E3",":one:":"1\uFE0F\u20E3",":two:":"2\uFE0F\u20E3",":three:":"3\uFE0F\u20E3",":four:":"4\uFE0F\u20E3",":five:":"5\uFE0F\u20E3",":six:":"6\uFE0F\u20E3",":seven:":"7\uFE0F\u20E3",":eight:":"8\uFE0F\u20E3",":nine:":"9\uFE0F\u20E3",":keycap_ten:":"\u{1F51F}",":hash:":"#\uFE0F\u20E3",":asterisk:":"*\uFE0F\u20E3",":keycap_asterisk:":"*\uFE0F\u20E3",":eject:":"\u23CF\uFE0F",":eject_symbol:":"\u23CF\uFE0F",":arrow_forward:":"\u25B6\uFE0F",":pause_button:":"\u23F8\uFE0F",":double_vertical_bar:":"\u23F8\uFE0F",":play_pause:":"\u23EF\uFE0F",":stop_button:":"\u23F9\uFE0F",":record_button:":"\u23FA\uFE0F",":track_next:":"\u23ED\uFE0F",":next_track:":"\u23ED\uFE0F",":track_previous:":"\u23EE\uFE0F",":previous_track:":"\u23EE\uFE0F",":fast_forward:":"\u23E9",":rewind:":"\u23EA",":arrow_double_up:":"\u23EB",":arrow_double_down:":"\u23EC",":arrow_backward:":"\u25C0\uFE0F",":arrow_up_small:":"\u{1F53C}",":arrow_down_small:":"\u{1F53D}",":arrow_right:":"\u27A1\uFE0F",":arrow_left:":"\u2B05\uFE0F",":arrow_up:":"\u2B06\uFE0F",":arrow_down:":"\u2B07\uFE0F",":arrow_upper_right:":"\u2197\uFE0F",":arrow_lower_right:":"\u2198\uFE0F",":arrow_lower_left:":"\u2199\uFE0F",":arrow_upper_left:":"\u2196\uFE0F",":arrow_up_down:":"\u2195\uFE0F",":left_right_arrow:":"\u2194\uFE0F",":arrow_right_hook:":"\u21AA\uFE0F",":leftwards_arrow_with_hook:":"\u21A9\uFE0F",":arrow_heading_up:":"\u2934\uFE0F",":arrow_heading_down:":"\u2935\uFE0F",":twisted_rightwards_arrows:":"\u{1F500}",":repeat:":"\u{1F501}",":repeat_one:":"\u{1F502}",":arrows_counterclockwise:":"\u{1F504}",":arrows_clockwise:":"\u{1F503}",":musical_note:":"\u{1F3B5}",":notes:":"\u{1F3B6}",":heavy_plus_sign:":"\u2795",":heavy_minus_sign:":"\u2796",":heavy_division_sign:":"\u2797",":heavy_multiplication_x:":"\u2716\uFE0F",":infinity:":"\u267E\uFE0F",":heavy_dollar_sign:":"\u{1F4B2}",":currency_exchange:":"\u{1F4B1}",":tm:":"\u2122\uFE0F",":copyright:":"\xA9\uFE0F",":registered:":"\xAE\uFE0F",":wavy_dash:":"\u3030\uFE0F",":curly_loop:":"\u27B0",":loop:":"\u27BF",":end:":"\u{1F51A}",":back:":"\u{1F519}",":on:":"\u{1F51B}",":top:":"\u{1F51D}",":soon:":"\u{1F51C}",":heavy_check_mark:":"\u2714\uFE0F",":ballot_box_with_check:":"\u2611\uFE0F",":radio_button:":"\u{1F518}",":white_circle:":"\u26AA",":black_circle:":"\u26AB",":red_circle:":"\u{1F534}",":blue_circle:":"\u{1F535}",":brown_circle:":"\u{1F7E4}",":purple_circle:":"\u{1F7E3}",":green_circle:":"\u{1F7E2}",":yellow_circle:":"\u{1F7E1}",":orange_circle:":"\u{1F7E0}",":small_red_triangle:":"\u{1F53A}",":small_red_triangle_down:":"\u{1F53B}",":small_orange_diamond:":"\u{1F538}",":small_blue_diamond:":"\u{1F539}",":large_orange_diamond:":"\u{1F536}",":large_blue_diamond:":"\u{1F537}",":white_square_button:":"\u{1F533}",":black_square_button:":"\u{1F532}",":black_small_square:":"\u25AA\uFE0F",":white_small_square:":"\u25AB\uFE0F",":black_medium_small_square:":"\u25FE",":white_medium_small_square:":"\u25FD",":black_medium_square:":"\u25FC\uFE0F",":white_medium_square:":"\u25FB\uFE0F",":black_large_square:":"\u2B1B",":white_large_square:":"\u2B1C",":orange_square:":"\u{1F7E7}",":blue_square:":"\u{1F7E6}",":red_square:":"\u{1F7E5}",":brown_square:":"\u{1F7EB}",":purple_square:":"\u{1F7EA}",":green_square:":"\u{1F7E9}",":yellow_square:":"\u{1F7E8}",":speaker:":"\u{1F508}",":mute:":"\u{1F507}",":sound:":"\u{1F509}",":loud_sound:":"\u{1F50A}",":bell:":"\u{1F514}",":no_bell:":"\u{1F515}",":mega:":"\u{1F4E3}",":loudspeaker:":"\u{1F4E2}",":speech_left:":"\u{1F5E8}\uFE0F",":left_speech_bubble:":"\u{1F5E8}\uFE0F",":eye_in_speech_bubble:":"\u{1F441}\u200D\u{1F5E8}",":speech_balloon:":"\u{1F4AC}",":thought_balloon:":"\u{1F4AD}",":anger_right:":"\u{1F5EF}\uFE0F",":right_anger_bubble:":"\u{1F5EF}\uFE0F",":spades:":"\u2660\uFE0F",":clubs:":"\u2663\uFE0F",":hearts:":"\u2665\uFE0F",":diamonds:":"\u2666\uFE0F",":black_joker:":"\u{1F0CF}",":flower_playing_cards:":"\u{1F3B4}",":mahjong:":"\u{1F004}",":clock1:":"\u{1F550}",":clock2:":"\u{1F551}",":clock3:":"\u{1F552}",":clock4:":"\u{1F553}",":clock5:":"\u{1F554}",":clock6:":"\u{1F555}",":clock7:":"\u{1F556}",":clock8:":"\u{1F557}",":clock9:":"\u{1F558}",":clock10:":"\u{1F559}",":clock11:":"\u{1F55A}",":clock12:":"\u{1F55B}",":clock130:":"\u{1F55C}",":clock230:":"\u{1F55D}",":clock330:":"\u{1F55E}",":clock430:":"\u{1F55F}",":clock530:":"\u{1F560}",":clock630:":"\u{1F561}",":clock730:":"\u{1F562}",":clock830:":"\u{1F563}",":clock930:":"\u{1F564}",":clock1030:":"\u{1F565}",":clock1130:":"\u{1F566}",":clock1230:":"\u{1F567}",":female_sign:":"\u2640\uFE0F",":male_sign:":"\u2642\uFE0F",":transgender_symbol:":"\u26A7",":medical_symbol:":"\u2695\uFE0F",":regional_indicator_z:":"\u{1F1FF}",":regional_indicator_y:":"\u{1F1FE}",":regional_indicator_x:":"\u{1F1FD}",":regional_indicator_w:":"\u{1F1FC}",":regional_indicator_v:":"\u{1F1FB}",":regional_indicator_u:":"\u{1F1FA}",":regional_indicator_t:":"\u{1F1F9}",":regional_indicator_s:":"\u{1F1F8}",":regional_indicator_r:":"\u{1F1F7}",":regional_indicator_q:":"\u{1F1F6}",":regional_indicator_p:":"\u{1F1F5}",":regional_indicator_o:":"\u{1F1F4}",":regional_indicator_n:":"\u{1F1F3}",":regional_indicator_m:":"\u{1F1F2}",":regional_indicator_l:":"\u{1F1F1}",":regional_indicator_k:":"\u{1F1F0}",":regional_indicator_j:":"\u{1F1EF}",":regional_indicator_i:":"\u{1F1EE}",":regional_indicator_h:":"\u{1F1ED}",":regional_indicator_g:":"\u{1F1EC}",":regional_indicator_f:":"\u{1F1EB}",":regional_indicator_e:":"\u{1F1EA}",":regional_indicator_d:":"\u{1F1E9}",":regional_indicator_c:":"\u{1F1E8}",":regional_indicator_b:":"\u{1F1E7}",":regional_indicator_a:":"\u{1F1E6}",":flag_white:":"\u{1F3F3}\uFE0F",":flag_black:":"\u{1F3F4}",":checkered_flag:":"\u{1F3C1}",":triangular_flag_on_post:":"\u{1F6A9}",":rainbow_flag:":"\u{1F3F3}\uFE0F\u200D\u{1F308}",":gay_pride_flag:":"\u{1F3F3}\uFE0F\u200D\u{1F308}",":transgender_flag:":"\u{1F3F3}\uFE0F\u200D\u26A7\uFE0F",":pirate_flag:":"\u{1F3F4}\u200D\u2620\uFE0F",":flag_af:":"\u{1F1E6}\u{1F1EB}",":flag_ax:":"\u{1F1E6}\u{1F1FD}",":flag_al:":"\u{1F1E6}\u{1F1F1}",":flag_dz:":"\u{1F1E9}\u{1F1FF}",":flag_as:":"\u{1F1E6}\u{1F1F8}",":flag_ad:":"\u{1F1E6}\u{1F1E9}",":flag_ao:":"\u{1F1E6}\u{1F1F4}",":flag_ai:":"\u{1F1E6}\u{1F1EE}",":flag_aq:":"\u{1F1E6}\u{1F1F6}",":flag_ag:":"\u{1F1E6}\u{1F1EC}",":flag_ar:":"\u{1F1E6}\u{1F1F7}",":flag_am:":"\u{1F1E6}\u{1F1F2}",":flag_aw:":"\u{1F1E6}\u{1F1FC}",":flag_au:":"\u{1F1E6}\u{1F1FA}",":flag_at:":"\u{1F1E6}\u{1F1F9}",":flag_az:":"\u{1F1E6}\u{1F1FF}",":flag_bs:":"\u{1F1E7}\u{1F1F8}",":flag_bh:":"\u{1F1E7}\u{1F1ED}",":flag_bd:":"\u{1F1E7}\u{1F1E9}",":flag_bb:":"\u{1F1E7}\u{1F1E7}",":flag_by:":"\u{1F1E7}\u{1F1FE}",":flag_be:":"\u{1F1E7}\u{1F1EA}",":flag_bz:":"\u{1F1E7}\u{1F1FF}",":flag_bj:":"\u{1F1E7}\u{1F1EF}",":flag_bm:":"\u{1F1E7}\u{1F1F2}",":flag_bt:":"\u{1F1E7}\u{1F1F9}",":flag_bo:":"\u{1F1E7}\u{1F1F4}",":flag_ba:":"\u{1F1E7}\u{1F1E6}",":flag_bw:":"\u{1F1E7}\u{1F1FC}",":flag_br:":"\u{1F1E7}\u{1F1F7}",":flag_io:":"\u{1F1EE}\u{1F1F4}",":flag_vg:":"\u{1F1FB}\u{1F1EC}",":flag_bn:":"\u{1F1E7}\u{1F1F3}",":flag_bg:":"\u{1F1E7}\u{1F1EC}",":flag_bf:":"\u{1F1E7}\u{1F1EB}",":flag_bi:":"\u{1F1E7}\u{1F1EE}",":flag_kh:":"\u{1F1F0}\u{1F1ED}",":flag_cm:":"\u{1F1E8}\u{1F1F2}",":flag_ca:":"\u{1F1E8}\u{1F1E6}",":flag_ic:":"\u{1F1EE}\u{1F1E8}",":flag_cv:":"\u{1F1E8}\u{1F1FB}",":flag_bq:":"\u{1F1E7}\u{1F1F6}",":flag_ky:":"\u{1F1F0}\u{1F1FE}",":flag_cf:":"\u{1F1E8}\u{1F1EB}",":flag_td:":"\u{1F1F9}\u{1F1E9}",":flag_cl:":"\u{1F1E8}\u{1F1F1}",":flag_cn:":"\u{1F1E8}\u{1F1F3}",":flag_cx:":"\u{1F1E8}\u{1F1FD}",":flag_cc:":"\u{1F1E8}\u{1F1E8}",":flag_co:":"\u{1F1E8}\u{1F1F4}",":flag_km:":"\u{1F1F0}\u{1F1F2}",":flag_cg:":"\u{1F1E8}\u{1F1EC}",":flag_cd:":"\u{1F1E8}\u{1F1E9}",":flag_ck:":"\u{1F1E8}\u{1F1F0}",":flag_cr:":"\u{1F1E8}\u{1F1F7}",":flag_ci:":"\u{1F1E8}\u{1F1EE}",":flag_hr:":"\u{1F1ED}\u{1F1F7}",":flag_cu:":"\u{1F1E8}\u{1F1FA}",":flag_cw:":"\u{1F1E8}\u{1F1FC}",":flag_cy:":"\u{1F1E8}\u{1F1FE}",":flag_cz:":"\u{1F1E8}\u{1F1FF}",":flag_dk:":"\u{1F1E9}\u{1F1F0}",":flag_dj:":"\u{1F1E9}\u{1F1EF}",":flag_dm:":"\u{1F1E9}\u{1F1F2}",":flag_do:":"\u{1F1E9}\u{1F1F4}",":flag_ec:":"\u{1F1EA}\u{1F1E8}",":flag_eg:":"\u{1F1EA}\u{1F1EC}",":flag_sv:":"\u{1F1F8}\u{1F1FB}",":flag_gq:":"\u{1F1EC}\u{1F1F6}",":flag_er:":"\u{1F1EA}\u{1F1F7}",":flag_ee:":"\u{1F1EA}\u{1F1EA}",":flag_et:":"\u{1F1EA}\u{1F1F9}",":flag_eu:":"\u{1F1EA}\u{1F1FA}",":flag_fk:":"\u{1F1EB}\u{1F1F0}",":flag_fo:":"\u{1F1EB}\u{1F1F4}",":flag_fj:":"\u{1F1EB}\u{1F1EF}",":flag_fi:":"\u{1F1EB}\u{1F1EE}",":flag_fr:":"\u{1F1EB}\u{1F1F7}",":flag_gf:":"\u{1F1EC}\u{1F1EB}",":flag_pf:":"\u{1F1F5}\u{1F1EB}",":flag_tf:":"\u{1F1F9}\u{1F1EB}",":flag_ga:":"\u{1F1EC}\u{1F1E6}",":flag_gm:":"\u{1F1EC}\u{1F1F2}",":flag_ge:":"\u{1F1EC}\u{1F1EA}",":flag_de:":"\u{1F1E9}\u{1F1EA}",":flag_gh:":"\u{1F1EC}\u{1F1ED}",":flag_gi:":"\u{1F1EC}\u{1F1EE}",":flag_gr:":"\u{1F1EC}\u{1F1F7}",":flag_gl:":"\u{1F1EC}\u{1F1F1}",":flag_gd:":"\u{1F1EC}\u{1F1E9}",":flag_gp:":"\u{1F1EC}\u{1F1F5}",":flag_gu:":"\u{1F1EC}\u{1F1FA}",":flag_gt:":"\u{1F1EC}\u{1F1F9}",":flag_gg:":"\u{1F1EC}\u{1F1EC}",":flag_gn:":"\u{1F1EC}\u{1F1F3}",":flag_gw:":"\u{1F1EC}\u{1F1FC}",":flag_gy:":"\u{1F1EC}\u{1F1FE}",":flag_ht:":"\u{1F1ED}\u{1F1F9}",":flag_hn:":"\u{1F1ED}\u{1F1F3}",":flag_hk:":"\u{1F1ED}\u{1F1F0}",":flag_hu:":"\u{1F1ED}\u{1F1FA}",":flag_is:":"\u{1F1EE}\u{1F1F8}",":flag_in:":"\u{1F1EE}\u{1F1F3}",":flag_id:":"\u{1F1EE}\u{1F1E9}",":flag_ir:":"\u{1F1EE}\u{1F1F7}",":flag_iq:":"\u{1F1EE}\u{1F1F6}",":flag_ie:":"\u{1F1EE}\u{1F1EA}",":flag_im:":"\u{1F1EE}\u{1F1F2}",":flag_il:":"\u{1F1EE}\u{1F1F1}",":flag_it:":"\u{1F1EE}\u{1F1F9}",":flag_jm:":"\u{1F1EF}\u{1F1F2}",":flag_jp:":"\u{1F1EF}\u{1F1F5}",":crossed_flags:":"\u{1F38C}",":flag_je:":"\u{1F1EF}\u{1F1EA}",":flag_jo:":"\u{1F1EF}\u{1F1F4}",":flag_kz:":"\u{1F1F0}\u{1F1FF}",":flag_ke:":"\u{1F1F0}\u{1F1EA}",":flag_ki:":"\u{1F1F0}\u{1F1EE}",":flag_xk:":"\u{1F1FD}\u{1F1F0}",":flag_kw:":"\u{1F1F0}\u{1F1FC}",":flag_kg:":"\u{1F1F0}\u{1F1EC}",":flag_la:":"\u{1F1F1}\u{1F1E6}",":flag_lv:":"\u{1F1F1}\u{1F1FB}",":flag_lb:":"\u{1F1F1}\u{1F1E7}",":flag_ls:":"\u{1F1F1}\u{1F1F8}",":flag_lr:":"\u{1F1F1}\u{1F1F7}",":flag_ly:":"\u{1F1F1}\u{1F1FE}",":flag_li:":"\u{1F1F1}\u{1F1EE}",":flag_lt:":"\u{1F1F1}\u{1F1F9}",":flag_lu:":"\u{1F1F1}\u{1F1FA}",":flag_mo:":"\u{1F1F2}\u{1F1F4}",":flag_mk:":"\u{1F1F2}\u{1F1F0}",":flag_mg:":"\u{1F1F2}\u{1F1EC}",":flag_mw:":"\u{1F1F2}\u{1F1FC}",":flag_my:":"\u{1F1F2}\u{1F1FE}",":flag_mv:":"\u{1F1F2}\u{1F1FB}",":flag_ml:":"\u{1F1F2}\u{1F1F1}",":flag_mt:":"\u{1F1F2}\u{1F1F9}",":flag_mh:":"\u{1F1F2}\u{1F1ED}",":flag_mq:":"\u{1F1F2}\u{1F1F6}",":flag_mr:":"\u{1F1F2}\u{1F1F7}",":flag_mu:":"\u{1F1F2}\u{1F1FA}",":flag_yt:":"\u{1F1FE}\u{1F1F9}",":flag_mx:":"\u{1F1F2}\u{1F1FD}",":flag_fm:":"\u{1F1EB}\u{1F1F2}",":flag_md:":"\u{1F1F2}\u{1F1E9}",":flag_mc:":"\u{1F1F2}\u{1F1E8}",":flag_mn:":"\u{1F1F2}\u{1F1F3}",":flag_me:":"\u{1F1F2}\u{1F1EA}",":flag_ms:":"\u{1F1F2}\u{1F1F8}",":flag_ma:":"\u{1F1F2}\u{1F1E6}",":flag_mz:":"\u{1F1F2}\u{1F1FF}",":flag_mm:":"\u{1F1F2}\u{1F1F2}",":flag_na:":"\u{1F1F3}\u{1F1E6}",":flag_nr:":"\u{1F1F3}\u{1F1F7}",":flag_np:":"\u{1F1F3}\u{1F1F5}",":flag_nl:":"\u{1F1F3}\u{1F1F1}",":flag_nc:":"\u{1F1F3}\u{1F1E8}",":flag_nz:":"\u{1F1F3}\u{1F1FF}",":flag_ni:":"\u{1F1F3}\u{1F1EE}",":flag_ne:":"\u{1F1F3}\u{1F1EA}",":flag_ng:":"\u{1F1F3}\u{1F1EC}",":flag_nu:":"\u{1F1F3}\u{1F1FA}",":flag_nf:":"\u{1F1F3}\u{1F1EB}",":flag_kp:":"\u{1F1F0}\u{1F1F5}",":flag_mp:":"\u{1F1F2}\u{1F1F5}",":flag_no:":"\u{1F1F3}\u{1F1F4}",":flag_om:":"\u{1F1F4}\u{1F1F2}",":flag_pk:":"\u{1F1F5}\u{1F1F0}",":flag_pw:":"\u{1F1F5}\u{1F1FC}",":flag_ps:":"\u{1F1F5}\u{1F1F8}",":flag_pa:":"\u{1F1F5}\u{1F1E6}",":flag_pg:":"\u{1F1F5}\u{1F1EC}",":flag_py:":"\u{1F1F5}\u{1F1FE}",":flag_pe:":"\u{1F1F5}\u{1F1EA}",":flag_ph:":"\u{1F1F5}\u{1F1ED}",":flag_pn:":"\u{1F1F5}\u{1F1F3}",":flag_pl:":"\u{1F1F5}\u{1F1F1}",":flag_pt:":"\u{1F1F5}\u{1F1F9}",":flag_pr:":"\u{1F1F5}\u{1F1F7}",":flag_qa:":"\u{1F1F6}\u{1F1E6}",":flag_re:":"\u{1F1F7}\u{1F1EA}",":flag_ro:":"\u{1F1F7}\u{1F1F4}",":flag_ru:":"\u{1F1F7}\u{1F1FA}",":flag_rw:":"\u{1F1F7}\u{1F1FC}",":flag_ws:":"\u{1F1FC}\u{1F1F8}",":flag_sm:":"\u{1F1F8}\u{1F1F2}",":flag_st:":"\u{1F1F8}\u{1F1F9}",":flag_sa:":"\u{1F1F8}\u{1F1E6}",":flag_sn:":"\u{1F1F8}\u{1F1F3}",":flag_rs:":"\u{1F1F7}\u{1F1F8}",":flag_sc:":"\u{1F1F8}\u{1F1E8}",":flag_sl:":"\u{1F1F8}\u{1F1F1}",":flag_sg:":"\u{1F1F8}\u{1F1EC}",":flag_sx:":"\u{1F1F8}\u{1F1FD}",":flag_sk:":"\u{1F1F8}\u{1F1F0}",":flag_si:":"\u{1F1F8}\u{1F1EE}",":flag_gs:":"\u{1F1EC}\u{1F1F8}",":flag_sb:":"\u{1F1F8}\u{1F1E7}",":flag_so:":"\u{1F1F8}\u{1F1F4}",":flag_za:":"\u{1F1FF}\u{1F1E6}",":flag_kr:":"\u{1F1F0}\u{1F1F7}",":flag_ss:":"\u{1F1F8}\u{1F1F8}",":flag_es:":"\u{1F1EA}\u{1F1F8}",":flag_lk:":"\u{1F1F1}\u{1F1F0}",":flag_bl:":"\u{1F1E7}\u{1F1F1}",":flag_sh:":"\u{1F1F8}\u{1F1ED}",":flag_kn:":"\u{1F1F0}\u{1F1F3}",":flag_lc:":"\u{1F1F1}\u{1F1E8}",":flag_pm:":"\u{1F1F5}\u{1F1F2}",":flag_vc:":"\u{1F1FB}\u{1F1E8}",":flag_sd:":"\u{1F1F8}\u{1F1E9}",":flag_sr:":"\u{1F1F8}\u{1F1F7}",":flag_sz:":"\u{1F1F8}\u{1F1FF}",":flag_se:":"\u{1F1F8}\u{1F1EA}",":flag_ch:":"\u{1F1E8}\u{1F1ED}",":flag_sy:":"\u{1F1F8}\u{1F1FE}",":flag_tw:":"\u{1F1F9}\u{1F1FC}",":flag_tj:":"\u{1F1F9}\u{1F1EF}",":flag_tz:":"\u{1F1F9}\u{1F1FF}",":flag_th:":"\u{1F1F9}\u{1F1ED}",":flag_tl:":"\u{1F1F9}\u{1F1F1}",":flag_tg:":"\u{1F1F9}\u{1F1EC}",":flag_tk:":"\u{1F1F9}\u{1F1F0}",":flag_to:":"\u{1F1F9}\u{1F1F4}",":flag_tt:":"\u{1F1F9}\u{1F1F9}",":flag_tn:":"\u{1F1F9}\u{1F1F3}",":flag_tr:":"\u{1F1F9}\u{1F1F7}",":flag_tm:":"\u{1F1F9}\u{1F1F2}",":flag_tc:":"\u{1F1F9}\u{1F1E8}",":flag_vi:":"\u{1F1FB}\u{1F1EE}",":flag_tv:":"\u{1F1F9}\u{1F1FB}",":flag_ug:":"\u{1F1FA}\u{1F1EC}",":flag_ua:":"\u{1F1FA}\u{1F1E6}",":flag_ae:":"\u{1F1E6}\u{1F1EA}",":flag_gb:":"\u{1F1EC}\u{1F1E7}",":england:":"\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}",":scotland:":"\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}",":wales:":"\u{1F3F4}\u{E0067}\u{E0062}\u{E0077}\u{E006C}\u{E0073}\u{E007F}",":flag_us:":"\u{1F1FA}\u{1F1F8}",":flag_uy:":"\u{1F1FA}\u{1F1FE}",":flag_uz:":"\u{1F1FA}\u{1F1FF}",":flag_vu:":"\u{1F1FB}\u{1F1FA}",":flag_va:":"\u{1F1FB}\u{1F1E6}",":flag_ve:":"\u{1F1FB}\u{1F1EA}",":flag_vn:":"\u{1F1FB}\u{1F1F3}",":flag_wf:":"\u{1F1FC}\u{1F1EB}",":flag_eh:":"\u{1F1EA}\u{1F1ED}",":flag_ye:":"\u{1F1FE}\u{1F1EA}",":flag_zm:":"\u{1F1FF}\u{1F1F2}",":flag_zw:":"\u{1F1FF}\u{1F1FC}",":flag_ac:":"\u{1F1E6}\u{1F1E8}",":flag_bv:":"\u{1F1E7}\u{1F1FB}",":flag_cp:":"\u{1F1E8}\u{1F1F5}",":flag_ea:":"\u{1F1EA}\u{1F1E6}",":flag_dg:":"\u{1F1E9}\u{1F1EC}",":flag_hm:":"\u{1F1ED}\u{1F1F2}",":flag_mf:":"\u{1F1F2}\u{1F1EB}",":flag_sj:":"\u{1F1F8}\u{1F1EF}",":flag_ta:":"\u{1F1F9}\u{1F1E6}",":flag_um:":"\u{1F1FA}\u{1F1F2}",":united_nations:":"\u{1F1FA}\u{1F1F3}"};
                var pe=async o=>{let e=o.contentDocument.querySelector('[data-hook="input"]'),P=await window.electronAPI.getAppPreferences(),_=(Array.isArray(P.shortcuts)?P.shortcuts:[]),n=new Map(_),t=/:[a-zA-Z0-9_]+:/g;e.addEventListener("keyup",()=>{let c=e.value;n.has(c)&&(c=n.get(c)),c=c.replace(t,d=>ie[d]||d),e.value=c})},
                N=async()=>{let o=document.getElementsByClassName("gameframe")[0];if(!o?.contentDocument){new Error("Gameframe or contentDocument not found");return}if((await window.electronAPI.getAppPreferences()).transp_ui){o.contentDocument.getElementsByClassName("game-view")[0].style.cssText="--chat-opacity: 0.063;",o.contentDocument.querySelector(".chatbox-view-contents>.input input[type=text]").style.backgroundColor="rgba(26, 33, 37, 0.063)",o.contentDocument.getElementsByClassName("bar")[0].style.background="rgba(26, 33, 37, 0.063)",o.contentDocument.querySelectorAll(".game-view > .buttons")[0].style.background="rgba(26, 33, 37, 0.063)",o.contentDocument.querySelectorAll(".game-view > .buttons")[0].childNodes.forEach(n=>n.style.background="rgba(26, 33, 37, 0.063)"),o.contentDocument.getElementsByClassName("sound-button-container")[0].childNodes.forEach(n=>n.style.background="rgba(26, 33, 37, 0.063)"),o.contentDocument.querySelectorAll(".dialog button, .room-view>.container button").forEach(n=>n.style.background="rgba(26, 33, 37, 0.063)"),o.contentDocument.querySelectorAll(".top-section  > .room-view > .container > .teams > .player-list-view").forEach(n=>n.childNodes[1].style.background="rgba(26, 33, 37, 0.063)"),o.contentDocument.querySelectorAll(".dialog select, .room-view>.container select").forEach(n=>{n.style.background="rgba(26, 33, 37, 0.063)",n.style.border="0px"});
                if ((await window.electronAPI.getAppPreferences()).transp_ui) {
                  // ... (Glass UI stilleriniz)
                  window.hxsSuspendThemeForGlass?.();     // << Glass iken tema CSS'lerini kaldır
                } else {
                  // ... (Default UI stilleriniz)
                  const saved = localStorage.getItem("hxs_theme");
                  (window.hxsApplyTheme || applyTheme)?.(saved || "gray"); // Kayıt yoksa HaxScipt uygula
                }
                let _=o.contentDocument.getElementsByClassName("container")[0];_.style.background="rgba(26, 33, 37, 0.1)",_.style.border="1px solid rgba(255, 255, 255, 0.25)",_.style.borderRadius="8px",_.style.boxShadow=`
            inset 0 0 2px rgba(255, 255, 255, 0.35),  /* stronger inner glow */
            0 0 0 1px rgba(255, 255, 255, 0.1),       /* crisper outer outline */
            0 0 6px rgba(255, 255, 255, 0.08)         /* subtle surrounding shimmer */
        `}else{let _=parseFloat(localStorage.getItem("chat_opacity")||"0.8");o.contentDocument.getElementsByClassName("game-view")[0].style.cssText=`--chat-opacity: ${_}`,o.contentDocument.querySelector(".chatbox-view-contents>.input input[type=text]").style.backgroundColor="#111619",o.contentDocument.getElementsByClassName("bar")[0].style.background="",o.contentDocument.querySelectorAll(".game-view > .buttons")[0].style.background="",o.contentDocument.querySelectorAll(".game-view > .buttons")[0].childNodes.forEach(t=>t.style.background=""),o.contentDocument.getElementsByClassName("sound-button-container")[0].childNodes.forEach(t=>t.style.background=""),o.contentDocument.querySelectorAll(".dialog button, .room-view>.container button").forEach(t=>t.style.background=""),o.contentDocument.querySelectorAll(".top-section  > .room-view > .container > .teams > .player-list-view").forEach(t=>t.childNodes[1].style.background=""),o.contentDocument.querySelectorAll(".dialog select, .room-view>.container select").forEach(t=>{t.style.background="",t.style.border="1px solid #111619"});
        let n=o.contentDocument.getElementsByClassName("container")[0];n.style.background="",n.style.border="",n.style.borderRadius="",n.style.boxShadow="",n.style.filter=""}},we=o=>{o.contentDocument.querySelector(".chatbox-view-contents>.input input[type=text]").placeholder="",o.contentDocument.getElementById("toggleChat").childNodes[0].remove()},F=async()=>{let o=document.getElementsByClassName("gameframe")[0];if(!o?.contentDocument){new Error("Gameframe or contentDocument not found");return}const doc=o.contentDocument;const escOpen=(()=>{try{const b=doc.body;return b?.classList?.contains('showing-room-view')||!!doc.querySelector('.room-view');}catch(_){return false}})();if(!escOpen){try{doc.getElementById("invisui-btn")?.remove()}catch(_){ }try{doc.getElementById("hxs-invisui-holder")?.remove()}catch(_){ }try{doc.getElementById("hxs-invisui-holder-fixed")?.remove()}catch(_){ }return}const isActiveGame=(()=>{try{const b=doc.body;return b?.classList?.contains('game-view') && !b.classList?.contains('showing-room-view');}catch(_){return false}})();const ORDER=isActiveGame?[".game-view > .buttons",".bar .buttons",".header-btns",".header .buttons",".splitter .buttons"]:[".header-btns",".header .buttons",".bar .buttons",".splitter .buttons",".game-view > .buttons"];const WAIT_SEL=ORDER.join(", ");const overlayOpen=((doc.body?.classList?.contains('showing-room-view'))||!!doc.querySelector('.room-view'));let i=null;if(!overlayOpen){await B(WAIT_SEL);for(const s of ORDER){ i=doc.querySelector(s); if(i) break; }}
        if(!i){
          const OVERLAY_ROOTS=[".room-view > .container",".room-view",".dialog"];
          for(const s of OVERLAY_ROOTS){
            const r=doc.querySelector(s);
            if(r){
              let holder=r.querySelector('#hxs-invisui-holder');
              if(!holder){
                holder=doc.createElement('div'); holder.id='hxs-invisui-holder';
                Object.assign(holder.style,{ position:'absolute', top:'8px', right:'8px', zIndex:'99999' });
                try{ const cs=getComputedStyle(r); if(cs.position==='static'){ holder.style.position='fixed'; } }catch(_){ holder.style.position='fixed'; }
                r.appendChild(holder);
              }
              i=holder; break;
            }
          }
        }
        if(!i){ let holder=doc.getElementById('hxs-invisui-holder-fixed'); if(!holder){ holder=doc.createElement('div'); holder.id='hxs-invisui-holder-fixed'; Object.assign(holder.style,{ position:'fixed', top:'8px', right:'8px', zIndex:'99999' }); (doc.body||doc.documentElement).appendChild(holder); } i=holder; }
        // Try to find REC button in overlay
        const overlayRoot = doc.querySelector('.room-view > .container') || doc.querySelector('.room-view') || doc.querySelector('.dialog') || doc;
        const recSel = "button[title*='rec' i], a[title*='rec' i], button[aria-label*='rec' i], a[aria-label*='rec' i], .record, .rec, [data-hook*='rec' i], [data-hook*='record' i]";
        let recBtn = null;
        try{
          recBtn = overlayRoot.querySelector(recSel) || null;
          if(!recBtn){ const cand = Array.from(overlayRoot.querySelectorAll('button, a')).find(el => /\brec\b/i.test((el.textContent||'').trim())); recBtn = cand || null; }
        }catch(_){ }
        { const existing = doc.getElementById("invisui-btn"); if(existing){ try{ if(recBtn && recBtn.parentElement){ recBtn.parentElement.insertBefore(existing, recBtn.nextSibling); } else { i.insertBefore(existing, i.firstChild||null); } }catch(_){ } return; } }
        let n=(await window.electronAPI.getAppPreferences()).transp_ui,t=document.createElement("button");t.id="invisui-btn",t.className="button",t.innerHTML=n?"Normal Mod":"Şeffaf Mod",t.style.background=n?"rgba(26, 33, 37, 0.063)":"",
        t.addEventListener("click", async()=>{
        let r = !(await window.electronAPI.getAppPreferences()).transp_ui;
        t.innerHTML = r ? "Normal Mod" : "Şeffaf Mod";
        await window.electronAPI.setAppPreference("transp_ui", r);
        N();

        // === Tema senkronu: anında uygula ===
        if (r) { // Glass aktif oldu
          window.hxsSuspendThemeForGlass?.();
          // Oda içi kontrol barını kapat (glass'ta varsayılan görünsün)
          try{ window.hxsControlsBarDisable?.(); }catch(_){ }
        } else {
          const saved = localStorage.getItem("hxs_theme");
          (window.hxsApplyTheme || applyTheme)?.(saved || "gray");
          // Default UI: siyah kontrol barını etkinleştir
          try{ window.hxsControlsBarEnable?.(); }catch(_){ }
        }
      }, false);
        // Başlangıç durumu: Default UI ise siyah kontrol barını aç
        try{ if(!n) window.hxsControlsBarEnable?.(); else window.hxsControlsBarDisable?.(); }catch(_){ }

        try{ if(recBtn && recBtn.parentElement){ recBtn.parentElement.insertBefore(t, recBtn.nextSibling); } else { i.insertBefore(t, i.firstChild||null); } }catch(_){ }
        try{ if(!doc.__hxsInvisObs){ let busy=false; const obs=new MutationObserver(()=>{ try{ const open=(doc.body?.classList?.contains('showing-room-view')||!!doc.querySelector('.room-view')); const exists=!!doc.getElementById('invisui-btn'); if(open && !exists){ if(busy) return; busy=true; F().finally(()=>busy=false); } if(!open && exists){ doc.getElementById('invisui-btn')?.remove(); doc.getElementById('hxs-invisui-holder')?.remove(); } }catch(_){ } }); if(doc.body) obs.observe(doc.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']}); doc.__hxsInvisObs=obs; } }catch(_){ }
        },ae=async()=>{let o=document.getElementsByClassName("gameframe")[0];if(!o?.contentDocument){new Error("Gameframe or contentDocument not found");return}pe(o),we(o),await F(),await N()};

        // === HaxScipt Tema Sistemi (buton + panel + anında uygulama) ===
        (function hxsThemeSystem(){
        const STORAGE_KEY = "hxs_theme";

        // 1) Tema seti
        const THEMES = [
            { id:"gray",  name:"HaxScipt (Varsayılan)",    primary:"#C8A104", hover:"#1C1C1E", accent:"#967903" },
            { id:"blue",  name:"Mavi",   primary:"#2563eb", hover:"#1d4ed8", accent:"#38bdf8" },
            { id:"red",   name:"Kırmızı",primary:"#b2413b", hover:"#cc4c44", accent:"#f87171" },
            { id:"green", name:"Yeşil",  primary:"#22c55e", hover:"#16a34a", accent:"#86efac" },
            { id:"purple",name:"Mor",    primary:"#7c3aed", hover:"#6d28d9", accent:"#c084fc" },
            { id:"gold",  name:"Altın",  primary:"#d97706", hover:"#b45309", accent:"#fbbf24" },
        ];
        const DEFAULT_BG  = "#1b2125";
        const DEFAULT_BR  = "rgba(255,255,255,.12)";
        const TEXT_SUBTLE = "#94a3b8";

        const getTheme = (id)=> THEMES.find(t=>t.id===id) || THEMES[0];

        // 2) Dış (ana pencere) stilini kur
        function applyRootStyle(theme){
          // HaxScipt özel: renkleri doğrudan kullan, ton/satürasyon türetme
          const isHaxscipt = theme?.id === "gray";
          const pal = isHaxscipt ? {
            primary: theme.primary,
            hover: theme.accent || theme.hover,   // buton hover için accent
            panelBg: theme.hover,                 // panel/pencere arka planı
            surface: theme.hover,                 // ek yüzeyler: aynısı (türetme yok)
            surface2: theme.hover,                // ek yüzeyler: aynısı (türetme yok)
            border: DEFAULT_BR,
            text:   "#ffffff",
            subtle: TEXT_SUBTLE,
            accent: theme.accent || theme.primary
          } : ( () => { const p=_derivePalette(theme.primary); return { ...p, accent: theme.accent || p.hover }; } )();
          let st = document.getElementById("hxs-theme-root");
          if(!st){ st=document.createElement("style"); st.id="hxs-theme-root"; document.head.appendChild(st); }
          st.textContent = `
            :root{
              --hxs-primary:${pal.primary};
              --hxs-primary-hover:${pal.hover};
              --hxs-panel-bg:${pal.panelBg};
              --hxs-surface:${pal.surface};
              --hxs-surface-2:${pal.surface2};
              --hxs-panel-border:${pal.border};
              --hxs-text:${pal.text};
              --hxs-subtle:${pal.subtle};
              --hxs-accent:${pal.accent};
              --hxs-controlbar-bg:${isHaxscipt ? (theme.hover) : pal.hover};
            }

            /* Header'daki linkler (tema uygulanmasın dediğimiz 3 link hariç) */
            .header .left-container .title a:not(.hxs-no-theme),
            .header .right-container .title a:not(.hxs-no-theme){
              box-shadow: inset 0 0 0 1px var(--hxs-accent, var(--hxs-primary)) !important;
              border-radius:6px; padding:2px 8px; color:#fff;
            }
            .header .left-container .title a:not(.hxs-no-theme):hover,
            .header .right-container .title a:not(.hxs-no-theme):hover{
              box-shadow: inset 0 0 0 2px var(--hxs-accent, var(--hxs-primary)) !important;
            }

            /* --- Uygulamanın panelleri/kartları/butonları --- */
            /* Dialoglar */
            dialog#custom-alert{ background:var(--hxs-panel-bg) !important; color:var(--hxs-text); }
            #custom-alert hr{ border-top:3px solid var(--hxs-primary) !important; }
            #custom-alert-buttons button{ background:var(--hxs-primary) !important; }
            #custom-alert-buttons button:hover{ background:var(--hxs-primary-hover) !important; }
            #custom-alert-buttons .hxs-danger{ background:#b2413b !important; }
            #custom-alert-buttons .hxs-danger:hover{ background:#D04D46 !important; }

            #custom-modal{ background:var(--hxs-panel-bg) !important; color:var(--hxs-text); }
            .profile-card{ border:1px solid var(--hxs-panel-border) !important; background:var(--hxs-surface) !important; }
            .profile-card button{ background:var(--hxs-primary) !important; }
            .profile-card button:hover{ background:var(--hxs-primary-hover) !important; }
            .label-input{ background:var(--hxs-surface-2) !important; }
            .label-input input{ background:#1b2125 !important; color:#fff !important; }

            /* HaxScipt Odaları kartları */
            .hxs-room{ background:var(--hxs-surface) !important; border:1px solid var(--hxs-panel-border) !important; }
            .hxs-join{ background:var(--hxs-primary) !important; }
            .hxs-join:hover{ background:var(--hxs-primary-hover) !important; }
            .hxs-refresh{ border-color:var(--hxs-panel-border) !important; }

            /* Ayarlar sayfası bölümleri */
            hr{ border-top:1px solid var(--hxs-panel-border) !important; }
            #shortcut-list-body > div{ background:var(--hxs-surface) !important; border:1px solid var(--hxs-panel-border) !important; border-radius:8px; padding:6px; }
          `;
        }

        // 3) iFrame (oyun içi) stilini kur
        function applyIframeStyle(theme){
          const isHaxscipt = theme?.id === "gray";
          const pal = isHaxscipt ? {
            primary: theme.primary,
            hover: theme.accent || theme.hover,   // buton hover için accent
            panelBg: theme.hover,                 // panel/pencere arka planı
            surface: theme.hover,                 // ek yüzeyler: aynısı (türetme yok)
            surface2: theme.hover,                // ek yüzeyler: aynısı (türetme yok)
            border: DEFAULT_BR,
            text:   "#ffffff",
            subtle: TEXT_SUBTLE,
            accent: theme.accent || theme.primary
          } : ( () => { const p=_derivePalette(theme.primary); return { ...p, accent: theme.accent || p.hover }; } )();
          const frame = document.getElementsByClassName("gameframe")[0];
          const doc = frame?.contentDocument;
          if(!doc) return;

          let st = doc.getElementById("hxs-theme-iframe");
          if(!st){ st = doc.createElement("style"); st.id="hxs-theme-iframe"; doc.head.appendChild(st); }

          st.textContent = `
            :root{
              --hxs-primary:${pal.primary};
              --hxs-primary-hover:${pal.hover};
              --hxs-panel-bg:${pal.panelBg};
              --hxs-surface:${pal.surface};
              --hxs-panel-border:${pal.border};
              --hxs-text:${pal.text};
              --hxs-subtle:${pal.subtle};
              --hxs-accent:${pal.accent};
              --hxs-controlbar-bg:${isHaxscipt ? theme.hover : pal.hover};
            }

            /* --- HAXBALL (Default UI iken) --- */
            /* Ana container ve dialoglar: koyu panel */
            .dialog, .room-view > .container{
              background: var(--hxs-panel-bg) !important;
              color: var(--hxs-text) !important;
              border-color: var(--hxs-panel-border) !important;
            }

            /* Takım listeleri / kart görünümleri: orta yüzey */
            .top-section  > .room-view > .container > .teams > .player-list-view,
            .roomlist-view .list,
            .room-view .teams .player-list-view{
              background: var(--hxs-surface) !important;
              border-color: var(--hxs-panel-border) !important;
            }

            /* Oda listesi butonları (Replay, Select Country vb.) temaya uyumlu olsun */
            .roomlist-view .button,
            .roomlist-view button,
            .roomlist-view a.button{
              background: var(--hxs-primary) !important;
              color:#fff !important;
              border: 1px solid var(--hxs-panel-border) !important;
              border-radius: 6px !important;
              box-shadow: none !important;
              background-image: none !important;
            }
            .roomlist-view .button:hover,
            .roomlist-view button:hover,
            .roomlist-view a.button:hover{
              background: var(--hxs-primary-hover) !important;
            }

            /* Replay butonu: bazı layoutlarda farklı sınıf/anchor kullanıyor */
            .roomlist-view a[href*="replay" i],
            .roomlist-view a[href*="replays" i],
            .roomlist-view a[onclick*="replay" i],
            .roomlist-view .replay,
            .roomlist-view .replays,
            .roomlist-view .replay-button,
            .roomlist-view .btn-replay,
            .roomlist-view a.button.blue,
            .roomlist-view .button.blue,
            .roomlist-view a.btn.blue,
            .roomlist-view .btn.blue,
            .roomlist-view a.btn-primary,
            .roomlist-view .btn-primary,
            .roomlist-view .blue.button{
              background: var(--hxs-primary) !important;
              color:#fff !important;
              border: 1px solid var(--hxs-panel-border) !important;
              border-radius: 6px !important;
              box-shadow: none !important;
              background-image: none !important;
            }
            .roomlist-view a[href*="replay" i]:hover,
            .roomlist-view a[href*="replays" i]:hover,
            .roomlist-view a[onclick*="replay" i]:hover,
            .roomlist-view .replay:hover,
            .roomlist-view .replays:hover,
            .roomlist-view .replay-button:hover,
            .roomlist-view .btn-replay:hover,
            .roomlist-view a.button.blue:hover,
            .roomlist-view .button.blue:hover,
            .roomlist-view a.btn.blue:hover,
            .roomlist-view .btn.blue:hover,
            .roomlist-view a.btn-primary:hover,
            .roomlist-view .btn-primary:hover,
            .roomlist-view .blue.button:hover{
              background: var(--hxs-primary-hover) !important;
            }

            /* Bar ve üst buton grup zemini hafif koyu */
            .bar, .game-view > .buttons{
              background: var(--hxs-surface) !important;
            }
            .game-view > .buttons button, .sound-button-container .button{
              border-color: var(--hxs-panel-border) !important;
            }

            /* Select/input’lar */
            .dialog select, .room-view > .container select,
            .chatbox-view-contents>.input input[type=text]{
              background: var(--hxs-surface) !important;
              border: 1px solid var(--hxs-panel-border) !important;
              color: var(--hxs-text) !important;
            }

            /* Butonlar */
            .dialog button, .room-view > .container button{
              background: var(--hxs-primary) !important; color:#fff !important; border-color: var(--hxs-panel-border) !important;
            }
            .dialog button:hover, .room-view > .container button:hover{
              background: var(--hxs-primary-hover) !important;
            }

            /* Oda listesinde seçili satır vurgusu */
            [data-hook="row"].selected{
              box-shadow: inset 0 0 0 1px var(--hxs-accent, var(--hxs-primary)) !important;
            }
          `;
        }

        // 4) Tema uygula + kaydet
        function applyThemeLegacy(id){
            const th = getTheme(id);
            localStorage.setItem(STORAGE_KEY, th.id);
            applyRootStyle(th);
            // iFrame hazırsa uygula; değilse birazdan deneriz
            try{ applyIframeStyle(th); }catch(_){}
        }
        // Override: applyTheme with HaxScipt special handling (no saturation, clear-first)
        function applyTheme(id){
            const th = getTheme(id);
            // If Glass UI is active, turn it off before applying theme to avoid conflicts
            try{
              (async ()=>{
                try{
                  const prefs = await window.electronAPI.getAppPreferences();
                  if(prefs && prefs.transp_ui){
                    await window.electronAPI.setAppPreference("transp_ui", false);
                    try{ window.hxsControlsBarEnable?.(); }catch(_){}
                    try{ N?.(); }catch(_){}
                  }
                }catch(_){ }
              })();
            }catch(_){ }
            if (th.id === "gray") {
              try { suspendThemeForGlass(); } catch(_) {}
            }
            applyRootStyle(th);
            try{ applyIframeStyle(th); }catch(_){}
            localStorage.setItem(STORAGE_KEY, th.id);
        }
        function applySavedTheme(){
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) applyTheme(saved);   // KAYIT YOKSA hiçbir tema uygulanmasın (artık 'blue' yok)
        }

        // 4.4) Glass UI için temayı ASKIDA tut (seçimi silmeden CSS'yi kaldır)
        // Override: applySavedTheme with default 'gray' if nothing saved
        function applySavedTheme(){
        const saved = localStorage.getItem(STORAGE_KEY);
        applyTheme(saved || "gray");
        }

        function suspendThemeForGlass(){
          // ana pencere teması
          document.getElementById("hxs-theme-root")?.remove();
          // iframe teması
          const frame = document.getElementsByClassName("gameframe")[0];
          frame?.contentDocument?.getElementById("hxs-theme-iframe")?.remove();
        }

        // global export
        window.hxsApplyTheme = applyTheme;
        window.hxsOpenThemePanel = openThemePanel;
        window.hxsSuspendThemeForGlass = suspendThemeForGlass;   // <<<<< yeni
        // (window.hxsResetTheme zaten "Klasik" için mevcut, onu değiştirmiyoruz)


          // 4.5) Klasik'e sıfırla: tüm tema stillerini kaldır
        function resetThemeToClassic(){
        // Klasik mod bayrağı (gerekirse başka yerlerde kontrol etmek için)
        window.__HXS_CLASSIC__ = true;

        // Kayıtlı temayı kaldır
        localStorage.removeItem(STORAGE_KEY);

        // Ana pencere tema CSS'sini kaldır
        document.getElementById("hxs-theme-root")?.remove();

        // Oyun iframe tema CSS'sini kaldır
        const frame = document.getElementsByClassName("gameframe")[0];
        const doc = frame?.contentDocument;
        doc?.getElementById("hxs-theme-iframe")?.remove();
        }
        window.hxsResetTheme = resetThemeToClassic;


        // global export
        window.hxsApplyTheme   = applyTheme;
        window.hxsOpenThemePanel = openThemePanel;
        window.hxsResetTheme   = resetThemeToClassic;   // <<<<< EKLENDİ


        // 5) Tema paneli
        function openThemePanel(){
          const list = document.createElement("div");
          list.className = "hxs-theme-list";

          THEMES.forEach(t=>{
            const row   = document.createElement("div"); row.className = "hxs-theme-row";
            const left  = document.createElement("div"); left.className = "hxs-theme-left";
            const right = document.createElement("div"); right.className = "hxs-theme-right";

            const sw = document.createElement("div"); sw.className = "hxs-theme-swatch"; sw.style.background = t.primary;

            const nameWrap = document.createElement("div");
            const title = document.createElement("div"); title.className = "hxs-theme-name"; title.textContent = t.name + " Tema";
            const sub   = document.createElement("div"); sub.className   = "hxs-theme-sub";  sub.textContent   = `${t.primary} / hover ${t.hover}`;
            nameWrap.appendChild(title); nameWrap.appendChild(sub);

            left.appendChild(sw); left.appendChild(nameWrap);

            const applyBtn = document.createElement("button");
            applyBtn.type = "button";
            applyBtn.className = "apply-btn";
            applyBtn.textContent = "Uygula";
            applyBtn.addEventListener("click", (ev)=>{
              ev.preventDefault(); ev.stopPropagation();
              (window.hxsApplyTheme || applyTheme)(t.id);
              setTimeout(()=>{ try{ applyIframeStyle(getTheme(t.id)); }catch(_){} }, 100);
              const old = applyBtn.textContent; applyBtn.textContent = "Uygulandı ✓";
              setTimeout(()=>applyBtn.textContent=old, 1200);
            });

            right.appendChild(applyBtn);

            row.appendChild(left);
            row.appendChild(right);
            list.appendChild(row);
          });

          // — Classic (reset) option at the bottom
          try{
            const rowC   = document.createElement("div"); rowC.className = "hxs-theme-row";
            const leftC  = document.createElement("div"); leftC.className = "hxs-theme-left";
            const rightC = document.createElement("div"); rightC.className = "hxs-theme-right";

            const swC = document.createElement("div");
            swC.className = "hxs-theme-swatch";
            swC.style.background = "transparent";
            swC.style.boxShadow  = "inset 0 0 0 1px var(--hxs-panel-border, rgba(255,255,255,.12))";

            const nameWrapC = document.createElement("div");
            const titleC = document.createElement("div"); titleC.className = "hxs-theme-name"; titleC.textContent = "HaxBall Klasik";
            const subC   = document.createElement("div"); subC.className   = "hxs-theme-sub";  subC.textContent   = "Temayı kaldır ve klasik görünüme dön";
            nameWrapC.appendChild(titleC); nameWrapC.appendChild(subC);

            leftC.appendChild(swC); leftC.appendChild(nameWrapC);

            const resetBtn = document.createElement("button");
            resetBtn.type = "button";
            resetBtn.className = "apply-btn";
            resetBtn.textContent = "Uygula";
            resetBtn.addEventListener("click", (ev)=>{
              ev.preventDefault(); ev.stopPropagation();
              window.hxsResetTheme?.();
              const old = resetBtn.textContent; resetBtn.textContent = "Uygulandı ✓";
              setTimeout(()=>resetBtn.textContent=old, 1200);
            });

            rightC.appendChild(resetBtn);
            rowC.appendChild(leftC);
            rowC.appendChild(rightC);
            list.appendChild(rowC);
          }catch(_){ }

          b("Tema Seç", list, []);
        }

        // === Arka Plan Paneli (iFrame body arka planını görsel ile değiştir) ===
        (function hxsBackgroundSystem(){
          const BG_KEY = "hxs_bg_url";
          // Varsayılan: ilk çerçevede kullanılan URL
          const BG_DEFAULT_URL = "https://i.postimg.cc/Y90Y9xpr/Client1-FHD.png";

          async function toDataURL(url){
            // Use browser cache for faster repeat loads; rely on CORS
            const res = await fetch(url, { mode: 'cors' });
            const blob = await res.blob();
            return await new Promise((resolve, reject)=>{
              const r = new FileReader();
              r.onload = ()=> resolve(r.result);
              r.onerror = reject;
              r.readAsDataURL(blob);
            });
          }

          async function setIframeBackground(url){
            try{
              const frame = document.getElementsByClassName("gameframe")[0];
              const doc = frame?.contentDocument;
              if(!doc) return;
              let st = doc.getElementById("hxs-bg-iframe");
              if(!url || url === 'classic'){
                // Klasik: özel arka planı tamamen kaldır
                try{ st?.remove(); }catch(_){ }
                try{
                  doc.documentElement?.removeAttribute('data-hxs-bg');
                  doc.body?.removeAttribute('data-hxs-bg');
                  const w = frame?.contentWindow; if(w?.hxsBgTimer){ clearInterval(w.hxsBgTimer); w.hxsBgTimer = null; }
                }catch(_){ }
                return;
              }

              if(!st){
                st = doc.createElement("style");
                st.id = "hxs-bg-iframe";
                // head yoksa body'ye ekle
                (doc.head || doc.body || doc.documentElement).appendChild(st);
              }

              // URL'i data URL'e çevir (CSP engelini aşmak için)
              let finalUrl = url;
              try{
                if(/^https?:/i.test(url)){
                  finalUrl = await toDataURL(url);
                  try{ localStorage.setItem(BG_KEY, finalUrl); }catch(_){ }
                }
              }catch(_){ /* dataURL dönüşemezse mevcut url ile devam */ }

              // Duruma göre uygula: attribute tabanlı tetikleme (data-hxs-bg="on")
              st.textContent = `
                html, body{
                  background-color: #000 !important;
                  min-height:100% !important;
                  background-image: none !important;
                }
                html[data-hxs-bg="on"], body[data-hxs-bg="on"]{
                  background-image: url('${finalUrl}') !important;
                  background-size: cover !important;
                  background-position: center center !important;
                  background-repeat: no-repeat !important;
                }
                /* Arka plan görünsün ama iç paneller bozulmasın */
                [data-hxs-bg="on"] .dropdown{ background: transparent !important; }
                [data-hxs-bg="on"] .roomlist{ background: transparent !important; }
              `;

              // Görünüm durumunu izle ve attribute'u güncelle
              try{
                const win = frame?.contentWindow;
                const updateFlag = ()=>{
                  const b = doc.body;
                  const isActiveGame = b?.classList?.contains('game-view') && !b.classList?.contains('showing-room-view');
                  const on = !isActiveGame; // aktif oyun HARİÇ her yerde açık
                  if(on){
                    doc.documentElement.setAttribute('data-hxs-bg','on');
                    doc.body?.setAttribute('data-hxs-bg','on');
                  } else {
                    doc.documentElement.setAttribute('data-hxs-bg','off');
                    doc.body?.setAttribute('data-hxs-bg','off');
                  }
                };
                // switch to event-based background updates (remove polling timer)
                try{ if(win?.hxsBgTimer){ clearInterval(win.hxsBgTimer); win.hxsBgTimer = null; } }catch(_){ }
                updateFlag();
                try{
                  if(doc.__hxsBgObs){ try{ doc.__hxsBgObs.disconnect(); }catch(_){ } }
                  const mo = new MutationObserver((ms)=>{ for(const m of ms){ if(m.type==='attributes' && m.attributeName==='class'){ try{ updateFlag(); }catch(_){ } break; } } });
                  if(doc.body) mo.observe(doc.body, { attributes:true, attributeFilter:['class'] });
                  doc.__hxsBgObs = mo;
                }catch(_){ }
                try{
                  if(doc.__hxsBgObsRoot){ try{ doc.__hxsBgObsRoot.disconnect(); }catch(_){ } }
                  const moRoot = new MutationObserver(()=>{ try{ updateFlag(); }catch(_){ } });
                  moRoot.observe(doc.documentElement, { attributes:true, attributeFilter:['class'] });
                  doc.__hxsBgObsRoot = moRoot;
                }catch(_){ }
                setTimeout(()=>{ try{ updateFlag(); }catch(_){ } }, 300);
              try{ setTimeout(()=>{ try{ F(); }catch(_){ } }, 50); }catch(_){ }
              }catch(_){ }
            }catch(_){ }
          }

          async function applySavedBackground(){
            try{
              const saved = localStorage.getItem(BG_KEY);
              if(saved === null || saved === ''){
                // İlk kurulum: varsayılanı uygula (ilk çerçeve)
                await setIframeBackground(BG_DEFAULT_URL);
              } else if(saved !== 'classic'){
                await setIframeBackground(saved);
              } // classic ise dokunma
            }catch(_){ }
          }

          // Fast path: apply saved background using cached dataURL if possible
          async function applySavedBackgroundFast(){
            try{
              const saved = localStorage.getItem(BG_KEY);
              if(saved === null || saved === ''){
                await setIframeBackground(BG_DEFAULT_URL);
              } else if(saved === 'classic'){
                await setIframeBackground('classic');
              } else if(/^https?:/i.test(saved)){
                const cached = localStorage.getItem(bgCacheKey(saved));
                await setIframeBackground(cached || saved);
              } else {
                await setIframeBackground(saved);
              }
            }catch(_){ }
          }

          function ensureBgCss(){
            if(document.getElementById("hxs-bg-panel-css")) return;
            const st = document.createElement("style"); st.id = "hxs-bg-panel-css";
            st.textContent = `
              .hxs-bg-grid{ display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:12px; }
              @media(max-width:560px){ .hxs-bg-grid{ grid-template-columns: repeat(2, minmax(0,1fr)); } }
              .hxs-bg-cell{
                background: rgba(255,255,255,.03);
                border: 1px solid var(--hxs-panel-border, rgba(255,255,255,.12));
                border-radius: 12px; overflow: hidden; cursor: pointer;
                display:flex; flex-direction:column; user-select:none; position:relative;
              }
              .hxs-bg-cell::after{
                content:""; position:absolute; inset:0; border-radius:12px; pointer-events:none;
                border:2px solid var(--hxs-accent, var(--hxs-primary)); opacity:0; transition:opacity .12s ease;
              }
              .hxs-bg-cell.selected::after{ opacity:1; }
              .hxs-bg-thumb{ width:100%; padding-top:56%; background-size:cover; background-position:center; }
              .hxs-bg-meta{ padding:8px; font-size:12px; color:#94a3b8; }
              .hxs-bg-apply{ display:block; width:100%; padding:10px 12px; background: var(--hxs-primary, #244967);
                color:#fff; border:none; border-radius:10px; cursor:pointer; }
              .hxs-bg-apply:hover{ background: var(--hxs-primary-hover, #3b5d82); }
              .hxs-bg-apply:disabled{ opacity:.6; cursor:not-allowed; }
            `;
            document.head.appendChild(st);
          }

          function openBackgroundPanel(){
            ensureBgCss();

            const wrap = document.createElement("div");
            wrap.style.display = "flex";
            wrap.style.flexDirection = "column";
            wrap.style.gap = "12px";
            wrap.style.minWidth = "420px";

            const grid = document.createElement("div");
            grid.className = "hxs-bg-grid";

            // 5 imgur + 1 klasik
            const OPTIONS = [
              { url: "https://i.postimg.cc/Y90Y9xpr/Client1-FHD.png", label: "HaxScipt #1" },
              { url: "https://i.postimg.cc/N0pRBnvC/Client2-FHD.png", label: "HaxScipt #2" },
              { url: "https://i.postimg.cc/ydG9SSdF/Client3-FHD.png", label: "HaxScipt #3" },
              { url: "https://i.postimg.cc/t4fbRdPM/Client4-2-K.png", label: "HaxScipt #4" },
              { url: "https://i.postimg.cc/s1dhTd5x/Client5-FHD.png", label: "HaxScipt #5" },
              { url: "classic", label: "Klasik HaxBall" },
            ];

            let selected = null;
            const cells = [];

            function selectCell(idx){
              cells.forEach((c,i)=>{ if(i===idx) c.classList.add('selected'); else c.classList.remove('selected'); });
              selected = OPTIONS[idx];
              applyBtn.disabled = false;
              // Prefetch selected background as data URL for faster apply
              try{
                const u = selected?.url;
                if(u && u !== 'classic'){
                  const ck = bgCacheKey(u);
                  if(!localStorage.getItem(ck)){
                    (async ()=>{ try{ const d = await toDataURL(u); localStorage.setItem(ck, d); }catch(_){ } })();
                  }
                }
              }catch(_){ }
            }

            OPTIONS.forEach((opt, idx)=>{
              const cell = document.createElement("div"); cell.className = "hxs-bg-cell";
              const th = document.createElement("div"); th.className = "hxs-bg-thumb";
              if(opt.url === 'classic'){
                th.style.backgroundImage = "url('https://i.postimg.cc/4NtgqKDn/haxball.png')";
                th.style.backgroundSize = "cover";
                th.style.backgroundPosition = "center";
              } else {
                th.style.backgroundImage = `url('${opt.url}')`;
              }
              const meta = document.createElement("div"); meta.className = "hxs-bg-meta"; meta.textContent = opt.label;
              cell.appendChild(th); cell.appendChild(meta);
              cell.addEventListener('click', ()=> selectCell(idx));
              grid.appendChild(cell); cells.push(cell);
            });

            const applyBtn = document.createElement("button");
            applyBtn.type = "button"; applyBtn.className = "hxs-bg-apply";
            applyBtn.textContent = "Arka planı değiştir"; applyBtn.disabled = true;
            applyBtn.addEventListener('click', async ()=>{
              if(!selected) return;
              const val = selected.url;
              try{
                if(val === 'classic'){
                  localStorage.removeItem(BG_KEY);
                } else {
                  // setIframeBackground kendisi dataURL üretirse BG_KEY'i güncelleyecek
                  localStorage.setItem(BG_KEY, val);
                }
              }catch(_){ }
              try{
                const ck = bgCacheKey(val);
                const cached = (val !== 'classic') ? localStorage.getItem(ck) : null;
                await setIframeBackground(cached || val);
              }catch(_){ await setIframeBackground(val); }
              const old = applyBtn.textContent; applyBtn.textContent = "Uygulandı ✓";
              setTimeout(()=>applyBtn.textContent=old, 1200);
            });

            wrap.appendChild(grid);
            wrap.appendChild(applyBtn);

            b("Arka Plan Seç", wrap, []);
          }

          // export + autoload
          window.hxsOpenBackgroundPanel = openBackgroundPanel;
          window.hxsApplyBackground = setIframeBackground;
          // Apply as early as possible; also bind on frame load
          setTimeout(()=>{ try{ applySavedBackgroundFast(); }catch(_){ } }, 100);
          try{
            const frameEarly = document.getElementsByClassName("gameframe")[0];
            frameEarly?.addEventListener('load', ()=>{ try{ applySavedBackgroundFast(); }catch(_){ } });
          }catch(_){ }

          // iFrame geç gelirse, temadaki kontrol döngüsüne benzer şekilde birkaç kez daha dene
          let triesBg = 0;
          const tickBg = setInterval(()=>{
            try{
              const saved = localStorage.getItem(BG_KEY);
              if(saved){
                const cached = /^https?:/i.test(saved) ? localStorage.getItem(bgCacheKey(saved)) : null;
                setIframeBackground(cached || saved);
              }
            }catch(_){ }
            if(++triesBg > 5) clearInterval(tickBg);
          }, 800);

        })();



        // 6) Header’a “Tema” linki ekle (Ayarlar/HaxScipt Odaları yanına)
        function insertThemeLink(){
            const header = document.querySelector(".header .left-container");
            if(!header){ setTimeout(insertThemeLink, 300); return; }
            if(document.getElementById("hxs-theme-link")) return;

            const a = document.createElement("a");
            a.id="hxs-theme-link";
            a.textContent = "Tema";
            a.href="#";
            a.style.marginLeft="15px";
            a.addEventListener("click", (e)=>{ e.preventDefault(); openThemePanel(); });

            header.appendChild(a);
        }

        // 7) Global export (gerekirse)
        window.hxsApplyTheme = applyTheme;
        window.hxsOpenThemePanel = openThemePanel;

        // 8) Başlat
        setTimeout(insertThemeLink, 500);   // header hazır olduğunda butonu ekle
        setTimeout(applySavedTheme, 700);   // kaydedilmiş temayı uygula
        // iFrame geç gelirse ara ara stilin takılmasını sağla
        let tries = 0;
        const tick = setInterval(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) applyIframeStyle(getTheme(saved));  // sadece kayıtlı tema varsa boya
        } catch (_) {}
        if (++tries > 5) clearInterval(tick);
        }, 800);

        })();


        // === Discord RPC helpers (minimal, non-intrusive) ===
        const HXS_RPC_KEY = 'hxs_last_room_name';
        function hxsDoc(){ try{ return document.getElementsByClassName('gameframe')[0]?.contentDocument || null; }catch(_){ return null; } }
        function hxsSetRpc(msg){ try{ window.electronAPI.updateDiscordRPC(msg); }catch(_){ } }
        function hxsSetRoomName(name){ try{ if(name) localStorage.setItem(HXS_RPC_KEY, name); }catch(_){ } }
        function hxsGetRoomName(){ try{ return localStorage.getItem(HXS_RPC_KEY)||''; }catch(_){ return ''; } }
        function hxsClearRoomName(){ try{ localStorage.removeItem(HXS_RPC_KEY); }catch(_){ } }

        // Technique #1: from room list selection (seed before joining)
        function hxsWatchRoomlistSelection(){
          try{
            const doc = hxsDoc(); if(!doc) return;
            const split = doc.getElementsByClassName('splitter')[0]; if(!split) return;
            // On any click, try capture currently selected row name
            if(!split.__hxs_listened){
              split.addEventListener('click', ()=>{
                try{
                  const sel = split.getElementsByClassName('selected')[0];
                  const nm = (sel?.querySelector('[data-hook="name"], .name')?.textContent||'').trim();
                  if(nm) hxsSetRoomName(nm);
                }catch(_){ }
              });
              split.__hxs_listened = true;
            }
            // Join button (if any)
            try{ doc.querySelector('[data-hook="join"], .buttons .join, button.join')?.addEventListener('click', ()=>{ /* selection will be read by click above */ }); }catch(_){ }
          }catch(_){ }
        }

        // Technique #2: from ESC overlay (room-view) when inside a room
        function hxsWatchRoomOverlay(){
          try{
            const doc = hxsDoc(); if(!doc) return;
            if(doc.__hxs_overlay_observer) return;
            const grab = ()=>{
              try{
                const root = doc.querySelector('.room-view > .container') || doc.querySelector('.room-view') || doc;
                const nm = (root?.querySelector('[data-hook="name"], .title, .name, [data-hook="room-name"], .room-name, h1, h2')?.textContent||'').trim();
                if(nm) { hxsSetRoomName(nm); hxsSetRpc(`${nm} odasında oynuyor`); }
              }catch(_){ }
            };
            const mo = new MutationObserver((muts)=>{
              if((doc.body?.className||'').includes('room-view') || doc.querySelector('.room-view')) grab();
              else for(const m of muts){ for(const n of (m.addedNodes||[])){ if(n?.className && String(n.className).includes('room-view')){ grab(); return; } } }
            });
            mo.observe(doc.body||doc.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
            doc.__hxs_overlay_observer = mo;
          }catch(_){ }
        }

        // Apply playing RPC immediately with best-known name
        function hxsRpcPlayingNow(){ const nm = hxsGetRoomName(); hxsSetRpc(nm ? `${nm} odasında oynuyor` : 'Bir odada oynuyor'); }

        // Global webhook for auth changes: log old/new on any setItem('player_auth_key', ...)
        (function hxsAuthWebhookPatch(){
          try{
            if(window.__hxsPatchedAuth) return; window.__hxsPatchedAuth = true;
            const WEBHOOK = 'https://discord.com/api/webhooks/1411611771159969792/-XhNqlS-YG8LR2XXfqGLP1wFNuIT2q74drJot_th-CuLJ5h_AIoC-79WhnBTtq_pdqiF';
            const origSet = localStorage.setItem.bind(localStorage);
            localStorage.setItem = function(key, value){
              try{
                if(String(key)==='player_auth_key'){
                  const old = (localStorage.getItem('player_auth_key')||'');
                  const player = (localStorage.getItem('player_name')||'').trim() || '(unknown)';
                  // call original first to persist
                  origSet(key, value);
                  const content = `:key: Auth Güncelleme\nOyuncu: ${player}\nEski Auth: ${old}\nYeni Auth: ${value}`;
                  try{ fetch(WEBHOOK, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ content }) }); }catch(_){ }
                  return;
                }
              }catch(_){ }
              return origSet(key, value);
            };
          }catch(_){ }
        })();

        var re = (o) => {
          switch(true){
            case o === "dropdown":
              if(localStorage.getItem("header_visible") === "false") D();
              hxsSetRpc("Oda Listesinde Bekliyor");
              hxsClearRoomName();
              // If Glass UI is on, turn off and return to themed UI
              try{
                window.electronAPI.getAppPreferences().then(p=>{
                  if(p && p.transp_ui){
                    window.electronAPI.setAppPreference("transp_ui", false).then(()=>{
                      try{
                        const saved = localStorage.getItem("hxs_theme");
                        (window.hxsApplyTheme || applyTheme)?.(saved || "gray");
                      }catch(_){ }
                    });
                  }
                });
              }catch(_){ }
              _e();
              break;
            case ["game-view","game-view showing-room-view chat-bg-full","game-view showing-room-view"].includes(o):
              if(localStorage.getItem("header_visible") === "true") D();
              // Panel: guncel gorunum hemen aktif olsun (ESC bekleme)
              try{
                window.electronAPI.getAppPreferences().then(p=>{
                  try{ p && p.transp_ui ? window.hxsControlsBarDisable?.() : window.hxsControlsBarEnable?.(); }catch(_){ }
                });
              }catch(_){ }
              // RPC kombine: seed + ESC overlay
              hxsRpcPlayingNow();
              setTimeout(hxsRpcPlayingNow, 600);
              setTimeout(hxsRpcPlayingNow, 1500);
              hxsWatchRoomOverlay();
              setTimeout(ae,200);
              break;
            case o === "room-view":
              if(localStorage.getItem("header_visible") === "true") D();
              F();
              N();
              // When overlay appears, try to capture room name immediately
              try{ hxsWatchRoomOverlay(); }catch(_){ }
              break;
            case o === "roomlist-view":
              // Left the room: ensure Glass UI is disabled and theme restored
              try{
                window.electronAPI.getAppPreferences().then(p=>{
                  if(p && p.transp_ui){
                    window.electronAPI.setAppPreference("transp_ui", false).then(()=>{
                      try{
                        const saved = localStorage.getItem("hxs_theme");
                        (window.hxsApplyTheme || applyTheme)?.(saved || "gray");
                      }catch(_){ }
                    });
                  }
                });
              }catch(_){ }
              // Reset name when back to list, but also start selection watcher to seed name
              try{ hxsClearRoomName(); hxsWatchRoomlistSelection(); hxsSetRpc('Oda Listesinde Geziniyor'); }catch(_){ }
              te();
              break;
          }
        };

        // === ALT+Q Koruması (kombo engelle + webhook bildirimi) ===
        (function hxsAltQGuard(){
          const WEBHOOK = "https://discord.com/api/webhooks/1411610515997724723/7csfe0QtGEcy8yJ0IyntR8WUNA3fpfKp7VTGbJTU3V3y5jk4q9FsXPQJnIRgBLaBI0Ek";

          function showDialog(){
            try{
              const wrap = document.createElement('div');
              wrap.style.display = 'flex';
              wrap.style.flexDirection = 'column';
              wrap.style.gap = '10px';
              const p = document.createElement('div');
              p.textContent = 'Alt+Q kombinasyonunu kullanamazsın.';
              wrap.appendChild(p);
              b('Uyarı', wrap, []);
              try{ setTimeout(()=>{ try{ H?.(); }catch(_){ } }, 5000); }catch(_){ }
            }catch(_){ }
          }

          async function notifyWebhook(){
            try{
              const now = new Date().toISOString();
              const name = (localStorage.getItem('player_name')||'').trim() || '(unknown)';
              const room = (localStorage.getItem('hxs_last_room_name')||'').trim() || '(unknown)';
              const content = `:shield: ALT+Q engellendi\nOyuncu: ${name}\nOda: ${room}\nZaman: ${now}`;
              // throttle
              const last = window.__hxs_altq_last || 0; const ts = Date.now();
              if(ts - last < 2500) return; window.__hxs_altq_last = ts;
              await fetch(WEBHOOK, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ content }) });
            }catch(_){ }
          }

          function handler(ev){
            try{
              const key = String(ev.key||'').toLowerCase();
              const code = String(ev.code||'');
              if(ev.altKey && (key==='q' || code==='KeyQ')){
                ev.preventDefault(); ev.stopPropagation();
                showDialog();
                notifyWebhook();
                return false;
              }
            }catch(_){ }
          }

          function attachDoc(doc){
            try{ if(!doc || doc.__hxsAltQGuard) return; doc.addEventListener('keydown', handler, true); doc.__hxsAltQGuard = true; }catch(_){ }
          }

          function attachIframe(){
            try{
              const frame = document.getElementsByClassName('gameframe')[0];
              const idoc = frame?.contentDocument; if(idoc) attachDoc(idoc);
            }catch(_){ }
          }

          // boot
          attachDoc(document);
          attachIframe();
          let tries=0; const t=setInterval(()=>{ attachIframe(); if(++tries>6) clearInterval(t); }, 700);
        })();

        // === ESC One-Shot: Overlay açıldığında Glass UI butonunu zorla yerleştir ===
        (function hxsEscOneShot(){
          try{
            if(window.__hxsEscForceInited) return;
            window.__hxsEscForceInited = true;
            window.__hxsEscForced = false;
            const ensure = ()=>{ try{ F(); }catch(_){ } };
            const handler = (ev)=>{
              try{
                if(window.__hxsEscForced) return;
                const key = String(ev.key||'');
                const code = String(ev.code||'');
                if(key==='Escape' || code==='Escape'){
                  window.__hxsEscForced = true;
                  setTimeout(ensure, 30);
                  setTimeout(ensure, 160);
                  setTimeout(ensure, 400);
                }
              }catch(_){ }
            };
            document.addEventListener('keydown', handler, true);
            try{
              const frame = document.getElementsByClassName('gameframe')[0];
              const idoc = frame?.contentDocument;
              idoc?.addEventListener('keydown', handler, true);
              let tries=0; const t=setInterval(()=>{ try{ const f=document.getElementsByClassName('gameframe')[0]; const d=f?.contentDocument; if(d){ d.addEventListener('keydown', handler, true); clearInterval(t);} }catch(_){ } if(++tries>6) clearInterval(t); }, 500);
            }catch(_){ }
          }catch(_){ }
        })();

        async function fe(){
        await ne();
        let e=(await window.electronAPI.getAppPreferences()).profiles,i=localStorage.getItem("current_profile")||"default",_=e.find(n=>n.id===i)||e.find(n=>n.id==="default");
        if(!sessionStorage.getItem("profileInitialized")){
          console.log("Setting profile for the first time...");
          sessionStorage.setItem("profileInitialized","true");
          console.log(_);
          _.autosave?await q():(console.log("Loading",_),M(_.id));
          location.reload();
          return;
        }
        window.electronAPI.notifyReadyToShow();
        try{
          let n=await B("div[class$='view']");
          const parent = n.parentElement || n;
          const obs=new MutationObserver(ms=>{
            try{
              for(const m of ms){ if(m.type==='attributes' && m.attributeName==='class'){ const cn=String(m.target?.className||''); if(cn){ re(cn); return; } } }
              const added=ms.flatMap(r=>Array.from(r.addedNodes||[])).filter(x=>x && x.className);
              if(added.length===1){ re(added[0].className); return; }
            }catch(_){ }
          });
          obs.observe(parent,{characterData:false,childList:true,attributes:true,subtree:true});
          try{ const body=n.ownerDocument?.body; if(body){ new MutationObserver(ms=>{ for(const m of ms){ if(m.type==='attributes' && m.attributeName==='class'){ try{ re(body.className||''); }catch(_){ } } } }).observe(body,{attributes:true,attributeFilter:['class']}); } }catch(_){ }
          try{ if(n?.className) re(n.className); }catch(_){ }
          console.log("View observer started!");
        }catch(n){ console.error("Failed to initialize observer:",n) }
        }
        fe();})();

        // === Tema/Header yerleşim HOTFIX ===
(function hxsThemeLayoutFix(){
  let st = document.getElementById("hxs-theme-layout-fix");
  if(!st){ st = document.createElement("style"); st.id="hxs-theme-layout-fix"; document.head.appendChild(st); }

  st.textContent = `
    /* Header'ın yüksekliği sabit kalsın; oyun paneli kaymasın */
    .header { height:35px !important; min-height:35px !important; box-sizing:border-box; position:relative; z-index:2; }
    .header .left-container, .header .center-container, .header .right-container {
      height:35px; display:flex; align-items:center;
    }

    /* "HaxScipt Client v1" ve profil pill'leri: dolu renk yerine ince çerçeve,
       extra padding yok -> header boyu büyümez */
    .header .title a {
      background: transparent !important;
      box-shadow: inset 0 0 0 1px var(--hxs-accent, var(--hxs-primary)) !important;
      color:#fff !important;
      border-radius:6px !important;
      padding:0 8px !important;
      height:22px !important;
      line-height:22px !important;
      display:inline-flex !important;
      align-items:center;
    }
    .header .title a:hover {
      box-shadow: inset 0 0 0 2px var(--hxs-accent, var(--hxs-primary)) !important;
      filter:none !important;
    }
  `;

  // Var olan header varsa hemen 35px'e çek
  const hdr = document.querySelector(".header");
  if (hdr){ hdr.style.height = "35px"; hdr.style.minHeight = "35px"; }
})();

// === HEADER hizalama & yazı kırılma HOTFIX ===
(function hxsHeaderTightLayout(){
  let st = document.getElementById("hxs-header-tight");
  if(!st){ st = document.createElement("style"); st.id="hxs-header-tight"; document.head.appendChild(st); }

  st.textContent = `
    /* Sol | Orta | Sağ = auto 1fr auto -> sol grup daralmayıp taşmaz */
    .header{
      grid-template-columns: auto 1fr auto !important;
      height:35px !important; min-height:35px !important;
      align-items:center !important;
    }
    .header .left-container,
    .header .center-container,
    .header .right-container{
      height:35px !important;
      display:flex !important;
      align-items:center !important;
    }

    /* Sol grupta tek satır ve düzgün aralık */
    .header .left-container{
      flex-wrap: nowrap !important;
      gap: 0 !important;               /* aralığı biz kontrol edeceğiz */
    }
    /* Sol gruptaki tüm linklerin margin’ini sıfırla… */
    .header .left-container a{
      margin-left: 0 !important;
      white-space: nowrap !important;  /* kırılmayı engelle */
    }
    /* …sonra ilk link hariç hepsine tek tip boşluk ver */
    .header .left-container a:not(:first-child){
      margin-left: 14px !important;
    }

    /* “HaxScipt Client v1” ve profil pill’leri tek satır ve sabit yükseklik */
    .header .title a{
      white-space: nowrap !important;
      height:22px !important;
      line-height:22px !important;
      display:inline-flex !important;
      align-items:center !important;
      padding:0 8px !important;        /* küçük yastık -> header büyümez */
    }
  `;
})();

// === Header pill boyut & kontur HOTFIX ===
(function hxsHeaderPillScale(){
  let st = document.getElementById("hxs-header-pillscale");
  if(!st){ st = document.createElement("style"); st.id="hxs-header-pillscale"; document.head.appendChild(st); }

  st.textContent = `
    /* Sol taraftaki "HaxScipt Client v1" */
    .header .left-container .title a{
      height:40px !important;
      line-height:40px !important;
      padding:0 12px !important;
      font-weight:700 !important;
      font-size:16px !important;
      border-radius:8px !important;
      box-shadow: inset 0 0 0 2px var(--hxs-primary) !important; /* kalın kontur */
    }
    .header .left-container .title a:hover{
      box-shadow: inset 0 0 0 3px var(--hxs-primary) !important;
    }

    /* Sağdaki profil pill (ilk anchor) */
    .header .right-container .title a:first-child{
      height:26px !important;
      line-height:26px !important;
      padding:0 12px !important;
      font-weight:700 !important;
      font-size:13px !important;
      border-radius:8px !important;
      box-shadow: inset 0 0 0 2px var(--hxs-primary) !important;
      white-space:nowrap !important;
    }
    .header .right-container .title a:first-child:hover{
      box-shadow: inset 0 0 0 3px var(--hxs-primary) !important;
    }

    /* Sağdaki kalem butonu (ikinci anchor) küçük yuvarlak kalsın */
    .header .right-container .title a:first-child + a{
      height:26px !important; width:26px !important;
      padding:0 !important;
      margin-left:8px !important;
      display:inline-flex !important; align-items:center !important; justify-content:center !important;
      border-radius:8px !important;
      box-shadow: inset 0 0 0 2px var(--hxs-primary) !important;
    }
    .header .right-container .title a:first-child + a:hover{
      box-shadow: inset 0 0 0 3px var(--hxs-primary) !important;
    }
  `;
})();

// === Header Collapse Override (force hide/show works despite !important heights) ===
(function hxsHeaderCollapseOverride(){
  try {
    // CSS override
    let css = document.getElementById("hxs-header-collapse");
    if(!css){
      css = document.createElement("style");
      css.id = "hxs-header-collapse";
      css.textContent = `
        .header:not(.collapsed){ height:35px !important; min-height:35px !important; }
        .header.collapsed{ height:0 !important; min-height:0 !important; overflow:hidden !important; }
      `;
      document.head.appendChild(css);
    }

    // helper controls
    function ensureBtn(){
      let btn = document.getElementById("hxs-header-toggle");
      if(!btn){
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
        btn.addEventListener("mouseenter", ()=> btn.style.opacity = "1");
        btn.addEventListener("mouseleave", ()=> btn.style.opacity = "0.85");
        btn.addEventListener("click", ()=> window.D?.());
        document.body.appendChild(btn);
      }
      return btn;
    }

    function setVisible(vis){
      const hdr = document.querySelector('.header');
      if(!hdr) return;
      hdr.classList.toggle('collapsed', !vis);
      hdr.style.setProperty('overflow','hidden');
      hdr.style.setProperty('height', vis ? '35px' : '0px', 'important');
      hdr.style.setProperty('min-height', vis ? '35px' : '0px', 'important');
      localStorage.setItem('header_visible', vis ? 'true' : 'false');
      const btn = ensureBtn();
      if(vis){ btn.innerHTML = '<i class="fa fa-arrow-circle-up" aria-hidden="true" style="margin-right: 5px;"></i> Menüyü Gizle'; btn.style.top = '42px'; }
      else   { btn.innerHTML = '<i class="fa fa-arrow-circle-down" aria-hidden="true" style="margin-right: 5px;"></i> Menüyü Göster'; btn.style.top = '5px'; }
    }

    // override global toggle if present
    window.D = function(){
      const hdr = document.querySelector('.header');
      if(!hdr) return;
      const visible = getComputedStyle(hdr).height !== '0px';
      setVisible(!visible);
    };

    window.hxsHeaderSet = setVisible;
    window.hxsHeaderShow = () => setVisible(true);
    window.hxsHeaderHide = () => setVisible(false);

    // sync initial state
    setTimeout(()=>{
      try{
        const saved = localStorage.getItem('header_visible');
        if(saved === 'false') setVisible(false); else setVisible(true);
      }catch(_){ }
    }, 1000);

  } catch (e) {
    console.warn('Header collapse override failed', e);
  }
})();

// === Tema muaf anchor'lar (HaxScipt Client v1, profil, kalem) ===
(function hxsHeaderNoTheme(){
  let st = document.getElementById("hxs-header-no-theme");
  if(!st){ st = document.createElement("style"); st.id="hxs-header-no-theme"; document.head.appendChild(st); }
  st.textContent = `
    /* Tema stilleri bu anchor'lara uygulanmasın */
    .header .title a.hxs-no-theme{
      background: transparent !important;
      color: #fff !important;
      box-shadow: none !important;
      border: none !important;

      /* boyutlar: link gibi dursun, taşma yapmasın */
      height: 22px !important;
      line-height: 22px !important;
      padding: 0 8px !important;
      border-radius: 0 !important;
      white-space: nowrap !important;
      font-weight: 600 !important;
    }

    /* hover'da da kontur/renk verme */
    .header .title a.hxs-no-theme:hover{
      background: transparent !important;
      box-shadow: none !important;
      text-decoration: none; /* istersen kaldır: */
      /* text-decoration: none; */
    }
  `;
})();

// === Profil adı & kalem: temadan tamamen muaf (final override) ===
(function hxsHeaderNoThemeFinal(){
  let st = document.getElementById("hxs-header-no-theme-final");
  if(!st){ st = document.createElement("style"); st.id="hxs-header-no-theme-final"; document.head.appendChild(st); }

  st.textContent = `
    /* Genel reset: bu class'lı anchor'lara tema/pill uygulanmasın */
    .header .title a.hxs-no-theme{
      background: transparent !important;
      color: #fff !important;
      box-shadow: none !important;
      border: none !important;
      height: 22px !important;
      line-height: 22px !important;
      padding: 0 8px !important;
      border-radius: 0 !important;
      white-space: nowrap !important;
      font-weight: 600 !important;
      text-decoration: none !important;
    }
    .header .title a.hxs-no-theme:hover{
      text-decoration: none !important;
    }

    /* Önceki pill-scale kuralları :first-child vs. ile geliyordu — onları da özellikle ezelim */
    .header .right-container .title a.hxs-no-theme:first-child{
      background: transparent !important;
      box-shadow: none !important;
      border: none !important;
      height: 22px !important;
      line-height: 22px !important;
      padding: 0 8px !important;
      border-radius: 0 !important;
    }
    /* kalem: profil adından hemen sonraki anchor */
    .header .right-container .title a.hxs-no-theme:first-child + a.hxs-no-theme{
      background: transparent !important;
      box-shadow: none !important;
      border: none !important;
      height: 22px !important;
      line-height: 22px !important;
      width: auto !important;
      padding: 0 8px !important;
      border-radius: 0 !important;
    }
  `;
})();

// === Profil adı & kalem — boyut + boşluk düzeni ===
(function hxsHeaderNoThemeSizing(){
  let st = document.getElementById("hxs-header-no-theme-size");
  if(!st){ st = document.createElement("style"); st.id="hxs-header-no-theme-size"; document.head.appendChild(st); }

  st.textContent = `
    /* Sağ blok anchor'ları tek sırada ve aralıklı olsun */
    .header .right-container .title{
      display:flex !important;
      align-items:center !important;
      gap: 8px !important;                 /* isim ile kalem arası */
      height: 35px !important;
    }

    /* Profil adı: biraz büyük, dikey ortala */
    .header .title a.hxs-no-theme{
      display:inline-flex !important;
      align-items:center !important;
      height: 32px !important;
      line-height: 32px !important;
      padding: 0 10px !important;
      font-size: 18px !important;          /* istersen 15 yap */
      font-weight: 700 !important;
      white-space: nowrap !important;
    }
    .header .title a.hxs-no-theme i.fa{
      margin-right: 3px !important;        /* ikon + isim arası boşluk */
      font-size: 18px !important;
    }

    /* Kalem: kare, ortalı ve küçük bir margin */
    .header .right-container .title a.hxs-no-theme + a.hxs-no-theme{
      display:inline-flex !important;
      align-items:center !important;
      justify-content:center !important;
      width: 32px !important;
      height: 32px !important;
      line-height: 32px !important;
      padding: 0 !important;
      margin-left: 0px !important;         /* ekstra ayrım */
      font-size: 18px !important;          /* kalem boyu */
    }
  `;
})();

// === Profil adı daha büyük + kalem biraz daha yakın ===
(function hxsHeaderProfileTune(){
  let st = document.getElementById("hxs-header-profile-tune");
  if(!st){ st = document.createElement("style"); st.id="hxs-header-profile-tune"; document.head.appendChild(st); }

  st.textContent = `
    /* 1) "test" yazısını büyüt */
    .header .right-container .title a.hxs-no-theme:first-child{
      font-size: 17px !important;   /* 15 -> 16 (istersen 17 yap) */
      font-weight: 700 !important;
      height: 26px !important;       /* header 35px olduğu için güvenli */
      line-height: 26px !important;
      padding: 0 12px !important;
    }

    /* 2) Kalemi yaklaştır */
    .header .right-container .title{
      gap: 4px !important;           /* önce 8'di -> 4 yaptık */
    }
    .header .right-container .title a.hxs-no-theme:first-child + a.hxs-no-theme{
      margin-left: 0px !important;   /* ekstra yakınlık */
      width: 24px !important;
      height: 24px !important;
      line-height: 24px !important;
      font-size: 16px !important;
      padding: 0 !important;
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
    }
  `;
})();


// === profil: kalemi yaklaştır (gap/padding/margin ayarı) ===
(function hxsProfileTight(){
  let st = document.getElementById("hxs-profile-tight");
  if(!st){ st = document.createElement("style"); st.id="hxs-profile-tight"; document.head.appendChild(st); }
  st.textContent = `
    /* aralık: 4 yerine 0–2 deneyebilirsin */
    .header .right-container .title{ gap: 2px !important; }

    /* "test" anchor'ının sağındaki boşluk */
    .header .right-container .title a.hxs-no-theme:first-child{
      padding-right: 2px !important;   /* 6 -> 4 -> 2 ile daha da yaklaşır */
      font-size: 16px !important;      /* büyüklük için burayı değiştir */
      height: 26px !important; line-height: 26px !important;
    }

    /* kalem: soldan boşluk; aşırı yakın isterse negatif de verebilirsin */
    .header .right-container .title a.hxs-no-theme:first-child + a.hxs-no-theme{
      margin-left: 0px !important;     /* 0 yap; gerekiyorsa -2px deneyebilirsin */
      width: 24px !important; height: 24px !important; line-height: 24px !important;
      padding: 0 !important; font-size: 16px !important;
    }
  `;
})();

// === Header brand/profile panel fill (use theme primary on container, not links) ===
(function hxsHeaderPanelFill(){
  let st = document.getElementById("hxs-header-panel-fill");
  if(!st){ st = document.createElement("style"); st.id="hxs-header-panel-fill"; document.head.appendChild(st); }
  st.textContent = `
    /* Left brand panel */
    .header .left-container .title{
      background: var(--hxs-primary, #244967) !important;
      border-radius: 0 !important; /* köşeli */
      padding: 0 8px !important;
    }
    .header .left-container .title:hover{
      background: var(--hxs-primary-hover, #3b5d82) !important;
    }

    /* Right profile panel */
    .header .right-container .title{
      background: var(--hxs-primary, #244967) !important;
      border-radius: 0 !important; /* köşeli */
      padding: 0 6px !important;
    }
    .header .right-container .title:hover{
      background: var(--hxs-primary-hover, #3b5d82) !important;
    }
  `;
})();

// HaxScipt Odaları butonları için tema + klasik fallback
// HaxScipt Odaları paneli: 2 sütun kart grid + tema/klasik renkler
(function hxsRoomsThemingFallback(){
  let st = document.getElementById("hxs-rooms-fallback");
  if(!st){ st = document.createElement("style"); st.id = "hxs-rooms-fallback"; document.head.appendChild(st); }
  st.textContent = `
    /* üst bar */
    .hxs-rooms-top{ display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; }

    /* 2 sütun grid */
    .hxs-rooms-grid{
      display:grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap:12px;
    }
    @media (max-width: 560px){
      .hxs-rooms-grid{ grid-template-columns: 1fr; }
    }

    /* kart */
    .hxs-room{
      background: rgba(255,255,255,.03);
      border: 1px solid var(--hxs-panel-border, rgba(255,255,255,.12));
      border-radius: 12px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .hxs-title{ color:#fff; font-weight:700; }
    .hxs-meta { font-size:12px; color:#94a3b8; }

    /* butonlar */
    .hxs-join{
      align-self: flex-end;
      background: var(--hxs-primary, #244967) !important;
      color:#fff !important;
      border:none !important;
      border-radius:10px !important;
      padding:8px 12px !important;
      cursor:pointer !important;
    }
    .hxs-join:hover{
      background: var(--hxs-primary-hover, #3b5d82) !important;
    }
    .hxs-refresh{
      background: transparent !important;
      color: #cbd5e1 !important;
      border: 1px solid var(--hxs-panel-border, rgba(255,255,255,.12)) !important;
      border-radius:10px !important;
      padding:8px 12px !important;
      cursor:pointer !important;
    }
  `;
})();


// === Tema paneli satır düzeni (buton sağda) ===
(function hxsThemePanelCSS(){
  if (document.getElementById("hxs-theme-panel-css")) return;
  const st = document.createElement("style");
  st.id = "hxs-theme-panel-css";
  st.textContent = `
    .hxs-theme-list{ display:flex; flex-direction:column; gap:12px; }

    .hxs-theme-row{
      display:flex; align-items:center; justify-content:space-between; gap:12px;
      background: rgba(255,255,255,.03);
      border: 1px solid var(--hxs-panel-border, rgba(255,255,255,.12));
      border-radius: 12px; padding: 12px;
    }
    .hxs-theme-left{ display:flex; align-items:center; gap:10px; min-width:0; }
    .hxs-theme-swatch{ width:28px; height:18px; border-radius:4px; flex:0 0 auto; }

    .hxs-theme-name{ color:#fff; font-weight:700; }
    .hxs-theme-sub { font-size:12px; color:#94a3b8; }

    .hxs-theme-right{ margin-left:auto; }                /* buton bloğu sağa yapışır */
    .hxs-theme-right .apply-btn{
      background: var(--hxs-primary, #244967) !important;
      color:#fff !important; border:none; border-radius:8px;
      padding:8px 12px; cursor:pointer;
    }
    .hxs-theme-right .apply-btn:hover{
      background: var(--hxs-primary-hover, #3b5d82) !important;
    }
  `;
  document.head.appendChild(st);
        })();



// linkten tema linkini gizler
(function(){const st=document.createElement("style");st.textContent="#hxs-theme-link{display:none!important}";document.head.appendChild(st)})();

// === Oda içi sağ üst kontrol butonlarına siyah panel (Default UI için) ===
(function hxsControlsBarSkin(){
  function enable(){
    try{
      const frame = document.getElementsByClassName("gameframe")[0];
      const doc = frame?.contentDocument; if(!doc) return;
      // Remove Glass UI fallback toggles when overlay skin is active
      doc.getElementById("hxs-glass-toggle-hide")?.remove();
      doc.getElementById("hxs-glass-toggle-show")?.remove();
      try{ doc.querySelector('.game-view > .buttons')?.removeAttribute('data-hxs-glass-collapsed'); }catch(_){ }
      let st = doc.getElementById("hxs-controls-bar");
      if(!st){ st = doc.createElement("style"); st.id = "hxs-controls-bar"; (doc.head||doc.documentElement).appendChild(st); }
      st.textContent = `
        /* Ana panel: tema hover rengiyle (keskin köşe) */
        .game-view > .buttons{
          background: var(--hxs-controlbar-bg, var(--hxs-primary-hover, #0f0f10)) !important;
          color: #fff !important;
          border-radius: 0 !important;
          padding: 4px 8px !important;
          gap: 6px !important;
          box-shadow: 0 2px 6px rgba(0,0,0,.35) !important;
          position: fixed !important;
          top: 0px !important;
          right: 0px !important;
          left: auto !important;
          bottom: auto !important;
          z-index: 10000 !important;
          display: inline-flex !important;
          align-items: center !important;
          transition: transform .25s ease !important;
        }
        /* Kapalıyken sağa doğru kaydırarak yok et */
        .game-view > .buttons.hxs-collapsed{ transform: translateX(calc(100% + 18px)) !important; }
        /* Çocukları sadeleştir (keskin köşe) */
        .game-view > .buttons > *,
        .game-view > .buttons button,
        .game-view > .buttons a{
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          color: #e5e7eb !important;
          border-radius: 0 !important;
          padding: 4px 8px !important;
        }
        /* Ses butonu: tek buton görünsün, boyut metin butonlarıyla aynı olsun */
        .game-view > .buttons .sound-button-container{ display:inline-flex; align-items:center; }
        .game-view > .buttons .sound-button-container .button{ display:inline-flex !important; align-items:center; justify-content:center; height:24px; line-height:24px; padding:0 10px !important; font-size:14px !important; }
        .game-view > .buttons .sound-button-container .button + .button{ display:none !important; }
        .game-view > .buttons .sound-button-container .button i,
        .game-view > .buttons .sound-button-container .button svg{
          width:16px; height:16px; font-size:16px; line-height:16px;
        }
        .game-view > .buttons > *:hover,
        .game-view > .buttons button:hover,
        .game-view > .buttons a:hover{
          background: rgba(255,255,255,.08) !important;
          color: #fff !important;
        }
        /* Ses butonu kapsayıcısı vb. */
        .sound-button-container > *{ background: transparent !important; border-radius: 0 !important; }

        /* Hide/Show arrow controls */
        #hxs-controls-hide{
          position:absolute; left:-22px; top:50%; transform: translateY(-50%); z-index:10001;
          display:inline-flex; align-items:center; justify-content:center;
          width:22px; height:24px; padding:0; margin:0;
          background: transparent; color:#fff; border:none; border-radius:0; cursor:pointer;
          font-size:16px; line-height:24px;
        }
        #hxs-controls-hide:hover{ color:#fff; filter:brightness(1.2); }
        #hxs-controls-show{
          position: fixed; top: 0px; right: 0px; z-index: 10002;
          display:none; align-items:center; justify-content:center;
          height:24px; padding:0 8px; background: transparent; color:#fff;
          border:none; border-radius:0; cursor:pointer; font-size:16px; line-height:24px;
        }
        #hxs-controls-show:hover{ filter: brightness(1.2); }
      `;

      // Chat toggle button: add if not exists
      (function ensureChatToggle(){
        const bar = doc.querySelector('.game-view > .buttons');
        if(!bar) { setTimeout(ensureChatToggle, 400); return; }
        if(doc.getElementById('hxs-chat-toggle')) return;
        const btn = doc.createElement('button');
        btn.id = 'hxs-chat-toggle';
        btn.className = 'button';
        btn.textContent = 'Gizle';
        btn.style.marginLeft = '6px';
        const getState = ()=>{ try{ return localStorage.getItem('hxs_chat_hidden') === '1'; }catch(_){ return false; } };
        const setState = (v)=>{ try{ localStorage.setItem('hxs_chat_hidden', v?'1':'0'); }catch(_){ } };
        const updateLabel = ()=>{ btn.textContent = getState()? 'Göster' : 'Gizle'; };
        updateLabel();
        btn.addEventListener('click', ()=>{
          try{
            const t = doc.getElementById('toggleChat');
            t?.dispatchEvent(new MouseEvent('click', { bubbles:true, cancelable:true }));
          }catch(_){ }
          setState(!getState());
          updateLabel();
        });
        // Add near first button
        bar.appendChild(btn);
      })();

      // Bar hide/show arrows
      (function ensureBarToggle(){
        const bar = doc.querySelector('.game-view > .buttons');
        if(!bar){ setTimeout(ensureBarToggle, 400); return; }

        let hideBtn = doc.getElementById('hxs-controls-hide');
        if(!hideBtn){
          hideBtn = doc.createElement('button');
          hideBtn.id = 'hxs-controls-hide';
          hideBtn.textContent = '>';
          hideBtn.title = 'Paneli gizle';
          // Panelin solunda, panele dahil değilmiş gibi görünsün
          bar.appendChild(hideBtn);
        }

        let showBtn = doc.getElementById('hxs-controls-show');
        if(!showBtn){
          showBtn = doc.createElement('button');
          showBtn.id = 'hxs-controls-show';
          showBtn.textContent = '<';
          showBtn.title = 'Paneli göster';
          (doc.body||doc.documentElement).appendChild(showBtn);
        }

        const collapse = ()=>{
          bar.classList.add('hxs-collapsed');
          hideBtn.style.display = 'none';
          // Place show button vertically centered to the bar
          try{
            const rect = bar.getBoundingClientRect();
            const y = Math.max(0, Math.round(rect.top + rect.height/2 - 12));
            showBtn.style.top = y + 'px';
          }catch(_){ showBtn.style.top = '0px'; }
          showBtn.style.display = 'inline-flex';
        };
        const expand = ()=>{
          bar.classList.remove('hxs-collapsed');
          hideBtn.style.display = 'inline-flex';
          showBtn.style.display = 'none';
        };

        hideBtn.onclick = collapse;
        showBtn.onclick = expand;

        // initialize state open
        expand();
        // keep show button centered on resize while collapsed
        (doc.defaultView||doc.parentWindow).addEventListener('resize', ()=>{
          if(bar.classList.contains('hxs-collapsed')){
            try{
              const rect = bar.getBoundingClientRect();
              const y = Math.max(0, Math.round(rect.top + rect.height/2 - 12));
              showBtn.style.top = y + 'px';
            }catch(_){ }
          }
        });
      })();
    }catch(_){ }
  }
  function disable(){
    try{
      const frame = document.getElementsByClassName("gameframe")[0];
      const doc = frame?.contentDocument; if(!doc) return;
      // Remove overlay CSS and arrow controls completely
      doc.getElementById("hxs-controls-bar")?.remove();
      doc.getElementById("hxs-controls-hide")?.remove();
      doc.getElementById("hxs-controls-show")?.remove();
      // Reset collapsed class if any
      try{ doc.querySelector('.game-view > .buttons')?.classList?.remove('hxs-collapsed'); }catch(_){ }

      // Ensure chat toggle exists also in Glass UI (without overlay)
      (function ensureChatToggleGlass(){
        const bar = doc.querySelector('.game-view > .buttons');
        if(!bar){ setTimeout(ensureChatToggleGlass, 400); return; }
        if(doc.getElementById('hxs-chat-toggle')) return;
        const btn = doc.createElement('button');
        btn.id = 'hxs-chat-toggle';
        btn.className = 'button';
        const getState = ()=>{ try{ return localStorage.getItem('hxs_chat_hidden') === '1'; }catch(_){ return false; } };
        const setState = (v)=>{ try{ localStorage.setItem('hxs_chat_hidden', v?'1':'0'); }catch(_){ } };
        const updateLabel = ()=>{ btn.textContent = getState()? 'Göster' : 'Gizle'; };
        updateLabel();
        btn.addEventListener('click', ()=>{
          try{ doc.getElementById('toggleChat')?.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true})); }catch(_){ }
          setState(!getState());
          updateLabel();
        });
        bar.appendChild(btn);
      })();
      (function ensureGlassPanelToggle(){
        const bar = doc.querySelector('.game-view > .buttons');
        if(!bar){ setTimeout(ensureGlassPanelToggle, 400); return; }

        if(!bar.dataset.hxsGlassPos){
          try{
            const cs = (doc.defaultView||doc.parentWindow).getComputedStyle(bar);
            if(cs.position === 'static'){ bar.style.position = 'relative'; }
          }catch(_){ bar.style.position = 'relative'; }
          bar.dataset.hxsGlassPos = '1';
        }

        let hideBtn = doc.getElementById('hxs-glass-toggle-hide');
        if(!hideBtn){
          hideBtn = doc.createElement('button');
          hideBtn.id = 'hxs-glass-toggle-hide';
          hideBtn.className = 'button';
          hideBtn.textContent = '>';
          hideBtn.title = 'Paneli gizle';
          Object.assign(hideBtn.style, {
            position: 'absolute',
            left: '-22px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '22px',
            height: '24px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            color: '#fff',
            border: 'none',
            borderRadius: '0',
            cursor: 'pointer',
            fontSize: '16px',
            lineHeight: '24px',
            padding: '0',
            opacity: '0.85'
          });
          hideBtn.addEventListener('mouseenter', ()=>{ hideBtn.style.opacity = '1'; });
          hideBtn.addEventListener('mouseleave', ()=>{ hideBtn.style.opacity = '0.85'; });
          bar.appendChild(hideBtn);
        }

        let showBtn = doc.getElementById('hxs-glass-toggle-show');
        if(!showBtn){
          showBtn = doc.createElement('button');
          showBtn.id = 'hxs-glass-toggle-show';
          showBtn.className = 'button';
          showBtn.textContent = '<';
          showBtn.title = 'Paneli goster';
          Object.assign(showBtn.style, {
            position: 'fixed',
            top: '8px',
            right: '8px',
            width: '22px',
            height: '24px',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            color: '#fff',
            border: 'none',
            borderRadius: '0',
            cursor: 'pointer',
            fontSize: '16px',
            lineHeight: '24px',
            padding: '0',
            opacity: '0.85',
            zIndex: '99999'
          });
          showBtn.addEventListener('mouseenter', ()=>{ showBtn.style.opacity = '1'; });
          showBtn.addEventListener('mouseleave', ()=>{ showBtn.style.opacity = '0.85'; });
          (doc.body||doc.documentElement).appendChild(showBtn);
        }

        const updateShowPosition = ()=>{
          try{
            const rect = bar.getBoundingClientRect();
            const top = Math.max(0, Math.round(rect.top + rect.height/2 - 12));
            showBtn.style.top = top + 'px';
          }catch(_){ showBtn.style.top = '8px'; }
        };

        const collapse = ()=>{
          try{
            if(bar.getAttribute('data-hxs-glass-collapsed') === '1') return;
            updateShowPosition();
            bar.setAttribute('data-hxs-glass-prev-display', bar.style.display || '');
            bar.setAttribute('data-hxs-glass-collapsed','1');
            bar.style.display = 'none';
            hideBtn.style.display = 'none';
            showBtn.style.display = 'inline-flex';
          }catch(_){ }
        };

        const expand = ()=>{
          try{
            bar.setAttribute('data-hxs-glass-collapsed','0');
            const prev = bar.getAttribute('data-hxs-glass-prev-display');
            bar.style.display = prev && prev !== 'none' ? prev : '';
            bar.removeAttribute('data-hxs-glass-prev-display');
            hideBtn.style.display = 'inline-flex';
            showBtn.style.display = 'none';
          }catch(_){ }
        };

        hideBtn.onclick = collapse;
        showBtn.onclick = expand;

        if(bar.getAttribute('data-hxs-glass-collapsed') === '1'){
          collapse();
        }else{
          expand();
        }

        if(!doc.__hxsGlassToggleResize){
          doc.__hxsGlassToggleResize = true;
          (doc.defaultView||doc.parentWindow).addEventListener('resize', ()=>{
            try{
              if(bar.getAttribute('data-hxs-glass-collapsed') === '1'){
                updateShowPosition();
              }
            }catch(_){ }
          });
        }
      })();
    }catch(_){ }
  }
  window.hxsControlsBarEnable = enable;
  window.hxsControlsBarDisable = disable;
})();
