/* « Puissance 4 du calcul » (4e et 3e), d'après les grilles de M. Staal.
   La grille a 5 lignes et 6 colonnes : chaque case contient le calcul « nombre de la ligne (opération) nombre de la colonne ».
   On choisit une colonne, le jeton tombe dans la case libre la plus basse : il faut faire le calcul de CETTE case.
   Réponse juste : le jeton est posé. Réponse fausse : le jeton n'est pas posé et c'est au tour de l'autre joueur.
   Toutes les réponses attendues sont calculées par le code (nombres décimaux exacts, expressions littérales développées et réduites). */
window.PUISS4 = (function(){
/* ================= nombres et expressions littérales ================= */
const r9 = x => Math.round(x*1e9)/1e9;
const fmtN = x => String(r9(x)).replace(".",",").replace("-","−");
/* un monôme : {c: coefficient, v: {x:2, a:1}} ; un polynôme : liste de monômes réduite */
const mkey = v => Object.keys(v).filter(k=>v[k]).sort().map(k=>k+(v[k]>1?"^"+v[k]:"")).join("");
function norm(p){ const m=new Map(); p.forEach(t=>{ const k=mkey(t.v); const o=m.get(k); if(o) o.c=r9(o.c+t.c); else m.set(k,{c:r9(t.c), v:Object.fromEntries(Object.entries(t.v).filter(([,e])=>e))}); });
  return [...m.values()].filter(t=>Math.abs(t.c)>1e-12); }
const add = (p,q) => norm(p.concat(q));
const neg = p => p.map(t=>({c:-t.c, v:t.v}));
const mul = (p,q) => { const out=[]; p.forEach(a=>q.forEach(b=>{ const v={...a.v}; for(const k in b.v) v[k]=(v[k]||0)+b.v[k]; out.push({c:a.c*b.c, v}); })); return norm(out); };
const pw = (p,n) => { let r=[{c:1,v:{}}]; for(let i=0;i<n;i++) r=mul(r,p); return r; };
const same = (p,q) => { const a=norm(p), b=norm(q); if(a.length!==b.length) return false; const m=new Map(a.map(t=>[mkey(t.v),t.c])); return b.every(t=>m.has(mkey(t.v)) && Math.abs(m.get(mkey(t.v))-t.c)<1e-9); };
const deg = t => Object.values(t.v).reduce((s,e)=>s+e,0);
/* écriture habituelle : degré décroissant, puis ordre alphabétique */
function polyStr(p){
  const a=norm(p).sort((s,t)=>deg(t)-deg(s) || (mkey(s.v)<mkey(t.v)?-1:1)); if(!a.length) return "0";
  return a.map((t,i)=>{ const vs=Object.keys(t.v).sort().map(k=>k+(t.v[k]===2?"²":t.v[k]===3?"³":t.v[k]>3?"^"+t.v[k]:"")).join(""), c=Math.abs(t.c);
    const body=(vs && c===1) ? vs : fmtN(c).replace("−","")+vs; return (i===0 ? (t.c<0?"−":"") : (t.c<0?" − ":" + "))+body; }).join("");
}
/* lecture d'une écriture (énoncé ou réponse de l'élève) */
function tokens(s){
  s=String(s).replace(/[−–‐]/g,"-").replace(/[×·*]/g,"*").replace(/÷/g,"/").replace(/²/g,"^2").replace(/³/g,"^3").replace(/,/g,".").replace(/\s+/g,"").toLowerCase();
  const T=[]; let i=0;
  while(i<s.length){ const ch=s[i], m=/^\d+(?:\.\d+)?/.exec(s.slice(i));
    if(m){ if(T.length && T[T.length-1].k==="var" && s[i-1]!=="^") throw {fmt:"exp"}; T.push({k:"num", v:+m[0]}); i+=m[0].length; continue; }
    if(/[a-z]/.test(ch)){ T.push({k:"var", v:ch}); i++; continue; }
    if("+-*/^()".includes(ch)){ T.push({k:ch}); i++; continue; }
    throw {fmt:"car"};
  }
  return T;
}
function parse(s){
  const T=tokens(s); let p=0; const is=k=>T[p]&&T[p].k===k;
  if(!T.length) throw {fmt:"vide"};
  function expr(){ let a; if(is("-")){ p++; a=neg(term()); } else { if(is("+")) p++; a=term(); }
    while(is("+")||is("-")){ const o=T[p++].k, b=term(); a=add(a, o==="-"?neg(b):b); } return a; }
  function term(){ let a=fac(); for(;;){ if(is("*")){ p++; a=mul(a,fac()); } else if(is("var")||is("(")||is("num")&&T[p-1]&&T[p-1].k===")"){ a=mul(a,fac()); } else return a; } }
  function fac(){ let b=base(); while(is("^")){ p++; let sg=1; if(is("-")){ p++; sg=-1; } const t=T[p++]; if(!t||t.k!=="num"||sg<0||t.v%1) throw {fmt:"pow"}; b=pw(b,t.v); } return b; }
  function base(){ const t=T[p++]; if(!t) throw {fmt:"fin"};
    if(t.k==="num") return [{c:t.v, v:{}}];
    if(t.k==="var") return [{c:1, v:{[t.v]:1}}];
    if(t.k==="-") return neg(base());
    if(t.k==="("){ const e=expr(); if(!is(")")) throw {fmt:"par"}; p++; return e; }
    throw {fmt:"syn"}; }
  const e=expr(); if(p<T.length) throw {fmt:"syn"}; return e;
}
/* l'écriture est-elle développée et réduite ? (renvoie un message, ou "" si c'est bien réduit) */
function pasReduit(s){
  const t=String(s).replace(/[−–‐]/g,"-").replace(/²/g,"^2").replace(/³/g,"^3").replace(/,/g,".").replace(/\s+/g,"").toLowerCase();
  if(/[()]/.test(t)) return "il reste des parenthèses";
  if(/[*×·/]/.test(t)) return "il reste un signe ×";
  const terms=t.replace(/^\+/,"").split(/(?=[+-])/).map(x=>x.replace(/^[+-]/,""));
  const seen=new Set(); let k0=null;
  for(const x of terms){ const m=/^(\d+(?:\.\d+)?)?((?:[a-z](?:\^\d+)?)*)$/.exec(x); if(!m || x==="") return "l'écriture n'est pas terminée";
    if(m[1]!==undefined && m[2] && +m[1]===1) return "on n'écrit pas le 1 devant une lettre (on écrit x et pas 1x)";
    if(m[1]!==undefined && +m[1]===0 && terms.length>1) return "un terme vaut 0 : on ne l'écrit pas";
    const v={}; let r; const re=/([a-z])(?:\^(\d+))?/g; while((r=re.exec(m[2]))){ if(v[r[1]]) return `la lettre ${r[1]} apparaît deux fois dans un même terme (écris ${r[1]}²)`; if(r[2]==="1") return "on n'écrit pas l'exposant 1"; v[r[1]]=+(r[2]||1); }
    k0=mkey(v); if(seen.has(k0)) return k0 ? "il reste des termes semblables à regrouper" : "il reste plusieurs nombres à regrouper"; seen.add(k0); }
  return "";
}

/* ================= affichage des expressions ================= */
const sup = n => String(n).replace(/-/g,"−").replace(/^(.*)$/, "<sup>$1</sup>");
function pretty(s){   /* « - 3x + 8 » → « −3x + 8 », x^2 → x², × */
  let t=String(s).replace(/\s+/g,"").replace(/[−–]/g,"-").replace(/\*/g,"×");
  t=t.replace(/(?<=[0-9a-z)²³])([+-])/gi, (m,o)=>o==="+"?" + ":" − ").replace(/-/g,"−").replace(/×/g," × ");
  return t.replace(/\^(\d+)/g,(m,e)=>e==="2"?"²":e==="3"?"³":sup(e));
}
const multi = s => /[0-9a-z)²]\s*[+−-]/i.test(String(s).replace(/\s+/g,""));
const negatif = s => /^\s*[−-]/.test(String(s));
const parN = v => v<0 ? `(${fmtN(v)})` : fmtN(v);

/* ================= les grilles ================= */
const rnd = (a,b) => a+Math.floor(Math.random()*(b-a+1));
const pick = l => l[Math.floor(Math.random()*l.length)];
const shuf = l => { l=l.slice(); for(let i=l.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [l[i],l[j]]=[l[j],l[i]]; } return l; };
function distincts(n, f){ const out=[], seen=new Set(); let g=0; while(out.length<n && g++<500){ const x=f(); const k=String(x); if(!seen.has(k)){ seen.add(k); out.push(x); } } return out; }
const nz = (a,b) => { let v; do v=rnd(a,b); while(v===0); return v; };
/* écriture « ax + b » avec des nombres au hasard (dans un ordre ou dans l'autre) */
function affine(L, a, b, swap){ const lt = a===0 ? "" : (a===1?"":a===-1?"-":String(a))+L; if(!lt) return String(b);
  if(b===0) return lt; return swap ? `${b} ${a<0?"-":"+"} ${lt.replace(/^-/,"")}` : `${lt} ${b<0?"-":"+"} ${Math.abs(b)}`; }
const mono = (c, L) => (c===1?"":c===-1?"-":String(c))+L;

/* type : num (nombres) · pow (puissance a^n) · lit (expressions littérales) · p10 (puissances de 10, réponse 10^n) */
const G4 = [
 {titre:"Additions de relatifs", type:"num", op:"+", staal:true,
  rows:[-2,17,-11,-9,4], cols:[-5,12,9,-14,-2,7],
  gen:()=>({rows:distincts(5,()=>nz(-20,20)), cols:distincts(6,()=>nz(-20,20))}),
  aide:"Deux nombres de même signe : on additionne leurs distances à zéro et on garde le signe. Deux nombres de signes contraires : on soustrait les distances à zéro et on prend le signe de celui qui a la plus grande distance à zéro."},
 {titre:"Soustractions de relatifs", type:"num", op:"−",
  gen:()=>({rows:distincts(5,()=>nz(-15,15)), cols:distincts(6,()=>nz(-15,15))}),
  aide:"Soustraire un nombre, c'est ajouter son opposé : 4 − (−7) = 4 + 7 = 11 et −3 − 5 = −3 + (−5) = −8."},
 {titre:"Additions de décimaux relatifs", type:"num", op:"+", staal:true,
  rows:[3.6,-17,1.2,-4,30], cols:[-3,7.5,-2.7,-6,21,4],
  gen:()=>({rows:distincts(5,()=>nz(-90,90)/10), cols:distincts(6,()=>nz(-90,90)/10)}),
  aide:"Même règle que pour les entiers. Aligne bien les virgules : 3,6 + (−2,7) = 0,9."},
 {titre:"Multiplications de relatifs", type:"num", op:"×", staal:true,
  rows:[-7,-3,9,-6,4], cols:[-3,7,-5,8,-1,2],
  gen:()=>({rows:distincts(5,()=>nz(-10,10)), cols:distincts(6,()=>nz(-10,10))}),
  aide:"Règle des signes : deux nombres de même signe donnent un produit positif, deux nombres de signes contraires donnent un produit négatif."},
 {titre:"Puissances", type:"pow",
  rows:[2,-2,3,-1,10], cols:[0,1,2,3,4,5],
  gen:()=>({rows:shuf([2,-2,3,-3,-1,10,5]).slice(0,5), cols:[0,1,2,3,4,5]}),
  aide:"aⁿ = a × a × … × a (n facteurs). a¹ = a et a⁰ = 1. Avec un nombre négatif : si l'exposant est pair, le résultat est positif ; s'il est impair, il est négatif. 10ⁿ s'écrit avec un 1 suivi de n zéros."},
 {titre:"Réduire une somme", type:"lit", op:"+", staal:true,
  rows:["3x - 7","-10","- 3x + 8","5 - x","2x"], cols:["4","x + 5","3 - x","- 4x - 8","7","5x"],
  gen:()=>{ const e=()=>pick([()=>affine("x",nz(-9,9),nz(-9,9),Math.random()<.3), ()=>String(nz(-12,12)), ()=>mono(nz(-9,9),"x")])(); return {rows:distincts(5,e), cols:distincts(6,e)}; },
  aide:"On regroupe les termes en x entre eux, et les nombres entre eux : (3x − 7) + (x + 5) = 3x + x − 7 + 5 = 4x − 2. Une parenthèse précédée de + se supprime sans rien changer."},
 {titre:"Réduire un produit", type:"lit", op:"×", staal:true,
  rows:["- 7x","- 3a","6","-8","2x"], cols:["4","- 3x","-6","4a","y","5x"],
  gen:()=>{ const e=()=>Math.random()<.3 ? String(nz(-9,9)) : mono(nz(-9,9), pick(["x","x","a","y"])); return {rows:distincts(5,e), cols:distincts(6,e)}; },
  aide:"On multiplie les nombres entre eux (règle des signes !) et les lettres entre elles : −7x × (−3x) = 21x² et −3a × y = −3ay."},
 {titre:"Défi : développer", type:"lit", op:"×", defi:true,
  gen:()=>({rows:distincts(5,()=>affine("x",nz(-6,6),nz(-9,9),Math.random()<.3)), cols:distincts(6,()=>Math.random()<.5?String(nz(-7,7)):mono(nz(-5,5),"x"))}),
  aide:"Simple distributivité : k × (a + b) = k × a + k × b. Exemple : (2x − 5) × (−3) = −6x + 15. Attention aux signes !"}
];
const G3 = [
 {titre:"Développer n°1", type:"lit", op:"×", staal:true,
  rows:["- 3x + 8","6x + 7","3y - 7","5 - x","x + 4"], cols:["4","5x","8y","- 2x","7a","-3"],
  gen:()=>({rows:distincts(5,()=>affine(pick(["x","x","y"]),nz(-6,6),nz(-9,9),Math.random()<.3)), cols:distincts(6,()=>Math.random()<.4?String(nz(-9,9)):mono(nz(-8,8),pick(["x","x","y","a"])))}),
  aide:"Simple distributivité : (a + b) × k = a × k + b × k. Exemple : (5 − x) × 7a = 35a − 7ax."},
 {titre:"Développer n°2", type:"lit", op:"×", staal:true,
  rows:["- 3x + a - 8","6x - y + 7","3a - 7","3x - 4y","2x + 3"], cols:["4","-5x","-3","- 2y","-7","8a"],
  gen:()=>({rows:distincts(5,()=>Math.random()<.5 ? `${mono(nz(-6,6),"x")} ${pick(["+","-"])} ${mono(rnd(1,5),pick(["a","y"]))} ${pick(["+","-"])} ${rnd(1,9)}` : affine("x",nz(-6,6),nz(-9,9))), cols:distincts(6,()=>Math.random()<.4?String(nz(-9,9)):mono(nz(-8,8),pick(["x","y","a"])))}),
  aide:"Chaque terme de la parenthèse est multiplié par le facteur : (6x − y + 7) × (−3) = −18x + 3y − 21."},
 {titre:"Double distributivité", type:"lit", op:"dd",
  gen:()=>{ const e=()=>affine("x",pick([1,1,2,3,-1,-2]),nz(-7,7),Math.random()<.2); return {rows:distincts(5,e), cols:distincts(6,e)}; },
  aide:"(a + b)(c + d) = ac + ad + bc + bd. Exemple : (x + 3)(2x − 1) = 2x² − x + 6x − 3 = 2x² + 5x − 3. N'oublie pas de réduire à la fin !"},
 {titre:"Puissances de 10 : produits", type:"p10", op:"×",
  rows:[3,-2,5,-4,1], cols:[2,-3,4,-1,6,-5],
  gen:()=>({rows:distincts(5,()=>nz(-6,7)), cols:distincts(6,()=>nz(-6,7))}),
  aide:"10ᵃ × 10ᵇ = 10ᵃ⁺ᵇ : on additionne les exposants. Exemple : 10³ × 10⁻⁵ = 10³⁺⁽⁻⁵⁾ = 10⁻²."},
 {titre:"Puissances de 10 : quotients", type:"p10", op:"÷",
  gen:()=>({rows:distincts(5,()=>nz(-6,7)), cols:distincts(6,()=>nz(-6,7))}),
  aide:"10ᵃ ÷ 10ᵇ = 10ᵃ⁻ᵇ : on soustrait les exposants. Exemple : 10² ÷ 10⁻³ = 10²⁻⁽⁻³⁾ = 10⁵."},
 {titre:"Défi : double distributivité", type:"lit", op:"dd", defi:true,
  gen:()=>{ const e=()=>affine(pick(["x","x","a"]),nz(-5,5),nz(-9,9),Math.random()<.4); return {rows:distincts(5,e), cols:distincts(6,()=>affine("x",nz(-5,5),nz(-9,9),Math.random()<.4))}; },
  aide:"Développe terme à terme, puis regroupe les termes semblables. Exemple : (3 − 2x)(x + 4) = 3x + 12 − 2x² − 8x = −2x² − 5x + 12."}
];
/* 6e : calcul sur les entiers et les décimaux positifs (programme de 6e) */
const dec = (a,b,k) => r9(rnd(a*10**k, b*10**k)/10**k);           /* décimal entre a et b, k chiffres après la virgule */
const P10 = [10,100,1000,10,100,1000], P01 = [0.1,0.01,0.001,0.1,0.01,0.001];
const G6 = [
 {titre:"Tables de multiplication", type:"num", op:"×", gen:()=>({rows:distincts(5,()=>rnd(2,10)), cols:distincts(6,()=>rnd(2,10))}),
  err:(A,B,v)=>[v+A, v-B, A+B], aide:"Récite la table : 7 × 8, c'est 8 fois 7. Si tu hésites, pars d'un résultat que tu connais : 7 × 8 = 7 × 10 − 7 × 2 = 70 − 14 = 56."},
 {titre:"Multiplier par 10, 100, 1 000", type:"num", op:"×", gen:()=>({rows:distincts(5,()=>pick([dec(0.1,9.9,1),dec(1,99,2),dec(10,99,1),rnd(2,99)])), cols:shuf(P10)}),
  err:(A,B,v)=>[r9(v/10), r9(v*10)], aide:"Multiplier par 10, 100 ou 1 000, c'est rendre le nombre 10, 100 ou 1 000 fois plus grand : chaque chiffre avance de 1, 2 ou 3 rangs vers la gauche. 3,45 × 100 = 345."},
 {titre:"Diviser par 10, 100, 1 000", type:"num", op:"÷", gen:()=>({rows:distincts(5,()=>pick([dec(1,99,1),rnd(2,999),dec(10,99,2)])), cols:shuf(P10)}),
  err:(A,B,v)=>[r9(v*10), r9(v/10)], aide:"Diviser par 10, 100 ou 1 000, c'est rendre le nombre 10, 100 ou 1 000 fois plus petit : chaque chiffre recule de 1, 2 ou 3 rangs vers la droite. 47 ÷ 100 = 0,47."},
 {titre:"Additions de décimaux", type:"num", op:"+", gen:()=>({rows:distincts(5,()=>dec(0.1,30,pick([1,2]))), cols:distincts(6,()=>dec(0.1,20,pick([1,2])))}),
  err:(A,B,v)=>[r9(v+1), r9(v-0.1), r9(v+0.1)], aide:"Pose l'addition dans ta tête en alignant les virgules : les unités avec les unités, les dixièmes avec les dixièmes. 3,7 + 2,45 = 6,15."},
 {titre:"Soustractions de décimaux", type:"num", op:"−", gen:()=>({rows:distincts(5,()=>dec(20,60,1)), cols:distincts(6,()=>dec(0.1,19.9,pick([1,2])))}),
  err:(A,B,v)=>[r9(v+1), r9(v-1), r9(v+0.1)], aide:"Aligne les virgules, et complète par des zéros si besoin : 25,3 − 7,45 = 25,30 − 7,45 = 17,85."},
 {titre:"Multiplier par 0,1 ; 0,01 ; 0,001", type:"num", op:"×", gen:()=>({rows:distincts(5,()=>pick([rnd(2,999),dec(1,99,1)])), cols:shuf(P01)}),
  err:(A,B,v)=>[r9(v*10), r9(v/10), r9(A/B)], aide:"Multiplier par 0,1, c'est diviser par 10 ; par 0,01, c'est diviser par 100 ; par 0,001, c'est diviser par 1 000. 52 × 0,01 = 0,52."},
 {titre:"Défi : multiplications de décimaux", type:"num", op:"×", defi:true, gen:()=>({rows:distincts(5,()=>pick([dec(0.1,0.9,1),dec(1,9.9,1),rnd(2,12)])), cols:distincts(6,()=>pick([dec(0.1,0.9,1),rnd(2,9),dec(1,5,1)]))}),
  err:(A,B,v)=>[r9(v*10), r9(v/10)], aide:"Calcule sans les virgules, puis place la virgule : il y a autant de chiffres après la virgule dans le résultat que dans les deux nombres réunis. 0,3 × 1,2 : 3 × 12 = 36, donc 0,36."}
];
/* 5e : addition et soustraction des nombres relatifs (programme de 5e) */
const AIDE_ADD="Deux nombres de même signe : on additionne leurs distances à zéro et on garde le signe. Deux nombres de signes contraires : on soustrait les distances à zéro et on prend le signe de celui qui a la plus grande distance à zéro.";
const AIDE_SUB="Soustraire un nombre, c'est ajouter son opposé : 4 − (−7) = 4 + 7 = 11 et −3 − 5 = −3 + (−5) = −8.";
const G5 = [
 {titre:"Additions de relatifs", type:"num", op:"+", gen:()=>({rows:distincts(5,()=>nz(-10,10)), cols:distincts(6,()=>nz(-10,10))}), aide:AIDE_ADD},
 {titre:"Additions de relatifs (plus grands)", type:"num", op:"+", gen:()=>({rows:distincts(5,()=>nz(-25,25)), cols:distincts(6,()=>nz(-25,25))}), aide:AIDE_ADD},
 {titre:"Soustractions de relatifs", type:"num", op:"−", gen:()=>({rows:distincts(5,()=>nz(-10,10)), cols:distincts(6,()=>nz(-10,10))}), aide:AIDE_SUB},
 {titre:"Soustractions de relatifs (plus grands)", type:"num", op:"−", gen:()=>({rows:distincts(5,()=>nz(-25,25)), cols:distincts(6,()=>nz(-25,25))}), aide:AIDE_SUB},
 {titre:"Additions et soustractions", type:"num", op:"mix", gen:()=>({rows:distincts(5,()=>nz(-15,15)), cols:distincts(6,()=>nz(-15,15))}), aide:"Regarde bien le signe de l'opération dans la case. Pour une soustraction, ajoute l'opposé : −6 − (−9) = −6 + 9 = 3."},
 {titre:"Décimaux relatifs", type:"num", op:"+", gen:()=>({rows:distincts(5,()=>nz(-90,90)/10), cols:distincts(6,()=>nz(-90,90)/10)}), aide:"Même règle que pour les entiers. Aligne bien les virgules : 3,6 + (−2,7) = 0,9."},
 {titre:"Défi : décimaux, additions et soustractions", type:"num", op:"mix", defi:true, gen:()=>({rows:distincts(5,()=>nz(-90,90)/10), cols:distincts(6,()=>nz(-90,90)/10)}), aide:"Repère d'abord l'opération. Soustraire un nombre, c'est ajouter son opposé : 2,5 − (−4,1) = 2,5 + 4,1 = 6,6."}
];
const PACKS = {"6e":{key:"staal-puiss4-6e-", grilles:G6}, "5e":{key:"staal-puiss4-5e-", grilles:G5}, "4e":{key:"staal-puiss4-4e-", grilles:G4}, "3e":{key:"staal-puiss4-3e-", grilles:G3}};

/* ================= une case : énoncé, réponse ================= */
function cellule(G, r, c){
  const A=G.rows[r], B=G.cols[c];
  if(G.type==="num"){ const op = G.op==="mix" ? ((r+c)%2 ? "−" : "+") : G.op, v = op==="+" ? A+B : op==="−" ? A-B : op==="÷" ? A/B : A*B;
    return {q:`${fmtN(A)} ${op} ${parN(B)}`, v:r9(v), aff:fmtN(v)}; }
  if(G.type==="pow"){ const v=Math.pow(A,B); return {q:`${A<0?`(${fmtN(A)})`:fmtN(A)}${sup(B)}`, v, aff:fmtN(v)}; }
  if(G.type==="p10"){ const e = G.op==="×" ? A+B : A-B;
    return {q: G.op==="×" ? `10${sup(A)} × 10${sup(B)}` : `<span class="fr"><span>10${sup(A)}</span><span>10${sup(B)}</span></span>`, e, aff:`10${sup(e)}`}; }
  /* expressions littérales */
  const pa=parse(A), pb=parse(B), wr=s=>multi(s)?`(${pretty(s)})`:pretty(s), wn=s=>multi(s)||negatif(s)?`(${pretty(s)})`:pretty(s);
  const p = G.op==="+" ? add(pa,pb) : mul(pa,pb);
  const q = G.op==="+" ? `${wr(A)} + ${wn(B)}` : G.op==="dd" ? `${wr(A)}${wr(B)}` : `${wr(A)} × ${wn(B)}`;
  return {q, p, aff:polyStr(p)};
}
const lettres = G => [...new Set((G.rows.concat(G.cols)).join(" ").replace(/[^a-z]/g,"").split(""))].sort();
const entete = (G, v, col) => G.type==="p10" ? `10${sup(v)}` : G.type==="lit" ? pretty(v) : (G.type==="pow" && col) ? `n = ${v}` : fmtN(v);
/* vérification d'une réponse : {ok, msg} ; format:true = écriture à corriger (le tour n'est pas perdu) */
function verifie(G, C, s){
  s=String(s||"").trim(); if(!s) return {format:true, msg:"Écris ta réponse."};
  if(G.type==="p10"){ if(!/^[+\-−]?\d+$/.test(s)) return {format:true, msg:"Écris seulement l'exposant : un nombre entier."}; return {ok:+s.replace("−","-")===C.e}; }
  if(G.type==="num"||G.type==="pow"){ const t=s.replace(/[−–]/g,"-").replace(",",".").replace(/\s+/g,""); if(!/^[+-]?\d+(\.\d+)?$/.test(t)) return {format:true, msg:"Écris un seul nombre, sans calcul (par exemple −12 ou 3,5)."}; return {ok:Math.abs(+t-C.v)<1e-9}; }
  let p; try{ p=parse(s); }catch(e){ return {format:true, msg: e.fmt==="exp" ? "Pour écrire x², utilise la touche ² (ou x^2)." : "Je n'arrive pas à lire ton écriture : vérifie les signes et les parenthèses."}; }
  if(!same(p, C.p)) return {ok:false};
  const pr=pasReduit(s); if(pr) return {format:true, msg:`C'est bien égal, mais l'écriture n'est pas réduite : ${pr}. Corrige-la.`};
  return {ok:true};
}
/* une erreur « classique » pour l'ordinateur */
function erreur(G, C, r, c){
  if(G.type==="p10") return String(G.op==="×" ? (G.rows[r]*G.cols[c]!==C.e ? G.rows[r]*G.cols[c] : C.e+1) : (G.rows[r]+G.cols[c]!==C.e ? G.rows[r]+G.cols[c] : C.e-1)).replace("-","−");
  if(G.type==="num" && G.err){ const w=G.err(G.rows[r], G.cols[c], C.v).map(r9).find(x=>x!==C.v && x>=0); return fmtN(w===undefined ? C.v+1 : w); }
  if(G.type==="num"){ const A=G.rows[r], B=G.cols[c], op = G.op==="mix" ? ((r+c)%2 ? "−" : "+") : G.op; const l = op==="+" ? [A-B, -C.v] : op==="−" ? [A+B, -C.v] : [-C.v, A+B]; const w=l.find(x=>r9(x)!==C.v); return fmtN(w===undefined?C.v+1:w); }
  if(G.type==="pow"){ const A=G.rows[r], B=G.cols[c]; const l=[A*B, -C.v, B===0?0:C.v*A]; const w=l.find(x=>r9(x)!==C.v); return fmtN(w===undefined?C.v+1:w); }
  const t=norm(C.p); if(!t.length) return "1";
  const k=Math.floor(Math.random()*t.length); const f=t.map((x,i)=>i===k?{c:-x.c, v:x.v}:x); return polyStr(f);
}

/* ================= partie ================= */
const ROWS=5, COLS=6;
let R0=null, PK=null, P=null, cur=0, G=null, B=null, tour=1, mode="ordi", fini=false, choix=null, hist=[], score=null, timers=[], done=[], busy=false;
const store = { get(k){ try{ return localStorage.getItem(P.key+k); }catch(e){ return null; } }, set(k,v){ try{ localStorage.setItem(P.key+k,v); }catch(e){} } };
const $ = id => R0.querySelector("#"+id);
const later = (f,ms) => { const t=setTimeout(()=>{ timers=timers.filter(x=>x!==t); if(R0 && R0.isConnected) f(); }, ms); timers.push(t); };
const clearT = () => { timers.forEach(clearTimeout); timers=[]; };
const nom = j => mode==="ordi" ? (j===1?"Toi":"L'ordinateur") : `Joueur ${j}`;
const coarse = () => { try{ return matchMedia("(pointer: coarse)").matches; }catch(e){ return false; } };

function style(){
  if(document.getElementById("p4-style")) return;
  const s=document.createElement("style"); s.id="p4-style"; s.textContent=`
.p4{--j1:#d62828;--j2:#f2b705;--plateau:#1d4ed8}
.p4 .llevels{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px}
.p4 .lnum{width:44px;height:44px;border-radius:12px;border:2px solid var(--line);background:var(--surface);font:inherit;font-weight:700;font-size:16px;cursor:pointer;color:var(--ink)}
.p4 .lnum.ok{background:var(--okbg);border-color:var(--ok);color:var(--ok)}
.p4 .lnum.defi{border-color:#f0a43a}
.p4 .lnum.on{border-color:var(--c);box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 35%,transparent)}
.p4 .pmodes{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 14px}
.p4 .pmode.on{background:var(--ink);color:var(--paper)}
.p4 .pgrid{display:grid;grid-template-columns:minmax(0,1fr) 370px;gap:22px;align-items:start}
.p4 h2{font-family:var(--f-display);font-size:1.2rem;margin:0 0 4px}
.p4 .psub{color:var(--muted);margin:0 0 10px;font-size:15px}
.p4 .pboard{display:grid;grid-template-columns:minmax(64px,auto) repeat(6,minmax(0,1fr));gap:6px;background:var(--plateau);padding:10px;border-radius:18px;max-width:540px;color-scheme:light}
.p4 .ph{display:flex;align-items:center;justify-content:center;text-align:center;background:#fff;color:#14213d;border-radius:8px;font:700 15px Arial,Helvetica,sans-serif;padding:4px 6px;min-height:36px;line-height:1.2}
.p4 .ph.op{background:#fde68a;font-size:22px}
.p4 .ph sup{font-size:.7em}
.p4 .pc{aspect-ratio:1;border:0;border-radius:50%;background:#eaf0fb;cursor:pointer;padding:0;display:grid;place-items:center;font:800 15px Arial,Helvetica,sans-serif;position:relative;transition:transform .1s}
.p4 .pc:disabled{cursor:default}
.p4 .pc.colhov{background:#c9d8f5}
.p4 .pc.cible{outline:4px solid #fff;outline-offset:-2px;background:#bcd0f7;animation:p4pulse 1s infinite}
@keyframes p4pulse{50%{outline-color:#93c5fd}}
.p4 .pc.j1{background:var(--j1);color:#fff;box-shadow:inset 0 -4px 0 rgba(0,0,0,.22)}
.p4 .pc.j2{background:var(--j2);color:#3b2a00;box-shadow:inset 0 -4px 0 rgba(0,0,0,.18)}
.p4 .pc.win{outline:4px solid #22c55e;outline-offset:-1px}
.p4 .pc.drop{animation:p4drop .35s ease-out}
@keyframes p4drop{from{transform:translateY(-120%)}to{transform:none}}
@media (prefers-reduced-motion:reduce){ .p4 .pc.drop,.p4 .pc.cible{animation:none} }
.p4 .ptour{display:flex;gap:8px;margin:0 0 12px}
.p4 .ptour span{flex:1;display:flex;align-items:center;gap:8px;justify-content:center;padding:8px;border-radius:12px;border:2px solid var(--line);font-weight:700;color:var(--muted)}
.p4 .ptour i{width:18px;height:18px;border-radius:50%;display:inline-block;flex:none}
.p4 .ptour span.on{color:var(--ink);border-color:var(--ink);background:var(--surface)}
.p4 .pside{border:2px solid var(--line);border-radius:16px;padding:14px 16px;background:var(--surface)}
.p4 .pq{font:700 26px Arial,Helvetica,sans-serif;margin:6px 0 10px;line-height:1.5;color:var(--ink);overflow-wrap:anywhere}
.p4 .pq .fr{font-size:1em}
.p4 .pq sup{font-size:.62em}
.p4 .prow{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.p4 .pin{flex:1 1 160px;min-width:0;font:700 24px Arial,Helvetica,sans-serif;padding:8px 12px;border:2px solid var(--line);border-radius:12px;background:#fff;color:#14213d;color-scheme:light}
.p4 .pin.p10{flex:0 0 90px}
.p4 .pbase{font:700 26px Arial,Helvetica,sans-serif}
.p4 .pkeys{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px;margin:10px 0}
.p4 .pkey{height:46px;border-radius:10px;border:2px solid var(--line);background:var(--paper);color:var(--ink);font:700 20px Arial,Helvetica,sans-serif;cursor:pointer;padding:0}
.p4 .pkeys.k4{grid-template-columns:repeat(4,minmax(0,1fr));max-width:280px}
.p4 .pkey.ok{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.p4 .lmsg{border-radius:12px;padding:12px 14px;margin:10px 0;line-height:1.6;background:color-mix(in srgb,var(--c) 10%,var(--surface));color:var(--ink)}
.p4 .lmsg.ok{background:var(--okbg)} .p4 .lmsg.ko{background:var(--kobg)}
.p4 .lmsg .btn{margin:10px 8px 0 0}
.p4 .phist{margin:10px 0 0;padding:0;list-style:none;font-size:15px}
.p4 .phist li{display:flex;gap:8px;align-items:baseline;padding:4px 0;border-top:1px dashed var(--line)}
.p4 .phist b{min-width:1.2em}
.p4 .phist .v{color:var(--ok)} .p4 .phist .x{color:var(--ko)}
.p4 .phist sup{font-size:.7em}
.p4 .phist .fr{font-size:.9em}
.p4 .pscore{color:var(--muted);font-size:15px;margin:8px 0 0}
.p4 details.lhelp{margin-top:12px}
.p4 .pbtns{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 0}
.p4 .pthink span{animation:p4pt 1s infinite} .p4 .pthink span:nth-child(2){animation-delay:.2s} .p4 .pthink span:nth-child(3){animation-delay:.4s}
@keyframes p4pt{0%,100%{opacity:.2}50%{opacity:1}}
@media (max-width:900px){ .p4 .pgrid{grid-template-columns:minmax(0,1fr)} }
@media (max-width:480px){ .p4 .pboard{gap:4px;padding:6px;grid-template-columns:minmax(58px,auto) repeat(6,minmax(0,1fr))} .p4 .ph{font-size:12.5px;padding:2px 3px;min-height:30px} .p4 .pc{font-size:12px} .p4 .pq{font-size:22px} }
`; document.head.appendChild(s);
}
function init(root, pack){
  clearT(); style(); R0=root; PK=PACKS[pack]?pack:"4e"; P=PACKS[PK];
  try{ done=JSON.parse(store.get("done")||"[]"); }catch(e){ done=[]; }
  mode=store.get("mode")==="2j"?"2j":"ordi";
  root.innerHTML=`<div class="p4">
    <div class="llevels" id="plevels"></div>
    <div class="pmodes" role="group" aria-label="Mode de jeu"><button class="btn pmode" data-m="ordi">Contre l'ordinateur</button><button class="btn pmode" data-m="2j">À deux joueurs</button></div>
    <div class="pgrid">
      <div><h2 id="ptitre"></h2><p class="psub" id="psub"></p><div class="pboard" id="pboard" role="grid" aria-label="Grille du Puissance 4"></div>
        <div class="pbtns"><button class="btn" id="prejouer">Rejouer cette grille</button><button class="btn" id="pnew">Nouvelle grille au hasard</button></div></div>
      <aside class="pside">
        <div class="ptour" id="ptour"></div>
        <div id="ppanel"></div>
        <div class="lmsg" id="pmsg" hidden></div>
        <p class="pscore" id="pscore"></p>
        <ul class="phist" id="phist"></ul>
        <details class="lhelp"><summary>Besoin d'aide ?</summary><p id="paide"></p><p><b>Les règles :</b> choisis une colonne : ton jeton tombe dans la case libre la plus basse. Fais le calcul de cette case. Si ta réponse est juste, ton jeton est posé ; sinon, il n'est pas posé. Le premier qui aligne 4 jetons (en ligne, en colonne ou en diagonale) a gagné.</p></details>
      </aside>
    </div></div>`;
  R0.querySelectorAll(".pmode").forEach(b=>b.onclick=()=>{ mode=b.dataset.m; store.set("mode",mode); nouvelle(false); });
  $("prejouer").onclick=()=>nouvelle(false);
  $("pnew").onclick=()=>nouvelle(true);
  let st=+(store.get("niveau")||0); if(!(st>=0&&st<P.grilles.length)) st=0;
  charge(st);
}
function levels(){
  $("plevels").innerHTML=P.grilles.map((g,i)=>`<button class="lnum${i===cur?" on":""}${done.includes(i)?" ok":""}${g.defi?" defi":""}" data-i="${i}" aria-label="Grille ${i+1} : ${g.titre}${done.includes(i)?" (réussie)":""}" title="${g.titre}">${i+1}</button>`).join("");
  R0.querySelectorAll("#plevels .lnum").forEach(b=>b.onclick=()=>charge(+b.dataset.i));
}
function charge(i){ cur=i; store.set("niveau",i); levels(); nouvelle(!P.grilles[i].rows); }
function nouvelle(hasard){
  clearT(); const D=P.grilles[cur];
  const h = hasard ? D.gen() : (D.rows ? {rows:D.rows, cols:D.cols} : (G && G.titre===D.titre ? {rows:G.rows, cols:G.cols} : D.gen()));
  G=Object.assign({}, D, h);
  B=[...Array(ROWS)].map(()=>Array(COLS).fill(0)); tour=1; fini=false; choix=null; hist=[]; score={1:[0,0],2:[0,0]}; busy=false;
  R0.querySelectorAll(".pmode").forEach(b=>b.classList.toggle("on", b.dataset.m===mode));
  $("ptitre").textContent=`Grille ${cur+1}${D.defi?" · Défi":""} · ${D.titre.replace(/^Défi : /,"")}`;
  $("psub").textContent = (D.staal && !hasard && D.rows ? "La grille de M. Staal. " : "Une grille tirée au hasard. ") + (G.type==="lit" ? "Écris chaque résultat développé et réduit." : G.type==="p10" ? "Écris chaque résultat sous la forme d'une puissance de 10." : "");
  $("paide").textContent=D.aide;
  plateau(); msg(""); hist_(); demande();
}
function libre(c){ for(let r=ROWS-1;r>=0;r--) if(!B[r][c]) return r; return -1; }
function plateau(){
  const corner = G.type==="pow" ? "aⁿ" : G.op==="dd" ? "×" : G.op;
  let h="";
  for(let r=0;r<ROWS;r++){ h+=`<div class="ph" role="rowheader">${entete(G,G.rows[r])}</div>`;
    for(let c=0;c<COLS;c++){ const v=B[r][c]; h+=`<button class="pc${v?" j"+v:""}" data-r="${r}" data-c="${c}" aria-label="Colonne ${c+1}, ligne ${r+1}${v?(v===1?" : jeton rouge":" : jeton jaune"):""}">${v?v:""}</button>`; } }
  h+=`<div class="ph op" aria-hidden="true">${corner}</div>`+G.cols.map(v=>`<div class="ph" role="columnheader">${entete(G,v,true)}</div>`).join("");
  $("pboard").innerHTML=h;
  R0.querySelectorAll(".pc").forEach(b=>{ const c=+b.dataset.c;
    b.onclick=()=>colonne(c);
    b.onmouseenter=()=>R0.querySelectorAll(`.pc[data-c="${c}"]`).forEach(x=>x.classList.add("colhov"));
    b.onmouseleave=()=>R0.querySelectorAll(".pc.colhov").forEach(x=>x.classList.remove("colhov")); });
  marque();
}
function marque(){
  R0.querySelectorAll(".pc").forEach(b=>{ const r=+b.dataset.r, c=+b.dataset.c; b.classList.toggle("cible", !!choix && choix.r===r && choix.c===c); b.disabled = fini || busy || (mode==="ordi" && tour===2) || libre(c)<0; });
  const col=j=>j===1?"var(--j1)":"var(--j2)";
  $("ptour").innerHTML=[1,2].map(j=>`<span class="${tour===j&&!fini?"on":""}"><i style="background:${col(j)}"></i>${nom(j)}</span>`).join("");
  $("pscore").textContent = [1,2].map(j=>`${nom(j)} : ${score[j][0]} calcul${score[j][0]>1?"s":""} juste${score[j][0]>1?"s":""} sur ${score[j][1]}`).join(" · ");
}
function demande(){
  marque();
  const pn=$("ppanel");
  if(fini){ pn.innerHTML=""; return; }
  if(mode==="ordi" && tour===2){ pn.innerHTML=`<p class="pthink"><b>L'ordinateur réfléchit</b><span>.</span><span>.</span><span>.</span></p>`; later(ordi, 900); return; }
  if(!choix){ pn.innerHTML=`<p><b>${mode==="ordi"?"À toi de jouer":`${nom(tour)}, à toi de jouer`} :</b> clique sur une colonne de la grille.</p>`; return; }
  const C=cellule(G, choix.r, choix.c), lt=lettres(G);
  const L3=lt.slice(0,3); while(L3.length<3) L3.push("");
  const keys = G.type==="lit" ? ["7","8","9",...L3,"4","5","6","²","+","−","1","2","3","0",",","⌫"]
    : ["7","8","9","⌫","4","5","6","−","1","2","3",G.type==="p10"?"":",","0"];
  pn.innerHTML=`<p><b>Calcule :</b></p><p class="pq" id="pq">${C.q} =</p>
    <form class="prow" id="pform" autocomplete="off">${G.type==="p10"?`<span class="pbase">10</span><input class="pin p10" id="pin" aria-label="Exposant de 10" ${coarse()?'inputmode="none"':'inputmode="text"'}>`:`<input class="pin" id="pin" aria-label="Ta réponse" ${coarse()?'inputmode="none"':'inputmode="text"'}>`}<button class="btn primary" type="submit">Valider</button></form>
    <div class="pkeys${G.type==="lit"?"":" k4"}" id="pkeys">${keys.map(k=>k===""?`<span></span>`:`<button type="button" class="pkey" data-k="${k}" aria-label="${k==="⌫"?"Effacer":k==="−"?"moins":k}">${k}</button>`).join("")}</div>
    ${G.type==="lit"?`<p class="where">Exemple d'écriture : 6x² − 16x + 3</p>`:G.type==="p10"?`<p class="where">Écris l'exposant (il peut être négatif).</p>`:""}`;
  const inp=$("pin"); if(!coarse()) inp.focus({preventScroll:true});
  R0.querySelectorAll(".pkey").forEach(b=>b.onclick=()=>{ const k=b.dataset.k; if(k==="⌫") inp.value=inp.value.slice(0,-1); else inp.value+=k; if(!coarse()) inp.focus({preventScroll:true}); });
  $("pform").onsubmit=e=>{ e.preventDefault(); repond(inp.value); };
  if(window.innerWidth<900){ const r=$("ppanel").getBoundingClientRect(); if(r.bottom>innerHeight) $("ppanel").scrollIntoView({block:"nearest", behavior:"smooth"}); }
}
function colonne(c){
  if(fini || busy || (mode==="ordi" && tour===2)) return;
  const r=libre(c); if(r<0) return;
  choix={r,c}; msg(""); demande();
}
function repond(s){
  if(!choix || fini || busy) return;
  const C=cellule(G, choix.r, choix.c), v=verifie(G, C, s);
  if(v.format){ msg(v.msg, "ko"); return; }
  joue(tour, choix, v.ok, s);
}
function joue(j, ch, ok, s){
  const C=cellule(G, ch.r, ch.c);
  score[j][1]++; if(ok) score[j][0]++;
  hist.unshift({j, q:C.q, ok, s, aff:C.aff}); hist_();
  const affR = G.type==="p10" ? `10${sup(String(s).replace("-","−"))}` : pretty(s);
  if(ok){ B[ch.r][ch.c]=j; }
  choix=null; plateau();
  if(ok){ const el=R0.querySelector(`.pc[data-r="${ch.r}"][data-c="${ch.c}"]`); if(el) el.classList.add("drop"); }
  const qui = mode==="ordi" ? (j===1?"Tu as":"L'ordinateur a") : `${nom(j)} a`;
  const w = ok ? gagne(ch.r, ch.c, j) : null;
  if(w){ fini=true; w.forEach(([r,c])=>{ const el=R0.querySelector(`.pc[data-r="${r}"][data-c="${c}"]`); if(el) el.classList.add("win"); });
    if(mode==="2j" || j===1){ if(!done.includes(cur)){ done.push(cur); store.set("done",JSON.stringify(done)); } levels(); }
    const t = mode==="ordi" ? (j===1 ? "<b>Bravo, tu as gagné !</b> Tu as aligné 4 jetons." : "<b>L'ordinateur a gagné.</b> Rejoue : tu peux le battre !") : `<b>${nom(j)} a gagné !</b> 4 jetons alignés.`;
    msg(`${ok&&j===2&&mode==="ordi"?`L'ordinateur a répondu ${affR} : c'est juste.<br>`:""}${t}<br><button class="btn primary" id="pagain">Rejouer</button><button class="btn" id="pnew2">Nouvelle grille</button>${cur<P.grilles.length-1?`<button class="btn" id="pnext">Grille suivante →</button>`:""}`, j===1||mode==="2j"?"ok":"ko");
    bindFin(); marque(); demande(); return; }
  const plein = B.every(row=>row.every(x=>x));
  const res = ok ? `${qui} répondu ${affR} : <b>c'est juste !</b> Le jeton est posé.` : `${qui} répondu ${affR} : <b>c'est faux.</b> La bonne réponse était <b>${C.aff}</b>. Le jeton n'est pas posé.`;
  if(plein){ fini=true; msg(`${res}<br><b>La grille est pleine : match nul !</b><br><button class="btn primary" id="pagain">Rejouer</button><button class="btn" id="pnew2">Nouvelle grille</button>`, ""); if(mode==="2j"){ if(!done.includes(cur)){ done.push(cur); store.set("done",JSON.stringify(done)); } levels(); } bindFin(); marque(); demande(); return; }
  msg(res, ok?"ok":"ko");
  tour = 3-j; demande();
}
function bindFin(){ const a=$("pagain"), n=$("pnew2"), x=$("pnext"); if(a) a.onclick=()=>nouvelle(false); if(n) n.onclick=()=>nouvelle(true); if(x) x.onclick=()=>charge(cur+1); }
function hist_(){ $("phist").innerHTML = hist.slice(0,6).map(h=>`<li><b class="${h.ok?"v":"x"}" aria-label="${h.ok?"juste":"faux"}">${h.ok?"✓":"✗"}</b><span>${mode==="ordi"?(h.j===1?"Toi":"Ordi"):"J"+h.j} : ${h.q} = ${h.aff}</span></li>`).join(""); }
function gagne(r, c, j){
  for(const [dr,dc] of [[0,1],[1,0],[1,1],[1,-1]]){ const l=[[r,c]];
    for(const s of [1,-1]){ let rr=r+s*dr, cc=c+s*dc; while(rr>=0&&rr<ROWS&&cc>=0&&cc<COLS&&B[rr][cc]===j){ l.push([rr,cc]); rr+=s*dr; cc+=s*dc; } }
    if(l.length>=4) return l; }
  return null;
}
/* l'ordinateur : gagner si possible, sinon bloquer, sinon éviter de donner la victoire, sinon jouer plutôt au centre */
function ordiCol(){
  const cols=[...Array(COLS).keys()].filter(c=>libre(c)>=0);
  const test=(c,j)=>{ const r=libre(c); B[r][c]=j; const w=gagne(r,c,j); B[r][c]=0; return !!w; };
  for(const c of cols) if(test(c,2)) return c;
  for(const c of cols) if(test(c,1)) return c;
  const sur=cols.filter(c=>{ const r=libre(c); if(r<=0) return true; B[r][c]=2; const l=r-1, w=(()=>{ B[l][c]=1; const g=gagne(l,c,1); B[l][c]=0; return g; })(); B[r][c]=0; return !w; });
  const pool=(sur.length?sur:cols).map(c=>({c, w:4-Math.abs(c-2.5)+Math.random()*2.2})); pool.sort((a,b)=>b.w-a.w); return pool[0].c;
}
function ordi(){
  if(fini) return; busy=true; const c=ordiCol(), r=libre(c); choix={r,c}; marque();
  const C=cellule(G,r,c), ok=Math.random()<0.75;
  const rep = ok ? (G.type==="p10" ? String(C.e) : C.aff.replace(/<[^>]+>/g,"")) : erreur(G,C,r,c);
  $("ppanel").innerHTML=`<p><b>L'ordinateur calcule :</b></p><p class="pq">${C.q} =</p>`;
  later(()=>{ busy=false; const v=verifie(G,C,rep); joue(2, {r,c}, !!v.ok && !v.format, rep); }, 1300);
}
function msg(h,kind){ const el=$("pmsg"); if(!el) return; el.hidden=!h; el.className="lmsg "+(kind||""); el.innerHTML=h; }
function destroy(){ clearT(); R0=null; }
window.addEventListener("hashchange", ()=>{ if(R0 && !R0.isConnected) destroy(); });
return {init, destroy, PACKS, _t:{parse, polyStr, same, pasReduit, cellule, verifie, erreur, pretty, G4, G3, get B(){ return B; }, get G(){ return G; }, get tour(){ return tour; }, get choix(){ return choix; }, colonne:c=>colonne(c), repond:s=>repond(s)}};
})();
