/* 4e · chapitre 21 — fiche d'entraînement : les activités et exercices de M. Staal, avec d'autres nombres.
   Chaque correction suit la méthode du cours : tester, conjecturer, démontrer (ou contre-exemple). */
TRAIN["4e-21"] = function(){
const {ri, pick, shuf} = TR;
const {X, E, R, prod, prog, progs, F} = window.CL7;
const {S, rect} = window.CL12;
const {dev2} = window.CL13;
const {sqTri, ex8fig, two} = window.CL21;
const x=X("x");
const lineP=(n,arr)=>arr.map(l=>`${n} = ${l}`).join("<br>");
const box=(n,arr)=>`<p class="calc">${lineP(n,arr)}</p>`;
const sg=v=>v<0?`(${F(v)})`:F(v);

/* ===== Programmes « × a puis + b » et « + c puis × d » (égaux si a = d et b = c d) ===== */
function progPair(eq){ const d=ri(2,6), c=ri(1,8); let a=d, b=c*d;
  if(!eq){ if(Math.random()<0.5) b=b+pick([-3,-2,-1,1,2,3]); else { a=d+pick([-1,1]); if(a<2) a=d+1; } }
  return {a,b,c,d,eq:a===d&&b===c*d}; }
function corrPair(o,t1){ const P1=t=>t*o.a+o.b, P2=t=>(t+o.c)*o.d;
  let s=`<p>Je teste avec ${t1} :</p>${two(box("P1",[`${t1} × ${o.a} + ${o.b}`,`${t1*o.a} + ${o.b}`,`<b>${P1(t1)}</b>`]),box("P2",[`(${t1} + ${o.c}) × ${o.d}`,`${sg(t1+o.c)} × ${o.d}`,`<b>${P2(t1)}</b>`]))}`;
  if(P1(t1)!==P2(t1)) return s+`<p>${P1(t1)} ≠ ${P2(t1)} : c'est un contre-exemple. <b>Les deux programmes ne donnent pas toujours le même résultat.</b></p>`;
  s+=`<p>Les résultats sont égaux, mais un exemple ne suffit pas. Je note ${x} le nombre de départ :</p>${two(box("P1",[`${x} × ${o.a} + ${o.b}`,`<b>${S([[o.a,"x"],[o.b,""]])}</b>`]),box("P2",[`(${x} + ${o.c}) × ${o.d}`,`${o.d} × ${x} + ${o.d} × ${o.c}`,`<b>${S([[o.d,"x"],[o.c*o.d,""]])}</b>`]))}`;
  return s+(o.eq?`<p>Les expressions réduites sont égales : <b>les deux programmes donneront toujours le même résultat</b>.</p>`:`<p>Les expressions réduites ne sont pas égales : <b>les programmes ne donnent pas toujours le même résultat</b> (on pourrait trouver un contre-exemple).</p>`);
}
const A1=progPair(true), E1=(()=>{ const d=ri(2,6), c=ri(1,8); return {a:d, b:-c*d, c:-c, d, eq:true}; })(), E3=progPair(false);
const P1h=o=>prog("Programme 1",["Choisir un nombre",`Multiplier par ${o.a}`,o.b<0?`Soustraire ${-o.b}`:`Ajouter ${o.b}`]);
const P2h=o=>prog("Programme 2",["Choisir un nombre",o.c<0?`Soustraire ${-o.c}`:`Ajouter ${o.c}`,`Multiplier par ${o.d}`]);
function corrPairS(o,t1){ /* version avec soustractions (exercice 1) */
  const P1=t=>t*o.a+o.b, P2=t=>(t+o.c)*o.d;
  return `<p>Je teste avec ${t1} :</p>${two(box("P1",[`${t1} × ${o.a} − ${-o.b}`,`${t1*o.a} − ${-o.b}`,`<b>${P1(t1)}</b>`]),box("P2",[`(${t1} − ${-o.c}) × ${o.d}`,`${sg(t1+o.c)} × ${o.d}`,`<b>${P2(t1)}</b>`]))}<p>Il me semble que les programmes donnent toujours le même résultat. Prouvons-le avec ${x} :</p>
   ${two(box("P1",[`${x} × ${o.a} − ${-o.b}`,`<b>${S([[o.a,"x"],[o.b,""]])}</b>`]),box("P2",[`(${x} − ${-o.c}) × ${o.d}`,`${o.d} × ${x} + ${o.d} × (−${-o.c})`,`<b>${S([[o.d,"x"],[o.c*o.d,""]])}</b>`]))}<p>Les expressions réduites sont égales : <b>les deux programmes donneront toujours le même résultat</b>.</p>`; }
const t1=ri(2,9), t2=ri(2,9);

/* ===== Exercice 2 : rectangles (x + p) × k x et (k x + k p) × x : toujours égaux ===== */
const p2=ri(2,9), k2=ri(2,5);
/* ===== Exercice 4 : carré de côté x + p, triangle x + q, x + q, 2x ===== */
const p4=ri(2,8), eq4=Math.random()<0.6, q4=eq4?2*p4:2*p4+pick([1,2,3]);
/* ===== Exercice 5 : tour de magie ===== */
const a5=ri(2,9), k5=ri(2,5);
/* ===== Exercice 6 : (m x + n) × k x et (m' x + n') × k' x, égaux pour x = 1 seulement ===== */
const R6=(()=>{ for(let g=0;g<500;g++){ const m=ri(2,6), n=ri(1,5), k=ri(1,3), m2=ri(2,6), n2=ri(1,5), k2=ri(1,3);
    if(k*(m+n)===k2*(m2+n2) && k*m!==k2*m2) return {m,n,k,m2,n2,k2}; } return {m:4,n:2,k:2,m2:3,n2:1,k2:3}; })();
const A6=(m,n,k,t)=>(m*t+n)*k*t;
const kx=k=>k===1?x:`${k}${x}`;
/* ===== Activité 2 : (x − 2a) × x + a² et (x − a)² ===== */
const a7=ri(2,7), t7=[ri(1,9), ri(10,15)];
/* ===== Exercice 7 : (x − a)² − b² et (x − a + b)(x − a − b) ===== */
const b8=ri(2,4), a8=b8+ri(1,4), xs8=[a8+b8+1+ri(0,3), a8+b8+6+ri(0,4)];
/* ===== Exercice 8 : longueur L ===== */
const L9=pick([4,6,7,8]), x9=[ri(1,L9-1)], x9b=[1, Math.min(3,L9-1)];

return [
 {t:"Démontrer que deux expressions sont égales ou non", e:[
  {n:"Activité 1", t:"Deux programmes de calcul", w:"Sur ton cahier", h:`${progs(P1h(A1),P2h(A1))}<p>Si on choisit un même nombre au départ, est-ce que les programmes 1 et 2 donneront toujours le même résultat ? <b>Justifie soigneusement.</b></p>`, c:corrPair(A1,t1)},
  {n:"Exercice 1", t:"Deux programmes de calcul", w:"Sur ton cahier", h:`${progs(P1h(E1),P2h(E1))}<p>Si je choisis le même nombre de départ, est-ce que les programmes 1 et 2 donneront toujours le même résultat ?</p>`, c:corrPairS(E1,t2+5)},
  {n:"Exercice 2", t:"Deux rectangles", w:"Sur ton cahier", h:`<div class="figs">${rect({top:[[`<i>x</i> + ${p2}`,140]], left:`${k2}<i>x</i>`, H:80, alt:`Rectangle de longueur x + ${p2} et de largeur ${k2}x`})}${rect({top:[[`${k2}<i>x</i> + ${k2*p2}`,180]], left:"<i>x</i>", H:50, alt:`Rectangle de longueur ${k2}x + ${k2*p2} et de largeur x`})}</div><p>${x} désigne un nombre positif. Démontre que ces deux rectangles ont la même aire, quelle que soit la valeur de ${x}.</p>`,
   c:`<p>On exprime l'aire de chaque rectangle en fonction de ${x} :</p>${two(box("A1",[`(${x} + ${p2}) × ${k2}${x}`,`${k2}${x} × ${x} + ${k2}${x} × ${p2}`,`<b>${S([[k2,"x2"],[k2*p2,"x"]])}</b>`]),box("A2",[`(${k2}${x} + ${k2*p2}) × ${x}`,`${x} × ${k2}${x} + ${x} × ${k2*p2}`,`<b>${S([[k2,"x2"],[k2*p2,"x"]])}</b>`]))}<p><b>Les deux rectangles auront toujours la même aire.</b></p>`},
  {n:"Exercice 3", t:"Deux autres programmes", w:"Sur ton cahier", h:`${progs(P1h(E3),P2h(E3))}<p>Si je choisis le même nombre de départ, est-ce que les programmes 1 et 2 donneront toujours le même résultat ?</p>`, c:corrPair(E3,ri(1,9))},
  {n:"Exercice 4", t:"Deux périmètres", w:"Sur ton cahier", h:`${sqTri(`<i>x</i> + ${p4}`,`<i>x</i> + ${q4}`,"2<i>x</i>")}<p>Le carré a pour côté ${x} + ${p4}. Le triangle a deux côtés de longueur ${x} + ${q4} et un côté de longueur 2${x}.</p><p>${x} est un nombre positif. Ces deux figures ont-elles toujours le même périmètre ?</p>`,
   c:`<p>J'écris les périmètres avec ${x} :</p>${two(box("P1",[`(${x} + ${p4}) × 4`,`4 × ${x} + 4 × ${p4}`,`<b>${S([[4,"x"],[4*p4,""]])}</b>`]),box("P2",[`(${x} + ${q4}) × 2 + 2${x}`,`2 × ${x} + 2 × ${q4} + 2${x}`,`2${x} + ${2*q4} + 2${x}`,`<b>${S([[4,"x"],[2*q4,""]])}</b>`]))}
   <p>${eq4?`Les expressions réduites sont égales : <b>les deux figures auront toujours le même périmètre</b>.`:`Les expressions réduites ne sont pas égales : <b>les périmètres ne sont pas toujours égaux</b>. Par exemple, pour ${x} = 1 : ${4+4*p4} et ${4+2*q4}.`}</p>`},
  {n:"Exercice 5", t:"Tour de magie", w:"Sur ton cahier", h:`<p>Choisis un nombre. Ajoute ${a5}, multiplie le tout par ${k5}, puis soustrais ${k5===2?"le double de":k5===3?"le triple de":k5+" fois"} ton nombre de départ.</p><p>Je pense que ton résultat est ${k5*a5}. Comment ai-je fait ? Explique.</p>`,
   c:`<p>J'essaie avec 2 :</p>${box("A",[`(2 + ${a5}) × ${k5} − ${k5} × 2`,`${2+a5} × ${k5} − ${2*k5}`,`${(2+a5)*k5} − ${2*k5}`,`<b>${k5*a5}</b>`])}<p>Un exemple ne suffit pas. Mon nombre de départ est ${x} :</p>${box("D",[`(${x} + ${a5}) × ${k5} − ${k5}${x}`,`${k5} × ${x} + ${k5} × ${a5} − ${k5}${x}`,`${k5}${x} + ${k5*a5} − ${k5}${x}`,`<b>${k5*a5}</b>`])}<p>${k5}${x} et −${k5}${x} s'annulent : on obtient toujours ${k5*a5}.</p>`},
  {n:"Exercice 6", t:"Égales pour une valeur… et pour toutes ?", w:"Sur ton cahier", h:`<div class="figs">${rect({top:[[`${R6.m}<i>x</i> + ${R6.n}`,160]], left:R6.k===1?"<i>x</i>":`${R6.k}<i>x</i>`, H:25+20*R6.k, alt:`Rectangle de longueur ${R6.m}x + ${R6.n} et de largeur ${R6.k}x`})}${rect({top:[[`${R6.m2}<i>x</i> + ${R6.n2}`,130]], left:R6.k2===1?"<i>x</i>":`${R6.k2}<i>x</i>`, H:25+20*R6.k2, alt:`Rectangle de longueur ${R6.m2}x + ${R6.n2} et de largeur ${R6.k2}x`})}</div>
   <p><b>a)</b> Démontre que pour ${x} = 1, les aires de ces deux rectangles sont égales.</p><p><b>b)</b> Ont-ils la même aire quelle que soit la valeur de ${x} ? Justifie.</p>`,
   c:`<p><b>a)</b> Avec ${x} = 1 :</p>${two(box("A1",[`(${R6.m} × 1 + ${R6.n}) × ${R6.k} × 1`,`${R6.m+R6.n} × ${R6.k}`,`<b>${A6(R6.m,R6.n,R6.k,1)}</b>`]),box("A2",[`(${R6.m2} × 1 + ${R6.n2}) × ${R6.k2} × 1`,`${R6.m2+R6.n2} × ${R6.k2}`,`<b>${A6(R6.m2,R6.n2,R6.k2,1)}</b>`]))}<p>Pour ${x} = 1, les aires sont égales.</p>
   <p><b>b)</b> Avec ${x} = 2 :</p>${two(box("A1",[`(${R6.m} × 2 + ${R6.n}) × ${R6.k} × 2`,`${R6.m*2+R6.n} × ${2*R6.k}`,`<b>${A6(R6.m,R6.n,R6.k,2)}</b>`]),box("A2",[`(${R6.m2} × 2 + ${R6.n2}) × ${R6.k2} × 2`,`${R6.m2*2+R6.n2} × ${2*R6.k2}`,`<b>${A6(R6.m2,R6.n2,R6.k2,2)}</b>`]))}<p>${A6(R6.m,R6.n,R6.k,2)} ≠ ${A6(R6.m2,R6.n2,R6.k2,2)} : c'est un contre-exemple. <b>Les rectangles n'ont pas toujours la même aire.</b></p><p>En effet, en développant : A1 = ${S([[R6.k*R6.m,"x2"],[R6.k*R6.n,"x"]])} et A2 = ${S([[R6.k2*R6.m2,"x2"],[R6.k2*R6.n2,"x"]])}.</p>`}
 ]},
 {t:"Démontrer avec la double distributivité", e:[
  {n:"Activité 2", t:"Conjecturer, puis démontrer", w:"Sur ton cahier", h:`${progs(prog("Programme 1",["Choisir un nombre",`Soustraire ${2*a7}`,"Multiplier par le nombre de départ",`Ajouter ${a7*a7}`]),prog("Programme 2",["Choisir un nombre",`Soustraire ${a7}`,"Élever le tout au carré"]))}<p><b>1)</b> Teste chaque programme avec ${t7[0]}, puis avec ${t7[1]}.</p><p><b>2)</b> Émets une conjecture.</p><p><b>3)</b> Démontre-la.</p>`,
   c:`<p><b>1)</b></p>${t7.map(t=>`<p>Avec ${t} :</p>${two(box("P1",[`(${t} − ${2*a7}) × ${t} + ${a7*a7}`,`${sg(t-2*a7)} × ${t} + ${a7*a7}`,`${F((t-2*a7)*t)} + ${a7*a7}`,`<b>${F((t-2*a7)*t+a7*a7)}</b>`]),box("P2",[`(${t} − ${a7})<sup>2</sup>`,`${sg(t-a7)}<sup>2</sup>`,`<b>${(t-a7)**2}</b>`]))}`).join("")}<p><b>2)</b> Conjecture : les deux programmes donnent toujours le même résultat.</p>
   <p><b>3)</b> Avec ${x} :</p>${two(box("P1",[`(${x} − ${2*a7}) × ${x} + ${a7*a7}`,`${x} × ${x} + ${x} × (−${2*a7}) + ${a7*a7}`,`<b>${R([[1,"x2"],[-2*a7,"x"],[a7*a7,""]])}</b>`]),box("P2",[`(${x} − ${a7})(${x} − ${a7})`,`${x}<sup>2</sup> − ${a7}${x} − ${a7}${x} + ${a7*a7}`,`<b>${R(dev2([[1,"x"],[-a7,""]],[[1,"x"],[-a7,""]]).ps)}</b>`]))}<p>La conjecture est vraie : <b>les programmes donnent toujours le même résultat</b>.</p>`},
  {n:"Exercice 7", t:"Deux aires", w:"Sur ton cahier", h:`<p>${x} désigne un nombre supérieur à ${a8+b8}.</p><p>Figure 1 : un carré de côté ${x} − ${a8} auquel on enlève un carré de côté ${b8}.</p><p>Figure 2 : un rectangle de longueur ${x} − ${a8-b8} et de largeur ${x} − ${a8+b8}.</p><p><b>a)</b> Calcule l'aire de chaque figure pour ${x} = ${xs8[0]} et ${x} = ${xs8[1]}.</p><p><b>b)</b> Quelle conjecture peux-tu émettre ?</p><p><b>c)</b> Démontre cette conjecture.</p>`,
   c:`<p><b>a)</b></p>${xs8.map(t=>`<p>Pour ${x} = ${t} :</p>${two(box("A1",[`(${t} − ${a8})<sup>2</sup> − ${b8}<sup>2</sup>`,`${t-a8}<sup>2</sup> − ${b8*b8}`,`${(t-a8)**2} − ${b8*b8}`,`<b>${(t-a8)**2-b8*b8}</b>`]),box("A2",[`(${t} − ${a8-b8})(${t} − ${a8+b8})`,`${t-a8+b8} × ${t-a8-b8}`,`<b>${(t-a8+b8)*(t-a8-b8)}</b>`]))}`).join("")}<p><b>b)</b> Les aires semblent toujours égales.</p>
   <p><b>c)</b></p>${two(box("A1",[`(${x} − ${a8})(${x} − ${a8}) − ${b8*b8}`,`${x}<sup>2</sup> − ${a8}${x} − ${a8}${x} + ${a8*a8} − ${b8*b8}`,`<b>${R([...dev2([[1,"x"],[-a8,""]],[[1,"x"],[-a8,""]]).ps,[-b8*b8,""]])}</b>`]),box("A2",[`(${x} − ${a8-b8})(${x} − ${a8+b8})`,`${E(dev2([[1,"x"],[-(a8-b8),""]],[[1,"x"],[-(a8+b8),""]]).ps)}`,`<b>${R(dev2([[1,"x"],[-(a8-b8),""]],[[1,"x"],[-(a8+b8),""]]).ps)}</b>`]))}<p>Les aires sont toujours égales : la conjecture est vraie.</p>`},
  {n:"Exercice 8", t:"Périmètre et aire", w:"Sur ton cahier", h:`<p>${x} désigne un nombre positif et inférieur à ${L9}.</p>${ex8fig(L9)}<p>Figure 1 : un rectangle de largeur ${x} et de longueur ${L9} + ${x} + ${x} + ${x}. Figure 2 : un rectangle de longueur ${L9} − ${x} et de largeur ${x}, accolé à un carré de côté 2${x}.</p><p><b>a)</b> Ont-elles toujours le même périmètre ?</p><p><b>b)</b> Ont-elles toujours la même aire ?</p>`,
   c:`<p><b>a)</b> J'essaie avec ${x} = 1 :</p>${two(box("P1",[`(${L9} + 3 × 1) × 2 + 1 × 2`,`${L9+3} × 2 + 2`,`${2*(L9+3)} + 2`,`<b>${8+2*L9}</b>`]),box("P2",[`(${L9} − 1) × 2 + 8 × 1`,`${L9-1} × 2 + 8`,`${2*(L9-1)} + 8`,`<b>${2*L9+6}</b>`]))}<p>${8+2*L9} ≠ ${2*L9+6} : c'est un contre-exemple. <b>Les périmètres ne sont pas toujours égaux.</b></p><p>En effet, avec ${x} : P1 = (${L9} + 3${x}) × 2 + 2${x} = ${S([[6,"x"],[2*L9,""],[2,"x"]])} et P2 = (${L9} − ${x}) × 2 + 8${x} = ${S([[2*L9,""],[-2,"x"],[8,"x"]])}.</p>
   <p><b>b)</b></p>${two(box("A1",[`${x} × (${L9} + 3${x})`,`${x} × ${L9} + ${x} × 3${x}`,`<b>${S([[L9,"x"],[3,"x2"]])}</b>`]),box("A2",[`(${L9} − ${x}) × ${x} + (2${x})<sup>2</sup>`,`${L9} × ${x} − ${x} × ${x} + 2${x} × 2${x}`,`${L9}${x} − ${x}<sup>2</sup> + 4${x}<sup>2</sup>`,`<b>${S([[L9,"x"],[-1,"x2"],[4,"x2"]])}</b>`]))}<p><b>Les aires sont toujours égales.</b></p>`}
 ]}
];
};
