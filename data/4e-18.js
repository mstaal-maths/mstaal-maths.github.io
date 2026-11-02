/* 4e — Chapitre 18 : Probabilités — expérience aléatoire, probabilité, arbres, équiprobabilité, évènements
   (cours D2, feuille d'exercices, consignes de la semaine 6, feuille de corrections et « exercices en + » ;
   les exercices du manuel donnés dans les consignes sont repris d'après la feuille de corrections).
   Arbres et urnes dessinés en SVG. */
(function(){
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const co=(p,alt,w)=>img("4k18co/"+p,alt,w), ex=(p,alt,w)=>img("4k18ex/"+p,alt,w);
const gcd=(a,b)=>b?gcd(b,a%b):a;
const F=(a,b)=>`{${a}/${b}}`;
/* probabilité écrite comme M. Staal, puis simplifiée si possible */
const P=(a,b)=>a===0?`${F(0,b)} = 0`:a===b?`${F(a,b)} = 1`:gcd(a,b)>1?`${F(a,b)} = ${F(a/gcd(a,b),b/gcd(a,b))}`:F(a,b);
const TY=(a,b)=>{ if(a===0) return ["0","0/"+b]; if(a===b) return ["1",a+"/"+b]; const g=gcd(a,b); return g>1?[`${a/g}/${b/g}`,`${a}/${b}`]:[`${a}/${b}`]; };
const bar=t=>`<span style="text-decoration:overline">${t}</span>`;
const sum=a=>a.reduce((x,y)=>x+y,0);

/* ---------- arbre des possibles à un niveau : items [[probabilité, issue]] ---------- */
function tree1(items,o={}){
  const n=items.length, dy=o.dy||48, H=n*dy+10, W=o.w||480, x0=16, y0=H/2, x1=150;
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Arbre des possibles pondéré par les probabilités">`;
  items.forEach(([p,lab],i)=>{ const y=5+(i+.5)*dy; s+=`<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y}" class="ln"/>`;
    const m=p?/^\{(.+)\/(.+)\}$/.exec(p):null, cx=x1+22;
    if(m) s+=`<text x="${cx}" y="${y-4}" text-anchor="middle" style="font-size:15px;font-weight:700;fill:var(--c)">${m[1]}</text><line x1="${cx-13}" y1="${y+1}" x2="${cx+13}" y2="${y+1}" style="stroke:var(--c);stroke-width:1.5"/><text x="${cx}" y="${y+17}" text-anchor="middle" style="font-size:15px;font-weight:700;fill:var(--c)">${m[2]}</text>`;
    s+=`<text x="${x1+(m?46:10)}" y="${y+6}" style="font-size:15px">${lab}</text>`; });
  return s+"</svg>"; }
/* arbre à deux niveaux (sans probabilités) : A puis B */
function tree2(A,B){
  const n=A.length*B.length, dy=30, H=n*dy+16, W=520, xa=150, xb=300;
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Arbre des possibles à deux étapes">`, y0=H/2;
  A.forEach((a,i)=>{ const ya=8+(i+.5)*B.length*dy; s+=`<line x1="12" y1="${y0}" x2="${xa-8}" y2="${ya}" class="ln"/><text x="${xa}" y="${ya+5}" style="font-size:15px;font-weight:700">${a}</text>`;
    B.forEach((b,j)=>{ const yb=8+(i*B.length+j+.5)*dy; s+=`<line x1="${xa+a.length*9.5+8}" y1="${ya}" x2="${xb-8}" y2="${yb}" class="ln"/><text x="${xb}" y="${yb+5}" style="font-size:15px">${b}</text>`; }); });
  return s+"</svg>"; }
/* sac de boules : balls [[couleur, numéro]] */
const COLS={orange:"#f39c32", bleue:"#3d7cc9", rouge:"#d6453d", noire:"#333", verte:"#3aa35b", jaune:"#f2c83b"};
function sac(balls){ const r=22, gap=12, W=balls.length*(2*r+gap)+gap; let s=`<svg class="fig" viewBox="0 0 ${W} ${2*r+20}" width="${W}" role="img" aria-label="Boules dans le sac">`;
  balls.forEach(([c,n],i)=>{ const x=gap+r+i*(2*r+gap); s+=`<circle cx="${x}" cy="${r+10}" r="${r}" style="fill:${COLS[c]};stroke:#222;stroke-width:1.5"/>`+(n!==undefined?`<text x="${x}" y="${r+17}" text-anchor="middle" style="font-size:18px;font-weight:700;fill:#fff">${n}</text>`:""); });
  return s+"</svg>"; }
const ARBRE_DE=tree1([1,2,3,4,5,6].map(k=>[F(1,6),`Tomber sur ${k}`]),{w:380});

window.PR18={F,P,TY,bar,tree1,tree2,sac,gcd,sum,ex};

/* ===================== schémas ===================== */
const S_VOC=sch("Expérience aléatoire",`<p class="schN">Aléatoire : 1) on connaît toutes les issues ; 2) le résultat dépend du hasard ; 3) on peut la refaire dans les mêmes conditions.</p><p class="schN">Lancer un dé : 6 issues (1, 2, 3, 4, 5, 6).</p>`);
const S_PROBA=sch("Calculer une probabilité",`<p class="calc">p(A) = {nombre d'issues qui réalisent A/nombre total d'issues}</p><p class="schN">Dé, A : « obtenir 5 ».</p><p class="calc">p(A) = {1/6}<br>p(A) ≈ 0,17<br>p(A) ≈ 17 %</p><p class="schN">Une probabilité est comprise entre 0 et 1.</p>`);
const S_EV=sch("Évènements",`<p class="schN">« Obtenir un nombre pair » avec un dé : issues 2, 4, 6, donc p = {3/6}.</p><p class="schN">Impossible : probabilité 0 (« tomber sur 9 »). Certain : probabilité 1 (« tomber sur un nombre inférieur à 7 »).</p>`);
const S_CON=sch("Évènement contraire",`<p class="calc">p(A) + p(${bar("A")}) = 1 &nbsp; donc &nbsp; p(${bar("A")}) = 1 − p(A)</p><p class="schN">A : « nombre pair » ; ${bar("A")} : « nombre impair ». {3/6} + {3/6} = 1.</p>`);
const S_ARB=sch("Arbre des possibles",`${tree2(["Saumon","Velouté"],["Turbot","Veau","Agneau"])}<p class="schN">2 entrées et 3 plats : 2 × 3 = 6 menus possibles.</p>`);

/* ---------- données ---------- */
const SAC=[["orange",1],["orange",2],["orange",3],["orange",4],["orange",5],["bleue",1],["bleue",2],["bleue",3]];
const KENZA=[["variété française",45],["électro",38],["rap",19],["punk",37],["pop internationale",22],["jazz",12]];

/* ---------- générateurs ---------- */
const CARTES=[["une dame",4],["un as",4],["un « 8 »",4],["un cœur",8],["un carreau",8],["une carte rouge",16],["une carte noire",16],["le roi de cœur",1],["un roi rouge",2],["une figure (valet, dame ou roi)",12]];

CH["4e-18"] = {
intro:"Reconnaître une expérience aléatoire, calculer des probabilités, utiliser un arbre des possibles, et travailler avec des évènements (impossible, certain, contraire).",
savoir:[
  "reconnaître une expérience aléatoire et donner ses issues ;",
  "calculer la probabilité d'un évènement dans une situation d'équiprobabilité ;",
  "construire un arbre des possibles ;",
  "reconnaître un évènement impossible (probabilité 0) et un évènement certain (probabilité 1) ;",
  "utiliser l'évènement contraire : p(A) + p(Ā) = 1."
],

/* ===================== COURS ===================== */
cours:[
{k:"1", t:"Vocabulaire des probabilités (rappels de 5e)", h:`
  <h4>a) Expérience aléatoire et issues</h4>
  <div class="retenir" data-l="Définition"><p>Une <b>expérience</b> est dite « <b>aléatoire</b> » lorsqu'elle vérifie ces trois conditions :</p><p>– on connaît toutes les <b>issues</b> possibles ;</p><p>– le <b>résultat</b> n'est pas prévisible, il <b>dépend du hasard</b> ;</p><p>– l'expérience est <b>reproductible plusieurs fois</b> dans les mêmes conditions.</p></div>
  <p><b>Exemple :</b> « Jeter un dé non truqué à six faces et observer sur quelle face il tombe » est une expérience aléatoire car :</p><p>– on connaît les 6 issues possibles : « Tomber sur 1 », « Tomber sur 2 », « Tomber sur 3 », « Tomber sur 4 », « Tomber sur 5 » et « Tomber sur 6 » ;</p><p>– le résultat n'est pas prévisible ;</p><p>– on peut refaire plusieurs fois cette expérience.</p>
  <h4>b) Probabilité</h4>
  <div class="retenir" data-l="Définition"><p>La <b>probabilité</b> d'un évènement est <b>un nombre compris entre 0 et 1</b> qui exprime « la chance qu'a un évènement de se produire ».</p><p class="calc">Probabilité d'un évènement = {nombre de chances qu'a cet évènement de se produire/nombre total d'issues possibles}</p><p>– Elle peut s'écrire sous la forme d'une <b>fraction</b>, d'un <b>nombre décimal</b> ou d'un <b>pourcentage</b>.</p><p>– Si on note A un évènement, sa probabilité sera notée p(A).</p></div>
  <p><b>Exemple :</b> revenons à l'expérience aléatoire « Jeter un dé non truqué à six faces et observer sur quelle face il tombe ».</p><p>Soit A l'évènement « Obtenir 5 ». On a théoriquement 1 chance sur 6 de tomber sur le 5.</p><p>Donc la probabilité d'obtenir 5 est égale à {1/6}. On notera p(A) = {1/6}.</p><p>À la calculatrice :</p><p class="calc">p(A) = {1/6}<br>p(A) ≈ 0,17<br>p(A) ≈ {17/100}<br>p(A) ≈ 17 %</p><p>On aurait pu dire aussi : la probabilité d'obtenir 5 est égale à 0,17 ou à 17 %.</p>
  <h4>c) Arbres des possibles</h4>
  <div class="retenir" data-l="Définition"><p>Pour représenter une expérience, on peut utiliser <b>un arbre des possibles pondéré par les probabilités</b>.</p><p>– Chaque branche représente alors une issue.</p><p>– Sur chaque branche, on fait apparaître la probabilité de l'évènement représenté.</p></div>
  <p><b>Exemple :</b> voici l'arbre des possibles de l'expérience « jeter un dé à six faces ».</p>${ARBRE_DE}
  <h4>d) Situation d'équiprobabilité</h4>
  <div class="retenir" data-l="Définition"><p>Lorsque <b>chaque issue</b> d'une expérience aléatoire <b>a la même chance de se réaliser</b>, on dit qu'on est dans une <b>situation d'équiprobabilité</b>.</p></div>
  <p><b>Exemples :</b></p><p>– Lancer un dé à six faces non truqué est une situation d'équiprobabilité : il y a autant de chances d'obtenir 1, 2, 3, 4, 5 ou 6.</p>
  <div class="figs" style="align-items:center">${co("roue.png","Roue partagée en 5 secteurs de tailles différentes, le secteur 5 étant le plus grand",160)}<p>– Faire tourner cette roue n'est pas une situation d'équiprobabilité, car chaque issue n'a pas la même chance de se produire. En effet, on a plus de chances d'obtenir 5 que d'obtenir 1.</p></div>`},
{k:"2", t:"Évènements (nouveautés)", h:`
  <h4>a) Notion d'évènement</h4>
  <div class="retenir" data-l="Définition"><p>Un <b>évènement</b> est un ensemble d'une ou plusieurs issues que l'on peut obtenir lors d'une expérience aléatoire.</p></div>
  <p><b>Exemples :</b> revenons à l'expérience aléatoire « Jeter un dé non truqué à six faces et observer sur quelle face il tombe ».</p>
  <p>– « <b>Obtenir un nombre pair</b> » est un évènement, car il est réalisé par les 3 issues « obtenir 2 », « obtenir 4 » et « obtenir 6 ». Donc la probabilité d'obtenir un nombre pair est égale à {3/6}.</p>
  <p>– « <b>Obtenir un nombre supérieur à 4</b> » est un évènement, car il est réalisé par les 2 issues « obtenir 5 » et « obtenir 6 ». Donc la probabilité d'obtenir un nombre supérieur à 4 est égale à {2/6}.</p>
  <h4>b) Évènements particuliers</h4>
  <p><b>Évènement impossible et évènement certain</b></p>
  <div class="retenir" data-l="Définitions"><p>Un évènement qui ne peut pas se réaliser est appelé <b>évènement impossible</b>. Sa probabilité est donc égale à 0.</p><p>Un évènement dont on est sûr qu'il se réalise est appelé <b>évènement certain</b>. Sa probabilité est donc égale à 1.</p></div>
  <p><b>Exemples :</b> avec le dé à six faces,</p><p>– « Tomber sur 9 », « Tomber sur un nombre décimal », « Tomber sur une lettre » sont des évènements impossibles ;</p><p>– « Tomber sur un nombre inférieur à 7 », « Tomber sur un nombre » sont des évènements certains.</p>
  <p><b>Évènement contraire</b></p>
  <div class="retenir" data-l="Définition"><p>L'<b>évènement contraire</b> d'un évènement A est l'évènement qui se réalise lorsque A ne se réalise pas.</p><p>On le note ${bar("A")} et on lit « A barre ».</p></div>
  <p><b>Exemple :</b> avec le dé à six faces, on considère les deux évènements suivants :</p><p>A : « Tomber sur un nombre pair » ;</p><p>B : « Tomber sur un nombre impair ».</p>
  <p>Ces deux évènements sont des évènements contraires, car les issues qui réalisent l'évènement A ne réalisent pas l'évènement B, et inversement.</p><p>En effet, l'évènement A est réalisé par les 3 issues 2, 4 et 6, alors que l'évènement B est réalisé par les 3 issues 1, 3 et 5.</p><p>On pourra alors dire que B est l'évènement contraire de A. On peut noter B = ${bar("A")}.</p>
  <div class="retenir" data-l="Propriété"><p>La somme des probabilités d'un évènement A et de son évènement contraire est toujours égale à 1.</p><p class="calc">p(A) + p(${bar("A")}) = 1</p></div>
  <p><b>Exemple :</b> dans l'exemple précédent, p(A) = {3/6} et p(B) = {3/6}.</p><p class="calc">p(A) + p(B) = {3/6} + {3/6}<br>p(A) + p(B) = {6/6}<br>p(A) + p(B) = 1</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Expérience aléatoire, issues et arbres", e:[
  {n:"Exercice 1", t:"Une urne", w:"Sur ton cahier", h:`${sac([["rouge"],["rouge"],["noire"],["noire"],["noire"]])}<p>Une urne contient 2 boules rouges et 3 boules noires. On tire une boule au hasard et on regarde sa couleur.</p><p><b>1)</b> Est-ce une expérience aléatoire ? Justifie.</p><p><b>2)</b> Quelles sont les issues possibles ?</p><p><b>3)</b> Calcule la probabilité de chacune des issues.</p><p><b>4)</b> Construis l'arbre des possibles de cette expérience.</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 2", t:"Un dé truqué", w:"Sur ton cahier", h:`<p>Le dé de Léo est truqué : il tombe toujours sur le 6.</p><p>Léo lance ce dé et regarde sur quelle face il tombe.</p><p><b>1)</b> Est-ce une expérience aléatoire ? Justifie.</p><p><b>2)</b> Quelles sont les issues possibles ?</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 3", t:"Les tee-shirts de Hugo", w:"Sur ton cahier", h:`<p>Dans son armoire, Hugo a 4 tee-shirts orange, 6 tee-shirts roses, 7 tee-shirts bleus et 3 tee-shirts jaunes.</p><p>Le matin, il prend un tee-shirt au hasard.</p><p><b>1)</b> Quelles sont les issues possibles ?</p><p><b>2)</b> Quelle couleur a le plus de chances de sortir ?</p><p><b>3)</b> Quelle couleur a le moins de chances de sortir ?</p><p><b>4)</b> Calcule la probabilité de chacune des issues.</p><p><b>5)</b> Construis l'arbre des possibles de cette expérience.</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."}
 ]},
{t:"Évènements : probabilité, évènement impossible, évènement certain", e:[
  {n:"Exercice 4", t:"Le sac de boules", w:"Sur ton cahier", h:`<p>Un sac contient 8 boules indiscernables au toucher : 5 boules orange numérotées 1, 2, 3, 4, 5 et 3 boules bleues numérotées 1, 2, 3.</p>${sac(SAC)}<p>On tire une boule au hasard. Calcule la probabilité de tirer :</p><p><b>1)</b> une boule orange ;</p><p><b>2)</b> une boule bleue ;</p><p><b>3)</b> une boule numérotée « 2 » ;</p><p><b>4)</b> une boule avec un numéro impair ;</p><p><b>5)</b> une boule orange avec un numéro impair ;</p><p><b>6)</b> une boule bleue avec un 4.</p><p><b>7)</b> Donne un exemple d'évènement impossible et un exemple d'évènement certain.</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 5", t:"Un jeu de 32 cartes", w:"Sur ton cahier", h:`${ex("cartes.png","Jeu de 32 cartes : du 7 à l'as, en trèfle, pique, cœur et carreau",340)}<p>On tire une carte au hasard dans un jeu de 32 cartes.</p><p><b>1)</b> Calcule la probabilité de tirer :</p><p>a) une dame ;</p><p>b) un « 8 » ;</p><p>c) un carreau ;</p><p>d) une carte noire ;</p><p>e) le 7 de pique.</p><p><b>2)</b> Donne un exemple d'évènement impossible et un exemple d'évènement certain.</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 6", t:"Une urne de 30 boules", w:"Sur ton cahier", h:`<p>Une urne contient 30 boules numérotées de 1 à 30. On tire une boule au hasard.</p><p><b>1)</b> Combien y a-t-il d'issues possibles ?</p><p><b>2)</b> Calcule la probabilité de tirer :</p><p>a) la boule n° 7 ;</p><p>b) une boule avec un numéro pair ;</p><p>c) une boule avec un multiple de 5 ;</p><p>d) une boule avec un multiple de 7.</p><p><b>3)</b> Donne un exemple d'évènement impossible et un exemple d'évènement certain.</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."}
 ]},
{t:"Évènements contraires", e:[
  {n:"Exercice 7", t:"La playlist de Kenza", w:"Sur ton cahier", h:`<p>Kenza a chargé ses titres favoris sur son téléphone :</p>${KENZA.map(([g,n],i)=>`<p>– ${n} titres ${/^[aeiouéè]/.test(g)?"d'":"de "}${g}${i===KENZA.length-1?".":" ;"}</p>`).join("")}<p>Elle utilise la fonction « aléatoire » de son téléphone, qui choisit au hasard un titre à diffuser parmi les 173 titres. On s'intéresse au genre musical du premier titre diffusé.</p>
   <p>a) Soit J l'évènement : « Le premier titre écouté est un titre de jazz ». Calcule sa probabilité.</p><p>b) Soit A l'évènement : « Le premier titre écouté n'est pas un titre de jazz ». Calcule sa probabilité.</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 8", t:"Encore des cartes", w:"Sur ton cahier", h:`<p>Dans un jeu de 32 cartes, on tire une carte au hasard.</p><p>Donne la probabilité de chaque évènement <b>en justifiant</b>.</p><p>A : « Obtenir une carte qui n'est pas un roi rouge »</p><p>B : « Obtenir une carte qui n'est pas un 7 »</p><p>C : « Obtenir une carte rouge ou une carte noire »</p><p>D : « Obtenir un roi rouge ou un 7 »</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 9", t:"Au restaurant", w:"Sur ton cahier", h:`<p>Au restaurant, Jonathan a pris un menu constitué d'une entrée et d'un plat choisis au hasard parmi ceux proposés.</p>
   <div class="scroll"><table class="std"><thead><tr><th>Entrées</th><th>Plats</th></tr></thead><tbody><tr><td>Saumon cru mariné au poivre</td><td>Filet de turbot rôti</td></tr><tr><td>Velouté de courge à la noisette</td><td>Jarret de veau confit</td></tr><tr><td></td><td>Carré d'agneau</td></tr></tbody></table></div>
   <p>a) Quel est le nombre de menus possibles ?</p><p>b) Quelle est la probabilité que Jonathan mange du poisson en entrée et en plat ?</p><p>c) Quelle est la probabilité qu'il ne mange pas de poisson ?</p><p>d) Quelle est la probabilité qu'il mange au moins une fois du poisson ?</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."}
 ]},
{t:"Pour plus tard : fréquence et probabilité", e:[
  {n:"Exercice 10", t:"Activité : lancers de dés", w:"Sur ton cahier", h:`<p>L'expérience aléatoire est la suivante : « Lancer un dé équilibré à 6 faces et regarder quel nombre on obtient ».</p><p>Chez moi, j'ai lancé 6 fois un dé (tu peux essayer chez toi pour voir) et j'ai obtenu :</p><p class="calc">2 – 1 – 2 – 5 – 4 – 2</p>
   <p><b>1)</b> Complète les phrases suivantes :</p>${[1,2,3,4,5,6].map((k,i)=>`<p>${"abcdef"[i]}) La fréquence d'apparition du chiffre ${k} est égale à …… .</p>`).join("")}
   <p><b>2)</b> On sait pourtant que la probabilité de chaque issue est égale à {1/6}. Pourquoi les fréquences et les probabilités sont-elles différentes ?</p><p><b>3)</b> Comme le 3 et le 6 ne sont pas encore apparus, a-t-on plus de chances de tomber sur ces faces si on continue nos lancers ?</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Expérience aléatoire", schema:S_VOC, q:{
 1:[ {q:"« Lancer un dé non truqué et regarder la face obtenue » est-elle une expérience aléatoire ?", c:["Oui","Non"], rep:"Oui", ex:"On connaît les issues, le résultat dépend du hasard et on peut recommencer.", sx:S_VOC},
     {g:()=>{ const n=pick([4,6,8,10,12,20]); return {q:`Combien y a-t-il d'issues quand on lance un dé équilibré à ${n} faces (numérotées de 1 à ${n}) ?`, rep:[String(n)], ex:`Les issues sont 1, 2, …, ${n}.`, sx:S_VOC}; }} ],
 2:[ {q:"Un dé truqué tombe toujours sur 6. Lancer ce dé est-il une expérience aléatoire ?", c:["Non, le résultat est prévisible","Oui, car il y a 6 faces","Oui, car on peut recommencer"], rep:"Non, le résultat est prévisible", sx:S_VOC},
     {q:"Faire tourner une roue dont les secteurs n'ont pas tous la même taille est-il une situation d'équiprobabilité ?", c:["Non","Oui"], rep:"Non", ex:"Les issues n'ont pas toutes la même chance : un grand secteur a plus de chances.", sx:S_VOC} ],
 3:[ {q:"Laquelle de ces expériences n'est pas aléatoire ?", c:["Lire l'heure sur une horloge","Tirer une carte au hasard","Lancer une pièce de monnaie"], rep:"Lire l'heure sur une horloge", ex:"Le résultat est prévisible : il ne dépend pas du hasard.", sx:S_VOC} ]
}},
{nom:"Calculer une probabilité", schema:S_PROBA, q:{
 1:[ {g:()=>{ const r=ri(1,6), n=ri(1,6); return {q:`Une urne contient ${r} boule${r>1?"s":""} rouge${r>1?"s":""} et ${n} boule${n>1?"s":""} noire${n>1?"s":""}. Quelle est la probabilité de tirer une boule rouge ?`, rep:TY(r,r+n), ex:`Il y a ${r} boule${r>1?"s":""} rouge${r>1?"s":""} sur ${r+n} : ${P(r,r+n)}.`, sx:S_PROBA}; }} ],
 2:[ {g:()=>{ const c=[ri(1,8),ri(1,8),ri(1,8),ri(1,8)], col=["orange","roses","bleus","jaunes"], i=ri(0,3), t=sum(c); return {q:`Hugo a ${c[0]} tee-shirt${c[0]>1?"s":""} orange, ${c[1]} rose${c[1]>1?"s":""}, ${c[2]} bleu${c[2]>1?"s":""} et ${c[3]} jaune${c[3]>1?"s":""}. Il en prend un au hasard. Quelle est la probabilité qu'il soit ${col[i].replace(/s$/,"")} ?`, rep:TY(c[i],t), ex:`${c.join(" + ")} = ${t} tee-shirts. ${P(c[i],t)}.`, sx:S_PROBA}; }} ],
 3:[ {g:()=>{ const [e,n]=pick(CARTES); return {q:`On tire une carte au hasard dans un jeu de 32 cartes. Quelle est la probabilité d'obtenir ${e} ?`, rep:TY(n,32), ex:`Il y a ${n} carte${n>1?"s":""} favorable${n>1?"s":""} sur 32 : ${P(n,32)}.`, sx:S_PROBA}; }},
     {q:"Une probabilité peut-elle être égale à 1,2 ?", c:["Non, elle est toujours entre 0 et 1","Oui","Seulement pour un évènement certain"], rep:"Non, elle est toujours entre 0 et 1", sx:S_PROBA} ]
}},
{nom:"Évènements", schema:S_EV, q:{
 1:[ {g:()=>{ const [t,iss]=pick([["obtenir un nombre pair",[2,4,6]],["obtenir un nombre impair",[1,3,5]],["obtenir un nombre supérieur à 4",[5,6]],["obtenir un multiple de 3",[3,6]],["obtenir un nombre inférieur à 3",[1,2]]]); return {q:`On lance un dé à six faces. Quelle est la probabilité de l'évènement « ${t} » ?`, rep:TY(iss.length,6), ex:`Issues favorables : ${iss.join(", ")}. ${P(iss.length,6)}.`, sx:S_EV}; }} ],
 2:[ {g:()=>{ const [t,r]=pick([["Tomber sur 9","impossible"],["Tomber sur une lettre","impossible"],["Tomber sur un nombre inférieur à 7","certain"],["Tomber sur un nombre","certain"],["Tomber sur un nombre pair","ni l'un ni l'autre"],["Tomber sur 6","ni l'un ni l'autre"]]); return {q:`On lance un dé à six faces. L'évènement « ${t} » est…`, c:["impossible","certain","ni l'un ni l'autre"], rep:r, ex:r==="impossible"?"Il ne peut pas se réaliser : sa probabilité est 0.":r==="certain"?"Il se réalise toujours : sa probabilité est 1.":"Sa probabilité est comprise strictement entre 0 et 1.", sx:S_EV}; }} ],
 3:[ {g:()=>{ const N=pick([20,24,30,36,40]), k=pick([3,4,5,6,7]), m=Math.floor(N/k); return {q:`Une urne contient ${N} boules numérotées de 1 à ${N}. Quelle est la probabilité de tirer un multiple de ${k} ?`, rep:TY(m,N), ex:`Les multiples de ${k} jusqu'à ${N} sont ${Array.from({length:m},(_,i)=>(i+1)*k).join(", ")} : ${m} boules. ${P(m,N)}.`, sx:S_EV}; }},
     {q:"Quelle est la probabilité d'un évènement impossible ?", c:["0","1","{1/2}"], rep:"0", sx:S_EV} ]
}},
{nom:"Évènement contraire", schema:S_CON, q:{
 1:[ {g:()=>{ let a,b; do{ b=pick([4,5,6,8,10,12,20]); a=ri(1,b-1); }while(gcd(a,b)>1); return {q:`p(A) = ${F(a,b)}. Quelle est la probabilité de l'évènement contraire ${bar("A")} ?`, rep:TY(b-a,b), ex:`<br>p(${bar("A")}) = 1 − ${F(a,b)}<br>p(${bar("A")}) = ${F(b,b)} − ${F(a,b)}<br>p(${bar("A")}) = ${F(b-a,b)}`, sx:S_CON}; }} ],
 2:[ {g:()=>{ const p=ri(5,95); return {q:`La probabilité qu'il pleuve demain est de ${p} %. Quelle est la probabilité qu'il ne pleuve pas (en %) ?`, rep:[String(100-p), (100-p)+" %", (100-p)+"%"], ex:`100 − ${p} = ${100-p} : p(${bar("A")}) = 1 − p(A).`, sx:S_CON}; }},
     {q:"Quel est l'évènement contraire de « obtenir un nombre pair » avec un dé ?", c:["obtenir un nombre impair","obtenir 1","obtenir un nombre supérieur à 3"], rep:"obtenir un nombre impair", sx:S_CON} ],
 3:[ {g:()=>{ const [e,n]=pick(CARTES); return {q:`Dans un jeu de 32 cartes, quelle est la probabilité de ne pas obtenir ${e} ?`, rep:TY(32-n,32), ex:`Évènement contraire : obtenir ${e}, de probabilité ${F(n,32)}. Donc :<br>p = 1 − ${F(n,32)}<br>${P(32-n,32).split(" = ").map(x=>"p = "+x).join("<br>")}`, sx:S_CON}; }},
     {g:()=>{ const a=ri(2,4), b=ri(2,4); return {q:`Un menu : ${a} entrées et ${b} plats. Combien de menus (une entrée et un plat) sont possibles ?`, rep:[String(a*b)], ex:`${a} × ${b} = ${a*b} (on peut faire un arbre).`, sx:S_ARB}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 18", duree:45, info:"Durée : 45 min · Calculatrice autorisée · Les réponses doivent être justifiées",
comp:[
  ["CONNAÎTRE","Je reconnais une expérience aléatoire, ses issues et une situation d'équiprobabilité.","Ex. 1 (3 points)"],
  ["CALCULER","Je calcule des probabilités et je construis un arbre des possibles.","Ex. 2 (6 points)"],
  ["RAISONNER","J'utilise les évènements impossible, certain et contraire.","Ex. 3 (5 points)"],
  ["MODÉLISER","J'utilise un arbre pour dénombrer des issues et calculer des probabilités.","Ex. 4 (6 points)"]
],
exos:[
{t:"La roue de la loterie", p:3, h:`<p>Une roue est partagée en 8 secteurs identiques, numérotés de 1 à 8. On fait tourner la roue et on note le numéro obtenu.</p><p>a) Est-ce une expérience aléatoire ? Justifie.</p><p>b) Quelles sont les issues possibles ?</p><p>c) Est-ce une situation d'équiprobabilité ? Justifie.</p>`,
 c:`<p>a) Oui : on connaît toutes les issues, le résultat dépend du hasard et on peut recommencer dans les mêmes conditions. <i>(1 point)</i></p><p>b) 1, 2, 3, 4, 5, 6, 7 et 8. <i>(1 point)</i></p><p>c) Oui : les 8 secteurs sont identiques, donc chaque issue a la même chance de se réaliser. <i>(1 point)</i></p>`},
{t:"Le sac de jetons", p:6, h:`<p>Un sac contient 4 jetons verts, 5 jetons rouges et 3 jetons jaunes. On tire un jeton au hasard.</p><p>a) Calcule la probabilité de tirer un jeton vert.</p><p>b) Calcule la probabilité de tirer un jeton rouge.</p><p>c) Calcule la probabilité de tirer un jeton jaune.</p><p>d) Construis l'arbre des possibles pondéré par les probabilités.</p><p>e) Vérifie que la somme des probabilités est égale à 1.</p><p>f) Calcule la probabilité de ne pas tirer un jeton rouge.</p>`,
 c:`<p>4 + 5 + 3 = 12 : il y a 12 jetons dans le sac.</p><p>a) 4 jetons verts sur 12 :</p><p class="calc">p(vert) = {4/12}<br>p(vert) = {1/3}</p><p><i>(1 point)</i></p><p>b) 5 jetons rouges sur 12 : p(rouge) = {5/12} <i>(1 point)</i></p><p>c) 3 jetons jaunes sur 12 :</p><p class="calc">p(jaune) = {3/12}<br>p(jaune) = {1/4}</p><p><i>(1 point)</i></p><p>d) <i>(1,5 point)</i></p>${tree1([[F(4,12),"Jeton vert"],[F(5,12),"Jeton rouge"],[F(3,12),"Jeton jaune"]])}<p>e) La somme S des probabilités :</p><p class="calc">S = {4/12} + {5/12} + {3/12}<br>S = {12/12}<br>S = 1</p><p><i>(0,5 point)</i></p><p>f) C'est l'évènement contraire de « tirer un jeton rouge » : 1 − {5/12} = {7/12}. <i>(1 point)</i></p>`},
{t:"Le dé à 12 faces", p:5, h:`<p>On lance un dé équilibré à 12 faces, numérotées de 1 à 12. On considère les évènements :</p><p>A : « Obtenir un multiple de 3 »</p><p>B : « Obtenir un nombre pair supérieur à 7 »</p><p>C : « Obtenir 13 »</p><p>D : « Obtenir un nombre inférieur ou égal à 12 »</p><p>a) Calcule p(A), p(B), p(C) et p(D). Que peut-on dire des évènements C et D ?</p><p>b) Décris l'évènement contraire ${bar("A")} et calcule sa probabilité.</p>`,
 c:`<p>a) A : 3, 6, 9, 12, donc :</p><p class="calc">p(A) = {4/12}<br>p(A) = {1/3}</p><p><i>(1 point)</i></p><p>B : 8, 10, 12, donc :</p><p class="calc">p(B) = {3/12}<br>p(B) = {1/4}</p><p><i>(1 point)</i></p><p>C est impossible : p(C) = 0 <i>(1 point)</i> · D est certain : p(D) = 1 <i>(1 point)</i></p><p>b) ${bar("A")} : « Obtenir un nombre qui n'est pas un multiple de 3 ». </p><p class="calc">p(${bar("A")}) = 1 − {4/12}<br>p(${bar("A")}) = {8/12}<br>p(${bar("A")}) = {2/3}</p><p><i>(1 point)</i></p>`},
{t:"Le goûter", p:6, h:`<p>Pour son goûter, Inès choisit au hasard une boisson parmi un jus d'orange, un verre de lait et un chocolat chaud, et un gâteau parmi une crêpe et un cookie.</p><p>a) Construis l'arbre des possibles. Combien y a-t-il de goûters possibles ?</p><p>b) Quelle est la probabilité qu'elle prenne un chocolat chaud et une crêpe ?</p><p>c) Quelle est la probabilité qu'elle ne prenne pas de lait ?</p><p>d) Quelle est la probabilité qu'elle prenne du lait ou un cookie ?</p>`,
 c:`<p>a)</p>${tree2(["Orange","Lait","Chocolat"],["Crêpe","Cookie"])}<p>3 boissons et 2 gâteaux : 3 × 2 = 6 goûters possibles. <i>(2 points)</i></p><p>b) Un seul goûter convient : {1/6}. <i>(1 point)</i></p><p>c) Les goûters avec du lait sont lait – crêpe et lait – cookie : {2/6}. Évènement contraire :</p><p class="calc">p = 1 − {2/6}<br>p = {4/6}<br>p = {2/3}</p><p><i>(1,5 point)</i></p><p>d) Lait – crêpe, lait – cookie, orange – cookie, chocolat – cookie : {4/6} = {2/3}. <i>(1,5 point)</i></p>`}
]}
};
})();
;(function(k){var D=typeof CH!=="undefined"&&CH[k],L=[];if(D&&D.exos)D.exos.forEach(function(S){(S.e||[]).forEach(function(e){L.push(e);});});(window.LOCKS=window.LOCKS||{})[k]={D:D,e:L};})("4e-18");
