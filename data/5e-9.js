/* 5e — Chapitre 9 : Opérations sur les nombres relatifs (cours et fiche d'exercices de M. Staal)
   Les droites graduées réutilisent les outils du chapitre 5 (window.REL, data/5e-5.js). */
(function(){
const VF=["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const {F, Fs, dg, cols} = window.REL;
const RED="#d0342c", BLUE="#1e5aa8";
const r3=x=>Math.round(x*1000)/1000;
const P=x=>`(${Fs(x)})`;                                   /* (−4) · (+3) · (0) */
const R=x=>Fs(r3(x));                                        /* résultat avec son signe : +13 · −11 · 0 */
const suite=a=>a.map((x,i)=>i===0?F(x):(x<0?" − ":" + ")+F(Math.abs(x))).join("");   /* −3 + 5 − 8 + 2 */
const sgn=x=>x>0?"+":"−";
/* droite graduée qui montre une addition : on part de a et on avance (ou on recule) de b */
function dAdd(a,b,w=440){ const s=r3(a+b), lo=Math.floor(Math.min(a,s,0))-1, hi=Math.ceil(Math.max(a,s,0))+1, span=hi-lo;
  const step=span<=14?1:span<=30?2:5, lab=span<=14?1:span<=30?2:5, L=Math.floor(lo/lab)*lab, H=Math.ceil(hi/lab)*lab;
  return dg({w, min:L, max:H, step, lab, dots:[[a,RED]], arcs:[[a,s,Fs(b),BLUE]], alt:`On part de ${F(a)} et on ${b>=0?"avance":"recule"} de ${F(Math.abs(b))}`}); }
/* explication d'une addition de deux relatifs */
function addEx(a,b){ const s=r3(a+b), A=Math.abs(a), B=Math.abs(b);
  if(a===0||b===0) return `Ajouter 0 ne change rien : ${P(a)} + ${P(b)} = ${R(s)}.`;
  if((a>0)===(b>0)) return `Même signe : on garde le signe commun (${sgn(a)}) et on additionne les valeurs absolues : ${F(A)} + ${F(B)} = ${F(A+B)}.`;
  if(r3(A)===r3(B)) return `Les deux nombres sont opposés : leur somme est 0.`;
  const g=A>B?a:b; return `Signes contraires : on soustrait les valeurs absolues (${F(Math.max(A,B))} − ${F(Math.min(A,B))} = ${F(r3(Math.abs(A-B)))}) et on garde le signe de ${F(g)}, qui a la plus grande valeur absolue.`; }
/* justification courte d'une addition de deux relatifs, entre parenthèses */
function addWhy(a,b){ const A=Math.abs(a), B=Math.abs(b);
  if(a===0||b===0) return "(ajouter 0 ne change rien)";
  if((a>0)===(b>0)) return `(${F(A)} + ${F(B)} = ${F(r3(A+B))} ; signe ${sgn(a)})`;
  if(r3(A)===r3(B)) return "(nombres opposés)";
  return `(${F(Math.max(A,B))} − ${F(Math.min(A,B))} = ${F(r3(Math.abs(A-B)))} ; signe de ${Fs(A>B?a:b)})`; }
/* calcul nommé : une étape par ligne, chaque ligne commence par « A = » */
const NL=(n,ch)=>`<p class="calc">${n} = ${ch.split(" = ").join(`<br>${n} = `)}</p>`;
/* même chose, précédé d'un repère a), b)… et suivi d'une petite justification en italique */
const NLl=(lab,n,ch,why)=>NL(n,ch).replace('<p class="calc">',`<p class="calc">${lab?lab+") ":""}`)+(why?`<p><i>${why}</i></p>`:"");
/* addition de deux relatifs, nommée : « a) A = (−4) + (−3) » puis « A = −7 (4 + 3 = 7 ; signe −) » */
const addL=(lab,n,a,b)=>NLl(lab,n,`${P(a)} + ${P(b)} = <b>${R(a+b)}</b>`,addWhy(a,b));
/* suite d'additions et de soustractions : on regroupe les positifs et les négatifs */
const grp=a=>a.length>1?`(${a.map(F).join(" + ")})`:F(a[0]);
const grpC=t=>{ const pos=t.filter(x=>x>0), neg=t.filter(x=>x<0).map(x=>-x), ps=r3(pos.reduce((a,b)=>a+b,0)), ns=r3(neg.reduce((a,b)=>a+b,0)), s=r3(ps-ns);
  if(!pos.length||!neg.length) return `${suite(t)} = ${F(s)}`;
  return `${suite(t)} = ${grp(pos)} − ${grp(neg)}${pos.length>1||neg.length>1?` = ${F(ps)} − ${F(ns)}`:""} = ${F(s)}`; };
window.REL9={P, R, suite, dAdd, addEx, sgn, addWhy, NL, NLl, addL, grpC};

/* ===================== schémas ===================== */
const S_MEME=sch("Deux nombres de même signe", `${NL("A","(−4) + (−3) = −7")}<p class="schN">On garde le signe commun (−) et on additionne les valeurs absolues : 4 + 3 = 7.</p>`);
const S_CONT=sch("Deux nombres de signes contraires", dAdd(3,-7,400)+`${NL("A","(+3) + (−7) = −4")}<p class="schN">On soustrait les valeurs absolues : 7 − 3 = 4. On garde le signe de −7, qui a la plus grande valeur absolue.</p>`);
const S_SOUS=sch("Soustraire, c'est ajouter l'opposé", `${NL("A","(+5) − (+8) = (+5) + (−8) = −3")}${NL("B","(−3) − (−7) = (−3) + (+7) = +4")}<p class="schN">On change la soustraction en addition et on remplace le nombre par son opposé.</p>`);
const S_PAR=sch("Supprimer les parenthèses", `${NL("A","(+5) + (−3) − (−2) = 5 − 3 + 2 = 4")}<p class="schN">+ (+b) devient + b ; + (−b) devient − b ; − (+b) devient − b ; − (−b) devient + b. Puis on regroupe les positifs et les négatifs.</p>`);
const S_PB=sch("Résoudre un problème", `<p class="calc">−7 + 5 − 9 = −2 − 9 = −11</p><p class="schN">Une augmentation s'ajoute. Une baisse se soustrait.</p>`);

/* figures du cours */
const D_ADD1=dg({w:480, min:-5, max:5, dots:[[-2,RED]], arcs:[[-2,3,"+5",BLUE]], alt:"(−2) + (+5) = +3 : on part de −2 et on avance de 5"});
const D_ADD2=dg({w:480, min:-5, max:5, dots:[[3,RED]], arcs:[[3,-4,"−7",BLUE]], alt:"(+3) + (−7) = −4 : on part de 3 et on recule de 7"});

/* tableaux de la fiche */
const ACT=[[1,0,6],[2,6,-9],[3,-3,-4],[4,-7,10]];
const actTab=c=>`<div class="scroll"><table class="std"><thead><tr><th>Manche</th><th>Score avant</th><th>Variation</th><th>Calcul</th><th>Score après</th></tr></thead><tbody>${ACT.map(([m,a,v])=>`<tr><td>${m}</td><td>${F(a)}</td><td>${Fs(v)}</td><td>${c?`(${a===0?"0":Fs(a)}) + ${P(v)} = ${R(a+v)}`:""}</td><td>${c?F(a+v):""}</td></tr>`).join("")}</tbody></table></div>`;
const E3=[[-12,5],[8,-3],[-7,7],[-0.5,-4],[15,-21],[-9,20]];
const e3Tab=c=>`<div class="scroll"><table class="std"><thead><tr><th>Somme</th><th>positive</th><th>négative</th><th>nulle</th></tr></thead><tbody>${E3.map(([a,b])=>{ const s=r3(a+b), k=s>0?0:s<0?1:2; return `<tr><td>${P(a)} + ${P(b)}</td>${[0,1,2].map(j=>`<td>${c?(j===k?"☒":"☐"):"☐"}</td>`).join("")}</tr>`; }).join("")}</tbody></table></div>`;
const E5=[[7,10],[-4,-9],[3,-5],[-6,2],[-2.5,1.5],[1.2,-0.8]];
const e5Tab=c=>`<div class="scroll"><table class="std"><thead><tr><th>Soustraction</th><th>Addition</th><th>Résultat</th></tr></thead><tbody>${E5.map(([a,b])=>`<tr><td>${P(a)} − ${P(b)}</td><td>${c?`${P(a)} + ${P(-b)}`:""}</td><td>${c?R(a-b):""}</td></tr>`).join("")}</tbody></table></div>`;
const carre=g=>`<table class="std" style="width:auto;justify-self:start;text-align:center"><tbody>${g.map(r=>`<tr>${r.map(x=>`<td style="width:58px;height:46px;text-align:center;font-weight:700">${x===null?"":F(x)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;

CH["5e-9"] = {
intro:"Additionner deux nombres relatifs, soustraire un nombre relatif en ajoutant son opposé, supprimer les parenthèses, calculer une suite d'additions et de soustractions, et résoudre des problèmes avec des nombres relatifs.",
savoir:[
  "additionner deux nombres relatifs ;",
  "soustraire un nombre relatif en ajoutant son opposé ;",
  "supprimer les parenthèses et simplifier l'écriture d'une somme ;",
  "calculer une suite d'additions et de soustractions de nombres relatifs ;",
  "résoudre un problème avec des nombres relatifs."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Additionner des nombres relatifs", h:`
  <h4>1. Rappels</h4>
  <div class="retenir" data-l="Rappels"><p>Deux nombres relatifs sont <b>opposés</b> quand ils ont la même valeur absolue et des signes différents : leur somme est égale à 0.</p><p>L'opposé de +3 est −3 ; l'opposé de −2,5 est +2,5.</p><p>La <b>valeur absolue</b> d'un nombre est sa distance à zéro : |−4| = 4 et |+4| = 4.</p></div>
  <h4>2. Additionner deux nombres de même signe</h4>
  <div class="retenir" data-l="Règle"><p>Pour additionner deux nombres relatifs de <b>même signe</b>, on garde le signe commun et on additionne les valeurs absolues.</p></div>
  <p><b>Exemples :</b></p><div class="calcs"><div>${NL("A","(−4) + (−3) = −7")}<p>4 + 3 = 7 et le signe commun est −.</p></div><div>${NL("B","(+2,5) + (+1,5) = +4")}<p>2,5 + 1,5 = 4 et le signe commun est +.</p></div></div>
  <h4>3. Additionner deux nombres de signes contraires</h4>
  <div class="retenir" data-l="Règle"><p>Pour additionner deux nombres relatifs de <b>signes contraires</b>, on garde le signe de celui qui a la plus grande valeur absolue et on <b>soustrait</b> les valeurs absolues (la plus petite à la plus grande).</p></div>
  <p><b>Exemples :</b></p><div class="calcs"><div>${NL("C","(−7) + (+4) = −3")}<p>7 − 4 = 3 et |−7| &gt; |+4| : le signe est −.</p></div><div>${NL("D","(+9) + (−12) = −3")}<p>12 − 9 = 3 et |−12| &gt; |+9| : le signe est −.</p></div><div>${NL("E","(−2,5) + (+2,5) = 0")}<p>Ces deux nombres sont opposés.</p></div></div>
  <p>Sur une droite graduée :</p><ul><li>additionner un nombre positif fait <b>avancer vers la droite</b> ;</li><li>additionner un nombre négatif fait <b>reculer vers la gauche</b>.</li></ul>
  <div class="figs"><figure>${D_ADD1}<figcaption>(−2) + (+5) = +3</figcaption></figure><figure>${D_ADD2}<figcaption>(+3) + (−7) = −4</figcaption></figure></div>
  <div class="retenir" data-l="Méthode"><p>Pour additionner deux nombres relatifs :</p><p><b>1)</b> je regarde les signes des deux nombres ;</p><p><b>2)</b> si les signes sont identiques, j'additionne les valeurs absolues et je garde le signe commun ;</p><p><b>3)</b> si les signes sont différents, je soustrais les valeurs absolues et je garde le signe du nombre qui a la plus grande valeur absolue.</p></div>`},
{k:"II", t:"Soustraire un nombre relatif", h:`
  <div class="retenir" data-l="Règle"><p><b>Soustraire</b> un nombre relatif, c'est <b>ajouter son opposé</b>.</p><p class="calc"><i>a</i> − <i>b</i> = <i>a</i> + (−<i>b</i>)</p></div>
  <p><b>Exemples :</b></p>
  <div class="calcs"><div>${NL("A","(+5) − (+8) = (+5) + (−8) = −3")}</div><div>${NL("B","(−3) − (−7) = (−3) + (+7) = +4")}</div><div>${NL("C","(+2) − (−6) = (+2) + (+6) = +8")}</div></div>
  <p><b>À toi de jouer :</b> calcule D = (−6) − (+2) et E = (+1,5) − (−2,5) en les transformant d'abord en additions.</p>
  <details><summary>Voir la correction</summary><div class="corr"><div class="calcs"><div>${NL("D","(−6) − (+2) = (−6) + (−2) = −8")}</div><div>${NL("E","(+1,5) − (−2,5) = (+1,5) + (+2,5) = +4")}</div></div></div></details>`},
{k:"III", t:"Enchaîner des calculs et simplifier l'écriture", h:`
  <h4>1. Supprimer les parenthèses</h4>
  <div class="retenir" data-l="Propriétés"><p>Additionner un nombre, c'est écrire son signe devant lui.</p><p>Soustraire un nombre, c'est écrire le signe contraire devant lui.</p>
  <p class="calc"><i>a</i> + (+<i>b</i>) = <i>a</i> + <i>b</i><br><i>a</i> + (−<i>b</i>) = <i>a</i> − <i>b</i><br><i>a</i> − (+<i>b</i>) = <i>a</i> − <i>b</i><br><i>a</i> − (−<i>b</i>) = <i>a</i> + <i>b</i></p></div>
  <p><b>Exemples :</b></p><div class="calcs"><div>${NL("A","(+5) + (−3) − (−2) = 5 − 3 + 2 = 4")}</div><div>${NL("B","(−4) − (+6) + (−1) = −4 − 6 − 1 = −11")}</div></div>
  <div class="attention"><b>ATTENTION :</b> on n'écrit jamais deux signes l'un à côté de l'autre : « 5 + −3 » est faux. On met des parenthèses : 5 + (−3). Les parenthèses sont indispensables autour d'un nombre négatif qui n'est pas au début du calcul.</div>
  <h4>2. Calculer une suite d'additions et de soustractions</h4>
  <p>Une écriture comme −3 + 5 − 8 + 2 est la somme des nombres −3, +5, −8 et +2.</p>
  <div class="retenir" data-l="Méthode"><p>On peut effectuer une suite d'additions et de soustractions dans l'ordre que l'on veut.</p><p>On regroupe les nombres positifs d'un côté, les nombres négatifs de l'autre.</p></div>
  <p><b>Exemple :</b></p>${NL("C","−3 + 5 − 8 + 2 = (5 + 2) + (−3 − 8) = 7 − 11 = −4")}
  <h4>3. Résoudre un problème</h4>
  <div class="retenir" data-l="À retenir"><p>Pour les températures, les altitudes, les soldes de compte ou les scores :</p><ul><li>une <b>augmentation</b> s'ajoute (nombre positif) ;</li><li>une <b>baisse</b> se soustrait, ou s'ajoute avec un nombre négatif.</li></ul></div>
  <p><b>Exemple :</b> il fait −7 °C le matin. La température monte de 5 °C, puis baisse de 9 °C.</p><p class="calc">Température finale : −7 + 5 − 9 = −2 − 9 = −11 °C</p>
  <p><b>À toi de jouer :</b> calcule D = −4 + 9 − 7.</p>
  <details><summary>Voir la correction</summary><div class="corr">${NL("D","−4 + 9 − 7 = 5 − 7 = −2")}</div></details>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Additionner des nombres relatifs", e:[
  {n:"Activité 1", t:"Le jeu des gains et des pertes", w:"Sur ta feuille", h:`<p>Mia joue à un jeu. Elle commence avec un score de 0 point.</p><p>À chaque manche, elle gagne des points (nombre positif) ou elle en perd (nombre négatif).</p><p>Complète le tableau.</p>${actTab(false)}
   <p><b>1)</b> Quelle règle permet de trouver le score après la manche 2 ?</p><p><b>2)</b> Quel est le score final de Mia ?</p>`,
   c:`${actTab(true)}<p><b>1)</b> Les nombres de la manche 2 sont de signes contraires : on soustrait les valeurs absolues (9 − 6 = 3) et on garde le signe de celui qui a la plus grande valeur absolue (−9) : (+6) + (−9) = −3.</p><p><b>2)</b> Le score final de Mia est de <b>+3 points</b>.</p>`},
  {n:"Exercice 1", t:"Même signe", w:"Sur ton cahier", h:`<p>Calcule.</p>${cols(["a) A = (+4) + (+9)","b) B = (−6) + (−5)","c) C = (−3,5) + (−2)","d) D = (+7,2) + (+0,8)","e) E = (−12) + (−18)","f) F = (−0,4) + (−0,9)"])}`,
   c:`<p>On garde le signe commun et on additionne les valeurs absolues.</p><div class="calcs">${[[4,9],[-6,-5],[-3.5,-2],[7.2,0.8],[-12,-18],[-0.4,-0.9]].map(([a,b],i)=>`<div>${addL("abcdef"[i],"ABCDEF"[i],a,b)}</div>`).join("")}</div>`},
  {n:"Exercice 2", t:"Signes contraires", w:"Sur ton cahier", h:`<p>Calcule.</p>${cols(["a) A = (−7) + (+4)","b) B = (+9) + (−12)","c) C = (−15) + (+15)","d) D = (+6,5) + (−2,5)","e) E = (−8) + (+10)","f) F = (−1,2) + (+0,7)","g) G = (+3) + (−3,8)","h) H = (−20) + (+13)"])}`,
   c:`<p>On soustrait les valeurs absolues et on garde le signe du nombre qui a la plus grande valeur absolue.</p><div class="calcs">${[[-7,4],[9,-12],[-15,15],[6.5,-2.5],[-8,10],[-1.2,0.7],[3,-3.8],[-20,13]].map(([a,b],i)=>`<div>${addL("abcdefgh"[i],"ABCDEFGH"[i],a,b)}</div>`).join("")}</div>`},
  {n:"Exercice 3", t:"Le signe du résultat", w:"Sur ta feuille", h:`<p>Sans calculer, donne le signe de chaque somme : coche la bonne case.</p>${e3Tab(false)}`,
   c:`${e3Tab(true)}<p>On compare les valeurs absolues : le résultat a le signe du nombre qui a la plus grande valeur absolue.</p><p>Il vaut 0 si les nombres sont opposés.</p>`},
  {n:"Exercice 4", t:"Additions à trous", w:"Sur ta feuille", h:`<p>Complète par le nombre relatif qui convient.</p>${cols(["a) (−3) + (……) = +4","b) (+5) + (……) = −2","c) (……) + (−4) = −10","d) (……) + (+6) = 0","e) (−2,5) + (……) = −4","f) (……) + (+3,5) = +1"])}`,
   c:`<p>On peut s'aider d'une droite graduée : de combien faut-il avancer (+) ou reculer (−) ?</p><p>a) (−3) + (<b>+7</b>) = +4 &nbsp; <i>(de −3 à +4, on avance de 7)</i></p><p>b) (+5) + (<b>−7</b>) = −2 &nbsp; <i>(de +5 à −2, on recule de 7)</i></p><p>c) (<b>−6</b>) + (−4) = −10 &nbsp; <i>(6 + 4 = 10 et le signe est −)</i></p><p>d) (<b>−6</b>) + (+6) = 0 &nbsp; <i>(deux nombres opposés ont une somme nulle)</i></p><p>e) (−2,5) + (<b>−1,5</b>) = −4 &nbsp; <i>(de −2,5 à −4, on recule de 1,5)</i></p><p>f) (<b>−2,5</b>) + (+3,5) = +1 &nbsp; <i>(on recule de 3,5 depuis +1 : on arrive à −2,5)</i></p>`}
 ]},
{t:"Soustraire un nombre relatif", e:[
  {n:"Exercice 5", t:"Soustraire, c'est ajouter l'opposé", w:"Sur ta feuille", h:`<p>Transforme chaque soustraction en addition, puis calcule.</p>${e5Tab(false)}`,
   c:`${e5Tab(true)}<p>On remplace « − (nombre) » par « + (son opposé) ».</p>`},
  {n:"Exercice 6", t:"Calculer un écart", w:"Sur ton cahier", h:`<p>Pour chaque situation, écris la soustraction qui permet de trouver l'écart, puis calcule.</p>
   <p><b>a)</b> À 6 h, il fait −4 °C. À 14 h, il fait +9 °C. De combien la température a-t-elle augmenté ?</p><p><b>b)</b> Un ascenseur est au niveau −2 (parking). Il monte jusqu'au niveau +6. Combien d'étages a-t-il montés ?</p><p><b>c)</b> Le sommet du mont Blanc est à +4 800 m d'altitude et le bord de la mer Morte à −430 m. Quelle est la différence d'altitude ?</p>`,
   c:`<p><b>a)</b> (+9) − (−4) = (+9) + (+4) = +13 : la température a augmenté de <b>13 °C</b>.</p><p><b>b)</b> (+6) − (−2) = (+6) + (+2) = +8 : l'ascenseur a monté <b>8 étages</b>.</p><p><b>c)</b> (+4 800) − (−430) = 4 800 + 430 = 5 230 : la différence d'altitude est de <b>5 230 m</b>.</p>`}
 ]},
{t:"Enchaîner des calculs et simplifier l'écriture", e:[
  {n:"Exercice 7", t:"Supprimer les parenthèses", w:"Sur ton cahier", h:`<p>Écris chaque expression sans parenthèses, puis calcule.</p>${cols(["A = (+5) + (−3) − (−2)","B = (−4) − (+6) + (−1)","C = (−7) − (−7) + (+2)","D = (+2,5) − (−1,5) − (+6)"])}`,
   c:`<p>+ (+b) devient + b ; + (−b) devient − b ; − (+b) devient − b ; − (−b) devient + b.</p><div class="calcs"><div>${NL("A","(+5) + (−3) − (−2) = 5 − 3 + 2 = <b>4</b>")}</div><div>${NL("B","(−4) − (+6) + (−1) = −4 − 6 − 1 = <b>−11</b>")}</div><div>${NL("C","(−7) − (−7) + (+2) = −7 + 7 + 2 = <b>2</b>")}</div><div>${NL("D","(+2,5) − (−1,5) − (+6) = 2,5 + 1,5 − 6 = <b>−2</b>")}</div></div>`},
  {n:"Exercice 8", t:"Suites d'additions et de soustractions", w:"Sur ton cahier", h:`<p>Calcule en regroupant astucieusement les nombres.</p>${cols(["F = −3 + 5 − 8 + 2","G = 12 − 15 + 7 − 9","H = −2,5 + 4 − 1,5 + 3","I = −10 + 4 − 6 + 8 − 2","J = 7,5 − 10 + 2,5 − 4","K = −0,8 − 1,2 + 3 − 1"])}`,
   c:`<p>On regroupe les nombres positifs d'un côté, les nombres négatifs de l'autre.</p><div class="calcs"><div>${NL("F","−3 + 5 − 8 + 2 = (5 + 2) − (3 + 8) = 7 − 11 = <b>−4</b>")}</div><div>${NL("G","12 − 15 + 7 − 9 = (12 + 7) − (15 + 9) = 19 − 24 = <b>−5</b>")}</div><div>${NL("H","−2,5 + 4 − 1,5 + 3 = (4 + 3) − (2,5 + 1,5) = 7 − 4 = <b>3</b>")}</div><div>${NL("I","−10 + 4 − 6 + 8 − 2 = (4 + 8) − (10 + 6 + 2) = 12 − 18 = <b>−6</b>")}</div><div>${NL("J","7,5 − 10 + 2,5 − 4 = (7,5 + 2,5) − (10 + 4) = 10 − 14 = <b>−4</b>")}</div><div>${NL("K","−0,8 − 1,2 + 3 − 1 = 3 − (0,8 + 1,2 + 1) = 3 − 3 = <b>0</b>")}</div></div>`},
  {n:"Exercice 9", t:"Trouver l'erreur", w:"Sur ton cahier", h:`<p>Chaque élève a fait une erreur. Explique laquelle et donne le bon résultat.</p><p><b>1)</b> Léa a écrit : −5 + 3 = −8.</p><p><b>2)</b> Karim a écrit : (+4) − (+6) = +2.</p><p><b>3)</b> Inès a écrit : 7 − (−2) = 5.</p>`,
   c:`<p><b>1)</b> Léa a additionné les valeurs absolues alors que les signes sont contraires. On soustrait 5 − 3 = 2 et on garde le signe de −5.</p>${NL("A","−5 + 3 = <b>−2</b>")}<p><b>2)</b> Karim a oublié que soustraire +6, c'est ajouter −6. On soustrait 6 − 4 = 2 et on garde le signe −.</p>${NL("B","(+4) − (+6) = (+4) + (−6) = <b>−2</b>")}<p><b>3)</b> Inès n'a pas ajouté l'opposé de −2.</p>${NL("C","7 − (−2) = 7 + 2 = <b>9</b>")}`},
  {n:"Exercice 10", t:"Problèmes", w:"Sur ton cahier", h:`<p>Écris le calcul, puis réponds.</p><p><b>1)</b> Au début du mois, le compte de M. Durand affiche −45 €. Il reçoit 120 €, puis il paie une facture de 38,50 €, puis une facture de 62 €. Quel est son solde à la fin ?</p><p><b>2)</b> À Chamonix, il fait −7 °C à 6 h. À midi, la température a monté de 12 °C. Le soir, elle a baissé de 15 °C par rapport à midi. Quelle est la température le soir ?</p>`,
   c:`<p><b>1)</b></p><p class="calc">−45 + 120 − 38,50 − 62 = 75 − 38,50 − 62 = 36,50 − 62 = −25,50</p><p>Le solde est de <b>−25,50 €</b>.</p><p><b>2)</b></p><p class="calc">−7 + 12 − 15 = 5 − 15 = −10</p><p>La température le soir est de <b>−10 °C</b>.</p>`},
  {n:"Exercice 11", t:"Carré magique", w:"Sur ta feuille", h:`<p>Complète ce carré magique : la somme de chaque ligne, de chaque colonne et de chaque diagonale doit être égale à 0.</p>${carre([[3,null,1],[null,0,null],[-1,null,-3]])}`,
   c:`${carre([[3,-4,1],[-2,0,2],[-1,4,-3]])}<p>Ligne 1 : 3 + … + 1 = 0, donc −4.</p><p>Colonne 1 : 3 + … + (−1) = 0, donc −2.</p><p>Colonne 3 : 1 + … + (−3) = 0, donc +2.</p><p>Ligne 3 : −1 + … + (−3) = 0, donc +4.</p><p><b>Vérification :</b> ligne 2 : −2 + 0 + 2 = 0 ; colonne 2 : −4 + 0 + 4 = 0 ; diagonales : 3 + 0 − 3 = 0 et 1 + 0 − 1 = 0.</p>`},
  {n:"Exercice 12", t:"Pour aller plus loin : calcul astucieux", w:"Sur ton cahier", h:`<p>Calcule le plus intelligemment possible.</p><p><b>a)</b> A = (−5) + (−4) + (−3) + (−2) + (−1) + 0 + 1 + 2 + 3 + 4 + 5</p><p><b>b)</b> B = −10 + 9 − 8 + 7 − 6 + 5 − 4 + 3 − 2 + 1</p>`,
   c:`<p><b>a)</b> On associe chaque nombre à son opposé : (−5) + 5 = 0, (−4) + 4 = 0, …</p>${NL("A","(−5) + (−4) + (−3) + (−2) + (−1) + 0 + 1 + 2 + 3 + 4 + 5 = <b>0</b>")}<p><b>b)</b> On regroupe par deux :</p>${NL("B","−10 + 9 − 8 + 7 − 6 + 5 − 4 + 3 − 2 + 1 = (−10 + 9) + (−8 + 7) + (−6 + 5) + (−4 + 3) + (−2 + 1) = 5 × (−1) = <b>−5</b>")}`}
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
  ["CALCULER","J'additionne et je soustrais des nombres relatifs ; je supprime les parenthèses et je calcule une suite d'additions et de soustractions.",[1,2,3,4]],
  ["RAISONNER","Je repère une erreur de calcul et je la corrige en expliquant la règle.",[5]],
  ["CHERCHER","Je résous un problème avec des nombres relatifs.",[6]]
];
const L = (b, list) => list.filter(q=>!(b && q.rm));
const AB = "ABCDEFGH", ab = "abcdefgh";
const TEMP = [["Lundi",-6,3],["Mardi",-9,-1],["Mercredi",-2.5,4.5],["Jeudi",-12,-2]];
const TAB = `<div class="scroll"><table class="std"><thead><tr><th>Jour</th>${TEMP.map(t=>`<th>${t[0]}</th>`).join("")}</tr></thead><tbody>
  <tr><th>Température minimale (°C)</th>${TEMP.map(t=>`<td>${Fs(t[1])}</td>`).join("")}</tr>
  <tr><th>Température maximale (°C)</th>${TEMP.map(t=>`<td>${Fs(t[2])}</td>`).join("")}</tr></tbody></table></div>`;
const ecart = ([j,mi,ma]) => `<p class="calc">${j} : ${P(ma)} − ${P(mi)} = ${P(ma)} + ${P(-mi)} = ${R(ma-mi)}</p>`;
const mk = b => {
  /* Ex 1 */
  const A1 = L(b, [[6,-11],[-8,-9],[-4.5,4.5],[3.2,-0.7],[-15,23],[-2.6,-1.4,1]].map(([x,y,r])=>({x,y,rm:!!r})));
  /* Ex 2 */
  const A2 = L(b, [[-3,9],[7,-5],[-10,-4],[1.5,4],[-0.8,-2.3,1],[0,-7]].map(([x,y,r])=>({x,y,rm:!!r})));
  const P0 = x => x===0 ? "0" : P(x);
  /* Ex 3 */
  const A3 = L(b, [
    {h:`(−5) + (……) = +3`, c:`(−5) + (<b>+8</b>) = +3 &nbsp; <i>(de −5 à +3, on avance de 8)</i>`},
    {h:`(+4) + (……) = −6`, c:`(+4) + (<b>−10</b>) = −6 &nbsp; <i>(de +4 à −6, on recule de 10)</i>`},
    {h:`(……) + (−7) = −2`, c:`(<b>+5</b>) + (−7) = −2 &nbsp; <i>(7 − 5 = 2 et le signe est celui de −7)</i>`},
    {h:`(−9) − (……) = −1`, c:`(−9) − (<b>−8</b>) = (−9) + (+8) = −1 &nbsp; <i>(soustraire −8, c'est ajouter +8)</i>`, rm:true}
  ]);
  const p1=0.5, p3=0.5;
  /* Ex 4 */
  const A4 = L(b, [
    {n:"A", h:`8 − 13 + 6 − 4`, ch:grpC([8,-13,6,-4]), p:1, pb:2},
    {n:"B", h:`(−6) + (+10) − (+3) − (−5)`, ch:`(−6) + (+10) − (+3) − (−5) = `+grpC([-6,10,-3,5]), p:1.5, pb:2},
    {n:"C", h:`−2,5 − 4 + 7,5 − 1`, ch:grpC([-2.5,-4,7.5,-1]), p:1.5, rm:true}
  ]);
  /* Ex 5 */
  const A5 = [
    {h:`Tom a écrit : (−9) + (+4) = −13.`, c:`<p>Tom a additionné les valeurs absolues alors que les signes sont <b>contraires</b>.</p><p>On soustrait les valeurs absolues (9 − 4 = 5) et on garde le signe de −9, qui a la plus grande valeur absolue.</p>${NL("A","(−9) + (+4) = <b>−5</b>")}`},
    {h:`Sarah a écrit : (−3) − (−8) = −11.`, c:`<p>Sarah a oublié que soustraire un nombre, c'est <b>ajouter son opposé</b> : soustraire −8, c'est ajouter +8.</p>${NL("B","(−3) − (−8) = (−3) + (+8) = <b>+5</b>")}`}
  ];
  const p5 = b ? 1.5 : 1;
  /* Ex 6 */
  const A6 = L(b, [
    {h:`Calcule l'écart de température de lundi.`, p:1, pb:1.5,
     c:`<p>Écart = température maximale − température minimale.</p>${ecart(TEMP[0])}<p>Lundi, l'écart de température est de <b>9 °C</b>.`},
    {h:`Calcule l'écart de température de mardi, de mercredi et de jeudi.`, p:3, pb:3,
     c:`${TEMP.slice(1).map(ecart).join("")}<p>Les écarts sont de <b>8 °C</b> mardi, <b>7 °C</b> mercredi et <b>10 °C</b> jeudi. <i>(1 point par jour)</i></p>`},
    {h:`Quel jour l'écart de température a-t-il été le plus grand ?`, p:0.5, rm:true,
     c:`<p>10 &gt; 9 &gt; 8 &gt; 7 : c'est <b>jeudi</b> (10 °C).`},
    {h:`Vendredi, la température minimale est de −7&nbsp;°C et l'écart de température est de 13&nbsp;°C. Quelle est la température maximale ? Justifie.`, p:1.5, pb:2,
     c:`<p>La température maximale est 13 °C au-dessus de la température minimale : on ajoute 13.</p><p class="calc">−7 + 13 = +6</p><p>Vendredi, la température maximale est de <b>+6 °C</b>.`}
  ]);
  const wr = (q,i,f,p) => { const c=q.c.startsWith("<p>") ? `<p>${f(i)} `+q.c.slice(3) : `<p>${f(i)}</p>`+q.c; return (c.endsWith("</p>") ? c.slice(0,-4) : c)+pt(p)+"</p>"; };
  const num = i => (i+1)+".", lab = i => ab[i]+")";
  const X = [
    {t:"Additionner des nombres relatifs", p:A1.length*p1,
     h:`<p>Calcule.</p>${cols(A1.map((q,i)=>`${lab(i)} ${AB[i]} = ${P(q.x)} + ${P(q.y)}`))}`,
     c:`<p>Même signe : je garde le signe commun et j'additionne les valeurs absolues.</p><p>Signes contraires : je soustrais les valeurs absolues et je garde le signe de celui qui a la plus grande valeur absolue.</p><div class="calcs">${A1.map((q,i)=>`<div>${addL(ab[i],AB[i],q.x,q.y)}</div>`).join("")}</div><p><i>0,5 point par calcul.</i></p>`},
    {t:"Soustraire un nombre relatif", p:A2.length*0.5,
     h:`<p>Transforme chaque soustraction en addition, puis calcule.</p>${cols(A2.map((q,i)=>`${lab(i)} ${AB[i]} = ${P0(q.x)} − ${P(q.y)}`))}`,
     c:`<p>Soustraire un nombre, c'est ajouter son opposé.</p><div class="calcs">${A2.map((q,i)=>`<div>${NL(AB[i],`${P0(q.x)} − ${P(q.y)} = ${P0(q.x)} + ${P(-q.y)} = <b>${R(q.x-q.y)}</b>`).replace('<p class="calc">',`<p class="calc">${ab[i]}) `)}</div>`).join("")}</div><p><i>0,5 point par calcul.</i></p>`},
    {t:"Additions à trous", p:A3.length*p3,
     h:`<p>Complète par le nombre relatif qui convient.</p>${cols(A3.map((q,i)=>`${lab(i)} ${q.h}`))}`,
     c:A3.map((q,i)=>`<p>${lab(i)} ${q.c}</p>`).join("")+`<p><i>0,5 point par réponse.</i></p>`},
    {t:"Enchaîner des calculs", p:A4.reduce((a,q)=>a+(b?q.pb:q.p),0),
     h:`<p>Supprime les parenthèses si besoin, puis calcule en regroupant les nombres positifs et les nombres négatifs.</p>${cols(A4.map(q=>`${q.n} = ${q.h}`))}`,
     c:`<p>Je regroupe les nombres positifs d'un côté et les nombres négatifs de l'autre.</p>`+A4.map(q=>NL(q.n,q.ch).replace(/<\/p>$/,pt(b?q.pb:q.p)+"</p>")).join("")},
    {t:"Trouver l'erreur", p:A5.length*p5,
     h:`<p>Chaque élève a fait une erreur. Explique laquelle, puis écris le bon calcul.</p>${A5.map((q,i)=>`<p>${num(i)} ${q.h}</p>`).join("")}`,
     c:A5.map((q,i)=>wr(q,i,num,p5)).join("")},
    {t:"Problème : les températures de la station", p:A6.reduce((a,q)=>a+(b?q.pb:q.p),0),
     h:`<p>Dans une station de ski, on a relevé les températures minimale et maximale de chaque journée.</p>${TAB}<p>L'<b>écart de température</b> d'une journée, c'est la température maximale moins la température minimale.</p>${A6.map((q,i)=>`<p>${num(i)} ${q.h}</p>`).join("")}`,
     c:A6.map((q,i)=>wr(q,i,num,b?q.pb:q.p)).join("")}
  ];
  return {X, comp:COMP.map(([k,t,ids])=>[k,t,exl(X,ids)])};
};
const N = mk(false), B = mk(true);
return {
titre:"Évaluation d'entraînement — Chapitre 9", duree:45, info:"Durée : 45 min · Calculatrice non autorisée",
comp:N.comp, exos:N.X,
bep:{
titre:"Évaluation d'entraînement — Chapitre 9 · version aménagée", duree:45, info:"Version aménagée · Durée : 45 min · Calculatrice non autorisée",
note:"Les mêmes exercices avec cinq questions en moins, dans le même temps (45 min). Le barème est recalculé pour rester sur 20. Les justifications sont toujours demandées.",
comp:B.comp, exos:B.X }
};
})(),
/* ÉVAL-5b fin */
/* ===================== QCM ===================== */
quiz:[
{nom:"Additionner deux nombres de même signe", schema:S_MEME, q:{
 1:[ {g:()=>{ const s=pick([1,-1]), a=s*ri(1,15), b=s*ri(1,15); return {q:`Calcule A = ${P(a)} + ${P(b)}.`, rep:F(a+b), ex:addEx(a,b), sx:NL("A",`${P(a)} + ${P(b)} = ${R(a+b)}`)+dAdd(a,b,400)}; }},
     {q:"Pour additionner deux nombres de même signe, on…", c:["garde le signe commun et on additionne les valeurs absolues","garde le signe commun et on soustrait les valeurs absolues","change le signe et on additionne les valeurs absolues"], rep:"garde le signe commun et on additionne les valeurs absolues", sx:S_MEME} ],
 2:[ {g:()=>{ const a=-ri(11,99)/10, b=-ri(1,9)*pick([1,0.1]); return {q:`Calcule A = ${P(a)} + ${P(r3(b))}.`, rep:F(r3(a+b)), ex:addEx(a,r3(b)), sx:NL("A",`${P(a)} + ${P(r3(b))} = ${R(a+b)}`)+S_MEME}; }} ],
 3:[ {g:()=>{ const a=-ri(11,99)/10, b=-ri(11,99)/10; return {q:`Calcule A = ${P(a)} + ${P(b)}.`, rep:F(r3(a+b)), ex:addEx(a,b), sx:NL("A",`${P(a)} + ${P(b)} = ${R(a+b)}`)+S_MEME}; }},
     {g:()=>{ const a=-ri(10,40), b=-ri(10,40), c=-ri(2,20); return {q:`Calcule A = ${P(a)} + ${P(b)} + ${P(c)}.`, rep:F(a+b+c), ex:`Tous les nombres sont négatifs : ${-a} + ${-b} + ${-c} = ${-(a+b+c)}, et le signe est −.`, sx:NL("A",`${P(a)} + ${P(b)} + ${P(c)} = ${R(a+b)} + ${P(c)} = ${R(a+b+c)}`)+S_MEME}; }} ]
}},
{nom:"Additionner deux nombres de signes contraires", schema:S_CONT, q:{
 1:[ {g:()=>{ let a,b; do{ a=ri(1,20)*pick([1,-1]); b=-Math.sign(a)*ri(1,20); }while(Math.abs(a)===Math.abs(b)); const s=a+b; return {q:`Sans calculer : la somme ${P(a)} + ${P(b)} est…`, c:["positive","négative","nulle"], rep:s>0?"positive":s<0?"négative":"nulle", ex:`${Math.abs(a)>Math.abs(b)?F(a):F(b)} a la plus grande valeur absolue : la somme a son signe.`, sx:dAdd(a,b,400)}; }},
     {g:()=>{ const a=ri(1,9)*pick([1,-1]), b=-Math.sign(a)*ri(1,12); return {q:`Calcule A = ${P(a)} + ${P(b)}.`, rep:F(a+b), ex:addEx(a,b), sx:NL("A",`${P(a)} + ${P(b)} = ${R(a+b)}`)+dAdd(a,b,400)}; }} ],
 2:[ {g:()=>{ let a,b; do{ a=ri(5,40)*pick([1,-1]); b=-Math.sign(a)*ri(5,40); }while(a===-b); return {q:`Calcule A = ${P(a)} + ${P(b)}.`, rep:F(a+b), ex:addEx(a,b), sx:NL("A",`${P(a)} + ${P(b)} = ${R(a+b)}`)+S_CONT}; }},
     {g:()=>{ const a=ri(2,15)*pick([1,-1]); return {q:`Calcule A = ${P(a)} + ${P(-a)}.`, rep:"0", ex:"Ces deux nombres sont opposés : leur somme est 0.", sx:NL("A",`${P(a)} + ${P(-a)} = 0`)+S_CONT}; }} ],
 3:[ {g:()=>{ let a,b; do{ a=r3(ri(1,99)/10*pick([1,-1])); b=r3(-Math.sign(a)*ri(1,99)/10); }while(a===-b); return {q:`Calcule A = ${P(a)} + ${P(b)}.`, rep:F(r3(a+b)), ex:addEx(a,b), sx:NL("A",`${P(a)} + ${P(b)} = ${R(a+b)}`)+S_CONT}; }},
     {g:()=>{ let a,s; do{ a=ri(-12,12); s=ri(-12,12); }while(!a||a===s||s===0); const x=s-a; return {q:`Complète : ${P(a)} + (……) = ${R(s)}`, rep:[F(x),Fs(x)], ex:`On cherche le nombre à ajouter à ${F(a)} pour obtenir ${F(s)} : ${P(a)} + ${P(x)} = ${R(s)}.`, sx:dAdd(a,x,400)}; }} ]
}},
{nom:"Soustraire un nombre relatif", schema:S_SOUS, q:{
 1:[ {q:"Soustraire un nombre relatif, c'est…", c:["ajouter son opposé","soustraire son opposé","ajouter sa valeur absolue"], rep:"ajouter son opposé", sx:S_SOUS},
     {g:()=>{ const a=ri(1,12)*pick([1,-1]), b=ri(1,12)*pick([1,-1]); return {q:`Quelle addition est égale à ${P(a)} − ${P(b)} ?`, c:uniq(`${P(a)} + ${P(-b)}`,[`${P(a)} + ${P(b)}`,`${P(-a)} + ${P(b)}`,`${P(-a)} + ${P(-b)}`]).slice(0,3), rep:`${P(a)} + ${P(-b)}`, ex:`On ajoute l'opposé de ${F(b)}, c'est-à-dire ${F(-b)}.`, sx:S_SOUS}; }} ],
 2:[ {g:()=>{ const a=ri(1,15)*pick([1,-1]), b=ri(1,15)*pick([1,-1]); return {q:`Calcule A = ${P(a)} − ${P(b)}.`, rep:F(a-b), ex:`On ajoute l'opposé de ${F(b)}.`, sx:NL("A",`${P(a)} − ${P(b)} = ${P(a)} + ${P(-b)} = ${R(a-b)}`)+S_SOUS}; }} ],
 3:[ {g:()=>{ const a=r3(ri(1,99)/10*pick([1,-1])), b=r3(ri(1,99)/10*pick([1,-1])); return {q:`Calcule A = ${P(a)} − ${P(b)}.`, rep:F(r3(a-b)), ex:`On ajoute l'opposé de ${F(b)}.`, sx:NL("A",`${P(a)} − ${P(b)} = ${P(a)} + ${P(-b)} = ${R(a-b)}`)+S_SOUS}; }},
     {g:()=>{ const m=-ri(2,12), s=ri(3,18); return {q:`À 6 h, il fait ${F(m)} °C. À 14 h, il fait +${s} °C. De combien de degrés la température a-t-elle augmenté ?`, rep:[String(s-m), String(s-m)+" °C"], ex:`(+${s}) − ${P(m)} = (+${s}) + (+${-m}) = +${s-m}.`, sx:S_SOUS}; }} ]
}},
{nom:"Parenthèses et suites de calculs", schema:S_PAR, q:{
 1:[ {g:()=>{ const a=ri(1,9), b=ri(1,9), c=ri(1,9); const good=`${a} − ${b} + ${c}`; return {q:`Écris sans parenthèses : (+${a}) + (−${b}) − (−${c})`, c:shuf(uniq(good,[`${a} + ${b} − ${c}`,`${a} − ${b} − ${c}`,`${a} + ${b} + ${c}`]).slice(0,3)), rep:good, ex:"+ (−b) devient − b ; − (−c) devient + c.", sx:S_PAR}; }},
     {q:"Quelle écriture est correcte ?", c:["5 + (−3)","5 + −3","5 − + 3"], rep:"5 + (−3)", ex:"On n'écrit jamais deux signes l'un à côté de l'autre : on met des parenthèses.", sx:S_PAR} ],
 2:[ {g:()=>{ const t=[ri(1,15)*pick([1,-1]), ...Array.from({length:3},()=>ri(1,15)*pick([1,-1]))]; const s=t.reduce((x,y)=>x+y,0), pos=t.filter(x=>x>0), neg=t.filter(x=>x<0);
       return {q:`Calcule A = ${suite(t)}.`, rep:F(s), sx:NL("A",grpC(t))+S_PAR, ex:"On regroupe les positifs et les négatifs."}; }} ],
 3:[ {g:()=>{ const t=Array.from({length:5},()=>r3(ri(1,40)/(pick([1,2])===1?1:2))*pick([1,-1])); const s=r3(t.reduce((x,y)=>x+y,0)), ps=r3(t.filter(x=>x>0).reduce((x,y)=>x+y,0)), ns=r3(-t.filter(x=>x<0).reduce((x,y)=>x+y,0));
       return {q:`Calcule A = ${suite(t)}.`, rep:F(s), ex:`On regroupe les positifs et les négatifs.`, sx:NL("A",grpC(t))+S_PAR}; }},
     {g:()=>{ const a=ri(2,9), b=ri(1,a-1); return {q:`Léa a écrit : −${a} + ${b} = −${a+b}. Quel est le bon résultat ?`, rep:F(b-a), ex:`Signes contraires : on soustrait ${a} − ${b} = ${a-b} et on garde le signe de −${a}.`, sx:NL("A",`−${a} + ${b} = ${F(b-a)}`)+S_PAR}; }} ]
}},
{nom:"Résoudre un problème", schema:S_PB, q:{
 1:[ {g:()=>{ const t=-ri(2,12), m=ri(3,15); return {q:`Il fait ${F(t)} °C. La température monte de ${m} °C. Quelle est la nouvelle température (en °C) ?`, rep:[F(t+m),F(t+m)+" °C"], ex:`${F(t)} + ${m} = ${F(t+m)}.`, sx:dAdd(t,m,400)}; }} ],
 2:[ {g:()=>{ const s=-ri(2,20)*5, r=ri(4,30)*5, d=ri(2,25)*5; return {q:`Un compte affiche ${F(s)} €. On reçoit ${r} €, puis on paie ${d} €. Quel est le solde (en €) ?`, rep:[F(s+r-d),F(s+r-d)+" €"], ex:`${F(s)} + ${r} − ${d} = ${F(s+r)} − ${d} = ${F(s+r-d)}.`, sx:S_PB}; }} ],
 3:[ {g:()=>{ const t=-ri(2,10), m=ri(4,15), b=ri(5,20); return {q:`Il fait ${F(t)} °C à 6 h. À midi, la température a monté de ${m} °C. Le soir, elle a baissé de ${b} °C par rapport à midi. Quelle est la température le soir (en °C) ?`, rep:[F(t+m-b),F(t+m-b)+" °C"], ex:`${F(t)} + ${m} − ${b} = ${F(t+m)} − ${b} = ${F(t+m-b)}.`, sx:S_PB}; }},
     {g:()=>{ const n=ri(4,9); const terms=[]; for(let k=2*n;k>=1;k--) terms.push(k%2===0?-k:k); return {q:`Calcule astucieusement A = ${suite(terms)}.`, rep:F(-n), ex:`On regroupe par deux.`, sx:NL("A",`${suite(terms)} = (−${2*n} + ${2*n-1}) + … + (−2 + 1) = ${n} × (−1) = −${n}`)+S_PAR}; }} ]
}}
]
};

/* clavier texte pour toutes les réponses tapées (pour pouvoir écrire le signe −) */
CH["5e-9"].quiz.forEach(N=>Object.values(N.q).forEach(list=>list.forEach((it,i)=>{
  if(it.g){ const g=it.g; list[i]={g:()=>Object.assign(g(),{kb:"text"})}; } else it.kb="text";
})));
})();
