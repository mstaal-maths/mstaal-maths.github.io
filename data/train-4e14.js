/* 4e · chapitre 14 — fiche d'entraînement : les exercices de M. Staal (multiplier, prendre une fraction d'un nombre,
   inverse et division) avec d'autres nombres. Corrections calculées avec des entiers (outils window.FR14 de data/4e-14.js). */
TRAIN["4e-14"] = function(){
const {ri, pick, shuf, distinct} = TR;
const {gcd,M,P,F,red,R,FR2,mul,inv,div,calc,line,bande} = window.FR14;
const nz=(a,b)=>{ let x; do{ x=ri(a,b); }while(x===0); return x; };
const L6="ABCDEF";
const cop=(a,b)=>gcd(a,b)===1;
const fr=(neg=false)=>{ for(;;){ const b=ri(2,9), a=neg?nz(-9,9):ri(1,9); if(cop(a,b)) return [a,b]; } };
const N=x=>{ const v=Math.round(x*100)/100, [i,d]=String(v).split("."); return i+(d?","+(d.length<2?d+"0":d):""); };

/* ===== A. Multiplier ===== */
const E1=(()=>{ const out=[]; const add=f=>{ for(let g=0;g<200;g++){ const x=f(); const k=x.slice(0,4).join(","); if(!out.some(o=>o.slice(0,4).join(",")===k)){ out.push(x); return; } } };
  add(()=>[...fr(),...fr()]); add(()=>[...fr(),...fr()]);
  add(()=>{ const [a,b]=fr(), [c,d]=fr(); return [-a,b,c,-d]; });
  add(()=>{ const [a,b]=fr(true), [c,d]=fr(); return [a<0?a:-a,b,c,d]; });
  add(()=>{ const [c,d]=fr(); return [ri(2,9),1,c,d]; });
  add(()=>{ const [c,d]=fr(); return [-ri(2,9),1,-c,d]; });
  return out.map(([a,b,c,d])=>({a,b,c,d,S:mul(a,b,c,d,{start:[`${b===1?P(a):F(a,b)} × ${F(c,d)}`]})})); })();
function cross(big){ for(;;){ const k=ri(2,big?12:7), m=ri(2,big?12:7), x=ri(1,big?9:5), y=ri(1,big?9:5), z=ri(1,big?9:5), w=ri(1,big?9:5);
  const a=k*x, b=m*y, c=m*z, d=k*w; if(k===m||b===1||d===1||!cop(a,b)||!cop(c,d)||!cop(x*z,y*w)) continue; if(big&&(a<10||b<10||c<10||d<10)) continue;
  return {a,b,c,d,S:mul(a,b,c,d,{cancel:[`{${a} × ${c}/${b} × ${d}}`, `{${k} × ${x} × ${m} × ${z}/${m} × ${y} × ${k} × ${w}}`, `{${x} × ${z}/${y} × ${w}}`]})}; } }
const E2=[cross(false),cross(false),cross(false),cross(false),cross(false)];
const T3=(()=>{ const s=shuf([2,3,4,5,6,7,8,9]).slice(0,4).sort((p,q)=>p-q); const [p,q,r,t]=s; return {p,q,r,t}; })(); /* p/q × q/r × r/t = p/t */
const E3=[cross(true),cross(true),cross(true),cross(true)];

/* ===== B. Fraction d'un nombre ===== */
const E4=(()=>{ let n,k; do{ n=ri(3,8); k=ri(1,n-1); }while(!cop(k,n)); const v=ri(3,9); return {n,k,v,T:n*v}; })();
const E5=(()=>{ let n,k; do{ n=pick([10,20,25,50]); k=ri(1,n-1); }while(!cop(k,n)); const q=pick([2,3,4,5,6,8]); return {n,k,T:n*q,q}; })();
const UN=[["élèves",""],["m",""],["L",""],["moutons",""],["€",""],["min",""],["km",""],["bonbons",""]];
const E6=distinct(4,()=>{ let n,k; do{ n=ri(2,10); k=ri(1,n-1); }while(!cop(k,n)); const v=ri(2,12); return [k,n,v,pick(UN)[0]]; }, x=>x[1]+"-"+x[3]);
const E7=(()=>{ const n=pick([4,5,10]); let k; do{ k=ri(1,n-1); }while(!cop(k,n)); const p=ri(60,180); return {n,k,p,c:Math.round(p*k/n*100)/100}; })();

/* ===== C. Inverse et division ===== */
const E8=(()=>{ const [a,b]=fr(), [c,d]=fr(); const e=ri(2,15); return [[a,b],[-c,d],[e,1],[1,ri(2,12)],[-ri(2,9),1]].map(([x,y])=>({x,y,i:inv(x,y)})); })();
const E9=(()=>{ const out=[]; for(let i=0;i<4;i++){ const [a,b]=fr(), [c,d]=fr(); out.push([a,b,c,d,`${F(a,b)} ÷ ${F(c,d)}`]); }
  { const [a,b]=fr(), k=ri(2,6); out.push([a,b,k,1,`${F(a,b)} ÷ ${k}`]); } { const k=ri(2,9), [c,d]=fr(); out.push([k,1,c,d,`${k} ÷ ${F(c,d)}`]); }
  return shuf(out).map(([a,b,c,d,t])=>({t, S:div(a,b,c,d,{first:t, mid:(b===1||d===1)?[`${F(a,b)===String(a)?`{${a}/1}`:F(a,b)} ÷ ${d===1?`{${c}/1}`:F(c,d)}`]:[]})})); })();
const E10=(()=>{ const [a,b]=fr(), [c,d]=fr(true); const [e,f]=fr(); const g=nz(-9,9), [h,k]=fr(); const [m,n]=fr(true), q=ri(2,9);
  return [
    {top:F(a,b), bot:F(c,d), S:div(a,b,c,d,{first:FR2(F(a,b),F(c,d)), mid:[`${F(a,b)} ÷ ${F(c,d)}`]})},
    {top:F(e,f), bot:F(1,f), S:div(e,f,1,f,{first:FR2(F(e,f),F(1,f)), mid:[`${F(e,f)} ÷ ${F(1,f)}`]})},
    {top:M(g), bot:F(h,k), S:div(g,1,h,k,{first:FR2(M(g),F(h,k)), mid:[`${M(g)} ÷ ${F(h,k)}`,`{${M(g)}/1} ÷ ${F(h,k)}`]})},
    {top:F(m,n), bot:String(q), S:div(m,n,q,1,{first:FR2(F(m,n),String(q)), mid:[`${F(m,n)} ÷ ${q}`,`${F(m,n)} ÷ {${q}/1}`]})}]; })();

return [
 {t:"Multiplier des fractions", e:[
  {n:"Exercice 1", t:"Multiplier puis simplifier", w:"Sur ton cahier", h:`<p>Calcule et donne le résultat sous forme d'une fraction simplifiée.</p>${E1.map((x,i)=>`<p>${L6[i]} = ${x.S.L[0]}</p>`).join("")}`,
   c:E1.map((x,i)=>calc(L6[i],x.S.L)).join("")},
  {n:"Exercice 2", t:"Simplifier avant de multiplier", w:"Sur ton cahier", h:`<p>Calcule en simplifiant avant d'effectuer les multiplications.</p>${E2.map((x,i)=>`<p>${L6[i]} = ${x.S.L[0]}</p>`).join("")}<p>F = ${F(T3.p,T3.q)} × ${F(T3.q,T3.r)} × ${F(T3.r,T3.t)}</p>`,
   c:E2.map((x,i)=>calc(L6[i],x.S.L)).join("")+calc("F",[`${F(T3.p,T3.q)} × ${F(T3.q,T3.r)} × ${F(T3.r,T3.t)}`,`{${T3.p} × ${T3.q} × ${T3.r}/${T3.q} × ${T3.r} × ${T3.t}}`,F(T3.p,T3.t),...(gcd(T3.p,T3.t)>1?[R(T3.p,T3.t)]:[])])},
  {n:"Exercice 3", t:"Décomposer pour simplifier", w:"Sur ton cahier", h:`<p>Calcule et donne le résultat sous forme d'une fraction simplifiée.</p>${E3.map((x,i)=>`<p>${L6[i]} = ${x.S.L[0]}</p>`).join("")}`,
   c:E3.map((x,i)=>calc(L6[i],x.S.L)).join("")}
 ]},
 {t:"Prendre une fraction d'un nombre", e:[
  {n:"Exercice 4", t:"Les bonbons", w:"Sur ton cahier", h:`<p>Arthur achète un sachet de ${E4.T} bonbons.</p><p>${E4.k===1?"Le":"Les"} ${F(E4.k,E4.n)} des bonbons ${E4.k===1?"est":"sont"} au chocolat et le reste des bonbons sont au caramel.</p><p>Combien y a-t-il de bonbons au chocolat ? et au caramel ?</p>`,
   c:`${bande(E4.n,E4.k,E4.v)}<p>${E4.T} ÷ ${E4.n} = ${E4.v} : {1/${E4.n}} du sachet représente ${E4.v} bonbons.</p><p class="calc">${F(E4.k,E4.n)} × ${E4.T} = ${E4.k} × ${E4.v} = ${E4.k*E4.v}</p><p>Il y a <b>${E4.k*E4.v} bonbons au chocolat</b> et ${E4.T} − ${E4.k*E4.v} = <b>${E4.T-E4.k*E4.v} bonbons au caramel</b>.</p>`},
  {n:"Exercice 5", t:"Dans une entreprise", w:"Sur ton cahier", h:`<p>Dans une entreprise de ${E5.T} salariés, ${E5.k===1?"le":"les"} ${F(E5.k,E5.n)} ${E5.k===1?"est blond":"sont blonds"}.</p><p>Combien y a-t-il de personnes blondes dans cette entreprise ?</p>`,
   c:`<p class="calc">${F(E5.k,E5.n)} × ${E5.T} = {${E5.k} × ${E5.T}/${E5.n}} = {${E5.k} × ${E5.n} × ${E5.q}/${E5.n}} = ${E5.k*E5.q}</p><p>Il y a <b>${E5.k*E5.q} personnes blondes</b>.</p>`},
  {n:"Exercice 6", t:"Calcul mental", w:"Sur ton cahier", h:`<p>Indique la quantité représentée dans chaque cas.</p>${E6.map(([k,n,v,u],i)=>`<p>${"abcd"[i]}) ${F(k,n)} de ${n*v} ${u}</p>`).join("")}`,
   c:E6.map(([k,n,v,u],i)=>`<p>${"abcd"[i]}) ${n*v} ÷ ${n} = ${v}${k>1?` et ${k} × ${v} = ${k*v}`:""} : <b>${k*v} ${u}</b>.</p>`).join("")},
  {n:"Exercice 7", t:"L'abonnement de bus (calculatrice autorisée)", w:"Sur ton cahier", h:`<p>Le coût réel d'un abonnement mensuel de bus est de ${N(E7.p)} €.</p><p>La communauté d'agglomération prend en charge ${E7.k===1?"le":"les"} ${F(E7.k,E7.n)} de ce montant.</p><p>Combien l'usager paie-t-il cet abonnement ?</p>`,
   c:`<p class="calc">${F(E7.k,E7.n)} × ${N(E7.p)} = ${N(E7.c)}</p><p>La communauté d'agglomération prend en charge ${N(E7.c)} €.</p><p class="calc">${N(E7.p)} − ${N(E7.c)} = ${N(E7.p-E7.c)}</p><p>L'usager paie <b>${N(E7.p-E7.c)} €</b>.</p>`}
 ]},
 {t:"Inverse et division", e:[
  {n:"Exercice 8", t:"Inverse d'un nombre", w:"Sur ton cahier", h:`<p>Donne l'inverse de chaque nombre.</p>${E8.map((o,i)=>`<p>${"abcde"[i]}) ${F(o.x,o.y)}</p>`).join("")}`,
   c:E8.map((o,i)=>`<p>${"abcde"[i]}) L'inverse de ${F(o.x,o.y)} est <b>${F(...o.i)}</b> car ${F(o.x,o.y)} × ${F(...o.i)} = 1.</p>`).join("")},
  {n:"Exercice 9", t:"Diviser des fractions", w:"Sur ton cahier", h:`<p>Calcule et donne le résultat sous forme d'une fraction simplifiée.</p>${E9.map((o,i)=>`<p>${L6[i]} = ${o.t}</p>`).join("")}`,
   c:E9.map((o,i)=>calc(L6[i],o.S.L)).join("")},
  {n:"Exercice 10", t:"Des fractions de fractions", w:"Sur ton cahier", h:`<p>Calcule et donne le résultat sous forme d'une fraction simplifiée.</p><div class="figs" style="gap:40px">${E10.map((o,i)=>`<p>${L6[i]} = ${FR2(o.top,o.bot)}</p>`).join("")}</div>`,
   c:E10.map((o,i)=>calc(L6[i],o.S.L)).join("")}
 ]}
];
};
