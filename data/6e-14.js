/* 6e — Chapitre 14 : Longueurs et périmètres (cours et fiche d'exercices de M. Staal)
   Périmètres sur quadrillage comptés sur ses figures ; longueurs de l'exercice 8 et du report au compas mesurées sur sa fiche. */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const co = (p,alt,w) => img("c614co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("c614ex/"+p+".png", alt, w);
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g," ");
/* décimal : entier n et k décimales, sans zéros inutiles */
const D = (n,k=0) => { const s=String(Math.abs(n)).padStart(k+1,"0"); const a=s.slice(0,s.length-k); let b=k?s.slice(-k):""; b=b.replace(/0+$/,""); return (n<0?"−":"")+sp(+a)+(b?","+b:""); };
const fr = x => String(x).replace(".",",");
/* calculs en chaîne : une étape par ligne, chaque ligne commence par « P = » (« P ≈ » pour une valeur arrondie) */
const KC = (nm, st, lab) => `<p class="calc">${st.map((t,i)=>(i===0&&lab?lab+" ":"")+nm+(t[0]==="≈"?" ≈ "+t.slice(1).trim():" = "+t)).join("<br>")}</p>`;
const KCS = arr => `<div class="calcs">${arr.map(x=>`<div>${x}</div>`).join("")}</div>`;

/* unités : index 0 = kilo … 6 = milli */
const U = { L:["km","hm","dam","m","dm","cm","mm"], M:["kg","hg","dag","g","dg","cg","mg"], C:["kL","hL","daL","L","dL","cL","mL"] };
/* conversion exacte : valeur n×10^-k dans l'unité i → unité j */
const conv = (n,k,i,j) => { const e = k + (i - j); return e>=0 ? D(n, e) : sp(n*10**(-e)); };
/* tableau de conversion (une ligne) */
function tabConv(t, rows){
  const H = U[t];
  return `<div class="scroll"><table class="std conv"><thead><tr>${H.map(h=>`<th>${h}</th>`).join("")}<th>Conversion</th></tr></thead><tbody>${rows.map(r=>`<tr>${H.map((_,c)=>`<td style="text-align:center">${r.cells[c]??""}</td>`).join("")}<td>${r.txt}</td></tr>`).join("")}</tbody></table></div>`;
}
window.FIG14 = {U, conv, D, tabConv};

/* ---------- schémas ---------- */
const S_PREF = sch("Les préfixes", `<div class="scroll"><table class="std"><tbody><tr><th>kilo</th><th>hecto</th><th>déca</th><th>unité</th><th>déci</th><th>centi</th><th>milli</th></tr><tr><td>1 000</td><td>100</td><td>10</td><td>1</td><td>un dixième</td><td>un centième</td><td>un millième</td></tr><tr><td>km</td><td>hm</td><td>dam</td><td>m</td><td>dm</td><td>cm</td><td>mm</td></tr></tbody></table></div><p class="schN">Chaque unité est 10 fois plus grande que celle juste à sa droite.</p>`);
const S_PER = sch("Le périmètre", co("potager","Le potager ABCD : 6,6 m, 3,2 m, 4,8 m et 7,4 m",220)+`<p class="calc">P = 6,6 + 3,2 + 4,8 + 7,4<br>P = 22 m</p><p class="schN">On additionne les longueurs de tous les côtés, <b>dans la même unité</b>.</p>`);
const S_FORM = sch("Formules", `<p class="calc">Carré : P = 4 × c<br>Rectangle : P = 2 × (L + l)<br>Triangle équilatéral : P = 3 × c</p>`);
const S_CERC = sch("La longueur d'un cercle", co("cercle","Un cercle, son rayon r et son diamètre d",170)+`<p class="calc">P = π × d &nbsp; ou &nbsp; P = 2 × π × r</p><p class="schN">π ≈ 3,14 : la longueur d'un cercle est un peu plus de 3 fois son diamètre.</p>`);

/* figure de l'activité 2 : un autre jardin de périmètre 38 m */
const jardin = (()=>{ const c=18, n=[14,10], pad=4, W=n[0]*c+2*pad, H=n[1]*c+2*pad; let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Un jardin rectangulaire de 12 m sur 7 m">`;
  for(let i=0;i<=n[0];i++) s+=`<line x1="${pad+i*c}" y1="${pad}" x2="${pad+i*c}" y2="${pad+n[1]*c}" style="stroke:#c9c9c9"/>`;
  for(let j=0;j<=n[1];j++) s+=`<line x1="${pad}" y1="${pad+j*c}" x2="${pad+n[0]*c}" y2="${pad+j*c}" style="stroke:#c9c9c9"/>`;
  return s+`<rect x="${pad+c}" y="${pad+c}" width="${12*c}" height="${7*c}" style="fill:rgba(29,122,70,.18);stroke:#1d7a46;stroke-width:3"/><text x="${pad+7*c}" y="${pad+5*c}" text-anchor="middle" style="font-size:14px;font-weight:700;fill:#1d7a46">12 m sur 7 m</text></svg>`; })();

CH["6e-14"] = {
intro:"Les préfixes des unités de mesure, convertir des longueurs, des masses et des contenances, comparer et calculer des périmètres, et calculer la longueur d'un cercle avec π.",
savoir:[
  "faire le lien entre les unités de numération (dixième, centième…) et les unités de mesure (dm, cg, mL…) ;",
  "convertir des longueurs, des masses et des contenances ;",
  "comparer des périmètres sans les calculer ;",
  "calculer le périmètre d'un polygone, d'un carré et d'un rectangle ;",
  "calculer la longueur d'un cercle."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Unités de numération et unités de mesure", h:`
  <h4>1. Les préfixes</h4>
  <p>Les unités de mesure sont construites avec des préfixes qui ont le même sens que les unités de numération (chapitre 5) :</p>
  <div class="retenir" data-l="À retenir"><div class="scroll"><table class="std"><thead><tr><th>Préfixe</th><th>kilo</th><th>hecto</th><th>déca</th><th></th><th>déci</th><th>centi</th><th>milli</th></tr></thead><tbody><tr><th>Signification</th><td>1 000</td><td>100</td><td>10</td><td>1</td><td>un dixième</td><td>un centième</td><td>un millième</td></tr><tr><th>Longueur</th><td>km</td><td>hm</td><td>dam</td><td>m</td><td>dm</td><td>cm</td><td>mm</td></tr><tr><th>Masse</th><td>kg</td><td>hg</td><td>dag</td><td>g</td><td>dg</td><td>cg</td><td>mg</td></tr><tr><th>Contenance</th><td>kL</td><td>hL</td><td>daL</td><td>L</td><td>dL</td><td>cL</td><td>mL</td></tr></tbody></table></div></div>
  <p><b>Exemples :</b> 1 dm est un dixième de mètre : 1 dm = 0,1 m. 1 cg est un centième de gramme : 1 cg = 0,01 g. 1 mL est un millième de litre : 1 mL = 0,001 L. 1 km = 1 000 m.</p>
  <div class="retenir" data-l="Propriété"><p>Chaque unité est <b>10 fois plus grande</b> que l'unité située juste à sa droite, et 10 fois plus petite que celle située juste à sa gauche.</p></div>
  <p><b>Remarque :</b> dans 3,47 m, le chiffre 4 est celui des dixièmes de mètre (dm) et le chiffre 7 celui des centièmes de mètre (cm) : 3,47 m = 3 m 4 dm 7 cm.</p>
  <h4>2. Convertir avec le tableau</h4>
  <div class="retenir" data-l="Méthode"><ol><li>Je place le nombre dans le tableau : le chiffre des unités va dans la colonne de l'unité de départ (un chiffre par colonne).</li><li>Je place la virgule juste après la colonne de la nouvelle unité, en complétant par des zéros si besoin.</li><li>Je lis le nombre obtenu.</li></ol></div>
  ${tabConv("L",[{cells:["","","","3,","4","7",""],txt:"3,47 m = 347 cm"},{cells:["2,","3","0","0","","",""],txt:"2 300 m = 2,3 km"},{cells:["","","","","","4,","5"],txt:"45 mm = 4,5 cm"}])}
  <p><b>Remarque :</b> on procède de la même façon pour les masses et les contenances : 1,5 L = 150 cL ; 250 g = 0,25 kg ; 3 dg = 0,3 g.</p>`},
{k:"II", t:"Comparer et mesurer des périmètres", h:`
  <div class="cpt"><div><div class="retenir" data-l="Définition"><p>Le <b>périmètre</b> d'une figure est la longueur de son contour.</p></div><p>Pour le mesurer, on fait « le tour » de la figure en ajoutant les longueurs de tous les morceaux du contour.</p></div>${co("perim","Une figure et son contour",200)}</div>
  <h4>1. Comparer sur un quadrillage</h4>
  <div class="cpt"><div><p>On compte le nombre de côtés de carreau qui forment le contour.</p><p>Figure 1 : 6 + 4 + 6 + 4 = 20 côtés de carreau.<br>Figure 2 : on trouve aussi 20 côtés de carreau.</p><p>Les deux figures ont le <b>même périmètre</b>, et pourtant elles n'ont pas la même forme.</p></div>${co("quad","Deux figures de même périmètre sur un quadrillage",300)}</div>
  <h4>2. Comparer avec le compas : le report de longueurs</h4>
  <p>Avec le compas, je reporte les longueurs des côtés les unes à la suite des autres sur une demi-droite : la longueur obtenue est le périmètre. Je peux ainsi comparer deux périmètres sans rien mesurer.</p>
  ${co("compas","Les côtés AB, BC et CA reportés bout à bout : le périmètre du triangle ABC",470)}`},
{k:"III", t:"Calculer le périmètre d'un polygone", h:`
  <div class="retenir" data-l="Propriété"><p>Le périmètre d'un polygone est égal à la <b>somme des longueurs de ses côtés</b>.</p></div>
  <p><b>Exemple :</b> Gustave veut clôturer son potager ABCD avec du grillage. Quelle longueur doit-il acheter ?</p>
  <div class="cpt"><p class="calc">P = AB + BC + CD + DA<br>P = 6,6 + 3,2 + 4,8 + 7,4<br>P = 22<br>Gustave doit acheter 22 m de grillage.</p>${co("potager","Le potager ABCD",230)}</div>
  <p class="attention"><b>ATTENTION :</b> avant de calculer, toutes les longueurs doivent être exprimées dans la même unité.</p>
  <p><b>Exemple :</b> calculer le périmètre du polygone ABCDE (figure à main levée).</p>
  <div class="cpt"><div><p>Je convertis tout en cm : 12 mm = 1,2 cm et 23 mm = 2,3 cm.</p><p class="calc">P = 2 + 1 + 1,2 + 2,3 + 1,2<br>P = 7,7</p><p>Le périmètre de ABCDE est 7,7 cm.</p></div>${co("abcde","Le polygone ABCDE à main levée",230)}</div>
  <h4>Formules à connaître</h4>
  <div class="retenir" data-l="Formules"><div class="scroll"><table class="std"><thead><tr><th>Figure</th><th>Périmètre</th><th>Exemple</th></tr></thead><tbody><tr><td>Carré de côté c</td><td><b>P = 4 × c</b></td><td>c = 5 cm :<br>P = 4 × 5<br>P = 20 cm</td></tr><tr><td>Rectangle de longueur L et de largeur l</td><td><b>P = 2 × (L + l)</b></td><td>L = 7,5 cm et l = 4 cm :<br>P = 2 × (7,5 + 4)<br>P = 2 × 11,5<br>P = 23 cm</td></tr><tr><td>Triangle équilatéral de côté c</td><td><b>P = 3 × c</b></td><td>c = 4,5 cm :<br>P = 3 × 4,5<br>P = 13,5 cm</td></tr></tbody></table></div></div>`},
{k:"IV", t:"La longueur d'un cercle", h:`
  <h4>1. Le nombre π</h4>
  <p>Depuis l'Antiquité, on sait que la longueur d'un cercle est toujours un peu plus de 3 fois son diamètre. Ce nombre, que l'on ne peut pas écrire en entier car il a une infinité de chiffres après la virgule, se note <b>π</b> (on lit « pi ») : π ≈ 3,14159…</p>
  <h4>2. Formule</h4>
  <div class="cpt"><div class="retenir" data-l="Formule"><p>La longueur (ou périmètre) d'un cercle de diamètre d et de rayon r est :</p><p class="calc">P = π × d &nbsp; ou &nbsp; P = 2 × π × r &nbsp; (car d = 2 × r)</p></div>${co("cercle","Un cercle, son rayon r et son diamètre d",190)}</div>
  <p>Sur la calculatrice, on utilise la touche π, puis on arrondit le résultat.</p>
  <p><b>Ordre de grandeur :</b> π ≈ 3, donc la longueur d'un cercle est environ 3 fois son diamètre.</p>
  <p><b>Exemple 1 :</b> une piscine ronde a un diamètre de 4,5 m. Longueur de son contour, arrondie au centième ?</p>${KC("P",["π × d","π × 4,5","≈ 14,14"])}<p>Le contour de la piscine mesure environ 14,14 m.</p>
  <p><b>Exemple 2 :</b> une cible a un rayon de 30 cm. Son périmètre, arrondi au dixième ?</p>${KC("P",["2 × π × r","2 × π × 30","≈ 188,5"])}<p>Le périmètre de la cible est environ 188,5 cm.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Unités de numération et unités de mesure", e:[
  {n:"Activité 1", t:"Que veulent dire les préfixes ?", w:"Sur ta feuille", h:`<p>Complète à l'aide du tableau du cours.</p><p>a) « déci » veut dire …… · b) « centi » veut dire …… · c) « milli » veut dire …… · d) « kilo » veut dire ……</p><p>e) 1 dg = un …… de g · f) 1 cL = un …… de L · g) 1 mm = un …… de m · h) 1 hm = …… m</p>`,
   c:`<p>a) un <b>dixième</b> · b) un <b>centième</b> · c) un <b>millième</b> · d) <b>mille</b> (1 000)</p><p>e) un <b>dixième</b> de g · f) un <b>centième</b> de L · g) un <b>millième</b> de m · h) 1 hm = <b>100</b> m</p>`},
  {n:"Exercice 1", t:"Des égalités", w:"Sur ta feuille", h:`<p>a) 1 m = …… dm · b) 1 dm = …… m · c) 1 cL = …… L · d) 1 kg = …… g · e) 1 mg = …… g · f) 1 hL = …… L · g) 1 dam = …… m · h) 1 L = …… mL</p>`,
   c:`<p>a) 1 m = <b>10</b> dm · b) 1 dm = <b>0,1</b> m · c) 1 cL = <b>0,01</b> L · d) 1 kg = <b>1 000</b> g</p><p>e) 1 mg = <b>0,001</b> g · f) 1 hL = <b>100</b> L · g) 1 dam = <b>10</b> m · h) 1 L = <b>1 000</b> mL</p>`},
  {n:"Exercice 2", t:"Convertir des longueurs", w:"Sur ta feuille", h:`<p>a) 4 cm = …… mm · b) 3,7 m = …… cm · c) 20 cm = …… m · d) 2 300 m = …… km · e) 52 mm = …… cm · f) 0,45 km = …… m · g) 1 250 cm = …… m · h) 0,06 m = …… mm</p><p>i) Un terrain de football mesure 0,1 km, c'est-à-dire …… m, ou encore …… dam, ou …… hm.</p>`,
   c:`<p>a) 1 cm = 10 mm : 4 × 10 = <b>40</b> mm · b) 1 m = 100 cm : 3,7 × 100 = <b>370</b> cm · c) 20 ÷ 100 = <b>0,2</b> m · d) 1 km = 1 000 m : 2 300 ÷ 1 000 = <b>2,3</b> km</p><p>e) 52 ÷ 10 = <b>5,2</b> cm · f) 0,45 × 1 000 = <b>450</b> m · g) 1 250 ÷ 100 = <b>12,5</b> m · h) 1 m = 1 000 mm : 0,06 × 1 000 = <b>60</b> mm</p><p>i) 0,1 km = <b>100</b> m = <b>10</b> dam = <b>1</b> hm.</p>${tabConv("L",[{cells:["","","","3,","7","0",""],txt:"3,7 m = 370 cm"},{cells:["","","","1","2,","5","0"],txt:"1 250 cm = 12,5 m"},{cells:["","","","0,","0","6","0"],txt:"0,06 m = 60 mm"}])}`},
  {n:"Exercice 3", t:"Masses et contenances", w:"Sur ta feuille", h:`<p>a) 2,5 kg = …… g · b) 750 g = …… kg · c) 3 dg = …… g · d) 1,5 L = …… cL · e) 33 cL = …… L · f) 250 mL = …… L · g) 4 hL = …… L · h) 0,8 g = …… mg</p>`,
   c:`<p>a) 1 kg = 1 000 g : 2,5 × 1 000 = <b>2 500</b> g · b) 750 ÷ 1 000 = <b>0,75</b> kg · c) 1 dg = 0,1 g : 3 ÷ 10 = <b>0,3</b> g · d) 1 L = 100 cL : 1,5 × 100 = <b>150</b> cL</p><p>e) 33 ÷ 100 = <b>0,33</b> L · f) 1 L = 1 000 mL : 250 ÷ 1 000 = <b>0,25</b> L · g) 1 hL = 100 L : 4 × 100 = <b>400</b> L · h) 1 g = 1 000 mg : 0,8 × 1 000 = <b>800</b> mg</p>`},
  {n:"Exercice 4", t:"Ranger des longueurs", w:"Sur ta feuille", h:`<p>Range ces longueurs dans l'ordre croissant. Commence par les convertir dans la même unité.</p><p class="calc">1,2 m ; 95 cm ; 0,013 km ; 1 050 mm ; 11 dm</p>`,
   c:`<p>En cm : 1,2 m = 120 cm ; 95 cm ; 0,013 km = 1 300 cm ; 1 050 mm = 105 cm ; 11 dm = 110 cm.</p><p class="calc"><b>95 cm &lt; 1 050 mm &lt; 11 dm &lt; 1,2 m &lt; 0,013 km</b></p>`},
  {n:"Exercice 5", t:"Problèmes", w:"Sur ta feuille", h:`<p><b>Problème 1 :</b> une bouteille contient 1,5 L de jus. Combien de verres de 25 cL peut-on remplir ?</p><p><b>Problème 2 :</b> un sac contient 2 kg de farine. Une recette de gâteau utilise 350 g de farine. Combien de gâteaux peut-on faire ? Quelle masse de farine restera-t-il ?</p>`,
   c:`<p><b>Problème 1 :</b> 1,5 L = 150 cL. 150 ÷ 25 = 6. On peut remplir <b>6 verres</b>.</p><p><b>Problème 2 :</b> 2 kg = 2 000 g. 2 000 = 350 × 5 + 250. On peut faire <b>5 gâteaux</b>, et il restera <b>250 g</b> de farine.</p>`}
 ]},
{t:"Comparer des périmètres", e:[
  {n:"Activité 2", t:"Le jardin", w:"Sur ta feuille", h:`<div class="cpt"><div><p>Le polygone vert représente un jardin. Chaque carreau du quadrillage a pour côté 1 m.</p><p>1) Quelle longueur de grillage faut-il pour clôturer entièrement le jardin ?</p><p>2) Dessine sur le quadrillage un autre jardin qui a le même périmètre, mais une autre forme.</p></div>${ex("act2","Le jardin vert sur le quadrillage",240)}</div>`,
   c:`<p>1) En faisant le tour, je compte les côtés de carreau : 3 + 3 + 7 + 3 + 3 + 4 + 2 + 2 + 5 + 6 = 38. Il faut <b>38 m</b> de grillage.</p><p>2) Par exemple, un rectangle de 12 m sur 7 m : 12 + 7 + 12 + 7 = 38 m. (Il y a beaucoup d'autres réponses possibles.)</p>${jardin}`},
  {n:"Exercice 6", t:"Comparer sans calculer", w:"Sur ta feuille", h:`<p>Sur le quadrillage, compte les côtés de carreau pour trouver le périmètre de chaque figure (en côtés de carreau).</p>${ex("e6","Quatre figures F1, F2, F3, F4 sur un quadrillage",490)}<p>Quelles figures ont le même périmètre ?</p>`,
   c:`<p>Je fais le tour de chaque figure en comptant les côtés de carreau :</p><p>F1 : 5 + 4 + 5 + 4 = <b>18</b><br>F2 : 6 + 6 + 2 + 2 + 2 + 2 + 2 + 6 = <b>28</b><br>F3 : 7 + 2 + 7 + 2 = <b>18</b><br>F4 : 2 + 2 + 3 + 2 + 3 + 2 + 2 + 2 + 3 + 2 + 3 + 2 = <b>28</b></p><p><b>F1 et F3</b> ont le même périmètre, ainsi que <b>F2 et F4</b>, alors qu'elles n'ont pas la même forme.</p>`},
  {n:"Exercice 7", t:"Comparer avec le compas", w:"Sur ta feuille", h:`<p>Sans rien mesurer, reporte au compas les côtés du triangle ABC sur la demi-droite [Ox), puis ceux du quadrilatère EFGH sur la demi-droite [Sy). Quelle figure a le plus grand périmètre ?</p>${ex("e7","Le triangle ABC, le quadrilatère EFGH et deux demi-droites",490)}`,
   c:`${ex("e7c","Les côtés reportés bout à bout sur les deux demi-droites",490)}<p>Le segment obtenu sur [Sy) est plus long : <b>le quadrilatère EFGH a le plus grand périmètre</b>. <i>(Sur la fiche : environ 10,4 cm pour EFGH et 9,3 cm pour ABC.)</i></p>`}
 ]},
{t:"Calculer un périmètre", e:[
  {n:"Exercice 8", t:"Mesurer puis calculer", w:"Sur ta feuille", h:`<div class="cpt"><div><p>Mesure les côtés du polygone MNPQR, puis calcule son périmètre.</p><p>MN = …… cm · NP = …… cm · PQ = …… cm · QR = …… cm · RM = …… cm</p></div>${ex("e8","Le polygone MNPQR en forme de maison",200)}</div>`,
   c:`<p>Sur la fiche imprimée : MN = <b>5 cm</b> · NP = <b>3 cm</b> · PQ = <b>3,5 cm</b> · QR = <b>3,5 cm</b> · RM = <b>3 cm</b>.</p><p class="calc">P = MN + NP + PQ + QR + RM<br>P = 5 + 3 + 3,5 + 3,5 + 3<br>P = 18 cm</p>`},
  {n:"Exercice 9", t:"Carrés et rectangles", w:"Sur ta feuille", h:`<p>1) Calcule le périmètre d'une salle carrée de 6,5 m de côté.</p><p>2) Une feuille A4 est un rectangle de 21 cm sur 29,7 cm. Calcule son périmètre.</p><p>3) Calcule le périmètre d'un rectangle de longueur 1,2 m et de largeur 80 cm. Attention aux unités !</p>`,
   c:`${KCS([KC("P",["4 × 6,5","<b>26 m</b>"],"1)"), KC("P",["2 × (29,7 + 21)","2 × 50,7","<b>101,4 cm</b>"],"2)")])}<p>3) 1,2 m = 120 cm.</p>${KC("P",["2 × (120 + 80)","2 × 200","<b>400 cm</b>, soit 4 m"])}`},
  {n:"Exercice 10", t:"Des polygones", w:"Sur ta feuille", h:`<p>Les figures sont faites à main levée. Calcule le périmètre de chaque polygone. Pour le polygone 1, donne le résultat en cm.</p>${ex("e10","Polygone 1 avec des longueurs en dm, cm et mm ; polygone 2 en forme de L",490)}`,
   c:`<p><b>Polygone 1 :</b> je convertis en cm : 0,3 dm = 3 cm et 18 mm = 1,8 cm.</p><p class="calc">P = 3 + 4 + 1,8 + 2,5 + 3 + 2<br>P = 16,3 cm</p><p><b>Polygone 2 :</b></p><p class="calc">P = 5 + 4 + 3 + 2 + 8 + 6<br>P = 28 m</p>`},
  {n:"Exercice 11", t:"Retrouver une longueur", w:"Sur ta feuille", h:`<p>1) Un terrain carré a un périmètre de 24 m. Longueur de son côté ?</p><p>2) Un autre terrain carré a un périmètre de 25 m. Longueur de son côté ?</p><p>3) Un rectangle a un périmètre de 30 cm et une longueur de 9 cm. Sa largeur ?</p><p>4) Un triangle équilatéral a un périmètre de 13,5 cm. Longueur de ses côtés ?</p>`,
   c:`<p>1) 24 ÷ 4 = <b>6 m</b>.</p><p>2) 25 ÷ 4 = <b>6,25 m</b>.</p><p>3) La longueur et la largeur font la moitié du périmètre : 30 ÷ 2 = 15 cm. Largeur : 15 − 9 = <b>6 cm</b>.</p><p>4) 13,5 ÷ 3 = <b>4,5 cm</b>.</p>`},
  {n:"Exercice 12", t:"Clôturer un champ", w:"Sur ta feuille", h:`<p>Un champ rectangulaire mesure 120 m sur 75 m. Le fermier veut l'entourer avec 3 rangées de fil.</p><p>1) Quelle longueur de fil lui faut-il ?</p><p>2) Le fil est vendu en rouleaux de 250 m. Combien de rouleaux doit-il acheter ?</p>`,
   c:`<p>1) Le périmètre P :</p><p class="calc">P = 2 × (120 + 75)<br>P = 2 × 195<br>P = 390 m</p><p>Avec 3 rangées : 3 × 390 = <b>1 170 m</b> de fil.</p><p>2) 1 170 = 250 × 4 + 170 : 4 rouleaux ne suffisent pas (il manque 170 m). Il doit acheter <b>5 rouleaux</b>.</p>`}
 ]},
{t:"La longueur d'un cercle", e:[
  {n:"Activité 3", t:"Des objets ronds", w:"Sur ta feuille", h:`<p>Avec un mètre de couturière, mesure le diamètre et le tour de quatre objets ronds (boîte, verre, rouleau…). Complète, puis calcule le quotient du tour par le diamètre à la calculatrice.</p><div class="scroll"><table class="std"><thead><tr><th>Objet</th><th>Diamètre d</th><th>Tour P</th><th>P ÷ d (arrondi au dixième)</th></tr></thead><tbody><tr><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr></tbody></table></div><p>Que remarques-tu ?</p>`,
   c:`<p>Exemple : un verre de diamètre 7 cm a un tour d'environ 22 cm : 22 ÷ 7 ≈ 3,1.</p><p>Pour tous les objets, on trouve un quotient d'environ <b>3,1</b> : le tour d'un cercle est toujours un peu plus de 3 fois son diamètre. Ce nombre est <b>π</b> (π ≈ 3,14).</p>`},
  {n:"Exercice 13", t:"Calculer la longueur d'un cercle", w:"Sur ta feuille", h:`${ex("e13","a) cercle de centre O et de rayon 3 cm ; b) cercle de centre I et de diamètre 10 cm",330)}<p>1) Sans calculatrice, donne un ordre de grandeur de la longueur de chaque cercle (prends π ≈ 3).</p><p>2) Calcule la longueur de chaque cercle, arrondie à l'unité. Rédige tes calculs.</p>`,
   c:`<p>1) a) Le diamètre est 6 cm : environ 3 × 6 = <b>18 cm</b>. b) Environ 3 × 10 = <b>30 cm</b>.</p><p>2)</p>${KCS([KC("P",["2 × π × r","2 × π × 3","≈ 18,85","≈ <b>19 cm</b>"],"a)"), KC("P",["π × d","π × 10","≈ 31,42","≈ <b>31 cm</b>"],"b)")])}`},
  {n:"Exercice 14", t:"Des problèmes", w:"Sur ta feuille", h:`<p><b>Problème 1 :</b> le cadran de la montre de Nina est un cercle de 2,3 cm de diamètre. Calcule sa longueur, arrondie au dixième.</p><p><b>Problème 2 :</b> le rond central d'un terrain de football a un rayon de 9,15 m. Calcule sa longueur, arrondie au centième.</p><p><b>Problème 3 :</b> une roue de vélo a un diamètre de 70 cm. Quelle distance parcourt le vélo quand la roue fait 1 tour ? Et 100 tours ? Donne les résultats arrondis au dixième.</p>`,
   c:`<p><b>Problème 1 :</b> la longueur P du cadran :</p><p class="calc">P = π × 2,3<br>P ≈ 7,23</p><p>La longueur du cadran est environ <b>7,2 cm</b>.</p><p><b>Problème 2 :</b> la longueur P du rond central :</p><p class="calc">P = 2 × π × 9,15<br>P ≈ 57,491</p><p>Le rond central mesure environ <b>57,49 m</b>.</p><p><b>Problème 3 :</b> en 1 tour, le vélo parcourt la longueur P de la roue :</p><p class="calc">P = π × 70<br>P ≈ 219,91</p><p>Soit environ <b>219,9 cm</b>. En 100 tours, la distance d :</p><p class="calc">d = 100 × π × 70<br>d ≈ 21 991,15</p><p>Soit environ <b>21 991,1 cm</b> (environ 220 m).</p>`},
  {n:"Exercice 15", t:"Demi-cercle et piste", w:"Sur ta feuille", h:`<div class="cpt"><p>1) Calcule le périmètre de cette figure, formée d'un demi-cercle et du segment [AB]. Arrondis au dixième.</p>${ex("e15a","Un demi-cercle de diamètre AB = 6 cm",170)}</div><div class="cpt"><p>2) Une piste d'athlétisme est formée de deux lignes droites de 85 m et de deux demi-cercles de 73 m de diamètre. Calcule la longueur d'un tour, arrondie au mètre.</p>${ex("e15b","Une piste : deux lignes droites de 85 m et deux demi-cercles de 73 m de diamètre",210)}</div>`,
   c:`<p>1) Le demi-cercle mesure la moitié d'un cercle de diamètre 6 cm : π × 6 ÷ 2 ≈ 9,42 cm. On ajoute le segment [AB] : P ≈ 9,42 + 6 = 15,42, soit environ <b>15,4 cm</b>.</p><p>2) Les deux demi-cercles forment un cercle entier de diamètre 73 m : π × 73 ≈ 229,34 m. On ajoute les deux lignes droites : 229,34 + 2 × 85 = 399,34. Un tour mesure environ <b>399 m</b>.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Les préfixes", schema:S_PREF, q:{
 1:[ {g:()=>{ const p=pick([["déci","un dixième"],["centi","un centième"],["milli","un millième"],["kilo","mille"],["hecto","cent"],["déca","dix"]]); return {q:`Que veut dire le préfixe « ${p[0]} » ?`, c:shuf(uniq(p[1],["un dixième","un centième","un millième","mille","cent","dix"].filter(x=>x!==p[1]).slice(0,2))), rep:p[1], sx:S_PREF}; }} ],
 2:[ {g:()=>{ const p=pick([["1 dm","0,1 m"],["1 cm","0,01 m"],["1 mm","0,001 m"],["1 cL","0,01 L"],["1 mg","0,001 g"],["1 dg","0,1 g"]]); return {q:`${p[0]} = ?`, c:shuf(uniq(p[1],["0,1 "+p[1].slice(-1),"0,01 "+p[1].slice(-1),"0,001 "+p[1].slice(-1),"10 "+p[1].slice(-1)]).slice(0,3)), rep:p[1], sx:S_PREF}; }} ],
 3:[ {q:"Dans 3,47 m, quel chiffre est celui des centimètres ?", c:["7","4","3"], rep:"7", ex:"3,47 m = 3 m 4 dm 7 cm.", sx:S_PREF} ]
}},
{nom:"Convertir", schema:S_PREF, q:{
 1:[ {g:()=>{ const t=pick(["L","M","C"]), i=ri(3,5), j=i+1, n=ri(2,95); return {q:`${n} ${U[t][i]} = … ${U[t][j]}`, rep:conv(n,0,i,j), sx:S_PREF}; }} ],
 2:[ {g:()=>{ const t=pick(["L","M","C"]); const i=pick([0,3,3,5]); let j=pick([3,5,6,0].filter(x=>x!==i)); const k=pick([0,1,2]), n=ri(11,999); return {q:`${D(n,k)} ${U[t][i]} = … ${U[t][j]}`, rep:conv(n,k,i,j), sx:S_PREF}; }} ],
 3:[ {g:()=>{ const t=pick(["L","M","C"]); const i=ri(0,6); let j; do{ j=ri(0,6); }while(Math.abs(i-j)<2); const k=pick([0,1,2]), n=ri(2,9999); return {q:`${D(n,k)} ${U[t][i]} = … ${U[t][j]}`, rep:conv(n,k,i,j), sx:S_PREF}; }} ]
}},
{nom:"Périmètre d'un polygone", schema:S_PER, q:{
 1:[ {g:()=>{ const c=ri(2,15); return {q:`Quel est le périmètre d'un carré de côté ${c} cm (en cm) ?`, rep:String(4*c), sx:S_FORM}; }},
     {g:()=>{ const L=ri(5,15), l=ri(2,L-1); return {q:`Quel est le périmètre d'un rectangle de ${L} cm sur ${l} cm (en cm) ?`, rep:String(2*(L+l)), ex:`2 × (${L} + ${l}) = ${2*(L+l)}.`, sx:S_FORM}; }} ],
 2:[ {g:()=>{ let a, b, c; do{ a=ri(11,60); b=ri(11,60); c=ri(11,60); }while(2*Math.max(a,b,c)>=a+b+c); return {q:`Un triangle a des côtés de ${D(a,1)} cm, ${D(b,1)} cm et ${D(c,1)} cm. Son périmètre (en cm) ?`, rep:D(a+b+c,1), sx:S_PER}; }},
     {g:()=>{ const L=ri(11,30), lm=10*ri(3,9); return {q:`Rectangle : longueur ${D(L,1)} m, largeur ${lm} cm. Son périmètre (en m) ?`, rep:D(2*(L*10+lm),2), ex:`${lm} cm = ${D(lm,2)} m. 2 × (${D(L,1)} + ${D(lm,2)}) = ${D(2*(L*10+lm),2)}.`, sx:S_PER}; }} ],
 3:[ {g:()=>{ const c=ri(3,12)*4+pick([0,1,2,3]); return {q:`Un carré a un périmètre de ${c} m. Longueur de son côté (en m) ?`, rep:D(c*25,2), ex:`${c} ÷ 4 = ${D(c*25,2)}.`, sx:S_FORM}; }},
     {g:()=>{ const L=ri(6,15), l=ri(2,L-1), P=2*(L+l); return {q:`Un rectangle a un périmètre de ${P} cm et une longueur de ${L} cm. Sa largeur (en cm) ?`, rep:String(l), ex:`${P} ÷ 2 = ${L+l} ; ${L+l} − ${L} = ${l}.`, sx:S_FORM}; }} ]
}},
{nom:"Longueur d'un cercle", schema:S_CERC, q:{
 1:[ {q:"La longueur d'un cercle de diamètre d est…", c:["π × d","2 × d","π × d × d"], rep:"π × d", sx:S_CERC},
     {g:()=>{ const d=ri(2,20); return {q:`Ordre de grandeur de la longueur d'un cercle de diamètre ${d} cm (avec π ≈ 3) ?`, c:shuf(uniq(`${3*d} cm`,[`${2*d} cm`,`${d+3} cm`,`${6*d} cm`])), rep:`${3*d} cm`, sx:S_CERC}; }} ],
 2:[ {g:()=>{ const d=ri(2,30); return {q:`Longueur d'un cercle de diamètre ${d} cm, arrondie à l'unité (en cm) ?`, rep:String(Math.round(Math.PI*d)), ex:`π × ${d} ≈ ${fr((Math.PI*d).toFixed(2))}.`, sx:S_CERC}; }} ],
 3:[ {g:()=>{ const r=ri(2,25); return {q:`Longueur d'un cercle de rayon ${r} m, arrondie au dixième (en m) ?`, rep:fr((Math.round(20*Math.PI*r)/10).toFixed(1)).replace(/,0$/,""), ex:`2 × π × ${r} ≈ ${fr((2*Math.PI*r).toFixed(2))}.`, sx:S_CERC}; }},
     {q:"Le nombre π vaut environ…", c:["3,14","4","22"], rep:"3,14", sx:S_CERC} ]
}}
],
/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
/* petites figures (sans valeur de mesure : figures à main levée) */
const cerc=d=>`<svg class="fig" viewBox="0 0 190 165" width="190" role="img" aria-label="Un cercle et son diamètre de ${d}"><circle cx="95" cy="82" r="66" style="fill:rgba(31,109,176,.08);stroke:var(--ink);stroke-width:2.5"/><line x1="29" y1="82" x2="161" y2="82" style="stroke:var(--ink);stroke-width:2"/><circle cx="95" cy="82" r="3.5" style="fill:#1f6db0"/><text x="95" y="73" text-anchor="middle" style="font-size:14px;font-weight:700;fill:var(--ink)">${d}</text></svg>`;
const quad=`<svg class="fig" viewBox="0 0 240 190" width="240" role="img" aria-label="Un quadrilatère à main levée : côtés de 1,2 dm ; 9 cm ; 75 mm et 10 cm"><g transform="translate(45,12)"><polygon points="20,140 140,140 111.2,54.7 37.4,41.5" style="fill:rgba(29,122,70,.12);stroke:#1d7a46;stroke-width:2.5;stroke-linejoin:round"/><text x="80" y="160" text-anchor="middle" style="font-size:14px;font-weight:700;fill:var(--ink)">1,2 dm</text><text x="134" y="98" style="font-size:14px;font-weight:700;fill:var(--ink)">9 cm</text><text x="74" y="38" text-anchor="middle" style="font-size:14px;font-weight:700;fill:var(--ink)">75 mm</text><text x="24" y="95" text-anchor="end" style="font-size:14px;font-weight:700;fill:var(--ink)">10 cm</text></g><text x="120" y="186" text-anchor="middle" style="font-size:12px;font-style:italic;fill:var(--ink)">figure à main levée</text></svg>`;
const encl=(L,l)=>`<svg class="fig" viewBox="0 0 250 150" width="250" role="img" aria-label="L'enclos rectangulaire de ${L} sur ${l}"><rect x="40" y="15" width="180" height="105" style="fill:rgba(29,122,70,.15);stroke:#1d7a46;stroke-width:2.5;stroke-dasharray:7 4"/><text x="130" y="140" text-anchor="middle" style="font-size:14px;font-weight:700;fill:var(--ink)">${L}</text><text x="34" y="72" text-anchor="end" style="font-size:14px;font-weight:700;fill:var(--ink)">${l}</text></svg>`;
return {
titre:"Évaluation d'entraînement — Chapitre 14", duree:25, info:"Durée : 25 min · Calculatrice autorisée",
comp:[
  ["CALCULER","Je calcule la longueur d'un cercle.","Ex. 1 (2 points)"],
  ["CALCULER","Je convertis des longueurs.","Ex. 2 (3 points)"],
  ["CALCULER","Je calcule le périmètre d'un polygone.","Ex. 3 (3 points)"],
  ["MODÉLISER","Je résous un problème de périmètre.","Ex. 4 (2 points)"]
],
exos:[
{t:"Le cerceau", p:2, h:`<p>Un cerceau de gymnastique est un cercle de 80 cm de diamètre.</p><p>Calcule la longueur du cerceau. Donne le résultat arrondi au centimètre.</p>${cerc("80 cm")}`,
 c:`<p>Pour un cercle de diamètre d, la longueur est P = π × d. <i>(0,5 point)</i></p>${KC("P",["π × d","π × 80","≈ 251,33","≈ 251"])}<p><i>(1 point pour le calcul)</i></p><p><b>Le cerceau mesure environ 251 cm.</b> <i>(0,5 point pour l'arrondi et la phrase)</i></p>`},
{t:"Des conversions", p:3, h:`<p>Complète.</p><p>a) 4,7 km = …… m · b) 82 cm = …… m · c) 6 dm = …… mm · d) 3 050 mm = …… m · e) 0,25 m = …… cm · f) 90 m = …… hm</p>`,
 c:`<p>a) 1 km = 1 000 m : 4,7 × 1 000 = <b>4 700 m</b> · b) 1 m = 100 cm : 82 ÷ 100 = <b>0,82 m</b> · c) 1 dm = 100 mm : 6 × 100 = <b>600 mm</b></p><p>d) 1 m = 1 000 mm : 3 050 ÷ 1 000 = <b>3,05 m</b> · e) 0,25 × 100 = <b>25 cm</b> · f) 1 hm = 100 m : 90 ÷ 100 = <b>0,9 hm</b></p>${tabConv("L",[{cells:["","","","3,","0","5","0"],txt:"3 050 mm = 3,05 m"},{cells:["","0,","9","0","","",""],txt:"90 m = 0,9 hm"}])}<p><i>0,5 point par conversion.</i></p>`},
{t:"Calculer des périmètres", p:3, h:`<p>Calcule le périmètre de chaque figure. Écris tes calculs.</p><p>a) Une piste carrée de 8,5 m de côté.</p><p>b) Un rectangle de longueur 12,4 cm et de largeur 9 cm.</p><p>c) Un quadrilatère dont les côtés mesurent 1,2 dm ; 9 cm ; 75 mm et 10 cm. Donne le résultat en cm.</p>${quad}`,
 c:`${KCS([KC("P",["4 × c","4 × 8,5","<b>34 m</b>"],"a)"), KC("P",["2 × (L + l)","2 × (12,4 + 9)","2 × 21,4","<b>42,8 cm</b>"],"b)")])}<p><i>(1 point chacun)</i></p>
  <p>c) Je convertis tout en cm : 1,2 dm = 12 cm et 75 mm = 7,5 cm.</p>${KC("P",["12 + 9 + 7,5 + 10","<b>38,5 cm</b>"])}<p><i>(0,5 point pour les conversions, 0,5 point pour le calcul)</i></p>`},
{t:"L'enclos des moutons", p:2, h:`<p>Un enclos pour des moutons a la forme d'un rectangle de 35 m sur 22 m. Le fermier veut en faire le tour avec du grillage. Le grillage est vendu en rouleaux de 25 m.</p><p>Combien de rouleaux doit-il acheter ? Justifie.</p>${encl("35 m","22 m")}`,
 c:`<p>Je calcule le périmètre de l'enclos :</p>${KC("P",["2 × (35 + 22)","2 × 57","114 m"])}<p><i>(1 point)</i></p><p>114 ÷ 25 = 4,56 : 4 rouleaux font 100 m, ce n'est pas assez. Il faut un rouleau de plus.</p><p><b>Le fermier doit acheter 5 rouleaux.</b> <i>(1 point)</i></p>`}
],
bep:{
titre:"Évaluation d'entraînement — Chapitre 14 · version aménagée", duree:25, info:"Version aménagée (tiers-temps) · Durée : 25 min · Calculatrice autorisée",
note:"Le même sujet avec 3 questions en moins, à faire dans le même temps. Le total reste sur 10 points.",
comp:[
  ["CALCULER","Je calcule la longueur d'un cercle.","Ex. 1 (2 points)"],
  ["CALCULER","Je convertis des longueurs.","Ex. 2 (3 points)"],
  ["CALCULER","Je calcule le périmètre d'un polygone.","Ex. 3 (3 points)"],
  ["MODÉLISER","Je résous un problème de périmètre.","Ex. 4 (2 points)"]
],
exos:[
{t:"Le cerceau", p:2, h:`<p>Un cerceau de gymnastique est un cercle de 80 cm de diamètre.</p><p>Calcule la longueur du cerceau. Donne le résultat arrondi au centimètre.</p>${cerc("80 cm")}`,
 c:`<p>Pour un cercle de diamètre d, la longueur est P = π × d. <i>(0,5 point)</i></p>${KC("P",["π × d","π × 80","≈ 251,33","≈ 251"])}<p><i>(1 point pour le calcul)</i></p><p><b>Le cerceau mesure environ 251 cm.</b> <i>(0,5 point pour l'arrondi et la phrase)</i></p>`},
{t:"Des conversions", p:3, h:`<p>Complète.</p><p>a) 4,7 km = …… m · b) 6 dm = …… mm · c) 3 050 mm = …… m · d) 90 m = …… hm</p>`,
 c:`<p>a) 1 km = 1 000 m : 4,7 × 1 000 = <b>4 700 m</b> · b) 1 dm = 100 mm : 6 × 100 = <b>600 mm</b></p><p>c) 1 m = 1 000 mm : 3 050 ÷ 1 000 = <b>3,05 m</b> · d) 1 hm = 100 m : 90 ÷ 100 = <b>0,9 hm</b></p>${tabConv("L",[{cells:["","","","3,","0","5","0"],txt:"3 050 mm = 3,05 m"},{cells:["","0,","9","0","","",""],txt:"90 m = 0,9 hm"}])}<p><i>0,75 point par conversion.</i></p>`},
{t:"Calculer des périmètres", p:3, h:`<p>Calcule le périmètre de chaque figure. Écris tes calculs.</p><p>a) Un rectangle de longueur 12,4 cm et de largeur 9 cm.</p><p>b) Un quadrilatère dont les côtés mesurent 1,2 dm ; 9 cm ; 75 mm et 10 cm. Donne le résultat en cm.</p>${quad}`,
 c:`${KC("P",["2 × (L + l)","2 × (12,4 + 9)","2 × 21,4","<b>42,8 cm</b>"],"a)")}<p><i>(1,5 point)</i></p>
  <p>b) Je convertis tout en cm : 1,2 dm = 12 cm et 75 mm = 7,5 cm.</p>${KC("P",["12 + 9 + 7,5 + 10","<b>38,5 cm</b>"])}<p><i>(0,5 point pour les conversions, 1 point pour le calcul)</i></p>`},
{t:"L'enclos des moutons", p:2, h:`<p>Un enclos pour des moutons a la forme d'un rectangle de 35 m sur 22 m. Le fermier veut en faire le tour avec du grillage. Le grillage est vendu en rouleaux de 25 m.</p><p>Combien de rouleaux doit-il acheter ? Justifie.</p>${encl("35 m","22 m")}`,
 c:`<p>Je calcule le périmètre de l'enclos :</p>${KC("P",["2 × (35 + 22)","2 × 57","114 m"])}<p><i>(1 point)</i></p><p>114 ÷ 25 = 4,56 : 4 rouleaux font 100 m, ce n'est pas assez. Il faut un rouleau de plus.</p><p><b>Le fermier doit acheter 5 rouleaux.</b> <i>(1 point)</i></p>`}
]}
};
})()
};
})();
