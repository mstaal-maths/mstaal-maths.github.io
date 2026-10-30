/* 3e · chapitre 2 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres figures.
   Toutes les images sont calculées à partir des mêmes points (outils window.G3k2 de data/3e-2.js). */
TRAIN["3e-2"] = function(){
const {ri, pick, shuf} = TR;
const {V, geo, F, ang, fig, vec, flags, rotFig, HEX, PEN, PAV, PAVTRI, imgTri, sameSet, HEXTR, PENTR, PAVTR, rosace, hexSVG, penSVG, pavSVG, mod} = window.G3k2;
const L3=["ABC","DEF","MNP","RST","IJK","UVW"];

/* ---------- 1. reconnaître une transformation (drapeaux) ---------- */
function flagCase(kind){
  if(kind==="axeV"){ const c=ri(7,9); return {K:[1,5], grid:[0,0,2*c,10], T:p=>[2*c-p[0],p[1]], r:`<b>Symétrie axiale</b> d'axe vertical : l'axe (en rouge) est la droite verticale située à ${c-6} carreau${c-6>1?"x":""} à droite de la figure 1.`, ex:{line:[[[c,0],[c,10],"rd",0,0]]}}; }
  if(kind==="axeH"){ return {K:[3,8], grid:[0,-7,10,13], T:p=>[p[0],6-p[1]], r:"<b>Symétrie axiale</b> d'axe horizontal : l'axe (en rouge) est la droite horizontale située au milieu des deux mâts.", ex:{line:[[[0,3],[10,3],"rd",0,0]]}}; }
  if(kind==="centre"){ return {K:[1,4], grid:[0,-1,16,18], T:p=>[16-p[0],17-p[1]], r:"<b>Symétrie centrale</b> : la figure fait un demi-tour. Le centre de symétrie <b style=\"color:#1e5aa8\">O</b> (en bleu) est le milieu du segment qui relie un point à son image.", ex:{x:[[8,8.5]], xcol:"#1e5aa8", txt:[["O",[8,8.5],12,-12,"fill:#1e5aa8"]]}}; }
  if(kind==="trans"){ const dx=ri(7,10)*pick([1,-1]), dy=pick([-3,-2,-1,0,1,2,3]); const K=[dx>0?1:-dx+1,4];
    return {K, grid:[0,Math.min(-1,-1+dy),Math.abs(dx)+7,Math.max(9,9+dy)], T:p=>[p[0]+dx,p[1]+dy], r:`<b>Translation</b> : la figure glisse de ${Math.abs(dx)} carreaux vers la ${dx>0?"droite":"gauche"}${dy?` et de ${Math.abs(dy)} carreau${Math.abs(dy)>1?"x":""} vers le ${dy>0?"haut":"bas"}`:""}.`, ex:{vec:[[K,[K[0]+dx,K[1]+dy],"#c0392b"]]}}; }
  const s=kind==="rotA"?1:-1;
  return {K:[9,8], grid:s>0?[0,-1,15,13]:[3,-2,19,13], T:p=>V.rot(p,[9,4],90*s), r:`<b>Rotation</b> de centre le bas du mât de la figure 1, d'angle 90° dans le sens ${s>0?"antihoraire":"horaire"}.`, ex:{x:[[9,4]]}};
}
const kinds=shuf(["axeV","axeH","centre","trans","rotA","rotH"]).slice(0,4).map(flagCase);

/* ---------- 2. constructions sur quadrillage ---------- */
function gridTri(){ for(let g=0;g<500;g++){ const P=[[ri(0,2),ri(0,2)],[ri(3,5),ri(0,3)],[ri(0,4),ri(3,5)]]; const A2=Math.abs((P[1][0]-P[0][0])*(P[2][1]-P[0][1])-(P[2][0]-P[0][0])*(P[1][1]-P[0][1])); if(A2>=6) return P; } return [[0,0],[4,1],[1,4]]; }
const nm=pick(L3).split(""), T2=gridTri(), P2={}; nm.forEach((n,i)=>P2[n]=T2[i]);
const imgs=(T,suf)=>{ const o={}; nm.forEach(n=>o[n+suf]=T(P2[n])); return o; };
const LC=o=>{ const c={}; Object.keys(o).forEach(n=>c[n]="var(--c)"); return c; };
/* a) axe vertical, horizontal ou oblique */
const axK=pick(["v","h","o"]);
const ax=axK==="v"?{A:[7,0],B:[7,1],T:p=>[14-p[0],p[1]],box:[[-1,-1],[15,6]],txt:'la droite <b style="color:#c0392b">(d)</b> verticale (en rouge)'}:axK==="h"?{A:[0,-1],B:[1,-1],T:p=>[p[0],-2-p[1]],box:[[-1,-8],[6,6]],txt:'la droite <b style="color:#c0392b">(d)</b> horizontale (en rouge)'}:{A:[6,0],B:[7,1],T:p=>[p[1]+6,p[0]-6],box:[[-1,-7],[12,6]],txt:'la droite <b style="color:#c0392b">(d)</b> (en rouge), qui suit les diagonales des carreaux'};
const axSVG=show=>{ const I=show?imgs(ax.T,"'"):{}; const P={...P2,...I}; const b=ax.box; const u=V.unit(V.sub(ax.B,ax.A));
  const far=[V.add(ax.A,V.mul(u,-30)),V.add(ax.A,V.mul(u,30))], clip=p=>[Math.max(b[0][0],Math.min(b[1][0],p[0])),Math.max(b[0][1],Math.min(b[1][1],p[1]))];
  /* segment de (d) dans le quadrillage */
  let e1, e2; if(axK==="v"){ e1=[7,b[0][1]]; e2=[7,b[1][1]]; } else if(axK==="h"){ e1=[b[0][0],-1]; e2=[b[1][0],-1]; } else { const lo=Math.max(b[0][0],b[0][1]+6), hi=Math.min(b[1][0],b[1][1]+6); e1=[lo,lo-6]; e2=[hi,hi-6]; }
  return geo({P, grid:[b[0][0],b[0][1],b[1][0],b[1][1]], k:24, pad:14, poly:[[nm,"orig"],...(show?[[Object.keys(I),"img"]]:[])], seg:[[e1,e2,"r"]], x:Object.keys(P), labc:LC(I), cen:V.mid(P2[nm[0]],ax.T(P2[nm[0]])), txt:[["(d)",e2,14,6,"fill:#c0392b"]], alt:"Triangle et droite (d) sur quadrillage"}); };
/* b) centre O */
const O2=pick([[6,1],[6,3],[3,-1],[7,0]]);
const ceSVG=show=>{ const I=show?imgs(p=>V.sym(p,O2),"'"):{}; const P={...P2,O:O2,...I}; const ALL=[...Object.values(P2),O2,...Object.values(imgs(p=>V.sym(p,O2),"'"))], xs=ALL.map(p=>p[0]), ys=ALL.map(p=>p[1]); /* quadrillage assez grand pour l'image, même dans l'énoncé */
  return geo({P, grid:[Math.min(...xs,-1)-1,Math.min(...ys)-1,Math.max(...xs,12)+1,Math.max(...ys)+1], k:22, pad:14, poly:[[nm,"orig"],...(show?[[Object.keys(I),"img"]]:[])], x:Object.keys(P), xc:{O:"#1e5aa8"}, labc:{...LC(I),O:"#1e5aa8"}, cen:O2, off:{O:[12,12]}, alt:"Triangle et point O sur quadrillage"}); };
/* c) translation qui transforme H en I */
const dv=[pick([3,4,5,6,7]),pick([-4,-3,-2,2,3])], H2=[7,dv[1]>0?0:5], I2=V.add(H2,dv);
const trSVG=show=>{ const I=show?imgs(p=>V.add(p,dv),"'"):{}; const P={...P2,H:H2,I:I2,...I}; const ALL=[...Object.values(P2),H2,I2,...Object.values(imgs(p=>V.add(p,dv),"'"))], xs=ALL.map(p=>p[0]), ys=ALL.map(p=>p[1]); /* quadrillage assez grand pour l'image, même dans l'énoncé */
  return geo({P, grid:[-1,Math.min(...ys)-1,Math.max(...xs)+1,Math.max(...ys)+1], k:22, pad:14, poly:[[nm,"orig"],...(show?[[Object.keys(I),"img"]]:[])], vec:[["H","I"]], x:Object.keys(P), labc:LC(I), cen:[4,2], off:{H:[-10,-12],I:[12,-12]}, alt:"Triangle et points H et I sur quadrillage"}); };
const N3=nm.join(""), N3p=nm.map(n=>n+"'").join("");
const car=(n,w)=>`${Math.abs(n)} carreau${Math.abs(n)>1?"x":""} vers ${w}`;

/* ---------- 3. rotations ---------- */
/* a) sur quadrillage : 90° autour d'un sommet */
const rq=(()=>{ const s=pick([1,-1]), cnt=pick(["A","B","C"]); const P={A:[0,ri(2,4)],B:[0,0],C:[ri(2,4),0]}; const C=P[cnt];
  const all=["A","B","C"].flatMap(n=>[P[n],V.rot(P[n],C,90*s)]), xs=all.map(p=>p[0]), ys=all.map(p=>p[1]);
  return {o:{P, cn:cnt, deg:90*s, shape:["A","B","C"], closed:false, grid:[Math.min(...xs)-1,Math.min(...ys)-1,Math.max(...xs)+1,Math.max(...ys)+1], k:28, cen:[1,1]}, s, cnt}; })();
/* b) au rapporteur : angle quelconque, centre sommet ou extérieur */
const rp=(()=>{ const deg=ri(5,30)*5, s=pick([1,-1]); let T; for(let g=0;g<300;g++){ T=V.tri(ri(40,60)/10, ri(30,50)/10, ri(30,50)/10); const an=[V.ang(T.A,T.B,T.C),V.ang(T.B,T.A,T.C),V.ang(T.C,T.A,T.B)]; if(Math.min(...an)>28) break; T=V.tri(5,4,3.5); } const ext=Math.random()<0.5;
  const P={A:T.A,B:T.B,C:T.C}; let cn="C", shape=["A","B","C"];
  if(ext){ P.O=[T.C[0]+ri(10,25)/10, T.A[1]+ri(5,15)/10]; cn="O"; }
  return {o:{P, cn, deg:deg*s, shape, k:30, cen:V.mid(T.A,T.C)}, deg, s, ext}; })();

/* ---------- 4. rosaces et pavages ---------- */
const nR=pick([5,6,8,10]), aR=360/nR;
const rosQ=(()=>{ const out=[]; const i=ri(1,nR), m=ri(2,Math.min(4,nR-1)), s=pick([1,-1]);
  out.push([`Quel est l'angle de la rotation de centre R qui transforme le motif ${i} en le motif ${mod(i+1,nR)} ? Dans quel sens ?`, `360° ÷ ${nR} = ${F(aR)}°, dans le sens horaire.`]);
  const j=ri(1,nR); out.push([`Quelle est l'image du motif ${j} par la rotation de centre R, d'angle ${F(m*aR)}° dans le sens ${s>0?"horaire":"antihoraire"} ?`, `${F(m*aR)}° = ${m} × ${F(aR)}° : on tourne de ${m} motifs dans le sens ${s>0?"horaire":"antihoraire"}. C'est le motif <b>${mod(j+s*m,nR)}</b>.`]);
  if(nR%2===0){ const k=ri(1,nR); out.push([`Quelle est l'image du motif ${k} par la symétrie de centre R ?`, `180° = ${nR/2} × ${F(aR)}° : c'est le motif <b>${mod(k+nR/2,nR)}</b>.`]); }
  else { const k=ri(1,nR), t=ri(1,nR-1), l=mod(k+t,nR); out.push([`Par quelle rotation de centre R passe-t-on du motif ${k} au motif ${l} (dans le sens horaire) ?`, `De ${k} à ${l}, on avance de ${t} motif${t>1?"s":""} : angle ${t} × ${F(aR)}° = <b>${F(t*aR)}°</b>, sens horaire.`]); }
  return out; })();
const qs=(gen,n,test)=>{ const out=[], seen=new Set(); for(let g=0;g<200&&out.length<n;g++){ const q=gen(); if(test&&!test(q)) continue; if(seen.has(q.q)) continue; seen.add(q.q); out.push(q); } return out; };
const hexQ=qs(HEXTR,3), penQ=qs(PENTR,2), pavQ=qs(PAVTR,3);
const qline=(q,i)=>`<p><b>${"abcd"[i]})</b> ${q.q.replace(/^Dans l'hexagone régulier ABCDEF de centre O, q/,"Q").replace(/^Le pentagone régulier ABCDE de centre O est composé de 5 triangles isocèles égaux\. /,"")}</p>`;
const rline=(q,i,r)=>`<p><b>${"abcd"[i]})</b> ${q.ex} C'est le triangle <b>${r}</b>.</p>`;

return [
 {t:"Reconnaître une transformation", e:[
  {n:"Exercice 1", t:"Différentes transformations du plan", w:"Sur ton cahier", h:`<p>Dans chaque cas, la figure 2 est l'image de la figure 1 par une transformation. Indique la transformation et ses caractéristiques.</p><div class="figs">${kinds.map((x,i)=>fig("Cas "+(i+1),flags(x.K,x.T,x.grid,false))).join("")}</div>`,
   c:`<div class="figs">${kinds.map((x,i)=>fig("Cas "+(i+1),flags(x.K,x.T,x.grid,true,x.ex))).join("")}</div>${kinds.map((x,i)=>`<p><b>Cas ${i+1} :</b> ${x.r}</p>`).join("")}`}
 ]},
 {t:"Symétries et translation", e:[
  {n:"Exercice 2", t:"Constructions sur quadrillage", w:"Sur ton cahier", h:`<p>Reproduis chaque figure sur ton cahier, carreau par carreau.</p>
   <p><b>a)</b> Trace le symétrique ${N3p} du triangle ${N3} par rapport à ${ax.txt}.</p>${axSVG(false)}
   <p><b>b)</b> Trace le symétrique ${N3p} du triangle ${N3} par rapport au point <b style="color:#1e5aa8">O</b> (en bleu).</p>${ceSVG(false)}
   <p><b>c)</b> Trace l'image ${N3p} du triangle ${N3} par la translation qui transforme H en I.</p>${trSVG(false)}`,
   c:`<p><b>a)</b> (d) coupe [${nm[0]}${nm[0]}'], [${nm[1]}${nm[1]}'] et [${nm[2]}${nm[2]}'] perpendiculairement en leur milieu : chaque point et son image sont à la même distance de (d).</p>${axSVG(true)}
   <p><b>b)</b> O est le milieu de [${nm[0]}${nm[0]}'], de [${nm[1]}${nm[1]}'] et de [${nm[2]}${nm[2]}'] : on fait le même déplacement de O vers l'image que du point vers O.</p>${ceSVG(true)}
   <p><b>c)</b> De H à I : ${car(dv[0],"la droite")} et ${car(dv[1],dv[1]>0?"le haut":"le bas")}. On fait le même déplacement à partir de chaque sommet.</p>${trSVG(true)}`}
 ]},
 {t:"Construire l'image d'une figure par rotation", e:[
  {n:"Exercice 3", t:"Rotation sur quadrillage", w:"Sur ton cahier", h:`<p>Reproduis la figure. Trace l'image de la ligne ABC par la rotation de centre ${rq.cnt}, d'angle 90° dans le sens ${rq.s>0?"antihoraire":"horaire"}. Nomme-la A'B'C' (${rq.cnt}' = ${rq.cnt}).</p>${rotFig(rq.o)}`,
   c:`<p>${rq.cnt} est le centre : il ne bouge pas. Chaque segment tourne d'un quart de tour dans le sens ${rq.s>0?"antihoraire":"horaire"} autour de ${rq.cnt} et garde sa longueur (on compte les carreaux).</p>${rotFig({...rq.o, show:true})}`},
  {n:"Exercice 4", t:"Rotation avec le rapporteur", w:"Sur ton cahier", h:`<p>Reproduis la figure (à peu près). Construis l'image du triangle ABC par la rotation de centre ${rp.o.cn}, d'angle ${rp.deg}° dans le sens ${rp.s>0?"antihoraire":"horaire"}. Laisse les traits de construction.</p>${rotFig(rp.o)}`,
   c:`<p>Pour chaque point M de la figure${rp.ext?"":" (autre que le centre C)"} : ${ang("M"+rp.o.cn+"M'")} = ${rp.deg}° dans le sens ${rp.s>0?"antihoraire":"horaire"} (rapporteur) et ${rp.o.cn}M' = ${rp.o.cn}M (compas).</p>${rotFig({...rp.o, show:true})}`}
 ]},
 {t:"Repérer des images dans des rosaces et des pavages", e:[
  {n:"Exercice 5", t:"Une rosace", w:"Sur ton cahier", h:`<p>Cette rosace a été créée en reproduisant le motif 1 par rotations successives de centre R.</p>${rosace(nR,220)}${rosQ.map((q,i)=>`<p><b>${"abc"[i]})</b> ${q[0]}</p>`).join("")}`,
   c:rosQ.map((q,i)=>`<p><b>${"abc"[i]})</b> ${q[1]}</p>`).join("")},
  {n:"Exercice 6", t:"Dans un hexagone", w:"Sur ton cahier", h:`<p>L'hexagone régulier ABCDEF de centre O est composé de six triangles équilatéraux.</p>${hexSVG(220)}${hexQ.map(qline).join("")}`,
   c:hexQ.map((q,i)=>rline(q,i,q.rep)).join("")},
  {n:"Exercice 7", t:"Dans un pentagone", w:"Sur ton cahier", h:`<p>Le pentagone régulier ABCDE de centre O est composé de 5 triangles isocèles égaux.</p>${penSVG(200)}${penQ.map(qline).join("")}`,
   c:penQ.map((q,i)=>rline(q,i,q.rep)).join("")},
  {n:"Exercice 8", t:"Dans un pavage", w:"Sur ton cahier", h:`<p>À partir du triangle BEJ, rectangle isocèle en J, on a obtenu le pavage ci-dessous.</p>${pavSVG(240)}${pavQ.map(qline).join("")}`,
   c:pavQ.map((q,i)=>rline(q,i,q.r)).join("")}
 ]}
];
};
