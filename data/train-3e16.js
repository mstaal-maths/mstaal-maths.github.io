/* 3e · chapitre 16 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres.
   Toutes les corrections sont calculées par le code (outils window.EQ16 du chapitre). */
TRAIN["3e-16"] = function(){
const {ri, pick, shuf, distinct} = TR;
const {F,X,SV,mono,lin,calc,cols,rac,sq,fs,fp,fLines,fSol,same,pnul,isSq,rootSol,devAB,facAB,eqs,progDiag} = window.EQ16;
const $x=X("x"), $a=X("a"), $b=X("b"), L6="abcdef";
const f=(a,b,r)=>({a,b,r});
const nz=(a,b)=>{ let v; do{ v=ri(a,b); }while(v===0); return v; };

/* ===== Activité 1 : développer (double distributivité) ===== */
const A1=(()=>{ const p=ri(2,9), q=ri(2,6), r=ri(1,9), k=ri(2,9), m=ri(2,9), n=ri(2,7); return {p,q,r,k,m,n}; })();
/* (x − p)(q x + r) = q x² + (r − p q) x − p r */
const A1c=(()=>{ const {p,q,r}=A1, c1=r-p*q; return [`(${$x} − ${p})(${q}${$x} + ${r})`,`${q}${sq($x)} + ${mono(r)} − ${p*q}${$x} − ${p*r}`,`${q}${sq($x)}${c1===0?"":c1>0?` + ${mono(c1)}`:` − ${mono(-c1)}`} − ${p*r}`]; })();

/* ===== Exercice 1 et 2, activité 2 : identité remarquable ===== */
const E1=distinct(4,()=>[pick([1,1,ri(2,9)]),ri(1,12),ri(0,1)],v=>v[0]+"-"+v[1]);
const A2=[[1,ri(5,12)],[ri(2,9),ri(2,9)]];
const E2=distinct(4,()=>[pick([1,1,ri(2,9)]),ri(1,12)],v=>v.join("-"));
const expr=([k,m],o)=>{ const A=k===1?$x:`${k}${$x}`; return o?`(${A} − ${m})(${A} + ${m})`:`(${A} + ${m})(${A} − ${m})`; };
const diff=([k,m])=>`${k===1?"":k*k}${sq($x)} − ${m*m}`;

/* ===== Exercice 3 : équations produit nul (mêmes six formes que la fiche) ===== */
const lf=()=>f(ri(2,9),nz(-9,9));
const E3=(()=>{ let A,B; const R=[];
  do{ A=f(ri(2,9),nz(-9,9)); B=f(1,nz(-9,9)); }while(same(A,B)); R.push([`${fp(A)}${fp(B)} = 0`,A,B]);
  do{ A=f(ri(2,9),-ri(1,9)); B=f(-ri(2,9),ri(1,9),1); }while(same(A,B)); R.push([`${fp(A)}${fp(B)} = 0`,A,B]);
  A=lf(); R.push([`${fp(A)}<sup>2</sup> = 0`,A,null,{sqr:1}]);
  B=f(ri(2,9),nz(-9,9)); R.push([`${$x}${fp(B)} = 0`,f(1,0),B]);
  A=f(-ri(2,9),ri(1,9),1); const k=ri(2,9); R.push([`${fp(A)} × ${k}${$x} = 0`,A,f(k,0)]);
  const m=ri(2,7); do{ A=f(1,nz(-9,9)); B=f(1,nz(-9,9)); }while(same(A,B)); R.push([`${m}${fp(A)}${fp(B)} = 0`,A,B,{k:m}]);
  return R; })();

/* ===== Exercice 4 : x² = a ===== */
const sqn=()=>{ const k=ri(2,15); return k*k; }, nsq=()=>{ let n; do{ n=ri(2,99); }while(isSq(n)); return n; };
const E4=shuf([sqn(), nsq(), pick([0, sqn()])]);
const E4b=(()=>{ const a=ri(2,6), k=ri(2,10), n=nsq(); return {a,k,n}; })();

/* ===== Exercice 5 : programme (x − p)(x + q) ===== */
const E5=(()=>{ const p=ri(1,9), q=ri(1,9), n=-ri(1,9); return {p,q,n,r:(n-p)*(n+q)}; })();

return [
 {t:"Une identité remarquable", e:[
  {n:"Activité 1", t:"Développer des expressions littérales", w:"Sur ton cahier", h:`<p><b>1 –</b> Développe et réduis les expressions suivantes :</p>${cols([`A = ${A1c[0]}`,`B = ${expr([1,A1.m])}`,`C = ${expr([A1.k,A1.n],1)}`])}<p><b>2 –</b> Les calculs B et C ont un point en commun. Que remarques-tu ?</p>`,
   c:`<p><b>1 –</b></p>${eqs("A",A1c)}${eqs("B",[expr([1,A1.m]),`${sq($x)} − ${A1.m}${$x} + ${A1.m}${$x} − ${A1.m*A1.m}`,`${sq($x)} − ${A1.m*A1.m}`])}${eqs("C",[expr([A1.k,A1.n],1),`${A1.k*A1.k}${sq($x)} + ${A1.k*A1.n}${$x} − ${A1.k*A1.n}${$x} − ${A1.n*A1.n}`,`${A1.k*A1.k}${sq($x)} − ${A1.n*A1.n}`])}
   <p><b>2 –</b> Dans B et C, les termes en ${$x} s'annulent : on obtient une différence de deux carrés. C'est l'identité (${$a} + ${$b})(${$a} − ${$b}) = ${sq($a)} − ${sq($b)}.</p>`},
  {n:"Exercice 1", t:"Développer en utilisant (a + b)(a − b) = a² − b²", w:"Sur ton cahier", h:`<p>Développe les expressions suivantes.</p>${cols(E1.map((v,i)=>`${"ABCD"[i]} = ${expr(v,v[2])}`))}`,
   c:E1.map((v,i)=>eqs("ABCD"[i],devAB(v[0],v[1],v[2]?0:1))).join("")},
  {n:"Activité 2", t:"Factoriser en utilisant a² − b² = (a + b)(a − b)", w:"Sur ton cahier", h:`<p>Factorise les expressions suivantes.</p>${cols(A2.map((v,i)=>`${"AB"[i]} = ${diff(v)}`))}`,
   c:A2.map((v,i)=>eqs("AB"[i],facAB(v[0],v[1]))).join("")},
  {n:"Exercice 2", t:"Factoriser en utilisant a² − b² = (a + b)(a − b)", w:"Sur ton cahier", h:`<p>Factorise les expressions suivantes.</p>${cols(E2.map((v,i)=>`${"ABCD"[i]} = ${diff(v)}`))}`,
   c:E2.map((v,i)=>eqs("ABCD"[i],facAB(v[0],v[1]))).join("")}
 ]},
 {t:"Équations « produit nul »", e:[
  {n:"Exercice 3", t:"Résoudre des équations « produit nul »", w:"Sur ton cahier", h:`<p>Résous les équations suivantes.</p>${cols(E3.map((r,i)=>`<b>${L6[i]})</b> ${r[0]}`))}`,
   c:E3.map((r,i)=>`<p><b>${L6[i]})</b> ${r[0]}</p>${pnul(r[1],r[2],r[3]||{})}`).join("")}
 ]},
 {t:"Équations de la forme <i>x</i>² = a", e:[
  {n:"Exercice 4", t:"Résoudre des équations de la forme x² = a", w:"Sur ton cahier", h:`<p><b>Partie 1 :</b> résous les équations suivantes.</p>${cols(E4.map((n,i)=>`<b>${L6[i]})</b> ${sq($x)} = ${n}`))}
   <p><b>Partie 2 :</b> ramène-toi à une équation de la forme ${sq($x)} = a, puis résous-la.</p>${cols([`<b>a)</b> ${E4b.a}${sq($x)} = ${E4b.a*E4b.k*E4b.k}`,`<b>b)</b> ${sq($x)} − ${E4b.n} = 0`])}`,
   c:`${E4.map((n,i)=>`<p><b>${i?"":"Partie 1 – "}${L6[i]})</b> ${sq($x)} = ${n}</p>${rootSol(n)}`).join("")}
   <p><b>Partie 2 – a)</b></p>${calc([`${E4b.a}${sq($x)} = ${E4b.a*E4b.k*E4b.k}`,[`${sq($x)} = ${E4b.k*E4b.k}`,"÷ "+E4b.a]])}${rootSol(E4b.k*E4b.k)}
   <p><b>b)</b></p>${calc([`${sq($x)} − ${E4b.n} = 0`,[`${sq($x)} = ${E4b.n}`,"+ "+E4b.n]])}${rootSol(E4b.n)}`},
  {n:"Exercice 5", t:"Vu au brevet", w:"Sur ton cahier", h:`<p>On considère le programme de calcul suivant.</p>${progDiag(`Soustraire ${E5.p}`,`Ajouter ${E5.q}`,`Programme : choisir un nombre ; d'un côté soustraire ${E5.p}, de l'autre ajouter ${E5.q} ; multiplier les deux nombres obtenus`)}
   <p><b>1.</b> Vérifie qu'en choisissant ${F(E5.n)} comme nombre de départ, on obtient ${F(E5.r)}.</p><p><b>2.</b> Quels nombres faut-il choisir au départ pour obtenir 0 ? Justifie.</p>`,
   c:`<p><b>1.</b> ${F(E5.n)} − ${E5.p} = ${F(E5.n-E5.p)} et ${F(E5.n)} + ${E5.q} = ${F(E5.n+E5.q)}, puis ${F(E5.n-E5.p)} × ${E5.n+E5.q<0?"("+F(E5.n+E5.q)+")":F(E5.n+E5.q)} = ${F(E5.r)}.</p>
   <p><b>2.</b> Avec ${$x} au départ, le résultat est (${lin(1,-E5.p)})(${lin(1,E5.q)}). On résout (${lin(1,-E5.p)})(${lin(1,E5.q)}) = 0.</p>${pnul(f(1,-E5.p),f(1,E5.q))}<p>Il faut choisir <b>${E5.p}</b> ou <b>${F(-E5.q)}</b>.</p>`}
 ]}
];
};
