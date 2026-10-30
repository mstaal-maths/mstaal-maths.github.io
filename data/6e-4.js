/* 6e — Chapitre 4 : Distances, cercles et disques
   Figures des fiches : images tirées des PDF de M. Staal (fiche d'exercices corrigée : ex 5, 6 et 9 en vraie grandeur).
   Figures du quiz et des corrections : SVG calculés. */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const co = (p,alt,w) => img("c4co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("c4ex/"+p+".png", alt, w);
const fr = x => String(Math.round(x*100)/100).replace(".",",");
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const BLUE="#1e5aa8", RED="#d0342c", GREEN="#2e8b57", ORANGE="#e08a00";

/* ------------------------------------------------------------------
   Segment schématique : pts [[nom, position 0..1]] · lens [[i, j, texte, dessus?]] · ticks [[i, j, n]] codage
------------------------------------------------------------------ */
function segFig(o){
  const w=o.w||420, x0=24, x1=w-24, Y=46, X=t=>x0+t*(x1-x0);
  let s=`<svg class="fig" viewBox="0 0 ${w} 104" width="${w}" role="img" aria-label="${o.alt||"Segment"}">`;
  s+=`<line x1="${x0}" y1="${Y}" x2="${x1}" y2="${Y}" class="ln"/>`;
  o.pts.forEach(([L,t])=>{ const x=X(t); s+=`<line x1="${x}" y1="${Y-7}" x2="${x}" y2="${Y+7}" class="ln"/><text x="${x}" y="${Y-14}" text-anchor="middle" style="font-size:16px;font-weight:600;fill:var(--ink)">${L}</text>`; });
  (o.ticks||[]).forEach(([i,j,n])=>{ const xm=(X(o.pts[i][1])+X(o.pts[j][1]))/2; for(let k=0;k<n;k++){ const xx=xm+(k-(n-1)/2)*5; s+=`<line x1="${xx-3}" y1="${Y+6}" x2="${xx+3}" y2="${Y-6}" style="stroke:${RED};stroke-width:2"/>`; } });
  (o.lens||[]).forEach(([i,j,t,up])=>{ const a=X(o.pts[i][1]), b=X(o.pts[j][1]), y=up?Y-30:Y+22;
    s+=`<line x1="${a+2}" y1="${y}" x2="${b-2}" y2="${y}" style="stroke:var(--ink);stroke-width:1.4"/><path d="M${a+9} ${y-4} L${a+2} ${y} L${a+9} ${y+4} M${b-9} ${y-4} L${b-2} ${y} L${b-9} ${y+4}" style="fill:none;stroke:var(--ink);stroke-width:1.4"/>`;
    s+=`<text x="${(a+b)/2}" y="${up?y-6:y+18}" text-anchor="middle" style="font-size:15px;fill:${BLUE};font-weight:600">${t}</text>`; });
  return s+"</svg>";
}
/* ------------------------------------------------------------------
   Cercle schématique : centre O, rayon r (px) · pts [[nom, angle°, distance relative au rayon, couleur]]
   segs [[nomA, nomB, couleur]] · arc [nomA, nomB, couleur] · disc : disque grisé
------------------------------------------------------------------ */
function circFig(o){
  const r=o.r||70, W=o.w||260, H=o.h||2*r+60, cx=o.cx||W/2, cy=o.cy||H/2, P={};
  const pt=(a,k)=>[cx+r*k*Math.cos(a*Math.PI/180), cy-r*k*Math.sin(a*Math.PI/180)];
  (o.pts||[]).forEach(([L,a,k])=>P[L]=pt(a,k));
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${o.alt||"Cercle"}">`;
  if(o.arc){ const [A,B,col]=o.arc, a1=o.pts.find(p=>p[0]===A)[1], a2=o.pts.find(p=>p[0]===B)[1]; const p1=pt(a1,1), p2=pt(a2,1);
    const dl=((a2-a1)%360+360)%360; s+=`<path d="M${p1[0].toFixed(1)} ${p1[1].toFixed(1)} A${r} ${r} 0 ${dl>180?1:0} 0 ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}" style="fill:none;stroke:${col};stroke-width:6;stroke-linecap:round;opacity:.85"/>`; }
  s+=`<circle cx="${cx}" cy="${cy}" r="${r}" style="fill:${o.disc?"color-mix(in srgb,var(--c) 18%,transparent)":"none"};stroke:var(--ink);stroke-width:2"/>`;
  (o.segs||[]).forEach(([a,b,col])=>{ const A=P[a], B=P[b]; s+=`<line x1="${A[0].toFixed(1)}" y1="${A[1].toFixed(1)}" x2="${B[0].toFixed(1)}" y2="${B[1].toFixed(1)}" style="stroke:${col||"var(--ink)"};stroke-width:2.4"/>`; });
  (o.pts||[]).forEach(([L,a,k,col])=>{ const [x,y]=P[L]; const lx=x+(k?Math.cos(a*Math.PI/180):0.7)*15, ly=y-(k?Math.sin(a*Math.PI/180):0.7)*15+5;
    s+=cross(x,y,"ln")+`<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" style="font-size:16px;font-weight:600;fill:${col||"var(--ink)"}">${L}</text>`; });
  if(o.name) s+=`<text x="${(cx+r*0.78+6).toFixed(1)}" y="${(cy+r*0.78+14).toFixed(1)}" style="font-size:15px;fill:var(--muted)">${o.name}</text>`;
  if(o.rlab){ s+=`<text x="${(cx+r/2).toFixed(1)}" y="${cy-8}" text-anchor="middle" style="font-size:14px;fill:${RED};font-weight:600">${o.rlab}</text>`; }
  return s+"</svg>";
}
const VOC = circFig({r:72, w:250, pts:[["O",0,0],["A",-60,1],["M",128,1],["N",58,1],["E",180,1],["F",0,1]], segs:[["O","A",GREEN],["M","N",RED],["E","F",BLUE]], arc:["N","M",ORANGE], alt:"Rayon [OA], corde [MN], diamètre [EF], arc MN"});
window.FIG4 = {segFig, circFig};

/* ===================== schémas (rappels en image) ===================== */
const S_DIST = sch("Distance = longueur du segment", `<svg class="fig" viewBox="0 0 300 120" width="300" role="img" aria-label="Le chemin droit est le plus court"><path d="M30 90 C 80 10, 200 10, 270 90" style="fill:none;stroke:${ORANGE};stroke-width:2.5;stroke-dasharray:6 5"/><line x1="30" y1="90" x2="270" y2="90" style="stroke:${BLUE};stroke-width:3"/>${cross(30,90,"ln")}${cross(270,90,"ln")}<text x="22" y="112" style="font-size:16px;font-weight:600">A</text><text x="266" y="112" style="font-size:16px;font-weight:600">B</text><text x="150" y="110" text-anchor="middle" style="font-size:14px;fill:${BLUE};font-weight:600">AB : le plus court</text></svg><p class="schN">[AB] est le segment ; AB (sans crochets) est sa longueur, c'est la distance entre A et B.</p>`);
const S_ADD = sch("Des longueurs qui s'ajoutent", segFig({w:360, pts:[["A",0],["C",0.6],["M",1]], lens:[[0,1,"8 cm"],[1,2,"5 cm"],[0,2,"AM = 8 + 5 = 13 cm",1]]})+`<p class="schN">Si C est sur le segment [AM] : AM = AC + CM, et CM = AM − AC.</p>`);
const S_MIL = sch("Le milieu partage en deux longueurs égales", segFig({w:360, pts:[["A",0],["I",0.5],["B",1]], ticks:[[0,1,1],[1,2,1]], lens:[[0,2,"AB = 2 × AI",1]]})+`<p class="schN">I milieu de [AB] : AI = IB = AB ÷ 2, et AB = 2 × AI.</p>`);
const S_CERC = sch("Cercle ou disque ?", `<div class="figs">${circFig({r:56, w:170, pts:[["O",0,0]], name:"(C)", alt:"Un cercle"})}${circFig({r:56, w:170, pts:[["O",0,0]], disc:true, name:"(D)", alt:"Un disque"})}</div><p class="schN">Le cercle, c'est seulement le « trait ». Le disque, c'est le trait <b>et</b> tout l'intérieur.</p>`);
const S_VOC = sch("Le vocabulaire du cercle", VOC+`<p class="schN"><span style="color:${GREEN}">[OA] rayon</span> · <span style="color:${RED}">[MN] corde</span> · <span style="color:${BLUE}">[EF] diamètre</span> (corde qui passe par le centre) · <span style="color:${ORANGE}">arc MN</span></p>`);
const S_RD = sch("Rayon et diamètre", circFig({r:60, w:220, pts:[["O",0,0],["E",180,1],["F",0,1]], segs:[["E","F",BLUE]], rlab:"r"})+`<p class="schN">diamètre = 2 × rayon &nbsp;·&nbsp; rayon = diamètre ÷ 2</p>`);
const S_POS = sch("Dedans, dessus ou dehors ?", circFig({r:62, w:240, pts:[["O",0,0],["A",40,1,BLUE],["B",200,0.5,GREEN],["C",-20,1.45,RED]], alt:"A sur le cercle, B dedans, C dehors"})+`<p class="schN">Cercle de rayon 3 cm : <span style="color:${BLUE}">OA = 3 cm</span> (sur le cercle) · <span style="color:${GREEN}">OB &lt; 3 cm</span> (dans le disque) · <span style="color:${RED}">OC &gt; 3 cm</span> (dehors).</p>`);
const S_RED = sch("Utiliser le cercle pour calculer", `<p class="schN">Je sais que M appartient au cercle de centre T et de rayon 3 cm, <b>donc</b> TM = 3 cm.</p><p class="schN">Comme M est entre T et F : MF = TF − TM.</p>`);

CH["6e-4"] = {
intro:"La distance entre deux points, mesurer et tracer un segment, reporter une longueur au compas, calculer une longueur, le milieu d'un segment, le cercle et le disque, et leur vocabulaire.",
savoir:[
  "mesurer un segment et tracer un segment de longueur donnée ;",
  "reporter une longueur avec le compas ;",
  "calculer une longueur sur une figure ;",
  "reconnaître et construire le milieu d'un segment ;",
  "connaître le vocabulaire du cercle et du disque, et construire un cercle."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Distance entre deux points", h:`
  <div class="retenir" data-l="Définition"><p>La <b>distance</b> entre deux points A et B est la longueur du plus court chemin entre ces deux points : c'est la longueur du segment [AB].</p></div>
  <p><b>Notation :</b> le segment se note [AB] (avec des crochets) ; sa longueur se note AB (sans crochets).</p>
  ${co("p1-ab","Le segment [AB] mesure 5 cm",300)}
  <p>On peut le dire de trois façons : <b>« la distance entre A et B est égale à 5 cm »</b>, « la longueur du segment [AB] est 5 cm », ou <b>AB = 5 cm</b>.</p>
  <h4>1. Mesurer et tracer un segment</h4>
  <p>On place le zéro de la règle graduée sur la première extrémité du segment, puis on lit la graduation sur la seconde.</p>
  ${co("p1-regle","Mesurer EF = 6 cm avec la règle",380)}
  <div class="anim" data-anim="6e4-mesurer-segment"></div>
  <p>Pour tracer un segment [CD] tel que CD = 7 cm : on place le point C sur le zéro de la règle, on marque le point D à la graduation 7, puis on trace le segment à la règle.</p>
  <div class="anim" data-anim="6e4-tracer-segment"></div>
  <h4>2. Reporter une longueur au compas</h4>
  <p>Le compas permet de reporter une longueur sans la mesurer.</p>
  <div class="cgrid"><figure><figcaption><b>Étape 1 :</b> on écarte le compas de A jusqu'à B.</figcaption>${co("p2-compas1","Écarter le compas de A à B",230)}</figure><figure><figcaption><b>Étape 2 :</b> sans changer l'écartement, on pique en C et on trace un arc qui coupe la droite en D. On a alors CD = AB.</figcaption>${co("p2-compas2","Reporter la longueur à partir de C",230)}</figure></div>
  <div class="anim" data-anim="6e4-report-compas"></div>
  <h4>3. Calculer une longueur</h4>
  ${co("p2-calc","C est entre A et M",200)}
  <p><b>Exemple :</b> le point C appartient au segment [AM], avec AC = 8 cm et CM = 5 cm. Comme C est entre A et M :</p>
  <p class="calc">AM = AC + CM = 8 + 5 = 13 cm</p>
  <p><i>Un dessin à main levée aide à voir quelles longueurs s'ajoutent.</i></p>`},
{k:"II", t:"Milieu d'un segment", h:`
  <div class="retenir" data-l="Définition"><p>Le <b>milieu</b> d'un segment est le point de ce segment qui le partage en deux segments de même longueur.</p></div>
  ${co("p2-milieu","I est le milieu de [AB]",300)}
  <p><b>Codage :</b> on marque les longueurs égales par un même petit trait. Ici, I est le milieu de [AB] : AI = IB, et AB = 2 × AI.</p>
  <div class="retenir" data-l="Méthode"><p><b>Construire le milieu d'un segment</b></p><ol><li>Je mesure la longueur du segment avec la règle graduée.</li><li>Je divise cette longueur par 2.</li><li>Je place le point à cette graduation, à partir d'une extrémité, et je code les deux longueurs égales.</li></ol></div>
  <div class="anim" data-anim="6e4-milieu-regle"></div>
  <p><b>Exemple :</b> si AB = 8 cm, alors le milieu I est à 4 cm de A.</p>`},
{k:"III", t:"Cercle et disque", h:`
  <h4>1. Définitions</h4>
  <div class="retenir" data-l="Définition"><p>Un <b>cercle</b> est formé de tous les points situés à la même distance d'un point appelé <b>centre</b> du cercle. Cette distance est le <b>rayon</b> du cercle.</p></div>
  <div class="retenir" data-l="Définition"><p>Un <b>disque</b> est formé de tous les points situés sur le cercle et à l'intérieur du cercle.</p></div>
  <div class="cgrid"><figure><figcaption>Le cercle (C) de centre M et de rayon 2 cm.</figcaption>${co("p3-cercle","Le cercle de centre M et de rayon 2 cm",130)}</figure><figure><figcaption>Le disque (D) de centre M et de rayon 2 cm.</figcaption>${co("p3-disque","Le disque de centre M et de rayon 2 cm",130)}</figure></div>
  <p><b>Exercice :</b> on a tracé le cercle (C) de centre O et de rayon 3 cm, et on a grisé le disque (D) de centre O et de rayon 3 cm.</p>
  ${co("p3-ex","Cercle de centre O avec les points A, B, E, F",210)}
  <p>1) Complète par ∈ ou ∉ : A …… (C) &nbsp; A …… (D) &nbsp;·&nbsp; B …… (C) &nbsp; B …… (D) &nbsp;·&nbsp; O …… (C) &nbsp; O …… (D) &nbsp;·&nbsp; F …… (C) &nbsp; F …… (D) &nbsp;·&nbsp; E …… (C) &nbsp; E …… (D)</p>
  <p>2) Complète par « &lt; », « &gt; » ou « = » : OA …… 3 cm &nbsp; OB …… 3 cm &nbsp; OE …… 3 cm &nbsp; OF …… 3 cm</p>
  <details><summary>Voir la correction</summary><div class="corr">
   <div class="scroll"><table class="std"><thead><tr><th>Point</th><th>Où est-il ?</th><th>cercle (C)</th><th>disque (D)</th></tr></thead><tbody>
    <tr><td><b>A</b></td><td>sur le cercle</td><td>A ∈ (C)</td><td>A ∈ (D)</td></tr>
    <tr><td><b>B</b></td><td>à l'intérieur</td><td>B ∉ (C)</td><td>B ∈ (D)</td></tr>
    <tr><td><b>O</b></td><td>le centre</td><td>O ∉ (C)</td><td>O ∈ (D)</td></tr>
    <tr><td><b>F</b></td><td>sur le cercle</td><td>F ∈ (C)</td><td>F ∈ (D)</td></tr>
    <tr><td><b>E</b></td><td>à l'extérieur</td><td>E ∉ (C)</td><td>E ∉ (D)</td></tr></tbody></table></div>
   <p>2) OA = 3 cm &nbsp;·&nbsp; OB &lt; 3 cm &nbsp;·&nbsp; OE &gt; 3 cm &nbsp;·&nbsp; OF = 3 cm</p>
   <p><i>Un point du cercle appartient aussi au disque. Le centre appartient au disque, mais pas au cercle.</i></p></div></details>
  <h4>2. Le vocabulaire du cercle</h4>
  <ul><li>Le <b>centre</b> est le point situé à la même distance de tous les points du cercle. Ex : O.</li><li>Un <b>rayon</b> est un segment qui joint le centre à un point du cercle. Ex : [OA].</li><li>Une <b>corde</b> est un segment dont les deux extrémités sont sur le cercle. Ex : [MN].</li><li>Un <b>diamètre</b> est une corde qui passe par le centre. Ex : [EF].</li><li>Un <b>arc de cercle</b> est une portion de cercle comprise entre deux points du cercle. Ex : l'arc MN en orange.</li></ul>
  ${co("p3-vocab","Centre O, rayon [OA], corde [MN], diamètre [EF], arc MN",200)}
  <div class="retenir" data-l="Propriété"><p>Un diamètre est deux fois plus long qu'un rayon : <b>diamètre = 2 × rayon</b>.</p></div>
  ${co("p4-diam","EF = 2 × r",160)}
  <h4>3. Construire un cercle au compas</h4>
  <div class="cgrid"><figure><figcaption><b>Étape 1 :</b> j'écarte le compas de la longueur du rayon, en m'aidant de la règle graduée (ici 3 cm).</figcaption>${co("p4-regle","Écartement de 3 cm",220)}</figure><figure><figcaption><b>Étape 2 :</b> je pique la pointe du compas sur le centre O, puis je tourne sans changer l'écartement.</figcaption>${co("p4-compas","Tracer le cercle de centre O",120)}</figure></div>
  <div class="anim" data-anim="cercle-compas"></div>
  <h4>4. Utiliser le cercle pour calculer une longueur</h4>
  <div class="retenir" data-l="Propriété"><p>Si un point M appartient au cercle de centre O et de rayon r, alors <b>OM = r</b>.</p></div>
  ${co("p4-prop","M sur le cercle de centre O : OM = r",130)}
  <div class="cgrid"><figure><figcaption><b>Exemple rédigé :</b> le cercle (C) a pour centre T et pour rayon 3 cm. Il coupe le segment [TF] au point M, et TF = 5 cm.<br><br>Je sais que M appartient au cercle de centre T et de rayon 3 cm, donc <b>TM = 3 cm</b>.<br>Comme M est entre T et F : <b>MF = TF − TM = 5 − 3 = 2 cm</b>.</figcaption>${co("p4-redige","Cercle de centre T, M sur le cercle et sur [TF]",180)}</figure></div>`}
],

/* ===================== EXERCICES (dans l'ordre de la fiche) ===================== */
exos:[
{t:"Distance entre deux points", e:[
  {n:"Activité 1", t:"Distance entre deux points", w:"Sur ton cahier", h:`<p>Romain et Killian sont deux amis. Romain veut connaître la distance entre sa maison et celle de Killian. Sur une carte, il trouve l'information ci-dessous : pour aller à pied chez Killian, Romain devra marcher 400 m pendant 5 min.</p>${ex("act1","Le trajet à pied entre les deux maisons",320)}<p><b>Est-ce que la distance entre les deux maisons est égale à 400 m ? Explique.</b></p>`,
   c:`<p><b>Non.</b> La distance entre les deux maisons est la longueur du plus court chemin : le segment qui relie les deux maisons, en ligne droite.</p><p>Le chemin à pied de 400 m n'est pas droit (il suit les rues et fait des détours) : il est plus long. La distance entre les deux maisons est donc <b>inférieure à 400 m</b>.</p>`},
  {n:"Exercice 1", t:"Mesurer une distance", w:"Sur ta feuille", h:`<p>1) Trace en bleu la distance entre A et B, en noir celle entre C et D, en rouge celle entre E et F.</p><p>2) Complète : AB = …… cm &nbsp;&nbsp; CD = …… cm &nbsp;&nbsp; EF = …… cm</p>${ex("e1","Les points A, B, C, D, E et F",560)}`,
   c:`<p>On trace les segments [AB], [CD] et [EF] à la règle, puis on les mesure en plaçant le zéro de la règle sur la première extrémité.</p>${ex("e1c","Les trois segments tracés",560)}<p>AB = 5 cm · CD = 4 cm · EF = 7 cm</p><p><i>Mesures faites sur la fiche imprimée (pas sur l'écran).</i></p>`},
  {n:"Exercice 2", t:"Calculer une longueur", w:"Sur ton cahier", h:`<p>Dans chaque cas, calcule la distance AB. Justifie.</p>${ex("e2","Trois segments a, b et c",380)}`,
   c:`<p><b>a.</b> M appartient au segment [AB], donc AB = AM + MB = 4 + 7 = <b>11 cm</b>.</p><p><b>b.</b> B appartient au segment [AC], donc AB = AC − BC = 15 − 9 = <b>6 mm</b>.</p><p><b>c.</b> Les segments [AC], [CD], [DE], [EF] et [FB] ont la même longueur (même codage) : 3 cm. Donc AB = 5 × 3 = <b>15 cm</b>.</p>`},
  {n:"Exercice 3", t:"Dessin à main levée et calcul", w:"Sur ton cahier", h:`<p><b>a)</b> Le segment [MR] mesure 20 m et le point L appartient à [MR], avec ML = 14 m. Fais un dessin à main levée, puis calcule la distance RL.</p><p><b>b)</b> Le point G appartient au segment [EF], avec GE = 5 km et EF = 12 km. Fais un dessin à main levée, puis calcule la distance GF.</p>`,
   c:`<div style="break-inside:avoid"><p><b>a)</b></p>${segFig({pts:[["M",0],["L",0.7],["R",1]], lens:[[0,1,"14 m"],[0,2,"20 m",1]]})}<p>L appartient au segment [MR], donc RL = MR − ML = 20 − 14 = <b>6 m</b>.</p></div>
   <div style="break-inside:avoid"><p><b>b)</b></p>${segFig({pts:[["E",0],["G",5/12],["F",1]], lens:[[0,1,"5 km"],[0,2,"12 km",1]]})}<p>G appartient au segment [EF], donc GF = EF − GE = 12 − 5 = <b>7 km</b>.</p></div>`},
  {n:"Exercice 4", t:"Milieu d'un segment (calcul)", w:"Sur ton cahier", h:`<p><b>a)</b> Le segment [MR] mesure 6 cm et R est le milieu du segment [MP]. Fais un dessin à main levée, puis calcule la distance MP.</p><p><b>b)</b> Le segment [LF] mesure 8 cm et A est le milieu du segment [LF]. Fais un dessin à main levée, puis calcule la longueur AF.</p>`,
   c:`<div style="break-inside:avoid"><p><b>a)</b></p>${segFig({pts:[["M",0],["R",0.5],["P",1]], ticks:[[0,1,1],[1,2,1]], lens:[[0,1,"6 cm"]]})}<p>R est le milieu de [MP], donc MP = 2 × MR = 2 × 6 = <b>12 cm</b>.</p></div>
   <div style="break-inside:avoid"><p><b>b)</b></p>${segFig({pts:[["L",0],["A",0.5],["F",1]], ticks:[[0,1,1],[1,2,1]], lens:[[0,2,"8 cm",1]]})}<p>A est le milieu de [LF], donc AF = LF ÷ 2 = 8 ÷ 2 = <b>4 cm</b>.</p></div>`}
 ]},
{t:"Cercle et disque", e:[
  {n:"Activité 2", t:"Zone d'orage", w:"Sur ta feuille", h:`<p>Météo France a prévu de violents orages dans toute la zone située à moins de 40 km de Tours. <b>Sur cette carte, 1 cm représente 20 km.</b></p>${ex("act2","Carte de la région de Tours",340)}
   <p>a) À combien de centimètres sur la carte correspondent 40 km ? ……</p><p>b) Hachure au crayon de bois toute la zone d'orage.</p><p>c) Entoure les villes qui se trouvent dans cette zone : Chinon · Azay-le-Rideau · Amboise · Chenonceaux · Blois · Valençay</p>`,
   c:`<p>a) 40 km = 2 × 20 km, donc 40 km correspondent à <b>2 cm</b> sur la carte.</p><p>b) La zone d'orage est le <b>disque de centre Tours et de rayon 2 cm</b> : on le trace au compas, puis on hachure l'intérieur.</p>${ex("act2c","La zone d'orage : disque de centre Tours et de rayon 2 cm",340)}
   <p>c) Les villes dans la zone : <b>Azay-le-Rideau, Amboise et Chenonceaux</b> (à moins de 2 cm de Tours sur la carte).</p><p><i>Chinon (environ 2,3 cm), Blois (environ 2,7 cm) et Valençay (environ 3,6 cm) sont en dehors.</i></p>`},
  {n:"Exercice 5", t:"Cercle ou disque ?", w:"Sur ta feuille", h:`<p>1) Repasse en bleu tous les points situés <b>exactement à 2 cm</b> du point A.</p><p>2) Repasse en rouge tous les points situés <b>à plus de 2 cm</b> du point A.</p><p>3) Comment appelle-t-on la figure formée par tous les points situés exactement à 2 cm de A ? ……………</p><p>4) Et par tous les points situés à 2 cm ou moins de A ? ……………</p>${ex("e5","Des points autour du point A",230)}`,
   c:`<p>1) et 2) On écarte le compas de 2 cm (ou on mesure à la règle). Les points en bleu sont exactement à 2 cm de A, ceux en rouge sont à plus de 2 cm.</p>${ex("e5c","Points bleus sur le cercle, points rouges à l'extérieur",230)}
   <p>3) Tous les points situés exactement à 2 cm de A forment le <b>cercle de centre A et de rayon 2 cm</b>.</p><p>4) Tous les points situés à 2 cm ou moins de A forment le <b>disque de centre A et de rayon 2 cm</b>.</p>`},
  {n:"Exercice 6", t:"Rayon et distance au centre", w:"Sur ta feuille", h:`<p>Sur la figure ci-dessous, (C) est le cercle de centre A et de rayon 2 cm.</p>${ex("e6","Cercle de centre A avec les points B, D, E, F et G",170)}<p>1) Complète avec &lt; , &gt; ou = :</p><p>a) AB …… 2 cm &nbsp;&nbsp; b) AD …… 2 cm &nbsp;&nbsp; c) AE …… 2 cm &nbsp;&nbsp; d) AF …… 2 cm</p><p>2) Ryan affirme : « AE = AG ». A-t-il raison ? Explique.</p>`,
   c:`<p>1) a) B est à l'intérieur du cercle : <b>AB &lt; 2 cm</b>.</p><p>b) D est à l'extérieur du cercle : <b>AD &gt; 2 cm</b>.</p><p>c) E appartient au cercle : <b>AE = 2 cm</b>.</p><p>d) F appartient au cercle : <b>AF = 2 cm</b>.</p>
   <p>2) <b>Oui, Ryan a raison.</b> E et G appartiennent au cercle de centre A et de rayon 2 cm, donc AE = 2 cm et AG = 2 cm. Donc AE = AG.</p>`},
  {n:"Exercice 7", t:"Rayon et diamètre", w:"Sur ta feuille", h:`<div class="scroll"><table class="std"><tbody><tr><th>Rayon</th><td>3 cm</td><td>……</td><td>5 cm</td><td>……</td></tr><tr><th>Diamètre</th><td>……</td><td>8 cm</td><td>……</td><td>14 cm</td></tr></tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><tbody><tr><th>Rayon</th><td>3 cm</td><td><b>4 cm</b></td><td>5 cm</td><td><b>7 cm</b></td></tr><tr><th>Diamètre</th><td><b>6 cm</b></td><td>8 cm</td><td><b>10 cm</b></td><td>14 cm</td></tr></tbody></table></div><p>diamètre = 2 × rayon : 2 × 3 = 6 ; 2 × 5 = 10. &nbsp; rayon = diamètre ÷ 2 : 8 ÷ 2 = 4 ; 14 ÷ 2 = 7.</p>`},
  {n:"Exercice 8", t:"Calculer une longueur avec un cercle", w:"Sur ton cahier", h:`<p>On donne : (C) est le cercle de centre A et de rayon 3 cm ; R et C appartiennent au cercle (C) ; les points T, R, A et C sont alignés ; TA = 8 cm.</p>${ex("e8","Les points T, R, A, C alignés",200)}<p><i>(figure qui n'est pas en vraie grandeur)</i></p><p>a) Quelle est la longueur du segment [TC] ? Justifie.</p><p>b) Quelle est la longueur du segment [TR] ? Justifie.</p>`,
   c:`<p>a) Je sais que C appartient au cercle de centre A et de rayon 3 cm, donc AC = 3 cm.</p><p>Comme A est entre T et C : TC = TA + AC = 8 + 3 = <b>11 cm</b>.</p>
   <p>b) Je sais que R appartient au cercle de centre A et de rayon 3 cm, donc AR = 3 cm.</p><p>Comme R est entre T et A : TR = TA − AR = 8 − 3 = <b>5 cm</b>.</p>`}
 ]},
{t:"Construire et reconnaître", e:[
  {n:"Activité 3", t:"Programme de construction", w:"Sur ton cahier", h:`<p>1) Trace un cercle (C) de centre A et de rayon 4 cm.</p><p>2) Trace [AB], un rayon du cercle.</p><p>3) Trace [CD], un diamètre du cercle.</p><p>4) Trace [EF], une corde du cercle.</p><p>5) Repasse en rouge l'arc de cercle BD.</p>`,
   c:`<p>Voici un exemple de figure (réduite). Les points B, C, D, E et F peuvent être placés ailleurs sur le cercle : il faut seulement que B, C, D, E, F soient <b>sur</b> le cercle et que [CD] passe par le centre A.</p>
   ${circFig({r:90, w:280, pts:[["A",0,0],["B",60,1],["C",160,1],["D",-20,1],["E",215,1],["F",280,1]], segs:[["A","B",GREEN],["C","D",BLUE],["E","F",ORANGE]], arc:["D","B",RED], name:"(C)", alt:"Cercle de centre A, rayon [AB], diamètre [CD], corde [EF], arc BD en rouge"})}
   <p>Vérifications : AB = 4 cm (un rayon) et CD = 8 cm (un diamètre = 2 × 4 cm). L'arc BD est en rouge.</p>`},
  {n:"Exercice 9", t:"Dessin caché", w:"Sur ta feuille", h:`<p>Sur la figure ci-dessous, trace au crayon de bois :</p><p>a) le cercle de centre A et de rayon 2 cm ;</p><p>b) le cercle de centre K et de rayon [KB] ;</p><p>c) le cercle de centre L et de diamètre 4 cm ;</p><p>d) le cercle de diamètre [NT] ;</p><p>e) le cercle de centre Y dont le rayon a pour longueur KB.</p>${ex("e9","Les points A, N, T, B, K, L et Y",480)}<p><b>Que reconnais-tu ?</b> ……………</p>`,
   c:`<p>a) Le rayon est 2 cm.</p><p>b) Je mesure [KB] : KB = 2 cm. Le rayon est 2 cm.</p><p>c) Le diamètre est 4 cm. Le rayon est 4 ÷ 2 = 2 cm.</p><p>d) Le centre est le milieu de [NT]. NT = 4 cm, donc le rayon est 4 ÷ 2 = 2 cm.</p><p>e) Le rayon est KB = 2 cm.</p><p>Les cinq cercles ont le même rayon : 2 cm.</p>${ex("e9c","Les anneaux olympiques",480)}<p>On reconnaît <b>les anneaux olympiques</b>.</p>`},
  {n:"Exercice 10", t:"Vocabulaire du cercle", w:"Sur ta feuille", h:`<p>Place, au crayon de bois, les points A, B, C, D et O au bon endroit sur la figure :</p><p>• [AB] est un diamètre du cercle ; • O est le centre du cercle ; • (AB) ⊥ (OD) ; • [OC] est un rayon du cercle.</p>${ex("e10","Cercle avec trois segments partant du centre",150)}`,
   c:`<p>O est le point où se rejoignent les segments (le centre). [AB] est le segment qui traverse le cercle en passant par O : A et B sont ses deux extrémités (dans un ordre ou dans l'autre). D est l'extrémité du segment perpendiculaire à (AB) (angle droit codé). C est l'extrémité du dernier segment.</p>
   ${circFig({r:70, w:230, pts:[["O",0,0],["A",205,1],["B",25,1],["D",115,1],["C",235,1]], segs:[["A","B"],["O","D"],["O","C"]], alt:"Solution : diamètre [AB], rayon [OD] perpendiculaire, rayon [OC]"}).replace('x="125.5" y="94.5"','x="130" y="120"').replace("</svg>",'<path d="M123.2 96.2 L119.4 88.0 L111.2 91.8" style="fill:none;stroke:var(--ink);stroke-width:1.4"/></svg>')}`},
  {n:"Exercice 11", t:"Pour finir — deux cercles", w:"Sur ton cahier", h:`<p>On a tracé le cercle (C₁) de centre A et de rayon 3 cm, et le cercle (C₂) de centre B et de rayon 2 cm. Ces deux cercles se coupent en C et D.</p>${ex("e11","Deux cercles qui se coupent en C et D",200)}<p><i>(figure qui n'est pas en vraie grandeur)</i></p><p>a) Quelle est la longueur du segment [BC] ? Justifie.</p><p>b) Quelle est la longueur du segment [AD] ? Justifie.</p>`,
   c:`<p>a) Je sais que C appartient au cercle (C₂) de centre B et de rayon 2 cm, donc <b>BC = 2 cm</b>.</p><p>b) Je sais que D appartient au cercle (C₁) de centre A et de rayon 3 cm, donc <b>AD = 3 cm</b>.</p>`}
 ]},
{t:"Complément : distance d'un point à une droite", note:"<b>À retenir :</b> la distance d'un point A à une droite (d) est la longueur du segment qui part de A et qui est <b>perpendiculaire</b> à (d). C'est le plus court chemin entre le point et la droite. On le trace avec l'équerre.", e:[
  {n:"Exercice 1", t:"Mesurer des distances", w:"Sur ta feuille", h:`<p>Avec ton équerre, trace les segments qui permettent de mesurer la distance de chacun des points A, B, C et D à la droite (d). Mesure ensuite ces distances.</p>${ex("comp1","Les points A, B, C, D et la droite (d)",520)}<p>A : …… cm · B : …… cm · C : …… cm · D : …… cm</p><p>Quel point est le plus proche de la droite (d) ? Le plus éloigné ?</p>`,
   c:`<p>Pour chaque point, on place l'équerre sur la droite (d) et on trace le segment perpendiculaire à (d) qui passe par le point. On mesure ce segment.</p><svg class="fig" viewBox="0 0 570 132" width="570" role="img" aria-label="Les distances des points A, B, C, D à la droite (d)"><line x1="8.8" y1="102.1" x2="551.9" y2="69.5" class="ln"/><text x="546.0" y="61.8" style="font-size:14px">(d)</text><line x1="77.7" y1="15.5" x2="82.6" y2="97.6" style="stroke:#d0342c;stroke-width:2"/><path d="M82.2 90.7 l7.0 -0.4 l0.4 7.0" style="fill:none;stroke:#d0342c;stroke-width:1.2"/><circle cx="77.7" cy="15.5" r="3" style="fill:var(--ink)"/><text x="71.7" y="8.5" style="font-size:14px;font-weight:600">A</text><text x="86.2" y="60.6" style="font-size:12px;fill:#d0342c;font-weight:600">2,5 cm</text><line x1="211.7" y1="40.3" x2="214.6" y2="89.7" style="stroke:#d0342c;stroke-width:2"/><path d="M214.2 82.7 l7.0 -0.4 l0.4 7.0" style="fill:none;stroke:#d0342c;stroke-width:1.2"/><circle cx="211.7" cy="40.3" r="3" style="fill:var(--ink)"/><text x="205.7" y="33.3" style="font-size:14px;font-weight:600">B</text><text x="219.2" y="69.0" style="font-size:12px;fill:#d0342c;font-weight:600">1,5 cm</text><line x1="342.7" y1="16.0" x2="346.7" y2="81.8" style="stroke:#d0342c;stroke-width:2"/><path d="M346.3 74.8 l7.0 -0.4 l0.4 7.0" style="fill:none;stroke:#d0342c;stroke-width:1.2"/><circle cx="342.7" cy="16.0" r="3" style="fill:var(--ink)"/><text x="336.7" y="9.0" style="font-size:14px;font-weight:600">C</text><text x="350.7" y="52.9" style="font-size:12px;fill:#d0342c;font-weight:600">2 cm</text><line x1="474.2" y1="107.5" x2="472.2" y2="74.3" style="stroke:#d0342c;stroke-width:2"/><path d="M472.6 81.3 l7.0 -0.4 l-0.4 -7.0" style="fill:none;stroke:#d0342c;stroke-width:1.2"/><circle cx="474.2" cy="107.5" r="3" style="fill:var(--ink)"/><text x="468.2" y="123.5" style="font-size:14px;font-weight:600">D</text><text x="479.2" y="94.9" style="font-size:12px;fill:#d0342c;font-weight:600">1 cm</text></svg><p>A : <b>2,5 cm</b> · B : <b>1,5 cm</b> · C : <b>2 cm</b> · D : <b>1 cm</b></p><p>Le point le plus proche de (d) est <b>D</b> ; le plus éloigné est <b>A</b>.</p><p><i>Mesures faites sur la fiche imprimée (pas sur l'écran). Attention : C paraît plus haut que B, mais il faut mesurer perpendiculairement à la droite, qui monte vers la droite.</i></p>`},
  {n:"Exercice 2", t:"Le plus court chemin", w:"Sur ta feuille", h:`<p>Léa se trouve au point L, dans un champ, à côté d'une route droite (r). Elle veut rejoindre la route le plus vite possible.</p>${ex("comp2","Le point L, la route (r) et le chemin [LP]",260)}<p>1) Construis le chemin le plus court pour rejoindre la route. Nomme H le point d'arrivée.</p><p>2) Mesure LH et LP. Quel est le chemin le plus court ?</p>`,
   c:`<p>1) Le chemin le plus court est le segment [LH] <b>perpendiculaire</b> à la route (r) : on le trace avec l'équerre.</p>
   <svg class="fig" viewBox="0 0 260 130" width="260" role="img" aria-label="Le segment [LH] perpendiculaire à la route"><line x1="6" y1="100" x2="250" y2="100" style="stroke:#888;stroke-width:3"/><line x1="80" y1="22" x2="80" y2="100" style="stroke:#d0342c;stroke-width:2.2"/><path d="M80 92 h8 v8" style="fill:none;stroke:#d0342c;stroke-width:1.4"/><line x1="80" y1="22" x2="187" y2="100" style="stroke:#1e5aa8;stroke-width:2;stroke-dasharray:6 4"/><circle cx="80" cy="22" r="3.5" style="fill:var(--ink)"/><circle cx="187" cy="100" r="3.5" style="fill:var(--ink)"/><text x="66" y="18" style="font-size:15px;font-weight:600">L</text><text x="74" y="120" style="font-size:15px;font-weight:600">H</text><text x="182" y="120" style="font-size:15px;font-weight:600">P</text><text x="226" y="94" style="font-size:13px">(r)</text></svg>
   <p>2) Sur la fiche : LH ≈ <b>2,7 cm</b> et LP ≈ <b>4,6 cm</b>. Le chemin le plus court est <b>[LH]</b>, le chemin perpendiculaire à la route.</p>`},
  {n:"Exercice 3", t:"Construire", w:"Sur une feuille blanche", h:`<p>1) Sur une feuille blanche, trace une droite (d).</p><p>2) Place un point E tel que la distance de E à (d) soit égale à 3 cm.</p><p>3) Place un point F, de l'autre côté de (d), tel que la distance de F à (d) soit égale à 4,5 cm.</p><p>4) Place un point G sur la droite (d). Quelle est la distance de G à (d) ?</p>`,
   c:`<p>2) Avec l'équerre, je trace une perpendiculaire à (d) ; sur cette perpendiculaire, je place E à 3 cm de (d) avec la règle graduée.</p><p>3) Même méthode de l'autre côté de (d), avec 4,5 cm.</p>
   <svg class="fig" viewBox="0 0 300 200" width="300" role="img" aria-label="E à 3 cm au-dessus de (d), F à 4,5 cm en dessous, G sur (d)"><line x1="10" y1="80" x2="290" y2="80" class="ln"/><text x="268" y="74" style="font-size:14px">(d)</text><line x1="90" y1="20" x2="90" y2="80" style="stroke:#d0342c;stroke-width:2"/><path d="M90 72 h8 v8" style="fill:none;stroke:#d0342c;stroke-width:1.3"/><line x1="180" y1="80" x2="180" y2="170" style="stroke:#1e5aa8;stroke-width:2"/><path d="M180 88 h8 v-8" style="fill:none;stroke:#1e5aa8;stroke-width:1.3"/>${cross(90,20,"ln")}${cross(180,170,"ln")}${cross(240,80,"ln")}<text x="76" y="16" style="font-size:15px;font-weight:600">E</text><text x="98" y="54" style="font-size:12px;fill:#d0342c;font-weight:600">3 cm</text><text x="188" y="186" style="font-size:15px;font-weight:600">F</text><text x="188" y="130" style="font-size:12px;fill:#1e5aa8;font-weight:600">4,5 cm</text><text x="236" y="100" style="font-size:15px;font-weight:600">G</text></svg>
   <p>4) G est sur la droite (d) : la distance de G à (d) est égale à <b>0 cm</b>.</p>`},
  {n:"Exercice 4", t:"Vrai ou faux ?", w:"Sur ta feuille", h:`<p>a) Pour mesurer la distance d'un point à une droite, on peut utiliser n'importe quel segment qui relie le point à la droite.</p><p>b) Le point A est à 2 cm de la droite (d) : tous les points de (d) sont à 2 cm ou plus du point A.</p>`,
   c:`<p>a) <b>Faux</b> : il faut utiliser le segment <b>perpendiculaire</b> à la droite. Les autres segments sont plus longs.</p><p>b) <b>Vrai</b> : 2 cm est la plus courte distance entre A et un point de (d) ; tous les autres points de (d) sont plus loin de A.</p>`}
 ]}
],

/* ===================== QUIZ ===================== */
quiz:[
{nom:"Distance et notations", schema:S_DIST, q:{
 1:[ {q:"Comment note-t-on la longueur du segment [AB] ?", c:["AB","[AB]","(AB)"], rep:"AB", ex:"[AB] est le segment (l'objet) ; AB, sans crochets, est sa longueur.", sx:S_DIST},
     {q:"La distance entre deux points, c'est la longueur…", c:["du plus court chemin entre ces deux points","du chemin que l'on prend à pied","de la droite qui passe par ces points"], rep:"du plus court chemin entre ces deux points", sx:S_DIST} ],
 2:[ {q:"Quelle écriture est correcte ?", c:["AB = 5 cm","[AB] = 5 cm","(AB) = 5 cm"], rep:"AB = 5 cm", ex:"Une longueur s'écrit sans crochets.", sx:S_DIST},
     {g:()=>{ const d=ri(3,9)*100, k=String(d+ri(1,4)*100).replace(/\B(?=(\d{3})+(?!\d))/g," "); return {q:`Pour aller de chez Lou à l'école, on marche ${k} m dans des rues qui tournent. La distance entre la maison et l'école est :`, c:[`inférieure à ${k} m`,`égale à ${k} m`,`supérieure à ${k} m`], rep:`inférieure à ${k} m`, ex:"Le chemin à pied fait des détours : il est plus long que le segment, qui est le plus court chemin.", sx:S_DIST}; }} ],
 3:[ {q:"Vrai ou faux : on peut mesurer la longueur d'une droite.", c:VF, rep:"Faux", ex:"Une droite est illimitée : on ne peut mesurer qu'un segment."},
     {q:"Pour mesurer un segment, on place sur la première extrémité…", c:["le zéro de la règle","la graduation 1 de la règle","le bout de la règle"], rep:"le zéro de la règle", ex:"On place le 0 de la règle graduée sur une extrémité, puis on lit la graduation sur l'autre."} ]
}},
{nom:"Calculer une longueur", schema:S_ADD, q:{
 1:[ {g:()=>{ const a=ri(2,9), b=ri(2,9); return {q:`M appartient au segment [AB], AM = ${a} cm et MB = ${b} cm. Combien mesure AB (en cm) ?`, fig:segFig({w:360, pts:[["A",0],["M",a/(a+b)],["B",1]], lens:[[0,1,a+" cm"],[1,2,b+" cm"]]}), rep:String(a+b), ex:`AB = AM + MB = ${a} + ${b} = ${a+b} cm.`, sx:S_ADD}; }} ],
 2:[ {g:()=>{ const t=ri(10,25), a=ri(2,t-2); return {q:`C appartient au segment [AM], AM = ${t} cm et AC = ${a} cm. Combien mesure CM (en cm) ?`, fig:segFig({w:360, pts:[["A",0],["C",a/t],["M",1]], lens:[[0,1,a+" cm"],[0,2,t+" cm",1]]}), rep:String(t-a), ex:`CM = AM − AC = ${t} − ${a} = ${t-a} cm.`, sx:S_ADD}; }},
     {g:()=>{ const n=ri(3,6), l=ri(2,5); const pts=[...Array(n+1)].map((_,i)=>[i?(i<n?String.fromCharCode(66+i):"B"):"A", i/n]); pts[n][0]="B"; for(let i=1;i<n;i++) pts[i][0]="CDEFGH"[i-1];
       return {q:`Les ${n} petits segments ont la même longueur, et le premier mesure ${l} cm. Combien mesure AB (en cm) ?`, fig:segFig({w:380, pts, ticks:[...Array(n)].map((_,i)=>[i,i+1,1]), lens:[[0,1,l+" cm"]]}), rep:String(n*l), ex:`${n} segments de ${l} cm : AB = ${n} × ${l} = ${n*l} cm.`, sx:S_ADD}; }} ],
 3:[ {g:()=>{ const t=ri(12,30), a=ri(3,t-3); return {q:`G appartient au segment [EF], avec GE = ${a} km et EF = ${t} km. Combien mesure GF (en km) ?`, rep:String(t-a), ex:`Un dessin à main levée aide : GF = EF − GE = ${t} − ${a} = ${t-a} km.`, sx:S_ADD}; }},
     {g:()=>{ const a=ri(11,49), b=ri(11,49); return {q:`B appartient au segment [AC], AC = ${a+b} mm et BC = ${b} mm. Combien mesure AB (en mm) ?`, rep:String(a), ex:`AB = AC − BC = ${a+b} − ${b} = ${a} mm.`, sx:S_ADD}; }} ]
}},
{nom:"Milieu d'un segment", schema:S_MIL, q:{
 1:[ {g:()=>{ const d=2*ri(2,9); return {q:`I est le milieu de [AB] et AB = ${d} cm. Combien mesure AI (en cm) ?`, rep:String(d/2), ex:`AI = AB ÷ 2 = ${d} ÷ 2 = ${d/2} cm.`, sx:S_MIL}; }},
     {q:"Le milieu d'un segment le partage en…", c:["deux segments de même longueur","deux segments quelconques","trois segments égaux"], rep:"deux segments de même longueur", sx:S_MIL} ],
 2:[ {g:()=>{ const a=ri(3,12); return {q:`R est le milieu du segment [MP] et MR = ${a} cm. Combien mesure MP (en cm) ?`, rep:String(2*a), ex:`MP = 2 × MR = 2 × ${a} = ${2*a} cm.`, sx:S_MIL}; }},
     {g:()=>{ const d=2*ri(3,9)+1; return {q:`I est le milieu de [AB] et AB = ${d} cm. Combien mesure AI (en cm) ?`, rep:fr(d/2), ex:`AI = ${d} ÷ 2 = ${fr(d/2)} cm.`, sx:S_MIL}; }} ],
 3:[ {q:"Vrai ou faux : si AI = IB, alors I est forcément le milieu de [AB].", c:VF, rep:"Faux", ex:"Il faut aussi que I soit sur le segment [AB]. Un point peut être à la même distance de A et de B sans être sur [AB]."},
     {g:()=>{ const d=ri(5,15); return {q:`Pour construire le milieu d'un segment de ${d} cm, à quelle graduation de la règle place-t-on le point (en cm) ?`, rep:fr(d/2), ex:`On divise la longueur par 2 : ${d} ÷ 2 = ${fr(d/2)}.`, sx:S_MIL}; }} ]
}},
{nom:"Cercle ou disque ?", schema:S_CERC, q:{
 1:[ {q:"Tous les points situés à 3 cm d'un point O forment…", c:["le cercle de centre O et de rayon 3 cm","le disque de centre O et de rayon 3 cm","un segment de 3 cm"], rep:"le cercle de centre O et de rayon 3 cm", sx:S_CERC},
     {q:"Le centre d'un cercle appartient-il à ce cercle ?", c:["Non","Oui"], rep:"Non", ex:"Le centre est à l'intérieur : il appartient au disque, mais pas au cercle.", sx:S_CERC} ],
 2:[ {g:()=>{ const r=ri(2,6), k=pick(["in","on","out"]), d=k==="on"?r:k==="in"?fr(r-pick([0.5,1,1.5])):fr(r+pick([0.5,1,2])); return {q:`(C) est le cercle de centre O et de rayon ${r} cm, et OM = ${d} cm. Le point M appartient-il au cercle (C) ?`, c:["Oui","Non"], rep:k==="on"?"Oui":"Non", ex:k==="on"?`OM = ${r} cm = le rayon.`:`OM n'est pas égal au rayon (${r} cm).`, sx:S_POS}; }},
     {g:()=>{ const r=ri(2,6), k=pick(["in","on","out"]), d=k==="on"?r:k==="in"?fr(r-pick([0.5,1,1.5])):fr(r+pick([0.5,1,2])); return {q:`(D) est le disque de centre O et de rayon ${r} cm, et OM = ${d} cm. Le point M appartient-il au disque (D) ?`, c:["Oui","Non"], rep:k==="out"?"Non":"Oui", ex:k==="out"?`OM > ${r} cm : M est à l'extérieur.`:`OM ≤ ${r} cm : M est sur le cercle ou à l'intérieur, donc dans le disque.`, sx:S_POS}; }} ],
 3:[ {q:"Un point du cercle appartient-il au disque de même centre et de même rayon ?", c:["Oui","Non"], rep:"Oui", ex:"Le disque est formé des points du cercle et de l'intérieur.", sx:S_CERC},
     {g:()=>{ const r=ri(2,6); return {q:`(C) est le cercle de centre O et de rayon ${r} cm. A est à l'extérieur du cercle. Complète : OA … ${r} cm`, c:["&gt;","&lt;","="], rep:"&gt;", ex:"À l'extérieur, on est plus loin du centre que le rayon.", sx:S_POS}; }} ]
}},
{nom:"Vocabulaire du cercle", schema:S_VOC, q:{
 1:[ {q:"Sur cette figure, [OA] est…", fig:VOC, c:["un rayon","un diamètre","une corde"], rep:"un rayon", ex:"Il joint le centre O à un point du cercle.", sx:S_VOC},
     {q:"Sur cette figure, [MN] est…", fig:VOC, c:["une corde","un rayon","un diamètre"], rep:"une corde", ex:"Ses deux extrémités sont sur le cercle, mais il ne passe pas par le centre.", sx:S_VOC} ],
 2:[ {q:"Sur cette figure, [EF] est…", fig:VOC, c:["un diamètre","un rayon","un arc"], rep:"un diamètre", ex:"C'est une corde qui passe par le centre.", sx:S_VOC},
     {q:"Un diamètre est…", c:["une corde qui passe par le centre","un segment qui joint le centre à un point du cercle","une portion de cercle"], rep:"une corde qui passe par le centre", sx:S_VOC} ],
 3:[ {q:"Vrai ou faux : un rayon est une corde.", c:VF, rep:"Faux", ex:"Une corde a ses deux extrémités sur le cercle ; un rayon a une extrémité au centre.", sx:S_VOC},
     {q:"Vrai ou faux : un diamètre est une corde.", c:VF, rep:"Vrai", ex:"C'est une corde particulière : elle passe par le centre.", sx:S_VOC} ]
}},
{nom:"Rayon et diamètre", schema:S_RD, q:{
 1:[ {g:()=>{ const r=ri(2,12); return {q:`Un cercle a pour rayon ${r} cm. Quel est son diamètre (en cm) ?`, rep:String(2*r), ex:`diamètre = 2 × rayon = 2 × ${r} = ${2*r} cm.`, sx:S_RD}; }},
     {g:()=>{ const r=ri(2,12); return {q:`Un cercle a pour diamètre ${2*r} cm. Quel est son rayon (en cm) ?`, rep:String(r), ex:`rayon = diamètre ÷ 2 = ${2*r} ÷ 2 = ${r} cm.`, sx:S_RD}; }} ],
 2:[ {g:()=>{ const d=2*ri(2,9)+1; return {q:`Un cercle a pour diamètre ${d} cm. Quel est son rayon (en cm) ?`, rep:fr(d/2), ex:`${d} ÷ 2 = ${fr(d/2)} cm.`, sx:S_RD}; }},
     {g:()=>{ const r=ri(11,49)/10; return {q:`Un cercle a pour rayon ${fr(r)} cm. Quel est son diamètre (en cm) ?`, rep:fr(2*r), ex:`2 × ${fr(r)} = ${fr(2*r)} cm.`, sx:S_RD}; }} ],
 3:[ {g:()=>{ const r=ri(3,9); return {q:`Pour tracer un cercle de diamètre ${2*r} cm, de combien faut-il écarter le compas (en cm) ?`, rep:String(r), ex:`On écarte le compas de la longueur du rayon : ${2*r} ÷ 2 = ${r} cm.`, sx:S_RD}; }} ]
}},
{nom:"Utiliser le cercle pour calculer", schema:S_RED, q:{
 1:[ {g:()=>{ const r=ri(2,9); return {q:`M appartient au cercle de centre O et de rayon ${r} cm. Combien mesure OM (en cm) ?`, rep:String(r), ex:`M est sur le cercle, donc OM = rayon = ${r} cm.`, sx:S_RED}; }} ],
 2:[ {g:()=>{ const r=ri(2,6), t=r+ri(1,5); return {q:`Le cercle de centre T et de rayon ${r} cm coupe le segment [TF] en M, et TF = ${t} cm. Combien mesure MF (en cm) ?`, rep:String(t-r), ex:`TM = ${r} cm (M est sur le cercle), donc MF = TF − TM = ${t} − ${r} = ${t-r} cm.`, sx:S_RED}; }} ],
 3:[ {g:()=>{ const r=ri(2,5), t=r+ri(3,7); return {q:`T, R, A et C sont alignés dans cet ordre. R et C sont sur le cercle de centre A et de rayon ${r} cm, et TA = ${t} cm. Combien mesure TC (en cm) ?`, fig:segFig({w:380, pts:[["T",0],["R",(t-r)/(t+r)],["A",t/(t+r)],["C",1]], lens:[[0,2,t+" cm",1]]}), rep:String(t+r), ex:`AC = ${r} cm (C est sur le cercle), donc TC = TA + AC = ${t} + ${r} = ${t+r} cm.`, sx:S_RED}; }},
     {g:()=>{ const a=ri(3,6), b=ri(2,a-1); return {q:`Deux cercles se coupent en C : le cercle de centre A et de rayon ${a} cm, et le cercle de centre B et de rayon ${b} cm. Combien mesure BC (en cm) ?`, rep:String(b), ex:`C est sur le cercle de centre B et de rayon ${b} cm, donc BC = ${b} cm.`, sx:S_RED}; }} ]
}}
],

/* ===================== ÉVAL D'ENTRAÎNEMENT (+ version aménagée pour les élèves à besoins particuliers) ===================== */
eval:(()=>{
/* figures en vraie grandeur sur le sujet imprimé : 1 cm = 37,8 px (PDF de 182 mm pour 688 px) */
const CM=37.8, f1=x=>(+x).toFixed(1);
const T=(x,y,t,st="")=>`<text x="${f1(x)}" y="${f1(y)}" style="font-size:16px;font-weight:600;${st}">${t}</text>`;
const L_=(a,b,st="")=>`<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" class="ln"${st?` style="${st}"`:""}/>`;
const tk=(x,y)=>L_([x,y-7],[x,y+7]);
const cod=(x,y)=>`<line x1="${f1(x-3)}" y1="${f1(y+6)}" x2="${f1(x+3)}" y2="${f1(y-6)}" style="stroke:${RED};stroke-width:2"/>`;
const sv=(W,H,lab,body)=>`<svg class="fig" viewBox="0 0 ${f1(W)} ${H}" width="${f1(W)}" role="img" aria-label="${lab}">${body}</svg>`;
/* exercice 2 : le segment [RS], la demi-droite [Ox), la droite (d) et le point M */
const segRS = L => sv(L*CM+60,60,`Le segment [RS] (${String(L).replace(".",",")} cm sur le sujet imprimé)`, L_([30,36],[30+L*CM,36])+tk(30,36)+tk(30+L*CM,36)+T(24,22,"R")+T(24+L*CM,22,"S"));
const ray = (L,c) => { const x=30+L*CM, xm=30+L*CM/2, R=L*CM, a=0.2;
  return sv(410,70,c?"La demi-droite [Ox), le point P tel que OP = RS et le milieu K de [OP]":"La demi-droite [Ox)", L_([30,40],[400,40])+tk(30,40)+T(24,26,"O")+T(392,26,"x","font-style:italic;font-weight:400")
   +(c?`<path d="M${f1(30+R*Math.cos(a))} ${f1(40-R*Math.sin(a))} A${f1(R)} ${f1(R)} 0 0 1 ${f1(30+R*Math.cos(a))} ${f1(40+R*Math.sin(a))}" class="cons"/>${cross(x,40,"ln")}${T(x-5,26,"P",`fill:${BLUE}`)}${cross(xm,40,"ln")}${T(xm-5,26,"K",`fill:${BLUE}`)}${cod((30+xm)/2,40)}${cod((xm+x)/2,40)}`:"")); };
const dM = (dist,c) => { const A=[10,190], B=[410,110], u=[(B[0]-A[0])/Math.hypot(400,80),(B[1]-A[1])/Math.hypot(400,80)], nn=[u[1],-u[0]], F=[A[0]+u[0]*192,A[1]+u[1]*192], M=[F[0]+nn[0]*dist*CM,F[1]+nn[1]*dist*CM], q=10;
  const s1=[F[0]-u[0]*q,F[1]-u[1]*q], s2=[s1[0]+nn[0]*q,s1[1]+nn[1]*q], s3=[F[0]+nn[0]*q,F[1]+nn[1]*q];
  return sv(420,200,c?"La distance du point M à la droite (d) : le segment perpendiculaire à (d)":"La droite (d) et le point M", L_(A,B)+T(392,98,"(d)","font-weight:400")+cross(M[0],M[1],"ln")+T(M[0]+10,M[1]+6,"M")
   +(c?L_(M,F,`stroke:${BLUE};stroke-width:2.6`)+`<path d="M${f1(s1[0])} ${f1(s1[1])} L${f1(s2[0])} ${f1(s2[1])} L${f1(s3[0])} ${f1(s3[1])}" style="fill:none;stroke:${BLUE};stroke-width:1.5"/>`+cross(F[0],F[1],"ln")+T(F[0]+4,F[1]+22,"H",`fill:${BLUE}`):"")); };
/* exercice 1 : correction réduite (1 cm = 30 px) */
const prog = (()=>{ const k=30, y=115, E=[85,y], O=[85+3*k,y], F=[85+6*k,y], a=115*Math.PI/180, G=[O[0]+3*k*Math.cos(a),y-3*k*Math.sin(a)], L=[85+2*k,y];
  return sv(290,235,"Correction réduite : [EF] de milieu O, le cercle (C) de diamètre [EF], le rayon [OG], la corde [FG], le cercle de centre E et de rayon 2 cm qui coupe [EF] en L",
   `<circle cx="${O[0]}" cy="${y}" r="${3*k}" style="fill:none;stroke:${BLUE};stroke-width:2"/><circle cx="${E[0]}" cy="${y}" r="${2*k}" style="fill:none;stroke:${GREEN};stroke-width:2"/>`
   +L_(E,F)+L_(O,G,`stroke:${ORANGE};stroke-width:2.4`)+L_(F,G,`stroke:${RED};stroke-width:2.4`)+cod(E[0]+45,y)+cod(O[0]+45,y)
   +[[E,"E",-16,-8],[O,"O",-5,22],[F,"F",6,-8],[G,"G",-6,-10],[L,"L",-4,22]].map(([P,n,dx,dy])=>cross(P[0],P[1],"ln")+T(P[0]+dx,P[1]+dy,n)).join("")
   +T(222,226,"(C)",`fill:${BLUE}`)+T(4,226,"cercle de centre E",`fill:${GREEN};font-size:13px;font-weight:400`)); })();
/* exercice 4 : deux cercles le long de [OP] (pas en vraie grandeur) */
const cercles = (r1,r2,op) => { const k=22, y=105, O=[24+r1*k,y], P=[O[0]+op*k,y], M=[O[0]+r1*k,y], N=[P[0]-r2*k,y];
  return sv(P[0]+r2*k+24,215,`Le cercle (C₁) de centre O, le cercle (C₂) de centre P, le segment [OP] qui coupe (C₁) en M et (C₂) en N`,
   `<circle cx="${O[0]}" cy="${y}" r="${r1*k}" style="fill:none;stroke:var(--ink);stroke-width:2"/><circle cx="${P[0]}" cy="${y}" r="${r2*k}" style="fill:none;stroke:var(--ink);stroke-width:2"/>`+L_(O,P)
   +[[O,"O"],[M,"M"],[N,"N"],[P,"P"]].map(([Q,n])=>cross(Q[0],Q[1],"ln")+T(Q[0]-5,Q[1]-12,n)).join("")+T(O[0]-r1*k*0.95,205,"(C₁)","font-weight:400")+T(P[0]+r2*k*0.4,y+r2*k+24,"(C₂)","font-weight:400")); };
/* exercice 3 : figure du vocabulaire */
const voc = circFig({r:72, w:260, pts:[["K",0,0],["A",200,1],["B",20,1],["C",110,1],["D",-40,0.55],["E",-25,1.35]], segs:[["A","B"],["K","C"],["B","C"]], alt:"Cercle de centre K : le segment [AB] passe par K, les segments [KC] et [BC], le point D à l'intérieur, le point E à l'extérieur"});
const malo = circFig({r:62, w:230, pts:[["O",0,0],["A",180,1],["B",0,1],["C",125,1],["D",55,1]], segs:[["A","B",BLUE],["C","D",RED]], alt:"Un diamètre [AB] et une corde [CD] plus courte"});
const VF = (h,ok,why) => `${h} : <b>${ok?"vrai":"faux"}</b>${why?" ("+why+")":""}`;
const exos = (B) => [
{t:"Un programme à suivre", p:4, h:(B?`<div class="retenir" data-l="Je me souviens"><p>Le cercle de diamètre [EF] a pour centre le milieu de [EF]. Son rayon est la moitié de EF.</p></div><p>Suis ce programme au crayon à papier, sans effacer les traits de construction.</p>
  <p>1) Trace un segment [EF] de 6 cm.</p><p>2) Place son milieu O (à 3 cm de E), avec le codage.</p><p>3) Trace le cercle (C) de diamètre [EF].</p><p class="note"><b>Aide :</b> pique le compas en O, avec un écartement de 3 cm.</p><p>4) Place un point G sur le cercle (C). Trace le segment [OG] et le segment [FG].</p><p>5) Trace le cercle de centre E et de rayon 2 cm. Il coupe le segment [EF] : appelle L ce point.</p>`
  :`<p>Suis ce programme au crayon à papier, sans effacer les traits de construction.</p><p>1) Trace un segment [EF] de 6 cm. Place son milieu O, avec le codage. 2) Trace le cercle (C) de diamètre [EF]. 3) Place un point G sur (C). Trace le rayon [OG] et la corde [FG]. 4) Trace le cercle de centre E et de rayon 2 cm. Il coupe le segment [EF] en un point : nomme-le L.</p>`),
 c:`<p>Voici la figure, réduite :</p>${prog}
  <p>O est le milieu de [EF], donc OE = OF = 6 ÷ 2 = 3 cm. Le cercle de diamètre [EF] a pour centre O et pour rayon 3 cm. G peut être placé n'importe où sur (C). L est sur [EF], à 2 cm de E.</p>
  <p><i>${B?"1) 0,5 point · 2) 0,5 point · 3) 1 point · 4) 1 point · 5) 1 point":"1 point par étape"}</i></p>`},
{t:"Règle, compas et équerre", p:5, h:`<p class="note"><b>Sur le sujet imprimé</b>, les figures de cet exercice sont en vraie grandeur.</p>${B?`<div class="retenir" data-l="Je me souviens"><p>Le milieu d'un segment le partage en deux segments de même longueur. La distance d'un point à une droite se mesure sur le segment perpendiculaire à la droite.</p></div>`:""}
  ${segRS(B?4:5)}${ray(B?4:5,0)}${dM(B?2:3,0)}
  <p>1) Quelle est la longueur RS ? Mesure-la avec ta règle graduée.</p><p>2) Sans utiliser la graduation de la règle, place sur [Ox) le point P tel que OP = RS. Laisse les traces de compas.</p>${B?`<p class="note"><b>Aide :</b> pique le compas en R et écarte-le jusqu'à S. Sans changer l'écartement, pique en O.</p>`:""}
  <p>3) Construis le point K, milieu de [OP]. N'oublie pas le codage.</p><p>4) Calcule OK (ne mesure pas).</p>
  <p>5) À quelle distance de la droite (d) se trouve le point M ? Trace en couleur le segment qui le montre, puis mesure-le.</p>${B?`<p class="note"><b>Aide :</b> utilise ton équerre. Pose un côté de l'angle droit sur (d), l'autre côté doit passer par M.</p>`:""}`,
 c:`<p>1) RS = <b>${B?4:5} cm</b> (sur le sujet imprimé). <i>(0,5 point)</i></p>
  <p>2) J'écarte le compas de R à S, je pique en O et je trace un arc qui coupe [Ox) en P : OP = RS = ${B?4:5} cm. <i>(1 point)</i></p>${ray(B?4:5,1)}
  <p>3) K est à ${B?2:"2,5"} cm de O, et je code [OK] et [KP] avec le même petit trait. <i>(1 point)</i></p>
  <p>4) K est le milieu de [OP], donc :</p><p class="calc">OK = OP ÷ 2 = ${B?4:5} ÷ 2 = ${B?2:"2,5"} cm</p><p><i>(1 point)</i></p>
  <p>5) Avec l'équerre, je trace le segment [MH] perpendiculaire à (d) (H est sur (d)). La distance du point M à la droite (d) est MH = <b>${B?2:3} cm</b>. <i>(1 point pour le tracé perpendiculaire, 0,5 point pour la mesure)</i></p>${dM(B?2:3,1)}`},
{t:"Vrai ou faux ?", p:5, h:`${B?`<div class="retenir" data-l="Je me souviens"><p>Un rayon va du centre à un point du cercle. Une corde relie deux points du cercle. Un diamètre est une corde qui passe par le centre. Le disque, c'est le cercle et tout son intérieur.</p></div>`:""}${voc}
  <p>Sur la figure, K est le centre du cercle, et [AB] passe par K. La figure n'est pas en vraie grandeur.</p>
  <p>1) Vrai ou faux ?</p><p>a) [KC] est un rayon du cercle. b) [BC] est un diamètre du cercle. c) [AB] est une corde du cercle. d) Le point D appartient au cercle. e) Le point D appartient au disque. f) Le centre K appartient au cercle. g) KD est plus petit que le rayon. h) KE est égal au rayon.</p>
  ${B?`<p class="note"><b>Aide :</b> pour g) et h), regarde si le point est à l'intérieur du cercle, sur le cercle ou à l'extérieur.</p><p>2) Le rayon du cercle mesure 2 cm. Complète : KA = …… cm et AB = 2 × …… = …… cm.</p>`
   :`<p>2) Le rayon du cercle mesure 2 cm. Sans mesurer, donne KA et AB.</p>`}`,
 c:`<p>1) ${VF("a) [KC]",1,"il va du centre K à un point C du cercle")} · ${VF("b) [BC]",0,"il ne passe pas par le centre : c'est une corde")} · ${VF("c) [AB]",1,"A et B sont sur le cercle ; un diamètre est une corde qui passe par le centre")} · ${VF("d) D sur le cercle",0,"D est à l'intérieur")} · ${VF("e) D dans le disque",1,"")} · ${VF("f) K sur le cercle",0,"le centre appartient au disque, mais pas au cercle")} · ${VF("g) KD plus petit que le rayon",1,"D est à l'intérieur du cercle")} · ${VF("h) KE égal au rayon",0,"E est à l'extérieur, donc KE est plus grand que le rayon")}</p><p><i>(0,5 point par réponse)</i></p>
  <p>2) A est sur le cercle, donc KA = <b>2 cm</b>. [AB] est un diamètre, donc AB = 2 × 2 = <b>4 cm</b>. <i>(0,5 point chacun)</i></p>
  `},
{t:"Deux cercles sur une ligne", p:4, h:`<p>Deux cercles sont tracés le long du segment [OP], qui mesure ${B?8:9} cm.</p><p>Le premier, (C₁), a pour centre O et pour rayon ${B?3:4} cm. Le second, (C₂), a pour centre P et pour rayon 2 cm.</p><p>Le segment [OP] coupe (C₁) en M et (C₂) en N.</p>
  ${cercles(B?3:4,2,B?8:9)}<p><i>La figure n'est pas en vraie grandeur.</i></p>
  ${B?`<p>1) Complète : M est sur le cercle (C₁), donc OM = …… cm.</p><p>2) Complète : MP = OP − OM = …… − …… = …… cm.</p><p>3) Calcule MN.</p><p class="note"><b>Aide :</b> N est sur le cercle (C₂), donc PN = 2 cm. Et MN = MP − PN.</p><p>4) Quelle est la longueur d'un diamètre de (C₁) ?</p><p class="note"><b>Aide :</b> diamètre = 2 × rayon.</p>`
   :`<p>1) Quelle est la longueur OM ? Pourquoi ? 2) Déduis-en la longueur MP. 3) Calcule MN. 4) Combien mesure un diamètre de (C₁) ?</p>`}`,
 c:`<p>1) M appartient au cercle (C₁) de centre O et de rayon ${B?3:4} cm, donc OM = <b>${B?3:4} cm</b>. <i>(1 point)</i></p>
  <p>2) M est sur le segment [OP], donc :</p><p class="calc">MP = OP − OM = ${B?8:9} − ${B?3:4} = 5 cm</p><p><i>(1 point)</i></p>
  <p>3) N appartient au cercle (C₂) de centre P et de rayon 2 cm, donc PN = 2 cm. N est entre M et P :</p><p class="calc">MN = MP − PN = 5 − 2 = 3 cm</p><p><i>(1 point)</i></p>
  <p>4) Un diamètre mesure deux fois le rayon :</p><p class="calc">diamètre de (C₁) = 2 × ${B?3:4} = ${B?6:8} cm</p><p><i>(1 point)</i></p>`},
{t:"Malo a-t-il raison ?", p:2, h:`<p>Malo affirme : «&nbsp;Dans un cercle de rayon 3 cm, toutes les cordes mesurent 6 cm.&nbsp;»</p>${B?`<p>Entoure : Malo a raison · Malo a tort. Explique pourquoi.</p><p class="note"><b>Aide :</b> trace un cercle de rayon 3 cm, un diamètre et une autre corde, puis mesure-les.</p>`:`<p>Est-ce vrai ? Explique pourquoi, en t'aidant d'un dessin si tu veux.</p>`}`,
 c:`<p>Malo a tort. Seules les cordes qui passent par le centre, c'est-à-dire les diamètres, mesurent 2 × 3 = 6 cm. Une corde qui ne passe pas par le centre est plus courte. <i>(1 point pour la réponse avec le diamètre, 1 point pour l'exemple d'une corde plus courte)</i></p>${malo}<p>[AB] est un diamètre : AB = 6 cm. [CD] est une corde plus courte.</p>`}
];
const comp = [
  ["REPRÉSENTER","Je construis une figure avec la règle et le compas ; je mesure et je reporte une longueur ; je trace la distance d'un point à une droite.","Ex. 1 et 2 (9 points)"],
  ["RAISONNER","Je reconnais rayon, corde et diamètre, et je décide si un point est sur le cercle ou dans le disque.","Ex. 3 (5 points)"],
  ["CALCULER","Je calcule une longueur avec un rayon ou un diamètre, et je justifie.","Ex. 4 (4 points)"],
  ["COMMUNIQUER","Je rédige une explication claire.","Ex. 5 (2 points)"]
];
return {
titre:"Évaluation d'entraînement — Chapitre 4", duree:50, info:"Durée : 50 min · Matériel : règle graduée, équerre, compas, crayon à papier · Calculatrice non autorisée",
comp, exos:exos(0),
/* ---------- version aménagée (tiers-temps) : le même sujet, environ un quart des questions en moins ---------- */
bep:{titre:"Évaluation d'entraînement — Chapitre 4 · version aménagée", duree:50, info:"Version aménagée (tiers-temps) · Durée : 50 min · Matériel : règle graduée, équerre, compas, crayon à papier · Calculatrice non autorisée",
  note:"Le même sujet avec 5 questions en moins, à faire dans le même temps. Le total reste sur 20 points.",
  comp, exos:[
{t:"Un programme à suivre", p:4, h:`<p>Suis ce programme au crayon à papier, sans effacer les traits de construction.</p><p>1) Trace un segment [EF] de 6 cm. Place son milieu O, avec le codage. 2) Trace le cercle (C) de diamètre [EF]. 3) Place un point G sur (C). Trace le rayon [OG] et la corde [FG]. 4) Trace le cercle de centre E et de rayon 2 cm. Il coupe le segment [EF] en un point : nomme-le L.</p>`,
 c:`<p>Voici la figure, réduite :</p>${prog}
  <p>O est le milieu de [EF], donc OE = OF = 6 ÷ 2 = 3 cm. Le cercle de diamètre [EF] a pour centre O et pour rayon 3 cm. G peut être placé n'importe où sur (C). L est sur [EF], à 2 cm de E.</p>
  <p><i>1 point par étape</i></p>`},
{t:"Règle, compas et équerre", p:5, h:`<p class="note"><b>Sur le sujet imprimé</b>, les figures de cet exercice sont en vraie grandeur.</p>
  ${segRS(5)}${ray(5,0)}${dM(3,0)}
  <p>1) Quelle est la longueur RS ? Mesure-la avec ta règle graduée.</p><p>2) Sans utiliser la graduation de la règle, place sur [Ox) le point P tel que OP = RS. Laisse les traces de compas.</p>
  <p>3) Construis le point K, milieu de [OP]. N'oublie pas le codage.</p>
  <p>4) À quelle distance de la droite (d) se trouve le point M ? Trace en couleur le segment qui le montre, puis mesure-le.</p>`,
 c:`<p>1) RS = <b>5 cm</b> (sur le sujet imprimé). <i>(0,5 point)</i></p>
  <p>2) J'écarte le compas de R à S, je pique en O et je trace un arc qui coupe [Ox) en P : OP = RS = 5 cm. <i>(1 point)</i></p>${ray(5,1)}
  <p>3) K est à 2,5 cm de O, et je code [OK] et [KP] avec le même petit trait. <i>(1,5 point)</i></p>
  <p>4) Avec l'équerre, je trace le segment [MH] perpendiculaire à (d) (H est sur (d)). La distance du point M à la droite (d) est MH = <b>3 cm</b>. <i>(1,5 point pour le tracé perpendiculaire, 0,5 point pour la mesure)</i></p>${dM(3,1)}`},
{t:"Vrai ou faux ?", p:5, h:`${voc}
  <p>Sur la figure, K est le centre du cercle, et [AB] passe par K. La figure n'est pas en vraie grandeur.</p>
  <p>1) Vrai ou faux ?</p><p>a) [KC] est un rayon du cercle. b) [BC] est un diamètre du cercle. c) Le point D appartient au cercle. d) Le point D appartient au disque. e) KE est égal au rayon.</p>
  <p>2) Le rayon du cercle mesure 2 cm. Sans mesurer, donne KA et AB.</p>`,
 c:`<p>1) ${VF("a) [KC]",1,"il va du centre K à un point C du cercle")} · ${VF("b) [BC]",0,"il ne passe pas par le centre : c'est une corde")} · ${VF("c) D sur le cercle",0,"D est à l'intérieur")} · ${VF("d) D dans le disque",1,"")} · ${VF("e) KE égal au rayon",0,"E est à l'extérieur, donc KE est plus grand que le rayon")}</p><p><i>(0,5 point par réponse)</i></p>
  <p>2) A est sur le cercle, donc KA = <b>2 cm</b>. [AB] est un diamètre, donc AB = 2 × 2 = <b>4 cm</b>. <i>(1 point pour KA, 1,5 point pour AB)</i></p>`},
{t:"Deux cercles sur une ligne", p:4, h:`<p>Deux cercles sont tracés le long du segment [OP], qui mesure 9 cm.</p><p>Le premier, (C₁), a pour centre O et pour rayon 4 cm. Le second, (C₂), a pour centre P et pour rayon 2 cm.</p><p>Le segment [OP] coupe (C₁) en M et (C₂) en N.</p>
  ${cercles(4,2,9)}<p><i>La figure n'est pas en vraie grandeur.</i></p>
  <p>1) Quelle est la longueur OM ? Pourquoi ? 2) Déduis-en la longueur MP. 3) Calcule MN.</p>`,
 c:`<p>1) M appartient au cercle (C₁) de centre O et de rayon 4 cm, donc OM = <b>4 cm</b>. <i>(1 point)</i></p>
  <p>2) M est sur le segment [OP], donc :</p><p class="calc">MP = OP − OM = 9 − 4 = 5 cm</p><p><i>(1,5 point)</i></p>
  <p>3) N appartient au cercle (C₂) de centre P et de rayon 2 cm, donc PN = 2 cm. N est entre M et P :</p><p class="calc">MN = MP − PN = 5 − 2 = 3 cm</p><p><i>(1,5 point)</i></p>`},
{t:"Malo a-t-il raison ?", p:2, h:`<p>Malo affirme : «&nbsp;Dans un cercle de rayon 3 cm, toutes les cordes mesurent 6 cm.&nbsp;»</p><p>Est-ce vrai ? Explique pourquoi, en t'aidant d'un dessin si tu veux.</p>`,
 c:`<p>Malo a tort. Seules les cordes qui passent par le centre, c'est-à-dire les diamètres, mesurent 2 × 3 = 6 cm. Une corde qui ne passe pas par le centre est plus courte. <i>(1 point pour la réponse avec le diamètre, 1 point pour l'exemple d'une corde plus courte)</i></p>${malo}<p>[AB] est un diamètre : AB = 6 cm. [CD] est une corde plus courte.</p>`}
]}
};
})()
};
})();
