/* 4e · chapitre 5 — fiche d'entraînement : les exercices de M. Staal sur les puissances, avec d'autres nombres. */
TRAIN["4e-5"] = function(){
const {ri, pick, shuf, distinct} = TR;
const {F, P, pw, dev, cols, tabH} = window.PUI4;
const L="abcdefgh", NM="ABCDEFGH";
const {chns}=window.CHN4;   /* calculs en chaîne « A = … » */
const sum=a=>a.reduce((x,y)=>x+y,0);

/* ===== Exercice 1 : vocabulaire ===== */
const V1=distinct(4,()=>[ri(2,9),ri(2,7)],x=>x[0]);
const V2=distinct(8,()=>{ const t=pick([0,1,2]), a=ri(2,6), n=ri(2,4); return {t,a,n}; },x=>JSON.stringify(x));
const vTxt=x=>x.t===0?`${x.a}<sup>${x.n}</sup>`:x.t===1?pw(-x.a,x.n):`−${x.a}<sup>${x.n}</sup>`;
const vCor=x=>x.t===0?[`${x.a}<sup>${x.n}</sup>`,dev(x.a,x.n),F(x.a**x.n)]:x.t===1?[pw(-x.a,x.n),dev(-x.a,x.n),F((-x.a)**x.n)]:[`−${x.a}<sup>${x.n}</sup>`,`−(${dev(x.a,x.n)})`,F(-(x.a**x.n))];

/* ===== Exercice 2 : quitte ou double ===== */
const Q2=(()=>{ const n=ri(5,9), S=pick([500,1000,2000,5000,10000]); let k=1; while(2**(k-1)<=S) k++; return {n, S, k}; })();

/* ===== Exercice 3 : priorités ===== */
const E3=(()=>{ const out=[];
  { const a=ri(1,9), b=ri(a+1,a+6); out.push([`(${a} − ${b})<sup>2</sup>`,[`${pw(a-b,2)}`],(a-b)**2]); }
  { const a=ri(1,9), b=ri(2,7); out.push([`${a} − ${b}<sup>2</sup>`,[`${a} − ${b*b}`],a-b*b]); }
  { const a=ri(2,4), b=ri(2,9); out.push([`${pw(-a,3)} × ${b}`,[`${F((-a)**3)} × ${b}`],(-a)**3*b]); }
  { const a=ri(2,9), b=ri(2,5); out.push([`${a} × ${b}<sup>2</sup>`,[`${a} × ${b*b}`],a*b*b]); }
  { const a=ri(2,5), b=ri(2,4); out.push([`(−${a} × ${b})<sup>2</sup>`,[`${pw(-a*b,2)}`],(a*b)**2]); }
  { const a=ri(3,8), b=ri(1,a-1), c=ri(1,20); out.push([`(−${a} + ${b})<sup>4</sup> − ${c}`,[`${pw(b-a,4)} − ${c}`,`${F((b-a)**4)} − ${c}`],(b-a)**4-c]); }
  { let a,b,c,v; do{ a=ri(2,9); b=ri(2,9); c=ri(2,9); v=a*b-c*c; }while(Math.abs(v)>2); out.push([`(${a} × ${b} − ${c}<sup>2</sup>)<sup>3</sup>`,[`(${a*b} − ${c*c})<sup>3</sup>`,`${pw(v,3)}`],v**3]); }
  return out; })();

/* ===== Exercice 4 : vrai ou faux ===== */
const E4=shuf([
  (()=>{ const a=ri(1,9), b=ri(2,6), ok=pick([0,1]); const v=ok?a+b*b:(a+b)**2; return [`${a} + ${b}<sup>2</sup> = ${F(v)}`, v===a+b*b, `${a} + ${b}<sup>2</sup> = ${a} + ${b*b} = ${F(a+b*b)} (la puissance passe avant l'addition)`]; })(),
  (()=>{ const a=ri(2,6), b=ri(2,4), ok=pick([0,1]); const v=ok?a*b**3:(a*b)**3; return [`${a} × ${b}<sup>3</sup> = ${F(v)}`, v===a*b**3, `${a} × ${b}<sup>3</sup> = ${a} × ${b**3} = ${F(a*b**3)}`]; })(),
  (()=>{ const a=ri(2,5), b=ri(2,5); return [`(${a} + ${b})<sup>2</sup> = ${a}<sup>2</sup> + ${b}<sup>2</sup>`, false, `(${a} + ${b})<sup>2</sup> = ${a+b}<sup>2</sup> = ${(a+b)**2}, alors que ${a}<sup>2</sup> + ${b}<sup>2</sup> = ${a*a} + ${b*b} = ${a*a+b*b}`]; })(),
  (()=>{ const a=ri(2,9), t=pick([0,1]); return t?[`${pw(-a,2)} = ${a*a}`, true, `${pw(-a,2)} = ${P(-a)} × ${P(-a)} = ${a*a}`]:[`−${a}<sup>2</sup> = ${a*a}`, false, `−${a}<sup>2</sup> = −(${a} × ${a}) = ${F(-a*a)}`]; })()
]);

/* ===== Exercices 5 à 8 : problèmes ===== */
const B5=(()=>{ const h=pick([2,3,4,6]), k=pick([2,3]); const d=distinct(3,()=>h*ri(2,k===2?8:6),x=>x).sort((x,y)=>x-y); return {h,k,d}; })();
const R6=(()=>{ const k=pick([2,3,4,5]), d=ri(4,7); return {k,d}; })();
const M7=(()=>({a:ri(2,5), b:ri(2,5), c:ri(2,4)}))();
const C8=ri(3,6);
const hTxt=h=>h%24===0?`${h/24} jour${h>24?"s":""}`:`${h} h`;

return [
 {t:"Définition", e:[
  {n:"Exercice 1", t:"Vocabulaire", w:"Sur ton cahier", h:`<p><b>Partie 1 :</b> recopie et complète le tableau.</p>${tabH(["Produit","Notation puissance","Se lit"],[[dev(V1[0][0],V1[0][1]),"",""],[dev(V1[1][0],V1[1][1]),"",""],["",`${V1[2][0]}<sup>${V1[2][1]}</sup>`,""],["","",`${V1[3][0]} exposant ${V1[3][1]}`]])}
   <p><b>Partie 2 :</b> écris sous la forme d'un produit et calcule.</p>${cols(V2.map((x,i)=>`${NM[i]} = ${vTxt(x)}`))}`,
   c:`${tabH(["Produit","Notation puissance","Se lit"],V1.map(([a,n])=>[dev(a,n),`${a}<sup>${n}</sup>`,`${a} exposant ${n}`]))}${chns(V2.map((x,i)=>[NM[i],vCor(x)]))}`},
  {n:"Exercice 2", t:"Jeu du « quitte ou double »", w:"Sur ton cahier", h:`<p>La première bonne réponse rapporte 1 €. Ensuite, chaque bonne réponse double le gain.</p><p><b>1)</b> Gilles a répondu correctement à ${Q2.n} questions de suite. Quel est son gain ?</p><p><b>2)</b> Combien de bonnes réponses consécutives faut-il, au minimum, pour gagner plus de ${F(Q2.S)} € ?</p>`,
   c:`<p><b>1)</b> 1 × 2<sup>${Q2.n-1}</sup> = <b>${F(2**(Q2.n-1))} €</b> (la première réponse rapporte 1 €, puis le gain double ${Q2.n-1} fois).</p><p><b>2)</b> Avec ${Q2.k-1} réponses : 2<sup>${Q2.k-2}</sup> = ${F(2**(Q2.k-2))} € ; avec ${Q2.k} réponses : 2<sup>${Q2.k-1}</sup> = ${F(2**(Q2.k-1))} €. Il faut au moins <b>${Q2.k} bonnes réponses</b>.</p>`}
 ]},
 {t:"Calculs et priorités opératoires", e:[
  {n:"Exercice 3", t:"Priorités opératoires", w:"Sur ton cahier", h:`<p>Recopie chaque calcul, puis calcule en tenant compte des priorités opératoires.</p>${cols(E3.map((x,i)=>`${"ABCDEFG"[i]} = ${x[0]}`))}`,
   c:`<div class="figs" style="gap:28px">${E3.map((x,i)=>`<p class="calc">${[x[0],...x[1],`<b>${F(x[2])}</b>`].map(t=>`${"ABCDEFG"[i]} = ${t}`).join("<br>")}</p>`).join("")}</div>`},
  {n:"Exercice 4", t:"Vrai ou faux ?", w:"Sur ton cahier", h:`<p>Dis si chaque égalité est vraie ou fausse. Justifie.</p>${cols(E4.map((x,i)=>`${L[i]}. ${x[0]}`))}`,
   c:E4.map((x,i)=>`<p><b>${L[i]}. ${x[1]?"Vrai":"Faux"} :</b> ${x[2]}.</p>`).join("")}
 ]},
 {t:"Problèmes en lien avec les puissances", e:[
  {n:"Exercice 5", t:"Les bactéries", w:"Sur ton cahier", h:`<p>Le nombre de bactéries ${B5.k===2?"double":"triple"} toutes les ${B5.h} h. Une bactérie est mise en culture.</p><p>Écris sous forme d'une puissance de ${B5.k}, puis calcule le nombre de bactéries obtenues au bout de : ${B5.d.map((d,i)=>`<b>${L[i]})</b> ${hTxt(d)}`).join(" ; ")}.</p>`,
   c:`<p class="calc">${B5.d.map((d,i)=>`${L[i]}) ${d} h = ${d/B5.h} × ${B5.h} h : ${B5.k}<sup>${d/B5.h}</sup> = ${F(B5.k**(d/B5.h))} bactéries`).join("<br>")}</p>`},
  {n:"Exercice 6", t:"La rumeur", w:"Sur ton cahier", h:`<p>Le 1<sup>er</sup> mars, Laura lance une rumeur et prévient ${R6.k} personnes. Chaque jour, chaque personne prévenue la veille prévient ${R6.k} nouvelles personnes.</p><p><b>1)</b> Combien de personnes apprennent la rumeur le 2 mars ?</p><p><b>2)</b> Combien de personnes apprennent la rumeur le ${R6.d} mars ?</p><p><b>3)</b> Combien de personnes ont appris la rumeur du 1<sup>er</sup> au ${R6.d} mars ?</p>`,
   c:`<p><b>1)</b> ${R6.k} × ${R6.k} = ${R6.k}<sup>2</sup> = <b>${R6.k**2}</b>.</p><p><b>2)</b> ${R6.k}<sup>${R6.d}</sup> = <b>${F(R6.k**R6.d)}</b>.</p><p><b>3)</b> ${Array.from({length:R6.d},(_,i)=>F(R6.k**(i+1))).join(" + ")} = <b>${F(sum(Array.from({length:R6.d},(_,i)=>R6.k**(i+1))))}</b> (sans compter Laura).</p>`},
  {n:"Exercice 7", t:"C'est au menu", w:"Sur ton cahier", h:`<p><b>1)</b> Au restaurant, Ivan a le choix entre ${M7.a} entrées et ${M7.b} plats. Combien de menus « entrée + plat » peut-il composer ?</p><p><b>2)</b> Il ajoute un dessert, à choisir parmi ${M7.c}. Combien de menus peut-il composer ?</p>`,
   c:`<p><b>1)</b> ${M7.a} × ${M7.b} = <b>${M7.a*M7.b} menus</b>.</p><p><b>2)</b> ${M7.a} × ${M7.b} × ${M7.c} = <b>${M7.a*M7.b*M7.c} menus</b>.</p>`},
  {n:"Exercice 8", t:"Codes", w:"Sur ton cahier", h:`<p>Un code est composé de ${C8} chiffres de 0 à 9. Combien y a-t-il de codes différents ?</p>`,
   c:`<p class="calc">${Array(C8).fill("10").join(" × ")} = 10<sup>${C8}</sup> = ${F(10**C8)}</p><p>Il y a <b>${F(10**C8)} codes</b>.</p>`}
 ]}
];
};
