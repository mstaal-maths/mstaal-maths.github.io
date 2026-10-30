/* 6e — Chapitre 1 : Les nombres entiers (cours et fiche d'exercices de M. Staal, version complète) */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g," ");
const uniqC=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const ech = (deb, pas, n, pts=[]) => axis({n, lab:[...Array(n+1)].map((_,k)=>[k, String(deb+k*pas).replace(/\B(?=(\d{3})+(?!\d))/g," ")]), pts});

CH["6e-1"] = {
intro: "Chiffres et nombres, le tableau de numération jusqu'aux milliards, lire, écrire et décomposer les grands nombres, comparer et ranger, repérer un nombre sur une demi-droite graduée, et calculer en respectant les priorités opératoires.",
savoir: [
  "faire la différence entre un chiffre et un nombre ;",
  "connaître la valeur d'un chiffre selon sa position, jusqu'aux milliards ;",
  "lire et écrire un grand nombre en chiffres et en lettres ;",
  "décomposer un nombre, et distinguer « chiffre des… » et « nombre de… » ;",
  "comparer et ranger des nombres entiers ;",
  "repérer et placer un nombre entier sur une demi-droite graduée ;",
  "calculer en respectant les priorités opératoires."
],

/* ===================== COURS (fiche de cours de M. Staal) ===================== */
cours: [
{k:"I", t:"Chiffres et nombres", h:`
  <div class="retenir" data-l="Définition"><p>On écrit les nombres avec <b>dix chiffres</b> : 0, 1, 2, 3, 4, 5, 6, 7, 8 et 9. Un nombre s'écrit avec un ou plusieurs chiffres, comme un mot s'écrit avec des lettres.</p></div>
  <p><b>Exemples :</b> 507 est un nombre de trois chiffres. 7 est à la fois un chiffre et un nombre.</p>
  <h4>La numération décimale</h4>
  <p>Notre numération est fondée sur des <b>groupements par dix</b> : 10 unités font 1 dizaine, 10 dizaines font 1 centaine, 10 centaines font 1 millier (ou unité de mille), et ainsi de suite.</p>`},
{k:"II", t:"Le tableau de numération", h:`
  <div class="retenir" data-l="Propriété"><p>Dans l'écriture d'un nombre entier, chaque chiffre a une valeur qui dépend de sa <b>position</b> (son rang). Les chiffres sont regroupés par <b>classes de trois</b> : centaines (c), dizaines (d), unités (u).</p></div>
  <div class="scroll"><table class="num">
    <thead><tr><th colspan="3">Classe des milliards</th><th colspan="3">Classe des millions</th><th colspan="3">Classe des mille</th><th colspan="3">Classe des unités simples</th></tr>
    <tr>${"<th>c</th><th>d</th><th>u</th>".repeat(4)}</tr></thead>
    <tbody><tr>${"351408056491".split("").map(d=>`<td>${d}</td>`).join("")}</tr></tbody></table></div>
  <p>Dans 351 408 056 491 : 3 est le chiffre des centaines de milliards, 5 celui des dizaines de milliards, 0 celui des dizaines de millions, 6 celui des unités de mille…</p>
  <p><b>Remarque :</b> dans une classe, une place vide se complète par un zéro : dans 2 000 305, la classe des mille s'écrit 000.</p>`},
{k:"III", t:"Lire et écrire les grands nombres", h:`
  <h4>1. En chiffres</h4>
  <p>Pour lire facilement un grand nombre, on sépare les chiffres en <b>tranches de trois</b> en partant de la droite (du chiffre des unités), en laissant un espace :</p>
  <p class="calc">56107268 s'écrit 56 107 268.</p>
  <h4>2. En lettres</h4>
  <p>On lit chaque classe en partant de la gauche, suivie du nom de la classe :</p>
  <p class="calc">4 658 896 → « quatre-millions-six-cent-cinquante-huit-mille-huit-cent-quatre-vingt-seize ».</p>
  <div class="retenir" data-l="Règles d'orthographe"><ol>
    <li>On met un <b>trait d'union</b> entre tous les mots du nombre : 259 → deux-cent-cinquante-neuf.</li>
    <li>« cent » et « vingt » prennent un <b>« s »</b> quand ils sont multipliés et que rien ne les suit : quatre-cents, quatre-vingts, mais quatre-cent-trois, quatre-vingt-trois.</li>
    <li>« mille » ne prend <b>jamais</b> de « s » : trois-mille.</li>
    <li>« million » et « milliard » sont des noms : ils prennent un « s » au pluriel : deux-millions.</li></ol></div>`},
{k:"IV", t:"Décomposer un nombre", h:`
  <h4>1. Décomposition chiffre par chiffre</h4>
  <p class="calc">4 658 896 = 4 000 000 + 600 000 + 50 000 + 8 000 + 800 + 90 + 6</p>
  <p class="calc">4 658 896 = (4 × 1 000 000) + (6 × 100 000) + (5 × 10 000) + (8 × 1 000) + (8 × 100) + (9 × 10) + 6</p>
  <h4>2. « Chiffre des… » et « nombre de… »</h4>
  <p>Un même nombre peut se décomposer de plusieurs façons :</p>
  <p class="calc">2 146 = (214 × 10) + 6 = (21 × 100) + 46 = (2 × 1 000) + 146</p>
  <div class="retenir" data-l="À retenir"><div class="scroll"><table class="std"><thead><tr><th>Dans 2 146</th><th>le chiffre des…</th><th>le nombre de…</th></tr></thead><tbody>
    <tr><th>unités</th><td>6</td><td>2 146</td></tr><tr><th>dizaines</th><td>4</td><td>214</td></tr><tr><th>centaines</th><td>1</td><td>21</td></tr><tr><th>unités de mille</th><td>2</td><td>2</td></tr></tbody></table></div>
    <p>Le « chiffre des » est <b>un seul chiffre</b>. Le « nombre de » s'obtient en gardant <b>tous les chiffres jusqu'à ce rang</b>.</p></div>
  <p><b>Exemple :</b> avec 5 313 trombones, on remplit 531 boîtes de 10 (le nombre de dizaines), ou 53 boîtes de 100 (le nombre de centaines).</p>`},
{k:"V", t:"Comparer et ranger des nombres entiers", h:`
  <div class="retenir" data-l="Définition"><p><b>Comparer</b> deux nombres, c'est dire s'ils sont égaux (=), ou lequel est le plus grand (&gt;) ou le plus petit (&lt;). On utilise aussi ≤ (« inférieur ou égal à ») et ≥ (« supérieur ou égal à »).</p></div>
  <div class="retenir" data-l="Méthode"><ol>
    <li>Le nombre qui a le <b>plus de chiffres</b> est le plus grand.</li>
    <li>S'ils ont autant de chiffres, je compare les chiffres de même rang <b>de gauche à droite</b>, jusqu'au premier chiffre différent.</li></ol></div>
  <p><b>Exemples :</b> 1 325 000 &gt; 26 478, car 1 325 000 a 7 chiffres et 26 478 n'en a que 5. &nbsp; 458 200 &gt; 453 402, car 8 unités de mille &gt; 3 unités de mille.</p>
  <div class="retenir" data-l="Définition"><p>Ranger des nombres dans l'<b>ordre croissant</b>, c'est les écrire du plus petit au plus grand ; dans l'<b>ordre décroissant</b>, du plus grand au plus petit.</p></div>
  <p><b>Remarque :</b> l'entier qui précède 13 000 est 12 999 ; l'entier qui le suit est 13 001.</p>`},
{k:"VI", t:"Repérer un nombre sur une demi-droite graduée", h:`
  <div class="retenir" data-l="Définition"><p>Sur une demi-droite graduée, les graduations sont régulièrement espacées. Le nombre associé à un point est son <b>abscisse</b>. Si le point A a pour abscisse 3, on écrit <b>A(3)</b>.</p></div>
  <div class="retenir" data-l="Méthode"><ol>
    <li>Je repère l'<b>écart entre deux graduations</b> : si besoin, je divise la différence entre deux nombres connus par le nombre d'intervalles.</li>
    <li>Je compte les graduations à partir de 0 (ou d'un nombre connu).</li>
    <li>Je place le point et je note son nom et son abscisse, par exemple D(150).</li></ol></div>
  <h4>Exemple 1 — graduation de 1 en 1</h4>${ech(0,1,10,[["A",3]])}<p>A(3).</p>
  <h4>Exemple 2 — graduation de 100 en 100 (et non de 1 en 1 !)</h4>${ech(2000,100,10,[["B",7]])}<p>B(2 700).</p>
  <h4>Exemple 3 — graduation de 1 000 en 1 000</h4>${ech(0,1000,10,[["C",9]])}<p>C(9 000).</p>`},
{k:"VII", t:"Calculer avec des nombres entiers", h:`
  <h4>1. Les priorités opératoires</h4>
  <div class="retenir" data-l="Règles"><ol>
    <li>On effectue d'abord les calculs <b>entre parenthèses</b>.</li>
    <li>Puis les <b>multiplications et les divisions</b>.</li>
    <li>Puis les <b>additions et les soustractions</b>.</li>
    <li>Quand les opérations ont la même priorité, on calcule <b>de gauche à droite</b>.</li></ol></div>
  <p><b>Exemples :</b></p><div class="calcs"><div><p class="calc">A = 5 + 2 × 3<br>A = 5 + 6<br>A = <b>11</b></p></div><div><p class="calc">B = (6 + 4) × 5<br>B = 10 × 5<br>B = <b>50</b></p></div><div><p class="calc">C = 20 − 6 − 4<br>C = 14 − 4<br>C = <b>10</b></p></div><div><p class="calc">D = 40 ÷ 8 + 6 × 2<br>D = 5 + 12<br>D = <b>17</b></p></div></div>
  <h4>2. Calculer astucieusement</h4>
  <div class="retenir" data-l="Propriété"><p>Pour multiplier une somme ou une différence, on peut multiplier chacun de ses termes :</p><p class="calc">k × (a + b) = k × a + k × b &nbsp;&nbsp; et &nbsp;&nbsp; k × (a − b) = k × a − k × b</p></div>
  <p><b>Exemples :</b></p><div class="calcs"><div><p class="calc">E = 13 × 7 + 13 × 3<br>E = 13 × (7 + 3)<br>E = 13 × 10<br>E = <b>130</b></p></div><div><p class="calc">F = 32 × 11<br>F = 32 × 10 + 32 × 1<br>F = 320 + 32<br>F = <b>352</b></p></div><div><p class="calc">G = 32 × 19<br>G = 32 × 20 − 32 × 1<br>G = 640 − 32<br>G = <b>608</b></p></div></div>`}
],

/* ===================== EXERCICES (dans l'ordre de la fiche de M. Staal) ===================== */
exos: [
{t:"La numération décimale", e:[
  {n:"Activité 1", t:"Quel est ce nombre ?", w:"Sur ton cahier", h:`<p>Un cube représente 1 000 unités, une plaque 100, une barre 10 et un petit carré 1. Écris le nombre représenté, puis sa décomposition chiffre par chiffre sur ton cahier.</p>${img("c61ex/act1.png","Quatre assemblages de cubes, plaques, barres et petits carrés",520)}`,
   c:`<p>a) 1 cube, 3 plaques, 5 barres et 2 petits carrés : <b>1 352</b> = 1 000 + 300 + 50 + 2.</p>
   <p>b) 2 cubes et 4 barres : <b>2 040</b> = 2 000 + 40. <i>Il n'y a pas de plaque : le chiffre des centaines est 0.</i></p>
   <p>c) 2 plaques et 7 petits carrés : <b>207</b> = 200 + 7. <i>Pas de barre : le chiffre des dizaines est 0.</i></p>
   <p>d) 3 cubes, 1 plaque et 6 petits carrés : <b>3 106</b> = 3 000 + 100 + 6.</p>`},
  {n:"Exercice 1", t:"La position des chiffres", w:"Sur ta feuille", h:`<p>Dans le nombre 38 254 306 917, quel est le chiffre : a) des centaines ? b) des dizaines de millions ? c) des centaines de mille ? d) des unités de milliards ?</p>`,
   c:`<div class="scroll"><table class="num"><thead><tr><th colspan="2">milliards</th><th colspan="3">millions</th><th colspan="3">mille</th><th colspan="3">unités simples</th></tr><tr><th>d</th><th>u</th><th>c</th><th>d</th><th>u</th><th>c</th><th>d</th><th>u</th><th>c</th><th>d</th><th>u</th></tr></thead><tbody><tr>${"38254306917".split("").map(d=>`<td>${d}</td>`).join("")}</tr></tbody></table></div>
   <p>a) <b>9</b> · b) <b>5</b> · c) <b>3</b> · d) <b>8</b></p>`},
  {n:"Exercice 2", t:"Vrai ou faux ?", w:"Sur ta feuille", h:`<p>a) Dans 845 612, le chiffre 4 est le chiffre des dizaines de mille.</p><p>b) Dans « deux-cent-quatre-millions », on met un « s » à millions car il y en a plusieurs.</p><p>c) Il faut parfois compléter une classe avec un zéro.</p><p>d) Dans 92 408 715, le chiffre des centaines de mille est 4.</p>`,
   c:`<p>a) <b>Vrai</b> : dans la classe des mille (845), 4 est le chiffre des dizaines de mille.</p><p>b) <b>Vrai</b> : « million » est un nom, il prend un « s » au pluriel (contrairement à « mille »).</p><p>c) <b>Vrai</b> : par exemple dans 2 000 305, la classe des mille s'écrit 000.</p><p>d) <b>Vrai</b> : dans la classe des mille (408), 4 est le chiffre des centaines de mille.</p>`},
  {n:"Exercice 3", t:"Qui suis-je ?", w:"Sur ta feuille", h:`<p>Je suis un nombre de cinq chiffres. Mon chiffre des dizaines est 7. Mon chiffre des centaines est le même que celui de 12 354. Mon chiffre des dizaines de mille est 4. Mon chiffre des unités est le double de mon chiffre des dizaines de mille. Mon chiffre des unités de mille est 0.</p><p>Qui suis-je ?</p>`,
   c:`<p>Dizaines de mille : 4 · unités de mille : 0 · centaines : 3 (comme dans 12 354) · dizaines : 7 · unités : 2 × 4 = 8.</p><p>Je suis <b>40 378</b>.</p>`}
 ]},
{t:"Lire et écrire les grands nombres", note:"<b>Rappels :</b> un trait d'union entre tous les mots ; « cent » et « vingt » prennent un « s » quand ils sont multipliés et que rien ne les suit ; « mille » ne prend jamais de « s » ; « million » et « milliard » prennent un « s » au pluriel.", e:[
  {n:"Activité 2", t:"La population des continents", w:"Sur ton cahier", h:`<p>Réécris chaque nombre en séparant les classes, puis écris-le en lettres sur ton cahier.</p><p>a) En 2017, la population mondiale était de 7550263500 habitants.</p><p>b) L'Afrique comptait environ 1256268000 habitants.</p><p>c) L'Europe comptait 742074000 habitants.</p><p>d) L'Océanie comptait 40691000 habitants.</p>`,
   c:`<p>On sépare en tranches de trois chiffres <b>en partant de la droite</b>.</p>
   <p>a) <b>7 550 263 500</b> : sept-milliards-cinq-cent-cinquante-millions-deux-cent-soixante-trois-mille-cinq-cents.</p>
   <p>b) <b>1 256 268 000</b> : un-milliard-deux-cent-cinquante-six-millions-deux-cent-soixante-huit-mille.</p>
   <p>c) <b>742 074 000</b> : sept-cent-quarante-deux-millions-soixante-quatorze-mille.</p>
   <p>d) <b>40 691 000</b> : quarante-millions-six-cent-quatre-vingt-onze-mille.</p>`},
  {n:"Exercice 4", t:"Écrire en lettres", w:"Sur ta feuille", h:`<p>Écris ces nombres en lettres. Attention aux « s » et aux traits d'union !</p><p>a) 80 · b) 84 · c) 480 · d) 803 · e) 1 054 · f) 20 340 · g) 4 523 015 · h) 36 054 306 007 · i) 24 000 300</p>`,
   c:`a) quatre-vingts · b) quatre-vingt-quatre · c) quatre-cent-quatre-vingts · d) huit-cent-trois · e) mille-cinquante-quatre · f) vingt-mille-trois-cent-quarante · g) 4 millions, 523 mille et 15 unités : quatre-millions-cinq-cent-vingt-trois-mille-quinze · h) 36 milliards, 54 millions, 306 mille et 7 unités : trente-six-milliards-cinquante-quatre-millions-trois-cent-six-mille-sept · i) 24 millions et 300 unités : vingt-quatre-millions-trois-cents`},
  {n:"Exercice 5", t:"Écrire en chiffres", w:"Sur ta feuille", h:`<p>Voici quelques données sur la Terre. Écris en chiffres les nombres en gras.</p><p>a) En juin 2018, la Terre comptait environ <b>sept-milliards-cinq-cent-cinquante-neuf-millions-deux-cent-quatre-vingt-huit-mille-trois-cents</b> habitants.</p><p>b) La longueur de l'équateur est d'environ <b>quarante-mille-soixante-quinze</b> km.</p><p>c) La Lune est à environ <b>trois-cent-quatre-vingt-quatre-mille</b> km de la Terre.</p><p>d) La superficie de la Terre est d'environ <b>cinq-cent-dix-millions-soixante-cinq-mille-six-cents</b> km².</p>`,
   c:`<p>Je repère chaque classe (milliards, millions, mille, unités). Chaque classe s'écrit avec 3 chiffres : je complète avec des zéros si besoin.</p>
   <p>a) 7 milliards, 559 millions, 288 mille et 300 unités : <b>7 559 288 300</b></p>
   <p>b) 40 mille et 75 unités. La classe des unités s'écrit 075 : <b>40 075</b></p>
   <p>c) 384 mille. La classe des unités s'écrit 000 : <b>384 000</b></p>
   <p>d) 510 millions, 65 mille et 600 unités. La classe des mille s'écrit 065 : <b>510 065 600</b></p>`},
  {n:"Exercice 6", t:"Corrige l'erreur", w:"Sur ta feuille", h:`<p>a) « quatre-vingts-trois » (83) · b) « neuf-cents-cinq » (905) · c) « deux-milles » (2 000) · d) « trois-million » (3 000 000)</p>`,
   c:`a) quatre-vingt-trois : « vingt » est suivi de trois, il ne prend pas de « s ». · b) neuf-cent-cinq : « cent » est suivi de cinq, pas de « s ». · c) deux-mille : « mille » ne prend jamais de « s ». · d) trois-millions : « million » est un nom, il prend un « s » au pluriel.`}
 ]},
{t:"Décomposer un nombre", e:[
  {n:"Exercice 7", t:"Décomposer", w:"Sur ton cahier", h:`<p>Décompose ces nombres de deux façons (avec des additions, puis avec des multiplications), sur ton cahier.</p><p>a) 15 810 · b) 907 605 · c) 308 290 009</p>`,
   c:`<p>a) 15 810 = 10 000 + 5 000 + 800 + 10<br>15 810 = (1 × 10 000) + (5 × 1 000) + (8 × 100) + (1 × 10)</p>
   <p>b) 907 605 = 900 000 + 7 000 + 600 + 5<br>907 605 = (9 × 100 000) + (7 × 1 000) + (6 × 100) + 5</p>
   <p>c) 308 290 009 = 300 000 000 + 8 000 000 + 200 000 + 90 000 + 9<br>308 290 009 = (3 × 100 000 000) + (8 × 1 000 000) + (2 × 100 000) + (9 × 10 000) + 9</p>
   <p><i>On n'écrit pas les rangs où le chiffre est 0.</i></p>`},
  {n:"Exercice 8", t:"Retrouver le nombre", w:"Sur ta feuille", h:`<p>a) (5 × 100 000) + (3 × 1 000) + (7 × 10) + 2 = …… En lettres : ……</p><p>b) 7 000 000 + 40 000 + 300 + 6 = ……</p>`,
   c:`<p>a) 500 000 + 3 000 + 70 + 2 = <b>503 072</b> : cinq-cent-trois-mille-soixante-douze.</p><p>b) 7 millions, 40 mille et 306 unités : <b>7 040 306</b></p>`},
  {n:"Exercice 9", t:"Chiffre des… ou nombre de… ?", w:"Sur ta feuille", h:`<p>Complète le tableau pour le nombre 12 350.</p><div class="scroll"><table class="std"><thead><tr><th>Dans 12 350</th><th>le chiffre des…</th><th>le nombre de…</th></tr></thead><tbody><tr><th>dizaines</th><td>……</td><td>……</td></tr><tr><th>centaines</th><td>……</td><td>……</td></tr><tr><th>unités de mille</th><td>……</td><td>……</td></tr></tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Dans 12 350</th><th>le chiffre des…</th><th>le nombre de…</th></tr></thead><tbody><tr><th>dizaines</th><td><b>5</b></td><td><b>1 235</b></td></tr><tr><th>centaines</th><td><b>3</b></td><td><b>123</b></td></tr><tr><th>unités de mille</th><td><b>2</b></td><td><b>12</b></td></tr></tbody></table></div><p>Pour le « nombre de », on garde tous les chiffres jusqu'au rang demandé.</p>`},
  {n:"Exercice 10", t:"Des problèmes", w:"Sur ton cahier", h:`<p>Réponds sur ton cahier en expliquant ta démarche.</p><p><b>Problème 1 :</b> dans un verger, Marc plante 234 poiriers en rangées de 10. Combien de rangées complètes va-t-il faire ?</p><p><b>Problème 2 :</b> on range 2 856 feuilles de papier. Combien de paquets complets de 1 000 feuilles peut-on faire ? Et de paquets de 100 feuilles ?</p><p><b>Problème 3 :</b> Charly le chocolatier a fabriqué 12 350 bonbons. Il les vend par sachets de 10, par boîtes de 100 ou par cartons de 1 000.</p><p>a) Combien de cartons peut-il remplir au maximum ? Et de boîtes ? Et de sachets ?</p><p>b) Il remplit d'abord le plus de cartons possible, puis le plus de boîtes possible avec le reste, puis des sachets. Combien de cartons, de boîtes et de sachets prépare-t-il ?</p>`,
   c:`<p><b>Problème 1 :</b> le nombre de dizaines de 234 est 23. Marc fait <b>23 rangées complètes</b> (et il reste 4 poiriers).</p>
   <p><b>Problème 2 :</b> le nombre de milliers de 2 856 est 2 : <b>2 paquets de 1 000</b>. Le nombre de centaines est 28 : <b>28 paquets de 100</b>.</p>
   <p><b>Problème 3 :</b> a) Nombre de milliers de 12 350 : <b>12 cartons</b>. Nombre de centaines : <b>123 boîtes</b>. Nombre de dizaines : <b>1 235 sachets</b>.</p>
   <p>b) 12 cartons (12 000 bonbons), il en reste 350 ; puis 3 boîtes (300 bonbons), il en reste 50 ; puis 5 sachets. Il prépare <b>12 cartons, 3 boîtes et 5 sachets</b>.</p>
   <p><i>On retrouve les chiffres de 12 350 : 12 milliers, 3 centaines, 5 dizaines.</i></p>`}
 ]},
{t:"Comparer et ranger", e:[
  {n:"Activité 3", t:"Les pays les plus peuplés", w:"Sur ta feuille", h:`<p>Classe ces pays du plus peuplé au moins peuplé (données de 2016).</p><div class="scroll"><table class="std"><thead><tr><th>Pays</th><th>Habitants</th><th>Pays</th><th>Habitants</th></tr></thead><tbody>
    <tr><td>Brésil</td><td>206 780 725</td><td>Inde</td><td>1 296 314 936</td></tr><tr><td>Chine</td><td>1 374 587 932</td><td>Indonésie</td><td>256 485 214</td></tr><tr><td>États-Unis</td><td>325 054 733</td><td>Royaume-Uni</td><td>64 879 887</td></tr><tr><td>France</td><td>66 870 633</td><td>Russie</td><td>146 327 158</td></tr><tr><td>Allemagne</td><td>79 830 324</td><td></td><td></td></tr></tbody></table></div>`,
   c:`<p>On compare d'abord le nombre de chiffres : la Chine et l'Inde ont plus d'un-milliard d'habitants (10 chiffres). Ensuite, on compare les chiffres de gauche à droite.</p>
   <p><b>Chine</b> (1 374 587 932) &gt; <b>Inde</b> (1 296 314 936) &gt; <b>États-Unis</b> (325 054 733) &gt; <b>Indonésie</b> (256 485 214) &gt; <b>Brésil</b> (206 780 725) &gt; <b>Russie</b> (146 327 158) &gt; <b>Allemagne</b> (79 830 324) &gt; <b>France</b> (66 870 633) &gt; <b>Royaume-Uni</b> (64 879 887).</p>`},
  {n:"Exercice 11", t:"Les plus hauts sommets", w:"Sur ta feuille", h:`<p>Range ces sommets dans l'ordre décroissant de leur altitude.</p><div class="scroll"><table class="std"><thead><tr><th>Sommet</th><th>Altitude</th><th>Sommet</th><th>Altitude</th></tr></thead><tbody>
    <tr><td>Kilimandjaro (Afrique)</td><td>5 895 m</td><td>Everest (Asie)</td><td>8 849 m</td></tr><tr><td>Denali (Amérique du Nord)</td><td>6 190 m</td><td>Mont-Blanc (Europe)</td><td>4 806 m</td></tr><tr><td>Aconcagua (Amérique du Sud)</td><td>6 961 m</td><td>Elbrouz (Europe)</td><td>5 642 m</td></tr><tr><td>Vinson (Antarctique)</td><td>4 892 m</td><td>Puncak Jaya (Océanie)</td><td>4 884 m</td></tr></tbody></table></div>`,
   c:`<p>Ordre décroissant (du plus haut au moins haut) :</p><p><b>Everest</b> (8 849 m) &gt; <b>Aconcagua</b> (6 961 m) &gt; <b>Denali</b> (6 190 m) &gt; <b>Kilimandjaro</b> (5 895 m) &gt; <b>Elbrouz</b> (5 642 m) &gt; <b>Vinson</b> (4 892 m) &gt; <b>Puncak Jaya</b> (4 884 m) &gt; <b>Mont-Blanc</b> (4 806 m).</p><p><i>Pour les trois derniers, il faut aller jusqu'au chiffre des dizaines : 4 892 &gt; 4 884 &gt; 4 806.</i></p>`},
  {n:"Exercice 12", t:"Comparer", w:"Sur ta feuille", h:`<p>Complète par &lt;, &gt; ou =.</p><p>a) 45 678 …… 45 687 · b) 1 000 000 …… 999 999 · c) 307 012 …… 370 012 · d) 25 000 …… 2 500 000 · e) 12 345 678 …… 12 345 687 · f) 8 milliards …… 8 000 000 000</p>`,
   c:`a) 45 678 &lt; 45 687 (7 dizaines &lt; 8 dizaines) · b) 1 000 000 &gt; 999 999 (7 chiffres contre 6) · c) 307 012 &lt; 370 012 (0 dizaine de mille &lt; 7 dizaines de mille) · d) 25 000 &lt; 2 500 000 (5 chiffres contre 7) · e) 12 345 678 &lt; 12 345 687 (7 dizaines &lt; 8 dizaines) · f) 8 milliards = 8 000 000 000 (1 milliard = 1 000 000 000)`},
  {n:"Exercice 13", t:"Les étiquettes", w:"Sur ta feuille", h:`<p>Voici cinq étiquettes : <b>407 · 52 · 9 · 800 · 36</b>. En les mettant toutes bout à bout, écris :</p><p>a) le plus petit nombre possible ; b) le plus grand nombre possible.</p>`,
   c:`<p>Les cinq étiquettes donnent toujours un nombre de 11 chiffres : on compare donc les chiffres de gauche à droite.</p><p>a) On commence par les étiquettes qui débutent par les plus petits chiffres : <b>36 407 528 009</b> (36 · 407 · 52 · 800 · 9).</p><p>b) On commence par les étiquettes qui débutent par les plus grands chiffres : <b>98 005 240 736</b> (9 · 800 · 52 · 407 · 36).</p>`},
  {n:"Exercice 14", t:"Avant et après", w:"Sur ta feuille", h:`<div class="scroll"><table class="std"><thead><tr><th>Entier précédent</th><th>Nombre</th><th>Entier suivant</th></tr></thead><tbody><tr><td>……</td><td>350</td><td>……</td></tr><tr><td>……</td><td>499</td><td>……</td></tr><tr><td>……</td><td>12 999</td><td>……</td></tr><tr><td>……</td><td>250 000</td><td>……</td></tr><tr><td>……</td><td>430 099</td><td>……</td></tr></tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Entier précédent</th><th>Nombre</th><th>Entier suivant</th></tr></thead><tbody><tr><td><b>349</b></td><td>350</td><td><b>351</b></td></tr><tr><td><b>498</b></td><td>499</td><td><b>500</b></td></tr><tr><td><b>12 998</b></td><td>12 999</td><td><b>13 000</b></td></tr><tr><td><b>249 999</b></td><td>250 000</td><td><b>250 001</b></td></tr><tr><td><b>430 098</b></td><td>430 099</td><td><b>430 100</b></td></tr></tbody></table></div>`}
 ]},
{t:"Les demi-droites graduées", note:"<b>Rappel :</b> si un point A a pour abscisse 12, on écrit A(12).", e:[
  {n:"Exercice 15", t:"Compléter les graduations", w:"Sur ta feuille", h:`<p>Écris les nombres qui manquent sous les graduations.</p>
   ${axis({n:5, lab:[[0,"0"],[1,"…"],[2,"…"],[3,"…"],[4,"…"],[5,"10"]]})}
   ${axis({n:6, lab:[[0,"0"],[1,"…"],[2,"10"],[3,"…"],[4,"…"],[5,"…"],[6,"…"]]})}
   ${axis({n:7, lab:[[0,"0"],[1,"…"],[2,"…"],[3,"300"],[4,"…"],[5,"…"],[6,"…"],[7,"…"]]})}`,
   c:`<p><b>1<sup>re</sup> demi-droite :</b> 5 intervalles pour aller de 0 à 10, donc l'écart est 10 ÷ 5 = 2 : 0, <b>2, 4, 6, 8</b>, 10.</p>
   <p><b>2<sup>e</sup> demi-droite :</b> 10 est 2 graduations après 0, donc l'écart est 10 ÷ 2 = 5 : 0, <b>5</b>, 10, <b>15, 20, 25, 30</b>.</p>
   <p><b>3<sup>e</sup> demi-droite :</b> 300 est 3 graduations après 0, donc l'écart est 300 ÷ 3 = 100 : 0, <b>100, 200</b>, 300, <b>400, 500, 600, 700</b>.</p>`},
  {n:"Exercice 16", t:"Lire des abscisses", w:"Sur ta feuille", h:`<p>Pour chaque demi-droite graduée, calcule l'écart entre deux graduations, puis écris l'abscisse de chaque point (par exemple A(…)).</p>
   ${axis({n:10, lab:[[0,"0"],[10,"1 000"]], pts:[["A",2],["B",5],["C",9]]})}
   ${axis({n:10, lab:[[0,"0"],[10,"30"]], pts:[["A",2],["B",5],["C",7],["D",9]]})}
   ${axis({n:12, lab:[[0,"0"],[12,"96"]], pts:[["A",3],["B",7],["C",10]]})}`,
   c:`<p><b>1<sup>re</sup> :</b> 10 intervalles de 0 à 1 000 : écart = 1 000 ÷ 10 = <b>100</b>. A(200) · B(500) · C(900).</p>
   <p><b>2<sup>e</sup> :</b> 10 intervalles de 0 à 30 : écart = 30 ÷ 10 = <b>3</b>. A(6) · B(15) · C(21) · D(27).</p>
   <p><b>3<sup>e</sup> :</b> 12 intervalles de 0 à 96 : écart = 96 ÷ 12 = <b>8</b>. A(24) · B(56) · C(80).</p>`},
  {n:"Exercice 17", t:"Placer des points", w:"Sur ta feuille", h:`<p>a) Place les points A(15), B(35) et C(50).</p>${axis({n:12, lab:[[0,"0"],[12,"60"]]})}
   <p>b) Place les points G(600), H(1 500) et I(2 100).</p>${axis({n:8, lab:[[0,"0"],[8,"2 400"]]})}
   <p>c) Place les points J(3 200), K(3 800) et M(3 500).</p>${axis({n:10, lab:[[0,"3 000"],[5,"3 500"],[10,"4 000"]], major:[5]})}`,
   c:`<p>a) Écart = 60 ÷ 12 = 5. A est à la 3<sup>e</sup> graduation, B à la 7<sup>e</sup>, C à la 10<sup>e</sup>.</p>${axis({n:12, lab:[[0,"0"],[12,"60"]], pts:[["A",3],["B",7],["C",10]]})}
   <p>b) Écart = 2 400 ÷ 8 = 300. G à la 2<sup>e</sup> graduation, H à la 5<sup>e</sup>, I à la 7<sup>e</sup>.</p>${axis({n:8, lab:[[0,"0"],[8,"2 400"]], pts:[["G",2],["H",5],["I",7]]})}
   <p>c) De 3 000 à 4 000 en 10 intervalles : écart = 1 000 ÷ 10 = 100. J est 2 graduations après 3 000, M est sur la graduation 3 500, K est 8 graduations après 3 000.</p>${axis({n:10, lab:[[0,"3 000"],[5,"3 500"],[10,"4 000"]], major:[5], pts:[["J",2],["M",5],["K",8]]})}`},
  {n:"Exercice 18", t:"Défi — très grands nombres", w:"Sur ta feuille", h:`<p>Calcule l'écart entre deux graduations, puis écris l'abscisse des points A, B et C.</p>${axis({n:9, lab:[[0,"0"],[9,"1 800 000"]], pts:[["A",2],["B",5],["C",8]]})}`,
   c:`<p>9 intervalles de 0 à 1 800 000 : écart = 1 800 000 ÷ 9 = <b>200 000</b>.</p><p>A(400 000) · B(1 000 000) · C(1 600 000)</p>`}
 ]},
{t:"Les priorités opératoires", note:"<b>Rappel :</b> les parenthèses d'abord, puis × et ÷, puis + et −. À priorité égale, de gauche à droite.", e:[
  {n:"Exercice 19", t:"Sans parenthèses", w:"Sur ta feuille", h:`<p>Calcule en écrivant une étape par ligne.</p><div class="calcs"><span>A = 5 + 2 × 3</span><span>B = 10 − 3 × 2</span><span>C = 4 × 5 + 6</span><span>D = 20 ÷ 4 + 7</span><span>E = 9 + 12 ÷ 3</span><span>F = 7 × 2 − 8</span><span>G = 6 + 5 × 4</span><span>H = 30 − 4 × 7</span><span>I = 8 × 3 − 15 ÷ 5</span><span>J = 40 ÷ 8 + 6 × 2</span></div>`,
   c:`<p>Je calcule d'abord les multiplications et les divisions, puis les additions et les soustractions.</p><div class="calcs"><div><p class="calc">A = 5 + 2 × 3<br>A = 5 + 6<br>A = <b>11</b></p></div><div><p class="calc">B = 10 − 3 × 2<br>B = 10 − 6<br>B = <b>4</b></p></div><div><p class="calc">C = 4 × 5 + 6<br>C = 20 + 6<br>C = <b>26</b></p></div><div><p class="calc">D = 20 ÷ 4 + 7<br>D = 5 + 7<br>D = <b>12</b></p></div><div><p class="calc">E = 9 + 12 ÷ 3<br>E = 9 + 4<br>E = <b>13</b></p></div><div><p class="calc">F = 7 × 2 − 8<br>F = 14 − 8<br>F = <b>6</b></p></div><div><p class="calc">G = 6 + 5 × 4<br>G = 6 + 20<br>G = <b>26</b></p></div><div><p class="calc">H = 30 − 4 × 7<br>H = 30 − 28<br>H = <b>2</b></p></div><div><p class="calc">I = 8 × 3 − 15 ÷ 5<br>I = 24 − 3<br>I = <b>21</b></p></div><div><p class="calc">J = 40 ÷ 8 + 6 × 2<br>J = 5 + 12<br>J = <b>17</b></p></div></div>`},
  {n:"Exercice 20", t:"Avec des parenthèses", w:"Sur ta feuille", h:`<p>Calcule en écrivant une étape par ligne.</p><div class="calcs"><span>A = (6 + 4) × 5</span><span>B = 3 × (8 + 7)</span><span>C = (18 − 6) ÷ 3</span><span>D = 25 − 4 × (2 + 3)</span><span>E = (12 + 8) ÷ 4 + 9</span><span>F = 2 × (15 − 3 × 4)</span><span>G = (7 + 3) × (9 − 4)</span><span>H = 5 × (20 − 4 ÷ 2)</span><span>I = (36 ÷ 9 + 2) × 3</span><span>J = 100 − (5 + 3) × (10 − 4)</span></div>`,
   c:`<p>Je calcule d'abord dans les parenthèses, puis les multiplications et les divisions, puis les additions et les soustractions.</p><div class="calcs" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr))"><div><p class="calc">A = (6 + 4) × 5<br>A = 10 × 5<br>A = <b>50</b></p></div><div><p class="calc">B = 3 × (8 + 7)<br>B = 3 × 15<br>B = <b>45</b></p></div><div><p class="calc">C = (18 − 6) ÷ 3<br>C = 12 ÷ 3<br>C = <b>4</b></p></div><div><p class="calc">D = 25 − 4 × (2 + 3)<br>D = 25 − 4 × 5<br>D = 25 − 20<br>D = <b>5</b></p></div><div><p class="calc">E = (12 + 8) ÷ 4 + 9<br>E = 20 ÷ 4 + 9<br>E = 5 + 9<br>E = <b>14</b></p></div><div><p class="calc">F = 2 × (15 − 3 × 4)<br>F = 2 × (15 − 12)<br>F = 2 × 3<br>F = <b>6</b></p></div><div><p class="calc">G = (7 + 3) × (9 − 4)<br>G = 10 × 5<br>G = <b>50</b></p></div><div><p class="calc">H = 5 × (20 − 4 ÷ 2)<br>H = 5 × (20 − 2)<br>H = 5 × 18<br>H = <b>90</b></p></div><div><p class="calc">I = (36 ÷ 9 + 2) × 3<br>I = (4 + 2) × 3<br>I = 6 × 3<br>I = <b>18</b></p></div><div><p class="calc">J = 100 − (5 + 3) × (10 − 4)<br>J = 100 − 8 × 6<br>J = 100 − 48<br>J = <b>52</b></p></div></div>`},
  {n:"Exercice 21", t:"En détaillant les étapes", w:"Sur ton cahier", h:`<p>Calcule sur ton cahier en écrivant une étape par ligne.</p><div class="calcs"><span>A = 12 + 3 × (10 − 6)</span><span>B = (45 − 5) ÷ 8 + 7</span><span>C = 9 × 4 − 6 × 3</span><span>D = 50 − (2 + 4 × 6)</span><span>E = (14 − 2 × 5) × 7</span><span>F = 3 × (6 + 4) − 8 ÷ 4</span></div>`,
   c:`<div class="calcs"><div><p class="calc">A = 12 + 3 × (10 − 6)<br>A = 12 + 3 × 4<br>A = 12 + 12<br>A = <b>24</b></p></div><div><p class="calc">B = (45 − 5) ÷ 8 + 7<br>B = 40 ÷ 8 + 7<br>B = 5 + 7<br>B = <b>12</b></p></div><div><p class="calc">C = 9 × 4 − 6 × 3<br>C = 36 − 18<br>C = <b>18</b></p></div><div><p class="calc">D = 50 − (2 + 4 × 6)<br>D = 50 − (2 + 24)<br>D = 50 − 26<br>D = <b>24</b></p></div><div><p class="calc">E = (14 − 2 × 5) × 7<br>E = (14 − 10) × 7<br>E = 4 × 7<br>E = <b>28</b></p></div><div><p class="calc">F = 3 × (6 + 4) − 8 ÷ 4<br>F = 3 × 10 − 8 ÷ 4<br>F = 30 − 2<br>F = <b>28</b></p></div></div>`},
  {n:"Exercice 22", t:"Placer des parenthèses", w:"Sur ton cahier", h:`<p>Recopie et place des parenthèses pour que l'égalité soit vraie.</p><p>a) 3 + 5 × 2 = 16 · b) 12 − 4 × 2 = 16 · c) 24 ÷ 6 + 2 = 3 · d) 10 + 2 × 3 = 36 · e) 7 × 4 − 2 = 14 · f) 30 − 10 + 5 = 15</p>`,
   c:`a) (3 + 5) × 2 = 8 × 2 = 16 · b) (12 − 4) × 2 = 8 × 2 = 16 · c) 24 ÷ (6 + 2) = 24 ÷ 8 = 3 · d) (10 + 2) × 3 = 12 × 3 = 36 · e) 7 × (4 − 2) = 7 × 2 = 14 · f) 30 − (10 + 5) = 30 − 15 = 15`},
  {n:"Exercice 23", t:"Calculer astucieusement", w:"Sur ton cahier", h:`<p><b>Exemple :</b></p><p class="calc">A = 13 × 7 + 13 × 3<br>A = 13 × (7 + 3)<br>A = 13 × 10<br>A = 130</p><p>Calcule de la même façon, en écrivant une étape par ligne.</p><div class="calcs"><span>B = 17 × 9 + 17 × 1</span><span>C = 45 × 6 − 35 × 6</span><span>D = 6 × 102</span><span>E = 12 × 99</span><span>F = 25 × 8 × 4</span><span>G = 32 × 11</span></div>`,
   c:`<div class="calcs"><div><p class="calc">B = 17 × 9 + 17 × 1<br>B = 17 × (9 + 1)<br>B = 17 × 10<br>B = <b>170</b></p></div><div><p class="calc">C = 45 × 6 − 35 × 6<br>C = (45 − 35) × 6<br>C = 10 × 6<br>C = <b>60</b></p></div><div><p class="calc">D = 6 × 102<br>D = 6 × 100 + 6 × 2<br>D = 600 + 12<br>D = <b>612</b></p></div><div><p class="calc">E = 12 × 99<br>E = 12 × 100 − 12 × 1<br>E = 1 200 − 12<br>E = <b>1 188</b></p></div><div><p class="calc">F = 25 × 8 × 4<br>F = (25 × 4) × 8<br>F = 100 × 8<br>F = <b>800</b></p></div><div><p class="calc">G = 32 × 11<br>G = 32 × 10 + 32 × 1<br>G = 320 + 32<br>G = <b>352</b></p></div></div>`},
  {n:"Exercice 24", t:"Les signes manquants", w:"Sur ton cahier", h:`<p>Remplace chaque ? par +, −, × ou ÷.</p><p>a) 5 ? 3 ? 2 = 13 · b) 8 ? 4 ? 2 = 16 · c) 20 ? 4 ? 3 = 8 · d) 15 ? 3 ? 4 = 9</p>`,
   c:`a) 5 × 3 − 2 = 15 − 2 = 13 · b) 8 × 4 ÷ 2 = 32 ÷ 2 = 16 (ou 8 + 4 × 2 = 8 + 8 = 16) · c) 20 ÷ 4 + 3 = 5 + 3 = 8 (ou 20 − 4 × 3 = 20 − 12 = 8) · d) 15 ÷ 3 + 4 = 5 + 4 = 9`}
 ]},
{t:"En ++ : Enquête au pays des nombres", e:[
  {n:"En ++", t:"Qui a agressé Madame 657 ?", w:"Sur ta feuille", h:`<p>« Hier soir, vers 20 h, quelqu'un s'est introduit chez moi et m'a volé plusieurs chiffres ! Aidez-moi à retrouver mon agresseur. »</p><p>Voici 14 suspects. Lis les six témoignages : chacun innocente certains suspects (barre-les). Le seul nombre jamais innocenté est le coupable !</p>
   <div class="scroll"><table class="std"><tbody><tr><td><b>A</b> 9 546 000</td><td><b>B</b> 70 800 990 777</td><td><b>C</b> 9 457 000</td><td><b>D</b> 1 282 531</td></tr><tr><td><b>E</b> 100 094 421</td><td><b>F</b> 872 108</td><td><b>G</b> 33 000 001 500</td><td><b>H</b> 82 787 963 124</td></tr><tr><td><b>I</b> 40 530 290 018</td><td><b>J</b> 2 386 752</td><td><b>K</b> 9 581 001</td><td><b>L</b> 570 608</td></tr><tr><td><b>M</b> 542 557</td><td><b>N</b> 524 578 571</td><td></td><td></td></tr></tbody></table></div>
   <p><b>Témoignage 1 :</b> les nombres dont le chiffre des dizaines de mille est 8 étaient à un tournoi de pétanque de 19 h à 21 h.</p>
   <p><b>Témoignage 2 :</b> le nombre huit-cent-soixante-douze-mille-cent-huit était avec le maire à 20 h 10, à l'autre bout de la ville.</p>
   <p><b>Témoignage 3 :</b> Monsieur neuf-millions-cinq-cent-quarante-six-mille et Madame neuf-millions-quatre-cent-cinquante-sept-mille ont dîné toute la soirée au restaurant de Madame (5 × 100 000) + (7 × 10 000) + (6 × 100) + 8.</p>
   <p><b>Témoignage 4 :</b> les nombres qui ont plus de 6 dizaines de milliards sont trop âgés pour cambrioler une maison.</p>
   <p><b>Témoignage 5 :</b> les nombres dont le chiffre des centaines de mille est égal au chiffre des centaines étaient au cours de fitness de 19 h 30 à 20 h 30, avec leur professeur trente-trois-milliards-mille-cinq-cents.</p>
   <p><b>Témoignage 6 :</b> le chef de la police, Monsieur (1 × 100 000 000) + (9 × 10 000) + (4 × 1 000) + (4 × 100) + (2 × 10) + 1, était à un gala de charité.</p><p>Le coupable est : ……</p>`,
   c:`<p><b>Témoignage 1 :</b> chiffre des dizaines de mille égal à 8 : D (1 2<b>8</b>2 531), J (2 3<b>8</b>6 752) et K (9 5<b>8</b>1 001). D, J et K sont innocents.</p>
   <p><b>Témoignage 2 :</b> huit-cent-soixante-douze-mille-cent-huit = 872 108 = F. F est innocent.</p>
   <p><b>Témoignage 3 :</b> 9 546 000 = A et 9 457 000 = C. La propriétaire du restaurant est 500 000 + 70 000 + 600 + 8 = 570 608 = L. A, C et L sont innocents.</p>
   <p><b>Témoignage 4 :</b> plus de 6 dizaines de milliards, c'est plus que 60 000 000 000 : B (70 800 990 777) et H (82 787 963 124). B et H sont innocents.</p>
   <p><b>Témoignage 5 :</b> chiffre des centaines de mille égal au chiffre des centaines : M (<b>5</b>42 <b>5</b>57) et N (524 <b>5</b>78 <b>5</b>71). Leur professeur est 33 000 001 500 = G. M, N et G sont innocents.</p>
   <p><b>Témoignage 6 :</b> 100 000 000 + 90 000 + 4 000 + 400 + 20 + 1 = 100 094 421 = E. E est innocent.</p>
   <p>Le seul suspect jamais innocenté est <b>I</b> : le coupable est <b>40 530 290 018</b> (quarante-milliards-cinq-cent-trente-millions-deux-cent-quatre-vingt-dix-mille-dix-huit).</p>`}
 ]}
],

/* ===================== QUIZ PROGRESSIF ===================== */
quiz: [
{nom:"Écrire les nombres", q:{
 1:[ {q:"Comment s'écrit 68 en lettres ?", c:["soixante-huit","soixante-dix-huit","six-cent-huit","soixante huit"], rep:"soixante-huit", ex:"On met un tiret entre chaque mot."},
     {q:"Écris en chiffres : deux-cent-quatre", rep:"204", ex:"Deux-cents, c'est 200, puis quatre : 204."},
     {q:"Écris en chiffres : neuf-mille-douze", rep:"9 012", ex:"9 mille et 12 unités : 9 012. Attention au zéro des centaines."} ],
 2:[ {q:"Comment s'écrit 400 en lettres ?", c:["quatre-cents","quatre-cent","quatres-cents","quatre cents"], rep:"quatre-cents", ex:"Rien après « cent » : il prend un s. Et un tiret entre les mots."},
     {q:"Comment s'écrit 84 en lettres ?", c:["quatre-vingt-quatre","quatre-vingts-quatre","quatre-vingt quatre","quatre-vingts quatre"], rep:"quatre-vingt-quatre", ex:"« quatre-vingt » est suivi de « quatre » : pas de s."},
     {q:"Écris en chiffres : soixante-quinze-mille-huit", rep:"75 008", ex:"75 mille et 8 unités : 75 008."},
     {q:"Écris en chiffres : trois-cent-mille", rep:"300 000", ex:"300 mille : 300 000."} ],
 3:[ {q:"Comment s'écrit 45 600 en lettres ?", c:["quarante-cinq-mille-six-cents","quarante-cinq-milles-six-cents","quarante-cinq-mille-six-cent","quarante-cinq-mille-six cents"], rep:"quarante-cinq-mille-six-cents", ex:"« mille » ne prend jamais de s, « six-cents » termine le nombre donc il prend un s."},
     {q:"Comment s'écrit 480 en lettres ?", c:["quatre-cent-quatre-vingts","quatre-cents-quatre-vingts","quatre-cent-quatre-vingt","quatre-cents-quatre-vingt"], rep:"quatre-cent-quatre-vingts", ex:"« cent » est suivi d'un autre nombre : pas de s. « quatre-vingts » termine le nombre : il prend un s."},
     {q:"Laquelle de ces écritures contient une erreur ?", c:["905 : neuf-cents-cinq","3 000 : trois-mille","803 : huit-cent-trois","80 : quatre-vingts"], rep:"905 : neuf-cents-cinq", ex:"« cent » est suivi de cinq : on écrit neuf-cent-cinq."},
     {q:"Écris en chiffres : sept-cent-mille-quatre-vingt-dix", rep:"700 090", ex:"700 mille et 90 unités : 700 090."} ]
}},
{nom:"Le tableau de numération", q:{
 1:[ {q:"Dans 3 917, quel est le chiffre des centaines ?", rep:"9", ex:"3 917 : 3 unités de mille, 9 centaines, 1 dizaine, 7 unités."},
     {q:"Dans 56 204, quel est le chiffre des dizaines de mille ?", rep:"5", ex:"Classe des mille : 56 → 5 dizaines de mille et 6 unités de mille."},
     {q:"Dans 7 381, quel est le chiffre des unités de mille ?", rep:"7", ex:"7 est seul dans la classe des mille : c'est le chiffre des unités de mille."} ],
 2:[ {q:"Dans 63 518 247, quel est le chiffre des centaines de mille ?", rep:"5", ex:"Classe des mille : 518 → le chiffre des centaines de mille est 5."},
     {q:"Dans 63 518 247, quel est le chiffre des unités de millions ?", rep:"3", ex:"Classe des millions : 63 → le chiffre des unités de millions est 3."},
     {q:"Vrai ou faux : dans 845 612, le chiffre 4 est le chiffre des dizaines de mille.", c:VF, rep:"Vrai", ex:"Classe des mille : 845 → 8 centaines de mille, 4 dizaines de mille, 5 unités de mille."} ],
 3:[ {q:"Écris le nombre qui a 4 centaines de millions, 8 unités de millions, 5 dizaines de mille et 6 unités.", rep:"408 050 006", ex:"On complète les rangs vides avec des zéros : 408 050 006."},
     {q:"Dans 351 408 056 491, quel est le chiffre des dizaines de milliards ?", rep:"5", ex:"Classe des milliards : 351 → 3 centaines, 5 dizaines, 1 unité de milliards."},
     {q:"Vrai ou faux : dans « deux-cent-quatre-millions », on met un « s » à millions.", c:VF, rep:"Vrai", ex:"« million » est un nom : il prend un s au pluriel, contrairement à « mille »."} ]
}},
{nom:"Décomposer un nombre", q:{
 1:[ {q:"Retrouve le nombre : 4 000 + 200 + 50 + 8", rep:"4 258"},
     {q:"Retrouve le nombre : 30 000 + 500 + 2", rep:"30 502", ex:"Pas de mille ni de dizaines : on écrit des zéros. 30 502."},
     {q:"Retrouve le nombre : 6 000 + 70 + 3", rep:"6 073", ex:"Pas de centaines : on écrit un zéro. 6 073."} ],
 2:[ {q:"Retrouve le nombre : 5 × 100 000 + 3 × 1 000 + 7 × 10 + 2 × 1", rep:"503 072", ex:"500 000 + 3 000 + 70 + 2 = 503 072."},
     {q:"Quelle est la bonne décomposition de 15 810 ?", c:["10 000 + 5 000 + 800 + 10","1 000 + 5 000 + 800 + 10","10 000 + 5 000 + 80 + 1","15 000 + 800 + 1"], rep:"10 000 + 5 000 + 800 + 10"},
     {q:"Retrouve le nombre : 9 × 10 000 + 1 × 1 000", rep:"91 000", ex:"90 000 + 1 000 = 91 000."} ],
 3:[ {q:"Retrouve le nombre : 6 000 000 + 30 000 + 900 + 4", rep:"6 030 904", ex:"6 millions, 30 mille, 904 unités : 6 030 904."},
     {q:"Quelle est la bonne décomposition de 907 605 ?", c:["9 × 100 000 + 7 × 1 000 + 6 × 100 + 5 × 1","9 × 100 000 + 7 × 10 000 + 6 × 100 + 5 × 1","9 × 10 000 + 7 × 1 000 + 6 × 100 + 5 × 1","9 × 100 000 + 7 × 1 000 + 6 × 10 + 5 × 1"], rep:"9 × 100 000 + 7 × 1 000 + 6 × 100 + 5 × 1", ex:"907 605 : 9 centaines de mille, 7 unités de mille, 6 centaines, 5 unités."},
     {q:"Retrouve le nombre : 3 × 100 000 000 + 2 × 1 000 000 + 4 × 10 000 + 1 × 100", rep:"302 040 100", ex:"300 000 000 + 2 000 000 + 40 000 + 100 = 302 040 100."} ]
}},
{nom:"Chiffre des… ou nombre de… ?", q:{
 1:[ {g:()=>{ const n=ri(1000,9999); return {q:`Dans ${sp(n)}, quel est le chiffre des centaines ?`, rep:String(Math.floor(n/100)%10), ex:`Le chiffre des centaines est un seul chiffre : ${Math.floor(n/100)%10}.`}; }},
     {g:()=>{ const n=ri(1000,9999); return {q:`Dans ${sp(n)}, quel est le nombre de centaines ?`, rep:sp(Math.floor(n/100)), ex:`On garde tous les chiffres jusqu'aux centaines : ${sp(Math.floor(n/100))}.`}; }} ],
 2:[ {g:()=>{ const n=ri(10000,99999); return {q:`Dans ${sp(n)}, quel est le nombre de dizaines ?`, rep:sp(Math.floor(n/10)), ex:`On garde tous les chiffres jusqu'aux dizaines : ${sp(Math.floor(n/10))}.`}; }},
     {g:()=>{ const n=ri(10000,99999); const ch=Math.floor(n/1000)%10, nb=Math.floor(n/1000); return {q:`Dans ${sp(n)}, le nombre d'unités de mille est…`, c:uniqC(sp(nb),[String(ch),sp(Math.floor(n/100)),sp(Math.floor(n/10))]), rep:sp(nb), ex:`Le chiffre des unités de mille est ${ch}, mais le nombre d'unités de mille est ${sp(nb)}.`}; }} ],
 3:[ {g:()=>{ const n=ri(101,999)*10+ri(1,9); return {q:`On range ${sp(n)} trombones dans des boîtes de 10. Combien de boîtes complètes peut-on remplir ?`, rep:sp(Math.floor(n/10)), ex:`C'est le nombre de dizaines de ${sp(n)} : ${sp(Math.floor(n/10))} boîtes (il reste ${n%10} trombone${n%10>1?"s":""}).`}; }},
     {g:()=>{ const n=ri(10,99)*1000+ri(101,999); return {q:`Un chocolatier a ${sp(n)} bonbons. Combien de boîtes complètes de 100 bonbons peut-il remplir ?`, rep:sp(Math.floor(n/100)), ex:`C'est le nombre de centaines de ${sp(n)} : ${sp(Math.floor(n/100))}.`}; }} ]
}},
{nom:"Comparer et ranger", q:{
 1:[ {g:()=>{ const a=ri(10000,99999), b=ri(100000,999999); const [x,y]=Math.random()<.5?[a,b]:[b,a]; const s=x<y?"&lt;":"&gt;"; return {q:`Complète : ${sp(x)} … ${sp(y)}`, c:["&lt;","&gt;","="], rep:s, ex:`Le nombre qui a le plus de chiffres est le plus grand.`}; }},
     {q:"Ranger dans l'ordre croissant, c'est ranger…", c:["du plus petit au plus grand","du plus grand au plus petit"], rep:"du plus petit au plus grand"} ],
 2:[ {g:()=>{ const a=ri(100000,999999); let b; do{ b=a+ri(-9,9)*pick([10,100,1000]); }while(b===a||b<100000||b>999999); const s=a<b?"&lt;":"&gt;"; return {q:`Complète : ${sp(a)} … ${sp(b)}`, c:["&lt;","&gt;","="], rep:s, ex:`Même nombre de chiffres : on compare de gauche à droite jusqu'au premier chiffre différent.`}; }},
     {g:()=>{ const n=ri(2,99)*1000; return {q:`Quel est l'entier qui précède ${sp(n)} ?`, rep:sp(n-1), ex:`${sp(n)} − 1 = ${sp(n-1)}.`}; }} ],
 3:[ {g:()=>{ const b=ri(1000,9999); const v=shuf([b, b+90, b+9, b+900]).map(sp); const s=[b,b+9,b+90,b+900].map(sp); return {q:`Quel est le plus grand de ces nombres : ${v.join(" ; ")} ?`, c:v, rep:s[3], ex:`Ils ont tous 4 ou 5 chiffres : on compare d'abord le nombre de chiffres, puis les chiffres de gauche à droite.`}; }},
     {g:()=>{ const n=ri(10,99)*10000+9999; return {q:`Quel est l'entier qui suit ${sp(n)} ?`, rep:sp(n+1), ex:`${sp(n)} + 1 = ${sp(n+1)}.`}; }} ]
}},
{nom:"Calculer astucieusement", q:{
 1:[ {g:()=>{ const a=ri(11,49), b=ri(1,9); return {q:`Calcule astucieusement : ${a} × ${b} + ${a} × ${10-b}`, rep:sp(a*10), ex:`${a} × (${b} + ${10-b}) = ${a} × 10 = ${sp(a*10)}.`}; }},
     {g:()=>{ const c=ri(2,9); return {q:`Calcule astucieusement : 25 × ${c} × 4`, rep:sp(100*c), ex:`25 × 4 = 100, donc 100 × ${c} = ${sp(100*c)}.`}; }} ],
 2:[ {g:()=>{ const a=ri(12,49); return {q:`Calcule : ${a} × 11`, rep:sp(a*11), ex:`${a} × 10 + ${a} × 1 = ${sp(a*10)} + ${a} = ${sp(a*11)}.`}; }},
     {g:()=>{ const a=ri(3,9); return {q:`Calcule : ${a} × 102`, rep:sp(a*102), ex:`${a} × 100 + ${a} × 2 = ${sp(a*100)} + ${2*a} = ${sp(a*102)}.`}; }} ],
 3:[ {g:()=>{ const a=ri(11,29); return {q:`Calcule : ${a} × 99`, rep:sp(a*99), ex:`${a} × 100 − ${a} × 1 = ${sp(a*100)} − ${a} = ${sp(a*99)}.`}; }},
     {g:()=>{ const a=ri(31,59), b=a-10, m=ri(3,9); return {q:`Calcule astucieusement : ${a} × ${m} − ${b} × ${m}`, rep:String(10*m), ex:`(${a} − ${b}) × ${m} = 10 × ${m} = ${10*m}.`}; }} ]
}},
{nom:"Demi-droite graduée", q:{
 1:[ {q:"Quelle est l'abscisse du point A ?", fig:ech(0,1,10,[["A",6]]), rep:"6"},
     {q:"Le point C a pour abscisse 12. Quelle est la bonne notation ?", c:["C(12)","C = 12","12(C)","C[12]"], rep:"C(12)", ex:"Le nom du point, puis son abscisse entre parenthèses."},
     {q:"Quelle est l'abscisse du point B ?", fig:ech(2000,100,10,[["B",4]]), rep:"2 400", ex:"La droite est graduée de 100 en 100 : B est 4 graduations après 2 000."} ],
 2:[ {q:"Quel est l'écart entre deux graduations ?", fig:axis({n:10, lab:[[0,"0"],[10,"1 000"]]}), rep:"100", ex:"1 000 ÷ 10 = 100."},
     {q:"Quelle est l'abscisse du point D ?", fig:axis({n:10, lab:[[0,"0"],[10,"30"]], pts:[["D",7]]}), rep:"21", ex:"Écart = 30 ÷ 10 = 3, et 7 × 3 = 21."},
     {q:"Quelle est l'abscisse du point E ?", fig:axis({n:10, lab:[[0,"0"],[5,"500"]], pts:[["E",8]]}), rep:"800", ex:"500 est 5 graduations après 0 : écart de 100. 8 × 100 = 800."} ],
 3:[ {q:"Quelle est l'abscisse du point F ?", fig:axis({n:12, lab:[[0,"0"],[12,"96"]], pts:[["F",5]]}), rep:"40", ex:"Écart = 96 ÷ 12 = 8, et 5 × 8 = 40."},
     {q:"Quelle est l'abscisse du point G ?", fig:axis({n:8, lab:[[0,"0"],[8,"2 400"]], pts:[["G",5]]}), rep:"1 500", ex:"Écart = 2 400 ÷ 8 = 300, et 5 × 300 = 1 500."},
     {q:"Quelle est l'abscisse du point K ?", fig:axis({n:9, lab:[[0,"0"],[9,"1 800 000"]], pts:[["K",4]]}), rep:"800 000", ex:"Écart = 1 800 000 ÷ 9 = 200 000, et 4 × 200 000 = 800 000."},
     {q:"Sur une demi-droite graduée de 0 à 2 400 avec 8 intervalles égaux, à quelle graduation place-t-on I(1 800) ?", c:["La 6e","La 5e","La 7e","La 18e"], rep:"La 6e", ex:"Écart = 2 400 ÷ 8 = 300, et 1 800 ÷ 300 = 6."} ]
}},
{nom:"Priorités opératoires", q:{
 1:[ {q:"Calcule : 4 + 3 × 2", rep:"10", ex:"La multiplication d'abord : 4 + 6 = 10."},
     {q:"Calcule : 20 ÷ 4 + 7", rep:"12", ex:"La division d'abord : 5 + 7 = 12."},
     {q:"Calcule : (6 + 4) × 3", rep:"30", ex:"Les parenthèses d'abord : 10 × 3 = 30."},
     {q:"Dans 10 − 3 × 2, quelle opération fait-on en premier ?", c:["La multiplication","La soustraction"], rep:"La multiplication", ex:"Les multiplications passent avant les soustractions : 10 − 6 = 4."} ],
 2:[ {q:"Calcule : 30 − 4 × 7", rep:"2", ex:"30 − 28 = 2."},
     {q:"Calcule : 3 × (8 + 7)", rep:"45", ex:"3 × 15 = 45."},
     {q:"Calcule : 40 ÷ 8 + 6 × 2", rep:"17", ex:"5 + 12 = 17."},
     {q:"Calcule : (12 + 8) ÷ 4 + 9", rep:"14", ex:"20 ÷ 4 + 9 = 5 + 9 = 14."} ],
 3:[ {q:"Calcule : 100 − (5 + 3) × (10 − 4)", rep:"52", ex:"100 − 8 × 6 = 100 − 48 = 52."},
     {q:"Calcule : 2 × (15 − 3 × 4)", rep:"6", ex:"Dans la parenthèse, la multiplication d'abord : 15 − 12 = 3, puis 2 × 3 = 6."},
     {q:"Calcule : 50 − (2 + 4 × 6)", rep:"24", ex:"50 − (2 + 24) = 50 − 26 = 24."},
     {q:"Calcule : (7 + 3) × (9 − 4)", rep:"50", ex:"10 × 5 = 50."} ]
}},
{nom:"Placer les parenthèses", q:{
 1:[ {q:"Dans (3 + 5) × 2, que calcule-t-on en premier ?", c:["3 + 5","5 × 2"], rep:"3 + 5", ex:"Les parenthèses d'abord : (3 + 5) × 2 = 8 × 2 = 16."},
     {q:"Calcule : (3 + 5) × 2", rep:"16", ex:"8 × 2 = 16."},
     {q:"Combien vaut 3 + 5 × 2 (sans parenthèses) ?", c:["13","16"], rep:"13", ex:"La multiplication d'abord : 3 + 10 = 13. Les parenthèses changent le résultat !"} ],
 2:[ {q:"Où placer les parenthèses pour que 10 + 2 × 3 = 36 ?", c:["(10 + 2) × 3","10 + (2 × 3)","10 + 2 × (3)"], rep:"(10 + 2) × 3", ex:"12 × 3 = 36."},
     {q:"Où placer les parenthèses pour que 12 − 4 × 2 = 16 ?", c:["(12 − 4) × 2","12 − (4 × 2)","Aucune parenthèse n'est utile"], rep:"(12 − 4) × 2", ex:"8 × 2 = 16."},
     {q:"Où placer les parenthèses pour que 7 × 4 − 2 = 14 ?", c:["7 × (4 − 2)","(7 × 4) − 2","Aucune parenthèse n'est utile"], rep:"7 × (4 − 2)", ex:"7 × 2 = 14."} ],
 3:[ {q:"Où placer les parenthèses pour que 40 ÷ 4 + 4 = 5 ?", c:["40 ÷ (4 + 4)","(40 ÷ 4) + 4","Aucune parenthèse n'est utile"], rep:"40 ÷ (4 + 4)", ex:"40 ÷ 8 = 5."},
     {q:"Où placer les parenthèses pour que 50 − 20 + 10 = 20 ?", c:["50 − (20 + 10)","(50 − 20) + 10","Aucune parenthèse n'est utile"], rep:"50 − (20 + 10)", ex:"50 − 30 = 20. Sans parenthèses, on trouverait 40."},
     {q:"Où placer les parenthèses pour que 5 × 6 − 2 + 1 = 21 ?", c:["5 × (6 − 2) + 1","(5 × 6) − (2 + 1)","5 × (6 − 2 + 1)"], rep:"5 × (6 − 2) + 1", ex:"5 × 4 + 1 = 20 + 1 = 21."},
     {q:"Quel signe manque ? 5 ? 3 − 2 = 13", c:["×","+","÷","−"], rep:"×", ex:"5 × 3 − 2 = 15 − 2 = 13."} ]
}}
],

/* ===================== ÉVAL D'ENTRAÎNEMENT (+ version aménagée pour les élèves à besoins particuliers) ===================== */
eval:{
titre:"Évaluation d'entraînement — Chapitre 1", duree:45, info:"Durée : 45 min · Calculatrice non autorisée",
comp:[
  ["CALCULER","Je calcule en respectant les priorités opératoires.","Ex. 1 (5 points)"],
  ["COMMUNIQUER","Je passe de l'écriture en chiffres à l'écriture en lettres, avec la bonne orthographe.","Ex. 2 (4 points)"],
  ["REPRÉSENTER","Je lis la valeur des chiffres, je décompose un nombre et j'utilise une demi-droite graduée.","Ex. 3 et 4 (8 points)"],
  ["CHERCHER","Je cherche où placer des parenthèses pour obtenir un résultat.","Ex. 5 (3 points)"]
],
exos:[
{t:"Calculer avec les priorités", p:5, h:`<p>Calcule. <b>Écris toutes les étapes.</b></p>
  <div class="calcs"><span>A = 18 − 3 × 4</span><span>B = 40 ÷ (2 + 6)</span><span>C = 7 + 24 ÷ 6 × 2</span><span>D = 3 × (12 − 5) + 9</span></div>
  <p>Pour finir, Tom a écrit : «&nbsp;20 − 2 × 5 = 90&nbsp;». A-t-il raison ? Explique, puis écris le bon calcul.</p>`,
 c:`<div class="calcs"><div><p class="calc">A = 18 − 3 × 4<br>A = 18 − 12<br>A = <b>6</b></p></div><div><p class="calc">B = 40 ÷ (2 + 6)<br>B = 40 ÷ 8<br>B = <b>5</b></p></div><div><p class="calc">C = 7 + 24 ÷ 6 × 2<br>C = 7 + 4 × 2<br>C = 7 + 8<br>C = <b>15</b></p></div><div><p class="calc">D = 3 × (12 − 5) + 9<br>D = 3 × 7 + 9<br>D = 21 + 9<br>D = <b>30</b></p></div></div>
  <p>Pour C : ÷ et × ont la même priorité, donc on calcule de gauche à droite (24 ÷ 6 d'abord). <i>(1 point par calcul, étapes comprises)</i></p>
  <p>Tom a tort. Il a calculé 20 − 2 = 18, puis 18 × 5 = 90. Mais la multiplication passe avant la soustraction : 20 − 2 × 5 = 20 − 10 = <b>10</b>. <i>(0,5 point pour l'explication, 0,5 point pour le bon calcul)</i></p>`},
{t:"Des chèques à remplir", p:4, h:`<p>Mme Diallo remplit des chèques. Sur un chèque, le montant s'écrit aussi en lettres.</p>
  <p>a) Écris en lettres : 300 € · 1 090 € · 72 015 €</p>
  <p>b) Écris en chiffres : six-cent-mille-quarante euros · trente-mille-huit-cents euros</p>
  <p>c) Vrai ou faux ? Si l'écriture est fausse, écris-la correctement.</p>
  <p>«&nbsp;cinq-cents&nbsp;» pour 500 · «&nbsp;quatre-vingts-dix&nbsp;» pour 90 · «&nbsp;deux-milles&nbsp;» pour 2 000</p>`,
 c:`<p>a) trois-cents (cent est multiplié par 3 et rien ne le suit : il prend un s) · mille-quatre-vingt-dix · soixante-douze-mille-quinze <i>(0,5 point par nombre)</i></p>
  <p>b) 600 mille et 40 unités : 600 040 · 30 mille et 800 unités : 30 800 <i>(0,5 point chacun)</i></p>
  <p>c) «&nbsp;cinq-cents&nbsp;» : vrai. «&nbsp;quatre-vingts-dix&nbsp;» : faux, on écrit quatre-vingt-dix (vingt est suivi de dix : pas de s). «&nbsp;deux-milles&nbsp;» : faux, on écrit deux-mille (mille ne prend jamais de s). <i>(0,5 point chacun)</i></p>`},
{t:"Lire et décomposer un nombre", p:4, h:`<p>1) On donne le nombre 58 137 260.</p><p>a) Quel est son chiffre des dizaines de mille ? b) Quel est son nombre de centaines ?</p>
  <p>2) Décompose 70 518 avec des multiplications par 10 000, 1 000, 100 et 10, comme dans le cours.</p>
  <p>3) Quel nombre s'écrit (4 × 1 000 000) + (9 × 10 000) + (6 × 10) ?</p>`,
 c:`<p>1) Je sépare les classes : 58 | 137 | 260. a) Dans la classe des mille (137), le chiffre des dizaines de mille est <b>3</b>. b) Je garde tous les chiffres jusqu'aux centaines : le nombre de centaines est <b>581 372</b>. <i>(0,5 point chacun)</i></p>
  <p class="calc">2) 70 518 = (7 × 10 000) + (5 × 100) + (1 × 10) + 8</p><p>On peut aussi écrire (0 × 1 000) : il n'y a pas d'unités de mille. <i>(1,5 point)</i></p>
  <p>3) 4 millions, 9 dizaines de mille et 6 dizaines : 4 000 000 + 90 000 + 60 = <b>4 090 060</b>. <i>(1,5 point)</i></p>`},
{t:"Lire et placer sur une graduation", p:4, h:`<p>1) Voici une demi-droite graduée.</p>
  ${axis({n:10, lab:[[0,"0"],[10,"200"]], pts:[["R",3],["S",7],["T",9]]})}
  <p>a) Combien vaut une petite graduation ? b) Donne l'abscisse de R, de S et de T. Utilise la notation du cours.</p>
  <p>2) Place les points U(1 500) et V(3 500) sur cette demi-droite graduée.</p>
  ${axis({n:8, lab:[[0,"0"],[8,"4 000"]]})}`,
 c:`<p>1) a) Il y a 10 intervalles entre 0 et 200 : 200 ÷ 10 = <b>20</b>. <i>(1 point)</i></p><p>b) R(60) ; S(140) ; T(180). <i>(0,5 point chacun)</i></p>
  <p>2) Il y a 8 intervalles entre 0 et 4 000 : 4 000 ÷ 8 = 500. U est à la 3<sup>e</sup> graduation (3 × 500 = 1 500), V à la 7<sup>e</sup> (7 × 500 = 3 500). <i>(0,5 point pour l'écart, 0,5 point par point bien placé)</i></p>
  ${axis({n:8, lab:[[0,"0"],[8,"4 000"]], pts:[["U",3],["V",7]]})}`},
{t:"Le bon résultat", p:3, h:`<p>Où faut-il mettre une paire de parenthèses pour obtenir le résultat indiqué ? Recopie chaque calcul avec les parenthèses, puis vérifie.</p>
  <p class="calc">a) 6 + 4 × 5 − 2 = 48<br>b) 6 + 4 × 5 − 2 = 18<br>c) 36 ÷ 6 − 2 + 1 = 3</p>`,
 c:`<p class="calc">a) (6 + 4) × 5 − 2 = 10 × 5 − 2 = 50 − 2 = 48<br>b) 6 + 4 × (5 − 2) = 6 + 4 × 3 = 6 + 12 = 18<br>c) 36 ÷ 6 − (2 + 1) = 6 − 3 = 3</p><p>Sans parenthèses, 6 + 4 × 5 − 2 = 6 + 20 − 2 = 24. <i>(1 point par égalité)</i></p>`}
],

/* ---------- version aménagée (tiers-temps) : le même sujet, environ un quart des questions en moins ---------- */
bep:{
titre:"Évaluation d'entraînement — Chapitre 1 · version aménagée", duree:45, info:"Version aménagée (tiers-temps) · Durée : 45 min · Calculatrice non autorisée",
note:"Le même sujet avec 4 questions en moins, à faire dans le même temps. Le total reste sur 20 points.",
comp:[
  ["CALCULER","Je calcule en respectant les priorités opératoires.","Ex. 1 (5 points)"],
  ["COMMUNIQUER","Je passe de l'écriture en chiffres à l'écriture en lettres, avec la bonne orthographe.","Ex. 2 (4 points)"],
  ["REPRÉSENTER","Je lis la valeur des chiffres, je décompose un nombre et j'utilise une demi-droite graduée.","Ex. 3 et 4 (8 points)"],
  ["CHERCHER","Je cherche où placer des parenthèses pour obtenir un résultat.","Ex. 5 (3 points)"]
],
exos:[
{t:"Calculer avec les priorités", p:5, h:`<p>Calcule. <b>Écris toutes les étapes.</b></p>
  <div class="calcs"><span>A = 18 − 3 × 4</span><span>B = 7 + 24 ÷ 6 × 2</span><span>C = 3 × (12 − 5) + 9</span></div>
  <p>Pour finir, Tom a écrit : «&nbsp;20 − 2 × 5 = 90&nbsp;». A-t-il raison ? Explique, puis écris le bon calcul.</p>`,
 c:`<div class="calcs"><div><p class="calc">A = 18 − 3 × 4<br>A = 18 − 12<br>A = <b>6</b></p></div><div><p class="calc">B = 7 + 24 ÷ 6 × 2<br>B = 7 + 4 × 2<br>B = 7 + 8<br>B = <b>15</b></p></div><div><p class="calc">C = 3 × (12 − 5) + 9<br>C = 3 × 7 + 9<br>C = 21 + 9<br>C = <b>30</b></p></div></div>
  <p>Pour B : ÷ et × ont la même priorité, donc on calcule de gauche à droite (24 ÷ 6 d'abord). <i>(1 point pour A, 1,5 point pour B, 1,5 point pour C, étapes comprises)</i></p>
  <p>Tom a tort. Il a calculé 20 − 2 = 18, puis 18 × 5 = 90. Mais la multiplication passe avant la soustraction : 20 − 2 × 5 = 20 − 10 = <b>10</b>. <i>(0,5 point pour l'explication, 0,5 point pour le bon calcul)</i></p>`},
{t:"Des chèques à remplir", p:4, h:`<p>Mme Diallo remplit des chèques. Sur un chèque, le montant s'écrit aussi en lettres.</p>
  <p>a) Écris en lettres : 300 € · 1 090 € · 72 015 €</p>
  <p>b) Écris en chiffres : six-cent-mille-quarante euros · trente-mille-huit-cents euros</p>`,
 c:`<p>a) trois-cents (cent est multiplié par 3 et rien ne le suit : il prend un s) · mille-quatre-vingt-dix · soixante-douze-mille-quinze <i>(1 point par nombre)</i></p>
  <p>b) 600 mille et 40 unités : 600 040 · 30 mille et 800 unités : 30 800 <i>(0,5 point chacun)</i></p>`},
{t:"Lire et décomposer un nombre", p:4, h:`<p>1) On donne le nombre 58 137 260.</p><p>a) Quel est son chiffre des dizaines de mille ? b) Quel est son nombre de centaines ?</p>
  <p>2) Décompose 70 518 avec des multiplications par 10 000, 1 000, 100 et 10, comme dans le cours.</p>`,
 c:`<p>1) Je sépare les classes : 58 | 137 | 260. a) Dans la classe des mille (137), le chiffre des dizaines de mille est <b>3</b>. b) Je garde tous les chiffres jusqu'aux centaines : le nombre de centaines est <b>581 372</b>. <i>(1 point chacun)</i></p>
  <p class="calc">2) 70 518 = (7 × 10 000) + (5 × 100) + (1 × 10) + 8</p><p>On peut aussi écrire (0 × 1 000) : il n'y a pas d'unités de mille. <i>(2 points)</i></p>`},
{t:"Lire et placer sur une graduation", p:4, h:`<p>1) Voici une demi-droite graduée.</p>
  ${axis({n:10, lab:[[0,"0"],[10,"200"]], pts:[["R",3],["S",7],["T",9]]})}
  <p>a) Combien vaut une petite graduation ? b) Donne l'abscisse de R, de S et de T. Utilise la notation du cours.</p>
  <p>2) Place les points U(1 500) et V(3 500) sur cette demi-droite graduée.</p>
  ${axis({n:8, lab:[[0,"0"],[8,"4 000"]]})}`,
 c:`<p>1) a) Il y a 10 intervalles entre 0 et 200 : 200 ÷ 10 = <b>20</b>. <i>(1 point)</i></p><p>b) R(60) ; S(140) ; T(180). <i>(0,5 point chacun)</i></p>
  <p>2) Il y a 8 intervalles entre 0 et 4 000 : 4 000 ÷ 8 = 500. U est à la 3<sup>e</sup> graduation (3 × 500 = 1 500), V à la 7<sup>e</sup> (7 × 500 = 3 500). <i>(0,5 point pour l'écart, 0,5 point par point bien placé)</i></p>
  ${axis({n:8, lab:[[0,"0"],[8,"4 000"]], pts:[["U",3],["V",7]]})}`},
{t:"Le bon résultat", p:3, h:`<p>Où faut-il mettre une paire de parenthèses pour obtenir le résultat indiqué ? Recopie chaque calcul avec les parenthèses, puis vérifie.</p>
  <p class="calc">a) 6 + 4 × 5 − 2 = 48<br>b) 6 + 4 × 5 − 2 = 18</p>`,
 c:`<p class="calc">a) (6 + 4) × 5 − 2 = 10 × 5 − 2 = 50 − 2 = 48<br>b) 6 + 4 × (5 − 2) = 6 + 4 × 3 = 6 + 12 = 18</p><p>Sans parenthèses, 6 + 4 × 5 − 2 = 6 + 20 − 2 = 24. <i>(1,5 point par égalité)</i></p>`}
]}
}
};
})();
