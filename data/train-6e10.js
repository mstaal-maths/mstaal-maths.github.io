/* 6e · chapitre 10 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres */
TRAIN["6e-10"] = function(){
const {ri, pick, shuf, sp, distinct, items} = TR;
const {pot, D} = window.FIG10;
const eg = (a,b) => `${sp(a)} = ${b} × ${sp(Math.floor(a/b))} + ${a%b}`;
const sdig = n => String(n).split("").reduce((x,c)=>x+ +c,0);
const ok = b => b?`<b style="color:#1d7a46">✔</b>`:"";
const L = "abcdefgh";
const M = c => c%100===0 ? sp(c/100) : sp(Math.floor(c/100))+","+String(c%100).padStart(2,"0");
const P10 = ["10","100","1 000"];

/* ---------- A. La division euclidienne ---------- */
const b1=ri(11,19), q1=ri(11,30), r1=ri(1,b1-1), a1=b1*q1+r1;
const e2 = distinct(6, ()=>{ const b=pick([3,4,6,7,8,9,12,15,24,25,32]); return [ri(b*10, b<10?999:9999), b]; }, x=>x.join());
const e3 = shuf([ (()=>{ const b=ri(6,9), k=ri(11,19); return [b*k, b, "m"]; })(), (()=>{ const b=ri(6,9); let n; do{ n=ri(60,150); }while(n%b===0); return [n,b,"d"]; })(),
                 (()=>{ const b=ri(11,15), k=ri(12,25); return [b*k,b,"v"]; })(), (()=>{ const b=ri(13,19); let n; do{ n=ri(200,400); }while(n%b===0); return [n,b,"d"]; })() ]);
const q3 = ([n,b,t]) => t==="m"?`${n} est-il un multiple de ${b} ?`:t==="d"?`${b} est-il un diviseur de ${n} ?`:`${n} est-il divisible par ${b} ?`;
const e4 = distinct(6, ()=>pick([ri(2,99)*10, ri(10,199)*5+ (ri(0,1)?0:0), 9*ri(12,600), 3*ri(30,900), ri(100,9999)]), x=>x);
const k4 = pick([3,9]), u4=ri(1,9), h4=ri(1,9);
const sol4 = [0,1,2,3,4,5,6,7,8,9].filter(d=>(h4+d+u4)%k4===0);
const dm = distinct(3, ()=>ri(2,20)*60+ri(1,59), x=>x), ds = ri(2,4)*3600+ri(1,59)*60+ri(1,59);
const fl = ri(95,170), dh = ri(19,21)*60+5*ri(1,11), fin = dh+fl;
const hm = m => `${Math.floor(m/60)} h ${String(m%60).padStart(2,"0")}`;
const JOURS = ["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"], j0=ri(0,6), nj=ri(40,200);
const pb = { r:ri(5,9), n:0 }; pb.n = ri(300,900); while(pb.n%pb.r===0) pb.n++;
const car = pick([48,50,52,55,60]); let pe; do{ pe=ri(150,400); }while(pe%car===0);
const bx = pick([6,8,12,15]); let ma; do{ ma=ri(200,600); }while(ma%bx===0);
const dv=ri(7,12), dq=ri(15,40), dr=ri(1,dv-1), q7=ri(10,20), d7=pick([4,5,6]);
const secA = {t:"La division euclidienne", e:[
  {n:"Exercice 1", t:"Le vocabulaire", w:"Sur ton cahier", h:`<p>L'égalité <span class="calc">${eg(a1,b1)}</span> traduit la division euclidienne de ${a1} par ${b1}.</p><p>1) Donne le dividende, le diviseur, le quotient et le reste.</p><p>2) L'égalité ${a1} = ${b1} × ${q1-1} + ${r1+b1} est-elle vraie ? Traduit-elle la division euclidienne de ${a1} par ${b1} ?</p>`,
   c:`<p>1) dividende : <b>${a1}</b> · diviseur : <b>${b1}</b> · quotient : <b>${q1}</b> · reste : <b>${r1}</b></p><p>2) Je calcule :</p><p class="calc">A = ${b1} × ${q1-1} + ${r1+b1}<br>A = ${b1*(q1-1)} + ${r1+b1}<br>A = ${a1}</p><p>L'égalité est <b>vraie</b>, mais ce n'est <b>pas</b> la division euclidienne, car le reste ${r1+b1} est plus grand que le diviseur ${b1}.</p>`},
  {n:"Exercice 2", t:"Poser des divisions euclidiennes", w:"Sur ton cahier", h:`<p>Pose la division euclidienne, écris l'égalité et vérifie-la.</p><p>${items(e2.map(([a,b])=>`de ${sp(a)} par ${b}`),"  ·  ",true)}</p>`,
   c:`<div class="cgrid">${e2.map(([a,b],k)=>`<figure><figcaption>${L[k]}) <span class="calc">${eg(a,b)}</span></figcaption>${pot(String(a),b,{mode:"euc"})}</figure>`).join("")}</div>`},
  {n:"Exercice 3", t:"Multiples et diviseurs", w:"Sur ton cahier", h:`<p>Réponds par oui ou par non, en justifiant avec une division euclidienne.</p><p>${items(e3.map(q3),"<br>",true)}</p>`,
   c:items(e3.map(([n,b])=>`${eg(n,b)} : ${n%b===0?"le reste est nul, <b>oui</b>":"le reste n'est pas nul, <b>non</b>"}.`),"<br>",true)},
  {n:"Exercice 4", t:"Les critères de divisibilité", w:"Sur ton cahier", h:`<p>Sans poser de division, indique par quels nombres (2, 3, 5, 9, 10) chaque nombre est divisible : ${items(e4.map(sp),"  ·  ",true)}</p><p><b>Défi :</b> par quels chiffres peut-on remplacer le carré dans ${h4} □ ${u4} pour obtenir un nombre divisible par ${k4} ?</p>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Nombre</th><th>par 2</th><th>par 3</th><th>par 5</th><th>par 9</th><th>par 10</th><th>somme des chiffres</th></tr></thead><tbody>${e4.map(n=>{ const s=sdig(n), u=n%10; return `<tr><th>${sp(n)}</th>${[u%2===0,s%3===0,u%5===0,s%9===0,u===0].map(b=>`<td style="text-align:center">${ok(b)}</td>`).join("")}<td>${s}</td></tr>`; }).join("")}</tbody></table></div>
   <p><b>Défi :</b> ${h4} + □ + ${u4} = ${h4+u4} + □ doit être divisible par ${k4} : □ = <b>${sol4.length>1?sol4.slice(0,-1).join(", ")+" ou "+sol4[sol4.length-1]:sol4[0]}</b>.</p>`},
  {n:"Exercice 5", t:"Convertir des durées", w:"Sur ton cahier", h:`<p>Convertis : ${items([...dm.map(m=>`${sp(m)} min en h et min`), `${sp(ds)} s en h, min et s`],"  ·  ",true)}</p><p>Un film dure ${fl} min. Il commence à ${hm(dh)}. À quelle heure se termine-t-il ?</p>`,
   c:`${items([...dm.map(m=>`${eg(m,60)} : <b>${Math.floor(m/60)} h ${m%60} min</b>`), `${eg(ds,60)}, puis ${eg(Math.floor(ds/60),60)} : <b>${Math.floor(ds/3600)} h ${Math.floor(ds/60)%60} min ${ds%60} s</b>`],"<br>",true)}<p>${eg(fl,60)} : le film dure ${Math.floor(fl/60)} h ${fl%60} min. Il se termine à <b>${fin>=1440?hm(fin-1440):hm(fin)}</b>${fin>=1440?" (le lendemain)":""}.</p>`},
  {n:"Exercice 6", t:"Des problèmes", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> un fleuriste a ${pb.n} roses. Il fait des bouquets de ${pb.r} roses. Combien de bouquets complets ? Combien de roses restent ?</p><p><b>Problème 2 :</b> ${pe} personnes prennent le car. Un car a ${car} places. Combien de cars faut-il réserver ?</p><p><b>Problème 3 :</b> on range ${ma} macarons dans des boîtes de ${bx}. Combien de boîtes pleines ? Combien de macarons restent ?</p><p><b>Problème 4 :</b> aujourd'hui, c'est ${JOURS[j0]}. Quel jour de la semaine serons-nous dans ${nj} jours ?</p>`,
   c:`<p><b>Problème 1 :</b> ${eg(pb.n,pb.r)}. <b>${Math.floor(pb.n/pb.r)} bouquets</b>, et il reste <b>${pb.n%pb.r} rose${pb.n%pb.r>1?"s":""}</b>.</p><p><b>Problème 2 :</b> ${eg(pe,car)}. Il reste ${pe%car} personne${pe%car>1?"s":""} sans place : il faut un car de plus, soit <b>${Math.floor(pe/car)+1} cars</b>.</p><p><b>Problème 3 :</b> ${eg(ma,bx)}. <b>${Math.floor(ma/bx)} boîtes pleines</b> et <b>${ma%bx} macaron${ma%bx>1?"s":""}</b> restant${ma%bx>1?"s":""}.</p><p><b>Problème 4 :</b> ${eg(nj,7)}. Après ${Math.floor(nj/7)} semaines, on est de nouveau ${JOURS[j0]} ; ${nj%7?`il reste ${nj%7} jour${nj%7>1?"s":""}`:"il ne reste aucun jour"} : ce sera un <b>${JOURS[(j0+nj)%7]}</b>.</p>`},
  {n:"Exercice 7", t:"Défi", w:"Sur ton cahier", h:`<p>1) Le diviseur est ${dv}, le quotient ${dq} et le reste ${dr}. Quel est le dividende ?</p><p>2) Trouve tous les nombres entiers dont le quotient dans la division euclidienne par ${d7} est ${q7}.</p>`,
   c:`<p>1) ${dv} × ${dq} + ${dr} = <b>${dv*dq+dr}</b>.</p><p>2) ${d7} × ${q7} + reste, avec un reste de 0 à ${d7-1} : <b>${Array.from({length:d7},(_,i)=>d7*q7+i).join(", ")}</b>.</p>`}
 ]};

/* ---------- B. Diviser par 10, 100, 1 000 ---------- */
const e8 = distinct(8, ()=>{ const k=pick([0,0,1,1,2]), n=ri(1,k?999:9999), p=ri(1,3); return [n,k,p]; }, x=>x.join());
const e9 = distinct(6, ()=>{ const k=pick([0,1]), n=ri(2,999), p=ri(1,3); return [n,k,p,pick(["a","b"])]; }, x=>x.slice(0,3).join());
const env=pick([100,1000]), menv=ri(100,999), fac=ri(1001,9999);
const secB = {t:"Diviser par 10, 100, 1 000", e:[
  {n:"Exercice 8", t:"Calcul mental", w:"Sur ton cahier", h:`<p>${items(e8.map(([n,k,p])=>`${D(n,k)} ÷ ${P10[p-1]}`),"  ·  ",true)}</p>`,
   c:items(e8.map(([n,k,p])=>`${D(n,k)} ÷ ${P10[p-1]} = <b>${D(n,k+p)}</b> (${p} rang${p>1?"s":""} vers la gauche)`),"  ·  ",true)},
  {n:"Exercice 9", t:"Les nombres manquants", w:"Sur ton cahier", h:`<p>${items(e9.map(([n,k,p,t])=>t==="a"?`${D(n,k)} ÷ …… = ${D(n,k+p)}`:`…… ÷ ${P10[p-1]} = ${D(n,k+p)}`),"  ·  ",true)}</p>`,
   c:items(e9.map(([n,k,p,t])=>t==="a"?`${D(n,k)} ÷ <b>${P10[p-1]}</b> = ${D(n,k+p)} (la virgule s'est déplacée de ${p} rang${p>1?"s":""} vers la gauche)`:`<b>${D(n,k)}</b> ÷ ${P10[p-1]} = ${D(n,k+p)} (opération inverse : ${D(n,k+p)} × ${P10[p-1]} = ${D(n,k)})`),"  ·  ",true)},
  {n:"Exercice 10", t:"Petits problèmes", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> un paquet de ${sp(env)} enveloppes identiques pèse ${menv} g. Quelle est la masse d'une enveloppe ?</p><p><b>Problème 2 :</b> dix amis se partagent une facture de ${M(fac*10)} €. Combien paie chacun ?</p>`,
   c:`<p><b>Problème 1 :</b> ${menv} ÷ ${sp(env)} = ${D(menv,env===100?2:3)}. Une enveloppe pèse <b>${D(menv,env===100?2:3)} g</b>.</p><p><b>Problème 2 :</b> ${M(fac*10)} ÷ 10 = ${D(fac,2)}. Chacun paie <b>${M(fac)} €</b>.</p>`}
 ]};

/* ---------- C. La division décimale ---------- */
/* division exacte : dividende a (kd décimales) par b, quotient avec au plus kd+3 décimales */
const exact = () => { for(;;){ const b=pick([4,5,6,8,12,15,16,25]), kd=pick([0,1,1]), a=ri(kd?30:10, kd?2999:400); if(a%b!==0 && (a*100)%b===0 && a%10!==0) return [a,kd,b]; } };
const e12 = distinct(6, exact, x=>x.join());
const qd = ([a,kd,b]) => D(a*1000/b, kd+3);
const rec = pick([4,5]), ing = [["Œufs",rec*ri(1,2),0,""],["Farine",ri(40,80)*rec,0," g"],["Beurre",ri(30,90),0," g"],["Lait",ri(3,9)*rec,1," L"]];
const e11 = distinct(6, ()=>{ let b, kd, a; do{ b=ri(3,15); kd=pick([0,1]); a=ri(kd?10:2, kd?999:150); }while(a%(b*10**kd)===0); return [a,kd,b]; }, x=>x.join());
const p13 = [ (()=>{ const h=pick([3,4,5]), v=ri(500,1100); return {t:`En ${h} h, une voiture parcourt ${D(v*h,1)} km, toujours à la même vitesse. Combien de kilomètres parcourt-elle en 1 h ?`, c:`${D(v*h,1)} ÷ ${h} = ${D(v,1)}. Elle parcourt <b>${D(v,1)} km</b> en 1 h.`}; })(),
  (()=>{ const n=pick([4,5,8]), u=n===8?5*ri(3,30):ri(11,90); return {t:`${n} sucettes coûtent ${M(n*u)} € au total. Quel est le prix d'une sucette ?`, c:`${M(n*u)} ÷ ${n} = ${M(u)}. Une sucette coûte <b>${M(u)} €</b>.`}; })(),
  (()=>{ const n=pick([4,6,8]), u=ri(41,199)*(n===8?25:n===6?5:25); return {t:`Un ruban de ${D(n*u,2)} cm est coupé en ${n} bandes de même longueur. Combien mesure chaque bande ?`, c:`${D(n*u,2)} ÷ ${n} = ${D(u,2)}. Chaque bande mesure <b>${D(u,2)} cm</b>.`}; })(),
  (()=>{ const r=ri(5,9), pc=25*ri(4,14), pr=ri(51,99)*10, tot=r*pr+20*pc; return {t:`On achète ${r} raquettes à ${M(pr)} € l'unité et 20 cerceaux identiques. On paie ${M(tot)} € en tout. Quel est le prix d'un cerceau ? (Calculatrice autorisée.)`, c:`Raquettes : ${r} × ${M(pr)} = ${M(r*pr)} €. Cerceaux : ${M(tot)} − ${M(r*pr)} = ${M(20*pc)} €. ${M(20*pc)} ÷ 20 = ${M(pc)} : un cerceau coûte <b>${M(pc)} €</b>.`}; })() ];
const ch = shuf([
  (()=>{ const n=pick([4,6,8]), s=n*ri(25,90)+pick([0,n/2]); return {t:`${n} amis se partagent équitablement ${s} €. Combien reçoit chacun ?`, d:"décimale", c:`${s} ÷ ${n} = ${D(s*100/n,2)} : chacun reçoit <b>${M(s*100/n)} €</b>.`}; })(),
  (()=>{ const b=pick([6,8,10,12]); let n; do{ n=ri(100,600); }while(n%b===0); return {t:`${n} balles sont rangées dans des boîtes de ${b}. Combien faut-il de boîtes ?`, d:"euclidienne", c:`${eg(n,b)} : il faut une boîte de plus pour ${n%b>1?`les ${n%b} balles restantes`:"la balle restante"}, soit <b>${Math.floor(n/b)+1} boîtes</b>.`}; })(),
  (()=>{ const b=pick([4,8]), L0=b*ri(20,60)+pick([1,2,3]); return {t:`Un ruban de ${L0} cm est coupé en ${b} morceaux de même longueur. Combien mesure un morceau ?`, d:"décimale", c:`${L0} ÷ ${b} = ${D(L0*1000/b,3)} : un morceau mesure <b>${D(L0*1000/b,3)} cm</b>.`}; })(),
  (()=>{ const b=pick([25,30]); let n; do{ n=ri(60,200); }while(n%b===0); return {t:`${n} élèves font des équipes de ${b}. Combien d'équipes complètes peut-on former ?`, d:"euclidienne", c:`${eg(n,b)} : <b>${Math.floor(n/b)} équipes complètes</b> (et ${n%b} élève${n%b>1?"s":""} en plus).`}; })() ]);
const secC = {t:"La division décimale", e:[
  {n:"Activité 1", t:"La recette", w:"Sur ton cahier", h:`<p>Une recette est prévue pour ${rec} personnes. Calcule les quantités pour 1 personne.</p><div class="scroll"><table class="std"><thead><tr><th>Ingrédient</th>${ing.map(x=>`<th>${x[0]}</th>`).join("")}</tr></thead><tbody><tr><th>Pour ${rec} personnes</th>${ing.map(([,v,k,u])=>`<td>${D(v,k)}${u}</td>`).join("")}</tr><tr><th>Pour 1 personne</th>${ing.map(()=>"<td></td>").join("")}</tr></tbody></table></div>`,
   c:`<p>Je divise chaque quantité par ${rec} :</p><p class="calc">${ing.map(([n,v,k,u])=>`${D(v,k)} ÷ ${rec} = <b>${D(v*1000/rec,k+3)}${u}</b>`).join(" · ")}</p>`},
  {n:"Exercice 11", t:"Encadrer un quotient", w:"Sur ton cahier", h:`<p>Encadre par deux entiers consécutifs : ${items(e11.map(([a,kd,b])=>`… &lt; ${D(a,kd)} ÷ ${b} &lt; …`),"  ·  ",true)}</p>`,
   c:items(e11.map(([a,kd,b])=>{ const lo=Math.floor(a/(b*10**kd)); return `${b} × ${lo} = ${b*lo} et ${b} × ${lo+1} = ${b*(lo+1)} : <b>${lo} &lt; ${D(a,kd)} ÷ ${b} &lt; ${lo+1}</b>`+((a%(b*10**kd)===0)?"":""); }),"<br>",true)},
  {n:"Exercice 12", t:"Poser des divisions décimales", w:"Sur ton cahier", h:`<p>Pose ces divisions jusqu'à un reste nul : ${items(e12.map(([a,kd,b])=>`${D(a,kd)} ÷ ${b}`),"  ·  ",true)}</p>`,
   c:`<div class="cgrid">${e12.map((x,k)=>`<figure><figcaption>${L[k]}) <span class="calc">${D(x[0],x[1])} ÷ ${x[2]} = <b>${qd(x)}</b></span></figcaption>${pot(D(x[0],x[1]),x[2])}</figure>`).join("")}</div>`},
  {n:"Exercice 13", t:"Des problèmes", w:"Sur ton cahier", h:p13.map((p,i)=>`<p><b>Problème ${i+1} :</b> ${p.t}</p>`).join(""), c:p13.map((p,i)=>`<p><b>Problème ${i+1} :</b> ${p.c}</p>`).join("")},
  {n:"Activité 2", t:"Quelle division choisir ?", w:"Sur ton cahier", h:`<p>Pour chaque situation, choisis la division (euclidienne ou décimale), puis réponds.</p>${ch.map((x,i)=>`<p>${L[i]}) ${x.t}</p>`).join("")}`,
   c:ch.map((x,i)=>`<p>${L[i]}) Division <b>${x.d}</b>. ${x.c}</p>`).join("")}
 ]};

/* ---------- D. Valeur arrondie ---------- */
const nonExact = () => { for(;;){ const b=pick([3,6,7,9,11,12]), a=ri(10,400); if((a*10000)%b!==0) return [a,b]; } };
const e14 = distinct(5, ()=>{ const k=ri(4,6); return [ri(1,99)*10**k+ri(1,10**k-1), k]; }, x=>x.join());
const fix = (n,k,j) => { const f=10**(k-j), v=Math.round(n/f); const s=String(v).padStart(j+1,"0"); return j? sp(+s.slice(0,-j))+","+s.slice(-j) : sp(v); };
const e15 = distinct(4, ()=>[...nonExact(), pick([1,2])], x=>x.join());
const v15 = ([a,b,j]) => { const v=Math.round(a*10**j/b); const s=String(v).padStart(j+1,"0"); return sp(+s.slice(0,-j))+","+s.slice(-j); };
const secD = {t:"Valeur arrondie d'un quotient", e:[
  {n:"Exercice 14", t:"Arrondir un nombre", w:"Sur ton cahier", h:`<p>Arrondis chaque résultat de calculatrice à l'unité, au dixième et au centième : ${items(e14.map(([n,k])=>D(n,k)),"  ·  ",true)}</p>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Nombre</th><th>à l'unité</th><th>au dixième</th><th>au centième</th></tr></thead><tbody>${e14.map(([n,k])=>`<tr><th>${D(n,k)}</th><td>${fix(n,k,0)}</td><td>${fix(n,k,1)}</td><td>${fix(n,k,2)}</td></tr>`).join("")}</tbody></table></div>`},
  {n:"Exercice 15", t:"Poser et arrondir", w:"Sur ton cahier", h:`<p>Pose chaque division, puis donne l'arrondi demandé : ${items(e15.map(([a,b,j])=>`${a} ÷ ${b} ${j===1?"au dixième":"au centième"}`),"  ·  ",true)}</p>`,
   c:`<div class="cgrid">${e15.map(([a,b,j],k)=>`<figure><figcaption>${L[k]}) ${a} ÷ ${b} ≈ <b>${v15([a,b,j])}</b></figcaption>${pot(String(a),b,{dec:j+1})}</figure>`).join("")}</div><p><i>On calcule un chiffre de plus que l'arrondi demandé, pour savoir s'il faut ajouter 1.</i></p>`}
 ]};

return [secA, secB, secC, secD];
};
