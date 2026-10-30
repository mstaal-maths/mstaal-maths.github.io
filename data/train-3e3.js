/* 3e · chapitre 3 — fiche d'entraînement : les exercices de la fiche de M. Staal (réduire, développer, démontrer, factoriser), avec d'autres nombres.
   Toutes les corrections sont calculées par le moteur window.ALG3 (data/3e-3.js). */
TRAIN["3e-3"] = function(){
const {ri, pick, shuf, distinct} = TR;
const AL = window.ALG3, {T, show, red, sum, sortD, devLines, factLines, factSteps, tStr, rectFig, prog, grid, calc} = AL;
const nz = (a,b) => { let v; do{ v=ri(a,b); }while(v===0); return v; };
const sg = v => v<0 ? `-${-v}` : `+${v}`;
const co = (a,m="x") => (a===1?"":a===-1?"-":String(a))+m;          /* « 3x », « -x », « x » */
const dv = (n,s) => calc(devLines(n,s)), fc = (n,s) => calc(factLines(n,s));
const E = (n,s) => `${n} = ${show(s)}`;
const N = v => String(v).replace("-","−");
const P = v => v<0 ? `(${N(v)})` : N(v);
const LET = "ABCDEFGHIJKLMN";
/* pas de programme : « Ajouter 3 », « Soustraire 3 », « Multiplier par −2 » */
const step = (op,v) => op==="+" ? (v<0?`Soustraire ${-v}.`:`Ajouter ${v}.`) : `Multiplier par ${N(v)}.`;

/* ===== Activité 2 : opposés ===== */
const a2 = [ri(2,9), -ri(2,9)], a3=[ri(2,9),ri(2,9)], a4=(()=>{ const u=ri(5,12), v=ri(1,u-1); return [u,v]; })(), a5=[ri(1,9),ri(1,9)], a6=[ri(2,9),ri(2,9)], a7=[ri(2,9),ri(1,9)];
const OPP = [
  [`${a2[0]}`, `−${a2[0]}`, `−${a2[0]}`],
  [`−${-a2[1]}`, `${-a2[1]}`, `−(−${-a2[1]}) = ${-a2[1]}`],
  [`${a3[0]} + ${a3[1]}`, `${N(-(a3[0]+a3[1]))}`, `−(${a3[0]} + ${a3[1]}) = −${a3[0]} − ${a3[1]} = ${N(-(a3[0]+a3[1]))}`],
  [`${a4[0]} − ${a4[1]}`, `${N(-(a4[0]-a4[1]))}`, `−(${a4[0]} − ${a4[1]}) = −${a4[0]} + ${a4[1]} = ${N(-(a4[0]-a4[1]))}`],
  [`−${a5[0]} − ${a5[1]}`, `${a5[0]+a5[1]}`, `−(−${a5[0]} − ${a5[1]}) = ${a5[0]} + ${a5[1]} = ${a5[0]+a5[1]}`],
  [`${a6[0]}<i>x</i> − ${a6[1]}`, `−${a6[0]}<i>x</i> + ${a6[1]}`, `−(${a6[0]}<i>x</i> − ${a6[1]}) = −${a6[0]}<i>x</i> + ${a6[1]}`],
  [`−${a7[0]}<i>y</i> + ${a7[1]}`, `${a7[0]}<i>y</i> − ${a7[1]}`, `−(−${a7[0]}<i>y</i> + ${a7[1]}) = ${a7[0]}<i>y</i> − ${a7[1]}`]
];
/* ===== Exercice 1 : ±( ) ===== */
const lin = () => { const a=nz(-9,9), b=nz(-9,9); return Math.random()<0.5 ? `${co(a)}${sg(b)}` : `${b}${a<0?"-":"+"}${co(Math.abs(a))}`; };
const E1T = [ ()=>`-(${lin()})`, ()=>`+(${lin()})`, ()=>`-(${lin()})`, ()=>`${nz(-9,9)}+(${lin()})`, ()=>`${co(nz(-9,9))}+(${lin()})`, ()=>`${co(nz(-9,9))}-(${lin()})`, ()=>`${nz(-9,9)}-(${lin()})`, ()=>`${co(nz(-5,5),"x2")}-(${co(nz(1,9),"x2")}${sg(nz(-9,9))})` ];
const EX1 = E1T.map(f=>f());
/* ===== Activité 3 : programme « +a, ×b, −ab » ===== */
const A3 = {a:ri(2,9), b:ri(2,5)}; A3.v=ri(2,9); A3.w=-ri(2,9);
const A3r = v => (v+A3.a)*A3.b-A3.a*A3.b;
/* ===== Exercice 2 ===== */
const EX2 = [ `${ri(2,9)}*(x${sg(ri(1,9))})`, `${co(ri(2,6))}*(${co(ri(2,7))}${sg(ri(1,9))})`, `${ri(2,9)}(${ri(1,9)}-${co(ri(2,9))})`, `(${ri(1,9)}+${co(ri(2,9))})*${ri(2,9)}`, `-${co(ri(2,6))}(${co(ri(2,6))}-${ri(1,9)})` ];
/* ===== Exercice 3 : tout type ===== */
const E3T = [ ()=>`-${ri(2,9)}(x${sg(nz(-9,9))})`, ()=>`(${nz(-9,9)}+${co(ri(2,6))})*(${co(ri(2,6))})`, ()=>`${co(ri(2,6))}(-${co(ri(2,6))}-${ri(1,9)})`, ()=>`${ri(2,9)}(${co(nz(-9,9))}${sg(nz(-9,9))})${sg(nz(-12,12))}x`,
  ()=>`${co(nz(-9,9),"x2")}+${co(ri(2,6))}(-${co(ri(2,5))}+${ri(1,9)})`, ()=>`(${ri(1,9)}-${co(ri(2,6))})*(-${ri(2,5)})${sg(nz(-9,9))}x`, ()=>`${co(ri(2,12))}-${ri(2,6)}(${co(ri(2,6))}+${ri(1,9)})`, ()=>`${ri(2,6)}(x+${ri(1,9)})+${ri(2,6)}(${co(ri(2,5))}-${ri(1,9)})`,
  ()=>`${co(nz(-9,9))}-(${co(nz(-9,9))}${sg(nz(-9,9))})`, ()=>`${co(ri(2,12))}${sg(nz(-9,9))}+${ri(2,6)}(x${sg(nz(-9,9))})` ];
const EX3 = shuf(E3T).slice(0,8).map(f=>f());
/* ===== Programmes égaux ? ===== */
const PE = distinct(2, ()=>{ const a=ri(2,6), b=ri(1,9), c=ri(2,5), eq=Math.random()<0.5; let d=b*c; if(!eq) do{ d=b*c+nz(-6,6); }while(d<1); return {a,b,c,d,eq}; }, o=>o.eq+"-"+o.a);
const peProg = o => `<div class="progs">${prog("Programme 1",["Choisir un nombre.",step("×",o.a),step("+",o.b),step("×",o.c)])}${prog("Programme 2",["Choisir un nombre.",step("×",o.a*o.c),step("+",o.d)])}</div>`;
const peCorr = o => { const t=2, r1=(t*o.a+o.b)*o.c, r2=t*o.a*o.c+o.d;
  return `<p>Je teste les deux programmes avec ${t} :</p><div class="calcs">${calc([`A = (${t} × ${o.a} + ${o.b}) × ${o.c}`,`A = (${t*o.a} + ${o.b}) × ${o.c}`,`A = ${t*o.a+o.b} × ${o.c}`,`A = ${r1}`])}${calc([`B = ${t} × ${o.a*o.c} ${o.d<0?"−":"+"} ${Math.abs(o.d)}`,`B = ${t*o.a*o.c} ${o.d<0?"−":"+"} ${Math.abs(o.d)}`,`B = ${r2}`])}</div>`
   + (o.eq ? `<p>Les résultats sont égaux, mais cela ne prouve rien pour tous les nombres. Je teste avec <i>x</i> :</p>` : `<p>${r1} ≠ ${r2} : c'est un <b>contre-exemple</b>. Avec le calcul littéral :</p>`)
   + `<div class="calcs">${dv("P<sub>1</sub>",`(${co(o.a)}+${o.b})*${o.c}`)}${calc([`P<sub>2</sub> = <i>x</i> × ${o.a*o.c} ${o.d<0?"−":"+"} ${Math.abs(o.d)}`, `P<sub>2</sub> = ${sum([T(o.a*o.c,"x"),T(o.d)])}`])}</div>`
   + `<p>${o.eq?"Les deux programmes donnent <b>toujours le même résultat</b>.":`${sum([T(o.a*o.c,"x"),T(o.b*o.c)])} et ${sum([T(o.a*o.c,"x"),T(o.d)])} diffèrent toujours de ${Math.abs(o.b*o.c-o.d)} : les programmes ne donnent <b>jamais</b> le même résultat.`}</p>`; };
/* ===== Programme « Scratch » : a = x − p ; b = a × q ; c = b − x ; d = c + p·q → (q − 1)x ===== */
const SC = {p:ri(2,9), q:ri(2,4)}; SC.u=ri(3,10); SC.v=-ri(2,8);
const scR = x => (x-SC.p)*SC.q - x + SC.p*SC.q;
const scK = SC.q-1;
const scTxt = `<div class="pgc"><b>Programme Scratch</b><ul><li>demander « Donne un nombre » et attendre</li><li>mettre a à (réponse − ${SC.p})</li><li>mettre b à (a × ${SC.q})</li><li>mettre c à (b − réponse)</li><li>mettre d à (c + ${SC.p*SC.q})</li><li>dire d</li></ul></div>`;
const scLine = (x,n) => calc([`${n} = (${N(x)} − ${SC.p}) × ${SC.q} − ${P(x)} + ${SC.p*SC.q}`,`${n} = ${P(x-SC.p)} × ${SC.q} ${x<0?"+":"−"} ${Math.abs(x)} + ${SC.p*SC.q}`,`${n} = ${N((x-SC.p)*SC.q)} ${x<0?"+":"−"} ${Math.abs(x)} + ${SC.p*SC.q}`,`${n} = ${N(scR(x))}`]);
/* ===== Mêmes aires ? ===== */
const MA = (()=>{ const a=ri(3,6), b=ri(2,4), eq=Math.random()<0.5, c=a*b+(eq?0:pick([-2,-1,1,2])*b); return {a,b,c,eq}; })();
/* ===== Exercice 11 : factoriser ===== */
const fT = [ ()=>{ const k=ri(2,9), a=ri(1,9); let b; do{ b=ri(1,9); }while(TR.gcd(a,b)!==1); return `${k*a}x+${k*b}`; },
  ()=>{ const k=ri(2,9), a=ri(1,9); let b; do{ b=ri(1,9); }while(TR.gcd(a,b)!==1); return `${k*b}-${k*a}y`; },
  ()=>{ const a=ri(2,9); let b; do{ b=ri(1,9); }while(TR.gcd(a,b)!==1); return `${a}x2-${b}x`; },
  ()=>{ const k=ri(2,6), a=ri(1,6); let b; do{ b=ri(1,6); }while(TR.gcd(a,b)!==1); return `${k*a}x2+${k*b}x`; },
  ()=>`${ri(2,9)}x+yx`,
  ()=>{ const k=ri(2,9), a=ri(2,9); return `${k*a}x+${k}`; },
  ()=>{ const k=ri(2,6); let a; do{ a=ri(2,9); }while(TR.gcd(a,1)!==1); return `${k*a}x2-${k}`; } ];
const EX11 = shuf(fT).concat(shuf(fT)).slice(0,8).map(f=>f());
/* ===== Exercice 12 : développer ou factoriser ===== */
const EX12 = shuf([ {s:`${co(ri(2,6))}(x+${ri(1,9)})`, d:true}, {s:fT[0](), d:false}, {s:(()=>{ const k=ri(2,6), b=ri(2,6); return `${k*b}x-${k}x2`; })(), d:false}, {s:fT[5](), d:false}, {s:`${ri(2,5)}y(${ri(2,9)}-${co(ri(2,5))})`, d:true}, {s:`(${co(ri(2,5))}-${ri(1,9)})*(-${ri(2,6)})`, d:true} ]);

return [
 {t:"Réduire et supprimer des parenthèses", e:[
  {n:"Activité 2", t:"L'opposé d'un nombre ou d'une opération", w:"Sur ton cahier", h:`<p>Recopie et complète : donne l'opposé, puis le calcul associé.</p>${OPP.map((o,i)=>`<p><b>${"abcdefg"[i]})</b> L'opposé de ${o[0]} est …</p>`).join("")}`,
   c:OPP.map((o,i)=>{ const p=o[2].split(" = "), N="ABCDEFG"[i];   /* calcul en chaîne nommé quand il y a des étapes */
     return p.length>2 ? `<p><b>${"abcdefg"[i]})</b> L'opposé de ${o[0]} est <b>${o[1]}</b> :</p>${calc(p.map(t=>`${N} = ${t}`))}` : `<p><b>${"abcdefg"[i]})</b> L'opposé de ${o[0]} est <b>${o[1]}</b> : ${o[2]}</p>`; }).join("")},
  {n:"Exercice 1", t:"Réduire des expressions de la forme −(a + b) ou +(a + b)", w:"Sur ton cahier", h:`<p>Recopie les expressions sur ton cahier et réduis-les.</p>${grid(EX1.map((s,i)=>E(LET[i],s)))}`,
   c:grid(EX1.map((s,i)=>dv(LET[i],s)))}
 ]},
 {t:"Développer avec la simple distributivité", e:[
  {n:"Activité 3", t:"Programme de calcul", w:"Sur ton cahier", h:`${prog("Programme de calcul",["Prendre un nombre.",`Lui ajouter ${A3.a}.`,`Multiplier le résultat par ${A3.b}.`,`Soustraire ${A3.a*A3.b}.`])}
   <p><b>1. a)</b> Vérifie qu'avec ${A3.v} comme nombre de départ, le résultat est égal à ${A3r(A3.v)}.</p><p><b>b)</b> Si je choisis ${N(A3.w)} comme nombre de départ, quel résultat vais-je obtenir ?</p><p><b>2.</b> Démontre que pour n'importe quel nombre choisi, le résultat final est égal à ${A3.b} fois le nombre de départ.</p>`,
   c:`<div class="calcs">${calc([`<b>1. a)</b>`,`B = (${A3.v} + ${A3.a}) × ${A3.b} − ${A3.a*A3.b}`,`B = ${A3.v+A3.a} × ${A3.b} − ${A3.a*A3.b}`,`B = ${(A3.v+A3.a)*A3.b} − ${A3.a*A3.b}`,`B = ${A3r(A3.v)}`])}${calc([`<b>b)</b>`,`C = (${N(A3.w)} + ${A3.a}) × ${A3.b} − ${A3.a*A3.b}`,`C = ${P(A3.w+A3.a)} × ${A3.b} − ${A3.a*A3.b}`,`C = ${N((A3.w+A3.a)*A3.b)} − ${A3.a*A3.b}`,`C = <b>${N(A3r(A3.w))}</b>`])}</div>
   <p><b>2.</b> Avec un nombre quelconque <i>x</i> :</p>${dv("A",`(x+${A3.a})*${A3.b}-${A3.a*A3.b}`)}<p>Le résultat est toujours ${A3.b}<i>x</i>, c'est-à-dire ${A3.b} fois le nombre de départ.</p>`},
  {n:"Exercice 2", t:"Développer et réduire", w:"Sur ton cahier", h:`<p>Développe et réduis les expressions suivantes.</p>${grid(EX2.map((s,i)=>E(LET[i],s)))}`,
   c:grid(EX2.map((s,i)=>dv(LET[i],s)))},
  {n:"Exercice 3", t:"Développer et réduire tout type d'expressions", w:"Sur ton cahier", h:`<p>Développe et réduis les expressions suivantes.</p>${grid(EX3.map((s,i)=>E(LET[i],s)))}`,
   c:grid(EX3.map((s,i)=>dv(LET[i],s)))}
 ]},
 {t:"Démontrer avec le calcul littéral", e:[
  ...PE.map((o,i)=>({n:`Exercice ${4+i}`, t:"Programmes égaux ?", w:"Sur ton cahier", h:`${peProg(o)}<p>Si je choisis le même nombre de départ pour les deux programmes, est-ce que les programmes 1 et 2 donneront toujours le même résultat ?</p>`, c:peCorr(o)})),
  {n:"Exercice 6", t:"Programme Scratch", w:"Sur ton cahier", h:`<p>On considère le programme suivant.</p>${scTxt}<p><b>1. a)</b> Calcule le résultat avec ${SC.u}.</p><p><b>b)</b> Calcule le résultat avec ${N(SC.v)}.</p><p><b>2.</b> Que constates-tu ? Émets une conjecture.</p><p><b>3.</b> Démontre si ta conjecture est vraie ou fausse.</p>`,
   c:`<p><b>1. a)</b> Avec ${SC.u} :</p>${scLine(SC.u,"B")}<p><b>b)</b> Avec ${N(SC.v)} :</p>${scLine(SC.v,"C")}<p><b>2.</b> ${scK===1?"Il me semble que le résultat est égal au nombre de départ.":`${N(scR(SC.u))} = ${scK} × ${SC.u} et ${N(scR(SC.v))} = ${scK} × ${P(SC.v)} : il me semble que le programme multiplie le nombre de départ par ${scK}.`}</p>
   <p><b>3.</b> Je teste le programme avec <i>x</i> :</p>${dv("A",`(x-${SC.p})*${SC.q}-x+${SC.p*SC.q}`)}<p>La conjecture est <b>vraie</b>.</p>`},
  {n:"Exercice 7", t:"Mêmes aires ?", w:"Sur ton cahier", h:`<p>On considère les rectangles suivants. <i>x</i> est un nombre positif.</p><div class="figs">${rectFig(`x + ${MA.a}`,`${MA.b}x`)}${rectFig(`${MA.b}x + ${MA.c}`,"x",{w:200,h:70})}</div><p><b>a.</b> Calcule l'aire de chaque rectangle pour <i>x</i> = 2.</p><p><b>b.</b> Ont-ils la même aire quelle que soit la valeur de <i>x</i> ? Justifie.</p>`,
   c:`<p><b>a.</b> Pour <i>x</i> = 2 :</p><div class="calcs">${calc([`A<sub>1</sub> = (2 + ${MA.a}) × ${MA.b} × 2`,`A<sub>1</sub> = ${2+MA.a} × ${2*MA.b}`,`A<sub>1</sub> = ${(2+MA.a)*MA.b*2}`])}${calc([`A<sub>2</sub> = (${MA.b} × 2 + ${MA.c}) × 2`,`A<sub>2</sub> = ${2*MA.b+MA.c} × 2`,`A<sub>2</sub> = ${(2*MA.b+MA.c)*2}`])}</div>
   <p><b>b.</b></p><div class="calcs">${dv("A<sub>1</sub>",`${MA.b}x(x+${MA.a})`)}${dv("A<sub>2</sub>",`x(${MA.b}x+${MA.c})`)}</div><p>${MA.eq?`Les deux aires sont égales à ${sum(red(`${MA.b}x(x+${MA.a})`))} : les rectangles ont <b>toujours la même aire</b>.`:`Les expressions ne sont pas égales : les rectangles n'ont <b>pas toujours la même aire</b>${(2+MA.a)*MA.b*2!==(2*MA.b+MA.c)*2?" (la question a. donne déjà un contre-exemple)":""}.`}</p>`}
 ]},
 {t:"Factoriser", e:[
  {n:"Exercice 10", t:"Entraînement à la factorisation", w:"Sur ton cahier", h:`<p>Factorise les expressions suivantes.</p>${grid(EX11.map((s,i)=>E(LET[i],s)))}`,
   c:grid(EX11.map((s,i)=>fc(LET[i],s)))},
  {n:"Exercice 11", t:"Développer ou factoriser ?", w:"Sur ton cahier", h:`<p>On donne les expressions suivantes :</p>${grid(EX12.map((o,i)=>E(LET[i],o.s)))}<p><b>1.</b> Lesquelles peut-on développer ?</p><p><b>2.</b> Développe et réduis-les.</p><p><b>3.</b> Factorise les autres.</p>`,
   c:`<p><b>1.</b> Les produits : ${EX12.map((o,i)=>o.d?LET[i]:"").filter(Boolean).join(", ")}.</p><p><b>2.</b></p>${grid(EX12.map((o,i)=>o.d?dv(LET[i],o.s):"").filter(Boolean))}<p><b>3.</b></p>${grid(EX12.map((o,i)=>o.d?"":fc(LET[i],o.s)).filter(Boolean))}`}
 ]}
];
};
/* chaque calcul d'une grille .calcs dans sa propre case (voir data/3e-3.js) */
(()=>{ const g=TRAIN["3e-3"], W=h=>typeof h!=="string"?h:h.replace(/(<div class="calcs"[^>]*>)([\s\S]*?)(<\/div>)/g,(m,a,b,c)=>a+b.replace(/<p class="calc">([\s\S]*?)<\/p>/g,'<div><p class="calc">$1</p></div>')+c);
  TRAIN["3e-3"]=function(){ const secs=g.apply(this,arguments); secs.forEach(S=>S.e.forEach(e=>{ e.h=W(e.h); e.c=W(e.c); })); return secs; }; })();
