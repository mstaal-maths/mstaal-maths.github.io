/* 5e · chapitre 12 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres.
   Chaque correction est calculée à partir des valeurs tirées. */
TRAIN["5e-12"] = function(){
const {ri, pick, shuf, distinct, items} = TR;
const {D, P, pw, prod, sq, cube, F, grid, cols} = window.PW12;
const NM = "ABCDEF";
const X = `<i>x</i>`;

/* ================= A. Le carré d'un nombre ================= */
const nA = ri(4,7);
const e1 = shuf([...distinct(3, ()=>[pick([2,3,4,5,6,7,8,9,11,12]),2], x=>x.join()), ...distinct(2, ()=>[ri(2,6),3], x=>x.join()), [pick([10,100]), pick([2,3])]]);
const e2 = distinct(6, ()=>ri(0,12), x=>x);
const e3 = shuf([
  ...distinct(2, ()=>ri(2,12), x=>x).map(n=>[P(n,2), String(n*n), `${n} × ${n}`]),
  ...distinct(2, ()=>pick([1,2,3,4,5,6,7,8,9,11,12,15,25]), x=>x).map(d=>[P(D(d/10),2), D(pw(d/10,2)), `${D(d/10)} × ${D(d/10)}`]),
  ...distinct(2, ()=>{ let p,q; do{ p=ri(1,5); q=ri(2,9); }while(p>=q); return [p,q]; }, x=>x.join()).map(([p,q])=>[P(`(${F(p,q)})`,2), F(p*p,q*q), `${F(p,q)} × ${F(p,q)}`])
]);
const n4a = ri(3,9), n4b = pick([2,4,5,6]), n4c = ri(2,9);
const secA = {t:"Le carré d'un nombre", e:[
  {n:"Exercice 1", t:"Compter des carreaux", w:"Sur ton cahier", h:`<p>Ce grand carré est formé de carreaux de 1 cm de côté.</p><div class="figs">${sq(nA)}</div><p>1) Combien de petits carrés contient-il ? Écris le calcul avec un carré.</p><p>2) Combien de petits carrés aurait un carré de côté ${nA+2} ? de côté ${nA+5} ?</p>`,
   c:`<p>1) ${nA} × ${nA} = ${P(nA,2)} = <b>${nA*nA}</b> petits carrés.</p><p>2) Côté ${nA+2} : ${P(nA+2,2)} = <b>${(nA+2)**2}</b> petits carrés. Côté ${nA+5} : ${P(nA+5,2)} = <b>${(nA+5)**2}</b> petits carrés.</p>`},
  {n:"Exercice 2", t:"Écrire un produit et calculer", w:"Sur ton cahier", h:`<p>Écris sous forme d'un produit, puis calcule.</p>${cols(e1.map(([b,e],i)=>`${NM[i]} = ${P(b,e)}`))}`,
   c:grid(e1.map(([b,e],i)=>[NM[i], `${P(b,e)} = ${prod(b,e)} = <b>${D(pw(b,e))}</b>`]))},
  {n:"Exercice 3", t:"Les carrés à connaître", w:"Sur ton cahier", h:`<p>Complète de tête (les carrés de 0 à 12 sont à connaître par cœur).</p>${cols(e2.map((n,i)=>`${NM[i]} = ${P(n,2)}`))}`,
   c:grid(e2.map((n,i)=>[NM[i], `${P(n,2)} = ${n} × ${n} = <b>${n*n}</b>`]))},
  {n:"Exercice 4", t:"Carrés de décimaux et de fractions", w:"Sur ton cahier", h:`<p>Calcule mentalement et écris seulement les résultats.</p>${cols(e3.map(([q],i)=>`${NM[i]} = ${q}`))}`,
   c:grid(e3.map(([q,r,m],i)=>[NM[i], `${q} = ${m} = <b>${r}</b>`]))},
  {n:"Exercice 5", t:"Corriger les erreurs", w:"Sur ton cahier", h:`<p>Vrai ou faux ? Justifie.</p><p>a) Léa affirme : « ${P(n4a,2)} = ${2*n4a} ». Que vaut vraiment ${P(n4a,2)} ? Quelle erreur a-t-elle commise ?</p><p>b) Noé affirme : « ${P(n4b,3)} = ${3*n4b} ». A-t-il raison ?</p><p>c) Sacha affirme : « le carré de ${n4c} est plus petit que le cube de ${n4c} ». A-t-il raison ?</p>`,
   c:`<p>a) Léa a calculé ${n4a} × 2 au lieu de ${n4a} × ${n4a}.</p>${grid([["A",`${P(n4a,2)} = ${n4a} × ${n4a} = <b>${n4a*n4a}</b>`]])}<p>b) <b>Non</b> : Noé a calculé ${n4b} × 3.</p>${grid([["B",`${P(n4b,3)} = ${prod(n4b,3)} = <b>${n4b**3}</b>`]])}<p>c) <b>Oui</b> : ${P(n4c,2)} = ${n4c**2} et ${P(n4c,3)} = ${n4c**3}, et ${n4c**2} &lt; ${n4c**3}.</p>`}
 ]};

/* ================= B. Le cube d'un nombre ================= */
const e6 = shuf([...distinct(3, ()=>ri(1,9), x=>x).map(n=>n), pick([10,20,30]), pick([0.1,0.2,0.3]), pick([40,50,100])]);
const cA = distinct(3, ()=>pick([ri(2,15), ri(11,39)/10]), x=>x), cV = distinct(3, ()=>pick([ri(2,10), pick([0.5,1.5,2.5,0.1])]), x=>x);
const rA = ri(2,12), rV = pick([2,3,4,5,10]);
const secB = {t:"Le cube d'un nombre", e:[
  {n:"Exercice 6", t:"Compter des cubes", w:"Sur ton cahier", h:`<p>Ce cube est formé de petits cubes de 1 cm de côté.</p><div class="figs">${cube(3)}</div><p>1) Combien de petits cubes contient-il ? Écris le calcul avec un cube.</p><p>2) Même question pour un cube de côté 4 cm, puis de côté 5 cm.</p>`,
   c:`<p>1) 3 × 3 × 3 = ${P(3,3)} = <b>27</b> petits cubes.</p><p>2) ${P(4,3)} = 4 × 4 × 4 = <b>64</b> petits cubes ; ${P(5,3)} = 5 × 5 × 5 = <b>125</b> petits cubes.</p>`},
  {n:"Exercice 7", t:"Calculer des cubes", w:"Sur ton cahier", h:`<p>Calcule (calculatrice autorisée pour les grands nombres).</p>${cols(e6.map((n,i)=>`${NM[i]} = ${P(n,3)}`))}`,
   c:grid(e6.map((n,i)=>[NM[i], `${P(n,3)} = ${prod(n,3)} = <b>${D(pw(n,3))}</b>`]))},
  {n:"Exercice 8", t:"Aires de carrés et volumes de cubes", w:"Sur ton cahier", h:`<p>1) Quelle est l'aire d'un carré de côté ${cA.map(c=>D(c)+" cm").join(" ? de côté ")} ?</p><p>2) Quel est le volume d'un cube de côté ${cV.map(c=>D(c)+" cm").join(" ? de côté ")} ?</p><p>3) Un carré a pour aire ${rA*rA} cm². Quel est son côté ?</p><p>Un cube a pour volume ${D(rV**3)} cm³. Quel est son côté ?</p>`,
   c:`<p>1) ${cA.map(c=>`${P(c,2)} = ${prod(c,2)} = <b>${D(pw(c,2))} cm²</b>`).join(" ; ")}.</p><p>2) ${cV.map(c=>`${P(c,3)} = ${prod(c,3)} = <b>${D(pw(c,3))} cm³</b>`).join(" ; ")}.</p><p>3) ${rA} × ${rA} = ${rA*rA} : le côté du carré mesure <b>${rA} cm</b>.</p><p>${prod(rV,3)} = ${D(rV**3)} : le côté du cube mesure <b>${rV} cm</b>.</p>`}
 ]};

/* ================= C. Calculer avec des carrés et des cubes ================= */
/* chaque expression : [énoncé, correction détaillée] */
const T7 = [
  ()=>{ const a=ri(1,20), b=ri(2,9); return [`${a} + ${P(b,2)}`, `${a} + ${P(b,2)} = ${a} + ${b*b} = <b>${a+b*b}</b>`]; },
  ()=>{ const a=ri(2,5), b=ri(2,9); return [`${a} × ${P(b,2)}`, `${a} × ${P(b,2)} = ${a} × ${b*b} = <b>${a*b*b}</b>`]; },
  ()=>{ const a=ri(1,6), b=ri(1,6); return [`${P(`(${a}+${b})`,2)}`, `${P(`(${a}+${b})`,2)} = ${P(a+b,2)} = <b>${(a+b)**2}</b>`]; },
  ()=>{ const b=ri(2,4), a=b**3+ri(1,40); return [`${a} − ${P(b,3)}`, `${a} − ${P(b,3)} = ${a} − ${b**3} = <b>${a-b**3}</b>`]; },
  ()=>{ const b=ri(2,8), a=ri(b+1,12); return [`${P(a,2)} − ${P(b,2)}`, `${P(a,2)} − ${P(b,2)} = ${a*a} − ${b*b} = <b>${a*a-b*b}</b>`]; },
  ()=>{ const a=ri(2,5), b=ri(2,9); return [`${P(a,3)} + ${P(b,2)}`, `${P(a,3)} + ${P(b,2)} = ${a**3} + ${b*b} = <b>${a**3+b*b}</b>`]; }
];
const T8 = [
  ()=>{ const a=ri(1,9), b=ri(2,5), c=ri(2,5); return [`${a} + ${b} × ${P(c,2)}`, `${a} + ${b} × ${P(c,2)} = ${a} + ${b} × ${c*c} = ${a} + ${b*c*c} = <b>${a+b*c*c}</b>`]; },
  ()=>{ const a=ri(1,6), b=ri(1,6), c=ri(2,4); return [`(${a}+${b}) × ${P(c,2)}`, `(${a}+${b}) × ${P(c,2)} = ${a+b} × ${P(c,2)} = ${a+b} × ${c*c} = <b>${(a+b)*c*c}</b>`]; },
  ()=>{ let a,b,c; do{ a=ri(4,10); b=ri(2,4); c=ri(2,4); }while(a*a-b*c*c<=0); return [`${P(a,2)} − ${b} × ${P(c,2)}`, `${P(a,2)} − ${b} × ${P(c,2)} = ${a*a} − ${b} × ${c*c} = ${a*a} − ${b*c*c} = <b>${a*a-b*c*c}</b>`]; },
  ()=>{ const b=ri(1,6), a=b+ri(1,4); return [`${P(`(${a}−${b})`,3)}`, `${P(`(${a}−${b})`,3)} = ${P(a-b,3)} = <b>${(a-b)**3}</b>`]; },
  ()=>{ const a=pick([10,6,8,4]), k=pick([0.5,0.2,0.1,0.25]), N=Math.ceil(a*a*k/50)*50+pick([50,100]); return [`${N} − ${P(a,2)} × ${D(k)}`, `${N} − ${P(a,2)} × ${D(k)} = ${N} − ${a*a} × ${D(k)} = ${N} − ${D(a*a*k)} = <b>${D(N-a*a*k)}</b>`]; },
  ()=>{ const a=ri(2,4), b=ri(2,4), c=ri(1,9); return [`${a} × ${P(b,3)} + ${c}`, `${a} × ${P(b,3)} + ${c} = ${a} × ${b**3} + ${c} = ${a*b**3} + ${c} = <b>${a*b**3+c}</b>`]; }
];
const T9 = [
  ()=>{ const x=ri(2,10), k=ri(1,9); return [`${X}<sup>2</sup> + ${k} pour ${X} = ${x}`, `${X}<sup>2</sup> + ${k} = ${P(x,2)} + ${k} = ${x*x} + ${k} = <b>${x*x+k}</b>`]; },
  ()=>{ const x=ri(2,6), k=ri(2,5); return [`${k}${X}<sup>2</sup> pour ${X} = ${x}`, `${k}${X}<sup>2</sup> = ${k} × ${P(x,2)} = ${k} × ${x*x} = <b>${k*x*x}</b>`]; },
  ()=>{ const x=ri(2,5); return [`${X}<sup>3</sup> − ${X} pour ${X} = ${x}`, `${X}<sup>3</sup> − ${X} = ${P(x,3)} − ${x} = ${x**3} − ${x} = <b>${x**3-x}</b>`]; },
  ()=>{ const x=ri(1,7), k=ri(1,5); return [`(${X}+${k})<sup>2</sup> pour ${X} = ${x}`, `(${X}+${k})<sup>2</sup> = ${P(`(${x}+${k})`,2)} = ${P(x+k,2)} = <b>${(x+k)**2}</b>`]; },
  ()=>{ const x=pick([2,3,4,5,6,7,8,9,10,20]); return [`${X}<sup>2</sup> + ${X} pour ${X} = ${x}`, `${X}<sup>2</sup> + ${X} = ${P(x,2)} + ${x} = ${x*x} + ${x} = <b>${x*x+x}</b>`]; },
  ()=>{ const x=pick([0.1,0.2,0.5,1.5]), k=pick([2,4,10]); return [`${k}${X}<sup>3</sup> pour ${X} = ${D(x)}`, `${k}${X}<sup>3</sup> = ${k} × ${P(x,3)} = ${k} × ${D(pw(x,3))} = <b>${D(pw(x,3)*k)}</b>`]; }
];
const e7 = T7.map(f=>f()), e8 = T8.map(f=>f()), e9 = T9.map(f=>f());
const c10 = ri(3,15), c10b = 2*c10;
const secC = {t:"Calculer avec des carrés et des cubes", e:[
  {n:"Exercice 9", t:"Priorités avec des puissances", w:"Sur ton cahier", h:`<p>Calcule en respectant les priorités.</p>${cols(e7.map((x,i)=>`${NM[i]} = ${x[0]}`))}`, c:`<p>1) parenthèses · 2) carrés et cubes · 3) × et ÷ · 4) + et −</p>${grid(e7.map((x,i)=>[NM[i],x[1]]))}`},
  {n:"Exercice 10", t:"Expressions plus longues", w:"Sur ton cahier", h:`<p>Calcule en détaillant les étapes.</p>${cols(e8.map((x,i)=>`${NM[i]} = ${x[0]}`))}`, c:grid(e8.map((x,i)=>[NM[i],x[1]]))},
  {n:"Exercice 11", t:"Expressions littérales avec des puissances", w:"Sur ton cahier", h:`<p>Calcule la valeur de chaque expression pour la valeur de ${X} indiquée.</p>${cols(e9.map((x,i)=>`${NM[i]} = ${x[0]}`))}`, c:`<p>On remplace ${X} par sa valeur (en remettant le signe ×), puis on respecte les priorités.</p>${grid(e9.map((x,i)=>[NM[i],x[1]]))}`},
  {n:"Exercice 12", t:"Aire et périmètre d'un carré", w:"Sur ton cahier", h:`<p>Un carré a pour côté <i>c</i> cm.</p><p>1) Exprime en fonction de <i>c</i> l'aire du carré, puis son périmètre.</p><p>2) Calcule l'aire et le périmètre pour <i>c</i> = ${c10}, puis pour <i>c</i> = ${c10b}.</p><p>3) Quand on double le côté, l'aire est-elle doublée ? Explique avec les valeurs calculées.</p>`,
   c:`<p>1) Aire : <b><i>c</i><sup>2</sup></b> ; périmètre : <b>4<i>c</i></b>.</p><p>2) Pour <i>c</i> = ${c10} : aire ${P(c10,2)} = <b>${c10*c10} cm²</b>, périmètre 4 × ${c10} = <b>${4*c10} cm</b>.</p><p>Pour <i>c</i> = ${c10b} : aire ${P(c10b,2)} = <b>${c10b*c10b} cm²</b>, périmètre 4 × ${c10b} = <b>${4*c10b} cm</b>.</p><p>3) <b>Non</b> : le périmètre est doublé (de ${4*c10} cm à ${4*c10b} cm), mais l'aire est multipliée par 4 (de ${c10*c10} cm² à ${c10b*c10b} cm²).</p>`}
 ]};

return [secA, secB, secC];
};
