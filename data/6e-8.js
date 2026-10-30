/* 6e — Chapitre 8 : Opérations avec les nombres décimaux (cours et fiche d'exercices de M. Staal)
   Les calculs des questions générées se font sur des entiers (pas d'erreur d'arrondi). */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g," ");
/* n entier, k chiffres après la virgule → écriture sans zéro inutile */
const D = (n,k) => { if(!k) return sp(n); const s=String(n).padStart(k+1,"0"); let e=s.slice(0,-k), d=s.slice(-k).replace(/0+$/,""); return sp(+e)+(d?","+d:""); };
const co = (p,alt,w) => img("c68co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("c68ex/"+p+".png", alt, w);
/* opération posée (addition ou soustraction) : virgules alignées, une colonne par chiffre */
function pose(rows, sym, res){
  const all=[...rows,res], L=t=>t.includes(",")?t.indexOf(","):t.length, R=t=>t.includes(",")?t.length-t.indexOf(",")-1:0;
  const mL=Math.max(...all.map(L)), mR=Math.max(...all.map(R)), cw=13, W=24+(mL+mR+1)*cw+8, H=all.length*26+12;
  let g=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${rows.join(" "+sym+" ")} = ${res}">`;
  all.forEach((t,i)=>{ const y=24+i*26+(i===all.length-1?6:0), x0=24+(mL-L(t))*cw;
    [...t].forEach((ch,j)=>{ g+=`<text x="${x0+j*cw+cw/2}" y="${y}" text-anchor="middle" style="font-size:17px;${i===all.length-1?"font-weight:700;":""}fill:var(--ink)">${ch}</text>`; }); });
  g+=`<text x="10" y="${24+(rows.length-1)*26}" text-anchor="middle" style="font-size:17px;fill:var(--ink)">${sym}</text><line x1="4" y1="${24+(rows.length-1)*26+8}" x2="${W-4}" y2="${24+(rows.length-1)*26+8}" style="stroke:var(--ink);stroke-width:1.6"/>`;
  return g+"</svg>";
}
window.FIG8 = {pose};
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;

/* ===================== schémas ===================== */
const S_VOC = sch("Somme, différence, produit", `<p class="calc">12 + 3 = 15 : la <b>somme</b> de 12 et 3 (12 et 3 sont les <b>termes</b>)<br>15 − 3 = 12 : la <b>différence</b> de 15 et 3<br>4 × 2,5 = 10 : le <b>produit</b> de 4 par 2,5 (4 et 2,5 sont les <b>facteurs</b>)</p>`);
const S_POSE = sch("Poser une addition ou une soustraction", `<div class="figs">${co("add","18,57 + 14,90 = 33,47",150)}${co("sous","45,30 − 33,47 = 11,83",150)}</div><p class="schN">J'aligne les virgules, je complète par des zéros, puis je calcule comme avec des entiers.</p>`);
const S_GD = sch("De gauche à droite", `<p class="calc">A = 20 − 9 − 5<br>A = 11 − 5<br>A = 6 &nbsp; (et non 20 − 4 = 16)</p><p class="schN">Avec des soustractions, on calcule de gauche à droite. Avec seulement des additions, on peut regrouper comme on veut.</p>`);
const S_10 = sch("× 10, × 100, × 1 000", `<p class="calc">3,45 × 10 = 34,5 &nbsp; 3,45 × 100 = 345 &nbsp; 3,45 × 1 000 = 3 450</p><p class="schN">La virgule se déplace de 1, 2 ou 3 rangs vers la <b>droite</b> (autant que de zéros). On complète par des zéros si besoin.</p>`);
const S_01 = sch("× 0,1, × 0,01, × 0,001", `<p class="calc">275 × 0,1 = 27,5 &nbsp; 275 × 0,01 = 2,75 &nbsp; 275 × 0,001 = 0,275</p><p class="schN">La virgule se déplace de 1, 2 ou 3 rangs vers la <b>gauche</b> : le nombre devient plus petit.</p>`);
const S_MUL = sch("Multiplier deux décimaux", co("mult","4,25 × 3,6 posé : 15,300",160)+`<p class="schN">Je multiplie sans les virgules, puis je compte les chiffres après la virgule dans les deux facteurs : 2 + 1 = 3 chiffres. 4,25 × 3,6 = 15,300 = 15,3.</p>`);
const S_OG = sch("L'ordre de grandeur", `<p class="calc">4,25 × 3,6 ≈ 4 × 4 = 16 : le résultat 15,3 est cohérent.<br>18,57 + 14,9 ≈ 19 + 15 = 34 : le résultat 33,47 est cohérent.</p><p class="schN">Je remplace chaque nombre par une valeur proche et simple. Cela permet de repérer une erreur de virgule.</p>`);
const S_TAB = sch("Une formule de tableur", co("tableur","Formule =B2*C2 dans la cellule D2",330)+`<p class="schN">Une formule commence par =. On utilise les adresses des cellules (B2, C2…) et * pour multiplier.</p>`);

CH["6e-8"] = {
intro:"Le vocabulaire des opérations, poser une addition, une soustraction et une multiplication de décimaux, multiplier par 10, 100, 1 000 et par 0,1 ; 0,01 ; 0,001, l'ordre de grandeur, les problèmes et le tableur.",
savoir:[
  "connaître le vocabulaire : somme, différence, produit, termes, facteurs ;",
  "poser et effectuer une addition, une soustraction et une multiplication de nombres décimaux ;",
  "multiplier un nombre décimal par 10, 100, 1 000 et par 0,1 ; 0,01 ; 0,001 ;",
  "calculer une suite d'additions et de soustractions, et calculer astucieusement ;",
  "donner un ordre de grandeur pour prévoir et contrôler un résultat ;",
  "utiliser un tableur pour effectuer des calculs."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Additionner et soustraire", h:`
  <h4>1. Vocabulaire</h4>
  <div class="retenir" data-l="Définitions"><p>La <b>somme</b> est le résultat d'une addition. La <b>différence</b> est le résultat d'une soustraction. Les nombres que l'on additionne ou que l'on soustrait s'appellent les <b>termes</b>.</p></div>
  <p><b>Exemples :</b> la somme de 12 et de 3 est 12 + 3 = 15 ; la différence de 15 et de 3 est 15 − 3 = 12.</p>
  <h4>2. Poser une addition ou une soustraction</h4>
  <div class="retenir" data-l="Méthode"><ol><li>J'aligne les virgules les unes sous les autres : chaque chiffre est sous un chiffre du même rang.</li><li>Je complète si besoin par des zéros pour avoir autant de chiffres après la virgule.</li><li>Je calcule comme avec des nombres entiers, et je place la virgule du résultat sous les autres.</li></ol></div>
  <div class="figs">${co("add","18,57 + 14,90 = 33,47 posé",170)}${co("sous","45,30 − 33,47 = 11,83 posé",170)}</div>
  <h4>3. Calculer une suite d'additions et de soustractions</h4>
  <div class="retenir" data-l="Propriété"><p>Dans un calcul sans parenthèses qui ne contient que des <b>additions</b>, on peut effectuer les calculs <b>dans l'ordre que l'on veut</b>.</p></div>
  <p class="calc">A = 17 + 8,6 + 3 + 1,4<br>A = (17 + 3) + (8,6 + 1,4)<br>A = 20 + 10<br>A = <b>30</b></p>
  <div class="retenir" data-l="Propriété"><p>Dans un calcul sans parenthèses qui contient des <b>soustractions</b> (seules ou avec des additions), on effectue les calculs <b>de gauche à droite</b>.</p></div>
  <p class="calc">B = 20 − 9 − 5<br>B = 11 − 5<br>B = <b>6</b></p><p>Et non 20 − 4 = 16 : on ne commence pas par 9 − 5.</p>`},
{k:"II", t:"Multiplier", h:`
  <h4>1. Vocabulaire</h4>
  <div class="retenir" data-l="Définition"><p>Le <b>produit</b> est le résultat d'une multiplication. Les nombres que l'on multiplie s'appellent les <b>facteurs</b>.</p></div>
  <p><b>Exemple :</b> le produit de 4 par 2,5 est 4 × 2,5 = 10. Les facteurs sont 4 et 2,5.</p>
  <h4>2. Multiplier par 10, 100, 1 000</h4>
  <div class="retenir" data-l="À retenir"><div class="scroll"><table class="std"><thead><tr><th>Je multiplie par…</th><th>Exemple</th><th>La virgule se déplace…</th></tr></thead><tbody><tr><td>10</td><td>3,45 × 10 = 34,5</td><td>d'1 rang vers la droite</td></tr><tr><td>100</td><td>3,45 × 100 = 345</td><td>de 2 rangs vers la droite</td></tr><tr><td>1 000</td><td>3,45 × 1 000 = 3 450</td><td>de 3 rangs vers la droite</td></tr></tbody></table></div></div>
  <p><b>Remarque :</b> quand il n'y a plus assez de chiffres, on complète par des zéros : 3,45 × 1 000 = 3 450.</p>
  <h4>3. Multiplier par 0,1 ; 0,01 ; 0,001</h4>
  <div class="retenir" data-l="À retenir"><div class="scroll"><table class="std"><thead><tr><th>Je multiplie par…</th><th>Exemple</th><th>La virgule se déplace…</th></tr></thead><tbody><tr><td>0,1</td><td>275 × 0,1 = 27,5</td><td>d'1 rang vers la gauche</td></tr><tr><td>0,01</td><td>275 × 0,01 = 2,75</td><td>de 2 rangs vers la gauche</td></tr><tr><td>0,001</td><td>275 × 0,001 = 0,275</td><td>de 3 rangs vers la gauche</td></tr></tbody></table></div></div>
  <p class="attention"><b>ATTENTION :</b> multiplier par 0,1 rend le nombre plus petit : multiplier ne donne pas toujours un résultat plus grand.</p>
  <h4>4. Poser une multiplication de nombres décimaux</h4>
  <div class="retenir" data-l="Méthode"><ol><li>J'effectue la multiplication sans tenir compte des virgules.</li><li>Je compte le nombre total de chiffres après la virgule dans les deux facteurs.</li><li>Je place la virgule dans le résultat pour qu'il ait autant de chiffres après la virgule.</li></ol></div>
  ${co("mult","425 × 36 = 15 300, donc 4,25 × 3,6 = 15,300 = 15,3 (2 + 1 = 3 chiffres après la virgule)",200)}
  <h4>5. Calculer astucieusement un produit</h4>
  <div class="retenir" data-l="Propriété"><p>Dans un produit, on peut <b>changer l'ordre des facteurs</b> et les regrouper comme on veut.</p></div>
  <p class="calc">C = 4 × 7,3 × 25<br>C = (4 × 25) × 7,3<br>C = 100 × 7,3<br>C = <b>730</b></p>`},
{k:"III", t:"Prévoir et contrôler un résultat : l'ordre de grandeur", h:`
  <div class="retenir" data-l="Définition"><p>Un <b>ordre de grandeur</b> d'un calcul est le résultat que l'on obtient en remplaçant chaque nombre par une valeur proche, plus simple, avant de calculer.</p></div>
  <p class="calc">18,57 + 14,9 ≈ 19 + 15 = 34 : le résultat exact, 33,47, est bien proche de 34.<br>4,25 × 3,6 ≈ 4 × 4 = 16 : le résultat exact, 15,3, est cohérent.</p>
  <p><b>Remarque :</b> l'ordre de grandeur sert à repérer une erreur de virgule : si je trouve 153 ou 1,53 pour 4,25 × 3,6, je sais que je me suis trompé.</p>`},
{k:"IV", t:"Résoudre un problème", h:`
  <div class="retenir" data-l="Rédaction attendue"><ol><li>J'écris le calcul en ligne.</li><li>J'écris une phrase qui explique le résultat, avec l'unité.</li><li>Si on me le demande, je pose l'opération à côté.</li></ol></div>
  <p><b>Exemple :</b> Lucie et Tom font une randonnée sur trois jours : 18,57 km le vendredi, 14,9 km le samedi, et 45,3 km en tout. Quelle distance ont-ils parcourue le dimanche ?</p>
  <p class="calc">18,57 + 14,9 = 33,47. &nbsp; Le vendredi et le samedi, ils ont parcouru 33,47 km.<br>45,3 − 33,47 = 11,83. &nbsp; Le dimanche, ils ont parcouru 11,83 km.</p>`},
{k:"V", t:"Calculer avec un tableur", h:`
  <h4>1. Vocabulaire</h4>
  <p>Une feuille de calcul est formée de <b>colonnes</b> (repérées par des lettres) et de <b>lignes</b> (repérées par des nombres). Chaque case s'appelle une <b>cellule</b> : la cellule B3 est à la croisée de la colonne B et de la ligne 3.</p>
  <h4>2. Écrire une formule</h4>
  <div class="retenir" data-l="À retenir"><ol><li>Une formule commence toujours par le signe <b>=</b>.</li><li>On utilise les adresses des cellules : =B2*C2 multiplie le contenu de B2 par celui de C2.</li><li>Les signes sont : <b>+</b> pour additionner, <b>−</b> pour soustraire, <b>*</b> pour multiplier.</li><li>En tirant la petite poignée en bas à droite d'une cellule, on recopie la formule vers le bas.</li></ol></div>
  ${co("tableur","Le tableau avec la formule =B2*C2",380)}
  <p>Dans la cellule D2, on tape =B2*C2 : le tableur affiche 12. En recopiant vers le bas, D3 contient =B3*C3 et D4 contient =B4*C4.</p>
  <p>Pour additionner une colonne entière, on utilise =SOMME(D2:D4) : le tableur calcule D2 + D3 + D4.</p>
  <p><i>Pour t'entraîner, le site a aussi un tableur : onglet Informatique de la page Sixième.</i></p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Additionner et soustraire", e:[
  {n:"Exercice 1", t:"Le vocabulaire", w:"Sur ta feuille", h:`<p>Écris le calcul, puis donne le résultat.</p><p>a) La somme de 12,5 et de 7,5 · b) La différence de 20 et de 6,4 · c) La somme de 3,7 ; 1,3 et 5 · d) La différence de 9,1 et de 0,1</p>`,
   c:`a) 12,5 + 7,5 = 20 · b) 20 − 6,4 = 13,6 · c) 3,7 + 1,3 + 5 = 10 · d) 9,1 − 0,1 = 9`},
  {n:"Exercice 2", t:"Poser des additions", w:"Sur ton cahier", h:`<p>1) Pose et effectue ces additions sur ton cahier : a) 34,8 + 125,07 · b) 9,456 + 27,6 · c) 0,75 + 18 + 3,4 · d) 102,5 + 7,95</p><p>2) Vérifie ensuite tes résultats à la calculatrice.</p>`,
   c:`<p>On aligne les virgules et on complète par des zéros : 34,80 + 125,07 ; 9,456 + 27,600 ; 0,75 + 18,00 + 3,40 ; 102,50 + 7,95.</p><div class="figs" style="align-items:flex-start">${pose(["34,80","125,07"],"+","159,87")}${pose(["9,456","27,600"],"+","37,056")}${pose(["0,75","18,00","3,40"],"+","22,15")}${pose(["102,50","7,95"],"+","110,45")}</div><p>a) 34,8 + 125,07 = <b>159,87</b> · b) 9,456 + 27,6 = <b>37,056</b> · c) 0,75 + 18 + 3,4 = <b>22,15</b> · d) 102,5 + 7,95 = <b>110,45</b></p>`},
  {n:"Exercice 3", t:"Poser des soustractions", w:"Sur ton cahier", h:`<p>1) Pose et effectue ces soustractions sur ton cahier : a) 87,4 − 23,85 · b) 100 − 37,6 · c) 15,07 − 8,9 · d) 245 − 12,48</p><p>2) Vérifie ensuite tes résultats à la calculatrice.</p>`,
   c:`<p>On écrit 87,40 − 23,85 ; 100,0 − 37,6 ; 15,07 − 8,90 ; 245,00 − 12,48.</p><div class="figs" style="align-items:flex-start">${pose(["87,40","23,85"],"−","63,55")}${pose(["100,0","37,6"],"−","62,4")}${pose(["15,07","8,90"],"−","6,17")}${pose(["245,00","12,48"],"−","232,52")}</div><p>a) 87,4 − 23,85 = <b>63,55</b> · b) 100 − 37,6 = <b>62,4</b> · c) 15,07 − 8,9 = <b>6,17</b> · d) 245 − 12,48 = <b>232,52</b></p>`},
  {n:"Activité 1", t:"Prévoir une dépense avec un ordre de grandeur", w:"Sur ta feuille", h:`<p>Vanessa veut participer à des compétitions de VTT. Voici l'équipement qu'elle doit acheter.</p><div class="scroll"><table class="std"><thead><tr><th>Article</th><th>Vélo</th><th>Casque</th><th>Gants</th><th>Chaussures</th></tr></thead><tbody><tr><th>Prix</th><td>389,90 €</td><td>59,95 €</td><td>18,50 €</td><td>74,99 €</td></tr></tbody></table></div><p>1) Sans calculatrice, donne un ordre de grandeur de sa dépense totale. Explique comment tu as fait.</p><p>2) Vanessa a 550 €. Peut-elle tout acheter ? Calcule ensuite la dépense exacte pour vérifier.</p>`,
   c:`<p>1) On arrondit chaque prix à une valeur simple : 389,90 ≈ 390 ; 59,95 ≈ 60 ; 18,50 ≈ 20 ; 74,99 ≈ 75. Ordre de grandeur : 390 + 60 + 20 + 75 = <b>545 €</b> environ.</p><p>2) 545 &lt; 550 : elle devrait pouvoir tout acheter. Dépense exacte : 389,90 + 59,95 + 18,50 + 74,99 = <b>543,34 €</b>. 543,34 &lt; 550 : <b>oui, elle peut tout acheter</b> (il lui restera 550 − 543,34 = 6,66 €).</p>`},
  {n:"Exercice 4", t:"Le bon résultat", w:"Sur ta feuille", h:`<p>Sans poser l'opération, utilise un ordre de grandeur pour entourer le bon résultat.</p><p>a) 48,7 + 21,4 : 70,1 · 7,01 · 701</p><p>b) 99,8 − 40,3 : 5,95 · 59,5 · 595</p><p>c) 12,06 + 7,9 : 8,48 · 19,96 · 199,6</p><p>d) 300 − 1,5 : 298,5 · 285 · 150</p>`,
   c:`a) 50 + 20 = 70 : <b>70,1</b> · b) 100 − 40 = 60 : <b>59,5</b> · c) 12 + 8 = 20 : <b>19,96</b> · d) 300 − 2 = 298 : <b>298,5</b>`},
  {n:"Exercice 5", t:"Des problèmes", w:"Sur ton cahier", h:`<p>Pour chaque problème : le calcul en ligne, puis une phrase qui explique le résultat.</p><p>1) Un manteau coûte 56,45 €. Le commerçant me fait une remise de 18,80 €. Combien vais-je le payer ?</p><p>2) M. Durand a 175 € en poche. Il achète une paire de chaussures à 62,85 €. Combien lui reste-t-il ?</p><p>3) J'achète un pull à 35,75 € et un haut à 27,60 €. Je paie avec les 70,50 € de mon portefeuille. Combien me reste-t-il ?</p><p>4) Simon a 28,80 €, mais il lui manque 17,55 € pour s'acheter des chaussures. Quel est leur prix ?</p><p>5) Xavier a 28,20 € dans sa tirelire. Son grand-père lui donne 75 €. Il a maintenant 53 € de plus que sa sœur Christine. Quelle somme possède Christine ?</p>`,
   c:`<p>1) 56,45 − 18,80 = 37,65. Je vais payer le manteau <b>37,65 €</b>.</p><p>2) 175 − 62,85 = 112,15. Il lui reste <b>112,15 €</b>.</p><p>3) 35,75 + 27,60 = 63,35, puis 70,50 − 63,35 = 7,15. Il me reste <b>7,15 €</b>.</p><p>4) 28,80 + 17,55 = 46,35. Les chaussures coûtent <b>46,35 €</b>.</p><p>5) 28,20 + 75 = 103,20 : Xavier a maintenant 103,20 €. Puis 103,20 − 53 = 50,20. Christine possède <b>50,20 €</b>.</p>`},
  {n:"Exercice 6", t:"Calculer astucieusement une somme", w:"Sur ton cahier", h:`<p>Calcule en regroupant les termes qui vont bien ensemble. Écris tes étapes.</p><div class="calcs"><span>A = 3,7 + 12 + 6,3 + 8</span><span>B = 25 + 18,5 + 75 + 1,5</span><span>C = 4,2 + 9,9 + 5,8 + 0,1</span><span>D = 13,4 + 7 + 6,6 + 3</span><span>E = 0,25 + 7,3 + 0,75 + 2,7</span><span>F = 19,5 + 34 + 0,5 + 16</span></div>`,
   c:`<div class="calcs"><div><p class="calc">A = 3,7 + 12 + 6,3 + 8<br>A = (3,7 + 6,3) + (12 + 8)<br>A = 10 + 20<br>A = <b>30</b></p></div><div><p class="calc">B = 25 + 18,5 + 75 + 1,5<br>B = (25 + 75) + (18,5 + 1,5)<br>B = 100 + 20<br>B = <b>120</b></p></div><div><p class="calc">C = 4,2 + 9,9 + 5,8 + 0,1<br>C = (4,2 + 5,8) + (9,9 + 0,1)<br>C = 10 + 10<br>C = <b>20</b></p></div><div><p class="calc">D = 13,4 + 7 + 6,6 + 3<br>D = (13,4 + 6,6) + (7 + 3)<br>D = 20 + 10<br>D = <b>30</b></p></div><div><p class="calc">E = 0,25 + 7,3 + 0,75 + 2,7<br>E = (0,25 + 0,75) + (7,3 + 2,7)<br>E = 1 + 10<br>E = <b>11</b></p></div><div><p class="calc">F = 19,5 + 34 + 0,5 + 16<br>F = (19,5 + 0,5) + (34 + 16)<br>F = 20 + 50<br>F = <b>70</b></p></div></div>`},
  {n:"Activité 2", t:"L'ordre des calculs", w:"Sur ta feuille", h:`<p>1) Au cours d'un jeu, Inès gagne 20 points, puis perd 9 points, puis perd 5 points. Combien a-t-elle de points ? Écris le calcul en une seule ligne.</p><p>2) Lucas calcule 20 − 9 − 5 en commençant par 9 − 5. Que trouve-t-il ? A-t-il raison ?</p><p>3) Complète : dans un calcul qui contient des soustractions, on effectue les calculs ……</p>`,
   c:`<p>1) 20 − 9 − 5 = 11 − 5 = <b>6</b>. Inès a 6 points.</p><p>2) Lucas calcule 9 − 5 = 4, puis 20 − 4 = <b>16</b>. Il a tort : Inès a perdu 9 puis 5 points, soit 14 points en tout, il lui en reste 6.</p><p>3) Dans un calcul qui contient des soustractions, on effectue les calculs <b>de gauche à droite</b>.</p>`},
  {n:"Exercice 7", t:"Suites d'additions et de soustractions", w:"Sur ton cahier", h:`<p>Calcule en détaillant les étapes.</p><div class="calcs"><span>A = 15 − 4 − 3</span><span>B = 30 − 12 + 5</span><span>C = 7,5 + 2,5 − 4</span><span>D = 50 − 8,5 − 1,5</span><span>E = 12 − 3,2 + 1,2</span><span>F = 100 − 25 − 25 + 10</span><span>G = 9,8 − 0,8 + 3 − 2</span><span>H = 45 − 15 + 5 − 5</span></div>`,
   c:`<p>De gauche à droite :</p><div class="calcs"><div><p class="calc">A = 15 − 4 − 3<br>A = 11 − 3<br>A = <b>8</b></p></div><div><p class="calc">B = 30 − 12 + 5<br>B = 18 + 5<br>B = <b>23</b></p></div><div><p class="calc">C = 7,5 + 2,5 − 4<br>C = 10 − 4<br>C = <b>6</b></p></div><div><p class="calc">D = 50 − 8,5 − 1,5<br>D = 41,5 − 1,5<br>D = <b>40</b></p></div><div><p class="calc">E = 12 − 3,2 + 1,2<br>E = 8,8 + 1,2<br>E = <b>10</b></p></div><div><p class="calc">F = 100 − 25 − 25 + 10<br>F = 75 − 25 + 10<br>F = 50 + 10<br>F = <b>60</b></p></div><div><p class="calc">G = 9,8 − 0,8 + 3 − 2<br>G = 9 + 3 − 2<br>G = 12 − 2<br>G = <b>10</b></p></div><div><p class="calc">H = 45 − 15 + 5 − 5<br>H = 30 + 5 − 5<br>H = 35 − 5<br>H = <b>30</b></p></div></div>`},
  {n:"Pour aller plus loin", t:"La facture du garage", w:"Sur ta feuille", h:`<p>Sur une facture : prix HT (hors taxe) + TVA (taxe) = prix TTC (toutes taxes comprises). Complète la facture.</p><div class="scroll"><table class="std"><thead><tr><th></th><th>Prix HT (en €)</th><th>TVA (en €)</th><th>Prix TTC (en €)</th></tr></thead><tbody><tr><th>Plaquettes de freins</th><td>393,30</td><td>85,02</td><td>……</td></tr><tr><th>Main d'œuvre</th><td>61,50</td><td>……</td><td>73,10</td></tr><tr><th>Pneus</th><td>……</td><td>38,95</td><td>286,77</td></tr><tr><th>TOTAL À PAYER</th><td></td><td></td><td>……</td></tr></tbody></table></div>`,
   c:`<p>Plaquettes : TTC = 393,30 + 85,02 = <b>478,32</b>.</p><p>Main d'œuvre : TVA = TTC − HT = 73,10 − 61,50 = <b>11,60</b>.</p><p>Pneus : HT = TTC − TVA = 286,77 − 38,95 = <b>247,82</b>.</p><p>Total à payer : 478,32 + 73,10 + 286,77 = <b>838,19 €</b>.</p>`}
 ]},
{t:"Multiplier", e:[
  {n:"Exercice 8", t:"Multiplier par 10, 100, 1 000", w:"Sur ta feuille", h:`<p>a) 4,7 × 10 · b) 4,7 × 100 · c) 4,7 × 1 000 · d) 0,36 × 10 · e) 0,36 × 100 · f) 0,36 × 1 000 · g) 12 × 100 · h) 5,042 × 1 000 · i) 0,008 × 10</p>`,
   c:`a) 4,7 × 10 = <b>47</b> (1 rang vers la droite) · b) 4,7 × 100 = <b>470</b> (2 rangs vers la droite) · c) 4,7 × 1 000 = <b>4 700</b> (3 rangs vers la droite) · d) 0,36 × 10 = <b>3,6</b> (1 rang vers la droite) · e) 0,36 × 100 = <b>36</b> (2 rangs vers la droite) · f) 0,36 × 1 000 = <b>360</b> (3 rangs vers la droite) · g) 12 × 100 = <b>1 200</b> (2 rangs vers la droite) · h) 5,042 × 1 000 = <b>5 042</b> (3 rangs vers la droite) · i) 0,008 × 10 = <b>0,08</b> (1 rang vers la droite)`},
  {n:"Exercice 9", t:"Multiplier par 0,1 ; 0,01 ; 0,001", w:"Sur ta feuille", h:`<p>a) 58 × 0,1 · b) 58 × 0,01 · c) 58 × 0,001 · d) 3,6 × 0,1 · e) 3,6 × 0,01 · f) 250 × 0,001 · g) 7 × 0,1 · h) 0,4 × 0,1 · i) 1 200 × 0,01</p>`,
   c:`a) 58 × 0,1 = <b>5,8</b> (1 rang vers la gauche) · b) 58 × 0,01 = <b>0,58</b> (2 rangs vers la gauche) · c) 58 × 0,001 = <b>0,058</b> (3 rangs vers la gauche) · d) 3,6 × 0,1 = <b>0,36</b> (1 rang vers la gauche) · e) 3,6 × 0,01 = <b>0,036</b> (2 rangs vers la gauche) · f) 250 × 0,001 = <b>0,25</b> (3 rangs vers la gauche) · g) 7 × 0,1 = <b>0,7</b> (1 rang vers la gauche) · h) 0,4 × 0,1 = <b>0,04</b> (1 rang vers la gauche) · i) 1 200 × 0,01 = <b>12</b> (2 rangs vers la gauche)`},
  {n:"Exercice 10", t:"Le nombre manquant", w:"Sur ta feuille", h:`<p>a) …… × 100 = 45 · b) 3,7 × …… = 370 · c) 0,5 × …… = 50 · d) …… × 10 = 0,6 · e) 82 × …… = 8,2 · f) …… × 0,01 = 0,03</p>`,
   c:`a) <b>0,45</b> × 100 = 45 (× 100 : 2 rangs vers la droite) · b) 3,7 × <b>100</b> = 370 (2 rangs vers la droite : × 100) · c) 0,5 × <b>100</b> = 50 (2 rangs vers la droite : × 100) · d) <b>0,06</b> × 10 = 0,6 (× 10 : 1 rang vers la droite) · e) 82 × <b>0,1</b> = 8,2 (1 rang vers la gauche : × 0,1) · f) <b>3</b> × 0,01 = 0,03 (× 0,01 : 2 rangs vers la gauche)`},
  {n:"Exercice 11", t:"Poser des multiplications", w:"Sur ton cahier", h:`<p>1) Pour chaque produit, donne d'abord un ordre de grandeur. 2) Pose ensuite l'opération sur ton cahier, et vérifie que ton résultat est proche de l'ordre de grandeur.</p><p>3,5 × 4 · 2,07 × 6 · 4,5 × 1,2 · 12,3 × 0,25 · 8,9 × 3,1</p>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Produit</th><th>Ordre de grandeur</th><th>Sans les virgules</th><th>Résultat exact</th></tr></thead><tbody><tr><td>3,5 × 4</td><td>4 × 4 = 16</td><td>35 × 4 = 140 ; 1 chiffre après la virgule</td><td><b>14</b> (14,0)</td></tr><tr><td>2,07 × 6</td><td>2 × 6 = 12</td><td>207 × 6 = 1 242 ; 2 chiffres après la virgule</td><td><b>12,42</b></td></tr><tr><td>4,5 × 1,2</td><td>5 × 1 = 5</td><td>45 × 12 = 540 ; 1 + 1 = 2 chiffres</td><td><b>5,4</b> (5,40)</td></tr><tr><td>12,3 × 0,25</td><td>12 × 0,25 = 3</td><td>123 × 25 = 3 075 ; 1 + 2 = 3 chiffres</td><td><b>3,075</b></td></tr><tr><td>8,9 × 3,1</td><td>9 × 3 = 27</td><td>89 × 31 = 2 759 ; 1 + 1 = 2 chiffres</td><td><b>27,59</b></td></tr></tbody></table></div><p>Exemple : 207 × 6 = 1 242 ; 2,07 a 2 chiffres après la virgule, 6 n'en a pas : 2,07 × 6 = 12,42.</p>`},
  {n:"Exercice 12", t:"Calculer astucieusement un produit", w:"Sur ton cahier", h:`<p>Change l'ordre des facteurs pour calculer facilement, sans poser d'opération. Écris tes étapes.</p><div class="calcs"><span>A = 25 × 3,7 × 4</span><span>B = 0,5 × 9,4 × 2</span><span>C = 2,5 × 6 × 4</span><span>D = 20 × 0,9 × 5</span></div>`,
   c:`<div class="calcs"><div><p class="calc">A = 25 × 3,7 × 4<br>A = (25 × 4) × 3,7<br>A = 100 × 3,7<br>A = <b>370</b></p></div><div><p class="calc">B = 0,5 × 9,4 × 2<br>B = (0,5 × 2) × 9,4<br>B = 1 × 9,4<br>B = <b>9,4</b></p></div><div><p class="calc">C = 2,5 × 6 × 4<br>C = (2,5 × 4) × 6<br>C = 10 × 6<br>C = <b>60</b></p></div><div><p class="calc">D = 20 × 0,9 × 5<br>D = (20 × 5) × 0,9<br>D = 100 × 0,9<br>D = <b>90</b></p></div></div>`},
  {n:"Exercice 13", t:"Des achats", w:"Sur ton cahier", h:`<p>1) J'achète 6 croissants à 1,15 € l'un. Combien vais-je payer ?</p><p>2) Les pommes coûtent 2,40 € le kilo. Combien coûtent 3,5 kg de pommes ?</p><p>3) Un litre d'essence coûte 1,85 €. Combien coûtent 12 litres ? Avec 30 €, puis-je en acheter 15 litres ?</p>`,
   c:`<p>1) 6 × 1,15 = 6,90. Je vais payer <b>6,90 €</b>.</p><p>2) 3,5 × 2,40 = 8,40. 3,5 kg de pommes coûtent <b>8,40 €</b>.</p><p>3) 12 × 1,85 = 22,20 : 12 litres coûtent <b>22,20 €</b>. 15 × 1,85 = 27,75 et 27,75 &lt; 30 : <b>oui</b>, je peux acheter 15 litres (il me restera 2,25 €).</p>`}
 ]},
{t:"Séance en salle informatique : le tableur", note:"Objectif : utiliser des formules pour faire calculer le tableur, et contrôler ses résultats. Tu peux faire cette séance avec le tableur du site (onglet Informatique).", e:[
  {n:"Partie 1", t:"Se repérer dans une feuille de calcul", w:"Sur ta feuille", h:`<p>1) Ouvre le tableur. Clique dans la cellule C4 et tape le nombre 12.</p><p>2) Dans quelle colonne se trouve-t-elle ? Dans quelle ligne ?</p><p>3) Clique dans la cellule D4 et tape =C4*10, puis appuie sur Entrée. Qu'affiche le tableur ? Qu'a calculé la formule ?</p><p>4) Remplace 12 par 3,5 dans C4. Que devient D4 ? Pourquoi D4 a-t-il changé tout seul ?</p>`,
   c:`<p>2) Dans la colonne <b>C</b> et la ligne <b>4</b>.</p><p>3) Le tableur affiche <b>120</b> : la formule a calculé le contenu de C4 multiplié par 10 (12 × 10).</p><p>4) D4 devient <b>35</b> (3,5 × 10). D4 a changé tout seul car la formule utilise l'adresse C4 : dès que le contenu de C4 change, le tableur refait le calcul.</p>`},
  {n:"Partie 2", t:"La liste des fournitures", w:"Sur ta feuille", h:`<p>Reproduis exactement ce tableau dans le tableur, à partir de la cellule A1.</p>${ex("fourn","Le tableau des fournitures",400)}<p>1) Dans la cellule D2, écris une formule qui calcule le prix total des cahiers. 2) Recopie cette formule vers le bas jusqu'à D6. Quelle formule contient maintenant la cellule D5 ? 3) Dans la cellule D7, écris =SOMME(D2:D6). Quel est le prix total de la liste ? 4) Vérifie le prix total des classeurs en posant la multiplication sur ton cahier.</p>`,
   c:`<p>1) Formule : <b>=B2*C2</b>. Le tableur affiche <b>12</b> (2,40 × 5).</p><p>2) D5 contient <b>=B5*C5</b>.</p>
   <div class="scroll"><table class="std"><thead><tr><th>Article</th><th>Prix total</th></tr></thead><tbody><tr><td>Cahier</td><td>2,40 × 5 = 12</td></tr><tr><td>Stylo</td><td>1,15 × 8 = 9,20</td></tr><tr><td>Classeur</td><td>4,90 × 3 = 14,70</td></tr><tr><td>Règle</td><td>0,85 × 2 = 1,70</td></tr><tr><td>Gomme</td><td>0,60 × 4 = 2,40</td></tr></tbody></table></div>
   <p>3) Prix total : 12 + 9,20 + 14,70 + 1,70 + 2,40 = <b>40 €</b>.</p><p>4) 490 × 3 = 1 470 ; 4,90 a 2 chiffres après la virgule : 4,90 × 3 = 14,70 €.</p>`},
  {n:"Partie 3", t:"Que se passe-t-il si… ?", w:"Sur ta feuille", h:`<p>1) Il faut finalement 10 stylos. Modifie la cellule C3. Quel est le nouveau prix total ?</p><p>2) As-tu dû refaire les calculs toi-même ? Explique pourquoi c'est pratique.</p><p>3) Défi : remets 8 stylos. Le budget est de 45 €. En gardant le reste de la liste, combien de classeurs peut-on acheter au maximum ?</p>`,
   c:`<p>1) Les stylos coûtent maintenant 1,15 × 10 = 11,50 €. Nouveau total : <b>42,30 €</b>.</p><p>2) Non : le tableur a tout recalculé tout seul, car les formules utilisent les adresses des cellules. C'est pratique pour tester plusieurs possibilités sans refaire les calculs.</p>
   <p>3) Sans les classeurs, la liste coûte 40 − 14,70 = 25,30 €. Il reste 45 − 25,30 = 19,70 € pour les classeurs. 4 classeurs coûtent 4 × 4,90 = 19,60 € (ça passe) et 5 classeurs coûtent 24,50 € (trop cher). On peut acheter <b>4 classeurs</b> au maximum (total : 44,90 €).</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Le vocabulaire", schema:S_VOC, q:{
 1:[ {q:"Le résultat d'une addition s'appelle…", c:["une somme","une différence","un produit"], rep:"une somme", sx:S_VOC},
     {q:"Le résultat d'une multiplication s'appelle…", c:["un produit","une somme","un quotient"], rep:"un produit", sx:S_VOC} ],
 2:[ {g:()=>{ const a=ri(11,49), b=ri(2,9); return {q:`Calcule la différence de ${a} et de ${b},5.`, rep:D(10*a-10*b-5,1), ex:`${a} − ${b},5 = ${D(10*a-10*b-5,1)}.`, sx:S_VOC}; }},
     {q:"Dans 4 × 2,5 = 10, comment s'appellent 4 et 2,5 ?", c:["les facteurs","les termes","les produits"], rep:"les facteurs", sx:S_VOC} ],
 3:[ {g:()=>{ const a=ri(11,49), b=ri(11,49); return {q:`Calcule la somme de ${D(a,1)} et de ${D(b,1)}.`, rep:D(a+b,1), sx:S_VOC}; }},
     {q:"Dans 12 + 3 = 15, comment s'appellent 12 et 3 ?", c:["les termes","les facteurs","les sommes"], rep:"les termes", sx:S_VOC} ]
}},
{nom:"Additionner et soustraire", schema:S_POSE, q:{
 1:[ {g:()=>{ const a=ri(101,999), b=ri(101,999); return {q:`Calcule : ${D(a,1)} + ${D(b,1)}`, rep:D(a+b,1), ex:`${D(a,1)} + ${D(b,1)} = ${D(a+b,1)}.`, sx:S_POSE}; }} ],
 2:[ {g:()=>{ const a=ri(101,999), b=ri(1001,9999); return {q:`Calcule : ${D(a,1)} + ${D(b,2)}`, rep:D(10*a+b,2), ex:`On aligne les virgules : ${D(a,1)}0 + ${D(b,2)} = ${D(10*a+b,2)}.`, sx:S_POSE}; }},
     {g:()=>{ const a=ri(20,99), b=ri(101,10*a-10); return {q:`Calcule : ${a} − ${D(b,1)}`, rep:D(10*a-b,1), ex:`${a},0 − ${D(b,1)} = ${D(10*a-b,1)}.`, sx:S_POSE}; }} ],
 3:[ {g:()=>{ let a,b; do{ a=ri(1001,9999); b=ri(101,999); }while(a<10*b); return {q:`Calcule : ${D(a,2)} − ${D(b,1)}`, rep:D(a-10*b,2), ex:`${D(a,2)} − ${D(b,1)}0 = ${D(a-10*b,2)}.`, sx:S_POSE}; }},
     {q:"Pour poser 9,456 + 27,6, que faut-il aligner ?", c:["les virgules","les derniers chiffres","les premiers chiffres"], rep:"les virgules", sx:S_POSE} ]
}},
{nom:"Suites de calculs", schema:S_GD, q:{
 1:[ {g:()=>{ const a=ri(20,50), b=ri(2,9), c=ri(2,9); return {q:`Calcule : ${a} − ${b} − ${c}`, rep:String(a-b-c), ex:`De gauche à droite : ${a-b} − ${c} = ${a-b-c}.`, sx:S_GD}; }} ],
 2:[ {g:()=>{ const a=ri(20,50), b=ri(2,19), c=ri(2,9); return {q:`Calcule : ${a} − ${b} + ${c}`, c:uniq(String(a-b+c),[String(a-b-c),String(a-(b+c))]), rep:String(a-b+c), ex:`De gauche à droite : ${a-b} + ${c} = ${a-b+c}.`, sx:S_GD}; }},
     {g:()=>{ const x=ri(1,9), a=ri(2,9), b=ri(2,9), n=ri(2,20), m=ri(2,20); return {q:`Calcule astucieusement : ${a},${x} + ${n} + ${b},${10-x} + ${m}`, rep:String(a+b+1+n+m), ex:`(${a},${x} + ${b},${10-x}) + (${n} + ${m}) = ${a+b+1} + ${n+m} = ${a+b+1+n+m}.`, sx:S_GD}; }} ],
 3:[ {q:"Lucas calcule 20 − 9 − 5 en faisant d'abord 9 − 5. A-t-il raison ?", c:["Non, on calcule de gauche à droite","Oui, on fait ce qu'on veut"], rep:"Non, on calcule de gauche à droite", ex:"20 − 9 − 5 = 11 − 5 = 6 (et non 16).", sx:S_GD},
     {g:()=>{ const a=ri(5,9), b=ri(1,4); return {q:`Calcule : ${a},${b} + 3,${10-b} − ${a}`, rep:D(10*a+b+30+10-b-10*a,1), ex:`${a},${b} + 3,${10-b} = ${D(10*a+b+30+10-b,1)}, puis − ${a} = ${D(40,1)}.`, sx:S_GD}; }} ]
}},
{nom:"× 10, × 100, × 1 000", schema:S_10, q:{
 1:[ {g:()=>{ const n=ri(11,999), k=pick([1,2]), m=pick([10,100]); return {q:`Calcule : ${D(n,k)} × ${m}`, rep:D(n*m,k), ex:`La virgule se déplace de ${m===10?1:2} rang${m===10?"":"s"} vers la droite.`, sx:S_10}; }} ],
 2:[ {g:()=>{ const n=ri(11,99), k=2; return {q:`Calcule : ${D(n,k)} × 1 000`, rep:D(n*1000,k), ex:`3 rangs vers la droite : on complète par des zéros.`, sx:S_10}; }},
     {g:()=>{ const n=ri(1,9); return {q:`Calcule : 0,00${n} × 100`, rep:D(n*100,3), ex:`2 rangs vers la droite : 0,${n}.`, sx:S_10}; }} ],
 3:[ {g:()=>{ const n=ri(11,99), m=pick([10,100]); return {q:`Complète : …… × ${m} = ${D(n,1)}`, rep:D(n,1+(m===10?1:2)), ex:`On fait le chemin inverse : la virgule se déplace vers la gauche.`, sx:S_10}; }} ]
}},
{nom:"× 0,1, × 0,01, × 0,001", schema:S_01, q:{
 1:[ {g:()=>{ const n=ri(11,999); return {q:`Calcule : ${n} × 0,1`, rep:D(n,1), ex:`1 rang vers la gauche.`, sx:S_01}; }} ],
 2:[ {g:()=>{ const n=ri(11,999), m=pick([["0,01",2],["0,001",3]]); return {q:`Calcule : ${n} × ${m[0]}`, rep:D(n,m[1]), ex:`${m[1]} rangs vers la gauche.`, sx:S_01}; }},
     {q:"Vrai ou faux : multiplier un nombre par 0,1 donne un résultat plus grand.", c:VF, rep:"Faux", ex:"Multiplier par 0,1, c'est déplacer la virgule vers la gauche : le nombre devient plus petit.", sx:S_01} ],
 3:[ {g:()=>{ const n=ri(11,99), k=1; return {q:`Calcule : ${D(n,k)} × 0,01`, rep:D(n,k+2), ex:`2 rangs vers la gauche.`, sx:S_01}; }},
     {g:()=>{ const n=ri(11,99); return {q:`Complète : ${n} × …… = ${D(n,1)}`, c:["0,1","10","0,01"], rep:"0,1", sx:S_01}; }} ]
}},
{nom:"Multiplier des décimaux", schema:S_MUL, q:{
 1:[ {g:()=>{ const a=ri(11,99), b=ri(2,9); return {q:`Calcule : ${D(a,1)} × ${b}`, rep:D(a*b,1), ex:`${a} × ${b} = ${a*b}, et 1 chiffre après la virgule : ${D(a*b,1)}.`, sx:S_MUL}; }} ],
 2:[ {g:()=>{ let a,b; do{ a=ri(11,99); b=ri(11,99); }while(a%10===0 || b%10===0); return {q:`On sait que ${a} × ${b} = ${sp(a*b)}. Combien vaut ${D(a,1)} × ${D(b,1)} ?`, c:uniq(D(a*b,2),[D(a*b,1),D(a*b,3),sp(a*b)]), rep:D(a*b,2), ex:`1 + 1 = 2 chiffres après la virgule.`, sx:S_MUL}; }} ],
 3:[ {g:()=>{ let a,b; do{ a=ri(101,999); b=ri(11,99); }while(a%10===0 || b%10===0); return {q:`On sait que ${a} × ${b} = ${sp(a*b)}. Combien vaut ${D(a,2)} × ${D(b,1)} ?`, c:uniq(D(a*b,3),[D(a*b,2),D(a*b,1),D(a*b,4)]), rep:D(a*b,3), ex:`2 + 1 = 3 chiffres après la virgule.`, sx:S_MUL}; }},
     {g:()=>{ const c=ri(11,99); return {q:`Calcule astucieusement : 4 × ${D(c,1)} × 25`, rep:D(c*100,1), ex:`(4 × 25) × ${D(c,1)} = 100 × ${D(c,1)} = ${D(c*100,1)}.`, sx:S_MUL}; }} ]
}},
{nom:"Ordre de grandeur", schema:S_OG, q:{
 1:[ {g:()=>{ const a=ri(20,80), b=ri(10,40), x=ri(1,9), y=ri(1,9); const s=10*(a+b)+x+y; return {q:`Quel est le bon résultat de ${a},${x} + ${b},${y} ?`, c:shuf([D(s,1),D(s,2),D(s*10,1)]), rep:D(s,1), ex:`Ordre de grandeur : ${a+(x>=5?1:0)} + ${b+(y>=5?1:0)} = ${a+b+(x>=5?1:0)+(y>=5?1:0)}.`, sx:S_OG}; }} ],
 2:[ {g:()=>{ const a=ri(2,9), x=ri(1,4), b=ri(2,9); const p=(10*a+x)*b; return {q:`Quel est le bon résultat de ${a},${x} × ${b} ?`, c:shuf([D(p,1),D(p,2),D(p*10,1)]), rep:D(p,1), ex:`Ordre de grandeur : ${a} × ${b} = ${a*b}.`, sx:S_OG}; }} ],
 3:[ {g:()=>{ const a=ri(2,9), b=ri(2,9), x=ri(1,4), y=ri(1,4); const p=(10*a+x)*(10*b+y); return {q:`Quel est le bon résultat de ${a},${x} × ${b},${y} ?`, c:shuf([D(p,2),D(p,1),D(p,3)]), rep:D(p,2), ex:`Ordre de grandeur : ${a} × ${b} = ${a*b}.`, sx:S_OG}; }} ]
}},
{nom:"Le tableur", schema:S_TAB, q:{
 1:[ {q:"Une formule de tableur commence toujours par…", c:["=","+","*"], rep:"=", sx:S_TAB},
     {q:"La cellule B3 est à la croisée…", c:["de la colonne B et de la ligne 3","de la ligne B et de la colonne 3"], rep:"de la colonne B et de la ligne 3", sx:S_TAB} ],
 2:[ {q:"Quel signe utilise le tableur pour multiplier ?", c:["*","×","x"], rep:"*", sx:S_TAB},
     {q:"On recopie =B2*C2 de D2 vers le bas. Que contient D5 ?", c:["=B5*C5","=B2*C2","=B5*C2"], rep:"=B5*C5", sx:S_TAB} ],
 3:[ {g:()=>{ const b=ri(11,49), c=ri(2,9); return {q:`B2 contient ${D(b,1)} et C2 contient ${c}. Qu'affiche la cellule D2 qui contient =B2*C2 ?`, rep:D(b*c,1), sx:S_TAB}; }},
     {q:"Que calcule =SOMME(D2:D4) ?", c:["D2 + D3 + D4","D2 + D4","D2 × D3 × D4"], rep:"D2 + D3 + D4", sx:S_TAB} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
/* multiplication posée : chiffres alignés à droite, virgule entre deux colonnes ; ligne = [texte, signe, trait dessous, gras] */
const mulP = rows => { const cw=13, n=Math.max(...rows.map(r=>r[0].replace(",","").length)), xr=26+n*cw, H=rows.length*26+14;
  let g=`<svg class="fig" viewBox="0 0 ${xr+8} ${H}" width="${xr+8}" role="img" aria-label="Multiplication posée de ${rows[0][0]} par ${rows[1][0]}">`;
  rows.forEach(([t,sym,line,b],i)=>{ const y=24+i*26+(b?4:0), s=t.replace(",",""), k=t.includes(",")?t.length-t.indexOf(",")-1:0, st=`font-size:17px;${b?"font-weight:700;":""}fill:var(--ink)`;
    [...s].forEach((ch,j)=>{ g+=`<text x="${xr-(s.length-j-0.5)*cw}" y="${y}" text-anchor="middle" style="${st}">${ch}</text>`; });
    if(k) g+=`<text x="${xr-k*cw}" y="${y+2}" text-anchor="middle" style="${st}">,</text>`;
    if(sym) g+=`<text x="10" y="${y}" text-anchor="middle" style="font-size:17px;fill:var(--ink)">${sym}</text>`;
    if(line) g+=`<line x1="4" y1="${y+8}" x2="${xr+4}" y2="${y+8}" style="stroke:var(--ink);stroke-width:1.6"/>`; });
  return g+"</svg>"; };
const MEM = t => `<div class="retenir" data-l="Je me souviens">${t}</div>`;
const AIDE = t => `<p><i><b>Aide :</b> ${t}</i></p>`;
const COMP = [
  ["CALCULER","Je pose une addition, une soustraction et une multiplication de nombres décimaux.","Ex. 1 (3 points)"],
  ["RAISONNER","Je contrôle un résultat avec un ordre de grandeur.","Ex. 2 (1 point)"],
  ["CALCULER","Je multiplie un nombre décimal par 10, 100, 1 000 et par 0,1 ; 0,01 ; 0,001.","Ex. 3 (3 points)"],
  ["MODÉLISER","Je résous un problème en choisissant les bonnes opérations.","Ex. 4 (3 points)"]
];
return {
titre:"Évaluation d'entraînement — Chapitre 8", duree:30, info:"Durée : 30 min · Calculatrice non autorisée",
comp:COMP,
exos:[
{t:"Je pose les opérations", p:3, h:`<p>Pose chaque opération sur ta feuille, puis effectue-la.</p><p>a) 263,4 + 58,75 · b) 90,3 − 7,48 · c) 5,8 × 2,7</p>`,
 c:`<p>Pour a) et b), j'aligne les virgules et je complète par des zéros : 263,40 + 58,75 et 90,30 − 7,48.</p><div class="figs" style="align-items:flex-start">${pose(["263,40","58,75"],"+","322,15")}${pose(["90,30","7,48"],"−","82,82")}</div>
  <p>a) 263,4 + 58,75 = <b>322,15</b> &nbsp;·&nbsp; b) 90,3 − 7,48 = <b>82,82</b></p>
  <p>c) Je multiplie sans les virgules : 58 × 27 = 1 566. Il y a 1 + 1 = 2 chiffres après la virgule dans les facteurs, donc 2 chiffres après la virgule dans le résultat.</p>${mulP([["5,8"],["2,7","×",true],["406"],["1160","+",true],["15,66","",false,true]])}
  <p>5,8 × 2,7 = <b>15,66</b>. Contrôle : 5,8 × 2,7 ≈ 6 × 3 = 18 : c'est cohérent.</p>
  <p><i>1 point par opération juste et bien posée.</i></p>`},
{t:"Une erreur de virgule ?", p:1, h:`<p>Malo a calculé 48,5 × 6,1. Il trouve 29,585.</p><p>Sans poser l'opération, explique à l'aide d'un ordre de grandeur pourquoi son résultat est faux.</p>`,
 c:`<p>48,5 est proche de 50, et 6,1 est proche de 6.</p><p class="calc">48,5 × 6,1 ≈ 50 × 6 = 300</p><p>Le résultat doit donc être proche de 300. Or 29,585 est environ dix fois plus petit : <b>Malo s'est trompé de place pour la virgule</b>. (Le bon résultat est 295,85.)</p>
  <p><i>0,5 point pour l'ordre de grandeur, 0,5 point pour la conclusion.</i></p>`},
{t:"Calcul mental", p:3, h:`<p>Calcule sans poser l'opération.</p><p>a) 0,75 × 10 = …… · b) 4,08 × 1 000 = …… · c) 0,062 × 100 = …… · d) 61,4 × 0,01 = …… · e) 7 × 0,001 = …… · f) 0,5 × 0,1 = ……</p>`,
 c:`<p>a) La virgule se déplace d'1 rang vers la droite : 0,75 × 10 = <b>7,5</b>.</p>
  <p>b) 3 rangs vers la droite, on complète par un zéro : 4,08 × 1 000 = <b>4 080</b>.</p>
  <p>c) 2 rangs vers la droite : 0,062 × 100 = <b>6,2</b>.</p>
  <p>d) 2 rangs vers la gauche : 61,4 × 0,01 = <b>0,614</b>.</p>
  <p>e) 3 rangs vers la gauche, on complète par des zéros : 7 × 0,001 = <b>0,007</b>.</p>
  <p>f) 1 rang vers la gauche : 0,5 × 0,1 = <b>0,05</b>.</p>
  <p><i>0,5 point par calcul.</i></p>`},
{t:"Au marché", p:3, h:`<p>Au marché, Mme Leroy achète 2,5 kg de tomates à 3,40 € le kilo et 3 melons à 2,15 € pièce. Elle paie avec un billet de 20 €.</p><p>Combien la marchande doit-elle lui rendre ? Écris tes calculs et fais une phrase.</p>`,
 c:`<p>Prix des tomates :</p><p class="calc">2,5 × 3,40 = 8,50 €</p><p><i>(1 point)</i></p>
  <p>Prix des melons, puis prix total :</p><p class="calc">3 × 2,15 = 6,45 €<br>8,50 + 6,45 = 14,95 €</p><p><i>(1 point)</i></p>
  <p>Monnaie rendue :</p><p class="calc">20 − 14,95 = 5,05 €</p><p>La marchande doit lui rendre <b>5,05 €</b>. <i>(1 point, avec la phrase)</i></p>`}
],
bep:{
titre:"Évaluation d'entraînement — Chapitre 8 · version aménagée", duree:30, info:"Version aménagée (tiers-temps) · Durée : 30 min · Calculatrice non autorisée",
note:"Le même sujet avec 3 questions en moins, à faire dans le même temps. Le total reste sur 10 points.",
comp:[
  ["CALCULER","Je pose une soustraction et une multiplication de nombres décimaux.","Ex. 1 (3 points)"],
  ["RAISONNER","Je contrôle un résultat avec un ordre de grandeur.","Ex. 2 (1 point)"],
  ["CALCULER","Je multiplie un nombre décimal par 10, 1 000 et par 0,01 ; 0,001.","Ex. 3 (3 points)"],
  ["MODÉLISER","Je résous un problème en choisissant les bonnes opérations.","Ex. 4 (3 points)"]
],
exos:[
{t:"Je pose les opérations", p:3, h:`<p>Pose chaque opération sur ta feuille, puis effectue-la.</p><p>a) 90,3 − 7,48 · b) 5,8 × 2,7</p>`,
 c:`<p>Pour a), j'aligne les virgules et je complète par un zéro : 90,30 − 7,48.</p><div class="figs" style="align-items:flex-start">${pose(["90,30","7,48"],"−","82,82")}</div>
  <p>a) 90,3 − 7,48 = <b>82,82</b></p>
  <p>b) Je multiplie sans les virgules : 58 × 27 = 1 566. Il y a 1 + 1 = 2 chiffres après la virgule dans les facteurs, donc 2 chiffres après la virgule dans le résultat.</p>${mulP([["5,8"],["2,7","×",true],["406"],["1160","+",true],["15,66","",false,true]])}
  <p>5,8 × 2,7 = <b>15,66</b>. Contrôle : 5,8 × 2,7 ≈ 6 × 3 = 18 : c'est cohérent.</p>
  <p><i>1,5 point par opération juste et bien posée.</i></p>`},
{t:"Une erreur de virgule ?", p:1, h:`<p>Malo a calculé 48,5 × 6,1. Il trouve 29,585.</p><p>Sans poser l'opération, explique à l'aide d'un ordre de grandeur pourquoi son résultat est faux.</p>`,
 c:`<p>48,5 est proche de 50, et 6,1 est proche de 6.</p><p class="calc">48,5 × 6,1 ≈ 50 × 6 = 300</p><p>Le résultat doit donc être proche de 300. Or 29,585 est environ dix fois plus petit : <b>Malo s'est trompé de place pour la virgule</b>. (Le bon résultat est 295,85.)</p>
  <p><i>0,5 point pour l'ordre de grandeur, 0,5 point pour la conclusion.</i></p>`},
{t:"Calcul mental", p:3, h:`<p>Calcule sans poser l'opération.</p><p>a) 0,75 × 10 = …… · b) 4,08 × 1 000 = …… · c) 61,4 × 0,01 = …… · d) 7 × 0,001 = ……</p>`,
 c:`<p>a) La virgule se déplace d'1 rang vers la droite : 0,75 × 10 = <b>7,5</b>. <i>(0,5 point)</i></p>
  <p>b) 3 rangs vers la droite, on complète par un zéro : 4,08 × 1 000 = <b>4 080</b>. <i>(1 point)</i></p>
  <p>c) 2 rangs vers la gauche : 61,4 × 0,01 = <b>0,614</b>. <i>(0,5 point)</i></p>
  <p>d) 3 rangs vers la gauche, on complète par des zéros : 7 × 0,001 = <b>0,007</b>. <i>(1 point)</i></p>`},
{t:"Au marché", p:3, h:`<p>Au marché, Mme Leroy achète 2,5 kg de tomates à 3,40 € le kilo et 3 melons à 2,15 € pièce. Elle paie avec un billet de 20 €.</p><p>Combien la marchande doit-elle lui rendre ? Écris tes calculs et fais une phrase.</p>`,
 c:`<p>Prix des tomates :</p><p class="calc">2,5 × 3,40 = 8,50 €</p><p><i>(1 point)</i></p>
  <p>Prix des melons, puis prix total :</p><p class="calc">3 × 2,15 = 6,45 €<br>8,50 + 6,45 = 14,95 €</p><p><i>(1 point)</i></p>
  <p>Monnaie rendue :</p><p class="calc">20 − 14,95 = 5,05 €</p><p>La marchande doit lui rendre <b>5,05 €</b>. <i>(1 point, avec la phrase)</i></p>`}
]}
};
})()
};
})();
