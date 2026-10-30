/* 5e · chapitre 17 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres.
   Les tracés et les positions de la correction sont obtenus en exécutant les scripts. */
TRAIN["5e-17"] = function(){
const {ri, pick, shuf} = TR;
const {HAT, PEN, av, td, tg, go, or, rep, TXT, script, run, trace, F, P} = window.SCR;
const UP={x:0,y:0,dir:0}, RIGHT={x:0,y:0,dir:90};
const NOM = {3:"triangle équilatéral",4:"carré",5:"pentagone régulier",6:"hexagone régulier",8:"octogone régulier",9:"ennéagone régulier",10:"décagone régulier",12:"dodécagone régulier"};
const dirTxt = d => ({0:"vers le haut",90:"vers la droite",180:"vers le bas","-90":"vers la gauche"})[d];

/* ===== I. Lire et prévoir ===== */
/* Exercice 1 : un rectangle (le lutin part vers le haut) */
let L1, l1; do{ L1=25*ri(2,5); l1=25*ri(1,4); }while(L1===l1);
const S1 = [HAT, PEN, av(L1), td(90), av(l1), td(90), av(L1), td(90), av(l1)];
/* Exercice 2 : position et direction */
const d2 = pick([90,0,-90,180]), t2a = pick([td,tg]), t2b = pick([td,tg]);
const S2 = [HAT, go(0,0), or(d2), av(10*ri(2,9)), t2a(90), av(10*ri(2,6)), t2b(180), av(10*ri(5,12))];
const st2 = run(S2).steps.slice(2);
const head2 = `<thead><tr><th>Après le bloc…</th>${st2.map(s=>`<th>${TXT(s.b).replace(/ pas$| degrés$/,"")}</th>`).join("")}</tr></thead>`;
/* Exercice 3 : quel dessin ? */
const [n3a,n3b] = shuf([3,4,6]).slice(0,2), c3a = 20*ri(2,4), c3b = 20*ri(2,4);
const S3a = [HAT, PEN, rep(n3a,[av(c3a),td(360/n3a)])], S3b = [HAT, PEN, rep(n3b,[av(c3b),td(360/n3b)])];
/* Exercice 4 : compléter un script */
const P4 = shuf([3,4,5,6,8]).slice(0,3).map(n=>[n, 10*ri(3,12)]);
const secA = {t:"I — Lire et prévoir", e:[
  {n:"Exercice 1", t:"Lire un script", w:"Sur ton cahier", h:`<p>Le lutin part de (0 ; 0), orienté vers le haut (direction 0). Sur ton cahier à petits carreaux : 1 carreau pour 25 pas.</p>${script(S1)}<p><b>1)</b> Dessine la trace laissée par le lutin.</p><p><b>2)</b> Quelle est la nature de la figure tracée ? Quels sont les paramètres de ce script ?</p>`,
   c:`${trace(S1,{start:UP,g:25,k:1.4})}<p><b>1)</b> Le lutin avance de ${L1} pas vers le haut, tourne vers la droite, avance de ${l1} pas, descend de ${L1} pas, puis revient de ${l1} pas vers la gauche.</p><p><b>2)</b> C'est un <b>rectangle</b> de ${L1} pas sur ${l1} pas.</p><p>Les <b>paramètres</b> sont les longueurs (${L1} et ${l1}) et l'angle (90°).</p>`},
  {n:"Exercice 2", t:"Position et direction", w:"Sur ton cahier", h:`<p>Le lutin exécute le script ci-dessous. Recopie et complète le tableau.</p>${script(S2)}<div class="scroll"><table class="std">${head2}<tbody><tr><th>Position (<i>x</i> ; <i>y</i>)</th>${st2.map(()=>"<td></td>").join("")}</tr><tr><th>Direction</th>${st2.map(()=>"<td></td>").join("")}</tr></tbody></table></div>`,
   c:`<div class="scroll"><table class="std">${head2}<tbody><tr><th>Position (<i>x</i> ; <i>y</i>)</th>${st2.map(s=>`<td><b>${P(s.x,s.y)}</b></td>`).join("")}</tr><tr><th>Direction</th>${st2.map(s=>`<td><b>${F(s.dir)}</b></td>`).join("")}</tr></tbody></table></div><p>Le lutin part ${dirTxt(d2)}, puis il est orienté ${dirTxt(st2[1].dir)}, puis ${dirTxt(st2[3].dir)} (demi-tour).</p>`},
  {n:"Exercice 3", t:"Quel dessin ?", w:"Sur ton cahier", h:`<p>Le lutin part de (0 ; 0) orienté vers la droite (direction 90).</p><p>Pour chaque script, dessine la trace obtenue (1 carreau pour 20 pas) et donne le nom de la figure.</p><div class="figs"><figure><figcaption>Script 1</figcaption>${script(S3a)}</figure><figure><figcaption>Script 2</figcaption>${script(S3b)}</figure></div>`,
   c:`<div class="figs"><figure><figcaption>Script 1</figcaption>${trace(S3a,{start:RIGHT,g:20,k:1.8})}</figure><figure><figcaption>Script 2</figcaption>${trace(S3b,{start:RIGHT,g:20,k:1.8})}</figure></div><p><b>Script 1 :</b> un <b>${NOM[n3a]}</b> de côté ${c3a} pas (rotation de 360 ÷ ${n3a} = ${360/n3a}°).</p><p><b>Script 2 :</b> un <b>${NOM[n3b]}</b> de côté ${c3b} pas (rotation de 360 ÷ ${n3b} = ${360/n3b}°).</p>`},
  {n:"Exercice 4", t:"Compléter un script", w:"Sur ton cahier", h:`<p>Pour chaque figure, donne les paramètres du script : répéter …… fois ; avancer de …… pas ; tourner de …… degrés.</p>${P4.map(([n,c],i)=>`<p><b>${"abc"[i]})</b> Un ${NOM[n]} de côté ${c} pas.</p>`).join("")}`,
   c:P4.map(([n,c],i)=>`<p><b>${"abc"[i]})</b> répéter <b>${n}</b> fois ; avancer de <b>${c}</b> pas ; tourner de {360/${n}} = <b>${360/n}</b> degrés.</p>`).join("")}
 ]};

/* ===== II. Modifier et analyser ===== */
const N5 = shuf([3,4,5,6,8,9,10,12]).slice(0,6).sort((a,b)=>a-b);
const c6 = 10*ri(3,8);
const T6 = shuf([4,8,3,5,6]).slice(0,4).map(n=>[n, n===4 ? c6*2 : 10*ri(3,9)]);
const a7 = pick([70,80,100,110]), c7 = pick([50,75,100]);
const S7 = [HAT, PEN, rep(4,[av(c7),td(a7)])];
const n8 = 10*ri(2,8), m8 = 10*ri(2,8), t8 = pick([td,tg]);
const S8A = [HAT, PEN, av(n8), t8(90), av(m8)], S8B = [HAT, PEN, t8(90), av(n8), av(m8)];
const RA = run(S8A,RIGHT), RB = run(S8B,RIGHT);
const secB = {t:"II — Modifier et analyser", e:[
  {n:"Exercice 5", t:"Les angles des polygones réguliers", w:"Sur ton cahier", h:`<p>Pour tracer un polygone régulier à <i>n</i> côtés, le lutin tourne de {360/n} degrés à chaque sommet. Recopie et complète le tableau.</p><div class="scroll"><table class="std"><tbody><tr><th>Nombre de côtés <i>n</i></th>${N5.map(n=>`<td>${n}</td>`).join("")}</tr><tr><th>Angle de rotation (°)</th>${N5.map(()=>"<td></td>").join("")}</tr></tbody></table></div><p>Que vaut la somme des angles de rotation du lutin ?</p>`,
   c:`<div class="scroll"><table class="std"><tbody><tr><th>Nombre de côtés <i>n</i></th>${N5.map(n=>`<td>${n}</td>`).join("")}</tr><tr><th>Angle de rotation (°)</th>${N5.map(n=>`<td><b>${360/n}</b></td>`).join("")}</tr></tbody></table></div><p>La somme est toujours <i>n</i> × {360/n} = <b>360°</b> : un tour complet.</p>`},
  {n:"Exercice 6", t:"Modifier les paramètres", w:"Sur ton cahier", h:`<p>Voici un script qui trace un carré de côté ${c6} pas.</p>${script([HAT,PEN,rep(4,[av(c6),td(90)])])}<p>Indique les paramètres à modifier (et leurs nouvelles valeurs) pour obtenir :</p>${T6.map(([n,c],i)=>`<p><b>${"abcd"[i]})</b> un ${NOM[n]} de côté ${c} pas${i===T6.length-1?".":" ;"}</p>`).join("")}`,
   c:T6.map(([n,c],i)=>`<p><b>${"abcd"[i]})</b> ${n===4?`On remplace ${c6} par ${c} : « avancer de <b>${c}</b> pas » (le reste ne change pas).`:`« répéter <b>${n}</b> fois », « avancer de <b>${c}</b> pas », « tourner de {360/${n}} = <b>${360/n}</b> degrés ».`}</p>`).join("")},
  {n:"Exercice 7", t:"Trouver l'erreur", w:"Sur ton cahier", h:`<p>Lou veut tracer un carré de côté ${c7} pas. Voici son script.</p>${script(S7)}<p><b>a)</b> Dessine la figure que trace réellement ce script (1 carreau pour 25 pas).</p><p><b>b)</b> Quelle erreur Lou a-t-elle commise ? Corrige son script.</p>`,
   c:`${trace(S7,{start:RIGHT,g:25,size:240})}<p><b>a)</b> La figure <b>n'est pas un carré</b> : le lutin tourne de ${a7}° au lieu de 90°.</p><p>Après 4 côtés, il a tourné de 4 × ${a7} = ${4*a7}° et non de 360° : il n'est pas revenu à son point de départ.</p><p><b>b)</b> Il faut « tourner ↻ de <b>90</b> degrés » (car {360/4} = 90).</p>`},
  {n:"Exercice 8", t:"L'ordre des blocs", w:"Sur ton cahier", h:`<p>Le lutin part de (0 ; 0), orienté vers la droite (direction 90).</p><div class="figs"><figure><figcaption>Script A</figcaption>${script(S8A)}</figure><figure><figcaption>Script B</figcaption>${script(S8B)}</figure></div><p><b>a)</b> Pour chaque script, donne la position finale du lutin.</p><p><b>b)</b> Les deux scripts contiennent les mêmes blocs. Que peut-on en conclure ?</p>`,
   c:`<p><b>a)</b> Script A : le lutin avance jusqu'en (${n8} ; 0), tourne ${dirTxt(RA.dir)} et avance de ${m8} pas : il termine en <b>${P(RA.x,RA.y)}</b>.</p><p>Script B : le lutin tourne d'abord ${dirTxt(RB.dir)}, puis avance de ${n8} + ${m8} = ${n8+m8} pas : il termine en <b>${P(RB.x,RB.y)}</b>.</p><p><b>b)</b> <b>L'ordre des blocs compte</b> : avec les mêmes blocs dans un ordre différent, on n'obtient pas le même résultat.</p>`}
 ]};

/* ===== III. Tracer des figures ===== */
const [n9,a9,nom9] = pick([[5,144,"une étoile à cinq branches"],[8,135,"une étoile à huit branches"],[9,160,"une étoile à neuf branches"],[10,108,"une étoile à dix branches"],[12,150,"une étoile à douze branches"]]);
const S9 = [HAT, PEN, rep(n9,[av(100),td(a9)])];
let L10, l10; do{ L10=10*ri(5,12); l10=10*ri(3,8); }while(L10<=l10);
const S10 = [HAT, PEN, rep(2,[av(L10),td(90),av(l10),td(90)])];
const c11 = 10*ri(4,9);
const S11sq = [HAT, PEN, rep(4,[av(c11),td(90)])], S11 = [...S11sq, av(c11), td(30), rep(3,[av(c11),td(120)])];
const R11 = run(S11sq, UP);
const secC = {t:"III — Tracer des figures", e:[
  {n:"Exercice 9", t:"Une étoile", w:"Sur ton cahier", h:`<p>Le lutin part de (0 ; 0) orienté vers la droite. Voici un script :</p>${script(S9)}<p><b>a)</b> Calcule l'angle total dont le lutin a tourné pendant le script. Combien cela fait-il de tours complets ?</p><p><b>b)</b> Prévois la figure obtenue, puis vérifie avec Scratch.</p>`,
   c:`<p><b>a)</b> ${n9} × ${a9} = <b>${n9*a9} degrés</b>, soit ${n9*a9} ÷ 360 = <b>${n9*a9/360} tours complets</b>.</p><p><b>b)</b> Le lutin trace <b>${nom9}</b> ; il revient à son point de départ.</p>${trace(S9,{start:RIGHT,size:220})}`},
  {n:"Exercice 10", t:"Tracer un rectangle", w:"Sur ton cahier", h:`<p>Écris un script (avec la boucle « répéter ») qui trace un rectangle de ${L10} pas de longueur et de ${l10} pas de largeur.</p><p>Le lutin part orienté vers la droite.</p>`,
   c:`<div class="figs">${script(S10)}${trace(S10,{start:RIGHT,size:220})}</div><p>Il faut répéter <b>2 fois</b> les 4 blocs « avancer de ${L10} », « tourner de 90 », « avancer de ${l10} », « tourner de 90 ».</p>`},
  {n:"Exercice 11", t:"La maison", w:"Sur ton cahier", h:`<p>On veut dessiner une maison : un carré de côté ${c11} pas surmonté d'un triangle équilatéral de même côté.</p><p>Le lutin part de (0 ; 0) orienté vers le haut (direction 0).</p><p><b>a)</b> Écris un script qui trace le carré. Où et dans quelle direction le lutin se retrouve-t-il à la fin ?</p><p><b>b)</b> Complète le script pour tracer le toit.</p>`,
   c:`<p><b>a)</b> « répéter 4 fois : avancer de ${c11} pas, tourner ↻ de 90 degrés ».</p><p>Le lutin revient en <b>${P(R11.x,R11.y)}</b>, orienté <b>${dirTxt(R11.dir)}</b> (direction ${F(R11.dir)}).</p><p><b>b)</b> Avancer de ${c11} pas, tourner ↻ de 30°, puis répéter 3 fois « avancer de ${c11} pas, tourner ↻ de 120 degrés ».</p><div class="figs">${script(S11)}${trace(S11,{start:UP,size:220})}</div>`}
 ]};

return [secA, secB, secC];
};
