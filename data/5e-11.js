/* 5e — Chapitre 11 : Proportionnalité et pourcentages (cours, fiche d'exercices et corrigé de M. Staal) */
(function(){
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const r3 = x => Math.round(x*1000)/1000;
const F = x => { const r=r3(x); const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const F2 = x => { const s=F(Math.round(x*100)/100); return s.includes(",")&&s.split(",")[1].length===1 ? s+"0" : s; };   /* prix : 1,30 */
const Q = (a,b) => `{${a}/${b}}`;
/* calcul en chaîne (choix de M. Staal) : une étape par ligne, chaque ligne commence par le nom de la grandeur ; « ≈ … » pour une valeur arrondie */
const KCl = (n, L) => L.map(String).filter((x,i,a)=>i===0||x!==a[i-1]).map(x=>/^≈/.test(String(x))?`${n} ${x}`:`${n} = ${x}`).join("<br>");
const KC = (n, L) => `<p class="calc">${KCl(n,L)}</p>`;
const KCi = (n, L) => `<span class="calc" style="display:block;margin:6px 0">${KCl(n,L)}</span>`;
const gcd = (a,b) => b ? gcd(b, a%b) : a;
const qt = (y,x) => { const q=y/x; return Math.abs(r3(q)-q)<1e-9 ? "= "+F(q) : "≈ "+F(Math.round(q*100)/100); };
/* tableau à deux lignes : en-têtes en gras dans la première colonne */
const T2 = (h1, r1, h2, r2, extra) => `<div class="scroll"><table class="std"><tbody><tr><th>${h1}</th>${r1.map(v=>`<td>${v}</td>`).join("")}</tr><tr><th>${h2}</th>${r2.map(v=>`<td>${v}</td>`).join("")}</tr>${extra?`<tr><th>${extra[0]}</th>${extra[1].map(v=>`<td>${v}</td>`).join("")}</tr>`:""}</tbody></table></div>`;
const TB = (head, rows) => `<div class="scroll"><table class="std"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;
window.PROP = {F, F2, Q, gcd, T2, TB, r3, KC};

/* ===================== schémas ===================== */
const S_REC = sch("Reconnaître la proportionnalité", T2("Masse (kg)",["1","3","5"],"Prix (€)",["2,40","7,20","12"],["Prix ÷ masse",["2,4","2,4","2,4"]])+`<p class="schN">Tous les quotients sont égaux : c'est un tableau de proportionnalité, de coefficient 2,4. Un seul quotient différent suffit pour dire « non ».</p>`);
const S_COEF = sch("Le coefficient de proportionnalité", `<p class="calc">× 2,4 : 1 kg → 2,40 € &nbsp;&nbsp; 3 kg → 7,20 €</p><p class="schN">Prix unitaire, vitesse (60 km en 1 h), échelle (1 cm pour 500 m) : on multiplie par le coefficient, ou on divise dans l'autre sens.</p>`);
const S_LIN = sch("Linéarité et retour à l'unité", `<p class="calc">4 pers. → 250 g &nbsp; 2 pers. → 250 ÷ 2 = 125 g &nbsp; 6 pers. → 250 + 125 = 375 g</p><p class="calc">5 stylos → 6,50 € &nbsp; 1 stylo → 6,50 ÷ 5 = 1,30 € &nbsp; 8 stylos → 8 × 1,30 = 10,40 €</p>`);
const S_PROP = sch("Proportion et pourcentage", `<p class="calc">p = ${Q(12,30)}<br>p = ${Q(2,5)}<br>p = 0,4<br>p = ${Q(40,100)}<br>p = 40 %</p><p class="schN">Proportion = quantité ÷ total. Un pourcentage est une proportion sur 100. Pour comparer des proportions, on les écrit en pourcentages.</p>`);
const S_PCT = sch("Prendre un pourcentage", `<p class="calc">${"<i>t</i>"} % de Q = Q × ${Q("t",100)}</p><p class="calc">15 % de 60 :<br>P = 60 × ${Q(15,100)}<br>P = 9</p><p class="schN">50 % : la moitié · 25 % : le quart · 10 % : je divise par 10 · 1 % : je divise par 100.</p>`);

/* ===================== données de la fiche ===================== */
const E1 = [
  ["2 | 3 | 5 en première ligne et 5 | 7,5 | 12,5 en seconde ligne", true, `les quotients valent tous 2,5 : coefficient 2,5.`],
  ["4 | 6 | 10 en première ligne et 10 | 15 | 30 en seconde ligne", false, `${Q(10,4)} = 2,5 et ${Q(15,6)} = 2,5, mais ${Q(30,10)} = 3.`],
  ["Le périmètre d'un carré et la longueur de son côté", true, `<i>P</i> = 4<i>c</i> : coefficient 4.`],
  ["L'aire d'un carré et la longueur de son côté", false, `côté 2 cm : aire 4 cm<sup>2</sup> ; côté 4 cm : aire 16 cm<sup>2</sup> (pas le double).`],
  ["Le nombre de croissants achetés et le prix payé (1,10 € pièce)", true, `on multiplie le nombre de croissants par 1,10.`],
  ["L'âge d'une personne et sa masse", false, `une personne de 20 ans ne pèse pas deux fois plus qu'à 10 ans.`]
];
const CREP = [["Farine (g)",200],["Œufs",2],["Lait (cL)",40],["Sucre (g)",20]];

CH["5e-11"] = {
intro:"Reconnaître une situation de proportionnalité, utiliser un coefficient (prix unitaire, vitesse, échelle), compléter un tableau par linéarité ou retour à l'unité, calculer des proportions et des pourcentages, et les comparer.",
savoir:[
  "reconnaître une situation de proportionnalité (tableau, situation concrète) ;",
  "utiliser un coefficient de proportionnalité (prix unitaire, vitesse, échelle) ;",
  "compléter un tableau de proportionnalité (linéarité, retour à l'unité) ;",
  "calculer et utiliser une proportion ou un pourcentage ;",
  "comparer des proportions."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Reconnaître la proportionnalité", h:`
  <h4>1. Définition</h4>
  <div class="retenir" data-l="Définition"><p>Deux grandeurs sont <b>proportionnelles</b> lorsque l'on obtient les valeurs de l'une en multipliant les valeurs de l'autre par un même nombre non nul.</p><p>Ce nombre est le <b>coefficient de proportionnalité</b>.</p><p>On range leurs valeurs dans un <b>tableau de proportionnalité</b>.</p></div>
  <p><b>Exemple :</b> 1 kg de pommes coûte 2,40 €.</p>
  ${T2("Masse de pommes (kg)",["1","2","3","5"],"Prix (€)",["2,40","4,80","7,20","12"])}
  <p>On passe de la première ligne à la seconde en multipliant par 2,4 : c'est le <b>coefficient de proportionnalité</b>.</p><p>Ici, c'est aussi le <b>prix unitaire</b> (le prix d'un kilogramme).</p>
  <h4>2. Reconnaître une situation de proportionnalité</h4>
  <div class="retenir" data-l="Méthode"><p><b>1)</b> Je calcule les quotients (valeur de la 2<sup>e</sup> ligne ÷ valeur de la 1<sup>re</sup> ligne) ;</p><p><b>2)</b> si tous les quotients sont égaux, le tableau est un tableau de proportionnalité ;</p><p><b>3)</b> sinon, il ne l'est pas : un seul quotient différent suffit à conclure.</p></div>
  <p><b>Exemple :</b> pour 3 kg et 5 kg de poires, on paie 7,50 € et 12,50 €.</p>
  <p class="calc">${Q("7,5",3)} = 2,5 &nbsp;&nbsp; ${Q("12,5",5)} = 2,5</p>
  <p>Les quotients sont égaux : c'est une situation de proportionnalité (coefficient 2,5).</p>
  <div class="attention"><b>ATTENTION :</b> beaucoup de situations ne sont <b>pas</b> proportionnelles : l'âge et la taille d'une personne, le côté d'un carré et son aire…</div>`},
{k:"II", t:"Calculer une valeur dans une situation de proportionnalité", h:`
  <div class="retenir" data-l="Méthode"><p>Pour trouver une valeur manquante, trois méthodes :</p><p><b>1) Avec le coefficient :</b> je multiplie par le coefficient (ou je divise par lui dans l'autre sens) ;</p><p><b>2) Avec la linéarité :</b> si je multiplie (ou divise) une valeur par un nombre, je fais de même pour la valeur correspondante ; à une somme de valeurs correspond la somme de leurs images ;</p><p><b>3) Avec le retour à l'unité :</b> je calcule la valeur pour 1, puis je multiplie.</p></div>
  <p><b>Exemple : linéarité.</b> Une recette pour 4 personnes demande 250 g de farine.</p>
  <ul><li>Pour 2 personnes : 250 ÷ 2 = 125 g.</li><li>Pour 6 personnes : 6 = 4 + 2, donc 250 + 125 = 375 g.</li></ul>
  <p><b>Exemple : retour à l'unité.</b> 5 stylos coûtent 6,50 €.</p>
  <ul><li>Un stylo coûte 6,50 ÷ 5 = 1,30 €.</li><li>Donc 8 stylos coûtent 8 × 1,30 = 10,40 €.</li></ul>
  <h4>Cas particuliers</h4>
  <div class="retenir" data-l="À retenir"><p>Une <b>vitesse moyenne constante</b> rend la distance proportionnelle à la durée.</p><p>Une <b>échelle</b> de ${Q(1,"25 000")} signifie que 1 cm sur le plan représente 25 000 cm dans la réalité : les longueurs sur le plan et dans la réalité sont proportionnelles.</p></div>
  <p><b>Exemple :</b> à 60 km/h, on parcourt 60 km en 1 h, donc 150 km en 2 h 30.</p>`},
{k:"III", t:"Proportions et pourcentages", h:`
  <h4>1. Proportion et pourcentage</h4>
  <div class="retenir" data-l="Définition"><p>Une <b>proportion</b> exprime la part d'une quantité par rapport à un tout : ${Q("quantité","total")}.</p><p>Elle s'écrit avec une fraction, un nombre décimal ou un pourcentage.</p><p>Un <b>pourcentage</b> est une proportion écrite avec le dénominateur 100 : 36 % = ${Q(36,100)} = 0,36.</p></div>
  <p><b>Exemple :</b> dans une classe de 30 élèves, 12 portent des lunettes. La proportion p d'élèves qui portent des lunettes est :</p>
  ${KC("p",[Q(12,30),Q(2,5),"0,4",Q(40,100),"40 %"])}
  <h4>2. Prendre un pourcentage d'une quantité</h4>
  <div class="retenir" data-l="Méthode"><p>Pour calculer :</p><p><b>1)</b> <b>50 %</b> : je prends la moitié ; <b>25 %</b> : le quart ; <b>10 %</b> : je divise par 10 ; <b>1 %</b> : je divise par 100 ;</p><p><b>2)</b> pour <i>t</i> % d'une quantité Q, je calcule Q × ${Q("t",100)}.</p></div>
  <p><b>Exemples :</b></p>
  <p class="calc">10 % de 350 € : 350 ÷ 10 = 35 €</p>
  <p class="calc">15 % de 60 : 60 × ${Q(15,100)} = 9</p>
  <p>Autre méthode : 10 % de 60 = 6 et 5 % de 60 = 3. Donc, pour P = 15 % de 60 :</p>${KC("P",["6 + 3","9"])}
  <p><b>À toi de jouer :</b> calcule 20 % de 85 €, puis donne le pourcentage que représentent 18 élèves sur 24.</p>
  <details><summary>Voir la correction</summary><div class="corr"><p class="calc">20 % de 85 € : 85 × ${Q(20,100)} = 17 €</p><p>La proportion p :</p>${KC("p",[Q(18,24),"0,75","75 %"])}</div></details>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Reconnaître la proportionnalité", e:[
  {n:"Activité 1", t:"Proportionnel ou non ?", w:"Sur ta feuille", h:`<p>Voici deux situations. Complète les tableaux (calculatrice autorisée).</p>
   <p><b>Situation 1 :</b> le prix de pommes achetées au marché.</p>${T2("Masse (kg)",["1","3","5"],"Prix (€)",["2,40","7,20","12"],["Prix ÷ masse",["","",""]])}
   <p><b>Situation 2 :</b> l'âge et la taille d'un enfant.</p>${T2("Âge (ans)",["5","10","15"],"Taille (m)",["1,10","1,40","1,70"],["Taille ÷ âge",["","",""]])}
   <p><b>1)</b> Dans quelle situation les quotients sont-ils tous égaux ?</p><p><b>2)</b> Dans quelle situation les deux grandeurs sont-elles proportionnelles ? Quel est alors le coefficient ?</p>`,
   c:`${T2("Masse (kg)",["1","3","5"],"Prix (€)",["2,40","7,20","12"],["Prix ÷ masse",["2,4","2,4","2,4"]])}${T2("Âge (ans)",["5","10","15"],"Taille (m)",["1,10","1,40","1,70"],["Taille ÷ âge",["0,22","0,14","≈ 0,113"]])}
   <p><b>1)</b> Dans la situation 1 : 2,4 à chaque fois. Dans la situation 2, les quotients sont différents.</p><p><b>2)</b> La situation 1 est une situation de proportionnalité, de coefficient <b>2,4</b> (le prix d'un kilogramme). La situation 2 n'en est pas une.</p>`},
  {n:"Exercice 1", t:"Reconnaître une situation de proportionnalité", w:"Sur ta feuille", h:`<p>Pour chaque situation, coche la bonne case, puis justifie sur ton cahier.</p>${TB(["Situation","Oui","Non"], E1.map(([s])=>[s,"☐","☐"]))}`,
   c:E1.map(([s,ok,why],i)=>`<p>${"abcdef"[i]}) ${s} : <b>${ok?"oui":"non"}</b> — ${why}</p>`).join("")}
 ]},
{t:"Calculer une valeur dans une situation de proportionnalité", e:[
  {n:"Exercice 2", t:"Compléter avec le coefficient", w:"Sur ta feuille", h:`<p>Ces tableaux sont des tableaux de proportionnalité. Complète-les en cherchant le coefficient.</p>${T2("Masse (kg)",["2","4","7","10"],"Prix (€)",["5","","","25"])}${T2("Durée (min)",["10","25","40","5"],"Eau (L)",["","15","24",""])}`,
   c:`${T2("Masse (kg)",["2","4","7","10"],"Prix (€)",["5","<b>10</b>","<b>17,5</b>","25"])}<p>Coefficient : 5 ÷ 2 = 2,5. Chaque valeur de la 2<sup>e</sup> ligne est la valeur de la 1<sup>re</sup> ligne multipliée par 2,5.</p>
   ${T2("Durée (min)",["10","25","40","5"],"Eau (L)",["<b>6</b>","15","24","<b>3</b>"])}<p>Coefficient : 15 ÷ 25 = 0,6. Chaque valeur de la 2<sup>e</sup> ligne est la valeur de la 1<sup>re</sup> ligne multipliée par 0,6.</p>`},
  {n:"Exercice 3", t:"Utiliser la linéarité", w:"Sur ta feuille", h:`<p>Un paquet de 4 minifigurines coûte 12 €. Complète en utilisant la linéarité (sans retour à l'unité).</p>${T2("Nombre de minifigurines",["4","8","2","6","10"],"Prix (€)",["12","","","",""])}<p>Écris sur ton cahier comment tu as obtenu les prix pour 6 et pour 10.</p>`,
   c:`${T2("Nombre de minifigurines",["4","8","2","6","10"],"Prix (€)",["12","<b>24</b>","<b>6</b>","<b>18</b>","<b>30</b>"])}<p>8 = 4 × 2 donc 12 × 2 = 24</p><p>2 = 4 ÷ 2 donc 12 ÷ 2 = 6</p><p>6 = 4 + 2 donc 12 + 6 = 18</p><p>10 = 8 + 2 donc 24 + 6 = 30</p>`},
  {n:"Exercice 4", t:"Retour à l'unité", w:"Sur ton cahier", h:`<p>Utilise le retour à l'unité.</p><p>a) 5 stylos coûtent 6,50 €. Combien coûtent 8 stylos ?</p><p>b) 12 œufs pèsent 720 g. Combien pèsent 7 œufs ?</p><p>c) Une voiture consomme 28 L pour 400 km. Combien consomme-t-elle pour 650 km ?</p>`,
   c:`<p>a) 1 stylo : 6,50 ÷ 5 = 1,30 € ; 8 stylos : 8 × 1,30 = <b>10,40 €</b>.</p><p>b) 1 œuf : 720 ÷ 12 = 60 g ; 7 œufs : 7 × 60 = <b>420 g</b>.</p><p>c) Ici, l'unité est 100 km : 28 ÷ 4 = 7 L pour 100 km ; 650 km = 6,5 × 100 km, donc 6,5 × 7 = <b>45,5 L</b>.</p>`},
  {n:"Exercice 5", t:"La recette de crêpes", w:"Sur ta feuille", h:`<p>Voici la recette de crêpes pour 4 personnes. Complète pour 6, 8 et 10 personnes.</p>${TB(["Ingrédients","4 personnes","6 personnes","8 personnes","10 personnes"], CREP.map(([n,q])=>[n,String(q),"","",""]))}`,
   c:`${TB(["Ingrédients","4 personnes","6 personnes","8 personnes","10 personnes"], CREP.map(([n,q])=>[n,String(q),F(q*1.5),F(q*2),F(q*2.5)]))}<p>Pour 6 personnes : 6 = 4 × 1,5 · pour 8 : 4 × 2 · pour 10 : 4 × 2,5</p><p>On multiplie chaque quantité par 1,5, par 2 ou par 2,5.</p>`},
  {n:"Exercice 6", t:"Vitesse moyenne", w:"Sur ton cahier", h:`<p>Un cycliste roule à la vitesse moyenne constante de 18 km/h.</p><p><b>1)</b> Quelle distance parcourt-il en 2 h ? en 30 min ? en 3 h 30 min ?</p><p><b>2)</b> Quelle durée lui faut-il pour parcourir 45 km ?</p>`,
   c:`<p>La distance est proportionnelle à la durée : en 1 h, le cycliste parcourt 18 km.</p><p><b>1)</b> En 2 h : 2 × 18 = <b>36 km</b>.</p><p>En 30 min (0,5 h) : 18 ÷ 2 = <b>9 km</b>.</p><p>En 3 h 30 min (3,5 h) : 3,5 × 18 = <b>63 km</b>.</p><p><b>2)</b> 45 ÷ 18 = 2,5 h, soit <b>2 h 30 min</b>.</p>`},
  {n:"Exercice 7", t:"Lire une carte", w:"Sur ton cahier", h:`<p>Sur une carte à l'échelle ${Q(1,"50 000")}, 1 cm représente 500 m dans la réalité.</p><p>a) Deux villes sont distantes de 4 cm sur la carte. Quelle est la distance réelle, en kilomètres ?</p><p>b) Un chemin mesure 7,5 cm sur la carte. Quelle est sa longueur réelle ?</p><p>c) Un sentier mesure 6 km dans la réalité. Quelle longueur a-t-il sur la carte ?</p>`,
   c:`<p>a) 4 × 500 = 2 000 m, soit <b>2 km</b>.</p><p>b) 7,5 × 500 = 3 750 m, soit <b>3,75 km</b>.</p><p>c) 6 km = 6 000 m et 6 000 ÷ 500 = 12 : le sentier mesure <b>12 cm</b> sur la carte.</p>`}
 ]},
{t:"Proportions et pourcentages", e:[
  {n:"Exercice 8", t:"Les briques de la boîte", w:"Sur ta feuille", h:`<p>Une boîte contient 24 briques : 6 rouges, 9 bleues et 9 jaunes. Donne chaque proportion sous trois formes.</p>${TB(["Couleur","Fraction irréductible","Nombre décimal","Pourcentage"],[["Rouge","","",""],["Bleue","","",""],["Jaune","","",""]])}`,
   c:`${TB(["Couleur","Fraction irréductible","Nombre décimal","Pourcentage"],[["Rouge",`${Q(6,24)} = ${Q(1,4)}`,"0,25","25 %"],["Bleue",`${Q(9,24)} = ${Q(3,8)}`,"0,375","37,5 %"],["Jaune",`${Q(9,24)} = ${Q(3,8)}`,"0,375","37,5 %"]])}<p>Vérification : 25 % + 37,5 % + 37,5 % = 100 %.</p>`},
  {n:"Exercice 9", t:"Pourcentages mentaux", w:"Sur ta feuille", h:`<p>Calcule mentalement et écris seulement les résultats.</p><p>a) 50 % de 90 : …… b) 25 % de 120 : …… c) 10 % de 350 : …… d) 1 % de 800 : …… e) 75 % de 40 : …… f) 20 % de 60 : ……</p>`,
   c:`<p>a) 50 % de 90 : la moitié, 90 ÷ 2 = <b>45</b></p><p>b) 25 % de 120 : le quart, 120 ÷ 4 = <b>30</b></p><p>c) 10 % de 350 : 350 ÷ 10 = <b>35</b></p><p>d) 1 % de 800 : 800 ÷ 100 = <b>8</b></p><p>e) 75 % de 40 : trois quarts, 40 ÷ 4 = 10 puis 10 × 3 = <b>30</b></p><p>f) 20 % de 60 : 10 % de 60 = 6, donc pour P = 20 % de 60 :</p>${KC("P",["6 × 2","<b>12</b>"])}`},
  {n:"Exercice 10", t:"Calculer avec des pourcentages", w:"Sur ton cahier", h:`<p>Calcule (calculatrice autorisée).</p><p>a) 15 % de 60 b) 30 % de 250 c) 12 % de 150 d) 18 élèves sur 24 : quel pourcentage ? e) 45 élèves sur 150 : quel pourcentage ? f) 21 élèves sur 25 : quel pourcentage ?</p>`,
   c:`<p>Pour <i>t</i> % de Q, je calcule Q × ${Q("t",100)}. Pour un pourcentage, je calcule la proportion ${Q("quantité","total")}.</p><p>a)</p>${KC("P",[`60 × ${Q(15,100)}`,"900 ÷ 100","<b>9</b>"])}<p>b)</p>${KC("P",[`250 × ${Q(30,100)}`,"7 500 ÷ 100","<b>75</b>"])}<p>c)</p>${KC("P",[`150 × ${Q(12,100)}`,"1 800 ÷ 100","<b>18</b>"])}<p>d)</p>${KC("p",[Q(18,24),"18 ÷ 24","0,75","<b>75 %</b>"])}<p>e)</p>${KC("p",[Q(45,150),"45 ÷ 150","0,3","<b>30 %</b>"])}<p>f)</p>${KC("p",[Q(21,25),"21 ÷ 25","0,84","<b>84 %</b>"])}`},
  {n:"Exercice 11", t:"L'élection des délégués", w:"Sur ta feuille", h:`<p>Pour l'élection des délégués, 4 élèves se présentent. Chaque élève de la classe (25 élèves) a voté pour un seul candidat. Complète le tableau.</p>${TB(["Candidat","Chloé","Hugo","Zoé","Léo","Total"],[["Nombre de voix","10","7","5","3","25"],["Pourcentage","","","","",""]])}<p>Que vaut la somme des pourcentages ? Explique pourquoi sur ton cahier.</p>`,
   c:`${TB(["Candidat","Chloé","Hugo","Zoé","Léo","Total"],[["Nombre de voix","10","7","5","3","25"],["Pourcentage","40 %","28 %","20 %","12 %","100 %"]])}<p>Chaque pourcentage : ${Q("voix",25)} = ${Q("voix × 4",100)}.</p><p>La somme est 40 + 28 + 20 + 12 = <b>100 %</b> : toutes les voix représentent le tout.</p>`},
  {n:"Exercice 12", t:"Comparer des proportions", w:"Sur ton cahier", h:`<p>Compare les proportions (calculatrice autorisée).</p><p>a) En 5<sup>e</sup>C, 21 élèves sur 25 ont réussi leur ASSR. En 5<sup>e</sup>D, le taux de réussite est de 84 %. Lola affirme : « La proportion d'élèves ayant réussi est la même dans les deux classes. » A-t-elle raison ?</p><p>b) Dans la préparation A, il y a 44 mL de sirop pour une boisson de 400 mL. Dans la préparation B, il y a 38 mL de sirop pour 350 mL. Laquelle est la plus concentrée en sirop ?</p><p>c) Majid obtient 11 fois Face sur 25 lancers. Alice obtient 12 fois Pile sur 20 lancers. Qui a obtenu la plus grande proportion de Face ?</p>`,
   c:`<p>a) En 5<sup>e</sup>C :</p>${KC("p",[Q(21,25),Q(84,100),"84 %"])}<p><b>Oui, Lola a raison</b>.</p><p>b) Préparation A :</p>${KC("p",[Q(44,400),"0,11","11 %"])}<p>Préparation B :</p>${KC("p",[Q(38,350),"≈ 0,1086","≈ 10,9 %"])}<p><b>La préparation A</b> est la plus concentrée.</p><p>c) Majid :</p>${KC("p",[Q(11,25),"0,44","44 %"])}<p>Alice a 20 − 12 = 8 Face sur 20 :</p>${KC("p",[Q(8,20),"0,4","40 %"])}<p><b>Majid</b> a la plus grande proportion de Face.</p>`},
  {n:"Exercice 13", t:"Réductions et augmentations", w:"Sur ton cahier", h:`<p>a) Un jeu coûte 45 €. Pendant les soldes, il bénéficie d'une réduction de 20 %. Quel est le montant de la réduction ? Quel est le nouveau prix ?</p><p>b) Un sweat coûte 60 €. Un magasin propose 15 % de réduction. Quel est son prix après réduction ?</p><p>c) Un abonnement coûte 80 € par an. Son prix augmente de 10 %. Quel est le nouveau prix ?</p>`,
   c:`<p>a) Réduction : 45 × ${Q(20,100)} = <b>9 €</b> ; nouveau prix : 45 − 9 = <b>36 €</b>.</p><p>b) Réduction : 60 × ${Q(15,100)} = 9 € ; prix : 60 − 9 = <b>51 €</b>.</p><p>c) Augmentation : 80 × ${Q(10,100)} = 8 € ; nouveau prix : 80 + 8 = <b>88 €</b>.</p>`},
  {n:"Exercice 14", t:"Pour aller plus loin : une œuvre à l'échelle", w:"Sur ton cahier", h:`<p>Pour reproduire une œuvre de Kandinsky de 80 cm sur 60 cm, on la dessine à l'échelle ${Q(1,4)} (toutes les longueurs sont divisées par 4).</p><p><b>1)</b> Quelles sont les dimensions de la reproduction ?</p><p><b>2)</b> Quelles seraient les dimensions à l'échelle ${Q(1,8)} ?</p>`,
   c:`<p><b>1)</b> 80 ÷ 4 = 20 cm et 60 ÷ 4 = 15 cm : la reproduction mesure <b>20 cm sur 15 cm</b>.</p><p><b>2)</b> 80 ÷ 8 = 10 cm et 60 ÷ 8 = 7,5 cm : <b>10 cm sur 7,5 cm</b>.</p>`}
 ]}
],

/* ÉVAL-5b début */
/* ===================== ÉVALUATION D'ENTRAÎNEMENT (+ version aménagée « bep ») ===================== */
eval:(()=>{
const pn = v => String(v).replace(".",",");
const pts = v => `${pn(v)} point${v>=2?"s":""}`;
const pt = v => ` <i>(${pts(v)})</i>`;
const exl = (X, ids) => { const s=ids.reduce((a,i)=>a+X[i-1].p,0); return (ids.length===1?`Ex. ${ids[0]}`:`Ex. ${ids.slice(0,-1).join(", ")} et ${ids[ids.length-1]}`)+` (${pts(s)})`; };
const NL = (n, ch) => `<p class="calc">${n} = ${ch.split(" = ").join(`<br>${n} = `)}</p>`;
const COMP = [
  ["RAISONNER","Je reconnais, en justifiant, une situation de proportionnalité.",[1]],
  ["CALCULER","Je complète un tableau de proportionnalité et je calcule avec des pourcentages.",[2,4]],
  ["CHERCHER","Je résous des problèmes de proportionnalité (retour à l'unité, vitesse, échelle) et je compare des proportions.",[3,5]]
];
const L = (b, list) => list.filter(q=>!(b && q.rm));
const lab = i => "abcdefgh"[i]+")", num = i => (i+1)+".";
/* tableau de l'exercice 2 : [litres, surface] ; null = case à trouver */
const PEINT = [[3,21],[6,42,"6 = 3 × 2, donc 21 × 2 = 42 m²"],[1,7,"1 = 3 ÷ 3, donc 21 ÷ 3 = 7 m²"],[10,70,"10 L, c'est 10 fois 1 L : 7 × 10 = 70 m²",1],[4,28,"4 = 3 + 1, donc 21 + 7 = 28 m²"],[5,35,"35 ÷ 7 = 5 L (on divise par le coefficient)"]];
const mk = b => {
  const P_ = q => b ? q.pb : q.p;
  const sum = q => q.reduce((a,z)=>a+P_(z),0);
  const wr = f => (q,i) => { const c=q.c.startsWith("<p>") ? `<p>${f(i)} `+q.c.slice(3) : `<p>${f(i)}</p>`+q.c; return (c.endsWith("</p>") ? c.slice(0,-4) : c)+pt(P_(q))+"</p>"; };
  /* Ex 1 */
  const q1 = L(b, [
    {h:`Location d'un vélo :`, tb:T2("Durée (h)",["2","3","5"],"Prix (€)",["9","13,50","22,50"]), p:1, pb:1.5,
     c:`${T2("Durée (h)",["2","3","5"],"Prix (€)",["9","13,50","22,50"],["Prix ÷ durée",["4,5","4,5","4,5"]])}<p class="calc">${Q(9,2)} = 4,5 &nbsp;·&nbsp; ${Q("13,5",3)} = 4,5 &nbsp;·&nbsp; ${Q("22,5",5)} = 4,5</p><p>Tous les quotients sont égaux : <b>c'est un tableau de proportionnalité</b>, de coefficient 4,5 (une heure de location coûte 4,50 €).`},
    {h:`Envoi d'un colis :`, tb:T2("Masse (kg)",["1","2","5"],"Prix (€)",["6","8","14"]), p:1, pb:1.5,
     c:`<p class="calc">${Q(6,1)} = 6 &nbsp; et &nbsp; ${Q(8,2)} = 4</p><p>Deux quotients sont différents : <b>ce n'est pas un tableau de proportionnalité</b> (2 kg ne coûtent pas le double de 1 kg).`},
    {h:`Le périmètre d'un triangle équilatéral et la longueur de son côté.`, p:1, rm:true,
     c:`<p>Un triangle équilatéral a trois côtés de même longueur : périmètre = 3 × côté.</p><p>On multiplie toujours par 3 : <b>c'est une situation de proportionnalité</b> (coefficient 3).`}
  ]);
  /* Ex 2 */
  const cols2 = PEINT.filter(r=>!(b && r[3]));
  const known = (r,i) => i===0 || i===cols2.length-1;     /* première colonne et dernière surface connues */
  const tab2 = full => T2("Peinture (L)", cols2.map((r,i)=>i===cols2.length-1 && !full ? "……" : String(r[0])), "Surface peinte (m²)", cols2.map((r,i)=>known(r,i)||full ? String(r[1]) : "……"));
  const nc = cols2.length-1, pc = 0.5, pcoef = b ? 1.5 : 1;
  /* Ex 3 */
  const q3 = [
    {h:`4 entrées à la piscine coûtent 13,60 €. Combien coûtent 7 entrées ?`, p:1.5, pb:2,
     c:`<p>Je calcule d'abord le prix d'une entrée (retour à l'unité) :</p><p class="calc">13,60 ÷ 4 = 3,40 €</p><p class="calc">7 × 3,40 = 23,80 €</p><p>7 entrées coûtent <b>23,80 €</b>.`},
    {h:`Un cycliste roule à la vitesse constante de 18 km/h. Quelle distance parcourt-il en 2&nbsp;h&nbsp;30&nbsp;min ?`, p:1.5, pb:1.5,
     c:`<p>À 18 km/h, il parcourt 18 km en 1 h. La distance est proportionnelle à la durée.</p><p class="calc">En 2 h : 18 × 2 = 36 km &nbsp;·&nbsp; en 30 min (une demi-heure) : 18 ÷ 2 = 9 km</p><p class="calc">36 + 9 = 45 km</p><p>En 2&nbsp;h&nbsp;30&nbsp;min, il parcourt <b>45 km</b>.`},
    {h:`Sur un plan à l'échelle ${Q(1,200)}, une piscine mesure 12,5 cm de long. Quelle est sa longueur réelle, en mètres ?`, p:1.5, pb:2,
     c:`<p>À l'échelle ${Q(1,200)}, 1 cm sur le plan représente 200 cm dans la réalité.</p><p class="calc">12,5 × 200 = 2 500 cm &nbsp; et &nbsp; 2 500 cm = 25 m</p><p>La piscine mesure <b>25 m</b> de long.`}
  ];
  /* Ex 4 */
  const a4 = L(b, [
    {h:`10 % de 230`, c:`230 ÷ 10 = <b>23</b>`},
    {h:`75 % de 48`, c:`48 × ${Q(75,100)} = <b>36</b> &nbsp; <i>(ou : 75 %, c'est les trois quarts : 48 ÷ 4 × 3 = 36)</i>`},
    {h:`15 % de 120`, c:`120 × ${Q(15,100)} = <b>18</b> &nbsp; <i>(ou : 10 % = 12 et 5 % = 6, donc 12 + 6 = 18)</i>`, rm:true}
  ]);
  const q4 = L(b, [
    {h:`Calcule : ${a4.map(q=>q.h).join(" ; ")}.`, p:a4.length*0.5, pb:a4.length*0.5,
     c:`${a4.map(q=>`<p class="calc">${q.h} : ${q.c}</p>`).join("")}<p><i>0,5 point par calcul.</i></p>`},
    {h:`Écris sous la forme d'un pourcentage : 7 élèves sur 20 ; 27 élèves sur 30.`, p:1, pb:1,
     c:`<p>7 élèves sur 20 :</p>${KC("p",[Q(7,20),Q("7 × 5","20 × 5"),Q(35,100),"<b>35 %</b>"])}<p>27 élèves sur 30 :</p>${KC("p",[Q(27,30),Q(9,10),Q(90,100),"<b>90 %</b>"])}<p><i>0,5 point par pourcentage.</i></p>`},
    {h:`Un abonnement de musique coûte 32 € par mois. Son prix augmente de 25 %. Quel est son nouveau prix ?`, p:1.5, pb:2,
     c:`<p>Je calcule l'augmentation : 25 %, c'est le quart.</p><p class="calc">25 % de 32 € : 32 ÷ 4 = 8 €</p><p>Je l'ajoute à l'ancien prix :</p><p class="calc">32 + 8 = 40 €</p><p>Le nouveau prix est de <b>40 €</b> par mois.`},
    {h:`Dans une classe de 25 élèves, 40 % des élèves mangent à la cantine. Combien d'élèves mangent à la cantine ?`, p:1, rm:true,
     c:`<p class="calc">25 × ${Q(40,100)} = 10</p><p><b>10 élèves</b> mangent à la cantine.`}
  ]);
  /* Ex 5 */
  const BOT = L(b, [
    {n:"Soleil", d:`18 cL de jus d'orange pour 40 cL`, c:[Q(18,40),Q(9,20),Q("9 × 5","20 × 5"),Q(45,100),"<b>45 %</b>"]},
    {n:"Tropic", d:`12 cL de jus d'orange pour 25 cL`, c:[Q(12,25),Q("12 × 4","25 × 4"),Q(48,100),"<b>48 %</b>"]},
    {n:"Verger", d:`les ${Q(2,5)} de la bouteille sont du jus d'orange`, c:[Q(2,5),Q("2 × 20","5 × 20"),Q(40,100),"<b>40 %</b>"], rm:true}
  ]);
  const pb5 = b ? 1.5 : 1;
  const q5 = [
    {h:`Calcule la proportion de jus d'orange de chaque bouteille, sous la forme d'un pourcentage.`, p:BOT.length*1, pb:BOT.length*pb5,
     c:`<p>Proportion p = ${Q("quantité de jus d'orange","quantité totale")}.</p>${BOT.map(o=>`<p>${o.n} :</p>${KC("p",o.c)}`).join("")}<p><i>${pn(pb5)} point par bouteille.</i></p>`},
    {h: b ? `Dans quelle bouteille la proportion de jus d'orange est-elle la plus grande ? Justifie.` : `Range les trois bouteilles, de la plus riche en jus d'orange à la moins riche.`, p:1, pb:1,
     c: b ? `<p>48 % &gt; 45 % : la proportion de jus d'orange est la plus grande dans la bouteille <b>Tropic</b>.` : `<p>48 % &gt; 45 % &gt; 40 % : <b>Tropic</b>, puis <b>Soleil</b>, puis <b>Verger</b>.`}
  ];
  const X_ = [
    {t:"Proportionnel ou non ?", p:sum(q1),
     h:`<p>Dans chaque cas, dis s'il s'agit d'une situation de proportionnalité. Justifie par des calculs.</p>${q1.map((q,i)=>`<p>${lab(i)} ${q.h}</p>${q.tb||""}`).join("")}`, c:q1.map(wr(lab)).join("")},
    {t:"La peinture", p:nc*pc+pcoef,
     h:`<p>Avec 3 L de peinture, on peut peindre 21 m² de mur. La surface peinte est proportionnelle à la quantité de peinture.</p><p>1. Complète le tableau. Laisse apparents tes calculs.</p>${tab2(false)}<p>2. Quel est le coefficient de proportionnalité ? Que représente-t-il ?</p>`,
     c:`<p>1.</p>${tab2(true)}${cols2.slice(1).map(r=>`<p>${r[2]}</p>`).join("")}<p><i>(${pn(pc)} point par case, soit ${pts(nc*pc)})</i></p><p>2. Le coefficient est <b>7</b> (21 ÷ 3 = 7) : avec 1 L de peinture, on peint 7 m².${pt(pcoef)}</p>`},
    {t:"Problèmes de proportionnalité", p:sum(q3), h:q3.map((q,i)=>`<p>${lab(i)} ${q.h}</p>`).join(""), c:q3.map(wr(lab)).join("")},
    {t:"Calculer avec des pourcentages", p:sum(q4), h:q4.map((q,i)=>`<p>${lab(i)} ${q.h}</p>`).join(""), c:q4.map(wr(lab)).join("")},
    {t:"Le jus d'orange", p:sum(q5),
     h:`<p>Voici la composition de ${BOT.length===3?"trois":"deux"} bouteilles de jus de fruits mélangés.</p><ul>${BOT.map(o=>`<li>Bouteille <b>${o.n}</b> : ${o.d}.</li>`).join("")}</ul>${q5.map((q,i)=>`<p>${num(i)} ${q.h}</p>`).join("")}`, c:q5.map(wr(num)).join("")}
  ];
  return {X:X_, comp:COMP.map(([k,tt,ids])=>[k,tt,exl(X_,ids)])};
};
const N = mk(false), B = mk(true);
return {
titre:"Évaluation d'entraînement — Chapitre 11", duree:50, info:"Durée : 50 min · Calculatrice non autorisée",
comp:N.comp, exos:N.X,
bep:{
titre:"Évaluation d'entraînement — Chapitre 11 · version aménagée", duree:50, info:"Version aménagée · Durée : 50 min · Calculatrice non autorisée",
note:"Les mêmes exercices avec cinq questions en moins, dans le même temps (50 min). Le barème est recalculé pour rester sur 20. Les justifications sont toujours demandées.",
comp:B.comp, exos:B.X }
};
})(),
/* ÉVAL-5b fin */
/* ===================== QCM ===================== */
quiz:[
{nom:"Reconnaître la proportionnalité", schema:S_REC, q:{
 1:[ {g:()=>{ const k=pick([2,3,4,5,1.5,2.5]), x=[ri(1,3),ri(4,6),ri(7,10)], ok=Math.random()<0.5; const y=x.map(v=>r3(v*k)); if(!ok) y[2]=r3(y[2]+pick([1,2,-1]));
       return {q:"Ce tableau est-il un tableau de proportionnalité ?", fig:T2("Grandeur A",x.map(F),"Grandeur B",y.map(F)), c:["Oui","Non"], rep:ok?"Oui":"Non", ex:`Quotients : ${x.map((v,i)=>`${Q(F(y[i]),v)} ${qt(y[i],v)}`).join(" ; ")}. ${ok?"Ils sont tous égaux.":"Ils ne sont pas tous égaux."}`, sx:S_REC}; }},
     {g:()=>{ const s=pick([["Le périmètre d'un carré et la longueur de son côté","Oui","P = 4 × c : coefficient 4."],["L'aire d'un carré et la longueur de son côté","Non","Côté 2 cm : aire 4 cm<sup>2</sup> ; côté 4 cm : aire 16 cm<sup>2</sup>, pas le double."],["L'âge d'une personne et sa taille","Non","On ne grandit pas toujours de la même façon."],["Le nombre de croissants achetés et le prix payé (1,10 € pièce)","Oui","On multiplie par 1,10."]]);
       return {q:`${s[0]} : sont-ils proportionnels ?`, c:["Oui","Non"], rep:s[1], ex:s[2], sx:S_REC}; }} ],
 2:[ {g:()=>{ const k=pick([1.5,2.5,0.5,3,4,1.2,0.6]), x=[ri(2,5),ri(6,9),ri(10,15)]; return {q:"Ce tableau est un tableau de proportionnalité. Quel est son coefficient ?", fig:T2("Grandeur A",x.map(F),"Grandeur B",x.map(v=>F(v*k))), rep:F(k), ex:`${F(x[0]*k)} ÷ ${x[0]} = ${F(k)}.`, sx:S_REC}; }} ],
 3:[ {g:()=>{ const k=pick([2,2.5,3,1.5]), x=[ri(2,4),ri(5,8),ri(9,12)]; const y=x.map(v=>r3(v*k)); y[2]=r3(x[2]*(k+0.5));
       return {q:"Ce tableau est-il un tableau de proportionnalité ?", fig:T2("Grandeur A",x.map(F),"Grandeur B",y.map(F)), c:["Oui","Non"], rep:"Non", ex:`${Q(F(y[0]),x[0])} = ${F(k)} et ${Q(F(y[1]),x[1])} = ${F(k)}, mais ${Q(F(y[2]),x[2])} = ${F(k+0.5)} : un seul quotient différent suffit.`, sx:S_REC}; }},
     {q:"Pour montrer qu'un tableau n'est pas de proportionnalité, il suffit de trouver…", c:["un seul quotient différent","deux quotients égaux","un quotient égal à 1"], rep:"un seul quotient différent", sx:S_REC} ]
}},
{nom:"Coefficient : prix unitaire, vitesse, échelle", schema:S_COEF, q:{
 1:[ {g:()=>{ const p=ri(11,49)/10, n=ri(2,9); return {q:`1 kg de pommes coûte ${F2(p)} €. Combien coûtent ${n} kg (en €) ?`, rep:[F2(n*p),F(n*p)], ex:`${n} × ${F2(p)} = ${F2(n*p)} €. Le prix unitaire est le coefficient.`, sx:S_COEF}; }} ],
 2:[ {g:()=>{ const v=pick([12,16,18,20,24,30,40,50,60,80,90]), t=pick([0.5,1.5,2,2.5,3,3.5]); const tt=Math.floor(t)?`${Math.floor(t)} h${t%1?" 30 min":""}`:"30 min";
       return {q:`À la vitesse moyenne constante de ${v} km/h, quelle distance parcourt-on en ${tt} (en km) ?`, rep:F(v*t), ex:`${tt} = ${F(t)} h ; ${F(t)} × ${v} = ${F(v*t)} km.`, sx:S_COEF}; }},
     {g:()=>{ const v=pick([12,18,20,24,30,40,60,80]), t=pick([1.5,2,2.5,3,4]); return {q:`Un cycliste roule à ${v} km/h. Combien d'heures lui faut-il pour parcourir ${F(v*t)} km ?`, rep:[F(t)], ex:`${F(v*t)} ÷ ${v} = ${F(t)} h${t%1?` (soit ${Math.floor(t)} h 30 min)`:""}.`, sx:S_COEF}; }} ],
 3:[ {g:()=>{ const d=ri(2,19)/2; return {q:`Sur une carte à l'échelle ${Q(1,"50 000")}, 1 cm représente 500 m. Quelle est la distance réelle pour ${F(d)} cm sur la carte (en km) ?`, rep:F(d*0.5), ex:`La distance réelle d :${KCi("d",[`${F(d)} × 500`,`${F(d*500)} m`,`${F(d*0.5)} km`])}`, sx:S_COEF}; }},
     {g:()=>{ const km=ri(1,8); return {q:`Sur une carte à l'échelle ${Q(1,"50 000")}, 1 cm représente 500 m. Un sentier mesure ${km} km. Quelle est sa longueur sur la carte (en cm) ?`, rep:F(km*2), ex:`${km} km = ${F(km*1000)} m et ${F(km*1000)} ÷ 500 = ${km*2} cm.`, sx:S_COEF}; }} ]
}},
{nom:"Linéarité et retour à l'unité", schema:S_LIN, q:{
 1:[ {g:()=>{ const q=ri(5,30)*20, m=pick([2,8,12]); return {q:`Une recette pour 4 personnes demande ${q} g de farine. Combien en faut-il pour ${m} personnes (en g) ?`, rep:F(q*m/4), ex:m===2?`2 = 4 ÷ 2 : ${F(q)} ÷ 2 = ${F(q/2)} g.`:`${m} = 4 × ${m/4} : ${F(q)} × ${m/4} = ${F(q*m/4)} g.`, sx:S_LIN}; }} ],
 2:[ {g:()=>{ const p=ri(3,15)*2, n=pick([6,10]); return {q:`4 minifigurines coûtent ${p} €. Combien coûtent ${n} minifigurines (en €) ?`, rep:F(p*n/4), ex:n===6?`6 = 4 + 2 : ${p} + ${p/2} = ${F(p*1.5)} €.`:`10 = 8 + 2 : ${2*p} + ${p/2} = ${F(p*2.5)} €.`, sx:S_LIN}; }} ],
 3:[ {g:()=>{ const n=pick([3,4,5,6]), u=ri(80,250)/100, m=ri(7,12); return {q:`${n} stylos coûtent ${F2(n*u)} €. Combien coûtent ${m} stylos (en €) ?`, rep:[F2(m*u),F(m*u)], ex:`1 stylo : ${F2(n*u)} ÷ ${n} = ${F2(u)} € ; ${m} stylos : ${m} × ${F2(u)} = ${F2(m*u)} €.`, sx:S_LIN}; }},
     {g:()=>{ const n=12, u=ri(50,70), m=ri(2,11); return {q:`${n} œufs pèsent ${n*u} g. Combien pèsent ${m} œufs (en g) ?`, rep:F(m*u), ex:`1 œuf : ${n*u} ÷ ${n} = ${u} g ; ${m} × ${u} = ${m*u} g.`, sx:S_LIN}; }} ]
}},
{nom:"Proportions et pourcentages", schema:S_PROP, q:{
 1:[ {g:()=>{ const p=ri(1,99); const good=F(p/100); return {q:`Quel nombre décimal est égal à ${p} % ?`, c:shuf(uniq(good,[F(p/10),F(p/1000),F(p)]).slice(0,3)), rep:good, ex:`${p} % = ${Q(p,100)} = ${good}.`, sx:S_PROP}; }} ],
 2:[ {g:()=>{ const t=pick([4,5,10,20,25,50]), n=ri(1,t-1); return {q:`${n} ${n===1?"élève":"élèves"} sur ${t} ${n===1?"porte":"portent"} des lunettes. Quel pourcentage cela représente-t-il (en %) ?`, rep:[F(n*100/t), F(n*100/t)+" %"], ex:KCi("p",[Q(n,t),Q(F(n*100/t),100),`${F(n*100/t)} %`]), sx:S_PROP}; }},
     {g:()=>{ const t=pick([20,40,8]), n=ri(2,t-1), g=gcd(n,t); return {q:`Dans une boîte de ${t} briques, ${n} sont rouges. Quelle est la proportion de briques rouges ?`, c:shuf(uniq(F(n/t),[F(n/100), F(n/10), F((t-n)/t)]).slice(0,3)), rep:F(n/t), ex:KCi("p",[Q(n,t),Q(n/g,t/g),F(n/t),`${F(n*100/t)} %`]), sx:S_PROP}; }} ],
 3:[ {g:()=>{ const t=pick([20,25,50]), a=ri(Math.ceil(t/3),t-1), pa=a*100/t, ok=Math.random()<0.4, p=ok?pa:pa+pick([-4,-2,2,4]);
       return {q:`Classe A : ${a} élèves sur ${t} ont réussi. Classe B : ${p} % ont réussi. Quelle classe a la plus grande proportion de réussite ?`, c:["la classe A","la classe B","la même proportion"], rep:ok?"la même proportion":pa>p?"la classe A":"la classe B", ex:`${KCi("p",[Q(a,t),Q(pa,100),`${pa} %`])}À comparer avec ${p} %.`, sx:S_PROP}; }},
     {g:()=>{ const n=ri(10,20), f=ri(Math.ceil(n/4),n-2), m=pick([20,25]), pile=ri(Math.ceil(m/4),m-3), face=m-pile; const pa=f/n, pb=face/m;
       if(Math.abs(pa-pb)<1e-9) return {q:`Majid obtient ${f} fois Face sur ${n} lancers. Alice obtient ${pile} fois Pile sur ${m} lancers. Qui a la plus grande proportion de Face ?`, c:["Majid","Alice","autant"], rep:"autant", ex:`Alice a ${face} Face : ${Q(face,m)} = ${Q(f,n)}.`, sx:S_PROP};
       return {q:`Majid obtient ${f} fois Face sur ${n} lancers. Alice obtient ${pile} fois Pile sur ${m} lancers. Qui a la plus grande proportion de Face ?`, c:["Majid","Alice","autant"], rep:pa>pb?"Majid":"Alice", ex:`Attention : Alice a ${m} − ${pile} = ${face} Face. Majid : ${Q(f,n)} ${qt(f*100,n)} % ; Alice : ${Q(face,m)} = ${F(pb*100)} %.`, sx:S_PROP}; }} ]
}},
{nom:"Prendre un pourcentage", schema:S_PCT, q:{
 1:[ {g:()=>{ const [p,d,w]=pick([[50,2,"la moitié"],[25,4,"le quart"],[10,10,"je divise par 10"],[1,100,"je divise par 100"]]); const N=d*ri(2,90); return {q:`Calcule ${p} % de ${F(N)}.`, rep:F(N/d), ex:`${p} % : ${w}. ${F(N)} ÷ ${d} = ${F(N/d)}.`, sx:S_PCT}; }} ],
 2:[ {g:()=>{ const t=pick([5,15,20,30,40,60,75]), N=pick([20,40,60,80,120,200,250,300]); return {q:`Calcule ${t} % de ${N}.`, rep:F(N*t/100), ex:`${N} × ${Q(t,100)} = ${F(N*t/100)}.`, sx:S_PCT}; }} ],
 3:[ {g:()=>{ const P=ri(3,20)*5, t=pick([10,20,30,40,50]), up=Math.random()<0.3; const r=P*t/100;
       return {q:`Un article coûte ${P} €. Son prix ${up?"augmente":"baisse"} de ${t} %. Quel est le nouveau prix (en €) ?`, rep:[F2(up?P+r:P-r),F(up?P+r:P-r)], ex:`${up?"Augmentation":"Réduction"} : ${P} × ${Q(t,100)} = ${F(r)} € ; ${P} ${up?"+":"−"} ${F(r)} = ${F(up?P+r:P-r)} €.`, sx:S_PCT}; }},
     {g:()=>{ const t=pick([12,15,18,35,45]), N=pick([40,60,80,120,150,200]); return {q:`Calcule ${t} % de ${N}.`, rep:F(N*t/100), ex:KCi("P",[`${N} × ${Q(t,100)}`,`${F(N*t)} ÷ 100`,F(N*t/100)]), sx:S_PCT}; }} ]
}}
]
};
})();
