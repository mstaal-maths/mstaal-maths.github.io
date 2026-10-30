/* 6e — Chapitre 12 : La proportionnalité (cours et fiche d'exercices de M. Staal) */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const co = (p,alt,w) => img("c612co/"+p+".png", alt, w);
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
/* décimal à partir d'un entier et de k décimales */
const D = (n,k=0) => { const s=String(Math.abs(n)).padStart(k+1,"0"); const a=s.slice(0,s.length-k); let b=k?s.slice(-k):""; b=b.replace(/0+$/,""); return (n<0?"−":"")+String(+a).replace(/\B(?=(\d{3})+(?!\d))/g," ")+(b?","+b:""); };

/* ---------- tableau de proportionnalité en SVG ----------
   ptab([titre1,titre2], ligne1, ligne2, {coef:"× 1,4", red:[[ligne,col]], arcs:[{a,b,t,c,pos:"h"|"b"}]})
   les cases valent "" quand elles sont à compléter */
function ptab(T, r1, r2, o={}){
  const lw = Math.max(...T.map(t=>t.length))*8.2+18, cw = o.cw||62, rh=34, n=r1.length;
  const top = (o.arcs||[]).some(a=>a.pos!=="b") ? 34 : 6, bot = (o.arcs||[]).some(a=>a.pos==="b") ? 34 : 6;
  const W = lw + n*cw + (o.coef?90:8), H = top + 2*rh + bot;
  const red = (l,c) => (o.red||[]).some(([a,b])=>a===l && b===c);
  let s = `<svg class="fig ptab" viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:100%" role="img" aria-label="Tableau : ${T[0]} ${r1.join(", ")} ; ${T[1]} ${r2.join(", ")}">`;
  [0,1].forEach(l=>{ const y=top+l*rh;
    s += `<rect x="2" y="${y}" width="${lw}" height="${rh}" style="fill:#deebf7;stroke:var(--ink);stroke-width:1.5"/><text x="10" y="${y+22}" style="font-size:14.5px;font-weight:700;fill:#13233a">${T[l]}</text>`;
    (l?r2:r1).forEach((v,c)=>{ const x=2+lw+c*cw; s += `<rect x="${x}" y="${y}" width="${cw}" height="${rh}" style="fill:var(--surface,#fff);stroke:var(--ink);stroke-width:1.5"/><text x="${x+cw/2}" y="${y+22}" text-anchor="middle" style="font-size:15px;${red(l,c)?"font-weight:700;fill:#d0342c":"fill:var(--ink)"}">${v}</text>`; }); });
  if(o.coef){ const x=2+lw+n*cw+8; s += `<path d="M${x} ${top+rh-18} q10 18 0 36" style="fill:none;stroke:#1e5aa8;stroke-width:2"/><path d="M${x-4} ${top+rh+13} l4 5 l5 -5" style="fill:none;stroke:#1e5aa8;stroke-width:2"/><text x="${x+14}" y="${top+rh+5}" style="font-size:15px;font-weight:700;fill:#1e5aa8">${o.coef}</text>`; }
  (o.arcs||[]).forEach(a=>{ const c=a.c==="g"?"#1d7a46":"#e08a00", xa=2+lw+a.a*cw+cw/2, xb=2+lw+a.b*cw+cw/2, up=a.pos!=="b";
    const y = up ? top-2 : top+2*rh+2, h = up ? -22 : 22;
    s += `<path d="M${xa} ${y} Q${(xa+xb)/2} ${y+h} ${xb-4} ${y}" style="fill:none;stroke:${c};stroke-width:2"/><path d="M${xb-11} ${y+(up?-5:5)} L${xb-3} ${y} L${xb-6} ${y+(up?-8:8)}" style="fill:none;stroke:${c};stroke-width:2"/><text x="${(xa+xb)/2}" y="${up?y-16:y+30}" text-anchor="middle" style="font-size:13px;font-weight:700;fill:${c}">${a.t}</text>`; });
  return s + "</svg>";
}
window.FIG12 = {ptab, D};

/* ---------- schémas ---------- */
const S_REC = sch("Reconnaître la proportionnalité", co("maca","6 macarons : 8,4 € ; 10 macarons : 14 € ; coefficient × 1,4",330)+`<p class="calc">8,4 ÷ 6 = 1,4 &nbsp; et &nbsp; 14 ÷ 10 = 1,4</p><p class="schN">Je divise chaque nombre de la 2<sup>e</sup> ligne par celui de la 1<sup>re</sup> ligne : toujours le même résultat → proportionnel.</p>`);
const S_METH = sch("Quatre méthodes", `<p class="schN">8 h → 60 €. &nbsp;① 16 h = 2 × 8 h → 2 × 60 = 120 €. &nbsp;② 24 h = 8 h + 16 h → 60 + 120 = 180 €. &nbsp;③ 1 h → 60 ÷ 8 = 7,5 € ; 3 h → 7,5 × 3 = 22,5 €. &nbsp;④ coefficient 7,5 : salaire = heures × 7,5.</p>`);
const S_PIEGE = sch("Attention au piège", co("taxi","Taxi : 1 km 6 €, 2 km 8 €, 10 km 24 €",330)+`<p class="schN">Prise en charge de 4 € + 2 € par km : 6 ÷ 1 = 6 mais 8 ÷ 2 = 4. Ce n'est <b>pas</b> proportionnel.</p>`);

const coefQ = (a, b) => a.map((x,i)=>`${b[i]} ÷ ${x} = ${D(Math.round(b[i]*1000/x),3)}${(b[i]*1000)%x?"…":""}`).join(" ; ");

CH["6e-12"] = {
intro:"Reconnaître une situation de proportionnalité, compléter un tableau, calculer une quatrième proportionnelle avec la méthode la plus adaptée, et résoudre un problème en rédigeant.",
savoir:[
  "reconnaître si deux grandeurs sont proportionnelles ou non, et justifier ;",
  "compléter un tableau de proportionnalité ;",
  "calculer une quatrième proportionnelle en choisissant une méthode adaptée ;",
  "résoudre un problème de proportionnalité en rédigeant."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Reconnaître une situation de proportionnalité", h:`
  <h4>1. Définitions</h4>
  <div class="retenir" data-l="Définition"><p>Deux grandeurs sont <b>proportionnelles</b> lorsqu'on obtient les valeurs de l'une en multipliant les valeurs de l'autre par un même nombre (non nul). Ce nombre s'appelle le <b>coefficient de proportionnalité</b>.</p></div>
  <div class="retenir" data-l="Définition"><p>Un <b>tableau de proportionnalité</b> est un tableau dans lequel on obtient les nombres d'une ligne en multipliant ceux de l'autre ligne par un même nombre : le coefficient de proportionnalité.</p></div>
  <h4>2. Méthode pour reconnaître un tableau de proportionnalité</h4>
  <div class="retenir" data-l="Méthode"><ol><li>Je divise chaque nombre de la deuxième ligne par le nombre correspondant de la première ligne.</li><li>Si je trouve toujours le même résultat, c'est un tableau de proportionnalité, et ce résultat est le coefficient.</li><li>Sinon, ce n'est pas un tableau de proportionnalité.</li></ol></div>
  <p><b>Exemple 1 :</b> le prix des macarons est-il proportionnel au nombre de macarons ?</p>
  <div class="cpt"><div><p class="calc">8,4 ÷ 6 = 1,4 &nbsp; et &nbsp; 14 ÷ 10 = 1,4</p><p>On trouve toujours 1,4 : le prix est proportionnel au nombre de macarons. Le coefficient de proportionnalité est 1,4.</p></div>${co("maca","6 macarons : 8,4 € ; 10 macarons : 14 € ; coefficient × 1,4",320)}</div>
  <p><b>Exemple 2 :</b> le prix de la location est-il proportionnel à sa durée ?</p>
  <div class="cpt"><div><p class="calc">11 ÷ 1 = 11 &nbsp; et &nbsp; 19 ÷ 2 = 9,5</p><p>Les résultats sont différents : le prix n'est pas proportionnel à la durée.</p><p><b>Autre façon :</b> pour 2 h, on devrait payer 2 fois plus, soit 22 €. Or on paie 19 €.</p></div>${co("loc","1 h : 11 € ; 2 h : 19 €",300)}</div>
  <p class="attention"><b>ATTENTION :</b> deux grandeurs qui augmentent en même temps ne sont pas forcément proportionnelles. À 5 ans, Léa mesurait 1 m : à 10 ans, elle ne mesurera pas 2 m ! La taille n'est pas proportionnelle à l'âge.</p>`},
{k:"II", t:"Calculer une quatrième proportionnelle", h:`
  <div class="retenir" data-l="Définition"><p>Dans un tableau de proportionnalité, quand on connaît trois nombres (dont deux qui se correspondent), on peut calculer le quatrième. Ce nombre s'appelle une <b>quatrième proportionnelle</b>.</p></div>
  <p><b>Situation :</b> le salaire de Claire est proportionnel au nombre d'heures travaillées. Elle gagne 60 € pour 8 h de travail. Combien gagne-t-elle pour 16 h, pour 24 h, pour 3 h ?</p>
  <h4>Méthode 1 : multiplier (ou diviser) une colonne par un même nombre</h4>
  <div class="cpt"><p>16 h, c'est 2 fois 8 h. Le salaire est donc 2 fois plus grand : 60 × 2 = <b>120 €</b>.</p>${co("m1","8 h : 60 € ; × 2 ; 16 h : 120 €",280)}</div>
  <h4>Méthode 2 : additionner (ou soustraire) deux colonnes</h4>
  <div class="cpt"><p>24 h = 8 h + 16 h. Le salaire est donc 60 € + 120 € = <b>180 €</b>.</p>${co("m2","8 h + 16 h = 24 h ; 60 + 120 = 180 €",320)}</div>
  <p class="attention"><b>ATTENTION :</b> on ne peut pas ajouter le même nombre aux deux lignes : pour 8 h + 1 h = 9 h, Claire ne gagne pas 60 € + 1 € = 61 €.</p>
  <h4>Méthode 3 : le passage à l'unité</h4>
  <div class="cpt"><p>Je calcule d'abord le salaire pour 1 h : 60 ÷ 8 = 7,5. Claire gagne 7,50 € de l'heure. Pour 3 h : 7,5 × 3 = <b>22,50 €</b>.</p>${co("m3","8 h : 60 € ; ÷ 8 ; 1 h : 7,5 € ; × 3 ; 3 h : 22,5 €",320)}</div>
  <h4>Méthode 4 : utiliser le coefficient de proportionnalité</h4>
  <p>Je cherche le nombre qui complète 8 × … = 60 : c'est 60 ÷ 8 = 7,5. Le coefficient de proportionnalité est 7,5.</p>
  <div class="cpt"><p class="calc">Salaire = nombre d'heures × 7,5<br>Pour 3 h : 3 × 7,5 = 22,5.</p>${co("m4","Tableau complet avec le coefficient × 7,5",380)}</div>
  <p><b>Remarque :</b> je choisis la méthode la plus simple selon les nombres de l'énoncé.</p>`},
{k:"III", t:"Résoudre un problème de proportionnalité", h:`
  <div class="retenir" data-l="Méthode"><ol><li>Je vérifie que la situation est une situation de proportionnalité (l'énoncé le dit, ou je le justifie).</li><li>Je présente les données dans un tableau.</li><li>Je choisis une méthode et j'écris mes calculs.</li><li>Je réponds par une phrase, avec l'unité.</li></ol></div>
  <p><b>Exemple :</b> dans un aquarium, la hauteur d'eau est proportionnelle à la quantité d'eau versée. Avec 35 L, la hauteur est 7 cm. Quelle sera la hauteur avec 60 L ?</p>
  <div class="cpt"><div><p>Je cherche le coefficient : 35 × … = 7, donc 7 ÷ 35 = 0,2.</p><p>60 × 0,2 = 12.</p><p><b>Avec 60 L, la hauteur d'eau sera de 12 cm.</b></p></div>${co("aqua","35 L : 7 cm ; 60 L : 12 cm ; coefficient × 0,2",320)}</div>
  <p><b>Contre-exemple :</b> un taxi fait payer 4 € de prise en charge, puis 2 € par kilomètre. Le prix est-il proportionnel à la distance ?</p>
  <div class="cpt"><div><p>Pour 1 km : 4 + 2 = 6 €. Pour 2 km : 4 + 2 × 2 = 8 €.</p><p>6 ÷ 1 = 6 et 8 ÷ 2 = 4 : les résultats sont différents.</p><p>Le prix n'est pas proportionnel à la distance : pour 10 km, on paie 4 + 2 × 10 = 24 €, et non 6 × 10 = 60 €.</p></div>${co("taxi","Taxi : 1 km 6 €, 2 km 8 €, 10 km 24 €",320)}</div>
  <p class="attention"><b>ATTENTION :</b> avant d'utiliser une méthode de proportionnalité, je vérifie toujours que la situation est bien une situation de proportionnalité.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Reconnaître une situation de proportionnalité", e:[
  {n:"Activité 1", t:"Proportionnel ou pas ?", w:"Sur ta feuille", h:`<p>Pour chaque situation, réponds à la question et justifie par des calculs.</p>
   <p>1) Le tableau donne les prix de 2, 6 et 10 chaises de jardin. Le prix est-il proportionnel au nombre de chaises ?</p>${ptab(["Nombre de chaises","Prix (en €)"],[2,6,10],[52,156,260])}
   <p>2) Le tableau donne les prix de lots de 4, 6 et 10 pots de mousse au chocolat. Le prix du lot est-il proportionnel au nombre de pots ?</p>${ptab(["Nombre de pots","Prix du lot (en €)"],[4,6,10],["2,20","3,30","5,00"])}
   <p>3) Dans son carnet de santé, Léo a noté son nombre de dents à différents âges. Le nombre de dents est-il proportionnel à l'âge ?</p>${ptab(["Âge (en années)","Nombre de dents"],[3,6,30],[15,20,32])}`,
   c:`<p>1) 52 ÷ 2 = 26 ; 156 ÷ 6 = 26 ; 260 ÷ 10 = 26. On trouve toujours 26 : <b>le prix est proportionnel</b> au nombre de chaises (une chaise coûte 26 €).</p><p>2) 2,20 ÷ 4 = 0,55 ; 3,30 ÷ 6 = 0,55 ; mais 5,00 ÷ 10 = 0,5. Les résultats sont différents : <b>le prix n'est pas proportionnel</b> (le lot de 10 est moins cher par pot).</p><p>3) 15 ÷ 3 = 5 ; 20 ÷ 6 ≈ 3,3. Les résultats sont différents : <b>le nombre de dents n'est pas proportionnel</b> à l'âge (à 30 ans, Léo n'a pas 150 dents !).</p>`},
  {n:"Exercice 1", t:"Les cartes de cinéma", w:"Sur ta feuille", h:`<p>Pour chaque cinéma, le prix de la carte d'abonnement est-il proportionnel au nombre de places ? Justifie.</p><p><b>Royal-Ciné-Central</b></p>${ptab(["Nombre de places","Prix à payer (en €)"],[2,5,10],[12,30,60])}<p><b>Cinépalace</b></p>${ptab(["Nombre de places","Prix à payer (en €)"],[2,5,10],[15,30,50])}`,
   c:`<p><b>Royal-Ciné-Central :</b> 12 ÷ 2 = 6 ; 30 ÷ 5 = 6 ; 60 ÷ 10 = 6. <b>Oui</b>, le prix est proportionnel (coefficient 6 : une place coûte 6 €).</p><p><b>Cinépalace :</b> 15 ÷ 2 = 7,5 ; 30 ÷ 5 = 6. <b>Non</b>, le prix n'est pas proportionnel.</p>`},
  {n:"Exercice 2", t:"Le prix du pain", w:"Sur ta feuille", h:`<p>Deux pains coûtent 1,80 € et neuf pains coûtent 9 €.</p><p>a) Complète le tableau à partir de l'énoncé.</p>${ptab(["Nombre de pains","Prix (en €)"],["",""],["",""])}<p>b) Le prix est-il proportionnel au nombre de pains achetés ? Justifie.</p>`,
   c:`<p>a)</p>${ptab(["Nombre de pains","Prix (en €)"],[2,9],["1,80",9])}<p>b) 1,80 ÷ 2 = 0,9 et 9 ÷ 9 = 1. Les résultats sont différents : <b>le prix n'est pas proportionnel</b> au nombre de pains.</p>`},
  {n:"Exercice 3", t:"Vrai ou faux ?", w:"Sur ta feuille", h:`<p>Dans chaque situation, écris V si l'affirmation est vraie, F si elle est fausse.</p><p>1) Simon saute en hauteur. Avec 10 m d'élan, il a passé une barre à 1,80 m. Avec deux fois plus d'élan, il aurait sauté deux fois plus haut.</p><p>2) Aline achète 3 tee-shirts à 19 € l'unité. Elle paiera 3 × 19 €.</p><p>3) À 5 ans, je mesurais 1 m. À 10 ans, je mesurerai donc 2 m.</p><p>4) En 30 min, j'ai couru 5 km. Si je cours toujours au même rythme, en 1 h, j'aurai parcouru 10 km.</p><p>5) Pour une recette pour 4 personnes, il faut 3 œufs. Pour 8 personnes, il en faudra donc 6.</p><p>6) Léo a eu 8/20 à une évaluation qu'il a révisée pendant 1 h. Il aurait eu 16/20 s'il avait révisé 2 h.</p>`,
   c:`<p>1) <b>F</b> : la hauteur du saut n'est pas proportionnelle à l'élan (3,60 m, c'est impossible !).</p><p>2) <b>V</b> : le prix est proportionnel au nombre de tee-shirts.</p><p>3) <b>F</b> : la taille n'est pas proportionnelle à l'âge.</p><p>4) <b>V</b> : au même rythme, la distance est proportionnelle à la durée ; 1 h = 2 × 30 min, donc 2 × 5 = 10 km.</p><p>5) <b>V</b> : les quantités d'une recette sont proportionnelles au nombre de personnes.</p><p>6) <b>F</b> : la note n'est pas proportionnelle au temps de révision.</p>`},
  {n:"Exercice 4", t:"Des tableaux", w:"Sur ta feuille", h:`<p>Pour chaque tableau, dis si c'est un tableau de proportionnalité. Si oui, donne le coefficient de proportionnalité.</p><p>a)</p>${ptab(["Grandeur 1","Grandeur 2"],[3,5,8],[12,20,32])}<p>b)</p>${ptab(["Grandeur 1","Grandeur 2"],[2,4,7],[5,10,16])}<p>c)</p>${ptab(["Grandeur 1","Grandeur 2"],[10,15,40],[4,6,16])}<p>d)</p>${ptab(["Grandeur 1","Grandeur 2"],[1,2,3],[7,14,20])}`,
   c:`<p>a) 12 ÷ 3 = 4 ; 20 ÷ 5 = 4 ; 32 ÷ 8 = 4 : <b>oui, coefficient 4</b>.</p><p>b) 5 ÷ 2 = 2,5 ; 10 ÷ 4 = 2,5 ; mais 16 ÷ 7 ≈ 2,29 : <b>non</b> (il faudrait 7 × 2,5 = 17,5).</p><p>c) 4 ÷ 10 = 0,4 ; 6 ÷ 15 = 0,4 ; 16 ÷ 40 = 0,4 : <b>oui, coefficient 0,4</b>.</p><p>d) 7 ÷ 1 = 7 ; 14 ÷ 2 = 7 ; mais 20 ÷ 3 ≈ 6,67 : <b>non</b> (il faudrait 21).</p>`}
 ]},
{t:"Calculer une quatrième proportionnelle", e:[
  {n:"Activité 2", t:"Les places de cinéma", w:"Sur ta feuille", h:`<p>4 places de cinéma pour les moins de 14 ans coûtent 20 €. Le prix est proportionnel au nombre de places. Combien vont payer 6 jeunes de moins de 14 ans ?</p><p>a) Complète ce tableau de proportionnalité à partir de l'énoncé.</p>${ptab(["Nombre de places","Prix (en €)"],["",""],["",""])}<p>b) Réponds à la question en justifiant.</p>`,
   c:`<p>a)</p>${ptab(["Nombre de places","Prix (en €)"],[4,6],[20,30],{red:[[1,1]],coef:"× 5"})}<p>b) <b>Passage à l'unité :</b> 1 place coûte 20 ÷ 4 = 5 €, donc 6 places coûtent 6 × 5 = 30 €.</p><p><i>Autre méthode : 2 places coûtent 20 ÷ 2 = 10 €, et 6 = 4 + 2, donc 20 + 10 = 30 €.</i></p><p><b>Les 6 jeunes vont payer 30 €.</b></p>`},
  {n:"Exercice 5", t:"La recette du gâteau", w:"Sur ta feuille", h:`<p>Jules a noté les ingrédients d'un gâteau au chocolat pour 4 personnes. Complète la liste pour 8 personnes et pour 6 personnes.</p><div class="scroll"><table class="std"><thead><tr><th>Ingrédient</th><th>Pour 4 personnes</th><th>Pour 8 personnes</th><th>Pour 6 personnes</th></tr></thead><tbody><tr><th>Œufs</th><td>2</td><td></td><td></td></tr><tr><th>Sucre (en g)</th><td>80</td><td></td><td></td></tr><tr><th>Chocolat (en g)</th><td>100</td><td></td><td></td></tr><tr><th>Beurre (en g)</th><td>50</td><td></td><td></td></tr><tr><th>Farine (en g)</th><td>40</td><td></td><td></td></tr></tbody></table></div>`,
   c:`<p>Pour 8 personnes (2 fois plus), je multiplie par 2. Pour 6 personnes, j'additionne les quantités pour 4 personnes et pour 2 personnes (la moitié) : c'est multiplier par 1,5.</p><div class="scroll"><table class="std"><thead><tr><th>Ingrédient</th><th>Pour 4 personnes</th><th>Pour 8 personnes</th><th>Pour 6 personnes</th></tr></thead><tbody><tr><th>Œufs</th><td>2</td><td><b>4</b></td><td><b>3</b></td></tr><tr><th>Sucre (en g)</th><td>80</td><td><b>160</b></td><td><b>120</b></td></tr><tr><th>Chocolat (en g)</th><td>100</td><td><b>200</b></td><td><b>150</b></td></tr><tr><th>Beurre (en g)</th><td>50</td><td><b>100</b></td><td><b>75</b></td></tr><tr><th>Farine (en g)</th><td>40</td><td><b>80</b></td><td><b>60</b></td></tr></tbody></table></div>`},
  {n:"Exercice 6", t:"Compléter des tableaux", w:"Sur ta feuille", h:`<p>Complète chaque tableau de proportionnalité. Indique tes calculs avec des flèches.</p><p>1) Le prix est proportionnel à la masse de cerises achetée.</p>${ptab(["Masse de cerises (en kg)","Prix (en €)"],[2,3,4,"",""],[12,"","",60,120])}<p>2) La distance parcourue est proportionnelle au nombre de pas.</p>${ptab(["Nombre de pas","Distance (en m)"],[3,12,15],[2,"",""])}<p>3) Le prix est proportionnel au nombre de cartes achetées.</p>${ptab(["Nombre de cartes","Prix (en €)"],[6,11],["1,50",""])}`,
   c:`<p>1) Le coefficient est 12 ÷ 2 = 6 (1 kg coûte 6 €).</p>${ptab(["Masse de cerises (en kg)","Prix (en €)"],[2,3,4,10,20],[12,18,24,60,120],{red:[[1,1],[1,2],[0,3],[0,4]],coef:"× 6",cw:54})}<p>3 × 6 = 18 ; 4 × 6 = 24 ; 60 ÷ 6 = 10 ; 120 ÷ 6 = 20 (ou 2 × 10).</p>
   <p>2) 12 pas = 4 × 3 pas, donc 4 × 2 = 8 m. 15 pas = 12 + 3 pas, donc 8 + 2 = 10 m.</p>${ptab(["Nombre de pas","Distance (en m)"],[3,12,15],[2,8,10],{red:[[1,1],[1,2]],arcs:[{a:0,b:1,t:"× 4",pos:"b"}]})}
   <p>3) 1 carte coûte 1,50 ÷ 6 = 0,25 €, donc 11 cartes coûtent 11 × 0,25 = 2,75 €.</p>${ptab(["Nombre de cartes","Prix (en €)"],[6,11],["1,50","2,75"],{red:[[1,1]],coef:"× 0,25"})}`},
  {n:"Exercice 7", t:"Avec le coefficient de proportionnalité", w:"Sur ta feuille", h:`<p>Calcule le coefficient de proportionnalité, puis complète le tableau.</p><p>a)</p>${ptab(["Grandeur 1","Grandeur 2"],[4,7,10,"2,5"],[10,"","",""])}<p>b)</p>${ptab(["Grandeur 1","Grandeur 2"],[5,8,12,"0,5"],[3,"","",""])}`,
   c:`<p>a) Coefficient : 10 ÷ 4 = <b>2,5</b>. 7 × 2,5 = 17,5 ; 10 × 2,5 = 25 ; 2,5 × 2,5 = 6,25.</p>${ptab(["Grandeur 1","Grandeur 2"],[4,7,10,"2,5"],[10,"17,5",25,"6,25"],{red:[[1,1],[1,2],[1,3]],coef:"× 2,5"})}<p>b) Coefficient : 3 ÷ 5 = <b>0,6</b>. 8 × 0,6 = 4,8 ; 12 × 0,6 = 7,2 ; 0,5 × 0,6 = 0,3.</p>${ptab(["Grandeur 1","Grandeur 2"],[5,8,12,"0,5"],[3,"4,8","7,2","0,3"],{red:[[1,1],[1,2],[1,3]],coef:"× 0,6"})}`}
 ]},
{t:"Résoudre des problèmes", e:[
  {n:"Exercice 8", t:"Attention au piège !", w:"Sur ta feuille", h:`<p>Pour louer un vélo, on paie 3 € d'inscription, puis 1,50 € par heure de location.</p><p>1) Complète le tableau.</p>${ptab(["Durée (en h)","Prix (en €)"],[1,2,4,6],["","","",""])}<p>2) Le prix est-il proportionnel à la durée de location ? Justifie.</p><p>3) Mehdi dit : « Pour 2 h, je paie 6 € ; donc pour 4 h, je paierai 12 €. » A-t-il raison ? Explique.</p>`,
   c:`<p>1) Prix = 3 + 1,50 × durée.</p>${ptab(["Durée (en h)","Prix (en €)"],[1,2,4,6],["4,50",6,9,12],{red:[[1,0],[1,1],[1,2],[1,3]]})}<p>2) 4,50 ÷ 1 = 4,5 et 6 ÷ 2 = 3 : les résultats sont différents, <b>le prix n'est pas proportionnel</b> à la durée (à cause des 3 € d'inscription).</p><p>3) <b>Non.</b> Il a fait comme si c'était proportionnel. Le prix P pour 4 h :</p><p class="calc">P = 3 + 1,50 × 4<br>P = 3 + 6<br>P = 9</p><p>Pour 4 h, on paie <b>9 €</b>, et non 12 € : les 3 € d'inscription ne se paient qu'une fois.</p>`},
  {n:"Exercice 9", t:"Des problèmes de proportionnalité", w:"Sur ta feuille", h:`<p>Pour chaque problème, présente tes calculs (tu peux faire un tableau) et réponds par une phrase.</p><p><b>Problème 1 :</b> Romain a acheté 5 bracelets identiques pour 12 €. Le prix est proportionnel au nombre de bracelets.</p><p>a) Calcule le prix de 20 bracelets.</p><p>b) Lola a acheté des bracelets identiques et a payé 84 €. Combien de bracelets a-t-elle achetés ?</p><p><b>Problème 2 :</b> en courant, Pierre met 30 min pour parcourir 5 km. Il court toujours à la même vitesse. En combien de temps parcourra-t-il 9 km ?</p>`,
   c:`${ptab(["Nombre de bracelets","Prix (en €)"],[5,20,35],[12,48,84],{red:[[1,1],[0,2]],arcs:[{a:0,b:1,t:"× 4"},{a:0,b:1,t:"× 4",pos:"b"}]})}<p><b>Problème 1 :</b> a) 20 = 4 × 5, donc 4 × 12 = 48. <b>20 bracelets coûtent 48 €.</b></p><p>b) Un bracelet coûte 12 ÷ 5 = 2,40 €. 84 ÷ 2,4 = 35. <b>Lola a acheté 35 bracelets.</b> <i>(Ou : 84 = 7 × 12, donc 7 × 5 = 35.)</i></p><p><b>Problème 2 :</b> pour 1 km, il met 30 ÷ 5 = 6 min. Pour 9 km : 9 × 6 = 54. <b>Il parcourra 9 km en 54 min.</b></p>`},
  {n:"Exercice 10", t:"Encore des problèmes", w:"Sur ta feuille", h:`<p>Les situations sont des situations de proportionnalité. Présente tes calculs et réponds par une phrase.</p><p><b>Problème 1 :</b> une voiture consomme 6 L d'essence pour 100 km. Combien consomme-t-elle pour 250 km ? Et pour 30 km ?</p><p><b>Problème 2 :</b> un robinet débite 18 L d'eau en 3 min. Quelle quantité d'eau coule en 10 min ? Combien de temps faut-il pour remplir une baignoire de 150 L ?</p><p><b>Problème 3 :</b> 25 photocopies coûtent 3 €. Combien coûtent 60 photocopies ?</p><p><b>Problème 4 :</b> avec 3 kg de farine, un boulanger fabrique 5 kg de pain. Quelle masse de farine lui faut-il pour fabriquer 8 kg de pain ?</p>`,
   c:`<p><b>Problème 1 :</b> le coefficient est 6 ÷ 100 = 0,06. 250 × 0,06 = 15 et 30 × 0,06 = 1,8. <b>Elle consomme 15 L pour 250 km et 1,8 L pour 30 km.</b> <i>(Ou : 250 km = 2,5 × 100 km → 2,5 × 6 = 15 L.)</i></p><p><b>Problème 2 :</b> en 1 min : 18 ÷ 3 = 6 L. En 10 min : 10 × 6 = 60 L. Pour 150 L : 150 ÷ 6 = 25 min. <b>En 10 min, il coule 60 L ; la baignoire est remplie en 25 min.</b></p><p><b>Problème 3 :</b> 1 photocopie coûte 3 ÷ 25 = 0,12 €. 60 × 0,12 = 7,2. <b>60 photocopies coûtent 7,20 €.</b> <i>(Ou : 50 photocopies coûtent 6 €, 10 coûtent 1,20 €, donc 60 coûtent 7,20 €.)</i></p><p><b>Problème 4 :</b> pour 1 kg de pain : 3 ÷ 5 = 0,6 kg de farine. Pour 8 kg : 8 × 0,6 = 4,8. <b>Il lui faut 4,8 kg de farine.</b></p>${ptab(["Pain (en kg)","Farine (en kg)"],[5,1,8],[3,"0,6","4,8"],{red:[[1,1],[1,2]],arcs:[{a:0,b:1,t:"÷ 5"},{a:1,b:2,t:"× 8"}]})}`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Proportionnel ou pas ?", schema:S_REC, q:{
 1:[ {g:()=>{ const k=ri(2,9), a=ri(2,5), b=a+ri(1,5); return {q:"Ce tableau est-il un tableau de proportionnalité ?", fig:ptab(["Grandeur 1","Grandeur 2"],[a,b],[a*k,b*k]), c:["Oui","Non"], rep:"Oui", ex:`${a*k} ÷ ${a} = ${k} et ${b*k} ÷ ${b} = ${k}.`, sx:S_REC}; }},
     {q:"À 5 ans, Léa mesurait 1 m. La taille est-elle proportionnelle à l'âge ?", c:["Non","Oui"], rep:"Non", sx:S_REC} ],
 2:[ {g:()=>{ const k=ri(2,9), a=ri(2,5), b=a+ri(1,5); const d=pick([-2,-1,1,2]); return {q:"Ce tableau est-il un tableau de proportionnalité ?", fig:ptab(["Grandeur 1","Grandeur 2"],[a,b],[a*k,b*k+d]), c:["Non","Oui"], rep:"Non", ex:`${a*k} ÷ ${a} = ${k}, mais ${b} × ${k} = ${b*k}, pas ${b*k+d}.`, sx:S_REC}; }},
     {g:()=>{ const k=ri(3,12), a=ri(2,6); return {q:`${a} objets coûtent ${a*k} €. Quel est le coefficient de proportionnalité ?`, rep:String(k), ex:`${a*k} ÷ ${a} = ${k}.`, sx:S_REC}; }} ],
 3:[ {q:"Un taxi fait payer 4 € de prise en charge, puis 2 € par km. Le prix est-il proportionnel à la distance ?", c:["Non","Oui"], rep:"Non", ex:"1 km : 6 € ; 2 km : 8 €. 6 ÷ 1 ≠ 8 ÷ 2.", sx:S_PIEGE},
     {g:()=>{ const k=pick([[4,1],[6,1],[12,1],[25,2],[15,1]]), a=pick([2,4,10]), b=a*pick([2,3,5]); return {q:`Quel est le coefficient de ce tableau ?`, fig:ptab(["Grandeur 1","Grandeur 2"],[a,b],[D(a*k[0],k[1]),D(b*k[0],k[1])]), rep:D(k[0],k[1]), ex:`${D(a*k[0],k[1])} ÷ ${a} = ${D(k[0],k[1])}.`, sx:S_REC}; }} ]
}},
{nom:"Quatrième proportionnelle", schema:S_METH, q:{
 1:[ {g:()=>{ const n=ri(2,6), p=ri(3,15), m=pick([2,3,4]); return {q:`${n} cahiers coûtent ${n*p} €. Combien coûtent ${n*m} cahiers (en €) ?`, rep:String(n*m*p), ex:`${n*m} = ${m} × ${n}, donc ${m} × ${n*p} = ${n*m*p}.`, sx:S_METH}; }} ],
 2:[ {g:()=>{ const n=ri(3,8), p=ri(2,12); const m=ri(2,12); return {q:`${n} baguettes coûtent ${D(n*p*10,2)} €. Combien coûtent ${m} baguettes (en €) ?`, rep:D(m*p*10,2), ex:`1 baguette : ${D(n*p*10,2)} ÷ ${n} = ${D(p*10,2)} €. ${m} × ${D(p*10,2)} = ${D(m*p*10,2)}.`, sx:S_METH}; }},
     {g:()=>{ const a=ri(2,6), b=ri(2,6), k=ri(2,9); return {q:`${a} kg → ${a*k} € et ${b} kg → ${b*k} €. Combien coûtent ${a+b} kg (en €) ?`, rep:String((a+b)*k), ex:`${a+b} kg = ${a} kg + ${b} kg, donc ${a*k} + ${b*k} = ${(a+b)*k} €.`, sx:S_METH}; }} ],
 3:[ {q:"8 h de travail → 60 €. Pour 9 h, Claire gagne-t-elle 61 € ?", c:["Non","Oui"], rep:"Non", ex:"On ne peut pas ajouter le même nombre aux deux lignes. 9 × 7,5 = 67,5 €.", sx:S_METH},
     {g:()=>{ const p=ri(2,9), n=ri(3,8), t=p*n*ri(2,6); return {q:`${n} places coûtent ${n*p} €. Combien de places pour ${t} € ?`, rep:String(t/p), ex:`Une place coûte ${p} €. ${t} ÷ ${p} = ${t/p}.`, sx:S_METH}; }} ]
}},
{nom:"Problèmes", schema:S_PIEGE, q:{
 1:[ {q:"Avant d'utiliser une méthode de proportionnalité, je dois…", c:["vérifier que la situation est proportionnelle","calculer une somme","tracer un graphique"], rep:"vérifier que la situation est proportionnelle", sx:S_PIEGE} ],
 2:[ {g:()=>{ const c=ri(5,8); return {q:`Une voiture consomme ${c} L pour 100 km. Combien de litres pour 300 km ?`, rep:String(3*c), ex:`300 km = 3 × 100 km : 3 × ${c} = ${3*c} L.`}; }},
     {g:()=>{ const d=ri(4,9), m=pick([2,3,4]); return {q:`Un robinet débite ${d*m} L en ${m} min. Combien de litres en 10 min ?`, rep:String(10*d), ex:`En 1 min : ${d*m} ÷ ${m} = ${d} L. En 10 min : ${10*d} L.`}; }} ],
 3:[ {g:()=>{ const ins=ri(2,5), h=pick([1,2]); const ph=pick([2,3]); return {q:`Location : ${ins} € d'inscription + ${ph} € par heure. Combien pour ${2*h+2} h (en €) ?`, rep:String(ins+ph*(2*h+2)), ex:`${ins} + ${ph} × ${2*h+2} = ${ins+ph*(2*h+2)}. Ce n'est pas proportionnel !`, sx:S_PIEGE}; }} ]
}}
],
/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement — Chapitre 12", duree:25, info:"Durée : 25 min · Calculatrice non autorisée",
comp:[
  ["CALCULER","Je complète un tableau de proportionnalité.","Ex. 1 (3 points)"],
  ["RAISONNER","Je reconnais une situation de proportionnalité, et je justifie par des calculs.","Ex. 2 (3 points)"],
  ["MODÉLISER","Je résous un problème de proportionnalité en rédigeant.","Ex. 3 (4 points)"]
],
exos:[
{t:"Le jus d'orange", p:3, h:`<p>Au marché, Inès presse des oranges. La quantité de jus obtenue est proportionnelle au nombre d'oranges pressées.</p><p>Complète le tableau. Écris tes calculs.</p>${ptab(["Nombre d'oranges","Jus (en cL)"],[4,8,2,12,""],[30,"","","",105])}`,
 c:`${ptab(["Nombre d'oranges","Jus (en cL)"],[4,8,2,12,14],[30,60,15,90,105],{red:[[1,1],[1,2],[1,3],[0,4]]})}
  <p>8 oranges, c'est 2 fois 4 oranges : 2 × 30 = <b>60 cL</b>. <i>(0,75 point)</i></p>
  <p>2 oranges, c'est la moitié de 4 oranges : 30 ÷ 2 = <b>15 cL</b>. <i>(0,75 point)</i></p>
  <p>12 oranges, c'est 8 + 4 oranges : 60 + 30 = <b>90 cL</b> (ou 3 × 30 = 90). <i>(0,75 point)</i></p>
  <p>105 cL, c'est 90 + 15 cL, donc 12 + 2 = <b>14 oranges</b>. <i>(0,75 point)</i></p>
  <p><i>Toute méthode juste est acceptée, par exemple le passage à l'unité : 1 orange donne 30 ÷ 4 = 7,5 cL de jus.</i></p>`},
{t:"Proportionnel ou pas ?", p:3, h:`<p>Pour chaque tableau, dis si c'est un tableau de proportionnalité. Justifie par des calculs.</p>
  <p><b>Tableau A :</b> le prix de la location d'un kayak.</p>${ptab(["Durée (en h)","Prix (en €)"],[1,2,3,5],[8,14,20,32])}
  <p><b>Tableau B :</b> la masse de pelotes de laine identiques.</p>${ptab(["Nombre de pelotes","Masse (en g)"],[3,4,6,9],[150,200,300,450])}`,
 c:`<p><b>Tableau A :</b> 8 ÷ 1 = 8 et 14 ÷ 2 = 7. <i>(1 point)</i></p><p>Les résultats sont différents : <b>ce n'est pas un tableau de proportionnalité</b>. Le prix n'est pas proportionnel à la durée. <i>(0,5 point)</i></p><p><i>Autre justification : pour 2 h, on devrait payer 2 × 8 = 16 €, or on paie 14 €.</i></p>
  <p><b>Tableau B :</b> 150 ÷ 3 = 50 ; 200 ÷ 4 = 50 ; 300 ÷ 6 = 50 ; 450 ÷ 9 = 50. <i>(1 point)</i></p><p>On trouve toujours 50 : <b>c'est un tableau de proportionnalité</b>, de coefficient 50 (une pelote pèse 50 g). <i>(0,5 point)</i></p>`},
{t:"Deux problèmes", p:4, h:`<p>Écris tes calculs et réponds par une phrase.</p>
  <p><b>Problème 1 :</b> à la piscine, 5 entrées coûtent 17,50 €. Le prix est proportionnel au nombre d'entrées. Combien coûtent 8 entrées ?</p>
  <p><b>Problème 2 :</b> une imprimante imprime 45 pages en 3 minutes. Elle imprime toujours au même rythme.</p><p>a) Combien de pages imprime-t-elle en 7 minutes ?</p><p>b) Combien de temps lui faut-il pour imprimer 120 pages ?</p>`,
 c:`<p><b>Problème 1 :</b> je calcule d'abord le prix d'une entrée : 17,50 ÷ 5 = 3,50 €. <i>(1 point)</i></p><p>Pour 8 entrées : 8 × 3,50 = 28. <i>(0,5 point)</i></p><p><b>8 entrées coûtent 28 €.</b> <i>(0,5 point)</i></p>
  ${ptab(["Nombre d'entrées","Prix (en €)"],[5,1,8],["17,50","3,50",28],{red:[[1,1],[1,2]],arcs:[{a:0,b:1,t:"÷ 5"},{a:1,b:2,t:"× 8"}]})}
  <p><b>Problème 2 :</b> en 1 minute, l'imprimante imprime 45 ÷ 3 = 15 pages.</p>
  <p>a) En 7 minutes : 7 × 15 = 105. <b>Elle imprime 105 pages en 7 minutes.</b> <i>(1 point)</i></p>
  <p>b) 120 ÷ 15 = 8. <b>Il lui faut 8 minutes pour imprimer 120 pages.</b> <i>(1 point)</i></p>`}
],
bep:{
titre:"Évaluation d'entraînement — Chapitre 12 · version aménagée", duree:25, info:"Version aménagée (tiers-temps) · Durée : 25 min · Calculatrice non autorisée",
note:"Le même sujet avec 2 questions en moins, à faire dans le même temps. Le total reste sur 10 points.",
comp:[
  ["CALCULER","Je complète un tableau de proportionnalité.","Ex. 1 (3 points)"],
  ["RAISONNER","Je reconnais une situation de proportionnalité, et je justifie par des calculs.","Ex. 2 (3 points)"],
  ["MODÉLISER","Je résous un problème de proportionnalité en rédigeant.","Ex. 3 (4 points)"]
],
exos:[
{t:"Le jus d'orange", p:3, h:`<p>Au marché, Inès presse des oranges. La quantité de jus obtenue est proportionnelle au nombre d'oranges pressées.</p><p>Complète le tableau. Écris tes calculs.</p>${ptab(["Nombre d'oranges","Jus (en cL)"],[4,8,2,12],[30,"","",""])}`,
 c:`${ptab(["Nombre d'oranges","Jus (en cL)"],[4,8,2,12],[30,60,15,90],{red:[[1,1],[1,2],[1,3]]})}
  <p>8 oranges, c'est 2 fois 4 oranges : 2 × 30 = <b>60 cL</b>. <i>(1 point)</i></p>
  <p>2 oranges, c'est la moitié de 4 oranges : 30 ÷ 2 = <b>15 cL</b>. <i>(1 point)</i></p>
  <p>12 oranges, c'est 8 + 4 oranges : 60 + 30 = <b>90 cL</b> (ou 3 × 30 = 90). <i>(1 point)</i></p>
  <p><i>Toute méthode juste est acceptée, par exemple le passage à l'unité : 1 orange donne 30 ÷ 4 = 7,5 cL de jus.</i></p>`},
{t:"Proportionnel ou pas ?", p:3, h:`<p>Pour chaque tableau, dis si c'est un tableau de proportionnalité. Justifie par des calculs.</p>
  <p><b>Tableau A :</b> le prix de la location d'un kayak.</p>${ptab(["Durée (en h)","Prix (en €)"],[1,2,3,5],[8,14,20,32])}
  <p><b>Tableau B :</b> la masse de pelotes de laine identiques.</p>${ptab(["Nombre de pelotes","Masse (en g)"],[3,4,6,9],[150,200,300,450])}`,
 c:`<p><b>Tableau A :</b> 8 ÷ 1 = 8 et 14 ÷ 2 = 7. <i>(1 point)</i></p><p>Les résultats sont différents : <b>ce n'est pas un tableau de proportionnalité</b>. Le prix n'est pas proportionnel à la durée. <i>(0,5 point)</i></p><p><i>Autre justification : pour 2 h, on devrait payer 2 × 8 = 16 €, or on paie 14 €.</i></p>
  <p><b>Tableau B :</b> 150 ÷ 3 = 50 ; 200 ÷ 4 = 50 ; 300 ÷ 6 = 50 ; 450 ÷ 9 = 50. <i>(1 point)</i></p><p>On trouve toujours 50 : <b>c'est un tableau de proportionnalité</b>, de coefficient 50 (une pelote pèse 50 g). <i>(0,5 point)</i></p>`},
{t:"Deux problèmes", p:4, h:`<p>Écris tes calculs et réponds par une phrase.</p>
  <p><b>Problème 1 :</b> à la piscine, 5 entrées coûtent 17,50 €. Le prix est proportionnel au nombre d'entrées. Combien coûtent 8 entrées ?</p>
  <p><b>Problème 2 :</b> une imprimante imprime 45 pages en 3 minutes. Elle imprime toujours au même rythme. Combien de pages imprime-t-elle en 7 minutes ?</p>`,
 c:`<p><b>Problème 1 :</b> je calcule d'abord le prix d'une entrée : 17,50 ÷ 5 = 3,50 €. <i>(1 point)</i></p><p>Pour 8 entrées : 8 × 3,50 = 28. <i>(0,5 point)</i></p><p><b>8 entrées coûtent 28 €.</b> <i>(0,5 point)</i></p>
  ${ptab(["Nombre d'entrées","Prix (en €)"],[5,1,8],["17,50","3,50",28],{red:[[1,1],[1,2]],arcs:[{a:0,b:1,t:"÷ 5"},{a:1,b:2,t:"× 8"}]})}
  <p><b>Problème 2 :</b> en 1 minute, l'imprimante imprime 45 ÷ 3 = 15 pages. <i>(1 point)</i></p>
  <p>En 7 minutes : 7 × 15 = 105. <b>Elle imprime 105 pages en 7 minutes.</b> <i>(1 point)</i></p>`}
]}
}
};
})();
