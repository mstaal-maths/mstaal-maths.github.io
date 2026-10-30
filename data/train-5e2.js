/* 5e · chapitre 2 — fiche d'entraînement : mêmes exercices que les fiches de classe, avec de nouvelles figures */
TRAIN["5e-2"] = function(){
const {ri, pick, shuf, items} = TR;
const {dt, sa, usu, USU, AXC, CTC, LEG} = window.FIG5;
const S = G.sym;
const dist = (a,b) => Math.hypot(a[0]-b[0], a[1]-b[1]);
const area = (P) => Math.abs(P.reduce((s,p,i)=>{ const q=P[(i+1)%P.length]; return s + p[0]*q[1]-q[0]*p[1]; },0))/2;
/* polygone « propre » dans un rectangle */
function poly(names, box, minSide=55){
  for(let g=0; g<500; g++){
    let P;
    if(names.length===3) P=[0,1,2].map(()=>[ri(box[0],box[2]), ri(box[1],box[3])]);
    else { const cx=(box[0]+box[2])/2, cy=(box[1]+box[3])/2, rx=(box[2]-box[0])/2, ry=(box[3]-box[1])/2, a0=Math.random()*6.28;
      P=[0,1,2,3].map(i=>{ const a=a0+i*Math.PI/2+(Math.random()-0.5)*0.9, k=0.6+Math.random()*0.4; return [Math.round(cx+rx*k*Math.cos(a)), Math.round(cy+ry*k*Math.sin(a))]; }); }
    const sides=P.map((p,i)=>dist(p,P[(i+1)%P.length]));
    if(Math.min(...sides)>=minSide && area(P)>minSide*minSide*0.6 && area(P)>0.22*Math.max(...sides)**2){ const o={}; names.forEach((n,i)=>o[n]=P[i]); return o; }
  }
  return poly(names, box, minSide*0.9);
}
/* ======= Tout se construit sur quadrillage : l'élève reproduit la figure carreau par carreau ======= */
const U=30, GW=c=>Math.min(c*U+50,480), GO=(c,r,o={})=>({grid:{c,r}, s:U, w:GW(c), ...o});
const inG=(p,c,r)=>p[0]>=0&&p[0]<=c&&p[1]>=0&&p[1]<=r;
const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);
const isIn=(p,P)=>{ const s=P.map((q,i)=>cr(q,P[(i+1)%P.length],p)); return s.every(x=>x>0)||s.every(x=>x<0); };
const dSeg=(p,a,b)=>{ const vx=b[0]-a[0], vy=b[1]-a[1], t=Math.max(0,Math.min(1,((p[0]-a[0])*vx+(p[1]-a[1])*vy)/(vx*vx+vy*vy))); return dist(p,[a[0]+t*vx,a[1]+t*vy]); };
const dPoly=(p,P)=>Math.min(...P.map((q,i)=>dSeg(p,q,P[(i+1)%P.length])));
/* polygone à sommets sur les nœuds, convexe, sans angle trop aplati */
function rpoly(n,x0,y0,x1,y1){
  const P=[...Array(n)].map(()=>[ri(x0,x1),ri(y0,y1)]);
  if(n===4){ const cx=P.reduce((t,p)=>t+p[0],0)/4, cy=P.reduce((t,p)=>t+p[1],0)/4; P.sort((a,b)=>Math.atan2(a[1]-cy,a[0]-cx)-Math.atan2(b[1]-cy,b[0]-cx)); }
  return rpoly.check(P);
}
rpoly.check = P => { const n=P.length;
  const sd=P.map((p,i)=>dist(p,P[(i+1)%n]));
  if(Math.min(...sd)<3 || area(P)<(n===3?6:10) || area(P)<0.22*Math.max(...sd)**2) return null;
  const cs=P.map((b,i)=>{ const a=P[(i+n-1)%n], c2=P[(i+1)%n]; return cr(b,a,c2)/(dist(a,b)*dist(c2,b)); });
  if(!(cs.every(x=>x>0.3)||cs.every(x=>x<-0.3))) return null;
  return P;
};
const nm=(names,P)=>{ const o={}; names.forEach((n,i)=>o[n]=P[i]); return o; };
const sepOK=(arr,d=1.4)=>arr.every((p,i)=>arr.every((q,j)=>j<=i||dist(p,q)>=d));
function make(fn){ for(let g=0;g<30000;g++){ const r=fn(); if(r) return r; } throw new Error("figure introuvable"); }
/* textes de correction : on compte les carreaux */
const pl=(k,w)=>`${k} ${w}${k>1?"x":""}`;
const mv=(dx,dy)=>[dx?`${pl(Math.abs(dx),"carreau")} vers la ${dx>0?"droite":"gauche"}`:"", dy?`${pl(Math.abs(dy),"carreau")} vers le ${dy>0?"bas":"haut"}`:""].filter(Boolean).join(" et ");
const txtC=(X,O,Xp,p,o)=>`De ${X} à ${O} : ${mv(o[0]-p[0],o[1]-p[1])}. Je refais le même déplacement à partir de ${O} : j'arrive en ${Xp}.`;
const lines=arr=>arr.map(t=>`<p>${t}</p>`).join("");
const REPRO=`Reproduis la figure sur ton cahier : <b>un carreau de la figure = un carreau de ton cahier</b>.`;
/* axes : vertical (v), horizontal (h), diagonales des carreaux (d : ↘, a : ↗) */
function axisObj(k,par,c,r){
  if(k==="v") return {k, f:p=>[2*par-p[0],p[1]], s:p=>p[0]-par, A:[par,0], B:[par,r]};
  if(k==="h") return {k, f:p=>[p[0],2*par-p[1]], s:p=>p[1]-par, A:[0,par], B:[c,par]};
  if(k==="d"){ const xa=Math.max(0,-par), xb=Math.min(c,r-par); if(xb-xa<3) return null; return {k, f:p=>[p[1]-par,p[0]+par], s:p=>p[1]-p[0]-par, A:[xa,xa+par], B:[xb,xb+par]}; }
  const xa=Math.max(0,par-r), xb=Math.min(c,par); if(xb-xa<3) return null; return {k, f:p=>[par-p[1],par-p[0]], s:p=>p[0]+p[1]-par, A:[xa,par-xa], B:[xb,par-xb]};
}
const rAxis=(c,r,kinds)=>{ const k=pick(kinds); return axisObj(k, k==="v"?ri(3,c-3): k==="h"?ri(2,r-2): k==="d"?ri(-(c-4),r-4): ri(4,c+r-4), c, r); };
const axThrough=(k,R,c,r)=>axisObj(k, k==="v"?R[0]:k==="h"?R[1]:k==="d"?R[1]-R[0]:R[0]+R[1], c, r);
/* sur un axe diagonal, le pied de la perpendiculaire doit tomber sur un nœud */
const offAx=(ax,p)=>{ const s=ax.s(p); return (ax.k==="v"||ax.k==="h") ? Math.abs(s)>=2 : (Math.abs(s)>=2 && s%2===0); };
const sameSide=(ax,P)=>P.every(p=>offAx(ax,p)) && (P.every(p=>ax.s(p)>0)||P.every(p=>ax.s(p)<0));
const axIntro=(ax,L)=> (ax.k==="v"||ax.k==="h") ? `${L} suit une ligne du quadrillage : je compte les carreaux entre chaque point et ${L}, puis autant de l'autre côté.`
  : `${L} suit les diagonales des carreaux : pour chaque point, je traverse ${L} en suivant les diagonales des carreaux (c'est perpendiculaire à ${L}), et je compte autant de diagonales de l'autre côté.`;
function txtAx(ax,L,X,Xp,p){ const s=ax.s(p), k=Math.abs(s);
  if(ax.k==="v") return `${X} est à ${pl(k,"carreau")} à ${s<0?"gauche":"droite"} de ${L} : ${Xp} est à ${pl(k,"carreau")} à ${s<0?"droite":"gauche"}, sur la même ligne.`;
  if(ax.k==="h") return `${X} est à ${pl(k,"carreau")} ${s<0?"au-dessus":"au-dessous"} de ${L} : ${Xp} est à ${pl(k,"carreau")} ${s<0?"au-dessous":"au-dessus"}, sur la même colonne.`;
  const q=k/2; return `${X} est à ${q} diagonale${q>1?"s":""} de carreau de ${L} : je continue tout droit, ${q} diagonale${q>1?"s":""} de l'autre côté : c'est ${Xp}.`; }
/* images d'un demi-tour dans le quadrillage, points bien séparés */
const okC=(T,names,O,fixed,c,r)=>{ const I=names.filter(n=>n!==fixed).map(n=>S(T[n],O)); return I.every(p=>inG(p,c,r)) && sepOK([...names.map(n=>T[n]), ...(fixed?[]:[O]), ...I]); };
const cTxt=(T,names,O,on,suf,fixed)=>names.filter(n=>n!==fixed).map(n=>txtC(n,on,n+suf,T[n],O));

/* ======= A. Symétrie axiale (rappel) ======= */
/* axe diagonal : on décale d'un carreau les sommets dont le pied ne tombe pas sur un nœud */
const snap=(ax,P)=>(ax.k==="v"||ax.k==="h") ? P : P.map(p=>ax.s(p)%2 ? [p[0]+1,p[1]] : p);
/* tous les nœuds du quadrillage, mélangés */
const nodes=(c,r)=>shuf([...Array((c+1)*(r+1))].map((_,i)=>[i%(c+1), Math.floor(i/(c+1))]));
/* polygone dont tous les sommets sont du même côté de l'axe, avec leurs images dans le quadrillage */
function sidePoly(n,ax,c,r){ const side=pick([1,-1]);
  const E=nodes(c,r).filter(p=>p[0]>=1&&p[0]<=c-1&&p[1]>=1&&p[1]<=r-1 && offAx(ax,p) && Math.sign(ax.s(p))===side && inG(ax.f(p),c,r)); if(E.length<n) return null;
  for(let g=0; g<40; g++){ const P=shuf(E).slice(0,n);
    if(n===4){ const cx=P.reduce((t,p)=>t+p[0],0)/4, cy=P.reduce((t,p)=>t+p[1],0)/4; P.sort((a,b)=>Math.atan2(a[1]-cy,a[0]-cx)-Math.atan2(b[1]-cy,b[0]-cx)); }
    if(rpoly.check(P)) return P; }
  return null; }
/* un centre (nœud) hors du polygone, dont les images restent dans le quadrillage */
/* aucun alignement centre-sommet-sommet : sinon les tracés de construction se superposent */
const noAlign=(O,P)=>P.every((p,i)=>P.every((q,j)=>j<=i||cr(O,p,q)!==0));
const findCentre=(T,names,c,r,ok)=>nodes(c,r).find(O=>{ const P=names.map(n=>T[n]); return !isIn(O,P) && dPoly(O,P)>=1.5 && noAlign(O,P) && okC(T,names,O,null,c,r) && (!ok||ok(O)); });
function axialFig(names,kinds){ return make(()=>{ const c=ri(11,13), r=ri(8,9), ax=rAxis(c,r,kinds); if(!ax) return null;
  const P=sidePoly(names.length,ax,c,r); if(!P) return null; const I=P.map(ax.f);
  if(!I.every(p=>inG(p,c,r)) || !sepOK([...P,...I])) return null; return {c,r,ax,T:nm(names,P)}; }); }
const kA = shuf([["v","h"],["d","a"]]);
const ax1 = axialFig(["A","B","C"],kA[0]), ax2 = axialFig(["A","B","C","D"],kA[1]);
const startAx = (F,names,L="(d)") => geo({pts:F.T, polys:[{v:names}], lines:[{a:F.ax.A,b:F.ax.B,lab:L,t:0.04}], ...GO(F.c,F.r)});
const corrAx = (F,names,L="(d)") => `<p>${axIntro(F.ax,L)}</p>${lines(names.map(n=>txtAx(F.ax,L,n,n+"'",F.T[n])))}${sa(F.T,names,F.ax.A,F.ax.B,GO(F.c,F.r,{t:0.04,lab:L}))}`;

/* ======= B. Demi-tour ======= */
const E1 = make(()=>{ const c=ri(12,14), r=ri(8,9), h=Math.floor(c/2); const P=rpoly(3,1,1,h,r-1); if(!P) return null; const T=nm(["H","N","P"],P);
  if(!okC(T,["H","N","P"],T.P,"P",c,r)) return null; const Q=findCentre(T,["H","N","P"],c,r,O=>O[0]>=h-1); if(!Q) return null; T.Q=Q; return {T,c,r}; });
const E2 = make(()=>{ const c=ri(13,15), r=ri(9,10), h=Math.floor(c/2); const P=rpoly(4,1,1,h,r-1); if(!P) return null; const T=nm(["L","I","R","E"],P);
  if(!okC(T,["L","I","R","E"],T.R,"R",c,r)) return null; const V=findCentre(T,["L","I","R","E"],c,r,O=>O[0]>=h-1); if(!V) return null; T.V=V; return {T,c,r}; });
const E3 = make(()=>{ const c=ri(12,14), r=ri(8,9), rho=ri(2,3); const Sx=[ri(rho,c-rho),ri(rho,r-rho)], Ux=[ri(0,c),ri(0,r)], Sp=S(Sx,Ux);
  if(dist(Sx,Ux)<rho+1.5 || !(Sp[0]>=rho&&Sp[0]<=c-rho&&Sp[1]>=rho&&Sp[1]<=r-rho)) return null; return {c,r,rho,T:{S:Sx,U:Ux}}; });
const E9 = make(()=>{ const c=ri(10,12), r=ri(8,9); const P=rpoly(4,1,1,c-1,r-1); if(!P) return null; const T=nm(["A","B","C","D"],P);
  const O=nodes(c,r).find(O=>isIn(O,P)&&dPoly(O,P)>=0.9&&noAlign(O,P)&&okC(T,["A","B","C","D"],O,null,c,r)); if(!O) return null; T.O=O; return {T,c,r}; });
const E4 = make(()=>{ const c=ri(10,12), r=ri(6,7), h=Math.floor(c/2); const P=rpoly(3,1,1,h,r-1); if(!P) return null; const T=nm(["D","E","C"],P);
  const F=findCentre(T,["D","E","C"],c,r,O=>O[0]>=h-1); if(!F) return null; T.F=F; return {T,c,r}; });
const E5 = make(()=>{ const c=ri(10,12), r=ri(6,7); const P=rpoly(3,1,1,c-1,r-1); if(!P) return null; const T=nm(["D","E","C"],P);
  if(!okC(T,["D","E","C"],T.E,"E",c,r)) return null; return {T,c,r}; });
const E6 = make(()=>{ const c=ri(13,15), r=ri(9,10), ax=rAxis(c,r,["v","h","d","a"]); if(!ax) return null; const P=sidePoly(3,ax,c,r); if(!P) return null;
  const T=nm(["R","A","P"],P), I1=P.map(ax.f); const B=findCentre(T,["R","A","P"],c,r,B=>Math.abs(ax.s(B))>=2 && sepOK([...P,B,...I1,...P.map(p=>S(p,B))])); if(!B) return null; T.B=B; return {c,r,ax,T}; });
const E7 = make(()=>{ const c=ri(11,13), r=ri(8,9), k=pick(["v","h","d","a"]), R=[ri(1,c-1),ri(1,r-1)], u={v:[0,1],h:[1,0],d:[1,1],a:[1,-1]}[k], t=pick([-4,-3,3,4]);
  const A=[R[0]+t*u[0], R[1]+t*u[1]]; if(!(A[0]>=1&&A[0]<=c-1&&A[1]>=1&&A[1]<=r-1)) return null; const ax=axThrough(k,R,c,r); if(!ax) return null;
  const P=[ri(1,c-1),ri(1,r-1)]; if(!offAx(ax,P)) return null; const tri=[R,A,P], sd=tri.map((p,i)=>dist(p,tri[(i+1)%3]));
  if(area(tri)<3 || area(tri)<0.22*Math.max(...sd)**2) return null; const I=[ax.f(P),S(R,A),S(P,A)];
  if(!I.every(p=>inG(p,c,r)) || !sepOK([R,A,P,...I])) return null;
  /* étiquette (RA) au bout de l'axe le plus éloigné de R et de A */
  const far=t=>{ const q=[ax.A[0]+(ax.B[0]-ax.A[0])*t, ax.A[1]+(ax.B[1]-ax.A[1])*t]; return Math.min(dist(q,R),dist(q,A),dist(q,P)); };
  const tl = far(0.04)>=far(0.96) ? 0.04 : 0.96; if(far(tl)<2) return null;
  return {c,r,ax,tl,T:{R,A,P}}; });
const gs = F => GO(F.c,F.r);
const startC = (F,names,centre) => geo({pts:F.T, polys:[{v:names}], marks:centre?[centre]:[], ...gs(F)});

/* ======= C. Justifier ======= */
const QJ = poly(["A","B","C","D"],[20,30,170,210],70), OJ=[ri(215,235), ri(110,140)];
const imgJ = {I:S(QJ.A,OJ), J:S(QJ.B,OJ), K:S(QJ.C,OJ), L:S(QJ.D,OJ)};
const lens = [ri(3,8), ri(3,8), ri(3,8), ri(3,8)].map(x=>x+(Math.random()<0.4?0.5:0));
const angA = ri(70,130); let angC; do{ angC = ri(60,120); }while(Math.abs(angC-angA)<8);
const fmtL = x => String(x).replace(".",",");
const askSide = pick([["[KL]","[CD]",2],["[IJ]","[AB]",0],["[JK]","[BC]",1],["[LI]","[DA]",3]]);
const askAng = pick([["JIL","BAD",angA],["JKL","BCD",angC]]);
const per = lens.reduce((a,b)=>a+b,0);

/* ======= D. Hexagone ======= */
const HX="ABCDEF";
const csym = i => HX[(i+3)%6], asym = (i,k) => HX[((2*k-i)%6+6)%6];
const qh = [];
{ const i=ri(0,5); qh.push([`Le symétrique du point ${HX[i]} par rapport au point O est …`, csym(i)]); }
{ const i=ri(0,5); qh.push([`Le symétrique du triangle ${HX[i]}O${HX[(i+1)%6]} par rapport au point O est …`, `le triangle ${csym(i)}O${csym((i+1)%6)}`]); }
{ let i,k; do{ i=ri(0,5); k=ri(0,5); }while(k===i||(k+3)%6===i); qh.push([`Le symétrique du point ${HX[i]} par rapport à la droite (O${HX[k]}) est …`, asym(i,k)]); }
{ const i=ri(0,5), k=ri(0,5); qh.push([`Le symétrique du triangle ${HX[i]}O${HX[(i+1)%6]} par rapport à la droite (O${HX[k]}) est …`, `le triangle ${asym(i,k)}O${asym((i+1)%6,k)}`]); }
{ const i=ri(0,5); qh.push([`Le symétrique du segment [${HX[i]}${HX[(i+1)%6]}] par rapport au point O est …`, `le segment [${csym(i)}${csym((i+1)%6)}]`]); }

/* ======= E. Figures usuelles ======= */
const us3 = shuf(USU).slice(0,3);

return [
 {t:"Rappel : construire par symétrie axiale", note:`<b>Sur ton cahier à petits carreaux :</b> reproduis chaque figure en comptant les carreaux, puis fais la construction. Tu pourras comparer avec la correction, carreau par carreau.`, e:[
  {n:"Exercice 1", t:"Le symétrique par rapport à une droite", w:"Sur ton cahier", h:`<p>${REPRO} Puis construis le symétrique de chaque figure par rapport à la droite (d).</p><div class="figs"><figure>${startAx(ax1,["A","B","C"])}<figcaption>a)</figcaption></figure><figure>${startAx(ax2,["A","B","C","D"])}<figcaption>b)</figcaption></figure></div>`,
   c:`<p><b>a)</b></p>${corrAx(ax1,["A","B","C"])}<p><b>b)</b></p>${corrAx(ax2,["A","B","C","D"])}`}
 ]},
 {t:"Construire le symétrique par un demi-tour", e:[
  {n:"Exercice 1", t:"Triangle HNP", w:"Sur ton cahier", h:`<p>${REPRO}</p>${startC(E1,["H","N","P"],"Q")}<p>a) Trace le symétrique du triangle HNP par rapport au point Q. Nomme-le H'N'P'. b) Trace le symétrique du triangle HNP par rapport à P. Nomme-le H''N''P''.</p>`,
   c:`<p><b>a)</b> Q est le milieu de [HH'], de [NN'] et de [PP'].</p>${lines(cTxt(E1.T,["H","N","P"],E1.T.Q,"Q","'"))}${dt(E1.T,["H","N","P"],"Q",gs(E1))}
      <p><b>b)</b> Le centre est le sommet P : P'' = P.</p>${lines(cTxt(E1.T,["H","N","P"],E1.T.P,"P","''","P"))}${dt(E1.T,["H","N","P"],"P",{...gs(E1),suf:"''",names:{P:"P = P''"}})}`},
  {n:"Exercice 2", t:"Quadrilatère LIRE", w:"Sur ton cahier", h:`<p>${REPRO}</p>${startC(E2,["L","I","R","E"],"V")}<p>a) Trace le symétrique de LIRE par rapport à V. Nomme-le L'I'R'E'. b) Trace le symétrique de LIRE par rapport à R. Nomme-le L''I''R''E''.</p>`,
   c:`<p><b>a)</b></p>${lines(cTxt(E2.T,["L","I","R","E"],E2.T.V,"V","'"))}${dt(E2.T,["L","I","R","E"],"V",gs(E2))}
      <p><b>b)</b> R est sa propre image : R'' = R.</p>${lines(cTxt(E2.T,["L","I","R","E"],E2.T.R,"R","''","R"))}${dt(E2.T,["L","I","R","E"],"R",{...gs(E2),suf:"''",names:{R:"R = R''"}})}`},
  {n:"Exercice 3", t:"Un cercle", w:"Sur ton cahier", h:`<p>${REPRO}</p>${geo({pts:E3.T, circles:[{c:"S",r:E3.rho}], marks:["S","U"], ...gs(E3)})}<p>Le cercle (C) a pour centre S et pour rayon ${E3.rho} carreaux. Trace le symétrique du cercle (C) par rapport au point U. Nomme-le (C').</p>`,
   c:`<p>Je construis S', symétrique du centre S par rapport à U, puis je trace le cercle de centre S' et de <b>même rayon</b> (${E3.rho} carreaux).</p><p>${txtC("S","U","S'",E3.T.S,E3.T.U)}</p>${geo({pts:{...E3.T,"S'":S(E3.T.S,E3.T.U)}, circles:[{c:"S",r:E3.rho},{c:"S'",r:E3.rho,k:"img"}], cons:[["S","U","S'",1]], marks:["U"], ...gs(E3)})}`},
  {n:"Exercice 9", t:"Quadrilatère ABCD", w:"Sur ton cahier", h:`<p>${REPRO}</p>${startC(E9,["A","B","C","D"],"O")}<p>Construis le symétrique du quadrilatère ABCD par rapport à O. Nomme-le A'B'C'D'.</p>`,
   c:`${lines(cTxt(E9.T,["A","B","C","D"],E9.T.O,"O","'"))}${dt(E9.T,["A","B","C","D"],"O",gs(E9))}`}
 ]},
 {t:"Le demi-tour sur quadrillage", e:[
  {n:"Exercice 4", t:"Par rapport au point F", w:"Sur ton cahier", h:`<p>${REPRO} Puis construis le symétrique du triangle DEC par rapport au point F. Nomme-le D'E'C'.</p>${startC(E4,["D","E","C"],"F")}`,
   c:`${lines(cTxt(E4.T,["D","E","C"],E4.T.F,"F","'"))}${dt(E4.T,["D","E","C"],"F",gs(E4))}`},
  {n:"Exercice 5", t:"Par rapport au point E", w:"Sur ton cahier", h:`<p>${REPRO} Puis construis le symétrique du triangle DEC par rapport au point E. Nomme-le D'E'C'.</p>${startC(E5,["D","E","C"])}`,
   c:`<p>Le centre est le sommet E : E' = E.</p>${lines(cTxt(E5.T,["D","E","C"],E5.T.E,"E","'","E"))}${dt(E5.T,["D","E","C"],"E",{...gs(E5),names:{E:"E = E'"}})}`}
 ]},
 {t:"Demi-tour ou symétrie axiale ?", e:[
  {n:"Exercice 6", t:"Triangle RAP", w:"Sur ton cahier", h:`<p>${REPRO}</p>${geo({pts:E6.T, polys:[{v:["R","A","P"]}], marks:["B"], lines:[{a:E6.ax.A,b:E6.ax.B,lab:"(e)",t:0.04}], ...gs(E6)})}<p>a) Trace le symétrique du triangle RAP par rapport à la droite (e). Nomme-le R'A'P'. b) Trace le symétrique du triangle RAP par rapport au point B. Nomme-le R''A''P''.</p>`,
   c:`<p><b>a)</b> Symétrie axiale : (e) est la médiatrice de [RR'], [AA'] et [PP'].</p>${corrAx(E6,["R","A","P"],"(e)")}
      <p><b>b)</b> Demi-tour : B est le milieu de [RR''], [AA''] et [PP''].</p>${lines(cTxt(E6.T,["R","A","P"],E6.T.B,"B","''"))}${dt(E6.T,["R","A","P"],"B",{...gs(E6),suf:"''"})}`},
  {n:"Exercice 7", t:"Encore un triangle RAP", w:"Sur ton cahier", h:`<p>${REPRO}</p>${startC(E7,["R","A","P"])}<p>a) Trace le symétrique du triangle RAP par rapport à la droite (RA). Nomme-le R'A'P'. b) Trace le symétrique du triangle RAP par rapport au point A. Nomme-le R''A''P''.</p>`,
   c:`<p><b>a)</b> R et A sont sur l'axe : R' = R et A' = A. Seul P bouge.</p><p>${axIntro(E7.ax,"(RA)")}</p><p>${txtAx(E7.ax,"(RA)","P","P'",E7.T.P)}</p>${sa(E7.T,["R","A","P"],E7.ax.A,E7.ax.B,{...gs(E7),lab:"(RA)",t:E7.tl,names:{R:"R = R'",A:"A = A'"}})}
      <p><b>b)</b> A est le centre : A'' = A.</p>${lines(cTxt(E7.T,["R","A","P"],E7.T.A,"A","''","A"))}${dt(E7.T,["R","A","P"],"A",{...gs(E7),suf:"''",names:{A:"A = A''"}})}`}
 ]},
 {t:"Utiliser les propriétés pour justifier", note:`<b>Rédaction :</b> Je sais que … Or le demi-tour conserve … Donc …`, e:[
  {n:"Exercice 2", t:"ABCD et IJKL", w:"Sur ton cahier", h:`${geo({pts:{...QJ,...imgJ,O:OJ}, polys:[{v:["A","B","C","D"]},{v:["I","J","K","L"],k:"img"}], marks:["O"]})}
   <p>Les quadrilatères ABCD et IJKL sont symétriques par rapport au point O (A et I, B et J, C et K, D et L se correspondent). On donne : AB = ${fmtL(lens[0])} cm, BC = ${fmtL(lens[1])} cm, CD = ${fmtL(lens[2])} cm, DA = ${fmtL(lens[3])} cm, l'angle <span class="ang">BAD</span> mesure ${angA}° et l'angle <span class="ang">BCD</span> mesure ${angC}°. <i>La figure n'est pas en vraie grandeur.</i></p>
   <p>a) Détermine la longueur du segment ${askSide[0]}. b) Détermine la mesure de l'angle <span class="ang">${askAng[0]}</span>. c) Détermine le périmètre du quadrilatère IJKL. Justifie chaque réponse.</p>`,
   c:`<p>a) Je sais que ${askSide[0]} est le symétrique de ${askSide[1]} par rapport à O. Or le demi-tour conserve les longueurs. Donc ${askSide[0].replace(/[\[\]]/g,"")} = ${askSide[1].replace(/[\[\]]/g,"")} = ${fmtL(lens[askSide[2]])} cm.</p>
   <p>b) Je sais que l'angle <span class="ang">${askAng[0]}</span> est le symétrique de l'angle <span class="ang">${askAng[1]}</span>. Or le demi-tour conserve les mesures d'angles. Donc <span class="ang">${askAng[0]}</span> = ${askAng[2]}°.</p>
   <p>c) Le demi-tour conserve les longueurs, donc IJKL a le même périmètre que ABCD : ${lens.map(fmtL).join(" + ")} = ${fmtL(per)} cm.</p>`}
 ]},
 {t:"Repérer des symétriques dans une rosace", e:[
  {n:"Exercice 4", t:"L'hexagone régulier", w:"Sur ton cahier", h:`${img("5c2ex/p5-17.png","Hexagone régulier ABCDEF de centre O",260)}<p>Complète :<br>${items(qh.map(q=>q[0]),"<br>",true)}</p>`, c:items(qh.map(q=>q[1]),"  ·  ",true)}
 ]},
 {t:"Axes et centres de symétrie", e:[
  {n:"Exercice 6", t:"Figures usuelles", w:"Sur ton cahier", h:`<p>Pour chaque figure, trace les axes de symétrie <b style="color:${AXC}">en rouge</b> et marque le centre de symétrie <b style="color:${CTC}">en bleu</b>, quand elle en possède.</p><div class="cgrid">${us3.map(([n,k])=>`<figure><figcaption><b>${n}</b></figcaption>${usu(k,false)}</figure>`).join("")}</div>`,
   c:`${LEG}<div class="cgrid">${us3.map(([n,k,t])=>`<figure><figcaption><b>${n}</b> ${t}</figcaption>${usu(k,true)}</figure>`).join("")}</div>`}
 ]}
];
};
