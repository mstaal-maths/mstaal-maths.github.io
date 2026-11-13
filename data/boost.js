/* =====================================================================
   Laats — séances BOOST (6e)
   Un « fil » de défis qui ne s'arrête jamais : questions flash, jeux express,
   trios à relier, erreurs à trouver, vrai ou faux éclair, réponses à écrire.
   · le défi suivant arrive tout seul après une bonne réponse ;
   · un défi raté revient un peu plus tard, plus simple, avec un coup de pouce ;
   · tous les 10 défis, un palier : un petit bilan, puis ça repart un cran plus dur.
   Les questions flash et « à toi d'écrire » viennent de la banque du QCM du chapitre
   (déjà vérifiée) ; les autres défis sont générés ici, en nombres entiers (aucun calcul à virgule flottante).
   ===================================================================== */
(function(){
const $ = (s, r=document) => r.querySelector(s), $$ = (s, r=document) => [...r.querySelectorAll(s)];
const app = () => document.getElementById("app");
const ri = (a, b) => a + Math.floor(Math.random()*(b-a+1));
const pick = a => a[Math.floor(Math.random()*a.length)];
const shuf = a => shuffle(a.slice());
const jg = (k, d) => { try{ const v=store.get(k); return v==null ? d : JSON.parse(v); }catch(e){ return d; } };
const js = (k, v) => { try{ store.set(k, JSON.stringify(v)); }catch(e){} };
const wait = ms => new Promise(r => setTimeout(r, ms));

/* ---------- nombres décimaux écrits à partir d'un entier n et d'un nombre k de décimales ---------- */
const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const dec = (n, k) => { if(!k) return sp(n); const s=String(n).padStart(k+1, "0"); const fp=s.slice(-k).replace(/0+$/, ""); return sp(+s.slice(0, -k)) + (fp ? "," + fp : ""); };
const decRaw = (n, k) => { if(!k) return sp(n); const s=String(n).padStart(k+1, "0"); return sp(+s.slice(0, -k)) + "," + s.slice(-k); };
const DEN = {1:"10", 2:"100", 3:"1 000"};
const frac = (n, k) => `{${sp(n)}/${DEN[k]}}`;
const RANG = {1:"dixième", 2:"centième", 3:"millième"};

/* ---------- en lettres (orthographe rectifiée, comme le reste du site : traits d'union partout) ---------- */
const UNI = ["zéro","un","deux","trois","quatre","cinq","six","sept","huit","neuf","dix","onze","douze","treize","quatorze","quinze","seize","dix-sept","dix-huit","dix-neuf"];
const DIZ = {2:"vingt", 3:"trente", 4:"quarante", 5:"cinquante", 6:"soixante"};
function l99(n){
  if(n < 20) return UNI[n];
  if(n < 70){ const d=Math.floor(n/10), u=n%10; return DIZ[d] + (u===0 ? "" : u===1 ? "-et-un" : "-" + UNI[u]); }
  if(n < 80) return "soixante" + (n===71 ? "-et-onze" : "-" + UNI[n-60]);
  if(n === 80) return "quatre-vingts";
  return "quatre-vingt-" + UNI[n-80];
}
function l999(n){
  if(n < 100) return l99(n);
  const c=Math.floor(n/100), r=n%100, cs=(c>1 ? UNI[c]+"-" : "") + "cent" + (c>1 && r===0 ? "s" : "");
  return r ? cs + "-" + l99(r) : cs;
}
const plur = (n, m) => n > 1 ? m + "s" : m;
/* n avec k décimales → « trois unités et quarante-cinq centièmes » (la partie décimale est lue dans l'unité de son dernier chiffre) */
function lettres(n, k){
  const p=10**k, ip=Math.floor(n/p); let fp=n%p, kk=k; const parts=[];
  if(ip){ let w=l999(ip); if(/(^|-)un$/.test(w)) w+="e"; parts.push(w + " " + plur(ip, "unité")); }
  if(fp){ while(kk>1 && fp%10===0){ fp/=10; kk--; } parts.push(l999(fp) + " " + plur(fp, RANG[kk])); }
  return parts.length ? parts.join(" et ") : "zéro";
}

/* ---------- notions du chapitre (mêmes noms que les notions du QCM) ---------- */
const N_FRAC="Fractions décimales", N_VAL="Valeur des chiffres", N_ZERO="Zéros inutiles", N_AXE="Demi-droite graduée",
      N_CMP="Comparer et ranger", N_ENC="Encadrer et intercaler", N_ARR="Arrondir";
const POUCE = {
  [N_FRAC]: "Compte les chiffres après la virgule : 1 chiffre → dénominateur 10, 2 chiffres → 100, 3 chiffres → 1 000.",
  [N_VAL]: "Après la virgule : d'abord les dixièmes, puis les centièmes, puis les millièmes.",
  [N_ZERO]: "Un zéro est inutile seulement s'il est tout à gauche de la partie entière ou tout à droite de la partie décimale.",
  [N_AXE]: "Compte d'abord combien de graduations il y a dans une unité : 10 graduations → chacune vaut 0,1.",
  [N_CMP]: "Compare d'abord les parties entières, puis les dixièmes, puis les centièmes. Tu peux ajouter des zéros à droite : 3,5 = 3,50.",
  [N_ENC]: "Ajoute un zéro à droite des deux nombres : entre 2,3 = 2,30 et 2,4 = 2,40, il y a 2,31 ; 2,32 ; …",
  [N_ARR]: "Regarde le chiffre juste après la précision demandée : 0 à 4, on garde ; 5 à 9, on augmente.",
};

/* =====================================================================
   GÉNÉRATEURS (niveau 1, 2 ou 3)
===================================================================== */

/* --- relier : trois nombres, chacun en écriture décimale, en fraction décimale et en lettres --- */
function genRelier(lv){
  let v;
  if(lv===1){ const d=ri(2,9), a=ri(1,9), b=ri(1,9), c=ri(1,9); v=[[d,1],[d,2],[100*a+10*b+c,2]]; }
  else if(lv===2){ const a=ri(1,9), b=ri(1,9); v=[[10*a+b,1],[100*a+b,2],[10*a+b,2]]; }
  else { const d=ri(2,9), a=ri(1,9); v=pick([[[d,1],[d,2],[d,3]], [[1000*a+d,3],[100*a+d,2],[10*a+d,1]]]); }
  return {type:"relier", skill:N_FRAC, items:v.map(([n,k],i)=>({id:i, n, k, d:dec(n,k), f:frac(n,k), l:lettres(n,k)}))};
}

/* --- le détective : une copie avec une erreur, trouver laquelle --- */
const DET = [
  {lv:1, skill:N_CMP, g:()=>{ const a=ri(1,9), b=ri(2,9); let cd; do{ cd=ri(10, 10*b-1); }while(cd%10===0);
    return {qui:"Léo", consigne:"Léo devait comparer ces deux nombres. Il s'est trompé.", copie:`${a},${b} &lt; ${a},${cd}`, dit:`« Car ${b} est plus petit que ${cd}. »`,
      bon:`Il compare ${b} et ${cd} comme si c'étaient des nombres entiers.`, faux:["Les parties entières ne sont pas les mêmes.","Il fallait écrire le signe =."],
      ex:`${a},${b} = ${a},${b}0 : cela fait ${b}0 centièmes, c'est plus que ${cd} centièmes. Donc ${a},${b} &gt; ${a},${cd}.`}; }},
  {lv:1, skill:N_FRAC, g:()=>{ const n=ri(2,9);
    return {qui:"Nina", consigne:"Nina devait écrire ce nombre avec une fraction décimale. Elle s'est trompée.", copie:`0,0${n} = {${n}/10}`, dit:"",
      bon:`Le ${n} est au rang des centièmes : il fallait écrire {${n}/100}.`, faux:[`Il fallait écrire {${n}/1 000}.`, `0,0${n} n'est pas un nombre décimal.`],
      ex:`0,0${n} se lit « ${l99(n)} centième${n>1?"s":""} » : 0,0${n} = {${n}/100}.`}; }},
  {lv:1, skill:N_ZERO, g:()=>{ const a=ri(1,9), b=ri(1,9);
    return {qui:"Tom", consigne:"Tom a barré un zéro qu'il pensait inutile. Il s'est trompé.", copie:`${a},0${b} = ${a},${b}`, dit:"« Car le zéro ne sert à rien. »",
      bon:"Ce zéro n'est pas inutile : il tient la place des dixièmes.", faux:[`Il aurait fallu enlever aussi le chiffre ${b}.`, "Il aurait fallu écrire le zéro à gauche du nombre."],
      ex:`${a},0${b} = ${lettres(100*a+b,2)}, alors que ${a},${b} = ${lettres(10*a+b,1)}. Donc ${a},0${b} &lt; ${a},${b}.`}; }},
  {lv:2, skill:N_VAL, g:()=>{ const e=ri(12,98), d=ri(1,9), c=ri(1,9);
    return {qui:"Sami", consigne:"Sami devait répondre à la question : « Combien y a-t-il de dixièmes en tout dans ce nombre ? »", copie:`${e},${d}${c}`, dit:`« Il y a ${d} dixièmes. »`,
      bon:`Il a donné le chiffre des dixièmes, pas le nombre de dixièmes : il y en a ${sp(10*e+d)}.`, faux:[`Il fallait répondre ${c} : c'est le dernier chiffre.`, `Il fallait répondre ${sp(100*e+10*d+c)}.`],
      ex:`${e},${d}${c} = ${sp(10*e+d)} dixièmes et ${c} centième${c>1?"s":""}. Le chiffre des dixièmes est ${d}, mais le nombre de dixièmes est ${sp(10*e+d)}.`}; }},
  {lv:2, skill:N_VAL, g:()=>{ const a=ri(2,9), b=ri(2,9);
    return {qui:"Lina", consigne:"Lina devait écrire ce nombre avec une virgule. Elle s'est trompée.", copie:`${UNI[a]} unités et ${UNI[b]} centièmes = ${a},${b}`, dit:"",
      bon:`Il n'y a pas de dixièmes : il faut un 0 à leur place, donc ${a},0${b}.`, faux:[`Il fallait écrire ${a},00${b}.`, `Il fallait écrire ${a}${b},0.`],
      ex:`${a},${b} se lit « ${UNI[a]} unités et ${UNI[b]} dixièmes », alors que « ${UNI[a]} unités et ${UNI[b]} centièmes » s'écrit ${a},0${b}.`}; }},
  {lv:2, skill:N_ARR, g:()=>{ const a=ri(1,19), b=ri(1,8), c=ri(5,9);
    return {qui:"Hugo", consigne:`Hugo devait donner l'arrondi au dixième de ${a},${b}${c}. Il s'est trompé.`, copie:`${a},${b}${c} ≈ ${a},${b}`, dit:"",
      bon:`Le chiffre des centièmes est ${c} : il fallait augmenter le chiffre des dixièmes, ${a},${b+1}.`, faux:[`Il fallait arrondir à ${a}.`, `Il fallait écrire ${a},${b}${c}0.`],
      ex: c===5 ? `${a},${b} &lt; ${a},${b}${c} &lt; ${a},${b+1} et ${a},${b}5 est exactement au milieu : on prend la borne supérieure, ${a},${b+1}.`
                : `${a},${b} &lt; ${a},${b}${c} &lt; ${a},${b+1} et ${a},${b}${c} est plus proche de ${a},${b+1}.`}; }},
  {lv:3, skill:N_CMP, g:()=>{ const a=ri(1,9), d1=ri(6,9); let y; do{ y=ri(11, 10*d1-11); }while(y%10===0); let z; do{ z=ri(101,999); }while(z%10===0 || z===100*d1 || z===10*y);
    const L=[[1000*a+100*d1, `${a},${d1}`], [1000*a+10*y, `${a},${y}`], [1000*a+z, `${a},${z}`]], ok=L.slice().sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
    return {qui:"Emma", consigne:"Emma devait ranger ces nombres dans l'ordre croissant. Elle s'est trompée.", copie:L.map(x=>x[1]).join(" &lt; "), dit:"« Plus il y a de chiffres, plus le nombre est grand. »",
      bon:"Avoir plus de chiffres ne veut pas dire être plus grand : on compare les dixièmes, puis les centièmes…", faux:["Il fallait ranger dans l'ordre décroissant.", "Les parties entières ne sont pas les mêmes."],
      ex:`On compare chiffre par chiffre après la virgule. Le bon rangement : ${ok.join(" &lt; ")}.`}; }},
  {lv:3, skill:N_FRAC, g:()=>{ const n=ri(2,9);
    return {qui:"Paul", consigne:"Paul devait écrire cette fraction décimale avec une virgule. Il s'est trompé.", copie:`{${n}/1 000} = 0,${n}`, dit:"",
      bon:`${n} millièmes s'écrit avec 3 chiffres après la virgule : 0,00${n}.`, faux:[`Il fallait écrire 0,0${n}.`, `Il fallait écrire ${n},000.`],
      ex:`Dénominateur 1 000 → trois chiffres après la virgule : {${n}/1 000} = 0,00${n}. Alors que 0,${n} = {${n}/10}.`}; }},
];
function genDetective(lv){
  const L=DET.filter(t=>t.lv<=lv), w=L.filter(t=>t.lv===lv), T=(w.length && Math.random()<.6) ? pick(w) : pick(L), d=T.g();
  return Object.assign({type:"detective", skill:T.skill, opts:shuf([d.bon, ...d.faux])}, d);
}

/* --- vrai ou faux éclair : 5 affirmations à la suite --- */
const VFT = [
  {lv:1, skill:N_ZERO, g:()=>{ const a=ri(1,9), b=ri(1,9); return {s:`${a},${b}0 = ${a},${b}`, v:true, ex:`Le zéro tout à droite est inutile.`}; }},
  {lv:1, skill:N_ZERO, g:()=>{ const a=ri(1,9), b=ri(1,9); return {s:`${a},0${b} = ${a},${b}`, v:false, ex:`Ce zéro tient la place des dixièmes : ${a},0${b} &lt; ${a},${b}.`}; }},
  {lv:1, skill:N_CMP, g:()=>{ const a=ri(1,9), b=ri(2,9); let cd; do{ cd=ri(10,10*b-1); }while(cd%10===0); const sens=Math.random()<.5;
    return {s:`${a},${b} ${sens?"&gt;":"&lt;"} ${a},${cd}`, v:sens, ex:`${a},${b} = ${a},${b}0 et ${b}0 &gt; ${cd} : ${a},${b} &gt; ${a},${cd}.`}; }},
  {lv:1, skill:N_FRAC, g:()=>{ const n=ri(2,9), ok=Math.random()<.5; return {s:`{${n}/${ok?100:10}} = 0,0${n}`, v:ok, ex:`0,0${n} = {${n}/100} : le ${n} est au rang des centièmes.`}; }},
  {lv:1, skill:N_FRAC, g:()=>{ const a=ri(1,9), b=ri(1,9), c=ri(1,9), n=100*a+10*b+c, ok=Math.random()<.5;
    return {s:`{${n}/100} = ${ok?`${a},${b}${c}`:`${a}${b},${c}`}`, v:ok, ex:`Dénominateur 100 → deux chiffres après la virgule : {${n}/100} = ${a},${b}${c}.`}; }},
  {lv:1, skill:N_VAL, g:()=>{ return {s:"Tous les nombres entiers sont des nombres décimaux.", v:true, ex:"Par exemple 5 = {5/1} = 5,0."}; }},
  {lv:2, skill:N_ARR, g:()=>{ const a=ri(1,19); return {s:`L'arrondi à l'unité de ${a},5 est ${a+1}.`, v:true, ex:`${a},5 est exactement au milieu entre ${a} et ${a+1} : on prend la borne supérieure.`}; }},
  {lv:2, skill:N_ARR, g:()=>{ const a=ri(1,19), b=ri(1,8), c=ri(1,4); return {s:`L'arrondi au dixième de ${a},${b}${c} est ${a},${b+1}.`, v:false, ex:`Le chiffre des centièmes est ${c} (moins de 5) : l'arrondi est ${a},${b}.`}; }},
  {lv:2, skill:N_ENC, g:()=>{ const a=ri(1,19), b=ri(1,8), c=ri(1,9); return {s:`${a},${b}${c} est compris entre ${a},${b} et ${a},${b+1}.`, v:true, ex:`${a},${b} = ${a},${b}0 et ${a},${b+1} = ${a},${b+1}0 : ${a},${b}0 &lt; ${a},${b}${c} &lt; ${a},${b+1}0.`}; }},
  {lv:2, skill:N_VAL, g:()=>{ const e=ri(12,98), d=ri(1,9), c=ri(1,9), ok=Math.random()<.5;
    return {s:`Dans ${e},${d}${c}, il y a ${ok?sp(10*e+d):d} dixièmes en tout.`, v:ok, ex:`${e},${d}${c} = ${sp(10*e+d)} dixièmes et ${c} centième${c>1?"s":""} (le chiffre des dixièmes est ${d}).`}; }},
  {lv:3, skill:N_FRAC, g:()=>{ const n=ri(2,9), ok=Math.random()<.5; return {s:`{${n}/1 000} = ${ok?`0,00${n}`:`0,${n}`}`, v:ok, ex:`Dénominateur 1 000 → trois chiffres après la virgule : 0,00${n}.`}; }},
  {lv:3, skill:N_CMP, g:()=>{ const a=ri(1,9), b=ri(2,9), x=ri(1,b-1), y=ri(1,9), z=ri(1,9); return {s:`${a},${b} &lt; ${a},${x}${y}${z}`, v:false, ex:`${a},${b} = ${a},${b}00 et ${b}00 &gt; ${x}${y}${z} : ${a},${b} &gt; ${a},${x}${y}${z}.`}; }},
  {lv:3, skill:N_ENC, g:()=>{ return {s:"Entre 1,57 et 1,58, il n'y a aucun nombre décimal.", v:false, ex:"1,571 ; 1,575 ; 1,5799… : il y en a une infinité."}; }},
];
function genVF(lv){
  const L=VFT.filter(t=>t.lv<=lv), out=[], seen=new Set();
  let guard=0;
  while(out.length<5 && guard++<200){ const T=pick(L), x=T.g(); if(seen.has(x.s)) continue; seen.add(x.s); out.push(Object.assign({skill:T.skill}, x)); }
  return {type:"vf", skill:out[0].skill, items:out};
}

/* --- jeu express : le sniper de la demi-droite graduée (3 cibles) --- */
function genSniper(lv){
  const tg=[];
  if(lv<3){
    const a=ri(lv===1?0:1, 8), used=new Set();
    while(tg.length<3){
      const t = lv===1 ? ri(1,9) : pick([ri(1,9)*2, ri(0,9)*2+1]);     /* niveau 1 : dixièmes ; niveau 2 : dixièmes et milieux (centièmes en 5) */
      if(used.has(t)) continue; used.add(t);
      const sub = lv===1 ? 10 : 20;                                    /* position en 1/sub d'unité */
      const n = lv===1 ? 10*a+t : 100*a+5*t, k = lv===1 ? 1 : (t%2 ? 2 : 1), nn = (lv===2 && !(t%2)) ? 10*a+t/2 : n;
      const forme = pick(lv===1 ? ["d","d","f"] : ["d","f"]);
      tg.push({pos:t, sub, lab: forme==="f" ? frac(nn,k) : dec(nn,k), val:dec(nn,k)});
    }
    return {type:"sniper", skill:N_AXE, lo:dec(a,0), hi:dec(a+1,0), ticks:10, sub:lv===1?10:20, targets:tg};
  }
  const a=ri(1,9), b=ri(0,9), base=10*a+b, used=new Set();
  while(tg.length<3){ const c=ri(1,9); if(used.has(c)) continue; used.add(c); const n=10*base+c;
    tg.push({pos:c, sub:10, lab: pick(["d","f"])==="f" ? frac(n,2) : dec(n,2), val:dec(n,2)}); }
  return {type:"sniper", skill:N_AXE, lo:dec(base,1), hi:dec(base+1,1), ticks:10, sub:10, targets:tg, zoom:true};
}

/* --- à toi d'écrire : intercaler (toute réponse juste est acceptée) --- */
function genIntercaler(lv){
  let lo, hi, k;
  if(lv===1){ const a=ri(1,19); lo=[a,0]; hi=[a+1,0]; k=1; }
  else if(lv===2){ const a=ri(1,19), b=ri(0,8); lo=[10*a+b,1]; hi=[10*a+b+1,1]; k=2; }
  else { const a=ri(1,9), b=ri(0,9), c=ri(0,8); lo=[100*a+10*b+c,2]; hi=[100*a+10*b+c+1,2]; k=3; }
  return {type:"intercaler", skill:N_ENC, lo, hi, ex1:dec(lo[0]*10+5, lo[1]+1)};
}
/* « 2,35 » → [235, 2] ; null si ce n'est pas un nombre décimal bien écrit */
function lire(s){
  s=String(s).replace(/[\s  ]/g, "").replace(/\./g, ",");
  const m=s.match(/^(\d+)(?:,(\d+))?$/); if(!m) return null;
  const f=(m[2]||"").replace(/0+$/, ""); if(f.length>8) return null;
  return [BigInt(m[1]+f), f.length];
}
const cmpD = (x, y) => { const k=Math.max(x[1], y[1]), a=BigInt(x[0])*10n**BigInt(k-x[1]), b=BigInt(y[0])*10n**BigInt(k-y[1]); return a<b ? -1 : a>b ? 1 : 0; };

/* =====================================================================
   LE FIL
===================================================================== */
const TYPES = {
  flash:     {nom:"Question flash",     c:"#1d4ed8"},
  ecrire:    {nom:"À toi d'écrire",     c:"#167a54"},
  relier:    {nom:"Relier",             c:"#0b7f7f"},
  detective: {nom:"Le détective",       c:"#b45309"},
  sniper:    {nom:"Jeu express",        c:"#7a3fd0"},
  vf:        {nom:"Vrai ou faux éclair", c:"#be3455"},
};
const PAL = 10;                                   /* défis par palier */
const lvOf = p => p<=1 ? 1 : p===2 ? 2 : 3;

function banque(key, kind, lv, notion){
  const Q0=CH[key] && CH[key].quiz; if(!Q0) return null;
  const P=[];
  Q0.forEach((N, ni) => { if(notion && N.nom!==notion) return; [lv, lv-1].filter(l=>l>=1).forEach(l => (N.q[l]||[]).forEach(Q => P.push({N, Q}))); });
  for(const p of shuf(P)){
    let q; try{ q=inst(p.Q); }catch(e){ continue; }
    if(!q) continue;
    const hasC=!!q.c, ok = kind==="flash" ? hasC : !hasC && (q.rep!==undefined || q.t);
    if(!ok) continue;
    return Object.assign({}, JSON.parse(JSON.stringify(q)), {_N:p.N.schema||"", _skill:p.N.nom});
  }
  return null;
}

function make(B, type, lv, notion){
  if(type==="flash"){ const q=banque(B.key, "flash", lv, notion); if(q) return {type, skill:q._skill, q}; return genVF(lv); }
  if(type==="ecrire"){ if(!notion && Math.random()<.35 || notion===N_ENC && Math.random()<.5) return genIntercaler(lv);
    const q=banque(B.key, "ecrire", lv, notion); if(q) return {type, skill:q._skill, q}; return genIntercaler(lv); }
  if(type==="relier") return genRelier(lv);
  if(type==="detective"){ if(notion){ const L=DET.filter(t=>t.skill===notion && t.lv<=Math.max(lv,1)); if(L.length){ const T=pick(L), d=T.g(); return Object.assign({type:"detective", skill:T.skill, opts:shuf([d.bon,...d.faux])}, d); } } return genDetective(lv); }
  if(type==="sniper") return genSniper(lv);
  return genVF(lv);
}

/* ---------- styles ---------- */
const css=document.createElement("style");
css.textContent=`
.bst{display:grid;gap:14px}
.bst-top{display:flex;flex-wrap:wrap;align-items:center;gap:10px 18px;background:var(--c,#2563eb);color:#fff;border-radius:16px;padding:12px 18px;font-weight:700}
.bst-top .pal{display:flex;align-items:center;gap:10px}
.bst-top .bar{width:150px;height:12px;border-radius:6px;background:rgba(255,255,255,.28);overflow:hidden}
.bst-top .bar i{display:block;height:100%;background:#ffcf3f;border-radius:6px;transition:width .4s}
.bst-top .serie{color:#ffe27a}
.bst-top .sp{flex:1}
.bst-top button{font:inherit;font-size:14px;font-weight:700;color:#fff;background:rgba(255,255,255,.16);border:2px solid rgba(255,255,255,.5);border-radius:10px;padding:6px 12px;cursor:pointer}
.bst-fil{display:flex;flex-wrap:wrap;gap:8px}
.bst-fil span{display:inline-flex;align-items:center;height:34px;padding:0 12px;border-radius:10px;font-size:14px;font-weight:700;white-space:nowrap;border:2px solid var(--line);color:var(--muted);background:var(--surface)}
.bst-fil .ok{background:var(--okbg);color:var(--ok);border-color:transparent}
.bst-fil .ko{background:#fff1e0;color:#8a4207;border-color:#f0c08a}
:root[data-theme="dark"] .bst-fil .ko{background:#3a2610;color:#ffc78a;border-color:#6b4a22}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .bst-fil .ko{background:#3a2610;color:#ffc78a;border-color:#6b4a22}}
.bst-fil .cur{color:#fff;border-color:transparent}
.bst-fil .nx{width:34px;justify-content:center;padding:0;border-style:dashed}
.bst-card{display:grid;gap:14px}
.bst-badge{justify-self:start;color:#fff;font-weight:800;font-size:14px;letter-spacing:.06em;text-transform:uppercase;padding:6px 14px;border-radius:999px}
.bst-pouce{background:#fff8dc;border:2px solid #e8c34a;color:#5a4500;border-radius:12px;padding:10px 14px;font-size:16px}
:root[data-theme="dark"] .bst-pouce{background:#3a3110;color:#ffe9a8;border-color:#7a6620}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .bst-pouce{background:#3a3110;color:#ffe9a8;border-color:#7a6620}}
.bst-q{font-size:1.25rem;font-weight:700;margin:0;line-height:1.45}
.bst-big{font-size:1.6rem;font-weight:800;letter-spacing:.02em}
.bst .fb .bst-auto{display:flex;align-items:center;gap:10px;font-size:14px;color:var(--muted);margin-top:8px}
.bst .fb .bst-auto i{flex:1;max-width:240px;height:8px;border-radius:4px;background:var(--line);overflow:hidden;position:relative}
.bst .fb .bst-auto i::after{content:"";position:absolute;inset:0;background:var(--ok);transform-origin:left;animation:bstfill var(--d,3s) linear forwards}
@keyframes bstfill{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.bst-rel{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.bst-rel h4{margin:0 0 4px;text-align:center;font-size:14px;color:var(--muted)}
.bst-rel .col{display:grid;gap:10px;align-content:start}
.bst-rel button{font:inherit;font-weight:700;min-height:74px;border-radius:14px;border:2px solid var(--line);background:var(--surface);color:var(--ink);cursor:pointer;padding:10px;line-height:1.35}
.bst-rel button.num{font-size:1.45rem}
.bst-rel button.sel{border-color:var(--c,#2563eb);box-shadow:0 0 0 3px color-mix(in srgb,var(--c,#2563eb) 30%,transparent)}
.bst-rel button.done{background:var(--okbg);border-color:var(--ok);color:var(--ok);cursor:default}
.bst-rel button.bad{border-color:#b45309;background:#fff1e0}
@media (max-width:640px){.bst-rel{grid-template-columns:1fr}}
.bst-copie{background:#fffdf4;color:#15213b;border:2px solid #d9cfa8;border-radius:6px;padding:14px 18px;box-shadow:4px 4px 0 #e8e1c4;display:grid;gap:8px}
.bst-copie small{font-weight:700;color:#6b5d2e}
.bst-vf{display:grid;gap:12px;justify-items:center;text-align:center}
.bst-vf .aff{font-size:1.5rem;font-weight:800;line-height:1.4;min-height:2.2em}
.bst-vf .btns{display:flex;gap:14px}
.bst-vf .btns button{font:inherit;font-size:1.2rem;font-weight:800;min-width:140px;padding:14px 18px;border-radius:14px;border:2px solid var(--line);background:var(--surface);color:var(--ink);cursor:pointer}
.bst-vf .dots{display:flex;gap:8px}
.bst-vf .dots b{width:16px;height:16px;border-radius:50%;background:var(--line)}
.bst-vf .dots b.ok{background:var(--ok)} .bst-vf .dots b.ko{background:#c2410c} .bst-vf .dots b.cur{outline:3px solid var(--c,#2563eb);outline-offset:2px}
.bst-vf .mini{font-size:15px;min-height:1.5em}
.bst-sn{display:grid;gap:10px}
.bst-sn .cible{justify-self:center;display:flex;align-items:center;gap:14px;font-size:1.5rem;font-weight:800;border:3px solid #e0a800;border-radius:16px;padding:8px 22px;background:var(--surface)}
.bst-sn svg{width:100%;height:auto;touch-action:manipulation;cursor:crosshair;background:#1b2747;border-radius:14px}
.bst-sn .info{display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;font-size:15px;color:var(--muted)}
.bst-ic{display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;font-size:1.4rem;font-weight:800}
.bst-ic input{font:inherit;font-size:1.5rem;font-weight:800;width:170px;text-align:center;padding:10px;border-radius:12px;border:2px solid var(--line);background:var(--surface);color:var(--ink)}
.bst-pal{display:grid;gap:16px;text-align:left}
.bst-pal .t{display:flex;align-items:center;gap:16px}
.bst-pal .t b.n{display:grid;place-items:center;width:78px;height:78px;border-radius:20px;background:#ffcf3f;color:#15213b;font-size:2rem;line-height:1}
.bst-pal .t b.n small{font-size:12px;letter-spacing:.06em}
.bst-pal .g{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}
.bst-pal .g div{border-radius:14px;padding:12px 16px}
.bst-pal ul{margin:6px 0 0;padding-left:20px}
.bst-home{display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,360px);gap:22px;align-items:start}
@media (max-width:820px){.bst-home{grid-template-columns:1fr}}
.bst-home ol{margin:0;padding-left:22px;display:grid;gap:8px}
.bst-chips{display:flex;flex-wrap:wrap;gap:8px}
.bst-chips span{display:inline-flex;align-items:center;gap:8px;border:2px solid var(--line);border-radius:12px;padding:8px 12px;font-weight:700;font-size:15px;background:var(--surface)}
.bst-chips i{width:12px;height:12px;border-radius:4px}
.bst-go{font-size:1.25rem!important;padding:16px 30px!important}
.chap.bst-chap{background:#fff3d6;border-color:#e8a200}
.chap.bst-chap .n{color:#9a5b00}
.chap.bst-chap h3{color:#15213b;font-weight:800}
.chap.bst-chap .where{color:#5a4500}
.chap.bst-chap:hover{border-color:#b07d00}
:root[data-theme="dark"] .chap.bst-chap{background:#3a2c0c;border-color:#b07d00}
:root[data-theme="dark"] .chap.bst-chap .n,:root[data-theme="dark"] .chap.bst-chap h3,:root[data-theme="dark"] .chap.bst-chap .where{color:#ffe2a0}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .chap.bst-chap{background:#3a2c0c;border-color:#b07d00}
  :root:not([data-theme="light"]) .chap.bst-chap .n,:root:not([data-theme="light"]) .chap.bst-chap h3,:root:not([data-theme="light"]) .chap.bst-chap .where{color:#ffe2a0}}
`;
document.head.appendChild(css);

/* =====================================================================
   AFFICHAGE D'UN DÉFI
===================================================================== */
let RUN=0;                                         /* change à chaque nouvelle partie : arrête l'ancienne */
const alive = (tok, el) => tok===RUN && el && el.isConnected;

function verdict(fb, ok, html, opt={}){
  return new Promise(resolve=>{
    fb.hidden=false; fb.className="fb "+(ok?"ok":"ko");
    const hb=fb.parentNode && fb.parentNode.querySelector(".hintbox"); if(hb) hb.remove();
    const auto = ok && !opt.manual, d = opt.delay || 3200;
    fb.innerHTML = `<p><strong>${ok ? pick(["Bravo !","Juste !","Exact !","Bien vu !"]) : "Pas tout à fait."}</strong> ${fmt(html||"")}</p>
      ${opt.sch ? `<div class="schema">${fmt(opt.sch)}</div>` : ""}
      ${auto ? `<div class="bst-auto" style="--d:${d}ms"><span>Défi suivant…</span><i></i></div>` : ""}
      <div><button class="btn primary">${ok ? "Défi suivant →" : "J'ai compris, défi suivant →"}</button></div>`;
    let done=false; const go=()=>{ if(!done){ done=true; resolve(); } };
    fb.querySelector("button").onclick=go; fb.querySelector("button").focus({preventScroll:true});
    if(auto) setTimeout(go, d);
  });
}

function head(card, ch, pouce){
  const T=TYPES[ch.type]||TYPES.ecrire;
  card.innerHTML = `<span class="bst-badge" style="background:${T.c}">${T.nom}</span>${pouce?`<div class="bst-pouce"><b>Coup de pouce :</b> ${fmt(POUCE[ch.skill]||"")}</div>`:""}<div class="bst-body"></div><div class="fb" hidden></div>`;
  return [$(".bst-body", card), $(".fb", card)];
}

/* --- question de la banque (QCM ou réponse à écrire) --- */
async function playBanque(card, ch, pouce){
  const T=TYPES[ch.type];
  const h = `<span class="bst-badge" style="background:${T.c}">${T.nom}</span>${pouce?`<div class="bst-pouce"><b>Coup de pouce :</b> ${fmt(POUCE[ch.skill]||"")}</div>`:""}`;
  const r = await showQ(card, h, ch.q);
  const sch = ch.q.sx || (typeof SX!=="undefined" && SX.auto && SX.auto(ch.q)) || ch.q._N || "";
  return {ok:r.ok, fb:r.fb, html:(r.ok ? "" : `La bonne réponse est <b>${r.shown}</b>. `) + (ch.q.ex||""), sch: r.ok ? "" : sch};
}

/* --- relier --- */
function playRelier(card, ch, pouce){
  return new Promise(resolve=>{
    const [b, fb] = head(card, ch, pouce);
    const cols=[["d","Écriture décimale","num"],["f","Fraction décimale","num"],["l","En lettres",""]];
    const order=cols.map(()=>shuf(ch.items));
    b.innerHTML = `<p class="bst-q">Forme les trios : un même nombre écrit de trois façons. Choisis une case dans chaque colonne.</p>
      <div class="bst-rel">${cols.map(([k,t,cl],ci)=>`<div class="col"><h4>${t}</h4>${order[ci].map(it=>`<button class="${cl}" data-c="${ci}" data-id="${it.id}">${fmt(it[k])}</button>`).join("")}</div>`).join("")}</div>`;
    const sel=[null,null,null]; let err=0, found=0;
    $$("button[data-c]", b).forEach(bt=>bt.onclick=()=>{
      if(bt.classList.contains("done")) return;
      const c=+bt.dataset.c; $$(`button[data-c="${c}"]`, b).forEach(x=>x.classList.remove("sel","bad"));
      sel[c]=bt; bt.classList.add("sel");
      if(sel.every(Boolean)){
        const ids=sel.map(x=>x.dataset.id), S=sel.slice(); sel.fill(null);
        if(ids.every(i=>i===ids[0])){ S.forEach(x=>{ x.classList.remove("sel"); x.classList.add("done"); x.disabled=true; }); found++;
          if(found===ch.items.length){
            const L=ch.items.map(it=>`${it.d} = ${it.f} = ${it.l}`).join("<br>");
            resolve({ok:err===0, fb, html: err===0 ? "Les trois trios sont justes." : `Tu as fait ${err} essai${err>1?"s":""} de trop. Les trios :<br>${L}`});
          }
        } else { err++; S.forEach(x=>{ x.classList.remove("sel"); x.classList.add("bad"); }); setTimeout(()=>S.forEach(x=>x.classList.remove("bad")), 900); }
      }
    });
  });
}

/* --- le détective --- */
function playDetective(card, ch, pouce){
  return new Promise(resolve=>{
    const [b, fb] = head(card, ch, pouce);
    b.innerHTML = `<p class="bst-q">${fmt(ch.consigne)} Où est son erreur ?</p>
      <div class="bst-copie"><small>Copie de ${ch.qui}</small><span class="bst-big">${fmt(ch.copie)}</span>${ch.dit?`<span>${fmt(ch.dit)}</span>`:""}</div>
      <div class="choices">${ch.opts.map((o,i)=>`<button class="choice" data-i="${i}">${fmt(o)}</button>`).join("")}</div>`;
    $$(".choice", b).forEach(x=>x.onclick=()=>{
      const ok = ch.opts[+x.dataset.i]===ch.bon;
      $$(".choice", b).forEach(y=>{ y.disabled=true; if(ch.opts[+y.dataset.i]===ch.bon) y.classList.add("correct"); else if(y===x) y.classList.add("wrong"); });
      resolve({ok, fb, html: (ok ? "" : `L'erreur : ${ch.bon} `) + ch.ex});
    });
  });
}

/* --- vrai ou faux éclair --- */
function playVF(card, ch, pouce, tok){
  return new Promise(resolve=>{
    const [b, fb] = head(card, ch, pouce);
    b.innerHTML = `<div class="bst-vf"><p class="bst-q" style="margin:0">5 affirmations : vrai ou faux ?</p><div class="dots">${ch.items.map(()=>"<b></b>").join("")}</div>
      <div class="aff"></div><div class="btns"><button data-v="1">Vrai</button><button data-v="0">Faux</button></div><div class="mini"></div></div>`;
    const dots=$$(".dots b", b), aff=$(".aff", b), mini=$(".mini", b), btns=$$(".btns button", b);
    let i=0, bons=0; const rates=[];
    const show=()=>{ dots.forEach((d,j)=>d.classList.toggle("cur", j===i)); aff.innerHTML=fmt(ch.items[i].s); mini.innerHTML=""; btns.forEach(x=>x.disabled=false); };
    btns.forEach(x=>x.onclick=async()=>{
      btns.forEach(y=>y.disabled=true);
      const it=ch.items[i], ok=(x.dataset.v==="1")===it.v; dots[i].classList.remove("cur"); dots[i].classList.add(ok?"ok":"ko");
      if(ok) bons++; else rates.push(it);
      mini.innerHTML = ok ? `<b style="color:var(--ok)">Oui, c'est ${it.v?"vrai":"faux"}.</b>` : `<b style="color:#c2410c">Non, c'est ${it.v?"vrai":"faux"}.</b> ${fmt(it.ex)}`;
      await wait(ok ? 900 : 2600); if(!alive(tok, card)) return;
      i++; if(i<ch.items.length) return show();
      resolve({ok:bons>=4, fb, skill:(rates[0]||ch.items[0]).skill, html:`${bons} bonne${bons>1?"s":""} réponse${bons>1?"s":""} sur 5.`+(rates.length?"<br>"+rates.map(r=>`« ${r.s} » est ${r.v?"vrai":"faux"} : ${r.ex}`).join("<br>"):"")});
    });
    show();
  });
}

/* --- jeu express : le sniper --- */
function playSniper(card, ch, pouce, tok){
  return new Promise(resolve=>{
    const [b, fb] = head(card, ch, pouce);
    const X0=70, X1=930, Y=120, W=X1-X0;
    let ticks=""; for(let i=0;i<=ch.ticks;i++){ const x=X0+i*W/ch.ticks, big=i===0||i===ch.ticks, mid=i===5, h=big?26:mid?19:12; ticks+=`<line x1="${x}" y1="${Y-h}" x2="${x}" y2="${Y+h}" stroke="#fff" stroke-width="${big?4:2.5}"/>`; }
    b.innerHTML = `<div class="bst-sn"><p class="bst-q" style="margin:0">Clique sur la demi-droite, à l'endroit exact du nombre.${ch.zoom?" Attention : ici, on a zoomé entre deux dixièmes.":""}</p>
      <div class="cible"><span>Vise</span><span class="lab"></span></div>
      <svg viewBox="0 0 1000 200" role="img" aria-label="Demi-droite graduée de ${ch.lo} à ${ch.hi}">
        <line x1="30" y1="${Y}" x2="975" y2="${Y}" stroke="#fff" stroke-width="4"/><path d="M988 ${Y}l-15-8v16z" fill="#fff"/>${ticks}
        <text x="${X0}" y="${Y+62}" text-anchor="middle" fill="#fff" style="font:800 30px Arial,sans-serif">${ch.lo}</text>
        <text x="${X1}" y="${Y+62}" text-anchor="middle" fill="#fff" style="font:800 30px Arial,sans-serif">${ch.hi}</text>
        <g class="shots"></g><g class="vis" style="display:none"><circle r="26" fill="none" stroke="#ff5a4f" stroke-width="4"/><circle r="3.5" fill="#ff5a4f"/><path d="M-42 0h20M22 0h20M0 -42v20M0 22v20" stroke="#ff5a4f" stroke-width="4"/></g>
      </svg><div class="info"><span class="nb"></span><span class="res"></span></div></div>`;
    const svg=$("svg", b), vis=$(".vis", b), shots=$(".shots", b), lab=$(".lab", b), nb=$(".nb", b), res=$(".res", b);
    let i=0, hits=0, busy=false; const bilan=[];
    const show=()=>{ lab.innerHTML=fmt(ch.targets[i].lab); nb.textContent=`Cible ${i+1} sur ${ch.targets.length}`; busy=false; };
    const toX=e=>{ const r=svg.getBoundingClientRect(); return (e.clientX-r.left)*1000/r.width; };
    svg.addEventListener("pointermove", e=>{ if(busy) return; const x=Math.max(X0-30, Math.min(X1+30, toX(e))); vis.style.display=""; vis.setAttribute("transform", `translate(${x} ${Y})`); });
    svg.addEventListener("pointerleave", ()=>{ vis.style.display="none"; });
    svg.addEventListener("click", async e=>{
      if(busy) return; busy=true;
      const x=toX(e), t=ch.targets[i], tx=X0+W*t.pos/t.sub, step=W/t.sub, ecart=Math.abs(x-tx)/step;
      const ok = ecart <= .35; if(ok) hits++;
      bilan.push(`${t.val} : ${ok?"touché":"raté"}`);
      shots.insertAdjacentHTML("beforeend", `<line x1="${x}" y1="${Y-34}" x2="${x}" y2="${Y+34}" stroke="#ff5a4f" stroke-width="3"/>
        <g><line x1="${tx}" y1="${Y}" x2="${tx}" y2="${Y-58}" stroke="#3ddc97" stroke-width="3"/><rect x="${tx-52}" y="${Y-96}" width="104" height="36" rx="8" fill="#3ddc97"/><text x="${tx}" y="${Y-71}" text-anchor="middle" fill="#0b2a1c" style="font:800 20px Arial,sans-serif">${t.val}</text></g>`);
      vis.style.display="none";
      res.innerHTML = ok ? `<b style="color:var(--ok)">${ecart<.15?"En plein dans le mille !":"Touché !"}</b>` : `<b style="color:#c2410c">Raté : ${t.val} est sur le repère vert.</b>`;
      await wait(ok?1100:2200); if(!alive(tok, card)) return;
      shots.innerHTML=""; res.innerHTML=""; i++;
      if(i<ch.targets.length) return show();
      const unite = ch.zoom ? "Ici, une graduation vaut 0,01 (un centième)." : ch.sub===20 ? "Une graduation vaut 0,1 ; un centième en 5, c'est le milieu entre deux graduations." : "Une graduation vaut 0,1 (un dixième).";
      resolve({ok:hits>=2, fb, html:`${hits} cible${hits>1?"s":""} touchée${hits>1?"s":""} sur 3. ${unite}`});
    });
    show();
  });
}

/* --- à toi d'écrire : intercaler --- */
function playIntercaler(card, ch, pouce){
  return new Promise(resolve=>{
    const [b, fb] = head(card, ch, pouce);
    const lo=dec(...ch.lo), hi=dec(...ch.hi);
    b.innerHTML = `<p class="bst-q">Écris un nombre décimal compris entre <b>${lo}</b> et <b>${hi}</b>.</p>
      <form class="bst-ic"><label for="bsti">${lo} &lt;</label><input id="bsti" inputmode="decimal" autocomplete="off" placeholder="…"><span>&lt; ${hi}</span><button class="btn primary">Valider</button></form><p class="hint" style="margin:0;text-align:center"></p>`;
    const f=$("form", b), inp=$("input", b), hint=$(".hint", b);
    inp.focus({preventScroll:true});
    f.onsubmit=e=>{ e.preventDefault();
      const v=lire(inp.value); if(!v){ hint.textContent="Écris un nombre, avec une virgule si besoin (par exemple 2,35)."; return; }
      const ok = cmpD(ch.lo, v)<0 && cmpD(v, ch.hi)<0;
      inp.disabled=true; $("button", f).disabled=true; inp.classList.add(ok?"correct":"wrong"); hint.textContent="";
      const z = ch.lo[1]===0 ? `Par exemple ${ch.ex1} : ${lo} &lt; ${ch.ex1} &lt; ${hi}.`
        : `${lo} = ${decRaw(ch.lo[0]*10, ch.lo[1]+1)} et ${hi} = ${decRaw(ch.hi[0]*10, ch.hi[1]+1)} : par exemple ${ch.ex1}. Il y en a beaucoup d'autres !`;
      resolve({ok, fb, html: ok ? `D'autres réponses étaient possibles. ${z}` : `${inp.value.trim()} n'est pas entre ${lo} et ${hi}. ${z}`});
    };
  });
}

/* =====================================================================
   LA PARTIE
===================================================================== */
function partie(B, root){
  const tok=++RUN;
  const S={n:0, ok:0, serie:0, best:0, pts:0, pal:1, inPal:0, hist:[], retry:[], bag:[], last:null, pal_skills:{}, all_skills:{}};
  root.innerHTML=`<div class="bst"><div class="bst-top"><span class="pal">Palier <b class="pn">1</b><span class="bar"><i style="width:0%"></i></span></span><span class="serie">Série : <b class="sn">0</b></span><span><b class="pt">0</b> points</span><span class="sp"></span><button type="button" class="bil">Mon bilan</button></div><div class="bst-fil"></div><div class="card bst-card" id="bstcard"></div></div>`;
  const top=$(".bst-top", root), fil=$(".bst-fil", root), card=$("#bstcard", root);
  const maj=cur=>{
    $(".pn", top).textContent=S.pal; $(".bar i", top).style.width=(100*S.inPal/PAL)+"%"; $(".sn", top).textContent=S.serie; $(".pt", top).textContent=S.pts;
    const H=S.hist.slice(-5).map(h=>`<span class="${h.ok?"ok":"ko"}">${h.ok?"✓":"✗"} ${TYPES[h.type].nom}</span>`).join("");
    fil.innerHTML = H + (cur ? `<span class="cur" style="background:${TYPES[cur].c}">${TYPES[cur].nom}</span>` : "") + `<span class="nx">?</span><span class="nx">?</span><span class="nx">?</span>`;
  };
  const nextType=()=>{
    if(!S.bag.length){ S.bag=shuf(Object.keys(TYPES)); if(S.bag[0]===S.last) S.bag.push(S.bag.shift()); }
    return S.bag.shift();
  };
  const note=(skill, ok)=>{ [S.pal_skills, S.all_skills].forEach(o=>{ const x=o[skill]||(o[skill]={n:0, ok:0}); x.n++; if(ok) x.ok++; }); };
  const bilanHTML=(skills)=>{
    const E=Object.entries(skills), m=E.filter(([,x])=>x.ok===x.n).map(([k])=>k), r=E.filter(([,x])=>x.ok<x.n).map(([k])=>k);
    return `<div class="g"><div style="background:var(--okbg)"><b style="color:var(--ok)">Tu maîtrises</b>${m.length?`<ul>${m.map(k=>`<li>${k}</li>`).join("")}</ul>`:"<p style='margin:6px 0 0'>Continue, ça arrive !</p>"}</div>
      <div style="background:#fff1e0;color:#5a2d06"><b>On y revient bientôt</b>${r.length?`<ul>${r.map(k=>`<li>${k}</li>`).join("")}</ul>`:"<p style='margin:6px 0 0'>Rien : bravo !</p>"}</div></div>`;
  };
  const record=()=>{ const R=jg("boost-"+B.key, {pal:0, serie:0, pts:0}); R.pal=Math.max(R.pal, S.pal); R.serie=Math.max(R.serie, S.best); R.pts=Math.max(R.pts, S.pts); js("boost-"+B.key, R); };

  $(".bil", top).onclick=()=>{
    const pause=document.createElement("div"); pause.className="card bst-pal"; pause.style.cssText="position:fixed;inset:auto 16px;top:12vh;max-width:760px;margin:0 auto;z-index:50;box-shadow:0 12px 40px rgba(0,0,0,.25)";
    pause.innerHTML=`<div class="t"><b class="n"><small>PALIER</small>${S.pal}</b><div><h2 style="margin:0">Mon bilan</h2><p style="margin:4px 0 0;color:var(--muted)">${S.n} défis · ${S.ok} réussis · meilleure série : ${S.best} · ${S.pts} points</p></div></div>${bilanHTML(S.all_skills)}<div><button class="btn primary">Reprendre le fil</button></div>`;
    document.body.appendChild(pause); $("button", pause).onclick=()=>pause.remove(); $("button", pause).focus();
    const off=()=>{ pause.remove(); window.removeEventListener("hashchange", off); }; window.addEventListener("hashchange", off);
  };

  (async()=>{
    while(alive(tok, card)){
      /* un défi raté revient, plus simple, 3 défis plus tard */
      let ch, pouce=false, type;
      const due=S.retry.findIndex(r=>r.at<=S.n);
      if(due>=0){ const r=S.retry.splice(due,1)[0]; type=r.type; ch=make(B, type, r.lv, r.skill); pouce=true; }
      else { type=nextType(); ch=make(B, type, lvOf(S.pal)); }
      S.last=type; maj(type); window.scrollTo(0, 0);
      let R;
      card.className="card bst-card";
      if(ch.q) R=await playBanque(card, ch, pouce);
      else if(ch.type==="relier") R=await playRelier(card, ch, pouce);
      else if(ch.type==="detective") R=await playDetective(card, ch, pouce);
      else if(ch.type==="sniper") R=await playSniper(card, ch, pouce, tok);
      else if(ch.type==="intercaler") R=await playIntercaler(card, ch, pouce);
      else R=await playVF(card, ch, pouce, tok);
      if(!alive(tok, card)) return;
      const skill=R.skill||ch.skill;
      S.n++; S.inPal++; note(skill, R.ok); S.hist.push({type, ok:R.ok});
      if(R.ok){ S.ok++; S.serie++; S.best=Math.max(S.best, S.serie); S.pts+=10+(S.serie>=3?5:0); }
      else { S.serie=0; S.retry.push({type, skill, lv:Math.max(1, lvOf(S.pal)-1), at:S.n+3}); }
      record(); maj(null);
      await verdict(R.fb, R.ok, (R.ok && S.serie>=3 ? `Série de ${S.serie} : +15 points ! ` : R.ok ? "+10 points. " : "") + (R.html||""), {sch:R.sch});
      if(!alive(tok, card)) return;
      if(S.inPal>=PAL){
        const fini=S.pal, reussis=S.hist.slice(-PAL).filter(h=>h.ok).length;
        S.pal++; S.inPal=0; record();
        card.className="card bst-card bst-pal";
        card.innerHTML=`<div class="t"><b class="n"><small>PALIER</small>${fini}</b><div><h2 style="margin:0">Palier ${fini} franchi !</h2><p style="margin:4px 0 0;color:var(--muted)">${reussis} défis réussis sur ${PAL} · meilleure série : ${S.best} · ${S.pts} points</p></div></div>
          ${bilanHTML(S.pal_skills)}<p style="margin:0">${S.pal===2?"Au palier 2 : plus de centièmes, des zéros pièges, des arrondis.":S.pal===3?"Au palier 3 : les millièmes arrivent, et les pièges sont plus fins.":"Tu es au niveau le plus difficile : garde ta série le plus longtemps possible !"}</p>
          <div class="fb ok"><div class="bst-auto" style="--d:6000ms"><span>Le fil reprend tout seul…</span><i></i></div><div><button class="btn primary">Continuer maintenant →</button></div></div>`;
        S.pal_skills={}; maj(null);
        await new Promise(r=>{ let d=false; const go=()=>{ if(!d){ d=true; r(); } }; $("button", card).onclick=go; setTimeout(go, 6000); });
      }
    }
  })();
}

/* =====================================================================
   PAGES
===================================================================== */
window.BOOST = window.BOOST || {};
BOOST["6e-5"] = {key:"6e-5", cls:"6e", ch:5, titre:"Le fil des décimaux"};

function page(k){
  const B=BOOST[k], C=CLASSES[B.cls]; document.documentElement.style.setProperty("--c", C.couleur);
  crumbs.innerHTML=`<a href="#accueil">Accueil</a><span aria-hidden="true">›</span><a href="#${B.cls}">${C.nom}</a><span aria-hidden="true">›</span><a href="#boost-${B.cls}">BOOST</a><span aria-hidden="true">›</span><span>Chapitre ${B.ch}</span>`;
  const R=jg("boost-"+k, null), A=app();
  A.innerHTML=`<div class="head"><span class="eyebrow">BOOST · Chapitre ${B.ch} · ${esc(C.chapitres[B.ch-1][0])}</span><h1>${B.titre}</h1>
    <p>Les défis s'enchaînent sans s'arrêter : questions, petits jeux, erreurs à trouver… Tu ne sais jamais ce qui arrive ensuite. Chaque bonne réponse fait avancer ta série !</p></div>
    <div id="bstroot"><div class="bst-home">
      <div class="card" style="display:grid;gap:16px">
        <h2 style="margin:0">Comment ça marche</h2>
        <ol><li>Un défi apparaît : réponds, joue ou trouve l'erreur.</li><li>La correction s'affiche tout de suite, puis le défi suivant arrive tout seul.</li>
          <li>Tous les 10 défis, tu passes un palier. Plus tu montes, plus c'est corsé.</li><li>Une erreur ? Un défi du même genre revient un peu plus tard, plus simple, avec un coup de pouce.</li></ol>
        <div class="bst-chips">${Object.values(TYPES).map(t=>`<span><i style="background:${t.c}"></i>${t.nom}</span>`).join("")}</div>
        <div><button class="btn primary bst-go">C'est parti !</button></div>
      </div>
      <div class="card" style="display:grid;gap:8px"><h3 style="margin:0">Mon record</h3>${R?`<p style="margin:0">Palier ${R.pal} atteint</p><p style="margin:0">Meilleure série : ${R.serie} bonnes réponses d'affilée</p><p style="margin:0">${R.pts} points</p>`:`<p style="margin:0;color:var(--muted)">Pas encore de record : lance-toi !</p>`}
        <p style="margin:6px 0 0;color:var(--muted);font-size:15px">Le fil ne s'arrête jamais : tu joues jusqu'à la sonnerie. Ton record reste sur cet ordinateur.</p></div>
    </div></div>`;
  $(".bst-go", A).onclick=()=>partie(B, $("#bstroot", A));
}
function liste(cls){
  const C=CLASSES[cls]; document.documentElement.style.setProperty("--c", C.couleur);
  crumbs.innerHTML=`<a href="#accueil">Accueil</a><span aria-hidden="true">›</span><a href="#${cls}">${C.nom}</a><span aria-hidden="true">›</span><span>BOOST</span>`;
  const L=Object.values(BOOST).filter(B=>B.cls===cls).sort((a,b)=>a.ch-b.ch);
  app().innerHTML=`<div class="head"><span class="eyebrow">${C.nom} · BOOST</span><h1>Les séances BOOST</h1><p>Un fil de défis qui ne s'arrête jamais, pour retravailler le chapitre en jouant : questions flash, jeux express, erreurs à trouver…</p></div>
    <div class="chaps">${L.map(B=>{ const R=jg("boost-"+B.key, null); return `<a class="chap" href="#boost-${B.key}"><div class="row"><span class="n">Chapitre ${B.ch}</span><span class="st on">Disponible</span></div>
      <h3>${B.titre}</h3><p class="where">${esc(C.chapitres[B.ch-1][0])}${R?` · record : palier ${R.pal}`:""}</p></a>`; }).join("")}</div>
    <p style="color:var(--muted)">Les séances des autres chapitres arriveront au fil de l'année.</p>`;
}
window.PAGES = window.PAGES || {};
["6e"].forEach(cls=>{ PAGES["boost-"+cls]={show:()=>liste(cls), back:["#"+cls,"Retour aux chapitres"]}; });
Object.keys(BOOST).forEach(k=>{ PAGES["boost-"+k]={show:()=>page(k), back:["#boost-"+BOOST[k].cls,"Retour aux séances BOOST"]}; });

/* encadré « Séances BOOST » à la fin de la liste des chapitres (comme un chapitre de plus, d'une autre couleur) */
const _classe = window.classe;
window.classe = function(id){
  _classe(id);
  const L=Object.values(BOOST).filter(B=>B.cls===id); if(!L.length) return;
  const g=$(".chaps", app()); if(!g) return;
  g.insertAdjacentHTML("beforeend", `<a class="chap bst-chap" href="#boost-${id}"><div class="row"><span class="n">Séances BOOST</span><span class="st on">${L.length} séance${L.length>1?"s":""}</span></div>
    <h3>🚀 BOOST</h3><p class="where">Des défis sans fin pour retravailler les chapitres en jouant.</p></a>`);
};

/* pour les vérifications automatiques */
window.BOOST_TEST = {genRelier, genDetective, genVF, genSniper, genIntercaler, lettres, dec, frac, lire, cmpD, DET, VFT};
})();
