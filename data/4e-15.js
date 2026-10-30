/* 4e — Chapitre 15 : Les pourcentages (« Proportionnalité 3 – Pourcentages », C3)
   Sources : cours C3 (complété), fiche d'exercices et correction de la « Semaine 3 » (consignes du confinement) de M. Staal.
   Les exercices A à J sont les exercices du manuel donnés dans les consignes : énoncés réécrits à partir de la correction de M. Staal. */
(function(){
const VF=["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const rd=(x,k=4)=>Math.round(x*10**k)/10**k;
const N=(x,k=4)=>{ const v=rd(x,k); const [i,d]=String(Math.abs(v)).split("."); return (v<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const E=x=>{ const v=rd(x,2); return Number.isInteger(v)?N(v):N(v,2).replace(/,(\d)$/,(m,d)=>","+d+"0"); };   /* prix */
const F=(a,b)=>`{${a}/${b}}`;
const exact=x=>Math.abs(x*100-Math.round(x*100))<1e-6;
const ans=(x,u)=>{ const L=[...new Set([N(x,2),E(x)])]; return u?[...L,...L.map(s=>s+" "+u),...L.map(s=>s+u)]:L; };
const pct=x=>[...ans(x,"%")];

/* tableau de proportionnalité (SVG) : « !… » = valeur cherchée écrite en couleur */
function ptab(o){
  const {h1,h2,r1,r2}=o, len=s=>String(s).replace(/<[^>]*>/g,"").replace(/^!/,"").length;
  const cw=r1.map((v,i)=>Math.max(66,Math.max(len(v),len(r2[i]))*9.6+26)), hw=Math.max(len(h1),len(h2))*9.3+28, RH=38, mt=4;
  const xs=[4+hw]; cw.forEach(w=>xs.push(xs[xs.length-1]+w)); const xe=xs[xs.length-1], W=Math.round(xe+6), H=2*RH+8, cx=i=>xs[i]+cw[i]/2;
  const cell=(t,x,y,b)=>{ const a=/^!/.test(t); return `<text x="${x.toFixed(1)}" y="${y}" text-anchor="middle" style="font-size:16px;${b?"font-weight:700;":""}${a?"fill:var(--c);font-weight:700":""}">${String(t).replace(/^!/,"")}</text>`; };
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${o.alt||"Tableau de proportionnalité"}">`;
  s+=`<rect x="4" y="${mt}" width="${hw}" height="${2*RH}" style="fill:color-mix(in srgb,var(--c) 10%,transparent)"/>`+cell(h1,4+hw/2,mt+RH/2+6,1)+cell(h2,4+hw/2,mt+1.5*RH+6,1);
  s+=`<rect x="4" y="${mt}" width="${(xe-4).toFixed(1)}" height="${2*RH}" class="thin"/><line x1="4" y1="${mt+RH}" x2="${xe.toFixed(1)}" y2="${mt+RH}" class="thin"/>`;
  xs.slice(0,-1).forEach(x=>{ s+=`<line x1="${x.toFixed(1)}" y1="${mt}" x2="${x.toFixed(1)}" y2="${mt+2*RH}" class="thin"/>`; });
  r1.forEach((v,i)=>{ s+=cell(v,cx(i),mt+RH/2+6)+cell(r2[i],cx(i),mt+1.5*RH+6); });
  return s+"</svg>";
}
const tab=(head,rows)=>`<div class="scroll"><table class="std"><thead><tr>${head.map((h,i)=>`<th>${i?h:`<b>${h}</b>`}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;
/* étiquette nutritionnelle du paquet de biscuits */
const BISC=(mg,pr,gl,m)=>`<div class="scroll"><table class="std" style="max-width:300px"><thead><tr><th colspan="2" style="text-align:center">Pour un biscuit de ${m} g</th></tr></thead><tbody><tr><th>Matières grasses</th><td>${mg} %</td></tr><tr><th>Protéines</th><td>${pr} %</td></tr><tr><th>Glucides</th><td>${gl} %</td></tr></tbody></table></div>`;

window.P415={ptab, tab, N, E, F, exact, rd, BISC};

/* ===================== schémas ===================== */
const S_APP=sch("Appliquer un pourcentage", `<p class="schN">60 % de 30 :</p><p class="calc">P = ${F(60,100)} × 30<br>P = 0,6 × 30<br>P = 18</p><p class="schN">Prendre t % d'une quantité, c'est la multiplier par ${F("t",100)}.</p>`);
const S_CH=sch("Chercher un pourcentage", `<p class="calc">p = ${F(36,127)}<br>p ≈ 0,28<br>p ≈ ${F(28,100)}<br>p ≈ 28 %</p><p class="schN">J'écris la proportion (partie ÷ total), je la calcule, puis je l'écris avec le dénominateur 100.</p>`);
const S_EVO=sch("Augmentation ou réduction", `<p class="calc">+ 9 % sur 570 € : ${F(9,100)} × 570 = 51,30 € et 570 + 51,30 = 621,30 €</p><p class="calc">− 20 % sur 35 € : ${F(20,100)} × 35 = 7 € et 35 − 7 = 28 €</p><p class="schN">Augmentation : j'ajoute. Réduction : j'enlève.</p>`);
const S_PEV=sch("Chercher un pourcentage d'évolution", `<p class="calc">215 € → 247,25 € : 247,25 − 215 = 32,25</p><p class="calc">p = ${F("32,25",215)}<br>p = 0,15<br>p = ${F(15,100)}<br>p = 15 %</p><p class="schN">Je calcule l'augmentation (ou la réduction), puis je la divise par le prix <b>initial</b>.</p>`);

CH["4e-15"] = {
intro:"Appliquer un pourcentage, chercher un pourcentage, appliquer un pourcentage d'augmentation ou de réduction, et calculer un pourcentage d'augmentation ou de réduction.",
savoir:[
  "appliquer un pourcentage à une quantité ;",
  "calculer un pourcentage (une proportion écrite sur 100) ;",
  "appliquer un pourcentage d'augmentation ou de réduction ;",
  "calculer un pourcentage d'augmentation ou de réduction ;",
  "utiliser un tableau de proportionnalité ou le calcul direct (méthode attendue en 4e)."
],

/* ===================== COURS ===================== */
cours:[
{k:"1", t:"Appliquer un pourcentage", h:`
  <div class="retenir" data-l="Définition"><p>Soit le nombre t. Prendre <b>t %</b> d'une quantité, c'est multiplier cette quantité par ${F("t",100)}.</p></div>
  <p><b>Exercice :</b> dans une classe de 30 élèves, 60 % des élèves pratiquent un sport.</p><p>Quel est le nombre de sportifs dans cette classe ?</p>
  <h4>Méthode 1 : utilisation d'un tableau</h4>
  ${ptab({h1:"Nombre d'élèves sportifs",h2:"Nombre d'élèves au total",r1:["60","!18"],r2:["100","30"]})}
  <p>• 60 % des élèves pratiquent un sport : si on avait 100 élèves au total dans la classe, 60 pratiqueraient un sport.</p><p>• On cherche le nombre de sportifs dans le cas où il y a 30 élèves dans la classe.</p>
  <p>Comme il s'agit d'un tableau de proportionnalité, on peut faire le produit en croix suivant :</p><p class="calc">${F("60 × 30",100)} = 18</p><p>Il y a donc 18 élèves qui pratiquent un sport dans la classe.</p>
  <h4>Méthode 2 : calcul</h4>
  <div class="retenir" data-l="Méthode"><p>Cette méthode est plus rapide que la précédente.</p><p>Prendre 60 % de 30 élèves, c'est faire 60 % × 30 = ${F(60,100)} × 30 (car 60 % = ${F(60,100)}).</p><p>Donc, avec P le nombre de sportifs :</p><p class="calc">P = ${F(60,100)} × 30<br>P = 0,6 × 30<br>P = 18</p><p>Il y a donc 18 élèves qui pratiquent un sport dans la classe.</p></div>`},
{k:"2", t:"Chercher un pourcentage", h:`
  <div class="retenir" data-l="Définition"><p>Calculer un pourcentage revient à écrire une proportion avec une fraction de dénominateur 100.</p></div>
  <p><b>Exercice :</b> dans un collège, parmi les 127 élèves de quatrième, 36 étudient l'allemand.</p><p>Quel est le pourcentage d'élèves de quatrième qui étudient l'allemand ?</p>
  <h4>Méthode 1 : utilisation d'un tableau</h4>
  ${ptab({h1:"Nombre d'élèves étudiant l'allemand",h2:"Nombre total d'élèves de 4e",r1:["36","!28"],r2:["127","100"]})}
  <p>• Sur 127 élèves de 4<sup>e</sup>, 36 pratiquent l'allemand.</p><p>• Chercher le pourcentage, c'est chercher le nombre d'élèves qui pratiquent l'allemand pour 100 élèves au total.</p>
  <p>Comme il s'agit d'un tableau de proportionnalité, on peut faire le produit en croix suivant :</p><p class="calc">${F("36 × 100",127)} ≈ 28</p><p>Sur 100 élèves, il y en a donc environ 28 qui étudient l'allemand : environ 28 % des élèves pratiquent l'allemand.</p>
  <h4>Méthode 2 : calcul</h4>
  <div class="retenir" data-l="Méthode"><p>Cette méthode est attendue en 4<sup>e</sup>, elle est plus rapide que la précédente.</p><p>Il y a 36 élèves sur 127 qui font de l'allemand : la proportion d'élèves qui font de l'allemand est égale à ${F(36,127)}.</p><p class="calc">p = ${F(36,127)}<br>p ≈ 0,28 (avec la calculatrice)<br>p ≈ ${F(28,100)}<br>p ≈ 28 %</p><p>Il y a donc environ 28 % des élèves qui pratiquent l'allemand.</p></div>`},
{k:"3", t:"Appliquer un pourcentage d'augmentation ou de réduction", h:`
  <h4>a) Appliquer un pourcentage d'augmentation</h4>
  <p><b>Exercice :</b> les tarifs d'une compagnie d'énergie augmentent de 9 %. La famille Dubois payait une facture annuelle de 570,00 €. Quel sera le montant de sa nouvelle facture ?</p>
  <div class="retenir" data-l="Méthode"><p><b>1)</b> On calcule 9 % de 570 € :</p><p class="calc">P = ${F(9,100)} × 570<br>P = 0,09 × 570<br>P = 51,3</p><p>La facture va donc augmenter de 51,30 € (51,30 € représente 9 % de 570 €).</p>
   <p><b>2)</b> Comme il s'agit d'une augmentation, on <b>ajoute</b> le résultat trouvé au prix initial :</p><p class="calc">570 + 51,3 = 621,3</p><p>Le nouveau montant de la facture est de 621,30 €.</p></div>
  <h4>b) Appliquer un pourcentage de réduction</h4>
  <p><b>Exercice :</b> Muriel fait les soldes. Elle voit un pantalon qui lui plaît à 35 €. Elle trouve que le prix est cher, mais elle se rend compte que ce pantalon est soldé à 20 %.</p><p>Quel est finalement le prix de ce pantalon ?</p>
  <div class="retenir" data-l="Méthode"><p><b>1)</b> On calcule 20 % de 35 € :</p><p class="calc">P = ${F(20,100)} × 35<br>P = 0,2 × 35<br>P = 7</p><p>Le prix du pantalon va donc baisser de 7 € (7 € représente 20 % de 35 €).</p>
   <p><b>2)</b> Comme il s'agit d'une baisse, on <b>enlève</b> le résultat trouvé au prix initial :</p><p class="calc">35 − 7 = 28</p><p>Le nouveau prix est de 28 €.</p></div>`},
{k:"4", t:"Chercher un pourcentage d'augmentation ou de réduction", h:`
  <h4>a) Chercher un pourcentage d'augmentation</h4>
  <p><b>Exercice :</b> entre mai 2019 et juin 2019, le prix du billet d'avion entre Nantes et Londres est passé de 215 € à 247,25 €. Quel est le pourcentage d'augmentation du billet ?</p>
  <p><b>Méthode 1 : utilisation d'un tableau</b></p>
  <p>• On commence par calculer l'augmentation : 247,25 − 215 = 32,25. Le prix a augmenté de 32,25 €.</p><p>• On fait un tableau de proportionnalité :</p>
  ${ptab({h1:"Augmentation (en €)",h2:"Prix initial (en €)",r1:["32,25","!15"],r2:["215","100"]})}
  <p>Pour un prix initial de 215 €, le prix du billet a augmenté de 32,25 €. Chercher le pourcentage, c'est chercher l'augmentation du prix du billet pour un prix initial de 100 €.</p>
  <p class="calc">${F("32,25 × 100",215)} = 15</p><p>Pour un prix initial de 100 €, le prix du billet a augmenté de 15 € : le prix du billet a augmenté de 15 %.</p>
  <div class="retenir" data-l="Méthode"><p><b>Méthode 2 : calcul</b> (attendue en 4<sup>e</sup>, plus rapide que la précédente)</p><p><b>1)</b> 247,25 − 215 = 32,25 : le prix a augmenté de 32,25 €.</p><p><b>2)</b> Le prix a augmenté de 32,25 € pour un prix initial de 215 €. La proportion d'augmentation sur le prix initial est égale à ${F("32,25",215)}.</p><p><b>3)</b> On calcule cette proportion p :</p><p class="calc">p = ${F("32,25",215)}<br>p = 0,15 (avec la calculatrice)<br>p = ${F(15,100)}<br>p = 15 %</p><p>Le pourcentage d'augmentation est donc de 15 % : le prix du billet a augmenté de 15 %.</p></div>
  <h4>b) Chercher un pourcentage de réduction</h4>
  <p><b>Exercice :</b> dans un magasin, le prix d'un jean est de 55,00 €. Pendant les soldes, il est à 35,75 €. Quel pourcentage de réduction a été appliqué sur ce jean ?</p>
  <p><b>Méthode 1 : utilisation d'un tableau</b></p>
  <p>• On commence par calculer la réduction : 55 − 35,75 = 19,25. Le prix a baissé de 19,25 €.</p><p>• On fait un tableau de proportionnalité :</p>
  ${ptab({h1:"Réduction (en €)",h2:"Prix initial (en €)",r1:["19,25","!35"],r2:["55","100"]})}
  <p>Pour un prix initial de 55 €, le prix a baissé de 19,25 €. Chercher le pourcentage de réduction, c'est chercher la réduction pour un prix initial de 100 €.</p>
  <p class="calc">${F("19,25 × 100",55)} = 35</p><p>Pour un prix initial de 100 €, le prix du jean a baissé de 35 € : le pourcentage de réduction est 35 %.</p>
  <div class="retenir" data-l="Méthode"><p><b>Méthode 2 : calcul</b> (attendue en 4<sup>e</sup>)</p><p><b>1)</b> 55 − 35,75 = 19,25 : le prix a baissé de 19,25 €.</p><p><b>2)</b> La proportion de réduction sur le prix initial est égale à ${F("19,25",55)}.</p><p><b>3)</b> On calcule cette proportion p :</p><p class="calc">p = ${F("19,25",55)}<br>p = 0,35 (avec la calculatrice)<br>p = ${F(35,100)}<br>p = 35 %</p><p>Le pourcentage de réduction est donc de 35 % : le prix du jean a baissé de 35 %.</p></div>
  <div class="attention"><b>ATTENTION :</b> on divise toujours l'augmentation (ou la réduction) par le prix <b>initial</b>.</div>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Appliquer un pourcentage", note:"Les exercices A à J sont les exercices du manuel que M. Staal avait donnés avec la fiche d'exercices.", e:[
  {n:"Exercice A", t:"Les poules rousses", w:"Sur ton cahier", h:`<p>Dans un poulailler de 75 poules, 60 % des poules sont rousses.</p><p>Combien y a-t-il de poules rousses ?</p>`,
   c:`<p><b>Méthode 1 :</b></p>${ptab({h1:"Nombre de poules rousses",h2:"Nombre total de poules",r1:["60","!45"],r2:["100","75"]})}<p class="calc">Produit en croix : ${F("60 × 75",100)} = 45</p>
   <p><b>Méthode 2 :</b> on calcule P, 60 % de 75 poules :</p><p class="calc">P = ${F(60,100)} × 75<br>P = 0,60 × 75<br>P = 45</p><p>Il y a donc <b>45 poules rousses</b>.</p>`},
  {n:"Exercice B", t:"Les filles du club", w:"Sur ton cahier", h:`<p>Un club sportif compte 225 licenciés. 36 % des licenciés sont des filles.</p><p>Combien de filles sont licenciées dans ce club ?</p>`,
   c:`<p><b>Méthode 1 :</b></p>${ptab({h1:"Nombre de filles",h2:"Nombre total de licenciés",r1:["36","!81"],r2:["100","225"]})}<p class="calc">Produit en croix : ${F("36 × 225",100)} = 81</p>
   <p><b>Méthode 2 :</b> on calcule P, 36 % de 225 licenciés :</p><p class="calc">P = ${F(36,100)} × 225<br>P = 0,36 × 225<br>P = 81</p><p>Il y a donc <b>81 filles licenciées</b>.</p>`},
  {n:"Exercice C", t:"Le sucre", w:"Sur ton cahier", h:`<p>Léa prépare un gâteau de 800 g. Le sucre représente 15 % de la masse du gâteau.</p><p>Quelle masse de sucre a-t-elle utilisée ?</p>`,
   c:`<p>On peut utiliser les deux méthodes. Voici la deuxième (attendue en 4<sup>e</sup>).</p><p>On calcule 15 % de 800 grammes :</p><p class="calc">P = ${F(15,100)} × 800<br>P = 0,15 × 800<br>P = 120</p><p>Elle a utilisé <b>120 g de sucre</b>.</p>`},
  {n:"Exercice 1", t:"Le paquet de biscuits", w:"Sur ton cahier", h:`<p>Sur un paquet de biscuits, on a relevé les informations suivantes :</p>${BISC("3,6","15","81,4",24)}<p>Quelle est la masse de matières grasses ?</p>`,
   c:`<p>On calcule 3,6 % de 24 grammes :</p><p class="calc">P = ${F("3,6",100)} × 24<br>P = 0,036 × 24<br>P = 0,864</p><p>Il y a <b>0,864 g de matières grasses</b> dans un biscuit.</p>`}
 ]},
{t:"Chercher un pourcentage", e:[
  {n:"Exercice D", t:"Les vaches noires", w:"Sur ton cahier", h:`<p>Dans une ferme, 36 vaches sur 45 sont noires.</p><p>Quel est le pourcentage de vaches noires dans cette ferme ?</p>`,
   c:`<p><b>Méthode 1 :</b></p>${ptab({h1:"Nombre de vaches noires",h2:"Nombre total de vaches",r1:["36","!80"],r2:["45","100"]})}<p class="calc">Produit en croix : ${F("36 × 100",45)} = 80</p>
   <p><b>Méthode 2 :</b> il y a 36 vaches sur 45 qui sont noires : la proportion de vaches noires est égale à ${F(36,45)}.</p><p class="calc">p = ${F(36,45)}<br>p = 0,8<br>p = ${F(80,100)}<br>p = 80 %</p><p>Il y a donc <b>80 % de vaches noires</b> dans cette ferme.</p>`},
  {n:"Exercice E", t:"Les filles d'un autre club", w:"Sur ton cahier", h:`<p>Un club compte 320 licenciés, dont 144 filles.</p><p>Quel est le pourcentage de filles dans ce club ?</p>`,
   c:`<p><b>Méthode 1 :</b></p>${ptab({h1:"Nombre de filles",h2:"Nombre total de licenciés",r1:["144","!45"],r2:["320","100"]})}<p class="calc">Produit en croix : ${F("144 × 100",320)} = 45</p>
   <p><b>Méthode 2 :</b> la proportion de filles licenciées est égale à ${F(144,320)}.</p><p class="calc">p = ${F(144,320)}<br>p = 0,45<br>p = ${F(45,100)}<br>p = 45 %</p><p>Il y a donc <b>45 % de filles</b> dans ce club.</p>`},
  {n:"Exercice F", t:"L'élection du délégué", w:"Sur ton cahier", h:`<p>Pour élire le délégué de la classe, les 28 élèves ont voté.</p>${tab(["Candidat","Claire","Martin","Léo"],[["Nombre de voix","15","8","5"]])}<p>Calcule le pourcentage de voix obtenu par chaque candidat. Arrondis à l'unité.</p>`,
   c:`<p>On peut utiliser les deux méthodes. Voici la deuxième (attendue en 4<sup>e</sup>).</p>
   <p>• Claire : 15 élèves sur 28, la proportion p est :</p><p class="calc">p = ${F(15,28)}<br>p ≈ 0,54<br>p ≈ ${F(54,100)}<br>p ≈ 54 %</p><p>Environ <b>54 %</b> des élèves ont voté pour Claire.</p>
   <p>• Martin :</p><p class="calc">p = ${F(8,28)}<br>p ≈ 0,29<br>p ≈ ${F(29,100)}<br>p ≈ 29 %</p><p>Environ <b>29 %</b> des élèves ont voté pour Martin.</p>
   <p>• Léo :</p><p class="calc">p = ${F(5,28)}<br>p ≈ 0,18<br>p ≈ ${F(18,100)}<br>p ≈ 18 %</p><p>Environ <b>18 %</b> des élèves ont voté pour Léo.</p>
   <p><b>Remarque :</b> 54 % + 29 % + 18 % = 101 %. On ne trouve pas exactement 100 % car les pourcentages ont été arrondis.</p>`}
 ]},
{t:"Appliquer un pourcentage d'augmentation ou de réduction", e:[
  {n:"Exercice 2", t:"Différentes situations", w:"Sur ton cahier", h:`<p><b>Problème 1 –</b> Pendant les soldes, Sophie achète un pantalon qui a une réduction de 20 %. Ce pantalon coûte à la base 44,95 €. Combien Sophie va-t-elle le payer ?</p>
   <p><b>Problème 2 –</b> Le salaire de Paul était de 1 450 € en 2014. Depuis, il a augmenté de 8 %. Combien gagne-t-il aujourd'hui ?</p>
   <p><b>Problème 3 –</b> Une voiture perd 17,5 % de sa valeur chaque année. Le 1<sup>er</sup> janvier 2018, Olivier achète sa voiture à 25 000 €. Quelle sera sa valeur au 1<sup>er</sup> janvier 2019 ?</p>`,
   c:`<p><b>Problème 1 :</b> on calcule P, 20 % de 44,95 € :</p><p class="calc">P = ${F(20,100)} × 44,95<br>P = 0,20 × 44,95<br>P = 8,99</p>${ptab({h1:"Remise (en €)",h2:"Prix initial (en €)",r1:["20","!8,99"],r2:["100","44,95"]})}<p>La réduction est de 8,99 €. 44,95 − 8,99 = 35,96 : le pantalon coûte <b>35,96 €</b>.</p>
   <p><b>Problème 2 :</b> on calcule 8 % de 1 450 € : 0,08 × 1 450 = 116. L'augmentation est de 116 €.</p><p>1 450 + 116 = 1 566 : il gagne maintenant <b>1 566 €</b>.</p>
   <p><b>Problème 3 :</b> on calcule P, 17,5 % de 25 000 € :</p><p class="calc">P = ${F("17,5",100)} × 25 000<br>P = 0,175 × 25 000<br>P = 4 375</p><p>La baisse est de 4 375 €.</p><p>25 000 − 4 375 = 20 625 : la voiture vaudra <b>20 625 €</b>.</p>`},
  {n:"Exercice G", t:"La moyenne de la classe", w:"Sur ton cahier", h:`<p>La moyenne générale d'une classe était de 12,5.</p><p>Au trimestre suivant, elle a augmenté de 12 %.</p><p>Quelle est la nouvelle moyenne de la classe ?</p>`,
   c:`<p>On calcule P, 12 % de 12,5 :</p><p class="calc">P = ${F(12,100)} × 12,5<br>P = 0,12 × 12,5<br>P = 1,5</p><p>La moyenne a donc augmenté de 1,5 point.</p><p>12,5 + 1,5 = 14 : la moyenne est maintenant de <b>14</b>.</p>`}
 ]},
{t:"Chercher un pourcentage d'augmentation ou de réduction", e:[
  {n:"Exercice H", t:"Les chaussures", w:"Sur ton cahier", h:`<p>Une paire de chaussures coûtait 58 €. Son prix a augmenté de 7,25 €.</p><p>Quel est le pourcentage d'augmentation du prix de ces chaussures ?</p>`,
   c:`<p><b>Méthode 1 :</b></p>${ptab({h1:"Augmentation (en €)",h2:"Prix initial (en €)",r1:["7,25","!12,5"],r2:["58","100"]})}<p class="calc">Produit en croix : ${F("7,25 × 100",58)} = 12,5</p>
   <p><b>Méthode 2 :</b> l'augmentation est de 7,25 € pour un prix initial de 58 € : la proportion d'augmentation est ${F("7,25",58)}.</p><p class="calc">p = ${F("7,25",58)}<br>p = 0,125<br>p = ${F("12,5",100)}<br>p = 12,5 %</p><p>Le prix de ces chaussures a augmenté de <b>12,5 %</b>.</p>`},
  {n:"Exercice I", t:"La remise", w:"Sur ton cahier", h:`<p>Sur un article qui coûte 340 €, un vendeur fait une remise de 60 €.</p><p>Quel est le pourcentage de réduction ? Arrondis à l'unité.</p>`,
   c:`<p><b>Méthode 1 :</b></p>${ptab({h1:"Remise (en €)",h2:"Prix initial (en €)",r1:["60","!18"],r2:["340","100"]})}<p class="calc">Produit en croix : ${F("60 × 100",340)} ≈ 18</p>
   <p><b>Méthode 2 :</b> la proportion de réduction est ${F(60,340)}.</p><p class="calc">p = ${F(60,340)}<br>p ≈ 0,18<br>p ≈ ${F(18,100)}<br>p ≈ 18 %</p><p>Le pourcentage de baisse est d'environ <b>18 %</b>.</p>`},
  {n:"Exercice J", t:"Les lunettes", w:"Sur ton cahier", h:`<p>Une paire de lunettes coûtait 28 €. Elle est maintenant vendue 18,20 €.</p><p>Quel est le pourcentage de réduction ?</p>`,
   c:`<p>28 − 18,2 = 9,8 : le prix a baissé de 9,80 €.</p><p>La proportion de la réduction par rapport au prix initial est égale à ${F("9,8",28)}.</p><p class="calc">p = ${F("9,8",28)}<br>p = 0,35<br>p = ${F(35,100)}<br>p = 35 %</p><p>Le pourcentage de réduction est de <b>35 %</b>.</p>`},
  {n:"Exercice 3", t:"Différentes situations (2)", w:"Sur ton cahier", h:`<p><b>Problème 1 –</b> La famille LORDIER n'a pas réussi à diminuer sa consommation. Elle a utilisé 225 m³ d'eau en 2017 et 234 m³ en 2018.</p><p>Quel est le pourcentage d'augmentation de cette consommation ?</p>
   <p><b>Problème 2 –</b> En 40 ans, la surface de la forêt amazonienne est passée de 6,25 millions à 5,5 millions de km². Exprime cette diminution en pourcentage.</p>`,
   c:`<p><b>Problème 1 :</b> 234 − 225 = 9. En un an, la consommation a augmenté de 9 m³.</p><p>La proportion d'augmentation par rapport à la consommation initiale est ${F(9,225)}.</p><p class="calc">p = ${F(9,225)}<br>p = 0,04<br>p = ${F(4,100)}<br>p = 4 %</p><p>Leur consommation a augmenté de <b>4 %</b>.</p>
   <p><b>Problème 2 :</b> 6,25 − 5,5 = 0,75. En 40 ans, la surface a diminué de 0,75 million de km².</p><p>La proportion de diminution par rapport à la surface initiale est ${F("0,75","6,25")}.</p><p class="calc">p = ${F("0,75","6,25")}<br>p = 0,12<br>p = ${F(12,100)}<br>p = 12 %</p><p>En 40 ans, la surface de la forêt amazonienne a diminué de <b>12 %</b>.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Appliquer un pourcentage", schema:S_APP, q:{
 1:[ {g:()=>{ const t=pick([10,20,25,50,30,40,60,75]), q=pick([20,40,60,80,120,200,240,300]); return {q:`Calcule ${t} % de ${q}.`, rep:ans(t*q/100), ex:`<br>P = ${F(t,100)} × ${q}<br>P = ${N(t/100)} × ${q}<br>P = ${N(t*q/100)}`, sx:S_APP}; }},
     {g:()=>{ const t=pick([5,8,12,15,35,60,75,3]); return {q:`${t} % est égal à…`, c:uniq(N(t/100),[N(t/10),N(t),N(t/1000)]), rep:N(t/100), ex:`${t} % = ${F(t,100)} = ${N(t/100)}.`, sx:S_APP}; }} ],
 2:[ {g:()=>{ let t,n; do{ t=pick([15,35,45,12,36,64]); n=pick([20,25,50,75,200,225,300,400]); }while(!Number.isInteger(rd(t*n/100,6))); return {q:`Dans un club de ${n} licenciés, ${t} % sont des filles. Combien y a-t-il de filles ?`, rep:ans(t*n/100), ex:`${N(t/100)} × ${n} = ${N(t*n/100)}.`, sx:S_APP}; }} ],
 3:[ {g:()=>{ const t=pick([2.5,3.6,4.5,7.5,12.5,17.5]), q=pick([24,40,80,120,250,1000]); return {q:`Calcule ${N(t)} % de ${q}.`, rep:ans(t*q/100), ex:`<br>P = ${F(N(t),100)} × ${q}<br>P = ${N(t/100)} × ${q}<br>P = ${N(t*q/100)}`, sx:S_APP}; }} ]
}},
{nom:"Chercher un pourcentage", schema:S_CH, q:{
 1:[ {g:()=>{ const n=pick([20,25,50]), k=ri(2,n-1); return {q:`${k} élèves sur ${n} font du sport. Quel pourcentage d'élèves font du sport ?`, rep:pct(k*100/n), ex:`<br>p = ${F(k,n)}<br>p = ${N(k/n)}<br>p = ${F(N(k*100/n),100)}<br>p = ${N(k*100/n)} %`, sx:S_CH}; }} ],
 2:[ {g:()=>{ const n=pick([40,45,60,80,120,160,320]); let k; do{ k=ri(2,n-1); }while(!Number.isInteger(rd(k*100/n,6))); return {q:`Dans une ferme, ${k} vaches sur ${n} sont noires. Quel est le pourcentage de vaches noires ?`, rep:pct(k*100/n), ex:`<br>p = ${F(k,n)}<br>p = ${N(k/n)}<br>p = ${N(k*100/n)} %`, sx:S_CH}; }} ],
 3:[ {g:()=>{ let n,k; do{ n=ri(21,140); k=ri(3,n-2); }while(exact(k/n)); const p=Math.round(k*100/n); return {q:`${k} élèves sur ${n} étudient l'allemand. Quel est le pourcentage (arrondi à l'unité) ?`, rep:pct(p), ex:`<br>p = ${F(k,n)}<br>p ≈ ${N(p/100)}<br>p ≈ ${p} %`, sx:S_CH}; }},
     {q:"Pour 15 voix sur 28, 8 sur 28 et 5 sur 28, on trouve 54 %, 29 % et 18 % (arrondis). Pourquoi la somme ne fait-elle pas 100 % ?", c:["Les pourcentages sont arrondis","Il y a une erreur de calcul","On a oublié un candidat"], rep:"Les pourcentages sont arrondis", ex:"Chaque pourcentage est arrondi à l'unité : la somme des arrondis peut faire 99 % ou 101 %.", sx:S_CH} ]
}},
{nom:"Augmentation et réduction", schema:S_EVO, q:{
 1:[ {g:()=>{ const t=pick([10,20,25,30,50]), p=pick([20,30,40,60,80,120]); return {q:`Un pantalon à ${p} € est soldé à ${t} %. Quel est son nouveau prix ?`, rep:ans(p*(100-t)/100,"€"), ex:`${t} % de ${p} = ${E(p*t/100)} €. ${p} − ${E(p*t/100)} = ${E(p*(100-t)/100)} €.`, sx:S_EVO}; }} ],
 2:[ {g:()=>{ const t=pick([2,4,5,8,9,12,15]), p=pick([150,250,400,570,1200,1450]); return {q:`Une facture de ${N(p)} € augmente de ${t} %. Quel est le nouveau montant ?`, rep:ans(p*(100+t)/100,"€"), ex:`${t} % de ${N(p)} = ${E(p*t/100)} €. ${N(p)} + ${E(p*t/100)} = ${E(p*(100+t)/100)} €.`, sx:S_EVO}; }} ],
 3:[ {g:()=>{ const t=pick([12.5,17.5,7.5,15]), p=pick([2000,8000,12000,25000]); return {q:`Une voiture achetée ${N(p)} € perd ${N(t)} % de sa valeur en un an. Que vaut-elle après un an ?`, rep:ans(p*(100-t)/100,"€"), ex:`${N(t)} % de ${N(p)} :<br>P = ${N(t/100)} × ${N(p)}<br>P = ${N(p*t/100)} €<br>${N(p)} − ${N(p*t/100)} = ${N(p*(100-t)/100)} €.`, sx:S_EVO}; }},
     {g:()=>{ const t=pick([10,20,25]), p=pick([40,60,80,100]); const good=E(p*(100-t)/100); return {q:`Un article à ${p} € baisse de ${t} %. Quel calcul donne directement le nouveau prix ?`, c:uniq(`${p} × ${N((100-t)/100)}`,[`${p} × ${N(t/100)}`,`${p} − ${t}`,`${p} × ${N((100+t)/100)}`]), rep:`${p} × ${N((100-t)/100)}`, ex:`On garde ${100-t} % du prix : ${p} × ${N((100-t)/100)} = ${good} €.`, sx:S_EVO}; }} ]
}},
{nom:"Chercher un pourcentage d'évolution", schema:S_PEV, q:{
 1:[ {g:()=>{ const p=pick([20,40,50,80,100,200]), t=pick([10,20,25,50]); return {q:`Un prix passe de ${p} € à ${E(p*(100+t)/100)} €. Quel est le pourcentage d'augmentation ?`, rep:pct(t), ex:`Augmentation : ${E(p*t/100)} €.<br>p = ${F(E(p*t/100),p)}<br>p = ${N(t/100)}<br>p = ${t} %`, sx:S_PEV}; }} ],
 2:[ {g:()=>{ const p=pick([28,40,55,60,75,120]), t=pick([5,15,20,35,40]); const n=p*(100-t)/100; return {q:`Un jean passe de ${E(p)} € à ${E(n)} € pendant les soldes. Quel est le pourcentage de réduction ?`, rep:pct(t), ex:`Réduction : ${E(p)} − ${E(n)} = ${E(p-n)} €.<br>p = ${F(E(p-n),E(p))}<br>p = ${N(t/100)}<br>p = ${t} %`, sx:S_PEV}; }} ],
 3:[ {g:()=>{ const p=pick([215,58,225,64,90,250]), t=pick([4,12.5,15,7.5,2.5]); const n=rd(p*(100+t)/100,4); if(!exact(n)) return {q:"Un prix passe de 215 € à 247,25 €. Quel est le pourcentage d'augmentation ?", rep:pct(15), ex:"<br>p = 32,25 ÷ 215<br>p = 0,15<br>p = 15 %", sx:S_PEV};
       return {q:`Une consommation passe de ${N(p)} à ${N(n)}. Quel est le pourcentage d'augmentation ?`, rep:pct(t), ex:`${N(n)} − ${N(p)} = ${N(n-p)}.<br>p = ${F(N(n-p),N(p))}<br>p = ${N(t/100)}<br>p = ${N(t)} %`, sx:S_PEV}; }},
     {q:"Pour calculer un pourcentage de réduction, je divise la réduction par…", c:["le prix initial","le nouveau prix","100"], rep:"le prix initial", ex:"La proportion de réduction se calcule sur le prix initial.", sx:S_PEV} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 15", duree:50, info:"Durée : 50 min · Calculatrice autorisée · Les calculs doivent être écrits et les réponses rédigées par une phrase",
comp:[
  ["CALCULER","J'applique un pourcentage à une quantité.","Ex. 1 (4 points)"],
  ["CALCULER","Je calcule un pourcentage.","Ex. 2 (4 points)"],
  ["MODÉLISER","J'applique un pourcentage d'augmentation ou de réduction.","Ex. 3 (5 points)"],
  ["RAISONNER","Je calcule un pourcentage d'augmentation ou de réduction et je compare des offres.","Ex. 4 et 5 (7 points)"]
],
exos:[
{t:"Appliquer un pourcentage", p:4, h:`<p>a) Dans un collège de 240 élèves, 35 % des élèves sont demi-pensionnaires. Combien y a-t-il de demi-pensionnaires ?</p><p>b) Un yaourt de 60 g contient 4,5 % de matières grasses. Quelle masse de matières grasses contient-il ?</p><p>c) Calcule 12 % de 1 250 €.</p><p>d) Calcule 75 % de 36.</p>`,
 c:`<p>a) 0,35 × 240 = 84 : il y a 84 demi-pensionnaires. <i>(1 point)</i></p><p>b) 0,045 × 60 = 2,7 : le yaourt contient 2,7 g de matières grasses. <i>(1 point)</i></p><p>c) 0,12 × 1 250 = 150 € <i>(1 point)</i></p><p>d) 0,75 × 36 = 27 <i>(1 point)</i></p>`},
{t:"Chercher un pourcentage", p:4, h:`<p>a) Dans une classe de 35 élèves, 21 ont un animal de compagnie. Quel pourcentage des élèves ont un animal ?</p><p>b) Lors d'un sondage, 132 personnes sur 480 ont répondu « oui ». Quel est le pourcentage de « oui » ?</p><p>c) Au basket, Noé a réussi 17 tirs sur 52. Quel est son pourcentage de réussite ? Arrondis à l'unité.</p>`,
 c:`<p>a)</p><p class="calc">p = ${F(21,35)}<br>p = 0,6<br>p = ${F(60,100)}<br>p = 60 %</p><p><i>(1 point)</i></p><p>b)</p><p class="calc">p = ${F(132,480)}<br>p = 0,275<br>p = ${F("27,5",100)}<br>p = 27,5 %</p><p><i>(1,5 point)</i></p><p>c)</p><p class="calc">p = ${F(17,52)}<br>p ≈ 0,33<br>p ≈ ${F(33,100)}<br>p ≈ 33 %</p><p>Noé a réussi environ 33 % de ses tirs. <i>(1,5 point)</i></p>`},
{t:"Augmentation ou réduction", p:5, h:`<p>a) Un vélo coûte 380 €. Pendant les soldes, il bénéficie d'une réduction de 15 %. Quel est son prix soldé ?</p><p>b) Un loyer de 640 € augmente de 2,5 %. Quel est le nouveau loyer ?</p><p>c) Une ville de 8 400 habitants a perdu 3 % de ses habitants en un an. Combien d'habitants compte-t-elle maintenant ?</p>`,
 c:`<p>a) 0,15 × 380 = 57 € de réduction ; 380 − 57 = 323 : le vélo coûte 323 €. <i>(2 points)</i></p><p>b) 0,025 × 640 = 16 € d'augmentation ; 640 + 16 = 656 : le loyer est de 656 €. <i>(1,5 point)</i></p><p>c) 0,03 × 8 400 = 252 habitants en moins ; 8 400 − 252 = 8 148 habitants. <i>(1,5 point)</i></p>`},
{t:"Chercher une évolution", p:4, h:`<p>a) Le prix d'une place de concert passe de 45 € à 54 €. Calcule le pourcentage d'augmentation.</p><p>b) Un abonnement passe de 32 € à 27,20 €. Calcule le pourcentage de réduction.</p>`,
 c:`<p>a) 54 − 45 = 9 € d'augmentation.</p><p class="calc">p = ${F(9,45)}<br>p = 0,2<br>p = ${F(20,100)}<br>p = 20 %</p><p>Le prix a augmenté de 20 %. <i>(2 points)</i></p><p>b) 32 − 27,20 = 4,80 € de réduction.</p><p class="calc">p = ${F("4,8",32)}<br>p = 0,15<br>p = ${F(15,100)}<br>p = 15 %</p><p>Le prix a baissé de 15 %. <i>(2 points)</i></p>`},
{t:"Le meilleur prix", p:3, h:`<p>Hugo veut acheter le même casque audio. Il hésite entre deux magasins :</p>${tab(["Magasin A","Magasin B"],[["80 € avec 25 % de réduction","75 € avec 18 % de réduction"]])}<p>Dans quel magasin le casque est-il le moins cher ? Justifie.</p>`,
 c:`<p>Magasin A : 0,25 × 80 = 20 € ; 80 − 20 = 60 €. <i>(1 point)</i></p><p>Magasin B : 0,18 × 75 = 13,50 € ; 75 − 13,50 = 61,50 €. <i>(1 point)</i></p><p>60 € &lt; 61,50 € : le casque est moins cher dans le magasin A. <i>(1 point)</i></p>`}
]}
};
})();
