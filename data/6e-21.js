/* 6e — Chapitre 21 : Organisation de données (cours et fiche d'exercices de M. Staal)
   Valeurs des graphiques lues sur ses figures. */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const co = (p,alt,w) => img("c621co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("c621ex/"+p+".png", alt, w);
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;

/* diagramme en barres : labels, valeurs, pas de graduation */
function barres(labels, vals, o={}){ const n=labels.length, bw=o.bw||46, gap=o.gap||18, H=150, top=Math.max(...vals), step=o.step||(top>12?2:1), ymax=Math.ceil((top+1)/step)*step, k=(H-10)/ymax, x0=34, W=x0+n*(bw+gap)+10;
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H+44}" width="${W}" style="max-width:100%" role="img" aria-label="${o.alt||"Un diagramme en barres"}">`;
  if(o.title) s+=`<text x="${W/2}" y="12" text-anchor="middle" style="font-size:13px;font-weight:700;fill:var(--ink)">${o.title}</text>`;
  for(let v=0; v<=ymax; v+=step){ const y=H+10-v*k; s+=`<line x1="${x0}" y1="${y}" x2="${W-6}" y2="${y}" style="stroke:#ddd"/><text x="${x0-5}" y="${y+4}" text-anchor="end" style="font-size:11px;fill:var(--ink)">${v}</text>`; }
  labels.forEach((l,i)=>{ const x=x0+gap/2+i*(bw+gap), h=vals[i]*k; s+=`<rect x="${x}" y="${H+10-h}" width="${bw}" height="${h}" style="fill:#6fa8dc;stroke:#222;stroke-width:1.2"/><text x="${x+bw/2}" y="${H+26}" text-anchor="middle" style="font-size:11px;fill:var(--ink)">${l}</text>`; });
  return s+`<line x1="${x0}" y1="${H+10}" x2="${W-6}" y2="${H+10}" style="stroke:#222;stroke-width:1.5"/><line x1="${x0}" y1="${H+10}" x2="${x0}" y2="14" style="stroke:#222;stroke-width:1.5"/></svg>`; }
/* repère avec des points */
function repere(pts, o={}){ const nx=o.nx||12, ny=o.ny||9, c=o.c||24, x0=24, y0=22, W=x0+nx*c+20, H=y0+ny*c+28; const X=x=>x0+x*c, Y=y=>y0+(ny-y)*c;
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:100%" role="img" aria-label="Des points dans un repère">`;
  for(let i=0;i<=nx;i++) s+=`<line x1="${X(i)}" y1="${Y(0)}" x2="${X(i)}" y2="${Y(ny)}" style="stroke:#ddd"/><text x="${X(i)}" y="${Y(0)+16}" text-anchor="middle" style="font-size:11px;fill:var(--ink)">${i}</text>`;
  for(let j=0;j<=ny;j++) s+=`<line x1="${X(0)}" y1="${Y(j)}" x2="${X(nx)}" y2="${Y(j)}" style="stroke:#ddd"/>${j?`<text x="${X(0)-6}" y="${Y(j)+4}" text-anchor="end" style="font-size:11px;fill:var(--ink)">${j}</text>`:""}`;
  s+=`<line x1="${X(0)}" y1="${Y(0)}" x2="${X(nx)+10}" y2="${Y(0)}" style="stroke:#222;stroke-width:1.5"/><line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(ny)-6}" style="stroke:#222;stroke-width:1.5"/>`;
  pts.forEach(([n,x,y,col])=>{ s+=`<circle cx="${X(x)}" cy="${Y(y)}" r="4.5" style="fill:${col||"#1e5aa8"}"/><text x="${X(x)+6}" y="${Y(y)-6}" style="font-size:14px;font-weight:700;fill:${col||"#1e5aa8"}">${n}</text>`; });
  return s+"</svg>"; }
window.FIG21 = {barres, repere};

/* ---------- schémas ---------- */
const S_EFF = sch("Le tableau d'effectifs", `<div class="scroll"><table class="std"><thead><tr><th>Couleur</th><th>Rouge</th><th>Bleu</th><th>Vert</th><th>Jaune</th><th>Noir</th><th>Total</th></tr></thead><tbody><tr><th>Effectif</th><td>4</td><td>7</td><td>3</td><td>2</td><td>4</td><td>20</td></tr></tbody></table></div><p class="schN">L'effectif d'une valeur : le nombre de fois où elle apparaît. La somme des effectifs = l'effectif total.</p>`);
const S_DOUBLE = sch("Le tableau à double entrée", `<div class="scroll"><table class="std"><thead><tr><th></th><th>À pied</th><th>Bus</th><th>Vélo</th><th>Total</th></tr></thead><tbody><tr><th>Filles</th><td>5</td><td>8</td><td>2</td><td>15</td></tr><tr><th>Garçons</th><td>4</td><td>6</td><td><b>3</b></td><td>13</td></tr><tr><th>Total</th><td>9</td><td>14</td><td>5</td><td>28</td></tr></tbody></table></div><p class="schN">On lit à l'intersection d'une ligne et d'une colonne : 3 garçons viennent à vélo.</p>`);
const S_LIRE = sch("Lire un graphique", co("graph","Température relevée au cours d'une journée",420)+`<p class="schN">Je lis le titre, les axes (grandeurs et unités), puis la graduation.</p>`);

CH["6e-21"] = {
intro:"Mener une enquête, ranger des données dans un tableau d'effectifs ou un tableau à double entrée, lire des diagrammes et des graphiques, et sélectionner des données.",
savoir:[
  "organiser une enquête : choisir une question, recueillir des données ;",
  "ranger des données dans un tableau (tableau d'effectifs, tableau à double entrée) ;",
  "lire et exploiter un tableau, un diagramme ou un graphique ;",
  "sélectionner les données qui vérifient un critère."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Mener une enquête", h:`
  <div class="retenir" data-l="Définition"><p>Une <b>enquête statistique</b> consiste à recueillir des informations (les <b>données</b>) auprès d'un groupe de personnes ou d'objets, pour répondre à une question.</p></div>
  <div class="retenir" data-l="Les étapes d'une enquête"><ol><li>Choisir une question précise et le groupe à interroger ;</li><li>recueillir les données (questionnaire, relevés, mesures…) ;</li><li>organiser les données dans un tableau ;</li><li>représenter et interpréter les résultats pour répondre à la question.</li></ol></div>
  <p>L'<b>effectif</b> d'une valeur est le nombre de fois où elle apparaît. L'<b>effectif total</b> est le nombre total de données.</p>`},
{k:"II", t:"Organiser des données dans un tableau", h:`
  <h4>1. Le tableau d'effectifs</h4>
  <p>On a demandé leur couleur préférée à 20 élèves : bleu, rouge, vert, bleu, noir, bleu, jaune, rouge, bleu, noir, vert, bleu, rouge, noir, bleu, jaune, rouge, vert, bleu, noir.</p>
  <p>On compte chaque couleur (on peut barrer les données au fur et à mesure) et on range les effectifs dans un tableau :</p>
  <div class="scroll"><table class="std"><thead><tr><th>Couleur</th><th>Rouge</th><th>Bleu</th><th>Vert</th><th>Jaune</th><th>Noir</th><th>Total</th></tr></thead><tbody><tr><th>Effectif</th><td>4</td><td>7</td><td>3</td><td>2</td><td>4</td><td>20</td></tr></tbody></table></div>
  <p class="attention"><b>ATTENTION :</b> on vérifie que la somme des effectifs est égale à l'effectif total.</p>
  <h4>2. Le tableau à double entrée</h4>
  <p>Il croise deux informations : on lit une valeur à l'intersection d'une ligne et d'une colonne.</p>
  <div class="scroll"><table class="std"><thead><tr><th></th><th>À pied</th><th>Bus</th><th>Vélo</th><th>Total</th></tr></thead><tbody><tr><th>Filles</th><td>5</td><td>8</td><td>2</td><td>15</td></tr><tr><th>Garçons</th><td>4</td><td>6</td><td>3</td><td>13</td></tr><tr><th>Total</th><td>9</td><td>14</td><td>5</td><td>28</td></tr></tbody></table></div>
  <p><b>Exemple :</b> 3 garçons viennent à vélo (ligne « Garçons », colonne « Vélo ») ; au total, 14 élèves viennent en bus.</p>`},
{k:"III", t:"Lire des représentations", h:`
  <div class="retenir" data-l="Méthode"><ol><li>Je lis le titre : de quoi parle-t-on ?</li><li>Je lis ce qui est indiqué sur chaque axe (les grandeurs et leurs unités) ;</li><li>je repère la graduation : de combien en combien avance-t-on ?</li></ol></div>
  <h4>1. Le diagramme en barres et le diagramme circulaire</h4>
  <div class="figs">${co("barres","Diagramme en barres : couleur préférée de 20 élèves",230)}${co("circ","Diagramme circulaire : venir au collège",230)}</div>
  <p>Dans le diagramme en barres, la hauteur de chaque barre représente l'effectif : 7 élèves préfèrent le bleu. Dans le diagramme circulaire, chaque secteur représente une part du tout : la moitié des élèves vient en bus.</p>
  <h4>2. Le graphique</h4>
  <p>Un graphique montre comment une grandeur évolue en fonction d'une autre (ici, la température en fonction de l'heure).</p>
  ${co("graph","Température relevée au cours d'une journée",470)}
  <p><b>Exemple :</b> à 10 h, il faisait 13 °C. La température la plus haute (18 °C) a été relevée à 14 h.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Mener une enquête", e:[
  {n:"Activité 1", t:"Préparons notre enquête", w:"En classe", h:`<p>Avec la classe, on veut mener une enquête auprès des élèves de 6e du collège. Choisissez ensemble un sujet (par exemple : le temps de trajet pour venir au collège, l'animal préféré, le nombre de frères et sœurs, l'heure du coucher…), puis complétez la fiche de préparation.</p><div class="scroll"><table class="std"><thead><tr><th>Étape</th><th>Notre choix</th></tr></thead><tbody><tr><td>1. La question que l'on pose</td><td></td></tr><tr><td>2. Qui interroge-t-on ? Combien de personnes ?</td><td></td></tr><tr><td>3. Comment recueille-t-on les réponses ?</td><td></td></tr><tr><td>4. Comment présente-t-on les résultats ?</td><td></td></tr></tbody></table></div><p>Ensuite, réalisez l'enquête, rangez les réponses dans un tableau d'effectifs et présentez vos résultats à la classe.</p>`,
   c:`<p>Exemple de fiche :</p><div class="scroll"><table class="std"><tbody><tr><td>1. La question</td><td>« Combien de minutes mets-tu pour venir au collège ? »</td></tr><tr><td>2. Qui ?</td><td>Les élèves de 6e du collège, par exemple 4 classes (environ 100 élèves).</td></tr><tr><td>3. Comment ?</td><td>Un questionnaire distribué en classe, puis on compte les réponses.</td></tr><tr><td>4. Présentation</td><td>Un tableau d'effectifs (moins de 10 min, de 10 à 20 min, plus de 20 min) et un diagramme en barres.</td></tr></tbody></table></div>`},
  {n:"Exercice 1", t:"Une bonne question ?", w:"Sur ta feuille", h:`<p>Pour chaque enquête, entoure la question la plus adaptée et explique pourquoi l'autre ne convient pas.</p><p>a) Pour connaître le temps de trajet des élèves : « Habites-tu loin ? » ou « Combien de minutes mets-tu pour venir au collège ? »</p><p>b) Pour connaître l'animal préféré des élèves : « Quel est ton animal préféré ? » ou « Tu préfères les chiens, non ? »</p><p>c) Pour connaître la pointure des élèves : « As-tu de grands pieds ? » ou « Quelle est ta pointure ? »</p>`,
   c:`<p>a) <b>« Combien de minutes mets-tu pour venir au collège ? »</b> : la réponse est un nombre précis. « Loin », chacun le comprend à sa façon.</p><p>b) <b>« Quel est ton animal préféré ? »</b> : l'autre question pousse à répondre « chien ».</p><p>c) <b>« Quelle est ta pointure ? »</b> : la réponse est un nombre précis ; « grands pieds » ne veut rien dire de précis.</p>`}
 ]},
{t:"Organiser des données dans un tableau", e:[
  {n:"Exercice 2", t:"Le tableau d'effectifs", w:"Sur ta feuille", h:`<p>On a demandé à 24 élèves quel animal ils ont à la maison (un seul animal par élève) :</p><p>chat, chien, chien, lapin, aucun, chat, poisson, chien, chat, lapin, chien, chat, chien, poisson, aucun, chat, lapin, chien, chat, chien, poisson, lapin, chat, chien.</p><p>Complète le tableau d'effectifs, puis vérifie ton total.</p><div class="scroll"><table class="std"><thead><tr><th>Animal</th><th>Chat</th><th>Chien</th><th>Lapin</th><th>Poisson</th><th>Aucun</th><th>Total</th></tr></thead><tbody><tr><th>Effectif</th>${'<td style="height:2.6em;min-width:3.4em"></td>'.repeat(6)}</tr></tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Animal</th><th>Chat</th><th>Chien</th><th>Lapin</th><th>Poisson</th><th>Aucun</th><th>Total</th></tr></thead><tbody><tr><th>Effectif</th><td>7</td><td>8</td><td>4</td><td>3</td><td>2</td><td>24</td></tr></tbody></table></div><p>Vérification : 7 + 8 + 4 + 3 + 2 = 24, l'effectif total.</p>`},
  {n:"Exercice 3", t:"Le tableau à double entrée", w:"Sur ta feuille", h:`<p>Voici comment les élèves de trois classes de 6e viennent au collège.</p><div class="scroll"><table class="std"><thead><tr><th></th><th>À pied</th><th>Vélo</th><th>Bus</th><th>Voiture</th><th>Total</th></tr></thead><tbody><tr><th>6e A</th><td>8</td><td>4</td><td>10</td><td>3</td><td></td></tr><tr><th>6e B</th><td>6</td><td>7</td><td>9</td><td>4</td><td></td></tr><tr><th>6e C</th><td>10</td><td>3</td><td>8</td><td>5</td><td></td></tr><tr><th>Total</th><td></td><td></td><td></td><td></td><td></td></tr></tbody></table></div><p>a) Combien d'élèves de 6e B viennent à vélo ? b) Complète la colonne et la ligne « Total ». c) Quelle classe compte le plus d'élèves qui viennent à pied ? d) Quel est le moyen de transport le plus utilisé ?</p>`,
   c:`<p>a) Ligne « 6e B », colonne « Vélo » : <b>7 élèves</b>.</p><p>b)</p><div class="scroll"><table class="std"><thead><tr><th></th><th>À pied</th><th>Vélo</th><th>Bus</th><th>Voiture</th><th>Total</th></tr></thead><tbody><tr><th>6e A</th><td>8</td><td>4</td><td>10</td><td>3</td><td><b>25</b></td></tr><tr><th>6e B</th><td>6</td><td>7</td><td>9</td><td>4</td><td><b>26</b></td></tr><tr><th>6e C</th><td>10</td><td>3</td><td>8</td><td>5</td><td><b>26</b></td></tr><tr><th>Total</th><td><b>24</b></td><td><b>14</b></td><td><b>27</b></td><td><b>12</b></td><td><b>77</b></td></tr></tbody></table></div><p>c) Colonne « À pied » : 8, 6 et 10. C'est la <b>6e C</b> (10 élèves).</p><p>d) Ligne « Total » : 24, 14, 27 et 12. C'est le <b>bus</b> (27 élèves).</p><p><i>Vérification : 25 + 26 + 26 = 77 et 24 + 14 + 27 + 12 = 77.</i></p>`},
  {n:"Exercice 4", t:"Sélectionner des données", w:"Sur ta feuille", h:`<p>Voici quelques informations (valeurs approchées) sur des animaux.</p><div class="scroll"><table class="std"><thead><tr><th>Animal</th><th>Masse</th><th>Durée de vie</th><th>Régime alimentaire</th></tr></thead><tbody><tr><td>Éléphant d'Afrique</td><td>6 000 kg</td><td>65 ans</td><td>herbivore</td></tr><tr><td>Lion</td><td>190 kg</td><td>14 ans</td><td>carnivore</td></tr><tr><td>Girafe</td><td>1 200 kg</td><td>25 ans</td><td>herbivore</td></tr><tr><td>Loup</td><td>40 kg</td><td>13 ans</td><td>carnivore</td></tr><tr><td>Ours brun</td><td>300 kg</td><td>25 ans</td><td>omnivore</td></tr><tr><td>Zèbre</td><td>350 kg</td><td>25 ans</td><td>herbivore</td></tr><tr><td>Tigre</td><td>220 kg</td><td>15 ans</td><td>carnivore</td></tr><tr><td>Kangourou</td><td>70 kg</td><td>20 ans</td><td>herbivore</td></tr></tbody></table></div><p>a) Cite tous les animaux herbivores. b) Cite les animaux qui vivent plus de 20 ans. c) Cite les carnivores de plus de 200 kg. d) Range les animaux du plus léger au plus lourd.</p>`,
   c:`<p>a) éléphant d'Afrique, girafe, zèbre, kangourou.</p><p>b) éléphant d'Afrique (65 ans), girafe, ours brun et zèbre (25 ans). <i>Le kangourou vit 20 ans : pas plus de 20 ans.</i></p><p>c) le <b>tigre</b> (220 kg). <i>Le lion pèse 190 kg, moins de 200 kg.</i></p><p>d) loup (40 kg) &lt; kangourou (70 kg) &lt; lion (190 kg) &lt; tigre (220 kg) &lt; ours brun (300 kg) &lt; zèbre (350 kg) &lt; girafe (1 200 kg) &lt; éléphant (6 000 kg).</p>`},
  {n:"Exercice 5", t:"Produire un tableau", w:"Sur ton cahier", h:`<p>Au marché, Paul a vendu : lundi, 12 kg de pommes, 8 kg de poires et 5 kg de prunes ; mardi, 15 kg de pommes, 6 kg de poires et 9 kg de prunes ; mercredi, 10 kg de pommes, 11 kg de poires et 7 kg de prunes.</p><p>a) Présente ces données dans un tableau à double entrée (une ligne par jour, une colonne par fruit). b) Ajoute une ligne et une colonne « Total », puis complète-les. c) Quel jour Paul a-t-il vendu le plus de fruits ? Quel fruit a-t-il le plus vendu ?</p>`,
   c:`<p>a) et b)</p><div class="scroll"><table class="std"><thead><tr><th>(en kg)</th><th>Pommes</th><th>Poires</th><th>Prunes</th><th>Total</th></tr></thead><tbody><tr><th>Lundi</th><td>12</td><td>8</td><td>5</td><td><b>25</b></td></tr><tr><th>Mardi</th><td>15</td><td>6</td><td>9</td><td><b>30</b></td></tr><tr><th>Mercredi</th><td>10</td><td>11</td><td>7</td><td><b>28</b></td></tr><tr><th>Total</th><td><b>37</b></td><td><b>25</b></td><td><b>21</b></td><td><b>83</b></td></tr></tbody></table></div><p>c) Paul a vendu le plus de fruits le <b>mardi</b> (30 kg). Le fruit le plus vendu : les <b>pommes</b> (37 kg).</p>`}
 ]},
{t:"Lire des représentations", e:[
  {n:"Exercice 6", t:"Le diagramme en barres", w:"Sur ta feuille", h:`${ex("e6","Diagramme en barres : sport préféré des élèves de 6e B",380)}<p>a) Combien d'élèves préfèrent la natation ? b) Quel est le sport le plus choisi ? Le moins choisi ? c) Combien d'élèves de plus préfèrent le football au basket ? d) Combien d'élèves ont répondu en tout ?</p>`,
   c:`<p>a) La barre « Natation » monte à 6 : <b>6 élèves</b>.</p><p>b) Le plus choisi : le <b>football</b> (9) ; le moins choisi : le <b>judo</b> (2).</p><p>c) Football : 9 ; basket : 5. 9 − 5 = <b>4 élèves</b> de plus.</p><p>d) J'additionne les hauteurs des barres : 9 + 5 + 3 + 6 + 4 + 2 = <b>29 élèves</b>.</p>`},
  {n:"Exercice 7", t:"Le diagramme circulaire", w:"Sur ta feuille", h:`<div class="cpt"><div><p>Ce diagramme montre comment Lina passe une journée de 24 heures.</p><p>a) Quelle activité occupe le plus de temps ? b) Le collège occupe un quart de la journée. Combien d'heures cela fait-il ? c) Lina dort 9 h. Dort-elle plus ou moins d'un tiers de la journée ? d) Trajets et devoirs durent 1 h chacun. Les loisirs durent 5 h. Combien de temps durent les repas ?</p></div>${ex("e7","Diagramme circulaire : une journée de Lina",380)}</div>`,
   c:`<p>a) Le <b>sommeil</b> (le plus grand secteur).</p><p>b) 24 ÷ 4 = <b>6 heures</b>.</p><p>c) Un tiers de la journée : 24 ÷ 3 = 8 h. 9 h &gt; 8 h : elle dort <b>plus</b> d'un tiers de la journée.</p><p>d) La durée t qui reste :</p><p class="calc">t = 24 − (9 + 6 + 5 + 1 + 1)<br>t = 24 − 22<br>t = <b>2 heures</b></p>`},
  {n:"Exercice 8", t:"Le graphique", w:"Sur ta feuille", h:`${ex("e8","Graphique : taille de Tom selon son âge",440)}<p>a) Quelle était la taille de Tom à 5 ans ? b) À quel âge Tom mesurait-il 1 m 28 cm ? c) De combien Tom a-t-il grandi pendant sa première année ? Entre 10 et 12 ans ? d) À quelle période Tom a-t-il grandi le plus vite ? Explique comment tu le vois sur le graphique.</p>`,
   c:`<p>a) <b>110 cm</b>, soit 1 m 10 cm. b) 1 m 28 cm = 128 cm : à <b>8 ans</b>.</p><p>c) Première année : de 50 cm à 75 cm, soit <b>25 cm</b>. Entre 10 et 12 ans : de 138 cm à 150 cm, soit <b>12 cm</b>.</p><p>d) Pendant sa <b>première année</b> : c'est là que la courbe monte le plus fort (le segment est le plus « raide »).</p>`},
  {n:"Exercice 9", t:"Des points dans un repère", w:"Sur ta feuille", h:`<div class="cpt"><div><p>Chaque point est repéré par deux nombres : son abscisse (lue sur l'axe horizontal) puis son ordonnée (lue sur l'axe vertical). On écrit par exemple A(2 ; 3).</p><p>a) Écris de la même façon les coordonnées des points B, C, D, E et F.</p><p>b) Place les points G(4 ; 1), H(10 ; 6) et K(6 ; 9).</p></div>${ex("e9","Un repère avec les points A à F",360)}</div>`,
   c:`<p>a) <b>B(5 ; 7)</b> · <b>C(9 ; 4)</b> · <b>D(0 ; 6)</b> · <b>E(7 ; 0)</b> · <b>F(11 ; 8)</b></p><p>b)</p>${repere([["A",2,3],["B",5,7],["C",9,4],["D",0,6],["E",7,0],["F",11,8],["G",4,1,"#d0342c"],["H",10,6,"#d0342c"],["K",6,9,"#d0342c"]])}`},
  {n:"En ++", t:"Le tableau mystère", w:"Sur ton cahier", h:`<p>Dans un collège, il y a 120 élèves de 6e, dont 65 filles. 70 élèves sont demi-pensionnaires, les autres sont externes. 30 garçons sont externes. Reproduis et complète ce tableau.</p><div class="scroll"><table class="std"><thead><tr><th></th><th>Demi-pensionnaires</th><th>Externes</th><th>Total</th></tr></thead><tbody><tr><th>Filles</th><td></td><td></td><td></td></tr><tr><th>Garçons</th><td></td><td></td><td></td></tr><tr><th>Total</th><td></td><td></td><td></td></tr></tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th></th><th>Demi-pensionnaires</th><th>Externes</th><th>Total</th></tr></thead><tbody><tr><th>Filles</th><td>45</td><td>20</td><td>65</td></tr><tr><th>Garçons</th><td>25</td><td>30</td><td>55</td></tr><tr><th>Total</th><td>70</td><td>50</td><td>120</td></tr></tbody></table></div><p>Garçons : 120 − 65 = 55. Externes : 120 − 70 = 50. Garçons demi-pensionnaires : 55 − 30 = 25. Filles externes : 50 − 30 = 20. Filles demi-pensionnaires : 65 − 20 = 45.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Tableaux", schema:S_EFF, q:{
 1:[ {g:()=>{ const v=[ri(2,9),ri(2,9),ri(2,9),ri(2,9)]; return {q:`Effectifs : ${v.join(", ")}. Quel est l'effectif total ?`, rep:String(v.reduce((s,x)=>s+x,0)), sx:S_EFF}; }} ],
 2:[ {g:()=>{ const d=shuf(["chat","chien","chat","lapin","chien","chat","poisson","chien","chat","lapin"].concat(pick([["chat"],["chien"],["lapin","lapin"]]))); const a=pick(["chat","chien","lapin"]); return {q:`Données : ${d.join(", ")}. Quel est l'effectif de « ${a} » ?`, rep:String(d.filter(x=>x===a).length), sx:S_EFF}; }},
     {q:"Dans le tableau à double entrée du cours, combien de filles viennent en bus ?", fig:`<div class="scroll"><table class="std"><thead><tr><th></th><th>À pied</th><th>Bus</th><th>Vélo</th></tr></thead><tbody><tr><th>Filles</th><td>5</td><td>8</td><td>2</td></tr><tr><th>Garçons</th><td>4</td><td>6</td><td>3</td></tr></tbody></table></div>`, rep:"8", sx:S_DOUBLE} ],
 3:[ {g:()=>{ const f=ri(30,70), t=f+ri(30,70); return {q:`Un collège a ${t} élèves de 6e, dont ${f} filles. Combien de garçons ?`, rep:String(t-f), sx:S_DOUBLE}; }} ]
}},
{nom:"Diagrammes", schema:S_LIRE, q:{
 1:[ {g:()=>{ const L=["Foot","Basket","Tennis","Danse"], v=L.map(()=>ri(1,10)); const i=ri(0,3); return {q:`Combien d'élèves ont choisi « ${L[i]} » ?`, fig:barres(L,v), rep:String(v[i]), sx:S_LIRE}; }} ],
 2:[ {g:()=>{ const L=["Lundi","Mardi","Jeudi","Vendredi"], v=distinct4(); return {q:"Quel jour l'effectif est-il le plus grand ?", fig:barres(L,v,{step:2}), c:L, rep:L[v.indexOf(Math.max(...v))], sx:S_LIRE}; }} ],
 3:[ {g:()=>{ const L=["A","B","C","D","E"], v=L.map(()=>2*ri(1,8)); return {q:"Quel est l'effectif total ?", fig:barres(L,v,{step:2,bw:36}), rep:String(v.reduce((s,x)=>s+x,0)), sx:S_LIRE}; }},
     {q:"Dans un diagramme circulaire, un secteur qui occupe la moitié du disque représente…", c:["50 %","25 %","100 %"], rep:"50 %", sx:S_LIRE} ]
}},
{nom:"Graphiques et repères", schema:S_LIRE, q:{
 1:[ {q:"Sur le graphique de la température (cours), quelle température à 10 h ?", fig:co("graph","Température au cours d'une journée",420), c:["13 °C","10 °C","18 °C"], rep:"13 °C", sx:S_LIRE} ],
 2:[ {g:()=>{ const x=ri(1,10), y=ri(1,8); return {q:"Quelles sont les coordonnées du point M ?", fig:repere([["M",x,y]],{c:20}), c:shuf([`(${x} ; ${y})`,`(${y} ; ${x})`,`(${x} ; ${y+1})`].filter((s,i,a)=>a.indexOf(s)===i)), rep:`(${x} ; ${y})`, ex:"On lit d'abord l'abscisse (axe horizontal), puis l'ordonnée.", sx:S_LIRE}; }} ],
 3:[ {q:"Sur le graphique de la température (cours), à quelle heure fait-il le plus chaud ?", fig:co("graph","Température au cours d'une journée",420), c:["14 h","12 h","16 h"], rep:"14 h", sx:S_LIRE} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
const souv = t => `<div class="retenir" data-l="Je me souviens"><p>${t}</p></div>`;
const PARF = ["Sucre","Chocolat","Confiture","Caramel","Citron"];
const DIAG = v => barres(PARF, v, {step:2, bw:50, title:"Crêpes vendues à la kermesse", alt:"Diagramme en barres : nombre de crêpes vendues pour chaque parfum"}).replace(/width="(\d+)"/, (m,w)=>`width="${Math.round(w*1.45)}"`);
const cell = '<td style="height:2.6em;min-width:3.4em"></td>';
const TEFF = (vals) => `<div class="scroll"><table class="std"><thead><tr><th>Nombre de frères et sœurs</th><th>0</th><th>1</th><th>2</th><th>3</th><th>Total</th></tr></thead><tbody><tr><th>Effectif</th>${vals?vals.map(x=>`<td><b>${x}</b></td>`).join(""):cell.repeat(5)}</tr></tbody></table></div>`;
/* tableau à double entrée : null = case à compléter */
const TDBL = (L, sol) => `<div class="scroll"><table class="std"><thead><tr><th></th><th>Fruit</th><th>Yaourt</th><th>Gâteau</th><th>Total</th></tr></thead><tbody>${[["6e",L[0]],["5e",L[1]],["Total",L[2]]].map(([n,r],i)=>`<tr><th>${n}</th>${r.map((x,j)=>x===null?`<td style="min-width:3.4em">${sol?`<b>${sol[i][j]}</b>`:"……"}</td>`:`<td>${x}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const D1 = [[12,9,null,35],[null,11,16,null],[20,null,30,null]], S1 = [[12,9,14,35],[8,11,16,35],[20,20,30,70]];
const D2 = [[10,10,null,30],[null,5,15,null],[20,null,25,null]], S2 = [[10,10,10,30],[10,5,15,30],[20,15,25,60]];
return {
titre:"Évaluation d'entraînement — Chapitre 21", duree:25, info:"Durée : 25 min · Calculatrice non autorisée",
comp:[
  ["COMMUNIQUER","Je lis et j'exploite un diagramme en barres.","Ex. 1 (4 points)"],
  ["REPRÉSENTER","Je range des données dans un tableau d'effectifs.","Ex. 2 (3 points)"],
  ["COMMUNIQUER","Je lis et je complète un tableau à double entrée.","Ex. 3 (3 points)"]
],
exos:[
{t:"Les crêpes de la kermesse", p:4, h:`<p>Ce diagramme indique le nombre de crêpes vendues pour chaque parfum.</p>${DIAG([12,18,7,10,5])}
  <p>a) Combien de crêpes au chocolat ont été vendues ?</p><p>b) Quel parfum a été le moins vendu ?</p><p>c) Quels parfums ont été vendus plus de 10 fois ?</p><p>d) Combien de crêpes ont été vendues en tout ?</p>`,
 c:`<p>a) La barre « Chocolat » monte jusqu'à 18 : <b>18 crêpes</b>. <i>(1 point)</i></p>
  <p>b) La barre la plus basse est celle du <b>citron</b> (5 crêpes). <i>(1 point)</i></p>
  <p>c) Le <b>sucre</b> (12) et le <b>chocolat</b> (18). Le caramel a été vendu exactement 10 fois : pas plus de 10 fois. <i>(1 point)</i></p>
  <p>d) On additionne les hauteurs des barres :</p><p class="calc">N = 12 + 18 + 7 + 10 + 5<br>N = 52</p><p><b>52 crêpes</b> ont été vendues. <i>(1 point)</i></p>`},
{t:"Frères et sœurs", p:3, h:`<p>On a demandé à 22 élèves combien ils ont de frères et sœurs. Voici leurs réponses :</p><p>1, 0, 2, 1, 1, 3, 0, 2, 1, 2, 0, 1, 1, 2, 3, 1, 0, 2, 1, 0, 2, 1.</p>
  <p>a) Recopie et complète le tableau d'effectifs.</p>${TEFF()}<p>b) Combien d'élèves ont au moins 2 frères et sœurs ?</p>`,
 c:`<p>a)</p>${TEFF([5,9,6,2,22])}<p>Vérification : 5 + 9 + 6 + 2 = 22, c'est bien le nombre d'élèves interrogés. <i>(0,5 point par effectif et 0,5 point pour le total)</i></p>
  <p>b) « Au moins 2 », c'est 2 ou 3 : 6 + 2 = <b>8 élèves</b>. <i>(0,5 point)</i></p>`},
{t:"Le dessert de la cantine", p:3, h:`<p>Ce tableau indique le dessert choisi par les élèves de 6e et de 5e, un jour à la cantine.</p>${TDBL(D1)}
  <p>a) Complète les cinq cases vides du tableau.</p><p>b) Quel dessert les élèves de 5e ont-ils le plus choisi ?</p>`,
 c:`<p>a)</p>${TDBL(D1,S1)}
  <p>Gâteau en 6e : 35 − 12 − 9 = 14. Fruit en 5e : 20 − 12 = 8. Total des 5e : 8 + 11 + 16 = 35.</p><p>Total des yaourts : 9 + 11 = 20. Total général : 20 + 20 + 30 = 70 (ou 35 + 35 = 70). <i>(0,5 point par case)</i></p>
  <p>b) Ligne « 5e » : 8, 11 et 16. Les élèves de 5e ont le plus choisi le <b>gâteau</b> (16 élèves). <i>(0,5 point)</i></p>`}
],
bep:{
titre:"Évaluation d'entraînement — Chapitre 21 · version aménagée", duree:25, info:"Version aménagée (tiers-temps) · Durée : 25 min · Calculatrice non autorisée",
note:"Le même sujet avec 2 questions en moins, à faire dans le même temps. Le total reste sur 10 points.",
comp:[
  ["COMMUNIQUER","Je lis et j'exploite un diagramme en barres.","Ex. 1 (4,5 points)"],
  ["REPRÉSENTER","Je range des données dans un tableau d'effectifs.","Ex. 2 (2,5 points)"],
  ["COMMUNIQUER","Je lis et je complète un tableau à double entrée.","Ex. 3 (3 points)"]
],
exos:[
{t:"Les crêpes de la kermesse", p:4.5, h:`<p>Ce diagramme indique le nombre de crêpes vendues pour chaque parfum.</p>${DIAG([12,18,7,10,5])}
  <p>a) Combien de crêpes au chocolat ont été vendues ?</p><p>b) Quel parfum a été le moins vendu ?</p><p>c) Combien de crêpes ont été vendues en tout ?</p>`,
 c:`<p>a) La barre « Chocolat » monte jusqu'à 18 : <b>18 crêpes</b>. <i>(1,5 point)</i></p>
  <p>b) La barre la plus basse est celle du <b>citron</b> (5 crêpes). <i>(1,5 point)</i></p>
  <p>c) On additionne les hauteurs des barres :</p><p class="calc">N = 12 + 18 + 7 + 10 + 5<br>N = 52</p><p><b>52 crêpes</b> ont été vendues. <i>(1,5 point)</i></p>`},
{t:"Frères et sœurs", p:2.5, h:`<p>On a demandé à 22 élèves combien ils ont de frères et sœurs. Voici leurs réponses :</p><p>1, 0, 2, 1, 1, 3, 0, 2, 1, 2, 0, 1, 1, 2, 3, 1, 0, 2, 1, 0, 2, 1.</p>
  <p>Recopie et complète le tableau d'effectifs.</p>${TEFF()}`,
 c:`${TEFF([5,9,6,2,22])}<p>Vérification : 5 + 9 + 6 + 2 = 22, c'est bien le nombre d'élèves interrogés. <i>(0,5 point par effectif et 0,5 point pour le total)</i></p>`},
{t:"Le dessert de la cantine", p:3, h:`<p>Ce tableau indique le dessert choisi par les élèves de 6e et de 5e, un jour à la cantine.</p>${TDBL(D1)}
  <p>a) Complète les cinq cases vides du tableau.</p><p>b) Quel dessert les élèves de 5e ont-ils le plus choisi ?</p>`,
 c:`<p>a)</p>${TDBL(D1,S1)}
  <p>Gâteau en 6e : 35 − 12 − 9 = 14. Fruit en 5e : 20 − 12 = 8. Total des 5e : 8 + 11 + 16 = 35.</p><p>Total des yaourts : 9 + 11 = 20. Total général : 20 + 20 + 30 = 70 (ou 35 + 35 = 70). <i>(0,5 point par case)</i></p>
  <p>b) Ligne « 5e » : 8, 11 et 16. Les élèves de 5e ont le plus choisi le <b>gâteau</b> (16 élèves). <i>(0,5 point)</i></p>`}
]}
};
})()

};
function distinct4(){ for(;;){ const v=[2*ri(1,8),2*ri(1,8),2*ri(1,8),2*ri(1,8)]; const m=Math.max(...v); if(v.filter(x=>x===m).length===1) return v; } }
})();
