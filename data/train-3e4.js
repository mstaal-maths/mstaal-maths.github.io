/* 3e · chapitre 4 — fiche d'entraînement : les exercices de la fiche de M. Staal (volumes), avec d'autres nombres.
   Corrections calculées à partir des mêmes valeurs (outils window.VOL3 de data/3e-4.js). */
TRAIN["3e-4"] = function(){
const {ri, pick, shuf} = TR;
const {F, rd, piF, safe, cylSVG, coneSVG, bouleSVG, paveSVG, pyrSVG} = window.VOL3;
const PI=Math.PI, fig=(cap,body)=>`<figure>${body}${cap?`<figcaption>${cap}</figcaption>`:""}</figure>`;
const draw=(f,ok)=>{ for(let g=0;g<300;g++){ const v=f(); if(ok(v)) return v; } return f(); };

/* ===== Reconnaître ===== */
const DESC=shuf([["2 bases qui sont des disques identiques et 1 face latérale qui est un rectangle","un cylindre"],["2 bases qui sont des polygones identiques et des faces latérales rectangulaires","un prisme droit"],["1 base qui est un polygone et des faces latérales qui sont des triangles","une pyramide"],["1 base qui est un disque et 1 face latérale qui est une portion de disque","un cône"],["6 faces carrées","un cube"],["6 faces rectangulaires","un pavé droit"]]).slice(0,4);
const COMP=shuf([["une glace : un cône surmonté d'une demi-boule","un cône et une demi-boule"],["un silo : un cylindre posé sur un cône","un cylindre et un cône"],["une cuve : un cube posé sur une pyramide à base carrée","un cube et une pyramide"],["un plot : un cylindre surmonté d'une demi-boule","un cylindre et une demi-boule"],["une maison : un pavé droit surmonté d'un prisme droit à base triangulaire","un pavé droit et un prisme droit"]]).slice(0,3);
/* ===== Activité 2 ===== */
const ca=ri(2,9), rL=ri(4,12), rl=draw(()=>ri(2,9),x=>x!==rL), cu=ri(2,9), [pL,pl,ph]=[ri(3,12),ri(2,8),ri(2,10)];
/* ===== Volumes ===== */
const bd=2*ri(3,12), br=bd/2;                                  /* boule */
const te={b:ri(8,25)/10, h:ri(6,20)/10, L:ri(15,40)/10};        /* tente */
const si={r:ri(2,5), h:ri(4,10), hc:ri(10,40)/10};              /* silo */
const qu=draw(()=>({r:ri(2,5), h:ri(12,30)}), o=>safe(PI*(o.r*o.r*o.h+4/3*o.r**3),1));
const cv={c:ri(3,8), H:0}; cv.H=rd(cv.c+ri(10,50)/10,2);        /* cuve */
const pl2=draw(()=>({r:ri(10,30), h:ri(20,60)}), o=>safe(PI*(o.r*o.r*o.h+2/3*o.r**3),0));
const ra={p:ri(15,30)/10, w:ri(10,20)/10, h:ri(3,8)/10, s:ri(30,60)/10};
const ea=draw(()=>({r:ri(6,12), h:ri(12,25), d:2*ri(2,5)}), o=>o.d<2*o.r && o.d<o.h && safe(PI*(o.r*o.r*o.h-4/3*(o.d/2)**3),1));
/* ===== Conversions ===== */
const pv=ri(20000,99000), qv=ri(3000,9999)/10, gl=pick([20,25,33,50]), bt=pick([1,1.5,2]), [bL,bl,bh]=[pick([150,160,170,180]),pick([70,75,80]),pick([45,50,55,60])];
/* ===== Problèmes ===== */
const co=draw(()=>({h:ri(9,16), r:ri(20,35)/10}), o=>safe(PI*(o.r*o.r*o.h/3+2/3*o.r**3)/10,0));
const pi={d:ri(4,6), L:ri(8,14), t:ri(20,40)/10, p:ri(10,15)/10};
const cp={a:ri(30,45), b:ri(60,75), h:ri(40,50), L:ri(60,80), H:ri(100,120)};
const b1=ri(2,9), b2=2*ri(2,8);

/* calculs */
const piV=(x,d=1)=>F(x,d);
const Vq=[qu.r*qu.r*qu.h, 4*qu.r**3/3], Vtot=Vq[0]+Vq[1];
const Vpl=[pl2.r*pl2.r*pl2.h, 2*pl2.r**3/3];
const Vea=[ea.r*ea.r*ea.h, 4*(ea.d/2)**3/3];
const Vco=[co.r*co.r*co.h/3, 2*co.r**3/3];
const piA=[(pi.d/2)**2*pi.p/2, pi.L*pi.d*pi.p, pi.d*pi.t/2*pi.p];
const cpA=(cp.a+cp.b)*cp.h/2, cpV=[cpA*cp.L, cp.L*cp.b*(cp.H-cp.h)];

return [
 {t:"Reconnaître des solides", e:[
  {n:"Activité 1", t:"Reconnaître des solides", w:"Sur ton cahier", h:`<p>Donne la nature de chaque solide.</p>${DESC.map(([d],i)=>`<p><b>${i+1})</b> Un solide qui a ${d}.</p>`).join("")}`,
   c:DESC.map(([,s],i)=>`<p><b>${i+1})</b> C'est <b>${s}</b>.</p>`).join("")},
  {n:"Exercice 2", t:"Reconnaître des solides composés", w:"Sur ton cahier", h:`<p>Indique la nature des solides qui composent chaque objet.</p>${COMP.map(([d],i)=>`<p><b>${i+1})</b> ${d.split(" : ")[0][0].toUpperCase()+d.split(" : ")[0].slice(1)}.</p>`).join("")}`,
   c:COMP.map(([,s],i)=>`<p><b>${i+1})</b> ${s}.</p>`).join("")}
 ]},
 {t:"Rappels : périmètres, aires et volumes", e:[
  {n:"Activité 2", t:"Périmètres, aires et volumes", w:"Sur ton cahier", h:`<p><b>a)</b> Calcule le périmètre et l'aire d'un carré de ${ca} cm de côté.</p><p><b>b)</b> Calcule le périmètre et l'aire d'un rectangle de ${rL} cm sur ${rl} cm.</p><p><b>c)</b> Calcule le volume d'un cube de ${cu} cm d'arête.</p><p><b>d)</b> Calcule le volume d'un pavé droit de ${pL} cm × ${pl} cm × ${ph} cm.</p>`,
   c:`<p><b>a)</b></p><p class="calc">P = 4 × ${ca}<br>P = ${4*ca} cm<br>A = ${ca} × ${ca}<br>A = ${ca*ca} cm²</p><p><b>b)</b></p><p class="calc">P = 2 × ${rL} + 2 × ${rl}<br>P = ${2*rL+2*rl} cm<br>A = ${rL} × ${rl}<br>A = ${rL*rl} cm²</p><p><b>c)</b></p><p class="calc">V = ${cu} × ${cu} × ${cu}<br>V = ${cu**3} cm³</p><p><b>d)</b></p><p class="calc">V = ${pL} × ${pl} × ${ph}<br>V = ${F(pL*pl*ph)} cm³</p>`}
 ]},
 {t:"Calculer des volumes", e:[
  {n:"Exercice 1", t:"Le volume d'une boule", w:"Sur ton cahier", h:`<p>Calcule, en cm³, le volume d'une boule de diamètre ${bd} cm. Donne sa valeur exacte et son arrondi au dixième.</p>`,
   c:`<p class="calc">${bd} ÷ 2 = ${br} : le rayon est ${br} cm.<br>V = {4/3} × π × ${br}³<br>V = ${piF(4*br**3,3)} cm³<br>V ≈ ${F(4/3*PI*br**3,1)} cm³</p>`},
  {n:"Exercice 2", t:"Le volume d'une tente", w:"Sur ton cahier", h:`<p>Une tente a la forme d'un prisme droit. Sa base est un triangle de base ${F(te.b)} m et de hauteur ${F(te.h)} m. La tente est longue de ${F(te.L)} m.</p><p>Calcule son volume.</p>`,
   c:`<p class="calc">A<sub>base</sub> = {${F(te.b)} × ${F(te.h)}/2}<br>A<sub>base</sub> = ${F(te.b*te.h/2)} m²<br>V = ${F(te.b*te.h/2)} × ${F(te.L)}<br>V = ${F(te.b*te.h/2*te.L,4)} m³</p>`},
  {n:"Exercice 3", t:"Le silo à grain", w:"Sur ton cahier", h:`<p>Un silo à grain est composé d'un cylindre de ${si.r} m de rayon et de ${si.h} m de hauteur, et d'un cône de même rayon et de ${F(si.hc)} m de hauteur.</p><p>Calcule son volume en m³. Donne l'arrondi au centième.</p>`,
   c:`<p class="calc">V<sub>cylindre</sub> = π × ${si.r}² × ${si.h}<br>V<sub>cylindre</sub> = ${piF(si.r**2*si.h)} m³<br>V<sub>cône</sub> = {π × ${si.r}² × ${F(si.hc)}/3}<br>V<sub>cône</sub> = ${si.r**2*si.hc%3?`{${F(si.r**2*si.hc)}/3}π`:piF(si.r**2*si.hc/3)} m³<br>V<sub>silo</sub> = V<sub>cylindre</sub> + V<sub>cône</sub><br>V<sub>silo</sub> ≈ ${F(PI*si.r**2*(si.h+si.hc/3),2)} m³</p>`},
  {n:"Exercice 4", t:"Quille en bois", w:"Sur ton cahier", h:`<p>Une quille est formée d'un cylindre surmonté d'une boule, de même rayon ${qu.r} cm. Le cylindre mesure ${qu.h} cm de haut.</p><p>Calcule le volume de la quille, en cm³, arrondi au dixième.</p>`,
   c:`<p class="calc">V<sub>cylindre</sub> = π × ${qu.r}² × ${qu.h}<br>V<sub>cylindre</sub> = ${piF(Vq[0])} cm³<br>V<sub>boule</sub> = {4/3} × π × ${qu.r}³<br>V<sub>boule</sub> = ${piF(4*qu.r**3,3)} cm³<br>V = ${piF(Vq[0])} + ${piF(4*qu.r**3,3)}<br>V = ${piF(3*Vq[0]+4*qu.r**3,3)}<br>V ≈ ${F(PI*Vtot,1)} cm³</p>`},
  {n:"Exercice 5", t:"Cuve d'eau", w:"Sur ton cahier", h:`<p>Une cuve est formée d'un cube de ${cv.c} m d'arête posé sur une pyramide régulière à base carrée (de même côté).</p><p>La hauteur totale de la cuve est de ${F(cv.H,2)} m.</p><p>Calcule son volume en m³, arrondi au centième.</p>`,
   c:`<p class="calc">V<sub>cube</sub> = ${cv.c}³<br>V<sub>cube</sub> = ${cv.c**3} m³<br>Hauteur de la pyramide : ${F(cv.H,2)} − ${cv.c} = ${F(cv.H-cv.c,2)} m<br>V<sub>pyramide</sub> = {${cv.c} × ${cv.c} × ${F(cv.H-cv.c,2)}/3}<br>V<sub>pyramide</sub> ≈ ${F(cv.c**2*(cv.H-cv.c)/3,2)} m³<br>V<sub>cuve</sub> = V<sub>cube</sub> + V<sub>pyramide</sub><br>V<sub>cuve</sub> ≈ ${cv.c**3} + ${F(cv.c**2*(cv.H-cv.c)/3,2)}<br>V<sub>cuve</sub> ≈ ${F(cv.c**3+cv.c**2*(cv.H-cv.c)/3,2)} m³</p>`},
  {n:"Exercice 6", t:"Plot en béton", w:"Sur ton cahier", h:`<p>Un plot est formé d'un cylindre de ${pl2.h} cm de haut et de ${pl2.r} cm de rayon, surmonté d'une demi-boule de même rayon.</p><p>Calcule son volume en cm³, arrondi à l'unité.</p>`,
   c:`<p class="calc">V<sub>cylindre</sub> = π × ${pl2.r}² × ${pl2.h}<br>V<sub>cylindre</sub> = ${piF(Vpl[0])} cm³<br>V<sub>demi-boule</sub> = {4/3} × π × ${pl2.r}³ ÷ 2<br>V<sub>demi-boule</sub> = ${piF(2*pl2.r**3,3)} cm³<br>V = ${piF(Vpl[0])} + ${piF(2*pl2.r**3,3)}<br>V = ${piF(3*Vpl[0]+2*pl2.r**3,3)}<br>V ≈ ${F(PI*(Vpl[0]+Vpl[1]),0)} cm³</p>`},
  {n:"Exercice 7", t:"Rampe d'accès", w:"Sur ton cahier", h:`<p>Une rampe en béton de ${F(ra.w)} m de large est composée :</p><ul><li>d'un palier : un pavé droit de ${F(ra.p)} m de long et ${F(ra.h)} m de haut ;</li><li>d'une pente : un prisme droit dont la base est un triangle rectangle de ${F(ra.s)} m au sol et ${F(ra.h)} m de haut.</li></ul><p>Calcule le volume de béton nécessaire, en m³.</p>`,
   c:`<p class="calc">V<sub>pavé</sub> = ${F(ra.p)} × ${F(ra.w)} × ${F(ra.h)}<br>V<sub>pavé</sub> = ${F(ra.p*ra.w*ra.h)} m³<br>A<sub>base</sub> = {${F(ra.s)} × ${F(ra.h)}/2}<br>A<sub>base</sub> = ${F(ra.s*ra.h/2)} m²<br>V<sub>prisme</sub> = ${F(ra.s*ra.h/2)} × ${F(ra.w)}<br>V<sub>prisme</sub> = ${F(ra.s*ra.h/2*ra.w,4)} m³<br>V = V<sub>pavé</sub> + V<sub>prisme</sub><br>V = ${F(ra.p*ra.w*ra.h)} + ${F(ra.s*ra.h/2*ra.w,4)}<br>V = ${F(ra.p*ra.w*ra.h+ra.s*ra.h/2*ra.w,4)} m³</p>`},
  {n:"Exercice 8", t:"Quantité d'eau", w:"Sur ton cahier", h:`<p>Je pose une boule de diamètre ${ea.d} cm au fond d'un cylindre de rayon ${ea.r} cm et de hauteur ${ea.h} cm, puis je remplis entièrement le cylindre d'eau.</p><p>Quelle quantité d'eau, en cm³, ai-je versée ? Arrondis au dixième.</p>`,
   c:`<p class="calc">V<sub>cylindre</sub> = π × ${ea.r}² × ${ea.h}<br>V<sub>cylindre</sub> = ${piF(Vea[0])} cm³<br>Rayon de la boule : ${ea.d/2} cm<br>V<sub>boule</sub> = {4/3} × π × ${ea.d/2}³<br>V<sub>boule</sub> = ${piF(4*(ea.d/2)**3,3)} cm³<br>V<sub>eau</sub> = V<sub>cylindre</sub> − V<sub>boule</sub><br>V<sub>eau</sub> = ${piF(Vea[0])} − ${piF(4*(ea.d/2)**3,3)}<br>V<sub>eau</sub> = ${piF(3*Vea[0]-4*(ea.d/2)**3,3)}<br>V<sub>eau</sub> ≈ ${F(PI*(Vea[0]-Vea[1]),1)} cm³</p>`}
 ]},
 {t:"Conversions d'unités de volume et de contenance", e:[
  {n:"Exercice 9", t:"Problèmes de conversions", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> un plot a un volume de ${F(pv)} cm³. Quel est son volume en dm³ ?</p><p><b>Problème 2 :</b> une quille a un volume de ${F(qv)} cm³. Quel est son volume en dm³ ?</p><p><b>Problème 3 :</b> un verre contient ${gl} cL. Combien de verres pleins puis-je remplir avec une bouteille de ${F(bt)} L ?</p><p><b>Problème 4 :</b> une baignoire a les dimensions L = ${bL} cm, ℓ = ${bl} cm et h = ${bh} cm. Quelle quantité d'eau, en L, faut-il pour la remplir totalement ?</p>`,
   c:`<p>Rappel : 1 dm³ = 1 000 cm³ et 1 L = 1 dm³.</p><p><b>1)</b> ${F(pv)} ÷ 1 000 = ${F(pv/1000)}, donc ${F(pv)} cm³ = <b>${F(pv/1000)} dm³</b>.</p><p><b>2)</b> ${F(qv)} ÷ 1 000 = ${F(qv/1000,4)}, donc ${F(qv)} cm³ = <b>${F(qv/1000,4)} dm³</b>.</p><p><b>3)</b> ${F(bt)} L = ${F(bt*100)} cL ; ${F(bt*100)} ÷ ${gl} ${Math.abs(bt*100/gl-rd(bt*100/gl,2))>1e-9?"≈ "+F(bt*100/gl,2):"= "+F(bt*100/gl)} : <b>${Math.floor(bt*100/gl)} verres</b> pleins.</p><p><b>4)</b></p><p class="calc">V = ${bL} × ${bl} × ${bh}<br>V = ${F(bL*bl*bh)} cm³<br>V = ${F(bL*bl*bh/1000)} dm³<br>V = <b>${F(bL*bl*bh/1000)} L</b></p>`}
 ]},
 {t:"Problèmes", e:[
  {n:"Exercice 10", t:"Volume de glace dans un cornet", w:"Sur ton cahier", h:`<p>Un cornet est composé d'un cône de hauteur ${co.h} cm et de rayon ${F(co.r)} cm, surmonté d'une demi-boule de même rayon. Le cône est entièrement rempli de glace.</p><p>Quelle est la quantité de glace, en cL ? (Arrondi à l'unité.)</p>`,
   c:`<p class="calc">V<sub>cône</sub> = {π × ${F(co.r)}² × ${co.h}/3}<br>V<sub>cône</sub> ≈ ${F(PI*Vco[0],2)} cm³<br>V<sub>demi-boule</sub> = {4/3} × π × ${F(co.r)}³ ÷ 2<br>V<sub>demi-boule</sub> ≈ ${F(PI*Vco[1],2)} cm³<br>V ≈ ${F(PI*(Vco[0]+Vco[1]),2)} cm³<br>V ≈ ${F(PI*(Vco[0]+Vco[1])/10,3)} cL<br>V ≈ ${F(PI*(Vco[0]+Vco[1])/10,0)} cL</p>`},
  {n:"Exercice 11", t:"Volume d'eau dans une piscine", w:"Sur ton cahier", h:`<p>Une piscine de ${F(pi.p)} m de profondeur est composée d'un demi-cylindre de diamètre ${pi.d} m, d'un pavé droit de ${pi.L} m sur ${pi.d} m et d'un prisme droit dont la base est un triangle de base ${pi.d} m et de hauteur ${F(pi.t)} m.</p><p>Quel volume d'eau, en L, peut-on y mettre au maximum ? (Arrondi à l'unité.)</p>`,
   c:`<p class="calc">Demi-cylindre : π × ${F(pi.d/2)}² × ${F(pi.p)} ÷ 2 ≈ ${F(PI*piA[0],3)} m³<br>Pavé : ${pi.L} × ${pi.d} × ${F(pi.p)} = ${F(piA[1])} m³<br>Prisme : {${pi.d} × ${F(pi.t)}/2} × ${F(pi.p)} = ${F(piA[2])} m³<br>V ≈ ${F(PI*piA[0]+piA[1]+piA[2],3)} m³<br>V ≈ ${F((PI*piA[0]+piA[1]+piA[2])*1000,0)} L</p>`},
  {n:"Exercice 12", t:"Le composteur", w:"Sur ton cahier", h:`<p>Un composteur est formé d'un pavé droit surmonté d'un prisme droit de longueur ${cp.L} cm.</p><p>La base du prisme est un trapèze de petit côté ${cp.a} cm, de grand côté ${cp.b} cm et de hauteur ${cp.h} cm. Le pavé a pour dimensions ${cp.L} cm × ${cp.b} cm, et la hauteur totale du composteur est ${cp.H} cm.</p><p><b>a)</b> Calcule l'aire du trapèze.</p><p><b>b)</b> Calcule le volume du composteur, en m³.</p>`,
   c:`<p><b>a)</b></p><p class="calc">A = {(${cp.a} + ${cp.b}) × ${cp.h}/2}<br>A = ${F(cpA)} cm²</p><p><b>b)</b></p><p class="calc">V<sub>prisme</sub> = ${F(cpA)} × ${cp.L}<br>V<sub>prisme</sub> = ${F(cpV[0])} cm³</p><p>Hauteur du pavé : ${cp.H} − ${cp.h} = ${cp.H-cp.h} cm.</p><p class="calc">V<sub>pavé</sub> = ${cp.L} × ${cp.b} × ${cp.H-cp.h}<br>V<sub>pavé</sub> = ${F(cpV[1])} cm³</p><p class="calc">V = ${F(cpV[0]+cpV[1])} cm³<br>V = ${F((cpV[0]+cpV[1])/1e6,7)} m³</p>`},
  {n:"Exercice 13", t:"Calcul du volume de deux boules", w:"Sur ton cahier", h:`<p>Calcule le volume d'une boule de rayon ${b1} cm, puis d'une boule de diamètre ${b2} cm. Donne les valeurs exactes et les arrondis au dixième.</p>`,
   c:`<p class="calc">V<sub>1</sub> = {4/3} × π × ${b1}³<br>V<sub>1</sub> = ${piF(4*b1**3,3)}<br>V<sub>1</sub> ≈ ${F(4/3*PI*b1**3,1)} cm³<br>Rayon : ${b2} ÷ 2 = ${b2/2} cm<br>V<sub>2</sub> = {4/3} × π × ${b2/2}³<br>V<sub>2</sub> = ${piF(4*(b2/2)**3,3)}<br>V<sub>2</sub> ≈ ${F(4/3*PI*(b2/2)**3,1)} cm³</p>`}
 ]}
];
};
