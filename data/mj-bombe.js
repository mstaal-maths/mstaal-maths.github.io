/* Mini-jeu « Désamorçage » (3e, équations produit nul) — window.MJ_BOMBE.init(root)
   La bombe affiche une équation. Chaque fil porte une valeur de x : il faut couper tous les fils
   qui sont des solutions, et seulement eux, puis appuyer sur « Désamorcer », avant la fin du compte à rebours.
   Les calculs sont faits en fractions exactes. */
window.MJ_BOMBE = (function(){
"use strict";
const KEY = "staal-mj-bombe3";
/* ---------- fractions exactes ---------- */
const pg=(a,b)=>{ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b,a%b]; } return a||1; };
function R(n,d){ d=d===undefined?1:d; if(d===0) throw new Error("division par 0"); if(d<0){ n=-n; d=-d; } const g=pg(n,d); return {n:n/g+0, d:d/g}; }
const ad=(p,q)=>R(p.n*q.d+q.n*p.d, p.d*q.d), mu=(p,q)=>R(p.n*q.n, p.d*q.d), ne=p=>R(-p.n,p.d);
const eg=(p,q)=>p.n===q.n && p.d===q.d, zr=p=>p.n===0, rv=p=>p.n/p.d;
/* ---------- écriture ---------- */
const MOINS="−", X="<i>x</i>";
const ent = n => (n<0?MOINS:"")+Math.abs(n);
function nb(p){ if(p.d===1) return ent(p.n); return (p.n<0?MOINS:"")+`<span class="mj-bombe-fr"><span>${Math.abs(p.n)}</span><span>${p.d}</span></span>`; }
/* fraction non simplifiée : 6/2 */
function frb(n,d){ const s=(n<0)!==(d<0); return (s?MOINS:"")+`<span class="mj-bombe-fr"><span>${Math.abs(n)}</span><span>${Math.abs(d)}</span></span>`; }
const coef = a => a===1?"":a===-1?MOINS:ent(a);
/* facteur a·x + b (a ≠ 0, entiers) */
function fac(F){
  const {a,b}=F;
  if(b===0) return coef(a)+X;
  if(a>0) return coef(a)+X+(b>0?" + ":" "+MOINS+" ")+Math.abs(b);
  return b+" "+MOINS+" "+(a===-1?"":Math.abs(a))+X;          /* 5 − x, 6 − 2x */
}
function produit(fs){ const mono=fs.filter(F=>F.b===0), autres=fs.filter(F=>F.b!==0);
  return mono.map(fac).join("")+autres.map(F=>"("+fac(F)+")").join(""); }
const racine = F => R(-F.b, F.a);
const valF = (F,x) => ad(mu(R(F.a),x), R(F.b));
/* résolution d'un facteur, en une ligne */
function resout(F){
  const {a,b}=F, r=racine(F);
  if(b===0) return a===1 ? `${X} = 0` : `${fac(F)} = 0 donc ${X} = 0`;
  if(a===1) return `${fac(F)} = 0 donc ${X} = ${nb(r)}`;
  if(a===-1) return `${fac(F)} = 0 donc ${X} = ${nb(r)}`;
  if(a>0){ const q=`${fac(F)} = 0 donc ${a}${X} = ${ent(-b)} donc ${X} = ${frb(-b,a)}`;
    return pg(b,a)>1 ? q+` = ${nb(r)}` : q; }
  const q=`${fac(F)} = 0 donc ${b} = ${Math.abs(a)}${X} donc ${X} = ${frb(b,-a)}`;
  return pg(b,a)>1 ? q+` = ${nb(r)}` : q;
}
const liste = l => l.length<2 ? l.join("") : l.slice(0,-1).join(", ")+" et "+l[l.length-1];

/* ---------- générateurs d'équations ---------- */
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=l=>l[Math.floor(Math.random()*l.length)];
const shuffle=l=>{ for(let i=l.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [l[i],l[j]]=[l[j],l[i]]; } return l; };
const nz=(a,b)=>{ let v; do{ v=rnd(a,b); }while(v===0); return v; };
const lin = (a,b) => ({a,b});
/* équation déjà factorisée : produit = 0 */
function eqProduit(fs, extra){
  const sols=[]; fs.forEach(F=>{ const r=racine(F); if(!sols.some(s=>eg(s,r))) sols.push(r); });
  return Object.assign({eq:`${produit(fs)} = 0`, fs, pre:[], sols, val:x=>fs.reduce((p,F)=>mu(p,valF(F,x)),R(1)), extra:[]}, extra||{});
}
const G = {
  simple(){ let p,q; do{ p=nz(-9,9); q=nz(-9,9); }while(p===q || p===-q || (p>0&&q>0&&Math.random()<.4) || (p<0&&q<0&&Math.random()<.4));
    return eqProduit(shuffle([lin(1,p),lin(1,q)])); },
  coef(){ let r1,r2,a,c; do{ r1=nz(-6,6); r2=nz(-8,8); a=rnd(2,5); c=Math.random()<.6?1:rnd(2,3); }while(r1===r2 || r1===-r2 || Math.abs(a*r1)>30 || Math.abs(c*r2)>24);
    return eqProduit(shuffle([lin(a,-a*r1), lin(c,-c*r2)])); },
  frac(){ let a,b,F2; do{ a=rnd(2,5); b=nz(-9,9); }while(pg(a,b)!==1);
    const k=Math.random();
    if(k<.45) F2=lin(1,nz(-9,9));
    else if(k<.8){ let c,d; do{ c=rnd(2,5); d=nz(-9,9); }while(pg(c,d)!==1 || (c===a&&d===b) || (c===a&&d===-b)); F2=lin(c,d); }
    else { const c=rnd(2,4), r=nz(-5,5); F2=lin(c,-c*r); }
    return eqProduit(shuffle([lin(a,b), F2])); },
  trois(){ for(;;){ const fs=[lin(1,nz(-9,9)), lin(1,nz(-9,9))];
      if(Math.random()<.5){ const a=rnd(2,4), r=nz(-5,5); fs.push(lin(a,-a*r)); }
      else if(Math.random()<.5){ let a,b; do{ a=rnd(2,5); b=nz(-7,7); }while(pg(a,b)!==1); fs.push(lin(a,b)); }
      else fs.push(lin(1,nz(-9,9)));
      const e=eqProduit(shuffle(fs)); if(e.sols.length===3 && !e.sols.some((s,i)=>e.sols.some((t,j)=>j>i && eg(s,ne(t))))) return e; } },
  xfac(){ const k=Math.random();
    if(k<.35) return eqProduit([lin(1,0), lin(1,nz(-9,9))]);
    if(k<.65){ let a,b; do{ a=rnd(2,5); b=nz(-9,9); }while(Math.random()<.5 && pg(a,b)!==1); return eqProduit([lin(1,0), lin(a,b)]); }
    if(k<.9) return eqProduit([lin(rnd(2,9),0), lin(1,nz(-9,9))]);
    let p,q; do{ p=nz(-6,6); q=nz(-6,6); }while(p===q||p===-q); return eqProduit([lin(1,0), lin(1,p), lin(1,q)]); },
  /* équations à factoriser d'abord */
  carre(){ const n=rnd(2,12), forme=Math.random()<.55;
    return eqProduit([lin(1,-n), lin(1,n)], {eq: forme?`${X}² = ${n*n}`:`${X}² ${MOINS} ${n*n} = 0`,
      pre: forme?[`${X}² = ${n*n} donc ${X}² ${MOINS} ${n*n} = 0`, `${X}² ${MOINS} ${n}² = 0`, `(${X} ${MOINS} ${n})(${X} + ${n}) = 0 <span class="mj-bombe-id">(car a² ${MOINS} b² = (a ${MOINS} b)(a + b))</span>`]
                 :[`${X}² ${MOINS} ${n}² = 0`, `(${X} ${MOINS} ${n})(${X} + ${n}) = 0 <span class="mj-bombe-id">(car a² ${MOINS} b² = (a ${MOINS} b)(a + b))</span>`],
      val:x=>ad(mu(x,x),R(-n*n)), extra:[R(n*n), R(-n*n), R(2*n)].concat(n%2?[]:[R(n*n/2)])}); },
  xx(){ const p=pick([-1,1])*rnd(2,9), s=p>0?" + ":" "+MOINS+" ";
    return eqProduit([lin(1,0), lin(1,p)], {eq:`${X}²${s}${Math.abs(p)===1?"":Math.abs(p)}${X} = 0`, pre:[`On factorise par ${X} : ${X}(${fac(lin(1,p))}) = 0`],
      val:x=>ad(mu(x,x),mu(R(p),x)), extra:[R(1)]}); },
  axx(){ const k=rnd(2,5), p=nz(-6,6), s=p>0?" + ":" "+MOINS+" ";
    return eqProduit([lin(k,0), lin(1,p)], {eq:`${k}${X}²${s}${Math.abs(k*p)}${X} = 0`, pre:[`On factorise par ${k}${X} : ${k}${X}(${fac(lin(1,p))}) = 0`],
      val:x=>ad(mu(R(k),mu(x,x)),mu(R(k*p),x)), extra:[R(k*p),R(-k*p),R(k)]}); },
  mxn(){ let m,n; do{ m=rnd(2,5); n=rnd(1,9); }while(pg(m,n)!==1);
    return eqProduit([lin(m,-n), lin(m,n)], {eq:`${m*m}${X}² ${MOINS} ${n*n} = 0`,
      pre:[`(${m}${X})² ${MOINS} ${n}² = 0`, `(${m}${X} ${MOINS} ${n})(${m}${X} + ${n}) = 0 <span class="mj-bombe-id">(car a² ${MOINS} b² = (a ${MOINS} b)(a + b))</span>`],
      val:x=>ad(mu(R(m*m),mu(x,x)),R(-n*n)), extra:[R(n*n,m*m), R(m,n), R(-m,n), R(n)]}); },
  decale(){ let p,n; do{ p=nz(-6,6); n=rnd(1,7); }while(n===Math.abs(p));
    const xp=`${X} ${p>0?"+":MOINS} ${Math.abs(p)}`, forme=Math.random()<.5;
    return eqProduit([lin(1,p-n), lin(1,p+n)], {eq: forme?`(${xp})² = ${n*n}`:`(${xp})² ${MOINS} ${n*n} = 0`,
      pre:(forme?[`(${xp})² ${MOINS} ${n*n} = 0`]:[]).concat([`(${xp})² ${MOINS} ${n}² = 0`, `(${xp} ${MOINS} ${n})(${xp} + ${n}) = 0 <span class="mj-bombe-id">(car a² ${MOINS} b² = (a ${MOINS} b)(a + b))</span>`, `(${fac(lin(1,p-n))})(${fac(lin(1,p+n))}) = 0`]),
      val:x=>{ const y=ad(x,R(p)); return ad(mu(y,y),R(-n*n)); }, extra:[R(n), R(-n), R(-p)]}); },
  /* expert : facteurs écrits « à l'envers » (5 − x, 6 − 2x) */
  envers(){ let a,r,F2; do{ a=-rnd(1,3); r=nz(-6,6); }while(-a*r<=0);
    F2=Math.random()<.5 ? lin(1,nz(-9,9)) : (()=>{ let c,d; do{ c=rnd(2,5); d=nz(-9,9); }while(pg(c,d)!==1); return lin(c,d); })();
    const e=eqProduit(shuffle([lin(a,-a*r), F2])); return e.sols.length===2 && !eg(e.sols[0],ne(e.sols[1])) ? e : G.envers(); }
};
const LV = [
  {nom:"Premiers codes", forme:`(${X} − a)(${X} + b) = 0`, gens:["simple"], fils:5, t:40,
   aide:`Chaque facteur peut être nul : (${X} ${MOINS} 3)(${X} + 4) = 0 donne ${X} = 3 ou ${X} = ${MOINS}4. Attention aux signes !`},
  {nom:"Avec des coefficients", forme:`(a${X} + b)(c${X} + d) = 0`, gens:["coef"], fils:5, t:45,
   aide:`2${X} ${MOINS} 6 = 0 donne 2${X} = 6, donc ${X} = 3 : n'oublie pas de diviser par le coefficient de ${X}.`},
  {nom:"Solutions en fraction", forme:`${X} = a/b`, gens:["frac"], fils:6, t:50,
   aide:`3${X} ${MOINS} 2 = 0 donne 3${X} = 2, donc ${X} = ${frb(2,3)}. La solution peut être une fraction : ne la confonds pas avec son inverse.`},
  {nom:"Trois facteurs", forme:"trois facteurs", gens:["trois"], fils:6, t:50,
   aide:"Avec trois facteurs, il y a trois façons d'obtenir un produit nul : cherche les trois solutions !"},
  {nom:"Le facteur x", forme:`${X}(a${X} + b) = 0`, gens:["xfac"], fils:5, t:45,
   aide:`Dans ${X}(${X} ${MOINS} 5) = 0, le premier facteur est ${X} : ${X} = 0 est une solution. Ne l'oublie pas !`},
  {nom:"Factoriser d'abord", forme:`${X}² = 9, ${X}² ${MOINS} 5${X} = 0…`, gens:["carre","xx","mxn","axx","decale","carre"], fils:6, t:60,
   aide:`Il faut d'abord factoriser : par un facteur commun (${X}² ${MOINS} 5${X} = ${X}(${X} ${MOINS} 5)) ou avec a² ${MOINS} b² = (a ${MOINS} b)(a + b).`},
  {nom:"Expert", forme:"tout à la fois, plus vite", gens:["coef","frac","trois","envers","xfac","carre","mxn","decale","xx","axx"], fils:6, t:40,
   aide:"Tous les types d'équations, et moins de temps. Garde ton calme !"}
];
const NB_BOMBES = 6, VIES = 3;
/* fils pièges : erreurs de signe, division oubliée, inverse… jamais une solution */
function pieges(E, n){
  const g1=[], g2=[], g3=[];
  E.sols.forEach(s=>{ if(!zr(s)) g1.push(ne(s)); });
  E.fs.forEach(F=>{ if(F.b!==0 && Math.abs(F.a)!==1){ g1.push(R(-F.b)); g2.push(R(F.a,-F.b)); g2.push(R(F.b)); }
    if(F.b===0 && Math.abs(F.a)!==1) g1.push(R(F.a)); });
  (E.extra||[]).forEach(v=>g2.push(v));
  E.sols.forEach(s=>{ if(s.d===1){ g3.push(R(s.n+1), R(s.n-1), R(s.n+2), R(s.n-2), R(2*s.n)); } else g3.push(R(s.d,s.n), R(Math.round(rv(s))), R(s.n)); });
  g3.push(R(0), R(1), R(-1), R(2), R(-2), R(3), R(-3), R(4), R(-4), R(5));
  const pris=[], ok=v=>v.d<=25 && Math.abs(rv(v))<=150 && !E.sols.some(s=>eg(s,v)) && !pris.some(p=>eg(p,v));
  [shuffle(g1), shuffle(g2), shuffle(g3)].forEach(g=>g.forEach(v=>{ if(pris.length<n && ok(v)) pris.push(v); }));
  return pris;
}
function bombe(niv, k){
  const C=LV[niv]; const gen=C.gens.length>1 && niv!==LV.length-1 ? C.gens[k%C.gens.length] : pick(C.gens);
  const E=G[gen](); E.type=gen;
  E.pieges=pieges(E, C.fils-E.sols.length);
  E.fils=shuffle(E.sols.map(v=>({v, bon:true})).concat(E.pieges.map(v=>({v, bon:false}))));
  return E;
}
/* ---------- explications ---------- */
function etapes(E){
  const l=E.pre.slice();
  l.push(`<b>Un produit est nul si et seulement si l'un au moins de ses facteurs est nul.</b>`);
  const fs=E.fs; l.push(fs.map(F=>`${fac(F)} = 0`).join(" ou "));
  fs.forEach(F=>l.push(resout(F)));
  const s=E.sols.slice().sort((p,q)=>rv(p)-rv(q)).map(nb);
  l.push(`<b>${s.length>1?"Les solutions sont "+liste(s):"La solution est "+s[0]}.</b>`);
  return l;
}
const ecrit = E => E.pre.length ? `L'équation s'écrit ${produit(E.fs)} = 0. ` : "";
function pourquoiPas(E, x){        /* x n'est pas solution : aucun facteur n'est nul */
  const vals=E.fs.map(F=>valF(F,x));
  return ecrit(E)+`Si ${X} = ${nb(x)} : ${E.fs.map((F,i)=>`${fac(F)} = ${nb(vals[i])}`).join(" et ")}. Aucun facteur n'est nul, donc le produit n'est pas nul : ${X} = ${nb(x)} n'est pas une solution.`;
}
function pourquoiOui(E, x, sans){
  const F=E.fs.find(F=>eg(racine(F),x));
  return (sans?"":ecrit(E))+`Si ${X} = ${nb(x)}, alors ${fac(F)} = 0 : le produit est nul.`;
}

/* ---------- mémoire ---------- */
function charger(){ try{ const o=JSON.parse(localStorage.getItem(KEY)||"{}"); return (o && typeof o==="object")?o:{}; }catch(e){ return {}; } }
function sauver(){ try{ localStorage.setItem(KEY, JSON.stringify(MEM)); }catch(e){} }

/* ---------- interface ---------- */
const VW=780, VH=470, BX=140, BY=14, BW=500, BH=172;
const COUL=["#e03131","#1c7ed6","#f2b705","#2f9e44","#f1f3f5","#ae3ec9"];
const CSS = `
.mj-bombe{--c:var(--c3);display:grid;grid-template-columns:minmax(0,1fr) 400px;gap:16px;align-items:start}
.mj-bombe-scene{position:relative;container-type:inline-size;width:100%;max-width:${VW}px;justify-self:center;border-radius:16px;overflow:hidden;border:2px solid var(--line);background:#2a2f3d}
.mj-bombe-svg{display:block;width:100%;height:auto;user-select:none}
.mj-bombe-svg .fil path{fill:none;stroke-width:9;stroke-linecap:round;transition:transform .45s cubic-bezier(.3,1.6,.5,1)}
.mj-bombe-svg .fil path.ombre{stroke:rgba(0,0,0,.35);stroke-width:11}
.mj-bombe-svg .fil .h{transform-box:fill-box;transform-origin:50% 0}
.mj-bombe-svg .fil .b{transform-box:fill-box;transform-origin:50% 100%}
.mj-bombe-svg .fil.coupe .h{transform:translateY(-10px) rotate(7deg)}
.mj-bombe-svg .fil.coupe .b{transform:translateY(12px) rotate(-6deg)}
.mj-bombe-svg .cuivre{fill:#e8a25a;opacity:0}
.mj-bombe-svg .fil.coupe .cuivre{opacity:1}
.mj-bombe-svg .etin{fill:#ffd43b;animation:mj-bombe-etin .55s ease-out forwards}
@keyframes mj-bombe-etin{from{transform:translate(0,0);opacity:1}to{transform:translate(var(--dx),var(--dy));opacity:0}}
.mj-bombe-lcd{position:absolute;left:${(BX+26)/VW*100}%;top:${(BY+22)/VH*100}%;width:${(BW-52)/VW*100}%;height:${84/VH*100}%;display:grid;place-items:center;background:#0f2a1c;color:#7dffb0;border-radius:10px;border:3px solid #0a1a12;font-weight:700;font-size:min(3.5cqw,1.75rem);text-align:center;padding:0 10px;line-height:1.25;text-shadow:0 0 8px rgba(125,255,176,.45);font-variant-numeric:tabular-nums}
.mj-bombe-lcd i{font-style:italic}
.mj-bombe-etat{font-size:.62em;letter-spacing:.12em;color:#b2f2bb}
.mj-bombe-svg .fil{cursor:pointer}
.mj-bombe-lcd.boum{background:#3a0d0d;color:#ffb4a8;border-color:#200}
.mj-bombe-lcd.ok{background:#0f2a1c;color:#9dffc6}
.mj-bombe-time{position:absolute;left:${(BX+26)/VW*100}%;top:${(BY+116)/VH*100}%;width:${150/VW*100}%;height:${42/VH*100}%;display:grid;place-items:center;background:#1a0606;color:#ff4d4d;border-radius:8px;border:3px solid #000;font:700 min(3.4cqw,1.7rem)/1 ui-monospace,"Courier New",monospace;letter-spacing:.08em;text-shadow:0 0 8px rgba(255,77,77,.6)}
.mj-bombe-time.urg{animation:mj-bombe-clign .5s steps(2) infinite}
@keyframes mj-bombe-clign{50%{color:#ffb3b3}}
.mj-bombe-go{position:absolute;right:${(VW-BX-BW+26)/VW*100}%;top:${(BY+114)/VH*100}%;height:${46/VH*100}%;font:inherit;font-weight:800;font-size:min(2.3cqw,1.1rem);border-radius:12px;border:3px solid #6b0f0f;background:#e03131;color:#fff;padding:0 16px;cursor:pointer;box-shadow:0 4px 0 #6b0f0f}
.mj-bombe-go:hover{background:#f03e3e} .mj-bombe-go:active{transform:translateY(3px);box-shadow:0 1px 0 #6b0f0f}
.mj-bombe-go:disabled{background:#6c757d;border-color:#343a40;box-shadow:none;cursor:default}
.mj-bombe-tags{position:absolute;left:0;right:0;top:${404/VH*100}%;height:${56/VH*100}%}
.mj-bombe-tag{position:absolute;transform:translateX(-50%);top:0;min-width:${100/VW*100}%;height:100%;font:inherit;font-weight:700;font-size:min(2.6cqw,1.25rem);background:#fff8e1;color:#1b2a44;border:3px solid #6b5a2e;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.25em;padding:0 8px;white-space:nowrap;box-shadow:0 3px 0 #6b5a2e}
.mj-bombe-tag:hover:not(:disabled){background:#fff;transform:translateX(-50%) translateY(-2px)}
.mj-bombe-tag:focus-visible{outline:4px solid #ffd43b;outline-offset:2px}
.mj-bombe-tag:disabled{cursor:default}
.mj-bombe-tag.bon{background:#d3f9d8;border-color:#2b8a3e;box-shadow:0 3px 0 #2b8a3e}
.mj-bombe-tag.faux{background:#ffe3e3;border-color:#c92a2a;box-shadow:0 3px 0 #c92a2a}
.mj-bombe-tag.oubli{background:#fff3bf;border-color:#e67700;box-shadow:0 3px 0 #e67700;outline:3px dashed #e67700;outline-offset:2px}
.mj-bombe-fr{display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center;font-size:.8em;line-height:1.05;margin:0 .08em}
.mj-bombe-fr>span:first-child{border-bottom:2px solid currentColor;padding:0 .15em}
.mj-bombe-flash{position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 50% 30%,#fff 0,#ffd43b 18%,#f76707 40%,rgba(224,49,49,.85) 62%,rgba(30,10,10,.9) 100%);opacity:0}
.mj-bombe-flash.on{animation:mj-bombe-flash 1.1s ease-out forwards}
@keyframes mj-bombe-flash{0%{opacity:0}8%{opacity:1}100%{opacity:.18}}
.mj-bombe-boumtxt{position:absolute;left:0;right:0;top:36%;text-align:center;font-family:var(--f-display);font-weight:800;font-size:min(11cqw,5.5rem);color:#fff;text-shadow:0 4px 0 #c92a2a,0 0 30px #f76707;pointer-events:none;opacity:0}
.mj-bombe-boumtxt.on{animation:mj-bombe-boum .9s ease-out forwards}
@keyframes mj-bombe-boum{0%{opacity:0;transform:scale(.4)}30%{opacity:1;transform:scale(1.15)}100%{opacity:1;transform:scale(1)}}
.mj-bombe-scene.secoue{animation:mj-bombe-secoue .45s linear}
@keyframes mj-bombe-secoue{20%{transform:translate(-8px,3px)}40%{transform:translate(7px,-4px)}60%{transform:translate(-5px,2px)}80%{transform:translate(3px,-1px)}}
.mj-bombe-over{position:absolute;inset:0;display:grid;place-items:center;background:rgba(20,24,34,.62);padding:16px}
.mj-bombe-card{background:#fff;color:#15213b;border-radius:16px;padding:18px 22px;max-width:480px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.35)}
.mj-bombe-card h3{font-family:var(--f-display);font-size:1.45rem;margin:0 0 6px}
.mj-bombe-card p{margin:6px 0;color:#2c3a57}
.mj-bombe-card .btn{margin:8px 4px 0;background:#fff;color:#15213b;border-color:#15213b}
.mj-bombe-card .btn.primary{background:#15213b;color:#fff}
.mj-bombe-card .stars{font-size:2rem;letter-spacing:.1em;color:#f59f00}
.mj-bombe-card .stars .v{color:#c9d1e0}
.mj-bombe-card .eqx{font-weight:700;font-size:1.15rem}
.mj-bombe-side{border:2px solid var(--line);border-radius:16px;padding:10px 12px;background:var(--surface);color:var(--ink);display:flex;flex-direction:column;gap:7px;min-width:0}
.mj-bombe-lvs{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
.mj-bombe-lvs button{font:inherit;font-weight:700;font-size:.95rem;border:2px solid var(--line);background:var(--surface);color:var(--ink);border-radius:9px;padding:1px 0 0;cursor:pointer;line-height:1.1;min-width:0}
.mj-bombe-lvs button small{display:block;font-size:.58rem;color:#f59f00;letter-spacing:-.05em;min-height:1.05em}
.mj-bombe-lvs button[aria-current="true"]{background:var(--c);border-color:var(--c);color:#fff}
.mj-bombe-lvs button[aria-current="true"] small{color:#fff}
.mj-bombe-lvs button:disabled{opacity:.4;cursor:not-allowed}
.mj-bombe-h{display:flex;align-items:baseline;justify-content:space-between;gap:8px;flex-wrap:wrap}
.mj-bombe-h h3{font-family:var(--f-display);font-size:1.15rem;margin:0}
.mj-bombe-h span{font-size:.85rem;color:var(--muted);font-weight:600}
.mj-bombe-stats{display:flex;gap:6px}
.mj-bombe-stats div{flex:1 1 0;background:var(--paper);border-radius:10px;padding:2px 6px;text-align:center;line-height:1.25;min-width:0}
.mj-bombe-stats b{display:block;font-family:var(--f-display);font-size:1.12rem;line-height:1.25;white-space:nowrap}
.mj-bombe-stats small{font-size:.75rem;color:var(--muted);font-weight:600}
.mj-bombe-coeur{color:#e03131}.mj-bombe-coeur.v{color:var(--line)}
.mj-bombe-msg{border-radius:12px;padding:6px 12px;background:var(--paper);line-height:1.45;font-size:.93rem;min-height:3em;max-height:15.5em;overflow:auto}
.mj-bombe-msg.ok{background:var(--okbg)} .mj-bombe-msg.ko{background:var(--kobg)}
.mj-bombe-msg p{margin:3px 0}
.mj-bombe-msg ol{margin:4px 0;padding-left:0;list-style:none}
.mj-bombe-msg ol li{padding:1px 0}
.mj-bombe-id{color:var(--muted);font-size:.88em}
.mj-bombe-next{align-self:stretch}
.mj-bombe-tools{display:flex;gap:6px;flex-wrap:wrap}
.mj-bombe-tools .btn{padding:4px 12px;font-size:.88rem}
.mj-bombe-tools .btn[aria-pressed="true"]{background:var(--ink);color:var(--paper)}
.mj-bombe-aides{display:flex;flex-wrap:wrap;column-gap:18px;border-top:1.5px solid var(--line);padding-top:4px}
.mj-bombe-aides details[open]{flex-basis:100%}
.mj-bombe-side details{font-size:.92rem;line-height:1.5;margin:0;border:0;padding:2px 0}
.mj-bombe-side summary{cursor:pointer;font-weight:700}
.mj-bombe-side details p{margin:4px 0}
@media (max-width:980px){.mj-bombe{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){.mj-bombe-svg .fil path{transition:none}.mj-bombe-scene.secoue{animation:none}.mj-bombe-time.urg{animation:none}.mj-bombe-flash.on{animation:none;opacity:.25}.mj-bombe-boumtxt.on{animation:none;opacity:1}.mj-bombe-svg .etin{animation:none;opacity:0}}
`;
let R0=null, MEM={}, niv=0, P=null, B=null, raf=0;
const $ = s => R0.querySelector(s);
const reduit = () => { try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } };
function init(root){
  if(!document.getElementById("mj-bombe-css")){ const st=document.createElement("style"); st.id="mj-bombe-css"; st.textContent=CSS; document.head.appendChild(st); }
  R0=root; MEM=charger(); MEM.lv=MEM.lv||{};
  niv=Math.min(Math.max(0,+MEM.cur||0), LV.length-1); if(!ouvert(niv)) niv=0;
  root.innerHTML=`<div class="mj-bombe">
    <div class="mj-bombe-scene">
      <svg class="mj-bombe-svg" viewBox="0 0 ${VW} ${VH}" aria-hidden="true"></svg>
      <div class="mj-bombe-lcd" id="mjb-lcd" aria-live="polite"></div>
      <div class="mj-bombe-time" id="mjb-time" role="timer" aria-label="Temps restant"></div>
      <button class="mj-bombe-go" type="button" id="mjb-go">Désamorcer !</button>
      <div class="mj-bombe-tags" id="mjb-tags" role="group" aria-label="Fils à couper"></div>
      <div class="mj-bombe-flash" id="mjb-flash"></div><div class="mj-bombe-boumtxt" id="mjb-boum">BOUM !</div>
      <div class="mj-bombe-over" hidden></div>
    </div>
    <aside class="mj-bombe-side">
      <div class="mj-bombe-lvs" role="group" aria-label="Niveaux"></div>
      <div class="mj-bombe-h"><h3 id="mjb-titre"></h3><span id="mjb-rec"></span></div>
      <div class="mj-bombe-stats"><div><b id="mjb-score">0</b><small>points</small></div><div><b id="mjb-num"></b><small>bombe</small></div><div><b id="mjb-vies"></b><small>vies</small></div><div><b id="mjb-serie">0</b><small>série</small></div></div>
      <div class="mj-bombe-msg" id="mjb-msg" aria-live="polite"></div>
      <button class="btn primary mj-bombe-next" type="button" id="mjb-next" hidden>Bombe suivante</button>
      <div class="mj-bombe-tools"><button class="btn" type="button" id="mjb-tt" aria-pressed="false" title="50 % de temps en plus">Tiers-temps</button><button class="btn" type="button" id="mjb-re">Recommencer le niveau</button></div>
      <div class="mj-bombe-aides"><details id="mjb-how"><summary>Comment jouer</summary>
        <p>Chaque fil porte une valeur de <i>x</i>. Coupe <b>tous</b> les fils qui sont des solutions de l'équation, et <b>seulement</b> eux : clique sur le fil ou sur son étiquette (au clavier : Tab puis Entrée).</p>
        <p>Quand tu penses avoir coupé tous les bons fils, appuie sur <b>« Désamorcer ! »</b> avant la fin du compte à rebours. Un mauvais fil, un fil oublié ou le temps écoulé : la bombe explose et tu perds une vie.</p>
        <p>6 bombes par niveau et 3 vies. Plus tu es rapide, plus tu marques de points, et les bombes désamorcées à la suite rapportent un bonus.</p></details>
      <details><summary>Le produit nul</summary>
        <p><b>Un produit est nul si et seulement si l'un au moins de ses facteurs est nul.</b></p>
        <p>(2${X} ${MOINS} 6)(${X} + 4) = 0 ⇔ 2${X} ${MOINS} 6 = 0 ou ${X} + 4 = 0 ⇔ ${X} = 3 ou ${X} = ${MOINS}4.</p>
        <p>Si l'équation n'est pas un produit égal à 0, on factorise d'abord.</p></details></div>
    </aside></div>`;
  if(!MEM.vu){ $("#mjb-how").open=true; MEM.vu=1; sauver(); }
  const tt=$("#mjb-tt"); tt.setAttribute("aria-pressed", MEM.tt?"true":"false");
  tt.onclick=()=>{ MEM.tt=MEM.tt?0:1; sauver(); tt.setAttribute("aria-pressed", MEM.tt?"true":"false");
    if(B && !B.fin){ const f=MEM.tt?1.5:1/1.5; B.reste*=f; B.total*=f; heure(); } };
  $("#mjb-re").onclick=()=>partie(niv);
  $("#mjb-go").onclick=desamorcer;
  $("#mjb-next").onclick=suivante;
  partie(niv);
}
function ouvert(i){ return i===0 || !!(MEM.lv[i-1] && MEM.lv[i-1].st>0); }
function niveaux(){
  const box=$(".mj-bombe-lvs");
  box.innerHTML=LV.map((c,i)=>{ const r=MEM.lv[i], st=r?r.st:0;
    return `<button type="button" data-i="${i}" ${i===niv?'aria-current="true"':""} ${ouvert(i)?"":"disabled"} title="Niveau ${i+1} : ${c.nom}${ouvert(i)?"":" (termine le niveau précédent pour l'ouvrir)"}">${i+1}<small>${st?"★".repeat(st):""}</small></button>`; }).join("");
  box.querySelectorAll("button").forEach(b=>b.onclick=()=>partie(+b.dataset.i));
}
function msg(h,cl){ const m=$("#mjb-msg"); m.className="mj-bombe-msg"+(cl?" "+cl:""); m.innerHTML=h; m.scrollTop=0; }
function stats(){
  $("#mjb-score").textContent=P.score;
  $("#mjb-num").textContent=`${Math.min(P.k+1,NB_BOMBES)}/${NB_BOMBES}`;
  $("#mjb-vies").innerHTML=Array.from({length:VIES},(_,i)=>`<span class="mj-bombe-coeur${i<P.vies?"":" v"}">♥</span>`).join("")+`<span style="position:absolute;left:-9999px">${P.vies} sur ${VIES}</span>`;
  $("#mjb-serie").textContent=P.serie>1?"×"+P.serie:P.serie;
}
function partie(i){
  stop(); niv=i; MEM.cur=i; sauver();
  P={k:0, vies:VIES, score:0, serie:0, faites:0};
  niveaux();
  const C=LV[i]; $("#mjb-titre").innerHTML=`Niveau ${i+1} · ${C.nom}`;
  const r=MEM.lv[i]; $("#mjb-rec").textContent=r?`Record : ${r.sc} points`:"";
  $("#mjb-next").hidden=true;
  msg(`<p>${C.aide}</p>`,"");
  B=null; scene(null); stats();
  carte(`<h3>Niveau ${i+1} : ${C.nom}</h3><p>${C.aide}</p><p>${NB_BOMBES} bombes, ${VIES} vies, ${Math.round(temps())} secondes par bombe.</p><button class="btn primary" type="button" data-go>Commencer</button>`, ()=>armer());
}
function temps(){ return LV[niv].t*(MEM.tt?1.5:1); }
function carte(html, go){
  const o=$(".mj-bombe-over"); o.style.alignItems=""; o.style.background=""; o.innerHTML=`<div class="mj-bombe-card">${html}</div>`; o.hidden=false;
  const b=o.querySelector("[data-go]"); if(b){ b.onclick=()=>{ o.hidden=true; go(); }; }
  o.querySelectorAll("[data-niv]").forEach(x=>x.onclick=()=>partie(+x.dataset.niv));
  setTimeout(()=>{ if(R0 && R0.isConnected && !o.hidden){ const f=o.querySelector(".btn.primary")||o.querySelector(".btn"); if(f) f.focus(); } },30);
}
/* dessin de la bombe et des fils */
function scene(E){
  const n=E?E.fils.length:5, svg=$(".mj-bombe-svg");
  let s=`<defs><linearGradient id="mjb-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5c6378"/><stop offset="1" stop-color="#3a3f4f"/></linearGradient>
    <pattern id="mjb-p" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M0 24L24 0" stroke="rgba(255,255,255,.035)" stroke-width="8"/></pattern></defs>
    <rect width="${VW}" height="${VH}" fill="#2a2f3d"/><rect width="${VW}" height="${VH}" fill="url(#mjb-p)"/>
    <rect x="${BX-30}" y="${BY+24}" width="22" height="${BH-48}" rx="6" fill="#c92a2a" stroke="#7a1414" stroke-width="2"/><rect x="${BX+BW+8}" y="${BY+24}" width="22" height="${BH-48}" rx="6" fill="#c92a2a" stroke="#7a1414" stroke-width="2"/>
    <rect x="${BX-34}" y="${BY+60}" width="${BW+68}" height="14" rx="4" fill="#495057"/><rect x="${BX-34}" y="${BY+110}" width="${BW+68}" height="14" rx="4" fill="#495057"/>
    <rect x="${BX}" y="${BY}" width="${BW}" height="${BH}" rx="18" fill="url(#mjb-g)" stroke="#1d2029" stroke-width="3"/>
    ${[[BX+12,BY+12],[BX+BW-12,BY+12],[BX+12,BY+BH-12],[BX+BW-12,BY+BH-12]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="4.5" fill="#868e96" stroke="#212529"/>`).join("")}
    <circle id="mjb-led" cx="${BX+BW/2+10}" cy="${BY+137}" r="8" fill="#e03131" stroke="#000" stroke-width="2"/>
    <rect x="${BX+40}" y="${BY+BH-2}" width="${BW-80}" height="16" rx="5" fill="#212529"/>
    <rect x="30" y="${VH-74}" width="${VW-60}" height="12" rx="5" fill="#212529"/>`;
  const top=BY+BH+6, bot=VH-68, xs=[...Array(n)].map((_,i)=>BX+60+(BW-120)*(n===1?.5:i/(n-1))), xt=[...Array(n)].map((_,i)=>VW*(i+.5)/n);
  for(let i=0;i<n;i++){ const c=COUL[i%COUL.length], x0=xs[i], x1=xt[i], ym=(top+bot)/2+((i%2)?16:-12), xm=(x0+x1)/2;
    const h=`M${x0} ${top} C${x0} ${top+50} ${xm} ${ym-40} ${xm} ${ym}`, b=`M${xm} ${ym} C${xm} ${ym+40} ${x1} ${bot-40} ${x1} ${bot}`;
    s+=`<g class="fil" data-i="${i}"><g class="h"><path class="ombre" d="${h}" transform="translate(2 3)"/><path d="${h}" stroke="${c}"/><circle class="cuivre" cx="${xm}" cy="${ym}" r="4"/></g>
      <g class="b"><path class="ombre" d="${b}" transform="translate(2 3)"/><path d="${b}" stroke="${c}"/><circle class="cuivre" cx="${xm}" cy="${ym}" r="4"/></g></g>`;
    s+=`<rect x="${x0-9}" y="${top-8}" width="18" height="12" rx="3" fill="#adb5bd" stroke="#212529"/>`; }
  s+=`<g id="mjb-fx"></g>`;
  svg.innerHTML=s;
  const tags=$("#mjb-tags");
  tags.innerHTML=E?E.fils.map((f,i)=>`<button class="mj-bombe-tag" type="button" data-i="${i}" style="left:${xt[i]/VW*100}%" aria-label="Couper le fil x = ${(f.v.n<0?"moins ":"")+Math.abs(f.v.n)+(f.v.d>1?" sur "+f.v.d:"")}">${X} = ${nb(f.v)}</button>`).join(""):"";
  tags.querySelectorAll("button").forEach(b=>b.onclick=()=>couper(+b.dataset.i));
  if(E) svg.querySelectorAll(".fil").forEach(g=>g.addEventListener("click",()=>couper(+g.dataset.i)));
  const lcd=$("#mjb-lcd"); lcd.className="mj-bombe-lcd"; lcd.innerHTML=`<span>${E?E.eq:"Prêt ?"}</span>`;
  $("#mjb-time").classList.remove("urg"); $("#mjb-flash").className="mj-bombe-flash"; $("#mjb-boum").className="mj-bombe-boumtxt";
  $(".mj-bombe-scene").classList.remove("secoue");
  $("#mjb-go").disabled=!E;
  B && heure(); if(!B) $("#mjb-time").textContent=fmtT(temps());
}
const fmtT = t => { const s=Math.max(0,Math.ceil(t)); return Math.floor(s/60)+":"+String(s%60).padStart(2,"0"); };
function heure(){ const e=$("#mjb-time"); e.textContent=fmtT(B.reste); e.classList.toggle("urg", !B.fin && B.reste<=10); }
function armer(){
  const E=bombe(niv, P.k); B={E, coupes:new Set(), fin:false, reste:temps(), total:temps()};
  scene(E); heure(); stats(); $("#mjb-next").hidden=true;
  msg(`<p>Bombe ${P.k+1} : trouve <b>toutes</b> les solutions de l'équation, coupe leurs fils, puis appuie sur « Désamorcer ! ».</p>`,"");
  let last=0;
  const tick=now=>{
    if(!R0 || !R0.isConnected || !B || B.fin || B.E!==E) return;
    if(last){ B.reste-=Math.min(.25,(now-last)/1000); }
    last=now; heure();
    if(B.reste<=0){ B.reste=0; heure(); explose("temps"); return; }
    raf=requestAnimationFrame(tick);
  };
  raf=requestAnimationFrame(tick);
  setTimeout(()=>{ if(R0 && R0.isConnected){ const t=$("#mjb-tags button"); if(t) t.focus(); } },30);
}
function stop(){ cancelAnimationFrame(raf); if(B) B.fin=true; }
function etincelles(x,y){
  if(reduit()) return; let s="";
  for(let k=0;k<9;k++){ const a=Math.PI*2*k/9+Math.random()*.4, d=14+Math.random()*16; s+=`<circle class="etin" cx="${x}" cy="${y}" r="2.5" style="--dx:${(Math.cos(a)*d).toFixed(1)}px;--dy:${(Math.sin(a)*d).toFixed(1)}px"/>`; }
  $("#mjb-fx").insertAdjacentHTML("beforeend",s);
}
function couper(i){
  if(!B || B.fin || B.coupes.has(i)) return;
  const f=B.E.fils[i]; B.coupes.add(i);
  const g=$(`.fil[data-i="${i}"]`); g.classList.add("coupe");
  const c=g.querySelector(".cuivre"); etincelles(+c.getAttribute("cx"), +c.getAttribute("cy"));
  const tag=$(`.mj-bombe-tag[data-i="${i}"]`); tag.disabled=true;
  if(f.bon){ tag.classList.add("bon");
    msg(`<p><b>Bon fil !</b> ${pourquoiOui(B.E, f.v)}</p><p>Y a-t-il d'autres solutions ? Quand tu as fini, appuie sur « Désamorcer ! ».</p>`,"ok");
    const next=[...R0.querySelectorAll(".mj-bombe-tag:not(:disabled)")][0]; if(next) next.focus(); }
  else { tag.classList.add("faux"); explose("fil", f.v); }
}
function desamorcer(){
  if(!B || B.fin) return;
  const manque=B.E.fils.map((f,i)=>i).filter(i=>B.E.fils[i].bon && !B.coupes.has(i));
  if(manque.length){ explose("oubli", manque); return; }
  B.fin=true; cancelAnimationFrame(raf);
  P.serie++; P.faites++;
  const sec=Math.floor(B.reste), gain=100+5*sec+50*(P.serie-1); P.score+=gain;
  const lcd=$("#mjb-lcd"); lcd.className="mj-bombe-lcd ok"; lcd.innerHTML=`<span><small class="mj-bombe-etat">DÉSAMORCÉE</small><br>${B.E.eq}</span>`;
  $("#mjb-led").setAttribute("fill","#40c057"); $("#mjb-go").disabled=true;
  R0.querySelectorAll(".mj-bombe-tag:not(:disabled)").forEach(t=>t.disabled=true);
  msg(`<p><b>Bombe désamorcée ! +${gain} points</b> (100 + ${5*sec} pour les ${sec} s restantes${P.serie>1?` + ${50*(P.serie-1)} de série`:""}).</p><ol>${etapes(B.E).map(l=>`<li>${l}</li>`).join("")}</ol>`,"ok");
  fin();
}
function explose(cause, info){
  B.fin=true; cancelAnimationFrame(raf);
  P.vies--; P.serie=0;
  const E=B.E; let h;
  if(cause==="fil") h=`<p><b>BOUM ! Mauvais fil.</b> ${pourquoiPas(E, info)}</p>`;
  else if(cause==="oubli"){ const v=info.map(i=>E.fils[i].v);
    info.forEach(i=>$(`.mj-bombe-tag[data-i="${i}"]`).classList.add("oubli"));
    h=`<p><b>BOUM ! Il restait ${v.length>1?"des bons fils":"un bon fil"} : ${liste(v.map(x=>`${X} = ${nb(x)}`))}.</b> ${ecrit(E)}${v.map(x=>pourquoiOui(E,x,true)).join(" ")}</p>`; }
  else { h=`<p><b>BOUM ! Temps écoulé.</b></p>`;
    E.fils.forEach((f,i)=>{ if(f.bon && !B.coupes.has(i)) $(`.mj-bombe-tag[data-i="${i}"]`).classList.add("oubli"); }); }
  h+=`<p>La bonne méthode :</p><ol>${etapes(E).map(l=>`<li>${l}</li>`).join("")}</ol>`;
  msg(h,"ko");
  const lcd=$("#mjb-lcd"); lcd.className="mj-bombe-lcd boum"; lcd.innerHTML=`<span>${E.eq}</span>`;
  $("#mjb-go").disabled=true;
  R0.querySelectorAll(".mj-bombe-tag:not(:disabled)").forEach(t=>t.disabled=true);
  $("#mjb-flash").classList.add("on"); $("#mjb-boum").classList.add("on");
  if(!reduit()){ const sc=$(".mj-bombe-scene"); sc.classList.remove("secoue"); void sc.offsetWidth; sc.classList.add("secoue"); }
  fin();
}
function fin(){
  stats();
  const nx=$("#mjb-next");
  if(P.vies<=0){ nx.hidden=true;
    setTimeout(()=>{ if(!R0 || !R0.isConnected) return;
      carte(`<h3>Partie terminée</h3><p>Tu as désamorcé ${P.faites} bombe${P.faites>1?"s":""} sur ${P.k+1}. Lis bien la méthode à droite, puis retente ta chance !</p><p><b>Score : ${P.score} points</b></p><button class="btn primary" type="button" data-niv="${niv}">Rejouer le niveau</button>`);
      const o=$(".mj-bombe-over"); o.style.alignItems="end"; o.style.background="rgba(20,24,34,.35)"; }, 1300);
    return; }
  if(P.k+1>=NB_BOMBES){ nx.hidden=false; nx.textContent="Voir le résultat"; }
  else { nx.hidden=false; nx.textContent="Bombe suivante"; }
  setTimeout(()=>{ if(R0 && R0.isConnected && !nx.hidden) nx.focus(); }, 40);
}
function suivante(){
  if(!B || !B.fin) return;
  if(P.k+1>=NB_BOMBES) return bilan();
  P.k++; armer();
}
function bilan(){
  $("#mjb-next").hidden=true;
  const st=P.vies, r=MEM.lv[niv]||{sc:0,st:0}, rec=P.score>r.sc;
  MEM.lv[niv]={sc:Math.max(r.sc,P.score), st:Math.max(r.st,st)}; sauver(); niveaux();
  $("#mjb-rec").textContent=`Record : ${MEM.lv[niv].sc} points`;
  const suiv=niv+1<LV.length;
  carte(`<h3>Niveau terminé !</h3><div class="stars" aria-label="${st} étoiles sur 3">${"★".repeat(st)}<span class="v">${"★".repeat(3-st)}</span></div>
    <p>${P.faites} bombe${P.faites>1?"s":""} désamorcée${P.faites>1?"s":""} sur ${NB_BOMBES}.</p><p><b>Score : ${P.score} points</b>${rec?" · nouveau record !":""}</p>
    ${st<3?`<p>Pour ★★★, désamorce les ${NB_BOMBES} bombes sans perdre de vie.</p>`:""}
    <button class="btn" type="button" data-niv="${niv}">Rejouer</button>${suiv?`<button class="btn primary" type="button" data-niv="${niv+1}">Niveau suivant</button>`:`<p>Tu as fini tous les niveaux ! Rejoue pour battre tes records.</p>`}`);
}
return {init, _etat:()=>({P,B}), _t:{G, LV, bombe, pieges, etapes, pourquoiPas, pourquoiOui, racine, valF, R, eg, rv, fac, produit, resout, nb}};
})();
