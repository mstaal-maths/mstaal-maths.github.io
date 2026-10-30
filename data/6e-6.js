/* 6e — Chapitre 6 : Médiatrice et triangles (cours et fiche d'exercices de M. Staal)
   Figures : images tirées de ses fiches ; corrections : tracées en vraie grandeur sur une copie de la fiche, ou SVG calculés. */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const fr = x => String(Math.round(x*100)/100).replace(".",",");
const co = (p,alt,w) => img("c66co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("c66ex/"+p+".png", alt, w);
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const BLUE="#1e5aa8", RED="#d0342c", GREEN="#2e8b57";

/* ------------------------------------------------------------------
   Triangle en SVG.  P = {A:[x,y],…} en cm (y vers le bas) ; o.lens [[A,B,texte]] ; o.ticks [[A,B,n]] ; o.right [sommet, voisin1, voisin2]
   o.med [[A,B]] médiatrices ; o.circ [centre, rayon] ; o.pts points en plus ; o.k échelle (px par cm)
------------------------------------------------------------------ */
function triSVG(P, o={}){
  const k=o.k||34, names=Object.keys(P), xs=names.map(n=>P[n][0]), ys=names.map(n=>P[n][1]);
  let x0=Math.min(...xs), x1=Math.max(...xs), y0=Math.min(...ys), y1=Math.max(...ys);
  if(o.bb){ x0=Math.min(x0,o.bb[0]); y0=Math.min(y0,o.bb[1]); x1=Math.max(x1,o.bb[2]); y1=Math.max(y1,o.bb[3]); }
  if(o.circ){ const [c,r]=o.circ; x0=Math.min(x0,c[0]-r); x1=Math.max(x1,c[0]+r); y0=Math.min(y0,c[1]-r); y1=Math.max(y1,c[1]+r); }
  const pad=1.0, px=o.lens&&o.lens.length?Math.max(1.0,62/k):1.0, W=(x1-x0)*k+2*px*k, H=(y1-y0+2*pad)*k, X=p=>(p[0]-x0+px)*k, Y=p=>(p[1]-y0+pad)*k;
  const G=[xs.reduce((a,b)=>a+b)/xs.length, ys.reduce((a,b)=>a+b)/ys.length];
  let s=`<svg class="fig" viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" width="${W.toFixed(0)}" role="img" aria-label="${o.alt||"Triangle"}">`;
  if(o.circ){ const [c,r]=o.circ; s+=`<circle cx="${X(c)}" cy="${Y(c)}" r="${r*k}" style="fill:none;stroke:${RED};stroke-width:2"/>`; }
  (o.med||[]).forEach(([a,b])=>{ const A=P[a],B=P[b],m=[(A[0]+B[0])/2,(A[1]+B[1])/2],dx=B[0]-A[0],dy=B[1]-A[1],L=Math.hypot(dx,dy),u=[-dy/L,dx/L],e=o.medExt||2.2;
    s+=`<line x1="${X([m[0]-u[0]*e,m[1]-u[1]*e])}" y1="${Y([m[0]-u[0]*e,m[1]-u[1]*e])}" x2="${X([m[0]+u[0]*e,m[1]+u[1]*e])}" y2="${Y([m[0]+u[0]*e,m[1]+u[1]*e])}" style="stroke:${BLUE};stroke-width:1.6"/>`; });
  const tri=o.poly||names.slice(0,3);
  s+=`<polygon points="${tri.map(n=>X(P[n])+","+Y(P[n])).join(" ")}" style="fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/>`;
  (o.extra||[]).forEach(([a,b,col])=>{ s+=`<line x1="${X(P[a])}" y1="${Y(P[a])}" x2="${X(P[b])}" y2="${Y(P[b])}" style="stroke:${col||"var(--ink)"};stroke-width:2"/>`; });
  (o.ticks||[]).forEach(([a,b,n])=>{ const A=P[a],B=P[b],m=[(X(A)+X(B))/2,(Y(A)+Y(B))/2],dx=X(B)-X(A),dy=Y(B)-Y(A),L=Math.hypot(dx,dy),u=[dx/L,dy/L],v=[-u[1],u[0]];
    for(let i=0;i<n;i++){ const c=[m[0]+u[0]*(i-(n-1)/2)*5,m[1]+u[1]*(i-(n-1)/2)*5]; s+=`<line x1="${c[0]-v[0]*6-u[0]*2}" y1="${c[1]-v[1]*6-u[1]*2}" x2="${c[0]+v[0]*6+u[0]*2}" y2="${c[1]+v[1]*6+u[1]*2}" style="stroke:${RED};stroke-width:2"/>`; } });
  if(o.right){ const [c,a,b]=o.right.map(n=>typeof n==="string"?P[n]:n), q=10/k, ua=[(a[0]-c[0]),(a[1]-c[1])], ub=[(b[0]-c[0]),(b[1]-c[1])], la=Math.hypot(...ua), lb=Math.hypot(...ub);
    const p1=[c[0]+ua[0]/la*q,c[1]+ua[1]/la*q], p3=[c[0]+ub[0]/lb*q,c[1]+ub[1]/lb*q], p2=[p1[0]+ub[0]/lb*q,p1[1]+ub[1]/lb*q];
    s+=`<path d="M${X(p1)} ${Y(p1)} L${X(p2)} ${Y(p2)} L${X(p3)} ${Y(p3)}" style="fill:none;stroke:${RED};stroke-width:1.6"/>`; }
  /* longueurs : à côté du côté, sans chevaucher le trait ; décalées vers une extrémité si le milieu porte un codage ou une médiatrice */
  const busy=(a,b)=>[...(o.ticks||[]).filter(t=>t[2]>0),...(o.med||[])].some(([p,q])=>(p===a&&q===b)||(p===b&&q===a));
  (o.lens||[]).forEach(([a,b,t,f])=>{ const A=P[a],B=P[b]; f=f??(busy(a,b)?0.28:0.5);
    const m=[A[0]+(B[0]-A[0])*f,A[1]+(B[1]-A[1])*f], L=Math.hypot(B[0]-A[0],B[1]-A[1])||1; let n=[-(B[1]-A[1])/L,(B[0]-A[0])/L];
    if(n[0]*(m[0]-G[0])+n[1]*(m[1]-G[1])<0) n=[-n[0],-n[1]];
    const cl=(Math.abs(n[0])*String(t).length*4.3+Math.abs(n[1])*7+7)/k, q=[m[0]+n[0]*cl,m[1]+n[1]*cl];
    s+=`<text x="${X(q)}" y="${Y(q)+5}" text-anchor="middle" style="font-size:14px;fill:${BLUE};font-weight:600">${t}</text>`; });
  /* points en plus (ex. centre O) : [nom, [x,y], [dx,dy] décalage de l'étiquette en cm, couleur] */
  (o.dots||[]).forEach(([n,p,d,col])=>{ s+=cross(X(p),Y(p),"ln")+`<text x="${X([p[0]+d[0],p[1]+d[1]])}" y="${Y([p[0]+d[0],p[1]+d[1]])+6}" text-anchor="middle" style="font-size:16px;font-weight:600;fill:${col||"var(--ink)"}">${n}</text>`; });
  names.forEach(n=>{ const p=P[n], v=[p[0]-G[0],p[1]-G[1]], L=Math.hypot(...v)||1, q=[p[0]+v[0]/L*0.45,p[1]+v[1]/L*0.45];
    s+=cross(X(p),Y(p),"ln")+`<text x="${X(q)}" y="${Y(q)+6}" text-anchor="middle" style="font-size:16px;font-weight:600;fill:var(--ink)">${n}</text>`; });
  return s+"</svg>";
}
/* triangle ABC à partir des longueurs : [AB] horizontal, C au-dessus */
function byLen(nA,nB,nC,ab,ac,bc){ const x=(ab*ab+ac*ac-bc*bc)/(2*ab), y=Math.sqrt(Math.max(0,ac*ac-x*x)); return {[nA]:[0,y],[nB]:[ab,y],[nC]:[x,0]}; }
/* triangle rectangle en R : côtés de l'angle droit a (vers la droite) et b (vers le haut) */
function rect(nR,nA,nB,a,b){ return {[nR]:[0,b],[nA]:[a,b],[nB]:[0,0]}; }
window.FIG6 = {triSVG, byLen, rect};

/* ===================== schémas (rappels en image) ===================== */
const S_MED = sch("La médiatrice", triSVG({A:[0,1.6],I:[2.5,1.6],B:[5,1.6]},{poly:["A","B"], med:[["A","B"]], medExt:1.5, bb:[0,0.1,5,3.1], ticks:[["A","I",1],["I","B",1]], right:["I","B",[2.5,0.5]], alt:"Médiatrice de [AB]"})+`<p class="schN">C'est la droite <b>perpendiculaire</b> au segment, qui passe par son <b>milieu</b>. Il faut les deux !</p>`);
const S_EQ = sch("Sur la médiatrice : même distance", co("mamb","M sur la médiatrice de [AB] : MA = MB",190)+`<p class="schN">Un point de la médiatrice de [AB] est à la même distance de A et de B (MA = MB). Et réciproquement : si MA = MB, alors M est sur la médiatrice de [AB].</p>`);
const S_TRI = sch("Les triangles particuliers", co("types","Triangle quelconque, isocèle, équilatéral, rectangle",440)+`<p class="schN">isocèle : 2 côtés de même longueur · équilatéral : 3 côtés de même longueur · rectangle : un angle droit.</p>`);
const S_VOC = sch("Sommets et côtés", co("vocab","Le triangle ABC, ses sommets et ses côtés",170)+`<p class="schN">Le triangle ABC a 3 sommets (A, B, C) et 3 côtés ([AB], [BC], [AC]).</p>`);
const S_CONS = sch("Construire un triangle", co("etapes","Les trois étapes de la construction",430)+`<p class="schN">Je trace d'abord un côté, puis je cherche le troisième sommet avec deux arcs de cercle.</p>`);
const S_CIRC = sch("Le cercle circonscrit", co("circ","Le cercle circonscrit et le point O",190)+`<p class="schN">Son centre O est le point où se coupent les médiatrices : OA = OB = OC.</p>`);

CH["6e-6"] = {
intro:"Construire la médiatrice d'un segment et utiliser ses propriétés, reconnaître et construire des triangles, puis tracer les trois médiatrices d'un triangle et son cercle circonscrit.",
savoir:[
  "construire la médiatrice d'un segment, à la règle et à l'équerre puis au compas ;",
  "utiliser les deux propriétés de la médiatrice pour justifier ou calculer une longueur ;",
  "reconnaître et coder un triangle quelconque, isocèle, équilatéral ou rectangle ;",
  "construire un triangle à partir d'un énoncé, après avoir fait un dessin à main levée ;",
  "construire les trois médiatrices d'un triangle et son cercle circonscrit."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"La médiatrice d'un segment", h:`
  <h4>1. Définition</h4>
  <div class="retenir" data-l="Définition"><p>La <b>médiatrice</b> d'un segment est la droite <b>perpendiculaire</b> à ce segment qui passe par son <b>milieu</b>.</p></div>
  ${co("def","La droite (d), médiatrice de [AB]",230)}
  <p>La droite (d) est la médiatrice du segment [AB] : elle coupe [AB] en son milieu I et forme un angle droit avec lui.</p>
  <h4>2. Construire la médiatrice à la règle et à l'équerre</h4>
  <div class="retenir" data-l="Méthode"><ol><li>Je mesure [LT] et je place précisément son milieu I.</li><li>Je trace, à l'équerre, la droite perpendiculaire à [LT] passant par I.</li></ol></div>
  <div class="anim" data-anim="6e6-mediatrice-equerre"></div>
  ${co("equerre","1. Je place le milieu I de [LT]. 2. Je trace la perpendiculaire à [LT] passant par I.",470)}
  <h4>3. Une propriété de la médiatrice</h4>
  <div class="retenir" data-l="Propriété"><p>La médiatrice d'un segment est formée de <b>tous les points situés à la même distance</b> (on dit <b>équidistants</b>) des deux extrémités du segment.</p></div>
  ${co("mamb","MA = MB",210)}
  <p>Quel que soit le point M choisi sur la médiatrice, on a toujours MA = MB.</p>
  <h4>4. Construire la médiatrice au compas</h4>
  <div class="retenir" data-l="Méthode"><ol><li>J'écarte le compas de plus de la moitié de [LT].</li><li>Je pique en L et je trace deux arcs, de part et d'autre du segment.</li><li>Sans changer l'écartement, je pique en T et je trace deux arcs : ils coupent les premiers en A et B.</li><li>Je trace la droite (AB) : c'est la médiatrice de [LT].</li></ol></div>
  <div class="anim" data-anim="mediatrice-compas"></div>
  ${co("compas","La médiatrice (m) de [LT] construite au compas",240)}
  <p><b>Remarque :</b> A et B sont à la même distance de L et de T : d'après la propriété, ils sont donc bien sur la médiatrice.</p>
  <h4>5. Deux propriétés pour justifier</h4>
  <div class="retenir" data-l="Propriété (1)"><p><b>Si</b> un point est équidistant des extrémités d'un segment, <b>alors</b> il appartient à la médiatrice de ce segment.</p></div>
  <div class="retenir" data-l="Propriété (2)"><p><b>Si</b> un point appartient à la médiatrice d'un segment, <b>alors</b> il est équidistant des extrémités de ce segment.</p></div>
  ${co("props","JH = JE donc J est sur la médiatrice de [HE] ; S sur la médiatrice donc SB = SW",470)}
  <p><b>Exemple rédigé :</b> d est la médiatrice de [BW] et S appartient à d, avec SB = 4 cm.</p>
  <p class="calc" style="white-space:normal">« S appartient à la médiatrice de [BW], donc S est à la même distance de B et de W. Donc SW = SB = 4 cm. »</p>`},
{k:"II", t:"Les triangles", h:`
  <h4>1. Vocabulaire</h4>
  <div class="cgrid"><figure>${co("vocab","Le triangle ABC avec ses côtés",180)}</figure><figure><figcaption>Le triangle ABC a :<br>• trois <b>sommets</b> : A, B et C ;<br>• trois <b>côtés</b> : [AB], [BC] et [AC].<br><br>On peut le nommer ABC, mais aussi BCA, CAB, ACB…</figcaption></figure></div>
  <h4>2. Les triangles particuliers</h4>
  <div class="retenir" data-l="À retenir"><ul><li>Un triangle <b>isocèle</b> a deux côtés de même longueur.</li><li>Un triangle <b>équilatéral</b> a trois côtés de même longueur.</li><li>Un triangle <b>rectangle</b> a un angle droit.</li><li>Un triangle <b>quelconque</b> n'a rien de particulier.</li></ul></div>
  ${co("types","Triangle quelconque, isocèle, équilatéral, rectangle",470)}
  <p class="attention"><b>ATTENTION :</b> le <b>codage</b> de la figure est obligatoire : un même petit trait sur deux côtés signifie qu'ils ont la même longueur, et le petit carré signale l'angle droit.</p>
  <p><b>Remarque :</b> un triangle à la fois rectangle et isocèle existe : on dit qu'il est <b>rectangle isocèle</b>.</p>
  <h4>3. Faire un dessin à main levée</h4>
  <p>Avant de construire un triangle, on fait toujours un dessin à main levée : il permet d'imaginer la figure et d'y placer les informations.</p>
  <div class="retenir" data-l="Méthode"><ol><li>Je trace la figure rapidement, à main levée.</li><li>J'écris les lettres : sommets, centre d'un cercle…</li><li>Je place les informations au bon endroit : longueurs, codage, angle droit.</li></ol></div>
  <h4>4. Construire un triangle dont on connaît les trois longueurs</h4>
  <p><b>Exemple :</b> construire le triangle ABC tel que BC = 4 cm, AB = 3 cm et AC = 3,5 cm.</p>
  ${co("etapes","Étape 1 : je trace [BC] = 4 cm. Étape 2 : arc de 3 cm depuis B, de 3,5 cm depuis C. Étape 3 : A est le point d'intersection.",470)}
  <div class="anim" data-anim="6e6-triangle-3-longueurs"></div>
  <p><b>Remarque :</b> on trace toujours en premier le côté dont on connaît la longueur, puis on cherche le troisième sommet avec le compas.</p>
  <h4>5. Les autres constructions</h4>
  <div class="scroll"><table class="std"><thead><tr><th>Triangle</th><th>Ce que je trace</th></tr></thead><tbody>
   <tr><td><b>isocèle en A</b> (AB = AC)</td><td>je trace [BC], puis deux arcs de même écartement depuis B et depuis C : ils se coupent en A.</td></tr>
   <tr><td><b>équilatéral de côté 5 cm</b></td><td>je trace [BC] = 5 cm, puis deux arcs de 5 cm depuis B et depuis C.</td></tr>
   <tr><td><b>rectangle en A</b></td><td>je trace l'angle droit à l'équerre en A, puis je reporte les deux longueurs sur ses côtés.</td></tr></tbody></table></div>
  <div class="anim" data-anim="6e6-triangle-rectangle"></div>`},
{k:"III", t:"Les médiatrices d'un triangle et le cercle circonscrit", h:`
  <h4>1. Les trois médiatrices sont concourantes</h4>
  <div class="retenir" data-l="Propriété"><p>Les trois médiatrices d'un triangle se coupent en un même point : on dit qu'elles sont <b>concourantes</b>.</p></div>
  ${co("concours","Les trois médiatrices du triangle ABC se coupent en O",220)}
  <h4>2. Le cercle circonscrit</h4>
  <p>Le point de concours O appartient aux trois médiatrices. D'après la propriété (2) :</p>
  <ul><li>O est sur la médiatrice de [AB], donc OA = OB ;</li><li>O est sur la médiatrice de [BC], donc OB = OC.</li></ul>
  <p>On a donc <b>OA = OB = OC</b> : le point O est à la même distance des trois sommets.</p>
  <div class="retenir" data-l="Définition"><p>Le <b>cercle circonscrit</b> à un triangle est le cercle qui passe par ses trois sommets. Son centre est le point de concours des médiatrices, et son rayon est la distance de ce point à un sommet.</p></div>
  ${co("circ","Le cercle circonscrit au triangle ABC",220)}
  <h4>3. Méthode de construction</h4>
  <div class="retenir" data-l="Méthode"><ol><li>Je trace la médiatrice d'un premier côté.</li><li>Je trace la médiatrice d'un deuxième côté.</li><li>Je note O leur point d'intersection.</li><li>Je trace le cercle de centre O qui passe par un sommet : il passe aussi par les deux autres.</li></ol></div>
  <div class="anim" data-anim="6e6-cercle-circonscrit"></div>
  <p><b>Remarque :</b> deux médiatrices suffisent pour trouver O. La troisième sert à vérifier : elle doit passer par O.</p>`}
],

/* ===================== EXERCICES (dans l'ordre de la fiche) ===================== */
exos:[
{t:"La médiatrice d'un segment", e:[
  {n:"Activité 1", t:"Tracer la médiatrice à la règle et à l'équerre", w:"Sur ta feuille", h:`<p>Trace la médiatrice (d) du segment [AB] ci-dessous, puis code ta figure.</p>${ex("act1","Le segment [AB]",460)}`,
   c:`<p>1) Je mesure [AB] : AB = 8 cm. Son milieu I est donc à 4 cm de A.</p><p>2) Je place I, puis je trace à l'équerre la droite perpendiculaire à [AB] passant par I.</p><p>3) Je code : un même petit trait sur [AI] et [IB], et un petit carré pour l'angle droit.</p>${ex("act1c","La médiatrice (d) de [AB], codée",460)}<p><i>Mesure faite sur la fiche imprimée.</i></p>`},
  {n:"Exercice 1", t:"Est-ce bien la médiatrice ?", w:"Sur ta feuille", h:`<p>Dans chaque cas, la droite (m) est-elle la médiatrice du segment [MN] ? Réponds par oui ou non, et justifie.</p>${ex("e1","Quatre cas : la droite (m) et le segment [MN]",490)}`,
   c:`<p><b>Cas 1 : non.</b> (m) est perpendiculaire à [MN] (angle droit codé), mais elle ne passe pas par le milieu de [MN].</p>
   <p><b>Cas 2 : non.</b> (m) passe par le milieu de [MN] (codage), mais elle n'est pas perpendiculaire à [MN].</p>
   <p><b>Cas 3 : oui.</b> (m) est perpendiculaire à [MN] et passe par son milieu : c'est la médiatrice de [MN].</p>
   <p><b>Cas 4 : non.</b> (m) n'est pas perpendiculaire à [MN]. Et aucun codage n'indique le milieu de [MN].</p>`},
  {n:"Activité 2", t:"Découverte d'une propriété", w:"Sur ta feuille", h:`<p>1) Reprends la médiatrice (d) que tu as tracée à l'activité 1.</p><p>2) Place trois points différents R, S et T sur la droite (d).</p><p>3) Mesure, puis compare : AR et RB ; AS et SB ; AT et TB.</p><p>4) Que semblent vérifier tous les points de la médiatrice ?</p><p>5) Complète la propriété : « La médiatrice d'un segment est formée de tous les points situés … »</p>`,
   c:`<p>3) Les mesures dépendent de l'endroit où tu as placé R, S et T, mais tu trouves à chaque fois <b>AR = RB</b>, <b>AS = SB</b> et <b>AT = TB</b>.</p><p>4) Chaque point de la médiatrice est à la <b>même distance</b> de A et de B.</p><p>5) « La médiatrice d'un segment est formée de tous les points situés <b>à la même distance des deux extrémités du segment</b>. »</p>`},
  {n:"Exercice 2", t:"Ces points sont-ils sur la médiatrice ?", w:"Sur ta feuille", h:`<p>Dans chaque cas, réponds à la question en justifiant à l'aide de la propriété.</p>${ex("e2","Trois triangles avec les longueurs des côtés",490)}<p>Cas 1 : le point K est-il sur la médiatrice de [TR] ? · Cas 2 : le point H appartient-il à la médiatrice de [AB] ? · Cas 3 : le point P appartient-il à la médiatrice de [ZR] ?</p>`,
   c:`<p><b>Cas 1 :</b> KT = KR = 3,5 cm. K est à la même distance de T et de R.<br>Donc <b>K appartient à la médiatrice de [TR]</b>.</p>
   <p><b>Cas 2 :</b> HA = 4 cm et HB = 5 cm. H n'est pas à la même distance de A et de B.<br>Donc <b>H n'appartient pas à la médiatrice de [AB]</b>.</p>
   <p><b>Cas 3 :</b> PZ = PR = 6 cm. P est à la même distance de Z et de R.<br>Donc <b>P appartient à la médiatrice de [ZR]</b>.</p>`},
  {n:"Activité 3", t:"Tracer la médiatrice au compas", w:"Sur ta feuille", h:`<p>Trace la médiatrice de chacun de ces segments, <b>uniquement au compas et à la règle</b>. Laisse les traces de construction apparentes.</p>${ex("act3","Les segments [MN], [RS] et [EF]",480)}`,
   c:`<p>Pour chaque segment : j'écarte le compas de plus de la moitié du segment, je trace deux arcs depuis chaque extrémité (au-dessus et en dessous), puis je relie les deux points d'intersection à la règle.</p>${ex("act3c","Les trois médiatrices tracées au compas",480)}`},
  {n:"Exercice 3", t:"Calculer une longueur", w:"Sur ton cahier", h:`<p>1) d est la médiatrice du segment [BW]. Le point S appartient à d et SB = 7 cm. Combien mesure le segment [SW] ? Justifie.</p><p>2) La médiatrice de [EF] coupe le segment [EF] au point I, et EF = 9 cm. Combien mesure le segment [EI] ? Justifie.</p>`,
   c:`<p>1) S appartient à la médiatrice de [BW], donc S est à la même distance de B et de W. Donc <b>SW = SB = 7 cm</b>.</p><p>2) La médiatrice de [EF] passe par le milieu de [EF] : I est donc le milieu de [EF]. Donc <b>EI = 9 ÷ 2 = 4,5 cm</b>.</p>`},
  {n:"Exercice 4", t:"Repérer des zones", w:"Sur ta feuille", h:`<p>Sur la figure ci-dessous, repère chaque zone demandée avec la couleur indiquée.</p><p>a) en <b>rouge</b> : les points situés à 4 cm du point A.</p><p>b) au <b>crayon de bois</b> : les points situés à moins de 2 cm du point D.</p><p>c) en <b>bleu</b> : les points qui sont à la fois à 4 cm de A et à 2 cm de D.</p><p>d) en <b>vert</b> : les points situés à la même distance de B et de C.</p>${ex("e4","Les points A, B, C et D",420)}`,
   c:`<p>a) Les points situés à 4 cm de A forment le <b>cercle de centre A et de rayon 4 cm</b> (en rouge).</p><p>b) Les points situés à moins de 2 cm de D forment l'<b>intérieur du disque de centre D et de rayon 2 cm</b> (grisé).</p><p>c) Ce sont les <b>deux points d'intersection</b> du cercle de centre A et de rayon 4 cm et du cercle de centre D et de rayon 2 cm (en bleu).</p><p>d) Les points à la même distance de B et de C forment la <b>médiatrice de [BC]</b> (en vert).</p>${ex("e4c","Les quatre zones coloriées",420)}`}
 ]},
{t:"Les triangles", e:[
  {n:"Activité 4", t:"Reconnaître la nature d'un triangle", w:"Sur ta feuille", h:`<p>Les triangles ci-dessous sont dessinés à main levée. Écris, sous chacun, sa nature : le codage te renseigne.</p>${ex("act4","Quatre triangles codés à main levée",490)}`,
   c:`<p>a) <b>isocèle</b> : deux côtés ont le même codage. · b) <b>rectangle</b> : il y a un angle droit codé. · c) <b>équilatéral</b> : les trois côtés ont le même codage. · d) <b>quelconque</b> : aucun codage.</p>`},
  {n:"Exercice 5", t:"Faire un dessin à main levée", w:"Sur ta feuille", h:`<p>Fais, dans chaque cadre, le dessin à main levée du triangle demandé : lettres, longueurs et codage.</p><p>1) Le triangle LEA isocèle en L, tel que LE = 5 cm et EA = 6 cm.</p><p>2) Le triangle NOE rectangle en N, tel que OE = 8 cm et NO = 5 cm.</p><p>3) Le triangle BLE équilatéral, tel que BL = 4,2 cm.</p>`,
   c:`<div class="cgrid"><figure><figcaption>1) isocèle en L : LE = LA = 5 cm (même codage) et EA = 6 cm.</figcaption>${triSVG(byLen("E","A","L",6,5,5),{k:26,ticks:[["L","E",1],["L","A",1]],lens:[["E","A","6 cm"],["L","E","5 cm"]],alt:"Triangle LEA isocèle en L"})}</figure>
   <figure><figcaption>2) rectangle en N : l'angle droit est en N. [OE] est le côté opposé à l'angle droit.</figcaption>${triSVG(rect("N","O","E",5,6.24),{k:22,right:["N","O","E"],lens:[["N","O","5 cm"],["O","E","8 cm"]],alt:"Triangle NOE rectangle en N"})}</figure>
   <figure><figcaption>3) équilatéral : les trois côtés mesurent 4,2 cm (même codage).</figcaption>${triSVG(byLen("B","L","E",4.2,4.2,4.2),{k:30,ticks:[["B","L",1],["L","E",1],["E","B",1]],lens:[["B","L","4,2 cm"]],alt:"Triangle BLE équilatéral"})}</figure></div>
   <p><i>Un dessin à main levée n'a pas besoin d'être exact : ce qui compte, ce sont les lettres, les longueurs et le codage.</i></p>`},
  {n:"Exercice 6", t:"Construire en vraie grandeur", w:"Sur ta feuille", h:`<p>Ces deux triangles sont dessinés à main levée. Construis-les en vraie grandeur dans le cadre.</p>${ex("e6","Triangle BRU (4 cm, 5 cm, 6 cm) et triangle LVO rectangle en V",470)}`,
   c:`<p><b>1)</b> Je trace [RU] = 6 cm. Je trace un arc de 4 cm depuis R et un arc de 5 cm depuis U : ils se coupent en B.</p>${triSVG(byLen("R","U","B",6,4,5),{k:30,lens:[["R","U","6 cm"],["R","B","4 cm"],["B","U","5 cm"]],alt:"Triangle BRU en vraie grandeur (réduit)"})}
   <p><b>2)</b> Je trace l'angle droit en V à l'équerre, puis je reporte VO = 5,5 cm et VL = 3,5 cm sur ses côtés, et je trace [LO].</p>${triSVG(rect("V","O","L",5.5,3.5),{k:30,right:["V","O","L"],lens:[["V","O","5,5 cm"],["V","L","3,5 cm"]],alt:"Triangle LVO rectangle en V (réduit)"})}<p><i>Figures réduites : sur ta feuille, vérifie les longueurs avec ta règle.</i></p>`},
  {n:"Exercice 7", t:"Construire à partir d'un texte", w:"Sur ton cahier", h:`<p>Avant chaque construction, fais un petit dessin à main levée en haut du cadre.</p><p>1) Le triangle TEO tel que TO = 3,8 cm, TE = 4,5 cm et OE = 5 cm.</p><p>2) Le triangle STU rectangle en U tel que SU = 2,8 cm et TU = 4 cm.</p><p>3) Le triangle MOV équilatéral de côté 5 cm.</p><p>4) Le triangle PIC isocèle en P tel que PC = 5 cm et IC = 3 cm.</p>`,
   c:`<p>Voici les figures (réduites), avec la méthode :</p><div class="cgrid">
   <figure><figcaption>1) Je trace [OE] = 5 cm, puis un arc de 3,8 cm depuis O et un arc de 4,5 cm depuis E : ils se coupent en T.</figcaption>${triSVG(byLen("O","E","T",5,3.8,4.5),{k:26,lens:[["O","E","5 cm"],["O","T","3,8 cm"],["T","E","4,5 cm"]],alt:"Triangle TEO"})}</figure>
   <figure><figcaption>2) Je trace l'angle droit en U, puis je reporte UT = 4 cm et US = 2,8 cm.</figcaption>${triSVG(rect("U","T","S",4,2.8),{k:26,right:["U","T","S"],lens:[["U","T","4 cm"],["U","S","2,8 cm"]],alt:"Triangle STU rectangle en U"})}</figure>
   <figure><figcaption>3) Je trace [MO] = 5 cm, puis deux arcs de 5 cm depuis M et depuis O : ils se coupent en V.</figcaption>${triSVG(byLen("M","O","V",5,5,5),{k:26,ticks:[["M","O",1],["O","V",1],["V","M",1]],lens:[["M","O","5 cm"]],alt:"Triangle MOV équilatéral"})}</figure>
   <figure><figcaption>4) PI = PC = 5 cm (isocèle en P). Je trace [IC] = 3 cm, puis deux arcs de 5 cm depuis I et depuis C : ils se coupent en P.</figcaption>${triSVG(byLen("I","C","P",3,5,5),{k:24,ticks:[["P","I",1],["P","C",1]],lens:[["I","C","3 cm"],["P","C","5 cm"]],alt:"Triangle PIC isocèle en P"})}</figure></div>`},
  {n:"Exercice 8", t:"Une figure un peu plus difficile", w:"Sur ton cahier", h:`<p>Construis le triangle RST rectangle en S tel que RS = 4 cm et ST = 3 cm.</p><p>Place ensuite le point U, de l'autre côté de la droite (ST) que R, tel que le triangle STU soit équilatéral.</p>`,
   c:`<p>1) Je trace l'angle droit en S, puis je reporte SR = 4 cm et ST = 3 cm, et je trace [RT].</p><p>2) Le triangle STU est équilatéral, donc SU = TU = ST = 3 cm. Je trace deux arcs de 3 cm depuis S et depuis T, <b>du côté de (ST) où R n'est pas</b> : ils se coupent en U.</p>
   ${triSVG({S:[4,3],R:[0,3],T:[4,0],U:[4+3*Math.sqrt(3)/2,1.5]},{k:30,poly:["R","S","T"],extra:[["S","U",BLUE],["T","U",BLUE]],right:["S","R","T"],ticks:[["S","T",1],["S","U",1],["T","U",1]],lens:[["R","S","4 cm"]],alt:"Triangle RST rectangle en S et triangle STU équilatéral"})}`}
 ]},
{t:"Les médiatrices d'un triangle et le cercle circonscrit", e:[
  {n:"Activité 5", t:"Les trois médiatrices d'un triangle", w:"Sur ta feuille", h:`<p>1) Trace au compas les médiatrices des trois côtés du triangle ABC.</p><p>2) Que remarques-tu ?</p><p>3) Appelle O leur point d'intersection, puis mesure OA, OB et OC.</p><p>4) Que constates-tu ?</p><p>5) Trace le cercle de centre O qui passe par A. Que remarques-tu ?</p>${ex("act5","Le triangle ABC",320)}`,
   c:`${ex("act5c","Les trois médiatrices et le cercle de centre O",320)}<p>2) Les trois médiatrices se coupent <b>en un même point</b> : elles sont concourantes.</p><p>3) Sur la fiche : OA ≈ OB ≈ OC ≈ <b>4,2 cm</b>.</p><p>4) Le point O est <b>à la même distance des trois sommets</b> : OA = OB = OC.</p><p>5) Le cercle de centre O qui passe par A passe aussi par <b>B et par C</b> : c'est le cercle circonscrit au triangle ABC.</p>`},
  {n:"Exercice 9", t:"Construire un cercle circonscrit", w:"Sur ta feuille", h:`<p>Construis le cercle circonscrit au triangle RST. Laisse les traces de construction apparentes.</p>${ex("e9","Le triangle RST",320)}`,
   c:`<p>Je trace au compas la médiatrice de deux côtés (la troisième sert à vérifier). Elles se coupent en O. Je trace le cercle de centre O qui passe par R : il passe aussi par S et T.</p>${ex("e9c","Le cercle circonscrit au triangle RST",320)}<p><i>Sur la fiche, son rayon mesure environ 3,9 cm.</i></p>`},
  {n:"Exercice 10", t:"Raisonner", w:"Sur ta feuille", h:`<p>Sur la figure ci-contre, le codage indique que MT = MN et que I est le milieu de [TN].</p>${ex("e10","Triangle MTN isocèle en M, I milieu de [TN]",230)}<p>1) Que peux-tu dire de la droite (MI) pour le segment [TN] ? Justifie.</p><p>2) Que peux-tu dire des droites (MI) et (TN) ? Justifie.</p>`,
   c:`<p>1) MT = MN : M est à la même distance de T et de N.<br>Donc M est sur la médiatrice de [TN].</p><p>I est le milieu de [TN].<br>Donc I est aussi sur la médiatrice de [TN].</p><p>La médiatrice de [TN] passe par M et par I.<br>Donc <b>(MI) est la médiatrice de [TN]</b>.</p><p>2) La médiatrice de [TN] est perpendiculaire à [TN].<br>Donc <b>les droites (MI) et (TN) sont perpendiculaires</b> : (MI) ⊥ (TN).</p>`},
  {n:"Exercice 11", t:"Pour aller plus loin", w:"Sur ton cahier", h:`<p>1) Construis un triangle ABC rectangle en A tel que AB = 4 cm et AC = 3 cm.</p><p>2) Construis son cercle circonscrit.</p><p>3) Où se trouve le centre de ce cercle ?</p>`,
   c:`${triSVG({A:[0,3],B:[4,3],C:[0,0]},{k:30,right:["A","B","C"],med:[["A","B"],["A","C"]],medExt:2.0,circ:[[2,1.5],2.5],lens:[["A","B","4 cm"],["A","C","3 cm"]],dots:[["O",[2,1.5],[0.35,-0.35],RED]],alt:"Triangle ABC rectangle en A, les médiatrices de [AB] et [AC] et le cercle circonscrit de centre O"})}
   <p>1) Je trace l'angle droit en A. Puis je place B et C : AB = 4 cm et AC = 3 cm.</p><p>2) Je trace la médiatrice de [AB] et celle de [AC]. Elles se coupent en O.<br>Je trace le cercle de centre O qui passe par A.</p><p>3) Le centre O est <b>le milieu du côté [BC]</b>. [BC] est le côté opposé à l'angle droit.<br>Je mesure : BC = 5 cm. Donc le rayon du cercle est 5 ÷ 2 = 2,5 cm.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Définition de la médiatrice", schema:S_MED, q:{
 1:[ {q:"La médiatrice d'un segment est la droite…", c:["perpendiculaire au segment, qui passe par son milieu","qui passe par le milieu du segment","perpendiculaire au segment"], rep:"perpendiculaire au segment, qui passe par son milieu", sx:S_MED},
     {q:"Sur ces figures, dans quel(s) cas la droite (m) est-elle la médiatrice de [MN] ?", fig:ex("e1","Les quatre cas",420), c:["Seulement dans le cas 3","Dans les cas 1 et 3","Dans les cas 2 et 3"], rep:"Seulement dans le cas 3", ex:"Il faut à la fois l'angle droit et le milieu : seul le cas 3 a les deux.", sx:S_MED} ],
 2:[ {q:"Une droite perpendiculaire à [AB] qui ne passe pas par son milieu est-elle sa médiatrice ?", c:["Non","Oui"], rep:"Non", ex:"Il manque le milieu.", sx:S_MED},
     {g:()=>{ const d=2*ri(3,9)+pick([0,1]); return {q:`[AB] mesure ${d} cm. Pour tracer sa médiatrice à l'équerre, à combien de centimètres de A place-t-on le milieu I ?`, rep:fr(d/2), ex:`${d} ÷ 2 = ${fr(d/2)} cm.`, sx:S_MED}; }} ],
 3:[ {q:"Pour tracer la médiatrice de [LT] au compas, l'écartement du compas doit être…", c:["plus grand que la moitié de [LT]","égal à la moitié de [LT]","plus petit que la moitié de [LT]"], rep:"plus grand que la moitié de [LT]", ex:"Sinon les arcs tracés depuis L et depuis T ne se coupent pas.", sx:S_MED},
     {q:"Pour tracer la médiatrice au compas, combien de points faut-il trouver ?", c:["2","1","3"], rep:"2", ex:"Une droite est déterminée par deux points : les deux intersections des arcs.", sx:S_MED} ]
}},
{nom:"Propriétés de la médiatrice", schema:S_EQ, q:{
 1:[ {g:()=>{ const l=ri(3,12); return {q:`S appartient à la médiatrice de [BW] et SB = ${l} cm. Combien mesure SW (en cm) ?`, rep:String(l), ex:`S est sur la médiatrice de [BW], donc il est équidistant de B et de W : SW = SB = ${l} cm.`, sx:S_EQ}; }},
     {q:"Un point de la médiatrice de [AB] est…", c:["à la même distance de A et de B","plus près de A que de B","au milieu de [AB]"], rep:"à la même distance de A et de B", sx:S_EQ} ],
 2:[ {g:()=>{ const a=ri(3,9), b=pick([a,a,a+1,a-1]); return {q:`KT = ${a} cm et KR = ${b} cm. Le point K appartient-il à la médiatrice de [TR] ?`, c:["Oui","Non"], rep:a===b?"Oui":"Non", ex:a===b?"KT = KR : K est équidistant de T et de R.":"KT ≠ KR : K n'est pas équidistant de T et de R.", sx:S_EQ}; }},
     {g:()=>{ const d=ri(5,15); return {q:`La médiatrice de [EF] coupe [EF] en I, et EF = ${d} cm. Combien mesure EI (en cm) ?`, rep:fr(d/2), ex:`La médiatrice passe par le milieu : EI = ${d} ÷ 2 = ${fr(d/2)} cm.`, sx:S_EQ}; }} ],
 3:[ {q:"MT = MN et I est le milieu de [TN]. Que peut-on dire de la droite (MI) ?", c:["C'est la médiatrice de [TN]","Elle est parallèle à (TN)","On ne peut rien dire"], rep:"C'est la médiatrice de [TN]", ex:"M et I sont tous les deux à la même distance de T et de N : ils sont sur la médiatrice de [TN].", sx:S_EQ},
     {q:"Les points situés à la même distance de deux points B et C forment…", c:["la médiatrice de [BC]","le cercle de diamètre [BC]","le segment [BC]"], rep:"la médiatrice de [BC]", sx:S_EQ} ]
}},
{nom:"Vocabulaire du triangle", schema:S_VOC, q:{
 1:[ {q:"Combien un triangle a-t-il de sommets ?", rep:"3", sx:S_VOC},
     {q:"Quels sont les côtés du triangle ABC ?", c:["[AB], [BC] et [AC]","A, B et C","(AB), (BC) et (AC)"], rep:"[AB], [BC] et [AC]", sx:S_VOC} ],
 2:[ {q:"Le triangle ABC peut aussi s'appeler…", c:["CAB","ABD","AAB"], rep:"CAB", ex:"On peut lire les sommets dans n'importe quel ordre.", sx:S_VOC},
     {q:"Dans le triangle RST, quel côté est opposé au sommet R ?", c:["[ST]","[RS]","[RT]"], rep:"[ST]", ex:"Le côté opposé à R est celui qui ne passe pas par R.", sx:S_VOC} ],
 3:[ {q:"Avant de construire un triangle, que fait-on toujours ?", c:["un dessin à main levée","le cercle circonscrit","les médiatrices"], rep:"un dessin à main levée", ex:"Il permet d'imaginer la figure et d'y placer les informations."} ]
}},
{nom:"Triangles particuliers", schema:S_TRI, q:{
 1:[ {q:"Un triangle qui a trois côtés de même longueur est…", c:["équilatéral","isocèle","rectangle"], rep:"équilatéral", sx:S_TRI},
     {q:"Un triangle qui a un angle droit est…", c:["rectangle","isocèle","équilatéral"], rep:"rectangle", sx:S_TRI} ],
 2:[ {g:()=>{ const a=ri(3,8), b=pick([a+1,a+2,a-1]); return {q:`Un triangle a des côtés de ${a} cm, ${a} cm et ${b} cm. Quelle est sa nature ?`, c:["isocèle","équilatéral","quelconque"], rep:"isocèle", ex:"Deux côtés ont la même longueur.", sx:S_TRI}; }},
     {g:()=>{ const a=ri(3,8); return {q:`Un triangle a trois côtés de ${a} cm. Quelle est sa nature ?`, c:["équilatéral","isocèle","rectangle"], rep:"équilatéral", sx:S_TRI}; }},
     {g:()=>{ let a,b,c; do{ a=ri(3,5); b=a+ri(1,2); c=b+ri(1,2); }while(a*a+b*b===c*c); return {q:`Un triangle a des côtés de ${a} cm, ${b} cm et ${c} cm, et aucun angle droit. Quelle est sa nature ?`, c:["quelconque","isocèle","équilatéral"], rep:"quelconque", sx:S_TRI}; }} ],
 3:[ {q:"Vrai ou faux : un triangle peut être à la fois rectangle et isocèle.", c:VF, rep:"Vrai", ex:"On dit qu'il est rectangle isocèle.", sx:S_TRI},
     {q:"Vrai ou faux : un triangle équilatéral est aussi isocèle.", c:VF, rep:"Vrai", ex:"Il a deux côtés de même longueur (et même trois !).", sx:S_TRI},
     {q:"Sur une figure, que signale un petit carré ?", c:["un angle droit","deux côtés de même longueur","le milieu"], rep:"un angle droit", sx:S_TRI} ]
}},
{nom:"Construire un triangle", schema:S_CONS, q:{
 1:[ {q:"Pour construire un triangle dont on connaît les trois longueurs, on trace d'abord…", c:["un côté","le cercle circonscrit","un angle droit"], rep:"un côté", sx:S_CONS},
     {q:"Quel instrument permet de trouver le troisième sommet ?", c:["le compas","le rapporteur","l'équerre"], rep:"le compas", sx:S_CONS} ],
 2:[ {g:()=>{ let a,b,c; do{ a=ri(3,6); b=ri(3,6); c=ri(4,7); }while(a+b<=c); return {q:`On construit le triangle ABC avec BC = ${c} cm, AB = ${a} cm et AC = ${b} cm. On a tracé [BC]. De combien écarte-t-on le compas en piquant en B (en cm) ?`, rep:String(a), ex:`Depuis B, on cherche A : l'écartement est AB = ${a} cm.`, sx:S_CONS}; }},
     {q:"Pour construire un triangle rectangle en A, on commence par tracer…", c:["l'angle droit en A, à l'équerre","un arc de cercle depuis A","la médiatrice"], rep:"l'angle droit en A, à l'équerre", sx:S_CONS} ],
 3:[ {g:()=>{ const c=ri(4,7); return {q:`Le triangle MOV est équilatéral de côté ${c} cm. On a tracé [MO]. De combien écarte-t-on le compas pour trouver V (en cm) ?`, rep:String(c), ex:`Tous les côtés mesurent ${c} cm : arcs de ${c} cm depuis M et depuis O.`, sx:S_CONS}; }},
     {g:()=>{ const p=ri(4,7), b=ri(2,4); return {q:`Le triangle PIC est isocèle en P, avec PC = ${p} cm et IC = ${b} cm. Combien mesure PI (en cm) ?`, rep:String(p), ex:`Isocèle en P : PI = PC = ${p} cm.`, sx:S_CONS}; }} ]
}},
{nom:"Cercle circonscrit", schema:S_CIRC, q:{
 1:[ {q:"Le cercle circonscrit à un triangle passe par…", c:["ses trois sommets","les milieux de ses côtés","un seul sommet"], rep:"ses trois sommets", sx:S_CIRC},
     {q:"Les trois médiatrices d'un triangle…", c:["se coupent en un même point","sont parallèles","ne se coupent jamais"], rep:"se coupent en un même point", ex:"On dit qu'elles sont concourantes.", sx:S_CIRC} ],
 2:[ {g:()=>{ const r=ri(3,9); return {q:`O est le point de concours des médiatrices du triangle ABC, et OA = ${r} cm. Combien mesure OC (en cm) ?`, rep:String(r), ex:`O est sur les médiatrices : OA = OB = OC = ${r} cm.`, sx:S_CIRC}; }},
     {q:"Le centre du cercle circonscrit est…", c:["le point de concours des médiatrices","le milieu d'un côté","un sommet du triangle"], rep:"le point de concours des médiatrices", sx:S_CIRC} ],
 3:[ {q:"Combien de médiatrices faut-il tracer, au minimum, pour trouver le centre du cercle circonscrit ?", c:["2","3","1"], rep:"2", ex:"Deux suffisent ; la troisième sert à vérifier.", sx:S_CIRC},
     {g:()=>{ const [a,b,c]=pick([[3,4,5],[6,8,10],[5,12,13]]); return {q:`ABC est rectangle en A avec BC = ${c} cm. Le centre de son cercle circonscrit est le milieu de [BC]. Quel est le rayon de ce cercle (en cm) ?`, rep:fr(c/2), ex:`Le rayon est la moitié de [BC] : ${c} ÷ 2 = ${fr(c/2)} cm.`, sx:S_CIRC}; }} ]
}}
],

/* ===================== ÉVAL D'ENTRAÎNEMENT (+ version aménagée pour les élèves à besoins particuliers) ===================== */
eval:(()=>{
const f1=x=>(+x).toFixed(1), CM=37.8;
const T=(x,y,t,st="")=>`<text x="${f1(x)}" y="${f1(y)}" style="font-size:16px;font-weight:600;${st}">${t}</text>`;
const L_=(a,b,st="")=>`<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" class="ln"${st?` style="${st}"`:""}/>`;
const sv=(W,H,lab,body)=>`<svg class="fig" viewBox="0 0 ${f1(W)} ${f1(H)}" width="${f1(W)}" role="img" aria-label="${lab}">${body}</svg>`;
const cod=(x,y)=>`<line x1="${f1(x-3)}" y1="${f1(y+6)}" x2="${f1(x+3)}" y2="${f1(y-6)}" style="stroke:${RED};stroke-width:2"/>`;
const sq=(x,y,s=10)=>`<path d="M${f1(x+s)} ${f1(y)} L${f1(x+s)} ${f1(y-s)} L${f1(x)} ${f1(y-s)}" style="fill:none;stroke:${RED};stroke-width:1.6"/>`;
const arc=(c,r,a0,a1,st="cons")=>{ const p=a=>[c[0]+r*Math.cos(a*Math.PI/180), c[1]-r*Math.sin(a*Math.PI/180)], A=p(a0), B=p(a1);
  return `<path d="M${f1(A[0])} ${f1(A[1])} A${f1(r)} ${f1(r)} 0 0 0 ${f1(B[0])} ${f1(B[1])}" class="${st}"/>`; };
const ang=(c,p)=>Math.atan2(-(p[1]-c[1]),p[0]-c[0])*180/Math.PI;
/* triangle KLM construit au compas : [KL] horizontal, M au-dessus ; k px par cm */
const tri=(kl,km,lm,k,lab)=>{ const x=(kl*kl+km*km-lm*lm)/(2*kl), y=Math.sqrt(km*km-x*x), K=[30,y*k+40], L=[30+kl*k,y*k+40], M=[30+x*k,40];
  const aK=ang(K,M), aL=ang(L,M);
  return sv(kl*k+60,y*k+75,lab,L_(K,L)+L_(K,M)+L_(L,M)+arc(K,km*k,aK-12,aK+12)+arc(L,lm*k,aL-14,aL+14)
   +[[K,"K",-18,6],[L,"L",8,6],[M,"M",-24,-6]].map(([P,n,dx,dy])=>cross(P[0],P[1],"ln")+T(P[0]+dx,P[1]+dy,n)).join("")
   +T((K[0]+L[0])/2-14,K[1]+22,`${String(kl).replace(".",",")} cm`,`fill:${BLUE};font-size:14px`)
   +T((K[0]+M[0])/2-44,(K[1]+M[1])/2-2,`${km} cm`,`fill:${BLUE};font-size:14px`)+T((L[0]+M[0])/2+8,(L[1]+M[1])/2-2,`${lm} cm`,`fill:${BLUE};font-size:14px`)); };
/* segment donné en vraie grandeur (version aménagée) : place laissée au-dessus et en dessous */
const segVG=(a,b,len,up,down)=>{ const W=len*CM+70, y=up; return sv(W,up+down,`Le segment [${a}${b}] de ${len} cm (vraie grandeur sur le sujet imprimé)`,L_([35,y],[35+len*CM,y])+cross(35,y,"ln")+cross(35+len*CM,y,"ln")+T(16,y+6,a)+T(42+len*CM,y+6,b)); };
/* exercice 3 : trois droites qui coupent [AB] */
const A=[30,130], B=[350,130], I=[190,130], J=[300,130];
const fig3 = sv(380,225,"Le segment [AB] de milieu I (codage), la droite (d₁) passe par I sans angle droit, la droite (d₂) est perpendiculaire à [AB] en I, la droite (d₃) est perpendiculaire à [AB] en J",
  L_(A,B)+L_([120,15],[244,219])+L_([190,12],[190,218])+L_([300,12],[300,218])+sq(190,130)+sq(300,130)+cod(110,130)+cod(270,130)
  +[[A,"A",-6,-12],[B,"B",-4,-12],[I,"I",-16,22],[J,"J",6,22]].map(([P,n,dx,dy])=>cross(P[0],P[1],"ln")+T(P[0]+dx,P[1]+dy,n)).join("")
  +T(92,24,"(d₁)","font-weight:400")+T(196,24,"(d₂)","font-weight:400")+T(306,24,"(d₃)","font-weight:400"));
/* exercice 4 : médiatrice de [PQ] au compas (réduite, 1 cm = 30 px) */
const med = (()=>{ const k=30, y=125, P=[40,y], Q=[40+6*k,y], r=4*k, h=Math.sqrt(r*r-(3*k)**2), X=40+3*k, U=[X,y-h], V=[X,y+h];
  return sv(260,250,"Correction : la médiatrice (m) de [PQ] tracée au compas, avec ses arcs et le codage",
   L_(P,Q)+arc(P,r,ang(P,U)-10,ang(P,U)+10)+arc(P,r,ang(P,V)-10,ang(P,V)+10)+arc(Q,r,ang(Q,U)-10,ang(Q,U)+10)+arc(Q,r,ang(Q,V)-10,ang(Q,V)+10)
   +L_([X,8],[X,242],`stroke:${BLUE};stroke-width:2.2`)+sq(X,y)+cod((P[0]+X)/2,y)+cod((X+Q[0])/2,y)
   +[[P,"P",-20,6],[Q,"Q",8,6]].map(([Z,n,dx,dy])=>cross(Z[0],Z[1],"ln")+T(Z[0]+dx,Z[1]+dy,n)).join("")+T(X+8,22,"(m)",`fill:${BLUE}`)); })();
const comp=[
  ["REPRÉSENTER","Je trace un triangle à partir des longueurs de ses côtés.","Ex. 1 (3 points)"],
  ["RAISONNER","Je calcule une longueur grâce à la médiatrice, et je justifie.","Ex. 2 (2 points)"],
  ["RAISONNER","Je décide si une droite est la médiatrice d'un segment, en lisant le codage.","Ex. 3 (3 points)"],
  ["REPRÉSENTER","Je construis au compas la médiatrice d'un segment, avec son codage.","Ex. 4 (2 points)"]
], compB=comp.slice(0,3).concat([["REPRÉSENTER","Je construis la médiatrice d'un segment, avec son codage.","Ex. 4 (2 points)"]]);
/* exercice 1 : dessin à main levée codé d'un triangle aux trois côtés égaux */
const uvw = triSVG({U:[0,3.46],V:[4,3.46],W:[2,0]},{k:30, ticks:[["U","V",1],["V","W",1],["U","W",1]], alt:"Dessin à main levée codé du triangle UVW : ses trois côtés portent le même codage"});
return {
titre:"Évaluation d'entraînement — Chapitre 6", duree:30, info:"Durée : 30 min · Matériel : règle graduée, équerre, compas · Calculatrice non autorisée",
comp,
exos:[
{t:"Le triangle KLM", p:3, h:`<p>1) Fais un dessin à main levée, puis construis en vraie grandeur le triangle KLM tel que : KL = 7 cm, LM = 3 cm et KM = 5 cm. Ne gomme pas les arcs de cercle.</p>
  <p>2) Voici le dessin à main levée d'un autre triangle, codé. Quelle est sa nature ?</p>${uvw}`,
 c:`<p>1) Je trace d'abord [KL] de 7 cm. Je pique en K avec un écartement de 5 cm et je trace un arc. Je pique en L avec un écartement de 3 cm et je trace un arc. M est le point où les deux arcs se coupent. Voici la figure, réduite :</p>${tri(7,5,3,34,"Triangle KLM : KL = 7 cm, KM = 5 cm, LM = 3 cm, avec les deux arcs de cercle")}
  <p><i>(0,5 point pour le dessin à main levée, 0,5 point pour [KL], 1 point pour les deux arcs, 0,5 point pour le triangle)</i></p>
  <p>2) Le codage montre que ses trois côtés ont la même longueur : UVW est un triangle <b>équilatéral</b>. <i>(0,5 point)</i></p>`},
{t:"Un point sur la médiatrice", p:2, h:`<p>La droite (Δ) est la médiatrice du segment [CD], et CD = 5 cm. Le point H appartient à (Δ), et HC = 6 cm.</p>
  <p>a) Calcule HD. Justifie en citant une propriété du cours.</p><p>b) Quelle est la nature du triangle HCD ?</p>`,
 c:`<p>a) H appartient à la médiatrice de [CD]. Or, si un point appartient à la médiatrice d'un segment, alors il est équidistant des extrémités de ce segment. Donc HD = HC = <b>6 cm</b>. <i>(1,5 point : 0,5 point pour le résultat, 1 point pour la justification)</i></p>
  <p>b) HC = HD = 6 cm : le triangle HCD a deux côtés de même longueur, il est <b>isocèle en H</b>. <i>(0,5 point)</i></p><p>La longueur CD = 5 cm ne sert pas pour répondre.</p>`},
{t:"Laquelle est la médiatrice ?", p:3, h:`${fig3}<p>Trois droites coupent le segment [AB]. Aide-toi du codage de la figure.</p><p>a) Laquelle des droites (d₁), (d₂) et (d₃) est la médiatrice de [AB] ?</p><p>b) Pour chacune des deux autres droites, explique pourquoi ce n'est pas la médiatrice de [AB].</p>`,
 c:`<p>a) Le codage montre que I est le milieu de [AB] (AI = IB). (d₂) passe par I et elle est perpendiculaire à [AB] (angle droit codé) : <b>(d₂) est la médiatrice de [AB]</b>. <i>(1 point)</i></p>
  <p>b) (d₁) passe par le milieu I, mais elle n'est pas perpendiculaire à [AB]. <i>(1 point)</i></p><p>(d₃) est perpendiculaire à [AB], mais elle ne passe pas par le milieu de [AB] : elle passe par J. <i>(1 point)</i></p>`},
{t:"Construction d'une médiatrice", p:2, h:`<p>1) Trace un segment [PQ] de 6 cm.</p><p>2) Construis sa médiatrice (m) avec le compas. Laisse les arcs de cercle visibles.</p><p>3) Ajoute le codage : le milieu et l'angle droit.</p>`,
 c:`${med}<p>J'écarte le compas de plus de la moitié de [PQ] (ici 4 cm). Je pique en P et je trace deux arcs, de part et d'autre de [PQ]. Sans changer l'écartement, je pique en Q et je trace deux arcs. Je relie les deux points où les arcs se coupent : c'est la médiatrice (m). Je code le milieu et l'angle droit.</p>
  <p><i>(1 point pour [PQ] et les arcs, 0,5 point pour la droite (m), 0,5 point pour le codage)</i></p>`}
],
/* ---------- version aménagée (tiers-temps) : le même sujet, environ un quart des questions en moins ---------- */
bep:{titre:"Évaluation d'entraînement — Chapitre 6 · version aménagée", duree:30, info:"Version aménagée (tiers-temps) · Durée : 30 min · Matériel : règle graduée, équerre, compas · Calculatrice non autorisée",
note:"Le même sujet avec 2 questions en moins, à faire dans le même temps. Le total reste sur 10 points.",
comp,
exos:[
{t:"Le triangle KLM", p:3, h:`<p>Fais un dessin à main levée, puis construis en vraie grandeur le triangle KLM tel que : KL = 7 cm, LM = 3 cm et KM = 5 cm. Ne gomme pas les arcs de cercle.</p>`,
 c:`<p>Je trace d'abord [KL] de 7 cm. Je pique en K avec un écartement de 5 cm et je trace un arc. Je pique en L avec un écartement de 3 cm et je trace un arc. M est le point où les deux arcs se coupent. Voici la figure, réduite :</p>${tri(7,5,3,34,"Triangle KLM : KL = 7 cm, KM = 5 cm, LM = 3 cm, avec les deux arcs de cercle")}
  <p><i>(0,5 point pour le dessin à main levée, 0,5 point pour [KL], 1,5 point pour les deux arcs, 0,5 point pour le triangle)</i></p>`},
{t:"Un point sur la médiatrice", p:2, h:`<p>La droite (Δ) est la médiatrice du segment [CD], et CD = 5 cm. Le point H appartient à (Δ), et HC = 6 cm.</p>
  <p>Calcule HD. Justifie en citant une propriété du cours.</p>`,
 c:`<p>H appartient à la médiatrice de [CD]. Or, si un point appartient à la médiatrice d'un segment, alors il est équidistant des extrémités de ce segment. Donc HD = HC = <b>6 cm</b>. <i>(2 points : 1 point pour le résultat, 1 point pour la justification)</i></p>
  <p>La longueur CD = 5 cm ne sert pas pour répondre.</p>`},
{t:"Laquelle est la médiatrice ?", p:3, h:`${fig3}<p>Trois droites coupent le segment [AB]. Aide-toi du codage de la figure.</p><p>a) Laquelle des droites (d₁), (d₂) et (d₃) est la médiatrice de [AB] ?</p><p>b) Pour chacune des deux autres droites, explique pourquoi ce n'est pas la médiatrice de [AB].</p>`,
 c:`<p>a) Le codage montre que I est le milieu de [AB] (AI = IB). (d₂) passe par I et elle est perpendiculaire à [AB] (angle droit codé) : <b>(d₂) est la médiatrice de [AB]</b>. <i>(1 point)</i></p>
  <p>b) (d₁) passe par le milieu I, mais elle n'est pas perpendiculaire à [AB]. <i>(1 point)</i></p><p>(d₃) est perpendiculaire à [AB], mais elle ne passe pas par le milieu de [AB] : elle passe par J. <i>(1 point)</i></p>`},
{t:"Construction d'une médiatrice", p:2, h:`<p>1) Trace un segment [PQ] de 6 cm.</p><p>2) Construis sa médiatrice (m) avec le compas. Laisse les arcs de cercle visibles.</p><p>3) Ajoute le codage : le milieu et l'angle droit.</p>`,
 c:`${med}<p>J'écarte le compas de plus de la moitié de [PQ] (ici 4 cm). Je pique en P et je trace deux arcs, de part et d'autre de [PQ]. Sans changer l'écartement, je pique en Q et je trace deux arcs. Je relie les deux points où les arcs se coupent : c'est la médiatrice (m). Je code le milieu et l'angle droit.</p>
  <p><i>(1 point pour [PQ] et les arcs, 0,5 point pour la droite (m), 0,5 point pour le codage)</i></p>`}
]}
};
})()
};
})();
