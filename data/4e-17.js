/* 4e — Chapitre 17 : Statistiques — vocabulaire, tableaux d'effectifs, diagrammes et moyenne
   (cours D1, feuille d'exercices, consignes de la semaine 5 et feuille de corrections ; les exercices du manuel
   donnés dans les consignes sont repris d'après la feuille de corrections).
   Tous les diagrammes sont dessinés en SVG à partir des valeurs exactes. */
(function(){
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const gcd=(a,b)=>b?gcd(b,a%b):a;
const rd=(x,k=3)=>Math.round(x*10**k)/10**k;
const N=(x,k=3)=>{ const v=rd(x,k); const [i,d]=String(Math.abs(v)).split("."); return (v<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const F=(a,b)=>`{${a}/${b}}`;
const sum=a=>a.reduce((x,y)=>x+y,0);
const eq=x=>Math.abs(rd(x,2)-x)<1e-9?"=":"≈";
/* réponses tapées au centième : « 0,3 » et « 0,30 » */
const VC=x=>{ const s=N(x,2); return /,\d$/.test(s)?[s,s+"0"]:[s]; };

/* ---------- diagrammes (mêmes outils que le chapitre 13 de 5e) ---------- */
const BAR="#4a86c5", BARS="#1f4e79";
const PAL=["#6fa8dc","#f4b183","#a9d18e","#ffd966","#c9a0dc","#9fd4d0","#e6a3a3"];
const T=(x,y,t,st="",a="middle")=>`<text x="${x}" y="${y}" text-anchor="${a}" style="font-size:15px;fill:var(--ink);${st}">${t}</text>`;
function bars(o){
  const {cats, vals, title="", ylab="", xlab="", ymax, ystep=1, ylabStep=2, w=520, H=300} = o;
  const ml=66, mr=14, mt=(title?42:16)+(o.show?18:0), mb=xlab?62:44, pw=w-ml-mr, ph=H-mt-mb;
  const Y=v=>mt+ph-(v/ymax)*ph, n=cats.length, slot=pw/n, bw=Math.min(slot*0.56, 70);
  let s=`<svg class="fig" viewBox="0 0 ${w} ${H}" width="${w}" role="img" aria-label="Diagramme en bâtons${title?" : "+title:""}">`;
  if(title) s+=T(ml+pw/2, 24, title, "font-weight:700;font-size:16px");
  const nk=Math.round(ymax/ystep);
  for(let k=0;k<=nk;k++){ const v=rd(k*ystep), y=Y(v).toFixed(1), big=Math.abs(v/ylabStep-Math.round(v/ylabStep))<1e-9;
    s+=`<line x1="${ml}" y1="${y}" x2="${ml+pw}" y2="${y}" class="gridl"${big?"":' style="stroke-width:.7"'}/>`; if(big) s+=T(ml-8, +y+5, N(v), "", "end"); }
  if(ylab) s+=`<text transform="translate(17 ${mt+ph/2}) rotate(-90)" text-anchor="middle" style="font-size:15px;fill:var(--ink)">${ylab}</text>`;
  vals.forEach((v,i)=>{ const x=ml+slot*i+(slot-bw)/2;
    if(v>0) s+=`<rect x="${x.toFixed(1)}" y="${Y(v).toFixed(1)}" width="${bw.toFixed(1)}" height="${(Y(0)-Y(v)).toFixed(1)}" style="fill:${BAR};stroke:${BARS};stroke-width:1.5"/>`;
    if(o.show) s+=T((x+bw/2).toFixed(1), (Y(v)-7).toFixed(1), N(v), "fill:var(--c);font-weight:700");
    s+=T((x+bw/2).toFixed(1), (Y(0)+22).toFixed(1), cats[i]); });
  if(xlab) s+=T(ml+pw/2, H-10, xlab);
  s+=`<line x1="${ml}" y1="${mt-4}" x2="${ml}" y2="${Y(0)}" class="axe2"/><line x1="${ml}" y1="${Y(0)}" x2="${ml+pw}" y2="${Y(0)}" class="axe2"/>`;
  return s+"</svg>";
}
function pie(o){
  const {vals, title="", R=110, w=420} = o, lab=o.lab||(i=>[o.cats[i]]);
  const tot=sum(vals), cx=w/2, cy=(title?44:12)+R+8, H=cy+R+14;
  let s=`<svg class="fig" viewBox="0 0 ${w} ${H}" width="${w}" role="img" aria-label="Diagramme circulaire${title?" : "+title:""}">`;
  if(title) s+=T(cx, 24, title, "font-weight:700;font-size:16px");
  const P=(a,r=R)=>[cx+r*Math.cos(a*Math.PI/180), cy+r*Math.sin(a*Math.PI/180)];
  let a0=-90;
  vals.forEach((v,i)=>{ const da=v/tot*360, a1=a0+da, [x0,y0]=P(a0), [x1,y1]=P(a1);
    const st=`fill:${PAL[i%PAL.length]};stroke:${BARS};stroke-width:2;stroke-linejoin:round`;
    s+= da>=359.99 ? `<circle cx="${cx}" cy="${cy}" r="${R}" style="${st}"/>` : `<path d="M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 ${da>180?1:0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" style="${st}"/>`;
    a0=a1; });
  a0=-90;
  vals.forEach((v,i)=>{ const da=v/tot*360, am=a0+da/2, L=lab(i), [lx,ly]=P(am, R*(da<40?0.72:0.6));
    L.forEach((t,j)=>{ s+=`<text x="${lx.toFixed(1)}" y="${(ly+5+(j-(L.length-1)/2)*17).toFixed(1)}" text-anchor="middle" style="font-size:${da<30?13:15}px;fill:#1a1a1a">${t}</text>`; });
    a0+=da; });
  return s+"</svg>";
}
const tab=(head,rows)=>`<div class="scroll"><table class="std" style="text-align:center"><thead><tr>${head.map((h,i)=>`<th>${i?h:`<b>${h}</b>`}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;
/* moyenne pondérée : (n1 × v1 + n2 × v2 + …) ÷ total */
const pond=(vals,effs)=>`{${effs.map((n,i)=>`${n} × ${N(vals[i])}`).join(" + ")}/${sum(effs)}}`;
const ymaxOf=(v,step=2)=>Math.ceil((Math.max(...v)+1)/step)*step;

window.ST17={bars,pie,tab,N,F,sum,rd,eq,pond,ymaxOf,gcd};

/* ===================== données du cours ===================== */
const VOIT="blanc blanc rouge noir rouge blanc noir gris noir rouge gris gris gris noir blanc rouge blanc blanc gris gris noir rouge blanc rouge gris rouge noir noir rouge gris blanc gris rouge gris blanc blanc gris blanc noir rouge noir blanc blanc gris noir rouge blanc gris noir rouge".split(" ");
const NOTES=[8,12,13,5,8,10,19,15,15,8,5,12,12,13,13,13,15,19,13,13,13,13,12,19,12,13,15];
const C1=["Blanc","Rouge","Noir","Gris"], E1v=[14,12,11,13];
const V2=[5,8,10,12,13,15,19], E2v=[2,3,1,5,9,4,3];
const B_VOIT=bars({cats:C1, vals:E1v, title:"Voitures vendues en fonction de leur couleur", ylab:"Effectifs", xlab:"Couleur des voitures", ymax:16, ystep:2, ylabStep:2, w:500, H:320});
const B_NOTES=bars({cats:V2.map(String), vals:E2v, title:"Répartition des élèves en fonction de leur note", ylab:"Nombre d'élèves", xlab:"Notes obtenues sur 20", ymax:10, ystep:1, ylabStep:1, w:500, H:320});
const P_VOIT=pie({vals:E1v, title:"Voitures vendues en fonction de leur couleur", lab:i=>[C1[i], [101,86,79,94][i]+"°"]});
const SP=["Foot","Danse","Tennis","Judo","Rugby","Gym"], SPv=[6,3,3,5,2,1];
const SPAM=[3,4,0,5,2,6,3,1,1], MATH=[13,12,9,11,6,11,11,17,19,14,3,12], PLUIE=[10,14,8,16,0,4,6], JOURS=["Lun.","Mar.","Mer.","Jeu.","Ven.","Sam.","Dim."];

/* ===================== schémas ===================== */
const S_VOC=sch("Vocabulaire",`<p class="schN"><b>Population</b> : sur qui (ou quoi) porte l'étude. <b>Caractère</b> : ce que l'on étudie. <b>Valeurs</b> : les réponses possibles.</p><p class="schN">Exemple : on étudie la <b>couleur</b> (caractère) des <b>voitures vendues</b> (population) ; valeurs : blanc, rouge, noir, gris.</p>`);
const S_FREQ=sch("Effectif et fréquence",tab(["Valeurs","Blanc","Rouge","Total"],[["Effectifs","14","12","50"],["Fréquences",`${F(14,50)} = 0,28`,`${F(12,50)} = 0,24`,"1"],["En %","28","24","100"]])+`<p class="schN">Fréquence = {effectif de la valeur/effectif total}.</p>`);
const S_DIAG=sch("Diagramme circulaire",`<p class="calc">angle = effectif × 360 ÷ effectif total<br>Blanc : 14 × 360 ÷ 50 ≈ 101°</p><p class="schN">Le disque entier (360°) représente l'effectif total.</p>`);
const S_MOY=sch("Moyenne d'une série",`<p class="calc">{somme des valeurs/effectif total}</p><p class="calc">M = (13 + 14 + 7 + 8 + 16 + 10 + 9) ÷ 7<br>M = 77 ÷ 7<br>M = 11</p>`);
const S_POND=sch("Moyenne avec un tableau d'effectifs",tab(["Masse (kg)","12","15","20"],[["Effectifs","7","4","5"]])+`<p class="calc">M = {7 × 12 + 4 × 15 + 5 × 20/16}<br>M = {244/16}<br>M = 15,25</p><p class="schN">On multiplie chaque valeur par son effectif, on additionne, puis on divise par l'effectif total.</p>`);

/* ---------- générateurs ---------- */
const POPS=[["les élèves d'une classe","la couleur des yeux","bleu, vert, marron"],["les voitures vendues par un concessionnaire","la couleur","blanc, rouge, noir, gris"],["les étudiants d'une classe de faculté","l'âge","18, 19, 20, 22 et 28"],["les employés d'une entreprise","le métier","programmeur, électronicien, infographiste, commercial"],["les élèves d'une classe de 4e","la note au dernier contrôle","5, 8, 10, 12, 13, 15 et 19"],["les œufs d'une boîte","la masse","55 g, 56 g, …, 65 g"]];
function series(n,lo,hi,int=true){ let v; do{ v=Array.from({length:n},()=>ri(lo,hi)); }while(int && sum(v)%n); return v; }

CH["4e-17"] = {
intro:"Décrire une série statistique (population, caractère, valeurs), construire un tableau d'effectifs, des diagrammes, et calculer une moyenne.",
savoir:[
  "reconnaître la population, le caractère et les valeurs d'une étude statistique ;",
  "construire un tableau d'effectifs et calculer des fréquences (fraction, nombre décimal, pourcentage) ;",
  "construire un diagramme en bâtons et un diagramme circulaire ;",
  "calculer la moyenne d'une série à partir de la liste des valeurs ;",
  "calculer une moyenne à partir d'un tableau d'effectifs ou d'un diagramme."
],

/* ===================== COURS ===================== */
cours:[
{k:"1", t:"Population, caractère et valeurs d'une étude statistique", h:`
  <p>La statistique est la discipline qui étudie des phénomènes à travers la collecte de données.</p><p>Les statistiques permettent également de prévoir des phénomènes : les prévisions météorologiques, les prévisions de la circulation automobile le week-end ou lors des départs en vacances (« Bison futé »)…</p>
  <div class="retenir" data-l="Vocabulaire"><p>Lorsqu'on réalise une <b>étude statistique</b>, on étudie un <b>caractère</b> dans une <b>population</b>.</p>
   <p>– La <b>population</b> est l'ensemble (personnes, animaux, plantes, objets…) sur lequel porte l'étude statistique.</p>
   <p>– Le <b>caractère étudié</b> est le critère que l'on étudie dans la population (couleur, taille, nombre…).</p>
   <p>– Les <b>valeurs</b> sont les valeurs que peut prendre le caractère (bleu ; rouge ; 1,56 m ; 1,23 m…).</p>
   <p>– Une <b>série statistique</b> est l'ensemble des valeurs relevées sur la population étudiée.</p></div>
  <p><b>Étude 1 :</b> on étudie la couleur des voitures vendues par un concessionnaire. Voici la liste des couleurs des voitures dans l'ordre de leur vente :</p>
  <div class="scroll"><table class="std" style="text-align:center"><tbody>${[0,1,2,3,4].map(r=>`<tr>${VOIT.slice(r*10,r*10+10).map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
  <p>– La <b>population</b> étudiée est l'ensemble des <b>voitures</b> vendues.</p><p>– Le <b>caractère</b> étudié est la <b>couleur</b>.</p><p>– Les <b>valeurs</b> sont <b>blanc</b>, <b>rouge</b>, <b>noir</b> et <b>gris</b>.</p>
  <p><b>Étude 2 :</b> voici les notes (sur 20) des élèves d'une classe de 4<sup>e</sup> au dernier contrôle de maths :</p><p class="calc" style="white-space:normal">${NOTES.join(" – ")}</p>
  <p>– La <b>population</b> étudiée est <b>une classe de 4<sup>e</sup></b>.</p><p>– Le <b>caractère</b> étudié est la <b>note obtenue</b>.</p><p>– Les <b>valeurs</b> sont <b>5, 8, 10, 12, 13, 15 et 19</b>.</p>`},
{k:"2", t:"Tableaux d'effectifs et fréquences", h:`
  <div class="retenir" data-l="Vocabulaire"><p>Pour pouvoir étudier et interpréter plus facilement une série statistique, il est intéressant de regrouper les valeurs dans <b>un tableau d'effectifs</b>.</p>
   <p>– L'<b>effectif d'une valeur</b> est le <b>nombre de fois où cette valeur apparaît</b> dans la série statistique.</p>
   <p>– L'<b>effectif total</b> est le <b>nombre total de réponses</b>, c'est-à-dire le nombre total d'individus dans la population étudiée.</p>
   <p>– La <b>fréquence</b> d'une valeur est la proportion d'apparition de cette valeur dans la série : {effectif de la valeur/effectif total}.</p>
   <p>Une fréquence est un <b>nombre compris entre 0 et 1</b>. Elle peut être donnée sous la forme d'une <b>fraction</b>, d'un <b>nombre décimal</b> ou d'un <b>pourcentage</b>.</p></div>
  <p><b>Étude 1 :</b></p><p>– L'<b>effectif de la valeur rouge</b> est <b>12</b>.</p><p>– L'<b>effectif total</b> est <b>50</b>.</p><p>– La <b>fréquence</b> d'apparition de la valeur rouge est égale à <b>{12/50}</b> ou <b>0,24</b> ou <b>24 %</b>.</p><p>Avec la calculatrice, la fréquence f de la valeur rouge :</p><p class="calc">f = {12/50}<br>f = 0,24<br>f = {24/100}<br>f = 24 %</p>
  <p>Voici le tableau d'effectifs :</p>
  ${tab(["Valeurs","Blanc","Rouge","Noir","Gris","Total"],[["Effectifs","14","12","11","13","50"],["Fréquences",`${F(14,50)} = 0,28`,`${F(12,50)} = 0,24`,`${F(11,50)} = 0,22`,`${F(13,50)} = 0,26`,`${F(50,50)} = 1`],["Fréquences (en %)","28","24","22","26","100"]])}
  <p><b>Étude 2 :</b></p><p>– L'<b>effectif de la valeur 5</b> est <b>2</b>.</p><p>– L'<b>effectif total</b> est <b>27</b>.</p><p>– La <b>fréquence</b> d'apparition de la valeur 5 est égale à <b>{2/27}</b> ou environ <b>0,07</b> ou <b>7 %</b>.</p>
  <p>Voici le tableau d'effectifs :</p>
  ${tab(["Valeurs","5","8","10","12","13","15","19","Total"],[["Effectifs",...E2v.map(String),"27"],["Fréquences",...E2v.map(n=>`${F(n,27)} ≈ ${N(n/27,2)}`),`${F(27,27)} = 1`],["Fréquences (en %)","7","11","4","19","33","15","11","100"]])}
  <div class="attention"><b>ATTENTION :</b> chaque fréquence en nombre décimal doit être arrondie au centième. Ici, la somme des pourcentages est bien égale à 100 (7 + 11 + 4 + 19 + 33 + 15 + 11 = 100). À cause des arrondis, il arrive parfois que la somme fasse 99 ou 101.</div>`},
{k:"3", t:"Construction de diagrammes", h:`
  <p>On peut représenter les résultats d'une enquête statistique sous forme graphique : <b>diagramme en bâtons (ou à barres)</b>, <b>diagramme circulaire</b>…</p>
  <h4>a) Diagrammes en bâtons</h4>
  <div class="retenir" data-l="Méthode"><p><b>1)</b> On utilise les deux premières lignes du tableau d'effectifs.</p><p><b>2)</b> Le plus souvent, les effectifs se trouvent sur l'axe des ordonnées et l'autre grandeur sur l'axe des abscisses.</p><p><b>3)</b> On n'oublie pas de noter la grandeur et l'unité sur les deux axes.</p><p><b>4)</b> On donne un titre au diagramme : la grandeur qui se trouve après « en fonction de » se situe sur l'axe des abscisses. Dans l'exemple, on dit « en fonction de leur couleur », et les couleurs se trouvent bien en abscisse.</p></div>
  <div class="figs">${B_VOIT}${B_NOTES}</div>
  <h4>b) Diagrammes circulaires</h4>
  <div class="retenir" data-l="Méthode"><p><b>1)</b> On commence par tracer un cercle de rayon quelconque avec un compas.</p><p><b>2)</b> On utilise ensuite les deux premières lignes du tableau d'effectifs.</p><p><b>3)</b> On calcule l'angle de chaque valeur avec un produit en croix : le disque entier (360°) correspond à l'effectif total.</p><p><b>4)</b> Avec le rapporteur, on trace les angles les uns à la suite des autres.</p></div>
  <p>Nous allons commencer par chercher l'angle que va former la valeur « blanc » sur notre diagramme :</p>
  ${tab(["Valeurs","Blanc","Total"],[["Effectifs","14","50"],["Degrés","?","360"]])}
  <p class="calc">Produit en croix : 14 × 360 ÷ 50 ≈ 101°</p><p>Avec le rapporteur, on trace 101°. De la même façon, on trouve les autres mesures d'angle.</p>
  ${tab(["Valeurs","Blanc","Rouge","Noir","Gris","Total"],[["Effectifs","14","12","11","13","50"],["Degrés","<b>101</b>","<b>86</b>","<b>79</b>","<b>94</b>","360"]])}
  ${P_VOIT}`},
{k:"4", t:"Calculer la moyenne d'une série statistique", h:`
  <p>La <b>moyenne</b> d'une série statistique permet de mesurer la tendance d'une population.</p>
  <div class="retenir" data-l="Définition"><p>La <b>moyenne</b> d'une série statistique est égale à la somme de toutes les valeurs de la série divisée par l'effectif total de la série.</p><p class="calc">moyenne = {somme des valeurs/effectif total}</p></div>
  <p><b>Remarque :</b> on peut calculer la moyenne à partir d'une <b>série statistique</b>, d'un <b>tableau d'effectifs</b> ou d'un <b>diagramme</b>.</p>
  <p><b>Étude 2 : calcul de la moyenne à partir de la série statistique</b></p>
  <p class="calc" style="white-space:normal">M = (${NOTES.join(" + ")}) ÷ 27</p><p class="calc">M = {338/27}<br>M ≈ 12,5</p><p>La note moyenne de la classe est de 12,5 sur 20.</p>
  <p><b>Étude 2 : calcul de la moyenne à partir du tableau d'effectifs</b></p>
  ${tab(["Valeurs","5","8","10","12","13","15","19","Total"],[["Effectifs",...E2v.map(String),"27"]])}
  <p>On pourrait écrire toutes les notes : 5 + 5 + 8 + 8 + 8 + 10 + 12 + … + 19, mais le calcul est un peu long à écrire. On le simplifie de cette façon :</p>
  <div class="retenir" data-l="Méthode"><p>Avec un tableau d'effectifs, on multiplie chaque valeur par son effectif, on additionne ces produits, puis on divise par l'effectif total.</p></div>
  <p class="calc">M = ${pond(V2,E2v)}<br>M = {338/27}<br>M ≈ 12,5</p><p>La note moyenne de la classe est de 12,5 sur 20.</p>
  <div class="attention"><b>ATTENTION :</b> on ne peut pas calculer la moyenne de l'étude 1, car les valeurs (les couleurs) ne sont pas des nombres.</div>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Vocabulaire et tableau d'effectifs", e:[
  {n:"Exercice 1", t:"À la fac", w:"Sur ton cahier", h:`<p>Dans une classe en faculté de langue, on a demandé aux étudiants de donner leur âge. Voici leurs réponses :</p><p class="calc" style="white-space:normal">18 – 18 – 19 – 18 – 22 – 18 – 19 – 19 – 18 – 20 – 18 – 18 – 18 – 20 – 28 – 20 – 18 – 22 – 19 – 19 – 18 – 19 – 19 – 20 – 18 – 18 – 18 – 18 – 19 – 19</p>
   <p><b>1)</b> Recopie ces trois phrases sur ton cahier et complète-les :</p><p>a) La population étudiée est ……</p><p>b) Le caractère étudié est ……</p><p>c) Les valeurs sont ……</p>
   <p><b>2)</b> a) Construis un tableau d'effectifs.</p><p>b) Rajoute une ligne dans ton tableau pour donner la fréquence de chaque valeur sous forme fractionnaire.</p><p>c) Rajoute une dernière ligne dans ton tableau pour donner la fréquence de chaque valeur en pourcentage.</p>`,
   c:`<p><b>1)</b> a) La population étudiée est une classe d'étudiants en faculté de langue.</p><p>b) Le caractère étudié est l'âge.</p><p>c) Les valeurs sont 18, 19, 20, 22 et 28.</p>
   <p><b>2)</b></p>${tab(["Valeurs","18","19","20","22","28","Total"],[["Effectifs","14","9","4","2","1","30"],["Fréquences",F(14,30),F(9,30),F(4,30),F(2,30),F(1,30),`${F(30,30)} = 1`],["Fréquences (en %)","47","30","13","7","3","100"]])}
   <p>Chaque fréquence en nombre décimal est arrondie au centième (par exemple {14/30} ≈ 0,47) pour que la somme des pourcentages soit bien égale à 100 : 47 + 30 + 13 + 7 + 3 = 100.</p>`},
  {n:"Exercice 2", t:"Les employés d'une entreprise", w:"Sur ton cahier", h:`<p>Une entreprise d'informatique emploie 22 programmeurs, 32 électroniciens, 6 infographistes et 20 commerciaux.</p><p>a) Calcule l'effectif total. Que représente-t-il ?</p><p>b) Construis un tableau donnant l'effectif et la fréquence (en %) de chaque métier.</p>`,
   c:`<p>a) 22 + 32 + 6 + 20 = 80. L'effectif total est de 80 : c'est le nombre d'employés de l'entreprise.</p>
   <p>b)</p>${tab(["Métier","Effectifs","Fréquence (en %)"],[["Programmeurs","22","27,5"],["Électroniciens","32","40"],["Infographistes","6","7,5"],["Commerciaux","20","25"],["Total","80","100"]])}<p>Par exemple, pour les programmeurs :</p><p class="calc">f = {22/80}<br>f = 0,275<br>f = 27,5 %</p><p>On vérifie que 27,5 + 40 + 7,5 + 25 = 100.</p>`}
 ]},
{t:"Diagrammes en bâtons et diagrammes circulaires", e:[
  {n:"Exercice 3", t:"Construire un diagramme en bâtons et un diagramme circulaire", w:"Sur ton cahier", h:`<p>On a interrogé des élèves de 5<sup>e</sup> sur leur sport préféré.</p>${tab(["Valeurs",...SP,"Total"],[["Effectif",...SPv.map(String),"20"]])}
   <p><b>1)</b> Sur ton cahier, représente ces données dans un diagramme en bâtons :</p><p>– les sports sur l'axe des abscisses ;</p><p>– les effectifs sur l'axe des ordonnées.</p><p>N'oublie pas d'indiquer le nom des deux axes et de donner un titre à ton diagramme.</p><p><b>Conseil :</b> pour créer tes deux axes, aide-toi des carreaux de ton cahier.</p>
   <p><b>2)</b> Sur ton cahier, représente ces données dans un diagramme circulaire. On arrondira les degrés à l'unité.</p><p>N'oublie pas d'indiquer la légende du diagramme à l'aide de couleurs et de donner un titre à ton diagramme.</p>`,
   c:`<p><b>1)</b></p>${bars({cats:SP, vals:SPv, title:"Répartition d'une classe de 5e en fonction du sport pratiqué", ylab:"Effectifs", xlab:"Sports pratiqués", ymax:7, ystep:1, ylabStep:1, w:520, H:320})}
   <p><b>2)</b></p>${tab(["Valeurs","Foot","Total"],[["Effectifs","6","20"],["Degrés","?","360"]])}<p class="calc">Produit en croix : 6 × 360 ÷ 20 = 108°</p><p>De la même façon, on trouve les autres mesures d'angle.</p>
   ${tab(["Valeurs",...SP,"Total"],[["Effectifs",...SPv.map(String),"20"],["Degrés",...SPv.map(n=>`<b>${n*18}</b>`),"360"]])}<p>On vérifie que 108 + 54 + 54 + 90 + 36 + 18 = 360.</p>
   ${pie({vals:SPv, title:"Répartition d'une classe de 5e en fonction du sport pratiqué", lab:i=>[SP[i], SPv[i]*18+"°"]})}`}
 ]},
{t:"Moyenne d'une série statistique", e:[
  {n:"Exercice 4", t:"Moyenne en technologie", w:"Sur ton cahier", h:`<p>Voici les notes (sur 20) obtenues par un élève en technologie ce trimestre :</p><p class="calc">13 ; 14 ; 7 ; 8 ; 16 ; 10 ; 9</p><p>Calcule sa moyenne trimestrielle en technologie.</p>`,
   c:`<p class="calc">M = {13 + 14 + 7 + 8 + 16 + 10 + 9/7}<br>M = {77/7}<br>M = 11</p><p>On aurait aussi pu l'écrire comme ça : (13 + 14 + 7 + 8 + 16 + 10 + 9) ÷ 7 = 11.</p><p>Sa moyenne trimestrielle en technologie est donc de <b>11 sur 20</b>.</p>`},
  {n:"Exercice 5", t:"Les SMS de Nolly", w:"Sur ton cahier", h:`<p>Voici le nombre de SMS envoyés par Nolly chaque jour d'une semaine :</p>${tab(["Jour","Lun.","Mar.","Mer.","Jeu.","Ven.","Sam.","Dim."],[["SMS","45","39","72","47","66","103","97"]])}<p><b>1)</b> Combien de SMS a-t-elle envoyés au cours de la semaine ?</p><p><b>2)</b> Combien de SMS envoie-t-elle en moyenne par jour ?</p>`,
   c:`<p><b>1)</b> 45 + 39 + 72 + 47 + 66 + 103 + 97 = 469. Au cours de la semaine, elle a envoyé <b>469 SMS</b>.</p><p><b>2)</b> {469/7} = 67. En moyenne, Nolly envoie <b>67 SMS par jour</b>.</p>`},
  {n:"Exercice 6", t:"Une douzaine d'œufs", w:"Sur ton cahier", h:`<p>On a pesé les œufs d'une boîte de douze. Voici leurs masses (en g) :</p><p class="calc">61 ; 62 ; 61 ; 58 ; 56 ; 63 ; 55 ; 64 ; 61 ; 63 ; 63 ; 65</p><p><b>1)</b> Quelle est la masse totale de la douzaine d'œufs ?</p><p><b>2)</b> Quelle est la masse moyenne d'un œuf ?</p>`,
   c:`<p><b>1)</b> 61 + 62 + 61 + 58 + 56 + 63 + 55 + 64 + 61 + 63 + 63 + 65 = 732. La masse totale est de <b>732 g</b>.</p><p><b>2)</b> {732/12} = 61. La masse moyenne d'un œuf est de <b>61 g</b>.</p>`}
 ]},
{t:"Moyenne à partir d'un tableau d'effectifs", e:[
  {n:"Exercice 7", t:"Des sacs de terreau", w:"Sur ton cahier", h:`<p>Une jardinerie a noté la masse (en kg) des sacs de terreau commandés par ses clients :</p><p class="calc" style="white-space:normal">12 – 15 – 12 – 20 – 20 – 20 – 12 – 15 – 15 – 12 – 15 – 12 – 20 – 12 – 20 – 12</p><p><b>1)</b> Recopie et complète le tableau d'effectifs.</p>${tab(["Masse du sac (en kg)","12","15","20"],[["Nombre de commandes","","",""]])}<p><b>2)</b> Combien y a-t-il de commandes en tout ?</p><p><b>3)</b> Calcule la masse moyenne d'une commande.</p>`,
   c:`<p><b>1)</b></p>${tab(["Masse du sac (en kg)","12","15","20"],[["Nombre de commandes","7","4","5"]])}<p><b>2)</b> 7 + 4 + 5 = 16 : il y a 16 commandes en tout.</p>
   <p><b>3)</b> Avec la série statistique :</p><p class="calc">M = {12 + 15 + 12 + 20 + 20 + 20 + 12 + 15 + 15 + 12 + 15 + 12 + 20 + 12 + 20 + 12/16}<br>M = {244/16}<br>M = 15,25</p><p><b>Méthode plus rapide</b>, avec le tableau d'effectifs :</p><p class="calc">M = {7 × 12 + 4 × 15 + 5 × 20/16}<br>M = {244/16}<br>M = 15,25</p><p>La masse moyenne d'une commande est de <b>15,25 kg</b>.</p>`},
  {n:"Exercice 8", t:"L'âge des participants", w:"Sur ton cahier", h:`<p>Voici l'âge des participants à un stage de sport :</p>${tab(["Âge (en ans)","13","14","15","16","17"],[["Effectif","2","6","3","1","3"]])}<p><b>1)</b> Quel est l'effectif total ?</p><p><b>2)</b> Calcule l'âge moyen d'un participant.</p>`,
   c:`<p><b>1)</b> 2 + 6 + 3 + 1 + 3 = 15. L'effectif total est de 15.</p><p><b>2)</b></p><p class="calc">M = {2 × 13 + 6 × 14 + 3 × 15 + 1 × 16 + 3 × 17/15}<br>M = {222/15}<br>M = 14,8</p><p>L'âge moyen d'un participant est de <b>14,8 ans</b>.</p>`},
  {n:"Exercice 9", t:"Les salaires d'une PME", w:"Sur ton cahier", h:`<p>Voici les salaires mensuels (en €) des employés d'une PME :</p>${tab(["Salaire (en €)","950","1 300","1 700","3 500","8 000"],[["Effectif","50","25","15","10","2"]])}<p><b>1)</b> Quel est l'effectif de cette PME ?</p><p><b>2)</b> Calcule le salaire moyen, arrondi à l'euro.</p>`,
   c:`<p><b>1)</b> 50 + 25 + 15 + 10 + 2 = 102. L'effectif de cette PME est de 102.</p><p><b>2)</b></p><p class="calc">M = {50 × 950 + 25 × 1 300 + 15 × 1 700 + 10 × 3 500 + 2 × 8 000/102}<br>M = {156 500/102}<br>M ≈ 1 534</p><p>Le salaire moyen de cette entreprise est d'environ <b>1 534 €</b>.</p>`}
 ]},
{t:"Moyenne à partir d'un diagramme", e:[
  {n:"Exercice 10", t:"Les spams", w:"Sur ton cahier", h:`<p>On a demandé aux élèves d'une classe combien de spams (courriels indésirables) ils ont reçus hier. Voici les résultats :</p>${bars({cats:["0","1","2","3","4","5","6","7","8"], vals:SPAM, title:"Nombre de spams reçus", ylab:"Nombre d'élèves", xlab:"Nombre de spams", ymax:7, ystep:1, ylabStep:1, w:520, H:310})}
   <p><b>1)</b> a) Combien d'élèves n'ont pas reçu de spam ?</p><p>b) Combien d'élèves ont reçu exactement 3 spams ?</p><p>c) Combien d'élèves ont répondu à ce sondage ?</p><p><b>2)</b> a) Combien de spams les élèves de la classe ont-ils reçus en tout ?</p><p>b) Calcule le nombre moyen de spams reçus par un élève de cette classe.</p>`,
   c:`<p><b>1)</b> a) 3 élèves n'ont pas reçu de spam.</p><p>b) 5 élèves ont reçu exactement 3 spams.</p><p>c) 3 + 4 + 0 + 5 + 2 + 6 + 3 + 1 + 1 = 25 : 25 élèves ont répondu à ce sondage.</p>
   <p><b>2)</b> a) 3 × 0 + 4 × 1 + 0 × 2 + 5 × 3 + 2 × 4 + 6 × 5 + 3 × 6 + 1 × 7 + 1 × 8 = 90 : les élèves ont reçu 90 spams en tout.</p><p>b) {90/25} = 3,6 : le nombre moyen de spams reçus par un élève est de <b>3,6</b>.</p>`},
  {n:"Exercice 11", t:"Les notes de Mathieu", w:"Sur ton cahier", h:`<p>Voici les notes (sur 20) de Mathieu aux 12 devoirs de maths de l'année :</p>${bars({cats:MATH.map((_,i)=>String(i+1)), vals:MATH, title:"Notes de Mathieu", ylab:"Note sur 20", xlab:"Numéro du devoir", ymax:20, ystep:1, ylabStep:2, w:540, H:330})}
   <p><b>1)</b> À quel devoir Mathieu a-t-il eu sa meilleure note ?</p><p><b>2)</b> Calcule la moyenne de Mathieu en maths.</p>`,
   c:`<p><b>1)</b> C'est au devoir n° 9 que Mathieu a eu sa meilleure note (19).</p><p><b>2)</b></p><p class="calc">M = {13 + 12 + 9 + 11 + 6 + 11 + 11 + 17 + 19 + 14 + 3 + 12/12}<br>M = {138/12}<br>M = 11,5</p><p>La moyenne de Mathieu en maths est de <b>11,5 sur 20</b>.</p>`},
  {n:"Exercice 12", t:"La pluie de la semaine", w:"Sur ton cahier", h:`<p>Le diagramme donne la hauteur de pluie tombée chaque jour d'une semaine.</p>${bars({cats:JOURS, vals:PLUIE, title:"Précipitations de la semaine", ylab:"Hauteur de pluie (mm)", ymax:18, ystep:1, ylabStep:2, w:520, H:300})}
   <p><b>1)</b> Quel a été le jour le plus pluvieux ? Combien a-t-il plu ce jour-là ?</p><p><b>2)</b> Quel a été le jour le moins pluvieux ?</p><p><b>3)</b> Un voisin affirme qu'il a plu en moyenne 9 mm par jour cette semaine. A-t-il raison ?</p>`,
   c:`<p><b>1)</b> Le jour le plus pluvieux a été le jeudi : il a plu 16 mm.</p><p><b>2)</b> Le jour le moins pluvieux a été le vendredi : il n'a pas plu ce jour-là (0 mm).</p>
   <p><b>3)</b> S'il avait plu 9 mm tous les jours, on aurait eu un total de 9 × 7 = 63 mm.</p><p>Or cette semaine, il est tombé 10 + 14 + 8 + 16 + 0 + 4 + 6 = 58 mm. Le voisin a donc <b>tort</b>.</p><p><b>Observation :</b> la moyenne des précipitations par jour est 58 ÷ 7 ≈ 8,29 mm : s'il avait plu 8,29 mm tous les jours, on aurait eu le même total pour la semaine.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Vocabulaire", schema:S_VOC, q:{
 1:[ {g:()=>{ const [p,c,v]=pick(POPS); return {q:`On étudie ${c} ${p.startsWith("les")?"d"+p.replace(/^les /,"es "):"de "+p}. Quelle est la population étudiée ?`, c:shuf(uniq(p,[c,v])), rep:p, ex:"La population est l'ensemble sur lequel porte l'étude.", sx:S_VOC}; }} ],
 2:[ {g:()=>{ const [p,c,v]=pick(POPS); return {q:`On étudie ${c} ${p.startsWith("les")?"d"+p.replace(/^les /,"es "):"de "+p}. Quel est le caractère étudié ?`, c:shuf(uniq(c,[p,v])), rep:c, ex:"Le caractère est ce que l'on étudie dans la population.", sx:S_VOC}; }} ],
 3:[ {q:"Peut-on calculer la moyenne de la couleur des voitures vendues ?", c:["Non, les valeurs ne sont pas des nombres","Oui, en additionnant les effectifs","Oui, en divisant par l'effectif total"], rep:"Non, les valeurs ne sont pas des nombres", sx:S_VOC},
     {g:()=>{ const [p,c,v]=pick(POPS); return {q:`On étudie ${c} ${p.startsWith("les")?"d"+p.replace(/^les /,"es "):"de "+p}. Que sont « ${v} » ?`, c:["les valeurs","la population","le caractère"], rep:"les valeurs", sx:S_VOC}; }} ]
}},
{nom:"Effectifs et fréquences", schema:S_FREQ, q:{
 1:[ {g:()=>{ const v=[ri(1,9),ri(1,9),ri(1,9),ri(1,9)], t=sum(v); return {q:`Effectifs : ${v.join(" ; ")}. Quel est l'effectif total ?`, rep:[String(t)], ex:`${v.join(" + ")} = ${t}.`, sx:S_FREQ}; }} ],
 2:[ {g:()=>{ const t=pick([20,25,40,50]), n=ri(1,t-1), p=n*100/t; return {q:`Sur ${t} réponses, la valeur « rouge » apparaît ${n} fois. Quelle est sa fréquence en % ?`, rep:[N(p), N(p)+" %", N(p)+"%"], ex:`<br>f = ${F(n,t)}<br>f = ${N(n/t)}<br>f = ${N(p)} %`, sx:S_FREQ}; }} ],
 3:[ {g:()=>{ const t=pick([24,27,30,35]); const n=ri(1,t-1); const f=n/t; return {q:`Une valeur a pour effectif ${n} sur un effectif total de ${t}. Quelle est sa fréquence, arrondie au centième ?`, rep:VC(f), ex:`<br>f = ${F(n,t)}<br>f = ${n} ÷ ${t}<br>f ${Math.abs(rd(f,2)-f)<1e-9?"=":"≈"} ${N(f,2)}`, sx:S_FREQ}; }},
     {q:"Une fréquence est toujours…", c:["comprise entre 0 et 1","plus grande que 1","égale à l'effectif"], rep:"comprise entre 0 et 1", sx:S_FREQ} ]
}},
{nom:"Diagrammes", schema:S_DIAG, q:{
 1:[ {g:()=>{ const v=[ri(1,9),ri(1,9),ri(1,9),ri(1,9)], i=ri(0,3), cats=["Foot","Judo","Danse","Tennis"]; return {q:`Combien d'élèves ont choisi « ${cats[i]} » ?`, fig:bars({cats, vals:v, ylab:"Effectifs", ymax:10, ystep:1, ylabStep:1, w:420, H:260}), rep:[String(v[i])], ex:"On lit la hauteur du bâton sur l'axe des ordonnées.", sx:S_DIAG}; }} ],
 2:[ {g:()=>{ const t=pick([12,18,20,24,30,36,40,45]), n=ri(1,t-1), k=360/t; return {q:`Dans un diagramme circulaire représentant ${t} élèves, quel angle (en degrés) correspond à ${n} élève${n>1?"s":""} ?`, rep:[N(n*k), N(n*k)+"°"], ex:`${n} × 360 ÷ ${t} = ${N(n*k)}°.`, sx:S_DIAG}; }} ],
 3:[ {g:()=>{ const t=pick([50,27,35,70]), n=ri(2,t-2), a=n*360/t; return {q:`Dans un diagramme circulaire de ${t} voitures, quel angle correspond à ${n} voitures, arrondi au degré ?`, rep:[N(a,0), N(a,0)+"°"], ex:`<br>a = ${n} × 360 ÷ ${t}<br>a ${Math.abs(rd(a,2)-a)<1e-9?"=":"≈"} ${N(a,2)}${Number.isInteger(rd(a,6))?"":`<br>a ≈ ${N(a,0)}`}°`, sx:S_DIAG}; }} ]
}},
{nom:"Moyenne d'une série", schema:S_MOY, q:{
 1:[ {g:()=>{ const n=pick([4,5]), v=series(n,4,18); return {q:`Calcule la moyenne de : ${v.join(" ; ")}.`, rep:[String(sum(v)/n)], ex:`<br>M = (${v.join(" + ")}) ÷ ${n}<br>M = ${sum(v)} ÷ ${n}<br>M = ${sum(v)/n}`, sx:S_MOY}; }} ],
 2:[ {g:()=>{ const v=series(7,30,110); return {q:`Nombre de SMS envoyés chaque jour d'une semaine : ${v.join(" ; ")}. Combien de SMS en moyenne par jour ?`, rep:[String(sum(v)/7)], ex:`Total : ${sum(v)}. ${sum(v)} ÷ 7 = ${sum(v)/7}.`, sx:S_MOY}; }} ],
 3:[ {g:()=>{ let v; do{ v=Array.from({length:7},()=>ri(0,16)); }while(sum(v)%7===0); const m=ri(8,10); return {q:`Pluie de la semaine (mm) : ${v.join(" ; ")}. Quelle est la moyenne par jour, arrondie au centième ?`, rep:VC(sum(v)/7), ex:`Total : ${sum(v)} mm. ${sum(v)} ÷ 7 ≈ ${N(sum(v)/7,2)} mm.`, sx:S_MOY}; }},
     {q:"Vrai ou faux : la moyenne d'une série est toujours l'une des valeurs de la série.", c:["Vrai","Faux"], rep:"Faux", ex:"Par exemple, la moyenne des notes de la classe est 12,5, et aucun élève n'a eu 12,5.", sx:S_MOY} ]
}},
{nom:"Moyenne avec un tableau ou un diagramme", schema:S_POND, q:{
 1:[ {g:()=>{ const vals=[1,2,3], e=[ri(1,6),ri(1,6),ri(1,6)], t=sum(e); return {q:`Valeurs : 1 ; 2 ; 3, avec les effectifs ${e.join(" ; ")}. Quelle est la somme de toutes les valeurs ?`, rep:[String(e[0]+2*e[1]+3*e[2])], ex:`${e[0]} × 1 + ${e[1]} × 2 + ${e[2]} × 3 = ${e[0]+2*e[1]+3*e[2]}.`, sx:S_POND}; }} ],
 2:[ {g:()=>{ for(;;){ const vals=[12,15,20], e=[ri(1,8),ri(1,8),ri(1,8)], t=sum(e), s=e[0]*12+e[1]*15+e[2]*20; if(Math.abs(rd(s/t,2)-s/t)>1e-9) continue;
       return {q:"Quelle est la masse moyenne d'une commande (en kg) ?", fig:tab(["Masse du sac (kg)","12","15","20"],[["Nombre de commandes",...e.map(String)]]), rep:[...VC(s/t), N(s/t,2)+" kg"], ex:`<br>M = ${pond(vals,e)}<br>M = {${s}/${t}}<br>M = ${N(s/t,2)}`, sx:S_POND}; } }} ],
 3:[ {g:()=>{ for(;;){ const e=Array.from({length:6},()=>ri(0,6)), t=sum(e), s=e.reduce((a,n,i)=>a+n*i,0); if(t<10||Math.abs(rd(s/t,2)-s/t)>1e-9) continue;
       return {q:"Combien de spams un élève a-t-il reçus en moyenne ?", fig:bars({cats:["0","1","2","3","4","5"], vals:e, ylab:"Nombre d'élèves", xlab:"Nombre de spams", ymax:7, ystep:1, ylabStep:1, w:420, H:280}), rep:VC(s/t), ex:`Total des spams : ${e.map((n,i)=>`${n} × ${i}`).join(" + ")} = ${s}. Nombre d'élèves : ${t}. ${s} ÷ ${t} = ${N(s/t,2)}.`, sx:S_POND}; } }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 17", duree:50, info:"Durée : 50 min · Calculatrice autorisée · Règle, compas et rapporteur",
comp:[
  ["CONNAÎTRE","Je connais le vocabulaire : population, caractère, valeurs.","Ex. 1 (3 points)"],
  ["REPRÉSENTER","Je construis un tableau d'effectifs, je calcule des fréquences et je construis un diagramme circulaire.","Ex. 2 et 3 (9 points)"],
  ["CALCULER","Je calcule une moyenne à partir d'un tableau d'effectifs ou d'un diagramme.","Ex. 4 et 5 (8 points)"]
],
exos:[
{t:"Le vocabulaire", p:3, h:`<p>On a demandé à chacun des 25 élèves d'une classe de 4<sup>e</sup> combien d'animaux il a chez lui. Voici les réponses :</p><p class="calc" style="white-space:normal">0 – 1 – 2 – 1 – 0 – 3 – 1 – 2 – 0 – 1 – 1 – 4 – 2 – 0 – 1 – 2 – 1 – 0 – 3 – 1 – 2 – 1 – 0 – 1 – 2</p><p>a) Quelle est la population étudiée ?</p><p>b) Quel est le caractère étudié ?</p><p>c) Quelles sont les valeurs ?</p>`,
 c:`<p>a) Les élèves de la classe de 4<sup>e</sup>. · b) Le nombre d'animaux. · c) 0, 1, 2, 3 et 4.</p><p><i>(1 point par réponse)</i></p>`},
{t:"Tableau d'effectifs", p:5, h:`<p>On reprend les réponses de l'exercice 1.</p><p>a) Construis le tableau d'effectifs.</p><p>b) Ajoute une ligne avec la fréquence de chaque valeur sous forme de fraction, puis une ligne avec la fréquence en pourcentage.</p><p>c) Quel pourcentage des élèves ont au moins 2 animaux ?</p>`,
 c:`${tab(["Nombre d'animaux","0","1","2","3","4","Total"],[["Effectifs","6","10","6","2","1","25"],["Fréquences",F(6,25),F(10,25),F(6,25),F(2,25),F(1,25),"1"],["Fréquences (en %)","24","40","24","8","4","100"]])}
 <p>a) <i>(2 points)</i> · b) <i>(2 points)</i></p><p>c) 6 + 2 + 1 = 9 élèves ont au moins 2 animaux :</p><p class="calc">f = {9/25}<br>f = 0,36<br>f = 36 %</p><p>(ou 24 + 8 + 4 = 36). <i>(1 point)</i></p>`},
{t:"Diagramme circulaire", p:4, h:`<p>On a demandé à 40 élèves leur moyen de transport pour venir au collège :</p>${tab(["Transport","Bus","Vélo","À pied","Voiture","Total"],[["Effectif","14","6","12","8","40"]])}<p>a) Calcule l'angle de chaque secteur du diagramme circulaire.</p><p>b) Construis le diagramme circulaire (rayon 4 cm), avec un titre et une légende.</p>`,
 c:`<p>a) 360 ÷ 40 = 9 : un élève correspond à 9°.</p>${tab(["Transport","Bus","Vélo","À pied","Voiture","Total"],[["Effectif","14","6","12","8","40"],["Angle (°)","126","54","108","72","360"]])}<p>14 × 9 = 126 ; 6 × 9 = 54 ; 12 × 9 = 108 ; 8 × 9 = 72. Vérification : 126 + 54 + 108 + 72 = 360. <i>(2 points)</i></p>
 ${pie({vals:[14,6,12,8], title:"Moyen de transport des élèves", lab:i=>[["Bus","Vélo","À pied","Voiture"][i], [126,54,108,72][i]+"°"]})}<p>b) <i>(2 points : angles justes, titre et légende)</i></p>`},
{t:"Le nombre moyen d'animaux", p:4, h:`<p>À l'aide du tableau d'effectifs de l'exercice 2, calcule le nombre moyen d'animaux par élève. Détaille ton calcul.</p>`,
 c:`<p class="calc">M = ${pond([0,1,2,3,4],[6,10,6,2,1])}<br>M = {32/25}<br>M = 1,28</p><p>En moyenne, un élève a 1,28 animal. <i>(2 points pour le calcul des produits, 1 point pour la division par 25, 1 point pour la phrase réponse)</i></p>`},
{t:"Les buts de l'équipe", p:4, h:`<p>Le diagramme donne le nombre de buts marqués par une équipe de football lors de ses matchs de la saison.</p>${bars({cats:["0","1","2","3","4"], vals:[3,5,6,4,2], title:"Buts marqués par match", ylab:"Nombre de matchs", xlab:"Nombre de buts", ymax:7, ystep:1, ylabStep:1, w:440, H:300})}<p>a) Combien de matchs l'équipe a-t-elle joués ?</p><p>b) Combien de buts a-t-elle marqués en tout ?</p><p>c) Calcule le nombre moyen de buts marqués par match.</p>`,
 c:`<p>a) 3 + 5 + 6 + 4 + 2 = 20 matchs. <i>(1 point)</i></p><p>b) Le nombre B de buts :</p><p class="calc">B = 3 × 0 + 5 × 1 + 6 × 2 + 4 × 3 + 2 × 4<br>B = 0 + 5 + 12 + 12 + 8<br>B = 37</p><p>L'équipe a marqué 37 buts en tout. <i>(1,5 point)</i></p><p>c) {37/20} = 1,85 : l'équipe a marqué en moyenne 1,85 but par match. <i>(1,5 point)</i></p>`}
]}
};
})();
