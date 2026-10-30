/* 5e · chapitre 6 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres et d'autres figures.
   Les figures des corrections sont calculées à partir des mêmes longueurs (outils window.TRI de data/5e-6.js). */
TRAIN["5e-6"] = function(){
const {ri, pick, shuf} = TR;
const {V, geo, F, ang, natureFig, NAT, natEx, traitFig, TRAIT_EX, aireFig, ISO3, NOMS, GRN} = window.TRI;
const fig=(cap,body)=>`<figure>${body}${cap?`<figcaption>${cap}</figcaption>`:""}</figure>`;
const half=(a,b)=>ri(a*2,b*2)/2;
const ANG={A:"BAC",B:"ABC",C:"ACB"};
const cen=P=>[(P.A[0]+P.B[0]+P.C[0])/3,(P.A[1]+P.B[1]+P.C[1])/3];

/* ---------- triangle de côtés BC = a, CA = b, AB = c, aigu ou obtus ---------- */
function mk(a,b,c){ const P=V.tri(a,b,c); const angs={A:V.ang(P.A,P.B,P.C),B:V.ang(P.B,P.A,P.C),C:V.ang(P.C,P.A,P.B)}; return {a,b,c,P,angs}; }
function genTri(kind){
  for(let g=0;g<3000;g++){
    const a=half(5,8), b=half(3.5,7.5), c=half(3.5,7.5);
    if(a>b+c-1||b>a+c-1||c>a+b-1) continue;
    const T=mk(a,b,c), v=Object.values(T.angs), mx=Math.max(...v), mn=Math.min(...v);
    if(mn<(kind==="aigu"?38:22)) continue;
    if(kind==="aigu" && mx<74) return T;
    if(kind==="obtus" && mx>102 && mx<122) return T;
  }
  return kind==="aigu" ? mk(6,5,5.5) : mk(7,4,4);
}
const obtusAt=T=>Object.keys(T.angs).find(k=>T.angs[k]>90);
const enonceTri=T=>`AB = ${F(T.c)} cm, AC = ${F(T.b)} cm et BC = ${F(T.a)} cm`;

/* les trois hauteurs (prolongées jusqu'à l'orthocentre H) */
function hautSVG(T){
  const P={...T.P}, Ho=V.ortho(P.A,P.B,P.C), o={P, poly:[["A","B","C"]], k:34, seg:[], right:[], dots:["H"], lab:["A","B","C","H"], off:{H:[14,-8]}, cen:cen(P), alt:"Les trois hauteurs du triangle ABC"};
  P.H=Ho;
  [["A","B","C"],["B","C","A"],["C","A","B"]].forEach(([v,p,q])=>{
    const f=V.foot(P[v],P[p],P[q]), t=V.tpar(P[v],P[p],P[q]), nm="f"+v; P[nm]=f;
    if(t<0) o.seg.push([p,nm,"d"]); if(t>1) o.seg.push([q,nm,"d"]);
    const u=V.unit(V.sub(f,P[v])), ts=[0, V.dot(V.sub(f,P[v]),u), V.dot(V.sub(Ho,P[v]),u)], lo=Math.min(...ts)-0.3, hi=Math.max(...ts)+0.3;
    o.seg.push([V.add(P[v],V.mul(u,lo)), V.add(P[v],V.mul(u,hi)), "h"]);
    const far=V.d(f,P[p])>V.d(f,P[q])?p:q; o.right.push([nm, far, v, GRN]);
  });
  return geo(o);
}
/* les médiatrices et le cercle circonscrit */
function ccSVG(T){
  const P={...T.P}, O=V.cc(P.A,P.B,P.C), R=V.d(O,P.A), o={P, poly:[["A","B","C"]], k:30, seg:[], ticks:[], circ:[[O,R]], dots:["O"], lab:["A","B","C","O"], off:{O:[14,-8]}, cen:cen(P), alt:"Le cercle circonscrit au triangle ABC"};
  P.O=O;
  [["A","B",1],["B","C",2],["A","C",3]].forEach(([p,q,n])=>{ const m=V.mid(P[p],P[q]), u=V.unit(V.perp(V.sub(P[q],P[p]))), t=V.dot(V.sub(O,m),u), lo=Math.min(0,t)-1, hi=Math.max(0,t)+1;
    o.seg.push([V.add(m,V.mul(u,lo)),V.add(m,V.mul(u,hi)),"m"]); o.ticks.push([p,q,n,.25],[p,q,n,.75]); });
  return geo(o);
}
/* les trois médianes et le centre de gravité G */
function medSVG(T){
  const P={...T.P}; P.I=V.mid(P.B,P.C); P.J=V.mid(P.A,P.C); P.K=V.mid(P.A,P.B); P.G=cen(T.P);
  return geo({P, poly:[["A","B","C"]], k:34, seg:[["A","I","md"],["B","J","md"],["C","K","md"]], ticks:[["B","C",1,.25],["B","C",1,.75],["A","C",2,.25],["A","C",2,.75],["A","B",3,.25],["A","B",3,.75]], dots:["I","J","K","G"], lab:["A","B","C","G"], off:{G:[14,-8]}, cen:P.G, alt:"Les trois médianes du triangle ABC"});
}
const posO=(T,nm)=>{ const ob=obtusAt(T); return ob ? `L'angle ${ang(ANG[ob])} est obtus : ${nm} est <b>à l'extérieur</b> du triangle.` : `Les trois angles sont aigus : ${nm} est <b>à l'intérieur</b> du triangle.`; };

/* ================= 0. Rappels ================= */
const types=shuf(["iso","equi","rect","quel"]), noms=shuf(NOMS).slice(0,4);
const nat=types.map((t,i)=>({t, nom:noms[i], f:natureFig(t,noms[i])}));
const natTxt=x=>`<b>${NAT[x.t]}${x.t==="iso"?" en "+x.f.apex:x.t==="rect"?" en "+x.f.right:""}</b>`;
const isoA=half(4,7), isoB=(()=>{ let b; do{ b=half(3,Math.min(9,2*isoA-1)); }while(b===isoA); return b; })(), equS=half(3,6);
const [rx,ry,rz]=pick([[3,4,5],[4.5,6,7.5],[6,8,10],[2.4,3.2,4],[3.6,4.8,6]]);
const isoP=V.tri(isoB,isoA,isoA), eqP=V.tri(equS,equS,equS);
const at=(c,p)=>Math.atan2(p[1]-c[1],p[0]-c[0])*180/Math.PI;
const isoSVG=geo({P:isoP, poly:[["A","B","C"]], k:30, arcs:[["B",isoA,at(isoP.B,isoP.A),26],["C",isoA,at(isoP.C,isoP.A),26]], ticks:[["A","B"],["A","C"]], len:[["B","C",F(isoB)+" cm"],["A","B",F(isoA)+" cm"],["A","C",F(isoA)+" cm"]], alt:"Triangle isocèle construit"});
const eqQ={D:eqP.B, E:eqP.C, F:eqP.A};
const eqSVG=geo({P:eqQ, poly:[["D","E","F"]], k:30, arcs:[["D",equS,at(eqQ.D,eqQ.F),26],["E",equS,at(eqQ.E,eqQ.F),26]], ticks:[["D","E"],["E","F"],["D","F"]], len:[["D","E",F(equS)+" cm"]], alt:"Triangle équilatéral construit"});
const reSVG=geo({P:{M:[0,rx],N:[0,0],P:[ry,0]}, poly:[["M","N","P"]], k:30, right:[["N","P","M"]], len:[["M","N",F(rx)+" cm"],["N","P",F(ry)+" cm"],["M","P",F(rz)+" cm"]], alt:"Triangle rectangle construit"});

/* ================= 1. Médiatrice ================= */
const segE=half(4,8), segM=half(4,8);
const medEq=(()=>{ const P=V.rot({E:[0,0],F:[segE,0]}, ri(-15,15)); P.I=V.mid(P.E,P.F); const u=V.unit(V.perp(V.sub(P.F,P.E))); P.T=V.add(P.I,V.mul(u,2.2)); P.U=V.sub(P.I,V.mul(u,2.2));
  return geo({P, seg:[["E","F"],["T","U","M"]], right:[["I","F","T"]], ticks:[["E","I"],["I","F"]], dots:["E","F","I"], lab:["E","F","I"], off:{I:[-14,18]}, cen:P.I, k:32, alt:"Médiatrice à l'équerre"}); })();
const medCo=(()=>{ const L=segM, r=0.7*L, h=Math.sqrt(r*r-L*L/4), th=Math.atan2(h,L/2)*180/Math.PI; const P={M:[0,0],N:[L,0],X:[L/2,h],Y:[L/2,-h]};
  return geo({P, seg:[["M","N"]], lines:[["X","Y","M",0.6,0.6]], arcs:[["M",r,th,26],["M",r,-th,26],["N",r,180-th,26],["N",r,180+th,26]], dots:["M","N"], lab:["M","N"], off:{M:[-14,4],N:[14,4]}, k:32, alt:"Médiatrice au compas"}); })();
const me=ri(21,79)/10, pe=ri(20,50)/10, pf=pe+ri(5,15)/10;
const losN=pick(["ABCD","EFGH","MNPQ","RSTU","IJKL"]).split(""), losD=Math.random()<0.5;
const [l1,l2,l3,l4]=losN, dg1=losD?[l2,l4]:[l1,l3], dg2=losD?[l1,l3]:[l2,l4];

/* ================= 2. Cercle circonscrit ================= */
const T1=genTri("aigu"), T3=genTri("obtus");
const [ex,ey,ez]=pick([[3,4,5],[6,8,10],[4.5,6,7.5],[3.6,4.8,6]]);
const rectSVG=(()=>{ const P={D:[0,ex],E:[0,0],F:[ey,0]}; P.O=V.mid(P.D,P.F); return geo({P, poly:[["D","E","F"]], k:26, right:[["E","F","D"]], circ:[["O",ez/2]], ticks:[["D","O"],["O","F"]], dots:["O"], off:{O:[12,-10]}, cen:[ey/3,ex/3], alt:"Cercle circonscrit au triangle DEF rectangle en E"}); })();
const VF8=shuf([
  ["Le centre du cercle circonscrit à un triangle est à égale distance des trois sommets du triangle.",true,"Le centre est le point de concours des médiatrices : OA = OB = OC."],
  ["Le centre du cercle circonscrit à un triangle est toujours à l'intérieur du triangle.",false,"Il est à l'intérieur si les trois angles sont aigus, sur l'hypoténuse pour un triangle rectangle et à l'extérieur si un angle est obtus."],
  ["Pour trouver le centre du cercle circonscrit, il faut obligatoirement tracer les trois médiatrices.",false,"Deux médiatrices suffisent."],
  ["Le centre du cercle circonscrit à un triangle rectangle est le milieu de l'hypoténuse.",true,"Le cercle circonscrit a pour diamètre l'hypoténuse."],
  ["Si un côté d'un triangle est un diamètre de son cercle circonscrit, alors ce triangle est rectangle.",true,"C'est une propriété du cours."],
  ["Si O est le point d'intersection des médiatrices de [AB] et de [AC], alors OB = OC.",true,"OA = OB et OA = OC, donc OB = OC."],
  ["Le centre du cercle circonscrit est le point de concours des hauteurs du triangle.",false,"C'est le point de concours des médiatrices des côtés."]
]).slice(0,5);
const e9a=ri(4,12)*2, e9b=ri(15,55)/10, e9c=ri(21,59)/10, e10=ri(5,16);
const dia=pick(["RST","MNP","EFG","UVW","IJK"]).split("");
const sc=pick([100,150,200,250,500]), sm=half(2,5);

/* ================= 3. Hauteurs ================= */
const tr=shuf(["hauteur","médiane","médiatrice","aucune"]);
const TRN={hauteur:"une hauteur","médiane":"une médiane","médiatrice":"une médiatrice",aucune:"aucune des trois"};
const H1=genTri("aigu"), H2=genTri("obtus");
const VF14=shuf([
  ["Une hauteur d'un triangle est toujours à l'intérieur du triangle.",false,"Dans un triangle qui a un angle obtus, deux hauteurs sont à l'extérieur du triangle."],
  ["Les trois hauteurs d'un triangle se coupent en un même point appelé l'orthocentre.",true,"C'est la propriété du cours."],
  ["L'orthocentre d'un triangle rectangle est le sommet de l'angle droit.",true,"Les deux côtés de l'angle droit sont deux hauteurs : elles se coupent au sommet de l'angle droit."],
  ["La hauteur issue du sommet A d'un triangle ABC est la droite qui passe par A et par le milieu de [BC].",false,"C'est la médiane issue de A. La hauteur est perpendiculaire à (BC)."],
  ["Si le triangle ABC est rectangle en A, alors la droite (AB) est la hauteur issue de B.",true,`(AB) passe par B et est perpendiculaire à (AC), puisque l'angle ${ang("BAC")} est droit.`],
  ["Si H est le pied de la hauteur issue de A dans le triangle ABC, alors AH est la distance du point A à la droite (BC).",true,"AH est la longueur de la hauteur issue de A."]
]).slice(0,5);

/* ================= 4. Médianes ================= */
const G1=genTri("aigu");
const m16b=ri(3,8)*2, m16h=ri(3,9), m16A=ri(101,399)/10;

/* ================= 5. Aire ================= */
const a17=[{t:"aigu",b:ri(5,10),h:ri(3,7)},{t:"rect",b:ri(4,10),h:ri(3,8)},{t:"obtus",b:ri(4,8),h:ri(3,6),e:ri(12,20)/10}];
const iso17=pick(ISO3);
const e18=[(()=>{ const b=ri(3,12), h=ri(2,10); return {A:b*h/2,b,h}; })(), (()=>{ const b=ri(3,12), h=ri(2,10); return {A:b*h/2,b,h}; })(), (()=>{ let b,h; do{ b=ri(3,9); h=ri(2,9); }while((b*h)%2===0); return {A:b*h/2,b,h}; })()];
const pb=ri(5,10), ph=ri(3,6), ps=ri(10,25)/10;
const parSVG=geo({P:{A:[0,0],B:[pb,0],C:[pb+ps,ph],D:[ps,ph],K:[ps,0]}, poly:[["A","B","C","D"]], k:Math.min(32,300/(pb+ps)), seg:[["D","K","hd"]], right:[["K","B","D",GRN]], len:[["A","B",pb+" cm"]], txt:[[ph+" cm",[ps,ph/2],28,0]], lab:["A","B","C","D"], alt:"Parallélogramme ABCD"});

/* ================= Synthèse ================= */
const [sa,sb,sc2]=pick([[6,8,10],[8,6,10],[3,4,5],[4,3,5],[4.5,6,7.5],[6,4.5,7.5],[7.5,10,12.5]]);
const sA=sa*sb/2, sFH=2*sA/sc2;
const synSVG=(()=>{ const P={E:[0,sa],F:[0,0],G:[sb,0]}; P.I=V.mid(P.E,P.G); P.H=V.foot(P.F,P.E,P.G);
  return geo({P, poly:[["E","F","G"]], k:Math.min(30,260/sc2), right:[["F","G","E"],["H","G","F",GRN]], circ:[["I",sc2/2]], seg:[["F","H","hd"],["F","I","md"]], dots:["I","H"], cen:[sb/3,sa/3], alt:"Triangle EFG rectangle en F, son cercle circonscrit, la hauteur et la médiane issues de F"}); })();

return [
 {t:"Rappels de 6e : les triangles particuliers", e:[
  {n:"Exercice 1", t:"Nature d'un triangle", w:"Sur ton cahier", h:`<p>Donne la nature de chaque triangle d'après le codage de la figure.</p><div class="figs">${nat.map((x,i)=>fig(`${"①②③④"[i]} ${x.nom}`, x.f.svg)).join("")}</div>`,
   c:nat.map((x,i)=>`<p>${"①②③④"[i]} ${x.nom} est ${natTxt(x)}. ${natEx(x.t,x.nom,x.f)}</p>`).join("")},
  {n:"Exercice 2", t:"Constructions de triangles", w:"Sur ton cahier", h:`<p>Construis chaque triangle (règle graduée, équerre et compas).</p>
   <p><b>a)</b> ABC est un triangle isocèle en A tel que AB = AC = ${F(isoA)} cm et BC = ${F(isoB)} cm.</p><p><b>b)</b> DEF est un triangle équilatéral de côté ${F(equS)} cm.</p><p><b>c)</b> MNP est un triangle rectangle en N tel que NM = ${F(rx)} cm et NP = ${F(ry)} cm.</p><p><b>d)</b> Mesure l'hypoténuse : MP = ……… cm.</p>`,
   c:`<div class="figs">${fig("a)",isoSVG)}${fig("b)",eqSVG)}${fig("c)",reSVG)}</div>
   <p><b>a)</b> On trace [BC] = ${F(isoB)} cm, puis deux arcs de rayon ${F(isoA)} cm centrés en B et en C : ils se coupent en A.</p><p><b>b)</b> On trace [DE] = ${F(equS)} cm, puis deux arcs de rayon ${F(equS)} cm centrés en D et en E : ils se coupent en F.</p><p><b>c)</b> L'angle droit ${ang("MNP")} se trace à l'équerre. <b>d)</b> MP = <b>${F(rz)} cm</b>.</p>`}
 ]},
 {t:"La médiatrice d'un segment", e:[
  {n:"Exercice 3", t:"Construire une médiatrice", w:"Sur ton cahier", h:`<p>Laisse apparents tes traits de construction.</p><p><b>a)</b> Trace un segment [EF] de ${F(segE)} cm. À l'équerre et à la règle graduée, trace sa médiatrice (m).</p><p><b>b)</b> Trace un segment [MN] de ${F(segM)} cm. Au compas et à la règle (sans équerre), trace sa médiatrice (n).</p>`,
   c:`<div class="figs">${fig("a)",medEq)}${fig("b)",medCo)}</div><p><b>a)</b> On place le milieu I de [EF] : EI = ${F(segE)} ÷ 2 = ${F(segE/2)} cm. Puis on trace la perpendiculaire à [EF] passant par I.</p><p><b>b)</b> Avec une ouverture plus grande que ${F(segM/2)} cm (la moitié de MN), on trace deux arcs centrés en M et deux arcs de même rayon centrés en N. On relie leurs points d'intersection.</p>`},
  {n:"Exercice 4", t:"Utiliser les propriétés de la médiatrice", w:"Sur ton cahier", h:`<p>La droite (d) est la médiatrice du segment [EF]. Justifie avec une propriété du cours.</p><p><b>a)</b> M est un point de (d) et ME = ${F(me)} cm. Que vaut MF ?</p><p><b>b)</b> N est un point tel que NE = NF. Où se trouve N ?</p><p><b>c)</b> P est un point tel que PE = ${F(pe)} cm et PF = ${F(pf)} cm. P appartient-il à (d) ?</p>`,
   c:`<p><b>a)</b> M est sur la médiatrice de [EF], donc ME = MF (propriété 1) : <b>MF = ${F(me)} cm</b>.</p><p><b>b)</b> N est à égale distance de E et de F, donc <b>N est sur (d)</b> (propriété 2).</p><p><b>c)</b> Si P était sur (d), on aurait PE = PF (propriété 1). Or ${F(pe)} cm ≠ ${F(pf)} cm : <b>P n'appartient pas à (d)</b>.</p>`},
  {n:"Exercice 5", t:"Une démonstration avec le losange", w:"Sur ton cahier", h:`<p>${losN.join("")} est un losange. Démontre que la droite (${dg1.join("")}) est la médiatrice du segment [${dg2.join("")}].</p>`,
   c:`<p>${losN.join("")} est un losange, donc ses quatre côtés ont la même longueur.</p><ul><li>${dg1[0]}${dg2[0]} = ${dg1[0]}${dg2[1]} : ${dg1[0]} est à égale distance de ${dg2[0]} et de ${dg2[1]}, donc ${dg1[0]} appartient à la médiatrice de [${dg2.join("")}] (propriété 2).</li><li>${dg1[1]}${dg2[0]} = ${dg1[1]}${dg2[1]} : de même, ${dg1[1]} appartient à la médiatrice de [${dg2.join("")}].</li><li>${dg1[0]} et ${dg1[1]} sont deux points distincts de cette médiatrice : <b>(${dg1.join("")}) est la médiatrice de [${dg2.join("")}]</b>.</li></ul>`}
 ]},
 {t:"Le cercle circonscrit à un triangle", e:[
  {n:"Exercice 6", t:"Construire un cercle circonscrit", w:"Sur ton cahier", h:`<p>Construis chaque triangle, puis trace son cercle circonscrit. Où se trouve son centre O : à l'intérieur, à l'extérieur ou sur un côté du triangle ?</p>
   <p><b>Cas n°1 :</b> ABC tel que ${enonceTri(T1)}.</p><p><b>Cas n°2 :</b> DEF rectangle en E tel que ED = ${F(ex)} cm et EF = ${F(ey)} cm. Donne aussi le rayon du cercle.</p><p><b>Cas n°3 :</b> ABC tel que ${enonceTri(T3)}.</p>`,
   c:`<div class="figs">${fig("Cas n°1",ccSVG(T1))}${fig("Cas n°2",rectSVG)}${fig("Cas n°3",ccSVG(T3))}</div>
   <p><b>Cas n°1 :</b> ${posO(T1,"O")}</p><p><b>Cas n°2 :</b> O est <b>sur un côté</b> : c'est le milieu de l'hypoténuse [DF]. On mesure DF = ${F(ez)} cm, donc le rayon est <b>${F(ez/2)} cm</b>.</p><p><b>Cas n°3 :</b> ${posO(T3,"O")}</p>`},
  {n:"Exercice 7", t:"Vrai ou faux ?", w:"Sur ton cahier", h:VF8.map(([s],i)=>`<p><b>${"abcde"[i]})</b> ${s}</p>`).join("")+"<p>Si l'affirmation est fausse, corrige-la.</p>",
   c:VF8.map(([,v,e],i)=>`<p><b>${"abcde"[i]}) ${v?"VRAI":"FAUX"}.</b> ${e}</p>`).join("")},
  {n:"Exercice 8", t:"Triangle rectangle et cercle circonscrit", w:"Sur ton cahier", h:`<p>Justifie avec une propriété du cours.</p><p><b>a)</b> ABC est rectangle en A et BC = ${e9a} cm. Quel est le rayon de son cercle circonscrit ?</p><p><b>b)</b> MNP est rectangle en M. Son cercle circonscrit a pour rayon ${F(e9b)} cm. Calcule NP.</p><p><b>c)</b> RST est rectangle en S et I est le milieu de [RT]. IS = ${F(e9c)} cm. Calcule RT.</p>`,
   c:`<p><b>a)</b> Le cercle circonscrit a pour diamètre l'hypoténuse [BC] : rayon = ${e9a} ÷ 2 = <b>${F(e9a/2)} cm</b>.</p><p><b>b)</b> L'hypoténuse [NP] est un diamètre : NP = 2 × ${F(e9b)} = <b>${F(2*e9b)} cm</b>.</p><p><b>c)</b> I est le centre du cercle circonscrit et IS est un rayon : RT = 2 × ${F(e9c)} = <b>${F(2*e9c)} cm</b>.</p>`},
  {n:"Exercice 9", t:"Démonstrations", w:"Sur ton cahier", h:`<p><b>a)</b> [${dia[0]}${dia[1]}] est un diamètre d'un cercle de centre O et ${dia[2]} est un autre point de ce cercle. Quelle est la nature du triangle ${dia.join("")} ? Justifie.</p><p><b>b)</b> ABC est rectangle en A et I est le milieu de [BC]. Démontre que IA = IB = IC, puis calcule IA lorsque BC = ${e10} cm.</p>`,
   c:`<p><b>a)</b> Le triangle ${dia.join("")} est inscrit dans le cercle et son côté [${dia[0]}${dia[1]}] est un diamètre. Donc <b>${dia.join("")} est rectangle en ${dia[2]}</b>.</p><p><b>b)</b> ABC est rectangle en A, donc son cercle circonscrit a pour diamètre [BC] : son centre est I. A, B et C sont sur ce cercle, donc IA = IB = IC (rayons). IA = ${e10} ÷ 2 = <b>${F(e10/2)} cm</b>.</p>`},
  {n:"Exercice 10", t:"Une station de secours", w:"Sur ton cahier", h:`<p>Une station de secours doit être installée à égale distance de trois villes. Sur le plan, 1 cm représente ${sc} km.</p><p><b>1)</b> Quelle propriété permet de construire le point S de la station ?</p><p><b>2)</b> Sur le plan, on mesure entre S et la première ville : ${F(sm)} cm. Calcule la distance réelle.</p>`,
   c:`<p><b>1)</b> S est le centre du cercle circonscrit au triangle formé par les trois villes : c'est le point de concours des médiatrices des côtés. Il est à égale distance des trois sommets.</p><p><b>2)</b> ${F(sm)} × ${sc} = <b>${F(sm*sc)} km</b> (la même distance pour les trois villes).</p>`}
 ]},
 {t:"Les hauteurs d'un triangle", e:[
  {n:"Exercice 11", t:"Hauteur, médiane ou médiatrice ?", w:"Sur ton cahier", h:`<p>Dans chaque figure, le trait épais est-il une hauteur, une médiane, une médiatrice ou aucune des trois ? Justifie.</p><div class="figs">${tr.map((t,i)=>fig(`Figure ${"①②③④"[i]}`, traitFig(t))).join("")}</div>`,
   c:tr.map((t,i)=>`<p><b>${"①②③④"[i]} ${TRN[t][0].toUpperCase()+TRN[t].slice(1)}.</b> ${TRAIT_EX[t]}</p>`).join("")},
  {n:"Exercice 12", t:"Construire des hauteurs", w:"Sur ton cahier", h:`<p>Construis chaque triangle, trace ses trois hauteurs (prolonge les côtés si besoin) et nomme H leur point commun. H est-il à l'intérieur ou à l'extérieur du triangle ?</p><p><b>Cas n°1 :</b> ABC tel que ${enonceTri(H1)}.</p><p><b>Cas n°2 :</b> ABC tel que ${enonceTri(H2)}.</p>`,
   c:`<div class="figs">${fig("Cas n°1",hautSVG(H1))}${fig("Cas n°2",hautSVG(H2))}</div><p><b>Cas n°1 :</b> ${posO(H1,"H")}</p><p><b>Cas n°2 :</b> ${posO(H2,"H")} Il faut prolonger les côtés (pointillés).</p>`},
  {n:"Exercice 13", t:"Vrai ou faux ?", w:"Sur ton cahier", h:VF14.map(([s],i)=>`<p><b>${"abcde"[i]})</b> ${s}</p>`).join("")+"<p>Si l'affirmation est fausse, corrige-la.</p>",
   c:VF14.map(([,v,e],i)=>`<p><b>${"abcde"[i]}) ${v?"VRAI":"FAUX"}.</b> ${e}</p>`).join("")}
 ]},
 {t:"Les médianes d'un triangle", e:[
  {n:"Exercice 14", t:"Construire des médianes", w:"Sur ton cahier", h:`<p>Construis le triangle ABC tel que ${enonceTri(G1)}.</p><p>Place les milieux des trois côtés, puis trace les trois médianes. Que constates-tu ?</p>`,
   c:`${medSVG(G1)}<p>Les milieux : BC ÷ 2 = ${F(G1.a/2)} cm ; AC ÷ 2 = ${F(G1.b/2)} cm ; AB ÷ 2 = ${F(G1.c/2)} cm.</p><p>Les trois médianes se coupent en un même point G : <b>le centre de gravité</b> du triangle.</p>`},
  {n:"Exercice 15", t:"Médiane et aire", w:"Sur ton cahier", h:`<p>ABC est un triangle tel que BC = ${m16b} cm. La hauteur issue de A mesure ${m16h} cm. I est le milieu de [BC].</p><p><b>a)</b> Calcule l'aire du triangle ABC.</p><p><b>b)</b> Calcule BI, puis l'aire du triangle ABI.</p><p><b>c)</b> Calcule l'aire du triangle AIC. Que constates-tu ?</p><p><b>d)</b> Le triangle MNP a pour aire ${F(m16A)} cm². Q est le milieu de [NP]. Quelle est l'aire du triangle MNQ ?</p>`,
   c:`<p><b>a)</b> Aire(ABC) = ${m16b} × ${m16h} ÷ 2 = <b>${F(m16b*m16h/2)} cm²</b>.</p><p><b>b)</b> BI = ${m16b} ÷ 2 = <b>${m16b/2} cm</b> ; Aire(ABI) = ${m16b/2} × ${m16h} ÷ 2 = <b>${F(m16b*m16h/4)} cm²</b>.</p><p><b>c)</b> Aire(AIC) = ${m16b/2} × ${m16h} ÷ 2 = <b>${F(m16b*m16h/4)} cm²</b>. Les deux triangles ont la même aire : une médiane partage un triangle en deux triangles de même aire.</p><p><b>d)</b> (MQ) est une médiane : Aire(MNQ) = ${F(m16A)} ÷ 2 = <b>${F(m16A/2)} cm²</b>.</p>`}
 ]},
 {t:"L'aire d'un triangle", e:[
  {n:"Exercice 16", t:"Calculer des aires", w:"Sur ton cahier", h:`<p>Calcule l'aire de chaque triangle (figures non à l'échelle). Attention : une donnée peut être inutile !</p><div class="figs">${a17.map((x,i)=>fig(`Triangle ${"①②③"[i]}`, aireFig(x.t,x.b,x.h,x.e))).join("")}${fig("Triangle ④", aireFig("iso",iso17[0],iso17[1],iso17[2]))}</div>`,
   c:`<p>Aire = base × hauteur ÷ 2, avec la hauteur perpendiculaire à la base.</p><p><b>①</b></p><p class="calc">A = ${a17[0].b} × ${a17[0].h} ÷ 2<br>A = ${a17[0].b*a17[0].h} ÷ 2<br>A = <b>${F(a17[0].b*a17[0].h/2)} cm²</b></p><p><b>②</b> Les côtés de l'angle droit sont base et hauteur :</p><p class="calc">A = ${a17[1].b} × ${a17[1].h} ÷ 2<br>A = ${a17[1].b*a17[1].h} ÷ 2<br>A = <b>${F(a17[1].b*a17[1].h/2)} cm²</b></p><p><b>③</b> La hauteur est à l'extérieur :</p><p class="calc">A = ${a17[2].b} × ${a17[2].h} ÷ 2<br>A = ${a17[2].b*a17[2].h} ÷ 2<br>A = <b>${F(a17[2].b*a17[2].h/2)} cm²</b></p><p><b>④</b> La longueur ${F(iso17[2])} cm ne sert pas :</p><p class="calc">A = ${F(iso17[0])} × ${F(iso17[1])} ÷ 2<br>A = ${F(iso17[0]*iso17[1])} ÷ 2<br>A = <b>${F(iso17[0]*iso17[1]/2)} cm²</b></p>`},
  {n:"Exercice 17", t:"Retrouver une longueur", w:"Sur ton cahier", h:`<p>Rappel : base × hauteur = Aire × 2.</p><p><b>a)</b> Un triangle a pour aire ${F(e18[0].A)} cm² et pour base ${e18[0].b} cm. Calcule la hauteur correspondante.</p><p><b>b)</b> Un triangle a pour aire ${F(e18[1].A)} cm² et pour hauteur ${e18[1].h} cm. Calcule la base correspondante.</p><p><b>c)</b> Un triangle a pour aire ${F(e18[2].A)} cm² et pour base ${e18[2].b} cm. Calcule la hauteur correspondante.</p>`,
   c:`<p><b>a)</b> La hauteur h :</p><p class="calc">h = ${F(e18[0].A)} × 2 ÷ ${e18[0].b}<br>h = ${F(2*e18[0].A)} ÷ ${e18[0].b}<br>h = <b>${e18[0].h} cm</b></p><p><b>b)</b> La base b :</p><p class="calc">b = ${F(e18[1].A)} × 2 ÷ ${e18[1].h}<br>b = ${F(2*e18[1].A)} ÷ ${e18[1].h}<br>b = <b>${e18[1].b} cm</b></p><p><b>c)</b> La hauteur h :</p><p class="calc">h = ${F(e18[2].A)} × 2 ÷ ${e18[2].b}<br>h = ${F(2*e18[2].A)} ÷ ${e18[2].b}<br>h = <b>${e18[2].h} cm</b></p>`},
  {n:"Exercice 18", t:"Parallélogramme et triangle", w:"Sur ton cahier", h:`<p>ABCD est un parallélogramme : (AB) // (DC) et (AD) // (BC). AB = ${pb} cm et la hauteur issue de D mesure ${ph} cm.</p>${parSVG}<p><b>a)</b> Calcule l'aire du parallélogramme ABCD.</p><p><b>b)</b> Quelle est l'aire du triangle ABC ? Explique.</p>`,
   c:`<p><b>a)</b> Aire(ABCD) = ${pb} × ${ph} = <b>${pb*ph} cm²</b>.</p><p><b>b)</b> La diagonale [AC] partage le parallélogramme en deux triangles de même aire : Aire(ABC) = ${pb*ph} ÷ 2 = <b>${F(pb*ph/2)} cm²</b>.</p>`}
 ]},
 {t:"Problème de synthèse", e:[
  {n:"Exercice 19", t:"Un triangle qui sait tout faire", w:"Sur ton cahier", h:`<p>Construis le triangle EFG tel que EF = ${F(sa)} cm, FG = ${F(sb)} cm et EG = ${F(sc2)} cm.</p><p><b>1)</b> Vérifie à l'équerre que EFG est rectangle en F. Quel côté est l'hypoténuse ?</p><p><b>2)</b> Trace son cercle circonscrit sans tracer de médiatrice. Donne son rayon.</p><p><b>3)</b> Trace la hauteur issue de F (pied H). Calcule l'aire de EFG avec EF et FG, puis déduis-en FH.</p><p><b>4)</b> Trace la médiane issue de F. I est le milieu de [EG]. Combien mesure FI ? Quelle est l'aire du triangle EFI ?</p>`,
   c:`${synSVG}<p><b>1)</b> L'angle ${ang("EFG")} est droit : l'hypoténuse est <b>[EG]</b>, le côté opposé à l'angle droit.</p><p><b>2)</b> Le cercle circonscrit a pour diamètre [EG] : son centre est le milieu I de [EG]. Rayon : ${F(sc2)} ÷ 2 = <b>${F(sc2/2)} cm</b>.</p><p><b>3)</b> Aire(EFG) = ${F(sa)} × ${F(sb)} ÷ 2 = <b>${F(sA)} cm²</b>. Avec la base [EG] : ${F(sc2)} × FH ÷ 2 = ${F(sA)}, donc :</p><p class="calc">FH = ${F(sA)} × 2 ÷ ${F(sc2)}<br>FH = ${F(2*sA)} ÷ ${F(sc2)}<br>FH = <b>${F(sFH)} cm</b></p><p><b>4)</b> F est sur le cercle de centre I : FI = <b>${F(sc2/2)} cm</b> (le rayon). Aire(EFI) = ${F(sA)} ÷ 2 = <b>${F(sA/2)} cm²</b>.</p>`}
 ]}
];
};
