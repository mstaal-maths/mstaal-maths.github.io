/* 3e — Chapitre 21 : Calcul littéral 3 — démonstration et arithmétique
   Cours et fiche « Preuve et arithmétique » de M. Staal (avec l'exercice de brevet de septembre 2014 et sa correction).
   Les développements utilisent le moteur ALG3 (le même que dans data/3e-3.js). */
/* ---------- moteur de calcul littéral (développer, réduire, factoriser) : window.ALG3 ----------
   Une expression est écrite en texte simple, par exemple "4(-5x+7)+12x", "(6-4x)*(-2)-3x", "-3x-(-8x+10)", "3y(5-2x)".
   On en tire : l'écriture affichée, les étapes du développement et la forme réduite (vérifiées par le calcul). */
window.ALG3 = window.ALG3 || (function(){
const VARS = "xyabnk";
const parseM = m => { const o={}; String(m).replace(/([a-z])(\d*)/g,(_,v,e)=>{ o[v]=(o[v]||0)+(e?+e:1); return ""; }); return o; };
const keyM = o => VARS.split("").filter(v=>o[v]).map(v=>v+(o[v]>1?o[v]:"")).join("");
const mulM = (a,b) => { const A=parseM(a), B=parseM(b); for(const v in B) A[v]=(A[v]||0)+B[v]; return keyM(A); };
const deg = m => Object.values(parseM(m)).reduce((s,e)=>s+e,0);
const T = (c, m="") => ({c, m:keyM(parseM(m))});
const tmul = (s,t) => ({c:s.c*t.c, m:mulM(s.m,t.m)});
const neg = t => ({c:-t.c, m:t.m});
/* réduire : on regroupe les termes semblables (ordre d'apparition) */
const reduce = terms => { const mp=new Map(); terms.forEach(t=>mp.set(t.m,(mp.get(t.m)||0)+t.c)); return [...mp].filter(([,c])=>c!==0).map(([m,c])=>({c,m})); };
const sortD = terms => [...terms].sort((a,b)=>deg(b.m)-deg(a.m) || (a.m<b.m?-1:a.m>b.m?1:0));
const mono = m => m.replace(/([a-z])(\d*)/g,(_,v,e)=>`<i>${v}</i>${e==="2"?"²":e==="3"?"³":e?`<sup>${e}</sup>`:""}`);
const tAbs = t => { const a=Math.abs(t.c); return t.m ? (a===1?"":String(a))+mono(t.m) : String(a); };
const tStr = t => (t.c<0?"−":"")+tAbs(t);
const tPar = t => t.c<0 ? `(${tStr(t)})` : tStr(t);
const sum = terms => terms.length ? terms.map((t,i)=> i===0 ? tStr(t) : (t.c<0?" − ":" + ")+tAbs(t)).join("") : "0";
const ev = (terms, val) => terms.reduce((s,t)=>{ let p=t.c; const o=parseM(t.m); for(const v in o) p*=Math.pow(val[v]??0, o[v]); return s+p; }, 0);

/* ---- analyse d'une expression ---- */
function parse(src){
  const s = String(src).replace(/\s+/g,"").replace(/−/g,"-").replace(/×/g,"*").replace(/²/g,"2").replace(/\^/g,"");
  let i=0;
  const monoAt = () => { let d=""; while(i<s.length && /\d/.test(s[i])) d+=s[i++]; if(d && s[i]==="*" && /[a-z]/.test(s[i+1]||"")) i++; let m="";
    while(i<s.length && /[a-z]/.test(s[i])){ m+=s[i++]; while(i<s.length && /\d/.test(s[i]) && /[a-z]/.test(s[i-1])) m+=s[i++]; }
    if(d==="" && m==="") throw new Error("terme attendu en "+i+" dans "+src); return T(d===""?1:+d, m); };
  const signAt = () => { if(s[i]==="+"){ i++; return 1; } if(s[i]==="-"){ i++; return -1; } return 1; };
  const innerSum = () => { const L=[]; while(s[i]!==")"){ const g=signAt(); const t=monoAt(); L.push(g<0?neg(t):t); } i++; return L; };
  const chunks=[];
  while(i<s.length){
    const g=signAt();
    if(s[i]==="("){ i++; const in1=innerSum();
      if(s[i]==="*"){ i++; let k;
        if(s[i]==="("){ i++; const in2=innerSum(); if(in2.length>1){ chunks.push({type:"d", sg:g, a:in1, b:in2}); continue; } k=in2[0]; }
        else k=monoAt(); if(g<0) k=neg(k); chunks.push({type:"p", k, s:in1, right:true}); }
      else if(s[i]==="(" ){ i++; const in2=innerSum(); chunks.push({type:"d", sg:g, a:in1, b:in2}); }
      else if(s[i]==="2"){ i++; chunks.push({type:"d", sg:g, a:in1, b:in1, sq:true}); }
      else chunks.push({type:"q", sg:g, s:in1});
    } else { let t=monoAt(); if(g<0) t=neg(t);
      if(s[i]==="*" && s[i+1]==="("){ i+=2; chunks.push({type:"p", k:t, s:innerSum(), times:true}); }
      else if(s[i]==="("){ i++; const in1=innerSum();
        if(s[i]==="("){ i++; const in2=innerSum(); chunks.push({type:"d", sg:1, k:t, a:in1, b:in2}); }
        else chunks.push({type:"p", k:t, s:in1}); }
      else chunks.push({type:"t", t});
    }
  }
  return chunks;
}
/* écriture affichée de l'expression d'origine */
const show = src => String(src).replace(/\s+/g,"").replace(/-/g,"−").replace(/\*/g,"×").replace(/\^?2/g,(m,o,str)=>/[a-z)]/.test(str[o-1]||"")?"²":m)
  .replace(/([^(]|^)([+−])/g,(m,a,op)=> a===""||a==="(" ? m : `${a} ${op} `).replace(/^ /,"").replace(/×/g," × ")
  .replace(/([a-z])/g,"<i>$1</i>").replace(/(^|[^\d,])1(?=<i>)/g,"$1");
/* tous les termes obtenus après développement (non réduits) */
const flatTerms = ch => ch.flatMap(c => c.type==="t" ? [c.t] : c.type==="q" ? c.s.map(u=>c.sg<0?neg(u):u)
  : c.type==="p" ? c.s.map(u=>tmul(c.k,u)) : (()=>{ const k=c.k||T(c.sg); return c.a.flatMap(u=>c.b.map(v=>tmul(k,tmul(u,v)))); })());
/* étapes du développement (sans le nom de l'expression) */
function devSteps(src, o={}){
  const ch=parse(src), L=[show(src)];
  /* un carré (a + b)² s'écrit d'abord (a + b)(a + b) */
  if(ch.some(c=>c.sq)) L.push(ch.map((c,j)=>{ const t=c.type==="t"?((j&&c.t.c>=0)?" + ":j?" − ":(c.t.c<0?"−":""))+tAbs(c.t)
      : c.type==="q"?`${c.sg<0?(j?" − ":"−"):(j?" + ":"")}(${sum(c.s)})`
      : c.type==="p"?`${j?(c.k.c<0?" − ":" + "):(c.k.c<0?"−":"")}${tAbs(c.k)==="1"?"":tAbs(c.k)}(${sum(c.s)})`
      : `${c.sg<0?(j?" − ":"−"):(j?" + ":"")}${c.k?tAbs(c.k):""}(${sum(c.a)})(${sum(c.b)})`; return t; }).join(""));
  const hasP = ch.some(c=>c.type==="p"||c.type==="d"), hasQ = ch.some(c=>c.type==="q");
  if(hasP){
    const pieces = ch.map((c,j)=>{
      if(c.type==="t") return {first:tStr(c.t), next:(c.t.c<0?" − ":" + ")+tAbs(c.t)};
      if(c.type==="q"){ const u=c.s.map(v=>c.sg<0?neg(v):v); return {first:sum(u), next:u.map(t=>(t.c<0?" − ":" + ")+tAbs(t)).join("")}; }
      if(c.type==="p"){ const txt=c.s.map(u=>`${tPar(c.k)} × ${tPar(u)}`).join(" + "); return {first:txt, next:" + "+txt}; }
      const k=c.k||T(c.sg), pre=(k.c===1&&!k.m)?"":`${tPar(k)} × `;
      const txt=c.a.flatMap(u=>c.b.map(v=>`${pre}${tPar(u)} × ${tPar(v)}`)).join(" + "); return {first:txt, next:" + "+txt};
    });
    L.push(pieces.map((p,j)=>j?p.next:p.first).join(""));
  }
  const F=flatTerms(ch), fl=sum(F); if(fl!==L[L.length-1]) L.push(fl);
  const R=o.sort?sortD(reduce(F)):reduce(F), rs=sum(R); if(rs!==L[L.length-1]) L.push(rs);
  return {lines:L, red:R, flat:F, res:rs};
}
/* développement avec le nom : « A = … » sur chaque ligne */
const devLines = (name, src, o) => devSteps(src, o).lines.map(l=>`${name} = ${l}`);
const red = src => reduce(flatTerms(parse(src)));
/* ---- factorisation par le plus grand facteur commun ---- */
const gcd = (a,b) => b ? gcd(b, a%b) : Math.abs(a);
function factor(terms){
  const g = terms.reduce((s,t)=>gcd(s,Math.abs(t.c)),0);
  const ms = terms.map(t=>parseM(t.m)), com={};
  VARS.split("").forEach(v=>{ const e=Math.min(...ms.map(o=>o[v]||0)); if(e>0) com[v]=e; });
  const k = {c:g, m:keyM(com)};
  const q = terms.map(t=>{ const o=parseM(t.m); for(const v in com) o[v]-=com[v]; return {c:t.c/g, m:keyM(o)}; });
  return {k, q};
}
const kStr = k => (k.c===1 && k.m ? "" : String(k.c)) + mono(k.m);
function factSteps(src){
  const terms = red(src), {k,q} = factor(terms), K=kStr(k);
  const l2 = q.map((u,i)=>{ const a=`${K} × ${u.m||Math.abs(u.c)!==1?tAbs(u):"1"}`; return i===0 ? (u.c<0?"−":"")+a : (u.c<0?" − ":" + ")+a; }).join("");
  const res = `${K}(${sum(q)})`;
  return {lines:[show(src), l2, res], k, q, res};
}
const factLines = (name, src) => factSteps(src).lines.map(l=>`${name} = ${l}`);
/* vérification numérique : deux écritures égales pour plusieurs valeurs */
const same = (A, B) => [[-3,2],[1,5],[2,-1],[7,3],[-4,-6]].every(([x,y])=>Math.abs(ev(A,{x,y,a:x,b:y,n:x})-ev(B,{x,y,a:x,b:y,n:x}))<1e-9);
return {T, tmul, neg, reduce, sortD, mono, tAbs, tStr, tPar, sum, ev, parse, show, flatTerms, devSteps, devLines, red, factor, kStr, factSteps, factLines, same, gcd, deg};
})();

(function(){
const VF = ["Vrai","Faux"], ON = ["Oui","Non"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const AL = window.ALG3, {show, devLines} = AL;
const calc = lines => `<p class="calc">${lines.join("<br>")}</p>`;
const dv = (n, src) => calc(devLines(n, src, {sort:true}));
const n = "<i>n</i>", x = "<i>x</i>";
const tab = (head, rows) => `<div class="scroll"><table class="std"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;
/* tableau du tableur de l'exercice de brevet (lignes 3 à 12 : x = 0 à 9) */
const TAB = tab(["","A","B","C","D","E"], [["1","","Nombre impair","Nombre impair suivant","Produit de ces nombres impairs consécutifs","Résultat obtenu"],["2",x,`2${x} + 1`,`2${x} + 3`,`(2${x} + 1)(2${x} + 3)`,`(2${x} + 1)(2${x} + 3) + 1`],
  ...Array.from({length:10},(_,k)=>[String(k+3),String(k),String(2*k+1),String(2*k+3),String((2*k+1)*(2*k+3)),String((2*k+1)*(2*k+3)+1)])]);
window.ALG3.arith = {tab};

/* ===================== schémas ===================== */
const S_FORM = sch("Écrire avec une lettre", `<p class="schN">${n} est un nombre entier.</p><p class="calc">pair : 2${n} · impair : 2${n} + 1<br>multiple de 3 : 3${n} · multiple de 4 : 4${n}<br>trois nombres consécutifs : ${n}, ${n} + 1, ${n} + 2</p>`);
const S_PRE = sch("Prouver avec le calcul littéral", `<p class="calc">S = ${n} + (${n} + 1) + (${n} + 2)<br>S = 3${n} + 3<br>S = 3(${n} + 1)</p><p class="schN">On écrit le résultat sous la forme 3 × (un entier) : c'est un multiple de 3.</p>`);
const S_CE = sch("Un exemple ne suffit pas", `<p class="schN">Des exemples permettent d'émettre une conjecture, mais ne prouvent pas qu'elle est toujours vraie.</p><p class="schN">Pour prouver : calcul littéral avec ${n}. Pour réfuter : un seul contre-exemple suffit.</p>`);

CH["3e-21"] = {
intro:"Écrire un nombre pair, un nombre impair, un multiple ou des nombres consécutifs avec une lettre, puis utiliser le calcul littéral pour prouver une propriété sur les nombres entiers.",
savoir:[
  "écrire avec une lettre trois nombres consécutifs, un nombre pair, un nombre impair, un multiple de 3 ou de 4 ;",
  "utiliser le calcul littéral (réduire, factoriser) pour prouver une propriété sur les nombres entiers ;",
  "réfuter une affirmation avec un contre-exemple."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"À savoir", h:`
  <div class="retenir" data-l="À retenir"><p>Dans ce chapitre, ${n} désigne un nombre <b>entier</b> (positif ou négatif).</p>
   <p>Trois nombres consécutifs peuvent s'écrire : ${n}, ${n} + 1 et ${n} + 2.</p>
   <p>Un nombre <b>pair</b> est de la forme 2${n} (2 × ${n}).</p>
   <p>Un nombre <b>impair</b> est de la forme 2${n} + 1 (2 × ${n} + 1).</p>
   <p>Un <b>multiple de 3</b> est de la forme 3${n} (3 × ${n}).</p>
   <p>Un <b>multiple de 4</b> est de la forme 4${n} (4 × ${n}).</p>
   <p>Plus généralement, un multiple d'un nombre entier <i>k</i> est de la forme <i>k</i> × ${n}.</p></div>`},
{k:"II", t:"Exemples d'exercices", h:`
  <p><b>Exercice 1 :</b> « La somme de trois nombres entiers positifs consécutifs est un multiple de 3. » Prouve que cette affirmation est vraie.</p>
  <p>Trois nombres consécutifs peuvent s'écrire : ${n}, ${n} + 1 et ${n} + 2.</p>
  ${calc([`S = ${n} + (${n} + 1) + (${n} + 2)`,`S = 3${n} + 3`,`S = 3(${n} + 1)`])}
  <p>La somme est de la forme 3 × (${n} + 1), donc la somme de 3 nombres consécutifs est un multiple de 3.</p>
  <p><b>Remarque :</b> la somme est même égale au triple du 2<sup>e</sup> nombre.</p>
  <p><b>Exercice 2 :</b> prouve que la somme de deux nombres pairs est un nombre pair.</p>
  <p>Prenons deux nombres pairs P et P'. Soit ${n} et ${n}' deux nombres entiers tels que P = 2${n} et P' = 2${n}'.</p>
  ${calc(["S = P + P'",`S = 2${n} + 2${n}'`,`S = 2(${n} + ${n}')`])}
  <p>La somme est de la forme 2 × (${n} + ${n}'), donc la somme de deux nombres pairs est un nombre pair.</p>
  <div class="retenir" data-l="Méthode"><p>Pour prouver qu'un résultat est un multiple de 3 (ou de 2, de 4…), on l'écrit avec une lettre, on réduit, puis on <b>factorise</b> pour obtenir la forme 3 × (un nombre entier).</p></div>
  <p><b>Exercice 3 :</b> c'est l'exercice 3 de la fiche (brevet, septembre 2014). Sa correction complète est donnée dans la partie Exercices.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Preuve et arithmétique", e:[
  {n:"Activité", t:"Trois nombres consécutifs", w:"Sur ton cahier", h:`<p>« La somme de trois nombres entiers positifs consécutifs est toujours un multiple de 3. »</p><p>Prouve que cette affirmation est vraie.</p>`,
   c:`<p>Au brouillon : 4 + 5 + 6 = 15 = 3 × 5 ; 10 + 11 + 12 = 33 = 3 × 11.</p><p>Pour le prouver pour tous les nombres, on écrit trois nombres consécutifs : ${n}, ${n} + 1 et ${n} + 2.</p>
   ${calc([`S = ${n} + (${n} + 1) + (${n} + 2)`,`S = 3${n} + 3`,`S = 3(${n} + 1)`])}<p>La somme est de la forme 3 × (${n} + 1) : c'est toujours un <b>multiple de 3</b>.</p>`},
  {n:"Ex 1", t:"Somme de deux nombres pairs", w:"Sur ton cahier", h:`<p>Prouve que la somme de deux nombres pairs est un nombre pair.</p>`,
   c:`<p>Soit P = 2${n} et P' = 2${n}' deux nombres pairs (${n} et ${n}' sont des nombres entiers).</p>${calc(["S = P + P'",`S = 2${n} + 2${n}'`,`S = 2(${n} + ${n}')`])}<p>La somme est de la forme 2 × (${n} + ${n}') : c'est un <b>nombre pair</b>.</p>`},
  {n:"Ex 2", t:"L'affirmation de Zoé", w:"Sur ton cahier", h:`<p>Zoé affirme : « La somme de cinq nombres entiers positifs consécutifs est égale au quintuple du troisième. »</p><p>Qu'en penses-tu ? Explique.</p>`,
   c:`<p>Exemple : 3 + 4 + 5 + 6 + 7 = 25 et 5 × 5 = 25.</p><p>On écrit cinq nombres consécutifs : ${n}, ${n} + 1, ${n} + 2, ${n} + 3 et ${n} + 4. Le troisième est ${n} + 2.</p>
   ${calc([`S = ${n} + (${n} + 1) + (${n} + 2) + (${n} + 3) + (${n} + 4)`,`S = 5${n} + 10`,`S = 5(${n} + 2)`])}<p>La somme est égale à 5 × (${n} + 2), le quintuple du troisième nombre : <b>Zoé a raison</b>.</p>`},
  {n:"Ex 3", t:"Brevet (septembre 2014, France)", w:"Sur ton cahier", h:`<p>Léa pense qu'en multipliant deux nombres impairs consécutifs (c'est-à-dire qui se suivent) et en ajoutant 1, le résultat obtenu est toujours un multiple de 4.</p>
   <p><b>1. Étude d'un exemple :</b> 5 et 7 sont deux nombres impairs consécutifs.</p><p><b>a.</b> Calcule 5 × 7 + 1.</p><p><b>b.</b> Léa a-t-elle raison pour cet exemple ?</p>
   <p><b>2.</b> Le tableau ci-dessous montre le travail qu'elle a réalisé dans une feuille de calcul.</p>${TAB}
   <p><b>a.</b> D'après ce tableau, quel résultat obtient-on en prenant comme premier nombre impair 17 ?</p><p><b>b.</b> Montre que cet entier est un multiple de 4.</p>
   <p><b>c.</b> Parmi les quatre formules de calcul suivantes, deux formules ont pu être saisies dans la cellule D3. Lesquelles ? Aucune justification n'est attendue.</p>
   <div class="calcs"><span>Formule 1 : =(2*A3+1)*(2*A3+3)</span><span>Formule 2 : =(2*B3+1)*(2*C3+3)</span><span>Formule 3 : =B3*C3</span><span>Formule 4 : =(2*D3+1)*(2*D3+3)</span></div>
   <p><b>3. Étude algébrique :</b></p><p><b>a.</b> Développe et réduis l'expression (2${x} + 1)(2${x} + 3) + 1.</p><p><b>b.</b> Montre que Léa avait raison : le résultat obtenu est toujours un multiple de 4.</p>`,
   c:`<p><b>1. a.</b> 5 × 7 + 1 = 35 + 1 = 36 = 4 × 9.</p><p><b>b.</b> Oui : 36 est un multiple de 4.</p>
   <p><b>2. a.</b> 17 est dans la colonne B pour ${x} = 8 : on obtient 17 × 19 + 1 = <b>324</b>.</p><p><b>b.</b> 324 = 320 + 4 = 4 × 80 + 4 × 1 = 4 × (80 + 1) = 4 × 81.</p>
   <p><b>c.</b> Les formules <b>1 et 3</b> donnent le bon produit : la formule 1 calcule (2${x} + 1)(2${x} + 3) avec ${x} en A3, et la formule 3 multiplie B3 par C3. (La formule 2 calculerait (2 × 1 + 1) × (2 × 3 + 3) = 27 au lieu de 3.)</p>
   <p><b>3. a.</b></p>${dv("A","(2x+1)(2x+3)+1")}<p><b>b.</b> 4${x}² + 8${x} + 4 = 4 × ${x}² + 4 × 2${x} + 4 × 1 = 4(${x}² + 2${x} + 1).</p><p>Si ${x} est un entier, ${x}² + 2${x} + 1 est un entier : le résultat est toujours un <b>multiple de 4</b>. Léa avait raison.</p><p>On a même (2${x} + 1)(2${x} + 3) + 1 = 4(${x} + 1)².</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Écrire avec une lettre", schema:S_FORM, q:{
 1:[ {q:`${n} est un nombre entier. Quelle expression désigne toujours un nombre pair ?`, c:[`2${n}`,`${n} + 2`,`2${n} + 1`,`${n}²`], rep:`2${n}`, ex:`2${n} = 2 × ${n} est un multiple de 2.`, sx:S_FORM},
     {q:`${n} est un nombre entier. Quelle expression désigne toujours un nombre impair ?`, c:[`2${n} + 1`,`2${n}`,`${n} + 1`,`3${n}`], rep:`2${n} + 1`, ex:`Un nombre impair suit un nombre pair : 2${n} + 1.`, sx:S_FORM} ],
 2:[ {g:()=>{ const k=pick([3,4,5,6,7,9,10]); return {q:`${n} est un nombre entier. Quelle expression désigne toujours un multiple de ${k} ?`, c:shuf([`${k}${n}`,`${n} + ${k}`,`${k}${n} + 1`,`${n}${"²"}`]), rep:`${k}${n}`, ex:`${k}${n} = ${k} × ${n}.`, sx:S_FORM}; }},
     {q:`Quel est le nombre entier qui suit 2${n} + 1 ?`, c:[`2${n} + 2`,`2${n} + 3`,`3${n} + 1`,`2${n}`], rep:`2${n} + 2`, ex:`On ajoute 1 : 2${n} + 1 + 1 = 2${n} + 2.`, sx:S_FORM} ],
 3:[ {q:`Quel est le nombre impair qui suit 2${n} + 1 ?`, c:[`2${n} + 3`,`2${n} + 2`,`2${n} + 1 + 1`,`3${n} + 1`], rep:`2${n} + 3`, ex:`Les nombres impairs vont de 2 en 2 : 2${n} + 1 + 2 = 2${n} + 3.`, sx:S_FORM},
     {q:`Le nombre 6${n} + 4 est-il toujours pair (${n} entier) ?`, c:ON, rep:"Oui", ex:`6${n} + 4 = 2(3${n} + 2) : c'est 2 × un entier.`, sx:S_FORM} ]
}},
{nom:"Prouver avec le calcul littéral", schema:S_PRE, q:{
 1:[ {q:`On a obtenu S = 3${n} + 3. Quelle forme montre que S est un multiple de 3 ?`, c:[`3(${n} + 1)`,`3${n} + 3`,`3(${n} + 3)`,`${n}(3 + 3)`], rep:`3(${n} + 1)`, ex:`On factorise : 3${n} + 3 = 3 × ${n} + 3 × 1 = 3(${n} + 1).`, sx:S_PRE} ],
 2:[ {g:()=>{ const k=pick([3,5,7]); const m=(k-1)/2; const lst=k===3?`${n}, ${n} + 1 et ${n} + 2`:`${n}, ${n} + 1, …, ${n} + ${k-1}`, som=k===3?"0 + 1 + 2":`0 + 1 + … + ${k-1}`; return {q:`La somme de ${k} nombres entiers consécutifs ${lst} est égale à :`, c:shuf(uniq(`${k}${n} + ${k*m}`,[`${k}${n} + ${k-1}`,`${k}${n}`,`${k}${n} + ${k}`,`${k}${n} + ${k*m+1}`])), rep:`${k}${n} + ${k*m}`, ex:`On ajoute les ${k} « ${n} » et ${som} = ${k*m}. Et ${k}${n} + ${k*m} = ${k}(${n} + ${m}) : un multiple de ${k}.`, sx:S_PRE}; }} ],
 3:[ {g:()=>{ const c=pick([[`(2${n} + 1) + (2${n} + 3)`,`4${n} + 4 = 4(${n} + 1)`,"un multiple de 4"],[`2${n} + 2${n}'`,`2(${n} + ${n}')`,"un nombre pair"],[`(2${n} + 1) + (2${n}' + 1)`,`2${n} + 2${n}' + 2 = 2(${n} + ${n}' + 1)`,"un nombre pair"]]);
       return {q:`On calcule ${c[0]}. Que peut-on conclure ?`, c:shuf(uniq(c[2],["un nombre impair","un multiple de 4","un nombre pair","un multiple de 3"]).slice(0,4)), rep:c[2], ex:`${c[0]} = ${c[1]}.`, sx:S_PRE}; }} ]
}},
{nom:"Exemples et contre-exemples", schema:S_CE, q:{
 1:[ {q:"Trois exemples vérifient une affirmation. Est-elle prouvée pour tous les nombres ?", c:ON, rep:"Non", ex:"Des exemples ne suffisent pas : il faut une preuve avec une lettre.", sx:S_CE} ],
 2:[ {q:"« La somme de quatre nombres entiers consécutifs est un multiple de 4. » Cette affirmation est :", c:["fausse","vraie"], rep:"fausse", ex:"Contre-exemple : 1 + 2 + 3 + 4 = 10, qui n'est pas un multiple de 4.", sx:S_CE},
     {g:()=>{ const a=ri(2,30); return {q:`Le produit de deux entiers consécutifs semble toujours pair. Vérifie sur un exemple : calcule ${a} × ${a+1}.`, rep:String(a*(a+1)), ex:`${a} × ${a+1} = ${a*(a+1)}, qui est bien pair. Mais un exemple ne prouve pas que c'est toujours vrai.`, sx:S_CE}; }} ],
 3:[ {g:()=>{ const a=ri(2,40), F=v=>String(v).replace(/\B(?=(\d{3})+(?!\d))/g," "); return {q:`Calcule (${a} + 1)² − ${a}². Le résultat est-il égal à ${a} + (${a} + 1) ?`, c:ON, rep:"Oui", ex:`(${a+1})² − ${a}² = ${F((a+1)**2)} − ${F(a*a)} = ${2*a+1} et ${a} + ${a+1} = ${2*a+1}. En effet, (${n} + 1)² − ${n}² = 2${n} + 1.`, sx:S_CE}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 21", duree:45, info:"Durée : 45 min · Calculatrice non autorisée · Stylo",
comp:[
  ["MODÉLISER","J'écris avec une lettre des nombres consécutifs, pairs, impairs ou multiples.","Ex. 1 (4 points)"],
  ["RAISONNER","Je prouve une propriété avec le calcul littéral.","Ex. 2 a) et 3 (8 points)"],
  ["RAISONNER","Je réfute une affirmation avec un contre-exemple.","Ex. 2 b) (2 points)"],
  ["CALCULER","Je développe, je réduis et je factorise pour conclure.","Ex. 4 (6 points)"]
],
exos:[
{t:"Écrire avec une lettre", p:4, h:`<p>${n} désigne un nombre entier. Écris :</p><p>a) trois nombres entiers consécutifs ;</p><p>b) un nombre impair ;</p><p>c) un multiple de 5 ;</p><p>d) deux nombres pairs consécutifs.</p>`,
 c:`<p>a) ${n}, ${n} + 1 et ${n} + 2 · b) 2${n} + 1 · c) 5${n} · d) 2${n} et 2${n} + 2</p><p><i>(1 point par réponse)</i></p>`},
{t:"Quatre nombres consécutifs", p:5, h:`<p>a) Prouve que la somme de quatre nombres entiers consécutifs est toujours un nombre pair.</p><p>b) Cette somme est-elle toujours un multiple de 4 ? Justifie.</p>`,
 c:`<p>a)</p>${calc([`S = ${n} + (${n} + 1) + (${n} + 2) + (${n} + 3)`,`S = 4${n} + 6`,`S = 2(2${n} + 3)`])}<p>S est de la forme 2 × (un entier) : c'est un nombre pair. <i>(3 points)</i></p><p>b) Non : 1 + 2 + 3 + 4 = 10 n'est pas un multiple de 4. C'est un contre-exemple. <i>(2 points)</i></p>`},
{t:"Deux nombres impairs consécutifs", p:5, h:`<p>a) Calcule 7 + 9, puis 13 + 15.</p><p>b) Prouve que la somme de deux nombres impairs consécutifs est toujours un multiple de 4.</p>`,
 c:`<p>a) 7 + 9 = 16 = 4 × 4 et 13 + 15 = 28 = 4 × 7. <i>(1 point)</i></p><p>b) Deux nombres impairs consécutifs s'écrivent 2${n} + 1 et 2${n} + 3.</p>${calc([`S = (2${n} + 1) + (2${n} + 3)`,`S = 4${n} + 4`,`S = 4(${n} + 1)`])}<p>S est de la forme 4 × (un entier) : c'est un multiple de 4. <i>(4 points)</i></p>`},
{t:"Les carrés de Tom", p:6, h:`<p>Tom affirme : « Je choisis un nombre entier. Je calcule son carré, puis le carré de l'entier suivant. La différence entre ces deux carrés est toujours un nombre impair. »</p><p>a) Teste avec 4.</p><p>b) Teste avec 10.</p><p>c) Prouve l'affirmation de Tom.</p><p>d) Montre que cette différence est aussi égale à la somme des deux entiers.</p>`,
 c:`<p>a) 5² − 4² = 25 − 16 = 9. <i>(1 point)</i></p><p>b) 11² − 10² = 121 − 100 = 21. <i>(1 point)</i></p><p>c) Avec un entier ${n} :</p>${dv("D","(n+1)2-n2")}<p>2${n} + 1 est de la forme 2 × (un entier) + 1 : c'est un nombre impair. <i>(3 points)</i></p><p>d) ${n} + (${n} + 1) = 2${n} + 1 : c'est bien la même expression. <i>(1 point)</i></p>`}
]}
};
})();
