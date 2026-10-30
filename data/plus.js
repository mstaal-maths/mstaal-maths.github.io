/* =====================================================================
   Laats — fonctions ajoutées
   · lecture à voix haute (les maths sont lues comme on les dit)
   · sommaire cliquable, chapitre précédent / suivant, « reprendre là où j'en étais »
   · onglet « En un coup d'œil » (un grand schéma, seulement pour certains chapitres)
   · méthodes et calculs « pas à pas »
   · défi du jour, espace « Objectif brevet », page parents
   · fonctionnement sans connexion (site public)
   ===================================================================== */
(function(){
const $ = (s, r=document) => r.querySelector(s), $$ = (s, r=document) => [...r.querySelectorAll(s)];
const jg = (k, d) => { try{ const v=store.get(k); return v==null ? d : JSON.parse(v); }catch(e){ return d; } };
const js = (k, v) => store.set(k, JSON.stringify(v));
const app = () => document.getElementById("app");
const today = () => { const d=new Date(); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); };
const yesterday = () => { const d=new Date(Date.now()-86400000); return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); };
const strip = h => { const t=document.createElement("div"); t.innerHTML=fmt(h); t.querySelectorAll(".fr").forEach(f=>{ if(f.children.length===2) f.textContent=f.children[0].textContent+"/"+f.children[1].textContent; }); t.querySelectorAll("svg").forEach(s=>s.remove()); return t.textContent.replace(/\s+/g," ").trim(); };
const norm = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[’']/g," ").replace(/[^a-z0-9²³ ]+/g," ").replace(/\s+/g," ").trim();
const ROMAN = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];

/* ---------------------------------------------------------------------
   Styles
--------------------------------------------------------------------- */
const css = document.createElement("style");
css.textContent = `
.tts-btn{display:inline-flex;align-items:center;gap:6px;border-radius:999px;border:2px solid var(--c,var(--ink));background:color-mix(in srgb,var(--c,#1b2a44) 12%,var(--surface));color:var(--ink);font:inherit;font-size:14.5px;font-weight:700;line-height:1;cursor:pointer;vertical-align:middle;margin-left:10px;flex:none;padding:6px 12px;white-space:nowrap;letter-spacing:0}
.ttsbar{margin:0 0 14px}.ttsbar .tts-btn{margin:0;font-size:16px;padding:10px 16px}
.tts-btn:hover{background:color-mix(in srgb,var(--c,#1b2a44) 22%,var(--surface))}
.tts-btn.on{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.tts-btn.tts-corner{float:right;margin:0 0 6px 10px}
.tts-hl{background:color-mix(in srgb,#ffd84d 45%,transparent)!important;border-radius:6px;box-shadow:0 0 0 3px color-mix(in srgb,#ffd84d 45%,transparent)}
.toc{display:grid;gap:8px}
.toc h3{margin:0}
.toc ol{margin:0;padding:0;list-style:none;display:grid;gap:6px}
.toc button{font:inherit;text-align:left;background:none;border:0;padding:6px 8px;border-radius:8px;cursor:pointer;color:var(--ink);width:100%;display:flex;gap:10px;align-items:baseline}
.toc button:hover{background:color-mix(in srgb,var(--c,#888) 10%,transparent)}
.toc .tk{font-weight:700;color:var(--c);min-width:2.2em}
.totoc{display:block;margin:12px 0 0;font:inherit;font-size:14px;color:var(--muted);background:none;border:0;padding:0;cursor:pointer;text-decoration:underline}
.chnav{display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;margin:28px 0 0}
.chnav a{flex:1 1 240px;display:grid;gap:2px;padding:14px 16px;border:2px solid var(--line);border-radius:14px;background:var(--surface);color:var(--ink);text-decoration:none}
.chnav a:hover{border-color:var(--c)}
.chnav small{color:var(--muted);font-size:14px}
.chnav .nx{text-align:right}
.resume{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:999px;background:var(--ink);color:var(--paper);font-weight:700;font-size:16px;text-decoration:none;margin:0 0 26px;box-shadow:0 3px 0 color-mix(in srgb,var(--ink) 35%,transparent)}
.resume:hover{transform:translateY(-1px)}.resume:focus-visible{outline:3px solid #ffd84d;outline-offset:2px}

.qsearch{margin:0 0 26px;position:relative}
.qsearch label{display:block;font-weight:700;margin:0 0 6px}
.qsearch input{width:100%;box-sizing:border-box;font:inherit;font-size:17px;padding:12px 14px;border:2px solid var(--line);border-radius:12px;background:var(--surface);color:var(--ink)}
.qsearch input:focus{outline:none;border-color:var(--c,var(--ink))}
.qres{display:grid;gap:8px;margin:10px 0 0}
.qres a{display:block;padding:10px 12px;border:2px solid var(--line);border-radius:12px;background:var(--surface);color:var(--ink);text-decoration:none}
.qres a:hover{border-color:var(--c,var(--ink))}
.qres small{color:var(--muted);display:block;font-size:13.5px}
.qres .none{color:var(--muted)}
.extras{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px;margin:0 0 28px}
.xcard{display:grid;gap:6px;align-content:start;padding:16px 18px;border-radius:16px;border:2px solid var(--line);background:var(--surface);color:var(--ink);text-decoration:none}
.xcard:hover{border-color:var(--c,var(--ink))}
.xcard b{font-size:1.1rem}
.xcard span{color:var(--muted);font-size:15px;line-height:1.45}
.flash{font-weight:700;color:var(--c,var(--ink))}
.runner .qhead{margin-bottom:6px}
.score{font-size:1.3rem;font-weight:700}
.bigscore{font-family:var(--f-display);font-size:2.4rem;margin:4px 0}
.sumgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;margin:6px 0 0}
.sumgrid .schema{background:var(--paper)}
.pctools{display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center}
.pc-hide .retenir > *:not(.tts-btn){filter:blur(7px);user-select:none;transition:filter .2s}
.pc-hide .retenir{cursor:pointer}
.pc-hide .retenir.shown > *{filter:none}
.stepw{position:relative}
.stepbtn{font:inherit;font-size:14px;font-weight:600;padding:5px 10px;border-radius:999px;border:2px solid var(--line);background:var(--surface);color:var(--ink);cursor:pointer;margin:6px 6px 0 0}
.stepbtn.go{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.stepbar{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:4px 0 8px}
.stepbar small{color:var(--muted)}
.st-hide{display:none!important}
.st-new{animation:stnew .6s ease-out}
@keyframes stnew{from{background:color-mix(in srgb,#ffd84d 60%,transparent)}to{background:transparent}}
.bbox h3{margin:0 0 4px}
.bblist{display:grid;gap:10px}
.parents p,.parents li{line-height:1.65}
.sheet .retenir:has(> ul:first-child)::before,.sheet .retenir:has(> ol:first-child)::before{float:none;display:block;margin:0 0 2px}
.sh-sum{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:6px 0 12px}
.sh-sch{border:1px solid #333;padding:6px 8px;break-inside:avoid;font-size:10.5pt}
.sh-sch .sch{gap:6px}.sh-sch .schT{color:#000;font-weight:700}.sh-sch svg,.sh-sch img{max-width:100%;height:auto}
@media print{.tts-btn,.stepbar,.toc,.totoc,.chnav,.pctools{display:none!important}.st-hide{display:block!important}}
@media (max-width:560px){
  .tabs{flex-wrap:nowrap!important;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}
  .tabs::-webkit-scrollbar{display:none}
  .tab{white-space:nowrap;flex:none}
}
`;
document.head.appendChild(css);

/* =====================================================================
   1. LECTURE À VOIX HAUTE
===================================================================== */
const TTS_OK = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
const T = {btn:null, hl:null, voice:null};
const rate = () => +(store.get("ttsrate") || 0.9);
/* les voix « naturelles » (Edge, Chrome, Safari) passent avant les voix robotiques */
const frVoices = () => TTS_OK ? speechSynthesis.getVoices().filter(v=>/^fr/i.test(v.lang)) : [];
const vScore = v => { const n=v.name; let s=0;
  if(/natural|neural|naturel/i.test(n)) s+=100; if(/premium|enhanced|améliorée|amélioré/i.test(n)) s+=80; if(/online/i.test(n)) s+=40; if(/google/i.test(n)) s+=50;
  if(/Denise|Henri|Eloise|Vivienne|Remy|Rémy|Audrey|Amélie|Thomas|Marie|Aurélie/i.test(n)) s+=20;
  if(/espeak|compact|Hortense|Julie|Nicolas|Jacques|Grandpa|Grandma|Eddy|Flo|Reed|Rocko|Sandy|Shelley/i.test(n)) s-=60;
  if(/fr[-_]FR/i.test(v.lang)) s+=10; return s; };
function pickVoice(){
  const vs=frVoices(); if(!vs.length) return null;
  const paul=vs.find(v=>/\bPaul\b/i.test(v.name)); if(paul) return paul;   /* voix choisie par M. Staal */
  return vs.slice().sort((a,b)=>vScore(b)-vScore(a))[0];
}
if(TTS_OK){ T.voice=pickVoice(); speechSynthesis.addEventListener("voiceschanged", ()=>{ T.voice=pickVoice(); if(window.__fillVoices) __fillVoices(); }); }

/* texte d'un élément, avec les maths écrites comme on les lit */
function spoken(node){
  if(node.nodeType===3) return node.nodeValue;
  if(node.nodeType!==1) return "";
  const el=node, tag=el.tagName.toUpperCase();
  if(["SVG","BUTTON","SCRIPT","STYLE","SELECT","TEXTAREA","CANVAS","IMG"].includes(tag) || el.classList.contains("tts-btn") || el.classList.contains("stepbar")) return " ";
  if(tag==="INPUT") return " … ";
  if(el.classList.contains("fr") && el.children.length===2){ const a=spoken(el.children[0]).trim(), b=spoken(el.children[1]).trim(), cx=x=>/[\s×+−\-÷]/.test(x.replace(/^[−-]\s*/,"")), W={2:"demi",3:"tiers",4:"quart",5:"cinquième",6:"sixième",7:"septième",8:"huitième",9:"neuvième",10:"dixième"};
    if(/^\d+$/.test(a) && W[b] && +a<20) return ` ${a==="1"?"un":a} ${W[b]}${a!=="1"&&b!=="3"?"s":""} `;
    return cx(a)||cx(b) ? ` la fraction de numérateur ${a}, et de dénominateur ${b}, ` : ` ${a} sur ${b} `; }
  if(el.classList.contains("ang")){ const L=el.textContent.trim().split("").join(" "), pv=el.previousSibling; return /angles?\s*$/i.test(pv&&pv.nodeType===3?pv.nodeValue:"") ? ` ${L} ` : ` l'angle ${L} `; }
  if(el.classList.contains("k")){ const t=el.textContent.trim(), r=ROMAN.indexOf(t); return r>=0 ? ` Partie ${r+1}. ` : /^\d+$/.test(t) ? ` ${t}. ` : " "; }
  if(tag==="SUP"){ const t=el.textContent.trim(); if(t==="2") return " au carré "; if(t==="3") return " au cube "; if(/^(e|ème|er|re|ère|nd|nde)$/.test(t)) return t==="er"?"er ":t==="re"||t==="ère"?"ère ":"ème "; return ` puissance ${[...el.childNodes].map(spoken).join("")} `; }
  if(tag==="SUB") return " "+el.textContent+" ";
  if(tag==="BR" || el.classList.contains("stl")) return tag==="BR" ? ". " : " "+[...el.childNodes].map(spoken).join("")+". ";
  let s=[...el.childNodes].map(spoken).join("");
  if(["TD","TH"].includes(tag)) s+=" ; ";
  if(["P","LI","TR","DIV","H2","H3","H4","FIGCAPTION"].includes(tag)) s=" "+s+". ";
  return s;
}
function lisible(t){
  t=" "+t.replace(/[    ]/g," ")+" ";
  t=t.replace(/(\d) (?=\d{3}(?!\d))/g,"$1").replace(/(\d) (?=\d{3}(?!\d))/g,"$1");
  t=t.replace(/\[\s*([A-Z])'?\s*([A-Z])'?\s*\]/g," le segment $1 $2 ").replace(/\[\s*([A-Z])\s*([A-Z])\s*\)/g," la demi-droite $1 $2 ").replace(/\(\s*([A-Z])'?\s*([A-Z])'?\s*\)/g," la droite $1 $2 ").replace(/\(\s*(d\d?|d['′]?)\s*\)/g," la droite $1 ");
  t=t.replace(/\b([A-Z])\s*\(\s*([^();]{1,14});\s*([^();]{1,14})\)/g," $1 de coordonnées $2 ; $3 ");
  t=t.replace(/\b([fghkpuv])\s*\(\s*([^()]{1,12}?)\s*\)/g,(m,f,a)=>/^[\s\d,.a-z−+×\-]+$/.test(a) && !/[a-z]{2}/.test(a) ? `${f} de ${a}` : m);
  t=t.replace(/\(\s*(d\d?|m|Δ|d['′])\s*\)/g," la droite $1 ");
  t=t.replace(/\b([A-Za-z])(''|′′|″)/g,"$1 seconde").replace(/\b([A-Z]|d)['′](?![a-zàâäéèêëîïôöûùüç])/g,"$1 prime");
  t=t.replace(/\b([A-Z])([A-Z])([A-Z])?([A-Z])?\b/g,(m,a,b,c,d)=>/^(QCM|PDF|DYS|TP|ATTENTION|IMPORTANT)$/.test(m)?m:[a,b,c,d].filter(Boolean).join(" "));
  t=t.replace(/\s*\/\/\s*/g," est parallèle à ").replace(/⊥/g," est perpendiculaire à ");
  t=t.replace(/√\s*/g," racine carrée de ");
  t=t.replace(/(\d)\s*\/\s*(\d)/g,"$1 sur $2");
  t=t.replace(/\b(k?m|cm|mm|dm|hm|dam)²/g,"$1 carrés").replace(/\b(k?m|cm|mm|dm|hm|dam)³/g,"$1 cubes").replace(/²/g," au carré ").replace(/³/g," au cube ");
  t=t.replace(/×/g," fois ").replace(/÷/g," divisé par ").replace(/≠/g," est différent de ").replace(/≈/g," environ ").replace(/≤/g," inférieur ou égal à ").replace(/≥/g," supérieur ou égal à ");
  t=t.replace(/\s<\s/g," est inférieur à ").replace(/\s>\s/g," est supérieur à ");
  t=t.replace(/(^|[\s.;:])[–-]\s+(?=[a-zà-ü]{2})/g,"$1 ");
  t=t.replace(/(^|[\s(=;:])[−–-]\s*(?=[\d(]|[a-zA-Z](?![a-zà-ü]))/g,"$1 moins ").replace(/\s[−–]\s/g," moins ").replace(/(\d)\s*-\s*(\d)/g,"$1 moins $2");
  t=t.replace(/\s*=\s*/g," égale ").replace(/\s*\+\s*/g," plus ");
  t=t.replace(/↦/g," associe ").replace(/⟼/g," associe ").replace(/°/g," degrés ").replace(/%/g," pour cent ").replace(/π/g," pi ").replace(/∈/g," appartient à ");
  t=t.replace(/…+|\.{3,}/g," … ").replace(/[⚑👉✓✗→←↻↺▶■●○◆★☆🔊⏹]/g," ").replace(/\s*;\s*\./g,".").replace(/\s+([.,;:!?])/g,"$1");
  t=t.replace(/\bde\s+le\s+/g,"du ").replace(/\bà\s+le\s+/g,"au ").replace(/\bde\s+les\s+/g,"des ").replace(/\bà\s+les\s+/g,"aux ");
  return t.replace(/\s+/g," ").replace(/:\s*\./g,":").replace(/,\s*\./g,".").replace(/(\.\s*){2,}/g,". ").trim();
}
const BLOCKS = "h2,h3,h4,p,li,tr,figcaption,.retenir,.choice,.attention,.calc,.schT,.schN";
function units(root, opt={}){
  const inCorr = !!root.closest("details,[data-corr]") || root.matches(".corr,[data-corr]");
  let c=$$(BLOCKS, root); if(root.matches(BLOCKS)) c.unshift(root);
  c=c.filter(e=>!e.closest("svg,.toc,.ttsbar,.printbar,.anim") && !e.closest(".tts-btn") && !(e.closest("details:not([open])") && !inCorr) && !(!inCorr && e.closest("details,[data-corr]")) && e.offsetParent!==null);
  /* on garde les blocs « feuilles » ; un encadré est lu par son titre, puis par son contenu */
  const out=[];
  c.forEach(e=>{
    if(e.matches(".retenir")){ const l=e.dataset.l||"À retenir"; out.push({el:e, text:l+" :"}); return; }
    if($$(BLOCKS, e).some(x=>c.includes(x))) { if(e.matches(".choice")) return; /* conteneur : on lit ses enfants */
      const own=[...e.childNodes].filter(n=>n.nodeType===3 || (n.nodeType===1 && !n.matches(BLOCKS) && !$$(BLOCKS,n).length)).map(spoken).join("").trim();
      if(own) out.push({el:e, text:own}); return; }
    let txt=spoken(e);
    if(e.matches(".choice")){ const i=$$(".choice", e.parentNode).indexOf(e); txt=`Réponse ${i+1} : `+[...e.childNodes].map(spoken).join(""); }
    out.push({el:e, text:txt});
  });
  return out;
}
function ttsStop(){
  const b=T.btn; T.btn=null; if(TTS_OK) try{ speechSynthesis.cancel(); }catch(e){}
  if(T.hl) T.hl.classList.remove("tts-hl"); T.hl=null;
  if(b){ b.classList.remove("on"); b.textContent=b.dataset.lab; }
}
function ttsPlay(btn, root){
  if(T.btn===btn){ ttsStop(); return; }
  if(!TTS_OK){ btn.textContent="🔇 Lecture impossible sur ce navigateur"; setTimeout(()=>btn.textContent=btn.dataset.lab, 4000); return; }
  ttsStop(); const U=units(root); if(!U.length) return;
  T.btn=btn; btn.classList.add("on"); btn.textContent="⏹ Arrêter";
  let i=0;
  const next=()=>{ if(T.btn!==btn) return; if(T.hl) T.hl.classList.remove("tts-hl"); T.hl=null;
    if(i>=U.length){ ttsStop(); return; }
    const u=U[i++], text=lisible(u.text); if(!text || !/[a-z0-9]/i.test(text)){ next(); return; }
    T.hl=u.el; u.el.classList.add("tts-hl");
    const r=u.el.getBoundingClientRect(); if(r.top<70 || r.bottom>innerHeight-20) u.el.scrollIntoView({block:"center", behavior:"smooth"});
    const ut=new SpeechSynthesisUtterance(text); ut.lang="fr-FR"; if(T.voice) ut.voice=T.voice; ut.rate=rate();
    ut.onend=()=>setTimeout(next,120); ut.onerror=()=>setTimeout(next,60);
    speechSynthesis.speak(ut); };
  setTimeout(next, 80);
}
function addTTS(anchor, root, how, lab){
  if(!anchor || anchor.querySelector(":scope > .tts-btn")) return;
  const b=document.createElement("button"); b.type="button"; b.className="tts-btn"+(how==="corner"?" tts-corner":""); b.dataset.lab=lab||"🔊 Écouter"; b.textContent=b.dataset.lab; b.title="Lecture à voix haute";
  b.onclick=e=>{ e.preventDefault(); e.stopPropagation(); ttsPlay(b, typeof root==="function"?root():root); };
  if(how==="corner"||how==="first") anchor.insertBefore(b, anchor.firstChild); else if(how==="before") anchor.parentNode.insertBefore(b, anchor); else anchor.appendChild(b);
}
function decorate(){
  const A=app(); if(!A) return;
  $$("article.card.cours > h3, .card.savoir > h3, .toc > h3", A).forEach(h=>{ if(!h.closest(".toc")) addTTS(h, h.parentNode); });
  $$("article.card.ex", A).forEach(a=>{ const h=$(":scope > .t h3", a) || $(":scope > .band > span", a); if(h) addTTS(h, a); });
  $$("details > .corr, [data-corr]", A).forEach(c=>addTTS(c, c, "corner"));
  $$(".card.evhead > h3, .card.bbox > h3, .parents h2", A).forEach(h=>addTTS(h, h.parentNode));
  $$(".sumgrid .schema", A).forEach(s=>addTTS(s, s, "corner"));
  /* consignes des séances informatiques */
  $$("#scons,#gcons,#rcons,#mcons,.scons,.gcons,.rcons,.mcons,.tconsigne,.lconsigne,.cconsigne", A).forEach(c=>addTTS(c, c, "corner"));
  steps(A);
}
let decoT=0; new MutationObserver(()=>{ clearTimeout(decoT); decoT=setTimeout(decorate, 120); }).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener("hashchange", ttsStop);
window.STAAL_tts={spoken, lisible, units, stop:ttsStop};

/* bouton clair / sombre à côté de « Mode DYS » (clair par défaut) */
(function(){ const dys=document.getElementById("dysbtn"); if(!dys) return;
  const b=document.createElement("button"); b.className="tool"; b.id="themebtn"; b.type="button"; dys.after(b);
  const apply=()=>{ const t=store.get("theme")==="dark"?"dark":"light"; document.documentElement.setAttribute("data-theme", t);
    b.textContent = t==="dark" ? "☀️ Mode clair" : "🌙 Mode sombre"; b.setAttribute("aria-label", t==="dark"?"Passer en mode clair":"Passer en mode sombre"); };
  b.onclick=()=>{ store.set("theme", store.get("theme")==="dark"?"light":"dark"); apply(); };
  apply();
})();

/* réglage de la vitesse dans « Personnaliser » */
(function(){ const p=document.getElementById("aff"); if(!p || !TTS_OK) return;
  const say=t=>{ ttsStop(); speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(t); u.lang="fr-FR"; if(T.voice) u.voice=T.voice; u.rate=rate(); speechSynthesis.speak(u); };
  const row=document.createElement("div"); row.className="affrow";
  row.innerHTML=`<span>Vitesse de lecture 🔊</span><div class="seg" id="ttsseg"><button data-v="0.75">Lente</button><button data-v="0.9">Normale</button><button data-v="1.1">Rapide</button></div>`;
  const row2=document.createElement("div"); row2.className="affrow";
  row2.innerHTML=`<span>Voix de lecture</span><div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><select id="ttsvoice" style="font:inherit;font-size:15px;padding:6px 8px;border-radius:10px;border:2px solid var(--line);background:var(--surface);color:var(--ink);max-width:260px"></select><button class="btn" type="button" id="ttstry">▶ Essayer</button></div>`;
  const last=p.querySelector("p.where:last-of-type"); p.insertBefore(row, last);
  const mark=()=>row.querySelectorAll("button").forEach(b=>b.setAttribute("aria-pressed", String(+b.dataset.v===rate())));
  row.querySelectorAll("button").forEach(b=>b.onclick=()=>{ store.set("ttsrate", b.dataset.v); mark(); say("Voici la vitesse de lecture."); });
  const sel=row2.querySelector("select");
  window.__fillVoices=()=>{ const vs=frVoices().sort((a,b)=>vScore(b)-vScore(a)); if(!vs.length){ sel.innerHTML=`<option>Voix de l'appareil</option>`; return; }
    sel.innerHTML=vs.map(v=>`<option value="${esc(v.name)}">${esc(v.name.replace(/^Microsoft\s+/,"").replace(/\s*-\s*French.*$/i,"").replace(/\s*\(.*?\)\s*$/,"")+(vScore(v)>=90?" ★":""))}</option>`).join("");
    if(T.voice) sel.value=T.voice.name; };
  sel.onchange=()=>{ store.set("ttsvoice", sel.value); T.voice=pickVoice(); say("Bonjour, je vais te lire le cours."); };
  row2.querySelector("#ttstry").onclick=()=>say("Bonjour, je vais te lire le cours. La médiatrice d'un segment est la droite perpendiculaire à ce segment qui passe par son milieu.");
  __fillVoices(); mark();
})();

/* =====================================================================
   2. MÉTHODES ET CALCULS PAS À PAS
   Un calcul de 3 lignes ou plus, une méthode en plusieurs étapes : on peut les dévoiler une étape à la fois.
===================================================================== */
function steps(A){
  const cands=[];
  $$(".retenir", A).forEach(b=>{ if(/m[ée]thode|comment faire|[ée]tapes|r[ée]daction|pour justifier/i.test(b.dataset.l||"")) cands.push(b); });
  $$("p.calc", A).forEach(p=>{ if(!p.closest(".retenir") || !cands.includes(p.closest(".retenir"))) cands.push(p); });
  cands.forEach(el=>{
    if(el.dataset.steps || el.closest(".sheet,.schema,.qzone,.fb,#quiz .fb")) return;
    let items;
    if(el.matches("p.calc")){
      const brs=el.querySelectorAll("br"); if(brs.length<2 || el.querySelectorAll(":scope > br").length!==brs.length){ el.dataset.steps=1; return; }
      const parts=el.innerHTML.split(/<br\s*\/?>/i); if(parts.length<3){ el.dataset.steps=1; return; }
      /* hors des corrections : seulement une suite de calculs (« A = … » répété), pas une liste de calculs à faire */
      if(!el.closest(".corr,[data-corr],details")){ const tx=document.createElement("div"); const lefts=parts.map(x=>{ tx.innerHTML=x; const t=tx.textContent.replace(/\s+/g,""); const i=t.indexOf("="); return i<0?null:t.slice(0,i); });
        if(lefts.some(l=>l===null) || lefts.some(l=>l && l!==lefts[0])){ el.dataset.steps=1; return; } }
      el.innerHTML=parts.map(x=>`<span class="stl" style="display:block">${x}</span>`).join(""); items=$$(":scope > .stl", el);
    } else {
      items=[...el.children].filter(c=>!c.classList.contains("tts-btn") && !c.classList.contains("stepbar"));
      if(items.length===1 && /^(OL|UL)$/.test(items[0].tagName)) items=[...items[0].children];
      else if(items.length<3){ const li=$$("li", el); if(li.length>=2) items=li; }
      if(items.length<2) return;
    }
    el.dataset.steps=1;
    const bar=document.createElement("div"); bar.className="stepbar";
    bar.innerHTML=`<button type="button" class="stepbtn" data-a="start">▶ Pas à pas</button>`;
    /* calculs côte à côte (grille ou flex) : le bouton reste collé à son calcul, dans la même case */
    const pd=getComputedStyle(el.parentNode).display;
    if(/grid|flex/.test(pd)){ const w=document.createElement("div"); w.className="stepwrap"; el.parentNode.insertBefore(w, el); w.appendChild(bar); w.appendChild(el); }
    else el.parentNode.insertBefore(bar, el);
    let k=items.length;
    const draw=()=>{ items.forEach((it,i)=>it.classList.toggle("st-hide", i>=k));
      bar.innerHTML = k>=items.length ? `<button type="button" class="stepbtn" data-a="start">▶ Pas à pas</button>`
        : `<button type="button" class="stepbtn go" data-a="next">Étape suivante (${k+1} / ${items.length})</button><button type="button" class="stepbtn" data-a="all">Tout afficher</button>`; };
    bar.onclick=e=>{ const b=e.target.closest("button"); if(!b) return; const a=b.dataset.a;
      if(a==="start") k=1; else if(a==="next"){ k++; const it=items[k-1]; if(it){ it.classList.remove("st-new"); void it.offsetWidth; it.classList.add("st-new"); } } else k=items.length;
      draw(); };
  });
}

/* =====================================================================
   3. NAVIGATION : sommaire, chapitre précédent / suivant, reprise
===================================================================== */
function tocFor(panel, items, head, label){
  if(items.length<2) return;
  items.forEach((it,i)=>{ it.id = it.id || `sec-${i}`; });
  const nav=document.createElement("nav"); nav.className="card toc"; nav.setAttribute("aria-label","Sommaire");
  nav.innerHTML=`<h3>${label||"Sommaire"}</h3><ol>${items.map((it,i)=>{ const h=head(it).cloneNode(true); h.querySelectorAll(".tts-btn").forEach(x=>x.remove()); const k=h.querySelector(".k,span"); const kt=k?k.textContent:""; if(k) k.remove();
      return `<li><button type="button" data-i="${i}"><span class="tk">${esc(kt)}</span><span>${h.innerHTML}</span></button></li>`; }).join("")}</ol>`;
  const after=panel.querySelector(".card.savoir"); if(after) after.after(nav); else panel.prepend(nav);
  nav.querySelectorAll("button").forEach(b=>b.onclick=()=>{ const it=items[+b.dataset.i]; const y=it.getBoundingClientRect().top+scrollY-12; scrollTo({top:y, behavior:"smooth"}); });
  items.forEach(it=>{ const back=document.createElement("button"); back.type="button"; back.className="totoc"; back.textContent="↑ Revenir au sommaire"; back.onclick=()=>nav.scrollIntoView({behavior:"smooth", block:"start"}); it.appendChild(back); });
}
const _rc = window.renderCours;
const ttsAll = (panel, lab) => { const bar=document.createElement("div"); bar.className="ttsbar"; panel.prepend(bar); addTTS(bar, panel, "append", lab); };
window.renderCours = function(panel, D){ _rc(panel, D); tocFor(panel, $$(":scope > article.card.cours", panel), a=>a.querySelector("h3")); ttsAll(panel, "🔊 Écouter tout le cours"); };
const _rx = window.renderExos;
window.renderExos = function(panel, D){ _rx(panel, D); tocFor(panel, $$(":scope > section.exsec", panel), s=>s.querySelector("h2"), "Sommaire des exercices"); ttsAll(panel, "🔊 Écouter tous les énoncés"); };

/* Par cœur : définitions, propriétés, formules… (pas les méthodes ni les exemples) */
const PARCOEUR = l => { l=String(l||"À retenir"); if(/m[ée]thode|comment faire|r[ée]daction|justifier|exemple|remarque|interpr[ée]tation|pourquoi|[ée]tapes|aide|attention|^cours$/i.test(l)) return false; return true; };
function parCoeurBoxes(D){
  const tmp=document.createElement("div");
  return D.cours.map((s,i)=>{ tmp.innerHTML=fmt(s.h); const b=[...tmp.querySelectorAll(".retenir")].filter(x=>PARCOEUR(x.dataset.l)); return {k:s.k||ROMAN[i], t:s.t, html:b.map(x=>x.outerHTML).join("")}; }).filter(x=>x.html);
}
function schemasOf(D){ const seen=new Set(); return (D.quiz||[]).map(N=>N.schema).filter(s=>s && String(s).trim() && !seen.has(s) && seen.add(s)); }
window.renderEssentiel = function(panel, D){
  const k=Object.keys(CH).find(x=>CH[x]===D), h=(window.CARTES||{})[k];
  panel.innerHTML = h ? `<div class="card savoir"><h3>En un coup d'œil</h3><p class="where" style="margin-top:6px">Tout le chapitre résumé dans un seul schéma, à relire avant l'évaluation. Les explications et les exemples sont dans « Le cours ».</p></div><div class="cmap-scroll">${h}</div>` : `<div class="card"><p>Pas de schéma pour ce chapitre : relis « Le cours ».</p></div>`;
};
/* fiche PDF « En un coup d'œil » : le schéma seul, en A4 paysage */
window.parCoeurSheet = function(P){
  const k=Object.keys(CH).find(x=>CH[x]===P.D), h=(window.CARTES||{})[k]||"";
  return h;
};

/* chapitre : précédent / suivant, mémoire de la visite, ouverture d'un onglet demandé */
const _ch = window.chapitre;
window.chapitre = function(id, n){
  _ch(id, n);
  const C=CLASSES[id], key=id+"-"+n; if(!CH[key]) return;
  const vu=jg("vu",[]); if(!vu.includes(key)){ vu.push(key); js("vu", vu); }
  js("last", {id, n, t:"cours"});
  const prev=n>1 && CH[id+"-"+(n-1)] ? n-1 : null, next=CH[id+"-"+(n+1)] ? n+1 : null;
  if(prev||next) app().insertAdjacentHTML("beforeend", `<nav class="chnav" aria-label="Autres chapitres">${prev?`<a href="#${id}-ch${prev}"><small>← Chapitre précédent</small><b>${prev}. ${esc(C.chapitres[prev-1][0])}</b></a>`:"<span></span>"}${next?`<a class="nx" href="#${id}-ch${next}"><small>Chapitre suivant →</small><b>${next}. ${esc(C.chapitres[next-1][0])}</b></a>`:""}</nav>`);
  $$(".tab", app()).forEach(b=>b.addEventListener("click", ()=>{ js("last", {id, n, t:b.dataset.t}); b.scrollIntoView({block:"nearest", inline:"center"}); }));
  let want=null; try{ want=JSON.parse(sessionStorage.getItem("staal-open")||"null"); sessionStorage.removeItem("staal-open"); }catch(e){}
  if(want && want.k===key){ const tb=$(`.tab[data-t="${want.t}"]`, app()); if(tb){ tb.click(); }
    if(want.sec!=null) setTimeout(()=>{ const el=$(`#panel #sec-${want.sec}`) || $$("#panel article.card.cours")[want.sec]; if(el){ el.scrollIntoView({behavior:"smooth", block:"start"}); el.classList.add("tts-hl"); setTimeout(()=>el.classList.remove("tts-hl"), 2200); } }, 250); }
};
const openAt = (k, t, sec) => { try{ sessionStorage.setItem("staal-open", JSON.stringify({k, t, sec})); }catch(e){} };
window.STAAL_openAt = openAt;

/* =====================================================================
   4. RECHERCHE D'UNE NOTION
===================================================================== */
let IDX=null;
function buildIdx(){
  IDX=[]; const tmp=document.createElement("div");
  Object.keys(CLASSES).forEach(id=>CLASSES[id].chapitres.forEach(([t],i)=>{ const k=id+"-"+(i+1), D=CH[k]; if(!D) return;
    const base={id, n:i+1, k, ct:t};
    IDX.push({...base, w:6, kind:"Chapitre", txt:t, nt:norm(t)});
    (D.savoir||[]).forEach(s=>{ const x=strip(s); IDX.push({...base, w:2, kind:"Je dois savoir", txt:x, nt:norm(x)}); });
    D.cours.forEach((s,si)=>{ const x=strip(s.t); IDX.push({...base, w:4, kind:"Partie du cours", txt:x, nt:norm(x), sec:si});
      tmp.innerHTML=fmt(s.h); tmp.querySelectorAll(".retenir").forEach(b=>{ const x2=strip(b.innerHTML); IDX.push({...base, w:3, kind:b.dataset.l||"À retenir", txt:x2, nt:norm(x2), sec:si}); }); });
  }));
}
function search(q, prefer){
  if(!IDX) buildIdx(); const w=norm(q).split(" ").filter(x=>x.length>=2); if(!w.length) return [];
  const R=IDX.map(e=>{ if(!w.every(x=>e.nt.includes(x))) return null; let s=e.w; if(e.nt.startsWith(w[0])) s+=1; if(prefer && e.id===prefer) s+=3; if(e.txt.length<140) s+=1; return {e, s}; }).filter(Boolean).sort((a,b)=>b.s-a.s);
  const seen=new Set(), out=[]; for(const r of R){ const key=r.e.k+"|"+r.e.kind+"|"+r.e.txt.slice(0,60); if(seen.has(key)) continue; seen.add(key); out.push(r.e); if(out.length>=10) break; } return out;
}
function searchBox(prefer){
  const id="qs"+Math.random().toString(36).slice(2,7);
  setTimeout(()=>{ const inp=document.getElementById(id), res=document.getElementById(id+"r"); if(!inp) return; let t=0;
    inp.oninput=()=>{ clearTimeout(t); t=setTimeout(()=>{ const q=inp.value.trim(); if(q.length<2){ res.innerHTML=""; return; }
      const L=search(q, prefer); res.innerHTML = L.length ? L.map((e,j)=>`<a href="#${e.id}-ch${e.n}" data-j="${j}"><small>${CLASSES[e.id].nom} · Chapitre ${e.n} — ${esc(e.ct)}</small><b>${esc(e.kind)}</b> : ${esc(e.txt.length>170?e.txt.slice(0,167)+"…":e.txt)}</a>`).join("")
        : `<p class="none">Je n'ai rien trouvé. Essaie un autre mot (par exemple : « médiatrice », « fraction », « Pythagore »).</p>`;
      res.querySelectorAll("a").forEach(a=>a.onclick=()=>{ const e=L[+a.dataset.j]; openAt(e.k, "cours", e.sec!=null?e.sec:null); }); }, 160); }; }, 0);
  return `<div class="qsearch"><label for="${id}">🔍 Chercher une notion</label><input id="${id}" type="search" autocomplete="off" placeholder="Ex. : médiatrice, fraction…"><div class="qres" id="${id}r" aria-live="polite"></div></div>`;
}

/* =====================================================================
   5. ACCUEIL ET PAGE DE CLASSE
===================================================================== */
const _home = window.home;
window.home = function(choix){
  _home(choix);
  const L=jg("last", null), A=app(), hero=$(".hero", A);
  let h="";
  if(L && CLASSES[L.id] && CH[L.id+"-"+L.n]){ const T={cours:"Le cours", essentiel:"En un coup d'œil", ex:"Exercices", quiz:"Je m'entraîne", eval:"Éval d'entraînement"}[L.t]||"Le cours";
    h+=`<a class="resume" href="#${L.id}-ch${L.n}" id="resume"><span aria-hidden="true">▶</span> Reprendre là où j'en étais</a>`; }
  if(hero) hero.insertAdjacentHTML("afterend", h);
  const r=$("#resume", A); if(r) r.onclick=()=>openAt(L.id+"-"+L.n, L.t);
};
const _classe = window.classe;
window.classe = function(id){
  _classe(id);
  const A=app(), head=$(".head", A); if(!head) return;
  const st=jg("defi-"+id, {}), sk=streak(id), fait=st.date===today() && st.done;
  let x=`<div class="extras">
    <a class="xcard" href="#defi-${id}"><b>⚡ Le défi du jour</b><span>${fait?`Fait aujourd'hui : ${st.ok} / ${st.qs.length}. Reviens demain !`:"5 questions rapides sur les chapitres que tu as déjà ouverts."}${sk.n>1?` <span class="flash">🔥 ${sk.n} jours d'affilée</span>`:""}</span></a>
    ${id==="3e"?`<a class="xcard" href="#brevet"><b>🎓 Objectif brevet</b><span>Automatismes en 20 minutes, exercices du brevet, brevet blanc toutes notions.</span></a>`:""}
  </div>`;
  head.insertAdjacentHTML("afterend", x);
};

/* =====================================================================
   6. QUESTIONS : défi du jour et automatismes
===================================================================== */
function pool(keys, lv){ const P=[]; keys.forEach(k=>(CH[k].quiz||[]).forEach((N,ni)=>lv.forEach(l=>(N.q[l]||[]).forEach((Q,qi)=>P.push({k, ni, l, qi}))))); return P; }
function tirage(keys, n, lv){
  const P=shuffle(pool(keys, lv)), out=[], used=new Set();
  for(const p of P){ const tag=p.k+"/"+p.ni; if(used.has(tag) && P.length>n*2) continue; used.add(tag);
    const N=CH[p.k].quiz[p.ni]; let Q; try{ Q=inst(N.q[p.l][p.qi]); }catch(e){ continue; }
    if(!Q || (!Q.c && Q.rep===undefined && !Q.t)) continue;
    const [id,num]=p.k.split("-"); Q=JSON.parse(JSON.stringify(Object.assign({}, Q, {_N:N.schema||"", _F:N.schemaFb||"", _src:`${id} · ch. ${num} — ${strip(N.nom)}`})));
    out.push(Q); if(out.length>=n) break; }
  return out;
}
function streak(id){ const s=jg("defi-streak-"+id, {last:null, n:0}); if(s.last!==today() && s.last!==yesterday()) s.n=0; return s; }
async function runQuestions(box, Q, opt){
  const st=opt.state;
  for(; st.i<Q.length; ){
    const i=st.i, head=`<div class="qhead"><span>Question ${i+1} / ${Q.length}</span><span class="lv">${esc(Q[i]._src||"")}</span></div>`;
    const card=document.createElement("div"); card.className="card"; card.id="quiz"; box.innerHTML=""; box.appendChild(card);
    const {ok, fb, shown} = await showQ(card, head, Q[i]);
    st.i++; if(ok) st.ok++; if(opt.save) opt.save();
    await feedback(fb, ok, ok?"Bravo !":"Pas tout à fait.", shown, Q[i], "", st.i<Q.length?"Question suivante →":"Voir mon score");
    if(!box.isConnected) return;
  }
  opt.end && opt.end();
}
function defiPage(id){
  const C=CLASSES[id]; document.documentElement.style.setProperty("--c", C.couleur);
  crumbs.innerHTML=`<a href="#accueil">Accueil</a><span aria-hidden="true">›</span><a href="#${id}">${C.nom}</a><span aria-hidden="true">›</span><span>Défi du jour</span>`;
  let vu=jg("vu",[]).filter(k=>k.startsWith(id+"-") && CH[k]); const dispo=C.chapitres.map((_,i)=>id+"-"+(i+1)).filter(k=>CH[k]);
  const keys = vu.length ? vu : dispo.slice(0,2);
  let st=jg("defi-"+id, {});
  if(st.date!==today() || !st.qs){ st={date:today(), qs:tirage(keys, 5, [1,2]), i:0, ok:0, done:false}; js("defi-"+id, st); }
  const A=app();
  A.innerHTML=`<div class="head"><span class="eyebrow">${C.nom} · Défi du jour</span><h1>⚡ Le défi du jour</h1><p>5 questions rapides, chaque jour, sur les chapitres que tu as déjà ouverts${vu.length?` (${vu.length} chapitre${vu.length>1?"s":""})`:` (pour l'instant, les chapitres 1 et 2)`}. Fais-le tous les jours pour garder ta série !</p></div><div id="dbox"></div>`;
  const box=$("#dbox", A);
  const fin=()=>{ if(!st.done){ st.done=true; js("defi-"+id, st); const s=jg("defi-streak-"+id, {last:null,n:0}); if(s.last!==today()){ s.n = s.last===yesterday() ? s.n+1 : 1; s.last=today(); js("defi-streak-"+id, s); } }
    const s=streak(id), note=st.ok===st.qs.length?"Parfait ! 🎉":st.ok>=st.qs.length-1?"Très bien !":st.ok>=Math.ceil(st.qs.length/2)?"C'est bien, continue !":"Ce n'est pas grave : revois les chapitres et reviens demain.";
    box.innerHTML=`<div class="card runner"><h3>Défi terminé</h3><p class="bigscore">${st.ok} / ${st.qs.length}</p><p class="score">${note}</p>
      <p>${s.n>1?`🔥 Tu as fait le défi <b>${s.n} jours d'affilée</b>. Reviens demain pour continuer ta série !`:"Reviens demain pour un nouveau défi : chaque jour d'affilée allonge ta série 🔥."}</p>
      <div class="pbtns"><button class="btn primary" id="bonus">Un défi bonus (ne compte pas dans la série)</button><a class="btn" href="#${id}">Retour aux chapitres</a></div></div>`;
    $("#bonus", box).onclick=()=>{ const b={i:0, ok:0}, Q=tirage(keys, 5, [1,2,3]); runQuestions(box, Q, {state:b, end:()=>{ box.innerHTML=`<div class="card runner"><h3>Défi bonus terminé</h3><p class="bigscore">${b.ok} / ${Q.length}</p><div class="pbtns"><button class="btn primary" id="bonus2">Encore un</button><a class="btn" href="#${id}">Retour aux chapitres</a></div></div>`; $("#bonus2",box).onclick=()=>defiPage(id); }}); };
  };
  if(st.done || st.i>=st.qs.length) fin(); else runQuestions(box, st.qs, {state:st, save:()=>js("defi-"+id, st), end:fin});
}

/* =====================================================================
   7. OBJECTIF BREVET (3e)
===================================================================== */
const BREVET_RE = /brevet|polyn[ée]sie|cal[ée]donie|am[ée]rique|asie|m[ée]tropole|antilles|centres? [ée]trangers|pondich[ée]ry|liban|gr[èe]ce|afrique|inde|wallis|r[ée]union|guyane|dnb/i;
function brevetExos(){
  const L=[]; ["3e","4e"].forEach(id=>CLASSES[id].chapitres.forEach(([t],i)=>{ const k=id+"-"+(i+1), D=CH[k]; if(!D) return;
    D.exos.forEach(S=>S.e.forEach(e=>{ if(BREVET_RE.test(strip(e.t)) || BREVET_RE.test(strip(S.t))) L.push({id, n:i+1, ct:t, e}); })); }));
  return L;
}
function brevetBlanc(fresh){
  let sel=jg("bb-sel", null);
  const evs=CLASSES["3e"].chapitres.map((_,i)=>"3e-"+(i+1)).filter(k=>CH[k] && CH[k].eval);
  if(fresh || !sel || !sel.every(([k,j])=>CH[k] && CH[k].eval && CH[k].eval.exos[j])){
    const ks=shuffle(evs.slice()).slice(0,5).sort((a,b)=>+a.split("-")[1]-+b.split("-")[1]);
    sel=ks.map(k=>{ const ex=CH[k].eval.exos; /* plutôt un exercice « problème » (de la 2e moitié du sujet) */ const j=Math.min(ex.length-1, Math.floor(ex.length/2)+Math.floor(Math.random()*Math.ceil(ex.length/2))); return [k,j]; });
    js("bb-sel", sel);
  }
  const exos=sel.map(([k,j])=>CH[k].eval.exos[j]);
  const comp=sel.map(([k,j],i)=>{ const n=+k.split("-")[1]; return [`Chapitre ${n}`, esc(CLASSES["3e"].chapitres[n-1][0]), `Ex. ${i+1} (${pnum(exos[i].p)} point${exos[i].p>1?"s":""})`]; });
  return {titre:"Brevet blanc · raisonnement et résolution de problèmes", duree:100, info:"Durée : 1 h 40 · Calculatrice autorisée · Réponds par une phrase et laisse tes calculs visibles", comp, exos};
}
function brevetPage(){
  const C=CLASSES["3e"]; document.documentElement.style.setProperty("--c", C.couleur);
  crumbs.innerHTML=`<a href="#accueil">Accueil</a><span aria-hidden="true">›</span><a href="#3e">${C.nom}</a><span aria-hidden="true">›</span><span>Objectif brevet</span>`;
  const keys3=C.chapitres.map((_,i)=>"3e-"+(i+1)).filter(k=>CH[k]), all=[];
  ["6e","5e","4e","3e"].forEach(id=>CLASSES[id].chapitres.forEach((_,i)=>{ const k=id+"-"+(i+1); if(CH[k]) all.push(k); }));
  const BX=brevetExos();
  const A=app();
  A.innerHTML=`<div class="head"><span class="eyebrow">Troisième · Objectif brevet</span><h1>🎓 Objectif brevet</h1>
    <p>Depuis la session 2026, l'épreuve de mathématiques du brevet commence par une partie <b>« automatismes »</b> de 20 minutes, <b>sans calculatrice</b> : une dizaine de questions courtes sur les bases vues depuis la 6e. Ensuite viennent les exercices de raisonnement et de résolution de problèmes, avec la calculatrice.</p></div>
    <div class="extras" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
      <button class="xcard" type="button" data-go="auto" style="text-align:left;font:inherit;cursor:pointer"><b>⏱️ Automatismes</b><span>10 questions, 20 minutes, sans calculatrice : des questions de la 6e à la 3e.</span></button>
      <button class="xcard" type="button" data-go="blanc" style="text-align:left;font:inherit;cursor:pointer"><b>📝 Brevet blanc</b><span>5 exercices de problèmes tirés de tous les chapitres de 3e, chrono 1 h 40, corrigé et barème.</span></button>
      <button class="xcard" type="button" data-go="exos" style="text-align:left;font:inherit;cursor:pointer"><b>📚 Exercices du brevet</b><span>${BX.length} exercice${BX.length>1?"s":""} tombé${BX.length>1?"s":""} au brevet, rangé${BX.length>1?"s":""} par chapitre, avec la correction.</span></button>
      ${keys3.some(k=>(window.CARTES||{})[k])?`<button class="xcard" type="button" data-go="pc" style="text-align:left;font:inherit;cursor:pointer"><b>🧭 Les schémas « En un coup d'œil »</b><span>Les grands schémas des chapitres de 3e, pour réviser d'un coup.</span></button>`:""}
    </div>
    <div id="bzone"></div>`;
  const Z=$("#bzone", A);
  const go=w=>{ if(TIMER){ clearInterval(TIMER); TIMER=null; } ttsStop();
    if(w==="auto"){
      const st={i:0, ok:0}, Q=tirage(all, 10, [1,2]); let left=20*60;
      Z.innerHTML=`<div class="card runner"><h3>⏱️ Automatismes · sans calculatrice</h3><p>Réponds vite et sans calculatrice, comme au brevet. Le chrono tourne : <b id="aclock">20:00</b></p></div><div id="abox"></div>`;
      const ck=$("#aclock", Z); TIMER=setInterval(()=>{ left=Math.max(0,left-1); ck.textContent=`${String(Math.floor(left/60)).padStart(2,"0")}:${String(left%60).padStart(2,"0")}`; if(!left){ clearInterval(TIMER); TIMER=null; ck.textContent="Temps écoulé !"; } },1000);
      runQuestions($("#abox", Z), Q, {state:st, end:()=>{ if(TIMER){ clearInterval(TIMER); TIMER=null; } const used=20*60-left;
        $("#abox",Z).innerHTML=`<div class="card runner"><h3>Automatismes terminés</h3><p class="bigscore">${st.ok} / ${Q.length}</p><p>Temps utilisé : ${Math.floor(used/60)} min ${String(used%60).padStart(2,"0")} s${left===0?" (temps dépassé)":""}.</p><div class="pbtns"><button class="btn primary" id="again">Nouvelle série</button></div></div>`; $("#again",Z).onclick=()=>go("auto"); }});
    }
    if(w==="blanc"){ Z.innerHTML=`<div class="pbtns" style="margin:0 0 12px"><button class="btn" id="newbb">🔄 Un autre brevet blanc</button></div><div id="bbp"></div>`;
      renderEval($("#bbp", Z), "brevet", brevetBlanc(false)); $("#newbb", Z).onclick=()=>{ brevetBlanc(true); go("blanc"); }; }
    if(w==="exos"){ let last=""; Z.innerHTML = BX.length ? BX.map(x=>{ const h=x.id+x.n!==last ? `<h2 class="sech" style="margin-top:22px"><span>${x.id==="3e"?"3e":"4e"}</span>Chapitre ${x.n} — ${esc(x.ct)}</h2>` : ""; last=x.id+x.n; return h+exCard(x.e); }).join("") : `<p class="where">Les exercices du brevet arrivent bientôt.</p>`; }
    if(w==="pc"){ Z.innerHTML = keys3.filter(k=>(window.CARTES||{})[k]).map(k=>{ const n=+k.split("-")[1];
        return `<article class="card cours"><h3><span class="k">${n}</span>${esc(C.chapitres[n-1][0])}</h3><div class="cmap-scroll">${CARTES[k]}</div><p><a href="#3e-ch${n}" data-k="${k}" class="pcl">Ouvrir le chapitre ${n} →</a></p></article>`; }).join("");
      $$(".pcl", Z).forEach(a=>a.onclick=()=>openAt(a.dataset.k, "cours")); }
    Z.scrollIntoView({behavior:"smooth", block:"start"});
  };
  $$("[data-go]", A).forEach(b=>b.onclick=()=>go(b.dataset.go));
}

/* =====================================================================
   8. PAGE PARENTS
===================================================================== */
function parentsPage(){
  crumbs.innerHTML=`<a href="#accueil">Accueil</a><span aria-hidden="true">›</span><span>Pour les parents</span>`;
  app().innerHTML=`<div class="head"><span class="eyebrow">Pour les parents</span><h1>Pour les élèves DYS</h1></div>
  <div class="card parents"><ul>
    <li>Le bouton <b>🔊 Écouter</b> lit à voix haute le cours, les exercices et les corrections. On peut régler la vitesse de lecture dans « Personnaliser », en haut de la page.</li>
    <li>Le bouton <b>« Mode DYS »</b>, en haut de la page, met une écriture faite pour être plus facile à lire : texte plus grand, police plus lisible, lignes et lettres plus espacées.</li></ul></div>`;
}

/* =====================================================================
   9. PAGES SUPPLÉMENTAIRES (routage) et lien « parents »
===================================================================== */
window.PAGES = {
  brevet:{show:brevetPage, back:["#3e","Retour aux chapitres"]},
  parents:{show:parentsPage, back:["#accueil","Retour à l'accueil"]}
};
["6e","5e","4e","3e"].forEach(id=>{ window.PAGES["defi-"+id]={show:()=>defiPage(id), back:["#"+id,"Retour aux chapitres"]}; });
(function(){ const f=document.querySelector(".sitefoot"); if(f && !f.querySelector('[href="#parents"]')) f.insertAdjacentHTML("afterbegin", `<a href="#parents">Pour les parents</a><span aria-hidden="true"> · </span>`); })();

/* =====================================================================
   10. SANS CONNEXION (site public uniquement)
===================================================================== */
if("serviceWorker" in navigator && /github\.io$|^localhost$/.test(location.hostname)){
  navigator.serviceWorker.register("sw.js").then(()=>new Promise(ok=>{ const sc=document.createElement("script"); sc.src="data/iblist.js"; sc.onload=ok; sc.onerror=ok; document.head.appendChild(sc); })).then(()=>{
    const p=document.getElementById("aff"); if(!p || !window.IBLIST) return;
    const row=document.createElement("div"); row.className="affrow";
    row.innerHTML=`<span>Sans connexion 📶</span><div><button class="btn" id="offbtn" type="button">Télécharger les images de ma classe</button><p class="where" id="offmsg" style="margin:6px 0 0">Le site marche déjà sans connexion. Ce bouton ajoute toutes les figures de ta classe (de 3 à 16 Mo : fais-le avec le wifi).</p></div>`;
    p.insertBefore(row, p.querySelector("p.where:last-of-type"));
    $("#offbtn").onclick=async()=>{ const id=store.get("classe"); const L=id && IBLIST[id]; const m=$("#offmsg"); if(!L){ m.textContent="Choisis d'abord ta classe sur la page d'accueil."; return; }
      let k=0; for(const f of L){ try{ await fetch(f); }catch(e){} k++; m.textContent=`Téléchargement… ${Math.round(k/L.length*100)} %`; } m.textContent="C'est prêt : toutes les figures de ta classe marchent sans connexion."; };
  }).catch(()=>{});
}
})();
