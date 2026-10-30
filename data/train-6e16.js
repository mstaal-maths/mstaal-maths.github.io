/* 6e · chapitre 16 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres */
TRAIN["6e-16"] = function(){
const {ri, pick, shuf, distinct, items} = TR;
const {F, FS, gcd, simp, CALCS, ENO} = window.FIG16;
/* fin d'un calcul : simplification éventuelle, dernière ligne en gras */
const fin = (st, n, d) => { st.push(n===0?"0":F(n,d)); if(n!==0){ const [p,q]=simp(n,d); if(p!==n) st.push(q===1?String(p):F(p,q)); } st[st.length-1]=`<b>${st[st.length-1]}</b>`; return st; };
const tr3 = (a,b) => fr((Math.floor(a*1000/b)/1000).toFixed(3));
const fr = x => String(x).replace(".",",");
const dec = (a,b) => { for(const k of [0,1,2,3]){ if((a*10**k)%b===0) { const n=a*10**k/b; const s=String(n).padStart(k+1,"0"); return k? (String(+s.slice(0,-k))+","+s.slice(-k)) : String(n); } } return null; };
const appr = (a,b) => fr((Math.round(a*100/b)/100).toFixed(2));

/* ---------- A. Quotient ---------- */
const eg = distinct(6, ()=>[ri(2,12), ri(1,40)], x=>x.join());
const L5 = distinct(6, ()=>{ const b=ri(2,9), a=ri(1,2*b), k=ri(2,6); return [a,b,k,pick(["×","÷"])]; }, x=>x.join());
const e4 = distinct(6, ()=>{ const b=pick([2,3,4,5,6,7,8,9,20,25]); return [ri(1,3*b), b]; }, x=>x.join());
const secA = {t:"La fraction, un quotient", e:[
  {n:"Exercice 1", t:"Des égalités à compléter", w:"Sur ton cahier", h:`<p>Complète par une fraction, puis par un nombre décimal quand c'est possible : ${items(eg.map(([b,a])=>`${b} × …… = ${a}`),"  ·  ",true)}</p>`,
   c:items(eg.map(([b,a])=>{ const d=dec(a,b); return `${b} × ${F(a,b)} = ${a}${d!==null?` ; ${F(a,b)} = <b>${d}</b>`:` : pas d'écriture décimale (${a} ÷ ${b} = ${tr3(a,b)}…)`}`; }),"<br>",true)},
  {n:"Exercice 2", t:"Écriture décimale", w:"Sur ton cahier", h:`<p>Donne l'écriture décimale de chaque fraction, ou une valeur approchée au centième : ${items(e4.map(([a,b])=>F(a,b)),"  ·  ",true)}</p>`,
   c:items(e4.map(([a,b])=>{ const d=dec(a,b); return d!==null?`${F(a,b)} = ${a} ÷ ${b} = <b>${d}</b>`:`${F(a,b)} = ${a} ÷ ${b} = ${tr3(a,b)}… ≈ <b>${appr(a,b)}</b>`; }),"  ·  ",true)},
  {n:"Exercice 3", t:"Fractions égales", w:"Sur ton cahier", h:`<p>Complète : ${items(L5.map(([a,b,k,o])=>o==="×"?`${F(a,b)} = ${F("……",b*k)}`:`${F(a*k,b*k)} = ${F("……",b)}`),"  ·  ",true)}</p>`,
   c:items(L5.map(([a,b,k,o])=>o==="×"?`${F(a,b)} = ${F(`${a} × ${k}`,`${b} × ${k}`)} = <b>${F(a*k,b*k)}</b>`:`${F(a*k,b*k)} = ${F(`${a*k} ÷ ${k}`,`${b*k} ÷ ${k}`)} = <b>${F(a,b)}</b>`),"  ·  ",true)}
 ]};

/* ---------- B. Comparer ---------- */
const cmp = distinct(6, ()=>{ const t=pick(["m","k","n"]); const d=ri(3,9); if(t==="m"){ return [ri(1,2*d),d,ri(1,2*d),d]; } if(t==="k"){ const k=pick([2,3,4]); return [ri(1,2*d),d,ri(1,2*d*k),d*k]; } const n=ri(2,7); let d2; do{ d2=ri(3,11); }while(d2===d); return [n,d,n,d2]; }, x=>x.join());
const sign = (a,b,c,d) => a*d<c*b?"&lt;":a*d>c*b?"&gt;":"=";
const rd = pick([8,12]);
const R = distinct(4, ()=>{ const den=pick(rd===8?[2,4,8]:[3,4,6,12]); const num=ri(1,den-1); return [num,den]; }, x=>x[0]*rd/x[1]);
const enc = distinct(3, ()=>{ const b=pick([3,4,6,7,8,9]); let a; do{ a=ri(b+1,6*b); }while((a*10)%b===0); return [a,b]; }, x=>x.join());
const secB = {t:"Comparer, encadrer et ranger", e:[
  {n:"Exercice 4", t:"Comparer", w:"Sur ton cahier", h:`<p>Complète par &lt;, &gt; ou = : ${items(cmp.map(([a,b,c,d])=>`${F(a,b)} …… ${F(c,d)}`),"  ·  ",true)}</p>`,
   c:items(cmp.map(([a,b,c,d])=>{ const s=sign(a,b,c,d); let why=""; if(b===d) why="même dénominateur"; else if(a===c) why="même numérateur : le plus petit dénominateur l'emporte"; else { const m=d/b; why = Number.isInteger(m)? `${F(a,b)} = ${F(a*m,d)}` : `${F(c,d)} = ${F(c*b/d,b)}`; } return `${F(a,b)} <b>${s}</b> ${F(c,d)} (${why})`; }),"<br>",true)},
  {n:"Exercice 5", t:"Ranger", w:"Sur ton cahier", h:`<p>Range dans l'ordre croissant : ${R.map(([a,b])=>F(a,b)).join(" ; ")}</p>`,
   c:`<p>Sur ${rd} : ${R.map(([a,b])=>`${F(a,b)} = ${F(a*rd/b,rd)}`).join(" ; ")}.</p><p>${[...R].sort((x,y)=>x[0]/x[1]-y[0]/y[1]).map(([a,b])=>F(a,b)).join(" &lt; ")}</p>`},
  {n:"Exercice 6", t:"Encadrer", w:"Sur ton cahier", h:`<p>Encadre chaque fraction par deux entiers consécutifs, puis au dixième : ${items(enc.map(([a,b])=>F(a,b)),"  ·  ",true)}</p>`,
   c:items(enc.map(([a,b])=>{ const q=Math.floor(a/b), t=Math.floor(a*10/b); return `${a} ÷ ${b} = ${(a*1000)%b===0?fr(a/b):fr((Math.floor(a*1000/b)/1000).toFixed(3))+"…"} : <b>${q} &lt; ${F(a,b)} &lt; ${q+1}</b> et <b>${fr((t/10).toFixed(1))} &lt; ${F(a,b)} &lt; ${fr(((t+1)/10).toFixed(1))}</b>`; }),"<br>",true)}
 ]};

/* ---------- C. Additionner, soustraire, multiplier ---------- */
const same = distinct(4, ()=>{ const d=ri(4,12), a=ri(1,d), b=ri(1,d), o=pick(["+","−"]); return o==="−"&&a<b?[b,a,d,o]:[a,b,d,o]; }, x=>x.join());
const mult = distinct(4, ()=>{ const d=pick([2,3,4,5,6]), k=pick([2,3,4]), a=ri(1,2*d), b=ri(1,d*k), o=pick(["+","−"]); return o==="−"&&a*k<b?[a,d,b,d*k,"+"]:[a,d,b,d*k,o]; }, x=>x.join());
const quel = distinct(3, ()=>pick([[1,2,1,3],[2,3,1,4],[1,2,1,5],[2,5,1,3],[1,3,1,4],[3,4,1,5],[3,4,2,3],[5,6,3,4],[1,2,2,5]]), x=>x.join());
const qo = quel.map(([a,b,c,d])=>a/b>c/d?pick(["+","−"]):"+");
const mE = distinct(4, ()=>{ const b=ri(2,9), a=ri(1,b+3), n=ri(2,8); return [n,a,b]; }, x=>x.join());
const res = (n,d) => { if(n===0) return " = 0"; const [p,q]=simp(n,d); return (p!==n? ` = ${q===1?p:F(p,q)}`:"") ; };
const secC = {t:"Calculer avec des fractions", e:[
  {n:"Exercice 7", t:"Même dénominateur", w:"Sur ton cahier", h:`<p>Calcule.</p>${ENO(same.map(([a,b,d,o])=>`${F(a,d)} ${o} ${F(b,d)}`))}`,
   c:CALCS(same.map(([a,b,d,o])=>{ const n=o==="+"?a+b:a-b; return fin([`${F(a,d)} ${o} ${F(b,d)}`, F(`${a} ${o} ${b}`,d)], n, d); }))},
  {n:"Exercice 8", t:"Un dénominateur multiple de l'autre", w:"Sur ton cahier", h:`<p>Calcule.</p>${ENO(mult.map(([a,d,b,D,o])=>`${F(a,d)} ${o} ${F(b,D)}`))}`,
   c:CALCS(mult.map(([a,d,b,D,o])=>{ const k=D/d, n=o==="+"?a*k+b:a*k-b; return fin([`${F(a,d)} ${o} ${F(b,D)}`, `${F(`${a} × ${k}`,`${d} × ${k}`)} ${o} ${F(b,D)}`, `${F(a*k,D)} ${o} ${F(b,D)}`], n, D); }))},
  {n:"Exercice 9", t:"Dénominateurs quelconques", w:"Sur ton cahier", h:`<p>Trouve un dénominateur commun, puis calcule.</p>${ENO(quel.map(([a,b,c,d],i)=>`${F(a,b)} ${qo[i]} ${F(c,d)}`))}`,
   c:CALCS(quel.map(([a,b,c,d],i)=>{ const o=qo[i], m=b*d, n=o==="+"?a*d+c*b:a*d-c*b; return fin([`${F(a,b)} ${o} ${F(c,d)}`, `${F(`${a} × ${d}`,`${b} × ${d}`)} ${o} ${F(`${c} × ${b}`,`${d} × ${b}`)}`, `${F(a*d,m)} ${o} ${F(c*b,m)}`], n, m); }))},
  {n:"Exercice 10", t:"Multiplier par un entier", w:"Sur ton cahier", h:`<p>Calcule.</p>${ENO(mE.map(([n,a,b])=>`${n} × ${F(a,b)}`))}`,
   c:CALCS(mE.map(([n,a,b])=>fin([`${n} × ${F(a,b)}`, F(`${n} × ${a}`,b)], n*a, b)))}
 ]};

/* ---------- D. Fraction d'une quantité ---------- */
const q1 = distinct(6, ()=>{ const b=pick([2,3,4,5,6,8,10]), a=ri(1,b-1), k=ri(2,12); return [a,b,b*k]; }, x=>x.join());
const cl = pick([24,28,30,32]);
const fC = pick([[3,4],[3,8],[5,8],[2,3],[5,6]].filter(([a,b])=>cl%b===0));
const prix = pick([40,60,80,90,120]), soldes = pick([[4,5],[3,4],[2,3],[7,10]].filter(([a,b])=>prix%b===0));
const traj = pick([120,160,200,240]), tf = pick([[5,8],[3,4],[2,5],[3,10]].filter(([a,b])=>traj%b===0));
const secD = {t:"Prendre une fraction d'une quantité", e:[
  {n:"Exercice 11", t:"Calcul mental", w:"Sur ton cahier", h:`<p>${items(q1.map(([a,b,n])=>`${F(a,b)} de ${n}`),"  ·  ",true)}</p>`,
   c:items(q1.map(([a,b,n])=>`(${n} ÷ ${b}) × ${a} = <b>${n/b*a}</b>`),"  ·  ",true)},
  {n:"Exercice 12", t:"Des problèmes", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> dans une classe de ${cl} élèves, les ${F(fC[0],fC[1])} sont demi-pensionnaires. Combien d'élèves sont demi-pensionnaires ?</p><p><b>Problème 2 :</b> un jeu coûte ${prix} €. En soldes, on paie les ${F(soldes[0],soldes[1])} du prix. Combien coûte le jeu ?</p><p><b>Problème 3 :</b> sur un trajet de ${traj} km, une famille a parcouru les ${F(tf[0],tf[1])}. Combien de kilomètres reste-t-il ?</p>`,
   c:`<p><b>Problème 1 :</b> (${cl} ÷ ${fC[1]}) × ${fC[0]} = <b>${cl/fC[1]*fC[0]} élèves</b>.</p><p><b>Problème 2 :</b> (${prix} ÷ ${soldes[1]}) × ${soldes[0]} = <b>${prix/soldes[1]*soldes[0]} €</b>.</p><p><b>Problème 3 :</b> parcouru : (${traj} ÷ ${tf[1]}) × ${tf[0]} = ${traj/tf[1]*tf[0]} km. Il reste ${traj} − ${traj/tf[1]*tf[0]} = <b>${traj-traj/tf[1]*tf[0]} km</b>.</p>`}
 ]};

return [secA, secB, secC, secD];
};
