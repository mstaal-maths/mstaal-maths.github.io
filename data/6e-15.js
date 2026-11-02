/* 6e — Chapitre 15 : Angles (2) (cours et fiche d'exercices de M. Staal)
   Angles des exercices 8 et 9 mesurés sur sa fiche (à 1° près) ; bissectrices tracées par calcul. */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const A = n => `<span class="ang">${n}</span>`;
const co = (p,alt,w) => img("c615co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("c615ex/"+p+".png", alt, w);
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const fr = x => String(x).replace(".",",");
/* calculs en chaîne : une étape par ligne, chaque ligne commence par le nom de l'angle suivi de « = » */
const KC = (nm, st, lab) => `<p class="calc">${st.map((t,i)=>(i===0&&lab?lab+" ":"")+nm+" = "+t).join("<br>")}</p>`;
const KCS = arr => `<div class="calcs">${arr.map(x=>`<div>${x}</div>`).join("")}</div>`;

/* demi-droites issues de O : rays = [{a: angle en degrés, n: nom}], arcs = [{a0,a1,t,c}] */
function rays(R, o={}){
  const W=o.w||260, H=o.h||170, cx=o.cx||W/2, cy=o.cy||H-28, L=o.L||100, col={b:"#1e5aa8",o:"#e08a00",r:"#d0342c",g:"#1d7a46"};
  const P=(a,r)=>[cx+r*Math.cos(a*Math.PI/180), cy-r*Math.sin(a*Math.PI/180)], f=v=>v.toFixed(1);
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:100%" role="img" aria-label="${o.alt||"Des angles de même sommet"}">`;
  (o.arcs||[]).forEach(({a0,a1,t,c,r})=>{ r=r||28; const [x0,y0]=P(a0,r),[x1,y1]=P(a1,r), c2=col[c||"b"];
    s+=`<path d="M${cx} ${cy} L${f(x0)} ${f(y0)} A${r} ${r} 0 ${a1-a0>180?1:0} 0 ${f(x1)} ${f(y1)} Z" style="fill:${c2};fill-opacity:.2;stroke:none"/><path d="M${f(x0)} ${f(y0)} A${r} ${r} 0 ${a1-a0>180?1:0} 0 ${f(x1)} ${f(y1)}" style="fill:none;stroke:${c2};stroke-width:2"/>`;
    if(t){ const [tx,ty]=P((a0+a1)/2, r+17); s+=`<text x="${f(tx)}" y="${f(ty+5)}" text-anchor="middle" style="font-size:13px;font-weight:700;fill:${c2}">${t}</text>`; } });
  (o.right||[]).forEach(a=>{ const [x1,y1]=P(a,11),[x2,y2]=P(a+90,11),[x3,y3]=P(a+45,15.5); s+=`<path d="M${f(x1)} ${f(y1)} L${f(x3)} ${f(y3)} L${f(x2)} ${f(y2)}" style="fill:none;stroke:var(--ink);stroke-width:1.5"/>`; });
  R.forEach(({a,n,c})=>{ const [x,y]=P(a,L), [tx,ty]=P(a,L+14); s+=`<line x1="${cx}" y1="${cy}" x2="${f(x)}" y2="${f(y)}" style="stroke:${c?col[c]:"var(--ink)"};stroke-width:2.2"/>`; if(n) s+=`<text x="${f(tx)}" y="${f(ty+5)}" text-anchor="middle" style="font-size:15px;font-weight:700;font-style:${n.length===1&&n===n.toLowerCase()?"italic":"normal"};fill:var(--ink)">${n}</text>`; });
  s+=`<circle cx="${cx}" cy="${cy}" r="3" style="fill:var(--ink)"/>`;
  if(o.O) s+=`<text x="${cx-4}" y="${cy+20}" text-anchor="middle" style="font-size:15px;font-weight:700;fill:var(--ink)">${o.O}</text>`;
  return s+"</svg>";
}
window.FIG15 = {rays};

/* ---------- schémas ---------- */
const S_ADJ = sch("Angles adjacents", co("adj","Des angles adjacents, et trois cas où ils ne le sont pas",460)+`<p class="schN">Même sommet, un côté commun, et de part et d'autre de ce côté. Alors ${A("xOz")} = ${A("xOy")} + ${A("yOz")}.</p>`);
const S_CS = sch("Complémentaires, supplémentaires", co("supp","35° + 55° = 90° : complémentaires ; 60° + 120° = 180° : supplémentaires",380)+`<p class="schN">Complémentaires : somme 90°. Supplémentaires : somme 180°.</p>`);
const S_OPP = sch("Angles opposés par le sommet", co("opp","Deux droites sécantes en O et les angles opposés par le sommet",210)+`<p class="schN">Deux angles opposés par le sommet ont la <b>même mesure</b>.</p>`);
const S_BIS = sch("La bissectrice", co("biss","[Oz) partage l'angle xOy de 70° en deux angles de 35°",200)+`<p class="schN">Elle partage l'angle en deux angles adjacents de même mesure.</p>`);

/* exercice 11 : triangle 7-6-5 et ses bissectrices (centre du cercle inscrit) */
const tri11 = (()=>{ const k=36, pad=24, P=[[0,0],[7,0],[38/14, Math.sqrt(25-(38/14)**2)]], I=[3, Math.sqrt(25-(38/14)**2)*7/18], r=I[1];
  const X=p=>pad+p[0]*k, Y=p=>pad+(P[2][1]-p[1])*k+4, f=v=>v.toFixed(1), W=7*k+2*pad, H=P[2][1]*k+2*pad+8;
  let s=`<svg class="fig" viewBox="0 0 ${f(W)} ${f(H)}" width="${Math.round(W)}" role="img" aria-label="Triangle ABC et ses trois bissectrices qui se coupent en un point">`;
  s+=`<circle cx="${f(X(I))}" cy="${f(Y(I))}" r="${f(r*k)}" style="fill:none;stroke:#1d7a46;stroke-width:1.5;stroke-dasharray:5 4"/>`;
  P.forEach(p=>{ const d=[I[0]-p[0],I[1]-p[1]], l=Math.hypot(...d), e=[p[0]+d[0]/l*(l+1.3), p[1]+d[1]/l*(l+1.3)]; s+=`<line x1="${f(X(p))}" y1="${f(Y(p))}" x2="${f(X(e))}" y2="${f(Y(e))}" style="stroke:#d0342c;stroke-width:2"/>`; });
  s+=`<polygon points="${P.map(p=>f(X(p))+","+f(Y(p))).join(" ")}" style="fill:none;stroke:var(--ink);stroke-width:2.2"/><circle cx="${f(X(I))}" cy="${f(Y(I))}" r="3.5" style="fill:#d0342c"/>`;
  [["A",-14,8],["B",8,8],["C",-4,-8]].forEach(([n,dx,dy],i)=>{ s+=`<text x="${f(X(P[i])+dx)}" y="${f(Y(P[i])+dy+4)}" style="font-size:15px;font-weight:700;fill:var(--ink)">${n}</text>`; });
  return s+"</svg>"; })();

CH["6e-15"] = {
intro:"Les angles adjacents, complémentaires, supplémentaires et opposés par le sommet, calculer un angle avec ces propriétés, et la bissectrice d'un angle.",
savoir:[
  "reconnaître des angles adjacents et des angles opposés par le sommet ;",
  "connaître les angles complémentaires et supplémentaires ;",
  "calculer la mesure d'un angle en utilisant ces propriétés ;",
  "connaître la définition de la bissectrice d'un angle et la construire (rapporteur, compas)."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Angles adjacents", h:`
  <p><b>Rappel :</b> pour nommer, mesurer et construire un angle, revois le chapitre 9.</p>
  <div class="retenir" data-l="Définition"><p>Deux angles sont <b>adjacents</b> lorsqu'ils ont le même sommet, un côté commun, et qu'ils sont situés de part et d'autre de ce côté commun.</p></div>
  ${co("adj","Des angles adjacents (xOy et yOz), et trois cas où ils ne le sont pas : pas le même sommet, pas de côté commun, ils chevauchent le côté",490)}
  <p>Sur la première figure, les angles ${A("xOy")} et ${A("yOz")} sont adjacents : leur sommet commun est O et leur côté commun est [Oy).</p>
  <div class="retenir" data-l="Propriété"><p>Si deux angles ${A("xOy")} et ${A("yOz")} sont adjacents, alors ${A("xOz")} = ${A("xOy")} + ${A("yOz")}.</p></div>`},
{k:"II", t:"Angles complémentaires et angles supplémentaires", h:`
  <div class="retenir" data-l="Définitions"><p>Deux angles sont <b>complémentaires</b> si la somme de leurs mesures est égale à <b>90°</b>.</p><p>Deux angles sont <b>supplémentaires</b> si la somme de leurs mesures est égale à <b>180°</b>.</p></div>
  ${co("supp","Complémentaires : 35° + 55° = 90° ; supplémentaires : 60° + 120° = 180°",420)}
  <p><b>Remarque :</b> deux angles complémentaires (ou supplémentaires) ne sont pas forcément adjacents : seule la somme de leurs mesures compte.</p>
  <p><b>Exemple :</b> les points A, O et B sont alignés et ${A("AOC")} = 128°. Les angles ${A("AOC")} et ${A("COB")} sont adjacents et forment un angle plat : ils sont supplémentaires. Donc :</p>${KC(A("COB"),["180° − 128°","52°"])}`},
{k:"III", t:"Angles opposés par le sommet", h:`
  <div class="cpt"><div><p>Deux droites sécantes en O forment quatre angles.</p><div class="retenir" data-l="Définition"><p>Deux angles sont <b>opposés par le sommet</b> lorsqu'ils ont le même sommet et que leurs côtés sont dans le prolongement l'un de l'autre.</p></div><p>Ici, ${A("xOy")} et ${A("x'Oy'")} sont opposés par le sommet ; ${A("yOx'")} et ${A("y'Ox")} aussi.</p></div>${co("opp","Deux droites sécantes en O",220)}</div>
  <div class="retenir" data-l="Propriété"><p>Si deux angles sont opposés par le sommet, alors ils ont la <b>même mesure</b>.</p></div>
  <p><b>Exemple :</b> si ${A("xOy")} = 125°, alors ${A("x'Oy'")} = 125° (opposés par le sommet). De plus, ${A("xOy")} et ${A("yOx'")} sont supplémentaires :</p>${KC(A("yOx'"),["180° − 125°","55°"])}<p>Et ${A("y'Ox")} = 55° (opposé par le sommet à ${A("yOx'")}).</p>`},
{k:"IV", t:"La bissectrice d'un angle", h:`
  <div class="cpt"><div><div class="retenir" data-l="Définition"><p>La <b>bissectrice</b> d'un angle est la demi-droite qui partage cet angle en deux angles adjacents de même mesure.</p></div><p>Ici, [Oz) est la bissectrice de ${A("xOy")}, donc ${A("xOz")} = ${A("zOy")} :</p>${KC(A("xOz"),["70° ÷ 2","35°"])}<p><b>Remarque :</b> la bissectrice d'un angle est l'axe de symétrie de cet angle (voir le chapitre 13).</p></div>${co("biss","La bissectrice [Oz) de l'angle xOy",200)}</div>
  <h4>1. Avec le rapporteur</h4>
  <p>Je mesure l'angle, je divise sa mesure par 2, puis je construis un angle de cette mesure à partir de l'un des côtés. <b>Exemple :</b> ${A("xOy")} = 70°, donc je trace [Oz) telle que ${A("xOz")} = 35°.</p>
  <div class="anim" data-anim="6e15-bissectrice-rapporteur"></div>
  <h4>2. Avec le compas</h4>
  <div class="retenir" data-l="Méthode"><ol><li>Je trace un arc de cercle de centre O : il coupe [Ox) en A et [Oy) en B.</li><li>Sans changer l'écartement, je trace deux arcs de centres A et B : ils se coupent en C.</li><li>Je trace la demi-droite [OC) : c'est la bissectrice de l'angle ${A("xOy")}.</li></ol></div>
  <div class="anim" data-anim="6e15-bissectrice-compas"></div>
  ${co("compas","Les trois étapes de la construction de la bissectrice au compas",480)}
  <p><b>Remarque :</b> comme pour la médiatrice (chapitre 6), on utilise des arcs de même rayon : OA = OB et CA = CB, donc la droite (OC) est la médiatrice du segment [AB].</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Angles adjacents", e:[
  {n:"Exercice 1", t:"Adjacents ou pas ?", w:"Sur ta feuille", h:`<p>Dans chaque cas, les deux angles colorés sont-ils adjacents ? Si non, explique pourquoi.</p>${ex("e1","Quatre paires d'angles colorés",490)}<p>a) ${A("AOB")} et ${A("BOC")} · b) ${A("DOE")} et ${A("DOF")} · c) ${A("IGK")} et ${A("JHK")} · d) ${A("LON")} et ${A("NOM")}</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 2", t:"Ajouter des angles adjacents", w:"Sur ta feuille", h:`<div class="cpt"><div><p>Sur cette figure à main levée, ${A("AOB")} = 35°, ${A("BOC")} = 50° et ${A("AOD")} = 140°.</p><p>1) Calcule ${A("AOC")}.</p><p>2) Calcule ${A("COD")}.</p><p>3) Nomme deux angles adjacents à l'angle ${A("BOC")}.</p></div>${ex("e2","Quatre demi-droites issues de O",230)}</div>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."}
 ]},
{t:"Angles complémentaires et supplémentaires", e:[
  {n:"Exercice 3", t:"Compléter un tableau", w:"Sur ta feuille", h:`<p>Complète le tableau. Si ce n'est pas possible, écris une croix.</p><div class="scroll"><table class="std"><thead><tr><th>Mesure de l'angle</th><th>30°</th><th>45°</th><th>72°</th><th>89°</th><th>15,5°</th><th>120°</th></tr></thead><tbody><tr><th>Angle complémentaire</th><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><th>Angle supplémentaire</th><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table></div><p>Pourquoi un angle de 120° n'a-t-il pas d'angle complémentaire ?</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 4", t:"Vrai ou faux ?", w:"Sur ta feuille", h:`<p>Réponds par vrai ou faux, et justifie par un exemple ou une explication.</p><p>a) Deux angles de 45° sont complémentaires.</p><p>b) Deux angles aigus peuvent être supplémentaires.</p><p>c) Deux angles supplémentaires sont toujours adjacents.</p><p>d) Deux angles supplémentaires de même mesure sont des angles droits.</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 5", t:"Calculer un angle", w:"Sur ta feuille", h:`<p>Les figures sont faites à main levée. Dans a) et c), les points A, O et B sont alignés. Calcule la mesure de l'angle marqué « ? » en justifiant.</p>${ex("e5","Trois figures avec un angle inconnu",490)}`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."}
 ]},
{t:"Angles opposés par le sommet", e:[
  {n:"Exercice 6", t:"Deux droites sécantes", w:"Sur ta feuille", h:`<div class="cpt"><div><p>Les droites (AC) et (BD) se coupent en O, et ${A("AOB")} = 63°. Calcule, en justifiant :</p><p>1) ${A("COD")} · 2) ${A("BOC")} · 3) ${A("DOA")}</p></div>${ex("e6","Les droites (AC) et (BD) sécantes en O",200)}</div>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 7", t:"Défi — trois droites", w:"Sur ta feuille", h:`<div class="cpt"><div><p>Les droites (AD), (BE) et (CF) se coupent en O. On sait que ${A("AOB")} = 40° et ${A("BOC")} = 75°.</p><p>Calcule la mesure des quatre autres angles en justifiant : ${A("COD")}, ${A("DOE")}, ${A("EOF")}, ${A("FOA")}.</p></div>${ex("e7","Trois droites sécantes en O",210)}</div>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."}
 ]},
{t:"La bissectrice d'un angle", e:[
  {n:"Activité 1", t:"Le pliage", w:"Sur ta feuille", h:`<p>Découpe un angle dans une feuille de papier. Plie la feuille pour que les deux côtés de l'angle se superposent, puis déplie.</p><p>1) Que peux-tu dire des deux angles formés par le pli ? Vérifie avec ton rapporteur.</p><p>2) Que représente le pli pour l'angle de départ ?</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 8", t:"Avec le rapporteur", w:"Sur ta feuille", h:`<p>Mesure chaque angle, puis construis sa bissectrice avec le rapporteur. Nomme-la [Oz) pour a) et [Sw) pour b).</p>${ex("e8","a) l'angle xOy ; b) l'angle uSv",490)}`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 9", t:"Avec le compas", w:"Sur ta feuille", h:`<p>Construis la bissectrice de chaque angle avec le compas seulement. Laisse tes traits de construction visibles.</p>${ex("e9","Trois angles de sommets E, F et G",490)}`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 10", t:"Calculer avec la bissectrice", w:"Sur ta feuille", h:`<p>Dans chaque cas, [Oz) est la bissectrice de l'angle ${A("xOy")}.</p><p>1) ${A("xOz")} = 37°. Calcule ${A("xOy")}.</p><p>2) ${A("xOy")} = 151°. Calcule ${A("zOy")}.</p><p>3) ${A("xOy")} est un angle droit. Calcule ${A("xOz")}.</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 11", t:"Pour aller plus loin", w:"Sur ton cahier", h:`<p>1) Construis un triangle ABC tel que AB = 7 cm, BC = 6 cm et AC = 5 cm.</p><p>2) Construis les bissectrices des trois angles du triangle (avec la méthode de ton choix).</p><p>3) Que remarques-tu ? Compare avec les médiatrices d'un triangle (chapitre 6).</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Angles adjacents", schema:S_ADJ, q:{
 1:[ {q:"Deux angles adjacents ont…", c:["le même sommet et un côté commun","la même mesure","des côtés parallèles"], rep:"le même sommet et un côté commun", sx:S_ADJ} ],
 2:[ {g:()=>{ const a=ri(15,70), b=ri(15,70); return {q:`${A("xOy")} = ${a}° et ${A("yOz")} = ${b}° sont adjacents. Combien mesure ${A("xOz")} (en °) ?`, rep:String(a+b), fig:rays([{a:0,n:"x"},{a:a,n:"y"},{a:a+b,n:"z"}],{arcs:[{a0:0,a1:a,t:a+"°"},{a0:a,a1:a+b,t:b+"°",c:"o",r:36}],O:"O",cx:a+b>95?110:80,w:250}), sx:S_ADJ}; }} ],
 3:[ {g:()=>{ const t=ri(90,160), a=ri(20,t-20); return {q:`${A("xOz")} = ${t}° et ${A("xOy")} = ${a}°, avec [Oy) entre [Ox) et [Oz). Combien mesure ${A("yOz")} (en °) ?`, rep:String(t-a), ex:`${t} − ${a} = ${t-a}.`, sx:S_ADJ}; }} ]
}},
{nom:"Complémentaires et supplémentaires", schema:S_CS, q:{
 1:[ {g:()=>{ const a=ri(5,85); return {q:`Quel est le complémentaire d'un angle de ${a}° (en °) ?`, rep:String(90-a), sx:S_CS}; }},
     {g:()=>{ const a=ri(5,175); return {q:`Quel est le supplémentaire d'un angle de ${a}° (en °) ?`, rep:String(180-a), sx:S_CS}; }} ],
 2:[ {g:()=>{ const a=ri(10,80); return {q:`Les angles ${a}° et ${90-a}° sont…`, c:["complémentaires","supplémentaires","opposés par le sommet"], rep:"complémentaires", sx:S_CS}; }},
     {g:()=>{ const a=ri(20,160); return {q:`A, O et B sont alignés, et ${A("AOC")} = ${a}°. Combien mesure ${A("COB")} (en °) ?`, rep:String(180-a), fig:rays([{a:0,n:"B"},{a:180,n:"A"},{a:180-a,n:"C"}],{arcs:[{a0:180-a,a1:180,t:a+"°"},{a0:0,a1:180-a,t:"?",c:"r",r:24}],O:"O",w:280,cx:140}), sx:S_CS}; }} ],
 3:[ {q:"Deux angles aigus peuvent-ils être supplémentaires ?", c:["Non","Oui"], rep:"Non", ex:"Leur somme est plus petite que 180°.", sx:S_CS},
     {g:()=>{ const a=ri(11,79)+0.5; return {q:`Quel est le complémentaire d'un angle de ${fr(a)}° (en °) ?`, rep:fr(90-a), sx:S_CS}; }} ]
}},
{nom:"Opposés par le sommet", schema:S_OPP, q:{
 1:[ {q:"Deux angles opposés par le sommet…", c:["ont la même mesure","sont complémentaires","sont adjacents"], rep:"ont la même mesure", sx:S_OPP} ],
 2:[ {g:()=>{ const a=ri(20,160); return {q:`Deux droites sont sécantes en O et ${A("AOB")} = ${a}°. Combien mesure l'angle opposé ${A("COD")} (en °) ?`, rep:String(a), sx:S_OPP}; }} ],
 3:[ {g:()=>{ const a=ri(20,160); return {q:`(AC) et (BD) sont sécantes en O, ${A("AOB")} = ${a}°. Combien mesure ${A("BOC")} (en °) ?`, rep:String(180-a), ex:`${A("AOB")} et ${A("BOC")} sont supplémentaires : 180 − ${a} = ${180-a}.`, sx:S_OPP}; }} ]
}},
{nom:"La bissectrice", schema:S_BIS, q:{
 1:[ {g:()=>{ const a=2*ri(10,85); return {q:`[Oz) est la bissectrice de ${A("xOy")} = ${a}°. Combien mesure ${A("xOz")} (en °) ?`, rep:String(a/2), sx:S_BIS}; }} ],
 2:[ {g:()=>{ const a=ri(10,85); return {q:`[Oz) est la bissectrice de ${A("xOy")} et ${A("xOz")} = ${a}°. Combien mesure ${A("xOy")} (en °) ?`, rep:String(2*a), sx:S_BIS}; }},
     {g:()=>{ const a=2*ri(10,85)+1; return {q:`[Oz) est la bissectrice de ${A("xOy")} = ${a}°. Combien mesure ${A("zOy")} (en °) ?`, rep:fr(a/2), sx:S_BIS}; }} ],
 3:[ {q:"Pour construire une bissectrice au compas, les deux derniers arcs (de centres A et B) doivent…", c:["avoir le même rayon","passer par O","avoir des rayons différents"], rep:"avoir le même rayon", sx:S_BIS},
     {q:"La bissectrice d'un angle est aussi…", c:["son axe de symétrie","sa médiatrice","son côté"], rep:"son axe de symétrie", sx:S_BIS} ]
}}
],
/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
/* figures de l'évaluation d'entraînement, tracées avec rays() (mesures exactes) */
const f1=v=>v.toFixed(1);
const secFig=g=>rays([{a:180,n:"E"},{a:0,n:"F"},{a:180-g,n:"G"},{a:360-g,n:"H"},{a:90,n:"L"}],{w:300,h:250,cx:150,cy:128,L:100,O:"O",right:[0],arcs:[{a0:180-g,a1:180,t:g+"°",c:"o",r:30}],alt:`Les droites (EF) et (GH) sécantes en O ; la demi-droite [OL) perpendiculaire à (EF) ; l'angle EOG mesure ${g}°`});
const figA=rays([{a:0,n:"x"},{a:25,n:"y"},{a:90,n:"z"}],{w:190,h:160,cx:45,cy:130,L:95,O:"O",arcs:[{a0:0,a1:25,t:"25°",c:"b",r:40},{a0:25,a1:90,t:"65°",c:"o",r:26}],alt:"Figure a : les angles xOy de 25° et yOz de 65°, de même sommet O et de côté commun [Oy)"});
const figB=rays([{a:20,n:"A"},{a:140,n:"B"},{a:200,n:"C"},{a:320,n:"D"}],{w:200,h:160,cx:100,cy:80,L:70,arcs:[{a0:20,a1:140,c:"b",r:22},{a0:200,a1:320,c:"o",r:22}],alt:"Figure b : les droites (AC) et (BD) sécantes en S, les angles ASB et CSD"}).replace("</svg>",`<text x="70" y="81" style="font-size:15px;font-weight:700;fill:var(--ink)">S</text></svg>`);
const figC=rays([{a:0,n:"C"},{a:110,n:"A"}],{w:150,h:130,cx:55,cy:100,L:75,O:"B",arcs:[{a0:0,a1:110,t:"110°",c:"b",r:24}],alt:"Figure c : l'angle ABC de 110°"})+rays([{a:0,n:"F"},{a:70,n:"D"}],{w:130,h:130,cx:25,cy:100,L:80,O:"E",arcs:[{a0:0,a1:70,t:"70°",c:"o",r:28}],alt:"Figure c : l'angle DEF de 70°, dessiné ailleurs"});
/* angle à partager : côtés à a0 et a1 degrés ; cor : construction de la bissectrice au compas */
function bisFig(a0,a1,cor){
  const W=300,H=235,cx=50,cy=208,L=180,r=75,o={w:W,h:H,cx,cy,L,O:"M",alt:`L'angle uMv de ${a1-a0}°${cor?" et sa bissectrice [Mt) construite au compas":""}`};
  const P=(a,d)=>[cx+d*Math.cos(a*Math.PI/180), cy-d*Math.sin(a*Math.PI/180)], m=(a0+a1)/2, k=(a1-a0)/2;
  const R=[{a:a0,n:"u"},{a:a1,n:"v"}]; if(cor) R.push({a:m,n:"t",c:"r"});
  let s=rays(R,o); if(!cor) return s;
  const arc=(c,rr,b0,b1,col)=>{ const p=[c[0]+rr*Math.cos(b0*Math.PI/180),c[1]-rr*Math.sin(b0*Math.PI/180)], q=[c[0]+rr*Math.cos(b1*Math.PI/180),c[1]-rr*Math.sin(b1*Math.PI/180)];
    return `<path d="M${f1(p[0])} ${f1(p[1])} A${rr} ${rr} 0 0 0 ${f1(q[0])} ${f1(q[1])}" style="fill:none;stroke:${col};stroke-width:1.6"/>`; };
  const A=P(a0,r), B=P(a1,r), dC=2*r*Math.cos(k*Math.PI/180), C=P(m,dC);
  let e=arc([cx,cy],r,a0-8,a1+8,"#1e5aa8");
  const dirA=Math.atan2(-(C[1]-A[1]),C[0]-A[0])*180/Math.PI, dirB=Math.atan2(-(C[1]-B[1]),C[0]-B[0])*180/Math.PI;
  e+=arc(A,r,dirA-14,dirA+14,"#1d7a46")+arc(B,r,dirB-14,dirB+14,"#1d7a46");
  [["A",A,8,14],["B",B,-18,-2],["C",C,8,-6]].forEach(([n,p,dx,dy])=>{ e+=`<circle cx="${f1(p[0])}" cy="${f1(p[1])}" r="3" style="fill:var(--ink)"/><text x="${f1(p[0]+dx)}" y="${f1(p[1]+dy)}" style="font-size:14px;font-weight:700;fill:var(--ink)">${n}</text>`; });
  return s.replace("</svg>", e+"</svg>");
}
const COMP=[
  ["CALCULER","Je calcule la mesure d'un angle en utilisant les angles adjacents, complémentaires, supplémentaires ou opposés par le sommet.","Ex. 1 (4 points)"],
  ["COMMUNIQUER","Je reconnais des angles adjacents, complémentaires, supplémentaires, opposés par le sommet.","Ex. 2 (3 points)"],
  ["REPRÉSENTER","Je construis la bissectrice d'un angle.","Ex. 3 (3 points)"]];
const C_VOC=`<p>a) Les angles ${A("xOy")} et ${A("yOz")} ont le même sommet O, le côté commun [Oy), et ils sont de part et d'autre de [Oy) : ils sont <b>adjacents</b>. <i>(0,5 point)</i> De plus, 25° + 65° = 90° : ils sont <b>complémentaires</b>. <i>(0,5 point)</i></p>
  <p>b) Les angles ${A("ASB")} et ${A("CSD")} sont formés par les droites (AC) et (BD) qui se coupent en S, et ils sont face à face : ils sont <b>opposés par le sommet</b>. <i>(1 point)</i></p>
  <p>c) 110° + 70° = 180° : les angles ${A("ABC")} et ${A("DEF")} sont <b>supplémentaires</b> (mais pas adjacents : ils n'ont pas le même sommet). <i>(1 point)</i></p>`;
return {
titre:"Évaluation d'entraînement — Chapitre 15", duree:30, info:"Durée : 30 min · Règle, rapporteur et compas · Calculatrice non autorisée",
comp:COMP,
exos:[
{t:"Calculer des angles", p:4, h:`<div class="cpt"><div><p>Les droites (EF) et (GH) se coupent en O. La demi-droite [OL) est perpendiculaire à la droite (EF). L'angle ${A("EOG")} mesure 64°.</p><p>Calcule chaque angle en justifiant.</p><p>a) ${A("FOG")} · b) ${A("FOH")} · c) ${A("GOL")} · d) ${A("HOL")}</p></div>${secFig(64)}</div>`,
 c:`<p>a) E, O et F sont alignés : ${A("EOG")} et ${A("FOG")} sont supplémentaires.</p>${KC(A("FOG"),["180° − 64°","<b>116°</b>"])}<p><i>(1 point)</i></p>
  <p>b) ${A("FOH")} et ${A("EOG")} sont opposés par le sommet, donc ${A("FOH")} = ${A("EOG")} = <b>64°</b>. <i>(1 point)</i></p>
  <p>c) (OL) est perpendiculaire à (EF), donc ${A("EOL")} = 90°. ${A("EOG")} et ${A("GOL")} sont adjacents et complémentaires :</p>${KC(A("GOL"),["90° − 64°","<b>26°</b>"])}<p><i>(1 point)</i></p>
  <p>d) ${A("HOF")} et ${A("FOL")} sont adjacents, et ${A("FOL")} = 90° :</p>${KC(A("HOL"),[`${A("HOF")} + ${A("FOL")}`,"64° + 90°","<b>154°</b>"])}<p><i>(1 point)</i></p>`},
{t:"Le bon vocabulaire", p:3, h:`<p>Pour chaque figure, écris tous les mots qui conviennent parmi : <b>adjacents</b>, <b>complémentaires</b>, <b>supplémentaires</b>, <b>opposés par le sommet</b>. Explique ta réponse.</p>
  <p>a) Les angles ${A("xOy")} et ${A("yOz")}.</p>${figA}<p>b) Les angles ${A("ASB")} et ${A("CSD")} (les droites (AC) et (BD) se coupent en S).</p>${figB}<p>c) Les angles ${A("ABC")} et ${A("DEF")}.</p><div class="figs">${figC}</div>`,
 c:C_VOC},
{t:"Partager un angle", p:3, h:`<p>a) Construis <b>au compas</b> la bissectrice [Mt) de l'angle ${A("uMv")}. Tes arcs de cercle doivent rester visibles.</p><p>b) L'angle ${A("uMv")} mesure 76°. Combien mesure l'angle ${A("uMt")} ? Justifie.</p>${bisFig(10,86,false)}`,
 c:`${bisFig(10,86,true)}<p>a) Un arc de centre M coupe [Mu) en A et [Mv) en B. Deux arcs de même rayon, de centres A et B, se coupent en C. La demi-droite [MC) est la bissectrice [Mt). <i>(2 points : 1 pour les arcs, 1 pour la bissectrice)</i></p>
  <p>b) La bissectrice partage l'angle en deux angles de même mesure :</p>${KC(A("uMt"),["76° ÷ 2","<b>38°</b>"])}<p><i>(1 point)</i></p>`}
],
bep:{
titre:"Évaluation d'entraînement — Chapitre 15 · version aménagée", duree:30, info:"Version aménagée (tiers-temps) · Durée : 30 min · Règle, rapporteur et compas · Calculatrice non autorisée",
note:"Le même sujet avec 2 questions en moins, à faire dans le même temps. Le total reste sur 10 points.",
comp:COMP,
exos:[
{t:"Calculer des angles", p:4, h:`<div class="cpt"><div><p>Les droites (EF) et (GH) se coupent en O. La demi-droite [OL) est perpendiculaire à la droite (EF). L'angle ${A("EOG")} mesure 64°.</p><p>Calcule chaque angle en justifiant.</p><p>a) ${A("FOG")} · b) ${A("FOH")} · c) ${A("GOL")}</p></div>${secFig(64)}</div>`,
 c:`<p>a) E, O et F sont alignés : ${A("EOG")} et ${A("FOG")} sont supplémentaires.</p>${KC(A("FOG"),["180° − 64°","<b>116°</b>"])}<p><i>(1,5 point)</i></p>
  <p>b) ${A("FOH")} et ${A("EOG")} sont opposés par le sommet, donc ${A("FOH")} = ${A("EOG")} = <b>64°</b>. <i>(1 point)</i></p>
  <p>c) (OL) est perpendiculaire à (EF), donc ${A("EOL")} = 90°. ${A("EOG")} et ${A("GOL")} sont adjacents et complémentaires :</p>${KC(A("GOL"),["90° − 64°","<b>26°</b>"])}<p><i>(1,5 point)</i></p>`},
{t:"Le bon vocabulaire", p:3, h:`<p>Pour chaque figure, écris tous les mots qui conviennent parmi : <b>adjacents</b>, <b>complémentaires</b>, <b>supplémentaires</b>, <b>opposés par le sommet</b>. Explique ta réponse.</p>
  <p>a) Les angles ${A("xOy")} et ${A("yOz")}.</p>${figA}<p>b) Les angles ${A("ASB")} et ${A("CSD")} (les droites (AC) et (BD) se coupent en S).</p>${figB}`,
 c:`<p>a) Les angles ${A("xOy")} et ${A("yOz")} ont le même sommet O, le côté commun [Oy), et ils sont de part et d'autre de [Oy) : ils sont <b>adjacents</b>. <i>(1 point)</i> De plus, 25° + 65° = 90° : ils sont <b>complémentaires</b>. <i>(0,5 point)</i></p>
  <p>b) Les angles ${A("ASB")} et ${A("CSD")} sont formés par les droites (AC) et (BD) qui se coupent en S, et ils sont face à face : ils sont <b>opposés par le sommet</b>. <i>(1,5 point)</i></p>`},
{t:"Partager un angle", p:3, h:`<p>a) Construis <b>au compas</b> la bissectrice [Mt) de l'angle ${A("uMv")}. Tes arcs de cercle doivent rester visibles.</p><p>b) L'angle ${A("uMv")} mesure 76°. Combien mesure l'angle ${A("uMt")} ? Justifie.</p>${bisFig(10,86,false)}`,
 c:`${bisFig(10,86,true)}<p>a) Un arc de centre M coupe [Mu) en A et [Mv) en B. Deux arcs de même rayon, de centres A et B, se coupent en C. La demi-droite [MC) est la bissectrice [Mt). <i>(2 points : 1 pour les arcs, 1 pour la bissectrice)</i></p>
  <p>b) La bissectrice partage l'angle en deux angles de même mesure :</p>${KC(A("uMt"),["76° ÷ 2","<b>38°</b>"])}<p><i>(1 point)</i></p>`}
]}
};
})()
};
})();
;(function(k){var D=typeof CH!=="undefined"&&CH[k],L=[];if(D&&D.exos)D.exos.forEach(function(S){(S.e||[]).forEach(function(e){L.push(e);});});(window.LOCKS=window.LOCKS||{})[k]={D:D,e:L};})("6e-15");
