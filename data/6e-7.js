/* 6e — Chapitre 7 : Les durées (cours et fiche d'exercices de M. Staal) */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const co = (p,alt,w) => img("c67co/"+p+".png", alt, w);
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const BLUE="#1e5aa8", RED="#d0342c";
/* horaires et durées, en minutes */
const p2 = n => String(n).padStart(2,"0");
const H = m => `${Math.floor(m/60)} h ${p2(m%60)}`;
const DU = m => m<60 ? `${m} min` : `${Math.floor(m/60)} h${m%60?` ${p2(m%60)} min`:""}`;
/* frise : départ a, arrivée b (en minutes) ; inc = "a" | "b" | "d" : ce que l'on cherche */
function tl(a, b, inc){
  const W=420, x0=30, x1=380;
  const top = inc==="d" ? `<text x="${(x0+x1)/2}" y="22" text-anchor="middle" style="font-size:15px;font-weight:700;fill:${RED}">?</text>` : `<text x="${(x0+x1)/2}" y="22" text-anchor="middle" style="font-size:14px;font-weight:700;fill:${BLUE}">+ ${DU(b-a)}</text>`;
  return `<svg class="fig" viewBox="0 0 ${W} 112" width="${W}" role="img" aria-label="Frise du temps">${top}<path d="M${x0+4} 66 Q ${(x0+x1)/2} 8 ${x1-6} 64" style="fill:none;stroke:${inc==="d"?RED:BLUE};stroke-width:2"/><path d="M${x1-14} 58 L${x1-5} 65 L${x1-16} 67" style="fill:none;stroke:${inc==="d"?RED:BLUE};stroke-width:2"/>
   <line x1="10" y1="76" x2="${W-10}" y2="76" class="ln"/><path d="M${W-18} 70 L${W-8} 76 L${W-18} 82" class="ln"/><line x1="${x0}" y1="68" x2="${x0}" y2="84" class="ln"/><line x1="${x1}" y1="68" x2="${x1}" y2="84" class="ln"/>
   <text x="${x0}" y="102" text-anchor="middle" style="font-size:14px;font-weight:700;fill:${inc==="a"?RED:"var(--ink)"}">${inc==="a"?"?":H(a)}</text><text x="${x1}" y="102" text-anchor="middle" style="font-size:14px;font-weight:700;fill:${inc==="b"?RED:"var(--ink)"}">${inc==="b"?"?":H(b)}</text></svg>`;
}
window.FIG7 = {tl, H, DU, p2};

/* ===================== schémas ===================== */
const S_REL = sch("Les relations à connaître", `<div class="scroll"><table class="std"><tbody><tr><td>1 min = 60 s</td><td>1 h = 60 min</td><td>1 jour = 24 h</td><td>1 semaine = 7 jours</td></tr><tr><td>1 an = 12 mois</td><td>1 décennie = 10 ans</td><td>1 siècle = 100 ans</td><td>1 millénaire = 1 000 ans</td></tr></tbody></table></div>`);
const S_CONV = sch("Convertir", co("conv","heures → minutes → secondes : × 60 ; dans l'autre sens : ÷ 60",360)+`<p class="schN">Vers une unité plus petite, je multiplie par 60. Vers une unité plus grande, je divise par 60 : le quotient donne les unités plus grandes, le reste ce qui ne fait pas une unité complète.</p>`);
const S_DEC = sch("Une heure = 60 minutes, pas 100", `<p class="calc">0,5 h = 30 min &nbsp; 0,25 h = 15 min &nbsp; 1,5 h = 1 h 30 min (et non 1 h 50 min)</p><p class="schN">Les durées ne se comptent pas par dizaines. Une durée est bien écrite quand il y a moins de 60 minutes : 2 h 73 min = 3 h 13 min.</p>`);
const S_ARR = sch("Je cherche l'horaire d'arrivée", tl(20*60+50, 22*60+42, "b")+`<p class="schN">J'ajoute la durée. L'horaire d'arrivée H :</p><p class="calc">H = 20 h 50 min + 1 h 52 min<br>H = 21 h 102 min<br>H = 22 h 42 min</p>`);
const S_DEP = sch("Je cherche l'horaire de départ", tl(13*60+53, 15*60+8, "a")+`<p class="schN">Je retire la durée. L'horaire de départ H :</p><p class="calc">H = 15 h 08 min − 1 h 15 min<br>H = 14 h 68 min − 1 h 15 min<br>H = 13 h 53 min</p>`);
const S_DUR = sch("Je cherche la durée", tl(14*60+29, 15*60+41, "d")+`<p class="schN">Je retire l'horaire de départ à l'horaire d'arrivée : 15 h 41 min − 14 h 29 min = 1 h 12 min.</p>`);

CH["6e-7"] = {
intro:"Les unités de durée et leurs relations, convertir une durée, calculer un horaire d'arrivée, un horaire de départ ou une durée écoulée, et lire un tableau d'horaires.",
savoir:[
  "connaître les unités de durée et les relations entre elles ;",
  "convertir une durée d'une unité vers une autre ;",
  "calculer la durée écoulée entre deux instants ;",
  "calculer un horaire d'arrivée ou un horaire de départ ;",
  "lire un tableau d'horaires."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Les unités de durée", h:`
  <h4>1. Les relations à connaître par cœur</h4>
  <div class="retenir" data-l="À connaître par cœur"><div class="scroll"><table class="std"><thead><tr><th>Les petites durées</th><th>Les grandes durées</th></tr></thead><tbody>
   <tr><td>1 minute (min) = 60 secondes (s)</td><td>1 an = 12 mois</td></tr><tr><td>1 heure (h) = 60 min</td><td>1 décennie = 10 ans</td></tr><tr><td>1 jour = 24 h</td><td>1 siècle = 100 ans</td></tr><tr><td>1 semaine = 7 jours</td><td>1 millénaire = 1 000 ans</td></tr><tr><td>1 mois = 28, 29, 30 ou 31 jours</td><td></td></tr></tbody></table></div></div>
  ${co("conv","heures, minutes, secondes : × 60 dans un sens, ÷ 60 dans l'autre",360)}
  <h4>2. Attention : les durées ne comptent pas par dizaines</h4>
  <p class="attention"><b>ATTENTION :</b> une heure vaut 60 minutes, et non 100. On ne compte donc pas les durées comme les nombres décimaux.</p>
  <p class="calc">1,5 h = 1 h 30 min (et non 1 h 50 min) &nbsp;&nbsp; 0,25 h = 15 min &nbsp;&nbsp; 2,5 min = 2 min 30 s</p>
  <p><b>Remarque :</b> une durée est bien écrite lorsque le nombre de minutes est inférieur à 60 : on n'écrit pas 2 h 73 min, mais 3 h 13 min, car 73 min = 60 min + 13 min.</p>`},
{k:"II", t:"Convertir une durée", h:`
  <h4>1. Vers une unité plus petite : je multiplie</h4>
  <p>2 h 23 min en minutes :</p><p class="calc">t = 2 × 60 + 23<br>t = 120 + 23<br>t = 143 min</p><p>4 min 17 s en secondes :</p><p class="calc">t = 4 × 60 + 17<br>t = 240 + 17<br>t = 257 s</p>
  <h4>2. Vers une unité plus grande : je divise</h4>
  <div class="retenir" data-l="Méthode"><ol><li>Je divise par 60.</li><li>Le quotient donne le nombre d'unités plus grandes.</li><li>Le reste donne ce qui ne fait pas une unité complète.</li></ol></div>
  <p><b>Exemple :</b> convertir 200 s en minutes et secondes.</p><p class="calc">200 = 3 × 60 + 20, donc 200 s = 3 min 20 s.</p>
  <h4>3. Convertir en heures, minutes et secondes</h4>
  <p>On convertit deux fois de suite : d'abord les secondes en minutes, puis les minutes en heures.</p>
  <p class="calc">8 853 = 147 × 60 + 33, donc 8 853 s = 147 min 33 s.<br>147 = 2 × 60 + 27, donc 147 min = 2 h 27 min.<br>Finalement : 8 853 s = 2 h 27 min 33 s.</p>`},
{k:"III", t:"Calculer un horaire ou une durée", h:`
  <p>Dans tous les cas, <b>un schéma aide à voir ce que l'on cherche</b>.</p>
  <h4>1. Je cherche l'horaire d'arrivée</h4>
  <p><b>Problème :</b> le film commence à 20 h 50 et dure 1 h 52 min. À quelle heure se termine-t-il ?</p>
  ${co("arr","Frise : départ 20 h 50, + 1 h 52 min, arrivée ?",400)}
  <div class="retenir" data-l="Méthode"><p>On <b>ajoute</b> la durée à l'horaire de départ.</p></div>
  <p>L'horaire d'arrivée H :</p><p class="calc">H = 20 h 50 min + 1 h 52 min<br>H = 21 h 102 min<br>H = 22 h 42 min</p><p>car 102 min = 60 min + 42 min = 1 h 42 min.</p>
  <p>Le film se termine à <b>22 h 42</b>.</p>
  <h4>2. Je cherche l'horaire de départ</h4>
  <p><b>Problème :</b> après 1 h 15 min de trajet, Nathan arrive à 15 h 08. À quelle heure est-il parti ?</p>
  ${co("dep","Frise : départ ?, + 1 h 15 min, arrivée 15 h 08",400)}
  <div class="retenir" data-l="Méthode"><p>On <b>retire</b> la durée à l'horaire d'arrivée.</p></div>
  <p>On ne peut pas enlever 15 min à 08 min : on transforme une heure en 60 minutes.</p>
  <p class="calc">15 h 08 min = 14 h + 60 min + 8 min = 14 h 68 min</p><p>L'horaire de départ H :</p><p class="calc">H = 15 h 08 min − 1 h 15 min<br>H = 14 h 68 min − 1 h 15 min<br>H = 13 h 53 min</p>
  <p>Nathan est parti à <b>13 h 53</b>.</p>
  <h4>3. Je cherche la durée écoulée</h4>
  <p><b>Problème :</b> le match commence à 14 h 29 et se termine à 15 h 41. Combien de temps a-t-il duré ?</p>
  ${co("duree","Frise : de 14 h 29 à 15 h 41, durée ?",400)}
  <div class="retenir" data-l="Méthode"><p>On <b>retire l'horaire de départ</b> à l'horaire d'arrivée.</p></div>
  <p class="calc">15 h 41 min − 14 h 29 min = 1 h 12 min.</p><p>Le match a duré <b>1 h 12 min</b>.</p>
  <p class="attention"><b>ATTENTION :</b> si les minutes d'arrivée sont plus petites que celles du départ, on transforme d'abord une heure en 60 minutes. Exemple : 12 h 17 − 8 h 46 : on écrit 12 h 17 = 11 h 77, puis 11 h 77 − 8 h 46 = 3 h 31 min.</p>`},
{k:"IV", t:"Lire un tableau d'horaires", h:`
  <p>Un tableau d'horaires se lit <b>en colonnes</b> : chaque colonne correspond à un trajet.</p>
  <div class="scroll"><table class="std"><thead><tr><th></th><th>Train 1</th><th>Train 2</th><th>Train 3</th></tr></thead><tbody><tr><th>La Roche-sur-Yon</th><td>7 h 12</td><td>9 h 45</td><td>13 h 28</td></tr><tr><th>Les Sables d'Olonne</th><td>7 h 54</td><td>10 h 31</td><td>14 h 06</td></tr></tbody></table></div>
  <p><b>Exemple :</b> le train 2 part à 9 h 45 et arrive à 10 h 31. Sa durée de trajet est :</p>
  <p class="calc">10 h 31 min − 9 h 45 min : 10 h 31 = 9 h 91, puis 9 h 91 − 9 h 45 = 46 min.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Convertir des durées", e:[
  {n:"Activité 1", t:"Les relations à connaître", w:"Sur ta feuille", h:`<p>1) Complète le tableau des égalités à connaître par cœur.</p><div class="scroll"><table class="std"><thead><tr><th>Les petites durées</th><th>Les grandes durées</th></tr></thead><tbody><tr><td>1 minute (min) = …… secondes (s)</td><td>1 an = …… mois</td></tr><tr><td>1 heure (h) = …… min</td><td>1 décennie = …… ans</td></tr><tr><td>1 jour = …… h</td><td>1 siècle = …… ans</td></tr><tr><td>1 semaine = …… jours</td><td>1 millénaire = …… ans</td></tr><tr><td>1 mois = ……, ……, …… ou …… jours</td><td></td></tr></tbody></table></div><p>2) Convertis en expliquant ta démarche à chaque fois : a) 5 h en minutes · b) 2 h 42 min en minutes · c) 240 s en minutes · d) 368 s en min et s</p>`,
   c:`<p>1)</p><div class="scroll"><table class="std"><thead><tr><th>Les petites durées</th><th>Les grandes durées</th></tr></thead><tbody><tr><td>1 minute (min) = <b>60</b> secondes (s)</td><td>1 an = <b>12</b> mois</td></tr><tr><td>1 heure (h) = <b>60</b> min</td><td>1 décennie = <b>10</b> ans</td></tr><tr><td>1 jour = <b>24</b> h</td><td>1 siècle = <b>100</b> ans</td></tr><tr><td>1 semaine = <b>7</b> jours</td><td>1 millénaire = <b>1 000</b> ans</td></tr><tr><td>1 mois = <b>28</b>, <b>29</b>, <b>30</b> ou <b>31</b> jours</td><td></td></tr></tbody></table></div>
   <p>2) a) 1 h = 60 min, donc 5 h = 5 × 60 = <b>300 min</b>.</p><p>b) 2 h 42 min en minutes :</p><p class="calc">t = 2 × 60 + 42<br>t = 120 + 42<br>t = <b>162 min</b></p><p>c) 240 s = 240 ÷ 60 = <b>4 min</b>.</p><p>d) 368 = 6 × 60 + 8, donc 368 s = <b>6 min 8 s</b>.</p>`},
  {n:"Exercice 1", t:"Convertir en minutes", w:"Sur ta feuille", h:`<p>a) 3 h · b) 1 h 48 min · c) 7 h 12 min · d) 180 s · e) 4 h 05 min · f) 600 s</p>`,
   c:`<p>a) 3 × 60 = 180 min · b) 60 + 48 = 108 min</p><p>c) 7 h 12 min en minutes :</p><p class="calc">t = 7 × 60 + 12<br>t = 420 + 12<br>t = 432 min</p><p>d) 180 ÷ 60 = 3 min · e) 4 × 60 + 5 = 245 min · f) 600 ÷ 60 = 10 min</p>`},
  {n:"Exercice 2", t:"Convertir en secondes", w:"Sur ta feuille", h:`<p>a) 4 min · b) 6 min 37 s · c) 20 min · d) 1 h · e) 2 min 09 s · f) 1 h 10 min</p>`,
   c:`<p>a) 4 × 60 = 240 s</p><p>b) 6 min 37 s en secondes :</p><p class="calc">t = 6 × 60 + 37<br>t = 360 + 37<br>t = 397 s</p><p>c) 20 × 60 = 1 200 s · d) 1 h = 60 min = 60 × 60 = 3 600 s · e) 2 × 60 + 9 = 129 s · f) 1 h 10 min = 70 min = 70 × 60 = 4 200 s</p>`},
  {n:"Exercice 3", t:"Convertir en minutes et secondes", w:"Sur ta feuille", h:`<p>a) 138 s · b) 550 s · c) 245 s · d) 1 000 s</p>`,
   c:`a) 138 = 2 × 60 + 18 : 2 min 18 s · b) 550 = 9 × 60 + 10 : 9 min 10 s · c) 245 = 4 × 60 + 5 : 4 min 5 s · d) 1 000 = 16 × 60 + 40 : 16 min 40 s`},
  {n:"Exercice 4", t:"Convertir en heures, minutes et secondes", w:"Sur ta feuille", h:`<p>1) a) Convertis 8 853 s en minutes et secondes. b) Convertis le nombre de minutes trouvé en heures et minutes. c) Déduis-en la conversion de 8 853 s en heures, minutes et secondes.</p><p>2) De la même façon, convertis 32 790 s en heures, minutes et secondes.</p>`,
   c:`<p>1) a) 8 853 = 147 × 60 + 33, donc 8 853 s = <b>147 min 33 s</b>.</p><p>b) 147 = 2 × 60 + 27, donc 147 min = <b>2 h 27 min</b>.</p><p>c) 8 853 s = <b>2 h 27 min 33 s</b>.</p>
   <p>2) 32 790 = 546 × 60 + 30, donc 32 790 s = 546 min 30 s. Puis 546 = 9 × 60 + 6, donc 546 min = 9 h 6 min.</p><p>Finalement : 32 790 s = <b>9 h 06 min 30 s</b>.</p>`},
  {n:"Exercice 5", t:"Écrire correctement une durée", w:"Sur ta feuille", h:`<p>Une durée est bien écrite lorsque le nombre de minutes est inférieur à 60. Complète.</p><p>a) 2 h 73 min = 3 h …… min · b) 10 h 108 min = 11 h …… min · c) 1 h …… min = 2 h 41 min · d) 3 h …… min = 4 h 27 min · e) 5 h 95 min = …… h …… min · f) …… h …… min = 7 h 134 min</p>`,
   c:`a) 73 = 60 + 13 : 2 h 73 min = 3 h <b>13</b> min · b) 108 = 60 + 48 : 11 h <b>48</b> min · c) 1 h <b>101</b> min = 2 h 41 min (60 + 41 = 101) · d) 3 h <b>87</b> min = 4 h 27 min (60 + 27 = 87) · e) 95 = 60 + 35 : 5 h 95 min = <b>6 h 35 min</b> · f) 134 = 2 × 60 + 14 : <b>9 h 14 min</b> = 7 h 134 min`},
  {n:"Exercice 6", t:"Vrai ou faux ?", w:"Sur ta feuille", h:`<p>Réponds par vrai ou faux, puis corrige lorsque c'est faux.</p><p>a) 1 h 30 min, c'est la même durée que 1,30 h. · b) Une demi-heure dure 30 minutes. · c) 0,25 h, c'est 25 minutes. · d) 90 minutes, c'est 1 h 30 min.</p>`,
   c:`a) <b>Faux</b> : 1 h 30 min = 1,5 h (une demi-heure, c'est 0,5 h). · b) <b>Vrai</b> : la moitié de 60 min, c'est 30 min. · c) <b>Faux</b> : 0,25 h, c'est un quart d'heure, soit 60 ÷ 4 = 15 min. · d) <b>Vrai</b> : 90 min = 60 min + 30 min = 1 h 30 min.`}
 ]},
{t:"Calculer un horaire ou une durée", note:"<b>Rappel :</b> fais d'abord un schéma (une frise) pour voir ce que tu cherches.", e:[
  {n:"Activité 2", t:"Trouver l'horaire d'arrivée", w:"Sur ta feuille", h:`<p><b>Problème 1 :</b> Timéo prend l'avion à Paris à 14 h 48 pour se rendre à Berlin. Le trajet dure 2 h 07 min. À quelle heure arrive-t-il ?</p><p><b>Problème 2 :</b> Clotilde s'est connectée à internet à 12 h 38 et y est restée 1 h 43 min. À quelle heure s'est-elle déconnectée ?</p>`,
   c:`<p><b>Problème 1 :</b> on cherche l'horaire d'arrivée : on ajoute la durée.</p>${tl(14*60+48,16*60+55,"b")}<p class="calc">14 h 48 min + 2 h 07 min = 16 h 55 min</p><p>Timéo arrive à <b>16 h 55</b>.</p>
   <p><b>Problème 2 :</b></p>${tl(12*60+38,14*60+21,"b")}<p class="calc">H = 12 h 38 min + 1 h 43 min<br>H = 13 h 81 min<br>H = 14 h 21 min</p><p>car 81 min = 60 min + 21 min = 1 h 21 min.</p><p>Clotilde s'est déconnectée à <b>14 h 21</b>.</p>`},
  {n:"Activité 3", t:"Trouver l'horaire de départ ou la durée", w:"Sur ta feuille", h:`<p><b>Problème 1 :</b> Alexis a sorti son gâteau du four à 9 h 52, après une cuisson de 35 min. À quelle heure l'a-t-il mis au four ?</p><p><b>Problème 2 :</b> Léo et sa famille sont partis de chez eux à 8 h 46 et sont arrivés au camping à 12 h 17. Combien de temps a duré leur trajet ?</p>`,
   c:`<p><b>Problème 1 :</b> on cherche l'horaire de départ : on retire la durée.</p>${tl(9*60+17,9*60+52,"a")}<p class="calc">9 h 52 min − 35 min = 9 h 17 min</p><p>Alexis a mis le gâteau au four à <b>9 h 17</b>.</p>
   <p><b>Problème 2 :</b> on cherche une durée : on retire l'horaire de départ à l'horaire d'arrivée.</p>${tl(8*60+46,12*60+17,"d")}<p class="calc">t = 12 h 17 min − 8 h 46 min<br>t = 11 h 77 min − 8 h 46 min<br>t = 3 h 31 min</p><p>Le trajet a duré <b>3 h 31 min</b>.</p>`},
  {n:"Exercice 7", t:"Compléter un tableau", w:"Sur ta feuille", h:`<p>Dans chaque ligne, il manque une information. Complète le tableau.</p><div class="scroll"><table class="std"><thead><tr><th>Horaire de départ</th><th>Durée</th><th>Horaire d'arrivée</th></tr></thead><tbody>
    <tr><td>8 h 15</td><td>2 h 30 min</td><td>……</td></tr><tr><td>14 h 35</td><td>2 h 50 min</td><td>……</td></tr><tr><td>9 h 20</td><td>3 h 55 min</td><td>……</td></tr><tr><td>……</td><td>1 h 25 min</td><td>11 h 10</td></tr><tr><td>……</td><td>2 h 40 min</td><td>16 h 05</td></tr><tr><td>7 h 35</td><td>……</td><td>9 h 50</td></tr><tr><td>13 h 42</td><td>……</td><td>15 h 18</td></tr><tr><td>10 h 05</td><td>50 min</td><td>……</td></tr></tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Départ</th><th>Durée</th><th>Arrivée</th><th>Calcul</th></tr></thead><tbody>
    <tr><td>8 h 15</td><td>2 h 30 min</td><td><b>10 h 45</b></td><td>8 h 15 + 2 h 30 = 10 h 45</td></tr>
    <tr><td>14 h 35</td><td>2 h 50 min</td><td><b>17 h 25</b></td><td>H = 14 h 35 + 2 h 50<br>H = 16 h 85<br>H = 17 h 25</td></tr>
    <tr><td>9 h 20</td><td>3 h 55 min</td><td><b>13 h 15</b></td><td>H = 9 h 20 + 3 h 55<br>H = 12 h 75<br>H = 13 h 15</td></tr>
    <tr><td><b>9 h 45</b></td><td>1 h 25 min</td><td>11 h 10</td><td>H = 11 h 10 − 1 h 25<br>H = 10 h 70 − 1 h 25<br>H = 9 h 45</td></tr>
    <tr><td><b>13 h 25</b></td><td>2 h 40 min</td><td>16 h 05</td><td>H = 16 h 05 − 2 h 40<br>H = 15 h 65 − 2 h 40<br>H = 13 h 25</td></tr>
    <tr><td>7 h 35</td><td><b>2 h 15 min</b></td><td>9 h 50</td><td>9 h 50 − 7 h 35 = 2 h 15</td></tr>
    <tr><td>13 h 42</td><td><b>1 h 36 min</b></td><td>15 h 18</td><td>t = 15 h 18 − 13 h 42<br>t = 14 h 78 − 13 h 42<br>t = 1 h 36</td></tr>
    <tr><td>10 h 05</td><td>50 min</td><td><b>10 h 55</b></td><td>10 h 05 + 50 min = 10 h 55</td></tr></tbody></table></div>`},
  {n:"Exercice 8", t:"Des problèmes à résoudre", w:"Sur ta feuille", h:`<p>1) Sohan et sa famille sont partis de leur domicile à 8 h 50 ; le trajet jusqu'à la montagne a duré 6 h 25. À quelle heure sont-ils arrivés ?</p><p>2) Un randonneur part à 9 h 25 et rentre à 11 h 48. Pendant combien de temps a-t-il marché ?</p><p>3) J'ai rendez-vous à 17 h 15. Mon GPS indique 1 h 34 min de trajet. À quelle heure dois-je partir pour arriver pile à l'heure ?</p><p>4) Après le conseil de classe, le professeur principal reçoit ses 26 élèves et leurs parents. Il compte 10 min par rendez-vous et commence à 17 h. S'il respecte son timing, à quelle heure aura-t-il terminé ?</p>`,
   c:`<p>1) L'horaire d'arrivée H :</p><p class="calc">H = 8 h 50 min + 6 h 25 min<br>H = 14 h 75 min<br>H = 15 h 15 min</p><p>Ils sont arrivés à <b>15 h 15</b>.</p>
   <p>2) 11 h 48 min − 9 h 25 min = 2 h 23 min. Il a marché <b>2 h 23 min</b>.</p>
   <p>3) L'horaire de départ H :</p><p class="calc">H = 17 h 15 min − 1 h 34 min<br>H = 16 h 75 min − 1 h 34 min<br>H = 15 h 41 min</p><p>Je dois partir à <b>15 h 41</b>.</p>
   <p>4) 26 × 10 = 260 min, et 260 = 4 × 60 + 20, donc 260 min = 4 h 20 min. 17 h + 4 h 20 min = 21 h 20 min. Il aura terminé à <b>21 h 20</b>.</p>`}
 ]},
{t:"Lire un tableau d'horaires", e:[
  {n:"Exercice 9", t:"Les trains", w:"Sur ta feuille", h:`<p>Voici les horaires de trois trains au départ de Nantes.</p><div class="scroll"><table class="std"><thead><tr><th>Gare</th><th>Train A</th><th>Train B</th><th>Train C</th></tr></thead><tbody><tr><th>Nantes</th><td>7 h 02</td><td>9 h 18</td><td>13 h 44</td></tr><tr><th>La Roche-sur-Yon</th><td>7 h 55</td><td>10 h 12</td><td>14 h 39</td></tr><tr><th>Les Sables d'Olonne</th><td>8 h 21</td><td>10 h 38</td><td>15 h 05</td></tr></tbody></table></div>
   <p>1) Combien de temps dure le trajet Nantes — Les Sables d'Olonne avec le train A ?</p><p>2) Combien de temps dure le trajet Nantes — La Roche-sur-Yon avec le train B ?</p><p>3) Je dois être aux Sables d'Olonne avant 15 h. Quels trains puis-je prendre ?</p><p>4) Le train C arrive aux Sables avec 12 min de retard. À quelle heure arrive-t-il ?</p><p>5) Quel est le train le plus rapide entre Nantes et Les Sables d'Olonne ? Justifie.</p>`,
   c:`<p>1) 8 h 21 min − 7 h 02 min = <b>1 h 19 min</b>.</p><p>2) La durée t du trajet :</p><p class="calc">t = 10 h 12 − 9 h 18<br>t = 9 h 72 − 9 h 18<br>t = <b>54 min</b></p><p>3) Le train A (arrivée 8 h 21) et le train B (arrivée 10 h 38). Le train C arrive à 15 h 05 : trop tard.</p><p>4) 15 h 05 + 12 min = <b>15 h 17</b>.</p>
   <p>5) Train A : 1 h 19 min · Train B : 10 h 38 − 9 h 18 = 1 h 20 min</p><p>Train C :</p><p class="calc">t = 15 h 05 − 13 h 44<br>t = 14 h 65 − 13 h 44<br>t = 1 h 21 min</p><p>Le plus rapide est le <b>train A</b> (1 h 19 min).</p>`},
  {n:"Exercice 10", t:"La soirée télé", w:"Sur ta feuille", h:`<p>Complète le programme de la soirée.</p><div class="scroll"><table class="std"><thead><tr><th>Émission</th><th>Début</th><th>Durée</th><th>Fin</th></tr></thead><tbody><tr><td>Le journal</td><td>20 h 00</td><td>35 min</td><td>……</td></tr><tr><td>Le film</td><td>20 h 45</td><td>1 h 58 min</td><td>……</td></tr><tr><td>Le débat</td><td>……</td><td>50 min</td><td>23 h 40</td></tr></tbody></table></div><p>1) Combien de temps s'écoule entre la fin du journal et le début du film ?</p><p>2) Combien de temps s'écoule entre la fin du film et le début du débat ?</p><p>3) Quelle est la durée totale de la soirée, du début du journal à la fin du débat ?</p>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Émission</th><th>Début</th><th>Durée</th><th>Fin</th></tr></thead><tbody><tr><td>Le journal</td><td>20 h 00</td><td>35 min</td><td><b>20 h 35</b></td></tr><tr><td>Le film</td><td>20 h 45</td><td>1 h 58 min</td><td><b>22 h 43</b></td></tr><tr><td>Le débat</td><td><b>22 h 50</b></td><td>50 min</td><td>23 h 40</td></tr></tbody></table></div>
   <p>Journal : 20 h 00 + 35 min = 20 h 35.</p><p>Fin du film :</p><p class="calc">H = 20 h 45 + 1 h 58<br>H = 21 h 103<br>H = 22 h 43</p><p>Début du débat :</p><p class="calc">H = 23 h 40 − 50 min<br>H = 22 h 100 − 50 min<br>H = 22 h 50</p>
   <p>1) 20 h 45 − 20 h 35 = <b>10 min</b>.</p><p>2) 22 h 50 − 22 h 43 = <b>7 min</b>.</p><p>3) 23 h 40 − 20 h 00 = <b>3 h 40 min</b>.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Les unités de durée", schema:S_REL, q:{
 1:[ {q:"1 heure = … minutes", rep:"60", sx:S_REL}, {q:"1 jour = … heures", rep:"24", sx:S_REL}, {q:"1 minute = … secondes", rep:"60", sx:S_REL} ],
 2:[ {q:"1 siècle = … ans", rep:"100", sx:S_REL}, {q:"1 décennie = … ans", rep:"10", sx:S_REL}, {q:"1 semaine = … jours", rep:"7", sx:S_REL} ],
 3:[ {q:"1 millénaire = … ans", rep:"1 000", sx:S_REL}, {q:"Combien de jours peut compter un mois ?", c:["28, 29, 30 ou 31","30 seulement","31 seulement"], rep:"28, 29, 30 ou 31", sx:S_REL} ]
}},
{nom:"Convertir vers une unité plus petite", schema:S_CONV, q:{
 1:[ {g:()=>{ const h=ri(2,9); return {q:`Convertis ${h} h en minutes.`, rep:String(60*h), ex:`${h} × 60 = ${60*h} min.`, sx:S_CONV}; }},
     {g:()=>{ const m=ri(2,9); return {q:`Convertis ${m} min en secondes.`, rep:String(60*m), ex:`${m} × 60 = ${60*m} s.`, sx:S_CONV}; }} ],
 2:[ {g:()=>{ const h=ri(1,5), m=ri(5,55); return {q:`Convertis ${h} h ${p2(m)} min en minutes.`, rep:String(60*h+m), ex:`En minutes :<br>t = ${h} × 60 + ${m}<br>t = ${60*h} + ${m}<br>t = ${60*h+m} min`, sx:S_CONV}; }},
     {g:()=>{ const m=ri(2,9), s=ri(5,55); return {q:`Convertis ${m} min ${p2(s)} s en secondes.`, rep:String(60*m+s), ex:`${m} × 60 + ${s} = ${60*m+s} s.`, sx:S_CONV}; }} ],
 3:[ {q:"Combien de secondes y a-t-il dans 1 heure ?", rep:"3 600", ex:"1 h = 60 min = 60 × 60 s = 3 600 s.", sx:S_CONV},
     {g:()=>{ const m=ri(5,20); return {q:`Convertis 1 h ${m} min en secondes.`, rep:String((60+m)*60).replace(/\B(?=(\d{3})+(?!\d))/g," "), ex:`1 h ${m} min = ${60+m} min = ${60+m} × 60 = ${String((60+m)*60).replace(/\B(?=(\d{3})+(?!\d))/g," ")} s.`, sx:S_CONV}; }} ]
}},
{nom:"Convertir vers une unité plus grande", schema:S_CONV, q:{
 1:[ {g:()=>{ const m=ri(2,12); return {q:`Convertis ${60*m} s en minutes.`, rep:String(m), ex:`${60*m} ÷ 60 = ${m} min.`, sx:S_CONV}; }} ],
 2:[ {g:()=>{ const m=ri(2,15), s=ri(1,59); return {q:`Convertis ${60*m+s} s en minutes et secondes.`, t:`□ min □ s`, r:[String(m),String(s)], ex:`${60*m+s} = ${m} × 60 + ${s}.`, sx:S_CONV}; }},
     {g:()=>{ const h=ri(1,5), m=ri(1,59); return {q:`Convertis ${60*h+m} min en heures et minutes.`, t:`□ h □ min`, r:[String(h),[String(m),p2(m)]], ex:`${60*h+m} = ${h} × 60 + ${m}.`, sx:S_CONV}; }} ],
 3:[ {g:()=>{ const h=ri(1,3), m=ri(1,59), s=ri(1,59), t=3600*h+60*m+s; return {q:`Convertis ${String(t).replace(/\B(?=(\d{3})+(?!\d))/g," ")} s en heures, minutes et secondes.`, t:`□ h □ min □ s`, r:[String(h),[String(m),p2(m)],[String(s),p2(s)]], ex:`${String(t).replace(/\B(?=(\d{3})+(?!\d))/g," ")} = ${60*h+m} × 60 + ${s}, puis ${60*h+m} min = ${h} h ${m} min.`, sx:S_CONV}; }} ]
}},
{nom:"Durées et nombres décimaux", schema:S_DEC, q:{
 1:[ {q:"Une demi-heure, c'est…", c:["30 min","50 min","20 min"], rep:"30 min", sx:S_DEC},
     {q:"1,5 h, c'est…", c:["1 h 30 min","1 h 50 min","1 h 05 min"], rep:"1 h 30 min", ex:"0,5 h = la moitié d'une heure = 30 min.", sx:S_DEC} ],
 2:[ {q:"0,25 h, c'est…", c:["15 min","25 min","2 min 30 s"], rep:"15 min", ex:"Un quart d'heure : 60 ÷ 4 = 15 min.", sx:S_DEC},
     {g:()=>{ const h=ri(1,5), m=ri(61,119); return {q:`Écris correctement : ${h} h ${m} min`, t:`□ h □ min`, r:[String(h+1),[String(m-60),p2(m-60)]], ex:`${m} min = 60 min + ${m-60} min.`, sx:S_DEC}; }} ],
 3:[ {q:"2,5 min, c'est…", c:["2 min 30 s","2 min 50 s","2 min 05 s"], rep:"2 min 30 s", sx:S_DEC},
     {q:"Vrai ou faux : 1 h 30 min = 1,30 h.", c:VF, rep:"Faux", ex:"1 h 30 min = 1,5 h. Et 1,30 h = 1 h 18 min !", sx:S_DEC} ]
}},
{nom:"Horaire d'arrivée", schema:S_ARR, q:{
 1:[ {g:()=>{ const a=ri(7,18)*60+ri(0,4)*5, d=ri(1,3)*60+ri(1,5)*5; const b=a+d; if((a%60)+(d%60)>=60) return {q:`Départ à ${H(a)}, durée ${DU(d)}. À quelle heure arrive-t-on ?`, t:"□ h □", r:[String(Math.floor(b/60)),p2(b%60)], ex:`${H(a)} + ${DU(d)} = ${H(b)}.`, sx:S_ARR};
       return {q:`Départ à ${H(a)}, durée ${DU(d)}. À quelle heure arrive-t-on ?`, t:"□ h □", r:[String(Math.floor(b/60)),[p2(b%60),String(b%60)]], ex:`${H(a)} + ${DU(d)} = ${H(b)}.`, sx:S_ARR}; }} ],
 2:[ {g:()=>{ let a,d; do{ a=ri(8,18)*60+ri(30,55); d=ri(1,3)*60+ri(20,55); }while((a%60)+(d%60)<60); const b=a+d; return {q:`Un film commence à ${H(a)} et dure ${DU(d)}. À quelle heure se termine-t-il ?`, t:"□ h □", r:[String(Math.floor(b/60)),[p2(b%60),String(b%60)]], ex:`L'horaire de fin H :<br>H = ${Math.floor(a/60)} h ${a%60} min + ${DU(d)}<br>H = ${Math.floor(a/60)+Math.floor(d/60)} h ${(a%60)+(d%60)} min<br>H = ${H(b)}`, sx:S_ARR}; }} ],
 3:[ {g:()=>{ const n=ri(12,30), k=pick([5,10,15]), a=pick([14,16,17])*60; const b=a+n*k; return {q:`${n} rendez-vous de ${k} min chacun, à la suite, à partir de ${H(a)}. À quelle heure est-ce terminé ?`, t:"□ h □", r:[String(Math.floor(b/60)),[p2(b%60),String(b%60)]], ex:`${n} × ${k} = ${n*k} min = ${DU(n*k)}, et ${H(a)} + ${DU(n*k)} = ${H(b)}.`, sx:S_ARR}; }} ]
}},
{nom:"Horaire de départ", schema:S_DEP, q:{
 1:[ {g:()=>{ const b=ri(9,20)*60+ri(30,55), d=ri(10,25); const a=b-d; return {q:`On arrive à ${H(b)} après ${d} min de trajet. À quelle heure est-on parti ?`, t:"□ h □", r:[String(Math.floor(a/60)),[p2(a%60),String(a%60)]], ex:`${H(b)} − ${d} min = ${H(a)}.`, sx:S_DEP}; }} ],
 2:[ {g:()=>{ let b,d; do{ b=ri(9,20)*60+ri(0,25); d=ri(1,2)*60+ri(30,55); }while(b%60>=d%60); const a=b-d; return {q:`Après ${DU(d)} de trajet, on arrive à ${H(b)}. À quelle heure est-on parti ?`, t:"□ h □", r:[String(Math.floor(a/60)),[p2(a%60),String(a%60)]], ex:`${H(b)} = ${Math.floor(b/60)-1} h ${60+b%60} min, puis − ${DU(d)} = ${H(a)}.`, sx:S_DEP}; }} ],
 3:[ {g:()=>{ let b,d; do{ b=ri(15,19)*60+ri(0,20); d=ri(1,2)*60+ri(25,55); }while(b%60>=d%60); const a=b-d; return {q:`J'ai rendez-vous à ${H(b)}. Mon GPS indique ${DU(d)} de trajet. À quelle heure dois-je partir ?`, t:"□ h □", r:[String(Math.floor(a/60)),[p2(a%60),String(a%60)]], ex:`${H(b)} = ${Math.floor(b/60)-1} h ${60+b%60} min ; − ${DU(d)} = ${H(a)}.`, sx:S_DEP}; }} ]
}},
{nom:"Calculer une durée", schema:S_DUR, q:{
 1:[ {g:()=>{ const a=ri(8,16)*60+ri(0,25), d=ri(1,3)*60+ri(5,30); const b=a+d; return {q:`De ${H(a)} à ${H(b)}, combien de temps s'est-il écoulé ?`, t:"□ h □ min", r:[String(Math.floor(d/60)),[String(d%60),p2(d%60)]], ex:`${H(b)} − ${H(a)} = ${DU(d)}.`, sx:S_DUR}; }} ],
 2:[ {g:()=>{ let a,b; do{ a=ri(8,16)*60+ri(30,55); b=a+ri(1,3)*60+ri(10,50); }while(b%60>=a%60); const d=b-a; return {q:`Le trajet part à ${H(a)} et arrive à ${H(b)}. Combien de temps dure-t-il ?`, t:"□ h □ min", r:[String(Math.floor(d/60)),[String(d%60),p2(d%60)]], ex:`${H(b)} = ${Math.floor(b/60)-1} h ${60+b%60}, puis − ${H(a)} = ${DU(d)}.`, sx:S_DUR}; }} ],
 3:[ {g:()=>{ let a,b; do{ a=ri(8,16)*60+ri(30,55); b=a+ri(20,55); }while(b%60>=a%60); const d=b-a; return {q:`Le train part à ${H(a)} et arrive à ${H(b)}. Combien de minutes dure le trajet ?`, rep:String(d), ex:`${H(b)} = ${Math.floor(b/60)-1} h ${60+b%60}, puis − ${H(a)} = ${d} min.`, sx:S_DUR}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
const TAB = `<div class="scroll"><table class="std"><thead><tr><th>Arrêt</th><th>Départ n° 1</th><th>Départ n° 2</th><th>Départ n° 3</th></tr></thead><tbody>
  <tr><th>Port</th><td>10 h 15</td><td>13 h 40</td><td>15 h 55</td></tr>
  <tr><th>Plage des Dunes</th><td>10 h 32</td><td>13 h 57</td><td>16 h 12</td></tr>
  <tr><th>Phare</th><td>10 h 51</td><td>14 h 16</td><td>16 h 31</td></tr>
  <tr><th>Village</th><td>11 h 08</td><td>14 h 33</td><td>16 h 48</td></tr></tbody></table></div>`;
const MEM = t => `<div class="retenir" data-l="Je me souviens">${t}</div>`;
const AIDE = t => `<p><i><b>Aide :</b> ${t}</i></p>`;
const COMP = [
  ["CALCULER","Je convertis une durée dans une autre unité.","Ex. 1 (3 points)"],
  ["COMMUNIQUER","Je lis un tableau d'horaires et je m'en sers pour répondre.","Ex. 2 (3 points)"],
  ["MODÉLISER","Je calcule une durée écoulée ou un horaire d'arrivée.","Ex. 3 (4 points)"]
];
return {
titre:"Évaluation d'entraînement — Chapitre 7", duree:25, info:"Durée : 25 min · Calculatrice non autorisée",
comp:COMP,
exos:[
{t:"Changer d'unité", p:3, h:`<p>Complète.</p><p>a) 5 min = …… s · b) 3 h 38 min = …… min · c) 500 min = …… h …… min · d) 2 jours 5 h = …… h · e) 2,5 h = …… h …… min · f) 425 s = …… min …… s</p>`,
 c:`<p>a) 1 min = 60 s, donc 5 min = 5 × 60 = <b>300 s</b>.</p>
  <p>b) 3 h 38 min en minutes :</p><p class="calc">t = 3 × 60 + 38<br>t = 180 + 38<br>t = <b>218 min</b></p>
  <p>c) 500 = 8 × 60 + 20, donc 500 min = <b>8 h 20 min</b>.</p>
  <p>d) 2 jours 5 h en heures :</p><p class="calc">t = 2 × 24 + 5<br>t = 48 + 5<br>t = <b>53 h</b></p>
  <p>e) 0,5 h, c'est une demi-heure, soit 30 min. Donc 2,5 h = <b>2 h 30 min</b> (et non 2 h 50 min).</p>
  <p>f) 425 = 7 × 60 + 5, donc 425 s = <b>7 min 5 s</b>.</p>
  <p><i>0,5 point par conversion.</i></p>`},
{t:"Le petit train touristique", p:3, h:`<p>Un petit train fait le tour d'une station balnéaire. Voici ses horaires de la journée.</p>${TAB}
  <p>a) Avec le départ n° 1, combien de temps dure le tour complet, du Port au Village ?</p>
  <p>b) Lucas monte à la Plage des Dunes dans le train de 13 h 57. Il descend au Village. Combien de temps reste-t-il dans le train ?</p>
  <p>c) Nina arrive au Port à 12 h 50. Elle prend le premier petit train qui part. Combien de temps attend-elle ?</p>`,
 c:`<p>a) Le départ n° 1 part du Port à 10 h 15 et arrive au Village à 11 h 08.</p><p class="calc">t = 11 h 08 min − 10 h 15 min<br>t = 10 h 68 min − 10 h 15 min<br>t = 53 min</p><p>Le tour complet dure <b>53 min</b>. <i>(1 point)</i></p>
  <p>b) Le train de 13 h 57 est le départ n° 2 : il arrive au Village à 14 h 33.</p><p class="calc">t = 14 h 33 min − 13 h 57 min<br>t = 13 h 93 min − 13 h 57 min<br>t = 36 min</p><p>Lucas reste <b>36 min</b> dans le train. <i>(1 point)</i></p>
  <p>c) Le premier train qui part du Port après 12 h 50 est le départ n° 2, à 13 h 40.</p><p class="calc">t = 13 h 40 min − 12 h 50 min<br>t = 12 h 100 min − 12 h 50 min<br>t = 50 min</p><p>Nina attend <b>50 min</b>. <i>(1 point)</i></p>`},
{t:"Deux problèmes", p:4, h:`<p><b>Problème 1 :</b> Hugo commence une randonnée à 9 h 52. Il revient à son point de départ à 15 h 17. Combien de temps a duré sa randonnée ?</p>
  <p><b>Problème 2 :</b> le concert de Maëlys commence à 19 h 35. Il dure 2 h 48 min. À quelle heure se termine-t-il ?</p>`,
 c:`<p><b>Problème 1 :</b> on cherche une durée. On retire l'horaire de départ à l'horaire d'arrivée.</p>${tl(9*60+52, 15*60+17, "d")}
  <p class="calc">t = 15 h 17 min − 9 h 52 min<br>t = 14 h 77 min − 9 h 52 min<br>t = 5 h 25 min</p><p>La randonnée a duré <b>5 h 25 min</b>.</p>
  <p><b>Problème 2 :</b> on cherche l'horaire d'arrivée. On ajoute la durée à l'horaire de départ.</p>${tl(19*60+35, 22*60+23, "b")}
  <p class="calc">H = 19 h 35 min + 2 h 48 min<br>H = 21 h 83 min<br>H = 22 h 23 min</p><p>car 83 min = 60 min + 23 min = 1 h 23 min.</p><p>Le concert se termine à <b>22 h 23</b>.</p>
  <p><i>2 points par problème : 1 point pour la démarche (le bon calcul), 1 point pour le résultat juste avec l'unité et une phrase.</i></p>`}
],
bep:{
titre:"Évaluation d'entraînement — Chapitre 7 · version aménagée", duree:25, info:"Version aménagée (tiers-temps) · Durée : 25 min · Calculatrice non autorisée",
note:"Le même sujet avec 3 questions en moins, à faire dans le même temps. Le total reste sur 10 points.",
comp:COMP,
exos:[
{t:"Changer d'unité", p:3, h:`<p>Complète.</p><p>a) 5 min = …… s · b) 3 h 38 min = …… min · c) 500 min = …… h …… min · d) 2,5 h = …… h …… min</p>`,
 c:`<p>a) 1 min = 60 s, donc 5 min = 5 × 60 = <b>300 s</b>. <i>(0,5 point)</i></p>
  <p>b) 3 h 38 min en minutes : <i>(0,5 point)</i></p><p class="calc">t = 3 × 60 + 38<br>t = 180 + 38<br>t = <b>218 min</b></p>
  <p>c) 500 = 8 × 60 + 20, donc 500 min = <b>8 h 20 min</b>. <i>(1 point)</i></p>
  <p>d) 0,5 h, c'est une demi-heure, soit 30 min. Donc 2,5 h = <b>2 h 30 min</b> (et non 2 h 50 min). <i>(1 point)</i></p>`},
{t:"Le petit train touristique", p:3, h:`<p>Un petit train fait le tour d'une station balnéaire. Voici ses horaires de la journée.</p>${TAB}
  <p>a) Avec le départ n° 1, combien de temps dure le tour complet, du Port au Village ?</p>
  <p>b) Nina arrive au Port à 12 h 50. Elle prend le premier petit train qui part. Combien de temps attend-elle ?</p>`,
 c:`<p>a) Le départ n° 1 part du Port à 10 h 15 et arrive au Village à 11 h 08.</p><p class="calc">t = 11 h 08 min − 10 h 15 min<br>t = 10 h 68 min − 10 h 15 min<br>t = 53 min</p><p>Le tour complet dure <b>53 min</b>. <i>(1,5 point)</i></p>
  <p>b) Le premier train qui part du Port après 12 h 50 est le départ n° 2, à 13 h 40.</p><p class="calc">t = 13 h 40 min − 12 h 50 min<br>t = 12 h 100 min − 12 h 50 min<br>t = 50 min</p><p>Nina attend <b>50 min</b>. <i>(1,5 point)</i></p>`},
{t:"Deux problèmes", p:4, h:`<p><b>Problème 1 :</b> Hugo commence une randonnée à 9 h 52. Il revient à son point de départ à 15 h 17. Combien de temps a duré sa randonnée ?</p>
  <p><b>Problème 2 :</b> le concert de Maëlys commence à 19 h 35. Il dure 2 h 48 min. À quelle heure se termine-t-il ?</p>`,
 c:`<p><b>Problème 1 :</b> on cherche une durée. On retire l'horaire de départ à l'horaire d'arrivée.</p>${tl(9*60+52, 15*60+17, "d")}
  <p class="calc">t = 15 h 17 min − 9 h 52 min<br>t = 14 h 77 min − 9 h 52 min<br>t = 5 h 25 min</p><p>La randonnée a duré <b>5 h 25 min</b>.</p>
  <p><b>Problème 2 :</b> on cherche l'horaire d'arrivée. On ajoute la durée à l'horaire de départ.</p>${tl(19*60+35, 22*60+23, "b")}
  <p class="calc">H = 19 h 35 min + 2 h 48 min<br>H = 21 h 83 min<br>H = 22 h 23 min</p><p>car 83 min = 60 min + 23 min = 1 h 23 min.</p><p>Le concert se termine à <b>22 h 23</b>.</p>
  <p><i>2 points par problème : 1 point pour la démarche (le bon calcul), 1 point pour le résultat juste avec l'unité et une phrase.</i></p>`}
]}
};
})()
};
})();
