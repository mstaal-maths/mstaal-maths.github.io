/* 4e — Chapitre 5 : Les puissances (définition, priorités, problèmes)
   Cours, « Progression des exercices », feuille d'exercices (bandelettes), activités et correction du « quitte ou double » de M. Staal.
   Les corrections absentes des documents ont été calculées et vérifiées. */
(function(){
const VF=["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const r3=x=>Math.round(x*1e6)/1e6;
const F=x=>{ const r=r3(x); const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const P=x=>r3(x)<0?`(${F(x)})`:F(x);
/* a exposant n : parenthèses si a est négatif */
const pw=(a,n)=>`${P(a)}<sup>${n}</sup>`;
const dev=(a,n)=>n===0?"1":Array(n).fill(P(a)).join(" × ");
const cols=arr=>`<div class="calcs">${arr.map(x=>`<span${x.replace(/<[^>]+>/g,"").length>30?' style="white-space:normal"':""}>${x}</span>`).join("")}</div>`;
const tabH=(head,rows)=>`<div class="scroll"><table class="std"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const co=(p,alt,w)=>img("4k5co/"+p,alt,w), ex=(p,alt,w)=>img("4k5ex/"+p,alt,w);
const nz=(a,b)=>{ let v; do{ v=ri(a,b); }while(!v); return v; };

/* calculs en chaîne « A = … » (outils définis dans 4e-1.js) */
const {chn,chns,qChain}=window.CHN4;
/* outils réutilisés par la fiche d'entraînement */
window.PUI4={F,P,pw,dev,cols,tabH};

/* ===================== schémas (rappels) ===================== */
const S_DEF=sch("Définition d'une puissance",`${chn("A",["2<sup>5</sup>","2 × 2 × 2 × 2 × 2","32"])}<p class="schN">5 facteurs égaux à 2.</p><p class="schN">a<sup>0</sup> = 1 (a non nul) et a<sup>1</sup> = a.</p>`);
const S_NEG=sch("(−3)<sup>4</sup> ou −3<sup>4</sup> ?",`${chns([["A",["(−3)<sup>4</sup>","(−3) × (−3) × (−3) × (−3)","81"]],["B",["−3<sup>4</sup>","−(3 × 3 × 3 × 3)","−81"]]])}<p class="schN">Sans parenthèses, l'exposant ne porte que sur 3.</p>`);
const S_10=sch("Puissances de 10",`<p class="calc">10<sup>4</sup> = 10 000 &nbsp; <span style="color:var(--muted)">un 1 suivi de 4 zéros</span></p>`);
const S_PRIO=sch("Priorités opératoires",`<p class="schN">1. parenthèses · 2. puissances · 3. × et ÷ · 4. + et −</p>${chn("A",["4 − 8<sup>2</sup>","4 − 64","−60"])}`);
const S_PB=sch("Problèmes et puissances",`<p class="schN">Une quantité qui triple 5 fois de suite est multipliée par 3 × 3 × 3 × 3 × 3 = 3<sup>5</sup>.</p><p class="schN">Un code de 4 chiffres (de 0 à 9) : 10 × 10 × 10 × 10 = 10<sup>4</sup> codes.</p>`);

CH["4e-5"]={
intro:"Écrire un produit de facteurs égaux sous forme de puissance, calculer une puissance (même d'un nombre négatif), respecter les priorités et résoudre des problèmes.",
savoir:[
  "écrire un produit de facteurs égaux sous la forme d'une puissance, et inversement ;",
  "connaître les conventions a<sup>0</sup> = 1 et a<sup>1</sup> = a ;",
  "ne pas confondre (−3)<sup>4</sup> et −3<sup>4</sup> ;",
  "calculer une puissance de 10 ;",
  "calculer une expression avec des puissances en respectant les priorités ;",
  "résoudre un problème à l'aide des puissances."
],

/* ===================== COURS ===================== */
cours:[
{k:"1", t:"Définition", h:`
  <h4>a) Puissances d'un nombre quelconque</h4>
  <div class="retenir" data-l="Définition"><p><b>a</b> désigne un nombre relatif et <b>n</b> un entier positif non nul.</p><p><b>a<sup>n</sup></b> désigne le produit de <b>n</b> facteurs tous égaux à <b>a</b> :</p><p class="calc">a<sup>n</sup> = a × a × … × a &nbsp; (n facteurs)</p><ul><li>a<sup>n</sup> se lit « a exposant n » ;</li><li>a<sup>n</sup> est une puissance de a.</li></ul></div>
  <div class="retenir" data-l="Convention"><ul><li>Pour tout nombre a non nul, a<sup>0</sup> = 1.</li><li>Pour tout nombre a, a<sup>1</sup> = a.</li></ul></div>
  <p><b>Exemples :</b> décompose les puissances sous la forme d'un produit et calcule.</p>
  ${chns([["A",["2<sup>5</sup>","2 × 2 × 2 × 2 × 2","32"]],["B",["(−4)<sup>3</sup>","(−4) × (−4) × (−4)","−64"]],["C",["6<sup>0</sup>","1"]],["D",["8<sup>1</sup>","8"]]])}
  <div class="attention"><b>ATTENTION :</b> ne pas confondre (−3)<sup>4</sup> et −3<sup>4</sup> !</div>
  <div class="figs" style="gap:28px"><p class="calc">E = (−3)<sup>4</sup><br>E = (−3) × (−3) × (−3) × (−3)<br>E = 81</p><p class="calc">F = −3<sup>4</sup><br>F = −(3 × 3 × 3 × 3)<br>F = −81</p></div>
  <p>Dans E, l'exposant porte sur (−3). Dans F, il ne porte que sur 3 : on calcule 3<sup>4</sup> = 81, puis on prend l'opposé.</p>
  <h4>b) Cas particulier : puissances de 10</h4>
  <div class="retenir" data-l="Propriété"><p><b>n</b> est un entier positif non nul.</p><p class="calc">10<sup>n</sup> = 10…0 &nbsp; (un 1 suivi de n zéros)</p></div>
  <p><b>Exemples :</b> calcule.</p>${chns([["G",["10<sup>4</sup>","10 000"]],["H",["10<sup>9</sup>","1 000 000 000"]]])}`},
{k:"2", t:"Calculs et priorités opératoires", h:`
  <div class="retenir" data-l="Propriété"><p><b>Ordre des priorités :</b></p><p><b>1)</b> les calculs entre parenthèses (ou entre crochets) ;</p><p><b>2)</b> les puissances ;</p><p><b>3)</b> les multiplications et les divisions ;</p><p><b>4)</b> les additions et les soustractions.</p></div>
  <p><b>Exemples :</b> calcule.</p>
  <div class="figs" style="gap:28px"><p class="calc">A = 4 − 8<sup>2</sup><br>A = 4 − 64<br>A = −60</p><p class="calc">B = (−8 + 6)<sup>4</sup> × 3<br>B = (−2)<sup>4</sup> × 3<br>B = 16 × 3<br>B = 48</p></div>`},
{k:"3", t:"Problèmes en lien avec les puissances", h:`
  <div class="figs">${co("bambou.jpg","Cellules de bambou vues au microscope",220)}</div>
  <p>Léa observe, au microscope, une cellule de bambou. Toutes les deux heures, le nombre de cellules triple.</p>
  <p>Calcule le nombre de cellules obtenues au bout de : <b>a)</b> 4 h ; <b>b)</b> 10 h ; <b>c)</b> un jour.</p>
  <p><b>Correction :</b> toutes les 2 heures, on multiplie par 3.</p>
  <p class="calc">a) 4 h = 2 × 2 h : 3 × 3 = 3<sup>2</sup> = 9 cellules.<br>b) 10 h = 5 × 2 h : 3<sup>5</sup> = 243 cellules.<br>c) 1 jour = 24 h = 12 × 2 h : 3<sup>12</sup> = 531 441 cellules.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Définition", e:[
  {n:"Activité 1", t:"Population de bactéries", w:"Sur ton cahier", h:`<p>Un laboratoire effectue des recherches sur le développement d'une population de bactéries dans un milieu clos.</p><p>Les chercheurs observent que le nombre de bactéries triple toutes les heures.</p><p>À 0 heure, il y a 4 bactéries.</p><p>Détermine le nombre de bactéries au bout de 24 h.</p><p><i>Tu peux utiliser la calculatrice.</i></p>`,
   c:`<p>Au bout de 1 h : 4 × 3 = 12 bactéries. Au bout de 2 h : 4 × 3 × 3 = 36 bactéries.</p><p>Au bout de 24 h, on a multiplié 24 fois par 3 :</p><p class="calc">4 × 3 × 3 × … × 3 (24 facteurs 3) = 4 × 3<sup>24</sup> = 4 × 282 429 536 481 = 1 129 718 145 924</p><p>Il y a <b>1 129 718 145 924 bactéries</b> (plus de mille-milliards). Écrire 3<sup>24</sup> est bien plus court que d'écrire les 24 facteurs !</p>`},
  {n:"Exercice 1", t:"Vocabulaire", w:"Sur ta feuille", h:`<p><i>Sans calculatrice.</i></p><p><b>Partie 1 :</b> complète le tableau.</p>${tabH(["Produit","Notation puissance","Se lit"],[["5 × 5 × 5 × 5","",""],["8 × 8 × 8 × 8 × 8 × 8","",""],["","6<sup>3</sup>",""],["","","2 exposant 6"]])}
   <p><b>Partie 2 :</b> écris sous la forme d'un produit et calcule.</p>${cols(["A = 3<sup>4</sup>","B = 4<sup>3</sup>","C = 2<sup>5</sup>","D = (−2)<sup>4</sup>","E = −2<sup>4</sup>","F = (−2)<sup>3</sup>","G = −2<sup>3</sup>","H = (−5)<sup>2</sup>"])}`,
   c:`<p><b>Partie 1 :</b></p>${tabH(["Produit","Notation puissance","Se lit"],[["5 × 5 × 5 × 5","5<sup>4</sup>","5 exposant 4"],["8 × 8 × 8 × 8 × 8 × 8","8<sup>6</sup>","8 exposant 6"],["6 × 6 × 6","6<sup>3</sup>","6 exposant 3"],["2 × 2 × 2 × 2 × 2 × 2","2<sup>6</sup>","2 exposant 6"]])}
   <p><b>Partie 2 :</b></p>${chns([["A",["3<sup>4</sup>","3 × 3 × 3 × 3","81"]],["B",["4<sup>3</sup>","4 × 4 × 4","64"]],["C",["2<sup>5</sup>","2 × 2 × 2 × 2 × 2","32"]],["D",["(−2)<sup>4</sup>","(−2) × (−2) × (−2) × (−2)","16"]],["E",["−2<sup>4</sup>","−(2 × 2 × 2 × 2)","−16"]],["F",["(−2)<sup>3</sup>","(−2) × (−2) × (−2)","−8"]],["G",["−2<sup>3</sup>","−(2 × 2 × 2)","−8"]],["H",["(−5)<sup>2</sup>","(−5) × (−5)","25"]]])}`},
  {n:"Exercice 2", t:"Jeu du « quitte ou double »", w:"Sur ton cahier", h:`<p>Lors du jeu « Le quitte ou double », la première bonne réponse rapporte 1 €. Ensuite, chaque bonne réponse permet de doubler son gain.</p><p>Réponds aux questions en expliquant ta démarche.</p><p><b>1)</b> Gilles a répondu correctement à une série de sept questions. Quel est son gain ?</p><p><b>2)</b> Combien de bonnes réponses consécutives, au minimum, lui faudra-t-il pour gagner plus de 1 000 euros ?</p>`,
   c:`<p><b>1)</b> La première bonne réponse rapporte 1 €. Les 6 bonnes réponses suivantes doublent le gain 6 fois :</p><p class="calc">1 × 2 × 2 × 2 × 2 × 2 × 2 = 1 × 2<sup>6</sup> = 64</p>${tabH(["Bonnes réponses","1","2","3","4","5","6","7"],[["Gain (en €)","1","2","4","8","16","32","64"]])}<p>Gilles a gagné <b>64 €</b>.</p>
   <p><b>2)</b> On continue de doubler : 8 réponses → 128 € ; 9 → 256 € ; 10 → 512 € ; 11 → 1 024 €.</p><p>Il faut donc au moins <b>11 réponses consécutives</b> pour gagner plus de 1 000 € (2<sup>10</sup> = 1 024).</p>`}
 ]},
{t:"Calculs et priorités opératoires", e:[
  {n:"Activité 2", t:"Activité rapide", w:"Sur ton cahier", h:`<p>Recopie chaque calcul, puis calcule en tenant compte des priorités opératoires.</p>${cols(["A = 3 − 4<sup>2</sup>","B = 5<sup>0</sup>","C = (8 − 5)<sup>3</sup>","D = (−3 × 2)<sup>2</sup>","E = −2<sup>3</sup>","F = (10 × 5 − 7<sup>2</sup>)<sup>4</sup>"])}`,
   c:`<div class="figs" style="gap:28px"><p class="calc">A = 3 − 4<sup>2</sup><br>A = 3 − 16<br>A = −13</p><p class="calc">B = 5<sup>0</sup><br>B = 1</p><p class="calc">C = (8 − 5)<sup>3</sup><br>C = 3<sup>3</sup><br>C = 27</p><p class="calc">D = (−3 × 2)<sup>2</sup><br>D = (−6)<sup>2</sup><br>D = 36</p><p class="calc">E = −2<sup>3</sup><br>E = −8</p><p class="calc">F = (10 × 5 − 7<sup>2</sup>)<sup>4</sup><br>F = (50 − 49)<sup>4</sup><br>F = 1<sup>4</sup><br>F = 1</p></div>`},
  {n:"Exercice 3", t:"Priorités opératoires", w:"Sur ton cahier", h:`<p>Recopie chaque calcul, puis calcule en tenant compte des priorités opératoires.</p>${cols(["A = (3 − 5)<sup>2</sup>","B = 3 − 5<sup>2</sup>","C = (−2)<sup>3</sup> × 5","D = 7 × 3<sup>2</sup>","E = (−4 × 2)<sup>2</sup>","F = (−5 + 2)<sup>4</sup> − 9","G = (3 × 5 − 4<sup>2</sup>)<sup>3</sup>"])}`,
   c:`<div class="figs" style="gap:28px"><p class="calc">A = (3 − 5)<sup>2</sup><br>A = (−2)<sup>2</sup><br>A = 4</p><p class="calc">B = 3 − 5<sup>2</sup><br>B = 3 − 25<br>B = −22</p><p class="calc">C = (−2)<sup>3</sup> × 5<br>C = −8 × 5<br>C = −40</p><p class="calc">D = 7 × 3<sup>2</sup><br>D = 7 × 9<br>D = 63</p><p class="calc">E = (−4 × 2)<sup>2</sup><br>E = (−8)<sup>2</sup><br>E = 64</p><p class="calc">F = (−5 + 2)<sup>4</sup> − 9<br>F = (−3)<sup>4</sup> − 9<br>F = 81 − 9<br>F = 72</p><p class="calc">G = (3 × 5 − 4<sup>2</sup>)<sup>3</sup><br>G = (15 − 16)<sup>3</sup><br>G = (−1)<sup>3</sup><br>G = −1</p></div>`},
  {n:"Exercice 4", t:"Vrai ou faux ?", w:"Sur ton cahier", h:`<p>Pour chaque égalité, dis si elle est vraie ou fausse. Justifie.</p>${cols(["a. 1 + 3<sup>2</sup> = 16","b. 5 × 2<sup>3</sup> = 40","c. {5²/4} = {25/4}","d. (2 + 3)<sup>4</sup> = 2<sup>4</sup> + 3<sup>4</sup>"])}`,
   c:`<p><b>a. Faux :</b> la puissance passe avant l'addition. 1 + 3<sup>2</sup> = 1 + 9 = 10.</p><p><b>b. Vrai :</b> 5 × 2<sup>3</sup> = 5 × 8 = 40.</p><p><b>c. Vrai :</b> 5<sup>2</sup> = 25, donc {5²/4} = {25/4}.</p><p><b>d. Faux :</b> (2 + 3)<sup>4</sup> = 5<sup>4</sup> = 625, alors que 2<sup>4</sup> + 3<sup>4</sup> = 16 + 81 = 97.</p>`}
 ]},
{t:"Problèmes en lien avec les puissances", e:[
  {n:"Exercice 5", t:"La bactérie Escherichia coli", w:"Sur ton cahier", h:`<p>La bactérie Escherichia coli est une bactérie présente dans notre intestin.</p><p>À l'air libre, la croissance du nombre de ces bactéries est ralentie : la quantité double toutes les 4 h.</p><p>Une bactérie est mise en culture. Écris sous forme d'une puissance de 2, puis calcule le nombre de bactéries obtenues au bout de :</p><p><b>a)</b> 12 heures ; <b>b)</b> 1 jour ; <b>c)</b> 2 jours.</p>`,
   c:`<p>Toutes les 4 heures, le nombre de bactéries est multiplié par 2.</p><p class="calc">a) 12 h = 3 × 4 h : 2<sup>3</sup> = 8 bactéries.<br>b) 1 jour = 24 h = 6 × 4 h : 2<sup>6</sup> = 64 bactéries.<br>c) 2 jours = 48 h = 12 × 4 h : 2<sup>12</sup> = 4 096 bactéries.</p>`},
  {n:"Exercice 6", t:"La cellule", w:"Sur ton cahier", h:`<p>Léa observe au microscope, à midi, une cellule de bambou.</p><p>Au bout d'une heure, la cellule s'est divisée en deux : on a alors deux cellules.</p><p>Au bout de deux heures, ces deux cellules se sont divisées en deux : on a alors quatre cellules.</p><p>Léa note toutes les heures les résultats de son observation.</p><p>Écris sous forme d'une puissance de 2, puis calcule le nombre de cellules obtenues au bout de : <b>a)</b> 3 h ; <b>b)</b> 6 h ; <b>c)</b> un jour.</p>`,
   c:`<p>Chaque heure, le nombre de cellules est multiplié par 2.</p><p class="calc">a) 2<sup>3</sup> = 8 cellules.<br>b) 2<sup>6</sup> = 64 cellules.<br>c) 1 jour = 24 h : 2<sup>24</sup> = 16 777 216 cellules.</p>`},
  {n:"Exercice 7", t:"La rumeur", w:"Sur ton cahier", h:`<p>Le 1<sup>er</sup> mars, Laura lance une rumeur : le collège sera fermé le 1<sup>er</sup> avril. Elle prévient 3 personnes.</p><p>Le 2 mars, chacune des trois personnes prévenues la veille propage à son tour la rumeur en prévenant trois nouvelles personnes.</p><p>Ainsi, chaque jour, une personne prévenue la veille prévient trois nouvelles personnes.</p><p><b>1)</b> Combien de personnes ont appris la rumeur le 2 mars ?</p><p><b>2)</b> Combien de personnes ont appris la rumeur le 7 mars ?</p><p><b>3)</b> Au total, combien de personnes sont au courant de la rumeur le 7 mars ?</p>`,
   c:`<p><b>1)</b> Le 1<sup>er</sup> mars, 3 personnes apprennent la rumeur. Le 2 mars : 3 × 3 = 3<sup>2</sup> = <b>9 personnes</b>.</p><p><b>2)</b> Chaque jour, on multiplie par 3. Le 7 mars : 3<sup>7</sup> = <b>2 187 personnes</b>.</p>
   <p><b>3)</b> On additionne les personnes prévenues chaque jour, du 1<sup>er</sup> au 7 mars :</p><p class="calc">3 + 9 + 27 + 81 + 243 + 729 + 2 187 = 3 279</p><p><b>3 279 personnes</b> ont appris la rumeur. Avec Laura, <b>3 280 personnes</b> sont au courant.</p>`},
  {n:"Exercice 8", t:"C'est au menu", w:"Sur ton cahier", h:`<p><b>1)</b> Au restaurant, Ivan a le choix entre trois entrées et trois plats. Il choisit une entrée et un plat. Combien de menus différents peut-il composer ?</p><p><b>2)</b> Il décide de prendre un dessert après son plat. Il a le choix entre un fondant au chocolat, une île flottante ou un tiramisu.</p><p>Combien de menus peut-il finalement composer ?</p>`,
   c:`<p><b>1)</b> Pour chacune des 3 entrées, il y a 3 plats possibles : 3 × 3 = 3<sup>2</sup> = <b>9 menus</b>.</p><p><b>2)</b> Pour chacun de ces 9 menus, il y a 3 desserts : 3 × 3 × 3 = 3<sup>3</sup> = <b>27 menus</b>.</p>`},
  {n:"Exercice 9", t:"Code de carte bancaire", w:"Sur ton cahier", h:`<p>Un code de carte bancaire est composé de 4 chiffres de 0 à 9.</p><p>Combien y a-t-il de codes différents ?</p>`,
   c:`<p>Il y a 10 choix pour chacun des 4 chiffres :</p><p class="calc">10 × 10 × 10 × 10 = 10<sup>4</sup> = 10 000</p><p>Il y a <b>10 000 codes</b> différents (de 0000 à 9999).</p>`},
  {n:"Exercice 10", t:"Le cadenas", w:"Sur ton cahier", h:`<p>Hugo doit choisir un code pour son cadenas de vélo.</p><p>Ce cadenas a 4 molettes. Sur chaque molette, il y a les chiffres de 1 à 6.</p><p>Combien de codes possibles peut-il choisir ?</p>`,
   c:`<p>Il y a 6 choix pour chacune des 4 molettes :</p><p class="calc">6 × 6 × 6 × 6 = 6<sup>4</sup> = 1 296</p><p>Hugo peut choisir parmi <b>1 296 codes</b> (de 1111 à 6666).</p>`},
  {n:"Exercice 11", t:"Numéros de téléphone", w:"Sur ton cahier", h:`<p>En France métropolitaine, avant 1996, les numéros de téléphone fixe étaient composés de 8 chiffres.</p><p>Depuis, les numéros ont 2 chiffres supplémentaires au début : <b>0 + un indicatif de région</b>.</p>
   <p><b>01 à 05 : numéros réservés aux fixes.</b> La répartition de ces préfixes est géographique :</p><ul><li>01 : Île-de-France ;</li><li>02 : quart nord-ouest ;</li><li>03 : quart nord-est ;</li><li>04 : quart sud-est ;</li><li>05 : quart sud-ouest.</li></ul>${ex("carte.png","Carte de France métropolitaine découpée en 5 zones : 01 Île-de-France, 02 nord-ouest, 03 nord-est, 04 sud-est, 05 sud-ouest",220)}
   <p><b>1)</b> À ton avis, pourquoi a-t-on rajouté ces deux chiffres au début ?</p><p><b>2)</b> Depuis 1996, combien y a-t-il de numéros de téléphone fixe possibles ?</p><p><b>3)</b> Depuis 2005, les numéros qui commencent par 09 désignent aussi des lignes fixes (offres téléphone-internet-télévision). Combien de numéros de lignes fixes y a-t-il désormais ?</p><p><b>4) a)</b> À quoi correspond un numéro en 06 ? <b>b)</b> Combien y a-t-il de numéros possibles en 06 ?</p><p><b>5)</b> Depuis 2010, on peut avoir un numéro de portable qui commence par 07. Pourquoi ces numéros ont-ils été créés ?</p>`,
   c:`<p><b>1)</b> Pour avoir plus de numéros possibles : avec 8 chiffres, il n'y avait que 10<sup>8</sup> = 100 000 000 numéros, et il n'y en avait bientôt plus assez.</p>
   <p><b>2)</b> Après le préfixe (01, 02, 03, 04 ou 05), il reste 8 chiffres, soit 10<sup>8</sup> numéros par préfixe :</p><p class="calc">5 × 10<sup>8</sup> = 500 000 000 numéros fixes</p>
   <p><b>3)</b> Avec le préfixe 09 en plus, il y a 6 préfixes : 6 × 10<sup>8</sup> = 600 000 000 numéros.</p>
   <p><b>4) a)</b> Un numéro en 06 est un numéro de téléphone portable (mobile). <b>b)</b> 10<sup>8</sup> = 100 000 000 numéros possibles.</p>
   <p><b>5)</b> Il n'y avait plus assez de numéros en 06 pour tous les téléphones portables : le préfixe 07 ajoute 10<sup>8</sup> nouveaux numéros.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Définition d'une puissance", schema:S_DEF, q:{
 1:[ {g:()=>{ const a=ri(2,9), n=ri(3,6); const good=`${a}<sup>${n}</sup>`; return {q:`Comment s'écrit ${dev(a,n)} ?`, c:shuf(uniq(good,[`${n}<sup>${a}</sup>`,String(a*n),`${a} × ${n}`])), rep:good, ex:`Il y a ${n} facteurs égaux à ${a} : ${good}.`, sx:S_DEF}; }},
     {g:()=>{ const a=ri(2,5), n=ri(2,4); return {q:`Calcule : ${a}<sup>${n}</sup>`, rep:[F(a**n)], ex:`${a}<sup>${n}</sup> = ${dev(a,n)} = ${F(a**n)}.`, sx:S_DEF}; }} ],
 2:[ {g:()=>{ const a=nz(-5,-2), n=ri(2,4); return {q:`Calcule : ${pw(a,n)}`, rep:[F(a**n)], ex:`${pw(a,n)} = ${dev(a,n)} = ${F(a**n)} (${n%2?"nombre impair":"nombre pair"} de facteurs négatifs).`, sx:S_NEG}; }},
     {g:()=>{ const a=nz(-30,30), n=pick([0,1]); return {q:`Calcule : ${pw(a,n)}`, rep:[F(n?a:1)], ex:n?`Pour tout nombre a, a<sup>1</sup> = a.`:`Pour tout nombre a non nul, a<sup>0</sup> = 1.`, sx:S_DEF}; }} ],
 3:[ {g:()=>{ const a=ri(2,5), n=pick([2,4]), neg=pick([0,1]); const v=neg?-(a**n):a**n; return {q:`Calcule : ${neg?`−${a}<sup>${n}</sup>`:pw(-a,n)}`, rep:[F(v)], ex:neg?`−${a}<sup>${n}</sup> = −(${dev(a,n)}) = ${F(v)} : l'exposant ne porte que sur ${a}.`:`${pw(-a,n)} = ${dev(-a,n)} = ${F(v)}.`, sx:S_NEG}; }},
     {g:()=>{ const n=ri(5,120); return {q:`Quel est le signe de (−1)<sup>${n}</sup> ?`, c:["positif","négatif"], rep:n%2?"négatif":"positif", ex:`${n} facteurs égaux à −1 : ${n} est ${n%2?"impair, le résultat est −1":"pair, le résultat est 1"}.`, sx:S_NEG}; }} ]
}},
{nom:"Puissances de 10", schema:S_10, q:{
 1:[ {g:()=>{ const n=ri(2,9); return {q:`Calcule : 10<sup>${n}</sup>`, rep:[F(10**n)], ex:`Un 1 suivi de ${n} zéros : ${F(10**n)}.`, sx:S_10}; }} ],
 2:[ {g:()=>{ const n=ri(3,12); const good=`10<sup>${n}</sup>`; return {q:`Écris ${F(10**n)} sous la forme d'une puissance de 10.`, c:shuf(uniq(good,[`10<sup>${n+1}</sup>`,`10<sup>${n-1}</sup>`,`${n}<sup>10</sup>`])), rep:good, ex:`Il y a ${n} zéros après le 1.`, sx:S_10}; }} ],
 3:[ {g:()=>{ const n=pick([0,1]); return {q:`Calcule : 10<sup>${n}</sup>`, rep:[n?"10":"1"], ex:n?"a<sup>1</sup> = a : 10<sup>1</sup> = 10.":"a<sup>0</sup> = 1 : 10<sup>0</sup> = 1 (un 1 suivi de 0 zéro).", sx:S_10}; }},
     {g:()=>{ const n=ri(2,6), k=ri(2,9); return {q:`Calcule : ${k} × 10<sup>${n}</sup>`, rep:[F(k*10**n)], ex:`10<sup>${n}</sup> = ${F(10**n)}, donc ${k} × 10<sup>${n}</sup> = ${F(k*10**n)}.`, sx:S_10}; }} ]
}},
{nom:"Priorités avec des puissances", schema:S_PRIO, q:{
 1:[ {g:()=>{ const a=ri(1,20), b=ri(2,9); return {q:`Calcule : ${a} − ${b}<sup>2</sup>`, rep:[F(a-b*b)], ex:`La puissance d'abord : ${a} − ${b}<sup>2</sup> = ${a} − ${b*b} = ${F(a-b*b)}.`, sx:S_PRIO}; }},
     {g:()=>{ const a=ri(2,9), b=ri(2,4); return {q:`Calcule : ${a} × ${b}<sup>${b===4?2:3}</sup>`, rep:[F(a*b**(b===4?2:3))], ex:`La puissance d'abord : ${a} × ${b}<sup>${b===4?2:3}</sup> = ${a} × ${b**(b===4?2:3)} = ${F(a*b**(b===4?2:3))}.`, sx:S_PRIO}; }} ],
 2:[ {g:()=>{ const a=ri(-9,9), b=ri(-9,9), n=pick([2,3]), c=ri(2,5); const s=a+b; return {q:`Calcule : (${F(a)} + ${P(b)})<sup>${n}</sup> × ${c}`, rep:[F(s**n*c)], ex:`La parenthèse, puis la puissance, puis le produit : (${F(a)} + ${P(b)})<sup>${n}</sup> × ${c} = ${pw(s,n)} × ${c} = ${F(s**n)} × ${c} = ${F(s**n*c)}.`, sx:S_PRIO}; }} ],
 3:[ {g:()=>{ let a,b,c,v; do{ a=ri(2,9); b=ri(2,9); c=ri(2,9); v=a*b-c*c; }while(Math.abs(v)>3); const n=pick([3,4]); return {q:`Calcule : (${a} × ${b} − ${c}<sup>2</sup>)<sup>${n}</sup>`, rep:[F(v**n)], ex:`On calcule d'abord dans la parenthèse : (${a} × ${b} − ${c}<sup>2</sup>)<sup>${n}</sup> = (${a*b} − ${c*c})<sup>${n}</sup> = ${pw(v,n)} = ${F(v**n)}.`, sx:S_PRIO}; }},
     {q:"Vrai ou faux : (2 + 3)<sup>2</sup> = 2<sup>2</sup> + 3<sup>2</sup>.", c:VF, rep:"Faux", ex:"(2 + 3)<sup>2</sup> = 5<sup>2</sup> = 25, alors que 2<sup>2</sup> + 3<sup>2</sup> = 4 + 9 = 13.", sx:S_PRIO} ]
}},
{nom:"Problèmes avec des puissances", schema:S_PB, q:{
 1:[ {g:()=>{ const n=ri(3,6); return {q:`Un code est formé de ${n} chiffres de 0 à 9. Combien y a-t-il de codes possibles ?`, rep:[F(10**n)], ex:`10 choix pour chaque chiffre : 10<sup>${n}</sup> = ${F(10**n)}.`, sx:S_PB}; }} ],
 2:[ {g:()=>{ const a=ri(2,5), b=ri(2,5), c=ri(2,4); return {q:`Au self, on choisit une entrée parmi ${a}, un plat parmi ${b} et un dessert parmi ${c}. Combien de menus différents ?`, rep:[String(a*b*c)], ex:`${a} × ${b} × ${c} = ${a*b*c}.`, sx:S_PB}; }} ],
 3:[ {g:()=>{ const k=pick([2,3]), h=pick([1,2,3,4]), m=pick([2,3,4,5,6]); const t=h*m; return {q:`Des bactéries se multiplient : leur nombre ${k===2?"double":"triple"} ${h===1?"toutes les heures":`toutes les ${h} h`}. On part d'une bactérie. Combien y en a-t-il au bout de ${t} h ?`, rep:[F(k**m)], ex:`${t} h = ${m} × ${h} h : on multiplie ${m} fois par ${k}. ${k}<sup>${m}</sup> = ${F(k**m)}.`, sx:S_PB}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 5", duree:45, info:"Durée : 45 min · Calculatrice non autorisée · Stylo et crayon",
comp:[
  ["CONNAÎTRE","Je connais la définition et le vocabulaire des puissances.","Ex. 1 et 4 (6 points)"],
  ["CALCULER","Je calcule une puissance, même d'un nombre négatif.","Ex. 2 (4 points)"],
  ["CALCULER","Je respecte les priorités opératoires avec des puissances.","Ex. 3 (6 points)"],
  ["MODÉLISER","Je résous un problème à l'aide des puissances.","Ex. 5 (4 points)"]
],
exos:[
{t:"Vocabulaire", p:3, h:`<p>Recopie et complète le tableau.</p>${tabH(["Produit","Notation puissance","Se lit"],[["9 × 9 × 9","",""],["","4<sup>5</sup>",""],["","","7 exposant 2"]])}`,
 c:`${tabH(["Produit","Notation puissance","Se lit"],[["9 × 9 × 9","9<sup>3</sup>","9 exposant 3"],["4 × 4 × 4 × 4 × 4","4<sup>5</sup>","4 exposant 5"],["7 × 7","7<sup>2</sup>","7 exposant 2"]])}<p><i>(0,5 point par case juste)</i></p>`},
{t:"Calculer des puissances", p:4, h:`<p>Calcule.</p>${cols(["A = 2<sup>4</sup>","B = (−3)<sup>3</sup>","C = −5<sup>2</sup>","D = (−1)<sup>8</sup>","E = 10<sup>6</sup>","F = 4<sup>0</sup>","G = (−6)<sup>2</sup>","H = 0,5<sup>2</sup>"])}`,
 c:`${chns([["A",["2<sup>4</sup>","2 × 2 × 2 × 2","16"]],["B",["(−3)<sup>3</sup>","(−3) × (−3) × (−3)","−27"]],["C",["−5<sup>2</sup>","−(5 × 5)","−25"]],["D",["(−1)<sup>8</sup>","1"]],["E",["10<sup>6</sup>","1 000 000"]],["F",["4<sup>0</sup>","1"]],["G",["(−6)<sup>2</sup>","(−6) × (−6)","36"]],["H",["0,5<sup>2</sup>","0,5 × 0,5","0,25"]]])}<p>Pour D : 8 facteurs égaux à −1, c'est un nombre pair, donc le résultat est positif.</p><p><i>(0,5 point par calcul)</i></p>`},
{t:"Priorités opératoires", p:6, h:`<p>Calcule en écrivant les étapes.</p>${cols(["A = 6 − 3<sup>2</sup>","B = (4 − 7)<sup>2</sup>","C = 2 × (−3)<sup>2</sup>","D = (−2)<sup>3</sup> + 4<sup>2</sup>","E = (5 − 2 × 4)<sup>3</sup>","F = 10 − (−1 + 3)<sup>4</sup>"])}`,
 c:`<div class="figs" style="gap:28px"><p class="calc">A = 6 − 3<sup>2</sup><br>A = 6 − 9<br>A = −3</p><p class="calc">B = (4 − 7)<sup>2</sup><br>B = (−3)<sup>2</sup><br>B = 9</p><p class="calc">C = 2 × (−3)<sup>2</sup><br>C = 2 × 9<br>C = 18</p><p class="calc">D = (−2)<sup>3</sup> + 4<sup>2</sup><br>D = −8 + 16<br>D = 8</p><p class="calc">E = (5 − 2 × 4)<sup>3</sup><br>E = (5 − 8)<sup>3</sup><br>E = (−3)<sup>3</sup><br>E = −27</p><p class="calc">F = 10 − (−1 + 3)<sup>4</sup><br>F = 10 − 2<sup>4</sup><br>F = 10 − 16<br>F = −6</p></div><p><i>(1 point par calcul : 0,5 pour les étapes, 0,5 pour le résultat)</i></p>`},
{t:"Vrai ou faux ?", p:3, h:`<p>Dis si chaque égalité est vraie ou fausse.</p>${cols(["a) 2<sup>3</sup> = 6","b) (−4)<sup>2</sup> = 16","c) −4<sup>2</sup> = 16","d) 3<sup>2</sup> + 4<sup>2</sup> = 7<sup>2</sup>","e) 10<sup>5</sup> = 100 000","f) (−1)<sup>7</sup> = −1"])}`,
 c:`<p>a) Faux : 2<sup>3</sup> = 2 × 2 × 2 = 8 · b) Vrai · c) Faux : −4<sup>2</sup> = −16 · d) Faux : 9 + 16 = 25 et 7<sup>2</sup> = 49 · e) Vrai · f) Vrai : 7 facteurs négatifs</p><p><i>(0,5 point par réponse)</i></p>`},
{t:"Problèmes", p:4, h:`<p><b>1)</b> Le lundi, Tom envoie un message à 4 amis. Le mardi, chacun d'eux l'envoie à 4 nouvelles personnes. Et ainsi de suite : chaque jour, chaque personne qui a reçu le message la veille l'envoie à 4 nouvelles personnes.</p><p><b>a)</b> Combien de personnes reçoivent le message le mardi ?</p><p><b>b)</b> Écris sous la forme d'une puissance de 4 le nombre de personnes qui reçoivent le message le samedi, puis calcule ce nombre.</p><p><b>2)</b> L'antivol de Zoé a un code de 5 chiffres (de 0 à 9). Combien de codes différents existe-t-il ?</p>`,
 c:`<p><b>1) a)</b> 4 × 4 = 4<sup>2</sup> = 16 personnes. <i>(1 point)</i></p><p><b>b)</b> Lundi : 4<sup>1</sup> ; mardi : 4<sup>2</sup> ; … ; samedi : 4<sup>6</sup> = 4 096 personnes. <i>(1,5 point)</i></p><p><b>2)</b> 10 × 10 × 10 × 10 × 10 = 10<sup>5</sup> = 100 000 codes. <i>(1,5 point)</i></p>`}
]}
};

/* clavier texte pour les réponses tapées (pour pouvoir écrire le signe −) */
/* et calculs en chaîne « A = … » dans les explications (sauf vrai/faux et problèmes) */
const NOCH=["3.3.1"];
CH["4e-5"].quiz.forEach((N,ni)=>Object.entries(N.q).forEach(([l,list])=>list.forEach((it,i)=>{
  const f=o=>Object.assign(ni===3||NOCH.includes(`${ni+1}.${l}.${i}`)?o:qChain(o),{kb:"text"});
  if(it.g){ const g=it.g; list[i]={g:()=>f(g())}; } else list[i]=f(it);
})));
})();
