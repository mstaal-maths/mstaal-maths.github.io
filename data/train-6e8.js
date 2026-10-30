/* 6e · chapitre 8 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres.
   Chaque nombre décimal est un entier n avec k chiffres après la virgule : calculs exacts. */
TRAIN["6e-8"] = function(){
const {ri, pick, shuf, sp, distinct, items} = TR;
const D = (n,k) => { if(!k) return sp(n); const neg=n<0; n=Math.abs(n); const s=String(n).padStart(k+1,"0"); let e=s.slice(0,-k), d=s.slice(-k).replace(/0+$/,""); return (neg?"−":"")+sp(+e)+(d?","+d:""); };
const Dm = n => { const neg=n<0; n=Math.abs(n); return (neg?"−":"")+sp(Math.floor(n/100))+","+String(n%100).padStart(2,"0"); };   /* somme d'argent en centimes */
const E = (n,k) => n*Math.pow(10,3-k);                 /* en millièmes */
const M = v => D(v,3);                                  /* millièmes → écriture */
const P = k => Math.pow(10,k);
const {pose} = window.FIG8;
const Dk = (n,k,K) => { const t=String(n*P(K-k)).padStart(K+1,"0"); return K? t.slice(0,-K)+","+t.slice(-K) : t; };   /* écriture avec exactement K chiffres après la virgule (pour poser) */
const poseAS = (a,b,op) => { const K=Math.max(a[1],b[1]), r=op==="+"?E(...a)+E(...b):E(...a)-E(...b); return pose([Dk(...a,K),Dk(...b,K)], op, Dk(r/P(3-K),K,K)); };
const NOMS = "ABCDEFGHI";
const rg = r => `${r} rang${r>1?"s":""}`;
const nk = () => { const k=ri(1,3); return [ri(1,99)*P(k)+ri(1,P(k)-1), k]; };

/* ---------- A. Additionner et soustraire ---------- */
const v1 = [[ri(51,199),1],[ri(51,199),1]], v1b=[ri(11,30),[ri(11,99),1]];
const e2 = distinct(4, ()=>[nk(), nk()], x=>JSON.stringify(x));
const e3 = distinct(4, ()=>{ const a=nk(), b=nk(); return E(...a)>E(...b)?[a,b]:[b,a]; }, x=>JSON.stringify(x));
const art = [["Vélo",ri(250,450)*100+pick([90,99,50])],["Casque",ri(30,70)*100+pick([95,90,50])],["Gants",ri(12,25)*100+pick([50,90,99])],["Chaussures",ri(50,90)*100+pick([99,90,50])]];
const totArt = art.reduce((s,x)=>s+x[1],0), ogArt = art.reduce((s,x)=>s+Math.round(x[1]/100),0), budget = Math.round(totArt/1000)*10+pick([-10,10,20]);
const e4 = distinct(4, ()=>{ const a=ri(101,999), b=ri(101,999)+(Math.random()<0?0:0); if(Math.abs(a-b)<50) return [500,250,"+",750]; const op=pick(["+","−"]); const [x,y]=op==="−"&&b>a?[b,a]:[a,b]; const r=op==="+"?x+y:x-y; return [x,y,op,r]; }, x=>x.join());
const pb = (()=>{ const p1=ri(4000,9000), r1=ri(1000,2500), a2=ri(100,250)*100, p2=ri(4000,9000), x3=ri(2000,4000), y3=ri(1500,3000), w3=x3+y3+ri(300,1200), h4=ri(1500,3500), m4=ri(800,2500), t5=ri(1500,4000), g5=ri(40,90)*100, d5=ri(20,50)*100;
  return [
   [`Un manteau coûte ${Dm(p1)} €. Le commerçant fait une remise de ${Dm(r1)} €. Combien vais-je le payer ?`, `${Dm(p1)} − ${Dm(r1)} = ${Dm(p1-r1)}. Je vais payer <b>${Dm(p1-r1)} €</b>.`],
   [`M. Durand a ${Dm(a2)} € en poche. Il achète des chaussures à ${Dm(p2)} €. Combien lui reste-t-il ?`, `${Dm(a2)} − ${Dm(p2)} = ${Dm(a2-p2)}. Il lui reste <b>${Dm(a2-p2)} €</b>.`],
   [`J'achète un pull à ${Dm(x3)} € et un haut à ${Dm(y3)} €. Je paie avec ${Dm(w3)} €. Combien me reste-t-il ?`, `${Dm(x3)} + ${Dm(y3)} = ${Dm(x3+y3)}, puis ${Dm(w3)} − ${Dm(x3+y3)} = ${Dm(w3-x3-y3)}. Il me reste <b>${Dm(w3-x3-y3)} €</b>.`],
   [`Simon a ${Dm(h4)} €, mais il lui manque ${Dm(m4)} € pour s'acheter un jeu. Quel est son prix ?`, `${Dm(h4)} + ${Dm(m4)} = ${Dm(h4+m4)}. Le jeu coûte <b>${Dm(h4+m4)} €</b>.`],
   [`Xavier a ${Dm(t5)} € dans sa tirelire. Son grand-père lui donne ${Dm(g5)} €. Il a maintenant ${Dm(d5)} € de plus que sa sœur. Quelle somme possède sa sœur ?`, `${Dm(t5)} + ${Dm(g5)} = ${Dm(t5+g5)}, puis ${Dm(t5+g5)} − ${Dm(d5)} = ${Dm(t5+g5-d5)}. Sa sœur possède <b>${Dm(t5+g5-d5)} €</b>.`]]; })();
const e6 = distinct(4, ()=>{ const x=ri(1,9), a=ri(1,19), b=ri(1,19), n=ri(2,30), m=ri(2,30); return [[10*a+x,1],[n,0],[10*b+10-x,1],[m,0]]; }, x=>JSON.stringify(x));
const e7 = distinct(6, ()=>{ const a=ri(31,60), b=ri(2,15), c=ri(2,15), op=pick(["−","+"]); return [a,b,c,op]; }, x=>x.join());
const v7 = ([a,b,c,op]) => op==="−" ? a-b-c : a-b+c;
const fac = [["Plaquettes",ri(200,400)*100+ri(0,99),ri(40,90)*100+ri(0,99),2],["Main d'œuvre",ri(40,90)*100+ri(0,99),ri(8,18)*100+ri(0,99),1],["Pneus",ri(150,300)*100+ri(0,99),ri(30,60)*100+ri(0,99),0]];
const secA = {t:"Additionner et soustraire", e:[
  {n:"Exercice 1", t:"Le vocabulaire", w:"Sur ton cahier", h:`<p>Écris le calcul, puis donne le résultat : a) la somme de ${D(...v1[0])} et de ${D(...v1[1])} · b) la différence de ${v1b[0]} et de ${D(...v1b[1])}</p>`,
   c:`a) ${D(...v1[0])} + ${D(...v1[1])} = ${D(v1[0][0]+v1[1][0],1)} · b) ${v1b[0]} − ${D(...v1b[1])} = ${D(10*v1b[0]-v1b[1][0],1)}`},
  {n:"Exercice 2", t:"Poser des additions", w:"Sur ton cahier", h:`<p>Pose et effectue : ${items(e2.map(([a,b])=>`${D(...a)} + ${D(...b)}`),"  ·  ",true)}</p>`, c:`<div class="figs" style="align-items:flex-start">${e2.map(([a,b])=>poseAS(a,b,"+")).join("")}</div>`+items(e2.map(([a,b])=>`${D(...a)} + ${D(...b)} = <b>${M(E(...a)+E(...b))}</b>`),"  ·  ",true)},
  {n:"Exercice 3", t:"Poser des soustractions", w:"Sur ton cahier", h:`<p>Pose et effectue : ${items(e3.map(([a,b])=>`${D(...a)} − ${D(...b)}`),"  ·  ",true)}</p>`, c:`<div class="figs" style="align-items:flex-start">${e3.map(([a,b])=>poseAS(a,b,"−")).join("")}</div>`+items(e3.map(([a,b])=>`${D(...a)} − ${D(...b)} = <b>${M(E(...a)-E(...b))}</b>`),"  ·  ",true)},
  {n:"Activité 1", t:"Prévoir une dépense", w:"Sur ton cahier", h:`<div class="scroll"><table class="std"><thead><tr>${art.map(a=>`<th>${a[0]}</th>`).join("")}</tr></thead><tbody><tr>${art.map(a=>`<td>${Dm(a[1])} €</td>`).join("")}</tr></tbody></table></div><p>1) Sans calculatrice, donne un ordre de grandeur de la dépense totale. 2) Avec ${budget} €, peut-on tout acheter ? Calcule la dépense exacte pour vérifier.</p>`,
   c:`<p>1) ${art.map(a=>Math.round(a[1]/100)).join(" + ")} = <b>${ogArt} €</b> environ.</p><p>2) Dépense exacte : ${art.map(a=>Dm(a[1])).join(" + ")} = <b>${Dm(totArt)} €</b>. ${totArt<=budget*100?`${Dm(totArt)} ≤ ${budget} : <b>oui</b>, il restera ${Dm(budget*100-totArt)} €.`:`${Dm(totArt)} &gt; ${budget} : <b>non</b>, il manque ${Dm(totArt-budget*100)} €.`}</p>`},
  {n:"Exercice 4", t:"Le bon résultat", w:"Sur ton cahier", h:`<p>Sans poser l'opération, choisis le bon résultat grâce à un ordre de grandeur.</p>${e4.map(([x,y,op,r],i)=>`<p>${"abcd"[i]}) ${D(x,1)} ${op} ${D(y,1)} : ${shuf([D(r,1),D(r,2),D(r*10,1)]).join(" · ")}</p>`).join("")}`,
   c:items(e4.map(([x,y,op,r])=>`${Math.round(x/10)} ${op} ${Math.round(y/10)} = ${op==="+"?Math.round(x/10)+Math.round(y/10):Math.round(x/10)-Math.round(y/10)} : <b>${D(r,1)}</b>`),"  ·  ",true)},
  {n:"Exercice 5", t:"Des problèmes", w:"Sur ton cahier", h:`<p>Pour chaque problème : le calcul en ligne, puis une phrase.</p>${pb.map((p,i)=>`<p>${i+1}) ${p[0]}</p>`).join("")}`, c:pb.map((p,i)=>`<p>${i+1}) ${p[1]}</p>`).join("")},
  {n:"Exercice 6", t:"Calculer astucieusement une somme", w:"Sur ton cahier", h:`<p>Regroupe les termes qui vont bien ensemble : ${items(e6.map((t,i)=>`${NOMS[i]} = `+t.map(x=>D(...x)).join(" + ")),"  ·  ",true)}</p>`,
   c:`<div class="calcs">`+e6.map(([a,n,b,m],i)=>{ const X=NOMS[i]; return `<div><p class="calc">${X} = ${D(...a)} + ${n[0]} + ${D(...b)} + ${m[0]}<br>${X} = (${D(...a)} + ${D(...b)}) + (${n[0]} + ${m[0]})<br>${X} = ${(a[0]+b[0])/10} + ${n[0]+m[0]}<br>${X} = <b>${(a[0]+b[0])/10+n[0]+m[0]}</b></p></div>`; }).join("")+`</div>`},
  {n:"Exercice 7", t:"Suites d'additions et de soustractions", w:"Sur ton cahier", h:`<p>Calcule en détaillant les étapes : ${items(e7.map(([a,b,c,op],i)=>`${NOMS[i]} = ${a} − ${b} ${op} ${c}`),"  ·  ",true)}</p>`,
   c:`<p>De gauche à droite :</p><div class="calcs">`+e7.map((x,i)=>{ const [a,b,c,op]=x, X=NOMS[i]; return `<div><p class="calc">${X} = ${a} − ${b} ${op} ${c}<br>${X} = ${a-b} ${op} ${c}<br>${X} = <b>${v7(x)}</b></p></div>`; }).join("")+`</div>`},
  {n:"Pour aller plus loin", t:"La facture du garage", w:"Sur ton cahier", h:`<p>HT + TVA = TTC. Complète la facture.</p><div class="scroll"><table class="std"><thead><tr><th></th><th>Prix HT</th><th>TVA</th><th>Prix TTC</th></tr></thead><tbody>${fac.map(([n,h,t,u])=>`<tr><th>${n}</th><td>${u===0?"……":Dm(h)}</td><td>${u===1?"……":Dm(t)}</td><td>${u===2?"……":Dm(h+t)}</td></tr>`).join("")}<tr><th>TOTAL À PAYER</th><td></td><td></td><td>……</td></tr></tbody></table></div>`,
   c:`${fac.map(([n,h,t,u])=>`<p>${n} : ${u===2?`TTC = ${Dm(h)} + ${Dm(t)} = <b>${Dm(h+t)}</b>`:u===1?`TVA = ${Dm(h+t)} − ${Dm(h)} = <b>${Dm(t)}</b>`:`HT = ${Dm(h+t)} − ${Dm(t)} = <b>${Dm(h)}</b>`}</p>`).join("")}<p>Total à payer : ${fac.map(([,h,t])=>Dm(h+t)).join(" + ")} = <b>${Dm(fac.reduce((s,[,h,t])=>s+h+t,0))} €</b></p>`}
]};

/* ---------- B. Multiplier ---------- */
const e8 = distinct(9, ()=>{ const [n,k]=pick([[ri(11,99),1],[ri(11,99),2],[ri(1,9),3],[ri(2,30),0],[ri(1001,9999),3]]); return [n,k,pick([10,100,1000])]; }, x=>x.join());
const e9 = distinct(9, ()=>{ const [n,k]=pick([[ri(11,99),0],[ri(11,99),1],[ri(2,9),0],[ri(101,999),0],[ri(1,9),1]]); return [n,k,pick([1,2,3])]; }, x=>x.join());
const e10 = distinct(6, ()=>{ const t=ri(0,3), n=ri(11,99); const m=pick([10,100,1000]);
  const r=String(m).length-1;
  if(t===0) return [`…… × ${sp(m)} = ${sp(n)}`, D(n*1000/m,3), `× ${sp(m)} : ${rg(r)} vers la droite`];
  if(t===1) return [`${D(n,1)} × …… = ${sp(n*m/10)}`, sp(m), `${rg(r)} vers la droite : × ${sp(m)}`];
  if(t===2){ const z=pick([1,2]); return [`${n} × …… = ${D(n,z)}`, z===1?"0,1":"0,01", `${rg(z)} vers la gauche : × ${z===1?"0,1":"0,01"}`]; }
  return [`…… × 0,01 = ${D(n,2)}`, String(n), `× 0,01 : 2 rangs vers la gauche`]; }, x=>x[0]);
const e11 = distinct(5, ()=>{ const a=(x=>x%10?x:x+1)(ri(11,98)), ka=pick([1,2]), b=pick([ri(2,9),(x=>x%10?x:x+1)(ri(11,48))]), kb=b<10?0:1; return [[a,ka],[b,kb]]; }, x=>JSON.stringify(x));
const og = x => { const v=x[0]/P(x[1]); return v<1? String(Math.round(v*10)/10).replace(".",",") : String(Math.round(v)); };
const e12 = shuf([[25,4],[0.5,2],[2.5,4],[20,5],[50,2]]).slice(0,4).map(([a,b])=>[a,b,ri(11,99)]);
const c13a=ri(5,9), p13a=ri(90,180), p13b=ri(15,35)*10, q13b=pick([15,25,35]), p13c=ri(165,199), l13=ri(10,15), l13b=(x=>x>=l13?x+1:x)(ri(12,19)), b13=pick([30,35,40]);
const fmt = x => String(x).replace(".",",");
const secB = {t:"Multiplier", e:[
  {n:"Exercice 8", t:"Multiplier par 10, 100, 1 000", w:"Sur ton cahier", h:`<p>${items(e8.map(([n,k,m])=>`${D(n,k)} × ${sp(m)}`),"  ·  ",true)}</p>`, c:items(e8.map(([n,k,m])=>`${D(n,k)} × ${sp(m)} = <b>${D(n*m,k)}</b> (${rg(String(m).length-1)} vers la droite)`),"  ·  ",true)},
  {n:"Exercice 9", t:"Multiplier par 0,1 ; 0,01 ; 0,001", w:"Sur ton cahier", h:`<p>${items(e9.map(([n,k,z])=>`${D(n,k)} × ${D(1,z)}`),"  ·  ",true)}</p>`, c:items(e9.map(([n,k,z])=>`${D(n,k)} × ${D(1,z)} = <b>${D(n,k+z)}</b> (${rg(z)} vers la gauche)`),"  ·  ",true)},
  {n:"Exercice 10", t:"Le nombre manquant", w:"Sur ton cahier", h:`<p>${items(e10.map(x=>x[0]),"  ·  ",true)}</p>`, c:items(e10.map(([q,r,w])=>q.replace("……",`<b>${r}</b>`)+` (${w})`),"  ·  ",true)},
  {n:"Exercice 11", t:"Poser des multiplications", w:"Sur ton cahier", h:`<p>Donne d'abord un ordre de grandeur, puis pose l'opération : ${items(e11.map(([a,b])=>`${D(...a)} × ${D(...b)}`),"  ·  ",true)}</p>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Produit</th><th>Ordre de grandeur</th><th>Sans les virgules</th><th>Résultat exact</th></tr></thead><tbody>${e11.map(([a,b])=>`<tr><td>${D(...a)} × ${D(...b)}</td><td>≈ ${og(a)} × ${og(b)} = ${fmt(Math.round(parseFloat(og(a).replace(",","."))*parseFloat(og(b).replace(",","."))*100)/100)}</td><td>${a[0]} × ${b[0]} = ${sp(a[0]*b[0])} ; ${a[1]+b[1]} chiffre${a[1]+b[1]>1?"s":""} après la virgule</td><td><b>${D(a[0]*b[0],a[1]+b[1])}</b></td></tr>`).join("")}</tbody></table></div>`},
  {n:"Exercice 12", t:"Calculer astucieusement un produit", w:"Sur ton cahier", h:`<p>${items(e12.map(([a,b,c],i)=>`${NOMS[i]} = ${fmt(a)} × ${D(c,1)} × ${b}`),"  ·  ",true)}</p>`,
   c:`<div class="calcs">`+e12.map(([a,b,c],i)=>{ const X=NOMS[i]; return `<div><p class="calc">${X} = ${fmt(a)} × ${D(c,1)} × ${b}<br>${X} = (${fmt(a)} × ${b}) × ${D(c,1)}<br>${X} = ${a*b} × ${D(c,1)}<br>${X} = <b>${D(c*a*b,1)}</b></p></div>`; }).join("")+`</div>`},
  {n:"Exercice 13", t:"Des achats", w:"Sur ton cahier", h:`<p>1) J'achète ${c13a} croissants à ${Dm(p13a)} € l'un. Combien vais-je payer ?</p><p>2) Les pommes coûtent ${Dm(p13b)} € le kilo. Combien coûtent ${D(q13b,1)} kg de pommes ?</p><p>3) Un litre d'essence coûte ${Dm(p13c)} €. Combien coûtent ${l13} litres ? Avec ${b13} €, puis-je en acheter ${l13b} litres ?</p>`,
   c:`<p>1) ${c13a} × ${Dm(p13a)} = <b>${Dm(c13a*p13a)} €</b></p><p>2) ${D(q13b,1)} × ${Dm(p13b)} = <b>${Dm(q13b*p13b/10)} €</b></p><p>3) ${l13} × ${Dm(p13c)} = <b>${Dm(l13*p13c)} €</b>. ${l13b} × ${Dm(p13c)} = ${Dm(l13b*p13c)} € : ${l13b*p13c<=b13*100?`<b>oui</b>, c'est moins que ${b13} €`:`<b>non</b>, c'est plus que ${b13} €`}.</p>`}
]};
return [secA, secB];
};
