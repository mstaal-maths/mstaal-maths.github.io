/* 4e — Chapitre 14 : Nombres en écriture fractionnaire (2) — multiplication, fraction d'un nombre, inverse et division
   (cours A4, feuille d'exercices, consignes de la semaine 2 et correction de M. Staal ; les exercices du manuel
   donnés dans les consignes sont repris d'après la correction de M. Staal). */
(function(){
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;

/* ---------- fractions (entiers relatifs, dénominateur affiché tel quel) ---------- */
const gcd=(a,b)=>{ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b,a%b]; } return a; };
const M=n=>(n<0?"−":"")+Math.abs(n);
const P=n=>n<0?`(${M(n)})`:M(n);                                     /* entier entre parenthèses s'il est négatif */
const F=(n,d)=>d===1?M(n):`{${M(n)}/${M(d)}}`;
/* forme irréductible, signe au numérateur */
const red=(n,d)=>{ const g=gcd(n,d)||1, s=(n<0)!==(d<0)&&n!==0?-1:1; return [s*Math.abs(n)/g, Math.abs(d)/g]; };
const R=(n,d)=>F(...red(n,d));
const TY=(n,d)=>{ const [a,b]=red(n,d); return b===1?[M(a),M(a)+"/1"]:[M(a)+"/"+b]; };
/* fraction étagée : (haut) sur (bas), chacun pouvant contenir {a/b} */
const FR2=(top,bot)=>`<span class="fr"><span style="border-bottom-width:3px;padding:0 .55em 2px">${top}</span><span style="padding:2px .55em 0">${bot}</span></span>`;
/* produit a/b × c/d : étapes */
function mul(a,b,c,d,o={}){
  const L=o.start?[...o.start]:[`${F(a,b)} × ${F(c,d)}`], N=a*c, D=b*d, g=gcd(N,D)||1, [x,y]=red(N,D);
  if(o.cancel) L.push(...o.cancel);
  else { L.push(`{${M(a)} × ${P(c)}/${M(b)} × ${P(d)}}`); L.push(F(N,D)); if(g>1) L.push(`{${M(N)} ÷ ${g}/${M(D)} ÷ ${g}}`); }
  if(L[L.length-1]!==F(x,y)) L.push(F(x,y));
  return {L, n:x, d:y};
}
/* inverse de a/b (le signe reste au numérateur) */
const inv=(a,b)=>[((a<0)!==(b<0)?-1:1)*Math.abs(b), Math.abs(a)];
/* quotient a/b ÷ c/d */
function div(a,b,c,d,o={}){
  const [e,f]=inv(c,d);
  const st=[o.first||`${F(a,b)} ÷ ${F(c,d)}`]; if(o.mid) st.push(...o.mid); st.push(`${F(a,b)} × ${F(e,f)}`);
  return mul(a,b,e,f,{start:st});
}
const calc=(name,L)=>`<p class="calc">${L.map(x=>`${name?name+" = ":"= "}${x}`).join("<br>")}</p>`;
const line=L=>L.join(" = ");
/* bande partagée en n parts (k coloriées) avec la valeur d'une part écrite dedans */
function bande(n,k,v,w=420){ const h=40, u=(w-4)/n; let s=`<svg class="fig" viewBox="0 0 ${w} ${h+4}" width="${w}" role="img" aria-label="Bande partagée en ${n} parts de ${v}, ${k} coloriées">`;
  for(let i=0;i<n;i++) s+=`<rect x="${(2+i*u).toFixed(1)}" y="2" width="${u.toFixed(1)}" height="${h}" style="fill:${i<k?"color-mix(in srgb,var(--c) 40%,transparent)":"var(--surface)"};stroke:var(--ink);stroke-width:1.6"/><text x="${(2+(i+.5)*u).toFixed(1)}" y="${h/2+8}" text-anchor="middle" style="font-size:17px;font-weight:700">${v}</text>`;
  return s+"</svg>"; }

window.FR14={gcd,M,P,F,red,R,TY,FR2,mul,inv,div,calc,line,bande};

/* ===================== schémas ===================== */
const S_MUL=sch("Multiplier deux fractions",`<p class="calc">{a/b} × {c/d} = {a × c/b × d}</p><p class="calc">A = {5/8} × {9/4}<br>A = {5 × 9/8 × 4}<br>A = {45/32}</p><p class="schN">Numérateurs entre eux, dénominateurs entre eux. On simplifie (si possible avant de multiplier).</p>`);
const S_SIM=sch("Simplifier avant de multiplier",`<p class="calc">D = {32/45} × {35/24}<br>D = {8 × 4 × 5 × 7/5 × 9 × 8 × 3}<br>D = {4 × 7/9 × 3}<br>D = {28/27}</p><p class="schN">On décompose les nombres pour faire apparaître les mêmes facteurs en haut et en bas, puis on les barre.</p>`);
const S_DE=sch("Prendre une fraction d'un nombre",`${bande(7,3,8,280)}<p class="calc">{3/7} de 56 : 56 ÷ 7 = 8, puis 3 × 8 = 24<br>ou {3/7} × 56 = 24</p>`);
const S_INV=sch("Inverse d'un nombre",`<p class="calc">L'inverse de {7/6} est {6/7} car {7/6} × {6/7} = 1</p><p class="calc">L'inverse de 9 est {1/9}</p><p class="schN">Deux nombres sont inverses si leur produit vaut 1. 0 n'a pas d'inverse.</p>`);
const S_DIV=sch("Diviser par une fraction",`<p class="calc">{a/b} ÷ {c/d} = {a/b} × {d/c}</p><p class="calc">C = {−3/5} ÷ {4/6}<br>C = {−3/5} × {6/4}<br>C = {−18/20}<br>C = {−9/10}</p><p class="schN">Diviser par un nombre, c'est multiplier par son inverse.</p>`);

/* ---------- générateurs ---------- */
const nz=(a,b)=>{ let x; do{ x=ri(a,b); }while(x===0); return x; };
function qMul(neg){ for(;;){ const b=ri(2,9), d=ri(2,9), a=neg?nz(-9,9):ri(1,9), c=ri(1,9); if(gcd(a,b)>1||gcd(c,d)>1) continue; return {a,b,c,d,S:mul(a,b,c,d)}; } }
/* produit qui se simplifie « en croix » : (k·x)/(m·y) × (m·z)/(k·w) */
function qCross(){ for(;;){ const k=ri(2,9), m=ri(2,9), x=ri(1,7), y=ri(1,7), z=ri(1,7), w=ri(1,7); const a=k*x, b=m*y, c=m*z, d=k*w; if(k===m||b===1||d===1||gcd(a,b)>1||gcd(c,d)>1||gcd(x*z,y*w)>1) continue;
  const S=mul(a,b,c,d,{cancel:[`{${a} × ${c}/${b} × ${d}}`, `{${k} × ${x} × ${m} × ${z}/${m} × ${y} × ${k} × ${w}}`, `{${x} × ${z}/${y} × ${w}}`]}); return {a,b,c,d,S}; } }

CH["4e-14"] = {
intro:"Multiplier des fractions, prendre une fraction d'un nombre, trouver l'inverse d'un nombre et diviser des fractions.",
savoir:[
  "multiplier deux fractions, puis simplifier le résultat ;",
  "simplifier avant d'effectuer une multiplication ;",
  "prendre une fraction d'un nombre pour résoudre un problème ;",
  "donner l'inverse d'un nombre ;",
  "diviser par une fraction en multipliant par son inverse."
],

/* ===================== COURS ===================== */
cours:[
{k:"1", t:"Multiplier des nombres en écriture fractionnaire", h:`
  <div class="retenir" data-l="Propriété"><p>Pour multiplier deux quotients :</p><p>– on <b>multiplie les numérateurs</b> entre eux ;</p><p>– on <b>multiplie les dénominateurs</b> entre eux.</p><p>Autrement dit, soit a, b, c et d quatre nombres relatifs avec b et d non nuls :</p><p class="calc">{a/b} × {c/d} = {a × c/b × d}</p></div>
  <h4>a) Multiplier des fractions puis simplifier</h4>
  <p><b>Exercices :</b> calcule et donne le résultat sous forme d'une fraction simplifiée.</p>
  ${calc("A",["{5/8} × {9/4}","{5 × 9/8 × 4}","{45/32}"])}
  ${calc("B",["{−3/5} × {10/7}","{−3 × 10/5 × 7}","{−30/35}","{−30 ÷ 5/35 ÷ 5}","{−6/7}"])}
  <h4>b) Simplifier avant de multiplier deux fractions</h4>
  <p>Pour faciliter les calculs, il est parfois astucieux de <b>simplifier les calculs</b> avant d'effectuer les multiplications.</p>
  <p><b>Exemple :</b> C = {15/8} × {9/15}.</p>
  <p>Première méthode : on multiplie, puis on simplifie.</p>${calc("C",["{15 × 9/8 × 15}","{135/120}","{135 ÷ 15/120 ÷ 15}","{9/8}"])}
  <p>Méthode plus rapide : on simplifie d'abord par 15 (15 est en haut et en bas), puis on multiplie.</p>${calc("C",["{15 × 9/8 × 15}","{9/8}"])}
  <p><b>Exercices :</b></p>
  ${calc("C",["{7/32} × {32/12}","{7 × 32/32 × 12}","{7/12}"])}<p>On simplifie par 32.</p>
  ${calc("B",["{−3/5} × {10/7}","{−3 × 10/5 × 7}","{−3 × 5 × 2/5 × 7}","{−6/7}"])}<p>Revenons au calcul B d'au-dessus : on aurait pu le simplifier, car on peut transformer 10 en 5 × 2, ce qui nous permet de simplifier par 5 ensuite.</p>
  ${calc("D",["{32/45} × {35/24}","{32 × 35/45 × 24}","{8 × 4 × 5 × 7/5 × 9 × 8 × 3}","{4 × 7/9 × 3}","{28/27}"])}
  <p>On remarque que 35 et 45 sont tous les 2 dans la table de 5, donc on décompose : 35 = 5 × 7 et 45 = 5 × 9.</p><p>On remarque que 32 et 24 sont tous les 2 dans la table de 8, donc on décompose : 32 = 8 × 4 et 24 = 8 × 3.</p><p>On simplifie par 8 et par 5.</p>`},
{k:"2", t:"Problèmes : prendre une fraction d'un nombre", h:`
  <p><b>Problème :</b> les {3/7} d'un troupeau de 56 moutons ont été tondus aujourd'hui.</p><p>Combien de moutons ont été tondus ?</p>
  <p><b>Méthode 1 :</b></p>${bande(7,3,8)}
  <p class="calc">56 ÷ 7 = 8</p><p>{1/7} du troupeau représente 8 moutons (on a partagé le troupeau en 7 parties : dans chaque partie, il y a 8 moutons).</p>
  <p>Mais {3/7} des moutons du troupeau ont été tondus, donc on fait 3 × 8 = 24.</p><p>Donc 24 moutons ont été tondus.</p>
  <p><b>Méthode 2 :</b></p>
  <div class="retenir" data-l="À retenir"><p>Calculer {3/7} de 56 revient à calculer {3/7} × 56.</p></div>
  ${calc("A",["{3/7} × 56","{3 × 56/7}","{3 × 7 × 8/7}","24"])}
  <p>Il y a donc eu 24 moutons qui ont été tondus.</p>`},
{k:"3", t:"Diviser des nombres en écriture fractionnaire", h:`
  <h4>a) Inverse d'un nombre</h4>
  <div class="retenir" data-l="Définition"><p>Dire que deux nombres sont <b>inverses l'un de l'autre</b> signifie que leur produit est égal à 1.</p></div>
  <div class="retenir" data-l="Propriété"><p>Soit a et b deux nombres relatifs non nuls.</p><p>L'inverse de a est le nombre {1/a}.</p><p>L'inverse de {a/b} est le nombre {b/a}.</p></div>
  <p><b>Exemples :</b></p>
  <p>L'inverse de 9 est {1/9}. En effet, 9 × {1/9} = 1.</p>
  <p>L'inverse de −3 est {1/−3}. En effet, −3 × {1/−3} = 1.</p>
  <p>L'inverse de {7/6} est {6/7}. En effet, {7/6} × {6/7} = 1.</p>
  <h4>b) Division</h4>
  <div class="retenir" data-l="Propriété"><p><b>Diviser par un nombre</b> non nul revient à <b>multiplier par son inverse</b>.</p><p>Autrement dit, soit a, b, c et d quatre nombres relatifs avec b, c et d non nuls :</p><p class="calc">{a/b} ÷ c = {a/b} × {1/c} &nbsp;&nbsp; et &nbsp;&nbsp; {a/b} ÷ {c/d} = {a/b} × {d/c}</p></div>
  <p><b>Exemples :</b> donne le résultat sous forme d'une fraction simplifiée.</p>
  ${calc("A",["{5/8} ÷ 2","{5/8} × {1/2}","{5/8 × 2}","{5/16}"])}
  <p class="calc">B = ${FR2("−3","{4/5}")}<br>B = −3 ÷ {4/5}<br>B = −3 × {5/4}<br>B = {−3 × 5/4}<br>B = {−15/4}</p>
  <p class="calc">C = ${FR2("{−3/5}","{4/6}")}<br>C = {−3/5} ÷ {4/6}<br>C = {−3/5} × {6/4}<br>C = {−3 × 6/5 × 4}<br>C = {−3 × 2 × 3/5 × 2 × 2}<br>C = {−9/10}</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Multiplier des fractions", e:[
  {n:"Exercice 1", t:"Multiplier puis simplifier", w:"Sur ton cahier", h:`<p>Calcule et donne le résultat sous forme d'une fraction simplifiée.</p><p>A = {3/5} × {7/2}</p><p>B = {1/4} × {3/5}</p><p>C = {−1/5} × {5/−3}</p><p>D = {−3/5} × {7/9}</p><p>E = 6 × {1/5}</p><p>F = (−9) × {−2/3}</p>`,
   c:`${calc("A",["{3/5} × {7/2}","{3 × 7/5 × 2}","{21/10}"])}${calc("B",["{1/4} × {3/5}","{1 × 3/4 × 5}","{3/20}"])}
   ${calc("C",["{−1/5} × {5/−3}","{−1 × 5/5 × (−3)}","{−5/−15}","{−5 ÷ 5/−15 ÷ 5}","{−1/−3}","{1/3}"])}<p>Deux nombres négatifs que l'on divise donnent un nombre positif.</p>
   ${calc("D",["{−3/5} × {7/9}","{−3 × 7/5 × 9}","{−21/45}","{−21 ÷ 3/45 ÷ 3}","{−7/15}"])}
   ${calc("E",["6 × {1/5}","{6/1} × {1/5}","{6/5}"])}${calc("F",["(−9) × {−2/3}","{−9/1} × {−2/3}","{18/3}","{18 ÷ 3/3 ÷ 3}","{6/1}","6"])}`},
  {n:"Exercice 2", t:"Simplifier avant de multiplier", w:"Sur ton cahier", h:`<p>Calcule en simplifiant avant d'effectuer les multiplications.</p><p>A = {3/7} × {8/3}</p><p>B = {2/15} × {15/11}</p><p>C = {14/23} × {1/7}</p><p>D = {2/11} × {3/4}</p><p>E = {7/8} × {1/21}</p><p>F = {2/3} × {3/4} × {4/5}</p>`,
   c:`${calc("A",["{3/7} × {8/3}","{3 × 8/7 × 3}","{8/7}"])}${calc("B",["{2/15} × {15/11}","{2 × 15/15 × 11}","{2/11}"])}${calc("C",["{14/23} × {1/7}","{14 × 1/23 × 7}","{7 × 2 × 1/23 × 7}","{2/23}"])}
   ${calc("D",["{2/11} × {3/4}","{2 × 3/11 × 4}","{2 × 3/11 × 2 × 2}","{3/22}"])}${calc("E",["{7/8} × {1/21}","{7 × 1/8 × 21}","{7 × 1/8 × 7 × 3}","{1/24}"])}${calc("F",["{2/3} × {3/4} × {4/5}","{2 × 3 × 4/3 × 4 × 5}","{2/5}"])}`},
  {n:"Exercice 3", t:"Décomposer pour simplifier", w:"Sur ton cahier", h:`<p>Calcule et donne le résultat sous forme d'une fraction simplifiée.</p><p>A = {35/26} × {13/70}</p><p>B = {45/24} × {8/9}</p><p>C = {63/36} × {12/81}</p><p>D = {32/27} × {54/28}</p>`,
   c:`${calc("A",["{35/26} × {13/70}","{35 × 13/26 × 70}","{35 × 13/13 × 2 × 35 × 2}","{1/4}"])}${calc("B",["{45/24} × {8/9}","{45 × 8/24 × 9}","{9 × 5 × 8/8 × 3 × 9}","{5/3}"])}
   ${calc("C",["{63/36} × {12/81}","{63 × 12/36 × 81}","{9 × 7 × 12/3 × 12 × 9 × 9}","{7/27}"])}${calc("D",["{32/27} × {54/28}","{32 × 54/27 × 28}","{4 × 8 × 6 × 9/9 × 3 × 7 × 4}","{8 × 6/3 × 7}","{8 × 3 × 2/3 × 7}","{16/7}"])}`}
 ]},
{t:"Prendre une fraction d'un nombre", e:[
  {n:"Exercice 4", t:"Les bonbons", w:"Sur ton cahier", h:`<p>Arthur achète un sachet de 30 bonbons.</p><p>Les {2/5} des bonbons sont au chocolat et le reste des bonbons sont au caramel.</p><p>Combien y a-t-il de bonbons au chocolat ?</p>`,
   c:`<p><b>Méthode 1 :</b></p>${bande(5,2,6)}<p>30 ÷ 5 = 6 : {1/5} du paquet représente 6 bonbons.</p><p>{2/5} des bonbons sont au chocolat, donc on fait 2 × 6 = 12.</p>
   <p><b>Méthode 2 :</b></p><p class="calc">{2/5} × 30 = {2 × 30/5} = {2 × 5 × 6/5} = 12</p><p>Donc <b>12 bonbons</b> sont au chocolat.</p>`},
  {n:"Exercice 5", t:"Dans une entreprise", w:"Sur ton cahier", h:`<p>Dans une entreprise de 250 salariés, les {11/50} sont blonds.</p><p>Combien y a-t-il de personnes blondes dans cette entreprise ?</p>`,
   c:`<p>Différentes méthodes sont possibles.</p><p class="calc">{11/50} × 250 = {11 × 250/50} = {11 × 50 × 5/50} = 55</p><p>Donc <b>55 employés</b> sont blonds.</p>`},
  {n:"Exercice 6", t:"Calcul mental", w:"Sur ton cahier", h:`<p>Indique la quantité représentée dans chaque cas.</p><p>a) {1/4} de 20 élèves</p><p>b) {1/3} de 33 m</p><p>c) {5/6} de 48 L</p><p>d) {3/5} de 25 moutons</p>`,
   c:`<p>a) 20 ÷ 4 = 5 : <b>5 élèves</b>.</p><p>b) 33 ÷ 3 = 11 : <b>11 m</b>.</p><p>c) 48 ÷ 6 = 8 et 5 × 8 = 40 : <b>40 L</b>.</p><p>d) 25 ÷ 5 = 5 et 3 × 5 = 15 : <b>15 moutons</b>.</p>`},
  {n:"Exercice 7", t:"L'abonnement de bus (calculatrice autorisée)", w:"Sur ton cahier", h:`<p>Dans une agglomération, le coût réel de l'abonnement mensuel au réseau de bus est de 142 €.</p><p>Mais la communauté d'agglomération prend en charge les {4/5} de ce montant.</p><p>Combien l'usager paie-t-il cet abonnement mensuel ?</p>`,
   c:`<p class="calc">{4/5} × 142 = 113,6</p><p>La communauté d'agglomération prend en charge 113,60 € sur les 142 €.</p><p class="calc">142 − 113,60 = 28,40</p><p>L'usager ne paiera que <b>28,40 €</b> pour un abonnement mensuel.</p>`}
 ]},
{t:"Inverse et division", e:[
  {n:"Exercice 8", t:"Inverse d'un nombre", w:"Sur ton cahier", h:`<p>Donne l'inverse de chaque nombre.</p><p>a) {2/5}</p><p>b) {−3/7}</p><p>c) {15/−5}</p><p>d) −{8/17}</p><p>e) 5</p>`,
   c:`<p>a) L'inverse de {2/5} est <b>{5/2}</b>.</p><p>b) L'inverse de {−3/7} est <b>{7/−3}</b> (c'est-à-dire {−7/3}).</p><p>c) L'inverse de {15/−5} est <b>{−5/15}</b> (c'est-à-dire {−1/3}).</p><p>d) L'inverse de −{8/17} est <b>−{17/8}</b>.</p><p>e) L'inverse de 5 est <b>{1/5}</b>.</p><p>Vérification, par exemple : {2/5} × {5/2} = {10/10} = 1.</p>`},
  {n:"Exercice 9", t:"Diviser des fractions", w:"Sur ton cahier", h:`<p>Calcule et donne le résultat sous forme d'une fraction simplifiée.</p><p>A = {3/7} ÷ {4/5}</p><p>B = {6/11} ÷ {5/4}</p><p>C = {11/9} ÷ {1/2}</p><p>D = {15/4} ÷ 2</p><p>E = 4 ÷ {7/9}</p><p>F = {3/8} ÷ {5/7}</p>`,
   c:`${calc("A",["{3/7} ÷ {4/5}","{3/7} × {5/4}","{3 × 5/7 × 4}","{15/28}"])}${calc("B",["{6/11} ÷ {5/4}","{6/11} × {4/5}","{6 × 4/11 × 5}","{24/55}"])}${calc("C",["{11/9} ÷ {1/2}","{11/9} × {2/1}","{22/9}"])}
   ${calc("D",["{15/4} ÷ 2","{15/4} ÷ {2/1}","{15/4} × {1/2}","{15 × 1/4 × 2}","{15/8}"])}${calc("E",["4 ÷ {7/9}","{4/1} ÷ {7/9}","{4/1} × {9/7}","{4 × 9/7}","{36/7}"])}${calc("F",["{3/8} ÷ {5/7}","{3/8} × {7/5}","{3 × 7/8 × 5}","{21/40}"])}`},
  {n:"Exercice 10", t:"Des fractions de fractions", w:"Sur ton cahier", h:`<p>Calcule et donne le résultat sous forme d'une fraction simplifiée.</p>
   <div class="figs" style="gap:40px"><p>A = ${FR2("{2/9}","−{5/3}")}</p><p>B = ${FR2("{3/5}","{1/5}")}</p><p>C = ${FR2("−3","{6/5}")}</p><p>D = ${FR2("−{3/6}","5")}</p></div>`,
   c:`<p><b>Remarque :</b> −{5/3} = {−5/3}.</p>
   <p class="calc">A = {2/9} ÷ (−{5/3})<br>A = {2/9} ÷ ({−5/3})<br>A = {2/9} × {3/−5}<br>A = {2 × 3/3 × 3 × (−5)}<br>A = {2/−15}<br>A = {−2/15}</p>
   <p class="calc">B = {3/5} ÷ {1/5}<br>B = {3/5} × {5/1}<br>B = {3 × 5/5 × 1}<br>B = {3/1}<br>B = 3</p>
   <p class="calc">C = −3 ÷ {6/5}<br>C = {−3/1} ÷ {6/5}<br>C = {−3/1} × {5/6}<br>C = {−15/6}<br>C = {−15 ÷ 3/6 ÷ 3}<br>C = {−5/2}</p>
   <p class="calc">D = −{3/6} ÷ 5<br>D = {−3/6} ÷ {5/1}<br>D = {−3/6} × {1/5}<br>D = {−3/30}<br>D = {−3 ÷ 3/30 ÷ 3}<br>D = {−1/10}</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Multiplier des fractions", schema:S_MUL, q:{
 1:[ {g:()=>{ const Q=qMul(false); return {q:`Calcule : ${F(Q.a,Q.b)} × ${F(Q.c,Q.d)} (fraction simplifiée)`, rep:TY(Q.S.n,Q.S.d), ex:line(Q.S.L)+".", sx:S_MUL}; }},
     {q:"Pour multiplier deux fractions…", c:["on multiplie les numérateurs entre eux et les dénominateurs entre eux","on met les fractions au même dénominateur","on multiplie seulement les numérateurs"], rep:"on multiplie les numérateurs entre eux et les dénominateurs entre eux", sx:S_MUL} ],
 2:[ {g:()=>{ const Q=qMul(true); return {q:`Calcule : ${F(Q.a,Q.b)} × ${F(Q.c,Q.d)} (fraction simplifiée)`, rep:TY(Q.S.n,Q.S.d), ex:line(Q.S.L)+".", sx:S_MUL, kb:"text"}; }},
     {g:()=>{ let n,d,k; do{ d=ri(2,9); n=ri(1,9); k=ri(2,9); }while(gcd(n,d)>1); const S=mul(k,1,n,d,{start:[`${k} × ${F(n,d)}`,`{${k}/1} × ${F(n,d)}`]}); return {q:`Calcule : ${k} × ${F(n,d)}`, rep:TY(S.n,S.d), ex:line(S.L)+".", sx:S_MUL}; }} ],
 3:[ {g:()=>{ const Q=qCross(); return {q:`Calcule en simplifiant d'abord : ${F(Q.a,Q.b)} × ${F(Q.c,Q.d)}`, rep:TY(Q.S.n,Q.S.d), ex:line(Q.S.L)+".", sx:S_SIM}; }} ]
}},
{nom:"Fraction d'un nombre", schema:S_DE, q:{
 1:[ {g:()=>{ const n=ri(2,10), v=ri(2,12); return {q:`Combien font {1/${n}} de ${n*v} élèves ?`, rep:[String(v)], ex:`${n*v} ÷ ${n} = ${v}.`, sx:S_DE}; }} ],
 2:[ {g:()=>{ let n,k; do{ n=ri(3,10); k=ri(2,n-1); }while(gcd(k,n)>1); const v=ri(2,12); return {q:`Combien font {${k}/${n}} de ${n*v} € ?`, rep:[String(k*v), k*v+" €"], ex:`${n*v} ÷ ${n} = ${v}, puis ${k} × ${v} = ${k*v}. Ou {${k}/${n}} × ${n*v} = ${k*v}.`, sx:S_DE}; }} ],
 3:[ {g:()=>{ let n,k; do{ n=ri(3,8); k=ri(1,n-1); }while(gcd(k,n)>1); const v=ri(3,10), T=n*v; return {q:`Un sachet contient ${T} bonbons. ${k===1?"Le":"Les"} {${k}/${n}} ${k===1?"est":"sont"} au chocolat et le reste au caramel. Combien y a-t-il de bonbons au caramel ?`, rep:[String(T-k*v)], ex:`Chocolat : {${k}/${n}} × ${T} = ${k*v}. Caramel : ${T} − ${k*v} = ${T-k*v}.`, sx:S_DE}; }},
     {q:"Calculer {3/7} de 56 revient à calculer…", c:["{3/7} × 56","{3/7} + 56","56 ÷ {3/7}"], rep:"{3/7} × 56", sx:S_DE} ]
}},
{nom:"Inverse d'un nombre", schema:S_INV, q:{
 1:[ {g:()=>{ let a,b; do{ b=ri(2,9); a=ri(1,12); }while(gcd(a,b)>1||a===1); return {q:`Quel est l'inverse de ${F(a,b)} ?`, c:shuf(uniq(F(b,a),[F(-a,b),F(a,b),F(1,a*b)])), rep:F(b,a), ex:`${F(a,b)} × ${F(b,a)} = 1.`, sx:S_INV}; }},
     {g:()=>{ const a=ri(2,15); return {q:`Quel est l'inverse de ${a} ?`, c:shuf(uniq(F(1,a),[M(-a),"0",String(a)])), rep:F(1,a), ex:`${a} × ${F(1,a)} = 1.`, sx:S_INV}; }} ],
 2:[ {g:()=>{ let a,b; do{ b=ri(2,9); a=ri(1,9); }while(gcd(a,b)>1); return {q:`Quel est l'inverse de ${F(-a,b)} ?`, c:shuf(uniq(F(-b,a),[F(b,a),F(a,b),F(-a,b)].map(x=>x))), rep:F(-b,a), ex:`L'inverse garde le même signe : ${F(-a,b)} × ${F(-b,a)} = ${F(a*b,a*b)} = 1.`, sx:S_INV}; }} ],
 3:[ {q:"Vrai ou faux : 0 a un inverse.", c:["Vrai","Faux"], rep:"Faux", ex:"0 × n'importe quel nombre = 0, jamais 1 : 0 n'a pas d'inverse.", sx:S_INV},
     {g:()=>{ const a=ri(2,9); let b; do{ b=ri(2,9); }while(b===a); const ok=Math.random()<0.5, c=ok?b:b+1; return {q:`Vrai ou faux : ${F(a,b)} et ${F(c,a)} sont inverses l'un de l'autre.`, c:["Vrai","Faux"], rep:ok?"Vrai":"Faux", ex:`${F(a,b)} × ${F(c,a)} = ${F(a*c,a*b)}${ok?" = 1":", qui n'est pas égal à 1"}.`, sx:S_INV}; }} ]
}},
{nom:"Diviser des fractions", schema:S_DIV, q:{
 1:[ {g:()=>{ let a,b,k; do{ b=ri(2,9); a=ri(1,9); k=ri(2,6); }while(gcd(a,b)>1); const S=div(a,b,k,1,{mid:[`${F(a,b)} ÷ {${k}/1}`]}); return {q:`Calcule : ${F(a,b)} ÷ ${k}`, rep:TY(S.n,S.d), ex:line(S.L)+".", sx:S_DIV}; }},
     {q:"Diviser par un nombre non nul revient à…", c:["multiplier par son inverse","multiplier par son opposé","diviser par son inverse"], rep:"multiplier par son inverse", sx:S_DIV} ],
 2:[ {g:()=>{ let a,b,c,d; do{ b=ri(2,9); a=ri(1,9); d=ri(2,9); c=ri(1,9); }while(gcd(a,b)>1||gcd(c,d)>1||c===d); const S=div(a,b,c,d); return {q:`Calcule : ${F(a,b)} ÷ ${F(c,d)} (fraction simplifiée)`, rep:TY(S.n,S.d), ex:line(S.L)+".", sx:S_DIV}; }} ],
 3:[ {g:()=>{ let a,b,c,d; do{ b=ri(2,9); a=nz(-9,9); d=ri(2,9); c=ri(1,9); }while(gcd(a,b)>1||gcd(c,d)>1||c===d); const S=div(a,b,c,d,{first:FR2(F(a,b),F(c,d))}); S.L.splice(1,0,`${F(a,b)} ÷ ${F(c,d)}`);
       return {q:`Calcule : ${FR2(F(a,b),F(c,d))}`, rep:TY(S.n,S.d), ex:line(S.L.slice(1))+".", sx:S_DIV, kb:"text"}; }},   /* la 1re ligne (la fraction de fractions) est reprise de la question par qChain */
     {g:()=>{ let a,c,d; do{ a=nz(-9,9); d=ri(2,9); c=ri(1,9); }while(gcd(c,d)>1||c===d); const S=div(a,1,c,d,{mid:[`{${M(a)}/1} ÷ ${F(c,d)}`]}); return {q:`Calcule : ${M(a)} ÷ ${F(c,d)}`, rep:TY(S.n,S.d), ex:line(S.L)+".", sx:S_DIV, kb:"text"}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 14", duree:50, info:"Durée : 50 min · Calculatrice non autorisée · Les calculs doivent être détaillés",
comp:[
  ["CALCULER","Je multiplie des fractions et je simplifie (si possible avant de multiplier).","Ex. 1 (5 points)"],
  ["CONNAÎTRE","Je donne l'inverse d'un nombre.","Ex. 2 (2 points)"],
  ["CALCULER","Je divise par une fraction en multipliant par son inverse.","Ex. 3 (5 points)"],
  ["MODÉLISER","Je prends une fraction d'un nombre pour résoudre un problème.","Ex. 4 et 5 (8 points)"]
],
exos:[
{t:"Multiplier", p:5, h:`<p>Calcule et donne le résultat sous forme d'une fraction simplifiée (ou d'un entier).</p><p>A = {4/7} × {3/5} &nbsp;&nbsp; B = {−5/6} × {9/10} &nbsp;&nbsp; C = 8 × {3/4}</p><p>D = {14/15} × {25/21} &nbsp;&nbsp; E = {−6/7} × {−14/9}</p>`,
 c:`${calc("A",["{4/7} × {3/5}","{4 × 3/7 × 5}","{12/35}"])}${calc("B",["{−5/6} × {9/10}","{−5 × 9/6 × 10}","{−5 × 3 × 3/3 × 2 × 5 × 2}","{−3/4}"])}${calc("C",["8 × {3/4}","{8/1} × {3/4}","{8 × 3/4}","{4 × 2 × 3/4}","6"])}
 ${calc("D",["{14/15} × {25/21}","{14 × 25/15 × 21}","{7 × 2 × 5 × 5/5 × 3 × 7 × 3}","{2 × 5/3 × 3}","{10/9}"])}${calc("E",["{−6/7} × {−14/9}","{(−6) × (−14)/7 × 9}","{6 × 7 × 2/7 × 3 × 3}","{2 × 3 × 2/3 × 3}","{4/3}"])}<p><i>(1 point par calcul juste et simplifié)</i></p>`},
{t:"Inverses", p:2, h:`<p>Donne l'inverse de chaque nombre.</p><p>a) 7 &nbsp;&nbsp; b) {3/8} &nbsp;&nbsp; c) {−4/9} &nbsp;&nbsp; d) {1/6}</p>`,
 c:`<p>a) {1/7} · b) {8/3} · c) {−9/4} · d) {6/1} = 6</p><p><i>(0,5 point par réponse)</i></p>`},
{t:"Diviser", p:5, h:`<p>Calcule et donne le résultat sous forme d'une fraction simplifiée.</p><p>A = {2/3} ÷ {5/7} &nbsp;&nbsp; B = {9/4} ÷ 3 &nbsp;&nbsp; C = 5 ÷ {10/3}</p><p>D = {−8/15} ÷ {4/5} &nbsp;&nbsp; E = ${FR2("{3/4}","{9/8}")}</p>`,
 c:`${calc("A",["{2/3} ÷ {5/7}","{2/3} × {7/5}","{2 × 7/3 × 5}","{14/15}"])}${calc("B",["{9/4} ÷ 3","{9/4} × {1/3}","{3 × 3/4 × 3}","{3/4}"])}${calc("C",["5 ÷ {10/3}","{5/1} × {3/10}","{5 × 3/2 × 5}","{3/2}"])}
 ${calc("D",["{−8/15} ÷ {4/5}","{−8/15} × {5/4}","{−4 × 2 × 5/5 × 3 × 4}","{−2/3}"])}${calc("E",["{3/4} ÷ {9/8}","{3/4} × {8/9}","{3 × 4 × 2/4 × 3 × 3}","{2/3}"])}<p><i>(1 point par calcul juste et simplifié)</i></p>`},
{t:"Calcul mental", p:4, h:`<p>Calcule.</p><p>a) {3/8} de 64 élèves &nbsp;&nbsp; b) {2/3} de 45 min</p><p>c) {7/10} de 250 € &nbsp;&nbsp; d) {5/12} de 36 bonbons</p>`,
 c:`<p>a) 64 ÷ 8 = 8 et 3 × 8 = 24 élèves · b) 45 ÷ 3 = 15 et 2 × 15 = 30 min · c) 250 ÷ 10 = 25 et 7 × 25 = 175 € · d) 36 ÷ 12 = 3 et 5 × 3 = 15 bonbons</p><p><i>(1 point par réponse)</i></p>`},
{t:"La cagnotte de la classe", p:4, h:`<p>Une classe a récolté 360 € pour ses projets.</p><p>Elle utilise les {3/8} de cette somme pour une sortie au cinéma et {1/5} de cette somme pour acheter des livres.</p><p>a) Combien coûte la sortie au cinéma ?</p><p>b) Combien coûtent les livres ?</p><p>c) Quelle somme reste-t-il dans la cagnotte ? Quelle fraction de la cagnotte cela représente-t-il ?</p>`,
 c:`<p>a) {3/8} × 360 = {3 × 8 × 45/8} = 135 € <i>(1 point)</i></p><p>b) {1/5} × 360 = 360 ÷ 5 = 72 € <i>(1 point)</i></p><p>c) 360 − 135 − 72 = 153 €. Fraction : 1 − {3/8} − {1/5} = {40/40} − {15/40} − {8/40} = {17/40} (et {17/40} × 360 = 153). <i>(2 points)</i></p>`}
]}
};
/* calculs en chaîne « A = … » dans les explications du QCM (multiplier, inverse, diviser ; outil défini dans 4e-1.js) */
CH["4e-14"].quiz.forEach((N,ni)=>{ if(ni===1) return; Object.entries(N.q).forEach(([l,list])=>{ if(ni===2 && l==="3") return; list.forEach((it,i)=>{ if(it.g){ const g=it.g; list[i]={g:()=>window.CHN4.qChain(g())}; } else list[i]=window.CHN4.qChain(it); }); }); });
})();
