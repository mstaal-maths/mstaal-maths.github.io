/* 3e — Chapitre 3 : Calcul littéral 1 — simple distributivité et factorisation
   Cours, fiche d'exercices (ordre de la « Progression »), activités rapides, soutien et énigme de M. Staal.
   Les développements et factorisations sont calculés par le petit moteur ALG3 ci-dessous (et vérifiés numériquement). */
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
const AL = window.ALG3, {T, show, red, sum, sortD, devLines, factLines, devSteps, factSteps, tStr, tAbs, mono} = AL;
const calc = lines => `<p class="calc">${lines.join("<br>")}</p>`;
const dv = (n, src) => calc(devLines(n, src));
const fc = (n, src) => calc(factLines(n, src));
const E = (n, src) => `${n} = ${show(src)}`;
const list = items => items.map(x=>`<p>${x}</p>`).join("");
const grid = items => `<div class="calcs"${items.some(x=>/^<p/.test(x))?' style="grid-template-columns:repeat(auto-fill,minmax(330px,1fr))"':""}>${items.map(x=>/^<p/.test(x)?x:`<span>${x}</span>`).join("")}</div>`;
const prog = (titre, steps) => `<div class="pgc">${titre?`<b>${titre}</b>`:""}<ul>${steps.map(s=>`<li>${s}</li>`).join("")}</ul></div>`;
const tab = (head, rows) => `<div class="scroll"><table class="std"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;
/* rectangle : longueur en haut, largeur à droite (ou écrite à l'intérieur) */
const svgT = s => String(s).replace(/-/g,"−").replace(/([a-z])/g,'<tspan font-style="italic">$1</tspan>');
function rectFig(top, side, o={}){
  const w=o.w||170, h=o.h||96, x0=12, y0=36, W=x0+w+(side?78:16), H=y0+h+14;
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Rectangle${top?" de longueur "+top:""}${side?" et de largeur "+side:""}${o.inner?" d'aire "+o.inner:""}">`;
  s+=`<rect x="${x0}" y="${y0}" width="${w}" height="${h}" class="orig"/>`;
  if(top){ const y=y0-14; s+=`<line x1="${x0}" y1="${y}" x2="${x0+w}" y2="${y}" class="thin"/><polyline points="${x0+8},${y-4} ${x0},${y} ${x0+8},${y+4}" class="thin"/><polyline points="${x0+w-8},${y-4} ${x0+w},${y} ${x0+w-8},${y+4}" class="thin"/><text x="${x0+w/2}" y="${y-6}" class="lab">${svgT(top)}</text>`; }
  if(side){ const x=x0+w+14; s+=`<line x1="${x}" y1="${y0}" x2="${x}" y2="${y0+h}" class="thin"/><polyline points="${x-4},${y0+8} ${x},${y0} ${x+4},${y0+8}" class="thin"/><polyline points="${x-4},${y0+h-8} ${x},${y0+h} ${x+4},${y0+h-8}" class="thin"/><text x="${x+8}" y="${y0+h/2+5}" style="text-anchor:start;font-size:15px">${svgT(side)}</text>`; }
  if(o.inner) s+=`<text x="${x0+w/2}" y="${y0+h/2+6}" class="lab" style="font-size:17px">${svgT(o.inner)}</text>`;
  return s+"</svg>";
}
window.ALG3.rectFig = rectFig; window.ALG3.prog = prog; window.ALG3.grid = grid; window.ALG3.calc = calc;

/* ===================== schémas (rappels en image) ===================== */
const S_RED = sch("Réduire", `<p class="calc">5 × <i>x</i> = 5<i>x</i> · 1<i>x</i> = <i>x</i></p><p class="calc">3<i>x</i> × 7<i>x</i> = 21<i>x</i>²</p><p class="calc">4 + 3<i>x</i> + 5<i>x</i> = 4 + 8<i>x</i></p><p class="schN">Produit : on multiplie les nombres ensemble et les lettres ensemble.</p><p class="schN">Somme : on regroupe les termes semblables (les nombres, les <i>x</i>, les <i>x</i>²…).</p>`);
const S_PAR = sch("Supprimer des parenthèses", `<p class="calc">+(8 − 5<i>x</i>) = 8 − 5<i>x</i></p><p class="calc">−(2<i>x</i> − 8) = −2<i>x</i> + 8</p><p class="schN">Devant « − ( ) », on change le signe de chaque terme de la parenthèse.</p>`);
const S_DEV = sch("Développer", `<p class="calc"><i>k</i> × (<i>a</i> + <i>b</i>) = <i>k</i> × <i>a</i> + <i>k</i> × <i>b</i></p><p class="calc">5(4 − 6<i>x</i>) = 5 × 4 + 5 × (−6<i>x</i>) = 20 − 30<i>x</i></p><p class="schN">Développer : transformer un produit en une somme.</p>`);
const S_DEM = sch("Démontrer", `<p class="schN">1. On teste avec au moins deux nombres : on émet une conjecture.</p><p class="schN">2. Un seul contre-exemple suffit pour prouver qu'une affirmation est fausse.</p><p class="schN">3. Pour prouver qu'elle est toujours vraie, on calcule avec <i>x</i> : on développe et on réduit.</p>`);
const S_FAC = sch("Factoriser", `<p class="calc"><i>k</i> × <i>a</i> + <i>k</i> × <i>b</i> = <i>k</i> × (<i>a</i> + <i>b</i>)</p><p class="calc">12<i>x</i> − 4<i>x</i>² = 4<i>x</i> × 3 − 4<i>x</i> × <i>x</i> = 4<i>x</i>(3 − <i>x</i>)</p><p class="schN">Factoriser : transformer une somme en un produit. <i>k</i> est le facteur commun.</p>`);

/* ===================== outils du QCM ===================== */
const nz = (a,b) => { let v; do{ v=ri(a,b); }while(v===0); return v; };
const S = L => sum(L.filter(t=>t.c!==0));         /* somme sans les termes nuls (pour les choix faux) */
const M = (c,m="") => T(c,m);
/* une expression « k(ax + b) » en texte simple */
const sgn = v => v<0 ? `-${-v}` : `+${v}`;
const lin = (a,b,first="x") => (a===1?"":a===-1?"-":a)+first+sgn(b);

CH["3e-3"] = {
intro:"Réduire une expression littérale, supprimer des parenthèses, développer avec la simple distributivité, factoriser, et utiliser le calcul littéral pour prouver ou réfuter une affirmation.",
savoir:[
  "réduire une expression littérale (produit et somme) ;",
  "réduire une expression avec un ajout ou un retrait d'un calcul entre parenthèses ;",
  "développer et réduire une expression avec la simple distributivité ;",
  "tester une affirmation, trouver un contre-exemple et émettre une conjecture ;",
  "utiliser le calcul littéral pour prouver qu'une affirmation est toujours vraie ;",
  "factoriser une expression littérale en trouvant le facteur commun."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Réduire une expression littérale", h:`
  <div class="retenir" data-l="Définition"><p><b>Réduire</b> une expression littérale, c'est l'écrire sous une forme plus réduite, c'est-à-dire avec le moins de termes possible.</p></div>
  <div class="retenir" data-l="Méthode">
   <p><b>Règle n° 1 :</b> lorsqu'il y a une multiplication entre un nombre et une lettre, on peut <b>enlever le signe « multiplié »</b> entre les deux.</p>
   <p><b>Règle n° 2 :</b> pour réduire un <b>produit</b>, on peut <b>multiplier les nombres ensemble et les lettres ensemble</b>.</p>
   <p><b>Règle n° 3 :</b> pour réduire une <b>somme</b>, il faut <b>regrouper et additionner les termes semblables</b> : les nombres ensemble, les « <i>x</i> » ensemble, les « <i>y</i> » ensemble, les « <i>x</i>² » ensemble…</p></div>
  <p><b>Exemples (règle n° 1) :</b></p>
  ${grid(["5 × <i>a</i> = 5<i>a</i>","<i>x</i> × 2 = 2<i>x</i>","1 × <i>x</i> = <i>x</i>"])}
  <div class="attention"><b>ATTENTION :</b> on met toujours le nombre avant la lettre. On n'écrit jamais 1<i>x</i>, on écrit <i>x</i>.</div>
  <p><b>Exemples (règle n° 2) :</b></p>
  ${grid(["a) −6 × <i>x</i> = −6<i>x</i>","b) 4 × 3<i>x</i> = 12<i>x</i>","c) −2 × 5<i>y</i> = −10<i>y</i>","d) −6<i>x</i> × (−4) = 24<i>x</i>","e) 3<i>x</i> × 5<i>y</i> = 15<i>xy</i>","f) 6<i>y</i> × 2<i>x</i> = 12<i>yx</i> = 12<i>xy</i>","g) <i>x</i> × <i>x</i> = <i>x</i>²","h) 3<i>x</i> × 7<i>x</i> = 21<i>x</i>²"])}
  <p><b>Exemples (règle n° 3) :</b></p>
  ${list(["a) 4 + 3<i>x</i> + 5<i>x</i> = 4 + 8<i>x</i>","b) 5 + 6<i>x</i> + 3 = 8 + 6<i>x</i>","c) 6<i>x</i> − 2<i>x</i> + 7 = 4<i>x</i> + 7","d) 9 + 10<i>x</i> − 3 = 10<i>x</i> + 6","e) 7 + 2<i>x</i> : on ne peut pas réduire plus","f) 3<i>x</i> + 9 + 3 − 7<i>x</i> = −4<i>x</i> + 12","g) 5<i>y</i> + 6<i>x</i> : on ne peut pas réduire plus","h) 2<i>x</i> + 4<i>y</i> − 9 + <i>x</i> = 3<i>x</i> + 4<i>y</i> − 9","i) −2 + 4<i>y</i> − 5 + 3<i>y</i> + 2<i>x</i> = −7 + 7<i>y</i> + 2<i>x</i>","j) 10<i>x</i> + 4<i>x</i>² − 7<i>x</i> + 2<i>x</i>² = 3<i>x</i> + 6<i>x</i>²"])}
  <p><b>Exercice :</b> réduis les expressions suivantes.</p>
  ${list(["a) 2 × <i>b</i> = <b>2<i>b</i></b>","b) <i>x</i> × 3 = <b>3<i>x</i></b>","c) −3 × <i>x</i> = <b>−3<i>x</i></b>","d) <i>x</i> × (−3) = <b>−3<i>x</i></b>","e) 3<i>x</i> × 2 = <b>6<i>x</i></b>","f) 5 × (−4<i>y</i>) = <b>−20<i>y</i></b>","g) 4<i>x</i> × 2<i>y</i> = <b>8<i>xy</i></b>","h) 4<i>x</i> × <i>x</i> = <b>4<i>x</i>²</b>","i) 4 + 5<i>x</i> : <b>on ne peut pas réduire plus</b>","j) 7<i>n</i> + 4 − 2<i>n</i> = <b>5<i>n</i> + 4</b>","k) 8<i>x</i> − 2 + <i>x</i> + 10 = <b>9<i>x</i> + 8</b>","l) −2<i>x</i> − 4 − 6 + 10<i>x</i> = <b>8<i>x</i> − 10</b>","m) 5<i>x</i> − 2<i>x</i> + 3<i>x</i>² + 7 − 8<i>x</i>² = <b>3<i>x</i> − 5<i>x</i>² + 7</b>"])}`},
{k:"II", t:"Réduire avec un ajout ou un retrait d'un calcul entre parenthèses", h:`
  <div class="retenir" data-l="Méthode"><p><b>Ajouter un calcul entre parenthèses</b>, c'est ajouter chaque terme de la parenthèse.</p><p><b>Soustraire un calcul entre parenthèses</b>, c'est soustraire chaque terme de la parenthèse : on change le signe de chaque terme.</p></div>
  <p><b>Exemple :</b> réduis les expressions suivantes.</p>
  ${grid([calc([E("A","+(-2x+3)"),"A = −2<i>x</i> + 3"]),calc([E("B","+(8-5x)"),"B = 8 − 5<i>x</i>"]),calc([E("C","-(5+3x)"),"C = −5 − 3<i>x</i>"]),calc([E("D","-(2x-8)"),"D = −2<i>x</i> + 8"])])}
  <p><b>Exercice :</b> réduis les expressions suivantes.</p>
  ${grid([dv("H","-(8+2x)"),dv("I","-(5-3x)"),dv("J","3x+(7x+9)"),dv("K","2x-(5x-3)"),dv("L","-5-(-3x+4)")])}`},
{k:"III", t:"Développer une expression littérale", h:`
  <div class="retenir" data-l="Définition"><p><b>Développer</b> une expression littérale, c'est transformer un <b>produit</b> en une <b>somme</b> ou une <b>différence</b>.</p><p>On peut développer une expression littérale en utilisant la <b>simple distributivité</b>.</p></div>
  <div class="retenir" data-l="Propriété"><p><b>La simple distributivité :</b> quels que soient les nombres <i>k</i>, <i>a</i> et <i>b</i>, on a :</p><p class="calc"><i>k</i> × (<i>a</i> + <i>b</i>) = <i>k</i> × <i>a</i> + <i>k</i> × <i>b</i></p></div>
  <p><b>Exercice :</b> développe et réduis les expressions suivantes.</p>
  ${grid([dv("A","7x*(2x+3)"),calc([E("B","5(4-6x)"),"B = 5 × 4 + 5 × (−6<i>x</i>)","B = 20 − 30<i>x</i>"])])}
  ${grid([dv("C","-2x(3x-7)+10x2"),dv("D","-20+3x(4+5x)"),dv("E","10x+(3+9x)*(-4)")])}
  <div class="attention"><b>ATTENTION :</b> quand le facteur est négatif, on l'écrit entre parenthèses et on multiplie chaque terme par ce nombre négatif. Exemple : −2(3<i>x</i> − 7) = (−2) × 3<i>x</i> + (−2) × (−7) = −6<i>x</i> + 14.</div>`},
{k:"IV", t:"Utiliser le calcul littéral pour démontrer", h:`
  <h4>a) Méthode générale pour prouver ou réfuter une affirmation</h4>
  <div class="retenir" data-l="Méthode">
   <p><b>1.</b> On <b>teste avec au moins 2 nombres</b> pour pouvoir émettre une <b>conjecture</b>.</p>
   <p><b>2.</b> Si l'affirmation est <b>fausse avec au moins un nombre</b>, c'est un <b>contre-exemple</b>.</p><p><b>Conclusion :</b> pour une valeur, l'affirmation est fausse. Donc l'affirmation <b>n'est pas toujours vraie</b>.</p>
   <p><b>3.</b> Si l'affirmation est vraie avec ces deux nombres : <b>ATTENTION !</b> Cela ne prouve pas qu'elle est vraie pour tous les nombres. Nous devons utiliser le <b>calcul littéral</b> pour le prouver.</p>
   <p><b>4.</b> On teste l'affirmation avec un nombre quelconque <i>x</i> : on développe et on réduit les expressions.</p>
   <p><b>Conclusion :</b> si l'affirmation est vraie avec <i>x</i>, elle est <b>toujours vraie</b>. Si elle est fausse avec <i>x</i>, elle <b>n'est pas toujours vraie</b> ou <b>n'est jamais vraie</b>.</p></div>
  <h4>b) Exemple 1 : prouver une affirmation</h4>
  ${prog("Programme de calcul",["Choisir un nombre.","Additionner 3.","Multiplier par le nombre choisi.","Soustraire le carré du nombre choisi."])}
  <p>Pierre affirme : « Ce programme revient à multiplier par 3 le nombre de départ. » Pierre a-t-il raison ?</p>
  <p><b>Résolution n° 1</b></p>
  <div class="calcs"><p class="calc">Je teste le programme avec 4.<br>A = (4 + 3) × 4 − 4²<br>A = 7 × 4 − 16<br>A = 28 − 16<br>A = 12</p><p class="calc">Je teste le programme avec −5.<br>B = (−5 + 3) × (−5) − (−5)²<br>B = −2 × (−5) − 25<br>B = 10 − 25<br>B = −15</p></div>
  <p>J'obtiens bien le triple du nombre de départ : 3 × 4 = 12 et 3 × (−5) = −15.</p>
  <p>Le programme revient à multiplier par 3 avec ces deux nombres. Cependant, pour savoir si Pierre a raison, nous devons prouver que c'est vrai pour <b>tous</b> les nombres. Je teste alors le programme avec le nombre <i>x</i>.</p>
  ${dv("C","(x+3)*x-x2")}
  <p>Quel que soit le nombre choisi au départ, le résultat est égal au triple du nombre de départ (3<i>x</i> = 3 × <i>x</i>). Donc <b>Pierre a raison</b> : ce programme revient à multiplier par 3.</p>
  <p><b>Résolution n° 2</b></p>
  <p>Au brouillon, on teste le programme avec au moins deux nombres pour émettre une conjecture. Puis on teste directement le programme avec le nombre <i>x</i> : on obtient C = 3<i>x</i> (mêmes calculs que ci-dessus).</p>
  <h4>c) Exemple 2 : réfuter une affirmation</h4>
  ${prog("Programme de calcul",["Choisis un nombre.","Soustrais 8 à ce nombre.","Multiplie le résultat par −4.","Ajoute le quadruple du nombre de départ."])}
  <p>Anna affirme : « Ce programme donne toujours 30. » Anna a-t-elle raison ?</p>
  <p><b>Résolution n° 1 : recherche d'un contre-exemple</b> (méthode plus rapide et plus facile)</p>
  <p class="calc">Je teste le programme avec 5.<br>A = (5 − 8) × (−4) + 4 × 5<br>A = −3 × (−4) + 4 × 5<br>A = 12 + 20<br>A = 32</p>
  <p>Avec 5 comme nombre de départ, j'obtiens 32. Donc <b>Anna a tort</b> : ce programme ne donne pas toujours 30.</p>
  <p><b>Résolution n° 2 : utilisation du calcul littéral</b></p>
  <p>Je teste le programme avec le nombre <i>x</i>.</p>
  ${dv("A","(x-8)*(-4)+4x")}
  <p>Quel que soit le nombre choisi au départ, le programme donnera toujours 32. Donc <b>Anna a tort</b> : ce programme ne donnera jamais 30.</p>`},
{k:"V", t:"Factoriser une expression littérale", h:`
  <div class="retenir" data-l="Définition"><p><b>Factoriser</b> une expression littérale, c'est transformer une <b>somme</b> ou une <b>différence</b> en un <b>produit</b>.</p><p>On peut factoriser une expression littérale en utilisant la <b>simple distributivité</b>.</p></div>
  <div class="retenir" data-l="Propriété"><p><b>La simple distributivité :</b> quels que soient les nombres <i>k</i>, <i>a</i> et <i>b</i>, on a :</p><p class="calc"><i>k</i> × <i>a</i> + <i>k</i> × <i>b</i> = <i>k</i> × (<i>a</i> + <i>b</i>)</p><p><i>k</i> est appelé le <b>facteur commun</b>.</p></div>
  <p><b>Exemple :</b> factorise les expressions suivantes.</p>
  ${grid([fc("M","30+24x"),fc("N","12x-4x2"),fc("P","20x+5")])}`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Réduire et supprimer des parenthèses", e:[
  {n:"Activité 1", t:"Qui a raison ?", w:"Sur ton cahier", h:`${prog("Programme de calcul",["Prendre un nombre.","Multiplier par 2.","Ajouter 10.","Soustraire le double du nombre de départ."])}
   <p>Voici un programme de calcul sur lequel travaillent trois élèves. Voici ce qu'ils affirment :</p>
   <p><b>Jade :</b> « Quand je prends 7 comme nombre de départ, j'obtiens 10. »</p><p><b>Noé :</b> « Moi, j'ai pris −3 au départ et j'ai obtenu 22. »</p><p><b>Yasmine :</b> « Pour n'importe quel nombre choisi, le résultat final est égal à 10. »</p>
   <p>Chacun de ces trois élèves a-t-il raison ou tort ? Explique rigoureusement tes réponses.</p>`,
   c:`<p><b>Jade :</b> je teste le programme avec 7.</p>${calc(["J = 7 × 2 + 10 − 2 × 7","J = 14 + 10 − 14","J = 10"])}<p>Jade a <b>raison</b>.</p>
   <p><b>Noé :</b> je teste le programme avec −3.</p>${calc(["N = (−3) × 2 + 10 − 2 × (−3)","N = −6 + 10 + 6","N = 10"])}<p>On obtient 10 et non 22 : Noé a <b>tort</b>.</p>
   <p><b>Yasmine :</b> deux exemples ne suffisent pas. Je teste le programme avec un nombre quelconque <i>x</i> :</p>${calc(["A = <i>x</i> × 2 + 10 − 2<i>x</i>","A = 2<i>x</i> + 10 − 2<i>x</i>","A = 10"])}<p>Quel que soit le nombre de départ, on obtient 10 : Yasmine a <b>raison</b>.</p>`},
  {n:"Activité 2", t:"L'opposé d'un nombre ou d'une opération", w:"Sur ta feuille", h:`<p>Complète d'abord seulement la première colonne, puis écris le calcul associé.</p>
   ${tab(["Phrase","Calcul associé"],[["a) L'opposé de 7 est …",""],["b) L'opposé de −8 est …",""],["c) L'opposé de 5 + 6 est …",""],["d) L'opposé de 7 − 5 est …",""],["e) L'opposé de −2 − 3 est …",""],["f) L'opposé de 3<i>x</i> − 6 est …",""],["g) L'opposé de −5<i>y</i> + 4 est …",""]])}`,
   c:`${tab(["Phrase","Calcul associé"],[["a) L'opposé de 7 est <b>−7</b>","−7"],["b) L'opposé de −8 est <b>8</b>","−(−8) = 8"],["c) L'opposé de 5 + 6 est <b>−11</b>","C = −(5 + 6)<br>C = −5 − 6<br>C = −11"],["d) L'opposé de 7 − 5 est <b>−2</b>","D = −(7 − 5)<br>D = −7 + 5<br>D = −2"],["e) L'opposé de −2 − 3 est <b>5</b>","E = −(−2 − 3)<br>E = 2 + 3<br>E = 5"],["f) L'opposé de 3<i>x</i> − 6 est <b>−3<i>x</i> + 6</b>","−(3<i>x</i> − 6) = −3<i>x</i> + 6"],["g) L'opposé de −5<i>y</i> + 4 est <b>5<i>y</i> − 4</b>","−(−5<i>y</i> + 4) = 5<i>y</i> − 4"]])}
   <p>Prendre l'opposé d'un calcul entre parenthèses, c'est changer le signe de chacun de ses termes.</p>`},
  {n:"Exercice 1", t:"Réduire des expressions de la forme −(a + b) ou +(a + b)", w:"Sur ton cahier", h:`<p>Recopie les expressions sur ton cahier et réduis-les.</p>${grid([["A","-(x+6)"],["B","+(7+2x)"],["C","-(2x-7)"],["D","+(12-3x)"],["E","-(-3-9y)"],["F","-(-8x+5)"],["G","4+(5-2x)"],["H","-5x+(8+x)"],["I","3x-(7x+9)"],["J","-5-(-3x+4)"],["K","-2x2-(5x2-3)"],["L","3x2-7x-(5x-3)"]].map(([n,s])=>E(n,s)))}`,
   c:grid([["A","-(x+6)"],["B","+(7+2x)"],["C","-(2x-7)"],["D","+(12-3x)"],["E","-(-3-9y)"],["F","-(-8x+5)"],["G","4+(5-2x)"],["H","-5x+(8+x)"],["I","3x-(7x+9)"],["J","-5-(-3x+4)"],["K","-2x2-(5x2-3)"],["L","3x2-7x-(5x-3)"]].map(([n,s])=>dv(n,s)))}
 ]},
{t:"Développer avec la simple distributivité", e:[
  {n:"Activité 3", t:"Programme de calcul", w:"Sur ton cahier", h:`${prog("Programme de calcul",["Prendre un nombre.","Lui ajouter 8.","Multiplier le résultat par 2.","Soustraire 16."])}
   <p><b>1. a)</b> Vérifie qu'avec 4 comme nombre de départ, le résultat est égal à 8.</p><p><b>b)</b> Si je choisis −3 comme nombre de départ, quel résultat vais-je obtenir ?</p><p><b>2.</b> Démontre que pour n'importe quel nombre choisi, le résultat final est égal au double du nombre de départ.</p>`,
   c:`<div class="calcs"><p class="calc"><b>1. a)</b><br>B = (4 + 8) × 2 − 16<br>B = 12 × 2 − 16<br>B = 24 − 16<br>B = 8</p><p class="calc"><b>b)</b><br>C = (−3 + 8) × 2 − 16<br>C = 5 × 2 − 16<br>C = 10 − 16<br>C = <b>−6</b></p></div>
   <p><b>2.</b> Je teste le programme avec un nombre quelconque <i>x</i> :</p>${dv("A","(x+8)*2-16")}<p>2<i>x</i> est le double de <i>x</i> : quel que soit le nombre choisi, le résultat est égal au double du nombre de départ.</p>`},
  {n:"Exercice 2", t:"Développer et réduire des expressions littérales", w:"Sur ton cahier", h:`<p>Recopie les expressions sur ton cahier. Développe et réduis-les.</p>${grid([["A","5*(x+6)"],["B","3x*(2x+7)"],["C","7(6-3x)"],["D","(5+4x)*8"],["E","-5x(3x-6)"]].map(([n,s])=>E(n,s)))}`,
   c:grid([["A","5*(x+6)"],["B","3x*(2x+7)"],["C","7(6-3x)"],["D","(5+4x)*8"],["E","-5x(3x-6)"]].map(([n,s])=>dv(n,s)))},
  {n:"Exercice 3", t:"Développer et réduire tout type d'expressions littérales", w:"Sur ton cahier", h:`<p>Recopie les expressions sur ton cahier. Développe et réduis-les.</p>${grid([["A","-8(x+6)"],["B","(-4+2x)*(5x)"],["C","3x(-2x-7)"],["D","-6(-2x+5)"],["E","4(-5x+7)+12x"],["F","7x2+5x(-3x+9)"],["G","(6-4x)*(-2)-3x"],["H","-2+6x(4x+5)"],["I","10x-3(5x+2)"],["J","8+(5x-10)"],["K","10x-(8x-5)"],["L","4(x+3)+5(2x-3)"],["M","-3x-(-8x+10)"],["N","11x-9+3(x+2)"]].map(([n,s])=>E(n,s)))}`,
   c:grid([["A","-8(x+6)"],["B","(-4+2x)*(5x)"],["C","3x(-2x-7)"],["D","-6(-2x+5)"],["E","4(-5x+7)+12x"],["F","7x2+5x(-3x+9)"],["G","(6-4x)*(-2)-3x"],["H","-2+6x(4x+5)"],["I","10x-3(5x+2)"],["J","8+(5x-10)"],["K","10x-(8x-5)"],["L","4(x+3)+5(2x-3)"],["M","-3x-(-8x+10)"],["N","11x-9+3(x+2)"]].map(([n,s])=>dv(n,s)))}
 ]},
{t:"Démontrer avec le calcul littéral", e:[
  {n:"Exercice 4", t:"Programmes égaux ?", w:"Sur ton cahier", h:`<div class="progs">${prog("Programme 1",["Choisir un nombre.","Ajouter 7.","Multiplier par 4.","Soustraire le nombre de départ."])}${prog("Programme 2",["Choisir un nombre.","Multiplier par 3.","Ajouter 20."])}</div>
   <p>Si je choisis le même nombre de départ pour les deux programmes, est-ce que les programmes 1 et 2 donneront toujours le même résultat ?</p>`,
   c:`<p>Je teste les deux programmes avec 1 :</p><div class="calcs"><p class="calc">A = (1 + 7) × 4 − 1<br>A = 8 × 4 − 1<br>A = 32 − 1<br>A = 31</p><p class="calc">B = 1 × 3 + 20<br>B = 3 + 20<br>B = 23</p></div><p>31 ≠ 23 : c'est un <b>contre-exemple</b>. Les deux programmes ne donnent pas toujours le même résultat.</p>
   <p>Avec le calcul littéral, pour un nombre <i>x</i> :</p><div class="calcs">${dv("P<sub>1</sub>","(x+7)*4-x")}${calc(["P<sub>2</sub> = <i>x</i> × 3 + 20","P<sub>2</sub> = 3<i>x</i> + 20"])}</div><p>3<i>x</i> + 28 et 3<i>x</i> + 20 diffèrent toujours de 8 : les deux programmes ne donnent <b>jamais</b> le même résultat.</p>`},
  {n:"Exercice 5", t:"Programmes égaux ?", w:"Sur ton cahier", h:`<div class="progs">${prog("Programme 1",["Choisir un nombre.","Multiplier par 15.","Ajouter 6."])}${prog("Programme 2",["Choisir un nombre.","Multiplier par 5.","Ajouter 2.","Multiplier par 3."])}</div>
   <p>Si je choisis le même nombre de départ pour les deux programmes, est-ce que les programmes 1 et 2 donneront toujours le même résultat ?</p>`,
   c:`<p><b>Résolution n° 1</b></p><div class="calcs"><p class="calc">A = 2 × 15 + 6<br>A = 30 + 6<br>A = 36</p><p class="calc">B = (2 × 5 + 2) × 3<br>B = (10 + 2) × 3<br>B = 12 × 3<br>B = 36</p></div>
   <p>Quand je teste les deux programmes avec 2, j'obtiens le même résultat. Mais pour prouver que c'est toujours le cas, je teste les programmes avec le nombre <i>x</i>.</p>
   <div class="calcs">${calc(["C = <i>x</i> × 15 + 6","C = 15<i>x</i> + 6"])}${calc(["D = (<i>x</i> × 5 + 2) × 3","D = (5<i>x</i> + 2) × 3","D = 3 × 5<i>x</i> + 3 × 2","D = 15<i>x</i> + 6"])}</div>
   <p>Avec <i>x</i>, les deux programmes donnent le même résultat. Donc, quel que soit le nombre choisi au départ, les deux programmes donneront <b>toujours le même résultat</b>.</p>
   <p><b>Résolution n° 2 :</b> on teste directement avec <i>x</i> comme nombre de départ (mêmes calculs que C et D) et on conclut de la même façon.</p>`},
  {n:"Exercice 6", t:"Programme Scratch", w:"Sur ton cahier", h:`<p>On considère le programme Scratch suivant.</p>${img("3k3ex/scratch6.png","Programme Scratch : demander un nombre ; mettre a à réponse moins 4 ; mettre b à a fois 2 ; mettre c à b moins réponse ; mettre d à c plus 8 ; dire d.",300)}
   <p><b>1. a)</b> Vérifie qu'avec 10, le résultat du programme est égal à 10.</p><p><b>b)</b> Calcule le résultat avec −3 comme nombre donné.</p><p><b>2.</b> Suite aux résultats trouvés à la question 1, que constates-tu ? Émets une conjecture (une conjecture est une hypothèse).</p><p><b>3.</b> Démontre ensuite si la conjecture émise à la question précédente est vraie ou fausse.</p>`,
   c:`<div class="calcs"><p class="calc"><b>1. a)</b><br>A = (10 − 4) × 2 − 10 + 8<br>A = 6 × 2 − 10 + 8<br>A = 12 − 10 + 8<br>A = 2 + 8<br>A = 10</p><p class="calc"><b>1. b)</b><br>B = (−3 − 4) × 2 − (−3) + 8<br>B = (−7) × 2 + 3 + 8<br>B = −14 + 3 + 8<br>B = −11 + 8<br>B = −3</p></div>
   <p>Avec 10, le résultat est égal à 10. Avec −3, le résultat est égal à −3.</p><p><b>2.</b> Il me semble que le résultat du programme est égal au nombre de départ.</p><p><b>3.</b> Je teste le programme Scratch avec <i>x</i> :</p>${dv("A","(x-4)*2-x+8")}
   <p>Avec <i>x</i>, le résultat du programme est égal à <i>x</i> : ma conjecture est <b>vraie</b>. Le résultat de ce programme est toujours égal au nombre de départ.</p>`},
  {n:"Exercice 7", t:"Mêmes aires ?", w:"Sur ton cahier", h:`<p>On considère les rectangles suivants. <i>x</i> est un nombre positif.</p><div class="figs">${rectFig("x + 4","3x")}${rectFig("3x + 12","x",{w:200,h:70})}</div>
   <p><b>a.</b> Vérifie que pour <i>x</i> = 2 ces rectangles ont la même aire.</p><p><b>b.</b> Ont-ils la même aire quelle que soit la valeur de <i>x</i> ? Justifie.</p>`,
   c:`<p><b>a.</b> Pour <i>x</i> = 2 :</p><div class="calcs"><p class="calc">A<sub>1</sub> = (2 + 4) × 3 × 2<br>A<sub>1</sub> = 6 × 6<br>A<sub>1</sub> = 36</p><p class="calc">A<sub>2</sub> = (3 × 2 + 12) × 2<br>A<sub>2</sub> = (6 + 12) × 2<br>A<sub>2</sub> = 18 × 2<br>A<sub>2</sub> = 36</p></div><p>Les deux aires sont égales.</p>
   <p><b>b.</b></p><div class="calcs">${dv("A<sub>1</sub>","3x(x+4)")}${dv("A<sub>2</sub>","x(3x+12)")}</div><p>Les deux aires sont égales à 3<i>x</i>² + 12<i>x</i> : les rectangles ont <b>toujours la même aire</b>, quelle que soit la valeur de <i>x</i>.</p>`},
  {n:"Exercice 8", t:"Programme de calcul", w:"Sur ton cahier", h:`${prog("Programme de calcul",["Choisir un nombre.","Mettre ce nombre au carré.","Ajouter 5.","Multiplier par 2."])}
   <p><b>1)</b> Montre que si on choisit −3 comme nombre de départ, on obtient 28.</p><p><b>2)</b> Qu'obtient-on si on choisit 3 comme nombre de départ ?</p><p><b>3)</b> Quelle conjecture peut-on écrire suite aux questions précédentes ?</p><p><b>4)</b> Prouve ou réfute cette conjecture.</p>`,
   c:`<div class="calcs"><p class="calc"><b>1)</b><br>A = ((−3)² + 5) × 2<br>A = (9 + 5) × 2<br>A = 14 × 2<br>A = 28</p><p class="calc"><b>2)</b><br>B = (3² + 5) × 2<br>B = (9 + 5) × 2<br>B = 14 × 2<br>B = <b>28</b></p></div><p><b>3)</b> Conjecture : un nombre et son opposé donnent le même résultat.</p>
   <p><b>4)</b> Avec un nombre <i>x</i> :</p>${dv("C","(x2+5)*2")}<p>Avec son opposé −<i>x</i> : (−<i>x</i>)² = <i>x</i>², donc on obtient aussi (<i>x</i>² + 5) × 2 = 2<i>x</i>² + 10.</p><p>La conjecture est <b>vraie</b> : un nombre et son opposé donnent toujours le même résultat.</p>`},
  {n:"Exercice 9", t:"Compléter un programme Scratch", w:"Sur ton cahier", h:`${prog("Programme de calcul",["Choisir un nombre.","Soustraire 3.","Multiplier par −2.","Ajouter le nombre de départ.","Soustraire 6."])}${img("3k3ex/scratch10.png","Programme Scratch à compléter : demander Choisis un nombre ; mettre a à … ; mettre b à … ; mettre c à … ; mettre d à … ; dire …",300)}
   <p><b>1.</b> Complète le programme Scratch.</p><p><b>2.</b> Quelle relation peux-tu faire entre le nombre choisi au départ et le résultat obtenu par ce programme ? Ta réponse doit être accompagnée <b>d'une démonstration</b>.</p>`,
   c:`<p><b>1.</b> mettre a à (réponse − 3) ; mettre b à (a × −2) ; mettre c à (b + réponse) ; mettre d à (c − 6) ; dire d.</p>
   <p><b>2.</b> Au brouillon, je teste avec 5 :</p>${calc(["B = (5 − 3) × (−2) + 5 − 6","B = 2 × (−2) + 5 − 6","B = −4 + 5 − 6","B = −5"])}<p>Il semble que le résultat soit l'opposé du nombre de départ.</p><p>Je teste le programme avec <i>x</i> :</p>${dv("A","(x-3)*(-2)+x-6")}<p>Le résultat est toujours <b>l'opposé du nombre de départ</b>.</p>`},
  {n:"Exercice en +", t:"Mêmes aires ?", w:"Sur ton cahier", h:`<p><i>x</i> désigne un nombre positif.</p><div class="figs">${rectFig("4x + 2","2x",{w:180,h:80})}${rectFig("3x + 1","3x",{w:150,h:100})}</div>
   <p><b>a)</b> Démontre que pour <i>x</i> = 1, les aires de ces deux rectangles sont égales.</p><p><b>b)</b> Ces rectangles ont-ils la même aire quelle que soit la valeur de <i>x</i> ? Justifie.</p>`,
   c:`<p><b>a)</b> Pour <i>x</i> = 1 :</p><div class="calcs"><p class="calc">A<sub>1</sub> = (4 × 1 + 2) × 2 × 1<br>A<sub>1</sub> = 6 × 2<br>A<sub>1</sub> = 12</p><p class="calc">A<sub>2</sub> = (3 × 1 + 1) × 3 × 1<br>A<sub>2</sub> = 4 × 3<br>A<sub>2</sub> = 12</p></div><p>Les aires sont égales.</p>
   <p><b>b)</b> Pour <i>x</i> = 2 :</p><div class="calcs"><p class="calc">A<sub>1</sub> = (4 × 2 + 2) × 2 × 2<br>A<sub>1</sub> = 10 × 4<br>A<sub>1</sub> = 40</p><p class="calc">A<sub>2</sub> = (3 × 2 + 1) × 3 × 2<br>A<sub>2</sub> = 7 × 6<br>A<sub>2</sub> = 42</p></div><p>40 ≠ 42 : c'est un <b>contre-exemple</b>. Les rectangles n'ont pas toujours la même aire.</p><p>Avec le calcul littéral :</p><div class="calcs">${dv("A<sub>1</sub>","2x(4x+2)")}${dv("A<sub>2</sub>","3x(3x+1)")}</div><p>Ces deux expressions ne sont pas égales.</p>`}
 ]},
{t:"Factoriser", e:[
  {n:"Activité 4", t:"Aire de rectangles", w:"Sur ton cahier", h:`<p><b>Partie 1 :</b> soit <i>x</i> un nombre positif.</p>${rectFig("2x + 5","6x",{w:200,h:90})}<p>Donne l'expression développée et réduite de l'aire de ce rectangle en fonction de <i>x</i>.</p>
   <p><b>Partie 2 :</b> soit <i>x</i> un nombre positif.</p>${rectFig("","",{w:200,h:90,inner:"2x² + 6x"})}<p>L'aire de ce rectangle est égale à 2<i>x</i>² + 6<i>x</i>.</p><p>Quelles peuvent être les dimensions (largeur et longueur) de ce rectangle ? Explique ta réponse. <i>Plusieurs réponses sont possibles.</i></p>`,
   c:`<p><b>Partie 1 :</b></p>${dv("A","6x(2x+5)")}
   <p><b>Partie 2 :</b> on cherche deux facteurs dont le produit est 2<i>x</i>² + 6<i>x</i> : on <b>factorise</b>.</p>${fc("A","2x2+6x")}<p>Le rectangle peut mesurer 2<i>x</i> sur <i>x</i> + 3. Autres possibilités : <i>x</i> et 2<i>x</i> + 6 (car <i>x</i>(2<i>x</i> + 6) = 2<i>x</i>² + 6<i>x</i>), ou 2 et <i>x</i>² + 3<i>x</i>.</p>`},
  {n:"Activité 5", t:"Différence entre développer et factoriser", w:"Sur ton cahier", h:`<p><b>DÉVELOPPER</b> une expression littérale, c'est transformer un produit en une somme.</p><p><b>Exemple :</b> on souhaite développer A = 7 × (2<i>x</i> + 3). On utilise la simple distributivité : <i>k</i> × (<i>a</i> + <i>b</i>) = <i>k</i> × <i>a</i> + <i>k</i> × <i>b</i>.</p>
   <p class="calc">A = 7 × (2<i>x</i> + 3) → on a un produit<br>A = 7 × 2<i>x</i> + 7 × 3<br>A = 14<i>x</i> + 21 → on obtient bien une somme</p>
   <p><b>FACTORISER</b> une expression littérale, c'est transformer une somme en un produit.</p><p><b>Exemple :</b> on souhaite factoriser B = 14<i>x</i> + 21. On utilise la simple distributivité dans l'autre sens : <i>k</i> × <i>a</i> + <i>k</i> × <i>b</i> = <i>k</i> × (<i>a</i> + <i>b</i>).</p>
   <p class="calc">B = 14<i>x</i> + 21 → on a une somme<br>B = 7 × 2<i>x</i> + 7 × 3<br>B = 7 × (2<i>x</i> + 3) → on obtient bien un produit</p>
   <p>À l'aide des définitions ci-dessus :</p><p><b>1.</b> développe ces deux produits : ${E("A","-5x(3x+2)")} et ${E("B","4(5x-3)")} ;</p><p><b>2.</b> factorise ces deux sommes : ${E("C","8x+12")} et ${E("D","3x2-2x")}.</p>`,
   c:`<p><b>1.</b></p>${grid([dv("A","-5x(3x+2)"),dv("B","4(5x-3)")])}<p><b>2.</b></p>${grid([fc("C","8x+12"),fc("D","3x2-2x")])}`},
  {n:"Exercice 10", t:"Entraînement à la factorisation", w:"Sur ton cahier", h:`<p>Factorise les expressions suivantes.</p>${grid([["A","3x+12"],["B","25x+40"],["C","2x2-5x"],["D","24-32y"],["E","4x+yx"],["F","6x2+9x"],["G","14x+7"],["H","16x2-2"]].map(([n,s])=>E(n,s)))}`,
   c:grid([["A","3x+12"],["B","25x+40"],["C","2x2-5x"],["D","24-32y"],["E","4x+yx"],["F","6x2+9x"],["G","14x+7"],["H","16x2-2"]].map(([n,s])=>fc(n,s)))},
  {n:"Exercice 11", t:"Développer ou factoriser ?", w:"Sur ton cahier", h:`<p>On donne les expressions suivantes :</p>${grid([["A","3x(x+4)"],["B","18x+12"],["C","20x-5x2"],["D","10+30x"],["E","3y(5-2x)"],["F","(2x-9)*(-4)"]].map(([n,s])=>E(n,s)))}
   <p><b>1.</b> Parmi ces expressions, lesquelles peut-on développer ?</p><p><b>2.</b> Développe et réduis ces expressions.</p><p><b>3.</b> Factorise les autres expressions.</p>`,
   c:`<p><b>1.</b> On peut développer les <b>produits</b> : A, E et F.</p><p><b>2.</b></p>${grid([dv("A","3x(x+4)"),dv("E","3y(5-2x)"),dv("F","(2x-9)*(-4)")])}
   <p><b>3.</b> On factorise les <b>sommes</b> B, C et D, avec le plus grand facteur commun :</p>${grid([fc("B","18x+12"),fc("C","20x-5x2"),fc("D","10+30x")])}
   <div class="attention"><b>ATTENTION :</b> 3(6<i>x</i> + 4) ou 5(2 + 6<i>x</i>) sont des produits, mais la factorisation n'est pas terminée : on peut encore mettre 2 en facteur. On cherche le plus grand facteur commun.</div>`}
 ]},
{t:"Activités rapides", e:[
  {n:"Activité rapide 1", t:"Placer correctement des parenthèses", w:"Sur ton cahier", h:`<p>Pour chaque exercice, écris l'expression qui permet de trouver le résultat et calcule-la. Pas de phrase réponse attendue.</p>
   <div class="progs">${prog("Ex 1 : programme",["Choisir un nombre.","Multiplier par 4.","Soustraire 6.","Ajouter 10."])}${prog("Ex 2 : programme",["Choisir un nombre.","Ajouter 3.","Multiplier par 2."])}</div>
   <p><b>Ex 1 et Ex 2 :</b> calcule le résultat de chaque programme avec 5 comme nombre de départ.</p><p><b>Ex 3 :</b> <i>x</i> est un nombre positif (en cm). Calcule l'aire de ce rectangle avec <i>x</i> = 3.</p>${rectFig("x + 4","2x",{w:150,h:80})}`,
   c:`<div class="calcs"><p class="calc"><b>Ex 1 :</b><br>A = 5 × 4 − 6 + 10<br>A = 20 − 6 + 10<br>A = <b>24</b></p><p class="calc"><b>Ex 2 :</b><br>B = (5 + 3) × 2<br>B = 8 × 2<br>B = <b>16</b></p><p class="calc"><b>Ex 3 :</b><br>C = 2 × 3 × (3 + 4)<br>C = 6 × 7<br>C = <b>42</b> (cm²)</p></div><p>Pour l'Ex 2, les parenthèses sont obligatoires.</p>`},
  {n:"Activité rapide 2", t:"Rajouter des parenthèses", w:"Sur ton cahier", h:`<p>Pour que chaque expression littérale soit correcte, rajoute des parenthèses si besoin.</p>
   <div class="progs">${prog("Ex 1",["Choisir un nombre <i>n</i>.","Multiplier par 5.","Ajouter 2.","Multiplier par 3."])}${prog("Ex 2",["Choisir un nombre <i>x</i>.","Multiplier par 4.","Soustraire 6."])}${prog("Ex 3",["Choisir un nombre <i>n</i>.","Multiplier par 2.","Soustraire 3.","Multiplier par 2."])}</div>
   <p><b>Ex 1 :</b> A = <i>n</i> × 5 + 2 × 3</p><p><b>Ex 2 :</b> B = <i>x</i> × 4 − 6</p><p><b>Ex 3 :</b> C = <i>n</i> × 2 − 3 × 2</p><p><b>Ex 4 :</b> l'aire du rectangle ci-dessous est D = <i>x</i> + 4 × 3<i>x</i>.</p>${rectFig("x + 4","3x",{w:150,h:90})}`,
   c:`<p><b>Ex 1 :</b> A = (<i>n</i> × 5 + 2) × 3</p><p><b>Ex 2 :</b> B = <i>x</i> × 4 − 6 : pas besoin de parenthèses.</p><p><b>Ex 3 :</b> C = (<i>n</i> × 2 − 3) × 2</p><p><b>Ex 4 :</b> D = (<i>x</i> + 4) × 3<i>x</i></p>`},
  {n:"Activité rapide 3", t:"Programme Scratch", w:"Sur ton cahier", h:`<p>Si je donne le nombre 8, quel nombre me renvoie ce programme Scratch ?</p>${img("3k3ex/scratch-ar.png","Programme Scratch : demander un nombre ; mettre a à réponse moins 5 ; mettre b à a fois 2 ; mettre c à b plus réponse ; dire c.",300)}`,
   c:`<p class="calc">a = 8 − 5 = 3<br>b = 3 × 2 = 6<br>c = 6 + 8 = 14</p><p>Le programme renvoie <b>14</b>.</p>`},
  {n:"Activité rapide 4", t:"Aire d'un rectangle", w:"Sur ton cahier", h:`<p><i>x</i> est un nombre positif.</p><p>Donne l'expression développée et réduite de l'aire de ce rectangle.</p>${rectFig("x + 4","3x",{w:150,h:90})}`,
   c:dv("A","3x(x+4)")}
 ]},
{t:"Soutien et énigme", e:[
  {n:"Soutien 1", t:"Développer des expressions de la forme k × (a + b)", w:"Sur ton cahier", h:`<p>Recopie les expressions sur ton cahier et développe-les.</p>${grid([E("A","5*(x+6)"),E("E","(x+6)*4x")])}`,
   c:grid([dv("A","5*(x+6)"),dv("E","(x+6)*4x")])},
  {n:"Soutien 2", t:"Développer des expressions de la forme k × (a − b)", w:"Sur ton cahier", h:`<p>Développe les expressions suivantes.</p>${grid([["A","8(2x-6)"],["C","(2x-3)*9"],["E","6x(-7-5x)"],["F","(6-4x)*(-2)"]].map(([n,s])=>E(n,s)))}`,
   c:grid([["A","8(2x-6)"],["C","(2x-3)*9"],["E","6x(-7-5x)"],["F","(6-4x)*(-2)"]].map(([n,s])=>dv(n,s)))},
  {n:"Soutien 3", t:"Réduire tout type d'expressions littérales", w:"Sur ton cahier", h:`<p>Développe et réduis les expressions suivantes.</p>${grid([["B","-3y(2x-4)"],["C","7(3-2x)+4x"],["D","(x+8)*4x"],["F","5x(-2x+4)-12x"],["G","8+5(6+4x)"],["H","3x(5-4x)-9"],["J","3x-6(4x+8)"],["M","-5-4(3x-7)"]].map(([n,s])=>E(n,s)))}`,
   c:grid([["B","-3y(2x-4)"],["C","7(3-2x)+4x"],["D","(x+8)*4x"],["F","5x(-2x+4)-12x"],["G","8+5(6+4x)"],["H","3x(5-4x)-9"],["J","3x-6(4x+8)"],["M","-5-4(3x-7)"]].map(([n,s])=>dv(n,s)))},
  {n:"Soutien 4", t:"Les deux programmes donnent-ils toujours le même résultat ?", w:"Sur ton cahier", h:`<div class="progs">${prog("Programme 1",["Choisir un nombre.","Soustraire 3.","Multiplier par 2."])}${prog("Programme 2",["Choisir un nombre.","Multiplier par 2.","Soustraire 6."])}</div>
   <p><b>1. a)</b> Teste chaque programme avec 3 comme nombre de départ.</p><p><b>b)</b> Teste chaque programme avec −5 comme nombre de départ.</p><p><b>2.</b> Que constates-tu ? Émets une conjecture (« Il me semble que… »).</p><p><b>3.</b> Démontre si la conjecture est vraie ou fausse.</p>`,
   c:`<p><b>1. a)</b> Avec 3 :</p><div class="calcs"><p class="calc">A = (3 − 3) × 2<br>A = 0 × 2<br>A = 0</p><p class="calc">B = 3 × 2 − 6<br>B = 6 − 6<br>B = 0</p></div><p><b>b)</b> Avec −5 :</p><div class="calcs"><p class="calc">C = (−5 − 3) × 2<br>C = (−8) × 2<br>C = −16</p><p class="calc">D = (−5) × 2 − 6<br>D = −10 − 6<br>D = −16</p></div><p><b>2.</b> Il me semble que les deux programmes donnent toujours le même résultat.</p>
   <p><b>3.</b></p><div class="calcs">${dv("P<sub>1</sub>","(x-3)*2")}${calc(["P<sub>2</sub> = <i>x</i> × 2 − 6","P<sub>2</sub> = 2<i>x</i> − 6"])}</div><p>Avec <i>x</i>, on obtient le même résultat : la conjecture est <b>vraie</b>.</p>`},
  {n:"Soutien 5", t:"Programme Scratch", w:"Sur ton cahier", h:`<p>On considère le programme Scratch suivant.</p>${img("3k3ex/scratch-s5.png","Programme Scratch : demander un nombre ; mettre a à réponse moins 4 ; mettre b à a fois 3 ; mettre c à b moins réponse ; mettre d à c plus 12 ; dire d.",300)}
   <p><b>1.</b> Teste ce programme Scratch avec les nombres 3 et −5.</p><p><b>2.</b> Que constates-tu ? Émets une conjecture.</p><p><b>3.</b> Démontre si la conjecture est vraie ou fausse.</p>`,
   c:`<div class="calcs"><p class="calc">Avec 3 :<br>A = (3 − 4) × 3 − 3 + 12<br>A = (−1) × 3 − 3 + 12<br>A = −3 − 3 + 12<br>A = 6</p><p class="calc">Avec −5 :<br>B = (−5 − 4) × 3 − (−5) + 12<br>B = (−9) × 3 + 5 + 12<br>B = −27 + 5 + 12<br>B = −10</p></div>
   <p><b>2.</b> 6 = 2 × 3 et −10 = 2 × (−5) : il me semble que le programme donne le double du nombre de départ.</p><p><b>3.</b></p>${dv("C","(x-4)*3-x+12")}<p>La conjecture est <b>vraie</b> : le programme donne toujours le double du nombre de départ.</p>`},
  {n:"Énigme", t:"Le message codé", w:"Sur ton cahier", h:`<p>Voici un message codé : <b>R E S I S T A N T S</b>.</p><p>Associe chaque expression de la colonne de gauche à l'expression de la colonne de droite qui lui est égale. Note au fur et à mesure les lettres pour trouver le message codé.</p>
   ${tab(["Gauche","Droite"],[["R : 4<i>x</i>(5<i>x</i> − 8)","A : −24<i>x</i> + 42"],["E : 12<i>x</i> + 18","O : 5 − 5<i>x</i>"],["S : −6(4<i>x</i> − 7)","N : −10<i>x</i> − 10"],["I : 14 + (5<i>x</i> + 2)","M : 5<i>x</i>(3<i>x</i> − 8)"],["S : 15<i>x</i>² − 40<i>x</i>","L : 15<i>x</i> − 3"],["T : 8 − (5<i>x</i> + 3)","J : 20<i>x</i>² − 32<i>x</i>"],["A : 4<i>x</i> + 2(3<i>x</i> − 5)","N : 16 + 5<i>x</i>"],["N : 6<i>x</i> + 4 − (7 − 9<i>x</i>)","U : 10<i>x</i> − 10"],["T : 2(3<i>x</i> + 5) + 4(2<i>x</i> − 3)","E : 6(2<i>x</i> + 3)"],["S : 4<i>x</i> − 2(7<i>x</i> + 5)","I : 14<i>x</i> − 2"]])}`,
   c:`${tab(["Lettre codée","Expression","Forme développée et réduite","Lettre"],[["R","4<i>x</i>(5<i>x</i> − 8)","20<i>x</i>² − 32<i>x</i>","J"],["E","12<i>x</i> + 18","6(2<i>x</i> + 3) = 12<i>x</i> + 18","E"],["S","−6(4<i>x</i> − 7)","−24<i>x</i> + 42","A"],["I","14 + (5<i>x</i> + 2)","5<i>x</i> + 16","N"],["S","15<i>x</i>² − 40<i>x</i>","5<i>x</i>(3<i>x</i> − 8) = 15<i>x</i>² − 40<i>x</i>","M"],["T","8 − (5<i>x</i> + 3)","5 − 5<i>x</i>","O"],["A","4<i>x</i> + 2(3<i>x</i> − 5)","10<i>x</i> − 10","U"],["N","6<i>x</i> + 4 − (7 − 9<i>x</i>)","15<i>x</i> − 3","L"],["T","2(3<i>x</i> + 5) + 4(2<i>x</i> − 3)","14<i>x</i> − 2","I"],["S","4<i>x</i> − 2(7<i>x</i> + 5)","−10<i>x</i> − 10","N"]])}
   <p>Le message est <b>JEAN MOULIN</b>, un grand résistant de la Seconde Guerre mondiale.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Réduire", schema:S_RED, q:{
 1:[ {g:()=>{ const a=nz(-9,9), b=ri(2,9); const good=tStr(M(a*b,"x")); return {q:`Réduis : ${a<0?`(${a})`.replace("-","−"):a} × ${b}<i>x</i>`, c:shuf(uniq(good,[tStr(M(a+b,"x")),tStr(M(a*b,"x2")),`${a*b}`.replace("-","−")])), rep:good, ex:`On multiplie les nombres : ${a} × ${b} = ${a*b}.`.replace(/-/g,"−"), sx:S_RED}; }} ],
 2:[ {g:()=>{ const a=nz(-7,7), b=ri(2,8); const good=tStr(M(a*b,"x2")); return {q:`Réduis : ${tStr(M(a,"x"))} × ${b}<i>x</i>`, c:shuf(uniq(good,[tStr(M(a*b,"x")),tStr(M(a+b,"x2")),tStr(M(a+b,"x"))])), rep:good, ex:`Nombres : ${a} × ${b} = ${a*b}. Lettres : <i>x</i> × <i>x</i> = <i>x</i>².`.replace(/(^|[^>])-/g,"$1−"), sx:S_RED}; }},
     {g:()=>{ const a=ri(2,9), b=nz(-9,9), c=nz(-9,9), d=nz(-9,9); if(a+c===0) return {q:"Réduis : 4 + 3<i>x</i> + 5<i>x</i>", c:shuf(["4 + 8<i>x</i>","12<i>x</i>","4 + 15<i>x</i>"]), rep:"4 + 8<i>x</i>", ex:"3<i>x</i> + 5<i>x</i> = 8<i>x</i>.", sx:S_RED};
       const src=`${a}x${sgn(b)}${sgn(c)}x${sgn(d)}`, R=sortD(red(src)), good=sum(R);
       return {q:`Réduis : ${show(src)}`, c:shuf(uniq(good,[S(sortD([M(a+c,"x"),M(b-d)])), `${a+b+c+d}<i>x</i>`.replace("-","−"), S(sortD([M(a-c,"x"),M(b+d)]))])), rep:good, ex:`Les <i>x</i> : ${a} + ${c<0?`(${c})`:c} = ${a+c}. Les nombres : ${b} + ${d<0?`(${d})`:d} = ${b+d}.`.replace(/(^|[^>])-/g,"$1−"), sx:S_RED}; }} ],
 3:[ {g:()=>{ const a=nz(-6,6), b=nz(-6,6), c=nz(-6,6), d=nz(-6,6); if(a+c===0||b+d===0) return {q:"Réduis : 10<i>x</i> + 4<i>x</i>² − 7<i>x</i> + 2<i>x</i>²", c:shuf(["6<i>x</i>² + 3<i>x</i>","9<i>x</i>²","9<i>x</i>³","6<i>x</i>² − 3<i>x</i>"]), rep:"6<i>x</i>² + 3<i>x</i>", ex:"Les <i>x</i>² : 4 + 2 = 6. Les <i>x</i> : 10 − 7 = 3.", sx:S_RED};
       const src=`${a}x2${sgn(b)}x${sgn(c)}x2${sgn(d)}x`, good=sum(sortD(red(src)));
       return {q:`Réduis : ${show(src)}`, c:shuf(uniq(good,[S(sortD([M(a+b,"x2"),M(c+d,"x")])), tStr(M(a+b+c+d,"x2")), S(sortD([M(a+c,"x2"),M(b-d,"x")]))]).filter(s=>!/(^|\s)0<i>/.test(s))), rep:good, ex:`On regroupe les <i>x</i>² ensemble et les <i>x</i> ensemble.`, sx:S_RED}; }} ]
}},
{nom:"Supprimer des parenthèses", schema:S_PAR, q:{
 1:[ {g:()=>{ const a=nz(-9,9), b=nz(-9,9), src=`-(${lin(a,b)})`, good=sum(red(src)); return {q:`Réduis : ${show(src)}`, c:shuf(uniq(good,[S([M(-a,"x"),M(b)]), S([M(a,"x"),M(-b)]), S([M(a,"x"),M(b)])])), rep:good, ex:"Devant « −( ) », on change le signe de chaque terme.", sx:S_PAR}; }} ],
 2:[ {g:()=>{ const k=nz(-9,9), a=nz(-9,9), b=nz(-9,9); if(k+a===0) return {q:"Réduis : 2<i>x</i> − (5<i>x</i> − 3)", c:shuf(["−3<i>x</i> + 3","−3<i>x</i> − 3","7<i>x</i> − 3"]), rep:"−3<i>x</i> + 3", ex:"2<i>x</i> − 5<i>x</i> + 3 = −3<i>x</i> + 3.", sx:S_PAR};
       const src=`${k}x-(${lin(a,b)})`, good=sum(red(src)); return {q:`Réduis : ${show(src)}`, c:shuf(uniq(good,[sum(red(`${k}x-${a}x+${b}`.replace(/--/g,"+").replace(/\+-/g,"-"))), sum(red(`${k}x+${a}x+${b}`.replace(/\+-/g,"-"))), sum(red(`${k}x+${a}x-${b}`.replace(/\+-/g,"-").replace(/--/g,"+")))])), rep:good, ex:`${show(src)} = ${S([M(k,"x"),M(-a,"x"),M(-b)])} = ${good}.`, sx:S_PAR}; }} ],
 3:[ {g:()=>{ const c=nz(-9,9), a=nz(-9,9), b=nz(-9,9); const src=`${c}-(${lin(a,b)})`, good=sum(sortD(red(src))); return {q:`Réduis : ${show(src)}`, c:shuf(uniq(good,[sum(sortD(red(`${c}+${a}x+${b}`.replace(/\+-/g,"-")))), sum(sortD(red(`${c}-${a}x+${b}`.replace(/--/g,"+").replace(/\+-/g,"-")))), sum(sortD(red(`${c}+${a}x-${b}`.replace(/\+-/g,"-").replace(/--/g,"+"))))])), rep:good, ex:`On change le signe de chaque terme de la parenthèse : ${S([M(c),M(-a,"x"),M(-b)])}.`, sx:S_PAR}; }} ]
}},
{nom:"Développer", schema:S_DEV, q:{
 1:[ {g:()=>{ const k=ri(2,9), a=ri(1,9), b=nz(-9,9), src=`${k}(${lin(a,b)})`, good=sum(red(src)); return {q:`Développe : ${show(src)}`, c:shuf(uniq(good,[S([M(k*a,"x"),M(b)]), S([M(k+a,"x"),M(k*b)]), S([M(a,"x"),M(k*b)])])), rep:good, ex:devSteps(src).lines.slice(1).join(" = "), sx:S_DEV}; }} ],
 2:[ {g:()=>{ const k=nz(-9,-2), a=nz(-9,9), b=nz(-9,9), src=`${k}(${lin(a,b)})`, good=sum(red(src)); return {q:`Développe : ${show(src)}`, c:shuf(uniq(good,[S([M(k*a,"x"),M(-k*b)]), S([M(k*a,"x"),M(b)]), S([M(-k*a,"x"),M(-k*b)])])), rep:good, ex:devSteps(src).lines.slice(1).join(" = "), sx:S_DEV}; }},
     {g:()=>{ const k=nz(-6,6), a=nz(-7,7), b=nz(-9,9), src=`${k}x(${lin(a,b)})`, good=sum(red(src)); return {q:`Développe : ${show(src)}`, c:shuf(uniq(good,[S([M(k*a,"x"),M(k*b,"x")]), S([M(k*a,"x2"),M(b)]), S([M(k*a,"x2"),M(k*b)])])), rep:good, ex:devSteps(src).lines.slice(1).join(" = "), sx:S_DEV}; }} ],
 3:[ {g:()=>{ let k,a,b,c,R; do{ k=nz(-6,6); a=nz(-6,6); b=nz(-9,9); c=nz(-9,9); R=sortD(red(`${c}x${sgn(k)}(${lin(a,b)})`)); }while(R.length<2||c+k*a===0||Math.abs(k)===1); const src=`${c}x${sgn(k)}(${lin(a,b)})`, good=sum(R);
       return {q:`Développe et réduis : ${show(src)}`, c:shuf(uniq(good,[S(sortD([M(c+k*a,"x"),M(b)])), S(sortD([M(c+a,"x"),M(k*b)])), S(sortD([M(c-k*a,"x"),M(-k*b)]))])), rep:good, ex:devSteps(src).lines.slice(1).join(" = "), sx:S_DEV}; }} ]
}},
{nom:"Démontrer", schema:S_DEM, q:{
 1:[ {q:"Pour prouver qu'une affirmation est fausse, il suffit…", c:["de trouver un seul contre-exemple","de la tester avec deux nombres","de calculer avec 0"], rep:"de trouver un seul contre-exemple", ex:"Un seul exemple pour lequel l'affirmation est fausse suffit.", sx:S_DEM},
     {q:"Vrai ou faux : si une affirmation est vraie avec deux nombres, alors elle est toujours vraie.", c:VF, rep:"Faux", ex:"Deux exemples ne prouvent rien : il faut utiliser le calcul littéral avec <i>x</i>.", sx:S_DEM} ],
 2:[ {g:()=>{ const a=ri(2,9), b=ri(2,9); const good=`(<i>x</i> + ${a}) × ${b}`; return {q:`Programme : choisir un nombre <i>x</i> ; ajouter ${a} ; multiplier le résultat par ${b}. Quelle expression donne le résultat ?`, c:shuf(uniq(good,[`<i>x</i> + ${a} × ${b}`,`<i>x</i> × ${b} + ${a}`,`<i>x</i> + ${a} + ${b}`])), rep:good, ex:`On ajoute d'abord ${a} : les parenthèses sont obligatoires.`, sx:S_DEM}; }} ],
 3:[ {g:()=>{ const a=ri(2,9), b=ri(2,6), d=pick([0,0,ri(1,9)]); const c=a*b+d; const same=d===0;
       return {q:`Programme 1 : (<i>x</i> + ${a}) × ${b}. Programme 2 : ${b}<i>x</i> + ${c}. Les deux programmes donnent-ils toujours le même résultat ?`, c:ON, rep:same?"Oui":"Non", ex:`(<i>x</i> + ${a}) × ${b} = ${b}<i>x</i> + ${a*b}. ${same?"C'est bien":"Ce n'est pas"} ${b}<i>x</i> + ${c}.`, sx:S_DEM}; }} ]
}},
{nom:"Factoriser", schema:S_FAC, q:{
 1:[ {g:()=>{ let k,a,b; do{ k=ri(2,9); a=ri(1,9); b=ri(1,9); }while(AL.gcd(a,b)!==1); const src=`${k*a}x+${k*b}`, good=factSteps(src).res; return {q:`Factorise : ${show(src)}`, c:shuf(uniq(good,[`${k}(${a===1?"":a}<i>x</i> + ${k*b})`, `${k*a}(<i>x</i> + ${k*b})`, `${k}<i>x</i>(${a} + ${b})`])), rep:good, ex:factSteps(src).lines.slice(1).join(" = "), sx:S_FAC}; }} ],
 2:[ {g:()=>{ let k,a,b; do{ k=ri(2,7); a=ri(1,8); b=ri(1,8); }while(AL.gcd(a,b)!==1||a===b); const src=`${k*a}x2-${k*b}x`, good=factSteps(src).res; return {q:`Factorise : ${show(src)}`, c:shuf(uniq(good,[`${k}(${a}<i>x</i>² − ${b}<i>x</i>)`.replace("(1<i>","(<i>"), `${k}<i>x</i>(${a}<i>x</i> − ${k*b})`.replace("(1<i>","(<i>"), `<i>x</i>(${k*a} − ${k*b})`])), rep:good, ex:factSteps(src).lines.slice(1).join(" = "), sx:S_FAC}; }} ],
 3:[ {g:()=>{ const opts=[["18x+12","6(3<i>x</i> + 2)",["3(6<i>x</i> + 4)","2(9<i>x</i> + 6)","6(3<i>x</i> + 12)"]],["20x-5x2","5<i>x</i>(4 − <i>x</i>)",["5(4<i>x</i> − <i>x</i>²)","<i>x</i>(20 − 5<i>x</i>)","5<i>x</i>(4 − 5<i>x</i>)"]],["10+30x","10(1 + 3<i>x</i>)",["5(2 + 6<i>x</i>)","10(3<i>x</i>)","10(3 + <i>x</i>)"]],["16x2-2","2(8<i>x</i>² − 1)",["2(8<i>x</i>²)","2<i>x</i>(8<i>x</i> − 1)","8(2<i>x</i>² − 1)"]]];
       const [src,good,bad]=pick(opts); return {q:`Quelle est la factorisation de ${show(src)} avec le plus grand facteur commun ?`, c:shuf([good,...bad]), rep:good, ex:factSteps(src).lines.slice(1).join(" = "), sx:S_FAC}; }},
     {q:"Factoriser une expression, c'est…", c:["transformer une somme en un produit","transformer un produit en une somme","supprimer les parenthèses"], rep:"transformer une somme en un produit", sx:S_FAC} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 3", duree:50, info:"Durée : 50 min · Calculatrice non autorisée · Stylo",
comp:[
  ["CALCULER","Je réduis une expression littérale, avec ou sans parenthèses.","Ex. 1 (4 points)"],
  ["CALCULER","Je développe et je réduis avec la simple distributivité.","Ex. 2 (5 points)"],
  ["CALCULER","Je factorise une expression littérale.","Ex. 3 (3 points)"],
  ["MODÉLISER","Je traduis un programme de calcul par une expression littérale.","Ex. 4 (questions a et b) (2 points)"],
  ["RAISONNER","Je prouve ou je réfute une affirmation.","Ex. 4 (questions c et d) et 5 (6 points)"]
],
exos:[
{t:"Réduire", p:4, h:`<p>Réduis les expressions suivantes.</p>${grid([E("A","7*x*3"),E("B","-4x*5x"),E("C","3x+8-5x+2"),E("D","6y*(-2x)"),E("E","-(4x-9)"),E("F","5x+(2-7x)"),E("G","2x2-x+6x2-3x"),E("H","9-(-3x+11)")])}`,
 c:`${grid([calc(["A = 7 × <i>x</i> × 3","A = 7 × 3 × <i>x</i>","A = 21<i>x</i>"]),calc(["B = −4<i>x</i> × 5<i>x</i>","B = (−4) × 5 × <i>x</i> × <i>x</i>","B = −20<i>x</i>²"]),calc(["C = 3<i>x</i> + 8 − 5<i>x</i> + 2","C = 3<i>x</i> − 5<i>x</i> + 8 + 2","C = −2<i>x</i> + 10"]),calc(["D = 6<i>y</i> × (−2<i>x</i>)","D = 6 × (−2) × <i>y</i> × <i>x</i>","D = −12<i>xy</i>"]),dv("E","-(4x-9)"),dv("F","5x+(2-7x)"),calc(["G = 2<i>x</i>² − <i>x</i> + 6<i>x</i>² − 3<i>x</i>","G = 2<i>x</i>² + 6<i>x</i>² − <i>x</i> − 3<i>x</i>","G = 8<i>x</i>² − 4<i>x</i>"]),calc(devLines("H","9-(-3x+11)",{sort:true}))])}<p><i>(0,5 point par expression)</i></p>`},
{t:"Développer et réduire", p:5, h:`<p>Développe et réduis les expressions suivantes.</p>${grid([E("A","-7(3x-2)"),E("B","4x(2x+5)"),E("C","(9-2x)*3x"),E("D","5x-4(x+6)"),E("E","3(2x-1)+2(x+7)")])}`,
 c:`${grid([dv("A","-7(3x-2)"),dv("B","4x(2x+5)"),dv("C","(9-2x)*3x"),dv("D","5x-4(x+6)"),dv("E","3(2x-1)+2(x+7)")])}<p><i>(1 point par expression)</i></p>`},
{t:"Factoriser", p:3, h:`<p>Factorise les expressions suivantes.</p>${grid([E("A","9x+15"),E("B","14x2-21x"),E("C","40+8x")])}`,
 c:`${grid([fc("A","9x+15"),fc("B","14x2-21x"),fc("C","40+8x")])}<p><i>(1 point par expression)</i></p>`},
{t:"Un programme de calcul", p:5, h:`${prog("Programme de calcul",["Choisir un nombre.","Soustraire 2.","Multiplier le résultat par 6.","Ajouter 12."])}<p>a) Calcule le résultat avec 5 comme nombre de départ.</p><p>b) Calcule le résultat avec −4 comme nombre de départ.</p><p>c) Que constates-tu ? Émets une conjecture.</p><p>d) Prouve ta conjecture.</p>`,
 c:`<div class="calcs"><p class="calc">a)<br>B = (5 − 2) × 6 + 12<br>B = 3 × 6 + 12<br>B = 18 + 12<br>B = 30</p><p class="calc">b)<br>C = (−4 − 2) × 6 + 12<br>C = (−6) × 6 + 12<br>C = −36 + 12<br>C = −24</p></div><p><i>(1 point pour a, 1 point pour b)</i></p><p>c) 30 = 6 × 5 et −24 = 6 × (−4) : il me semble que le programme multiplie le nombre de départ par 6. <i>(1 point)</i></p>
 <p>d) Je teste le programme avec <i>x</i> :</p>${dv("A","(x-2)*6+12")}<p>Le résultat est toujours 6<i>x</i> : la conjecture est vraie. <i>(2 points)</i></p>`},
{t:"Programmes égaux ?", p:3, h:`<div class="progs">${prog("Programme 1",["Choisir un nombre.","Multiplier par 4.","Ajouter 3.","Multiplier par 5."])}${prog("Programme 2",["Choisir un nombre.","Multiplier par 10.","Ajouter 5.","Multiplier par 2."])}</div><p>Est-ce que les deux programmes donnent toujours le même résultat ? Justifie.</p>`,
 c:`<p>Je teste avec 1 :</p><div class="calcs"><p class="calc">A = (1 × 4 + 3) × 5<br>A = 7 × 5<br>A = 35</p><p class="calc">B = (1 × 10 + 5) × 2<br>B = 15 × 2<br>B = 30</p></div><p>35 ≠ 30 : c'est un contre-exemple, les programmes ne donnent pas toujours le même résultat. <i>(1,5 point)</i></p>
 <div class="calcs">${dv("P<sub>1</sub>","(4x+3)*5")}${dv("P<sub>2</sub>","(10x+5)*2")}</div><p>20<i>x</i> + 15 et 20<i>x</i> + 10 diffèrent toujours de 5 : ils ne donnent jamais le même résultat. <i>(1,5 point)</i></p>`}
]}
};
/* on retire les choix faux sans intérêt (« 0x », « 0 ») */
CH["3e-3"].quiz.forEach(N=>Object.values(N.q).forEach(list=>list.forEach((it,i)=>{ if(it.g){ const g=it.g; list[i]={g:()=>{ const q=g(); if(q.c){ const L=q.c.map(c=>c===q.rep?c:c.replace(/(^|[^\d,])1(?=<i>)/g,"$1")).filter(c=>c===q.rep||!/^−?0(<i>|$)/.test(c)); q.c=L.filter((c,j)=>L.indexOf(c)===j); } return q; }}; } })));
/* Le bouton « Pas à pas » (data/plus.js) est inséré juste avant chaque calcul : dans une grille .calcs, il prenait une case
   à lui seul et décalait les calculs. On met donc chaque calcul de la grille dans sa propre case (<div>). */
const WRAPC=h=>typeof h!=="string"?h:h.replace(/(<div class="calcs"[^>]*>)([\s\S]*?)(<\/div>)/g,(m,a,b,c)=>a+b.replace(/<p class="calc">([\s\S]*?)<\/p>/g,'<div><p class="calc">$1</p></div>')+c);
{ const D=CH["3e-3"]; (D.cours||[]).forEach(c=>c.h=WRAPC(c.h)); (D.exos||[]).forEach(S=>S.e.forEach(e=>{ e.h=WRAPC(e.h); e.c=WRAPC(e.c); })); if(D.eval) D.eval.exos.forEach(e=>{ e.h=WRAPC(e.h); e.c=WRAPC(e.c); }); }
})();
