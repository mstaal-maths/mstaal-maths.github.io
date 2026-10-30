/* 6e — Chapitre 20 : Proportions et pourcentages (cours et fiche d'exercices de M. Staal) */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const co = (p,alt,w) => img("c620co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("c620ex/"+p+".png", alt, w);
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const F = (a,b) => `{${a}/${b}}`;
const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g," ");
const D = (n,k=0) => { const s=String(Math.abs(n)).padStart(k+1,"0"); const a=s.slice(0,s.length-k); let b=k?s.slice(-k):""; b=b.replace(/0+$/,""); return (n<0?"−":"")+sp(+a)+(b?","+b:""); };

/* carré de 100 carreaux, n carreaux coloriés (ligne par ligne) */
function cent(n, o={}){ const c=o.c||15, W=10*c+4; let s=`<svg class="fig" viewBox="0 0 ${W} ${W}" width="${W}" role="img" aria-label="${n} carreaux coloriés sur 100">`;
  for(let i=0;i<100;i++){ const x=2+(i%10)*c, y=2+Math.floor(i/10)*c; s+=`<rect x="${x}" y="${y}" width="${c}" height="${c}" style="fill:${i<n?(o.col||"#9fc3ea"):"#fff"};stroke:#888;stroke-width:.8"/>`; }
  return s+`<rect x="2" y="2" width="${10*c}" height="${10*c}" style="fill:none;stroke:#222;stroke-width:2"/></svg>`; }
window.FIG20 = {cent, D, F};
/* calculs en chaîne : une étape par ligne, chaque ligne commence par « A = » (ou « P = », « l = »…) */
const KC = (nm, st, lab) => `<p class="calc">${st.map((t,i)=>(i===0&&lab?lab+" ":"")+nm+(t[0]==="≈"?" ≈ "+t.slice(1).trim():" = "+t)).join("<br>")}</p>`;
const KCS = arr => `<div class="calcs">${arr.map(x=>`<div>${x}</div>`).join("")}</div>`;

/* ---------- schémas ---------- */
const S_SENS = sch("Le sens d'un pourcentage", cent(30,{c:12})+`<p class="calc">30 % = ${F(30,100)} = 0,3</p><p class="schN">30 parts sur 100.</p>`);
const S_USU = sch("Les pourcentages usuels", `<div class="scroll"><table class="std"><tbody><tr><th>%</th><td>100 %</td><td>75 %</td><td>50 %</td><td>25 %</td><td>20 %</td><td>10 %</td><td>1 %</td></tr><tr><th>fraction</th><td>1</td><td>${F(3,4)}</td><td>${F(1,2)}</td><td>${F(1,4)}</td><td>${F(1,5)}</td><td>${F(1,10)}</td><td>${F(1,100)}</td></tr><tr><th>décimal</th><td>1</td><td>0,75</td><td>0,5</td><td>0,25</td><td>0,2</td><td>0,1</td><td>0,01</td></tr></tbody></table></div>`);
const S_PROP = sch("Calculer une proportion", `<p class="calc">${F(10,25)} = ${F(40,100)} = 0,4 = 40 %</p><p class="schN">Proportion = effectif de la partie ÷ effectif total. Pour comparer, on compare les pourcentages, pas les effectifs.</p>`);
const S_APP = sch("Appliquer un pourcentage", `<p class="calc">p % de N = N × p ÷ 100</p>${KC("A",["13 % de 225 €","225 × 13 ÷ 100","29,25 €"])}<p class="schN">De tête : 50 % = la moitié, 25 % = le quart, 10 % = le dixième.</p>`);

CH["6e-20"] = {
intro:"Le sens d'un pourcentage et les pourcentages usuels, calculer une proportion, appliquer un pourcentage de tête ou par le calcul, et donner un ordre de grandeur.",
savoir:[
  "comprendre ce que signifie un pourcentage, et connaître les pourcentages usuels ;",
  "calculer une proportion et l'écrire sous forme de fraction, de nombre décimal ou de pourcentage ;",
  "appliquer un pourcentage à un nombre ou à une grandeur, de tête ou par le calcul ;",
  "donner un ordre de grandeur d'un pourcentage."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Le sens d'un pourcentage", h:`
  <div class="cpt"><div><div class="retenir" data-l="Définition"><p>Un <b>pourcentage</b> est une proportion exprimée « sur 100 ». C'est un nombre : 30 % se lit « 30 pour cent » et signifie 30 parts sur 100.</p><p class="calc">30 % = ${F(30,100)} = 0,3</p></div><p>Ici, 30 carreaux sur 100 sont coloriés : 30 % du carré est colorié.</p></div>${cent(30)}</div>
  <p><b>Exemple :</b> « 60 % des habitants d'une ville ont un vélo » signifie que, sur 100 habitants, 60 ont un vélo.</p>
  <h4>Les pourcentages à connaître</h4>
  <div class="retenir" data-l="À retenir"><div class="scroll"><table class="std"><thead><tr><th>Pourcentage</th><th>100 %</th><th>75 %</th><th>50 %</th><th>25 %</th><th>20 %</th><th>10 %</th><th>1 %</th></tr></thead><tbody><tr><th>Fraction</th><td>${F(100,100)} = 1</td><td>${F(3,4)}</td><td>${F(1,2)}</td><td>${F(1,4)}</td><td>${F(1,5)}</td><td>${F(1,10)}</td><td>${F(1,100)}</td></tr><tr><th>Décimal</th><td>1</td><td>0,75</td><td>0,5</td><td>0,25</td><td>0,2</td><td>0,1</td><td>0,01</td></tr><tr><th>En mots</th><td>le tout</td><td>les trois quarts</td><td>la moitié</td><td>le quart</td><td>le cinquième</td><td>le dixième</td><td>le centième</td></tr></tbody></table></div></div>`},
{k:"II", t:"Calculer une proportion", h:`
  <div class="retenir" data-l="Définition"><p>La <b>proportion</b> d'une partie dans un tout est le quotient : <span class="calc">${F("effectif de la partie","effectif total")}</span>. On peut l'écrire sous forme de fraction, de nombre décimal ou de pourcentage.</p></div>
  <p><b>Exemple :</b> dans une classe de 25 élèves, 10 sont demi-pensionnaires. La proportion de demi-pensionnaires est ${F(10,25)} = ${F(40,100)} = 0,4 = 40 % (on a multiplié 10 et 25 par 4 pour obtenir 100 au dénominateur).</p>
  <p class="attention"><b>ATTENTION :</b> pour comparer deux proportions, on ne compare pas les effectifs : on compare les fractions, ou mieux les pourcentages.</p>`},
{k:"III", t:"Appliquer un pourcentage", h:`
  <div class="retenir" data-l="Propriété"><p>Prendre p % d'un nombre, c'est le multiplier par ${F("p",100)} :</p><p class="calc">p % de N = N × p ÷ 100</p></div>
  <p><b>Exemples :</b></p>${KCS([KC("A",["13 % de 225 €","225 × 13 ÷ 100","2 925 ÷ 100","29,25 €"]), KC("B",["24 % de 775 élèves","775 × 24 ÷ 100","18 600 ÷ 100","186 élèves"])])}
  <h4>Calcul mental</h4>
  <p>On utilise les pourcentages usuels. Pour 120 élèves :</p><ul><li>50 % de 120 = la moitié de 120 = 120 ÷ 2 = 60 ;</li><li>25 % de 120 = le quart de 120 = 120 ÷ 4 = 30 ;</li><li>10 % de 120 = le dixième de 120 = 120 ÷ 10 = 12 ;</li><li>20 % de 120 = 2 × 10 % de 120 = 2 × 12 = 24.</li></ul>
  <p><b>Remarque :</b> la moitié de 28, 28 × ${F(1,2)} et 50 % de 28 sont trois écritures du même nombre : 14.</p>
  <h4>Ordre de grandeur</h4>
  <p><b>Exemple :</b> 48 % de 60,45 € est proche de 50 % de 60 €, c'est-à-dire de la moitié de 60 € : environ 30 €.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Le sens d'un pourcentage", e:[
  {n:"Activité 1", t:"Le carré de 100", w:"Sur ta feuille", h:`<p>Chaque grand carré est partagé en 100 carreaux. Pour chacun, écris la part coloriée sous forme de fraction sur 100, puis de pourcentage.</p>${ex("act1","Quatre carrés de 100 carreaux en partie coloriés",490)}`,
   c:`<p>a) ${F(25,100)} = <b>25 %</b> · b) ${F(50,100)} = <b>50 %</b> (un carreau sur deux) · c) ${F(10,100)} = <b>10 %</b> (la diagonale) · d) ${F(73,100)} = <b>73 %</b> (7 lignes de 10 et 3 carreaux)</p>`},
  {n:"Exercice 1", t:"À toi de colorier", w:"Sur ta feuille", h:`<p>Colorie le pourcentage demandé de chaque carré : a) 40 % · b) 15 % · c) 75 %.</p><div class="figs">${[40,15,75].map((q,i)=>`<figure><figcaption>${"abc"[i]}) ${q} %</figcaption>${cent(0,{c:18}).replace("0 carreaux coloriés sur 100","Un carré de 100 carreaux à colorier")}</figure>`).join("")}</div>`,
   c:`<div class="figs"><figure><figcaption>a) 40 carreaux</figcaption>${cent(40,{c:12})}</figure><figure><figcaption>b) 15 carreaux</figcaption>${cent(15,{c:12})}</figure><figure><figcaption>c) 75 carreaux</figcaption>${cent(75,{c:12})}</figure></div><p><i>N'importe quels carreaux conviennent, pourvu qu'il y en ait le bon nombre.</i></p>`},
  {n:"Exercice 2", t:"Différentes écritures", w:"Sur ta feuille", h:`<p>Complète le tableau.</p><div class="scroll"><table class="std"><thead><tr><th>Pourcentage</th><th>Fraction sur 100</th><th>Fraction simple</th><th>Nombre décimal</th><th>En mots</th></tr></thead><tbody><tr><td>50 %</td><td></td><td></td><td></td><td></td></tr><tr><td></td><td>${F(25,100)}</td><td></td><td></td><td></td></tr><tr><td></td><td></td><td>${F(1,10)}</td><td></td><td></td></tr><tr><td></td><td></td><td></td><td>0,75</td><td></td></tr><tr><td>20 %</td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td>le centième</td></tr></tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Pourcentage</th><th>Fraction sur 100</th><th>Fraction simple</th><th>Nombre décimal</th><th>En mots</th></tr></thead><tbody><tr><td>50 %</td><td>${F(50,100)}</td><td>${F(1,2)}</td><td>0,5</td><td>la moitié</td></tr><tr><td>25 %</td><td>${F(25,100)}</td><td>${F(1,4)}</td><td>0,25</td><td>le quart</td></tr><tr><td>10 %</td><td>${F(10,100)}</td><td>${F(1,10)}</td><td>0,1</td><td>le dixième</td></tr><tr><td>75 %</td><td>${F(75,100)}</td><td>${F(3,4)}</td><td>0,75</td><td>les trois quarts</td></tr><tr><td>20 %</td><td>${F(20,100)}</td><td>${F(1,5)}</td><td>0,2</td><td>le cinquième</td></tr><tr><td>1 %</td><td>${F(1,100)}</td><td>${F(1,100)}</td><td>0,01</td><td>le centième</td></tr></tbody></table></div>`},
  {n:"Exercice 3", t:"Que veulent dire ces phrases ?", w:"Sur ton cahier", h:`<p>Explique chaque phrase avec tes mots.</p><p>a) 35 % des élèves du collège viennent en bus. · b) Ce chocolat contient 70 % de cacao. · c) La batterie de mon téléphone est chargée à 100 %. · d) Pendant les soldes, ce magasin fait une remise de 50 % sur tous les jeux.</p>`,
   c:`<p>a) Sur 100 élèves du collège, 35 viennent en bus.</p><p>b) Dans 100 g de ce chocolat, il y a 70 g de cacao.</p><p>c) La batterie est entièrement chargée (le tout).</p><p>d) Pour chaque jeu, on paie seulement la moitié du prix.</p>`},
  {n:"Exercice 4", t:"Vrai ou faux ?", w:"Sur ta feuille", h:`<p>a) 50 %, c'est la moitié. · b) 25 %, c'est le quart. · c) 10 % = ${F(1,100)} · d) 75 % = 0,75 · e) 20 %, c'est le cinquième. · f) 1 % = 0,1</p>`,
   c:`<p>a) <b>Vrai</b> : 50 % = ${F(50,100)} = ${F(1,2)} · b) <b>Vrai</b> : 25 % = ${F(25,100)} = ${F(1,4)} · c) <b>Faux</b> : 10 % = ${F(10,100)} = ${F(1,10)} · d) <b>Vrai</b> : 75 % = ${F(75,100)} = 0,75 · e) <b>Vrai</b> : 20 % = ${F(20,100)} = ${F(1,5)} · f) <b>Faux</b> : 1 % = ${F(1,100)} = 0,01</p>`}
 ]},
{t:"Calculer une proportion", e:[
  {n:"Exercice 5", t:"Des proportions", w:"Sur ta feuille", h:`<p>Écris chaque proportion sous forme de fraction, puis de pourcentage.</p><p>a) Dans une classe de 20 élèves, 5 portent des lunettes. · b) Sur 50 bonbons, 15 sont rouges. · c) Sur 200 élèves de 6e, 50 sont demi-pensionnaires. · d) Sur 10 tirs au but, Léo en a réussi 7. · e) Sur 25 questions, Zoé a donné 23 bonnes réponses.</p>`,
   c:`<p>a) ${F(5,20)} = ${F(25,100)} = <b>25 %</b> · b) ${F(15,50)} = ${F(30,100)} = <b>30 %</b> · c) ${F(50,200)} = ${F(25,100)} = <b>25 %</b> · d) ${F(7,10)} = ${F(70,100)} = <b>70 %</b> · e) ${F(23,25)} = ${F(92,100)} = <b>92 %</b></p>`},
  {n:"Exercice 6", t:"Qui est le plus adroit ?", w:"Sur ton cahier", h:`<p>Au basket, Hugo a réussi 18 paniers sur 25 tirs. Inès a réussi 35 paniers sur 50 tirs. Inès dit : « J'ai marqué plus de paniers, donc je suis plus adroite. » Calcule le pourcentage de réussite de chacun. A-t-elle raison ?</p>`,
   c:`<p>Hugo : ${F(18,25)} = ${F(72,100)} = <b>72 %</b>. Inès : ${F(35,50)} = ${F(70,100)} = <b>70 %</b>.</p><p><b>Inès a tort :</b> elle a marqué plus de paniers, mais elle a aussi tiré deux fois plus. Hugo réussit une plus grande proportion de ses tirs : il est plus adroit.</p>`},
  {n:"Exercice 7", t:"Le sondage", w:"Sur ta feuille", h:`<p>On a demandé à 50 élèves leur sport préféré. Complète la dernière ligne du tableau.</p><div class="scroll"><table class="std"><thead><tr><th>Sport</th><th>Football</th><th>Basket</th><th>Natation</th><th>Autre</th><th>Total</th></tr></thead><tbody><tr><th>Nombre d'élèves</th><td>20</td><td>10</td><td>15</td><td>5</td><td>50</td></tr><tr><th>Pourcentage</th><td></td><td></td><td></td><td></td><td></td></tr></tbody></table></div><p>Que remarques-tu pour la case « Total » ?</p>`,
   c:`<p>Sur 50, on multiplie par 2 pour avoir des centièmes.</p><p>Football : ${F(20,50)} = ${F(40,100)} = 40 % · Basket : ${F(10,50)} = ${F(20,100)} = 20 % · Natation : ${F(15,50)} = ${F(30,100)} = 30 % · Autre : ${F(5,50)} = ${F(10,100)} = 10 %</p><div class="scroll"><table class="std"><thead><tr><th>Sport</th><th>Football</th><th>Basket</th><th>Natation</th><th>Autre</th><th>Total</th></tr></thead><tbody><tr><th>Nombre d'élèves</th><td>20</td><td>10</td><td>15</td><td>5</td><td>50</td></tr><tr><th>Pourcentage</th><td>40 %</td><td>20 %</td><td>30 %</td><td>10 %</td><td>100 %</td></tr></tbody></table></div><p>Le total fait <b>100 %</b> : c'est le tout.</p>`}
 ]},
{t:"Appliquer un pourcentage", e:[
  {n:"Exercice 8", t:"Calcul mental", w:"Sur ta feuille", h:`<p>Un collège compte 120 élèves de 6e. Calcule de tête : a) 50 % de 120 · b) 25 % de 120 · c) 10 % de 120 · d) 20 % de 120 · e) 5 % de 120 · f) 75 % de 120</p>`,
   c:`<p>a) 120 ÷ 2 = <b>60</b> · b) 120 ÷ 4 = <b>30</b> · c) 120 ÷ 10 = <b>12</b> · d) 20 % = 2 × 10 % : 2 × 12 = <b>24</b> · e) la moitié de 10 % : 12 ÷ 2 = <b>6</b> · f) 75 % = 3 × 25 % : 3 × 30 = <b>90</b></p>`},
  {n:"Exercice 9", t:"Faire le lien", w:"Sur ta feuille", h:`<p>Complète. Les nombres d'une même ligne sont égaux.</p><p>a) La moitié de 28 = 28 × ${F(1,2)} = 50 % de 28 = …… · b) Le quart de 80 = ${F(1,4)} de 80 = 25 % de 80 = …… · c) Le dixième de 350 = ${F(1,10)} de 350 = 10 % de 350 = …… · d) Les trois quarts de 60 = ${F(3,4)} de 60 = 75 % de 60 = ……</p>`,
   c:`<p>a) 28 ÷ 2 = <b>14</b> · b) 80 ÷ 4 = <b>20</b> · c) 350 ÷ 10 = <b>35</b> </p>${KC("D",["(60 ÷ 4) × 3","15 × 3","<b>45</b>"],"d)")}`},
  {n:"Exercice 10", t:"Calculer un pourcentage", w:"Sur ton cahier", h:`<p>Calcule en posant le calcul « N × p ÷ 100 ».</p><p>a) A = 13 % de 225 € · b) B = 24 % de 775 élèves · c) C = 35 % de 60 kg · d) D = 8 % de 450 € · e) E = 15 % de 300 m · f) F = 60 % de 45 L</p>`,
   c:`${KCS([KC("A",["13 % de 225 €","225 × 13 ÷ 100","2 925 ÷ 100","<b>29,25 €</b>"],"a)"), KC("B",["24 % de 775 élèves","775 × 24 ÷ 100","18 600 ÷ 100","<b>186 élèves</b>"],"b)"), KC("C",["35 % de 60 kg","60 × 35 ÷ 100","2 100 ÷ 100","<b>21 kg</b>"],"c)"), KC("D",["8 % de 450 €","450 × 8 ÷ 100","3 600 ÷ 100","<b>36 €</b>"],"d)"), KC("E",["15 % de 300 m","300 × 15 ÷ 100","4 500 ÷ 100","<b>45 m</b>"],"e)"), KC("F",["60 % de 45 L","45 × 60 ÷ 100","2 700 ÷ 100","<b>27 L</b>"],"f)")])}`},
  {n:"Exercice 11", t:"Ordre de grandeur", w:"Sur ta feuille", h:`<p>Sans poser de calcul, donne un ordre de grandeur de chaque résultat.</p><p>a) 48 % de 60,45 € · b) 26 % de 398 élèves · c) 9,8 % de 2 012 € · d) 74 % de 81 km</p>`,
   c:`<p>a) ≈ 50 % de 60 € = la moitié : <b>environ 30 €</b> · b) ≈ 25 % de 400 = le quart : <b>environ 100 élèves</b></p><p>c) ≈ 10 % de 2 000 € = le dixième : <b>environ 200 €</b> · d) ≈ 75 % de 80 km = les trois quarts : <b>environ 60 km</b></p>`},
  {n:"Exercice 12", t:"Des problèmes", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> un collège compte 775 élèves. 24 % des élèves sont externes. Combien y a-t-il d'élèves externes ?</p><p><b>Problème 2 :</b> un pull coûte 40 €. Pendant les soldes, il y a une remise de 30 %. Calcule le montant de la remise, puis le nouveau prix du pull.</p><p><b>Problème 3 :</b> une tablette de chocolat de 200 g contient 70 % de cacao. Quelle est la masse de cacao dans cette tablette ?</p><p><b>Problème 4 :</b> un village compte 2 500 habitants. 12 % d'entre eux ont moins de 10 ans. Combien d'habitants ont moins de 10 ans ?</p>`,
   c:`<p><b>Problème 1 :</b> le nombre E d'élèves externes :</p>${KC("E",["24 % de 775","775 × 24 ÷ 100","186"])}<p>Il y a <b>186 élèves externes</b>.</p><p><b>Problème 2 :</b> la remise R :</p>${KC("R",["30 % de 40 €","40 × 30 ÷ 100","<b>12 €</b>"])}<p>Nouveau prix : 40 − 12 = <b>28 €</b>.</p><p><b>Problème 3 :</b> la masse M de cacao :</p>${KC("M",["70 % de 200 g","200 × 70 ÷ 100","<b>140 g</b>"])}<p><b>Problème 4 :</b> le nombre N d'habitants de moins de 10 ans :</p>${KC("N",["12 % de 2 500","2 500 × 12 ÷ 100","<b>300 habitants</b>"])}`},
  {n:"En ++", t:"Les soldes en cascade", w:"Sur ton cahier", h:`<p>Un jeu coûte 100 €. Le magasin baisse son prix de 20 %, puis, une semaine plus tard, baisse encore le nouveau prix de 20 %. Léna dit : « Au total, le prix a baissé de 40 %. » A-t-elle raison ? Explique.</p>`,
   c:`<p>Première baisse : 20 % de 100 € = 20 €, le prix passe à 80 €.</p><p>Deuxième baisse, calculée sur <b>80 €</b> :</p>${KC("B",["20 % de 80 €","80 × 20 ÷ 100","16 €"])}<p>Le prix passe à 64 €.</p><p>Au total, le prix a baissé de 100 − 64 = 36 €, c'est-à-dire de <b>36 %</b>. <b>Léna a tort</b> : la deuxième baisse est calculée sur un prix plus petit.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Le sens d'un pourcentage", schema:S_SENS, q:{
 1:[ {g:()=>{ const n=ri(5,95); return {q:"Quel pourcentage du carré est colorié ?", fig:cent(n,{c:13}), rep:[`${n} %`,`${n}%`,String(n)], sx:S_SENS}; }} ],
 2:[ {g:()=>{ const p=pick([["50 %","la moitié"],["25 %","le quart"],["10 %","le dixième"],["75 %","les trois quarts"],["20 %","le cinquième"],["1 %","le centième"]]); return {q:`${p[0]}, c'est…`, c:shuf(uniq(p[1],["la moitié","le quart","le dixième","les trois quarts","le cinquième","le centième"]).slice(0,3)), rep:p[1], sx:S_USU}; }} ],
 3:[ {g:()=>{ const p=pick([["25 %","0,25"],["1 %","0,01"],["10 %","0,1"],["75 %","0,75"],["5 %","0,05"],["40 %","0,4"]]); return {q:`Écris ${p[0]} sous forme de nombre décimal.`, rep:p[1], sx:S_USU}; }} ]
}},
{nom:"Calculer une proportion", schema:S_PROP, q:{
 1:[ {g:()=>{ const k=pick([2,4,5,10]), t=100/k, n=ri(2,t-1); return {q:`${n} élèves sur ${t} portent des lunettes. Quel pourcentage (en %) ?`, rep:[String(n*k), `${n*k} %`], ex:`${F(n,t)} = ${F(n*k,100)}.`, sx:S_PROP}; }} ],
 2:[ {g:()=>{ const t=pick([20,25,50]), k=100/t, a=ri(1,t-1), t2=t*2, b=ri(1,t2-1); const pa=a*k, pb=b*k/2; if(pa===pb) return {q:`A : ${a} réussites sur ${t}. B : ${b} sur ${t2}. Qui a le meilleur pourcentage ?`, c:["autant","A","B"], rep:"autant", sx:S_PROP}; return {q:`A : ${a} réussites sur ${t}. B : ${b} sur ${t2}. Qui a le meilleur pourcentage ?`, c:["A","B","autant"], rep:pa>pb?"A":"B", ex:`A : ${pa} % ; B : ${D(b*k*5,1)} %.`, sx:S_PROP}; }} ],
 3:[ {q:"Dans un sondage, la somme de tous les pourcentages vaut…", c:["100 %","50 %","1 %"], rep:"100 %", sx:S_PROP} ]
}},
{nom:"Appliquer un pourcentage", schema:S_APP, q:{
 1:[ {g:()=>{ const p=pick([50,25,10]), N=pick([20,40,60,80,120,200,400]); return {q:`${p} % de ${N} = ?`, rep:String(N*p/100), sx:S_APP}; }} ],
 2:[ {g:()=>{ const p=pick([20,5,75,30]), N=20*ri(2,20); return {q:`${p} % de ${N} = ?`, rep:D(N*p,2), ex:`<br>A = ${p} % de ${N}<br>A = ${N} × ${p} ÷ 100<br>A = ${sp(N*p)} ÷ 100<br>A = ${D(N*p,2)}`, sx:S_APP}; }} ],
 3:[ {g:()=>{ const p=ri(2,40), N=ri(11,99)*5; return {q:`${p} % de ${N} € = ? (en €)`, rep:D(N*p,2), ex:`<br>A = ${p} % de ${N} €<br>A = ${N} × ${p} ÷ 100<br>A = ${sp(N*p)} ÷ 100<br>A = ${D(N*p,2)} €`, sx:S_APP}; }},
     {g:()=>{ const P=pick([40,60,80,120]), r=pick([10,20,25,50]); return {q:`Un article coûte ${P} €, remise de ${r} %. Nouveau prix (en €) ?`, rep:String(P-P*r/100), ex:`Remise : ${P*r/100} €.`, sx:S_APP}; }} ]
}},
{nom:"Ordre de grandeur", schema:S_APP, q:{
 1:[ {q:"48 % de 60,45 € vaut environ…", c:["30 €","50 €","3 €"], rep:"30 €", sx:S_APP} ],
 2:[ {g:()=>{ const b=pick([[49,"la moitié",2],[26,"le quart",4],[11,"le dixième",10]]), N=pick([200,400,800,1000]); const v=N/b[2]; return {q:`${b[0]} % de ${N+ri(-9,9)} vaut environ…`, c:shuf([String(v),String(v*2),String(v/2)]), rep:String(v), ex:`≈ ${b[1]} de ${N}.`, sx:S_APP}; }} ],
 3:[ {q:"Un prix baisse de 20 % puis encore de 20 %. Au total, il a baissé de…", c:["36 %","40 %","20 %"], rep:"36 %", ex:"100 → 80 → 64.", sx:S_APP} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
const vide = cent(0,{c:16}).replace("0 carreaux coloriés sur 100","Un carré de 100 carreaux à colorier");
const souv = t => `<div class="retenir" data-l="Je me souviens"><p>${t}</p></div>`;
return {
titre:"Évaluation d'entraînement — Chapitre 20", duree:25, info:"Durée : 25 min · Crayons de couleur · Calculatrice non autorisée",
comp:[
  ["REPRÉSENTER","Je comprends ce que veut dire un pourcentage et je connais les pourcentages usuels.","Ex. 1 (2 points)"],
  ["CALCULER","J'applique un pourcentage de tête.","Ex. 2 (3 points)"],
  ["CALCULER","Je calcule une proportion et je l'écris sous forme de fraction et de pourcentage.","Ex. 3 (2 points)"],
  ["MODÉLISER","Je résous un problème avec un pourcentage.","Ex. 4 (3 points)"]
],
exos:[
{t:"Colorier un pourcentage", p:2, h:`<div class="cpt"><div><p>Ce carré est partagé en 100 carreaux identiques.</p><p>a) Colorie 35 % du carré.</p><p>b) Quel pourcentage du carré reste blanc ?</p><p>c) Complète avec un pourcentage : le dixième = …… % ; les trois quarts = …… %.</p></div>${vide}</div>`,
 c:`<div class="cpt"><div><p>a) On colorie 35 carreaux sur 100 (par exemple 3 lignes de 10 et 5 carreaux). <i>(0,5 point)</i></p><p>b) 100 − 35 = 65 : il reste <b>65 %</b> du carré en blanc. <i>(0,5 point)</i></p><p>c) Le dixième = <b>10 %</b> ; les trois quarts = <b>75 %</b>. <i>(0,5 point chacun)</i></p></div>${cent(35,{c:12})}</div>`},
{t:"De tête", p:3, h:`<p>Calcule de tête.</p><p>a) 10 % de 230 · b) 50 % de 36 · c) 25 % de 84 · d) 20 % de 45 · e) 75 % de 16 · f) 1 % de 700</p>`,
 c:`<p>a) 10 %, c'est le dixième : 230 ÷ 10 = <b>23</b> · b) 50 %, c'est la moitié : 36 ÷ 2 = <b>18</b> · c) 25 %, c'est le quart : 84 ÷ 4 = <b>21</b></p>
  <p>d) 10 % de 45 = 4,5, et 20 % = 2 × 10 % : 2 × 4,5 = <b>9</b> · e) le quart de 16 = 4, et 75 % = 3 × 25 % : 3 × 4 = <b>12</b> · f) 1 %, c'est le centième : 700 ÷ 100 = <b>7</b></p><p><i>(0,5 point par calcul)</i></p>`},
{t:"Le club d'échecs", p:2, h:`<p>Le club d'échecs du collège compte 50 membres. Parmi eux, 19 sont des filles.</p><p>a) Écris la proportion de filles sous forme de fraction.</p><p>b) Écris cette proportion sous forme de pourcentage.</p><p>c) Quel pourcentage des membres sont des garçons ?</p>`,
 c:`<p>a) Proportion de filles : <b>${F(19,50)}</b>. <i>(0,5 point)</i></p>
  <p>b) On multiplie le numérateur et le dénominateur par 2 : ${F(19,50)} = ${F(38,100)} = <b>38 %</b>. <i>(1 point)</i></p>
  <p>c) 100 % − 38 % = <b>62 %</b> des membres sont des garçons. (On peut aussi calculer : 50 − 19 = 31 garçons, et ${F(31,50)} = ${F(62,100)} = 62 %.) <i>(0,5 point)</i></p>`},
{t:"Le club de football", p:3, h:`<p>Un club de football compte 60 licenciés. 15 % des licenciés sont des filles.</p><p>a) Combien de filles y a-t-il dans ce club ? Écris ton calcul.</p><p>b) Combien de garçons y a-t-il ?</p><p>c) Quel pourcentage des licenciés sont des garçons ?</p>`,
 c:`<p>a)</p>${KC("A",["15 % de 60","60 × 15 ÷ 100","900 ÷ 100","9"])}<p>Il y a <b>9 filles</b>. (De tête : 10 % de 60 = 6 et 5 % de 60 = 3, donc 15 % de 60 = 6 + 3 = 9.) <i>(1,5 point)</i></p>
  <p>b) 60 − 9 = 51 : il y a <b>51 garçons</b>. <i>(0,5 point)</i></p>
  <p>c) 100 % − 15 % = <b>85 %</b> des licenciés sont des garçons. <i>(1 point)</i></p>`}
],
bep:{
titre:"Évaluation d'entraînement — Chapitre 20 · version aménagée", duree:25, info:"Version aménagée (tiers-temps) · Durée : 25 min · Crayons de couleur · Calculatrice non autorisée",
note:"Le même sujet avec 4 questions en moins, à faire dans le même temps. Le total reste sur 10 points.",
comp:[
  ["REPRÉSENTER","Je comprends ce que veut dire un pourcentage et je connais les pourcentages usuels.","Ex. 1 (2 points)"],
  ["CALCULER","J'applique un pourcentage de tête.","Ex. 2 (3 points)"],
  ["CALCULER","Je calcule une proportion et je l'écris sous forme de fraction et de pourcentage.","Ex. 3 (2 points)"],
  ["MODÉLISER","Je résous un problème avec un pourcentage.","Ex. 4 (3 points)"]
],
exos:[
{t:"Colorier un pourcentage", p:2, h:`<div class="cpt"><div><p>Ce carré est partagé en 100 carreaux identiques.</p><p>a) Colorie 35 % du carré.</p><p>b) Complète avec un pourcentage : le dixième = …… % ; les trois quarts = …… %.</p></div>${vide}</div>`,
 c:`<div class="cpt"><div><p>a) On colorie 35 carreaux sur 100 (par exemple 3 lignes de 10 et 5 carreaux). <i>(1 point)</i></p><p>b) Le dixième = <b>10 %</b> ; les trois quarts = <b>75 %</b>. <i>(0,5 point chacun)</i></p></div>${cent(35,{c:12})}</div>`},
{t:"De tête", p:3, h:`<p>Calcule de tête.</p><p>a) 10 % de 230 · b) 50 % de 36 · c) 20 % de 45 · d) 75 % de 16</p>`,
 c:`<p>a) 10 %, c'est le dixième : 230 ÷ 10 = <b>23</b> · b) 50 %, c'est la moitié : 36 ÷ 2 = <b>18</b> <i>(0,5 point chacun)</i></p>
  <p>c) 10 % de 45 = 4,5, et 20 % = 2 × 10 % : 2 × 4,5 = <b>9</b> · d) le quart de 16 = 4, et 75 % = 3 × 25 % : 3 × 4 = <b>12</b> <i>(1 point chacun)</i></p>`},
{t:"Le club d'échecs", p:2, h:`<p>Le club d'échecs du collège compte 50 membres. Parmi eux, 19 sont des filles.</p><p>a) Écris la proportion de filles sous forme de fraction.</p><p>b) Écris cette proportion sous forme de pourcentage.</p>`,
 c:`<p>a) Proportion de filles : <b>${F(19,50)}</b>. <i>(0,5 point)</i></p>
  <p>b) On multiplie le numérateur et le dénominateur par 2 : ${F(19,50)} = ${F(38,100)} = <b>38 %</b>. <i>(1,5 point)</i></p>`},
{t:"Le club de football", p:3, h:`<p>Un club de football compte 60 licenciés. 15 % des licenciés sont des filles.</p><p>a) Combien de filles y a-t-il dans ce club ? Écris ton calcul.</p><p>b) Combien de garçons y a-t-il ?</p><p>c) Quel pourcentage des licenciés sont des garçons ?</p>`,
 c:`<p>a)</p>${KC("A",["15 % de 60","60 × 15 ÷ 100","900 ÷ 100","9"])}<p>Il y a <b>9 filles</b>. (De tête : 10 % de 60 = 6 et 5 % de 60 = 3, donc 15 % de 60 = 6 + 3 = 9.) <i>(1,5 point)</i></p>
  <p>b) 60 − 9 = 51 : il y a <b>51 garçons</b>. <i>(0,5 point)</i></p>
  <p>c) 100 % − 15 % = <b>85 %</b> des licenciés sont des garçons. <i>(1 point)</i></p>`}
]}
};
})()

};
})();
