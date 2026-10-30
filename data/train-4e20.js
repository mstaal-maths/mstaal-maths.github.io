/* 4e · chapitre 20 — fiche d'entraînement : les exercices de la feuille de M. Staal avec d'autres nombres (outils window.P420 de data/4e-20.js). */
TRAIN["4e-20"] = function(){
const {ri, pick, shuf} = TR;
const {rtri, pyth, rac, F, sq, r4, rnd} = window.P420;
const fig=(cap,body)=>`<figure>${body}${cap?`<figcaption>${cap}</figcaption>`:""}</figure>`;
const TRIP=[[3,4,5],[6,8,10],[5,12,13],[8,15,17],[9,12,15],[20,21,29],[12,16,20],[15,20,25],[28,45,53]];
const NOMS=shuf(["ABC","DEF","IJK","MNP","RST","UVW","EFG","KLM","GHI","PIN","RAT","LIN","TER","XYZ","OPQ"]);
const side=(a,b,nom)=>[a,b].sort((x,y)=>nom.indexOf(x)-nom.indexOf(y)).join("");
function tr(exact, i){ for(let g=0;g<300;g++){ let p,q;
    if(exact){ const [a,b]=pick(TRIP), k=pick([0.1,0.2,0.3,0.4,0.5,1,2]); [p,q]=shuf([r4(a*k),r4(b*k)]); }
    else { p=ri(2,14)+pick([0,0.5]); q=ri(2,14)+pick([0,0.5]); if(Number.isInteger(Math.sqrt(p*p+q*q)*100)) continue; }
    const n=NOMS[i%NOMS.length].split(""), r=n[ri(0,2)], [x,y]=n.filter(c=>c!==r); return {p,q,h:Math.sqrt(p*p+q*q),nom:n.join(""),r,x,y}; } }

/* ================= 1. Aires et longueurs (comme l'exercice 1) ================= */
const T1=[0,1,2].map(i=>{ const [a,b,c]=pick(TRIP.slice(0,6)); return {a,b,c,type:i}; });
const t1txt=t=>t.type===0?`Les côtés de l'angle droit mesurent ${t.a} cm et ${t.b} cm. Donne l'aire de chaque carré construit sur les côtés, puis la longueur de l'hypoténuse.`
  : t.type===1?`Un côté de l'angle droit mesure ${t.a} cm. Le carré construit sur l'autre côté de l'angle droit a pour aire ${t.b*t.b} cm². Donne l'aire du grand carré, puis la longueur de l'hypoténuse.`
  : `Un côté de l'angle droit mesure ${t.a} cm et l'hypoténuse mesure ${t.c} cm. Donne l'aire du grand carré, celle du moyen carré, puis la longueur de l'autre côté de l'angle droit.`;
const t1c=t=>t.type===0?`Aires : ${t.a} × ${t.a} = ${t.a*t.a} cm² et ${t.b} × ${t.b} = ${t.b*t.b} cm². Grand carré : ${t.a*t.a} + ${t.b*t.b} = ${t.c*t.c} cm². ${t.c} × ${t.c} = ${t.c*t.c} : l'hypoténuse mesure <b>${t.c} cm</b>.`
  : t.type===1?`Petit carré : ${t.a} × ${t.a} = ${t.a*t.a} cm². Grand carré : ${t.a*t.a} + ${t.b*t.b} = ${t.c*t.c} cm². ${t.c} × ${t.c} = ${t.c*t.c} : l'hypoténuse mesure <b>${t.c} cm</b>.`
  : `Grand carré : ${t.c} × ${t.c} = ${t.c*t.c} cm². Petit carré : ${t.a} × ${t.a} = ${t.a*t.a} cm². Moyen carré : ${t.c*t.c} − ${t.a*t.a} = ${t.b*t.b} cm². ${t.b} × ${t.b} = ${t.b*t.b} : le côté mesure <b>${t.b} cm</b>.`;

/* ================= 2. Le côté manquant ================= */
const kinds=shuf(["h","h","c","c"]);
const T2=kinds.map((k,i)=>{ const t=tr(true,i), a=side(t.r,t.x,t.nom), b=side(t.r,t.y,t.nom), h=side(t.x,t.y,t.nom);
  if(k==="h") return {t, txt:`${t.nom} est un triangle rectangle en ${t.r} tel que ${a} = ${F(t.p)} cm et ${b} = ${F(t.q)} cm. Calcule ${h}.`, fig:rtri(t.p,t.q,{R:t.r,X:t.x,Y:t.y},{RX:F(t.p)+" cm",RY:F(t.q)+" cm",XY:"?"},{w:240,flip:Math.random()<0.5}), sol:pyth(t.nom,t.r,{[a]:t.p,[b]:t.q},h).h};
  return {t, txt:`${t.nom} est un triangle rectangle en ${t.r} tel que ${a} = ${F(t.p)} cm et ${h} = ${F(r4(t.h))} cm. Calcule ${b}.`, fig:rtri(t.p,t.q,{R:t.r,X:t.x,Y:t.y},{RX:F(t.p)+" cm",RY:"?",XY:F(r4(t.h))+" cm"},{w:240,flip:Math.random()<0.5}), sol:pyth(t.nom,t.r,{[a]:t.p,[h]:r4(t.h)},b).h}; });

/* ================= 3. Problèmes ================= */
const e1=pick([[1.2,3.5],[0.9,4],[1.5,3.6],[1.8,2.4],[1.6,3]]); /* échelle : pied, hauteur */
const e2=[ri(10,30)/10, ri(30,60)/10];
const foot=[ri(90,120), ri(45,90)];
const ramp=[ri(18,40)/10, ri(3,12)/10];
const mais={H:ri(40,55)*10, h:ri(25,32)*10, L:ri(6,10)*100, P:ri(8,15)*100};
const arm=(()=>{ let a; do{ a={h:pick([140,150,180,190,200,210]), p:pick([50,55,60,65]), plaf:pick([160,200,210,220,230,240])}; }while(a.h>=a.plaf); return a; })();
const armD=Math.sqrt(arm.h*arm.h+arm.p*arm.p);

return [
 {t:"Découvrir le théorème de Pythagore", e:[
  {n:"Exercice 1", t:"Aires et longueurs", w:"Sur ton cahier", h:`<p>Pour chaque triangle rectangle, on construit les carrés sur les trois côtés. Tu n'es pas obligé d'écrire tes calculs.</p>${T1.map((t,i)=>`<p><b>Cas n°${i+1} :</b> ${t1txt(t)}</p>`).join("")}`,
   c:T1.map((t,i)=>`<p><b>Cas n°${i+1} :</b> ${t1c(t)}</p>`).join("")},
  {n:"Exercice 2", t:"Le meuble", w:"Sur ton cahier", h:`<p>Un meuble mesure ${arm.h} cm de haut et ${arm.p} cm de profondeur. On le monte couché sur le sol, puis on veut le relever dans une pièce dont le plafond est à ${F(arm.plaf/100)} m.</p><p>Va-t-on pouvoir le relever ? Explique.</p>`,
   c:`<p>Pour relever le meuble, sa diagonale doit passer sous le plafond. La hauteur, la profondeur et la diagonale forment un triangle rectangle.</p><p class="calc">diagonale² = ${arm.h}² + ${arm.p}² = ${F(arm.h*arm.h)} + ${F(arm.p*arm.p)} = ${F(arm.h*arm.h+arm.p*arm.p)}<br>diagonale = ${rac(F(arm.h*arm.h+arm.p*arm.p))} ≈ ${F(rnd(armD,1))} cm</p><p>${armD<arm.plaf?`${F(rnd(armD,1))} cm est plus petit que ${arm.plaf} cm : <b>on pourra le relever</b>.`:`${F(rnd(armD,1))} cm est plus grand que ${arm.plaf} cm : <b>on ne pourra pas le relever</b>.`}</p>`}
 ]},
 {t:"Calculer une longueur", e:[
  {n:"Exercice 3", t:"Le côté manquant", w:"Sur ton cahier", h:`<p>Calcule la longueur du côté manquant. Rédige comme dans le cours.</p>${T2.map((x,i)=>`<p><b>${"abcd"[i]}.</b> ${x.txt}</p>${x.fig}`).join("")}`,
   c:T2.map((x,i)=>`<p><b>${"abcd"[i]}.</b></p>${x.sol}`).join("")}
 ]},
 {t:"Problèmes", e:[
  {n:"Exercice 4", t:"L'échelle", w:"Sur ton cahier", h:`<p><b>a)</b> Le bas d'une échelle est situé à ${F(e1[0])} m du mur et le haut de l'échelle atteint ${F(e1[1])} m de hauteur. Combien mesure l'échelle ?</p><p><b>b)</b> Même question avec ${F(e2[0])} m et ${F(e2[1])} m. Donne un arrondi au centième.</p>`,
   c:`<p>On note H le haut de l'échelle, B son pied et C le pied du mur : le triangle HBC est rectangle en C.</p><p><b>a)</b></p>${rtri(e1[0],e1[1],{R:"C",X:"B",Y:"H"},{RX:F(e1[0])+" m",RY:F(e1[1])+" m",XY:"?"},{w:200})}${pyth("HBC","C",{BC:e1[0],HC:e1[1]},"HB","m",2).h}<p><b>b)</b></p>${rtri(e2[0],e2[1],{R:"C",X:"B",Y:"H"},{RX:F(e2[0])+" m",RY:F(e2[1])+" m",XY:"?"},{w:200})}${pyth("HBC","C",{BC:e2[0],HC:e2[1]},"HB","m",2).h}`},
  {n:"Exercice 5", t:"Échauffement de foot", w:"Sur ton cahier", h:`<p>Un terrain de football est un rectangle de ${foot[0]} m sur ${foot[1]} m. Les joueurs font un sprint sur la diagonale du terrain.</p><p>Quelle distance parcourent-ils ? <i>Donne un arrondi à l'unité près.</i></p>`,
   c:`<p>On nomme le terrain FOUT. La diagonale [FU] partage le terrain en deux triangles rectangles : FOU est rectangle en O.</p>${rtri(foot[0],foot[1],{R:"O",X:"F",Y:"U"},{RX:foot[0]+" m",RY:foot[1]+" m",XY:"?"},{w:260,flip:true})}${pyth("FOU","O",{FO:foot[0],OU:foot[1]},"FU","m",0).h}`},
  {n:"Exercice 6", t:"Rampe d'accès", w:"Sur ton cahier", h:`<p>Une rampe d'accès mesure ${F(ramp[0])} m de long et la porte d'accès est à une hauteur de ${F(ramp[1])} m.</p><p>De quelle longueur au sol doit-on disposer pour poser cette rampe ? <i>Donne un arrondi au centième près.</i></p>`,
   c:`<p>On note R le bas de la rampe, A le haut de la rampe (devant la porte) et M le point au sol sous la porte : le triangle RAM est rectangle en M et la rampe [RA] est l'hypoténuse.</p>${rtri(Math.sqrt(ramp[0]**2-ramp[1]**2),ramp[1],{R:"M",X:"R",Y:"A"},{RX:"?",RY:F(ramp[1])+" m",XY:F(ramp[0])+" m"},{w:260,flip:true})}${pyth("RAM","M",{AM:ramp[1],RA:ramp[0]},"RM","m",2).h}`},
  {n:"Exercice 7", t:"La toiture", w:"Sur ton cahier", h:`<p>Une maison de plain-pied a un toit à deux pans identiques. Elle mesure ${F(mais.L)} cm de large et ${F(mais.P)} cm de long. Les murs mesurent ${mais.h} cm de haut et le faîte du toit est à ${mais.H} cm du sol.</p><p>Quelles sont les dimensions d'un pan de la toiture ? <i>Arrondis au centimètre.</i></p>`,
   c:`<p>Un pan du toit mesure ${F(mais.P)} cm de long. Il faut trouver l'autre dimension du pan.</p><p>On note T le faîte du toit, I le haut d'un mur et O le point situé sous le faîte, à la hauteur du haut des murs. Le pan du toit va de T à I, et le triangle TOI est rectangle en O.</p>${rtri(mais.L/2,mais.H-mais.h,{R:"O",X:"I",Y:"T"},{RX:F(mais.L/2)+" cm",RY:(mais.H-mais.h)+" cm",XY:"?"},{w:260})}<p class="calc">TO = ${mais.H} − ${mais.h} = ${mais.H-mais.h} cm<br>OI = ${F(mais.L)} ÷ 2 = ${F(mais.L/2)} cm</p>${pyth("TOI","O",{TO:mais.H-mais.h,OI:mais.L/2},"TI","cm",0).h}<p>Un pan de toiture mesure environ <b>${F(rnd(Math.sqrt((mais.H-mais.h)**2+(mais.L/2)**2),0))} cm sur ${F(mais.P)} cm</b>.</p>`}
 ]}
];
};
