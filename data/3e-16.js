/* 3e — Chapitre 16 : Équations produit et du second degré
   Sources : cours B2,5 « Calcul littéral 2,5 – Une identité remarquable », cours B5 « Équation du second degré »,
   fiche d'exercices (Exercices / Progression) de M. Staal. Les lettres sont en italique (<i>x</i>).
   Toutes les résolutions sont calculées par le code (outil window.EQ16). */
(function(){
const VF=["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const ch4=(good,bads)=>shuf(uniq(good,bads).slice(0,4));
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const X=v=>`<i>${v}</i>`, $x=X("x"), $a=X("a"), $b=X("b");
const r6=v=>Math.round(v*1e6)/1e6;
const F=v=>{ const r=r6(v); const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const P=v=>v<0?`(${F(v)})`:F(v);
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const red=(p,q)=>{ if(q<0){ p=-p; q=-q; } const g=gcd(Math.abs(p),q)||1; return [p/g,q/g]; };
const isDec=q=>{ q=Math.abs(q); while(q%2===0) q/=2; while(q%5===0) q/=5; return q===1; };
const FR=(p,q)=>{ [p,q]=red(p,q); return q===1?F(p):(p<0?"−":"")+`{${Math.abs(p)}/${q}}`; };
/* valeur d'une solution : décimal si possible, sinon fraction irréductible */
const SV=(p,q)=>{ [p,q]=red(p,q); return q===1?F(p):isDec(q)?F(p/q):FR(p,q); };
const quo=(p,q)=>{ if(p%q===0) return F(p/q);
  const raw = q>0 ? (p<0?"−":"")+`{${Math.abs(p)}/${q}}` : `{${F(p)}/${F(q)}}`; const rd=FR(p,q); let s=raw;
  if(rd!==raw) s+=" = "+rd; const [A,B]=red(p,q); if(isDec(B)) s+=" = "+F(A/B); return s; };
const mono=(a,v="x")=>a===0?"0":a===1?X(v):a===-1?"−"+X(v):F(a)+X(v);
const lin=(a,b,v="x")=>a===0?F(b):mono(a,v)+(b>0?` + ${F(b)}`:b<0?` − ${F(-b)}`:"");
const linR=(b,a,v="x")=>b===0?mono(a,v):F(b)+(a>0?` + ${mono(a,v)}`:a<0?` − ${mono(-a,v)}`:"");
const OP=t=>`<span style="color:var(--c);font-weight:700">&emsp;(${t})</span>`;
const calc=L=>`<p class="calc">${L.map(l=>Array.isArray(l)?l[0]+OP(l[1]):l).join("<br>")}</p>`;
const cols=arr=>`<div class="calcs">${arr.map(s=>`<span>${s}</span>`).join("")}</div>`;
const rac=x=>`√<span style="border-top:1.5px solid currentColor;padding:0 2px">${x}</span>`;
const sq=v=>`${v}<sup>2</sup>`;
const prog=(titre,L)=>`<div class="pgc">${titre?`<b>${titre}</b>`:""}<ul>${L.map(s=>`<li>${s}</li>`).join("")}</ul></div>`;

/* ---------- facteurs du premier degré : {a, b, r} = a·x + b (r : écrit « b + a·x ») ---------- */
const fs=f=>f.r?linR(f.b,f.a):lin(f.a,f.b);
const fp=f=>f.b===0?mono(f.a):`(${fs(f)})`;
/* résolution de a·x + b = 0 */
const fLines=f=>{ const L=[`${fs(f)} = 0`]; if(f.b!==0 && f.a!==1) L.push([`${mono(f.a)} = ${F(-f.b)}`,(f.b>0?"− ":"+ ")+F(Math.abs(f.b))]);
  if(f.b===0 && f.a!==1) L.push([`${$x} = 0`,"÷ "+P(f.a)]);
  else if(f.a===1 && f.b!==0) L.push([`${$x} = ${F(-f.b)}`,(f.b>0?"− ":"+ ")+F(Math.abs(f.b))]);
  else if(f.b!==0) L.push([`${$x} = ${quo(-f.b,f.a)}`,"÷ "+P(f.a)]); return L; };
const fSol=f=>[-f.b,f.a];
const same=(f,g)=>f.a*g.b===f.b*g.a;
/* résolution complète d'une équation produit nul ; k = facteur numérique éventuel, sqr = (f)² */
function pnul(fA,fB,o={}){ let h="";
  if(o.sqr){ h+=`<p>${fp(fA)}<sup>2</sup> = 0 s'écrit ${fp(fA)} × ${fp(fA)} = 0.</p><p>C'est une équation « produit nul » : donc ${fs(fA)} = 0.</p>`+calc(fLines(fA));
    return h+`<p>La solution de l'équation est <b>${SV(...fSol(fA))}</b>.</p>`; }
  h+=`<p>Un produit est nul si l'un de ses facteurs est nul.</p>${o.k?`<p>Ici, ${o.k} ≠ 0 : c'est donc l'un des deux autres facteurs qui est nul.</p>`:""}<p><b>Soit</b></p>${calc(fLines(fA))}<p><b>soit</b></p>${calc(fLines(fB))}`;
  return h+`<p>Les solutions de l'équation sont <b>${SV(...fSol(fA))}</b> et <b>${SV(...fSol(fB))}</b>.</p>`; }
/* x² = a */
const isSq=n=>Number.isInteger(Math.sqrt(n));
const rootSol=n=>n===0?`<p>Donc ${$x} = 0.</p><p>La solution de l'équation est <b>0</b>.</p>`
  : isSq(n)?`<p>Donc ${$x} = ${rac(n)} = ${Math.sqrt(n)} ou ${$x} = −${rac(n)} = −${Math.sqrt(n)}.</p><p>Les solutions de l'équation sont <b>${Math.sqrt(n)}</b> et <b>−${Math.sqrt(n)}</b>.</p>`
  : `<p>Donc ${$x} = ${rac(n)} ou ${$x} = −${rac(n)}.</p><p>Les solutions de l'équation sont <b>${rac(n)}</b> et <b>−${rac(n)}</b>.</p>`;
/* développement (k·x + m)(k·x − m) */
const devAB=(k,m,first=1)=>{ const A=k===1?$x:`${k}${$x}`, AA=k===1?$x:`(${k}${$x})`; const L=first?`(${A} + ${m})(${A} − ${m})`:`(${A} − ${m})(${A} + ${m})`;
  return [L, `${sq(AA)} − ${sq(m)}`, `${k===1?"":k*k}${sq($x)} − ${m*m}`]; };
const facAB=(k,m)=>{ const A=k===1?$x:`${k}${$x}`, AA=k===1?$x:`(${k}${$x})`;
  return [`${k===1?"":k*k}${sq($x)} − ${m*m}`, `${sq(AA)} − ${sq(m)}`, `(${A} + ${m})(${A} − ${m})`]; };
const eqs=(N,L)=>`<p class="calc">${L.map((l,i)=>`${N} = ${l}`).join("<br>")}</p>`;

/* ---------- schéma du programme de calcul (deux branches) ---------- */
function progDiag(g,d,alt){ const T=(x,y,t,st="")=>`<text x="${x}" y="${y}" text-anchor="middle" style="font-size:16px;fill:var(--ink);${st}">${t}</text>`;
  const box=(x,y,w)=>`<rect x="${x-w/2}" y="${y-18}" width="${w}" height="36" rx="8" style="fill:none;stroke:var(--c);stroke-width:2"/>`;
  const ar=(x1,y1,x2,y2)=>{ const L=Math.hypot(x2-x1,y2-y1), ux=(x2-x1)/L, uy=(y2-y1)/L; return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="ln"/><path d="M${(x2-ux*11-uy*6).toFixed(1)} ${(y2-uy*11+ux*6).toFixed(1)} L${x2} ${y2} L${(x2-ux*11+uy*6).toFixed(1)} ${(y2-uy*11-ux*6).toFixed(1)}" class="ln"/>`; };
  return `<svg class="fig" viewBox="0 0 520 330" width="480" role="img" aria-label="${alt}">
   ${T(260,22,"Choisir un nombre")}${ar(260,32,260,62)}${box(260,82,150)}
   ${ar(210,100,120,160)}${ar(310,100,400,160)}${T(118,128,g)}${T(402,128,d)}
   ${box(100,180,140)}${box(420,180,140)}${T(260,176,"Multiplier les deux")}${T(260,196,"nombres obtenus")}
   ${ar(110,198,255,262)}${ar(410,198,265,262)}${box(260,290,120)}${T(260,296,"Résultat","font-weight:700")}</svg>`; }
window.EQ16={F,P,X,FR,SV,quo,mono,lin,linR,OP,calc,cols,rac,sq,prog,fs,fp,fLines,fSol,same,pnul,isSq,rootSol,devAB,facAB,eqs,progDiag,red,isDec,gcd};

/* ===================== schémas ===================== */
const S_ID=sch("Une identité remarquable",`<p class="calc">(${$a} + ${$b})(${$a} − ${$b}) = ${sq($a)} − ${sq($b)}</p><p class="calc">(${$x} + 9)(${$x} − 9) = ${sq($x)} − ${sq(9)} = ${sq($x)} − 81</p><p class="schN">Développer : on transforme le produit en une soustraction de deux carrés.</p>`);
const S_FAC=sch("Factoriser a² − b²",`<p class="calc">16${sq($x)} − 49 = ${sq("(4"+$x+")")} − ${sq(7)} = (4${$x} + 7)(4${$x} − 7)</p><p class="schN">Je reconnais deux carrés séparés par « − » : j'écris chacun sous la forme d'un carré.</p>`);
const S_DEF=sch("Équation « produit nul »",`<p class="calc">(${$x} − 5)(7 + 2${$x}) = 0 → oui<br>(${$x} − 5)(7 + 2${$x}) = 5 → non<br>(${$x} − 5) + (7 + 2${$x}) = 0 → non</p><p class="schN">Un membre est un <b>produit</b>, l'autre membre est <b>0</b>.</p>`);
const S_PN=sch("Résoudre un produit nul",`<p class="calc">(${$x} − 5)(7 + 2${$x}) = 0<br>soit ${$x} − 5 = 0 &emsp; soit 7 + 2${$x} = 0<br>${$x} = 5 &emsp;&emsp;&emsp;&emsp; ${$x} = −3,5</p><p class="schN">Un produit est nul si l'un de ses facteurs est nul.</p>`);
const S_X2=sch("Résoudre x² = a",`<p class="calc">${sq($x)} = 25 → ${$x} = 5 ou ${$x} = −5<br>${sq($x)} = 32 → ${$x} = ${rac(32)} ou ${$x} = −${rac(32)}<br>${sq($x)} = 0 → ${$x} = 0</p><p class="schN">Si a &gt; 0 : deux solutions, ${rac("a")} et −${rac("a")}.</p>`);

/* ===================== contenus fixes ===================== */
const f=(a,b,r)=>({a,b,r});
const EX3=[[f(4,3),f(1,-5)],[f(2,-9),f(-7,3,1)],[f(5,3),null,{sqr:1}],[f(1,0),f(9,4)],[f(-4,7,1),f(3,0)],[f(1,3),f(1,4),{k:2}]];
const EX3S=[`(4${$x} + 3)(${$x} − 5) = 0`,`(2${$x} − 9)(3 − 7${$x}) = 0`,`(5${$x} + 3)<sup>2</sup> = 0`,`${$x}(9${$x} + 4) = 0`,`(7 − 4${$x}) × 3${$x} = 0`,`2(${$x} + 3)(${$x} + 4) = 0`];
const L6="abcdef";

CH["3e-16"] = {
intro:"Développer et factoriser avec l'identité remarquable (a + b)(a − b) = a² − b², puis résoudre des équations « produit nul » et des équations de la forme x² = a.",
savoir:[
  `développer avec l'identité remarquable (${$a} + ${$b})(${$a} − ${$b}) = ${sq($a)} − ${sq($b)} ;`,
  `factoriser une expression de la forme ${sq($a)} − ${sq($b)} ;`,
  "reconnaître une équation « produit nul » ;",
  "résoudre une équation « produit nul » ;",
  `résoudre une équation de la forme ${sq($x)} = a (et s'y ramener) ;`,
  "résoudre un problème qui conduit à une équation produit nul."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Une identité remarquable", h:`
  <p>Nous avons découvert une propriété que l'on appelle <b>une identité remarquable</b>.</p>
  <div class="retenir" data-l="Propriété"><p>Pour tous nombres ${$a} et ${$b} :</p><p class="calc">(${$a} + ${$b})(${$a} − ${$b}) = ${sq($a)} − ${sq($b)}</p></div>
  <p>Nous l'avons prouvée en développant l'expression avec la double distributivité :</p>
  <p class="calc">E = (${$a} + ${$b})(${$a} − ${$b})<br>E = ${sq($a)} − ${$a}${$b} + ${$b}${$a} − ${sq($b)}<br>E = ${sq($a)} − ${sq($b)}</p>
  <div class="retenir" data-l="À retenir"><p>(${$a} + ${$b})(${$a} − ${$b}) = ${sq($a)} − ${sq($b)} : écrite de cette manière, la propriété permet de <b>développer</b>, c'est-à-dire de <b>transformer un produit en une soustraction</b>.</p>
   <p>${sq($a)} − ${sq($b)} = (${$a} + ${$b})(${$a} − ${$b}) : écrite de cette manière, la propriété permet de <b>factoriser</b>, c'est-à-dire de <b>transformer une soustraction en un produit</b>.</p></div>
  <p><b>Exercice 1 : développer</b> les deux expressions suivantes.</p>${eqs("A",devAB(1,9))}${eqs("B",devAB(3,5,0))}
  <p><b>Exercice 2 : factoriser</b> les deux expressions suivantes.</p>${eqs("A",[`${sq($x)} − 4`,`${sq($x)} − ${sq(2)}`,`(${$x} + 2)(${$x} − 2)`])}${eqs("B",facAB(4,7))}`},
{k:"II", t:"Équation du second degré : définition", h:`
  <div class="retenir" data-l="Définition"><p>On dit qu'une équation est une <b>équation du second degré à une inconnue</b> car :</p>
   <p>elle est du <b>2<sup>nd</sup> degré</b> : l'exposant de l'inconnue est au plus égal à 2 (pas de terme en ${$x}<sup>3</sup> ou plus) ;</p>
   <p>elle est à <b>une inconnue</b> : il y a une seule inconnue, souvent appelée ${$x}.</p></div>
  <p>En 3<sup>e</sup>, vous ne saurez pas résoudre toutes les équations du 2<sup>nd</sup> degré à une inconnue.</p>
  <p>Vous saurez résoudre les <b>équations de la forme ${sq($x)} = a</b> et les <b>équations « produit nul »</b>.</p>
  <div class="retenir" data-l="À retenir"><p>Une équation du second degré a <b>au maximum 2 solutions</b>.</p></div>`},
{k:"III", t:"Résoudre une équation « produit nul »", h:`
  <h4>a) Définition</h4>
  <div class="retenir" data-l="Définition"><p>Une <b>équation « produit nul »</b> est une équation dont un membre est donné sous la forme d'un <b>produit</b> et l'autre membre est égal à <b>0</b>.</p></div>
  <p><b>Exemple :</b> (${$x} − 5)(7 + 2${$x}) = 0 est une équation « produit nul » car :</p><p>le 1<sup>er</sup> membre est le produit (${$x} − 5)(7 + 2${$x}) ;</p><p>le 2<sup>e</sup> membre est 0.</p>
  <p><b>Contre-exemples :</b></p><p>(${$x} − 5)(7 + 2${$x}) = 5 n'est pas une équation produit nul : le membre de droite n'est pas égal à 0.</p><p>(${$x} − 5) + (7 + 2${$x}) = 0 n'est pas une équation produit nul : le membre de gauche n'est pas un produit.</p>
  <h4>b) Résoudre une équation produit nul</h4>
  <div class="retenir" data-l="Propriété"><p>Un produit est nul si, et seulement si, au moins l'un de ses facteurs est nul.</p></div>
  <div class="retenir" data-l="Propriété"><p>${$a}, ${$b}, ${X("c")} et ${X("d")} désignent des nombres relatifs.</p><p>Les solutions de l'équation « produit nul » (${$a}${$x} + ${$b})(${X("c")}${$x} + ${X("d")}) = 0 sont les nombres ${$x} tels que :</p><p class="calc">${$a}${$x} + ${$b} = 0 &emsp;<b>ou</b>&emsp; ${X("c")}${$x} + ${X("d")} = 0</p></div>
  <p><b>Exercice :</b> résoudre les équations suivantes.</p>
  <p><b>a)</b> (${$x} − 5)(7 + 2${$x}) = 0 est une équation « produit nul ».</p>${pnul(f(1,-5),f(2,7,1))}
  <p><b>b)</b> ${$x}(9${$x} − 4) = 0 est une équation « produit nul ».</p>${pnul(f(1,0),f(9,-4))}
  <p><b>c)</b> (4 − 5${$x})<sup>2</sup> = 0, c'est-à-dire (4 − 5${$x})(4 − 5${$x}) = 0 : c'est une équation « produit nul ».</p>${calc(fLines(f(-5,4,1)))}<p>La solution de l'équation est <b>0,8</b>.</p>`},
{k:"IV", t:"Résoudre une équation du type x² = a", h:`
  <div class="retenir" data-l="Propriété"><p>${$a} désigne un nombre positif ou nul.</p><p>Les solutions de l'équation ${sq($x)} = ${$a} sont les nombres ${rac($a)} et −${rac($a)}.</p></div>
  <p><b>Exercice :</b> résoudre les équations suivantes.</p>
  <p><b>a)</b> ${sq($x)} = 25</p><p class="calc">Soit ${$x} = ${rac(25)} ou ${$x} = −${rac(25)}<br>${$x} = 5 &emsp; ${$x} = −5</p><p>Les solutions de l'équation sont 5 et −5.</p>
  <p><b>b)</b> ${sq($x)} = 32</p><p class="calc">Donc ${$x} = ${rac(32)} ou ${$x} = −${rac(32)}</p><p>Les solutions de l'équation sont ${rac(32)} et −${rac(32)}.</p>
  <p><b>c)</b> ${sq($x)} = 0</p><p class="calc">Donc ${$x} = 0</p><p>La solution de l'équation est 0.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Une identité remarquable", e:[
  {n:"Activité 1", t:"Développer des expressions littérales", w:"Sur ton cahier", h:`<p><b>1 –</b> Développe et réduis les expressions suivantes :</p>${cols([`A = (${$x} − 4)(5${$x} + 2)`,`B = (${$x} + 5)(${$x} − 5)`,`C = (3${$x} − 2)(3${$x} + 2)`])}<p><b>2 –</b> Les calculs B et C ont un point en commun. Que remarques-tu ?</p>`,
   c:`<p><b>1 –</b></p>${eqs("A",[`(${$x} − 4)(5${$x} + 2)`,`5${sq($x)} + 2${$x} − 20${$x} − 8`,`5${sq($x)} − 18${$x} − 8`])}${eqs("B",[`(${$x} + 5)(${$x} − 5)`,`${sq($x)} − 5${$x} + 5${$x} − 25`,`${sq($x)} − 25`])}${eqs("C",[`(3${$x} − 2)(3${$x} + 2)`,`9${sq($x)} + 6${$x} − 6${$x} − 4`,`9${sq($x)} − 4`])}
   <p><b>2 –</b> Dans B et C, les deux facteurs sont de la forme (${$a} + ${$b}) et (${$a} − ${$b}) : les termes en ${$x} s'annulent.</p><p>Le résultat est une différence de deux carrés : (${$x} + 5)(${$x} − 5) = ${sq($x)} − ${sq(5)} et (3${$x} − 2)(3${$x} + 2) = ${sq("(3"+$x+")")} − ${sq(2)}.</p><p>C'est l'identité remarquable (${$a} + ${$b})(${$a} − ${$b}) = ${sq($a)} − ${sq($b)}.</p>`},
  {n:"Exercice 1", t:"Développer en utilisant (a + b)(a − b) = a² − b²", w:"Sur ton cahier", h:`<p>Développe les expressions suivantes en utilisant la propriété découverte : (${$a} + ${$b})(${$a} − ${$b}) = ${sq($a)} − ${sq($b)}.</p>${cols([`A = (${$x} + 6)(${$x} − 6)`,`B = (${$x} − 3)(${$x} + 3)`,`C = (4${$x} + 5)(4${$x} − 5)`,`D = (7${$x} − 1)(7${$x} + 1)`])}`,
   c:`${eqs("A",devAB(1,6))}${eqs("B",devAB(1,3,0))}${eqs("C",devAB(4,5))}${eqs("D",devAB(7,1,0))}`},
  {n:"Activité 2", t:"Factoriser en utilisant a² − b² = (a + b)(a − b)", w:"Sur ton cahier", h:`<p>Nous avons découvert cette propriété : (${$a} + ${$b})(${$a} − ${$b}) = ${sq($a)} − ${sq($b)}.</p>
   <p>Écrite de cette manière, la propriété permet de <b>développer</b> : elle transforme un produit en une soustraction.</p><p>Écrite de cette manière : ${sq($a)} − ${sq($b)} = (${$a} + ${$b})(${$a} − ${$b}), la propriété permet de <b>factoriser</b> : elle transforme une soustraction en un produit.</p>
   <p><b>Exercice :</b> factorise les expressions suivantes.</p>${cols([`A = ${sq($x)} − 81`,`B = 36${sq($x)} − 64`])}`,
   c:`${eqs("A",facAB(1,9))}${eqs("B",facAB(6,8))}`},
  {n:"Exercice 2", t:"Factoriser en utilisant a² − b² = (a + b)(a − b)", w:"Sur ton cahier", h:`<p>Factorise les expressions suivantes.</p>${cols([`A = ${sq($x)} − 100`,`B = ${sq($x)} − 9`,`C = 25${sq($x)} − 1`,`D = 4${sq($x)} − 49`])}`,
   c:`${eqs("A",facAB(1,10))}${eqs("B",facAB(1,3))}${eqs("C",facAB(5,1))}${eqs("D",facAB(2,7))}`}
 ]},
{t:"Équations « produit nul »", e:[
  {n:"Exercice 3", t:"Résoudre des équations « produit nul »", w:"Sur ton cahier", h:`<p>Résous les équations suivantes.</p>${cols(EX3S.map((s,i)=>`<b>${L6[i]})</b> ${s}`))}`,
   c:EX3.map(([A,B,o],i)=>`<p><b>${L6[i]})</b> ${EX3S[i]}</p>${pnul(A,B,o||{})}`).join("")}
 ]},
{t:"Équations de la forme <i>x</i>² = a", e:[
  {n:"Exercice 4", t:"Résoudre des équations de la forme x² = a", w:"Sur ton cahier", h:`<p><b>Partie 1 :</b> résous les équations suivantes.</p>${cols([`<b>a)</b> ${sq($x)} = 36`,`<b>b)</b> ${sq($x)} = 40`,`<b>c)</b> ${sq($x)} = 0`])}
   <p><b>Partie 2 :</b> ramène-toi à des équations de la forme ${sq($x)} = a, puis résous-les.</p>${cols([`<b>a)</b> 2${sq($x)} = 18`,`<b>b)</b> ${sq($x)} − 10 = 0`])}`,
   c:`<p><b>Partie 1 – a)</b> ${sq($x)} = 36</p>${rootSol(36)}<p><b>b)</b> ${sq($x)} = 40</p>${rootSol(40)}<p><b>c)</b> ${sq($x)} = 0</p>${rootSol(0)}
   <p><b>Partie 2 – a)</b></p>${calc([`2${sq($x)} = 18`,[`${sq($x)} = 9`,"÷ 2"]])}${rootSol(9)}<p><b>b)</b></p>${calc([`${sq($x)} − 10 = 0`,[`${sq($x)} = 10`,"+ 10"]])}${rootSol(10)}`},
  {n:"Exercice 5", t:"Vu au brevet", w:"Sur ton cahier", h:`<p>On considère le programme de calcul suivant.</p>${progDiag("Soustraire 2","Ajouter 5","Programme : choisir un nombre ; d'un côté soustraire 2, de l'autre ajouter 5 ; multiplier les deux nombres obtenus")}
   <p><b>1.</b> Vérifie qu'en choisissant −2 comme nombre de départ, on obtient −12.</p><p><b>2.</b> Avec ce programme, quel nombre faut-il choisir au départ pour obtenir 0 ? Justifie la réponse.</p>`,
   c:`<p><b>1.</b> −2 − 2 = −4 et −2 + 5 = 3, puis −4 × 3 = −12. On obtient bien −12.</p>
   <p><b>2.</b> On note ${$x} le nombre de départ. Le résultat est (${$x} − 2)(${$x} + 5). On résout (${$x} − 2)(${$x} + 5) = 0 : c'est une équation « produit nul ».</p>${pnul(f(1,-2),f(1,5))}<p>Il faut choisir <b>2</b> ou <b>−5</b>.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Développer avec (a + b)(a − b)", schema:S_ID, q:{
 1:[ {g:()=>{ const k=ri(2,12), good=`${sq($x)} − ${k*k}`; return {q:`Développe (${$x} + ${k})(${$x} − ${k}).`, c:ch4(good,[`${sq($x)} + ${k*k}`,`${sq($x)} − ${2*k}`,`${sq($x)} − ${k}`]), rep:good, ex:`(${$a} + ${$b})(${$a} − ${$b}) = ${sq($a)} − ${sq($b)} : ${sq($x)} − ${sq(k)} = ${sq($x)} − ${k*k}.`, sx:S_ID}; }} ],
 2:[ {g:()=>{ const k=ri(2,9), m=ri(1,9), good=`${k*k}${sq($x)} − ${m*m}`; return {q:`Développe (${k}${$x} − ${m})(${k}${$x} + ${m}).`, c:ch4(good,[`${k}${sq($x)} − ${m*m}`,`${k*k}${sq($x)} + ${m*m}`,`${k*k}${sq($x)} − ${m}`]), rep:good, ex:`${sq("("+k+$x+")")} − ${sq(m)} = ${k*k}${sq($x)} − ${m*m}.`, sx:S_ID}; }} ],
 3:[ {g:()=>{ const k=ri(2,9), m=ri(2,9); return {q:`Développe et réduis (${k}${$x} + ${m})(${k}${$x} − ${m}). Quel est le nombre devant ${sq($x)} ?`, rep:String(k*k), ex:`${sq("("+k+$x+")")} = ${k*k}${sq($x)}. Le résultat est ${k*k}${sq($x)} − ${m*m}.`, sx:S_ID}; }},
     {g:()=>{ const a=ri(2,6), b=ri(1,9);
       return {q:`Laquelle de ces égalités utilise <b>correctement</b> l'identité (${$a} + ${$b})(${$a} − ${$b}) = ${sq($a)} − ${sq($b)} ?`, c:ch4(`(${a}${$x} + ${b})(${a}${$x} − ${b}) = ${a*a}${sq($x)} − ${b*b}`,[`(${a}${$x} + ${b})(${a}${$x} − ${b}) = ${a}${sq($x)} − ${b*b}`,`(${a}${$x} + ${b})(${a}${$x} − ${b}) = ${a*a}${sq($x)} + ${b*b}`,`(${a}${$x} + ${b})(${a}${$x} + ${b}) = ${a*a}${sq($x)} − ${b*b}`]), rep:`(${a}${$x} + ${b})(${a}${$x} − ${b}) = ${a*a}${sq($x)} − ${b*b}`, ex:`On élève au carré tout le terme ${a}${$x} : ${sq("("+a+$x+")")} = ${a*a}${sq($x)}. Et les deux facteurs doivent être (${$a} + ${$b}) et (${$a} − ${$b}).`, sx:S_ID}; }} ]
}},
{nom:"Factoriser a² − b²", schema:S_FAC, q:{
 1:[ {g:()=>{ const k=ri(2,12), good=`(${$x} + ${k})(${$x} − ${k})`; return {q:`Factorise ${sq($x)} − ${k*k}.`, c:ch4(good,[`(${$x} − ${k})(${$x} − ${k})`,`(${$x} + ${k*k})(${$x} − ${k*k})`,`${$x}(${$x} − ${k*k})`]), rep:good, ex:`${sq($x)} − ${k*k} = ${sq($x)} − ${sq(k)} = (${$x} + ${k})(${$x} − ${k}).`, sx:S_FAC}; }} ],
 2:[ {g:()=>{ const k=ri(2,9), m=ri(1,9), good=`(${k}${$x} + ${m})(${k}${$x} − ${m})`; return {q:`Factorise ${k*k}${sq($x)} − ${m*m}.`, c:ch4(good,[`(${k*k}${$x} + ${m})(${k*k}${$x} − ${m})`,`(${k}${$x} + ${m*m})(${k}${$x} − ${m*m})`,`(${k}${$x} − ${m})(${k}${$x} − ${m})`]), rep:good, ex:`${k*k}${sq($x)} − ${m*m} = ${sq("("+k+$x+")")} − ${sq(m)} = ${good}.`, sx:S_FAC}; }} ],
 3:[ {g:()=>{ const k=ri(2,9), m=ri(2,12); const good=`(${m} + ${k}${$x})(${m} − ${k}${$x})`; return {q:`Factorise ${m*m} − ${k*k}${sq($x)}.`, c:ch4(good,[`(${k}${$x} + ${m})(${k}${$x} − ${m})`,`(${m*m} + ${k}${$x})(${m*m} − ${k}${$x})`,`(${m} − ${k}${$x})<sup>2</sup>`]), rep:good, ex:`${m*m} − ${k*k}${sq($x)} = ${sq(m)} − ${sq("("+k+$x+")")} : ici ${$a} = ${m} et ${$b} = ${k}${$x}.`, sx:S_FAC}; }} ]
}},
{nom:"Reconnaître une équation produit nul", schema:S_DEF, q:{
 1:[ {g:()=>{ const a=ri(1,9), b=ri(1,9), c=ri(2,9); const good=`(${$x} − ${a})(${$x} + ${b}) = 0`;
       return {q:"Laquelle de ces équations est une équation « produit nul » ?", c:ch4(good,[`(${$x} − ${a}) + (${$x} + ${b}) = 0`,`(${$x} − ${a})(${$x} + ${b}) = ${c}`,`${$x} − ${a} × ${$x} + ${b} = ${c}`]), rep:good, ex:"Un membre est un produit et l'autre membre est égal à 0.", sx:S_DEF}; }} ],
 2:[ {q:"Une équation du second degré a au maximum…", c:["2 solutions","1 solution","3 solutions","une infinité de solutions"], rep:"2 solutions", ex:"C'est écrit dans le cours : au maximum 2 solutions.", sx:S_DEF},
     {g:()=>{ const a=ri(1,9), b=ri(1,9); return {q:`L'équation (${$x} + ${a})(${$x} − ${b}) = ${a*b} est-elle une équation « produit nul » ?`, c:["Oui","Non"], rep:"Non", ex:"Le membre de droite n'est pas égal à 0.", sx:S_DEF}; }} ],
 3:[ {g:()=>{ const a=ri(2,9); return {q:`Vrai ou faux : (${a}${$x} − 1)<sup>2</sup> = 0 est une équation « produit nul ».`, c:VF, rep:"Vrai", ex:`(${a}${$x} − 1)<sup>2</sup> = (${a}${$x} − 1)(${a}${$x} − 1) : c'est un produit égal à 0.`, sx:S_DEF}; }},
     {q:`Vrai ou faux : « un produit est nul si et seulement si au moins l'un de ses facteurs est nul ».`, c:VF, rep:"Vrai", ex:"C'est la propriété utilisée pour résoudre les équations produit nul.", sx:S_PN} ]
}},
{nom:"Résoudre une équation produit nul", schema:S_PN, q:{
 1:[ {g:()=>{ let a,b; do{ a=ri(1,9); b=ri(1,9); }while(a===b); const good=`${a} et −${b}`; return {q:`Quelles sont les solutions de (${$x} − ${a})(${$x} + ${b}) = 0 ?`, c:ch4(good,[`−${a} et ${b}`,`${a} et ${b}`,`${a*b}`]), rep:good, ex:`Soit ${$x} − ${a} = 0, donc ${$x} = ${a} ; soit ${$x} + ${b} = 0, donc ${$x} = −${b}.`, sx:S_PN}; }} ],
 2:[ {g:()=>{ let A,B; do{ A=f(ri(2,9),ri(-9,9)); B=f(ri(2,9),ri(-9,9)); }while(A.b===0||B.b===0||same(A,B)||(()=>{ const k=(u,v)=>[u,v].sort((p,q)=>p-q).join("|"), S=[k(-A.b/A.a,-B.b/B.a),k(A.b/A.a,B.b/B.a),k(-A.a/A.b,-B.a/B.b),k(-A.b,-B.b)]; return new Set(S).size<4; })());
       const s=x=>SV(...fSol(x)), good=`${s(A)} et ${s(B)}`;
       return {q:`Quelles sont les solutions de ${fp(A)}${fp(B)} = 0 ?`, c:ch4(good,[`${SV(A.b,A.a)} et ${SV(B.b,B.a)}`,`${SV(-A.a,A.b)} et ${SV(-B.a,B.b)}`,`${SV(-A.b,1)} et ${SV(-B.b,1)}`]), rep:good, ex:`${fs(A)} = 0 donne ${$x} = ${s(A)} ; ${fs(B)} = 0 donne ${$x} = ${s(B)}.`, sx:S_PN}; }} ],
 3:[ {g:()=>{ let A; do{ A=f(ri(2,9),ri(-9,9)); }while(A.b===0); const good=SV(...fSol(A)); return {q:`Combien de solutions a l'équation ${fp(A)}<sup>2</sup> = 0, et laquelle ?`, c:ch4(`une seule : ${good}`,[`deux : ${good} et ${SV(A.b,A.a)}`,`aucune`,`une seule : ${SV(A.b,A.a)}`]), rep:`une seule : ${good}`, ex:`${fp(A)} × ${fp(A)} = 0 donne ${fs(A)} = 0, donc ${$x} = ${good}.`, sx:S_PN}; }},
     {g:()=>{ const k=ri(2,9), a=ri(2,9), b=ri(1,9)*pick([1,-1]); const B=f(a,b), good=`0 et ${SV(-b,a)}`; return {q:`Quelles sont les solutions de ${k}${$x}(${fs(B)}) = 0 ?`, c:ch4(good,[`${k} et ${SV(-b,a)}`,`${SV(-b,a)} seulement`,`0 et ${SV(b,a)}`]), rep:good, ex:`${k}${$x} = 0 donne ${$x} = 0 ; ${fs(B)} = 0 donne ${$x} = ${SV(-b,a)}.`, sx:S_PN}; }} ]
}},
{nom:"Résoudre x² = a", schema:S_X2, q:{
 1:[ {g:()=>{ const k=ri(2,12); const good=`${k} et −${k}`; return {q:`Quelles sont les solutions de ${sq($x)} = ${k*k} ?`, c:ch4(good,[`${k} seulement`,`${F(k*k/2)}`,`${k*k} et −${k*k}`]), rep:good, ex:`${rac(k*k)} = ${k}, donc ${$x} = ${k} ou ${$x} = −${k}.`, sx:S_X2}; }} ],
 2:[ {g:()=>{ let n; do{ n=ri(2,60); }while(isSq(n)); const good=`${rac(n)} et −${rac(n)}`; return {q:`Quelles sont les solutions de ${sq($x)} = ${n} ?`, c:ch4(good,[`${rac(n)} seulement`,`${F(n/2)} et −${F(n/2)}`,`aucune`]), rep:good, ex:`${$x} = ${rac(n)} ou ${$x} = −${rac(n)}.`, sx:S_X2}; }},
     {q:`Combien de solutions a l'équation ${sq($x)} = 0 ?`, c:["une seule : 0","deux","aucune"], rep:"une seule : 0", ex:`Seul 0 a pour carré 0.`, sx:S_X2} ],
 3:[ {g:()=>{ const a=ri(2,5), k=ri(2,9); const good=`${k} et −${k}`; return {q:`Quelles sont les solutions de ${a}${sq($x)} = ${a*k*k} ?`, c:ch4(good,[`${a*k} et −${a*k}`,`${rac(a*k*k)} et −${rac(a*k*k)}`,`${k} seulement`]), rep:good, ex:`On divise par ${a} : ${sq($x)} = ${k*k}, donc ${$x} = ${k} ou ${$x} = −${k}.`, sx:S_X2}; }},
     {g:()=>{ let n; do{ n=ri(2,50); }while(isSq(n)); const good=`${rac(n)} et −${rac(n)}`; return {q:`Quelles sont les solutions de ${sq($x)} − ${n} = 0 ?`, c:ch4(good,[`${n} et −${n}`,`${rac(n)} seulement`,`aucune`]), rep:good, ex:`On ajoute ${n} : ${sq($x)} = ${n}, donc ${$x} = ${rac(n)} ou ${$x} = −${rac(n)}.`, sx:S_X2}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 16", duree:45, info:"Durée : 45 min · Calculatrice autorisée · Rédige chaque résolution sur ta copie",
comp:[
  ["CALCULER","Je développe une expression avec (a + b)(a − b) = a² − b².","Ex. 1 (3 points)"],
  ["CALCULER","Je factorise une expression de la forme a² − b².","Ex. 2 (3 points)"],
  ["RAISONNER","Je reconnais et je résous une équation « produit nul ».","Ex. 3 et 4 (7 points)"],
  ["RAISONNER","Je résous une équation de la forme x² = a.","Ex. 5 (4 points)"],
  ["MODÉLISER","Je résous un problème qui conduit à une équation produit nul.","Ex. 6 (3 points)"]
],
exos:[
{t:"Développer", p:3, h:`<p>Développe les expressions suivantes en utilisant une identité remarquable.</p>${cols([`A = (${$x} + 7)(${$x} − 7)`,`B = (2${$x} − 3)(2${$x} + 3)`,`C = (10${$x} + 1)(10${$x} − 1)`])}`,
 c:`${eqs("A",devAB(1,7))}${eqs("B",devAB(2,3,0))}${eqs("C",devAB(10,1))}<p><i>(1 point par expression)</i></p>`},
{t:"Factoriser", p:3, h:`<p>Factorise les expressions suivantes.</p>${cols([`A = ${sq($x)} − 64`,`B = 9${sq($x)} − 16`,`C = 81 − 4${sq($x)}`])}`,
 c:`${eqs("A",facAB(1,8))}${eqs("B",facAB(3,4))}${eqs("C",[`81 − 4${sq($x)}`,`${sq(9)} − ${sq("(2"+$x+")")}`,`(9 + 2${$x})(9 − 2${$x})`])}<p><i>(1 point par expression)</i></p>`},
{t:"Produit nul ou pas ?", p:2, h:`<p>Pour chaque équation, dis si c'est une équation « produit nul ». Réponds par oui ou non.</p>${cols([`a) (${$x} + 1)(${$x} − 6) = 0`,`b) (${$x} + 1) + (${$x} − 6) = 0`,`c) (${$x} + 1)(${$x} − 6) = 4`,`d) 5${$x}(2${$x} − 1) = 0`])}`,
 c:`<p>a) Oui · b) Non : le membre de gauche n'est pas un produit · c) Non : le membre de droite n'est pas 0 · d) Oui</p><p><i>(0,5 point par réponse)</i></p>`},
{t:"Résoudre des équations produit nul", p:5, h:`<p>Résous les équations suivantes.</p>${cols([`a) (${$x} − 8)(${$x} + 3) = 0`,`b) (3${$x} − 12)(2${$x} + 5) = 0`,`c) ${$x}(6 − 5${$x}) = 0`,`d) (7${$x} + 2)<sup>2</sup> = 0`])}`,
 c:`<p>a)</p>${pnul(f(1,-8),f(1,3))}<p><i>(1 point)</i></p><p>b)</p>${pnul(f(3,-12),f(2,5))}<p><i>(1,5 point)</i></p><p>c)</p>${pnul(f(1,0),f(-5,6,1))}<p><i>(1 point)</i></p><p>d)</p>${pnul(f(7,2),null,{sqr:1})}<p><i>(1,5 point)</i></p>`},
{t:"Équations de la forme x² = a", p:4, h:`<p>Résous les équations suivantes.</p>${cols([`a) ${sq($x)} = 49`,`b) ${sq($x)} = 13`,`c) 3${sq($x)} = 48`,`d) ${sq($x)} + 5 = 5`])}`,
 c:`<p>a)</p>${rootSol(49)}<p>b)</p>${rootSol(13)}<p>c)</p>${calc([`3${sq($x)} = 48`,[`${sq($x)} = 16`,"÷ 3"]])}${rootSol(16)}<p>d)</p>${calc([`${sq($x)} + 5 = 5`,[`${sq($x)} = 0`,"− 5"]])}${rootSol(0)}<p><i>(1 point par équation)</i></p>`},
{t:"Un programme de calcul", p:3, h:`${progDiag("Ajouter 4","Soustraire 3","Programme : choisir un nombre ; d'un côté ajouter 4, de l'autre soustraire 3 ; multiplier les deux nombres obtenus")}<p>1) Quel résultat obtient-on en choisissant 5 ?</p><p>2) Quels nombres faut-il choisir pour obtenir 0 ? Justifie.</p>`,
 c:`<p>1) 5 + 4 = 9 et 5 − 3 = 2, puis 9 × 2 = 18. <i>(1 point)</i></p><p>2) Avec ${$x} au départ, on obtient (${$x} + 4)(${$x} − 3). On résout (${$x} + 4)(${$x} − 3) = 0.</p>${pnul(f(1,4),f(1,-3))}<p>Il faut choisir −4 ou 3. <i>(2 points)</i></p>`}
]}
};
})();
