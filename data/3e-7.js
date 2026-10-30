/* 3e — Chapitre 7 : Grandeurs composées (cours « Proportionnalité 1 – Durée et grandeurs composées » et fiche d'exercices de M. Staal)
   La fiche n'a pas de corrigé (sauf pour les deux sujets de brevet) : les corrections sont écrites d'après les méthodes du cours.
   Le document « Proportionnalité 0 – Rappels » (niveau 4e) n'est pas repris ici. */
(function(){
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const rd=(x,k=4)=>Math.round(x*10**k)/10**k;
const N=(x,k=4)=>{ const v=rd(x,k); const [i,d]=String(Math.abs(v)).split("."); return (v<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
/* deux décimales (prix) */
const N2=x=>{ const v=rd(x,2); if(Number.isInteger(v)) return N(v); const [i,d]=v.toFixed(2).split("."); return i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+","+d; };
/* réponses libres : « 9,3 » et « 9,30 », avec ou sans l'unité */
const AL=(x,u="")=>{ const v=rd(x,6), a=[N(v,6)]; if(!Number.isInteger(v) && Number.isInteger(rd(v*10,6))) a.push(v.toFixed(2).replace(".",",")); if(u) a.slice().forEach(s=>a.push(s+" "+u)); return a; };
/* tableau de proportionnalité à deux lignes : [titre, valeurs…] */
const pt=(r1,r2)=>`<div class="scroll"><table class="std"><tbody><tr><th>${r1[0]}</th>${r1.slice(1).map(c=>`<td>${c}</td>`).join("")}</tr><tr><th>${r2[0]}</th>${r2.slice(1).map(c=>`<td>${c}</td>`).join("")}</tr></tbody></table></div>`;
const tab=(head, rows)=>`<div class="scroll"><table class="std"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const hm=m=>`${Math.floor(m/60)} h ${String(m%60).padStart(2,"0")} min`;
window.GC3 = {N, N2, AL, pt, tab, rd, hm};

const T_PROD = tab(["Grandeurs produits","Unités","Formules"],[["Aire (A)","m × m = m² ou cm × cm = cm²","A = L × ℓ (rectangle)"],["Volume (V)","m × m × m = m<sup>3</sup>","V = L × ℓ × h (pavé droit)"],["Énergie (E)","kW × h = kWh<br>(se lit « kilowattheure »)","<b>E = P × t</b><br>P : puissance · t : temps"]]).replace(/ · /g," / ");
const T_QUOT = tab(["Grandeurs quotients","Unités","Formules"],[["Vitesse (V)","km/h ou m/s","<b>V = {d/t}</b><br>d : distance / t : temps"],["Débit (D)","m<sup>3</sup>/h ou L/s","<b>D = {V/t}</b><br>V : volume / t : temps"],["Prix au kilo","€/kg","prix = {prix payé/masse}"],["Consommation d'essence","L/100 km","volume d'essence (en L) consommé pour 100 km"],["Densité de population","hab/km²","densité = {nombre d'habitants/aire}"]]);

/* ===================== schémas ===================== */
const S_DUR = sch("Conversions de durées", `<p class="calc">1 h = 60 min · 1 min = 60 s · 1 h = 3 600 s</p><p class="calc">748 min : 748 ÷ 60 ≈ 12,47 → 12 h pleines<br>12 h = 720 min, donc 748 min = 12 h 28 min</p><p class="schN">Attention : 12,47 h ≠ 12 h 47 min.</p>`.replace("1 h = 60 min · 1 min = 60 s · 1 h = 3 600 s","1 h = 60 min / 1 min = 60 s / 1 h = 3 600 s"));
const S_GC = sch("Grandeurs produits et quotients", `<p class="schN"><b>Produit</b> : on multiplie des grandeurs. Exemple : E = P × t (kW × h = kWh).</p><p class="schN"><b>Quotient</b> : on divise deux grandeurs. Exemples : V = {d/t} (km/h), D = {V/t} (L/s), prix au kilo (€/kg).</p>`);
const S_V = sch("La vitesse", `<p class="calc">V = {d/t} &nbsp; d = V × t &nbsp; t = {d/V}</p>${pt(["Distance (en km)","74,8","?"],["Temps (en h)","1","3"])}<p class="schN">74,8 × 3 = 224,4 km.</p>`);
const S_Q = sch("Prix au kilo, débit, énergie", `<p class="calc">prix au kilo = {prix payé/masse} &nbsp; D = {V/t} &nbsp; E = P × t</p><p class="schN">3,27 € pour 1,8 kg : 3,27 ÷ 1,8 ≈ 1,82 €/kg.</p>`);
const S_CONV = sch("Changer d'unité", `${pt(["Distance (en m)","9,30","D"],["Temps (en s)","1","3 600"])}<p class="calc">D = 9,30 × 3 600<br>D = 33 480 m<br>D = 33,48 km</p><p class="schN">9,30 m/s = 33,48 km/h : en 1 h (3 600 s), on parcourt 3 600 fois plus.</p>`);

CH["3e-7"] = {
intro:"Convertir des durées, reconnaître les grandeurs produits (aire, volume, énergie) et les grandeurs quotients (vitesse, débit, prix au kilo…), et résoudre des problèmes, même avec des changements d'unités.",
savoir:[
  "convertir des durées (heures, minutes, secondes) ;",
  "reconnaître une grandeur produit et une grandeur quotient et connaître leurs unités ;",
  "calculer une vitesse, une distance ou une durée ;",
  "calculer un débit, une énergie, un prix au kilo ;",
  "résoudre un problème avec des grandeurs composées et des conversions d'unités."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Conversion de durées", h:`
  <div class="retenir" data-l="À connaître"><p class="calc">1 h = 60 min<br>1 min = 60 s<br>1 h = 3 600 s</p></div>
  <p><b>Exercice 1 :</b> convertir 18 min en secondes.</p><p>On sait que 1 min = 60 s.</p><p class="calc">18 × 60 = 1 080<br>Donc 18 min = 1 080 s.</p>
  <p><b>Exercice 2 :</b> convertir 3 h 24 min en minutes.</p><p>On sait que 1 h = 60 min.</p><p class="calc">A = 3 h 24 min<br>A = 3 × 60 min + 24 min<br>A = 180 min + 24 min<br>A = 204 min</p>
  <p><b>Exercice 3 :</b> convertir 748 min en heures et minutes.</p><p>On sait que 1 h = 60 min.</p><p class="calc">748 ÷ 60 ≈ 12,47</p><p>Dans 748 min, il y a 12 h pleines.</p>
  <div class="attention"><b>ATTENTION :</b> 12,47 h ≠ 12 h et 47 min !</div>
  <p class="calc">12 h = 12 × 60 = 720 min<br>Donc 748 min = 720 min + 28 min = 12 h 28 min</p>`},
{k:"II", t:"Grandeurs produits et grandeurs quotients", h:`
  <div class="retenir" data-l="Définition"><p>Une <b>grandeur produit</b> est obtenue en multipliant des grandeurs.</p>${T_PROD}</div>
  <p><b>Exemple :</b> un lave-vaisselle de puissance 1 kW qui lave pendant 3 h consomme une énergie de 1 kW × 3 h = 3 kWh.</p>
  <div class="retenir" data-l="Définition"><p>Une <b>grandeur quotient</b> est obtenue en divisant deux grandeurs.</p>${T_QUOT}</div>
  <p><b>Exemple :</b> une voiture qui parcourt 182,6 km en 2 h a une vitesse moyenne de 182,6 ÷ 2 = 91,3 km/h.</p>`},
{k:"III", t:"Problèmes avec des grandeurs composées", h:`
  <p><b>Exercice 1 :</b> le record du monde du 400 m est détenu par Wayde Van Niekerk, avec un temps de 43,03 s. Quelle est sa vitesse moyenne en m/s ? Arrondis au centième.</p>
  <p class="calc">V = {d/t}<br>V = {400/43,03}<br>V ≈ 9,30 m/s</p><p>Sa vitesse moyenne est d'environ <b>9,30 m/s</b>.</p>
  <p><b>Exercice 2 :</b> le son se déplace à la vitesse de 330 m/s. On entend le tonnerre 6 s après avoir vu un éclair. À quelle distance se situe l'orage ? Convertis en kilomètres.</p>
  ${pt(["Distance (en m)","330","D"],["Temps (en s)","1","6"])}
  <p class="calc">D = {330 × 6/1}<br>D = 1 980</p><p>L'orage se situe à <b>1 980 m</b>, soit <b>1,98 km</b>.</p>`},
{k:"IV", t:"Problèmes avec des grandeurs composées et des conversions", h:`
  <div class="retenir" data-l="Méthode"><p>Pour changer d'unité, on utilise un tableau de proportionnalité et les conversions de durées (1 h = 3 600 s, 1 h = 60 min, 1 min = 60 s).</p></div>
  <p><b>Exercice 3 :</b> Wayde Van Niekerk a couru son record du 400 m à une vitesse moyenne d'environ 9,30 m/s. Quelle est sa vitesse en km/h ?</p>
  <p>1 h = 3 600 s.</p>${pt(["Distance (en m)","9,30","D"],["Temps (en s)","1","3 600"])}
  <p class="calc">D = {9,30 × 3 600/1}<br>D = 33 480</p><p>En 1 h, il aurait parcouru 33 480 m, soit 33,48 km.</p><p>Sa vitesse moyenne est donc d'environ <b>33,48 km/h</b>.</p>
  <p><b>Exercice 4 :</b> une voiture a parcouru 189,8 km à une vitesse moyenne de 73 km/h.</p><p><b>a)</b> Combien de temps a-t-elle mis, en minutes ?</p><p><b>b)</b> Quelle durée cela représente-t-il en heures et minutes ?</p>
  <p><b>a)</b> 1 h = 60 min.</p>${pt(["Distance (en km)","73","189,8"],["Temps (en min)","60","T"])}
  <p class="calc">T = {189,8 × 60/73}<br>T = 156 min</p><p><b>b)</b></p><p class="calc">156 min = 2 × 60 min + 36 min = 2 h 36 min</p>
  <p><b>Exercice 5 :</b> un débit est de 24 L/s. Convertis ce débit en L/min.</p><p>1 min = 60 s.</p>${pt(["Volume (en L)","24","V"],["Temps (en s)","1","60"])}
  <p class="calc">V = {24 × 60/1}<br>V = 1 440</p><p>Le débit est de <b>1 440 L/min</b>.</p>
  <p><b>Exercice 6 :</b> un débit est de 21 L/s. Convertis ce débit en m<sup>3</sup>/h.</p><p>1 h = 3 600 s.</p>${pt(["Volume (en L)","21","V"],["Temps (en s)","1","3 600"])}
  <p class="calc">V = {21 × 3 600/1}<br>V = 75 600</p><p>En 1 h, le volume écoulé est de 75 600 L, soit 75,6 m<sup>3</sup>.</p><p>Donc le débit est de <b>75,6 m<sup>3</sup>/h</b>.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Conversions de durées", e:[
  {n:"Activité rapide 1", t:"Conversions de durée", w:"Sur ton cahier", h:`<p><b>À connaître par cœur :</b> 1 h = 60 min / 1 min = 60 s / 1 h = 3 600 s.</p><p>Réponds en indiquant tes calculs.</p><p><b>1)</b> Convertis 8 min en secondes.</p><p><b>2)</b> Convertis 2 h 40 min en minutes.</p><p><b>3)</b> Convertis une journée en secondes.</p>`,
   c:`<p><b>1)</b> 8 × 60 = 480 : 8 min = <b>480 s</b>.</p><p><b>2)</b></p><p class="calc">t = 2 × 60 + 40<br>t = 120 + 40<br>t = 160 min</p><p>2 h 40 min = <b>160 min</b>.</p><p><b>3)</b> 1 journée = 24 h et 24 × 3 600 = 86 400 : une journée = <b>86 400 s</b>.</p>`}
 ]},
{t:"Grandeurs composées", e:[
  {n:"Activité 1", t:"Grandeurs composées", w:"Sur ton cahier", h:`<p><b>La vitesse moyenne en km/h</b></p><p><b>Problème 1 :</b> une voiture roule à une vitesse moyenne de 74,8 km/h. En 3 h, combien de kilomètres a-t-elle parcourus ?</p><p><b>Problème 2 :</b> une voiture a roulé 2 h et a parcouru 182,6 km. Quelle a été sa vitesse moyenne en km/h ?</p>
   <p><b>L'énergie en kWh (se lit « le kilowattheure »)</b></p><p><b>Problème 3 :</b> mon lave-vaisselle consomme une énergie de 3 kWh à chaque lavage.</p><p><i>Explication : mon lave-vaisselle a une puissance de 1 kW et il lave pendant 3 h. On dit qu'il consomme une énergie de 3 kWh, car 1 kW × 3 h = 3 kWh.</i></p><p>Cette semaine, j'ai mis en route mon lave-vaisselle 4 fois. Combien d'énergie ai-je consommée en kWh ?</p>`,
   c:`<p><b>Problème 1 :</b></p>${pt(["Distance (en km)","74,8","?"],["Temps (en h)","1","3"])}<p class="calc">74,8 × 3 = 224,4</p><p>Elle a parcouru <b>224,4 km</b>.</p><p><b>Problème 2 :</b> 182,6 ÷ 2 = 91,3. Sa vitesse moyenne a été de <b>91,3 km/h</b>.</p><p><b>Problème 3 :</b> 4 × 3 = 12. J'ai consommé <b>12 kWh</b>.</p>`},
  {n:"Exercice 1", t:"La vitesse moyenne en km/h", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> avec son camion, un routier a parcouru 386 km en 4 h. Quelle a été sa vitesse moyenne en km/h ?</p><p><b>Problème 2 :</b> un automobiliste a roulé à une vitesse moyenne de 78,4 km/h et a parcouru 392 km. Combien d'heures a-t-il roulé ?</p>`,
   c:`<p><b>Problème 1 :</b></p><p class="calc">V = {d/t}<br>V = {386/4}<br>V = 96,5</p><p>Sa vitesse moyenne a été de <b>96,5 km/h</b>.</p><p><b>Problème 2 :</b></p><p class="calc">t = {d/V}<br>t = {392/78,4}<br>t = 5</p><p>Il a roulé <b>5 h</b>.</p>`},
  {n:"Exercice 2", t:"Le prix au kilo en €/kg", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> au supermarché, j'ai acheté 1,8 kg de poires et j'ai payé 3,27 €. Quel est le prix au kilo des poires ?</p><p><b>Problème 2 :</b> au supermarché, les courgettes sont à 2,41 €/kg. J'achète 3,7 kg de courgettes. Combien vais-je payer ?</p>`,
   c:`<p><b>Problème 1 :</b> 3,27 ÷ 1,8 ≈ 1,82. Les poires coûtent environ <b>1,82 €/kg</b>.</p><p><b>Problème 2 :</b> 2,41 × 3,7 = 8,917. Je vais payer environ <b>8,92 €</b>.</p>`},
  {n:"Exercice 3", t:"Vitesse moyenne du champion de France du 100 m", w:"Sur ton cahier", h:`<p>En 2020, en athlétisme, le champion de France du 100 m est Mouhamadou Fall. Il s'impose avec un temps de 10,16 s.</p><p>Calcule sa vitesse en m/s.</p>`,
   c:`<p class="calc">V = {d/t}<br>V = {100/10,16}<br>V ≈ 9,84</p><p>Sa vitesse moyenne est d'environ <b>9,84 m/s</b> (arrondi au centième).</p>`},
  {n:"Exercice 4", t:"Le débit moyen", w:"Sur ton cahier", h:`<p>Le barrage de Bort-les-Orgues, sur la Dordogne, a une retenue d'eau d'environ 477 000 000 m<sup>3</sup>.</p><p>La Dordogne y déverse toute son eau avec un débit moyen de 23 m<sup>3</sup>/s.</p><p>Calcule la durée de remplissage de ce barrage :</p><p><b>a)</b> en secondes (arrondi à l'unité) ;</p><p><b>b)</b> en heures (arrondi à l'unité) ;</p><p><b>c)</b> en jours (arrondi à l'unité).</p>`,
   c:`<p><b>a)</b> D = {V/t}, donc :</p><p class="calc">t = {V/D}<br>t = {477 000 000/23}<br>t ≈ <b>20 739 130 s</b></p><p><b>b)</b> 1 h = 3 600 s : 20 739 130 ÷ 3 600 ≈ <b>5 761 h</b>.</p><p><b>c)</b> 1 jour = 24 h : 5 760,87 ÷ 24 ≈ <b>240 jours</b>.</p>`},
  {n:"Exercice 5", t:"Orage et vitesse du son", w:"Sur ton cahier", h:`<p>Le son se déplace à la vitesse de 330 m/s.</p><p>On entend le tonnerre 6 s après avoir vu un éclair. À quelle distance se situe l'orage ? Convertis en kilomètres.</p>`,
   c:`${pt(["Distance (en m)","330","D"],["Temps (en s)","1","6"])}<p class="calc">D = 330 × 6<br>D = 1 980</p><p>L'orage se situe à <b>1 980 m</b>, soit <b>1,98 km</b>.</p>`}
 ]},
{t:"Sujets de brevet", e:[
  {n:"Brevet 1", t:"Les 24 heures du Mans (Polynésie, juin 2015)", w:"Sur ton cahier", h:`<p>Les « 24 heures du Mans » est le nom d'une course automobile.</p>
   ${tab(["Document","Contenu"],[["1 : principe de la course","Les voitures tournent sur un circuit pendant 24 heures. La voiture gagnante est celle qui a parcouru la plus grande distance."],["2 : le circuit","La longueur d'un tour est de 13,629 km."],["3 : article extrait d'un journal","« 5 405,470 : c'est le nombre de kilomètres parcourus par l'Audi R15+ à l'issue de la course. »"],["4 : unités anglo-saxonnes","L'unité de mesure utilisée par les Anglo-Saxons est le mile par heure (mile per hour), noté mph. 1 mile ≈ 1 609 mètres."]])}
   <p>À l'aide des documents fournis :</p><p><b>1)</b> Détermine le nombre de tours complets que la voiture Audi R15+ a effectués lors de cette course.</p><p><b>2)</b> Calcule la vitesse moyenne en km/h de cette voiture. Arrondis à l'unité.</p><p><b>3)</b> On relève la vitesse de deux voitures au même moment : voiture n° 37 : 205 mph ; voiture n° 38 : 310 km/h. Quelle est la voiture la plus rapide ?</p>`,
   c:`<p><b>1)</b> {5 405,470/13,629} ≈ 396,6. Elle a donc effectué <b>396 tours complets</b>.</p><p><b>2)</b> {5 405,470/24} ≈ 225. Sa vitesse moyenne est d'environ <b>225 km/h</b>.</p><p><b>3)</b> 1 mile ≈ 1,609 km, donc 205 mph ≈ 205 × 1,609 km/h, soit 329,845 km/h.</p><p>329,845 km/h &gt; 310 km/h : la voiture la plus rapide est la <b>n° 37</b>.</p>`},
  {n:"Brevet 2", t:"Essence ou diesel ? (Polynésie, juin 2016)", w:"Sur ton cahier", h:`<p>M. Durand doit changer de voiture. Il choisit un modèle PRIMA qui existe en deux versions : ESSENCE ou DIESEL. Il dispose des informations suivantes :</p>
   ${tab(["Modèle PRIMA","Version ESSENCE","Version DIESEL"],[["Consommation moyenne","6,2 L pour 100 km","5,2 L pour 100 km"],["Type de moteur","essence","diesel"],["Carburant","SP 95","gazole"],["Prix d'achat","21 550 €","23 950 €"]])}
   <p><b>Estimation du prix des carburants par M. Durand en 2015 :</b> un litre de SP 95 coûte 1,415 € ; un litre de gazole coûte 1,224 €.</p>
   <p>Durant les dernières années, M. Durand a parcouru en moyenne 22 300 km par an. Pour choisir entre les deux modèles, il décide de réaliser le tableau comparatif ci-dessous, établi pour 22 300 km parcourus en un an.</p>
   ${tab(["","Version ESSENCE","Version DIESEL"],[["Consommation de carburant (en L)","1 383",""],["Budget de carburant (en €)","1 957",""]])}
   <p><b>1)</b> Recopie et complète le tableau en écrivant les calculs effectués.</p><p><b>2)</b> M. Durand choisit finalement la version DIESEL. Il parcourt 22 300 km tous les ans et le prix du carburant ne varie pas. Dans combien d'années l'économie réalisée sur le carburant compensera-t-elle la différence de prix d'achat entre les deux versions ?</p>`,
   c:`<p><b>1) Version essence :</b></p>${pt(["Quantité d'essence (en L)","6,2","?"],["Distance (en km)","100","22 300"])}<p class="calc">6,2 × 22 300 ÷ 100 = 1 382,6</p><p>Avec la voiture essence, il consommera 1 382,6 L d'essence en 1 an.</p><p class="calc">1 382,6 × 1,415 ≈ 1 956,38</p><p>Son budget sera de 1 956,38 € (environ 1 957 €).</p>
   <p><b>Version diesel :</b> 22 300 = 223 × 100, donc la consommation est 223 × 5,2 = 1 159,6 L de gazole en 1 an.</p><p class="calc">1 159,6 × 1,224 ≈ 1 419,35</p><p>Son budget sera de <b>1 419,35 €</b> (environ 1 419 €).</p><p><b>Le tableau complété</b> (arrondis à l'unité, comme dans l'énoncé) :</p>${tab(["","Version ESSENCE","Version DIESEL"],[["Consommation de carburant (en L)","1 383<br><small>6,2 × 22 300 ÷ 100</small>","1 160<br><small>5,2 × 22 300 ÷ 100</small>"],["Budget de carburant (en €)","1 957<br><small>1 382,6 × 1,415</small>","1 419<br><small>1 159,6 × 1,224</small>"]])}
   <p><b>2)</b> 1 956,38 − 1 419,35 = 537,03 : chaque année, M. Durand économisera 537,03 € de carburant.</p><p>23 950 − 21 550 = 2 400 : la différence de prix d'achat entre les deux véhicules est de 2 400 €.</p><p class="calc">2 400 ÷ 537,03 ≈ 4,5</p><p>La différence de prix sera donc compensée <b>au cours de la 5<sup>e</sup> année</b>.</p>`}
 ]},
{t:"Grandeurs composées et conversions", e:[
  {n:"Activité rapide 2", t:"Conversions de durée", w:"Sur ton cahier", h:`<p><b>a)</b> 845 min représentent combien d'heures ? Donne un arrondi à l'unité.</p><p><b>b)</b> Convertis 845 min en heures et minutes.</p>`,
   c:`<p><b>a)</b> 845 ÷ 60 ≈ 14,08 : 845 min représentent environ <b>14 h</b>.</p><p><b>b)</b> 14 h = 14 × 60 = 840 min, donc 845 min = 840 min + 5 min = <b>14 h 05 min</b>.</p>`},
  {n:"Activité 2", t:"Grandeurs composées et conversions", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> un ballon d'eau chaude de 300 L se vide en 20 min. Quel est le débit en L/s ?</p><p><b>Problème 2 :</b> un cycliste débutant a une vitesse moyenne de 5,3 m/s. Quelle est sa vitesse moyenne en km/h ?</p>`,
   c:`<p><b>Problème 1 :</b> 20 min = 20 × 60 = 1 200 s.</p>${pt(["Volume (en L)","300","D"],["Temps (en s)","1 200","1"])}<p class="calc">D = 300 ÷ 1 200<br>D = 0,25</p><p>Le débit est de <b>0,25 L/s</b>.</p>
   <p><b>Problème 2 :</b> 1 h = 3 600 s.</p>${pt(["Distance (en m)","5,3","D"],["Temps (en s)","1","3 600"])}<p class="calc">D = 5,3 × 3 600<br>D = 19 080</p><p>En 1 h, il parcourt 19 080 m, soit 19,08 km : sa vitesse est de <b>19,08 km/h</b>.</p>`},
  {n:"Exercice 6", t:"En voiture", w:"Sur ton cahier", h:`<p>Un conducteur met en moyenne 1 s avant de commencer à freiner quand il voit un obstacle.</p><p>Calcule la distance parcourue, en m, pendant ce temps de réaction s'il roule à 90 km/h.</p>`,
   c:`<p>90 km = 90 000 m et 1 h = 3 600 s.</p>${pt(["Distance (en m)","90 000","D"],["Temps (en s)","3 600","1"])}<p class="calc">D = 90 000 ÷ 3 600<br>D = 25</p><p>Pendant son temps de réaction, il parcourt <b>25 m</b>.</p>`},
  {n:"Exercice 7", t:"La passerelle des Deux Rives", w:"Sur ton cahier", h:`<p>La passerelle des Deux Rives, à Strasbourg, est un pont piétonnier qui relie la France et l'Allemagne.</p><p>Sous ce pont, le Rhin a un débit de 2 000 m<sup>3</sup>/s.</p><p>Tom traverse le pont en 5 min. Combien de litres d'eau sont passés sous la passerelle pendant ce temps ?</p>`,
   c:`<p>5 min = 5 × 60 = 300 s.</p><p class="calc">2 000 × 300 = 600 000</p><p>600 000 m<sup>3</sup> d'eau sont passés. Or 1 m<sup>3</sup> = 1 000 L : cela fait <b>600 000 000 L</b>.</p>`},
  {n:"Exercice 8", t:"Vitesse d'un coureur", w:"Sur ton cahier", h:`<p>Un coureur a une vitesse moyenne de 10 km/h.</p><p>Quelle est sa vitesse moyenne en m/s ? Arrondis au centième.</p>`,
   c:`<p>10 km = 10 000 m et 1 h = 3 600 s.</p><p class="calc">10 000 ÷ 3 600 ≈ 2,78</p><p>Sa vitesse moyenne est d'environ <b>2,78 m/s</b>.</p>`},
  {n:"Exercice 9", t:"Débit moyen d'un robinet de baignoire", w:"Sur ton cahier", h:`<p>Le débit moyen d'un robinet de baignoire est de 0,2 L/s.</p><p>Transforme ce débit :</p><p><b>a)</b> en L/min ;</p><p><b>b)</b> en L/h ;</p><p><b>c)</b> en m<sup>3</sup>/h.</p>`,
   c:`<p><b>a)</b> 1 min = 60 s : 0,2 × 60 = 12. Le débit est de <b>12 L/min</b>.</p><p><b>b)</b> 1 h = 3 600 s : 0,2 × 3 600 = 720. Le débit est de <b>720 L/h</b>.</p><p><b>c)</b> 720 L = 0,72 m<sup>3</sup>. Le débit est de <b>0,72 m<sup>3</sup>/h</b>.</p>`},
  {n:"Exercice 10", t:"Vitesse d'un marcheur", w:"Sur ton cahier", h:`<p>Un randonneur a parcouru 5 km en 1 h 20 min.</p><p>Calcule sa vitesse moyenne en km/h.</p>`,
   c:`<p>1 h 20 min = 60 min + 20 min = 80 min.</p>${pt(["Distance (en km)","5","D"],["Temps (en min)","80","60"])}<p class="calc">D = {5 × 60/80}<br>D = 3,75</p><p>Sa vitesse moyenne est de <b>3,75 km/h</b>.</p>`},
  {n:"Exercice supplémentaire", t:"Un chargeur branché pour rien", w:"Sur ton cahier", h:`<p>Un chargeur de smartphone branché sur une prise, mais non connecté à un smartphone, développe une puissance de 0,26 W.</p><p><b>a)</b> Calcule l'énergie ainsi consommée en une journée complète, en Wh.</p><p><b>b)</b> De même, calcule l'énergie consommée en une année de 365 jours. Convertis en kWh.</p>`,
   c:`<p><b>a)</b></p><p class="calc">E = P × t<br>E = 0,26 W × 24 h<br>E = <b>6,24 Wh</b></p><p><b>b)</b> 6,24 × 365 = 2 277,6 Wh. Or 1 kWh = 1 000 Wh : cela fait <b>2,2776 kWh</b>, soit environ 2,28 kWh.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Conversions de durées", schema:S_DUR, q:{
 1:[ {g:()=>{ const m=ri(2,45); return {q:`Convertis ${m} min en secondes.`, rep:[String(m*60), m*60+" s"], ex:`1 min = 60 s : ${m} × 60 = ${N(m*60)} s.`, sx:S_DUR}; }},
     {g:()=>{ const h=ri(2,9); return {q:`Convertis ${h} h en secondes.`, rep:[String(h*3600), h*3600+" s"], ex:`1 h = 3 600 s : ${h} × 3 600 = ${N(h*3600)} s.`, sx:S_DUR}; }} ],
 2:[ {g:()=>{ const h=ri(1,9), m=ri(5,55); return {q:`Convertis ${h} h ${m} min en minutes.`, rep:[String(h*60+m), h*60+m+" min"], ex:`<br>t = ${h} × 60 min + ${m} min<br>t = ${h*60} min + ${m} min<br>t = ${h*60+m} min`, sx:S_DUR}; }} ],
 3:[ {g:()=>{ const h=ri(2,14), m=ri(1,59), M=h*60+m; return {q:`Convertis ${N(M)} min en heures et minutes.`, t:"□ h □ min", r:[String(h),[String(m),String(m).padStart(2,"0")]], ex:`${N(M)} ÷ 60 ${Math.abs(M/60-rd(M/60,2))>1e-9?"≈":"="} ${N(M/60,2)} : ${h} h pleines. ${h} h = ${h*60} min et ${N(M)} − ${h*60} = ${m} : ${N(M)} min = ${h} h ${m} min.`, sx:S_DUR}; }},
     {g:()=>{ let h,m; do{ h=ri(2,14); m=ri(11,59); }while(String(Math.round(m/60*100)).length<2 || Math.round(m/60*100)===m); const M=h*60+m, dec=rd(M/60,2);
       return {q:`${N(M)} ÷ 60 ${Math.abs(M/60-dec)>1e-9?"≈":"="} ${N(dec)}. Donc ${N(M)} min = …`, c:uniq(`${h} h ${String(m).padStart(2,"0")} min`,[`${h} h ${String(Math.round(m/60*100)).padStart(2,"0")} min`,`${N(dec)} min`]), rep:`${h} h ${String(m).padStart(2,"0")} min`, ex:`${N(dec)} h ≠ ${h} h ${Math.round(m/60*100)} min ! ${h} h = ${h*60} min, et ${N(M)} − ${h*60} = ${m} min.`, sx:S_DUR}; }} ]
}},
{nom:"Grandeurs produits et quotients", schema:S_GC, q:{
 1:[ {g:()=>{ const L=[["une vitesse","km/h"],["un débit","L/s"],["une énergie","kWh"],["un prix au kilo","€/kg"],["une densité de population","hab/km²"],["une aire","m²"]], [g,u]=pick(L); return {q:`Quelle unité peut servir à mesurer ${g} ?`, c:L.map(x=>x[1]).filter(x=>x!==u).slice(0,3).concat([u]), rep:u, ex:`${g[0].toUpperCase()+g.slice(1)} se mesure par exemple en ${u}.`, sx:S_GC}; }} ],
 2:[ {g:()=>{ const L=[["une vitesse (km/h)","grandeur quotient","V = d ÷ t"],["un débit (L/s)","grandeur quotient","D = V ÷ t"],["un prix au kilo (€/kg)","grandeur quotient","on divise un prix par une masse"],["une densité de population (hab/km²)","grandeur quotient","on divise un nombre d'habitants par une aire"],["une énergie (kWh)","grandeur produit","E = P × t"],["une aire (m²)","grandeur produit","m × m = m²"],["un volume (m³)","grandeur produit","m × m × m = m³"]], [g,r,e]=pick(L); return {q:`${g[0].toUpperCase()+g.slice(1)} est…`, c:["une grandeur produit","une grandeur quotient"], rep:"une "+r, ex:`Une ${r} : ${e}.`, sx:S_GC}; }} ],
 3:[ {g:()=>{ const p=pick([0.5,1,1.5,2,2.5,3]), t=ri(2,8); return {q:`Un appareil de puissance ${N(p)} kW fonctionne pendant ${t} h. Quelle énergie consomme-t-il (en kWh) ?`, rep:AL(p*t,"kWh"), ex:`<br>E = P × t<br>E = ${N(p)} × ${t}<br>E = ${N(p*t)} kWh`, sx:S_GC}; }} ]
}},
{nom:"La vitesse", schema:S_V, q:{
 1:[ {g:()=>{ const t=ri(2,5), v=ri(30,95)+pick([0,0.5]), d=v*t; return {q:`Une voiture a parcouru ${N(d)} km en ${t} h. Quelle est sa vitesse moyenne (en km/h) ?`, rep:AL(v,"km/h"), ex:`<br>V = {d/t}<br>V = ${N(d)} ÷ ${t}<br>V = ${N(v)} km/h`, sx:S_V}; }} ],
 2:[ {g:()=>{ const v=ri(500,950)/10, t=ri(2,5); return {q:`Une voiture roule à ${N(v)} km/h pendant ${t} h. Quelle distance parcourt-elle (en km) ?`, rep:AL(v*t,"km"), ex:`<br>d = V × t<br>d = ${N(v)} × ${t}<br>d = ${N(rd(v*t,2))} km`, sx:S_V}; }} ],
 3:[ {g:()=>{ const v=ri(600,900)/10, t=ri(2,6), d=rd(v*t,2); return {q:`Un automobiliste roule à ${N(v)} km/h et parcourt ${N(d)} km. Combien d'heures a-t-il roulé ?`, rep:[String(t), t+" h"], ex:`<br>t = {d/V}<br>t = ${N(d)} ÷ ${N(v)}<br>t = ${t} h`, sx:S_V}; }},
     {g:()=>{ const v=ri(50,95), T=6*ri(15,45), d=rd(v*T/60,2); return {q:`Une voiture parcourt ${N(d)} km à ${v} km/h. Combien de temps met-elle, en minutes ?`, rep:[String(T), T+" min"], ex:`${pt(["Distance (en km)",String(v),N(d)],["Temps (en min)","60","T"])}T = ${N(d)} × 60 ÷ ${v}<br>T = ${T} min (${hm(T)}).`, sx:S_V}; }} ]
}},
{nom:"Prix au kilo, débit, énergie", schema:S_Q, q:{
 1:[ {g:()=>{ const p=ri(120,490)/100, m=ri(2,6); return {q:`Les courgettes sont à ${N2(p)} €/kg. Combien coûtent ${m} kg de courgettes (en €) ?`, rep:AL(rd(p*m,2),"€"), ex:`${N2(p)} × ${m} = ${N2(p*m)} €.`, sx:S_Q}; }} ],
 2:[ {g:()=>{ let m,P; do{ m=ri(11,39)/10; P=ri(150,900)/100; }while(Math.abs(P/m*100-Math.round(P/m*100))<0.01 || Math.abs((P/m*100)%1-0.5)<0.02); const r=rd(P/m,2); return {q:`J'ai acheté ${N(m)} kg de poires et j'ai payé ${N2(P)} €. Quel est le prix au kilo, arrondi au centime (en €/kg) ?`, rep:AL(r,"€/kg"), ex:`${N2(P)} ÷ ${N(m)} ≈ ${N2(r)} €/kg.`, sx:S_Q}; }} ],
 3:[ {g:()=>{ const D=pick([0.2,0.25,0.4,0.5,0.75,1.5,2]), t=ri(5,30), V=rd(D*t*60,2); return {q:`Un ballon d'eau chaude de ${N(V)} L se vide en ${t} min. Quel est le débit (en L/s) ?`, rep:AL(D,"L/s"), ex:`${t} min = ${N(t*60)} s.<br>D = {V/t}<br>D = ${N(V)} ÷ ${N(t*60)}<br>D = ${N(D)} L/s`, sx:S_Q}; }} ]
}},
{nom:"Grandeurs composées et conversions", schema:S_CONV, q:{
 1:[ {g:()=>{ const v=pick([2,3,4,5,6,8,10,12,15,20,25,30]); return {q:`Un mobile se déplace à ${v} m/s. Quelle est sa vitesse en km/h ?`, rep:AL(v*3.6,"km/h"), ex:`En 1 h = 3 600 s : ${v} × 3 600 = ${N(v*3600)} m = ${N(v*3.6)} km. Donc ${N(v*3.6)} km/h.`, sx:S_CONV}; }},
     {g:()=>{ const D=ri(2,40); return {q:`Un débit est de ${D} L/s. Convertis-le en L/min.`, rep:AL(D*60,"L/min"), ex:`1 min = 60 s : ${D} × 60 = ${N(D*60)} L/min.`, sx:S_CONV}; }} ],
 2:[ {g:()=>{ const v=pick([18,36,54,72,90,108,126,144]); return {q:`Une voiture roule à ${v} km/h. Quelle distance parcourt-elle en 1 s (en m) ?`, rep:AL(v/3.6,"m"), ex:`${v} km = ${N(v*1000)} m et 1 h = 3 600 s : ${N(v*1000)} ÷ 3 600 = ${N(v/3.6)} m.`, sx:S_CONV}; }} ],
 3:[ {g:()=>{ const D=ri(2,60)/2; return {q:`Un débit est de ${N(D)} L/s. Convertis-le en m<sup>3</sup>/h.`, rep:AL(rd(D*3.6,4),"m³/h"), ex:`En 1 h = 3 600 s : ${N(D)} × 3 600 = ${N(D*3600)} L = ${N(D*3.6)} m<sup>3</sup>. Donc ${N(D*3.6)} m<sup>3</sup>/h.`, sx:S_CONV}; }},
     {g:()=>{ const v=pick([5,8,10,12,15,20,25]); let r=rd(v/3.6,2); return {q:`Un coureur a une vitesse de ${v} km/h. Quelle est sa vitesse en m/s, arrondie au centième ?`, rep:AL(r,"m/s"), ex:`${N(v*1000)} m en 3 600 s : ${N(v*1000)} ÷ 3 600 ≈ ${N(r)} m/s.`, sx:S_CONV}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 7", duree:50, info:"Durée : 50 min · Calculatrice autorisée · Écris tes calculs et une phrase de réponse.",
comp:[
  ["CALCULER","Je convertis des durées.","Ex. 1 (3 points)"],
  ["CONNAÎTRE","Je reconnais une grandeur produit ou quotient et son unité.","Ex. 2 (3 points)"],
  ["MODÉLISER","Je calcule une vitesse, une distance, une durée, un prix au kilo.","Ex. 3 et 4 (8 points)"],
  ["RAISONNER","Je résous un problème de débit ou d'énergie avec des conversions.","Ex. 5 et 6 (6 points)"]
],
exos:[
{t:"Conversions de durées", p:3, h:`<p><b>1)</b> Convertis 14 min en secondes.</p><p><b>2)</b> Convertis 3 h 15 min en minutes.</p><p><b>3)</b> Convertis 500 min en heures et minutes.</p>`,
 c:`<p><b>1)</b> 14 × 60 = <b>840 s</b>. <i>(1 point)</i></p><p><b>2)</b></p><p class="calc">t = 3 × 60 + 15<br>t = 180 + 15<br>t = <b>195 min</b></p><p><i>(1 point)</i></p><p><b>3)</b> 500 ÷ 60 ≈ 8,33 : 8 h pleines. 8 h = 480 min et 500 − 480 = 20 : 500 min = <b>8 h 20 min</b>. <i>(1 point)</i></p>`},
{t:"QCM : grandeurs composées", p:3, h:`<p>Pour chaque question, une seule réponse est exacte. Écris le numéro de la question et la lettre de la bonne réponse.</p>${tab(["Question","A","B","C"],[["<b>1)</b> Un débit peut s'exprimer en :","km/h","m<sup>3</sup>/s","kWh"],["<b>2)</b> Une grandeur produit est :","une vitesse","un prix au kilo","une énergie"],["<b>3)</b> Une densité de population s'exprime en :","hab/km²","km²/hab","hab × km²"]])}`,
 c:`<p><b>1)</b> B · <b>2)</b> C (E = P × t) · <b>3)</b> A</p><p><i>(1 point par bonne réponse)</i></p>`},
{t:"Le TGV", p:5, h:`<p>Un TGV parcourt 450 km en 1 h 30 min.</p><p><b>1)</b> Calcule sa vitesse moyenne en km/h.</p><p><b>2)</b> Convertis cette vitesse en m/s. Arrondis au centième.</p><p><b>3)</b> À cette vitesse, quelle distance le TGV parcourt-il en 20 min ?</p>`,
 c:`<p><b>1)</b> 1 h 30 min = 1,5 h.</p><p class="calc">V = {d/t}<br>V = {450/1,5}<br>V = <b>300 km/h</b></p><p><i>(2 points)</i></p><p><b>2)</b> 300 km = 300 000 m et 1 h = 3 600 s : 300 000 ÷ 3 600 ≈ <b>83,33 m/s</b>. <i>(1,5 point)</i></p><p><b>3)</b> 20 min = {1/3} h : 300 × 20 ÷ 60 = <b>100 km</b>. <i>(1,5 point)</i></p>`},
{t:"Au marché", p:3, h:`<p>Léna a acheté 2,4 kg de pommes et a payé 5,52 €.</p><p><b>1)</b> Quel est le prix au kilo des pommes ?</p><p><b>2)</b> Combien paierait-elle pour 3,5 kg de ces pommes ?</p>`,
 c:`<p><b>1)</b> 5,52 ÷ 2,4 = <b>2,30 €/kg</b>. <i>(1,5 point)</i></p><p><b>2)</b> 2,30 × 3,5 = <b>8,05 €</b>. <i>(1,5 point)</i></p>`},
{t:"Le bain", p:3, h:`<p>Une baignoire de 180 L se remplit avec un robinet de débit 0,25 L/s.</p><p><b>1)</b> Combien de temps faut-il pour la remplir ? Donne la réponse en secondes, puis en minutes.</p><p><b>2)</b> Convertis le débit du robinet en m<sup>3</sup>/h.</p>`,
 c:`<p><b>1)</b></p><p class="calc">t = {V/D}<br>t = {180/0,25}<br>t = 720 s</p><p>720 ÷ 60 = 12, donc t = <b>12 min</b>. <i>(1,5 point)</i></p><p><b>2)</b> En 1 h = 3 600 s : 0,25 × 3 600 = 900 L = 0,9 m<sup>3</sup>. Le débit est de <b>0,9 m<sup>3</sup>/h</b>. <i>(1,5 point)</i></p>`},
{t:"Le radiateur", p:3, h:`<p>Un radiateur électrique de puissance 1,5 kW fonctionne 6 h par jour.</p><p><b>1)</b> Quelle énergie consomme-t-il en une journée, en kWh ?</p><p><b>2)</b> Et en 30 jours ?</p><p><b>3)</b> Le kWh coûte 0,25 €. Combien coûte son fonctionnement pendant ces 30 jours ?</p>`,
 c:`<p><b>1)</b></p><p class="calc">E = P × t<br>E = 1,5 × 6<br>E = <b>9 kWh</b></p><p><i>(1 point)</i></p><p><b>2)</b> 9 × 30 = <b>270 kWh</b>. <i>(1 point)</i></p><p><b>3)</b> 270 × 0,25 = <b>67,50 €</b>. <i>(1 point)</i></p>`}
]}
};
})();
