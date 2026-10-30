/* 3e · chapitre 20 — fiche d'entraînement : les exercices de M. Staal sur l'homothétie, avec d'autres nombres et d'autres figures.
   Les images sont calculées (outils window.G3k20 de data/3e-20.js). */
TRAIN["3e-20"] = function(){
const {ri, pick, shuf} = TR;
const {V, F, fig, sub, homFig, randHom, randFig, natTxt, az} = window.G3k20;
const r3=x=>Math.round(x*1000)/1000;
const side=k=>k>0?"du même côté":"de part et d'autre";

/* 1. trouver le centre et le rapport sur quadrillage */
const H3=[randHom([2,3,-1,-2,0.5,-0.5]), randHom([1.5,-1.5,-3,2.5,-0.5,3])];

/* 2. centre et rapport avec des longueurs (exercices 1 et 2) */
const E1=(()=>{ const k=pick([2,3,4,1.5,2.5]), bo=ri(4,12), oe=ri(20,60)/10; return {k, bo, bc:r3(k*bo), oe, ac:r3(k*oe)}; })();
const E2=(()=>{ const k=pick([-1.5,-2,-0.4,-0.5,-2.5,-3]), bc=ri(20,80)/10; return {k, bc, bo:r3(Math.abs(k)*bc)}; })();

/* 3. calculer une longueur, un rapport, une aire */
const L4=[(()=>{ const k=pick([1.5,2,2.5,3,4]), a=ri(15,60)/10; return {k,a}; })(), (()=>{ const k=pick([-0.5,-0.25,-1.5,-2,-3]), a=ri(4,30)/2; return {k,a}; })()];
const R5=[(()=>{ const k=pick([1.2,1.5,1.6,2.5,0.4,0.8]), a=ri(10,60)/10; return {k,a,b:r3(k*a)}; })(), (()=>{ const k=pick([-1.2,-1.5,-2,-0.6,-0.5]), a=ri(10,60)/10; return {k,a,b:r3(Math.abs(k)*a)}; })(), (()=>{ const k=pick([-3,-2,-4,-2.5]), a=ri(6,24)/10; return {k,a,b:r3(Math.abs(k)*a)}; })()];
const A6=(()=>{ const k=pick([1.5,2,2.5,3,3.5,0.5,-2,-1.5]), A=ri(3,20); return {k,A,R:r3(k*k*A)}; })();

/* 4. construction sur quadrillage */
const C7=(()=>{ const k1=pick([2,3]), k2=pick([-0.5,-1]); const P={A:[0,0],B:[2*ri(1,2),0],C:[2*ri(1,3),2*ri(1,2)]};
  const all=[...Object.values(P), ...Object.values(P).map(p=>V.mul(p,k1)), ...Object.values(P).map(p=>V.mul(p,k2))], xs=all.map(p=>p[0]), ys=all.map(p=>p[1]);
  return {k1,k2,o:{P, cn:"A", tri:["A","B","C"], grid:[Math.min(...xs)-1,Math.min(...ys)-1,Math.max(...xs)+1,Math.max(...ys)+1], k:22, imgs:[[k1,"1"],[k2,"2"]], off:{A:[-12,-10]}}}; })();
const C7b=(()=>{ const k1=pick([0.5,1.5]), k2=pick([-1,-0.5,-2]); const P={O:[0,0],A:[2*ri(1,2),0],B:[2*ri(1,2),-2*ri(1,2)],C:[2*ri(2,3),2*ri(1,2)]};
  if(P.A[0]===P.B[0]&&false) P.B[0]+=2;
  const all=[...Object.values(P), ...Object.values(P).map(p=>V.mul(p,k1)), ...Object.values(P).map(p=>V.mul(p,k2))], xs=all.map(p=>p[0]), ys=all.map(p=>p[1]);
  return {k1,k2,o:{P, cn:"O", tri:["A","B","C"], grid:[Math.min(...xs)-1,Math.min(...ys)-1,Math.max(...xs)+1,Math.max(...ys)+1], k:24, imgs:[[k1,"1"],[k2,"2"]], cen:[2,0]}}; })();
const dep=(p,k)=>{ const x=r3(k*p[0]), y=r3(k*p[1]); const h=(v,a,b)=>v?`${F(Math.abs(v))} carreau${Math.abs(v)>=2?"x":""} vers ${v>0?a:b}`:""; return [h(x,"la droite","la gauche"),h(y,"le haut","le bas")].filter(Boolean).join(" et "); };
/* correction d'une construction : déplacements depuis le centre c, puis multipliés par la distance à zéro de k (dans l'autre sens si k < 0) */
const cons=(o,c,names,k1,k2)=>`<p>On compte les déplacements à partir de ${c} :</p>${names.map((n,j)=>`<p>de ${c} à ${n} : ${dep(o.P[n],1)}${j<names.length-1?" ;":"."}</p>`).join("")}`
  +[[k1,1,"a"],[k2,2,"b"]].map(([k,i,l])=>`<p><b>${l})</b> Rapport ${F(k)} : on multiplie ces déplacements par ${F(Math.abs(k))}${k<0?", <b>dans l'autre sens</b>":""}.</p>${names.map(n=>`<p>${sub(n,i)} : ${dep(o.P[n],k)} à partir de ${c}.</p>`).join("")}`).join("");

return [
 {t:"Trouver le centre et le rapport d'une homothétie", e:[
  {n:"Exercice 1", t:"Avec le quadrillage", w:"Sur ton cahier", h:`<p>Dans chaque cas, le triangle A'B'C' est l'image du triangle ABC par une homothétie. Donne son centre et son rapport.</p><div class="figs">${H3.map((H,i)=>fig("Cas "+(i+1),randFig(H,false,300))).join("")}</div>`,
   c:`<div class="figs">${H3.map((H,i)=>fig("Cas "+(i+1),randFig(H,true,300))).join("")}</div>${H3.map((H,i)=>`<p><b>Cas ${i+1} :</b> les droites (AA'), (BB') et (CC') se coupent en <b>O</b>. OA' = ${az(H.k)} × OA (on compte les carreaux) et les triangles sont ${side(H.k)} de O : rapport <b>${F(H.k)}</b>.</p>`).join("")}`},
  {n:"Exercice 2", t:"Avec des longueurs", w:"Sur ton cahier", h:`<p><b>a)</b> On passe du triangle OBE au triangle ABC par une homothétie de centre B. Les points B, O, C sont alignés dans cet ordre et B, E, A aussi. BO = ${F(E1.bo)} cm, BC = ${F(E1.bc)} cm et OE = ${F(E1.oe)} cm.</p><p>Donne le rapport de l'homothétie, puis calcule AC.</p>
   <p><b>b)</b> On passe du triangle ABC au triangle EBO par une homothétie de centre B. C a pour image O, et B est entre C et O. BC = ${F(E2.bc)} cm et BO = ${F(E2.bo)} cm.</p><p>Quel est le rapport de l'homothétie ?</p>`,
   c:`<p><b>a)</b> O a pour image C, du même côté de B :</p><p class="calc">k = ${"{BC/BO}"}<br>k = ${F(E1.bc)} ÷ ${F(E1.bo)}<br>k = <b>${F(E1.k)}</b></p><p>E a pour image A, donc :</p><p class="calc">AC = ${F(E1.k)} × OE<br>AC = ${F(E1.k)} × ${F(E1.oe)}<br>AC = <b>${F(E1.ac)} cm</b></p>
   <p><b>b)</b> ${"{BO/BC}"} = ${F(E2.bo)} ÷ ${F(E2.bc)} = ${az(E2.k)} ; C et O sont de part et d'autre de B : rapport <b>${F(E2.k)}</b>.</p>`}
 ]},
 {t:"Calculer avec le rapport d'homothétie", e:[
  {n:"Exercice 3", t:"Calculer une longueur", w:"Sur ton cahier", h:`${L4.map((x,i)=>`<p><b>${i+1})</b> Le triangle A'B'C' est l'image du triangle ABC par l'homothétie de centre O et de rapport ${F(x.k)}. AB = ${F(x.a)} cm. Calcule A'B'.</p>`).join("")}`,
   c:`<div class="calcs">${L4.map((x,i)=>`<p class="calc"><b>${i+1})</b><br>A'B' = ${az(x.k)} × ${F(x.a)}<br>A'B' = <b>${F(r3(Math.abs(x.k)*x.a))} cm</b></p>`).join("")}</div>`},
  {n:"Exercice 4", t:"Trouver le rapport d'homothétie", w:"Sur ton cahier", h:`<p>Dans chaque cas, le triangle A'B'C' est l'image du triangle ABC par une homothétie de centre O. Calcule le rapport k.</p>${R5.map((x,i)=>`<p><b>${i+1})</b> AB = ${F(x.a)} cm, A'B' = ${F(x.b)} cm et les deux triangles sont ${side(x.k)} de O.</p>`).join("")}`,
   c:R5.map((x,i)=>`<p><b>${i+1})</b> ${"{A'B'/AB}"} = ${F(x.b)} ÷ ${F(x.a)} = ${az(x.k)} ; triangles ${side(x.k)} de O : <b>k = ${F(x.k)}</b>.</p>`).join("")},
  {n:"Exercice 5", t:"Calculer une aire", w:"Sur ton cahier", h:`<p>Le triangle A'B'C' est l'image du triangle ABC par l'homothétie de centre O de rapport ${F(A6.k)}.</p><p>L'aire du triangle ABC est égale à ${A6.A} cm².</p><p>Calcule l'aire du triangle A'B'C'.</p>`,
   c:`<p>Les aires sont multipliées par k² = (${F(A6.k)})² = ${F(r3(A6.k*A6.k))}.</p><p class="calc">Aire(A'B'C') = ${F(r3(A6.k*A6.k))} × ${A6.A}<br>Aire(A'B'C') = ${F(A6.R)} cm²</p>`}
 ]},
 {t:"Construire l'image d'une figure", e:[
  {n:"Exercice 6", t:"Construction (centre A)", w:"Sur ton cahier", h:`<p>Recopie la figure en respectant les carreaux.</p><p><b>a)</b> Trace le triangle ${sub("A",1)}${sub("B",1)}${sub("C",1)}, image du triangle ABC par l'homothétie de centre A et de rapport ${F(C7.k1)}.</p><p><b>b)</b> Trace le triangle ${sub("A",2)}${sub("B",2)}${sub("C",2)}, image du triangle ABC par l'homothétie de centre A et de rapport ${F(C7.k2)}.</p>${homFig(C7.o)}`,
   c:`<p>A est le centre : il est sa propre image (${sub("A",1)} = ${sub("A",2)} = A).</p>${cons(C7.o,"A",["B","C"],C7.k1,C7.k2)}${homFig({...C7.o, show:true})}`},
  {n:"Exercice 7", t:"Construction (centre O)", w:"Sur ton cahier", h:`<p>Recopie la figure en respectant les carreaux.</p><p><b>a)</b> Trace le triangle ${sub("A",1)}${sub("B",1)}${sub("C",1)}, image du triangle ABC par l'homothétie de centre O et de rapport ${F(C7b.k1)}.</p><p><b>b)</b> Trace le triangle ${sub("A",2)}${sub("B",2)}${sub("C",2)}, image du triangle ABC par l'homothétie de centre O et de rapport ${F(C7b.k2)}.</p>${homFig(C7b.o)}`,
   c:`${cons(C7b.o,"O",["A","B","C"],C7b.k1,C7b.k2)}${homFig({...C7b.o, show:true})}`}
 ]}
];
};
