/* 3e — Chapitre 9 : Équations du premier degré (cours, fiche d'exercices, activité rapide et feuille tableur de M. Staal)
   Les lettres sont en italique (<i>x</i>). Chaque résolution est calculée par le code (outil window.EQ3) :
   ce qui est écrit dans les corrections est exactement le résultat du calcul. */
(function(){
const VF=["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const ch4=(good,bads)=>shuf(uniq(good,bads).slice(0,4));
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const ex=(p,alt,w)=>img("3k9ex/"+p+".png",alt,w);
const X=v=>`<i>${v}</i>`, $x=X("x"), $n=X("n"), $y=X("y");
const r6=v=>Math.round(v*1e6)/1e6;
/* écriture française d'un nombre : 2,5 · 1 200 · −3 */
const F=v=>{ const r=r6(v); const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const P=v=>v<0?`(${F(v)})`:F(v);
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const red=(p,q)=>{ if(q<0){ p=-p; q=-q; } const g=gcd(Math.abs(p),q)||1; return [p/g,q/g]; };
const isDec=q=>{ q=Math.abs(q); while(q%2===0) q/=2; while(q%5===0) q/=5; return q===1; };
/* fraction irréductible : −{9/7}, 4 */
const FR=(p,q)=>{ [p,q]=red(p,q); return q===1?F(p):(p<0?"−":"")+`{${Math.abs(p)}/${q}}`; };
/* solution écrite : {11/6} · {6/5} = 1,2 · 4 */
const SOL=(p,q)=>{ if(!Number.isInteger(p)||!Number.isInteger(q)) return F(p/q); [p,q]=red(p,q); return q===1||!isDec(q)?FR(p,q):`${FR(p,q)} = ${F(p/q)}`; };
/* réponses acceptées au clavier */
const TYP=(p,q)=>{ [p,q]=red(p,q); if(q===1) return [F(p)]; const f=(p<0?"−":"")+Math.abs(p)+"/"+q; return isDec(q)?[F(p/q),f]:[f]; };
/* quotient p ÷ q écrit en étapes : {22/12} = {11/6} · {9/−7} = −{9/7} · {−23/4} = −{23/4} = −5,75 */
const quo=(p,q)=>{ if(!Number.isInteger(p)||!Number.isInteger(q)) return `${F(p)} ÷ ${P(q)} = ${F(p/q)}`; if(p%q===0) return F(p/q);
  const raw = q>0 ? (p<0?"−":"")+`{${Math.abs(p)}/${q}}` : `{${F(p)}/${F(q)}}`; const rd=FR(p,q); let s=raw;
  if(rd!==raw) s+=" = "+rd; const [A,B]=red(p,q); if(isDec(B)) s+=" = "+F(A/B); return s; };
/* expressions */
const mono=(a,v="x")=>a===0?"0":a===1?X(v):a===-1?"−"+X(v):F(a)+X(v);
const lin=(a,b,v="x")=>a===0?F(b):mono(a,v)+(b>0?` + ${F(b)}`:b<0?` − ${F(-b)}`:"");
const linR=(b,a,v="x")=>b===0?mono(a,v):F(b)+(a>0?` + ${mono(a,v)}`:a<0?` − ${mono(-a,v)}`:"");
const OP=t=>`<span style="color:var(--c);font-weight:700">&emsp;(${t})</span>`;
const calc=L=>`<p class="calc">${L.map(l=>Array.isArray(l)?l[0]+OP(l[1]):l).join("<br>")}</p>`;
/* résolution de a·v + b = c·v + d (étapes) ; first = écriture de départ ; mir = l'inconnue est dans le membre de droite */
function steps(a,b,c,d,o={}){ const v=o.v||"x", sw=s=>{ if(!o.mir) return s; const [L,R]=s.split(" = "); return R+" = "+L; };
  /* (la ligne de la division s'écrit toujours « x = … ») */
  const L=[o.first||sw(`${lin(a,b,v)} = ${lin(c,d,v)}`)]; let A=a;
  if(c!==0){ A=a-c; L.push([sw(`${lin(A,b,v)} = ${F(d)}`), (c>0?"− ":"+ ")+mono(Math.abs(c),v)]); }
  if(b!==0) L.push([sw(`${mono(A,v)} = ${F(d-b)}`), (b>0?"− ":"+ ")+F(Math.abs(b))]);
  if(A!==1) L.push([`${X(v)} = ${quo(d-b,A)}`, "÷ "+P(A)]);
  return L; }
const concl=(p,q,v="x")=>`<p>La solution de l'équation est <b>${SOL(p,q)}</b>.</p>`;
const solve=(a,b,c,d,o={})=>calc(steps(a,b,c,d,o))+concl(d-b,a-c,o.v);
/* fraction dont le numérateur ou le dénominateur contient des balises (lettre en italique) */
const FX=(a,b)=>`<span class="fr"><span>${a}</span><span>${b}</span></span>`;
const prog=(titre,L)=>`<div class="pgc">${titre?`<b>${titre}</b>`:""}<ul>${L.map(s=>`<li>${s}</li>`).join("")}</ul></div>`;
const tab=(head,rows)=>`<div class="scroll"><table class="std"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const cols=arr=>`<div class="calcs">${arr.map(s=>`<span>${s}</span>`).join("")}</div>`;
const L8="abcdefgh";

/* figure : carré de côté x + a et triangle équilatéral de côté x + b */
function carreTri(a,b,alt){ const T=(x,y,t,an="middle")=>`<text x="${x}" y="${y}" text-anchor="${an}" style="font-size:17px;fill:var(--ink)">${t}</text>`;
  const lx=s=>`<tspan style="font-style:italic">x</tspan> + ${s}`;
  const A=[230,176],B=[380,176],C=[305,176-150*Math.sqrt(3)/2];
  const tick=(p,q)=>{ const m=[(p[0]+q[0])/2,(p[1]+q[1])/2], L=Math.hypot(q[0]-p[0],q[1]-p[1]), u=[(q[0]-p[0])/L,(q[1]-p[1])/L], n=[-u[1],u[0]];
    return [-3.5,3.5].map(o=>`<line x1="${(m[0]+u[0]*o-n[0]*7).toFixed(1)}" y1="${(m[1]+u[1]*o-n[1]*7).toFixed(1)}" x2="${(m[0]+u[0]*o+n[0]*7).toFixed(1)}" y2="${(m[1]+u[1]*o+n[1]*7).toFixed(1)}" class="ln"/>`).join(""); };
  return `<svg class="fig" viewBox="0 0 420 200" width="400" role="img" aria-label="${alt||"Un carré et un triangle équilatéral"}">
   <rect x="40" y="56" width="120" height="120" class="ln"/>${T(100,44,lx(a))}
   <polygon points="${[A,B,C].map(p=>p.map(v=>v.toFixed(1)).join(",")).join(" ")}" class="ln" style="stroke-linejoin:round"/>${tick(A,B)}${tick(B,C)}${tick(C,A)}
   ${T(366,96,lx(b),"start")}</svg>`; }
/* figure : rectangle (longueur L, largeur l) et carré de côté c — textes déjà écrits */
function rectCar(Lt,lt,ct){ const T=(x,y,t,an="middle")=>`<text x="${x}" y="${y}" text-anchor="${an}" style="font-size:17px;fill:var(--ink)">${t}</text>`;
  return `<svg class="fig" viewBox="0 0 470 190" width="440" role="img" aria-label="Un rectangle et un carré">
   <rect x="20" y="60" width="230" height="90" class="ln"/>${T(135,48,Lt)}${T(258,110,lt,"start")}
   <rect x="320" y="40" width="110" height="110" class="ln"/>${T(375,30,ct)}</svg>`; }
window.EQ3={FX,F,P,X,FR,SOL,TYP,quo,mono,lin,linR,OP,calc,steps,solve,concl,prog,tab,cols,red,isDec,gcd,carreTri,rectCar};

/* ===================== schémas (rappels en image) ===================== */
const S_DEF=sch("Équation du premier degré",`<p class="calc">5${$x} + 3 = 8${$x} − 4 &emsp;→ oui<br>5${$x}² + 3 = 4${$x} + 2 &emsp;→ non (terme en ${$x}²)</p><p class="schN">Une équation est une égalité avec un nombre inconnu ${$x}. Une solution est une valeur de ${$x} qui rend l'égalité vraie.</p>`);
const S_TEST=sch("Tester un nombre",`<p class="calc">5${$x} + 2 = 10 + 3${$x} avec ${$x} = 4 :<br>5 × 4 + 2 = 22 &emsp; 10 + 3 × 4 = 22</p><p class="schN">On calcule séparément les deux membres. S'ils sont égaux, le nombre est solution.</p>`);
const S_SIMPLE=sch("Isoler l'inconnue",`<p class="calc">${$x} + 4 = 7 → ${$x} = 7 − 4 = 3<br>−5${$x} = 20 → ${$x} = 20 ÷ (−5) = −4<br>${FX($x,3)} = 4 → ${$x} = 4 × 3 = 12</p><p class="schN">On fait la même opération dans les deux membres pour isoler ${$x}.</p>`);
const S_AXB=sch("Résoudre a<i>x</i> + b = c",calc([`6${$x} − 10 = 20`,[`6${$x} = 30`,"+ 10"],[`${$x} = 5`,"÷ 6"]])+`<p class="schN">On « élimine » d'abord le nombre, puis on divise par le coefficient de ${$x}.</p>`);
const S_CXD=sch("Résoudre a<i>x</i> + b = c<i>x</i> + d",calc([`5${$x} + 2 = 10 + 3${$x}`,[`2${$x} + 2 = 10`,"− 3"+$x],[`2${$x} = 8`,"− 2"],[`${$x} = 4`,"÷ 2"]])+`<p class="schN">1) Les ${$x} d'un seul côté. 2) Les nombres de l'autre côté. 3) On divise. 4) On conclut.</p>`);
const S_PB=sch("Mettre un problème en équation",`<p class="schN">1) Je choisis l'inconnue ${$x}. 2) J'écris l'équation. 3) Je la résous. 4) Je réponds à la question.</p><p class="calc">« Multiplier par 5 puis ajouter 3 donne 21,5 »<br>5${$x} + 3 = 21,5 → 5${$x} = 18,5 → ${$x} = 3,7</p>`);

/* ===================== contenus fixes ===================== */
const PA=prog("Programme A",["Choisir un nombre","Multiplier par 8","Ajouter 7"]), PB=prog("Programme B",["Choisir un nombre","Multiplier par 5","Ajouter 12"]);
const P1=prog("Programme 1",["Choisir un nombre","Soustraire 4","Calculer le carré du résultat obtenu"]), P2=prog("Programme 2",["Choisir un nombre","Calculer le carré de ce nombre","Ajouter le double du nombre de départ"]);
const RAPPEL=`<p>Une formule de calcul commence <b>toujours</b> par « = ».</p>${tab(["Opérations","Addition","Soustraction","Multiplication","Division","Puissance"],[["Signe","+","-","*","/","^"]])}`;
const range=(a,b,s=1)=>{ const r=[]; for(let v=a; v<=b+1e-9; v+=s) r.push(r6(v)); return r; };
const sheet=(xs,rows)=>tab(["","A",...xs.map((_,i)=>String.fromCharCode(66+i))],[["1","Nombre de départ",...xs.map(F)],...rows.map((r,i)=>[String(i+2),r[0],...xs.map(v=>r[1]?F(r[1](v)):"")])]);
const A3x=range(0,7);

/* Activité 1 et exercices 1, 3 : [écriture, a, b, c, d, options] pour a·v + b = c·v + d */
const ACT1=[[`${$x} + 4 = 7`,1,4,0,7],[`${$x} − 5 = 3`,1,-5,0,3],[`−8 + ${$x} = −11`,1,-8,0,-11],[`−6 = ${$x} + 4`,1,4,0,-6,{mir:1}],
  [`−5 × ${$x} = 20`,-5,0,0,20],[`10 = 4 × ${$x}`,4,0,0,10,{mir:1}],[`7${$x} = 5`,7,0,0,5]];
const EX1=[[`${$x} + 9 = 5`,1,9,0,5],[`${$x} − 5 = −13`,1,-5,0,-13],[`8${$x} = 5`,8,0,0,5],[`10 = −3 + ${$x}`,1,-3,0,10,{mir:1}],
  [`−23 = 4${$x}`,4,0,0,-23,{mir:1}],[`−3 = ${$x} + 5`,1,5,0,-3,{mir:1}],[`−6${$x} = −25,8`,-6,0,0,-25.8],[`3${$x} = 8`,3,0,0,8]];
const EX3=[[`${$n} × 7 + 5 = 26`,7,5,0,26,{v:"n"}],[`−8${$x} + 3 = −2`,-8,3,0,-2],[`6${$n} − 10 = 20`,6,-10,0,20,{v:"n"}],[`10 + 3${$x} = 6`,3,10,0,6],
  [`−7 + 5${$y} = −4`,5,-7,0,-4,{v:"y"}],[`12 = 4${$x} + 9`,4,9,0,12,{mir:1}],[`−3${$x} − 7 = 13`,-3,-7,0,13],[`8 − 2${$x} = −5`,-2,8,0,-5]];
const EX5=[[`8${$x} + 3 = 3${$x} + 9`,8,3,3,9],[`3${$x} − 7 = 10${$x} + 2`,3,-7,10,2],[`−4${$x} + 2 = 6${$x} − 10`,-4,2,6,-10]];
/* −6x = −25,8 : on travaille en dixièmes pour le calcul exact */
const solveRow=([s,a,b,c,d,o={}])=>{ if(!Number.isInteger(d)) return calc([s,[`${X(o.v||"x")} = ${F(d)} ÷ ${P(a)} = ${F(d/a)}`,"÷ "+P(a)]])+`<p>La solution de l'équation est <b>${F(d/a)}</b>.</p>`; return solve(a,b,c,d,{...o, first:s}); };
const list=(rows,start=0)=>rows.map((r,i)=>`<p><b>${L8[i+start]})</b> ${r[0]}</p>`).join("");
const corrList=(rows,start=0)=>rows.map((r,i)=>`<p><b>${L8[i+start]})</b></p>${solveRow(r)}`).join("");
Object.assign(window.EQ3,{solveRow, sheet, range, RAPPEL});

CH["3e-9"] = {
intro:"Reconnaître une équation du premier degré, la résoudre en isolant l'inconnue, vérifier la solution et résoudre des problèmes (programmes de calcul, périmètres, prix) à l'aide d'une équation.",
savoir:[
  "reconnaître une équation du premier degré à une inconnue ;",
  "tester si un nombre est solution d'une équation ;",
  `résoudre une équation de la forme a${$x} + b = c${$x} + d, en développant et en réduisant d'abord si nécessaire ;`,
  "vérifier une solution avec la calculatrice ;",
  "résoudre un problème à l'aide d'une équation (programmes de calcul, tableur, périmètres)."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Définition", h:`
  <div class="retenir" data-l="Définition"><p>Une <b>équation</b> est une égalité qui comporte <b>un ou plusieurs nombres inconnus</b>, désignés par une lettre.</p><p>On appelle ces nombres des <b>inconnues</b>.</p></div>
  <p>Dans ce chapitre, nous étudions les <b>équations du 1<sup>er</sup> degré à une inconnue</b>, c'est-à-dire les équations de la forme :</p>
  <p class="calc">a${$x} + b = c${$x} + d &emsp;avec a ≠ c</p>
  <p>Équations du <b>1<sup>er</sup> degré</b> : l'exposant de l'inconnue est au plus égal à 1 (pas de terme en ${$x}², ${$x}<sup>3</sup> ou plus).</p>
  <p>Équations à <b>une inconnue</b> : la seule inconnue est ${$x}.</p>
  <p><b>Exemple :</b> entoure les équations du premier degré à une inconnue.</p>
  ${cols([`5${$x} + 3 = 8${$x} − 4`,`5${$x}² + 3 = 4${$x} + 2`,`−2${$x} + 5 = −6`])}
  <details><summary>Voir la correction</summary><div class="corr"><p>On entoure 5${$x} + 3 = 8${$x} − 4 et −2${$x} + 5 = −6.</p><p>5${$x}² + 3 = 4${$x} + 2 n'est pas du 1<sup>er</sup> degré : il y a un terme en ${$x}².</p></div></details>`},
{k:"II", t:"Résoudre une équation", h:`
  <div class="retenir" data-l="Définition"><p><b>Résoudre une équation</b>, c'est trouver toutes les valeurs que l'on peut donner à l'inconnue pour que l'égalité soit vraie.</p><p>Ces valeurs, lorsqu'elles existent, sont appelées les <b>solutions de l'équation</b>.</p></div>
  <div class="retenir" data-l="Propriété"><p>Une équation du 1<sup>er</sup> degré à une inconnue a${$x} + b = c${$x} + d admet <b>une seule et unique solution</b>.</p><p>Pour la résoudre, il faut trouver la valeur de ${$x} pour laquelle l'égalité est vraie.</p></div>
  <p><b>Exemple :</b> résoudre l'équation 5${$x} + 2 = 10 + 3${$x}.</p>
  <div class="retenir" data-l="Méthode"><p>Si nécessaire, développer et réduire les deux membres de l'équation de départ pour se retrouver avec une équation de la forme a${$x} + b = c${$x} + d.</p>
   <div class="scroll"><table class="std"><thead><tr><th>Résolution</th><th>Étape</th></tr></thead><tbody>
    <tr><td>5${$x} + 2 = 10 + 3${$x}</td><td>Équation de départ.</td></tr>
    <tr><td>2${$x} + 2 = 10${OP("− 3"+$x)}</td><td><b>1 –</b> On « élimine » les inconnues dans un membre. Ici le membre de droite.</td></tr>
    <tr><td>2${$x} = 8${OP("− 2")}</td><td><b>2 –</b> On « élimine » les nombres de l'autre membre. Ici le membre de gauche.</td></tr>
    <tr><td>${$x} = 4${OP("÷ 2")}</td><td><b>3 –</b> On isole ${$x}. Ici en divisant par 2. On trouve alors la valeur de l'inconnue.</td></tr>
    <tr><td>La solution de l'équation est 4.</td><td><b>4 –</b> On conclut.</td></tr></tbody></table></div>
   <p>Entre parenthèses : l'opération faite <b>dans les deux membres</b>.</p></div>
  <div class="attention"><b>Vérification :</b> à ne pas écrire sur la copie ! Juste pour valider ton résultat à la fin, avec la calculatrice.</div>
  <p class="calc">5 × <b>4</b> + 2 = 22 &emsp; Avec ${$x} = 4, le membre de gauche est égal à 22.<br>10 + 3 × <b>4</b> = 22 &emsp; Avec ${$x} = 4, le membre de droite est égal à 22.</p>
  <p>Donc notre résolution est correcte : 4 est bien la solution de l'équation 5${$x} + 2 = 10 + 3${$x}.</p>`},
{k:"III", t:"Résoudre un problème à l'aide d'équations", h:`
  <div class="retenir" data-l="Méthode"><p>On peut résoudre un problème à l'aide d'une équation. Pour cela, il faut :</p>
   <p><b>1)</b> choisir l'inconnue : le nombre cherché, que l'on note ${$x} ;</p><p><b>2)</b> mettre le problème en équation ;</p><p><b>3)</b> résoudre l'équation ;</p><p><b>4)</b> conclure : répondre à la question du problème par une phrase.</p></div>
  <p><b>Problème :</b> voici deux programmes de calcul.</p>${P1}${P2}
  <p><b>1 – a)</b> Louise choisit le nombre −3 et applique le programme 1. Montre qu'elle obtiendra 49.</p>
  <p><b>b)</b> Elle reprend le nombre −3 et applique le programme 2. Quel résultat va-t-elle obtenir ?</p>
  <p><b>2 –</b> Montre que le résultat du programme 1 en fonction de ${$x} peut s'écrire sous forme développée et réduite : ${$x}² − 8${$x} + 16.</p>
  <p><b>3 –</b> Louise souhaite trouver un nombre pour lequel les deux programmes donnent le même résultat. Quel est le nombre que cherche Louise ?</p>
  <details><summary>Voir la correction</summary><div class="corr">
   <p><b>1 – a)</b> −3 − 4 = −7 puis (−7)² = 49. Louise obtient bien 49.</p>
   <p><b>b)</b> (−3)² = 9 puis 9 + 2 × (−3) = 9 − 6 = 3. Elle obtient 3.</p>
   <p><b>2 –</b> On note A le résultat du programme 1 :</p><p class="calc">A = (${$x} − 4)²<br>A = (${$x} − 4)(${$x} − 4)<br>A = ${$x}² − 4${$x} − 4${$x} + 16<br>A = ${$x}² − 8${$x} + 16</p>
   <p><b>3 –</b> Programme 2 : ${$x}² + 2${$x}. On résout l'équation :</p>
   ${calc([`${$x}² − 8${$x} + 16 = ${$x}² + 2${$x}`,[`−8${$x} + 16 = 2${$x}`,"− "+$x+"²"],[`16 = 10${$x}`,"+ 8"+$x],[`{16/10} = ${$x}`,"÷ 10"],`${$x} = 1,6`])}
   <p>Louise cherche le nombre <b>1,6</b>.</p><p><i>Vérification : (1,6 − 4)² = 5,76 et 1,6² + 2 × 1,6 = 2,56 + 3,2 = 5,76.</i></p></div></details>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Trouver la valeur de l'inconnue", e:[
  {n:"Activité 1", t:"Trouver la valeur de x", w:"Sur ton cahier", h:`<p>Dans chaque cas, trouve la valeur de ${$x} en expliquant tes étapes de calcul.</p>
   ${cols([...ACT1.map((r,i)=>`<b>Cas n°${i+1} :</b> ${r[0]}`),`<b>Cas n°8 :</b> ${FX($x,3)} = 4`])}`,
   c:`${ACT1.map((r,i)=>`<p><b>Cas n°${i+1}</b></p>${solveRow(r)}`).join("")}<p><b>Cas n°8</b></p>${calc([`${FX($x,3)} = 4`,[`${$x} = 4 × 3 = 12`,"× 3"]])}<p>La solution de l'équation est <b>12</b>.</p>`},
  {n:"Exercice 1", t:"Résoudre des équations", w:"Sur ton cahier", h:`<p>Résous les équations suivantes.</p>${cols(EX1.map((r,i)=>`<b>${L8[i]})</b> ${r[0]}`))}`,
   c:corrList(EX1)}
 ]},
{t:"Programmes de calcul et équations a<i>x</i> + b = c", e:[
  {n:"Activité 2", t:"Avec un programme, trouver le résultat ou le nombre de départ", w:"Sur ton cahier", h:`<p>On donne le programme de calcul suivant :</p>${prog("",["Choisir un nombre","Multiplier par 5","Ajouter 3"])}
   <p><b>1 –</b> Louise choisit le nombre −6 et applique le programme. Montre qu'elle obtiendra −27.</p><p><b>2 –</b> Paul choisit le nombre −4 et applique le programme. Quel résultat va-t-il obtenir ?</p><p><b>3 –</b> Timéo a choisi un nombre, a appliqué le programme et a trouvé 21,5. Quel était son nombre de départ ?</p>`,
   c:`<p><b>1 –</b> −6 × 5 = −30 puis −30 + 3 = −27. Louise obtient bien −27.</p><p><b>2 –</b> −4 × 5 = −20 puis −20 + 3 = −17. Paul obtient −17.</p>
   <p><b>3 –</b> On appelle ${$x} le nombre de départ de Timéo. Le programme donne 5${$x} + 3. On résout :</p>${calc(steps(5,3,0,21.5))}<p>Le nombre de départ de Timéo était <b>3,7</b>.</p>`},
  {n:"Exercice 2", t:"Trouve le nombre choisi au départ", w:"Sur ton cahier", h:`<p>Résous ces deux problèmes à l'aide d'équations.</p>
   <p><b>Problème 1 :</b> on donne le programme de calcul suivant :</p>${prog("",["Choisir un nombre","Multiplier par 7","Soustraire 5"])}<p>Léa a choisi un nombre, a appliqué le programme et a trouvé 1,02. Quel était son nombre de départ ?</p>
   <p><b>Problème 2 :</b> on donne le programme de calcul suivant :</p>${prog("",["Choisir un nombre","Multiplier par −4","Ajouter 5"])}<p>Quel nombre doit-on choisir pour obtenir −6 avec ce programme ?</p>`,
   c:`<p><b>Problème 1 :</b> on note ${$x} le nombre de départ. Le programme donne 7${$x} − 5.</p>${calc([`7${$x} − 5 = 1,02`,[`7${$x} = 6,02`,"+ 5"],[`${$x} = 6,02 ÷ 7 = 0,86`,"÷ 7"]])}<p>Le nombre de départ de Léa était <b>0,86</b>.</p>
   <p><b>Problème 2 :</b> le programme donne −4${$x} + 5.</p>${calc(steps(-4,5,0,-6))}<p>Il faut choisir <b>2,75</b>.</p>`},
  {n:"Exercice 3", t:"Entraînement : équations de la forme a<i>x</i> + b = c", w:"Sur ton cahier", h:`<p>Résous les équations suivantes.</p>${cols(EX3.map((r,i)=>`<b>${L8[i]})</b> ${r[0]}`))}`,
   c:corrList(EX3)},
  {n:"Exercice 4", t:"Penser à développer et à réduire chaque membre", w:"Sur ton cahier", h:`<p><b>1 –</b> Lis la partie « Cours » avant de faire l'exercice.</p>
   <div class="retenir" data-l="Cours"><p>Avant de résoudre une équation, il faut <b>développer et réduire</b> chaque membre de l'équation.</p></div>
   <p><b>Exemple :</b> résoudre l'équation 6(2${$x} − 5) = −8.</p>${calc([`6(2${$x} − 5) = −8`,`6 × 2${$x} + 6 × (−5) = −8`,`12${$x} − 30 = −8`,[`12${$x} = 22`,"+ 30"],[`${$x} = {22/12} = {11/6}`,"÷ 12"]])}<p>La solution de l'équation est {11/6}.</p>
   <p><b>2 –</b> Résous les équations suivantes.</p>${cols([`<b>a)</b> −2(3${$x} − 5) = −2`,`<b>b)</b> 10${$x} − (6${$x} + 6) = 5`])}`,
   c:`<p><b>a)</b></p>${calc([`−2(3${$x} − 5) = −2`,`−2 × 3${$x} + (−2) × (−5) = −2`,`−6${$x} + 10 = −2`,...steps(-6,10,0,-2).slice(1)])}${concl(-12,-6)}
   <p><b>b)</b> Attention au signe « − » devant la parenthèse : on change les signes des termes de la parenthèse.</p>${calc([`10${$x} − (6${$x} + 6) = 5`,`10${$x} − 6${$x} − 6 = 5`,`4${$x} − 6 = 5`,...steps(4,-6,0,5).slice(1)])}${concl(11,4)}`}
 ]},
{t:"Équations de la forme a<i>x</i> + b = c<i>x</i> + d", e:[
  {n:"Activité 3", t:"Même résultat avec deux programmes : quel est le nombre de départ ?", w:"Sur ton cahier", h:`<p>On donne les deux programmes de calcul suivants :</p>${PA}${PB}
   <p><b>1 – a)</b> Louise choisit le nombre −3 et applique le programme A. Montre qu'elle obtiendra −17.</p><p><b>b)</b> Elle reprend le nombre −3 et applique le programme B. Quel résultat va-t-elle obtenir ?</p>
   <p><b>2 –</b> Louise souhaite trouver un nombre pour lequel les deux programmes donnent le même résultat. Quel est le nombre que cherche Louise ?</p>
   <p><b>Utilisation du tableur</b> : le tableur est un outil de calcul rapide, plus rapide que la calculatrice !</p>${RAPPEL}
   <p>Pour avoir une idée de la réponse, on utilise la feuille de calcul suivante :</p>${sheet(A3x,[["Résultat du programme A"],["Résultat du programme B"]])}
   <p><b>a)</b> Quelle formule doit-on saisir dans la cellule B2, puis étirer jusqu'à la cellule I2, pour obtenir les résultats du programme A ?</p><p><b>b)</b> Quelle formule doit-on saisir dans la cellule B3, puis étirer jusqu'à la cellule I3, pour obtenir les résultats du programme B ?</p>
   <p>On obtient les résultats suivants :</p>${sheet(A3x,[["Résultat du programme A",v=>8*v+7],["Résultat du programme B",v=>5*v+12]])}
   <p>Au vu du tableau, quelle conjecture peut-on faire sur l'encadrement à l'unité du nombre à saisir pour obtenir le même résultat ?</p>
   <p>Détermine par le calcul le nombre de départ à saisir pour obtenir le même résultat, et vérifie la conjecture sur l'encadrement.</p>`,
   c:`<p><b>1 – a)</b> −3 × 8 = −24 puis −24 + 7 = −17. Louise obtient bien −17.</p><p><b>b)</b> −3 × 5 = −15 puis −15 + 12 = −3. Elle obtient −3.</p>
   <p><b>Tableur : a)</b> dans B2 : <b>=B1*8+7</b> · <b>b)</b> dans B3 : <b>=B1*5+12</b></p>
   <p><b>Conjecture :</b> pour 1, A donne 15 et B donne 17 (A &lt; B) ; pour 2, A donne 23 et B donne 22 (A &gt; B). Le nombre cherché est compris entre 1 et 2.</p>
   <p><b>2 –</b> On note ${$x} le nombre de départ. Programme A : 8${$x} + 7 ; programme B : 5${$x} + 12.</p>${calc(steps(8,7,5,12))}
   <p>Louise cherche le nombre <b>{5/3}</b>. {5/3} ≈ 1,67 est bien compris entre 1 et 2 : la conjecture est vérifiée.</p>`},
  {n:"Exercice 5", t:"Résoudre des équations de la forme a<i>x</i> + b = c<i>x</i> + d", w:"Sur ton cahier", h:`<p><b>1 –</b> Résous les équations suivantes.</p>${cols([...EX5.map((r,i)=>`<b>${L8[i]})</b> ${r[0]}`),`<b>d)</b> 4${$x}² − 5${$x} + 2 = 4${$x}² + 3${$x} + 12`])}
   <p><b>2 –</b> Vérifie ton résultat en testant chaque membre de l'égalité avec le nombre trouvé.</p>`,
   c:`${corrList(EX5)}<p><b>d)</b> On commence par enlever 4${$x}² dans les deux membres.</p>${calc([`4${$x}² − 5${$x} + 2 = 4${$x}² + 3${$x} + 12`,[`−5${$x} + 2 = 3${$x} + 12`,"− 4"+$x+"²"],...steps(-5,2,3,12).slice(1)])}${concl(10,-8)}
   <p><b>2 – Vérifications :</b></p><p>a) 8 × 1,2 + 3 = 12,6 et 3 × 1,2 + 9 = 12,6.</p><p>b) 3 × ({−9/7}) − 7 = {−76/7} et 10 × ({−9/7}) + 2 = {−76/7}.</p><p>c) −4 × 1,2 + 2 = −2,8 et 6 × 1,2 − 10 = −2,8.</p><p>d) −5 × (−1,25) + 2 = 8,25 et 3 × (−1,25) + 12 = 8,25 (les termes en ${$x}² sont égaux dans les deux membres).</p>`}
 ]},
{t:"Résoudre des problèmes", e:[
  {n:"Exercice 6", t:"Le prix d'un lot de stylos", w:"Sur ton cahier", h:`<p>Lors d'une vente caritative, Damian et Ruben devaient vendre des lots de stylos.</p><p>Damian a vendu 12 lots et reçu 20 € de dons.</p><p>Ruben a vendu 15 lots et reçu 2 € de dons.</p><p>Ils ont tous les deux récolté la même somme.</p><p>Détermine le prix, en euros, d'un lot de stylos.</p>`,
   c:`<p>On note ${$x} le prix d'un lot, en euros. Damian a récolté 12${$x} + 20 et Ruben 15${$x} + 2.</p>${calc(steps(12,20,15,2))}<p>Un lot de stylos coûte <b>6 €</b>.</p><p><i>Vérification : 12 × 6 + 20 = 92 et 15 × 6 + 2 = 92.</i></p>`},
  {n:"Activité rapide", t:"Comprendre un programme Scratch", w:"Sur ton cahier", h:`<p>Voici deux séries de deux programmes Scratch. On prend ${$x} comme nombre de départ.</p>
   <p>Pour chaque programme, écris le résultat en fonction de ${$x}. Il n'est pas demandé de développer et de réduire l'expression obtenue.</p>
   <p><b>Série 1</b></p><div class="figs"><figure>${ex("ar1","Programme Scratch 1 de la série 1 : a prend la valeur réponse moins 4, b prend la valeur a fois a, Résultat prend la valeur b moins 10",240)}<figcaption>Programme 1</figcaption></figure><figure>${ex("ar2","Programme Scratch 2 de la série 1 : a prend la valeur réponse plus 5, b prend la valeur réponse moins 2, Résultat prend la valeur a fois b",260)}<figcaption>Programme 2</figcaption></figure></div>
   <p><b>Série 2</b></p><div class="figs"><figure>${ex("ar3","Programme Scratch 1 de la série 2 : a prend la valeur réponse plus 3, b prend la valeur a fois 10, c prend la valeur b moins 5, dire c",240)}<figcaption>Programme 1</figcaption></figure><figure>${ex("ar4","Programme Scratch 2 de la série 2 : a prend la valeur réponse plus 3, puis a prend la valeur a fois 10, puis a prend la valeur a moins 5, dire a",240)}<figcaption>Programme 2</figcaption></figure></div>`,
   c:`<p><b>Série 1 :</b> programme 1 : (${$x} − 4) × (${$x} − 4) − 10, soit (${$x} − 4)² − 10 · programme 2 : (${$x} + 5)(${$x} − 2).</p>
   <p><b>Série 2 :</b> programme 1 : (${$x} + 3) × 10 − 5 · programme 2 : (${$x} + 3) × 10 − 5 aussi.</p><p>Dans le programme 2, la variable a change de valeur à chaque ligne : les deux programmes donnent le même résultat.</p>`},
  {n:"Exercice 7", t:"Exercice de brevet 2020", w:"Sur ton cahier", h:`<p>On donne les deux programmes de calcul suivants :</p>${prog("Programme A",["Choisir un nombre","Soustraire 5 à ce nombre","Multiplier le résultat par le nombre de départ"])}${prog("Programme B",["Choisir un nombre","Mettre ce nombre au carré","Soustraire 4 au résultat"])}
   <p><b>1.</b> Alice choisit le nombre 4 et applique le programme A. Montre qu'elle obtiendra −4.</p><p><b>2.</b> Lucie choisit le nombre −3 et applique le programme B. Quel résultat va-t-elle obtenir ?</p>
   <p>Tom souhaite trouver un nombre pour lequel les deux programmes de calcul donnent le même résultat. Il choisit ${$x} comme nombre de départ pour les deux programmes.</p>
   <p><b>3.</b> Montre que le résultat du programme A peut s'écrire ${$x}² − 5${$x}.</p><p><b>4.</b> Exprime en fonction de ${$x} le résultat obtenu avec le programme B.</p><p><b>5.</b> Quel est le nombre que Tom cherche ?</p><p><i>Toute trace de recherche, même non aboutie, sera prise en compte dans la notation.</i></p>`,
   c:`<p><b>1.</b> 4 − 5 = −1 puis −1 × 4 = −4. Alice obtient bien −4.</p><p><b>2.</b> (−3)² = 9 puis 9 − 4 = 5. Lucie obtient 5.</p>
   <p><b>3.</b> On note A le résultat du programme A :</p><p class="calc">A = (${$x} − 5) × ${$x}<br>A = ${$x} × ${$x} − 5 × ${$x}<br>A = ${$x}² − 5${$x}</p><p><b>4.</b> Programme B : ${$x}² − 4.</p>
   <p><b>5.</b></p>${calc([`${$x}² − 5${$x} = ${$x}² − 4`,[`−5${$x} = −4`,"− "+$x+"²"],[`${$x} = {−4/−5} = {4/5} = 0,8`,"÷ (−5)"]])}<p>Tom cherche le nombre <b>0,8</b>.</p><p><i>Vérification : (0,8 − 5) × 0,8 = −3,36 et 0,8² − 4 = −3,36.</i></p>`},
  {n:"Exercice 8", t:"Exercice de brevet 2015", w:"Sur ton cahier", h:`<p><b>Partie 1.</b> Mathilde et Paul saisissent sur leur calculatrice un même nombre. Voici leurs programmes de calcul :</p>
   ${prog("Programme de calcul de Mathilde",["Saisir un nombre","Multiplier ce nombre par 9","Soustraire 8 au résultat obtenu"])}${prog("Programme de calcul de Paul",["Saisir un nombre","Multiplier ce nombre par −3","Ajouter 31 au résultat obtenu"])}
   <p><b>1.</b> On considère la feuille de calcul suivante :</p>${sheet(range(0,10),[["Mathilde"],["Paul"]])}
   <p><b>a.</b> Quelle formule doit-on saisir dans la cellule B2, puis étirer jusqu'à la cellule L2, pour obtenir les résultats obtenus par Mathilde ?</p><p><b>b.</b> Quelle formule doit-on saisir dans la cellule B3, puis étirer jusqu'à la cellule L3, pour obtenir les résultats obtenus par Paul ?</p>
   <p><b>2.</b> Voici ce que la feuille de calcul fait apparaître après avoir correctement programmé les cellules B2 et B3.</p>${sheet(range(0,10),[["Mathilde",v=>9*v-8],["Paul",v=>-3*v+31]])}
   <p>Mathilde et Paul cherchent à obtenir le même résultat. Au vu du tableau, quelle conjecture peut-on faire sur l'encadrement à l'unité du nombre à saisir dans les programmes pour obtenir le même résultat ?</p>
   <p><b>3.</b> Détermine par le calcul le nombre de départ à saisir par Mathilde et Paul pour obtenir le même résultat, et vérifie la conjecture sur l'encadrement.</p>
   <p><b>Partie 2.</b> Voici un programme Scratch :</p>${ex("e8","Programme Scratch : demander un nombre, mettre A à réponse, mettre A à A plus 3, mettre A à A fois 2, mettre A à A moins 5, dire le programme de calcul donne A",300)}
   <p><b>a.</b> Écris sur ta copie les deux dernières étapes du programme de calcul :</p>${prog("",["Choisir un nombre.","Ajouter 3 à ce nombre.","…","…"])}
   <p><b>b.</b> Si on choisit le nombre 8 au départ, quel sera le résultat ?</p><p><b>c.</b> Si on choisit ${$x} comme nombre de départ, montre que le résultat obtenu avec ce programme de calcul sera 2${$x} + 1.</p><p><b>d.</b> Quel nombre doit-on choisir au départ pour obtenir 6 ?</p>`,
   c:`<p><b>Partie 1. 1. a.</b> <b>=9*B1-8</b> · <b>b.</b> <b>=-3*B1+31</b></p>
   <p><b>2.</b> Pour 3 : Mathilde 19 et Paul 22 (Mathilde &lt; Paul). Pour 4 : Mathilde 28 et Paul 19 (Mathilde &gt; Paul). Le nombre cherché est compris entre 3 et 4.</p>
   <p><b>3.</b> On note ${$x} le nombre saisi. Mathilde : 9${$x} − 8 ; Paul : −3${$x} + 31.</p>${calc(steps(9,-8,-3,31))}<p>Il faut saisir <b>3,25</b>, qui est bien compris entre 3 et 4.</p>
   <p><b>Partie 2. a.</b> Multiplier le résultat par 2 · Soustraire 5.</p><p><b>b.</b> 8 + 3 = 11 ; 11 × 2 = 22 ; 22 − 5 = 17. Le résultat est 17.</p>
   <p><b>c.</b> On note R le résultat :</p><p class="calc">R = (${$x} + 3) × 2 − 5<br>R = 2${$x} + 6 − 5<br>R = 2${$x} + 1</p><p><b>d.</b></p>${calc(steps(2,1,0,6))}<p>Il faut choisir <b>2,5</b>.</p>`},
  {n:"Exercice 9", t:"Différence entre les deux énoncés", w:"Sur ton cahier", h:`<p>Les deux questions sont indépendantes.</p><div class="attention"><b>ATTENTION :</b> elles sont souvent confondues !</div>
   <p><b>1 –</b> Trouve la valeur de ${$x} pour laquelle 5(4${$x} − 3) = 8${$x} + 6.</p><p><b>2 –</b> Montre que, pour toutes les valeurs de ${$x}, on a 5(4${$x} − 3) = 14${$x} + 3(2${$x} − 5).</p>`,
   c:`<p><b>1 –</b> C'est une équation : on cherche <b>une</b> valeur de ${$x}.</p>${calc([`5(4${$x} − 3) = 8${$x} + 6`,`20${$x} − 15 = 8${$x} + 6`,...steps(20,-15,8,6).slice(1)])}${concl(21,12)}
   <p><b>2 –</b> C'est une égalité vraie pour <b>toutes</b> les valeurs de ${$x} : on développe et on réduit chaque membre séparément.</p>
   <p class="calc">A = 5(4${$x} − 3)<br>A = 20${$x} − 15</p><p class="calc">B = 14${$x} + 3(2${$x} − 5)<br>B = 14${$x} + 6${$x} − 15<br>B = 20${$x} − 15</p><p>A et B sont égaux à 20${$x} − 15 : l'égalité est vraie pour toutes les valeurs de ${$x}.</p>`},
  {n:"Exercice 10", t:"Même périmètre", w:"Sur ton cahier", h:`<p>${$x} est une longueur. Le triangle est équilatéral.</p>${carreTri(2,3)}<p>Quelle doit être la valeur de ${$x} pour que le triangle et le carré aient le même périmètre ?</p>`,
   c:`<p>Périmètre du carré : 4 × (${$x} + 2) = 4${$x} + 8.</p><p>Périmètre du triangle équilatéral : 3 × (${$x} + 3) = 3${$x} + 9.</p>${calc(steps(4,8,3,9))}<p>Pour ${$x} = <b>1</b>, le carré et le triangle ont le même périmètre (12).</p>`},
  {n:"Feuille tableur", t:"Retrouver un nombre avec le tableur", w:"Sur ton cahier", h:`<p>Le tableur n'est pas un simple outil de création de tableau : c'est un <b>outil de calcul</b>. On calcule avec le tableur, pas besoin de calculatrice !</p>${RAPPEL}
   <p><b>Problème :</b> voici deux programmes de calcul.</p>${P1}${P2}<p>Tom a choisi un nombre entre 1 et 2. En appliquant chacun des programmes, il a trouvé le même résultat.</p>
   <p><b>1 –</b> Line essaye de retrouver le nombre qu'il a choisi en utilisant le tableur. On considère la feuille de calcul suivante :</p>${sheet(range(1,2,0.1),[["Résultat du programme 1"],["Résultat du programme 2"]])}
   <p><b>a)</b> Quelle formule doit-on saisir dans la cellule B2, puis étirer jusqu'à la cellule L2, pour obtenir les résultats du programme 1 ?</p><p><b>b)</b> Quelle formule doit-on saisir dans la cellule B3, puis étirer jusqu'à la cellule L3, pour obtenir les résultats du programme 2 ?</p>
   <p><b>2 –</b> On obtient les résultats suivants :</p>${sheet(range(1,2,0.1),[["Résultat du programme 1",v=>(v-4)**2],["Résultat du programme 2",v=>v*v+2*v]])}<p>Quel nombre de départ a choisi Tom pour obtenir le même résultat avec les deux programmes ?</p>`,
   c:`<p><b>1 – a)</b> <b>=(B1-4)^2</b> · <b>b)</b> <b>=B1^2+2*B1</b></p><p><b>2 –</b> Dans la colonne H, pour 1,6, les deux programmes donnent 5,76. Tom a choisi <b>1,6</b>.</p><p>C'est bien la solution trouvée par le calcul dans le cours : ${$x}² − 8${$x} + 16 = ${$x}² + 2${$x} donne ${$x} = 1,6.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Équation du premier degré", schema:S_DEF, q:{
 1:[ {g:()=>{ const a=ri(2,9), b=ri(1,9), c=ri(2,9), d=ri(1,9), k=ri(2,9);
       const good=`${lin(a,b)} = ${lin(c===a?c+1:c,-d)}`;
       return {q:"Laquelle de ces égalités est une équation du premier degré à une inconnue ?", c:ch4(good,[`${a}${$x}² + ${b} = ${c}${$x}`,`${k} + ${b} = ${k+b}`,`${$x}<sup>3</sup> − ${d} = ${b}`]), rep:good, ex:"Il y a une inconnue et pas de terme en x², x³…", sx:S_DEF}; }} ],
 2:[ {g:()=>{ let a,b,c,d,k; do{ a=ri(2,9); c=ri(1,9); k=ri(-4,5); b=ri(-9,9); d=pick([ (a-c)*k+b, (a-c)*k+b+ri(1,3) ]); }while(a===c);
       const L=a*k+b, R=c*k+d, ok=L===R;
       return {q:`Le nombre ${F(k)} est-il solution de l'équation ${lin(a,b)} = ${lin(c,d)} ?`, c:["Oui","Non"], rep:ok?"Oui":"Non", ex:`Membre de gauche : ${a} × ${P(k)}${b===0?"":` ${b<0?"−":"+"} ${Math.abs(b)}`} = ${F(L)}. Membre de droite : ${c} × ${P(k)}${d===0?"":` ${d<0?"−":"+"} ${Math.abs(d)}`} = ${F(R)}. ${ok?"Ils sont égaux.":"Ils ne sont pas égaux."}`, sx:S_TEST}; }} ],
 3:[ {q:`Une équation de la forme a${$x} + b = c${$x} + d, avec a ≠ c, admet…`, c:["une seule solution","deux solutions","aucune solution","une infinité de solutions"], rep:"une seule solution", ex:"C'est la propriété du cours : une seule et unique solution.", sx:S_DEF},
     {g:()=>{ const a=ri(2,6), b=ri(1,9), c=ri(2,9), k=ri(-5,-1); const v=a*k*k+b+c*k; return {q:`Que vaut ${a}${$x}² + ${b} + ${c}${$x} pour ${$x} = ${F(k)} ?`, rep:F(v), ex:`${a} × ${P(k)}² + ${b} + ${c} × ${P(k)} = ${a*k*k} + ${b} ${c*k<0?"−":"+"} ${Math.abs(c*k)} = ${F(v)}.`, sx:S_TEST}; }} ]
}},
{nom:"Isoler l'inconnue", schema:S_SIMPLE, q:{
 1:[ {g:()=>{ const a=ri(-12,12)||5, s=ri(-15,15), b=s+a; return {q:`Résous l'équation ${lin(1,a)} = ${F(b)}.`, rep:F(s), ex:`${$x} = ${F(b)} ${a>0?"−":"+"} ${Math.abs(a)} = ${F(s)}.`, sx:S_SIMPLE}; }} ],
 2:[ {g:()=>{ const a=pick([-9,-8,-7,-6,-5,-4,-3,-2,2,3,4,5,6,7,8,9]), s=ri(-9,9)||3; return {q:`Résous l'équation ${mono(a)} = ${F(a*s)}.`, rep:F(s), ex:`${$x} = ${F(a*s)} ÷ ${P(a)} = ${F(s)}.`, sx:S_SIMPLE}; }},
     {g:()=>{ const a=ri(2,9), b=ri(-9,9)||4; return {q:`Résous l'équation ${FX($x,a)} = ${F(b)}.`, rep:F(a*b), ex:`On multiplie les deux membres par ${a} : ${$x} = ${F(b)} × ${a} = ${F(a*b)}.`, sx:S_SIMPLE}; }} ],
 3:[ {g:()=>{ let a,b; do{ a=ri(2,9); b=ri(1,12)*pick([1,-1]); }while(b%a===0||gcd(a,Math.abs(b))!==1); const good=FR(b,a);
       return {q:`Quelle est la solution de l'équation ${mono(a)} = ${F(b)} ?`, c:ch4(good,[FR(a,b),F(b-a),FR(-b,a)]), rep:good, ex:`${$x} = ${F(b)} ÷ ${a} = ${good}.`, sx:S_SIMPLE}; }} ]
}},
{nom:"Résoudre a<i>x</i> + b = c", schema:S_AXB, q:{
 1:[ {g:()=>{ const a=ri(2,9), s=ri(-6,9), b=ri(1,15)*pick([1,-1]); return {q:`Résous l'équation ${lin(a,b)} = ${F(a*s+b)}.`, rep:F(s), ex:`${mono(a)} = ${F(a*s+b)} ${b>0?"−":"+"} ${Math.abs(b)} = ${F(a*s)}, puis ${$x} = ${F(a*s)} ÷ ${a} = ${F(s)}.`, sx:S_AXB}; }} ],
 2:[ {g:()=>{ const a=-ri(2,9), s=ri(-6,8), b=ri(1,15); return {q:`Résous l'équation ${linR(b,a)} = ${F(a*s+b)}.`, rep:F(s), ex:`${mono(a)} = ${F(a*s+b)} − ${b} = ${F(a*s)}, puis ${$x} = ${F(a*s)} ÷ (${F(a)}) = ${F(s)}.`, sx:S_AXB}; }},
     {g:()=>{ const a=ri(2,9), s=ri(-6,8), b=ri(1,15)*pick([1,-1]); return {q:`Résous l'équation ${F(a*s+b)} = ${lin(a,b)}.`, rep:F(s), ex:`${F(a*s+b)} ${b>0?"−":"+"} ${Math.abs(b)} = ${mono(a)}, donc ${mono(a)} = ${F(a*s)} et ${$x} = ${F(s)}.`, sx:S_AXB}; }} ],
 3:[ {g:()=>{ let k,a,b,c; do{ k=pick([-3,-2,2,3,4,5,6]); a=ri(2,5); b=ri(1,6)*pick([1,-1]); c=ri(-20,20); }while((c-k*b)%(k*a)===0||c===0);
       const good=FR(c-k*b,k*a), dev=lin(k*a,k*b);
       return {q:`Quelle est la solution de l'équation ${k}(${lin(a,b)}) = ${F(c)} ?`, c:ch4(good,[FR(c-b,k*a),FR(c-k*b,a),FR(c+k*b,k*a)]), rep:good, ex:`On développe : ${dev} = ${F(c)}. Puis ${mono(k*a)} = ${F(c-k*b)} et ${$x} = ${good}.`, sx:S_AXB}; }} ]
}},
{nom:"Résoudre a<i>x</i> + b = c<i>x</i> + d", schema:S_CXD, q:{
 1:[ {g:()=>{ let a,c,s,b,d; do{ a=ri(3,10); c=ri(1,a-1); s=ri(-5,8); b=ri(-10,10); d=(a-c)*s+b; }while(Math.abs(d)>40);
       return {q:`Résous l'équation ${lin(a,b)} = ${lin(c,d)}.`, rep:F(s), ex:`${lin(a-c,b)} = ${F(d)} donc ${a-c===1?"":`${mono(a-c)} = ${F(d-b)} et `}${$x} = ${F(s)}.`, sx:S_CXD}; }} ],
 2:[ {g:()=>{ const a=ri(4,10), c=ri(1,a-1), b=ri(1,9), d=ri(1,15);
       const good=`${lin(a-c,b)} = ${F(d)}`;
       return {q:`On soustrait ${mono(c)} à chaque membre de l'équation ${lin(a,b)} = ${lin(c,d)}. On obtient :`, c:ch4(good,[`${lin(a+c,b)} = ${F(d)}`,`${lin(a-c,b)} = ${lin(c,d-c)}`,`${lin(a,b-c)} = ${F(d)}`]), rep:good, ex:`${mono(a)} − ${mono(c)} = ${mono(a-c)} et ${mono(c)} − ${mono(c)} = 0.`, sx:S_CXD}; }} ],
 3:[ {g:()=>{ let a,b,c,d; do{ a=ri(-9,9); c=ri(-9,9); b=ri(-12,12); d=ri(-12,12); }while(a===c||a===0||c===0||a+c===0||(d-b)%(a-c)===0);
       const good=FR(d-b,a-c);
       return {q:`Quelle est la solution de l'équation ${lin(a,b)} = ${lin(c,d)} ?`, c:ch4(good,[FR(d-b,a+c),FR(d+b,a-c),FR(a-c,d-b)]), rep:good, ex:`${mono(a-c)} = ${F(d-b)} donc ${$x} = ${quo(d-b,a-c)}.`, sx:S_CXD}; }},
     {g:()=>{ let k,a,c,b,d; do{ k=ri(2,6); a=ri(-6,6); c=ri(-6,6); b=ri(-9,9); d=ri(-9,9); }while(a===c||a===0||c===0||b===0||d===0||(d-b)%(a-c)!==0);
       const s=(d-b)/(a-c); return {q:`Résous l'équation ${k}${$x}² ${a<0?"−":"+"} ${mono(Math.abs(a))} ${b<0?"−":"+"} ${Math.abs(b)} = ${k}${$x}² ${c<0?"−":"+"} ${mono(Math.abs(c))} ${d<0?"−":"+"} ${Math.abs(d)}.`, rep:F(s), ex:`On enlève ${k}${$x}² dans les deux membres : ${lin(a,b)} = ${lin(c,d)}, donc ${a-c===1?"":`${mono(a-c)} = ${F(d-b)} et `}${$x} = ${F(s)}.`, sx:S_CXD}; }} ]
}},
{nom:"Résoudre un problème", schema:S_PB, q:{
 1:[ {g:()=>{ const a=ri(2,9), b=ri(1,12), s=ri(-30,60)/10; const R=r6(a*s+b); return {q:`Programme : « choisir un nombre ; multiplier par ${a} ; ajouter ${b} ». On obtient ${F(R)}. Quel était le nombre de départ ?`, rep:F(s), ex:`${lin(a,b)} = ${F(R)} donc ${mono(a)} = ${F(R-b)} et ${$x} = ${F(R-b)} ÷ ${a} = ${F(s)}.`, sx:S_PB}; }} ],
 2:[ {g:()=>{ let n1,n2,d1,d2,p; do{ n1=ri(8,15); n2=n1+ri(2,5); p=ri(3,9); d2=ri(1,10); d1=d2+(n2-n1)*p; }while(d1>40);
       return {q:`Damian a vendu ${n1} lots de stylos et reçu ${d1} € de dons. Ruben a vendu ${n2} lots et reçu ${d2} € de dons. Ils ont récolté la même somme. Quel est le prix d'un lot, en euros ?`, rep:[String(p),p+" €",p+"€"], ex:`${n1}${$x} + ${d1} = ${n2}${$x} + ${d2} donc ${d1-d2} = ${n2-n1}${$x} et ${$x} = ${p}.`, sx:S_PB}; }} ],
 3:[ {g:()=>{ let a,b,c,d; do{ a=ri(5,10); c=ri(2,a-1); b=ri(1,10); d=ri(b+1,20); }while((d-b)%(a-c)===0);
       const good=FR(d-b,a-c);
       return {q:`Programme A : « multiplier par ${a} puis ajouter ${b} ». Programme B : « multiplier par ${c} puis ajouter ${d} ». Quel nombre de départ donne le même résultat ?`, c:ch4(good,[FR(d+b,a-c),FR(d-b,a+c),FR(a-c,d-b)]), rep:good, ex:`${lin(a,b)} = ${lin(c,d)} donc ${mono(a-c)} = ${d-b} et ${$x} = ${good}.`, sx:S_PB}; }},
     {g:()=>{ let a,s; do{ a=ri(1,5); s=ri(1,9); }while((4*a+s)%3); const b=(4*a+s)/3;
       return {q:`Un carré a pour côté ${$x} + ${a} et un triangle équilatéral a pour côté ${$x} + ${b}. Pour quelle valeur de ${$x} ont-ils le même périmètre ?`, rep:F(s), ex:`4(${$x} + ${a}) = 3(${$x} + ${b}) donc 4${$x} + ${4*a} = 3${$x} + ${3*b} et ${$x} = ${s}.`, sx:S_PB}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 9", duree:50, info:"Durée : 50 min · Calculatrice autorisée · Rédige chaque résolution sur ta copie",
comp:[
  ["CONNAÎTRE","Je reconnais une équation du premier degré et je teste si un nombre est solution.","Ex. 1 et 2 (3,5 points)"],
  ["CALCULER",`Je résous une équation du premier degré, même de la forme a${$x} + b = c${$x} + d ou avec des parenthèses.`,"Ex. 3 et 4 (8 points)"],
  ["MODÉLISER","Je mets un problème en équation (programmes de calcul, tableur, périmètres).","Ex. 5 et 6 (7 points)"],
  ["RAISONNER","Je résous un problème concret à l'aide d'une équation et je conclus par une phrase.","Ex. 7 (1,5 point)"]
],
exos:[
{t:"Reconnaître une équation", p:2, h:`<p>Pour chaque égalité, dis si c'est une équation du premier degré à une inconnue. Réponds par oui ou non.</p>${cols([`a) 3${$x} − 7 = 2${$x} + 1`,`b) 2${$x}² + 1 = 9`,`c) −5${$x} = 12`,`d) 7 = 4 − ${$x}`])}`,
 c:`<p>a) Oui · b) Non (terme en ${$x}²) · c) Oui · d) Oui</p><p><i>(0,5 point par réponse)</i></p>`},
{t:"Tester un nombre", p:1.5, h:`<p>On considère l'équation 5${$x} + 3 = 2${$x} − 3.</p><p>a) Le nombre 1 est-il solution de cette équation ?</p><p>b) Le nombre −2 est-il solution de cette équation ?</p>`,
 c:`<p>a) 5 × 1 + 3 = 8 et 2 × 1 − 3 = −1. 8 ≠ −1 : 1 n'est pas solution. <i>(0,5 point)</i></p><p>b) 5 × (−2) + 3 = −7 et 2 × (−2) − 3 = −7. Les deux membres sont égaux : −2 est solution. <i>(1 point)</i></p>`},
{t:"Résoudre des équations simples", p:4, h:`<p>Résous les équations suivantes.</p>${cols([`a) ${$x} + 12 = 5`,`b) −4${$x} = 18`,`c) ${FX($x,5)} = −3`,`d) 9 = ${$x} − 6`,`e) 6${$x} − 11 = 13`,`f) 7 − 3${$x} = 19`])}`,
 c:`<p>a)</p>${calc([`${$x} + 12 = 5`,[`${$x} = 5 − 12 = −7`,"− 12"]])}<p>b)</p>${calc([`−4${$x} = 18`,[`${$x} = 18 ÷ (−4) = −4,5`,"÷ (−4)"]])}<p>c)</p>${calc([`${FX($x,5)} = −3`,[`${$x} = −3 × 5 = −15`,"× 5"]])}<p>d)</p>${calc([`9 = ${$x} − 6`,[`15 = ${$x}`,"+ 6"]])}<p>Les solutions sont −7 ; −4,5 ; −15 et 15. <i>(0,5 point par équation)</i></p>
  <p>e)</p>${calc(steps(6,-11,0,13,{first:`6${$x} − 11 = 13`}))}<p>La solution est 4. <i>(1 point)</i></p><p>f)</p>${calc(steps(-3,7,0,19,{first:`7 − 3${$x} = 19`}))}<p>La solution est −4. <i>(1 point)</i></p>`},
{t:"Résoudre des équations plus difficiles", p:4, h:`<p>Résous les équations suivantes.</p>${cols([`a) 9${$x} + 4 = 2${$x} + 25`,`b) 5${$x} − 8 = 11${$x} + 4`,`c) 3(2${$x} − 5) = 4${$x} + 1`,`d) 7${$x} − (3${$x} + 9) = 2`])}`,
 c:`<p>a)</p>${calc(steps(9,4,2,25))}<p>La solution est 3. <i>(1 point)</i></p><p>b)</p>${calc(steps(5,-8,11,4))}<p>La solution est −2. <i>(1 point)</i></p>
  <p>c)</p>${calc([`3(2${$x} − 5) = 4${$x} + 1`,`6${$x} − 15 = 4${$x} + 1`,...steps(6,-15,4,1).slice(1)])}<p>La solution est 8. <i>(1 point)</i></p>
  <p>d)</p>${calc([`7${$x} − (3${$x} + 9) = 2`,`7${$x} − 3${$x} − 9 = 2`,`4${$x} − 9 = 2`,...steps(4,-9,0,2).slice(1)])}<p>La solution est {11/4} = 2,75. <i>(1 point)</i></p>`},
{t:"Deux programmes et un tableur", p:4, h:`${prog("Programme A",["Choisir un nombre","Multiplier par 6","Soustraire 5"])}${prog("Programme B",["Choisir un nombre","Multiplier par 2","Ajouter 9"])}
  <p>1) Quels résultats obtient-on avec les deux programmes si l'on choisit 4 ?</p><p>2) On utilise la feuille de calcul ci-dessous. Quelles formules faut-il saisir dans les cellules B2 et B3, avant de les étirer vers la droite ?</p>
  ${sheet(range(0,5),[["Programme A",v=>6*v-5],["Programme B",v=>2*v+9]])}
  <p>3) a) Au vu du tableau, entre quels nombres entiers consécutifs se trouve le nombre qui donne le même résultat avec les deux programmes ?</p><p>b) Trouve ce nombre par le calcul.</p>`,
 c:`<p>1) A : 4 × 6 − 5 = 19 ; B : 4 × 2 + 9 = 17. <i>(1 point)</i></p><p>2) B2 : <b>=6*B1-5</b> ; B3 : <b>=2*B1+9</b>. <i>(1 point)</i></p>
  <p>3) a) Pour 3 : 13 &lt; 15 ; pour 4 : 19 &gt; 17. Le nombre est entre 3 et 4. <i>(0,5 point)</i></p><p>b) On note ${$x} le nombre de départ.</p>${calc(steps(6,-5,2,9))}<p>Le nombre cherché est 3,5. <i>(1,5 point)</i></p>`},
{t:"Même périmètre", p:3, h:`<p>${$x} est une longueur en cm.</p>${rectCar(`<tspan style="font-style:italic">x</tspan> + 6`,"2",`<tspan style="font-style:italic">x</tspan>`)}<p>Le rectangle a pour longueur ${$x} + 6 et pour largeur 2. Le carré a pour côté ${$x}.</p><p>Quelle doit être la valeur de ${$x} pour que le rectangle et le carré aient le même périmètre ?</p>`,
 c:`<p>Périmètre du rectangle : 2 × (${$x} + 6 + 2) = 2${$x} + 16. Périmètre du carré : 4${$x}. <i>(1 point)</i></p><p>On résout 4${$x} = 2${$x} + 16 : <i>(1 point)</i></p>${calc(steps(4,0,2,16))}<p>Pour ${$x} = 8 cm, les deux figures ont le même périmètre (32 cm). <i>(1 point)</i></p>`},
{t:"Le cinéma", p:1.5, h:`<p>Au cinéma, le tarif A coûte 7 € par séance.</p><p>Le tarif B coûte 24 € d'abonnement, puis 4 € par séance.</p><p>Pour combien de séances les deux tarifs coûtent-ils la même somme ?</p>`,
 c:`<p>On note ${$x} le nombre de séances : 7${$x} = 24 + 4${$x}.</p>${calc([`7${$x} = 24 + 4${$x}`,[`3${$x} = 24`,"− 4"+$x],[`${$x} = 8`,"÷ 3"]])}<p>Pour 8 séances, les deux tarifs coûtent la même somme (56 €). <i>(1,5 point : équation 0,5 · résolution 0,5 · phrase 0,5)</i></p>`}
]}
};

/* réponses tapées : clavier texte (pour pouvoir écrire le signe −) */
CH["3e-9"].quiz.forEach(N=>Object.values(N.q).forEach(list=>list.forEach((it,i)=>{
  if(it.g){ const g=it.g; list[i]={g:()=>Object.assign(g(),{kb:"text"})}; } else it.kb="text";
})));
})();
