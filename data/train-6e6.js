/* 6e · chapitre 6 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres données */
TRAIN["6e-6"] = function(){
const {ri, pick, shuf, items} = TR;
const {triSVG, byLen, rect} = window.FIG6;
const fr = x => String(Math.round(x*100)/100).replace(".",",");
const LET = "ABCDEFGHIJKLMNOPRSTUVWZ".split("");
const noms = n => shuf(LET).slice(0,n);
const BLUE="#1e5aa8";

/* ---------- A. Médiatrice ---------- */
const cas = shuf([[1,1],[1,0],[0,1],[0,0]]);       /* [perpendiculaire, passe par le milieu] */
const casFig = ([perp,mil],i) => { const x0=0, x1=4, xm=mil?2:1.3, s=perp?0:1.2;
  return triSVG({M:[x0,2],N:[x1,2]},{k:30, poly:["M","N"], bb:[0,0.2,4,3.8], ticks:mil?[["M","N",0]]:[], alt:`Cas ${i+1}`}).replace("</svg>",
   `<line x1="${(xm-s+1)*30}" y1="${(0.3+1-0.2)*30}" x2="${(xm+s+1)*30}" y2="${(3.7+1-0.2)*30}" style="stroke:${BLUE};stroke-width:2"/>`+
   (mil?`<line x1="${(1+1)*30}" y1="${(2+1-0.2)*30-7}" x2="${(1+1)*30}" y2="${(2+1-0.2)*30+7}" style="stroke:#d0342c;stroke-width:2"/><line x1="${(3+1)*30}" y1="${(2+1-0.2)*30-7}" x2="${(3+1)*30}" y2="${(2+1-0.2)*30+7}" style="stroke:#d0342c;stroke-width:2"/>`:"")+
   (perp?`<path d="M${(xm+1)*30} ${(2+1-0.2)*30-10} h10 v10" style="fill:none;stroke:#d0342c;stroke-width:1.6"/>`:"")+`<text x="${(xm+s+1)*30+6}" y="${(0.6+1-0.2)*30}" style="font-size:13px;fill:${BLUE};font-weight:600">(m)</text></svg>`); };
const e2 = [0,1,2].map(()=>{ const [P,A,B]=noms(3), a=ri(3,8)+pick([0,0.5]), b=pick([a,a,a+1,a-0.5]); return {P,A,B,a,b}; });
const b3=ri(3,12), d3=ri(5,15);
const [S3,B3,W3]=noms(3), [E3,F3,I3]=noms(3);
const secA = {t:"La médiatrice d'un segment", e:[
  {n:"Exercice 1", t:"Est-ce bien la médiatrice ?", w:"Sur ton cahier", h:`<p>Dans chaque cas, la droite (m) est-elle la médiatrice du segment [MN] ? Justifie.</p><div class="cgrid">${cas.map((c,i)=>`<figure><figcaption>Cas ${i+1}</figcaption>${casFig(c,i)}</figure>`).join("")}</div>`,
   c:cas.map(([p,m],i)=>`<p><b>Cas ${i+1} : ${p&&m?"oui":"non"}.</b> ${p&&m?"(m) est perpendiculaire à [MN] et passe par son milieu.":p?"(m) est perpendiculaire à [MN] mais ne passe pas par son milieu.":m?"(m) passe par le milieu de [MN] mais n'est pas perpendiculaire à [MN].":"(m) n'est ni perpendiculaire à [MN], ni codée au milieu."}</p>`).join("")},
  {n:"Exercice 2", t:"Ces points sont-ils sur la médiatrice ?", w:"Sur ton cahier", h:`<p>Justifie chaque réponse à l'aide de la propriété.</p><p>${items(e2.map(({P,A,B,a,b})=>`${P}${A} = ${fr(a)} cm et ${P}${B} = ${fr(b)} cm. Le point ${P} est-il sur la médiatrice de [${A}${B}] ?`),"<br>",true)}</p>`,
   c:items(e2.map(({P,A,B,a,b})=> a===b?`${P}${A} = ${P}${B} = ${fr(a)} cm : ${P} est équidistant de ${A} et de ${B}, donc <b>${P} appartient à la médiatrice de [${A}${B}]</b>.`:`${P}${A} ≠ ${P}${B} : ${P} n'est pas équidistant de ${A} et de ${B}, donc <b>${P} n'appartient pas à la médiatrice de [${A}${B}]</b>.`),"<br>",true)},
  {n:"Exercice 3", t:"Calculer une longueur", w:"Sur ton cahier", h:`<p>1) d est la médiatrice du segment [${B3}${W3}]. Le point ${S3} appartient à d et ${S3}${B3} = ${b3} cm. Combien mesure [${S3}${W3}] ? Justifie.</p><p>2) La médiatrice de [${E3}${F3}] coupe [${E3}${F3}] au point ${I3}, et ${E3}${F3} = ${d3} cm. Combien mesure [${E3}${I3}] ? Justifie.</p>`,
   c:`<p>1) ${S3} appartient à la médiatrice de [${B3}${W3}], donc ${S3} est équidistant de ${B3} et de ${W3} : <b>${S3}${W3} = ${S3}${B3} = ${b3} cm</b>.</p><p>2) La médiatrice passe par le milieu de [${E3}${F3}] : ${I3} est le milieu, donc <b>${E3}${I3} = ${d3} ÷ 2 = ${fr(d3/2)} cm</b>.</p>`}
]};

/* ---------- B. Triangles ---------- */
const types = shuf([["isocèle",(a)=>[a,a,a+pick([-1,1,2])]],["équilatéral",(a)=>[a,a,a]],["quelconque",(a)=>[a,a+2,a+3]],["rectangle",null]]);
const t4 = types.map(([nat,f])=>{ const a=ri(3,6); return nat==="rectangle" ? {nat, txt:`un triangle qui a un angle droit`} : {nat, txt:`un triangle dont les côtés mesurent ${f(a).join(" cm, ")} cm`}; });
const [L5,E5,A5,N5,O5,F5,B5,L5b,E5b]=noms(9), le=ri(4,7), ea=pick([3,4,5,6,7,8].filter(x=>x!==le && x<2*le)), no=ri(3,5), oe=no+ri(2,4), bl=ri(30,55)/10;
const [T7,E7,O7,S7,T7b,U7,M7,O7b,V7,P7,I7,C7]=noms(12); let s7; do{ s7=[ri(30,55)/10, ri(30,55)/10, ri(40,60)/10]; }while(s7[0]+s7[1]<=s7[2]+0.5);
const su=ri(25,40)/10, tu=ri(30,50)/10, mo=ri(4,6), pc=ri(4,6), ic=ri(2,3);
const secB = {t:"Les triangles", e:[
  {n:"Activité 4", t:"Reconnaître la nature d'un triangle", w:"Sur ton cahier", h:`<p>Donne la nature de chaque triangle : ${items(t4.map(x=>x.txt),"<br>",true)}</p>`, c:items(t4.map(x=>x.nat),"  ·  ",true)},
  {n:"Exercice 5", t:"Faire un dessin à main levée", w:"Sur ton cahier", h:`<p>Fais le dessin à main levée de chaque triangle (lettres, longueurs, codage).</p><p>1) Le triangle ${L5}${E5}${A5} isocèle en ${L5}, tel que ${L5}${E5} = ${le} cm et ${E5}${A5} = ${ea} cm.</p><p>2) Le triangle ${N5}${O5}${F5} rectangle en ${N5}, tel que ${O5}${F5} = ${oe} cm et ${N5}${O5} = ${no} cm.</p><p>3) Le triangle ${B5}${L5b}${E5b} équilatéral, tel que ${B5}${L5b} = ${fr(bl)} cm.</p>`,
   c:`<div class="cgrid"><figure><figcaption>1) ${L5}${E5} = ${L5}${A5} = ${le} cm</figcaption>${triSVG(byLen(E5,A5,L5,ea,le,le),{k:22,ticks:[[L5,E5,1],[L5,A5,1]],lens:[[E5,A5,ea+" cm"],[L5,E5,le+" cm"]]})}</figure>
   <figure><figcaption>2) angle droit en ${N5}</figcaption>${triSVG(rect(N5,O5,F5,no,Math.sqrt(oe*oe-no*no)),{k:20,right:[N5,O5,F5],lens:[[N5,O5,no+" cm"],[O5,F5,oe+" cm"]]})}</figure>
   <figure><figcaption>3) trois côtés de ${fr(bl)} cm</figcaption>${triSVG(byLen(B5,L5b,E5b,bl,bl,bl),{k:26,ticks:[[B5,L5b,1],[L5b,E5b,1],[E5b,B5,1]],lens:[[B5,L5b,fr(bl)+" cm"]]})}</figure></div>`},
  {n:"Exercice 7", t:"Construire à partir d'un texte", w:"Sur ton cahier", h:`<p>Fais d'abord un dessin à main levée, puis construis :</p><p>1) Le triangle ${T7}${E7}${O7} tel que ${T7}${O7} = ${fr(s7[0])} cm, ${T7}${E7} = ${fr(s7[1])} cm et ${O7}${E7} = ${fr(s7[2])} cm.</p><p>2) Le triangle ${S7}${T7b}${U7} rectangle en ${U7} tel que ${S7}${U7} = ${fr(su)} cm et ${T7b}${U7} = ${fr(tu)} cm.</p><p>3) Le triangle ${M7}${O7b}${V7} équilatéral de côté ${mo} cm.</p><p>4) Le triangle ${P7}${I7}${C7} isocèle en ${P7} tel que ${P7}${C7} = ${pc} cm et ${I7}${C7} = ${ic} cm.</p>`,
   c:`<div class="cgrid">
   <figure><figcaption>1) Je trace [${O7}${E7}] = ${fr(s7[2])} cm, puis un arc de ${fr(s7[0])} cm depuis ${O7} et un arc de ${fr(s7[1])} cm depuis ${E7}.</figcaption>${triSVG(byLen(O7,E7,T7,s7[2],s7[0],s7[1]),{k:24,lens:[[O7,E7,fr(s7[2])+" cm"],[O7,T7,fr(s7[0])+" cm"],[T7,E7,fr(s7[1])+" cm"]]})}</figure>
   <figure><figcaption>2) Angle droit en ${U7} à l'équerre, puis ${U7}${T7b} = ${fr(tu)} cm et ${U7}${S7} = ${fr(su)} cm.</figcaption>${triSVG(rect(U7,T7b,S7,tu,su),{k:24,right:[U7,T7b,S7],lens:[[U7,T7b,fr(tu)+" cm"],[U7,S7,fr(su)+" cm"]]})}</figure>
   <figure><figcaption>3) [${M7}${O7b}] = ${mo} cm, puis deux arcs de ${mo} cm.</figcaption>${triSVG(byLen(M7,O7b,V7,mo,mo,mo),{k:22,ticks:[[M7,O7b,1],[O7b,V7,1],[V7,M7,1]],lens:[[M7,O7b,mo+" cm"]]})}</figure>
   <figure><figcaption>4) ${P7}${I7} = ${P7}${C7} = ${pc} cm : [${I7}${C7}] = ${ic} cm, puis deux arcs de ${pc} cm.</figcaption>${triSVG(byLen(I7,C7,P7,ic,pc,pc),{k:22,ticks:[[P7,I7,1],[P7,C7,1]],lens:[[I7,C7,ic+" cm"],[P7,C7,pc+" cm"]]})}</figure></div><p><i>Figures réduites : vérifie les longueurs sur ta feuille avec la règle.</i></p>`}
]};

/* ---------- C. Médiatrices du triangle ---------- */
const r9=ri(3,8), [A9,B9,C9]=noms(3);
const [M10,T10,N10,I10]=noms(4);
const [a11,b11,c11]=pick([[3,4,5],[6,8,10],[4.5,6,7.5]]);
const secC = {t:"Les médiatrices d'un triangle et le cercle circonscrit", e:[
  {n:"Exercice 9", t:"Le point de concours", w:"Sur ton cahier", h:`<p>Les médiatrices du triangle ${A9}${B9}${C9} se coupent en O, et O${A9} = ${r9} cm.</p><p>1) Combien mesurent O${B9} et O${C9} ? Justifie. 2) Quel cercle peut-on tracer ? Donne son centre et son rayon.</p>`,
   c:`<p>1) O est sur la médiatrice de [${A9}${B9}], donc O${A9} = O${B9} ; O est sur la médiatrice de [${B9}${C9}], donc O${B9} = O${C9}. Donc <b>O${B9} = O${C9} = ${r9} cm</b>.</p><p>2) Le cercle circonscrit au triangle ${A9}${B9}${C9} : <b>centre O, rayon ${r9} cm</b>. Il passe par les trois sommets.</p>`},
  {n:"Exercice 10", t:"Raisonner", w:"Sur ton cahier", h:`<p>Dans le triangle ${M10}${T10}${N10}, ${M10}${T10} = ${M10}${N10} et ${I10} est le milieu de [${T10}${N10}].</p><p>1) Que peux-tu dire de la droite (${M10}${I10}) pour le segment [${T10}${N10}] ? Justifie. 2) Que peux-tu dire des droites (${M10}${I10}) et (${T10}${N10}) ?</p>`,
   c:`<p>1) ${M10}${T10} = ${M10}${N10} : ${M10} est à la même distance de ${T10} et de ${N10}.<br>Donc ${M10} est sur la médiatrice de [${T10}${N10}].</p><p>${I10} est le milieu de [${T10}${N10}].<br>Donc ${I10} est aussi sur la médiatrice de [${T10}${N10}].</p><p>La médiatrice de [${T10}${N10}] passe par ${M10} et par ${I10}.<br>Donc <b>(${M10}${I10}) est la médiatrice de [${T10}${N10}]</b>.</p><p>2) La médiatrice de [${T10}${N10}] est perpendiculaire à [${T10}${N10}].<br>Donc <b>les droites (${M10}${I10}) et (${T10}${N10}) sont perpendiculaires</b> : (${M10}${I10}) ⊥ (${T10}${N10}).</p>`},
  {n:"Exercice 11", t:"Pour aller plus loin", w:"Sur ton cahier", h:`<p>Construis un triangle ABC rectangle en A tel que AB = ${fr(b11)} cm et AC = ${fr(a11)} cm, puis son cercle circonscrit. Où se trouve son centre ? (On sait que BC = ${fr(c11)} cm.)</p>`,
   c:`${triSVG({A:[0,a11],B:[b11,a11],C:[0,0]},{k:c11>8?16:26,right:["A","B","C"],circ:[[b11/2,a11/2],c11/2],lens:[["A","B",fr(b11)+" cm"],["A","C",fr(a11)+" cm"]]})}<p>Le centre du cercle circonscrit est <b>le milieu de [BC]</b>, le côté opposé à l'angle droit. Son rayon est ${fr(c11)} ÷ 2 = <b>${fr(c11/2)} cm</b>.</p>`}
]};
return [secA, secB, secC];
};
