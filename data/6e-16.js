/* 6e — Chapitre 16 : Les fractions (2) (cours et fiche d'exercices de M. Staal) */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const co = (p,alt,w) => img("c616co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("c616ex/"+p+".png", alt, w);
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const F = (a,b) => `{${a}/${b}}`;
const gcd = (a,b) => b ? gcd(b, a%b) : a;
const simp = (a,b) => { const g=gcd(a,b); return [a/g, b/g]; };
/* fraction simplifiée, écrite comme un entier si possible */
const FS = (a,b) => { const [p,q]=simp(a,b); return q===1 ? String(p) : F(p,q); };
const RS = (a,b) => { const [p,q]=simp(a,b); return q===1 ? String(p) : `${p}/${q}`; };
/* calculs nommés (A, B…) : une étape par ligne, chaque ligne commence par « A = » */
const NM = "ABCDEFGHIJ";
const CHN = (steps, i) => `<p class="calc">${steps.map(t=>NM[i]+" = "+t).join("<br>")}</p>`;
const CALCS = arr => `<div class="calcs">${arr.map((st,i)=>`<div>${CHN(st,i)}</div>`).join("")}</div>`;
const ENO = arr => `<div class="calcs">${arr.map((e,i)=>`<span>${NM[i]} = ${e}</span>`).join("")}</div>`;
window.FIG16 = {F, FS, RS, gcd, simp, NM, CHN, CALCS, ENO};

/* deux pizzas partagées en 2 : on colorie 3/2 */
const pizzas = (()=>{ let s=`<svg class="fig" viewBox="0 0 230 110" width="230" role="img" aria-label="Une pizza entière et une demi-pizza coloriées">`;
  [[55,true,true],[170,true,false]].forEach(([cx,g,d])=>{ s+=`<path d="M${cx} 10 A45 45 0 0 0 ${cx} 100 Z" style="fill:${g?"#f2b24c":"#fff3d1"};stroke:var(--ink);stroke-width:2"/><path d="M${cx} 10 A45 45 0 0 1 ${cx} 100 Z" style="fill:${d?"#f2b24c":"#fff3d1"};stroke:var(--ink);stroke-width:2"/>`; });
  return s+"</svg>"; })();

/* ---------- schémas ---------- */
const S_Q = sch("La fraction, un quotient", `<p class="calc">b × ${F("a","b")} = a &nbsp;·&nbsp; 3 × ${F(4,3)} = 4 &nbsp;·&nbsp; ${F(7,4)} = 7 ÷ 4 = 1,75</p><p class="schN">${F(1,3)} = 0,333… n'a pas d'écriture décimale : on garde la fraction (valeur exacte).</p>`);
const S_CMP = sch("Comparer des fractions", `<p class="calc">${F(2,3)} = ${F("2 × 4","3 × 4")} = ${F(8,12)} &nbsp; et &nbsp; ${F(8,12)} &gt; ${F(7,12)}, donc ${F(2,3)} &gt; ${F(7,12)}</p><p class="schN">Même dénominateur : on compare les numérateurs. Sinon, on les rend égaux d'abord.</p>`);
const S_ADD = sch("Additionner des fractions", co("somme","2 septièmes + 3 septièmes = 5 septièmes",300)+`<p class="calc">${F(2,7)} + ${F(3,7)} = ${F(5,7)} &nbsp;·&nbsp; ${F(1,2)} + ${F(3,8)} = ${F(4,8)} + ${F(3,8)} = ${F(7,8)}</p><p class="schN">On additionne les numérateurs et on <b>garde</b> le dénominateur, jamais on n'additionne les dénominateurs.</p>`);
const S_MUL = sch("Multiplier par un entier", `<p class="calc">3 × ${F(2,7)} = ${F("3 × 2",7)} = ${F(6,7)} &nbsp;·&nbsp; 4 × ${F(3,4)} = ${F(12,4)} = 3</p>`);
const S_PART = sch("Prendre une fraction d'une quantité", co("part","20 jetons partagés en 4 groupes de 5 : on prend 3 groupes, 15 jetons",320)+`<p class="calc">${F(3,4)} de 20 = (20 ÷ 4) × 3 = 15</p>`);

const E5 = [[2,3,"×",8,24],[9,7,"×",3,21],[2,5,"×",5,25],[7,6,"×",6,36],[30,10,"÷",2,5],[40,32,"÷",8,4],[18,81,"÷",9,9],[15,40,"÷",5,8],[1,4,"×",5,20]];
const op = (a,o,k) => o==="×" ? a*k : a/k;

CH["6e-16"] = {
intro:"La fraction comme quotient, comparer, encadrer et ranger des fractions, les additionner et les soustraire, les multiplier par un entier, et prendre une fraction d'une quantité.",
savoir:[
  "comprendre qu'une fraction est un quotient, et trouver son écriture décimale quand elle existe ;",
  "comparer, encadrer et ranger des fractions ;",
  "additionner et soustraire des fractions ;",
  "multiplier une fraction par un nombre entier ;",
  "prendre une fraction d'une quantité."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"La fraction, un quotient", h:`
  <p><b>Rappel (chapitre 3) :</b> une fraction ne change pas si on multiplie (ou si on divise) son numérateur et son dénominateur par un même nombre non nul : <span class="calc">${F(2,3)} = ${F("2 × 4","3 × 4")} = ${F(8,12)}</span> et <span class="calc">${F(18,24)} = ${F("18 ÷ 6","24 ÷ 6")} = ${F(3,4)}</span>.</p>
  <h4>1. Des bonds de grenouille</h4>
  <p>Une grenouille traverse une mare en faisant des bonds de même longueur. Quelle est la longueur exacte d'un bond ?</p>
  <div class="scroll"><table class="std"><thead><tr><th>12 m en 4 bonds</th><th>1 m en 4 bonds</th><th>1 m en 6 bonds</th><th>4 m en 3 bonds</th></tr></thead><tbody><tr><td>On cherche 4 × … = 12.<br>12 ÷ 4 = 3 : un bond mesure 3 m.</td><td>On cherche 4 × … = 1.<br>1 ÷ 4 = 0,25 : un bond mesure 0,25 m.</td><td>On cherche 6 × … = 1.<br>1 ÷ 6 = 0,1666… : la division ne s'arrête pas !<br>La valeur exacte est ${F(1,6)} : un bond mesure ${F(1,6)} m, et 6 × ${F(1,6)} = 1.</td><td>On cherche 3 × … = 4.<br>4 ÷ 3 = 1,333… : la division ne s'arrête pas !<br>La valeur exacte est ${F(4,3)} : un bond mesure ${F(4,3)} m, et 3 × ${F(4,3)} = 4.</td></tr></tbody></table></div>
  <h4>2. Définition</h4>
  <div class="retenir" data-l="Définition"><p>a et b sont deux nombres, avec b ≠ 0. Le <b>quotient</b> de a par b est le nombre qui, multiplié par b, donne a. On le note a ÷ b ou ${F("a","b")} :</p><p class="calc">b × ${F("a","b")} = a</p></div>
  <p><b>Exemples :</b> 7 × ${F(3,7)} = 3 ; ${F(5,9)} × 9 = 5 ; ${F(7,4)} = 7 ÷ 4 = 1,75.</p>
  <p><b>Remarque :</b> certaines fractions ont une écriture décimale (${F(7,4)} = 1,75 ; ${F(3,10)} = 0,3), d'autres non : ${F(1,3)} = 0,333… n'est pas un nombre décimal. On garde alors l'écriture fractionnaire, qui est la valeur exacte ; 0,33 n'en est qu'une valeur approchée.</p>`},
{k:"II", t:"Comparer, encadrer et ranger des fractions", h:`
  <h4>1. Comparer</h4>
  <div class="retenir" data-l="Propriété"><p>Si deux fractions ont le même dénominateur, la plus grande est celle qui a le plus grand numérateur. <b>Exemple :</b> ${F(5,7)} &gt; ${F(3,7)}.</p></div>
  <div class="retenir" data-l="Méthode"><ol><li>Si les dénominateurs sont différents, je les rends égaux en utilisant les fractions égales.</li><li>Je compare ensuite les numérateurs.</li></ol></div>
  <p><b>Exemple :</b> comparer ${F(2,3)} et ${F(7,12)}. ${F(2,3)} = ${F("2 × 4","3 × 4")} = ${F(8,12)}, et ${F(8,12)} &gt; ${F(7,12)}, donc ${F(2,3)} &gt; ${F(7,12)}.</p>
  <p><b>Remarque :</b> si aucun dénominateur n'est un multiple de l'autre, je cherche un dénominateur commun : ${F(2,3)} = ${F(8,12)} et ${F(3,4)} = ${F(9,12)}, donc ${F(2,3)} &lt; ${F(3,4)}.</p>
  <p><b>Remarque :</b> si deux fractions ont le même numérateur, la plus grande est celle qui a le plus petit dénominateur : ${F(3,5)} &gt; ${F(3,8)} (un cinquième est plus grand qu'un huitième).</p>
  <h4>2. Encadrer</h4>
  <p>On peut encadrer une fraction par deux nombres entiers consécutifs (chapitre 3), ou plus précisément grâce à la division :</p>
  <p><b>Exemple :</b> ${F(7,3)} = 2,333…, donc 2 &lt; ${F(7,3)} &lt; 3 (à l'unité) et 2,3 &lt; ${F(7,3)} &lt; 2,4 (au dixième).</p>
  <h4>3. Ranger</h4>
  <p><b>Exemple :</b> ranger dans l'ordre croissant ${F(3,4)} ; ${F(5,8)} ; ${F(1,2)} ; ${F(7,8)}. Je mets tout sur 8 : ${F(3,4)} = ${F(6,8)} et ${F(1,2)} = ${F(4,8)}.</p><p>Donc ${F(1,2)} &lt; ${F(5,8)} &lt; ${F(3,4)} &lt; ${F(7,8)}.</p>`},
{k:"III", t:"Additionner et soustraire des fractions", h:`
  <h4>1. Fractions de même dénominateur</h4>
  <div class="retenir" data-l="Propriété"><p>Pour additionner (ou soustraire) deux fractions de même dénominateur, on additionne (ou on soustrait) les numérateurs et on garde le dénominateur :</p><p class="calc">${F("a","d")} + ${F("b","d")} = ${F("a + b","d")}</p></div>
  ${co("somme","2 septièmes + 3 septièmes = 5 septièmes",320)}
  <p><b>Exemples :</b></p>${CALCS([[`${F(2,7)} + ${F(3,7)}`,F(5,7)],[`${F(9,5)} − ${F(4,5)}`,F(5,5),"1"]])}
  <p class="attention"><b>ATTENTION :</b> on n'additionne jamais les dénominateurs : ${F(2,7)} + ${F(3,7)} n'est pas égal à ${F(5,14)}.</p>
  <h4>2. Quand un dénominateur est un multiple de l'autre</h4>
  <p>Je commence par écrire les deux fractions avec le même dénominateur.</p>
  <p><b>Exemples :</b></p>${CALCS([[`${F(1,2)} + ${F(3,8)}`,`${F(4,8)} + ${F(3,8)}`,F(7,8)],[`${F(5,6)} − ${F(1,3)}`,`${F(5,6)} − ${F(2,6)}`,F(3,6),F(1,2)]])}
  <h4>3. Dénominateurs quelconques (cas simples)</h4>
  <p>Je cherche un dénominateur commun : un nombre qui est à la fois un multiple des deux dénominateurs (par exemple leur produit).</p>
  <p><b>Exemples :</b></p>${CALCS([[`${F(1,2)} + ${F(1,3)}`,`${F(3,6)} + ${F(2,6)}`,F(5,6)],[`${F(3,4)} − ${F(2,3)}`,`${F(9,12)} − ${F(8,12)}`,F(1,12)]])}
  <p><b>Avec un nombre entier :</b></p>${CHN([`2 + ${F(3,4)}`,`${F(8,4)} + ${F(3,4)}`,F(11,4)],0)}<p>On retrouve le nombre mixte du chapitre 3.</p>`},
{k:"IV", t:"Multiplier une fraction par un nombre entier", h:`
  <div class="retenir" data-l="Propriété"><p>Pour multiplier une fraction par un nombre entier, on multiplie le numérateur par ce nombre et on garde le dénominateur :</p><p class="calc">n × ${F("a","b")} = ${F("n × a","b")}</p></div>
  <p><b>Exemples :</b></p>${CALCS([[`3 × ${F(2,7)}`,F("3 × 2",7),F(6,7)],[`4 × ${F(3,4)}`,F("4 × 3",4),F(12,4),"3"]])}<p>3 × ${F(2,7)}, c'est ${F(2,7)} + ${F(2,7)} + ${F(2,7)}.</p>
  <p><b>Remarque :</b> on retrouve la définition du quotient : b × ${F("a","b")} = a.</p>`},
{k:"V", t:"Prendre une fraction d'une quantité", h:`
  <p>Prendre ${F(3,4)} de 20, c'est partager 20 en 4 parts égales et en prendre 3. On calcule ${F(3,4)} × 20.</p>
  ${co("part","20 jetons partagés en 4 groupes de 5 : on prend 3 groupes, 3 × 5 = 15 jetons",380)}
  <div class="retenir" data-l="Trois méthodes"><ol><li>Je divise d'abord, puis je multiplie : (20 ÷ 4) × 3 = 5 × 3 = 15 ;</li><li>ou je multiplie d'abord, puis je divise : (20 × 3) ÷ 4 = 60 ÷ 4 = 15 ;</li><li>ou je calcule le quotient, puis je multiplie : (3 ÷ 4) × 20 = 0,75 × 20 = 15.</li></ol></div>
  <p><b>Exemple :</b> un pull coûte 45 €. Pendant les soldes, on paie les ${F(4,5)} du prix : (45 ÷ 5) × 4 = 9 × 4 = 36. Le pull coûte 36 €.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"La fraction, un quotient", e:[
  {n:"Activité 1", t:"Deux façons de voir {3/2}", w:"Sur ta feuille", h:`${ex("act1","Deux pizzas partagées en 2 parts égales et une demi-droite graduée",490)}<p>1) Colorie ${F(3,2)} d'une pizza (les pizzas sont partagées en 2 parts égales).</p><p>2) Place le point A d'abscisse ${F(3,2)} sur la demi-droite graduée.</p><p>3) Quelle est l'écriture décimale de ${F(3,2)} ?</p>`,
   c:`<p>1) ${F(3,2)}, c'est 3 demi-pizzas : une pizza entière et la moitié de la deuxième.</p>${pizzas}<p>2) L'unité est partagée en 4 : une demi-unité vaut 2 graduations. ${F(3,2)} = 3 demis, soit 6 graduations après 0.</p>${axis({n:10, lab:[[0,"0"],[4,"1"],[8,"2"]], major:[0,4,8], pts:[["A",6]], w:440})}<p>3) ${F(3,2)} = 3 ÷ 2 = <b>1,5</b>.</p>`},
  {n:"Activité 2", t:"Les bonds de grenouille", w:"Sur ta feuille", h:`<p>Une grenouille traverse une mare en faisant des bonds de même longueur. Dans chaque cas, trouve la longueur exacte d'un bond en justifiant par un calcul.</p><p>a) 12 m en 4 bonds (4 × …… = 12) · b) 1 m en 4 bonds (4 × …… = 1) · c) 1 m en 6 bonds (6 × …… = 1) · d) 4 m en 3 bonds (3 × …… = 4)</p>`,
   c:`<p>a) 12 ÷ 4 = 3 : un bond mesure <b>3 m</b>.</p><p>b) 1 ÷ 4 = 0,25 : un bond mesure <b>0,25 m</b>.</p><p>c) 1 ÷ 6 = 0,1666… ne s'arrête pas : un bond mesure <b>${F(1,6)} m</b> (6 × ${F(1,6)} = 1).</p><p>d) 4 ÷ 3 = 1,333… ne s'arrête pas : un bond mesure <b>${F(4,3)} m</b> (3 × ${F(4,3)} = 4).</p>`},
  {n:"Exercice 1", t:"Des égalités à compléter", w:"Sur ta feuille", h:`<p>Complète par une fraction, puis par un nombre décimal quand c'est possible.</p><p>a) 7 × …… = 35 · b) 10 × …… = 1 · c) 3 × …… = 4 · d) 24 × …… = 5 · e) 9 × …… = 21 · f) 4 × …… = 10</p>`,
   c:`<p>a) 7 × ${F(35,7)} = 35, et ${F(35,7)} = <b>5</b>.</p><p>b) 10 × ${F(1,10)} = 1, et ${F(1,10)} = <b>0,1</b>.</p><p>c) 3 × ${F(4,3)} = 4 : pas d'écriture décimale (4 ÷ 3 = 1,333…).</p><p>d) 24 × ${F(5,24)} = 5 : pas d'écriture décimale (5 ÷ 24 = 0,208 33…).</p><p>e) 9 × ${F(21,9)} = 21 : pas d'écriture décimale (21 ÷ 9 = 2,333…).</p><p>f) 4 × ${F(10,4)} = 10, et ${F(10,4)} = <b>2,5</b>.</p>`},
  {n:"Exercice 2", t:"Calculer", w:"Sur ta feuille", h:`<p>Calcule.</p>${ENO([`4 × ${F(3,4)}`, `${F(2,5)} × 5`, `30 × ${F(29,30)}`, `${F(12,17)} × 17`])}`,
   c:`<p>On utilise la définition : b × ${F("a","b")} = a.</p>${CALCS([[`4 × ${F(3,4)}`,`<b>3</b>`],[`${F(2,5)} × 5`,`<b>2</b>`],[`30 × ${F(29,30)}`,`<b>29</b>`],[`${F(12,17)} × 17`,`<b>12</b>`]])}`},
  {n:"Exercice 3", t:"Compléter par un nombre décimal", w:"Sur ta feuille", h:`<p>a) 4 × …… = 7 · b) 5 × …… = 2 · c) 10 × …… = 7 · d) 5 × …… = 6</p>`,
   c:`<p>a) 7 ÷ 4 = <b>1,75</b> · b) 2 ÷ 5 = <b>0,4</b> · c) 7 ÷ 10 = <b>0,7</b> · d) 6 ÷ 5 = <b>1,2</b></p>`},
  {n:"Exercice 4", t:"Écriture décimale", w:"Sur ta feuille", h:`<p>Donne l'écriture décimale de chaque fraction. Si elle n'existe pas, donne une valeur approchée au centième.</p><p>a) ${F(7,2)} · b) ${F(3,4)} · c) ${F(9,5)} · d) ${F(1,8)} · e) ${F(2,3)} · f) ${F(10,7)}</p>`,
   c:`<p>a) ${F(7,2)} = 7 ÷ 2 = <b>3,5</b> · b) ${F(3,4)} = 3 ÷ 4 = <b>0,75</b> · c) ${F(9,5)} = 9 ÷ 5 = <b>1,8</b> · d) ${F(1,8)} = 1 ÷ 8 = <b>0,125</b></p><p>e) ${F(2,3)} = 2 ÷ 3 = 0,666… ≈ <b>0,67</b> · f) ${F(10,7)} = 10 ÷ 7 = 1,428… ≈ <b>1,43</b></p>`},
  {n:"Exercice 5", t:"Rappel — fractions égales", w:"Sur ta feuille", h:`<p>Complète.</p><p>${E5.map(([a,b,o,k,t],i)=>`${"abcdefghi"[i]}) ${F(a,b)} = ${o==="×"?F("……","……")+" = "+F("……",t):F("……","……")+" = "+F("……",t)}`).join(" &nbsp;·&nbsp; ")}</p>`,
   c:`<p>${E5.map(([a,b,o,k,t],i)=>`${"abcdefghi"[i]}) ${F(a,b)} = ${F(`${a} ${o} ${k}`,`${b} ${o} ${k}`)} = <b>${F(op(a,o,k),t)}</b>`).join(" &nbsp;·&nbsp; ")}</p>`}
 ]},
{t:"Comparer, encadrer et ranger", e:[
  {n:"Activité 3", t:"Qui est le plus gourmand ?", w:"Sur ta feuille", h:`<p>Mélina et Thomas ont commandé deux pizzas de même taille. Mélina : « J'ai coupé ma pizza en 4 parts égales et j'en ai mangé une. » Thomas : « Moi, je l'ai coupée en 8 parts égales et j'en ai mangé deux : j'ai mangé plus que toi ! »</p><p>Es-tu d'accord avec Thomas ? Explique à l'aide de fractions.</p>`,
   c:`<p>Mélina a mangé ${F(1,4)} de sa pizza, Thomas ${F(2,8)} de la sienne. Or ${F(1,4)} = ${F("1 × 2","4 × 2")} = ${F(2,8)}.</p><p><b>Non, Thomas a tort :</b> ils ont mangé exactement la même quantité. Ses parts sont deux fois plus petites.</p>`},
  {n:"Exercice 6", t:"Comparer", w:"Sur ta feuille", h:`<p>Complète par &lt;, &gt; ou =.</p><p>a) ${F(3,7)} … ${F(5,7)} · b) ${F(11,9)} … ${F(8,9)} · c) ${F(2,3)} … ${F(7,12)} · d) ${F(3,5)} … ${F(7,10)} · e) ${F(4,6)} … ${F(2,3)} · f) ${F(5,4)} … ${F(9,8)} · g) ${F(3,5)} … ${F(3,8)} · h) ${F(7,10)} … ${F(69,100)} · i) ${F(2,3)} … ${F(3,4)} · j) ${F(4,5)} … ${F(5,6)}</p>`,
   c:`<p>a) même dénominateur et 3 &lt; 5 : ${F(3,7)} <b>&lt;</b> ${F(5,7)} · b) même dénominateur et 11 &gt; 8 : ${F(11,9)} <b>&gt;</b> ${F(8,9)}</p><p>c) ${F(2,3)} = ${F(8,12)}, donc ${F(2,3)} <b>&gt;</b> ${F(7,12)} · d) ${F(3,5)} = ${F(6,10)}, donc ${F(3,5)} <b>&lt;</b> ${F(7,10)}</p><p>e) ${F(4,6)} = ${F(2,3)} : <b>=</b> · f) ${F(5,4)} = ${F(10,8)}, donc ${F(5,4)} <b>&gt;</b> ${F(9,8)}</p><p>g) même numérateur : ${F(3,5)} <b>&gt;</b> ${F(3,8)} · h) ${F(7,10)} = ${F(70,100)}, donc ${F(7,10)} <b>&gt;</b> ${F(69,100)}</p><p>i) ${F(2,3)} = ${F(8,12)} et ${F(3,4)} = ${F(9,12)} : ${F(2,3)} <b>&lt;</b> ${F(3,4)} · j) ${F(4,5)} = ${F(24,30)} et ${F(5,6)} = ${F(25,30)} : ${F(4,5)} <b>&lt;</b> ${F(5,6)}</p>`},
  {n:"Exercice 7", t:"Ranger", w:"Sur ta feuille", h:`<p>a) Range dans l'ordre croissant : ${F(5,9)} ; ${F(2,9)} ; ${F(8,9)} ; ${F(1,9)} ; ${F(9,9)}</p><p>b) Range dans l'ordre croissant : ${F(3,4)} ; ${F(5,8)} ; ${F(1,2)} ; ${F(7,8)}</p><p>c) Range dans l'ordre décroissant : ${F(2,3)} ; ${F(5,6)} ; ${F(7,12)} ; ${F(1,2)}</p>`,
   c:`<p>a) Même dénominateur : je range les numérateurs (1 &lt; 2 &lt; 5 &lt; 8 &lt; 9). ${F(1,9)} &lt; ${F(2,9)} &lt; ${F(5,9)} &lt; ${F(8,9)} &lt; ${F(9,9)}</p><p>b) Sur 8 : ${F(3,4)} = ${F(6,8)} et ${F(1,2)} = ${F(4,8)}. Donc ${F(1,2)} &lt; ${F(5,8)} &lt; ${F(3,4)} &lt; ${F(7,8)}.</p><p>c) Sur 12 : ${F(2,3)} = ${F(8,12)} ; ${F(5,6)} = ${F(10,12)} ; ${F(1,2)} = ${F(6,12)}. Donc ${F(5,6)} &gt; ${F(2,3)} &gt; ${F(7,12)} &gt; ${F(1,2)}.</p>`},
  {n:"Exercice 8", t:"Encadrer", w:"Sur ta feuille", h:`<p>1) Encadre chaque fraction par deux nombres entiers consécutifs : a) ${F(17,5)} · b) ${F(25,7)} · c) ${F(9,4)}</p><p>2) Encadre chaque fraction au dixième, à l'aide d'une division : a) ${F(17,6)} · b) ${F(5,3)} · c) ${F(22,7)}</p>`,
   c:`<p>1) a) 17 = 5 × 3 + 2 : <b>3 &lt; ${F(17,5)} &lt; 4</b> · b) 25 = 7 × 3 + 4 : <b>3 &lt; ${F(25,7)} &lt; 4</b> · c) 9 = 4 × 2 + 1 : <b>2 &lt; ${F(9,4)} &lt; 3</b></p><p>2) a) 17 ÷ 6 = 2,83… : <b>2,8 &lt; ${F(17,6)} &lt; 2,9</b> · b) 5 ÷ 3 = 1,66… : <b>1,6 &lt; ${F(5,3)} &lt; 1,7</b> · c) 22 ÷ 7 = 3,14… : <b>3,1 &lt; ${F(22,7)} &lt; 3,2</b></p>`},
  {n:"Exercice 9", t:"Les demi-pensionnaires", w:"Sur ta feuille", h:`<p>En 6e A, ${F(3,5)} des élèves sont demi-pensionnaires. En 6e B, ce sont ${F(7,10)} des élèves. Dans quelle classe la proportion de demi-pensionnaires est-elle la plus grande ? Justifie.</p>`,
   c:`<p>${F(3,5)} = ${F("3 × 2","5 × 2")} = ${F(6,10)}, et ${F(6,10)} &lt; ${F(7,10)}. La proportion est la plus grande en <b>6e B</b>.</p>`}
 ]},
{t:"Additionner et soustraire", e:[
  {n:"Exercice 10", t:"Même dénominateur", w:"Sur ta feuille", h:`<p>Calcule.</p>${ENO([`${F(3,5)} + ${F(1,5)}`, `${F(7,9)} − ${F(2,9)}`, `${F(5,11)} + ${F(6,11)}`, `${F(13,4)} − ${F(5,4)}`, `${F(2,7)} + ${F(3,7)} + ${F(1,7)}`, `${F(17,10)} − ${F(9,10)} − ${F(3,10)}`])}`,
   c:`<p>Même dénominateur : j'additionne (ou je soustrais) les numérateurs et je garde le dénominateur.</p>${CALCS([
     [`${F(3,5)} + ${F(1,5)}`, F("3 + 1",5), `<b>${F(4,5)}</b>`],
     [`${F(7,9)} − ${F(2,9)}`, F("7 − 2",9), `<b>${F(5,9)}</b>`],
     [`${F(5,11)} + ${F(6,11)}`, F("5 + 6",11), F(11,11), `<b>1</b>`],
     [`${F(13,4)} − ${F(5,4)}`, F("13 − 5",4), F(8,4), `<b>2</b>`],
     [`${F(2,7)} + ${F(3,7)} + ${F(1,7)}`, F("2 + 3 + 1",7), `<b>${F(6,7)}</b>`],
     [`${F(17,10)} − ${F(9,10)} − ${F(3,10)}`, F("17 − 9 − 3",10), F(5,10), `<b>${F(1,2)}</b>`]])}`},
  {n:"Exercice 11", t:"Un dénominateur multiple de l'autre", w:"Sur ta feuille", h:`<p>Calcule en détaillant les étapes.</p>${ENO([`${F(1,2)} + ${F(3,8)}`, `${F(2,3)} + ${F(1,6)}`, `${F(5,6)} − ${F(1,3)}`, `${F(7,10)} − ${F(1,5)}`, `${F(3,4)} + ${F(5,12)}`, `2 + ${F(3,4)}`, `3 − ${F(2,5)}`])}`,
   c:`<p>J'écris d'abord les deux fractions avec le même dénominateur.</p>${CALCS([
     [`${F(1,2)} + ${F(3,8)}`, `${F("1 × 4","2 × 4")} + ${F(3,8)}`, `${F(4,8)} + ${F(3,8)}`, `<b>${F(7,8)}</b>`],
     [`${F(2,3)} + ${F(1,6)}`, `${F("2 × 2","3 × 2")} + ${F(1,6)}`, `${F(4,6)} + ${F(1,6)}`, `<b>${F(5,6)}</b>`],
     [`${F(5,6)} − ${F(1,3)}`, `${F(5,6)} − ${F("1 × 2","3 × 2")}`, `${F(5,6)} − ${F(2,6)}`, F(3,6), `<b>${F(1,2)}</b>`],
     [`${F(7,10)} − ${F(1,5)}`, `${F(7,10)} − ${F("1 × 2","5 × 2")}`, `${F(7,10)} − ${F(2,10)}`, F(5,10), `<b>${F(1,2)}</b>`],
     [`${F(3,4)} + ${F(5,12)}`, `${F("3 × 3","4 × 3")} + ${F(5,12)}`, `${F(9,12)} + ${F(5,12)}`, F(14,12), `<b>${F(7,6)}</b>`],
     [`2 + ${F(3,4)}`, `${F(8,4)} + ${F(3,4)}`, `<b>${F(11,4)}</b>`],
     [`3 − ${F(2,5)}`, `${F(15,5)} − ${F(2,5)}`, `<b>${F(13,5)}</b>`]])}`},
  {n:"Exercice 12", t:"Dénominateurs quelconques", w:"Sur ta feuille", h:`<p>Trouve un dénominateur commun, puis calcule.</p>${ENO([`${F(1,2)} + ${F(1,3)}`, `${F(2,3)} + ${F(1,4)}`, `${F(3,4)} − ${F(2,3)}`, `${F(1,2)} − ${F(1,5)}`, `${F(2,5)} + ${F(1,3)}`, `${F(5,6)} − ${F(3,4)}`])}`,
   c:`<p>Dénominateurs communs : 6 pour A, 12 pour B, C et F, 10 pour D, 15 pour E.</p>${CALCS([
     [`${F(1,2)} + ${F(1,3)}`, `${F("1 × 3","2 × 3")} + ${F("1 × 2","3 × 2")}`, `${F(3,6)} + ${F(2,6)}`, `<b>${F(5,6)}</b>`],
     [`${F(2,3)} + ${F(1,4)}`, `${F("2 × 4","3 × 4")} + ${F("1 × 3","4 × 3")}`, `${F(8,12)} + ${F(3,12)}`, `<b>${F(11,12)}</b>`],
     [`${F(3,4)} − ${F(2,3)}`, `${F("3 × 3","4 × 3")} − ${F("2 × 4","3 × 4")}`, `${F(9,12)} − ${F(8,12)}`, `<b>${F(1,12)}</b>`],
     [`${F(1,2)} − ${F(1,5)}`, `${F("1 × 5","2 × 5")} − ${F("1 × 2","5 × 2")}`, `${F(5,10)} − ${F(2,10)}`, `<b>${F(3,10)}</b>`],
     [`${F(2,5)} + ${F(1,3)}`, `${F("2 × 3","5 × 3")} + ${F("1 × 5","3 × 5")}`, `${F(6,15)} + ${F(5,15)}`, `<b>${F(11,15)}</b>`],
     [`${F(5,6)} − ${F(3,4)}`, `${F("5 × 2","6 × 2")} − ${F("3 × 3","4 × 3")}`, `${F(10,12)} − ${F(9,12)}`, `<b>${F(1,12)}</b>`]])}`},
  {n:"Exercice 13", t:"Trouver l'erreur", w:"Sur ta feuille", h:`<p>Léo a écrit : ${F(2,5)} + ${F(1,5)} = ${F(3,10)}. Explique son erreur et corrige-la.</p>`,
   c:`<p>Léo a additionné les dénominateurs : c'est interdit. On additionne seulement les numérateurs et on garde le dénominateur : ${F(2,5)} + ${F(1,5)} = <b>${F(3,5)}</b>.</p><p><i>Vérification : 2 cinquièmes + 1 cinquième = 3 cinquièmes. Et ${F(3,10)} est même plus petit que ${F(2,5)} = ${F(4,10)} !</i></p>`},
  {n:"Exercice 14", t:"Des problèmes", w:"Sur ta feuille", h:`<p><b>Problème 1 :</b> Paul mange ${F(1,4)} d'un gâteau et Zoé en mange ${F(3,8)}. Quelle fraction du gâteau ont-ils mangée à eux deux ? Quelle fraction reste-t-il ?</p><p><b>Problème 2 :</b> un réservoir est rempli aux ${F(5,6)}. On utilise ${F(1,3)} du réservoir. Quelle fraction du réservoir est encore remplie ?</p>`,
   c:`<p><b>Problème 1 :</b> ${F(1,4)} + ${F(3,8)} = ${F(2,8)} + ${F(3,8)} = ${F(5,8)}. Ils ont mangé <b>${F(5,8)}</b> du gâteau. Il reste ${F(8,8)} − ${F(5,8)} = <b>${F(3,8)}</b>.</p><p><b>Problème 2 :</b> ${F(5,6)} − ${F(1,3)} = ${F(5,6)} − ${F(2,6)} = ${F(3,6)} = ${F(1,2)}. Le réservoir est encore rempli <b>à moitié</b> (${F(1,2)}).</p>`}
 ]},
{t:"Multiplier une fraction par un entier", e:[
  {n:"Exercice 15", t:"Calculer", w:"Sur ta feuille", h:`<p>Calcule.</p>${ENO([`3 × ${F(2,7)}`, `5 × ${F(4,9)}`, `${F(3,10)} × 4`, `6 × ${F(5,6)}`, `8 × ${F(3,4)}`, `7 × ${F(1,7)}`])}`,
   c:`<p>Je multiplie le numérateur par le nombre entier et je garde le dénominateur.</p>${CALCS([
     [`3 × ${F(2,7)}`, F("3 × 2",7), `<b>${F(6,7)}</b>`],
     [`5 × ${F(4,9)}`, F("5 × 4",9), `<b>${F(20,9)}</b>`],
     [`${F(3,10)} × 4`, F("3 × 4",10), F(12,10), `<b>${F(6,5)}</b> (= 1,2)`],
     [`6 × ${F(5,6)}`, F("6 × 5",6), F(30,6), `<b>5</b>`],
     [`8 × ${F(3,4)}`, F("8 × 3",4), F(24,4), `<b>6</b>`],
     [`7 × ${F(1,7)}`, F("7 × 1",7), F(7,7), `<b>1</b>`]])}`},
  {n:"Exercice 16", t:"Les bouteilles", w:"Sur ta feuille", h:`<p>Une bouteille contient ${F(3,4)} L de jus. Quelle quantité de jus contiennent 6 bouteilles ? Donne le résultat sous forme de fraction, puis en écriture décimale.</p>`,
   c:`<p>6 × ${F(3,4)} = ${F(18,4)} = ${F(9,2)} = 4,5. Les 6 bouteilles contiennent <b>${F(18,4)} L, soit 4,5 L</b> de jus.</p>`}
 ]},
{t:"Prendre une fraction d'une quantité", e:[
  {n:"Exercice 17", t:"Calcul mental", w:"Sur ta feuille", h:`<p>a) ${F(1,2)} de 30 · b) ${F(1,4)} de 20 · c) ${F(3,4)} de 20 · d) ${F(2,3)} de 15 · e) ${F(3,10)} de 50 · f) ${F(5,8)} de 40</p>`,
   c:`<p>a) 30 ÷ 2 = <b>15</b> · b) 20 ÷ 4 = <b>5</b> · c) (20 ÷ 4) × 3 = <b>15</b> · d) (15 ÷ 3) × 2 = <b>10</b> · e) (50 ÷ 10) × 3 = <b>15</b> · f) (40 ÷ 8) × 5 = <b>25</b></p>`},
  {n:"Exercice 18", t:"Des problèmes", w:"Sur ta feuille", h:`<p><b>Problème 1 :</b> dans une classe de 28 élèves, les ${F(3,4)} sont demi-pensionnaires. Combien d'élèves sont demi-pensionnaires ?</p><p><b>Problème 2 :</b> un jeu vidéo coûte 60 €. Pendant les soldes, on paie seulement les ${F(4,5)} du prix. Combien coûte le jeu ?</p><p><b>Problème 3 :</b> sur un trajet de 120 km, une famille a déjà parcouru les ${F(5,8)}. Combien de kilomètres lui reste-t-il à parcourir ?</p>`,
   c:`<p><b>Problème 1 :</b> (28 ÷ 4) × 3 = 7 × 3 = 21. <b>21 élèves</b> sont demi-pensionnaires.</p><p><b>Problème 2 :</b> (60 ÷ 5) × 4 = 12 × 4 = 48. Le jeu coûte <b>48 €</b>.</p><p><b>Problème 3 :</b> (120 ÷ 8) × 5 = 15 × 5 = 75 km déjà parcourus. Il reste 120 − 75 = <b>45 km</b>. <i>(Autre méthode : il reste ${F(3,8)} du trajet, (120 ÷ 8) × 3 = 45.)</i></p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"La fraction, un quotient", schema:S_Q, q:{
 1:[ {g:()=>{ const b=ri(2,12), a=ri(1,30); return {q:`Complète : ${b} × … = ${a}`, c:shuf(uniq(F(a,b),[F(b,a),F(a,b+1),F(a+b,b)])), rep:F(a,b), sx:S_Q}; }},
     {g:()=>{ const b=ri(3,15), a=ri(2,20); return {q:`Combien vaut ${b} × ${F(a,b)} ?`, rep:String(a), sx:S_Q}; }} ],
 2:[ {g:()=>{ const p=pick([[1,2,"0,5"],[3,4,"0,75"],[1,4,"0,25"],[1,5,"0,2"],[7,4,"1,75"],[9,5,"1,8"],[3,8,"0,375"],[7,2,"3,5"],[1,8,"0,125"],[11,4,"2,75"]]); return {q:`Écriture décimale de ${F(p[0],p[1])} ?`, rep:p[2], sx:S_Q}; }} ],
 3:[ {g:()=>{ const p=pick([[1,3],[2,3],[1,6],[4,3],[5,6],[1,7],[2,9]]); return {q:`${F(p[0],p[1])} a-t-elle une écriture décimale ?`, c:["Non","Oui"], rep:"Non", ex:`${p[0]} ÷ ${p[1]} ne s'arrête pas.`, sx:S_Q}; }},
     {g:()=>{ const b=pick([4,5,8,10]), a=ri(1,3*b); return {q:`Quel nombre décimal complète ${b} × … = ${a} ?`, rep:(()=>{ let s=(a/b).toFixed(3).replace(/0+$/,"").replace(/\.$/,""); return s.replace(".",","); })(), ex:`${a} ÷ ${b}.`, sx:S_Q}; }} ]
}},
{nom:"Comparer et ranger", schema:S_CMP, q:{
 1:[ {g:()=>{ const d=ri(5,12), a=ri(1,2*d), b=ri(1,2*d); if(a===b) return {q:`${F(a,d)} … ${F(b,d)}`, c:["=","&lt;","&gt;"], rep:"=", sx:S_CMP}; return {q:`Complète par &lt; ou &gt; : ${F(a,d)} … ${F(b,d)}`, c:["&lt;","&gt;"], rep:a<b?"&lt;":"&gt;", sx:S_CMP}; }} ],
 2:[ {g:()=>{ const d=pick([2,3,4,5]), k=pick([2,3,4]), a=ri(1,2*d), b=ri(1,2*d*k); const x=a*k; return {q:`Complète : ${F(a,d)} … ${F(b,d*k)}`, c:["&lt;","&gt;","="], rep:x<b?"&lt;":x>b?"&gt;":"=", ex:`${F(a,d)} = ${F(x,d*k)}.`, sx:S_CMP}; }} ],
 3:[ {g:()=>{ const n=ri(2,9), d1=ri(3,9); let d2; do{ d2=ri(3,9); }while(d2===d1); return {q:`Même numérateur : ${F(n,d1)} … ${F(n,d2)}`, c:["&lt;","&gt;"], rep:d1>d2?"&lt;":"&gt;", ex:"Le plus grand dénominateur donne les plus petites parts.", sx:S_CMP}; }},
     {g:()=>{ const b=ri(3,9); let a; do{ a=ri(b+1,6*b); }while(a%b===0); const q=Math.floor(a/b); return {q:`Encadre ${F(a,b)} par deux entiers consécutifs.`, c:shuf(uniq(`${q} et ${q+1}`,[`${q-1} et ${q}`,`${q+1} et ${q+2}`])), rep:`${q} et ${q+1}`, ex:`${a} = ${b} × ${q} + ${a-b*q}.`, sx:S_CMP}; }} ]
}},
{nom:"Additionner et soustraire", schema:S_ADD, q:{
 1:[ {g:()=>{ const d=ri(5,13), a=ri(1,d), b=ri(1,d); return {q:`${F(a,d)} + ${F(b,d)} = ?`, rep:[`${a+b}/${d}`, RS(a+b,d)], ex:`On garde le dénominateur : ${F(a+b,d)}.`, sx:S_ADD}; }} ],
 2:[ {g:()=>{ const d=pick([2,3,4,5]), k=pick([2,3]), a=ri(1,d), b=ri(1,d*k); return {q:`${F(a,d)} + ${F(b,d*k)} = ? (donne une fraction de dénominateur ${d*k})`, rep:[`${a*k+b}/${d*k}`, RS(a*k+b,d*k)], ex:`${F(a,d)} = ${F(a*k,d*k)}, puis ${F(a*k,d*k)} + ${F(b,d*k)} = ${F(a*k+b,d*k)}.`, sx:S_ADD}; }},
     {q:`${F(2,7)} + ${F(3,7)} = ${F(5,14)} ?`, c:VF, rep:"Faux", ex:`On n'additionne jamais les dénominateurs : c'est ${F(5,7)}.`, sx:S_ADD} ],
 3:[ {g:()=>{ const p=pick([[1,2,1,3],[2,3,1,4],[1,2,1,5],[2,5,1,3],[1,3,1,4],[3,4,1,5]]); const [a,b,c,d]=p, n=a*d+c*b, m=b*d; return {q:`${F(a,b)} + ${F(c,d)} = ?`, rep:[`${n}/${m}`, RS(n,m)], ex:`Sur ${m} : ${F(a*d,m)} + ${F(c*b,m)} = ${F(n,m)}.`, sx:S_ADD}; }},
     {g:()=>{ const e=ri(1,4), d=ri(2,7), a=ri(1,d-1); return {q:`${e} + ${F(a,d)} = ? (une seule fraction)`, rep:[`${e*d+a}/${d}`, RS(e*d+a,d)], ex:`${e} = ${F(e*d,d)}.`, sx:S_ADD}; }} ]
}},
{nom:"Multiplier par un entier", schema:S_MUL, q:{
 1:[ {g:()=>{ const n=ri(2,6), a=ri(1,5), b=ri(a+1,11); return {q:`${n} × ${F(a,b)} = ?`, rep:[`${n*a}/${b}`, RS(n*a,b)], sx:S_MUL}; }} ],
 2:[ {g:()=>{ const b=ri(2,9), a=ri(1,b-1), k=ri(2,5); return {q:`${b*k} × ${F(a,b)} = ? (un nombre entier)`, rep:String(k*a), ex:`${F(b*k*a,b)} = ${k*a}.`, sx:S_MUL}; }} ],
 3:[ {q:`${F(3,4)} L × 6 = ? (en L, écriture décimale)`, rep:"4,5", ex:`${F(18,4)} = 4,5.`, sx:S_MUL} ]
}},
{nom:"Fraction d'une quantité", schema:S_PART, q:{
 1:[ {g:()=>{ const b=pick([2,3,4,5,10]), k=ri(2,12); return {q:`${F(1,b)} de ${b*k} = ?`, rep:String(k), sx:S_PART}; }} ],
 2:[ {g:()=>{ const b=pick([3,4,5,6,8,10]), a=ri(2,b-1), k=ri(2,12); return {q:`${F(a,b)} de ${b*k} = ?`, rep:String(a*k), ex:`(${b*k} ÷ ${b}) × ${a} = ${k} × ${a} = ${a*k}.`, sx:S_PART}; }} ],
 3:[ {g:()=>{ const b=pick([4,5,8,10]), a=ri(1,b-1), k=ri(3,15), tot=b*k; return {q:`Sur ${tot} km, on a déjà parcouru les ${F(a,b)}. Combien de km reste-t-il ?`, rep:String(tot-a*k), ex:`Parcouru : (${tot} ÷ ${b}) × ${a} = ${a*k} km. Reste : ${tot} − ${a*k} = ${tot-a*k} km.`, sx:S_PART}; }} ]
}}
],
/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement — Chapitre 16", duree:30, info:"Durée : 30 min · Calculatrice non autorisée",
comp:[
  ["CALCULER","J'additionne et je soustrais des fractions.","Ex. 1 (3 points)"],
  ["MODÉLISER","Je prends une fraction d'une quantité.","Ex. 2 (3 points)"],
  ["REPRÉSENTER","Je comprends une fraction comme un quotient.","Ex. 3 (2 points)"],
  ["RAISONNER","Je compare et je range des fractions.","Ex. 4 (2 points)"]
],
exos:[
{t:"Additions et soustractions", p:3, h:`<p>Calcule en écrivant les étapes.</p>${ENO([`${F(9,11)} − ${F(4,11)}`, `${F(2,5)} + ${F(7,10)}`, `${F(7,9)} − ${F(2,3)}`])}`,
 c:`${CALCS([[`${F(9,11)} − ${F(4,11)}`,`${F("9 − 4",11)}`,`<b>${F(5,11)}</b>`],[`${F(2,5)} + ${F(7,10)}`,`${F("2 × 2","5 × 2")} + ${F(7,10)}`,`${F(4,10)} + ${F(7,10)}`,`<b>${F(11,10)}</b>`],[`${F(7,9)} − ${F(2,3)}`,`${F(7,9)} − ${F("2 × 3","3 × 3")}`,`${F(7,9)} − ${F(6,9)}`,`<b>${F(1,9)}</b>`]])}
  <p>Pour B et C, j'écris d'abord les deux fractions avec le même dénominateur (10 est un multiple de 5, 9 est un multiple de 3). <i>(1 point par calcul)</i></p>`},
{t:"Une fraction d'une quantité", p:3, h:`<p>a) Calcule ${F(2,3)} de 27 km.</p><p>b) Calcule ${F(5,6)} de 42 L.</p><p>c) Le réservoir d'une tondeuse peut contenir 60 L. Il est rempli aux ${F(3,4)}. Combien de litres faut-il encore verser pour le remplir complètement ?</p>`,
 c:`<p>a) (27 ÷ 3) × 2 = 9 × 2 = <b>18 km</b>. <i>(1 point)</i></p><p>b) (42 ÷ 6) × 5 = 7 × 5 = <b>35 L</b>. <i>(1 point)</i></p><p>c) Le réservoir contient ${F(3,4)} de 60 L : (60 ÷ 4) × 3 = 15 × 3 = 45 L. <i>(0,5 point)</i></p><p>60 − 45 = 15. <b>Il faut encore verser 15 L.</b> <i>(0,5 point)</i></p><p><i>Autre méthode : il manque ${F(1,4)} du réservoir, et ${F(1,4)} de 60 L = 60 ÷ 4 = 15 L.</i></p>`},
{t:"La fraction, un quotient", p:2, h:`<p>a) Complète par une fraction : 5 × …… = 4</p><p>b) Complète par une fraction : …… × 3 = 7</p><p>c) Donne l'écriture décimale de ${F(11,4)}.</p><p>d) Donne l'écriture décimale de ${F(3,20)}.</p>`,
 c:`<p>a) 5 × <b>${F(4,5)}</b> = 4 (c'est aussi 0,8). <i>(0,5 point)</i></p><p>b) <b>${F(7,3)}</b> × 3 = 7. <i>(0,5 point)</i></p><p>c) ${F(11,4)} = 11 ÷ 4 = <b>2,75</b>. <i>(0,5 point)</i></p><p>d) ${F(3,20)} = 3 ÷ 20 = <b>0,15</b>. <i>(0,5 point)</i></p>`},
{t:"Comparer et ranger", p:2, h:`<p>a) Range ces fractions dans l'ordre croissant. Explique ta méthode.</p><p class="calc">${F(5,6)} &nbsp;;&nbsp; ${F(7,12)} &nbsp;;&nbsp; ${F(2,3)} &nbsp;;&nbsp; ${F(1,4)}</p><p>b) ${F(9,8)} est-il plus grand ou plus petit que 1 ? Justifie.</p>`,
 c:`<p>a) J'écris toutes les fractions avec le dénominateur 12 :</p><p class="calc">${F(5,6)} = ${F("5 × 2","6 × 2")} = ${F(10,12)} &nbsp;;&nbsp; ${F(2,3)} = ${F("2 × 4","3 × 4")} = ${F(8,12)} &nbsp;;&nbsp; ${F(1,4)} = ${F("1 × 3","4 × 3")} = ${F(3,12)}</p><p>Je compare les numérateurs : 3 &lt; 7 &lt; 8 &lt; 10, donc <b>${F(1,4)} &lt; ${F(7,12)} &lt; ${F(2,3)} &lt; ${F(5,6)}</b>. <i>(1,5 point)</i></p>
  <p>b) 1 = ${F(8,8)} et 9 &gt; 8, donc <b>${F(9,8)} &gt; 1</b> (le numérateur est plus grand que le dénominateur). <i>(0,5 point)</i></p>`}
],
bep:{
titre:"Évaluation d'entraînement — Chapitre 16 · version aménagée", duree:30, info:"Version aménagée (tiers-temps) · Durée : 30 min · Calculatrice non autorisée",
note:"Le même sujet avec 3 questions en moins, à faire dans le même temps. Le total reste sur 10 points.",
comp:[
  ["CALCULER","J'additionne et je soustrais des fractions.","Ex. 1 (3 points)"],
  ["MODÉLISER","Je prends une fraction d'une quantité.","Ex. 2 (3 points)"],
  ["REPRÉSENTER","Je comprends une fraction comme un quotient.","Ex. 3 (1,5 point)"],
  ["RAISONNER","Je compare et je range des fractions.","Ex. 4 (2,5 points)"]
],
exos:[
{t:"Additions et soustractions", p:3, h:`<p>Calcule en écrivant les étapes.</p>${ENO([`${F(9,11)} − ${F(4,11)}`, `${F(2,5)} + ${F(7,10)}`])}`,
 c:`${CALCS([[`${F(9,11)} − ${F(4,11)}`,`${F("9 − 4",11)}`,`<b>${F(5,11)}</b>`],[`${F(2,5)} + ${F(7,10)}`,`${F("2 × 2","5 × 2")} + ${F(7,10)}`,`${F(4,10)} + ${F(7,10)}`,`<b>${F(11,10)}</b>`]])}
  <p>Pour B, j'écris d'abord les deux fractions avec le même dénominateur (10 est un multiple de 5). <i>(1,5 point par calcul)</i></p>`},
{t:"Une fraction d'une quantité", p:3, h:`<p>a) Calcule ${F(2,3)} de 27 km.</p><p>b) Le réservoir d'une tondeuse peut contenir 60 L. Il est rempli aux ${F(3,4)}. Combien de litres faut-il encore verser pour le remplir complètement ?</p>`,
 c:`<p>a) (27 ÷ 3) × 2 = 9 × 2 = <b>18 km</b>. <i>(1,5 point)</i></p><p>b) Le réservoir contient ${F(3,4)} de 60 L : (60 ÷ 4) × 3 = 15 × 3 = 45 L. <i>(1 point)</i></p><p>60 − 45 = 15. <b>Il faut encore verser 15 L.</b> <i>(0,5 point)</i></p><p><i>Autre méthode : il manque ${F(1,4)} du réservoir, et ${F(1,4)} de 60 L = 60 ÷ 4 = 15 L.</i></p>`},
{t:"La fraction, un quotient", p:1.5, h:`<p>a) Complète par une fraction : 5 × …… = 4</p><p>b) Complète par une fraction : …… × 3 = 7</p><p>c) Donne l'écriture décimale de ${F(11,4)}.</p>`,
 c:`<p>a) 5 × <b>${F(4,5)}</b> = 4 (c'est aussi 0,8). <i>(0,5 point)</i></p><p>b) <b>${F(7,3)}</b> × 3 = 7. <i>(0,5 point)</i></p><p>c) ${F(11,4)} = 11 ÷ 4 = <b>2,75</b>. <i>(0,5 point)</i></p>`},
{t:"Comparer et ranger", p:2.5, h:`<p>a) Range ces fractions dans l'ordre croissant. Explique ta méthode.</p><p class="calc">${F(5,6)} &nbsp;;&nbsp; ${F(7,12)} &nbsp;;&nbsp; ${F(2,3)} &nbsp;;&nbsp; ${F(1,4)}</p><p>b) ${F(9,8)} est-il plus grand ou plus petit que 1 ? Justifie.</p>`,
 c:`<p>a) J'écris toutes les fractions avec le dénominateur 12 :</p><p class="calc">${F(5,6)} = ${F("5 × 2","6 × 2")} = ${F(10,12)} &nbsp;;&nbsp; ${F(2,3)} = ${F("2 × 4","3 × 4")} = ${F(8,12)} &nbsp;;&nbsp; ${F(1,4)} = ${F("1 × 3","4 × 3")} = ${F(3,12)}</p><p>Je compare les numérateurs : 3 &lt; 7 &lt; 8 &lt; 10, donc <b>${F(1,4)} &lt; ${F(7,12)} &lt; ${F(2,3)} &lt; ${F(5,6)}</b>. <i>(2 points : 1 pour les fractions de dénominateur 12, 1 pour le rangement)</i></p>
  <p>b) 1 = ${F(8,8)} et 9 &gt; 8, donc <b>${F(9,8)} &gt; 1</b> (le numérateur est plus grand que le dénominateur). <i>(0,5 point)</i></p>`}
]}
}
};
})();
