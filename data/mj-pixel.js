/* Mini-jeu « Pixel art en symétrie centrale » (5e) : compléter un dessin en pixels pour que le point O
   soit son centre de symétrie (demi-tour autour de O). Aucune bibliothèque, aucun appel réseau. */
window.MJ_PIXEL = (function(){
"use strict";
const CLE = "staal-mj-pixel5";
/* couleurs des pixels (pas de bleu : le bleu est réservé au point O) */
const COUL = {r:"#e8413c", o:"#f28c1e", j:"#f5c400", v:"#2e9d5b", p:"#7a3fd0", m:"#ec6fa8", b:"#8a5a3c", n:"#2b2f36", t:"#17a8a0"};
const NOMC = {r:"rouge", o:"orange", j:"jaune", v:"vert", p:"violet", m:"rose", b:"marron", n:"noir", t:"turquoise"};
const PALETTE = Object.keys(COUL);

/* dessins originaux, tous symétriques par rapport à leur centre (vérifié par les tests) */
const MOTIFS = {
  helice:{nom:"L'hélice", m:[".......",".vv....",".vvv...","...v...","...vvv.","....vv.","......."]},
  S:{nom:"La lettre S", fige:true, m:["..rrr..",".r...r.",".r.....","..rrr..",".....r.",".r...r.","..rrr.."]},
  N:{nom:"La lettre N", fige:true, m:[".......",".r...r.",".rr..r.",".r.r.r.",".r..rr.",".r...r.","......."]},
  zigzag:{nom:"Le zigzag", m:["...jjjj","..jj...",".jj....","jjjj...","...j...","...jjjj","....jj.","...jj..","jjjj..."]},
  carte:{nom:"La carte à jouer", m:["nnnnnnn","nr.r..n","nrrr..n","n.r...n","n.....n","n...r.n","n..rrrn","n..r.rn","nnnnnnn"]},
  moulin:{nom:"Le moulin à vent", m:[".rrr....","..rr...j","...r..jj","...rjjjj","jjjjr...","jj..r...","j...rr..","....rrr."]},
  bonbon:{nom:"Le bonbon", m:["m........","mm.......",".mm.pp...","..mpppp..","...ppp...","..ppppm..","...pp.mm.",".......mm","........m"]},
  spirale:{nom:"La double spirale", m:["vvvvvvv..","v........","v.vvvvv..","v.v......","v.v.v.v.v","......v.v","..vvvvv.v","........v","..vvvvvvv"]},
  SOS:{nom:"SOS", fige:true, m:["...........","rrr.jjj.rrr","r...j.j.r..","rrr.j.j.rrr","..r.j.j...r","rrr.jjj.rrr","..........."]},
  para:{nom:"Le parallélogramme", m:[".....nnnnnnn","....nvvvvvn.","...nvvvvvn..","..nvvvvvn...",".nvvvvvn....","nnnnnnn....."]},
  poissons:{nom:"Les deux poissons", m:[".....ooo..c.",".o..ooooo...",".oooooono.c.",".o..ooooo...",".....ooo....","....ooo.....","...ooooo..o.",".c.onoooooo.","...ooooo..o.",".c..ooo....."]},
  fleches:{nom:"Les deux flèches", m:["..........","......o...","......oo..","ooooooooo.","......oo..","......o...","...o......","..oo......",".ooooooooo","..oo......","...o......",".........."]}
};

/* niveaux : 3 dessins tirés au hasard par partie */
const LV = [
  {titre:"Premiers pas", info:"Le point O est au milieu d'une case. Une seule couleur.", pool:["forme7","forme7","S","N","helice","zigzag"], split:["gauche"], couleurs:1,
   aide:"Choisis une case colorée. Va jusqu'à O, puis continue tout droit d'autant de carreaux : tu tombes sur sa jumelle."},
  {titre:"O sur un nœud", info:"Ici, O est sur un nœud du quadrillage (un coin de cases).", pool:["forme8","forme8","forme6","moulin","para"], split:["gauche"], couleurs:1,
   aide:"O est au coin de 4 cases. La case juste en haut à gauche de O a pour jumelle la case juste en bas à droite de O."},
  {titre:"Plusieurs couleurs", info:"Chaque case garde sa couleur pendant le demi-tour.", pool:["carte","bonbon","spirale","moulin","SOS"], split:["gauche"], couleurs:3,
   aide:"Une case et sa jumelle ont toujours la même couleur. Avance ligne par ligne."},
  {titre:"La moitié du haut", info:"Cette fois, on te donne le haut du dessin : complète le bas.", pool:["carte","bonbon","spirale","moulin","SOS","para","zigzag","S"], split:["haut"], couleurs:3, tourne:true,
   aide:"Ce qui est en haut à gauche va en bas à droite ; ce qui est en haut à droite va en bas à gauche."},
  {titre:"Le centre décalé", info:"O n'est plus au milieu du quadrillage : repère-toi bien par rapport à O.", pool:["forme7","forme8","S","N","helice","moulin","carte","zigzag"], split:["gauche","haut"], couleurs:2, tourne:true, decale:true,
   aide:"Ne regarde pas le milieu du quadrillage : seul le point O compte. Compte les carreaux à partir de O."},
  {titre:"Grands dessins", info:"Des dessins plus grands, avec plusieurs couleurs.", pool:["poissons","fleches","SOS","para","mosaique"], split:["gauche","haut"], couleurs:3, tourne:true,
   aide:"Travaille par petits morceaux : une ligne à la fois, en comptant les carreaux depuis O."},
  {titre:"Morceaux éparpillés", info:"Des morceaux manquent des deux côtés de O : retrouve-les tous.", pool:["carte","bonbon","spirale","moulin","SOS","para","poissons","fleches"], split:["eparpille"], couleurs:3, tourne:true,
   aide:"Pour chaque case colorée, cherche sa jumelle de l'autre côté de O. Si elle est vide, colorie-la."},
  {titre:"Défi : la mosaïque", info:"Une grande mosaïque, et O peut être au milieu d'un côté de case.", pool:["mosaique","mosaique","mosaiqueM"], split:["gauche","haut"], couleurs:4, defi:true,
   aide:"Avance ligne par ligne. Pour chaque case : même distance à O, de l'autre côté, même couleur."}
];
const NB_DESSINS = 3;

/* ---------- outils mathématiques (purs, testés à part) ---------- */
const rnd = n => Math.floor(Math.random()*n);
const pick = a => a[rnd(a.length)];
const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=rnd(i+1); [a[i],a[j]]=[a[j],a[i]]; } return a; };
/* image d'une case (ligne r, colonne c) par la symétrie de centre O(X ; Y) — X et Y en carreaux, multiples de 0,5 */
const img = (P,r,c) => [2*P.Y-1-r, 2*P.X-1-c];
const dans = (P,r,c) => r>=0 && c>=0 && r<P.H && c<P.W;
/* côté « donné » : à gauche de O (ou au-dessus de O sur sa colonne), ou au-dessus de O (ou à gauche sur sa ligne) */
function cote(split, P, r, c){ const dx=c+.5-P.X, dy=r+.5-P.Y;
  if(split==="haut") return dy<0 || (dy===0 && dx<=0);
  return dx<0 || (dx===0 && dy<=0); }
const rot90 = m => m[0].split("").map((_,c)=>m.map(row=>row[c]).reverse().join(""));
const flipH = m => m.map(row=>row.split("").reverse().join(""));
const flipV = m => m.slice().reverse();
const estSym = (m) => { const h=m.length, w=m[0].length; for(let r=0;r<h;r++) for(let c=0;c<w;c++) if(m[r][c]!==m[h-1-r][w-1-c]) return false; return true; };
function recolore(m, n){ const lettres=[...new Set(m.join("").replace(/\./g,""))]; const pal=shuffle(PALETTE).slice(0, lettres.length);
  const map={}; lettres.forEach((l,i)=>map[l]=pal[i]); return m.map(row=>row.replace(/[^.]/g, ch=>map[ch])); }
/* forme aléatoire d'un seul tenant, posée du côté donné puis complétée par le demi-tour */
function forme(w, h, nb, ncoul){
  for(let essai=0; essai<200; essai++){
    const P={W:w,H:h,X:w/2,Y:h/2}, g=Array.from({length:h},()=>Array(w).fill("."));
    const ok=(r,c)=>dans(P,r,c) && cote("gauche",P,r,c);
    const cols=shuffle(PALETTE).slice(0,ncoul);
    let r0=Math.ceil(P.Y)-1, c0=Math.ceil(P.X)-1; if(!ok(r0,c0)) continue;     /* départ : la case de O ou celle en haut à gauche de O */
    const pris=[[r0,c0]]; g[r0][c0]=cols[0];
    while(pris.length<nb){ const [r,c]=pick(pris), d=pick([[0,1],[0,-1],[1,0],[-1,0]]), rr=r+d[0], cc=c+d[1];
      if(ok(rr,cc) && g[rr][cc]==="."){ g[rr][cc]=pick(cols); pris.push([rr,cc]); } }
    pris.forEach(([r,c])=>{ const [a,b]=img(P,r,c); g[a][b]=g[r][c]; });
    const m=g.map(x=>x.join("")); if(estSym(m)) return m;
  }
  return null;
}
/* mosaïque : des taches au hasard (lissées), puis des couleurs par zones ; tout est gardé symétrique par rapport au centre */
function mosaique(w, h, ncoul){
  const cols=shuffle(PALETTE).slice(0,ncoul);
  for(let essai=0; essai<100; essai++){
    let g=Array.from({length:h},()=>Array(w).fill(0));
    const sym=t=>{ for(let r=0;r<h;r++) for(let c=0;c<w;c++){ const a=h-1-r, b=w-1-c; if(r*w+c<a*w+b) t[a][b]=t[r][c]; } };
    for(let r=0;r<h;r++) for(let c=0;c<w;c++) g[r][c]=Math.random()<.6?1:0; sym(g);
    for(let it=0;it<2;it++){ const n=g.map(x=>x.slice());
      for(let r=0;r<h;r++) for(let c=0;c<w;c++){ let s=0; for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++) s+=((g[r+dr]||[])[c+dc])||0; n[r][c]=s>=5?1:0; }
      g=n; sym(g); }
    const germes=[]; cols.forEach(col=>{ for(let k=0;k<2;k++){ const r=rnd(h), c=rnd(w); germes.push([r,c,col],[h-1-r,w-1-c,col]); } });
    const out=g.map((row,r)=>row.map((v,c)=>{ if(!v) return "."; let best=".", bd=1e9; germes.forEach(([a,b,col])=>{ const d=(a-r)**2+(b-c)**2; if(d<bd){ bd=d; best=col; } }); return best; }));
    sym(out);
    const occ=out.flat().filter(x=>x!==".").length/(w*h), nc=new Set(out.flat().filter(x=>x!==".")).size;
    if(occ>=.3 && occ<=.62 && nc===ncoul) return out.map(x=>x.join(""));
  }
  return null;
}
/* le dessin complété « comme dans un miroir » (symétrie axiale par rapport à la droite qui sépare les deux moitiés) : il doit être différent */
function miroir(P){ const out=P.full.map(row=>row.slice());
  for(let r=0;r<P.H;r++) for(let c=0;c<P.W;c++) if(!P.lock[r][c]){ const [a,b]= P.split==="haut" ? [2*P.Y-1-r, c] : [r, 2*P.X-1-c]; out[r][c]= dans(P,a,b) ? P.full[a][b] : "."; }
  return out; }
function differe(P, autre){ let n=0; for(let r=0;r<P.H;r++) for(let c=0;c<P.W;c++) if(!P.lock[r][c] && autre[r][c]!==P.full[r][c]) n++; return n; }

/* fabrique un dessin pour le niveau L ; renvoie {nom, W, H, X, Y, full, lock, split} */
function fabrique(L, cle){
  for(let essai=0; essai<300; essai++){
    let nom, m, fige=false;
    if(cle==="forme7"){ nom="Une forme mystère"; m=forme(7,7,4+rnd(3),Math.min(L.couleurs,1+rnd(2))); }
    else if(cle==="forme8"){ nom="Une forme mystère"; m=forme(8,8,5+rnd(3),Math.min(L.couleurs,1+rnd(2))); }
    else if(cle==="forme6"){ nom="Une forme mystère"; m=forme(6,6,4+rnd(2),1); }
    else if(cle==="mosaique"){ nom="La mosaïque"; const n=pick([10,11,12]); m=mosaique(n, pick([n,n-2]), L.couleurs); }
    else if(cle==="mosaiqueM"){ nom="La mosaïque"; const n=pick([11,12]); m=mosaique(n, n%2 ? pick([10,12]) : pick([9,11]), L.couleurs); }   /* O peut être au milieu d'un côté de case */
    else { const M=MOTIFS[cle]; nom=M.nom; m=M.m; fige=!!M.fige; if(L.couleurs===1){ const c=pick(PALETTE); m=m.map(row=>row.replace(/[^.]/g,c)); } else m=recolore(m); }
    if(!m) continue;
    if(!fige){ if(L.tourne){ const k=rnd(4); for(let i=0;i<k;i++) m=rot90(m); }
      if(Math.random()<.5) m=flipH(m); if(Math.random()<.5) m=flipV(m); }
    if(m.length>12 || m[0].length>12) continue;
    const split=pick(L.split);
    let W=m[0].length, H=m.length, ox=0, oy=0;
    if(L.decale){ W=Math.max(W+3, 11); H=Math.max(H+2, 10); if(W>12) W=12; if(H>12) H=12;
      ox=rnd(W-m[0].length+1); oy=rnd(H-m.length+1);
      if(Math.abs(2*ox-(W-m[0].length))<3 && Math.abs(2*oy-(H-m.length))<3) continue; }   /* O assez loin du milieu */
    const P={nom, W, H, X:ox+m[0].length/2, Y:oy+m.length/2, split};
    P.full=Array.from({length:H},(_,r)=>Array.from({length:W},(_,c)=>{ const rr=r-oy, cc=c-ox; return rr>=0&&cc>=0&&rr<m.length&&cc<m[0].length ? m[rr][cc] : "."; }));
    if(split==="eparpille"){
      /* pour chaque paire de cases jumelles colorées, on n'en montre qu'une (au hasard) ; la case de O, si elle est colorée, est montrée */
      P.lock=P.full.map(row=>row.map(()=>false));
      for(let r=0;r<H;r++) for(let c=0;c<W;c++) if(P.full[r][c]!=="." && cote("gauche",P,r,c)){ const [a,b]=img(P,r,c); if(a===r&&b===c) P.lock[r][c]=true; else if(Math.random()<.5) P.lock[r][c]=true; else P.lock[a][b]=true; }
      const vus=P.lock.flat().filter(x=>x).length, tot=P.full.flat().filter(x=>x!==".").length;
      if(tot-vus<5) continue;
      /* il faut des morceaux à retrouver des deux côtés */
      let g=0,d=0; for(let r=0;r<H;r++) for(let c=0;c<W;c++) if(P.full[r][c]!=="." && !P.lock[r][c]) (cote("gauche",P,r,c)?g++:d++);
      if(g<2 || d<2) continue;
    } else {
      P.lock=P.full.map((row,r)=>row.map((_,c)=>cote(split,P,r,c)));
      if(differe(P, miroir(P))<2) continue;        /* le miroir ne doit pas donner la bonne réponse */
      let aFaire=0; for(let r=0;r<H;r++) for(let c=0;c<W;c++) if(!P.lock[r][c] && P.full[r][c]!==".") aFaire++;
      if(aFaire<3) continue;
    }
    P.cols=[...new Set(P.full.flat().filter(x=>x!=="."))];
    return P;
  }
  throw new Error("dessin impossible à fabriquer");
}

/* ---------- interface ---------- */
let R0=null, S=null, ST={best:{}, lv:0, vu:false}, ANIM=null, keyH=null, upH=null;
const RM = () => { try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } };
function load(){ try{ const o=JSON.parse(localStorage.getItem(CLE)||"{}"); if(o && typeof o==="object") ST=Object.assign(ST,o); }catch(e){} }
function save(){ try{ localStorage.setItem(CLE, JSON.stringify(ST)); }catch(e){} }
const $ = s => R0.querySelector(s);
const etoiles = pts => pts>=8 ? 3 : pts>=5 ? 2 : pts>0 ? 1 : 0;
const etoilesHTML = (n, tot=3) => `<span class="mj-pixel-stars" aria-label="${n} étoile${n>1?"s":""} sur ${tot}">${"★".repeat(n)}<span class="mj-pixel-off">${"★".repeat(tot-n)}</span></span>`;

const CSS = `
.mj-pixel{--px-o:#1a56db;color:var(--ink)}
.mj-pixel-topw{display:flex;align-items:center;gap:14px;margin:0 0 12px;position:relative}
.mj-pixel-top{display:flex;flex-wrap:wrap;align-items:center;gap:8px;flex:1}
.mj-pixel-lv{min-width:46px;height:46px;padding:2px 6px 0;border-radius:12px;border:2px solid var(--line);background:var(--surface);color:var(--ink);font:inherit;font-weight:700;font-size:1rem;cursor:pointer;display:inline-flex;flex-direction:column;align-items:center;justify-content:center;line-height:1}
.mj-pixel-lv small{font-size:.62rem;letter-spacing:0;margin-top:3px;color:#d79a00}
.mj-pixel-lv.on{border-color:var(--c);box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 30%,transparent)}
.mj-pixel-lv.defi{border-color:#f0a43a}
.mj-pixel-total{margin-left:auto;font-weight:600;color:var(--muted);font-size:.95rem}
.mj-pixel-main{display:grid;grid-template-columns:minmax(0,1fr) 410px;gap:18px;align-items:start}
.mj-pixel-board{display:flex;justify-content:center;align-items:flex-start;background:#f4f7fc;border:2px solid var(--line);border-radius:16px;padding:8px}
.mj-pixel-left{min-width:0;display:grid;gap:10px}
.mj-pixel-svg{display:block;overflow:hidden;touch-action:none;user-select:none;-webkit-user-select:none;max-width:100%}
.mj-pixel-svg .c{stroke:#c4cfdf;stroke-width:.035;cursor:pointer}
.mj-pixel-svg .c.l{cursor:not-allowed}
.mj-pixel-svg .manque{fill:none;stroke:#d93025;stroke-width:.09;stroke-dasharray:.16 .1;pointer-events:none}
.mj-pixel-svg .x{stroke:#d93025;stroke-width:.1;stroke-linecap:round;pointer-events:none}
.mj-pixel-svg .bord{fill:none;stroke:#8a97ad;stroke-width:.06;pointer-events:none}
.mj-pixel-svg .ex{fill:none;stroke:var(--px-o);stroke-width:.12;pointer-events:none}
.mj-pixel-svg .exl{stroke:var(--px-o);stroke-width:.08;stroke-dasharray:.2 .14;pointer-events:none}
.mj-pixel-svg .o{fill:var(--px-o);stroke:#fff;stroke-width:.07;pointer-events:none}
.mj-pixel-svg .ot{font:800 .62px Arial,Helvetica,sans-serif;fill:var(--px-o);stroke:#fff;stroke-width:.14px;paint-order:stroke;pointer-events:none}
.mj-pixel-svg .calque{pointer-events:none}
.mj-pixel-side{border:2px solid var(--line);border-radius:16px;padding:12px 16px;background:var(--surface);display:grid;gap:9px}
.mj-pixel-side h2{font-family:var(--f-display);font-size:1.15rem;margin:0}
.mj-pixel-sous{font-size:.9rem;color:var(--muted);margin-top:2px}
.mj-pixel-cons{font-size:1rem;line-height:1.45}
.mj-pixel-info{font-size:.92rem;color:var(--muted);line-height:1.4;margin-top:3px}
.mj-pixel-pal{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.mj-pixel-pal .btn{padding:8px 12px;font-size:.92rem;margin-left:auto}
.mj-pixel-col{width:42px;height:42px;border-radius:11px;border:3px solid #fff;box-shadow:0 0 0 1.5px #b7c2d3;cursor:pointer;font:inherit;font-size:1.1rem;font-weight:700;color:#1b2a44;background:#fff;position:relative}
.mj-pixel-col.on{box-shadow:0 0 0 3.5px var(--ink)}
.mj-pixel-col kbd{position:absolute;right:2px;bottom:1px;font:700 .62rem Arial,sans-serif;color:#fff;text-shadow:0 0 2px #000}
.mj-pixel-col.gomme kbd{color:#1b2a44;text-shadow:none}
.mj-pixel-btns{display:flex;flex-wrap:wrap;gap:8px}
.mj-pixel-btns .btn{padding:10px 16px}
.mj-pixel-btns .btn.primary{min-width:120px}
.mj-pixel-msg{border-radius:12px;padding:9px 13px;line-height:1.45;background:color-mix(in srgb,var(--c) 10%,var(--surface));font-size:.98rem}
.mj-pixel-msg.ok{background:var(--okbg);color:var(--ink)} .mj-pixel-msg.ko{background:var(--kobg);color:var(--ink)}
.mj-pixel-msg .btn{margin-top:8px;padding:9px 16px}
.mj-pixel details.mj-pixel-help{margin:0;border:0;padding:0}
.mj-pixel-help summary{cursor:pointer;font-weight:600;color:var(--ink);border:2px solid var(--line);background:var(--surface);border-radius:999px;padding:8px 16px;list-style:none;white-space:nowrap}
.mj-pixel-help summary::-webkit-details-marker{display:none}
.mj-pixel-help[open] summary{border-color:var(--c)}
.mj-pixel-hbox{position:absolute;right:0;top:calc(100% + 8px);z-index:5;width:min(620px,100%);background:var(--surface);border:2px solid var(--c);border-radius:16px;padding:14px 18px;box-shadow:0 12px 30px rgba(0,0,0,.18)}
.mj-pixel-help ol{margin:0 0 10px;padding-left:1.3em;font-size:1rem;line-height:1.5;display:grid;gap:6px}
.mj-pixel-stars{color:#e0a100;letter-spacing:.05em}
.mj-pixel-off{color:color-mix(in srgb,var(--muted) 45%,transparent)}
.mj-pixel-pts{font-weight:700}
.mj-pixel-note{font-size:.85rem;color:var(--muted)}
@media (max-width:900px){.mj-pixel-main{grid-template-columns:1fr}}
`;

function init(root){
  R0=root; load();
  if(!document.getElementById("mj-pixel-css")){ const st=document.createElement("style"); st.id="mj-pixel-css"; st.textContent=CSS; document.head.appendChild(st); }
  root.innerHTML=`<div class="mj-pixel">
    <div class="mj-pixel-topw"><div class="mj-pixel-top" id="mj-pixel-top"></div>
      <details class="mj-pixel-help" id="mj-pixel-help"><summary>Comment jouer ?</summary><div class="mj-pixel-hbox"><ol>
          <li>Choisis une couleur, puis clique sur les cases blanches (tu peux glisser). Clique de nouveau pour effacer.</li>
          <li>Chaque case colorée a une <b>jumelle</b> de l'autre côté de O, à la même distance : O est pile au milieu.</li>
          <li>Le dessin fini ne change pas si on lui fait faire un <b>demi-tour</b> autour de O.</li>
          <li>Réussi du premier coup : 3 points. Avec « Voir le demi-tour » : 2 points au plus. Clavier : 1, 2, 3… pour les couleurs, Entrée pour vérifier.</li></ol>
          <button class="btn primary" id="mj-pixel-compris">J'ai compris</button></div></details></div>
    <div class="mj-pixel-main">
      <div class="mj-pixel-left"><div class="mj-pixel-board" id="mj-pixel-board"></div></div>
      <aside class="mj-pixel-side">
        <div><h2 id="mj-pixel-titre"></h2><div class="mj-pixel-sous" id="mj-pixel-sous"></div></div>
        <div><p class="mj-pixel-cons" id="mj-pixel-cons"></p><p class="mj-pixel-info" id="mj-pixel-info"></p></div>
        <div class="mj-pixel-pal" id="mj-pixel-pal"></div>
        <div class="mj-pixel-btns"><button class="btn primary" id="mj-pixel-ok">Vérifier</button><button class="btn" id="mj-pixel-tour">Voir le demi-tour</button></div>
        <div class="mj-pixel-msg" id="mj-pixel-msg" hidden aria-live="polite"></div>
      </aside>
    </div></div>`;
  $("#mj-pixel-ok").onclick=()=>verifier(true);
  R0.addEventListener("click", e=>{ if(e.target && e.target.id==="mj-pixel-eff") effacer(); });
  const effacer=()=>{ if(!S || S.fini) return; S.grid=S.P.full.map((row,r)=>row.map((ch,c)=>S.P.lock[r][c]?ch:".")); S.marks=null; S.ex=null; dessine(); msg(""); };
  $("#mj-pixel-tour").onclick=()=>demiTour(false);
  $("#mj-pixel-compris").onclick=()=>{ $("#mj-pixel-help").open=false; };
  if(!ST.vu){ $("#mj-pixel-help").open=true; ST.vu=true; save(); }
  if(keyH) document.removeEventListener("keydown", keyH);
  if(upH) document.removeEventListener("pointerup", upH);
  keyH=e=>{ if(!R0 || !R0.isConnected){ document.removeEventListener("keydown", keyH); return; }
    if(e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if(e.key==="Enter"){ if(e.target && e.target.closest && e.target.closest("button,summary,a")) return; const n=$("#mj-pixel-next"); e.preventDefault(); if(n) n.click(); else verifier(true); return; }
    if(/^[0-9]$/.test(e.key) && S){ const b=R0.querySelector(`.mj-pixel-col[data-k="${e.key}"]`); if(b){ b.click(); e.preventDefault(); } } };
  upH=()=>{ if(!R0 || !R0.isConnected){ document.removeEventListener("pointerup", upH); return; } if(S && S.peint){ S.peint=null; verifier(false); } };
  document.addEventListener("keydown", keyH); document.addEventListener("pointerup", upH);
  let lv=+ST.lv; if(!(lv>=0 && lv<LV.length)) lv=0;
  niveau(lv);
}

function barre(){
  const tot=LV.reduce((s,_,i)=>s+etoiles(ST.best[i]||0),0);
  $("#mj-pixel-top").innerHTML = LV.map((L,i)=>{ const e=etoiles(ST.best[i]||0);
    return `<button class="mj-pixel-lv${i===S.lv?" on":""}${L.defi?" defi":""}" data-i="${i}" title="Niveau ${i+1} : ${L.titre}" aria-label="Niveau ${i+1} : ${L.titre}, ${e} étoile${e>1?"s":""}">${i+1}<small>${"★".repeat(e)||"&nbsp;"}</small></button>`; }).join("")
    + `<span class="mj-pixel-total">Étoiles : ${tot} / ${LV.length*3}</span>`;
  R0.querySelectorAll(".mj-pixel-lv").forEach(b=>b.onclick=()=>niveau(+b.dataset.i));
}
function niveau(i){
  stopAnim();
  ST.lv=i; save();
  const L=LV[i], deja=new Set(), P=[];
  const pool=shuffle(L.pool);
  for(let k=0;k<NB_DESSINS;k++){ let cle=pool[k%pool.length]; if(deja.has(cle) && !/^forme|^mosaique/.test(cle)) cle=pool.find(x=>!deja.has(x))||cle; deja.add(cle); P.push(cle); }
  S={lv:i, cles:P, k:0, pts:0};
  barre(); dessin();
}
function dessin(){
  stopAnim();
  const L=LV[S.lv]; const P=fabrique(L, S.cles[S.k]);
  Object.assign(S,{P, grid:P.full.map((row,r)=>row.map((ch,c)=>P.lock[r][c]?ch:".")), coul:P.cols[0], fails:0, aide:false, fini:false, marks:null, ex:null, peint:null});
  $("#mj-pixel-titre").textContent=`Niveau ${S.lv+1} · ${L.titre}`;
  sous();
  const ou = P.split==="eparpille" ? "Colorie les jumelles des cases déjà coloriées." : `La partie grisée est déjà faite.`;
  $("#mj-pixel-cons").innerHTML=`Complète le dessin : le point <b style="color:var(--c6)">O</b> doit être son <b>centre de symétrie</b>. ${ou}`;
  $("#mj-pixel-info").textContent=L.info;
  $("#mj-pixel-pal").innerHTML = P.cols.map((c,j)=>`<button class="mj-pixel-col${c===S.coul?" on":""}" data-c="${c}" data-k="${j+1}" style="background:${COUL[c]}" title="${NOMC[c]} (touche ${j+1})" aria-label="Couleur ${NOMC[c]}"><kbd>${j+1}</kbd></button>`).join("")
    + `<button class="mj-pixel-col gomme" data-c="." data-k="0" title="Gomme (touche 0)" aria-label="Gomme">⌫<kbd>0</kbd></button><button class="btn" id="mj-pixel-eff">Tout effacer</button>`;
  R0.querySelectorAll(".mj-pixel-col").forEach(b=>b.onclick=()=>{ S.coul=b.dataset.c; R0.querySelectorAll(".mj-pixel-col").forEach(x=>x.classList.toggle("on",x===b)); });
  $("#mj-pixel-ok").disabled=false; $("#mj-pixel-tour").disabled=false; $("#mj-pixel-eff").disabled=false;
  msg(""); dessine();
}
function sous(){ $("#mj-pixel-sous").innerHTML=`Dessin ${S.k+1} / ${NB_DESSINS} · ${S.P.nom} · <span class="mj-pixel-pts">${S.pts} point${S.pts>1?"s":""}</span>`; }

/* taille d'une case à l'écran : le quadrillage tient sans faire défiler */
function cs(P){ return Math.max(22, Math.min(46, Math.floor(388/(P.H+1.2)), Math.floor(700/(P.W+1.2)))); }
function dessine(){
  const P=S.P, W=P.W, H=P.H, k=cs(P), m=.6;
  let g=`<svg class="mj-pixel-svg" id="mj-pixel-svg" style="height:auto" viewBox="${-m} ${-m} ${W+2*m} ${H+2*m}" width="${(W+2*m)*k}" height="${(H+2*m)*k}" role="img" aria-label="Quadrillage de ${W} colonnes et ${H} lignes, avec le centre de symétrie O">`;
  for(let r=0;r<H;r++) for(let c=0;c<W;c++){ const v=S.grid[r][c], l=P.lock[r][c];
    g+=`<rect class="c${l?" l":""}" x="${c}" y="${r}" width="1" height="1" fill="${v!=="."?COUL[v]:l?"#dfe5ee":"#fff"}"/>`; }
  g+=`<rect class="bord" x="0" y="0" width="${W}" height="${H}"/>`;
  if(S.marks) S.marks.forEach(([r,c,t])=>{ if(S.ex && S.ex[2]===r && S.ex[3]===c) return; g+= t==="manque" ? `<rect class="manque" x="${c+.1}" y="${r+.1}" width=".8" height=".8"/>` : `<path class="x" d="M${c+.22} ${r+.22}L${c+.78} ${r+.78}M${c+.78} ${r+.22}L${c+.22} ${r+.78}"/>`; });
  if(S.ex){ const [a,b,e,f]=S.ex; g+=`<path class="exl" d="M${b+.5} ${a+.5}L${f+.5} ${e+.5}"/><rect class="ex" x="${b+.04}" y="${a+.04}" width=".92" height=".92"/><rect class="ex" x="${f+.04}" y="${e+.04}" width=".92" height=".92" stroke-dasharray=".2 .12"/>`; }
  g+=`<g id="mj-pixel-calque"></g><circle class="o" cx="${P.X}" cy="${P.Y}" r=".2"/><text class="ot" x="${P.X+.24}" y="${P.Y-.24}">O</text></svg>`;
  $("#mj-pixel-board").innerHTML=g;
  const svg=$("#mj-pixel-svg");
  /* case sous le pointeur (avec getBoundingClientRect : juste aussi quand la page est zoomée, en mode DYS) */
  const caseDe=e=>{ const b=svg.getBoundingClientRect(); if(!b.width) return null;
    const x=(e.clientX-b.left)/b.width*(W+2*m)-m, y=(e.clientY-b.top)/b.height*(H+2*m)-m, r=Math.floor(y), c=Math.floor(x); return dans(P,r,c)?[r,c]:null; };
  svg.onpointerdown=e=>{ if(S.fini || ANIM) return; const rc=caseDe(e); if(!rc) return; e.preventDefault(); const [r,c]=rc;
    if(P.lock[r][c]){ msg(P.split==="eparpille" ? "Cette case est déjà faite : colorie les cases <b>blanches</b>." : `Cette partie est déjà faite : colorie de l'<b>autre côté</b> de O.`); return; }
    S.peint = (S.coul!=="." && S.grid[r][c]===S.coul) ? "." : S.coul; peint(r,c); };
  svg.onpointermove=e=>{ if(!S.peint) return; const rc=caseDe(e); if(rc) peint(rc[0],rc[1]); };
}
function peint(r,c){ const P=S.P; if(P.lock[r][c] || S.grid[r][c]===S.peint) return;
  S.grid[r][c]=S.peint; if(S.marks || S.ex){ S.marks=null; S.ex=null; dessine(); return; }
  const el=$("#mj-pixel-svg").querySelectorAll("rect.c")[r*P.W+c]; if(el) el.setAttribute("fill", S.peint==="."?"#fff":COUL[S.peint]); }

function erreurs(){ const P=S.P, out=[]; for(let r=0;r<P.H;r++) for(let c=0;c<P.W;c++){ if(P.lock[r][c]) continue; const v=S.grid[r][c], e=P.full[r][c];
  if(v!==e) out.push([r,c, v==="." ? "manque" : e==="." ? "trop" : "couleur"]); } return out; }
function verifier(manuel){
  if(!S || S.fini || ANIM) return;
  const P=S.P, err=erreurs();
  if(!err.length){ gagne(); return; }
  if(!manuel) return;
  let rien=true; for(let r=0;r<P.H;r++) for(let c=0;c<P.W;c++) if(!P.lock[r][c] && S.grid[r][c]!==".") rien=false;
  if(rien){ msg(`Tu n'as encore rien colorié. Choisis une couleur, puis clique sur les cases ${P.split==="eparpille"?"blanches":"de l'autre côté de O"}.`); return; }
  S.fails++;
  S.marks=err.map(([r,c,t])=>[r,c,t==="manque"?"manque":"x"]);
  const nm=err.filter(e=>e[2]==="manque").length, nt=err.filter(e=>e[2]==="trop").length, nc=err.filter(e=>e[2]==="couleur").length;
  const parts=[]; if(nm) parts.push(`${nm} case${nm>1?"s":""} à colorier (pointillés rouges)`); if(nt) parts.push(`${nt} en trop (croix)`); if(nc) parts.push(`${nc} de la mauvaise couleur (croix)`);
  let diag=diagnostic();
  /* un exemple : une case fausse, sa case de départ et O au milieu */
  const e = err.find(x=>x[2]!=="trop") || err[0]; const [a,b]=img(P,e[0],e[1]); S.ex=[a,b,e[0],e[1]];
  const dc=e[1]-b, dr=e[0]-a, dir=[]; if(dc) dir.push(`${Math.abs(dc)} carreau${Math.abs(dc)>1?"x":""} vers la ${dc>0?"droite":"gauche"}`); if(dr) dir.push(`${Math.abs(dr)} vers le ${dr>0?"bas":"haut"}`);
  let ex;
  if(e[2]==="trop"){
    if(!dans(P,a,b)){ S.ex=null; ex=`Les cases avec une croix doivent rester <b>vides</b> : leur jumelle serait en dehors du quadrillage.`; }
    else if(P.lock[a][b]) ex=`En bleu, un exemple : cette case doit rester <b>vide</b>, car sa jumelle (de l'autre côté de O) est vide.`;
    else ex=`En bleu, un exemple : cette case doit rester <b>vide</b>, ce n'est la jumelle d'aucune case donnée.`;
  } else ex= `En bleu, un exemple : de la case de départ à sa jumelle, on va ${dir.join(" et ")}, et O est pile au milieu. La jumelle doit être <b>${NOMC[P.full[e[0]][e[1]]]}</b>.`;
  dessine();
  msg(`<b>Pas encore !</b> ${parts.join(", ")}.${diag?"<br>"+diag:""}<br>${ex}`, "ko");
}
/* erreurs fréquentes : symétrie axiale (miroir) au lieu du demi-tour, ou moitié simplement recopiée en glissant */
function diagnostic(){
  const P=S.P; if(P.split==="eparpille") return "";
  const fait=[]; for(let r=0;r<P.H;r++) for(let c=0;c<P.W;c++) if(!P.lock[r][c] && S.grid[r][c]!==".") fait.push([r,c]);
  if(fait.length<3) return "";
  const mi=miroir(P); let okM=0, totM=0;
  for(let r=0;r<P.H;r++) for(let c=0;c<P.W;c++) if(!P.lock[r][c] && mi[r][c]!=="."){ totM++; if(S.grid[r][c]===mi[r][c]) okM++; }
  const bonsM=fait.filter(([r,c])=>S.grid[r][c]===mi[r][c]).length;
  if(totM && okM/totM>=.75 && bonsM/fait.length>=.75)
    return `On dirait un <b>miroir</b> (symétrie axiale). Ici, c'est un <b>demi-tour</b> autour de O : le haut passe en bas <b>et</b> la gauche passe à droite.`;
  const don=[]; for(let r=0;r<P.H;r++) for(let c=0;c<P.W;c++) if(P.lock[r][c] && P.full[r][c]!==".") don.push([r,c]);
  let best=0;
  for(let dr=-P.H;dr<=P.H;dr++) for(let dc=-P.W;dc<=P.W;dc++){ if(!dr&&!dc) continue; let n=0; don.forEach(([r,c])=>{ const a=r+dr,b=c+dc; if(dans(P,a,b) && !P.lock[a][b] && S.grid[a][b]===P.full[r][c]) n++; }); if(n>best) best=n; }
  if(don.length && best/don.length>=.75 && best/fait.length>=.75)
    return `On dirait que tu as fait <b>glisser</b> la partie donnée. Avec un demi-tour, le dessin est retourné : le haut passe en bas et la gauche passe à droite.`;
  return "";
}
function gagne(){
  const L=LV[S.lv]; S.fini=true; S.marks=null; S.ex=null;
  let p = S.fails===0 ? 3 : S.fails===1 ? 2 : 1; if(S.aide) p=Math.min(p,2);
  S.pts+=p; sous(); dessine();
  $("#mj-pixel-ok").disabled=true; $("#mj-pixel-tour").disabled=true; $("#mj-pixel-eff").disabled=true;
  const dernier = S.k===NB_DESSINS-1;
  let h=`<b>Bravo, c'est symétrique !</b> +${p} point${p>1?"s":""}.`+(dernier?"":` Regarde : après un demi-tour autour de O, le dessin retombe sur lui-même.`);
  if(dernier){
    const avant=ST.best[S.lv]||0, rec=S.pts>avant; if(rec){ ST.best[S.lv]=S.pts; save(); }
    const e=etoiles(S.pts);
    h+=` <b>Niveau terminé : ${S.pts} / ${NB_DESSINS*3}</b> ${etoilesHTML(e)}${rec&&avant?" · record !":""}<br>`;
    h+= S.lv<LV.length-1 ? `<button class="btn primary" id="mj-pixel-next">Niveau suivant →</button> <button class="btn" id="mj-pixel-rejouer">Rejouer</button>` : `<button class="btn primary" id="mj-pixel-rejouer">Rejouer ce défi</button>`;
  } else h+=`<br><button class="btn primary" id="mj-pixel-next">Dessin suivant →</button>`;
  msg(h,"ok");
  if(dernier) barre();
  const n=$("#mj-pixel-next"); if(n) n.onclick=()=>{ if(dernier) niveau(S.lv+1); else { S.k++; dessin(); } };
  const rj=$("#mj-pixel-rejouer"); if(rj) rj.onclick=()=>niveau(S.lv);
  demiTour(true);
}
function msg(h,k){ const el=$("#mj-pixel-msg"); if(!el) return; el.hidden=!h; el.className="mj-pixel-msg "+(k||""); el.innerHTML=h; }

/* animation : un calque (papier transparent) avec la partie donnée — ou tout le dessin — tourne de 180° autour de O */
function stopAnim(){ if(ANIM){ cancelAnimationFrame(ANIM.id); ANIM=null; } }
function demiTour(tout){
  if(!S || ANIM) return; const P=S.P;
  if(!tout && !S.fini){ S.aide=true; }
  const svg=$("#mj-pixel-svg"), cal=svg && svg.querySelector("#mj-pixel-calque"); if(!cal) return;
  let papier="", pix="";
  for(let r=0;r<P.H;r++) for(let c=0;c<P.W;c++){
    const pris = tout ? true : P.lock[r][c];
    if(!pris) continue;
    if(!tout && P.split!=="eparpille") papier+=`M${c} ${r}h1v1h-1z`;
    const v = tout ? S.grid[r][c] : P.full[r][c];
    if(v!==".") pix+=`<rect x="${c+.06}" y="${r+.06}" width=".88" height=".88" rx=".12" fill="${COUL[v]}" stroke="#1b2a44" stroke-width=".05"/>`;
  }
  cal.innerHTML=`<g class="calque">${papier?`<path d="${papier}" fill="rgba(255,255,255,.35)" stroke="none"/>`:""}<g opacity="${tout?.75:.8}">${pix}</g>
    <path d="M${P.X+1.1} ${P.Y}A1.1 1.1 0 0 1 ${P.X-1.1} ${P.Y}" fill="none" stroke="#1a56db" stroke-width=".09" stroke-dasharray=".18 .12"/></g>`;
  const g=cal.firstChild, D=tout?1300:1900, HOLD=tout?500:1300, FADE=500;
  const fin=()=>{ cal.innerHTML=""; ANIM=null; };
  if(RM()){ g.setAttribute("transform",`rotate(180 ${P.X} ${P.Y})`); ANIM={id:0}; setTimeout(()=>{ if(ANIM){ fin(); } }, tout?900:2200); ANIM.id=0; return; }
  const t0=performance.now();
  const pas=t=>{ if(!R0 || !R0.isConnected || !cal.isConnected){ ANIM=null; return; }
    const u=Math.min(1,(t-t0)/D), e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;
    g.setAttribute("transform",`rotate(${180*e} ${P.X} ${P.Y})`);
    if(t-t0>D+HOLD) g.setAttribute("opacity", Math.max(0,1-(t-t0-D-HOLD)/FADE));
    if(t-t0>D+HOLD+FADE){ fin(); return; }
    ANIM.id=requestAnimationFrame(pas); };
  ANIM={id:requestAnimationFrame(pas)};
}

return {init, _t:{LV, MOTIFS, fabrique, img, cote, estSym, miroir, differe, forme, mosaique, rot90, flipH, flipV, NB_DESSINS, COUL}};
})();
