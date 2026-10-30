/* 5e — Chapitre 2 : Le demi-tour (symétrie centrale), avec rappel de la symétrie axiale */
(function(){
const VF = ["Vrai","Faux"], ON = ["Oui","Non"];
const co = (p,alt,w) => img("5c2co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("5c2ex/"+p+".png", alt, w);
const S = G.sym, R = G.refl;
const lab = (l,f) => `<figure>${f}<figcaption>${l}</figcaption></figure>`;
const cg = items => `<div class="cgrid">${items.map(([l,f,t])=>`<figure><figcaption><b>${l}</b> ${t||""}</figcaption>${f}</figure>`).join("")}</div>`;

/* --- construction d'un demi-tour : figure de départ + image --- */
function dt(pts, poly, c, opt={}){
  const O=pts[c], im={}, cons=[]; const suf=opt.suf||"'";
  poly.forEach((n,i)=>{ if(n===c){ im[n]=pts[n]; return; } im[n+suf]=S(pts[n],O); cons.push([n,c,n+suf,i+1]); });
  const imgPoly = poly.map(n=>n===c?n:n+suf);
  return geo({pts:{...pts,...im}, polys:[{v:poly},{v:imgPoly,k:"img"}], cons, marks:[c], s:opt.s, grid:opt.grid, names:opt.names, w:opt.w});
}
/* --- construction d'une symétrie axiale par rapport à (ab) --- */
function sa(pts, poly, a, b, opt={}){
  const im={}, ax=[]; const suf=opt.suf||"'"; const A=pts[a]||a, B=pts[b]||b;
  poly.forEach((n,i)=>{ const p=R(pts[n],A,B); const on=Math.hypot(p[0]-pts[n][0],p[1]-pts[n][1])<0.01; if(on){ im[n]=pts[n]; return; } im[n+suf]=p; ax.push([n,n+suf,a,b,i+1]); });
  const imgPoly = poly.map(n=>im[n]&&!im[n+suf]?n:n+suf);
  return geo({pts:{...pts,...im}, polys:[{v:poly},{v:imgPoly,k:"img"}], ax, lines:[{a,b,lab:opt.lab||"(d)",t:opt.t??0}], s:opt.s, grid:opt.grid, names:opt.names, w:opt.w, hide:opt.hide});
}

/* ---------- coordonnées relevées sur les figures de M. Staal ---------- */
const F1 = {H:[548,235], N:[615,131], P:[750,341], Q:[346,241]};
const FA2 = {A:[133,129], B:[82,381], C:[234,231], H:[385,231]};
const F2 = {L:[136,123], I:[325,285], R:[123,377], E:[45,198], V:[405,185]};
const F3 = {S:[157,227], U:[365,195]};
const F4a = {E:[0,2], D:[3,2], F:[4,2], C:[2,4]}, F4b = {E:[0,5], C:[3,5], D:[3,4], F:[4,3]};
const F5a = {E:[4,2], D:[7,1], C:[5,3]}, F5b = {D:[3,0], C:[4,0], E:[3,3]};
const F6 = {R:[283,38], P:[283,188], A:[382,188], B:[182,239], e1:[532,0], e2:[292,504]};
const F7 = {R:[137,45], P:[65,191], A:[156,240]};
const F8a = {A:[2,1], B:[1,6], C:[4,3], d1:[0,7], d2:[6,7]}, F8b = {D:[3,0], C:[5,1], E:[1,3], d1:[0,8], d2:[8,0]};
const F9 = {A:[25,106], B:[245,42], C:[335,121], D:[194,235]}; F9.O = G.inter(F9.A,F9.C,F9.B,F9.D);
const E1a = {A:[172,120], B:[35,161], C:[131,40], d1:[241,45], d2:[180,235]}, E1b = {A:[84,48], B:[164,40], C:[199,108], D:[47,81], d1:[26,182], d2:[229,138]};
const GR = 34;

/* ---------- méthode de construction en 3 étapes ---------- */
const step = (k)=>{ const A=[30,100], O=[150,70], A2=[270,40], X=(p,c)=>`<path d="M${p[0]-6} ${p[1]-6} L${p[0]+6} ${p[1]+6} M${p[0]+6} ${p[1]-6} L${p[0]-6} ${p[1]+6}" class="${c||"gx"}"/>`;
  let s=`<svg class="fig geo" viewBox="0 0 300 130" width="300" role="img" aria-label="Étape ${k} de la construction">`;
  if(k>=2) s+=`<line x1="${A[0]}" y1="${A[1]}" x2="296" y2="${70-(296-150)/4}" class="cons"/>`;
  if(k>=3){ const r=Math.hypot(120,30), a0=Math.atan2(-30,120); s+=`<path d="M${150+r*Math.cos(a0-0.3)} ${70+r*Math.sin(a0-0.3)} A${r} ${r} 0 0 1 ${150+r*Math.cos(a0+0.3)} ${70+r*Math.sin(a0+0.3)}" class="axe3" fill="none"/>`;
    [[90,85],[210,55]].forEach(([x,y])=>s+=`<line x1="${x-3}" y1="${y-6}" x2="${x+3}" y2="${y+6}" class="tick"/>`); s+=X(A2,"pt")+`<text x="${A2[0]-6}" y="${A2[1]-12}" class="glab gimg">A'</text>`; }
  s+=X(A)+X(O)+`<text x="${A[0]-4}" y="${A[1]+24}" class="glab">A</text><text x="${O[0]-4}" y="${O[1]+24}" class="glab">O</text>`;
  return s+"</svg>"; };
const methode = cg([["1.",step(1),"Je place le point A et le centre O."],["2.",step(2),"Je trace la demi-droite [AO) : elle part de A et passe par O."],["3.",step(3),"Avec le compas, je reporte la longueur OA de l'autre côté de O : j'obtiens A'. O est le milieu de [AA']."]]);

/* ---------- axes et centres de symétrie : convention de M. Staal ----------
   axes de symétrie en ROUGE (pointillés, prolongés au-delà de la figure), centres de symétrie en BLEU (croix).
   Toutes les figures sont calculées : chaque axe passe exactement par les bons points. */
const AXC = "#d62424", CTC = "#1d63d8";
const LEG = `<p>Les axes de symétrie sont en <b style="color:${AXC}">rouge</b>. Les centres de symétrie sont en <b style="color:${CTC}">bleu</b>.</p>`;
const f1 = v => (Math.round(v*10)/10);
/* axe passant par p et q (deux points de la figure), prolongé de e px de chaque côté */
const axeL = (p, q, e=12) => { const d=[q[0]-p[0],q[1]-p[1]], L=Math.hypot(d[0],d[1]), u=[d[0]/L,d[1]/L];
  return `<line x1="${f1(p[0]-u[0]*e)}" y1="${f1(p[1]-u[1]*e)}" x2="${f1(q[0]+u[0]*e)}" y2="${f1(q[1]+u[1]*e)}" style="stroke:${AXC};stroke-width:2.5;stroke-dasharray:7 4;fill:none"/>`; };
const ctrP = (x, y) => { const d=`M${x-6} ${y-6} L${x+6} ${y+6} M${x+6} ${y-6} L${x-6} ${y+6}`; return `<path d="${d}" style="stroke:var(--surface);stroke-width:6.5;stroke-linecap:round;fill:none"/><path d="${d}" style="stroke:${CTC};stroke-width:3;stroke-linecap:round;fill:none"/>`; };

/* ---------- figures usuelles : axes et centre ---------- */
const usu = (kind, show)=>{ let s="", a="", cc="";
  const ax=(p,q)=>{ if(show) a+=axeL(p,q); }, ctr=(x,y)=>{ if(show) cc+=ctrP(x,y); };
  if(kind==="segment"){ s+=`<line x1="20" y1="65" x2="140" y2="65" class="axe2" style="stroke-width:3.5"/><path d="M20 59 V71 M140 59 V71" class="axe2"/>`; if(show) a+=axeL([20,65],[140,65],16); ax([80,30],[80,100]); ctr(80,65); }
  if(kind==="cercle"){ const c=[80,65], r=48; s+=`<circle cx="80" cy="65" r="${r}" class="orig" fill-opacity="0"/>`;
    [0,45,90,135].forEach(t=>{ const u=[Math.cos(t*Math.PI/180),Math.sin(t*Math.PI/180)]; ax([c[0]-r*u[0],c[1]-r*u[1]],[c[0]+r*u[0],c[1]+r*u[1]]); }); ctr(80,65); }
  if(kind==="carré"){ s+=`<rect x="35" y="20" width="90" height="90" class="orig"/>`; ax([80,20],[80,110]); ax([35,65],[125,65]); ax([35,20],[125,110]); ax([35,110],[125,20]); ctr(80,65); }
  if(kind==="rectangle"){ s+=`<rect x="15" y="30" width="130" height="70" class="orig"/>`; ax([80,30],[80,100]); ax([15,65],[145,65]); ctr(80,65); }
  if(kind==="isocèle"){ s+=`<polygon points="80,12 45,118 115,118" class="orig"/>`; ax([80,12],[80,118]); }
  if(kind==="équilatéral"){ const A=[80,112-58*Math.sqrt(3)], B=[22,112], C=[138,112], m=(P,Q)=>[(P[0]+Q[0])/2,(P[1]+Q[1])/2];
    s+=`<polygon points="${[A,B,C].map(P=>f1(P[0])+","+f1(P[1])).join(" ")}" class="orig"/>`; ax(A,m(B,C)); ax(B,m(A,C)); ax(C,m(A,B)); }
  /* les axes passent sous la figure (on voit ainsi le segment), le centre est dessiné par-dessus */
  return `<svg class="fig geo" viewBox="0 0 160 130" width="160" role="img" aria-label="${kind}">${a}${s}${cc}</svg>`; };

/* ---------- Activité 5 : lettres et symboles, dessinés exactement symétriques ---------- */
const sym5 = (kind, show, w=74)=>{ let s="", a="";
  const ax=(p,q)=>{ if(show) a+=axeL(p,q); }, ctr=(x,y)=>{ if(show) a+=ctrP(x,y); }, ink=`style="fill:var(--ink)"`;
  if(kind==="E"){ s=`<polygon points="30,25 82,25 82,41 46,41 46,57 78,57 78,73 46,73 46,89 82,89 82,105 30,105" ${ink}/>`; ax([30,65],[82,65]); }
  if(kind==="L"){ s=`<polygon points="35,20 51,20 51,94 80,94 80,110 35,110" ${ink}/>`; }
  if(kind==="X"){ s=`<polygon points="30,25 42,25 80,105 68,105" ${ink}/><polygon points="68,25 80,25 42,105 30,105" ${ink}/>`; ax([55,25],[55,105]); ax([30,65],[80,65]); ctr(55,65); }
  if(kind==="cœur"){ s=`<path d="M55 104 C40 90 22 74 22 53 C22 38 32 30 42 30 C49 30 53 35 55 40 C57 35 61 30 68 30 C78 30 88 38 88 53 C88 74 70 90 55 104 Z" class="orig" style="fill:#b3b9c2;stroke:#6b7280"/>`; ax([55,40],[55,104]); }
  if(kind==="carreau"){ s=`<path d="M55 20 Q62 52 85 65 Q62 78 55 110 Q48 78 25 65 Q48 52 55 20 Z" class="orig" style="fill:#b3b9c2;stroke:#6b7280"/>`; ax([55,20],[55,110]); ax([25,65],[85,65]); ctr(55,65); }
  return `<svg class="fig geo" viewBox="0 0 110 130" width="${w}" role="img" aria-label="${kind}">${s}${a}</svg>`; };
/* exemples de l'activité : la lettre M et son axe (d), la lettre H et son centre O */
const exM = `<svg class="fig geo" viewBox="0 0 88 100" width="72" role="img" aria-label="La lettre M et son axe de symétrie (d)"><polygon points="25,79 25,38.5 31.5,38.5 43.5,63 55.5,38.5 62,38.5 62,79 57.5,79 57.5,46 46.5,71 40.5,71 29.5,46 29.5,79" style="fill:var(--ink)"/>${axeL([43.5,38.5],[43.5,79],14)}<text x="57" y="22" style="font-size:14px;fill:${AXC};font-weight:600">(d)</text></svg>`;
const exH = `<svg class="fig geo" viewBox="0 0 70 100" width="62" role="img" aria-label="La lettre H et son centre de symétrie O"><line x1="18" y1="22" x2="52" y2="78" style="stroke:var(--muted);stroke-width:1;stroke-dasharray:3 3"/><line x1="52" y1="22" x2="18" y2="78" style="stroke:var(--muted);stroke-width:1;stroke-dasharray:3 3"/><rect x="14" y="20" width="8" height="60" style="fill:var(--ink)"/><rect x="48" y="20" width="8" height="60" style="fill:var(--ink)"/><rect x="14" y="46" width="42" height="8" style="fill:var(--ink)"/>${ctrP(35,50)}<text x="35" y="41" text-anchor="middle" style="font-size:13px;fill:${CTC};font-weight:700">O</text></svg>`;
const USU = [["Le segment","segment","2 axes : la droite qui le porte et sa médiatrice. Centre : son milieu."],["Le cercle","cercle","Une infinité d'axes : tous les diamètres. Centre : son centre."],["Le carré","carré","4 axes : les 2 diagonales et les 2 médiatrices des côtés. Centre : le point d'intersection des diagonales."],["Le rectangle","rectangle","2 axes : les médiatrices des côtés. Centre : le point d'intersection des diagonales."],["Le triangle isocèle","isocèle","1 axe. Pas de centre de symétrie."],["Le triangle équilatéral","équilatéral","3 axes. Pas de centre de symétrie."]];

/* grilles pour le quiz */
const qg = (pts, marks) => geo({pts, marks, grid:{c:8,r:6}, s:GR, w:300});

CH["5e-2"] = {
intro:"Symétrie axiale (rappel) et demi-tour : reconnaître, construire, utiliser les propriétés pour justifier, trouver un centre de symétrie.",
savoir:[
  "reconnaître un demi-tour et une symétrie axiale, et construire l'image d'une figure ;",
  "utiliser les propriétés du demi-tour pour justifier une longueur ou une mesure d'angle."
],
cours:[
{t:"Rappel : la symétrie axiale", h:`
  <div class="retenir" data-l="Définition"><p>Deux figures sont symétriques par rapport à une droite lorsqu'elles se superposent en pliant suivant cette droite, appelée l'<b>axe de symétrie</b>.</p></div>
  ${co("p1-00","Les figures F et F' symétriques par rapport à la droite (d)",330)}
  <p>Les figures F et F' sont symétriques par rapport à la droite (d) : F' est le symétrique de F, et F est le symétrique de F'.</p>
  <p><b>Remarque :</b> la droite (d) est la <b>médiatrice</b> de chaque segment reliant un point et son symétrique : elle est perpendiculaire au segment [MM'] et passe par son milieu.</p>`},
{t:"Le demi-tour", h:`
  <h4>a) Définition</h4>
  <div class="retenir" data-l="Définition"><p>Deux figures sont symétriques par rapport à un point lorsqu'elles se superposent en effectuant un <b>demi-tour</b> (un tour de 180°) autour de ce point, appelé <b>centre de symétrie</b>.</p></div>
  ${co("p1-01","Les figures F et F' symétriques par rapport au point O",300)}
  <p><b>Remarque :</b> le centre de symétrie O est le <b>milieu</b> de chaque segment reliant un point et son symétrique : O est le milieu de [MM'].</p>
  <h4>b) Tracer le symétrique d'un point par un demi-tour</h4>
  <p>Méthode : construire le point A', symétrique du point A par rapport au point O.</p>${methode}
  <div class="anim" data-anim="5e2-sym-point"></div>
  <p>Pour une figure, je construis le symétrique de chaque sommet, puis je relie les points dans le même ordre.</p>
  <div class="anim" data-anim="5e2-sym-triangle"></div>`},
{t:"Propriétés du demi-tour", h:`
  <div class="retenir" data-l="Propriété"><p>Le demi-tour conserve : les <b>longueurs</b>, l'<b>alignement</b>, les <b>mesures d'angles</b>, les <b>aires</b> et le <b>parallélisme</b>.</p></div>
  <div class="retenir" data-l="Propriété 1"><p>Si deux segments sont symétriques par rapport à un point, alors ils sont <b>parallèles et de même longueur</b>.</p></div>
  ${co("p2-07","Les segments [EF] et [E'F'] symétriques par rapport à O",280)}
  <div class="retenir" data-l="Propriété 2"><p>Si deux droites sont symétriques par rapport à un point, alors elles sont <b>parallèles</b>.</p></div>
  ${co("p2-09","Les droites (d) et (d') symétriques par rapport à O",320)}
  <div class="retenir" data-l="Propriété 3"><p>Si deux cercles sont symétriques par rapport à un point, alors ils ont le <b>même rayon</b> et leurs centres sont symétriques.</p></div>
  ${co("p2-10","Deux cercles de même rayon symétriques par rapport à O",320)}
  <div class="retenir" data-l="Pour justifier"><p><b>Je sais que</b> les figures sont symétriques par rapport au point O. <b>Or</b> le demi-tour conserve les longueurs (ou les angles). <b>Donc</b> les longueurs (ou les angles) sont égales.</p></div>`},
{t:"Retrouver un centre de symétrie", h:`
  <div class="retenir" data-l="Propriété"><p>Le centre de symétrie est le milieu de chaque segment reliant un point et son symétrique.</p></div>
  <p><b>Méthode :</b> je relie deux points symétriques (par exemple A et A'), puis deux autres (B et B'). Le centre de symétrie est le point d'intersection des deux segments : c'est aussi leur milieu.</p>
  ${dt({A:[30,40],B:[110,30],C:[60,110],O:[170,90]},["A","B","C"],"O",{w:420})}`},
{t:"Centre de symétrie d'une figure", h:`
  <div class="retenir" data-l="Définition"><p>Un point est un centre de symétrie d'une figure si celle-ci se superpose à elle-même par un demi-tour autour de ce point.</p></div>
  <p>Exemples : le point A est un centre de symétrie de ces figures.</p>${co("p3-13","Trois logos qui ont un centre de symétrie A",330)}
  <h4>Centre et axes de symétrie des figures usuelles, à connaître !</h4>${LEG}
  ${cg(USU.map(([n,k,t])=>[n,usu(k,true),""]))}
  <div class="scroll"><table class="std"><thead><tr><th>Figure</th><th>Axes de symétrie</th><th>Centre de symétrie</th></tr></thead><tbody>
    <tr><td>Segment</td><td>2</td><td>son milieu</td></tr><tr><td>Cercle</td><td>une infinité (les diamètres)</td><td>son centre</td></tr>
    <tr><td>Carré</td><td>4</td><td>l'intersection des diagonales</td></tr><tr><td>Rectangle</td><td>2</td><td>l'intersection des diagonales</td></tr>
    <tr><td>Triangle isocèle</td><td>1</td><td>aucun</td></tr><tr><td>Triangle équilatéral</td><td>3</td><td>aucun</td></tr></tbody></table></div>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Rappel : construire par symétrie axiale", e:[
  {n:"Activité 1", t:"Les cocottes", w:"Sur ta feuille", h:`<p>Dans chaque cas, la cocotte grise a été obtenue à partir de la blanche par une transformation, c'est-à-dire que les deux cocottes se superposent en effectuant une manipulation.</p>
   <div class="cgrid"><figure><figcaption><b>Transformation 1 : la symétrie axiale.</b> En pliant selon une droite, les cocottes se superposent.</figcaption>${ex("p1-01","Pliage suivant une droite",250)}</figure><figure><figcaption><b>Transformation 2 : ……………</b> En effectuant un demi-tour autour d'un point, les cocottes se superposent.</figcaption>${ex("p1-02","Demi-tour autour d'un point",250)}</figure></div>
   <p>1) Complète le nom de la transformation 2.</p>
   <p>2) Quand c'est possible, associe chacune des figures ci-dessous à l'une des transformations ci-dessus. Indique la transformation et construis, à main levée, la droite ou le point.</p>
   ${ex("act1","Six paires de cocottes numérotées de 1 à 6",520)}`,
   c:`<p>1) Transformation 2 : la <b>symétrie centrale</b> (le demi-tour).</p>
   <p>2) Figure 1 : symétrie axiale · Figure 2 : symétrie centrale (demi-tour) · Figure 3 : symétrie axiale · Figure 4 : symétrie centrale (demi-tour) · Figure 5 : aucune des deux, la cocotte a seulement glissé : elle n'a été ni retournée, ni tournée · Figure 6 : symétrie centrale (demi-tour)</p>
   ${ex("act1c","Les axes et les centres tracés sur les six paires de cocottes",520)}
   <p>Les axes de symétrie sont en pointillés <b style="color:${AXC}">rouges</b>, les centres des demi-tours sont les croix <b style="color:${CTC}">bleues</b>.</p>`},
  {n:"Exercice 1", t:"Le symétrique par rapport à une droite", w:"Sur ta feuille", h:`<p>Construis le symétrique de chaque figure par rapport à la droite (d), avec la technique de ton choix.</p><div class="figs">${ex("p2-03","Triangle ABC et droite (d)",230)}${ex("p2-04","Quadrilatère ABCD et droite (d)",230)}</div>`,
   c:`<p>Pour chaque sommet, la droite (d) est la médiatrice du segment qui le relie à son image : je trace la perpendiculaire à (d) et je reporte la même distance de l'autre côté.</p>
   ${cg([["a)",sa(E1a,["A","B","C"],"d1","d2"),""],["b)",sa(E1b,["A","B","C","D"],"d1","d2"),""]])}`},
  {n:"Feuille · Exercice 8", t:"Sur quadrillage", w:"Sur ta feuille", h:`<p>En t'aidant du quadrillage, construis le symétrique de chaque triangle par rapport à la droite (d).</p><div class="figs">${img("5c2fc/p3-13.png","Triangle ABC sur quadrillage",150)}${img("5c2fc/p3-14.png","Triangle DCE sur quadrillage",220)}</div>`,
   c:`<p>Sur quadrillage, je compte les carreaux : chaque image est à la même distance de (d) que son point de départ, de l'autre côté.</p>
   ${cg([["a)",sa(F8a,["A","B","C"],"d1","d2",{grid:{c:6,r:13},s:22,t:0.85,w:170}),"(d) est horizontale : je compte les carreaux verticalement."],["b)",sa(F8b,["D","C","E"],"d1","d2",{grid:{c:8,r:8},s:30,t:0.02,w:260}),"(d) est en diagonale : je compte en diagonale, en traversant les carreaux."]])}`}
 ],
 aide:{t:"Pour démarrer", w:"Sur ton cahier", h:`<p>Sur quadrillage, le point A est à 3 carreaux à gauche d'une droite verticale (d). Où est son symétrique A' ?</p>`, c:`A' est sur la même ligne, à 3 carreaux à droite de (d).${sa({A:[1,2],d1:[4,0],d2:[4,4]},["A"],"d1","d2",{grid:{c:8,r:4},s:30,w:260})}`},
 defi:{t:"Deux symétries à la suite", w:"Sur ton cahier", h:`<p>Sur un quadrillage, place A, puis A₁ symétrique de A par rapport à une droite verticale (d₁), puis A₂ symétrique de A₁ par rapport à une droite horizontale (d₂). Que remarques-tu sur A et A₂ ?</p>`,
  c:`A₂ est le symétrique de A par rapport au point d'intersection des deux droites : faire deux symétries par rapport à deux droites perpendiculaires revient à faire un demi-tour.`}
},
{t:"Construire le symétrique par un demi-tour", e:[
  {n:"Activité 2", t:"Technique pour tracer l'image d'une figure par symétrie centrale", w:"Sur ta feuille", h:`<p>Trace l'image du triangle ABC par la symétrie de centre H. Tu la nommeras A'B'C'.</p>${ex("p2-05","Triangle ABC et point H",420)}`,
   c:`<p>Pour chaque sommet, je trace la demi-droite qui part du sommet et passe par H, puis je reporte au compas la même longueur de l'autre côté de H : H est le milieu de [AA'], de [BB'] et de [CC']. Je relie ensuite A', B' et C'.</p>${dt(FA2,["A","B","C"],"H",{w:420})}`},
  {n:"Feuille · Exercice 1", t:"Triangle HNP", w:"Sur ta feuille", h:`${img("5c2fc/p1-00.png","Triangle HNP et point Q",420)}<p>a) Trace le symétrique du triangle HNP par rapport au point Q. Nomme-le H'N'P'. b) Trace le symétrique du triangle HNP par rapport à P. Nomme-le H''N''P''.</p>`,
   c:`<p>a) Q est le milieu de [HH'], de [NN'] et de [PP'].</p>${dt(F1,["H","N","P"],"Q")}
   <p>b) Le centre est le sommet P : P'' = P, et P est le milieu de [HH''] et de [NN''].</p>${dt(F1,["H","N","P"],"P",{suf:"''",names:{P:"P = P''"}})}`},
  {n:"Feuille · Exercice 2", t:"Quadrilatère LIRE", w:"Sur ta feuille", h:`${img("5c2fc/p1-01.png","Quadrilatère LIRE et point V",420)}<p>a) Trace le symétrique de LIRE par rapport à V. Nomme-le L'I'R'E'. b) Trace le symétrique de LIRE par rapport à R. Nomme-le L''I''R''E''.</p>`,
   c:`${dt(F2,["L","I","R","E"],"V")}<p>b) R est sa propre image : R'' = R.</p>${dt(F2,["L","I","R","E"],"R",{suf:"''",names:{R:"R = R''"}})}`},
  {n:"Feuille · Exercice 3", t:"Un cercle", w:"Sur ta feuille", h:`${img("5c2fc/p1-02.png","Cercle de centre S et point U",380)}<p>Trace le symétrique du cercle (C) par rapport au point U. Nomme-le (C').</p>`,
   c:`<p>Je construis S', symétrique du centre S par rapport à U, puis je trace le cercle de centre S' et de <b>même rayon</b> (propriété 3).</p>
   ${geo({pts:{...F3,"S'":S(F3.S,F3.U)}, circles:[{c:"S",r:131},{c:"S'",r:131,k:"img"}], cons:[["S","U","S'",1]], marks:["U"]})}`},
  {n:"Feuille · Exercice 9", t:"Quadrilatère ABCD", w:"Sur ta feuille", h:`${img("5c2fc/p3-19.png","Quadrilatère ABCD et point O",300)}<p>Construis le symétrique du quadrilatère ABCD par rapport à O. Nomme-le A'B'C'D'.</p>`,
   c:`${dt(F9,["A","B","C","D"],"O")}`}
 ],
 aide:{t:"Pour démarrer", w:"Sur ton cahier", h:`<p>Place deux points A et O. Construis A', symétrique de A par rapport à O, en suivant les 3 étapes du cours.</p>`, c:`${methode}`},
 defi:{t:"Retrouver le centre", w:"Sur ta feuille", h:`<p>Les deux figures ci-dessous sont symétriques par rapport à un point C. Place le centre de symétrie C, en laissant les traits de construction visibles.</p>${co("p3-14","Deux quadrilatères GHIJ et G'H'I'J' symétriques",460)}`,
  c:`Je relie G à G', puis H à H' (deux points symétriques). Le centre C est le point d'intersection de [GG'] et [HH'] : c'est le milieu de chacun de ces segments. Je peux vérifier avec [II'] ou [JJ'], qui doit aussi passer par C.`}
},
{t:"Le demi-tour sur quadrillage", e:[
  {n:"Feuille · Exercice 4", t:"Par rapport au point F", w:"Sur ta feuille", h:`<p>En t'aidant du quadrillage, construis le symétrique du triangle DEC par rapport au point F. Nomme-le D'E'C'.</p><div class="figs">${img("5c2fc/p2-05.png","Triangle DEC et point F, figure 1",290)}${img("5c2fc/p2-06.png","Triangle DEC et point F, figure 2",270)}</div>`,
   c:`<p>Pour aller de F à l'image, je fais le même déplacement que pour aller du point à F. Exemple : de E à F, 4 carreaux vers la droite ; donc de F à E', encore 4 carreaux vers la droite.</p>
   <div class="figs">${lab("Figure 1",dt(F4a,["D","E","C"],"F",{grid:{c:10,r:4},s:40,w:440}))}${lab("Figure 2",dt(F4b,["D","E","C"],"F",{grid:{c:9,r:5},s:40,w:400}))}</div>`},
  {n:"Feuille · Exercice 5", t:"Par rapport au point E", w:"Sur ta feuille", h:`<p>En t'aidant du quadrillage, construis le symétrique du triangle DEC par rapport au point E. Nomme-le D'E'C'.</p><div class="figs">${img("5c2fc/p2-07.png","Triangle DEC, figure 1",270)}${img("5c2fc/p2-08.png","Triangle DEC, figure 2",220)}</div>`,
   c:`<p>Le centre est le sommet E : E' = E.</p><div class="figs">${lab("Figure 1",dt(F5a,["D","E","C"],"E",{grid:{c:9,r:3},s:40,w:400,names:{E:"E = E'"}}))}${lab("Figure 2",dt(F5b,["D","E","C"],"E",{grid:{c:7,r:6},s:40,w:320,names:{E:"E = E'"}}))}</div>`}
 ],
 aide:{t:"Pour démarrer", w:"Sur ton cahier", h:`${qg({A:[1,1],O:[3,2]},["A","O"])}<p>Pour aller de A à O : combien de carreaux vers la droite ? vers le bas ? Place A' en faisant le même déplacement à partir de O.</p>`,
  c:`De A à O : 2 carreaux à droite et 1 en bas. Donc de O à A' : encore 2 à droite et 1 en bas.${geo({pts:{A:[1,1],O:[3,2],"A'":[5,3]}, cons:[["A","O","A'",1]], marks:["A","O","A'"], grid:{c:8,r:6}, s:GR, w:300})}`},
 defi:{t:"Le centre caché", w:"Sur ton cahier", h:`<p>Les points A et A' sont symétriques par rapport à un point O que l'on a effacé. Reproduis la figure sur ton cahier et retrouve O.</p>${geo({pts:{A:[1,1],"A'":[7,5]}, marks:["A","A'"], grid:{c:8,r:6}, s:34, w:300})}`, c:`O est le milieu de [AA'] : je relie A et A', puis je place le milieu. Sur le quadrillage, de A à A' il y a 6 carreaux vers la droite et 4 vers le bas : O est à mi-chemin, 3 carreaux vers la droite et 2 vers le bas à partir de A.${geo({pts:{A:[1,1],O:[4,3],"A'":[7,5]}, cons:[["A","O","A'",1]], marks:["A","O","A'"], grid:{c:8,r:6}, s:34, w:300})}`}
},
{t:"Demi-tour ou symétrie axiale ?", e:[
  {n:"Feuille · Exercice 6", t:"Triangle RAP", w:"Sur ta feuille", h:`${img("5c2fc/p2-11.png","Triangle RAP, point B et droite (e)",360)}<p>a) Trace le symétrique du triangle RAP par rapport à la droite (e). Nomme-le R'A'P'. b) Trace le symétrique du triangle RAP par rapport au point B. Nomme-le R''A''P''.</p>`,
   c:`<p>a) Symétrie axiale : (e) est la médiatrice de [RR'], [AA'] et [PP'].</p>${sa(F6,["R","A","P"],"e1","e2",{lab:"(e)",t:0.05})}
   <p>b) Demi-tour : B est le milieu de [RR''], [AA''] et [PP''].</p>${dt(F6,["R","A","P"],"B",{suf:"''"})}`},
  {n:"Feuille · Exercice 7", t:"Encore le triangle RAP", w:"Sur ta feuille", h:`${img("5c2fc/p3-12.png","Triangle RAP",200)}<p>a) Trace le symétrique du triangle RAP par rapport à la droite (RA). Nomme-le R'A'P'. b) Trace le symétrique du triangle RAP par rapport au point A. Nomme-le R''A''P''.</p>`,
   c:`<p>a) R et A sont sur l'axe : ils sont leur propre image (R' = R, A' = A). Seul P bouge.</p>${sa(F7,["R","A","P"],"R","A",{lab:"(RA)",t:-0.15,names:{R:"R = R'",A:"A = A'"}})}
   <p>b) A est le centre : A'' = A.</p>${dt(F7,["R","A","P"],"A",{suf:"''",names:{A:"A = A''"}})}`}
 ],
 aide:{t:"Pour démarrer", w:"Sur ton cahier", h:`<p>Complète : pour une symétrie axiale, la droite est la ………… de [MM'] ; pour un demi-tour, le centre est le ………… de [MM'].</p>`, c:`médiatrice · milieu`},
 defi:{t:"Un point qui ne bouge pas", w:"Sur ton cahier", h:`<p>Par un demi-tour de centre O, quel est le seul point qui est sa propre image ? Et par une symétrie axiale d'axe (d) ?</p>`, c:`Pour un demi-tour, seul le centre O ne bouge pas. Pour une symétrie axiale, tous les points de l'axe (d) sont leur propre image.`}
},
{t:"Utiliser les propriétés pour justifier", note:`<b>Rédaction :</b> Je sais que … (les figures sont symétriques par rapport à …). Or le demi-tour conserve … Donc …`, e:[
  {n:"Activité 3", t:"Propriété de la symétrie centrale", w:"Sur ton cahier", h:`<p>Les quadrilatères AUDI et OPEL sont symétriques par rapport au point C. Les points R et S sont également symétriques par rapport au point C.</p>${ex("p3-07","Quadrilatères AUDI et OPEL, points R, S et C",300)}
   <p><b>Partie 1 – Repérer le symétrique d'un objet par rapport à un point.</b> Complète les phrases suivantes :</p>
   <p>a) Le symétrique du point A par rapport à C est …</p><p>b) Le symétrique du segment [ID] par rapport à C est …</p><p>c) Le symétrique de la droite (DU) par rapport à C est …</p><p>d) Le symétrique de l'angle IAR par rapport à C est …</p>
   <p><b>Partie 2 – Découverte de propriétés de conservation de la symétrie centrale.</b> Lorsqu'on construit le symétrique d'une figure par symétrie centrale, qu'ont en commun cette figure et son symétrique ? Complète :</p>
   <p>Propriété 1 : Si deux segments sont symétriques par rapport à un point, alors ils sont …</p><p>Propriété 2 : Si deux droites sont symétriques par rapport à un point, alors elles sont …</p><p>Propriété 3 : Si deux cercles sont symétriques par rapport à un point, alors …</p>${ex("p3-06","Deux cercles (C) et (C') de centres M et M', symétriques par rapport à O",300)}
   <p><b>Partie 3 – Répondre à une question en justifiant.</b> Le segment [ID] mesure 3 cm. Combien mesure le segment [EL] ? Justifie en t'aidant d'une propriété trouvée dans la partie 2.</p>`,
   c:`<p><b>Partie 1</b></p><p>a) Le point O.</p><p>b) Le segment [LE].</p><p>c) La droite (EP).</p><p>d) L'angle LOS.</p>
   <p><i>Les sommets se correspondent dans l'ordre : A et O, U et P, D et E, I et L.</i></p>
   <p><b>Partie 2</b></p><p>Propriété 1 : … alors ils sont <b>parallèles et de même longueur</b>.</p><p>Propriété 2 : … alors elles sont <b>parallèles</b>.</p><p>Propriété 3 : … alors ils ont le <b>même rayon</b> (et leurs centres sont symétriques).</p>
   <p><b>Partie 3</b></p><p>Je sais que les segments [ID] et [LE] sont symétriques par rapport au point C. Or si deux segments sont symétriques par rapport à un point, alors ils sont de même longueur. Donc EL = ID = 3 cm.</p>`},
  {n:"Exercice 2", t:"ABCD et IJKL", w:"Sur ton cahier", h:`${ex("p4-14","Quadrilatères ABCD et IJKL symétriques par rapport à O",420)}<p>Les quadrilatères ABCD et IJKL sont symétriques par rapport au point O. Chaque réponse doit être justifiée.</p><p>a) Détermine la longueur du segment [KL]. b) Détermine la mesure de l'angle <span class="ang">JIL</span>. c) Détermine le périmètre du quadrilatère IJKL.</p>`,
   c:`<p>Les sommets se correspondent dans l'ordre : A et I, B et J, C et K, D et L.</p>
   <p>a) Je sais que [KL] est le symétrique de [CD] par rapport à O. Or le demi-tour conserve les longueurs. Donc KL = CD = 4 cm (sur la figure, [CD] et [DA] ont le même codage, et DA = 4 cm).</p>
   <p>b) Je sais que l'angle <span class="ang">JIL</span> est le symétrique de l'angle <span class="ang">BAD</span>. Or le demi-tour conserve les mesures d'angles. Donc <span class="ang">JIL</span> = 122°.</p>
   <p>c) Le demi-tour conserve les longueurs, donc IJKL a le même périmètre que ABCD : 5 + 6 + 4 + 4 = 19 cm.</p>`}
 ],
 aide:{t:"Pour démarrer", w:"Sur ton cahier", h:`<p>Les segments [AB] et [A'B'] sont symétriques par rapport à O, et AB = 7 cm. Recopie et complète : Je sais que … Or … Donc A'B' = …</p>`, c:`Je sais que [AB] et [A'B'] sont symétriques par rapport au point O. Or le demi-tour conserve les longueurs. Donc A'B' = AB = 7 cm.`},
 defi:{t:"Avec des droites", w:"Sur ton cahier", h:`<p>Les triangles ABC et A'B'C' sont symétriques par rapport à O. Que peut-on dire des droites (BC) et (B'C') ? Justifie.</p>`, c:`Je sais que les droites (BC) et (B'C') sont symétriques par rapport au point O. Or si deux droites sont symétriques par rapport à un point, alors elles sont parallèles. Donc (BC) // (B'C').`}
},
{t:"Repérer des symétriques dans une rosace ou un pavage", e:[
  {n:"Activité 4", t:"Centre de symétrie et rosace", w:"Sur ta feuille", h:`<p><b>Partie 1 : Placer un centre de symétrie.</b> Revenons à l'activité de départ. On sait que les deux cocottes sont symétriques par rapport à un point. Place précisément le centre de symétrie de ces figures, que tu nommeras C. Laisse les traits de construction visibles.</p>
   <div class="figs">${lab("Cocottes 2",ex("p4-11","Cocotte 2 et son image",330))}${lab("Cocottes 4",ex("p4-12","Cocotte 4 et son image",260))}</div>
   <p><b>Partie 2 : Repérer des symétriques dans une rosace.</b> On considère l'hexagone régulier ABCDEF de centre O représenté ci-dessous. Complète les phrases suivantes :</p>${ex("p4-13","Hexagone régulier ABCDEF de centre O",220)}
   <p>a) Le symétrique du point A par rapport au point O est …</p><p>b) Le symétrique du point A par rapport à la droite (BO) est …</p><p>c) Le symétrique du triangle FOE par rapport au point O est …</p><p>d) Le symétrique du triangle FOE par rapport à la droite (FO) est …</p>`,
   c:`<p><b>Partie 1.</b> Le centre de symétrie est le milieu de chaque segment qui relie un point et son symétrique.<br>Je relie deux sommets de la cocotte blanche à leurs symétriques sur la cocotte grise (traits gris).<br>Le centre C (en <b style="color:${CTC}">bleu</b>) est le point d'intersection de ces deux segments : c'est aussi leur milieu.</p>
   <div class="figs">${lab("Cocottes 2",ex("p4-11c","Construction du centre C pour la cocotte 2",380))}${lab("Cocottes 4",ex("p4-12c","Construction du centre C pour la cocotte 4",300))}</div>
   <p><b>Partie 2.</b></p><p>a) Le point D (O est le milieu de [AD]).</p><p>b) Le point C (la droite (BO) passe aussi par E : c'est un axe de symétrie de l'hexagone).</p><p>c) Le triangle COB (F a pour symétrique C, O reste en O, E a pour symétrique B).</p><p>d) Le triangle FOA (F et O sont sur l'axe, E a pour symétrique A).</p>`},
  {n:"Exercice 4", t:"L'hexagone régulier", w:"Sur ton cahier", h:`${ex("p5-17","Hexagone régulier ABCDEF de centre O",260)}<p>Complète : a) Le symétrique du point E par rapport au point O est … b) Le symétrique du triangle COD par rapport au point O est … c) Le symétrique du point B par rapport à la droite (OC) est … d) Le symétrique du triangle ABO par rapport à la droite (AO) est … e) Le symétrique du point D par rapport à la droite (OB) est …</p>`,
   c:`a) B · b) le triangle FOA · c) D · d) le triangle AFO · e) F`},
  {n:"Exercice 5", t:"Le pavage de triangles équilatéraux", w:"Sur ton cahier", h:`${ex("p5-16","Pavage de triangles équilatéraux",390)}<p>a) Le symétrique du point E par rapport au point C est … b) Le symétrique du point E par rapport à la droite (CB) est … c) Le symétrique du triangle JKI par rapport au point K est … d) Le symétrique du triangle ACB par rapport au point E est … e) Le symétrique du triangle ADB par rapport à la droite (CZ) est …</p>`,
   c:`a) S · b) A · c) le triangle ZKB · d) le triangle LJM · e) le triangle EKB`},
  {n:"Exercice 5 (suite)", t:"Le pavage du carré", w:"Sur ton cahier", h:`${ex("p5-15","Pavage d'un carré ABCD de centre M",250)}<p>À partir du triangle BEJ, rectangle isocèle en J, on a obtenu ce pavage. a) Le symétrique du point F par rapport au point M est … b) Le symétrique du point E par rapport à la droite (BM) est … c) Le symétrique du triangle AHM par rapport au point M est … d) Le symétrique du triangle CGK par rapport au point K est … e) Le symétrique du triangle MHD par rapport à la droite (HM) est … f) Le symétrique du quadrilatère MDGF par rapport au point M est … g) Le symétrique du carré ABCD par rapport au point M est …</p>`,
   c:`a) H · b) F · c) le triangle CFM · d) le triangle MFK · e) le triangle MHA · f) le quadrilatère MBEH · g) le carré lui-même (A va en C, B en D, C en A, D en B)`}
 ],
 aide:{t:"Pour démarrer", w:"Sur ton cahier", h:`<p>Dans l'hexagone de l'exercice 4, quel est le symétrique du point A par rapport au point O ?</p>`, c:`D : O est le milieu de [AD].`},
 defi:{t:"Deux transformations", w:"Sur ton cahier", h:`<p>Dans l'hexagone de l'exercice 4, le symétrique du point A par rapport à la droite (BO) est … ? Et le symétrique du triangle FOE par rapport à la droite (FO) ?</p>`, c:`Le symétrique de A par rapport à (BO) est C. Le symétrique du triangle FOE par rapport à (FO) est le triangle FOA.`}
},
{t:"Axes et centres de symétrie", e:[
  {n:"Activité 5", t:"Axe de symétrie et centre de symétrie", w:"Sur ta feuille", h:`<div class="figs" style="align-items:center"><p style="flex:1;min-width:220px"><b>Propriété :</b> une droite (d) est un <b>axe de symétrie</b> d'une figure lorsque cette figure est son propre symétrique par rapport à cette droite (d).</p>${exM}</div><div class="figs" style="align-items:center"><p style="flex:1;min-width:220px"><b>Propriété :</b> un point O est le <b>centre de symétrie</b> d'une figure lorsque cette figure est son propre symétrique par rapport à ce point O.</p>${exH}</div><p><b>Exercice :</b> pour chaque lettre ou symbole, trace les axes de symétrie <b style="color:${AXC}">en rouge</b> et marque le centre de symétrie <b style="color:${CTC}">en bleu</b>, s'il en possède.</p>
   <div class="figs" style="align-items:center">${["E","L","X","cœur","carreau"].map(k=>sym5(k,false,70)).join("")}</div>`,
   c:`${LEG}${cg([["E",sym5("E",true,90),"1 axe horizontal, pas de centre."],["L",sym5("L",true,90),"Ni axe, ni centre."],["X",sym5("X",true,90),"2 axes et un centre."],["Cœur",sym5("cœur",true,90),"1 axe vertical, pas de centre."],["Carreau",sym5("carreau",true,90),"2 axes et un centre."]])}`},
  {n:"Exercice 6", t:"Figures usuelles", w:"Sur ta feuille", h:`<p>Pour chaque figure, trace les axes de symétrie <b style="color:${AXC}">en rouge</b> et marque le centre de symétrie <b style="color:${CTC}">en bleu</b>, quand elle en possède.</p>${cg(USU.map(([n,k])=>[n,usu(k,false),""]))}`,
   c:`${LEG}${cg(USU.map(([n,k,t])=>[n,usu(k,true),t]))}`}
 ],
 aide:{t:"Pour démarrer", w:"Sur ton cahier", h:`<p>La lettre H a-t-elle un centre de symétrie ? Fais un demi-tour avec ta feuille pour vérifier.</p>`, c:`Oui : le centre de la lettre H. Après un demi-tour, la lettre se superpose à elle-même. Elle a aussi 2 axes.`},
 defi:{t:"Des lettres sans axe", w:"Sur ton cahier", h:`<p>Trouve deux lettres majuscules qui ont un centre de symétrie mais aucun axe de symétrie.</p>`, c:`Par exemple N, S et Z : elles se superposent à elles-mêmes après un demi-tour, mais aucun pliage ne marche.`}
},
{t:"Bilan : QCM sur les symétries", e:[
  {n:"QCM", t:"Attention aux pièges !", w:"Sur ton cahier", h:`${ex("p7-44","Figures 1 à 4 du QCM",360)}
   <p><b>Question 1.</b> a) (d) est un axe de symétrie de la figure 1. b) (d) est un axe de symétrie de la figure 2. c) O est un centre de symétrie de la figure 3. d) O est un centre de symétrie de la figure 4.</p>
   <p><b>Question 2.</b> Par un demi-tour : a) le symétrique d'une droite est une droite parallèle ; b) le symétrique d'un cercle est un cercle de même rayon ; c) le symétrique d'un angle est un angle de même mesure ; d) le symétrique d'un carré est un carré.</p>
   <p><b>Question 3.</b> Ces propriétés sont toutes vraies pour le demi-tour. Lesquelles ne sont pas vraies pour la symétrie axiale ? a) La conservation des angles. b) La conservation des longueurs. c) La conservation du parallélisme. d) Le symétrique d'une droite est une droite parallèle.</p>
   <p><b>Question 4.</b> a) Si A est le milieu de [BC], alors B et C sont symétriques par rapport au point A. b) Si A et B sont symétriques par rapport à la droite (d), alors (d) est la médiatrice de [AB]. c) Si les segments [AB] et [CD] sont symétriques par rapport à une droite, alors les droites (AB) et (CD) sont parallèles.</p>
   <p><b>Question 5.</b> a) Si F' est le symétrique de F par rapport au point O, alors F est le symétrique de F' par rapport au point O. b) Si F' est le symétrique de F par rapport à la droite (d), alors F est le symétrique de F' par rapport à (d).</p>
   <p><b>Question 6.</b> ABC est un triangle équilatéral d'aire 10 cm². D et E sont les symétriques de B et A par rapport à C. F et G sont les symétriques de D et C par rapport à E. Quelle est l'aire du triangle FEG ? a) 90 cm² · b) 10 cm² · c) 30 cm² · d) 29,97 cm²</p>`,
   c:`<p><b>Question 1 :</b> b et d. Dans la figure 1, les deux bonshommes regardent du même côté : ce n'est pas un pliage. Dans la figure 3, un demi-tour autour de O ne superpose pas les deux oiseaux : O n'est pas un centre de symétrie.</p>
   <p><b>Question 2 :</b> a, b, c et d (toutes).</p>
   <p><b>Question 3 :</b> d seulement. Par une symétrie axiale, le symétrique d'une droite n'est pas forcément parallèle à cette droite.</p>
   <p><b>Question 4 :</b> a et b. La c est fausse : par une symétrie axiale, les droites ne sont pas forcément parallèles.</p>
   <p><b>Question 5 :</b> a et b.</p>
   <p><b>Question 6 :</b> b) 10 cm². DEC est l'image de BAC par le demi-tour de centre C, puis FEG est l'image de DEC par le demi-tour de centre E. Le demi-tour conserve les aires : l'aire reste 10 cm².</p>`}
 ]
}
],

/* ===================== QUIZ ===================== */
quiz:[
{nom:"Symétrie axiale ou demi-tour ?", q:{
 1:[ {q:"Quelle transformation permet de passer du motif 1 au motif 2 ?", fig:flags([{n:1,f:TF.id},{n:2,f:TF.vx(130)}],240,170), c:["Une symétrie axiale","Un demi-tour","Aucune des deux"], rep:"Une symétrie axiale", ex:"On peut plier suivant une droite verticale entre les deux motifs."},
     {q:"Quelle transformation permet de passer du motif 1 au motif 2 ?", fig:flags([{n:1,f:TF.id},{n:2,f:TF.rot(130,120)}],240,180), c:["Un demi-tour","Une symétrie axiale","Aucune des deux"], rep:"Un demi-tour", ex:"Le motif est retourné « tête en bas » et de l'autre côté : c'est un tour de 180°."} ],
 2:[ {q:"Quelle transformation permet de passer du motif 1 au motif 2 ?", fig:flags([{n:1,f:TF.id},{n:2,f:TF.tr(120,0)}],260,170), c:["Aucune des deux","Une symétrie axiale","Un demi-tour"], rep:"Aucune des deux", ex:"Le motif a seulement glissé : ni pliage, ni demi-tour."},
     {q:"Quelle transformation permet de passer du motif 1 au motif 2 ?", fig:flags([{n:1,f:TF.id},{n:2,f:TF.hy(165)}],140,260), c:["Une symétrie axiale","Un demi-tour","Aucune des deux"], rep:"Une symétrie axiale", ex:"On peut plier suivant une droite horizontale entre les deux motifs."} ],
 3:[ {q:"Quelle transformation permet de passer du motif 1 au motif 2 ?", fig:flags([{n:1,f:TF.id},{n:2,f:TF.o(TF.tr(120,0),TF.q(81,115))}],260,170), c:["Aucune des deux","Un demi-tour","Une symétrie axiale"], rep:"Aucune des deux", ex:"Le motif n'a tourné que d'un quart de tour."},
     {q:"Le motif 2 est l'image du motif 1 par une symétrie d'axe vertical, et le motif 3 l'image du motif 1 par une symétrie d'axe horizontal. Comment passe-t-on du motif 2 au motif 3 ?", fig:flags([{n:1,f:TF.id},{n:2,f:TF.vx(130)},{n:3,f:TF.hy(165)}],240,260), c:["Par un demi-tour","Par une symétrie axiale","Aucune des deux"], rep:"Par un demi-tour", ex:"Deux symétries d'axes perpendiculaires donnent un demi-tour autour du point d'intersection des axes."} ]
}},
{nom:"Symétrique d'un point", q:{
 1:[ {q:"Le point A' est le symétrique du point A par rapport au point O. Que représente O pour le segment [AA'] ?", c:["Son milieu","Sa médiatrice","Une extrémité"], rep:"Son milieu"},
     {q:"Quel point est le symétrique de A par rapport à O ?", fig:qg({A:[1,1],O:[3,3],B:[5,5],C:[5,1],D:[1,5],E:[4,4]},["A","O","B","C","D","E"]), c:["B","C","D","E"], rep:"B", ex:"De A à O : 2 carreaux à droite, 2 en bas. On continue pareil à partir de O : on arrive en B."} ],
 2:[ {q:"Quel point est le symétrique de A par rapport à O ?", fig:qg({A:[2,5],O:[4,3],F:[6,1],G:[6,5],H:[2,1],K:[5,2]},["A","O","F","G","H","K"]), c:["F","G","H","K"], rep:"F", ex:"De A à O : 2 à droite, 2 en haut. On recommence à partir de O : F."},
     {q:"Dans l'hexagone régulier ABCDEF de centre O, quel est le symétrique de A par rapport à O ?", fig:ex("p5-17","Hexagone régulier ABCDEF de centre O",220), c:["D","C","E","B"], rep:"D", ex:"O est le milieu de [AD]."} ],
 3:[ {q:"Le centre du demi-tour est le sommet P du triangle PIC. Quel est le symétrique de P ?", c:["P lui-même","Le milieu de [IC]","Le point C"], rep:"P lui-même", ex:"Le centre est le seul point qui ne bouge pas."},
     {q:"Pour aller de A à O, on se déplace de 3 carreaux vers la droite et de 1 carreau vers le bas. Complète pour placer A', symétrique de A par rapport à O.", fig:geo({pts:{A:[1,1],O:[4,2]}, marks:["A","O"], grid:{c:8,r:4}, s:34, w:300}), t:"À partir de O : □ carreaux vers la droite et □ carreau vers le bas.", r:["3","1"], ex:"On refait exactement le même déplacement à partir de O : O est le milieu de [AA'].", sx:`<figure class="schFig">${geo({pts:{A:[1,1],O:[4,2],"A'":[7,3]}, cons:[["A","O","A'",1]], marks:["A","O","A'"], grid:{c:8,r:4}, s:34, w:300})}<figcaption>3 carreaux vers la droite et 1 vers le bas, deux fois de suite.</figcaption></figure>`},
     {q:"Deux figures sont symétriques par rapport à un point inconnu. Comment trouver le centre ?", c:["Je relie deux points symétriques : le centre est le milieu du segment","Je trace la médiatrice d'un côté","Je prends le milieu d'un côté de la figure"], rep:"Je relie deux points symétriques : le centre est le milieu du segment"} ]
}},
{nom:"Construire avec le compas", q:{
 1:[ {q:"Pour construire A', symétrique de A par rapport à O, que trace-t-on d'abord ?", c:["La demi-droite [AO)","La médiatrice de [AO]","Un cercle de centre A"], rep:"La demi-droite [AO)"},
     {q:"Avec le compas, quelle longueur reporte-t-on de l'autre côté de O ?", c:["OA","Le double de OA","La moitié de OA"], rep:"OA", ex:"Ainsi OA' = OA et O est le milieu de [AA']."} ],
 2:[ {q:"Pour construire le symétrique d'un triangle par un demi-tour, on construit :", c:["le symétrique de chaque sommet, puis on relie dans le même ordre","le symétrique d'un seul sommet","le symétrique du milieu de chaque côté"], rep:"le symétrique de chaque sommet, puis on relie dans le même ordre"},
     {q:"Pour construire le symétrique d'un cercle de centre S par rapport à U, on construit :", c:["S', symétrique de S, puis le cercle de centre S' de même rayon","un cercle de centre U","un cercle de rayon double"], rep:"S', symétrique de S, puis le cercle de centre S' de même rayon"} ],
 3:[ {q:"OA = 4,5 cm. Combien mesure le segment [AA'] ?", t:"AA' = □ cm", r:[["9","9,0"]], ex:"O est le milieu de [AA'] : AA' = 2 × 4,5 = 9 cm."},
     {q:"Par une symétrie axiale d'axe (d), où place-t-on l'image M' de M ?", c:["Sur la perpendiculaire à (d) passant par M, à la même distance de (d)","Sur la parallèle à (d) passant par M","Sur la droite qui relie M au milieu de (d)"], rep:"Sur la perpendiculaire à (d) passant par M, à la même distance de (d)"} ]
}},
{nom:"Propriétés du demi-tour", q:{
 1:[ {q:"Le demi-tour conserve-t-il les longueurs ?", c:ON, rep:"Oui"},
     {q:"Le demi-tour conserve-t-il les mesures d'angles ?", c:ON, rep:"Oui"},
     {q:"Le demi-tour conserve-t-il les aires ?", c:ON, rep:"Oui"} ],
 2:[ {q:"Par un demi-tour, le symétrique d'une droite est :", c:["une droite parallèle","une droite perpendiculaire","une droite qui la coupe"], rep:"une droite parallèle", ex:"Propriété 2 du cours."},
     {q:"Deux segments symétriques par rapport à un point sont :", c:["parallèles et de même longueur","perpendiculaires et de même longueur","parallèles, mais pas forcément de même longueur"], rep:"parallèles et de même longueur"},
     {q:"Le symétrique d'un cercle de rayon 3 cm par un demi-tour est :", c:["un cercle de rayon 3 cm","un cercle de rayon 6 cm","un cercle de même centre"], rep:"un cercle de rayon 3 cm"} ],
 3:[ {q:"Vrai ou faux : par une symétrie axiale, le symétrique d'une droite est toujours une droite parallèle.", c:VF, rep:"Faux", ex:"C'est vrai pour le demi-tour, pas pour la symétrie axiale."},
     {q:"Vrai ou faux : par un demi-tour, le symétrique d'un carré est un carré de même taille.", c:VF, rep:"Vrai", ex:"Le demi-tour conserve les longueurs et les angles."},
     {q:"Un triangle d'aire 10 cm² subit deux demi-tours de suite. Quelle est l'aire du triangle obtenu ?", t:"□ cm²", r:["10"], ex:"Le demi-tour conserve les aires, même plusieurs fois."} ]
}},
{nom:"Justifier une longueur ou un angle", q:{
 1:[ {q:"Les triangles ABC et DEF sont symétriques par rapport à O (A et D, B et E, C et F se correspondent). AB = 5 cm.", t:"DE = □ cm", r:["5"], ex:"Le demi-tour conserve les longueurs."},
     {q:"Dans « Je sais que… Or… Donc… », que met-on après « Or » ?", c:["La propriété : le demi-tour conserve les longueurs","Ce qu'on cherche","La réponse finale"], rep:"La propriété : le demi-tour conserve les longueurs"} ],
 2:[ {q:"Les triangles ABC et MNP sont symétriques par rapport à O (A et M, B et N, C et P se correspondent). L'angle ABC mesure 110°.", t:"L'angle MNP mesure □°", r:["110"], ex:"Le demi-tour conserve les mesures d'angles."},
     {q:"Les quadrilatères ABCD et IJKL sont symétriques par rapport à O. Le segment [KL] est le symétrique de :", c:["[CD]","[AB]","[BC]","[DA]"], rep:"[CD]", ex:"Les sommets se correspondent dans l'ordre : K avec C, L avec D."} ],
 3:[ {q:"ABCD et IJKL sont symétriques par rapport à O. AB = 5 cm, BC = 6 cm, CD = 4 cm et DA = 4 cm. Quel est le périmètre de IJKL ?", t:"□ cm", r:["19"], ex:"Même périmètre : 5 + 6 + 4 + 4 = 19 cm."},
     {q:"RST et UVW sont symétriques par rapport à O (R et U, S et V, T et W). RT = 3,5 cm. Combien mesure [UW] ?", t:"UW = □ cm", r:[["3,5","3.5"]], ex:"[UW] est le symétrique de [RT]."},
     {q:"KLM et XYZ sont symétriques par rapport à O. Dans KLM, les angles en K et en L mesurent 115° et 35°. Combien mesure l'angle en Z ?", t:"□°", r:["30"], ex:"Dans KLM, l'angle en M mesure 180 − 115 − 35 = 30°, et l'angle en Z est son symétrique."} ]
}},
{nom:"Centre et axes de symétrie d'une figure", q:{
 1:[ {q:"Le carré a-t-il un centre de symétrie ?", c:ON, rep:"Oui", ex:"Le point d'intersection de ses diagonales."},
     {q:"Le triangle équilatéral a-t-il un centre de symétrie ?", c:ON, rep:"Non", ex:"Il a 3 axes, mais pas de centre."},
     {q:"Où est le centre de symétrie d'un segment ?", c:["En son milieu","À une extrémité","Il n'en a pas"], rep:"En son milieu"} ],
 2:[ {q:"Combien d'axes de symétrie a un rectangle (qui n'est pas un carré) ?", c:["2","4","1","0"], rep:"2"},
     {q:"Combien d'axes de symétrie a un carré ?", c:["4","2","1","Une infinité"], rep:"4"},
     {q:"Combien d'axes de symétrie a un cercle ?", c:["Une infinité","4","2","1"], rep:"Une infinité", ex:"Tous ses diamètres."} ],
 3:[ {q:"Laquelle de ces lettres a un centre de symétrie mais aucun axe ?", c:["N","A","E","T"], rep:"N"},
     {q:"Quelle lettre a à la fois deux axes et un centre de symétrie ?", c:["H","A","N","L"], rep:"H"},
     {q:"Le triangle isocèle a :", c:["1 axe et pas de centre","1 axe et un centre","3 axes et pas de centre","aucun axe"], rep:"1 axe et pas de centre"} ]
}},
{nom:"Rappel : symétrie axiale", q:{
 1:[ {q:"M' est le symétrique de M par rapport à la droite (d). Que représente (d) pour le segment [MM'] ?", c:["Sa médiatrice","Son milieu","Une parallèle"], rep:"Sa médiatrice", ex:"(d) est perpendiculaire à [MM'] et passe par son milieu."},
     {q:"Par une symétrie axiale, où est l'image d'un point situé sur l'axe ?", c:["C'est le point lui-même","De l'autre côté de l'axe","On ne peut pas la construire"], rep:"C'est le point lui-même"} ],
 2:[ {q:"Sur quadrillage, A est à 3 carreaux à gauche d'un axe vertical. Où est son image A' ?", c:["À 3 carreaux à droite de l'axe, sur la même ligne","À 6 carreaux à droite de l'axe","Sur l'axe"], rep:"À 3 carreaux à droite de l'axe, sur la même ligne"},
     {q:"La symétrie axiale conserve-t-elle les longueurs ?", c:ON, rep:"Oui"} ],
 3:[ {q:"Vrai ou faux : si [AB] et [CD] sont symétriques par rapport à une droite, alors (AB) et (CD) sont parallèles.", c:VF, rep:"Faux", ex:"Ce n'est vrai que pour le demi-tour."},
     {q:"Vrai ou faux : si A et B sont symétriques par rapport à la droite (d), alors (d) est la médiatrice de [AB].", c:VF, rep:"Vrai"} ]
}}
],
eval: window.EVAL5_1
};
/* figures réutilisées par les schémas de « Je m'entraîne » */
window.FIG5 = {dt, sa, methode, usu, USU, step, AXC, CTC, LEG};
})();
