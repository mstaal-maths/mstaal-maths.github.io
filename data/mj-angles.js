/* Estimation d'angles (5e) : un angle s'affiche, l'élève estime sa mesure à l'œil ; un rapporteur virtuel (centre sur le sommet,
   0 sur un côté) révèle ensuite la vraie mesure. Dernier niveau : tracer à l'œil un angle de mesure donnée. */
window.MJ_ANGLES = (function(){
"use strict";
const KEY = "staal-mj-angles5", NQ = 8, NB = " ";
const reduced = () => { try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } };
const rad = d => d*Math.PI/180;
const norm = a => ((a%360)+360)%360;
const ri = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const pick = a => a[Math.floor(Math.random()*a.length)];
const dirv = a => ({x:Math.cos(rad(a)), y:-Math.sin(rad(a))});      /* angle « mathématique » -> écran */
const ANG = n => `<span class="ang">${n}</span>`;
/* angle entre deux directions (en degrés), entre 0 et 180 */
const between = (a,b) => { const d = Math.abs(norm(a)-norm(b)); return Math.min(d, 360-d); };
/* sens de rotation de a vers b : +1 (inverse des aiguilles d'une montre) ou −1 */
const sens = (a,b) => { const d = norm(b-a); return d>0 && d<180 ? 1 : d===0||d===180 ? 1 : -1; };
function type(m){ return m===0 ? "nul" : m<90 ? "aigu" : m===90 ? "droit" : m<180 ? "obtus" : "plat"; }
const TYPEDEF = {aigu:"un angle <b>aigu</b> (plus petit qu'un angle droit : entre 0° et 90°)", droit:"un angle <b>droit</b> (exactement 90°)",
  obtus:"un angle <b>obtus</b> (plus grand qu'un angle droit : entre 90° et 180°)", plat:"un angle <b>plat</b> (180° : ses deux côtés sont dans le prolongement l'un de l'autre)", nul:"un angle <b>nul</b> (0°)"};
function points(g){ return g<=2 ? 100 : g<=5 ? 80 : g<=10 ? 60 : g<=15 ? 40 : g<=20 ? 25 : g<=30 ? 10 : 0; }
function verdict(g){ return g<=2 ? "Dans le mille !" : g<=5 ? "Excellent !" : g<=10 ? "Très bien !" : g<=15 ? "Pas mal." : g<=30 ? "Encore un effort…" : "Trop loin…"; }
const starsFor = s => s>=640 ? 3 : s>=480 ? 2 : s>=320 ? 1 : 0;

/* ---------- Niveaux ---------- */
const LV = [
 {t:"Aigu ou obtus ?", d:"Des angles bien aigus ou bien obtus, un côté horizontal.", mode:"est"},
 {t:"De 0° à 180°", d:"Toutes les mesures de 10 en 10, dans tous les sens.", mode:"est"},
 {t:"Multiples de 5", d:"Des mesures de 5 en 5 : vise juste !", mode:"est"},
 {t:"N'importe quelle mesure", d:"Des mesures au degré près : 37°, 113°…", mode:"est"},
 {t:"Les pièges", d:"Côtés très courts ou très longs, angles retournés.", mode:"est"},
 {t:"Trace à l'œil", d:"Fais tourner un côté pour tracer l'angle demandé.", mode:"trace"}
];
const NAMES = [["A","B","C"],["D","E","F"],["M","N","P"],["R","S","T"],["E","F","G"],["K","L","M"],["x","O","y"],["U","V","W"],["A","O","B"],["P","Q","R"]];

/* q = {lv, mode, m (mesure, entier), a1 (direction du 1er côté), dir (+1/−1), L1, L2, arc, names} ; 2e côté : a1 + dir*m */
function gen(lv){
  const q = {lv, mode:LV[lv].mode, names:pick(NAMES).slice(), a1:ri(0,359), dir:pick([1,-1]), L1:ri(190,225), L2:ri(190,225), arc:ri(30,40)};
  if(Math.random()<.5) q.names.reverse();
  if(lv===0){ q.m = pick([20,30,40,50,60,70,80,100,110,120,130,140,150,160]); q.a1 = pick([0,180]); q.dir = q.a1===0 ? 1 : -1; }
  else if(lv===1){ const r=Math.random(); q.m = r<.08 ? 180 : r<.2 ? 90 : 10*ri(1,17); if(q.m===90 && r>=.2) q.m=100; }
  else if(lv===2){ q.m = 5*ri(1,35); if(q.m%10===0 && Math.random()<.65) q.m += pick([5,-5]); }
  else if(lv===3){ do q.m = ri(3,177); while(q.m%5===0); }
  else if(lv===4){
    q.m = ri(10,170);
    const t = ri(0,3);
    if(t===0){ q.L1 = ri(55,80); q.L2 = ri(55,80); q.arc = ri(14,20); }                      /* côtés très courts */
    else if(t===1){ q.L1 = ri(215,230); q.L2 = ri(215,230); q.arc = ri(16,22); }              /* côtés très longs, petit arc */
    else if(t===2){ q.L1 = ri(55,75); q.L2 = ri(205,230); q.arc = ri(40,50); if(Math.random()<.5){ const x=q.L1; q.L1=q.L2; q.L2=x; } } /* un côté court, l'autre long */
    else { q.a1 = pick([200,230,250,290,310,340]); }                                           /* angle « à l'envers » */
    q.trap = t;
  }
  else { q.m = 5*ri(3,34); q.target = q.m; q.L1 = 210; q.L2 = 210; q.arc = 34;
    let s; do s = ri(15,165); while(Math.abs(s-q.target)<35); q.init = norm(q.a1 + q.dir*s); }
  q.arc = Math.min(q.arc, Math.min(q.L1,q.L2) - 10);
  return q;
}
const qkey = q => q.m+":"+q.a1+":"+q.dir;

/* ---------- Mémoire (record) ---------- */
function load(){ try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }catch(e){ return {}; } }
function save(d){ try{ localStorage.setItem(KEY, JSON.stringify(d)); }catch(e){} }
const STAR = on => `<svg class="mj-ang-star${on?" on":""}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.9 6 6.5.8-4.8 4.5 1.2 6.5L12 17.2l-5.8 3.2 1.2-6.5L2.6 9.4l6.5-.8z"/></svg>`;
const STARS = n => `<span class="mj-ang-stars" aria-label="${n} étoile${n>1?"s":""} sur 3">${STAR(n>=1)}${STAR(n>=2)}${STAR(n>=3)}</span>`;

/* ---------- Style ---------- */
const CSS = `
.mj-ang{line-height:1.5;position:relative;font-family:var(--f-body);color:var(--ink);max-width:1180px;margin:0 auto}
.mj-ang *{box-sizing:border-box}
.mj-ang .btn{font-size:1rem}
.mj-ang-help{background:var(--surface);border:2px solid var(--line);border-radius:14px;padding:4px 16px;margin:0 0 14px}
.mj-ang-help summary{cursor:pointer;font-weight:700;padding:8px 0}
.mj-ang-help ul{margin:2px 0 10px;padding-left:1.2em;line-height:1.55}
.mj-ang-help li{margin:3px 0}
.mj-ang-levels{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.mj-ang-lv{font:inherit;text-align:left;color:var(--ink);background:var(--surface);border:2px solid var(--line);border-radius:14px;padding:12px 14px;cursor:pointer;display:flex;flex-direction:column;gap:4px;min-height:120px;transition:border-color .15s,transform .15s}
.mj-ang-lv:hover,.mj-ang-lv:focus-visible{border-color:var(--c);transform:translateY(-2px)}
.mj-ang-lv .mj-ang-n{display:flex;align-items:center;justify-content:space-between;gap:6px}
.mj-ang-lv .mj-ang-n b{width:32px;height:32px;border-radius:10px;background:var(--c);color:var(--paper);display:grid;place-items:center;font-size:1rem}
.mj-ang-lv .mj-ang-tt{font-weight:700;font-size:1.02rem;line-height:1.3}
.mj-ang-lv .mj-ang-dd{font-size:.9rem;color:var(--muted);line-height:1.35}
.mj-ang-lv .mj-ang-rec{font-size:.85rem;color:var(--muted);margin-top:auto}
.mj-ang-stars{display:inline-flex;gap:2px}
.mj-ang-star{width:18px;height:18px;fill:none;stroke:var(--muted);stroke-width:1.6;opacity:.6}
.mj-ang-star.on{fill:#f5b301;stroke:#b07d00;opacity:1}
.mj-ang-menuhead{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 10px;flex-wrap:wrap}
.mj-ang-menuhead h2{font-family:var(--f-display);font-size:1.35rem;margin:0}
.mj-ang-tot{font-weight:600;color:var(--muted)}
.mj-ang-top{display:flex;align-items:center;gap:10px 16px;flex-wrap:wrap;margin:0 0 10px;min-height:48px}
.mj-ang-top .mj-ang-lvname{font-weight:700;font-size:1.05rem;margin-right:auto}
.mj-ang-top .mj-ang-lvname span{color:var(--c)}
.mj-ang-dots{display:flex;gap:5px}
.mj-ang-dots i{width:14px;height:14px;border-radius:50%;border:2px solid var(--line);background:var(--surface)}
.mj-ang-dots i.cur{border-color:var(--ink)}
.mj-ang-dots i.g3{background:#1f9d55;border-color:#1f9d55}
.mj-ang-dots i.g2{background:#7cc36b;border-color:#7cc36b}
.mj-ang-dots i.g1{background:#f0b429;border-color:#f0b429}
.mj-ang-dots i.g0{background:#d64545;border-color:#d64545}
.mj-ang-score{font-weight:700;font-variant-numeric:tabular-nums;background:var(--surface);border:2px solid var(--line);border-radius:999px;padding:4px 14px}
.mj-ang-top details{position:relative;margin:0;border:0;padding:0}
.mj-ang-top details summary{list-style:none;cursor:pointer;font-weight:600;border:2px solid var(--line);border-radius:999px;padding:5px 14px;background:var(--surface)}
.mj-ang-top details summary::-webkit-details-marker{display:none}
.mj-ang-top details .mj-ang-pop{position:absolute;right:0;top:calc(100% + 8px);z-index:20;width:min(460px,90vw);background:var(--surface);border:2px solid var(--line);border-radius:14px;padding:6px 18px;box-shadow:0 12px 30px rgba(0,0,0,.18)}
.mj-ang-main{display:grid;grid-template-columns:minmax(0,1fr) 390px;gap:18px;align-items:stretch}
.mj-ang-scene{background:#fff;border:2px solid var(--line);border-radius:16px;overflow:hidden;height:min(560px,calc(100vh - 92px));min-height:420px;
  background-image:linear-gradient(#eef3f9 1px,transparent 1px),linear-gradient(90deg,#eef3f9 1px,transparent 1px);background-size:28px 28px}
.mj-ang-scene svg{display:block;width:100%;height:100%;touch-action:none;outline:none}
.mj-ang-scene svg:focus-visible{box-shadow:inset 0 0 0 3px var(--c)}
.mj-ang-scene.drag svg{cursor:grab}
.mj-ang-panel{background:var(--surface);border:2px solid var(--line);border-radius:16px;padding:18px 20px;display:flex;flex-direction:column;gap:14px;min-width:0}
.mj-ang-qnum{font-size:.9rem;font-weight:700;color:var(--c);text-transform:uppercase;letter-spacing:.04em}
.mj-ang-prompt{font-size:1.2rem;line-height:1.5;font-weight:600;margin:0}
.mj-ang-sub{font-size:.95rem;color:var(--muted);margin:-6px 0 0;line-height:1.45}
.mj-ang-est{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
.mj-ang-est .mj-ang-big{font-size:2.3rem;font-weight:800;font-variant-numeric:tabular-nums;line-height:1}
.mj-ang-est .mj-ang-ty{font-weight:600;color:var(--muted)}
.mj-ang-range{width:100%;accent-color:var(--c);height:34px;cursor:pointer}
.mj-ang-ticks{display:flex;justify-content:space-between;font-size:.8rem;color:var(--muted);margin:-8px 2px 0;font-variant-numeric:tabular-nums}
.mj-ang-ans{display:flex;align-items:center;flex-wrap:wrap;gap:10px}
.mj-ang-ans label{font-weight:700}
.mj-ang-ans input{font:inherit;font-size:1.3rem;font-weight:700;width:4.2em;text-align:center;padding:7px 8px;border-radius:12px;border:2px solid var(--line);background:var(--paper);color:var(--ink);font-variant-numeric:tabular-nums}
.mj-ang-ans input:focus{outline:3px solid color-mix(in srgb,var(--c) 45%,transparent);border-color:var(--c)}
.mj-ang-warn{color:var(--ko);font-weight:600;font-size:.95rem;min-height:1.2em;margin:-6px 0 0}
.mj-ang-hint{align-self:flex-start;font:inherit;font-size:.92rem;font-weight:600;color:var(--ink);background:none;border:2px dashed var(--line);border-radius:999px;padding:6px 14px;cursor:pointer}
.mj-ang-hint:disabled{opacity:.55;cursor:default}
.mj-ang-fb{border-radius:14px;padding:12px 16px;border:2px solid var(--line)}
.mj-ang-fb.ok{background:var(--okbg);border-color:var(--ok)}
.mj-ang-fb.mid{background:var(--warnbg);border-color:var(--warn)}
.mj-ang-fb.ko{background:var(--kobg);border-color:var(--ko)}
.mj-ang-fb .mj-ang-verdict{font-weight:800;font-size:1.2rem;margin:0 0 4px}
.mj-ang-fb.ok .mj-ang-verdict{color:var(--ok)} .mj-ang-fb.mid .mj-ang-verdict{color:var(--warn)} .mj-ang-fb.ko .mj-ang-verdict{color:var(--ko)}
.mj-ang-fb p{margin:5px 0;line-height:1.45}
.mj-ang-next{align-self:flex-start}
.mj-ang-end{position:absolute;inset:0;z-index:30;display:grid;place-items:center;background:color-mix(in srgb,var(--paper) 72%,transparent);backdrop-filter:blur(2px);border-radius:16px}
.mj-ang-endbox{background:var(--surface);border:2px solid var(--line);border-radius:18px;padding:24px 30px;text-align:center;max-width:540px;box-shadow:0 16px 40px rgba(0,0,0,.2)}
.mj-ang-endbox h3{font-family:var(--f-display);font-size:1.6rem;margin:0 0 6px}
.mj-ang-endbox .mj-ang-big .mj-ang-star{width:46px;height:46px}
.mj-ang-endbox p{margin:8px 0}
.mj-ang-endbox .mj-ang-rec{color:var(--ok);font-weight:800}
.mj-ang-endbox .mj-ang-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px}
@keyframes mj-ang-pop{0%{transform:scale(.6);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
.mj-ang-endbox .mj-ang-big .mj-ang-star.on{animation:mj-ang-pop .5s both}
.mj-ang-endbox .mj-ang-big .mj-ang-star.on:nth-child(2){animation-delay:.2s}
.mj-ang-endbox .mj-ang-big .mj-ang-star.on:nth-child(3){animation-delay:.4s}
@media (prefers-reduced-motion: reduce){ .mj-ang *{transition:none!important;animation:none!important} }
@media (max-width:900px){ .mj-ang-main{grid-template-columns:1fr} .mj-ang-levels{grid-template-columns:repeat(2,minmax(0,1fr))} .mj-ang-scene{height:480px} }
html.fs-1 .mj-ang-scene, html.fs-2 .mj-ang-scene{height:min(520px,calc(100vh/1.12 - 96px))}
`;

/* ---------- Dessin ---------- */
const VW = 660, VH = 500, RP = 180;
const P = (O, a, r) => ({x:O.x + r*dirv(a).x, y:O.y + r*dirv(a).y});
const f1 = v => v.toFixed(2);
/* base du rapporteur : son « 0 » de la graduation utilisée est sur le 1er côté */
const protoBase = (a1, dir) => dir>0 ? a1 : a1-180;
function place(q, a2){
  /* centre l'ensemble (côtés + rapporteur) dans le cadre */
  if(q.mode==="trace") return {x:VW/2, y:VH/2};
  const pts=[{x:0,y:0}, P({x:0,y:0},q.a1,q.L1), P({x:0,y:0},a2,q.L2)], base = protoBase(q.a1, q.dir);
  for(let t=0;t<=180;t+=5) pts.push(P({x:0,y:0}, base+t, 245));
  const xs=pts.map(p=>p.x), ys=pts.map(p=>p.y);
  return {x: VW/2 - (Math.min(...xs)+Math.max(...xs))/2, y: VH/2 - (Math.min(...ys)+Math.max(...ys))/2};
}
function cross(p, col){ return `<path d="M${f1(p.x-6)} ${f1(p.y-6)}l12 12m0-12-12 12" stroke="${col||"#1f1f1f"}" stroke-width="2.2" stroke-linecap="round"/>`; }
function arcPath(O, r, a, b, dir){
  /* arc de la direction a vers la direction b en tournant dans le sens dir */
  const m = between(a,b), s = P(O,a,r), e = P(O,a+dir*m,r);
  if(m<0.5) return "";
  if(m>179.5){ const mid=P(O,a+dir*90,r); return `M${f1(s.x)} ${f1(s.y)}A${r} ${r} 0 0 ${dir>0?0:1} ${f1(mid.x)} ${f1(mid.y)}A${r} ${r} 0 0 ${dir>0?0:1} ${f1(e.x)} ${f1(e.y)}`; }
  return `M${f1(s.x)} ${f1(s.y)}A${r} ${r} 0 0 ${dir>0?0:1} ${f1(e.x)} ${f1(e.y)}`;
}
function label(O, a, r, txt, col){ const p=P(O,a,r); return `<text x="${f1(p.x)}" y="${f1(p.y)}" dy=".36em" text-anchor="middle" style="font:700 21px Arial,sans-serif" fill="${col||"#1f1f1f"}">${txt}</text>`; }
function figure(q, O, a2){
  const n=q.names, A=P(O,q.a1,q.L1), C=P(O,a2,q.L2), pa=P(O,q.a1,q.L1*.8), pc=P(O,a2,q.L2*.8);
  const m = between(q.a1,a2), d = sens(q.a1,a2), bis = q.a1 + d*m/2 + 180;
  let s = `<path class="arcm" d="${arcPath(O,q.arc,q.a1,a2,d)}" fill="none" stroke="#7a3fd0" stroke-width="2.4"/>`;
  s += `<path d="M${f1(O.x)} ${f1(O.y)}L${f1(A.x)} ${f1(A.y)}" stroke="#1f1f1f" stroke-width="2.6" stroke-linecap="round"/>`;
  s += `<path class="side2" d="M${f1(O.x)} ${f1(O.y)}L${f1(C.x)} ${f1(C.y)}" stroke="#1f1f1f" stroke-width="2.6" stroke-linecap="round"/>`;
  s += cross(pa) + `<g class="p2">${cross(pc)}</g>` + cross(O);
  /* lettres : à côté du point, du côté extérieur de l'angle */
  s += label(pa, q.a1 - d*90, 18, n[0]) + `<g class="lab2">${label(pc, a2 + d*90, 18, n[2])}</g>` + `<g class="labO">${label(O, m>170 ? q.a1 - d*90 : bis, 22, n[1])}</g>`;
  return s;
}
function protractor(O, base, useOuter){
  /* rapporteur à double graduation : extérieure (noire) 0 à droite, intérieure (rouge) 0 à gauche */
  const R=RP, g=[], pt=(t,r)=>P(O,base+t,r);
  const e0=pt(0,R), e1=pt(180,R), b0=pt(0,R+10), b1=pt(180,R+10);
  g.push(`<path d="M${f1(b0.x)} ${f1(b0.y)}L${f1(e0.x)} ${f1(e0.y)}A${R} ${R} 0 0 0 ${f1(e1.x)} ${f1(e1.y)}L${f1(b1.x)} ${f1(b1.y)}Z" fill="rgba(255,236,150,.62)" stroke="#b8962e" stroke-width="1.6"/>`);
  for(let t=0;t<=180;t++){ const l = t%10===0 ? 15 : t%5===0 ? 10 : 6, a=pt(t,R), b=pt(t,R-l);
    g.push(`<path d="M${f1(a.x)} ${f1(a.y)}L${f1(b.x)} ${f1(b.y)}" stroke="#5a4a14" stroke-width="${t%10===0?1.4:.9}"/>`); }
  const so = useOuter ? 1 : .3, si = useOuter ? .3 : 1;
  for(let t=0;t<=180;t+=10){ const a=pt(t,R-27), b=pt(t,R-48);
    g.push(`<text x="${f1(a.x)}" y="${f1(a.y)}" dy=".35em" text-anchor="middle" opacity="${so}" style="font:${useOuter?800:600} 13px Arial,sans-serif" fill="#1b2a44">${t}</text>`);
    g.push(`<text x="${f1(b.x)}" y="${f1(b.y)}" dy=".35em" text-anchor="middle" opacity="${si}" style="font:${useOuter?600:800} 12px Arial,sans-serif" fill="#c62828">${180-t}</text>`); }
  const i0=pt(0,R-60), i1=pt(180,R-60);
  g.push(`<path d="M${f1(i0.x)} ${f1(i0.y)}A${R-60} ${R-60} 0 0 0 ${f1(i1.x)} ${f1(i1.y)}" fill="none" stroke="#c62828" stroke-width=".9" opacity=".7"/>`);
  g.push(`<path d="M${f1(b0.x)} ${f1(b0.y)}L${f1(b1.x)} ${f1(b1.y)}" stroke="#c62828" stroke-width="1.6"/>`);
  const c1=pt(90,9), c2=pt(-90,4), c3=pt(0,7), c4=pt(180,7);
  g.push(`<path d="M${f1(c1.x)} ${f1(c1.y)}L${f1(c2.x)} ${f1(c2.y)}M${f1(c3.x)} ${f1(c3.y)}L${f1(c4.x)} ${f1(c4.y)}" stroke="#c62828" stroke-width="1.8"/>`);
  return g.join("");
}

/* ---------- Le jeu ---------- */
function init(root){
  if(!document.getElementById("mj-ang-css")){ const st=document.createElement("style"); st.id="mj-ang-css"; st.textContent=CSS; document.head.appendChild(st); }
  const data = load(); data.best = data.best || {}; data.stars = data.stars || {};
  root.innerHTML = `<div class="mj-ang"><div class="mj-ang-menu"></div><div class="mj-ang-game" hidden></div></div>`;
  const W = root.querySelector(".mj-ang"), MENU = W.querySelector(".mj-ang-menu"), GAME = W.querySelector(".mj-ang-game");
  const alive = () => root.isConnected && W.isConnected;
  const $ = s => GAME.querySelector(s);
  let S = null;
  const HELP = `<ul>
      <li>Un angle s'affiche. <b>Sans rapporteur</b>, estime sa mesure&nbsp;: déplace le curseur ou écris le nombre, puis <b>Entrée</b>.</li>
      <li>Le rapporteur apparaît alors&nbsp;: son centre est sur le sommet, son 0 sur un côté. Il donne la vraie mesure.</li>
      <li>Plus tu es proche, plus tu gagnes de points&nbsp;: 100 points à 2° près, 80 à 5° près, 60 à 10° près…</li>
      <li>Repères utiles&nbsp;: un angle droit mesure 90°, sa moitié 45°, un angle plat 180°.</li>
      <li>Dernier niveau&nbsp;: c'est toi qui traces l'angle, en faisant tourner un côté (souris ou flèches du clavier).</li></ul>`;

  function menu(){
    S = null; GAME.hidden = true; MENU.hidden = false;
    const tot = LV.reduce((s,_,i)=>s+(data.stars[i]||0),0), first = !Object.keys(data.best).length;
    MENU.innerHTML = `<details class="mj-ang-help"${first?" open":""}><summary>Comment jouer&nbsp;?</summary>${HELP}</details>
      <div class="mj-ang-menuhead"><h2>Choisis un niveau</h2><span class="mj-ang-tot">${tot} étoile${tot>1?"s":""} sur ${LV.length*3}</span></div>
      <div class="mj-ang-levels">${LV.map((L,i)=>`<button class="mj-ang-lv" data-l="${i}">
        <span class="mj-ang-n"><b>${i+1}</b>${STARS(data.stars[i]||0)}</span><span class="mj-ang-tt">${L.t}</span><span class="mj-ang-dd">${L.d}</span>
        <span class="mj-ang-rec">${data.best[i]!=null ? "Record : "+data.best[i]+" points" : "Pas encore joué"}</span></button>`).join("")}</div>`;
    MENU.querySelectorAll(".mj-ang-lv").forEach(b=>b.onclick=()=>start(+b.dataset.l));
  }
  function start(lv){
    const seen=new Set(), qs=[];
    while(qs.length<NQ){ const q=gen(lv), k=qkey(q); if(seen.has(k) || qs.some(o=>Math.abs(o.m-q.m)<3)) { if(seen.size<200){ seen.add(k); continue; } } seen.add(k); qs.push(q); }
    S = {lv, qs, i:0, score:0, res:[]};
    MENU.hidden = true; GAME.hidden = false;
    GAME.innerHTML = `<div class="mj-ang-top">
        <button class="btn mj-ang-back">← Niveaux</button>
        <span class="mj-ang-lvname"><span>Niveau ${lv+1}</span> · ${LV[lv].t}</span>
        <span class="mj-ang-dots" aria-hidden="true">${qs.map(()=>"<i></i>").join("")}</span>
        <span class="mj-ang-score" aria-live="polite">0 point</span>
        <details><summary>Aide</summary><div class="mj-ang-pop">${HELP}</div></details></div>
      <div class="mj-ang-main"><div class="mj-ang-scene"></div><div class="mj-ang-panel"></div></div>`;
    $(".mj-ang-back").onclick = menu;
    requestAnimationFrame(()=>{ const t=GAME.querySelector(".mj-ang-top"); if(t && Math.abs(t.getBoundingClientRect().top-8)>20){ t.scrollIntoView({block:"start"}); window.scrollBy(0,-8); } });
    question();
  }
  function topbar(){
    $(".mj-ang-score").textContent = S.score + (S.score>1 ? " points" : " point");
    GAME.querySelectorAll(".mj-ang-dots i").forEach((d,i)=>{ const r=S.res[i]; d.className = r==null ? (i===S.i?"cur":"") : r>=80 ? "g3" : r>=60 ? "g2" : r>=25 ? "g1" : "g0"; });
  }
  /* ----- scène ----- */
  let svg=null, O=null;
  function draw(){
    const q=S.qs[S.i], a2 = q.mode==="trace" ? S.cur : norm(q.a1 + q.dir*q.m);
    O = S.O || (S.O = place(q, a2));
    svg.querySelector(".mj-ang-fig").innerHTML = figure(q, O, a2);
    if(q.mode==="trace" && S.phase==="ask"){ const h=P(O,a2,q.L2); svg.querySelector(".mj-ang-handle").innerHTML = `<circle cx="${f1(h.x)}" cy="${f1(h.y)}" r="15" fill="rgba(37,99,235,.18)" stroke="#2563eb" stroke-width="2.5"/><circle cx="${f1(h.x)}" cy="${f1(h.y)}" r="4" fill="#2563eb"/>`; }
    else svg.querySelector(".mj-ang-handle").innerHTML = "";
  }
  function scene(){
    const q=S.qs[S.i], box=$(".mj-ang-scene");
    box.classList.toggle("drag", q.mode==="trace");
    box.innerHTML = `<svg viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="xMidYMid meet" ${q.mode==="trace"?'tabindex="0" ':""}role="img" aria-label="${q.mode==="trace"?"Angle à tracer : fais tourner le deuxième côté":"Angle à estimer"}">
      <g class="mj-ang-ref"></g><g class="mj-ang-proto"></g><g class="mj-ang-fig"></g><g class="mj-ang-sweep"></g><g class="mj-ang-cmp"></g><g class="mj-ang-handle"></g></svg>`;
    svg = box.querySelector("svg"); S.O = null;
    if(q.mode==="trace") bindDrag(q);
    draw();
  }
  function bindDrag(q){
    const toSvg = e => { const pt=svg.createSVGPoint(); pt.x=e.clientX; pt.y=e.clientY; const m=svg.getScreenCTM(); return m ? pt.matrixTransform(m.inverse()) : {x:0,y:0}; };
    let drag=false;
    const setFrom = e => { const p=toSvg(e), dx=p.x-O.x, dy=p.y-O.y; if(dx*dx+dy*dy<100) return; S.cur = norm(Math.round(Math.atan2(-dy,dx)*180/Math.PI)); draw(); };
    svg.addEventListener("pointerdown", e=>{ if(S.phase!=="ask") return; drag=true; try{ svg.setPointerCapture(e.pointerId); }catch(_){} setFrom(e); e.preventDefault(); });
    svg.addEventListener("pointermove", e=>{ if(drag && S.phase==="ask") setFrom(e); });
    const up = ()=>{ drag=false; };
    svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", up);
    svg.addEventListener("keydown", e=>{
      if(S.phase!=="ask") return;
      const st = e.shiftKey ? 5 : 1;
      if(e.key==="ArrowLeft"||e.key==="ArrowUp"){ S.cur=norm(S.cur+st); draw(); e.preventDefault(); }
      else if(e.key==="ArrowRight"||e.key==="ArrowDown"){ S.cur=norm(S.cur-st); draw(); e.preventDefault(); }
      else if(e.key==="Enter"){ e.preventDefault(); validate(); } });
  }
  function showRef(q){
    /* repère : l'angle droit, du côté de l'angle */
    const d = q.mode==="trace" ? sens(q.a1,S.cur) : q.dir, a = q.a1 + d*90, e = P(O,a,150), s1=P(O,q.a1,16), s2=P(O,a,16), s3=P(P(O,q.a1,16),a,16);
    svg.querySelector(".mj-ang-ref").innerHTML = `<path d="M${f1(O.x)} ${f1(O.y)}L${f1(e.x)} ${f1(e.y)}" stroke="#2563eb" stroke-width="2" stroke-dasharray="7 6" opacity=".75"/>
      <path d="M${f1(s1.x)} ${f1(s1.y)}L${f1(s3.x)} ${f1(s3.y)}L${f1(s2.x)} ${f1(s2.y)}" fill="none" stroke="#2563eb" stroke-width="1.6" opacity=".75"/>
      <text x="${f1(P(O,a,172).x)}" y="${f1(P(O,a,172).y)}" dy=".36em" text-anchor="middle" style="font:700 15px Arial,sans-serif" fill="#2563eb">90°</text>`;
  }
  /* ----- une question ----- */
  function question(){
    const q=S.qs[S.i]; S.phase="ask"; S.hint=false; S.est=null;
    if(q.mode==="trace") S.cur = q.init;
    topbar(); scene();
    const n=q.names, nm = ANG(n.join(""));
    const panel = $(".mj-ang-panel");
    if(q.mode==="trace"){
      panel.innerHTML = `<div class="mj-ang-qnum">Angle ${S.i+1} sur ${NQ}</div>
        <p class="mj-ang-prompt">Trace à l'œil un angle ${nm} de <b>${q.target}°</b>.</p>
        <p class="mj-ang-sub">Fais tourner le côté [${n[1]}${n[2]}) : attrape le rond bleu avec la souris, ou utilise les flèches du clavier (Maj + flèche : 5° d'un coup).</p>
        <div class="mj-ang-zone">
          <div class="mj-ang-ans"><button class="btn primary mj-ang-go">Mesurer avec le rapporteur</button></div>
        </div>
        <button class="mj-ang-hint">Montrer l'angle droit (${"−"}20 points)</button>`;
      setTimeout(()=>{ if(svg && alive()) svg.focus({preventScroll:true}); }, 30);
    } else {
      panel.innerHTML = `<div class="mj-ang-qnum">Angle ${S.i+1} sur ${NQ}</div>
        <p class="mj-ang-prompt">Estime la mesure de l'angle ${nm}.</p>
        <p class="mj-ang-sub">À l'œil, sans rapporteur&nbsp;!</p>
        <div class="mj-ang-zone">
          <div class="mj-ang-est"><span class="mj-ang-big">?</span><span class="mj-ang-ty"></span></div>
          <input class="mj-ang-range" type="range" min="0" max="180" step="1" value="90" aria-label="Mon estimation en degrés">
          <div class="mj-ang-ticks" aria-hidden="true"><span>0°</span><span>45°</span><span>90°</span><span>135°</span><span>180°</span></div>
          <div class="mj-ang-ans"><label for="mj-ang-in">Mon estimation&nbsp;:</label><input id="mj-ang-in" type="text" inputmode="numeric" autocomplete="off" placeholder="?"><span>°</span>
            <button class="btn primary mj-ang-go">Vérifier</button></div>
          <p class="mj-ang-warn" role="alert"></p>
        </div>
        <button class="mj-ang-hint">Montrer l'angle droit (${"−"}20 points)</button>`;
      const rg=$(".mj-ang-range"), inp=$("#mj-ang-in");
      const show = v => { $(".mj-ang-est .mj-ang-big").textContent = v==null ? "?" : v+"°"; $(".mj-ang-est .mj-ang-ty").textContent = v==null ? "" : "angle "+type(v); S.est=v; $(".mj-ang-warn").textContent=""; };
      rg.addEventListener("input", ()=>{ const v=+rg.value; inp.value=v; show(v); });
      rg.addEventListener("keydown", e=>{ if(e.key==="Enter"){ e.preventDefault(); inp.value=rg.value; show(+rg.value); validate(); } });
      inp.addEventListener("input", ()=>{ const v=parseEst(inp.value); if(v!=null){ rg.value=v; show(v); } else show(null); });
      inp.addEventListener("keydown", e=>{ if(e.key==="Enter"){ e.preventDefault(); validate(); } });
      inp.focus({preventScroll:true});
    }
    $(".mj-ang-go").onclick = validate;
    $(".mj-ang-hint").onclick = ()=>{ if(S.phase!=="ask" || S.hint) return; S.hint=true; showRef(q); const h=$(".mj-ang-hint"); h.disabled=true; h.textContent="Angle droit affiché (−20 points)"; };
  }
  function parseEst(s){ s=String(s||"").trim().replace(/\s|°/g,"").replace(",","."); if(!/^\d{1,3}(\.\d+)?$/.test(s)) return null; const v=Math.round(parseFloat(s)); return v>=0 && v<=180 ? v : null; }
  function validate(){
    if(!S || S.phase!=="ask") return;
    const q=S.qs[S.i];
    if(q.mode!=="trace"){
      const inp=$("#mj-ang-in"), raw=inp.value.trim();
      const v = raw==="" ? null : parseEst(raw);
      if(v==null){ $(".mj-ang-warn").textContent = raw==="" ? "Déplace le curseur ou écris ton estimation (un nombre entre 0 et 180)." : "Écris un nombre entre 0 et 180."; inp.focus(); return; }
      S.est = v;
    }
    S.phase="anim";
    $(".mj-ang-hint").disabled = true;
    $(".mj-ang-zone").querySelectorAll("input,button").forEach(e=>e.disabled=true);
    reveal(q);
  }
  const wait = ms => new Promise(r=>setTimeout(r, ms));
  async function reveal(q){
    const me=S, ok=()=>alive() && S===me, R=reduced();
    /* mesure lue au rapporteur */
    let a2, m, dir;
    if(q.mode==="trace"){ a2=S.cur; m=between(q.a1,a2); dir = sens(q.a1,a2); }
    else { a2=norm(q.a1+q.dir*q.m); m=q.m; dir=q.dir; }
    S.meas = m; draw();
    const base = protoBase(q.a1, dir), useOuter = dir>0, pg = svg.querySelector(".mj-ang-proto");
    pg.innerHTML = protractor(O, base, useOuter);
    if(!R){ pg.style.transformOrigin = `${O.x}px ${O.y}px`; pg.style.transition="none"; pg.style.opacity="0"; pg.style.transform="scale(.85)";
      void pg.getBoundingClientRect(); pg.style.transition="opacity .45s, transform .45s"; pg.style.opacity="1"; pg.style.transform="scale(1)"; await wait(550); if(!ok()) return; }
    /* balayage de 0 jusqu'à la mesure, sur la bonne graduation */
    const sw = svg.querySelector(".mj-ang-sweep"), dur = R ? 0 : Math.max(700, m*9);
    const drawSweep = v => { const e=P(O,q.a1+dir*v,RP-2), lab=P(O,q.a1+dir*v,RP+26);
      const wedge = v>0.5 ? `<path d="M${f1(O.x)} ${f1(O.y)}L${f1(P(O,q.a1,RP-2).x)} ${f1(P(O,q.a1,RP-2).y)}${arcPath(O,RP-2,q.a1,q.a1+dir*v,dir).replace(/^M[^A]+/,"")}Z" fill="rgba(37,99,235,.13)"/>` : "";
      sw.innerHTML = wedge + `<path d="M${f1(O.x)} ${f1(O.y)}L${f1(e.x)} ${f1(e.y)}" stroke="#2563eb" stroke-width="2.4"/>
        <g transform="translate(${f1(lab.x)} ${f1(lab.y)})"><rect x="-32" y="-17" width="64" height="34" rx="9" fill="#2563eb"/><text y="0" dy=".36em" text-anchor="middle" style="font:800 19px Arial,sans-serif" fill="#fff">${Math.round(v)}°</text></g>`; };
    if(dur){ await new Promise(res=>{ const t0=performance.now(); const st=now=>{ if(!ok()) return; const k=Math.min(1,(now-t0)/dur), e=1-Math.pow(1-k,3); drawSweep(m*e); if(k<1) requestAnimationFrame(st); else res(); }; requestAnimationFrame(st); }); if(!ok()) return; }
    else drawSweep(m);
    await wait(R?100:350); if(!ok()) return;
    /* comparaison : ton estimation (ou l'angle demandé) en pointillés */
    const cmpA = q.mode==="trace" ? q.a1 + dir*q.target : q.a1 + q.dir*S.est, cmpV = q.mode==="trace" ? q.target : S.est;
    const ce = P(O,cmpA,205), cl = P(O,cmpA,228);
    const col = q.mode==="trace" ? "#1f9d55" : "#e8590c";
    const gap = Math.abs((q.mode==="trace" ? m : S.est) - (q.mode==="trace" ? q.target : m));
    if(gap>0) svg.querySelector(".mj-ang-cmp").innerHTML = `<path d="M${f1(O.x)} ${f1(O.y)}L${f1(ce.x)} ${f1(ce.y)}" stroke="${col}" stroke-width="2.6" stroke-dasharray="9 6"/>
      <g transform="translate(${f1(cl.x)} ${f1(cl.y)})"><rect x="-${q.mode==="trace"?54:74}" y="-15" width="${q.mode==="trace"?108:148}" height="30" rx="8" fill="#fff" stroke="${col}" stroke-width="2"/><text y="0" dy=".36em" text-anchor="middle" style="font:700 14px Arial,sans-serif" fill="${col}">${q.mode==="trace" ? "demandé : "+cmpV+"°" : "estimation : "+cmpV+"°"}</text></g>`;
    result(q, m, gap);
  }
  function result(q, m, gap){
    S.phase="res";
    let pts = points(gap); if(S.hint) pts = Math.max(0, pts-20);
    S.res[S.i] = pts; S.score += pts; topbar();
    const cls = pts>=60 ? "ok" : pts>=25 ? "mid" : "ko", nm=ANG(q.names.join(""));
    let h = `<p class="mj-ang-verdict">${verdict(gap)} <span style="white-space:nowrap">+${pts} point${pts>1?"s":""}</span></p>`;
    if(q.mode==="trace"){
      h += `<p>Le rapporteur indique que ton angle ${nm} mesure <b>${m}°</b>. On demandait <b>${q.target}°</b>${gap ? ` : écart de <b>${gap}°</b>` : " : parfait"}.</p>`;
      const tT=type(q.target), tM=type(m);
      h += `<p>Un angle de ${q.target}° est ${TYPEDEF[tT]}.</p>`;
      if(tT!==tM && tT!=="droit" && tM!=="droit") h += `<p>Ton angle est ${tM} : ${tT==="aigu" ? "il fallait le fermer davantage, moins ouvert qu'un angle droit" : "il fallait l'ouvrir davantage, plus qu'un angle droit"}.</p>`;
      else if(gap>10) h += `<p>Astuce : trace d'abord un angle droit (90°) dans ta tête, puis sa moitié (45°), et ajuste.</p>`;
    } else {
      h += `<p>Le rapporteur indique <b>${m}°</b>. Tu avais estimé <b>${S.est}°</b>${gap ? ` : écart de <b>${gap}°</b>` : ""}.</p>`;
      h += `<p>${nm} = ${m}° : c'est ${TYPEDEF[type(m)]}.</p>`;
      const tE=type(S.est), tM=type(m);
      if((tE==="aigu" && tM==="obtus") || (tE==="obtus" && tM==="aigu"))
        h += `<p>Attention : ${S.est}° est la mesure d'un angle ${tE}. Compare d'abord avec un angle droit : cet angle est ${tM==="obtus" ? "plus ouvert" : "moins ouvert"} qu'un angle droit, donc sa mesure est ${tM==="obtus" ? "plus grande" : "plus petite"} que 90°.</p>`;
      else if(q.trap!=null && gap>8) h += `<p>${q.trap===3 ? "L'angle est tourné, mais sa mesure ne change pas : seule l'ouverture entre les côtés compte." : "La longueur des côtés ne change pas la mesure de l'angle : seule l'ouverture entre les côtés compte."}</p>`;
      else if(gap>15) h += `<p>Astuce : un angle droit mesure 90° et sa moitié 45°. Compare l'angle avec ces repères avant de choisir.</p>`;
    }
    if(S.hint && pts<points(gap)) h += `<p style="font-size:.92rem">(−20 points pour l'aide de l'angle droit.)</p>`;
    const last = S.i===NQ-1;
    $(".mj-ang-zone").innerHTML = `<div class="mj-ang-fb ${cls}" role="status">${h}</div>`;
    const hb=$(".mj-ang-hint"); hb.outerHTML = `<button class="btn primary mj-ang-next">${last ? "Voir mon résultat" : "Angle suivant →"}</button>`;
    const nx=$(".mj-ang-next"); nx.onclick=()=>{ if(last) end(); else { S.i++; question(); } }; nx.focus({preventScroll:true});
    const sub=$(".mj-ang-sub"); if(sub) sub.remove();
  }
  function end(){
    const lv=S.lv, st=starsFor(S.score), rec = data.best[lv]==null || S.score>data.best[lv];
    if(rec) data.best[lv]=S.score; data.stars[lv]=Math.max(data.stars[lv]||0, st); save(data);
    S.phase="end";
    const box=document.createElement("div"); box.className="mj-ang-end";
    box.innerHTML = `<div class="mj-ang-endbox" role="dialog" aria-label="Résultat du niveau"><h3>${st===3?"Un vrai rapporteur dans l'œil !":st===2?"Très bien !":st===1?"C'est un bon début !":"Courage, recommence !"}</h3>
      <div class="mj-ang-big">${STARS(st)}</div>
      <p><b>${S.score}</b> points sur ${NQ*100}</p>
      ${rec && S.score>0 ? `<p class="mj-ang-rec">Nouveau record&nbsp;!</p>` : `<p>Record&nbsp;: ${data.best[lv]} points</p>`}
      <p style="color:var(--muted);font-size:.95rem">${st<3 ? "3 étoiles à partir de 640 points (environ 5° d'écart en moyenne)." : "Tu as toutes les étoiles de ce niveau."}</p>
      <div class="mj-ang-row"><button class="btn mj-ang-again">Rejouer ce niveau</button>${lv<LV.length-1?`<button class="btn primary mj-ang-nextlv">Niveau suivant →</button>`:""}<button class="btn mj-ang-menu-b">Tous les niveaux</button></div></div>`;
    GAME.appendChild(box);
    box.querySelector(".mj-ang-again").onclick=()=>start(lv);
    const n=box.querySelector(".mj-ang-nextlv"); if(n) n.onclick=()=>start(lv+1);
    box.querySelector(".mj-ang-menu-b").onclick=menu;
    (n || box.querySelector(".mj-ang-again")).focus({preventScroll:true});
  }
  menu();
}
return {init, _t:{LV, gen, between, sens, type, points, protoBase, place, VW, VH, RP, P}};
})();
