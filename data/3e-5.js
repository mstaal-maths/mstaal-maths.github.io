/* 3e — Chapitre 5 : Calcul littéral 2 — double distributivité et démonstrations
   Cours, fiche d'exercices et correction (exercices 2 et 3) de M. Staal.
   Les développements sont calculés par le moteur ALG3 (le même que dans data/3e-3.js) et vérifiés numériquement. */
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
const AL = window.ALG3, {T, show, red, sum, sortD, devLines, devSteps, tStr} = AL;
const SO = {sort:true};
const calc = lines => `<p class="calc">${lines.join("<br>")}</p>`;
const dv = (n, src) => calc(devLines(n, src, SO));
const E = (n, src) => `${n} = ${show(src)}`;
const R = src => sum(sortD(red(src)));                 /* forme développée et réduite (ordre décroissant des puissances) */
const grid = items => items.some(x=>/^<p/.test(x)) ? `<div>${items.join("")}</div>` : `<div class="calcs">${items.map(x=>`<span>${x}</span>`).join("")}</div>`;
const prog = (titre, steps) => `<div class="pgc">${titre?`<b>${titre}</b>`:""}<ul>${steps.map(s=>`<li>${s}</li>`).join("")}</ul></div>`;
const S = L => sum(L.filter(t=>t.c!==0));
const nz = (a,b) => { let v; do{ v=ri(a,b); }while(v===0); return v; };
const sg = v => v<0 ? `-${-v}` : `+${v}`;
const co = (a,m="x") => (a===1?"":a===-1?"-":String(a))+m;
window.ALG3.dbl = {R, dv, E, grid, prog, calc};

/* ===================== schémas ===================== */
const S_DD = sch("La double distributivité", `<p class="calc">(<i>a</i> + <i>b</i>)(<i>c</i> + <i>d</i>) = <i>a</i> × <i>c</i> + <i>a</i> × <i>d</i> + <i>b</i> × <i>c</i> + <i>b</i> × <i>d</i></p><p class="calc">(<i>x</i> + 2)(<i>x</i> + 5) = <i>x</i>² + 5<i>x</i> + 2<i>x</i> + 10 = <i>x</i>² + 7<i>x</i> + 10</p><p class="schN">Chaque terme de la première parenthèse multiplie chaque terme de la seconde : 4 produits.</p>`);
const S_CAR = sch("Développer un carré", `<p class="calc">(4<i>x</i> − 3)² = (4<i>x</i> − 3)(4<i>x</i> − 3)<br>= 16<i>x</i>² − 12<i>x</i> − 12<i>x</i> + 9<br>= 16<i>x</i>² − 24<i>x</i> + 9</p><p class="schN">Un carré, c'est un produit de deux facteurs égaux : on utilise la double distributivité.</p>`);
const S_EG = sch("Prouver une égalité", `<p class="schN">On développe et on réduit <b>chaque membre</b> séparément.</p><p class="schN">Mêmes formes réduites : l'égalité est toujours vraie.</p><p class="schN">Formes différentes : on cherche un contre-exemple pour prouver qu'elle est fausse.</p>`);
const S_PR = sch("Programme de calcul", `<p class="calc">Choisir <i>x</i> → ajouter 1 → élever au carré → soustraire 8<br>(<i>x</i> + 1)² − 8 = <i>x</i>² + 2<i>x</i> − 7</p><p class="schN">On écrit l'expression avec <i>x</i> (attention aux parenthèses), puis on développe et on réduit.</p>`);

/* ===================== outils du QCM ===================== */
const bin = (a,b) => `(${co(a)}${sg(b)})`;

CH["3e-5"] = {
intro:"Développer et réduire un produit de deux sommes avec la double distributivité, développer un carré, et utiliser le calcul littéral pour prouver ou infirmer une égalité.",
savoir:[
  "développer et réduire une expression avec la double distributivité ;",
  "développer et réduire le carré d'une somme ou d'une différence ;",
  "développer et réduire une expression qui mélange simple et double distributivité ;",
  "prouver ou infirmer une égalité en développant chaque membre ;",
  "traduire un programme de calcul par une expression et la développer."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Développer à l'aide de la double distributivité", h:`
  <div class="retenir" data-l="Définition"><p><b>Développer</b> une expression littérale, c'est transformer un <b>produit</b> en une <b>somme</b> ou une <b>différence</b>.</p><p>On peut développer une expression littérale en utilisant la <b>simple distributivité</b> ou encore la <b>double distributivité</b>.</p></div>
  <div class="retenir" data-l="Propriété"><p><b>La double distributivité :</b> quels que soient les nombres <i>a</i>, <i>b</i>, <i>c</i> et <i>d</i>, on a :</p><p class="calc">(<i>a</i> + <i>b</i>) × (<i>c</i> + <i>d</i>) = <i>a</i> × <i>c</i> + <i>a</i> × <i>d</i> + <i>b</i> × <i>c</i> + <i>b</i> × <i>d</i></p></div>
  <p><b>Exemples :</b> développe et réduis les expressions suivantes.</p>
  ${grid([dv("A","(6x+3)(2+3x)"),dv("B","(-6-4x)*(3x+5)")])}
  ${dv("C","(4x-3)2")}
  <div class="attention"><b>ATTENTION :</b> (4<i>x</i> − 3)² n'est pas égal à 16<i>x</i>² + 9. Un carré est le produit d'un nombre par lui-même : (4<i>x</i> − 3)² = (4<i>x</i> − 3)(4<i>x</i> − 3), puis on utilise la double distributivité.</div>`},
{k:"II", t:"Utiliser le calcul littéral pour démontrer", h:`
  <h4>Problème 1 : prouver ou infirmer une égalité</h4>
  <p>Indique, en justifiant, si l'affirmation suivante est vraie ou fausse.</p>
  <p><b>Affirmation :</b> l'égalité (2<i>x</i> − 3)(−4<i>x</i> + 5) = 2<i>x</i>(11 − 3<i>x</i>) − (2<i>x</i>² + 15) est toujours vraie.</p>
  <div class="retenir" data-l="Méthode"><p>Pour prouver qu'une égalité est toujours vraie, on développe et on réduit <b>chaque membre séparément</b>, puis on compare les deux résultats.</p></div>
  <p><b>Résolution.</b> D'un côté, on a :</p>${dv("A","(2x-3)(-4x+5)")}
  <p>De l'autre, on a :</p>${dv("B","2x(11-3x)-(2x2+15)")}
  <p>On remarque que A = B car les deux expressions développées et réduites sont égales à −8<i>x</i>² + 22<i>x</i> − 15.</p><p>Donc l'égalité (2<i>x</i> − 3)(−4<i>x</i> + 5) = 2<i>x</i>(11 − 3<i>x</i>) − (2<i>x</i>² + 15) est <b>toujours vraie</b>.</p>
  <h4>Problème 2 : programme de calcul et programme Scratch</h4>
  <p>On considère le programme Scratch suivant :</p>${img("3k5co/scratch.png","Programme Scratch : demander Choisis un nombre ; mettre a à réponse plus 1 ; mettre b à a fois a ; mettre c à b moins 8 ; dire c.",300)}
  <p><b>1.</b> Montre que si on choisit 4 comme nombre de départ, le programme donne 17.</p><p><b>2.</b> Calcule le résultat du programme si le nombre choisi est −7.</p><p><b>3. a)</b> Donne le résultat du programme si le nombre choisi est <i>x</i>.</p><p><b>b)</b> Développe et réduis l'expression trouvée à la question précédente. L'expression développée et réduite est <i>x</i>² + 2<i>x</i> − 7.</p>
  <p><b>Résolution :</b></p>
  <div class="calcs"><p class="calc"><b>1.</b> A = (4 + 1)² − 8<br>A = 5² − 8<br>A = 25 − 8<br>A = 17</p><p class="calc"><b>2.</b> B = (−7 + 1)² − 8<br>B = (−6)² − 8<br>B = 36 − 8<br>B = 28</p></div>
  <p>Si on choisit 4 comme nombre de départ, le programme donne bien 17. Si on choisit −7, le programme donne 28.</p>
  <p><b>3. a)</b> Si on choisit <i>x</i> comme nombre de départ, le programme donne C = (<i>x</i> + 1)² − 8.</p><p><b>b)</b></p>${dv("C","(x+1)2-8")}<p>L'expression développée et réduite est bien <i>x</i>² + 2<i>x</i> − 7.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Développer avec la double distributivité", e:[
  {n:"Activité 1", t:"Programmes égaux ?", w:"Sur ton cahier", h:`<div class="progs">${prog("Programme 1",["Choisir un nombre.","Ajouter 8.","Multiplier par le nombre de départ.","Ajouter 12."])}<div class="pgc"><b>Programme 2</b>${img("3k5ex/prog2.png","Programme 2 : choisir un nombre ; d'un côté ajouter 6, de l'autre ajouter 2 ; multiplier les deux nombres obtenus.",260)}</div></div>
   <p>Si on choisit un même nombre de départ pour les programmes 1 et 2, prouve que ces deux programmes donneront toujours le même résultat.</p>`,
   c:`<p>Je choisis un nombre quelconque <i>x</i>.</p><div class="calcs">${dv("P<sub>1</sub>","(x+8)*x+12")}${dv("P<sub>2</sub>","(x+6)(x+2)")}</div>
   <p>Les deux expressions développées et réduites sont égales à <i>x</i>² + 8<i>x</i> + 12 : les deux programmes donnent <b>toujours le même résultat</b>.</p>`},
  {n:"Exercice 1", t:"Développer à l'aide de la double distributivité", w:"Sur ton cahier", h:`<p>Développe et réduis chaque expression ci-dessous.</p>${grid([["A","(2x+3)*(6x+5)"],["B","(3y+5)*(4+2x)"],["C","(4x-7)(2x+5)"],["D","(-6x+2)(5-x)"],["E","(-7x-3)(-2+5y)"],["G","(3x+2)2"],["I","(x-9)2"]].map(([n,s])=>E(n,s)))}`,
   c:grid([["A","(2x+3)*(6x+5)"],["B","(3y+5)*(4+2x)"],["C","(4x-7)(2x+5)"],["D","(-6x+2)(5-x)"],["E","(-7x-3)(-2+5y)"],["G","(3x+2)2"],["I","(x-9)2"]].map(([n,s])=>dv(n,s)))},
  {n:"Exercice 2", t:"Trouve l'intrus", w:"Sur ton cahier", h:`<p><b>a)</b> Développe et réduis chaque expression.</p><p><b>b)</b> Regroupe les expressions littérales qui sont égales. Quelle expression se retrouve seule ?</p>
   ${grid([["A","8+8(2x-1)"],["B","(-2x-8)(5-x)"],["C","-40-2x(1-x)"],["D","(2x+3)(3x-1)+6x(1-x)"],["E","3x2-(8x+2x2)"],["F","10x-9+3(x+2)"],["G","(5*x-3)*4"],["H","3x2+(8x-2x2)"],["I","(8x-7)+(-5+12x)"],["J","(2x+2)(9-x)-(18-2x2)"],["K","(x-8)2+8(3x-8)"]].map(([n,s])=>E(n,s)))}`,
   c:`<p><b>a)</b></p>${grid([["A","8+8(2x-1)"],["B","(-2x-8)(5-x)"],["C","-40-2x(1-x)"],["D","(2x+3)(3x-1)+6x(1-x)"],["E","3x2-(8x+2x2)"],["F","10x-9+3(x+2)"],["G","(5*x-3)*4"],["H","3x2+(8x-2x2)"],["I","(8x-7)+(-5+12x)"],["J","(2x+2)(9-x)-(18-2x2)"],["K","(x-8)2+8(3x-8)"]].map(([n,s])=>dv(n,s)))}
   <p><b>b)</b> A = J = 16<i>x</i> · B = C = 2<i>x</i>² − 2<i>x</i> − 40 · D = F = 13<i>x</i> − 3 · G = I = 20<i>x</i> − 12 · H = K = <i>x</i>² + 8<i>x</i></p><p>L'intrus est <b>E</b> = <i>x</i>² − 8<i>x</i>.</p>`}
 ]},
{t:"Démontrer avec le calcul littéral", e:[
  {n:"Exercice 3", t:"Affirmation vraie ou fausse ?", w:"Sur ton cahier", h:`<p>Indique, en justifiant, si chacune des affirmations suivantes est vraie ou fausse.</p><p><b>Affirmation 1 :</b> l'égalité (2<i>x</i> − 3)(−4<i>x</i> + 5) = 2<i>x</i>(11 − 3<i>x</i>) − (2<i>x</i>² + 15) est toujours vraie.</p><p><b>Affirmation 2 :</b> l'égalité (3<i>x</i> − 5)² = 25 + 10<i>x</i> + 9<i>x</i>(<i>x</i> − 3) est toujours vraie.</p>`,
   c:`<p><b>Affirmation 1 :</b> c'est le problème 1 du cours.</p><div class="calcs">${dv("A","(2x-3)(-4x+5)")}${dv("B","2x(11-3x)-(2x2+15)")}</div><p>A = B : l'affirmation 1 est <b>vraie</b>.</p>
   <p><b>Affirmation 2 :</b></p><div class="calcs">${dv("C","(3x-5)2")}${dv("D","25+10x+9x(x-3)")}</div><p>Les deux formes réduites sont différentes. Contre-exemple avec <i>x</i> = 1 :</p><div class="calcs"><p class="calc">C = (3 × 1 − 5)²<br>C = (−2)²<br>C = 4</p><p class="calc">D = 25 + 10 × 1 + 9 × 1 × (1 − 3)<br>D = 25 + 10 + 9 × (−2)<br>D = 35 − 18<br>D = 17</p></div><p>4 ≠ 17 : l'affirmation 2 est <b>fausse</b>.</p>`},
  {n:"Exercice 4", t:"Programmes égaux ?", w:"Sur ton cahier", h:`<div class="progs">${prog("Programme 1",["Choisir un nombre.","Élever au carré.","Ajouter le triple du nombre de départ."])}${prog("Programme 2",["Choisir un nombre.","Ajouter 3.","Multiplier par le nombre de départ."])}</div>
   <p><b>1. a)</b> Montre que si on choisit 4 comme nombre de départ, les programmes donnent 28.</p><p><b>b)</b> Calcule le résultat des deux programmes si on choisit −5 comme nombre de départ.</p><p><b>c)</b> Que constate-t-on ? Émets une conjecture.</p><p><b>2.</b> Démontre la conjecture émise à la question précédente.</p>`,
   c:`<p><b>1. a)</b> Avec 4 :</p><div class="calcs"><p class="calc">A = 4² + 3 × 4<br>A = 16 + 12<br>A = 28</p><p class="calc">B = (4 + 3) × 4<br>B = 7 × 4<br>B = 28</p></div><p><b>b)</b> Avec −5 :</p><div class="calcs"><p class="calc">C = (−5)² + 3 × (−5)<br>C = 25 − 15<br>C = 10</p><p class="calc">D = (−5 + 3) × (−5)<br>D = (−2) × (−5)<br>D = 10</p></div><p><b>c)</b> Il semble que les deux programmes donnent toujours le même résultat.</p>
   <p><b>2.</b> Avec un nombre <i>x</i> :</p><div class="calcs">${calc(["P<sub>1</sub> = <i>x</i>² + 3<i>x</i>"])}${dv("P<sub>2</sub>","(x+3)*x")}</div><p>Les deux programmes donnent <i>x</i>² + 3<i>x</i> : la conjecture est <b>vraie</b>.</p>`},
  {n:"Exercice 5", t:"Programmes égaux", w:"Sur ton cahier", h:`<div class="progs">${prog("Programme A",["Choisir un nombre.","Soustraire 1.","Élever au carré.","Soustraire 1."])}${prog("Programme B",["Choisir un nombre.","Soustraire 2.","Multiplier par le nombre choisi."])}</div>
   <p>Prouve que ces deux programmes donneront toujours le même résultat, si on choisit un même nombre au départ.</p>`,
   c:`<p>Avec un nombre <i>x</i> :</p><div class="calcs">${dv("A","(x-1)2-1")}${dv("B","(x-2)*x")}</div><p>Les deux programmes donnent <i>x</i>² − 2<i>x</i> : ils donnent <b>toujours le même résultat</b>.</p>`},
  {n:"Exercice 6", t:"Comprendre un programme Scratch", w:"Sur ton cahier", h:`<p>On considère le programme Scratch suivant :</p>${img("3k5ex/scratch.png","Programme Scratch : demander Choisis un nombre ; mettre a à réponse plus 1 ; mettre b à a fois a ; mettre c à b moins 8 ; dire c.",300)}
   <p><b>1.</b> Montre que si on choisit 4 comme nombre de départ, le programme donne 17.</p><p><b>2.</b> Calcule le résultat du programme si le nombre choisi est −7.</p><p><b>3. a)</b> On choisit le nombre <i>x</i> et on applique ce programme. Écris l'expression, en fonction de <i>x</i>, qui donne le résultat du programme.</p><p><b>b)</b> Développe et réduis cette expression. L'expression développée et réduite est <i>x</i>² + 2<i>x</i> − 7.</p>`,
   c:`<div class="calcs"><p class="calc"><b>1.</b><br>A = (4 + 1)² − 8<br>A = 5² − 8<br>A = 25 − 8<br>A = 17</p><p class="calc"><b>2.</b><br>B = (−7 + 1)² − 8<br>B = (−6)² − 8<br>B = 36 − 8<br>B = <b>28</b></p></div><p><b>3. a)</b> (<i>x</i> + 1)² − 8</p><p><b>b)</b></p>${dv("C","(x+1)2-8")}`},
  {n:"Exercice 7", t:"Comparaison d'aires", w:"Sur ton cahier", h:`<p><i>x</i> est un nombre supérieur à 9.</p>${img("3k5ex/aires.png","À gauche, le grand carré ACDE de côté x − 5, auquel on a enlevé le petit carré ABGF de côté 4 : il reste l'hexagone BCDEFG. À droite, le rectangle MNOP de longueur x − 1 et de largeur x − 9.",420)}
   <p>Montre que l'hexagone BCDEFG et le rectangle MNOP ont la même aire, quelle que soit la valeur de <i>x</i>.</p>`,
   c:`<p>L'hexagone BCDEFG est le carré ACDE de côté <i>x</i> − 5, auquel on enlève le carré ABGF de côté 4.</p>${dv("A<sub>hexagone</sub>","(x-5)2-16")}
   <p>Le rectangle MNOP a pour longueur <i>x</i> − 1 et pour largeur <i>x</i> − 9.</p>${dv("A<sub>rectangle</sub>","(x-1)(x-9)")}<p>Les deux aires sont égales à <i>x</i>² − 10<i>x</i> + 9 : l'hexagone et le rectangle ont <b>toujours la même aire</b>.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"La double distributivité", schema:S_DD, q:{
 1:[ {g:()=>{ const a=ri(1,9), b=ri(1,9), src=`(x+${a})(x+${b})`, good=R(src); return {q:`Développe et réduis : ${show(src)}`, c:shuf(uniq(good,[S([T(1,"x2"),T(a*b)]), S([T(1,"x2"),T(a+b,"x"),T(a+b)]), S([T(1,"x2"),T(a*b,"x"),T(a+b)])])), rep:good, ex:devSteps(src,SO).lines.slice(1).join(" = "), sx:S_DD}; }} ],
 2:[ {g:()=>{ const a=nz(-9,9), b=nz(-9,9), src=`(x${sg(a)})(x${sg(b)})`, good=R(src); return {q:`Développe et réduis : ${show(src)}`, c:shuf(uniq(good,[S([T(1,"x2"),T(a+b,"x"),T(-a*b)]), S([T(1,"x2"),T(a*b)]), S([T(1,"x2"),T(-(a+b),"x"),T(a*b)])])), rep:good, ex:devSteps(src,SO).lines.slice(1).join(" = "), sx:S_DD}; }} ],
 3:[ {g:()=>{ const a=nz(-5,5), b=nz(-9,9), c=nz(-5,5), d=nz(-9,9); const src=`(${co(a)}${sg(b)})(${co(c)}${sg(d)})`, L=sortD(red(src)), good=sum(L);
       return {q:`Développe et réduis : ${show(src)}`, c:shuf(uniq(good,[S([T(a*c,"x2"),T(b*d)]), S([T(a*c,"x2"),T(a*d+b*c+1,"x"),T(b*d)]), S([T(a*c,"x2"),T(-(a*d+b*c),"x"),T(b*d)]), S([T(a*c,"x2"),T(a*d+b*c,"x"),T(-b*d)])]).slice(0,4)), rep:good, ex:devSteps(src,SO).lines.slice(1).join(" = "), sx:S_DD}; }} ]
}},
{nom:"Développer un carré", schema:S_CAR, q:{
 1:[ {g:()=>{ const a=ri(1,9), src=`(x+${a})2`, good=R(src); return {q:`Développe et réduis : ${show(src)}`, c:shuf(uniq(good,[S([T(1,"x2"),T(a*a)]), S([T(1,"x2"),T(a,"x"),T(a*a)]), S([T(1,"x2"),T(2*a,"x"),T(2*a)])])), rep:good, ex:`${show(src)} = (<i>x</i> + ${a})(<i>x</i> + ${a}) = ${devSteps(src,SO).lines.slice(-2).join(" = ")}`, sx:S_CAR}; }} ],
 2:[ {g:()=>{ const a=ri(1,9), src=`(x-${a})2`, good=R(src); return {q:`Développe et réduis : ${show(src)}`, c:shuf(uniq(good,[S([T(1,"x2"),T(-a*a)]), S([T(1,"x2"),T(a*a)]), S([T(1,"x2"),T(2*a,"x"),T(a*a)])])), rep:good, ex:`${show(src)} = (<i>x</i> − ${a})(<i>x</i> − ${a}) = ${devSteps(src,SO).lines.slice(-2).join(" = ")}`, sx:S_CAR}; }} ],
 3:[ {g:()=>{ const a=ri(2,6), b=nz(-9,9), src=`(${a}x${sg(b)})2`, good=R(src); return {q:`Développe et réduis : ${show(src)}`, c:shuf(uniq(good,[S([T(a*a,"x2"),T(b*b)]), S([T(a,"x2"),T(2*a*b,"x"),T(b*b)]), S([T(a*a,"x2"),T(a*b,"x"),T(b*b)])])), rep:good, ex:devSteps(src,SO).lines.slice(1).join(" = "), sx:S_CAR}; }},
     {q:"Vrai ou faux : pour tout nombre <i>x</i>, (<i>x</i> + 3)² = <i>x</i>² + 9.", c:VF, rep:"Faux", ex:"Contre-exemple : pour <i>x</i> = 1, (1 + 3)² = 16 et 1² + 9 = 10.", sx:S_CAR} ]
}},
{nom:"Prouver une égalité", schema:S_EG, q:{
 1:[ {q:"Pour prouver qu'une égalité est toujours vraie, on…", c:["développe et réduit chaque membre","teste avec deux nombres","teste avec 0"], rep:"développe et réduit chaque membre", ex:"Des exemples ne suffisent pas : il faut le calcul littéral.", sx:S_EG},
     {q:"Pour prouver qu'une égalité est fausse, il suffit…", c:["d'un contre-exemple","de deux exemples","de développer un seul membre"], rep:"d'un contre-exemple", sx:S_EG} ],
 2:[ {g:()=>{ const a=ri(1,7), b=ri(1,7), ok=Math.random()<0.5, k=ok?a+b:a+b+pick([-2,-1,1,2]); return {q:`L'égalité (<i>x</i> + ${a})(<i>x</i> + ${b}) = <i>x</i>(<i>x</i> + ${k}) + ${a*b} est-elle toujours vraie ?`, c:ON, rep:ok?"Oui":"Non", ex:`(<i>x</i> + ${a})(<i>x</i> + ${b}) = ${R(`(x+${a})(x+${b})`)} et <i>x</i>(<i>x</i> + ${k}) + ${a*b} = ${R(`x(x+${k})+${a*b}`)}.`, sx:S_EG}; }} ],
 3:[ {g:()=>{ const a=ri(1,6), ok=Math.random()<0.5, c=ok?2*a:2*a+pick([-1,1]); return {q:`L'égalité (<i>x</i> − ${a})² = <i>x</i>(<i>x</i> − ${c}) + ${a*a} est-elle toujours vraie ?`, c:ON, rep:ok?"Oui":"Non", ex:`(<i>x</i> − ${a})² = ${R(`(x-${a})2`)} et <i>x</i>(<i>x</i> − ${c}) + ${a*a} = ${R(`x(x-${c})+${a*a}`)}.`, sx:S_EG}; }} ]
}},
{nom:"Programmes de calcul", schema:S_PR, q:{
 1:[ {g:()=>{ const a=ri(1,9), b=ri(1,20), v=ri(1,6); return {q:`Programme : choisir un nombre ; ajouter ${a} ; élever au carré ; soustraire ${b}. Quel résultat obtient-on avec ${v} ?`, rep:String((v+a)**2-b).replace("-","−"), ex:`(${v} + ${a})² − ${b} = ${(v+a)**2} − ${b} = ${String((v+a)**2-b).replace("-","−")}.`, kb:"text", sx:S_PR}; }} ],
 2:[ {g:()=>{ const a=ri(1,9), b=ri(1,20); const good=`(<i>x</i> + ${a})² − ${b}`; return {q:`Programme : choisir un nombre <i>x</i> ; ajouter ${a} ; élever au carré ; soustraire ${b}. Quelle expression donne le résultat ?`, c:shuf(uniq(good,[`<i>x</i> + ${a}² − ${b}`,`(<i>x</i> + ${a} − ${b})²`,`<i>x</i>² + ${a} − ${b}`])), rep:good, ex:"On élève au carré toute la somme : les parenthèses sont obligatoires.", sx:S_PR}; }} ],
 3:[ {g:()=>{ const a=ri(1,9), b=ri(1,20), src=`(x+${a})2-${b}`, good=R(src); return {q:`Programme : choisir <i>x</i> ; ajouter ${a} ; élever au carré ; soustraire ${b}. Quelle est l'expression développée et réduite du résultat ?`, c:shuf(uniq(good,[S([T(1,"x2"),T(a*a-b)]), S([T(1,"x2"),T(a,"x"),T(a*a-b)]), S([T(1,"x2"),T(2*a,"x"),T(a*a+b)])])), rep:good, ex:devSteps(src,SO).lines.slice(1).join(" = "), sx:S_PR}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 5", duree:50, info:"Durée : 50 min · Calculatrice non autorisée · Stylo",
comp:[
  ["CALCULER","Je développe et je réduis avec la double distributivité.","Ex. 1 (6 points)"],
  ["CALCULER","Je développe et je réduis des expressions variées et je compare leurs formes réduites.","Ex. 2 (4 points)"],
  ["RAISONNER","Je prouve ou j'infirme une égalité.","Ex. 3 (4 points)"],
  ["MODÉLISER","Je traduis un programme de calcul par une expression et je la transforme.","Ex. 4 (6 points)"]
],
exos:[
{t:"Développer et réduire", p:6, h:`<p>Développe et réduis les expressions suivantes.</p>${grid([E("A","(x+4)(x+7)"),E("B","(3x-2)(5x+1)"),E("C","(2x-5)2"),E("D","(4-x)(2x+3)")])}`,
 c:`${grid([dv("A","(x+4)(x+7)"),dv("B","(3x-2)(5x+1)"),dv("C","(2x-5)2"),dv("D","(4-x)(2x+3)")])}<p><i>(1,5 point par expression)</i></p>`},
{t:"Trouve l'intrus", p:4, h:`<p>Développe et réduis chaque expression, puis trouve celle qui n'est pas égale aux trois autres.</p>${grid([E("E","(x+2)(x-3)"),E("F","x(x-1)-6"),E("G","(x-1)2-7"),E("H","x2-(x+6)")])}`,
 c:`${grid([dv("E","(x+2)(x-3)"),dv("F","x(x-1)-6"),dv("G","(x-1)2-7"),dv("H","x2-(x+6)")])}<p>E = F = H = <i>x</i>² − <i>x</i> − 6 : l'intrus est <b>G</b>.</p><p><i>(1 point par expression)</i></p>`},
{t:"Une égalité", p:4, h:`<p>Indique, en justifiant, si l'affirmation est vraie ou fausse.</p><p><b>Affirmation :</b> pour tout nombre <i>x</i>, (2<i>x</i> + 1)(<i>x</i> − 4) = <i>x</i>(2<i>x</i> − 3) − 4 − 4<i>x</i>.</p>`,
 c:`<p>D'un côté :</p>${dv("A","(2x+1)(x-4)")}<p>De l'autre :</p>${dv("B","x(2x-3)-4-4x")}<p>A = B : l'affirmation est <b>vraie</b>. <i>(1,5 point par membre, 1 point pour la conclusion)</i></p>`},
{t:"Programme de calcul", p:6, h:`${prog("Programme de calcul",["Choisir un nombre.","Ajouter 5.","Élever au carré.","Soustraire 25."])}<p>1. Montre que si on choisit 3, le résultat est 39.</p><p>2. Calcule le résultat si on choisit −4.</p><p>3. On appelle <i>x</i> le nombre de départ. Exprime le résultat en fonction de <i>x</i>.</p><p>4. Montre que ce résultat peut aussi s'écrire <i>x</i>(<i>x</i> + 10).</p>`,
 c:`<div class="calcs"><p class="calc">1.<br>A = (3 + 5)² − 25<br>A = 8² − 25<br>A = 64 − 25<br>A = 39</p><p class="calc">2.<br>B = (−4 + 5)² − 25<br>B = 1² − 25<br>B = 1 − 25<br>B = −24</p></div><p><i>(1 point pour 1, 1 point pour 2)</i></p><p>3. (<i>x</i> + 5)² − 25 <i>(1 point)</i></p><p>4.</p>${dv("C","(x+5)2-25")}${dv("D","x(x+10)")}<p>Les deux expressions sont égales : le résultat peut s'écrire <i>x</i>(<i>x</i> + 10). <i>(3 points)</i></p>`}
]}
};
/* Le bouton « Pas à pas » (data/plus.js) est inséré juste avant chaque calcul : dans une grille .calcs, il prenait une case
   à lui seul et décalait les calculs. On met donc chaque calcul de la grille dans sa propre case (<div>). */
const WRAPC=h=>typeof h!=="string"?h:h.replace(/(<div class="calcs"[^>]*>)([\s\S]*?)(<\/div>)/g,(m,a,b,c)=>a+b.replace(/<p class="calc">([\s\S]*?)<\/p>/g,'<div><p class="calc">$1</p></div>')+c);
{ const D=CH["3e-5"]; (D.cours||[]).forEach(c=>c.h=WRAPC(c.h)); (D.exos||[]).forEach(S=>S.e.forEach(e=>{ e.h=WRAPC(e.h); e.c=WRAPC(e.c); })); if(D.eval) D.eval.exos.forEach(e=>{ e.h=WRAPC(e.h); e.c=WRAPC(e.c); }); }
})();
