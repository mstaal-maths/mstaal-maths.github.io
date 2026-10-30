/* La balance (4e, équations) : des boîtes « x » (toutes du même poids inconnu), des poids de 1 et, aux derniers
   niveaux, des ballons qui tirent vers le haut (−1). On enlève, on ajoute ou on partage la même chose des deux
   côtés pour isoler x ; l'équation correspondante s'écrit sous la balance à chaque étape.
   Toute la partie mathématique se fait avec des entiers : un plateau = {a, c} représente l'expression a·x + c. */
window.MJ_BALANCE = (function(){
"use strict";
const KEY = "staal-mj-balance4", NB = 5;
const MAXW = 20, MAXB = 15;            // au plus 20 poids et 15 ballons sur un plateau
const LEVELS = [
  {nom:"x + a = b",          titre:"Enlever des poids"},
  {nom:"ax = b",             titre:"Partager en tas égaux"},
  {nom:"ax + b = c",         titre:"Enlever, puis partager"},
  {nom:"x des deux côtés",   titre:"Des boîtes des deux côtés"},
  {nom:"Des ballons",        titre:"Les ballons tirent vers le haut", add:true},
  {nom:"Solution négative",  titre:"Quand x est négatif", add:true}
];
const rnd = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const pick = t => t[Math.floor(Math.random()*t.length)];
const M = n => (n < 0 ? "−" : "") + Math.abs(n);           // vrai signe moins
const X = h => h ? "<i>x</i>" : "x";
const reduceMotion = () => { try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } };

/* ---------- écriture des expressions ---------- */
function expr(s, h){
  let t = "";
  if(s.a) t = (s.a === 1 ? "" : s.a === -1 ? "−" : M(s.a)) + X(h);
  if(s.c){ if(t) t += (s.c > 0 ? " + " : " − ") + Math.abs(s.c); else t = M(s.c); }
  return t || "0";
}
/* une opération faite des deux côtés : d = {a, c} ajouté aux deux plateaux, ou {div:n} */
function opTxt(d, h){
  if(d.div) return "÷ " + d.div;
  let t = "";
  if(d.a) t = (d.a < 0 ? "− " : "+ ") + (Math.abs(d.a) === 1 ? "" : Math.abs(d.a)) + X(h);
  if(d.c) t += (t ? " " : "") + (d.c < 0 ? "− " : "+ ") + Math.abs(d.c);
  return t;
}
const eqTxt = (L, R, h) => expr(L, h) + " = " + expr(R, h);
const val = (s, x) => s.a*x + s.c;
const same = (p, q) => p.a === q.a && p.c === q.c;
const sub = (p, q) => ({a:p.a-q.a, c:p.c-q.c});
const cl = s => ({a:s.a, c:s.c});

/* ---------- énoncés ---------- */
/* chaque énoncé : {L, R, x} avec L.a·x + L.c = R.a·x + R.c ; plateaux limités pour rester lisibles */
function okSide(s){ return s.a >= 0 && s.a <= 5 && s.c <= 15 && s.c >= -8; }
function gen1(lvl){
  let L, R, x;
  if(lvl === 0){ x = rnd(1,9); const a = rnd(1, Math.min(8, 15-x)); L = {a:1, c:a}; R = {a:0, c:x+a}; }
  else if(lvl === 1){ const a = rnd(2,5); x = rnd(a >= 4 ? 1 : 2, Math.floor(15/a)); if(x === 1 && Math.random() < .6) x = 2; if(a*x > 15) x = Math.floor(15/a);
    L = {a, c:0}; R = {a:0, c:a*x}; }
  else if(lvl === 2){ const a = rnd(2,4); x = rnd(1, Math.min(4, Math.floor(14/a))); const b = rnd(1, Math.min(7, 15-a*x)); L = {a, c:b}; R = {a:0, c:a*x+b}; }
  else if(lvl === 3){ const aL = rnd(2,5), aR = rnd(1, aL-1), k = aL-aR; x = rnd(1, Math.min(5, Math.floor(14/k)));
    const cL = Math.random() < .15 ? 0 : rnd(1, Math.min(8, 15-k*x)); L = {a:aL, c:cL}; R = {a:aR, c:k*x+cL}; }
  else if(lvl === 4){ /* des ballons (constantes négatives), solution positive */
    x = rnd(1,5);
    if(Math.random() < .45){ const a = rnd(1,4); const b = rnd(1, 8); L = {a, c:-b}; R = {a:0, c:a*x-b}; }
    else { const aL = rnd(2,5), aR = rnd(1, aL-1), k = aL-aR; const d = rnd(-6, 10); L = {a:aL, c:-(k*x - d)}; R = {a:aR, c:d}; }
    if(L.c >= 0 && R.c >= 0) return null;          // il faut au moins un ballon
  }
  else { /* solution négative */
    x = -rnd(1,6);
    const f = rnd(0,2);
    if(f === 0){ const a = rnd(1, 9); L = {a:1, c:a}; R = {a:0, c:x+a}; }
    else if(f === 1){ const a = rnd(2,4); const b = rnd(-6, 12); L = {a, c:b}; R = {a:0, c:a*x+b}; }
    else { const aL = rnd(2,5), aR = rnd(1, aL-1), k = aL-aR; const cL = rnd(-5, 12); L = {a:aL, c:cL}; R = {a:aR, c:k*x+cL}; }
    if(R.c === 0 && L.c === 0) return null;
  }
  if(!okSide(L) || !okSide(R)) return null;
  if(val(L, x) !== val(R, x)) return null;
  if(L.a === 1 && L.c === 0 && R.a === 0) return null;   // déjà résolue
  if(Math.random() < .35){ const t = L; L = R; R = t; }  // la boîte peut être à droite
  return {L, R, x};
}
/* les étapes de la méthode habituelle (celle du coup de pouce) */
function path(L, R){
  const out = []; let P = cl(L), Q = cl(R), sw = false;
  if(P.a < Q.a){ [P, Q] = [Q, P]; sw = true; }
  if(Q.a){ P.a -= Q.a; Q.a = 0; out.push([cl(P), cl(Q)]); }
  if(P.c){ Q.c -= P.c; P.c = 0; out.push([cl(P), cl(Q)]); }
  if(P.a > 1){ Q.c /= P.a; P.a = 1; out.push([cl(P), cl(Q)]); }
  return sw ? out.map(([a, b]) => [b, a]) : out;
}
function gen(lvl){
  for(let k = 0; k < 500; k++){ const e = gen1(lvl);
    /* pendant la résolution, pas plus de 15 poids ni de 12 ballons sur un plateau */
    if(e && path(e.L, e.R).every(st => st.every(t => t.c <= 15 && t.c >= -12))) return e; }
  return {L:{a:1,c:2}, R:{a:0,c:5}, x:3};
}
function genSet(lvl){
  const out = [], seen = new Set();
  for(let k = 0; out.length < NB && k < 2000; k++){ const e = gen(lvl), s = eqTxt(e.L, e.R); if(seen.has(s) && k < 1500) continue; seen.add(s); out.push(e); }
  return out;
}
/* nombre d'étapes « normal » : enlever les x en trop, enlever (ou compenser) les nombres du côté des x, partager */
function par(e){
  let P = e.L, Q = e.R; if(P.a < Q.a){ const t = P; P = Q; Q = t; }
  return (Q.a > 0 ? 1 : 0) + (P.c !== 0 ? 1 : 0) + (P.a - Q.a > 1 ? 1 : 0);
}
function solvedX(L, R){
  if(L.a === 1 && L.c === 0 && R.a === 0) return R.c;
  if(R.a === 1 && R.c === 0 && L.a === 0) return L.c;
  return null;
}
/* le coup de pouce : ce qu'il serait judicieux de faire maintenant */
function hint(L, R){
  let P = L, Q = R, cP = "à gauche", cQ = "à droite";
  if(P.a < Q.a){ P = R; Q = L; cP = "à droite"; cQ = "à gauche"; }
  if(Q.a > 0) return `Il y a des boîtes <i>x</i> des deux côtés. Enlève ${Q.a === 1 ? "une boîte" : Q.a+" boîtes"} <i>x</i> de chaque côté : il n'en restera plus que d'un côté.`;
  const bx = P.a > 1 ? "Les boîtes sont" : "La boîte est", seul = P.a > 1 ? "les boîtes seules" : "la boîte seule";
  if(P.c > 0){
    if(Q.c >= P.c) return `${bx} ${cP}, avec ${P.c} poids. Enlève ${P.c} poids de chaque côté pour laisser ${seul}.`;
    return `Il faudrait enlever ${P.c} poids des deux côtés, mais il n'y en a pas assez ${cQ}. Ajoute plutôt ${P.c} ballon${P.c>1?"s":""} de chaque côté : un poids et un ballon s'annulent.`;
  }
  if(P.c < 0) return `${bx} ${cP}, avec ${-P.c} ballon${P.c<-1?"s":""}. Ajoute ${-P.c} poids de chaque côté : chaque poids annule un ballon.`;
  if(P.a > 1) return `Il ne reste que des boîtes ${cP} : ${P.a} boîtes. Divise les deux côtés par ${P.a} pour n'en garder qu'une.`;
  return "Il ne reste qu'une boîte : c'est gagné !";
}

/* ---------- état ---------- */
let R0 = null, G = null, ST = null, raf = 0, theta = 0, thetaTo = 0, busy = false;
const $ = s => R0.querySelector(s);
function load(){ try{ const o = JSON.parse(localStorage.getItem(KEY) || "{}"); return o && typeof o === "object" ? o : {}; }catch(e){ return {}; } }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(ST)); }catch(e){} }

/* ---------- styles ---------- */
const CSS = `
.mj-bal{--c:var(--c4);display:grid;gap:10px;color:var(--ink)}
.mj-bal *{box-sizing:border-box}
.mj-bal-top{display:flex;gap:10px;align-items:center;flex-wrap:wrap;position:relative}
.mj-bal-lvls{display:flex;gap:6px;flex-wrap:wrap;flex:1 1 auto}
.mj-bal-lv{font:inherit;cursor:pointer;border:2px solid var(--line);background:var(--surface);color:var(--ink);border-radius:12px;padding:5px 11px;text-align:left;line-height:1.25;min-width:0}
.mj-bal-lv b{display:block;font-size:.8rem;color:var(--c);text-transform:uppercase;letter-spacing:.04em}
.mj-bal-lv span{font-size:.92rem;font-weight:600;white-space:nowrap}
.mj-bal-lv small{display:block;font-size:.78rem;color:var(--muted);letter-spacing:.08em}
.mj-bal-lv[aria-pressed="true"]{border-color:var(--c);box-shadow:inset 0 0 0 1px var(--c);background:color-mix(in srgb,var(--c) 9%,var(--surface))}
.mj-bal-lv:hover{border-color:var(--c)}
.mj-bal-help{flex:none;margin:0;border:0;padding:0;margin-left:auto}
.mj-bal-help summary{cursor:pointer;font-weight:600;list-style:none;border:2px solid var(--line);background:var(--surface);border-radius:999px;padding:6px 14px}
.mj-bal-help summary::-webkit-details-marker{display:none}
.mj-bal-help summary:hover,.mj-bal-help[open] summary{border-color:var(--c)}
.mj-bal-hbox{position:absolute;right:0;top:calc(100% + 6px);z-index:20;width:min(620px,100%);background:var(--surface);border:2px solid var(--c);border-radius:14px;padding:12px 16px;box-shadow:0 12px 32px rgba(0,0,0,.18);font-size:.97rem}
.mj-bal-hbox ul{margin:0 0 10px;padding-left:1.2em;display:grid;gap:5px}
.mj-bal-main{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(300px,1fr);gap:12px;align-items:start}
.mj-bal-stage{background:#eef6f1;border:2px solid var(--line);border-radius:16px;padding:6px 10px 10px;color:#14213d;display:grid;gap:4px}
.mj-bal-svg{display:block;width:100%;height:auto;max-height:350px;user-select:none;-webkit-user-select:none}
.mj-bal-svg text{font-family:var(--f-body);pointer-events:none}
.mj-bal-it{cursor:pointer;outline:none}
.mj-bal-it .in{transition:transform .12s;pointer-events:none}
.mj-bal-it .hit{fill:transparent}
.mj-bal-it:hover .in,.mj-bal-it:focus-visible .in{transform:translateY(-4px)}
.mj-bal-it .hl{opacity:0;transition:opacity .12s}
.mj-bal-it:hover .hl,.mj-bal-it:focus-visible .hl{opacity:1}
.mj-bal-svg.lock .mj-bal-it{cursor:default}
.mj-bal-svg.lock .mj-bal-it:hover .in{transform:none}
.mj-bal-svg.lock .mj-bal-it:hover .hl{opacity:0}
.mj-bal-new .in{animation:mjBalIn .32s ease-out}
.mj-bal-gout{animation:mjBalOut .38s ease-in forwards;pointer-events:none}
.mj-bal-gup{animation:mjBalUp .5s ease-in forwards;pointer-events:none}
.mj-bal-gpop{animation:mjBalPop .35s ease-out forwards;pointer-events:none;transform-box:fill-box;transform-origin:center}
.mj-bal-fade{transition:opacity .4s;opacity:.08}
@keyframes mjBalIn{from{transform:translateY(-14px) scale(.7);opacity:0}to{transform:none;opacity:1}}
@keyframes mjBalOut{to{transform:translateY(40px);opacity:0}}
@keyframes mjBalUp{to{transform:translateY(-90px);opacity:0}}
@keyframes mjBalPop{0%{transform:scale(1);opacity:1}60%{transform:scale(1.5);opacity:.6}100%{transform:scale(1.8);opacity:0}}
.mj-bal-eq{display:flex;align-items:center;justify-content:center;gap:.5em;font-family:var(--f-display);font-weight:800;font-size:1.9rem;line-height:1.2;min-height:2.6rem;color:#14213d;flex-wrap:wrap}
.mj-bal-eq .s{min-width:1.2em;text-align:center}
.mj-bal-eq.ko .s{color:#c43c3c}
.mj-bal-eq .mj-bal-tag{font-family:var(--f-body);font-size:.95rem;font-weight:600;color:#9a3412;background:#ffedd5;border-radius:999px;padding:2px 10px}
.mj-bal-eq.ok .mj-bal-tag{color:#166534;background:#dcfce7}
.mj-bal-sc{position:relative}
.mj-bal-add{position:absolute;left:2px;right:2px;bottom:2px;display:flex;justify-content:space-between;gap:8px;pointer-events:none}
.mj-bal-add>div{display:flex;gap:6px;align-items:center;pointer-events:auto}
.mj-bal-add button{font:inherit;font-size:.86rem;font-weight:600;cursor:pointer;border:2px solid #9aa7bd;background:rgba(255,255,255,.92);color:#14213d;border-radius:10px;padding:3px 9px;display:inline-flex;gap:6px;align-items:center}
.mj-bal-add button:hover{border-color:#0b8457}
.mj-bal-add svg{width:18px;height:20px}
.mj-bal-side{background:var(--surface);border:2px solid var(--line);border-radius:16px;padding:12px 14px;display:grid;gap:10px;align-content:start}
.mj-bal-head{display:flex;justify-content:space-between;align-items:baseline;gap:8px;flex-wrap:wrap}
.mj-bal-head h3{font-size:1.15rem}
.mj-bal-stars{color:#e0a100;letter-spacing:.1em;font-size:1.05rem;white-space:nowrap}
.mj-bal-stars .off{color:var(--line)}
.mj-bal-steps{font-size:.95rem;color:var(--muted)}
.mj-bal-steps b{color:var(--ink)}
.mj-bal-hist{list-style:none;margin:0;padding:8px 10px;background:var(--paper);border-radius:10px;display:grid;gap:2px;max-height:186px;overflow:auto;font-variant-numeric:tabular-nums}
.mj-bal-hist li{display:flex;justify-content:space-between;align-items:center;gap:10px;font-weight:600;font-size:1.05rem}
.mj-bal-hist li .op{font-size:.85rem;font-weight:600;color:var(--c);border:1.5px solid color-mix(in srgb,var(--c) 45%,transparent);border-radius:999px;padding:0 8px;white-space:nowrap}
.mj-bal-hist li.cur{color:var(--c)}
.mj-bal-row{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.mj-bal-row .lab{font-size:.92rem;font-weight:600;margin-right:2px}
.mj-bal-side .btn{padding:7px 14px;border-radius:10px}
.mj-bal-div{min-width:3.4em}
.mj-bal-dl{font-size:.92rem;font-weight:600;margin-bottom:4px}
.mj-bal-msg{border-radius:10px;padding:9px 12px;font-size:.95rem;line-height:1.45;background:var(--paper)}
.mj-bal-msg.ok{background:var(--okbg);color:var(--ink)}
.mj-bal-msg.ok b:first-child{color:var(--ok)}
.mj-bal-msg.warn{background:var(--warnbg)}
.mj-bal-msg.warn b:first-child{color:var(--warn)}
.mj-bal-msg.ko{background:var(--kobg)}
.mj-bal-msg.ko b:first-child{color:var(--ko)}
.mj-bal-ver{display:grid;gap:4px;font-size:.96rem;background:var(--okbg);border-radius:10px;padding:10px 12px}
.mj-bal-ver>div:first-child{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 10px}
.mj-bal-nw{white-space:nowrap}
.mj-bal-ver .l{font-variant-numeric:tabular-nums;font-weight:600}
.mj-bal-big{font-family:var(--f-display);font-size:1.5rem;font-weight:800;color:var(--ok)}
.mj-bal-end{display:grid;gap:8px}
.mj-bal-end table{border-collapse:collapse;font-size:.95rem}
.mj-bal-end td{padding:2px 8px;border-bottom:1px solid var(--line)}
@media (max-width:900px){.mj-bal-main{grid-template-columns:1fr}}
@media (prefers-reduced-motion: reduce){.mj-bal *{animation:none!important;transition:none!important}}
`;

/* ---------- dessin de la balance ---------- */
const PX = 380, PY = 278, ARM = 235;      // pivot et demi-fléau (coordonnées du SVG, 760 de large)
const PLATE = 252, HALF = 142;            // dessus des plateaux au repos, demi-largeur d'un plateau
const GCOL = ["#1f77d0", "#e0751b", "#8b3fd6", "#0f9b6c", "#d23c6e"];
const BW = 46, BC = 49, WW = 28, WC = 31, WH = 26, WR = 28;   // tailles des boîtes et des poids
function boxSVG(lab){
  const isx = lab === "x";
  return `<rect class="hl" x="-4" y="-4" width="${BW+8}" height="${BW+8}" rx="9" fill="none" stroke="#0b8457" stroke-width="3.5"/>
    <rect x="0" y="0" width="${BW}" height="${BW}" rx="6" fill="#f2b25c" stroke="#a8641b" stroke-width="2.2"/>
    <path d="M3 11H${BW-3}" stroke="#d9913a" stroke-width="2.2"/>
    <text x="${BW/2}" y="${isx ? 36 : 35}" text-anchor="middle" style="font:${isx ? "italic 800 29px" : "800 19px"} Georgia,serif" fill="#4a2a05">${isx ? "x" : M(lab)}</text>`;
}
function wSVG(){
  return `<rect class="hl" x="-4" y="-3" width="${WW+8}" height="${WH+6}" rx="7" fill="none" stroke="#0b8457" stroke-width="3.5"/>
    <circle cx="14" cy="5" r="4.2" fill="none" stroke="#3d4656" stroke-width="2.4"/>
    <path d="M5.5 9.5H22.5L27 26H1Z" fill="#4b5567" stroke="#2f3747" stroke-width="1" stroke-linejoin="round"/>
    <text x="14" y="22.5" text-anchor="middle" style="font:800 13px Arial,sans-serif" fill="#fff">1</text>`;
}
function bSVG(){
  return `<ellipse class="hl" cx="0" cy="0" rx="19" ry="22" fill="none" stroke="#0b8457" stroke-width="3.5"/>
    <ellipse cx="0" cy="0" rx="14.5" ry="17" fill="#e5484d" stroke="#b42a30" stroke-width="1.3"/>
    <ellipse cx="-5" cy="-7" rx="3.4" ry="5.2" fill="#fff" opacity=".45"/>
    <path d="M-3.5 19.5L0 16L3.5 19.5Z" fill="#b42a30"/>
    <text x="0" y="4.5" text-anchor="middle" style="font:800 12px Arial,sans-serif" fill="#fff">−1</text>`;
}
/* positions des objets d'un plateau centré en cx (coordonnées au repos) */
function layout(s, cx){
  const nb = s.a, nw = s.c > 0 ? s.c : 0, nl = s.c < 0 ? -s.c : 0, out = [];
  const bCols = nb ? (nw ? Math.min(3, nb) : Math.min(5, nb)) : 0;
  const wCols = nw ? (nb ? Math.min(4, nw) : Math.min(8, Math.max(4, Math.ceil(nw/3)))) : 0;
  const bw = bCols ? bCols*BC - 3 : 0, ww = wCols ? wCols*WC - 3 : 0, gap = bw && ww ? 12 : 0;
  const x0 = cx - (bw + ww + gap)/2;
  let top = PLATE;
  for(let i = 0; i < nb; i++){ const r = Math.floor(i/bCols), c = i % bCols, y = PLATE - BW - r*BC; top = Math.min(top, y); out.push({k:"x", i, x:x0 + c*BC, y}); }
  const xw = x0 + bw + gap;
  for(let i = 0; i < nw; i++){ const r = Math.floor(i/wCols), c = i % wCols, y = PLATE - WH - r*WR; top = Math.min(top, y); out.push({k:"w", i, x:xw + c*WC, y}); }
  if(nl){
    const per = nl <= 6 ? nl : nl <= 12 ? Math.ceil(nl/2) : Math.ceil(nl/3);
    const by = top - 48;   // centre de la rangée de ballons la plus basse
    for(let i = 0; i < nl; i++){ const r = Math.floor(i/per), c = i % per, n = Math.min(per, nl - r*per);
      out.push({k:"b", i, x:cx + (c - (n-1)/2)*33 + (r%2 ? 9 : 0), y:by - r*38}); }
  }
  return out;
}
/* rangement en n tas égaux (pour diviser) : chaque tas a sa part du plateau */
function layoutGroups(s, cx, n){
  const seg = 2*HALF/n, out = [], tops = [];
  const nb = s.a/n, nw = Math.max(0, s.c)/n, nl = Math.max(0, -s.c)/n;
  for(let g = 0; g < n; g++){
    const gx = cx - HALF + (g + .5)*seg;
    const bc = Math.max(1, Math.min(nb, Math.floor((seg - 4)/BC))), wc = Math.max(1, Math.min(nw, Math.floor((seg - 4)/WC)));
    let top = PLATE;
    for(let i = 0; i < nb; i++){ const r = Math.floor(i/bc), c = i % bc, m = Math.min(bc, nb - r*bc); const y = PLATE - BW - r*BC; top = Math.min(top, y);
      out.push({k:"x", i:g*nb + i, g, x:gx + (c - m/2)*BC + 1.5, y}); }
    const base = top;
    for(let i = 0; i < nw; i++){ const r = Math.floor(i/wc), c = i % wc, m = Math.min(wc, nw - r*wc); const y = base - WH - r*WR - (nb ? 3 : 0); top = Math.min(top, y);
      out.push({k:"w", i:g*nw + i, g, x:gx + (c - m/2)*WC + 1.5, y}); }
    const lc = Math.max(1, Math.floor(seg/33));
    for(let i = 0; i < nl; i++){ const r = Math.floor(i/lc), c = i % lc, m = Math.min(lc, nl - r*lc);
      out.push({k:"b", i:g*nl + i, g, x:gx + (c - (m-1)/2)*33, y:top - 48 - r*38}); }
    tops.push({gx, top: nl ? top - 48 - (Math.ceil(nl/lc)-1)*38 - 24 : top});
  }
  return {out, seg, tops};
}
function panSVG(side, s, opt){
  opt = opt || {};
  const cx = side === "L" ? PX - ARM : PX + ARM, G2 = opt.groups ? layoutGroups(s, cx, opt.groups) : null, its = G2 ? G2.out : layout(s, cx);
  const lab = side === "L" ? "à gauche" : "à droite";
  let g = "";
  /* ficelles des ballons, derrière tout : elles sont attachées au plateau */
  its.filter(t => t.k === "b").forEach(t => { const ex = cx + (t.x - cx)*.3;
    g += `<path d="M${t.x} ${t.y+20}C${t.x} ${t.y+50} ${ex} ${PLATE-40} ${ex} ${PLATE}" fill="none" stroke="#6b7280" stroke-width="1.3"/>`; });
  g += `<path d="M${cx} ${PY}V${PLATE+8}" stroke="#5b6b80" stroke-width="7" stroke-linecap="round"/>
    <rect x="${cx-HALF}" y="${PLATE}" width="${2*HALF}" height="10" rx="5" fill="#7d8a9e" stroke="#56637a" stroke-width="1.2"/>`;
  if(G2) G2.tops.forEach((t, k) => { g += `<rect class="${opt.fade && k ? "mj-bal-fade" : ""}" x="${t.gx - G2.seg/2 + 3}" y="${t.top - 8}" width="${G2.seg - 6}" height="${PLATE - t.top + 6}" rx="9" fill="${GCOL[k]}" fill-opacity=".16" stroke="${GCOL[k]}" stroke-width="2" stroke-dasharray="5 4"/>`; });
  const nOf = {x:s.a, w:Math.max(0, s.c), b:Math.max(0, -s.c)};
  its.forEach(t => {
    const name = t.k === "x" ? "une boîte x" : t.k === "w" ? "un poids" : "un ballon";
    let cls = "mj-bal-it";
    if(opt.groups && opt.fade && t.g > 0) cls += " mj-bal-fade";
    if(opt.isNew && opt.isNew === t.k && t.i === nOf[t.k]-1) cls += " mj-bal-new";
    const inner = t.k === "x" ? boxSVG(opt.reveal !== undefined ? opt.reveal : "x") : t.k === "w" ? wSVG() : bSVG();
    const act = opt.reveal === undefined && !opt.groups;
    /* zone de clic fixe : l'objet se soulève au survol sans que la zone bouge */
    const hit = t.k === "x" ? `<rect class="hit" x="-2" y="-2" width="${BW+4}" height="${BW+4}"/>` : t.k === "w" ? `<rect class="hit" x="-2" y="-2" width="${WW+4}" height="${WH+4}"/>` : `<ellipse class="hit" cx="0" cy="0" rx="17" ry="20"/>`;
    g += `<g class="${cls}" data-s="${side}" data-k="${t.k}" data-i="${t.i}" transform="translate(${t.x} ${t.y})"${act?` tabindex="0" role="button" aria-label="Enlever ${name} ${lab}"`:""}>${act ? hit : ""}<g class="in">${inner}</g></g>`;
  });
  return g;
}
function sceneSVG(){
  return `<svg class="mj-bal-svg" viewBox="0 90 760 262" role="group" aria-label="La balance">
    <rect x="${PX-90}" y="338" width="180" height="13" rx="6.5" fill="#56637a"/>
    <path d="M${PX-15} ${PY}L${PX-30} 340H${PX+30}L${PX+15} ${PY}Z" fill="#7d8a9e" stroke="#56637a" stroke-width="1.5"/>
    <g id="mjBalL"></g><g id="mjBalR"></g>
    <g id="mjBalBeam"><rect x="${PX-ARM-9}" y="${PY-7}" width="${2*ARM+18}" height="14" rx="7" fill="#5b6b80"/>
      <circle cx="${PX-ARM}" cy="${PY}" r="5.5" fill="#cfd6e2"/><circle cx="${PX+ARM}" cy="${PY}" r="5.5" fill="#cfd6e2"/></g>
    <circle cx="${PX}" cy="${PY}" r="10" fill="#cfd6e2" stroke="#56637a" stroke-width="2.5"/>
    <g id="mjBalNeedle"><path d="M${PX} ${PY-11}V${PY-50}" stroke="#c43c3c" stroke-width="4" stroke-linecap="round"/></g>
    <path d="M${PX-24} ${PY-56}A60 60 0 0 1 ${PX+24} ${PY-56}" fill="none" stroke="#9aa7bd" stroke-width="2.2"/>
    <path d="M${PX} ${PY-53}v-9" stroke="#56637a" stroke-width="2.6"/>
  </svg>`;
}
/* place les plateaux selon l'angle du fléau (les plateaux restent horizontaux) */
function pose(th){
  const r = th*Math.PI/180, dy = ARM*Math.sin(r), dx = ARM*(1 - Math.cos(r));
  const b = $("#mjBalBeam"), l = $("#mjBalL"), rr = $("#mjBalR"), n = $("#mjBalNeedle");
  if(!b) return;
  b.setAttribute("transform", `rotate(${th.toFixed(2)} ${PX} ${PY})`);
  n.setAttribute("transform", `rotate(${(th*1.6).toFixed(2)} ${PX} ${PY})`);
  l.setAttribute("transform", `translate(${dx.toFixed(2)} ${(-dy).toFixed(2)})`);
  rr.setAttribute("transform", `translate(${(-dx).toFixed(2)} ${dy.toFixed(2)})`);
}
function tiltTo(t){
  thetaTo = t;
  if(reduceMotion()){ theta = t; pose(theta); return; }
  if(raf) return;
  let v = 0;
  const step = () => {
    raf = 0; if(!R0 || !R0.isConnected) return;
    /* petit ressort amorti : la balance oscille un peu avant de s'arrêter */
    v = v*0.82 + (thetaTo - theta)*0.06; theta += v;
    if(Math.abs(thetaTo - theta) < 0.02 && Math.abs(v) < 0.02){ theta = thetaTo; pose(theta); return; }
    pose(theta); raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
}

/* ---------- interface ---------- */
function init(root){
  if(!document.getElementById("mj-balance-css")){ const st = document.createElement("style"); st.id = "mj-balance-css"; st.textContent = CSS; document.head.appendChild(st); }
  R0 = root; ST = load(); theta = 0; thetaTo = 0; busy = false; if(raf){ cancelAnimationFrame(raf); raf = 0; }
  const lvl = Math.min(LEVELS.length-1, Math.max(0, +ST.lvl || 0));
  root.innerHTML = `<div class="mj-bal">
    <div class="mj-bal-top">
      <div class="mj-bal-lvls" role="group" aria-label="Niveaux"></div>
      <details class="mj-bal-help"${ST.helpSeen ? "" : " open"}><summary>Comment jouer ?</summary><div class="mj-bal-hbox">
        <ul>
          <li>La balance est <b>en équilibre</b> : les deux plateaux pèsent autant. Toutes les boîtes <i>x</i> ont le même poids, qu'on ne connaît pas. Un poids pèse 1.</li>
          <li><b>Clique sur un objet pour l'enlever.</b> Si tu n'enlèves que d'un côté, la balance penche : fais exactement la même chose de l'autre côté.</li>
          <li>Tu peux aussi <b>diviser les deux côtés</b> : chaque plateau est partagé en tas égaux, on n'en garde qu'un.</li>
          <li>But : qu'il ne reste <b>qu'une boîte <i>x</i></b> d'un côté. Moins tu fais d'étapes, plus tu gagnes d'étoiles.</li>
          <li>Aux niveaux 5 et 6, un <b>ballon</b> tire vers le haut : il vaut −1. Un poids et un ballon ensemble s'annulent.</li>
        </ul><button class="btn primary" type="button" data-a="gotit">J'ai compris, on joue !</button></div></details>
    </div>
    <div class="mj-bal-main">
      <div class="mj-bal-stage">
        <div class="mj-bal-sc">${sceneSVG()}<div class="mj-bal-add" hidden></div></div>
        <div class="mj-bal-eq" aria-live="polite"></div>
      </div>
      <aside class="mj-bal-side"></aside>
    </div></div>`;
  const hp = $(".mj-bal-help");
  hp.addEventListener("toggle", () => { if(!hp.open && !ST.helpSeen){ ST.helpSeen = 1; save(); } });
  hp.querySelector('[data-a="gotit"]').onclick = () => { hp.open = false; };
  const svg = $(".mj-bal-svg");
  svg.addEventListener("click", e => { const it = e.target.closest(".mj-bal-it"); if(it && it.hasAttribute("tabindex")) take(it); });
  svg.addEventListener("keydown", e => { if(e.key !== "Enter" && e.key !== " ") return; const it = e.target.closest(".mj-bal-it"); if(it && it.hasAttribute("tabindex")){ e.preventDefault(); take(it, true); } });
  startLevel(lvl);
}
function lvlBar(){
  const lv = ST.lv || {};
  $(".mj-bal-lvls").innerHTML = LEVELS.map((L, i) => { const s = lv[i] ? lv[i].stars : 0;
    return `<button class="mj-bal-lv" type="button" data-l="${i}" aria-pressed="${G && G.lvl === i}" title="${L.titre}"><b>Niveau ${i+1}</b><span>${L.nom}</span><small aria-label="${s ? "record : "+s+" étoiles sur 15" : "pas encore joué"}">${s ? "★ "+s+"/15" : "—"}</small></button>`; }).join("");
  R0.querySelectorAll(".mj-bal-lv").forEach(b => b.onclick = () => { if(!busy) startLevel(+b.dataset.l); });
}
function startLevel(l){
  ST.lvl = l; save();
  G = {lvl:l, set:genSet(l), idx:0, res:[]};
  lvlBar(); startEq();
}
function startEq(){
  const e = G.set[G.idx];
  Object.assign(G, {e, base:{L:cl(e.L), R:cl(e.R)}, cur:{L:cl(e.L), R:cl(e.R)}, steps:0, hist:[{L:cl(e.L), R:cl(e.R)}], undo:[], solved:false, par:par(e), hints:0});
  const add = $(".mj-bal-add");
  if(LEVELS[G.lvl].add){
    const wI = `<svg viewBox="-1 -1 30 29" aria-hidden="true"><g>${wSVG().replace(/<rect class="hl"[^>]*\/>/, "")}</g></svg>`;
    const bI = `<svg viewBox="-16 -19 32 40" aria-hidden="true">${bSVG().replace(/<ellipse class="hl"[^>]*\/>/, "")}</svg>`;
    add.innerHTML = ["L","R"].map(s => `<div role="group" aria-label="Ajouter ${s === "L" ? "à gauche" : "à droite"}">
      <button type="button" data-s="${s}" data-k="w" title="Ajouter un poids ${s==="L"?"à gauche":"à droite"}">${wI}+ 1 poids</button>
      <button type="button" data-s="${s}" data-k="b" title="Ajouter un ballon ${s==="L"?"à gauche":"à droite"}">${bI}+ 1 ballon</button></div>`).join("");
    add.hidden = false;
    add.querySelectorAll("button").forEach(b => b.onclick = () => put(b.dataset.s, b.dataset.k));
  } else { add.hidden = true; add.innerHTML = ""; }
  /* les ballons flottent au-dessus des plateaux : il faut plus de hauteur aux niveaux 5 et 6 */
  $(".mj-bal-svg").setAttribute("viewBox", LEVELS[G.lvl].add ? "0 -10 760 362" : "0 90 760 262");
  drawPans(); tiltTo(0);
  side(); say(G.idx === 0 ? `<b>${LEVELS[G.lvl].titre}.</b> ${G.lvl >= 4 ? "Un ballon vaut −1 : il tire le plateau vers le haut." : "Clique sur un objet pour l'enlever, et fais toujours la même chose des deux côtés."}` : `<b>Nouvelle équation.</b> Isole <i>x</i> en ${G.par} étape${G.par>1?"s":""} si tu peux.`);
  eqLine();
}
function drawPans(opt){
  opt = opt || {};
  $("#mjBalL").innerHTML = panSVG("L", G.cur.L, opt.L || opt);
  $("#mjBalR").innerHTML = panSVG("R", G.cur.R, opt.R || opt);
  $(".mj-bal-svg").classList.toggle("lock", G.solved || busy);
  pose(theta);
}
function pending(){ return {dL:sub(G.cur.L, G.base.L), dR:sub(G.cur.R, G.base.R)}; }
function eqLine(){
  const el = $(".mj-bal-eq"), {dL, dR} = pending(), pend = !same(dL, dR);
  const diff = val(G.cur.R, G.e.x) - val(G.cur.L, G.e.x);
  el.className = "mj-bal-eq" + (pend && diff ? " ko" : G.solved ? " ok" : "");
  el.innerHTML = `<span>${expr(G.cur.L, true)}</span><span class="s">${pend && diff ? "≠" : "="}</span><span>${expr(G.cur.R, true)}</span>`
    + (pend ? `<span class="mj-bal-tag">${diff ? "déséquilibre" : "pas la même chose des deux côtés"}</span>` : G.solved ? `<span class="mj-bal-tag">résolue</span>` : "");
}
function stars(n, max){ return max > 3 ? `<span class="mj-bal-stars" aria-label="${n} étoile${n>1?"s":""} sur ${max}">★ ${n} / ${max}</span>`
  : `<span class="mj-bal-stars" aria-label="${n} étoile${n>1?"s":""} sur ${max}">${"★".repeat(n)}<span class="off">${"★".repeat(max-n)}</span></span>`; }
function side(){
  const a = $(".mj-bal-side");
  if(G.done){ return endScreen(); }
  const got = G.res.reduce((s, r) => s + r.stars, 0);
  const hist = G.hist.map((h, i) => `<li class="${i === G.hist.length-1 ? "cur" : ""}"><span>${eqTxt(h.L, h.R, true)}</span>${h.op ? `<span class="op" title="opération faite des deux côtés">${opTxt(h.op, true)}</span>` : ""}</li>`).join("");
  a.innerHTML = `<div class="mj-bal-head"><h3>Équation ${G.idx+1} / ${NB}</h3>${stars(got, NB*3)}</div>
    <div class="mj-bal-steps">Étapes : <b>${G.steps}</b> · objectif : <b>${G.par}</b> étape${G.par>1?"s":""} ou moins</div>
    <ol class="mj-bal-hist" aria-label="Les étapes">${hist}</ol>
    <div class="mj-bal-act"></div>
    <div class="mj-bal-msg" role="status"></div>`;
  const h = a.querySelector(".mj-bal-hist"); h.scrollTop = h.scrollHeight;
  actions();
}
function actions(){
  const box = $(".mj-bal-act");
  if(G.solved){ verif(box); return; }
  box.innerHTML = `<div class="lab mj-bal-dl">Diviser les deux côtés par :</div><div class="mj-bal-row">${[2,3,4,5].map(n => `<button class="btn mj-bal-div" type="button" data-n="${n}" aria-label="Diviser les deux côtés par ${n}">÷ ${n}</button>`).join("")}</div>
    <div class="mj-bal-row" style="margin-top:8px"><button class="btn" type="button" data-a="undo"${G.undo.length ? "" : " disabled"}>↶ Annuler</button><button class="btn" type="button" data-a="hint">Coup de pouce</button></div>`;
  box.querySelectorAll(".mj-bal-div").forEach(b => b.onclick = () => divide(+b.dataset.n));
  box.querySelector('[data-a="undo"]').onclick = undo;
  box.querySelector('[data-a="hint"]').onclick = () => { const {dL, dR} = pending(); G.hints++;
    say(!same(dL, dR) ? `<b>D'abord :</b> la balance penche. Fais la même chose de l'autre côté, ou clique sur « Annuler ».` : `<b>Coup de pouce :</b> ${hint(G.cur.L, G.cur.R)}`); };
}
function say(h, kind){ const m = $(".mj-bal-msg"); if(m){ m.className = "mj-bal-msg" + (kind ? " " + kind : ""); m.innerHTML = h; } }
function snap(){ G.undo.push(JSON.stringify({base:G.base, cur:G.cur, steps:G.steps, hist:G.hist})); if(G.undo.length > 200) G.undo.shift(); }
function undo(){
  if(busy || !G.undo.length || G.solved) return;
  Object.assign(G, JSON.parse(G.undo.pop()));
  drawPans(); after(); say("<b>Annulé.</b> On revient à l'étape d'avant.");
}
/* description courte d'un changement d'un seul plateau */
function dTxt(d){
  if(d.div) return "divisé par " + d.div;
  const t = [], n = Math.abs(d.a);
  if(d.a < 0) t.push("enlevé " + (n === 1 ? "une boîte <i>x</i>" : n + " boîtes <i>x</i>"));
  if(d.c < 0) t.push((d.a < 0 ? "" : "enlevé ") + (-d.c));
  if(d.c > 0) t.push("ajouté " + d.c);
  return t.length ? t.join(" et ") : "rien fait";
}

/* enlever un objet en cliquant dessus */
function take(el, kb){
  if(busy || G.solved) return;
  const s = el.dataset.s, k = el.dataset.k, P = G.cur[s];
  if(k === "x" ? P.a <= 0 : k === "w" ? P.c <= 0 : P.c >= 0) return;
  snap();
  if(k === "x") P.a--; else if(k === "w") P.c--; else P.c++;
  const tr = el.getAttribute("transform"), inner = el.querySelector(".in").innerHTML;
  drawPans();
  if(!reduceMotion()){ const pan = $(s === "L" ? "#mjBalL" : "#mjBalR"); const w = document.createElementNS("http://www.w3.org/2000/svg","g");
    w.setAttribute("transform", tr); w.innerHTML = `<g class="${k === "b" ? "mj-bal-gup" : "mj-bal-gout"}">${inner}</g>`; w.querySelectorAll(".hl").forEach(h => h.remove());
    pan.appendChild(w); setTimeout(() => w.remove(), 560); }
  if(kb){ const nx = $(`.mj-bal-it[data-s="${s}"][data-k="${k}"]`) || $(`.mj-bal-it[data-s="${s}"]`) || $(".mj-bal-it[tabindex]"); if(nx) nx.focus(); }
  after();
}
/* ajouter un poids ou un ballon (niveaux 5 et 6) */
function put(s, k){
  if(busy || G.solved) return;
  const P = G.cur[s];
  if(k === "w" && P.c >= MAXW){ say(`<b>Le plateau est plein.</b> Il y a déjà ${MAXW} poids.`, "warn"); return; }
  if(k === "b" && P.c <= -MAXB){ say(`<b>Trop de ballons !</b> Il y en a déjà ${MAXB}.`, "warn"); return; }
  snap();
  const before = P.c; P.c += k === "w" ? 1 : -1;
  const popped = (k === "w" && before < 0) || (k === "b" && before > 0);
  drawPans(popped ? {} : {[s]:{isNew:k}});
  if(popped && !reduceMotion()){
    /* un poids et un ballon s'annulent : on montre l'objet qui disparaît avec lui */
    const pan = $(s === "L" ? "#mjBalL" : "#mjBalR"), cx = s === "L" ? PX - ARM : PX + ARM;
    const its = layout({a:P.a, c:before}, cx), t = its.filter(o => o.k === (k === "w" ? "b" : "w")).pop();
    if(t){ const g = document.createElementNS("http://www.w3.org/2000/svg","g");
      g.innerHTML = `<g transform="translate(${t.x} ${t.y})"><g class="mj-bal-gpop">${t.k === "b" ? bSVG() : wSVG()}</g></g><g transform="translate(${t.x+(t.k==="b"?-12:0)} ${t.y-(t.k==="b"?30:20)})"><g class="mj-bal-gout">${k === "w" ? wSVG() : `<g transform="translate(12 14)">${bSVG()}</g>`}</g></g>`;
      g.querySelectorAll(".hl").forEach(h => h.remove()); pan.appendChild(g); setTimeout(() => g.remove(), 600); }
  }
  after(popped ? (k === "w" ? "Un poids et un ballon s'annulent : pouf !" : "Un ballon et un poids s'annulent : pouf !") : "");
}
/* après chaque geste : la balance penche-t-elle ? l'opération est-elle faite des deux côtés ? */
function after(note){
  const {dL, dR} = pending();
  if(same(dL, dR) && (dL.a || dL.c)) commit(dL);
  const p = pending(), pend = !same(p.dL, p.dR);
  const diff = val(G.cur.R, G.e.x) - val(G.cur.L, G.e.x);
  tiltTo(pend && diff ? Math.sign(diff)*Math.min(10, 4.5 + 1.2*Math.abs(diff)) : 0);
  eqLine();
  if(G.solved){ return; }
  side();
  const pre = note ? note + " " : "";
  if(pend){
    const stuck = lacks(p);
    if(!diff) say(`${pre}<b>Attention :</b> à gauche, tu as ${dTxt(p.dL)} ; à droite, ${dTxt(p.dR)}. Ce n'est pas la même chose : on ne connaît pas <i>x</i>, il faut faire <b>exactement</b> la même chose des deux côtés.`, "warn");
    else if(stuck) say(`${pre}<b>La balance penche !</b> À gauche, tu as ${dTxt(p.dL)} ; à droite, ${dTxt(p.dR)}. ${stuck} Clique sur « Annuler ».`, "ko");
    else if(!p.dR.a && !p.dR.c) say(`${pre}<b>La balance penche !</b> Tu as ${dTxt(p.dL)} à gauche seulement. Fais la même chose à droite.`, "warn");
    else if(!p.dL.a && !p.dL.c) say(`${pre}<b>La balance penche !</b> Tu as ${dTxt(p.dR)} à droite seulement. Fais la même chose à gauche.`, "warn");
    else say(`${pre}<b>La balance penche !</b> À gauche, tu as ${dTxt(p.dL)} ; à droite, ${dTxt(p.dR)} : ce n'est pas la même chose. Continue, ou clique sur « Annuler ».`, "warn");
  } else if(G.lastCommit){
    const op = G.hist[G.hist.length-1].op;
    say(`${pre}<b>Équilibre !</b> Tu as ${dTxt(op)} des deux côtés : l'équation devient <span class="mj-bal-nw">${eqTxt(G.cur.L, G.cur.R, true)}</span>.`, "ok");
  } else if(note) say(note);
  G.lastCommit = false;
}
/* l'élève ne peut plus refaire la même chose de l'autre côté (niveaux sans ajout) */
function lacks(p){
  if(LEVELS[G.lvl].add) return "";
  /* sans ajout, on ne peut qu'enlever : il faudrait arriver des deux côtés au retrait D (le plus grand des deux) */
  const D = {a:Math.min(p.dL.a, p.dR.a), c:Math.min(p.dL.c, p.dR.c)};
  for(const [s, d] of [["L", p.dL], ["R", p.dR]]){
    const w = s === "L" ? "à gauche" : "à droite";
    if(d.a - D.a > G.cur[s].a) return `Il n'y a plus assez de boîtes ${w} pour faire pareil.`;
    if(d.c - D.c > Math.max(0, G.cur[s].c)) return `Il n'y a plus assez de poids ${w} pour faire pareil.`;
  }
  return "";
}
function commit(d){
  const last = G.hist[G.hist.length-1], lo = last.op;
  const kind = o => o && !o.div ? (o.a && !o.c ? "x" + Math.sign(o.a) : !o.a && o.c ? "c" + Math.sign(o.c) : "m") : "";
  if(lo && kind(lo) === kind(d) && kind(d) !== "m" && G.hist.length > 1){
    /* même sorte d'opération juste après : c'est la même étape (par exemple −1 puis −1 = −2) */
    lo.a += d.a; lo.c += d.c; last.L = cl(G.cur.L); last.R = cl(G.cur.R);
  } else { G.hist.push({L:cl(G.cur.L), R:cl(G.cur.R), op:{a:d.a, c:d.c}}); G.steps++; }
  G.base = {L:cl(G.cur.L), R:cl(G.cur.R)}; G.lastCommit = true;
  checkSolved();
}
function divide(n){
  if(busy || G.solved) return;
  const {dL, dR} = pending();
  if(!same(dL, dR)){ say(`<b>D'abord :</b> la balance penche. Fais la même chose de l'autre côté (ou clique sur « Annuler ») avant de diviser.`, "warn"); return; }
  const bad = [];
  [["L","à gauche"],["R","à droite"]].forEach(([s, w]) => { const P = G.cur[s];
    if(P.a % n) bad.push(`${w}, il y a ${P.a} boîte${P.a>1?"s":""} <i>x</i>`);
    if(P.c % n) bad.push(`${w}, il y a ${Math.abs(P.c)} ${P.c > 0 ? "poids" : "ballon" + (P.c < -1 ? "s" : "")}`); });
  if(bad.length){ say(`<b>Impossible de faire ${n} tas égaux :</b> ${bad[0]}, et ${bad[0].match(/\d+/)[0]} n'est pas divisible par ${n}.`, "ko"); return; }
  snap(); busy = true; drawPans({groups:n});
  const fin = () => {
    G.cur = {L:{a:G.cur.L.a/n, c:G.cur.L.c/n}, R:{a:G.cur.R.a/n, c:G.cur.R.c/n}};
    G.base = {L:cl(G.cur.L), R:cl(G.cur.R)};
    G.hist.push({L:cl(G.cur.L), R:cl(G.cur.R), op:{div:n}}); G.steps++;
    busy = false; drawPans(); checkSolved(); eqLine();
    if(!G.solved){ side(); say(`<b>Équilibre !</b> Chaque plateau a été partagé en ${n} tas égaux ; on en garde un de chaque côté. L'équation devient <span class="mj-bal-nw">${eqTxt(G.cur.L, G.cur.R, true)}</span>.`, "ok"); }
  };
  if(reduceMotion()) return fin();
  setTimeout(() => { if(!R0.isConnected) return; drawPans({groups:n, fade:true}); setTimeout(() => { if(R0.isConnected) fin(); }, 520); }, 750);
}
function checkSolved(){
  const v = solvedX(G.cur.L, G.cur.R);
  if(v === null) return;
  G.solved = true;
  const st = G.steps <= G.par ? 3 : G.steps === G.par + 1 ? 2 : 1;
  G.res.push({eq:eqTxt(G.e.L, G.e.R, true), x:v, steps:G.steps, par:G.par, stars:st, pts:[0,40,70,100][st]});
  side();
  /* la balance de départ, boîtes ouvertes : elles contiennent la solution */
  setTimeout(() => { if(!R0.isConnected || !G.solved) return;
    const keep = G.cur; G.cur = {L:cl(G.e.L), R:cl(G.e.R)}; drawPans({reveal:v}); G.cur = keep; tiltTo(0);
    const el = $(".mj-bal-eq"), P = v < 0 ? `(${M(v)})` : M(v);
    const rp = s => expr(s, true).replace(/^(\d*)<i>x<\/i>/, (m, a) => a ? a + " × " + P : M(v));
    el.className = "mj-bal-eq ok"; el.innerHTML = `<span>${rp(G.e.L)}</span><span class="s">=</span><span>${rp(G.e.R)}</span><span class="mj-bal-tag">les deux côtés valent ${M(val(G.e.L, v))}</span>`;
  }, reduceMotion() ? 0 : 900);
}
function sideTxt(s, x){
  const P = x < 0 ? `(${M(x)})` : String(x);
  if(!s.a) return M(s.c);
  if(!s.c) return s.a === 1 ? M(x) : `${s.a} × ${P} = ${M(s.a*x)}`;
  const sg = s.c > 0 ? "+" : "−";
  if(s.a === 1) return `${M(x)} ${sg} ${Math.abs(s.c)} = ${M(x + s.c)}`;
  return `${s.a} × ${P} ${sg} ${Math.abs(s.c)} = ${M(s.a*x)} ${sg} ${Math.abs(s.c)} = ${M(s.a*x + s.c)}`;
}
function verif(box){
  const r = G.res[G.res.length-1], e = G.e, x = r.x;
  const msg = r.stars === 3 ? (r.steps < r.par ? "encore mieux que l'objectif !" : "le minimum, parfait !") : r.stars === 2 ? `une de plus que l'objectif (${r.par}).` : `l'objectif était ${r.par} : essaie le coup de pouce.`;
  const sv = R0.querySelector(".mj-bal-steps"); if(sv) sv.remove();
  box.innerHTML = `<div class="mj-bal-ver">
      <div><span class="mj-bal-big"><i>x</i> = ${M(x)}</span> ${stars(r.stars, 3)} <span>${r.steps} étape${r.steps>1?"s":""} : ${msg}</span></div>
      <div><b>On vérifie</b> : on remplace <i>x</i> par ${M(x)} dans <span class="mj-bal-nw">${eqTxt(e.L, e.R, true)}</span>.</div>
      <div class="l">À gauche : ${sideTxt(e.L, x)}</div>
      <div class="l">À droite : ${sideTxt(e.R, x)}</div>
      <div>Les deux côtés valent ${M(val(e.L, x))} : <b>${M(x)} est bien la solution.</b> Sur la balance de départ, chaque boîte contient ${M(x)}.</div>
    </div>
    <div class="mj-bal-row" style="margin-top:10px"><button class="btn primary" type="button" data-a="next">${G.idx + 1 < NB ? "Équation suivante →" : "Voir mon score →"}</button></div>`;
  const b = box.querySelector('[data-a="next"]');
  b.onclick = () => { G.idx++; if(G.idx >= NB){ G.done = true; finish(); } else startEq(); };
  setTimeout(() => { if(b.isConnected) b.focus({preventScroll:true}); }, 30);
  const m = R0.querySelector(".mj-bal-msg"); if(m) m.remove();
}
function finish(){
  const tot = G.res.reduce((s, r) => s + r.pts, 0), st = G.res.reduce((s, r) => s + r.stars, 0);
  ST.lv = ST.lv || {}; const o = ST.lv[G.lvl] || {stars:0, best:0};
  G.rec = tot > o.best; ST.lv[G.lvl] = {stars:Math.max(o.stars, st), best:Math.max(o.best, tot)}; save();
  G.tot = tot; G.st = st; lvlBar(); endScreen();
}
function endScreen(){
  const a = $(".mj-bal-side"), next = G.lvl + 1 < LEVELS.length;
  a.innerHTML = `<div class="mj-bal-end">
    <div class="mj-bal-head"><h3>Niveau ${G.lvl+1} terminé !</h3>${stars(G.st, NB*3)}</div>
    <div><span class="mj-bal-big">${G.tot} points</span> sur ${NB*100}${G.rec ? " · <b>nouveau record !</b>" : ` · record : ${ST.lv[G.lvl].best}`}</div>
    <table>${G.res.map(r => `<tr><td>${r.eq}</td><td><i>x</i> = ${M(r.x)}</td><td>${r.steps} ét.</td><td>${stars(r.stars,3)}</td></tr>`).join("")}</table>
    <div class="mj-bal-row"><button class="btn${next ? "" : " primary"}" type="button" data-a="again">Rejouer ce niveau</button>${next ? `<button class="btn primary" type="button" data-a="next">Niveau ${G.lvl+2} →</button>` : ""}</div>
    ${next ? "" : "<p>Tu as fini le dernier niveau. Rejoue pour battre ton record : les équations changent à chaque partie.</p>"}
  </div>`;
  a.querySelector('[data-a="again"]').onclick = () => startLevel(G.lvl);
  const n = a.querySelector('[data-a="next"]'); if(n){ n.onclick = () => startLevel(G.lvl + 1); setTimeout(() => n.isConnected && n.focus({preventScroll:true}), 30); }
}

return {init, _t:{gen, genSet, par, expr, eqTxt, solvedX, hint, sideTxt, opTxt, LEVELS}};
})();
