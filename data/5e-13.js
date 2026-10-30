/* 5e — Chapitre 13 : Statistiques (cours et fiche d'exercices de M. Staal)
   Tous les diagrammes (barres, circulaires, graphiques cartésiens) sont dessinés en SVG
   à partir des valeurs exactes de la fiche : ce qui est dessiné est exactement ce qui est écrit. */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const gcd = (a,b) => b ? gcd(b, a%b) : a;
const rd = (x,k=3) => Math.round(x*10**k)/10**k;
/* écriture française : 1 000 · 14,9 · −2,5 */
const N = (x,k=3) => { const v=rd(x,k); const [i,d]=String(Math.abs(v)).split("."); return (v<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const F = (a,b) => `{${a}/${b}}`;
/* fraction irréductible (ou entier) */
const irr = (a,b) => { const g=gcd(a,b); return b/g===1 ? String(a/g) : F(a/g,b/g); };
const sum = a => a.reduce((x,y)=>x+y,0);
/* calcul en chaîne (choix de M. Staal) : une étape par ligne, chaque ligne commence par le nom de la grandeur ; « ≈ … » pour une valeur arrondie */
const KCl = (n, L) => L.map(String).filter((x,i,a)=>i===0||x!==a[i-1]).map(x=>/^≈/.test(String(x))?`${n} ${x}`:`${n} = ${x}`).join("<br>");
const KC = (n, L) => `<p class="calc">${KCl(n,L)}</p>`;
const KCi = (n, L) => `<span class="calc" style="display:block;margin:6px 0">${KCl(n,L)}</span>`;

const BAR = "#4a86c5", BARS = "#1f4e79", RED = "#c0392b";
const PAL = ["#6fa8dc","#f4b183","#a9d18e","#ffd966","#c9a0dc","#9fd4d0"];
const T = (x,y,txt,st="",a="middle") => `<text x="${x}" y="${y}" text-anchor="${a}" style="font-size:15px;fill:var(--ink);${st}">${txt}</text>`;

/* ------------------------------------------------------------------
   Diagramme en barres
   cats, vals · ymax · ystep (lignes du quadrillage) · ylabStep (nombres écrits) · show : valeur au-dessus des barres
------------------------------------------------------------------ */
function bars(o){
  const {cats, vals, title="", ylab="", ymax, ystep=1, ylabStep=2, w=520, H=300} = o;
  const ml=66, mr=14, mt=(title?42:16)+(o.show?18:0), mb=44, pw=w-ml-mr, ph=H-mt-mb;
  const Y=v=>mt+ph-(v/ymax)*ph, n=cats.length, slot=pw/n, bw=o.bwr ? slot*o.bwr : Math.min(slot*0.56, 90);   /* bwr : largeur de barre / place d'une barre */
  let s=`<svg class="fig" viewBox="0 0 ${w} ${H}" width="${w}" role="img" aria-label="Diagramme en barres${title?" : "+title:""}">`;
  if(title) s+=T(ml+pw/2, 24, title, "font-weight:700;font-size:17px");
  const nk=Math.round(ymax/ystep);
  for(let k=0;k<=nk;k++){ const v=rd(k*ystep), y=Y(v).toFixed(1), big=Math.abs(v/ylabStep-Math.round(v/ylabStep))<1e-9;
    s+=`<line x1="${ml}" y1="${y}" x2="${ml+pw}" y2="${y}" class="gridl"${big?"":' style="stroke-width:.7"'}/>`;
    if(big) s+=T(ml-8, +y+5, N(v), "", "end"); }
  if(ylab) s+=`<text transform="translate(17 ${mt+ph/2}) rotate(-90)" text-anchor="middle" style="font-size:15px;fill:var(--ink)">${ylab}</text>`;
  vals.forEach((v,i)=>{ const x=ml+slot*i+(slot-bw)/2;
    s+=`<rect x="${x.toFixed(1)}" y="${Y(v).toFixed(1)}" width="${bw.toFixed(1)}" height="${(Y(0)-Y(v)).toFixed(1)}" style="fill:${BAR};stroke:${BARS};stroke-width:1.5"/>`;
    if(o.show) s+=T((x+bw/2).toFixed(1), (Y(v)-7).toFixed(1), N(v), "fill:var(--c);font-weight:700");
    s+=T((x+bw/2).toFixed(1), (Y(0)+24).toFixed(1), cats[i]); });
  s+=`<line x1="${ml}" y1="${mt-4}" x2="${ml}" y2="${Y(0)}" class="axe2"/><line x1="${ml}" y1="${Y(0)}" x2="${ml+pw}" y2="${Y(0)}" class="axe2"/>`;
  return s+"</svg>";
}

/* ------------------------------------------------------------------
   Diagramme circulaire : secteurs dans l'ordre, à partir du haut, dans le sens des aiguilles d'une montre
   lab(i) → lignes de texte écrites dans le secteur i
------------------------------------------------------------------ */
function pie(o){
  const {vals, title="", R=118, w=360} = o, lab=o.lab||(i=>[o.cats[i]]);
  const tot=sum(vals), cx=w/2, cy=(title?42:12)+R+8, H=cy+R+14;
  let s=`<svg class="fig" viewBox="0 0 ${w} ${H}" width="${w}" role="img" aria-label="Diagramme circulaire${title?" : "+title:""}">`;
  if(title) s+=T(cx, 24, title, "font-weight:700;font-size:17px");
  const P=(a,r=R)=>[cx+r*Math.cos(a*Math.PI/180), cy+r*Math.sin(a*Math.PI/180)];
  let a0=-90;
  vals.forEach((v,i)=>{ const da=v/tot*360, a1=a0+da, [x0,y0]=P(a0), [x1,y1]=P(a1);
    const st=`fill:${PAL[i%PAL.length]};stroke:${BARS};stroke-width:2;stroke-linejoin:round`;
    s+= da>=359.99 ? `<circle cx="${cx}" cy="${cy}" r="${R}" style="${st}"/>`
      : `<path d="M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 ${da>180?1:0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" style="${st}"/>`;
    a0=a1; });
  a0=-90;
  vals.forEach((v,i)=>{ const da=v/tot*360, am=a0+da/2, L=lab(i), [lx,ly]=P(am, R*(da<50?0.68:0.58));
    L.forEach((t,j)=>{ s+=`<text x="${lx.toFixed(1)}" y="${(ly+5+(j-(L.length-1)/2)*18).toFixed(1)}" text-anchor="middle" style="font-size:15px;fill:#1a1a1a">${t}</text>`; });
    a0+=da; });
  return s+"</svg>";
}

/* ------------------------------------------------------------------
   Graphique cartésien : points (xs[i] ; ys[i]) reliés
   xmin, xmax, xstep · ymin, ymax, ystep (quadrillage) · ylabStep (nombres écrits) · show : valeurs écrites près des points
------------------------------------------------------------------ */
function line(o){
  const {xs, ys, title="", xlab="", ylab="", xmin=0, xmax, xstep=1, ymin=0, ymax, ystep=1, ylabStep=2, w=560, H=330} = o;
  const ml=66, mr=22, mt=(title?42:16)+(o.show?16:0), mb=58, pw=w-ml-mr, ph=H-mt-mb;
  const X=x=>ml+(x-xmin)/(xmax-xmin)*pw, Y=y=>mt+ph-(y-ymin)/(ymax-ymin)*ph;
  let s=`<svg class="fig" viewBox="0 0 ${w} ${H}" width="${w}" role="img" aria-label="Graphique cartésien${title?" : "+title:""}">`;
  if(title) s+=T(ml+pw/2, 24, title, "font-weight:700;font-size:17px");
  const nx=Math.round((xmax-xmin)/xstep), ny=Math.round((ymax-ymin)/ystep);
  for(let k=0;k<=nx;k++){ const v=rd(xmin+k*xstep), x=X(v).toFixed(1); s+=`<line x1="${x}" y1="${mt}" x2="${x}" y2="${Y(ymin)}" class="gridl"/>`+T(x, Y(ymin)+22, N(v)); }
  for(let k=0;k<=ny;k++){ const v=rd(ymin+k*ystep), y=Y(v).toFixed(1), big=Math.abs(v/ylabStep-Math.round(v/ylabStep))<1e-9;
    s+=`<line x1="${ml}" y1="${y}" x2="${X(xmax)}" y2="${y}" class="gridl"${big?"":' style="stroke-width:.7"'}/>`; if(big) s+=T(ml-8, +y+5, N(v), "", "end"); }
  s+=`<line x1="${ml}" y1="${mt-4}" x2="${ml}" y2="${Y(ymin)}" class="axe2"/><line x1="${ml}" y1="${Y(ymin)}" x2="${X(xmax)}" y2="${Y(ymin)}" class="axe2"/>`;
  if(xlab) s+=T(ml+pw/2, H-8, xlab);
  if(ylab) s+=`<text transform="translate(17 ${mt+ph/2}) rotate(-90)" text-anchor="middle" style="font-size:15px;fill:var(--ink)">${ylab}</text>`;
  s+=`<polyline points="${xs.map((x,i)=>X(x).toFixed(1)+","+Y(ys[i]).toFixed(1)).join(" ")}" style="fill:none;stroke:${RED};stroke-width:2.6;stroke-linejoin:round"/>`;
  xs.forEach((x,i)=>{ s+=`<circle cx="${X(x).toFixed(1)}" cy="${Y(ys[i]).toFixed(1)}" r="5.5" style="fill:${RED}"/>`;
    if(o.show) s+=T((X(x)+(x===xmin?9:0)).toFixed(1), (Y(ys[i])+(x===xmin&&ys[i+1]>ys[i]?20:-11)).toFixed(1), N(ys[i]), "fill:var(--c);font-weight:700", x===xmin?"start":"middle"); });   /* 1er point : valeur écrite sous la courbe si elle monte */
  return s+"</svg>";
}

/* tableau : ligne d'en-tête + lignes [titre, cellules…] */
const tab = (head, rows) => `<div class="scroll"><table class="std"><thead><tr>${head.map((h,i)=>`<th>${i?h:`<b>${h}</b>`}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;

/* outils réutilisés par la fiche d'entraînement */
window.STAT13 = {bars, pie, line, tab, N, F, irr, gcd, sum, rd, KC, KCi};

/* ===================== figures du cours et de la fiche ===================== */
const SPORT = {cats:["Foot","Basket","Natation","Autre"], vals:[8,5,4,3]};
const C_BAR = bars({...SPORT, title:"Sport préféré", ylab:"Effectif", ymax:9, ystep:1, ylabStep:1, w:400, H:280});
const C_PIE = pie({...SPORT, title:"Sport préféré", w:290, R:108});
const C_LINE = line({xs:[6,8,10,12,14,16,18], ys:[8,11,14,17,19,18,15], title:"Températures relevées un jour de mai", xlab:"Heure de la journée (h)", ylab:"Température (°C)", xmax:20, xstep:2, ymax:20, ystep:1, ylabStep:5, w:540});
const CDI = {cats:["Lundi","Mardi","Jeudi","Vendredi"], vals:[12,8,15,5]};
const E3 = bars({...CDI, title:"Livres empruntés au CDI", ylab:"Nombre de livres", ymax:16, ystep:1, ylabStep:2});
const CLUB = {cats:["Football","Basket","Judo","Danse"], vals:[12,8,6,4]};
/* à l'échelle de la consigne : 1 cm pour 2 élèves, barres de 1 cm espacées de 1 cm (1 cm = 45 px) */
const E4c = bars({...CLUB, title:"Sport pratiqué au club", ylab:"Nombre d'élèves", ymax:12, ystep:2, ylabStep:2, show:true, bwr:0.5, w:80+8*45, H:104+6*45});
const CANT = {cats:["Poisson","Viande","Végétarien","Œufs"], vals:[6,9,6,3]};
const E5c = pie({...CANT, title:"Plat choisi à la cantine", lab:i=>[CANT.cats[i], CANT.vals[i]*15+"°"]});
const TRANS = {cats:["Bus","Vélo","À pied","Voiture"], vals:[40,15,25,20]};
const E6 = pie({...TRANS, title:"Moyen de transport", lab:i=>[TRANS.cats[i], TRANS.vals[i]+" %"]});
const E7 = line({xs:[6,8,10,12,14,16,18], ys:[7,10,13,16,18,17,13], title:"Températures relevées à Cholet", xlab:"Heure (h)", ylab:"Température (°C)", xmax:20, xstep:2, ymax:20, ystep:1, ylabStep:2});
/* à l'échelle de la consigne : 1 cm pour 1 semaine en abscisse, 1 cm pour 2 cm en ordonnée (1 cm = 44 px) */
const E8c = line({xs:[0,1,2,3,4], ys:[2,5,9,12,14], title:"Croissance de la plante", xlab:"Semaine", ylab:"Taille (cm)", xmax:5, xstep:1, ymax:16, ystep:2, ylabStep:2, w:88+5*44, H:116+8*44, show:true});

/* ===================== schémas (rappels en image) ===================== */
const S_FREQ = sch("Effectif et fréquence", tab(["Sport","Foot","Basket","Total"],[["Effectif","8","5","20"],["Fréquence",`${F(8,20)} = 40 %`,`${F(5,20)} = 25 %`,"100 %"]])+`<p class="schN">Fréquence = effectif de la valeur ÷ effectif total. La somme des fréquences vaut 1 (100 %).</p>`);
const S_BAR = sch("Lire un diagramme en barres", bars({...SPORT, ymax:9, ystep:1, ylabStep:1, w:360, H:230, show:true})+`<p class="schN">La hauteur de chaque barre donne l'effectif : on lit la valeur sur l'axe vertical.</p>`);
const S_PIE = sch("Angle d'un secteur", pie({...SPORT, w:240, R:90, lab:i=>[SPORT.cats[i]]})+`<p class="calc">Foot : ${F(8,20)} × 360° = 144°</p><p class="schN">L'angle est proportionnel à l'effectif. Le disque entier (360°) représente l'effectif total.</p>`);
const S_LINE = sch("Lire un graphique cartésien", line({xs:[6,8,10,12,14,16,18], ys:[8,11,14,17,19,18,15], xmax:20, xstep:2, ymax:20, ystep:1, ylabStep:5, w:400, H:260, xlab:"Heure (h)"})+`<p class="schN">Abscisse : l'heure. Ordonnée : la température. À 12 h, il faisait 17 °C.</p>`);
const S_CHOIX = sch("Choisir une représentation", `<p class="schN"><b>Diagramme en barres</b> : pour comparer des effectifs.</p><p class="schN"><b>Diagramme circulaire</b> : pour montrer la répartition d'un tout.</p><p class="schN"><b>Graphique cartésien</b> : pour suivre une évolution.</p>`);
const S_MOY = sch("Calculer une moyenne", `<p class="calc">12 ; 15 ; 9 ; 14 ; 10<br>M = (12 + 15 + 9 + 14 + 10) ÷ 5<br>M = 60 ÷ 5<br>M = 12</p><p class="schN">Moyenne = somme des valeurs ÷ nombre de valeurs.</p>`);

/* ---------- générateurs de séries pour le QCM ---------- */
/* n entiers entre lo et hi, de somme tot (ou null) */
function split(n, tot, lo, hi){ for(let g=0; g<3000; g++){ const v=[]; for(let i=0;i<n-1;i++) v.push(ri(lo,hi)); const l=tot-sum(v); if(l>=lo && l<=hi) return [...v, l]; } return null; }
const JOURS = ["Lundi","Mardi","Jeudi","Vendredi"];
function qBars(){ const T0=pick([20,25,40,50]); let v=split(4,T0,2,T0>=40?18:12); if(!v) v=T0===20?[8,5,4,3]:T0===25?[5,11,6,3]:T0===40?[12,8,15,5]:[14,10,16,10];
  const ymax=Math.ceil((Math.max(...v)+1)/2)*2; return {v, T0, fig:bars({cats:JOURS, vals:v, ylab:"Nombre de livres", ymax, ystep:1, ylabStep:2, w:440, H:260}), sx:bars({cats:JOURS, vals:v, ylab:"Nombre de livres", ymax, ystep:1, ylabStep:2, w:440, H:260, show:true})}; }
function qTemp(){ const H=[6,8,10,12,14,16,18], im=ri(3,5); let y;
  do{ let t=ri(4,9); y=[t]; for(let i=1;i<7;i++){ t += i<=im ? ri(1,4) : -ri(1,3); y.push(t); } }while(Math.min(...y)<1);
  const o={xs:H, ys:y, xlab:"Heure (h)", ylab:"Température (°C)", xmax:20, xstep:2, ymax:Math.ceil((Math.max(...y)+1)/2)*2, ystep:1, ylabStep:2, w:480, H:300};
  return {y, im, fig:line(o), sx:line({...o, show:true})}; }

const SIT = [
  ["l'évolution de la population d'une ville de 1950 à 2020","graphique cartésien"],
  ["la température à Cholet relevée toutes les deux heures dans une journée","graphique cartésien"],
  ["la taille d'une plante mesurée chaque semaine","graphique cartésien"],
  ["la comparaison du nombre de médailles de 5 pays aux Jeux olympiques","diagramme en barres"],
  ["la comparaison du nombre de livres empruntés au CDI selon les jours","diagramme en barres"],
  ["la répartition du budget d'une famille (logement, nourriture, loisirs, autres)","diagramme circulaire"],
  ["la répartition des 200 élèves d'un collège selon leur moyen de transport","diagramme circulaire"]
];
const REPR = ["diagramme en barres","diagramme circulaire","graphique cartésien"];
const qSit = list => { const [s,r]=pick(list); return {q:`Quelle représentation est la plus adaptée pour ${s} ?`, c:REPR, rep:r, ex:r==="graphique cartésien"?"On suit une évolution.":r==="diagramme en barres"?"On compare des effectifs.":"On montre la répartition d'un tout.", sx:S_CHOIX}; };

CH["5e-13"] = {
intro:"Organiser des données dans un tableau d'effectifs, calculer des fréquences, lire et construire des diagrammes en barres, des diagrammes circulaires et des graphiques cartésiens, et calculer une moyenne.",
savoir:[
  "recueillir et organiser des données dans un tableau d'effectifs ;",
  "calculer des fréquences (fraction, nombre décimal, pourcentage) ;",
  "lire, interpréter et construire un diagramme en barres, un diagramme circulaire, un graphique cartésien ;",
  "choisir une représentation adaptée ;",
  "calculer et interpréter une moyenne."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Effectifs et fréquences", h:`
  <div class="retenir" data-l="Définition"><p>Une <b>série statistique</b> est un ensemble de données recueillies (réponses à une enquête, mesures…).</p>
   <p>L'<b>effectif</b> d'une valeur est le nombre de fois qu'elle apparaît.</p><p>L'<b>effectif total</b> est le nombre de données.</p>
   <p>La <b>fréquence</b> d'une valeur est la proportion ${F("effectif de la valeur","effectif total")}.</p><p>Elle s'écrit sous forme de fraction, de nombre décimal ou de pourcentage.</p></div>
  <p><b>Exemple :</b> on interroge 20 élèves sur leur sport préféré.</p>
  ${tab(["Sport préféré","Foot","Basket","Natation","Autre","Total"],[["Effectif","8","5","4","3","20"],["Fréquence",`${F(8,20)} = 0,4 = 40 %`,`${F(5,20)} = 25 %`,`${F(4,20)} = 20 %`,`${F(3,20)} = 15 %`,"100 %"]])}
  <div class="retenir" data-l="À retenir"><p>La somme des fréquences est toujours égale à 1 (ou à 100 %).</p></div>`},
{k:"II", t:"Représenter des données", h:`
  <h4>1. Trois types de représentations</h4>
  <div class="figs">${C_BAR}${C_PIE}</div>
  <div class="retenir" data-l="À retenir"><p>Le <b>diagramme en barres</b> : la hauteur de chaque barre est proportionnelle à l'effectif.</p>
   <p>Le <b>diagramme circulaire</b> : l'angle de chaque secteur est proportionnel à l'effectif. Le total correspond à 360°.</p></div>
  <p><b>Exemple :</b> ici, le foot est représenté par un angle de ${F(8,20)} × 360° = 144°.</p>
  ${C_LINE}
  <div class="retenir" data-l="À retenir"><p>Le <b>graphique cartésien</b> montre l'évolution d'une grandeur.</p></div>
  <p><b>Exemple :</b> chaque point a pour abscisse l'heure et pour ordonnée la température. Ici, à 12 h, il faisait 17 °C.</p>
  <h4>2. Choisir une représentation</h4>
  <div class="retenir" data-l="Méthode"><p><b>1)</b> <b>diagramme en barres</b> : pour comparer des effectifs ;</p><p><b>2)</b> <b>diagramme circulaire</b> : pour montrer la répartition d'un tout ;</p><p><b>3)</b> <b>graphique cartésien</b> : pour suivre une évolution.</p></div>`},
{k:"III", t:"La moyenne", h:`
  <div class="retenir" data-l="Définition"><p>La <b>moyenne</b> d'une série de nombres est égale à la somme des valeurs divisée par le nombre de valeurs :</p><p class="calc">moyenne = ${F("somme des valeurs","nombre de valeurs")}</p></div>
  <p><b>Exemple :</b> notes de Léa : 12 ; 15 ; 9 ; 14 ; 10.</p>
  <p class="calc">Somme : 12 + 15 + 9 + 14 + 10 = 60<br>Moyenne : 60 ÷ 5 = 12</p>
  <p>Léa a eu <b>en moyenne</b> 12.</p>
  <div class="attention"><b>ATTENTION :</b> la moyenne résume la série par un seul nombre. Elle ne dit pas comment les valeurs sont réparties (elle n'est pas forcément l'une des valeurs).</div>
  <p><b>À toi de jouer :</b> calcule la moyenne de 7 ; 13 ; 10 ; 6, puis la fréquence (en %) de 6 élèves sur 25.</p>
  <details><summary>Voir la correction</summary><div class="corr"><p>La moyenne M :</p>${KC("M",["(7 + 13 + 10 + 6) ÷ 4","36 ÷ 4","9"])}<p>La fréquence f :</p>${KC("f",[F(6,25),F(24,100),"24 %"])}</div></details>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Effectifs et fréquences", e:[
  {n:"Activité 1", t:"Recueillir et organiser des données", w:"Sur ta feuille et sur ton cahier", h:`<p>On a demandé à 24 élèves comment ils viennent au collège.</p><p><b>B</b> = bus ; <b>V</b> = vélo ; <b>P</b> = à pied ; <b>T</b> = voiture.</p><p>Voici les réponses :</p>
   <div class="scroll"><table class="std"><tbody>${["BPTPBPTT","BPPPBBVV","BPBBTVBV"].map(r=>`<tr>${[...r].map(l=>`<td><b>${l}</b></td>`).join("")}</tr>`).join("")}</tbody></table></div>
   <p><b>1)</b> Complète le tableau directement sur la fiche. Compte chaque réponse en la barrant au fur et à mesure.</p>
   ${tab(["Moyen de transport","Bus","Vélo","À pied","Voiture","Total"],[["Effectif","","","","",""]])}
   <p><b>2)</b> Quelle est la fréquence du bus ? Écris-la sous forme d'une fraction irréductible, sur ton cahier.</p>`,
   c:`<p><b>1)</b></p>${tab(["Moyen de transport","Bus","Vélo","À pied","Voiture","Total"],[["Effectif","9","4","7","4","24"]])}<p><b>2)</b> Fréquence du bus : ${F(9,24)} = ${F(3,8)} (on divise 9 et 24 par 3).</p>`},
  {n:"Exercice 1", t:"Calculer des fréquences", w:"Sur ta feuille", h:`<p>On a interrogé 25 élèves de la classe sur le nombre de frères et sœurs qu'ils ont. Complète directement sur la fiche.</p>
   ${tab(["Nombre de frères et sœurs","0","1","2","3","Total"],[["Effectif","5","11","6","3",""],["Fréquence (fraction)","","","","",""],["Fréquence (nombre décimal)","","","","",""],["Fréquence (pourcentage)","","","","",""]])}
   <p>Vérifie que la somme des fréquences en pourcentage vaut 100 %.</p>`,
   c:`${tab(["Nombre de frères et sœurs","0","1","2","3","Total"],[["Effectif","5","11","6","3","25"],["Fréquence (fraction)",F(5,25),F(11,25),F(6,25),F(3,25),"1"],["Fréquence (nombre décimal)","0,2","0,44","0,24","0,12","1"],["Fréquence (pourcentage)","20 %","44 %","24 %","12 %","100 %"]])}
   <p>20 + 44 + 24 + 12 = 100 : la somme des fréquences est bien 100 %.</p>`},
  {n:"Exercice 2", t:"Fréquences et comparaison", w:"Sur ton cahier", h:`<p>Dans une classe de 28 élèves, 7 portent des lunettes, 14 ont les cheveux bruns et 21 sont nés avant juillet.</p>
   <p><b>a)</b> Calcule la fréquence de chaque caractéristique sous forme de fraction irréductible, puis en pourcentage.</p>
   <p><b>b)</b> Dans une autre classe, 9 élèves sur 30 portent des lunettes. Dans quelle classe la proportion d'élèves qui portent des lunettes est-elle la plus grande ?</p>`,
   c:`<p>Fréquence f = ${F("effectif","effectif total")}. On simplifie la fraction, puis on l'écrit sur 100.</p><p><b>a)</b> Lunettes :</p>${KC("f",[F(7,28),F(1,4),F(25,100),"25 %"])}<p>Cheveux bruns :</p>${KC("f",[F(14,28),F(1,2),F(50,100),"50 %"])}<p>Nés avant juillet :</p>${KC("f",[F(21,28),F(3,4),F(75,100),"75 %"])}
   <p><b>b)</b> Dans l'autre classe :</p>${KC("f",[F(9,30),"0,3","30 %"])}<p>30 % &gt; 25 % : la proportion est plus grande dans l'autre classe.</p>`}
 ]},
{t:"Lire et construire des représentations", e:[
  {n:"Exercice 3", t:"Lire un diagramme en barres", w:"Sur ton cahier", h:`<p>Le diagramme en barres ci-dessous donne le nombre de livres empruntés au CDI selon les jours de la semaine.</p>${E3}
   <p><b>a)</b> Combien de livres ont été empruntés le jeudi ? le vendredi ?</p><p><b>b)</b> Quel jour y a-t-il eu le plus d'emprunts ? Combien de fois plus que le vendredi ?</p><p><b>c)</b> Quel est le nombre total de livres empruntés ? Calcule la fréquence du lundi en pourcentage.</p>`,
   c:`<p><b>a)</b> Jeudi : 15 livres ; vendredi : 5 livres.</p><p><b>b)</b> Le jeudi (15 livres). 15 ÷ 5 = 3 : trois fois plus que le vendredi.</p><p><b>c)</b> Total : 12 + 8 + 15 + 5 = 40 livres.</p><p>Fréquence du lundi :</p>${KC("f",[F(12,40),"0,3","30 %"])}`},
  {n:"Exercice 4", t:"Construire un diagramme en barres", w:"Sur ton cahier", h:`<p>Les élèves d'un club choisissent leur sport :</p>${tab(["Sport","Football","Basket","Judo","Danse"],[["Nombre d'élèves","12","8","6","4"]])}
   <p>Construis un diagramme en barres :</p><p>axe vertical : 1 cm pour 2 élèves ;</p><p>barres de 1 cm de largeur, espacées de 1 cm.</p><p>N'oublie pas le titre et les graduations.</p>`,
   c:`<p>1 cm pour 2 élèves : on divise chaque effectif par 2 pour avoir la hauteur de la barre.</p><p>Football : 12 ÷ 2 = 6 cm ; Basket : 8 ÷ 2 = 4 cm.</p><p>Judo : 6 ÷ 2 = 3 cm ; Danse : 4 ÷ 2 = 2 cm.</p>${E4c}`},
  {n:"Exercice 5", t:"Construire un diagramme circulaire", w:"Sur ta feuille et sur ton cahier", h:`<p>À la cantine, 24 élèves ont choisi leur plat : voici les effectifs. Le diagramme circulaire complet représente 24 élèves, soit 360°.</p>
   ${tab(["Plat","Poisson","Viande","Végétarien","Œufs","Total"],[["Effectif","6","9","6","3","24"],["Angle (en degrés)","","","","","360"]])}
   <p><b>1)</b> Complète directement sur la fiche le tableau des angles (proportionnalité).</p><p><b>2)</b> Construis sur ton cahier le diagramme circulaire (rayon 4 cm, rapporteur).</p>`,
   c:`${tab(["Plat","Poisson","Viande","Végétarien","Œufs","Total"],[["Effectif","6","9","6","3","24"],["Angle (en degrés)","90","135","90","45","360"]])}
   <p><b>1)</b> 360 ÷ 24 = 15 : 1 élève correspond à 15°. Donc 6 × 15 = 90°, 9 × 15 = 135°, 3 × 15 = 45°. Vérification : 90 + 135 + 90 + 45 = 360.</p>
   <p><b>2)</b> On trace un cercle de rayon 4 cm et un rayon. Puis on trace les secteurs de 90°, 135°, 90° et 45° les uns à la suite des autres.</p>${E5c}`},
  {n:"Exercice 6", t:"Lire un diagramme circulaire", w:"Sur ton cahier", h:`<p>Le diagramme circulaire représente le moyen de transport des 200 élèves d'un collège.</p>${E6}
   <p><b>a)</b> Quel moyen de transport est le plus utilisé ? le moins utilisé ?</p><p><b>b)</b> Calcule le nombre d'élèves pour chaque moyen de transport.</p><p><b>c)</b> Quelle fraction des élèves vient à pied ou à vélo ?</p>`,
   c:`<p><b>a)</b> Le plus utilisé : le bus (40 %). Le moins utilisé : le vélo (15 %).</p>
   <p><b>b)</b> Bus : 200 × ${F(40,100)} = 80 élèves.</p><p>Vélo : 200 × ${F(15,100)} = 30 élèves.</p><p>À pied : 200 × ${F(25,100)} = 50 élèves.</p><p>Voiture : 200 × ${F(20,100)} = 40 élèves.</p><p>Total : 80 + 30 + 50 + 40 = 200.</p>
   <p><b>c)</b> La fraction f des élèves qui viennent à pied ou à vélo :</p>${KC("f",["25 % + 15 %","40 %",F(40,100),F(2,5)])}<p>${F(2,5)} des élèves viennent à pied ou à vélo.</p>`},
  {n:"Exercice 7", t:"Lire un graphique cartésien", w:"Sur ton cahier", h:`<p>On a relevé la température à Cholet un jour de printemps.</p>${E7}
   <p><b>a)</b> Quelle était la température à 10 h ? à 16 h ?</p><p><b>b)</b> À quelle heure la température relevée est-elle maximale ? Quelle est cette température ?</p><p><b>c)</b> Pendant quelle période de relevés la température a-t-elle baissé ?</p><p><b>d)</b> De combien de degrés la température a-t-elle augmenté entre 6 h et 14 h ?</p>`,
   c:`<p><b>a)</b> À 10 h : 13 °C ; à 16 h : 17 °C.</p><p><b>b)</b> Maximum à 14 h : 18 °C.</p><p><b>c)</b> Entre 14 h et 18 h (de 18 °C à 13 °C).</p><p><b>d)</b> 18 − 7 = 11 : la température a augmenté de 11 °C.</p>`},
  {n:"Exercice 8", t:"Construire un graphique cartésien", w:"Sur ton cahier", h:`<p>On mesure la taille d'une plante chaque semaine.</p>${tab(["Semaine","0","1","2","3","4"],[["Taille (cm)","2","5","9","12","14"]])}
   <p>Construis un graphique cartésien :</p><p>en abscisse, la semaine (1 cm pour 1 semaine) ;</p><p>en ordonnée, la taille (1 cm pour 2 cm).</p><p>Place les points puis relie-les.</p>`,
   c:`<p>On place un point pour chaque colonne du tableau :</p><p>(0 ; 2), (1 ; 5), (2 ; 9), (3 ; 12) et (4 ; 14).</p><p>L'abscisse est la semaine, l'ordonnée est la taille en cm.</p>${E8c}`},
  {n:"Exercice 9", t:"Choisir une représentation", w:"Sur ton cahier", h:`<p>Pour chaque situation, indique en une phrase la représentation la plus adaptée : diagramme en barres, diagramme circulaire ou graphique cartésien.</p>
   <p><b>a)</b> L'évolution de la population d'une ville de 1950 à 2020.</p><p><b>b)</b> La comparaison du nombre de médailles de 5 pays aux Jeux olympiques.</p><p><b>c)</b> La répartition du budget d'une famille (logement, nourriture, loisirs, autres).</p>`,
   c:`<p><b>a)</b> Un graphique cartésien : on suit une évolution au cours du temps.</p><p><b>b)</b> Un diagramme en barres : on compare des effectifs.</p><p><b>c)</b> Un diagramme circulaire : on montre la répartition d'un tout.</p>`}
 ]},
{t:"La moyenne", e:[
  {n:"Exercice 10", t:"Calculer une moyenne", w:"Sur ton cahier", h:`<p>Calcule la moyenne de chaque série.</p><p><b>a)</b> 5 ; 8 ; 11 ; 12 ; 14</p><p><b>b)</b> 7 ; 9 ; 12 ; 8 ; 14</p><p><b>c)</b> 1,52 m ; 1,48 m ; 1,60 m ; 1,56 m</p><p><b>d)</b> 2,5 ; 4 ; 3,5 ; 6</p>`,
   c:`<p>La moyenne M de chaque série :</p><p><b>a)</b></p>${KC("M",["(5 + 8 + 11 + 12 + 14) ÷ 5","50 ÷ 5","10"])}<p><b>b)</b></p>${KC("M",["(7 + 9 + 12 + 8 + 14) ÷ 5","50 ÷ 5","10"])}<p><b>c)</b></p>${KC("M",["(1,52 + 1,48 + 1,60 + 1,56) ÷ 4","6,16 ÷ 4","1,54 m"])}<p><b>d)</b></p>${KC("M",["(2,5 + 4 + 3,5 + 6) ÷ 4","16 ÷ 4","4"])}`},
  {n:"Exercice 11", t:"Températures de la semaine", w:"Sur ton cahier", h:`<p>Voici les températures maximales relevées pendant une semaine à Cholet :</p><p>14 °C ; 16 °C ; 15 °C ; 11 °C ; 13 °C ; 17 °C ; 18 °C.</p>
   <p><b>a)</b> Quelle est la température maximale moyenne de la semaine ?</p><p><b>b)</b> Quelle est la différence entre la température la plus haute et la plus basse ?</p>`,
   c:`<p><b>a)</b> Somme : 14 + 16 + 15 + 11 + 13 + 17 + 18 = 104. Moyenne : 104 ÷ 7 ≈ 14,9 °C.</p><p><b>b)</b> 18 − 11 = 7 : l'écart est de 7 °C.</p>`},
  {n:"Exercice 12", t:"Pour aller plus loin : raisonner avec la moyenne", w:"Sur ton cahier", h:`<p><b>a)</b> Léa a obtenu 11, 14 et 8 à ses trois premiers devoirs. Quelle note doit-elle obtenir au quatrième pour avoir 12 de moyenne ?</p>
   <p><b>b)</b> La moyenne de la classe de 5eA est 12,4 et celle de 5eB est 11,8. Peut-on affirmer que chaque élève de 5eA a une meilleure note que chaque élève de 5eB ? Explique.</p>`,
   c:`<p><b>a)</b> Pour avoir 12 de moyenne sur 4 devoirs, la somme doit valoir 4 × 12 = 48. Les trois premières notes font 11 + 14 + 8 = 33. Il faut donc 48 − 33 = 15.</p>
   <p><b>b)</b> Non : la moyenne résume la série par un seul nombre. Un élève de 5eB peut avoir une meilleure note qu'un élève de 5eA, même si la moyenne de 5eA est plus élevée.</p>`},
  {n:"Exercice 13", t:"Pour aller plus loin : Florence Nightingale", w:"Sur ton cahier", h:`<p>Florence Nightingale (1820-1910), infirmière et statisticienne britannique, a utilisé des diagrammes circulaires colorés. Pendant la guerre de Crimée, elle voulait convaincre les responsables de l'armée que les maladies tuaient plus de soldats que les blessures.</p>
   <p><b>1)</b> Pourquoi un diagramme est-il souvent plus convaincant qu'un tableau de nombres ?</p><p><b>2)</b> Cherche un autre exemple d'une situation où une représentation graphique a servi à mieux comprendre ou à convaincre.</p>`,
   c:`<p><b>1)</b> Un diagramme permet de comparer les données d'un seul coup d'œil, sans avoir à lire tous les nombres.</p><p><b>2)</b> Réponse libre (par exemple : courbe de température d'un malade, graphique de l'évolution du climat…).</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Effectifs et fréquences", schema:S_FREQ, q:{
 1:[ {g:()=>{ const t=pick([20,25,50]), n=ri(1,t-1), p=n*100/t; return {q:`Sur ${t} élèves, ${n} ${n===1?"a":"ont"} choisi le foot. Quelle est la fréquence du foot, en pourcentage ?`, rep:[String(p), p+" %", p+"%"], ex:KCi("f",[F(n,t),F(p,100),p+" %"]), sx:S_FREQ}; }} ],
 2:[ {g:()=>{ const t=pick([24,28,30,36,40]); let n; do{ n=ri(2,t-2); }while(gcd(n,t)===1); const g=gcd(n,t);
       return {q:`Dans une classe de ${t} élèves, ${n} viennent en bus. Quelle est la fréquence du bus, sous forme de fraction irréductible ?`, c:shuf(uniq(irr(n,t),[F(n,t-n), irr(t-n,t), F(t/g,n/g)])), rep:irr(n,t), ex:`${F(n,t)} : on divise ${n} et ${t} par ${g}.`, sx:S_FREQ}; }},
     {g:()=>{ const t=pick([20,25,50]), n=ri(1,t-1); return {q:`Sur ${t} élèves, ${n} ${n===1?"a":"ont"} 1 frère ou sœur. Écris cette fréquence sous forme de nombre décimal.`, rep:N(n/t), ex:KCi("f",[F(n,t),`${n} ÷ ${t}`,N(n/t)]), sx:S_FREQ}; }} ],
 3:[ {q:"La somme des fréquences de toutes les valeurs d'une série est toujours égale à…", c:["1 (ou 100 %)","l'effectif total","0"], rep:"1 (ou 100 %)", sx:S_FREQ},
     {g:()=>{ const a=ri(1,5), b=pick([28,30]), p=a*100/b, oth=pick([20,25]), m=ri(1,oth-1), q=m*100/oth; if(rd(p,6)===q) return {q:`Classe A : ${a} ${a===1?"élève":"élèves"} sur ${b} ${a===1?"porte":"portent"} des lunettes. Classe B : ${m} sur ${oth}. Dans quelle classe la proportion est-elle la plus grande ?`, c:["A","B","autant"], rep:"autant", sx:S_FREQ};
       return {q:`Classe A : ${a} ${a===1?"élève":"élèves"} sur ${b} ${a===1?"porte":"portent"} des lunettes. Classe B : ${m} sur ${oth}. Dans quelle classe la proportion est-elle la plus grande ?`, c:["A","B","autant"], rep:p>q?"A":"B", ex:`A : ${F(a,b)} ${Number.isInteger(rd(p,6))?"=":"≈"} ${N(p,1)} % ; B : ${F(m,oth)} = ${q} %. On compare les fréquences, pas les effectifs.`, sx:S_FREQ}; }} ]
}},
{nom:"Diagramme en barres", schema:S_BAR, q:{
 1:[ {g:()=>{ const B=qBars(), i=ri(0,3); return {q:`Combien de livres ont été empruntés le ${JOURS[i].toLowerCase()} ?`, fig:B.fig, rep:String(B.v[i]), ex:`On lit la hauteur de la barre du ${JOURS[i].toLowerCase()} sur l'axe vertical.`, sx:B.sx}; }} ],
 2:[ {g:()=>{ const B=qBars(); return {q:"Quel est le nombre total de livres empruntés ?", fig:B.fig, rep:String(B.T0), ex:`${B.v.join(" + ")} = ${B.T0}.`, sx:B.sx}; }} ],
 3:[ {g:()=>{ const B=qBars(), i=ri(0,3), p=B.v[i]*100/B.T0; return {q:`Quelle est la fréquence du ${JOURS[i].toLowerCase()}, en pourcentage ?`, fig:B.fig, rep:[N(p), N(p)+" %"], ex:`Total : ${B.v.join(" + ")} = ${B.T0}. Fréquence f du ${JOURS[i].toLowerCase()} :${KCi("f",[F(B.v[i],B.T0),N(p/100),N(p)+" %"])}`, sx:B.sx}; }} ]
}},
{nom:"Diagramme circulaire", schema:S_PIE, q:{
 1:[ {g:()=>{ const t=pick([12,18,20,24,30,36,40,45,60]), n=ri(1,t-1), k=360/t; return {q:`Un diagramme circulaire représente ${t} élèves (360°). Quel angle (en degrés) correspond à ${n} élève${n>1?"s":""} ?`, rep:[String(n*k), n*k+"°"], ex:`360 ÷ ${t} = ${k} : 1 élève correspond à ${k}°. ${n} × ${k} = ${n*k}°.`, sx:S_PIE}; }} ],
 2:[ {g:()=>{ const tot=pick([200,300,400,500]); const p=split(4,20,2,8).map(x=>x*5), cats=shuf(["Bus","Vélo","À pied","Voiture"]), i=ri(0,3);
       return {q:`Ce diagramme représente le moyen de transport des ${tot} élèves d'un collège. Combien d'élèves viennent ${cats[i]==="À pied"?"à pied":cats[i]==="Bus"?"en bus":cats[i]==="Vélo"?"à vélo":"en voiture"} ?`, fig:pie({vals:p, w:300, R:110, lab:j=>[cats[j], p[j]+" %"]}), rep:String(tot*p[i]/100), ex:`${tot} × ${F(p[i],100)} = ${tot*p[i]/100}.`, sx:S_PIE}; }} ],
 3:[ {g:()=>{ const t=pick([12,18,20,24,30,36,40]), n=ri(1,t-1), k=360/t; return {q:`Un diagramme circulaire représente ${t} élèves. Un secteur mesure ${n*k}°. Combien d'élèves représente-t-il ?`, rep:String(n), ex:`1 élève correspond à 360 ÷ ${t} = ${k}°. ${n*k} ÷ ${k} = ${n}.`, sx:S_PIE}; }} ]
}},
{nom:"Graphique cartésien", schema:S_LINE, q:{
 1:[ {g:()=>{ const G=qTemp(), i=ri(0,6), h=6+2*i; return {q:`Quelle était la température à ${h} h ? (en °C)`, fig:G.fig, rep:[String(G.y[i]), G.y[i]+" °C", G.y[i]+"°C"], ex:`Le point d'abscisse ${h} a pour ordonnée ${G.y[i]}.`, sx:G.sx}; }} ],
 2:[ {g:()=>{ const G=qTemp(), h=6+2*G.im; return {q:"À quelle heure la température relevée est-elle maximale ?", fig:G.fig, rep:[String(h), h+" h", h+"h"], ex:`Le point le plus haut a pour abscisse ${h} : ${G.y[G.im]} °C à ${h} h.`, sx:G.sx}; }} ],
 3:[ {g:()=>{ const G=qTemp(), h=6+2*G.im, d=G.y[G.im]-G.y[0]; return {q:`De combien de degrés la température a-t-elle augmenté entre 6 h et ${h} h ?`, fig:G.fig, rep:[String(d), d+" °C", d+"°C"], ex:`${G.y[G.im]} − ${G.y[0]} = ${d}.`, sx:G.sx}; }},
     {g:()=>{ const G=qTemp(), h=6+2*G.im; return {q:"Pendant quelle période de relevés la température a-t-elle baissé ?", fig:G.fig, c:uniq(`entre ${h} h et 18 h`,[`entre 6 h et ${h} h`, `entre 6 h et 18 h`]), rep:`entre ${h} h et 18 h`, ex:`Après ${h} h, les points descendent.`, sx:G.sx}; }} ]
}},
{nom:"Choisir une représentation", schema:S_CHOIX, q:{
 1:[ {g:()=>qSit([SIT[0],SIT[3],SIT[5]])} ],
 2:[ {g:()=>qSit([SIT[1],SIT[2],SIT[4],SIT[6]])} ],
 3:[ {q:"Un diagramme circulaire sert surtout à…", c:["montrer la répartition d'un tout","suivre une évolution","comparer des effectifs"], rep:"montrer la répartition d'un tout", sx:S_CHOIX},
     {q:"Dans un diagramme en barres, la hauteur de chaque barre est proportionnelle…", c:["à l'effectif","au nombre de barres","à l'angle"], rep:"à l'effectif", sx:S_BAR} ]
}},
{nom:"La moyenne", schema:S_MOY, q:{
 1:[ {g:()=>{ const n=pick([4,5]); let v; do{ v=Array.from({length:n},()=>ri(4,18)); }while(sum(v)%n); return {q:`Calcule la moyenne de : ${v.join(" ; ")}.`, rep:String(sum(v)/n), ex:KCi("M",[`(${v.join(" + ")}) ÷ ${n}`,`${sum(v)} ÷ ${n}`,sum(v)/n]), sx:S_MOY}; }} ],
 2:[ {g:()=>{ let v; do{ v=Array.from({length:4},()=>ri(4,13)/2); }while(!Number.isInteger(sum(v))||Number.isInteger(sum(v)/4)); const s=sum(v), m=s/4; return {q:`Calcule la moyenne de : ${v.map(x=>N(x)).join(" ; ")}.`, rep:N(m,4), ex:KCi("M",[`(${v.map(x=>N(x)).join(" + ")}) ÷ 4`,`${N(s)} ÷ 4`,N(m,4)]), sx:S_MOY}; }},
     {g:()=>{ let v; do{ v=Array.from({length:7},()=>ri(9,22)); }while(sum(v)%7===0); const s=sum(v); return {q:`Températures de la semaine (en °C) : ${v.join(" ; ")}. Quelle est la moyenne, arrondie au dixième ?`, rep:[N(s/7,1), N(s/7,1)+" °C"], ex:`Somme : ${s}. ${s} ÷ 7 ≈ ${N(s/7,1)}.`, sx:S_MOY}; }} ],
 3:[ {g:()=>{ let a,b,c,m,x; do{ a=ri(6,18); b=ri(6,18); c=ri(6,18); m=ri(10,14); x=4*m-a-b-c; }while(x<0||x>20); return {q:`Léa a obtenu ${a}, ${b} et ${c} à ses trois premiers devoirs. Quelle note doit-elle obtenir au quatrième pour avoir ${m} de moyenne ?`, rep:String(x), ex:`La somme doit valoir 4 × ${m} = ${4*m}. ${a} + ${b} + ${c} = ${a+b+c}. ${4*m} − ${a+b+c} = ${x}.`, sx:S_MOY}; }},
     {q:"Vrai ou faux : la moyenne d'une série est toujours l'une des valeurs de la série.", c:VF, rep:"Faux", ex:"Par exemple, la moyenne de 7 ; 13 ; 10 ; 6 est 9, qui n'est pas dans la série.", sx:S_MOY} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
const MAREE = {xs:[6,7,8,9,10,11,12], ys:[2,3,4.5,5.5,6,5.5,4.5]};
const G_MAREE = line({...MAREE, title:"Hauteur d'eau dans un port", xlab:"Heure (h)", ylab:"Hauteur d'eau (m)", xmin:5, xmax:13, xstep:1, ymax:7, ystep:0.5, ylabStep:1, w:560, H:340});
const LIV = {cats:["0 livre","1 livre","2 livres","3 livres","4 livres"], vals:[3,7,6,3,1]};
const G_LIV = bars({...LIV, title:"Livres lus pendant les vacances", ylab:"Nombre d'élèves", ymax:8, ystep:1, ylabStep:1, w:520, H:290});
const G_LIVc = bars({...LIV, title:"Livres lus pendant les vacances", ylab:"Nombre d'élèves", ymax:8, ystep:1, ylabStep:1, w:520, H:290, show:true});
const SORT = {cats:["Musée","Zoo","Cinéma","Piscine"], vals:[9,15,8,4]};
const G_SORT = bars({cats:SORT.cats, vals:[9,15,0,0], title:"Sortie de fin d'année", ylab:"Nombre de votes", ymax:16, ystep:1, ylabStep:2, w:460, H:320}).replace(/<rect[^>]*height="0.0"[^>]*\/>/g,"");
const G_SORTc = bars({...SORT, title:"Sortie de fin d'année", ylab:"Nombre de votes", ymax:16, ystep:1, ylabStep:2, w:460, H:320, show:true});
const P_SORT = pie({...SORT, title:"Sortie de fin d'année", w:330, R:125, lab:i=>[SORT.cats[i], SORT.vals[i]*10+"°"]});
const SAIS = tab(["Saison préférée","Printemps","Été","Automne","Hiver","Total"],[["Effectif","10","18","4","8",""],["Fréquence (%)","","","","",""]]);
const SAISc = tab(["Saison préférée","Printemps","Été","Automne","Hiver","Total"],[["Effectif","10","18","4","8","40"],["Fréquence (%)","25 %","45 %","10 %","20 %","100 %"]]);
const FREQc = `<div class="calcs">${[["Printemps",[F(10,40),F(1,4),F(25,100),"25 %"]],["Été",[F(18,40),F(9,20),F(45,100),"45 %"]],["Automne",[F(4,40),F(1,10),F(10,100),"10 %"]],["Hiver",[F(8,40),F(1,5),F(20,100),"20 %"]]].map(([s,L])=>`<div><p>${s} :</p>${KC("f",L)}</div>`).join("")}</div>`;
const ANGc = `<p class="calc">360 ÷ 36 = 10 : 1 élève correspond à 10°.<br>Musée : 9 × 10 = 90°<br>Zoo : 15 × 10 = 150°<br>Cinéma : 8 × 10 = 80°<br>Piscine : 4 × 10 = 40°</p><p>Vérification : 90 + 150 + 80 + 40 = 360.</p>`;
const MAREEh = `<p>Le graphique ci-dessous donne la hauteur d'eau relevée toutes les heures dans un port, au cours d'une matinée.</p>${G_MAREE}`;
const LIVh = `<p>On a demandé aux élèves d'une classe combien de livres ils ont lus pendant les vacances. Voici les résultats.</p>${G_LIV}`;
const SORTh = `<p>Les 36 élèves d'un atelier ont voté pour la sortie de fin d'année. Voici les résultats :</p>${tab(["Sortie","Musée","Zoo","Cinéma","Piscine"],[["Nombre de votes","9","15","8","4"]])}`;
const COMP = [
  ["COMMUNIQUER","Je lis et j'interprète un graphique cartésien et un diagramme en barres.","Ex. 1 et 4 (8 points)"],
  ["CALCULER","Je calcule une moyenne et des fréquences.","Ex. 2 et 3 (6 points)"],
  ["REPRÉSENTER","Je complète un diagramme en barres et je calcule les angles d'un diagramme circulaire.","Ex. 5 (4 points)"],
  ["RAISONNER","Je choisis une représentation adaptée à une situation.","Ex. 6 (2 points)"]
];
const COMPb = [
  ["COMMUNIQUER","Je lis et j'interprète un graphique cartésien et un diagramme en barres.","Ex. 1 et 4 (7 points)"],
  ["CALCULER","Je calcule une moyenne et des fréquences.","Ex. 2 et 3 (6 points)"],
  ["REPRÉSENTER","Je complète un diagramme en barres et je calcule les angles d'un diagramme circulaire.","Ex. 5 (5 points)"],
  ["RAISONNER","Je choisis une représentation adaptée à une situation.","Ex. 6 (2 points)"]
];
const INFO = "Durée : 45 min · Calculatrice non autorisée · Règle et crayons de couleur";
return {
titre:"Évaluation d'entraînement — Chapitre 13", duree:45, info:INFO,
comp:COMP,
exos:[
{t:"Lire un graphique cartésien", p:4, h:`${MAREEh}
  <p>a) Quelle était la hauteur d'eau à 8 h ?</p><p>b) À quelle heure la mer a-t-elle été la plus haute ? Quelle était alors la hauteur d'eau ?</p><p>c) À quelles heures la hauteur d'eau relevée était-elle de 5,5 m ?</p><p>d) Un voilier ne peut entrer dans le port que si la hauteur d'eau est d'au moins 4,5 m. Entre quelles heures relevées peut-il entrer ?</p>`,
 c:`<p>On lit l'heure sur l'axe horizontal et la hauteur d'eau sur l'axe vertical.</p><p>a) À 8 h, la hauteur d'eau était de <b>4,5 m</b>. <i>(1 point)</i></p><p>b) Le point le plus haut est celui de <b>10 h</b> : la hauteur d'eau était de <b>6 m</b>. <i>(1 point : 0,5 pour l'heure, 0,5 pour la hauteur)</i></p><p>c) La hauteur d'eau était de 5,5 m à <b>9 h</b> et à <b>11 h</b>. <i>(1 point : 0,5 par heure)</i></p><p>d) La hauteur d'eau est d'au moins 4,5 m de <b>8 h</b> à <b>12 h</b> (4,5 m ; 5,5 m ; 6 m ; 5,5 m ; 4,5 m). <i>(1 point)</i></p>`},
{t:"Calculer et interpréter une moyenne", p:3, h:`<p>Inès s'entraîne au 50 m. Voici ses quatre premiers temps, en secondes : 9,2 ; 8,8 ; 9,5 ; 8,5.</p>
  <p>a) Calcule son temps moyen.</p><p>b) À son cinquième essai, elle court en 7,5 s. Calcule son nouveau temps moyen sur les cinq essais.</p><p>c) Inès dit : « Mon temps moyen est de 8,7 s, donc j'ai couru une fois en 8,7 s. » A-t-elle raison ? Explique.</p>`,
 c:`<p>Moyenne = somme des valeurs ÷ nombre de valeurs.</p><p>a)</p><p class="calc">Somme : 9,2 + 8,8 + 9,5 + 8,5 = 36<br>Moyenne : 36 ÷ 4 = 9</p><p>Son temps moyen est de <b>9 s</b>. <i>(1 point)</i></p>
  <p>b)</p><p class="calc">Somme : 36 + 7,5 = 43,5<br>Moyenne : 43,5 ÷ 5 = 8,7</p><p>Son nouveau temps moyen est de <b>8,7 s</b>. <i>(1 point)</i></p>
  <p>c) <b>Non</b> : ses temps sont 9,2 s ; 8,8 s ; 9,5 s ; 8,5 s et 7,5 s. Aucun n'est égal à 8,7 s. La moyenne résume la série par un seul nombre : ce n'est pas forcément l'une des valeurs. <i>(1 point : 0,5 pour la réponse, 0,5 pour l'explication)</i></p>`},
{t:"Calculer des fréquences", p:3, h:`<p>On a demandé à 40 élèves leur saison préférée.</p>${SAIS}
  <p>1. Complète la case « Total », puis calcule chaque fréquence en pourcentage. Écris tes calculs.</p><p>2. Quel pourcentage des élèves préfère l'automne ou l'hiver ?</p>`,
 c:`<p>Fréquence = ${F("effectif","effectif total")}.</p><p>1. Total : 10 + 18 + 4 + 8 = 40. <i>(0,5 point)</i></p>${FREQc}${SAISc}<p><i>0,5 point par fréquence (2 points).</i></p><p>2. 10 % + 20 % = <b>30 %</b> des élèves. <i>(0,5 point)</i></p>`},
{t:"Lire un diagramme en barres", p:4, h:`${LIVh}
  <p>a) Quel nombre de livres a été le plus souvent cité ? Par combien d'élèves ?</p><p>b) Combien d'élèves ont répondu ? Écris ton calcul.</p><p>c) Combien d'élèves ont lu au moins 3 livres ?</p><p>d) Quelle est la fréquence, en pourcentage, des élèves qui n'ont lu aucun livre ?</p>`,
 c:`${G_LIVc}<p>a) La barre la plus haute est celle de « 1 livre » : <b>7 élèves</b> ont lu 1 livre. <i>(1 point)</i></p><p>b)</p><p class="calc">3 + 7 + 6 + 3 + 1 = 20</p><p><b>20 élèves</b> ont répondu. <i>(1 point)</i></p><p>c) « Au moins 3 livres », c'est 3 livres ou 4 livres : 3 + 1 = <b>4 élèves</b>. <i>(1 point)</i></p><p>d) 3 élèves sur 20 n'ont lu aucun livre :</p>${KC("f",[F(3,20),F(15,100),"15 %"])}<p>La fréquence est de <b>15 %</b>. <i>(1 point)</i></p>`},
{t:"Représenter des données", p:4, h:`${SORTh}${G_SORT}
  <p>1. Recopie et complète le diagramme en barres pour « Cinéma » et « Piscine ».</p><p>2. On veut aussi représenter ces votes par un diagramme circulaire : les 36 élèves correspondent à 360°. Calcule l'angle du secteur de chaque sortie.</p>`,
 c:`<p>1. Barre « Cinéma » : hauteur 8 ; barre « Piscine » : hauteur 4. <i>(1 point : 0,5 par barre)</i></p>${G_SORTc}
  <p>2. Les angles sont proportionnels aux effectifs.</p>${ANGc}<p><i>1 point pour « 1 élève correspond à 10° », puis 0,5 point par angle (3 points).</i></p><p>Voici le diagramme circulaire obtenu (il n'était pas demandé de le tracer) :</p>${P_SORT}`},
{t:"Choisir une représentation", p:2, h:`<p>Pour chaque situation, quelle représentation choisir : diagramme en barres, diagramme circulaire ou graphique cartésien ?</p>
  <p>a) La répartition des dépenses d'un club de sport sur une saison (matériel, transport, licences).</p><p>b) L'évolution du nombre de visiteurs d'un musée, mois après mois, pendant une année.</p><p>c) La comparaison du nombre d'adhérents de cinq clubs de la ville.</p><p>d) Explique ton choix pour la situation b).</p>`,
 c:`<p>a) Un <b>diagramme circulaire</b> : on montre la répartition d'un tout. <i>(0,5 point)</i></p><p>b) Un <b>graphique cartésien</b>. <i>(0,5 point)</i></p><p>c) Un <b>diagramme en barres</b> : on compare des effectifs. <i>(0,5 point)</i></p><p>d) On suit l'évolution d'une grandeur au cours du temps : le graphique cartésien le montre bien. <i>(0,5 point)</i></p>`}
],
bep:{
titre:"Évaluation d'entraînement — Chapitre 13 · version aménagée", duree:45, info:"Version aménagée · "+INFO,
note:"Même durée, avec environ une question sur cinq en moins (les questions restantes sont renumérotées). Toujours sur 20 : les points sont répartis sur les questions gardées. Les justifications restent demandées.",
comp:COMPb,
exos:[
{t:"Lire un graphique cartésien", p:3.5, h:`${MAREEh}
  <p>a) Quelle était la hauteur d'eau à 8 h ?</p><p>b) À quelle heure la mer a-t-elle été la plus haute ? Quelle était alors la hauteur d'eau ?</p><p>c) À quelles heures la hauteur d'eau relevée était-elle de 5,5 m ?</p>`,
 c:`<p>On lit l'heure sur l'axe horizontal et la hauteur d'eau sur l'axe vertical.</p><p>a) À 8 h, la hauteur d'eau était de <b>4,5 m</b>. <i>(1 point)</i></p><p>b) Le point le plus haut est celui de <b>10 h</b> : la hauteur d'eau était de <b>6 m</b>. <i>(1,5 point : 0,5 pour l'heure, 1 pour la hauteur)</i></p><p>c) La hauteur d'eau était de 5,5 m à <b>9 h</b> et à <b>11 h</b>. <i>(1 point : 0,5 par heure)</i></p>`},
{t:"Calculer et interpréter une moyenne", p:2.5, h:`<p>Inès s'entraîne au 50 m. Voici ses quatre temps, en secondes : 9,2 ; 8,8 ; 9,5 ; 8,5.</p>
  <p>a) Calcule son temps moyen.</p><p>b) Inès dit : « Mon temps moyen est de 9 s, donc j'ai couru une fois en 9 s. » A-t-elle raison ? Explique.</p>`,
 c:`<p>Moyenne = somme des valeurs ÷ nombre de valeurs.</p><p>a)</p><p class="calc">Somme : 9,2 + 8,8 + 9,5 + 8,5 = 36<br>Moyenne : 36 ÷ 4 = 9</p><p>Son temps moyen est de <b>9 s</b>. <i>(1,5 point)</i></p>
  <p>b) <b>Non</b> : ses temps sont 9,2 s ; 8,8 s ; 9,5 s et 8,5 s. Aucun n'est égal à 9 s. La moyenne résume la série par un seul nombre : ce n'est pas forcément l'une des valeurs. <i>(1 point : 0,5 pour la réponse, 0,5 pour l'explication)</i></p>`},
{t:"Calculer des fréquences", p:3.5, h:`<p>On a demandé à 40 élèves leur saison préférée.</p>${SAIS}
  <p>1. Complète la case « Total », puis calcule chaque fréquence en pourcentage. Écris tes calculs.</p><p>2. Quel pourcentage des élèves préfère l'automne ou l'hiver ?</p>`,
 c:`<p>Fréquence = ${F("effectif","effectif total")}.</p><p>1. Total : 10 + 18 + 4 + 8 = 40. <i>(0,5 point)</i></p>${FREQc}${SAISc}<p><i>0,5 point par fréquence (2 points).</i></p><p>2. 10 % + 20 % = <b>30 %</b> des élèves. <i>(1 point)</i></p>`},
{t:"Lire un diagramme en barres", p:3.5, h:`${LIVh}
  <p>a) Quel nombre de livres a été le plus souvent cité ? Par combien d'élèves ?</p><p>b) Combien d'élèves ont répondu ? Écris ton calcul.</p><p>c) Quelle est la fréquence, en pourcentage, des élèves qui n'ont lu aucun livre ?</p>`,
 c:`${G_LIVc}<p>a) La barre la plus haute est celle de « 1 livre » : <b>7 élèves</b> ont lu 1 livre. <i>(1 point)</i></p><p>b)</p><p class="calc">3 + 7 + 6 + 3 + 1 = 20</p><p><b>20 élèves</b> ont répondu. <i>(1 point)</i></p><p>c) 3 élèves sur 20 n'ont lu aucun livre :</p>${KC("f",[F(3,20),F(15,100),"15 %"])}<p>La fréquence est de <b>15 %</b>. <i>(1,5 point)</i></p>`},
{t:"Représenter des données", p:5, h:`${SORTh}${G_SORT}
  <p>1. Recopie et complète le diagramme en barres pour « Cinéma » et « Piscine ».</p><p>2. On veut aussi représenter ces votes par un diagramme circulaire : les 36 élèves correspondent à 360°. Calcule l'angle du secteur de chaque sortie.</p>`,
 c:`<p>1. Barre « Cinéma » : hauteur 8 ; barre « Piscine » : hauteur 4. <i>(2 points : 1 par barre)</i></p>${G_SORTc}
  <p>2. Les angles sont proportionnels aux effectifs.</p>${ANGc}<p><i>1 point pour « 1 élève correspond à 10° », puis 0,5 point par angle (3 points).</i></p><p>Voici le diagramme circulaire obtenu (il n'était pas demandé de le tracer) :</p>${P_SORT}`},
{t:"Choisir une représentation", p:2, h:`<p>Pour chaque situation, quelle représentation choisir : diagramme en barres, diagramme circulaire ou graphique cartésien ?</p>
  <p>a) La répartition des dépenses d'un club de sport sur une saison (matériel, transport, licences).</p><p>b) L'évolution du nombre de visiteurs d'un musée, mois après mois, pendant une année.</p><p>c) Explique ton choix pour la situation b).</p>`,
 c:`<p>a) Un <b>diagramme circulaire</b> : on montre la répartition d'un tout. <i>(0,5 point)</i></p><p>b) Un <b>graphique cartésien</b>. <i>(0,5 point)</i></p><p>c) On suit l'évolution d'une grandeur au cours du temps : le graphique cartésien le montre bien. <i>(1 point)</i></p>`}
]}
};
})()
};
})();
