/* 4e · chapitre 19 — fiche d'entraînement : les exercices de M. Staal (puissances négatives, puissances de 10, préfixes), avec d'autres nombres. */
TRAIN["4e-19"] = function(){
const {ri, pick, shuf, distinct} = TR;
const {F, P, pw, PU, fr, dev, dec10, cols, tabH, jetons} = window.PUI19;
const L="abcdefghij", NM="ABCDEFGHIJ";
/* calculs en chaîne « A = … » : une ligne par étape */
const {chns}=window.CHN4, CL=(N,s)=>[N,s.split(" = ")];

/* ===== Exercice 1 : contamination ===== */
const C1={k:pick([2,3,4,5]), d:ri(5,9)};
/* ===== Exercice 2 : produits → puissances ===== */
const E2=distinct(4,()=>[ri(2,9),ri(3,7)],x=>x[0]);
/* ===== Exercice 3 : calculer ===== */
const E3=distinct(8,()=>{ const t=pick([0,1,2]); return t===0?[ri(2,5),ri(2,4)]:t===1?[10,ri(2,9)]:[-ri(2,5),ri(1,3)]; },x=>x.join());
/* ===== Exercice 4 : quotients → exposant négatif ===== */
const E4=distinct(4,()=>[ri(2,9),ri(2,5)],x=>x[0]);
/* ===== Exercice 5 : fractions ===== */
const E5=distinct(6,()=>{ const s=pick([1,1,-1]), a=s*ri(2,6), n=ri(1,a===2||a===-2?5:3); return [a,n]; },x=>x.join());
const fracNeg=(a,n)=>{ const v=a**n; return `${pw(a,-n)} = ${fr(1,PU(a,n))}${n>1?` = ${fr(1,dev(a,n))}`:""} = ${v<0?`−${fr(1,-v)}`:fr(1,v)}`; };
/* ===== Exercice 6 : puissances de 10 ===== */
const E6=distinct(6,()=>{ const n=pick([-1,1])*ri(1,9); return n; },x=>x);
const J6=(()=>{ const ns=distinct(6,()=>pick([-1,1])*ri(1,9),x=>x); const t=[]; ns.forEach(n=>{ t.push(`10<sup>${F(n)}</sup>`); t.push(n<0&&Math.random()<0.3?fr(1,PU(10,-n)):dec10(n)); }); return {ns, t:shuf(t)}; })();
/* ===== Exercice 7 : conversions ===== */
const CONV=[
  ()=>{ const x=ri(2,99); return [`${x} Go`,"o",`${F(x)} × 10<sup>9</sup> o = ${F(x*1e9)} o`, F(x*1e9)]; },
  ()=>{ const x=ri(11,9999); return [`${F(x)} nm`,"μm",`1 μm = 1 000 nm, donc ${F(x)} nm = ${F(x/1000)} μm`, F(x/1000)]; },
  ()=>{ const x=ri(11,9999)*10; return [`${F(x)} nm`,"mm",`1 mm = 1 000 000 nm, donc ${F(x)} nm = ${F(x/1e6)} mm`, F(x/1e6)]; },
  ()=>{ const x=ri(101,999)*100; return [`${F(x)} kg`,"Mg",`1 Mg = 1 000 kg, donc ${F(x)} kg = ${F(x/1000)} Mg`, F(x/1000)]; },
  ()=>{ const x=ri(11,99)/10; return [`${F(x/1e6)} kg`,"mg",`1 kg = 1 000 000 mg, donc ${F(x/1e6)} kg = ${F(x)} mg`, F(x)]; },
  ()=>{ const x=ri(11,999)/10; return [`${F(x/1000)} mm`,"μm",`1 mm = 1 000 μm, donc ${F(x/1000)} mm = ${F(x)} μm`, F(x)]; },
  ()=>{ const x=ri(11,999)/10; return [`${F(x)} Gm`,"Mm",`1 Gm = 1 000 Mm, donc ${F(x)} Gm = ${F(x*1000)} Mm`, F(x*1000)]; }
];
const E7=shuf(CONV).slice(0,5).map(f=>f());
/* ===== Activité : unité adaptée ===== */
const ADP=[
  ()=>{ const x=ri(1001,9999)/10; return [`${F(x*1e6)} m`, `${F(x)} Mm`, "1 Mm = 1 000 000 m"]; },
  ()=>{ const x=ri(101,999); return [`${F(x*1000)} m`, `${F(x)} km`, "1 km = 1 000 m"]; },
  ()=>{ const x=ri(2,9); return [`${F(x/1000)} m`, `${x} mm`, "1 mm = 0,001 m"]; },
  ()=>{ const x=ri(2,90); return [`${F(x/1e6)} m`, `${x} μm`, "1 μm = 0,000 001 m"]; },
  ()=>{ const x=ri(2,900); return [`${F(x/1e9)} m`, `${x} nm`, "1 nm = 0,000 000 001 m"]; },
  ()=>{ const x=ri(11,999)/10; return [`${F(x*1e9)} m`, `${F(x)} Gm`, "1 Gm = 1 000 000 000 m"]; }
];
const A1=shuf(ADP).slice(0,4).map(f=>f());

return [
 {t:"Rappels : les puissances d'exposant positif", e:[
  {n:"Exercice 1", t:"La contamination", w:"Sur ton cahier", h:`<p>Une personne contaminée par un virus contamine ${C1.k} personnes. Le jour 1, une personne est malade. Le jour 2, elle contamine ${C1.k} personnes. Le jour 3, chacune de ces personnes contamine ${C1.k} nouvelles personnes. Et ainsi de suite.</p><p>Combien de nouvelles personnes seront contaminées le jour ${C1.d} ?</p>`,
   c:`<p>Jour 1 : ${C1.k}<sup>0</sup> = 1 ; jour 2 : ${C1.k}<sup>1</sup> = ${C1.k} ; jour 3 : ${C1.k}<sup>2</sup> = ${C1.k**2}. L'exposant vaut le numéro du jour moins 1.</p><p class="calc">Jour ${C1.d} : ${C1.k}<sup>${C1.d-1}</sup> = ${F(C1.k**(C1.d-1))}</p>`},
  {n:"Exercice 2", t:"Écrire sous forme d'une puissance", w:"Sur ton cahier", h:`<p>Écris chaque produit sous la forme d'une puissance.</p>${cols(E2.map(([a,n],i)=>`${L[i]}) ${dev(a,n)}`))}`,
   c:cols(E2.map(([a,n],i)=>`${L[i]}) ${dev(a,n)} = ${a}<sup>${n}</sup>`))},
  {n:"Exercice 3", t:"Calculer des puissances", w:"Sur ton cahier", h:`<p>Calcule.</p>${cols(E3.map(([a,n],i)=>`${NM[i]} = ${pw(a,n)}`))}`,
   c:chns(E3.map(([a,n],i)=>CL(NM[i],`${pw(a,n)} = ${a===10?"":dev(a,n)+" = "}${F(a**n)}`)))}
 ]},
 {t:"Les puissances négatives", e:[
  {n:"Exercice 4", t:"Écrire avec un exposant négatif", w:"Sur ton cahier", h:`<p>Écris chaque quotient sous la forme d'une puissance d'exposant négatif.</p>${cols(E4.map(([a,n],i)=>`${NM[i]} = ${fr(1,dev(a,n))}`))}`,
   c:chns(E4.map(([a,n],i)=>CL(NM[i],`${fr(1,dev(a,n))} = ${fr(1,PU(a,n))} = ${a}<sup>−${n}</sup>`)))},
  {n:"Exercice 5", t:"Les puissances négatives", w:"Sur ton cahier", h:`<p>Écris chaque puissance sous la forme d'une fraction simplifiée.</p>${cols(E5.map(([a,n],i)=>`${NM[i]} = ${pw(a,-n)}`))}`,
   c:chns(E5.map(([a,n],i)=>CL(NM[i],fracNeg(a,n))))}
 ]},
 {t:"Les puissances de 10 négatives", e:[
  {n:"Exercice 6", t:"Les puissances de 10", w:"Sur ton cahier", h:`<p><b>Partie 1 :</b> donne le résultat sous la forme d'un nombre décimal.</p>${cols(E6.map((n,i)=>`${NM[i]} = 10<sup>${F(n)}</sup>`))}<p><b>Partie 2 :</b> associe les jetons par paire (deux jetons égaux).</p>${jetons(J6.t)}`,
   c:`<p><b>Partie 1 :</b></p>${chns(E6.map((n,i)=>CL(NM[i],`10<sup>${F(n)}</sup> = ${n<0?`${fr(1,PU(10,-n))} = `:""}${dec10(n)} &nbsp; (${n<0?"":"un 1 suivi de "}${Math.abs(n)} zéro${Math.abs(n)>1?"s":""})`)))}<p><b>Partie 2 :</b></p><p class="calc">${J6.ns.map(n=>`10<sup>${F(n)}</sup> = ${J6.t.find(t=>t!==`10<sup>${F(n)}</sup>` && (t===dec10(n)||t===fr(1,PU(10,-n))))}`).join("<br>")}</p>`}
 ]},
 {t:"Les préfixes scientifiques", e:[
  {n:"Activité 1", t:"Choisir une unité adaptée", w:"Sur ton cahier", h:`<p>Rappel : 1 Gm = 10<sup>9</sup> m ; 1 Mm = 10<sup>6</sup> m ; 1 km = 10<sup>3</sup> m ; 1 mm = 10<sup>−3</sup> m ; 1 μm = 10<sup>−6</sup> m ; 1 nm = 10<sup>−9</sup> m.</p><p>Écris chaque longueur avec une unité adaptée (le nombre obtenu doit être simple, entre 1 et 1 000).</p>${cols(A1.map((x,i)=>`${L[i]}) ${x[0]}`))}`,
   c:`<p class="calc">${A1.map((x,i)=>`${L[i]}) ${x[2]}, donc ${x[0]} = ${x[1]}`).join("<br>")}</p>`},
  {n:"Exercice 7", t:"Des conversions", w:"Sur ton cahier", h:`<p>Complète les conversions.</p>${cols(E7.map((x,i)=>`${L[i]}) ${x[0]} = … ${x[1]}`))}`,
   c:`<p class="calc">${E7.map((x,i)=>`${L[i]}) ${x[2]}`).join("<br>")}</p>`}
 ]}
];
};
