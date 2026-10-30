/* Le sniper de la droite graduée (6e, nombres décimaux) : un nombre s'affiche, l'élève clique là où il se trouve
   sur la droite graduée ; le score dépend de la précision. Toutes les valeurs sont des entiers en millièmes
   (2,47 → 2470) : aucun calcul à virgule flottante dans la partie mathématique. */
window.MJ_SNIPER = (function(){
const KEY = "staal-mj-sniper6", TIRS = 8, MAXPTS = 100*TIRS;
const rnd = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const pick = a => a[Math.floor(Math.random()*a.length)];
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");

/* ---------- écriture des nombres ---------- */
/* n en millièmes → « 2,47 » (zéros inutiles supprimés) */
function fmt(n){
  n = Math.round(n); const neg = n < 0; n = Math.abs(n);
  const ip = Math.floor(n/1000), fp = n % 1000;
  let s = String(ip);
  if(fp) s += "," + String(fp).padStart(3,"0").replace(/0+$/,"");
  return (neg ? "−" : "") + s;
}
const UNI = ["zéro","un","deux","trois","quatre","cinq","six","sept","huit","neuf","dix","onze","douze","treize","quatorze","quinze","seize","dix-sept","dix-huit","dix-neuf"];
const DIZ = {2:"vingt",3:"trente",4:"quarante",5:"cinquante",6:"soixante"};
/* nombre entier de 0 à 99 en lettres (orthographe rectifiée : traits d'union partout, « vingt-et-un », « quatre-vingts ») ;
   fem : accord au féminin (« vingt-et-une unités ») */
function lettres(n, fem){
  let s;
  if(n < 20) s = UNI[n];
  else if(n < 70){ const d = Math.floor(n/10), u = n % 10; s = DIZ[d] + (u===0 ? "" : u===1 ? "-et-un" : "-" + UNI[u]); }
  else if(n < 80) s = "soixante" + (n===71 ? "-et-onze" : "-" + UNI[n-60]);
  else if(n === 80) s = "quatre-vingts";
  else s = "quatre-vingt-" + UNI[n-80];
  if(fem && /(^|[ -])un$/.test(s)) s += "e";
  return s;
}
const plur = (n, mot) => n > 1 ? mot + "s" : mot;
/* t en millièmes (u = 100 : dixièmes ; u = 10 : centièmes) → écriture en lettres ; deco : « 4 dixièmes et 7 centièmes » */
function enLettres(t, u, deco){
  const ip = Math.floor(t/1000), d = Math.floor(t%1000/100), c = Math.floor(t%100/10);
  const parts = [];
  if(ip) parts.push(lettres(ip, true) + " " + plur(ip, "unité"));
  if(u === 100){ if(d) parts.push(lettres(d) + " " + plur(d, "dixième")); }
  else if(deco && d && c){ parts.push(lettres(d) + " " + plur(d, "dixième")); parts.push(lettres(c) + " " + plur(c, "centième")); }
  else { const k = d*10 + c; if(k) parts.push(lettres(k) + " " + plur(k, "centième")); }
  if(parts.length === 1) return parts[0];
  return parts.slice(0,-1).join(", ") + " et " + parts[parts.length-1];
}

/* ---------- les droites graduées ----------
   a, b : début et fin de la droite ; g : pas des graduations ; lab : un nombre écrit tous les « lab » ;
   mid : graduation un peu plus longue (le milieu) ; t : la cible ; u : précision de la cible ;
   v : précision de la mesure du tir ; T : écarts (en v) pour 100, 70, 40, 15 points. */
const KINDS = {
  ent(){ let t; do t = rnd(1,19)*1000; while(t % 5000 === 0);
    return {a:0, b:20000, g:1000, lab:5000, mid:0, t, u:1000, v:100, T:[1,3,6,10]}; },
  dix(){ const a = rnd(0,6)*1000; let t; do t = a + rnd(1,29)*100; while(t % 1000 === 0);
    return {a, b:a+3000, g:100, lab:1000, mid:500, t, u:100, v:10, T:[2,5,9,15]}; },
  estd(){ const a = rnd(0,5)*1000; let t; do t = a + rnd(1,49)*100; while(t % 1000 === 0);
    return {a, b:a+5000, g:1000, lab:1000, mid:0, t, u:100, v:100, T:[0,1,2,3]}; },
  orig(){ const a = rnd(11,96)*1000; let t; do t = a + rnd(1,19)*100; while(t % 1000 === 0);
    return {a, b:a+2000, g:100, lab:1000, mid:500, t, u:100, v:10, T:[1,3,6,10]}; },
  estc(){ const a = rnd(0,20)*1000; let t;
    do t = a + (Math.random() < .2 ? rnd(1,9)*10 : rnd(1,99)*10); while(t % 100 === 0);
    return {a, b:a+1000, g:100, lab:1000, mid:500, t, u:10, v:10, T:[0,1,2,4]}; },
  cent(){ const a = rnd(0,97)*100; let t; do t = a + rnd(1,29)*10; while(t % 100 === 0);
    return {a, b:a+300, g:10, lab:100, mid:50, t, u:10, v:1, T:[2,5,9,15]}; },
  /* zoom : on vise d'abord la bonne unité sur une droite de 0 à 10, puis on tire sur la droite agrandie */
  zoom(){ let t; do t = Math.random() < .2 ? rnd(0,9)*1000 + rnd(1,9)*10 : rnd(1,999)*10; while(t % 100 === 0);
    const K = Math.floor(t/1000)*1000;
    return {a:K, b:K+1000, g:100, lab:1000, mid:500, t, u:10, v:10, T:[0,1,2,4],
      stages:[{a:0, b:10000, g:1000, lab:1000, mid:0, lo:K, hi:K+1000}]}; },
  /* millièmes : on vise le bon dixième, puis on estime les millièmes entre deux centièmes */
  mil(){ const a = rnd(0,20)*1000; let t; do t = a + rnd(1,999); while(t % 10 === 0);
    const lo = a + Math.floor((t-a)/100)*100;
    return {a:lo, b:lo+100, g:10, lab:100, mid:50, t, u:1, v:1, T:[0,1,2,4],
      stages:[{a, b:a+1000, g:100, lab:1000, mid:500, lo, hi:lo+100}]}; }
};
/* forme sous laquelle la cible est écrite */
function forme(L, f){
  if(f === "frac"){ const den = L.u === 100 ? 10 : 100; L.form = "frac"; L.num = L.t / (1000/den); L.den = den; }
  else if(f === "mots"){ L.form = "mots"; L.mots = enLettres(L.t, L.u, Math.random() < .35); }
  else L.form = "dec";
  return L;
}
const LV = [
  {titre:"Les nombres entiers", desc:"Une graduation = 1. Compte bien les graduations.", gen:()=>forme(KINDS.ent())},
  {titre:"Les dixièmes", desc:"Chaque unité est partagée en 10 : une graduation = 0,1.", gen:()=>forme(KINDS.dix())},
  {titre:"Estimer les dixièmes", desc:"Il n'y a que les unités : imagine les 10 parts entre deux nombres.", gen:()=>forme(KINDS.estd())},
  {titre:"Loin de zéro", desc:"La droite ne commence pas à 0 : lis bien les nombres écrits.", gen:()=>forme(KINDS.orig())},
  {titre:"Estimer les centièmes", desc:"Graduée en dixièmes : place les centièmes à l'œil.", gen:()=>forme(KINDS.estc())},
  {titre:"Les centièmes", desc:"Une graduation = 0,01 : compte bien.", gen:()=>forme(KINDS.cent())},
  {titre:"Le zoom", desc:"Vise d'abord la bonne unité : la droite s'agrandit, puis tire.", gen:()=>forme(KINDS.zoom())},
  {titre:"Les millièmes", desc:"Vise le bon dixième, puis estime les millièmes.", gen:()=>forme(KINDS.mil())},
  {titre:"Fractions décimales", desc:"Le nombre est écrit en fraction décimale.", gen:()=>forme(KINDS[pick(["dix","dix","cent","orig"])](), "frac")},
  {titre:"En lettres", desc:"En lettres, en fraction ou en chiffres : le grand mélange.", gen:()=>{ const k = pick(["dix","orig","cent","estc","estd"]);
     return forme(KINDS[k](), pick(["mots","mots","mots","frac","dec"])); }}
];
LV.forEach(l => l.etoiles = [Math.round(MAXPTS*.4), Math.round(MAXPTS*.6), Math.round(MAXPTS*.8)]);

/* ---------- précision du tir ---------- */
function mesure(L, x){                       // x : position du tir (millièmes, nombre réel)
  const tir = Math.round(x / L.v) * L.v, ec = Math.abs(tir - L.t), e = ec / L.v;
  const pts = e <= L.T[0] ? 100 : e <= L.T[1] ? 70 : e <= L.T[2] ? 40 : e <= L.T[3] ? 15 : 0;
  return {tir, ec, pts};
}
const VERDICT = {100:"Dans le mille !", 70:"Très bon tir !", 40:"Pas loin !", 15:"Presque…", 0:"Raté"};
function etoiles(lv, sc){ return LV[lv].etoiles.filter(s => sc >= s).length; }

/* la cible écrite en HTML (fraction en colonne) ou en texte */
function cibleHTML(L){
  if(L.form === "frac") return `<span class="mj-sniper-fr"><span>${L.num}</span><span>${L.den}</span></span>`;
  if(L.form === "mots") return `<span class="mj-sniper-mots">${esc(L.mots)}</span>`;
  return fmt(L.t);
}
/* le tir, écrit avec autant de décimales que la précision de la mesure (4,90 face à 4,89) */
function fmtTir(L, n){ if(L.u >= 1000) return fmt(n); const dec = L.v === 1 ? 3 : L.v === 10 ? 2 : 1, s = fmt(n);
  const [e, d = ""] = s.split(","); return e + "," + d.padEnd(dec, "0"); }
function cibleTexte(L){ return L.form === "frac" ? L.num + "/" + L.den : L.form === "mots" ? L.mots : fmt(L.t); }
const rangG = k => k === 1 ? "1re" : k + "e";
/* explication courte : où se trouve la cible, et pourquoi */
function explique(L, x){
  let pre = "";
  if(L.form === "frac") pre = `${cibleHTML(L)} = ${fmt(L.t)} (${L.num} ${plur(L.num, L.den===10?"dixième":"centième")}). `;
  if(L.form === "mots") pre = `C'est le nombre ${fmt(L.t)}. `;
  const t = L.t, g = L.g;
  /* confusion classique : 3,07 placé vers 3,7 */
  const P0 = alterne(t);
  if(x !== undefined && P0 && P0.alt >= L.a && P0.alt <= L.b && Math.abs(x - P0.alt) < Math.abs(x - t) && Math.abs(x - P0.alt) <= 2*g)
    return pre + `Attention au zéro : ${fmt(t)} a <b>0 ${P0.zero}</b>. Il est entre ${fmt(P0.lo)} et ${fmt(P0.hi)}, pas vers ${fmt(P0.alt)}.`;
  if(t % g === 0){
    const P = Math.floor(t / L.lab) * L.lab, k = (t - P) / g;
    if(k === 0) return pre + `${fmt(t)} est écrit sous la droite.`;
    return pre + `${fmt(t)}, c'est la ${rangG(k)} graduation après ${fmt(P)} (une graduation = ${fmt(g)}).`;
  }
  const lo = Math.floor(t / g) * g, hi = lo + g, m = lo + g/2, f = Math.round((t - lo) * 10 / g);
  let ou = f <= 2 ? `tout près de ${fmt(lo)}` : f <= 4 ? `un peu avant le milieu (${fmt(m)})` : f === 5 ? `pile au milieu` : f <= 7 ? `un peu après le milieu (${fmt(m)})` : `tout près de ${fmt(hi)}`;
  let rep = "";
  if(lo % L.lab !== 0){ const P = Math.floor(lo / L.lab) * L.lab; rep = ` (${fmt(lo)} est la ${rangG((lo-P)/g)} graduation après ${fmt(P)})`; }
  return pre + `${fmt(t)} est entre ${fmt(lo)} et ${fmt(hi)}${rep} : ${ou}.`;
}
/* le zéro oublié : 3,07 lu comme 3,7 ; 5,207 lu comme 5,27 ; sinon null */
function alterne(t){
  const ip = Math.floor(t/1000), d = Math.floor(t%1000/100), c = Math.floor(t%100/10), m = t%10;
  if(d === 0 && c !== 0 && m === 0) return {alt: ip*1000 + c*100, zero:"dixième", lo: ip*1000, hi: ip*1000 + 100};
  if(c === 0 && m !== 0) return {alt: ip*1000 + d*100 + m*10, zero:"centième", lo: ip*1000 + d*100, hi: ip*1000 + d*100 + 10};
  return null;
}
/* explication quand le premier tir (le choix de l'intervalle avant le zoom) est mauvais */
function expliqueZoom(L, S){
  const t = L.t;
  if(S.hi - S.lo === 1000) return `${fmt(t)} a pour partie entière ${Math.floor(t/1000)} : il est entre ${fmt(S.lo)} et ${fmt(S.hi)}.`;
  return `Le chiffre des dixièmes de ${fmt(t)} est ${Math.floor(t%1000/100)} : il est entre ${fmt(S.lo)} et ${fmt(S.hi)}.`;
}

/* ---------- record ---------- */
function lire(){ try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }catch(e){ return {}; } }
function ecrire(r){ try{ localStorage.setItem(KEY, JSON.stringify(r)); }catch(e){} }

/* ---------- style ---------- */
const CSS = `
.mj-sniper{--sn-ok:#1e8e3e;--sn-ko:#d93025;--sn-gold:#e8a200;color:var(--ink)}
.mj-sniper-top{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:0 0 10px}
.mj-sniper-lv{min-width:52px;height:52px;border-radius:12px;border:2px solid var(--line);background:var(--surface);color:var(--ink);font:inherit;font-weight:700;font-size:1rem;line-height:1;cursor:pointer;display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:4px 6px}
.mj-sniper-lv small{font-size:.72rem;letter-spacing:1px;color:var(--sn-gold);font-weight:700}
.mj-sniper-lv small i{font-style:normal;color:color-mix(in srgb,var(--muted) 40%,transparent)}
.mj-sniper-lv.on{border-color:var(--c);box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 30%,transparent)}
.mj-sniper-rec{margin-left:auto;margin-right:4px;font-weight:600;color:var(--muted);font-size:.95rem}
.mj-sniper-card{border:2px solid var(--line);border-radius:18px;background:var(--surface);padding:14px 18px 16px}
.mj-sniper-head{display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.mj-sniper-lvt{font-family:var(--f-display);font-weight:800;font-size:1.15rem}
.mj-sniper-lvd{color:var(--muted);font-size:.95rem}
.mj-sniper-hud{display:flex;align-items:center;gap:22px;margin:10px 0 6px;flex-wrap:wrap}
.mj-sniper-target{display:flex;align-items:center;gap:12px;min-height:64px;flex:1;min-width:0}
@media (max-width:600px){ .mj-sniper-target{flex-basis:100%} }   /* téléphone : le nombre à viser a sa propre ligne (sinon il chevauche « Tir ») */
.mj-sniper-target .lab{font-size:.95rem;color:var(--muted);font-weight:600}
.mj-sniper-target .val{font-family:var(--f-display);font-weight:800;font-size:2.4rem;line-height:1;color:var(--c);background:color-mix(in srgb,var(--c) 10%,transparent);border:2px solid color-mix(in srgb,var(--c) 45%,transparent);border-radius:14px;padding:6px 16px;display:inline-flex;align-items:center}
.mj-sniper-mots{font-size:1.35rem;line-height:1.25;font-family:var(--f-body);font-weight:700}
.mj-sniper-fr{display:inline-flex;flex-direction:column;align-items:center;line-height:1.05;font-size:.82em;vertical-align:middle}
.mj-sniper-fr>span{padding:0 .18em}
.mj-sniper-fr>span:first-child{border-bottom:.08em solid currentColor}
.mj-sniper-fb .mj-sniper-fr{font-size:.95em}
.mj-sniper-stat{display:flex;flex-direction:column;line-height:1.2}
.mj-sniper-stat b{font-family:var(--f-display);font-size:1.5rem}
.mj-sniper-stat span{font-size:.85rem;color:var(--muted);font-weight:600}
.mj-sniper-dots{display:flex;gap:6px}
.mj-sniper-dots i{width:16px;height:16px;border-radius:50%;border:2px solid var(--line);display:block}
.mj-sniper-dots i.p100{background:var(--sn-gold);border-color:var(--sn-gold)}
.mj-sniper-dots i.p70{background:var(--sn-ok);border-color:var(--sn-ok)}
.mj-sniper-dots i.p40{background:#7cc38a;border-color:#7cc38a}
.mj-sniper-dots i.p15{background:#f0b37e;border-color:#f0b37e}
.mj-sniper-dots i.p0{background:var(--sn-ko);border-color:var(--sn-ko)}
.mj-sniper-dots i.cur{border-color:var(--c);box-shadow:0 0 0 2px color-mix(in srgb,var(--c) 35%,transparent)}
.mj-sniper-board{border-radius:14px;overflow:hidden;background:#fbfcff;border:1.5px solid #c9d4e3;outline:none;position:relative}
.mj-sniper-board:focus-visible{box-shadow:0 0 0 3px var(--c)}
.mj-sniper-board svg{display:block;width:100%;height:auto;cursor:none;user-select:none;-webkit-user-select:none}
.mj-sniper-board.done svg{cursor:default}
.mj-sniper-fb{display:flex;align-items:center;gap:16px;margin-top:12px;min-height:84px}
.mj-sniper-msg{flex:1;border-radius:12px;padding:10px 14px;background:color-mix(in srgb,var(--c) 8%,var(--surface));border:1.5px solid var(--line);line-height:1.5;font-size:1rem}
.mj-sniper-msg.ok{border-color:var(--ok);background:var(--okbg)}
.mj-sniper-msg.ko{border-color:var(--ko);background:var(--kobg)}
.mj-sniper-msg .vd{font-family:var(--f-display);font-weight:800;font-size:1.15rem;margin-right:8px}
.mj-sniper-msg .pts{font-weight:800;color:var(--c)}
.mj-sniper-msg .serie{color:var(--sn-gold);margin-left:6px}
.mj-sniper-msg .num{font-weight:700;white-space:nowrap}
.mj-sniper-fb .btn{white-space:nowrap}
.mj-sniper-end{display:flex;flex-direction:column;gap:6px}
.mj-sniper-end .big{font-family:var(--f-display);font-weight:800;font-size:1.3rem}
.mj-sniper-end .st{color:var(--sn-gold);font-size:1.5rem;letter-spacing:3px}
.mj-sniper-end .st i{font-style:normal;color:color-mix(in srgb,var(--muted) 40%,transparent)}
.mj-sniper-end .acts{display:flex;gap:10px;flex-wrap:wrap}
.mj-sniper-help{margin:0 0 10px;border:2px dashed color-mix(in srgb,var(--c) 45%,var(--line));border-radius:14px;padding:8px 16px;background:var(--surface)}
.mj-sniper-help ul{margin:0;padding-left:1.2em;line-height:1.6}
.mj-sniper-aideb{font:inherit;font-size:.92rem;font-weight:700;border:2px solid var(--c);color:var(--c);background:var(--surface);padding:6px 14px;border-radius:999px;cursor:pointer}
.mj-sniper svg text{font-family:Arial,Helvetica,sans-serif}
@keyframes mjSnBoom{from{r:4;opacity:.9}to{r:34;opacity:0}}
@keyframes mjSnDrop{from{transform:translateY(-26px);opacity:0}to{transform:none;opacity:1}}
.mj-sniper .boom{animation:mjSnBoom .5s ease-out forwards}
.mj-sniper .drop{animation:mjSnDrop .35s ease-out}
@media (prefers-reduced-motion:reduce){.mj-sniper .boom{animation:none;opacity:0}.mj-sniper .drop{animation:none}}
html.ls-1 .mj-sniper-target .val{letter-spacing:.02em}
`;

/* ---------- dessin de la droite graduée ---------- */
const VW = 1100, VH = 210, X0 = 55, W = 990, Y = 128;
function droite(V, opt){                       // V : {a,b,g,lab,mid}, a et b peuvent être non entiers (animation)
  const sp = (V.b - V.a), X = v => X0 + (v - V.a) / sp * W;
  let s = `<path d="M18 ${Y}H${VW-18}" stroke="#15213b" stroke-width="3"/><path d="M${VW-14} ${Y}l-16 -8v16z" fill="#15213b"/>`;
  const pas = [V.g];
  const pxg = V.g / sp * W;
  const n0 = Math.ceil(V.a / V.g - 1e-9), n1 = Math.floor(V.b / V.g + 1e-9);
  if(pxg >= 2.5) for(let n = n0; n <= n1; n++){
    const v = n * V.g, x = X(v); if(x < X0 - 1 || x > X0 + W + 1) continue;
    const big = v % V.lab === 0, mid = V.mid && v % V.mid === 0;
    const h = big ? 22 : mid ? 15 : 9;
    s += `<path d="M${x.toFixed(2)} ${Y-h}V${Y+h}" stroke="#15213b" stroke-width="${big?2.6:mid?2:1.4}"/>`;
  }
  const pxl = V.lab / sp * W, m0 = Math.ceil(V.a / V.lab - 1e-9), m1 = Math.floor(V.b / V.lab + 1e-9);
  for(let n = m0; n <= m1; n++){
    const v = n * V.lab, x = X(v); if(x < X0 - 1 || x > X0 + W + 1) continue;
    if(pxl < 46 && n % Math.ceil(46 / pxl)) continue;
    s += `<text x="${x.toFixed(2)}" y="${Y+52}" text-anchor="middle" font-size="25" font-weight="700" fill="#15213b">${fmt(v)}</text>`;
  }
  return s;
}

/* ---------- le jeu ---------- */
function init(root){
  if(!document.getElementById("mj-sniper-css")){ const st = document.createElement("style"); st.id = "mj-sniper-css"; st.textContent = CSS; document.head.appendChild(st); }
  const rec = lire(); rec.lv = rec.lv || {};
  let lv = Math.min(LV.length-1, Math.max(0, +rec.dernier || 0));
  let G = null;     // partie en cours : {lv, n, score, res:[], L, st (étape), etat}
  root.innerHTML = `<div class="mj-sniper">
    <div class="mj-sniper-top" role="group" aria-label="Niveaux"></div>
    <div class="mj-sniper-help" id="mj-sniper-aide"${Object.keys(rec.lv).length ? " hidden" : ""}><ul>
      <li>Un nombre s'affiche en haut : <b>clique sur la droite</b> à l'endroit exact où il se trouve.</li>
      <li>Plus ton tir est précis, plus tu gagnes de points : 100 points <b>dans le mille</b>, puis 70, 40, 15 ou 0.</li>
      <li>Une série = ${TIRS} tirs. 3 étoiles à partir de ${LV[0].etoiles[2]} points sur ${MAXPTS}.</li>
      <li>Au clavier : flèches <b>←</b> <b>→</b> pour viser (avec Maj : plus vite), <b>Entrée</b> pour tirer, puis <b>Entrée</b> pour le tir suivant.</li>
    </ul></div>
    <div class="mj-sniper-card">
      <div class="mj-sniper-head"><span class="mj-sniper-lvt"></span><span class="mj-sniper-lvd"></span></div>
      <div class="mj-sniper-hud">
        <div class="mj-sniper-target"><span class="lab">Vise</span><span class="val" aria-live="polite"></span></div>
        <div class="mj-sniper-stat"><span>Tir</span><b class="k-n"></b></div>
        <div class="mj-sniper-dots" aria-hidden="true"></div>
        <div class="mj-sniper-stat"><span>Score</span><b class="k-sc"></b></div>
      </div>
      <div class="mj-sniper-board" tabindex="0" aria-label="Droite graduée : clique pour tirer. Au clavier : flèches gauche et droite pour viser, Entrée pour tirer.">
        <svg viewBox="0 0 ${VW} ${VH}" aria-hidden="true"><g class="g-line"></g><g class="g-shot"></g><g class="g-aim"></g></svg>
      </div>
      <div class="mj-sniper-fb"><div class="mj-sniper-msg" aria-live="polite"></div><button class="btn primary mj-sniper-next" hidden></button></div>
    </div>
</div>`;
  const $ = s => root.querySelector(s);
  const top = $(".mj-sniper-top"), board = $(".mj-sniper-board"), svg = board.querySelector("svg"),
        gLine = svg.querySelector(".g-line"), gShot = svg.querySelector(".g-shot"), gAim = svg.querySelector(".g-aim"),
        msg = $(".mj-sniper-msg"), next = $(".mj-sniper-next"), aide = $(".mj-sniper-help");
  const reduit = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function barre(){
    top.innerHTML = LV.map((l,i)=>{ const e = (rec.lv[i]||{}).e || 0;
      return `<button class="mj-sniper-lv${i===lv?" on":""}" data-i="${i}" title="Niveau ${i+1} : ${l.titre}" aria-label="Niveau ${i+1} : ${l.titre}, ${e} étoile${e>1?"s":""}">${i+1}<small>${"★".repeat(e)}<i>${"★".repeat(3-e)}</i></small></button>`; }).join("")
      + `<span class="mj-sniper-rec"></span><button class="mj-sniper-aideb" aria-controls="mj-sniper-aide" aria-expanded="${!aide.hidden}">${aide.hidden ? "Comment jouer ?" : "Fermer l'aide"}</button>`;
    top.querySelector(".mj-sniper-aideb").onclick = () => { aide.hidden = !aide.hidden; barre(); top.querySelector(".mj-sniper-aideb").focus(); };
    top.querySelectorAll(".mj-sniper-lv").forEach(b => b.onclick = () => { lv = +b.dataset.i; partie(); });
    const r = (rec.lv[lv]||{}).best;
    top.querySelector(".mj-sniper-rec").textContent = r !== undefined ? `Record du niveau : ${r} points` : "Pas encore de record";
  }
  function hud(){
    $(".k-n").textContent = `${Math.min(G.n+1, TIRS)} / ${TIRS}`;
    $(".k-sc").textContent = G.score;
    $(".mj-sniper-dots").innerHTML = Array.from({length:TIRS}, (_,i)=>`<i class="${i < G.res.length ? "p"+G.res[i] : i === G.n ? "cur" : ""}"></i>`).join("");
  }
  /* vue courante : une étape de zoom ou la droite finale */
  const vue = () => G.st < (G.L.stages||[]).length ? G.L.stages[G.st] : G.L;
  let V = null, viseX = X0 + W/2, survol = false;
  const xVal = x => V.a + (x - X0) / W * (V.b - V.a);
  const valX = v => X0 + (v - V.a) / (V.b - V.a) * W;

  function partie(){
    rec.dernier = lv; ecrire(rec);
    G = {lv, n:0, score:0, res:[]};
    barre();
    $(".mj-sniper-lvt").textContent = `Niveau ${lv+1} · ${LV[lv].titre}`;
    $(".mj-sniper-lvd").textContent = LV[lv].desc;
    tir();
  }
  function tir(){
    G.L = LV[lv].gen(); G.st = 0; G.etat = "vise";
    V = Object.assign({}, vue());
    gShot.innerHTML = ""; gLine.innerHTML = droite(V);
    $(".mj-sniper-target .val").innerHTML = cibleHTML(G.L);
    board.classList.remove("done");
    next.hidden = true;
    consigne();
    hud(); vise();
    if(document.activeElement && root.contains(document.activeElement) && document.activeElement !== board) board.focus({preventScroll:true});
    voir();
  }
  function consigne(){
    msg.className = "mj-sniper-msg";
    const S = (G.L.stages||[])[G.st];
    msg.innerHTML = S ? (S.hi - S.lo === 1000
        ? `<b>Étape 1 :</b> clique entre les deux <b>nombres entiers</b> qui encadrent ${cibleHTML(G.L)}. La droite va s'agrandir.`
        : `<b>Étape 1 :</b> clique entre les deux <b>dixièmes</b> qui encadrent ${cibleHTML(G.L)}. La droite va s'agrandir.`)
      : (G.L.stages ? `<b>Étape 2 :</b> maintenant, tire le plus précisément possible.` : `Clique sur la droite à l'endroit où se trouve le nombre. Prends ton temps : c'est la précision qui compte.`);
  }
  function vise(){
    if(!G || G.etat !== "vise"){ gAim.innerHTML = ""; return; }
    const x = viseX, show = survol || document.activeElement === board;
    gAim.innerHTML = show ? `<g pointer-events="none"><path d="M${x} 20V${VH-6}" stroke="#d93025" stroke-width="1.2" stroke-dasharray="5 5" opacity=".55"/>
      <circle cx="${x}" cy="${Y}" r="20" fill="none" stroke="#d93025" stroke-width="2.4"/><circle cx="${x}" cy="${Y}" r="2.6" fill="#d93025"/>
      <path d="M${x-30} ${Y}h18M${x+12} ${Y}h18M${x} ${Y-30}v18M${x} ${Y+12}v18" stroke="#d93025" stroke-width="2.4"/></g>` : "";
  }
  function pointeur(ev){
    const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
    const m = svg.getScreenCTM(); if(!m) return null;
    const p = pt.matrixTransform(m.inverse());
    return Math.max(X0, Math.min(X0 + W, p.x));
  }
  svg.addEventListener("pointermove", ev => { const x = pointeur(ev); if(x === null) return; viseX = x; survol = true; vise(); });
  svg.addEventListener("pointerleave", () => { survol = false; vise(); });
  svg.addEventListener("pointerdown", ev => { if(ev.button) return; const x = pointeur(ev); if(x === null) return; viseX = x; feu(); });
  board.addEventListener("focus", vise); board.addEventListener("blur", vise);
  board.addEventListener("keydown", ev => {
    if(!G) return;
    if(G.etat === "vise"){
      const d = ev.shiftKey ? 12 : 1.5;
      if(ev.key === "ArrowLeft"){ viseX = Math.max(X0, viseX - d); vise(); ev.preventDefault(); }
      else if(ev.key === "ArrowRight"){ viseX = Math.min(X0 + W, viseX + d); vise(); ev.preventDefault(); }
      else if(ev.key === "Enter" || ev.key === " "){ feu(); ev.preventDefault(); }
    } else if((ev.key === "Enter" || ev.key === " ") && !next.hidden){ next.click(); ev.preventDefault(); }
  });

  function feu(){
    if(!G || G.etat !== "vise") return;
    const x = xVal(viseX), L = G.L, S = (L.stages||[])[G.st];
    if(S){
      if(x >= S.lo && x <= S.hi){ G.etat = "zoom"; zoome(S, L.stages[G.st+1] || L); return; }
      /* mauvais intervalle : tir perdu */
      G.etat = "fini"; gAim.innerHTML = "";
      const xl = valX(S.lo), xh = valX(S.hi);
      gShot.innerHTML = `<rect x="${xl}" y="${Y-30}" width="${xh-xl}" height="60" rx="6" fill="rgba(30,142,62,.16)" stroke="#1e8e3e" stroke-width="2"/>`
        + impact(viseX) + drapeau(valX(L.t), fmt(L.t), "#1e8e3e");
      resultat(0, `<span class="vd">Mauvaise zone</span> <span class="pts">+0 point</span><br>${expliqueZoom(L, S)}`);
      return;
    }
    const M = mesure(L, x);
    G.etat = "fini"; gAim.innerHTML = "";
    const xt = valX(L.t), xi = viseX;
    let s = "";
    if(M.ec){ const y = Y - 34; s += `<path d="M${Math.min(xi,xt)} ${y}H${Math.max(xi,xt)}" stroke="#e8a200" stroke-width="4" stroke-linecap="round"/>`; }
    s += drapeau(xt, fmt(L.t), "#1e8e3e") + impact(xi);
    const et = `ton tir : ${fmtTir(L, M.tir)}`, we = et.length * 10.5 + 18, wd = fmt(L.t).length * 14 + 22;
    if(Math.abs(xi - xt) > (we + wd)/2 + 8) s += etiquette(xi, et);
    gShot.innerHTML = s;
    let serie = 0; if(M.pts === 100){ serie = 1; for(let i = G.res.length-1; i >= 0 && G.res[i] === 100; i--) serie++; }
    let txt = `<span class="vd">${VERDICT[M.pts]}</span> <span class="pts">+${M.pts} point${M.pts>1?"s":""}</span>${serie >= 2 ? ` <b class="serie">${serie} dans le mille d'affilée !</b>` : ""}<br>`
      + `Ton tir : <span class="num">${fmtTir(L, M.tir)}</span> · cible : <span class="num">${fmt(L.t)}</span> · écart : <span class="num">${fmt(M.ec)}</span>`;
    if(M.pts < 100) txt += `<br>${explique(L, x)}`;
    else if(L.form !== "dec") txt += `<br>${explique(L)}`;
    resultat(M.pts, txt);
  }
  function impact(x){
    return `<g class="drop"><circle cx="${x}" cy="${Y}" r="9" fill="#d93025" stroke="#fff" stroke-width="2.5"/></g>`
      + `<circle class="boom" cx="${x}" cy="${Y}" r="4" fill="none" stroke="#d93025" stroke-width="3"/>`;
  }
  function drapeau(x, txt, col){
    const w = txt.length * 14 + 22, xx = Math.max(w/2 + 4, Math.min(VW - w/2 - 4, x));
    return `<g class="drop"><path d="M${x} ${Y}V${Y-62}" stroke="${col}" stroke-width="3"/>
      <rect x="${xx - w/2}" y="${Y-96}" width="${w}" height="34" rx="9" fill="${col}"/>
      <text x="${xx}" y="${Y-72}" text-anchor="middle" font-size="22" font-weight="700" fill="#fff">${txt}</text></g>`;
  }
  function etiquette(x, txt){
    const w = txt.length * 10.5 + 18, y = Y - 94, xx = Math.max(w/2 + 4, Math.min(VW - w/2 - 4, x));
    return `<g class="drop"><path d="M${x} ${Y-10}V${y+30}" stroke="#d93025" stroke-width="2"/><rect x="${xx - w/2}" y="${y}" width="${w}" height="30" rx="8" fill="#fff" stroke="#d93025" stroke-width="2"/>
      <text x="${xx}" y="${y+21}" text-anchor="middle" font-size="18" font-weight="700" fill="#b3261e">${txt}</text></g>`;
  }
  function zoome(S, F){
    const a0 = V.a, b0 = V.b, a1 = F.a, b1 = F.b, t0 = performance.now(), D = reduit() ? 0 : 650, G0 = G;
    /* on garde la zone choisie en surbrillance pendant le zoom */
    const pas = () => {
      if(G !== G0) return;
      const k = D ? Math.min(1, (performance.now() - t0) / D) : 1, e = k < .5 ? 2*k*k : 1 - Math.pow(-2*k + 2, 2)/2;
      V = {a: a0 + (a1 - a0)*e, b: b0 + (b1 - b0)*e, g: k < .5 ? S.g : F.g, lab: k < .5 ? S.lab : F.lab, mid: k < .5 ? S.mid : F.mid};
      gLine.innerHTML = droite(V);
      const xl = valX(S.lo), xh = valX(S.hi);
      gShot.innerHTML = k < 1 ? `<rect x="${Math.max(0,xl)}" y="${Y-30}" width="${Math.min(VW,xh)-Math.max(0,xl)}" height="60" rx="6" fill="rgba(37,99,235,.10)"/>` : "";
      if(k < 1 && root.isConnected) requestAnimationFrame(pas);
      else { V = Object.assign({}, F); G.st++; G.etat = "vise"; gLine.innerHTML = droite(V); gShot.innerHTML = ""; consigne(); vise(); }
    };
    gAim.innerHTML = ""; pas();
  }
  function resultat(pts, html){
    G.res.push(pts); G.score += pts; G.n++;
    board.classList.add("done");
    msg.className = "mj-sniper-msg " + (pts >= 70 ? "ok" : pts === 0 ? "ko" : "");
    msg.innerHTML = html;
    next.hidden = false;
    next.textContent = G.n < TIRS ? "Tir suivant" : "Voir mon score";
    next.onclick = () => G.n < TIRS ? tir() : fin();
    hud(); $(".k-n").textContent = `${G.n} / ${TIRS}`;
    if(root.contains(document.activeElement)) next.focus({preventScroll:true});
  }
  function fin(){
    const r = rec.lv[lv] || {}, e = etoiles(lv, G.score), nouveau = r.best === undefined || G.score > r.best;
    if(nouveau) r.best = G.score; r.e = Math.max(r.e || 0, e); rec.lv[lv] = r; ecrire(rec);
    barre();
    G.etat = "fin"; gAim.innerHTML = "";
    const cpt = [100,70,40,15,0].map(p => [p, G.res.filter(x => x === p).length]).filter(c => c[1]);
    msg.className = "mj-sniper-msg " + (e >= 2 ? "ok" : "");
    msg.innerHTML = `<div class="mj-sniper-end"><span class="big">Série terminée : ${G.score} points sur ${MAXPTS} <span class="st" aria-label="${e} étoile${e>1?"s":""}">${"★".repeat(e)}<i>${"★".repeat(3-e)}</i></span></span>
      <span>${cpt.map(c => `${VERDICT[c[0]].replace(/ !|…/g,"")} : ${c[1]}`).join(" · ")}${nouveau ? " · <b>Nouveau record !</b>" : ` · Record : ${r.best}`}</span>
      <span class="acts"><button class="btn primary" data-a="re">Rejouer ce niveau</button>${lv < LV.length-1 ? `<button class="btn" data-a="nx">Niveau suivant</button>` : ""}</span></div>`;
    next.hidden = true;
    msg.querySelector('[data-a="re"]').onclick = () => partie();
    const nx = msg.querySelector('[data-a="nx"]'); if(nx) nx.onclick = () => { lv++; partie(); };
    if(root.contains(document.activeElement)) msg.querySelector('[data-a="re"]').focus({preventScroll:true});
  }
  /* sur un petit écran, on fait défiler juste ce qu'il faut pour voir toute la zone de jeu */
  let vu = false;
  function voir(){ if(vu) return; vu = true; const c = $(".mj-sniper-card"); const r = c.getBoundingClientRect();
    if(r.bottom > innerHeight && r.top > 0) window.scrollBy({top: Math.min(r.top - 8, r.bottom - innerHeight + 12), behavior: reduit() ? "auto" : "smooth"}); }
  /* lecture seule, pour les tests automatiques */
  root._mjEtat = () => G && {t:G.L.t, st:G.st, etat:G.etat, stages:G.L.stages||[], a:V.a, b:V.b, n:G.n, score:G.score};
  partie();
}
return {init, _t:{fmt, fmtTir, lettres, enLettres, KINDS, LV, mesure, explique, alterne, expliqueZoom, etoiles, forme, TIRS, MAXPTS}};
})();
