/* 3e — Chapitre 17 : Probabilités (cours D3 « Calcul de probabilités, stabilisation des fréquences et expériences à deux épreuves »
   et fiche d'exercices de M. Staal). La fiche n'a pas de corrigé : les corrections ont été écrites et vérifiées.
   Roues de loterie, diagrammes en bâtons et tableaux à double entrée dessinés en SVG / HTML à partir des valeurs exactes ;
   les courbes de fréquences des simulations (valeurs non fournies) sont les images des documents de M. Staal. */
(function(){
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const gcd=(a,b)=>b?gcd(b,a%b):a;
const rd=(x,k=4)=>Math.round(x*10**k)/10**k;
const N=(x,k=4)=>{ const v=rd(x,k); const [i,d]=String(Math.abs(v)).split("."); return (v<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const F=(a,b)=>`{${a}/${b}}`;
const irr=(a,b)=>{ if(a===0) return "0"; const g=gcd(a,b); return b/g===1?String(a/g):F(a/g,b/g); };
/* « 6/10 = 3/5 » si la fraction se simplifie */
const frs=(a,b)=>{ const r=irr(a,b); return r===F(a,b)||a===0?r:`${F(a,b)} = ${r}`; };
/* la même probabilité écrite en chaîne (une étape par ligne), précédée de son nom ; pre : un calcul à écrire avant */
const frc=(nm,a,b,pre)=>{ const r=irr(a,b), L=[]; if(pre) L.push(pre); if(!(r===F(a,b)||a===0)) L.push(F(a,b)); L.push(r); return L.map(x=>`${nm} = ${x}`).join("<br>"); };
const sum=a=>a.reduce((x,y)=>x+y,0);
const tab=(head, rows)=>`<div class="scroll"><table class="std"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const te=(r1,r2)=>`<div class="scroll"><table class="std"><tbody>${[r1,r2].map(r=>`<tr><th>${r[0]}</th>${r.slice(1).map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const T=(x,y,t,st="",a="middle")=>`<text x="${x}" y="${y}" text-anchor="${a}" style="font-size:15px;fill:var(--ink);${st}">${t}</text>`;
const COL={1:"#ffd43b",2:"#69b34c",3:"#1c8fd6",4:"#e03131",5:"#ae3ec9",6:"#f08c00",7:"#20c997",8:"#868e96"};

/* ------------------------------------------------------------------
   Roue de loterie : nums = numéros des secteurs (égaux), dans le sens des aiguilles d'une montre
   à partir du repère (en haut)
------------------------------------------------------------------ */
function roue(nums, o={}){
  const R=o.R||100, w=2*R+30, cx=w/2, cy=R+26, n=nums.length, H=2*R+42, a0=-90-180/n;
  const P=(a,r=R)=>[cx+r*Math.cos(a*Math.PI/180), cy+r*Math.sin(a*Math.PI/180)];
  let s=`<svg class="fig" viewBox="0 0 ${w} ${H}" width="${o.w||w}" role="img" aria-label="${o.alt||`Roue de loterie à ${n} secteurs égaux`}">`;
  nums.forEach((k,i)=>{ const a=a0+i*360/n, b=a+360/n, [x0,y0]=P(a), [x1,y1]=P(b);
    s+=`<path d="M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" style="fill:${COL[k]||"#ccc"};stroke:#fff;stroke-width:2"/>`;
    const [tx,ty]=P((a+b)/2,R*0.66); s+=`<circle cx="${tx.toFixed(1)}" cy="${ty.toFixed(1)}" r="13" style="fill:#fff;stroke:#1b2a44;stroke-width:1.2"/><text x="${tx.toFixed(1)}" y="${(ty+5).toFixed(1)}" text-anchor="middle" style="font-size:15px;font-weight:700;fill:#1b2a44">${k}</text>`; });
  s+=`<circle cx="${cx}" cy="${cy}" r="${R}" style="fill:none;stroke:#1b2a44;stroke-width:2"/><circle cx="${cx}" cy="${cy}" r="8" style="fill:#eee;stroke:#1b2a44;stroke-width:1.5"/>`;
  s+=`<polygon points="${cx-10},${cy-R-20} ${cx+10},${cy-R-20} ${cx},${cy-R-4}" style="fill:var(--ink)"/>`;
  return s+"</svg>";
}
/* diagramme en barres simple (effectifs) */
function barres(o){
  const {cats, vals, ylab="Effectif", w=400, H=260} = o, ystep=o.ystep||5, ymax=o.ymax||Math.ceil((Math.max(...vals)+1)/ystep)*ystep;
  const ml=50, mr=14, mt=24+(o.show?14:0), mb=40, pw=w-ml-mr, ph=H-mt-mb, n=cats.length, slot=pw/n, bw=slot*0.5, Y=v=>mt+ph-v/ymax*ph;
  let s=`<svg class="fig" viewBox="0 0 ${w} ${H}" width="${w}" role="img" aria-label="Diagramme en barres">`;
  for(let v=0; v<=ymax; v+=ystep){ const y=Y(v).toFixed(1); s+=`<line x1="${ml}" y1="${y}" x2="${ml+pw}" y2="${y}" class="gridl"/>`+T(ml-8,+y+5,N(v),"","end"); }
  vals.forEach((v,i)=>{ const x=ml+slot*i+(slot-bw)/2; s+=`<rect x="${x.toFixed(1)}" y="${Y(v).toFixed(1)}" width="${bw.toFixed(1)}" height="${(Y(0)-Y(v)).toFixed(1)}" style="fill:#bdbdbd;stroke:#1b2a44;stroke-width:1.5"/>`;
    if(o.show) s+=T((x+bw/2).toFixed(1),(Y(v)-6).toFixed(1),N(v),"fill:var(--c);font-weight:700"); s+=T((x+bw/2).toFixed(1),Y(0)+22,cats[i]); });
  s+=`<line x1="${ml}" y1="${mt-6}" x2="${ml}" y2="${Y(0)}" class="axe2"/><line x1="${ml}" y1="${Y(0)}" x2="${ml+pw}" y2="${Y(0)}" class="axe2"/>`+T(ml-4,mt-10,ylab,"font-weight:700","start");
  return s+"</svg>";
}
/* nuage de points : fréquence en fonction du nombre de lancers */
function nuage(xs, ys, o={}){
  const w=o.w||520, H=o.H||250, ml=54, mr=16, mt=22, mb=46, pw=w-ml-mr, ph=H-mt-mb, xmax=o.xmax||Math.max(...xs), ymax=o.ymax||0.3, ystep=o.ystep||0.05;
  const X=x=>ml+x/xmax*pw, Y=y=>mt+ph-y/ymax*ph;
  let s=`<svg class="fig" viewBox="0 0 ${w} ${H}" width="${w}" role="img" aria-label="${o.alt||"Évolution d'une fréquence"}">`;
  for(let k=0;k<=Math.round(ymax/ystep);k++){ const v=rd(k*ystep), y=Y(v).toFixed(1); s+=`<line x1="${ml}" y1="${y}" x2="${ml+pw}" y2="${y}" class="gridl"/>`+T(ml-8,+y+5,N(v),"","end"); }
  (o.xt||xs).forEach(x=>{ s+=T(X(x).toFixed(1),Y(0)+20,N(x),"font-size:13px"); });
  if(o.p!=null) s+=`<line x1="${ml}" y1="${Y(o.p).toFixed(1)}" x2="${ml+pw}" y2="${Y(o.p).toFixed(1)}" style="stroke:#1e8a4c;stroke-width:2;stroke-dasharray:7 5"/>`;
  xs.forEach((x,i)=>{ s+=`<rect x="${(X(x)-5).toFixed(1)}" y="${(Y(ys[i])-5).toFixed(1)}" width="10" height="10" style="fill:#1f4e79"/>`; });
  s+=`<line x1="${ml}" y1="${mt-4}" x2="${ml}" y2="${Y(0)}" class="axe2"/><line x1="${ml}" y1="${Y(0)}" x2="${ml+pw}" y2="${Y(0)}" class="axe2"/>`;
  if(o.xlab) s+=T(ml+pw/2,H-6,o.xlab,"font-weight:700");
  return s+"</svg>";
}
/* tableau à double entrée des issues d'une expérience à deux épreuves */
const sub=s=>String(s).replace(/^([A-Z])(\d)$/,"$1<sub>$2</sub>");
const issue=(a,b)=>`(${sub(a)} ; ${sub(b)})`;
const tab2=(L,C,hl)=>`<div class="scroll"><table class="std"><thead><tr><th>1<sup>re</sup> \\ 2<sup>e</sup></th>${C.map(c=>`<th>${sub(c)}</th>`).join("")}</tr></thead><tbody>${L.map(a=>`<tr><th>${sub(a)}</th>${C.map(b=>`<td>${hl&&hl(a,b)?`<b>${issue(a,b)}</b>`:issue(a,b)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const img3=(p,alt,w)=>img(p,alt,w);
window.PROB3={N, F, irr, frs, frc, gcd, sum, tab, te, roue, barres, nuage, tab2, issue, sub, rd};

/* ===================== données ===================== */
const ROUE=[4,1,2,2,3,3,3,4,4,4];
const BIL={n:[11,18,24,28,33,39,47,53,61,65,75,81,90], N:[40,80,120,160,200,240,280,320,360,400,440,480,520]};
const XL=[[4,2,9,11,7,11,6,8,2,11],[6,4,11,7,10,11,11,5,1,1],[10,6,8,4,11,6,5,2,8,3],[9,7,3,8,9,11,6,5,10,6],[3,11,1,11,4,3,2,2,9,2],[3,3,10,5,7,3,6,9,6,5],[9,9,9,7,10,1,6,3,9,3],[7,6,6,6,3,9,6,1,8,6],[11,7,1,7,8,5,10,10,8,8],[1,8,3,6,6,3,4,11,4,5]];
const XLtab=`<div class="scroll"><table class="std"><thead><tr><th></th>${"ABCDEFGHIJ".split("").map(c=>`<th>${c}</th>`).join("")}<th>K</th><th>L</th><th>M</th></tr></thead><tbody>${XL.map((r,i)=>`<tr><th>${i+1}</th>${r.map(v=>`<td>${v}</td>`).join("")}${i===0?"<td><b>Secteur</b></td><td><b>Effectif</b></td><td><b>Fréquence</b></td>":i===1?"<td>1</td><td>7</td><td>0,07</td>":"<td></td><td></td><td></td>"}</tr>`).join("")}</tbody></table></div>`;

/* ===================== schémas ===================== */
const S_VOC=sch("Calculer une probabilité", `${roue(ROUE,{R:70})}<p class="calc">P(E) = {nombre d'issues favorables/nombre total d'issues}</p><p class="schN">P(obtenir 3) = {3/10}. P(nombre pair) = {6/10}. Une probabilité est comprise entre 0 et 1.</p>`);
const S_CONT=sch("Contraire, impossible, certain", `<p class="calc">P(E) + P(contraire de E) = 1</p><p class="schN">« Obtenir 6 » sur cette roue : impossible, P = 0. « Obtenir un nombre inférieur à 7 » : certain, P = 1.</p>`);
const S_FREQ=sch("Stabilisation des fréquences", `<p class="schN">Quand on répète une expérience un très grand nombre de fois (au moins 1 000 fois), la fréquence d'une issue se stabilise autour de sa probabilité.</p><p class="calc">fréquence = {nombre d'apparitions/nombre de lancers}</p><p class="schN">Dé : 90 apparitions du 1 en 520 lancers, {90/520} ≈ 0,17 ≈ {1/6}.</p>`);
const S_DEUX=sch("Expérience à deux épreuves", `${tab2(["B","V1","V2"],["B","V1","V2"],(a,b)=>a!=="B"&&b!=="B")}<p class="schN">Deux tirages avec remise dans une urne de 3 boules : 3 × 3 = 9 issues. P(deux violettes) = {4/9}.</p>`);

CH["3e-17"] = {
intro:"Calculer une probabilité, utiliser l'événement contraire, relier fréquence et probabilité (stabilisation des fréquences) et dénombrer les issues d'une expérience à deux épreuves avec un tableau ou un arbre.",
savoir:[
  "connaître le vocabulaire : expérience aléatoire, issue, événement, événement contraire, impossible, certain ;",
  "calculer la probabilité d'un événement dans une situation d'équiprobabilité ;",
  "utiliser le fait que P(E) + P(contraire de E) = 1 ;",
  "estimer une probabilité à partir de la fréquence observée sur un grand nombre d'expériences ;",
  "dénombrer les issues d'une expérience à deux épreuves avec un tableau ou un arbre, et calculer des probabilités."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Vocabulaire des probabilités (rappels)", h:`
  <p><b>Exercice :</b> on tourne la roue de loterie équilibrée ci-dessous (cela veut dire qu'elle n'est pas truquée) et on relève le numéro du secteur qui s'arrête en face du repère.</p>${roue(ROUE,{alt:"Roue de loterie à 10 secteurs : un 1, deux 2, trois 3 et quatre 4"})}
  <div class="retenir" data-l="Définitions"><p>Cette expérience est dite <b>aléatoire</b> car le résultat n'est pas prévisible : il dépend du hasard.</p><p>Les <b>issues</b> d'une expérience sont tous les résultats possibles de cette expérience.</p><p>Un ensemble d'issues est appelé un <b>événement</b>.</p></div>
  <p>Dans l'expérience de l'exercice, les issues sont 1, 2, 3 et 4.</p><p>L'événement « Obtenir un nombre pair » est réalisé par les issues 2 et 4.</p>
  <div class="retenir" data-l="Définition"><p>La <b>probabilité</b> d'une issue ou d'un événement est un nombre compris entre 0 et 1 qui exprime « la chance qu'a un événement de se produire ».</p><p>Dans une situation où toutes les issues ont la même chance (ici, les 10 secteurs), la probabilité d'un événement E est :</p><p class="calc">P(E) = {nombre de chances qu'a l'événement E de se produire/nombre total d'issues possibles}</p><p>Elle peut s'écrire sous forme d'une fraction, d'un nombre décimal ou d'un pourcentage.</p></div>
  <p><b>Les probabilités de chaque issue :</b></p><ul><li>la probabilité de tomber sur le 1 est égale à {1/10} (0,1 ou 10 %) ;</li><li>la probabilité de tomber sur le 2 est égale à {2/10} ;</li><li>la probabilité de tomber sur le 3 est égale à {3/10} ;</li><li>la probabilité de tomber sur le 4 est égale à {4/10}.</li></ul>
  <p>« Obtenir un nombre pair », c'est obtenir un 2 ou un 4 : il y en a 6 sur les 10 secteurs. Donc la probabilité de l'événement « Obtenir un nombre pair » est égale à {6/10}.</p>
  <div class="retenir" data-l="Définition"><p>L'<b>événement contraire</b> d'un événement E est l'événement qui se réalise lorsque E n'est pas réalisé.</p></div>
  <p>L'événement contraire de « Obtenir un nombre pair » est « Obtenir un nombre impair ». C'est obtenir le 1 ou le 3 : il y en a 4 sur les 10 secteurs, donc sa probabilité est égale à {4/10}.</p>
  <div class="retenir" data-l="Remarque"><p>La somme de la probabilité d'un événement et de celle de son événement contraire est toujours égale à 1.</p><p>Dans l'exemple :</p><p class="calc">S = {4/10} + {6/10}<br>S = {10/10}<br>S = 1</p></div>
  <ul><li>La probabilité de l'événement « Obtenir 6 » est égale à 0 : c'est un <b>événement impossible</b>, il ne peut pas se produire.</li><li>La probabilité de l'événement « Obtenir un nombre inférieur à 7 » est égale à 1 : c'est un <b>événement certain</b>, il est certain de se réaliser.</li></ul>`},
{k:"II", t:"Stabilisation des fréquences", h:`
  <div class="retenir" data-l="Propriété"><p>Lorsqu'on répète plusieurs fois une expérience aléatoire, la fréquence d'une issue varie.</p><p>Mais lorsqu'on la répète un très grand nombre de fois (au moins 1 000 fois), on observe que cette fréquence tend à se stabiliser autour d'un nombre : ce nombre est la <b>probabilité</b> de cette issue.</p></div>
  <p><b>Exemple :</b> l'expérience aléatoire est « Lancer un dé équilibré et regarder le numéro sur la face ».</p><p>Nous savons que la probabilité d'obtenir le chiffre 1 est égale à {1/6} (≈ 0,17).</p>
  <p>Nous avons étudié l'évolution de la fréquence d'apparition du chiffre 1 en fonction du nombre de lancers : nous avons lancé le dé 40 fois, puis 80 fois… jusqu'à 1 000 fois.</p>
  <figure style="max-width:640px">${img3("3k17co/stab.png","Fréquence d'apparition du chiffre 1 en fonction du nombre de lancers, de 40 à 1 000",620)}<figcaption>Fréquence d'apparition du chiffre 1 (axe vertical) en fonction du nombre de lancers (axe horizontal).</figcaption></figure>
  <p>On remarque que plus le nombre de lancers est grand, plus la fréquence d'apparition du chiffre 1 se stabilise autour de <b>0,17</b>, qui est bien égal à la probabilité d'obtenir le chiffre 1.</p>`},
{k:"III", t:"Exemples d'expériences à deux épreuves", h:`
  <p>Une urne contient une boule bleue (B) et deux boules violettes numérotées 1 et 2 (V<sub>1</sub> et V<sub>2</sub>). On tire deux fois de suite et avec remise une boule de cette urne, et on note les couleurs obtenues.</p>
  <div class="retenir" data-l="Méthode"><p>Grâce à un <b>tableau</b> (ou à un <b>arbre</b>), on peut lire toutes les issues de l'expérience.</p>${tab2(["B","V1","V2"],["B","V1","V2"])}<p>Il y a 3 × 3 = <b>9 issues</b> possibles, qui ont toutes la même probabilité.</p></div>
  <ul><li>La probabilité d'obtenir deux boules violettes est égale à {4/9}, car il y a 4 issues sur 9 qui réalisent cet événement : (V<sub>1</sub> ; V<sub>1</sub>), (V<sub>1</sub> ; V<sub>2</sub>), (V<sub>2</sub> ; V<sub>1</sub>) et (V<sub>2</sub> ; V<sub>2</sub>).</li><li>La probabilité d'obtenir au moins une boule bleue est égale à {5/9}, car il y a 5 issues sur 9 qui réalisent cet événement : (B ; B), (V<sub>1</sub> ; B), (V<sub>2</sub> ; B), (B ; V<sub>1</sub>) et (B ; V<sub>2</sub>).</li></ul>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Calculer des probabilités", e:[
  {n:"Activité 1", t:"Rappels de 4e : la roue de loterie", w:"Sur ton cahier", h:`<p>On tourne la roue de loterie équilibrée ci-dessous et on relève le numéro du secteur qui s'arrête en face du repère. (Relis d'abord la partie I du cours.)</p>${roue(ROUE)}
   <p><b>1)</b> Complète : la probabilité de tomber sur le 1 est égale à ……… ; sur le 2 : ……… ; sur le 3 : ……… ; sur le 4 : ………</p><p><b>2)</b> Calcule la probabilité de l'événement « Obtenir un nombre pair ».</p><p><b>3)</b> Quel est l'événement contraire de l'événement « Obtenir un nombre pair » ? Quelle est sa probabilité ?</p><p><b>4) a)</b> La probabilité de l'événement « Obtenir 6 » est égale à ………</p><p><b>b)</b> La probabilité de l'événement « Obtenir un nombre inférieur à 7 » est égale à ………</p>`,
   c:`<p><b>1)</b> P(1) = {1/10} ; P(2) = {2/10} ; P(3) = {3/10} ; P(4) = {4/10}.</p><p><b>2)</b> Les secteurs 2 et 4 : 2 + 4 = 6 secteurs sur 10, donc :</p><p class="calc">P(nombre pair) = {6/10}<br>P(nombre pair) = {3/5}</p><p><b>3)</b> C'est « Obtenir un nombre impair » (le 1 ou le 3) : 1 + 3 = 4 secteurs, donc :</p><p class="calc">P(nombre impair) = {4/10}<br>P(nombre impair) = {2/5}</p><p>On vérifie : {6/10} + {4/10} = 1.</p><p><b>4) a)</b> <b>0</b> (événement impossible). <b>b)</b> <b>1</b> (événement certain).</p>`},
  {n:"Exercice 1", t:"Urne", w:"Sur ton cahier", h:`<p>Une urne contient vingt boules numérotées de 1 à 20. On tire une boule au hasard et on note son numéro.</p><p>On considère les événements A « Obtenir un numéro plus grand que 15 » et B « Obtenir un multiple de 6 ».</p><p><b>1) a)</b> Calcule la probabilité de l'événement A.</p><p><b>b)</b> Calcule la probabilité de l'événement B.</p><p><b>2) a)</b> Détermine la probabilité que les événements A et B se réalisent tous les deux.</p><p><b>b)</b> Détermine la probabilité que l'un au moins des deux événements se réalise.</p>`,
   c:`<p><b>1) a)</b> A est réalisé par 16, 17, 18, 19 et 20 :</p><p class="calc">P(A) = {5/20}<br>P(A) = <b>{1/4}</b></p><p><b>b)</b> B est réalisé par 6, 12 et 18 : P(B) = <b>{3/20}</b>.</p><p><b>2) a)</b> Seul 18 réalise A et B : la probabilité est <b>{1/20}</b>.</p><p><b>b)</b> 6, 12, 16, 17, 18, 19 et 20 : 7 issues, la probabilité est <b>{7/20}</b>.</p>`},
  {n:"Exercice 2", t:"Les jetons (brevet Polynésie, juin 2015)", w:"Sur ton cahier", h:`<p>Djamel et Sarah ont un jeu de société : pour y jouer, il faut tirer au hasard des jetons dans un sac. Tous les jetons ont la même probabilité d'être tirés. Sur chaque jeton, un nombre entier est inscrit.</p><p>Il reste dans le sac les huit jetons suivants :</p><p class="calc">5 &nbsp; 14 &nbsp; 26 &nbsp; 18 &nbsp; 5 &nbsp; 9 &nbsp; 18 &nbsp; 20</p><p>C'est à Sarah de jouer.</p><p><b>1) a)</b> Quelle est la probabilité qu'elle tire un jeton « 18 » ?</p><p><b>b)</b> Quelle est la probabilité qu'elle tire un jeton multiple de 5 ?</p><p><b>2)</b> Finalement, Sarah a tiré le jeton « 26 », qu'elle garde. C'est au tour de Djamel. La probabilité qu'il tire un jeton « 18 » est-elle la même que celle trouvée à la question 1 a) ?</p>`,
   c:`<p><b>1) a)</b> 2 jetons « 18 » sur 8 : {2/8} = <b>{1/4}</b>.</p><p><b>b)</b> Les multiples de 5 sont 5, 5 et 20 : <b>{3/8}</b>.</p><p><b>2)</b> Il reste 7 jetons, dont deux « 18 » : la probabilité est {2/7}. Or {2/7} ≠ {1/4} ({2/7} ≈ 0,29 et {1/4} = 0,25) : <b>ce n'est pas la même</b>.</p>`},
  {n:"Exercice 3", t:"Boules vertes et bleues (brevet, juin 2017)", w:"Sur ton cahier", h:`<p>Dans une urne contenant des boules vertes et des boules bleues, on tire au hasard une boule et on regarde sa couleur. On replace ensuite la boule dans l'urne et on mélange les boules.</p><p>La probabilité d'obtenir une boule verte est {2/5}.</p><p><b>1)</b> Explique pourquoi la probabilité d'obtenir une boule bleue est égale à {3/5}.</p><p><b>2)</b> Paul a effectué 6 tirages et a obtenu une boule verte à chaque fois. Au 7<sup>e</sup> tirage, aura-t-il plus de chances d'obtenir une boule bleue qu'une boule verte ?</p><p><b>3)</b> Détermine le nombre de boules bleues dans cette urne, sachant qu'il y a 8 boules vertes.</p>`,
   c:`<p><b>1)</b> Les boules sont vertes ou bleues : « Obtenir une boule bleue » est l'événement contraire de « Obtenir une boule verte ». Donc :</p><p class="calc">P(bleue) = 1 − {2/5}<br>P(bleue) = <b>{3/5}</b></p><p><b>2)</b> Oui : on remet la boule à chaque fois, donc la composition de l'urne ne change pas. Au 7<sup>e</sup> tirage, P(bleue) = {3/5} reste plus grande que P(verte) = {2/5}. Les tirages précédents n'ont pas d'influence.</p><p><b>3)</b> Les 8 boules vertes représentent les {2/5} des boules : 8 ÷ 2 × 5 = 20 boules en tout. Il y a donc 20 − 8 = <b>12 boules bleues</b>.</p>`},
  {n:"Exercice 4", t:"Douze boules (brevet Amérique du Nord, juin 2017)", w:"Sur ton cahier", h:`<p>Il y a dans une urne 12 boules indiscernables au toucher, numérotées de 1 à 12. On veut tirer une boule au hasard.</p><p><b>1)</b> Est-il plus probable d'obtenir un numéro pair ou bien un multiple de 3 ?</p><p><b>2)</b> Quelle est la probabilité d'obtenir un numéro inférieur à 20 ?</p><p><b>3)</b> On enlève de l'urne toutes les boules dont le numéro est un diviseur de 6. On veut à nouveau tirer une boule au hasard. Explique pourquoi la probabilité d'obtenir un numéro qui soit un nombre premier est alors 0,375.</p>`,
   c:`<p><b>1)</b> Numéros pairs : 2, 4, 6, 8, 10, 12.</p><p class="calc">P(pair) = {6/12}<br>P(pair) = {1/2}</p><p>Multiples de 3 : 3, 6, 9, 12.</p><p class="calc">P(multiple de 3) = {4/12}<br>P(multiple de 3) = {1/3}</p><p>{1/2} &gt; {1/3} : il est <b>plus probable d'obtenir un numéro pair</b>.</p><p><b>2)</b> Tous les numéros sont inférieurs à 20 : la probabilité est <b>1</b> (événement certain).</p><p><b>3)</b> Les diviseurs de 6 sont 1, 2, 3 et 6. Il reste 8 boules : 4, 5, 7, 8, 9, 10, 11, 12. Parmi elles, les nombres premiers sont 5, 7 et 11. La probabilité p est :</p><p class="calc">p = {3/8}<br>p = 3 ÷ 8<br>p = <b>0,375</b></p>`}
 ]},
{t:"Fréquences et probabilités", e:[
  {n:"Activité 2", t:"Lancers de dés", w:"Sur ton cahier", h:`<p>L'expérience aléatoire est la suivante : « Lancer un dé équilibré à 6 faces et regarder quel nombre on obtient. »</p><p><b>1)</b> Complète : la probabilité d'obtenir le chiffre 1 est égale à ……, le chiffre 2 à ……, le chiffre 3 à ……, le chiffre 4 à ……, le chiffre 5 à …… et le chiffre 6 à ……</p><p><b>2)</b> Sur le tableur, on simule un grand nombre de lancers de dés. Note la fréquence d'apparition de chaque chiffre. Que remarques-tu ?</p>`,
   c:`<p><b>1)</b> Le dé est équilibré : chaque chiffre a la même probabilité, <b>{1/6}</b> (≈ 0,17).</p><p><b>2)</b> Voici les résultats obtenus en classe pour le chiffre 1 :</p>${te(["Nombre de lancers",...BIL.N.map(String)],["Apparitions du 1",...BIL.n.map(String)])}${te(["Nombre de lancers",...BIL.N.map(String)],["Fréquence du 1",...BIL.n.map((k,i)=>N(rd(k/BIL.N[i],2)))])}
   ${nuage(BIL.N, BIL.n.map((k,i)=>k/BIL.N[i]), {xmax:560, xt:[40,120,200,280,360,440,520], ymax:0.3, ystep:0.05, p:1/6, xlab:"Nombre de lancers", alt:"Fréquence du chiffre 1 et droite de la probabilité 1/6"})}
   <p>Plus le nombre de lancers augmente, plus la fréquence de chaque chiffre se rapproche de {1/6} ≈ 0,17 (en pointillés verts) : c'est la <b>stabilisation des fréquences</b>.</p>`},
  {n:"Exercice 5", t:"Lancer de punaise", w:"Sur ton cahier", h:`<p>Lorsqu'on lance une punaise au sol, elle peut se positionner de deux façons : sur le côté (position 1) ou sur la tête (position 2).</p>${img3("3k17ex/punaise.png","Position 1 : punaise sur le côté. Position 2 : punaise sur la tête.",240)}
   <p>Voici l'évolution de la fréquence d'apparition de la position 1 lors de 900 lancers d'une punaise :</p><figure style="max-width:640px">${img3("3k17ex/punaise-freq.png","Fréquence de la position 1 en fonction du nombre de lancers",620)}<figcaption>Fréquence de la position 1 (axe vertical) en fonction du nombre de lancers (axe horizontal).</figcaption></figure><p>Grâce à cette expérience, détermine la probabilité de chaque issue.</p>`,
   c:`<p>Après un grand nombre de lancers, la fréquence de la position 1 se stabilise autour de <b>0,4</b>.</p><p>On estime donc : P(position 1) ≈ <b>0,4</b> et, par l'événement contraire :</p><p class="calc">P(position 2) ≈ 1 − 0,4<br>P(position 2) ≈ <b>0,6</b></p>`},
  {n:"Exercice 6", t:"Pièce de monnaie truquée", w:"Sur ton cahier", h:`<p><b>Pièce n° 1 :</b> on lance 1 000 fois la pièce de monnaie n° 1. On obtient les fréquences suivantes : Pile : 0,4949 ; Face : 0,5051.</p><p><b>Pièce n° 2 :</b> voici l'évolution de la fréquence de Pile lors de 1 000 lancers de la pièce n° 2 :</p>${img3("3k17ex/piece2.png","Fréquence de Pile de la pièce 2 en fonction du nombre de lancers, de 50 à 1 000",460)}<p>Quelle est la pièce de monnaie truquée ? Explique.</p>`,
   c:`<p>Pour une pièce équilibrée, P(Pile) = P(Face) = {1/2} = 0,5.</p><p><b>Pièce n° 1 :</b> sur 1 000 lancers, les fréquences (0,4949 et 0,5051) sont très proches de 0,5 : elle semble équilibrée.</p><p><b>Pièce n° 2 :</b> sur 1 000 lancers, la fréquence de Pile est d'environ 0,12, très loin de 0,5.</p><p>C'est donc la <b>pièce n° 2</b> qui est truquée.</p>`},
  {n:"Exercice 7", t:"Composition d'un sac (brevet)", w:"Sur ton cahier", h:`<p>Un sac contient 20 jetons qui sont soit jaunes, soit verts, soit rouges, soit bleus. On tire au hasard un jeton, on note sa couleur et on le remet dans le sac.</p><p>Louis ne connaît pas la composition du sac et souhaite la découvrir. Il a simulé un grand nombre de fois l'expérience avec un tableur. Il a représenté ci-dessous l'évolution de la fréquence d'apparition des différentes couleurs au cours de 1 000 tirages.</p>${img3("3k17ex/sac.png","Fréquences des couleurs jaune, vert, rouge et bleu au cours de 1 000 tirages",440)}<p><b>1)</b> Estime la probabilité de chacune des issues de l'expérience.</p><p><b>2)</b> Propose alors une composition du sac.</p>`,
   c:`<p><b>1)</b> Les fréquences se stabilisent : jaune ≈ <b>0,5</b> ; vert ≈ <b>0,25</b> ; rouge ≈ <b>0,2</b> ; bleu ≈ <b>0,05</b>. (On vérifie : 0,5 + 0,25 + 0,2 + 0,05 = 1.)</p><p><b>2)</b> Il y a 20 jetons : 0,5 × 20 = <b>10 jaunes</b> ; 0,25 × 20 = <b>5 verts</b> ; 0,2 × 20 = <b>4 rouges</b> ; 0,05 × 20 = <b>1 bleu</b> (10 + 5 + 4 + 1 = 20).</p>`},
  {n:"Exercice 8", t:"Probabilité et tableur", w:"Sur ton cahier", h:`<p>Une roue de loterie équilibrée est divisée en 11 secteurs identiques numérotés de 1 à 11. Avec le tableur, on simule 100 fois l'expérience qui consiste à faire tourner la roue et à noter le nombre repéré. Voici la feuille de calcul :</p>${XLtab}
   <p><b>1)</b> Quelle formule a été saisie en A1 : <b>=ALEA.ENTRE.BORNES(1;6)</b> ou <b>=ALEA.ENTRE.BORNES(1;11)</b> ?</p><p><b>2)</b> Quelle formule a été saisie en L2 : <b>=NB.SI(A1:J10;1)</b> ou <b>=NB.SI(A1:J1;1)</b> ?</p><p><b>3)</b> Quelle formule a-t-on saisie en M2 ?</p>`,
   c:`<p><b>1)</b> <b>=ALEA.ENTRE.BORNES(1;11)</b> : la roue a 11 secteurs, numérotés de 1 à 11.</p><p><b>2)</b> <b>=NB.SI(A1:J10;1)</b> : on compte les « 1 » dans toutes les cellules de A1 à J10 (les 100 simulations). On en trouve bien 7.</p><p><b>3)</b> <b>=L2/100</b> : la fréquence est l'effectif divisé par le nombre de simulations ({7/100} = 0,07).</p>`},
  {n:"Exercice en +", t:"Lancer d'un dé coloré (brevet)", w:"Sur ton cahier", h:`<p>Un dé cubique équilibré a 6 faces peintes : une en bleu, une en rouge, une en jaune, une en vert et deux en noir.</p><p>On jette ce dé cent fois et on note à chaque fois la couleur de la face obtenue. Le diagramme ci-dessous donne la répartition des couleurs obtenues lors de ces cent lancers.</p>${barres({cats:["bleu","rouge","jaune","vert","noir"], vals:[15,16,20,19,30], ymax:35, ystep:5, w:380, H:270})}
   <p><b>1) a)</b> Détermine la fréquence d'apparition de la couleur jaune.</p><p><b>b)</b> Détermine la fréquence d'apparition de la couleur noire.</p><p><b>2) a)</b> Quelle est la probabilité d'obtenir la couleur jaune ?</p><p><b>b)</b> Quelle est la probabilité d'obtenir la couleur noire ?</p><p><b>3)</b> Explique l'écart entre les fréquences obtenues à la question 1 et les probabilités trouvées à la question 2.</p>`,
   c:`<p><b>1) a)</b> {20/100} = <b>0,2</b>. <b>b)</b> {30/100} = <b>0,3</b>.</p><p><b>2) a)</b> 1 face jaune sur 6 : <b>{1/6}</b> (≈ 0,17). <b>b)</b> 2 faces noires sur 6 : {2/6} = <b>{1/3}</b> (≈ 0,33).</p><p><b>3)</b> 100 lancers, ce n'est pas assez : les fréquences varient d'une série de lancers à l'autre. C'est en répétant l'expérience un très grand nombre de fois que les fréquences se rapprochent des probabilités.</p>`}
 ]},
{t:"Expériences à deux épreuves", e:[
  {n:"Activité 3", t:"Expérience à deux épreuves", w:"Sur ton cahier", h:`<p>Une urne contient une boule bleue et deux boules violettes numérotées 1 et 2. On tire deux fois de suite et avec remise une boule de cette urne, et on note les couleurs obtenues.</p><p>Quelle est la probabilité de tirer successivement deux boules violettes ?</p><p>Pour t'aider, recopie et complète ce tableau, qui permet de dénombrer toutes les issues possibles :</p><div class="scroll"><table class="std"><thead><tr><th>1<sup>re</sup> \\ 2<sup>e</sup></th><th>B</th><th>V<sub>1</sub></th><th>V<sub>2</sub></th></tr></thead><tbody><tr><th>B</th><td>(B ; B)</td><td></td><td></td></tr><tr><th>V<sub>1</sub></th><td>(V<sub>1</sub> ; B)</td><td></td><td></td></tr><tr><th>V<sub>2</sub></th><td></td><td></td><td></td></tr></tbody></table></div>`,
   c:`${tab2(["B","V1","V2"],["B","V1","V2"],(a,b)=>a!=="B"&&b!=="B")}<p>Il y a 9 issues. 4 d'entre elles (en gras) donnent deux boules violettes : la probabilité est <b>{4/9}</b>.</p>`},
  {n:"Exercice 9", t:"Expérience à deux épreuves : les jetons", w:"Sur ton cahier", h:`<p>Un sac contient trois jetons de forme identique. Chacun porte une lettre : A, B ou C. On tire successivement et avec remise 2 jetons du sac et on note les lettres obtenues.</p><p><b>1)</b> Construis un tableau ou un arbre pour faire apparaître toutes les issues de l'expérience.</p><p><b>2)</b> Détermine la probabilité d'obtenir les lettres A et B.</p><p><b>3)</b> Détermine la probabilité d'obtenir au moins une fois la lettre A.</p>`,
   c:`<p><b>1)</b></p>${tab2(["A","B","C"],["A","B","C"])}<p>Il y a 3 × 3 = 9 issues.</p><p><b>2)</b> (A ; B) et (B ; A) : la probabilité est <b>{2/9}</b>.</p><p><b>3)</b> (A ; A), (A ; B), (A ; C), (B ; A) et (C ; A) : la probabilité est <b>{5/9}</b>.</p>`},
  {n:"Exercice 10", t:"Expérience à deux épreuves : deux enfants", w:"Sur ton cahier", h:`<p>Un couple souhaite avoir deux enfants. On suppose que, pour chaque enfant, la probabilité d'avoir une fille (F) ou un garçon (G) est la même.</p><p><b>1)</b> Construis un tableau ou un arbre pour faire apparaître toutes les issues de l'expérience.</p><p><b>2)</b> Détermine la probabilité d'avoir deux garçons.</p><p><b>3)</b> Détermine la probabilité d'avoir au moins une fille.</p>`,
   c:`<p><b>1)</b></p>${tab2(["F","G"],["F","G"])}<p>Il y a 2 × 2 = 4 issues.</p><p><b>2)</b> Seule l'issue (G ; G) convient : <b>{1/4}</b>.</p><p><b>3)</b> C'est l'événement contraire de « deux garçons » : 1 − {1/4} = <b>{3/4}</b> (issues (F ; F), (F ; G) et (G ; F)).</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Calculer une probabilité", schema:S_VOC, q:{
 1:[ {g:()=>{ const nums=Array.from({length:10},()=>ri(1,4)); const k=pick([...new Set(nums)]), c=nums.filter(x=>x===k).length, n=nums.length; return {q:`On tourne cette roue équilibrée. Quelle est la probabilité d'obtenir ${k} ?`, fig:roue(nums,{R:80}), c:uniq(F(c,n),[F(1,n),F(n-c,n),F(1,4),F(c+1,n)]).slice(0,4), rep:F(c,n), ex:`${c} secteur${c>1?"s":""} sur ${n} ${c>1?"portent":"porte"} le ${k} : ${frs(c,n)}.`, sx:S_VOC}; }} ],
 2:[ {g:()=>{ const n=pick([10,12,15,20,25,30]), m=pick([2,3,4,5]), k=Math.floor(n/m); return {q:`Une urne contient ${n} boules numérotées de 1 à ${n}. On en tire une au hasard. Quelle est la probabilité d'obtenir un multiple de ${m} ?`, c:shuf(uniq(irr(k,n),[irr(k+1,n),F(1,m+1),irr(n-k,n)])), rep:irr(k,n), ex:`Les multiples de ${m} : ${Array.from({length:k},(_,i)=>(i+1)*m).join(", ")}, soit ${k} boules sur ${n} : ${frs(k,n)}.`, sx:S_VOC}; }} ],
 3:[ {g:()=>{ let J; do{ J=Array.from({length:8},()=>pick([5,9,10,14,15,18,20,26])); }while(new Set(J).size<4); const v=pick(J), c=J.filter(x=>x===v).length; return {q:`Un sac contient les jetons ${J.join(" ; ")}. On en tire un, que l'on garde. Puis on tire un deuxième jeton. Sachant que le premier jeton tiré était un ${J.find(x=>x!==v)}, quelle est la probabilité que le deuxième soit un ${v} ?`, c:shuf(uniq(irr(c,7),[irr(c,8),irr(c-1>0?c-1:c+1,7),F(1,7)])), rep:irr(c,7), ex:`Il reste 7 jetons, dont ${c} jeton${c>1?"s":""} « ${v} » : ${frs(c,7)}.`, sx:S_VOC}; }} ]
}},
{nom:"Événement contraire, impossible, certain", schema:S_CONT, q:{
 1:[ {g:()=>{ const b=pick([5,8,10,12,20]), a=ri(1,b-1); return {q:`La probabilité d'un événement E est ${F(a,b)}. Quelle est la probabilité de l'événement contraire de E ?`, c:shuf(uniq(F(b-a,b),[F(a,b),F(1,b),F(b,a)])), rep:F(b-a,b), ex:`1 − ${F(a,b)} = ${F(b-a,b)}.`, sx:S_CONT}; }} ],
 2:[ {g:()=>{ const s=pick([["Obtenir 7 avec un dé à 6 faces","impossible"],["Obtenir un nombre inférieur à 7 avec un dé à 6 faces","certain"],["Obtenir un nombre pair avec un dé à 6 faces","ni l'un ni l'autre"],["Tirer une boule rouge dans une urne qui ne contient que des boules bleues","impossible"],["Tirer un numéro inférieur à 20 dans une urne de boules numérotées de 1 à 12","certain"]]); return {q:`L'événement « ${s[0]} » est…`, c:["impossible","certain","ni l'un ni l'autre"], rep:s[1], ex:s[1]==="impossible"?"Sa probabilité est 0 : il ne peut pas se produire.":s[1]==="certain"?"Sa probabilité est 1 : il se réalise toujours.":"Sa probabilité est comprise strictement entre 0 et 1 ({3/6} = {1/2}).", sx:S_CONT}; }} ],
 3:[ {g:()=>{ const v=pick([4,6,8,10,12]); let a,b; do{ b=pick([3,4,5,7,8]); a=ri(1,b-1); }while(gcd(a,b)>1 || (v*b)%a); const tot=v*b/a; return {q:`Dans une urne, il n'y a que des boules vertes et bleues. P(verte) = ${F(a,b)} et il y a ${v} boules vertes. Combien y a-t-il de boules bleues ?`, rep:[String(tot-v)], ex:`Les ${v} vertes représentent ${F(a,b)} des boules : ${v} ÷ ${a} × ${b} = ${tot} boules en tout, donc ${tot} − ${v} = ${tot-v} bleue${tot-v>1?"s":""}.`, sx:S_CONT}; }} ]
}},
{nom:"Stabilisation des fréquences", schema:S_FREQ, q:{
 1:[ {q:"Quand on répète une expérience aléatoire un très grand nombre de fois, la fréquence d'une issue…", c:["se rapproche de sa probabilité","est toujours égale à sa probabilité","devient égale à 1"], rep:"se rapproche de sa probabilité", ex:"Elle se stabilise autour de la probabilité, sans forcément lui être égale.", sx:S_FREQ} ],
 2:[ {g:()=>{ const N0=pick([100,200,400,500,1000]), k=ri(Math.round(N0*0.12),Math.round(N0*0.22)); return {q:`On lance un dé ${N(N0)} fois et on obtient ${k} fois le chiffre 1. Quelle est la fréquence d'apparition du 1 ?`, rep:[N(k/N0)], ex:`{${k}/${N(N0)}} = ${N(k/N0)}. C'est proche de la probabilité {1/6} ≈ 0,17.`, sx:S_FREQ}; }} ],
 3:[ {g:()=>{ const f=pick([0.3,0.35,0.4,0.45,0.6,0.65,0.7]); return {q:`Sur 1 000 lancers d'une punaise, la fréquence de la position « sur le côté » se stabilise autour de ${N(f)}. Quelle est la probabilité estimée de la position « sur la tête » ?`, rep:[N(rd(1-f,2)), rd(1-f,2).toFixed(2).replace(".",",")], ex:`Il n'y a que deux positions : 1 − ${N(f)} = ${N(rd(1-f,2))}.`, sx:S_FREQ}; }},
     {g:()=>{ const t=Math.random()<0.5, f=t?pick([0.12,0.25,0.31,0.68,0.8]):pick([0.494,0.503,0.497,0.508]); return {q:`On lance une pièce 1 000 fois. La fréquence de Pile est ${N(f)}. La pièce semble-t-elle truquée ?`, c:["Oui","Non"], rep:t?"Oui":"Non", ex:t?`${N(f)} est loin de 0,5 sur un grand nombre de lancers.`:`${N(f)} est très proche de 0,5.`, sx:S_FREQ}; }} ]
}},
{nom:"Expériences à deux épreuves", schema:S_DEUX, q:{
 1:[ {g:()=>{ const n=pick([2,3,4,5]); return {q:`Un sac contient ${n} jetons différents. On tire deux jetons successivement, avec remise. Combien y a-t-il d'issues ?`, c:uniq(String(n*n),[String(2*n),String(n),String(n*n-1)]), rep:String(n*n), ex:`${n} possibilités pour le 1<sup>er</sup> tirage et ${n} pour le 2<sup>e</sup> : ${n} × ${n} = ${n*n} issues.`, sx:S_DEUX}; }} ],
 2:[ {g:()=>{ const L=pick([["A","B","C"],["A","B","C","D"]]), n=L.length, a=pick(L); return {q:`Un sac contient ${n} jetons ${L.join(", ")}. On tire deux jetons avec remise. Quelle est la probabilité d'obtenir deux fois ${a} ?`, c:shuf(uniq(F(1,n*n),[F(1,n),F(2,n*n),F(1,n*n-1)])), rep:F(1,n*n), ex:`Une seule issue (${a} ; ${a}) sur ${n*n}.`, sx:S_DEUX}; }} ],
 3:[ {g:()=>{ const L=pick([["A","B","C"],["A","B","C","D"]]), n=L.length, a=pick(L), k=2*n-1; return {q:`Un sac contient ${n} jetons ${L.join(", ")}. On tire deux jetons avec remise. Quelle est la probabilité d'obtenir au moins une fois la lettre ${a} ?`, c:shuf(uniq(F(k,n*n),[F(2,n*n),F(n,n*n),F(2*n,n*n)])), rep:F(k,n*n), ex:`Issues avec ${a} : ${n} en 1<sup>er</sup> + ${n} en 2<sup>e</sup> − 1 (l'issue (${a} ; ${a}) comptée deux fois) = ${k} sur ${n*n}.`, sx:S_DEUX}; }},
     {q:"Un couple a deux enfants (fille ou garçon, avec la même probabilité). Quelle est la probabilité d'avoir au moins une fille ?", c:[F(3,4),F(1,2),F(1,4),F(2,3)], rep:F(3,4), ex:"Issues : (F ; F), (F ; G), (G ; F), (G ; G). 3 issues sur 4 contiennent une fille.", sx:S_DEUX} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 17", duree:45, info:"Durée : 45 min · Calculatrice autorisée · Justifie chaque réponse.",
comp:[
  ["CONNAÎTRE","Je connais le vocabulaire : issue, événement, contraire, impossible, certain.","Ex. 1 (5 points)"],
  ["CALCULER","Je calcule la probabilité d'un événement.","Ex. 2 et 5 (7 points)"],
  ["RAISONNER","Je relie fréquence et probabilité.","Ex. 3 (4 points)"],
  ["MODÉLISER","Je dénombre les issues d'une expérience à deux épreuves.","Ex. 4 (4 points)"]
],
exos:[
{t:"La roue de loterie", p:5, h:`<p>On tourne cette roue équilibrée, partagée en 8 secteurs identiques, et on note le numéro obtenu.</p>${roue([1,2,1,3,4,1,3,2],{R:90,alt:"Roue à 8 secteurs : trois 1, deux 2, deux 3 et un 4"})}<p><b>a)</b> Quelle est la probabilité d'obtenir 1 ?</p><p><b>b)</b> Quelle est la probabilité de l'événement « Obtenir un nombre pair » ?</p><p><b>c)</b> Quel est l'événement contraire de « Obtenir un nombre pair » ? Quelle est sa probabilité ?</p><p><b>d)</b> Quelle est la probabilité d'obtenir 5 ? Comment appelle-t-on cet événement ?</p><p><b>e)</b> Quelle est la probabilité d'obtenir un nombre inférieur à 5 ? Comment appelle-t-on cet événement ?</p>`,
 c:`<p><b>a)</b> 3 secteurs sur 8 : <b>{3/8}</b>. <i>(1 point)</i></p><p><b>b)</b> Les secteurs 2 et 4 : 2 + 1 = 3, donc <b>{3/8}</b>. <i>(1 point)</i></p><p><b>c)</b> « Obtenir un nombre impair », de probabilité 1 − {3/8} = <b>{5/8}</b>. <i>(1,5 point)</i></p><p><b>d)</b> <b>0</b> : c'est un événement impossible. <i>(0,5 point)</i></p><p><b>e)</b> <b>1</b> : c'est un événement certain. <i>(1 point)</i></p>`},
{t:"Trente boules", p:4, h:`<p>Une urne contient 30 boules numérotées de 1 à 30. On en tire une au hasard.</p><p>A est l'événement « Obtenir un multiple de 5 » et B l'événement « Obtenir un numéro supérieur ou égal à 25 ».</p><p><b>a)</b> Calcule P(A).</p><p><b>b)</b> Calcule P(B).</p><p><b>c)</b> Quelle est la probabilité que A et B se réalisent tous les deux ?</p><p><b>d)</b> Quelle est la probabilité que l'un au moins des deux événements se réalise ?</p>`,
 c:`<p><b>a)</b> 5, 10, 15, 20, 25, 30 :</p><p class="calc">P(A) = {6/30}<br>P(A) = <b>{1/5}</b></p><p><i>(1 point)</i></p><p><b>b)</b> 25, 26, 27, 28, 29, 30 :</p><p class="calc">P(B) = {6/30}<br>P(B) = <b>{1/5}</b></p><p><i>(1 point)</i></p><p><b>c)</b> 25 et 30 : {2/30} = <b>{1/15}</b>. <i>(1 point)</i></p><p><b>d)</b> 5, 10, 15, 20, 25, 26, 27, 28, 29, 30 : {10/30} = <b>{1/3}</b>. <i>(1 point)</i></p>`},
{t:"Un dé est-il truqué ?", p:4, h:`<p>Inès lance 200 fois un dé à 6 faces. Voici ses résultats :</p>${te(["Face","1","2","3","4","5","6"],["Effectif","28","35","31","30","42","34"])}<p><b>a)</b> Calcule la fréquence d'apparition du 5.</p><p><b>b)</b> Si le dé est équilibré, quelle est la probabilité d'obtenir 5 ?</p><p><b>c)</b> Inès affirme : « Mon dé est truqué, car le 5 sort trop souvent. » Peut-on en être sûr ? Explique.</p><p><b>d)</b> Si le dé est équilibré et qu'on le lance 10 000 fois, autour de quelle valeur la fréquence du 5 devrait-elle se stabiliser ?</p>`,
 c:`<p><b>a)</b> {42/200} = <b>0,21</b>. <i>(1 point)</i></p><p><b>b)</b> <b>{1/6}</b> ≈ 0,17. <i>(1 point)</i></p><p><b>c)</b> Non : 200 lancers, ce n'est pas assez. Les fréquences varient d'une série à l'autre ; il faudrait un très grand nombre de lancers pour conclure. <i>(1 point)</i></p><p><b>d)</b> Autour de {1/6} ≈ <b>0,17</b>. <i>(1 point)</i></p>`},
{t:"Deux tirages avec remise", p:4, h:`<p>Un sac contient deux jetons rouges R<sub>1</sub> et R<sub>2</sub> et un jeton jaune J. On tire un jeton, on note sa couleur, on le remet dans le sac, puis on tire un deuxième jeton.</p><p><b>a)</b> Construis un tableau qui fait apparaître toutes les issues.</p><p><b>b)</b> Quelle est la probabilité d'obtenir deux jetons jaunes ?</p><p><b>c)</b> Quelle est la probabilité d'obtenir au moins un jeton rouge ?</p>`,
 c:`<p><b>a)</b> <i>(2 points)</i></p>${tab2(["R1","R2","J"],["R1","R2","J"])}<p>Il y a 9 issues.</p><p><b>b)</b> Seule l'issue (J ; J) : <b>{1/9}</b>. <i>(1 point)</i></p><p><b>c)</b> C'est l'événement contraire de « deux jaunes » : 1 − {1/9} = <b>{8/9}</b>. <i>(1 point)</i></p>`},
{t:"Rouges et noires", p:3, h:`<p>Une urne ne contient que des boules rouges et des boules noires. On tire une boule au hasard. La probabilité d'obtenir une boule rouge est {3/8}.</p><p><b>a)</b> Quelle est la probabilité d'obtenir une boule noire ?</p><p><b>b)</b> Il y a 15 boules noires dans l'urne. Combien y a-t-il de boules rouges ?</p>`,
 c:`<p><b>a)</b> 1 − {3/8} = <b>{5/8}</b>. <i>(1 point)</i></p><p><b>b)</b> Les 15 boules noires représentent les {5/8} des boules : 15 ÷ 5 × 8 = 24 boules en tout. Donc 24 − 15 = <b>9 boules rouges</b>. <i>(2 points)</i></p>`}
]}
};
})();
