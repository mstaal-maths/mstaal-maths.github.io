/* 6e — Chapitre 22 : Échelles (cours et fiche d'exercices de M. Staal)
   Plan (exercice 6) et carte (exercice 8) mesurés sur sa fiche imprimée sans réduction. */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const co = (p,alt,w) => img("c622co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("c622ex/"+p+".png", alt, w);
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const F = (a,b) => `{${a}/${b}}`;
const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g," ");
const D = (n,k=0) => { const s=String(Math.abs(n)).padStart(k+1,"0"); const a=s.slice(0,s.length-k); let b=k?s.slice(-k):""; b=b.replace(/0+$/,""); return (n<0?"−":"")+sp(+a)+(b?","+b:""); };

/* polygones sur quadrillage (coordonnées en carreaux) */
function quad(polys, o={}){ const n=o.n||16, m=o.m||9, c=o.c||18, pad=4, W=n*c+2*pad, H=m*c+2*pad;
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:100%" role="img" aria-label="${o.alt||"Figures sur quadrillage"}">`;
  for(let i=0;i<=n;i++) s+=`<line x1="${pad+i*c}" y1="${pad}" x2="${pad+i*c}" y2="${pad+m*c}" style="stroke:#d6d6d6"/>`;
  for(let j=0;j<=m;j++) s+=`<line x1="${pad}" y1="${pad+j*c}" x2="${pad+n*c}" y2="${pad+j*c}" style="stroke:#d6d6d6"/>`;
  polys.forEach(([pts,col,fill])=>{ s+=`<polygon points="${pts.map(([x,y])=>`${pad+x*c},${pad+y*c}`).join(" ")}" style="fill:${fill||"none"};stroke:${col};stroke-width:2.5;stroke-linejoin:round"/>`; });
  return s+"</svg>"; }
window.FIG22 = {quad, D};

/* ---------- schémas ---------- */
const S_AGR = sch("Agrandir, réduire", co("agr","Le triangle ABC agrandi 1,5 fois",400)+`<p class="schN">On <b>multiplie</b> toutes les longueurs par le même nombre. Les angles ne changent pas.</p>`);
const S_ECH = sch("L'échelle", `<p class="calc">Échelle ${F(1,100)} : 1 cm sur le plan → 100 cm = 1 m en réalité</p><p class="schN">longueur réelle = longueur sur le plan × 100 ; longueur sur le plan = longueur réelle ÷ 100. Mêmes unités !</p>`);

CH["6e-22"] = {
intro:"Agrandir ou réduire une figure en multipliant ses longueurs par un même nombre, et utiliser l'échelle d'un plan ou d'une carte.",
savoir:[
  "reconnaître un agrandissement ou une réduction d'une figure ;",
  "agrandir ou réduire une figure en multipliant toutes ses longueurs par un même nombre ;",
  "utiliser l'échelle d'un plan ou d'une carte pour calculer une longueur réelle ou une longueur sur le plan."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Agrandir ou réduire une figure", h:`
  <div class="retenir" data-l="Définition"><p>Agrandir ou réduire une figure, c'est la reproduire en <b>multipliant toutes ses longueurs par un même nombre</b>. Si ce nombre est plus grand que 1, c'est un <b>agrandissement</b> ; s'il est plus petit que 1, c'est une <b>réduction</b>.</p></div>
  <div class="retenir" data-l="Propriété"><p>Dans un agrandissement ou une réduction, la forme de la figure est conservée : les angles gardent la même mesure, les droites perpendiculaires restent perpendiculaires et les droites parallèles restent parallèles.</p></div>
  <p><b>Exemple :</b> on agrandit le triangle ABC 1,5 fois : chaque longueur est multipliée par 1,5.</p>
  ${co("agr","Le triangle ABC (4 cm, 3 cm, 5 cm) et le triangle A'B'C' agrandi 1,5 fois (6 cm, 4,5 cm, 7,5 cm)",480)}
  <p><b>Astuce :</b> multiplier par 1,5, c'est ajouter la moitié, car 1,5 = 1 + ${F(1,2)} :</p><div class="calcs"><div><p class="calc">A'B' = 4 × 1,5<br>A'B' = 4 + 2<br>A'B' = 6</p></div><div><p class="calc">B'C' = 3 × 1,5<br>B'C' = 3 + 1,5<br>B'C' = 4,5</p></div><div><p class="calc">A'C' = 5 × 1,5<br>A'C' = 5 + 2,5<br>A'C' = 7,5</p></div></div>
  <p class="attention"><b>ATTENTION :</b> ajouter le même nombre à toutes les longueurs ne donne pas un agrandissement : la figure est déformée.</p>
  <h4>Sur un quadrillage</h4>
  <p>On compte les carreaux de chaque segment et on multiplie ce nombre par le même nombre.</p>
  ${co("quad","Une figure en L et son agrandissement × 2 sur quadrillage",470)}`},
{k:"II", t:"L'échelle d'un plan ou d'une carte", h:`
  <div class="retenir" data-l="Définition"><p>Sur un plan ou une carte, les longueurs sont proportionnelles aux longueurs réelles. L'<b>échelle</b> indique par combien il faut multiplier une longueur du plan pour obtenir la longueur réelle (dans la même unité).</p></div>
  <p><b>Exemple :</b> sur un plan à l'échelle ${F(1,100)} (on lit « 1 sur 100 »), 1 cm sur le plan représente 100 cm, c'est-à-dire 1 m, en réalité.</p>
  <div class="retenir" data-l="Méthode"><ol><li>longueur réelle = longueur sur le plan × 100 (pour une échelle ${F(1,100)}) ;</li><li>longueur sur le plan = longueur réelle ÷ 100 ;</li><li>on fait attention à exprimer les longueurs dans la même unité, puis on convertit à la fin.</li></ol></div>
  <p><b>Exemple :</b> sur une carte à l'échelle ${F(1,"100 000")}, deux villages sont à 3 cm l'un de l'autre. La distance réelle d :</p><p class="calc">d = 3 × 100 000<br>d = 300 000 cm<br>d = 3 km</p>
  <div class="scroll"><table class="std"><tbody><tr><th>Longueur sur la carte (cm)</th><td>1</td><td>3</td><td>5,5</td></tr><tr><th>Longueur réelle (cm)</th><td>100 000</td><td>300 000</td><td>550 000</td></tr></tbody></table></div>
  <h4>L'échelle graphique</h4>
  <p>Certaines cartes indiquent l'échelle par un segment gradué : il suffit de reporter les distances avec la règle ou le compas.</p>
  ${co("echg","Échelle graphique : 0, 1 km, 2 km, 3 km",300)}
  <p>Ici, 2 cm sur la carte représentent 1 km en réalité.</p>
  <p><b>Remarque :</b> une échelle peut aussi agrandir : sur un dessin d'insecte « agrandi 5 fois », les longueurs du dessin sont 5 fois plus grandes que les longueurs réelles.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Agrandir ou réduire une figure", e:[
  {n:"Activité 1", t:"Le puzzle", w:"En classe", h:`<div class="cpt"><div><p>Ce puzzle carré est formé de 5 pièces. On veut l'agrandir pour que le côté qui mesure 4 cm mesure 6 cm.</p><p>1) Par groupes, chaque élève agrandit une pièce, puis le groupe reconstitue le grand puzzle.</p><p>2) Les pièces s'assemblent-elles bien ? Si ce n'est pas le cas, cherchez l'erreur.</p><p>3) Quelle est la bonne méthode pour calculer les nouvelles longueurs ? Que devient le côté de 2 cm ? Celui de 3 cm ?</p></div>${ex("act1","Le puzzle carré de 6 cm de côté formé de 5 pièces",230)}</div>`,
   c:`<p>2) Souvent, les pièces ne s'assemblent pas : un élève a <b>ajouté 2 cm</b> à toutes les longueurs (4 + 2 = 6), ce qui déforme les pièces.</p><p>3) 4 cm devient 6 cm : on <b>multiplie par 1,5</b> (6 ÷ 4 = 1,5). Le côté de 2 cm devient 2 × 1,5 = <b>3 cm</b> ; celui de 3 cm devient 3 × 1,5 = <b>4,5 cm</b>. Le grand puzzle a un côté de 6 × 1,5 = 9 cm.</p>`},
  {n:"Exercice 1", t:"Agrandissement ou pas ?", w:"Sur ta feuille", h:`<p>Parmi les figures ① à ④, lesquelles sont des agrandissements du modèle ? Explique.</p>${ex("e1","Un modèle en L et quatre figures numérotées sur quadrillage",490)}`,
   c:`<p>Le modèle mesure 3 carreaux de large et 2 de haut (avec une marche d'1 carreau).</p><p><b>① est un agrandissement</b> : toutes les longueurs sont multipliées par 2 (6 sur 4, avec une marche de 2).</p><p>② n'en est pas un : la hauteur est multipliée par 2 (de 2 à 4 carreaux), mais la largeur passe de 3 à 5 carreaux (et non 6) : la forme a changé. ③ non plus : la largeur est multipliée par 3 mais la hauteur seulement par 1,5. <b>④ est aussi un agrandissement</b> : toutes les longueurs sont multipliées par 1,5 (4,5 sur 3, avec une marche de 1,5).</p>`},
  {n:"Exercice 2", t:"Reproduire sur quadrillage", w:"Sur ton cahier", h:`<p>Sur ton cahier à carreaux, reproduis le bateau en multipliant toutes ses longueurs par 2, puis la maison en divisant toutes ses longueurs par 2.</p>${ex("e2","Un bateau et une maison sur quadrillage",490)}`,
   c:`<div class="figs">${quad([[[[2,12],[14,12],[12,14],[4,14]],"#1e5aa8","rgba(30,90,168,.15)"],[[[8,4],[12,11],[8,12]],"#c00000","rgba(208,52,44,.18)"]],{n:16,m:15,c:15,alt:"Le bateau agrandi 2 fois"})}${quad([[[[1,2],[3,1],[5,2],[5,4],[1,4]],"#e07a00","rgba(224,122,0,.18)"],[[[2,3],[3,3],[3,4],[2,4]],"#e07a00","#fff"],[[[3.5,2.5],[4.5,2.5],[4.5,3],[3.5,3]],"#e07a00","#fff"]],{n:7,m:5,c:24,alt:"La maison réduite de moitié"})}</div><p>Bateau : la coque passe de 6 à 12 carreaux en haut et de 4 à 8 en bas ; la hauteur de la voile de 4 à 8 carreaux. Maison : 8 × 4 carreaux devient 4 × 2, la porte 2 × 2 devient 1 × 1, la fenêtre 2 × 1 devient 1 × ½.</p>`},
  {n:"Exercice 3", t:"Compléter le tableau", w:"Sur ta feuille", h:`<p>Un triangle a des côtés de 4 cm, 6 cm et 8 cm. Complète le tableau.</p><div class="scroll"><table class="std"><thead><tr><th></th><th>Côté 1</th><th>Côté 2</th><th>Côté 3</th><th>Périmètre</th></tr></thead><tbody><tr><th>Triangle de départ</th><td>4 cm</td><td>6 cm</td><td>8 cm</td><td></td></tr><tr><th>Agrandi × 1,5</th><td></td><td></td><td></td><td></td></tr><tr><th>Réduit (÷ 2)</th><td></td><td></td><td></td><td></td></tr></tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th></th><th>Côté 1</th><th>Côté 2</th><th>Côté 3</th><th>Périmètre</th></tr></thead><tbody><tr><th>Triangle de départ</th><td>4 cm</td><td>6 cm</td><td>8 cm</td><td><b>18 cm</b></td></tr><tr><th>Agrandi × 1,5</th><td><b>6 cm</b></td><td><b>9 cm</b></td><td><b>12 cm</b></td><td><b>27 cm</b></td></tr><tr><th>Réduit (÷ 2)</th><td><b>2 cm</b></td><td><b>3 cm</b></td><td><b>4 cm</b></td><td><b>9 cm</b></td></tr></tbody></table></div><p>Périmètre de départ : 4 + 6 + 8 = 18 cm.</p><p>Agrandi : 4 × 1,5 = 6 ; 6 × 1,5 = 9 ; 8 × 1,5 = 12 ; périmètre 6 + 9 + 12 = 27 cm.</p><p>Réduit : 4 ÷ 2 = 2 ; 6 ÷ 2 = 3 ; 8 ÷ 2 = 4 ; périmètre 2 + 3 + 4 = 9 cm.</p><p>Le périmètre est lui aussi multiplié par 1,5 (18 × 1,5 = 27) ou divisé par 2 (18 ÷ 2 = 9).</p>`},
  {n:"Exercice 4", t:"Agrandir 1,5 fois", w:"Sur ton cahier", h:`<p>Les longueurs sont données en cm (figures pas en vraie grandeur). Construis sur ton cahier chaque figure agrandie 1,5 fois.</p>${ex("e4","a) triangle rectangle 4, 3, 5 ; b) cercle de rayon 2 ; c) quadrilatère OPEL",490)}<p>Aide pour la figure c : l'angle ${`<span class="ang">OPE</span>`} mesure 68°. Que devient sa mesure dans la figure agrandie ?</p>`,
   c:`<p>a) Triangle rectangle en B : AB = 4 × 1,5 = <b>6 cm</b>, BC = 3 × 1,5 = <b>4,5 cm</b>, AC = 5 × 1,5 = <b>7,5 cm</b> (on vérifie à la fin).</p><p>b) Cercle de centre D et de rayon 2 × 1,5 = <b>3 cm</b>.</p><p>c) PE = 8 × 1,5 = <b>12 cm</b>, EL = 7 × 1,5 = <b>10,5 cm</b> (angle droit en E), PO = 7 × 1,5 = <b>10,5 cm</b> ; l'angle ${`<span class="ang">OPE</span>`} mesure toujours <b>68°</b> : un agrandissement ne change pas les angles. On trace [PE], l'angle droit en E avec L, l'angle de 68° en P avec O, puis on relie O et L.</p><p><i>Les figures agrandies (dessins réduits ; sur ton cahier, trace-les en vraie grandeur) :</i></p><div class="figs"><figure><figcaption>a) agrandie 1,5 fois</figcaption><svg class="fig" viewBox="0 0 110 100" width="110" role="img" aria-label="Triangle ABC rectangle en B : AB = 6 cm, BC = 4,5 cm, AC = 7,5 cm"><polygon points="12,78 84,78 84,24" style="fill:#dbe9f7;stroke:var(--ink);stroke-width:2"/><path d="M76 78 V70 H84" style="fill:none;stroke:var(--ink);stroke-width:1.3"/><text x="4" y="84" style="font-size:12px;font-weight:700;fill:var(--ink)">A</text><text x="88" y="86" style="font-size:12px;font-weight:700;fill:var(--ink)">B</text><text x="88" y="22" style="font-size:12px;font-weight:700;fill:var(--ink)">C</text><text x="48" y="94" text-anchor="middle" style="font-size:11px;fill:var(--ink)">6 cm</text><text x="88" y="54" style="font-size:11px;fill:var(--ink)">4,5</text><text x="38" y="44" text-anchor="middle" style="font-size:11px;fill:var(--ink)">7,5 cm</text></svg></figure><figure><figcaption>b) agrandie 1,5 fois</figcaption><svg class="fig" viewBox="0 0 110 100" width="110" role="img" aria-label="Cercle de centre D et de rayon 3 cm"><circle cx="52" cy="52" r="36" style="fill:#dff1dc;stroke:var(--ink);stroke-width:2"/><line x1="52" y1="52" x2="77.5" y2="26.5" style="stroke:var(--ink);stroke-width:1.6"/><circle cx="52" cy="52" r="2.5" style="fill:var(--ink)"/><text x="40" y="64" style="font-size:12px;font-weight:700;fill:var(--ink)">D</text><text x="80" y="24" style="font-size:12px;font-weight:700;fill:var(--ink)">E</text><text x="62" y="34" text-anchor="end" style="font-size:11px;fill:var(--ink)">3 cm</text></svg></figure><figure><figcaption>c) agrandie 1,5 fois</figcaption><svg class="fig" viewBox="-30 0 230 165" width="230" role="img" aria-label="Quadrilatère OPEL agrandi : PE = 12 cm, EL = 10,5 cm, PO = 10,5 cm, angle OPE = 68°"><polygon points="61.2,23.2 14,140 158,140 158,14" style="fill:#fde3c8;stroke:var(--ink);stroke-width:2"/><path d="M32 140 A18 18 0 0 0 20.7 123.3 L14 140 Z" style="fill:#f0a040;fill-opacity:.5;stroke:none"/><path d="M150 140 V132 H158" style="fill:none;stroke:var(--ink);stroke-width:1.3"/><text x="2" y="150" style="font-size:12px;font-weight:700;fill:var(--ink)">P</text><text x="162" y="150" style="font-size:12px;font-weight:700;fill:var(--ink)">E</text><text x="162" y="14" style="font-size:12px;font-weight:700;fill:var(--ink)">L</text><text x="55.2" y="18.2" style="font-size:12px;font-weight:700;fill:var(--ink)">O</text><text x="86" y="156" text-anchor="middle" style="font-size:11px;fill:var(--ink)">12 cm</text><text x="164" y="80" style="font-size:11px;fill:var(--ink)">10,5</text><text x="33.6" y="81.6" text-anchor="end" style="font-size:11px;fill:var(--ink)">10,5 cm</text><text x="36" y="132" style="font-size:11px;fill:var(--ink)">68°</text></svg></figure></div>`},
  {n:"Exercice 5", t:"Vrai ou faux ?", w:"Sur ta feuille", h:`<p>On agrandit une figure en multipliant toutes ses longueurs par 2.</p><p>a) Les angles sont aussi multipliés par 2. · b) Le périmètre est multiplié par 2. · c) Deux côtés parallèles dans la figure de départ restent parallèles. · d) Un carré reste un carré.</p>`,
   c:`<p>a) <b>Faux</b> : les angles gardent la même mesure. · b) <b>Vrai</b> : chaque côté est multiplié par 2, donc leur somme aussi. · c) <b>Vrai</b> : les droites parallèles restent parallèles. · d) <b>Vrai</b> (la forme est conservée).</p>`}
 ]},
{t:"Plans et cartes", e:[
  {n:"Exercice 6", t:"Le plan de l'appartement", w:"Sur ta feuille", h:`<p>Ce plan est dessiné à l'échelle ${F(1,100)} (si ta feuille est imprimée sans réduction).</p>${ex("e6","Plan d'un appartement : entrée, cuisine, salle de bain, séjour, chambre, bureau",400)}<p>a) Que représente 1 cm sur le plan ? b) Mesure le séjour sur le plan, puis calcule ses dimensions réelles. c) Fais de même pour la chambre et la cuisine. d) Quelles sont les dimensions réelles de l'appartement entier ?</p>`,
   c:`<p>a) 1 cm sur le plan représente 100 cm, soit <b>1 m</b>.</p><p>b) Séjour : 5 cm sur 4 cm sur le plan, soit <b>5 m sur 4 m</b>.</p><p>c) Chambre : 4 cm sur 3,5 cm, soit <b>4 m sur 3,5 m</b>. Cuisine : 3 cm sur 2,5 cm, soit <b>3 m sur 2,5 m</b>.</p><p>d) 11,5 cm sur 6 cm sur le plan : <b>11,5 m sur 6 m</b>.</p><p><i>Mesures faites sur la fiche imprimée ; sur écran, les longueurs ne sont pas en vraie grandeur.</i></p>`},
  {n:"Exercice 7", t:"La carte au {1/100 000}", w:"Sur ta feuille", h:`<p>Sur une carte à l'échelle ${F(1,"100 000")} :</p><p>a) que représente 1 cm sur la carte, en cm ? en m ? en km ? b) Deux villes sont à 4 cm l'une de l'autre. Quelle est la distance réelle ? c) Un lac mesure 7,5 cm de long sur la carte. Quelle est sa longueur réelle ? d) Deux villages sont distants de 12 km. Quelle est la distance sur la carte ?</p>`,
   c:`<p>a) 1 cm représente <b>100 000 cm = 1 000 m = 1 km</b>.</p><p>b) 4 × 1 km = <b>4 km</b>. c) 7,5 × 1 km = <b>7,5 km</b>. d) 1 cm sur la carte représente 1 km, donc 12 km sont représentés par <b>12 cm</b> sur la carte.</p>`},
  {n:"Exercice 8", t:"L'échelle graphique", w:"Sur ta feuille", h:`<p>Sur cette carte (imprimée sans réduction), utilise l'échelle graphique pour trouver les distances réelles « à vol d'oiseau ».</p>${ex("e8","Carte : Arbois, Brévans, Cernay, Dampierre, et une échelle graphique de 0 à 2 km",420)}<p>a) Arbois – Brévans · b) Brévans – Cernay · c) Brévans – Dampierre</p>`,
   c:`<p>Sur l'échelle, 1 km correspond à 2 cm.</p><p>a) Arbois – Brévans : 6 cm sur la carte, soit <b>3 km</b>.</p><p>b) Brévans – Cernay : 4 cm, soit <b>2 km</b>.</p><p>c) Brévans – Dampierre : 5 cm, soit <b>2,5 km</b>.</p><p><i>On peut aussi reporter l'échelle au compas : Arbois – Brévans fait 3 fois le segment « 1 km ».</i></p>`},
  {n:"Exercice 9", t:"Maquettes et dessins", w:"Sur ton cahier", h:`<p>a) Une maquette de voiture est à l'échelle ${F(1,43)}. Elle mesure 10 cm de long. Quelle est la longueur réelle de la voiture, en m ?</p><p>b) La tour Eiffel mesure environ 330 m. Quelle serait sa hauteur sur une maquette à l'échelle ${F(1,"1 000")} ?</p><p>c) Sur un dessin agrandi 5 fois, une fourmi mesure 4 cm. Quelle est sa longueur réelle ?</p>`,
   c:`<p>a) La longueur réelle L :</p><p class="calc">L = 10 × 43<br>L = 430 cm<br>L = <b>4,3 m</b></p><p>b) 330 m = 33 000 cm ; 33 000 ÷ 1 000 = <b>33 cm</b>.</p><p>c) 4 ÷ 5 = <b>0,8 cm</b>, soit 8 mm.</p>`},
  {n:"Exercice 10", t:"Le plan de la classe", w:"Sur ton cahier", h:`<p>Une salle de classe rectangulaire mesure 8 m sur 6 m. Le bureau du professeur mesure 1,6 m sur 0,8 m. Dessine le plan de la classe à l'échelle ${F(1,100)}, avec le bureau.</p>`,
   c:`<p>À l'échelle ${F(1,100)}, 1 m devient 1 cm : la classe est un rectangle de <b>8 cm sur 6 cm</b> et le bureau un rectangle de <b>1,6 cm sur 0,8 cm</b>.</p><svg class="fig" viewBox="0 0 260 200" width="260" role="img" aria-label="Plan de la classe : 8 cm sur 6 cm, avec le bureau"><rect x="10" y="10" width="240" height="180" style="fill:#f3f7fc;stroke:#222;stroke-width:2.5"/><rect x="106" y="22" width="48" height="24" style="fill:#fbe3c6;stroke:#222;stroke-width:1.5"/><text x="130" y="38" text-anchor="middle" style="font-size:10px">bureau</text><text x="130" y="186" text-anchor="middle" style="font-size:12px">8 cm</text><text x="244" y="104" text-anchor="end" style="font-size:12px">6 cm</text></svg><p><i>Figure réduite ; sur ton cahier, trace-la en vraie grandeur. Le bureau peut être placé où tu veux.</i></p>`},
  {n:"En ++", t:"Et l'aire ?", w:"Sur ton cahier", h:`<p>Un carré de 3 cm de côté est agrandi 2 fois.</p><p>a) Quelle est la longueur du côté du nouveau carré ? Calcule l'aire des deux carrés.</p><p>b) L'aire a-t-elle été multipliée par 2 ? Par combien ? Fais un dessin pour expliquer.</p>`,
   c:`<p>a) Côté : 3 × 2 = <b>6 cm</b>. Aires : 3 × 3 = <b>9 cm²</b> et 6 × 6 = <b>36 cm²</b>.</p><p>b) <b>Non</b> : 36 ÷ 9 = 4, l'aire est multipliée par <b>4</b>. Le grand carré contient 4 petits carrés (2 dans la longueur et 2 dans la largeur).</p>${quad([[[[0,0],[6,0],[6,6],[0,6]],"#1e5aa8","rgba(30,90,168,.12)"],[[[0,0],[3,0],[3,3],[0,3]],"#e07a00","rgba(224,122,0,.25)"],[[[3,0],[6,0],[6,3],[3,3]],"#1e5aa8","none"],[[[0,3],[3,3],[3,6],[0,6]],"#1e5aa8","none"]],{n:6,m:6,c:20,alt:"Le grand carré contient 4 petits carrés"})}`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Agrandir, réduire", schema:S_AGR, q:{
 1:[ {g:()=>{ const k=pick([2,3]), l=ri(2,9); return {q:`On agrandit une figure ${k} fois. Un côté de ${l} cm devient…`, c:shuf(uniq(`${k*l} cm`,[`${l+k} cm`,`${l} cm`])), rep:`${k*l} cm`, sx:S_AGR}; }} ],
 2:[ {g:()=>{ const l=2*ri(1,9); return {q:`On agrandit une figure 1,5 fois. Un côté de ${l} cm devient (en cm)…`, rep:D(l*15,1), ex:`${l} + ${l/2} = ${D(l*15,1)}.`, sx:S_AGR}; }},
     {g:()=>{ const a=ri(20,150); return {q:`On agrandit une figure 3 fois. Un angle de ${a}° devient (en °)…`, rep:String(a), ex:"Les angles ne changent pas.", sx:S_AGR}; }} ],
 3:[ {q:"Ajouter 2 cm à toutes les longueurs d'une figure donne-t-il un agrandissement ?", c:["Non","Oui"], rep:"Non", ex:"La figure est déformée : il faut multiplier.", sx:S_AGR},
     {g:()=>{ const l=ri(2,8)*2; return {q:`Une figure est réduite de moitié. Un côté de ${l} cm devient (en cm)…`, rep:String(l/2), ex:`${l} ÷ 2 = ${l/2}.`, sx:S_AGR}; }} ]
}},
{nom:"Échelles", schema:S_ECH, q:{
 1:[ {g:()=>{ const l=ri(2,15); return {q:`Plan à l'échelle ${F(1,100)} : ${l} cm sur le plan représentent… (en m)`, rep:String(l), ex:`La longueur réelle L :<br>L = ${l} × 100<br>L = ${sp(l*100)} cm<br>L = ${l} m`, sx:S_ECH}; }} ],
 2:[ {g:()=>{ const l=ri(11,99); return {q:`Carte au ${F(1,"100 000")} : ${D(l,1)} cm sur la carte représentent… (en km)`, rep:D(l,1), ex:"1 cm représente 1 km.", sx:S_ECH}; }},
     {g:()=>{ const r=ri(2,12)*50; return {q:`Plan au ${F(1,100)} : une longueur réelle de ${D(r,2)} m mesure… sur le plan (en cm)`, rep:D(r,2), ex:`${D(r,2)} m = ${r} cm ; ${r} ÷ 100 = ${D(r,2)} cm.`, sx:S_ECH}; }} ],
 3:[ {g:()=>{ const e=pick([10,20,50]), l=ri(2,9); return {q:`Maquette au ${F(1,e)} : un objet mesure ${l} cm sur la maquette. Sa longueur réelle (en cm) ?`, rep:String(l*e), ex:`${l} × ${e} = ${l*e} cm.`, sx:S_ECH}; }},
     {g:()=>{ const k=pick([2,4,5,10]), r=ri(2,9); return {q:`Sur un dessin agrandi ${k} fois, un insecte mesure ${r*k} mm. Sa longueur réelle (en mm) ?`, rep:String(r), ex:`${r*k} ÷ ${k} = ${r} mm.`, sx:S_ECH}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
const souv = t => `<div class="retenir" data-l="Je me souviens"><p>${t}</p></div>`;
/* un triangle rectangle modèle (2 carreaux sur 3) et quatre triangles rectangles sur quadrillage */
const c = 18, X = x => 4 + x*c;
const TRI = [["Modèle",1,2,3,"#555","rgba(85,85,85,.12)"],["①",5,4,6,"#1e5aa8","rgba(30,90,168,.15)"],["②",11,4,5,"#2e7d32","rgba(46,125,50,.15)"],["③",17,6,9,"#7b3fa0","rgba(123,63,160,.15)"],["④",25,3,6,"#e07a00","rgba(224,122,0,.18)"]];
const GRILLE = quad(TRI.map(([,x,l,h,col,f])=>[[[x,10],[x+l,10],[x,10-h]],col,f]), {n:29, m:12, c, alt:"Un triangle rectangle modèle et quatre triangles rectangles numérotés sur quadrillage"})
  .replace("</svg>", TRI.map(([t,x,l])=>`<text x="${X(x+l/2)}" y="${X(11.45)}" text-anchor="middle" style="font-size:14px;font-weight:700;fill:var(--ink)">${t}</text>`).join("")+"</svg>");
return {
titre:"Évaluation d'entraînement — Chapitre 22", duree:25, info:"Durée : 25 min · Calculatrice autorisée",
comp:[
  ["CALCULER","J'agrandis ou je réduis des longueurs.","Ex. 1 (3 points)"],
  ["RAISONNER","Je reconnais un agrandissement.","Ex. 2 (2 points)"],
  ["MODÉLISER","J'utilise l'échelle d'un plan, d'une carte ou d'une maquette.","Ex. 3 (5 points)"]
],
exos:[
{t:"Le quadrilatère de Léo", p:3, h:`<p>Un quadrilatère ABCD a pour côtés : AB = 6 cm ; BC = 4 cm ; CD = 7 cm ; DA = 3 cm.</p>
  <p>Léo agrandit ce quadrilatère. Sur sa figure, le côté qui correspond à [AB] mesure 15 cm.</p>
  <p>a) Par quel nombre Léo a-t-il multiplié les longueurs ?</p><p>b) Calcule les longueurs des trois autres côtés de la figure de Léo.</p>
  <p>c) Zoé, elle, réduit ABCD en divisant toutes ses longueurs par 2. Combien mesure le côté qui correspond à [CD] sur sa figure ? Quel est le périmètre de sa figure ?</p>`,
 c:`<p>a) 15 ÷ 6 = 2,5 : Léo a multiplié toutes les longueurs par <b>2,5</b>. <i>(0,5 point)</i></p>
  <p>b) BC : 4 × 2,5 = <b>10 cm</b> · CD : 7 × 2,5 = <b>17,5 cm</b> · DA : 3 × 2,5 = <b>7,5 cm</b> <i>(0,5 point par longueur)</i></p>
  <p>c) Côté qui correspond à [CD] : 7 ÷ 2 = <b>3,5 cm</b>. <i>(0,5 point)</i></p>
  <p>Périmètre de ABCD : 6 + 4 + 7 + 3 = 20 cm. Toutes les longueurs sont divisées par 2, donc le périmètre aussi : 20 ÷ 2 = <b>10 cm</b>. (On peut aussi calculer 3 + 2 + 3,5 + 1,5 = 10 cm.) <i>(0,5 point)</i></p>`},
{t:"Agrandissement ou pas ?", p:2, h:`<p>Parmi les triangles ①, ②, ③ et ④, lesquels sont des agrandissements du modèle ? Explique pour chaque triangle.</p>${GRILLE}`,
 c:`<p>Le modèle mesure 2 carreaux sur 3 carreaux (les deux côtés de l'angle droit).</p>
  <p>① : 4 carreaux sur 6 carreaux. 2 × 2 = 4 et 3 × 2 = 6 : c'est un <b>agrandissement</b> (× 2). <i>(0,5 point)</i></p>
  <p>② : 4 carreaux sur 5 carreaux. 2 × 2 = 4, mais 3 × 2 = 6 et pas 5 (on a ajouté 2 carreaux à chaque côté) : <b>ce n'est pas un agrandissement</b>. <i>(0,5 point)</i></p>
  <p>③ : 6 carreaux sur 9 carreaux. 2 × 3 = 6 et 3 × 3 = 9 : c'est un <b>agrandissement</b> (× 3). <i>(0,5 point)</i></p>
  <p>④ : 3 carreaux sur 6 carreaux. 2 × 1,5 = 3, mais 3 × 2 = 6 : les deux côtés ne sont pas multipliés par le même nombre, <b>ce n'est pas un agrandissement</b>. <i>(0,5 point)</i></p>`},
{t:"Plan, carte et maquette", p:5, h:`<p>a) Une terrasse rectangulaire mesure 5 m sur 2,5 m. Quelles sont ses dimensions sur un plan à l'échelle ${F(1,100)} ?</p>
  <p>b) Sur une carte de randonnée à l'échelle ${F(1,"25 000")}, un sentier mesure 8 cm. Quelle est sa longueur réelle, en km ?</p>
  <p>c) Une maquette de bateau est à l'échelle ${F(1,50)}. Elle mesure 36 cm de long. Quelle est la longueur réelle du bateau, en m ?</p>`,
 c:`<p>a) À l'échelle ${F(1,100)}, 1 cm sur le plan représente 100 cm = 1 m en réalité. <i>(0,5 point)</i></p>
  <p>5 m = 500 cm et 500 ÷ 100 = 5 cm ; 2,5 m = 250 cm et 250 ÷ 100 = 2,5 cm. Sur le plan, la terrasse mesure <b>5 cm sur 2,5 cm</b>. <i>(1,5 point)</i></p>
  <p>b)</p><p class="calc">L = 8 × 25 000<br>L = 200 000 cm</p><p>200 000 cm = 2 000 m = <b>2 km</b>. <i>(1,5 point)</i></p>
  <p>c)</p><p class="calc">L = 36 × 50<br>L = 1 800 cm</p><p>1 800 cm = <b>18 m</b>. Le bateau mesure 18 m de long. <i>(1,5 point)</i></p>`}
],
bep:{
titre:"Évaluation d'entraînement — Chapitre 22 · version aménagée", duree:25, info:"Version aménagée (tiers-temps) · Durée : 25 min · Calculatrice autorisée",
note:"Le même sujet avec 2 questions en moins, à faire dans le même temps. Le total reste sur 10 points.",
comp:[
  ["CALCULER","J'agrandis ou je réduis des longueurs.","Ex. 1 (3 points)"],
  ["RAISONNER","Je reconnais un agrandissement.","Ex. 2 (2 points)"],
  ["MODÉLISER","J'utilise l'échelle d'un plan, d'une carte ou d'une maquette.","Ex. 3 (5 points)"]
],
exos:[
{t:"Le quadrilatère de Léo", p:3, h:`<p>Un quadrilatère ABCD a pour côtés : AB = 6 cm ; BC = 4 cm ; CD = 7 cm ; DA = 3 cm.</p>
  <p>Léo agrandit ce quadrilatère. Sur sa figure, le côté qui correspond à [AB] mesure 15 cm.</p>
  <p>a) Par quel nombre Léo a-t-il multiplié les longueurs ?</p><p>b) Calcule les longueurs des trois autres côtés de la figure de Léo.</p>
  <p>c) Zoé, elle, réduit ABCD en divisant toutes ses longueurs par 2. Combien mesure le côté qui correspond à [CD] sur sa figure ?</p>`,
 c:`<p>a) 15 ÷ 6 = 2,5 : Léo a multiplié toutes les longueurs par <b>2,5</b>. <i>(1 point)</i></p>
  <p>b) BC : 4 × 2,5 = <b>10 cm</b> · CD : 7 × 2,5 = <b>17,5 cm</b> · DA : 3 × 2,5 = <b>7,5 cm</b> <i>(0,5 point par longueur)</i></p>
  <p>c) Côté qui correspond à [CD] : 7 ÷ 2 = <b>3,5 cm</b>. <i>(0,5 point)</i></p>`},
{t:"Agrandissement ou pas ?", p:2, h:`<p>Parmi les triangles ①, ②, ③ et ④, lesquels sont des agrandissements du modèle ? Explique pour chaque triangle.</p>${GRILLE}`,
 c:`<p>Le modèle mesure 2 carreaux sur 3 carreaux (les deux côtés de l'angle droit).</p>
  <p>① : 4 carreaux sur 6 carreaux. 2 × 2 = 4 et 3 × 2 = 6 : c'est un <b>agrandissement</b> (× 2). <i>(0,5 point)</i></p>
  <p>② : 4 carreaux sur 5 carreaux. 2 × 2 = 4, mais 3 × 2 = 6 et pas 5 (on a ajouté 2 carreaux à chaque côté) : <b>ce n'est pas un agrandissement</b>. <i>(0,5 point)</i></p>
  <p>③ : 6 carreaux sur 9 carreaux. 2 × 3 = 6 et 3 × 3 = 9 : c'est un <b>agrandissement</b> (× 3). <i>(0,5 point)</i></p>
  <p>④ : 3 carreaux sur 6 carreaux. 2 × 1,5 = 3, mais 3 × 2 = 6 : les deux côtés ne sont pas multipliés par le même nombre, <b>ce n'est pas un agrandissement</b>. <i>(0,5 point)</i></p>`},
{t:"Plan, carte et maquette", p:5, h:`<p>a) Une terrasse rectangulaire mesure 5 m sur 2,5 m. Quelles sont ses dimensions sur un plan à l'échelle ${F(1,100)} ?</p>
  <p>b) Sur une carte de randonnée à l'échelle ${F(1,"25 000")}, un sentier mesure 8 cm. Quelle est sa longueur réelle, en km ?</p>`,
 c:`<p>a) À l'échelle ${F(1,100)}, 1 cm sur le plan représente 100 cm = 1 m en réalité. <i>(1 point)</i></p>
  <p>5 m = 500 cm et 500 ÷ 100 = 5 cm ; 2,5 m = 250 cm et 250 ÷ 100 = 2,5 cm. Sur le plan, la terrasse mesure <b>5 cm sur 2,5 cm</b>. <i>(1,5 point)</i></p>
  <p>b)</p><p class="calc">L = 8 × 25 000<br>L = 200 000 cm</p><p><i>(1,5 point)</i></p><p>200 000 cm = 2 000 m = <b>2 km</b>. <i>(1 point pour la conversion en km)</i></p>`}
]}
};
})()

};
})();
