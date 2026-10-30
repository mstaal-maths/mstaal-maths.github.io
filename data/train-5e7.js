/* 5e · chapitre 7 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres.
   Toutes les corrections (et les figures) sont calculées à partir des mêmes valeurs. */
TRAIN["5e-7"] = function(){
const {ri, pick, shuf, distinct, items} = TR;
const {F, RS, gcd, lcm, simp, cmp, cols, conv, simpl, steps2, val2, fl, bars, wall, LT, GT, NL} = window.FR7;
const fr = (p,q) => q===1 ? String(p) : F(p,q);
const L4 = "ABCDEFGHI";
/* écriture décimale exacte (ou null) */
const decOf = (a,b) => { const [p,q]=simp(a,b); let x=q; while(x%2===0) x/=2; while(x%5===0) x/=5; return x!==1 ? null : String(+(p/q).toFixed(6)).replace(".",","); };
/* fraction irréductible au hasard, différente de 1 */
const irr = (pmax, qmin, qmax, lt1) => { let p,q; do{ q=ri(qmin,qmax); p=ri(1, lt1 ? q-1 : pmax); }while(gcd(p,q)!==1 || p===q); return [p,q]; };
const word = s => s===LT ? "&lt;" : s===GT ? "&gt;" : "=";
const PAIRS = [[6,9],[4,7],[10,15],[4,6],[6,8],[3,4],[5,6],[9,12],[2,3],[3,5],[4,10],[6,10],[8,12],[2,5],[3,8],[5,4]];

/* ================= A. Fractions et quotients ================= */
const t1 = [
  ()=>{ const b=ri(3,9), a=b*ri(2,9); return [a,b]; },
  ()=>[1, pick([2,4,5,8,10,20])],
  ()=>{ const b=pick([3,6,7,9,11,12]); let a; do{ a=ri(2,3*b); }while(a%b===0 || decOf(a,b)); return [a,b]; },
  ()=>{ const b=pick([2,4,5,8,20,25]); let a; do{ a=ri(1,3*b); }while(a%b===0); return [a,b]; },
  ()=>{ const b=pick([4,8,5,2]); let a; do{ a=ri(2,4*b); }while(a%b===0); return [a,b]; },
  ()=>[1, pick([3,6,7,9])]
];
let e1; do{ e1 = t1.map(f=>f()); }while(new Set(e1.map(x=>x.join())).size<6);
const e2 = distinct(6, ()=>{ const b=ri(3,19); let a; do{ a=ri(1,20); }while(a===b); return [a,b]; }, x=>x.join());
const e2h = [([a,b])=>`${b} × ${F(a,b)} = ……`, ([a,b])=>`${F(a,b)} × ${b} = ……`, ([a,b])=>`${b} × ${F("…",b)} = ${a}`, ([a,b])=>`${F("…",b)} × ${b} = ${a}`, ([a,b])=>`…… × ${F(a,b)} = ${a}`, ([a,b])=>`${F(a,b)} × …… = ${a}`];
const e2c = [([a,b])=>`${b} × ${F(a,b)} = <b>${a}</b>`, ([a,b])=>`${F(a,b)} × ${b} = <b>${a}</b>`, ([a,b])=>`${b} × <b>${F(a,b)}</b> = ${a}`, ([a,b])=>`<b>${F(a,b)}</b> × ${b} = ${a}`, ([a,b])=>`<b>${b}</b> × ${F(a,b)} = ${a}`, ([a,b])=>`${F(a,b)} × <b>${b}</b> = ${a}`];
const s3 = pick([3,4,5]), k3 = distinct(4, ()=>{ let k; do{ k=ri(1,3*s3-1); }while(gcd(k,s3)!==1); return k; }, x=>x).sort((a,b)=>a-b);
const s4 = pick([3,4,5,6]), k4 = distinct(3, ()=>{ let k; do{ k=ri(1,2*s4-1); }while(gcd(k,s4)!==1); return k; }, x=>x).sort((a,b)=>a-b);
const k4b = distinct(3, ()=>{ let k; do{ k=ri(1,19); }while(gcd(k,10)!==1); return k; }, x=>x).sort((a,b)=>a-b);
const e5 = distinct(6, ()=>{ let d,e,r,n; do{ d=ri(3,10); e=ri(1,5); r=ri(1,d-1); n=d*e+r; }while(gcd(n,d)!==1); return [n,d,e,r]; }, x=>x[0]+"/"+x[1]);
const e6 = distinct(6, ()=>{ let a,b; do{ b=ri(3,10); a=ri(1,b-1); }while(gcd(a,b)!==1); const Q=b*ri(2,12); return [a,b,Q]; }, x=>x.join());
const secA = {t:"Fractions et quotients", e:[
  {n:"Exercice 1", t:"Opérations à trous", w:"Sur ton cahier", h:`<p>Donne le nombre manquant sous la forme d'une fraction (ou d'un entier), puis son écriture décimale quand elle existe.</p><p>${items(e1.map(([a,b])=>`${b} × …… = ${a}`),"  ·  ",true)}</p>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Égalité</th><th>Fraction</th><th>Écriture décimale</th></tr></thead><tbody>${e1.map(([a,b])=>{ const f=a%b===0?String(a/b):F(a,b), d=decOf(a,b); return `<tr><td>${b} × <b>${f}</b> = ${a}</td><td>${f}</td><td>${d||"pas d'écriture décimale exacte"}</td></tr>`; }).join("")}</tbody></table></div>`},
  {n:"Exercice 2", t:"Multiplier une fraction par son dénominateur", w:"Sur ton cahier", h:`<p>Complète.</p><p>${items(e2.map((x,i)=>e2h[i](x)),"  ·  ",true)}</p>`, c:`<p>On multiplie une fraction par son dénominateur : on trouve son numérateur. b × ${F("a","b")} = a.</p><p>${items(e2.map((x,i)=>e2c[i](x)),"</p><p>",true)}</p>`},
  {n:"Exercice 3", t:"Lire des abscisses", w:"Sur ton cahier", h:`<p>Lis l'abscisse de chaque point sous la forme d'une fraction.</p>${fl({units:3, sub:s3, pts:k3.map((k,i)=>["ABCD"[i],k])})}`,
   c:`<p>Chaque unité est partagée en ${s3}.</p>${fl({units:3, sub:s3, pts:k3.map((k,i)=>["ABCD"[i],k]), show:true})}<p>${k3.map((k,i)=>`${"ABCD"[i]}(${F(k,s3)})`).join(" &nbsp; ")}</p>`},
  {n:"Exercice 4", t:"Placer des fractions", w:"Sur ton cahier", h:`<p>Reproduis chaque droite, place les points, puis écris leur nom au-dessus.</p><p>1) A(${F(k4[0],s4)}), B(${F(k4[1],s4)}) et C(${F(k4[2],s4)}).</p>${fl({units:2, sub:s4})}<p>2) D(${F(k4b[0],10)}), E(${F(k4b[1],10)}) et G(${F(k4b[2],10)}).</p>${fl({units:2, sub:10})}`,
   c:`<p>1) Chaque unité est partagée en ${s4}.</p>${fl({units:2, sub:s4, pts:k4.map((k,i)=>["ABC"[i],k]), show:true})}<p>2) Chaque unité est partagée en 10.</p>${fl({units:2, sub:10, pts:k4b.map((k,i)=>["DEG"[i],k]), show:true})}`},
  {n:"Exercice 5", t:"Partie entière et fraction", w:"Sur ton cahier", h:`<p>Écris chaque fraction sous la forme « entier + fraction inférieure à 1 ». Aide-toi de la division euclidienne.</p><p>${items(e5.map(([n,d])=>F(n,d)),"  ·  ",true)}</p>`,
   c:`<p>${items(e5.map(([n,d,e,r])=>`${F(n,d)} = <b>${e} + ${F(r,d)}</b> &nbsp; (${n} = ${d} × ${e} + ${r})`),"</p><p>",true)}</p>`},
  {n:"Exercice 6", t:"Prendre une fraction d'une quantité", w:"Sur ton cahier", h:`<p>Calcule.</p><p>${items(e6.map(([a,b,Q])=>`${a===1?"le":"les"} ${F(a,b)} de ${Q}`),"  ·  ",true)}</p>`,
   c:`<p>Je divise par le dénominateur, puis je multiplie par le numérateur.</p><div class="calcs">${e6.map(([a,b,Q],i)=>`<div>${NL("ABCDEF"[i],`${Q} ÷ ${b} × ${a} = ${Q/b} × ${a} = <b>${Q/b*a}</b>`).replace('<p class="calc">',`<p class="calc">${"abcdef"[i]}) `)}</div>`).join("")}</div>`}
 ]};

/* ================= B. Fractions égales et simplification ================= */
const e7 = [0,1,2,3,4,5].map(i=>{ const [a,b]=irr(9,2,9), k=ri(2,8), t=[0,1,2,3,4,0][i];
  if(t===0) return [`${F(a,b)} = ${F("…",b*k)}`, `${F(a,b)} = <b>${F(a*k,b*k)}</b> &nbsp; (× ${k})`];
  if(t===1) return [`${F(a,b)} = ${F(a*k,"…")}`, `${F(a,b)} = <b>${F(a*k,b*k)}</b> &nbsp; (× ${k})`];
  if(t===2) return [`${F(a*k,b*k)} = ${F("…",b)}`, `${F(a*k,b*k)} = <b>${F(a,b)}</b> &nbsp; (÷ ${k})`];
  if(t===3){ const n=ri(2,9), d=ri(2,9); return [`${n} = ${F("…",d)}`, `${n} = <b>${F(n*d,d)}</b> &nbsp; (${n} × ${d} = ${n*d})`]; }
  return [`${F(a*k,b*k)} = ${F(a,"…")}`, `${F(a*k,b*k)} = <b>${F(a,b)}</b> &nbsp; (÷ ${k})`]; });
/* fractions différentes de p/q (valeur), proches */
const notEq = (p,q,n,avoid) => distinct(n, ()=>{ const m=ri(1,6); let x,y; do{ x=p*m+ri(-2,2); y=q*m+ri(-2,2); }while(x<1||y<2||x===y||x*q===y*p||avoid.includes(x+"/"+y)); return [x,y]; }, v=>v.join("/"));
const [p8,q8] = irr(9,2,9); const k8 = shuf([2,3,4,5,6,7,8,9,10]).slice(0,3).sort((a,b)=>a-b);
const ok8 = k8.map(k=>[p8*k,q8*k]), bad8 = notEq(p8,q8,2,ok8.map(v=>v.join("/")));
const list8 = shuf([...ok8.map(v=>[...v,1]), ...bad8.map(v=>[...v,0])]);
const [p8b,q8b] = irr(9,2,9), m8 = ri(2,6); const k8b = shuf([2,3,4,5,6,7,8,9].filter(k=>k!==m8)).slice(0,2).sort((a,b)=>a-b);
const ok8b = [[p8b,q8b], ...k8b.map(k=>[p8b*k,q8b*k])], bad8b = notEq(p8b,q8b,2,[...ok8b.map(v=>v.join("/")), `${p8b*m8}/${q8b*m8}`]);
const list8b = shuf([...ok8b.map(v=>[...v,1]), ...bad8b.map(v=>[...v,0])]);
const e9 = distinct(8, ()=>{ const [p,q]=irr(9,2,9), k=ri(2,12); return [p,q,k]; }, x=>x[0]*x[2]+"/"+x[1]*x[2]);
const e10 = shuf([...distinct(3, ()=>irr(11,3,12,true), x=>x.join()).map(v=>[...v,1]), ...distinct(3, ()=>{ const [p,q]=irr(7,2,8,true), k=pick([2,3,5,7,11]); return [p*k,q*k,k]; }, x=>x.join())]);
const [p11,q11] = irr(9,2,9,true), k11 = shuf([2,3,4,5,6,7,8,9,10]).slice(0,5); const ki = k11.pop();
const in11 = [p11*ki+1, q11*ki], list11 = shuf([[p11,q11,1], ...k11.map(k=>[p11*k,q11*k,k]), [...in11,0]]);
const secB = {t:"Fractions égales et simplification", e:[
  {n:"Exercice 7", t:"Compléter des égalités de fractions", w:"Sur ton cahier", h:`<p>Complète.</p><p>${items(e7.map(x=>x[0]),"  ·  ",true)}</p>`, c:`<p>${items(e7.map(x=>x[1]),"</p><p>",true)}</p>`},
  {n:"Exercice 8", t:"Reconnaître des fractions égales", w:"Sur ton cahier", h:`<p>Recopie les fractions égales à la fraction donnée. Justifie.</p><p>a) Fractions égales à ${F(p8,q8)} : &nbsp; ${list8.map(([x,y])=>F(x,y)).join(" &nbsp;&nbsp; ")}</p><p>b) Fractions égales à ${F(p8b*m8,q8b*m8)} : &nbsp; ${list8b.map(([x,y])=>F(x,y)).join(" &nbsp;&nbsp; ")}</p>`,
   c:`<p>a) ${F(p8,q8)} = ${ok8.map(([x,y])=>`<b>${F(x,y)}</b>`).join(" = ")} (on multiplie par ${k8[0]}, par ${k8[1]} et par ${k8[2]}).</p><p>${bad8.map(([x,y])=>F(x,y)).join(" et ")} ne sont pas égales à ${F(p8,q8)}.</p>
   <p>b) ${F(p8b*m8,q8b*m8)} = ${F(p8b,q8b)} (on divise par ${m8}).</p><p>Sont égales : <b>${F(p8b,q8b)}</b>, ${k8b.map(k=>`<b>${F(p8b*k,q8b*k)}</b> (÷ ${k} donne ${F(p8b,q8b)})`).join(" et ")}.</p><p>${bad8b.map(([x,y])=>F(x,y)).join(" et ")} ne le sont pas.</p>`},
  {n:"Exercice 9", t:"Simplifier des fractions", w:"Sur ton cahier", h:`<p>Simplifie chaque fraction au maximum. Détaille tes étapes.</p>${cols(e9.map(([p,q,k],i)=>`${L4[i]}) ${F(p*k,q*k)}`))}`,
   c:`<p>${e9.map(([p,q,k],i)=>`${L4[i]}) ${F(p*k,q*k)} = ${F(`${p*k} ÷ ${k}`,`${q*k} ÷ ${k}`)} = <b>${F(p,q)}</b>`).join("</p><p>")}</p>`},
  {n:"Exercice 10", t:"Fractions irréductibles", w:"Sur ton cahier", h:`<p>Parmi ces fractions, lesquelles sont irréductibles ?</p><p>${e10.map(([a,b])=>F(a,b)).join(" &nbsp;&nbsp;&nbsp; ")}</p>`,
   c:`<p>${e10.map(([a,b,k])=> k===1 ? `${F(a,b)} : <b>irréductible</b>` : `${F(a,b)} : non, ${F(a,b)} = ${F(a/k,b/k)} (÷ ${k})`).join("</p><p>")}</p>`},
  {n:"Exercice 11", t:"Trouver l'intrus", w:"Sur ton cahier", h:`<p>Parmi ces fractions, une seule n'est pas égale aux autres : laquelle ? Justifie.</p><p>${list11.map(([a,b])=>F(a,b)).join(" &nbsp;&nbsp;&nbsp; ")}</p>`,
   c:`<p>${list11.filter(x=>x[2]>1).map(([a,b])=>F(a,b)).join(", ")} se simplifient toutes en ${F(p11,q11)} (on divise par ${list11.filter(x=>x[2]>1).map(x=>x[2]).join(", ")}).</p><p>Mais ${F(p11,q11)} = ${F(p11*ki,q11*ki)}, et non ${F(in11[0],in11[1])} : <b>${F(in11[0],in11[1])} est l'intrus</b>.</p>`}
 ]};

/* ================= C. Comparer des fractions ================= */
const e12 = distinct(4, ()=>{ const d=ri(3,15); let a,b; do{ a=ri(1,2*d); b=ri(1,2*d); }while(a===b||a===d||b===d); return [a,b,d]; }, x=>x.join());
const e13 = distinct(6, ()=>{ let d1,m; do{ d1=ri(2,9); m=ri(2,5); }while(d1*m>45); const d2=d1*m; let a,c; do{ a=ri(1,2*d1-1); c=ri(1,Math.min(2*d2-1,30)); }while(a*m===c||gcd(a,d1)!==1||gcd(c,d2)!==1||a===d1); return [a,d1,c,d2,m,Math.random()<0.5]; }, x=>x.slice(0,4).join());
const e14 = distinct(3, ()=>{ const [d1,d2]=shuf(pick(PAIRS)), L=lcm(d1,d2); let a,c; do{ a=ri(1,d1-1); c=ri(1,d2-1); }while(gcd(a,d1)!==1||gcd(c,d2)!==1||a*L/d1===c*L/d2); return [a,d1,c,d2,L]; }, x=>[x[1],x[3]].sort((u,v)=>u-v).join("/")); /* jamais deux fois les mêmes dénominateurs */
const rang = (n) => { const D=pick([12,16,18,20,24]), ds=[2,3,4,5,6,8,9,10,12].filter(x=>D%x===0 && x<D); let L; do{ L=[...Array(n)].map(()=>{ const q=pick([...ds,D]); let p; do{ p=ri(1,q-1); }while(gcd(p,q)!==1); return [p,q]; }); }while(new Set(L.map(([p,q])=>p*D/q)).size<n); return {D,L}; };
const r1 = rang(4), r2 = rang(5);
const up1 = [...r1.L, [1,1]].sort((u,v)=>u[0]/u[1]-v[0]/v[1]), dn2 = [...r2.L].sort((u,v)=>v[0]/v[1]-u[0]/u[1]);
const NOMS = pick([["Léo","Mia"],["Nina","Tom"],["Sacha","Inès"],["Hugo","Léa"]]), OBJ = pick([["son château","son vaisseau"],["sa tour","son pont"],["son garage","sa maison"]]);
const p16 = (()=>{ const [d1,d2]=shuf(pick(PAIRS)), L=lcm(d1,d2); let a,c; do{ a=ri(1,d1-1); c=ri(1,d2-1); }while(gcd(a,d1)!==1||gcd(c,d2)!==1||a*L/d1===c*L/d2); return {a,d1,c,d2,L}; })();
const secC = {t:"Comparer des fractions", e:[
  {n:"Exercice 12", t:"Même dénominateur", w:"Sur ton cahier", h:`<p>Complète avec &lt;, &gt; ou =.</p><p>${items(e12.map(([a,b,d])=>`${F(a,d)} …… ${F(b,d)}`),"  ·  ",true)}</p>`, c:`<p>${items(e12.map(([a,b,d])=>`${F(a,d)} <b>${cmp(a,d,b,d)}</b> ${F(b,d)}`),"</p><p>",true)}</p>`},
  {n:"Exercice 13", t:"Comparer avec un multiple", w:"Sur ton cahier", h:`<p>Compare chaque couple de fractions en justifiant.</p><p>${items(e13.map(([a,d1,c,d2,m,sw])=> sw ? `${F(c,d2)} et ${F(a,d1)}` : `${F(a,d1)} et ${F(c,d2)}`),"  ·  ",true)}</p>`,
   c:`<p>${items(e13.map(([a,d1,c,d2,m,sw])=>{ const [x,y,X,Y]= sw ? [c,a*m,F(c,d2),F(a,d1)] : [a*m,c,F(a,d1),F(c,d2)]; const s=cmp(x,1,y,1); return `${F(a,d1)} = ${F(a*m,d2)} ; comme ${x} ${s} ${y}, <b>${X} ${s} ${Y}</b>.`; }),"</p><p>",true)}</p>`},
  {n:"Exercice 14", t:"Des dénominateurs sans lien", w:"Sur ton cahier", h:`<p>Ici, aucun dénominateur n'est un multiple de l'autre. Compare chaque couple de fractions en justifiant.</p><p>${items(e14.map(([a,d1,c,d2,L])=>`${F(a,d1)} et ${F(c,d2)} (essaie avec ${L})`),"  ·  ",true)}</p>`,
   c:`<p>${items(e14.map(([a,d1,c,d2,L])=>{ const x=a*L/d1, y=c*L/d2, s=cmp(x,1,y,1); return `${F(a,d1)} = ${F(x,L)} et ${F(c,d2)} = ${F(y,L)} ; comme ${x} ${s} ${y}, <b>${F(a,d1)} ${s} ${F(c,d2)}</b>.`; }),"</p><p>",true)}</p>`},
  {n:"Exercice 15", t:"Ranger des fractions", w:"Sur ton cahier", h:`<p>1) Range dans l'ordre croissant : ${[...r1.L.map(([p,q])=>F(p,q)), "1"].join(" ; ")}.</p><p>2) Range dans l'ordre décroissant : ${r2.L.map(([p,q])=>F(p,q)).join(" ; ")}.</p>`,
   c:`<p>1) Avec le dénominateur ${r1.D} : ${[...r1.L, [1,1]].map(([p,q])=>F(p*r1.D/q,r1.D)).join(" ; ")}.</p><p>Ordre croissant : <b>${up1.map(([p,q])=>fr(p,q)).join(" &lt; ")}</b></p><p>2) Avec le dénominateur ${r2.D} : ${r2.L.map(([p,q])=>F(p*r2.D/q,r2.D)).join(" ; ")}.</p><p>Ordre décroissant : <b>${dn2.map(([p,q])=>fr(p,q)).join(" &gt; ")}</b></p>`},
  {n:"Exercice 16", t:"Qui a le plus avancé ?", w:"Sur ton cahier", h:`<p>${NOMS[0]} a construit ${p16.a===1?"le":"les"} ${F(p16.a,p16.d1)} de ${OBJ[0]} en briques.</p><p>${NOMS[1]} a construit ${p16.c===1?"le":"les"} ${F(p16.c,p16.d2)} de ${OBJ[1]}.</p><p>Les deux constructions demandent le même nombre de briques. Qui a le plus avancé ? Justifie.</p>`,
   c:`<p>${p16.L} est un multiple de ${p16.d1} et de ${p16.d2}.</p><p class="calc">${F(p16.a,p16.d1)} = ${F(p16.a*p16.L/p16.d1,p16.L)} &nbsp; et &nbsp; ${F(p16.c,p16.d2)} = ${F(p16.c*p16.L/p16.d2,p16.L)}</p><p>Comme ${p16.a*p16.L/p16.d1} ${cmp(p16.a*p16.L/p16.d1,1,p16.c*p16.L/p16.d2,1)} ${p16.c*p16.L/p16.d2}, c'est <b>${p16.a*p16.d2>p16.c*p16.d1?NOMS[0]:NOMS[1]}</b> qui a le plus avancé.</p>`}
 ]};

/* ================= D. Additionner et soustraire ================= */
const e17 = distinct(9, ()=>{ for(;;){ const q=ri(2,9), k=Math.random()<0.25?1:ri(2,6); let p; do{ p=ri(1,2*q); }while(gcd(p,q)!==1); const d=q*k, N=p*k, op=pick(["+","−"]);
  const [a,b] = op==="+" ? (()=>{ const a=ri(1,N-1); return [a,N-a]; })() : (()=>{ const b=ri(1,d-1); return [N+b,b]; })();
  if(a>=1 && b>=1 && a!==d && b!==d) return [a,b,d,op]; } }, x=>x.join());
const e18 = [];
for(let i=0;i<7;i++){ let a,b,c,d,op; do{ op=pick(["+","−"]); if(i<4){ b=ri(2,8); d=b*ri(2,5); } else { [b,d]=shuf(pick(PAIRS)); } if(Math.random()<0.5) [b,d]=[d,b]; a=ri(1,2*b-1); c=ri(1,d-1); }while((op==="−"&&a*d<=c*b)||gcd(a,b)!==1||gcd(c,d)!==1||a===b); e18.push([a,b,op,c,d]); }
{ const b=ri(2,9); let a; do{ a=ri(1,2*b-1); }while(gcd(a,b)!==1||a===b); e18.push([a,b,"+",ri(1,4),1]); }
{ const b=ri(2,9); let a; do{ a=ri(1,b-1); }while(gcd(a,b)!==1); e18.push([ri(1,5),1,"−",a,b]); }
const j19 = (()=>{ const [b,d]=shuf(pick(PAIRS)); let a,c; do{ a=ri(1,b-1); c=ri(1,d-1); }while(gcd(a,b)!==1||gcd(c,d)!==1); return [a,b,c,d]; })();
const h19 = (()=>{ let a,b,c,d; do{ d=ri(2,6); b=d*ri(2,3); a=ri(2,b-1); c=ri(1,d-1); }while(gcd(a,b)!==1||gcd(c,d)!==1||a<=c||a*d<=c*b||(a-c)*b===(b-d)*a||(a-c)*d*b===(a*d-c*b)*(b-d)); return [a,b,c,d]; })();
const hugoBig = (h19[0]-h19[2])*h19[1] > h19[0]*(h19[1]-h19[3]);
const FAM = [[2,3,6],[2,4,8],[3,6,12],[2,5,10],[4,8,16],[3,4,12],[2,3,12]];
const term = q => { let p; do{ p=ri(1,q-1); }while(gcd(p,q)!==1); return [p,q]; };
function chain(t, ops){ const L=t.reduce((m,[,q])=>lcm(m,q),1); const n=t.map(([p,q])=>p*L/q); let N=n[0]; ops.forEach((o,i)=>{ N = o==="+" ? N+n[i+1] : N-n[i+1]; });
  const w=([p,q])=> q===1 ? String(p) : F(p,q), j=arr=>arr.map((x,i)=>(i?` ${ops[i-1]} `:"")+x).join("");
  return {h:j(t.map(w)), c:`${j(t.map(w))} = ${j(n.map(x=>F(x,L)))} = ${F(N,L)}${simpl(N,L)}`, N, L}; }
const mkChain = (ops, int) => { let r; do{ const f=pick(FAM); const t=shuf(f).map(term); if(int) t[0]=[ri(1,3),1]; r=chain(t,ops); const n=t.map(([p,q])=>p*r.L/q); if(n[0]-n[1]<=0 && ops[0]==="−") r=null; else if(r.N<=0) r=null; }while(!r); return r; };
const e20 = (()=>{ const A=mkChain(["+","+"]), B=mkChain(["−","+"]); let C; do{ C=mkChain(["−","+"]); }while(C.h===B.h); return [A,B,C,mkChain(["−","−"],true)]; })();
const add = (x,y) => val2(x[0],x[1],"+",y[0],y[1]), sub = (x,y) => val2(x[0],x[1],"−",y[0],y[1]);
const mkWall = () => { const f=pick([[2,3,4,6,12],[2,4,8],[2,3,6],[2,5,10],[3,4,6,12]]); const b=[0,1,2].map(()=>term(pick(f))); const m0=add(b[0],b[1]), m1=add(b[1],b[2]); return [...b, m0, m1, add(m0,m1)]; };
const w1 = mkWall(), w2 = mkWall();
const st = (x,o,y) => steps2(x[0],x[1],o,y[0],y[1]);
const secD = {t:"Additionner et soustraire des fractions", e:[
  {n:"Exercice 17", t:"Même dénominateur", w:"Sur ton cahier", h:`<p>Calcule, puis simplifie le résultat si c'est possible.</p>${cols(e17.map(([a,b,d,o],i)=>`${L4[i]} = ${F(a,d)} ${o} ${F(b,d)}`))}`,
   c:`<p>Même dénominateur : on additionne (ou on soustrait) les numérateurs et on garde le dénominateur. Puis on simplifie.</p><div class="calcs">${e17.map(([a,b,d,o],i)=>`<div>${NL(L4[i],steps2(a,d,o,b,d))}</div>`).join("")}</div>`},
  {n:"Exercice 18", t:"Dénominateurs différents", w:"Sur ton cahier", h:`<p>Calcule, puis simplifie le résultat si c'est possible.</p>${cols(e18.map(([a,b,o,c,d],i)=>`${L4[i]} = ${fr(a,b)} ${o} ${fr(c,d)}`))}`,
   c:`<p>On écrit les deux fractions avec le même dénominateur (un multiple commun), puis on calcule et on simplifie.</p><div class="calcs">${e18.map(([a,b,o,c,d],i)=>`<div>${NL(L4[i],steps2(a,b,o,c,d))}</div>`).join("")}</div>`},
  {n:"Exercice 19", t:"Trouver l'erreur", w:"Sur ton cahier", h:`<p>Deux élèves se sont trompés. Explique chaque erreur, puis donne le bon résultat.</p><p>1) Juliette a écrit : ${F(j19[0],j19[1])} + ${F(j19[2],j19[3])} = ${F(j19[0]+j19[2],j19[1]+j19[3])}.</p><p>2) Hugo a écrit : ${F(h19[0],h19[1])} − ${F(h19[2],h19[3])} = ${F(h19[0]-h19[2],h19[1]-h19[3])}.</p>`,
   c:`<p>1) Juliette a additionné les numérateurs <b>et</b> les dénominateurs. Il faut d'abord mettre les fractions sur le même dénominateur :</p>${NL("A",steps2(j19[0],j19[1],"+",j19[2],j19[3]))}<p>2) Hugo a soustrait les numérateurs et les dénominateurs. Le bon calcul est :</p>${NL("B",steps2(h19[0],h19[1],"−",h19[2],h19[3]))}${hugoBig?`<p>Le résultat de Hugo est d'ailleurs supérieur à ${F(h19[0],h19[1])} : impossible pour une soustraction.</p>`:""}`},
  {n:"Exercice 20", t:"Enchaîner les calculs", w:"Sur ton cahier", h:`<p>Calcule en détaillant (de gauche à droite, avec un dénominateur commun).</p>${cols(e20.map((r,i)=>`${L4[i]} = ${r.h}`))}`,
   c:`<div class="calcs">${e20.map((r,i)=>`<div>${NL(L4[i],r.c)}</div>`).join("")}</div>`},
  {n:"Exercice 21", t:"Murs de briques", w:"Sur ton cahier", h:`<p>Dans un mur de briques, chaque brique est égale à la <b>somme</b> des deux briques placées juste en dessous.</p><p>Complète.</p><div class="figs">${wall(w1,[1,1,1,0,0,0])}${wall(w2,[1,0,1,1,0,1])}</div>`,
   c:`<div class="figs">${wall(w1,[1,1,1,0,0,0],true)}${wall(w2,[1,0,1,1,0,1],true)}</div><p>Mur de gauche :</p><p class="calc">${st(w1[0],"+",w1[1])}</p><p class="calc">${st(w1[1],"+",w1[2])}</p><p class="calc">${st(w1[3],"+",w1[4])}</p>
   <p>Mur de droite :</p><p class="calc">${st(w2[3],"−",w2[0])}</p><p class="calc">${st(w2[1],"+",w2[2])}</p><p>On vérifie :</p><p class="calc">${st(w2[3],"+",w2[4])}</p>`}
 ]};

/* ================= E. Problèmes ================= */
const [a22,b22,c22] = pick([[4,3,6],[2,4,8],[3,4,6],[2,5,10],[4,6,12],[2,3,12],[5,4,10],[3,6,12],[4,8,6]]);
const L22 = lcm(lcm(a22,b22),c22), N22 = L22*ri(Math.max(1,Math.ceil(24/L22)), Math.floor(240/L22));
const S22 = L22/a22+L22/b22+L22/c22, [sp,sq] = simp(S22,L22), [vp,vq] = simp(L22-S22,L22);
const two = (lim) => { let d1,d2,a1,a2,L; do{ [d1,d2]=shuf(pick([[8,4],[5,3],[4,3],[6,4],[5,2],[3,6],[10,5],[4,6],[8,2],[3,4]])); a1=ri(1,d1-1); a2=ri(1,d2-1); L=lcm(d1,d2); }while(gcd(a1,d1)!==1||gcd(a2,d2)!==1||a1*L/d1+a2*L/d2>=L); const [p,q]=val2(a1,d1,"+",a2,d2), [r,s]=val2(1,1,"−",p,q); const N=L*ri(Math.ceil(20/L), Math.floor(lim/L)); return {a1,d1,a2,d2,p,q,r,s,N}; };
const t23 = two(150), t24 = two(120);
const EG = distinct(4, ()=>{ let d1,d2,p,q; do{ [d1,d2]=shuf([2,3,4,5,6,8,10,12]).slice(0,2).sort((x,y)=>x-y); [p,q]=val2(1,d1,"+",1,d2); }while(p<2||q%d1||q%d2); return [p,q,d1,d2]; }, x=>x[0]+"/"+x[1]);
const secE = {t:"Problèmes", e:[
  {n:"Exercice 22", t:"La boîte de briques", w:"Sur ton cahier", h:`<p>Une boîte contient ${N22} briques Lego.</p><p>${F(1,a22)} des briques sont rouges, ${F(1,b22)} sont bleues, ${F(1,c22)} sont jaunes et les autres sont vertes.</p><p>1) Quelle fraction de la boîte représentent les briques rouges ou bleues ?</p><p>2) Quelle fraction de la boîte représentent les briques vertes ?</p><p>3) Combien y a-t-il de briques de chaque couleur ?</p>`,
   c:`<p>1) <span class="calc">${steps2(1,a22,"+",1,b22)}</span></p><p>2) Rouges, bleues et jaunes : ${F(L22/a22,L22)} + ${F(L22/b22,L22)} + ${F(L22/c22,L22)} = ${F(S22,L22)}${simpl(S22,L22)}.</p><p>Vertes : 1 − ${fr(sp,sq)} = <b>${F(vp,vq)}</b>.</p><p>3) Rouges : ${N22} ÷ ${a22} = <b>${N22/a22}</b> ; bleues : ${N22} ÷ ${b22} = <b>${N22/b22}</b> ; jaunes : ${N22} ÷ ${c22} = <b>${N22/c22}</b> ; vertes : ${N22} ÷ ${vq} × ${vp} = <b>${N22/vq*vp}</b>.</p><p>Vérification : ${N22/a22} + ${N22/b22} + ${N22/c22} + ${N22/vq*vp} = ${N22}.</p>`},
  {n:"Exercice 23", t:"Une tour en briques", w:"Sur ton cahier", h:`<p>Max avait ${t23.N} briques pour construire une tour.</p><p>Le samedi, il en utilise ${t23.a1===1?"":"les "}${F(t23.a1,t23.d1)}. Le dimanche, il en utilise ${t23.a2===1?"":"les "}${F(t23.a2,t23.d2)}.</p><p>1) Quelle fraction de ses briques a-t-il utilisée en tout ?</p><p>2) Combien de briques lui reste-t-il à la fin du dimanche ?</p>`,
   c:`<p>1) <span class="calc">${steps2(t23.a1,t23.d1,"+",t23.a2,t23.d2)}</span></p><p>2) Il reste 1 − ${fr(t23.p,t23.q)} = ${F(t23.r,t23.s)} des briques : ${t23.N} ÷ ${t23.s} × ${t23.r} = <b>${t23.N/t23.s*t23.r} briques</b>.</p>`},
  {n:"Exercice 24", t:"Le budget de Zoé", w:"Sur ton cahier", h:`<p>Zoé a un budget de ${t24.N} € pour ses cadeaux Lego.</p><p>Elle dépense ${t24.a1===1?"le":"les"} ${F(t24.a1,t24.d1)} du budget pour un vaisseau et ${t24.a2===1?"le":"les"} ${F(t24.a2,t24.d2)} du budget pour une voiture.</p><p>1) Quelle fraction du budget a-t-elle dépensée ?</p><p>2) Quelle somme lui reste-t-il ?</p>`,
   c:`<p>1) <span class="calc">${steps2(t24.a1,t24.d1,"+",t24.a2,t24.d2)}</span></p><p>2) Il reste 1 − ${fr(t24.p,t24.q)} = ${F(t24.q,t24.q)} − ${fr(t24.p,t24.q)} = ${F(t24.r,t24.s)} du budget : ${t24.N} ÷ ${t24.s} × ${t24.r} = <b>${t24.N/t24.s*t24.r} €</b>.</p>`},
  {n:"Exercice 25", t:"Pour aller plus loin : fractions égyptiennes", w:"Sur ton cahier", h:`<p>Écris chaque fraction comme la somme de <b>deux fractions de numérateur 1 différentes</b>.</p><p>Aide : les dénominateurs sont des diviseurs du dénominateur de départ.</p><p>${items(EG.map(([p,q])=>F(p,q)),"  ·  ",true)}</p>`,
   c:`<p>${items(EG.map(([p,q,d1,d2])=>`${F(p,q)} = <b>${F(1,d1)} + ${F(1,d2)}</b> &nbsp; car ${F(q/d1,q)} + ${F(q/d2,q)} = ${F(p,q)}`),"</p><p>",true)}</p>`}
 ]};

return [secA, secB, secC, secD, secE];
};
