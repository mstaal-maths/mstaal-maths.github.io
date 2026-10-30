/* 3e · chapitre 14 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres.
   Toutes les corrections sont calculées par le code (outils window.PW14 du chapitre ; écritures décimales exactes). */
TRAIN["3e-14"] = function(){
const {ri, pick, shuf, distinct} = TR;
const {F,calc,cols,E,pw,bs,P10,FRH,prod,dec,sciOf,sci,nz} = window.PW14;
const L="abcdefghijkl";
/* calcul en chaîne : « a) A = … » puis une ligne « A = … » par étape */
const nm=(i,parts)=>calc(parts.map((t,k)=>(k===0?L[i]+") ":"")+L[i].toUpperCase()+" = "+t));
const nmH=(i,t)=>`${L[i]}) ${L[i].toUpperCase()} = ${t}`;

/* ===== Exercice 1 : décomposer et calculer ===== */
const E1=distinct(8,()=>{ const t=pick(["pos","neg","moins","dix","zero","un"]);
  if(t==="pos"){ const b=ri(2,6), n=ri(2,4); return {t,b,n}; }
  if(t==="neg"){ const b=ri(2,5), n=ri(2,4); return {t,b,n}; }
  if(t==="moins"){ const b=ri(2,5), n=ri(2,4); return {t,b,n}; }
  if(t==="dix"){ return {t,b:10,n:ri(2,8)}; }
  if(t==="zero"){ return {t,b:nz(-9,9),n:0}; }
  return {t,b:nz(-9,9),n:1}; },v=>v.t+v.b+"-"+v.n).sort((x,y)=>"posnegmoinsdixzeroun".indexOf(x.t)-"posnegmoinsdixzeroun".indexOf(y.t));
const e1h=v=>v.t==="pos"?pw(v.b,v.n):v.t==="neg"?pw(`(−${v.b})`,v.n):v.t==="moins"?`−${pw(v.b,v.n)}`:v.t==="dix"?P10(v.n):pw(bs(v.b),v.n);
const e1c=v=>{ if(v.t==="pos") return `${prod(v.b,v.n)} = ${F(Math.pow(v.b,v.n))}`;
  if(v.t==="neg") return `${prod(-v.b,v.n)} = ${F(Math.pow(-v.b,v.n))}`;
  if(v.t==="moins") return `−${Array(v.n).fill(v.b).join(" × ")} = ${F(-Math.pow(v.b,v.n))}`;
  if(v.t==="dix") return dec(1,v.n);
  return v.n===0?"1":F(v.b); };

/* ===== Exercice 2 : priorités opératoires ===== */
const P2=(()=>{ const a=ri(1,6), b=ri(a+1,a+5), c=ri(2,9), d=ri(2,6), k=ri(2,6), m=ri(2,4), n=pick([2,3]), r=ri(2,4), s=ri(1,3);
  const L=[]; L.push([`A = ${pw(`(${a} − ${b})`,2)}`,[`A = ${pw(bs(a-b),2)}`,`A = ${F((a-b)**2)}`]]);
  L.push([`B = ${c} − ${pw(d,2)}`,[`B = ${c} − ${d*d}`,`B = ${F(c-d*d)}`]]);
  L.push([`C = ${pw(`(−${m})`,n)} × ${k}`,[`C = ${F((-m)**n)} × ${k}`,`C = ${F((-m)**n*k)}`]]);
  const u=r*(s+1), w=r*r, base=u-w;   /* (r × (s+1) − r²)^2 */
  L.push([`D = ${pw(`(${r} × ${s+1} − ${r}<sup>2</sup>)`,2)}`,[`D = ${pw(`(${u} − ${w})`,2)}`,`D = ${pw(bs(base),2)}`,`D = ${F(base*base)}`]]);
  return L; })();

/* ===== Exercice 3 : quitte ou double ===== */
const Q3=(()=>{ const n=ri(6,11), S=pick([1000,2000,3000,10000,20000,50000]); let m=1; while(Math.pow(2,m-1)<=S) m++; return {n,S,m}; })();

/* ===== Exercice 5 : exposants positifs et négatifs ===== */
const E5=distinct(6,()=>{ const b=pick([2,3,4,5,6,7,-2,-3,-4,-5,10]), n=ri(1,3)*pick([1,-1]); return [b,n]; },v=>v.join(","));
const e5h=([b,n])=>pw(bs(b),n);
const e5c=([b,n])=>{ const v=Math.pow(b,Math.abs(n));
  if(n>0) return `${n>1?prod(b,n)+" = ":""}${F(v)}`;
  const fr=v<0?`−{1/${-v}}`:`{1/${v}}`, dd=(Math.abs(b)===10||[2,4,5,-2,-4,-5].includes(b))?` = ${dec(1/v*1e6<0?-Math.round(-1e6/v):Math.round(1e6/v),-6)}`:"";
  return `${FRH("1",pw(bs(b),-n))} = ${FRH("1",F(v))}${v<0?` = ${fr}`:""}${dd}`; };

/* ===== Exercice 6 et 8 : puissances de 10 ===== */
const E6=shuf(distinct(6,()=>nz(-7,7),v=>v));
const E8=distinct(6,()=>{ const M=pick([ri(2,99),ri(101,9999)]), q=-ri(0,3), n=nz(-5,5); return [M,q,n]; },v=>v.join(","));

/* ===== Préfixes scientifiques ===== */
const U=[["G",9],["M",6],["k",3],["",0],["m",-3],["μ",-6],["n",-9]];
const PR=distinct(4,()=>{ const unit=pick(["m","m","g","o"]), UU=unit==="o"?U.slice(0,4):U; let a,b; do{ a=pick(UU); b=pick(UU); }while(a===b||Math.abs(a[1]-b[1])>12); const M=ri(2,999), q=-ri(0,2); return {unit,a,b,M,q}; },v=>v.a[0]+v.b[0]);

/* ===== Calculer avec des puissances ===== */
const R=distinct(8,()=>{ const t=pick(["x","x","q","q","pp","x3","f"]), b=pick([2,3,5,7,10]); return {t,b,n:nz(-6,9),p:nz(-6,9),r:nz(-5,5)}; },v=>v.t+v.b+v.n+v.p);
const rH=v=>v.t==="x"?`${pw(v.b,v.n)} × ${pw(v.b,v.p)}`:v.t==="q"?FRH(pw(v.b,v.n),pw(v.b,v.p)):v.t==="pp"?pw("("+pw(v.b,Math.abs(v.n))+")",Math.abs(v.p)):v.t==="x3"?`${P10(v.n)} × ${P10(v.p)} × ${P10(v.r)}`:FRH(P10(v.n)+" × "+P10(v.p),P10(v.r));
const par=e=>e<0?`(${E(e)})`:E(e);
const rC=v=>v.t==="x"?`${pw(v.b,`${E(v.n)} + ${par(v.p)}`)} = ${pw(v.b,v.n+v.p)}`:v.t==="q"?`${pw(v.b,`${E(v.n)} − ${par(v.p)}`)} = ${pw(v.b,v.n-v.p)}`:v.t==="pp"?`${pw(v.b,`${Math.abs(v.n)} × ${Math.abs(v.p)}`)} = ${pw(v.b,Math.abs(v.n*v.p))}`
  :v.t==="x3"?`${pw("10",`${E(v.n)} + ${par(v.p)} + ${par(v.r)}`)} = ${P10(v.n+v.p+v.r)}`:`${FRH(P10(v.n+v.p),P10(v.r))} = ${pw("10",`${E(v.n+v.p)} − ${par(v.r)}`)} = ${P10(v.n+v.p-v.r)}`;

/* ===== Notation scientifique ===== */
const S12=distinct(6,()=>{ let M; do{ M=ri(2,9999); }while(M%10===0); return [M,ri(-8,6)]; },v=>v.join(","));
const S13=distinct(4,()=>{ let M,q; do{ M=ri(2,9999); q=ri(-4,1); }while(M%10===0||sciOf(M,q).e===0); const n=nz(-6,6); return [M,q,n]; },v=>v.join(","));
const s13c=([M,q,n])=>{ const s0=sciOf(M,q), s=sciOf(M,q+n); return `${dec(M,q)} × ${P10(n)} = ${dec(s0.M,s0.q)} × ${P10(s0.e)} × ${P10(n)} = ${dec(s.M,s.q)} × ${P10(s.e)}`; };
const S14=distinct(2,()=>{ const c=pick([2,4,5,8]); let a,b; do{ a=ri(2,9); b=ri(2,9); }while((a*b)%c!==0 && c!==2 && c!==4 && c!==5 && c!==8);
  const m=nz(-8,8), n=nz(-8,8), p=nz(-6,6); return {a,b,c,m,n,p}; },v=>v.a+"-"+v.b+"-"+v.c);
const s14c=v=>{ const num=v.a*v.b, K=Math.round(num*1000/v.c), e=v.m+v.n-v.p, q=dec(K,-3), s=sciOf(K,e-3);
  return `${FRH(`${v.a} × ${v.b}`,v.c)} × ${FRH(P10(v.m)+" × "+P10(v.n),P10(v.p))} = ${FRH(num,v.c)} × ${FRH(P10(v.m+v.n),P10(v.p))} = ${q} × ${P10(e)}${`${q} × ${P10(e)}`!==`${dec(s.M,s.q)} × ${P10(s.e)}`?` = ${dec(s.M,s.q)} × ${P10(s.e)}`:""}`; };

return [
 {t:"Puissances d'exposant positif", e:[
  {n:"Exercice 1", t:"Décomposer et calculer (sans calculatrice)", w:"Sur ta feuille", h:`<p>Décompose chaque puissance sous la forme d'un produit et donne le résultat, sans calculatrice.</p>${cols(E1.map((v,i)=>nmH(i,e1h(v))))}`,
   c:cols(E1.map((v,i)=>nm(i,[e1h(v),...e1c(v).split(" = ")])))},
  {n:"Exercice 2", t:"Priorités opératoires (sans calculatrice)", w:"Sur ton cahier", h:`<p>Recopie le calcul et calcule en tenant compte des priorités opératoires.</p>${cols(P2.map(x=>x[0]))}`,
   c:cols(P2.map(x=>calc([x[0],...x[1]])))},
  {n:"Exercice 3", t:"Jeu du « quitte ou double »", w:"Sur ton cahier", h:`<p>Au jeu « Le quitte ou double », la première bonne réponse rapporte 1 €, et ensuite chaque bonne réponse permet de doubler son gain.</p><p><b>1)</b> Un joueur a répondu correctement à ${Q3.n} questions de suite. Quel est son gain ?</p><p><b>2)</b> Combien de bonnes réponses consécutives, au minimum, lui faut-il pour gagner plus de ${F(Q3.S)} € ?</p>`,
   c:`<p>Après 1 bonne réponse : 1 € = ${pw("2",0)} ; après 2 : 2 € = ${pw("2",1)} ; après 3 : 4 € = ${pw("2",2)}… Après ${X_n()} bonnes réponses, le gain est ${pw("2",'<i>n</i> − 1')} €.</p>
<p><b>1)</b> ${pw("2",`${Q3.n} − 1`)} = ${pw("2",Q3.n-1)} = <b>${F(Math.pow(2,Q3.n-1))} €</b>.</p>
<p><b>2)</b> Après ${Q3.m-1} bonnes réponses : ${pw("2",Q3.m-2)} = ${F(Math.pow(2,Q3.m-2))} € (pas plus de ${F(Q3.S)} €). Après ${Q3.m} bonnes réponses : ${pw("2",Q3.m-1)} = ${F(Math.pow(2,Q3.m-1))} €.</p><p>Il faut au minimum <b>${Q3.m} bonnes réponses</b>.</p>`}
 ]},
 {t:"Exposants négatifs et puissances de 10", e:[
  {n:"Exercice 4", t:"Les puissances d'exposants positifs et négatifs", w:"Sur ta feuille", h:`<p>Donne le résultat sous la forme d'une écriture décimale ou d'une fraction réduite.</p>${cols(E5.map((v,i)=>nmH(i,e5h(v))))}`,
   c:cols(E5.map((v,i)=>nm(i,[e5h(v),...e5c(v).split(" = ")])))},
  {n:"Exercice 5", t:"Les puissances de 10", w:"Sur ta feuille", h:`<p>Donne directement le résultat en écriture décimale.</p>${cols(E6.map((n,i)=>`${L[i]}) ${P10(n)}`))}`,
   c:cols(E6.map((n,i)=>`${L[i]}) ${P10(n)} = ${dec(1,n)}`))},
  {n:"Exercice 6", t:"Multiplier un nombre par une puissance de 10", w:"Sur ta feuille", h:`<p>Donne l'écriture décimale de chaque expression.</p>${cols(E8.map(([M,q,n],i)=>`${"ABCDEF"[i]} = ${dec(M,q)} × ${P10(n)}`))}`,
   c:cols(E8.map(([M,q,n],i)=>{ const A="ABCDEF"[i]; return calc([`${A} = ${dec(M,q)} × ${P10(n)}`,`${A} = ${dec(M,q)} × ${dec(1,n)}`,`${A} = ${dec(M,q+n)}`]); }))+`<p>Multiplier par ${pw("10","<i>n</i>")} décale la virgule de ${"<i>n</i>"} rangs vers la droite ; par ${pw("10","−<i>n</i>")}, de ${"<i>n</i>"} rangs vers la gauche.</p>`}
 ]},
 {t:"Préfixes scientifiques", e:[
  {n:"Exercice 7", t:"Conversion d'unités avec les préfixes scientifiques", w:"Sur ton cahier", h:`<p>Convertis dans l'unité demandée. Donne l'écriture décimale et la notation scientifique.</p>${cols(PR.map((v,i)=>`${L[i]}) ${dec(v.M,v.q)} ${v.a[0]}${v.unit} = … ${v.b[0]}${v.unit}`))}`,
   c:cols(PR.map((v,i)=>{ const e=v.a[1]-v.b[1]; return `${L[i]}) ${dec(v.M,v.q)} ${v.a[0]}${v.unit} = ${dec(v.M,v.q)} × ${P10(e)} ${v.b[0]}${v.unit} = ${dec(v.M,v.q+e)} ${v.b[0]}${v.unit} = ${sci(v.M,v.q+e)} ${v.b[0]}${v.unit}`; }))+`<p>Rappel : G = ${P10(9)} · M = ${P10(6)} · k = ${P10(3)} · m = ${P10(-3)} · μ = ${P10(-6)} · n = ${P10(-9)}</p>`}
 ]},
 {t:"Calculer avec des puissances", e:[
  {n:"Exercice 8", t:"Calculs avec des puissances", w:"Sur ton cahier", h:`<p>Exprime le résultat sous la forme d'une puissance.</p>${cols(R.map((v,i)=>nmH(i,rH(v))))}`,
   c:cols(R.map((v,i)=>nm(i,[rH(v),...rC(v).split(" = ")])))}
 ]},
 {t:"Notation scientifique", e:[
  {n:"Exercice 9", t:"De l'écriture décimale à la notation scientifique", w:"Sur ton cahier", h:`<p>Écris chacun de ces nombres en notation scientifique.</p>${cols(S12.map(([M,p],i)=>`${L[i]}) ${dec(M,p)}`))}`,
   c:cols(S12.map(([M,p],i)=>`${L[i]}) ${dec(M,p)} = ${sci(M,p)}`))},
  {n:"Exercice 10", t:"Écrire un produit en notation scientifique", w:"Sur ton cahier", h:`<p>Écris le résultat de chaque produit en notation scientifique.</p>${cols(S13.map((v,i)=>nmH(i,`${dec(v[0],v[1])} × ${P10(v[2])}`)))}`,
   c:cols(S13.map((v,i)=>nm(i,s13c(v).split(" = "))))},
  {n:"Exercice 11", t:"Calculer un quotient d'écritures scientifiques", w:"Sur ton cahier", h:`<p>Exprime le résultat de chaque calcul en notation scientifique.</p>${cols(S14.map((v,i)=>`${"AB"[i]} = ${FRH(`${v.a} × ${P10(v.m)} × ${v.b} × ${P10(v.n)}`,`${v.c} × ${P10(v.p)}`)}`))}`,
   c:cols(S14.map((v,i)=>{ const A="AB"[i]; return calc([`${A} = ${FRH(`${v.a} × ${P10(v.m)} × ${v.b} × ${P10(v.n)}`,`${v.c} × ${P10(v.p)}`)}`,...s14c(v).split(" = ").map(t=>`${A} = ${t}`)]); }))}
 ]}
];
function X_n(){ return "<i>n</i>"; }
};
