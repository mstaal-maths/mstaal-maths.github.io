/* 4e — Chapitre 21 : Démontrer à l'aide du calcul littéral
   (cours B3 suite, feuille d'exercices et feuille de corrections, exercices en + de M. Staal)
   Lettres en italique, 3<i>x</i> sans signe ×. Toutes les figures sont redessinées en SVG.
   Calculs : outils window.CL7 (4e-7.js), CL12 (4e-12.js), CL13 (4e-13.js). */
(function(){
const {ri,pick,shuf,uniq,ch3,nz,F,X,T,E,red,R,fac,prod,svgT,prog,progs,tab}=window.CL7;
const {S,P,devK,rect}=window.CL12;
const {dev2}=window.CL13;
/* rectangle avec une marge à gauche, pour que la largeur « x + 3 » ne soit pas coupée */
const rectL=o=>rect(o).replace(/viewBox="0 0 (\d+) (\d+)" width="(\d+)"/,(m,w,h,W)=>`viewBox="-40 0 ${+w+40} ${h}" width="${+W+40}"`).replace(/<text x="13" /,'<text x="-6" ');
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const x=X("x");
/* deux colonnes qui prennent toute la largeur (une seule sur un écran étroit) : les longues lignes de calcul ne débordent plus du cadre */
const two=(L,Rt)=>`<div class="cgrid" style="display:flex;flex-wrap:wrap"><figure style="border:1.5px solid var(--line);flex:1 1 auto;max-width:100%;overflow-x:auto">${L}</figure><figure style="border:1.5px solid var(--line);flex:1 1 auto;max-width:100%;overflow-x:auto">${Rt}</figure></div>`;

/* ------------------------------------------------------------------ figures */
const tick=(x1,y1,x2,y2,n=1)=>{ const mx=(x1+x2)/2, my=(y1+y2)/2, dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy), ux=-dy/L*6, uy=dx/L*6, tx=dx/L*3, ty=dy/L*3; let s="";
  for(let k=0;k<n;k++){ const o=(k-(n-1)/2)*2; s+=`<line x1="${(mx-ux+o*tx).toFixed(1)}" y1="${(my-uy+o*ty).toFixed(1)}" x2="${(mx+ux+o*tx).toFixed(1)}" y2="${(my+uy+o*ty).toFixed(1)}" class="pt" style="stroke-width:2"/>`; } return s; };
const ra=(x0,y0,dx,dy)=>`<path d="M${x0+dx*10} ${y0} v${dy*10} h${-dx*10}" class="thin"/>`;
const T_=(xx,yy,t,st="")=>`<text x="${xx}" y="${yy}" class="lab" style="font-size:16px;${st}">${svgT(t)}</text>`;
/* un carré de côté c et un triangle de côtés s, s, b (périmètres) */
function sqTri(c,s,b){ return `<svg class="fig" viewBox="0 0 400 190" width="380" role="img" aria-label="Un carré de côté ${c.replace(/<[^>]*>/g,"")} et un triangle de côtés ${s.replace(/<[^>]*>/g,"")}, ${s.replace(/<[^>]*>/g,"")} et ${b.replace(/<[^>]*>/g,"")}">
  <rect x="40" y="35" width="130" height="130" class="ln"/>${ra(40,35,1,1)}${ra(170,35,-1,1)}${ra(40,165,1,-1)}${ra(170,165,-1,-1)}${T_(105,26,c)}${T_(18,105,c)}
  <polygon points="230,165 370,165 300,35" class="ln"/>${T_(244,96,s)}${T_(360,96,s)}${T_(300,186,b)}</svg>`; }
/* exercice 7 : l'hexagone BCDEFG et le rectangle MNOP */
const EX7FIG=`<svg class="fig" viewBox="0 0 520 225" width="500" role="img" aria-label="Un carré ACDE de côté x − 5 auquel on a enlevé le carré ABGF de côté 4 : il reste l'hexagone BCDEFG. Un rectangle MNOP de longueur x − 1 et de largeur x − 9.">
  <polygon points="90,20 190,20 190,180 30,180 30,80 90,80" style="fill:color-mix(in srgb,#f4b183 45%,transparent);stroke:var(--ink);stroke-width:2"/><path d="M30 20 H90 V80" class="cons"/><path d="M30 80 V20" class="cons"/>
  ${ra(30,20,1,1)}${ra(90,20,-1,1)}${ra(90,80,-1,-1)}${ra(190,20,-1,1)}${ra(190,180,-1,-1)}${ra(30,180,1,-1)}${ra(30,80,1,1)}
  <text x="22" y="16" class="lab">A</text><text x="92" y="14" class="lab">B</text><text x="200" y="16" class="lab">C</text><text x="202" y="194" class="lab">D</text><text x="20" y="196" class="lab">E</text><text x="18" y="84" class="lab">F</text><text x="102" y="94" class="lab">G</text>
  <path d="M32 66 H88 M38 61 L32 66 L38 71 M82 61 L88 66 L82 71" class="thin"/>${T_(60,60,"4")}
  <path d="M32 200 H188 M38 195 L32 200 L38 205 M182 195 L188 200 L182 205" class="thin"/>${T_(110,216,"<i>x</i> − 5")}${tick(190,100,190,100.1,2)}${tick(110,180,110.1,180,2)}
  <rect x="250" y="70" width="190" height="60" style="fill:color-mix(in srgb,#f4d03f 35%,transparent);stroke:var(--ink);stroke-width:2"/>${ra(250,70,1,1)}${ra(440,70,-1,1)}${ra(250,130,1,-1)}${ra(440,130,-1,-1)}
  <text x="242" y="64" class="lab">M</text><text x="450" y="64" class="lab">N</text><text x="450" y="146" class="lab">O</text><text x="242" y="146" class="lab">P</text>
  <path d="M252 52 H438 M258 47 L252 52 L258 57 M432 47 L438 52 L432 57" class="thin"/>${T_(345,44,"<i>x</i> − 1")}<path d="M458 72 V128 M453 78 L458 72 L463 78 M453 122 L458 128 L463 122" class="thin"/>${T_(462,104,"<i>x</i> − 9","text-anchor:start")}</svg>`;
/* exercice 8 : un rectangle et une figure en L (L = longueur connue) */
function ex8fig(Lv){ const u=36, Lp=110, H1=u; const lab=String(Lv);
  let s=`<svg class="fig" viewBox="0 0 560 150" width="540" role="img" aria-label="Figure 1 : rectangle de largeur x et de longueur ${lab} + x + x + x. Figure 2 : un rectangle de longueur ${lab} − x et de largeur x, accolé à un carré de côté 2x.">`;
  /* figure 1 */
  const y1=70; s+=`<rect x="20" y="${y1}" width="${Lp+3*u}" height="${H1}" style="fill:color-mix(in srgb,var(--c) 22%,transparent);stroke:var(--ink);stroke-width:2"/>${ra(20,y1,1,1)}${ra(20+Lp+3*u,y1,-1,1)}${ra(20,y1+H1,1,-1)}${ra(20+Lp+3*u,y1+H1,-1,-1)}`;
  for(let k=0;k<3;k++){ const a=20+Lp+k*u; s+=`<line x1="${a}" y1="${y1+H1-5}" x2="${a}" y2="${y1+H1+5}" class="thin"/>`+tick(a,y1+H1,a+u,y1+H1,2); }
  s+=tick(20,y1,20,y1+H1,2)+`<text x="8" y="${y1+H1/2+6}" class="lab" font-style="italic">x</text><path d="M22 ${y1+H1+16} H${18+Lp} M28 ${y1+H1+11} L22 ${y1+H1+16} L28 ${y1+H1+21} M${12+Lp} ${y1+H1+11} L${18+Lp} ${y1+H1+16} L${12+Lp} ${y1+H1+21}" class="thin"/>${T_(20+Lp/2,y1+H1+34,lab)}`;
  /* figure 2 */
  const X2=300, Lq=70, sq=2*u, base=y1+H1;
  s+=`<polygon points="${X2},${base-H1} ${X2+Lq},${base-H1} ${X2+Lq},${base-sq} ${X2+Lq+sq},${base-sq} ${X2+Lq+sq},${base} ${X2},${base}" style="fill:color-mix(in srgb,#f4b183 45%,transparent);stroke:var(--ink);stroke-width:2"/>`;
  s+=ra(X2,base-H1,1,1)+ra(X2,base,1,-1)+ra(X2+Lq,base-H1,-1,-1)+ra(X2+Lq,base-sq,1,1)+ra(X2+Lq+sq,base-sq,-1,1)+ra(X2+Lq+sq,base,-1,-1);
  s+=tick(X2,base-H1,X2,base,2)+`<text x="${X2-12}" y="${base-H1/2+6}" class="lab" font-style="italic">x</text>`;
  [[X2+Lq,base-sq,X2+Lq+sq,base-sq],[X2+Lq+sq,base-sq,X2+Lq+sq,base],[X2+Lq+sq,base,X2+Lq,base]].forEach(([a,b,c2,d])=>{ const mx=(a+c2)/2, my=(b+d)/2; s+=tick(a,b,mx,my,2)+tick(mx,my,c2,d,2)+`<circle cx="${mx}" cy="${my}" r="2.5" style="fill:var(--ink)"/>`; });
  s+=tick(X2+Lq,base-sq,X2+Lq,base-H1,2)+`<path d="M${X2+2} ${base+16} H${X2+Lq-2} M${X2+8} ${base+11} L${X2+2} ${base+16} L${X2+8} ${base+21} M${X2+Lq-8} ${base+11} L${X2+Lq-2} ${base+16} L${X2+Lq-8} ${base+21}" class="thin"/>${T_(X2+Lq/2,base+34,lab+" − <i>x</i>")}`;
  return s+`<text x="${20+(Lp+3*u)/2}" y="${y1-12}" class="lab">Figure 1</text><text x="${X2+(Lq+sq)/2}" y="${base-sq-12}" class="lab">Figure 2</text></svg>`; }
window.CL21={sqTri, ex8fig, two};

/* résolution type : test avec un nombre, puis avec x */
const lineP=(n,arr)=>arr.map(l=>`${n} = ${l}`).join("<br>");
const box=(n,arr)=>`<p class="calc">${lineP(n,arr)}</p>`;

/* ===================== schémas ===================== */
const S_EG=sch("Démontrer que deux expressions sont égales",`<p class="calc">P1 = ${x} × 9 + 6 = 9${x} + 6<br>P2 = (${x} × 3 + 2) × 3 = 9${x} + 6</p><p class="schN">Un exemple ne suffit pas : je remplace le nombre de départ par ${x}, je développe et je réduis. Si j'obtiens la même expression, elles sont <b>toujours</b> égales.</p>`);
const S_CE=sch("Démontrer qu'elles ne sont pas égales",`<p class="calc">Pour ${x} = 2 : A1 = 11 × 4 = 44 et A2 = 7 × 6 = 42</p><p class="schN">Un seul <b>contre-exemple</b> suffit : 44 ≠ 42, donc les aires ne sont pas toujours égales.</p>`);
const S_MET=sch("La méthode générale",`<p class="schN"><b>1)</b> Je teste avec un nombre (ou plusieurs).</p><p class="schN"><b>2)</b> Résultats différents → elles ne sont pas toujours égales.</p><p class="schN"><b>3)</b> Résultats égaux → je ne peux pas conclure : je calcule avec ${x}, je développe et je réduis.</p>`);

/* ===================== CH ===================== */
CH["4e-21"]={
intro:"Utiliser le calcul littéral pour démontrer que deux expressions (programmes de calcul, aires, périmètres) sont toujours égales, ou un contre-exemple pour montrer qu'elles ne le sont pas.",
savoir:[
  "savoir qu'un exemple ne suffit pas pour démontrer que deux expressions sont toujours égales ;",
  "démontrer que deux expressions littérales sont égales en les développant et en les réduisant ;",
  "démontrer que deux expressions ne sont pas égales avec un contre-exemple ou avec le calcul littéral ;",
  "tester, émettre une conjecture, puis la démontrer (méthode générale)."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Démontrer que deux expressions littérales sont égales", h:`
  <div class="retenir" data-l="Méthode"><p>Pour démontrer que deux expressions littérales <b>sont égales</b>, il faut qu'elles soient égales pour n'importe quelle valeur de ${x}.</p><p>Donc <b>un exemple ne suffit pas</b> à démontrer que deux expressions sont toujours égales.</p><p>On est donc obligé d'<b>utiliser le calcul littéral</b>.</p></div>
  <p><b>Exemple :</b> voici 2 programmes de calcul.</p>${progs(prog("Programme 1",["Choisir un nombre","Multiplier par 9","Ajouter 6"]),prog("Programme 2",["Choisir un nombre","Multiplier par 3","Ajouter 2","Multiplier par 3"]))}
  <p>Pierre affirme : « Ces deux programmes donneront toujours le même résultat si on les applique avec le même nombre de départ. » Pierre a-t-il raison ?</p>
  <p><b>Résolution :</b></p><p>Je teste les deux programmes avec 2.</p>
  ${two(`<p class="calc">${lineP("P1",["2 × 9 + 6","18 + 6","<b>24</b>"])}</p>`,`<p class="calc">${lineP("P2",["(2 × 3 + 2) × 3","8 × 3","<b>24</b>"])}</p>`)}
  <p>Les deux programmes donnent 24 avec le nombre 2.</p>
  <div class="attention"><b>ATTENTION :</b> on ne peut pas arrêter notre démonstration ici, car un exemple ne suffit pas à démontrer que deux expressions sont toujours égales.</div>
  <p><b>Conjecture :</b> il me semble que les deux programmes donnent toujours le même résultat.</p>
  <p>Démontrons si cette conjecture est vraie, en posant ${x} le nombre de départ.</p>
  ${two(`<p class="calc">${lineP("P1",[`${x} × 9 + 6`,`<b>9${x} + 6</b>`])}</p>`,`<p class="calc">${lineP("P2",[`(${x} × 3 + 2) × 3`,`(3${x} + 2) × 3`,`3 × 3${x} + 3 × 2`,`<b>9${x} + 6</b>`])}</p>`)}
  <p>Avec ${x} comme nombre de départ, les résultats des deux programmes sont égaux tous les deux à 9${x} + 6.</p>
  <p>Donc Pierre a raison : <b>les deux programmes donneront toujours le même résultat si on les applique avec le même nombre de départ.</b></p>`},
{k:"II", t:"Démontrer que deux expressions littérales ne sont pas égales", h:`
  <div class="retenir" data-l="Méthode"><p>Pour démontrer que deux expressions littérales <b>ne sont pas égales</b>, deux méthodes sont possibles :</p><p><b>1) La plus rapide : trouver un contre-exemple.</b> Il suffit de trouver un seul exemple pour lequel les deux expressions donnent des résultats différents.</p><p><b>2) L'utilisation du calcul littéral.</b> Cette méthode n'est pas toujours possible.</p></div>
  <p><b>Exemple :</b> ${x} désigne un nombre positif.</p><div class="figs">${rect({top:[["2<i>x</i> + 7",170]], left:"2<i>x</i>", H:70, fill:"color-mix(in srgb,#a9d18e 40%,transparent)", alt:"Rectangle de longueur 2x + 7 et de largeur 2x"})}${rect({top:[["<i>x</i> + 5",150]], left:"3<i>x</i>", H:80, fill:"color-mix(in srgb,#c9a0dc 40%,transparent)", alt:"Rectangle de longueur x + 5 et de largeur 3x"})}</div>
  <p>Anna affirme : « Ces deux rectangles ont toujours la même aire, quelle que soit la valeur de ${x}. » Anna a-t-elle raison ?</p>
  <p><b>Résolution 1 : trouver un contre-exemple.</b> Je calcule l'aire des deux rectangles pour ${x} = 2.</p>
  ${two(`<p class="calc">${lineP("A1",["(2 × 2 + 7) × (2 × 2)","11 × 4","<b>44</b>"])}</p>`,`<p class="calc">${lineP("A2",["(2 + 5) × (3 × 2)","7 × 6","<b>42</b>"])}</p>`)}
  <p>L'aire A1 du premier rectangle est égale à 44 et l'aire A2 du deuxième est égale à 42.</p><p>Donc Anna a tort : les aires des deux rectangles ne sont pas toujours égales, car 42 ≠ 44.</p>
  <p><b>Résolution 2 : démonstration.</b></p>
  ${two(`<p class="calc">${lineP("A1",[`(2${x} + 7) × 2${x}`,`2${x} × 2${x} + 2${x} × 7`,`<b>${S([prod([2,"x"],[2,"x"]),prod([2,"x"],[7,""])])}</b>`])}</p>`,`<p class="calc">${lineP("A2",[`(${x} + 5) × 3${x}`,`3${x} × ${x} + 3${x} × 5`,`<b>${S([prod([3,"x"],[1,"x"]),prod([3,"x"],[5,""])])}</b>`])}</p>`)}
  <p>L'aire A1 est égale à 4${x}<sup>2</sup> + 14${x} et l'aire A2 est égale à 3${x}<sup>2</sup> + 15${x}.</p><p>Donc Anna a tort : les aires des deux rectangles ne sont pas égales quelle que soit la valeur de ${x}, car 4${x}<sup>2</sup> + 14${x} ≠ 3${x}<sup>2</sup> + 15${x}.</p>`},
{k:"III", t:"Méthode générale face à ce type d'exercices", h:`
  <p>Lorsque tu dois démontrer si deux expressions sont toujours égales ou non, la méthode générale est la suivante :</p>
  <div class="retenir" data-l="Méthode"><p><b>1) Je teste les deux expressions avec un nombre.</b> Il est conseillé de tester avec plusieurs nombres pour pouvoir émettre une conjecture.</p>
   <p><b>2) Si les deux expressions ne sont pas égales avec un nombre :</b></p><p>CONCLUSION : pour une valeur, les deux expressions ne sont pas égales. <b>Donc les expressions ne sont pas toujours égales.</b></p>
   <p><b>3) Si les deux expressions sont égales avec ces nombres :</b> cela ne prouve pas qu'elles sont égales pour n'importe quelle valeur. Je dois utiliser le calcul littéral : je teste les deux expressions avec le nombre ${x}, puis je développe et je réduis les expressions.</p>
   <p><b>4) CONCLUSION :</b></p><p>si les deux expressions développées réduites sont égales, <b>les expressions sont toujours égales</b> ;</p><p>si les deux expressions développées réduites ne sont pas égales, <b>les expressions ne sont pas toujours égales</b>.</p></div>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Démontrer que deux expressions sont égales ou non", e:[
  {n:"Activité 1", t:"Deux programmes de calcul", w:"Sur ton cahier", h:`${progs(prog("Programme 1",["Choisir un nombre","Multiplier par 3","Ajouter 15"]),prog("Programme 2",["Choisir un nombre","Ajouter 5","Multiplier par 3"]))}<p>Si on choisit un même nombre au départ, est-ce que les programmes 1 et 2 donneront toujours le même résultat ? <b>Justifie soigneusement.</b></p>`,
   c:`<p>Si je teste les deux programmes avec le nombre 4 :</p>${two(`<p class="calc">${lineP("P1",["4 × 3 + 15","12 + 15","<b>27</b>"])}</p>`,`<p class="calc">${lineP("P2",["(4 + 5) × 3","9 × 3","<b>27</b>"])}</p>`)}
   <p>Même si avec un nombre les deux programmes donnent le même résultat, je ne peux pas conclure que les programmes donneront toujours le même résultat.</p><p>Je vais donc tester avec un autre nombre : 6 par exemple.</p>
   ${two(`<p class="calc">${lineP("P1",["6 × 3 + 15","18 + 15","<b>33</b>"])}</p>`,`<p class="calc">${lineP("P2",["(6 + 5) × 3","11 × 3","<b>33</b>"])}</p>`)}
   <p>Avec deux nombres, les programmes donnent le même résultat. Mais je ne peux toujours pas dire que ce sera vrai pour <b>tous</b> les nombres : il y en a une infinité, je ne peux pas tous les tester. C'est pour ça que je dois utiliser le calcul littéral.</p>
   <p>Je note ${x} le nombre de départ :</p>${two(`<p class="calc">${lineP("P1",[`${x} × 3 + 15`,`<b>3${x} + 15</b>`])}</p>`,`<p class="calc">${lineP("P2",[`(${x} + 5) × 3`,`3 × ${x} + 3 × 5`,`<b>3${x} + 15</b>`])}</p><p><i>Je développe à l'aide de la simple distributivité.</i></p>`)}
   <p>Comme ${x} représente n'importe quel nombre, on peut conclure : si on choisit un même nombre au départ, <b>les deux programmes donneront toujours le même résultat</b>.</p>`},
  {n:"Exercice 1", t:"Deux programmes de calcul", w:"Sur ton cahier", h:`${progs(prog("Programme 1",["Choisir un nombre","Multiplier par 2","Soustraire 6"]),prog("Programme 2",["Choisir un nombre","Soustraire 3","Multiplier par 2"]))}<p>Si je choisis le même nombre de départ, est-ce que les programmes 1 et 2 donneront toujours le même résultat ?</p>`,
   c:`<p>Je teste avec 4 et avec 10 :</p>${two(`<p class="calc">${lineP("P1",["4 × 2 − 6","8 − 6","<b>2</b>"])}<br>${lineP("P1",["10 × 2 − 6","20 − 6","<b>14</b>"])}</p>`,`<p class="calc">${lineP("P2",["(4 − 3) × 2","1 × 2","<b>2</b>"])}<br>${lineP("P2",["(10 − 3) × 2","7 × 2","<b>14</b>"])}</p>`)}
   <p>Il me semble que les deux programmes donnent toujours le même résultat. Prouvons-le ! Je note ${x} le nombre de départ :</p>
   ${two(`<p class="calc">${lineP("P1",[`${x} × 2 − 6`,`<b>2${x} − 6</b>`])}</p>`,`<p class="calc">${lineP("P2",[`(${x} − 3) × 2`,`2 × ${x} + 2 × (−3)`,`2${x} + (−6)`,`<b>2${x} − 6</b>`])}</p>`)}
   <p>Avec ${x} comme nombre de départ, les deux programmes donnent 2${x} − 6.</p><p>Donc, si on choisit un même nombre au départ, <b>les deux programmes donneront toujours le même résultat</b>.</p>`},
  {n:"Exercice 2", t:"Deux rectangles", w:"Sur ton cahier", h:`<p>${x} désigne un nombre positif.</p><div class="figs">${rect({top:[["<i>x</i> + 4",140]], left:"3<i>x</i>", H:80, fill:"color-mix(in srgb,#a9d18e 40%,transparent)", alt:"Rectangle de longueur x + 4 et de largeur 3x"})}${rect({top:[["3<i>x</i> + 12",180]], left:"<i>x</i>", H:50, fill:"color-mix(in srgb,#c9a0dc 40%,transparent)", alt:"Rectangle de longueur 3x + 12 et de largeur x"})}</div><p>Démontre que ces deux rectangles ont la même aire, quelle que soit la valeur de ${x}.</p>`,
   c:`<p>On demande de <b>démontrer que les aires sont égales</b> : chercher un contre-exemple n'a pas d'utilité ici. On exprime l'aire de chaque rectangle en fonction de ${x} :</p>
   ${two(`<p class="calc">${lineP("A1",[`(${x} + 4) × 3${x}`,`3${x} × ${x} + 3${x} × 4`,`<b>${S([prod([3,"x"],[1,"x"]),prod([3,"x"],[4,""])])}</b>`])}</p>`,`<p class="calc">${lineP("A2",[`(3${x} + 12) × ${x}`,`${x} × 3${x} + ${x} × 12`,`<b>${S([prod([1,"x"],[3,"x"]),prod([1,"x"],[12,""])])}</b>`])}</p>`)}
   <p>L'aire du rectangle vert est 3${x}<sup>2</sup> + 12${x} et l'aire du rectangle violet est 3${x}<sup>2</sup> + 12${x}.</p><p><b>Les deux rectangles auront toujours la même aire.</b></p>`},
  {n:"Exercice 3", t:"Deux autres programmes", w:"Sur ton cahier", h:`${progs(prog("Programme 1",["Choisir un nombre","Ajouter 3","Multiplier par 5"]),prog("Programme 2",["Choisir un nombre","Soustraire 2","Multiplier par 4"]))}<p>Si je choisis le même nombre de départ, est-ce que les programmes 1 et 2 donneront toujours le même résultat ?</p>`,
   c:`<p>Je teste les deux programmes avec 1 :</p>${two(`<p class="calc">${lineP("P1",["(1 + 3) × 5","4 × 5","<b>20</b>"])}</p>`,`<p class="calc">${lineP("P2",["(1 − 2) × 4","(−1) × 4","<b>−4</b>"])}</p>`)}
   <p>Avec 1 comme nombre de départ, les programmes ne donnent pas le même résultat (20 ≠ −4).</p><p>C'est un contre-exemple : <b>les programmes ne donnent pas toujours le même résultat</b>.</p>`},
  {n:"Exercice 4", t:"Deux périmètres", w:"Sur ton cahier", h:`${sqTri("<i>x</i> + 5","<i>x</i> + 10","2<i>x</i>")}<p>Sachant que ${x} est un nombre positif, ces deux figures ont-elles toujours le même périmètre ?</p><p>Le carré a pour côté ${x} + 5. Le triangle a deux côtés de longueur ${x} + 10 et un côté de longueur 2${x}.</p>`,
   c:`<p>Je teste avec le nombre 1, puis avec le nombre 3 :</p>${two(`<p class="calc">${lineP("P1",["(1 + 5) × 4","6 × 4","<b>24</b>"])}<br>${lineP("P1",["(3 + 5) × 4","8 × 4","<b>32</b>"])}</p>`,`<p class="calc">${lineP("P2",["(1 + 10) × 2 + 2 × 1","11 × 2 + 2","<b>24</b>"])}<br>${lineP("P2",["(3 + 10) × 2 + 2 × 3","13 × 2 + 6","<b>32</b>"])}</p>`)}
   <p>Avec 1 et avec 3, les deux figures ont le même périmètre. Il me semble que ce sera toujours le cas. Prouvons-le ! J'écris les périmètres avec ${x} :</p>
   ${two(`<p class="calc">${lineP("P1",[`(${x} + 5) × 4`,`4 × ${x} + 4 × 5`,`<b>4${x} + 20</b>`])}</p>`,`<p class="calc">${lineP("P2",[`(${x} + 10) × 2 + 2${x}`,`2 × ${x} + 2 × 10 + 2${x}`,`2${x} + 20 + 2${x}`,`<b>${S([[2,"x"],[20,""],[2,"x"]])}</b>`])}</p>`)}
   <p>Avec ${x}, les périmètres sont égaux à 4${x} + 20.</p><p>Donc <b>les deux figures auront toujours le même périmètre</b>.</p>`},
  {n:"Exercice 5", t:"Tour de magie", w:"Sur ton cahier", h:`<p>Choisis un nombre. Je te demande d'ajouter 3 au nombre que tu as choisi, ensuite de multiplier le tout par 2 et enfin de soustraire le double de ton nombre de départ.</p><p>Après quelques secondes de réflexion, je pense que ton résultat sera égal à 6.</p><p><b>Comment ai-je fait pour trouver la réponse ? Explique.</b></p>`,
   c:`<p>J'essaie avec 2, avec 5 et avec 7 :</p><div class="calcs"><span class="calc">${lineP("A",["(2 + 3) × 2 − 2 × 2","5 × 2 − 4","10 − 4","<b>6</b>"])}</span><span class="calc">${lineP("B",["(5 + 3) × 2 − 2 × 5","8 × 2 − 10","16 − 10","<b>6</b>"])}</span><span class="calc">${lineP("C",["(7 + 3) × 2 − 2 × 7","10 × 2 − 14","20 − 14","<b>6</b>"])}</span></div>
   <p>Avec ces trois tests, j'obtiens 6 à chaque fois. Cela ne suffit pas à dire que je trouverai 6 à chaque fois : j'utilise le calcul littéral. Mon nombre de départ est ${x}.</p>
   <p class="calc">${lineP("D",[`(${x} + 3) × 2 − 2 × ${x}`,`2 × ${x} + 2 × 3 − 2${x}`,`2${x} + 6 − 2${x}`,`<b>${S([[2,"x"],[6,""],[-2,"x"]])}</b>`])}</p><p>2${x} et −2${x} s'annulent.</p>
   <p>Quel que soit le nombre choisi au départ, <b>on obtient toujours 6</b> : c'est pour cela que je connaissais la réponse.</p>`},
  {n:"Exercice 6", t:"Égales pour une valeur… et pour toutes ?", w:"Sur ton cahier", h:`<p>${x} désigne un nombre positif.</p><div class="figs">${rect({top:[["4<i>x</i> + 2",160]], left:"2<i>x</i>", H:70, fill:"color-mix(in srgb,#a9d18e 40%,transparent)", alt:"Rectangle de longueur 4x + 2 et de largeur 2x"})}${rect({top:[["3<i>x</i> + 1",130]], left:"3<i>x</i>", H:60, fill:"color-mix(in srgb,#c9a0dc 40%,transparent)", alt:"Rectangle de longueur 3x + 1 et de largeur 3x"})}</div>
   <p><b>a)</b> Démontre que pour ${x} = 1, les aires de ces deux rectangles sont égales.</p><p><b>b)</b> Ces rectangles ont-ils la même aire quelle que soit la valeur de ${x} ? <b>Justifie.</b></p>`,
   c:`<p><b>a)</b> Avec ${x} = 1 :</p>${two(`<p class="calc">${lineP("A1",["(4 × 1 + 2) × 2 × 1","(4 + 2) × 2","6 × 2","<b>12</b>"])}</p>`,`<p class="calc">${lineP("A2",["(3 × 1 + 1) × 3 × 1","(3 + 1) × 3","4 × 3","<b>12</b>"])}</p>`)}<p>Pour ${x} = 1, les aires des deux rectangles sont égales.</p>
   <p><b>b)</b> On essaie avec ${x} = 2 :</p>${two(`<p class="calc">${lineP("A1",["(4 × 2 + 2) × 2 × 2","10 × 4","<b>40</b>"])}</p>`,`<p class="calc">${lineP("A2",["(3 × 2 + 1) × 3 × 2","7 × 6","<b>42</b>"])}</p>`)}
   <p>Avec ${x} = 2, les rectangles n'ont pas la même aire (40 ≠ 42) : c'est un contre-exemple. <b>Les rectangles n'auront donc pas toujours la même aire.</b></p>`}
 ]},
{t:"Démontrer avec la double distributivité", e:[
  {n:"Activité 2", t:"Conjecturer, puis démontrer", w:"Sur ton cahier", h:`${progs(prog("Programme 1",["Choisir un nombre","Soustraire 8","Multiplier par le nombre de départ","Ajouter 16"]),prog("Programme 2",["Choisir un nombre","Soustraire 4","Élever le tout au carré"]))}
   <p><b>1)</b> Teste chaque programme avec le nombre 3.</p><p><b>2)</b> Teste chaque programme avec le nombre de ton choix.</p><p><b>3)</b> Que constate-t-on ? Émets une conjecture (une conjecture est une hypothèse).</p><p><b>4)</b> Démontre ensuite si la conjecture émise à la question précédente est vraie ou fausse.</p><p><i>Aide : « élever 5 au carré » signifie « calculer 5<sup>2</sup> » ; (…)<sup>2</sup> = (…) × (…).</i></p>`,
   c:`<p><b>1)</b></p>${two(`<p class="calc">${lineP("P1",["(3 − 8) × 3 + 16","−5 × 3 + 16","−15 + 16","<b>1</b>"])}</p>`,`<p class="calc">${lineP("P2",["(3 − 4)<sup>2</sup>","(−1)<sup>2</sup>","<b>1</b>"])}</p>`)}<p>Avec le nombre de départ 3, on obtient le même résultat.</p>
   <p><b>2)</b> On peut essayer avec le nombre 6 :</p>${two(`<p class="calc">${lineP("P1",["(6 − 8) × 6 + 16","−2 × 6 + 16","−12 + 16","<b>4</b>"])}</p>`,`<p class="calc">${lineP("P2",["(6 − 4)<sup>2</sup>","2<sup>2</sup>","<b>4</b>"])}</p>`)}<p>Avec le nombre de départ 6, on obtient le même résultat.</p>
   <p><b>3)</b> Avec 3 et 6, on obtient le même résultat avec les deux programmes. On peut émettre la conjecture : « Quel que soit le nombre de départ, les deux programmes donneront toujours le même résultat. » C'est une hypothèse : on ne sait pas encore si c'est vrai.</p>
   <p><b>4)</b> On utilise le calcul littéral. Mon nombre de départ est ${x}.</p>
   ${two(`<p class="calc">${lineP("P1",[`(${x} − 8) × ${x} + 16`,`${x} × ${x} + ${x} × (−8) + 16`,`<b>${R([[1,"x2"],[-8,"x"],[16,""]])}</b>`])}</p>`,`<p class="calc">${lineP("P2",[`(${x} − 4)<sup>2</sup>`,`(${x} − 4) × (${x} − 4)`,`${x} × ${x} + ${x} × (−4) + (−4) × ${x} + (−4) × (−4)`,`${x}<sup>2</sup> + (−4${x}) + (−4${x}) + 16`,`<b>${R(dev2([[1,"x"],[-4,""]],[[1,"x"],[-4,""]]).ps)}</b>`])}</p><p><i>Rappel : (…)<sup>2</sup> = (…) × (…), puis je développe avec la double distributivité.</i></p>`)}
   <p>En développant, je constate que <b>les deux programmes donneront toujours le même résultat, quel que soit ${x}</b> : la conjecture est vraie.</p>`},
  {n:"Exercice 7", t:"L'hexagone et le rectangle", w:"Sur ton cahier", h:`<p>Voici deux figures de côtés variables, où ${x} désigne un nombre positif supérieur à 9.</p>${EX7FIG}<p>L'hexagone BCDEFG est le carré ACDE de côté ${x} − 5 auquel on a enlevé le carré ABGF de côté 4.</p>
   <p><b>a)</b> Calcule l'aire de chacune des figures pour ${x} = 10 et pour ${x} = 15.</p><p><b>b)</b> Suite aux calculs de la question a), quelle conjecture peux-tu émettre ?</p><p><b>c)</b> Démontre ensuite cette conjecture.</p>`,
   c:`<p><b>a)</b> Pour ${x} = 10 :</p>${two(`<p class="calc">${lineP("A1",["(10 − 5)<sup>2</sup> − 4<sup>2</sup>","5<sup>2</sup> − 16","25 − 16","<b>9</b>"])}</p>`,`<p class="calc">${lineP("A2",["(10 − 1)(10 − 9)","9 × 1","<b>9</b>"])}</p>`)}
   <p>Pour ${x} = 15 :</p>${two(`<p class="calc">${lineP("A1",["(15 − 5)<sup>2</sup> − 4<sup>2</sup>","10<sup>2</sup> − 16","100 − 16","<b>84</b>"])}</p>`,`<p class="calc">${lineP("A2",["(15 − 1)(15 − 9)","14 × 6","<b>84</b>"])}</p>`)}
   <p><b>b)</b> Pour ${x} = 10 et ${x} = 15, les aires sont égales. On peut émettre la conjecture : « Les aires seront toujours égales, quelle que soit la valeur de ${x}. »</p>
   <p><b>c)</b> On exprime les aires des figures en fonction de ${x} :</p>
   ${two(`<p class="calc">${lineP("A1",[`(${x} − 5)<sup>2</sup> − 4<sup>2</sup>`,`(${x} − 5)(${x} − 5) − 16`,`${x} × ${x} + ${x} × (−5) + (−5) × ${x} + (−5) × (−5) − 16`,`${x}<sup>2</sup> + (−5${x}) + (−5${x}) + 25 − 16`,`<b>${R([...dev2([[1,"x"],[-5,""]],[[1,"x"],[-5,""]]).ps,[-16,""]])}</b>`])}</p>`,`<p class="calc">${lineP("A2",[`(${x} − 1)(${x} − 9)`,`${x} × ${x} + ${x} × (−9) + (−1) × ${x} + (−1) × (−9)`,`${x}<sup>2</sup> + (−9${x}) + (−${x}) + 9`,`<b>${R(dev2([[1,"x"],[-1,""]],[[1,"x"],[-9,""]]).ps)}</b>`])}</p>`)}
   <p>En développant, je constate que <b>les deux aires seront toujours égales, quel que soit ${x}</b> : la conjecture est vraie.</p>`},
  {n:"Exercice 8", t:"Périmètre et aire", w:"Sur ton cahier", h:`<p>${x} désigne un nombre positif et inférieur à 5.</p>${ex8fig(5)}<p>Figure 1 : un rectangle de largeur ${x} et de longueur 5 + ${x} + ${x} + ${x}.</p><p>Figure 2 : un rectangle de longueur 5 − ${x} et de largeur ${x}, accolé à un carré de côté 2${x}.</p>
   <p><b>a)</b> John affirme : « Pour n'importe quelle valeur de ${x} choisie, les deux figures auront toujours le même périmètre ! » John a-t-il raison ? <b>Justifie.</b></p>
   <p><b>b)</b> Anna affirme : « Pour n'importe quelle valeur de ${x} choisie, les deux figures auront toujours la même aire ! » Anna a-t-elle raison ? <b>Justifie.</b></p>`,
   c:`<p><b>a)</b> On essaie avec ${x} = 4 :</p>${two(`<p class="calc">${lineP("P1",["(5 + 3 × 4) × 2 + 4 × 2","17 × 2 + 8","34 + 8","<b>42</b>"])}</p><p>Le périmètre du rectangle est 42.</p>`,`<p class="calc">${lineP("P2",["(5 − 4) × 2 + 8 × 4","1 × 2 + 32","<b>34</b>"])}</p><p>Le périmètre de la figure 2 est 34.</p>`)}
   <p>Avec ${x} = 4, les figures n'ont pas le même périmètre : <b>John a tort</b>.</p>
   <p><b>b)</b> On essaie avec ${x} = 1, puis avec ${x} = 3 :</p>${two(`<p class="calc">${lineP("A1",["1 × (5 + 3 × 1)","1 × 8","<b>8</b>"])}<br>${lineP("A1",["3 × (5 + 3 × 3)","3 × 14","<b>42</b>"])}</p>`,`<p class="calc">${lineP("A2",["(5 − 1) × 1 + (2 × 1)<sup>2</sup>","4 + 4","<b>8</b>"])}<br>${lineP("A2",["(5 − 3) × 3 + (2 × 3)<sup>2</sup>","6 + 36","<b>42</b>"])}</p>`)}
   <p>Il me semble que les deux figures auront toujours la même aire. Prouvons-le ! J'écris les aires en fonction de ${x} :</p>
   ${two(`<p class="calc">${lineP("A1",[`${x} × (5 + 3${x})`,`${x} × 5 + ${x} × 3${x}`,`<b>${S([[5,"x"],[3,"x2"]])}</b>`])}</p>`,`<p class="calc">${lineP("A2",[`(5 − ${x}) × ${x} + (2${x})<sup>2</sup>`,`${x} × 5 + ${x} × (−${x}) + 4${x}<sup>2</sup>`,`5${x} + (−${x}<sup>2</sup>) + 4${x}<sup>2</sup>`,`<b>${S([[5,"x"],[-1,"x2"],[4,"x2"]])}</b>`])}</p>`)}
   <p>Avec ${x}, les aires sont égales à 5${x} + 3${x}<sup>2</sup>. Donc les aires seront toujours égales : <b>Anna a raison</b>.</p>`}
 ]},
{t:"Exercices en +", e:[
  {n:"Exercice 9", t:"Programmes et carré", w:"Sur ton cahier", h:`${progs(prog("Programme 1",["Choisir un nombre","Ajouter 6","Multiplier par le nombre choisi","Soustraire 3"]),prog("Programme 2",["Choisir un nombre","Multiplier par 2","Soustraire 1","Multiplier par 3","Ajouter le carré du nombre choisi"]))}<p>Si on choisit un même nombre au départ, est-ce que les programmes 1 et 2 donneront toujours le même résultat ? <b>Justifie soigneusement.</b></p>`,
   c:`<p>Je teste chaque programme avec le nombre 5, puis avec le nombre 3 :</p>${two(box("P1",["(5 + 6) × 5 − 3","11 × 5 − 3","<b>52</b>"])+box("P1",["(3 + 6) × 3 − 3","9 × 3 − 3","<b>24</b>"]),box("P2",["(5 × 2 − 1) × 3 + 5<sup>2</sup>","9 × 3 + 25","27 + 25","<b>52</b>"])+box("P2",["(3 × 2 − 1) × 3 + 3<sup>2</sup>","5 × 3 + 9","15 + 9","<b>24</b>"]))}
   <p>Avec 5 et avec 3, on obtient le même résultat. Je pense que, quel que soit le nombre de départ, les deux programmes donneront toujours le même résultat (c'est une hypothèse : on ne sait pas encore si c'est vrai). Je choisis ${x} comme nombre de départ :</p>
   ${two(`<p class="calc">${lineP("P1",[`(${x} + 6) × ${x} − 3`,`${x} × ${x} + 6 × ${x} − 3`,`<b>${R([[1,"x2"],[6,"x"],[-3,""]])}</b>`])}</p>`,`<p class="calc">${lineP("P2",[`(${x} × 2 − 1) × 3 + ${x}<sup>2</sup>`,`(2${x} − 1) × 3 + ${x}<sup>2</sup>`,`3 × 2${x} + 3 × (−1) + ${x}<sup>2</sup>`,`6${x} − 3 + ${x}<sup>2</sup>`,`<b>${R([[6,"x"],[-3,""],[1,"x2"]])}</b>`])}</p>`)}
   <p>Les deux expressions réduites sont égales : <b>les deux programmes donneront toujours le même résultat</b>.</p>`},
  {n:"Exercice 10", t:"Presque pareil…", w:"Sur ton cahier", h:`${progs(prog("Programme 1",["Choisir un nombre","Ajouter 3","Multiplier par le nombre de départ"]),prog("Programme 2",["Choisir un nombre","Multiplier par 3","Ajouter le carré du nombre de départ","Ajouter 1"]))}<p>Si on choisit un même nombre au départ, est-ce que les programmes 1 et 2 donneront toujours le même résultat ? <b>Justifie soigneusement.</b></p>`,
   c:`<p>Je teste chaque programme avec le nombre 5 :</p>${two(box("P1",["(5 + 3) × 5","8 × 5","<b>40</b>"]),box("P2",["5 × 3 + 5<sup>2</sup> + 1","15 + 25 + 1","<b>41</b>"]))}<p>Avec le nombre de départ 5, les résultats des deux programmes sont différents (40 ≠ 41). Donc je peux conclure : <b>si on choisit un même nombre au départ, les programmes 1 et 2 ne donneront pas toujours le même résultat</b>.</p>
   <p>On peut aussi le voir avec le calcul littéral. Mon nombre de départ est ${x} :</p>${two(box("P1",[`(${x} + 3) × ${x}`,`${x} × ${x} + 3 × ${x}`,`<b>${R([[1,"x2"],[3,"x"]])}</b>`]),box("P2",[`${x} × 3 + ${x}<sup>2</sup> + 1`,`<b>${R([[3,"x"],[1,"x2"],[1,""]])}</b>`]))}<p>Le programme 2 donne toujours 1 de plus que le programme 1.</p>`},
  {n:"Exercice 11", t:"Programmes A et B", w:"Sur ton cahier", h:`${progs(prog("Programme A",["Choisir un nombre","Soustraire 1","Élever au carré","Soustraire 1"]),prog("Programme B",["Choisir un nombre","Soustraire 2","Multiplier par le nombre choisi"]))}<p>Si on choisit un même nombre au départ, est-ce que les programmes A et B donneront toujours le même résultat ? <b>Justifie soigneusement.</b></p>`,
   c:`<p>Je teste chaque programme avec le nombre 5 :</p>${two(box("A",["(5 − 1)<sup>2</sup> − 1","4<sup>2</sup> − 1","16 − 1","<b>15</b>"]),box("B",["(5 − 2) × 5","3 × 5","<b>15</b>"]))}<p>Avec le nombre de départ 5, on obtient le même résultat. Je pense que les deux programmes donneront toujours le même résultat (c'est une hypothèse). Je choisis ${x} comme nombre de départ :</p>
   ${two(`<p class="calc">${lineP("A",[`(${x} − 1)<sup>2</sup> − 1`,`(${x} − 1)(${x} − 1) − 1`,`${x}<sup>2</sup> − ${x} − ${x} + 1 − 1`,`<b>${R([...dev2([[1,"x"],[-1,""]],[[1,"x"],[-1,""]]).ps,[-1,""]])}</b>`])}</p>`,`<p class="calc">${lineP("B",[`(${x} − 2) × ${x}`,`${x} × ${x} + (−2) × ${x}`,`<b>${R([[1,"x2"],[-2,"x"]])}</b>`])}</p>`)}
   <p>Les deux expressions réduites sont égales : <b>les programmes A et B donneront toujours le même résultat</b>.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Un exemple suffit-il ?", schema:S_MET, q:{
 1:[ {q:"Deux programmes donnent le même résultat avec le nombre 2. Peut-on conclure qu'ils donnent toujours le même résultat ?", c:["Non","Oui"], rep:"Non", ex:"Un exemple ne suffit pas : il faut utiliser le calcul littéral.", sx:S_MET},
     {q:"Pour démontrer que deux expressions sont toujours égales, on…", c:["les calcule avec une lettre, on développe et on réduit","les teste avec trois nombres","les teste avec le nombre 0"], rep:"les calcule avec une lettre, on développe et on réduit", sx:S_EG} ],
 2:[ {q:"Deux programmes donnent des résultats différents avec le nombre 3. Que peut-on conclure ?", c:["Ils ne donnent pas toujours le même résultat","On ne peut rien conclure","Ils donnent toujours des résultats différents"], rep:"Ils ne donnent pas toujours le même résultat", ex:"Un seul contre-exemple suffit.", sx:S_CE},
     {q:"Une conjecture, c'est…", c:["une hypothèse que l'on doit encore démontrer","une propriété démontrée","un contre-exemple"], rep:"une hypothèse que l'on doit encore démontrer", sx:S_MET} ],
 3:[ {q:"Deux expressions sont égales pour x = 1 et pour x = 2. Quelle est la bonne démarche ?", c:["Les développer et les réduire avec x","Conclure qu'elles sont toujours égales","Tester avec x = 3 et conclure"], rep:"Les développer et les réduire avec x", ex:"Il y a une infinité de nombres : on ne peut pas tous les tester.", sx:S_MET} ]
}},
{nom:"Démontrer l'égalité de deux programmes", schema:S_EG, q:{
 1:[ {g:()=>{ const k=ri(2,9), b=ri(1,9); return {q:`Programme : « Choisir un nombre ${x} ; ajouter ${b} ; multiplier par ${k} ». Quelle expression réduite donne le résultat ?`, c:ch3(S([[k,"x"],[k*b,""]]),[S([[k,"x"],[b,""]]), S([[1,"x"],[k*b,""]]), E([[k+b,"x"]])]), rep:S([[k,"x"],[k*b,""]]), ex:`(${x} + ${b}) × ${k} = ${k} × ${x} + ${k} × ${b} = ${S([[k,"x"],[k*b,""]])}.`, sx:S_EG}; }} ],
 2:[ {g:()=>{ const k=ri(2,6), b=ri(1,9), ok=Math.random()<0.5, c=ok?k*b:k*b+pick([-2,-1,1,2]); return {q:`Programme 1 : « ${x} ; multiplier par ${k} ; ajouter ${c} ». Programme 2 : « ${x} ; ajouter ${b} ; multiplier par ${k} ». Donnent-ils toujours le même résultat ?`, c:["Oui","Non"], rep:ok?"Oui":"Non", ex:`<br>P1 = ${x} × ${k} + ${c}<br>P1 = ${S([[k,"x"],[c,""]])}<br>P2 = (${x} + ${b}) × ${k}<br>P2 = ${S([[k,"x"],[k*b,""]])}<br>${ok?"Ce sont les mêmes expressions.":"Les expressions réduites sont différentes."}`, sx:S_EG}; }} ],
 3:[ {g:()=>{ const a=ri(2,9), k=ri(2,5); return {q:`« Choisis un nombre ; ajoute ${a} ; multiplie par ${k} ; soustrais ${k} fois le nombre de départ. » Quel est toujours le résultat ?`, c:ch3(String(k*a),[String(a), String(k), String(k+a)]), rep:String(k*a), ex:`(${x} + ${a}) × ${k} − ${k}${x} = ${k}${x} + ${k*a} − ${k}${x} = ${k*a}.`, sx:S_EG}; }},
     {g:()=>{ const a=ri(2,6), r=R([[1,"x2"],[-2*a,"x"],[a*a,""]]); return {q:`Pour tout nombre ${x}, (${x} − ${2*a}) × ${x} + ${a*a} est égal à…`, c:ch3(`(${x} − ${a})<sup>2</sup>`,[`${x}<sup>2</sup> + ${a*a}`, `(${x} + ${a})<sup>2</sup>`]), rep:`(${x} − ${a})<sup>2</sup>`, ex:`On développe les deux expressions :<br>A = (${x} − ${2*a}) × ${x} + ${a*a}<br>A = ${r}<br>B = (${x} − ${a})<sup>2</sup><br>B = (${x} − ${a})(${x} − ${a})<br>B = ${r}`, sx:S_EG}; }} ]
}},
{nom:"Trouver un contre-exemple", schema:S_CE, q:{
 1:[ {g:()=>{ const b=ri(1,6), k=ri(2,5); const t=ri(1,6); return {q:`Programme 1 : « ${x} ; ajouter ${b} ; multiplier par ${k} ». Programme 2 : « ${x} ; multiplier par ${k} ; ajouter ${b} ». Avec ${t}, quels résultats obtient-on ?`, c:ch3(`${(t+b)*k} et ${t*k+b}`,[`${(t+b)*k} et ${(t+b)*k}`, `${t*k+b} et ${t*k+b}`]), rep:`${(t+b)*k} et ${t*k+b}`, ex:`(${t} + ${b}) × ${k} = ${(t+b)*k} et ${t} × ${k} + ${b} = ${t*k+b} : c'est un contre-exemple, les programmes ne donnent pas toujours le même résultat.`, sx:S_CE}; }} ],
 2:[ {g:()=>{ const t=2; return {q:`Les aires (2${x} + 7) × 2${x} et (${x} + 5) × 3${x} sont-elles toujours égales ?`, c:["Non : pour x = 2, on trouve 44 et 42","Oui : pour x = 0, on trouve 0 et 0","On ne peut pas savoir"], rep:"Non : pour x = 2, on trouve 44 et 42", ex:"Un seul contre-exemple suffit à montrer qu'elles ne sont pas toujours égales.", sx:S_CE}; }} ],
 3:[ {g:()=>{ const p=ri(2,5), q=p+ri(1,3); const A1=[[2*p,"x2"],[2*q,"x"]]; return {q:`Deux rectangles ont pour aires A1 = ${2}${x}(${p}${x} + ${q}) et A2 = ${x}(${2*p}${x} + ${2*q}). Sont-elles toujours égales ?`, c:["Oui","Non"], rep:"Oui", ex:`A1 = ${S([[2*p,"x2"],[2*q,"x"]])} et A2 = ${S([[2*p,"x2"],[2*q,"x"]])} : en développant, on trouve la même expression.`, sx:S_EG}; }},
     {q:"Un exemple suffit-il pour démontrer que deux expressions ne sont pas égales ?", c:["Oui, un seul contre-exemple suffit","Non, il faut en trouver plusieurs","Non, il faut toujours développer"], rep:"Oui, un seul contre-exemple suffit", sx:S_CE} ]
}},
{nom:"Aires et périmètres", schema:S_EG, q:{
 1:[ {g:()=>{ const p=ri(2,9); const ok=Math.random()<0.5, q=ok?2*p:2*p+pick([1,2,3]); return {q:`Un carré a pour côté ${x} + ${p}. Un triangle a deux côtés de longueur ${x} + ${q} et un côté de longueur 2${x}. Ont-ils toujours le même périmètre ?`, c:["Oui","Non"], rep:ok?"Oui":"Non", ex:`Carré : 4(${x} + ${p}) = ${S([[4,"x"],[4*p,""]])}. Triangle : 2(${x} + ${q}) + 2${x} = ${S([[4,"x"],[2*q,""]])}.`, sx:S_EG}; }} ],
 2:[ {g:()=>{ const k=ri(2,5), p=ri(1,9); return {q:`Quelle est l'aire d'un rectangle de longueur ${x} + ${p} et de largeur ${k}${x} ?`, c:ch3(S([[k,"x2"],[k*p,"x"]]),[S([[k,"x"],[k*p,""]]), S([[k,"x2"],[p,""]]), S([[k+p,"x2"]])]), rep:S([[k,"x2"],[k*p,"x"]]), ex:`(${x} + ${p}) × ${k}${x} = ${k}${x} × ${x} + ${k}${x} × ${p} = ${S([[k,"x2"],[k*p,"x"]])}.`, sx:S_EG}; }} ],
 3:[ {g:()=>{ const b=ri(1,3), a=b+ri(1,4), r=R([[1,"x2"],[-2*a,"x"],[a*a-b*b,""]]); return {q:`Pour tout ${x} assez grand, (${x} − ${a})<sup>2</sup> − ${b*b} est égal à…`, c:ch3(`(${x} − ${a-b})(${x} − ${a+b})`,[`(${x} − ${a})(${x} − ${b})`, `(${x} − ${a+b})<sup>2</sup>`]), rep:`(${x} − ${a-b})(${x} − ${a+b})`, ex:`Les deux expressions se développent en ${r} (comme dans l'exercice 7 : (${x} − 5)<sup>2</sup> − 4<sup>2</sup> = (${x} − 1)(${x} − 9)).`, sx:S_EG}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 21", duree:55, info:"Durée : 55 min · Calculatrice non autorisée · Règle et crayon",
comp:[
  ["RAISONNER","Je sais qu'un exemple ne suffit pas et qu'un contre-exemple suffit.","Ex. 1 et 3 (7 points)"],
  ["RAISONNER","Je teste, j'émets une conjecture et je la démontre avec le calcul littéral.","Ex. 2 (5 points)"],
  ["MODÉLISER","J'exprime des périmètres et des aires en fonction de x pour les comparer.","Ex. 4 et 5 (8 points)"]
],
exos:[
{t:"Vrai ou faux ?", p:3, h:`<p>Réponds par Vrai ou Faux, puis explique en une phrase.</p><p><b>a)</b> Si deux expressions sont égales pour ${x} = 2, alors elles sont toujours égales.</p><p><b>b)</b> Un seul contre-exemple suffit pour montrer que deux expressions ne sont pas toujours égales.</p><p><b>c)</b> Pour démontrer que deux expressions sont toujours égales, on les développe et on les réduit avec la lettre ${x}.</p>`,
 c:`<p><b>a)</b> Faux : un exemple ne suffit pas, il y a une infinité de nombres. <i>(1 point)</i></p><p><b>b)</b> Vrai : si les résultats sont différents pour un nombre, les expressions ne sont pas toujours égales. <i>(1 point)</i></p><p><b>c)</b> Vrai : ${x} représente n'importe quel nombre. <i>(1 point)</i></p>`},
{t:"Les deux programmes de Malo", p:5, h:`${progs(prog("Programme 1",["Choisir un nombre","Multiplier par 4","Ajouter 10"]),prog("Programme 2",["Choisir un nombre","Ajouter 5","Multiplier par 2","Ajouter le double du nombre de départ"]))}<p><b>a)</b> Teste les deux programmes avec le nombre 3.</p><p><b>b)</b> Quelle conjecture peux-tu émettre ?</p><p><b>c)</b> Démontre cette conjecture.</p>`,
 c:`<p><b>a)</b> Avec le nombre 3 :</p>${two(box("P1",["3 × 4 + 10","12 + 10","<b>22</b>"]),box("P2",["(3 + 5) × 2 + 2 × 3","8 × 2 + 6","16 + 6","<b>22</b>"]))}<p>Les deux programmes donnent 22. <i>(1 point)</i></p><p><b>b)</b> Conjecture : les deux programmes donnent toujours le même résultat. <i>(1 point)</i></p>
  <p><b>c)</b> Je note ${x} le nombre de départ :</p>${two(box("P1",[`${x} × 4 + 10`,`<b>4${x} + 10</b>`]),box("P2",[`(${x} + 5) × 2 + 2 × ${x}`,`2 × ${x} + 2 × 5 + 2${x}`,`2${x} + 10 + 2${x}`,`<b>${S([[2,"x"],[10,""],[2,"x"]])}</b>`]))}<p>Les deux expressions réduites sont égales : les programmes donnent toujours le même résultat. <i>(3 points : 1 pour P1, 1,5 pour P2, 0,5 pour la conclusion)</i></p>`},
{t:"Pas si sûr !", p:4, h:`${progs(prog("Programme 1",["Choisir un nombre","Ajouter 2","Multiplier par 3"]),prog("Programme 2",["Choisir un nombre","Multiplier par 3","Ajouter 2"]))}<p>Zoé affirme que ces deux programmes donnent toujours le même résultat.</p><p><b>a)</b> Montre avec un contre-exemple que Zoé a tort.</p><p><b>b)</b> Retrouve ce résultat avec le calcul littéral.</p>`,
 c:`<p><b>a)</b> Avec le nombre 1 :</p>${two(box("P1",["(1 + 2) × 3","3 × 3","<b>9</b>"]),box("P2",["1 × 3 + 2","3 + 2","<b>5</b>"]))}<p>9 ≠ 5 : c'est un contre-exemple, Zoé a tort. <i>(2 points)</i></p><p><b>b)</b> Je note ${x} le nombre de départ :</p>${two(box("P1",[`(${x} + 2) × 3`,`3 × ${x} + 3 × 2`,`<b>${S([[3,"x"],[6,""]])}</b>`]),box("P2",[`${x} × 3 + 2`,`<b>${S([[3,"x"],[2,""]])}</b>`]))}<p>Les expressions réduites ne sont pas égales (le programme 1 donne toujours 4 de plus). <i>(2 points)</i></p>`},
{t:"Le rectangle et le triangle", p:4, h:`<p>${x} désigne un nombre positif.</p><p>Un rectangle a pour longueur 2${x} + 1 et pour largeur ${x} + 3.</p><p>Un triangle a deux côtés de longueur 2${x} + 2 et un côté de longueur 2${x} + 4.</p>${CL21_RT()}<p>Ces deux figures ont-elles toujours le même périmètre ? <b>Justifie.</b></p>`,
 c:`<p>On note P1 le périmètre du rectangle et P2 celui du triangle.</p>${two(box("P1",[`(2${x} + 1) × 2 + (${x} + 3) × 2`,`2 × 2${x} + 2 × 1 + 2 × ${x} + 2 × 3`,`4${x} + 2 + 2${x} + 6`,`<b>${S([[4,"x"],[2,""],[2,"x"],[6,""]])}</b>`])+"<p><i>(1,5 point)</i></p>",box("P2",[`(2${x} + 2) × 2 + 2${x} + 4`,`2 × 2${x} + 2 × 2 + 2${x} + 4`,`4${x} + 4 + 2${x} + 4`,`<b>${S([[4,"x"],[4,""],[2,"x"],[4,""]])}</b>`])+"<p><i>(1,5 point)</i></p>")}<p>Les deux expressions réduites sont égales : les deux figures ont toujours le même périmètre. <i>(1 point)</i></p>`},
{t:"Le carré et le rectangle", p:4, h:`<p>${x} désigne un nombre positif. Un carré a pour côté ${x} + 3. Un rectangle a pour longueur ${x} + 5 et pour largeur ${x} + 1.</p><p>Lou affirme : « Le carré et le rectangle ont toujours la même aire. »</p><p><b>a)</b> Calcule les deux aires pour ${x} = 1. Lou a-t-elle raison ?</p><p><b>b)</b> Développe et réduis les deux aires. De combien l'aire du carré dépasse-t-elle toujours celle du rectangle ?</p>`,
 c:`<p>On note A1 l'aire du carré et A2 celle du rectangle.</p><p><b>a)</b> Pour ${x} = 1 :</p>${two(box("A1",["(1 + 3)<sup>2</sup>","4<sup>2</sup>","<b>16</b>"]),box("A2",["(1 + 5) × (1 + 1)","6 × 2","<b>12</b>"]))}<p>16 ≠ 12 : Lou a tort. <i>(2 points)</i></p><p><b>b)</b></p>${two(box("A1",[`(${x} + 3)<sup>2</sup>`,`(${x} + 3)(${x} + 3)`,`${x} × ${x} + ${x} × 3 + 3 × ${x} + 3 × 3`,`${x}<sup>2</sup> + 3${x} + 3${x} + 9`,`<b>${R(dev2([[1,"x"],[3,""]],[[1,"x"],[3,""]]).ps)}</b>`]),box("A2",[`(${x} + 5)(${x} + 1)`,`${x} × ${x} + ${x} × 1 + 5 × ${x} + 5 × 1`,`${x}<sup>2</sup> + ${x} + 5${x} + 5`,`<b>${R(dev2([[1,"x"],[5,""]],[[1,"x"],[1,""]]).ps)}</b>`]))}<p>L'aire du carré dépasse toujours celle du rectangle de 9 − 5 = 4. <i>(2 points)</i></p>`}
]}
};
/* calculs en chaîne « A = … » dans les explications du QCM (programmes et aires ; outil défini dans 4e-1.js) */
CH["4e-21"].quiz.forEach((N,ni)=>{ if(ni!==1 && ni!==3) return; Object.values(N.q).forEach(list=>list.forEach((it,i)=>{ if(it.g){ const g=it.g; list[i]={g:()=>window.CHN4.qChain(g())}; } else list[i]=window.CHN4.qChain(it); })); });
function CL21_RT(){ return `<div class="figs">${rectL({top:[["2<i>x</i> + 1",170]], left:"<i>x</i> + 3", H:80, alt:"Rectangle de longueur 2x + 1 et de largeur x + 3"})}<svg class="fig" viewBox="0 0 200 170" width="200" role="img" aria-label="Triangle de côtés 2x + 2, 2x + 2 et 2x + 4"><polygon points="30,140 170,140 100,25" class="ln"/>${T_(34,78,"2<i>x</i> + 2")}${T_(168,78,"2<i>x</i> + 2")}${T_(100,162,"2<i>x</i> + 4")}</svg></div>`; }
})();
