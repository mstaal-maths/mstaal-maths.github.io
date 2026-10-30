/* 4e · chapitre 13 — fiche d'entraînement : l'activité et les exercices de M. Staal, avec d'autres nombres.
   Les développements sont calculés par les outils CL7, CL12 et CL13. */
TRAIN["4e-13"] = function(){
const {ri, pick, shuf} = TR;
const {nz, X, E, R} = window.CL7;
const {S, P, devK} = window.CL12;
const {dev2, rect4} = window.CL13;
const x=X("x");
const lines=(n,first,L)=>`<p class="calc">${[first,...L].map((l,i,arr)=>`${n} = ${i===arr.length-1?"<b>"+l+"</b>":l}`).join("<br>")}</p>`;
const w2=(A,B)=>`${P(A)}${P(B)}`;
const V=["x","y","z","t","a"];
const one=(m,v)=>[m,v];
/* ===== Activité 1 ===== */
const p=ri(2,7), q=ri(1,5);
/* ===== Exercice 1 : (x + p)(m x + q), tout positif ===== */
const E1=[0,1,2].map(i=>{ const v=V[i]; return [[1,v],[ri(1,9),""]]; }).map((A,i)=>[A,[[i?ri(2,5):1,A[0][1]],[ri(1,9),""]]]);
/* ===== Exercice 2 : avec des soustractions (mêmes formes que la fiche) ===== */
const F2=[
  v=>[[[ri(2,6),v],[ri(1,9),""]],[[ri(1,9),""],[-ri(2,9),v]]], v=>[[[-ri(2,9),v],[ri(1,9),""]],[[ri(1,9),""],[-ri(2,9),v]]], v=>[[[ri(2,9),""],[-ri(2,6),v]],[[ri(2,9),v],[-ri(1,9),""]]],
  v=>[[[-ri(1,9),""],[-ri(2,6),v]],[[1,v],[-ri(1,9),""]]], v=>[[[ri(2,6),v],[ri(1,9),""]],[[-ri(1,9),""],[-ri(2,9),v]]], v=>[[[-ri(1,9),""],[-ri(2,6),v]],[[ri(1,9),""],[-ri(2,9),v]]],
  v=>[[[ri(2,9),v],[-ri(1,9),""]],[[ri(2,9),v],[ri(1,9),""]]], v=>[[[-ri(1,9),""],[-1,v]],[[1,v],[-ri(1,9),""]]], v=>[[[ri(2,6),v],[-ri(1,9),""]],[[ri(1,9),""],[-1,v]]]
];
const E2=F2.map((f,i)=>f(V[i%5]));
/* ===== Exercice 3 : simple ou double ===== */
const E3=shuf([
  {K:[ri(2,9),""], ts:[[ri(2,9),"x"],[ri(1,9),""]]}, {K:[-ri(2,9),"x"], ts:[[ri(2,9),"x"],[ri(1,9),""]], right:true},
  {A:[[1,"x"],[-ri(1,9),""]], B:[[ri(2,6),"x"],[ri(1,9),""]]}, {A:[[ri(2,6),"x"],[-ri(1,9),""]], B:[[1,"x"],[-ri(1,9),""]]},
  (()=>{ const a=ri(2,9), b=ri(2,9); return {A:[[a,""],[b,"x"]], B:[[a,""],[-b,"x"]]}; })(), (()=>{ const a=ri(1,9), b=ri(2,9); const A=[[a,""],[-b,"x"]]; return {A, B:A}; })()
]);
const w3=o=>o.K?(o.right?`${P(o.ts)} × (${E([o.K])})`:`${E([o.K])}${P(o.ts)}`):w2(o.A,o.B);
const N3="MNPQRS";
return [
 {t:"Découvrir la double distributivité", e:[
  {n:"Activité 1", t:"L'aire d'un rectangle de deux façons", w:"Sur ton cahier", h:`${rect4(120,24*p,120,24*q,{w:["<i>x</i>",String(p)],h:["<i>x</i>",String(q)],pts:true,alt:`Rectangle ABCD : AB = x + ${p} et AD = x + ${q}, partagé en quatre parties`})}
   <p><b>1)</b> Exprime l'aire de ABCD à l'aide des longueurs AB et AD.</p><p><b>2)</b> Exprime cette aire en additionnant les aires des quatre parties.</p><p><b>3)</b> Réduis l'expression obtenue.</p>`,
   c:`<p><b>1)</b> AB = ${x} + ${p} et AD = ${x} + ${q}, donc aire de ABCD = <b>(${x} + ${p}) × (${x} + ${q})</b>.</p><p><b>2)</b> Aire de ABCD = <b>${x} × ${x} + ${x} × ${q} + ${p} × ${x} + ${p} × ${q}</b> (le carré et les trois rectangles).</p><p><b>3)</b></p><p class="calc">Aire = ${x}<sup>2</sup> + ${q===1?"":q}${x} + ${p}${x} + ${p*q}<br>Aire = <b>${R([[1,"x2"],[p+q,"x"],[p*q,""]])}</b></p>`}
 ]},
 {t:"Développer avec la double distributivité", e:[
  {n:"Exercice 1", t:"Développer avec la double distributivité", w:"Sur ton cahier", h:`<p>Développe et réduis.</p><div class="calcs">${E1.map(([A,B],i)=>`<span>${"ABC"[i]} = ${w2(A,B)}</span>`).join("")}</div>`,
   c:E1.map(([A,B],i)=>lines("ABC"[i],w2(A,B),dev2(A,B).L)).join("")},
  {n:"Exercice 2", t:"Avec des soustractions", w:"Sur ton cahier", h:`<p>Développe et réduis.</p><div class="calcs">${E2.map(([A,B],i)=>`<span>${"DEFGHIJKL"[i]} = ${w2(A,B)}</span>`).join("")}</div>`,
   c:E2.map(([A,B],i)=>lines("DEFGHIJKL"[i],w2(A,B),dev2(A,B).L)).join("")}
 ]},
 {t:"Développer tous types d'expressions", e:[
  {n:"Exercice 3", t:"Simple ou double distributivité ?", w:"Sur ton cahier", h:`<p>Développe et réduis.</p><div class="calcs">${E3.map((o,i)=>`<span>${N3[i]} = ${w3(o)}</span>`).join("")}</div>`,
   c:E3.map((o,i)=>`<p>${N3[i]} : ${o.K?"simple":"double"} distributivité.</p>`+(o.K?lines(N3[i],w3(o),devK(o.K,o.ts)):lines(N3[i],w3(o),dev2(o.A,o.B,{trans:false}).L))).join("")}
 ]}
];
};
