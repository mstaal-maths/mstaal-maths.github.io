/* 4e — Chapitre 4 : Nombres relatifs : division et enchaînements d'opérations
   Cours, feuille d'exercices et activités (cerceaux, fête foraine, compte bancaire) de M. Staal.
   La feuille n'a pas de corrigé : toutes les corrections ont été calculées et vérifiées.
   Bulles et grille de nombres croisés sont dessinées en SVG / HTML ; le labyrinthe est l'image de la feuille. */
(function(){
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const r3=x=>Math.round(x*1000)/1000;
const F=x=>{ const r=r3(x); const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const P=x=>r3(x)<0?`(${F(x)})`:F(x);          /* parenthèses si négatif : 6 × (−4) */
const cols=arr=>`<div class="calcs">${arr.map(x=>`<span${x.replace(/<[^>]+>/g,"").length>30?' style="white-space:normal"':""}>${x}</span>`).join("")}</div>`;
const ex=(p,alt,w)=>img("4k4ex/"+p,alt,w);
const tabH=(head,rows)=>`<div class="scroll"><table class="std"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const nz=(a,b)=>{ let v; do{ v=ri(a,b); }while(!v); return v; };
const nNeg=a=>a.filter(x=>x<0).length;
const prod=a=>r3(a.reduce((x,y)=>x*y,1));
const prodTxt=a=>a.map((v,i)=>i===0?F(v):P(v)).join(" × ");
/* calculs en chaîne « A = … » (outils définis dans 4e-1.js) */
const {chn,chns,qChain}=window.CHN4;
const simpW=arr=>arr.map((x,i)=>i?(x<0?"− ":"+ ")+F(Math.abs(x)):F(x)).join(" ");

/* ------------------------------------------------------------------
   Jeu des bulles : 6 nombres autour d'un cercle, le nombre à trouver au centre
------------------------------------------------------------------ */
function bulles(nums, cible){
  const cx=170, cy=150, R=112;
  let s=`<svg class="fig" viewBox="0 0 340 300" width="340" role="img" aria-label="Jeu des bulles : ${nums.map(F).join(", ")} ; le nombre à trouver est ${F(cible)}">`;
  s+=`<circle cx="${cx}" cy="${cy}" r="${R}" class="thin"/><circle cx="${cx}" cy="${cy}" r="56" style="fill:var(--paper);stroke:#2e9e4a;stroke-width:2.4"/>`;
  s+=`<text x="${cx}" y="${cy-14}" text-anchor="middle" style="font-size:14px;fill:var(--ink)">Le nombre</text><text x="${cx}" y="${cy+4}" text-anchor="middle" style="font-size:14px;fill:var(--ink)">à trouver</text><text x="${cx}" y="${cy+24}" text-anchor="middle" style="font-size:15px;font-weight:700;fill:var(--ink)">est ${F(cible)}.</text>`;
  nums.forEach((v,i)=>{ const a=(-90+60*i)*Math.PI/180, x=cx+R*Math.cos(a), y=cy+R*Math.sin(a);
    s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="22" style="fill:var(--paper);stroke:#d0342c;stroke-width:2.4"/><text x="${x.toFixed(1)}" y="${(y+6).toFixed(1)}" text-anchor="middle" style="font-size:17px;font-weight:700;fill:#d0342c">${F(v)}</text>`; });
  return s+"</svg>";
}

/* ------------------------------------------------------------------
   Grille de nombres croisés : null = case noire ; show : écrit les réponses
------------------------------------------------------------------ */
const GR=[["−1","0","0",null,"−3"],["2","1",null,"−3","9"],[null,"3","6",null,"6"],["5",null,"5","4",null],[null,"−1","4",null,"−8"]];
const grille=show=>`<div class="scroll"><table class="std" style="width:auto"><thead><tr><th></th>${[1,2,3,4,5].map(c=>`<th style="text-align:center">${c}</th>`).join("")}</tr></thead><tbody>${GR.map((r,i)=>`<tr><th>${"ABCDE"[i]}</th>${r.map(v=>v===null?`<td style="width:46px;height:42px;background:#222"></td>`:`<td style="width:46px;height:42px;text-align:center;font-weight:700;color:var(--c)">${show?v:""}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;

/* outils réutilisés par la fiche d'entraînement */
window.REL4B={F,P,cols,tabH,bulles,nNeg,prod,prodTxt,prioQ:l=>prioQ(l)};

/* ===================== schémas (rappels) ===================== */
const S_DIV=sch("Diviser deux nombres relatifs",`<p class="calc">{−20/−4} = 5 &nbsp; <span style="color:var(--muted)">même signe : positif</span></p><p class="calc">36 ÷ (−3) = −12 &nbsp; <span style="color:var(--muted)">signes différents : négatif</span></p>`);
const S_MUL=sch("Signe d'un produit de plusieurs facteurs",`${chn("A",["(−2) × 3 × (−4) × (−3)","−72"])}<p class="schN">3 facteurs négatifs (nombre impair) : le résultat est négatif. Un nombre pair de facteurs négatifs : positif.</p>`);
const S_ADD=sch("Suite d'additions",`${chn("D",["−5 + 3 − 13 + 9","3 + 9 − 5 − 13","12 − 18","−6"])}<p class="schN">On regroupe les nombres positifs d'un côté, les nombres négatifs de l'autre.</p>`);
const S_PRIO=sch("Priorités opératoires",`<p class="schN">1. parenthèses et crochets (les plus intérieurs d'abord) · 2. × et ÷ · 3. + et −</p>${chn("F",["13 + 5 × (3 − 11) − 7","13 + 5 × (−8) − 7","13 − 40 − 7","−34"])}`);

/* ---------- générateurs de calculs avec priorités (étapes exactes) ---------- */
function prioQ(level){
  const t = level===1 ? pick([0,1,2]) : level===2 ? pick([3,4,5]) : pick([6,7]);
  if(t===0){ const a=nz(-20,20), b=ri(2,9), c=nz(-9,9); return {e:`${F(a)} + ${F(b)} × ${P(c)}`, st:[`${F(a)} + ${P(b*c)}`], v:a+b*c}; }
  if(t===1){ const b=nz(-9,9), c=nz(-9,9), a=nz(-20,20); return {e:`${F(b)} × ${P(c)} ${a<0?"−":"+"} ${Math.abs(a)}`, st:[`${F(b*c)} ${a<0?"−":"+"} ${Math.abs(a)}`], v:b*c+a}; }
  if(t===2){ const q=nz(-9,9), d=nz(-6,6), c=ri(1,15); return {e:`${F(q*d)} ÷ ${P(d)} − ${c}`, st:[`${F(q)} − ${c}`], v:q-c}; }
  if(t===3){ const a=nz(-6,6), b=nz(-9,9), c=ri(1,12); return {e:`${F(a)} × (${F(b)} − ${c})`, st:[`${F(a)} × ${P(b-c)}`], v:a*(b-c)}; }
  if(t===4){ const a=ri(1,12), b=ri(2,9), c=ri(1,9), d=ri(1,9); return {e:`${a} + (${c} − ${b} × ${d})`, st:[`${a} + (${c} − ${b*d})`, `${a} + ${P(c-b*d)}`], v:a+c-b*d}; }
  if(t===5){ const a=ri(1,12), b=ri(1,12), c=nz(-6,6), d=ri(1,15); return {e:`(${a} − ${b}) × ${P(c)} + ${d}`, st:[`${P(a-b)} × ${P(c)} + ${d}`, `${F((a-b)*c)} + ${d}`], v:(a-b)*c+d}; }
  if(t===6){ const d=ri(2,9), c=ri(1,9), q=nz(-6,6), k=c-d, a=ri(1,15); return k ? {e:`${a} − [${F(q*k)} ÷ (${c} − ${d})]`, st:[`${a} − [${F(q*k)} ÷ ${P(k)}]`, `${a} − ${P(q)}`], v:a-q} : prioQ(3); }
  const a=nz(-5,5), b=nz(-5,5), c=ri(2,6), d=nz(-6,6), e=ri(1,6); return {e:`${P(a)} × ${P(b)} − ${c} × (${F(d)} + ${e})`, st:[`${F(a*b)} − ${c} × ${P(d+e)}`, `${F(a*b)} − ${P(c*(d+e))}`], v:a*b-c*(d+e)};
}
const prioG=level=>()=>{ const p=prioQ(level); return {q:`Calcule : ${p.e}`, rep:[F(p.v)], ex:`${p.e} = ${p.st.join(" = ")} = ${F(p.v)}.`, sx:S_PRIO}; };

CH["4e-4"]={
intro:"Diviser des nombres relatifs, trouver le signe d'un produit de plusieurs facteurs, calculer une suite d'additions et enchaîner les opérations en respectant les priorités.",
savoir:[
  "diviser deux nombres relatifs ;",
  "trouver le signe d'un produit de plusieurs nombres relatifs en comptant les facteurs négatifs ;",
  "calculer astucieusement un produit ;",
  "calculer une suite d'additions de nombres relatifs en regroupant les positifs et les négatifs ;",
  "calculer une expression en respectant les priorités opératoires."
],

/* ===================== COURS ===================== */
cours:[
{k:"1", t:"La division de nombres relatifs", h:`
  <div class="retenir" data-l="Propriété"><p>Pour calculer le <b>quotient de deux nombres relatifs</b>, on s'intéresse d'abord à leur signe :</p><ul><li>si les nombres relatifs sont <b>de même signe</b>, le résultat sera <b>positif</b> ;</li><li>si les nombres relatifs sont <b>de signes différents</b>, le résultat sera <b>négatif</b>.</li></ul><p>Ensuite, on calcule le quotient sans tenir compte du signe.</p></div>
  <p><b>Exemples :</b></p>${chns([["A",["21 ÷ 7","3"]],["B",["{−20/−4}","5"]],["C",["36 ÷ (−3)","−12"]],["D",["{−30/6}","−5"]]])}`},
{k:"2", t:"Multiplications successives de nombres relatifs", h:`
  <h4>a) Signe du résultat de multiplications successives</h4>
  <div class="retenir" data-l="Propriété"><p>Pour calculer le résultat de <b>multiplications successives de nombres relatifs</b>, on s'intéresse d'abord à son signe. Pour cela, on compte le nombre de facteurs négatifs :</p><ul><li>s'il y a un <b>nombre pair de facteurs négatifs</b>, le résultat sera <b>positif</b> ;</li><li>s'il y a un <b>nombre impair de facteurs négatifs</b>, le résultat sera <b>négatif</b>.</li></ul><p>On peut ensuite calculer le produit sans tenir compte du signe.</p></div>
  <p><b>Exemples :</b></p>
  <p class="calc">E = (−2) × 3 × (−4) × (−3)<br>E = −72</p><p>Il y a 3 facteurs négatifs (nombre impair) : E est négatif. 2 × 3 × 4 × 3 = 72.</p>
  <p class="calc">F = 7 × (−2) × (−4)<br>F = 56</p><p>Il y a 2 facteurs négatifs (nombre pair) : F est positif. 7 × 2 × 4 = 56.</p>
  <h4>b) Calculer astucieusement un produit</h4>
  <p><b>Exemple :</b> on regroupe les facteurs qui donnent un résultat simple (4 × 25 = 100).</p>
  <p class="calc">G = 23,8 × 4 × (−25)<br>G = 23,8 × (−100)<br>G = −2 380</p>`},
{k:"3", t:"Additions successives de nombres relatifs", h:`
  <div class="retenir" data-l="Propriété"><p>Pour effectuer <b>une suite d'additions de nombres relatifs</b> :</p><ul><li>on calcule de gauche à droite ;</li><li><b>ou</b> on peut <b>regrouper</b> ensemble <b>tous les nombres négatifs</b> d'un côté et <b>les nombres positifs</b> de l'autre.</li></ul></div>
  <p><b>Exemples :</b> calcule les expressions suivantes.</p>
  <div class="figs" style="gap:28px"><p class="calc">H = −5 + 3 − 13 + 9<br>H = 3 + 9 − 5 − 13<br>H = 12 − 18<br>H = −6</p><p class="calc">I = 6 − 7 − 3,5 + 9,2 + 3,8<br>I = 6 + 9,2 + 3,8 − 7 − 3,5<br>I = 19 − 10,5<br>I = 8,5</p></div>`},
{k:"4", t:"Enchaînements d'opérations et priorités opératoires", h:`
  <div class="retenir" data-l="Propriété"><p>Pour calculer une expression, on effectue les opérations dans l'ordre suivant :</p><p><b>1)</b> les calculs entre parenthèses ou entre crochets, en commençant par les plus intérieurs ;</p><p><b>2)</b> les multiplications et les divisions ;</p><p><b>3)</b> les additions et les soustractions.</p><p>Quand des opérations ont le même niveau de priorité, on les effectue de gauche à droite.</p></div>
  <p><b>Exemples :</b> calcule les expressions suivantes.</p>
  <div class="figs" style="gap:28px"><p class="calc">J = 13 + 5 × (3 − 11) − 7<br>J = 13 + 5 × (−8) − 7<br>J = 13 − 40 − 7<br>J = −34</p><p class="calc">K = 7 − [18 ÷ (4 − 7)]<br>K = 7 − [18 ÷ (−3)]<br>K = 7 − (−6)<br>K = 13</p></div>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"La division de nombres relatifs", e:[
  {n:"Activité 1", t:"Jeu du lancer de cerceaux", w:"Sur ton cahier", h:`<p>Pour chaque question, écris le calcul qui te permet de répondre.</p>${ex("cerceaux.jpg","Cerceaux : marron +10, violet −8, jaune +7, vert +5, bleu clair −6, bleu foncé +3, rouge −12",420)}
   <p><b>1)</b> Étienne a lancé 13 fois dans le même cerceau et a obtenu un score de 39 points. Dans quel cerceau a-t-il lancé ?</p><p><b>2)</b> Marc a obtenu −36 points en lançant 3 fois dans le même cerceau. Quelle était la couleur de ce cerceau ?</p><p><b>3)</b> Julie a aussi obtenu −36 points, en ne lançant que dans le cerceau bleu clair. Combien de balles ont atteint ce cerceau ?</p><p><b>4)</b> Énonce une conjecture sur le signe du résultat d'une division de nombres relatifs.</p>`,
   c:`<p><b>1)</b> 39 ÷ 13 = 3 : Étienne a lancé dans le cerceau <b>bleu foncé</b> (+3).</p><p><b>2)</b> (−36) ÷ 3 = −12 : c'était le cerceau <b>rouge</b> (−12).</p><p><b>3)</b> Le cerceau bleu clair vaut −6 : (−36) ÷ (−6) = 6. <b>6 balles</b> ont atteint ce cerceau.</p>
   <p><b>4)</b> Le quotient de deux nombres de même signe est positif : 39 ÷ 13 = 3 et (−36) ÷ (−6) = 6. Le quotient de deux nombres de signes différents est négatif : (−36) ÷ 3 = −12.</p>`}
 ]},
{t:"Multiplications successives de nombres relatifs", e:[
  {n:"Activité 2", t:"À la fête foraine", w:"Sur ton cahier", h:`<p>À la fête foraine, Medhi et Anna jouent à la roulette : ils parient sur une couleur.</p><p>Si la flèche tombe sur une case de leur couleur, ils gagnent : leur mise est multipliée par 2.</p><p>Sinon, ils perdent : leur mise est multipliée par −2.</p><p>Avant de jouer, Medhi et Anna misent chacun 3 €. Ils jouent 5 parties, en remettant à chaque fois en jeu le score de la partie précédente.</p>
   ${tabH(["","1<sup>re</sup> partie","2<sup>e</sup> partie","3<sup>e</sup> partie","4<sup>e</sup> partie","5<sup>e</sup> partie"],[["<b>Medhi</b>","Défaite","Défaite","Victoire","Défaite","Défaite"],["<b>Anna</b>","Victoire","Victoire","Victoire","Victoire","Défaite"]])}
   <p>À la fin du jeu, Anna dit à Medhi : « J'ai gagné car tu as plus de défaites que moi ! ».</p><p>Es-tu d'accord avec elle ?</p>`,
   c:`<p class="calc">Medhi : 3 × (−2) × (−2) × 2 × (−2) × (−2) = 96</p><p>Il y a 4 facteurs négatifs (nombre pair) : le résultat est positif. 3 × 2 × 2 × 2 × 2 × 2 = 96.</p>
   <p class="calc">Anna : 3 × 2 × 2 × 2 × 2 × (−2) = −96</p><p>Il y a 1 facteur négatif (nombre impair) : le résultat est négatif.</p><p>Medhi finit avec 96 et Anna avec −96 : <b>Anna a tort</b>, c'est Medhi qui a gagné. Ce qui compte, c'est le nombre de défaites pair ou impair.</p>`},
  {n:"Exercice 1", t:"Le signe du résultat d'une suite de multiplications", w:"Sur ta feuille", h:`<p>Pour chaque calcul, indique le signe du résultat :</p><ul><li>note « + » si le résultat est positif ;</li><li>note « − » si le résultat est négatif.</li></ul>
   <p class="calc">A = 4 × 5 × (−3) × (−5)<br>B = 12 × (−7) × (−3) × (−5) × 3 × (−1)<br>C = −5 × (−18) × (−2) × (−1) × 3 × (−2)<br>D = −9 × (−18) × (−2) × 7 × (−1) × 3 × (−2) × 67 × (−7) × (−9) × 4</p>`,
   c:`<p>On compte les facteurs négatifs.</p><p class="calc">A : 2 facteurs négatifs (pair) → <b>+</b><br>B : 4 facteurs négatifs (pair) → <b>+</b><br>C : 5 facteurs négatifs (impair) → <b>−</b><br>D : 7 facteurs négatifs (impair) → <b>−</b></p>`},
  {n:"Exercice 2", t:"Suite de multiplications", w:"Sur ton cahier", h:`<p>Pour les calculs A et B, écris directement le résultat.</p><p>Pour les calculs C, D et E, écris tes étapes de calcul.</p>
   <p class="calc">A = 4 × 1 × (−2) × (−1) × 3 × 2 × (−1)<br>B = −5 × 1 × (−2) × (−1) × 3 × (−2)</p><p class="calc">C = 4 × 0,62 × 25<br>D = 50 × 16,4 × (−2)<br>E = 2,5 × (−6,78) × 4</p>`,
   c:`<p class="calc">A = −48 &nbsp; (3 facteurs négatifs : négatif ; 4 × 2 × 3 × 2 = 48)<br>B = 60 &nbsp; (4 facteurs négatifs : positif ; 5 × 2 × 3 × 2 = 60)</p>
   <div class="figs" style="gap:28px"><p class="calc">C = 4 × 0,62 × 25<br>C = 4 × 25 × 0,62<br>C = 100 × 0,62<br>C = 62</p><p class="calc">D = 50 × 16,4 × (−2)<br>D = 50 × (−2) × 16,4<br>D = −100 × 16,4<br>D = −1 640</p><p class="calc">E = 2,5 × (−6,78) × 4<br>E = 2,5 × 4 × (−6,78)<br>E = 10 × (−6,78)<br>E = −67,8</p></div>`},
  {n:"Exercice 3", t:"Le labyrinthe", w:"Sur ton cahier", h:`<p><b>Règle du jeu :</b></p><ul><li>On entre par la case −1.</li><li>Chaque fois qu'on passe par une case, on multiplie le résultat précédent par le nombre rencontré.</li><li>On ne peut pas passer deux fois par la même case.</li><li>La sortie 1 est accessible seulement avec un nombre positif.</li><li>La sortie 2 est accessible seulement avec un nombre négatif.</li></ul>
   ${ex("labyrinthe.jpg","Labyrinthe de nombres relatifs : entrée par −1 en haut à gauche, sortie 1 par −3 en haut à droite, sortie 2 par −2 en bas à droite",560)}
   <p><b>1)</b> Écris le plus de chemins possible qui passent par <b>7 cases</b> et qui permettent d'emprunter la <b>sortie 1</b>.</p><p>Exemple : (−1) × 5 × (−8) × 3 × (−12) × 6 × (−3).</p><p><b>2)</b> Écris <b>un chemin</b> qui passe par <b>9 cases</b> et qui permet d'emprunter la <b>sortie 1</b>.</p><p><b>3)</b> Écris <b>deux chemins</b> qui passent par <b>9 cases</b> et qui permettent d'emprunter la <b>sortie 2</b>.</p><p><i>Sans calculatrice : il suffit de compter les facteurs négatifs.</i></p>`,
   c:`<p>Pour la sortie 1, il faut un nombre <b>pair</b> de facteurs négatifs. Pour la sortie 2, un nombre <b>impair</b>.</p>
   <p><b>1)</b> Il y a 5 chemins de 7 cases qui arrivent à −3, mais seulement 2 ont un nombre pair de facteurs négatifs :</p><p class="calc">(−1) × 5 × (−8) × 3 × (−12) × 6 × (−3) &nbsp; (4 facteurs négatifs)<br>(−1) × 14 × (−12) × 2 × (−13) × 8 × (−3) &nbsp; (4 facteurs négatifs)</p>
   <p><b>2)</b> Par exemple :</p><p class="calc">(−1) × 5 × (−8) × 5 × (−10) × (−9) × (−13) × 8 × (−3) &nbsp; (6 facteurs négatifs : positif)</p>
   <p><b>3)</b> Par exemple :</p><p class="calc">(−1) × 9 × (−4) × 14 × (−7) × 18 × (−5) × 15 × (−2) &nbsp; (5 facteurs négatifs : négatif)<br>(−1) × 5 × (−8) × 5 × (−10) × 17 × (−11) × 16 × (−2) &nbsp; (5 facteurs négatifs : négatif)</p><p>D'autres chemins sont possibles : vérifie que tes cases se touchent et compte les facteurs négatifs.</p>`}
 ]},
{t:"Additions successives de nombres relatifs", e:[
  {n:"Activité 3", t:"Compte bancaire du mois de décembre", w:"Sur ton cahier", h:`<p>Voici le compte bancaire de Lili, qui a 13 ans.</p>${tabH(["Date","Libellé","Montant (en €)"],[["02/12","Argent de poche","+ 30"],["03/12","Achat d'un tee-shirt","− 16"],["10/12","Achat du cadeau de Noël de Papa et Maman","− 22"],["15/12","Babysitting","+ 15"],["17/12","Achat d'un livre","− 9"],["25/12","Cadeau de Noël de Papy et Mamie","+ 30"],["29/12","Achat de bonbons","− 11"]])}
   <p>Au mois de décembre, a-t-elle gagné ou perdu de l'argent ?</p><p>Pour expliquer, calcule la somme qu'elle a gagnée ou perdue.</p>`,
   c:`<p class="calc">30 − 16 − 22 + 15 − 9 + 30 − 11<br>= 30 + 15 + 30 − 16 − 22 − 9 − 11<br>= 75 − 58<br>= 17</p><p>Lili a <b>gagné 17 €</b> au mois de décembre.</p>`},
  {n:"Exercice 4", t:"Suite d'additions de nombres relatifs", w:"Sur ton cahier", h:`<p>Sans calculatrice. Recopie les calculs et écris tes étapes.</p><p class="calc">A = 25 + (−7) + (−12) + 5<br>B = −14 + 17 + (−26) + 8 + 3<br>C = −5 + 8 + 12 − 2<br>D = 11 − 7 + 3 − 8 − 13 + 9</p>`,
   c:`<div class="figs" style="gap:28px"><p class="calc">A = 25 + (−7) + (−12) + 5<br>A = 25 + 5 + (−7) + (−12)<br>A = 30 + (−19)<br>A = 11</p><p class="calc">B = −14 + 17 + (−26) + 8 + 3<br>B = 17 + 8 + 3 + (−14) + (−26)<br>B = 28 + (−40)<br>B = −12</p><p class="calc">C = −5 + 8 + 12 − 2<br>C = 8 + 12 − 5 − 2<br>C = 20 − 7<br>C = 13</p><p class="calc">D = 11 − 7 + 3 − 8 − 13 + 9<br>D = 11 + 3 + 9 − 7 − 8 − 13<br>D = 23 − 28<br>D = −5</p></div>`},
  {n:"Exercice 5", t:"Jeu vidéo", w:"Sur ton cahier", h:`<p>Sans calculatrice. Deux copains jouent à un jeu vidéo et font 4 parties.</p>${tabH(["","Elie","Maxence"],[["<b>Partie 1</b>","Gagne 12 points","Gagne 30 points"],["<b>Partie 2</b>","Perd 45 points","Perd 16 points"],["<b>Partie 3</b>","Gagne 17 points","Perd 38 points"],["<b>Partie 4</b>","Gagne 8 points","Gagne 22 points"]])}
   <p>Lequel des deux copains a gagné le plus de points aujourd'hui ?</p><p><b>a)</b> Écris le calcul qui permet de trouver les points d'Elie, puis calcule-le.</p><p><b>b)</b> Même question pour Maxence.</p><p><b>c)</b> Réponds à la question.</p>`,
   c:`<p class="calc">a) Elie : 12 − 45 + 17 + 8 = 37 − 45 = −8<br>b) Maxence : 30 − 16 − 38 + 22 = 52 − 54 = −2</p><p><b>c)</b> −2 &gt; −8 : c'est <b>Maxence</b> qui a le meilleur score (il a perdu moins de points).</p>`}
 ]},
{t:"Enchaînements d'opérations et priorités opératoires", e:[
  {n:"Exercice 6", t:"Respecter les priorités !", w:"Sur ton cahier", h:`<p>Recopie les calculs et écris tes étapes.</p>${cols(["A = −4 × 5 + 30","B = −4 + 2 × (−6)","C = 18 ÷ (−3) + 2","D = 4 × (−6 − 2)","E = 5 + (8 − 3 × 5)","F = (8 − 10) × (−3) + 10"])}`,
   c:`<div class="figs" style="gap:28px"><p class="calc">A = −4 × 5 + 30<br>A = −20 + 30<br>A = 10</p><p class="calc">B = −4 + 2 × (−6)<br>B = −4 + (−12)<br>B = −16</p><p class="calc">C = 18 ÷ (−3) + 2<br>C = −6 + 2<br>C = −4</p><p class="calc">D = 4 × (−6 − 2)<br>D = 4 × (−8)<br>D = −32</p><p class="calc">E = 5 + (8 − 3 × 5)<br>E = 5 + (8 − 15)<br>E = 5 + (−7)<br>E = −2</p><p class="calc">F = (8 − 10) × (−3) + 10<br>F = (−2) × (−3) + 10<br>F = 6 + 10<br>F = 16</p></div>`},
  {n:"Exercice 7", t:"Teste !", w:"Sur ton cahier", h:`<p>Complète les pointillés avec +, −, × ou ÷ pour que l'égalité soit vraie.</p><p class="calc">a. 8 − 4 … 3 + 6 = 2<br>b. −15 … 2 × 3 + 10 = −11<br>c. −9 … 3 + 5 × (−7) = −38<br>d. (−3 + 8) × (6 … 12) = −30</p>`,
   c:`<p class="calc">a. 8 − 4 <b>×</b> 3 + 6 = 8 − 12 + 6 = 2<br>b. −15 <b>−</b> 2 × 3 + 10 = −15 − 6 + 10 = −11<br>c. −9 <b>÷</b> 3 + 5 × (−7) = −3 + (−35) = −38<br>d. (−3 + 8) × (6 <b>−</b> 12) = 5 × (−6) = −30</p>`},
  {n:"Exercice 8", t:"Fais des essais", w:"Sur ton cahier", h:`<p>Dans chaque cas, place des parenthèses pour que l'égalité soit vraie.</p><p class="calc">a. 14 − 4 × 6 − 1 = 50<br>b. 27 − 2,5 × 8,5 − 4,5 = 17<br>c. 15 − 25 × 2,4 + 7 − 3 × 2 = −16</p>`,
   c:`<p class="calc">a. (14 − 4) × (6 − 1) = 10 × 5 = 50<br>b. 27 − 2,5 × (8,5 − 4,5) = 27 − 2,5 × 4 = 27 − 10 = 17<br>c. (15 − 25) × 2,4 + (7 − 3) × 2 = (−10) × 2,4 + 4 × 2 = −24 + 8 = −16</p>`},
  {n:"Exercice 9", t:"Le jeu des bulles", w:"Sur ton cahier", h:`<p><b>Règle du jeu :</b></p><ul><li>On donne 6 nombres répartis dans 6 bulles.</li><li>Il faut trouver les étapes de calcul qui permettent d'obtenir le nombre affiché au centre.</li><li>On peut utiliser les 4 opérations autant de fois qu'on le veut.</li><li>On ne peut pas utiliser deux fois le même nombre.</li><li>On n'est pas obligé d'utiliser tous les nombres.</li></ul>${bulles([6,-10,3,2,-1,-4],-100)}
   <p><b>1)</b> Estelle propose l'expression suivante : [−4 × 2 − (3 − 1)] × (−10).</p><p>Sa solution est-elle correcte ? Pourquoi ?</p><p>Si ce n'est pas le cas, propose un minimum de modifications pour rendre l'expression correcte.</p><p><b>2)</b> Propose deux autres solutions à ce jeu. Écris chacune d'elles à l'aide d'une seule expression.</p>`,
   c:`<p><b>1)</b></p><p class="calc">[−4 × 2 − (3 − 1)] × (−10)<br>= [−8 − 2] × (−10)<br>= (−10) × (−10)<br>= 100</p><p>Elle obtient 100 et non −100 : sa solution n'est <b>pas correcte</b> (le produit de deux nombres négatifs est positif).</p><p>Une modification possible : remplacer −4 par 6. [6 × 2 − (3 − 1)] × (−10) = (12 − 2) × (−10) = 10 × (−10) = −100.</p>
   <p><b>2)</b> Par exemple :</p><p class="calc">[6 − (−4)] × (−10) = 10 × (−10) = −100<br>(6 + 3 + 2 − 1) × (−10) = 10 × (−10) = −100</p>`},
  {n:"Exercice 10", t:"La grille de nombres croisés", w:"Sur ton cahier", h:`<p>Recopie et remplis la grille. Dans une case, on écrit un chiffre ; le signe « − » s'écrit dans la même case que le premier chiffre.</p>${grille(false)}
   <p><b>Verticalement</b></p><p><b>1.</b> Somme de 8 et du produit de 4 par (−5) ; opposé du quotient de (−15) par 3.</p><p><b>2.</b> (−0,25) × (−1,3) × 5 × (−4) × (−2) ; produit de 117 facteurs égaux à (−1).</p><p><b>3.</b> Différence de (−18) et du produit de 6 par (−3) ; somme du produit de 6 par 100 et du produit de (−9) par (−6).</p><p><b>4.</b> Tiers de (−9) ; opposé du quart de (−16).</p><p><b>5.</b> Produit de (−99) par 4 ; 5 − 7 + 18 − 4 − 5 − 15.</p>
   <p><b>Horizontalement</b></p><p><b>A.</b> −10² ; quotient de la différence de 15 et 27 par 4.</p><p><b>B.</b> Différence de 5² et (−2)² ; opposé du triple de 13.</p><p><b>C.</b> Différence de 30 et du produit de (−2) par 3 ; quotient de la somme de (−50) et 2 par la somme de 4 et (−12).</p><p><b>D.</b> −(−5) ; produit de (−1) par la somme de (−60) et 6.</p><p><b>E.</b> Produit de (−7) par la différence de 1 et (−1) ; double de la somme de 3 et (−7).</p>`,
   c:`<p><b>Verticalement</b></p><p class="calc">1. 8 + 4 × (−5) = 8 − 20 = −12 · −[(−15) ÷ 3] = −(−5) = 5<br>2. (−0,25) × (−4) × 5 × (−2) × (−1,3) = 1 × (−10) × (−1,3) = 13 (on écrit 0 1 3) · (−1)<sup>117</sup> = −1 (117 est impair)<br>3. −18 − 6 × (−3) = −18 + 18 = 0 · 6 × 100 + (−9) × (−6) = 600 + 54 = 654<br>4. (−9) ÷ 3 = −3 · −[(−16) ÷ 4] = −(−4) = 4<br>5. (−99) × 4 = −396 · 5 − 7 + 18 − 4 − 5 − 15 = 23 − 31 = −8</p>
   <p><b>Horizontalement</b></p><p class="calc">A. −10² = −100 · (15 − 27) ÷ 4 = −12 ÷ 4 = −3<br>B. 5² − (−2)² = 25 − 4 = 21 · −(3 × 13) = −39<br>C. 30 − (−2) × 3 = 30 + 6 = 36 · [(−50) + 2] ÷ [4 + (−12)] = (−48) ÷ (−8) = 6<br>D. −(−5) = 5 · (−1) × [(−60) + 6] = (−1) × (−54) = 54<br>E. (−7) × [1 − (−1)] = (−7) × 2 = −14 · 2 × [3 + (−7)] = 2 × (−4) = −8</p>${grille(true)}`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Diviser deux relatifs", schema:S_DIV, q:{
 1:[ {g:()=>{ const a=nz(-9,9), b=nz(-9,9); return {q:`Le quotient ${P(a*b)} ÷ ${P(b)} est…`, c:["positif","négatif"], rep:a>0?"positif":"négatif", ex:(a*b)*b>0?"Les deux nombres sont de même signe : le quotient est positif.":"Les deux nombres sont de signes différents : le quotient est négatif.", sx:S_DIV}; }} ],
 2:[ {g:()=>{ const a=nz(-12,12), b=nz(-9,9); return {q:`Calcule : ${F(a*b)} ÷ ${P(b)}`, rep:[F(a)], ex:`${a>0?"Même signe : positif":"Signes différents : négatif"}. ${Math.abs(a*b)} ÷ ${Math.abs(b)} = ${Math.abs(a)}.`, sx:S_DIV}; }} ],
 3:[ {g:()=>{ const a=nz(-12,12), b=nz(-9,9); return {q:`Calcule : {${F(a*b)}/${F(b)}}`, rep:[F(a)], ex:`{${F(a*b)}/${F(b)}} = ${F(a*b)} ÷ ${P(b)} = ${F(a)}.`, sx:S_DIV}; }},
     {g:()=>{ const q=nz(-9,9), d=nz(-9,9); return {q:`Quel nombre faut-il écrire à la place de … ? &nbsp; … × ${P(d)} = ${F(q*d)}`, rep:[F(q)], ex:`On divise : ${F(q*d)} ÷ ${P(d)} = ${F(q)}.`, sx:S_DIV}; }} ]
}},
{nom:"Signe d'un produit", schema:S_MUL, q:{
 1:[ {g:()=>{ const n=ri(4,6), a=Array.from({length:n},()=>nz(-9,9)); const k=nNeg(a); return {q:`Quel est le signe de ${prodTxt(a)} ?`, c:["positif","négatif"], rep:k%2?"négatif":"positif", ex:`Il y a ${k} facteur${k>1?"s":""} négatif${k>1?"s":""} : nombre ${k%2?"impair, le produit est négatif":"pair, le produit est positif"}.`, sx:S_MUL}; }} ],
 2:[ {g:()=>{ const a=Array.from({length:ri(3,4)},()=>nz(-5,5)); const k=nNeg(a), p=prod(a); return {q:`Calcule : ${prodTxt(a)}`, rep:[F(p)], ex:`${k} facteur${k>1?"s":""} négatif${k>1?"s":""} : ${k%2?"négatif":"positif"}. ${a.map(x=>Math.abs(x)).join(" × ")} = ${Math.abs(p)}.`, sx:S_MUL}; }},
     {g:()=>{ const n=pick([2,3,5,6,7,8,9,11]), s=pick([1,-1]); return {q:`Quel est le signe du produit de ${n*2+(s<0?1:0)} facteurs tous égaux à (−1) ?`, c:["positif","négatif"], rep:s<0?"négatif":"positif", ex:`${n*2+(s<0?1:0)} est ${s<0?"impair : le produit est négatif (−1).":"pair : le produit est positif (1)."}`, sx:S_MUL}; }} ],
 3:[ {g:()=>{ const t=pick([[4,25,100],[25,4,100],[2.5,4,10],[50,-2,-100],[-4,25,-100],[0.5,-20,-10]]); const x=ri(11,999)/10, s=pick([1,-1]); const f=[t[0], s*x, t[1]], p=prod(f);
       return {q:`Calcule astucieusement : ${prodTxt(f)}`, rep:[F(p)], ex:`On regroupe ${P(t[0])} × ${P(t[1])} = ${F(t[2])} : ${prodTxt(f)} = ${P(t[0])} × ${P(t[1])} × ${P(s*x)} = ${F(t[2])} × ${P(s*x)} = ${F(p)}.`, sx:S_MUL}; }} ]
}},
{nom:"Suite d'additions", schema:S_ADD, q:{
 1:[ {g:()=>{ const v=Array.from({length:4},()=>nz(-20,20)); const s=v.reduce((a,b)=>a+b,0); return {q:`Calcule : ${v.map((x,i)=>i?`(${x>0?"+":""}${F(x)})`:`(${x>0?"+":""}${F(x)})`).join(" + ")}`, rep:[F(s)], ex:`On regroupe les positifs, puis les négatifs : ${[v.map(x=>`(${x>0?"+":""}${F(x)})`).join(" + "), [...v.filter(x=>x>0),...v.filter(x=>x<0)].map(x=>`(${x>0?"+":""}${F(x)})`).join(" + "), [v.filter(x=>x>0),v.filter(x=>x<0)].filter(g=>g.length).map(g=>{ const t=g.reduce((a,b)=>a+b,0); return `(${t>0?"+":""}${F(t)})`; }).join(" + "), F(s)].filter((x,i,a)=>x!==a[i-1]).join(" = ")}.`, sx:S_ADD}; }} ],
 2:[ {g:()=>{ const v=Array.from({length:ri(4,6)},()=>nz(-15,15)); const s=v.reduce((a,b)=>a+b,0), e=v.map((x,i)=>i?(x<0?"− ":"+ ")+Math.abs(x):F(x)).join(" "); const p=v.filter(x=>x>0).reduce((a,b)=>a+b,0), n=-v.filter(x=>x<0).reduce((a,b)=>a+b,0);
       return {q:`Calcule : ${e}`, rep:[F(s)], ex:`On regroupe : ${[e, simpW([...v.filter(x=>x>0),...v.filter(x=>x<0)]), p&&n?`${p} − ${n}`:"", F(s)].filter((x,i,a)=>x&&x!==a[i-1]).join(" = ")}.`, sx:S_ADD}; }} ],
 3:[ {g:()=>{ const v=Array.from({length:5},()=>nz(-99,99)/10); const s=r3(v.reduce((a,b)=>a+b,0)), e=v.map((x,i)=>i?(x<0?"− ":"+ ")+F(Math.abs(x)):F(x)).join(" "); const p=r3(v.filter(x=>x>0).reduce((a,b)=>a+b,0)), n=r3(-v.filter(x=>x<0).reduce((a,b)=>a+b,0));
       return {q:`Calcule : ${e}`, rep:[F(s)], ex:`On regroupe : ${[e, simpW([...v.filter(x=>x>0),...v.filter(x=>x<0)]), p&&n?`${F(p)} − ${F(n)}`:"", F(s)].filter((x,i,a)=>x&&x!==a[i-1]).join(" = ")}.`, sx:S_ADD}; }} ]
}},
{nom:"Priorités opératoires", schema:S_PRIO, q:{
 1:[ {g:prioG(1)},
     {q:"Dans 13 + 5 × (3 − 11) − 7, quel calcul fait-on en premier ?", c:["3 − 11","13 + 5","5 × 3","11 − 7"], rep:"3 − 11", ex:"On commence par les calculs entre parenthèses.", sx:S_PRIO} ],
 2:[ {g:prioG(2)} ],
 3:[ {g:prioG(3)},
     {g:()=>{ let a,b,c,r; do{ a=ri(2,9); b=ri(2,9); c=nz(-9,9); r=(a-b)*c; }while(a===b || a-b*c===r || a*(b-c)===r); const good=`(${a} − ${b}) × ${P(c)}`; return {q:`Quelle expression est égale à ${F(r)} ?`, c:shuf([good,`${a} − ${b} × ${P(c)}`,`${a} × (${b} − ${P(c)})`]), rep:good, ex:`(${a} − ${b}) × ${P(c)} = ${P(a-b)} × ${P(c)} = ${F(r)}, alors que ${a} − ${b} × ${P(c)} = ${a} − ${P(b*c)} = ${F(a-b*c)}.`, sx:S_PRIO}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 4", duree:50, info:"Durée : 50 min · Calculatrice non autorisée · Stylo et crayon",
comp:[
  ["CALCULER","Je sais diviser deux nombres relatifs.","Ex. 1 (2 points)"],
  ["RAISONNER","Je trouve le signe d'un produit de plusieurs facteurs.","Ex. 2 (2 points)"],
  ["CALCULER","Je calcule astucieusement un produit et une suite d'additions.","Ex. 3 et 4 (6 points)"],
  ["CALCULER","Je respecte les priorités opératoires.","Ex. 5 et 6 (8 points)"],
  ["MODÉLISER","Je traduis un problème par une expression.","Ex. 7 (2 points)"]
],
exos:[
{t:"Des divisions", p:2, h:`<p>Calcule.</p>${cols(["A = 45 ÷ (−9)","B = (−56) ÷ (−7)","C = {−48/6}","D = {−72/−8}"])}`,
 c:`${chns([["A",["45 ÷ (−9)","−5"]],["B",["(−56) ÷ (−7)","8"]],["C",["{−48/6}","−8"]],["D",["{−72/−8}","9"]]])}<p><i>(0,5 point par calcul)</i></p>`},
{t:"Le signe d'un produit", p:2, h:`<p><b>1)</b> Sans calculer, donne le signe de 6 × (−3) × 9 × (−11) × (−2). Explique.</p><p><b>2)</b> Écris le signe du résultat de chaque calcul.</p><p class="calc">a) (−1) × 4 × (−7) × (−2,5) × (−3) × 8<br>b) (−5) × (−6) × (−1) × 2 × (−8) × (−4)</p>`,
 c:`<p><b>1)</b> Il y a 3 facteurs négatifs : c'est un nombre impair, donc le résultat est <b>négatif</b>. <i>(1 point)</i></p><p><b>2)</b> a) 4 facteurs négatifs (pair) : <b>positif</b>. <i>(0,5 point)</i> · b) 5 facteurs négatifs (impair) : <b>négatif</b>. <i>(0,5 point)</i></p>`},
{t:"Calculer astucieusement", p:3, h:`<p>Calcule en écrivant tes étapes.</p><p class="calc">A = 25 × (−7,3) × 4<br>B = (−2) × 39,6 × 50<br>C = (−4) × (−2) × 5 × (−1) × 3</p>`,
 c:`<div class="figs" style="gap:28px"><p class="calc">A = 25 × (−7,3) × 4<br>A = 25 × 4 × (−7,3)<br>A = 100 × (−7,3)<br>A = −730 <i>(1 point)</i></p><p class="calc">B = (−2) × 39,6 × 50<br>B = (−2) × 50 × 39,6<br>B = (−100) × 39,6<br>B = −3 960 <i>(1 point)</i></p><p class="calc">C = (−4) × (−2) × 5 × (−1) × 3<br>C = −120 <i>(1 point)</i></p></div><p>Pour C : 3 facteurs négatifs, donc le résultat est négatif ; 4 × 2 × 5 × 1 × 3 = 120.</p>`},
{t:"Des suites d'additions", p:3, h:`<p>Calcule en regroupant les nombres positifs et les nombres négatifs.</p><p class="calc">D = −8 + 15 − 4 − 9 + 6<br>E = 4,5 − 7 + 2,5 − 3,2<br>F = (+12) + (−5) + (−18) + (+7)</p>`,
 c:`<div class="figs" style="gap:28px"><p class="calc">D = −8 + 15 − 4 − 9 + 6<br>D = 15 + 6 − 8 − 4 − 9<br>D = 21 − 21<br>D = 0 <i>(1 point)</i></p><p class="calc">E = 4,5 − 7 + 2,5 − 3,2<br>E = 4,5 + 2,5 − 7 − 3,2<br>E = 7 − 10,2<br>E = −3,2 <i>(1 point)</i></p><p class="calc">F = (+12) + (−5) + (−18) + (+7)<br>F = 12 + 7 − 5 − 18<br>F = 19 − 23<br>F = −4 <i>(1 point)</i></p></div>`},
{t:"Respecter les priorités", p:6, h:`<p>Calcule en écrivant toutes les étapes.</p>${cols(["G = −6 + 4 × (−3)","H = 20 ÷ (−4) − 3","I = (−7 + 2) × (−6)","J = 9 − 2 × (5 − 11)","K = 10 − [24 ÷ (2 − 8)]","L = (−3) × (−2) − 5 × (−4 + 1)"])}`,
 c:`<div class="figs" style="gap:28px"><p class="calc">G = −6 + 4 × (−3)<br>G = −6 + (−12)<br>G = −18</p><p class="calc">H = 20 ÷ (−4) − 3<br>H = −5 − 3<br>H = −8</p><p class="calc">I = (−7 + 2) × (−6)<br>I = (−5) × (−6)<br>I = 30</p><p class="calc">J = 9 − 2 × (5 − 11)<br>J = 9 − 2 × (−6)<br>J = 9 + 12<br>J = 21</p><p class="calc">K = 10 − [24 ÷ (2 − 8)]<br>K = 10 − [24 ÷ (−6)]<br>K = 10 − (−4)<br>K = 14</p><p class="calc">L = (−3) × (−2) − 5 × (−4 + 1)<br>L = (−3) × (−2) − 5 × (−3)<br>L = 6 − (−15)<br>L = 6 + 15<br>L = 21</p></div><p><i>(1 point par calcul : 0,5 pour les étapes, 0,5 pour le résultat)</i></p>`},
{t:"Teste et fais des essais", p:2, h:`<p><b>a)</b> Complète avec +, −, × ou ÷ pour que l'égalité soit vraie : −6 … 4 + 10 = −14.</p><p><b>b)</b> Place des parenthèses pour que l'égalité soit vraie : 18 − 6 × 2 − 5 = −36.</p>`,
 c:`<p class="calc">a) −6 × 4 + 10 = −24 + 10 = −14 <i>(1 point)</i><br>b) (18 − 6) × (2 − 5) = 12 × (−3) = −36 <i>(1 point)</i></p>`},
{t:"Le compte de Sam", p:2, h:`<p>Au début du mois, le compte de Sam est à −45 €.</p><p>Pendant le mois, il reçoit 3 virements de 20 € et il paie 4 achats de 12,50 €.</p><p><b>a)</b> Écris une seule expression qui donne le solde du compte à la fin du mois.</p><p><b>b)</b> Calcule-la. Le compte de Sam est-il encore négatif ?</p>`,
 c:`<p>a) S = −45 + 3 × 20 − 4 × 12,5 <i>(1 point)</i></p><p>b)</p><p class="calc">S = −45 + 3 × 20 − 4 × 12,5<br>S = −45 + 60 − 50<br>S = 60 − 95<br>S = −35</p><p>Le solde est de −35 € : le compte est encore négatif. <i>(1 point)</i></p>`}
]}
};

/* clavier texte pour les réponses tapées (pour pouvoir écrire le signe −)
   et calculs en chaîne « A = … » dans les explications */
CH["4e-4"].quiz.forEach(N=>Object.values(N.q).forEach(list=>list.forEach((it,i)=>{
  const f=o=>Object.assign(qChain(o),{kb:"text"});
  if(it.g){ const g=it.g; list[i]={g:()=>f(g())}; } else list[i]=f(it);
})));
})();
