/* 5e — Chapitre 14 : Grandeurs et représentations graphiques (cours, fiche d'exercices et corrigé de M. Staal)
   Tous les graphiques sont dessinés en SVG à partir des valeurs exactes du cours, de la fiche et du corrigé. */
(function(){
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const co = (p,alt,w) => img("5k14cr/"+p+".png", alt, w);
const r3 = x => Math.round(x*1000)/1000;
const F = x => { const r=r3(x); const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const Q = (a,b) => `{${a}/${b}}`;
const P = (n,x,y) => `${n}(${F(x)} ;&nbsp;${F(y)})`;              /* A(2 ; 3) */
const RED = "#c0262d", BLUE = "#1e5aa8";

/* ------------------------------------------------------------------
   Graphique dans un repère : axes gradués à partir de 0
   xmax, ymax · xs, ys = pas du quadrillage · xl, yl = pas des nombres écrits
   pts [[nom, x, y, dx, dy]] : croix + nom · segs [[x1,y1,x2,y2,pointillé]] · proj [[x,y]] : pointillés vers les axes
   title, xt (titre de l'axe horizontal), yt (titre de l'axe vertical), pw, ph : taille du quadrillage en px
------------------------------------------------------------------ */
function gr(o){
  const xmax=o.xmax, ymax=o.ymax, xs=o.xs||1, ys=o.ys||1, xl=o.xl||xs, yl=o.yl||ys, pw=o.pw||300, ph=o.ph||200;
  const L=o.yt?66:44, T=o.title?36:16, R=26, Bm=o.xt?54:32, W=L+pw+R, H=T+ph+Bm;
  const X=x=>+(L+x*pw/xmax).toFixed(1), Y=y=>+(T+ph-y*ph/ymax).toFixed(1);
  const cx=(x,y)=>`<path d="M${x-6} ${y-6} L${x+6} ${y+6} M${x+6} ${y-6} L${x-6} ${y+6}" style="stroke:${RED};stroke-width:3;fill:none"/>`;
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${o.w||W}" role="img" aria-label="${o.alt||o.title||"Graphique"}">`;
  const nx=Math.round(xmax/xs), ny=Math.round(ymax/ys);
  for(let i=0;i<=nx;i++){ const x=r3(i*xs); s+=`<line x1="${X(x)}" y1="${T}" x2="${X(x)}" y2="${T+ph}" class="gridl"/>`; if(Math.abs(x/xl-Math.round(x/xl))<1e-9) s+=`<text x="${X(x)}" y="${T+ph+20}" class="lab">${F(x)}</text>`; }
  for(let j=0;j<=ny;j++){ const y=r3(j*ys); s+=`<line x1="${L}" y1="${Y(y)}" x2="${L+pw}" y2="${Y(y)}" class="gridl"/>`; if(Math.abs(y/yl-Math.round(y/yl))<1e-9) s+=`<text x="${L-8}" y="${Y(y)+5}" style="font-size:15px;text-anchor:end">${F(y)}</text>`; }
  s+=`<line x1="${L}" y1="${T+ph}" x2="${L+pw}" y2="${T+ph}" class="axe2"/><line x1="${L}" y1="${T}" x2="${L}" y2="${T+ph}" class="axe2"/>`;
  if(o.title) s+=`<text x="${L+pw/2}" y="22" style="font-size:17px;font-weight:700;text-anchor:middle">${o.title}</text>`;
  if(o.xt) s+=`<text x="${L+pw/2}" y="${H-10}" style="font-size:15px;text-anchor:middle">${o.xt}</text>`;
  if(o.yt) s+=`<text x="18" y="${T+ph/2}" transform="rotate(-90 18 ${T+ph/2})" style="font-size:15px;text-anchor:middle">${o.yt}</text>`;
  (o.segs||[]).forEach(([x1,y1,x2,y2,d])=>{ s+=`<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" style="stroke:var(--ink);stroke-width:2${d?";stroke-dasharray:7 5":""}"/>`; });
  (o.poly||null) && (s+=`<polygon points="${o.poly.map(([x,y])=>X(x)+","+Y(y)).join(" ")}" style="fill:color-mix(in srgb,var(--c) 14%,transparent);stroke:var(--c);stroke-width:2.2"/>`);
  (o.proj||[]).forEach(([x,y])=>{ const st=`stroke:${BLUE};stroke-width:1.8;stroke-dasharray:4 4`; if(y) s+=`<line x1="${X(x)}" y1="${Y(y)}" x2="${X(x)}" y2="${Y(0)}" style="${st}"/>`; if(x) s+=`<line x1="${X(x)}" y1="${Y(y)}" x2="${X(0)}" y2="${Y(y)}" style="${st}"/>`; });
  (o.pts||[]).forEach(([n,x,y,dx=11,dy=-10])=>{ s+=cx(X(x),Y(y)); if(Y(y)+dy<14) dy=20; if(X(x)+dx>W-14) dx=-11; if(n) s+=`<text x="${X(x)+dx}" y="${Y(y)+dy}" style="fill:${RED};font-weight:700;font-size:17px;text-anchor:${dx<0?"end":"start"}">${n}</text>`; });
  return s+"</svg>";
}
window.GRA = {gr, F, Q, P, r3};

/* ===================== figures du chapitre ===================== */
const G_DEF = gr({xmax:6, ymax:5, pts:[["A",2,3],["B",5,1],["C",0,4,9,-8],["D",3.5,2]], proj:[[2,3]], xt:"abscisse", yt:"ordonnée", alt:"Repère avec les points A(2 ; 3), B(5 ; 1), C(0 ; 4) et D(3,5 ; 2)"});
const G_POM = gr({xmax:6, ymax:14, ys:2, pts:[["",1,2.4],["",2,4.8],["",3,7.2],["",5,12]], segs:[[0,0,5.83,14,1]], title:"Proportionnelle", xt:"Masse de pommes (kg)", yt:"Prix (€)", pw:280, ph:180, alt:"Prix des pommes : points alignés avec l'origine"});
const G_AGE = gr({xmax:20, ymax:2, xs:5, ys:0.5, yl:1, pts:[["",5,1.1],["",10,1.4],["",15,1.7]], segs:[[0,0.8,20,2,1]], title:"Non proportionnelle", xt:"Âge (ans)", yt:"Taille (m)", pw:280, ph:180, alt:"Taille selon l'âge : points alignés, mais pas avec l'origine"});
const A1 = [["A",1,2],["B",4,1],["C",0,3,9,-8],["D",5,4],["E",3,0,10,-8],["F",2.5,3.5]];
const E1 = [["A",2,3],["B",5,1],["C",0,4],["D",3.5,2],["E",6,5],["F",4,0]];
const G_RANDO = gr({xmax:5, ymax:18, ys:2, pts:[["",1,4],["",2,8],["",3,12],["",4,16]], segs:[[0,0,4,16]], title:"Un randonneur", xt:"Durée (h)", yt:"Distance (km)", alt:"Distance parcourue par le randonneur selon la durée"});
const G5 = [
  gr({xmax:5, ymax:10, ys:2, pts:[1,2,3,4].map(x=>["",x,2*x]), title:"Graphique 1", pw:200, ph:170, alt:"Graphique 1"}),
  gr({xmax:5, ymax:10, ys:2, pts:[1,2,3,4].map(x=>["",x,2*x+1]), title:"Graphique 2", pw:200, ph:170, alt:"Graphique 2"}),
  gr({xmax:5, ymax:10, ys:2, pts:[1,2,3].map(x=>["",x,x*x]), title:"Graphique 3", pw:200, ph:170, alt:"Graphique 3"})
];
const TB = (head, rows) => `<div class="scroll"><table class="std"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;
window.GRA.TB = TB;

/* ===================== schémas ===================== */
const S_COORD = sch("Lire les coordonnées d'un point", gr({xmax:6, ymax:5, pts:[["A",2,3]], proj:[[2,3]], pw:220, ph:150, xt:"abscisse", yt:"ordonnée"})+`<p class="schN">D'abord l'<b>abscisse</b> (axe horizontal), puis l'<b>ordonnée</b> (axe vertical) : A(2 ; 3).</p>`);
const S_LIRE = sch("Lire un graphique", G_RANDO+`<p class="schN">Chaque point a pour abscisse une valeur de la 1<sup>re</sup> ligne du tableau, et pour ordonnée la valeur correspondante de la 2<sup>e</sup> ligne. Ici : en 3 h, 12 km.</p>`);
const S_PROP = sch("Proportionnalité et graphique", `<div class="figs">${G_POM}${G_AGE}</div><p class="schN">Proportionnelles ⇔ points <b>alignés avec l'origine</b>. Le coefficient est l'ordonnée du point d'abscisse 1.</p>`);
const S_TAB = sch("Du tableau au graphique", TB(["Durée (min)","1","2","3"],[["Distance (m)","60","120","180"]])+`<p class="schN">Chaque colonne donne un point : (1 ; 60), (2 ; 120), (3 ; 180).</p>`);

CH["5e-14"] = {
intro:"Se repérer dans un repère orthogonal, représenter une grandeur qui dépend d'une autre par un graphique, lire un graphique, et reconnaître la proportionnalité sur un graphique.",
savoir:[
  "lire et placer des points dans un repère orthogonal (abscisse, ordonnée) ;",
  "représenter par un graphique une grandeur qui dépend d'une autre ;",
  "lire graphiquement des valeurs sur un graphique ;",
  "reconnaître graphiquement une situation de proportionnalité."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Se repérer dans le plan", h:`
  <div class="retenir" data-l="Définition"><p>Un <b>repère orthogonal</b> est formé de deux droites graduées perpendiculaires :</p><ul><li><b>l'axe des abscisses</b> (horizontal) ;</li><li><b>l'axe des ordonnées</b> (vertical).</li></ul><p>Elles se coupent en un point O appelé l'<b>origine</b>.</p><p>Un point est repéré par ses <b>coordonnées</b> (abscisse ; ordonnée), toujours dans cet ordre.</p></div>
  <div class="figs">${G_DEF}</div>
  <p>Le point A a pour coordonnées (2 ; 3) : on lit son abscisse 2 sur l'axe horizontal, et son ordonnée 3 sur l'axe vertical.</p>
  <p><b>Exemples :</b></p>
  <ul><li>B(5 ; 1) ;</li><li>C(0 ; 4) est sur l'axe des ordonnées ;</li><li>D(3,5 ; 2) : l'abscisse peut être un nombre décimal.</li></ul>
  <div class="retenir" data-l="Méthode"><p><b>1)</b> Pour <b>placer</b> un point M(<i>x</i> ; <i>y</i>) : je pars de l'origine, j'avance de <i>x</i> vers la droite, puis je monte de <i>y</i> ;</p><p><b>2)</b> pour <b>lire</b> les coordonnées d'un point : je lis d'abord son abscisse, puis son ordonnée.</p></div>`},
{k:"II", t:"Une grandeur qui dépend d'une autre", h:`
  <div class="retenir" data-l="À retenir"><p>Quand une grandeur dépend d'une autre (le prix selon la masse, la taille selon l'âge…), on peut la représenter par un <b>tableau de valeurs</b>, puis par un <b>graphique</b>.</p><p>Chaque colonne du tableau donne un point :</p><ul><li>abscisse = valeur de la 1<sup>re</sup> ligne ;</li><li>ordonnée = valeur de la 2<sup>e</sup> ligne.</li></ul></div>
  <p><b>Exemple :</b> le prix de pommes à 2,40 € le kilogramme.</p>
  ${TB(["Masse de pommes (kg)","1","2","3","5"],[["Prix (€)","2,40","4,80","7,20","12"]])}
  <p>Les points de coordonnées (1 ; 2,4), (2 ; 4,8), (3 ; 7,2) et (5 ; 12) sont placés sur le graphique ci-dessous.</p>
  <div class="figs">${G_POM}</div>
  <p>On peut y lire le prix correspondant à une masse donnée.</p>`},
{k:"III", t:"Reconnaître la proportionnalité sur un graphique", h:`
  <div class="figs">${G_POM}${G_AGE}</div>
  <div class="retenir" data-l="Propriété"><p>Deux grandeurs sont <b>proportionnelles</b> si et seulement si les points qui les représentent sont <b>alignés avec l'origine</b> du repère.</p><p>Le coefficient de proportionnalité est l'ordonnée du point d'abscisse 1.</p></div>
  <div class="attention"><b>ATTENTION :</b> des points peuvent être alignés <b>sans</b> l'être avec l'origine (graphique « Non proportionnelle » : la taille en fonction de l'âge). Alors, ce n'est <b>pas</b> une situation de proportionnalité.</div>
  <p><b>À toi de jouer :</b> place M(4 ; 2) et N(1 ; 5) dans un repère. Les points (1 ; 3), (2 ; 6), (4 ; 12) sont-ils alignés avec l'origine ?</p>
  <details><summary>Voir la correction</summary><div class="corr"><div class="figs">${gr({xmax:6, ymax:6, pts:[["M",4,2],["N",1,5]], pw:240, ph:240, alt:"Les points M(4 ; 2) et N(1 ; 5)"})}${gr({xmax:5, ymax:14, ys:2, pts:[["",1,3],["",2,6],["",4,12]], segs:[[0,0,4.67,14,1]], pw:240, ph:220, alt:"Les points (1 ; 3), (2 ; 6) et (4 ; 12) alignés avec l'origine"})}</div>
   <p class="calc">${Q(3,1)} = 3 &nbsp;&nbsp; ${Q(6,2)} = 3 &nbsp;&nbsp; ${Q(12,4)} = 3</p><p><b>Oui</b> : les quotients sont égaux, les points sont alignés avec l'origine (coefficient 3).</p></div></details>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Se repérer dans le plan", e:[
  {n:"Activité 1", t:"Lire des coordonnées", w:"Sur ta feuille", h:`<div class="figs">${gr({xmax:6, ymax:5, pts:A1, alt:"Repère avec les points A, B, C, D, E et F"})}</div><p>Complète les coordonnées des points :</p><p>A(… ; …) &nbsp; B(… ; …) &nbsp; C(… ; …) &nbsp; D(… ; …) &nbsp; E(… ; …) &nbsp; F(… ; …)</p>`,
   c:`<p>${A1.map(([n,x,y])=>P(n,x,y)).join(" · ")}</p><div class="figs">${gr({xmax:6, ymax:5, pts:A1, proj:A1.map(p=>[p[1],p[2]])})}</div><p>C est sur l'axe des ordonnées (abscisse 0) ; E est sur l'axe des abscisses (ordonnée 0).</p>`},
  {n:"Exercice 1", t:"Placer des points", w:"Sur ton cahier", h:`<p>Trace un repère orthogonal :</p><ul><li>origine O en bas à gauche ;</li><li>1 cm (2 carreaux) pour une unité sur chaque axe ;</li><li>l'axe des abscisses va jusqu'à 7, l'axe des ordonnées jusqu'à 6.</li></ul><p>Place les points : ${E1.map(([n,x,y])=>P(n,x,y)).join(" &nbsp; ")}.</p><p>Que remarques-tu pour les points C et F ?</p>`,
   c:`<div class="figs">${gr({xmax:7, ymax:6, pts:E1, pw:7*40, ph:6*40, alt:"Repère avec les points A(2 ; 3), B(5 ; 1), C(0 ; 4), D(3,5 ; 2), E(6 ; 5) et F(4 ; 0)"})}</div><p>C est sur l'axe des ordonnées (son abscisse est 0).</p><p>F est sur l'axe des abscisses (son ordonnée est 0).</p>`},
  {n:"Exercice 2", t:"Un rectangle dans le repère", w:"Sur ton cahier", h:`<p>Dans un repère orthogonal, on place les points A(1 ; 4), B(5 ; 4) et C(5 ; 1).</p><p>a) Place ces trois points. Quelle est la nature du triangle ABC ?</p><p>b) Place le point D pour que ABCD soit un rectangle. Donne ses coordonnées.</p><p>c) Calcule le périmètre et l'aire du rectangle ABCD (unité : 1 cm).</p>`,
   c:`<div class="figs">${gr({xmax:6, ymax:5, poly:[[1,4],[5,4],[5,1],[1,1]], pts:[["A",1,4,-10,-10],["B",5,4],["C",5,1,11,18],["D",1,1,-10,18]], pw:240, ph:200, alt:"Le rectangle ABCD"})}</div>
   <p>a) AB est horizontal (même ordonnée 4) ; BC est vertical (même abscisse 5). Le triangle ABC est <b>rectangle en B</b>.</p><p>b) <b>D(1 ; 1)</b> : même abscisse que A, même ordonnée que C.</p><p>c) AB = 5 − 1 = 4 cm et BC = 4 − 1 = 3 cm.</p><p>Le périmètre P :</p><p class="calc">P = 2 × (4 + 3)<br>P = 2 × 7<br>P = <b>14 cm</b></p><p>Aire : 4 × 3 = <b>12 cm<sup>2</sup></b>.</p>`}
 ]},
{t:"Une grandeur qui dépend d'une autre", e:[
  {n:"Exercice 3", t:"Lire un graphique", w:"Sur ton cahier", h:`<p>Le graphique représente la distance parcourue par un randonneur selon la durée de sa marche.</p><div class="figs">${G_RANDO}</div><p>a) Quelle distance a-t-il parcourue en 3 heures ?</p><p>b) Combien de temps lui faut-il pour parcourir 8 km ?</p><p>c) Complète le tableau avec les valeurs lues sur le graphique, puis calcule les quotients distance ÷ durée.</p>${TB(["Durée (h)","1","2","3","4"],[["Distance (km)","","","",""]])}<p>d) Cette situation est-elle une situation de proportionnalité ? Quelle est sa vitesse moyenne ?</p>`,
   c:`<div class="figs">${gr({xmax:5, ymax:18, ys:2, pts:[["",1,4],["",2,8],["",3,12],["",4,16]], segs:[[0,0,4,16]], proj:[[3,12],[2,8]], title:"Un randonneur", xt:"Durée (h)", yt:"Distance (km)"})}</div>
   <p>a) On part de 3 h sur l'axe horizontal, on monte jusqu'à la droite, puis on lit l'ordonnée : <b>12 km</b>.</p><p>b) On part de 8 km sur l'axe vertical, on va jusqu'à la droite, puis on lit l'abscisse : <b>2 h</b>.</p><p>c)</p>${TB(["Durée (h)","1","2","3","4"],[["Distance (km)","4","8","12","16"]])}<p class="calc">4 ÷ 1 = 4 &nbsp;&nbsp; 8 ÷ 2 = 4 &nbsp;&nbsp; 12 ÷ 3 = 4 &nbsp;&nbsp; 16 ÷ 4 = 4</p><p>d) <b>Oui</b> : les quotients sont égaux et les points sont alignés avec l'origine. La vitesse moyenne est <b>4 km/h</b> (c'est le coefficient de proportionnalité).</p>`},
  {n:"Exercice 4", t:"Construire un graphique", w:"Sur ton cahier", h:`<p>Une fillette marche à vitesse constante. Voici la distance parcourue selon la durée :</p>${TB(["Durée (min)","1","2","3","4","5"],[["Distance (m)","60","120","180","240","300"]])}<p>Construis un graphique :</p><ul><li>en abscisse, 1 cm pour 1 minute (jusqu'à 6) ;</li><li>en ordonnée, 1 cm pour 50 m (jusqu'à 350).</li></ul><p>Place les points et relie-les.</p>`,
   c:`<p>Les points (1 ; 60), (2 ; 120), (3 ; 180), (4 ; 240) et (5 ; 300) sont alignés avec l'origine : c'est une situation de proportionnalité (coefficient 60 m/min).</p><div class="figs">${gr({xmax:6, ymax:350, ys:50, pts:[1,2,3,4,5].map(x=>["",x,60*x]), segs:[[0,0,5,300]], xt:"Durée (min)", yt:"Distance (m)", pw:6*40, ph:7*40, alt:"Graphique : distance parcourue par la fillette selon la durée, points alignés avec l'origine"})}</div>`}
 ]},
{t:"Reconnaître la proportionnalité sur un graphique", e:[
  {n:"Exercice 5", t:"Reconnaître une situation de proportionnalité", w:"Sur ton cahier", h:`<p>Voici trois graphiques. Pour chacun, dis s'il représente une situation de proportionnalité, et justifie.</p><div class="figs">${G5.join("")}</div><p>a) Graphique 1 : ……… b) Graphique 2 : ……… c) Graphique 3 : ………</p>`,
   c:`<p>a) <b>Oui</b> : les points (1 ; 2), (2 ; 4), (3 ; 6), (4 ; 8) sont alignés avec l'origine ; coefficient 2.</p><p>b) <b>Non</b> : les points sont alignés, mais pas avec l'origine (${Q(3,1)} = 3 et ${Q(5,2)} = 2,5).</p><p>c) <b>Non</b> : les points ne sont pas alignés (${Q(1,1)} = 1 ; ${Q(4,2)} = 2 ; ${Q(9,3)} = 3).</p>`},
  {n:"Exercice 6", t:"Tableaux et proportionnalité", w:"Sur ton cahier", h:`<p>Pour chaque tableau, calcule les quotients, puis dis si les points associés seraient alignés avec l'origine.</p><p>a) Longueur d'un ressort selon la masse accrochée.</p>${TB(["Masse (g)","50","100","150","200"],[["Longueur (cm)","12","14","16","18"]])}<p>b) Prix d'entrées à la piscine.</p>${TB(["Nombre de tickets","1","3","5","10"],[["Prix (€)","3,50","10,50","17,50","35"]])}`,
   c:`<p>a) ${Q(12,50)} = 0,24 ; ${Q(14,100)} = 0,14 : les quotients sont différents. Les points ne sont pas alignés avec l'origine : ce n'est <b>pas</b> une situation de proportionnalité.</p><p>b) ${Q("3,5",1)} = 3,5 ; ${Q("10,5",3)} = 3,5 ; ${Q("17,5",5)} = 3,5 ; ${Q(35,10)} = 3,5 : les quotients sont égaux. Les points sont alignés avec l'origine : c'est une situation de <b>proportionnalité</b> (coefficient 3,5).</p>`},
  {n:"Exercice 7", t:"Deux formules de stationnement", w:"Sur ta feuille et sur ton cahier", h:`<p>Un parking propose deux formules :</p><ul><li><b>Formule A :</b> 2 € par heure.</li><li><b>Formule B :</b> 3 € pour l'entrée, puis 1 € par heure.</li></ul><p><b>1)</b> Complète le tableau.</p>${TB(["Durée (h)","1","2","3","4","5"],[["Prix formule A (€)","","","","",""],["Prix formule B (€)","","","","",""]])}<p><b>2)</b> Laquelle de ces formules correspond à une situation de proportionnalité ? Explique.</p><p><b>3)</b> À partir de combien d'heures la formule A coûte-t-elle plus cher que la formule B ?</p>`,
   c:`<p><b>1)</b></p>${TB(["Durée (h)","1","2","3","4","5"],[["Prix formule A (€)","2","4","6","8","10"],["Prix formule B (€)","4","5","6","7","8"]])}<p><b>2)</b> La <b>formule A</b> : le prix est le produit de la durée par 2 (coefficient 2 €/h).</p><p>Pour la formule B, les quotients ${Q(4,1)} = 4 et ${Q(5,2)} = 2,5 sont différents : ce n'est pas une situation de proportionnalité.</p><p><b>3)</b> À 3 h, les deux formules coûtent 6 €. À 4 h, la formule A coûte 8 € et la formule B 7 €.</p><p>À partir de <b>4 heures</b>, la formule A est plus chère.</p>`},
  {n:"Exercice 8", t:"Utiliser le coefficient de proportionnalité", w:"Sur ton cahier", h:`<p>Dans un repère, on place le point A(1 ; 3).</p><p>a) La situation est une situation de proportionnalité dont le graphique passe par A. Quel est le coefficient de proportionnalité ?</p><p>b) Complète le tableau avec ce coefficient : abscisses 2 ; 4 ; 5 ; 10.</p><p>c) Construis un repère (1 cm pour 1 unité en abscisse, 1 cm pour 2 unités en ordonnée) et place tous les points. Que constates-tu ?</p>`,
   c:`<p>a) Le coefficient est l'ordonnée du point d'abscisse 1, soit <b>3</b>.</p><p>b)</p>${TB(["Abscisse","1","2","4","5","10"],[["Ordonnée","3","6","12","15","30"]])}<p>Les ordonnées sont 2 × 3 = 6 ; 4 × 3 = 12 ; 5 × 3 = 15 ; 10 × 3 = 30.</p><p>c) Les points (1 ; 3), (2 ; 6), (4 ; 12), (5 ; 15) et (10 ; 30) sont <b>alignés avec l'origine</b>.</p><div class="figs">${gr({xmax:11, ymax:32, ys:2, yl:4, pts:[["A",1,3,-12,-4],["",2,6],["",4,12],["",5,15],["",10,30]], segs:[[0,0,10.67,32,1]], pw:11*22, ph:16*22, /* 1 cm pour 1 en abscisse, 1 cm pour 2 en ordonnée */ alt:"Les points alignés avec l'origine"})}</div>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Coordonnées d'un point", schema:S_COORD, q:{
 1:[ {g:()=>{ const x=ri(1,6), y=ri(1,5); return {q:"Lis les coordonnées du point M.", fig:gr({xmax:6, ymax:5, pts:[["M",x,y]], pw:240, ph:200}), t:"M(□ ; □)", r:[F(x),F(y)], ex:`Abscisse ${x} (axe horizontal), ordonnée ${y} (axe vertical).`, sx:gr({xmax:6, ymax:5, pts:[["M",x,y]], proj:[[x,y]], pw:240, ph:200})}; }},
     {g:()=>{ let x,y; do{ x=ri(1,5); y=ri(1,5); }while(x===y); const lab=shuf(["M","N","R"]); const pts=[[lab[0],x,y],[lab[1],y,x],[lab[2],x,y===5?4:y+1]]; const good=lab[0];
       return {q:`Quel point a pour coordonnées (${x} ; ${y}) ?`, fig:gr({xmax:6, ymax:6, pts, pw:240, ph:240}), c:["M","N","R"], rep:good, ex:"On lit d'abord l'abscisse, puis l'ordonnée.", sx:gr({xmax:6, ymax:6, pts:[[good,x,y]], proj:[[x,y]], pw:240, ph:240})}; }} ],
 2:[ {g:()=>{ const z=pick(["x","y"]); let x=ri(1,6), y=ri(1,5); if(z==="x") x=0; else y=0; return {q:"Lis les coordonnées du point M.", fig:gr({xmax:6, ymax:5, pts:[["M",x,y]], pw:240, ph:200}), t:"M(□ ; □)", r:[F(x),F(y)], ex:x===0?"M est sur l'axe des ordonnées : son abscisse est 0.":"M est sur l'axe des abscisses : son ordonnée est 0.", sx:S_COORD}; }},
     {q:"Un point a pour abscisse 0. Il se trouve sur :", c:["l'axe des ordonnées","l'axe des abscisses"], rep:"l'axe des ordonnées", ex:"Abscisse 0 : on n'avance pas vers la droite, on reste sur l'axe vertical.", sx:S_COORD} ],
 3:[ {g:()=>{ let x,y; do{ x=ri(1,11)/2; y=ri(1,9)/2; }while(Number.isInteger(x)&&Number.isInteger(y)); return {q:"Lis les coordonnées du point M.", fig:gr({xmax:6, ymax:5, pts:[["M",x,y]], pw:240, ph:200}), t:"M(□ ; □)", r:[F(x),F(y)], ex:`Le point est au milieu d'un carreau : M(${F(x)} ; ${F(y)}).`, sx:gr({xmax:6, ymax:5, pts:[["M",x,y]], proj:[[x,y]], pw:240, ph:200})}; }},
     {q:"Dans D(3,5 ; 2), le nombre 3,5 est :", c:["l'abscisse de D","l'ordonnée de D"], rep:"l'abscisse de D", ex:"Le premier nombre est l'abscisse, le deuxième est l'ordonnée.", sx:S_COORD} ]
}},
{nom:"Lire un graphique", schema:S_LIRE, q:{
 1:[ {g:()=>{ const v=pick([3,4,5,6]), t=ri(1,4); return {q:`Le graphique donne la distance parcourue par un randonneur selon la durée. Quelle distance a-t-il parcourue en ${t} h (en km) ?`, fig:gr({xmax:5, ymax:v*5, ys:v>4?5:2, pts:[1,2,3,4].map(h=>["",h,v*h]), segs:[[0,0,4,4*v]], xt:"Durée (h)", yt:"Distance (km)", pw:260, ph:200}), rep:String(v*t), ex:`On part de ${t} sur l'axe des abscisses, on monte jusqu'au point, puis on lit l'ordonnée : ${v*t} km.`, sx:gr({xmax:5, ymax:v*5, ys:v>4?5:2, pts:[1,2,3,4].map(h=>["",h,v*h]), segs:[[0,0,4,4*v]], proj:[[t,v*t]], xt:"Durée (h)", yt:"Distance (km)", pw:260, ph:200})}; }} ],
 2:[ {g:()=>{ const v=pick([3,4,5,6]), t=ri(1,4); return {q:`D'après le graphique, combien de temps faut-il pour parcourir ${v*t} km (en h) ?`, fig:gr({xmax:5, ymax:v*5, ys:v>4?5:2, pts:[1,2,3,4].map(h=>["",h,v*h]), segs:[[0,0,4,4*v]], xt:"Durée (h)", yt:"Distance (km)", pw:260, ph:200}), rep:String(t), ex:`On part de ${v*t} sur l'axe des ordonnées, on va jusqu'au point, puis on lit l'abscisse : ${t} h.`, sx:gr({xmax:5, ymax:v*5, ys:v>4?5:2, pts:[1,2,3,4].map(h=>["",h,v*h]), segs:[[0,0,4,4*v]], proj:[[t,v*t]], xt:"Durée (h)", yt:"Distance (km)", pw:260, ph:200})}; }} ],
 3:[ {g:()=>{ const v=pick([4,6]), t=pick([1.5,2.5,3.5]); const G=o=>gr(Object.assign({xmax:5, ymax:v*5, ys:v>4?3:2, pts:[1,2,3,4].map(h=>["",h,v*h]), segs:[[0,0,4,4*v]], xt:"Durée (h)", yt:"Distance (km)", pw:260, ph:200},o)); return {q:`D'après le graphique, quelle distance (en km) le randonneur a-t-il parcourue en ${Math.floor(t)} h 30 min ?`, fig:G({}), rep:F(v*t), ex:`${Math.floor(t)} h 30 min = ${F(t)} h. La droite passe à mi-chemin entre ${v*Math.floor(t)} et ${v*Math.ceil(t)} : ${F(v*t)} km.`, sx:G({proj:[[t,v*t]]})}; }} ]
}},
{nom:"Du tableau au graphique", schema:S_TAB, q:{
 1:[ {q:"Chaque colonne d'un tableau de valeurs donne un point. Son abscisse est…", c:["la valeur de la 1<sup>re</sup> ligne","la valeur de la 2<sup>e</sup> ligne","toujours 0"], rep:"la valeur de la 1<sup>re</sup> ligne", ex:"Abscisse = 1<sup>re</sup> ligne ; ordonnée = 2<sup>e</sup> ligne.", sx:S_TAB} ],
 2:[ {g:()=>{ const s=pick([50,60,70,80]), m=ri(2,5); const good=`(${m} ; ${s*m})`; return {q:`Une fillette parcourt ${s} m par minute. Sur le graphique (abscisse : durée en min ; ordonnée : distance en m), quel point correspond à ${m} min ?`, c:shuf(uniq(good,[`(${s*m} ; ${m})`,`(${m} ; ${s})`,`(${m+1} ; ${s*m})`]).slice(0,3)), rep:good, ex:`En ${m} min, elle parcourt ${m} × ${s} = ${s*m} m : abscisse ${m}, ordonnée ${s*m}.`, sx:S_TAB}; }} ],
 3:[ {g:()=>{ const p=pick([2,3]), q=1, e=(p-q)*ri(1,3)+pick([0,0,1]); const h0=e/(p-q), h=Number.isInteger(h0)?h0+1:Math.ceil(h0);
       return {q:`Parking : formule A, ${p} € par heure ; formule B, ${e} € pour l'entrée puis ${q} € par heure. À partir de combien d'heures (entières) la formule A coûte-t-elle plus cher que la formule B ?`, rep:String(h), ex:`À ${h} h : A coûte ${p*h} € et B coûte ${e} + ${q*h} = ${e+q*h} €.${h>1?` À ${h-1} h : A coûte ${p*(h-1)} € et B ${e+q*(h-1)} €.`:""}`, sx:TB(["Durée (h)",...[1,2,3,4,5].map(String)],[["Formule A (€)",...[1,2,3,4,5].map(x=>String(p*x))],["Formule B (€)",...[1,2,3,4,5].map(x=>String(e+q*x))]])}; }} ]
}},
{nom:"Proportionnalité et graphique", schema:S_PROP, q:{
 1:[ {g:()=>{ const k=ri(1,3), b=ri(1,3), prop=Math.random()<0.5; const pts=[1,2,3,4].map(x=>["",x,prop?k*x:k*x+b]); return {q:"Ce graphique représente-t-il une situation de proportionnalité ?", fig:gr({xmax:5, ymax:16, ys:2, pts, pw:240, ph:200}), c:["Oui","Non"], rep:prop?"Oui":"Non", ex:prop?`Les points sont alignés avec l'origine (coefficient ${k}).`:`Les points sont alignés, mais pas avec l'origine.`, sx:S_PROP}; }},
     {q:"Deux grandeurs sont proportionnelles si les points qui les représentent sont…", c:["alignés avec l'origine","alignés","au-dessus de l'axe des abscisses"], rep:"alignés avec l'origine", sx:S_PROP} ],
 2:[ {g:()=>{ const k=ri(2,6); return {q:`Une situation de proportionnalité est représentée par des points alignés avec l'origine. Le point d'abscisse 1 a pour ordonnée ${k}. Quel est le coefficient de proportionnalité ?`, rep:String(k), ex:"Le coefficient est l'ordonnée du point d'abscisse 1.", sx:S_PROP}; }},
     {g:()=>{ const k=ri(2,6), x=pick([2,4,5,10]); return {q:`Le graphique d'une situation de proportionnalité passe par A(1 ; ${k}). Quelle est l'ordonnée du point d'abscisse ${x} ?`, rep:String(k*x), ex:`Coefficient ${k} : ${x} × ${k} = ${k*x}.`, sx:S_PROP}; }} ],
 3:[ {g:()=>{ const k=pick([2,3,3.5,1.5]), prop=Math.random()<0.5, xs=[1,3,5,10]; const ys=xs.map(x=>r3(k*x)); if(!prop) ys[3]=r3(ys[3]+pick([1,2,-1])); return {q:"Les points de ce tableau seraient-ils alignés avec l'origine ?", fig:TB(["Abscisse",...xs.map(String)],[["Ordonnée",...ys.map(F)]]), c:["Oui","Non"], rep:prop?"Oui":"Non", ex:prop?`Tous les quotients valent ${F(k)} : c'est une situation de proportionnalité.`:`${Q(F(ys[0]),1)} = ${F(ys[0])} mais ${Q(F(ys[3]),10)} = ${F(ys[3]/10)} : les quotients sont différents.`, sx:S_PROP}; }},
     {g:()=>{ const p=pick([2,3]), e=ri(2,4), q=1; return {q:`Formule A : ${p} € par heure. Formule B : ${e} € pour l'entrée, puis ${q} € par heure. Quelle formule correspond à une situation de proportionnalité ?`, c:["la formule A","la formule B","les deux"], rep:"la formule A", ex:`Formule A : prix = ${p} × durée. Formule B : ${Q(e+1,1)} = ${e+1} et ${Q(e+2,2)} = ${F((e+2)/2)}, les quotients sont différents.`, sx:S_PROP}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
const PK = [["K",3,4],["L",6,2],["M",0,1,9,-8]];
const PN = [["N",2,0,8,-10],["P",4.5,3.5]];
const G_KLM = gr({xmax:7, ymax:5, pts:PK, pw:280, ph:200, alt:"Repère avec les points K, L et M"});
const G_KLMc = gr({xmax:7, ymax:5, pts:[...PK,...PN], proj:[...PK,...PN].map(p=>[p[1],p[2]]), pw:280, ph:200, alt:"Repère avec les points K, L, M, N et P"});
const TAXI = [1,2,3,4,5,6].map(x=>["",x,3+2*x]);
const G_TAXI = gr({xmax:7, ymax:16, yl:2, pts:TAXI, segs:[[0,3,6.5,16]], title:"Prix d'une course en taxi", xt:"Distance (km)", yt:"Prix (€)", pw:280, ph:256, alt:"Prix d'une course en taxi selon la distance"});
const G_TAXIc = gr({xmax:7, ymax:16, yl:2, pts:TAXI, segs:[[0,3,6.5,16]], proj:[[4,11],[2,7]], title:"Prix d'une course en taxi", xt:"Distance (km)", yt:"Prix (€)", pw:280, ph:256, alt:"Prix du taxi : lectures pour 4 km et pour 7 €"});
const ROB = [[1,3],[2,6],[4,12],[6,18]];
const TROB = TB(["Durée (min)","1","2","4","6"],[["Volume d'eau (L)","3","6","12","18"]]);
const G_ROB = gr({xmax:7, ymax:20, ys:2, xt:"Durée (min)", yt:"Volume d'eau (L)", pw:280, ph:250, alt:"Repère vide : durée en abscisse, volume d'eau en ordonnée"});
const G_ROBc = gr({xmax:7, ymax:20, ys:2, pts:ROB.map(([x,y])=>["",x,y]), segs:[[0,0,6.67,20,1]], proj:[[5,15]], xt:"Durée (min)", yt:"Volume d'eau (L)", pw:280, ph:250, alt:"Les quatre points alignés avec l'origine ; lecture : 15 L en 5 min"});
const G4 = c => `<div class="figs"><figure><figcaption>Graphique 1</figcaption>${gr({xmax:5, ymax:9, pts:[1,2,3,4].map(x=>["",x,x*x/2]), segs:c?[[0,0,4,8,1]]:[], pw:200, ph:180, alt:"Graphique 1"})}</figure><figure><figcaption>Graphique 2</figcaption>${gr({xmax:5, ymax:9, pts:[1,2,3,4].map(x=>["",x,1.5*x]), segs:c?[[0,0,5,7.5,1]]:[], pw:200, ph:180, alt:"Graphique 2"})}</figure></div>`;
const EX1c = `<p>a) On lit d'abord l'abscisse (axe horizontal), puis l'ordonnée (axe vertical) :</p><p>${PK.map(([n,x,y])=>P(n,x,y)).join(" &nbsp; ")}</p>`;
const EX4c = `<p>Une situation est une situation de proportionnalité si et seulement si les points sont <b>alignés avec l'origine</b>.</p>${G4(true)}
  <p>Graphique 1 : <b>non</b>. Les points ne sont pas alignés : la droite qui passe par l'origine et le dernier point ne passe pas par les autres. On le voit aussi avec les quotients : ${Q("0,5",1)} = 0,5 et ${Q(2,2)} = 1 sont différents. <i>(1 point : 0,5 pour la réponse, 0,5 pour la justification)</i></p>
  <p>Graphique 2 : <b>oui</b>. Les points (1 ; 1,5), (2 ; 3), (3 ; 4,5) et (4 ; 6) sont alignés avec l'origine.</p><p class="calc">${Q("1,5",1)} = ${Q(3,2)} = ${Q("4,5",3)} = ${Q(6,4)} = 1,5</p><p>Le coefficient de proportionnalité est 1,5. <i>(1 point : 0,5 pour la réponse, 0,5 pour la justification)</i></p>`;
const COMP = [
  ["REPRÉSENTER","Je lis et je place des points dans un repère ; je représente un tableau de valeurs par des points.","Ex. 1 et 3 (5,5 points)"],
  ["COMMUNIQUER","Je lis des valeurs sur un graphique.","Ex. 2 (2,5 points)"],
  ["RAISONNER","Je reconnais, en justifiant, une situation de proportionnalité sur un graphique.","Ex. 4 (2 points)"]
];
const INFO = "Durée : 25 min · Calculatrice non autorisée · Règle et crayon";
const ROBh = `<p>Un robinet remplit une bassine. Voici le volume d'eau dans la bassine selon la durée.</p>${TROB}${G_ROB}`;
return {
titre:"Évaluation d'entraînement — Chapitre 14", duree:25, info:INFO,
comp:COMP,
exos:[
{t:"Coordonnées de points", p:2.5, h:`${G_KLM}<p>a) Lis les coordonnées des points K, L et M.</p><p>b) Place dans le repère les points N(2 ; 0) et P(4,5 ; 3,5).</p>`,
 c:`${EX1c}<p><i>(1,5 point : 0,5 par point)</i></p><p>b) Pour N : on avance de 2 vers la droite, on ne monte pas (N est sur l'axe des abscisses). Pour P : on avance de 4,5 puis on monte de 3,5. <i>(1 point : 0,5 par point)</i></p>${G_KLMc}`},
{t:"Lire un graphique", p:2.5, h:`<p>Le graphique donne le prix d'une course en taxi selon la distance parcourue.</p>${G_TAXI}
  <p>a) Combien coûte une course de 4 km ?</p><p>b) Quelle distance peut-on parcourir avec 7 € ?</p><p>c) Quel est le prix à payer avant même d'avoir roulé (pour 0 km) ?</p><p>d) Le prix de la course est-il proportionnel à la distance ? Justifie.</p>`,
 c:`${G_TAXIc}<p>a) On part de 4 km sur l'axe horizontal, on monte jusqu'à la droite, puis on lit l'ordonnée : <b>11 €</b>. <i>(0,5 point)</i></p><p>b) On part de 7 € sur l'axe vertical, on va jusqu'à la droite, puis on lit l'abscisse : <b>2 km</b>. <i>(0,5 point)</i></p><p>c) Pour 0 km, la droite passe par 3 : il faut payer <b>3 €</b>. <i>(0,5 point)</i></p><p>d) <b>Non</b> : les points sont alignés, mais la droite <b>ne passe pas par l'origine</b> (pour 0 km, le prix est 3 €, et non 0 €). <i>(1 point : 0,5 pour la réponse, 0,5 pour la justification)</i></p><p>On peut aussi le vérifier avec les quotients : ${Q(5,1)} = 5 et ${Q(7,2)} = 3,5 sont différents.</p>`},
{t:"Du tableau au graphique", p:3, h:`${ROBh}
  <p>1. Place dans le repère les points qui correspondent au tableau.</p><p>2. Ces points sont-ils alignés avec l'origine du repère ? Que peux-tu en conclure ?</p><p>3. Trace la droite qui passe par ces points. Par lecture graphique, au bout de combien de temps la bassine contient-elle 15 L ?</p><p>4. Combien de litres d'eau coulent du robinet en une minute ?</p>`,
 c:`<p>1. Chaque colonne du tableau donne un point : (1 ; 3), (2 ; 6), (4 ; 12) et (6 ; 18). <i>(1 point : 0,25 par point)</i></p>${G_ROBc}
  <p>2. <b>Oui</b> : les quatre points sont alignés avec l'origine. Le volume d'eau est donc <b>proportionnel</b> à la durée. <i>(1 point : 0,5 pour la réponse, 0,5 pour la conclusion)</i></p><p>3. On trace la droite qui passe par les points. On part de 15 L sur l'axe vertical, on va jusqu'à la droite, puis on lit l'abscisse : <b>5 min</b>. <i>(0,5 point)</i></p><p>4. C'est l'ordonnée du point d'abscisse 1 : <b>3 L</b> par minute (le coefficient de proportionnalité). <i>(0,5 point)</i></p>`},
{t:"Reconnaître la proportionnalité", p:2, h:`<p>Chaque graphique représente une grandeur qui dépend d'une autre.</p>${G4(false)}<p>Pour chaque graphique, dis s'il représente une situation de proportionnalité. Justifie.</p>`,
 c:EX4c}
],
bep:{
titre:"Évaluation d'entraînement — Chapitre 14 · version aménagée", duree:25, info:"Version aménagée · "+INFO,
note:"Même durée, avec environ une question sur cinq en moins (les questions restantes sont renumérotées). Toujours sur 10 : les points sont répartis sur les questions gardées. Les justifications restent demandées.",
comp:COMP,
exos:[
{t:"Coordonnées de points", p:2.5, h:`${G_KLM}<p>a) Lis les coordonnées des points K, L et M.</p><p>b) Place dans le repère les points N(2 ; 0) et P(4,5 ; 3,5).</p>`,
 c:`${EX1c}<p><i>(1,5 point : 0,5 par point)</i></p><p>b) Pour N : on avance de 2 vers la droite, on ne monte pas (N est sur l'axe des abscisses). Pour P : on avance de 4,5 puis on monte de 3,5. <i>(1 point : 0,5 par point)</i></p>${G_KLMc}`},
{t:"Lire un graphique", p:2.5, h:`<p>Le graphique donne le prix d'une course en taxi selon la distance parcourue.</p>${G_TAXI}
  <p>a) Combien coûte une course de 4 km ?</p><p>b) Quelle distance peut-on parcourir avec 7 € ?</p><p>c) Le prix de la course est-il proportionnel à la distance ? Justifie.</p>`,
 c:`${G_TAXIc}<p>a) On part de 4 km sur l'axe horizontal, on monte jusqu'à la droite, puis on lit l'ordonnée : <b>11 €</b>. <i>(0,5 point)</i></p><p>b) On part de 7 € sur l'axe vertical, on va jusqu'à la droite, puis on lit l'abscisse : <b>2 km</b>. <i>(1 point)</i></p><p>c) <b>Non</b> : les points sont alignés, mais la droite <b>ne passe pas par l'origine</b> (pour 0 km, le prix est 3 €, et non 0 €). <i>(1 point : 0,5 pour la réponse, 0,5 pour la justification)</i></p><p>On peut aussi le vérifier avec les quotients : ${Q(5,1)} = 5 et ${Q(7,2)} = 3,5 sont différents.</p>`},
{t:"Du tableau au graphique", p:3, h:`${ROBh}
  <p>1. Place dans le repère les points qui correspondent au tableau.</p><p>2. Ces points sont-ils alignés avec l'origine du repère ? Que peux-tu en conclure ?</p><p>3. Trace la droite qui passe par ces points. Par lecture graphique, au bout de combien de temps la bassine contient-elle 15 L ?</p>`,
 c:`<p>1. Chaque colonne du tableau donne un point : (1 ; 3), (2 ; 6), (4 ; 12) et (6 ; 18). <i>(1 point : 0,25 par point)</i></p>${G_ROBc}
  <p>2. <b>Oui</b> : les quatre points sont alignés avec l'origine. Le volume d'eau est donc <b>proportionnel</b> à la durée. <i>(1 point : 0,5 pour la réponse, 0,5 pour la conclusion)</i></p><p>3. On trace la droite qui passe par les points. On part de 15 L sur l'axe vertical, on va jusqu'à la droite, puis on lit l'abscisse : <b>5 min</b>. <i>(1 point)</i></p>`},
{t:"Reconnaître la proportionnalité", p:2, h:`<p>Chaque graphique représente une grandeur qui dépend d'une autre.</p>${G4(false)}<p>Pour chaque graphique, dis s'il représente une situation de proportionnalité. Justifie.</p>`,
 c:EX4c}
]}
};
})()
};
})();
