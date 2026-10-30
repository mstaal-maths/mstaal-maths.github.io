/* 5e — Chapitre 1 : Multiples, diviseurs, division euclidienne et nombres premiers
   + évaluation d'entraînement commune aux chapitres 1 et 2 (utilisée aussi par 5e-2.js) */
(function(){
const VF = ["Vrai","Faux"], ON = ["Oui","Non"];
const co = (p,alt,w) => img("5c1co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("5c1ex/"+p+".png", alt, w);
const pot = (n,d,txt) => `<div class="figs" style="align-items:center">${potence(n,d)}<p>${txt}</p></div>`;

/* ---------- Évaluation d'entraînement n° 1 (chapitres 1 et 2) ---------- */
const T5 = { P:[120,70], I:[205,150], C:[105,160], W:[285,95], d1:[30,30], d2:[75,250] };
const symW = p=>G.sym(p,T5.W), symP = p=>G.sym(p,T5.P), symD = p=>G.refl(p,T5.d1,T5.d2);
const tri = {P:T5.P, I:T5.I, C:T5.C};
const R6 = {R:[30,40], S:[150,25], T:[70,135], O:[195,110]};
const K6 = {K:[30,110], L:[150,130], M:[70,40], O:[195,105]};
const angLab = (P,txt,dx,dy)=>`<text x="${P[0]+dx}" y="${P[1]+dy}" class="glab" style="font-size:14px">${txt}</text>`;
/* convention de M. Staal : axes de symétrie en ROUGE (pointillés), centres de symétrie en BLEU (même couleurs que 5e-2.js) */
const AXC = "#d62424", CTC = "#1d63d8";
const colGeo = (svg, centres=[]) => { let t = svg.replace(/class="axe2"/g, `class="axe2" style="stroke:${AXC};stroke-dasharray:8 5"`)
    .replace(/(<text [^>]*class="glab"[^>]*?style="font-size:[\d.]+px)(">\(d\)<\/text>)/g, `$1;fill:${AXC}$2`);
  centres.forEach(([n,[X,Y]])=>{
    t = t.replace(/<path d="M([\d.\-]+) ([\d.\-]+) L([\d.\-]+) ([\d.\-]+) M[^"]*" class="gx"\/>/g, (m,a,b,c,d)=> Math.hypot((+a + +c)/2-X, (+b + +d)/2-Y)<0.5 ? m.replace('class="gx"', `class="gx" style="stroke:${CTC};stroke-width:2.2"`) : m);
    t = t.replace(new RegExp(`(<text [^>]*class="glab"[^>]*?style="font-size:[\\d.]+px)(">${n}<\\/text>)`), `$1;fill:${CTC};font-weight:700$2`); });
  return t; };
const EVAL5 = {
titre:"Évaluation d'entraînement — Chapitres 1 et 2", duree:55, info:"Durée : 55 min · Calculatrice non autorisée · Règle, équerre et compas",
comp:[
  ["CALCULER","Je pose une division euclidienne et j'utilise les diviseurs, les multiples, les critères de divisibilité et les nombres premiers.","Ex. 1 et 2 (6 points)"],
  ["CHERCHER","J'organise ma recherche, je teste et je donne toutes les solutions d'un problème.","Ex. 3 (3 points)"],
  ["REPRÉSENTER","Je reconnais un demi-tour et une symétrie axiale, et je construis l'image d'une figure.","Ex. 4 et 5 (7 points)"],
  ["RAISONNER","J'utilise les propriétés du demi-tour pour justifier une longueur ou une mesure d'angle.","Ex. 6 (4 points)"]
],
exos:[
{t:"Diviseurs et multiples", p:3, h:`<p>1. a) Cite tous les diviseurs de 48. b) Cite trois multiples de 48.</p>
  <p>2. Le nombre 285 est-il divisible par 2 ? par 3 ? par 5 ? par 9 ? par 10 ? Réponds par oui ou par non.</p>
  <p>3. Le nombre 285 est-il un nombre premier ? Justifie.</p>`,
 c:`<p>1. a) 48 = 1 × 48 = 2 × 24 = 3 × 16 = 4 × 12 = 6 × 8, donc les diviseurs de 48 sont : 1, 2, 3, 4, 6, 8, 12, 16, 24, 48 <i>(1 point)</i></p>
  <p>b) Par exemple 48, 96 et 144 (48 × 1, 48 × 2, 48 × 3) <i>(0,5 point)</i></p>
  <p>2. Par 2 : non (le chiffre des unités est 5) · Par 3 : oui (2 + 8 + 5 = 15, multiple de 3) · Par 5 : oui (le chiffre des unités est 5) · Par 9 : non (15 n'est pas un multiple de 9) · Par 10 : non (le chiffre des unités n'est pas 0) <i>(0,2 point par case)</i></p>
  <p>3. Non : 285 est divisible par 3 et par 5 (285 = 5 × 57). Il a d'autres diviseurs que 1 et lui-même, donc ce n'est pas un nombre premier. <i>(0,5 point)</i></p>`},
{t:"Répartition en équipes", p:3, h:`<p>389 élèves sont répartis en équipes de 14 pour un concours.</p>
  <p>a) Combien d'équipes entières peut-on constituer ? Écris ton calcul posé.</p><p>b) Combien manquerait-il d'élèves pour constituer une dernière équipe complète ?</p>`,
 c:`<p>a) On pose la division euclidienne de 389 par 14 <i>(1,5 point pour le calcul posé)</i> :</p>${pot(389,14,"14 × 27 + 11 = 389")}
  <p>On peut constituer 27 équipes entières, et il reste 11 élèves. <i>(0,5 point)</i></p>
  <p>b) Il reste 11 élèves : il en manquerait 14 − 11 = 3 pour une équipe de plus. <i>(1 point)</i></p>`},
{t:"Chez le fleuriste", p:3, h:`<p>Un fleuriste a 18 tulipes et 24 roses. Il veut faire, avec toutes ses fleurs, des bouquets de composition identique. Il ne veut pas faire un seul bouquet.</p>
  <p>Combien de bouquets peut-il faire ? Quelle sera la composition de chaque bouquet ? Donne toutes les possibilités en justifiant.</p>`,
 c:`<p>Le nombre de bouquets doit être un diviseur de 18 <b>et</b> de 24.</p>
  <p>Diviseurs de 18 : 1, 2, 3, 6, 9, 18 · Diviseurs de 24 : 1, 2, 3, 4, 6, 8, 12, 24 · Diviseurs communs : 1, 2, 3 et 6. On enlève 1 (pas un seul bouquet).</p>
  <div class="scroll"><table class="std"><thead><tr><th>Nombre de bouquets</th><th>Tulipes par bouquet</th><th>Roses par bouquet</th></tr></thead>
  <tbody><tr><td>2</td><td>9</td><td>12</td></tr><tr><td>3</td><td>6</td><td>8</td></tr><tr><td>6</td><td>3</td><td>4</td></tr></tbody></table></div>
  <p><i>1 point par possibilité justifiée.</i></p>`},
{t:"Reconnaître une transformation", p:3, h:`<p>Ce dessin est composé de six motifs. Pour chaque ligne, écris « une symétrie axiale », « un demi-tour » ou « aucune des deux ».</p>
  ${flags([{n:1,f:TF.id},{n:2,f:TF.vx(130)},{n:3,f:TF.rot(130,165)},{n:4,f:TF.tr(230,0)},{n:5,f:TF.hy(165)},{n:6,f:TF.o(TF.tr(230,100),TF.q(81,115))}])}
  <p>a) du motif 1 au motif 2 · b) du motif 1 au motif 3 · c) du motif 1 au motif 4 · d) du motif 1 au motif 5 · e) du motif 2 au motif 5 · f) du motif 1 au motif 6</p>`,
 c:`<p>a) une symétrie axiale (axe vertical entre les deux motifs) · b) un demi-tour (le motif est retourné « tête en bas » et de l'autre côté) · c) aucune des deux (le motif a juste glissé) · d) une symétrie axiale (axe horizontal) · e) un demi-tour · f) aucune des deux (le motif a tourné d'un quart de tour seulement)</p>
  ${flags([{n:1,f:TF.id},{n:2,f:TF.vx(130)},{n:3,f:TF.rot(130,165)},{n:4,f:TF.tr(230,0)},{n:5,f:TF.hy(165)},{n:6,f:TF.o(TF.tr(230,100),TF.q(81,115))}],380,260,
   `<line x1="130" y1="60" x2="130" y2="260" class="axe3" style="stroke:${AXC}"/><line x1="20" y1="165" x2="240" y2="165" class="axe3" style="stroke:${AXC}"/><path d="M125 160 L135 170 M135 160 L125 170" class="gx" style="stroke:${CTC};stroke-width:2.2"/><text x="140" y="158" class="glab" style="fill:${CTC};font-weight:700">O</text>`)}
  <p>Les axes de symétrie (en pointillés <b style="color:${AXC}">rouges</b>) et le centre O du demi-tour (en <b style="color:${CTC}">bleu</b>) ont été tracés pour la correction. <i>(0,5 point par ligne)</i></p>`},
{t:"Constructions", p:4, h:`<p>Reproduis la figure (ou travaille sur la feuille), puis :</p>
  <p>a) Trace le symétrique du triangle PIC par rapport au point W. Nomme-le P₁I₁C₁.</p><p>b) Trace le symétrique du triangle PIC par rapport au point P. Nomme-le P₂I₂C₂.</p><p>c) Trace le symétrique du triangle PIC par rapport à la droite (d). Nomme-le P₃I₃C₃.</p>
  ${colGeo(geo({pts:{...tri, W:T5.W, d1:T5.d1, d2:T5.d2}, polys:[{v:["P","I","C"]}], marks:["W"], lines:[{a:"d1",b:"d2",lab:"(d)",t:0.05}], hide:[]}),[["W",T5.W]])}`,
 c:`<p>a) W est le milieu de [PP₁], de [II₁] et de [CC₁] <i>(1,5 point)</i>.</p>
  ${colGeo(geo({pts:{...tri, W:T5.W, "P₁":symW(T5.P),"I₁":symW(T5.I),"C₁":symW(T5.C)}, polys:[{v:["P","I","C"]},{v:["P₁","I₁","C₁"],k:"img"}], cons:[["P","W","P₁",1],["I","W","I₁",2],["C","W","C₁",3]]}),[["W",T5.W]])}
  <p>b) Le centre est un sommet : P est sa propre image (P₂ = P), et P est le milieu de [II₂] et de [CC₂] <i>(1 point)</i>.</p>
  ${colGeo(geo({pts:{...tri, "I₂":symP(T5.I),"C₂":symP(T5.C)}, polys:[{v:["P","I","C"]},{v:["P","I₂","C₂"],k:"img"}], cons:[["I","P","I₂",2],["C","P","C₂",3]], names:{P:"P = P₂"}}),[["P = P₂",T5.P]])}
  <p>c) (d) est la médiatrice de [PP₃], de [II₃] et de [CC₃] <i>(1,5 point)</i>.</p>
  ${colGeo(geo({pts:{...tri, d1:T5.d1, d2:T5.d2, "P₃":symD(T5.P),"I₃":symD(T5.I),"C₃":symD(T5.C)}, polys:[{v:["P","I","C"]},{v:["P₃","I₃","C₃"],k:"img"}], lines:[{a:"d1",b:"d2",lab:"(d)",t:0.05}], ax:[["P","P₃","d1","d2",1],["I","I₃","d1","d2",2],["C","C₃","d1","d2",3]]}))}`},
{t:"Démonstrations", p:4, h:`<p>Les deux questions sont indépendantes.</p>
  <p><b>Question 1</b> (2 points). Les triangles RST et UVW sont symétriques par rapport au point O. Quelle est la longueur du segment [UW] ? Justifie ta réponse (Je sais que… Or… Donc…).</p>
  ${colGeo(geo({pts:{...R6, U:G.sym(R6.R,R6.O), V:G.sym(R6.S,R6.O), W:G.sym(R6.T,R6.O)}, polys:[{v:["R","S","T"]},{v:["U","V","W"],k:"img"}], marks:["O"],
    extra:angLab([90,20],"6 cm",0,0)+angLab([110,85],"4,5 cm",8,0)+angLab([20,90],"3,5 cm",-14,0)}),[["O",R6.O]])}
  <p><b>Question 2</b> (2 points). Les triangles KLM et XYZ sont symétriques par rapport au point O. Quelle est la mesure de l'angle <span class="ang">XZY</span> ? Justifie ta réponse.</p>
  ${colGeo(geo({pts:{...K6, X:G.sym(K6.K,K6.O), Y:G.sym(K6.L,K6.O), Z:G.sym(K6.M,K6.O)}, polys:[{v:["K","L","M"]},{v:["X","Y","Z"],k:"img"}], marks:["O"],
    extra:angLab(K6.K,"115°",14,0)+angLab(K6.L,"35°",-40,-4)+angLab(K6.M,"30°",-6,22)}),[["O",K6.O]])}`,
 c:`<p><b>Question 1.</b> Je sais que les triangles RST et UVW sont symétriques par rapport au point O : le segment [UW] est le symétrique du segment [RT].<br>Or le demi-tour conserve les longueurs.<br>Donc UW = RT = 3,5 cm. <i>(2 points)</i></p>
  <p><b>Question 2.</b> Je sais que les triangles KLM et XYZ sont symétriques par rapport au point O : l'angle <span class="ang">XZY</span> est le symétrique de l'angle <span class="ang">KML</span>.<br>Or le demi-tour conserve les mesures d'angles.<br>Donc <span class="ang">XZY</span> = <span class="ang">KML</span> = 30°. <i>(2 points)</i></p>`}
]};
/* ---- version aménagée (élèves à besoins éducatifs particuliers), faite comme M. Staal fait les siennes :
   même durée, environ une question sur cinq retirée (jamais un exercice entier), questions renumérotées, barème recalculé sur 20 ---- */
const F6 = [{n:1,f:TF.id},{n:2,f:TF.vx(130)},{n:3,f:TF.rot(130,165)},{n:4,f:TF.tr(230,0)},{n:5,f:TF.hy(165)},{n:6,f:TF.o(TF.tr(230,100),TF.q(81,115))}];
EVAL5.bep = {
titre:"Évaluation d'entraînement — Chapitres 1 et 2 · version aménagée", duree:55, info:"Version aménagée · Durée : 55 min · Calculatrice non autorisée · Règle, équerre et compas",
note:"Même durée et mêmes exercices, avec environ une question sur cinq en moins (réparties dans plusieurs exercices). Les questions sont renumérotées et le barème est recalculé : la note reste sur 20. Les justifications sont toujours demandées.",
comp:[
  ["CALCULER","Je pose une division euclidienne et j'utilise les diviseurs, les critères de divisibilité et les nombres premiers.","Ex. 1 et 2 (5,5 points)"],
  ["CHERCHER","J'organise ma recherche, je teste et je donne toutes les solutions d'un problème.","Ex. 3 (3,5 points)"],
  ["REPRÉSENTER","Je reconnais un demi-tour et une symétrie axiale, et je construis l'image d'une figure.","Ex. 4 et 5 (6,5 points)"],
  ["RAISONNER","J'utilise les propriétés du demi-tour pour justifier une longueur ou une mesure d'angle.","Ex. 6 (4,5 points)"]
],
exos:[
{t:"Diviseurs et multiples", p:3, h:`<p>1. Cite tous les diviseurs de 48.</p>
  <p>2. Le nombre 285 est-il divisible par 2 ? par 3 ? par 5 ? par 9 ? par 10 ? Réponds par oui ou par non.</p>
  <p>3. Le nombre 285 est-il un nombre premier ? Justifie.</p>`,
 c:`<p>1. 48 = 1 × 48 = 2 × 24 = 3 × 16 = 4 × 12 = 6 × 8, donc les diviseurs de 48 sont : 1, 2, 3, 4, 6, 8, 12, 16, 24, 48 <i>(1,25 point)</i></p>
  <p>2. Par 2 : non (le chiffre des unités est 5) · Par 3 : oui (2 + 8 + 5 = 15, multiple de 3) · Par 5 : oui (le chiffre des unités est 5) · Par 9 : non (15 n'est pas un multiple de 9) · Par 10 : non (le chiffre des unités n'est pas 0) <i>(0,25 point par case)</i></p>
  <p>3. Non : 285 est divisible par 3 et par 5 (285 = 5 × 57). Il a d'autres diviseurs que 1 et lui-même, donc ce n'est pas un nombre premier. <i>(0,5 point)</i></p>`},
{t:"Répartition en équipes", p:2.5, h:`<p>389 élèves sont répartis en équipes de 14 pour un concours.</p>
  <p>Combien d'équipes entières peut-on constituer ? Écris ton calcul posé.</p>`,
 c:`<p>On pose la division euclidienne de 389 par 14 <i>(1,5 point pour le calcul posé)</i> :</p>${pot(389,14,"14 × 27 + 11 = 389")}
  <p>On peut constituer 27 équipes entières, et il reste 11 élèves. <i>(1 point)</i></p>`},
{t:"Chez le fleuriste", p:3.5, h:`<p>Un fleuriste a 18 tulipes et 24 roses. Il veut faire, avec toutes ses fleurs, des bouquets de composition identique. Il ne veut pas faire un seul bouquet.</p>
  <p>Combien de bouquets peut-il faire ? Quelle sera la composition de chaque bouquet ? Donne toutes les possibilités en justifiant.</p>`,
 c:`<p>Le nombre de bouquets doit être un diviseur de 18 <b>et</b> de 24.</p>
  <p>Diviseurs de 18 : 1, 2, 3, 6, 9, 18 · Diviseurs de 24 : 1, 2, 3, 4, 6, 8, 12, 24 · Diviseurs communs : 1, 2, 3 et 6. On enlève 1 (pas un seul bouquet). <i>(0,5 point)</i></p>
  <div class="scroll"><table class="std"><thead><tr><th>Nombre de bouquets</th><th>Tulipes par bouquet</th><th>Roses par bouquet</th></tr></thead>
  <tbody><tr><td>2</td><td>9</td><td>12</td></tr><tr><td>3</td><td>6</td><td>8</td></tr><tr><td>6</td><td>3</td><td>4</td></tr></tbody></table></div>
  <p><i>1 point par possibilité justifiée.</i></p>`},
{t:"Reconnaître une transformation", p:2.5, h:`<p>Ce dessin est composé de six motifs. Pour chaque ligne, écris « une symétrie axiale », « un demi-tour » ou « aucune des deux ».</p>
  ${flags(F6)}
  <p>a) du motif 1 au motif 2 · b) du motif 1 au motif 3 · c) du motif 1 au motif 4 · d) du motif 1 au motif 5 · e) du motif 1 au motif 6</p>`,
 c:`<p>a) une symétrie axiale (axe vertical entre les deux motifs) · b) un demi-tour (le motif est retourné « tête en bas » et de l'autre côté) · c) aucune des deux (le motif a juste glissé) · d) une symétrie axiale (axe horizontal) · e) aucune des deux (le motif a tourné d'un quart de tour seulement)</p>
  ${flags(F6,380,260,
   `<line x1="130" y1="60" x2="130" y2="260" class="axe3" style="stroke:${AXC}"/><line x1="20" y1="165" x2="240" y2="165" class="axe3" style="stroke:${AXC}"/><path d="M125 160 L135 170 M135 160 L125 170" class="gx" style="stroke:${CTC};stroke-width:2.2"/><text x="140" y="158" class="glab" style="fill:${CTC};font-weight:700">O</text>`)}
  <p>Les axes de symétrie (en pointillés <b style="color:${AXC}">rouges</b>) et le centre O du demi-tour (en <b style="color:${CTC}">bleu</b>) ont été tracés pour la correction. <i>(0,5 point par ligne)</i></p>`},
{t:"Constructions", p:4, h:`<p>Reproduis la figure (ou travaille sur la feuille), puis :</p>
  <p>a) Trace le symétrique du triangle PIC par rapport au point W. Nomme-le P₁I₁C₁.</p><p>b) Trace le symétrique du triangle PIC par rapport à la droite (d). Nomme-le P₂I₂C₂.</p>
  ${colGeo(geo({pts:{...tri, W:T5.W, d1:T5.d1, d2:T5.d2}, polys:[{v:["P","I","C"]}], marks:["W"], lines:[{a:"d1",b:"d2",lab:"(d)",t:0.05}], hide:[]}),[["W",T5.W]])}`,
 c:`<p>a) W est le milieu de [PP₁], de [II₁] et de [CC₁] <i>(2 points)</i>.</p>
  ${colGeo(geo({pts:{...tri, W:T5.W, "P₁":symW(T5.P),"I₁":symW(T5.I),"C₁":symW(T5.C)}, polys:[{v:["P","I","C"]},{v:["P₁","I₁","C₁"],k:"img"}], cons:[["P","W","P₁",1],["I","W","I₁",2],["C","W","C₁",3]]}),[["W",T5.W]])}
  <p>b) (d) est la médiatrice de [PP₂], de [II₂] et de [CC₂] <i>(2 points)</i>.</p>
  ${colGeo(geo({pts:{...tri, d1:T5.d1, d2:T5.d2, "P₂":symD(T5.P),"I₂":symD(T5.I),"C₂":symD(T5.C)}, polys:[{v:["P","I","C"]},{v:["P₂","I₂","C₂"],k:"img"}], lines:[{a:"d1",b:"d2",lab:"(d)",t:0.05}], ax:[["P","P₂","d1","d2",1],["I","I₂","d1","d2",2],["C","C₂","d1","d2",3]]}))}`},
{t:"Démonstrations", p:4.5, h:`<p>Les deux questions sont indépendantes.</p>
  <p><b>Question 1</b> (2,25 points). Les triangles RST et UVW sont symétriques par rapport au point O. Quelle est la longueur du segment [UW] ? Justifie ta réponse (Je sais que… Or… Donc…).</p>
  ${colGeo(geo({pts:{...R6, U:G.sym(R6.R,R6.O), V:G.sym(R6.S,R6.O), W:G.sym(R6.T,R6.O)}, polys:[{v:["R","S","T"]},{v:["U","V","W"],k:"img"}], marks:["O"],
    extra:angLab([90,20],"6 cm",0,0)+angLab([110,85],"4,5 cm",8,0)+angLab([20,90],"3,5 cm",-14,0)}),[["O",R6.O]])}
  <p><b>Question 2</b> (2,25 points). Les triangles KLM et XYZ sont symétriques par rapport au point O. Quelle est la mesure de l'angle <span class="ang">XZY</span> ? Justifie ta réponse (Je sais que… Or… Donc…).</p>
  ${colGeo(geo({pts:{...K6, X:G.sym(K6.K,K6.O), Y:G.sym(K6.L,K6.O), Z:G.sym(K6.M,K6.O)}, polys:[{v:["K","L","M"]},{v:["X","Y","Z"],k:"img"}], marks:["O"],
    extra:angLab(K6.K,"115°",14,0)+angLab(K6.L,"35°",-40,-4)+angLab(K6.M,"30°",-6,22)}),[["O",K6.O]])}`,
 c:`<p><b>Question 1.</b> Je sais que les triangles RST et UVW sont symétriques par rapport au point O : le segment [UW] est le symétrique du segment [RT].<br>Or le demi-tour conserve les longueurs.<br>Donc UW = RT = 3,5 cm. <i>(0,75 point par ligne)</i></p>
  <p><b>Question 2.</b> Je sais que les triangles KLM et XYZ sont symétriques par rapport au point O : l'angle <span class="ang">XZY</span> est le symétrique de l'angle <span class="ang">KML</span>.<br>Or le demi-tour conserve les mesures d'angles.<br>Donc <span class="ang">XZY</span> = <span class="ang">KML</span> = 30°. <i>(0,75 point par ligne)</i></p>`}
]};
window.EVAL5_1 = EVAL5;

/* ===================== CHAPITRE ===================== */
CH["5e-1"] = {
intro:"Multiples et critères de divisibilité, diviseurs, division euclidienne et nombres premiers.",
savoir:[
  "poser une division euclidienne et utiliser les diviseurs, les multiples et les critères de divisibilité ;",
  "organiser ma recherche, tester et donner toutes les solutions d'un problème."
],
cours:[
{t:"Multiples", h:`
  <h4>a) Définition</h4>
  <div class="retenir" data-l="Définition"><p>Les multiples de 12 sont des nombres entiers. On les trouve en multipliant 12 par un nombre entier.</p></div>
  <p class="calc">12 × 2 = 24 &nbsp;donc 24 est un multiple de 12.<br>12 × 5 = 60 &nbsp;donc 60 est un multiple de 12.<br>12 × 1 = 12 &nbsp;donc 12 est un multiple de 12.<br>12 × 0 = 0 &nbsp;&nbsp;donc 0 est un multiple de 12.</p>
  <h4>b) Critères de divisibilité : reconnaître un multiple de 2, 3, 5, 9, 10</h4>
  <p>Avec de grands nombres, on utilise des critères pour savoir rapidement si un nombre est multiple de 2, 3, 5, 9 ou 10 :</p>
  <div class="scroll"><table class="std"><thead><tr><th>Un nombre est multiple de…</th><th>si…</th><th>Exemple</th></tr></thead><tbody>
    <tr><td><b>2</b></td><td>il est pair : son chiffre des unités est 0, 2, 4, 6 ou 8</td><td>2 406 (unités : 6)</td></tr>
    <tr><td><b>3</b></td><td>la somme de ses chiffres est un multiple de 3</td><td>366 : 3 + 6 + 6 = 15 = 3 × 5</td></tr>
    <tr><td><b>5</b></td><td>son chiffre des unités est 0 ou 5</td><td>1 645 (unités : 5)</td></tr>
    <tr><td><b>9</b></td><td>la somme de ses chiffres est un multiple de 9</td><td>954 : 9 + 5 + 4 = 18 = 9 × 2</td></tr>
    <tr><td><b>10</b></td><td>son chiffre des unités est 0</td><td>87 610 (unités : 0)</td></tr></tbody></table></div>`},
{t:"Diviseurs", h:`
  <div class="retenir" data-l="Définition"><p>Si je divise 12 par un nombre et que le résultat est un nombre entier, alors le nombre par lequel j'ai divisé 12 est appelé un <b>diviseur</b> de 12.</p></div>
  <p>Tous les diviseurs de 12 sont : 1, 2, 3, 4, 6 et 12.</p>
  <p class="calc">12 ÷ 1 = 12 &nbsp;donc 1 est un diviseur de 12.<br>12 ÷ 2 = 6 &nbsp;&nbsp;donc 2 est un diviseur de 12.<br>12 ÷ 3 = 4 &nbsp;&nbsp;donc 3 est un diviseur de 12.<br>12 ÷ 4 = 3 &nbsp;&nbsp;donc 4 est un diviseur de 12.<br>12 ÷ 6 = 2 &nbsp;&nbsp;donc 6 est un diviseur de 12.<br>12 ÷ 12 = 1 &nbsp;donc 12 est un diviseur de 12.</p>
  <div class="retenir" data-l="Vocabulaire"><p>Comme 30 = 5 × 6, on peut dire : 5 est un <b>diviseur</b> de 30 · 30 est un <b>multiple</b> de 5 · 30 est <b>divisible</b> par 5.</p></div>`},
{t:"Division euclidienne", h:`
  <div class="retenir" data-l="Définition"><p>Une division euclidienne est une division dans laquelle le dividende, le diviseur, le quotient et le reste sont des nombres entiers.</p></div>
  <p><b>Exemple :</b> 135 livres sont distribués dans 6 bibliothèques. Les autres livres restent à la mairie. Combien de livres chaque bibliothèque reçoit-elle, et combien en reste-t-il à la mairie ?</p>
  <p>On pose la division euclidienne de 135 par 6 (135 est le dividende, 6 est le diviseur) :</p>
  <ol><li>On ne peut pas diviser 1 centaine par 6, donc on prend 13 dizaines.</li>
    <li>Dans 13 dizaines, je peux faire au maximum 6 paquets de 2 dizaines, donc 12 ; il en reste 1.</li>
    <li>J'abaisse les 5 unités : j'ai maintenant 15 unités.</li>
    <li>Dans 15 unités, je peux faire au maximum 6 paquets de 2 unités, donc 12 ; il en reste 3.</li></ol>
  <div class="figs" style="align-items:center">${potence(135,6)}${co("p4-05","Le dividende 135, le diviseur 6, le quotient 22 et le reste 3",330)}</div>
  <p><b>Rédaction attendue :</b> 6 × 22 + 3 = 135. Chaque bibliothèque reçoit 22 livres et 3 restent à la mairie.</p>
  <div class="retenir" data-l="À retenir"><p class="big">diviseur × quotient + reste = dividende</p><p>Le reste est toujours plus petit que le diviseur.</p></div>`},
{t:"Nombres premiers", h:`
  <div class="retenir" data-l="Définition"><p>Un nombre premier est un nombre qui n'a que deux diviseurs : 1 et lui-même.</p></div>
  <ul><li>12 n'est pas un nombre premier car il est divisible par 1, 2, 3, 4, 6 et 12.</li>
  <li>1 n'est pas un nombre premier car il n'a qu'un seul diviseur, lui-même.</li>
  <li>0 n'est pas un nombre premier car il est divisible par n'importe quel nombre non nul.</li>
  <li>2, 3, 5, 7, 11, 13, 17, 19, 23, 29 sont tous les nombres premiers inférieurs à 30.</li></ul>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Division euclidienne", e:[
  {n:"Activité 1", t:"Le trésor d'un galion", w:"Sur ton cahier", h:`<p>Le trésor d'un galion contient 185 pièces d'or. Le capitaine décide de les partager entre les 12 marins les plus valeureux de son équipage, chaque marin devant recevoir le même nombre de pièces.</p>
   <p>1 – Combien de pièces d'or aura reçu chaque marin ?</p><p>2 – Combien le trésor aurait-il dû contenir de pièces supplémentaires pour que chaque marin en reçoive une de plus et que toutes les pièces soient distribuées ?</p>`,
   c:`${pot(185,12,"12 × 15 + 5 = 185")}<p>1 – Chaque marin reçoit 15 pièces d'or, et il reste 5 pièces.</p><p>2 – Pour que chaque marin reçoive 16 pièces, il faut 12 × 16 = 192 pièces. Il aurait fallu 192 − 185 = 7 pièces supplémentaires.</p>`},
  {n:"Exercice 1", t:"Tournoi de rugby", w:"Sur ton cahier", h:`<p>186 élèves du collège sont inscrits à un tournoi de rugby.</p><p>a) Combien d'équipes complètes de 15 joueurs peut-on former ? b) Combien manque-t-il d'élèves pour former une équipe supplémentaire ?</p>`,
   c:`${pot(186,15,"15 × 12 + 6 = 186")}<p>a) On peut former 12 équipes complètes (il reste 6 élèves).</p><p>b) Il manque 15 − 6 = 9 élèves pour une équipe de plus.</p>`},
  {n:"Exercice 2", t:"À la bibliothèque", w:"Sur ton cahier", h:`<p>Un bibliothécaire doit répartir 420 livres sur des étagères, avec le même nombre de livres sur chaque étagère. Est-ce possible avec 18 étagères ? Avec 21 étagères ? Explique.</p>`,
   c:`<div class="figs" style="align-items:center">${potence(420,18)}${potence(420,21)}</div>
   <p>Avec 18 étagères : 18 × 23 + 6 = 420. Le reste n'est pas nul : ce n'est <b>pas possible</b> (il resterait 6 livres).</p>
   <p>Avec 21 étagères : 21 × 20 = 420. Le reste est nul : c'est <b>possible</b>, avec 20 livres par étagère.</p>`}
 ],
 aide:{t:"Pour démarrer", w:"Sur ton cahier", h:`<p>Pose la division euclidienne de 47 par 5, puis complète : 5 × … + … = 47.</p>`, c:`${pot(47,5,"5 × 9 + 2 = 47 : le quotient est 9 et le reste est 2.")}`},
 defi:{t:"Le trésor du galion", w:"Sur ton cahier", h:`<p>185 pièces d'or sont partagées entre 12 marins, chacun recevant le même nombre de pièces. Combien chaque marin reçoit-il ? Combien de pièces aurait-il fallu en plus pour que chaque marin en reçoive une de plus et que toutes soient distribuées ?</p>`,
  c:`${pot(185,12,"12 × 15 + 5 = 185")}<p>Chaque marin reçoit 15 pièces, il en reste 5. Pour donner 16 pièces à chacun, il faut 12 × 16 = 192 pièces : il en aurait fallu 192 − 185 = 7 de plus.</p>`}
},
{t:"Diviseurs et critères de divisibilité", e:[
  {n:"Activité 2", t:"Trouver le nombre de marins possibles", w:"Sur ton cahier", h:`<p>Dans un autre galion, le trésor contient 28 pièces d'or. Le capitaine a également partagé équitablement ces pièces d'or et il n'en reste plus à la fin. Combien pouvait-il y avoir de marins ?</p>
   <p>Énumère toutes les possibilités dans un tableau comme celui-ci :</p>
   <div class="scroll"><table class="std"><tbody><tr><th>Nombre de marins</th><td>…</td><td>…</td><td>…</td><td>…</td><td>…</td><td>…</td><td>…</td><td>…</td></tr><tr><th>Nombre de pièces d'or par marin</th><td>…</td><td>…</td><td>…</td><td>…</td><td>…</td><td>…</td><td>…</td><td>…</td></tr></tbody></table></div>`,
   c:`<p>Il ne reste aucune pièce : le nombre de marins doit être un <b>diviseur</b> de 28. Je cherche les produits égaux à 28 : 1 × 28, 2 × 14, 4 × 7.</p>
   <div class="scroll"><table class="std"><tbody><tr><th>Nombre de marins</th><td>1</td><td>2</td><td>4</td><td>7</td><td>14</td><td>28</td></tr><tr><th>Nombre de pièces d'or par marin</th><td>28</td><td>14</td><td>7</td><td>4</td><td>2</td><td>1</td></tr></tbody></table></div>
   <p>Il pouvait y avoir 1, 2, 4, 7, 14 ou 28 marins : ce sont les diviseurs de 28.</p>`},
  {n:"Exercice 3", t:"Liste de diviseurs", w:"Sur ton cahier", h:`<p>Cite tous les diviseurs de : a) 15 · b) 24 · c) 16 · d) 11</p>`,
   c:`<p>Je cherche les produits égaux au nombre.</p><p>a) 15 = 1 × 15 = 3 × 5 : <b>1, 3, 5, 15</b> · b) 24 = 1 × 24 = 2 × 12 = 3 × 8 = 4 × 6 : <b>1, 2, 3, 4, 6, 8, 12, 24</b> · c) 16 = 1 × 16 = 2 × 8 = 4 × 4 : <b>1, 2, 4, 8, 16</b> · d) 11 = 1 × 11 seulement : <b>1, 11</b></p>`},
  {n:"Exercice 4", t:"Les critères de divisibilité", w:"Sur ton cahier", h:`<p>Réponds par oui ou non. Le nombre 780 est-il divisible par 2 ? par 5 ? par 10 ? par 3 ? par 9 ? Même question pour 576.</p>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th></th><th>par 2</th><th>par 5</th><th>par 10</th><th>par 3</th><th>par 9</th></tr></thead><tbody>
   <tr><td><b>780</b></td><td>oui</td><td>oui</td><td>oui</td><td>oui (7 + 8 + 0 = 15)</td><td>non (15 n'est pas un multiple de 9)</td></tr>
   <tr><td><b>576</b></td><td>oui</td><td>non</td><td>non</td><td>oui (5 + 7 + 6 = 18)</td><td>oui (18 = 9 × 2)</td></tr></tbody></table></div><p>Par 2, par 5 et par 10 : je regarde le chiffre des unités (0 pour 780, 6 pour 576).</p>`},
  {n:"Exercice 5", t:"Pour aller plus loin", w:"Sur ton cahier", h:`<p>1. Vrai ou faux ? Justifie. a) Un multiple de 3 est forcément multiple de 9. b) Un multiple de 9 est forcément multiple de 3.</p><p>2. Complète : « Un nombre multiple de 10 est forcément multiple de … »</p>`,
   c:`<p>1. a) Faux : 6 est un multiple de 3 (3 × 2) mais pas de 9. Un seul contre-exemple suffit.</p>
   <p>b) Vrai : 9 = 3 × 3. Un multiple de 9 s'écrit 9 × un nombre, c'est donc aussi 3 × 3 × ce nombre : c'est un multiple de 3.</p>
   <p>2. … de 2 et de 5 (car 10 = 2 × 5), et aussi de 1 et de 10.</p>`},
  {n:"Exercice 6", t:"Vocabulaire de la divisibilité", w:"Sur ton cahier", h:`<p>a) Cite tous les diviseurs de 30. b) Cite des multiples de 30. c) Cite les trois premiers multiples de 30. d) Le nombre 4 656 est-il divisible par 2 ? par 5 ? par 10 ? par 3 ? par 9 ?</p>`,
   c:`<p>a) 30 = 1 × 30 = 2 × 15 = 3 × 10 = 5 × 6 : 1, 2, 3, 5, 6, 10, 15, 30</p><p>b) Par exemple 60, 90, 300 (30 × 2, 30 × 3, 30 × 10)</p><p>c) 0, 30 et 60 (car 30 × 0 = 0). Si on ne compte pas 0 : 30, 60 et 90.</p>
   <p>d) Par 2 : oui (unités : 6) · Par 5 : non (unités : 6) · Par 10 : non (unités : 6) · Par 3 : oui (4 + 6 + 5 + 6 = 21) · Par 9 : non (21 n'est pas un multiple de 9)</p>`}
 ],
 aide:{t:"Pour démarrer", w:"Sur ton cahier", h:`<p>Complète : 18 = 1 × 18 = 2 × … = 3 × … Puis donne tous les diviseurs de 18.</p>`, c:`18 = 1 × 18 = 2 × 9 = 3 × 6. Les diviseurs de 18 sont 1, 2, 3, 6, 9 et 18. On les trouve « par paires ».`},
 defi:{t:"Un critère à inventer", w:"Sur ton cahier", h:`<p>Trouve le plus petit nombre de 4 chiffres divisible à la fois par 2, 3, 5 et 9.</p>`, c:`Divisible par 2 et 5 : il se termine par 0. Divisible par 9 (donc aussi par 3) : la somme de ses chiffres est un multiple de 9. Le plus petit est 1 080 (1 + 0 + 8 + 0 = 9).`}
},
{t:"Problèmes de partage", e:[
  {n:"Exercice 7", t:"Corbeilles de petit déjeuner", w:"Sur ton cahier", h:`<p>Le boulanger a livré 16 croissants et 28 pains au chocolat. On veut préparer des corbeilles identiques en utilisant toutes les viennoiseries.</p>
   ${ex("p2-01","Corbeille de croissants et de pains au chocolat",260)}<p>1. Combien de corbeilles peut-on faire, et quel sera le contenu de chacune ? Donne toutes les possibilités. 2. Que représentent les nombres de corbeilles possibles pour 16 et 28 ?</p>`,
   c:`<p>1. Diviseurs de 16 : 1, 2, 4, 8, 16 · Diviseurs de 28 : 1, 2, 4, 7, 14, 28 · Diviseurs communs : 1, 2, 4.</p>
   <div class="scroll"><table class="std"><thead><tr><th>Corbeilles</th><th>Croissants</th><th>Pains au chocolat</th></tr></thead><tbody><tr><td>1</td><td>16</td><td>28</td></tr><tr><td>2</td><td>8</td><td>14</td></tr><tr><td>4</td><td>4</td><td>7</td></tr></tbody></table></div>
   <p>2. Ce sont les diviseurs communs à 16 et 28.</p>`},
  {n:"Exercice 8", t:"Différents problèmes", w:"Sur ton cahier", h:`<p><b>Problème 1.</b> Claude veut planter 162 pommiers en rangées qui ont toutes le même nombre de pommiers. Peut-il faire 13 rangées complètes ? 9 rangées complètes ? Justifie.</p>
   <p><b>Problème 2.</b> Au goûter, 36 crêpes ont été mangées et chaque personne en a mangé le même nombre. Combien pouvait-il y avoir de personnes ? Donne toutes les possibilités.</p>
   <p><b>Problème 3.</b> Un fleuriste a 12 roses rouges et 18 roses blanches. Il veut faire des bouquets identiques avec toutes ses fleurs. Combien de bouquets, et quelle composition ? Donne toutes les possibilités.</p>`,
   c:`<p><b>Problème 1.</b> 13 × 12 + 6 = 162 : le reste n'est pas nul, 13 rangées complètes c'est impossible. 9 × 18 = 162 : c'est possible, avec 18 pommiers par rangée (on pouvait aussi voir que 1 + 6 + 2 = 9).</p>
   <p><b>Problème 2.</b> Le nombre de personnes est un diviseur de 36. 36 = 1 × 36 = 2 × 18 = 3 × 12 = 4 × 9 = 6 × 6 : 1, 2, 3, 4, 6, 9, 12, 18 ou 36 personnes.</p>
   <p><b>Problème 3.</b> Diviseurs de 12 : 1, 2, 3, 4, 6, 12. Diviseurs de 18 : 1, 2, 3, 6, 9, 18.</p><p>Diviseurs communs à 12 et 18 : 1, 2, 3, 6.</p>
   <div class="scroll"><table class="std"><thead><tr><th>Bouquets</th><th>Roses rouges</th><th>Roses blanches</th></tr></thead><tbody><tr><td>1</td><td>12</td><td>18</td></tr><tr><td>2</td><td>6</td><td>9</td></tr><tr><td>3</td><td>4</td><td>6</td></tr><tr><td>6</td><td>2</td><td>3</td></tr></tbody></table></div>`}
 ],
 aide:{t:"Pour démarrer", w:"Sur ton cahier", h:`<p>On a 6 billes rouges et 9 billes bleues. On fait des sachets identiques avec toutes les billes. Combien de sachets peut-on faire ?</p>`, c:`Diviseurs de 6 : 1, 2, 3, 6 · Diviseurs de 9 : 1, 3, 9 · Diviseurs communs : 1 et 3. Donc 1 sachet (6 rouges, 9 bleues) ou 3 sachets (2 rouges, 3 bleues).`},
 defi:{t:"Le plus de corbeilles possible", w:"Sur ton cahier", h:`<p>On a 48 bonbons et 72 sucettes. On veut faire le plus grand nombre possible de paquets identiques avec tout. Combien de paquets, et que contient chacun ?</p>`, c:`Il faut le plus grand diviseur commun à 48 et 72 : c'est 24. On fait 24 paquets de 2 bonbons et 3 sucettes.`}
},
{t:"Nombres premiers", e:[
  {n:"Exercice 9", t:"À la chasse aux nombres premiers", w:"Sur ta feuille", h:`<p>1) Parmi 15, 24, 16 et 11, lequel est un nombre premier ? Justifie avec sa liste de diviseurs.</p>
   <p>2) Avec le crible d'Ératosthène, trouve tous les nombres premiers inférieurs à 50 : barre 1 ; entoure 2 et barre ses multiples ; entoure 3 et barre ses multiples ; continue avec le premier nombre non barré.</p>
   <div class="scroll"><table class="std" style="margin:8px 0"><tbody>${[0,1,2,3,4].map(r=>`<tr>${[1,2,3,4,5,6,7,8,9,10].map(c=>`<td style="text-align:center;height:2.4em;min-width:2.6em">${r*10+c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
   <p>3) Liste les nombres premiers inférieurs à 50.</p><p>4) Vrai ou faux : « Tous les nombres premiers sont impairs. »</p>`,
   c:`<p>1) 11, car ses seuls diviseurs sont 1 et 11.</p><p>2) On barre 1, qui n'est pas premier. On entoure 2 et on barre ses multiples (4, 6, 8…) ; on entoure 3 et on barre ses multiples (9, 15, 21…) ; on entoure 5 et on barre 25 et 35 ; on entoure 7 et on barre 49 (leurs autres multiples sont déjà barrés). Les nombres qui restent sont tous premiers : on les entoure.</p>${(()=>{ const pr=n=>{ if(n<2) return false; for(let d=2;d*d<=n;d++) if(n%d===0) return false; return true; }; let h='<div class="scroll"><table class="std" style="text-align:center;margin:8px 0"><tbody>'; for(let r=0;r<5;r++){ h+='<tr>'; for(let c=1;c<=10;c++){ const n=r*10+c; h+= pr(n) ? `<td style="text-align:center"><span style="display:inline-block;min-width:1.9em;text-align:center;border:2px solid currentColor;border-radius:50%;font-weight:700">${n}</span></td>` : `<td style="color:#888;text-align:center"><s>${n}</s></td>`; } h+='</tr>'; } return h+'</tbody></table></div>'; })()}<p>3) 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47</p><p>4) Faux : 2 est un nombre premier et il est pair. C'est le seul nombre premier pair.</p>`},
  {n:"Exercice 10", t:"Le code du coffre au trésor", w:"Sur ton cahier", h:`<p>Le code est un nombre à 2 chiffres. Indices : ① je suis compris entre 40 et 90 ; ② je suis un multiple de 6 ; ③ la division euclidienne de mon nombre par 8 donne un reste de 2 ; ④ la somme de mes deux chiffres est un multiple de 4 ; ⑤ je ne suis pas un multiple de 5.</p>
   <p>a) Liste les nombres qui vérifient ① et ②. b) Élimine ceux qui ne vérifient pas ③. c) Utilise ④ et ⑤ pour trouver le code.</p>`,
   c:`<p>a) 42, 48, 54, 60, 66, 72, 78, 84, 90</p>
   <p>b) On garde ceux dont le reste par 8 est 2 : 42 (8 × 5 + 2), 66 (8 × 8 + 2) et 90 (8 × 11 + 2).</p>
   <p>c) 90 est un multiple de 5 : on l'élimine. Somme des chiffres : 42 → 6, 66 → 12. Seul 12 est un multiple de 4 : <b>le code est 66</b>.</p>`}
 ],
 aide:{t:"Pour démarrer", w:"Sur ton cahier", h:`<p>Le nombre 9 est-il premier ? Et 7 ?</p>`, c:`9 n'est pas premier : ses diviseurs sont 1, 3 et 9 (trois diviseurs). 7 est premier : ses seuls diviseurs sont 1 et 7.`},
 defi:{t:"Entre 50 et 70", w:"Sur ton cahier", h:`<p>Trouve tous les nombres premiers compris entre 50 et 70. Justifie pour ceux que tu élimines.</p>`, c:`53, 59, 61 et 67. Les autres sont éliminés : les nombres pairs (divisibles par 2), 51, 57 et 69 (divisibles par 3), 55 et 65 (divisibles par 5), 63 (divisible par 3 et 9).`}
}
],

/* ===================== QUIZ ===================== */
quiz:[
{nom:"Multiples", q:{
 1:[ {q:"Lequel de ces nombres est un multiple de 7 ?", c:["42","45","27","17"], rep:"42", ex:"7 × 6 = 42."},
     {q:"Vrai ou faux : 10 est un multiple de 4.", c:VF, rep:"Faux", ex:"4 × 2 = 8 et 4 × 3 = 12 : 10 n'est pas dans la table de 4."},
     {q:"Complète.", t:"12 × □ = 60, donc 60 est un multiple de 12.", r:["5"]} ],
 2:[ {q:"Vrai ou faux : 0 est un multiple de 12.", c:VF, rep:"Vrai", ex:"12 × 0 = 0."},
     {q:"Quels sont les quatre premiers multiples de 5 (en comptant 0) ?", c:["0, 5, 10, 15","5, 10, 15, 20","1, 5, 10, 15","5, 25, 125, 625"], rep:"0, 5, 10, 15"},
     {q:"Combien y a-t-il de multiples de 9 entre 10 et 50 ?", c:["4","5","3","9"], rep:"4", ex:"18, 27, 36, 45."} ],
 3:[ {q:"Vrai ou faux : un multiple de 3 est forcément un multiple de 9.", c:VF, rep:"Faux", ex:"6 est un multiple de 3, mais pas de 9."},
     {q:"Vrai ou faux : un multiple de 9 est forcément un multiple de 3.", c:VF, rep:"Vrai", ex:"9 = 3 × 3."},
     {q:"Quel est le plus petit multiple de 6 supérieur à 100 ?", rep:"102", ex:"6 × 17 = 102."} ]
}},
{nom:"Critères de divisibilité", q:{
 1:[ {q:"2 406 est-il divisible par 2 ?", c:ON, rep:"Oui", ex:"Son chiffre des unités, 6, est pair."},
     {q:"1 645 est-il divisible par 5 ?", c:ON, rep:"Oui", ex:"Son chiffre des unités est 5."},
     {q:"87 615 est-il divisible par 10 ?", c:ON, rep:"Non", ex:"Son chiffre des unités n'est pas 0."} ],
 2:[ {q:"366 est-il divisible par 3 ?", c:ON, rep:"Oui", ex:"3 + 6 + 6 = 15, et 15 est un multiple de 3."},
     {q:"954 est-il divisible par 9 ?", c:ON, rep:"Oui", ex:"9 + 5 + 4 = 18, et 18 est un multiple de 9."},
     {q:"780 est-il divisible par 9 ?", c:ON, rep:"Non", ex:"7 + 8 + 0 = 15, qui n'est pas un multiple de 9."} ],
 3:[ {q:"Par quels nombres 405 est-il divisible ?", c:["3, 5 et 9","2, 5 et 10","3 et 9 seulement","5 seulement"], rep:"3, 5 et 9", ex:"Unités 5 : divisible par 5, pas par 2 ni 10. 4 + 0 + 5 = 9 : divisible par 3 et par 9."},
     {q:"Par quels nombres 4 656 est-il divisible ?", c:["2 et 3","2, 3 et 9","2, 5 et 10","3 et 9"], rep:"2 et 3", ex:"Pair : divisible par 2. 4 + 6 + 5 + 6 = 21 : divisible par 3, pas par 9."},
     {q:"Quel chiffre faut-il écrire à la place de ★ pour que le nombre 7★4 soit divisible par 9 ?", rep:"7", ex:"7 + ★ + 4 doit être un multiple de 9 : 7 + 7 + 4 = 18."} ]
}},
{nom:"Diviseurs", q:{
 1:[ {q:"5 est-il un diviseur de 30 ?", c:ON, rep:"Oui", ex:"30 ÷ 5 = 6, un nombre entier."},
     {q:"Quels sont tous les diviseurs de 10 ?", c:["1, 2, 5, 10","2, 5","1, 2, 5","10, 20, 30"], rep:"1, 2, 5, 10"},
     {q:"4 est-il un diviseur de 18 ?", c:ON, rep:"Non", ex:"18 ÷ 4 ne tombe pas juste (4 × 4 = 16, 4 × 5 = 20)."} ],
 2:[ {q:"Quels sont tous les diviseurs de 24 ?", c:["1, 2, 3, 4, 6, 8, 12, 24","2, 3, 4, 6, 8, 12","1, 2, 4, 6, 12, 24","1, 2, 3, 4, 6, 12, 24"], rep:"1, 2, 3, 4, 6, 8, 12, 24"},
     {q:"Combien 36 a-t-il de diviseurs ?", rep:"9", ex:"1, 2, 3, 4, 6, 9, 12, 18, 36."},
     {q:"Quel est le plus grand diviseur de 45, autre que 45 ?", rep:"15", ex:"45 = 3 × 15."} ],
 3:[ {q:"Quels sont les diviseurs communs à 16 et 28 ?", c:["1, 2, 4","1, 2, 4, 8","2, 4, 7","1, 4"], rep:"1, 2, 4"},
     {q:"Quels sont les diviseurs communs à 12 et 18 ?", c:["1, 2, 3, 6","1, 2, 3, 4, 6","2, 3, 6","1, 6"], rep:"1, 2, 3, 6"},
     {q:"Quel est le plus grand diviseur commun à 48 et 72 ?", rep:"24", ex:"Diviseurs communs à 48 et 72 : 1, 2, 3, 4, 6, 8, 12, 24."} ]
}},
{nom:"Multiple, diviseur, divisible", q:{
 1:[ {q:"Comme 30 = 5 × 6, quelle phrase est juste ?", c:["30 est un multiple de 5","30 est un diviseur de 5","5 est un multiple de 30"], rep:"30 est un multiple de 5"},
     {q:"Comme 30 = 5 × 6, quelle phrase est juste ?", c:["5 est un diviseur de 30","5 est divisible par 30","30 est un diviseur de 5"], rep:"5 est un diviseur de 30"} ],
 2:[ {q:"Quelle phrase est juste ?", c:["30 est divisible par 5","5 est divisible par 30","30 est un diviseur de 5"], rep:"30 est divisible par 5"},
     {q:"« 7 est un diviseur de 42 » veut dire la même chose que :", c:["42 est un multiple de 7","7 est un multiple de 42","42 est un diviseur de 7"], rep:"42 est un multiple de 7"} ],
 3:[ {q:"Combien de ces phrases sont justes ? « 8 divise 56 » · « 56 est un multiple de 8 » · « 56 est divisible par 8 » · « 8 est un multiple de 56 »", c:["3","2","4","1"], rep:"3", ex:"Seule la dernière est fausse : 8 × 7 = 56."},
     {q:"Vrai ou faux : 1 est un diviseur de tous les nombres entiers.", c:VF, rep:"Vrai", ex:"N'importe quel nombre divisé par 1 donne lui-même."} ]
}},
{nom:"Division euclidienne", q:{
 1:[ {q:"Dans la division euclidienne de 135 par 6, le quotient est 22. Quel est le reste ?", rep:"3", ex:"6 × 22 = 132 et 135 − 132 = 3."},
     {q:"Dans « 6 × 22 + 3 = 135 », quel nombre est le dividende ?", c:["135","6","22","3"], rep:"135"},
     {q:"Complète l'égalité de la division de 47 par 5.", t:"5 × □ + □ = 47", r:["9","2"], ex:"5 × 9 = 45, et il reste 2 (plus petit que 5)."} ],
 2:[ {q:"Complète l'égalité de la division de 186 par 15.", t:"15 × □ + □ = 186", r:["12","6"], ex:"15 × 12 = 180, et il reste 6 (plus petit que 15)."},
     {q:"Quel est le reste de la division euclidienne de 100 par 7 ?", rep:"2", ex:"7 × 14 = 98 et 100 − 98 = 2."},
     {q:"Laquelle de ces égalités traduit une division euclidienne par 8 ?", c:["8 × 12 + 5 = 101","8 × 12 + 9 = 105","8 × 11 + 17 = 105","12 × 8 − 3 = 93"], rep:"8 × 12 + 5 = 101", ex:"Le reste doit être plus petit que le diviseur 8."} ],
 3:[ {q:"Complète l'égalité de la division de 1 647 par 8.", t:"8 × □ + □ = 1 647", r:["205","7"], ex:"8 × 205 = 1 640 et il reste 7."},
     {q:"389 élèves en équipes de 14 : combien d'équipes complètes ?", rep:"27", ex:"14 × 27 = 378 et il reste 11 élèves."},
     {q:"186 élèves en équipes de 15 : combien d'élèves manque-t-il pour une équipe de plus ?", rep:"9", ex:"15 × 12 + 6 = 186 : il reste 6 élèves, il en manque 15 − 6 = 9."} ]
}},
{nom:"Problèmes de partage", q:{
 1:[ {q:"Un capitaine partage 28 pièces d'or entre ses marins, sans qu'il en reste. Le nombre de marins est forcément :", c:["un diviseur de 28","un multiple de 28","n'importe quel nombre"], rep:"un diviseur de 28"},
     {q:"28 pièces d'or sont partagées équitablement entre 7 marins. Combien chacun en reçoit-il ?", rep:"4"} ],
 2:[ {q:"36 crêpes ont été partagées équitablement. Lequel de ces nombres de personnes est impossible ?", c:["8","9","12","4"], rep:"8", ex:"36 ÷ 8 ne tombe pas juste : 8 n'est pas un diviseur de 36."},
     {q:"Avec 12 roses rouges et 18 roses blanches, peut-on faire 4 bouquets identiques en utilisant toutes les fleurs ?", c:ON, rep:"Non", ex:"4 divise 12, mais pas 18."} ],
 3:[ {q:"16 croissants et 28 pains au chocolat sont répartis dans 4 corbeilles identiques. Complète.", t:"Chaque corbeille : □ croissants et □ pains au chocolat", r:["4","7"]},
     {q:"16 croissants et 28 pains au chocolat : combien de nombres de corbeilles identiques sont possibles (en comptant 1 seule corbeille) ?", c:["3","2","4","6"], rep:"3", ex:"Les diviseurs communs à 16 et 28 : 1, 2 et 4."},
     {q:"162 pommiers sont plantés en 9 rangées égales. Complète.", t:"□ pommiers par rangée", r:["18"], ex:"9 × 18 = 162."} ]
}},
{nom:"Nombres premiers", q:{
 1:[ {q:"Combien de diviseurs a un nombre premier ?", c:["Exactement 2","Exactement 1","Au moins 3"], rep:"Exactement 2", ex:"1 et lui-même."},
     {q:"7 est-il un nombre premier ?", c:ON, rep:"Oui", ex:"Ses seuls diviseurs sont 1 et 7."},
     {q:"9 est-il un nombre premier ?", c:ON, rep:"Non", ex:"9 est divisible par 3."} ],
 2:[ {q:"1 est-il un nombre premier ?", c:ON, rep:"Non", ex:"Il n'a qu'un seul diviseur."},
     {q:"Lequel de ces nombres est premier ?", c:["23","21","27","25"], rep:"23", ex:"21 = 3 × 7, 27 = 3 × 9, 25 = 5 × 5."},
     {q:"Combien y a-t-il de nombres premiers inférieurs à 20 ?", rep:"8", ex:"2, 3, 5, 7, 11, 13, 17, 19."} ],
 3:[ {q:"Vrai ou faux : tous les nombres premiers sont impairs.", c:VF, rep:"Faux", ex:"2 est premier et pair."},
     {q:"Lequel de ces nombres n'est pas premier ?", c:["51","41","43","47"], rep:"51", ex:"5 + 1 = 6 : 51 est divisible par 3 (51 = 3 × 17)."},
     {q:"Quel est le plus petit nombre premier supérieur à 30 ?", rep:"31"} ]
}}
],
eval: EVAL5
};
})();
