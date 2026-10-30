/* 3e · chapitre 5 — fiche d'entraînement : les exercices de la fiche de M. Staal (double distributivité et démonstrations), avec d'autres nombres.
   Toutes les corrections sont calculées par le moteur window.ALG3 (data/3e-5.js). */
TRAIN["3e-5"] = function(){
const {ri, pick, shuf, distinct} = TR;
const AL = window.ALG3, {T, show, red, sum, sortD, devLines} = AL;
const {R, grid, prog, calc} = AL.dbl;
const SO = {sort:true};
const dv = (n,s) => calc(devLines(n,s,SO));
const E = (n,s) => `${n} = ${show(s)}`;
const nz = (a,b) => { let v; do{ v=ri(a,b); }while(v===0); return v; };
const sg = v => v<0 ? `-${-v}` : `+${v}`;
const co = (a,m="x") => (a===1?"":a===-1?"-":String(a))+m;
const N = v => String(v).replace("-","−");
const P = v => v<0 ? `(${N(v)})` : N(v);
const LET = "ABCDEFGHIJKL";
const step = (op,v) => op==="+" ? (v<0?`Soustraire ${-v}.`:`Ajouter ${v}.`) : `Multiplier par ${N(v)}.`;

/* ===== Activité 1 : (x + a) × x + b  et  (x + c)(x + d) avec c + d = a, cd = b ===== */
const A1 = (()=>{ const c=ri(1,8), d=ri(1,8); return {c, d, a:c+d, b:c*d}; })();
/* ===== Exercice 1 : sept produits ===== */
const EX1 = [ ()=>`(${co(ri(2,5))}+${ri(1,9)})*(${co(ri(2,7))}+${ri(1,9)})`, ()=>`(${co(ri(2,5),"y")}+${ri(1,9)})*(${ri(1,9)}+${co(ri(2,5))})`, ()=>`(${co(ri(2,6))}-${ri(1,9)})(${co(ri(2,6))}+${ri(1,9)})`, ()=>`(${co(-ri(2,6))}+${ri(1,9)})(${ri(1,9)}-x)`,
  ()=>`(${co(-ri(2,7))}-${ri(1,9)})(-${ri(1,9)}+${co(ri(2,6),"y")})`, ()=>`(${co(ri(2,5))}+${ri(1,9)})2`, ()=>`(x-${ri(2,9)})2` ].map(f=>f());
/* ===== Exercice 2 : l'intrus (4 paires d'expressions égales + 1 intrus) ===== */
const INT = (()=>{
  const a=ri(1,6), b=ri(1,6), m=ri(2,5), n=ri(1,9), p=ri(1,9), d=ri(2,9), e=ri(1,6); let c; do{ c=ri(2,6); }while(m*n-c===0);
  const pairs = shuf([
    [`(x+${a})(x+${b})`, `x(x+${a+b})+${a*b}`],
    [`(x-${e})2`, `x(x-${2*e})+${e*e}`],
    [`${m}(${co(n)}-${p})+${m*p}`, `(${co(m*n-c)}-${d})+(${co(c)}+${d})`],
    [`${c+2}x2-(${co(d)}+2x2)`, `x(${co(c)}-${d})`]
  ]);
  const intrus = pick([`(x+${a})(x-${b})`, ...(a===e&&b===e?[]:[`(x+${e})2`]), `${c+2}x2-(${co(d)}-2x2)`]);
  const L = shuf([...pairs.flatMap((pr,i)=>pr.map(s=>({s,g:i}))), {s:intrus, g:-1}]);
  return {L};
})();
/* ===== Exercice 3 : affirmations ===== */
const mkAff = () => { const a=ri(1,5), b=ri(1,7), c=ri(1,5), d=ri(1,7), ok=Math.random()<0.5;
  const left=`(${co(a)}-${b})(${co(c)}+${d})`, L=sortD(red(left));
  const x2=a*c, x1=a*d-b*c, x0=-b*d;                       /* membre de droite : x(x2·x + u) + v x + x0, avec u + v = x1 */
  const v=nz(-6,6), u=x1-v+(ok?0:pick([-2,-1,1,2]));
  const right=`x(${co(x2)}${u===0?"":sg(u)})${v===0?"":`${v<0?"-":"+"}${co(Math.abs(v))}`}${sg(x0)}`;
  return {left, right, ok}; };
const AFF = [mkAff(), (()=>{ const a=ri(2,5), b=ri(1,6), ok=Math.random()<0.5, k=2*a*b+(ok?0:pick([-2,2]));  /* (ax − b)² = a²x² − kx + b² */
  return {left:`(${co(a)}-${b})2`, right:`${a*a}x2-${k}x+${b*b}`, ok}; })()];
/* ===== Exercice 4 : x² + ax  et  (x + a) × x ===== */
const E4 = {a:ri(2,9), u:ri(2,6), v:-ri(2,8)};
/* ===== Exercice 5 : (x − a)² − a²  et  (x − 2a) × x ===== */
const E5 = {a:ri(2,6)};
/* ===== Exercice 6 : programme « +a, au carré, −b » ===== */
const E6 = {a:ri(1,6), b:ri(2,20), u:ri(2,6), v:-ri(3,9)};
const e6r = x => (x+E6.a)**2-E6.b;
/* ===== Exercice 7 : (x − a)² − b²  et  (x − a + b)(x − a − b) ===== */
const E7 = (()=>{ const a=ri(3,7), b=ri(2,a-1); return {a,b}; })();

return [
 {t:"Développer avec la double distributivité", e:[
  {n:"Activité 1", t:"Programmes égaux ?", w:"Sur ton cahier", h:`<div class="progs">${prog("Programme 1",["Choisir un nombre.",`Ajouter ${A1.a}.`,"Multiplier par le nombre de départ.",`Ajouter ${A1.b}.`])}${prog("Programme 2",["Choisir un nombre.",`D'un côté, lui ajouter ${A1.c}.`,`De l'autre, lui ajouter ${A1.d}.`,"Multiplier les deux nombres obtenus."])}</div>
   <p>Prouve que ces deux programmes donnent toujours le même résultat si on choisit le même nombre de départ.</p>`,
   c:`<div class="calcs">${dv("P<sub>1</sub>",`(x+${A1.a})*x+${A1.b}`)}${dv("P<sub>2</sub>",`(x+${A1.c})(x+${A1.d})`)}</div><p>Les deux programmes donnent ${R(`(x+${A1.c})(x+${A1.d})`)} : ils donnent <b>toujours le même résultat</b>.</p>`},
  {n:"Exercice 1", t:"Développer à l'aide de la double distributivité", w:"Sur ton cahier", h:`<p>Développe et réduis chaque expression.</p>${grid(EX1.map((s,i)=>E(LET[i],s)))}`,
   c:grid(EX1.map((s,i)=>dv(LET[i],s)))},
  {n:"Exercice 2", t:"Trouve l'intrus", w:"Sur ton cahier", h:`<p><b>a)</b> Développe et réduis chaque expression.</p><p><b>b)</b> Regroupe les expressions égales. Quelle expression se retrouve seule ?</p>${grid(INT.L.map((o,i)=>E(LET[i],o.s)))}`,
   c:`<p><b>a)</b></p>${grid(INT.L.map((o,i)=>dv(LET[i],o.s)))}<p><b>b)</b> ${[0,1,2,3].map(g=>{ const ix=INT.L.map((o,i)=>o.g===g?i:-1).filter(i=>i>=0); return `${ix.map(i=>LET[i]).join(" = ")} = ${R(INT.L[ix[0]].s)}`; }).join(" · ")}</p><p>L'intrus est <b>${LET[INT.L.findIndex(o=>o.g===-1)]}</b> = ${R(INT.L.find(o=>o.g===-1).s)}.</p>`}
 ]},
 {t:"Démontrer avec le calcul littéral", e:[
  {n:"Exercice 3", t:"Affirmation vraie ou fausse ?", w:"Sur ton cahier", h:`<p>Indique, en justifiant, si chacune des affirmations est vraie ou fausse.</p>${AFF.map((o,i)=>`<p><b>Affirmation ${i+1} :</b> l'égalité ${show(o.left)} = ${show(o.right)} est toujours vraie.</p>`).join("")}`,
   c:AFF.map((o,i)=>{ const same=R(o.left)===R(o.right); let ce=""; if(!same){ const f=s=>AL.ev(red(s),{x:1}); ce=` Contre-exemple avec <i>x</i> = 1 : ${N(f(o.left))} ≠ ${N(f(o.right))}.`; if(f(o.left)===f(o.right)){ const g=s=>AL.ev(red(s),{x:2}); ce=` Contre-exemple avec <i>x</i> = 2 : ${N(g(o.left))} ≠ ${N(g(o.right))}.`; } }
     return `<p><b>Affirmation ${i+1} :</b></p><div class="calcs">${dv("A",o.left)}${dv("B",o.right)}</div><p>${same?"A = B : l'affirmation est <b>vraie</b>.":`Les formes réduites sont différentes : l'affirmation est <b>fausse</b>.${ce}`}</p>`; }).join("")},
  {n:"Exercice 4", t:"Programmes égaux ?", w:"Sur ton cahier", h:`<div class="progs">${prog("Programme 1",["Choisir un nombre.","Élever au carré.",`Ajouter ${E4.a} fois le nombre de départ.`])}${prog("Programme 2",["Choisir un nombre.",`Ajouter ${E4.a}.`,"Multiplier par le nombre de départ."])}</div>
   <p><b>1. a)</b> Calcule le résultat des deux programmes avec ${E4.u}.</p><p><b>b)</b> Calcule le résultat des deux programmes avec ${N(E4.v)}.</p><p><b>c)</b> Émets une conjecture.</p><p><b>2.</b> Démontre ta conjecture.</p>`,
   c:`<p><b>1. a)</b> Avec ${E4.u} :</p><div class="calcs">${calc([`A = ${E4.u}² + ${E4.a} × ${E4.u}`,`A = ${E4.u**2} + ${E4.a*E4.u}`,`A = ${E4.u**2+E4.a*E4.u}`])}${calc([`B = (${E4.u} + ${E4.a}) × ${E4.u}`,`B = ${E4.u+E4.a} × ${E4.u}`,`B = ${(E4.u+E4.a)*E4.u}`])}</div>
   <p><b>b)</b> Avec ${N(E4.v)} :</p><div class="calcs">${calc([`C = (${N(E4.v)})² + ${E4.a} × (${N(E4.v)})`,`C = ${E4.v**2} ${E4.a*E4.v<0?"−":"+"} ${Math.abs(E4.a*E4.v)}`,`C = ${N(E4.v**2+E4.a*E4.v)}`])}${calc([`D = (${N(E4.v)} + ${E4.a}) × (${N(E4.v)})`,`D = ${P(E4.v+E4.a)} × (${N(E4.v)})`,`D = ${N((E4.v+E4.a)*E4.v)}`])}</div>
   <p><b>c)</b> Il semble que les deux programmes donnent toujours le même résultat.</p><p><b>2.</b></p><div class="calcs">${calc([`P<sub>1</sub> = <i>x</i>² + ${E4.a}<i>x</i>`])}${dv("P<sub>2</sub>",`(x+${E4.a})*x`)}</div><p>La conjecture est <b>vraie</b>.</p>`},
  {n:"Exercice 5", t:"Programmes égaux", w:"Sur ton cahier", h:`<div class="progs">${prog("Programme A",["Choisir un nombre.",`Soustraire ${E5.a}.`,"Élever au carré.",`Soustraire ${E5.a*E5.a}.`])}${prog("Programme B",["Choisir un nombre.",`Soustraire ${2*E5.a}.`,"Multiplier par le nombre choisi."])}</div><p>Prouve que ces deux programmes donnent toujours le même résultat.</p>`,
   c:`<div class="calcs">${dv("A",`(x-${E5.a})2-${E5.a*E5.a}`)}${dv("B",`(x-${2*E5.a})*x`)}</div><p>Les deux programmes donnent ${R(`(x-${2*E5.a})*x`)} : ils donnent <b>toujours le même résultat</b>.</p>`},
  {n:"Exercice 6", t:"Comprendre un programme Scratch", w:"Sur ton cahier", h:`<div class="pgc"><b>Programme Scratch</b><ul><li>demander « Choisis un nombre » et attendre</li><li>mettre a à (réponse + ${E6.a})</li><li>mettre b à (a × a)</li><li>mettre c à (b − ${E6.b})</li><li>dire c</li></ul></div>
   <p><b>1.</b> Calcule le résultat du programme avec ${E6.u}.</p><p><b>2.</b> Calcule le résultat du programme avec ${N(E6.v)}.</p><p><b>3. a)</b> Écris l'expression, en fonction de <i>x</i>, qui donne le résultat du programme.</p><p><b>b)</b> Développe et réduis cette expression.</p>`,
   c:`<div class="calcs">${calc([`<b>1.</b>`,`A = (${E6.u} + ${E6.a})² − ${E6.b}`,`A = ${E6.u+E6.a}² − ${E6.b}`,`A = ${(E6.u+E6.a)**2} − ${E6.b}`,`A = ${N(e6r(E6.u))}`])}${calc([`<b>2.</b>`,`B = (${N(E6.v)} + ${E6.a})² − ${E6.b}`,`B = ${P(E6.v+E6.a)}² − ${E6.b}`,`B = ${(E6.v+E6.a)**2} − ${E6.b}`,`B = ${N(e6r(E6.v))}`])}</div><p><b>3. a)</b> (<i>x</i> + ${E6.a})² − ${E6.b}</p><p><b>b)</b></p>${dv("C",`(x+${E6.a})2-${E6.b}`)}`},
  {n:"Exercice 7", t:"Comparaison d'aires", w:"Sur ton cahier", h:`<p><i>x</i> est un nombre supérieur à ${E7.a+E7.b}.</p><p>Dans un carré de côté <i>x</i> − ${E7.a}, on enlève dans un coin un carré de côté ${E7.b} : il reste un hexagone.</p><p>Un rectangle a pour longueur ${sum([T(1,"x"),T(E7.b-E7.a)])} et pour largeur <i>x</i> − ${E7.a+E7.b}.</p><p>Montre que l'hexagone et le rectangle ont la même aire, quelle que soit la valeur de <i>x</i>.</p>`,
   c:`<p>Aire de l'hexagone : aire du grand carré moins aire du petit carré.</p>${dv("A<sub>hexagone</sub>",`(x-${E7.a})2-${E7.b*E7.b}`)}<p>Aire du rectangle :</p>${dv("A<sub>rectangle</sub>",`(x${sg(E7.b-E7.a)})(x-${E7.a+E7.b})`)}<p>Les deux aires sont égales à ${R(`(x-${E7.a})2-${E7.b*E7.b}`)} : l'hexagone et le rectangle ont <b>toujours la même aire</b>.</p>`}
 ]}
];
};
/* chaque calcul d'une grille .calcs dans sa propre case (voir data/3e-5.js) */
(()=>{ const g=TRAIN["3e-5"], W=h=>typeof h!=="string"?h:h.replace(/(<div class="calcs"[^>]*>)([\s\S]*?)(<\/div>)/g,(m,a,b,c)=>a+b.replace(/<p class="calc">([\s\S]*?)<\/p>/g,'<div><p class="calc">$1</p></div>')+c);
  TRAIN["3e-5"]=function(){ const secs=g.apply(this,arguments); secs.forEach(S=>S.e.forEach(e=>{ e.h=W(e.h); e.c=W(e.c); })); return secs; }; })();
