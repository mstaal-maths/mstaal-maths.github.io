/* 6e — Chapitre 13 : La symétrie axiale (cours et fiche d'exercices de M. Staal)
   Les corrections des figures sont obtenues en réfléchissant exactement ses figures par rapport à l'axe (sym13.py). */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const A = n => `<span class="ang">${n}</span>`;
const co = (p,alt,w) => img("c613co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("c613ex/"+p+".png", alt, w);
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;

/* ---------- figure sur quadrillage ----------
   gsym({n, axe:{t:"v"|"h"|"d", k}, pts:[[x,y]…], sym:true}) — x vers la droite, y vers le bas, en carreaux.
   axe "v" : x = k ; "h" : y = k ; "d" : la diagonale y = x. */
const reflP = (p, ax) => ax.t==="v" ? [2*ax.k-p[0], p[1]] : ax.t==="h" ? [p[0], 2*ax.k-p[1]] : [p[1], p[0]];
function gsym(o){
  const n=o.n||10, c=o.c||24, pad=6, W=n*c+2*pad, ax=o.axe;
  let s=`<svg class="fig" viewBox="0 0 ${W} ${W}" width="${Math.min(W,o.w||W)}" style="max-width:100%" role="img" aria-label="${o.alt||"Figure sur quadrillage"}">`;
  for(let i=0;i<=n;i++){ s+=`<line x1="${pad+i*c}" y1="${pad}" x2="${pad+i*c}" y2="${pad+n*c}" style="stroke:#c9c9c9;stroke-width:1"/><line x1="${pad}" y1="${pad+i*c}" x2="${pad+n*c}" y2="${pad+i*c}" style="stroke:#c9c9c9;stroke-width:1"/>`; }
  const P = p => `${pad+p[0]*c},${pad+p[1]*c}`;
  const poly = (pts,col,fill) => `<polyline points="${pts.map(P).join(" ")}" style="fill:${fill||"none"};stroke:${col};stroke-width:3;stroke-linejoin:round;stroke-linecap:round"/>`;
  s += poly(o.pts, "#1f6db0", o.closed!==false?"rgba(31,109,176,.18)":"none");
  if(o.sym) s += poly(o.pts.map(p=>reflP(p,ax)), "#e07a00", o.closed!==false?"rgba(224,122,0,.18)":"none");
  if(o.dots) o.dots.forEach(([p,nm,col])=>{ const [x,y]=P(p).split(",").map(Number); s+=`<circle cx="${x}" cy="${y}" r="4.5" style="fill:${col||"var(--ink)"}"/><text x="${x+7}" y="${y-7}" style="font-size:15px;font-weight:700;fill:${col||"var(--ink)"}">${nm}</text>`; });
  const L = ax.t==="v" ? [[ax.k,-0.4],[ax.k,n+0.4]] : ax.t==="h" ? [[-0.4,ax.k],[n+0.4,ax.k]] : [[-0.3,-0.3],[n+0.3,n+0.3]];
  s += `<line x1="${pad+L[0][0]*c}" y1="${pad+L[0][1]*c}" x2="${pad+L[1][0]*c}" y2="${pad+L[1][1]*c}" style="stroke:#c00000;stroke-width:3"/>`;
  return s + "</svg>";
}
/* une figure fermée (bibliothèque de formes simples), placée d'un côté de l'axe ; u = distance à l'axe, v = position le long de l'axe */
const FORMES = [
  [[1,0],[2,0],[2,3],[4,3],[4,4],[1,4]],
  [[1,3],[3,1],[5,3],[5,6],[1,6]],
  [[1,2],[3,2],[3,0],[5,3],[3,6],[3,4],[1,4]],
  [[0,0],[1,0],[1,1],[2,1],[2,2],[3,2],[3,3],[0,3]],
  [[1,0],[4,0],[4,1],[3,1],[3,4],[2,4],[2,1],[1,1]],
  [[2,0],[4,2],[2,4],[3,5],[1,5],[0,2]],
  [[1,1],[4,0],[3,2],[4,5],[1,4]],
  [[0,1],[2,1],[2,0],[4,2],[2,4],[2,3],[0,3]] ];
function randFig(n, ax){
  for(let essai=0; essai<300; essai++){
    let f = pick(FORMES).map(p=>[...p]); if(Math.random()<.5){ const mv=Math.max(...f.map(p=>p[1])); f=f.map(([u,v])=>[u,mv-v]); }
    const mu=Math.max(...f.map(p=>p[0])), mv=Math.max(...f.map(p=>p[1]));
    let pts;
    if(ax.t==="v"){ const o=ri(0,Math.max(0,ax.k-mu)-0)*0, ov=ri(0,n-mv); const g=ri(0,1); pts=f.map(([u,v])=>[ax.k-u-g, v+ov]); }
    else if(ax.t==="h"){ const ov=ri(0,n-mv), g=ri(0,1); pts=f.map(([u,v])=>[v+ov, ax.k-u-g]); }
    else { const ox=ri(0,n), oy=ri(0,n); pts=f.map(([u,v])=>[v+ox-mv, u+oy]); }
    const r=pts.map(p=>reflP(p,ax)), inG=q=>q.every(p=>p[0]>=0&&p[0]<=n&&p[1]>=0&&p[1]<=n);
    if(!inG(pts)||!inG(r)) continue;
    if(ax.t==="d" && !pts.every(p=>p[1]>=p[0])) continue;
    return [...pts, pts[0]];
  }
  return ax.t==="h"?[[1,3],[3,3],[3,1],[1,3]]:ax.t==="v"?[[3,1],[3,3],[1,3],[3,1]]:[[0,2],[1,4],[0,4],[0,2]];
}
window.FIG13 = {gsym, randFig, reflP};

/* ---------- schémas ---------- */
const S_FIG = sch("Figures symétriques", co("fig","Deux figures symétriques par rapport à la droite (d) sur un quadrillage",300)+`<p class="schN">Elles se superposent par pliage le long de l'axe. Chaque point et son symétrique sont à la même distance de l'axe.</p>`);
const S_DEF = sch("Le symétrique d'un point", co("def","A et A' symétriques par rapport à (d)",240)+`<p class="schN">(d) est la <b>médiatrice</b> de [AA'] : (AA') ⊥ (d), et (d) coupe [AA'] en son milieu.</p>`);
const S_PROP = sch("Ce que conserve la symétrie", co("prop","Segment, cercle et angle et leurs symétriques",420)+`<p class="schN">Les longueurs, les angles, l'alignement, les périmètres et les aires sont conservés.</p>`);
const S_AXES = sch("Axes de symétrie des figures usuelles", co("usu","Axes de symétrie des figures usuelles",440));

const fig = (ax,pts,sym,o={}) => gsym(Object.assign({n:8,c:22,axe:ax,pts,sym},o));

CH["6e-13"] = {
intro:"Reconnaître des figures symétriques, construire le symétrique d'un point (équerre et compas, ou compas seul) et d'une figure, utiliser les propriétés de la symétrie et trouver les axes de symétrie d'une figure.",
savoir:[
  "reconnaître deux figures symétriques par rapport à une droite ;",
  "construire le symétrique d'un point, à la règle et à l'équerre, ou au compas ;",
  "construire le symétrique d'une figure en utilisant les propriétés de la symétrie ;",
  "trouver les axes de symétrie d'une figure."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Figures symétriques par rapport à une droite", h:`
  <div class="cpt"><div><p>Les deux figures ci-contre se superposent quand on plie la feuille le long de la droite (d).</p><div class="retenir" data-l="Définition"><p>On dit qu'elles sont <b>symétriques par rapport à la droite (d)</b>. La droite (d) s'appelle l'<b>axe de symétrie</b>.</p></div><p><b>Rappel :</b> sur un quadrillage, on compte les carreaux de part et d'autre de l'axe : chaque point et son symétrique sont à la même distance de l'axe.</p></div>${co("fig","Deux figures symétriques par rapport à la droite (d)",280)}</div>
  <div class="anim" data-anim="6e13-sym-quadrillage"></div>`},
{k:"II", t:"Le symétrique d'un point", h:`
  <h4>1. Définition</h4>
  <div class="cpt"><div><div class="retenir" data-l="Définition"><p>Le symétrique d'un point A par rapport à une droite (d) est le point A' tel que la droite (d) est la <b>médiatrice</b> du segment [AA'] (voir le chapitre 6).</p></div><p>Cela veut dire que :</p><ul><li>les droites (AA') et (d) sont perpendiculaires ;</li><li>la droite (d) coupe le segment [AA'] en son milieu.</li></ul><p><b>Remarque :</b> si un point est sur la droite (d), son symétrique est le point lui-même.</p></div>${co("def","A et A' symétriques par rapport à (d)",210)}</div>
  <h4>2. Construire le symétrique d'un point avec l'équerre et le compas</h4>
  <div class="retenir" data-l="Méthode"><ol><li>Avec l'équerre, je trace la perpendiculaire à (d) passant par A. Elle coupe (d) en H.</li><li>Avec le compas, je reporte la longueur AH de l'autre côté de (d), sur la perpendiculaire.</li><li>J'obtiens le point A', symétrique de A : HA' = HA. Je code la figure.</li></ol></div>
  <div class="anim" data-anim="6e13-sym-equerre"></div>
  ${co("equ","Les trois étapes de la construction à l'équerre et au compas",480)}
  <h4>3. Construire le symétrique d'un point avec le compas seulement</h4>
  <div class="retenir" data-l="Méthode"><ol><li>Je place un point M sur (d). Je trace un arc de cercle de centre M passant par A, et je le prolonge de l'autre côté de (d).</li><li>Je place un deuxième point N sur (d). Je trace un arc de cercle de centre N passant par A, de l'autre côté de (d).</li><li>Les deux arcs se coupent en A', le symétrique de A.</li></ol></div>
  <div class="anim" data-anim="symetrique-axial-compas"></div>
  ${co("comp","Les trois étapes de la construction au compas seul",480)}
  <p><b>Remarque :</b> cette méthode fonctionne car MA = MA' et NA = NA' : les points M et N sont sur la médiatrice de [AA'].</p>`},
{k:"III", t:"Les propriétés de la symétrie axiale", h:`
  <div class="retenir" data-l="Propriété"><p>La symétrie axiale conserve les <b>longueurs</b>, les <b>angles</b>, l'<b>alignement</b>, les <b>périmètres</b> et les <b>aires</b>.</p></div>
  <ul><li>Le symétrique d'un segment est un segment de même longueur.</li><li>Le symétrique d'une droite est une droite.</li><li>Le symétrique d'un cercle est un cercle de même rayon ; son centre est le symétrique du centre.</li><li>Le symétrique d'un angle est un angle de même mesure.</li></ul>
  ${co("prop","Un segment, un cercle, un angle et leurs symétriques",480)}
  <h4>Construire le symétrique d'un polygone</h4>
  <div class="cpt"><div><div class="retenir" data-l="Méthode"><ol><li>Je construis le symétrique de chaque sommet.</li><li>Je relie les points obtenus dans le même ordre.</li></ol></div><p><b>Exemple :</b> le symétrique du triangle IJK par rapport à (d) est le triangle I'J'K'. Il a les mêmes longueurs et les mêmes angles : I'J' = IJ, J'K' = JK, I'K' = IK.</p><p><b>Remarque :</b> si un sommet est sur l'axe, il est son propre symétrique : je n'ai rien à construire pour lui.</p></div>${co("poly","Le triangle IJK et son symétrique I'J'K'",230)}</div>
  <div class="anim" data-anim="6e13-sym-triangle"></div>`},
{k:"IV", t:"Les axes de symétrie d'une figure", h:`
  <div class="retenir" data-l="Définition"><p>Une droite (d) est un <b>axe de symétrie</b> d'une figure si le symétrique de la figure par rapport à (d) est la figure elle-même : la figure se superpose à elle-même par pliage le long de (d).</p></div>
  ${co("axes","Une figure avec 1 axe, une avec 2 axes, une sans axe de symétrie",470)}
  <p>De gauche à droite : 1 axe de symétrie, 2 axes de symétrie, aucun axe de symétrie.</p>
  <h4>Les axes de symétrie des figures usuelles</h4>
  ${co("usu","Segment : 2 axes ; cercle : une infinité ; triangle isocèle : 1 axe ; triangle équilatéral : 3 axes ; rectangle : 2 axes ; losange : 2 axes ; carré : 4 axes",500)}
  <p><b>Remarque :</b> la médiatrice d'un segment est un axe de symétrie de ce segment.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Figures symétriques par rapport à une droite", e:[
  {n:"Activité 1", t:"Symétriques ou pas ?", w:"Sur ta feuille", h:`<p>Entoure les lettres des cas où les deux figures sont symétriques par rapport à la droite rouge. Pour les autres, explique pourquoi sur ton cahier.</p>${ex("act1","Six paires de figures en L avec une droite rouge",490)}`,
   c:`<p>Les figures sont symétriques dans les cas <b>a)</b>, <b>c)</b> et <b>d)</b> : elles se superposent par pliage le long de la droite rouge.</p><p><b>b)</b> Non : la figure orange a seulement glissé, elle n'est pas « retournée » (la barre verticale devrait être à droite).</p><p><b>e)</b> Non : la figure orange a tourné (elle est à l'envers), et elle n'est pas à la même hauteur que la figure bleue.</p><p><b>f)</b> Non : la forme est bien retournée, mais la figure orange est trop loin de l'axe (1 carreau de trop) : les points ne sont pas à la même distance de l'axe.</p>`},
  {n:"Exercice 1", t:"Compléter une figure", w:"Sur ta feuille", h:`<p>Trace le symétrique de chaque figure par rapport à la droite rouge, en comptant les carreaux.</p>${ex("e1","Trois figures sur quadrillage avec un axe vertical, horizontal et oblique",490)}`,
   c:`${ex("e1c","Les trois figures complétées par leur symétrique en orange",490)}<p><i>Pour l'axe oblique (c), on compte les carreaux en diagonale : chaque sommet et son symétrique sont sur une même diagonale du quadrillage, perpendiculaire à l'axe.</i></p>`}
 ]},
{t:"Le symétrique d'un point", e:[
  {n:"Exercice 2", t:"Construire le symétrique d'un point", w:"Sur ta feuille", h:`<p>Construis le point A', symétrique de A par rapport à (d) : avec l'équerre et le compas pour a), b) et c), avec le compas seulement pour d), e) et f). Laisse tes traits de construction visibles.</p>${ex("e2","Six cadres avec un point A et une droite (d)",490)}`,
   c:`${ex("e2c","Les six points A' construits",490)}<p>a), b), c) : perpendiculaire à (d) passant par A, puis report de la longueur AH de l'autre côté (codage : angle droit et longueurs égales).</p><p>d), e), f) : deux points M et N sur (d), puis deux arcs de centres M et N passant par A ; ils se coupent en A'.</p>`},
  {n:"Exercice 3", t:"Vrai ou faux ?", w:"Sur ta feuille", h:`<p>Dans chaque cas, le point B est-il le symétrique du point A par rapport à la droite rouge ? Vérifie avec ton équerre et ta règle graduée.</p>${ex("e3","Quatre cas : deux points A et B et une droite rouge",490)}`,
   c:`<p>a) <b>Vrai</b> : (AB) est perpendiculaire à la droite et A et B sont à la même distance (1,3 cm) de la droite.</p><p>b) <b>Faux</b> : (AB) n'est pas perpendiculaire à la droite rouge.</p><p>c) <b>Faux</b> : (AB) est bien perpendiculaire à la droite, mais A est à 1,6 cm de la droite et B à seulement 1 cm.</p><p>d) <b>Vrai</b> : (AB) est perpendiculaire à la droite et la droite coupe [AB] en son milieu.</p>`}
 ]},
{t:"Le symétrique d'une figure", e:[
  {n:"Exercice 4", t:"Construire le symétrique d'une figure", w:"Sur ta feuille", h:`<p>Construis le symétrique de chaque figure par rapport à la droite (d). Nomme les points obtenus A', B', C'… (le symétrique du centre B s'appelle B').</p>${ex("e4","Un triangle, un quadrilatère, un cercle et un losange avec une droite (d)",490)}`,
   c:`${ex("e4c","Les quatre figures et leurs symétriques",490)}<p>On construit le symétrique de chaque sommet, puis on relie dans le même ordre. Pour le cercle, on construit B', puis le cercle de centre B' de même rayon.</p><p>d) Le losange coupe l'axe : sa figure symétrique le chevauche. C'est normal !</p>`},
  {n:"Exercice 5", t:"Utiliser les propriétés", w:"Sur ta feuille", h:`<div class="cpt"><div><p>Les quadrilatères ABCD et A'B'C'D' sont symétriques par rapport à la droite (d). La figure est faite à main levée. Sans mesurer, complète et justifie.</p><p>1) A'B' = …… &nbsp; B'C' = ……</p><p>2) ${A("A'B'C'")} = ……</p><p>3) Le périmètre de ABCD est 15,5 cm. Quel est le périmètre de A'B'C'D' ?</p><p>4) Justification.</p></div>${ex("e5","ABCD avec AB = 5 cm, BC = 3 cm, angle ABC = 95°, et son symétrique A'B'C'D'",260)}</div>`,
   c:`<p>1) A'B' = AB = <b>5 cm</b> ; B'C' = BC = <b>3 cm</b>.</p><p>2) ${A("A'B'C'")} = ${A("ABC")} = <b>95°</b>.</p><p>3) Le périmètre de A'B'C'D' est <b>15,5 cm</b>.</p><p>4) La symétrie axiale conserve les longueurs, les angles et les périmètres.</p>`},
  {n:"Exercice 6", t:"Construire à partir d'un texte", w:"Sur une feuille blanche", h:`<p>1) Trace une droite (d) et place un point A à 4 cm de la droite (d).</p><p>2) Construis le point A', symétrique de A par rapport à (d).</p><p>3) Place un point B sur la droite (d), puis trace le triangle ABA'.</p><p>4) Quelle est la nature du triangle ABA' ? Justifie à l'aide d'une propriété de la médiatrice.</p>`,
   c:`<svg class="fig" viewBox="0 0 300 230" width="300" role="img" aria-label="Le triangle ABA' isocèle en B"><line x1="10" y1="115" x2="290" y2="115" style="stroke:#c00000;stroke-width:2.5"/><text x="262" y="106" style="font-size:14px;fill:#c00000">(d)</text><line x1="90" y1="20" x2="90" y2="210" style="stroke:#888;stroke-width:1.5;stroke-dasharray:5 4"/><path d="M90 103 h12 v12" style="fill:none;stroke:#555;stroke-width:1.5"/><polygon points="90,25 220,115 90,205" style="fill:rgba(31,109,176,.12);stroke:#1f6db0;stroke-width:2.5"/><circle cx="90" cy="25" r="4" style="fill:var(--ink)"/><circle cx="90" cy="205" r="4" style="fill:#e07a00"/><circle cx="220" cy="115" r="4" style="fill:var(--ink)"/><text x="70" y="24" style="font-size:15px;font-weight:700;fill:var(--ink)">A</text><text x="66" y="214" style="font-size:15px;font-weight:700;fill:#e07a00">A'</text><text x="226" y="135" style="font-size:15px;font-weight:700;fill:var(--ink)">B</text><text x="38" y="74" style="font-size:13px;fill:var(--ink)">4 cm</text><text x="38" y="164" style="font-size:13px;fill:var(--ink)">4 cm</text></svg>
   <p>4) (d) est la médiatrice de [AA'] et B est sur (d). Or, si un point est sur la médiatrice d'un segment, il est à la même distance des extrémités de ce segment : <b>BA = BA'</b>. Le triangle ABA' est donc <b>isocèle en B</b>.</p>`}
 ]},
{t:"Les axes de symétrie d'une figure", e:[
  {n:"Exercice 7", t:"Combien d'axes ?", w:"Sur ta feuille", h:`<p>Trace, s'il y en a, le ou les axes de symétrie de chaque figure. Puis indique leur nombre.</p>${ex("e7","Un cœur, une étoile à quatre pointes, une flèche courbe, un cercle, une étoile à cinq branches, un parallélogramme",490)}`,
   c:`<svg class="fig" viewBox="0 0 1403 365" width="490" style="max-width:100%" role="img" aria-label="Les axes de symétrie tracés en rouge : 1 pour le cœur, 2 pour la figure b, aucun pour la flèche, une infinité pour le cercle (4 tracés), 5 pour l'étoile, aucun pour le parallélogramme" font-family="Arial, sans-serif"><path d="M123.3,152 C121.4,148 117.4,134.5 112,128 C106.6,121.5 98.7,115.8 91,113.2 C83.3,110.6 74,110.8 66,112.6 C58,114.4 48.9,118.4 43,124 C37.1,129.6 32.5,138 30.5,146 C28.5,154 28.9,163.8 31,172 C33.1,180.2 38.1,188.2 43,195 C47.9,201.8 54.3,207.1 60.5,213 C66.7,218.9 73.9,225 80,230.5 C86.1,236 92,241.1 97,246 C102,250.9 106.5,256 110,260 C113.5,264 115.8,266.3 118,270 C120.2,273.7 122.4,280 123.3,282 C124.2,280 126.4,273.7 128.6,270 C130.8,266.3 133.1,264 136.6,260 C140.1,256 144.6,250.9 149.6,246 C154.6,241.1 160.5,236 166.6,230.5 C172.7,225 179.9,218.9 186.1,213 C192.3,207.1 198.7,201.8 203.6,195 C208.5,188.2 213.5,180.2 215.6,172 C217.7,163.8 218.1,154 216.1,146 C214.1,138 209.5,129.6 203.6,124 C197.7,118.4 188.6,114.4 180.6,112.6 C172.6,110.8 163.3,110.6 155.6,113.2 C147.9,115.8 140,121.5 134.6,128 C129.2,134.5 125.2,148 123.3,152 Z" fill="none" style="stroke:var(--ink)" stroke-width="3.6" stroke-linejoin="miter"/><polygon points="252.5,86 355,150 457.5,86 426,182 457.5,278 355,214 252.5,278 284,182" fill="none" style="stroke:var(--ink)" stroke-width="3.6" stroke-linejoin="miter"/><path d="M500,245 A100,100 0 0 1 700,245 L715,245 L675,308.3 L635,245 L653,245 A52.5,52.5 0 0 0 548,245 Z" fill="none" style="stroke:var(--ink)" stroke-width="3.6" stroke-linejoin="miter"/><circle cx="828" cy="181.8" r="94.7" fill="none" style="stroke:var(--ink)" stroke-width="3.6" stroke-linejoin="miter"/><polygon points="1056.7,81.7 1082.1,155.5 1160.1,156.8 1097.8,203.7 1120.6,278.3 1056.7,233.6 992.8,278.3 1015.6,203.7 953.3,156.8 1031.3,155.5" fill="none" style="stroke:var(--ink)" stroke-width="3.6" stroke-linejoin="miter"/><polygon points="1229.5,102.5 1380,102.5 1341,276.5 1190.5,276.5" fill="none" style="stroke:var(--ink)" stroke-width="3.6" stroke-linejoin="miter"/><text x="122.5" y="343" font-size="29" style="fill:var(--ink)" text-anchor="middle" font-weight="bold" >a)</text><text x="355" y="343" font-size="29" style="fill:var(--ink)" text-anchor="middle" font-weight="bold" >b)</text><text x="599.5" y="343" font-size="29" style="fill:var(--ink)" text-anchor="middle" font-weight="bold" >c)</text><text x="828" y="343" font-size="29" style="fill:var(--ink)" text-anchor="middle" font-weight="bold" >d)</text><text x="1056.5" y="343" font-size="29" style="fill:var(--ink)" text-anchor="middle" font-weight="bold" >e)</text><text x="1284.5" y="343" font-size="29" style="fill:var(--ink)" text-anchor="middle" font-weight="bold" >f)</text><line x1="123.3" y1="90.0" x2="123.3" y2="300.0" style="stroke:#c00000;stroke-width:4"/><line x1="355.0" y1="62.0" x2="355.0" y2="300.0" style="stroke:#c00000;stroke-width:4"/><line x1="232.0" y1="182.0" x2="478.0" y2="182.0" style="stroke:#c00000;stroke-width:4"/><line x1="716.0" y1="181.8" x2="940.0" y2="181.8" style="stroke:#c00000;stroke-width:4"/><line x1="748.8" y1="102.6" x2="907.2" y2="261.0" style="stroke:#c00000;stroke-width:4"/><line x1="828.0" y1="69.8" x2="828.0" y2="293.8" style="stroke:#c00000;stroke-width:4"/><line x1="907.2" y1="102.6" x2="748.8" y2="261.0" style="stroke:#c00000;stroke-width:4"/><line x1="1056.7" y1="65.4" x2="1056.7" y2="277.3" style="stroke:#c00000;stroke-width:4"/><line x1="1175.6" y1="151.8" x2="974.0" y2="217.2" style="stroke:#c00000;stroke-width:4"/><line x1="1130.2" y1="291.5" x2="1005.6" y2="120.0" style="stroke:#c00000;stroke-width:4"/><line x1="983.2" y1="291.5" x2="1107.8" y2="120.0" style="stroke:#c00000;stroke-width:4"/><line x1="937.8" y1="151.8" x2="1139.4" y2="217.2" style="stroke:#c00000;stroke-width:4"/></svg><p>a) le cœur : <b>1 axe</b> (vertical) · b) <b>2 axes</b> (un vertical et un horizontal) · c) la flèche : <b>aucun axe</b> · d) le cercle : <b>une infinité</b> d'axes (toutes les droites qui passent par le centre) · e) l'étoile : <b>5 axes</b> (chaque pointe et le creux opposé) · f) le parallélogramme : <b>aucun axe</b>.</p>`},
  {n:"Exercice 8", t:"Les lettres", w:"Sur ta feuille", h:`<p>Trace les axes de symétrie de chaque lettre, puis écris en dessous leur nombre.</p><p class="calc" style="font-size:1.6rem;letter-spacing:.5em;font-family:Arial,sans-serif">A B C H N S X Z</p>`,
   c:`<svg class="fig" viewBox="0 0 570 125" width="570" style="max-width:100%" role="img" aria-label="Les lettres et leurs axes de symétrie en rouge"><path transform="translate(22 15)" d="M0 60 L20 0 L40 60 M8 36 L32 36" style="fill:none;stroke:var(--ink);stroke-width:4;stroke-linecap:round;stroke-linejoin:round"/><line x1="42" y1="5" x2="42" y2="85" style="stroke:#c00000;stroke-width:2.5"/><text x="42" y="118" text-anchor="middle" style="font-size:15px;font-weight:700;fill:var(--ink)">1</text><path transform="translate(90 15)" d="M4 0 L4 60 M4 0 L22 0 A15 15 0 0 1 22 30 L4 30 M22 30 A15 15 0 0 1 22 60 L4 60" style="fill:none;stroke:var(--ink);stroke-width:4;stroke-linecap:round;stroke-linejoin:round"/><line x1="80" y1="45" x2="140" y2="45" style="stroke:#c00000;stroke-width:2.5"/><text x="110" y="118" text-anchor="middle" style="font-size:15px;font-weight:700;fill:var(--ink)">1</text><path transform="translate(158 15)" d="M36 10 A22 26 0 1 0 36 50" style="fill:none;stroke:var(--ink);stroke-width:4;stroke-linecap:round;stroke-linejoin:round"/><line x1="148" y1="45" x2="208" y2="45" style="stroke:#c00000;stroke-width:2.5"/><text x="178" y="118" text-anchor="middle" style="font-size:15px;font-weight:700;fill:var(--ink)">1</text><path transform="translate(226 15)" d="M0 0 L0 60 M40 0 L40 60 M0 30 L40 30" style="fill:none;stroke:var(--ink);stroke-width:4;stroke-linecap:round;stroke-linejoin:round"/><line x1="246" y1="5" x2="246" y2="85" style="stroke:#c00000;stroke-width:2.5"/><line x1="216" y1="45" x2="276" y2="45" style="stroke:#c00000;stroke-width:2.5"/><text x="246" y="118" text-anchor="middle" style="font-size:15px;font-weight:700;fill:var(--ink)">2</text><path transform="translate(294 15)" d="M0 60 L0 0 L40 60 L40 0" style="fill:none;stroke:var(--ink);stroke-width:4;stroke-linecap:round;stroke-linejoin:round"/><text x="314" y="118" text-anchor="middle" style="font-size:15px;font-weight:700;fill:var(--ink)">0</text><path transform="translate(362 15)" d="M35 10 C30 0 5 0 5 15 C5 30 35 30 35 45 C35 60 10 60 5 50" style="fill:none;stroke:var(--ink);stroke-width:4;stroke-linecap:round;stroke-linejoin:round"/><text x="382" y="118" text-anchor="middle" style="font-size:15px;font-weight:700;fill:var(--ink)">0</text><path transform="translate(430 15)" d="M0 0 L40 60 M40 0 L0 60" style="fill:none;stroke:var(--ink);stroke-width:4;stroke-linecap:round;stroke-linejoin:round"/><line x1="450" y1="5" x2="450" y2="85" style="stroke:#c00000;stroke-width:2.5"/><line x1="420" y1="45" x2="480" y2="45" style="stroke:#c00000;stroke-width:2.5"/><text x="450" y="118" text-anchor="middle" style="font-size:15px;font-weight:700;fill:var(--ink)">2</text><path transform="translate(498 15)" d="M0 0 L40 0 L0 60 L40 60" style="fill:none;stroke:var(--ink);stroke-width:4;stroke-linecap:round;stroke-linejoin:round"/><text x="518" y="118" text-anchor="middle" style="font-size:15px;font-weight:700;fill:var(--ink)">0</text></svg><div class="scroll"><table class="std"><thead><tr><th>Lettre</th><th>A</th><th>B</th><th>C</th><th>H</th><th>N</th><th>S</th><th>X</th><th>Z</th></tr></thead><tbody><tr><th>Nombre d'axes</th><td>1</td><td>1</td><td>1</td><td>2</td><td>0</td><td>0</td><td>2</td><td>0</td></tr></tbody></table></div><p>A : axe vertical · B et C : axe horizontal · H et X : un axe vertical et un axe horizontal · N, S et Z n'ont pas d'axe de symétrie (ils ont un centre de symétrie, qu'on verra en 5e).</p>`},
  {n:"Exercice 9", t:"Les figures usuelles", w:"Sur ta feuille", h:`<p>Trace en couleur tous les axes de symétrie de chaque figure.</p>${ex("e9","Un segment, un cercle, un triangle isocèle, un triangle équilatéral, un rectangle, un losange, un carré",470)}`,
   c:`${ex("e9c","Les axes de symétrie des figures usuelles tracés en rouge",470)}<p>Segment : <b>2 axes</b> (la droite (AB) et la médiatrice) · cercle : <b>une infinité</b> (on en a tracé quelques-uns) · triangle isocèle : <b>1 axe</b> · triangle équilatéral : <b>3 axes</b> · rectangle : <b>2 axes</b> · losange : <b>2 axes</b> (ses diagonales) · carré : <b>4 axes</b>.</p>`},
  {n:"Exercice 10", t:"Retrouver l'axe", w:"Sur ta feuille", h:`<p>Dans chaque cas, on a tracé le symétrique du bateau bleu par rapport à une droite, puis on a effacé la droite. Retrace-la précisément.</p><p><b>Aide :</b> l'axe est la médiatrice du segment qui relie un point à son symétrique.</p>${ex("e10","Trois bateaux bleus et leurs symétriques orange",490)}`,
   c:`${ex("e10c","Les trois axes retrouvés",490)}<p>Je relie par exemple le haut du mât bleu au haut du mât orange, puis je trace la médiatrice de ce segment : c'est l'axe. Je vérifie avec un deuxième point.</p>`},
  {n:"En ++", t:"Deux axes de symétrie", w:"Sur ta feuille", h:`<div class="cpt"><div><p>Complète la figure pour que les deux droites rouges soient des axes de symétrie de la figure terminée.</p><p><b>Conseil :</b> construis d'abord le symétrique par rapport à la droite verticale, puis le symétrique de l'ensemble par rapport à la droite horizontale.</p></div>${ex("epp","Une ligne brisée et deux axes rouges",240)}</div>`,
   c:`${ex("eppc","La figure terminée, avec deux axes de symétrie",300)}`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Figures symétriques", schema:S_FIG, q:{
 1:[ {g:()=>{ const k=ri(1,4); return {q:`Sur un quadrillage, un point est à ${k} carreau${k>1?"x":""} à gauche d'un axe vertical. Où est son symétrique ?`, c:shuf([`à ${k} carreau${k>1?"x":""} à droite de l'axe`,`à ${k+1} carreaux à droite de l'axe`,`à ${k} carreau${k>1?"x":""} à gauche de l'axe`]), rep:`à ${k} carreau${k>1?"x":""} à droite de l'axe`, sx:S_FIG}; }} ],
 2:[ {g:()=>{ const ax={t:pick(["v","h"]),k:4}; const pts=randFig(8,ax); const ok=pick([true,false]); let other=pts.map(p=>reflP(p,ax)); if(!ok) other=other.map(p=>ax.t==="v"?[p[0]+1,p[1]]:[p[0],p[1]+1]);
     const segs = q => new Set(q.slice(1).map((p,i)=>[q[i].join(","),p.join(",")].sort().join("|"))); const S1=segs(other), S2=segs(pts.map(p=>reflP(p,ax))); const same = S1.size===S2.size && [...S1].every(x=>S2.has(x));
     const fg = gsym({n:9,c:22,axe:ax,pts}).replace("</svg>", `<polyline points="${other.map(p=>`${6+p[0]*22},${6+p[1]*22}`).join(" ")}" style="fill:rgba(224,122,0,.18);stroke:#e07a00;stroke-width:3;stroke-linejoin:round"/></svg>`);
     return {q:"Les deux figures sont-elles symétriques par rapport à la droite rouge ?", fig:fg, c:["Oui","Non"], rep:same?"Oui":"Non", ex:same?"Chaque sommet et son symétrique sont à la même distance de l'axe.":"La figure orange est décalée d'un carreau.", sx:S_FIG}; }} ],
 3:[ {q:"Deux figures symétriques par rapport à une droite…", c:["se superposent par pliage le long de la droite","sont toujours côte à côte, à la même hauteur","ont toujours la même orientation"], rep:"se superposent par pliage le long de la droite", sx:S_FIG} ]
}},
{nom:"Le symétrique d'un point", schema:S_DEF, q:{
 1:[ {q:"Si A' est le symétrique de A par rapport à (d), alors (d) est…", c:["la médiatrice de [AA']","parallèle à (AA')","le milieu de [AA']"], rep:"la médiatrice de [AA']", sx:S_DEF},
     {q:"Un point M est sur l'axe (d). Quel est son symétrique ?", c:["le point M lui-même","un point de l'autre côté","il n'en a pas"], rep:"le point M lui-même", sx:S_DEF} ],
 2:[ {g:()=>{ const d=ri(2,9)+pick([0,0.5]); const s=String(d).replace(".",","); return {q:`A est à ${s} cm de la droite (d). À quelle distance de (d) est son symétrique A' (en cm) ?`, rep:s, sx:S_DEF}; }},
     {q:"Les droites (AA') et (d) sont…", c:["perpendiculaires","parallèles","confondues"], rep:"perpendiculaires", sx:S_DEF} ],
 3:[ {q:"Pour construire A' au compas seul, on trace deux arcs passant par A et de centres…", c:["deux points M et N de (d)","A et un point de (d)","deux points quelconques"], rep:"deux points M et N de (d)", ex:"MA = MA' et NA = NA' : M et N sont sur la médiatrice de [AA'].", sx:S_DEF},
     {g:()=>{ const d=ri(3,8); return {q:`A est à ${d} cm de (d) et B est un point de (d). Le triangle ABA' est…`, c:["isocèle en B","équilatéral","rectangle en B"], rep:"isocèle en B", ex:"B est sur la médiatrice de [AA'] : BA = BA'.", sx:S_DEF}; }} ]
}},
{nom:"Les propriétés", schema:S_PROP, q:{
 1:[ {g:()=>{ const l=ri(2,12); return {q:`[MN] mesure ${l} cm. Combien mesure son symétrique [M'N'] (en cm) ?`, rep:String(l), sx:S_PROP}; }} ],
 2:[ {g:()=>{ const a=ri(20,160); return {q:`Un angle mesure ${a}°. Combien mesure son symétrique (en °) ?`, rep:String(a), sx:S_PROP}; }},
     {g:()=>{ const r=ri(2,6); return {q:`Le symétrique d'un cercle de rayon ${r} cm est…`, c:[`un cercle de rayon ${r} cm`,`un cercle de rayon ${2*r} cm`,"un segment"], rep:`un cercle de rayon ${r} cm`, sx:S_PROP}; }} ],
 3:[ {q:"La symétrie axiale conserve…", c:["les longueurs, les angles et les aires","seulement les longueurs","seulement les angles"], rep:"les longueurs, les angles et les aires", sx:S_PROP},
     {g:()=>{ const p=ri(100,250); const s=(p/10).toString().replace(".",","); return {q:`Le périmètre d'un polygone est ${s} cm. Quel est le périmètre de son symétrique (en cm) ?`, rep:s, sx:S_PROP}; }} ]
}},
{nom:"Axes de symétrie", schema:S_AXES, q:{
 1:[ {g:()=>{ const f=pick([["un carré","4"],["un rectangle","2"],["un triangle équilatéral","3"],["un losange","2"],["un triangle isocèle","1"],["un segment","2"]]); return {q:`Combien ${f[0]} a-t-il d'axes de symétrie ?`, rep:f[1], sx:S_AXES}; }} ],
 2:[ {g:()=>{ const f=pick([["A","1"],["H","2"],["N","0"],["E","1"],["O","2"],["Z","0"],["T","1"],["M","1"]]); return {q:`Combien la lettre ${f[0]} (écrite en majuscule d'imprimerie) a-t-elle d'axes de symétrie ?`, rep:f[1], sx:S_AXES}; }},
     {q:"Combien un cercle a-t-il d'axes de symétrie ?", c:["une infinité","1","4"], rep:"une infinité", ex:"Toutes les droites qui passent par son centre.", sx:S_AXES} ],
 3:[ {q:"Les axes de symétrie d'un losange sont…", c:["ses diagonales","les médiatrices de ses côtés","ses côtés"], rep:"ses diagonales", sx:S_AXES},
     {q:"Un parallélogramme (qui n'est ni un rectangle ni un losange) a…", c:["aucun axe de symétrie","2 axes","1 axe"], rep:"aucun axe de symétrie", sx:S_AXES} ]
}}
],
/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
/* figures de l'évaluation d'entraînement (calculées : symétriques exacts, axes exacts) */
const RED="#c00000", BLU="#1f6db0", ORA="#e07a00", f1=v=>v.toFixed(1);
const croix=(x,y,c)=>`<path d="M${f1(x-5)} ${f1(y-5)} L${f1(x+5)} ${f1(y+5)} M${f1(x-5)} ${f1(y+5)} L${f1(x+5)} ${f1(y-5)}" style="stroke:${c||"var(--ink)"};stroke-width:2.2"/>`;
const lab=(x,y,t,c)=>`<text x="${f1(x)}" y="${f1(y)}" style="font-size:15px;font-weight:700;fill:${c||"var(--ink)"}">${t}</text>`;
/* symétriques de points par rapport à une droite oblique ; o.cor : figure corrigée */
function ptsFig(o){
  const P1=[20,200], P2=[320,40], dx=P2[0]-P1[0], dy=P2[1]-P1[1], L=Math.hypot(dx,dy), u=[dx/L,dy/L];
  const foot=p=>{ const t=(p[0]-P1[0])*u[0]+(p[1]-P1[1])*u[1]; return [P1[0]+t*u[0], P1[1]+t*u[1]]; };
  let s=`<svg class="fig" viewBox="0 0 340 235" width="340" style="max-width:100%" role="img" aria-label="${o.alt}">`;
  s+=`<line x1="${P1[0]}" y1="${P1[1]}" x2="${P2[0]}" y2="${P2[1]}" style="stroke:${RED};stroke-width:2.5"/>`+lab(26,222,"(d)",RED);
  o.pts.forEach(([n,p,ticks,dl])=>{ const H=foot(p), q=[2*H[0]-p[0],2*H[1]-p[1]], v=[p[0]-H[0],p[1]-H[1]], lv=Math.hypot(...v), w=[v[0]/lv,v[1]/lv];
    if(o.cor){
      s+=`<line x1="${f1(p[0]+w[0]*14)}" y1="${f1(p[1]+w[1]*14)}" x2="${f1(q[0]-w[0]*14)}" y2="${f1(q[1]-w[1]*14)}" style="stroke:#777;stroke-width:1.5;stroke-dasharray:5 4"/>`;
      const a=[H[0]+u[0]*10,H[1]+u[1]*10], b=[a[0]+w[0]*10,a[1]+w[1]*10], c=[H[0]+w[0]*10,H[1]+w[1]*10];
      s+=`<path d="M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])} L${f1(c[0])} ${f1(c[1])}" style="fill:none;stroke:var(--ink);stroke-width:1.5"/>`;
      [[p,H],[H,q]].forEach(([A,B])=>{ const m=[(A[0]+B[0])/2,(A[1]+B[1])/2]; for(let k=0;k<ticks;k++){ const c2=[m[0]+w[0]*(k-(ticks-1)/2)*5, m[1]+w[1]*(k-(ticks-1)/2)*5];
        s+=`<line x1="${f1(c2[0]-u[0]*6)}" y1="${f1(c2[1]-u[1]*6)}" x2="${f1(c2[0]+u[0]*6)}" y2="${f1(c2[1]+u[1]*6)}" style="stroke:var(--ink);stroke-width:1.8"/>`; } });
      s+=croix(q[0],q[1],ORA)+lab(q[0]+dl[2],q[1]+dl[3],n+"'",ORA);
    }
    s+=croix(p[0],p[1])+lab(p[0]+dl[0],p[1]+dl[1],n); });
  if(o.G){ const G=[P1[0]+0.85*dx,P1[1]+0.85*dy]; s+=croix(G[0],G[1])+lab(G[0]-4,G[1]+22,o.cor?"G = G'":"G"); }
  return s+"</svg>";
}
const PTS=[["E",[95,75],1,[-20,-6,10,6]],["F",[235,190],2,[10,6,-22,-2]]];
/* les quatre figures de l'exercice sur les axes */
function axesFig(cor){
  const shapes=[
    {pts:[[60,20],[95,70],[60,120],[25,70]], fill:"rgba(31,109,176,.18)", ax:[[[60,8],[60,132]],[[13,70],[107,70]]]},
    {pts:[[140,118],[222,118],[166,34]], fill:"rgba(29,122,70,.18)", ax:[]},
    {pts:[[255,116],[345,116],[300,116-45*Math.sqrt(3)]], fill:"rgba(224,122,0,.2)", ax:"tri"},
    {pts:[[420,22],[450,62],[420,122],[390,62]], fill:"rgba(140,90,190,.2)", ax:[[[420,10],[420,134]]]} ];
  let s=`<svg class="fig" viewBox="0 0 470 160" width="470" style="max-width:100%" role="img" aria-label="${cor?"Les axes de symétrie tracés en rouge : 2 pour le losange, aucun pour le triangle quelconque, 3 pour le triangle équilatéral, 1 pour le cerf-volant":"Quatre figures : un losange, un triangle quelconque, un triangle équilatéral et un cerf-volant"}">`;
  shapes.forEach((S,i)=>{ s+=`<polygon points="${S.pts.map(p=>f1(p[0])+","+f1(p[1])).join(" ")}" style="fill:${S.fill};stroke:var(--ink);stroke-width:2"/>`;
    const cx=S.pts.reduce((a,p)=>a+p[0],0)/S.pts.length;
    s+=`<text x="${f1(i===0?60:i===3?420:cx)}" y="153" text-anchor="middle" style="font-size:16px;font-weight:700;fill:var(--ink)">${"①②③④"[i]}</text>`;
    if(cor){ let ax=S.ax; if(ax==="tri") ax=S.pts.map((V,k)=>{ const A=S.pts[(k+1)%3], B=S.pts[(k+2)%3], M=[(A[0]+B[0])/2,(A[1]+B[1])/2], d=[M[0]-V[0],M[1]-V[1]], l=Math.hypot(...d); return [[V[0]-d[0]/l*12,V[1]-d[1]/l*12],[M[0]+d[0]/l*12,M[1]+d[1]/l*12]]; });
      ax.forEach(([a,b])=>{ s+=`<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" style="stroke:${RED};stroke-width:2.5"/>`; }); } });
  return s+"</svg>";
}
const AX={t:"h",k:4}, Q1=[[2,3],[3,1],[6,0],[7,2],[5,4],[2,3]], Q2=[[2,1],[5,1],[6,3],[2,3],[2,1]];
const qd=(pts,sym)=>gsym({n:9,c:24,axe:AX,pts,sym,w:230,alt:sym?"La figure bleue et sa symétrique orange par rapport à la droite rouge":"Une figure bleue au-dessus d'une droite rouge horizontale, sur un quadrillage"});
const COMP=[
  ["RAISONNER","J'utilise les propriétés de la symétrie axiale (longueurs, angles, cercles).","Ex. 1 (2 points)"],
  ["REPRÉSENTER","Je construis le symétrique d'une figure sur un quadrillage.","Ex. 2 (2 points)"],
  ["RAISONNER","Je trouve tous les axes de symétrie d'une figure.","Ex. 3 (3 points)"],
  ["REPRÉSENTER","Je construis le symétrique d'un point avec l'équerre et le compas.","Ex. 4 (3 points)"]];
const C_AXES=`${axesFig(true)}<p>① le losange : <b>2 axes</b> (ses diagonales) · ② le triangle quelconque : <b>aucun axe</b> · ③ le triangle équilatéral : <b>3 axes</b> · ④ le cerf-volant : <b>1 axe</b> (la diagonale verticale).</p><p><i>0,75 point par figure : 0,5 pour les axes bien tracés, 0,25 pour le nombre.</i></p>`;
const C_PTS=`${ptsFig({cor:true,G:true,pts:PTS,alt:"E' et F' construits : les perpendiculaires à (d) en pointillés, les angles droits et les longueurs égales codés"})}
  <p>Pour E : avec l'équerre, je trace la droite perpendiculaire à (d) qui passe par E ; elle coupe (d) en un point. Avec le compas, je reporte la distance de E à (d) de l'autre côté : j'obtiens E'. Je fais de même pour F.</p>`;
return {
titre:"Évaluation d'entraînement — Chapitre 13", duree:30, info:"Durée : 30 min · Règle, équerre et compas · Calculatrice non autorisée",
comp:COMP,
exos:[
{t:"Ce que conserve la symétrie", p:2, h:`<p>Le triangle RST a pour symétrique le triangle R'S'T' par rapport à une droite (d). On sait que RS = 5,4 cm et que l'angle ${A("RST")} mesure 64°.</p><p>On a aussi tracé le cercle (C) de centre R et de rayon 2,5 cm, et son symétrique (C') par rapport à (d).</p>
  <p>a) Sans mesurer, donne la longueur R'S'.</p><p>b) Sans mesurer, donne la mesure de l'angle ${A("R'S'T'")}.</p><p>c) Quel est le centre du cercle (C') ? Quel est son rayon ?</p><p>d) Écris la propriété du cours qui permet de répondre.</p>`,
 c:`<p>a) R'S' = RS = <b>5,4 cm</b>. <i>(0,5 point)</i></p><p>b) ${A("R'S'T'")} = ${A("RST")} = <b>64°</b>. <i>(0,5 point)</i></p><p>c) Le centre de (C') est <b>R'</b>, le symétrique de R, et son rayon est <b>2,5 cm</b>. <i>(0,5 point)</i></p><p>d) La symétrie axiale <b>conserve les longueurs et les angles</b> : le symétrique d'un cercle est un cercle de même rayon. <i>(0,5 point)</i></p>`},
{t:"Sur le quadrillage", p:2, h:`<p>Trace le symétrique de la figure bleue par rapport à la droite rouge.</p>${qd(Q1,false)}`,
 c:`${qd(Q1,true)}<p>Je compte les carreaux entre chaque sommet et la droite rouge, puis je reporte le même nombre de carreaux de l'autre côté. Le sommet qui est sur la droite reste à sa place.</p><p><i>0,25 point par sommet bien placé (5 sommets), 0,75 point pour la figure tracée en reliant dans le bon ordre.</i></p>`},
{t:"Combien d'axes ?", p:3, h:`<p>Pour chaque figure, dessine en couleur ses axes de symétrie (s'il y en a), puis indique leur nombre.</p>${axesFig(false)}<p>① un losange · ② un triangle quelconque · ③ un triangle équilatéral · ④ un cerf-volant</p>`,
 c:C_AXES},
{t:"Le symétrique de points", p:3, h:`<p>Construis, avec l'équerre et le compas, les points E' et F', symétriques des points E et F par rapport à la droite (d). On doit voir tes traits de construction et le codage (angles droits et longueurs égales).</p><p>Le point G est sur la droite (d). Où se trouve son symétrique G' ?</p>${ptsFig({G:true,pts:PTS,alt:"Une droite (d) oblique, le point E au-dessus, le point F en dessous et le point G sur (d)"})}`,
 c:`${C_PTS}<p><i>E' : 1 point · F' : 1 point · codage : 0,5 point.</i></p><p>G est sur (d) : son symétrique est le point lui-même, <b>G' = G</b>. <i>(0,5 point)</i></p>`}
],
bep:(()=>{
/* les mêmes figures que la version normale, sans le cerf-volant (exercice 3) et sans le point F (exercice 4) */
const ax3=cor=>axesFig(cor).replace('viewBox="0 0 470 160" width="470"','viewBox="0 0 362 160" width="362"')
  .replace(/<polygon points="420\.0[^>]*\/>/,"").replace(/<text[^>]*>④<\/text>/,"").replace(/<line x1="420\.0"[^>]*\/>/,"")
  .replace(/aria-label="[^"]*"/, `aria-label="${cor?"Les axes de symétrie tracés en rouge : 2 pour le losange, aucun pour le triangle quelconque, 3 pour le triangle équilatéral":"Trois figures : un losange, un triangle quelconque et un triangle équilatéral"}"`);
const PE=[PTS[0]];
return {
titre:"Évaluation d'entraînement — Chapitre 13 · version aménagée", duree:30, info:"Version aménagée (tiers-temps) · Durée : 30 min · Règle, équerre et compas · Calculatrice non autorisée",
note:"Le même sujet avec 3 questions en moins, à faire dans le même temps. Le total reste sur 10 points.",
comp:COMP,
exos:[
{t:"Ce que conserve la symétrie", p:2, h:`<p>Le triangle RST a pour symétrique le triangle R'S'T' par rapport à une droite (d). On sait que RS = 5,4 cm et que l'angle ${A("RST")} mesure 64°.</p><p>On a aussi tracé le cercle (C) de centre R et de rayon 2,5 cm, et son symétrique (C') par rapport à (d).</p>
  <p>a) Sans mesurer, donne la longueur R'S'.</p><p>b) Quel est le centre du cercle (C') ? Quel est son rayon ?</p><p>c) Écris la propriété du cours qui permet de répondre.</p>`,
 c:`<p>a) R'S' = RS = <b>5,4 cm</b>. <i>(0,5 point)</i></p><p>b) Le centre de (C') est <b>R'</b>, le symétrique de R, et son rayon est <b>2,5 cm</b>. <i>(1 point : 0,5 pour le centre, 0,5 pour le rayon)</i></p><p>c) La symétrie axiale <b>conserve les longueurs et les angles</b> : le symétrique d'un cercle est un cercle de même rayon. <i>(0,5 point)</i></p>`},
{t:"Sur le quadrillage", p:2, h:`<p>Trace le symétrique de la figure bleue par rapport à la droite rouge.</p>${qd(Q1,false)}`,
 c:`${qd(Q1,true)}<p>Je compte les carreaux entre chaque sommet et la droite rouge, puis je reporte le même nombre de carreaux de l'autre côté. Le sommet qui est sur la droite reste à sa place.</p><p><i>0,25 point par sommet bien placé (5 sommets), 0,75 point pour la figure tracée en reliant dans le bon ordre.</i></p>`},
{t:"Combien d'axes ?", p:3, h:`<p>Pour chaque figure, dessine en couleur ses axes de symétrie (s'il y en a), puis indique leur nombre.</p>${ax3(false)}<p>① un losange · ② un triangle quelconque · ③ un triangle équilatéral</p>`,
 c:`${ax3(true)}<p>① le losange : <b>2 axes</b> (ses diagonales) · ② le triangle quelconque : <b>aucun axe</b> · ③ le triangle équilatéral : <b>3 axes</b>.</p><p><i>1 point par figure : 0,75 pour les axes bien tracés, 0,25 pour le nombre.</i></p>`},
{t:"Le symétrique de points", p:3, h:`<p>Construis, avec l'équerre et le compas, le point E', symétrique du point E par rapport à la droite (d). On doit voir tes traits de construction et le codage (angle droit et longueurs égales).</p><p>Le point G est sur la droite (d). Où se trouve son symétrique G' ?</p>${ptsFig({G:true,pts:PE,alt:"Une droite (d) oblique, le point E au-dessus et le point G sur (d)"})}`,
 c:`${ptsFig({cor:true,G:true,pts:PE,alt:"E' construit : la perpendiculaire à (d) en pointillés, l'angle droit et les longueurs égales codés"})}
  <p>Avec l'équerre, je trace la droite perpendiculaire à (d) qui passe par E ; elle coupe (d) en un point. Avec le compas, je reporte la distance de E à (d) de l'autre côté : j'obtiens E'.</p><p><i>E' : 2 points (1 pour la perpendiculaire, 1 pour le report au compas) · codage : 0,5 point.</i></p><p>G est sur (d) : son symétrique est le point lui-même, <b>G' = G</b>. <i>(0,5 point)</i></p>`}
]};
})()
};
})()
};
})();
