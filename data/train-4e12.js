/* 4e · chapitre 12 — fiche d'entraînement : les activités et exercices de M. Staal, avec d'autres nombres.
   Les développements sont calculés par l'outil CL7 / CL12 (4e-7.js et 4e-12.js). */
TRAIN["4e-12"] = function(){
const {ri, pick, shuf} = TR;
const {nz, F, X, E, red, prod, fac, prog, progs} = window.CL7;
const {S, P, devK, rect} = window.CL12;
const x=X("x"), y=X("y"), L="ABCDEFGHIJ";
const gcd=(m,n)=>n?gcd(n,m%n):m;
const lines=(n,arr)=>`<p class="calc">${arr.map(l=>`${n} = ${l}`).join("<br>")}</p>`;
/* une expression k(a + b) : facteur K, termes ts, facteur à droite ? écriture avec × ? */
const kab=(K,ts,right,times)=>right?`${P(ts)} × ${fac(K)}`:(times?`${E([K])} × ${P(ts)}`:`${E([K])}${P(ts)}`);
const devC=(n,K,ts,right,times)=>{ const st=[kab(K,ts,right,times)]; if(ts.some(t=>t[0]<0)) st.push((right?`(${E([ts[0]])} + ${ts.slice(1).map(t=>t[0]<0?"("+E([t])+")":E([t])).join(" + ")}) × ${fac(K)}`:`${E([K])}${times?" × ":""}(${E([ts[0]])} + ${ts.slice(1).map(t=>t[0]<0?"("+E([t])+")":E([t])).join(" + ")})`)); return lines(n,[...st,...devK(K,ts)]); };

/* ===== A. Somme ou produit ===== */
const a1=ri(2,9), a2=ri(2,9), a3=ri(2,9);
const AR=[[`Multiplier par ${a1}`,`Soustraire ${a2}`],[`Ajouter ${a3}`,`Multiplier par ${a1}`]];
const c3=ri(2,9), c4=ri(1,9), c5=ri(2,5);
const ACT1=shuf([
  [`${ri(2,9)}${x} + ${ri(1,9)}`,"S"],[`${ri(2,9)}${x} × (${x} + ${ri(1,9)})`,"P"],[`${ri(2,9)}${x}<sup>2</sup> + ${ri(2,20)}`,"S"],[`−${ri(2,9)} × (${ri(2,9)}${x} + ${ri(1,9)})`,"P"],
  [`(${x} + ${ri(1,9)}) × ${ri(2,9)}`,"P"],[`${ri(2,9)} + (${ri(2,9)}${x} + ${ri(1,9)})`,"S"],[`(${ri(2,9)}${x} + ${ri(1,9)}) + ${ri(2,9)}${x}`,"S"],[`${ri(2,9)} − ${ri(2,9)}${x}<sup>2</sup>`,"S"],[`−${ri(2,9)}(${x}<sup>2</sup> + ${ri(2,9)}${x})`,"P"],[`${ri(2,9)}${y}(${ri(2,9)} + ${x})`,"P"]
]).slice(0,8);
const secA={t:"Reconnaître une somme ou un produit", e:[
  {n:"Activité rapide", t:"Modéliser par une expression littérale", w:"Sur ton cahier", h:`<p>Quel sera le résultat de chaque programme si ${x} est le nombre choisi au départ ?</p>${progs(prog("1) Programme 1",["Choisir un nombre",...AR[0]]),prog("2) Programme 2",["Choisir un nombre",...AR[1]]),prog("3) Programme 3",["Choisir un nombre",`Multiplier par ${c3}`,`Ajouter ${c4}`,`Multiplier par ${c5}`]))}`,
   c:`<p class="calc">A = ${x} × ${a1} − ${a2}<br>A = <b>${S([[a1,"x"],[-a2,""]])}</b></p><p class="calc">B = <b>(${x} + ${a3}) × ${a1}</b><br>B = ${S([[a1,"x"],[a1*a3,""]])}</p><p class="calc">C = <b>(${c3}${x} + ${c4}) × ${c5}</b><br>C = ${S([[c3*c5,"x"],[c4*c5,""]])}</p>`},
  {n:"Activité 1", t:"Reconnaître une somme algébrique et un produit", w:"Sur ton cahier", h:`<p>Pour chaque expression, dis si c'est une somme ou un produit.</p><div class="calcs">${ACT1.map(([e],i)=>`<span>${L[i]} = ${e}</span>`).join("")}</div>`,
   c:`<p><b>Sommes :</b> ${ACT1.map((t,i)=>t[1]==="S"?L[i]:"").filter(Boolean).join(", ")}.</p><p><b>Produits :</b> ${ACT1.map((t,i)=>t[1]==="P"?L[i]:"").filter(Boolean).join(", ")}.</p><p>On regarde la dernière opération à effectuer.</p>`}
 ]};

/* ===== B. Développer ===== */
const h2=ri(2,9), w1=ri(2,9), w2=ri(1,9);
const E2=[[[ri(2,9),""],[[1,"x"],[ri(1,9),""]],false,true],[[ri(2,6),"x"],[[ri(2,9),"x"],[ri(1,9),""]],false,true],[[ri(2,9),""],[[ri(1,9),""],[1,"x"]],true]];
const E3=shuf([
  {d:true, K:[ri(2,9),""], ts:[[1,"x"],[ri(1,9),""]], times:true}, {d:true, K:[ri(2,6),"x"], ts:[[ri(2,9),""],[ri(2,9),"x"]], times:true},
  {d:false, s:`${ri(2,9)} + (${ri(2,9)} + ${ri(2,9)}${x})`}, {d:true, K:[-ri(2,9),""], ts:[[ri(2,9),"y"],[ri(1,9),""]]},
  {d:true, K:[ri(2,6),"x"], ts:[[1,"x"],[ri(1,9),""]], right:true}, {d:true, K:[ri(2,6),"y"], ts:[[ri(2,9),""],[ri(2,9),"x"]]},
  {d:false, s:`(${ri(2,9)} + ${ri(2,9)}${x}) − ${ri(2,9)}`}, {d:true, K:[-ri(2,6),"y"], ts:[[ri(2,9),""],[ri(2,9),"x"]], right:true}
]);
const sh3=o=>o.d?kab(o.K,o.ts,o.right,o.times):o.s;
const E4=[[[ri(2,9),""],[[ri(2,9),"x"],[-ri(1,9),""]],false,true],[[ri(2,6),"x"],[[ri(2,9),""],[-ri(2,9),"x"]],false,true],[[ri(2,9),""],[[ri(2,9),"x"],[-ri(1,9),""]],true],
          [[-ri(2,9),""],[[ri(2,9),"x"],[-ri(1,9),""]],false,true],[[ri(2,6),"x"],[[-ri(2,9),""],[-ri(2,9),"x"]],false,true],[[-ri(2,9),""],[[ri(2,9),""],[-ri(2,9),"x"]],true]];
const forms5=[()=>[[ri(2,6),"x"],[[ri(2,9),"x"],[ri(1,9),""]]], ()=>[[ri(2,9),""],[[1,"x"],[-ri(1,9),""]]], ()=>[[ri(2,6),"x"],[[-ri(2,9),""],[ri(2,9),"x"]]], ()=>[[ri(2,9),""],[[ri(2,9),"y"],[ri(1,9),""]],true],
  ()=>[[-ri(2,9),"x"],[[ri(2,9),""],[-ri(2,9),"x"]]], ()=>[[ri(2,6),"x"],[[-ri(2,9),"y"],[-ri(2,9),""]]], ()=>[[-ri(2,9),""],[[ri(2,9),""],[-ri(2,9),"x"]],true], ()=>[[-ri(2,6),"x"],[[ri(2,9),""],[-ri(2,9),"x"]]],
  ()=>[[-ri(2,6),"x"],[[-ri(2,9),""],[ri(2,9),"y"]]], ()=>[[-ri(2,9),""],[[-ri(2,9),"y"],[-ri(2,9),""]]]];
const E5=forms5.map(f=>f());
/* exercice 6 : développer et réduire */
const e6a=[ri(2,6),ri(2,9),ri(2,9),ri(2,12)], e6b=[ri(2,9),ri(2,9),ri(2,9),ri(2,5)], e6c=[ri(2,12),ri(2,7),ri(2,9),ri(1,9)];
const E6=[
  {s:`${e6a[0]}${x}(${e6a[1]} + ${e6a[2]}${x}) − ${e6a[3]}${x}`, st:[`${e6a[0]}${x} × ${e6a[1]} + ${e6a[0]}${x} × ${e6a[2]}${x} − ${e6a[3]}${x}`], t:[prod([e6a[0],"x"],[e6a[1],""]),prod([e6a[0],"x"],[e6a[2],"x"]),[-e6a[3],"x"]]},
  {s:`${e6b[0]}${x} + (${e6b[1]} − ${e6b[2]}${x}) × ${e6b[3]}`, st:[`${e6b[0]}${x} + ${e6b[3]} × ${e6b[1]} + ${e6b[3]} × (−${e6b[2]}${x})`], t:[[e6b[0],"x"],[e6b[1]*e6b[3],""],[-e6b[2]*e6b[3],"x"]]},
  {s:`${e6c[0]}${x} − ${e6c[1]}(${e6c[2]}${x} − ${e6c[3]})`, st:[`${e6c[0]}${x} + (−${e6c[1]}) × ${e6c[2]}${x} + (−${e6c[1]}) × (−${e6c[3]})`], t:[[e6c[0],"x"],[-e6c[1]*e6c[2],"x"],[e6c[1]*e6c[3],""]]}
];
const secB={t:"Développer avec la simple distributivité", e:[
  {n:"Activité 2", t:"L'aire d'un rectangle de deux façons", w:"Sur ton cahier", h:`${rect({top:[[`${w1}<i>x</i>`,150],[String(w2),80]], left:String(h2), alt:`Rectangle de hauteur ${h2}, partagé en deux rectangles de largeurs ${w1}x et ${w2}`})}<p>${x} est un nombre positif. Exprime, de deux façons, l'aire de ce rectangle en fonction de ${x}.</p>`,
   c:`<p><b>1<sup>re</sup> façon :</b> ${h2} × (${w1}${x} + ${w2}).</p><p><b>2<sup>e</sup> façon :</b> ${h2} × ${w1}${x} + ${h2} × ${w2} = <b>${S([[h2*w1,"x"],[h2*w2,""]])}</b>.</p>`},
  {n:"Exercice 1", t:"Développer k × (a + b)", w:"Sur ton cahier", h:`<p>Recopie les expressions et développe-les.</p><div class="calcs">${E2.map((d,i)=>`<span>${L[i]} = ${kab(...d)}</span>`).join("")}</div>`,
   c:E2.map((d,i)=>lines(L[i],[kab(...d),...devK(d[0],d[1])])).join("")},
  {n:"Exercice 2", t:"Peut-on développer ?", w:"Sur ton cahier", h:`<div class="calcs">${E3.map((o,i)=>`<span>${L[i]} = ${sh3(o)}</span>`).join("")}</div><p><b>1)</b> Quelles expressions peux-tu développer ?</p><p><b>2)</b> Développe et réduis-les.</p>`,
   c:`<p><b>1)</b> On développe les produits : ${E3.map((o,i)=>o.d?L[i]:"").filter(Boolean).join(", ")}. Les autres sont des sommes.</p>${E3.map((o,i)=>o.d?lines(L[i],[sh3(o),...devK(o.K,o.ts)]):"").join("")}`},
  {n:"Exercice 3", t:"Développer k × (a − b)", w:"Sur ton cahier", h:`<p>Recopie les expressions et développe-les.</p><div class="calcs">${E4.map((d,i)=>`<span>${L[i]} = ${kab(...d)}</span>`).join("")}</div>`,
   c:E4.map((d,i)=>devC(L[i],...d)).join("")},
  {n:"Exercice 4", t:"Développer tout type d'expressions", w:"Sur ton cahier", h:`<p>Développe et réduis les expressions suivantes.</p><div class="calcs">${E5.map((d,i)=>`<span>${L[i]} = ${kab(...d)}</span>`).join("")}</div>`,
   c:E5.map((d,i)=>lines(L[i],[kab(...d),...devK(d[0],d[1])])).join("")},
  {n:"Exercice 5", t:"Développer et réduire", w:"Sur ton cahier", h:`<p>Réduis chacune des expressions suivantes.</p><div class="calcs">${E6.map((o,i)=>`<span>${"EFG"[i]} = ${o.s}</span>`).join("")}</div>`,
   c:E6.map((o,i)=>lines("EFG"[i],[...o.st, E(o.t), `<b>${S(o.t)}</b>`])).join("")}
 ]};

/* ===== C. Factoriser ===== */
const p1=ri(2,6), q1=ri(2,9), r1=ri(1,9);
const k2=pick([2,3]), u2=ri(1,5), v2=ri(1,9);      /* aire k x² + (k u)… */
const A2=[[k2,"x2"],[k2*v2,"x"]];
const F7=shuf([
  (()=>{ const K=ri(2,9), p=ri(1,9); return {s:S([[K,"x"],[K*p,""]]), f:`${K}(${x} + ${p})`, st:`${K} × ${x} + ${K} × ${p}`}; })(),
  (()=>{ const K=ri(2,6), p=ri(2,9); return {s:S([[K*p,"x"],[-K,"x2"]]), f:`${K}${x}(${p} − ${x})`, st:`${K}${x} × ${p} − ${K}${x} × ${x}`}; })(),
  (()=>{ let p,q; do{ p=ri(2,9); q=ri(2,9); }while(gcd(p,q)!==1); return {s:S([[p,"x"],[q,""]]), f:null}; })(),
  (()=>{ const K=ri(2,9), p=ri(2,6); return {s:S([[K*p,"x"],[K,""]]), f:`${K}(${p}${x} + 1)`, st:`${K} × ${p}${x} + ${K} × 1`}; })(),
  (()=>{ const K=ri(2,9), p=ri(1,9); return {s:S([[K,"x"],[-K*p,""]]), f:`${K}(${x} − ${p})`, st:`${K} × ${x} − ${K} × ${p}`}; })()
]);
const secC={t:"Factoriser avec la simple distributivité", e:[
  {n:"Activité 3", t:"Aire de rectangles", w:"Sur ton cahier", h:`<p><b>Partie 1 :</b> ${x} est un nombre positif.</p>${rect({top:[[`${q1}<i>x</i> + ${r1}`,240]], left:`${p1}<i>x</i>`, H:80, alt:`Rectangle de longueur ${q1}x + ${r1} et de largeur ${p1}x`})}<p>Donne l'expression développée et réduite de l'aire de ce rectangle.</p>
   <p><b>Partie 2 :</b> l'aire d'un rectangle est égale à ${E(A2)}. Donne deux dimensions possibles de ce rectangle.</p>`,
   c:`<p><b>Partie 1 :</b></p><p class="calc">Aire = ${p1}${x} × (${q1}${x} + ${r1})<br>Aire = ${p1}${x} × ${q1}${x} + ${p1}${x} × ${r1}<br>Aire = <b>${S([prod([p1,"x"],[q1,"x"]),prod([p1,"x"],[r1,""])])}</b></p>
   <p><b>Partie 2 :</b> on factorise :</p><p class="calc">A = ${E(A2)}<br>A = ${k2}${x} × ${x} + ${k2}${x} × ${v2}<br>A = <b>${k2}${x}(${x} + ${v2})</b></p><p>Le rectangle peut mesurer ${k2}${x} sur ${x} + ${v2}.</p><p>Autre possibilité : A = ${x}(${E([[k2,"x"],[k2*v2,""]])}) : ${x} sur ${E([[k2,"x"],[k2*v2,""]])}.</p>`},
  {n:"Exercice 6", t:"Peut-on factoriser ?", w:"Sur ton cahier", h:`<p>Factorise les expressions lorsque c'est possible.</p><div class="calcs">${F7.map((o,i)=>`<span>${"HIJKL"[i]} = ${o.s}</span>`).join("")}</div>`,
   c:F7.map((o,i)=>o.f?`<p class="calc">${"HIJKL"[i]} = ${o.st}<br>${"HIJKL"[i]} = <b>${o.f}</b></p>`:`<p>${"HIJKL"[i]} = ${o.s} : pas de facteur commun, on ne peut pas factoriser.</p>`).join("")}
 ]};

return [secA, secB, secC];
};
