/* Mini-jeu « Droite au but » (Graph Shooter, 3e, fonctions affines) — window.MJ_GRAPH.init(root)
   Un canon tire le long de la droite de f(x) = ax + b, de gauche à droite.
   Le tir détruit les cibles qu'il traverse et s'arrête au premier mur touché.
   Tous les tests (cible touchée, mur touché, « plein centre ») sont faits en nombres rationnels exacts (BigInt). */
window.MJ_GRAPH = (function(){
"use strict";
const KEY = "staal-mj-graph3";
const XMIN = -8, XMAX = 8, YMIN = -5, YMAX = 5, U = 40;
const W = (XMAX-XMIN)*U, H = (YMAX-YMIN)*U;
const SX = x => (x-XMIN)*U, SY = y => (YMAX-y)*U;
const RT = 0.3;                         /* rayon des cibles, en carreaux */

/* ---------- nombres rationnels exacts ---------- */
const B = BigInt;
function pg(a,b){ if(a<0n) a=-a; if(b<0n) b=-b; while(b){ const t=a%b; a=b; b=t; } return a||1n; }
function Q(n,d){ n=B(n); d=(d===undefined)?1n:B(d); if(d===0n) throw new Error("division par 0"); if(d<0n){ n=-n; d=-d; } const k=pg(n,d); return {n:n/k, d:d/k}; }
const qa=(p,q)=>Q(p.n*q.d+q.n*p.d, p.d*q.d), qs=(p,q)=>Q(p.n*q.d-q.n*p.d, p.d*q.d);
const qm=(p,q)=>Q(p.n*q.n, p.d*q.d), qd=(p,q)=>Q(p.n*q.d, p.d*q.n);
const qc=(p,q)=>{ const v=p.n*q.d-q.n*p.d; return v>0n?1:(v<0n?-1:0); };
const qv=p=>Number(p.n)/Number(p.d), qz=p=>p.n===0n, qabs=p=>Q(p.n<0n?-p.n:p.n, p.d);
const qq=x=>Q(Math.round(x*12),12);     /* les nombres du plateau sont des multiples de 1/12 */
const R2 = Q(9,100);                    /* RT² exact */
const f = (L,x) => qa(qm(L.a,x), L.b);

/* ---------- géométrie exacte ---------- */
/* une cible (x ; y) est touchée si f(x) = y à 0,3 près : |f(x) − y| ≤ 0,3 (le tir passe alors dans son disque) */
const RQ = Q(3,10);
function touche(L,t){ return qc(qabs(qs(f(L,t.qx), t.qy)), RQ)<=0; }
/* le tir traverse le disque de la cible sans la toucher (droite très penchée) : distance² ≤ r²  ⇔  (ax − y + b)² ≤ r²(a² + 1) */
function frole(L,t){ const e=qs(f(L,t.qx), t.qy); return qc(qm(e,e), qm(R2, qa(qm(L.a,L.a), Q(1))))<=0; }
function pleinCentre(L,t){ return qc(f(L,t.qx), t.qy)===0; }
/* premier point de contact (abscisse exacte) entre la droite et un mur rectangulaire, ou null */
function contactMur(L,w){
  const f1=f(L,w.x1), f2=f(L,w.x2), lo=qc(f1,f2)<=0?f1:f2, hi=qc(f1,f2)<=0?f2:f1;
  if(qc(hi,w.y1)<0 || qc(lo,w.y2)>0) return null;
  if(qc(f1,w.y1)>=0 && qc(f1,w.y2)<=0) return w.x1;
  return qc(f1,w.y1)<0 ? qd(qs(w.y1,L.b),L.a) : qd(qs(w.y2,L.b),L.a);
}
/* morceau de la droite visible dans la fenêtre [XMIN;XMAX]×[YMIN;YMAX] */
function fenetre(L){ const a=qv(L.a), b=qv(L.b);
  let x0=XMIN, x1=XMAX;
  if(a===0){ if(b<YMIN || b>YMAX) return null; }
  else { const u=(YMIN-b)/a, v=(YMAX-b)/a; x0=Math.max(x0,Math.min(u,v)); x1=Math.min(x1,Math.max(u,v)); }
  return x1-x0>1e-9 ? [x0,x1] : null; }
/* simulation d'un tir */
function tir(L, cibles, murs){
  const fen=fenetre(L); if(!fen) return null;
  let xm=null, mur=null;
  murs.forEach(w=>{ const c=contactMur(L,w); if(c && (!xm || qc(c,xm)<0)){ xm=c; mur=w; } });
  const avant = t => !xm || qc(t.qx, xm)<0;          /* la cible est atteinte avant le mur (comparaison exacte) */
  const toutes=cibles.filter(t=>touche(L,t)).map(t=>({t, x:t.x})).sort((p,q)=>p.x-q.x);
  const hits=toutes.filter(h=>avant(h.t));
  const bords=cibles.filter(t=>!touche(L,t) && frole(L,t) && avant(t));
  return {x0:fen[0], x1:xm?Math.min(fen[1], qv(xm)):fen[1], mur, hits, bords, sansMur:toutes.length};
}

/* ---------- niveaux ---------- */
const P = (...l) => l;                 /* liste de pentes [num, dén] */
const ent = (a,b,z) => { const r=[]; for(let v=a; v<=b; v++) if(z || v) r.push(v); return r; };
const LV = [
  {nom:"Par l'origine", court:"f(x) = ax", aide:"Ici b = 0 : toutes les droites passent par l'origine du repère. À toi de trouver a.",
   a:P([1],[2],[3],[4]), b:[0], lin:true, n:[2,2], per:[2,3], murs:0, bonus:2},
  {nom:"Pentes douces", court:"a décimal", aide:"Toujours b = 0. Le coefficient a peut être décimal : avec a = 0,5, quand x augmente de 1, y augmente de 0,5.",
   a:P([1,2],[3,2],[1],[2],[3]), b:[0], lin:true, n:[3,3], per:[2,2], murs:0, bonus:2},
  {nom:"Le rôle de b", court:"b ≠ 0", aide:"Maintenant b change : la droite coupe l'axe des ordonnées au point (0 ; b).",
   a:P([1],[2],[3],[1,2]), b:ent(-4,4,false), n:[2,3], per:[2,3], murs:0, bonus:2},
  {nom:"Ça descend !", court:"a < 0", aide:"Si a est négatif, la droite descend : quand x augmente de 1, y diminue.",
   a:P([-1],[-2],[-3],[-1,2]), b:ent(-4,4,true), n:[3,3], per:[2,3], murs:0, bonus:2, plusUne:true},
  {nom:"Les murs", court:"obstacles", aide:"Le tir s'arrête au premier mur touché, même par un coin. Choisis bien tes droites !",
   a:P([1],[2],[3],[1,2],[-1],[-2],[-3],[-1,2],[0]), b:ent(-4,4,true), n:[3,3], per:[2,3], murs:3, bonus:2},
  {nom:"Décimaux", court:"a et b décimaux", aide:"a et b peuvent être décimaux, et les cibles peuvent être sur des demi-carreaux. Écris par exemple 1,5 ou −0,5.",
   a:P([1,2],[3,2],[5,2],[1,4],[-1,2],[-3,2],[-5,2],[-1,4],[2],[-1]), b:[-3.5,-2.5,-1.5,-0.5,0.5,1.5,2.5,3.5,-2,2,1,-1,0], demi:true, n:[3,3], per:[2,3], murs:3, bonus:2},
  {nom:"Fractions", court:"a en fraction", aide:"a peut être une fraction : écris-la avec une barre, par exemple 1/3 ou −2/3. Avec a = 1/3, quand x augmente de 3, y augmente de 1.",
   a:P([1,3],[2,3],[1,4],[3,4],[4,3],[-1,3],[-2,3],[-1,4],[-3,4],[-4,3]), b:ent(-3,3,true), n:[3,3], per:[2,3], murs:3, bonus:2},
  {nom:"Expert", court:"tout à la fois", aide:"Tout est permis : nombres relatifs, décimaux, fractions, demi-carreaux et murs. Une seule munition de secours !",
   a:P([1],[2],[3],[1,2],[3,2],[1,3],[2,3],[3,4],[-1],[-2],[-3],[-1,2],[-3,2],[-1,3],[-2,3],[-3,4],[0]), b:[-3.5,-2.5,-1.5,-0.5,0.5,1.5,2.5,3.5,-3,-2,-1,0,1,2,3], demi:true, n:[4,4], per:[2,3], murs:4, bonus:1}
];

/* ---------- génération d'un plateau ---------- */
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=l=>l[Math.floor(Math.random()*l.length)];
const shuffle=l=>{ for(let i=l.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [l[i],l[j]]=[l[j],l[i]]; } return l; };
function cible(x,y){ return {x, y, qx:qq(x), qy:qq(y), id:Math.random().toString(36).slice(2,8)}; }
function mur(x1,x2,y1,y2){ return {x1:qq(x1), x2:qq(x2), y1:qq(y1), y2:qq(y2), fx1:x1, fx2:x2, fy1:y1, fy2:y2}; }
function distRect(t,w){ const dx=Math.max(w.fx1-t.x,0,t.x-w.fx2), dy=Math.max(w.fy1-t.y,0,t.y-w.fy2); return Math.hypot(dx,dy); }
function distDroite(L,t){ return Math.abs(qv(L.a)*t.x+qv(L.b)-t.y); }   /* écart vertical */
function generer(niv){
  const C=LV[niv];
  for(let essai=0; essai<3000; essai++){
    const nl=rnd(C.n[0],C.n[1]), sol=[], cibles=[];
    let ok=true;
    for(let i=0;i<nl && ok;i++){
      let L=null;
      for(let k=0;k<60;k++){
        let ar=pick(C.a);
        if(C.plusUne && i===nl-1) ar=pick([[1],[2],[1,2]]);   /* niveau « Ça descend » : une droite qui monte pour comparer */
        const a=Q(ar[0], ar[1]||1), b=qq(pick(C.b));
        if(sol.some(s=>qc(s.a,a)===0 && qc(s.b,b)===0)) continue;
        if(C.lin && sol.some(s=>qc(s.a,a)===0)) continue;
        const pas=C.demi?2:1, pts=[];
        for(let x=-7;x<=7;x++){ const y=f({a,b},Q(x)); const yv=qv(y);
          if(Number(y.d)>pas || Math.abs(yv)>4) continue;
          if(C.lin && x===0) continue;
          pts.push([x,yv]); }
        if(pts.length<C.per[0]) continue;
        /* choisir des points bien espacés sur la droite */
        const want=rnd(C.per[0], Math.min(C.per[1], pts.length)), ch=[];
        shuffle(pts).forEach(p=>{ if(ch.length<want && ch.every(q=>Math.hypot(q[0]-p[0],q[1]-p[1])>=2.2)) ch.push(p); });
        if(ch.length<C.per[0]) continue;
        L={a, b, pts:ch}; break;
      }
      if(!L){ ok=false; break; }
      sol.push(L);
    }
    if(!ok) continue;
    sol.forEach((L,i)=>L.pts.forEach(p=>cibles.push(Object.assign(cible(p[0],p[1]), {ligne:i}))));
    /* cibles bien séparées, et aucune cible d'une droite n'est touchée par une autre droite-solution */
    if(cibles.some((t,i)=>cibles.some((u,j)=>j>i && Math.hypot(t.x-u.x,t.y-u.y)<1.2))) continue;
    if(cibles.some(t=>sol.some((L,i)=>i!==t.ligne && distDroite(L,t)<RT+0.2))) continue;
    if(C.lin && cibles.some(t=>t.x===0 && t.y===0)) continue;
    /* murs : ils ne touchent aucune droite-solution, ne cachent aucune cible et bloquent des droites « tentantes » */
    const murs=[];
    if(C.murs){
      const tent=[];
      cibles.forEach((t,i)=>cibles.forEach((u,j)=>{ if(j>i && t.ligne!==u.ligne && t.x!==u.x){
        const a=qd(qs(u.qy,t.qy), qs(u.qx,t.qx)); tent.push({a, b:qs(t.qy, qm(a,t.qx)), xmax:Math.max(t.x,u.x)}); } }));
      const cands=[];
      for(let k=0;k<500;k++){
        let w;
        if(Math.random()<.6){ const cx=rnd(-6,6)+0.5, h=rnd(2,3), y0=rnd(-4,4-h)+(Math.random()<.5?0:0.5); w=mur(cx-0.25,cx+0.25,y0,y0+h); }
        else { const cy=rnd(-4,3)+0.5, l=rnd(2,3), x0=rnd(-7,7-l); w=mur(x0,x0+l,cy-0.25,cy+0.25); }
        if(w.fx1<-7.5 || w.fx2>7.5 || w.fy1<-4.5 || w.fy2>4.5) continue;
        const big=mur(w.fx1-0.3,w.fx2+0.3,w.fy1-0.3,w.fy2+0.3);
        if(sol.some(L=>contactMur(L,big))) continue;
        if(cibles.some(t=>distRect(t,w)<0.6)) continue;
        w.utile=tent.filter(L=>{ const c=contactMur(L,w); return c && qv(c)<L.xmax; }).length;
        cands.push(w);
      }
      cands.sort((p,q)=>q.utile-p.utile+(Math.random()-.5)*2);
      for(const w of cands){ if(murs.length>=C.murs) break;
        if(murs.some(m=>m.fx1<w.fx2+0.8 && w.fx1<m.fx2+0.8 && m.fy1<w.fy2+0.8 && w.fy1<m.fy2+0.8)) continue;
        murs.push(w); }
      if(murs.length<C.murs || murs.filter(w=>w.utile>0).length<Math.min(2,C.murs)) continue;
    }
    /* contrôle final : chaque droite-solution touche toutes ses cibles, et seulement elles */
    if(!sol.every((L,i)=>{ const s=tir(L,cibles,murs); return s && s.hits.length===L.pts.length && s.hits.every(h=>h.t.ligne===i && pleinCentre(L,h.t)); })) continue;
    return {sol, cibles, murs, par:nl, munitions:nl+C.bonus};
  }
  throw new Error("plateau introuvable");
}

/* ---------- saisie d'un nombre : 2 ; −1,5 ; 1/3 ---------- */
function lire(s){
  s=String(s).trim().replace(/[−–]/g,"-").replace(/\s+/g,"").replace(",",".");
  if(s==="") return {err:"vide"};
  let m=s.match(/^([+-]?)(\d{1,2})\/(\d{1,2})$/);
  if(m){ if(+m[3]===0) return {err:"On ne peut pas diviser par 0."}; return {q:Q((m[1]==="-"?-1:1)*(+m[2]), +m[3]), frac:true}; }
  m=s.match(/^([+-]?)(\d{0,2})(?:\.(\d{1,3}))?$/);
  if(m && (m[2]||m[3])){ const dec=m[3]||"", n=B((m[2]||"0")+dec)*(m[1]==="-"?-1n:1n); return {q:Q(n, 10n**B(dec.length)), frac:false}; }
  if(/^[+-]?\d+[.,]\d{4,}$/.test(s)) return {err:"Trois chiffres après la virgule au maximum. Pour un tiers, écris plutôt 1/3."};
  return {err:"Écris un nombre, par exemple 2, −1,5 ou 1/3."};
}

/* ---------- écriture des nombres ---------- */
const MOINS="−";
function estDec(q){ let d=q.d; while(d%2n===0n) d/=2n; while(d%5n===0n) d/=5n; return d===1n && q.d<=1000n; }
function nb(q, frac){                    /* HTML d'un nombre : entier, décimal (virgule) ou fraction */
  if(q.d===1n) return (q.n<0n?MOINS:"")+String(q.n<0n?-q.n:q.n);
  if(!frac && estDec(q)) return String(+qv(q).toFixed(3)).replace("-",MOINS).replace(".",",");
  const n=q.n<0n?-q.n:q.n;
  return (q.n<0n?MOINS:"")+`<span class="mj-graph-fr"><span>${n}</span><span>${q.d}</span></span>`;
}
const par = (q,frac) => q.n<0n ? "("+nb(q,frac)+")" : nb(q,frac);
const X = `<i>x</i>`;
function formule(L){
  let s;
  if(qz(L.a)) s=nb(L.b,L.fb);
  else { s = qc(L.a,Q(1))===0 ? X : qc(L.a,Q(-1))===0 ? MOINS+X : nb(L.a,L.fa)+X;
    if(!qz(L.b)) s += (L.b.n>0n?" + ":" "+MOINS+" ")+nb(qabs(L.b),L.fb); }
  return `<i>f</i>(${X}) = `+s;
}
function calcul(L,t){                   /* f(3) = 2 × 3 + 1 = 7 */
  const xs=nb(t.qx), y=f(L,t.qx), fr=L.fa||L.fb;
  let s=`<i>f</i>(${xs}) = `;
  if(qz(L.a)) return s+nb(L.b,L.fb);
  s+=nb(L.a,L.fa)+" × "+par(t.qx);
  if(!qz(L.b)) s+=(L.b.n>0n?" + ":" "+MOINS+" ")+nb(qabs(L.b),L.fb);
  return s+" = "+nb(y,fr && !estDec(y));
}
const co = t => `(${nb(t.qx)} ; ${nb(t.qy)})`;
const plur = (n,s,p) => n+" "+(n>1?(p||s+"s"):s);

/* ---------- mémoire (record, réglages) ---------- */
function charger(){ try{ const o=JSON.parse(localStorage.getItem(KEY)||"{}"); return (o && typeof o==="object")?o:{}; }catch(e){ return {}; } }
function sauver(){ try{ localStorage.setItem(KEY, JSON.stringify(MEM)); }catch(e){} }

/* ---------- interface ---------- */
const CSS = `
.mj-graph{--c:var(--c3);display:grid;grid-template-columns:minmax(0,1fr) 410px;gap:16px;align-items:start}
.mj-graph-board{position:relative;border:2px solid var(--line);border-radius:16px;overflow:hidden;background:#fbfcff;max-width:calc(480px*1.6);width:100%;justify-self:center}
.mj-graph-svg{display:block;width:100%;height:auto;user-select:none;font-family:var(--f-body)}
.mj-graph-svg .q{stroke:#e2e8f3;stroke-width:1}
.mj-graph-svg .q2{stroke:#eef2f8;stroke-width:1;stroke-dasharray:3 4}
.mj-graph-svg .ax{stroke:#3b4762;stroke-width:1.6}
.mj-graph-svg .gr{font-size:12px;fill:#56627d;font-weight:500}
.mj-graph-svg .grb{font-size:14px;fill:#3b4762;font-weight:700;font-style:italic}
.mj-graph-svg .mur rect.m{fill:#6b5643;stroke:#3f3125;stroke-width:1.5}
.mj-graph-svg .mur path{stroke:#8d7560;stroke-width:1.2;fill:none}
.mj-graph-svg .mur.flash rect.m{fill:#e8590c}
.mj-graph-svg .cib{cursor:help}
.mj-graph-svg .cib .c1{fill:#e03131;stroke:#9b1c1c;stroke-width:1.2}
.mj-graph-svg .cib .c2{fill:#fff}
.mj-graph-svg .cib .c3{fill:#e03131}
.mj-graph-svg .cib:hover .c1,.mj-graph-svg .cib:focus .c1{stroke:#15213b;stroke-width:2.5}
.mj-graph-svg .lab{font-size:12.5px;font-weight:700;fill:#15213b;paint-order:stroke;stroke:#fbfcff;stroke-width:4px;stroke-linejoin:round;pointer-events:none}
.mj-graph-svg .old{stroke:#7c3aed;stroke-width:2;opacity:.28}
.mj-graph-svg .old.last{opacity:.55;stroke-dasharray:7 5}
.mj-graph-svg .sol{stroke:#167a54;stroke-width:3;stroke-dasharray:9 6}
.mj-graph-svg .soltxt{font-size:13px;font-weight:700;fill:#167a54;paint-order:stroke;stroke:#fbfcff;stroke-width:4px}
.mj-graph-svg .ray{stroke:#7c3aed;stroke-width:4;stroke-linecap:round;filter:drop-shadow(0 0 4px rgba(124,58,237,.7))}
.mj-graph-svg .balle{fill:#fff;stroke:#7c3aed;stroke-width:3}
.mj-graph-svg .canon .base{fill:#2b2f45}
.mj-graph-svg .canon .tube{fill:#4b4f6b;stroke:#2b2f45;stroke-width:1.5}
.mj-graph-svg .canon{transition:transform .35s ease}
.mj-graph-svg .ghost{fill:none;stroke:#e03131;stroke-width:1.2;stroke-dasharray:3 3;opacity:.45}
.mj-graph-svg .pc{animation:mj-graph-boom .7s ease-out forwards}
.mj-graph-svg .onde{fill:none;stroke:#f59f00;stroke-width:3;transform-box:fill-box;transform-origin:center;animation:mj-graph-onde .5s ease-out forwards}
@keyframes mj-graph-onde{from{transform:scale(1);opacity:.9}to{transform:scale(2.6);opacity:0}}
.mj-graph-svg .pts{font-size:17px;font-weight:800;fill:#7c3aed;paint-order:stroke;stroke:#fff;stroke-width:4px;animation:mj-graph-up 1.1s ease-out forwards}
@keyframes mj-graph-boom{from{transform:translate(0,0);opacity:1}to{transform:translate(var(--dx),var(--dy));opacity:0}}
@keyframes mj-graph-up{from{transform:translate(0,0);opacity:1}to{transform:translate(0,-34px);opacity:0}}
.mj-graph-over{position:absolute;inset:0;display:grid;place-items:center;background:rgba(251,252,255,.82);padding:16px}
.mj-graph-card{background:#fff;color:#15213b;border:2px solid #d3dbea;border-radius:16px;padding:18px 22px;max-width:470px;text-align:center;box-shadow:0 10px 30px rgba(21,33,59,.15)}
.mj-graph-card h3{font-family:var(--f-display);font-size:1.45rem;margin:0 0 6px}
.mj-graph-card p{margin:6px 0;color:#2c3a57}
.mj-graph-card .btn{margin:8px 4px 0;background:#fff;color:#15213b;border-color:#15213b}
.mj-graph-card .btn.primary{background:#15213b;color:#fff}
.mj-graph-card .stars{font-size:2rem;letter-spacing:.1em;color:#f59f00}
.mj-graph-card .stars .v{color:#c9d1e0}
.mj-graph-side{border:2px solid var(--line);border-radius:16px;padding:10px 12px;background:var(--surface);color:var(--ink);display:flex;flex-direction:column;gap:7px;min-width:0}
.mj-graph-lvs{display:grid;grid-template-columns:repeat(8,1fr);gap:4px}
.mj-graph-lvs button{font:inherit;font-weight:700;font-size:.95rem;border:2px solid var(--line);background:var(--surface);color:var(--ink);border-radius:9px;padding:1px 0 0;cursor:pointer;line-height:1.1;min-width:0}
.mj-graph-lvs button small{display:block;font-size:.58rem;color:#f59f00;letter-spacing:-.05em;min-height:1.05em}
.mj-graph-lvs button[aria-current="true"]{background:var(--c);border-color:var(--c);color:#fff}
.mj-graph-lvs button[aria-current="true"] small{color:#fff}
.mj-graph-lvs button:disabled{opacity:.4;cursor:not-allowed}
.mj-graph-h{display:flex;align-items:baseline;justify-content:space-between;gap:8px;flex-wrap:wrap}
.mj-graph-h h3{font-family:var(--f-display);font-size:1.15rem;margin:0}
.mj-graph-h span{font-size:.85rem;color:var(--muted);font-weight:600}
.mj-graph-form{display:flex;align-items:center;gap:6px;flex-wrap:wrap;font-size:1.25rem;font-weight:700;background:var(--paper);border-radius:12px;padding:6px 10px 4px}
.mj-graph-form input{font:inherit;font-size:1.2rem;width:4.2em;padding:2px 6px;border:2px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink);text-align:center}
.mj-graph-form input:focus{border-color:var(--c);outline:none;box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 30%,transparent)}
.mj-graph-form .btn{padding:8px 16px;margin-left:auto;font-size:1.05rem}
.mj-graph-form .lab{font-size:.75rem;color:var(--muted);font-weight:600;display:block;text-align:center;line-height:1}
.mj-graph-form label{display:flex;flex-direction:column;gap:2px}
.mj-graph-prev{font-size:1rem;color:var(--muted);margin:0;min-height:1.6em}
.mj-graph-prev b{color:var(--ink)}
.mj-graph-stats{display:flex;gap:6px;flex-wrap:wrap}
.mj-graph-stats div{flex:1 1 0;background:var(--paper);border-radius:10px;padding:2px 8px;text-align:center;min-width:80px;line-height:1.25}
.mj-graph-stats b{display:block;font-family:var(--f-display);font-size:1.12rem;line-height:1.25}
.mj-graph-stats small{font-size:.75rem;color:var(--muted);font-weight:600}
.mj-graph-ammo i{display:inline-block;width:.7em;height:.7em;border-radius:50%;background:var(--c);margin:0 1px}
.mj-graph-ammo i.v{background:var(--line)}
.mj-graph-msg{border-radius:12px;padding:6px 12px;background:var(--paper);line-height:1.45;font-size:.93rem;min-height:2.6em;max-height:10.2em;overflow:auto}
.mj-graph-msg.ok{background:var(--okbg)} .mj-graph-msg.ko{background:var(--kobg)}
.mj-graph-msg p{margin:2px 0}
.mj-graph-calc{font-variant-numeric:tabular-nums}
.mj-graph-hist{display:flex;flex-wrap:wrap;gap:4px;margin:0;padding:0;list-style:none;font-size:.82rem}
.mj-graph-hist li{background:var(--paper);border:1.5px solid var(--line);border-radius:999px;padding:1px 9px}
.mj-graph-aides{display:flex;flex-wrap:wrap;column-gap:18px;border-top:1.5px solid var(--line);padding-top:4px}
.mj-graph-aides details[open]{flex-basis:100%}
.mj-graph-side details{font-size:.92rem;line-height:1.5;margin:0;border:0;padding:2px 0}
.mj-graph-side summary{cursor:pointer;font-weight:700}
.mj-graph-side details p,.mj-graph-side details ul{margin:4px 0}
.mj-graph-side details ul{padding-left:1.1em}
.mj-graph-tools{display:flex;gap:6px;flex-wrap:wrap}
.mj-graph-tools .btn{padding:4px 12px;font-size:.88rem}
.mj-graph-tools .btn[aria-pressed="true"]{background:var(--ink);color:var(--paper)}
.mj-graph-fr{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;font-size:.78em;line-height:1.05;margin:0 .1em}
.mj-graph-fr>span:first-child{border-bottom:1.5px solid currentColor;padding:0 .15em}
@media (max-width:980px){.mj-graph{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){.mj-graph-svg .canon{transition:none}.mj-graph-svg .pc,.mj-graph-svg .pts,.mj-graph-svg .onde{animation:none;opacity:0}}
`;
let R0=null, MEM={}, niv=0, J=null, busy=false, raf=0;
const $ = s => R0.querySelector(s);
const reduit = () => { try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } };
function init(root){
  if(!document.getElementById("mj-graph-css")){ const st=document.createElement("style"); st.id="mj-graph-css"; st.textContent=CSS; document.head.appendChild(st); }
  R0=root; MEM=charger(); MEM.lv=MEM.lv||{};
  niv=Math.min(Math.max(0, +MEM.cur||0), LV.length-1); if(!ouvert(niv)) niv=0;
  root.innerHTML=`<div class="mj-graph">
    <div class="mj-graph-board"><svg class="mj-graph-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Repère avec les cibles"></svg><div class="mj-graph-over" hidden></div></div>
    <aside class="mj-graph-side">
      <div class="mj-graph-lvs" role="group" aria-label="Niveaux"></div>
      <div class="mj-graph-h"><h3 id="mjg-titre"></h3><span id="mjg-rec"></span></div>
      <form class="mj-graph-form" autocomplete="off" onsubmit="return false">
        <span><i>f</i>(<i>x</i>) =</span>
        <label><input id="mjg-a" inputmode="text" aria-label="coefficient a" spellcheck="false"><span class="lab">a</span></label>
        <span><i>x</i></span>
        <span id="mjg-bbox" style="display:contents"><span>+</span><label><input id="mjg-b" inputmode="text" aria-label="nombre b" spellcheck="false" value="0"><span class="lab">b</span></label></span>
        <button class="btn primary" type="button" id="mjg-feu">Feu !</button>
      </form>
      <p class="mj-graph-prev" id="mjg-prev" aria-live="polite"></p>
      <div class="mj-graph-stats"><div><b id="mjg-score">0</b><small>points</small></div><div><b class="mj-graph-ammo" id="mjg-ammo"></b><small>tirs restants</small></div><div><b id="mjg-cib">0</b><small>cibles</small></div></div>
      <div class="mj-graph-msg" id="mjg-msg" aria-live="polite"></div>
      <ul class="mj-graph-hist" id="mjg-hist" aria-label="Tes tirs"></ul>
      <div class="mj-graph-tools"><button class="btn" type="button" id="mjg-new">Nouveau plateau</button><button class="btn" type="button" id="mjg-co" aria-pressed="false">Coordonnées des cibles</button></div>
      <div class="mj-graph-aides"><details id="mjg-how"><summary>Comment jouer</summary>
        <p>Écris <b>a</b> et <b>b</b>, puis appuie sur <b>Entrée</b> (ou sur « Feu ! »). Le tir suit la droite de <i>f</i>, de gauche à droite : il détruit toutes les cibles qu'il traverse et s'arrête au premier mur.</p>
        <p>La cible (<i>x</i> ; <i>y</i>) est touchée si <i>f</i>(<i>x</i>) = <i>y</i>, à 0,3 près. Plusieurs cibles d'un seul tir rapportent beaucoup plus : 1 cible = 100, 2 = 300, 3 = 600, 4 = 1 000 points.</p>
        <p>Passe la souris sur une cible pour lire ses coordonnées.</p></details>
      <details><summary>Aide : le rôle de a et b</summary><ul>
        <li><b>a</b> est le <b>coefficient directeur</b> : quand <i>x</i> augmente de 1, <i>y</i> augmente de a (si a est négatif, <i>y</i> diminue).</li>
        <li><b>b</b> est l'<b>ordonnée à l'origine</b> : la droite coupe l'axe des ordonnées au point (0 ; b).</li>
        <li>Pour savoir si la cible (<i>x</i> ; <i>y</i>) est sur la droite, calcule <i>f</i>(<i>x</i>) : tu dois trouver <i>y</i>.</li></ul></details></div>
    </aside></div>`;
  if(!MEM.vu){ $("#mjg-how").open=true; MEM.vu=1; sauver(); }
  $("#mjg-feu").onclick=feu;
  ["#mjg-a","#mjg-b"].forEach(s=>{ const e=$(s); e.addEventListener("keydown",ev=>{ if(ev.key==="Enter"){ ev.preventDefault(); feu(); } }); e.addEventListener("input",apercu); });
  $("#mjg-new").onclick=()=>{ if(!busy) nouvelle(niv); };
  const co=$("#mjg-co"); co.setAttribute("aria-pressed", MEM.co?"true":"false");
  co.onclick=()=>{ MEM.co=MEM.co?0:1; sauver(); co.setAttribute("aria-pressed", MEM.co?"true":"false"); dessiner(); };
  nouvelle(niv);
}
function ouvert(i){ return i===0 || !!(MEM.lv[i-1] && MEM.lv[i-1].st>0); }
function niveaux(){
  const box=$(".mj-graph-lvs");
  box.innerHTML=LV.map((c,i)=>{ const r=MEM.lv[i], st=r?r.st:0;
    return `<button type="button" data-i="${i}" ${i===niv?'aria-current="true"':""} ${ouvert(i)?"":"disabled"} title="Niveau ${i+1} : ${c.nom}${ouvert(i)?"":" (gagne le niveau précédent pour l'ouvrir)"}">${i+1}<small>${st?"★".repeat(st):""}</small></button>`; }).join("");
  box.querySelectorAll("button").forEach(b=>b.onclick=()=>{ if(!busy) nouvelle(+b.dataset.i); });
}
function nouvelle(i){
  cancelAnimationFrame(raf); busy=false;
  niv=i; MEM.cur=i; sauver();
  const C=LV[i], g=generer(i);
  J=Object.assign(g,{vivantes:g.cibles.slice(), tirs:[], score:0, fini:false, canon:posCanon(XMIN, 0, 0)});
  niveaux();
  $("#mjg-titre").textContent=`Niveau ${i+1} · ${C.nom}`;
  const r=MEM.lv[i]; $("#mjg-rec").textContent = r ? `Record : ${r.sc} points` : "";
  $("#mjg-bbox").style.display = C.lin ? "none" : "contents";
  $("#mjg-a").value=""; $("#mjg-b").value="0";
  msg(`<p>${C.aide}</p>`, "");
  $("#mjg-hist").innerHTML="";
  carte(`<h3>Niveau ${i+1} : ${C.nom}</h3><p>${C.aide}</p><p>Détruis les ${J.cibles.length} cibles avec ${plur(J.munitions,"tir")} au maximum. Objectif ★★★ : ${plur(J.par,"tir")} seulement.</p><button class="btn primary" type="button" data-go>C'est parti !</button>`);
  apercu(); stats(); dessiner();
}
function carte(html){
  const o=$(".mj-graph-over"); o.style.background=""; o.style.alignItems=""; o.innerHTML=`<div class="mj-graph-card">${html}</div>`; o.hidden=false;
  const go=o.querySelector("[data-go]"); if(go){ go.onclick=()=>{ o.hidden=true; $("#mjg-a").focus(); }; setTimeout(()=>{ if(R0 && R0.isConnected && !o.hidden) go.focus(); },30); }
  o.querySelectorAll("[data-niv]").forEach(b=>b.onclick=()=>nouvelle(+b.dataset.niv));
}
function msg(h,cl){ const m=$("#mjg-msg"); m.className="mj-graph-msg"+(cl?" "+cl:""); m.innerHTML=h; }
function stats(){
  $("#mjg-score").textContent=J.score;
  const reste=J.munitions-J.tirs.length;
  $("#mjg-ammo").innerHTML=Array.from({length:J.munitions},(_,k)=>`<i class="${k<reste?"":"v"}"></i>`).join("")+`<span class="mj-sr" style="position:absolute;left:-9999px">${reste}</span>`;
  $("#mjg-cib").textContent=J.vivantes.length;
}
function droiteSaisie(){
  const C=LV[niv], ra=lire($("#mjg-a").value), rb=C.lin?{q:Q(0),frac:false}:lire($("#mjg-b").value);
  return {ra, rb, L: (ra.q && rb.q) ? {a:ra.q, b:rb.q, fa:ra.frac, fb:rb.frac} : null};
}
function apercu(){
  const {L}=droiteSaisie();
  $("#mjg-prev").innerHTML = L ? `Ta droite : <b>${formule(L)}</b>` : `Écris a${LV[niv].lin?"":" et b"}, puis appuie sur Entrée.`;
}

/* ---------- dessin du plateau ---------- */
function dessiner(extra){
  const C=LV[niv]; let s="";
  if(C.demi) for(let v=XMIN; v<XMAX; v++){ s+=`<line class="q2" x1="${SX(v+.5)}" y1="0" x2="${SX(v+.5)}" y2="${H}"/>`; }
  if(C.demi) for(let v=YMIN; v<YMAX; v++){ s+=`<line class="q2" x1="0" y1="${SY(v+.5)}" x2="${W}" y2="${SY(v+.5)}"/>`; }
  for(let v=XMIN+1; v<XMAX; v++) s+=`<line class="q" x1="${SX(v)}" y1="0" x2="${SX(v)}" y2="${H}"/>`;
  for(let v=YMIN+1; v<YMAX; v++) s+=`<line class="q" x1="0" y1="${SY(v)}" x2="${W}" y2="${SY(v)}"/>`;
  s+=`<line class="ax" x1="0" y1="${SY(0)}" x2="${W}" y2="${SY(0)}"/><line class="ax" x1="${SX(0)}" y1="0" x2="${SX(0)}" y2="${H}"/>`;
  s+=`<path d="M${W-1} ${SY(0)}l-9 -5v10z" fill="#3b4762"/><path d="M${SX(0)} 1l-5 9h10z" fill="#3b4762"/>`;
  for(let v=XMIN+1; v<XMAX; v++) if(v) s+=`<text class="gr" x="${SX(v)}" y="${SY(0)+16}" text-anchor="middle">${String(v).replace("-",MOINS)}</text>`;
  for(let v=YMIN+1; v<YMAX; v++) if(v) s+=`<text class="gr" x="${SX(0)-6}" y="${SY(v)+4}" text-anchor="end">${String(v).replace("-",MOINS)}</text>`;
  s+=`<text class="gr" x="${SX(0)-6}" y="${SY(0)+16}" text-anchor="end">0</text>`;
  s+=`<text class="grb" x="${W-14}" y="${SY(0)-8}" text-anchor="end">x</text><text class="grb" x="${SX(0)+10}" y="16">y</text>`;
  /* anciens tirs */
  J.tirs.forEach((T,k)=>{ const p=T.seg; s+=`<line class="old${k===J.tirs.length-1?" last":""}" x1="${SX(p[0])}" y1="${SY(p[1])}" x2="${SX(p[2])}" y2="${SY(p[3])}"/>`; });
  /* murs */
  J.murs.forEach((w,k)=>{ const x=SX(w.fx1), y=SY(w.fy2), ww=(w.fx2-w.fx1)*U, hh=(w.fy2-w.fy1)*U; let br="";
    if(ww<hh) for(let yy=y+10; yy<y+hh-2; yy+=10) br+=`M${x+1} ${yy}h${ww-2}`;
    else for(let xx=x+16; xx<x+ww-2; xx+=16) br+=`M${xx} ${y+1}v${hh-2}`;
    s+=`<g class="mur" data-m="${k}"><rect class="m" x="${x}" y="${y}" width="${ww}" height="${hh}" rx="3"/><path d="${br}"/></g>`; });
  /* cibles */
  const r=RT*U;
  J.cibles.forEach(t=>{ if(!J.vivantes.includes(t)){ s+=`<circle class="ghost" cx="${SX(t.x)}" cy="${SY(t.y)}" r="${r}"/>`; return; }
    s+=`<g class="cib" data-id="${t.id}" tabindex="0" aria-label="cible ${co(t).replace(/<[^>]+>/g,"")}"><circle class="c1" cx="${SX(t.x)}" cy="${SY(t.y)}" r="${r}"/><circle class="c2" cx="${SX(t.x)}" cy="${SY(t.y)}" r="${r*.62}"/><circle class="c3" cx="${SX(t.x)}" cy="${SY(t.y)}" r="${r*.28}"/></g>`; });
  s+=`<g id="mjg-labs">${MEM.co?J.vivantes.map(etiq).join(""):""}</g>`;
  if(extra) s+=extra;
  s+=`<g id="mjg-fx"></g>`;
  const c=J.canon; s+=`<g class="canon" id="mjg-canon" style="transform:translate(${c.px}px,${c.py}px) rotate(${c.ang}deg)"><rect class="tube" x="0" y="-6" width="30" height="12" rx="3"/><circle class="base" r="12"/></g>`;
  const svg=$(".mj-graph-svg"); svg.innerHTML=s;
  svg.querySelectorAll(".cib").forEach(g=>{ const t=J.cibles.find(c=>c.id===g.dataset.id);
    const on=()=>{ if(!MEM.co) $("#mjg-labs").innerHTML=etiq(t); }, off=()=>{ if(!MEM.co) $("#mjg-labs").innerHTML=""; };
    g.addEventListener("mouseenter",on); g.addEventListener("mouseleave",off); g.addEventListener("focus",on); g.addEventListener("blur",off); });
}
function etiq(t){ const txt=`(${String(+t.x).replace("-",MOINS)} ; ${String(+t.y).replace("-",MOINS).replace(".",",")})`;
  const right=t.x<5.5, up=t.y<3.6; return `<text class="lab" x="${SX(t.x)+(right?15:-15)}" y="${SY(t.y)+(up?-13:24)}" text-anchor="${right?"start":"end"}">${txt}</text>`; }

/* ---------- le tir ---------- */
function feu(){
  if(busy || !J || J.fini) return;
  const o=$(".mj-graph-over"); if(!o.hidden){ const go=o.querySelector("[data-go]"); if(go) go.click(); else return; }
  const C=LV[niv], {ra, rb, L}=droiteSaisie();
  if(!L){ const e=!ra.q ? (ra.err==="vide"?"Écris d'abord le coefficient a.":"Pour a : "+ra.err) : (rb.err==="vide"?"Écris aussi b (0 si la droite passe par l'origine).":"Pour b : "+rb.err);
    msg(`<p>${e}</p>`,"ko"); (!ra.q?$("#mjg-a"):$("#mjg-b")).focus(); return; }
  if(qv(qabs(L.a))>20 || qv(qabs(L.b))>20){ msg(`<p>Ce nombre est trop grand : la droite sortirait aussitôt du repère. Essaie un nombre entre ${MOINS}20 et 20.</p>`,"ko"); return; }
  if(J.tirs.some(T=>qc(T.L.a,L.a)===0 && qc(T.L.b,L.b)===0)){ msg(`<p>Tu as déjà tiré la droite ${formule(L)}. Change a ou b !</p>`,"ko"); return; }
  const S=tir(L, J.vivantes, J.murs);
  if(!S){ msg(`<p>La droite de ${formule(L)} ne passe pas dans le repère : elle coupe l'axe des ordonnées au point (0 ; ${nb(L.b,L.fb)}), trop loin. Ce tir ne compte pas.</p>`,"ko"); return; }
  busy=true;
  const a=qv(L.a), b=qv(L.b), yAt=x=>a*x+b;
  J.canon=posCanon(S.x0, yAt(S.x0), -Math.atan(a));
  const T={L, seg:[S.x0,yAt(S.x0),S.x1,yAt(S.x1)], n:S.hits.length};
  const cn=$("#mjg-canon"); cn.style.transform=`translate(${J.canon.px}px,${J.canon.py}px) rotate(${J.canon.ang}deg)`;
  const fx=$("#mjg-fx"), ns="http://www.w3.org/2000/svg";
  const fin=()=>{ busy=false; resultat(L,S,T); };
  if(reduit()){ fin(); return; }
  const ray=document.createElementNS(ns,"line"), balle=document.createElementNS(ns,"circle");
  ray.setAttribute("class","ray"); balle.setAttribute("class","balle"); balle.setAttribute("r","6");
  ray.setAttribute("x1",SX(S.x0)); ray.setAttribute("y1",SY(yAt(S.x0)));
  const len=Math.hypot(S.x1-S.x0, yAt(S.x1)-yAt(S.x0)), D=450+55*len;
  let t0=0, faits=0;
  const step=now=>{
    if(!R0 || !R0.isConnected) return;
    if(!t0){ t0=now+330; fx.appendChild(ray); fx.appendChild(balle); }
    const p=Math.max(0,Math.min(1,(now-t0)/D)), x=S.x0+(S.x1-S.x0)*p, y=yAt(x);
    ray.setAttribute("x2",SX(x)); ray.setAttribute("y2",SY(y)); balle.setAttribute("cx",SX(x)); balle.setAttribute("cy",SY(y));
    while(faits<S.hits.length && S.hits[faits].x<=x){ boum(S.hits[faits].t, faits+1); faits++; }
    if(p<1){ raf=requestAnimationFrame(step); return; }
    if(S.mur){ const g=$(`.mur[data-m="${J.murs.indexOf(S.mur)}"]`); if(g) g.classList.add("flash"); eclats(SX(x),SY(y),"#8d7560",8); }
    setTimeout(()=>{ if(R0 && R0.isConnected) fin(); }, S.mur?380:180);
  };
  raf=requestAnimationFrame(step);
}
/* le canon est posé sur la droite, juste à l'intérieur du repère, tourné dans le sens du tir */
function posCanon(x,y,th){ let px=SX(x), py=SY(y); const c=Math.cos(th), s=Math.sin(th);
  for(let k=0;k<40 && (px<14 || py<14 || py>H-14); k++){ px+=2*c; py+=2*s; }
  return {px, py, ang:th*180/Math.PI}; }
function eclats(cx,cy,col,n){
  const fx=$("#mjg-fx"); let s="";
  for(let k=0;k<n;k++){ const an=Math.PI*2*k/n+Math.random()*.5, d=18+Math.random()*22;
    s+=`<circle class="pc" cx="${cx}" cy="${cy}" r="${3+Math.random()*3}" fill="${col}" style="--dx:${(Math.cos(an)*d).toFixed(1)}px;--dy:${(Math.sin(an)*d).toFixed(1)}px"/>`; }
  fx.insertAdjacentHTML("beforeend",s);
}
function boum(t,k){
  const g=R0.querySelector(`.cib[data-id="${t.id}"]`); if(g) g.style.display="none";
  eclats(SX(t.x),SY(t.y),"#e03131",10); eclats(SX(t.x),SY(t.y),"#f59f00",6);
  $("#mjg-fx").insertAdjacentHTML("beforeend",`<circle class="onde" cx="${SX(t.x)}" cy="${SY(t.y)}" r="${RT*U}"/>`+(k>1?`<text class="pts" x="${SX(t.x)}" y="${SY(t.y)-16}" text-anchor="middle">×${k}</text>`:""));
}
const GAIN = n => 50*n*(n+1);           /* 1 → 100, 2 → 300, 3 → 600, 4 → 1 000 */
function resultat(L,S,T){
  J.tirs.push(T);
  const n=S.hits.length, gain=GAIN(n), centre=S.hits.filter(h=>pleinCentre(L,h.t)).length;
  J.score+=gain+25*centre;
  J.vivantes=J.vivantes.filter(t=>!S.hits.some(h=>h.t===t));
  let h="";
  if(n){
    h+=`<p><b>${n>1?"Bravo ! "+n+" cibles d'un coup":"1 cible touchée"} : +${gain}${centre?` (+${25*centre} plein centre)`:""}</b></p>`;
    S.hits.slice(0,3).forEach(x=>{ const pc=pleinCentre(L,x.t);
      h+=`<p class="mj-graph-calc">${co(x.t)} : ${calcul(L,x.t)}${pc?" ✓":` (≠ ${nb(x.t.qy)} mais à 0,3 près : touchée)`}</p>`; });
    if(n>3) h+=`<p>… et ${plur(n-3,"autre cible")}.</p>`;
    if(S.mur) h+=`<p>Ensuite, le tir s'est arrêté sur un mur.</p>`;
  } else {
    h+=`<p><b>Raté !</b>${S.mur?" Le tir s'est arrêté sur un mur.":""}</p>`;
    if(S.mur && S.sansMur) h+=`<p>Sans ce mur, ta droite aurait touché ${plur(S.sansMur,"cible")}. Trouve un autre chemin !</p>`;
    else if(S.bords.length){ const t=S.bords[0];
      h+=`<p>Ton tir passe au bord de la cible ${co(t)} sans la toucher :</p><p class="mj-graph-calc">${calcul(L,t)}, trop loin de ${nb(t.qy)}.</p><p>Il faut obtenir ${nb(t.qy)}, à 0,3 près.</p>`; }
    else if(J.vivantes.length){
      /* la cible la plus proche (verticalement) : on compare f(x) et l'ordonnée de la cible */
      let best=null, bd=Infinity; J.vivantes.forEach(t=>{ const d=Math.abs(qv(f(L,t.qx))-t.y); if(d<bd){ bd=d; best=t; } });
      const y=f(L,best.qx), d=qs(y,best.qy), haut=d.n>0n;
      h+=`<p class="mj-graph-calc">Cible ${co(best)} : ${calcul(L,best)}.</p><p>Pour <i>x</i> = ${nb(best.qx)}, ta droite passe ${haut?"au-dessus":"en dessous"} de la cible (écart : ${nb(qabs(d), (L.fa||L.fb) && !estDec(d))}).</p>`;
    }
  }
  if(n) S.bords.slice(0,1).forEach(t=>{ h+=`<p>Ton tir passe aussi au bord de la cible ${co(t)} sans la toucher : ${calcul(L,t)}, trop loin de ${nb(t.qy)}.</p>`; });
  msg(h, n?"ok":"ko");
  const li=document.createElement("li"); li.innerHTML=`${formule(L)} → ${plur(n,"cible")}`; li.title=plur(n,"cible touchée","cibles touchées"); const hl=$("#mjg-hist"); hl.appendChild(li); while(hl.children.length>4) hl.firstChild.remove();
  stats(); dessiner();
  const reste=J.munitions-J.tirs.length;
  if(!J.vivantes.length) gagne();
  else if(reste<=0) perdu();
  else { const a=$("#mjg-a"); a.focus(); a.select(); }
}
function gagne(){
  J.fini=true;
  const used=J.tirs.length, reste=J.munitions-used, bonus=reste*150;
  J.score+=bonus; stats();
  const st = used<=J.par ? 3 : used===J.par+1 ? 2 : 1;
  const r=MEM.lv[niv]||{sc:0,st:0}, rec=J.score>r.sc;
  MEM.lv[niv]={sc:Math.max(r.sc,J.score), st:Math.max(r.st,st)}; sauver(); niveaux();
  $("#mjg-rec").textContent=`Record : ${MEM.lv[niv].sc} points`;
  const suiv=niv+1<LV.length;
  carte(`<h3>Plateau nettoyé !</h3><div class="stars" aria-label="${st} étoiles sur 3">${"★".repeat(st)}<span class="v">${"★".repeat(3-st)}</span></div>
    <p>${plur(used,"tir")} utilisé${used>1?"s":""} (objectif : ${J.par}).${reste?` Munitions restantes : +${bonus} points.`:""}</p>
    <p><b>Score : ${J.score} points</b>${rec?" · nouveau record !":""}</p>
    ${st<3?`<p>Pour ★★★, touche plus de cibles avec chaque droite.</p>`:""}
    <button class="btn" type="button" data-niv="${niv}">Rejouer</button>${suiv?`<button class="btn primary" type="button" data-niv="${niv+1}">Niveau suivant</button>`:`<p>Tu as fini tous les niveaux ! Rejoue pour battre tes records.</p>`}`);
  setTimeout(()=>{ const b=$(".mj-graph-over .btn.primary")||$(".mj-graph-over .btn"); if(b) b.focus(); },30);
}
function perdu(){
  J.fini=true;
  let ex="";
  J.sol.forEach(L=>{ const fen=fenetre(L), a=qv(L.a), b=qv(L.b);
    ex+=`<line class="sol" x1="${SX(fen[0])}" y1="${SY(a*fen[0]+b)}" x2="${SX(fen[1])}" y2="${SY(a*fen[1]+b)}"/>`; });
  dessiner(ex);
  const L2=J.sol.map(L=>Object.assign({},L,{fa:niv===6 || !estDec(L.a), fb:false}));
  carte(`<h3>Plus de munitions !</h3><p>Il restait ${plur(J.vivantes.length,"cible")}. Une solution, en vert :</p>
    <p>${L2.map(L=>`<b style="white-space:nowrap">${formule(L)}</b>`).join(" &nbsp; ")}</p>
    <button class="btn primary" type="button" data-niv="${niv}">Nouveau plateau</button>`);
  const o=$(".mj-graph-over"); o.style.background="rgba(251,252,255,.35)"; o.style.alignItems="end";
  setTimeout(()=>{ const b=$(".mj-graph-over .btn"); if(b) b.focus(); },30);
}
/* pour les tests automatiques */
return {init, _etat:()=>J, _t:{LV, generer, tir, touche, frole, pleinCentre, contactMur, lire, Q, qv, f, fenetre, formule, calcul}};
})();
