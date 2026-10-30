/* 6e — Chapitre 5 : Les nombres décimaux (cours et fiche d'exercices de M. Staal)
   Figures : images tirées de ses fiches ; figures du QCM et des corrections : SVG calculés. */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g," ");
/* nombre décimal écrit à partir d'un entier n et de k chiffres après la virgule : D(2473,3) = "2,473" */
const D = (n,k) => { if(!k) return sp(n); const s=String(n).padStart(k+1,"0"); return sp(+s.slice(0,-k))+","+s.slice(-k); };
const T = s => s.includes(",") ? s.replace(/0+$/,"").replace(/,$/,"") : s;      /* enlève les zéros inutiles à droite */
const co = (p,alt,w) => img("c65co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("c65ex/"+p+".png", alt, w);
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const RED="#d0342c", BLUE="#1e5aa8";
const RANGS = ["unités","dixièmes","centièmes","millièmes"];
/* tableau de numération d'un nombre décimal */
const tabNum = (ent, dec) => `<div class="scroll"><table class="num"><thead><tr><th colspan="3">Partie entière</th><th></th><th colspan="3">Partie décimale</th></tr><tr><th>centaines</th><th>dizaines</th><th>unités</th><th>,</th><th>dixièmes</th><th>centièmes</th><th>millièmes</th></tr></thead><tbody><tr>${String(ent).padStart(3," ").split("").map(d=>`<td>${d.trim()}</td>`).join("")}<td><b>,</b></td>${String(dec).padEnd(3," ").split("").map(d=>`<td>${d.trim()}</td>`).join("")}</tr></tbody></table></div>`;
/* demi-droite graduée en dixièmes : de a à b unités, points [[nom, valeur en dixièmes]] */
const dix = (a,b,pts=[]) => axis({n:(b-a)*10, lab:[...Array(b-a+1)].map((_,i)=>[10*i, String(a+i)]), major:[...Array(b-a+1)].map((_,i)=>10*i), pts:pts.map(([L,v])=>[L, v-10*a])});
/* demi-droite graduée en centièmes entre deux dixièmes (d en dixièmes) */
const cent = (d,pts=[]) => axis({n:10, lab:[[0,D(d,1)],[10,D(d+1,1)]], major:[5], pts:pts.map(([L,v])=>[L, v-10*d])});

/* ===================== schémas (rappels en image) ===================== */
const S_FRAC = sch("Nombre décimal = fraction décimale", `<p class="schN">Le dénominateur est 10, 100, 1 000… et il y a autant de zéros que de chiffres après la virgule :</p><p class="calc">3,07 = {307/100} &nbsp;(2 chiffres après la virgule → 100)<br>14,8 = {148/10} &nbsp;(1 chiffre → 10)<br>1,309 = {1 309/1 000} &nbsp;(3 chiffres → 1 000)</p>`);
const S_TAB = sch("Le tableau de numération", tabNum(207,"045")+`<p class="schN">Dans 207,045 : chiffre des dixièmes 0, des centièmes 4, des millièmes 5. Le <b>nombre</b> de dixièmes est 2 070 (on garde tous les chiffres jusqu'aux dixièmes).</p>`);
const S_ZERO = sch("Zéro inutile ou pas ?", `<p class="schN">Un zéro est inutile s'il est <b>tout à gauche</b> de la partie entière ou <b>tout à droite</b> de la partie décimale :</p><p class="calc">0̶5,30̶ = 5,3 &nbsp;&nbsp; 12,40̶0̶ = 12,4 &nbsp;&nbsp; 0̶70 = 70</p><p class="schN">Mais dans 3,07 ou dans 70, le zéro est utile : il tient une place.</p>`);
const S_AXE = sch("Lire une demi-droite graduée", dix(0,3,[["A",4],["B",17],["C",23]])+`<p class="schN">Chaque unité est partagée en 10 : une petite graduation vaut un dixième (0,1). A(0,4) · B(1,7) · C(2,3).</p>`);
const S_CMP = sch("Comparer deux décimaux", `<p class="schN">1) On compare les parties entières. 2) Si elles sont égales, on compare les dixièmes, puis les centièmes…</p><p class="calc">5,8 = 5,80 et 5,17 : 80 centièmes &gt; 17 centièmes, donc 5,8 &gt; 5,17</p><p class="schN">Astuce : on ajoute des zéros pour avoir autant de chiffres après la virgule.</p>`);
const S_ENC = sch("Encadrer", `<div class="scroll"><table class="std"><tbody><tr><th>à l'unité</th><td>2 &lt; 2,473 &lt; 3</td></tr><tr><th>au dixième</th><td>2,4 &lt; 2,473 &lt; 2,5</td></tr><tr><th>au centième</th><td>2,47 &lt; 2,473 &lt; 2,48</td></tr></tbody></table></div><p class="schN">Pour intercaler un nombre entre 1,57 et 1,58, on ajoute un chiffre : 1,571 ; 1,575…</p>`);
const S_ARR = sch("Arrondir", `<p class="schN">J'encadre, puis je garde la borne la plus proche. Au milieu, je prends la borne supérieure.</p><p class="calc">2,4 &lt; 2,473 &lt; 2,5 → 2,473 est plus proche de 2,5 : l'arrondi au dixième est 2,5.</p><p class="schN">Il suffit de regarder le chiffre juste après : 0, 1, 2, 3 ou 4 → je garde ; 5, 6, 7, 8 ou 9 → j'augmente.</p>`);

CH["6e-5"] = {
intro:"Reconnaître un nombre décimal et ses différentes écritures, la valeur des chiffres, les zéros inutiles, la demi-droite graduée, comparer, ranger, encadrer, intercaler et arrondir.",
savoir:[
  "reconnaître un nombre décimal et passer d'une écriture à une autre ;",
  "connaître la valeur de chaque chiffre : dixièmes, centièmes, millièmes ;",
  "supprimer les zéros inutiles dans l'écriture d'un nombre ;",
  "repérer et placer un nombre décimal sur une demi-droite graduée ;",
  "comparer, ranger, encadrer, intercaler et arrondir des nombres décimaux."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Qu'est-ce qu'un nombre décimal ?", h:`
  <h4>1. Définition</h4>
  <div class="retenir" data-l="Définition"><p>Un <b>nombre décimal</b> est un nombre qui peut s'écrire sous la forme d'une <b>fraction décimale</b>, c'est-à-dire une fraction dont le dénominateur est 1, 10, 100, 1 000, …</p></div>
  <p class="calc">3,07 = {307/100} &nbsp;&nbsp; 14,8 = {148/10} &nbsp;&nbsp; 0,64 = {64/100} &nbsp;&nbsp; 5 = {5/1}</p>
  <p><b>Remarque :</b> l'écriture décimale d'un nombre décimal comporte un nombre fini de chiffres après la virgule.</p>
  <h4>2. Partie entière et partie décimale</h4>
  <div class="retenir" data-l="Définition"><p>Un nombre décimal s'écrit comme la somme de sa <b>partie entière</b> (à gauche de la virgule) et de sa <b>partie décimale</b> (à droite de la virgule).</p></div>
  <p><b>Exemple :</b> 3,07 = 3 + 0,07. La partie entière est 3, la partie décimale est 0,07.</p>
  <h4>3. Les nombres entiers</h4>
  <div class="retenir" data-l="Définition"><p>Un <b>nombre entier</b> est un nombre décimal dont la partie décimale est égale à 0.</p></div>
  <p class="attention"><b>ATTENTION :</b> tous les nombres entiers sont des nombres décimaux, mais tous les nombres décimaux ne sont pas des nombres entiers.</p>`},
{k:"II", t:"Les différentes écritures d'un nombre décimal", h:`
  <h4>1. Le tableau de numération</h4>
  ${tabNum(207,"045")}
  <p>Dans 207,045 : le chiffre des dixièmes est 0, celui des centièmes est 4, celui des millièmes est 5.</p>
  <p class="attention"><b>ATTENTION :</b> ne pas confondre le <b>chiffre</b> des dixièmes (0) et le <b>nombre</b> de dixièmes, qui est 2 070.</p>
  <h4>2. Écrire un même nombre de plusieurs façons</h4>
  <p>Le nombre 3,07 peut s'écrire :</p>
  <div class="scroll"><table class="std"><thead><tr><th>écriture décimale</th><th>fraction décimale</th><th>écriture décomposée</th><th>écriture en lettres</th></tr></thead><tbody><tr><td>3,07</td><td>{307/100}</td><td>3 + 0,07<br>ou 3 + {7/100}</td><td>trois unités et sept centièmes</td></tr></tbody></table></div>
  ${co("carres","1 unité, 3 dixièmes (0,3 = 3/10), 7 centièmes (0,07 = 7/100)",330)}
  <h4>3. Les zéros inutiles</h4>
  <div class="retenir" data-l="Définition"><p>Dans l'écriture décimale d'un nombre, un zéro est <b>inutile</b> lorsqu'on peut le supprimer sans changer la position des autres chiffres.</p></div>
  <p class="calc">05,30 = 5,3 &nbsp;&nbsp; 12,400 = 12,4 &nbsp;&nbsp; 070 = 70</p>
  <p class="attention"><b>ATTENTION :</b> dans 3,07 le zéro n'est pas inutile : si on le supprime, on obtient 3,7, qui est un autre nombre.</p>`},
{k:"III", t:"Repérer un nombre décimal sur une demi-droite graduée", h:`
  <p>Pour graduer une demi-droite, on choisit une <b>unité de longueur</b> que l'on reporte régulièrement à partir de l'origine. On partage ensuite chaque unité en 10 pour obtenir les dixièmes.</p>
  ${dix(0,3,[["A",4],["B",17],["C",23]])}
  <p class="calc">Les abscisses sont : A(0,4) &nbsp; B(1,7) &nbsp; C(2,3)</p>
  <p>Pour placer un nombre au centième près, on « zoome » entre deux dixièmes et on partage à nouveau en 10.</p>
  ${cent(16,[["M",163]])}
  <p><b>Le point M a pour abscisse 1,63.</b> On lit : 1 unité, 6 dixièmes et 3 centièmes.</p>`},
{k:"IV", t:"Comparer, ranger, encadrer et intercaler", h:`
  <h4>1. Comparer deux nombres décimaux</h4>
  <div class="retenir" data-l="Méthode"><ul><li>On compare d'abord les <b>parties entières</b> ;</li><li>si elles sont égales, on compare les chiffres des <b>dixièmes</b>, puis ceux des <b>centièmes</b>, et ainsi de suite.</li></ul></div>
  <p class="calc">9,6 &gt; 2,73 &nbsp;&nbsp; 13,9 &gt; 13,27 &nbsp;&nbsp; 5,17 &lt; 5,8</p>
  <p class="attention"><b>ATTENTION :</b> 5,8 n'est pas plus petit que 5,17 : on écrit 5,8 = 5,80, et comme 80 &gt; 17, on a bien 5,8 &gt; 5,17.</p>
  <h4>2. Ranger des nombres décimaux</h4>
  <div class="retenir" data-l="Définitions"><ul><li>ranger dans l'<b>ordre croissant</b>, c'est ranger du plus petit au plus grand ;</li><li>ranger dans l'<b>ordre décroissant</b>, c'est ranger du plus grand au plus petit.</li></ul></div>
  <p><b>Exemple</b> dans l'ordre croissant : 33,68 &lt; 33,8 &lt; 34 &lt; 34,2 &lt; 34,75.</p>
  <h4>3. Encadrer un nombre décimal</h4>
  <div class="retenir" data-l="Définition"><p><b>Encadrer</b> un nombre, c'est trouver un nombre plus petit et un nombre plus grand que lui. Encadrer à l'unité, au dixième ou au centième près, c'est donner les deux nombres les plus proches de cette précision.</p></div>
  <div class="scroll"><table class="std"><thead><tr><th colspan="3">Exemple avec 2,473</th></tr><tr><th>à l'unité près</th><th>au dixième près</th><th>au centième près</th></tr></thead><tbody><tr><td>2 &lt; 2,473 &lt; 3</td><td>2,4 &lt; 2,473 &lt; 2,5</td><td>2,47 &lt; 2,473 &lt; 2,48</td></tr></tbody></table></div>
  <h4>4. Intercaler un nombre décimal</h4>
  <div class="retenir" data-l="Définition"><p><b>Intercaler</b> un nombre entre deux autres, c'est trouver un nombre compris entre ces deux nombres.</p></div>
  <p class="calc">6 &lt; 6,5 &lt; 7 &nbsp;&nbsp; 13,5 &lt; 13,57 &lt; 13,6 &nbsp;&nbsp; 1,57 &lt; 1,573 &lt; 1,58</p>
  <p><b>Remarque :</b> il suffit d'ajouter un chiffre après la virgule : entre 1,57 et 1,58 on peut écrire 1,571 ; 1,572 ; 1,573 …</p>`},
{k:"V", t:"Donner un arrondi (valeur approchée)", h:`
  <div class="retenir" data-l="Définition"><p>L'<b>arrondi</b> d'un nombre est, parmi les deux bornes de son encadrement, celle dont il est le plus proche.</p></div>
  <div class="retenir" data-l="Méthode"><ul><li>j'encadre le nombre à la précision demandée ;</li><li>je garde la borne dont le nombre est le plus proche ;</li><li>si le nombre est exactement au milieu, je prends la borne supérieure.</li></ul></div>
  <div class="scroll"><table class="std"><thead><tr><th colspan="3">Exemple avec 2,473</th></tr><tr><th>à l'unité</th><th>au dixième</th><th>au centième</th></tr></thead><tbody><tr><td>2</td><td>2,5<br><small>(2,473 est plus proche de 2,5 que de 2,4)</small></td><td>2,47</td></tr></tbody></table></div>`}
],

/* ===================== EXERCICES (dans l'ordre de la fiche) ===================== */
exos:[
{t:"Reconnaître un nombre décimal", e:[
  {n:"Activité 1", t:"Qu'est-ce qu'un nombre décimal ?", w:"Sur ta feuille", h:`<p>On donne les nombres suivants : 3,07 ; 14,8 ; 1,309 ; 0,64 ; 5</p><p>1) Écris chacun de ces nombres sous la forme d'une fraction décimale.</p><p>2) Un nombre décimal est un nombre qui peut s'écrire sous la forme d'une fraction décimale. Parmi les cinq nombres, lesquels sont des nombres décimaux ?</p>`,
   c:`<p>1) On met au dénominateur 10, 100 ou 1 000 : autant de zéros que de chiffres après la virgule.</p><p class="calc">3,07 = {307/100} &nbsp;&nbsp; 14,8 = {148/10} &nbsp;&nbsp; 1,309 = {1 309/1 000} &nbsp;&nbsp; 0,64 = {64/100} &nbsp;&nbsp; 5 = {5/1}</p><p>2) Ils peuvent tous s'écrire sous la forme d'une fraction décimale : <b>les cinq nombres sont des nombres décimaux</b> (même 5, qui est aussi un nombre entier).</p>`},
  {n:"Exercice 1", t:"Partie entière et partie décimale", w:"Sur ta feuille", h:`<p>Écris chaque nombre comme la somme de sa partie entière et de sa partie décimale. Exemple : 3,07 = 3 + 0,07</p><p>a) 12,3 · b) 85,08 · c) 2,485 · d) 0,85 · e) 12 · f) 6,007</p>`,
   c:`a) 12,3 = 12 + 0,3 · b) 85,08 = 85 + 0,08 · c) 2,485 = 2 + 0,485 · d) 0,85 = 0 + 0,85 · e) 12 = 12 + 0 · f) 6,007 = 6 + 0,007`},
  {n:"Exercice 2", t:"Vrai ou faux ?", w:"Sur ta feuille", h:`<p>Indique si chaque phrase est vraie ou fausse, puis donne un exemple qui le prouve.</p><p>a) Tous les nombres entiers sont des nombres décimaux.</p><p>b) Tous les nombres décimaux sont des nombres entiers.</p>`,
   c:`<p>a) <b>Vrai.</b> Exemple : 5 = {5/1} (ou 5 = 5,0) : sa partie décimale est 0, c'est un nombre décimal.</p><p>b) <b>Faux.</b> Exemple : 3,07 est un nombre décimal, mais ce n'est pas un nombre entier (sa partie décimale est 0,07).</p>`},
  {n:"Activité 2", t:"Le jeu des étiquettes", w:"Sur ta feuille", h:`<p>On dispose des quatre étiquettes suivantes : <b>3</b> · <b>0</b> · <b>,</b> · <b>5</b></p><p>Avec ces quatre étiquettes, on forme des nombres en utilisant chaque étiquette une seule fois. Par exemple, on peut former 5,03.</p><p>1) Trouve tous les nombres possibles. Il y en a 12 !</p><p>2) Parmi eux, y a-t-il des nombres entiers ? Si oui, écris-les.</p><p>3) Y a-t-il des nombres égaux entre eux ? Si oui, écris ces égalités.</p>`,
   c:`<p>1) La virgule ne peut être ni au début ni à la fin : elle est après le 1<sup>er</sup> ou après le 2<sup>e</sup> chiffre. Avec les 6 ordres possibles des chiffres 3, 0 et 5, on obtient les 12 écritures :</p>
   <p class="calc">3,05 &nbsp; 3,50 &nbsp; 30,5 &nbsp; 35,0 &nbsp; 0,35 &nbsp; 0,53<br>03,5 &nbsp; 05,3 &nbsp; 5,03 &nbsp; 5,30 &nbsp; 50,3 &nbsp; 53,0</p>
   <p>2) Oui : <b>35,0 = 35</b> et <b>53,0 = 53</b> sont des nombres entiers (leur partie décimale est 0).</p>
   <p>3) Oui : <b>3,50 = 03,5</b> (les deux valent 3,5) et <b>5,30 = 05,3</b> (les deux valent 5,3). Ce sont les zéros inutiles !</p>`}
 ]},
{t:"Les différentes écritures d'un nombre décimal", e:[
  {n:"Exercice 3", t:"Le tableau de numération", w:"Sur ta feuille", h:`<p>On considère le nombre 306,27.</p><p>a) Le chiffre des dixièmes est …… · b) Le chiffre des centièmes est …… · c) Le chiffre des unités est …… · d) Le chiffre des dizaines est …… · e) Combien y a-t-il de centièmes en tout dans 306,27 ?</p>`,
   c:`${tabNum(306,"27")}<p>a) 2 · b) 7 · c) 6 · d) 0 · e) <b>30 627</b> centièmes (on garde tous les chiffres jusqu'aux centièmes : 306,27 = {30 627/100}).</p>`},
  {n:"Exercice 4", t:"Passer d'une écriture à une autre", w:"Sur ta feuille", h:`<p>Complète le tableau.</p><div class="scroll"><table class="std"><thead><tr><th>Écriture décimale</th><th>Fraction décimale</th><th>Écriture décomposée</th><th>Écriture en lettres</th></tr></thead><tbody><tr><td>7,4</td><td>……</td><td>……</td><td>……</td></tr><tr><td>……</td><td>{53/100}</td><td>……</td><td>……</td></tr><tr><td>……</td><td>……</td><td>2 + 0,9</td><td>……</td></tr><tr><td>……</td><td>……</td><td>……</td><td>quatre unités et six centièmes</td></tr></tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Écriture décimale</th><th>Fraction décimale</th><th>Écriture décomposée</th><th>Écriture en lettres</th></tr></thead><tbody><tr><td>7,4</td><td><b>{74/10}</b></td><td><b>7 + 0,4</b></td><td><b>sept unités et quatre dixièmes</b></td></tr><tr><td><b>0,53</b></td><td>{53/100}</td><td><b>0 + 0,53</b></td><td><b>cinquante-trois centièmes</b></td></tr><tr><td><b>2,9</b></td><td><b>{29/10}</b></td><td>2 + 0,9</td><td><b>deux unités et neuf dixièmes</b></td></tr><tr><td><b>4,06</b></td><td><b>{406/100}</b></td><td><b>4 + 0,06</b></td><td>quatre unités et six centièmes</td></tr></tbody></table></div>`},
  {n:"Exercice 5", t:"Les zéros inutiles", w:"Sur ta feuille", h:`<p>Complète le tableau, comme dans l'exemple. Attention : certains zéros ne sont pas inutiles !</p><div class="scroll"><table class="std"><thead><tr><th>Nombre</th><th>Décomposition (en lettres)</th><th>Nombre sans les zéros inutiles</th></tr></thead><tbody><tr><td>5,30</td><td>5 unités et 3 dixièmes</td><td>5,3</td></tr><tr><td>02,600</td><td>……</td><td>……</td></tr><tr><td>309,70</td><td>……</td><td>……</td></tr><tr><td>40,8</td><td>……</td><td>……</td></tr><tr><td>0,8</td><td>……</td><td>……</td></tr><tr><td>050</td><td>……</td><td>……</td></tr></tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Nombre</th><th>Décomposition (en lettres)</th><th>Sans les zéros inutiles</th></tr></thead><tbody><tr><td>02,600</td><td>2 unités et 6 dixièmes</td><td><b>2,6</b></td></tr><tr><td>309,70</td><td>3 centaines, 9 unités et 7 dixièmes</td><td><b>309,7</b></td></tr><tr><td>40,8</td><td>4 dizaines et 8 dixièmes</td><td><b>40,8</b> (aucun zéro inutile)</td></tr><tr><td>0,8</td><td>8 dixièmes</td><td><b>0,8</b> (on garde le 0 des unités)</td></tr><tr><td>050</td><td>5 dizaines</td><td><b>50</b></td></tr></tbody></table></div><p><i>Le zéro de 40,8 et celui de 309,7 tiennent la place des unités ou des dizaines : ils sont utiles.</i></p>`},
  {n:"Exercice 6", t:"Barrer, comparer", w:"Sur ta feuille", h:`<p>1) Lorsque c'est possible, barre les zéros inutiles : 0502,70 · 200,500 · 30,00 · 450 · 0,501 · 0102,030</p><p>2) Complète avec le signe = ou ≠ : 0408 …… 408,00 · 3,807 …… 03,87 · 009 …… 9,00 · 0304,20 …… 304,200</p>`,
   c:`<p>1) On barre les zéros tout à gauche de la partie entière et tout à droite de la partie décimale :</p><p><s style="color:#d0342c">0</s>502,7<s style="color:#d0342c">0</s> → <b>502,7</b><br>200,5<s style="color:#d0342c">0</s><s style="color:#d0342c">0</s> → <b>200,5</b><br>30,<s style="color:#d0342c">0</s><s style="color:#d0342c">0</s> → <b>30</b> (on enlève aussi la virgule)<br>450 → <b>450</b> (aucun zéro inutile)<br>0,501 → <b>0,501</b> (aucun zéro inutile)<br><s style="color:#d0342c">0</s>102,03<s style="color:#d0342c">0</s> → <b>102,03</b></p><p>2) 0408 <b>=</b> 408,00 (les deux valent 408) · 3,807 <b>≠</b> 03,87 (03,87 = 3,87) · 009 <b>=</b> 9,00 (les deux valent 9) · 0304,20 <b>=</b> 304,200 (les deux valent 304,2)</p>`}
 ]},
{t:"Repérer un nombre décimal sur une demi-droite graduée", e:[
  {n:"Activité 3", t:"Placer des nombres décimaux", w:"Sur ta feuille", h:`<p>Place sur la demi-droite graduée ci-dessous les nombres : 0,8 ; 1,2 ; 2,5 ; 0,35</p>${ex("act3","Demi-droite graduée de 0 à 3",440)}<p>Que remarques-tu pour 0,35 ?</p>`,
   c:`<p>Chaque unité est partagée en 10 : une petite graduation vaut 0,1.</p>${axis({n:30, lab:[[0,"0"],[10,"1"],[20,"2"],[30,"3"]], major:[10,20], pts:[["0,8",8],["1,2",12],["2,5",25],["0,35",3.5]]})}<p>0,8 est 8 graduations après 0 ; 1,2 est 2 graduations après 1 ; 2,5 est au milieu entre 2 et 3.</p><p><b>0,35</b> n'est pas sur une graduation : il est <b>au milieu entre 0,3 et 0,4</b>. Pour le placer exactement, il faudrait partager l'intervalle en centièmes.</p>`},
  {n:"Exercice 7", t:"Lire une abscisse", w:"Sur ta feuille", h:`<p>Donne l'abscisse de chacun des points, en écriture décimale.</p>${ex("e7","Demi-droite graduée de 0 à 4 avec les points A à E",470)}<p>A(……) B(……) C(……) D(……) E(……)</p>`,
   c:`<p>Chaque unité est partagée en 10 : une petite graduation vaut 0,1.</p><p>A est 6 graduations après 0 : <b>A(0,6)</b>.<br>B est 3 graduations après 1 : <b>B(1,3)</b>.<br>C est 1 graduation après 2 : <b>C(2,1)</b>.<br>D est 4 graduations après 3 : <b>D(3,4)</b>.<br>E est 8 graduations après 3 : <b>E(3,8)</b>.</p>`},
  {n:"Exercice 8", t:"Le zoom au centième", w:"Sur ta feuille", h:`<p>1) Cette demi-droite est graduée en centièmes. Place les nombres 1,63 et 1,68.</p>${ex("e8a","Demi-droite de 1,6 à 1,7",440)}<p>2) Donne l'abscisse des points F et G.</p>${ex("e8b","Demi-droite de 2,3 à 2,4 avec F et G",440)}`,
   c:`<p>1) Entre 1,6 et 1,7, il y a 10 intervalles : une graduation vaut 0,01. 1,63 est à la 3<sup>e</sup> graduation après 1,6 ; 1,68 à la 8<sup>e</sup>.</p>${cent(16,[["1,63",163],["1,68",168]])}<p>2) Une graduation vaut 0,01.</p><p>F est 4 graduations après 2,3 : <b>F(2,34)</b>.<br>G est 7 graduations après 2,3 : <b>G(2,37)</b>.</p>`}
 ]},
{t:"Comparer et ranger", e:[
  {n:"Exercice 9", t:"Comparer deux nombres décimaux", w:"Sur ta feuille", h:`<p>Complète avec &lt; , &gt; ou =.</p><p>a) 9,6 …… 2,73 · b) 5,17 …… 5,8 · c) 13,9 …… 13,27 · d) 0,7 …… 0,70 · e) 4,09 …… 4,9 · f) 12,30 …… 12,3 · g) 8,125 …… 8,2 · h) 0,99 …… 1 · i) 6,4 …… 6,40</p>`,
   c:`<p>a) 9,6 &gt; 2,73 (parties entières : 9 &gt; 2)</p><p>b) 5,17 &lt; 5,8 (1 dixième &lt; 8 dixièmes)</p><p>c) 13,9 &gt; 13,27 (même partie entière ; 9 dixièmes &gt; 2 dixièmes)</p><p>d) 0,7 = 0,70 (le dernier 0 est inutile)</p><p>e) 4,09 &lt; 4,9 (0 dixième &lt; 9 dixièmes)</p><p>f) 12,30 = 12,3 (le dernier 0 est inutile)</p><p>g) 8,125 &lt; 8,2 (1 dixième &lt; 2 dixièmes)</p><p>h) 0,99 &lt; 1 (parties entières : 0 &lt; 1)</p><p>i) 6,4 = 6,40 (le dernier 0 est inutile)</p>`},
  {n:"Activité 4", t:"La famille", w:"Sur ta feuille", h:`<p>Voici la taille des personnes d'une famille : Maman : 1,73 m · Léo : 0,75 m · Lila : 1,09 m · Tom : 1,2 m · Papa : 1,8 m · Clara : 1,27 m</p><p>1) Range les tailles dans l'ordre croissant.</p><p>2) Range les prénoms dans le même ordre.</p>`,
   c:`<p>On compare d'abord les parties entières (0 pour Léo, 1 pour les autres), puis les dixièmes. On peut écrire 1,2 = 1,20 et 1,8 = 1,80.</p><p>1) 0,75 &lt; 1,09 &lt; 1,2 &lt; 1,27 &lt; 1,73 &lt; 1,8</p><p>2) Léo, Lila, Tom, Clara, Maman, Papa.</p>`},
  {n:"Exercice 10", t:"Les moyennes du trimestre", w:"Sur ta feuille", h:`<p>Voici les moyennes de Chloé : Maths : 16,82 · EPS : 15,3 · Histoire-Géo : 12,41 · Français : 12,6 · Anglais : 16,7 · Musique : 15,09</p><p>1) Range les moyennes dans l'ordre décroissant.</p><p>2) Quelle est la matière où Chloé réussit le mieux ?</p>`,
   c:`<p>1) 16,82 &gt; 16,7 &gt; 15,3 &gt; 15,09 &gt; 12,6 &gt; 12,41 (Maths, Anglais, EPS, Musique, Français, Histoire-Géo).</p><p>2) Chloé réussit le mieux en <b>Maths</b> (16,82).</p>`},
  {n:"Exercice 11", t:"Le prix des fruits", w:"Sur ta feuille", h:`<p>Au marché, voici le prix au kilo de six fruits : Cerises : 4,5 € · Pêches : 4,07 € · Poires : 2,6 € · Pommes : 2,27 € · Framboises : 4,72 € · Fraises : 4,125 €</p><p>1) Range les prix dans l'ordre croissant.</p><p>2) Quel est le fruit le moins cher ? Le plus cher ?</p>`,
   c:`<p>1) 2,27 &lt; 2,6 &lt; 4,07 &lt; 4,125 &lt; 4,5 &lt; 4,72 (pommes, poires, pêches, fraises, cerises, framboises).</p><p>2) Le moins cher : les <b>pommes</b> (2,27 €). Le plus cher : les <b>framboises</b> (4,72 €).</p>`}
 ]},
{t:"Encadrer et intercaler", e:[
  {n:"Exercice 12", t:"Intercaler entre deux entiers consécutifs", w:"Sur ta feuille", h:`<p>Place chacun des nombres 1,4 ; 12,7 ; 3,28 ; 10,671 au bon endroit. Certaines lignes resteront vides.</p><p>0 &lt; …… &lt; 1 · 1 &lt; …… &lt; 2 · 2 &lt; …… &lt; 3 · 3 &lt; …… &lt; 4 · 4 &lt; …… &lt; 5 · 9 &lt; …… &lt; 10 · 10 &lt; …… &lt; 11 · 11 &lt; …… &lt; 12 · 12 &lt; …… &lt; 13 · 13 &lt; …… &lt; 14</p>`,
   c:`<p>On regarde la partie entière de chaque nombre :</p><p>1 &lt; <b>1,4</b> &lt; 2 · 3 &lt; <b>3,28</b> &lt; 4 · 10 &lt; <b>10,671</b> &lt; 11 · 12 &lt; <b>12,7</b> &lt; 13</p><p>Les autres lignes restent vides.</p>`},
  {n:"Exercice 13", t:"Intercaler entre deux dixièmes", w:"Sur ta feuille", h:`<p>Même consigne avec les nombres 2,38 ; 2,15 ; 2,98 ; 2,07.</p><p>2 &lt; …… &lt; 2,1 · 2,1 &lt; …… &lt; 2,2 · 2,2 &lt; …… &lt; 2,3 · 2,3 &lt; …… &lt; 2,4 · 2,4 &lt; …… &lt; 2,5 · 2,5 &lt; …… &lt; 2,6 · 2,6 &lt; …… &lt; 2,7 · 2,7 &lt; …… &lt; 2,8 · 2,8 &lt; …… &lt; 2,9 · 2,9 &lt; …… &lt; 3</p>`,
   c:`<p>On regarde le chiffre des dixièmes :</p><p>2 &lt; <b>2,07</b> &lt; 2,1 · 2,1 &lt; <b>2,15</b> &lt; 2,2 · 2,3 &lt; <b>2,38</b> &lt; 2,4 · 2,9 &lt; <b>2,98</b> &lt; 3</p><p>Les autres lignes restent vides.</p>`},
  {n:"Exercice 14", t:"À toi de choisir", w:"Sur ta feuille", h:`<p>1) Intercale un nombre de ton choix : a) 3 &lt; …… &lt; 4 · b) 4,2 &lt; …… &lt; 4,3 · c) 2,38 &lt; …… &lt; 2,39</p><p>2) Intercale deux nombres de ton choix, dans l'ordre croissant : a) 12 &lt; …… &lt; …… &lt; 13 · b) 8,7 &lt; …… &lt; …… &lt; 8,8 · c) 6,44 &lt; …… &lt; …… &lt; 6,45</p>`,
   c:`<p>Il y a beaucoup de réponses possibles. Il suffit d'ajouter un chiffre après la virgule. Exemples :</p><p>1) a) 3 &lt; <b>3,5</b> &lt; 4 · b) 4,2 &lt; <b>4,25</b> &lt; 4,3 · c) 2,38 &lt; <b>2,385</b> &lt; 2,39</p><p>2) a) 12 &lt; <b>12,3</b> &lt; <b>12,6</b> &lt; 13 · b) 8,7 &lt; <b>8,73</b> &lt; <b>8,76</b> &lt; 8,8 · c) 6,44 &lt; <b>6,442</b> &lt; <b>6,447</b> &lt; 6,45</p>`},
  {n:"Exercice 15", t:"Encadrer un nombre décimal", w:"Sur ta feuille", h:`<p>Complète le tableau, comme dans l'exemple.</p><div class="scroll"><table class="std"><thead><tr><th>Nombre</th><th>à l'unité près</th><th>au dixième près</th><th>au centième près</th></tr></thead><tbody><tr><td>2,473</td><td>2 &lt; 2,473 &lt; 3</td><td>2,4 &lt; 2,473 &lt; 2,5</td><td>2,47 &lt; 2,473 &lt; 2,48</td></tr><tr><td>3,268</td><td>……</td><td>……</td><td>……</td></tr><tr><td>9,25</td><td>……</td><td>……</td><td>……</td></tr><tr><td>17,504</td><td>……</td><td>……</td><td>……</td></tr><tr><td>0,357</td><td>……</td><td>……</td><td>……</td></tr></tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Nombre</th><th>à l'unité près</th><th>au dixième près</th><th>au centième près</th></tr></thead><tbody><tr><td>3,268</td><td>3 &lt; 3,268 &lt; 4</td><td>3,2 &lt; 3,268 &lt; 3,3</td><td>3,26 &lt; 3,268 &lt; 3,27</td></tr><tr><td>9,25</td><td>9 &lt; 9,25 &lt; 10</td><td>9,2 &lt; 9,25 &lt; 9,3</td><td>9,24 &lt; 9,25 &lt; 9,26</td></tr><tr><td>17,504</td><td>17 &lt; 17,504 &lt; 18</td><td>17,5 &lt; 17,504 &lt; 17,6</td><td>17,50 &lt; 17,504 &lt; 17,51</td></tr><tr><td>0,357</td><td>0 &lt; 0,357 &lt; 1</td><td>0,3 &lt; 0,357 &lt; 0,4</td><td>0,35 &lt; 0,357 &lt; 0,36</td></tr></tbody></table></div><p><i>9,25 a seulement deux chiffres après la virgule : au centième près, on l'encadre par le centième juste avant (9,24) et juste après (9,26).</i></p>`}
 ]},
{t:"Donner un arrondi", e:[
  {n:"Exercice 16", t:"Trouver l'arrondi", w:"Sur ta feuille", h:`<p>Complète le tableau.</p><div class="scroll"><table class="std"><thead><tr><th>Nombre</th><th>arrondi à l'unité</th><th>arrondi au dixième</th><th>arrondi au centième</th></tr></thead><tbody><tr><td>2,473</td><td>2</td><td>2,5</td><td>2,47</td></tr><tr><td>7,186</td><td>……</td><td>……</td><td>……</td></tr><tr><td>0,849</td><td>……</td><td>……</td><td>……</td></tr><tr><td>15,952</td><td>……</td><td>……</td><td>……</td></tr><tr><td>3,505</td><td>……</td><td>……</td><td>……</td></tr></tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Nombre</th><th>arrondi à l'unité</th><th>arrondi au dixième</th><th>arrondi au centième</th></tr></thead><tbody><tr><td>7,186</td><td><b>7</b></td><td><b>7,2</b></td><td><b>7,19</b></td></tr><tr><td>0,849</td><td><b>1</b></td><td><b>0,8</b></td><td><b>0,85</b></td></tr><tr><td>15,952</td><td><b>16</b></td><td><b>16,0</b> (soit 16)</td><td><b>15,95</b></td></tr><tr><td>3,505</td><td><b>4</b></td><td><b>3,5</b></td><td><b>3,51</b></td></tr></tbody></table></div>
   <p>Quelques explications : 15,9 &lt; 15,952 &lt; 16,0 et 15,952 est plus proche de 16,0. · 3,505 est plus proche de 4 que de 3 (il dépasse 3,5). · 3,50 &lt; 3,505 &lt; 3,51 : 3,505 est <b>exactement au milieu</b>, on prend la borne supérieure 3,51.</p>`},
  {n:"Exercice 17", t:"L'écran de la calculatrice", w:"Sur ta feuille", h:`<p>Je tape une division sur ma calculatrice. Le résultat n'est pas un nombre décimal : il est égal à 30,666666666666…</p><p>L'écran ne peut afficher que 11 chiffres et une virgule, et la calculatrice affiche toujours un arrondi. Écris exactement le nombre affiché par la calculatrice.</p>`,
   c:`<p>11 chiffres : 2 avant la virgule (30) et 9 après. On arrondit donc au 9<sup>e</sup> chiffre après la virgule. Le chiffre suivant est un 6 (≥ 5) : on augmente le dernier chiffre.</p><p>La calculatrice affiche <b>30,666666667</b>.</p>`},
  {n:"Exercice 18", t:"Au restaurant", w:"Sur ta feuille", h:`<p>Elsa, Eliott et Mathieu vont au restaurant. L'addition est de 53 €. Ils décident de partager la somme le plus équitablement possible. La calculatrice affiche 17,666666667 pour la part de chacun.</p><p>1) Quelle somme chacun va-t-il payer, au centime près ?</p><p>2) Explique pourquoi le compte ne tombe pas juste.</p>`,
   c:`<p>1) Au centime près, c'est l'arrondi au centième : 17,66 &lt; 17,666… &lt; 17,67 et 17,666… est plus proche de 17,67. Chacun paie environ <b>17,67 €</b>.</p><p>2) 53 ÷ 3 ne tombe pas juste : le résultat 17,666… n'est pas un nombre décimal (les 6 continuent sans fin). Si chacun paie 17,67 €, ils donnent 3 × 17,67 = 53,01 €, soit <b>1 centime de trop</b>. Pour payer exactement 53 €, deux personnes peuvent payer 17,67 € et la troisième 17,66 € (17,67 + 17,67 + 17,66 = 53).</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Fractions décimales", schema:S_FRAC, q:{
 1:[ {g:()=>{ const n=ri(101,999), k=pick([1,2]); const s=D(n,k); return {q:`Quelle fraction décimale est égale à ${s} ?`, c:uniq(`{${n}/${k===1?10:100}}`,[`{${n}/${k===1?100:10}}`,`{${n}/1 000}`]), rep:`{${n}/${k===1?10:100}}`, ex:`${k} chiffre${k>1?"s":""} après la virgule → dénominateur ${k===1?10:100}.`, sx:S_FRAC}; }},
     {q:"Un nombre décimal est un nombre qui peut s'écrire…", c:["avec une fraction décimale (dénominateur 10, 100, 1 000…)","avec une virgule obligatoirement","seulement avec des chiffres après la virgule"], rep:"avec une fraction décimale (dénominateur 10, 100, 1 000…)", sx:S_FRAC} ],
 2:[ {g:()=>{ const n=ri(11,99); return {q:`Écris 0,${String(n).padStart(2,"0")} sous la forme d'une fraction décimale.`, rep:[`${n}/100`], ex:`Deux chiffres après la virgule : 0,${String(n).padStart(2,"0")} = ${n} centièmes = {${n}/100}.`, sx:S_FRAC}; }},
     {g:()=>{ const n=ri(1001,9999); return {q:`Écris {${sp(n)}/1 000} en écriture décimale.`, rep:D(n,3), ex:`${sp(n)} millièmes : 3 chiffres après la virgule, ${D(n,3)}.`, sx:S_FRAC}; }} ],
 3:[ {g:()=>{ const n=ri(1,9)*1000+ri(0,9)*10+ri(1,9); return {q:`Écris {${sp(n)}/1 000} en écriture décimale.`, rep:D(n,3), ex:`3 chiffres après la virgule : ${D(n,3)}. Attention au zéro des dixièmes ou des centièmes !`, sx:S_FRAC}; }},
     {q:"Vrai ou faux : tous les nombres décimaux sont des nombres entiers.", c:VF, rep:"Faux", ex:"3,07 est décimal mais pas entier. En revanche, tous les entiers sont décimaux (5 = 5/1)."} ]
}},
{nom:"Valeur des chiffres", schema:S_TAB, q:{
 1:[ {g:()=>{ const e=ri(10,999), d=String(ri(100,999)), r=ri(1,3); return {q:`Dans ${sp(e)},${d}, quel est le chiffre des ${RANGS[r]} ?`, rep:d[r-1], ex:`Après la virgule : dixièmes, puis centièmes, puis millièmes. Le chiffre des ${RANGS[r]} est ${d[r-1]}.`, sx:S_TAB}; }},
     {g:()=>{ const e=ri(1,99), d=ri(11,99); return {q:`Quelle est la partie entière de ${e},${d} ?`, rep:String(e), ex:`La partie entière est à gauche de la virgule : ${e}.`, sx:S_TAB}; }} ],
 2:[ {g:()=>{ const e=ri(1,9), a=ri(1,9), b=ri(1,9); return {q:`Écris le nombre : ${e} unité${e>1?"s":""}, ${a} dixième${a>1?"s":""} et ${b} millième${b>1?"s":""}.`, rep:`${e},${a}0${b}`, ex:`Pas de centièmes : on écrit un 0 à leur place. ${e},${a}0${b}.`, sx:S_TAB}; }},
     {g:()=>{ const e=ri(1,9), b=ri(1,9); return {q:`Comment écrit-on « ${e} unité${e>1?"s":""} et ${b} centième${b>1?"s":""} » ?`, c:uniq(`${e},0${b}`,[`${e},${b}`,`${e},00${b}`,`${e}0,${b}`]), rep:`${e},0${b}`, ex:`Pas de dixièmes : on met un 0, puis ${b>1?`les ${b} centièmes`:"le centième"}.`, sx:S_TAB}; }} ],
 3:[ {g:()=>{ const e=ri(10,999), d=ri(10,99); return {q:`Combien y a-t-il de dixièmes en tout dans ${e},${d} ?`, rep:sp(e*10+Math.floor(d/10)), ex:`On garde tous les chiffres jusqu'aux dixièmes : ${sp(e*10+Math.floor(d/10))}. Ne pas confondre avec le chiffre des dixièmes (${Math.floor(d/10)}).`, sx:S_TAB}; }},
     {g:()=>{ const e=ri(10,99), d=ri(10,99); return {q:`Combien y a-t-il de centièmes en tout dans ${e},${d} ?`, rep:sp(e*100+d), ex:`${e},${d} = {${sp(e*100+d)}/100} : ${sp(e*100+d)} centièmes.`, sx:S_TAB}; }} ]
}},
{nom:"Zéros inutiles", schema:S_ZERO, q:{
 1:[ {g:()=>{ const a=ri(1,9), b=ri(1,9); return {q:`Écris 0${a},${b}0 sans les zéros inutiles.`, rep:`${a},${b}`, ex:`Le 0 à gauche et le 0 à droite sont inutiles : ${a},${b}.`, sx:S_ZERO}; }},
     {q:"Dans 3,07, le zéro est-il inutile ?", c:["Non","Oui"], rep:"Non", ex:"Sans lui, on obtient 3,7 : un autre nombre. Il tient la place des dixièmes.", sx:S_ZERO} ],
 2:[ {g:()=>{ const a=ri(11,99), b=ri(1,9); return {q:`Complète avec = ou ≠ : 0${a},${b}00 … ${a},${b}`, c:["=","≠"], rep:"=", ex:`Les zéros enlevés sont inutiles : les deux nombres valent ${a},${b}.`, sx:S_ZERO}; }},
     {g:()=>{ const a=ri(1,9), b=ri(1,9), c=ri(1,9); return {q:`Complète avec = ou ≠ : ${a},${b}0${c} … ${a},${b}${c}`, c:["≠","="], rep:"≠", ex:`Le 0 de ${a},${b}0${c} n'est pas inutile (il tient la place des centièmes).`, sx:S_ZERO}; }} ],
 3:[ {g:()=>{ const a=ri(1,9), b=ri(1,9); const s=`0${a}0${b},${b}0`; return {q:`Écris ${s} sans les zéros inutiles.`, rep:`${a}0${b},${b}`, ex:`Seuls le premier 0 (à gauche) et le dernier 0 (à droite) sont inutiles : ${a}0${b},${b}.`, sx:S_ZERO}; }} ]
}},
{nom:"Demi-droite graduée", schema:S_AXE, q:{
 1:[ {g:()=>{ const v=ri(1,29); return {q:"Quelle est l'abscisse du point A ?", fig:dix(0,3,[["A",v]]), rep:[T(D(v,1)),D(v,1)], ex:`Une petite graduation vaut 0,1 : A est ${v} graduation${v>1?"s":""} après 0, donc A(${T(D(v,1))}).`, sx:S_AXE}; }} ],
 2:[ {g:()=>{ const a=ri(2,8), v=10*a+ri(1,9); return {q:"Quelle est l'abscisse du point B ?", fig:dix(a,a+2,[["B",v]]), rep:D(v,1), ex:`Une graduation vaut 0,1 : B(${D(v,1)}).`, sx:S_AXE}; }},
     {g:()=>{ const d=ri(11,39), v=10*d+ri(1,9); return {q:"Cette demi-droite est graduée en centièmes. Quelle est l'abscisse du point M ?", fig:cent(d,[["M",v]]), rep:D(v,2), ex:`Entre ${D(d,1)} et ${D(d+1,1)}, une graduation vaut 0,01 : M(${D(v,2)}).`, sx:S_AXE}; }} ],
 3:[ {g:()=>{ const v=ri(1,9)*10+5; return {q:`Sur une demi-droite graduée en dixièmes, où se trouve le nombre ${D(v,2)} ?`, c:uniq(`au milieu entre ${D(v-5,2).replace(/0$/,"")} et ${D(v+5,2).replace(/0$/,"")}`,[`sur la graduation ${D(v-5,2).replace(/0$/,"")}`,`sur la graduation ${D(v+5,2).replace(/0$/,"")}`]), rep:`au milieu entre ${D(v-5,2).replace(/0$/,"")} et ${D(v+5,2).replace(/0$/,"")}`, ex:`${D(v,2)} = ${D(v-5,2)} + 0,05 : c'est la moitié d'un dixième.`, sx:S_AXE}; }} ]
}},
{nom:"Comparer et ranger", schema:S_CMP, q:{
 1:[ {g:()=>{ const a=ri(1,9), x=ri(1,9), y=ri(10,99); const A=`${a},${x}`, B=`${a},${y}`; const s=10*x>y?"&gt;":10*x<y?"&lt;":"="; return {q:`Complète : ${A} … ${B}`, c:["&lt;","&gt;","="], rep:s, ex:`On écrit ${A} = ${a},${x}0 et on compare ${x}0 et ${y} centièmes.`, sx:S_CMP}; }},
     {q:"Ranger dans l'ordre décroissant, c'est ranger…", c:["du plus grand au plus petit","du plus petit au plus grand"], rep:"du plus grand au plus petit"} ],
 2:[ {g:()=>{ const e=ri(1,20); const v=shuf([ri(10,99), ri(1,9)*10, ri(100,999)/10|0]).map(x=>x); const nums=[`${e},${ri(1,9)}`, `${e},0${ri(1,9)}`, `${e},${(x=>x%10?x:x+1)(ri(11,98))}`, `${e+1}`]; const val=s=>parseFloat(s.replace(",",".")); const sorted=[...nums].sort((p,q)=>val(p)-val(q)); return {q:`Quel est le plus petit de ces nombres : ${shuf(nums).join(" ; ")} ?`, c:shuf(nums), rep:sorted[0], ex:`${e+1} est le plus grand. Parmi les nombres de partie entière ${e}, on compare les dixièmes : ${sorted[0]} a le plus petit chiffre des dixièmes.`, sx:S_CMP}; }},
     {g:()=>{ const a=ri(2,9); return {q:`Complète : 0,99 … ${a-1}`, c:["&lt;","&gt;","="], rep:a-1>=1?"&lt;":"&gt;", ex:`On compare d'abord les parties entières : 0 &lt; ${a-1}.`, sx:S_CMP}; }} ],
 3:[ {g:()=>{ const e=ri(1,9), a=ri(1,8); const A=`${e},${a}`, B=`${e},${a}${ri(1,9)}${ri(1,9)}`; return {q:`Complète : ${A} … ${B}`, c:["&lt;","&gt;","="], rep:"&lt;", ex:`${A} = ${e},${a}00 et ${B} a plus de millièmes : ${A} &lt; ${B}. Le nombre qui a le plus de chiffres n'est pas forcément le plus grand !`, sx:S_CMP}; }},
     {g:()=>{ const e=ri(1,9), a=ri(2,9), b=ri(10,a*10-1); const A=`${e},${a}`, B=`${e},${String(b).padStart(2,"0")}`; return {q:`Vrai ou faux : ${B} &gt; ${A}, car ${b} &gt; ${a}.`, c:VF, rep:"Faux", ex:`${A} = ${e},${a}0 et ${a}0 &gt; ${b} : donc ${A} &gt; ${B}.`, sx:S_CMP}; }} ]
}},
{nom:"Encadrer et intercaler", schema:S_ENC, q:{
 1:[ {g:()=>{ const n=ri(1001,9999); const e=Math.floor(n/1000); return {q:`Encadre ${D(n,3)} à l'unité près : □ &lt; ${D(n,3)} &lt; □`, t:`□ &lt; ${D(n,3)} &lt; □`, r:[String(e),String(e+1)], ex:`${e} &lt; ${D(n,3)} &lt; ${e+1}.`, sx:S_ENC}; }} ],
 2:[ {g:()=>{ let n; do{ n=ri(1001,9999); }while(n%100===0); const d=Math.floor(n/100); return {q:`Encadre ${D(n,3)} au dixième près.`, t:`□ &lt; ${D(n,3)} &lt; □`, r:[T(D(d,1)),T(D(d+1,1))], ex:`${T(D(d,1))} &lt; ${D(n,3)} &lt; ${T(D(d+1,1))}.`, sx:S_ENC}; }},
     {g:()=>{ const a=ri(11,98); return {q:`Quel nombre est compris entre ${D(a,1)} et ${D(a+1,1)} ?`, c:uniq(D(10*a+5,2),[D(a+2,1),D(a,2),D(10*a-5,2)]), rep:D(10*a+5,2), ex:`On ajoute un chiffre après la virgule : ${D(a,1)} &lt; ${D(10*a+5,2)} &lt; ${D(a+1,1)}.`, sx:S_ENC}; }} ],
 3:[ {g:()=>{ let n; do{ n=ri(10001,99999); }while(n%10===0); const c=Math.floor(n/10); return {q:`Encadre ${D(n,3)} au centième près.`, t:`□ &lt; ${D(n,3)} &lt; □`, r:[D(c,2),D(c+1,2)].map(s=>[s,T(s)]), ex:`${D(c,2)} &lt; ${D(n,3)} &lt; ${D(c+1,2)}.`, sx:S_ENC}; }},
     {q:"Combien de nombres décimaux peut-on intercaler entre 1,57 et 1,58 ?", c:["une infinité","9","aucun","10"], rep:"une infinité", ex:"1,571 ; 1,5711 ; 1,57111… On peut toujours ajouter des chiffres.", sx:S_ENC} ]
}},
{nom:"Arrondir", schema:S_ARR, q:{
 1:[ {g:()=>{ const n=ri(101,999); const e=Math.round(n/100+1e-9); const up=n%100>=50; return {q:`Quel est l'arrondi à l'unité de ${D(n,2)} ?`, rep:String(Math.floor(n/100)+(up?1:0)), ex:`${Math.floor(n/100)} &lt; ${D(n,2)} &lt; ${Math.floor(n/100)+1}, et le chiffre des dixièmes est ${Math.floor(n/10)%10} : ${up?"on augmente":"on garde"}.`, sx:S_ARR}; }} ],
 2:[ {g:()=>{ let n; do{ n=ri(1001,9999); }while(n%100===50); const d=Math.floor(n/100)+(n%100>=50?1:0); return {q:`Quel est l'arrondi au dixième de ${D(n,3)} ?`, rep:[D(d,1), T(D(d,1))], ex:`Le chiffre des centièmes est ${Math.floor(n/10)%10} : ${n%100>=50?"on augmente le chiffre des dixièmes":"on garde le chiffre des dixièmes"}. Arrondi : ${D(d,1)}.`, sx:S_ARR}; }} ],
 3:[ {g:()=>{ const n=ri(101,999)*10+5; const c=Math.floor(n/10)+1; return {q:`Quel est l'arrondi au centième de ${D(n,3)} ?`, rep:[D(c,2),T(D(c,2))], ex:`${D(n,3)} est exactement au milieu entre ${D(c-1,2)} et ${D(c,2)} : on prend la borne supérieure, ${D(c,2)}.`, sx:S_ARR}; }},
     {g:()=>{ const n=ri(10,98)*100+ri(96,99); const u=Math.floor(n/100); return {q:`Quel est l'arrondi au dixième de ${D(n,2)} ?`, c:uniq(`${u+1},0`,[`${u},9`,`${u},10`,`${u+1}`].filter(x=>x!==`${u+1}`)), rep:`${u+1},0`, ex:`${u},9 &lt; ${D(n,2)} &lt; ${u+1},0 et ${D(n,2)} est plus proche de ${u+1},0 (on peut aussi écrire ${u+1}).`, sx:S_ARR}; }} ]
}}
],

/* ===================== ÉVAL D'ENTRAÎNEMENT (+ version aménagée pour les élèves à besoins particuliers) ===================== */
eval:{
titre:"Évaluation d'entraînement — Chapitre 5", duree:25, info:"Durée : 25 min · Calculatrice non autorisée",
comp:[
  ["RAISONNER","Je compare des nombres décimaux et je les range dans l'ordre.","Ex. 1 (3 points)"],
  ["CALCULER","Je trouve un encadrement, un nombre intercalé ou un arrondi.","Ex. 2 (2 points)"],
  ["REPRÉSENTER","J'écris un nombre décimal de plusieurs façons : écriture décimale, fraction décimale, en lettres.","Ex. 3 (3 points)"],
  ["REPRÉSENTER","Je repère et je place un nombre décimal sur une demi-droite graduée.","Ex. 4 (2 points)"]
],
exos:[
{t:"Le concours de saut en longueur", p:3, h:`<p>1) Vrai ou faux ? Corrige les phrases fausses. a) 15,3 est plus petit que 15,29. b) 6,07 est plus grand que 6,7. c) 0,9 et 0,90 sont égaux.</p>
  <p>2) Voici les sauts de cinq élèves : Léo 3,8 m · Ana 3,75 m · Tim 3,08 m · Lou 3,805 m · Sam 3,5 m.</p><p>Range ces longueurs dans l'ordre décroissant, puis donne le nom du gagnant.</p>`,
 c:`<p>1) a) Faux : 15,3 &gt; 15,29 (même partie entière ; 3 dixièmes &gt; 2 dixièmes). b) Faux : 6,07 &lt; 6,7 (0 dixième &lt; 7 dixièmes). c) Vrai : 0,90 = 0,9 (le zéro à droite est inutile). <i>(0,5 point chacun)</i></p>
  <p>2) J'écris tous les nombres avec trois chiffres après la virgule : 3,800 · 3,750 · 3,080 · 3,805 · 3,500.</p><p class="calc">3,805 &gt; 3,8 &gt; 3,75 &gt; 3,5 &gt; 3,08</p><p>Le gagnant est Lou. <i>(1 point pour le rangement, 0,5 point pour le gagnant)</i></p>`},
{t:"Encadrements et arrondis", p:2, h:`<p>a) Encadre 12,58 au dixième près : …… &lt; 12,58 &lt; ……</p><p>b) Trouve un nombre compris entre 7,4 et 7,41.</p><p>c) Arrondis 9,357 à l'unité, puis au centième.</p>`,
 c:`<p>a) 12,5 &lt; 12,58 &lt; 12,6 <i>(0,5 point)</i></p>
  <p>b) J'écris 7,4 = 7,400 et 7,41 = 7,410 : par exemple <b>7,405</b> (7,401 ; 7,402… conviennent aussi). <i>(0,5 point)</i></p>
  <p>c) À l'unité : 9 &lt; 9,357 &lt; 10, et 9,357 est plus proche de 9 : l'arrondi est <b>9</b>. Au centième : 9,35 &lt; 9,357 &lt; 9,36 ; le chiffre des millièmes est 7, donc l'arrondi est <b>9,36</b>. <i>(0,5 point chacun)</i></p>`},
{t:"Un nombre, plusieurs écritures", p:3, h:`<p>a) Donne l'écriture décimale de {2 053/100}.</p><p>b) Quelle fraction décimale est égale à 0,407 ?</p><p>c) Pour le nombre 618,294 : donne son chiffre des dixièmes, puis son nombre de dixièmes.</p><p>d) Écris 4,06 en lettres, avec les mots «&nbsp;unités&nbsp;» et «&nbsp;centièmes&nbsp;».</p><p>e) Écris 030,500 sans les zéros inutiles.</p>`,
 c:`<p>a) {2 053/100} = <b>20,53</b> (100 : deux chiffres après la virgule) <i>(0,5 point)</i></p>
  <p>b) 0,407 = <b>{407/1 000}</b> (trois chiffres après la virgule : 1 000) <i>(0,5 point)</i></p>
  <p>c) Le chiffre des dixièmes est <b>2</b>. Le nombre de dixièmes est <b>6 182</b> (je garde tous les chiffres jusqu'aux dixièmes). <i>(0,5 point chacun)</i></p>
  <p>d) quatre unités et six centièmes <i>(0,5 point)</i></p><p>e) 030,500 = <b>30,5</b> <i>(0,5 point)</i></p>`},
{t:"Zoom au centième", p:2, h:`${cent(48,[["A",482],["B",487]])}<p>a) Combien vaut une petite graduation ?</p><p>b) Donne l'abscisse de A et celle de B.</p><p>c) Place le point C(4,84).</p>`,
 c:`<p>a) Entre 4,8 et 4,9, il y a 10 intervalles : 0,1 ÷ 10 = <b>0,01</b> (un centième). <i>(0,5 point)</i></p><p>b) A(4,82) ; B(4,87) <i>(0,5 point chacun)</i></p>
  <p>c) C est à la 4<sup>e</sup> graduation après 4,8. <i>(0,5 point)</i></p>${cent(48,[["A",482],["C",484],["B",487]])}`}
],

/* ---------- version aménagée (tiers-temps) : le même sujet, environ un quart des questions en moins ---------- */
bep:{
titre:"Évaluation d'entraînement — Chapitre 5 · version aménagée", duree:25, info:"Version aménagée (tiers-temps) · Durée : 25 min · Calculatrice non autorisée",
note:"Le même sujet avec 4 questions en moins, à faire dans le même temps. Le total reste sur 10 points.",
comp:[
  ["RAISONNER","Je compare des nombres décimaux et je les range dans l'ordre.","Ex. 1 (3 points)"],
  ["CALCULER","Je trouve un encadrement, un nombre intercalé ou un arrondi.","Ex. 2 (2 points)"],
  ["REPRÉSENTER","J'écris un nombre décimal de plusieurs façons : écriture décimale, fraction décimale, en lettres.","Ex. 3 (3 points)"],
  ["REPRÉSENTER","Je repère et je place un nombre décimal sur une demi-droite graduée.","Ex. 4 (2 points)"]
],
exos:[
{t:"Le concours de saut en longueur", p:3, h:`<p>1) Vrai ou faux ? Corrige les phrases fausses. a) 15,3 est plus petit que 15,29. b) 6,07 est plus grand que 6,7.</p>
  <p>2) Voici les sauts de cinq élèves : Léo 3,8 m · Ana 3,75 m · Tim 3,08 m · Lou 3,805 m · Sam 3,5 m.</p><p>Range ces longueurs dans l'ordre décroissant, puis donne le nom du gagnant.</p>`,
 c:`<p>1) a) Faux : 15,3 &gt; 15,29 (même partie entière ; 3 dixièmes &gt; 2 dixièmes). b) Faux : 6,07 &lt; 6,7 (0 dixième &lt; 7 dixièmes). <i>(0,5 point chacun)</i></p>
  <p>2) J'écris tous les nombres avec trois chiffres après la virgule : 3,800 · 3,750 · 3,080 · 3,805 · 3,500.</p><p class="calc">3,805 &gt; 3,8 &gt; 3,75 &gt; 3,5 &gt; 3,08</p><p>Le gagnant est Lou. <i>(1,5 point pour le rangement, 0,5 point pour le gagnant)</i></p>`},
{t:"Encadrements et arrondis", p:2, h:`<p>a) Encadre 12,58 au dixième près : …… &lt; 12,58 &lt; ……</p><p>b) Arrondis 9,357 à l'unité, puis au centième.</p>`,
 c:`<p>a) 12,5 &lt; 12,58 &lt; 12,6 <i>(1 point)</i></p>
  <p>b) À l'unité : 9 &lt; 9,357 &lt; 10, et 9,357 est plus proche de 9 : l'arrondi est <b>9</b>. Au centième : 9,35 &lt; 9,357 &lt; 9,36 ; le chiffre des millièmes est 7, donc l'arrondi est <b>9,36</b>. <i>(0,5 point chacun)</i></p>`},
{t:"Un nombre, plusieurs écritures", p:3, h:`<p>a) Donne l'écriture décimale de {2 053/100}.</p><p>b) Pour le nombre 618,294 : donne son chiffre des dixièmes, puis son nombre de dixièmes.</p><p>c) Écris 4,06 en lettres, avec les mots «&nbsp;unités&nbsp;» et «&nbsp;centièmes&nbsp;».</p>`,
 c:`<p>a) {2 053/100} = <b>20,53</b> (100 : deux chiffres après la virgule) <i>(1 point)</i></p>
  <p>b) Le chiffre des dixièmes est <b>2</b>. Le nombre de dixièmes est <b>6 182</b> (je garde tous les chiffres jusqu'aux dixièmes). <i>(0,5 point chacun)</i></p>
  <p>c) quatre unités et six centièmes <i>(1 point)</i></p>`},
{t:"Zoom au centième", p:2, h:`${cent(48,[["A",482],["B",487]])}<p>a) Combien vaut une petite graduation ?</p><p>b) Donne l'abscisse de A et celle de B.</p><p>c) Place le point C(4,84).</p>`,
 c:`<p>a) Entre 4,8 et 4,9, il y a 10 intervalles : 0,1 ÷ 10 = <b>0,01</b> (un centième). <i>(0,5 point)</i></p><p>b) A(4,82) ; B(4,87) <i>(0,5 point chacun)</i></p>
  <p>c) C est à la 4<sup>e</sup> graduation après 4,8. <i>(0,5 point)</i></p>${cent(48,[["A",482],["C",484],["B",487]])}`}
]}
}
};
})();
