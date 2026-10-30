/* 5e — Chapitre 12 : Les puissances : carré et cube (cours, fiche d'exercices et corrigé de M. Staal)
   Les carrés quadrillés et les cubes sont dessinés en SVG ; tous les résultats sont calculés. */
(function(){
const VF=["Vrai","Faux"], LT="&lt;", GT="&gt;";
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const F = (a,b) => `{${a}/${b}}`;
/* écriture française : 0,25 · 1 000 · 3,375 */
const D = x => { const r=Math.round(x*1e6)/1e6; const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const P = (b,e) => `${typeof b==="number"?D(b):b}<sup>${e}</sup>`;
const pw = (b,e) => Math.round(Math.pow(b,e)*1e6)/1e6;
const prod = (b,e) => Array(e).fill(typeof b==="number"?D(b):b).join(" × ");

/* ---------- dessins ---------- */
const FILL="#e8eef8", TOPF="#f2f6fc", SIDEF="#cfdcf0", STK="#1f4e79";
/* carré de n carreaux de côté, côtés écrits */
function sq(n, o={}){ const s=o.s||(n<=4?28:n<=6?22:16), m=26, W=n*s+m+8, H=n*s+m+6;
  let g=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Carré de ${n} carreaux de côté">`;
  g+=`<rect x="${m}" y="${m}" width="${n*s}" height="${n*s}" style="fill:${FILL};stroke:${STK};stroke-width:2"/>`;
  for(let i=1;i<n;i++) g+=`<line x1="${m+i*s}" y1="${m}" x2="${m+i*s}" y2="${m+n*s}" style="stroke:${STK};stroke-width:1.3"/><line x1="${m}" y1="${m+i*s}" x2="${m+n*s}" y2="${m+i*s}" style="stroke:${STK};stroke-width:1.3"/>`;
  if(o.lab!==false) g+=`<text x="${m+n*s/2}" y="${m-8}" text-anchor="middle">${n}</text><text x="${m-8}" y="${m+n*s/2+6}" text-anchor="end">${n}</text>`;
  return g+"</svg>"; }
/* cube formé de n × n × n petits cubes (perspective cavalière) */
function cube(n, o={}){ const s=o.s||(n<=2?40:n<=3?30:22), d=s*0.5, x0=8, y0=8+n*d, L=n*s, W=L+n*d+18, H=L+n*d+18;
  const pt=(x,y)=>`${x.toFixed(1)},${y.toFixed(1)}`, ln=(a,b,c,e)=>`<line x1="${a.toFixed(1)}" y1="${b.toFixed(1)}" x2="${c.toFixed(1)}" y2="${e.toFixed(1)}" style="stroke:${STK};stroke-width:1.3"/>`;
  let g=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Cube formé de ${n} × ${n} × ${n} petits cubes">`;
  g+=`<polygon points="${pt(x0,y0)} ${pt(x0+L,y0)} ${pt(x0+L+n*d,y0-n*d)} ${pt(x0+n*d,y0-n*d)}" style="fill:${TOPF};stroke:${STK};stroke-width:2"/>`;
  g+=`<polygon points="${pt(x0+L,y0)} ${pt(x0+L+n*d,y0-n*d)} ${pt(x0+L+n*d,y0+L-n*d)} ${pt(x0+L,y0+L)}" style="fill:${SIDEF};stroke:${STK};stroke-width:2"/>`;
  g+=`<rect x="${x0}" y="${y0}" width="${L}" height="${L}" style="fill:${FILL};stroke:${STK};stroke-width:2"/>`;
  for(let i=1;i<n;i++){ g+=ln(x0+i*s,y0,x0+i*s,y0+L)+ln(x0,y0+i*s,x0+L,y0+i*s);           /* face avant */
    g+=ln(x0+i*s,y0,x0+i*s+n*d,y0-n*d)+ln(x0+i*d,y0-i*d,x0+L+i*d,y0-i*d);                  /* dessus */
    g+=ln(x0+L+i*d,y0-i*d,x0+L+i*d,y0+L-i*d)+ln(x0+L,y0+i*s,x0+L+n*d,y0+i*s-n*d); }        /* côté */
  return g+"</svg>"; }
/* calcul nommé : une étape par ligne, chaque ligne commence par « A = » */
const NL = (n, ch) => `<p class="calc">${n} = ${ch.split(" = ").join(`<br>${n} = `)}</p>`;
const grid = arr => `<div class="calcs">${arr.map(([n,ch])=>`<div>${NL(n,ch)}</div>`).join("")}</div>`;
const cols = arr => `<div class="calcs">${arr.map(x=>`<span>${x}</span>`).join("")}</div>`;
window.PW12 = {D, P, pw, prod, sq, cube, F, NL, grid, cols};

/* ---------- schémas ---------- */
const S_CAR = sch("Le carré d'un nombre", `<div class="figs">${sq(3)}</div><p class="calc">${P(3,2)} = 3 × 3 = 9 &nbsp;&nbsp; (et non 3 × 2 = 6)</p><p class="schN">a<sup>2</sup> = a × a. Un carré de côté c a pour aire c<sup>2</sup>.</p>`);
const S_TAB = sch("Les carrés à connaître", `<div class="scroll"><table class="std"><tbody><tr><th><i>n</i></th>${[...Array(13)].map((_,i)=>`<td>${i}</td>`).join("")}</tr><tr><th><i>n</i><sup>2</sup></th>${[...Array(13)].map((_,i)=>`<td>${i*i}</td>`).join("")}</tr></tbody></table></div>`);
const S_CUB = sch("Le cube d'un nombre", `<div class="figs">${cube(2,{s:30})}</div><p class="calc">${P(2,3)} = 2 × 2 × 2 = 8 &nbsp;&nbsp; (et non 2 × 3 = 6)</p><p class="schN">a<sup>3</sup> = a × a × a. Un cube de côté c a pour volume c<sup>3</sup>.</p>`);
const S_PRIO = sch("L'ordre des calculs", `<p class="schN">1) parenthèses · 2) carrés et cubes · 3) × et ÷ · 4) + et −</p>${NL("A",`3 + ${P(2,2)} × 5 = 3 + 4 × 5 = 3 + 20 = 23`)}${NL("B",`${P("(3+2)",2)} = ${P(5,2)} = 25`)}`);
const S_LIT = sch("Remplacer la lettre", `<p class="schN">Pour <i>x</i> = 4 :</p>${NL("A",`<i>x</i><sup>2</sup> + 3 = ${P(4,2)} + 3 = 16 + 3 = 19`)}${NL("B",`2<i>x</i><sup>2</sup> = 2 × ${P(4,2)} = 2 × 16 = 32`)}<p class="schN">2<i>x</i><sup>2</sup> veut dire 2 × <i>x</i><sup>2</sup> : on calcule le carré d'abord.</p>`);

CH["5e-12"] = {
intro:"Le carré et le cube d'un nombre, les carrés à connaître par cœur, l'aire d'un carré et le volume d'un cube, et les calculs avec des carrés et des cubes.",
savoir:[
  "connaître et utiliser les notations a<sup>2</sup> (carré) et a<sup>3</sup> (cube) ;",
  "connaître par cœur les carrés des nombres de 0 à 12 et le cube de 10 ;",
  "calculer l'aire d'un carré et le volume d'un cube ;",
  "calculer la valeur d'une expression numérique ou littérale contenant des carrés et des cubes."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Le carré d'un nombre", h:`
  <div class="retenir" data-l="Définition"><p>Pour un nombre <i>a</i>, le <b>carré</b> de <i>a</i> se note <i>a</i><sup>2</sup>.</p><p>On lit « <i>a</i> au carré ».</p><p class="calc"><i>a</i><sup>2</sup> = <i>a</i> × <i>a</i></p></div>
  <div class="figs"><figure>${sq(3)}<figcaption>${P(3,2)} = 3 × 3 = 9</figcaption></figure><figure>${sq(4)}<figcaption>${P(4,2)} = 4 × 4 = 16</figcaption></figure></div>
  <p>Un carré de côté <i>c</i> a pour aire <i>A</i> = <i>c</i><sup>2</sup>. C'est pourquoi <i>a</i><sup>2</sup> se lit « <i>a</i> au carré ».</p>
  <p><b>Exemples :</b></p>${grid([["A",`${P("0,5",2)} = 0,5 × 0,5 = 0,25`],["B",`${P(`(${F(2,3)})`,2)} = ${F(2,3)} × ${F(2,3)} = ${F(4,9)}`]])}
  <div class="attention"><b>ATTENTION :</b> ${P(3,2)} ne signifie pas 3 × 2.<br>${P(3,2)} = 3 × 3 = 9, alors que 3 × 2 = 6.</div>
  <div class="retenir" data-l="À connaître par cœur"><p>Les carrés des nombres de 0 à 12 :</p><div class="scroll"><table class="std"><thead><tr><th><i>n</i></th>${[...Array(13)].map((_,i)=>`<th>${i}</th>`).join("")}</tr></thead><tbody><tr><th><i>n</i><sup>2</sup></th>${[...Array(13)].map((_,i)=>`<td>${i*i}</td>`).join("")}</tr></tbody></table></div></div>`},
{k:"II", t:"Le cube d'un nombre", h:`
  <div class="retenir" data-l="Définition"><p>Pour un nombre <i>a</i>, le <b>cube</b> de <i>a</i> se note <i>a</i><sup>3</sup>.</p><p>On lit « <i>a</i> au cube ».</p><p class="calc"><i>a</i><sup>3</sup> = <i>a</i> × <i>a</i> × <i>a</i></p></div>
  <div class="figs"><figure>${cube(2)}<figcaption>${P(2,3)} = 2 × 2 × 2 = 8</figcaption></figure></div>
  <p>Un cube de côté <i>c</i> a pour volume <i>V</i> = <i>c</i><sup>3</sup>.</p>
  <p><b>Exemples :</b></p>${grid([["A",`${P(5,3)} = 5 × 5 × 5 = 125`],["B",`${P(10,3)} = 10 × 10 × 10 = 1 000`],["C",`${P(10,2)} = 10 × 10 = 100`]])}
  <div class="retenir" data-l="À connaître"><p class="calc">${P(1,3)} = 1 &nbsp;·&nbsp; ${P(2,3)} = 8 &nbsp;·&nbsp; ${P(3,3)} = 27 &nbsp;·&nbsp; ${P(4,3)} = 64 &nbsp;·&nbsp; ${P(5,3)} = 125 &nbsp;·&nbsp; ${P(10,3)} = 1 000</p></div>`},
{k:"III", t:"Calculer avec des carrés et des cubes", h:`
  <div class="retenir" data-l="Ordre des calculs"><ol><li>Je calcule d'abord ce qui est entre <b>parenthèses</b>.</li><li>Je calcule ensuite les <b>carrés et les cubes</b>.</li><li>Puis les multiplications et les divisions, enfin les additions et les soustractions.</li></ol></div>
  <p><b>Exemples :</b></p>${grid([["A",`3 + ${P(2,2)} × 5 = 3 + 4 × 5 = 3 + 20 = 23`],["B",`${P("(3+2)",2)} = ${P(5,2)} = 25`]])}
  <p>Dans une expression littérale, on remplace la lettre par sa valeur.</p>
  <p><b>Exemple :</b> pour <i>x</i> = 4 :</p>${grid([["C",`<i>x</i><sup>2</sup> + 3 = ${P(4,2)} + 3 = 16 + 3 = 19`],["D",`2<i>x</i><sup>2</sup> = 2 × ${P(4,2)} = 2 × 16 = 32`]])}
  <p><b>À toi de jouer :</b> calcule E = ${P(6,2)}, F = ${P(2,3)} et G = 5 + 3 × ${P(2,2)}.</p>
  <details><summary>Voir la correction</summary><div class="corr">${grid([["E",`${P(6,2)} = 6 × 6 = 36`],["F",`${P(2,3)} = 2 × 2 × 2 = 8`],["G",`5 + 3 × ${P(2,2)} = 5 + 3 × 4 = 5 + 12 = 17`]])}</div></details>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Le carré d'un nombre", e:[
  {n:"Activité 1", t:"Compter des carreaux", w:"Sur ta feuille", h:`<p>On utilise des carreaux de 1 cm de côté.</p><div class="figs">${sq(3)}</div><p>1) Combien de petits carrés contient ce grand carré de côté 3 carreaux ?</p><p>2) Complète : ${P(3,2)} = ……</p><p>Combien de petits carrés aurait un carré de côté 5 ? de côté 10 ?</p>`,
   c:`<p>1) Ce carré contient 3 × 3 = <b>9</b> petits carrés.</p><p>2) ${P(3,2)} = <b>9</b>.</p><p>Un carré de côté 5 contient ${P(5,2)} = <b>25</b> petits carrés.</p><p>Un carré de côté 10 en contient ${P(10,2)} = <b>100</b>.</p>`},
  {n:"Exercice 1", t:"Écrire un produit et calculer", w:"Sur ton cahier", h:`<p>Écris sous forme d'un produit, puis calcule.</p>${cols([[3,2],[7,2],[2,3],[5,3],[10,2],[10,3]].map(([b,e],i)=>`${"ABCDEF"[i]} = ${P(b,e)}`))}`,
   c:grid([[3,2],[7,2],[2,3],[5,3],[10,2],[10,3]].map(([b,e],i)=>["ABCDEF"[i], `${P(b,e)} = ${prod(b,e)} = <b>${D(pw(b,e))}</b>`]))},
  {n:"Exercice 2", t:"Le tableau des carrés", w:"Sur ta feuille", h:`<p>Complète le tableau (les carrés de 0 à 12 sont à connaître par cœur).</p><div class="scroll"><table class="std"><thead><tr><th><i>n</i></th>${[...Array(13)].map((_,i)=>`<th>${i}</th>`).join("")}</tr></thead><tbody><tr><th><i>n</i><sup>2</sup></th>${[...Array(13)].map(()=>`<td></td>`).join("")}</tr></tbody></table></div><p>Complète : ${P(9,2)} = …… ; ${P(11,2)} = …… ; ${P(12,2)} = …… ; ${P(6,2)} = ……</p>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th><i>n</i></th>${[...Array(13)].map((_,i)=>`<th>${i}</th>`).join("")}</tr></thead><tbody><tr><th><i>n</i><sup>2</sup></th>${[...Array(13)].map((_,i)=>`<td>${i*i}</td>`).join("")}</tr></tbody></table></div><p>${P(9,2)} = <b>81</b> ; ${P(11,2)} = <b>121</b> ; ${P(12,2)} = <b>144</b> ; ${P(6,2)} = <b>36</b></p>`},
  {n:"Exercice 3", t:"Carrés de décimaux et de fractions", w:"Sur ta feuille", h:`<p>Calcule mentalement et écris seulement les résultats.</p>${cols([P(8,2),P("0,1",2),P("0,3",2),P(`(${F(1,2)})`,2),P(`(${F(3,4)})`,2),P("1,5",2)].map((x,i)=>`${"ABCDEF"[i]} = ${x}`))}`,
   c:grid([["A",`${P(8,2)} = 8 × 8 = <b>64</b>`],["B",`${P("0,1",2)} = 0,1 × 0,1 = <b>0,01</b>`],["C",`${P("0,3",2)} = 0,3 × 0,3 = <b>0,09</b>`],["D",`${P(`(${F(1,2)})`,2)} = ${F(1,2)} × ${F(1,2)} = <b>${F(1,4)}</b>`],["E",`${P(`(${F(3,4)})`,2)} = ${F(3,4)} × ${F(3,4)} = <b>${F(9,16)}</b>`],["F",`${P("1,5",2)} = 1,5 × 1,5 = <b>2,25</b>`]])},
  {n:"Exercice 4", t:"Corriger les erreurs", w:"Sur ton cahier", h:`<p>Vrai ou faux ? Justifie.</p><p>a) Marc affirme : « ${P(4,2)} = 8 ». Que vaut vraiment ${P(4,2)} ? Quelle erreur a-t-il commise ?</p><p>b) Inès affirme : « ${P(2,3)} = 6 ». A-t-elle raison ?</p><p>c) Tom affirme : « le carré de 5 est plus petit que le cube de 5 ». A-t-il raison ?</p>`,
   c:`<p>a) Marc a calculé 4 × 2 au lieu de 4 × 4.</p>${NL("A",`${P(4,2)} = 4 × 4 = <b>16</b>`)}<p>b) <b>Non</b> : Inès a calculé 2 × 3.</p>${NL("B",`${P(2,3)} = 2 × 2 × 2 = <b>8</b>`)}<p>c) <b>Oui</b> : ${P(5,2)} = 25 et ${P(5,3)} = 125, et 25 &lt; 125.</p>`}
 ]},
{t:"Le cube d'un nombre", e:[
  {n:"Activité 2", t:"Compter des cubes", w:"Sur ta feuille", h:`<p>Un cube de côté 2 cm est formé de petits cubes de 1 cm de côté.</p><div class="figs">${cube(2)}</div><p>1) Combien de petits cubes contient ce cube ? Complète : ${P(2,3)} = ……</p><p>2) Même question pour un cube de côté 3 cm. Complète : ${P(3,3)} = ……</p>`,
   c:`<p>1) Il contient 2 × 2 × 2 = <b>8</b> petits cubes : ${P(2,3)} = 8.</p><p>2) Un cube de côté 3 cm contient 3 × 3 × 3 = <b>27</b> petits cubes : ${P(3,3)} = 27.</p><div class="figs">${cube(3)}</div>`},
  {n:"Exercice 5", t:"Calculer des cubes", w:"Sur ton cahier", h:`<p>Calcule (calculatrice autorisée pour D, E et F).</p>${cols([1,4,10,0.1,6,20].map((b,i)=>`${"ABCDEF"[i]} = ${P(b,3)}`))}`,
   c:grid([1,4,10,0.1,6,20].map((b,i)=>["ABCDEF"[i], `${P(b,3)} = ${prod(b,3)} = <b>${D(pw(b,3))}</b>`]))},
  {n:"Exercice 6", t:"Aires de carrés et volumes de cubes", w:"Sur ton cahier", h:`<p>1) Quelle est l'aire d'un carré de côté 9 cm ? de côté 12 cm ? de côté 2,5 cm ?</p><p>2) Quel est le volume d'un cube de côté 4 cm ? de côté 10 cm ? de côté 1,5 cm ?</p><p>3) Un carré a pour aire 49 cm². Quel est son côté ?</p><p>Un cube a pour volume 27 cm³. Quel est son côté ?</p>`,
   c:`<p>Aire d'un carré : <i>c</i><sup>2</sup>. Volume d'un cube : <i>c</i><sup>3</sup>.</p><p>1) ${P(9,2)} = 9 × 9 = <b>81 cm²</b> ; ${P(12,2)} = 12 × 12 = <b>144 cm²</b> ; ${P("2,5",2)} = 2,5 × 2,5 = <b>6,25 cm²</b>.</p><p>2) ${P(4,3)} = 4 × 4 × 4 = <b>64 cm³</b> ; ${P(10,3)} = 10 × 10 × 10 = <b>1 000 cm³</b> ; ${P("1,5",3)} = 1,5 × 1,5 × 1,5 = <b>3,375 cm³</b>.</p><p>3) 7 × 7 = 49 : le côté du carré mesure <b>7 cm</b>.</p><p>3 × 3 × 3 = 27 : le côté du cube mesure <b>3 cm</b>.</p>`}
 ]},
{t:"Calculer avec des carrés et des cubes", e:[
  {n:"Exercice 7", t:"Priorités avec des puissances", w:"Sur ton cahier", h:`<p>Calcule en respectant les priorités.</p>${cols([`A = 3 + ${P(2,2)}`,`B = 2 × ${P(5,2)}`,`C = ${P("(3+2)",2)}`,`D = 10 − ${P(2,3)}`,`E = ${P(4,2)} − ${P(3,2)}`,`F = ${P(2,3)} + ${P(3,2)}`])}`,
   c:`<p>1) parenthèses · 2) carrés et cubes · 3) × et ÷ · 4) + et −</p>${grid([["A",`3 + ${P(2,2)} = 3 + 4 = <b>7</b>`],["B",`2 × ${P(5,2)} = 2 × 25 = <b>50</b>`],["C",`${P("(3+2)",2)} = ${P(5,2)} = <b>25</b>`],["D",`10 − ${P(2,3)} = 10 − 8 = <b>2</b>`],["E",`${P(4,2)} − ${P(3,2)} = 16 − 9 = <b>7</b>`],["F",`${P(2,3)} + ${P(3,2)} = 8 + 9 = <b>17</b>`]])}`},
  {n:"Exercice 8", t:"Expressions plus longues", w:"Sur ton cahier", h:`<p>Calcule en détaillant les étapes.</p>${cols([`A = 4 + 3 × ${P(2,2)}`,`B = (4+3) × ${P(2,2)}`,`C = ${P(5,2)} − 2 × ${P(3,2)}`,`D = ${P("(5−2)",3)}`,`E = 100 − ${P(10,2)} × 0,5`,`F = 2 × ${P(3,3)} + 1`])}`,
   c:grid([["A",`4 + 3 × ${P(2,2)} = 4 + 3 × 4 = 4 + 12 = <b>16</b>`],["B",`(4+3) × ${P(2,2)} = 7 × ${P(2,2)} = 7 × 4 = <b>28</b>`],["C",`${P(5,2)} − 2 × ${P(3,2)} = 25 − 2 × 9 = 25 − 18 = <b>7</b>`],["D",`${P("(5−2)",3)} = ${P(3,3)} = <b>27</b>`],["E",`100 − ${P(10,2)} × 0,5 = 100 − 100 × 0,5 = 100 − 50 = <b>50</b>`],["F",`2 × ${P(3,3)} + 1 = 2 × 27 + 1 = 54 + 1 = <b>55</b>`]])},
  {n:"Exercice 9", t:"Expressions littérales avec des puissances", w:"Sur ton cahier", h:`<p>Calcule la valeur de chaque expression pour la valeur de <i>x</i> indiquée.</p>${cols([`A = <i>x</i><sup>2</sup> + 1 pour <i>x</i> = 5`,`B = 3<i>x</i><sup>2</sup> pour <i>x</i> = 2`,`C = <i>x</i><sup>3</sup> − <i>x</i> pour <i>x</i> = 3`,`D = (<i>x</i>+1)<sup>2</sup> pour <i>x</i> = 4`,`E = <i>x</i><sup>2</sup> + <i>x</i> pour <i>x</i> = 10`,`F = 2<i>x</i><sup>3</sup> pour <i>x</i> = 0,5`])}`,
   c:`<p>On remplace <i>x</i> par sa valeur (en remettant le signe ×), puis on respecte les priorités.</p>${grid([["A",`<i>x</i><sup>2</sup> + 1 = ${P(5,2)} + 1 = 25 + 1 = <b>26</b>`],["B",`3<i>x</i><sup>2</sup> = 3 × ${P(2,2)} = 3 × 4 = <b>12</b>`],["C",`<i>x</i><sup>3</sup> − <i>x</i> = ${P(3,3)} − 3 = 27 − 3 = <b>24</b>`],["D",`(<i>x</i>+1)<sup>2</sup> = ${P("(4+1)",2)} = ${P(5,2)} = <b>25</b>`],["E",`<i>x</i><sup>2</sup> + <i>x</i> = ${P(10,2)} + 10 = 100 + 10 = <b>110</b>`],["F",`2<i>x</i><sup>3</sup> = 2 × ${P("0,5",3)} = 2 × 0,125 = <b>0,25</b>`]])}`},
  {n:"Exercice 10", t:"Aire et périmètre d'un carré", w:"Sur ton cahier", h:`<p>Une figure est composée d'un carré de côté <i>c</i> cm.</p><p>1) Exprime en fonction de <i>c</i> l'aire du carré, puis son périmètre.</p><p>2) Calcule l'aire et le périmètre pour <i>c</i> = 6, puis pour <i>c</i> = 12.</p><p>3) Quand on double le côté, l'aire est-elle doublée ? Explique avec les valeurs calculées.</p>`,
   c:`<p>1) Aire : <b><i>c</i><sup>2</sup></b> ; périmètre : <b>4<i>c</i></b>.</p><p>2) Pour <i>c</i> = 6 : aire ${P(6,2)} = <b>36 cm²</b>, périmètre 4 × 6 = <b>24 cm</b>.</p><p>Pour <i>c</i> = 12 : aire ${P(12,2)} = <b>144 cm²</b>, périmètre 4 × 12 = <b>48 cm</b>.</p><p>3) <b>Non</b> : le périmètre est doublé (de 24 cm à 48 cm), mais l'aire est multipliée par 4 (de 36 cm² à 144 cm²).</p>`}
 ]}
],

/* ÉVAL-5b début */
/* ===================== ÉVALUATION D'ENTRAÎNEMENT (+ version aménagée « bep ») ===================== */
eval:(()=>{
const pn = v => String(v).replace(".",",");
const pts = v => `${pn(v)} point${v>=2?"s":""}`;
const pt = v => ` <i>(${pts(v)})</i>`;
const exl = (X, ids) => { const s=ids.reduce((a,i)=>a+X[i-1].p,0); return (ids.length===1?`Ex. ${ids[0]}`:`Ex. ${ids.slice(0,-1).join(", ")} et ${ids[ids.length-1]}`)+` (${pts(s)})`; };
const COMP = [
  ["CALCULER","Je calcule un carré, un cube et la valeur d'une expression qui contient des carrés et des cubes.",[1,3,4]],
  ["RAISONNER","Je repère une erreur et je justifie avec la définition du carré et du cube.",[2]],
  ["MODÉLISER","J'utilise le carré et le cube pour calculer une aire, un volume ou une longueur.",[5]]
];
const L = (b, list) => list.filter(q=>!(b && q.rm));
const lab = i => "abcdefgh"[i]+")", num = i => (i+1)+".";
const x = "<i>x</i>";
const mk = b => {
  const P_ = q => b ? q.pb : q.p;
  const sum = q => q.reduce((a,z)=>a+P_(z),0);
  const wr = f => (q,i) => { const c=q.c.startsWith("<p>") ? `<p>${f(i)} `+q.c.slice(3) : `<p>${f(i)}</p>`+q.c; return (c.endsWith("</p>") ? c.slice(0,-4) : c)+pt(P_(q))+"</p>"; };
  /* Ex 1 */
  const E1 = L(b, [[6,2],[9,2],[12,2],[2,3],[4,3],[10,2],["0,4",2,1],["(1/3)",2,1]].map(([u,e,r])=>({u,e,rm:!!r})));
  const c1 = q => q.u==="0,4" ? `${P("0,4",2)} = 0,4 × 0,4 = <b>0,16</b>` : q.u==="(1/3)" ? `${P(`(${F(1,3)})`,2)} = ${F(1,3)} × ${F(1,3)} = <b>${F(1,9)}</b>` : `${P(q.u,q.e)} = ${prod(q.u,q.e)} = <b>${D(pw(q.u,q.e))}</b>`;
  const h1 = q => q.u==="(1/3)" ? P(`(${F(1,3)})`,2) : P(q.u,q.e);
  /* Ex 2 */
  const q2 = [
    {h:`Nina affirme : « ${P(4,3)} = 12 ».`, p:1, pb:1, c:`<p><b>Faux.</b> Nina a calculé 4 × 3. Or ${P(4,3)} = 4 × 4 × 4 = <b>64</b>.`},
    {h:`Yanis affirme : « ${P(2,3)} est plus petit que ${P(3,2)} ».`, p:1, pb:1, c:`<p><b>Vrai.</b> ${P(2,3)} = 2 × 2 × 2 = 8 et ${P(3,2)} = 3 × 3 = 9 ; or 8 &lt; 9.`},
    {h:`Emma affirme : « ${P("0,3",2)} = 0,9 ».`, p:1, pb:1, c:`<p><b>Faux.</b> ${P("0,3",2)} = 0,3 × 0,3 = <b>0,09</b>. <i>(0,3 × 3 = 0,9, mais ici on multiplie 0,3 par lui-même.)</i>`}
  ];
  /* Ex 3 */
  const E3 = L(b, [
    {n:"A", e:`5 + 2 × ${P(3,2)}`, ch:`5 + 2 × ${P(3,2)} = 5 + 2 × 9 = 5 + 18 = 23`, p:1, pb:1.5},
    {n:"B", e:`${P("(5+2)",2)} − 10`, ch:`${P("(5+2)",2)} − 10 = ${P(7,2)} − 10 = 49 − 10 = 39`, p:1, pb:1.5},
    {n:"C", e:`${P(4,3)} − ${P(6,2)}`, ch:`${P(4,3)} − ${P(6,2)} = 64 − 36 = 28`, p:1, pb:1.5},
    {n:"D", e:`100 − 3 × ${P(2,3)}`, ch:`100 − 3 × ${P(2,3)} = 100 − 3 × 8 = 100 − 24 = 76`, p:1, pb:1.5},
    {n:"E", e:`${P("(9−7)",3)} + ${P(1,2)}`, ch:`${P("(9−7)",3)} + ${P(1,2)} = ${P(2,3)} + ${P(1,2)} = 8 + 1 = 9`, p:1, rm:true}
  ]);
  /* Ex 4 */
  const E4 = L(b, [
    {n:"A", e:`${x}<sup>2</sup> + 2${x}`, ch:`${x}<sup>2</sup> + 2${x} = ${P(5,2)} + 2 × 5 = 25 + 10 = 35`, p:1, pb:1.5},
    {n:"B", e:`3${x}<sup>2</sup>`, ch:`3${x}<sup>2</sup> = 3 × ${P(5,2)} = 3 × 25 = 75`, p:1, pb:1.5},
    {n:"C", e:`${P(`(${x}−1)`,3)}`, ch:`${P(`(${x}−1)`,3)} = ${P("(5−1)",3)} = ${P(4,3)} = 64`, p:1, rm:true}
  ]);
  const nl = q => NL(q.n, q.ch).replace(/<\/p>$/, pt(P_(q))+"</p>");
  /* Ex 5 */
  const q5 = L(b, [
    {h:`Un aquarium a la forme d'un cube d'arête 5 dm. Calcule son volume.`, p:1, pb:1.5,
     c:`<p>Le volume d'un cube d'arête <i>c</i> est <i>c</i><sup>3</sup>.</p><p class="calc">${P(5,3)} = 5 × 5 × 5 = 125</p><p>Le volume de l'aquarium est de <b>125 dm³</b>.`},
    {h:`Le fond de cet aquarium est un carré. Calcule son aire.`, p:1, pb:1.5,
     c:`<p>Le fond est un carré de côté 5 dm : son aire est ${P(5,2)}.</p><p class="calc">${P(5,2)} = 5 × 5 = 25</p><p>L'aire du fond est de <b>25 dm²</b>.`},
    {h:`Un carré a une aire de 64 cm². Quelle est la longueur de son côté ?`, p:1, pb:1,
     c:`<p>Je cherche le nombre dont le carré est 64 : 8 × 8 = 64.</p><p>Le côté mesure <b>8 cm</b>.`},
    {h:`Un cube a un volume de 1 000 cm³. Quelle est la longueur de son arête ?`, p:1, pb:1,
     c:`<p>Je cherche le nombre dont le cube est 1 000 : 10 × 10 × 10 = 1 000.</p><p>L'arête mesure <b>10 cm</b>.`},
    {h:`Lucas affirme : « Si on double l'arête d'un cube, son volume est multiplié par 2. » Vérifie avec un cube d'arête 2 cm et un cube d'arête 4 cm. A-t-il raison ?`, p:1, rm:true,
     c:`<p class="calc">${P(2,3)} = 2 × 2 × 2 = 8 cm³ &nbsp; et &nbsp; ${P(4,3)} = 4 × 4 × 4 = 64 cm³</p><div class="figs">${cube(2,{s:22})}${cube(4,{s:22})}</div><p><b>Non</b> : 64 = 8 × 8, le volume est multiplié par 8, et non par 2.`}
  ]);
  const X_ = [
    {t:"Carrés et cubes", p:E1.length*0.5,
     h:`<p>Écris chaque nombre sous la forme d'un produit, puis calcule.</p>${cols(E1.map((q,i)=>`${"ABCDEFGH"[i]} = ${h1(q)}`))}`,
     c:`<p><i>a</i><sup>2</sup> = <i>a</i> × <i>a</i> &nbsp; et &nbsp; <i>a</i><sup>3</sup> = <i>a</i> × <i>a</i> × <i>a</i>.</p>${grid(E1.map((q,i)=>["ABCDEFGH"[i], c1(q)]))}<p><i>0,5 point par nombre (produit et résultat).</i></p>`},
    {t:"Vrai ou faux ?", p:sum(q2), h:`<p>Dis si chaque affirmation est vraie ou fausse. Justifie par un calcul.</p>${q2.map((q,i)=>`<p>${lab(i)} ${q.h}</p>`).join("")}`, c:q2.map(wr(lab)).join("")},
    {t:"Calculer en respectant les priorités", p:sum(E3),
     h:`<p>Calcule en écrivant les étapes.</p>${cols(E3.map(q=>`${q.n} = ${q.e}`))}`,
     c:`<p>1) parenthèses · 2) carrés et cubes · 3) × et ÷ · 4) + et −</p>${E3.map(nl).join("")}`},
    {t:"Expressions littérales", p:sum(E4),
     h:`<p>Calcule la valeur de chaque expression pour ${x} = 5.</p>${cols(E4.map(q=>`${q.n} = ${q.e}`))}`,
     c:`<p>Je remplace ${x} par 5 (en remettant le signe ×), puis je calcule le carré ou le cube d'abord.</p>${E4.map(nl).join("")}`},
    {t:"Aires, volumes et longueurs", p:sum(q5), h:q5.map((q,i)=>`<p>${num(i)} ${q.h}</p>`).join(""), c:q5.map(wr(num)).join("")}
  ];
  return {X:X_, comp:COMP.map(([k,tt,ids])=>[k,tt,exl(X_,ids)])};
};
const N = mk(false), B = mk(true);
return {
titre:"Évaluation d'entraînement — Chapitre 12", duree:40, info:"Durée : 40 min · Calculatrice non autorisée",
comp:N.comp, exos:N.X,
bep:{
titre:"Évaluation d'entraînement — Chapitre 12 · version aménagée", duree:40, info:"Version aménagée · Durée : 40 min · Calculatrice non autorisée",
note:"Les mêmes exercices avec cinq questions en moins, dans le même temps (40 min). Le barème est recalculé pour rester sur 20. Les justifications sont toujours demandées.",
comp:B.comp, exos:B.X }
};
})(),
/* ÉVAL-5b fin */
/* ===================== QCM ===================== */
quiz:[
{nom:"Le carré d'un nombre", schema:S_CAR, q:{
 1:[ {g:()=>{ const n=ri(0,12); return {q:`Calcule A = ${P(n,2)}.`, rep:String(n*n), sx:NL("A",`${P(n,2)} = ${n} × ${n} = ${n*n}`)+S_TAB}; }},
     {g:()=>{ const n=ri(3,9); return {q:`${P(n,2)} est égal à :`, c:[`${n} × ${n}`,`${n} × 2`,`${n} + ${n}`], rep:`${n} × ${n}`, ex:`Le carré de ${n}, c'est ${n} × ${n} (et non ${n} × 2).`, sx:S_CAR}; }} ],
 2:[ {g:()=>{ const d=pick([1,2,3,4,5,6,7,8,9,11,12,15]), b=d/10; return {q:`Calcule A = ${P(b,2)}.`, rep:D(pw(b,2)), sx:NL("A",`${P(b,2)} = ${D(b)} × ${D(b)} = ${D(pw(b,2))}`)+S_CAR}; }},
     {g:()=>{ let p,q; do{ p=ri(1,5); q=ri(2,7); }while(p>=q || (p>1 && q%p===0) || (p===4 && q===6)); return {q:`Calcule A = ${P(`(${F(p,q)})`,2)}. Écris une fraction.`, rep:`${p*p}/${q*q}`, sx:NL("A",`${P(`(${F(p,q)})`,2)} = ${F(p,q)} × ${F(p,q)} = ${F(p*p,q*q)}`)+S_CAR}; }},
     {g:()=>{ const n=ri(3,9); return {q:`Vrai ou faux : ${P(n,2)} = ${2*n}.`, c:VF, rep:"Faux", ex:`${P(n,2)} ne veut pas dire ${n} × 2.`, sx:NL("A",`${P(n,2)} = ${n} × ${n} = ${n*n}`)+S_CAR}; }} ],
 3:[ {g:()=>{ const c=pick([ri(2,12), ri(11,49)/10*1]); const cc=Math.round(c*10)/10; return {q:`Quelle est l'aire (en cm²) d'un carré de côté ${D(cc)} cm ?`, rep:[D(pw(cc,2)), D(pw(cc,2))+" cm²"], ex:`A = ${P(cc,2)} = ${D(cc)} × ${D(cc)} = ${D(pw(cc,2))} cm².`, sx:S_CAR}; }},
     {g:()=>{ const c=ri(2,12); return {q:`Un carré a pour aire ${c*c} cm². Quelle est la longueur de son côté (en cm) ?`, rep:[String(c), c+" cm"], ex:`${c} × ${c} = ${c*c} : le côté mesure ${c} cm.`, sx:S_TAB}; }} ]
}},
{nom:"Le cube d'un nombre", schema:S_CUB, q:{
 1:[ {g:()=>{ const n=pick([1,2,3,4,5,10]); return {q:`Calcule A = ${P(n,3)}.`, rep:D(pw(n,3)), sx:NL("A",`${P(n,3)} = ${prod(n,3)} = ${D(pw(n,3))}`)+S_CUB}; }},
     {g:()=>{ const n=pick([2,4,5,6]); return {q:`${P(n,3)} est égal à :`, c:uniq(`${n} × ${n} × ${n}`,[`${n} × 3`,`${n} × ${n}`]), rep:`${n} × ${n} × ${n}`, ex:`Le cube de ${n}, c'est ${n} × ${n} × ${n}.`, sx:S_CUB}; }} ],
 2:[ {g:()=>{ const n=pick([6,7,8,9,20,30,0.1,0.2,0.5]); return {q:`Calcule A = ${P(n,3)}.`, rep:D(pw(n,3)), sx:NL("A",`${P(n,3)} = ${prod(n,3)} = ${D(pw(n,3))}`)+S_CUB}; }},
     {g:()=>{ const c=pick([2,3,4,5,10,1.5,0.5]); return {q:`Quel est le volume (en cm³) d'un cube de côté ${D(c)} cm ?`, rep:[D(pw(c,3)), D(pw(c,3))+" cm³"], ex:`V = ${P(c,3)} = ${prod(c,3)} = ${D(pw(c,3))} cm³.`, sx:S_CUB}; }} ],
 3:[ {g:()=>{ const c=pick([1,2,3,4,5,10]); return {q:`Un cube a pour volume ${D(c*c*c)} cm³. Quelle est la longueur de son côté (en cm) ?`, rep:[String(c), c+" cm"], ex:`${prod(c,3)} = ${D(c*c*c)} : le côté mesure ${c} cm.`, sx:S_CUB}; }},
     {g:()=>{ const n=ri(2,9); return {q:`Vrai ou faux : le carré de ${n} est plus petit que le cube de ${n}.`, c:VF, rep:"Vrai", ex:`${P(n,2)} = ${n*n} et ${P(n,3)} = ${n*n*n}, et ${n*n} &lt; ${n*n*n}.`, sx:S_CUB}; }},
     {g:()=>{ const n=pick([2,4,5,6]); return {q:`Vrai ou faux : ${P(n,3)} = ${3*n}.`, c:VF, rep:"Faux", ex:`${P(n,3)} ne veut pas dire ${n} × 3.`, sx:NL("A",`${P(n,3)} = ${prod(n,3)} = ${n*n*n}`)+S_CUB}; }} ]
}},
{nom:"Priorités avec des carrés et des cubes", schema:S_PRIO, q:{
 1:[ {g:()=>{ const a=ri(1,20), b=ri(2,9); return {q:`Calcule A = ${a} + ${P(b,2)}.`, rep:String(a+b*b), ex:"Le carré d'abord.", sx:NL("A",`${a} + ${P(b,2)} = ${a} + ${b*b} = ${a+b*b}`)+S_PRIO}; }},
     {g:()=>{ const a=ri(2,5), b=ri(2,9); return {q:`Calcule A = ${a} × ${P(b,2)}.`, rep:String(a*b*b), ex:"Le carré d'abord.", sx:NL("A",`${a} × ${P(b,2)} = ${a} × ${b*b} = ${a*b*b}`)+S_PRIO}; }} ],
 2:[ {g:()=>{ const a=ri(1,6), b=ri(1,6); return {q:`Calcule A = ${P(`(${a}+${b})`,2)}.`, c:uniq(String((a+b)**2),[String(a*a+b*b),String(2*(a+b)),String(a+b*b)]).slice(0,3), rep:String((a+b)**2), ex:"Les parenthèses d'abord.", sx:NL("A",`${P(`(${a}+${b})`,2)} = ${P(a+b,2)} = ${(a+b)**2}`)+S_PRIO}; }},
     {g:()=>{ const b=ri(3,7), a=ri(b+1,12); return {q:`Calcule A = ${P(a,2)} − ${P(b,2)}.`, rep:String(a*a-b*b), ex:"Les carrés d'abord.", sx:NL("A",`${P(a,2)} − ${P(b,2)} = ${a*a} − ${b*b} = ${a*a-b*b}`)+S_PRIO}; }},
     {g:()=>{ const b=ri(1,4), a=b**3+ri(1,30); return {q:`Calcule A = ${a} − ${P(b,3)}.`, rep:String(a-b**3), ex:"Le cube d'abord.", sx:NL("A",`${a} − ${P(b,3)} = ${a} − ${b**3} = ${a-b**3}`)+S_PRIO}; }} ],
 3:[ {g:()=>{ const a=ri(1,9), b=ri(2,5), c=ri(2,5); return {q:`Calcule A = ${a} + ${b} × ${P(c,2)}.`, c:uniq(String(a+b*c*c),[String((a+b)*c*c),String(a+(b*c)**2),String(a+b*c*2)]).slice(0,3), rep:String(a+b*c*c), ex:"Le carré, puis la multiplication, puis l'addition.", sx:NL("A",`${a} + ${b} × ${P(c,2)} = ${a} + ${b} × ${c*c} = ${a} + ${b*c*c} = ${a+b*c*c}`)+S_PRIO}; }},
     {g:()=>{ const a=ri(1,6), b=ri(1,6), c=ri(2,4); return {q:`Calcule A = (${a}+${b}) × ${P(c,2)}.`, rep:String((a+b)*c*c), ex:"Les parenthèses, puis le carré, puis la multiplication.", sx:NL("A",`(${a}+${b}) × ${P(c,2)} = ${a+b} × ${P(c,2)} = ${a+b} × ${c*c} = ${(a+b)*c*c}`)+S_PRIO}; }},
     {g:()=>{ let a,b,c; do{ a=ri(4,10); b=ri(2,4); c=ri(2,4); }while(a*a-b*c*c<0); return {q:`Calcule A = ${P(a,2)} − ${b} × ${P(c,2)}.`, rep:String(a*a-b*c*c), ex:"Les carrés, puis la multiplication, puis la soustraction.", sx:NL("A",`${P(a,2)} − ${b} × ${P(c,2)} = ${a*a} − ${b} × ${c*c} = ${a*a} − ${b*c*c} = ${a*a-b*c*c}`)+S_PRIO}; }} ]
}},
{nom:"Expressions littérales", schema:S_LIT, q:{
 1:[ {g:()=>{ const x=ri(2,10), k=ri(1,9); return {q:`Calcule A = <i>x</i><sup>2</sup> + ${k} pour <i>x</i> = ${x}.`, rep:String(x*x+k), ex:`On remplace <i>x</i> par ${x}.`, sx:NL("A",`<i>x</i><sup>2</sup> + ${k} = ${P(x,2)} + ${k} = ${x*x} + ${k} = ${x*x+k}`)+S_LIT}; }},
     {g:()=>{ const x=ri(2,10); return {q:`Calcule A = <i>x</i><sup>2</sup> + <i>x</i> pour <i>x</i> = ${x}.`, rep:String(x*x+x), ex:`On remplace <i>x</i> par ${x}.`, sx:NL("A",`<i>x</i><sup>2</sup> + <i>x</i> = ${P(x,2)} + ${x} = ${x*x} + ${x} = ${x*x+x}`)+S_LIT}; }} ],
 2:[ {g:()=>{ const x=ri(2,6), k=ri(2,5); return {q:`Calcule A = ${k}<i>x</i><sup>2</sup> pour <i>x</i> = ${x}.`, c:uniq(String(k*x*x),[String((k*x)**2),String(k*x*2),String(k+x*x)]).slice(0,3), rep:String(k*x*x), ex:`${k}<i>x</i><sup>2</sup> veut dire ${k} × <i>x</i><sup>2</sup> : le carré d'abord.`, sx:NL("A",`${k}<i>x</i><sup>2</sup> = ${k} × ${P(x,2)} = ${k} × ${x*x} = ${k*x*x}`)+S_LIT}; }},
     {g:()=>{ const x=ri(1,7), k=ri(1,5); return {q:`Calcule A = (<i>x</i>+${k})<sup>2</sup> pour <i>x</i> = ${x}.`, rep:String((x+k)**2), ex:"Les parenthèses d'abord.", sx:NL("A",`(<i>x</i>+${k})<sup>2</sup> = ${P(`(${x}+${k})`,2)} = ${P(x+k,2)} = ${(x+k)**2}`)+S_LIT}; }},
     {g:()=>{ const x=ri(2,5); return {q:`Calcule A = <i>x</i><sup>3</sup> − <i>x</i> pour <i>x</i> = ${x}.`, rep:String(x**3-x), ex:"Le cube d'abord.", sx:NL("A",`<i>x</i><sup>3</sup> − <i>x</i> = ${P(x,3)} − ${x} = ${x**3} − ${x} = ${x**3-x}`)+S_LIT}; }} ],
 3:[ {g:()=>{ const x=pick([0.1,0.2,0.5,1.5]), k=pick([2,4,10]); return {q:`Calcule A = ${k}<i>x</i><sup>3</sup> pour <i>x</i> = ${D(x)}.`, rep:D(pw(x,3)*k), ex:"Le cube d'abord, puis la multiplication.", sx:NL("A",`${k}<i>x</i><sup>3</sup> = ${k} × ${P(D(x),3)} = ${k} × ${D(pw(x,3))} = ${D(pw(x,3)*k)}`)+S_LIT}; }},
     {q:"Quand on double le côté d'un carré, son aire est…", c:["multipliée par 4","multipliée par 2","inchangée"], rep:"multipliée par 4", ex:"Pour c = 6 : aire 36 cm². Pour c = 12 : aire 144 cm² = 4 × 36 cm². Le périmètre, lui, est doublé.", sx:S_CAR},
     {g:()=>{ const c=ri(2,15); return {q:`Un carré a pour côté ${c} cm. Quel est son périmètre (en cm) ?`, c:uniq(String(4*c),[String(c*c),String(2*c),String(c+4)]).slice(0,3), rep:String(4*c), ex:`Périmètre = 4<i>c</i> = 4 × ${c} = ${4*c} cm (l'aire, elle, vaut ${P(c,2)} = ${c*c} cm²).`, sx:S_CAR}; }} ]
}}
]
};
})();
