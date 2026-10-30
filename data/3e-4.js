/* 3e — Chapitre 4 : Volumes
   Cours « Cours F1 », fiche « Exercices » et « Exercices - Corrigé » de M. Staal (dossier « 5 - Volumes »).
   Le dossier « 23 - Volumes » (découverte des formules du cube, du pavé, du prisme et du cylindre) est du niveau 5e/4e : il n'est pas repris.
   Images : celles des documents de M. Staal (img/3k4co, 3k4ex). Les solides du QCM, de la fiche d'entraînement et de l'évaluation sont dessinés en SVG (window.VOL3). */
(function(){
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const co=(p,alt,w)=>img("3k4co/"+p,alt,w), ex=(p,alt,w)=>img("3k4ex/"+p,alt,w);
const fig=(cap,body)=>`<figure>${body}${cap?`<figcaption>${cap}</figcaption>`:""}</figure>`;
const rd=(x,k=3)=>Math.round(x*10**k+1e-9)/10**k;
const F=(x,k=3)=>{ const r=rd(x,k); const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const PI=Math.PI, safe=(x,k)=>{ const t=x*10**k; return Math.abs(t-Math.floor(t)-0.5)>0.03; };
/* écriture d'un multiple de π : 84π, {500/3}π */
const gcd=(a,b)=>b?gcd(b,a%b):a;
const piF=(num,den=1)=>{ if(den<0){ num=-num; den=-den; } const isInt=Number.isInteger(num); if(isInt && den!==1){ const g=gcd(Math.abs(num),den); num/=g; den/=g; } return den===1?`${F(num)}π`:`{${F(num)}/${den}}π`; };

/* ------------------------------------------------------------------ solides en SVG (perspective cavalière) */
const T=(x,y,t,c)=>`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" style="font-size:15px;font-weight:700;fill:${c||"var(--ink)"}">${t}</text>`;
const LN=(x1,y1,x2,y2,d,c)=>`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" style="stroke:${c||"var(--ink)"};stroke-width:2;${d?"stroke-dasharray:6 4;":""}"/>`;
const svgW=(w,h,body,alt)=>`<svg class="fig" viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="${alt}">${body}</svg>`;
const BLUE="#1e5aa8", RED="#d0342c";
function cylSVG(lr,lh,alt){ const cx=110, rx=60, ry=16, top=30, bot=170; return svgW(250,215,
  `<ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" style="fill:none;stroke:var(--ink);stroke-width:2"/>`+
  `<path d="M${cx-rx} ${bot} A${rx} ${ry} 0 0 0 ${cx+rx} ${bot}" style="fill:none;stroke:var(--ink);stroke-width:2"/><path d="M${cx-rx} ${bot} A${rx} ${ry} 0 0 1 ${cx+rx} ${bot}" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-dasharray:6 4"/>`+
  LN(cx-rx,top,cx-rx,bot)+LN(cx+rx,top,cx+rx,bot)+LN(cx,bot,cx+rx,bot,0,RED)+LN(cx,top,cx,bot,1,BLUE)+T(cx+rx/2,bot+34,lr,RED)+T(cx+rx+30,(top+bot)/2,lh,BLUE), alt||"Cylindre"); }
function coneSVG(lr,lh,alt){ const cx=110, rx=62, ry=16, top=20, bot=170; return svgW(240,212,
  `<path d="M${cx-rx} ${bot} A${rx} ${ry} 0 0 0 ${cx+rx} ${bot}" style="fill:none;stroke:var(--ink);stroke-width:2"/><path d="M${cx-rx} ${bot} A${rx} ${ry} 0 0 1 ${cx+rx} ${bot}" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-dasharray:6 4"/>`+
  LN(cx-rx,bot,cx,top)+LN(cx+rx,bot,cx,top)+LN(cx,bot,cx+rx,bot,0,RED)+LN(cx,top,cx,bot,1,BLUE)+T(cx+rx/2,bot+34,lr,RED)+T(cx-62,(top+bot)/2+10,lh,BLUE), alt||"Cône de révolution"); }
function bouleSVG(lr,alt){ const cx=110, cy=100, r=80; return svgW(250,200,
  `<circle cx="${cx}" cy="${cy}" r="${r}" style="fill:none;stroke:var(--ink);stroke-width:2"/><path d="M${cx-r} ${cy} A${r} 20 0 0 0 ${cx+r} ${cy}" style="fill:none;stroke:var(--ink);stroke-width:1.6"/><path d="M${cx-r} ${cy} A${r} 20 0 0 1 ${cx+r} ${cy}" style="fill:none;stroke:var(--ink);stroke-width:1.6;stroke-dasharray:6 4"/>`+
  `<circle cx="${cx}" cy="${cy}" r="3" style="fill:var(--ink)"/>`+LN(cx,cy,cx+r*0.866,cy+r*0.5,0,RED)+`<text x="${cx+r*0.866+8}" y="${cy+r*0.5+18}" style="font-size:15px;font-weight:700;fill:${RED}">${lr}</text>`+T(cx-12,cy-6,"O"), alt||"Boule de centre O"); }
function paveSVG(lL,ll,lh,alt){ const x0=70, y0=170, L=150, H=100, dx=50, dy=-36; return svgW(320,205,
  `<polygon points="${x0},${y0} ${x0+L},${y0} ${x0+L},${y0-H} ${x0},${y0-H}" style="fill:none;stroke:var(--ink);stroke-width:2"/>`+
  LN(x0,y0-H,x0+dx,y0-H+dy)+LN(x0+L,y0-H,x0+L+dx,y0-H+dy)+LN(x0+L,y0,x0+L+dx,y0+dy)+LN(x0+dx,y0-H+dy,x0+L+dx,y0-H+dy)+LN(x0+L+dx,y0-H+dy,x0+L+dx,y0+dy)+
  LN(x0,y0,x0+dx,y0+dy,1)+LN(x0+dx,y0+dy,x0+L+dx,y0+dy,1)+LN(x0+dx,y0+dy,x0+dx,y0-H+dy,1)+T(x0+L/2,y0+20,lL)+T(x0+L+dx/2+22,y0+dy/2+8,ll)+T(x0-6,y0-H/2,lh).replace('text-anchor="middle"','text-anchor="end"'), alt||"Pavé droit"); }
function pyrSVG(lb,lh,alt){ const A=[20,170],B=[160,170],C=[210,130],D=[70,130],O=[115,150],S=[115,20]; return svgW(250,200,
  LN(...A,...B)+LN(...B,...C)+LN(...C,...D,1)+LN(...D,...A,1)+LN(...S,...A)+LN(...S,...B)+LN(...S,...C)+LN(...S,...D,1)+LN(...S,...O,1,BLUE)+T(90,190,lb)+T(132,90,lh,BLUE), alt||"Pyramide à base carrée"); }
window.VOL3={F, rd, piF, safe, gcd, cylSVG, coneSVG, bouleSVG, paveSVG, pyrSVG};

/* tableau de conversion des unités de volume et de contenance */
const UNIT=["km³","hm³","dam³","m³","dm³","cm³","mm³"];
const convTab=(rows=[])=>`<div class="scroll"><table class="std"><thead><tr>${UNIT.map(u=>`<th colspan="3">${u}</th>`).join("")}</tr><tr>${UNIT.map(u=>u==="m³"?`<td></td><td></td><td><b>kL</b></td>`:u==="dm³"?`<td><b>hL</b></td><td><b>daL</b></td><td><b>L</b></td>`:u==="cm³"?`<td><b>dL</b></td><td><b>cL</b></td><td><b>mL</b></td>`:"<td></td><td></td><td></td>").join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${Array.from({length:21},(_,i)=>`<td>${r[i]??""}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
/* « 4 700 cm³ » : les chiffres placés dans le tableau (colonne des unités de cm³ = indice 17) */
const C47=(()=>{ const r=[]; r[14]="4"; r[15]="7"; r[16]="0"; r[17]="0"; return r; })();
const C85=(()=>{ const r=[]; r[14]="8"; r[15]="5"; r[16]="0"; r[17]="0"; return r; })();
const C126=(()=>{ const r=[]; r[11]="0"; r[12]="1"; r[13]="2"; r[14]="6"; return r; })();

/* ===================== schémas ===================== */
const S_PR=sch("Volume = aire de la base × hauteur", `<div class="figs">${cylSVG("r","h")}${paveSVG("L","ℓ","h")}</div><p class="calc">Cube : V = c³ · Pavé : V = L × ℓ × h<br>Prisme droit : V = A<sub>base</sub> × h · Cylindre : V = π × r² × h</p>`);
const S_PY=sch("Pyramide et cône : on divise par 3", `<div class="figs">${pyrSVG("base","h")}${coneSVG("r","h")}</div><p class="calc">V = {aire de la base × hauteur/3}<br>Cône : V = {π × r² × h/3}</p>`);
const S_CV=sch("Unités de volume et de contenance", `<p class="calc">1 m³ = 1 000 dm³ · 1 dm³ = 1 000 cm³<br>1 L = 1 dm³ · 1 mL = 1 cm³ · 1 kL = 1 m³</p><p class="schN">D'une unité de volume à la suivante : × 1 000 ou ÷ 1 000 (3 chiffres par colonne).</p>`);
const S_BO=sch("La boule et la sphère", `${bouleSVG("r")}<p class="calc">V<sub>boule</sub> = {4/3} × π × r³</p><p class="schN">La sphère est la surface ; la boule est le solide (la surface et l'intérieur). Attention : on utilise le <b>rayon</b> (diamètre ÷ 2).</p>`);
const S_ME=sch("Méthode pour un solide composé", `<p class="schN"><b>1)</b> Reconnaître les solides. <b>2)</b> Retrouver les formules. <b>3)</b> Repérer les longueurs utiles. <b>4)</b> Calculer chaque volume, puis additionner (ou soustraire), en gardant les valeurs exactes jusqu'à la fin.</p>`);

/* ---------- générateurs ---------- */
const SOL=[["cube","V = c³"],["pavé droit","V = L × ℓ × h"],["prisme droit","V = A<sub>base</sub> × h"],["cylindre","V = π × r² × h"],["pyramide","V = {aire de la base × h/3}"],["cône","V = {π × r² × h/3}"],["boule","V = {4/3} × π × r³"]];
/* conversions : [valeur, unité de départ, unité d'arrivée] avec facteur */
const VU={"m³":1e3,"dm³":1,"cm³":1e-3,"mm³":1e-6,"kL":1e3,"hL":100,"daL":10,"L":1,"dL":0.1,"cL":0.01,"mL":0.001};
function conv(){ for(let g=0;g<200;g++){ const [a,b]=shuf(Object.keys(VU)).slice(0,2); if(VU[a]===VU[b]) continue; const ratio=VU[a]/VU[b]; if(ratio>1e6||ratio<1e-6) continue; const v=pick([ri(1,99),ri(1,999)/10,ri(1,99)/100,ri(100,9000)]); const r=v*ratio; if(r>=1e-4 && r<1e7 && rd(r,6)===rd(r,4)) return {v,a,b,r}; } return {v:4700,a:"cm³",b:"L",r:4.7}; }

CH["3e-4"] = {
intro:"Calculer le volume des solides (cube, pavé, prisme, cylindre, pyramide, cône et boule), convertir des unités de volume et de contenance, et résoudre des problèmes avec des solides composés.",
savoir:[
  "reconnaître un solide, sa (ou ses) base(s) et sa hauteur ;",
  "connaître les formules de volume du cube, du pavé droit, du prisme droit, du cylindre, de la pyramide et du cône ;",
  "connaître la définition de la sphère et de la boule, et la formule du volume d'une boule ;",
  "donner la valeur exacte (avec π) et une valeur approchée d'un volume ;",
  "convertir des unités de volume et de contenance (1 L = 1 dm³) ;",
  "calculer le volume d'un solide composé de plusieurs solides."
],

/* ===================== COURS ===================== */
cours:[
{k:"1", t:"Volumes (rappels)", h:`
  <div class="retenir" data-l="À retenir"><p class="calc"><b>Volume = aire de la base × hauteur</b></p><ul><li><b>Cube</b> : V = c³</li><li><b>Pavé droit</b> : V = L × ℓ × h</li><li><b>Prisme droit</b> : V = A<sub>base</sub> × h</li><li><b>Cylindre</b> : V = π × r² × h</li></ul></div>
  <div class="figs">${fig("Cube",co("cube.jpg","Cube",120))}${fig("Pavé droit",co("pave.jpg","Pavé droit de longueur L, largeur ℓ et hauteur h",150))}${fig("Prisme droit",co("prisme.png","Prisme droit de hauteur h",100))}${fig("Cylindre",co("cyl.png","Cylindre de rayon r et de hauteur h",110))}</div>
  <div class="retenir" data-l="À retenir"><p class="calc"><b>Volume = {aire de la base × hauteur/3}</b></p><ul><li><b>Pyramide</b> : V = {aire de la base × h/3}</li><li><b>Cône</b> : V = {π × r² × h/3}</li></ul></div>
  <div class="figs">${fig("Pyramide",co("pyr.png","Pyramide de hauteur h et de base B",150))}${fig("Cône",co("cone.png","Cône de révolution de sommet S, de centre de base O et de rayon OA",150))}</div>`},
{k:"2", t:"Unités de volume et de contenance", h:`
  ${convTab([[],[]])}
  <div class="retenir" data-l="Propriété"><p>Pour passer d'une unité de volume à une unité immédiatement voisine, on multiplie ou on divise par <b>1 000</b> (3 chiffres par colonne).</p></div>
  <div class="retenir" data-l="À connaître par cœur"><p class="calc"><b>1 L = 1 dm³</b></p></div>
  <p><b>Exemples de conversion :</b></p>
  <ul><li>4 700 cm³ = 4,7 dm³ = 4,7 L</li><li>8,5 L = 8,5 dm³ = 8 500 cm³</li><li>12,6 daL = 0,126 m³</li></ul>
  ${convTab([C47,C85,C126])}
  <p>Dans le tableau : 4 700 cm³ (1<sup>re</sup> ligne) ; 8 500 cm³ (2<sup>e</sup> ligne) ; 0,126 m³ = 126 L = 12,6 daL (3<sup>e</sup> ligne).</p>`},
{k:"3", t:"Sphère et boule", h:`
  <h4>a) Définitions</h4>
  ${co("sphere.png","Sphère de centre O et de rayon r",150)}
  <div class="retenir" data-l="Définitions"><p>Soit O un point et r un nombre positif.</p><ul><li>On appelle <b>sphère de centre O et de rayon r</b> l'ensemble de tous les points de l'espace qui sont situés à <b>une distance du point O égale à r</b>.</li><li>On appelle <b>boule de centre O et de rayon r</b> l'ensemble de tous les points de l'espace qui sont situés à <b>une distance du point O inférieure ou égale à r</b>.</li></ul></div>
  <div class="retenir" data-l="Remarques"><ul><li>La boule est un solide : c'est à la fois la surface et l'intérieur du solide.</li><li>La sphère est la surface de ce solide.</li></ul></div>
  <p><b>Exemples de sphères :</b> une balle de ping-pong, un globe, une bulle de savon…</p>
  <p><b>Exemples de boules :</b> une boule de pétanque, la Terre, une bille…</p>
  <h4>b) Volume</h4>
  <div class="retenir" data-l="Propriété"><p>Une <b>boule</b> de rayon r a pour volume :</p><p class="calc">V = {4/3} × π × r³</p><p>qu'on peut simplifier : V = {4/3}πr³.</p></div>
  <p><b>Exemple :</b> calcule le volume d'une boule de diamètre 10 cm. Donne la valeur exacte <b>et</b> la valeur approchée au dixième près en cm³.</p>
  <p class="calc">10 ÷ 2 = 5 : le rayon de la boule est de 5 cm.<br>V = {4/3} × π × 5³<br>V = {500/3}π<br>V ≈ 523,6 cm³</p>
  <p>La valeur exacte du volume de cette boule est {500/3}π cm³.</p><p>La valeur approchée au dixième près est 523,6 cm³.</p>`},
{k:"4", t:"Méthode pour calculer des volumes", h:`
  <div class="retenir" data-l="Méthode"><p>Pour calculer des volumes, il faut :</p><p><b>1)</b> reconnaître le (ou les) solide(s) (on peut s'aider d'un dessin à main levée) ;</p><p><b>2)</b> retrouver la formule pour calculer son volume ;</p><p><b>3)</b> repérer les longueurs dont on a besoin pour appliquer la formule ;</p><p><b>4)</b> donner la réponse dans la bonne unité et observer si on demande la valeur exacte ou un arrondi.</p></div>
  <h4>Exemple 1 : le volume d'une tente</h4>
  ${ex("tente.png","Tente en forme de prisme droit : base triangulaire de 1,20 m et de hauteur 0,90 m, longueur 2,10 m",200)}
  <p>Je calcule l'aire du triangle qui est la base du prisme droit :</p><p class="calc">A<sub>base</sub> = {b × h/2}<br>A<sub>base</sub> = {1,20 × 0,90/2}<br>A<sub>base</sub> = 0,54 m²</p>
  <p>Je calcule le volume de la tente, qui est un prisme droit :</p><p class="calc">V = A<sub>base</sub> × hauteur<br>V = 0,54 × 2,10<br>V = 1,134 m³</p>
  <h4>Exemple 2 : le volume d'un silo à grain</h4>
  ${ex("silo.png","Silo à grain : un cylindre posé sur un cône",130)}
  <p>Le silo est composé d'un cylindre de 3 m de rayon et de 7 m de hauteur et d'un cône de rayon 3 m et de 2,5 m de hauteur. On calcule son volume en m³, arrondi au centième.</p>
  <p class="calc">V<sub>cylindre</sub> = π × r² × h<br>V<sub>cylindre</sub> = π × 3² × 7<br>V<sub>cylindre</sub> = 63π m³<br>V<sub>cône</sub> = {π × r² × h/3}<br>V<sub>cône</sub> = {π × 3² × 2,5/3}<br>V<sub>cône</sub> = 7,5π m³<br>V<sub>silo</sub> = 63π + 7,5π<br>V<sub>silo</sub> = 70,5π<br>V<sub>silo</sub> ≈ 221,48 m³</p>
  <div class="attention"><b>Conseil :</b> on garde les valeurs exactes (avec π) jusqu'à la fin pour avoir le résultat le plus précis possible.</div>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Reconnaître des solides", e:[
  {n:"Activité 1", t:"Reconnaître des solides", w:"Sur ta feuille", h:`<p>Pour chaque solide :</p><ul><li>indique <b>sa nature</b> ;</li><li>hachure, au crayon de bois, <b>la (ou les) base(s)</b> et indique <b>la hauteur</b> en notant h.</li></ul>
   <div class="figs">${[1,2,3,4,5,6].map(k=>fig(k+") ……………",ex(`a1_${k}.png`,"Solide n°"+k,k===4?110:120))).join("")}</div>`,
   c:`<p>Les bases sont hachurées. La hauteur h est tracée en rouge.</p>
   <div class="figs">${[[1,"cylindre",130],[2,"prisme droit",130],[3,"pavé droit",110],[4,"pyramide",130],[5,"prisme droit",150],[6,"cône",140]].map(([k,t,w])=>fig(k+") "+t,ex(`a1_${k}c.png`,"Solide n°"+k+" corrigé : "+t+", bases hachurées et hauteur h",w))).join("")}</div>
   <p><b>1)</b> un <b>cylindre</b> (2 bases : des disques) · <b>2)</b> un <b>prisme droit</b> à base hexagonale (2 bases : des hexagones) · <b>3)</b> un <b>pavé droit</b> (2 bases : des rectangles) · <b>4)</b> une <b>pyramide</b> à base triangulaire (base ABC, hauteur [SC]) · <b>5)</b> un <b>prisme droit</b> à base triangulaire (bases ABC et DEF) · <b>6)</b> un <b>cône</b> de révolution (base : un disque).</p><p>Pour un prisme, un pavé ou un cylindre, la hauteur est la distance entre les deux bases ; pour une pyramide ou un cône, c'est la distance du sommet à la base.</p>`},
  {n:"Exercice 1", t:"Reconnaître des solides", w:"Sur ta feuille", h:`<p>Même consigne que l'activité 1.</p><div class="figs">${[1,2,3,4,5,6].map(k=>fig(k+") ……………",ex(`e1_${k}.png`,"Solide n°"+k,150))).join("")}</div>`,
   c:`<p>Les bases sont hachurées. La hauteur h est tracée en rouge.</p>
   <div class="figs">${[[1,"pyramide",190],[2,"prisme droit",160],[3,"cube",190],[4,"pyramide",170],[5,"prisme droit",150],[6,"demi-cylindre",190]].map(([k,t,w])=>fig(k+") "+t,ex(`e1_${k}c.png`,"Solide n°"+k+" corrigé : "+t+", bases hachurées et hauteur h",w))).join("")}</div>
   <p><b>1)</b> une <b>pyramide</b> à base rectangulaire ABDC (hauteur [EF]) · <b>2)</b> un <b>prisme droit</b> (bases : les deux faces en forme de « Z ») · <b>3)</b> un <b>cube</b> (2 bases : deux faces opposées, ici EFGH et ABCD) · <b>4)</b> une <b>pyramide</b> à base triangulaire (base BCD en jaune, hauteur [AH]) · <b>5)</b> un <b>prisme droit</b> (bases : les deux faces bleues) · <b>6)</b> un <b>demi-cylindre</b> (bases : deux demi-disques de diamètre 3 cm, hauteur 4 cm).</p>`},
  {n:"Exercice 2", t:"Reconnaître des solides composés", w:"Sur ta feuille", h:`<p>Ces solides sont composés de plusieurs solides. Indique la nature de chacun d'eux.</p><div class="figs">${fig("1)",ex("e2_1.png","Solide composé n°1",170))}${fig("2)",ex("e2_2.png","Solide composé n°2",200))}${fig("3)",ex("e2_3.png","Solide composé n°3",280))}</div>`,
   c:`<p><b>1)</b> un <b>pavé droit</b> ABCDEFGH surmontant une <b>pyramide</b> à base rectangulaire EFGH et de sommet I.</p><p><b>2)</b> un <b>cône</b> (à gauche), un <b>cylindre</b> (au milieu) et une <b>demi-boule</b> (à droite).</p><p><b>3)</b> un <b>demi-cylindre</b> (à gauche), un <b>pavé droit</b> (au milieu) et un <b>prisme droit</b> à base triangulaire (à droite).</p>`}
 ]},
{t:"Rappels : périmètres, aires et volumes", e:[
  {n:"Activité 2", t:"Calcul de périmètres, d'aires et de volumes (rappels)", w:"Sur ta feuille", h:`<p>Dans chaque cas, indique le ou les calcul(s) qui te permettent de répondre à la question et complète la phrase réponse.</p>
   <div class="figs">${fig("Le carré",ex("a2_carre.png","Carré de 3 cm de côté",110))}${fig("Le rectangle",ex("a2_rect.png","Rectangle de 5 cm sur 3 cm",180))}</div><p>Calcule le <b>périmètre</b> (longueur du contour) et l'<b>aire</b> (mesure de la surface intérieure) du carré et du rectangle.</p>
   <div class="figs">${fig("Le cube",ex("a2_cube.png","Cube de 3 cm d'arête",150))}${fig("Le pavé droit",ex("a2_pave.png","Pavé droit de 7 cm, 3 cm et 4 cm",170))}</div><p>Calcule le <b>volume</b> (mesure de l'espace occupé) du cube et du pavé droit.</p>`,
   c:`<p><b>Carré :</b> </p><p class="calc">P = 4 × 3<br>P = 12 cm<br>A = 3 × 3<br>A = 9 cm²</p><p><b>Rectangle :</b> </p><p class="calc">P = 2 × 5 + 2 × 3<br>P = 16 cm<br>A = 5 × 3<br>A = 15 cm²</p><p><b>Cube :</b></p><p class="calc">V = 3 × 3 × 3<br>V = 27 cm³</p><p><b>Pavé droit :</b></p><p class="calc">V = 7 × 3 × 4<br>V = 84 cm³</p>`},
  {n:"Exercice 3", t:"Apprendre et retrouver les formules", w:"Sur ton cahier", h:`<p><b>1 –</b> Écris les 3 formules que tu dois apprendre par cœur car tu n'as pas de moyen de les retrouver : le périmètre d'un cercle, l'aire d'un disque et le volume d'une boule.</p>
   <p><b>2 – a)</b> Pour retrouver les formules de l'aire d'un triangle rectangle, d'un triangle quelconque ou d'un parallélogramme, de quelle formule d'aire t'aides-tu ? Explique.</p>
   <p><b>b)</b> Il existe UNE formule générale qui permet de calculer le volume d'un cube, d'un pavé droit, d'un prisme droit et d'un cylindre. Quelle est cette formule ?</p>
   <p><b>c)</b> En 4<sup>e</sup>, on a rempli un cône avec de l'eau pour remplir un cylindre de même base et de même hauteur.</p>
   <div class="figs">${ex("manip1.jpg","Un cône et un cylindre de même base et de même hauteur",200)}${ex("manip2.jpg","On verse le cône rempli d'eau dans le cylindre",170)}${ex("manip3.jpg","Après 3 remplissages, le cylindre est plein",170)}</div>
   <p>Au bout de 3 remplissages, le cylindre est rempli : 3 × Volume du cône = Volume du cylindre.</p><p>Déduis-en la formule du volume d'un cône. De la même manière, 3 × Volume de la pyramide = Volume du prisme droit : déduis-en la formule du volume d'une pyramide.</p>`,
   c:`<p><b>1 –</b> Périmètre d'un cercle : P = 2 × π × r (ou P = π × d). Aire d'un disque : A = π × r². Volume d'une boule : V = {4/3} × π × r³.</p>
   <p><b>2 – a)</b> On s'aide de l'aire du <b>rectangle</b> : un triangle rectangle est la moitié d'un rectangle ({L × ℓ/2}) ; un triangle est la moitié d'un rectangle de même base et de même hauteur ({b × h/2}) ; un parallélogramme se découpe et se recolle en rectangle (c × h).</p>
   <p><b>b)</b> V = aire de la base × hauteur.</p><p><b>c)</b> Volume du cône = {Volume du cylindre/3} = {π × r² × h/3}. Volume de la pyramide = {Volume du prisme/3} = {aire de la base × h/3}.</p>`}
 ]},
{t:"Calculer des volumes", e:[
  {n:"Exercice 4", t:"Quille en bois", w:"Sur ton cahier", h:`${ex("quille.png","Quille en bois : un cylindre surmonté d'une boule",60)}<p>Une quille en bois est formée d'un cylindre surmonté d'une boule, qui ont tous deux le même rayon de 3 cm.</p><p>La hauteur du cylindre est de 21 cm.</p><p>Calcule le volume de cette quille, en cm³. Donne l'arrondi au dixième près.</p>`,
   c:`<p class="calc">V<sub>cylindre</sub> = π × 3² × 21<br>V<sub>cylindre</sub> = 189π cm³<br>V<sub>boule</sub> = {4/3} × π × 3³<br>V<sub>boule</sub> = 36π cm³<br>V<sub>quille</sub> = 189π + 36π<br>V<sub>quille</sub> = 225π<br>V<sub>quille</sub> ≈ 706,9 cm³</p><p>La quille a un volume d'environ <b>706,9 cm³</b>.</p>`},
  {n:"Exercice 5", t:"Cuve d'eau", w:"Sur ton cahier", h:`${ex("cuve.png","Cuve : un cube posé sur une pyramide à base carrée",120)}<p>Une cuve a la forme ci-contre :</p><ul><li>sa partie supérieure est un cube de 5 m d'arête ;</li><li>sa partie inférieure est une pyramide régulière à base carrée ;</li><li>la hauteur totale de la cuve est de 8,50 m.</li></ul><p>Calcule le volume de cette cuve, en m³. Donne l'arrondi au centième près.</p>`,
   c:`<p class="calc">V<sub>cube</sub> = 5³<br>V<sub>cube</sub> = 125 m³</p><p>La hauteur de la pyramide est 8,50 − 5 = 3,50 m et sa base est un carré de 5 m de côté.</p><p class="calc">V<sub>pyramide</sub> = {5 × 5 × 3,5/3}<br>V<sub>pyramide</sub> = {87,5/3}<br>V<sub>pyramide</sub> ≈ 29,17 m³<br>V<sub>cuve</sub> = 125 + {87,5/3}<br>V<sub>cuve</sub> ≈ 154,17 m³</p><p>La cuve a un volume d'environ <b>154,17 m³</b>.</p>`},
  {n:"Exercice 6", t:"Plot en béton", w:"Sur ton cahier", h:`${ex("plot.png","Plot en béton : un cylindre surmonté d'une demi-boule",80)}<p>Une entreprise doit construire des plots en béton pour border des trottoirs.</p><p>Ces plots sont formés d'un cylindre surmonté d'une demi-boule.</p><p>La hauteur du cylindre doit être de 40 cm et son rayon de 20 cm.</p><p>Calcule le volume, en cm³, de ce plot. Donne l'arrondi à l'unité près.</p>`,
   c:`<p class="calc">V<sub>cylindre</sub> = π × 20² × 40<br>V<sub>cylindre</sub> = 16 000π cm³<br>V<sub>demi-boule</sub> = {4/3} × π × 20³ ÷ 2<br>V<sub>demi-boule</sub> = {16 000/3}π cm³<br>V<sub>plot</sub> = 16 000π + {16 000/3}π<br>V<sub>plot</sub> = {64 000/3}π<br>V<sub>plot</sub> ≈ 67 021 cm³</p><p>Le plot a un volume d'environ <b>67 021 cm³</b>.</p>`},
  {n:"Exercice 7", t:"Rampe d'accès", w:"Sur ton cahier", h:`${ex("e7.jpg","Dimensions de la rampe : palier de 2 m, hauteur 0,50 m, pente de 4,50 m, longueur au sol 4,47 m, largeur 1,50 m",420)}<p>Calcule le volume de béton, en m³, nécessaire pour construire cette rampe d'accès pour personnes à mobilité réduite.</p>`,
   c:`<p>La rampe est composée d'un <b>pavé droit</b> (le palier du haut) et d'un <b>prisme droit</b> dont la base est un triangle rectangle (la pente).</p>
   <p class="calc">V<sub>pavé</sub> = 2 × 1,50 × 0,50<br>V<sub>pavé</sub> = 1,5 m³</p><p class="calc">A<sub>base</sub> = {4,47 × 0,50/2}<br>A<sub>base</sub> = 1,117 5 m²<br>V<sub>prisme</sub> = 1,117 5 × 1,50<br>V<sub>prisme</sub> = 1,676 25 m³</p><p class="calc">V = 1,5 + 1,676 25<br>V = 3,176 25<br>V ≈ 3,18 m³</p><p>Il faut environ <b>3,18 m³</b> de béton. (La longueur 4,50 m de la pente ne sert pas.)</p>`},
  {n:"Exercice 8", t:"Quantité d'eau", w:"Sur ton cahier", h:`${ex("e8.png","Cylindre de rayon 8 cm et de hauteur 15 cm contenant une boule",150)}<p>Je pose une boule métallique de diamètre 12 cm au fond du cylindre, puis je remplis entièrement d'eau le cylindre.</p><p>Quelle quantité d'eau, en cm³, ai-je versée ? Donne l'arrondi au dixième près.</p>`,
   c:`<p class="calc">V<sub>cylindre</sub> = π × 8² × 15<br>V<sub>cylindre</sub> = 960π cm³</p><p>Le rayon de la boule est 12 ÷ 2 = 6 cm.</p><p class="calc">V<sub>boule</sub> = {4/3} × π × 6³<br>V<sub>boule</sub> = 288π cm³<br>V<sub>eau</sub> = 960π − 288π<br>V<sub>eau</sub> = 672π<br>V<sub>eau</sub> ≈ 2 111,2 cm³</p><p>J'ai versé environ <b>2 111,2 cm³</b> d'eau.</p>`}
 ]},
{t:"Conversions d'unités de volume et de contenance", e:[
  {n:"Activité 3", t:"Conversions d'unités de volume et de capacité", w:"Sur ton cahier", h:`${ex("cubes.png","Un cube de 1 cm³ et un cube de 1 000 mm³",260)}
   <p><b>1)</b> Un cube de 1 cm d'arête contient combien de cubes de 1 mm d'arête ? Complète : 1 cm³ = ……… mm³ et 1 dm³ = ……… cm³.</p>
   <p><b>2)</b> Complète : 1 cL = ……… mL et 1 L = ……… cL.</p>
   <p><b>3)</b> Selon toi, 1 L est égal à : 1 m³ ? 1 dm³ ? 1 cm³ ? 1 mm³ ? (Aide : pense à une brique d'un litre de lait.)</p>`,
   c:`<p><b>1)</b> 10 × 10 × 10 = 1 000 : <b>1 cm³ = 1 000 mm³</b> et <b>1 dm³ = 1 000 cm³</b>. Chaque unité de volume occupe 3 colonnes.</p><p><b>2)</b> 1 cL = 10 mL et 1 L = 100 cL. Chaque unité de contenance occupe 1 colonne.</p><p><b>3)</b> <b>1 L = 1 dm³</b> (une brique de lait est un pavé d'environ 1 dm³).</p>${convTab([])}`},
  {n:"Exercice 9", t:"Problèmes de conversions", w:"Sur ton cahier", h:`<p>Chaque problème est indépendant et doit être justifié rigoureusement.</p>
   <p><b>Problème 1 :</b> dans l'exercice 6, le plot en béton a un volume environ égal à 67 021 cm³. Quel est son volume en dm³ ?</p>
   <p><b>Problème 2 :</b> dans l'exercice 4, la quille en bois a un volume environ égal à 706,9 cm³. Quel est son volume en dm³ ?</p>
   <p><b>Problème 3 :</b> ce verre peut contenir 20 cL d'eau. Avec une bouteille d'un litre, combien puis-je remplir de verres ?</p>${ex("verre.png","Un verre d'eau",60)}
   <p><b>Problème 4 :</b> une baignoire standard a les dimensions suivantes : L = 170 cm, ℓ = 80 cm et h = 55 cm. Son volume est égal à 748 000 cm³. Quelle quantité d'eau, en L, est nécessaire pour remplir totalement la baignoire ?</p>`,
   c:`<p><b>Problème 1 :</b> 1 dm³ = 1 000 cm³, donc 67 021 ÷ 1 000 = 67,021 : 67 021 cm³ = <b>67,021 dm³</b>.</p><p><b>Problème 2 :</b> 1 dm³ = 1 000 cm³, donc 706,9 ÷ 1 000 = 0,706 9 : 706,9 cm³ = <b>0,706 9 dm³</b>.</p><p><b>Problème 3 :</b> 1 L = 100 cL et 100 ÷ 20 = 5 : je peux remplir <b>5 verres</b>.</p><p><b>Problème 4 :</b> 748 000 ÷ 1 000 = 748, donc 748 000 cm³ = 748 dm³. Et 1 dm³ = 1 L : 748 dm³ = <b>748 L</b>.</p>`}
 ]},
{t:"Problèmes", e:[
  {n:"Exercice 10", t:"Volume de glace dans un cornet", w:"Sur ton cahier", h:`${ex("cornet.png","Cornet de glace : un cône de sommet B surmonté d'une demi-boule de centre A",110)}<p>Un cornet de glace est composé d'un cône surmonté d'une demi-boule.</p><p>Sur le dessin, on donne : AB = 13 cm ; AC = 2,5 cm.</p><p>On suppose que le cône est entièrement rempli de glace.</p><p>Quelle est la quantité de glace dans ce cornet, en cL ? (Arrondi à l'unité.)</p>`,
   c:`<p>Le cône a pour rayon AC = 2,5 cm et pour hauteur AB = 13 cm. La demi-boule a pour rayon 2,5 cm.</p>
   <p class="calc">V<sub>cône</sub> = {π × 2,5² × 13/3}<br>V<sub>cône</sub> = {81,25/3}π<br>V<sub>cône</sub> ≈ 85,08 cm³<br>V<sub>boule</sub> = {4/3} × π × 2,5³<br>V<sub>boule</sub> = {62,5/3}π<br>V<sub>demi-boule</sub> = {62,5/3}π ÷ 2<br>V<sub>demi-boule</sub> = {31,25/3}π<br>V<sub>demi-boule</sub> ≈ 32,72 cm³<br>V<sub>glace</sub> = {81,25/3}π + {31,25/3}π<br>V<sub>glace</sub> = 37,5π<br>V<sub>glace</sub> ≈ 117,81 cm³</p>
   <p>100 cm³ = 10 cL, donc 117,81 cm³ = 11,781 cL. Le cornet contient environ <b>12 cL</b> de glace.</p>`},
  {n:"Exercice 11", t:"Volume d'eau dans une piscine", w:"Sur ton cahier", h:`${ex("piscine.png","Piscine : demi-cylindre de diamètre 5 m, pavé de 10 m sur 5 m, prisme à base triangulaire de hauteur 3,1 m ; profondeur 1,2 m",360)}<p>Voici la représentation en perspective cavalière d'une piscine (les proportions ne sont pas respectées).</p><p>On veut remplir cette piscine jusqu'au bord : quel volume d'eau, en L, peut-on mettre au maximum ? (Arrondis à l'unité.)</p>`,
   c:`<p>La piscine est composée d'un demi-cylindre (à gauche), d'un pavé droit (au milieu) et d'un prisme droit à base triangulaire (à droite), tous de hauteur 1,2 m.</p>
   <p><b>Demi-cylindre :</b> le rayon est 5 ÷ 2 = 2,5 m.</p><p class="calc">V<sub>1</sub> = π × 2,5² × 1,2<br>V<sub>1</sub> ≈ 23,562 m³<br>V<sub>2</sub> = 23,562 ÷ 2<br>V<sub>2</sub> ≈ 11,781 m³</p><p><b>Pavé droit :</b></p><p class="calc">V<sub>3</sub> = 10 × 5 × 1,2<br>V<sub>3</sub> = 60 m³</p><p><b>Prisme droit :</b></p><p class="calc">A<sub>base</sub> = {5 × 3,1/2}<br>A<sub>base</sub> = 7,75 m²<br>V<sub>4</sub> = 7,75 × 1,2<br>V<sub>4</sub> = 9,3 m³</p><p><b>Total :</b></p><p class="calc">V = 11,781 + 60 + 9,3<br>V = 81,081 m³</p>
   <p>81,081 m³ = 81 081 dm³ = 81 081 L : on peut mettre au maximum environ <b>81 081 L</b> d'eau.</p>`},
  {n:"Exercice 12", t:"Le composteur (d'après le brevet 2021)", w:"Sur ton cahier", h:`${ex("compost.png","Composteur : un pavé droit de 70 cm sur 67 cm surmonté d'un prisme droit à base trapèze ABCD ; hauteur totale 1,1 m ; trapèze : petit côté 39 cm, grand côté 67 cm, hauteur 45 cm",440)}
   <p>Pour réduire leur production de déchets, certaines familles utilisent un composteur.</p><p>Le modèle présenté, qui n'est pas à l'échelle, est composé d'un pavé droit et d'un prisme droit.</p><p>Le descriptif indique qu'il a une contenance d'environ 0,5 m³. On souhaite vérifier cette information.</p>
   <p><b>a)</b> Vérifie que l'aire du trapèze ABCD est de 2 385 cm².</p><p><b>b)</b> Calcule le volume du composteur.</p>${ex("rappels.png","Rappels : aire du trapèze = (petit côté + grand côté) × hauteur ÷ 2 ; volume du prisme droit = aire de la base × hauteur ; volume du pavé droit = longueur × largeur × hauteur",330)}`,
   c:`<p><b>a)</b></p><p class="calc">A<sub>trapèze</sub> = {(39 + 67) × 45/2}<br>A<sub>trapèze</sub> = {106 × 45/2}<br>A<sub>trapèze</sub> = 2 385 cm²</p>
   <p><b>b)</b> Le prisme droit a pour base le trapèze ABCD et pour hauteur 70 cm :</p><p class="calc">V<sub>prisme</sub> = 2 385 × 70<br>V<sub>prisme</sub> = 166 950 cm³</p><p>Le pavé droit a pour hauteur h = 1,1 m − 45 cm :</p><p class="calc">h = 110 − 45<br>h = 65 cm<br>V<sub>pavé</sub> = 70 × 67 × 65<br>V<sub>pavé</sub> = 304 850 cm³</p>
   <p class="calc">V = 166 950 + 304 850<br>V = 471 800 cm³<br>V = 0,4718 m³</p><p>0,4718 m³ ≈ 0,5 m³ : l'information du descriptif est <b>correcte</b>.</p>`},
  {n:"Exercice 13", t:"Calcul du volume d'une boule", w:"Sur ton cahier", h:`<p>Calcule le volume de ces 2 boules. Donne la valeur exacte et l'arrondi au dixième. Rédige rigoureusement tes réponses.</p><div class="figs">${fig("Boule 1 : rayon 6 cm",ex("boule6.png","Boule de rayon 6 cm",170))}${fig("Boule 2 : diamètre 10 cm",ex("boule10.png","Boule de diamètre 10 cm",130))}</div>`,
   c:`<p><b>Boule 1 :</b> le rayon est 6 cm.</p><p class="calc">V = {4/3} × π × 6³<br>V = 288π<br>V ≈ 904,8 cm³</p><p><b>Boule 2 :</b> 10 ÷ 2 = 5, le rayon est 5 cm.</p><p class="calc">V = {4/3} × π × 5³<br>V = {500/3}π<br>V ≈ 523,6 cm³</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Reconnaître les solides et leurs formules", schema:S_PR, q:{
 1:[ {g:()=>{ const [n,f]=pick(SOL); return {q:`Quelle est la formule du volume d'un${n==="pyramide"||n==="boule"?"e":""} ${n} ?`, c:SOL.map(s=>s[1]).filter(x=>x!==f).sort(()=>Math.random()-0.5).slice(0,2).concat([f]), rep:f, ex:`${n} : ${f}.`, sx:/pyramide|cône/.test(n)?S_PY:n==="boule"?S_BO:S_PR}; }} ],
 2:[ {g:()=>{ const s=pick([["2 bases qui sont des disques identiques","un cylindre"],["2 bases qui sont des polygones identiques et des faces latérales rectangulaires","un prisme droit"],["1 base qui est un polygone et des faces latérales triangulaires","une pyramide"],["1 base qui est un disque et un sommet","un cône"],["6 faces carrées","un cube"]]); return {q:`Un solide a ${s[0]}. C'est…`, c:["un cylindre","un prisme droit","une pyramide","un cône","un cube"], rep:s[1], ex:`D'après les définitions des solides : ${s[1]}.`, sx:S_PR}; }} ],
 3:[ {q:"Quelle formule générale donne le volume d'un cube, d'un pavé droit, d'un prisme droit et d'un cylindre ?", c:["V = aire de la base × hauteur","V = {aire de la base × hauteur/3}","V = périmètre de la base × hauteur"], rep:"V = aire de la base × hauteur", ex:"Pour la pyramide et le cône, on divise en plus par 3.", sx:S_PR},
     {q:"Le volume d'un cône est … du volume d'un cylindre de même base et de même hauteur.", c:["le tiers","la moitié","le double"], rep:"le tiers", ex:"Il faut 3 cônes remplis d'eau pour remplir le cylindre.", sx:S_PY} ]
}},
{nom:"Volume d'un prisme, d'un cylindre", schema:S_PR, q:{
 1:[ {g:()=>{ const L=ri(2,12), l=ri(2,9), h=ri(2,10); return {q:`Quel est le volume d'un pavé droit de ${L} cm × ${l} cm × ${h} cm (en cm³) ?`, fig:paveSVG(L+" cm",l+" cm",h+" cm"), rep:[F(L*l*h),F(L*l*h)+" cm³"], ex:`<br>V = ${L} × ${l} × ${h}<br>V = ${F(L*l*h)} cm³`, sx:S_PR}; }} ],
 2:[ {g:()=>{ const r=ri(2,9), h=ri(3,15); return {q:`Un cylindre a pour rayon ${r} cm et pour hauteur ${h} cm. Quelle est la valeur exacte de son volume ?`, fig:cylSVG(r+" cm",h+" cm"), c:uniq(piF(r*r*h),[piF(2*r*h),piF(r*h),piF(r*r*h,3)]), rep:piF(r*r*h), ex:`<br>V = π × ${r}² × ${h}<br>V = ${piF(r*r*h)} cm³<br>V ≈ ${F(PI*r*r*h,1)} cm³`, sx:S_PR}; }} ],
 3:[ {g:()=>{ let b,hb,L; do{ b=ri(8,30)/10; hb=ri(5,25)/10; L=ri(15,40)/10; }while(false); const A=b*hb/2, V=A*L; return {q:`Une tente est un prisme droit. Sa base est un triangle de base ${F(b)} m et de hauteur ${F(hb)} m. Sa longueur est ${F(L)} m. Quel est son volume (en m³) ?`, rep:[F(V,4),F(V,4)+" m³"], ex:`<br>A<sub>base</sub> = {${F(b)} × ${F(hb)}/2}<br>A<sub>base</sub> = ${F(A)} m²<br>V = ${F(A)} × ${F(L)}<br>V = ${F(V,4)} m³`, sx:S_PR}; }},
     {g:()=>{ let r,h,V; do{ r=ri(10,40)/10; h=ri(5,20)/10; V=PI*r*r*h; }while(!safe(V,0)); return {q:`Une piscine cylindrique a un rayon de ${F(r)} m et une hauteur d'eau de ${F(h)} m. Quel volume d'eau contient-elle, arrondi au m³ ?`, rep:[F(V,0),F(V,0)+" m³"], ex:`<br>V = π × ${F(r)}² × ${F(h)}<br>V ≈ ${F(V,2)} m³<br>soit environ ${F(V,0)} m³.`, sx:S_PR}; }} ]
}},
{nom:"Volume d'une pyramide, d'un cône", schema:S_PY, q:{
 1:[ {g:()=>{ const c=ri(2,9), h=3*ri(1,5); return {q:`Une pyramide a une base carrée de côté ${c} cm et une hauteur de ${h} cm. Quel est son volume (en cm³) ?`, fig:pyrSVG(c+" cm",h+" cm"), rep:[F(c*c*h/3),F(c*c*h/3)+" cm³"], ex:`<br>V = {${c} × ${c} × ${h}/3}<br>V = {${c*c*h}/3}<br>V = ${F(c*c*h/3)} cm³`, sx:S_PY}; }} ],
 2:[ {g:()=>{ const r=ri(2,8), h=3*ri(1,5); return {q:`Un cône a pour rayon ${r} cm et pour hauteur ${h} cm. Quelle est la valeur exacte de son volume ?`, fig:coneSVG(r+" cm",h+" cm"), c:uniq(piF(r*r*h/3),[piF(r*r*h),piF(2*r*h/3),piF(r*h/3)]), rep:piF(r*r*h/3), ex:`<br>V = {π × ${r}² × ${h}/3}<br>V = {${r*r*h}π/3}<br>V = ${piF(r*r*h/3)} cm³`, sx:S_PY}; }} ],
 3:[ {g:()=>{ let r,h,V; do{ r=ri(15,60)/10; h=ri(30,150)/10; V=PI*r*r*h/3; }while(!safe(V,1)); return {q:`Un cône a pour rayon ${F(r)} cm et pour hauteur ${F(h)} cm. Calcule son volume arrondi au dixième (en cm³).`, rep:[F(V,1),F(V,1)+" cm³"], ex:`<br>V = {π × ${F(r)}² × ${F(h)}/3}<br>V ≈ ${F(V,1)} cm³`, sx:S_PY}; }} ]
}},
{nom:"Unités de volume et de contenance", schema:S_CV, q:{
 1:[ {q:"1 L est égal à…", c:["1 dm³","1 cm³","1 m³","1 mm³"], rep:"1 dm³", ex:"À connaître par cœur : 1 L = 1 dm³.", sx:S_CV},
     {g:()=>{ const v=ri(11,99)*100; return {q:`${F(v)} cm³ = … L`, rep:[F(v/1000)], ex:`${F(v)} cm³ = ${F(v/1000)} dm³ = ${F(v/1000)} L (on divise par 1 000).`, sx:S_CV}; }} ],
 2:[ {g:()=>{ const o=conv(); return {q:`Complète : ${F(o.v)} ${o.a} = … ${o.b}`, rep:[F(o.r,6)], ex:`${F(o.v)} ${o.a} = ${F(o.r,6)} ${o.b}. Rappel : 1 L = 1 dm³ ; d'une unité de volume à la suivante, on multiplie ou on divise par 1 000 ; d'une unité de contenance à la suivante, par 10.`, sx:S_CV}; }} ],
 3:[ {g:()=>{ const o=conv(); return {q:`Complète : ${F(o.v)} ${o.a} = … ${o.b}`, rep:[F(o.r,6)], ex:`${F(o.v)} ${o.a} = ${F(o.r,6)} ${o.b}.`, sx:S_CV}; }},
     {g:()=>{ const c=pick([20,25,33,50]), b=pick([1,1.5,2]); const n=Math.floor(b*100/c); return {q:`Un verre contient ${c} cL. Combien de verres pleins peut-on remplir avec une bouteille de ${F(b)} L ?`, rep:[String(n)], ex:`${F(b)} L = ${F(b*100)} cL et ${F(b*100)} ÷ ${c} ${Math.abs(b*100/c-rd(b*100/c,2))>1e-9?"≈":"="} ${F(b*100/c,2)} : on remplit ${n} verres pleins.`, sx:S_CV}; }} ]
}},
{nom:"La boule et les solides composés", schema:S_BO, q:{
 1:[ {q:"La sphère de centre O et de rayon r est l'ensemble des points de l'espace situés à une distance de O…", c:["égale à r","inférieure ou égale à r","supérieure à r"], rep:"égale à r", ex:"« Inférieure ou égale à r », c'est la boule.", sx:S_BO},
     {g:()=>{ const s=pick([["une balle de ping-pong","une sphère"],["un globe","une sphère"],["une boule de pétanque","une boule"],["la Terre","une boule"]]); return {q:`Dans le cours, ${s[0]} est donné${/^(une|la) /.test(s[0])?"e":""} comme exemple de…`, c:["une sphère","une boule"], rep:s[1], ex:"La sphère est la surface ; la boule est le solide plein.", sx:S_BO}; }} ],
 2:[ {g:()=>{ const d=2*ri(1,9); const r=d/2; return {q:`Une boule a pour diamètre ${d} cm. Quelle est la valeur exacte de son volume ?`, fig:bouleSVG("?"), c:uniq(piF(4*r**3,3),[piF(4*d**3,3),piF(4*r*r,3),piF(r**3)]), rep:piF(4*r**3,3), ex:`Rayon : ${d} ÷ 2 = ${r} cm.<br>V = {4/3} × π × ${r}³<br>V = ${piF(4*r**3,3)} cm³<br>V ≈ ${F(4/3*PI*r**3,1)} cm³`, sx:S_BO}; }} ],
 3:[ {g:()=>{ let r,h,V; do{ r=ri(2,6); h=ri(5,20); V=PI*r*r*h+2/3*PI*r**3; }while(!safe(V,1)); return {q:`Un plot est formé d'un cylindre de rayon ${r} cm et de hauteur ${h} cm surmonté d'une demi-boule de même rayon. Quel est son volume, arrondi au dixième (en cm³) ?`, rep:[F(V,1),F(V,1)+" cm³"], ex:`<br>V = π × ${r}² × ${h} + {4/3} × π × ${r}³ ÷ 2<br>V = ${piF(r*r*h)} + ${piF(2*r**3,3)}<br>V ≈ ${F(V,1)} cm³`, sx:S_ME}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>({
titre:"Évaluation d'entraînement · chapitre 4", duree:50, info:"Durée : 50 min · Calculatrice autorisée · Formulaire non autorisé",
comp:[
  ["CALCULER","Je calcule le volume d'une boule et d'un cône (valeur exacte et arrondi).","Ex. 1 et 5 (7 points)"],
  ["CONVERTIR","Je convertis des unités de volume et de contenance.","Ex. 2 (4 points)"],
  ["RAISONNER","Je calcule le volume d'un solide composé.","Ex. 3 et 4 (9 points)"]
],
exos:[
{t:"Deux volumes", p:4, h:`<p>Donne la valeur exacte, puis l'arrondi au dixième de cm³.</p><div class="figs">${fig("a) Boule de rayon 4 cm",bouleSVG("4 cm"))}${fig("b) Cône de rayon 3 cm et de hauteur 8 cm",coneSVG("3 cm","8 cm"))}</div>`,
 c:`<p><b>a)</b></p><p class="calc">V = {4/3} × π × 4³<br>V = {4/3} × π × 64<br>V = {256/3}π<br>V ≈ 268,1 cm³</p><p><i>(2 points)</i></p><p><b>b)</b></p><p class="calc">V = {π × 3² × 8/3}<br>V = {72π/3}<br>V = 24π<br>V ≈ 75,4 cm³</p><p><i>(2 points)</i></p>`},
{t:"Conversions", p:4, h:`<p>Complète.</p><p>a) 2 500 cm³ = …… dm³ = …… L</p><p>b) 0,75 m³ = …… L</p><p>c) 45 cL = …… cm³</p><p>d) 3,2 hL = …… m³</p>`,
 c:`<p>a) 1 dm³ = 1 000 cm³ : 2 500 ÷ 1 000 = 2,5. Donc 2 500 cm³ = 2,5 dm³ = 2,5 L (1 L = 1 dm³).</p><p>b) 1 m³ = 1 000 dm³ : 0,75 × 1 000 = 750. Donc 0,75 m³ = 750 dm³ = 750 L.</p><p>c) 1 cL = 10 mL : 45 × 10 = 450. Donc 45 cL = 450 mL = 450 cm³ (1 mL = 1 cm³).</p><p>d) 1 hL = 100 L : 3,2 × 100 = 320. Donc 3,2 hL = 320 L = 320 dm³, et 320 ÷ 1 000 = 0,32 : 3,2 hL = 0,32 m³.</p><p><i>1 point par conversion.</i></p>`},
{t:"La gélule", p:5, h:`<p>Une gélule de médicament est formée d'un cylindre de longueur 12 mm et de rayon 3 mm, terminé à chaque bout par une demi-boule de rayon 3 mm.</p>
  ${svgW(350,125,`<path d="M80 20 A40 40 0 0 0 80 100" style="fill:none;stroke:var(--ink);stroke-width:2"/><path d="M240 20 A40 40 0 0 1 240 100" style="fill:none;stroke:var(--ink);stroke-width:2"/>${LN(80,20,240,20)}${LN(80,100,240,100)}${LN(80,20,80,100,1)}${LN(240,20,240,100,1)}${LN(240,60,280,60,0,RED)}<text x="288" y="65" style="font-size:15px;font-weight:700;fill:${RED}">3 mm</text>${T(160,118,"12 mm")}`,"Gélule : cylindre de 12 mm et deux demi-boules de rayon 3 mm")}
  <p><b>1)</b> Calcule la valeur exacte du volume du cylindre.</p><p><b>2)</b> Explique pourquoi les deux demi-boules forment une boule, puis calcule la valeur exacte de son volume.</p><p><b>3)</b> Déduis-en la valeur exacte du volume de la gélule, puis son arrondi au mm³.</p><p><b>4)</b> Convertis ce volume en cm³.</p>`,
 c:`<p><b>1)</b></p><p class="calc">V<sub>cylindre</sub> = π × 3² × 12<br>V<sub>cylindre</sub> = 108π mm³</p><p><i>(1,5 point)</i></p><p><b>2)</b> Les deux demi-boules ont le même rayon : ensemble, elles forment une boule de rayon 3 mm.</p><p class="calc">V<sub>boule</sub> = {4/3} × π × 3³<br>V<sub>boule</sub> = 36π mm³</p><p><i>(1,5 point)</i></p><p><b>3)</b></p><p class="calc">V = 108π + 36π<br>V = 144π<br>V ≈ 452 mm³</p><p><i>(1 point)</i></p><p><b>4)</b> 452 mm³ = 0,452 cm³. <i>(1 point)</i></p>`},
{t:"L'aquarium et les billes", p:4, h:`<p>Un aquarium a la forme d'un pavé droit de 50 cm de long, 30 cm de large et 40 cm de haut.</p><p>Il est rempli d'eau sur une hauteur de 30 cm.</p>${paveSVG("50 cm","30 cm","40 cm","Aquarium : pavé droit de 50 cm, 30 cm et 40 cm")}
  <p><b>1)</b> Quel volume d'eau, en L, contient l'aquarium ?</p><p><b>2)</b> On ajoute 20 billes de diamètre 2 cm. Calcule le volume total des billes, arrondi au dixième de cm³.</p><p><b>3)</b> L'eau va-t-elle déborder ? Justifie.</p>`,
 c:`<p><b>1)</b></p><p class="calc">V<sub>eau</sub> = 50 × 30 × 30<br>V<sub>eau</sub> = 45 000 cm³<br>V<sub>eau</sub> = 45 dm³<br>V<sub>eau</sub> = <b>45 L</b></p><p><i>(1,5 point)</i></p><p><b>2)</b> Rayon d'une bille : 2 ÷ 2 = 1 cm.</p><p class="calc">V<sub>bille</sub> = {4/3} × π × 1³<br>V<sub>bille</sub> = {4/3}π cm³</p><p>Pour les 20 billes :</p><p class="calc">V<sub>billes</sub> = 20 × {4/3}π<br>V<sub>billes</sub> = {80/3}π<br>V<sub>billes</sub> ≈ 83,8 cm³</p><p><i>(1,5 point)</i></p><p><b>3)</b> Volume de l'aquarium : 50 × 30 × 40 = 60 000 cm³. Eau + billes : 45 000 + 83,8 = 45 083,8 cm³ &lt; 60 000 cm³ : <b>l'eau ne déborde pas</b>. <i>(1 point)</i></p>`},
{t:"Le verre conique", p:3, h:`<p>Un verre a la forme d'un cône de rayon 4 cm et de hauteur 9 cm.</p><p><b>1)</b> Calcule sa contenance en cm³ (arrondie au dixième), puis en cL.</p><p><b>2)</b> Peut-on y verser 15 cL de jus sans déborder ?</p>`,
 c:`<p><b>1)</b></p><p class="calc">V = {π × 4² × 9/3}<br>V = 48π<br>V ≈ 150,8 cm³<br>V ≈ 15,08 cL</p><p><i>(2 points)</i></p><p><b>2)</b> 15 cL &lt; 15,08 cL : <b>oui</b>, on peut verser 15 cL sans déborder (de justesse). <i>(1 point)</i></p>`}
]}))()
};
})();
