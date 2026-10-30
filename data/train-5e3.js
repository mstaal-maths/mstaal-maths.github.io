/* 5e · chapitre 3 — fiche d'entraînement : les exercices de la fiche de classe, avec d'autres nombres.
   Tous les résultats et toutes les étapes sont calculés par C5 (calcul exact). */
TRAIN["5e-3"] = function(){
const {ri, pick, shuf} = TR;
const C = window.C5;
const V = e => C.txt(C.val(e)), L = (e,n) => C.html(e,n), IN = e => C.inline(e);
const ok = e => { try{ const s=C.steps(e); return s.v.n>=0 && C.decimal(s.v); }catch(err){ return false; } };
const okInt = e => ok(e) && C.val(e).d===1;
/* tire une expression jusqu'à ce qu'elle soit valable (pas de négatif, divisions exactes) */
const gen = (f, test=okInt) => { for(let g=0; g<2000; g++){ const e=f(); if(test(e)) return e; } throw new Error("expression introuvable"); };
const dec = (a,b,k=1) => C.txt(C.R(ri(a,b), Math.pow(10,k)));   /* décimal aléatoire, ex. dec(11,49) → 1,1…4,9 */
/* montant en euros : toujours deux chiffres après la virgule s'il y a des centimes */
const eur = t => /,\d$/.test(t) ? t+"0" : t;
/* calculs nommés côte à côte : [["A","5 × 6 − 2"], …] */
const duo = list => `<div class="calcs">${list.map(([n,e])=>`<div>${L(e,n)}</div>`).join("")}</div>`;
const grid = list => `<div class="calcs">${list.map(([n,e])=>`<span>${n} = ${e}</span>`).join("")}</div>`;
const prog = (titre, steps) => `<div class="pgc"><b>${titre}</b><ul>${steps.map(s=>`<li>${s}</li>`).join("")}</ul></div>`;
const VERB={"+":"Ajouter","−":"Soustraire","×":"Multiplier par","÷":"Diviser par"};
const progBox = (steps, titre="Programme de calcul") => prog(titre, ["Choisir un nombre", ...steps.map(([op,k])=>`${VERB[op]} ${k}`)]);
function progExpr(x, steps){ let e=String(x), top=null;
  steps.forEach(([op,k])=>{ if((op==="×"||op==="÷") && top==="add") e = e.includes("(") ? `[${e}]` : `(${e})`; e=`${e} ${op} ${k}`; top=(op==="+"||op==="−")?"add":"mul"; });
  return e; }

/* calcul astucieux d'une somme de trois termes : on regroupe les deux qui font un nombre rond */
function astuceSomme(name, t){
  const pairs=[[0,1,2],[0,2,1],[1,2,0]];
  for(const [i,j,k] of pairs){ const s=C.add(C.parse(t[i])[0].v, C.parse(t[j])[0].v); if(s.d===1 && s.n%10===0 || s.d===1 && t.some(x=>x.includes(","))){
    const lines=[`${t.join(" + ")}`]; if(!(i===0&&j===1)) lines.push(`${t[i]} + ${t[j]} + ${t[k]}`); lines.push(`${C.txt(s)} + ${t[k]}`); lines.push(V(t.join(" + ")));
    return `<p class="calc">${lines.map(l=>`${name} = ${l}`).join("<br>")}</p>`; } }
  return L(t.join(" + "), name);
}

/* ===== A. Enchaînements ===== */
/* Exercice 0 : additions et soustractions */
const e0=[];
e0.push(["A", [ri(21,49),ri(11,39),ri(2,9)].join(" + "), null]);
e0.push(["B", gen(()=>`${ri(20,40)} − ${ri(11,19)} + ${ri(2,9)}`), null]);
e0.push(["C", gen(()=>`${ri(12,20)} − ${ri(3,8)} − ${ri(2,5)}`), null]);
{ const a=ri(12,28), c=10*ri(3,6)-a, b=ri(31,58); e0.push(["D", null, [String(a),String(b),String(c)]]); }
e0.push(["E", gen(()=>`${ri(20,40)} − ${ri(2,9)} + ${ri(10,19)}`), null]);
{ const a=ri(21,39), c=10*ri(5,7)-a, b=ri(21,39); e0.push(["F", null, [String(a),String(b),String(c)]]); }
e0.push(["G", gen(()=>`${ri(20,30)} + ${ri(11,19)} − ${ri(2,9)}`), null]);
e0.push(["H", gen(()=>`${ri(30,45)} − ${ri(10,15)} − ${ri(2,9)}`), null]);
{ const a=ri(11,29), c=pick([50,60,70])-a; e0.push(["I", null, [C.txt(C.R(a,10)), C.txt(C.R(ri(31,59),10)), C.txt(C.R(c,10))]]); }
{ const b=ri(111,399), c=pick([500,600])-b; e0.push(["J", null, [C.txt(C.R(ri(201,399),100)), C.txt(C.R(b,100)), C.txt(C.R(c,100))]]); }
const E0h = grid(e0.map(([n,e,t])=>[n, e||t.join(" + ")]));
const E0c = `<div class="calcs">${e0.map(([n,e,t])=> `<div>${t ? astuceSomme(n,t) : L(e,n)}</div>`).join("")}</div>`;

/* Exercice 1 : mêmes formes que la fiche */
const sh = [
 ["A", ()=>`(${ri(2,9)} + ${ri(2,9)}) × ${ri(3,9)}`],
 ["B", ()=>`${ri(2,9)} + ${ri(2,9)} × ${ri(3,9)}`],
 ["D", ()=>`${ri(12,20)} − ${ri(3,8)} − ${ri(2,5)}`],
 ["F", ()=>{ const c=pick([2,4,5]), b=pick([2,4,5,8,10]); return `${b*c*ri(2,9)} ÷ ${b} ÷ ${c}`; }],
 ["G", ()=>`(${ri(15,30)} − ${ri(2,6)} × ${ri(2,4)}) + ${ri(2,9)}`],
 ["H", ()=>`${ri(30,50)} − ${ri(3,7)} × ${ri(2,5)} + ${ri(2,9)}`],
 ["I", ()=>{ const b=ri(2,9); return `${b*ri(2,9)} ÷ ${b} + ${ri(2,9)} × ${ri(2,9)}`; }],
 ["J", ()=>{ const b=ri(2,9); return `${b*ri(2,9)} ÷ ${b} × (${ri(6,12)} − ${ri(1,5)})`; }],
 ["K", ()=>{ const x=ri(2,5), y=ri(2,5), m=x*y*ri(2,4), p=ri(5,m-5); return `(${p} + ${m-p}) ÷ (${x} × ${y})`; }],
 ["M", ()=>`${ri(5,15)} + ${ri(10,20)} − ${ri(2,5)} × ${ri(2,5)}`],
 ["N", ()=>`[(${ri(5,9)} − ${ri(1,4)}) × ${ri(2,9)} + ${ri(1,9)}] × ${ri(2,4)}`],
 ["P", ()=>`[${ri(30,60)} − (${ri(2,6)} + ${ri(2,6)}) × ${ri(2,3)}] − ${ri(1,9)}`]
].map(([n,f])=>[n, gen(f)]);
const cS=(()=>{ const a=ri(11,29), c=pick([50,60])-a; return [C.txt(C.R(a,10)), C.txt(C.R(ri(31,59),10)), C.txt(C.R(c,10))]; })();
const eE=pick(["563,7","48,3","12,6","7,25","304,9"]), eP=pick([[25,4],[50,2],[20,5]]);
const lS=(()=>{ const b=ri(111,399), c=pick([500,600])-b; return [C.txt(C.R(ri(201,399),100)), C.txt(C.R(b,100)), C.txt(C.R(c,100))]; })();
const E1list = [sh[0], sh[1], ["C",cS.join(" + ")], sh[2], ["E",`${eE} × ${eP[0]} × ${eP[1]}`], sh[3], sh[4], sh[5], sh[6], sh[7], sh[8], ["L",lS.join(" + ")], sh[9], sh[10], sh[11]];
const E1c = `<div class="calcs">${E1list.map(([n,e])=> `<div>${n==="C" ? astuceSomme("C",cS) : n==="L" ? astuceSomme("L",lS) : n==="E" ? `<p class="calc">E = ${e}<br>E = ${eE} × ${eP[0]*eP[1]}<br>E = ${V(e)}</p>` : L(e,n)}</div>`).join("")}</div>`;

/* ===== B. Parenthèses ===== */
const P3 = [];
{ const a=ri(3,8), b=ri(5,9), c=ri(1,4); P3.push([`${a} × ${b} − ${c}`, `${a} × (${b} − ${c})`]); }
{ const a=ri(2,8), b=ri(3,8), c=ri(2,5); P3.push([`${a} + ${b} × ${c}`, `(${a} + ${b}) × ${c}`]); }
{ const a=ri(3,9), b=ri(2,5), c=ri(4,9); P3.push([`${a} + ${b} × ${c}`, `(${a} + ${b}) × ${c}`]); }
{ const b=ri(2,6), c=ri(3,8), a=b+c+ri(8,20); P3.push([`${a} − ${b} + ${c}`, `${a} − (${b} + ${c})`]); }
{ const c=pick([2,4,5]), b=c*pick([2,3,5]), a=b*ri(2,8)*pick([1,2]); P3.push([`${a} ÷ ${b} ÷ ${c}`, `${a} ÷ (${b} ÷ ${c})`]); }
/* chaque ligne : une égalité vraie (sans parenthèses) et une fausse (le résultat avec parenthèses), dans un ordre aléatoire */
const P3rows = P3.map(([sans, avec])=>{ const vrai=`${sans} = ${V(sans)}`, faux=`${sans} = ${V(avec)}`; return {sans, avec, ordre: Math.random()<0.5 ? [vrai,faux] : [faux,vrai]}; });
const p2=(()=>{ for(let g=0; g<500; g++){ const a=ri(2,4), b=ri(8,14), c=ri(2,5), d=ri(2,3);
  const ex=[`${a} × ${b} − ${c} × ${d}`, `${a} × (${b} − ${c}) × ${d}`, `(${a} × ${b} − ${c}) × ${d}`, `${a} × (${b} − ${c} × ${d})`];
  if(ex.every(ok) && new Set(ex.map(V)).size===4) return {base:`${a} × ${b} − ${c} × ${d}`, ex}; } })();
const p2ordre = shuf(p2.ex);

/* ===== C. Problèmes ===== */
const pr2=(()=>{ const n=ri(2,4), p=ri(5,9), m=ri(2,3), q=pick([10,12,15]), tot=n*p+m*q; const s=[30,40,50,60,80,100].find(x=>x>tot+2); return {s,n,p,m,q,e:`${s} − (${n} × ${p} + ${m} × ${q})`}; })();
const pr4=(()=>{ const r=pick(["0,80","1,20","0,90","1,50"]), n=ri(2,4), s=pick(["1,50","2,50","1,20","0,75"]); return {r,n,s,e:`${r} + ${n} × ${s}`}; })();
const pr5=(()=>{ const P=ri(25,40)*100, n=ri(3,6), c=pick([100,150,200,250]); return {P,n,c,e:`${C.txt(C.R(P,1))} − ${n} × ${c}`}; })();
const pr6=(()=>{ const s=pick([30,40,50]), a=ri(8,15), b=ri(4,9); return {s,a,b,e:`${s} − (${a} + ${b})`}; })();
const pr7=(()=>{ const n=ri(3,5), p=ri(2,3), b=ri(2,5), tot=n*p+b; const s=[20,30,50].find(x=>x>tot); return {n,p,b,s,e:`${s} − (${n} × ${p} + ${b})`}; })();

/* ===== D. Programmes ===== */
const act2 = [ (()=>{ const x=ri(2,9), m=ri(3,6); return {x, st:[["×",m],["−",ri(1,Math.min(9,x*m-1))]], who:"Hugo", il:"il"}; })(), {x:ri(2,9), st:[["+",ri(2,9)],["×",ri(3,6)]], who:"Léa", il:"elle"}, {x:ri(2,6), st:[["×",ri(2,5)],["+",ri(1,9)],["×",ri(2,4)]], who:"Maud", il:"elle"} ]
  .map(o=>({...o, e:progExpr(o.x,o.st)}));
const x8 = ri(4,9);
const p8 = [[["−",ri(1,3)],["×",ri(3,9)]], [["×",ri(2,6)],["+",ri(2,9)]], [["+",ri(2,9)],["×",ri(2,5)],["−",ri(1,9)]], [["×",ri(2,4)],["+",ri(1,9)],["×",ri(2,5)]]].map(st=>({st, e:progExpr(x8,st)}));
const p9 = (()=>{ const out=[];
  { const d=pick([3,4,5]), k=ri(1,9); let x; do{ x=ri(12,40); }while((x-k)%d||x-k<=0); out.push({x, st:[["−",k],["÷",d]]}); }
  { const x=ri(2,9), m=ri(3,6), a=ri(2,9); out.push({x, st:[["×",m],["+",a],["−",ri(1,Math.min(9,x*m+a-1))]]}); }
  { const d=pick([2,3]), x=ri(4,9), m=ri(3,6); let k; do{ k=ri(1,x*m-1); }while((x*m-k)%d); out.push({x, st:[["×",m],["−",k],["÷",d]]}); }
  { const x=ri(2,9); out.push({x, st:[["+",ri(2,9)],["×",ri(2,4)],["+",ri(2,9)]]}); }
  return out.map(o=>({...o, e:progExpr(o.x,o.st)})); })();

/* ===== E. Problèmes en plusieurs étapes ===== */
const p10=(()=>{ const prix=pick([12000,14000,15000,18000]), app=pick([3000,4000,5000]), m=pick([150,200,250,300]), n=pick([36,48,60]); const tot=app+m*n; if(tot<=prix) return null; return {prix,app,m,n,e:`${C.txt(C.R(app,1))} + ${m} × ${n} − ${C.txt(C.R(prix,1))}`}; });
let pb10; do{ pb10=p10(); }while(!pb10);
const pb11=(()=>{ const a=ri(150,400)*10, b=ri(150,450)*10, c=ri(80,200)*10, d=ri(120,250)*10; const f=x=>eur(C.txt(C.R(x,100))); return {a:f(a), b:f(b), c:f(c), d:f(d), e:`${f(a)} + ${f(b)} + ${f(c)} − ${f(d)}`}; })();
const pb12=(()=>{ for(let g=0; g<2000; g++){ const T=ri(30,50)*10, u=ri(2,6)*10, a=ri(3,8), ta=pick([7,9,11]), b=ri(8,15), tb=pick([3,6,7]), k=pick([5,4]); const e=`(${T} − ${u} − ${a} × ${ta} − ${b} × ${tb}) ÷ ${k}`; if(okInt(e) && C.val(e).n>=5) return {T,u,a,ta,b,tb,k,e}; } })();

const pbC = (o, money, unit, phrase) => `${C.html(o.e,"A",!!money)}<p>${phrase(V(o.e))}</p>`;
return [
 {t:"Enchaînements d'opérations", e:[
  {n:"Exercice 0", t:"Enchaînement d'additions et de soustractions", w:"Sur ton cahier", h:`<p>Recopie les calculs sur ton cahier et effectue-les en détaillant tes étapes de calculs.</p>${E0h}`,
   c:`<p>Quand il n'y a que des additions et des soustractions, on calcule de gauche à droite. Quand il n'y a que des additions, on peut regrouper astucieusement.</p>${E0c}`},
  {n:"Exercice 1", t:"Calculer un enchaînement d'opérations", w:"Sur ton cahier", h:`<p>Effectue les calculs suivants en détaillant toutes tes étapes de calculs.</p>${grid(E1list)}`, c:E1c}
 ]},
 {t:"Utilisation des parenthèses", e:[
  {n:"Exercice 3", t:"Utilisation des parenthèses dans un calcul", w:"Sur ton cahier", h:`<p><b>Partie 1 :</b> pour chaque question, une égalité est vraie et l'autre est fausse. Recopie l'égalité vraie, puis recopie l'égalité fausse en ajoutant des parenthèses pour qu'elle devienne vraie.</p>
   <p>${P3rows.map((r,i)=>`${"abcde"[i]}) ${r.ordre[0]} &nbsp;et&nbsp; ${r.ordre[1]}`).join("<br>")}</p>
   <p><b>Partie 2 :</b> même consigne. Cette fois, il y a une égalité vraie et 3 fausses.</p><p>${p2ordre.map(e=>`${p2.base} = ${V(e)}`).join(" &nbsp;et&nbsp; ")}</p>`,
   c:`<p><b>Partie 1</b></p>${P3rows.map((r,i)=>`<p>${"abcde"[i]}) Vraie : ${r.sans} = ${V(r.sans)}. Avec des parenthèses : ${r.avec} = ${V(r.avec)}.</p>${duo([["ACEGI"[i],r.sans],["BDFHJ"[i],r.avec]])}`).join("")}
   <p><b>Partie 2</b></p><p>Vraie : ${p2.base} = ${V(p2.base)}.</p>${duo([["K",p2.base]])}<p>Avec des parenthèses :</p>${duo(p2.ex.slice(1).map((e,i)=>["LMN"[i],e]))}`}
 ]},
 {t:"Résoudre un problème avec une seule expression", note:`<b>Consigne pour chaque problème :</b> écris une expression qui donne la solution du problème et nomme-la A. Effectue le calcul en détaillant les étapes (chaque ligne commence par « A = »), puis conclus par une phrase.`, e:[
  {n:"Exercice 2", t:"Résoudre un problème", w:"Sur ton cahier", h:`<p>J'ai ${pr2.s} €. J'achète ${pr2.n} livres à ${pr2.p} € l'un et ${pr2.m} CD à ${pr2.q} € l'un. Quel argent me reste-t-il ? Rédige ta réponse.</p>`,
   c:pbC(pr2,0,0,v=>`Il me reste ${v} €.`)},
  {n:"Exercice 4", t:"À la papeterie", w:"Sur ton cahier", h:`<p>Anna achète une règle à ${pr4.r} € et ${pr4.n} stylos à ${pr4.s} € l'un. Combien paie-t-elle ?</p>`, c:pbC(pr4,1,0,v=>`Anna paie ${eur(v)} €.`)},
  {n:"Exercice 5", t:"Poids du camion après livraison", w:"Sur ton cahier", h:`<p>Un camion pèse ${C.txt(C.R(pr5.P,1))} kg. On décharge ce camion de ${pr5.n} caisses de ${pr5.c} kg. Combien pèse maintenant le camion ?</p>`, c:pbC(pr5,0,0,v=>`Le camion pèse maintenant ${v} kg.`)},
  {n:"Exercice 6", t:"Argent rendu", w:"Sur ton cahier", h:`<p>Raphaël a économisé ${pr6.s} €. Il choisit une peluche à ${pr6.a} € pour sa sœur et un livre à ${pr6.b} € pour son frère. Combien d'argent lui reste-t-il après ses achats ?</p>`, c:pbC(pr6,0,0,v=>`Il reste ${v} € à Raphaël.`)},
  {n:"Exercice 7", t:"À la pâtisserie", w:"Sur ton cahier", h:`<p>Léo achète ${pr7.n} éclairs à ${pr7.p} € l'un et un sachet de bonbons à ${pr7.b} €. Il donne un billet de ${pr7.s} € à la caissière. Combien va-t-elle lui rendre ?</p>`, c:pbC(pr7,0,0,v=>`La caissière va lui rendre ${v} €.`)}
 ]},
 {t:"Programmes de calcul", e:[
  {n:"Activité 2", t:"Écrire la bonne expression", w:"Sur ton cahier", h:`${act2.map((o,i)=>`<p><b>Problème ${i+1} :</b> ${o.who} choisit le nombre ${o.x} et applique ce programme de calcul. Quel résultat obtient-${o.il} ?</p>${progBox(o.st)}`).join("")}
   <p>Pour chaque problème :</p><p>a) Calcule mentalement le résultat. b) Écris <b>un seul calcul</b> qui permet de trouver le résultat. Nomme-le A pour le problème 1, B pour le problème 2 et C pour le problème 3. c) Effectue ce calcul en détaillant tes étapes et conclus par une phrase.</p>`,
   c:act2.map((o,i)=>`<p><b>Problème ${i+1}.</b> Le calcul :</p>${L(o.e,"ABC"[i])}<p>${o.who} obtient ${V(o.e)}.</p>`).join("")},
  {n:"Exercice 8", t:"Quatre programmes de calcul", w:"Sur ton cahier", h:`<div class="progs">${p8.map((o,i)=>progBox(o.st,`Programme ${i+1}`)).join("")}</div><p>Pour chaque programme, on a choisi le nombre ${x8}.</p><p>1. Écris une seule expression qui permet de trouver le résultat de chaque programme de calcul. Nomme-les A, B, C et D. 2. Effectue ensuite tes calculs.</p>`,
   c:`<div class="calcs">${p8.map((o,i)=>`<div><p><b>Programme ${i+1}</b></p>${L(o.e,"ABCD"[i])}</div>`).join("")}</div>`},
  {n:"Exercice 9", t:"Quatre autres programmes", w:"Sur ton cahier", h:`<p>Dans chaque cas, écris l'expression numérique qui permet de résoudre le problème. Nomme-les A, B, C et D. Il n'est pas demandé d'effectuer les calculs, mais tu peux le faire au brouillon pour vérifier ton expression.</p>${p9.map((o,i)=>`<p><b>Problème ${i+1} :</b> je choisis le nombre ${o.x} et j'applique ce programme de calcul. Quel est le résultat ?</p>${progBox(o.st)}`).join("")}`,
   c:`<p>La première ligne est l'expression demandée. Les lignes suivantes sont la vérification au brouillon.</p><div class="calcs">${p9.map((o,i)=>`<div><p><b>Problème ${i+1}</b></p>${L(o.e,"ABCD"[i])}</div>`).join("")}</div>`}
 ]},
 {t:"Problèmes en plusieurs étapes", e:[
  {n:"Exercice 10", t:"Crédit pour l'achat d'une voiture", w:"Sur ton cahier", h:`<p>Paul veut acheter une voiture à ${C.txt(C.R(pb10.prix,1))} €. Son garagiste lui propose un crédit : paiement de ${C.txt(C.R(pb10.app,1))} € quand il récupère le véhicule, puis prélèvement de ${pb10.m} € par mois pendant ${pb10.n} mois.</p><p>Quelle somme d'argent Paul va-t-il payer en plus s'il achète cette voiture avec ce crédit ?</p>`,
   c:`<p>Avec le crédit, Paul paie ${C.txt(C.R(pb10.app,1))} + ${pb10.m} × ${pb10.n}. On enlève le prix de la voiture.</p>${pbC(pb10,0,0,v=>`Avec ce crédit, Paul va payer ${v} € en plus.`)}`},
  {n:"Exercice 11", t:"Prix du casque audio", w:"Sur ton cahier", h:`<p>Perrine et Jules veulent offrir un casque audio à leur sœur. Ils ont économisé respectivement ${pb11.a} € et ${pb11.b} €. S'ils avaient eu ${pb11.c} € de plus, ils auraient pu lui offrir en plus un DVD qui coûte ${pb11.d} €.</p><p>Quel est le prix du casque audio ?</p>`,
   c:`<p>Avec ${pb11.c} € de plus, ils auraient eu juste assez pour le casque <b>et</b> le DVD. Le prix du casque, c'est cette somme moins le prix du DVD.</p>${pbC(pb11,1,0,v=>`Le casque audio coûte ${eur(v)} €.`)}`},
  {n:"Exercice 12", t:`Combien de bouquets de ${pb12.k} roses ?`, w:"Sur ton cahier", h:`<p>Un fleuriste dispose de ${pb12.T} roses. Il décide d'en vendre ${pb12.u} à l'unité, de faire ${pb12.a} bouquets de ${pb12.ta} roses, ${pb12.b} bouquets de ${pb12.tb} roses et des bouquets de ${pb12.k} roses.</p><p>Combien de bouquets de ${pb12.k} roses peut-il constituer ?</p>`,
   c:`<p>On enlève les roses vendues à l'unité et celles des autres bouquets, puis on partage le reste en bouquets de ${pb12.k}.</p>${pbC(pb12,0,0,v=>`Il peut constituer ${v} bouquets de ${pb12.k} roses.`)}`}
 ]}
];
};
