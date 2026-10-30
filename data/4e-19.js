/* 4e — Chapitre 19 : Puissances de 10 et notation scientifique
   Sources de M. Staal (dossier « 18 - Puissance 2 - Préfixes et notation scientifiques ») : cours « Puissances 1 – Définition (suite) »,
   feuille d'exercices et feuille de corrections (période de confinement), consignes de la semaine.
   Les exercices du livre Myriade (ex. 2, 6, 7 p. 92) sont reconstitués d'après la feuille de corrections.
   Remarque : ces documents ne contiennent pas de partie sur la notation scientifique (voir le rapport). */
(function(){
const VF=["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const r9=x=>Math.round(x*1e10)/1e10;
/* écriture française, décimales groupées par 3 : 0,000 001 · 1 000 000 */
const F=x=>{ const r=Number(Number(x).toPrecision(15)); let s=Math.abs(r).toString(); if(/e/.test(s)) s=Math.abs(r).toFixed(15).replace(/\.?0+$/,""); const [i,d]=s.split(".");
  return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d.replace(/(\d{3})(?=\d)/g,"$1 "):""); };
const P=x=>x<0?`(${F(x)})`:F(x);
const pw=(a,n)=>`${P(a)}<sup>${F(n)}</sup>`;
/* exposant en caractères (pour l'intérieur des fractions {a/b}) */
const U=n=>String(n).replace(/-|−/g,"⁻").replace(/\d/g,d=>"⁰¹²³⁴⁵⁶⁷⁸⁹"[d]);
const PU=(a,n)=>`${a<0?`(${F(a)})`:F(a)}${U(n)}`;
const fr=(a,b)=>`{${a}/${b}}`;
const dev=(a,n)=>Array(n).fill(P(a)).join(" × ");
/* 10 exposant n en écriture décimale (n entier relatif) */
const dec10=n=>n>=0?F(10**n):"0,"+("0".repeat(-n-1)+"1").replace(/(\d{3})(?=\d)/g,"$1 ");
const cols=arr=>`<div class="calcs">${arr.map(x=>`<span${x.replace(/<[^>]+>/g,"").length>30?' style="white-space:normal"':""}>${x}</span>`).join("")}</div>`;
const tabH=(head,rows)=>`<div class="scroll"><table class="std"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const ETC=["#fcd5b4","#d9c8ee","#fbd3e3","#c6e6a8","#fde59a","#bfe6f5","#c9daf2","#e2efb3"];
const jetons=list=>`<div class="figs" style="gap:10px">${list.map((t,i)=>`<span style="display:inline-block;padding:8px 14px;border-radius:8px;background:${ETC[i%ETC.length]};color:#1a1a1a;font-weight:600;font-size:18px">${t}</span>`).join("")}</div>`;
const gcd=(a,b)=>b?gcd(b,a%b):a;

/* tableau des préfixes (une colonne par rang, même sans nom) */
const PRE=[["G","Giga"],["",""],["",""],["M","Méga"],["",""],["",""],["k","kilo"],["h","hecto"],["da","déca"],["","unité"],["d","déci"],["c","centi"],["m","milli"],["",""],["",""],["μ","micro"],["",""],["",""],["n","nano"]];
const tabPre=(u)=>`<div class="scroll"><table class="std"><thead><tr>${PRE.map(([s,n])=>`<th style="text-align:center;padding:6px 4px">${n==="unité"?`<b>${u||"UNITÉ"}</b>`:s?`<b>${s}${u||""}</b>`:""}</th>`).join("")}</tr></thead><tbody><tr>${PRE.map(([s,n])=>`<td style="text-align:center;font-size:13px;padding:6px 4px">${n==="unité"?"":n}</td>`).join("")}</tr></tbody></table></div>`;

/* calculs en chaîne « A = … » (outils définis dans 4e-1.js) */
const {chn,chns,qChain}=window.CHN4;
/* outils réutilisés par la fiche d'entraînement */
window.PUI19={F,P,pw,U,PU,fr,dev,dec10,cols,tabH,jetons,gcd,tabPre};

/* ===================== schémas (rappels) ===================== */
const S_NEG=sch("Puissance d'exposant négatif",`<p class="calc">A = 2<sup>−3</sup><br>A = ${fr(1,"2³")}<br>A = ${fr(1,"2 × 2 × 2")}<br>A = ${fr(1,8)}</p><p class="schN">a<sup>−n</sup> est l'inverse de a<sup>n</sup>.</p>`);
const S_10=sch("Puissances de 10 négatives",`<p class="calc">A = 10<sup>−3</sup><br>A = ${fr(1,"10³")}<br>A = ${fr(1,"1 000")}<br>A = 0,001 &nbsp; <span style="color:var(--muted)">3 zéros</span></p>`);
const S_PRE=sch("Les 4 préfixes à connaître",`<p class="calc">1 Gm = 10<sup>9</sup> m · 1 Mm = 10<sup>6</sup> m<br>1 μm = 10<sup>−6</sup> m · 1 nm = 10<sup>−9</sup> m</p><p class="schN">G (giga), M (méga), μ (micro), n (nano).</p>`);

CH["4e-19"]={
intro:"Calculer des puissances d'exposant négatif, écrire les puissances de 10 sous forme décimale, et utiliser les préfixes scientifiques giga, méga, micro et nano.",
savoir:[
  "calculer une puissance d'exposant positif (rappels) ;",
  "écrire une puissance d'exposant négatif sous la forme d'un quotient : a<sup>−n</sup> = {1/aⁿ} ;",
  "écrire une puissance de 10 d'exposant négatif sous la forme d'un nombre décimal, et inversement ;",
  "connaître les préfixes giga (G), méga (M), micro (μ) et nano (n) ;",
  "convertir une mesure en utilisant les préfixes et les puissances de 10."
],

/* ===================== COURS ===================== */
cours:[
{k:"1", t:"Puissances négatives d'un nombre", h:`
  <p><b>a</b> désigne un nombre relatif non nul et <b>n</b> est un entier positif non nul.</p>
  <div class="retenir" data-l="Définition"><p><b>a<sup>−n</sup></b> désigne l'<b>inverse</b> de <b>a<sup>n</sup></b> :</p><p class="calc">a<sup>−n</sup> = ${fr(1,"aⁿ")}</p></div>
  <p><b>Exemples :</b> donne le résultat sous la forme d'un quotient.</p>
  ${chns([["A",[`2<sup>−3</sup>`,`${fr(1,"2³")}`,`${fr(1,"2 × 2 × 2")}`,`${fr(1,8)}`]]])}
  ${chns([["B",[`(−5)<sup>−2</sup>`,`${fr(1,"(−5)²")}`,`${fr(1,"(−5) × (−5)")}`,`${fr(1,25)}`]]])}
  ${chns([["C",[`(−4)<sup>−1</sup>`,`${fr(1,"(−4)¹")}`,`${fr(1,"−4")}`,`−${fr(1,4)}`]]])}`},
{k:"2", t:"Cas particulier : les puissances de 10", h:`
  <div class="retenir" data-l="Propriété"><p class="calc">10<sup>−n</sup> = ${fr(1,"10ⁿ")} = ${fr(1,"10…0")} = 0,0…01</p><p>Le nombre 10…0 s'écrit avec <b>n zéros</b>, et 0,0…01 s'écrit aussi avec <b>n zéros</b> (en comptant le zéro avant la virgule).</p></div>
  <p><b>Exemples :</b> donne le résultat sous la forme d'un nombre décimal.</p>
  ${chns([["A",[`10<sup>−3</sup>`,`${fr(1,"10³")}`,`${fr(1,"1 000")}`,`0,001 &nbsp; (3 zéros)`]]])}
  ${chns([["B",[`10<sup>−7</sup>`,`0,000 000 1 &nbsp; (7 zéros)`]]])}
  <div class="retenir" data-l="Rappel"><p>10<sup>n</sup> = 10…0 : un 1 suivi de n zéros. Par exemple, 10<sup>6</sup> = 1 000 000.</p></div>`},
{k:"3", t:"Les préfixes scientifiques", h:`
  <p>Pour simplifier l'écriture des très grands et des très petits nombres, on utilise des <b>préfixes scientifiques</b>. Dans un tableau, ils sont rangés dans cet ordre (chaque colonne correspond à un rang, même si elle n'a pas de nom) :</p>
  ${tabPre("m")}
  <p>Tu connais déjà kilo, hecto, déca, déci, centi et milli. Quatre préfixes sont nouveaux : <b>giga (G)</b>, <b>méga (M)</b>, <b>micro (μ)</b> et <b>nano (n)</b>.</p>
  <div class="retenir" data-l="À retenir"><p>Avec le mètre comme unité :</p><p class="calc">1 Gm = 10<sup>9</sup> m = 1 000 000 000 m<br>1 Mm = 10<sup>6</sup> m = 1 000 000 m<br>1 μm = 10<sup>−6</sup> m = 0,000 001 m<br>1 nm = 10<sup>−9</sup> m = 0,000 000 001 m</p><p>Ces 4 conversions sont à connaître par cœur.</p></div>
  ${tabH(["Préfixe","Gm","Mm","km","hm","dam","m","dm","cm","mm","μm","nm"],[["en m","10<sup>9</sup>","10<sup>6</sup>","10<sup>3</sup>","10<sup>2</sup>","10<sup>1</sup>","1","10<sup>−1</sup>","10<sup>−2</sup>","10<sup>−3</sup>","10<sup>−6</sup>","10<sup>−9</sup>"]])}
  <p><b>Exemple :</b> la distance entre la Terre et le Soleil est d'environ 149 600 000 000 m, c'est-à-dire <b>149,6 Gm</b>.</p>
  <p>Les mêmes préfixes s'utilisent avec le gramme (g) ou l'octet (o) : 1 Go = 10<sup>9</sup> octets.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Rappels : les puissances d'exposant positif", e:[
  {n:"Exercice 1", t:"La contamination", w:"Sur ton cahier", h:`<p>Sans gestes barrières, une personne contaminée par le Covid-19 contamine 3 personnes.</p><p>Imaginons que le jour 1, une personne soit malade.</p><p>Le jour 2, cette personne contamine 3 personnes.</p><p>Le jour 3, ces 3 personnes contaminent chacune 3 nouvelles personnes. Et ainsi de suite.</p><p>Sans gestes barrières, combien de nouvelles personnes seront contaminées le 10<sup>e</sup> jour ?</p>`,
   c:`<p><b>Méthode 1 :</b> on multiplie par 3 chaque jour.</p><p class="calc">Jour 2 : 3 · jour 3 : 3 × 3 = 9 · jour 4 : 9 × 3 = 27 · jour 5 : 81 · jour 6 : 243<br>jour 7 : 729 · jour 8 : 2 187 · jour 9 : 6 561 · jour 10 : 6 561 × 3 = 19 683</p>
   <p><b>Méthode 2 :</b> avec les puissances. Jour 1 : 1 = 3<sup>0</sup> ; jour 2 : 3 = 3<sup>1</sup> ; jour 3 : 9 = 3<sup>2</sup>. L'exposant vaut le numéro du jour moins 1.</p><p class="calc">Jour 10 : 3<sup>9</sup> = 19 683</p><p>Sans gestes barrières, <b>19 683 nouvelles personnes</b> seront contaminées le 10<sup>e</sup> jour. Il est donc important de bien respecter les gestes barrières.</p>`},
  {n:"Exercice 2", t:"Écrire sous forme d'une puissance", w:"Sur ton cahier", h:`<p>Écris chaque produit sous la forme d'une puissance.</p>${cols(["a) 2 × 2 × 2 × 2","b) 3 × 3 × 3 × 3 × 3","c) 4 × 4 × 4 × 4 × 4 × 4","d) 5 × 5 × 5 × 5 × 5 × 5 × 5"])}`,
   c:cols(["a) 2 × 2 × 2 × 2 = 2<sup>4</sup>","b) 3 × 3 × 3 × 3 × 3 = 3<sup>5</sup>","c) 4 × 4 × 4 × 4 × 4 × 4 = 4<sup>6</sup>","d) 5 × 5 × 5 × 5 × 5 × 5 × 5 = 5<sup>7</sup>"])},
  {n:"Exercice 3", t:"Calculer des puissances", w:"Sur ton cahier", h:`<p>Calcule.</p>${cols(["A = 2<sup>2</sup>","B = 2<sup>4</sup>","C = 2<sup>6</sup>","D = 3<sup>2</sup>","E = 3<sup>3</sup>","F = 3<sup>4</sup>","G = 10<sup>2</sup>","H = 10<sup>6</sup>","I = 10<sup>9</sup>","J = (−5)<sup>1</sup>","K = (−5)<sup>2</sup>","L = (−5)<sup>3</sup>"])}`,
   c:`${chns([["A",[`2<sup>2</sup>`,`2 × 2`,`4`]],["B",[`2<sup>4</sup>`,`2 × 2 × 2 × 2`,`16`]],["C",[`2<sup>6</sup>`,`2 × 2 × 2 × 2 × 2 × 2`,`64`]],["D",[`3<sup>2</sup>`,`3 × 3`,`9`]],["E",[`3<sup>3</sup>`,`3 × 3 × 3`,`27`]],["F",[`3<sup>4</sup>`,`3 × 3 × 3 × 3`,`81`]],["G",[`10<sup>2</sup>`,`100`]],["H",[`10<sup>6</sup>`,`1 000 000`]],["I",[`10<sup>9</sup>`,`1 000 000 000`]],["J",[`(−5)<sup>1</sup>`,`−5`]],["K",[`(−5)<sup>2</sup>`,`(−5) × (−5)`,`25`]],["L",[`(−5)<sup>3</sup>`,`(−5) × (−5) × (−5)`,`−125`]]])}`}
 ]},
{t:"Les puissances négatives", e:[
  {n:"Exercice 4", t:"Écrire avec un exposant négatif", w:"Sur ton cahier", h:`<p>Écris chaque quotient sous la forme d'une puissance d'exposant négatif.</p>${cols([`A = ${fr(1,"9 × 9")}`,`B = ${fr(1,"7 × 7 × 7")}`,`C = ${fr(1,"3 × 3 × 3 × 3")}`,`D = ${fr(1,"6 × 6 × 6 × 6 × 6")}`])}`,
   c:chns([["A",[`${fr(1,"9 × 9")}`,`${fr(1,"9²")}`,`9<sup>−2</sup>`]],["B",[`${fr(1,"7 × 7 × 7")}`,`${fr(1,"7³")}`,`7<sup>−3</sup>`]],["C",[`${fr(1,"3 × 3 × 3 × 3")}`,`${fr(1,"3⁴")}`,`3<sup>−4</sup>`]],["D",[`${fr(1,"6 × 6 × 6 × 6 × 6")}`,`${fr(1,"6⁵")}`,`6<sup>−5</sup>`]]])},
  {n:"Exercice 5", t:"Les puissances négatives", w:"Sur ton cahier", h:`<p><b>Partie 1 :</b> complète les pointillés.</p><div class="calcs"><p class="calc" data-steps="1">A = 3<sup>−2</sup><br>A = ${fr(1,"3…")}<br>A = ${fr(1,"……")}<br>A = ${fr(1,"……")}</p><p class="calc" data-steps="1">B = 2<sup>−4</sup><br>B = ${fr(1,"2…")}<br>B = ${fr(1,"……")}<br>B = ${fr(1,"……")}</p></div>
   <p><b>Partie 2 :</b> écris chaque puissance sous la forme d'une fraction simplifiée.</p>${cols(["C = 3<sup>−3</sup>","D = 10<sup>−2</sup>","E = 6<sup>−1</sup>","F = (−2)<sup>−3</sup>","G = (−4)<sup>−2</sup>"])}
   <p><b>Partie 3 :</b> donne le résultat sous la forme d'un nombre décimal ou d'un quotient.</p>${cols(["H = 2<sup>3</sup>","I = 6<sup>−2</sup>","J = 10<sup>4</sup>","K = (−7)<sup>−2</sup>","L = (−5)<sup>0</sup>","M = 9<sup>−1</sup>"])}`,
   c:`<p><b>Partie 1 :</b></p>${chns([["A",[`3<sup>−2</sup>`,`${fr(1,"3²")}`,`${fr(1,"3 × 3")}`,`${fr(1,9)}`]],["B",[`2<sup>−4</sup>`,`${fr(1,"2⁴")}`,`${fr(1,"2 × 2 × 2 × 2")}`,`${fr(1,16)}`]]])}
   <p><b>Partie 2 :</b></p>${chns([["C",[`3<sup>−3</sup>`,`${fr(1,"3³")}`,`${fr(1,"3 × 3 × 3")}`,`${fr(1,27)}`]],["D",[`10<sup>−2</sup>`,`${fr(1,"10²")}`,`${fr(1,"10 × 10")}`,`${fr(1,100)}`]],["E",[`6<sup>−1</sup>`,`${fr(1,"6¹")}`,`${fr(1,6)}`]],["F",[`(−2)<sup>−3</sup>`,`${fr(1,"(−2)³")}`,`${fr(1,"(−2) × (−2) × (−2)")}`,`${fr(1,"−8")}`,`−${fr(1,8)}`]],["G",[`(−4)<sup>−2</sup>`,`${fr(1,"(−4)²")}`,`${fr(1,"(−4) × (−4)")}`,`${fr(1,16)}`]]])}
   <p><b>Partie 3 :</b></p>${chns([["H",[`2<sup>3</sup>`,`2 × 2 × 2`,`8`]],["I",[`6<sup>−2</sup>`,`${fr(1,"6²")}`,`${fr(1,"6 × 6")}`,`${fr(1,36)}`]],["J",[`10<sup>4</sup>`,`10 000`]],["K",[`(−7)<sup>−2</sup>`,`${fr(1,"(−7)²")}`,`${fr(1,"(−7) × (−7)")}`,`${fr(1,49)}`]],["L",[`(−5)<sup>0</sup>`,`1`]],["M",[`9<sup>−1</sup>`,`${fr(1,"9¹")}`,`${fr(1,9)}`]]])}`}
 ]},
{t:"Les puissances de 10 négatives", e:[
  {n:"Exercice 6", t:"Les puissances de 10", w:"Sur ton cahier", h:`<p><b>Partie 1 :</b> donne le résultat sous la forme d'un nombre décimal.</p>${cols(["A = 10<sup>−2</sup>","B = 10<sup>−5</sup>","C = 10<sup>−10</sup>","D = 10<sup>3</sup>","E = 10<sup>6</sup>"])}
   <p><b>Partie 2 :</b> sur chaque jeton est inscrit un nombre décimal. Associe les jetons par paire (deux jetons égaux).</p>${jetons(["10<sup>−6</sup>","0,001",fr(1,"10²"),"0,000 000 001","10<sup>−3</sup>","0,000 1","10<sup>7</sup>","1 000 000 000","10<sup>−4</sup>","10<sup>9</sup>","10<sup>−9</sup>","10 000 000","0,000 001","10<sup>−2</sup>"])}`,
   c:`<p><b>Partie 1 :</b></p>${chns([["A",[`10<sup>−2</sup>`,`${fr(1,"10²")}`,`${fr(1,"100")}`,`0,01 &nbsp; (2 zéros)`]],["B",[`10<sup>−5</sup>`,`0,000 01 &nbsp; (5 zéros)`]],["C",[`10<sup>−10</sup>`,`0,000 000 000 1 &nbsp; (10 zéros)`]],["D",[`10<sup>3</sup>`,`1 000 &nbsp; (un 1 suivi de 3 zéros)`]],["E",[`10<sup>6</sup>`,`1 000 000 &nbsp; (un 1 suivi de 6 zéros)`]]])}
   <p><b>Partie 2 :</b></p><p class="calc">10<sup>9</sup> = 1 000 000 000<br>10<sup>7</sup> = 10 000 000<br>10<sup>−2</sup> = ${fr(1,"10²")}<br>10<sup>−3</sup> = 0,001<br>10<sup>−4</sup> = 0,000 1<br>10<sup>−6</sup> = 0,000 001<br>10<sup>−9</sup> = 0,000 000 001</p>`}
 ]},
{t:"Les préfixes scientifiques", e:[
  {n:"Activité 1", t:"Découverte des préfixes scientifiques", w:"Sur ton cahier", h:`<p>Voici quelques informations :</p><ul><li>La distance entre la Terre et le Soleil est d'environ 149 600 000 000 mètres.</li><li>La distance entre la Terre et la Lune est de 384 400 000 mètres.</li><li>La distance entre Les Sables-d'Olonne et Strasbourg est de 942 000 mètres.</li><li>La hauteur de la tour Eiffel est de 324 mètres.</li><li>La taille d'une fourmi est de 0,007 mètre.</li><li>Le diamètre d'un cheveu est de 0,000 005 mètre.</li><li>La taille du virus de la grippe est de 0,000 000 1 mètre.</li></ul>
   <p>Pour simplifier ces nombres qui ont beaucoup de chiffres, on a créé des <b>préfixes scientifiques</b>. Avec le mètre comme unité, on a le tableau suivant :</p>${tabPre("m")}
   <p><b>1) a)</b> Complète : 1 km = 1 000 m ; 1 hm = … m ; 1 dam = … m ; 1 dm = … m ; 1 cm = … m ; 1 mm = … m.</p><p><b>b)</b> En t'aidant du tableau, complète : 1 Gm = … m ; 1 Mm = … m ; 1 μm = … m ; 1 nm = … m.</p>
   <p><b>2)</b> Utilise les puissances de 10 pour écrire ces conversions plus simplement : 1 Gm = … m ; 1 Mm = … m ; 1 km = 10<sup>3</sup> m ; 1 hm = … m ; 1 dam = … m ; 1 dm = … m ; 1 cm = … m ; 1 mm = … m ; 1 μm = … m ; 1 nm = … m.</p>
   <p><b>3)</b> Choisis une unité adaptée pour chaque information.</p><p>Exemple : 149 600 000 000 m = 149,6 Gm.</p>
   ${tabH(["","","Gm","","","Mm","","","km","hm","dam","m"],[["1","4","9","6","0","0","0","0","0","0","0","0"]])}<p>Dans le tableau, on voit que 149 600 000 000 m = 149,6 Gm : cette unité est plus adaptée.</p>`,
   c:`<p><b>1) a)</b> 1 hm = 100 m ; 1 dam = 10 m ; 1 dm = 0,1 m ; 1 cm = 0,01 m ; 1 mm = 0,001 m.</p><p><b>b)</b> 1 Gm = 1 000 000 000 m ; 1 Mm = 1 000 000 m ; 1 μm = 0,000 001 m ; 1 nm = 0,000 000 001 m.</p>
   <p><b>2)</b></p>${tabH(["1 Gm","1 Mm","1 km","1 hm","1 dam","1 dm","1 cm","1 mm","1 μm","1 nm"],[["10<sup>9</sup> m","10<sup>6</sup> m","10<sup>3</sup> m","10<sup>2</sup> m","10<sup>1</sup> m","10<sup>−1</sup> m","10<sup>−2</sup> m","10<sup>−3</sup> m","10<sup>−6</sup> m","10<sup>−9</sup> m"]])}<p>Les 4 nouvelles conversions (Gm, Mm, μm, nm) sont à connaître par cœur.</p>
   <p><b>3)</b></p><p class="calc">Terre – Lune : 384 400 000 m = 384,4 Mm<br>Les Sables-d'Olonne – Strasbourg : 942 000 m = 942 km<br>Tour Eiffel : 324 m (déjà dans une unité adaptée)<br>Fourmi : 0,007 m = 7 mm<br>Cheveu : 0,000 005 m = 5 μm<br>Virus de la grippe : 0,000 000 1 m = 100 nm (ou 0,1 μm)</p>`},
  {n:"Exercice 7", t:"Des conversions", w:"Sur ton cahier", h:`<p>En t'aidant du tableau des préfixes, complète les conversions.</p><p><b>a)</b> Consommation d'Internet disponible sur mon téléphone portable : 50 Go (gigaoctets) = … o (octets).</p><p><b>b)</b> Diamètre d'un fil de toile d'araignée : 6 690 nm = … mm.</p><p><b>c)</b> Masse record d'une baleine bleue : 177 000 kg = … Mg.</p><p><b>d)</b> Masse d'un moustique : 0,000 001 5 kg = … mg.</p><p><b>e)</b> Taille d'un acarien : 0,012 5 mm = … μm.</p>`,
   c:`<p class="calc">a) 50 Go = 50 × 10<sup>9</sup> o = 50 000 000 000 o<br>b) 1 mm = 1 000 000 nm, donc 6 690 nm = 0,006 69 mm<br>c) 1 Mg = 1 000 kg, donc 177 000 kg = 177 Mg<br>d) 1 kg = 1 000 000 mg, donc 0,000 001 5 kg = 1,5 mg<br>e) 1 mm = 1 000 μm, donc 0,012 5 mm = 12,5 μm</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Puissances d'exposant positif", schema:sch("Rappel",`<p class="calc">3<sup>4</sup> = 3 × 3 × 3 × 3 = 81 · (−5)<sup>3</sup> = −125 · a<sup>0</sup> = 1</p>`), q:{
 1:[ {g:()=>{ const a=ri(2,6), n=ri(2,4); return {q:`Calcule : ${a}<sup>${n}</sup>`, rep:[F(a**n)], ex:`${a}<sup>${n}</sup> = ${dev(a,n)} = ${F(a**n)}.`}; }} ],
 2:[ {g:()=>{ const a=-ri(2,5), n=ri(2,3); return {q:`Calcule : ${pw(a,n)}`, rep:[F(a**n)], ex:`${pw(a,n)} = ${dev(a,n)} = ${F(a**n)}.`}; }} ],
 3:[ {g:()=>{ const k=pick([2,3,4]), d=ri(4,9); return {q:`Le jour 1, une personne est malade. Chaque jour, chaque nouvelle personne contaminée en contamine ${k}. Combien de nouvelles personnes sont contaminées le jour ${d} ?`, rep:[F(k**(d-1))], ex:`Jour ${d} : ${k}<sup>${d-1}</sup> = ${F(k**(d-1))} (l'exposant est le numéro du jour moins 1).`}; }} ]
}},
{nom:"Puissances d'exposant négatif", schema:S_NEG, q:{
 1:[ {g:()=>{ const a=ri(2,12); const good=fr(1,a); return {q:`À quoi est égal ${a}<sup>−1</sup> ?`, c:shuf(uniq(good,[`−${a}`,fr(-1,a),String(a)])).map(x=>x.replace("{-1/","−{1/")), rep:good, ex:`${a}<sup>−1</sup> = ${fr(1,`${a}¹`)} = ${fr(1,a)} : c'est l'inverse de ${a}.`, sx:S_NEG}; }} ],
 2:[ {g:()=>{ const a=ri(2,5), n=ri(2,3); const v=a**n, good=fr(1,v); return {q:`Écris ${a}<sup>−${n}</sup> sous la forme d'une fraction.`, c:shuf(uniq(good,[`−${F(v)}`,`−${fr(1,v)}`,fr(1,a*n)])), rep:good, ex:`${a}<sup>−${n}</sup> = ${fr(1,PU(a,n))} = ${fr(1,dev(a,n))} = ${fr(1,v)}.`, sx:S_NEG}; }} ],
 3:[ {g:()=>{ const a=-ri(2,4), n=ri(2,3); const v=a**n, good=v<0?`−${fr(1,-v)}`:fr(1,v); return {q:`Écris ${pw(a,-n)} sous la forme d'une fraction.`, c:shuf(uniq(good,[v<0?fr(1,-v):`−${fr(1,v)}`,F(v),fr(1,Math.abs(a)*n)])), rep:good, ex:`${pw(a,-n)} = ${fr(1,PU(a,n))} = ${fr(1,dev(a,n))} = ${good}.`, sx:S_NEG}; }} ]
}},
{nom:"Puissances de 10", schema:S_10, q:{
 1:[ {g:()=>{ const n=-ri(1,6); return {q:`Écris 10<sup>${F(n)}</sup> sous la forme d'un nombre décimal.`, rep:[dec10(n)], ex:`10<sup>${F(n)}</sup> = ${fr(1,PU(10,-n))} = ${dec10(n)} (${-n} zéro${-n>1?"s":""}).`, sx:S_10}; }} ],
 2:[ {g:()=>{ const n=-ri(2,9); const good=`10<sup>${F(n)}</sup>`; return {q:`Écris ${dec10(n)} sous la forme d'une puissance de 10.`, c:shuf(uniq(good,[`10<sup>${F(n+1)}</sup>`,`10<sup>${F(n-1)}</sup>`,`10<sup>${-n}</sup>`])), rep:good, ex:`${dec10(n)} s'écrit avec ${-n} zéros (en comptant celui avant la virgule) : c'est 10<sup>${F(n)}</sup>.`, sx:S_10}; }} ],
 3:[ {g:()=>{ const n=ri(2,6); const good=`10<sup>−${n}</sup>`; return {q:`À quoi est égal ${fr(1,F(10**n))} ?`, c:shuf(uniq(good,[`10<sup>${n}</sup>`,`10<sup>−${n+1}</sup>`,`−10<sup>${n}</sup>`])), rep:good, ex:`${fr(1,F(10**n))} = ${fr(1,PU(10,n))} = 10<sup>−${n}</sup> = ${dec10(-n)}.`, sx:S_10}; }},
     {q:"Vrai ou faux : 10<sup>−3</sup> est un nombre négatif.", c:VF, rep:"Faux", ex:"10<sup>−3</sup> = 0,001 : c'est un nombre positif (l'inverse de 1 000).", sx:S_10} ]
}},
{nom:"Les préfixes scientifiques", schema:S_PRE, q:{
 1:[ {g:()=>{ const L=[["km",3],["hm",2],["dam",1],["dm",-1],["cm",-2],["mm",-3]]; const [u,e]=pick(L); const good=`10<sup>${F(e)}</sup> m`; return {q:`1 ${u} = ?`, c:shuf(uniq(good,[`10<sup>${F(-e)}</sup> m`,`10<sup>${F(e+1)}</sup> m`,`10<sup>${F(e-1)}</sup> m`])), rep:good, ex:`1 ${u} = ${dec10(e)} m = 10<sup>${F(e)}</sup> m.`, sx:S_PRE}; }} ],
 2:[ {g:()=>{ const L=[["Gm",9,"giga"],["Mm",6,"méga"],["μm",-6,"micro"],["nm",-9,"nano"]]; const [u,e,n]=pick(L); const good=`10<sup>${F(e)}</sup> m`; return {q:`1 ${u} (${n}mètre) = ?`, c:shuf(uniq(good,[`10<sup>${F(-e)}</sup> m`,`10<sup>${F(e>0?e-3:e+3)}</sup> m`,`10<sup>${F(e>0?e+3:e-3)}</sup> m`])), rep:good, ex:`À connaître : 1 ${u} = 10<sup>${F(e)}</sup> m = ${dec10(e)} m.`, sx:S_PRE}; }} ],
 3:[ {g:()=>{ const T=[()=>{ const x=ri(11,999)/10; return [`${F(x)} Mm`,"km",x*1000]; },()=>{ const x=ri(11,999)*10; return [`${F(x)} nm`,"μm",x/1000]; },()=>{ const x=ri(2,90)/10; return [`${F(x)} Go`,"Mo",x*1000]; },()=>{ const x=ri(11,999)/100; return [`${F(x)} mm`,"μm",x*1000]; }];
       const [a,u,v]=pick(T)(); return {q:`Convertis : ${a} = … ${u}`, rep:[F(v)], ex:`${a} = ${F(v)} ${u} (1 000 fois ${/Mm|Go|mm/.test(a)?"plus":"moins"} d'unités : on ${/Mm|Go|mm/.test(a)?"multiplie":"divise"} par 1 000).`, sx:S_PRE}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 19", duree:45, info:"Durée : 45 min · Calculatrice non autorisée · Stylo et crayon",
comp:[
  ["CALCULER","Je calcule une puissance d'exposant positif.","Ex. 1 (3 points)"],
  ["CALCULER","Je calcule une puissance d'exposant négatif.","Ex. 2 (4 points)"],
  ["CONNAÎTRE","Je passe d'une puissance de 10 à son écriture décimale, et inversement.","Ex. 3 (4 points)"],
  ["CONNAÎTRE","Je connais les préfixes G, M, μ et n, et je fais des conversions.","Ex. 4 (5 points)"],
  ["MODÉLISER","Je résous un problème à l'aide des puissances.","Ex. 5 (4 points)"]
],
exos:[
{t:"Puissances d'exposant positif", p:3, h:`<p>Calcule.</p>${cols(["A = 3<sup>4</sup>","B = (−2)<sup>5</sup>","C = 10<sup>7</sup>","D = 7<sup>0</sup>","E = (−1)<sup>9</sup>","F = 6<sup>1</sup>"])}`,
 c:`${chns([["A",[`3<sup>4</sup>`,`3 × 3 × 3 × 3`,`81`]],["B",[`(−2)<sup>5</sup>`,`(−2) × (−2) × (−2) × (−2) × (−2)`,`−32`]],["C",[`10<sup>7</sup>`,`10 000 000 &nbsp; (un 1 suivi de 7 zéros)`]],["D",[`7<sup>0</sup>`,`1 &nbsp; (un nombre non nul à la puissance 0 est égal à 1)`]],["E",[`(−1)<sup>9</sup>`,`(−1) × (−1) × … × (−1)`,`−1 &nbsp; (9 facteurs négatifs : le résultat est négatif)`]],["F",[`6<sup>1</sup>`,`6`]]])}<p><i>(0,5 point par calcul)</i></p>`},
{t:"Puissances d'exposant négatif", p:4, h:`<p><b>1)</b> Écris chaque puissance sous la forme d'une fraction.</p>${cols(["A = 5<sup>−2</sup>","B = 2<sup>−5</sup>","C = 7<sup>−1</sup>","D = (−3)<sup>−3</sup>","E = (−2)<sup>−4</sup>","F = (−10)<sup>−2</sup>"])}<p><b>2)</b> Écris sous la forme d'une puissance d'exposant négatif.</p>${cols([`G = ${fr(1,"8 × 8")}`,`H = ${fr(1,"3 × 3 × 3 × 3 × 3")}`])}`,
 c:`<p><b>1)</b></p>${chns([["A",[`5<sup>−2</sup>`,`${fr(1,"5²")}`,`${fr(1,"5 × 5")}`,`${fr(1,25)}`]],["B",[`2<sup>−5</sup>`,`${fr(1,"2⁵")}`,`${fr(1,"2 × 2 × 2 × 2 × 2")}`,`${fr(1,32)}`]],["C",[`7<sup>−1</sup>`,`${fr(1,"7¹")}`,`${fr(1,7)}`]],["D",[`(−3)<sup>−3</sup>`,`${fr(1,"(−3)³")}`,`${fr(1,"(−3) × (−3) × (−3)")}`,`${fr(1,"−27")}`,`−${fr(1,27)}`]],["E",[`(−2)<sup>−4</sup>`,`${fr(1,"(−2)⁴")}`,`${fr(1,"(−2) × (−2) × (−2) × (−2)")}`,`${fr(1,16)}`]],["F",[`(−10)<sup>−2</sup>`,`${fr(1,"(−10)²")}`,`${fr(1,"(−10) × (−10)")}`,`${fr(1,100)}`]]])}<p><b>2)</b></p>${chns([["G",[`${fr(1,"8 × 8")}`,`${fr(1,"8²")}`,`8<sup>−2</sup>`]],["H",[`${fr(1,"3 × 3 × 3 × 3 × 3")}`,`${fr(1,"3⁵")}`,`3<sup>−5</sup>`]]])}<p><i>(0,5 point par réponse)</i></p>`},
{t:"Puissances de 10", p:4, h:`<p><b>1)</b> Écris sous la forme d'un nombre décimal.</p>${cols(["A = 10<sup>−3</sup>","B = 10<sup>−6</sup>","C = 10<sup>5</sup>","D = 10<sup>−1</sup>"])}<p><b>2)</b> Écris sous la forme d'une puissance de 10.</p>${cols(["E = 0,000 01","F = 1 000 000 000",`G = ${fr(1,"10 000")}`,"H = 0,01"])}`,
 c:`<p><b>1)</b></p>${chns([["A",[`10<sup>−3</sup>`,`${fr(1,"10³")}`,`${fr(1,"1 000")}`,`0,001 &nbsp; (3 zéros)`]],["B",[`10<sup>−6</sup>`,`0,000 001 &nbsp; (6 zéros)`]],["C",[`10<sup>5</sup>`,`100 000 &nbsp; (un 1 suivi de 5 zéros)`]],["D",[`10<sup>−1</sup>`,`${fr(1,"10")}`,`0,1 &nbsp; (1 zéro)`]]])}<p><b>2)</b></p>${chns([["E",["0,000 01","10<sup>−5</sup> &nbsp; (5 zéros)"]],["F",["1 000 000 000","10<sup>9</sup> &nbsp; (un 1 suivi de 9 zéros)"]],["G",[`${fr(1,"10 000")}`,`${fr(1,"10⁴")}`,"10<sup>−4</sup>"]],["H",["0,01","10<sup>−2</sup> &nbsp; (2 zéros)"]]])}<p><i>(0,5 point par réponse)</i></p>`},
{t:"Les préfixes", p:5, h:`<p><b>1)</b> Complète avec une puissance de 10.</p>${cols(["a) 1 Mm = … m","b) 1 nm = … m","c) 1 Gm = … m","d) 1 μm = … m"])}<p><b>2)</b> Complète les conversions.</p><p><b>a)</b> Une clé USB a une capacité de 2,5 Go = … o.</p><p><b>b)</b> Une bactérie mesure 4 500 nm = … μm.</p><p><b>c)</b> Un grain de sable mesure 0,008 m = … mm.</p>`,
 c:`<p class="calc">1) a) 10<sup>6</sup> m · b) 10<sup>−9</sup> m · c) 10<sup>9</sup> m · d) 10<sup>−6</sup> m</p><p><i>(0,5 point par réponse)</i></p><p class="calc">2) a) 2,5 Go = 2,5 × 10<sup>9</sup> o = 2 500 000 000 o<br>b) 1 μm = 1 000 nm, donc 4 500 nm = 4 500 ÷ 1 000 μm = 4,5 μm<br>c) 1 m = 1 000 mm, donc 0,008 m = 0,008 × 1 000 mm = 8 mm</p><p><i>(1 point par conversion)</i></p>`},
{t:"Une vidéo qui se partage", p:4, h:`<p>Le jour 1, Inès publie une vidéo. Le jour 2, 4 personnes la reçoivent.</p><p>Chaque jour, chaque personne qui a reçu la vidéo la veille l'envoie à 4 nouvelles personnes.</p><p><b>a)</b> Combien de nouvelles personnes reçoivent la vidéo le jour 3 ?</p><p><b>b)</b> Écris sous la forme d'une puissance de 4 le nombre de nouvelles personnes qui reçoivent la vidéo le jour 8, puis calcule ce nombre.</p><p><b>c)</b> L'écran du téléphone d'Inès est fait de pixels de 2 μm. Écris cette longueur en mètres, sous la forme d'un nombre décimal.</p>`,
 c:`<p>a) 4 × 4 = 4<sup>2</sup> = 16 nouvelles personnes. <i>(1 point)</i></p><p>b) Jour 2 : 4<sup>1</sup> ; jour 3 : 4<sup>2</sup> ; … ; jour 8 : 4<sup>7</sup> = 16 384 nouvelles personnes. <i>(1,5 point)</i></p><p>c) 2 μm = 2 × 10<sup>−6</sup> m = 0,000 002 m. <i>(1,5 point)</i></p>`}
]}
};

/* clavier texte pour les réponses tapées (pour pouvoir écrire le signe −)
   et calculs en chaîne « A = … » dans les explications (sauf les préfixes) */
CH["4e-19"].quiz.forEach((N,ni)=>Object.values(N.q).forEach(list=>list.forEach((it,i)=>{
  const f=o=>Object.assign(ni===3?o:qChain(o),{kb:"text"});
  if(it.g){ const g=it.g; list[i]={g:()=>f(g())}; } else list[i]=f(it);
})));
})();
