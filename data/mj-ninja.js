/* Fraction Ninja (6e, fractions) : des barres de chocolat, des pizzas et des pastèques sont lancées en l'air
   avec une consigne (« Coupe aux 3/5 »). L'élève les tranche d'un geste de la souris (cliquer-glisser à travers
   l'objet) ; on mesure où la coupe traverse l'objet, le long de sa LONGUEUR (barre, pizza rectangulaire) ou de son
   DIAMÈTRE (pastèque), en partant de la gauche. La partie mathématique ne manipule que des fractions entières
   n/d ; la position de la coupe f (entre 0 et 1) n'est comparée qu'à la cible exacte nl/d. */
window.MJ_NINJA = (function(){
const KEY = "staal-mj-ninja6";
const W = 1100, H = 430;                 // repère du canvas (unités logiques)
const FREEZE = .75;                      // durée de l'arrêt sur image après une coupe (s)
const rnd = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const rf = (a,b) => a + Math.random()*(b-a);
const pick = a => a[Math.floor(Math.random()*a.length)];
const gcd = (a,b) => b ? gcd(b, a % b) : a;

/* ---------- écriture ---------- */
const FR = (n,d) => `<span class="mj-ninja-fr"><span>${n}</span><span>${d}</span></span>`;
const aux = n => n === 1 ? "au" : "aux";
const plur = (n, mot) => n > 1 ? mot + "s" : mot;
const rang = k => k === 1 ? "1re" : k + "e";
/* noms : [l'objet mesuré, « de … », L'objet entier, objet qui tombe] */
const NOM = {
  choco:{le:"la barre", de:"de la barre", entier:"La barre entière", tombe:"La barre est tombée"},
  pizza:{le:"la pizza", de:"de la pizza", entier:"La pizza entière", tombe:"La pizza est tombée"},
  melon:{le:"le diamètre", de:"du diamètre", entier:"Le diamètre entier", tombe:"La pastèque est tombée"}
};

/* ---------- énoncés ----------
   kind : choco | pizza | melon ; mode : coupe (la part de gauche = n/d) | reste (la part de droite = n/d) ;
   nl/d : la part de gauche à obtenir (= la position de la bonne coupe) ; cols : nombre de carrés visibles (0 : sans repère). */
function spec(kind, mode, n, d, cols){
  return {kind, mode, n, d, nl: mode === "reste" ? d - n : n, cols: kind === "choco" ? (cols || 0) : 0};
}
const frac = (dens, nmin) => { const d = pick(dens); return [rnd(nmin || 1, d-1), d]; };
const lisse = () => pick(["choco","pizza","melon"]);
const EGALES = [[2,4],[2,6],[4,6],[3,6],[2,8],[4,8],[6,8],[3,9],[6,9],[2,10],[4,10],[5,10],[6,10],[8,10],[3,12],[4,12],[6,12],[8,12],[9,12],[10,12]];
function egale(sansAide){ const [n,d] = pick(EGALES), g = gcd(n,d);
  return !sansAide && Math.random() < .5 ? spec("choco","coupe",n,d,d/g) : spec(lisse(),"coupe",n,d); }
function reste(dens, cols){ const d = pick(dens.filter(x => x > 2)), n = rnd(1, d-1); const k = Math.random() < .5 ? "choco" : lisse();
  return spec(k, "reste", n, d, cols && k === "choco" ? d : 0); }
const LV = [
  {titre:"Moitiés, tiers, quarts", desc:"Les carrés t'aident : compte-les !", T:5.4,
   gen(){ const [n,d] = frac([2,3,3,4,4]); return [spec("choco","coupe",n,d,d)]; }},
  {titre:"Jusqu'aux sixièmes", desc:"Toujours des carrés, avec des cinquièmes et des sixièmes.", T:5.2,
   gen(){ const [n,d] = frac([3,4,5,5,6,6]); return [spec("choco","coupe",n,d,d)]; }},
  {titre:"Plus de carrés que de parts", desc:"12 carrés et des quarts : combien de carrés dans un quart ?", T:5.2,
   gen(){ const [n,d] = frac([2,3,3,4,4,5,6]), ks = []; for(let k = 2; k*d <= 12; k++) ks.push(k);
     return [spec("choco","coupe",n,d,d*pick(ks))]; }},
  {titre:"Sans les carrés", desc:"Plus aucun repère : imagine les parts égales.", T:5.0,
   gen(){ const [n,d] = frac([2,3,4,4,5,5]); return [spec(pick(["choco","pizza"]),"coupe",n,d)]; }},
  {titre:"La pastèque", desc:"On coupe le diamètre (le trait blanc) : c'est une longueur.", T:5.0,
   gen(){ const [n,d] = frac([2,3,4,5,6]); return [spec(Math.random() < .7 ? "melon" : pick(["choco","pizza"]),"coupe",n,d)]; }},
  {titre:"Ce qui reste", desc:"« Laisse 2/5 à droite » : où faut-il couper ?", T:5.0,
   gen(){ if(Math.random() < .65) return [reste([3,4,5,6,8], Math.random() < .4)];
     const [n,d] = frac([3,4,5,6,8]); return [spec(lisse(),"coupe",n,d)]; }},
  {titre:"Dénominateurs variés", desc:"Des septièmes, des dixièmes, des douzièmes…", T:4.6,
   gen(){ if(Math.random() < .2) return [reste([5,6,8,10])];
     const [n,d] = frac([5,6,7,8,9,10,12]); return [spec(lisse(),"coupe",n,d)]; }},
  {titre:"Fractions égales", desc:"6/8 de la barre, c'est la même longueur que 3/4 !", T:4.6,
   gen(){ return [egale()]; }},
  {titre:"Double lancer", desc:"Deux objets à la fois : chacun a sa fraction écrite au-dessus.", T:5.6, nb:6, double:true,
   gen(){ const one = () => { if(Math.random() < .25) return reste([3,4,5,6,8,10], Math.random() < .3);
       const [n,d] = frac([2,3,4,5,6,8,10]); return Math.random() < .3 ? spec("choco","coupe",n,d,d) : spec(lisse(),"coupe",n,d); };
     return [one(), one()]; }},
  {titre:"Maître ninja", desc:"Tout est mélangé et ça va plus vite. Garde ton combo !", T:3.9,
   gen(){ const r = Math.random(); if(r < .25) return [reste([3,4,5,6,7,8,9,10,12])]; if(r < .45) return [egale(true)];
     const [n,d] = frac([3,4,5,6,7,8,9,10,12]); return [spec(lisse(),"coupe",n,d)]; }}
];
LV.forEach(l => { l.nb = l.nb || 10; l.nobj = l.nb * (l.double ? 2 : 1); const M = l.nobj * 100; l.etoiles = [Math.round(M*.35), Math.round(M*.7), M]; });
/* même énoncé deux fois de suite : on recommence */
function genere(lv, prec){
  const cle = s => s.map(o => o.kind + o.mode + o.n + "/" + o.d).join();
  let s, k = 0; do s = LV[lv].gen(); while(prec && cle(s) === cle(prec) && ++k < 20);
  if(s.length === 2 && s[0].n * s[1].d === s[1].n * s[0].d && s[0].mode === s[1].mode && ++k < 20) return genere(lv, prec);
  return s;
}

/* ---------- précision ----------
   f : position de la coupe (0 = bout gauche, 1 = bout droit). Écart en % de la longueur.
   « bonne part » : la coupe est plus près de la bonne graduation nl/d que de toute autre graduation k/d. */
function mesure(o, f){
  const t = o.nl / o.d, raw = Math.abs(f - t) * 100, E = Math.round(raw), k = Math.round(f * o.d);
  const bonnePart = Math.abs(f - t) * o.d <= .5;
  let pts = E <= 2 ? 100 : E <= 5 ? 70 : E <= 10 ? 40 : E <= 15 ? 15 : 0;
  if(!bonnePart) pts = Math.min(pts, 15);
  return {f, raw, E, k, pts, bonnePart, precis: pts >= 70, ok: pts >= 40};
}
const VERDICT = {100:"Parfait !", 70:"Très précis !", 40:"Bien !", 15:"Presque…", 0:"Raté"};
const COMBO = c => c >= 2 ? 25 * Math.min(c - 1, 4) : 0;
function etoiles(lv, sc){ return LV[lv].etoiles.filter(s => sc >= s).length; }

/* ---------- explications ---------- */
function consigneHTML(o){
  if(o.mode === "reste") return `Laisse ${FR(o.n,o.d)} à droite`;
  return o.kind === "melon" ? `Coupe le diamètre ${aux(o.n)} ${FR(o.n,o.d)}` : `Coupe ${aux(o.n)} ${FR(o.n,o.d)}`;
}
function sousConsigne(o){
  const N = NOM[o.kind];
  if(o.mode === "reste") return `La part de droite doit mesurer ${FR(o.n,o.d)} ${N.de}. Où faut-il couper ?`;
  return `La part de gauche doit mesurer ${FR(o.n,o.d)} ${N.de}.`;
}
/* le sens de la fraction : comment trouver la bonne coupe */
function sens(o){
  const N = NOM[o.kind], d = o.d, a = o.nl;
  let s;
  if(o.mode === "reste") s = `Il doit rester ${FR(o.n,d)} à droite. ${N.entier}, c'est ${FR(d,d)} : à gauche, il faut ${FR(d,d)} − ${FR(o.n,d)} = ${FR(a,d)}, donc on coupe à la fin de la ${rang(a)} part sur ${d}.`;
  else s = `${FR(o.n,d)} ${N.de} : on partage ${N.le} en ${d} parts égales et on en prend ${o.n} en partant de la gauche.`;
  if(o.cols && o.cols !== d){
    if(o.cols % d === 0){ const k = o.cols / d; s += ` Il y a ${o.cols} carrés : ${FR(1,d)} = ${k} carrés, donc ${FR(a,d)} = ${a*k} carrés.`; }
    else { const g = d / o.cols; s += ` ${FR(a,d)} = ${FR(a/g,o.cols)} (on divise ${a} et ${d} par ${g}) : on coupe après ${a/g} ${plur(a/g,"carré")} sur ${o.cols}.`; }
  } else if(gcd(a,d) > 1){ const g = gcd(a,d); s += ` Remarque : ${FR(a,d)} = ${FR(a/g,d/g)} (on divise ${a} et ${d} par ${g}).`; }
  return s;
}
/* ce qui n'allait pas dans la coupe (f = null : objet pas coupé) */
function diag(o, M){
  if(!M) return `${NOM[o.kind].tombe} sans être coupée. La prochaine fois, clique et glisse à travers l'objet pendant qu'il est en l'air.`;
  const d = o.d, f = M.f, t = o.nl / d, tol = .25 / d;
  if(o.mode === "coupe" && o.nl * 2 !== d && Math.abs(f - (d - o.nl) / d) <= tol)
    return `Tu as coupé ${aux(d - o.nl)} ${FR(d - o.nl, d)} : tu as compté depuis la droite ! C'est la part de <b>gauche</b> qui doit mesurer ${FR(o.nl,d)}.`;
  if(o.mode === "reste" && o.n * 2 !== d && Math.abs(f - o.n / d) <= tol)
    return `Tu as coupé ${aux(o.n)} ${FR(o.n,d)} : la part de gauche mesure ${FR(o.n,d)}. Mais ce sont les ${FR(o.n,d)} qui doivent <b>rester à droite</b>.`;
  const k = M.k;
  if(k > 0 && k < d && k !== o.nl && Math.abs(f - k / d) <= tol){
    const e = o.nl - k;
    return `Ta coupe laisse ${FR(k,d)} à gauche : ${e > 0 ? `il manque ${e} ${plur(e,"part")}` : `il y a ${-e} ${plur(-e,"part")} de trop`}.`;
  }
  if(!M.bonnePart){
    const pres = k <= 0 ? "du bout gauche" : k >= d ? "du bout droit" : `de ${FR(k,d)}`;
    return `Ta coupe est plus près ${pres} que de ${FR(o.nl,d)} (écart : ${M.E} %).`;
  }
  return `Ta coupe est trop à ${f < t ? "gauche" : "droite"} (écart : ${M.E} %).`;
}

/* ---------- record ---------- */
function lire(){ try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }catch(e){ return {}; } }
function ecrire(r){ try{ localStorage.setItem(KEY, JSON.stringify(r)); }catch(e){} }

/* ---------- style ---------- */
const CSS = `
.mj-ninja{--nj-gold:#e8a200;color:var(--ink)}
.mj-ninja-top{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:0 0 10px}
.mj-ninja-lv{min-width:52px;height:52px;border-radius:12px;border:2px solid var(--line);background:var(--surface);color:var(--ink);font:inherit;font-weight:700;font-size:1rem;line-height:1;cursor:pointer;display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:4px 6px}
.mj-ninja-lv small{font-size:.72rem;letter-spacing:1px;color:var(--nj-gold);font-weight:700}
.mj-ninja-lv small i{font-style:normal;color:color-mix(in srgb,var(--muted) 40%,transparent)}
.mj-ninja-lv.on{border-color:var(--c);box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 30%,transparent)}
.mj-ninja-rec{margin-left:auto;margin-right:4px;font-weight:600;color:var(--muted);font-size:.95rem}
.mj-ninja-aideb{font:inherit;font-size:.92rem;font-weight:700;border:2px solid var(--c);color:var(--c);background:var(--surface);padding:6px 14px;border-radius:999px;cursor:pointer}
.mj-ninja-help{margin:0 0 10px;border:2px dashed color-mix(in srgb,var(--c) 45%,var(--line));border-radius:14px;padding:8px 16px;background:var(--surface)}
.mj-ninja-help ul{margin:0;padding-left:1.2em;line-height:1.6}
.mj-ninja-card{border:2px solid var(--line);border-radius:18px;background:var(--surface);padding:12px 18px 14px}
.mj-ninja-hud{display:flex;align-items:center;gap:22px;margin:0 0 10px;flex-wrap:wrap}
.mj-ninja-cons{flex:1;min-width:260px;display:flex;flex-direction:column;gap:2px}
.mj-ninja-cons .lvt{font-size:.88rem;color:var(--muted);font-weight:700}
.mj-ninja-cons .big{font-family:var(--f-display);font-weight:800;font-size:1.7rem;line-height:1.15;color:var(--c);display:flex;align-items:center;gap:.3em;flex-wrap:wrap;min-height:2.6rem}
.mj-ninja-cons .sub{font-size:.95rem;color:var(--muted);font-weight:600;line-height:1.4}
.mj-ninja-fr{display:inline-flex;flex-direction:column;align-items:center;line-height:1.05;vertical-align:middle;font-weight:800;margin:0 .08em}
.mj-ninja-fr>span{padding:0 .16em}
.mj-ninja-fr>span:first-child{border-bottom:.09em solid currentColor}
.mj-ninja-cons .big .mj-ninja-fr{font-size:.86em}
.mj-ninja-cons .sub .mj-ninja-fr,.mj-ninja-msg .mj-ninja-fr{font-size:.86em}
.mj-ninja-stat{display:flex;flex-direction:column;line-height:1.2;min-width:62px}
.mj-ninja-stat b{font-family:var(--f-display);font-size:1.45rem}
.mj-ninja-stat span{font-size:.85rem;color:var(--muted);font-weight:600}
.mj-ninja-stat.combo b{color:var(--nj-gold)}
.mj-ninja-board{position:relative;border-radius:14px;overflow:hidden;background:#15203d;outline:none;line-height:0}
.mj-ninja-board:focus-visible{box-shadow:0 0 0 3px var(--c)}
.mj-ninja-board canvas{display:block;width:100%;margin:0 auto;height:auto;aspect-ratio:${W}/${H};touch-action:none;cursor:crosshair;user-select:none;-webkit-user-select:none}
.mj-ninja-ov{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;text-align:center;color:#fff;background:rgba(10,16,34,.55);line-height:1.4;padding:20px}
.mj-ninja-ov[hidden]{display:none}
.mj-ninja-ov h3{font-family:var(--f-display);font-size:2rem;margin:0;color:#fff}
.mj-ninja-ov p{margin:0;font-size:1.1rem;max-width:640px;color:#e8eefc}
.mj-ninja-ov .btn{font-size:1.15rem;padding:12px 26px;background:#ffcf3f;color:#15213b;border-color:#ffcf3f}
.mj-ninja-ov .btn:hover{background:#ffe07a}
.mj-ninja-ov .btn:focus-visible{outline:3px solid #fff;outline-offset:3px}
/* téléphone : le panneau tient dans la petite zone de jeu ; sur un très petit écran, la consigne du début est déjà écrite au-dessus */
@media (max-width:600px){ .mj-ninja-ov{gap:4px;padding:6px 10px} .mj-ninja-ov h3{font-size:1.15rem;line-height:1.15} .mj-ninja-ov p{font-size:.85rem;line-height:1.25} .mj-ninja-ov .btn{font-size:1rem;padding:7px 16px} }
@media (max-width:420px){ .mj-ninja-ov:has(.mj-ninja-go:not([hidden])) p{display:none} }
.mj-ninja-fb{display:flex;align-items:center;gap:16px;margin-top:10px;min-height:70px}
.mj-ninja-msg{flex:1;border-radius:12px;padding:8px 14px;background:color-mix(in srgb,var(--c) 8%,var(--surface));border:1.5px solid var(--line);line-height:1.5;font-size:1rem;min-height:52px}
.mj-ninja-msg.ok{border-color:var(--ok);background:var(--okbg)}
.mj-ninja-msg.ko{border-color:var(--ko);background:var(--kobg)}
.mj-ninja-msg .vd{font-family:var(--f-display);font-weight:800;font-size:1.12rem;margin-right:6px}
.mj-ninja-msg .pts{font-weight:800;color:var(--c)}
.mj-ninja-msg .cb{color:var(--nj-gold);font-weight:800;margin-left:6px}
.mj-ninja-fb .btn{white-space:nowrap}
.mj-ninja-end{display:flex;flex-direction:column;gap:6px}
.mj-ninja-end .big{font-family:var(--f-display);font-weight:800;font-size:1.25rem}
.mj-ninja-end .st{color:var(--nj-gold);font-size:1.5rem;letter-spacing:3px}
.mj-ninja-end .st i{font-style:normal;color:color-mix(in srgb,var(--muted) 40%,transparent)}
.mj-ninja-end .acts{display:flex;gap:10px;flex-wrap:wrap}
html.ls-1 .mj-ninja-cons .big{letter-spacing:.02em}
`;

/* ---------- dessin des objets (repère local : centre de l'objet, axe mesuré horizontal de -L/2 à L/2) ---------- */
function rr(c, x, y, w, h, r){ c.beginPath(); c.moveTo(x+r, y); c.arcTo(x+w, y, x+w, y+h, r); c.arcTo(x+w, y+h, x, y+h, r); c.arcTo(x, y+h, x, y, r); c.arcTo(x, y, x+w, y, r); c.closePath(); }
function dessChoco(c, o){
  const L = o.L, h = o.h, x0 = -L/2, y0 = -h/2;
  rr(c, x0, y0, L, h, 7); c.fillStyle = "#4a2412"; c.fill();
  if(o.cols){
    const cw = L / o.cols, rows = 2, rh = h / rows;
    for(let i = 0; i < o.cols; i++) for(let j = 0; j < rows; j++){
      const x = x0 + i*cw + 3, y = y0 + j*rh + 3, w = cw - 6, hh = rh - 6;
      const g = c.createLinearGradient(x, y, x, y + hh); g.addColorStop(0, "#9a5a32"); g.addColorStop(1, "#6e381b");
      rr(c, x, y, w, hh, 4); c.fillStyle = g; c.fill();
      c.fillStyle = "rgba(255,226,190,.18)"; c.fillRect(x + 4, y + 3, Math.max(0, w - 8), 3);
    }
  } else {
    const g = c.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, "#9a5a32"); g.addColorStop(.55, "#7a4122"); g.addColorStop(1, "#5e2f17");
    rr(c, x0 + 3, y0 + 3, L - 6, h - 6, 5); c.fillStyle = g; c.fill();
    c.fillStyle = "rgba(255,226,190,.16)"; c.fillRect(x0 + 12, y0 + 9, L - 24, 4);
  }
}
function dessPizza(c, o){
  const L = o.L, h = o.h, x0 = -L/2, y0 = -h/2;
  rr(c, x0, y0, L, h, 10); c.fillStyle = "#d4964a"; c.fill(); c.lineWidth = 2.5; c.strokeStyle = "#a5682a"; c.stroke();
  rr(c, x0 + 10, y0 + 10, L - 20, h - 20, 6); c.fillStyle = "#c9362b"; c.fill();
  for(const t of o.dec){
    const x = x0 + 10 + t.u * (L - 20), y = y0 + 10 + t.v * (h - 20);
    if(t.k === 0){ c.fillStyle = "#f7d774"; c.beginPath(); c.ellipse(x, y, t.r*1.5, t.r, t.a, 0, 7); c.fill(); }
    else if(t.k === 1){ c.fillStyle = "#9e1f1a"; c.beginPath(); c.arc(x, y, t.r, 0, 7); c.fill(); c.fillStyle = "#7a1410"; c.beginPath(); c.arc(x - t.r*.3, y - t.r*.2, t.r*.25, 0, 7); c.arc(x + t.r*.35, y + t.r*.3, t.r*.2, 0, 7); c.fill(); }
    else { c.fillStyle = "#2f8f3a"; c.beginPath(); c.ellipse(x, y, t.r*.9, t.r*.45, t.a, 0, 7); c.fill(); }
  }
}
function dessMelon(c, o){
  const R = o.L / 2;
  c.save(); c.beginPath(); c.arc(0, 0, R, 0, 7); c.fillStyle = "#3f9a3e"; c.fill(); c.clip();
  c.strokeStyle = "#1f5d24"; c.lineWidth = R * .13;
  for(let i = -3; i <= 3; i++){ c.beginPath(); const x = i * R * .3; c.moveTo(x, -R); c.bezierCurveTo(x + R*.12, -R*.4, x - R*.12, R*.3, x + R*.04, R); c.stroke(); }
  const g = c.createRadialGradient(-R*.35, -R*.4, R*.1, 0, 0, R); g.addColorStop(0, "rgba(255,255,255,.22)"); g.addColorStop(1, "rgba(0,0,0,.18)");
  c.fillStyle = g; c.fillRect(-R, -R, 2*R, 2*R); c.restore();
  /* le diamètre : la longueur que l'on mesure */
  c.lineCap = "round";
  c.strokeStyle = "#0b2a10"; c.lineWidth = 8; c.beginPath(); c.moveTo(-R + 2, 0); c.lineTo(R - 2, 0); c.stroke();
  c.strokeStyle = "#fff"; c.lineWidth = 4; c.beginPath(); c.moveTo(-R + 2, 0); c.lineTo(R - 2, 0); c.stroke();
  for(const x of [-R + 3, R - 3]){ c.strokeStyle = "#0b2a10"; c.lineWidth = 7; c.beginPath(); c.moveTo(x, -11); c.lineTo(x, 11); c.stroke();
    c.strokeStyle = "#fff"; c.lineWidth = 3.5; c.beginPath(); c.moveTo(x, -11); c.lineTo(x, 11); c.stroke(); }
  c.lineCap = "butt";
}
function dessObj(c, o){ if(o.kind === "choco") dessChoco(c, o); else if(o.kind === "pizza") dessPizza(c, o); else dessMelon(c, o); }
/* demi-hauteur de l'objet à l'abscisse locale x (pour les traits de coupe) */
const demiH = (o, x) => o.kind === "melon" ? Math.sqrt(Math.max(0, (o.L/2)**2 - x*x)) : o.h / 2;
/* face coupée (pastèque : chair rouge ; chocolat : cassure claire) */
function face(c, o, x){
  const hh = demiH(o, x);
  if(o.kind === "melon"){ c.strokeStyle = "#e9454f"; c.lineWidth = 9; c.beginPath(); c.moveTo(x, -hh + 4); c.lineTo(x, hh - 4); c.stroke();
    c.fillStyle = "#222"; for(let k = -2; k <= 2; k++) if(Math.abs(k*hh*.32) < hh - 12){ c.beginPath(); c.ellipse(x, k*hh*.32, 2, 3.5, 0, 0, 7); c.fill(); } }
  else if(o.kind === "choco"){ c.strokeStyle = "#b9784a"; c.lineWidth = 3; c.beginPath(); c.moveTo(x, -hh + 2); c.lineTo(x, hh - 2); c.stroke(); }
  else { c.strokeStyle = "#f7d774"; c.lineWidth = 3; c.beginPath(); c.moveTo(x, -hh + 8); c.lineTo(x, hh - 8); c.stroke(); }
}
/* fraction écrite en colonne, centrée en (x, y) = la barre de fraction */
function fracC(c, n, d, x, y, s, col){
  c.font = `700 ${s}px Arial, Helvetica, sans-serif`; c.textAlign = "center"; c.textBaseline = "alphabetic";
  const w = Math.max(c.measureText(String(n)).width, c.measureText(String(d)).width) + s * .35;
  c.fillStyle = col; c.fillText(String(n), x, y - s * .16); c.fillText(String(d), x, y + s * .88);
  c.fillRect(x - w/2, y - s * .05, w, Math.max(2, s * .09));
  return w;
}
/* étiquette de la consigne au-dessus de l'objet */
function tagW(c, o, s){ c.font = `700 ${s}px Arial, Helvetica, sans-serif`;
  const fw = Math.max(c.measureText(String(o.n)).width, c.measureText(String(o.d)).width) + s*.35;
  c.font = `700 ${s*.62}px Arial, Helvetica, sans-serif`;
  return o.mode === "reste" ? fw + c.measureText("laisse").width + c.measureText("à droite →").width + s*1.3 : fw + s*.9; }
function tag(c, o, x, y, s){
  const w = tagW(c, o, s), h = s * 2.15;
  rr(c, x - w/2, y - h/2, w, h, 12); c.fillStyle = "rgba(255,255,255,.95)"; c.fill(); c.lineWidth = 2.5; c.strokeStyle = "#ffcf3f"; c.stroke();
  if(o.mode === "reste"){
    c.font = `700 ${s*.62}px Arial, Helvetica, sans-serif`; c.fillStyle = "#15213b"; c.textBaseline = "middle";
    const w1 = c.measureText("laisse").width, w2 = c.measureText("à droite →").width;
    let xx = x - w/2 + s*.4; c.textAlign = "left"; c.fillText("laisse", xx, y + 1);
    xx += w1 + s*.25; c.font = `700 ${s}px Arial, Helvetica, sans-serif`;
    const fw = Math.max(c.measureText(String(o.n)).width, c.measureText(String(o.d)).width) + s*.35;
    fracC(c, o.n, o.d, xx + fw/2, y + s*.12, s, "#c2410c");
    c.font = `700 ${s*.62}px Arial, Helvetica, sans-serif`; c.textAlign = "left"; c.textBaseline = "middle"; c.fillStyle = "#15213b";
    c.fillText("à droite →", xx + fw + s*.25, y + 1);
  } else fracC(c, o.n, o.d, x, y + s*.12, s, "#1d4ed8");
  c.textBaseline = "alphabetic";
}

/* ---------- le jeu ---------- */
function init(root){
  if(!document.getElementById("mj-ninja-css")){ const st = document.createElement("style"); st.id = "mj-ninja-css"; st.textContent = CSS; document.head.appendChild(st); }
  const rec = lire(); rec.lv = rec.lv || {};
  let lv = Math.min(LV.length-1, Math.max(0, +rec.dernier || 0));
  root.innerHTML = `<div class="mj-ninja">
    <div class="mj-ninja-top" role="group" aria-label="Niveaux"></div>
    <div class="mj-ninja-help" id="mj-ninja-aide"${Object.keys(rec.lv).length ? " hidden" : ""}><ul>
      <li>Un objet est lancé en l'air avec une consigne, par exemple « Coupe aux ${FR(3,5)} » : la part de <b>gauche</b> doit mesurer ${FR(3,5)} de l'objet.</li>
      <li>Pour trancher : <b>clique et glisse</b> la souris à travers l'objet, comme un sabre. C'est l'endroit où ton geste traverse l'objet qui compte.</li>
      <li>Pastèque : on mesure le <b>diamètre</b> (le trait blanc), c'est une longueur. Plus ta coupe est précise, plus tu marques : 100, 70, 40, 15 ou 0 point. Plusieurs coupes très précises d'affilée = <b>combo</b> !</li>
      <li>Au clavier : flèches <b>←</b> <b>→</b> pour placer le sabre, <b>Espace</b> pour trancher, <b>Entrée</b> pour continuer.</li>
    </ul></div>
    <div class="mj-ninja-card">
      <div class="mj-ninja-hud">
        <div class="mj-ninja-cons"><span class="lvt"></span><span class="big" aria-live="polite"></span><span class="sub"></span></div>
        <div class="mj-ninja-stat"><span>Lancer</span><b class="k-n"></b></div>
        <div class="mj-ninja-stat combo"><span>Combo</span><b class="k-cb"></b></div>
        <div class="mj-ninja-stat"><span>Écart moyen</span><b class="k-ec"></b></div>
        <div class="mj-ninja-stat"><span>Score</span><b class="k-sc"></b></div>
      </div>
      <div class="mj-ninja-board" tabindex="0" aria-label="Zone de jeu : clique et glisse à travers l'objet pour le couper. Au clavier : flèches gauche et droite pour placer le sabre, Espace pour trancher.">
        <canvas aria-hidden="true"></canvas>
        <div class="mj-ninja-ov"><h3></h3><p></p><button class="btn primary mj-ninja-go">C'est parti !</button></div>
      </div>
      <div class="mj-ninja-fb"><div class="mj-ninja-msg" aria-live="polite"></div><button class="btn primary mj-ninja-next" hidden></button></div>
    </div>
  </div>`;
  const $ = s => root.querySelector(s);
  const top = $(".mj-ninja-top"), aide = $(".mj-ninja-help"), board = $(".mj-ninja-board"), cv = board.querySelector("canvas"),
        ov = $(".mj-ninja-ov"), msg = $(".mj-ninja-msg"), next = $(".mj-ninja-next");
  const c = cv.getContext("2d");
  const reduit = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----- taille du canvas (net sur les écrans haute densité) ----- */
  let fond = null;
  /* la zone de jeu rétrécit si la fenêtre est peu haute, pour que toute la carte tienne sans défiler
     (les mesures tiennent compte du zoom du mode DYS ; on compte une zone de message fixe pour éviter les sauts) */
  const card = root.querySelector(".mj-ninja-card"), fb = root.querySelector(".mj-ninja-fb");
  function ajuste(){
    const r = cv.getBoundingClientRect(), z = cv.offsetWidth ? r.width / cv.offsetWidth : 1;
    const autour = card.getBoundingClientRect().height - r.height - fb.getBoundingClientRect().height + 92 * z;
    const mw = Math.max(620, (innerHeight - autour - 14) * W / H / z);
    if(Math.abs((+cv.dataset.mw || 0) - mw) > 3){ cv.style.maxWidth = Math.round(mw) + "px"; cv.dataset.mw = mw; }
  }
  addEventListener("resize", ajuste);
  function taille(){
    if(!cv.dataset.mw) ajuste();
    const r = cv.getBoundingClientRect(), dpr = Math.min(2.5, window.devicePixelRatio || 1);
    const w = Math.max(300, Math.round((r.width || W) * dpr)), h = Math.round(w * H / W);
    if(cv.width !== w || cv.height !== h){ cv.width = w; cv.height = h; fond = null; }
  }
  function dessFond(){
    if(fond) return fond;
    fond = document.createElement("canvas"); fond.width = cv.width; fond.height = cv.height;
    const f = fond.getContext("2d"); f.setTransform(cv.width / W, 0, 0, cv.height / H, 0, 0);
    const g = f.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#22325c"); g.addColorStop(1, "#111a33"); f.fillStyle = g; f.fillRect(0, 0, W, H);
    /* bambous en ombre chinoise */
    f.fillStyle = "rgba(255,255,255,.035)";
    for(const [x, w, k] of [[40,16,1],[92,10,0],[990,18,1],[1046,12,0],[1080,9,1]]){
      f.fillRect(x, 0, w, H); for(let y = 30 + k*25; y < H; y += 70) f.fillRect(x - 3, y, w + 6, 4);
    }
    f.fillStyle = "rgba(255,255,255,.05)"; f.beginPath(); f.arc(930, 70, 38, 0, 7); f.fill();
    return fond;
  }

  /* ----- état ----- */
  let G = null;                     // partie : {lv, k, score, combo, ecarts:[], res:[], objs, etat, clock, nextAt}
  let fx = [], taches = [], textes = [], traine = [], shake = 0;
  let kbX = W / 2, kbOn = false, lastReal = performance.now();

  function barre(){
    top.innerHTML = LV.map((l,i)=>{ const e = (rec.lv[i]||{}).e || 0;
      return `<button class="mj-ninja-lv${i===lv?" on":""}" data-i="${i}" title="Niveau ${i+1} : ${l.titre}" aria-label="Niveau ${i+1} : ${l.titre}, ${e} étoile${e>1?"s":""}">${i+1}<small>${"★".repeat(e)}<i>${"★".repeat(3-e)}</i></small></button>`; }).join("")
      + `<span class="mj-ninja-rec"></span><button class="mj-ninja-aideb" aria-controls="mj-ninja-aide" aria-expanded="${!aide.hidden}">${aide.hidden ? "Comment jouer ?" : "Fermer l'aide"}</button>`;
    top.querySelector(".mj-ninja-aideb").onclick = () => { aide.hidden = !aide.hidden; barre(); top.querySelector(".mj-ninja-aideb").focus(); };
    top.querySelectorAll(".mj-ninja-lv").forEach(b => b.onclick = () => { lv = +b.dataset.i; partie(); });
    const r = (rec.lv[lv]||{}).best;
    top.querySelector(".mj-ninja-rec").textContent = r !== undefined ? `Record du niveau : ${r} points` : "Pas encore de record";
  }
  function hud(){
    const L = LV[lv];
    $(".k-n").textContent = `${Math.max(1, Math.min(G.k, L.nb))} / ${L.nb}`;
    $(".k-sc").textContent = G.score;
    $(".k-cb").textContent = G.combo >= 2 ? "×" + G.combo : "–";
    $(".k-ec").textContent = G.ecarts.length ? Math.round(G.ecarts.reduce((a,b)=>a+b,0) / G.ecarts.length) + " %" : "–";
  }
  function consigne(objs){
    const L = LV[lv];
    $(".lvt").textContent = `Niveau ${lv+1} · ${L.titre}`;
    if(!objs){ $(".mj-ninja-cons .big").innerHTML = "Prêt ?"; $(".mj-ninja-cons .sub").textContent = L.desc; return; }
    if(objs.length > 1){ $(".mj-ninja-cons .big").innerHTML = "Deux objets !"; $(".mj-ninja-cons .sub").innerHTML = "Coupe chacun à la fraction écrite au-dessus. Coupe : la part de <b>gauche</b> ; « laisse … à droite » : la part de <b>droite</b>."; return; }
    $(".mj-ninja-cons .big").innerHTML = consigneHTML(objs[0]);
    $(".mj-ninja-cons .sub").innerHTML = sousConsigne(objs[0]);
  }

  function partie(){
    rec.dernier = lv; ecrire(rec);
    G = {lv, k:0, score:0, combo:0, best:0, ecarts:[], res:[], objs:[], etat:"pret", clock:0, nextAt:0, prec:null, corr:null};
    fx = []; taches = []; textes = []; traine = [];
    barre(); consigne(null); hud();
    ov.hidden = false; ov.querySelector(".mj-ninja-go").hidden = false; ov.querySelector("h3").textContent = `Niveau ${lv+1} · ${LV[lv].titre}`;
    ov.querySelector("p").textContent = LV[lv].desc + ` ${LV[lv].nb} lancers${LV[lv].double ? " de deux objets" : ""}.`;
    cv.dataset.mw = ""; ajuste();
    msg.className = "mj-ninja-msg"; msg.innerHTML = "Clique sur <b>C'est parti !</b> (ou appuie sur Entrée). Les objets montent, s'arrêtent un instant en l'air, puis retombent : tranche-les au bon endroit !";
    next.hidden = true;
    voir();
  }
  $(".mj-ninja-go").onclick = () => demarre();
  function demarre(){ if(!G || G.etat !== "pret") return; ov.hidden = true; G.etat = "jeu"; board.focus({preventScroll:true}); lancer(); }

  /* un lancer : 1 ou 2 objets, chacun sur une trajectoire montée / arrêt en l'air / chute */
  function lancer(){
    const L = LV[lv]; G.k++; G.nextAt = 0; G.corr = null; G.fini = false;
    const specs = genere(lv, G.prec); G.prec = specs;
    G.objs = specs.map((s, i) => {
      const o = Object.assign({}, s), dbl = specs.length > 1;
      if(o.kind === "melon"){ const R = dbl ? 112 : 160; o.L = 2*R; o.hh = R; }
      else { o.L = dbl ? 370 : 520; o.h = o.kind === "pizza" ? (dbl ? 84 : 100) : (dbl ? 70 : 84); o.hh = o.h/2; }
      if(o.kind === "pizza"){ o.dec = []; const nb = Math.round(o.L / 26);
        for(let j = 0; j < nb; j++) o.dec.push({u: rf(.03,.97), v: rf(.15,.85), k: j % 5 === 4 ? 2 : j % 2, r: rf(7, 11), a: rf(0, 3)}); }
      const m = 20 + o.L/2;
      if(dbl){ o.xc = i ? rf(800, 840) : rf(260, 300); o.drift = rf(-28, 28); }
      else { o.xc = rf(440, 660); o.drift = pick([-1,1]) * rf(40, 100); }
      o.xc = Math.max(m + Math.abs(o.drift), Math.min(W - m - Math.abs(o.drift), o.xc));
      o.apex = o.kind === "melon" ? (dbl ? 235 : 215) : rf(205, 235);
      o.under = o.hh + 120; o.T = L.T; o.t0 = G.clock + .3 + i * .55; o.etat = "vol"; o.M = null;
      return o;
    });
    consigne(G.objs); hud();
    msg.className = "mj-ninja-msg";
    if(G.k === 1 || msg.dataset.keep !== "1") msg.innerHTML = `Lancer ${G.k} : tranche ${G.objs.length > 1 ? "les deux objets" : "l'objet"} au bon endroit.`;
    msg.dataset.keep = "";
    next.hidden = true;
  }
  /* position de l'objet à l'instant t (horloge du jeu) ; tau de -1 (en bas) à 1 (retombé) */
  function pos(o, t){
    const tau = (t - o.t0) / o.T * 2 - 1, a = Math.abs(tau);
    return {x: o.xc + o.drift * tau, y: o.apex + (H + o.under - o.apex) * a*a*a, tau};
  }
  const horloge = () => G && G.etat === "jeu" ? G.clock + Math.min(.05, (performance.now() - lastReal) / 1000) : (G ? G.clock : 0);

  /* ----- tranchage : on cherche où le geste traverse l'axe de l'objet (dans le repère de l'objet) ----- */
  function coupeSeg(A, B){
    if(!G || G.etat !== "jeu") return;
    for(const o of G.objs){
      if(o.etat !== "vol") continue;
      const pa = pos(o, A.t), pb = pos(o, B.t);
      if(pa.tau < -1 || pb.tau > 1) continue;
      const ua = A.x - pa.x, va = A.y - pa.y, ub = B.x - pb.x, vb = B.y - pb.y;
      if(va === vb || (va > 0 && vb > 0) || (va < 0 && vb < 0)) continue;
      const s = va / (va - vb), u = ua + (ub - ua) * s;
      if(Math.abs(u) > o.L / 2) continue;
      const tc = A.t + (B.t - A.t) * s;
      tranche(o, u, pos(o, tc));
    }
  }
  function tranche(o, u, p){
    o.etat = "coupe"; o.u = u; o.px = p.x; o.py = p.y; o.tc = G.clock;
    const f = (u + o.L/2) / o.L, M = mesure(o, f); o.M = M;
    G.res.push(M.pts); G.ecarts.push(M.raw);
    if(M.precis){ G.combo++; G.best = Math.max(G.best, G.combo); } else G.combo = 0;
    const bonus = M.precis ? COMBO(G.combo) : 0; o.bonus = bonus;
    G.score += M.pts + bonus;
    /* éclaboussures */
    const n = reduit() ? 8 : 34, cols = o.kind === "melon" ? ["#ff4d5a","#ff6b6b","#e8323f","#222"] : o.kind === "pizza" ? ["#e0412f","#f7d774","#c9362b","#2f8f3a"] : ["#6e381b","#9a5a32","#4a2412","#b9784a"];
    for(let i = 0; i < n; i++){ const a = rf(0, Math.PI*2), v = rf(120, 520);
      fx.push({x: p.x + u, y: p.y + rf(-o.hh*.6, o.hh*.6), vx: Math.cos(a)*v, vy: Math.sin(a)*v - 160, life: rf(.5, 1.1), max: 1.1, r: rf(2.5, 6.5), col: pick(cols), sq: o.kind === "choco"}); }
    if(!reduit()){ for(let i = 0; i < 4; i++) taches.push({x: p.x + u + rf(-90, 90), y: p.y + rf(-70, 70), r: rf(10, 26), col: o.kind === "melon" ? "#ff4d5a" : o.kind === "pizza" ? "#e0412f" : "#7a4122", life: 2.6, max: 2.6}); shake = M.pts === 100 ? 7 : 4; }
    const de = NOM[o.kind].de;
    textes.push({x: p.x + u, y: p.y - o.hh - 40, txt: VERDICT[M.pts], col: M.pts >= 70 ? "#7dffb0" : M.pts >= 40 ? "#d9f99d" : M.pts ? "#fde68a" : "#ff8a8a", s: 30, life: 1.3, max: 1.3});
    textes.push({x: p.x + u, y: p.y - o.hh + 4, txt: `écart ${M.E} %`, col: "#ffffff", s: 19, life: 1.3, max: 1.3});
    if(bonus) textes.push({x: W/2, y: 70, txt: `COMBO ×${G.combo} · +${bonus}`, col: "#ffcf3f", s: 40, life: 1.4, max: 1.4, big: true});
    msg.className = "mj-ninja-msg " + (M.pts >= 70 ? "ok" : M.ok ? "" : "ko");
    msg.innerHTML = `<span class="vd">${VERDICT[M.pts]}</span> <span class="pts">+${M.pts} point${M.pts > 1 ? "s" : ""}</span> · ${FR(o.n,o.d)} · écart : <b>${M.E} %</b> ${de}${bonus ? `<span class="cb">Combo ×${G.combo} : +${bonus}</span>` : ""}`;
    msg.dataset.keep = "1";
    hud();
  }
  function rate(o){
    o.etat = "rate"; o.M = null; G.res.push(0); G.combo = 0;
    textes.push({x: Math.max(80, Math.min(W - 80, o.xc + o.drift)), y: H - 40, txt: "Trop tard !", col: "#ff8a8a", s: 28, life: 1.2, max: 1.2});
    msg.className = "mj-ninja-msg ko"; msg.innerHTML = `<span class="vd">Trop tard !</span> ${NOM[o.kind].tombe} sans être coupée.`;
    hud();
  }
  function finLancer(){
    G.fini = true;
    const bad = G.objs.filter(o => !o.M || !o.M.ok).sort((a,b) => (a.M ? a.M.raw : 999) < (b.M ? b.M.raw : 999) ? 1 : -1);
    const dernier = G.k >= LV[lv].nb;
    if(!bad.length){ G.nextAt = G.clock + .55; return; }
    /* on montre la correction et on explique */
    const o = bad[0]; G.corr = o; G.etat = "pause"; traine = [];
    const M = o.M;
    msg.className = "mj-ninja-msg ko";
    msg.innerHTML = `<span class="vd">${M ? VERDICT[M.pts] : "Trop tard !"}</span>${M ? ` <span class="pts">+${M.pts} point${M.pts > 1 ? "s" : ""}</span> ·` : ""} ${diag(o, M)}<br>${sens(o)}`;
    next.hidden = false; next.textContent = dernier ? "Voir mon score" : "Continuer";
    next.onclick = () => { if(G.etat !== "pause") return; G.etat = "jeu"; G.corr = null; next.hidden = true; dernier ? fin() : lancer(); board.focus({preventScroll:true}); };
    if(root.contains(document.activeElement)) next.focus({preventScroll:true});
  }
  function fin(){
    G.etat = "fin"; G.objs = []; G.corr = null;
    const r = rec.lv[lv] || {}, e = etoiles(lv, G.score), nouveau = r.best === undefined || G.score > r.best;
    if(nouveau) r.best = G.score; r.e = Math.max(r.e || 0, e); rec.lv[lv] = r; ecrire(rec);
    barre(); hud();
    $(".mj-ninja-cons .big").textContent = "Partie terminée !"; $(".mj-ninja-cons .sub").textContent = LV[lv].desc;
    const nbP = G.res.filter(x => x === 100).length, nbR = G.res.filter(x => x === 0).length;
    const ec = G.ecarts.length ? Math.round(G.ecarts.reduce((a,b)=>a+b,0) / G.ecarts.length) : null;
    msg.className = "mj-ninja-msg " + (e >= 2 ? "ok" : "");
    msg.innerHTML = `<div class="mj-ninja-end"><span class="big">Partie terminée : ${G.score} points <span class="st" aria-label="${e} étoile${e>1?"s":""}">${"★".repeat(e)}<i>${"★".repeat(3-e)}</i></span></span>
      <span>Coupes parfaites : ${nbP} · ratées : ${nbR}${ec !== null ? ` · écart moyen : ${ec} %` : ""} · meilleur combo : ${G.best >= 2 ? "×" + G.best : "aucun"}${nouveau ? " · <b>Nouveau record !</b>" : ` · record : ${r.best}`}</span>
      <span class="acts"><button class="btn primary" data-a="re">Rejouer ce niveau</button>${lv < LV.length-1 ? `<button class="btn" data-a="nx">Niveau suivant</button>` : ""}</span></div>`;
    next.hidden = true;
    ov.hidden = false; ov.querySelector("h3").textContent = `${G.score} points`;
    ov.querySelector("p").textContent = e === 3 ? "Trois étoiles : tu es un vrai maître ninja des fractions !" : e ? `${e} étoile${e>1?"s":""} ! ${LV[lv].etoiles[e]} points pour l'étoile suivante.` : `Il faut ${LV[lv].etoiles[0]} points pour la 1re étoile. Réessaie !`;
    ov.querySelector(".mj-ninja-go").hidden = true;
    msg.querySelector('[data-a="re"]').onclick = () => partie();
    const nx = msg.querySelector('[data-a="nx"]'); if(nx) nx.onclick = () => { lv++; partie(); };
    if(root.contains(document.activeElement)) msg.querySelector('[data-a="re"]').focus({preventScroll:true});
  }

  /* ----- souris ----- */
  let geste = null;
  function pt(ev){ const r = cv.getBoundingClientRect(); return {x: (ev.clientX - r.left) * W / r.width, y: (ev.clientY - r.top) * H / r.height, t: horloge(), r: performance.now()}; }
  cv.addEventListener("pointerdown", ev => { if(ev.button) return; if(G && G.etat === "pret"){ demarre(); }
    try{ cv.setPointerCapture(ev.pointerId); }catch(e){} geste = pt(ev); kbOn = false; traine = [geste]; ev.preventDefault(); });
  cv.addEventListener("pointermove", ev => { if(!geste) return; const evs = ev.getCoalescedEvents ? ev.getCoalescedEvents() : [ev];
    for(const e of (evs.length ? evs : [ev])){ const p = pt(e); coupeSeg(geste, p); geste = p; traine.push(p); } });
  const lache = () => { geste = null; };
  cv.addEventListener("pointerup", lache); cv.addEventListener("pointercancel", lache);
  /* ----- clavier ----- */
  board.addEventListener("keydown", ev => {
    if(!G) return;
    if(ev.key === "Enter" && G.etat === "pret"){ demarre(); ev.preventDefault(); return; }
    if(G.etat === "pause" && (ev.key === "Enter" || ev.key === " ")){ next.click(); ev.preventDefault(); return; }
    if(G.etat !== "jeu") return;
    if(ev.key === "ArrowLeft" || ev.key === "ArrowRight"){ kbOn = true; kbX = Math.max(10, Math.min(W - 10, kbX + (ev.key === "ArrowLeft" ? -1 : 1) * (ev.shiftKey ? 20 : 4))); ev.preventDefault(); }
    else if(ev.key === " "){ kbOn = true; const t = horloge(); coupeSeg({x: kbX, y: -20, t}, {x: kbX, y: H + 20, t});
      const r = performance.now(); traine = [{x: kbX, y: 0, r}, {x: kbX, y: H, r}]; ev.preventDefault(); }
  });

  /* ----- boucle d'animation ----- */
  function frame(now){
    if(!root.isConnected) return;
    const dt = Math.min(.05, (now - lastReal) / 1000); lastReal = now;
    taille();
    if(G && G.etat === "jeu" && !document.hidden){
      G.clock += dt;
      for(const o of G.objs){
        if(o.etat === "vol" && pos(o, G.clock).tau > 1) rate(o);
        if(o.etat === "coupe" && !o.pc && G.clock - o.tc >= FREEZE){
          const sp = reduit() ? .4 : 1;
          o.pc = [{a: -o.L/2, b: o.u, dx: -7, dy: 0, vx: -rf(90,160)*sp, vy: -rf(60,160)*sp, rot: 0, vr: -rf(.6,1.4)*sp},
                  {a: o.u, b: o.L/2, dx: 7, dy: 0, vx: rf(90,160)*sp, vy: -rf(60,160)*sp, rot: 0, vr: rf(.6,1.4)*sp}];
        }
        if(o.pc) for(const q of o.pc){ q.vy += 1500 * dt; q.dx += q.vx * dt; q.dy += q.vy * dt; q.rot += q.vr * dt; }
        o.fini = o.etat === "rate" || (o.etat === "coupe" && o.pc && o.pc.every(q => o.py + q.dy - o.L > H + 40 || o.py + q.dy > H + 260));
      }
      if(!G.fini && G.objs.length && G.objs.every(o => o.fini)) finLancer();
      if(G.nextAt && G.clock >= G.nextAt && G.etat === "jeu"){ G.nextAt = 0; G.k >= LV[lv].nb ? fin() : lancer(); }
    }
    for(const p of fx){ p.vy += 900 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt; }
    fx = fx.filter(p => p.life > 0 && p.y < H + 30);
    for(const s of taches) s.life -= dt; taches = taches.filter(s => s.life > 0);
    for(const s of textes){ s.life -= dt; if(!reduit()) s.y -= 28 * dt; } textes = textes.filter(s => s.life > 0);
    shake = Math.max(0, shake - 40 * dt);
    traine = traine.filter(p => now - p.r < 160);
    dessine(now);
    requestAnimationFrame(frame);
  }
  function dessine(now){
    const sx = cv.width / W, sy = cv.height / H;
    c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(dessFond(), 0, 0);
    const sh = shake > 0 ? [rf(-shake, shake), rf(-shake, shake)] : [0, 0];
    c.setTransform(sx, 0, 0, sy, sh[0]*sx, sh[1]*sy);
    for(const s of taches){ c.globalAlpha = .35 * s.life / s.max; c.fillStyle = s.col; c.beginPath(); c.arc(s.x, s.y, s.r, 0, 7); c.arc(s.x + s.r*.9, s.y + s.r*.3, s.r*.45, 0, 7); c.arc(s.x - s.r*.6, s.y + s.r*.8, s.r*.3, 0, 7); c.fill(); }
    c.globalAlpha = 1;
    if(G && G.corr) correction(G.corr);
    else if(G) for(const o of G.objs) dessObjet(o);
    for(const p of fx){ c.globalAlpha = Math.min(1, p.life / p.max * 1.6); c.fillStyle = p.col;
      if(p.sq) c.fillRect(p.x - p.r/2, p.y - p.r/2, p.r, p.r); else { c.beginPath(); c.arc(p.x, p.y, p.r/2 + 1, 0, 7); c.fill(); } }
    c.globalAlpha = 1;
    /* traînée du sabre */
    if(traine.length > 1){
      c.lineCap = "round"; c.lineJoin = "round";
      for(let i = 1; i < traine.length; i++){ const a = traine[i-1], b = traine[i], k = i / traine.length;
        c.strokeStyle = `rgba(190,235,255,${.25 + .6*k})`; c.lineWidth = 2 + 9 * k; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); }
      const a = traine[traine.length-2], b = traine[traine.length-1];
      c.strokeStyle = "#fff"; c.lineWidth = 3; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
      c.lineCap = "butt";
    }
    /* sabre du clavier */
    if(kbOn && G && G.etat === "jeu"){ c.setLineDash([8, 8]); c.strokeStyle = "rgba(255,207,63,.85)"; c.lineWidth = 2.5; c.beginPath(); c.moveTo(kbX, 0); c.lineTo(kbX, H); c.stroke(); c.setLineDash([]);
      c.fillStyle = "#ffcf3f"; c.beginPath(); c.moveTo(kbX - 9, 0); c.lineTo(kbX + 9, 0); c.lineTo(kbX, 14); c.fill(); }
    for(const s of textes){ c.globalAlpha = Math.min(1, s.life / s.max * 2.2); c.font = `800 ${s.s}px Arial, Helvetica, sans-serif`; c.textAlign = "center"; c.textBaseline = "middle";
      const x = Math.max(90, Math.min(W - 90, s.x)), y = Math.max(24, s.y);
      c.lineWidth = s.big ? 7 : 5; c.strokeStyle = "rgba(10,16,34,.85)"; c.strokeText(s.txt, x, y); c.fillStyle = s.col; c.fillText(s.txt, x, y); }
    c.globalAlpha = 1; c.textBaseline = "alphabetic";
  }
  function dessObjet(o){
    if(o.etat === "vol"){
      const p = pos(o, G.clock); if(p.tau < -1 || p.y - o.hh > H + 80) return;
      c.save(); c.translate(p.x, p.y); dessObj(c, o); c.restore();
      const s = o.L > 400 || o.kind === "melon" && o.L > 300 ? 26 : 22;
      if(o.kind === "melon"){ const w = tagW(c, o, s); tag(c, o, Math.max(w/2 + 6, p.x - o.L/2 - w/2 + 18), p.y - o.L/2 + 14, s); }
      else tag(c, o, p.x, p.y - o.hh - s * 1.35, s);
      return;
    }
    if(o.etat !== "coupe") return;
    const t = Math.min(1, (G.clock - o.tc) / .18), gap = 7 * t, xT = -o.L/2 + o.nl / o.d * o.L;
    const parts = o.pc || [{a: -o.L/2, b: o.u, dx: -gap, dy: 0, rot: 0}, {a: o.u, b: o.L/2, dx: gap, dy: 0, rot: 0}];
    for(const q of parts){
      const pc = (q.a + q.b) / 2;
      c.save(); c.translate(o.px + q.dx + pc, o.py + q.dy); c.rotate(q.rot); c.translate(-pc, 0);
      c.beginPath(); c.rect(q.a, -o.hh - 40, q.b - q.a, 2*o.hh + 80); c.clip();
      dessObj(c, o); face(c, o, q.a === -o.L/2 ? q.b : q.a);
      c.restore();
    }
    if(!o.pc){
      /* arrêt sur image : la bonne coupe en vert */
      const xx = o.px + xT + (xT < o.u ? -gap : gap), hh = o.kind === "melon" ? demiH(o, xT) : o.hh;
      c.strokeStyle = "#2ee67a"; c.lineWidth = 4; c.setLineDash([9, 6]); c.beginPath(); c.moveTo(xx, o.py - hh - 14); c.lineTo(xx, o.py + hh + 14); c.stroke(); c.setLineDash([]);
    }
  }
  /* correction : l'objet partagé en d parts égales, la bonne coupe (vert) et la coupe de l'élève (rouge) */
  function correction(o){
    const cx = W/2, cy = o.kind === "melon" ? 212 : 205, L = o.L, d = o.d, pw = L / d, x0 = cx - L/2, xT = x0 + o.nl * pw;
    c.save(); c.translate(cx, cy); dessObj(c, o); c.restore();
    const hh = o.hh;
    c.font = "700 17px Arial, Helvetica, sans-serif"; c.textAlign = "left"; c.textBaseline = "middle";
    c.fillStyle = "#2ee67a"; c.fillRect(18, 18, 26, 5); c.fillStyle = "#fff"; c.fillText("bonne coupe", 52, 21);
    if(o.M){ c.fillStyle = "#ff6b6b"; c.fillRect(18, 44, 26, 5); c.fillStyle = "#fff"; c.fillText("ta coupe", 52, 47); }
    if(o.kind === "melon"){
      /* les parts sur le diamètre */
      c.lineCap = "round";
      c.strokeStyle = "rgba(46,230,122,.95)"; c.lineWidth = 11; c.beginPath(); c.moveTo(x0 + 3, cy); c.lineTo(xT, cy); c.stroke();
      if(o.mode === "reste"){ c.strokeStyle = "rgba(251,146,60,.95)"; c.beginPath(); c.moveTo(xT, cy); c.lineTo(x0 + L - 3, cy); c.stroke(); }
      c.lineCap = "butt";
      for(let i = 1; i < d; i++){ const x = x0 + i*pw; c.strokeStyle = "#0b2a10"; c.lineWidth = 6; c.beginPath(); c.moveTo(x, cy - 13); c.lineTo(x, cy + 13); c.stroke();
        c.strokeStyle = "#fff"; c.lineWidth = 3; c.beginPath(); c.moveTo(x, cy - 13); c.lineTo(x, cy + 13); c.stroke(); }
      if(pw >= 22){ c.font = "800 16px Arial, Helvetica, sans-serif"; c.textAlign = "center";
        for(let i = 0; i < o.nl; i++){ const x = x0 + (i + .5)*pw; c.lineWidth = 4; c.strokeStyle = "#0b2a10"; c.strokeText(String(i+1), x, cy + 26); c.fillStyle = "#fff"; c.fillText(String(i+1), x, cy + 26); } }
    } else {
      for(let i = 0; i < d; i++){ c.fillStyle = i < o.nl ? "rgba(46,230,122,.42)" : o.mode === "reste" ? "rgba(251,146,60,.42)" : "rgba(0,0,0,0)"; c.fillRect(x0 + i*pw, cy - hh, pw, 2*hh); }
      c.strokeStyle = "#fff"; c.lineWidth = 2.5; c.setLineDash([7, 5]);
      for(let i = 1; i < d; i++){ const x = x0 + i*pw; c.beginPath(); c.moveTo(x, cy - hh - 8); c.lineTo(x, cy + hh + 8); c.stroke(); }
      c.setLineDash([]);
      if(pw >= 22){ c.font = "800 18px Arial, Helvetica, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle";
        for(let i = 0; i < o.nl; i++){ const x = x0 + (i + .5)*pw; c.lineWidth = 4; c.strokeStyle = "rgba(10,16,34,.9)"; c.strokeText(String(i+1), x, cy); c.fillStyle = "#fff"; c.fillText(String(i+1), x, cy); } }
    }
    /* accolades : part de gauche (et part de droite pour « laisse … à droite ») */
    const yb = cy + hh + 30;
    const acc = (a, b, col, n, dd) => { c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.moveTo(a + 2, yb - 8); c.lineTo(a + 2, yb); c.lineTo(b - 2, yb); c.lineTo(b - 2, yb - 8); c.stroke();
      if(b - a > 40) fracC(c, n, dd, (a + b)/2, yb + 26, 20, col); };
    const pill = (a, b, col, n, dd) => { const x = (a + b)/2, y = cy + 78; rr(c, x - 22, y - 26, 44, 52, 10); c.fillStyle = "rgba(10,16,34,.82)"; c.fill(); fracC(c, n, dd, x, y + 2, 20, col); };
    if(o.kind !== "melon"){ acc(x0, xT, "#2ee67a", o.nl, d); if(o.mode === "reste") acc(xT, x0 + L, "#fb923c", o.n, d); }
    /* bonne coupe */
    const hT = o.kind === "melon" ? demiH(o, xT - cx) : hh;
    c.strokeStyle = "#2ee67a"; c.lineWidth = 5; c.beginPath(); c.moveTo(xT, cy - hT - 18); c.lineTo(xT, cy + hT + 10); c.stroke();
    /* coupe de l'élève */
    if(o.M){ const xF = x0 + o.M.f * L, hF = o.kind === "melon" ? demiH(o, xF - cx) : hh;
      c.strokeStyle = "#ff6b6b"; c.lineWidth = 4; c.setLineDash([10, 6]); c.beginPath(); c.moveTo(xF, cy - hF - 18); c.lineTo(xF, cy + hF + 10); c.stroke(); c.setLineDash([]); }
    if(o.kind === "melon"){ if(xT - x0 > 60) pill(x0, xT, "#2ee67a", o.nl, d); if(o.mode === "reste" && x0 + L - xT > 60) pill(xT, x0 + L, "#fb923c", o.n, d); }
    /* la fraction visée, au-dessus de la bonne coupe */
    const ty = o.kind === "melon" ? Math.max(30, cy - demiH(o, xT - cx) - 34) : cy - hh - 42;
    c.save(); tag(c, o, Math.max(110, Math.min(W - 110, xT)), ty, 22); c.restore();
  }

  /* sur un petit écran, on fait défiler juste ce qu'il faut pour voir toute la zone de jeu */
  function voir(){ const r = card.getBoundingClientRect();
    if(r.top >= 0 && r.bottom <= innerHeight) return;
    const dy = r.height + 16 <= innerHeight ? r.top - 8 : r.bottom - innerHeight + 8;
    window.scrollBy({top: dy, behavior: "auto"}); }
  /* lecture seule, pour les tests automatiques : état, et position écran d'un point de l'objet i (fraction f de sa longueur) */
  root._mjEtat = () => G && {etat: G.etat, k: G.k, score: G.score, combo: G.combo, res: G.res.slice(), clock: G.clock,
    objs: G.objs.map(o => ({kind: o.kind, mode: o.mode, n: o.n, d: o.d, nl: o.nl, cols: o.cols, etat: o.etat, tau: pos(o, G.clock).tau, M: o.M}))};
  root._mjPoint = (i, f, dtau) => { const o = G.objs[i]; if(!o) return null; const t = G.clock + (dtau || 0) * o.T / 2, p = pos(o, t), r = cv.getBoundingClientRect();
    return {x: r.left + (p.x - o.L/2 + f * o.L) * r.width / W, y: r.top + p.y * r.height / H, h: o.hh * r.height / H, k: r.width / W}; };
  partie();
  requestAnimationFrame(t => { lastReal = t; frame(t); });
}
return {init, _t:{LV, spec, genere, mesure, diag, sens, consigneHTML, sousConsigne, gcd, etoiles, COMBO, VERDICT, EGALES}};
})();
