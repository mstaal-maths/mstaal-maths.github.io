/* Mini-jeu « Le ninja au grappin » (4e, théorème de Pythagore) — window.MJ_GRAPPIN.init(root)
   Le ninja tend une corde entre son toit et l'immeuble d'en face, puis glisse le long de la corde.
   La corde bien tendue est l'hypoténuse d'un triangle rectangle : écart horizontal et différence de hauteur.
   Corde trop courte : le grappin n'arrive pas, le ninja tombe dans la benne à cartons.
   Corde trop longue : elle pend, le ninja se balance et s'écrase (comiquement) contre le mur.
   Tous les calculs sont faits en nombres entiers : longueurs en dixièmes de mètre, carrés en centièmes de m². */
window.MJ_GRAPPIN = (function(){
"use strict";
const KEY = "staal-mj-grappin4";
const W = 800, H = 450, RUE = 438;          /* scène (unités SVG) ; RUE = niveau du trottoir */
const NSAUTS = 8, NVIES = 3;

/* ---------- nombres ---------- */
const isqrt = n => { let r = Math.floor(Math.sqrt(n)); while (r*r > n) r--; while ((r+1)*(r+1) <= n) r++; return r; };
const grp = s => s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
/* n en dixièmes → « 7,5 » ou « 13 » */
const f10 = n => { const e = Math.floor(n/10), d = n % 10; return grp(String(e)) + (d ? "," + d : ""); };
/* n en centièmes → « 56,25 », « 40,5 », « 169 » */
const f100 = n => { const e = Math.floor(n/100), r = n % 100; if (!r) return grp(String(e)); return grp(String(e)) + "," + String(r).padStart(2, "0").replace(/0$/, ""); };
/* n en centièmes, toujours avec deux décimales (valeur tronquée) → « 23,20 » */
const t100 = n => grp(String(Math.floor(n/100))) + "," + String(n % 100).padStart(2, "0");
/* un nombre décimal quelconque (saisie de l'élève) */
const fx = x => { let s = String(+x.toFixed(6)); if (s.includes("e")) s = x.toFixed(2); const [e, d] = s.split("."); return grp(e) + (d ? "," + d : ""); };
const pts = n => grp(String(n));

/* ---------- énoncés ---------- */
const rnd = (a, b) => a + Math.floor(Math.random()*(b - a + 1)), pick = l => l[Math.floor(Math.random()*l.length)];
const LETTRES = [["A","B","C"], ["D","E","F"], ["E","F","G"], ["K","L","M"], ["M","N","P"], ["R","S","T"]];
const seg = (p, q) => [p, q].sort().join("");
/* triplets pythagoriciens (en mètres) */
const T1 = [[3,4,5], [6,8,10], [5,12,13], [9,12,15], [8,15,17], [12,16,20]];
const T2I = [[7,24,25], [10,24,26], [15,20,25], [20,21,29], [12,16,20], [8,15,17], [18,24,30], [9,12,15]];
const T2D = [[4.5,6,7.5], [7.5,10,12.5], [2.5,6,6.5], [3.6,4.8,6], [10.5,14,17.5], [13.5,18,22.5], [12,22.5,25.5], [7.5,18,19.5]];
/* le dessin reste lisible : écart de 2,5 m à 24 m, différence de hauteur de 2 m à 20 m, pas trop plat ni trop raide */
const forme = (d, v) => d >= 2.5 && d <= 24 && v >= 2 && v <= 20 && v/d >= 0.2 && v/d <= 2;
/* un saut. ask = "hyp" (on cherche la corde) ou "cote" (corde connue, on cherche la différence de hauteur) */
function mk(ask, d10, k10, arr){
  const j = {ask, d10, arr, up: Math.random() < .5, rb: Math.random(), seed: rnd(1, 1e6)};
  if (ask === "hyp"){ j.v10 = k10; j.S = d10*d10 + k10*k10; } else { j.L10 = k10; j.S = k10*k10 - d10*d10; }
  if (j.S <= 0) return null;
  const r = isqrt(j.S); j.parfait = r*r === j.S; j.exact10 = Math.sqrt(j.S);
  /* arrondi au dixième, en entiers : on arrondit au-dessus ssi S ≥ (r + 0,5)², soit 4S ≥ (2r + 1)² (jamais égal) */
  j.rep10 = j.parfait ? r : (4*j.S > (2*r + 1)*(2*r + 1) ? r + 1 : r);
  j.trunc100 = isqrt(j.S*100);            /* √S tronquée au centième, en centièmes de mètre */
  if (ask === "hyp") j.L10x = j.exact10; else j.v10x = j.exact10;
  const L = pick(LETTRES).slice(); for (let i = 2; i > 0; i--){ const k = Math.floor(Math.random()*(i + 1)); [L[i], L[k]] = [L[k], L[i]]; }
  j.P = {N: L[0], H: L[1], C: L[2]};       /* N : le ninja ; H : l'angle droit ; C : le crochet */
  j.tri = L.slice().sort().join("");
  j.hyp = seg(j.P.N, j.P.C);
  j.sv = j.up ? seg(j.P.H, j.P.C) : seg(j.P.N, j.P.H);   /* côté vertical */
  j.sh = j.up ? seg(j.P.N, j.P.H) : seg(j.P.H, j.P.C);   /* côté horizontal */
  return j;
}
const vert10 = j => j.ask === "hyp" ? j.v10 : j.exact10;     /* différence de hauteur, en dixièmes (peut être non entière) */
const rope10 = j => j.ask === "hyp" ? j.exact10 : j.L10;     /* longueur de la corde tendue, en dixièmes */
function valide(j, exact){
  if (!j) return false;
  if (!forme(j.d10/10, vert10(j)/10)) return false;
  if (exact) return j.parfait;
  if (j.parfait) return false;
  const fr = j.exact10 - Math.floor(j.exact10);
  return Math.abs(fr - 0.5) > 0.01;        /* pas de cas litigieux pour l'arrondi */
}
const dix = x => Math.round(x*10);
function triplet(T){ const t = pick(T), o = Math.random() < .5 ? [t[0], t[1]] : [t[1], t[0]]; return [dix(o[0]), dix(o[1]), dix(t[2])]; }
const GEN = [
  () => { const [d, v] = triplet(T1); return mk("hyp", d, v, false); },
  () => { const [d, v] = triplet(Math.random() < .55 ? T2D : T2I); return mk("hyp", d, v, false); },
  () => mk("hyp", 10*rnd(4, 20), 10*rnd(3, 16), true),
  () => { let d = rnd(35, 200), v = rnd(25, 160); if (d % 10 === 0 && v % 10 === 0) d += rnd(1, 9); return mk("hyp", d, v, true); },
  () => { const [d, v, c] = triplet(Math.random() < .6 ? T1 : Math.random() < .5 ? T2I : T2D); void v; return mk("cote", d, c, false); },
  () => { if (Math.random() < .5){ const dec = Math.random() < .4; return mk("hyp", dec ? rnd(35, 200) : 10*rnd(4, 20), dec ? rnd(25, 160) : 10*rnd(3, 16), true); }
          const dec = Math.random() < .3, L = dec ? rnd(60, 250) : 10*rnd(6, 25), d = Math.random() < .7 ? 10*rnd(3, Math.floor(L/10) - 1) : rnd(30, L - 10);
          return mk("cote", d, L, true); }
];
const LV = [
  {nom: "Premiers sauts", court: "triplets", pts: 100, exact: true,
   aide: "La corde bien tendue est l'hypoténuse du triangle rectangle. Calcule sa longueur avec le théorème de Pythagore : ici, le résultat tombe juste."},
  {nom: "Grands écarts", court: "décimaux exacts", pts: 120, exact: true,
   aide: "Plus loin, et parfois avec des nombres décimaux : 7,5² = 7,5 × 7,5 = 56,25. Le résultat tombe encore juste."},
  {nom: "Au dixième près", court: "arrondi", pts: 150, exact: false,
   aide: "La racine carrée ne tombe plus juste : donne la longueur arrondie au dixième de mètre. La corde est bonne à ± 0,1 m près."},
  {nom: "Décimaux au dixième", court: "décimaux + arrondi", pts: 150, exact: false,
   aide: "Des longueurs décimales, et un résultat arrondi au dixième de mètre (± 0,1 m)."},
  {nom: "Viser sur l'échelle", court: "côté de l'angle droit", pts: 150, exact: true,
   aide: "La corde est connue ! Le grappin se plante sur l'échelle de l'immeuble d'en face : trouve de combien de mètres plus bas (ou plus haut). Cette fois, on soustrait les carrés."},
  {nom: "Maître ninja", court: "tout mélangé", pts: 200, exact: false,
   aide: "Tout se mélange : la corde ou la hauteur, avec un résultat arrondi au dixième de mètre (± 0,1 m)."}
];
function generer(niv){
  const C = LV[niv], l = [], vus = new Set();
  for (let essai = 0; l.length < NSAUTS && essai < 20000; essai++){
    const j = GEN[niv]();
    if (!valide(j, C.exact)) continue;
    const k = j.ask + j.d10 + "/" + (j.ask === "hyp" ? j.v10 : j.L10);
    if (vus.has(k) && essai < 15000) continue;
    vus.add(k); l.push(j);
  }
  return l;
}

/* ---------- saisie et verdict ---------- */
function lire(s){
  const t = String(s == null ? "" : s).trim().replace(/\s+/g, "").replace(/m$/i, "").replace(/^\+/, "");
  if (!t) return {err: "vide"};
  if (/^[-−–]/.test(t)) return {err: "Une longueur est toujours positive : écris-la sans signe moins."};
  if (!/^(\d+([.,]\d+)?|[.,]\d+)$/.test(t)) return {err: "Écris seulement un nombre, par exemple 13 ou 7,8 (sans calcul)."};
  const x = parseFloat(t.replace(",", "."));
  if (!(x > 0)) return {err: "La longueur doit être plus grande que 0."};
  if (x >= 1000) return {err: "C'est beaucoup trop : écris une longueur en mètres, plus petite que 1 000."};
  return {x};
}
/* 0 : réussi ; -1 : corde trop courte (il tombe) ; +1 : corde trop longue (il s'écrase contre le mur) */
function juger(j, x){
  const e = j.exact10, x10 = x*10, tol = j.arr ? 1 : 1e-6;
  if (Math.abs(x10 - e) <= tol + 1e-9) return 0;
  const s = x10 < e ? -1 : 1;
  return j.ask === "hyp" ? s : -s;      /* viser trop bas avec une corde fixe : la corde est trop longue pour ce point */
}
/* erreur classique repérée, ou "" */
function piege(j, x){
  const x10 = x*10, pres = (a) => Math.abs(x10 - a) <= (j.arr ? 0.5 : 1e-6) + 1e-9;
  if (j.ask === "hyp"){
    if (pres(j.d10 + j.v10)) return `Attention : on n'additionne pas les longueurs, on additionne leurs <b>carrés</b>.`;
    if (pres(j.S/10)) return `Tu as oublié la racine carrée : ${f100(j.S)} est le <b>carré</b> de la longueur de la corde.`;
  } else {
    if (pres(j.L10 - j.d10)) return `Attention : on ne soustrait pas les longueurs, on soustrait leurs <b>carrés</b>.`;
    if (pres(Math.sqrt(j.L10*j.L10 + j.d10*j.d10))) return `Ici la corde est l'hypoténuse : pour trouver un côté de l'angle droit, on <b>soustrait</b> les carrés.`;
    if (pres(j.S/10)) return `Tu as oublié la racine carrée : ${f100(j.S)} est le <b>carré</b> de la hauteur.`;
  }
  if (j.arr && Math.abs(x10 - j.rep10) <= 1 + 1e-9 && Math.abs(x10 - j.exact10) < 1){
    const t = j.trunc100, c = t % 10;
    return `Attention à l'arrondi : √${f100(j.S)} = ${t100(t)}… Le chiffre des centièmes est ${c} : ${c >= 5 ? "on ajoute 1 au chiffre des dixièmes" : "on garde le chiffre des dixièmes"}, donc ${f10(j.rep10)} m.`;
  }
  return "";
}
const sq = n => `<span class="mj-grappin-rad">${n}</span>`;
/* rédaction de la correction, une étape par ligne */
function correction(j){
  const {P} = j, l = [];
  const val = s => s === j.sv ? j.v10 : s === j.sh ? j.d10 : j.L10;
  l.push(`Dans le triangle ${j.tri} rectangle en ${P.H}, d'après le théorème de Pythagore :`);
  const legs = [j.sv, j.sh].sort();
  l.push(`${j.hyp}² = ${legs[0]}² + ${legs[1]}²`);
  const fin = (nom) => {
    l.push(`${nom} = √${sq(f100(j.S))}`);
    if (j.parfait) l.push(`<b>${nom} = ${f10(j.rep10)} m</b>`);
    else l.push(`<b>${nom} ≈ ${f10(j.rep10)} m</b> <small>(au dixième près, car √${f100(j.S)} = ${t100(j.trunc100)}…)</small>`);
  };
  if (j.ask === "hyp"){
    l.push(`${j.hyp}² = ${f10(val(legs[0]))}² + ${f10(val(legs[1]))}²`);
    l.push(`${j.hyp}² = ${f100(val(legs[0])**2)} + ${f100(val(legs[1])**2)}`);
    l.push(`${j.hyp}² = ${f100(j.S)}`);
    fin(j.hyp);
  } else {
    const u = j.sv, k = f10(j.d10), k2 = f100(j.d10*j.d10), L = f10(j.L10), L2 = f100(j.L10*j.L10);
    const a = legs[0] === u ? `${u}² + ${k}²` : `${k}² + ${u}²`, b = legs[0] === u ? `${u}² + ${k2}` : `${k2} + ${u}²`;
    l.push(`${L}² = ${a}`);
    l.push(`${L2} = ${b}`);
    l.push(`${u}² = ${L2} − ${k2}`);
    l.push(`${u}² = ${f100(j.S)}`);
    fin(u);
  }
  return l;
}
/* texte du verdict (raté) */
function verdict(j, x, res){
  const X = fx(x), R = f10(j.rep10), app = j.arr && !j.parfait ? "≈ " : "";
  if (j.ask === "hyp"){
    return res < 0 ? `Corde trop courte ! Tu as donné ${X} m, il fallait ${app}${R} m. Le grappin n'atteint pas le toit : plongeon dans la benne à cartons.`
                   : `Corde trop longue ! Tu as donné ${X} m, il fallait ${app}${R} m. La corde pend, le ninja se balance… et s'écrase contre le mur. Paf !`;
  }
  const need = Math.sqrt(j.d10*j.d10 + 100*x*x)/10, sens = j.up ? "plus haut" : "plus bas";
  const ndisp = Math.abs(need*10 - Math.round(need*10)) < 1e-9 ? "= " + f10(Math.round(need*10)) : "≈ " + f10(Math.round(need*10));
  return res < 0 ? `Trop loin ! À ${X} m ${sens}, il faudrait une corde de ${ndisp} m : celle de ${f10(j.L10)} m est trop courte. Le grappin n'y arrive pas : plongeon dans la benne à cartons.`
                 : `Pas assez loin ! À ${X} m ${sens}, il suffirait d'une corde de ${ndisp} m : celle de ${f10(j.L10)} m est trop longue. Elle pend, et le ninja s'écrase contre le mur. Paf !`;
}

/* ---------- géométrie de la scène (en unités SVG) ---------- */
function geo(j){
  const d = j.d10/10, v = vert10(j)/10;
  const s = Math.min(470/d, (j.ask === "cote" ? 240 : 250)/v, 42);
  const gx = d*s, gy = v*s, xN = Math.round((W - gx)/2), xC = xN + gx;
  const top = j.ask === "cote" ? 112 : 100;
  let yN, yC; if (j.up){ yC = top; yN = top + gy; } else { yN = top; yC = top + gy; }
  let yB = yC;
  if (j.ask === "cote") yB = j.up ? yC - 46 : Math.max(62, yC - 46 - j.rb*Math.max(0, yC - 46 - 62));
  const Hp = j.up ? {x: xC, y: yN} : {x: xN, y: yC};
  return {s, xN, xC, yN, yC, yB, N: {x: xN, y: yN}, C: {x: xC, y: yC}, Hp, bx: xC + (j.ask === "cote" ? 8 : 0), xg: (xN + xC)/2, gx};
}

/* ---------- interface ---------- */
const CSS = `
.mj-grappin{display:grid;grid-template-columns:minmax(0,1fr) 372px;gap:16px;align-items:start}
.mj-grappin-board{position:relative;border:2px solid var(--line);border-radius:16px;overflow:hidden;background:#1d2552}
.mj-grappin-svg{display:block;width:100%;height:auto;user-select:none;font-family:var(--f-body)}
.mj-grappin-svg .sc{transition:opacity .2s ease}
.mj-grappin-svg .sc.out{opacity:0}
.mj-grappin-svg .leg{stroke:#fff;stroke-width:2.2;stroke-dasharray:7 6;fill:none;opacity:.9}
.mj-grappin-svg .hy{stroke:#ffd43b;stroke-width:2.6;stroke-dasharray:9 6;fill:none}
.mj-grappin-svg .ang{fill:rgba(255,255,255,.18);stroke:#fff;stroke-width:2}
.mj-grappin-svg .pill rect{fill:#fff;stroke:#15213b;stroke-width:1.5}
.mj-grappin-svg .pill text{font-size:17px;font-weight:800;fill:#15213b}
.mj-grappin-svg .pill.q rect{fill:#ffd43b}
.mj-grappin-svg .pill.sol rect{fill:#d3f9d8;stroke:#167a54}
.mj-grappin-svg .pill.sol text{fill:#0b5d3b}
.mj-grappin-svg .pill.mine rect{fill:#ffe3e3;stroke:#c92a2a}
.mj-grappin-svg .pill.mine text{fill:#a61e1e}
.mj-grappin-svg .pt{font-size:18px;font-weight:800;fill:#fff;paint-order:stroke;stroke:#15213b;stroke-width:4px;stroke-linejoin:round}
.mj-grappin-svg .rope{fill:none;stroke:#e9c46a;stroke-width:3;stroke-linecap:round}
.mj-grappin-svg .solr{stroke:#69db7c;stroke-width:3.2;stroke-dasharray:10 6;fill:none}
.mj-grappin-svg .fxt{font-family:var(--f-display);font-weight:800;paint-order:stroke;stroke:#15213b;stroke-width:5px;stroke-linejoin:round}
.mj-grappin-over{position:absolute;inset:0;display:grid;place-items:center;background:rgba(14,21,36,.55);padding:16px}
.mj-grappin-card{background:#fff;color:#15213b;border:2px solid #d3dbea;border-radius:16px;padding:18px 22px;max-width:480px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.3)}
.mj-grappin-card h3{font-family:var(--f-display);font-size:1.45rem;margin:0 0 6px}
.mj-grappin-card p{margin:6px 0;color:#2c3a57}
.mj-grappin-card .btn{margin:8px 4px 0;background:#fff;color:#15213b;border-color:#15213b}
.mj-grappin-card .btn.primary{background:#15213b;color:#fff}
.mj-grappin-card .stars{font-size:2rem;letter-spacing:.1em;color:#f59f00}
.mj-grappin-card .stars .v{color:#c9d1e0}
.mj-grappin-side{border:2px solid var(--line);border-radius:16px;padding:10px 12px;background:var(--surface);color:var(--ink);display:flex;flex-direction:column;gap:7px;min-width:0}
.mj-grappin-lvs{display:grid;grid-template-columns:repeat(6,1fr);gap:4px}
.mj-grappin-lvs button{font:inherit;font-weight:700;font-size:.95rem;border:2px solid var(--line);background:var(--surface);color:var(--ink);border-radius:9px;padding:1px 0 0;cursor:pointer;line-height:1.1;min-width:0}
.mj-grappin-lvs button small{display:block;font-size:.6rem;color:#f59f00;letter-spacing:-.05em;min-height:1.05em}
.mj-grappin-lvs button[aria-current="true"]{background:var(--c);border-color:var(--c);color:var(--paper)}
.mj-grappin-lvs button[aria-current="true"] small{color:var(--paper)}
.mj-grappin-lvs button:disabled{opacity:.4;cursor:not-allowed}
.mj-grappin-h{display:flex;align-items:baseline;justify-content:space-between;gap:8px;flex-wrap:wrap}
.mj-grappin-h h3{font-family:var(--f-display);font-size:1.15rem;margin:0}
.mj-grappin-h span{font-size:.85rem;color:var(--muted);font-weight:600}
.mj-grappin-stats{display:flex;gap:6px}
.mj-grappin-stats div{flex:1 1 0;background:var(--paper);border-radius:10px;padding:2px 6px;text-align:center;min-width:0;line-height:1.25}
.mj-grappin-stats b{display:block;font-family:var(--f-display);font-size:1.12rem;line-height:1.3;white-space:nowrap}
.mj-grappin-stats small{font-size:.75rem;color:var(--muted);font-weight:600}
.mj-grappin-vies i{font-style:normal;color:#e03131}
.mj-grappin-vies i.v{color:var(--line)}
.mj-grappin-q{background:var(--paper);border-radius:12px;padding:6px 10px;line-height:1.45;font-size:.95rem}
.mj-grappin-q p{margin:1px 0}
.mj-grappin-q .tol{display:inline-block;margin-top:3px;font-size:.82rem;font-weight:700;border:1.5px solid var(--c);color:var(--ink);border-radius:999px;padding:0 9px}
.mj-grappin-form{display:flex;align-items:center;gap:8px;font-size:1.2rem;font-weight:700}
.mj-grappin-form label{display:flex;flex-direction:column;align-items:center;line-height:1.1}
.mj-grappin-form label small{font-size:.7rem;color:var(--muted);font-weight:600}
.mj-grappin-form input{font:inherit;font-size:1.2rem;width:5.2em;padding:3px 6px;border:2px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink);text-align:center}
.mj-grappin-form input:focus{border-color:var(--c);outline:none;box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 30%,transparent)}
.mj-grappin-form input:disabled{opacity:.55}
.mj-grappin-form .btn{padding:8px 16px;margin-left:auto;font-size:1.05rem}
.mj-grappin-msg{border-radius:12px;padding:6px 12px;background:var(--paper);line-height:1.45;font-size:.93rem;min-height:2.6em}
.mj-grappin-msg.ok{background:var(--okbg)} .mj-grappin-msg.ko{background:var(--kobg)}
.mj-grappin-msg p{margin:2px 0}
.mj-grappin-msg .tip{margin-top:4px;font-size:.88rem}
.mj-grappin-cor{list-style:none;margin:4px 0 2px;padding:5px 9px;background:var(--surface);border-radius:9px;font-variant-numeric:tabular-nums;line-height:1.55}
.mj-grappin-cor li:first-child{font-size:.88rem;line-height:1.35;margin-bottom:2px}
.mj-grappin-cor small{color:var(--muted)}
.mj-grappin-rad{border-top:1.5px solid currentColor;padding:0 1px;margin-left:1px}
.mj-grappin-msg .btn{margin-top:4px;padding:6px 14px;font-size:.95rem}
.mj-grappin-aides{display:flex;flex-wrap:wrap;column-gap:18px;border-top:1.5px solid var(--line);padding-top:4px}
.mj-grappin-aides details[open]{flex-basis:100%}
.mj-grappin-side details{font-size:.92rem;line-height:1.5;margin:0;border:0;padding:2px 0}
.mj-grappin-side summary{cursor:pointer;font-weight:700}
.mj-grappin-side details p,.mj-grappin-side details ul{margin:4px 0}
.mj-grappin-side details ul{padding-left:1.1em}
@media (max-width:980px){.mj-grappin{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){.mj-grappin-svg .sc{transition:none}}
`;
let R0 = null, MEM = {}, niv = 0, G = null, busy = false, raf = 0, tmo = 0;
const $ = s => R0.querySelector(s);
const reduit = () => { try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } };
function charger(){ try{ const v = JSON.parse(localStorage.getItem(KEY) || "{}"); return v && typeof v === "object" ? v : {}; }catch(e){ return {}; } }
function sauver(){ try{ localStorage.setItem(KEY, JSON.stringify(MEM)); }catch(e){} }
const plur = (n, m) => `${n} ${m}${n > 1 ? "s" : ""}`;

function init(root){
  if (!document.getElementById("mj-grappin-css")){ const st = document.createElement("style"); st.id = "mj-grappin-css"; st.textContent = CSS; document.head.appendChild(st); }
  cancelAnimationFrame(raf); clearTimeout(tmo);
  R0 = root; MEM = charger(); MEM.lv = MEM.lv && typeof MEM.lv === "object" ? MEM.lv : {};
  niv = Math.min(Math.max(0, +MEM.cur || 0), LV.length - 1); if (!ouvert(niv)) niv = 0;
  root.innerHTML = `<div class="mj-grappin">
    <div class="mj-grappin-board"><svg class="mj-grappin-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Deux immeubles et le triangle rectangle du saut"></svg><div class="mj-grappin-over" hidden></div></div>
    <aside class="mj-grappin-side">
      <div class="mj-grappin-lvs" role="group" aria-label="Niveaux"></div>
      <div class="mj-grappin-h"><h3 id="mjn-titre"></h3><span id="mjn-rec"></span></div>
      <div class="mj-grappin-stats"><div><b id="mjn-saut"></b><small>saut</small></div><div><b class="mj-grappin-vies" id="mjn-vies"></b><small>vies</small></div><div><b id="mjn-score">0</b><small>points</small></div><div><b id="mjn-serie">0</b><small>série</small></div></div>
      <div class="mj-grappin-q" id="mjn-q" aria-live="polite"></div>
      <form class="mj-grappin-form" autocomplete="off" onsubmit="return false">
        <label for="mjn-in"><span id="mjn-lab">AC =</span><small id="mjn-lab2">corde</small></label>
        <input id="mjn-in" inputmode="decimal" spellcheck="false" aria-describedby="mjn-q"><span>m</span>
        <button class="btn primary" type="button" id="mjn-go">Lancer !</button>
      </form>
      <div class="mj-grappin-msg" id="mjn-msg" aria-live="polite"></div>
      <div class="mj-grappin-aides"><details id="mjn-how"><summary>Comment jouer</summary>
        <p>Le ninja tend une corde jusqu'à l'immeuble d'en face, puis glisse dessus. La corde bien tendue est l'<b>hypoténuse</b> du triangle rectangle tracé en pointillés.</p>
        <p>Calcule la longueur demandée, écris-la (avec une virgule si besoin), puis appuie sur <b>Entrée</b>. Trop courte : il tombe dans la benne à cartons. Trop longue : la corde pend et il s'écrase contre le mur.</p>
        <p>${NSAUTS} sauts par niveau, ${NVIES} vies. Les bonnes réponses à la suite font une <b>série</b> qui rapporte des points en plus.</p>
        <p><b>Prends ta calculatrice</b> (touches x² et √) : il n'y en a pas dans le jeu.</p></details>
      <details><summary>Aide : le théorème de Pythagore</summary><ul>
        <li>Dans un triangle rectangle, le carré de l'<b>hypoténuse</b> (le côté opposé à l'angle droit, le plus long) est égal à la <b>somme des carrés</b> des deux autres côtés.</li>
        <li>Pour l'hypoténuse : on <b>additionne</b> les carrés, puis on prend la racine carrée.</li>
        <li>Pour un côté de l'angle droit : on <b>soustrait</b> les carrés (hypoténuse² − autre côté²), puis on prend la racine carrée.</li>
        <li>Arrondir au dixième : regarde le chiffre des centièmes. De 0 à 4, on garde le chiffre des dixièmes ; de 5 à 9, on lui ajoute 1. Exemples : √61 = 7,81… ≈ 7,8 et √90 = 9,48… ≈ 9,5.</li></ul></details></div>
    </aside></div>`;
  if (!MEM.vu){ $("#mjn-how").open = true; MEM.vu = 1; sauver(); }
  $("#mjn-go").onclick = lancer;
  $("#mjn-in").addEventListener("keydown", e => { if (e.key === "Enter"){ e.preventDefault(); if (G && G.phase === "cor") suivant(); else lancer(); } });
  nouvelle(niv);
}
function ouvert(i){ return i === 0 || !!(MEM.lv[i-1] && MEM.lv[i-1].st > 0); }
function niveaux(){
  const box = $(".mj-grappin-lvs");
  box.innerHTML = LV.map((c, i) => { const r = MEM.lv[i], st = r ? r.st : 0;
    return `<button type="button" data-i="${i}" ${i === niv ? 'aria-current="true"' : ""} ${ouvert(i) ? "" : "disabled"} title="Niveau ${i+1} : ${c.nom}${ouvert(i) ? "" : " (termine le niveau précédent pour l'ouvrir)"}">${i+1}<small>${st ? "★".repeat(st) : ""}</small></button>`; }).join("");
  box.querySelectorAll("button").forEach(b => b.onclick = () => { if (!busy) nouvelle(+b.dataset.i); });
}
function nouvelle(i){
  cancelAnimationFrame(raf); clearTimeout(tmo); busy = false;
  niv = i; MEM.cur = i; sauver();
  const C = LV[i];
  G = {sauts: generer(i), k: 0, vies: NVIES, score: 0, serie: 0, best: 0, ok: 0, phase: "intro"};
  niveaux();
  $("#mjn-titre").textContent = `Niveau ${i+1} · ${C.nom}`;
  const r = MEM.lv[i]; $("#mjn-rec").textContent = r && r.sc ? `Record : ${pts(r.sc)} pts` : "";
  msg(`<p>${C.aide}</p>`, "");
  poser(false);
  carte(`<h3>Niveau ${i+1} : ${C.nom}</h3><p>${C.aide}</p><p>${NSAUTS} sauts, ${NVIES} vies. Termine le niveau pour gagner des étoiles : ★★★ sans perdre de vie.</p><button class="btn primary" type="button" data-go>C'est parti !</button>`);
}
function carte(html){
  const o = $(".mj-grappin-over"); o.innerHTML = nbsp(`<div class="mj-grappin-card">${html}</div>`); o.hidden = false;
  const go = o.querySelector("[data-go]");
  if (go){ go.onclick = () => { o.hidden = true; if (G.phase === "intro") G.phase = "saisie"; focusIn(); };
    setTimeout(() => { if (R0 && R0.isConnected && !o.hidden) go.focus({preventScroll: true}); }, 30); }
  o.querySelectorAll("[data-niv]").forEach(b => b.onclick = () => nouvelle(+b.dataset.niv));
}
function focusIn(){ const e = $("#mjn-in"); if (e && !e.disabled) e.focus({preventScroll: true}); }
/* espaces insécables de la typographie française (hors balises) */
const nbsp = h => (">" + h).replace(/>[^<]*/g, m => m.replace(/ ([!?:;»])/g, "\u00a0$1").replace(/« /g, "«\u00a0").replace(/(\d) (m\b|m²|points|pts)/g, "$1\u00a0$2")).slice(1);
function msg(h, cl){ const m = $("#mjn-msg"); m.className = "mj-grappin-msg" + (cl ? " " + cl : ""); m.innerHTML = nbsp(h); }
function stats(){
  $("#mjn-saut").textContent = `${Math.min(G.k + 1, NSAUTS)} / ${NSAUTS}`;
  $("#mjn-vies").innerHTML = Array.from({length: NVIES}, (_, k) => `<i class="${k < G.vies ? "" : "v"}" aria-hidden="true">♥</i>`).join("") + `<span class="sr">${G.vies}</span>`;
  $("#mjn-score").textContent = pts(G.score);
  $("#mjn-serie").textContent = G.serie;
}
/* affiche le saut courant (énoncé + scène) */
function poser(fondu){
  const j = G.sauts[G.k];
  G.j = j; G.g = geo(j);
  stats();
  const tol = j.arr ? `<span class="tol">Arrondi au dixième · tolérance ± 0,1 m</span>` : `<span class="tol">Valeur exacte</span>`;
  const sens = j.up ? "plus haut" : "plus bas";
  $("#mjn-q").innerHTML = nbsp(j.ask === "hyp"
    ? `<p>Écart horizontal : <b>${f10(j.d10)} m</b><br>Différence de hauteur : <b>${f10(j.v10)} m</b></p><p>Quelle longueur de corde ${j.hyp} faut-il ?</p>${tol}`
    : `<p>Corde ${j.hyp} : <b>${f10(j.L10)} m</b><br>Écart horizontal : <b>${f10(j.d10)} m</b></p><p>Sur l'échelle d'en face, à combien de mètres ${sens} que le ninja faut-il viser ? (longueur ${j.sv})</p>${tol}`);
  $("#mjn-lab").textContent = (j.ask === "hyp" ? j.hyp : j.sv) + " =";
  $("#mjn-lab2").textContent = j.ask === "hyp" ? "corde" : "hauteur";
  const inp = $("#mjn-in"); inp.value = ""; inp.disabled = false; $("#mjn-go").disabled = false;
  $("#mjn-q").hidden = false; $(".mj-grappin-form").hidden = false;
  $(".mj-grappin-svg").setAttribute("aria-label", j.ask === "hyp"
    ? `Triangle ${j.tri} rectangle en ${j.P.H} : écart horizontal ${f10(j.d10)} m, différence de hauteur ${f10(j.v10)} m, corde inconnue.`
    : `Triangle ${j.tri} rectangle en ${j.P.H} : corde ${f10(j.L10)} m, écart horizontal ${f10(j.d10)} m, hauteur inconnue.`);
  dessiner(fondu);
}

/* ---------- dessin ---------- */
function alea(seed){ let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = s*16807 % 2147483647)/2147483647; }
function pill(x, y, t, cl){ const w = t.length*9.6 + 16; return `<g class="pill ${cl || ""}"><rect x="${(x - w/2).toFixed(1)}" y="${(y - 14).toFixed(1)}" width="${w.toFixed(1)}" height="27" rx="13.5"/><text x="${x.toFixed(1)}" y="${(y + 6).toFixed(1)}" text-anchor="middle">${t}</text></g>`; }
function immeuble(x0, x1, y, fill, rd, lad){
  let s = `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="${RUE - y + 20}" fill="${fill}"/><rect x="${x0}" y="${y - 5}" width="${x1 - x0}" height="7" fill="#58628f"/>`;
  const m = 16, cw = 26, rh = 30;
  for (let yy = y + 20; yy < RUE - 26; yy += rh) for (let xx = x0 + m; xx + 12 < x1 - m + 4; xx += cw){
    if (xx < 0 || xx > W) continue;
    s += `<rect x="${xx}" y="${yy}" width="12" height="16" rx="1.5" fill="${rd() < .32 ? "#ffd76a" : "#252c4f"}"/>`; }
  return s;
}
function fond(){
  let s = `<defs><linearGradient id="mjn-ciel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151d45"/><stop offset=".55" stop-color="#3b3474"/><stop offset="1" stop-color="#c96f6a"/></linearGradient></defs>`;
  s += `<rect width="${W}" height="${H}" fill="url(#mjn-ciel)"/>`;
  const rd = alea(7);
  for (let k = 0; k < 40; k++) s += `<circle cx="${(rd()*W).toFixed(0)}" cy="${(rd()*170).toFixed(0)}" r="${(rd()*1.3 + .4).toFixed(1)}" fill="#fff" opacity="${(rd()*.5 + .3).toFixed(2)}"/>`;
  s += `<circle cx="728" cy="52" r="24" fill="#fff3c4" opacity=".95"/>`;
  let x = 0, sky = "";
  while (x < W){ const w = 30 + rd()*50, h = 90 + rd()*150; sky += `<rect x="${x.toFixed(0)}" y="${(RUE - h).toFixed(0)}" width="${(w - 4).toFixed(0)}" height="${h.toFixed(0)}"/>`; x += w; }
  s += `<g fill="#2b2a5c" opacity=".75">${sky}</g>`;
  return s;
}
function benne(xg, gx, devant){ const bw = Math.max(36, Math.min(72, gx - 26)), x = xg - bw/2;
  if (devant) return `<path d="M${x} ${RUE - 22}H${x + bw}L${x + bw - 4} ${RUE}H${x + 4}Z" fill="#2f9e44" stroke="#1b5e2a" stroke-width="2"/><path d="M${x + 6} ${RUE - 14}H${x + bw - 6}" stroke="#1b5e2a" stroke-width="2"/>`;
  return `<g><rect x="${x + 4}" y="${RUE - 31}" width="${bw*.35}" height="14" fill="#c8a165" stroke="#8a6a3a" transform="rotate(-8 ${x + 4} ${RUE - 31})"/><rect x="${x + bw*.5}" y="${RUE - 33}" width="${bw*.38}" height="15" fill="#d9b47a" stroke="#8a6a3a" transform="rotate(6 ${x + bw*.5} ${RUE - 33})"/></g>`; }
function ninjaSVG(){
  const c = "#1b1e2b", band = "#e03131";
  const tete = (cy) => `<circle cy="${cy}" r="9" fill="${c}"/><rect x="-2" y="${cy - 4}" width="11" height="5.5" rx="2.7" fill="#f3cfaa"/><circle cx="2.5" cy="${cy - 1.3}" r="1.3" fill="#111"/><circle cx="6.5" cy="${cy - 1.3}" r="1.3" fill="#111"/><rect x="-9" y="${cy - 8.5}" width="18" height="3.6" fill="${band}"/><path d="M-9 ${cy - 7}q-8 -3 -13 2M-9 ${cy - 6}q-6 3 -11 8" stroke="${band}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  return `<g id="mjn-nj">
    <g class="p-debout"><path d="M-4 0L-3 -13M4 0L3 -13" stroke="${c}" stroke-width="5.5" stroke-linecap="round"/><rect x="-8" y="-30" width="16" height="19" rx="6" fill="${c}"/><rect x="-8" y="-17" width="16" height="3" fill="${band}"/><path d="M2 -25L11 -18" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/>${tete(-38)}</g>
    <g class="p-pendu" style="display:none"><circle r="4" fill="#cfd6e2" stroke="#56637a" stroke-width="1.5"/><path d="M-2 1L-5 14M2 1L5 14" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/>${tete(14)}<rect x="-8" y="21" width="16" height="18" rx="6" fill="${c}"/><rect x="-8" y="33" width="16" height="3" fill="${band}"/><path d="M-4 38L-8 50M4 38L2 51" stroke="${c}" stroke-width="5.5" stroke-linecap="round"/></g>
    <g class="p-chute" style="display:none"><path d="M-4 0L-9 -12M4 0L9 -12" stroke="${c}" stroke-width="5.5" stroke-linecap="round"/><rect x="-8" y="-30" width="16" height="19" rx="6" fill="${c}"/><path d="M-6 -27L-14 -40M6 -27L14 -40" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/>${tete(-38)}</g>
    <g class="p-etoiles" style="display:none">${[0,1,2].map(k => `<path d="M0 -6L1.8 -1.8L6 0L1.8 1.8L0 6L-1.8 1.8L-6 0L-1.8 -1.8Z" fill="#ffd43b" transform="translate(${-12 + k*12} -58)"/>`).join("")}</g>
  </g>`;
}
function dessiner(fondu){
  const j = G.j, g = G.g, rd = alea(j.seed);
  let s = fond();
  s += `<rect x="0" y="${RUE}" width="${W}" height="${H - RUE}" fill="#14182c"/><path d="M0 ${RUE}H${W}" stroke="#3a4170" stroke-width="2"/>`;
  s += benne(g.xg, g.gx);
  s += immeuble(-10, g.xN, g.yN, "#2c3560", rd, false);
  s += immeuble(g.bx, W + 10, g.yB, "#3a3060", rd, j.ask === "cote");
  if (j.ask === "cote"){   /* échelle de secours sur la façade d'en face */
    let r = ""; for (let y = g.yB + 6; y < RUE; y += 11) r += `M${g.xC - 3} ${y}H${g.xC + 8}`;
    s += `<path d="M${g.xC - 3} ${g.yB - 16}V${RUE}M${g.xC + 8} ${g.yB - 16}V${RUE}" stroke="#aab4cf" stroke-width="2.4"/><path d="${r}" stroke="#aab4cf" stroke-width="1.8"/>`;
  }
  s += `<rect x="${g.xN - 6}" y="${g.yN - 9}" width="5" height="9" fill="#aab4cf"/>`;   /* piquet où la corde est attachée */
  /* triangle rectangle */
  const N = g.N, C = g.C, Hp = g.Hp;
  s += `<path class="leg" d="M${N.x} ${N.y}L${Hp.x} ${Hp.y}L${C.x} ${C.y}"/>`;
  s += `<path class="hy" id="mjn-hy" d="M${N.x} ${N.y}L${C.x} ${C.y}"/>`;
  const u = (P) => { const dx = P.x - Hp.x, dy = P.y - Hp.y, l = Math.hypot(dx, dy); return {x: dx/l, y: dy/l}; };
  const e1 = u(N), e2 = u(C), q = 15;
  s += `<path class="ang" d="M${Hp.x + q*e1.x} ${Hp.y + q*e1.y}L${Hp.x + q*(e1.x + e2.x)} ${Hp.y + q*(e1.y + e2.y)}L${Hp.x + q*e2.x} ${Hp.y + q*e2.y}"/>`;
  /* étiquettes des longueurs */
  const hv = j.ask === "hyp" ? f10(j.v10) + " m" : "? m", hh = f10(j.d10) + " m", hr = j.ask === "hyp" ? "? m" : f10(j.L10) + " m";
  const vx = j.up ? g.xC + 44 : g.xN - 44, vy = (g.yN + g.yC)/2;
  const hx = (g.xN + g.xC)/2, hy = (j.up ? g.yN : g.yC) + 24;
  const M = {x: (N.x + C.x)/2, y: (N.y + C.y)/2}; let nx = -(C.y - N.y), ny = C.x - N.x; const nl = Math.hypot(nx, ny); nx /= nl; ny /= nl;
  if (nx*(M.x - Hp.x) + ny*(M.y - Hp.y) < 0){ nx = -nx; ny = -ny; }
  s += `<g id="mjn-labs">${pill(vx, vy, hv, j.ask === "cote" ? "q" : "")}${pill(hx, hy, hh, "")}${pill(M.x + nx*24, M.y + ny*24, hr, j.ask === "hyp" ? "q" : "")}</g>`;
  /* lettres des sommets */
  const lab = (P, t, dx, dy) => `<text class="pt" x="${P.x + dx}" y="${P.y + dy}" text-anchor="middle">${t}</text>`;
  s += lab(N, j.P.N, j.up ? -18 : 12, j.up ? 22 : -12);
  s += lab(Hp, j.P.H, j.up ? 16 : -16, j.up ? 22 : 20);
  s += lab(C, j.P.C, j.ask === "cote" ? 22 : 10, j.up || j.ask === "hyp" ? -12 : 6);
  s += `<g id="mjn-sol"></g><path id="mjn-rope" class="rope" d=""/>`;
  s += `<g id="mjn-hook" style="display:none"><path d="M-7 0H3M3 0q6 -1 7 -8M3 0q6 1 7 8M3 0h9" stroke="#dfe5ef" stroke-width="2.8" fill="none" stroke-linecap="round"/></g>`;
  s += ninjaSVG() + benne(g.xg, g.gx, true) + `<g id="mjn-fx"></g>`;
  const svg = $(".mj-grappin-svg");
  svg.innerHTML = `<g class="sc${fondu ? " out" : ""}">${s}</g>`;
  pose("debout", g.xN - 16, g.yN - 5);
  if (fondu) requestAnimationFrame(() => requestAnimationFrame(() => { const sc = svg.querySelector(".sc"); if (sc) sc.classList.remove("out"); }));
}
function pose(p, x, y, rot, sx, sy){
  const n = $("#mjn-nj"); if (!n) return;
  ["debout", "pendu", "chute"].forEach(k => n.querySelector(".p-" + k).style.display = k === p ? "" : "none");
  n.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(rot || 0).toFixed(1)}) scale(${sx || 1} ${sy || 1})`);
}
function etoiles(on){ const e = $("#mjn-nj .p-etoiles"); if (e) e.style.display = on ? "" : "none"; }
function corde(d){ const r = $("#mjn-rope"); if (r) r.setAttribute("d", d); }
function crochet(P, ang){ const h = $("#mjn-hook"); if (!h) return; h.style.display = ""; h.setAttribute("transform", `translate(${P.x.toFixed(1)} ${P.y.toFixed(1)}) rotate(${(ang*180/Math.PI).toFixed(1)})`); }
function vider(){ const f = $("#mjn-fx"); if (f) f.innerHTML = ""; }
function bulle(x, y, t, col, sz, eclat){ const fxg = $("#mjn-fx"); if (!fxg) return null;
  const ns = "http://www.w3.org/2000/svg", e = document.createElementNS(ns, "text");
  if (eclat){ const p = document.createElementNS(ns, "path"), r1 = (sz || 26)*1.45, r2 = r1*.62; let d = "";
    for (let k = 0; k < 18; k++){ const a = k*Math.PI/9, r = k % 2 ? r2 : r1; d += (k ? "L" : "M") + (x + Math.cos(a)*r*1.35).toFixed(1) + " " + (y - (sz || 26)*.35 + Math.sin(a)*r*.8).toFixed(1); }
    p.setAttribute("d", d + "Z"); p.setAttribute("fill", "#fff3bf"); p.setAttribute("stroke", "#15213b"); p.setAttribute("stroke-width", "2"); fxg.appendChild(p); }
  e.setAttribute("class", "fxt"); e.setAttribute("x", x.toFixed(0)); e.setAttribute("y", y.toFixed(0)); e.setAttribute("text-anchor", "middle");
  e.setAttribute("fill", col); e.setAttribute("font-size", sz || 26); e.textContent = t; fxg.appendChild(e); return e; }

/* ---------- animation ---------- */
const ease = t => t < .5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2)/2, easeIn = t => t*t;
const lerp = (a, b, t) => a + (b - a)*t;
function anime(steps, done){
  const red = reduit(); let i = 0, t0 = null;
  const tick = ts => {
    if (!R0 || !R0.isConnected) return;
    if (i >= steps.length){ done && done(); return; }
    const st = steps[i]; if (t0 === null) t0 = ts;
    const dur = red && !st.keep ? 0 : st.dur, t = dur ? Math.min(1, (ts - t0)/dur) : 1;
    if (st.f) st.f(t);
    if (t >= 1){ i++; t0 = null; }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
}
const qb = (A, B, C, t) => ({x: (1-t)*(1-t)*A.x + 2*(1-t)*t*B.x + t*t*C.x, y: (1-t)*(1-t)*A.y + 2*(1-t)*t*B.y + t*t*C.y});
function qlen(A, B, C){ let L = 0, p = A; for (let i = 1; i <= 48; i++){ const q = qb(A, B, C, i/48); L += Math.hypot(q.x - p.x, q.y - p.y); p = q; } return L; }
function qmax(A, B, C){ let m = -1e9, tm = 0; for (let i = 0; i <= 60; i++){ const q = qb(A, B, C, i/60); if (q.y > m){ m = q.y; tm = i/60; } } return {y: m, t: tm}; }
/* point de contrôle de la corde qui pend (longueur R), sans descendre sous la rue */
function pente(A, C, R){
  const M = {x: (A.x + C.x)/2, y: (A.y + C.y)/2};
  let lo = 0, hi = 900;
  for (let k = 0; k < 32; k++){ const m = (lo + hi)/2; if (qlen(A, {x: M.x, y: M.y + m}, C) < R) lo = m; else hi = m; }
  let k = lo; const lim = RUE - 34;
  if (qmax(A, {x: M.x, y: M.y + k}, C).y > lim){ let a = 0, b = k; for (let i = 0; i < 30; i++){ const m = (a + b)/2; if (qmax(A, {x: M.x, y: M.y + m}, C).y > lim) b = m; else a = m; } k = a; }
  return {x: M.x, y: M.y + k};
}
function lancer(){
  if (busy || !G) return;
  const o = $(".mj-grappin-over"); if (!o.hidden){ const go = o.querySelector("[data-go]"); if (go && G.phase === "intro") go.click(); return; }
  if (G.phase !== "saisie") return;
  const j = G.j, r = lire($("#mjn-in").value);
  if (r.err){ msg(`<p>${r.err === "vide" ? `Écris d'abord la longueur ${j.ask === "hyp" ? "de la corde" : "demandée"}, en mètres.` : r.err}</p>`, "ko"); focusIn(); return; }
  const x = r.x, res = juger(j, x);
  busy = true; G.phase = "anim"; $("#mjn-how").open = false;
  $("#mjn-in").disabled = true; $("#mjn-go").disabled = true;
  msg(`<p>Le ninja lance son grappin…</p>`, "");
  const g = G.g, N = g.N;
  /* point visé et longueur de corde (en unités SVG) */
  const T = j.ask === "hyp" ? {x: g.xC, y: g.yC} : {x: g.xC, y: j.up ? g.yN - x*g.s : g.yN + x*g.s};
  const R = (j.ask === "hyp" ? x : j.L10/10)*g.s;
  const D = Math.hypot(T.x - N.x, T.y - N.y), ang = Math.atan2(T.y - N.y, T.x - N.x);
  const vol = (P) => [{dur: 650, f: t => { const e = ease(t), Q = {x: lerp(N.x, P.x, e), y: lerp(N.y, P.y, e) - Math.sin(Math.PI*t)*18}; crochet(Q, ang); corde(`M${N.x} ${N.y}L${Q.x.toFixed(1)} ${Q.y.toFixed(1)}`); }}];
  const st = [];
  if (j.ask === "cote"){ /* repère du point visé sur l'échelle */
    const yy = Math.max(8, Math.min(RUE - 4, T.y));
    st.push({dur: 1, f: () => { $("#mjn-sol").innerHTML = `<circle cx="${T.x}" cy="${yy}" r="9" fill="none" stroke="#ff8787" stroke-width="3"/><path d="M${T.x - 14} ${yy}h28M${T.x} ${yy - 14}v28" stroke="#ff8787" stroke-width="2"/>`; }});
  }
  if (res === 0){
    const Tc = T;
    st.push(...vol(Tc));
    st.push({dur: 160, f: t => { if (t === 1) bulle(Tc.x - 30, Tc.y - 26, "Clac !", "#ffd43b", 20); }});
    st.push({dur: 220, f: t => pose("debout", lerp(N.x - 16, N.x - 6, t), N.y - 5 - 10*Math.sin(Math.PI*t))});
    st.push({dur: 950, f: t => { if (t > .5) vider(); const e = ease(t); pose("pendu", lerp(N.x, Tc.x, e), lerp(N.y, Tc.y, e)); }});
    if (j.ask === "hyp") st.push({dur: 300, f: t => pose("debout", lerp(Tc.x, Tc.x + 18, t), lerp(Tc.y + 40, Tc.y - 5, ease(t)) - Math.sin(Math.PI*t)*14)});
    else st.push({dur: 650, f: t => pose("debout", Tc.x + 2, lerp(Tc.y + 48, g.yB - 5, ease(t)))}, {dur: 220, f: t => pose("debout", lerp(Tc.x + 2, Tc.x + 26, t), g.yB - 5 - Math.sin(Math.PI*t)*12)});
  } else if (res < 0){
    const l = Math.max(12, Math.min(R, D - 26)), P = {x: N.x + Math.cos(ang)*l, y: N.y + Math.sin(ang)*l};
    st.push(...vol(P));
    st.push({dur: 260, f: t => { if (t === 1) bulle(P.x, P.y - 22, "?!", "#ffd43b", 26); }});
    st.push({dur: 650, f: t => { const a = lerp(ang, Math.PI/2, easeIn(t)); let Q = {x: N.x + Math.cos(a)*l, y: N.y + Math.sin(a)*l}; if (Q.y > RUE - 4) Q = {x: Math.min(g.bx - 8, N.x + Math.sqrt(Math.max(0, l*l - (RUE - 4 - N.y)**2))), y: RUE - 4};
      crochet(Q, a); corde(`M${N.x} ${N.y}L${Q.x.toFixed(1)} ${Q.y.toFixed(1)}`);
      pose("chute", lerp(N.x - 16, N.x + 22, t), N.y - 5 - Math.sin(Math.PI*t*.8)*30); }});
    const x0 = N.x + 22, y0 = N.y - 5 - Math.sin(Math.PI*.8)*30, xb = g.xg, yb = RUE - 46;
    st.push({dur: 750, f: t => { if (t === 0) vider(); pose("chute", lerp(x0, xb, t), lerp(y0, yb, easeIn(t)), 180*easeIn(t)); }});
    st.push({dur: 120, f: t => { if (t === 1){ bulle(xb, RUE - 66, "POUF !", "#ffa94d", 30, true); pose("debout", xb, yb, 180); } }});
  } else {
    const slack = Math.max(R, D + 16);
    const K = pente(N, T, slack), M = {x: (N.x + T.x)/2, y: (N.y + T.y)/2};
    st.push(...vol(T));
    st.push({dur: 160, f: t => { if (t === 1) bulle(T.x - 30, T.y - 26, "Clac !", "#ffd43b", 20); }});
    st.push({dur: 420, f: t => { const k = {x: M.x, y: lerp(M.y, K.y, ease(t))}; corde(`M${N.x} ${N.y}Q${k.x.toFixed(1)} ${k.y.toFixed(1)} ${T.x} ${T.y}`); }});
    const low = qmax(N, K, T), tl = Math.max(.15, Math.min(low.t, .8)), Pl = qb(N, K, T, tl);
    const Wx = g.bx - 9, Wy = Math.min(RUE - 40, Math.max(Pl.y + 8, T.y + 30));
    st.push({dur: 760, f: t => { if (t > .4) vider(); const P = qb(N, K, T, tl*easeIn(t)); pose("pendu", P.x, P.y); }});
    st.push({dur: 260, f: t => pose("pendu", lerp(Pl.x, Wx, t), lerp(Pl.y, Wy - 20, t))});
    st.push({dur: 140, f: t => { if (t === 1){ pose("debout", Wx + 6, Wy + 22, 0, .42, 1.06); bulle(Math.max(70, Wx - 60), Math.max(60, Wy - 40), "PAF !", "#ff6b6b", 32, true); etoiles(true); } }});
    st.push({dur: 1000, keep: true, f: t => pose("debout", Wx + 6, lerp(Wy + 22, RUE - 2, easeIn(t)), 0, lerp(.42, 1, Math.max(0, t*1.6 - .6)), 1)});
  }
  st.push({dur: 650, keep: true, f: t => { if (t === 1 && res !== 0) vider(); }});
  anime(st, () => resultat(x, res));
}
function resultat(x, res){
  busy = false;
  const j = G.j, C = LV[niv];
  if (res === 0){
    G.serie++; G.ok++; G.best = Math.max(G.best, G.serie);
    const bonus = Math.min(100, 25*(G.serie - 1)), gain = C.pts + bonus;
    G.score += gain;
    const autre = j.arr && Math.abs(x*10 - j.rep10) > 1e-9 ? `<p class="tip">Ta valeur ${fx(x)} m est juste à 0,1 m près. Au dixième près, on écrit ${f10(j.rep10)} m.</p>` : "";
    bulle(G.g.C.x + 20, G.g.yB - 66, "+" + gain, "#69db7c", 28);
    msg(`<p><b>${pick(["Pile la bonne longueur !", "Parfait, la corde est bien tendue !", "Atterrissage réussi !", "Quel ninja !"])}</b> ${j.ask === "hyp" ? "La corde mesurait" : "Il fallait viser à"} ${j.arr && !j.parfait ? "environ " : ""}${f10(j.rep10)} m${j.ask === "hyp" ? "" : (j.up ? " plus haut" : " plus bas")}.</p>${autre}<p>+${C.pts} points${bonus ? ` et +${bonus} pour la série de ${G.serie}` : ""}.</p>`, "ok");
    stats();
    G.k++;
    if (G.k >= NSAUTS){ fin(); return; }
    G.phase = "trans";
    tmo = setTimeout(() => { if (!R0 || !R0.isConnected || !G || G.phase !== "trans") return; G.phase = "saisie"; poser(true); focusIn(); }, reduit() ? 500 : 900);
    return;
  }
  G.vies--; G.serie = 0;
  stats();
  /* la bonne corde, en vert */
  const g = G.g;
  const sol = $("#mjn-sol");
  sol.innerHTML += `<path class="solr" d="M${g.N.x} ${g.N.y}L${g.C.x} ${g.C.y}"/>`;
  const labs = $("#mjn-labs").querySelectorAll(".pill.q");
  labs.forEach(p => { p.setAttribute("class", "pill sol"); const t = p.querySelector("text"), rct = p.querySelector("rect");
    const txt = (j.arr && !j.parfait ? "≈ " : "") + f10(j.rep10) + " m", w = txt.length*9.6 + 16, cx = +t.getAttribute("x");
    t.textContent = txt; rct.setAttribute("x", (cx - w/2).toFixed(1)); rct.setAttribute("width", w.toFixed(1)); });
  const tip = piege(j, x);
  const der = G.vies <= 0 || G.k + 1 >= NSAUTS;
  msg(`<p><b>${verdict(j, x, res)}</b></p>${tip ? `<p class="tip">${tip}</p>` : ""}<ol class="mj-grappin-cor">${correction(j).map(l => `<li>${l}</li>`).join("")}</ol>
    <button class="btn primary" type="button" id="mjn-next">${der ? "Voir le bilan" : "Saut suivant →"}</button>`, "ko");
  G.phase = "cor"; $("#mjn-q").hidden = true; $(".mj-grappin-form").hidden = true;
  const nb = $("#mjn-next"); nb.onclick = suivant; nb.focus({preventScroll: true});
}
function suivant(){
  if (!G || G.phase !== "cor") return;
  G.k++;
  if (G.vies <= 0 || G.k >= NSAUTS){ fin(); return; }
  G.phase = "saisie"; poser(true); msg(`<p>Nouveau saut ! ${LV[niv].exact ? "La valeur doit être exacte." : "Arrondis au dixième de mètre."}</p>`, ""); focusIn();
}
function fin(){
  G.phase = "fin"; $("#mjn-in").disabled = true; $("#mjn-go").disabled = true;
  const perdu = G.vies <= 0, st = perdu ? 0 : G.vies, r = MEM.lv[niv] || {sc: 0, st: 0};
  const rec = !perdu && G.score > (r.sc || 0);
  if (!perdu){ MEM.lv[niv] = {sc: Math.max(r.sc || 0, G.score), st: Math.max(r.st || 0, st)}; sauver(); niveaux(); }
  const rr = MEM.lv[niv]; $("#mjn-rec").textContent = rr && rr.sc ? `Record : ${pts(rr.sc)} pts` : "";
  const etoilesH = `<div class="stars" aria-label="${st} étoile${st > 1 ? "s" : ""} sur 3">${[0,1,2].map(k => `<span class="${k < st ? "" : "v"}">★</span>`).join("")}</div>`;
  const suiv = niv + 1 < LV.length && !perdu ? `<button class="btn primary" type="button" data-niv="${niv + 1}">Niveau ${niv + 2} →</button>` : "";
  carte(perdu
    ? `<h3>Plus de vies !</h3><p>Le ninja est couvert de cartons… Tu as réussi ${plur(G.ok, "saut")} sur ${G.k}. Relis bien les corrections, puis retente ta chance : les sauts changent à chaque partie.</p><p>Score : <b>${pts(G.score)} points</b></p><button class="btn primary" type="button" data-niv="${niv}">Recommencer le niveau</button>`
    : `<h3>Niveau ${niv + 1} terminé !</h3>${etoilesH}<p>${G.ok} saut${G.ok > 1 ? "s" : ""} réussi${G.ok > 1 ? "s" : ""} sur ${NSAUTS}, meilleure série : ${G.best}.</p><p>Score : <b>${pts(G.score)} points</b>${rec ? " · nouveau record !" : ` · record : ${pts(MEM.lv[niv].sc)}`}</p>${st < 3 ? `<p>Pour ★★★ : termine le niveau sans perdre de vie.</p>` : niv + 1 === LV.length ? `<p>Tu es un vrai maître ninja de Pythagore !</p>` : ""}${suiv}<button class="btn${suiv ? "" : " primary"}" type="button" data-niv="${niv}">Rejouer</button>`);
  const b = $(".mj-grappin-over .btn"); if (b) setTimeout(() => b.focus({preventScroll: true}), 30);
}

return {init, _t: {LV, GEN, generer, mk, valide, forme, lire, juger, piege, correction, verdict, geo, isqrt, f10, f100, fx, pente, qlen, qmax, NSAUTS}, _etat: () => G};
})();
