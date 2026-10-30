/* 5e · chapitre 1 — fiche d'entraînement : mêmes exercices que la fiche de classe, autres nombres */
TRAIN["5e-1"] = function(){
const {ri, pick, shuf, sp, gcd, distinct, items} = TR;
const divs = n => { const a=[]; for(let d=1;d<=n;d++) if(n%d===0) a.push(d); return a; };
const isP = n => n>1 && divs(n).length===2;
/* « 60 = 1 × 60 = 2 × 30 = … » : les produits qui donnent n */
const prods = n => n+" = "+divs(n).filter(d=>d*d<=n).map(d=>`${d} × ${n/d}`).join(" = ");
const sum = n => String(n).split("").reduce((a,c)=>a+ +c,0);
const pot = (N,d) => `<div class="figs" style="align-items:center">${potence(N,d)}<p>${d} × ${Math.floor(N/d)} + ${N%d} = ${sp(N)}</p></div>`;
const crit = n => { const s=sum(n); return [n%2===0?"oui":"non", n%5===0?"oui":"non", n%10===0?"oui":"non", `${n%3===0?"oui":"non"} (${String(n).split("").join(" + ")} = ${s})`, n%9===0?`oui (${s} = 9 × ${s/9})`:`non (${s} n'est pas un multiple de 9)`]; };
const critTable = ns => `<div class="scroll"><table class="std"><thead><tr><th></th><th>par 2</th><th>par 5</th><th>par 10</th><th>par 3</th><th>par 9</th></tr></thead><tbody>${ns.map(n=>`<tr><td><b>${sp(n)}</b></td>${crit(n).map(x=>`<td>${x}</td>`).join("")}</tr>`).join("")}</tbody></table></div><p>Par 2, par 5 et par 10 : je regarde le chiffre des unités (${ns.map(n=>`${n%10} pour ${sp(n)}`).join(", ")}).</p>`;
const commonTable = (a,b,ha,hb,hn) => { const c=divs(gcd(a,b)); return `<div class="scroll"><table class="std"><thead><tr><th>${hn}</th><th>${ha}</th><th>${hb}</th></tr></thead><tbody>${c.map(k=>`<tr><td>${k}</td><td>${a/k}</td><td>${b/k}</td></tr>`).join("")}</tbody></table></div>`; };

/* ---------- A. Division euclidienne ---------- */
let N1,k1; do{ N1=ri(150,400); k1=pick([11,13,15,16]); }while(N1%k1===0);
let N2,y2,n2; do{ y2=pick([15,16,18,20,24]); n2=ri(15,30); N2=y2*n2; }while(false);
const z2 = (()=>{ let z; do{ z=ri(11,25); }while(N2%z===0); return z; })();
const pair2 = shuf([y2,z2]);
const secA = {t:"Division euclidienne", e:[
  {n:"Exercice 1", t:"Tournoi", w:"Sur ton cahier", h:`<p>${N1} élèves du collège sont inscrits à un tournoi. a) Combien d'équipes complètes de ${k1} joueurs peut-on former ? b) Combien manque-t-il d'élèves pour former une équipe supplémentaire ?</p>`,
   c:`${pot(N1,k1)}<p>a) On peut former ${Math.floor(N1/k1)} équipes complètes (il reste ${N1%k1} élèves).</p><p>b) Il manque ${k1} − ${N1%k1} = ${k1-N1%k1} élèves pour une équipe de plus.</p>`},
  {n:"Exercice 2", t:"À la bibliothèque", w:"Sur ton cahier", h:`<p>Un bibliothécaire doit répartir ${N2} livres sur des étagères, avec le même nombre de livres sur chaque étagère. Est-ce possible avec ${pair2[0]} étagères ? Avec ${pair2[1]} étagères ? Explique.</p>`,
   c:`<div class="figs" style="align-items:center">${potence(N2,pair2[0])}${potence(N2,pair2[1])}</div>${pair2.map(k=>N2%k===0?`<p>Avec ${k} étagères : ${k} × ${N2/k} = ${N2}. Le reste est nul : c'est <b>possible</b>, avec ${N2/k} livres par étagère.</p>`:`<p>Avec ${k} étagères : ${k} × ${Math.floor(N2/k)} + ${N2%k} = ${N2}. Le reste n'est pas nul : ce n'est <b>pas possible</b>.</p>`).join("")}`}
]};

/* ---------- B. Diviseurs et critères ---------- */
const f3 = shuf([pick([12,18,20,28,30,32,40,42,44,45,50]), pick([16,24,36,48,60,64,72]), pick([14,21,22,26,27,33,35,39]), pick([13,17,19,23,29,31,37,41])]);
const f4 = [ri(10,99)*10, ri(100,999)];
const [pa,pb] = pick([[2,4],[3,6],[5,10],[3,9],[2,6]]);
const ce = (()=>{ let x=pa; while(x%pb===0) x+=pa; return x; })();
const n7 = pick([24,36,40,42,45,48,50,54,60]);
const n7b = ri(1000,9999);
const secB = {t:"Diviseurs et critères de divisibilité", e:[
  {n:"Exercice 3", t:"Liste de diviseurs", w:"Sur ton cahier", h:`<p>Cite tous les diviseurs de : ${items(f3.map(String))}</p>`, c:items(f3.map(n=>`${prods(n)} : <b>${divs(n).join(", ")}</b>`),"<br>")},
  {n:"Exercice 4", t:"Les critères de divisibilité", w:"Sur ton cahier", h:`<p>Réponds par oui ou non. Le nombre ${sp(f4[0])} est-il divisible par 2 ? par 5 ? par 10 ? par 3 ? par 9 ? Même question pour ${sp(f4[1])}.</p>`, c:critTable(f4)},
  {n:"Exercice 5", t:"Pour aller plus loin", w:"Sur ton cahier", h:`<p>1. Vrai ou faux ? Justifie. a) Un multiple de ${pa} est forcément un multiple de ${pb}. b) Un multiple de ${pb} est forcément un multiple de ${pa}.</p><p>2. Complète : « Un nombre multiple de ${pb} est forcément multiple de … »</p>`,
   c:`<p>1. a) Faux : ${ce} est un multiple de ${pa} (${pa} × ${ce/pa}), mais pas de ${pb}. Un seul contre-exemple suffit.</p><p>b) Vrai : ${pb} = ${pa} × ${pb/pa}. Un multiple de ${pb} s'écrit ${pb} × un nombre, c'est donc aussi ${pa} × ${pb/pa} × ce nombre : c'est un multiple de ${pa}.</p><p>2. … de ${divs(pb).filter(d=>d!==1&&d!==pb).join(" et de ")} (et aussi de 1 et de ${pb}).</p>`},
  {n:"Exercice 6", t:"Vocabulaire de la divisibilité", w:"Sur ton cahier", h:`<p>a) Cite tous les diviseurs de ${n7}. b) Cite des multiples de ${n7}. c) Cite les trois premiers multiples de ${n7}. d) Le nombre ${sp(n7b)} est-il divisible par 2 ? par 5 ? par 10 ? par 3 ? par 9 ?</p>`,
   c:`<p>a) ${prods(n7)} : ${divs(n7).join(", ")}</p><p>b) Par exemple ${n7*2}, ${n7*3}, ${n7*10} (${n7} × 2, ${n7} × 3, ${n7} × 10)</p><p>c) 0, ${n7} et ${2*n7} (car ${n7} × 0 = 0). Si on ne compte pas 0 : ${n7}, ${2*n7} et ${3*n7}.</p><p>d)</p>${critTable([n7b])}`}
]};

/* ---------- C. Problèmes de partage ---------- */
const pairs = [[16,28],[12,30],[18,24],[20,30],[24,36],[18,27],[15,25],[20,32],[28,42],[30,45]];
let [c6a,c6b] = pick(pairs); if(Math.random()<0.5) [c6a,c6b]=[c6b,c6a];
let [r3a,r3b] = pick(pairs.filter(p=>p[0]!==c6a&&p[0]!==c6b));
let P1, r9, r13; do{ r9=pick([6,7,8,9,12]); P1=r9*ri(12,25); r13=pick([11,13,14,17]); }while(P1%r13===0);
const P2 = pick([24,30,32,40,42,48]);
const secC = {t:"Problèmes de partage", e:[
  {n:"Exercice 7", t:"Corbeilles de petit déjeuner", w:"Sur ton cahier", h:`<p>Le boulanger a livré ${c6a} croissants et ${c6b} pains au chocolat. On veut préparer des corbeilles identiques en utilisant toutes les viennoiseries.</p><p>1. Combien de corbeilles peut-on faire, et quel sera le contenu de chacune ? Donne toutes les possibilités. 2. Que représentent les nombres de corbeilles possibles pour ${c6a} et ${c6b} ?</p>`,
   c:`<p>1. Diviseurs de ${c6a} : ${divs(c6a).join(", ")} · Diviseurs de ${c6b} : ${divs(c6b).join(", ")} · Diviseurs communs : ${divs(gcd(c6a,c6b)).join(", ")}.</p>${commonTable(c6a,c6b,"Croissants","Pains au chocolat","Corbeilles")}<p>2. Ce sont les diviseurs communs à ${c6a} et ${c6b}.</p>`},
  {n:"Exercice 8", t:"Différents problèmes", w:"Sur ton cahier", h:`<p><b>Problème 1.</b> Claude veut planter ${P1} pommiers en rangées qui ont toutes le même nombre de pommiers. Peut-il faire ${r13} rangées complètes ? ${r9} rangées complètes ? Justifie.</p>
   <p><b>Problème 2.</b> Au goûter, ${P2} crêpes ont été mangées et chaque personne en a mangé le même nombre. Combien pouvait-il y avoir de personnes ? Donne toutes les possibilités.</p>
   <p><b>Problème 3.</b> Un fleuriste a ${r3a} roses rouges et ${r3b} roses blanches. Il veut faire des bouquets identiques avec toutes ses fleurs. Combien de bouquets, et quelle composition ? Donne toutes les possibilités.</p>`,
   c:`<p><b>Problème 1.</b> ${r13} × ${Math.floor(P1/r13)} + ${P1%r13} = ${P1} : le reste n'est pas nul, ${r13} rangées complètes c'est impossible. ${r9} × ${P1/r9} = ${P1} : c'est possible, avec ${P1/r9} pommiers par rangée.</p>
   <p><b>Problème 2.</b> Le nombre de personnes est un diviseur de ${P2}. ${prods(P2)} : ${divs(P2).join(", ")} personnes.</p>
   <p><b>Problème 3.</b> Diviseurs de ${r3a} : ${divs(r3a).join(", ")}. Diviseurs de ${r3b} : ${divs(r3b).join(", ")}.</p><p>Diviseurs communs à ${r3a} et ${r3b} : ${divs(gcd(r3a,r3b)).join(", ")}.</p>${commonTable(r3a,r3b,"Roses rouges","Roses blanches","Bouquets")}`}
]};

/* ---------- D. Nombres premiers ---------- */
const f9 = shuf([pick([13,17,19,23,29,31,37,41,43,47]), ...shuf([15,21,22,25,27,33,35,39,45,49,51]).slice(0,3)]);
const lo = pick([50,60,70,80]), primes = [...Array(20)].map((_,i)=>lo+i).filter(isP);
const st9 = pick([["Tous les nombres premiers sont impairs.","Faux : 2 est un nombre premier, et il est pair."],["Tout nombre impair est un nombre premier.","Faux : 9 est impair, mais il est divisible par 3."],["Un nombre premier a exactement deux diviseurs.","Vrai : ses deux seuls diviseurs sont 1 et lui-même."],["1 est un nombre premier.","Faux : 1 n'a qu'un seul diviseur."]]);
/* Ex 10 : code du coffre, énigme avec une seule solution */
/* toutes les énigmes valides sont listées une fois : une seule solution, et comme l'énigme de M. Staal,
   après ③ il reste au moins 3 nombres ; ④ et ⑤ en éliminent chacun au moins un */
if(!TR.codes){ TR.codes=[];
  for(const lo of [10,20,30,40]) for(const m of [3,4,6,7,8,9]) for(const q of [5,6,7,8,9,11]) for(let r=1;r<q;r++) for(const s of [3,4,5,6]) for(const not of [2,3,5,10]){
    if(m===q || not===m || s===not || (not===3&&(m===6||m===9))) continue;
    const R=[...Array(lo+51-lo)].map((_,i)=>lo+i).filter(x=>x>=10&&x<=99), L1=R.filter(x=>x%m===0), L2=L1.filter(x=>x%q===r);
    const sols=L2.filter(x=>sum(x)%s===0 && x%not!==0);
    if(sols.length===1 && L1.length<=10 && L2.length>=3 && L2.some(x=>sum(x)%s!==0) && L2.some(x=>x%not===0)) TR.codes.push({lo,hi:lo+50,m,q,r,s,not,code:sols[0],L1,L2});
  } }
const ind = pick(TR.codes), code = ind.code, L1 = ind.L1, L2 = ind.L2;
const secD = {t:"Nombres premiers", e:[
  {n:"Exercice 9", t:"À la chasse aux nombres premiers", w:"Sur ton cahier", h:`<p>1) Parmi ${f9.join(", ")}, lequel est un nombre premier ? Justifie avec sa liste de diviseurs.</p><p>2) Trouve tous les nombres premiers compris entre ${lo} et ${lo+19}.</p><p>3) Vrai ou faux, justifie : « ${st9[0]} »</p>`,
   c:`<p>1) ${f9.filter(isP)[0]}, car ses seuls diviseurs sont 1 et ${f9.filter(isP)[0]}. Les autres : ${f9.filter(n=>!isP(n)).map(n=>`${n} = ${divs(n)[1]} × ${n/divs(n)[1]}`).join(" ; ")}.</p><p>2) Les nombres pairs ne sont pas premiers (ils sont divisibles par 2). Parmi les impairs : ${[...Array(20)].map((_,i)=>lo+i).filter(n=>n%2&&!isP(n)).map(n=>`${n} = ${divs(n)[1]} × ${n/divs(n)[1]}`).join(" ; ")} ne sont pas premiers. Il reste : <b>${primes.join(", ")}</b>.</p><p>3) ${st9[1]}</p>`},
  {n:"Exercice 10", t:"Le code du coffre au trésor", w:"Sur ton cahier", h:`<p>Le code est un nombre à 2 chiffres. Indices : ① je suis compris entre ${ind.lo} et ${ind.hi} ; ② je suis un multiple de ${ind.m} ; ③ la division euclidienne de mon nombre par ${ind.q} donne un reste de ${ind.r} ; ④ la somme de mes deux chiffres est un multiple de ${ind.s} ; ⑤ je ne suis pas un multiple de ${ind.not}.</p><p>a) Liste les nombres qui vérifient ① et ②. b) Élimine ceux qui ne vérifient pas ③. c) Utilise ④ et ⑤ pour trouver le code.</p>`,
   c:`<p>a) ${L1.join(", ")}</p><p>b) On garde ceux dont le reste par ${ind.q} est ${ind.r} : ${L2.map(x=>`${x} (${ind.q} × ${Math.floor(x/ind.q)} + ${ind.r})`).join(", ")}.</p><p>c) ${L2.map(x=>{ const d=String(x).split("").join(" + ")+" = "+sum(x); return x%ind.not===0 ? `${x} est un multiple de ${ind.not} : éliminé par ⑤.` : sum(x)%ind.s!==0 ? `${x} : ${d}, pas un multiple de ${ind.s} : éliminé par ④.` : `${x} : ${d}, multiple de ${ind.s}, et ${x} n'est pas un multiple de ${ind.not}.`; }).join(" · ")} <b>Le code est ${code}.</b></p>`}
]};
return [secA, secB, secC, secD];
};
