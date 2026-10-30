/* Jeu de constructions géométriques (6e : outils de la trousse ; 5e, 4e et 3e : géométrie dynamique façon GeoGebra).
   Toutes les constructions sont calculées exactement : un point placé « à l'œil » n'est jamais exactement au bon endroit,
   alors qu'un point construit (intersection, report de longueur…) l'est. La vérification compare donc à 0,000 001 cm près. */
window.GEOJEU = (function(){
const W=16, H=10, EPS=1e-6;
const fr = x => String(Math.round(x*100)/100).replace(".",",");
const d2 = (a,b) => Math.hypot(a.x-b.x, a.y-b.y);

/* ================= géométrie ================= */
/* objet « rectiligne » : {x,y,dx,dy (unitaire), t0, t1} */
function lin(o){
  if(o.k==="line") return {x:o.x, y:o.y, dx:o.dx, dy:o.dy, t0:-Infinity, t1:Infinity};
  const A=pt(o.a), B=pt(o.b), L=d2(A,B);
  return {x:A.x, y:A.y, dx:(B.x-A.x)/L, dy:(B.y-A.y)/L, t0:0, t1: o.k==="seg" ? L : Infinity};
}
const inR = (l,t) => t>=l.t0-1e-9 && t<=l.t1+1e-9;
function interLL(a,b){
  const den=a.dx*b.dy-a.dy*b.dx; if(Math.abs(den)<1e-12) return [];
  const ex=b.x-a.x, ey=b.y-a.y, t=(ex*b.dy-ey*b.dx)/den, s=(ex*a.dy-ey*a.dx)/den;
  return inR(a,t)&&inR(b,s) ? [{x:a.x+t*a.dx, y:a.y+t*a.dy}] : [];
}
function interLC(l,c){
  const fx=l.x-c.cx, fy=l.y-c.cy, b=fx*l.dx+fy*l.dy, cc=fx*fx+fy*fy-c.r*c.r, disc=b*b-cc;
  if(disc<-1e-12) return []; const s=Math.sqrt(Math.max(0,disc));
  return [-b-s, -b+s].filter((t,i,arr)=>inR(l,t) && (i===0 || Math.abs(arr[1]-arr[0])>1e-12)).map(t=>({x:l.x+t*l.dx, y:l.y+t*l.dy}));
}
function interCC(a,b){
  const dx=b.cx-a.cx, dy=b.cy-a.cy, d=Math.hypot(dx,dy);
  if(d<1e-12 || d>a.r+b.r+1e-12 || d<Math.abs(a.r-b.r)-1e-12) return [];
  const m=(a.r*a.r-b.r*b.r+d*d)/(2*d), h=Math.sqrt(Math.max(0,a.r*a.r-m*m)), px=a.cx+m*dx/d, py=a.cy+m*dy/d;
  return h<1e-12 ? [{x:px,y:py}] : [{x:px-h*dy/d, y:py+h*dx/d}, {x:px+h*dy/d, y:py-h*dx/d}];
}
function inter(o1,o2){
  const L1=o1.k!=="circ", L2=o2.k!=="circ";
  if(L1&&L2) return interLL(lin(o1),lin(o2));
  if(L1) return interLC(lin(o1),o2);
  if(L2) return interLC(lin(o2),o1);
  return interCC(o1,o2);
}
function proj(o,p){
  if(o.k==="circ"){ const v=Math.hypot(p.x-o.cx,p.y-o.cy)||1; return {x:o.cx+o.r*(p.x-o.cx)/v, y:o.cy+o.r*(p.y-o.cy)/v}; }
  const l=lin(o); let t=(p.x-l.x)*l.dx+(p.y-l.y)*l.dy; t=Math.max(l.t0,Math.min(l.t1,t)); return {x:l.x+t*l.dx, y:l.y+t*l.dy};
}
const distTo = (o,p) => d2(proj(o,p),p);
/* portion visible d'une droite / demi-droite dans la feuille */
function clip(l){
  let a=Math.max(l.t0,-1e9), b=Math.min(l.t1,1e9);
  for(const [p,dp,lo,hi] of [[l.x,l.dx,0,W],[l.y,l.dy,0,H]]){
    if(Math.abs(dp)<1e-12){ if(p<lo||p>hi) return null; continue; }
    let t1=(lo-p)/dp, t2=(hi-p)/dp; if(t1>t2) [t1,t2]=[t2,t1]; a=Math.max(a,t1); b=Math.min(b,t2);
  }
  return a<b ? [{x:l.x+a*l.dx,y:l.y+a*l.dy},{x:l.x+b*l.dx,y:l.y+b*l.dy}] : null;
}

/* ================= figure ================= */
let OB=[], NID=1, UNDO=[];
const pt = id => OB.find(o=>o.id===id);
const byName = n => OB.find(o=>o.k==="pt" && o.name===n);
const pts = () => OB.filter(o=>o.k==="pt");
const curves = () => OB.filter(o=>["seg","ray","line","circ"].includes(o.k));
function add(o){ o.id=NID++; OB.push(o); return o; }
function snapshot(){ UNDO.push(JSON.stringify({OB,NID})); if(UNDO.length>80) UNDO.shift(); }

/* ================= vérifications (utilisées par les niveaux) ================= */
const colin = (p,a,b) => Math.abs((b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x))/d2(a,b) < EPS;
const T = {
  P: byName, pts, eq:(a,b)=>d2(a,b)<EPS, near:(x,y)=>Math.abs(x-y)<EPS, d:d2, colin,
  nouveaux: () => pts().filter(p=>!p.given),
  seg: (a,b) => OB.some(o=>o.k==="seg" && ((T.eq(pt(o.a),a)&&T.eq(pt(o.b),b)) || (T.eq(pt(o.a),b)&&T.eq(pt(o.b),a)))),
  droite: (a,b) => OB.some(o=>o.k==="line" && distTo(o,a)<EPS && distTo(o,b)<EPS),
  demi: (a,b) => OB.some(o=>o.k==="ray" && T.eq(pt(o.a),a) && distTo(o,b)<EPS && colin(b,a,pt(o.b))),
  perp: (c,a,b) => OB.some(o=>o.k==="line" && distTo(o,c)<EPS && Math.abs(o.dx*(b.x-a.x)+o.dy*(b.y-a.y))/d2(a,b)<EPS),
  para: (c,a,b) => OB.some(o=>o.k==="line" && distTo(o,c)<EPS && Math.abs(o.dx*(b.y-a.y)-o.dy*(b.x-a.x))/d2(a,b)<EPS),
  cercle: (c,r) => OB.some(o=>o.k==="circ" && Math.hypot(o.cx-c.x,o.cy-c.y)<EPS && Math.abs(o.r-r)<EPS),
  surCercle: p => OB.some(o=>o.k==="circ" && Math.abs(Math.hypot(p.x-o.cx,p.y-o.cy)-o.r)<EPS),
  trouve: f => T.nouveaux().find(f),
  dLine: n => OB.find(o=>o.k==="line" && o.name===n)
};
const lineAB = l => [{x:l.x,y:l.y},{x:l.x+l.dx,y:l.y+l.dy}];

/* ================= outils ================= */
const TOOLS = {
  pt:   {nom:"Point",          aide:"Clique sur la feuille pour placer un point. Près d'une ligne, le point s'accroche dessus ; près d'un croisement, il se place exactement sur l'intersection."},
  seg:  {nom:"Segment",        aide:["Clique sur le premier point (extrémité).","Clique sur le second point (autre extrémité)."]},
  line: {nom:"Droite",         aide:["Clique sur un premier point de la droite.","Clique sur un second point de la droite."]},
  ray:  {nom:"Demi-droite",    aide:["Clique sur l'origine de la demi-droite.","Clique sur un autre point de la demi-droite."]},
  rg:   {nom:"Règle graduée",  aide:["Clique sur le point de départ.","Clique dans la direction voulue (sur un point, une ligne, ou n'importe où).","Écris la longueur, puis valide."]},
  eq:   {nom:"Équerre",        aide:["Clique sur la droite (ou le segment) de référence.","Clique sur le point par lequel doit passer la perpendiculaire."]},
  par:  {nom:"Parallèle",      aide:["Clique sur la droite (ou le segment) de référence.","Clique sur le point par lequel doit passer la parallèle."]},
  comp: {nom:"Compas",         aide:["Pique la pointe du compas : clique sur le centre.","Choisis l'écartement : écris le rayon, ou clique sur un point du cercle, ou sur un segment pour prendre sa longueur."]},
  mes:  {nom:"Mesurer",        aide:["Clique sur un segment pour afficher sa longueur (ou clique sur deux points)."]},
  gom:  {nom:"Gomme",          aide:"Clique sur ce que tu veux effacer (les objets de l'énoncé ne s'effacent pas)."}
};
const ICON = {
  pt:'<path d="M7 7l10 10M17 7L7 17" stroke-width="2.6"/>',
  seg:'<path d="M4 18L20 6" stroke-width="2.2"/><path d="M2 16l4 4M18 4l4 4" stroke-width="2"/>',
  line:'<path d="M1 21L23 3" stroke-width="2.2"/>',
  ray:'<path d="M4 18L23 3" stroke-width="2.2"/><path d="M2 16l4 4" stroke-width="2"/>',
  rg:'<rect x="2" y="8" width="20" height="8" rx="1.5" stroke-width="1.8" fill="none"/><path d="M6 8v3M10 8v4M14 8v3M18 8v4" stroke-width="1.5"/>',
  eq:'<path d="M4 20V4l16 16z" stroke-width="2" fill="none"/><path d="M4 16h4v4" stroke-width="1.5" fill="none"/>',
  par:'<path d="M2 15L18 5M6 21L22 11" stroke-width="2.2"/>',
  comp:'<path d="M12 3v3M12 6l-6 15M12 6l6 15" stroke-width="2"/><circle cx="12" cy="6" r="2" stroke-width="1.6" fill="none"/>',
  mes:'<path d="M3 17L21 7" stroke-width="2"/><path d="M5 13l-2 4 4 1M19 11l2-4-4-1" stroke-width="1.6" fill="none"/>',
  gom:'<path d="M14 4l6 6-9 9H6l-3-3z" stroke-width="1.8" fill="none"/><path d="M9 9l6 6" stroke-width="1.8"/>'
};

/* ================= niveaux ================= */
const G = (name,x,y) => ({k:"pt", name, x, y, given:true});
const D = (name,x1,y1,x2,y2) => { const L=Math.hypot(x2-x1,y2-y1); return {k:"line", name, x:x1, y:y1, dx:(x2-x1)/L, dy:(y2-y1)/L, given:true}; };
const S = (a,b) => ({k:"seg", a, b, given:true});
const R = (a,b) => ({k:"ray", a, b, given:true});
const polar = (A,L,deg) => [A[0]+L*Math.cos(deg*Math.PI/180), A[1]-L*Math.sin(deg*Math.PI/180)];
const B11=polar([3,7],7.4,25), B12=polar([3,7],7,20), D16=polar([2,2.4],3.7,-10);
const BASE=["pt","seg","line","ray"];
const L6 = [
 {groupe:"Découverte", titre:"Placer des points", outils:["pt"], guide:true,
  donnees:[D("(d)",1,8.2,15,5.6)],
  consigne:"Place trois points sur la feuille, dont un point qui appartient à la droite (d).",
  etapes:[
    {t:"Clique sur l'outil <b>Point</b>, en haut.", ok:U=>U.tool==="pt"||T.nouveaux().length>0, tool:"pt"},
    {t:"Clique n'importe où sur la feuille : un point apparaît, avec son nom.", ok:()=>T.nouveaux().length>=1},
    {t:"Place un deuxième point.", ok:()=>T.nouveaux().length>=2},
    {t:"Clique <b>sur la droite (d)</b> : le point s'accroche dessus. Il appartient à la droite.", ok:()=>T.nouveaux().some(p=>distTo(T.dLine("(d)"),p)<EPS)}
  ],
  check:()=> T.nouveaux().length>=3 && T.nouveaux().some(p=>distTo(T.dLine("(d)"),p)<EPS) || "Il faut au moins trois points, dont un point posé sur la droite (d).",
  bravo:"Un point se représente par une petite croix et se nomme avec une lettre majuscule."},
 {groupe:"Découverte", titre:"Tracer un segment", outils:["pt","seg"], guide:true,
  donnees:[G("A",4,6.5), G("B",11.5,3)],
  consigne:"Trace le segment [AB].",
  etapes:[
    {t:"Clique sur l'outil <b>Segment</b>.", ok:U=>U.tool==="seg"||T.seg(T.P("A"),T.P("B")), tool:"seg"},
    {t:"Clique sur le point <b>A</b>.", ok:U=>U.pend.includes("A")||T.seg(T.P("A"),T.P("B")), pts:["A"]},
    {t:"Clique sur le point <b>B</b>.", ok:()=>T.seg(T.P("A"),T.P("B")), pts:["B"]}
  ],
  check:()=> T.seg(T.P("A"),T.P("B")) || "Avec l'outil Segment, clique sur A puis sur B.",
  bravo:"Le segment [AB] s'arrête aux points A et B : ce sont ses extrémités."},
 {groupe:"Découverte", titre:"Droite et demi-droite", outils:["pt","seg","line","ray"], guide:true,
  donnees:[G("A",3,5), G("B",8,3), G("C",9.5,8)],
  consigne:"Trace la droite (AB) et la demi-droite [AC).",
  etapes:[
    {t:"Choisis l'outil <b>Droite</b>, puis clique sur A et sur B.", ok:()=>T.droite(T.P("A"),T.P("B")), tool:"line", pts:["A","B"]},
    {t:"Choisis l'outil <b>Demi-droite</b>, clique d'abord sur son origine <b>A</b>, puis sur <b>C</b>.", ok:()=>T.demi(T.P("A"),T.P("C")), tool:"ray", pts:["A","C"]}
  ],
  check:()=> !T.droite(T.P("A"),T.P("B")) ? "Il manque la droite (AB)." : T.demi(T.P("A"),T.P("C")) || "Il manque la demi-droite [AC) : son origine est A.",
  bravo:"Une droite est illimitée des deux côtés. Une demi-droite a une origine (ici A) et est illimitée d'un seul côté."},
 {groupe:"Découverte", titre:"Le point d'intersection", outils:BASE, guide:true, noms:["E"],
  donnees:[G("A",2,2), G("B",12.5,8.5), G("C",3,8.6), G("D",13.5,2.6)],
  consigne:"Trace les droites (AB) et (CD), puis place leur point d'intersection E.",
  etapes:[
    {t:"Trace la droite (AB).", ok:()=>T.droite(T.P("A"),T.P("B")), tool:"line", pts:["A","B"]},
    {t:"Trace la droite (CD).", ok:()=>T.droite(T.P("C"),T.P("D")), tool:"line", pts:["C","D"]},
    {t:"Avec l'outil <b>Point</b>, clique à l'endroit où les deux droites se croisent.", ok:()=>!!inter4(), tool:"pt"}
  ],
  check:()=> !T.droite(T.P("A"),T.P("B"))||!T.droite(T.P("C"),T.P("D")) ? "Trace d'abord les deux droites (AB) et (CD)." : (inter4() ? {nom:[inter4(),"E"]} : "Place le point E exactement là où les droites se croisent : avec l'outil Point, clique sur le croisement."),
  bravo:"Les droites (AB) et (CD) sont sécantes : elles se coupent au point E."},
 {groupe:"Chapitre 2", titre:"Points alignés", outils:BASE, noms:["C"],
  donnees:[G("A",4,6), G("B",9,4)],
  consigne:"Place un point C tel que les points A, B et C soient alignés, mais que C n'appartienne pas au segment [AB].",
  check:()=>{ const A=T.P("A"),B=T.P("B"); const c=T.trouve(p=>colin(p,A,B) && ((p.x-A.x)*(B.x-A.x)+(p.y-A.y)*(B.y-A.y)<-EPS || (p.x-B.x)*(A.x-B.x)+(p.y-B.y)*(A.y-B.y)<-EPS));
    return c ? {nom:[c,"C"]} : "Trace d'abord la droite (AB), puis place C sur cette droite, en dehors du segment [AB]."; },
  aide:"Des points sont alignés quand ils sont sur une même droite. Trace la droite (AB), puis place un point dessus, mais pas entre A et B.",
  bravo:"A, B et C sont alignés : ils appartiennent à la même droite. C n'est pas entre A et B, donc C ∉ [AB]."},
 {groupe:"Chapitre 2", titre:"Sur la demi-droite", outils:BASE, noms:["M"],
  donnees:[G("A",3,7.5), G("B",7,4.5)],
  consigne:"Trace la demi-droite [AB). Place un point M qui appartient à [AB) mais pas au segment [AB].",
  check:()=>{ const A=T.P("A"),B=T.P("B"); if(!T.demi(A,B)) return "Trace d'abord la demi-droite [AB) : son origine est A.";
    const m=T.trouve(p=>colin(p,A,B) && (p.x-A.x)*(B.x-A.x)+(p.y-A.y)*(B.y-A.y) > d2(A,B)**2+EPS);
    return m ? {nom:[m,"M"]} : "M doit être sur la demi-droite [AB), après le point B."; },
  aide:"La demi-droite [AB) part de A, passe par B et continue après B. Place M sur la demi-droite, plus loin que B.",
  bravo:"M ∈ [AB) mais M ∉ [AB] : il est sur la demi-droite, après B."},
 {groupe:"Chapitre 2", titre:"La perpendiculaire", outils:[...BASE,"eq"],
  donnees:[D("(d)",1,7.2,15,4.6), G("C",7,2)],
  consigne:"Trace la droite perpendiculaire à (d) qui passe par le point C.",
  check:()=>{ const [a,b]=lineAB(T.dLine("(d)")); return T.perp(T.P("C"),a,b) || "Avec l'équerre : clique sur la droite (d), puis sur le point C."; },
  aide:"Choisis l'outil Équerre. Clique d'abord sur la droite (d), puis sur le point C.",
  bravo:"La nouvelle droite et (d) forment un angle droit : elles sont perpendiculaires."},
 {groupe:"Chapitre 2", titre:"Le pied de la perpendiculaire", outils:[...BASE,"eq"], noms:["H"],
  donnees:[D("(d)",1,3,15,6.2), G("C",8.5,8.6)],
  consigne:"Trace la perpendiculaire à (d) passant par C. Elle coupe la droite (d) en un point H : place le point H.",
  check:()=>{ const L=T.dLine("(d)"), [a,b]=lineAB(L), C=T.P("C"); if(!T.perp(C,a,b)) return "Trace d'abord la perpendiculaire à (d) passant par C.";
    const h=T.trouve(p=>distTo(L,p)<EPS && T.eq(p, proj(L,C))); return h ? {nom:[h,"H"]} : "Place H exactement au croisement de la perpendiculaire et de (d)."; },
  aide:"Équerre : clique sur (d), puis sur C. Ensuite, avec l'outil Point, clique au croisement des deux droites.",
  bravo:"H est le pied de la perpendiculaire à (d) passant par C."},
 {groupe:"Chapitre 2", titre:"La parallèle", outils:[...BASE,"eq","par"],
  donnees:[D("(d)",1,8.2,15,5.2), G("C",6,2.8)],
  consigne:"Trace la droite parallèle à (d) qui passe par le point C.",
  check:()=>{ const [a,b]=lineAB(T.dLine("(d)")); return T.para(T.P("C"),a,b) || "Avec l'outil Parallèle : clique sur la droite (d), puis sur le point C."; },
  aide:"Sur papier, on fait glisser l'équerre le long de la règle. Ici, choisis l'outil Parallèle, clique sur (d), puis sur C.",
  bravo:"Les deux droites ne se coupent jamais : elles sont parallèles."},
 {groupe:"Chapitre 4", titre:"Un segment de longueur donnée", outils:[...BASE,"rg"], noms:["B"],
  donnees:[G("A",3,6.5)],
  consigne:"Trace un segment [AB] qui mesure 6 cm.",
  check:()=>{ const A=T.P("A"); const b=T.trouve(p=>T.near(d2(p,A),6) && T.seg(A,p)); return b ? {nom:[b,"B"]} : "Avec la règle graduée : clique sur A, clique dans une direction, puis écris 6."; },
  aide:"Choisis la règle graduée. Clique sur A, puis n'importe où pour donner la direction, puis écris 6 et valide.",
  bravo:"AB = 6 cm : la longueur du segment [AB] est la distance entre A et B."},
 {groupe:"Chapitre 4", titre:"Mesurer", outils:[...BASE,"mes"],
  donnees:[G("A",3,7), G("B",B11[0],B11[1]), S("A","B")],
  consigne:"Mesure la longueur du segment [AB].",
  q:{lab:"AB = ", unite:"cm", ok:s=>Math.abs(parseFloat(s.replace(",","."))-7.4)<1e-9},
  check:()=>true,
  aide:"Choisis l'outil Mesurer et clique sur le segment [AB]. Écris ensuite la longueur dans la case, avec une virgule.",
  bravo:"AB = 7,4 cm."},
 {groupe:"Chapitre 4", titre:"Le milieu", outils:[...BASE,"rg","mes"], noms:["M"],
  donnees:[G("A",3,7), G("B",B12[0],B12[1]), S("A","B")],
  consigne:"Place le milieu M du segment [AB].",
  check:()=>{ const A=T.P("A"),B=T.P("B"); const m=T.trouve(p=>T.eq(p,{x:(A.x+B.x)/2,y:(A.y+B.y)/2})); return m ? {nom:[m,"M"]} : "Le milieu est sur le segment, à égale distance de A et de B. Mesure [AB], puis utilise la règle graduée depuis A en direction de B."; },
  aide:"Mesure [AB] : il mesure 7 cm. Le milieu est donc à 7 ÷ 2 = 3,5 cm de A. Règle graduée : clique sur A, puis sur B (pour la direction), puis écris 3,5.",
  bravo:"AM = MB = 3,5 cm et M ∈ [AB] : M est le milieu de [AB]."},
 {groupe:"Chapitre 4", titre:"Un cercle", outils:[...BASE,"rg","comp"],
  donnees:[G("O",8,5)],
  consigne:"Trace le cercle de centre O et de rayon 3 cm.",
  check:()=> T.cercle(T.P("O"),3) || "Avec le compas : clique sur O, puis écris 3 comme rayon.",
  aide:"Choisis le compas. Pique la pointe sur O (clique sur O), puis écris 3 dans la case « rayon » et valide.",
  bravo:"Tous les points du cercle sont à 3 cm du centre O."},
 {groupe:"Chapitre 4", titre:"Rayon et diamètre", outils:[...BASE,"rg","comp","mes"], noms:["B"],
  donnees:[G("O",8,5), G("A",10.5,3.5)],
  consigne:"Trace le cercle de centre O qui passe par A, puis trace le diamètre [AB] de ce cercle.",
  check:()=>{ const O=T.P("O"),A=T.P("A"); if(!T.cercle(O,d2(O,A))) return "Trace d'abord le cercle de centre O passant par A : compas, clique sur O, puis sur A.";
    const b=T.trouve(p=>T.eq(p,{x:2*O.x-A.x,y:2*O.y-A.y})); if(!b) return "B est sur le cercle, à l'opposé de A : trace la droite (AO), puis place le point où elle recoupe le cercle.";
    return T.seg(A,b) ? {nom:[b,"B"]} : "Il manque le segment [AB]."; },
  aide:"Un diamètre passe par le centre. Trace la droite (AO) : elle recoupe le cercle en B. Place B, puis trace [AB].",
  bravo:"[AB] est un diamètre : il passe par le centre O, et AB = 2 × OA."},
 {groupe:"Défis", defi:true, titre:"Défi : à 4 cm et à 3 cm", outils:[...BASE,"rg","comp","mes"], noms:["C"],
  donnees:[G("A",5,7.5), G("B",10,7.5), S("A","B")],
  consigne:"Place un point C tel que AC = 4 cm et BC = 3 cm, puis trace le triangle ABC.",
  check:()=>{ const A=T.P("A"),B=T.P("B"); const c=T.trouve(p=>T.near(d2(p,A),4)&&T.near(d2(p,B),3)); if(!c) return "C est à 4 cm de A : il est sur le cercle de centre A et de rayon 4 cm. Il est aussi à 3 cm de B…";
    return T.seg(A,c)&&T.seg(B,c) ? {nom:[c,"C"]} : "Il manque les côtés [AC] et [BC] du triangle."; },
  aide:"Trace le cercle de centre A de rayon 4 cm et le cercle de centre B de rayon 3 cm. C est à un croisement des deux cercles.",
  voir:"1. Compas : centre A, rayon 4. — 2. Compas : centre B, rayon 3. — 3. Outil Point : clique sur un croisement des deux cercles, c'est C. — 4. Trace [AC] et [BC].",
  bravo:"C est à la fois à 4 cm de A et à 3 cm de B : c'est l'intersection des deux cercles."},
 {groupe:"Défis", defi:true, titre:"Défi : reporter une longueur", outils:[...BASE,"comp"], sans:["rg","mes"], compasSansSaisie:true, noms:["B"],
  donnees:[G("C",2,2.4), G("D",D16[0],D16[1]), S("C","D"), G("A",4,8.6), G("x",14,4.6), R("A","x")],
  consigne:"Sans règle graduée, place sur la demi-droite [Ax) le point B tel que AB = CD.",
  check:()=>{ const A=T.P("A"),X=T.P("x"),C=T.P("C"),Dd=T.P("D"); const b=T.trouve(p=>colin(p,A,X) && (p.x-A.x)*(X.x-A.x)+(p.y-A.y)*(X.y-A.y)>0 && T.near(d2(p,A),d2(C,Dd)));
    return b ? {nom:[b,"B"]} : "Prends l'écartement CD avec le compas, puis reporte-le depuis A sur la demi-droite."; },
  aide:"Compas : clique sur A (la pointe), puis sur le segment [CD] pour prendre son écartement. Le cercle coupe la demi-droite en B.",
  voir:"1. Compas : clique sur A, puis sur le segment [CD]. — 2. Outil Point : clique là où le cercle coupe la demi-droite [Ax), c'est B.",
  bravo:"On a reporté la longueur CD avec le compas : AB = CD, sans rien mesurer !"}
];
function inter4(){ const A=T.P("A"),B=T.P("B"),C=T.P("C"),Dd=T.P("D"); if(!A||!B||!C||!Dd) return null;
  const I=interLL({x:A.x,y:A.y,dx:(B.x-A.x)/d2(A,B),dy:(B.y-A.y)/d2(A,B),t0:-Infinity,t1:Infinity},{x:C.x,y:C.y,dx:(Dd.x-C.x)/d2(C,Dd),dy:(Dd.y-C.y)/d2(C,Dd),t0:-Infinity,t1:Infinity})[0];
  return T.trouve(p=>T.eq(p,I)); }

/* ================= géométrie dynamique (5e) ================= */
/* Chaque objet garde sa « définition » (def) : quand on déplace un point, tout est recalculé. */
const byId = id => OB.find(o=>o.id===id);
function param(c,q){ if(c.k==="circ") return Math.atan2(q.y-c.cy, q.x-c.cx); const l=lin(c); return (q.x-l.x)*l.dx+(q.y-l.y)*l.dy; }
function rotP(P,O,deg){ const t=deg*Math.PI/180, dx=P.x-O.x, dy=P.y-O.y; return {x:O.x+dx*Math.cos(t)+dy*Math.sin(t), y:O.y-dx*Math.sin(t)+dy*Math.cos(t)}; }
function recompute(){
  for(const o of OB){
    const d=o.def; if(!d) continue;
    if(o.k==="pt"){
      let q=null;
      if(d.t==="free") continue;
      if(d.t==="on"){ const c=byId(d.o); if(!c) continue; if(c.k==="circ") q={x:c.cx+c.r*Math.cos(d.s), y:c.cy+c.r*Math.sin(d.s)}; else { const l=lin(c), t=Math.max(l.t0,Math.min(l.t1,d.s)); q={x:l.x+t*l.dx, y:l.y+t*l.dy}; } }
      else if(d.t==="int"){ const a=byId(d.a), b=byId(d.b), c=a&&b?inter(a,b):[]; if(!c.length){ o.hid=true; continue; } q=c.reduce((m,z)=>d2(z,o)<d2(m,o)?z:m); }
      else if(d.t==="mid"){ const A=byId(d.A), B=byId(d.B); q={x:(A.x+B.x)/2, y:(A.y+B.y)/2}; }
      else if(d.t==="sym"){ const P=byId(d.P), O=byId(d.O); q={x:2*O.x-P.x, y:2*O.y-P.y}; }
      else if(d.t==="par4"){ const A=byId(d.A), B=byId(d.B), C=byId(d.C); q={x:A.x+C.x-B.x, y:A.y+C.y-B.y}; }
      else if(d.t==="len"){ const A=byId(d.A); let v=d.v; if(d.D){ const Dd=byId(d.D), l=d2(A,Dd)||1; v={x:(Dd.x-A.x)/l, y:(Dd.y-A.y)/l}; } q={x:A.x+d.L*v.x, y:A.y+d.L*v.y}; }
      else if(d.t==="rot"){ q=rotP(byId(d.P), byId(d.O), d.deg); }
      else if(d.t==="tr"||d.t==="sax"||d.t==="hom"){ q=tfPos(d); }
      if(q){ o.x=q.x; o.y=q.y; o.hid=false; }
    } else if(o.k==="line"){
      let x,y,dx,dy;
      if(d.t==="2p"){ const A=byId(d.A), B=byId(d.B), l=d2(A,B)||1; x=A.x; y=A.y; dx=(B.x-A.x)/l; dy=(B.y-A.y)/l; }
      else if(d.t==="perp"||d.t==="par"){ const l=lin(byId(d.l)), P=byId(d.P); x=P.x; y=P.y; [dx,dy]= d.t==="perp" ? [-l.dy,l.dx] : [l.dx,l.dy]; }
      else if(d.t==="med"){ const A=byId(d.A), B=byId(d.B), l=d2(A,B)||1; x=(A.x+B.x)/2; y=(A.y+B.y)/2; dx=-(B.y-A.y)/l; dy=(B.x-A.x)/l; }
      Object.assign(o,{x,y,dx,dy});
    } else if(o.k==="circ"){
      const C=byId(d.C); o.cx=C.x; o.cy=C.y;
      if(d.t==="cp") o.r=d2(C,byId(d.P)); else if(d.t==="cs"){ const s=byId(d.s); o.r=d2(pt(s.a),pt(s.b)); } else o.r=d.r;
    }
  }
}
/* objets qui dépendent d'un objet (pour l'outil Effacer) */
function dependants(id){
  const out=new Set([id]); let grew=true;
  while(grew){ grew=false; for(const o of OB){ if(out.has(o.id)) continue;
    const refs=[o.a,o.b,o.c,o.o, ...(o.pts||[]), ...(o.def?Object.entries(o.def).filter(([k])=>!["t","deg","k","L","r","v"].includes(k) && (k!=="s" || o.def.t==="cs")).map(([,v])=>v):[])];
    if(refs.some(r=>out.has(r))){ out.add(o.id); grew=true; } } }
  return out;
}

/* ================= vérifications supplémentaires ================= */
Object.assign(T, {
  med: (a,b) => OB.some(o=>o.k==="line" && distTo(o,{x:(a.x+b.x)/2,y:(a.y+b.y)/2})<EPS && Math.abs(o.dx*(b.x-a.x)+o.dy*(b.y-a.y))/d2(a,b)<EPS),
  angle: (a,o,b) => { const u=Math.atan2(a.y-o.y,a.x-o.x), v=Math.atan2(b.y-o.y,b.x-o.x); let t=Math.abs(u-v)*180/Math.PI; return t>180?360-t:t; },
  moved: () => MOVED,
  mid: (a,b) => ({x:(a.x+b.x)/2, y:(a.y+b.y)/2}),
  sym: (p,o) => ({x:2*o.x-p.x, y:2*o.y-p.y}),
  circum: (A,B,C) => { const d=2*(A.x*(B.y-C.y)+B.x*(C.y-A.y)+C.x*(A.y-B.y)), a2=A.x*A.x+A.y*A.y, b2=B.x*B.x+B.y*B.y, c2=C.x*C.x+C.y*C.y;
    return {x:(a2*(B.y-C.y)+b2*(C.y-A.y)+c2*(A.y-B.y))/d, y:(a2*(C.x-B.x)+b2*(A.x-C.x)+c2*(B.x-A.x))/d}; },
  rep: () => ($("gqsel")||{}).dataset ? ($("gqsel").dataset.v||"") : ""
});
let MOVED=false;

/* ================= outils de la 5e (vocabulaire GeoGebra) ================= */
const TOOLS5 = {
  move:  {nom:"Déplacer", aide:"Attrape un point de départ avec la souris et déplace-le : toute la figure suit !"},
  pt:    {nom:"Point", aide:"Clique pour créer un point. Près d'un objet, le point s'accroche dessus ; près d'un croisement, il se place sur l'intersection."},
  inter: {nom:"Intersection", aide:["Clique sur un premier objet (droite, segment, cercle…).","Clique sur un second objet : les points d'intersection sont créés."]},
  mid:   {nom:"Milieu ou centre", aide:["Clique sur un segment, ou sur un premier point.","Clique sur le second point."]},
  seg:   {nom:"Segment", aide:["Clique sur le premier point.","Clique sur le second point."]},
  line:  {nom:"Droite", aide:["Clique sur un premier point.","Clique sur un second point."]},
  ray:   {nom:"Demi-droite", aide:["Clique sur l'origine.","Clique sur un autre point de la demi-droite."]},
  seglen:{nom:"Segment de longueur donnée", aide:["Clique sur le point de départ.","Écris la longueur : le segment est tracé vers la droite."]},
  poly:  {nom:"Polygone", aide:["Clique sur les sommets les uns après les autres.","Clique sur le sommet suivant… et termine en cliquant sur le premier sommet."]},
  perp:  {nom:"Perpendiculaire", aide:["Clique sur un point et sur une droite (dans l'ordre que tu veux).","Clique sur l'autre objet."]},
  par:   {nom:"Parallèle", aide:["Clique sur un point et sur une droite (dans l'ordre que tu veux).","Clique sur l'autre objet."]},
  med:   {nom:"Médiatrice", aide:["Clique sur un segment, ou sur un premier point.","Clique sur le second point."]},
  circp: {nom:"Cercle (centre-point)", aide:["Clique sur le centre.","Clique sur un point du cercle."]},
  circr: {nom:"Cercle (centre-rayon)", aide:["Clique sur le centre.","Écris le rayon."]},
  sym:   {nom:"Symétrie centrale", aide:["Clique sur l'objet à transformer (point, segment ou polygone).","Clique sur le centre de symétrie."]},
  angle: {nom:"Angle de mesure donnée", aide:["Clique sur un point d'un côté de l'angle.","Clique sur le sommet de l'angle.","Écris la mesure et choisis le sens."]},
  angm:  {nom:"Angle", aide:["Clique sur un point d'un côté.","Clique sur le sommet.","Clique sur un point de l'autre côté : la mesure s'affiche."]},
  dist:  {nom:"Distance ou longueur", aide:["Clique sur un segment, ou sur deux points : la longueur s'affiche."]},
  gom:   {nom:"Effacer", aide:"Clique sur un objet pour l'effacer (avec tout ce qui en dépend)."}
};
Object.assign(ICON, {
  move:'<path d="M6 3l12 9-5.2.8 3 6.2-2.2 1-3-6.2L6 18z" stroke-width="1.7" fill="none"/>',
  inter:'<path d="M3 20L21 4M3 5l18 14" stroke-width="2"/><circle cx="12" cy="12" r="2.6" fill="#1a5fb4" stroke="none"/>',
  mid:'<path d="M2 18L22 6" stroke-width="2"/><circle cx="12" cy="12" r="2.6" fill="#1a5fb4" stroke="none"/>',
  seglen:'<path d="M3 15h18" stroke-width="2.2"/><path d="M3 11v8M21 11v8" stroke-width="1.6"/><path d="M8 9h8" stroke-width="1.3" stroke-dasharray="1.5 1.5"/>',
  poly:'<path d="M4 19L8 5l12 4-3 10z" stroke-width="2" fill="none"/>',
  perp:'<path d="M2 18h20M12 18V3" stroke-width="2"/><path d="M12 14h4v4" stroke-width="1.4" fill="none"/>',
  med:'<path d="M3 16L21 8" stroke-width="2"/><path d="M8 4l8 16" stroke-width="2"/><path d="M5 14l.8 2M18 9l.8 2" stroke-width="1.4"/>',
  circp:'<circle cx="12" cy="12" r="9" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="1.6" fill="#1f1f1f" stroke="none"/><circle cx="18.4" cy="5.6" r="2" fill="#1a5fb4" stroke="none"/>',
  circr:'<circle cx="12" cy="12" r="9" stroke-width="2" fill="none"/><path d="M12 12h9" stroke-width="1.6"/><circle cx="12" cy="12" r="1.6" fill="#1f1f1f" stroke="none"/>',
  sym:'<circle cx="12" cy="12" r="1.8" fill="#1f1f1f" stroke="none"/><path d="M3 6l4 3M17 15l4 3" stroke-width="2.2"/><path d="M7 9l10 6" stroke-width="1.2" stroke-dasharray="1.6 1.6"/>',
  angle:'<path d="M3 20h18M3 20L15 5" stroke-width="2"/><path d="M10 20a7 7 0 0 0-2.5-5.3" stroke-width="1.6" fill="none"/>',
  angm:'<path d="M3 20h18M3 20L15 5" stroke-width="2"/><path d="M10 20a7 7 0 0 0-2.5-5.3" stroke-width="1.6" fill="none"/><path d="M17 10h4" stroke-width="1.4"/>',
  dist:'<path d="M3 17L21 7" stroke-width="2"/><path d="M5 13l-2 4 4 1M19 11l2-4-4-1" stroke-width="1.6" fill="none"/>'
});

/* ================= niveaux de 5e ================= */
const PG = (names) => ({k:"poly", names, given:true});
const ANG = n => `<span class="ang">${n}</span>`;
const B5 = ["move","pt","seg","line","ray"];
const TRI = () => [G("A",3,8), G("B",11.5,8.6), G("C",7.5,2.2), PG(["A","B","C"])];
const L5 = [
 {groupe:"Découverte", titre:"Déplacer un point", outils:B5, guide:true,
  donnees:[G("A",4,7), G("B",11,4)],
  consigne:"Trace le segment [AB], puis déplace le point A avec l'outil <b>Déplacer</b> : le segment suit le point !",
  etapes:[
    {t:"Choisis l'outil <b>Segment</b>, puis clique sur A et sur B.", ok:()=>T.seg(T.P("A"),T.P("B")), tool:"seg", pts:["A","B"]},
    {t:"Choisis l'outil <b>Déplacer</b> (la flèche).", ok:U=>U.tool==="move"||MOVED, tool:"move"},
    {t:"Attrape le point <b>A</b> avec la souris et fais-le glisser ailleurs.", ok:()=>MOVED, pts:["A"]}
  ],
  check:()=> !T.seg(T.P("A"),T.P("B")) ? "Trace d'abord le segment [AB]." : (MOVED || "Avec l'outil Déplacer, fais glisser le point A."),
  bravo:"Dans un logiciel de géométrie dynamique, la figure garde ses propriétés quand on déplace ses points de départ."},
 {groupe:"Découverte", titre:"Milieu et médiatrice", outils:[...B5,"mid","med"], guide:true, noms:["I"],
  donnees:[G("A",3,6.5), G("B",12,4)],
  consigne:"Place le milieu I du segment [AB], puis trace la médiatrice de [AB].",
  etapes:[
    {t:"Outil <b>Milieu ou centre</b> : clique sur A, puis sur B.", ok:()=>!!T.trouve(p=>T.eq(p,T.mid(T.P("A"),T.P("B")))), tool:"mid", pts:["A","B"]},
    {t:"Outil <b>Médiatrice</b> : clique sur A, puis sur B.", ok:()=>T.med(T.P("A"),T.P("B")), tool:"med", pts:["A","B"]}
  ],
  check:()=>{ const A=T.P("A"),B=T.P("B"), i=T.trouve(p=>T.eq(p,T.mid(A,B))); if(!i) return "Place le milieu de [AB] avec l'outil Milieu ou centre."; if(!T.med(A,B)) return "Trace la médiatrice de [AB] avec l'outil Médiatrice."; return {nom:[i,"I"]}; },
  bravo:"La médiatrice de [AB] est la droite perpendiculaire à [AB] qui passe par son milieu I."},
 {groupe:"Découverte", titre:"Intersection", outils:[...B5,"inter"], guide:true, noms:["E"],
  donnees:[G("A",2,2), G("B",12.5,8.5), G("C",3,8.6), G("D",13.5,2.6)],
  consigne:"Trace les droites (AB) et (CD), puis crée leur point d'intersection E avec l'outil Intersection.",
  etapes:[
    {t:"Outil <b>Droite</b> : trace (AB), puis (CD).", ok:()=>T.droite(T.P("A"),T.P("B"))&&T.droite(T.P("C"),T.P("D")), tool:"line", pts:["A","B","C","D"]},
    {t:"Outil <b>Intersection</b> : clique sur la droite (AB), puis sur la droite (CD).", ok:()=>!!inter4(), tool:"inter"}
  ],
  check:()=> !T.droite(T.P("A"),T.P("B"))||!T.droite(T.P("C"),T.P("D")) ? "Trace d'abord les droites (AB) et (CD)." : (inter4() ? {nom:[inter4(),"E"]} : "Outil Intersection : clique sur les deux droites."),
  bravo:"Essaie l'outil Déplacer sur A : le point E reste toujours à l'intersection des deux droites !"},
 {groupe:"Chapitre 2", titre:"Symétrique d'un point", outils:[...B5,"inter","mid","sym"], noms:["A'"],
  donnees:[G("A",4,3), G("O",8,5.5)],
  consigne:"Construis le point A', symétrique du point A par rapport au point O.",
  check:()=>{ const a=T.trouve(p=>T.eq(p,T.sym(T.P("A"),T.P("O")))); return a ? {nom:[a,"A'"]} : "Outil Symétrie centrale : clique sur A, puis sur le centre O."; },
  aide:"Choisis l'outil Symétrie centrale. Clique d'abord sur l'objet à transformer (A), puis sur le centre de symétrie (O).",
  bravo:"O est le milieu du segment [AA'] : c'est la définition du symétrique par rapport à un point."},
 {groupe:"Chapitre 2", titre:"Symétrique d'un triangle", outils:[...B5,"inter","mid","sym","poly"],
  donnees:[G("A",2,7), G("B",6,8.5), G("C",4.5,4), PG(["A","B","C"]), G("O",8,5)],
  consigne:"Construis le symétrique du triangle ABC par rapport au point O. Nomme ses sommets A', B' et C'.",
  check:()=>{ const O=T.P("O"); const s=["A","B","C"].map(n=>T.trouve(p=>T.eq(p,T.sym(T.P(n),O))));
    if(s.some(x=>!x)) return "Il manque des sommets : avec l'outil Symétrie centrale, clique sur le triangle (ou sur chaque sommet), puis sur O.";
    if(!(T.seg(s[0],s[1])&&T.seg(s[1],s[2])&&T.seg(s[2],s[0]))) return "Les sommets sont placés : il manque les côtés du triangle A'B'C'.";
    s.forEach((p,i)=>{ const n=["A","B","C"][i]+"'"; const o=OB.find(q=>q.k==="pt"&&q.name===n&&q!==p&&!q.given); if(o) o.name=nextName(); p.name=n; }); return true; },
  aide:"Outil Symétrie centrale : clique sur un côté du triangle (tout le triangle est choisi), puis sur O.",
  bravo:"Le symétrique d'un triangle est un triangle de mêmes dimensions, « retourné » d'un demi-tour autour de O."},
 {groupe:"Chapitre 2", defi:true, titre:"Défi : sans l'outil Symétrie", outils:[...B5,"inter","mid","sym","poly","circp","circr"], sans:["sym","mid"], noms:["A'"],
  donnees:[G("A",4,3.5), G("O",8,6)],
  consigne:"Sans les outils Symétrie centrale ni Milieu, construis le point A', symétrique de A par rapport à O.",
  check:()=>{ const a=T.trouve(p=>T.eq(p,T.sym(T.P("A"),T.P("O")))); return a ? {nom:[a,"A'"]} : "A' est sur la droite (AO), de l'autre côté de O, à la même distance de O que A."; },
  aide:"A' est sur la droite (AO) et OA' = OA. Trace la droite (AO) et le cercle de centre O passant par A.",
  voir:"1. Droite (AO). — 2. Cercle (centre-point) : centre O, passant par A. — 3. Intersection : clique sur la droite et sur le cercle ; le nouveau point est A'.",
  bravo:"Tu as construit le symétrique comme sur papier, au compas : O est le milieu de [AA']."},
 {groupe:"Chapitre 4", titre:"Construire un parallélogramme", outils:[...B5,"inter","mid","sym","poly","circp","circr","par","perp"], noms:["D"],
  donnees:[G("A",3,7.5), G("B",9,8.5), G("C",12,4), S("A","B"), S("B","C")],
  consigne:"Place le point D pour que ABCD soit un parallélogramme, puis trace les côtés [CD] et [DA].",
  check:()=>{ const A=T.P("A"),B=T.P("B"),C=T.P("C"); const d=T.trouve(p=>T.eq(p,{x:A.x+C.x-B.x,y:A.y+C.y-B.y}));
    if(!d) return "Dans un parallélogramme, les côtés opposés sont parallèles : (CD) // (AB) et (AD) // (BC)."; return T.seg(C,d)&&T.seg(d,A) ? {nom:[d,"D"]} : "D est bien placé : trace maintenant [CD] et [DA]."; },
  aide:"Trace la parallèle à (AB) passant par C, et la parallèle à (BC) passant par A. D est leur point d'intersection.",
  bravo:"(AB) // (DC) et (AD) // (BC) : ABCD est un parallélogramme."},
 {groupe:"Chapitre 4", titre:"Avec les diagonales", outils:[...B5,"inter","mid","sym","poly","circp","circr","par","perp"], noms:["C","D"],
  donnees:[G("A",4,7), G("B",9,8), G("O",8,5)],
  consigne:"Construis le parallélogramme ABCD de centre O.",
  check:()=>{ const A=T.P("A"),B=T.P("B"),O=T.P("O"); const c=T.trouve(p=>T.eq(p,T.sym(A,O))), d=T.trouve(p=>T.eq(p,T.sym(B,O)));
    if(!c||!d) return "Le centre O est le milieu des diagonales [AC] et [BD] : C est le symétrique de A par rapport à O, D celui de B.";
    if(!(T.seg(A,B)&&T.seg(B,c)&&T.seg(c,d)&&T.seg(d,A))) return "C et D sont placés : trace les quatre côtés (l'outil Polygone le fait d'un coup).";
    [[c,"C"],[d,"D"]].forEach(([p,n])=>{ const o=OB.find(q=>q.k==="pt"&&q.name===n&&q!==p&&!q.given); if(o) o.name=nextName(); p.name=n; }); return true; },
  aide:"Les diagonales d'un parallélogramme ont le même milieu. Avec la Symétrie centrale de centre O : A donne C, et B donne D.",
  bravo:"Les diagonales [AC] et [BD] se coupent en leur milieu O : ABCD est un parallélogramme."},
 {groupe:"Chapitre 4", titre:"Observer en déplaçant", outils:[...B5,"dist","angm"],
  donnees:[G("A",3,7.5), G("B",9,8.6), G("C",12.5,3.6), {k:"pt",name:"D",x:6.5,y:2.5,given:true,def:{t:"par4",A:"A",B:"B",C:"C"}}, PG(["A","B","C","D"])],
  consigne:"ABCD est un parallélogramme. Affiche les longueurs AB et DC avec l'outil <b>Distance ou longueur</b>, puis déplace les points A, B ou C.",
  q:{lab:"Que remarques-tu ?", choix:["AB et DC sont toujours égales","AB et DC sont égales seulement dans certains cas"], ok:s=>s.startsWith("AB et DC sont toujours")},
  check:()=> !OB.some(o=>o.k==="mes") ? "Affiche d'abord les longueurs AB et DC." : (MOVED || "Déplace un des points A, B ou C pour observer."),
  aide:"Distance ou longueur : clique sur le côté [AB], puis sur le côté [DC]. Ensuite, outil Déplacer.",
  bravo:"Dans un parallélogramme, les côtés opposés ont toujours la même longueur : AB = DC et AD = BC."},
 {groupe:"Chapitre 6", titre:"Les trois médiatrices", outils:[...B5,"inter","mid","med","circp","dist"], noms:["O"],
  donnees:TRI(),
  consigne:"Trace les trois médiatrices du triangle ABC, crée leur point d'intersection O, puis le cercle de centre O passant par A. Déplace ensuite un sommet.",
  q:{lab:"Que remarques-tu ?", choix:["Les trois médiatrices se coupent toujours en un même point","Les trois médiatrices ne se coupent pas toujours en un même point"], ok:s=>s.includes("toujours en un même")},
  check:()=>{ const A=T.P("A"),B=T.P("B"),C=T.P("C"); if(!(T.med(A,B)&&T.med(B,C)&&T.med(C,A))) return "Trace les trois médiatrices : celles de [AB], [BC] et [CA].";
    const O=T.circum(A,B,C), o=T.trouve(p=>T.eq(p,O)); if(!o) return "Crée le point d'intersection des médiatrices avec l'outil Intersection.";
    if(!T.cercle(o,d2(o,A))) return "Trace le cercle de centre O passant par A : il passe aussi par B et C !"; if(!MOVED) return "Avec l'outil Déplacer, bouge un sommet du triangle et observe.";
    return {nom:[o,"O"]}; },
  aide:"Outil Médiatrice : clique sur un côté du triangle (trois fois, un par côté). Puis Intersection sur deux médiatrices, et Cercle (centre-point) : O puis A.",
  bravo:"Les trois médiatrices d'un triangle sont concourantes : elles se coupent en O, le centre du cercle qui passe par les trois sommets (le cercle circonscrit)."},
 {groupe:"Chapitre 6", titre:"Une hauteur", outils:[...B5,"inter","mid","med","circp","dist","perp"], noms:["H"],
  donnees:TRI(),
  consigne:"Trace la hauteur du triangle ABC issue de A, puis place son pied H sur la droite (BC).",
  check:()=>{ const A=T.P("A"),B=T.P("B"),C=T.P("C"); if(!T.perp(A,B,C)) return "La hauteur issue de A est la droite qui passe par A et qui est perpendiculaire à (BC).";
    const t=((A.x-B.x)*(C.x-B.x)+(A.y-B.y)*(C.y-B.y))/(d2(B,C)**2), Hh={x:B.x+t*(C.x-B.x), y:B.y+t*(C.y-B.y)}; const h=T.trouve(p=>T.eq(p,Hh));
    return h ? {nom:[h,"H"]} : "Crée le pied H : l'intersection de la hauteur et du côté [BC]."; },
  aide:"Outil Perpendiculaire : clique sur A, puis sur le côté [BC]. Puis outil Intersection : la hauteur et le côté [BC].",
  bravo:"La hauteur issue de A passe par A et est perpendiculaire au côté opposé [BC] : (AH) ⊥ (BC)."},
 {groupe:"Chapitre 6", titre:"Les trois hauteurs", outils:[...B5,"inter","mid","med","circp","dist","perp"],
  donnees:TRI(),
  consigne:"Trace les trois hauteurs du triangle ABC (sous forme de droites). Déplace ensuite les sommets, et rends même le triangle très « aplati ».",
  q:{lab:"Que remarques-tu ?", choix:["Les trois hauteurs se coupent toujours en un même point","Les trois hauteurs ne se coupent pas toujours en un même point"], ok:s=>s.includes("toujours en un même")},
  check:()=>{ const A=T.P("A"),B=T.P("B"),C=T.P("C"); if(!(T.perp(A,B,C)&&T.perp(B,C,A)&&T.perp(C,A,B))) return "Trace les trois hauteurs : celle issue de A, celle issue de B et celle issue de C."; return MOVED || "Avec l'outil Déplacer, bouge les sommets et observe le point de rencontre."; },
  aide:"Outil Perpendiculaire : A puis [BC] ; B puis [CA] ; C puis [AB].",
  bravo:"Les trois hauteurs d'un triangle sont concourantes. Leur point de rencontre peut même sortir du triangle quand un angle est obtus !"},
 {groupe:"Chapitre 6", titre:"Une médiane", outils:[...B5,"inter","mid","med","circp","dist","perp"], noms:["I"],
  donnees:TRI(),
  consigne:"Trace la médiane du triangle ABC issue de A : le segment qui joint A au milieu I du côté [BC].",
  check:()=>{ const A=T.P("A"),B=T.P("B"),C=T.P("C"), i=T.trouve(p=>T.eq(p,T.mid(B,C))); if(!i) return "Place d'abord le milieu I de [BC].";
    return T.seg(A,i) ? {nom:[i,"I"]} : "Trace le segment [AI]."; },
  aide:"Outil Milieu ou centre : clique sur le côté [BC]. Puis outil Segment : A et le milieu.",
  bravo:"La médiane issue de A joint le sommet A au milieu du côté opposé."},
 {groupe:"Chapitre 8", titre:"Un angle de mesure donnée", outils:[...B5,"inter","circr","circp","dist","angle","angm"], noms:["C"],
  donnees:[G("A",3,8), G("B",9,8), S("A","B")],
  consigne:`Construis le triangle ABC tel que AB = 6 cm, ${ANG("BAC")} = 50° et AC = 4 cm.`,
  check:()=>{ const A=T.P("A"),B=T.P("B"); const c=T.trouve(p=>T.near(d2(p,A),4) && Math.abs(T.angle(B,A,p)-50)<1e-6);
    if(!c) return `C est à 4 cm de A, et ${ANG("BAC")} mesure 50°.`; return T.seg(A,c)&&T.seg(B,c) ? {nom:[c,"C"]} : "C est bien placé : trace les côtés [AC] et [BC]."; },
  aide:"Angle de mesure donnée : clique sur B, puis sur le sommet A, écris 50. Trace la demi-droite qui part de A vers le nouveau point. Puis Cercle (centre-rayon) : centre A, rayon 4. C est l'intersection.",
  voir:"1. Angle de mesure donnée : B, puis A, 50° (sens inverse des aiguilles d'une montre). — 2. Demi-droite : A, puis le nouveau point. — 3. Cercle (centre-rayon) : A, rayon 4. — 4. Intersection : la demi-droite et le cercle, c'est C. — 5. Segments [AC] et [BC].",
  bravo:`AB = 6 cm, ${ANG("BAC")} = 50° et AC = 4 cm : le triangle est construit. Vérifie avec l'outil Angle !`},
 {groupe:"Chapitre 8", defi:true, titre:"Défi : un triangle impossible ?", outils:[...B5,"inter","circr","circp","dist","angle","angm"],
  donnees:[G("A",3,6), G("B",11,6), S("A","B")],
  consigne:"AB = 8 cm. Essaie de construire un triangle ABC tel que AC = 3 cm et BC = 4 cm.",
  q:{lab:"Peut-on construire ce triangle ?", choix:["Oui","Non, c'est impossible"], ok:s=>s.startsWith("Non")},
  check:()=> (T.cercle(T.P("A"),3) && T.cercle(T.P("B"),4)) || "Trace le cercle de centre A de rayon 3 cm et le cercle de centre B de rayon 4 cm, puis observe.",
  aide:"C doit être à 3 cm de A (sur un cercle) et à 4 cm de B (sur un autre cercle). Les deux cercles se coupent-ils ?",
  bravo:"Les deux cercles ne se coupent pas : 3 + 4 = 7, et 7 < 8. Dans un triangle, chaque côté est plus petit que la somme des deux autres (l'inégalité triangulaire)."}
];

/* ================= outils et niveaux de 4e et de 3e (transformations, Pythagore, Thalès) ================= */
const TOOLS34 = Object.assign({}, TOOLS5, {
  trans: {nom:"Translation", aide:["Clique sur l'objet à transformer (point, segment ou polygone).","Clique sur la flèche, ou sur son point de départ.","Clique sur le point d'arrivée de la flèche."]},
  symax: {nom:"Symétrie axiale", aide:["Clique sur l'objet à transformer (point, segment ou polygone).","Clique sur l'axe de symétrie (une droite ou un segment)."]},
  rot:   {nom:"Rotation", aide:["Clique sur l'objet à transformer (point, segment ou polygone).","Clique sur le centre de la rotation.","Écris l'angle et choisis le sens."]},
  hom:   {nom:"Homothétie", aide:["Clique sur l'objet à transformer (point, segment ou polygone).","Clique sur le centre de l'homothétie.","Écris le rapport (il peut être négatif)."]}
});
Object.assign(ICON, {
  trans:'<path d="M2.5 15l3-6 3 6z" stroke-width="1.6" fill="none"/><path d="M15.5 15l3-6 3 6z" stroke-width="1.6" fill="none"/><path d="M5 19.5h13m-3-3 3 3-3 3" stroke-width="1.6" fill="none"/>',
  symax:'<path d="M12 2v20" stroke-width="1.5" stroke-dasharray="2 2"/><path d="M9 7L3.5 17H9z" stroke-width="1.6" fill="none"/><path d="M15 7l5.5 10H15z" stroke-width="1.6" fill="none"/>',
  rot:'<circle cx="12" cy="14" r="1.9" fill="#1f1f1f" stroke="none"/><path d="M4.5 14a7.5 7.5 0 0 1 13.2-4.9" stroke-width="1.8" fill="none"/><path d="M18.6 4.6v4.9h-4.9" stroke-width="1.6" fill="none"/>',
  hom:'<circle cx="3" cy="20.5" r="1.7" fill="#1f1f1f" stroke="none"/><path d="M7 16l2.5-4 2.5 4z" stroke-width="1.5" fill="none"/><path d="M12 14.5l4.5-8 4.5 8z" stroke-width="1.5" fill="none"/><path d="M3 20.5L19 3" stroke-width="1" stroke-dasharray="1.6 1.6"/>'
});
/* position de l'image d'un point (définitions « tr », « sax », « rot », « hom ») */
function reflect(P, A, dx, dy){ const t=(P.x-A.x)*dx+(P.y-A.y)*dy, Hx=A.x+t*dx, Hy=A.y+t*dy; return {x:2*Hx-P.x, y:2*Hy-P.y}; }
function tfPos(d){
  const P=byId(d.P);
  if(d.t==="tr"){ const A=byId(d.A), B=byId(d.B); return {x:P.x+B.x-A.x, y:P.y+B.y-A.y}; }
  if(d.t==="sax"){ const l=lin(byId(d.l)); return reflect(P, l, l.dx, l.dy); }
  if(d.t==="rot") return rotP(P, byId(d.O), d.deg);
  if(d.t==="hom"){ const O=byId(d.O); return {x:O.x+d.k*(P.x-O.x), y:O.y+d.k*(P.y-O.y)}; }
}
function tfPt(p, tf){ const def=Object.assign({}, tf, {P:p.id}), q=tfPos(def); const ex=pts().find(z=>T.eq(z,q)); if(ex) return ex;
  return add({k:"pt", x:q.x, y:q.y, name:nextName(p.name+"'"), def}); }
/* objet à transformer : un point si on clique bien dessus, sinon un côté (et son polygone), sinon le polygone dans lequel on clique */
function inPoly(pg, p){ const ps=pg.pts.map(pt); if(ps.some(z=>!z)) return false; let c=false; for(let i=0,j=ps.length-1;i<ps.length;j=i++){ const a=ps[i], b=ps[j]; if((a.y>p.y)!==(b.y>p.y) && p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x) c=!c; } return c; }
function pickObj(p){
  const q=pickPoint(p); if(q && d2(q,p)<tol()*0.55) return q;
  const s=pickCurve(p,["seg"]); if(s && !s.vec) return polyOf(s)||s;
  const pg=OB.filter(o=>o.k==="poly" && inPoly(o,p)).pop(); return pg || q || null;
}
function applyTf(o, tf){
  if(o.k==="pt") return tfPt(o, tf);
  if(o.k==="seg"){ const a=tfPt(pt(o.a),tf), b=tfPt(pt(o.b),tf); if(!T.seg(a,b)) add({k:"seg", a:a.id, b:b.id}); return; }
  if(o.k==="poly"){ const ps=o.pts.map(id=>tfPt(pt(id),tf)), pg=add({k:"poly", pts:ps.map(z=>z.id)}); ps.forEach((z,j)=>add({k:"seg", a:z.id, b:ps[(j+1)%ps.length].id, poly:pg.id})); }
}
Object.assign(T, {
  tr:(p,a,b)=>({x:p.x+b.x-a.x, y:p.y+b.y-a.y}),
  rot:(p,o,deg)=>rotP(p,o,deg),
  hom:(p,o,k)=>({x:o.x+k*(p.x-o.x), y:o.y+k*(p.y-o.y)}),
  sax:(p,a,b)=>{ const l=d2(a,b); return reflect(p, a, (b.x-a.x)/l, (b.y-a.y)/l); },
  nbMes:()=>OB.filter(o=>o.k==="mes").length
});
/* l'image d'une figure (sommets nommés) est-elle construite ? On renomme les sommets A', B'… */
function imgFig(names, f, ferme){
  const s=names.map(n=>T.trouve(p=>T.eq(p,f(T.P(n)))));
  if(s.some(x=>!x)) return `Il manque ${s.filter(x=>!x).length>1?"des sommets":"un sommet"} de l'image : ${names.filter((n,i)=>!s[i]).map(n=>n+"'").join(", ")}.`;
  const n=names.length; for(let i=0;i<(ferme?n:n-1);i++) if(!T.seg(s[i],s[(i+1)%n])) return "Les sommets de l'image sont placés : il manque des côtés.";
  s.forEach((p,i)=>{ const nm=names[i]+"'"; if(p.name===nm) return; const o=OB.find(q=>q.k==="pt"&&q.name===nm&&q!==p&&!q.given); if(o) o.name=nextName(); p.name=nm; });
  return true;
}
const BT = ["move","pt","seg","line","ray","inter","mid","poly"];
const V2 = (A,L,deg) => [A[0]+L*Math.cos(deg*Math.PI/180), A[1]-L*Math.sin(deg*Math.PI/180)];
const vecU = () => { const A=T.P("A"), B=T.P("B"); return p=>T.tr(p,A,B); };
const VEC = (a,b) => Object.assign(S(a,b), {vec:true});
/* Thalès : configurations calculées exactement */
const TA=[2,9], TB=V2(TA,5,14), TC=V2(TA,6,62), TM=[TA[0]+0.6*(TB[0]-TA[0]), TA[1]+0.6*(TB[1]-TA[1])], TN=[TA[0]+0.6*(TC[0]-TA[0]), TA[1]+0.6*(TC[1]-TA[1])];
const PA=[7,5], PB=V2(PA,6,160), PC=V2(PA,4.5,215), PM=[PA[0]+(2/3)*(PA[0]-PB[0]), PA[1]+(2/3)*(PA[1]-PB[1])], PN=[PA[0]+(2/3)*(PA[0]-PC[0]), PA[1]+(2/3)*(PA[1]-PC[1])];
const RA=[2,9], RB=V2(RA,5,10), RC=V2(RA,6,58), RM=V2(RA,3,10), RN=V2(RA,3.5,58);
const lit = s => { const t=String(s).replace(/\s+/g,"").replace(/,/g,".").replace(/cm$/,""); const m=/^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/.exec(t); return m ? +m[1]/+m[2] : (/^-?\d+(?:\.\d+)?$/.test(t) ? +t : NaN); };
const q01 = v => s => Math.abs(lit(s)-v)<1e-9;
const KO = {ko:"Ce n'est pas la bonne valeur : refais le calcul (et écris les nombres décimaux avec une virgule).", vide:"Fais le calcul, puis écris le résultat dans la case."};
const L4G = [
 {groupe:"Translation", titre:"Image d'un point", outils:[...B5,"trans"], guide:true, noms:["M'"],
  donnees:[G("A",2,8), G("B",6.5,6), VEC("A","B"), G("M",7,8.6)],
  consigne:"Construis le point M', image du point M par la translation qui transforme A en B.",
  etapes:[
    {t:"Choisis l'outil <b>Translation</b>.", ok:U=>U.tool==="trans"||!!T.trouve(p=>T.eq(p,vecU()(T.P("M")))), tool:"trans"},
    {t:"Clique sur le point <b>M</b> : c'est lui qu'on transforme.", ok:U=>U.pend.includes("M")||!!T.trouve(p=>T.eq(p,vecU()(T.P("M")))), pts:["M"]},
    {t:"Clique sur la flèche (ou sur A, puis sur B).", ok:()=>!!T.trouve(p=>T.eq(p,vecU()(T.P("M")))), pts:["A","B"]}
  ],
  check:()=>{ const m=T.trouve(p=>T.eq(p,vecU()(T.P("M")))); return m ? {nom:[m,"M'"]} : "Outil Translation : clique sur M, puis sur la flèche."; },
  bravo:"M' est l'image de M : on « glisse » M dans la direction de la flèche, du même sens et de la même longueur que de A à B. ABM'M est un parallélogramme."},
 {groupe:"Translation", titre:"Image d'un segment", outils:[...B5,"trans"],
  donnees:[G("A",2,3), G("B",7,1.5), VEC("A","B"), G("C",3,8.5), G("D",6.5,6), S("C","D")],
  consigne:"Construis le segment [C'D'], image du segment [CD] par la translation qui transforme A en B.",
  check:()=>imgFig(["C","D"], vecU()),
  aide:"Outil Translation : clique sur le segment [CD], puis sur la flèche.",
  bravo:"[C'D'] est l'image de [CD] par la translation qui transforme A en B."},
 {groupe:"Translation", titre:"Image d'un triangle", outils:[...B5,"trans","poly"],
  donnees:[G("A",1,9), G("B",6,7.5), VEC("A","B"), G("E",2,5.5), G("F",5,6.5), G("G",3.5,3), PG(["E","F","G"])],
  consigne:"Construis le triangle E'F'G', image du triangle EFG par la translation qui transforme A en B.",
  check:()=>imgFig(["E","F","G"], vecU(), true),
  aide:"Outil Translation : clique sur un côté du triangle (tout le triangle est choisi), puis sur la flèche.",
  bravo:"Le triangle a glissé sans tourner ni changer de taille : E'F'G' est superposable à EFG."},
 {groupe:"Translation", titre:"Sans l'outil Translation", outils:[...BT,"par","circp","dist","trans"], sans:["trans"], noms:["M'"],
  donnees:[G("A",2,7), G("B",7,8.5), VEC("A","B"), G("M",4,3.5)],
  consigne:"Sans l'outil Translation, construis M', l'image de M par la translation qui transforme A en B.",
  check:()=>{ const m=T.trouve(p=>T.eq(p,vecU()(T.P("M")))); return m ? {nom:[m,"M'"]} : "ABM'M doit être un parallélogramme : (MM') // (AB) et (BM') // (AM)."; },
  aide:"ABM'M est un parallélogramme. Trace la parallèle à (AB) passant par M, et la parallèle à (AM) passant par B (trace d'abord la droite (AM)). M' est leur point d'intersection.",
  voir:"1. Droite (AM). — 2. Parallèle à (AB) passant par M. — 3. Parallèle à (AM) passant par B. — 4. Intersection des deux parallèles : c'est M'.",
  bravo:"(MM') // (AB) et (BM') // (AM) : ABM'M est un parallélogramme, donc M' est bien l'image de M."},
 {groupe:"Translation", titre:"Ce que conserve la translation", outils:[...BT,"par","circp","dist","angm","trans"],
  donnees:[G("A",1,8.5), G("B",6,7.2), VEC("A","B"), G("C",2,4), G("D",5.5,1.8), S("C","D")],
  consigne:"Construis [C'D'], l'image de [CD] par la translation qui transforme A en B. Mesure CD et C'D', puis déplace C ou D.",
  q:{lab:"Que remarques-tu ?", choix:["CD = C'D' et (CD) // (C'D')","C'D' = 2 × CD","(CD) et (C'D') sont perpendiculaires"], ok:s=>s.startsWith("CD = C'D'")},
  check:()=>{ const r=imgFig(["C","D"], vecU()); if(r!==true) return r; return T.nbMes()>=2 || "Mesure CD et C'D' avec l'outil Distance ou longueur."; },
  aide:"Outil Translation : [CD], puis la flèche. Puis outil Distance ou longueur : clique sur [CD] et sur [C'D'].",
  bravo:"La translation conserve les longueurs : CD = C'D'. Elle conserve aussi la direction des droites : (CD) // (C'D')."},
 {groupe:"Translation", titre:"La frise", outils:[...BT,"par","circp","dist","angm","trans"],
  donnees:[G("A",1,3.2), G("B",4,3.2), VEC("A","B"), G("K",1,8.5), G("L",2,6), G("M",3,8.5), G("N",2,7.5), PG(["K","L","M","N"])],
  consigne:"Comme dans le TP de M. Staal, construis une frise : l'image du motif KLMN par la translation qui transforme A en B, puis l'image de cette image… 3 fois de suite.",
  check:()=>{ const A=T.P("A"), B=T.P("B"); for(let k=1;k<=3;k++){ const f=p=>({x:p.x+k*(B.x-A.x), y:p.y+k*(B.y-A.y)}); const s=["K","L","M","N"].map(n=>T.trouve(p=>T.eq(p,f(T.P(n)))));
      if(s.some(x=>!x)) return k===1 ? "Outil Translation : clique sur le motif, puis sur la flèche." : `Il manque le motif n°${k+1} : applique la translation au dernier motif construit.`;
      for(let i=0;i<4;i++) if(!T.seg(s[i],s[(i+1)%4])) return `Le motif n°${k+1} n'a pas tous ses côtés.`; } return true; },
  aide:"Translation : clique sur le motif, puis sur la flèche. Recommence en cliquant sur le nouveau motif, puis encore une fois.",
  bravo:"Chaque motif est l'image du précédent par la même translation : c'est ainsi qu'on fabrique une frise. Le motif n°4 est l'image du motif de départ par une translation 3 fois plus longue."},
 {groupe:"Pythagore", titre:"Calculer l'hypoténuse", outils:[...B5,"dist","angm"], sans:["dist"],
  donnees:[G("A",2,9), G("B",8,9), G("C",2,1), PG(["A","B","C"])],
  consigne:"Le triangle ABC est rectangle en A, avec AB = 6 cm et AC = 8 cm. Calcule la longueur BC.",
  q:Object.assign({lab:"BC = ", unite:"cm", ok:q01(10)}, KO),
  check:()=>true,
  aide:"Dans un triangle rectangle, le carré de l'hypoténuse est égal à la somme des carrés des deux autres côtés : BC² = AB² + AC² = 6² + 8² = 36 + 64 = …. Puis BC = √….",
  bravo:"BC² = 36 + 64 = 100, donc BC = √100 = 10 cm."},
 {groupe:"Pythagore", titre:"Construire un triangle rectangle", outils:[...B5,"inter","perp","circr","dist","angm","poly"], noms:["C"],
  donnees:[G("A",3,8.5), G("B",7.5,8.5), S("A","B")],
  consigne:"Construis le triangle ABC rectangle en A tel que AC = 6 cm (AB = 4,5 cm). Calcule BC, puis vérifie avec l'outil Distance ou longueur.",
  q:Object.assign({lab:"BC = ", unite:"cm", ok:q01(7.5)}, KO),
  check:()=>{ const A=T.P("A"), B=T.P("B"); const c=T.trouve(p=>T.near(d2(p,A),6) && Math.abs((p.x-A.x)*(B.x-A.x)+(p.y-A.y)*(B.y-A.y))<1e-6);
    if(!c) return "C est sur la perpendiculaire à (AB) passant par A, à 6 cm de A."; return T.seg(A,c)&&T.seg(B,c) ? {nom:[c,"C"]} : "C est bien placé : trace les côtés [AC] et [BC]."; },
  aide:"Perpendiculaire : A et le segment [AB]. Cercle (centre-rayon) : centre A, rayon 6. C est un point d'intersection. Puis BC² = 4,5² + 6² = 20,25 + 36 = 56,25.",
  voir:"1. Perpendiculaire à [AB] passant par A. — 2. Cercle (centre-rayon) : A, rayon 6. — 3. Intersection : la perpendiculaire et le cercle, c'est C. — 4. Segments [AC] et [BC].",
  bravo:"BC² = 4,5² + 6² = 56,25 et √56,25 = 7,5 : BC = 7,5 cm, comme le confirme l'outil Distance."},
 {groupe:"Pythagore", titre:"Un côté de l'angle droit", outils:[...B5,"dist","angm"], sans:["dist"],
  donnees:[G("E",3,8), G("D",3,3.5), G("F",9,8), PG(["D","E","F"])],
  consigne:"Le triangle DEF est rectangle en E, avec DF = 7,5 cm et DE = 4,5 cm. Calcule EF.",
  q:Object.assign({lab:"EF = ", unite:"cm", ok:q01(6)}, KO),
  check:()=>true,
  aide:"L'hypoténuse est [DF] (en face de l'angle droit). DF² = DE² + EF², donc EF² = DF² − DE² = 56,25 − 20,25 = ….",
  bravo:"EF² = 7,5² − 4,5² = 36, donc EF = 6 cm."},
 {groupe:"Pythagore", titre:"Arrondir au dixième", outils:[...B5,"dist","angm"], sans:["dist"],
  donnees:[G("S",3,8.5), G("R",3,4.5), G("T",10,8.5), PG(["R","S","T"])],
  consigne:"Le triangle RST est rectangle en S, avec RS = 4 cm et ST = 7 cm. Calcule RT, arrondi au dixième.",
  q:Object.assign({lab:"RT ≈ ", unite:"cm", ok:s=>q01(8.1)(s)||q01(8.06)(s)}, KO),
  check:()=>true,
  aide:"RT² = RS² + ST² = 16 + 49 = 65. RT = √65 : utilise la touche √ de la calculatrice, puis arrondis au dixième.",
  bravo:"RT = √65 ≈ 8,06, donc RT ≈ 8,1 cm au dixième près."},
 {groupe:"Pythagore", titre:"Est-il rectangle ?", outils:[...B5,"dist","angm"],
  donnees:[G("U",3,8.5), G("V",10.5,8.5), G("W",5.7,4.9), PG(["U","V","W"])],
  consigne:"Mesure les trois côtés du triangle UVW. Est-il rectangle ? Utilise la réciproque du théorème de Pythagore.",
  q:{lab:"Le triangle UVW est-il rectangle ?", choix:["Oui, il est rectangle en W","Non, il n'est pas rectangle"], ok:s=>s.startsWith("Oui")},
  check:()=> T.nbMes()>=3 || "Mesure d'abord les trois côtés avec l'outil Distance ou longueur.",
  aide:"Le plus grand côté est [UV]. Compare UV² avec UW² + VW². S'ils sont égaux, le triangle est rectangle (en face du plus grand côté).",
  bravo:"UV² = 7,5² = 56,25 et UW² + VW² = 4,5² + 6² = 20,25 + 36 = 56,25. L'égalité est vraie : d'après la réciproque du théorème de Pythagore, UVW est rectangle en W."},
 {groupe:"Pythagore", defi:true, titre:"Défi : rectangle ou pas ?", outils:[...B5,"dist","angm"],
  donnees:[G("U",3,8.5), G("V",11,8.5), G("W",3+53/16,8.5-Math.sqrt(25-(53/16)**2)), PG(["U","V","W"])],
  consigne:"Ce triangle UVW a l'air rectangle en W… Mesure ses côtés et vérifie !",
  q:{lab:"Le triangle UVW est-il rectangle ?", choix:["Oui, il est rectangle en W","Non, il n'est pas rectangle"], ok:s=>s.startsWith("Non")},
  check:()=> T.nbMes()>=3 || "Mesure d'abord les trois côtés avec l'outil Distance ou longueur.",
  aide:"Compare UV² (le plus grand côté) avec UW² + VW². Tu peux aussi mesurer l'angle en W avec l'outil Angle.",
  bravo:`UV² = 8² = 64 mais UW² + VW² = 5² + 6² = 25 + 36 = 61. 64 ≠ 61 : le triangle n'est pas rectangle. L'outil Angle donne d'ailleurs ${ANG("UWV")} ≈ 92,9°, et pas 90° : il ne faut jamais se fier à son œil !`}
];
const L3G = [
 {groupe:"Transformations", titre:"Symétrie axiale", outils:[...B5,"symax","poly"], guide:true,
  donnees:[D("(d)",8,0.3,9,9.7), G("A",3,7), G("B",6,8.5), G("C",5,4), PG(["A","B","C"])],
  consigne:"Construis le triangle A'B'C', symétrique du triangle ABC par rapport à la droite (d).",
  etapes:[
    {t:"Choisis l'outil <b>Symétrie axiale</b>.", ok:U=>U.tool==="symax"||imgDone(), tool:"symax"},
    {t:"Clique sur un côté du triangle ABC.", ok:U=>U.pend.length>0||imgDone()},
    {t:"Clique sur la droite <b>(d)</b> : c'est l'axe de symétrie.", ok:()=>imgDone()}
  ],
  check:()=>{ const L=T.dLine("(d)"), [a,b]=lineAB(L); return imgFig(["A","B","C"], p=>T.sax(p,a,b), true); },
  bravo:"La droite (d) est la médiatrice de [AA'], de [BB'] et de [CC']. Le triangle a été « retourné » : il est superposable à ABC."},
 {groupe:"Transformations", titre:"Rotation d'un point", outils:[...B5,"rot"], guide:true, noms:["A'"],
  donnees:[G("O",8,5.5), G("A",11,5.5)],
  consigne:"Construis le point A', image de A par la rotation de centre O et d'angle 90°, dans le sens inverse des aiguilles d'une montre.",
  etapes:[
    {t:"Choisis l'outil <b>Rotation</b>.", ok:U=>U.tool==="rot"||!!rot90(), tool:"rot"},
    {t:"Clique sur le point <b>A</b> (le point à transformer).", ok:U=>U.pend.includes("A")||!!rot90(), pts:["A"]},
    {t:"Clique sur le centre <b>O</b>.", ok:U=>U.pend.includes("O")||!!rot90(), pts:["O"]},
    {t:"Écris <b>90</b>, choisis le sens <b>inverse des aiguilles d'une montre</b>, puis valide.", ok:()=>!!rot90()}
  ],
  check:()=>{ const a=rot90(); return a ? {nom:[a,"A'"]} : "Outil Rotation : clique sur A, puis sur O, puis écris 90 (sens inverse des aiguilles d'une montre)."; },
  bravo:`OA = OA' et ${ANG("AOA'")} = 90° : A a « tourné » d'un quart de tour autour de O.`},
 {groupe:"Transformations", titre:"Rotation d'un triangle", outils:[...B5,"rot","poly","angm","dist"],
  donnees:[G("O",8,5), G("A",9,3), G("B",12,4), G("C",10.5,1.5), PG(["A","B","C"])],
  consigne:"Construis l'image du triangle ABC par la rotation de centre O, d'angle 60°, dans le <b>sens des aiguilles d'une montre</b>.",
  check:()=>imgFig(["A","B","C"], p=>T.rot(p,T.P("O"),-60), true),
  aide:"Outil Rotation : clique sur un côté du triangle, puis sur O ; écris 60 et choisis « sens des aiguilles d'une montre ».",
  bravo:"La rotation conserve les longueurs et les angles : A'B'C' est superposable à ABC."},
 {groupe:"Transformations", titre:"Homothétie de rapport 2", outils:[...B5,"rot","poly","angm","dist","hom"],
  donnees:[G("O",1.5,9), G("A",3,8), G("B",5.5,8.5), G("C",3.5,6), PG(["A","B","C"])],
  consigne:"Construis l'image du triangle ABC par l'homothétie de centre O et de rapport 2.",
  check:()=>imgFig(["A","B","C"], p=>T.hom(p,T.P("O"),2), true),
  aide:"Outil Homothétie : clique sur un côté du triangle, puis sur le centre O, puis écris 2.",
  bravo:"OA' = 2 × OA : le triangle A'B'C' est un agrandissement de ABC. Ses longueurs sont multipliées par 2 (et son aire par 4)."},
 {groupe:"Transformations", titre:"Un rapport négatif", outils:[...B5,"rot","poly","angm","dist","hom"],
  donnees:[G("O",8,5), G("A",10,6), G("B",13,7), G("C",11,3), PG(["A","B","C"])],
  consigne:"Construis l'image du triangle ABC par l'homothétie de centre O et de rapport −0,5.",
  check:()=>imgFig(["A","B","C"], p=>T.hom(p,T.P("O"),-0.5), true),
  aide:"Outil Homothétie : le triangle, puis O, puis écris −0,5 (avec le signe moins).",
  bravo:"Avec un rapport négatif, l'image est « de l'autre côté » du centre O. Ici, c'est une réduction : les longueurs sont multipliées par 0,5."},
 {groupe:"Transformations", titre:"Quelle transformation ?", outils:[...B5,"rot","poly","angm","dist","hom","symax","trans"],
  donnees:[G("O",8,5), G("A",9,4), G("B",12,4), G("C",12,2), PG(["A","B","C"]), G("A'",7,4), G("B'",7,1), G("C'",5,1), PG(["A'","B'","C'"])],
  consigne:"Le triangle A'B'C' est l'image du triangle ABC. Par quelle transformation ? Mesure des longueurs et des angles pour le savoir.",
  q:{lab:"Ma réponse :", choix:["Une symétrie axiale","Une translation","Une rotation de centre O","Une homothétie de centre O"], ok:s=>s==="Une rotation de centre O"},
  check:()=>true,
  aide:`Compare OA et OA' (outil Distance), et mesure l'angle ${ANG("AOA'")} (outil Angle : A, puis O, puis A').`,
  bravo:`OA = OA', OB = OB' et ${ANG("AOA'")} = ${ANG("BOB'")} = 90° : c'est la rotation de centre O et d'angle 90° (sens inverse des aiguilles d'une montre).`},
 {groupe:"Thalès", titre:"La configuration de Thalès", outils:[...B5,"inter","par","dist"], noms:["N"],
  donnees:[G("A",2,8.5), G("B",12,8.5), G("C",5,1.5), PG(["A","B","C"]), {k:"pt",name:"M",x:6,y:8.5,given:true}],
  consigne:"Trace la parallèle à (BC) passant par M. Elle coupe [AC] en N : place N. Puis mesure AN et AC.",
  q:Object.assign({lab:"AN ÷ AC = ", ok:q01(0.4)}, KO),
  check:()=>{ const A=T.P("A"),B=T.P("B"),C=T.P("C"),M=T.P("M"); if(!T.para(M,B,C)) return "Outil Parallèle : clique sur M, puis sur le côté [BC].";
    const n=T.trouve(p=>T.eq(p,{x:A.x+0.4*(C.x-A.x), y:A.y+0.4*(C.y-A.y)})); return n ? {nom:[n,"N"]} : "Outil Intersection : la parallèle et le côté [AC]."; },
  aide:"Outil Parallèle : M puis [BC]. Outil Intersection : la parallèle et [AC]. Outil Distance : [AN] (clique sur A puis N) et [AC]. AM = 4 cm et AB = 10 cm.",
  bravo:"AN ÷ AC = 0,4 = AM ÷ AB. Quand (MN) // (BC) : AM/AB = AN/AC = MN/BC. C'est le théorème de Thalès."},
 {groupe:"Thalès", titre:"Calculer avec Thalès", outils:[...B5,"inter","par","dist"], sans:["dist"],
  donnees:[G("A",...TA), G("B",...TB), G("C",...TC), G("M",...TM), G("N",...TN), S("A","B"), S("A","C"), S("B","C"), S("M","N")],
  consigne:"M ∈ [AB], N ∈ [AC] et (MN) // (BC). On sait que AM = 3 cm, AB = 5 cm et AC = 6 cm. Calcule AN.",
  q:Object.assign({lab:"AN = ", unite:"cm", ok:q01(3.6)}, KO),
  check:()=>true,
  aide:"D'après le théorème de Thalès : AM/AB = AN/AC, donc 3/5 = AN/6. Produit en croix : AN = 3 × 6 ÷ 5.",
  bravo:"AN = 3 × 6 ÷ 5 = 3,6 cm."},
 {groupe:"Thalès", titre:"Thalès en papillon", outils:[...B5,"inter","par","dist"], sans:["dist"],
  donnees:[G("A",...PA), G("B",...PB), G("C",...PC), G("M",...PM), G("N",...PN), S("B","M"), S("C","N"), S("B","C"), S("M","N")],
  consigne:"Les droites (BM) et (CN) se coupent en A, et (MN) // (BC). AB = 6 cm, AC = 4,5 cm et AM = 4 cm. Calcule AN.",
  q:Object.assign({lab:"AN = ", unite:"cm", ok:q01(3)}, KO),
  check:()=>true,
  aide:"C'est encore une configuration de Thalès, « en papillon » : AM/AB = AN/AC, donc 4/6 = AN/4,5.",
  bravo:"AN = 4 × 4,5 ÷ 6 = 3 cm."},
 {groupe:"Thalès", titre:"Parallèles ou pas ?", outils:[...B5,"inter","par","dist","angm"],
  donnees:[G("A",...RA), G("B",...RB), G("C",...RC), G("M",...RM), G("N",...RN), S("A","B"), S("A","C"), S("B","C"), S("M","N")],
  consigne:"M ∈ [AB] et N ∈ [AC]. Mesure AM, AB, AN et AC. Les droites (MN) et (BC) sont-elles parallèles ?",
  q:{lab:"Ma réponse :", choix:["Oui, (MN) // (BC)","Non, (MN) et (BC) ne sont pas parallèles"], ok:s=>s.startsWith("Non")},
  check:()=> T.nbMes()>=4 || "Mesure d'abord AM, AB, AN et AC avec l'outil Distance ou longueur.",
  aide:"Calcule AM ÷ AB et AN ÷ AC. S'ils sont égaux, alors (MN) // (BC) (réciproque du théorème de Thalès).",
  bravo:"AM ÷ AB = 3 ÷ 5 = 0,6 mais AN ÷ AC = 3,5 ÷ 6 ≈ 0,583. Les quotients sont différents : (MN) et (BC) ne sont pas parallèles, même si elles en ont l'air !"},
 {groupe:"Défis", defi:true, titre:"Défi : deux quarts de tour", outils:[...B5,"inter","par","dist","angm","rot","sym"], noms:["A'","A''"],
  donnees:[G("O",8,5), G("A",11,3)],
  consigne:"Construis A', image de A par la rotation de centre O d'angle 90°, puis A'', image de A' par la même rotation.",
  q:{lab:"Par quelle transformation passe-t-on directement de A à A'' ?", choix:["La symétrie de centre O","La symétrie d'axe (OA)","Une translation"], ok:s=>s==="La symétrie de centre O"},
  check:()=>{ const s=T.trouve(p=>T.eq(p,T.sym(T.P("A"),T.P("O")))); return s ? {nom:[s,"A''"]} : "Applique deux fois la rotation de centre O et d'angle 90° (dans le même sens) : à A, puis à A'."; },
  aide:"Outil Rotation : A, puis O, 90°. Puis outil Rotation : A', puis O, 90° (même sens).",
  bravo:"Deux quarts de tour font un demi-tour : A'' est le symétrique de A par rapport à O. La rotation d'angle 180° est la symétrie centrale."}
];
function imgDone(){ const L=T.dLine("(d)"); if(!L) return false; const [a,b]=lineAB(L); return ["A","B","C"].every(n=>T.trouve(p=>T.eq(p,T.sax(T.P(n),a,b)))); }
function rot90(){ const A=T.P("A"), O=T.P("O"); return A&&O ? T.trouve(p=>T.eq(p,T.rot(A,O,90))) : null; }

/* ================= interface ================= */
const PACKS = {
  "6e":{key:"staal-geo6-", levels:L6, tools:TOOLS, locks:true},
  "5e":{key:"staal-geo5-", levels:L5, tools:TOOLS5, locks:false, dyn:true},
  "4e":{key:"staal-geo4-", levels:L4G, tools:TOOLS34, locks:false, dyn:true},
  "3e":{key:"staal-geo3-", levels:L3G, tools:TOOLS34, locks:false, dyn:true}
};
let P=null, LV=null, R0=null, cur=0, tool=null, pend=[], wait=null, hover=null, mouse=null, done=[], drag=null;
const store = { get(k){ try{ return localStorage.getItem(P.key+k); }catch(e){ return null; } }, set(k,v){ try{ localStorage.setItem(P.key+k,v); }catch(e){} } };
let PK="6e";
/* séance : SUB = numéros (dans LV) des niveaux de la séance, dans l'ordre ; OPT = options données par la page (niv, onChange, onFin, fin) */
let SUB=[], OPT={};
const numero = i => SUB.indexOf(i)+1;
const $ = id => R0.querySelector("#"+id);
const SCN = () => ({tool, pend:pend.map(id=>(pt(id)||{}).name)});

function init(root, pack, opts){
  PK=pack||"6e"; P=PACKS[PK]; LV=P.levels; R0=root; OPT=opts||{};
  SUB=(OPT.niv||LV.map((_,i)=>i)).filter(i=>i>=0 && i<LV.length);
  try{ done=JSON.parse(store.get("done")||"[]"); }catch(e){ done=[]; }
  root.innerHTML = `<div class="geo">
    <div class="glevels" id="glevels"></div>
    <div class="ggrid">
      <div class="gmain">
        <div class="gtools" id="gtools" role="toolbar" aria-label="Outils"></div>
        <div class="gstatus" id="gstatus"></div>
        <div class="gboard"><svg id="gsvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Feuille de construction"></svg></div>
        <div class="gbar"><button class="btn" id="greset">Recommencer le niveau</button></div>
      </div>
      <aside class="gside">
        <h2 id="gtitre"></h2><p id="gcons" class="gcons"></p>
        <ol class="getapes" id="getapes"></ol>
        <div id="gq"></div>
        <button class="btn primary" id="gcheck">Vérifier ma figure</button>
        <div class="lmsg" id="gmsg" hidden></div>
        <details class="lhelp" id="ghelp"><summary>Besoin d'aide ?</summary><p id="gaide"></p><div id="gvoir"></div></details>
      </aside>
    </div></div>`;
  const svg=$("gsvg");
  svg.addEventListener("pointerdown", e=>{ e.preventDefault(); const p=world(e);
    if(tool==="move"){ const q=pickPoint(p); if(q && movable(q)){ snapshot(); drag={q}; svg.setPointerCapture(e.pointerId); } return; }
    click(p); });
  svg.addEventListener("pointermove", e=>{ mouse=world(e);
    if(drag){ const q=drag.q, d=q.def;
      if(d && d.t==="on"){ const c=byId(d.o); d.s=param(c, proj(c,mouse)); }
      else { q.x=Math.max(0.2,Math.min(W-0.2,mouse.x)); q.y=Math.max(0.2,Math.min(H-0.2,mouse.y)); }
      recompute(); MOVED=true; }
    hover=pickAt(mouse); draw(); });
  svg.addEventListener("pointerup", ()=>{ if(drag){ drag=null; draw(); after(); } });
  svg.addEventListener("pointerleave", ()=>{ if(!drag){ mouse=null; hover=null; draw(); } });
  $("greset").onclick=()=>load(cur);
  $("gcheck").onclick=()=>verifier(true);
  let st=+(store.get("niveau")||0); if(!SUB.includes(st)){ st=SUB.find(i=>!done.includes(i)); if(st===undefined) st=SUB[0]; }
  load(st);
  requestAnimationFrame(()=>{ const t=document.getElementById("sbar")||$("glevels"); if(t && t.getBoundingClientRect().top>80) window.scrollTo({top: window.scrollY + t.getBoundingClientRect().top - 8}); });
}
function annuler(){ if(UNDO.length){ const s=JSON.parse(UNDO.pop()); OB=s.OB; NID=s.NID; pend=[]; wait=null; status(); draw(); after(); } }
function world(e){ const svg=$("gsvg"), p=svg.createSVGPoint(); p.x=e.clientX; p.y=e.clientY; const q=p.matrixTransform(svg.getScreenCTM().inverse()); return {x:q.x, y:q.y}; }
const tol = () => { const svg=$("gsvg"); return 14 / (svg.getBoundingClientRect().width / W); };
const movable = q => !/^[a-z]$/.test(q.name) && (!q.def || q.def.t==="free" || q.def.t==="on");

function load(i){
  cur=i; store.set("niveau",i); const L=LV[i];
  OB=[]; NID=1; UNDO=[]; pend=[]; wait=null; MOVED=false; drag=null;
  const id = n => byName(n).id;
  L.donnees.forEach(o=>{ const c=JSON.parse(JSON.stringify(o));
    if(c.k==="seg"||c.k==="ray"){ c.a=id(o.a); c.b=id(o.b); }
    if(c.def) for(const k of ["A","B","C","P","O"]) if(typeof c.def[k]==="string") c.def[k]=id(c.def[k]);
    if(c.k==="poly"){ c.pts=o.names.map(id); delete c.names; const pg=add(c); c.pts.forEach((a,j)=>add({k:"seg", a, b:c.pts[(j+1)%c.pts.length], poly:pg.id, given:true})); return; }
    add(c); });
  recompute();
  tool=null;
  let html="", g=null;
  SUB.forEach((j,k)=>{ const l=LV[j]; if(l.groupe!==g){ g=l.groupe; html+=`<span class="ggroupe">${g}</span>`; }
    html+=`<button class="lnum${j===i?" on":""}${done.includes(j)?" ok":""}${l.defi?" defi":""}" data-i="${j}" aria-label="Niveau ${k+1}${done.includes(j)?" (réussi)":""}">${k+1}</button>`; });
  $("glevels").innerHTML=html;
  R0.querySelectorAll("#glevels .lnum").forEach(b=>b.onclick=()=>load(+b.dataset.i));
  /* outils : tous ceux déjà rencontrés, sauf ceux interdits dans ce niveau */
  const all=Object.keys(P.tools), dispo=new Set(); LV.slice(0,i+1).forEach(l=>l.outils.forEach(t=>dispo.add(t))); (L.sans||[]).forEach(t=>dispo.delete(t)); if(dispo.size>1) dispo.add("gom");
  $("gtools").innerHTML = all.filter(k=>P.locks || dispo.has(k) || (L.sans||[]).includes(k)).map(k=>{ const on=dispo.has(k), interdit=(L.sans||[]).includes(k);
    return `<button class="gtool${on?"":" lock"}" data-t="${k}" ${on?"":"disabled"} title="${P.tools[k].nom}${on?"":interdit?" (interdit dans ce défi)":" (bientôt débloqué)"}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg><span>${P.tools[k].nom}</span>${on?"":`<i aria-hidden="true">${interdit?"⛔":"🔒"}</i>`}</button>`; }).join("")
    + `<button class="gtool gundo" id="gundo" title="Annuler la dernière action"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5 4 10l5 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.5 10H14a5 5 0 0 1 0 10h-3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg><span>Annuler</span></button>`;
  $("gundo").onclick=annuler;
  R0.querySelectorAll(".gtool[data-t]:not(.lock)").forEach(b=>b.onclick=()=>{ tool=b.dataset.t; pend=[]; wait=null; status(); draw(); after(); });
  $("gtitre").textContent=`Niveau ${numero(i)}${OPT.niv?" sur "+SUB.length:""} · ${L.titre.replace(/^Défi : /,"Défi · ")}`;
  if(OPT.onChange) OPT.onChange(i, done.slice());
  $("gcons").innerHTML=L.consigne;
  $("gaide").innerHTML=L.aide||"Suis les étapes ci-dessus, dans l'ordre.";
  $("gvoir").innerHTML=L.voir?`<details class="lsolbox"><summary>Toujours bloqué ? Voir une construction possible</summary><p>${L.voir}</p></details>`:"";
  if(L.q && L.q.choix) $("gq").innerHTML=`<p class="gqlab"><b>${L.q.lab}</b></p><div class="gchoix" id="gqsel" data-v="">${L.q.choix.map(c=>`<button class="btn gch" data-c="${c}">${c}</button>`).join("")}</div>`;
  else $("gq").innerHTML = L.q ? `<div class="gqrow"><label for="gqin"><b>${L.q.lab}</b></label><input id="gqin" class="gqin" inputmode="decimal" autocomplete="off"> ${L.q.unite||""}</div>` : "";
  R0.querySelectorAll(".gch").forEach(b=>b.onclick=()=>{ $("gqsel").dataset.v=b.dataset.c; R0.querySelectorAll(".gch").forEach(x=>x.classList.toggle("sel",x===b)); verifier(true); });
  const h=$("ghelp"); if(h) h.open=false;
  msg(""); status(); draw(); after();
}
/* ------------ clics ------------ */
const visPts = () => pts().filter(p=>!p.hid);
function pickPoint(p){ let best=null, bd=tol(); visPts().forEach(q=>{ const d=d2(p,q); if(d<bd){ bd=d; best=q; } }); return best; }
function pickCurve(p, kinds){ let best=null, bd=tol(); curves().filter(o=>!kinds||kinds.includes(o.k)).forEach(o=>{ const d=distTo(o,p); if(d<bd){ bd=d; best=o; } }); return best; }
function pickAt(p){ return pickPoint(p) || pickCurve(p); }
function snapPos(p){
  const near=curves().filter(o=>distTo(o,p)<tol()*2); let best=null, bd=tol(), def=null;
  for(let i=0;i<near.length;i++) for(let j=i+1;j<near.length;j++) inter(near[i],near[j]).forEach(q=>{ const d=d2(p,q); if(d<bd){ bd=d; best=q; def={t:"int", a:near[i].id, b:near[j].id}; } });
  if(best) return {x:best.x, y:best.y, def};
  const c=pickCurve(p); if(c){ const q=proj(c,p); return {x:q.x, y:q.y, def:{t:"on", o:c.id, s:param(c,q)}}; }
  return {x:p.x, y:p.y, def:{t:"free"}};
}
function nextName(pref){
  const L=LV[cur], used=new Set(pts().map(q=>q.name));
  if(pref && !used.has(pref)) return pref;
  for(const n of (L.noms||[])) if(!used.has(n)) return n;
  for(const n of "EFGHIJKLMNPQRSTUVWZ".split("").concat("ABCD".split(""))) if(!used.has(n)) return n;
  return "P"+NID;
}
function getPoint(p){ const q=pickPoint(p); if(q) return q; const s=snapPos(p); if(s.x<0||s.x>W||s.y<0||s.y>H) return null; return add({k:"pt", x:s.x, y:s.y, name:nextName(), def:s.def}); }
function addLine2(a,b){ const l=d2(a,b); return add({k:"line", x:a.x, y:a.y, dx:(b.x-a.x)/l, dy:(b.y-a.y)/l, def:{t:"2p", A:a.id, B:b.id}}); }
function addLineDir(t, ref, q){ const l=lin(ref); const [dx,dy]= t==="perp" ? [-l.dy,l.dx] : [l.dx,l.dy]; return add({k:"line", x:q.x, y:q.y, dx, dy, def:{t, l:ref.id, P:q.id}}); }
function addCirc(C, r, def){ return add({k:"circ", cx:C.x, cy:C.y, r, c:C.id, def}); }
function polyOf(seg){ return seg && seg.poly ? byId(seg.poly) : null; }
function symOf(p, O){ const ex=pts().find(q=>T.eq(q,T.sym(p,O))); if(ex) return ex; return add({k:"pt", x:2*O.x-p.x, y:2*O.y-p.y, name:nextName(p.name+"'"), def:{t:"sym", P:p.id, O:O.id}}); }
function click(p){
  if(!tool){ msg("Choisis d'abord un outil dans la barre du haut.", ""); return; }
  if(wait) return;
  const L=LV[cur];
  if(tool==="pt"){ if(pickPoint(p)) return; snapshot(); getPoint(p); }
  else if(["seg","line","ray"].includes(tool)){
    if(!pend.length) snapshot();
    const q=getPoint(p); if(!q) return; if(pend.length && pend[0]===q.id) return;
    pend.push(q.id);
    if(pend.length===2){ const [a,b]=pend.map(pt); if(tool==="line") addLine2(a,b); else add({k:tool, a:a.id, b:b.id}); pend=[]; }
  }
  else if(tool==="rg"){
    if(!pend.length){ snapshot(); const q=getPoint(p); if(!q) return; pend=[q.id]; }
    else { const A=pt(pend[0]); const q=pickPoint(p); const c=q?null:pickCurve(p,["seg","ray","line"]); const dir=q ? {x:q.x,y:q.y} : (c ? proj(c,p) : p);
      if(d2(dir,A)<1e-9){ return; } const l=d2(A,dir); wait={k:"rg", A, D:q&&q!==A?q.id:null, v:{x:(dir.x-A.x)/l, y:(dir.y-A.y)/l}}; }
  }
  else if(tool==="eq"||tool==="par"&&!P.dyn){
    if(!pend.length){ const c=pickCurve(p,["seg","ray","line"]); if(!c){ msg("Clique d'abord <b>sur une droite</b> (ou un segment) de référence.", ""); return; } snapshot(); pend=[c.id]; }
    else { const q=getPoint(p); if(!q) return; addLineDir(tool==="eq"?"perp":"par", byId(pend[0]), q); pend=[]; }
  }
  else if(tool==="perp"||tool==="par"){   /* 5e : un point et une droite, dans n'importe quel ordre */
    if(!pend.length) snapshot();
    const havePt=pend.map(byId).find(o=>o.k==="pt"), haveL=pend.map(byId).find(o=>o.k!=="pt");
    const q=pickPoint(p), c=q?null:pickCurve(p,["seg","ray","line"]);
    if(!havePt && (q || (!c && haveL))){ const pp=q||getPoint(p); if(!pp) return; pend.push(pp.id); }
    else if(!haveL && c) pend.push(c.id);
    else return;
    const P1=pend.map(byId).find(o=>o.k==="pt"), L1=pend.map(byId).find(o=>o.k!=="pt");
    if(P1&&L1){ addLineDir(tool, L1, P1); pend=[]; }
  }
  else if(tool==="comp"){
    if(!pend.length){ snapshot(); const q=getPoint(p); if(!q) return; pend=[q.id]; }
    else { const C=pt(pend[0]); const q=pickPoint(p);
      if(q && q.id!==C.id){ addCirc(C, d2(C,q), {t:"cp", C:C.id, P:q.id}); pend=[]; hideAsk(); }
      else { const s=pickCurve(p,["seg"]); if(s){ addCirc(C, d2(pt(s.a),pt(s.b)), {t:"cs", C:C.id, s:s.id}); pend=[]; hideAsk(); } } }
  }
  else if(tool==="circp"){
    if(!pend.length) snapshot();
    const q=getPoint(p); if(!q) return; if(pend.length && pend[0]===q.id) return; pend.push(q.id);
    if(pend.length===2){ const [C,Q]=pend.map(pt); addCirc(C, d2(C,Q), {t:"cp", C:C.id, P:Q.id}); pend=[]; }
  }
  else if(tool==="circr"||tool==="seglen"){
    snapshot(); const q=getPoint(p); if(!q) return; pend=[q.id]; wait={k:tool, A:q};
  }
  else if(tool==="angle"){
    if(!pend.length) snapshot();
    const q=getPoint(p); if(!q) return; if(pend.length && pend[0]===q.id) return; pend.push(q.id);
    if(pend.length===2) wait={k:"angle", P:pt(pend[0]), O:pt(pend[1])};
  }
  else if(tool==="angm"){
    const q=pickPoint(p); if(!q) { msg("Clique sur des <b>points</b> : un point d'un côté, le sommet, puis un point de l'autre côté.", ""); return; }
    pend.push(q.id); if(pend.length===3){ snapshot(); add({k:"ang", a:pend[0], o:pend[1], b:pend[2]}); pend=[]; }
  }
  else if(tool==="inter"){
    const c=pickCurve(p); if(!c) return;
    if(!pend.length){ snapshot(); pend=[c.id]; }
    else if(c.id!==pend[0]){ const a=byId(pend[0]); inter(a,c).forEach(q=>{ if(!pts().some(z=>T.eq(z,q))) add({k:"pt", x:q.x, y:q.y, name:nextName(), def:{t:"int", a:a.id, b:c.id}}); }); pend=[]; }
  }
  else if(tool==="mid"||tool==="med"){
    const q=pickPoint(p), s=q?null:pickCurve(p,["seg"]);
    let A=null, B=null;
    if(!pend.length && s){ snapshot(); A=pt(s.a); B=pt(s.b); }
    else { if(!pend.length) snapshot(); const r=q||getPoint(p); if(!r) return; if(pend.length && pend[0]===r.id) return; pend.push(r.id); if(pend.length<2){ status(); draw(); return; } [A,B]=pend.map(pt); }
    if(tool==="mid") add({k:"pt", x:(A.x+B.x)/2, y:(A.y+B.y)/2, name:nextName(), def:{t:"mid", A:A.id, B:B.id}});
    else { const l=d2(A,B); add({k:"line", x:(A.x+B.x)/2, y:(A.y+B.y)/2, dx:-(B.y-A.y)/l, dy:(B.x-A.x)/l, def:{t:"med", A:A.id, B:B.id}}); }
    pend=[];
  }
  else if(tool==="sym"){
    if(!pend.length){ const q=pickPoint(p), s=q?null:pickCurve(p,["seg"]); const o=q||polyOf(s)||s; if(!o){ msg("Clique d'abord sur l'objet à transformer : un point, un segment ou un polygone.", ""); return; } snapshot(); pend=[o.id]; }
    else { const O=getPoint(p); if(!O) return; const o=byId(pend[0]); if(o.id===O.id) return;
      if(o.k==="pt") symOf(o,O);
      else if(o.k==="seg"){ const a=symOf(pt(o.a),O), b=symOf(pt(o.b),O); add({k:"seg", a:a.id, b:b.id}); }
      else if(o.k==="poly"){ const ps=o.pts.map(id=>symOf(pt(id),O)), pg=add({k:"poly", pts:ps.map(z=>z.id)}); ps.forEach((z,j)=>add({k:"seg", a:z.id, b:ps[(j+1)%ps.length].id, poly:pg.id})); }
      pend=[]; }
  }
  else if(["trans","symax","rot","hom"].includes(tool)){
    if(!pend.length){ const o=pickObj(p); if(!o){ msg("Clique d'abord sur l'objet à transformer : un point, un segment ou un polygone (tu peux cliquer à l'intérieur).", ""); return; } snapshot(); pend=[o.id]; }
    else if(tool==="symax"){ const c=pickCurve(p,["seg","line","ray"]); if(!c){ msg("Clique sur l'axe de symétrie : une droite ou un segment.", ""); return; } applyTf(byId(pend[0]), {t:"sax", l:c.id}); pend=[]; }
    else if(tool==="trans"){
      if(pend.length===1){ const q=pickPoint(p), s=q?null:pickCurve(p,["seg"]); if(s && s.vec){ applyTf(byId(pend[0]), {t:"tr", A:s.a, B:s.b}); pend=[]; } else { const A=q||getPoint(p); if(!A) return; pend.push(A.id); } }
      else { const B=getPoint(p); if(!B || B.id===pend[1]) return; applyTf(byId(pend[0]), {t:"tr", A:pend[1], B:B.id}); pend=[]; } }
    else { const O=getPoint(p); if(!O || O.id===pend[0]) return; pend.push(O.id); wait={k:tool, o:byId(pend[0]), O}; }
  }
  else if(tool==="poly"){
    const q=getPoint(p); if(!q) return;
    if(!pend.length) snapshot();
    if(pend.length>=3 && q.id===pend[0]){ const pg=add({k:"poly", pts:pend.slice()}); pend.forEach((a,j)=>add({k:"seg", a, b:pend[(j+1)%pend.length], poly:pg.id})); pend=[]; }
    else if(!pend.includes(q.id)) pend.push(q.id);
  }
  else if(tool==="mes"||tool==="dist"){
    const s=pickCurve(p,["seg"]); const q=pickPoint(p);
    if(q){ pend.push(q.id); if(pend.length===2){ if(pend[0]!==pend[1]){ snapshot(); add({k:"mes", a:pend[0], b:pend[1]}); } pend=[]; } }
    else if(s){ snapshot(); const ex=OB.find(o=>o.k==="mes" && ((o.a===s.a&&o.b===s.b)||(o.a===s.b&&o.b===s.a))); if(ex) OB=OB.filter(o=>o!==ex); else add({k:"mes", a:s.a, b:s.b}); }
  }
  else if(tool==="gom"){
    const q=pickPoint(p), c=q?null:pickCurve(p);
    let o=q||c; if(!o) return; if(c && c.poly && P.dyn) o=byId(c.poly)||o;
    if(o.given){ msg("Les objets de l'énoncé ne peuvent pas être effacés.", ""); return; }
    snapshot();
    if(P.dyn){ const dep=dependants(o.id); if(o.k==="poly") OB.filter(x=>x.poly===o.id).forEach(x=>dependants(x.id).forEach(d=>dep.add(d))); OB=OB.filter(x=>!dep.has(x.id)); }
    else OB=OB.filter(x=>x!==o && !(q && (x.a===q.id||x.b===q.id||x.c===q.id)));
  }
  status(); draw(); after();
}
/* zone de saisie d'un nombre (longueur, rayon, angle) */
function ask(label, unit, cb, extra, neg){
  const st=$("gstatus");
  st.insertAdjacentHTML("beforeend", `<form class="gask" id="gask"><label>${label} <input id="gval" inputmode="decimal" autocomplete="off" size="5"> ${unit}</label>${extra||""}<button class="btn primary" type="submit">Valider</button><button class="btn" type="button" id="gcancel">Annuler</button></form>`);
  const f=$("gask"), inp=$("gval"); setTimeout(()=>inp.focus(),0);
  f.onsubmit=e=>{ e.preventDefault(); const v=parseFloat(inp.value.replace(",","."));
    if(neg ? (!isFinite(v) || v===0 || Math.abs(v)>20) : (!(v>0) || v>360)){ inp.classList.add("bad"); return; }
    if(cb(v)===false) return;
    wait=null; pend=[]; hideAsk(); status(); draw(); after(); };
  $("gcancel").onclick=()=>{ wait=null; pend=[]; hideAsk(); status(); draw(); };
}
function hideAsk(){ const f=$("gask"); if(f) f.remove(); }
function horsFeuille(B){ return B.x<-0.01||B.x>W+0.01||B.y<-0.01||B.y>H+0.01; }
function status(){
  const st=$("gstatus"); if(!st) return; hideAsk();
  if(!tool){ st.innerHTML="<span><b>Choisis un outil</b> dans la barre ci-dessus.</span>"; return; }
  const a=P.tools[tool].aide, step=Array.isArray(a) ? a[Math.min(pend.length + (wait?1:0), a.length-1)] : a;
  st.innerHTML=`<span><b>${P.tools[tool].nom}</b> : ${step}</span>`;
  R0.querySelectorAll(".gtool").forEach(b=>b.classList.toggle("on", b.dataset.t===tool));
  const L=LV[cur];
  if(wait && wait.k==="rg") ask("Longueur :", "cm", v=>{ const {A,v:u}=wait, B={x:A.x+v*u.x, y:A.y+v*u.y};
      if(horsFeuille(B)){ msg("Ce point sortirait de la feuille : choisis une autre direction.", "ko"); return; }
      const q=pts().find(z=>T.eq(z,B)) || add({k:"pt", x:B.x, y:B.y, name:nextName(), def:{t:"len", A:A.id, D:wait.D, v:u, L:v}}); add({k:"seg", a:A.id, b:q.id}); });
  else if(wait && wait.k==="seglen") ask("Longueur :", "cm", v=>{ const A=wait.A, B={x:A.x+v, y:A.y};
      if(horsFeuille(B)){ msg("Ce segment sortirait de la feuille : choisis un point de départ plus à gauche.", "ko"); return; }
      const q=add({k:"pt", x:B.x, y:B.y, name:nextName(), def:{t:"len", A:A.id, D:null, v:{x:1,y:0}, L:v}}); add({k:"seg", a:A.id, b:q.id}); });
  else if(wait && wait.k==="circr") ask("Rayon :", "cm", v=>{ const C=wait.A; addCirc(C, v, {t:"cr", C:C.id, r:v}); });
  else if(wait && wait.k==="angle") ask("Angle :", "°", v=>{ const sens=+($("gsens")||{value:1}).value, Q=rotP(wait.P, wait.O, sens*v);
      add({k:"pt", x:Q.x, y:Q.y, name:nextName(wait.P.name+"'"), def:{t:"rot", P:wait.P.id, O:wait.O.id, deg:sens*v}}); },
      `<select id="gsens" aria-label="Sens"><option value="1">sens inverse des aiguilles d'une montre</option><option value="-1">sens des aiguilles d'une montre</option></select>`);
  else if(wait && wait.k==="rot") ask("Angle :", "°", v=>{ const sens=+($("gsens")||{value:1}).value; applyTf(wait.o, {t:"rot", O:wait.O.id, deg:sens*v}); },
      `<select id="gsens" aria-label="Sens"><option value="1">sens inverse des aiguilles d'une montre</option><option value="-1">sens des aiguilles d'une montre</option></select>`);
  else if(wait && wait.k==="hom") ask("Rapport :", "", v=>{ applyTf(wait.o, {t:"hom", O:wait.O.id, k:v}); }, "", true);
  else if(tool==="comp" && pend.length===1 && !L.compasSansSaisie) ask("Rayon :", "cm", v=>{ const C=pt(pend[0]); addCirc(C, v, {t:"cr", C:C.id, r:v}); });
}
/* ------------ dessin ------------ */
function draw(){
  const svg=$("gsvg"); if(!svg) return; const L=LV[cur];
  let g='<rect width="16" height="10" fill="#fff"/>';
  for(let x=0;x<=W;x++) g+=`<line x1="${x}" y1="0" x2="${x}" y2="${H}" class="ggrid1"/>`;
  for(let y=0;y<=H;y++) g+=`<line x1="0" y1="${y}" x2="${W}" y2="${y}" class="ggrid1"/>`;
  OB.filter(o=>o.k==="poly").forEach(o=>{ const ps=o.pts.map(pt); if(ps.some(z=>!z)) return; g+=`<polygon points="${ps.map(z=>`${z.x},${z.y}`).join(" ")}" class="gpoly${o.given?" given":""}"/>`; });
  const hl = o => hover===o ? " hov" : "";
  curves().forEach(o=>{
    const cls=`gobj${o.given?" given":""}${hl(o)}${pend.includes(o.id)?" sel":""}`;
    if(o.k==="circ") g+=`<circle cx="${o.cx}" cy="${o.cy}" r="${o.r}" class="${cls}" fill="none"/>`;
    else if(o.k==="seg"){ const a=pt(o.a), b=pt(o.b); if(a&&b){ g+=`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="${cls}"/>`;
      if(o.vec){ const l=d2(a,b)||1, ux=(b.x-a.x)/l, uy=(b.y-a.y)/l, h=0.42, w=0.2; g+=`<path d="M${b.x} ${b.y}L${b.x-h*ux-w*uy} ${b.y-h*uy+w*ux}L${b.x-h*ux+w*uy} ${b.y-h*uy-w*ux}Z" fill="${o.given?"#1f1f1f":"#1a5fb4"}"/>`; } } }
    else { const c=clip(lin(o)); if(c){ g+=`<line x1="${c[0].x}" y1="${c[0].y}" x2="${c[1].x}" y2="${c[1].y}" class="${cls}"/>`;
      if(o.name){ const t=c[1]; g+=`<text x="${Math.min(W-0.9,Math.max(0.3,t.x-0.9))}" y="${Math.min(H-0.3,Math.max(0.6,t.y-0.3))}" class="glab">${o.name}</text>`; } } }
  });
  OB.filter(o=>o.k==="mes").forEach(o=>{ const a=pt(o.a), b=pt(o.b); if(!a||!b) return; const mx=(a.x+b.x)/2, my=(a.y+b.y)/2, l=d2(a,b);
    g+=`<g class="gmes"><rect x="${mx-0.95}" y="${my-0.78}" width="1.9" height="0.56" rx="0.12"/><text x="${mx}" y="${my-0.37}" text-anchor="middle">${fr(Math.round(l*10)/10)} cm</text></g>`; });
  OB.filter(o=>o.k==="ang").forEach(o=>{ const a=pt(o.a), c=pt(o.o), b=pt(o.b); if(!a||!b||!c) return; const v=T.angle(a,c,b);
    const u1=Math.atan2(a.y-c.y,a.x-c.x), u2=Math.atan2(b.y-c.y,b.x-c.x); let m=(u1+u2)/2; if(Math.abs(u1-u2)>Math.PI) m+=Math.PI;
    const r=0.7, p1={x:c.x+r*Math.cos(u1), y:c.y+r*Math.sin(u1)}, p2={x:c.x+r*Math.cos(u2), y:c.y+r*Math.sin(u2)}, sw=((u2-u1+2*Math.PI)%(2*Math.PI))<Math.PI?1:0;
    g+=`<path d="M${p1.x} ${p1.y}A${r} ${r} 0 0 ${sw} ${p2.x} ${p2.y}" class="garc"/><g class="gmes"><rect x="${c.x+1.25*Math.cos(m)-0.62}" y="${c.y+1.25*Math.sin(m)-0.3}" width="1.24" height="0.52" rx="0.12"/><text x="${c.x+1.25*Math.cos(m)}" y="${c.y+1.25*Math.sin(m)+0.08}" text-anchor="middle">${fr(Math.round(v*10)/10)}°</text></g>`; });
  if(mouse && tool && pend.length && !wait && !drag){ const a=pt(pend[0]);
    if(a && ["seg","line","ray","rg","poly"].includes(tool)) g+=`<line x1="${(tool==="poly"?pt(pend[pend.length-1]):a).x}" y1="${(tool==="poly"?pt(pend[pend.length-1]):a).y}" x2="${mouse.x}" y2="${mouse.y}" class="gprev"/>`;
    if(a && (tool==="comp"||tool==="circp")) g+=`<circle cx="${a.x}" cy="${a.y}" r="${d2(a,mouse)}" class="gprev" fill="none"/>`; }
  const guide = L.guide ? (L.etapes.find(e=>!e.ok(SCN()))||{}) : {};
  visPts().forEach(p=>{ const s=0.16, cls=`gpt${p.given?" given":""}${hover===p?" hov":""}${pend.includes(p.id)?" sel":""}${P.dyn&&movable(p)&&tool==="move"?" mov":""}`;
    if(guide.pts && guide.pts.includes(p.name) && !SCN().pend.includes(p.name)) g+=`<circle cx="${p.x}" cy="${p.y}" r="0.42" class="gpulse"/>`;
    const lettre=/^[a-z]$/.test(p.name);
    g+=`<g class="${cls}"><circle cx="${p.x}" cy="${p.y}" r="0.32" class="ghit"/>${lettre?"":`<path d="M${p.x-s} ${p.y-s}L${p.x+s} ${p.y+s}M${p.x+s} ${p.y-s}L${p.x-s} ${p.y+s}"/>`}</g><text x="${p.x+(lettre?0.05:0.2)}" y="${p.y-(lettre?0.25:0.22)}" class="glab${p.given?"":" new"}">${p.name}</text>`; });
  if(mouse && tool && !wait && !drag && ["pt","seg","line","ray","rg","comp","circp","circr","seglen","poly","angle"].includes(tool) && !pickPoint(mouse)){
    const s=snapPos(mouse); g+=`<circle cx="${s.x}" cy="${s.y}" r="0.09" class="gsnap"/>`; }
  svg.innerHTML=g;
  svg.classList.toggle("moving", tool==="move");
  if(L.guide) etapes();
}
function etapes(){
  const L=LV[cur], el=$("getapes"); if(!L.guide){ el.innerHTML=""; return; }
  const sc=SCN(); let first=-1;
  el.innerHTML=L.etapes.map((e,i)=>{ const ok=e.ok(sc); if(!ok && first<0) first=i; return `<li class="${ok?"ok":i===first?"now":""}">${e.t}</li>`; }).join("");
  const now=L.etapes[first]; R0.querySelectorAll(".gtool").forEach(b=>b.classList.toggle("pulse", !!now && now.tool===b.dataset.t && tool!==now.tool));
}
function after(){ if(!LV[cur].guide) { $("getapes").innerHTML=""; R0.querySelectorAll(".gtool.pulse").forEach(b=>b.classList.remove("pulse")); } verifier(false); }
function verifier(manuel){
  const L=LV[cur]; let r=L.check();
  if(L.q && r && (r===true || r.nom)){
    if(L.q.choix){ const a=$("gqsel").dataset.v; if(!L.q.ok(a)) r = a ? "Ta réponse n'est pas la bonne : observe bien la figure en déplaçant les points." : "Réponds maintenant à la question."; }
    else { const a=($("gqin")||{}).value||""; if(!L.q.ok(a)) r = a ? (L.q.ko||"Ta mesure n'est pas la bonne : mesure de nouveau, et écris la longueur avec une virgule.") : (L.q.vide||"Mesure le segment, puis écris sa longueur dans la case."); }
  }
  if(r===true || (r && r.nom)){
    if(r.nom){ const [p,n]=r.nom; const other=OB.find(o=>o.k==="pt" && o.name===n && o!==p && !o.given); if(other) other.name=nextName(); p.name=n; draw(); }
    const avant=SUB.every(j=>done.includes(j)), neuf=!done.includes(cur);
    if(neuf){ done.push(cur); store.set("done", JSON.stringify(done)); R0.querySelector(`#glevels .lnum[data-i="${cur}"]`).classList.add("ok"); }
    const nxt=SUB[SUB.indexOf(cur)+1];
    msg(`<b>Bravo, figure réussie !</b> ${L.bravo}${nxt!==undefined?`<br><button class="btn primary" id="gnext">Niveau suivant →</button>`:OPT.onFin?`<br><button class="btn primary" id="gfinb">${OPT.fin||"Terminer la séance"} →</button>`:"<br>Tu as terminé tous les niveaux disponibles !"}`, "ok");
    const nx=$("gnext"); if(nx) nx.onclick=()=>load(nxt);
    const fb=$("gfinb"); if(fb) fb.onclick=()=>OPT.onFin(done.slice());
    if(neuf && OPT.onChange) OPT.onChange(cur, done.slice());
    if(neuf && !avant && SUB.every(j=>done.includes(j)) && OPT.onFin) OPT.onFin(done.slice());
    return;
  }
  if(manuel) msg(`<b>Pas encore !</b> ${r}`, "ko"); else if(!$("gmsg").classList.contains("ko")) msg("");
}
function msg(h,kind){ const el=$("gmsg"); if(!el) return; el.hidden=!h; el.className="lmsg "+(kind||""); el.innerHTML=h; }
function levels(pack){ return PACKS[pack||"6e"].levels.map(L=>({t:L.titre, defi:!!L.defi})); }
function destroy(){ R0=null; drag=null; OPT={}; }
return {init, destroy, levels, PACKS, _t:{inter, interCC, interLC, interLL, lin, proj, clip, T, recompute, get OB(){ return OB; }, load:i=>load(i), click:p=>click(p), setTool:t=>{ tool=t; pend=[]; wait=null; status(); }}};
})();
