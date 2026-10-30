/* 6e — Chapitre 17 : Aires (cours et fiche d'exercices de M. Staal)
   Aires et périmètres des figures sur quadrillage comptés sur ses fiches. */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const co = (p,alt,w) => img("c617co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("c617ex/"+p+".png", alt, w);
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g," ");
const D = (n,k=0) => { const s=String(Math.abs(n)).padStart(k+1,"0"); const a=s.slice(0,s.length-k); let b=k?s.slice(-k):""; b=b.replace(/0+$/,"").replace(/(\d{3})(?=\d)/g,"$1 "); return (n<0?"−":"")+sp(+a)+(b?","+b:""); };

/* unités d'aire : index 0 = km² … 6 = mm² ; conversion exacte (n × 10^-k dans l'unité i) */
const UA = ["km²","hm²","dam²","m²","dm²","cm²","mm²"];
const convA = (n,k,i,j) => { const e = k + 2*(i - j); return e>=0 ? D(n, e) : sp(n*10**(-e)); };
/* calculs en chaîne : une étape par ligne, chaque ligne commence par « A = » (ou « P = », « l = »…) */
const KC = (nm, st, lab) => `<p class="calc">${st.map((t,i)=>(i===0&&lab?lab+" ":"")+nm+(t[0]==="≈"?" ≈ "+t.slice(1).trim():" = "+t)).join("<br>")}</p>`;
const KCS = arr => `<div class="calcs">${arr.map(x=>`<div>${x}</div>`).join("")}</div>`;

/* figure rectilinéaire sur quadrillage : cells = liste de carreaux [x,y] */
function gridFig(cells, o={}){
  const n=o.n||10, m=o.m||7, c=o.c||22, pad=4, W=n*c+2*pad, H=m*c+2*pad, set=new Set(cells.map(p=>p.join(",")));
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:100%" role="img" aria-label="${o.alt||"Une figure sur quadrillage"}">`;
  for(let i=0;i<=n;i++) s+=`<line x1="${pad+i*c}" y1="${pad}" x2="${pad+i*c}" y2="${pad+m*c}" style="stroke:#cfcfcf"/>`;
  for(let j=0;j<=m;j++) s+=`<line x1="${pad}" y1="${pad+j*c}" x2="${pad+n*c}" y2="${pad+j*c}" style="stroke:#cfcfcf"/>`;
  cells.forEach(([x,y])=>{ s+=`<rect x="${pad+x*c}" y="${pad+y*c}" width="${c}" height="${c}" style="fill:${o.fill||"rgba(31,109,176,.22)"}"/>`; });
  cells.forEach(([x,y])=>{ [[0,-1,x,y,x+1,y],[0,1,x,y+1,x+1,y+1],[-1,0,x,y,x,y+1],[1,0,x+1,y,x+1,y+1]].forEach(([dx,dy,a,b,cc,d])=>{ if(!set.has((x+dx)+","+(y+dy))) s+=`<line x1="${pad+a*c}" y1="${pad+b*c}" x2="${pad+cc*c}" y2="${pad+d*c}" style="stroke:${o.col||"#1f6db0"};stroke-width:3;stroke-linecap:round"/>`; }); });
  if(o.label) s+=`<text x="${pad+o.label[0]*c}" y="${pad+o.label[1]*c}" text-anchor="middle" style="font-size:15px;font-weight:700;fill:${o.col||"#1f6db0"}">${o.label[2]}</text>`;
  return s+"</svg>";
}
const perim = cells => { const set=new Set(cells.map(p=>p.join(","))); let p=0; cells.forEach(([x,y])=>[[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy])=>{ if(!set.has((x+dx)+","+(y+dy))) p++; })); return p; };
/* une figure aléatoire connexe de k carreaux, dans un cadre n × m */
function randCells(k, n, m){
  const set=new Set([`${Math.floor(n/2)},${Math.floor(m/2)}`]); let guard=0;
  while(set.size<k && guard++<2000){ const arr=[...set], [x,y]=pick(arr).split(",").map(Number), [dx,dy]=pick([[1,0],[-1,0],[0,1],[0,-1]]); const nx=x+dx, ny=y+dy; if(nx>=0&&ny>=0&&nx<n&&ny<m) set.add(nx+","+ny); }
  return [...set].map(s=>s.split(",").map(Number));
}
window.FIG17 = {UA, convA, D, gridFig, perim, randCells};

/* tableau des unités d'aire (deux colonnes par unité) */
const tabA = (rows) => `<div class="scroll"><table class="std conv"><thead><tr>${UA.map(u=>`<th colspan="2">${u}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${Array.from({length:14},(_,i)=>`<td style="text-align:center;${i%2?"":"border-left:2px solid var(--line,#999)"}">${r[i]??""}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;

/* ---------- schémas ---------- */
const S_AIRE = sch("Aire et périmètre", co("fg","F et G : même aire (12 u.a.), périmètres différents",380)+`<p class="schN">L'aire mesure l'<b>intérieur</b>, le périmètre mesure le <b>contour</b>. Même aire ne veut pas dire même périmètre.</p>`);
const S_UNIT = sch("Convertir des aires", co("dm2","Un carré de 1 dm de côté contient 100 carrés de 1 cm de côté",260)+`<p class="calc">1 cm² = 100 mm² · 1 dm² = 100 cm² · 1 m² = 100 dm²</p><p class="schN">Pour les aires, on multiplie ou on divise par <b>100</b>, pas par 10.</p>`);
const S_FORM = sch("Aire du carré et du rectangle", co("formules","Carré de côté c, rectangle de longueur L et de largeur l",360)+`<p class="calc">Carré : A = c × c &nbsp;·&nbsp; Rectangle : A = L × l</p><p class="schN">Les longueurs dans la même unité ; cm → cm², m → m².</p>`);
const S_CPX = sch("Figure complexe", co("complexe","Découper et additionner, ou enlever un morceau",380)+`<p class="schN">On découpe en rectangles et on additionne, ou on enlève un morceau d'une grande figure.</p>`);

CH["6e-17"] = {
intro:"La notion d'aire (à ne pas confondre avec le périmètre), compter des carreaux, les unités d'aire et les conversions, l'aire du carré et du rectangle, et l'aire d'une figure complexe.",
savoir:[
  "comparer des aires sans les mesurer, et ne pas confondre aire et périmètre ;",
  "déterminer une aire en comptant des carreaux ;",
  "connaître les unités d'aire (mm², cm², dm², m², km²) et passer de l'une à l'autre ;",
  "calculer l'aire d'un carré et d'un rectangle avec une formule ;",
  "calculer l'aire d'une figure complexe en la découpant."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"La notion d'aire", h:`
  <div class="retenir" data-l="Définition"><p>L'<b>aire</b> d'une figure est la mesure de sa surface (l'intérieur de la figure), dans une unité d'aire choisie. Ne pas confondre avec le <b>périmètre</b>, qui est la longueur de son contour.</p></div>
  <h4>1. Comparer des aires</h4>
  <p>On peut comparer deux aires sans calcul : en superposant les figures, en les découpant et recollant, ou en comptant des carreaux d'un quadrillage. Le carreau est alors l'<b>unité d'aire</b> (u.a.).</p>
  ${co("fg","Les figures F et G sur un quadrillage",440)}
  <p><b>Exemple :</b> F et G ont la même aire : 12 u.a. Mais le périmètre de F mesure 16 côtés de carreau et celui de G en mesure 20.</p>
  <p class="attention"><b>ATTENTION :</b> deux figures peuvent avoir la même aire et des périmètres différents (et inversement).</p>`},
{k:"II", t:"Les unités d'aire", h:`
  <h4>1. Les unités</h4>
  <div class="retenir" data-l="Définition"><p><b>1 cm²</b> (« un centimètre carré ») est l'aire d'un carré de 1 cm de côté. De même, 1 mm², 1 dm², 1 m² et 1 km² sont les aires de carrés de côté 1 mm, 1 dm, 1 m et 1 km.</p></div>
  ${co("unites","1 cm², l'aire d'un carré de 1 cm de côté ; 1 cm² = 100 mm²",460)}
  <p><b>Ordres de grandeur :</b> un ongle ≈ 1 cm² ; une feuille A4 ≈ 624 cm² (environ 6 dm²) ; une salle de classe ≈ 50 m² ; la ville de Paris ≈ 105 km².</p>
  <h4>2. Convertir des aires</h4>
  <div class="cpt"><div><p>1 dm = 10 cm. Un carré de 1 dm de côté contient donc 10 rangées de 10 carrés de 1 cm de côté :</p><p class="calc">1 dm² = 10 × 10 cm² = 100 cm²</p><p>De la même façon : 1 cm² = 100 mm² et 1 m² = 100 dm².</p></div>${co("dm2","Un carré de 1 dm de côté : 10 rangées de 10 cm²",240)}</div>
  <div class="retenir" data-l="Propriété"><p>Pour passer d'une unité d'aire à l'unité juste en dessous, on <b>multiplie par 100</b> ; pour passer à l'unité juste au-dessus, on <b>divise par 100</b>.</p><p><b>À retenir :</b> 1 cm² = 100 mm² ; 1 dm² = 100 cm² ; 1 m² = 100 dm² = 10 000 cm² ; 1 km² = 1 000 000 m².</p></div>
  <p><b>Exemples :</b> 3 m² = 3 × 100 dm² = 300 dm² ; 4 500 cm² = (4 500 ÷ 100) dm² = 45 dm² ; 6,5 dm² = 650 cm².</p>
  <p class="attention"><b>ATTENTION :</b> pour les aires, on multiplie ou on divise par 100, et non par 10 comme pour les longueurs !</p>
  <h4>3. Un outil : le tableau des unités d'aire</h4>
  <p>Chaque unité occupe deux colonnes. On place le chiffre des unités dans la colonne de droite de l'unité de départ, puis on lit le nombre dans l'unité voulue.</p>
  ${tabA([["","","","","","","","0,","0","6,","5","0","",""]])}
  <p>Dans le tableau : 6,5 dm² = 650 cm² = 0,065 m².</p>`},
{k:"III", t:"Aire du carré et du rectangle", h:`
  ${co("formules","Carré de côté c ; rectangle de longueur L et de largeur l",440)}
  <div class="retenir" data-l="Formules"><p class="calc">Aire du carré : A = c × c &nbsp;&nbsp;&nbsp; Aire du rectangle : A = L × l</p></div>
  <p class="attention"><b>ATTENTION :</b> les longueurs doivent être exprimées dans la même unité. Si elles sont en cm, l'aire est en cm² ; si elles sont en m, l'aire est en m².</p>
  <p><b>Exemples :</b></p><ul><li>rectangle de 7 cm sur 4 cm :${KC("A",["7 × 4","28 cm²"])}</li><li>carré de côté 1,5 m :${KC("A",["1,5 × 1,5","2,25 m²"])}</li><li>rectangle de 2 m sur 50 cm : 2 m = 200 cm, donc :${KC("A",["200 × 50","10 000 cm²","1 m²"])}</li></ul>
  <p><b>Remarque :</b> un carré d'aire 25 m² a un côté de 5 m, car 5 × 5 = 25.</p>`},
{k:"IV", t:"Aire d'une figure complexe", h:`
  <div class="retenir" data-l="Méthode"><ol><li>On découpe la figure en carrés et rectangles, puis on additionne leurs aires ;</li><li>ou on voit la figure comme une grande figure à laquelle on a enlevé un morceau, et on soustrait les aires.</li></ol></div>
  ${co("complexe","À gauche, une figure découpée en deux rectangles ; à droite, un rectangle dont on a enlevé un carré",460)}
  <p><b>Par addition (à gauche) :</b></p>${KC("A",["A<sub>①</sub> + A<sub>②</sub>","10 × 4 + 4 × 4","40 + 16","56 cm²"])}
  <p><b>Par soustraction (à droite) :</b></p>${KC("A",["11 × 7 − 3 × 3","77 − 9","68 cm²"])}`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"La notion d'aire", e:[
  {n:"Activité 1", t:"Les trois parcs", w:"Sur ta feuille", h:`<p>Sur ce plan, chaque carreau est un carré de 1 m de côté.</p>${ex("act1","Trois parcs A, B et C sur un quadrillage",490)}<p>1) Calcule le périmètre de chaque parc.</p><p>2) Combien de carrés de 1 m de côté faut-il pour recouvrir chaque parc ?</p><p>3) Quel parc a la plus grande aire ? Lequel a le plus grand périmètre ? Que remarques-tu ?</p>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th></th><th>Parc A</th><th>Parc B</th><th>Parc C</th></tr></thead><tbody><tr><th>Périmètre</th><td>22 m</td><td>24 m</td><td>28 m</td></tr><tr><th>Aire</th><td>24 m²</td><td>28 m²</td><td>24 m²</td></tr></tbody></table></div><p>1) Je compte les côtés de carreau sur le contour (1 côté = 1 m).</p><p>Parc A : 8 + 3 + 8 + 3 = <b>22 m</b>. Parc B : 4 + 4 + 2 + 2 + 4 + 4 + 2 + 2 = <b>24 m</b>. Parc C : 10 + 2 + 2 + 2 + 2 + 2 + 6 + 2 = <b>28 m</b>.</p><p>2) Je compte les carreaux à l'intérieur (1 carreau = 1 m²).</p>${KCS([`<p><b>Parc A :</b> un rectangle de 8 sur 3.</p>`+KC("A",["8 × 3","<b>24 m²</b>"]), `<p><b>Parc B :</b> trois bandes de 2 carreaux de haut.</p>`+KC("A",["4 × 2 + 6 × 2 + 4 × 2","8 + 12 + 8","<b>28 m²</b>"]), `<p><b>Parc C :</b> une bande de 10 sur 2 et un carré de 2 sur 2.</p>`+KC("A",["10 × 2 + 2 × 2","20 + 4","<b>24 m²</b>"])])}<p>3) Le parc B a la plus grande aire, mais c'est le parc C qui a le plus grand périmètre. Les parcs A et C ont la même aire, mais pas le même périmètre : <b>l'aire et le périmètre ne varient pas forcément ensemble</b>.</p>`},
  {n:"Exercice 1", t:"Compter des carreaux", w:"Sur ta feuille", h:`<p>Détermine l'aire de chaque figure en unités d'aire (u.a.), puis range les figures de la plus petite aire à la plus grande. Aide : deux demi-carreaux font un carreau.</p>${ex("e1","Quatre figures numérotées sur un quadrillage",490)}`,
   c:`<p>① rectangle de 4 × 3 : <b>12 u.a.</b></p><p>② En bas : un rectangle de 4 × 2 = 8 u.a. En haut : un triangle avec 2 carreaux entiers et 4 demi-carreaux, soit 2 + 2 = 4 u.a. Total : 8 + 4 = <b>12 u.a.</b></p><p>③ la moitié d'un carré de 4 × 4 : 16 ÷ 2 = <b>8 u.a.</b></p><p>④ un rectangle de 5 × 3 = 15 u.a. auquel on enlève deux demi-carreaux (1 u.a.) : 15 − 1 = <b>14 u.a.</b></p><p>Rangement : <b>③ &lt; ① = ② &lt; ④</b>.</p>`},
  {n:"Exercice 2", t:"Aire ou périmètre ?", w:"Sur ta feuille", h:`<p>Pour chaque situation, écris s'il faut calculer une aire ou un périmètre.</p><p>a) Carreler une cuisine · b) Clôturer un champ · c) Poser des plinthes · d) Peindre un mur · e) Border une nappe · f) Semer du gazon</p>`,
   c:`<p>a) <b>aire</b> · b) <b>périmètre</b> · c) <b>périmètre</b> · d) <b>aire</b> · e) <b>périmètre</b> · f) <b>aire</b></p><p><i>On couvre une surface : aire. On fait le tour : périmètre.</i></p>`},
  {n:"Exercice 3", t:"Même aire, périmètres différents", w:"Sur ton cahier", h:`<p>Sur ton cahier à carreaux, trace trois figures différentes qui ont chacune une aire de 12 carreaux. Calcule le périmètre de chacune (en côtés de carreau). Laquelle a le plus petit périmètre ?</p>`,
   c:`<p>Par exemple :</p><div class="figs">${gridFig([...Array(12)].map((_,i)=>[i%12,0]),{n:12,m:1,c:16,alt:"rectangle 12 × 1"})}${gridFig([...Array(12)].map((_,i)=>[i%6,Math.floor(i/6)]),{n:6,m:2,c:16,alt:"rectangle 6 × 2"})}${gridFig([...Array(12)].map((_,i)=>[i%4,Math.floor(i/4)]),{n:4,m:3,c:16,alt:"rectangle 4 × 3"})}</div><p>12 × 1 : périmètre 12 + 1 + 12 + 1 = <b>26</b> · 6 × 2 : périmètre 6 + 2 + 6 + 2 = <b>16</b> · 4 × 3 : périmètre 4 + 3 + 4 + 3 = <b>14</b>.</p><p>Le rectangle 4 × 3, le plus « ramassé », a le plus petit périmètre. (Toute figure d'aire 12 convient, à condition de bien compter.)</p>`}
 ]},
{t:"Unités d'aire et conversions", e:[
  {n:"Exercice 4", t:"Choisir la bonne unité", w:"Sur ta feuille", h:`<p>Complète avec l'unité qui convient : mm², cm², m² ou km².</p><p>a) Une feuille A4 : 623,7 …… · b) Un terrain de football : 7 140 …… · c) La France : 551 695 …… · d) Une tête d'épingle : 2 …… · e) Une chambre : 12 …… · f) Un écran de téléphone : 90 ……</p>`,
   c:`<p>a) 623,7 <b>cm²</b> · b) 7 140 <b>m²</b> · c) 551 695 <b>km²</b> · d) 2 <b>mm²</b> · e) 12 <b>m²</b> · f) 90 <b>cm²</b></p>`},
  {n:"Exercice 5", t:"Convertir en raisonnant", w:"Sur ta feuille", h:`<p>Complète. Rappel : 1 cm² = 100 mm², 1 dm² = 100 cm², 1 m² = 100 dm².</p><p>a) 5 dm² = …… cm² · b) 3 m² = …… dm² · c) 7 cm² = …… mm² · d) 2 m² = …… cm² · e) 800 cm² = …… dm² · f) 45 000 cm² = …… m² · g) 1 200 mm² = …… cm² · h) 3 km² = …… m²</p>`,
   c:`<p>a) 5 × 100 = <b>500</b> cm² · b) 3 × 100 = <b>300</b> dm² · c) 7 × 100 = <b>700</b> mm² · d) 2 × 10 000 = <b>20 000</b> cm²</p><p>e) 800 ÷ 100 = <b>8</b> dm² · f) 45 000 ÷ 10 000 = <b>4,5</b> m² · g) 1 200 ÷ 100 = <b>12</b> cm² · h) 3 × 1 000 000 = <b>3 000 000</b> m²</p>`},
  {n:"Exercice 6", t:"Avec des nombres décimaux", w:"Sur ta feuille", h:`<p>a) Une feuille A4 a une aire de 623,7 cm². Convertis-la en dm², en m² et en mm².</p><p>b) Une salle de classe a une aire de 42,25 m². Convertis-la en dm² et en cm².</p><p>c) Complète : 0,8 dm² = …… cm² · 15 mm² = …… cm² · 2,5 km² = …… m²</p>`,
   c:`<p>a) 623,7 cm² = <b>6,237 dm²</b> = <b>0,062 37 m²</b> = <b>62 370 mm²</b>.</p><p>b) 42,25 × 100 = 4 225, donc 42,25 m² = <b>4 225 dm²</b> ; 4 225 × 100 = 422 500, donc 42,25 m² = <b>422 500 cm²</b>.</p><p>c) 0,8 × 100 = 80 : 0,8 dm² = <b>80 cm²</b> · 15 ÷ 100 = 0,15 : 15 mm² = <b>0,15 cm²</b> · 2,5 × 1 000 000 = 2 500 000 : 2,5 km² = <b>2 500 000 m²</b>.</p>${tabA([["","","","","","","","0,","0","6,","2","3","7","0"]])}<p><i>Dans le tableau : 623,7 cm² = 0,062 37 m² = 6,237 dm² = 62 370 mm².</i></p>`},
  {n:"Exercice 7", t:"Ranger des aires", w:"Sur ta feuille", h:`<p>Range ces aires dans l'ordre croissant (convertis-les d'abord dans la même unité) :</p><p class="calc">3 m² ; 250 dm² ; 31 000 cm² ; 0,5 m² ; 2 900 000 mm²</p>`,
   c:`<p>En m² : 3 m² ; 250 dm² = 2,5 m² ; 31 000 cm² = 3,1 m² ; 0,5 m² ; 2 900 000 mm² = 2,9 m².</p><p class="calc"><b>0,5 m² &lt; 250 dm² &lt; 2 900 000 mm² &lt; 3 m² &lt; 31 000 cm²</b></p>`},
  {n:"Exercice 8", t:"Vrai ou faux ?", w:"Sur ta feuille", h:`<p>a) 1 m² = 100 cm² · b) 1 dm² = 100 cm² · c) 5 cm² = 50 mm² · d) Un carré de 10 cm de côté a une aire de 1 dm².</p>`,
   c:`<p>a) <b>Faux</b> : 1 m² = 10 000 cm². · b) <b>Vrai</b> : 1 dm = 10 cm, et 10 × 10 = 100. · c) <b>Faux</b> : 5 cm² = 500 mm². · d) <b>Vrai</b> : 10 cm = 1 dm, et 1 × 1 = 1 dm² (ou 10 × 10 = 100 cm² = 1 dm²).</p>`}
 ]},
{t:"Aire du carré et du rectangle", e:[
  {n:"Exercice 9", t:"Calculer des aires", w:"Sur ton cahier", h:`<p>Calcule l'aire de chaque figure. Écris la formule, le calcul et l'unité.</p><p>a) un carré de côté 6 cm · b) un rectangle de 9 cm sur 5 cm · c) un carré de côté 2,5 m · d) un rectangle de 12 m sur 7,5 m · e) un rectangle de 1,2 m sur 40 cm (en cm²) · f) un carré de côté 30 mm (en cm²)</p>`,
   c:`${KCS([KC("A",["c × c","6 × 6","<b>36 cm²</b>"],"a)"), KC("A",["L × l","9 × 5","<b>45 cm²</b>"],"b)"), KC("A",["2,5 × 2,5","<b>6,25 m²</b>"],"c)"), KC("A",["12 × 7,5","<b>90 m²</b>"],"d)")])}<p>e) 1,2 m = 120 cm. f) 30 mm = 3 cm.</p>${KCS([KC("A",["120 × 40","<b>4 800 cm²</b>"],"e)"), KC("A",["3 × 3","<b>9 cm²</b>"],"f)")])}`},
  {n:"Exercice 10", t:"Compléter le tableau", w:"Sur ta feuille", h:`<p>Ces lignes correspondent à quatre rectangles. Complète le tableau.</p><div class="scroll"><table class="std"><thead><tr><th>Longueur</th><th>Largeur</th><th>Périmètre</th><th>Aire</th></tr></thead><tbody><tr><td>8 cm</td><td>3 cm</td><td></td><td></td></tr><tr><td>10 m</td><td>6 m</td><td></td><td></td></tr><tr><td>12 dm</td><td></td><td></td><td>60 dm²</td></tr><tr><td>9 cm</td><td></td><td>26 cm</td><td></td></tr></tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Longueur</th><th>Largeur</th><th>Périmètre</th><th>Aire</th></tr></thead><tbody><tr><td>8 cm</td><td>3 cm</td><td><b>22 cm</b></td><td><b>24 cm²</b></td></tr><tr><td>10 m</td><td>6 m</td><td><b>32 m</b></td><td><b>60 m²</b></td></tr><tr><td>12 dm</td><td><b>5 dm</b></td><td><b>34 dm</b></td><td>60 dm²</td></tr><tr><td>9 cm</td><td><b>4 cm</b></td><td>26 cm</td><td><b>36 cm²</b></td></tr></tbody></table></div><p><b>Ligne 1 :</b></p>${KCS([KC("P",["2 × (8 + 3)","2 × 11","22 cm"]), KC("A",["8 × 3","24 cm²"])])}<p><b>Ligne 2 :</b></p>${KCS([KC("P",["2 × (10 + 6)","2 × 16","32 m"]), KC("A",["10 × 6","60 m²"])])}<p><b>Ligne 3 :</b> pour trouver la largeur l, on divise l'aire par la longueur.</p>${KCS([KC("l",["60 ÷ 12","5 dm"]), KC("P",["2 × (12 + 5)","2 × 17","34 dm"])])}<p><b>Ligne 4 :</b> la longueur et la largeur font la moitié du périmètre : 26 ÷ 2 = 13 cm.</p>${KCS([KC("l",["13 − 9","4 cm"]), KC("A",["9 × 4","36 cm²"])])}`},
  {n:"Exercice 11", t:"Retrouver le côté d'un carré", w:"Sur ta feuille", h:`<p>a) aire 49 cm² · b) terrain d'aire 25 m² · c) aire 100 mm² · d) aire 1 m² (en cm)</p>`,
   c:`<p>a) <b>7 cm</b> (7 × 7 = 49) · b) <b>5 m</b> (5 × 5 = 25) · c) <b>10 mm</b> (10 × 10 = 100) · d) 1 m² = 10 000 cm² : <b>100 cm</b> (100 × 100 = 10 000)</p>`},
  {n:"Exercice 12", t:"Des problèmes", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> une chambre rectangulaire mesure 4 m sur 3,5 m. Quelle aire de moquette faut-il ? La moquette coûte 18 € le m² : quel sera le prix ?</p><p><b>Problème 2 :</b> on veut peindre un mur rectangulaire de 5 m sur 2,5 m. Un pot permet de peindre 10 m². Combien de pots faut-il acheter ?</p><p><b>Problème 3 :</b> une terrasse carrée de 3 m de côté est recouverte de carreaux carrés de 50 cm de côté. Combien faut-il de carreaux ?</p>`,
   c:`<p><b>Problème 1 :</b> A = 4 × 3,5 = 14 m². Prix : 14 × 18 = <b>252 €</b>.</p><p><b>Problème 2 :</b> A = 5 × 2,5 = 12,5 m². Un pot ne suffit pas (10 m²) : il faut <b>2 pots</b>.</p><p><b>Problème 3 :</b> 3 m = 300 cm et 300 ÷ 50 = 6 : 6 rangées de 6 carreaux, soit <b>36 carreaux</b>. <i>(Ou : 9 m² = 90 000 cm², un carreau fait 2 500 cm², 90 000 ÷ 2 500 = 36.)</i></p>`}
 ]},
{t:"Aire d'une figure complexe", e:[
  {n:"Exercice 13", t:"Un carré entaillé", w:"Sur ta feuille", h:`<div class="cpt"><div><p>ABCD est un carré de côté 7 cm. E est sur [BC], G est sur [CD] et ECGF est un rectangle avec EC = 3 cm et CG = 4 cm.</p><p>a) Calcule l'aire du carré ABCD.</p><p>b) Calcule l'aire du rectangle ECGF.</p><p>c) Déduis-en l'aire du polygone ABEFGD (en bleu).</p></div>${ex("e13","Le carré ABCD entaillé du rectangle ECGF",200)}</div>`,
   c:`<p>a) Aire du carré : 7 × 7 = <b>49 cm²</b>.</p><p>b) Aire du rectangle : 4 × 3 = <b>12 cm²</b>.</p><p>c) On enlève le rectangle au carré : 49 − 12 = <b>37 cm²</b>.</p>`},
  {n:"Exercice 14", t:"Découper ou enlever", w:"Sur ta feuille", h:`<p>Calcule l'aire de chaque figure. Pour la figure c, les deux carrés ont le même centre.</p>${ex("e14","Figure a en forme de T, figure b en escalier, figure c : un carré troué",490)}`,
   c:`<p><b>Figure a :</b> la barre du haut (12 m sur 3 m) plus le pied (4 m sur 8 m).</p>${KC("A",["12 × 3 + 4 × 8","36 + 32","<b>68 m²</b>"])}<p><b>Figure b :</b> trois colonnes de 2 cm de large et de hauteurs 6, 4 et 2 cm.</p>${KC("A",["2 × 6 + 2 × 4 + 2 × 2","12 + 8 + 4","<b>24 cm²</b>"])}<p><i>(Ou : 6 × 6 = 36 moins les 3 carrés de 2 × 2 enlevés : 36 − 12 = 24.)</i></p><p><b>Figure c :</b> le grand carré moins le petit carré.</p>${KC("A",["12 × 12 − 6 × 6","144 − 36","<b>108 dm²</b>"])}`},
  {n:"Exercice 15", t:"Le cadre photo", w:"Sur ton cahier", h:`<p>Une photo rectangulaire de 15 cm sur 10 cm est entourée d'un cadre de 2 cm de large tout autour. Fais un schéma à main levée, puis calcule l'aire du cadre.</p>`,
   c:`<svg class="fig" viewBox="0 0 230 170" width="230" role="img" aria-label="Une photo de 15 cm sur 10 cm dans un cadre de 2 cm"><rect x="10" y="10" width="209" height="154" style="fill:rgba(224,122,0,.25);stroke:#e07a00;stroke-width:2"/><rect x="32" y="32" width="165" height="110" style="fill:#fff;stroke:var(--ink);stroke-width:2"/><text x="114" y="92" text-anchor="middle" style="font-size:13px;fill:var(--ink)">photo 15 × 10</text><text x="114" y="26" text-anchor="middle" style="font-size:12px;fill:#a35300">2 cm</text></svg><p>Avec le cadre, le grand rectangle mesure 15 + 2 + 2 = 19 cm sur 10 + 2 + 2 = 14 cm : 19 × 14 = 266 cm².</p><p>L'aire A du cadre :</p><p class="calc">A = 266 − 15 × 10<br>A = 266 − 150<br>A = <b>116 cm²</b></p>`},
  {n:"Exercice 16", t:"Le plan d'un appartement", w:"Sur ta feuille", h:`<p>Voici le plan (pas en vraie grandeur) d'un appartement formé de rectangles.</p>${ex("e16","Plan : entrée, séjour, chambre, cuisine, salle de bains",380)}<p>a) Calcule l'aire de chaque pièce. b) Calcule l'aire totale de l'appartement. c) On pose du parquet dans le séjour et la chambre. Il coûte 25 € le m². Quel sera le prix ?</p>`,
   c:`<p>a) Entrée : 5 × 1,5 = <b>7,5 m²</b> · Séjour : 5 × 4 = <b>20 m²</b> · Chambre : 4 × 4 = <b>16 m²</b> · Cuisine : 3 × 2 = <b>6 m²</b> · Salle de bains : 3 × 2 = <b>6 m²</b>.</p><p>b) 7,5 + 20 + 16 + 6 + 6 = <b>55,5 m²</b>.</p><p>c) Séjour et chambre : 20 + 16 = 36 m². Prix : 36 × 25 = <b>900 €</b>.</p>`},
  {n:"En ++", t:"Les pentaminos", w:"Sur ton cahier", h:`<p>Un pentamino est une figure formée de 5 carrés identiques accolés par un côté.</p><p>a) Sur ton cahier à carreaux, dessine le plus possible de pentaminos différents (il en existe 12). b) Quelle est l'aire de chacun, en carreaux ? c) Calcule le périmètre de chacun. Ont-ils tous le même périmètre ?</p>`,
   c:`<p>a) Les 12 pentaminos :</p><div class="figs">${[[[0,0],[1,0],[2,0],[3,0],[4,0]],[[0,0],[0,1],[1,1],[2,1],[3,1]],[[1,0],[0,1],[1,1],[2,1],[3,1]],[[0,0],[1,0],[1,1],[2,1],[3,1]],[[0,0],[1,0],[2,0],[1,1],[1,2]],[[0,0],[0,1],[1,1],[2,1],[2,0]],[[0,0],[0,1],[0,2],[1,2],[2,2]],[[0,0],[0,1],[1,1],[1,2],[2,2]],[[1,0],[0,1],[1,1],[2,1],[1,2]],[[0,0],[1,0],[0,1],[1,1],[0,2]],[[1,0],[2,0],[0,1],[1,1],[1,2]],[[0,0],[1,0],[1,1],[1,2],[2,2]]].map(cs=>gridFig(cs,{n:Math.max(...cs.map(p=>p[0]))+1,m:Math.max(...cs.map(p=>p[1]))+1,c:13,alt:"Un pentamino"})).join("")}</div><p>b) Chacun a une aire de <b>5 carreaux</b>.</p><p>c) Onze pentaminos ont un périmètre de <b>12</b> côtés de carreau ; celui qui contient un carré de 2 × 2 (le « P ») a un périmètre de <b>10</b>. Ils n'ont donc pas tous le même périmètre, alors qu'ils ont tous la même aire.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Aire et périmètre", schema:S_AIRE, q:{
 1:[ {q:"Pour carreler une cuisine, on calcule…", c:["une aire","un périmètre"], rep:"une aire", sx:S_AIRE},
     {q:"Pour clôturer un champ, on calcule…", c:["un périmètre","une aire"], rep:"un périmètre", sx:S_AIRE} ],
 2:[ {g:()=>{ const cs=randCells(ri(5,10),7,5); return {q:"Quelle est l'aire de cette figure (en carreaux) ?", fig:gridFig(cs,{n:7,m:5,c:20}), rep:String(cs.length), sx:S_AIRE}; }} ],
 3:[ {g:()=>{ const cs=randCells(ri(4,8),6,5); return {q:"Quel est le périmètre de cette figure (en côtés de carreau) ?", fig:gridFig(cs,{n:6,m:5,c:22}), rep:String(perim(cs)), sx:S_AIRE}; }},
     {q:"Deux figures de même aire ont toujours le même périmètre.", c:VF, rep:"Faux", sx:S_AIRE} ]
}},
{nom:"Convertir des aires", schema:S_UNIT, q:{
 1:[ {g:()=>{ const i=ri(3,5), n=ri(2,40); return {q:`${n} ${UA[i]} = … ${UA[i+1]}`, rep:convA(n,0,i,i+1), sx:S_UNIT}; }},
     {q:"1 dm² = … cm²", c:["100","10","1 000"], rep:"100", sx:S_UNIT} ],
 2:[ {g:()=>{ const i=ri(4,6), n=100*ri(2,90); return {q:`${sp(n)} ${UA[i]} = … ${UA[i-1]}`, rep:convA(n,0,i,i-1), sx:S_UNIT}; }},
     {g:()=>{ const n=ri(11,99), i=ri(3,5); return {q:`${D(n,1)} ${UA[i]} = … ${UA[i+1]}`, rep:convA(n,1,i,i+1), sx:S_UNIT}; }} ],
 3:[ {g:()=>{ const i=ri(3,4), j=i+2, k=pick([0,1,2]), n=ri(2,999); return {q:`${D(n,k)} ${UA[i]} = … ${UA[j]}`, rep:convA(n,k,i,j), sx:S_UNIT}; }},
     {g:()=>{ const i=ri(5,6), j=i-2, n=ri(2,9)*10**ri(2,4); return {q:`${sp(n)} ${UA[i]} = … ${UA[j]}`, rep:convA(n,0,i,j), sx:S_UNIT}; }} ]
}},
{nom:"Carré et rectangle", schema:S_FORM, q:{
 1:[ {g:()=>{ const L=ri(3,12), l=ri(2,L-1); return {q:`Aire d'un rectangle de ${L} cm sur ${l} cm (en cm²) ?`, rep:String(L*l), sx:S_FORM}; }},
     {g:()=>{ const c=ri(2,12); return {q:`Aire d'un carré de côté ${c} m (en m²) ?`, rep:String(c*c), sx:S_FORM}; }} ],
 2:[ {g:()=>{ const c=ri(11,35); return {q:`Aire d'un carré de côté ${D(c,1)} m (en m²) ?`, rep:D(c*c,2), sx:S_FORM}; }},
     {g:()=>{ const c=ri(2,12); return {q:`Un carré a une aire de ${c*c} cm². Son côté (en cm) ?`, rep:String(c), sx:S_FORM}; }} ],
 3:[ {g:()=>{ const L=ri(1,3), l=10*ri(2,9); return {q:`Aire d'un rectangle de ${L} m sur ${l} cm (en cm²) ?`, rep:sp(100*L*l), ex:`${L} m = ${100*L} cm ; ${100*L} × ${l} = ${sp(100*L*l)}.`, sx:S_FORM}; }},
     {g:()=>{ const L=ri(5,15), l=ri(2,L-1), A=L*l; return {q:`Un rectangle a une aire de ${A} cm² et une longueur de ${L} cm. Sa largeur (en cm) ?`, rep:String(l), sx:S_FORM}; }} ]
}},
{nom:"Figure complexe", schema:S_CPX, q:{
 1:[ {g:()=>{ const a=ri(4,10), b=ri(2,5); return {q:`Un rectangle de ${a} cm sur ${b} cm et un carré de ${b} cm de côté sont accolés. Aire totale (en cm²) ?`, rep:String(a*b+b*b), ex:`${a*b} + ${b*b} = ${a*b+b*b}.`, sx:S_CPX}; }} ],
 2:[ {g:()=>{ const c=ri(6,12), t=ri(2,c-3); return {q:`Un carré de ${c} cm de côté est troué d'un carré de ${t} cm de côté. Aire restante (en cm²) ?`, rep:String(c*c-t*t), ex:`${c*c} − ${t*t} = ${c*c-t*t}.`, sx:S_CPX}; }} ],
 3:[ {g:()=>{ const L=ri(10,20), l=ri(6,12), e=pick([1,2,3]); return {q:`Une photo de ${L} cm sur ${l} cm a un cadre de ${e} cm de large tout autour. Aire du cadre (en cm²) ?`, rep:String((L+2*e)*(l+2*e)-L*l), ex:`L'aire A du cadre :<br>A = (${L+2*e} × ${l+2*e}) − (${L} × ${l})<br>A = ${(L+2*e)*(l+2*e)} − ${L*l}<br>A = ${(L+2*e)*(l+2*e)-L*l} cm²`, sx:S_CPX}; }} ]
}}
],
/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
/* figures de l'évaluation d'entraînement : polygones sur quadrillage (avec des demi-carreaux) et figure en T */
const f1=v=>Math.round(v*10)/10;
function quadri(cor){
  const n=15, m=6, c=24, pad=4, W=n*c+2*pad, H=m*c+2*pad, X=x=>pad+x*c, Y=y=>pad+y*c;
  const FH=[[1,1],[2,1],[2,2],[4,2],[4,1],[5,1],[5,4],[1,4]], FK=[[8,2],[12,2],[12,1],[14,3],[12,5],[12,4],[8,4]];
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:100%" role="img" aria-label="${cor?"La figure K découpée : un rectangle de 8 carreaux et une pointe de 2 carreaux entiers et 4 demi-carreaux":"Deux figures sur un quadrillage : la figure H en forme de U et la figure K en forme de flèche"}">`;
  for(let i=0;i<=n;i++) s+=`<line x1="${X(i)}" y1="${Y(0)}" x2="${X(i)}" y2="${Y(m)}" style="stroke:#cfcfcf"/>`;
  for(let j=0;j<=m;j++) s+=`<line x1="${X(0)}" y1="${Y(j)}" x2="${X(n)}" y2="${Y(j)}" style="stroke:#cfcfcf"/>`;
  const poly=(P,col,fill)=>`<polygon points="${P.map(([x,y])=>X(x)+","+Y(y)).join(" ")}" style="fill:${fill};stroke:${col};stroke-width:3;stroke-linejoin:round"/>`;
  s+=poly(FH,"#1f6db0","rgba(31,109,176,.2)")+poly(FK,"#e07a00","rgba(224,122,0,.2)");
  if(cor) s+=`<line x1="${X(12)}" y1="${Y(2)}" x2="${X(12)}" y2="${Y(4)}" style="stroke:#e07a00;stroke-width:2;stroke-dasharray:5 4"/><text x="${X(10)}" y="${Y(3)+5}" text-anchor="middle" style="font-size:13px;font-weight:700;fill:#e07a00">8</text><text x="${X(12.75)}" y="${Y(3)+5}" text-anchor="middle" style="font-size:13px;font-weight:700;fill:#e07a00">4</text>`;
  s+=`<text x="${X(3)}" y="${Y(3.4)}" text-anchor="middle" style="font-size:16px;font-weight:700;fill:#1f6db0">H</text>`;
  if(!cor) s+=`<text x="${X(10)}" y="${Y(3)+6}" text-anchor="middle" style="font-size:16px;font-weight:700;fill:#e07a00">K</text>`;
  return s+"</svg>";
}
/* figure en T : barre du haut L × e, pied de largeur p ; hauteur totale ht (ou hauteur du pied hp si bep) */
function tFig(o){
  const k=22, ox=60, oy=28, X=x=>ox+x*k, Y=y=>oy+y*k, a=(8-3)/2, b=a+3;
  const P=[[0,0],[8,0],[8,2],[b,2],[b,7],[a,7],[a,2],[0,2]];
  const t=(x,y,s,an)=>`<text x="${f1(x)}" y="${f1(y)}" text-anchor="${an||"middle"}" style="font-size:14px;font-weight:700;fill:var(--ink)">${s}</text>`;
  let s=`<svg class="fig" viewBox="0 0 330 ${o.cor?205:225}" width="330" style="max-width:100%" role="img" aria-label="${o.alt}">`;
  s+=`<polygon points="${P.map(([x,y])=>X(x)+","+Y(y)).join(" ")}" style="fill:rgba(29,122,70,.15);stroke:#1d7a46;stroke-width:2.5;stroke-linejoin:round"/>`;
  s+=t(X(4),Y(0)-8,"8 cm")+t(X(0)-6,Y(1)+5,"2 cm","end")+t(X(4),Y(7)+18,"3 cm");
  if(o.bep) s+=t(X(b)+6,Y(4.5)+5,"5 cm","start");
  else s+=`<line x1="${X(9)}" y1="${Y(0)}" x2="${X(9)}" y2="${Y(7)}" style="stroke:var(--ink);stroke-width:1.3"/><line x1="${X(9)-5}" y1="${Y(0)}" x2="${X(9)+5}" y2="${Y(0)}" style="stroke:var(--ink);stroke-width:1.3"/><line x1="${X(9)-5}" y1="${Y(7)}" x2="${X(9)+5}" y2="${Y(7)}" style="stroke:var(--ink);stroke-width:1.3"/>`+t(X(9)+8,Y(3.5)+5,"7 cm","start");
  if(o.cor) s+=`<line x1="${X(a)}" y1="${Y(2)}" x2="${X(b)}" y2="${Y(2)}" style="stroke:#d0342c;stroke-width:2;stroke-dasharray:6 4"/>`+t(X(1.2),Y(1)+5,"①")+t(X(4),Y(4.8)+5,"②");
  else s+=`<text x="165" y="218" text-anchor="middle" style="font-size:12px;font-style:italic;fill:var(--ink)">Tous les angles sont droits. Figure pas en vraie grandeur.</text>`;
  return s+"</svg>";
}
const COMP=[
  ["CALCULER","J'utilise les formules d'aire du carré et du rectangle.","Ex. 1 (3 points)"],
  ["REPRÉSENTER","Je détermine une aire en comptant des carreaux.","Ex. 2 (2 points)"],
  ["CALCULER","Je convertis des aires.","Ex. 3 (2 points)"],
  ["MODÉLISER","Je calcule l'aire d'une figure complexe.","Ex. 4 (3 points)"]];
const C_CARR=`${quadri(true)}<p><b>Figure H :</b> un rectangle de 4 × 3 = 12 carreaux, auquel il manque 2 carreaux en haut : 12 − 2 = <b>10 u.a.</b> <i>(1 point)</i></p><p><b>Figure K :</b> le rectangle de 4 × 2 = 8 carreaux, plus la pointe : 2 carreaux entiers et 4 demi-carreaux, soit 2 + 2 = 4 carreaux. Total : 8 + 4 = <b>12 u.a.</b> <i>(1 point)</i></p>`;
return {
titre:"Évaluation d'entraînement — Chapitre 17", duree:25, info:"Durée : 25 min · Calculatrice non autorisée",
comp:COMP,
exos:[
{t:"Avec les formules", p:3, h:`<p>a) Calcule l'aire d'un potager rectangulaire de 8 m sur 6,5 m.</p><p>b) Calcule l'aire d'un carreau de faïence carré de 9 dm de côté.</p><p>c) Un rectangle a une aire de 36 cm² et une largeur de 4 cm. Quelle est sa longueur ?</p>`,
 c:`${KCS([KC("A",["L × l","8 × 6,5","<b>52 m²</b>"],"a)"), KC("A",["c × c","9 × 9","<b>81 dm²</b>"],"b)")])}<p><i>(1 point chacun)</i></p><p>c) Longueur × 4 = 36, donc la longueur est 36 ÷ 4 = <b>9 cm</b>. <i>(1 point)</i></p>`},
{t:"Compter les carreaux", p:2, h:`<p>L'unité d'aire (u.a.) est un carreau du quadrillage. Donne l'aire de la figure H et celle de la figure K, en u.a.</p>${quadri(false)}`,
 c:C_CARR},
{t:"Convertir des aires", p:2, h:`<p>Complète.</p><p>a) 5 dm² = …… cm² · b) 3 200 mm² = …… cm² · c) 0,6 m² = …… dm² · d) 85 dm² = …… m²</p>`,
 c:`<p>Pour les aires, on multiplie ou on divise par 100.</p><p>a) 5 × 100 = <b>500 cm²</b> · b) 3 200 ÷ 100 = <b>32 cm²</b> · c) 0,6 × 100 = <b>60 dm²</b> · d) 85 ÷ 100 = <b>0,85 m²</b></p><p><i>0,5 point par conversion.</i></p>`},
{t:"La figure en T", p:3, h:`<p>Quelle est l'aire de cette figure ? Écris tes calculs.</p>${tFig({alt:"Une figure en forme de T : barre du haut de 8 cm sur 2 cm, pied de 3 cm de large, hauteur totale 7 cm"})}`,
 c:`${tFig({cor:true,alt:"La figure en T découpée en deux rectangles ① et ②"})}<p>Je partage la figure en deux rectangles : la barre du haut ① et le pied ②. <i>(0,5 point)</i></p><p>Hauteur du pied : 7 − 2 = 5 cm. <i>(0,5 point)</i></p>${KC("A",["A<sub>①</sub> + A<sub>②</sub>","8 × 2 + 3 × 5","16 + 15","<b>31 cm²</b>"])}<p><i>(2 points)</i></p>`}
],
bep:{
titre:"Évaluation d'entraînement — Chapitre 17 · version aménagée", duree:25, info:"Version aménagée (tiers-temps) · Durée : 25 min · Calculatrice non autorisée",
note:"Le même sujet avec 3 questions en moins, à faire dans le même temps. Le total reste sur 10 points.",
comp:COMP,
exos:[
{t:"Avec les formules", p:3, h:`<p>a) Calcule l'aire d'un potager rectangulaire de 8 m sur 6,5 m.</p><p>b) Un rectangle a une aire de 36 cm² et une largeur de 4 cm. Quelle est sa longueur ?</p>`,
 c:`${KC("A",["L × l","8 × 6,5","<b>52 m²</b>"],"a)")}<p><i>(1,5 point)</i></p><p>b) Longueur × 4 = 36, donc la longueur est 36 ÷ 4 = <b>9 cm</b>. <i>(1,5 point)</i></p>`},
{t:"Compter les carreaux", p:2, h:`<p>L'unité d'aire (u.a.) est un carreau du quadrillage. Donne l'aire de la figure H et celle de la figure K, en u.a.</p>${quadri(false)}`,
 c:C_CARR},
{t:"Convertir des aires", p:2, h:`<p>Complète.</p><p>a) 5 dm² = …… cm² · b) 85 dm² = …… m²</p>`,
 c:`<p>Pour les aires, on multiplie ou on divise par 100.</p><p>a) 5 × 100 = <b>500 cm²</b> · b) 85 ÷ 100 = <b>0,85 m²</b></p><p><i>1 point par conversion.</i></p>`},
{t:"La figure en T", p:3, h:`<p>Quelle est l'aire de cette figure ? Écris tes calculs.</p>${tFig({alt:"Une figure en forme de T : barre du haut de 8 cm sur 2 cm, pied de 3 cm de large, hauteur totale 7 cm"})}`,
 c:`${tFig({cor:true,alt:"La figure en T découpée en deux rectangles ① et ②"})}<p>Je partage la figure en deux rectangles : la barre du haut ① et le pied ②. <i>(0,5 point)</i></p><p>Hauteur du pied : 7 − 2 = 5 cm. <i>(0,5 point)</i></p>${KC("A",["A<sub>①</sub> + A<sub>②</sub>","8 × 2 + 3 × 5","16 + 15","<b>31 cm²</b>"])}<p><i>(2 points)</i></p>`}
]}
};
})()
};
})();
