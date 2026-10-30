/* 3e — Chapitre 8 : Le théorème de Pythagore et sa réciproque, racines carrées
   Cours et fiche d'exercices de M. Staal (dossier « 9 - Théorème de Pythagore et sa réciproque - Racines carrées »).
   Les figures du cours et de la fiche sont celles de ses documents (img/3k8co, 3k8ex, 3k8cr).
   Les figures du QCM, de la fiche d'entraînement et de l'évaluation sont dessinées en SVG à partir des valeurs (outils window.PY3). */
(function(){
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const co=(p,alt,w)=>img("3k8co/"+p+".png",alt,w), ex=(p,alt,w)=>img("3k8ex/"+p+".png",alt,w), cr=(p,alt,w)=>img("3k8cr/"+p+".png",alt,w);
const fig=(cap,body)=>`<figure>${body}${cap?`<figcaption>${cap}</figcaption>`:""}</figure>`;
const ang=s=>`<span class="ang">${s}</span>`;
const rd=(x,k=3)=>Math.round(x*10**k+1e-9)/10**k;
/* écriture française : 1 000 · 14,9 · −2,5 */
const F=(x,k=3)=>{ const r=rd(x,k); const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
/* racine carrée écrite avec sa barre */
const rac=x=>`√<span style="border-top:1.5px solid currentColor;padding:0 2px">${x}</span>`;
const sq=x=>F(x)+"²";
const zp=(s,k)=>{ const [i,d=""]=s.split(","); return i+","+d.padEnd(k,"0"); };   /* 17 → 17,0 : écriture acceptée aussi pour un arrondi */

/* ------------------------------------------------------------------
   Petite géométrie (coordonnées en cm, y vers le haut) — même outil que les chapitres de 5e
------------------------------------------------------------------ */
const V={
  add:(a,b)=>[a[0]+b[0],a[1]+b[1]], sub:(a,b)=>[a[0]-b[0],a[1]-b[1]], mul:(a,k)=>[a[0]*k,a[1]*k],
  d:(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]), mid:(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2], dot:(a,b)=>a[0]*b[0]+a[1]*b[1],
  perp:u=>[-u[1],u[0]], unit:u=>{ const n=Math.hypot(u[0],u[1]); return [u[0]/n,u[1]/n]; },
  /* triangle de côtés BC = a, CA = b, AB = c : B(0 ; 0), C(a ; 0), A au-dessus */
  tri:(a,b,c)=>{ const x=(c*c-b*b+a*a)/(2*a); return {A:[x,Math.sqrt(Math.max(0,c*c-x*x))],B:[0,0],C:[a,0]}; },
  rot:(P,deg)=>{ const t=deg*Math.PI/180, c=Math.cos(t), s=Math.sin(t), o={}; Object.entries(P).forEach(([k,[x,y]])=>o[k]=[x*c-y*s,x*s+y*c]); return o; }
};
const ST={ln:"stroke:var(--ink);stroke-width:2.2", d:"stroke:#888;stroke-width:1.8;stroke-dasharray:6 5", b:"stroke:#1e5aa8;stroke-width:2.4", r:"stroke:#d0342c;stroke-width:2.6"};
function geo(o){
  const k=o.k||36, pad=o.pad??(o.len?62:34), P=o.P, g=a=>typeof a==="string"?P[a]:a;
  const all=[...Object.values(P), ...(o.box||[])];
  const mx=Math.min(...all.map(p=>p[0])), Mx=Math.max(...all.map(p=>p[0])), my=Math.min(...all.map(p=>p[1])), My=Math.max(...all.map(p=>p[1]));
  const X=x=>pad+(x-mx)*k, Y=y=>pad+(My-y)*k, f=v=>v.toFixed(1);
  const W=Math.round((Mx-mx)*k+2*pad), H=Math.round((My-my)*k+2*pad);
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${o.w?Math.min(o.w,W):W}" role="img" aria-label="${o.alt||"Figure de géométrie"}">`;
  const L=(a,b,t)=>`<line x1="${f(X(a[0]))}" y1="${f(Y(a[1]))}" x2="${f(X(b[0]))}" y2="${f(Y(b[1]))}" style="${ST[t||"ln"]};fill:none;stroke-linecap:round"/>`;
  (o.fill||[]).forEach(([N,col])=>{ s+=`<polygon points="${N.map(n=>f(X(g(n)[0]))+","+f(Y(g(n)[1]))).join(" ")}" style="fill:${col};stroke:none"/>`; });
  (o.poly||[]).forEach(N=>{ s+=`<polygon points="${N.map(n=>f(X(g(n)[0]))+","+f(Y(g(n)[1]))).join(" ")}" style="fill:none;${ST.ln};stroke-linejoin:round"/>`; });
  (o.seg||[]).forEach(([a,b,t])=>{ s+=L(g(a),g(b),t); });
  (o.right||[]).forEach(([v,a,b,col])=>{ const Vv=g(v), A=g(a), B=g(b), p=[X(Vv[0]),Y(Vv[1])];
    const da=V.unit([X(A[0])-p[0],Y(A[1])-p[1]]), db=V.unit([X(B[0])-p[0],Y(B[1])-p[1]]), z=11;
    s+=`<path d="M${f(p[0]+da[0]*z)} ${f(p[1]+da[1]*z)} L${f(p[0]+da[0]*z+db[0]*z)} ${f(p[1]+da[1]*z+db[1]*z)} L${f(p[0]+db[0]*z)} ${f(p[1]+db[1]*z)}" style="fill:none;stroke:${col||"#d0342c"};stroke-width:1.8"/>`; });
  (o.dots||[]).forEach(n=>{ const p=g(n); s+=`<circle cx="${f(X(p[0]))}" cy="${f(Y(p[1]))}" r="3.6" style="fill:var(--ink)"/>`; });
  const names=o.lab||Object.keys(P), cen=o.cen?g(o.cen):(()=>{ const T=o.poly&&o.poly[0]?o.poly[0].map(g):Object.values(P); return [T.reduce((a,p)=>a+p[0],0)/T.length, T.reduce((a,p)=>a+p[1],0)/T.length]; })();
  names.forEach(n=>{ const p=P[n]; let d=o.off&&o.off[n]; if(!d){ let u=[X(p[0])-X(cen[0]),Y(p[1])-Y(cen[1])]; if(Math.hypot(...u)<1) u=[0,-1]; u=V.unit(u); d=[u[0]*17,u[1]*17]; }
    s+=`<text x="${f(X(p[0])+d[0])}" y="${f(Y(p[1])+d[1]+6)}" text-anchor="middle" style="font-weight:700;font-size:17px;fill:var(--ink)">${n}</text>`; });
  (o.len||[]).forEach(([a,b,t,side])=>{ const A=g(a), B=g(b), m=[(X(A[0])+X(B[0]))/2,(Y(A[1])+Y(B[1]))/2]; let nrm=V.unit(V.perp([X(B[0])-X(A[0]),Y(B[1])-Y(A[1])]));
    const c=[X(cen[0]),Y(cen[1])]; if(V.dot(nrm,V.sub(m,c))<0) nrm=V.mul(nrm,-1); if(side) nrm=V.mul(nrm,-1);
    const tw=String(t).length*8.2, dd=13+Math.abs(nrm[0])*tw/2+Math.abs(nrm[1])*4, q=[m[0]+nrm[0]*dd, m[1]+nrm[1]*dd+5];
    s+=`<text x="${f(q[0])}" y="${f(q[1])}" text-anchor="middle" style="font-size:15px;font-weight:600;fill:var(--ink)">${t}</text>`; });
  (o.txt||[]).forEach(([t,p,dx=0,dy=0,col])=>{ const q=g(p); s+=`<text x="${f(X(q[0])+dx)}" y="${f(Y(q[1])+dy+5)}" text-anchor="middle" style="font-size:15px;font-weight:700;fill:${col||"var(--ink)"}">${t}</text>`; });
  return s+"</svg>";
}

/* triangle rectangle en R (nom n = [R, P, Q]) : RP = a, RQ = b ; lab = {"RP":"7 cm", …} longueurs écrites ; rot en degrés */
function rtFig(n, a, b, lab={}, rot, w=300){
  const [R,P,Q]=n; let pts={[R]:[0,0],[P]:[a,0],[Q]:[0,b]}; pts=V.rot(pts, rot??ri(-25,25));
  const len=Object.entries(lab).map(([s,t])=>[s[0],s[1],t]);
  return geo({P:pts, poly:[[R,P,Q]], right:[[R,P,Q]], len, k:kFit(pts,w), w, alt:`Triangle ${n.join("")} rectangle en ${R}`});
}
/* échelle pour que la figure fasse à peu près w pixels de large (le texte garde sa taille) */
function kFit(pts, w, pad=62){ const v=Object.values(pts), ex=Math.max(Math.max(...v.map(p=>p[0]))-Math.min(...v.map(p=>p[0])), 0.6*(Math.max(...v.map(p=>p[1]))-Math.min(...v.map(p=>p[1])))); return Math.min(70,(w-2*pad)/ex); }
/* triangle de côtés donnés (pour la réciproque) : n = [X, Y, Z], côtés YZ = a, XZ = b, XY = c */
function triFig(n, a, b, c, lab={}, w=300){
  const T=V.tri(a,b,c); let pts={[n[0]]:T.A,[n[1]]:T.B,[n[2]]:T.C}; pts=V.rot(pts, ri(-15,15));
  return geo({P:pts, poly:[n], len:Object.entries(lab).map(([s,t])=>[s[0],s[1],t]), k:kFit(pts,w), w, alt:`Triangle ${n.join("")}`});
}
/* triplets de Pythagore (côtés de l'angle droit, hypoténuse) */
const TRIP=[[3,4,5],[6,8,10],[5,12,13],[8,15,17],[7,24,25],[20,21,29],[9,12,15],[12,16,20],[9,40,41],[12,35,37],[15,20,25],[10,24,26]];
const NOMS=["ABC","DEF","MNP","RST","IJK","EFG","KLM","UVW","TOP","MER","LIN","GHI"];
window.PY3={V, geo, kFit, F, rd, rac, ang, rtFig, triFig, TRIP, NOMS, sq};

/* ===================== schémas ===================== */
const S_REC=sch("La réciproque du théorème de Pythagore", `${co("rec","Triangle ABC et les carrés construits sur ses côtés",150)}<p class="schN">[BC] est le plus grand côté. On calcule séparément BC² et AB² + AC².</p><p class="schN">Égaux : ABC est rectangle en A. Différents : ABC n'est pas rectangle.</p>`);
const S_TH=sch("Le théorème de Pythagore", `${co("th","Triangle ABC rectangle en A et les carrés construits sur ses côtés",150)}<p class="calc">ABC rectangle en A : BC² = AB² + AC²</p><p class="schN">L'hypoténuse [BC] est le plus grand côté : il est opposé à l'angle droit.</p>`);
const S_HYP=sch("Calculer l'hypoténuse", `<p class="calc">BC² = AB² + AC²<br>BC² = 7² + 6² = 49 + 36 = 85<br>BC = ${rac("85")} ≈ 9,2 cm</p><p class="schN">On additionne les carrés des deux côtés de l'angle droit, puis on prend la racine carrée.</p>`);
const S_COTE=sch("Calculer un côté de l'angle droit", `<p class="calc">EF² = EG² + FG²<br>FG² = EF² − EG²<br>FG² = 7² − 2,5² = 49 − 6,25 = 42,75<br>FG = ${rac("42,75")} ≈ 6,5 cm</p><p class="schN">On part du carré de l'hypoténuse et on <b>soustrait</b> le carré de l'autre côté.</p>`);

/* ---------- générateurs ---------- */
/* côtés « propres » d'un triangle rectangle : triplet × coefficient */
function rtSides(dec){ for(let g=0;g<500;g++){ const [a,b,c]=pick(TRIP); const k=dec?pick([0.2,0.3,0.4,0.5,0.6,0.8,1.2,1.5]):pick([1,1,2,3]);
    const s=[rd(a*k),rd(b*k),rd(c*k)]; if(s[0]>=1.5 && s[2]<=(dec?20:40)) return s; } return dec?[2.4,3.2,4]:[6,8,10]; }
/* triangle presque rectangle : on modifie le plus grand côté (il reste le plus grand, et le triangle existe) */
function notRt(dec){ for(let g=0;g<500;g++){ const [a,b,c]=rtSides(dec); const c2=rd(c+pick([-1,1])*(dec?ri(1,4)/10:ri(1,2))); if(c2>Math.max(a,b) && c2<a+b-0.5) return [a,b,c2]; } return dec?[2.4,3.2,4.1]:[6,8,11]; }
const NM=()=>pick(NOMS).split("");

CH["3e-8"] = {
intro:"Le théorème de Pythagore pour calculer une longueur dans un triangle rectangle, sa réciproque pour démontrer qu'un triangle est rectangle (ou non), et la racine carrée à la calculatrice.",
savoir:[
  "repérer l'hypoténuse d'un triangle rectangle (le plus grand côté, opposé à l'angle droit) ;",
  "démontrer qu'un triangle est rectangle ou non avec la réciproque du théorème de Pythagore ;",
  "calculer la longueur de l'hypoténuse avec le théorème de Pythagore ;",
  "calculer la longueur d'un côté de l'angle droit avec le théorème de Pythagore ;",
  "utiliser la racine carrée à la calculatrice et donner un arrondi ;",
  "résoudre des problèmes concrets avec le théorème de Pythagore ou sa réciproque."
],

/* ===================== COURS ===================== */
cours:[
{k:"1", t:"Démontrer qu'un triangle est rectangle ou non", h:`
  <div class="retenir" data-l="Propriété : réciproque du théorème de Pythagore"><p>On considère un triangle ABC, avec [BC] le plus grand côté du triangle.</p>
   <ul><li>Si <b>AB² + AC² = BC²</b>, alors <b>ABC est un triangle rectangle en A</b>.</li><li>Si <b>AB² + AC² ≠ BC²</b>, alors <b>ABC n'est pas rectangle</b>.</li></ul></div>
  ${co("rec","Triangle ABC : est-il rectangle en A ? Les carrés construits sur ses côtés",170)}
  <h4>Exemple 1 : le triangle MER est-il rectangle ?</h4>
  ${co("mer","Triangle MER : MR = 12 m, RE = 16 m, ME = 20 m",280)}
  <p>Dans le triangle MER, le plus grand côté est [ME].</p>
  <div class="figs"><p class="calc">ME² = 20²<br>ME² = 400</p><p class="calc">MR² + RE² = 12² + 16²<br>MR² + RE² = 144 + 256<br>MR² + RE² = 400</p></div>
  <p>On remarque que ME² = MR² + RE².</p>
  <p>L'égalité de Pythagore est vérifiée, donc le triangle MER est <b>rectangle en R</b>.</p>
  <h4>Exemple 2 : le triangle TOP est-il rectangle ?</h4>
  ${co("top","Triangle TOP : TP = 8 cm, PO = 4,5 cm, TO = 9,2 cm",280)}
  <p>Dans le triangle TPO, le plus grand côté est [TO].</p>
  <div class="figs"><p class="calc">TO² = 9,2²<br>TO² = 84,64</p><p class="calc">TP² + PO² = 8² + 4,5²<br>TP² + PO² = 64 + 20,25<br>TP² + PO² = 84,25</p></div>
  <p>On remarque que TO² ≠ TP² + PO².</p>
  <p>L'égalité de Pythagore n'est pas vérifiée, donc le triangle TPO <b>n'est pas rectangle</b>.</p>`},
{k:"2", t:"Calculer la longueur d'un côté d'un triangle rectangle", h:`
  <div class="retenir" data-l="Propriété : théorème de Pythagore"><p>Si <b>ABC est un triangle rectangle en A</b>,</p><p>alors <b>BC² = AC² + AB²</b>.</p></div>
  ${co("th","Triangle ABC rectangle en A et les carrés construits sur ses côtés",190)}
  <div class="retenir" data-l="Remarque"><p>L'<b>hypoténuse</b> d'un triangle rectangle est le plus grand côté : il est opposé à l'angle droit.</p></div>
  <h4>Exemple 1 : calculer la longueur de l'hypoténuse</h4>
  ${co("abc","Triangle ABC rectangle en A : AB = 7 cm, AC = 6 cm",260)}
  <p><b>Calcule la longueur BC.</b></p>
  <p>On a un triangle ABC rectangle en A. D'après le théorème de Pythagore, on peut écrire :</p>
  <p class="calc">BC² = AB² + AC²<br>BC² = 7² + 6²<br>BC² = 49 + 36<br>BC² = 85<br>BC = ${rac("85")}<br>BC ≈ 9,2</p>
  <p>L'hypoténuse [BC] mesure environ <b>9,2 cm</b>.</p>
  <div class="attention"><b>Sur la calculatrice :</b> pour obtenir ${rac("85")}, on utilise la touche √ (avec la touche SECONDE sur certaines calculatrices).</div>
  <h4>Exemple 2 : calculer la longueur d'un autre côté</h4>
  ${co("efg","Triangle EFG rectangle en G : EF = 7 cm, EG = 2,5 cm",190)}
  <p><b>Calcule la longueur FG.</b></p>
  <p>Dans le triangle EFG rectangle en G, on peut écrire l'égalité de Pythagore :</p>
  <p class="calc">EF² = EG² + FG²<br>FG² = EF² − EG²<br>FG² = 7² − 2,5²<br>FG² = 49 − 6,25<br>FG² = 42,75<br>FG = ${rac("42,75")}<br>FG ≈ 6,5</p>
  <p>La longueur FG est égale à environ <b>6,5 cm</b>.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Démontrer qu'un triangle est rectangle ou non", e:[
  {n:"Activité 1", t:"Prouver qu'un triangle est rectangle ou non", w:"Sur ton cahier", h:`<div class="figs">${fig("a) Le triangle EFG est-il rectangle ? Justifie.",ex("a1a","Triangle EFG : GE = 9,6 cm, EF = 4 cm, GF = 10,4 cm",170))}${fig("b) Le triangle OEA est-il rectangle ? Justifie.",ex("a1b","Triangle OEA : OE = 10 cm, EA = 7,8 cm, OA = 6,6 cm",170))}</div>`,
   c:`<div class="figs">${fig("a)",cr("a1a","Carrés construits sur les côtés du triangle EFG",260))}${fig("b)",cr("a1b","Carrés construits sur les côtés du triangle OEA",240))}</div>
   <p><b>a)</b> Le plus grand côté est [GF].</p><div class="figs"><p class="calc">GF² = 10,4²<br>GF² = 108,16</p><p class="calc">GE² + EF² = 9,6² + 4²<br>GE² + EF² = 92,16 + 16<br>GE² + EF² = 108,16</p></div><p>GF² = GE² + EF² : l'égalité de Pythagore est vérifiée, donc <b>EFG est rectangle en E</b>.</p>
   <p><b>b)</b> Le plus grand côté est [OE].</p><div class="figs"><p class="calc">OE² = 10²<br>OE² = 100</p><p class="calc">EA² + OA² = 7,8² + 6,6²<br>EA² + OA² = 60,84 + 43,56<br>EA² + OA² = 104,4</p></div><p>OE² ≠ EA² + OA² : l'égalité de Pythagore n'est pas vérifiée, donc <b>OEA n'est pas rectangle</b>.</p>`},
  {n:"Exercice 1", t:"Deux murs perpendiculaires ?", w:"Sur ton cahier", h:`${ex("e1","Photo : les deux murs autour de la piscine, avec les points M, U et R",340)}
   <p>Nathan a construit un mur autour de sa piscine.</p><p>Un ami est venu voir son travail et lui dit : « Je pense que tes murs ne sont pas perpendiculaires. »</p>
   <p>Pour vérifier qui a raison, ils mesurent les segments [MU], [UR] et [MR] :</p><p>MU = 96 cm, UR = 80 cm et MR = 120 cm.</p><p>Qui a raison ?</p>`,
   c:`<p>Dans le triangle MUR, le plus grand côté est [MR].</p><div class="figs"><p class="calc">MR² = 120²<br>MR² = 14 400</p><p class="calc">MU² + UR² = 96² + 80²<br>MU² + UR² = 9 216 + 6 400<br>MU² + UR² = 15 616</p></div>
   <p>MR² ≠ MU² + UR² : l'égalité de Pythagore n'est pas vérifiée, donc le triangle MUR n'est pas rectangle.</p><p>L'angle ${ang("MUR")} n'est pas droit : les murs ne sont pas perpendiculaires. <b>C'est l'ami qui a raison.</b></p>`},
  {n:"Exercice 2", t:"Installation d'une étagère", w:"Sur ton cahier", h:`${ex("e2","Mur vertical, étagère [ET] de 36 cm, support [AT] de 45 cm, EA = 27 cm",200)}
   <p>Sur un mur vertical, Jules a posé une étagère.</p><p>On a ET = 36 cm, EA = 27 cm et AT = 45 cm.</p><p>L'étagère est-elle horizontale ?</p>`,
   c:`<p>Dans le triangle AET, le plus grand côté est [AT].</p><div class="figs"><p class="calc">AT² = 45²<br>AT² = 2 025</p><p class="calc">EA² + ET² = 27² + 36²<br>EA² + ET² = 729 + 1 296<br>EA² + ET² = 2 025</p></div>
   <p>AT² = EA² + ET² : l'égalité de Pythagore est vérifiée, donc le triangle AET est rectangle en E.</p><p>L'étagère [ET] est perpendiculaire au mur, qui est vertical : <b>l'étagère est horizontale</b>.</p>`},
  {n:"Exercice 3", t:"Triangles rectangles ?", w:"Sur ton cahier", h:`<p><b>a)</b> On considère le triangle ABC tel que : AB = 10,8 cm, BC = 14,4 cm et AC = 18 cm.</p><p><b>b)</b> On considère le triangle STU tel que : TU = 20,9 m, SU = 24,1 m et ST = 12 m.</p><p>Ces triangles sont-ils rectangles ? Justifie.</p>`,
   c:`<p><b>a)</b> Le plus grand côté est [AC].</p><div class="figs"><p class="calc">AC² = 18²<br>AC² = 324</p><p class="calc">AB² + BC² = 10,8² + 14,4²<br>AB² + BC² = 116,64 + 207,36<br>AB² + BC² = 324</p></div><p>AC² = AB² + BC², donc <b>ABC est rectangle en B</b>.</p>
   <p><b>b)</b> Le plus grand côté est [SU].</p><div class="figs"><p class="calc">SU² = 24,1²<br>SU² = 580,81</p><p class="calc">TU² + ST² = 20,9² + 12²<br>TU² + ST² = 436,81 + 144<br>TU² + ST² = 580,81</p></div><p>SU² = TU² + ST², donc <b>STU est rectangle en T</b>.</p>`}
 ]},
{t:"Calculer la longueur d'un côté d'un triangle rectangle", e:[
  {n:"Activité rapide", t:"Calculer la longueur d'un côté d'un triangle rectangle", w:"Sur ton cahier", h:`<p>Dans ces deux triangles, calcule la longueur du côté manquant.</p><p>Donne l'arrondi au dixième.</p>
   <div class="figs">${fig("1. Triangle ESM rectangle en S",ex("ar1","Triangle ESM rectangle en S : ES = 30 m, SM = 36 m",210))}${fig("2. Triangle KNL rectangle en N",ex("ar2","Triangle KNL rectangle en N : KL = 8,6 cm, NL = 4 cm",210))}</div>`,
   c:`<p><b>1.</b> Le triangle ESM est rectangle en S. D'après le théorème de Pythagore :</p><p class="calc">EM² = ES² + SM²<br>EM² = 30² + 36²<br>EM² = 900 + 1 296<br>EM² = 2 196<br>EM = ${rac("2 196")}<br>EM ≈ 46,9</p><p>EM mesure environ <b>46,9 m</b>.</p>
   <p><b>2.</b> Le triangle KNL est rectangle en N. L'hypoténuse est [KL] :</p><p class="calc">KL² = KN² + NL²<br>KN² = KL² − NL²<br>KN² = 8,6² − 4²<br>KN² = 73,96 − 16<br>KN² = 57,96<br>KN = ${rac("57,96")}<br>KN ≈ 7,6</p><p>KN mesure environ <b>7,6 cm</b>.</p>`},
  {n:"Activité 2", t:"Calculer la longueur d'un côté dans un triangle rectangle", w:"Sur ton cahier", h:`<p><b>Problème 1 : Taille d'une télévision</b></p>${ex("a2p1","Télévision ABCD : AD = 32,5 cm et DC = 57,6 cm",240)}
   <p>La taille d'une télévision correspond à la longueur de la diagonale de l'écran.</p><p>Détermine la taille de cette télévision.</p>
   <p><b>Problème 2 : Hauteur de la voile</b></p>${ex("a2p2","Voilier : la voile MAT est un triangle rectangle en A",200)}
   <p>La voile MAT de ce bateau peut être assimilée à un triangle rectangle en A, tel que : MT = 3,4 m et MA = 1,6 m.</p><p>Calcule la hauteur [AT] de cette voile.</p>`,
   c:`<p><b>Problème 1 :</b> on a un triangle ADC rectangle en D. D'après le théorème de Pythagore, on peut écrire :</p><p class="calc">AC² = AD² + DC²<br>AC² = 32,5² + 57,6²<br>AC² = 1 056,25 + 3 317,76<br>AC² = 4 374,01<br>AC = ${rac("4 374,01")}<br>AC ≈ 66 cm</p><p>La taille de la télévision est d'environ <b>66 cm</b>.</p>
   <p><b>Problème 2 :</b> on a un triangle MAT rectangle en A. D'après le théorème de Pythagore, on peut écrire :</p><p class="calc">MT² = AT² + MA²<br>3,4² = AT² + 1,6²<br>11,56 = AT² + 2,56<br>AT² = 11,56 − 2,56<br>AT² = 9<br>AT = ${rac("9")}<br>AT = 3 m</p><p>La hauteur de la voile est de <b>3 m</b>.</p>`},
  {n:"Exercice 4", t:"Le fusil sous-marin (Brevet Nouvelle-Calédonie, décembre 2017)", w:"Sur ton cahier", h:`<p>On dispose des informations suivantes :</p>${ex("e4","Dimensions de la remorque : 1 800 mm sur 1 350 mm ; longueur du fusil sous-marin : 2 100 mm",420)}
   <p>Toutes les valeurs présentes sur les schémas sont en millimètres.</p><p>Le fond de la remorque est un rectangle.</p><p>Le fusil sous-marin peut-il être placé « à plat » dans la remorque ? Justifie ta réponse.</p>`,
   c:`<p>Le fusil le plus long possible « à plat » se place sur une diagonale du fond de la remorque.</p><p>Le fond est un rectangle : la diagonale d est l'hypoténuse d'un triangle rectangle de côtés 1 800 mm et 1 350 mm. D'après le théorème de Pythagore :</p>
   <p class="calc">d² = 1 800² + 1 350²<br>d² = 3 240 000 + 1 822 500<br>d² = 5 062 500<br>d = ${rac("5 062 500")}<br>d = 2 250 mm</p><p>2 250 mm &gt; 2 100 mm : <b>oui, le fusil peut être placé à plat</b> dans la remorque (en diagonale).</p>`},
  {n:"Exercice 5", t:"Rampe d'accès", w:"Sur ton cahier", h:`${ex("e5","Panneau : rampe d'accès pour les personnes à mobilité réduite",120)}
   <p>Une rampe d'accès pour les personnes à mobilité réduite mesure 2,50 m de long.</p><p>La porte d'accès est située à 0,80 m du sol.</p><p>De quelle longueur doit-on disposer, au sol, pour pouvoir poser cette rampe ?</p>`,
   c:`<p>Le sol et le mur sont perpendiculaires : la rampe (2,50 m), la hauteur (0,80 m) et la longueur au sol x forment un triangle rectangle dont l'hypoténuse est la rampe.</p><p>D'après le théorème de Pythagore :</p>
   <p class="calc">2,5² = 0,8² + x²<br>x² = 2,5² − 0,8²<br>x² = 6,25 − 0,64<br>x² = 5,61<br>x = ${rac("5,61")}<br>x ≈ 2,37 m</p><p>Il faut disposer d'environ <b>2,37 m</b> au sol.</p>`},
  {n:"Exercice 6", t:"Une tour", w:"Sur ton cahier", h:`<div class="figs">${ex("e6","Photo de la tour et schéma : cylindre de rayon 2,5 m et de hauteur 10 m, surmonté d'un cône de génératrice 4 m",240)}</div>
   <p>Cette tour cylindrique est surmontée d'un toit conique.</p><p><b>a)</b> Vérifie que le toit conique de cette tour a un volume total d'environ 20,42 m³.</p><p><b>b)</b> Calcule le volume total, en m³, de cette tour. Donne un arrondi au centième près.</p>`,
   c:`<p><b>a)</b> Il faut d'abord la hauteur h du cône. Le rayon (2,5 m), la hauteur h et la génératrice (4 m) forment un triangle rectangle dont l'hypoténuse est la génératrice :</p>
   <p class="calc">4² = 2,5² + h²<br>h² = 16 − 6,25<br>h² = 9,75<br>h = ${rac("9,75")} ≈ 3,12 m</p>
   <p class="calc">V<sub>cône</sub> = {π × r² × h/3}<br>V<sub>cône</sub> ≈ {π × 2,5² × 3,12/3}<br>V<sub>cône</sub> ≈ 20,42 m³</p>
   <p>Remarque : avec la valeur exacte h = ${rac("9,75")}, on trouve V<sub>cône</sub> ≈ 20,44 m³.</p>
   <p><b>b)</b></p><p class="calc">V<sub>cylindre</sub> = π × r² × h<br>V<sub>cylindre</sub> = π × 2,5² × 10<br>V<sub>cylindre</sub> = 62,5π<br>V<sub>cylindre</sub> ≈ 196,35 m³</p><p class="calc">V<sub>total</sub> ≈ 196,35 + 20,42<br>V<sub>total</sub> ≈ 216,77 m³</p><p>Le volume total de la tour est d'environ <b>216,77 m³</b> (216,79 m³ avec la valeur exacte de h).</p>`},
  {n:"Exercice 7", t:"Abri de jardin", w:"Sur ton cahier", h:`<p>Mme Dubois vient de faire construire un abri dans son jardin comme sur la photo.</p>${ex("e7","Photo de l'appentis : hauteur 5,70 m contre le mur, 2,80 m à l'avant, profondeur 4,50 m, longueur 6 m",420)}
   <p>Elle souhaite maintenant recouvrir le toit de shingles (couvertures en bitume pour abri) vendus 9,30 € le m².</p>
   <p><b>a)</b> Montre que le toit de l'appentis a une surface de 32,1 m².</p><p><b>b)</b> Quelle somme Mme Dubois devra-t-elle dépenser pour recouvrir son abri ?</p>`,
   c:`<p><b>a)</b> Le toit est un rectangle de longueur 6 m. Sa largeur ℓ est l'hypoténuse d'un triangle rectangle :</p><ul><li>côté vertical : 5,70 − 2,80 = 2,90 m ;</li><li>côté horizontal : 4,50 m.</li></ul>
   <p class="calc">ℓ² = 2,9² + 4,5²<br>ℓ² = 8,41 + 20,25<br>ℓ² = 28,66<br>ℓ = ${rac("28,66")} ≈ 5,35 m</p><p>Aire A du toit :</p><p class="calc">A = 6 × ${rac("28,66")}<br>A ≈ 32,1 m²</p>
   <p class="calc"><b>b)</b> 32,1 × 9,30 = 298,53 €</p><p>Mme Dubois devra dépenser environ <b>298,53 €</b>.</p>`},
  {n:"Exercice 8", t:"Calculer le côté manquant", w:"Sur ton cahier", h:`<p>Dans chacun de ces triangles, calcule la longueur du côté manquant.</p>
   <div class="figs">${fig("a. JMX rectangle en M : calcule JX.",ex("e8a","Triangle JMX rectangle en M : JM = 4,2 et MX = 5,6",200))}${fig("b. PIF rectangle en I : calcule PI.",ex("e8b","Triangle PIF rectangle en I : IF = 4,2 cm et PF = 5,8 cm",200))}</div>
   <p><b>c.</b> LIN est un triangle rectangle en L tel que : IL = 2,8 cm et LN = 9,6 cm.</p><p><b>d.</b> TER est un triangle rectangle en R tel que : ER = 4,8 cm et TE = 5,2 cm.</p>`,
   c:`<p><b>a.</b> JMX est rectangle en M : l'hypoténuse est [JX]. D'après le théorème de Pythagore :</p><p class="calc">JX² = JM² + MX²<br>JX² = 4,2² + 5,6²<br>JX² = 17,64 + 31,36<br>JX² = 49<br>JX = ${rac("49")}<br>JX = 7</p><p>JX mesure <b>7</b>.</p>
   <p><b>b.</b> PIF est rectangle en I : l'hypoténuse est [PF]. D'après le théorème de Pythagore :</p><p class="calc">PF² = PI² + IF²<br>PI² = PF² − IF²<br>PI² = 5,8² − 4,2²<br>PI² = 33,64 − 17,64<br>PI² = 16<br>PI = ${rac("16")}<br>PI = 4</p><p>PI mesure <b>4 cm</b>.</p>
   <p><b>c.</b> LIN est rectangle en L : l'hypoténuse est [IN]. D'après le théorème de Pythagore :</p><p class="calc">IN² = IL² + LN²<br>IN² = 2,8² + 9,6²<br>IN² = 7,84 + 92,16<br>IN² = 100<br>IN = ${rac("100")}<br>IN = 10</p><p>IN mesure <b>10 cm</b>.</p>
   <p><b>d.</b> TER est rectangle en R : l'hypoténuse est [TE]. D'après le théorème de Pythagore :</p><p class="calc">TE² = TR² + ER²<br>TR² = TE² − ER²<br>TR² = 5,2² − 4,8²<br>TR² = 27,04 − 23,04<br>TR² = 4<br>TR = ${rac("4")}<br>TR = 2</p><p>TR mesure <b>2 cm</b>.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"La réciproque du théorème de Pythagore", schema:S_REC, q:{
 1:[ {g:()=>{ const [x,y,z]=NM(); const s=shuf(rtSides(false)); const sides={[x+y]:s[0],[y+z]:s[1],[x+z]:s[2]}; const big=Object.keys(sides).reduce((a,b)=>sides[a]>sides[b]?a:b);
       return {q:`Dans le triangle ${x}${y}${z} : ${x}${y} = ${F(s[0])} cm, ${y}${z} = ${F(s[1])} cm et ${x}${z} = ${F(s[2])} cm. Quel est le plus grand côté ?`, c:[`[${x}${y}]`,`[${y}${z}]`,`[${x}${z}]`], rep:`[${big}]`, ex:`${F(sides[big])} cm est la plus grande longueur : c'est [${big}]. C'est son carré que l'on compare à la somme des deux autres carrés.`, sx:S_REC}; }},
     {q:"[BC] est le plus grand côté du triangle ABC. Pour savoir si ABC est rectangle, on compare BC² à…", c:["AB² + AC²","AB + AC","AB² × AC²"], rep:"AB² + AC²", ex:"Si AB² + AC² = BC², ABC est rectangle en A ; sinon il n'est pas rectangle.", sx:S_REC} ],
 2:[ {g:()=>{ const [x,y,z]=NM(); const ok=Math.random()<0.5, [a,b,c]=ok?rtSides(false):notRt(false);
       const c2=rd(c*c), s2=rd(a*a+b*b);
       return {q:`Dans le triangle ${x}${y}${z} : ${x}${y} = ${F(a)} cm, ${x}${z} = ${F(b)} cm et ${y}${z} = ${F(c)} cm. Ce triangle est-il rectangle ?`, c:[`Oui, rectangle en ${x}`,`Oui, rectangle en ${y}`,"Non, il n'est pas rectangle"], rep:ok?`Oui, rectangle en ${x}`:"Non, il n'est pas rectangle",
         ex:`Le plus grand côté est [${y}${z}] : ${y}${z}² = ${sq(c)} = ${F(c2)} et ${x}${y}² + ${x}${z}² = ${sq(a)} + ${sq(b)} = ${F(s2)}. ${ok?`Égalité vérifiée : rectangle en ${x}, le sommet opposé au plus grand côté.`:"Les deux résultats sont différents : le triangle n'est pas rectangle."}`, sx:S_REC}; }} ],
 3:[ {g:()=>{ const [x,y,z]=NM(); const ok=Math.random()<0.5, [a,b,c]=ok?rtSides(true):notRt(true); const S=shuf([[x+y,a],[x+z,b],[y+z,c]]);
       const c2=rd(c*c), s2=rd(a*a+b*b);
       return {q:`Le triangle ${x}${y}${z} est tel que ${S.map(([n,v])=>`${n} = ${F(v)} cm`).join(", ")}. Est-il rectangle ?`, c:[`Oui, rectangle en ${x}`,`Oui, rectangle en ${y}`,`Oui, rectangle en ${z}`,"Non"], rep:ok?`Oui, rectangle en ${x}`:"Non",
         ex:`Plus grand côté : [${y}${z}]. ${y}${z}² = ${F(c2)} ; ${x}${y}² + ${x}${z}² = ${F(a*a)} + ${F(b*b)} = ${F(s2)}. ${ok?`Égalité : rectangle en ${x}.`:"Résultats différents : pas rectangle."}`, sx:S_REC}; }} ]
}},
{nom:"L'égalité de Pythagore", schema:S_TH, q:{
 1:[ {g:()=>{ const [x,y,z]=NM(); return {q:`Le triangle ${x}${y}${z} est rectangle en ${y}. Quelle est son hypoténuse ?`, c:[`[${x}${z}]`,`[${x}${y}]`,`[${y}${z}]`], rep:`[${x}${z}]`, ex:`L'hypoténuse est le côté opposé à l'angle droit ${ang(x+y+z)}.`, sx:S_TH}; }},
     {q:"Dans un triangle rectangle, l'hypoténuse est…", c:["le plus grand côté","le plus petit côté","un côté de l'angle droit"], rep:"le plus grand côté", ex:"Elle est opposée à l'angle droit : c'est toujours le plus grand côté.", sx:S_TH} ],
 2:[ {g:()=>{ const [x,y,z]=NM(); return {q:`Le triangle ${x}${y}${z} est rectangle en ${x}. Quelle égalité peut-on écrire ?`, c:[`${y}${z}² = ${x}${y}² + ${x}${z}²`,`${x}${y}² = ${x}${z}² + ${y}${z}²`,`${x}${z}² = ${x}${y}² + ${y}${z}²`], rep:`${y}${z}² = ${x}${y}² + ${x}${z}²`, ex:`L'hypoténuse est [${y}${z}], opposée à l'angle droit en ${x} : son carré est la somme des deux autres carrés.`, sx:S_TH}; }} ],
 3:[ {g:()=>{ const [x,y,z]=NM(); const f=rtFig([z,x,y], ri(30,45)/10, ri(20,32)/10, {}, ri(-30,30), 200);
       return {q:`Le triangle ${x}${y}${z} est rectangle (voir le codage). On veut calculer ${x}${z}. Quelle égalité utiliser ?`, fig:f, c:[`${x}${z}² = ${x}${y}² − ${y}${z}²`,`${x}${z}² = ${x}${y}² + ${y}${z}²`,`${x}${z}² = ${y}${z}² − ${x}${y}²`], rep:`${x}${z}² = ${x}${y}² − ${y}${z}²`,
         ex:`L'angle droit est en ${z} : l'hypoténuse est [${x}${y}]. ${x}${y}² = ${x}${z}² + ${y}${z}², donc ${x}${z}² = ${x}${y}² − ${y}${z}².`, sx:S_COTE}; }} ]
}},
{nom:"Calculer l'hypoténuse", schema:S_HYP, q:{
 1:[ {g:()=>{ const [x,y,z]=NM(); const [a,b,c]=rtSides(false); return {q:`${x}${y}${z} est rectangle en ${x}, ${x}${y} = ${a} cm et ${x}${z} = ${b} cm. Calcule ${y}${z} (en cm).`, rep:[F(c),F(c)+" cm"], ex:`${y}${z}² = ${a}² + ${b}² = ${F(a*a)} + ${F(b*b)} = ${F(c*c)}, donc ${y}${z} = ${rac(F(c*c))} = ${c} cm.`, sx:S_HYP}; }},
     {q:`BC² = 49. Combien vaut BC ?`, c:["7","24,5","2 401"], rep:"7", ex:`BC = ${rac("49")} = 7, car 7² = 49.`, sx:S_HYP} ],
 2:[ {g:()=>{ const [x,y,z]=NM(); let a,b; do{ a=ri(2,12); b=ri(2,12); }while(Number.isInteger(Math.sqrt(a*a+b*b))); const s=a*a+b*b, r=Math.sqrt(s);
       return {q:`${x}${y}${z} est rectangle en ${x}, ${x}${y} = ${a} cm et ${x}${z} = ${b} cm. Calcule ${y}${z}, arrondi au dixième (en cm).`, rep:[F(r,1),F(r,1)+" cm",zp(F(r,1),1),zp(F(r,1),1)+" cm"], ex:`${y}${z}² = ${a}² + ${b}² = ${a*a} + ${b*b} = ${s}, donc ${y}${z} = ${rac(s)} ≈ ${F(r,1)} cm.`, sx:S_HYP}; }},
     {g:()=>{ const s=pick([85,52,40,29,61,74,90,13,20,45]); return {q:`BC² = ${s}. Quelle est la valeur exacte de BC ?`, c:uniq(rac(s),[F(s/2),sq(s),rac(F(s/2))]), rep:rac(s), ex:`BC est le nombre positif dont le carré vaut ${s} : BC = ${rac(s)} ≈ ${F(Math.sqrt(s),1)}.`, sx:S_HYP}; }} ],
 3:[ {g:()=>{ const [x,y,z]=NM(); let a,b; do{ a=ri(15,70)/10; b=ri(15,70)/10; }while(Math.abs(a-b)<0.4); const s=rd(a*a+b*b), r=Math.sqrt(s);
       return {q:`Calcule ${y}${z}, arrondi au dixième (en cm).`, fig:rtFig([x,y,z],a,b,{[x+y]:F(a)+" cm",[x+z]:F(b)+" cm"}), rep:[F(r,1),F(r,1)+" cm",zp(F(r,1),1),zp(F(r,1),1)+" cm"], ex:`${x}${y}${z} est rectangle en ${x} : ${y}${z}² = ${sq(a)} + ${sq(b)} = ${F(a*a)} + ${F(b*b)} = ${F(s)}, donc ${y}${z} = ${rac(F(s))} ≈ ${F(r,1)} cm.`, sx:S_HYP}; }},
     {g:()=>{ const a=ri(30,70)*10, b=ri(15,50)*10, d=Math.sqrt(a*a+b*b); return {q:`Un écran rectangulaire mesure ${a} mm sur ${b} mm. Quelle est la longueur de sa diagonale, arrondie au millimètre (en mm) ?`, rep:[F(d,0),F(d,0)+" mm"], ex:`La diagonale est l'hypoténuse : d² = ${F(a)}² + ${F(b)}² = ${F(a*a+b*b)}, donc d = ${rac(F(a*a+b*b))} ≈ ${F(d,0)} mm.`, sx:S_HYP}; }} ]
}},
{nom:"Calculer un côté de l'angle droit", schema:S_COTE, q:{
 1:[ {g:()=>{ const [x,y,z]=NM(); const [a,b,c]=rtSides(false); return {q:`${x}${y}${z} est rectangle en ${x}, ${y}${z} = ${c} cm et ${x}${y} = ${a} cm. Calcule ${x}${z} (en cm).`, rep:[F(b),F(b)+" cm"], ex:`${x}${z}² = ${y}${z}² − ${x}${y}² = ${c}² − ${a}² = ${F(c*c)} − ${F(a*a)} = ${F(b*b)}, donc ${x}${z} = ${rac(F(b*b))} = ${b} cm.`, sx:S_COTE}; }} ],
 2:[ {g:()=>{ const [x,y,z]=NM(); let a,c; do{ c=ri(6,15); a=ri(2,c-1); }while(Number.isInteger(Math.sqrt(c*c-a*a))); const s=c*c-a*a, r=Math.sqrt(s);
       return {q:`${x}${y}${z} est rectangle en ${x}, ${y}${z} = ${c} cm et ${x}${y} = ${a} cm. Calcule ${x}${z}, arrondi au dixième (en cm).`, rep:[F(r,1),F(r,1)+" cm",zp(F(r,1),1),zp(F(r,1),1)+" cm"], ex:`L'hypoténuse est [${y}${z}] : ${x}${z}² = ${c}² − ${a}² = ${c*c} − ${a*a} = ${s}, donc ${x}${z} = ${rac(s)} ≈ ${F(r,1)} cm.`, sx:S_COTE}; }},
     {g:()=>{ const c=pick([7,8,9,10,12]), a=ri(2,c-2); return {q:`EFG est rectangle en G, EF = ${c} cm et EG = ${a} cm. Quelle égalité donne FG² ?`, c:[`FG² = ${c}² − ${a}²`,`FG² = ${c}² + ${a}²`,`FG² = ${a}² − ${c}²`], rep:`FG² = ${c}² − ${a}²`, ex:`[EF] est l'hypoténuse (opposée à l'angle droit en G) : EF² = EG² + FG², donc FG² = EF² − EG² = ${c}² − ${a}².`, sx:S_COTE}; }} ],
 3:[ {g:()=>{ const [x,y,z]=NM(); let a,c; do{ c=ri(40,90)/10; a=ri(15,Math.round(c*10)-8)/10; }while(c-a<0.5); const s=rd(c*c-a*a), r=Math.sqrt(s);
       const b=r; return {q:`Calcule ${x}${z}, arrondi au dixième (en cm).`, fig:rtFig([x,y,z],a,b,{[x+y]:F(a)+" cm",[y+z]:F(c)+" cm"}), rep:[F(r,1),F(r,1)+" cm",zp(F(r,1),1),zp(F(r,1),1)+" cm"], ex:`L'hypoténuse est [${y}${z}] : ${x}${z}² = ${sq(c)} − ${sq(a)} = ${F(c*c)} − ${F(a*a)} = ${F(s)}, donc ${x}${z} = ${rac(F(s))} ≈ ${F(r,1)} cm.`, sx:S_COTE}; }},
     {g:()=>{ const L=ri(20,40)/10, h=ri(4,12)/10, r=Math.sqrt(L*L-h*h); return {q:`Une rampe de ${F(L)} m mène à une porte située à ${F(h)} m du sol. Quelle longueur faut-il au sol, arrondie au centième (en m) ?`, rep:[F(r,2),F(r,2)+" m",zp(F(r,2),2),zp(F(r,2),2)+" m"], ex:`La rampe est l'hypoténuse : x² = ${sq(L)} − ${sq(h)} = ${F(L*L)} − ${F(h*h)} = ${F(L*L-h*h)}, donc x ≈ ${F(r,2)} m.`, sx:S_COTE}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
  const E1a=triFig(["R","S","T"], 15.6, 16.9, 6.5, {RS:"6,5 cm",ST:"15,6 cm",RT:"16,9 cm"}, 260);
  const parc=geo({P:{A:[0,0],B:[6,0],C:[6,2.5],D:[0,2.5]}, poly:[["A","B","C","D"]], seg:[["A","C","b"]], right:[["B","A","C","var(--ink)"]], len:[["A","B","120 m"],["B","C","50 m"]], k:44, w:340, alt:"Parc rectangulaire ABCD : AB = 120 m, BC = 50 m, chemin en diagonale de A à C"});
  const ech=geo({P:{M:[0,0],P:[1.4,0],H:[0,4.8]}, poly:[["M","P","H"]], right:[["M","P","H","var(--ink)"]], len:[["M","P","1,4 m"],["P","H","5 m"]], k:40, w:220, alt:"Échelle [PH] de 5 m contre le mur [MH], pied P à 1,4 m du mur"});
  const fig5=geo({P:{A:[0,4.8],B:[0,0],C:[6.4,0],D:[10,4.8]}, poly:[["A","B","C"],["A","C","D"]], right:[["B","C","A"]], len:[["A","B","4,8 cm"],["B","C","6,4 cm"],["C","D","6 cm"],["A","D","10 cm"]], k:26, w:320, cen:[4.1,2.4], alt:"Triangle ABC rectangle en B et triangle ACD"});
  return {
titre:"Évaluation d'entraînement · chapitre 8", duree:50, info:"Durée : 50 min · Calculatrice autorisée · Règle",
comp:[
  ["CONNAÎTRE","Je connais le vocabulaire (hypoténuse) et la racine carrée.","Ex. 2 (3 points)"],
  ["RAISONNER","Je démontre qu'un triangle est rectangle ou non avec la réciproque du théorème de Pythagore.","Ex. 1 et 5 b (6 points)"],
  ["CALCULER","Je calcule une longueur avec le théorème de Pythagore.","Ex. 4 et 5 a (6 points)"],
  ["MODÉLISER","Je résous un problème concret avec le théorème de Pythagore.","Ex. 3 (5 points)"]
],
exos:[
{t:"Rectangle ou pas ?", p:4, h:`<p>Les figures ne sont pas en vraie grandeur.</p><p><b>a)</b> Le triangle RST est-il rectangle ? Justifie.</p>${E1a}<p><b>b)</b> Le triangle KLM est tel que KL = 7 cm, LM = 9 cm et KM = 11,5 cm. Est-il rectangle ? Justifie.</p>`,
 c:`<p><b>a)</b> Le plus grand côté est [RT].</p><div class="figs"><p class="calc">RT² = 16,9²<br>RT² = 285,61</p><p class="calc">RS² + ST² = 6,5² + 15,6²<br>RS² + ST² = 42,25 + 243,36<br>RS² + ST² = 285,61</p></div><p>RT² = RS² + ST² : l'égalité de Pythagore est vérifiée, donc <b>RST est rectangle en S</b>. <i>(2 points)</i></p>
  <p><b>b)</b> Le plus grand côté est [KM].</p><div class="figs"><p class="calc">KM² = 11,5²<br>KM² = 132,25</p><p class="calc">KL² + LM² = 7² + 9²<br>KL² + LM² = 49 + 81<br>KL² + LM² = 130</p></div><p>KM² ≠ KL² + LM² : <b>KLM n'est pas rectangle</b>. <i>(2 points)</i></p>`},
{t:"QCM", p:3, h:`<p>Pour chaque question, une seule réponse est exacte. Écris le numéro de la question et la lettre choisie. Aucune justification n'est demandée.</p>
  <div class="scroll"><table class="std"><thead><tr><th></th><th>Question</th><th>Réponse A</th><th>Réponse B</th><th>Réponse C</th></tr></thead><tbody>
  <tr><td><b>1</b></td><td>Le triangle EFG est rectangle en F. Son hypoténuse est…</td><td>[EF]</td><td>[EG]</td><td>[FG]</td></tr>
  <tr><td><b>2</b></td><td>${rac("64")} est égal à…</td><td>8</td><td>32</td><td>4 096</td></tr>
  <tr><td><b>3</b></td><td>Un triangle a pour côtés 5 cm, 12 cm et 13 cm. Il est…</td><td>rectangle</td><td>pas rectangle</td><td>on ne peut pas savoir</td></tr></tbody></table></div>`,
 c:`<p><b>1.</b> Réponse B : [EG] est opposé à l'angle droit en F. <i>(1 point)</i></p><p><b>2.</b> Réponse A : 8² = 64. <i>(1 point)</i></p><p><b>3.</b> Réponse A : 13² = 169 et 5² + 12² = 25 + 144 = 169. <i>(1 point)</i></p>`},
{t:"Le raccourci dans le parc", p:5, h:`<p>Un parc a la forme d'un rectangle ABCD avec AB = 120 m et BC = 50 m.</p>${parc}<p>Pour aller de l'entrée A à la sortie C, Lina suit d'habitude les allées [AB] puis [BC].</p><p>Aujourd'hui, elle coupe en ligne droite de A à C.</p>
  <p><b>1)</b> Quelle distance parcourt-elle d'habitude ?</p><p><b>2)</b> Calcule la longueur AC.</p><p><b>3)</b> Quelle distance, en m, Lina gagne-t-elle avec son raccourci ?</p><p><b>4)</b> Lina marche à la vitesse de 1,25 m/s. Combien de temps, en secondes, gagne-t-elle ?</p>`,
 c:`<p><b>1)</b> AB + BC = 120 + 50 = <b>170 m</b>. <i>(0,5 point)</i></p>
  <p><b>2)</b> ABCD est un rectangle, donc le triangle ABC est rectangle en B. D'après le théorème de Pythagore :</p><p class="calc">AC² = AB² + BC²<br>AC² = 120² + 50²<br>AC² = 14 400 + 2 500<br>AC² = 16 900<br>AC = ${rac("16 900")} = 130 m</p><p><i>(2 points)</i></p>
  <p><b>3)</b> 170 − 130 = <b>40 m</b>. <i>(1 point)</i></p><p><b>4)</b> 40 ÷ 1,25 = <b>32 s</b>. Lina gagne 32 secondes. <i>(1,5 point)</i></p>`},
{t:"L'échelle", p:4, h:`<p>Une échelle [PH] de 5 m est posée contre un mur vertical [MH]. Le sol est horizontal.</p><p>Le pied P de l'échelle est à 1,4 m du mur.</p>${ech}<p><b>a)</b> À quelle hauteur MH le haut de l'échelle touche-t-il le mur ?</p><p><b>b)</b> Le pied de l'échelle glisse : il est maintenant à 3 m du mur. À quelle hauteur arrive maintenant le haut de l'échelle ?</p>`,
 c:`<p><b>a)</b> Le mur est vertical et le sol horizontal : le triangle MPH est rectangle en M. L'hypoténuse est l'échelle [PH].</p><p class="calc">PH² = MP² + MH²<br>MH² = 5² − 1,4²<br>MH² = 25 − 1,96<br>MH² = 23,04<br>MH = ${rac("23,04")} = 4,8 m</p><p>Le haut de l'échelle touche le mur à <b>4,8 m</b>. <i>(2,5 points)</i></p>
  <p><b>b)</b> Le triangle MPH est toujours rectangle en M, avec maintenant MP = 3 m :</p><p class="calc">MH² = PH² − MP²<br>MH² = 5² − 3²<br>MH² = 25 − 9<br>MH² = 16<br>MH = ${rac("16")} = 4 m</p><p>Le haut de l'échelle arrive à <b>4 m</b>. <i>(1,5 point)</i></p>`},
{t:"Deux triangles", p:4, h:`<p>Sur la figure ci-dessous (qui n'est pas en vraie grandeur), le triangle ABC est rectangle en B.</p>${fig5}<p>On donne AB = 4,8 cm, BC = 6,4 cm, CD = 6 cm et AD = 10 cm.</p><p><b>a)</b> Calcule la longueur AC.</p><p><b>b)</b> Le triangle ACD est-il rectangle ? Justifie.</p>`,
 c:`<p><b>a)</b> ABC est rectangle en B. D'après le théorème de Pythagore :</p><p class="calc">AC² = AB² + BC²<br>AC² = 4,8² + 6,4²<br>AC² = 23,04 + 40,96<br>AC² = 64<br>AC = ${rac("64")} = 8 cm</p><p><i>(2 points)</i></p>
  <p><b>b)</b> Dans ACD, le plus grand côté est [AD].</p><div class="figs"><p class="calc">AD² = 10²<br>AD² = 100</p><p class="calc">AC² + CD² = 8² + 6²<br>AC² + CD² = 64 + 36<br>AC² + CD² = 100</p></div><p>AD² = AC² + CD², donc <b>ACD est rectangle en C</b>. <i>(2 points)</i></p>`}
]}; })()
};
})();
