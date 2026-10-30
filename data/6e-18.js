/* 6e — Chapitre 18 : Probabilités (cours et fiche d'exercices de M. Staal) */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const co = (p,alt,w) => img("c618co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("c618ex/"+p+".png", alt, w);
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const F = (a,b) => `{${a}/${b}}`;
const gcd = (a,b) => b ? gcd(b, a%b) : a;
/* probabilité a/b : fraction, simplifiée si possible ; 0 et 1 en entier */
const P = (a,b) => { if(a===0) return "0"; if(a===b) return "1"; const g=gcd(a,b); return g>1 ? `${F(a,b)} = ${F(a/g,b/g)}` : F(a,b); };
const PR = (a,b) => { if(a===0) return ["0"]; if(a===b) return ["1",`${a}/${b}`]; const g=gcd(a,b); return [`${a}/${b}`, `${a/g}/${b/g}`]; };

/* échelle des probabilités avec des lettres placées */
function echelle(pts=[], o={}){
  const W=o.w||460, x0=24, x1=W-24, X=p=>x0+(x1-x0)*p;
  /* étiquettes trop proches : on les empile (une ligne de plus par étiquette voisine) */
  const lv=[]; pts.forEach(([l,p],i)=>{ let k=0; while(pts.slice(0,i).some(([,q],j)=>lv[j]===k && Math.abs(X(q)-X(p))<16)) k++; lv.push(k); });
  const top=16*Math.max(0,...lv), y=46+top;
  let s=`<svg class="fig" viewBox="0 0 ${W} ${90+top}" width="${W}" style="max-width:100%" role="img" aria-label="Échelle des probabilités de 0 à 1"><defs><linearGradient id="gEch" x1="0" x2="1"><stop offset="0" stop-color="#f2a7a2"/><stop offset="1" stop-color="#9fdc9f"/></linearGradient></defs>`;
  s+=`<rect x="${x0}" y="${y-5}" width="${x1-x0}" height="10" style="fill:url(#gEch);stroke:var(--ink);stroke-width:1.5"/>`;
  [[0,"0"],[0.25,""],[0.5,"½"],[0.75,""],[1,"1"]].forEach(([p,t])=>{ s+=`<line x1="${X(p)}" y1="${y-10}" x2="${X(p)}" y2="${y+10}" style="stroke:var(--ink);stroke-width:${t?2:1.2}"/>`; if(t) s+=`<text x="${X(p)}" y="${y+28}" text-anchor="middle" style="font-size:15px;font-weight:700;fill:var(--ink)">${t}</text>`; });
  pts.forEach(([l,p],i)=>{ const dy=lv[i]*16; s+=`<path d="M${X(p)} ${y-8} l-5 -9 h10 z" style="fill:#1e5aa8"/><text x="${X(p)}" y="${y-20-dy}" text-anchor="middle" style="font-size:15px;font-weight:700;fill:#1e5aa8">${l}</text>`; });
  return s+"</svg>";
}
/* sac de boules : liste de [couleur, nombre] */
const COL = {rouge:"#d9534f", bleue:"#3a7bd5", verte:"#4aa64a", jaune:"#f0c030", noire:"#333"};
function sac(L){ const all=[]; L.forEach(([c,n])=>{ for(let i=0;i<n;i++) all.push(COL[c]); }); const per=Math.min(8,Math.max(5,Math.ceil(Math.sqrt(all.length*2)))), rows=Math.ceil(all.length/per), W=per*26+30, H=rows*26+34;
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Un sac de boules"><rect x="3" y="3" width="${W-6}" height="${H-6}" rx="16" style="fill:#f6eedd;stroke:#8a6a3c;stroke-width:2.5"/><line x1="14" y1="11" x2="${W-14}" y2="11" style="stroke:#8a6a3c;stroke-width:3"/>`;
  all.forEach((c,i)=>{ s+=`<circle cx="${28+(i%per)*26}" cy="${30+Math.floor(i/per)*26}" r="11" style="fill:${c};stroke:#222;stroke-width:1"/>`; }); return s+"</svg>"; }
/* roue à n secteurs égaux : couleurs */
function roue(cols, nums=false){ const n=cols.length, R=60, cx=70, cy=78; let s=`<svg class="fig" viewBox="0 0 140 146" width="140" role="img" aria-label="Une roue de ${n} secteurs égaux"><path d="M70 2 v12 m-5 -5 l5 6 l5 -6" style="fill:none;stroke:#222;stroke-width:2.5"/>`;
  cols.forEach((c,i)=>{ const a0=-90+i*360/n, a1=a0+360/n, r=Math.PI/180; const p=a=>[cx+R*Math.cos(a*r), cy+R*Math.sin(a*r)]; const [x0,y0]=p(a0),[x1,y1]=p(a1); s+=`<path d="M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" style="fill:${COL[c]||c};stroke:#222;stroke-width:1.5"/>`; if(nums){ const [tx,ty]=[cx+R*0.66*Math.cos((a0+a1)/2*r), cy+R*0.66*Math.sin((a0+a1)/2*r)]; s+=`<text x="${tx.toFixed(1)}" y="${(ty+5).toFixed(1)}" text-anchor="middle" style="font-size:14px;font-weight:700;fill:#fff">${i+1}</text>`; } });
  return s+`<circle cx="${cx}" cy="${cy}" r="3.5" style="fill:#222"/></svg>`; }
window.FIG18 = {echelle, sac, roue, P, PR, F, gcd};

/* ---------- schémas ---------- */
const S_VOC = sch("Le vocabulaire", `<p class="schN">Lancer un dé : expérience <b>aléatoire</b>. Les <b>issues</b> : 1, 2, 3, 4, 5, 6. « Obtenir un nombre pair » est un <b>événement</b> réalisé par 2, 4 et 6. « Obtenir 7 » est <b>impossible</b> ; « obtenir moins de 7 » est <b>certain</b>.</p>`);
const S_ECH = sch("L'échelle des probabilités", co("echelle","Échelle de 0 (impossible) à 1 (certain)",420));
const S_EQ = sch("Calculer une probabilité", co("sac","Un sac : 3 boules rouges, 5 bleues, 2 vertes",170)+`<p class="calc">probabilité = ${F("nombre d'issues favorables","nombre total d'issues")}</p><p class="schN">Rouge : ${F(3,10)} = 0,3 ; bleue : ${F(5,10)} = ${F(1,2)}. Valable seulement si les issues sont <b>équiprobables</b>.</p>`);
const S_FREQ = sch("Fréquence et probabilité", `<p class="schN">Fréquence = nombre de fois où l'événement s'est réalisé ÷ nombre d'essais. Avec un très grand nombre d'essais, elle se rapproche de la probabilité.</p>`);

CH["6e-18"] = {
intro:"Expérience aléatoire, issues et événements, l'échelle des probabilités, calculer une probabilité quand les issues sont équiprobables, et comparer fréquence et probabilité.",
savoir:[
  "reconnaître une expérience aléatoire et citer ses issues ;",
  "utiliser le vocabulaire : issue, événement, impossible, certain, probable ;",
  "placer un événement sur une échelle de probabilité de 0 à 1 ;",
  "calculer une probabilité dans une situation d'équiprobabilité ;",
  "comparer la fréquence observée lors d'une expérience répétée et la probabilité."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Vocabulaire des probabilités", h:`
  <h4>1. Expérience aléatoire et issues</h4>
  <div class="retenir" data-l="Définition"><p>Une <b>expérience aléatoire</b> est une expérience dont on connaît tous les résultats possibles, mais dont on ne peut pas prévoir le résultat à l'avance. Les résultats possibles s'appellent les <b>issues</b>.</p></div>
  <p><b>Exemples :</b></p><ul><li>on lance une pièce de monnaie : les issues sont « pile » et « face » ;</li><li>on lance un dé à 6 faces : les issues sont 1, 2, 3, 4, 5 et 6.</li></ul>
  <h4>2. Événements</h4>
  <div class="retenir" data-l="Définition"><p>Un <b>événement</b> est une condition qui peut être réalisée ou non par les issues d'une expérience.</p></div>
  <p><b>Exemple :</b> avec un dé, l'événement « obtenir un nombre pair » est réalisé par les issues 2, 4 et 6.</p>
  <ul><li><b>événement impossible</b> : il n'est jamais réalisé (« obtenir 7 » avec un dé) ;</li><li><b>événement certain</b> : il est toujours réalisé (« obtenir un nombre inférieur à 7 » avec un dé).</li></ul>
  <h4>3. L'échelle des probabilités</h4>
  <div class="retenir" data-l="Propriété"><p>La <b>probabilité</b> d'un événement est un nombre compris entre 0 et 1 qui mesure la chance qu'il a de se réaliser. Un événement impossible a une probabilité de 0 ; un événement certain a une probabilité de 1.</p></div>
  ${co("echelle","Échelle des probabilités : impossible (0), peu probable, une chance sur deux (½), très probable, certain (1)",470)}
  <p><b>Remarque :</b> une probabilité peut s'écrire sous forme de fraction, de nombre décimal ou de pourcentage : ${F(1,2)} = 0,5 = 50 %.</p>`},
{k:"II", t:"L'équiprobabilité", h:`
  <div class="retenir" data-l="Définition"><p>Lorsque toutes les issues d'une expérience ont la même chance de se réaliser, on dit qu'elles sont <b>équiprobables</b>. C'est le cas avec un dé équilibré, une pièce équilibrée, ou un tirage au hasard dans un sac de boules identiques au toucher.</p></div>
  <div class="retenir" data-l="Propriété"><p>Dans une situation d'équiprobabilité :</p><p class="calc">probabilité d'un événement = ${F("nombre d'issues qui réalisent l'événement","nombre total d'issues")}</p></div>
  <p><b>Exemple :</b> on lance un dé équilibré à 6 faces. Il y a 6 issues équiprobables.</p><ul><li>probabilité d'obtenir 5 : ${F(1,6)} (une issue sur six) ;</li><li>probabilité d'obtenir un nombre pair : ${F(3,6)} = ${F(1,2)} (les issues 2, 4 et 6).</li></ul>
  <div class="cpt"><div><p><b>Exemple :</b> un sac contient 3 boules rouges, 5 bleues et 2 vertes. On tire une boule au hasard : il y a 10 issues équiprobables.</p><p>Probabilité de tirer une boule rouge : ${F(3,10)} = 0,3.</p><p>Probabilité de tirer une boule bleue : ${F(5,10)} = ${F(1,2)}.</p></div>${co("sac","Un sac : 3 boules rouges, 5 bleues, 2 vertes",170)}</div>
  <p class="attention"><b>ATTENTION :</b> si les issues ne sont pas équiprobables (dé truqué, roue aux secteurs de tailles différentes…), on ne peut pas simplement compter les issues.</p>
  <div class="cpt"><p><b>Exemple :</b> sur cette roue, les trois couleurs ne sont pas équiprobables. Le secteur rouge occupe la moitié de la roue : la probabilité d'obtenir rouge est ${F(1,2)}, et pas ${F(1,3)}.</p>${co("roue","Une roue : rouge sur la moitié, vert et bleu sur un quart chacun",120)}</div>`},
{k:"III", t:"Fréquence et probabilité", h:`
  <div class="retenir" data-l="Définition"><p>Quand on répète une expérience, la <b>fréquence</b> d'un événement est le quotient : nombre de fois où il s'est réalisé ÷ nombre total d'essais.</p></div>
  <div class="retenir" data-l="Propriété"><p>Quand on répète une expérience aléatoire un très grand nombre de fois, la fréquence d'un événement se rapproche de sa probabilité.</p></div>
  <p><b>Exemple :</b> on lance 1 000 fois une pièce équilibrée et on obtient 508 fois « pile ». La fréquence de « pile » est ${F(508,1000)} = 0,508 : elle est proche de la probabilité ${F(1,2)} = 0,5.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Vocabulaire des probabilités", e:[
  {n:"Activité 1", t:"Hasard ou pas ?", w:"Sur ta feuille", h:`<p>Pour chaque expérience, dis si on peut prévoir le résultat à l'avance. Entoure les expériences aléatoires.</p><p>a) Lancer un dé. · b) Mesurer la longueur de sa table. · c) Tirer au sort le nom d'un élève. · d) Calculer 12 × 5. · e) Lancer une pièce de monnaie. · f) Faire tourner une roue de loterie.</p>`,
   c:`<p>Expériences aléatoires (on ne peut pas prévoir le résultat) : <b>a), c), e) et f)</b>.</p><p>b) et d) ne sont pas aléatoires : on peut prévoir le résultat (la longueur de la table ne change pas ; 12 × 5 = 60 à chaque fois).</p>`},
  {n:"Exercice 1", t:"Les issues", w:"Sur ta feuille", h:`<p>Écris toutes les issues de chaque expérience aléatoire.</p><p>a) On lance une pièce de monnaie. · b) On fait tourner une roue à 8 secteurs numérotés de 1 à 8. · c) On tire une boule dans un sac de boules rouges, vertes et jaunes. · d) On choisit au hasard une lettre du mot MATHS.</p>`,
   c:`<p>a) pile, face · b) 1, 2, 3, 4, 5, 6, 7, 8 · c) rouge, vert, jaune · d) M, A, T, H, S</p>`},
  {n:"Exercice 2", t:"Les événements", w:"Sur ta feuille", h:`<p>On lance un dé à 6 faces. Pour chaque événement, écris les issues qui le réalisent.</p><p>a) « Obtenir un nombre impair » · b) « Obtenir un multiple de 3 » · c) « Obtenir plus de 4 » · d) « Obtenir 2 ou moins » · e) « Obtenir 0 » · f) « Obtenir entre 1 et 6 »</p><p>Parmi ces événements, lequel est impossible ? Lequel est certain ?</p>`,
   c:`<p>a) 1, 3, 5 · b) 3, 6 · c) 5, 6 · d) 1, 2 · e) aucune issue · f) 1, 2, 3, 4, 5, 6</p><p>L'événement e) est <b>impossible</b> ; l'événement f) est <b>certain</b>.</p>`},
  {n:"Exercice 3", t:"Impossible, possible ou certain ?", w:"Sur ta feuille", h:`<div class="cpt"><div><p>Un sac contient 4 boules rouges et 2 boules bleues. On tire une boule au hasard.</p><p>a) Tirer une boule rouge · b) Tirer une boule verte · c) Tirer une boule rouge ou bleue · d) Tirer une boule bleue</p></div>${sac([["rouge",4],["bleue",2]])}</div>`,
   c:`<p>a) <b>possible</b> : il y a des boules rouges, mais aussi des bleues. · b) <b>impossible</b> : il n'y a aucune boule verte. · c) <b>certain</b> : toutes les boules sont rouges ou bleues. · d) <b>possible</b> : il y a des boules bleues, mais aussi des rouges.</p>`},
  {n:"Exercice 4", t:"L'échelle des probabilités", w:"Sur ta feuille", h:`<p>Place la lettre de chaque événement sur l'échelle.</p><p>A : « Obtenir pile en lançant une pièce. » B : « Obtenir 7 avec un dé à 6 faces. » C : « Le soleil se lèvera demain. » D : « Il neigera à Nice le 15 août. » E : « Obtenir moins de 6 avec un dé. » F : « Gagner au loto avec une seule grille. »</p>${ex("e4","Échelle des probabilités de 0 à 1",470)}`,
   c:`${echelle([["B",0],["F",0.015],["D",0.04],["A",0.5],["E",5/6],["C",1]])}<p>B est impossible (0). F et D sont très peu probables (presque 0). A : une chance sur deux (½). E : 5 issues sur 6 (1, 2, 3, 4, 5), très probable. C est certain (1).</p>`}
 ]},
{t:"L'équiprobabilité", e:[
  {n:"Exercice 5", t:"Équiprobable ou pas ?", w:"Sur ta feuille", h:`<div class="cpt"><div><p>Dans chaque cas, les issues sont-elles équiprobables ? Explique.</p><p>a) On fait tourner la roue A : on regarde la couleur. b) On fait tourner la roue B : on regarde la couleur. c) On lance une pièce équilibrée. d) On tire une boule dans un sac de 3 boules rouges et 1 bleue : on regarde la couleur.</p></div>${ex("e5","Roue A : 4 quarts de couleurs différentes ; roue B : secteurs de tailles différentes",230)}</div>`,
   c:`<p>a) <b>Oui</b> : les 4 couleurs occupent chacune un quart de la roue.</p><p>b) <b>Non</b> : le rouge occupe la moitié de la roue, le jaune un quart, le vert et le bleu seulement un huitième chacun.</p><p>c) <b>Oui</b> : pile et face ont la même chance.</p><p>d) <b>Non</b> : il y a 3 chances sur 4 de tirer rouge et 1 sur 4 de tirer bleu.</p>`},
  {n:"Exercice 6", t:"Le dé", w:"Sur ta feuille", h:`<p>On lance un dé équilibré à 6 faces. Donne la probabilité de chaque événement sous forme de fraction.</p><p>a) Obtenir 4 · b) Obtenir un nombre pair · c) Obtenir un multiple de 3 · d) Obtenir plus de 4 · e) Obtenir 7 · f) Obtenir moins de 7</p>`,
   c:`<p>Il y a 6 issues équiprobables : 1, 2, 3, 4, 5, 6.</p><p>a) une seule issue (4) : <b>${F(1,6)}</b> · b) <b>${F(3,6)} = ${F(1,2)}</b> (2, 4, 6) · c) <b>${F(2,6)} = ${F(1,3)}</b> (3, 6) · d) <b>${F(2,6)} = ${F(1,3)}</b> (5, 6) · e) aucune issue : <b>0</b> (impossible) · f) les 6 issues : <b>${F(6,6)} = 1</b> (certain)</p>`},
  {n:"Exercice 7", t:"Le sac de boules", w:"Sur ta feuille", h:`<div class="cpt"><div><p>Ce sac contient 6 boules rouges, 3 bleues et 1 verte. On tire une boule au hasard.</p><p>a) Quelle est la probabilité de tirer une boule rouge ? bleue ? verte ?</p><p>b) Calcule la somme A de ces trois probabilités. Que remarques-tu ?</p><p>c) Combien de boules vertes faut-il ajouter pour avoir autant de chances de tirer une verte qu'une bleue ?</p></div>${ex("e7","Un sac : 6 boules rouges, 3 bleues, 1 verte",150)}</div>`,
   c:`<p>a) Il y a 10 boules. Rouge : <b>${F(6,10)} = ${F(3,5)}</b> · bleue : <b>${F(3,10)}</b> · verte : <b>${F(1,10)}</b>.</p><p class="calc">b) A = ${F(6,10)} + ${F(3,10)} + ${F(1,10)}<br>A = ${F(10,10)}<br>A = <b>1</b></p><p>La somme des probabilités de toutes les issues est égale à 1 (on est certain de tirer une boule d'une de ces couleurs).</p><p>c) Il faut autant de vertes que de bleues : 3 vertes. Il y en a déjà 1 : 3 − 1 = 2. On doit donc <b>ajouter 2 boules vertes</b>.</p>`},
  {n:"Exercice 8", t:"La roue de la fête", w:"Sur ta feuille", h:`<div class="cpt"><div><p>La roue est partagée en 8 secteurs égaux. On la fait tourner et on regarde le secteur indiqué par la flèche. Donne la probabilité :</p><p>a) de tomber sur le rouge ; b) sur le bleu ; c) sur le jaune ; d) sur un nombre pair ; e) sur un nombre plus grand que 6 ; f) sur le noir.</p></div>${ex("e8","Une roue de 8 secteurs numérotés et colorés",160)}</div>`,
   c:`<p>a) rouge (1, 3, 5, 7) : <b>${F(4,8)} = ${F(1,2)}</b> · b) bleu (2, 6) : <b>${F(2,8)} = ${F(1,4)}</b> · c) jaune (4) : <b>${F(1,8)}</b></p><p>d) pair (2, 4, 6, 8) : <b>${F(4,8)} = ${F(1,2)}</b> · e) plus grand que 6 (7, 8) : <b>${F(2,8)} = ${F(1,4)}</b> · f) noir : <b>0</b> (impossible)</p>`},
  {n:"Exercice 9", t:"L'urne", w:"Sur ta feuille", h:`<p>Une urne contient 20 étiquettes numérotées de 1 à 20. On tire une étiquette au hasard. Donne la probabilité de tirer :</p><p>a) le nombre 13 · b) un multiple de 5 · c) un nombre pair · d) un nombre à deux chiffres · e) un multiple de 3 · f) un nombre inférieur à 25</p>`,
   c:`<p>Il y a 20 issues équiprobables.</p><p>a) une seule étiquette (13) : <b>${F(1,20)}</b> · b) 5, 10, 15, 20 : <b>${F(4,20)} = ${F(1,5)}</b> · c) 2, 4, 6, …, 20 (10 nombres) : <b>${F(10,20)} = ${F(1,2)}</b></p><p>d) de 10 à 20 (11 nombres) : <b>${F(11,20)}</b> · e) 3, 6, 9, 12, 15, 18 : <b>${F(6,20)} = ${F(3,10)}</b> · f) les 20 nombres sont inférieurs à 25 : <b>${F(20,20)} = 1</b> (certain)</p>`},
  {n:"Exercice 10", t:"Une lettre au hasard", w:"Sur ta feuille", h:`<p>On écrit chaque lettre du mot PROBABILITE sur un carton (un carton par lettre), puis on tire un carton au hasard. Quelle est la probabilité de tirer :</p><p>a) la lettre P · b) la lettre B · c) une voyelle · d) la lettre Z</p>`,
   c:`<p>PROBABILITE a <b>11 lettres</b>, donc 11 cartons.</p><p>a) une seule lettre P : <b>${F(1,11)}</b> · b) deux B : <b>${F(2,11)}</b> · c) O, A, I, I, E (5 voyelles) : <b>${F(5,11)}</b> · d) aucune lettre Z : <b>0</b> (impossible)</p>`},
  {n:"Exercice 11", t:"Qui a raison ?", w:"Sur ton cahier", h:`<p>Explique si chaque élève a raison ou tort.</p><p>Léa : « Avec un dé équilibré, j'ai moins de chances d'obtenir 6 que 1. »</p><p>Tom : « Quand je lance une pièce équilibrée, j'ai une chance sur deux d'obtenir face. »</p><p>Inès : « J'ai obtenu pile trois fois de suite, donc au prochain lancer j'aurai sûrement face. »</p>`,
   c:`<p><b>Léa a tort :</b> le dé est équilibré, chaque face a la même probabilité, ${F(1,6)}.</p><p><b>Tom a raison :</b> la probabilité d'obtenir face est ${F(1,2)}.</p><p><b>Inès a tort :</b> la pièce n'a pas de mémoire. Au prochain lancer, la probabilité d'obtenir face est toujours ${F(1,2)}.</p>`}
 ]},
{t:"Fréquence et probabilité", e:[
  {n:"Activité 2", t:"Pile ou face en classe", w:"Sur ta feuille", h:`<p>1) Lance 20 fois une pièce et note le nombre de « pile » obtenus.</p><p>2) Calcule la fréquence de « pile » (nombre de « pile » ÷ 20).</p><p>3) Regroupe les résultats de toute la classe et complète le tableau. Que remarques-tu ?</p><div class="scroll"><table class="std"><thead><tr><th></th><th>Moi</th><th>Mon groupe</th><th>La classe</th></tr></thead><tbody><tr><th>Nombre de lancers</th><td style="height:2.6em;min-width:5em">20</td><td style="min-width:5em"></td><td style="min-width:5em"></td></tr><tr><th>Nombre de « pile »</th><td style="height:2.6em"></td><td></td><td></td></tr><tr><th>Fréquence de « pile »</th><td style="height:2.6em"></td><td></td><td></td></tr></tbody></table></div>`,
   c:`<p>Les résultats dépendent des lancers. Voici un <b>exemple</b> de tableau rempli (groupe de 4 élèves, classe de 25 élèves).</p><div class="scroll"><table class="std"><thead><tr><th></th><th>Moi</th><th>Mon groupe</th><th>La classe</th></tr></thead><tbody><tr><th>Nombre de lancers</th><td>20</td><td>80</td><td>500</td></tr><tr><th>Nombre de « pile »</th><td>12</td><td>43</td><td>246</td></tr><tr><th>Fréquence de « pile »</th><td>12 ÷ 20 = 0,6</td><td>43 ÷ 80 ≈ 0,54</td><td>246 ÷ 500 = 0,492</td></tr></tbody></table></div><p>3) Plus on fait de lancers, plus la fréquence de « pile » se rapproche de <b>0,5</b>, la probabilité d'obtenir pile.</p>`},
  {n:"Exercice 12", t:"Les dés de Lucas et de Mia", w:"Sur ta feuille", h:`<p>Lucas et Mia ont chacun lancé leur dé 600 fois. Voici leurs résultats.</p><div class="scroll"><table class="std"><thead><tr><th>Face obtenue</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th></tr></thead><tbody><tr><th>Dé de Lucas</th><td>98</td><td>104</td><td>95</td><td>101</td><td>99</td><td>103</td></tr><tr><th>Dé de Mia</th><td>60</td><td>62</td><td>58</td><td>61</td><td>59</td><td>300</td></tr></tbody></table></div><p>a) Si un dé est équilibré, combien de fois environ doit-on obtenir chaque face en 600 lancers ?</p><p>b) Calcule la fréquence de la face 6 pour chaque dé.</p><p>c) À ton avis, l'un des dés est-il truqué ? Explique.</p>`,
   c:`<p>a) Chaque face a une probabilité de ${F(1,6)} : environ 600 ÷ 6 = <b>100 fois</b>.</p><p>b) Lucas : ${F(103,600)} = 103 ÷ 600 ≈ <b>0,17</b> · Mia : ${F(300,600)} = 300 ÷ 600 = <b>0,5</b>.</p><p>c) Le dé de Lucas semble équilibré : chaque face sort environ 100 fois. <b>Le dé de Mia est sûrement truqué</b> : le 6 sort une fois sur deux, au lieu d'environ une fois sur six.</p>`},
  {n:"En ++", t:"Fabrique ton sac", w:"Sur ton cahier", h:`<p>a) Compose un sac de 12 boules rouges, bleues et vertes tel que la probabilité de tirer une rouge soit ${F(1,2)} et celle de tirer une verte soit ${F(1,4)}.</p><p>b) Compose un sac de 10 boules dans lequel tirer une boule rouge est certain.</p>`,
   c:`<div class="cpt"><p>a) ${F(1,2)} de 12 = 6 rouges ; ${F(1,4)} de 12 = 3 vertes ; il reste 12 − 6 − 3 = 3 bleues. <b>6 rouges, 3 vertes, 3 bleues.</b></p>${sac([["rouge",6],["verte",3],["bleue",3]])}</div><p>b) <b>10 boules rouges</b> (aucune autre couleur).</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Le vocabulaire", schema:S_VOC, q:{
 1:[ {q:"Lancer un dé est une expérience…", c:["aléatoire","prévisible","impossible"], rep:"aléatoire", sx:S_VOC},
     {q:"Avec un dé à 6 faces, « obtenir 7 » est un événement…", c:["impossible","certain","probable"], rep:"impossible", sx:S_VOC} ],
 2:[ {q:"Avec un dé à 6 faces, « obtenir un nombre plus petit que 7 » est…", c:["certain","impossible","peu probable"], rep:"certain", sx:S_VOC},
     {g:()=>{ const e=pick([["un nombre pair","2, 4, 6"],["un multiple de 3","3, 6"],["plus de 4","5, 6"],["un nombre impair","1, 3, 5"]]); return {q:`Avec un dé, quelles issues réalisent « obtenir ${e[0]} » ?`, c:shuf(uniq(e[1],["2, 4, 6","3, 6","5, 6","1, 3, 5","4, 5, 6"]).slice(0,3)), rep:e[1], sx:S_VOC}; }} ],
 3:[ {q:"Une probabilité est toujours…", c:["entre 0 et 1","plus grande que 1","un nombre entier"], rep:"entre 0 et 1", sx:S_ECH},
     {q:"Quelle probabilité correspond à « une chance sur deux » ?", c:["0,5","0,2","2"], rep:"0,5", sx:S_ECH} ]
}},
{nom:"Calculer une probabilité", schema:S_EQ, q:{
 1:[ {g:()=>{ const k=ri(1,6); return {q:`On lance un dé équilibré. Probabilité d'obtenir ${k} ?`, c:shuf([F(1,6),F(1,2),F(k,6)].filter((x,i,a)=>a.indexOf(x)===i)), rep:F(1,6), sx:S_EQ}; }} ],
 2:[ {g:()=>{ const r=ri(1,6), b=ri(1,6), v=ri(1,4), t=r+b+v; const c=pick([["rouge",r],["bleue",b],["verte",v]]); return {q:`Un sac contient ${r} boule${r>1?"s":""} rouge${r>1?"s":""}, ${b} bleue${b>1?"s":""} et ${v} verte${v>1?"s":""}. Probabilité de tirer une boule ${c[0]} ?`, fig:sac([["rouge",r],["bleue",b],["verte",v]]), rep:PR(c[1],t), ex:`${c[1]} boule${c[1]>1?"s":""} ${c[0]}${c[1]>1?"s":""} sur ${t} boules : ${F(c[1],t)}.`, sx:S_EQ}; }} ],
 3:[ {g:()=>{ const n=pick([10,12,20]), e=pick([["un nombre pair",x=>x%2===0],["un multiple de 3",x=>x%3===0],["un multiple de 5",x=>x%5===0],["un nombre à deux chiffres",x=>x>=10]]); const k=[...Array(n)].map((_,i)=>i+1).filter(e[1]).length; return {q:`Une urne contient ${n} étiquettes numérotées de 1 à ${n}. Probabilité de tirer ${e[0]} ?`, rep:PR(k,n), ex:`${k} étiquette${k>1?"s":""} sur ${n}.`, sx:S_EQ}; }},
     {q:"Sur une roue, le rouge occupe la moitié, le vert et le bleu un quart chacun. Probabilité d'obtenir rouge ?", c:[F(1,2),F(1,3),F(1,4)], rep:F(1,2), ex:"Les couleurs ne sont pas équiprobables : on regarde la place qu'elles occupent.", sx:S_EQ} ]
}},
{nom:"Fréquence et probabilité", schema:S_FREQ, q:{
 1:[ {g:()=>{ const n=pick([10,20,50]), k=ri(1,n-1); return {q:`Sur ${n} lancers, on a obtenu ${k} fois « pile ». Fréquence de « pile » (nombre décimal) ?`, rep:String(k/n).replace(".",","), ex:`${k} ÷ ${n}.`, sx:S_FREQ}; }} ],
 2:[ {q:"On lance un très grand nombre de fois une pièce équilibrée. La fréquence de « face » se rapproche de…", c:["0,5","1","0"], rep:"0,5", sx:S_FREQ} ],
 3:[ {q:"Un dé lancé 600 fois donne 300 fois le 6. Ce dé est sûrement…", c:["truqué","équilibré"], rep:"truqué", ex:"Pour un dé équilibré, on attend environ 100 fois chaque face.", sx:S_FREQ},
     {q:"J'ai obtenu pile 3 fois de suite. Au prochain lancer, la probabilité d'obtenir face est…", c:[F(1,2),"1","plus grande que " + F(1,2)], rep:F(1,2), ex:"La pièce n'a pas de mémoire.", sx:S_FREQ} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
const R8 = ["rouge","bleue","rouge","verte","rouge","bleue","noire","rouge"], R4 = ["rouge","bleue","rouge","verte"];
const big = (s,w) => s.replace('width="140"', `width="${w}"`);
const souv = t => `<div class="retenir" data-l="Je me souviens"><p>${t}</p></div>`;
return {
titre:"Évaluation d'entraînement — Chapitre 18", duree:25, info:"Durée : 25 min · Calculatrice non autorisée",
comp:[
  ["COMMUNIQUER","J'utilise le bon vocabulaire : issue, événement, impossible, possible, certain.","Ex. 1 (3 points)"],
  ["CALCULER","Je calcule une probabilité quand les issues sont équiprobables.","Ex. 2 (3 points)"],
  ["REPRÉSENTER","Je place des événements sur l'échelle des probabilités.","Ex. 3 (2 points)"],
  ["RAISONNER","Je compare une fréquence observée et une probabilité.","Ex. 4 (2 points)"]
],
exos:[
{t:"L'urne aux neuf boules", p:3, h:`<p>Une urne contient 9 boules identiques au toucher, numérotées de 1 à 9. On tire une boule au hasard et on lit son numéro.</p>
  <p>a) Écris toutes les issues de cette expérience.</p><p>b) Quelles issues réalisent l'événement « tirer un multiple de 3 » ?</p>
  <p>c) Pour chacun de ces événements, écris s'il est impossible, possible ou certain :</p><p>« tirer un nombre plus petit que 10 » ; « tirer le numéro 0 » ; « tirer un nombre pair ».</p>`,
 c:`<p>a) Les issues sont : 1, 2, 3, 4, 5, 6, 7, 8 et 9. <i>(0,5 point)</i></p>
  <p>b) Les issues 3, 6 et 9. <i>(1 point)</i></p>
  <p>c) « Tirer un nombre plus petit que 10 » est <b>certain</b> : tous les numéros sont plus petits que 10. <i>(0,5 point)</i></p>
  <p>« Tirer le numéro 0 » est <b>impossible</b> : aucune boule ne porte le numéro 0. <i>(0,5 point)</i></p>
  <p>« Tirer un nombre pair » est <b>possible</b> : les issues 2, 4, 6 et 8 le réalisent, mais pas les autres. <i>(0,5 point)</i></p>`},
{t:"La roue de la kermesse", p:3, h:`<div class="cpt"><div><p>Cette roue est partagée en 8 secteurs de même taille, numérotés de 1 à 8. On la fait tourner et on regarde le secteur indiqué par la flèche.</p>
  <p>a) Les 8 issues sont-elles équiprobables ? Pourquoi ?</p><p>b) Quelle est la probabilité de tomber sur un secteur rouge ?</p><p>c) Quelle est la probabilité de tomber sur un secteur bleu ?</p><p>d) Quelle est la probabilité de tomber sur un numéro plus grand que 5 ?</p></div>${big(roue(R8,true),180)}</div>`,
 c:`<p>a) <b>Oui</b> : les 8 secteurs ont la même taille, ils ont donc tous la même chance d'être indiqués par la flèche. <i>(0,5 point)</i></p>
  <p>b) Les secteurs rouges sont les numéros 1, 3, 5 et 8 : 4 secteurs sur 8. La probabilité est <b>${F(4,8)} = ${F(1,2)}</b>. <i>(1 point)</i></p>
  <p>c) Les secteurs bleus sont les numéros 2 et 6 : 2 secteurs sur 8. La probabilité est <b>${F(2,8)} = ${F(1,4)}</b>. <i>(1 point)</i></p>
  <p>d) Les numéros plus grands que 5 sont 6, 7 et 8 : 3 secteurs sur 8. La probabilité est <b>${F(3,8)}</b>. <i>(0,5 point)</i></p>`},
{t:"Sur l'échelle", p:2, h:`<div class="cpt"><div><p>Un sac contient 3 boules rouges et 1 boule bleue. On tire une boule au hasard.</p><p>Place la lettre de chaque événement sur l'échelle des probabilités.</p>
  <p>A : « tirer une boule rouge »</p><p>B : « tirer une boule verte »</p><p>C : « tirer une boule bleue »</p><p>D : « tirer une boule rouge ou bleue »</p></div>${sac([["rouge",3],["bleue",1]])}</div>${echelle([])}`,
 c:`${echelle([["B",0],["C",0.25],["A",0.75],["D",1]])}
  <p>B est <b>impossible</b> : il n'y a pas de boule verte. Sa probabilité est 0. <i>(0,5 point)</i></p>
  <p>C : 1 boule bleue sur 4 boules. Sa probabilité est ${F(1,4)} : c'est peu probable. <i>(0,5 point)</i></p>
  <p>A : 3 boules rouges sur 4 boules. Sa probabilité est ${F(3,4)} : c'est très probable. <i>(0,5 point)</i></p>
  <p>D est <b>certain</b> : toutes les boules sont rouges ou bleues. Sa probabilité est 1. <i>(0,5 point)</i></p>`},
{t:"Les tirages de Malo", p:2, h:`<p>Un sac contient 1 boule rouge et 3 boules blanches, identiques au toucher. Malo tire une boule au hasard, note sa couleur, puis la remet dans le sac.</p><p>Il fait 100 tirages. Il obtient 27 fois une boule rouge.</p>
  <p>a) Quelle est la fréquence de l'événement « tirer une boule rouge » ?</p><p>b) Quelle est la probabilité de tirer une boule rouge ?</p><p>c) Compare ces deux nombres. Est-ce étonnant ? Explique.</p>`,
 c:`<p>a) Fréquence : ${F(27,100)} = <b>0,27</b>. <i>(0,5 point)</i></p>
  <p>b) Il y a 1 boule rouge sur 4 boules : la probabilité est <b>${F(1,4)} = 0,25</b>. <i>(0,5 point)</i></p>
  <p>c) 0,27 et 0,25 sont <b>proches</b>, mais pas égaux. Ce n'est pas étonnant : Malo a fait beaucoup de tirages, et quand on répète une expérience un grand nombre de fois, la fréquence se rapproche de la probabilité. <i>(1 point)</i></p>`}
],
bep:{
titre:"Évaluation d'entraînement — Chapitre 18 · version aménagée", duree:25, info:"Version aménagée (tiers-temps) · Durée : 25 min · Calculatrice non autorisée",
note:"Le même sujet avec 3 questions en moins, à faire dans le même temps. Le total reste sur 10 points.",
comp:[
  ["COMMUNIQUER","J'utilise le bon vocabulaire : issue, événement, impossible, possible, certain.","Ex. 1 (3 points)"],
  ["CALCULER","Je calcule une probabilité quand les issues sont équiprobables.","Ex. 2 (3 points)"],
  ["REPRÉSENTER","Je place des événements sur l'échelle des probabilités.","Ex. 3 (2 points)"],
  ["RAISONNER","Je compare une fréquence observée et une probabilité.","Ex. 4 (2 points)"]
],
exos:[
{t:"L'urne aux neuf boules", p:3, h:`<p>Une urne contient 9 boules identiques au toucher, numérotées de 1 à 9. On tire une boule au hasard et on lit son numéro.</p>
  <p>a) Écris toutes les issues de cette expérience.</p><p>b) Quelles issues réalisent l'événement « tirer un multiple de 3 » ?</p>
  <p>c) Pour chacun de ces événements, écris s'il est impossible, possible ou certain :</p><p>« tirer un nombre plus petit que 10 » ; « tirer un nombre pair ».</p>`,
 c:`<p>a) Les issues sont : 1, 2, 3, 4, 5, 6, 7, 8 et 9. <i>(1 point)</i></p>
  <p>b) Les issues 3, 6 et 9. <i>(1 point)</i></p>
  <p>c) « Tirer un nombre plus petit que 10 » est <b>certain</b> : tous les numéros sont plus petits que 10. <i>(0,5 point)</i></p>
  <p>« Tirer un nombre pair » est <b>possible</b> : les issues 2, 4, 6 et 8 le réalisent, mais pas les autres. <i>(0,5 point)</i></p>`},
{t:"La roue de la kermesse", p:3, h:`<div class="cpt"><div><p>Cette roue est partagée en 8 secteurs de même taille, numérotés de 1 à 8. On la fait tourner et on regarde le secteur indiqué par la flèche.</p>
  <p>a) Les 8 issues sont-elles équiprobables ? Pourquoi ?</p><p>b) Quelle est la probabilité de tomber sur un secteur rouge ?</p><p>c) Quelle est la probabilité de tomber sur un numéro plus grand que 5 ?</p></div>${big(roue(R8,true),180)}</div>`,
 c:`<p>a) <b>Oui</b> : les 8 secteurs ont la même taille, ils ont donc tous la même chance d'être indiqués par la flèche. <i>(0,5 point)</i></p>
  <p>b) Les secteurs rouges sont les numéros 1, 3, 5 et 8 : 4 secteurs sur 8. La probabilité est <b>${F(4,8)} = ${F(1,2)}</b>. <i>(1,5 point)</i></p>
  <p>c) Les numéros plus grands que 5 sont 6, 7 et 8 : 3 secteurs sur 8. La probabilité est <b>${F(3,8)}</b>. <i>(1 point)</i></p>`},
{t:"Sur l'échelle", p:2, h:`<div class="cpt"><div><p>Un sac contient 3 boules rouges et 1 boule bleue. On tire une boule au hasard.</p><p>Place la lettre de chaque événement sur l'échelle des probabilités.</p>
  <p>A : « tirer une boule rouge »</p><p>B : « tirer une boule verte »</p><p>C : « tirer une boule rouge ou bleue »</p></div>${sac([["rouge",3],["bleue",1]])}</div>${echelle([])}`,
 c:`${echelle([["B",0],["A",0.75],["C",1]])}
  <p>B est <b>impossible</b> : il n'y a pas de boule verte. Sa probabilité est 0. <i>(0,5 point)</i></p>
  <p>A : 3 boules rouges sur 4 boules. Sa probabilité est ${F(3,4)} : c'est très probable. <i>(1 point)</i></p>
  <p>C est <b>certain</b> : toutes les boules sont rouges ou bleues. Sa probabilité est 1. <i>(0,5 point)</i></p>`},
{t:"Les tirages de Malo", p:2, h:`<p>Un sac contient 1 boule rouge et 3 boules blanches, identiques au toucher. Malo tire une boule au hasard, note sa couleur, puis la remet dans le sac.</p><p>Il fait 100 tirages. Il obtient 27 fois une boule rouge.</p>
  <p>a) Quelle est la fréquence de l'événement « tirer une boule rouge » ?</p><p>b) Quelle est la probabilité de tirer une boule rouge ?</p><p>c) Compare ces deux nombres. Est-ce étonnant ? Explique.</p>`,
 c:`<p>a) Fréquence : ${F(27,100)} = <b>0,27</b>. <i>(0,5 point)</i></p>
  <p>b) Il y a 1 boule rouge sur 4 boules : la probabilité est <b>${F(1,4)} = 0,25</b>. <i>(0,5 point)</i></p>
  <p>c) 0,27 et 0,25 sont <b>proches</b>, mais pas égaux. Ce n'est pas étonnant : Malo a fait beaucoup de tirages, et quand on répète une expérience un grand nombre de fois, la fréquence se rapproche de la probabilité. <i>(1 point)</i></p>`}
]}
};
})()

};
})();
