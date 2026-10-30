/* Mini-jeu « Le peintre » (4e, proportionnalité) : reproduire une teinte en mélangeant des pots de peinture
   dans les bonnes proportions. Aucune bibliothèque, aucun appel réseau. */
window.MJ_PEINTRE = (function(){
"use strict";
const CLE = "staal-mj-peintre4";
/* pigments : réflectance (r, v, b) et force colorante ; mélange de Kubelka-Munk, canal par canal */
const PIG = {
  bleu:{nom:"bleu", r:[0.03,0.16,0.62], s:.5},
  jaune:{nom:"jaune", r:[0.92,0.74,0.03], s:1},
  rouge:{nom:"rouge", r:[0.70,0.05,0.07], s:.35},
  blanc:{nom:"blanc", r:[0.94,0.94,0.93], s:2.5},
  noir:{nom:"noir", r:[0.035,0.035,0.04], s:.12}
};
/* mélanges proposés (les noms des teintes dépendent de la couleur dominante) */
const DUOS = [
  {p:["bleu","jaune"], noms:["Vert sapin","Vert prairie","Vert pomme"]},
  {p:["rouge","jaune"], noms:["Rouge tomate","Orange potiron","Orange abricot"]},
  {p:["rouge","blanc"], noms:["Rose framboise","Rose bonbon","Rose dragée"]},
  {p:["bleu","blanc"], noms:["Bleu océan","Bleu jean","Bleu ciel"]},
  {p:["noir","blanc"], noms:["Gris anthracite","Gris souris","Gris perle"]},
  {p:["jaune","noir"], noms:["Vert olive","Kaki","Kaki foncé"]}
];
const TRIOS = [
  {p:["rouge","jaune","blanc"], noms:["Pêche","Saumon","Abricot pâle"]},
  {p:["bleu","jaune","blanc"], noms:["Vert amande","Vert d'eau","Vert tilleul"]},
  {p:["rouge","bleu","blanc"], noms:["Lilas","Mauve","Parme"]},
  {p:["rouge","jaune","noir"], noms:["Marron chocolat","Caramel","Terre de Sienne"]},
  {p:["bleu","jaune","noir"], noms:["Vert kaki","Vert bouteille","Vert mousse"]}
];
const LIEUX = ["la cuisine","le garage","la cabane du jardin","le portail","la chambre de Léa","le vélo de Tom","la porte d'entrée","le bateau","la salle de classe","le banc du parc","la boulangerie","le gymnase","la façade","la niche du chien","le salon","la boîte aux lettres"];
const NB = 4;   /* commandes par niveau */
const LV = [
  {titre:"Coefficient entier", info:"La quantité demandée est un nombre entier de fois la recette."},
  {titre:"Coefficient décimal", info:"Cette fois, le coefficient n'est pas un nombre entier : les quantités peuvent être décimales."},
  {titre:"Trois couleurs", info:"La recette utilise trois pots : chaque quantité est multipliée par le même nombre."},
  {titre:"Un pot déjà versé", info:"Une couleur est déjà dans le seau : trouve combien de fois la recette cela fait."},
  {titre:"Le produit en croix", info:"Complète le tableau de proportionnalité, par exemple avec le produit en croix."},
  {titre:"Défi : le grand chantier", info:"Tout se mélange : trois couleurs, des décimaux, un pot déjà versé…", defi:true}
];

/* ---------- calculs (purs, testés à part) ---------- */
const rnd = n => Math.floor(Math.random()*n);
const pick = a => a[rnd(a.length)];
const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=rnd(i+1); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const pgcd = (a,b) => b ? pgcd(b, a%b) : a;
/* arrondi « propre » pour éviter les erreurs d'écriture des nombres à virgule de l'ordinateur */
const net = x => Math.round(x*1e6)/1e6;
const nbDec = x => { const s=String(net(x)); const i=s.indexOf("."); return i<0?0:s.length-i-1; };
const fr = x => String(net(x)).replace(".", ",");
const lit = x => `${fr(x)}\u00a0L`;
function parse(s){ s=String(s==null?"":s).trim().replace(/\s/g,"").replace(",","."); if(!/^\d+(\.\d+)?$|^\.\d+$/.test(s)) return NaN; return parseFloat(s); }
/* proportions justes : x_i × a_j = x_j × a_i pour tous les pots (la recette a des quantités entières) */
function memeProportions(x, a){ for(let i=0;i<a.length;i++) for(let j=i+1;j<a.length;j++) if(Math.abs(x[i]*a[j]-x[j]*a[i])>1e-9) return false; return x.some(v=>v>0); }
/* couleur */
const ks = R => (1-R)*(1-R)/(2*R), rk = K => 1+K-Math.sqrt(K*K+2*K);
function melange(p, q){ let tot=0; p.forEach((n,i)=>tot+=q[i]*PIG[n].s); if(!(tot>0)) return null;
  return [0,1,2].map(c=>rk(p.reduce((s,n,i)=>s+q[i]*PIG[n].s/tot*ks(PIG[n].r[c]),0))); }
/* l'écart à la teinte voulue est grossi (au moins ×3, et toujours assez pour se voir à l'œil) :
   mêmes proportions → même couleur exactement ; proportions fausses → couleur décalée vers la couleur en trop */
const LOUPE = 3, ECART_MIN = 0.25;
function couleurAffichee(p, a, x){ const ta=a.reduce((s,v)=>s+v,0), tx=x.reduce((s,v)=>s+v,0); if(!(tx>0)) return null;
  const f0=a.map(v=>v/ta), d=x.map((v,i)=>v/tx-f0[i]), tv=d.reduce((s,v)=>s+Math.abs(v),0)/2;
  const g = tv>1e-12 ? Math.max(LOUPE, ECART_MIN/tv) : 0;
  let f=f0.map((v,i)=>Math.max(0, v+g*d[i])); const s=f.reduce((u,v)=>u+v,0); f=f.map(v=>v/s);
  return melange(p, f); }
const enc = v => v<=0.0031308 ? 12.92*v : 1.055*Math.pow(v,1/2.4)-0.055;
const hex = l => "#"+l.map(v=>Math.round(Math.min(1,Math.max(0,enc(v)))*255).toString(16).padStart(2,"0")).join("");
function lab(l){ const [r,g,b]=l; let X=0.4124*r+0.3576*g+0.1805*b, Y=0.2126*r+0.7152*g+0.0722*b, Z=0.0193*r+0.1192*g+0.9505*b; X/=0.95047; Z/=1.08883;
  const f=t=>t>0.008856?Math.cbrt(t):7.787*t+16/116; return [116*f(Y)-16, 500*(f(X)-f(Y)), 200*(f(Y)-f(Z))]; }
const dE = (a,b) => { const A=lab(a), B=lab(b); return Math.hypot(A[0]-B[0],A[1]-B[1],A[2]-B[2]); };
const clair = l => lab(l)[0] > 62;

/* recette au hasard : n quantités entières (1 à 6), pas toutes égales, sans diviseur commun */
function recette(n, max){ for(;;){ const a=Array.from({length:n},()=>1+rnd(max)); if(new Set(a).size<n && n===2) continue; if(a.every(v=>v===a[0])) continue;
  if(a.reduce(pgcd)!==1) continue; const t=a.reduce((s,v)=>s+v,0), f=a.map(v=>v/t); if(f.some(v=>v<.15||v>.75)) continue; return a; } }
/* fabrique une commande pour le niveau i ; type : "total" (quantité totale imposée) ou "verse" (un pot déjà versé) */
function commande(i){
  for(let essai=0; essai<500; essai++){
    let type="total", n=2, k, a, fixe=-1;
    if(i===0){ a=recette(2,6); k=2+rnd(5); }
    else if(i===1){ a=recette(2,6); k=pick([0.5,1.5,2.5,3.5,4.5,1.2,1.4,1.6,1.8,2.2,2.4,0.8,0.6]); }
    else if(i===2){ n=3; a=recette(3,5); k=pick([2,3,4,5,2,3,1.5,2.5]); }
    else if(i===3){ type="verse"; n=pick([2,2,3]); a=recette(n,n===2?6:5); k=pick([2,3,4,5,1.5,2.5,0.5]); fixe=rnd(n); }
    else if(i===4){ type="croix"; a=recette(2,9); fixe=rnd(2); k=null;
      /* on donne c L de la couleur « fixe » : ni c, ni a[fixe] n'est un multiple simple de l'autre */
      const c=pick([2,3,4,5,6,7,8,9,10,12,14,15,16,18,20,21,24,25,27,28,30,32,35,36,40,42,45]);
      if(c%a[fixe]===0 || a[fixe]%c===0 || a[fixe]===1) continue; k=c/a[fixe]; }
    else { const t=pick(["total3","verse3","croix","totalD"]);
      if(t==="total3"){ n=3; a=recette(3,6); k=pick([1.5,2.5,3.5,1.2,0.5,4.5]); }
      else if(t==="verse3"){ type="verse"; n=3; a=recette(3,6); k=pick([1.5,2.5,0.5,3.5,1.2,2.4]); fixe=rnd(3); }
      else if(t==="croix"){ type="croix"; a=recette(2,9); fixe=rnd(2); const c=pick([3,5,7,9,10,14,15,21,25,27,33,35,45]); if(c%a[fixe]===0 || a[fixe]%c===0 || a[fixe]===1) continue; k=c/a[fixe]; }
      else { a=recette(2,9); k=pick([0.5,1.5,2.5,1.2,1.4,0.8,3.5,2.4]); } }
    const x=a.map(v=>net(v*k));
    if(x.some(v=>nbDec(v)>1)) continue;                 /* réponses avec au plus un chiffre après la virgule */
    const tot=net(x.reduce((s,v)=>s+v,0));
    if(tot>60 || x.some(v=>v>45) || tot<2) continue;
    if(type!=="total" && nbDec(x[fixe])>1) continue;
    if(i===1 && Number.isInteger(k)) continue;
    const pal = n===2 ? pick(DUOS) : pick(TRIOS);
    const p = shuffle(pal.p).slice(0,n);
    /* nom : selon la part de la première couleur du mélange de base */
    const f0=a[p.indexOf(pal.p[0])>=0 ? p.indexOf(pal.p[0]) : 0]/a.reduce((s,v)=>s+v,0);
    const nom = pal.noms[ f0>.55?0 : f0>.42?1 : 2 ];
    const C={type, n, p, a, k:net(k), x, tot, fixe, lieu:pick(LIEUX), nom, lv:i};
    C.cible=melange(p, a);
    return C;
  }
  throw new Error("commande impossible");
}

/* ---------- diagnostic d'une réponse (pur, testé à part) ---------- */
/* renvoie {ok, propOK, totOK, raisons:[...], trop, peu} */
function juger(C, x){
  const R={propOK:memeProportions(x, C.a), totOK:true, add:false, inv:false};
  const tx=net(x.reduce((s,v)=>s+v,0));
  if(C.type==="total") R.totOK = Math.abs(tx-C.tot)<1e-9;
  R.ok = R.propOK && R.totOK && x.every((v,i)=>Math.abs(v-C.x[i])<1e-9);
  if(C.type!=="total" && R.propOK) R.ok = R.ok || Math.abs(x[C.fixe]-C.x[C.fixe])<1e-9;
  if(!R.propOK){
    /* même quantité ajoutée à chaque pot (erreur classique : on ajoute au lieu de multiplier) */
    const d=x.map((v,i)=>net(v-C.a[i])); R.add = d.every(v=>Math.abs(v-d[0])<1e-9) && Math.abs(d[0])>1e-9;
    /* quantités inversées (deux couleurs) */
    if(C.n===2 && C.a[0]!==C.a[1] && memeProportions([x[1],x[0]],C.a)) R.inv=true;
    /* couleur en trop / en manque : le rapport x_i / a_i le plus grand et le plus petit */
    const r=x.map((v,i)=>v/C.a[i]); const imax=r.indexOf(Math.max(...r)), imin=r.indexOf(Math.min(...r));
    R.trop=imax; R.peu=imin;
  }
  return R;
}

/* ---------- interface ---------- */
let R0=null, S=null, ST={best:{}, lv:0, vu:false}, keyH=null;
const RM = () => { try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } };
function load(){ try{ const o=JSON.parse(localStorage.getItem(CLE)||"{}"); if(o && typeof o==="object") ST=Object.assign(ST,o); }catch(e){} }
function save(){ try{ localStorage.setItem(CLE, JSON.stringify(ST)); }catch(e){} }
const $ = s => R0.querySelector(s);
const etoiles = pts => pts>=11 ? 3 : pts>=8 ? 2 : pts>0 ? 1 : 0;
const etoilesHTML = n => `<span class="mj-peintre-stars" aria-label="${n} étoile${n>1?"s":""} sur 3">${"★".repeat(n)}<span class="mj-peintre-off">${"★".repeat(3-n)}</span></span>`;
const pastille = n => `<span class="mj-peintre-pas" style="background:${hex(PIG[n].r)}"></span>`;
const maj = t => t[0].toUpperCase()+t.slice(1);
const qte = (v,n) => `<b>${lit(v)} de ${PIG[n].nom}</b>`;

const CSS = `
.mj-peintre{color:var(--ink)}
.mj-peintre-topw{display:flex;align-items:center;gap:14px;margin:0 0 12px;position:relative}
.mj-peintre-top{display:flex;flex-wrap:wrap;align-items:center;gap:8px;flex:1}
.mj-peintre-lv{min-width:46px;height:46px;padding:2px 6px 0;border-radius:12px;border:2px solid var(--line);background:var(--surface);color:var(--ink);font:inherit;font-weight:700;font-size:1rem;cursor:pointer;display:inline-flex;flex-direction:column;align-items:center;justify-content:center;line-height:1}
.mj-peintre-lv small{font-size:.62rem;margin-top:3px;color:#d79a00;letter-spacing:0}
.mj-peintre-lv.on{border-color:var(--c);box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 30%,transparent)}
.mj-peintre-lv.defi{border-color:#f0a43a}
.mj-peintre-total{margin-left:auto;font-weight:600;color:var(--muted);font-size:.95rem}
.mj-peintre details.mj-peintre-help{margin:0;border:0;padding:0}
.mj-peintre-help summary{cursor:pointer;font-weight:600;color:var(--ink);border:2px solid var(--line);background:var(--surface);border-radius:999px;padding:8px 16px;white-space:nowrap}
.mj-peintre-help[open] summary{border-color:var(--c)}
.mj-peintre-hbox{position:absolute;right:0;top:calc(100% + 8px);z-index:5;width:min(640px,100%);background:var(--surface);border:2px solid var(--c);border-radius:16px;padding:14px 18px;box-shadow:0 12px 30px rgba(0,0,0,.18)}
.mj-peintre-help ol{margin:0 0 10px;padding-left:1.3em;line-height:1.5;display:grid;gap:6px}
.mj-peintre-main{display:grid;grid-template-columns:320px minmax(0,1fr) 250px;gap:16px;align-items:start}
.mj-peintre-card{border:2px solid var(--line);border-radius:16px;padding:12px 16px;background:var(--surface)}
.mj-peintre-card h2{font-family:var(--f-display);font-size:1.12rem;margin:0}
.mj-peintre-sous{font-size:.9rem;color:var(--muted);margin:2px 0 8px}
.mj-peintre-cible{height:72px;border-radius:12px;display:flex;align-items:flex-end;padding:8px 12px;font-weight:700;font-size:1.05rem;border:2px solid rgba(0,0,0,.12)}
.mj-peintre-rec{margin:10px 0 0;line-height:1.5}
.mj-peintre-dem{margin-top:8px;font-size:1.08rem;line-height:1.45;padding:8px 12px;border-radius:10px;background:color-mix(in srgb,var(--c) 10%,var(--surface))}
.mj-peintre-pas{display:inline-block;width:.9em;height:.9em;border-radius:50%;vertical-align:-.1em;margin-right:.25em;border:1.5px solid rgba(0,0,0,.25)}
.mj-peintre-tab{border-collapse:collapse;margin-top:8px;font-variant-numeric:tabular-nums}
.mj-peintre-tab th,.mj-peintre-tab td{border:2px solid var(--line);padding:5px 10px;text-align:center}
.mj-peintre-tab th{font-weight:600;text-align:left;background:var(--paper)}
.mj-peintre-tab td.q{font-weight:800;color:var(--c)}
.mj-peintre-mid{display:grid;gap:10px;min-width:0}
.mj-peintre-pots{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}
.mj-peintre-pot{display:grid;justify-items:center;align-content:start;gap:4px;padding:8px 8px 10px;border:2px solid var(--line);border-radius:16px;background:var(--surface);min-width:140px}
.mj-peintre-pot.fixe{border-style:dashed}
.mj-peintre-pot svg{display:block}
.mj-peintre-pot .nm{font-weight:700}
.mj-peintre-in{display:flex;align-items:center;gap:4px}
.mj-peintre-in input{width:3.9em;font:inherit;font-size:1.1rem;font-weight:700;text-align:center;padding:6px 4px;border:2px solid var(--ink);border-radius:10px;background:var(--surface);color:var(--ink)}
.mj-peintre-in input[readonly]{border-style:dashed;color:var(--muted)}
.mj-peintre-in .pm{width:30px;height:38px;border-radius:10px;border:2px solid var(--line);background:var(--surface);color:var(--ink);font:inherit;font-weight:800;font-size:1.15rem;cursor:pointer;line-height:1}
.mj-peintre-act{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}
.mj-peintre-msg{border-radius:12px;padding:10px 14px;line-height:1.5;background:color-mix(in srgb,var(--c) 10%,var(--surface))}
.mj-peintre-msg.ok{background:var(--okbg)} .mj-peintre-msg.ko{background:var(--kobg)} .mj-peintre-msg.mi{background:var(--warnbg)}
.mj-peintre-msg .btn{margin-top:8px;padding:9px 16px}
.mj-peintre-res{display:grid;justify-items:center;gap:6px;text-align:center}
.mj-peintre-res svg{display:block;max-width:100%}
.mj-peintre-cap{display:flex;justify-content:space-between;width:200px;margin-top:-4px;font-size:.88rem;color:var(--muted);font-weight:600}
.mj-peintre-vol{font-weight:700}
.mj-peintre-stars{color:#e0a100;letter-spacing:.05em}
.mj-peintre-off{color:color-mix(in srgb,var(--muted) 45%,transparent)}
.mj-peintre .liq{transition:y .8s ease, height .8s ease, fill .8s ease}
.mj-peintre .demi{transition:fill .8s ease}
@media (prefers-reduced-motion: reduce){ .mj-peintre .liq,.mj-peintre .demi{transition:none} }
@media (max-width:1000px){ .mj-peintre-main{grid-template-columns:1fr} }
`;

function init(root){
  R0=root; load();
  if(!document.getElementById("mj-peintre-css")){ const st=document.createElement("style"); st.id="mj-peintre-css"; st.textContent=CSS; document.head.appendChild(st); }
  root.innerHTML=`<div class="mj-peintre">
    <div class="mj-peintre-topw"><div class="mj-peintre-top" id="mj-peintre-top"></div>
      <details class="mj-peintre-help" id="mj-peintre-help"><summary>Comment jouer ?</summary><div class="mj-peintre-hbox"><ol>
        <li>Lis la recette et la quantité demandée par le client.</li>
        <li>Écris combien de litres tu verses de chaque pot (tu peux utiliser − et +), puis clique sur « Mélanger » ou appuie sur Entrée.</li>
        <li>Si les proportions sont fausses, la couleur n'est pas la bonne. Pour garder la même teinte, on <b>multiplie</b> toutes les quantités par le <b>même nombre</b> : le coefficient de proportionnalité.</li>
        <li>Réussi du premier coup : 3 points, au deuxième essai : 2 points, ensuite : 1 point.</li></ol>
        <button class="btn primary" id="mj-peintre-compris">J'ai compris</button></div></details></div>
    <div class="mj-peintre-main">
      <section class="mj-peintre-card" id="mj-peintre-cmd"></section>
      <section class="mj-peintre-mid"><div class="mj-peintre-pots" id="mj-peintre-pots"></div>
        <div class="mj-peintre-act"><button class="btn primary" id="mj-peintre-go">Mélanger</button><button class="btn" id="mj-peintre-vider">Vider le seau</button></div>
        <div class="mj-peintre-msg" id="mj-peintre-msg" hidden aria-live="polite"></div></section>
      <section class="mj-peintre-card mj-peintre-res" id="mj-peintre-res"></section>
    </div></div>`;
  $("#mj-peintre-go").onclick=melanger;
  $("#mj-peintre-vider").onclick=()=>{ if(!S || S.fini) return; R0.querySelectorAll(".mj-peintre-in input").forEach((el,i)=>{ if(!el.readOnly) el.value=""; }); S.mix=null; resultat(); msg(""); const f=R0.querySelector(".mj-peintre-in input:not([readonly])"); if(f) f.focus(); };
  $("#mj-peintre-compris").onclick=()=>{ $("#mj-peintre-help").open=false; const f=R0.querySelector(".mj-peintre-in input:not([readonly])"); if(f) f.focus(); };
  if(!ST.vu){ $("#mj-peintre-help").open=true; ST.vu=true; save(); }
  if(keyH) document.removeEventListener("keydown", keyH);
  keyH=e=>{ if(!R0 || !R0.isConnected){ document.removeEventListener("keydown", keyH); return; }
    if(e.key!=="Enter" || !S) return;
    const t=e.target; if(t && t.closest && t.closest("button,summary,a")) return;
    const n=$("#mj-peintre-next"); e.preventDefault(); if(n) n.click(); else if(!S.fini) melanger(); };
  document.addEventListener("keydown", keyH);
  let lv=+ST.lv; if(!(lv>=0 && lv<LV.length)) lv=0;
  niveau(lv);
}
function barre(){
  const tot=LV.reduce((s,_,i)=>s+etoiles(ST.best[i]||0),0);
  $("#mj-peintre-top").innerHTML = LV.map((L,i)=>{ const e=etoiles(ST.best[i]||0);
    return `<button class="mj-peintre-lv${i===S.lv?" on":""}${L.defi?" defi":""}" data-i="${i}" title="Niveau ${i+1} : ${L.titre}" aria-label="Niveau ${i+1} : ${L.titre}, ${e} étoile${e>1?"s":""}">${i+1}<small>${"★".repeat(e)||"&nbsp;"}</small></button>`; }).join("")
    + `<span class="mj-peintre-total">Étoiles : ${tot} / ${LV.length*3}</span>`;
  R0.querySelectorAll(".mj-peintre-lv").forEach(b=>b.onclick=()=>niveau(+b.dataset.i));
}
function niveau(i){ ST.lv=i; save(); S={lv:i, k:0, pts:0}; barre(); suivante(); }
function suivante(){
  const C=commande(S.lv); Object.assign(S,{C, essais:0, fini:false, mix:null});
  const L=LV[S.lv];
  /* la commande */
  const rec = C.p.map((n,i)=>`${pastille(n)}${qte(C.a[i],n)}`);
  const recTxt = C.n===2 ? `${rec[0]} pour ${rec[1]}` : `${rec[0]}, ${rec[1]} et ${rec[2]}`;
  let dem;
  if(C.type==="total") dem=`Pour ${C.lieu}, le client veut <b>${lit(C.tot)}</b> de cette teinte.`;
  else if(C.type==="verse") dem=`Pour ${C.lieu}, tu as déjà versé ${qte(C.x[C.fixe], C.p[C.fixe])} dans le seau. Ajoute ce qu'il faut pour obtenir la teinte.`;
  else dem=`Pour ${C.lieu}, tu as déjà versé ${qte(C.x[C.fixe], C.p[C.fixe])}. Combien de ${PIG[C.p[1-C.fixe]].nom} faut-il ?`;
  let tab="";
  if(C.type==="croix") tab=`<table class="mj-peintre-tab"><tr><th></th><th>Recette</th><th>Ton seau</th></tr>${C.p.map((n,i)=>`<tr><th>${pastille(n)}${maj(PIG[n].nom)} (L)</th><td>${fr(C.a[i])}</td><td class="${i===C.fixe?"":"q"}">${i===C.fixe?fr(C.x[i]):"?"}</td></tr>`).join("")}</table>`;
  const cib=hex(C.cible);
  $("#mj-peintre-cmd").innerHTML=`<h2>Niveau ${S.lv+1} · ${L.titre}</h2><div class="mj-peintre-sous">Commande ${S.k+1} / ${NB} · <b>${S.pts} point${S.pts>1?"s":""}</b></div>
    <div class="mj-peintre-cible" style="background:${cib};color:${clair(C.cible)?"#1b2a44":"#fff"}">${C.nom}</div>
    <p class="mj-peintre-rec">Recette : ${recTxt}.</p><div class="mj-peintre-dem">${dem}${tab}</div>`;
  /* les pots */
  $("#mj-peintre-pots").innerHTML=C.p.map((n,i)=>{ const fx=C.type!=="total" && i===C.fixe;
    return `<div class="mj-peintre-pot${fx?" fixe":""}">${pot(n)}<span class="nm">${maj(PIG[n].nom)}</span>
      <div class="mj-peintre-in">${fx?"":`<button class="pm" data-i="${i}" data-d="-1" aria-label="1 litre de ${PIG[n].nom} en moins" title="1 L de moins">−</button>`}
      <input id="mj-peintre-q${i}" inputmode="decimal" autocomplete="off" aria-label="Litres de ${PIG[n].nom}" ${fx?`value="${fr(C.x[i])}" readonly`:`value="" placeholder="?"`}><span>L</span>
      ${fx?"":`<button class="pm" data-i="${i}" data-d="1" aria-label="1 litre de ${PIG[n].nom} en plus" title="1 L de plus">+</button>`}</div>${fx?`<small class="mj-peintre-sous" style="margin:0">déjà versé</small>`:""}</div>`; }).join("");
  R0.querySelectorAll(".mj-peintre-in .pm").forEach(b=>b.onclick=()=>{ const el=$("#mj-peintre-q"+b.dataset.i); let v=parse(el.value); if(isNaN(v)) v=0; v=net(Math.max(0, v + +b.dataset.d)); el.value=fr(v); });
  $("#mj-peintre-go").disabled=false; $("#mj-peintre-vider").disabled=false;
  msg(""); resultat(true);
  const f=R0.querySelector(".mj-peintre-in input:not([readonly])"); if(f && !$("#mj-peintre-help").open) f.focus({preventScroll:true});
}
function pot(n){ const c=hex(PIG[n].r);
  return `<svg width="76" height="78" viewBox="0 0 76 78" aria-hidden="true"><ellipse cx="38" cy="12" rx="30" ry="7" fill="#c9ced8" stroke="#6b7280" stroke-width="2"/>
    <path d="M8 12V66Q8 74 38 74Q68 74 68 66V12" fill="#e7eaf0" stroke="#6b7280" stroke-width="2"/>
    <path d="M8 30H68V54H8Z" fill="${c}"/><ellipse cx="38" cy="12" rx="25" ry="5" fill="${c}"/>
    <path d="M14 30V54" stroke="rgba(255,255,255,.35)" stroke-width="4"/></svg>`; }
/* le seau et la comparaison des teintes */
function resultat(neuf){
  const C=S.C, cib=hex(C.cible), m=S.mix;
  const tx = m ? m.tot : 0, ref = C.type==="total" ? C.tot : null;
  const max = Math.max(ref||0, tx, C.tot)*1.15 || 1;
  const H=110, h = m ? Math.min(H, H*tx/max) : 0, col = m ? hex(m.col) : "#ffffff";
  const ligne = ref ? H - H*ref/max : null;
  const disque = `<svg width="200" height="130" viewBox="0 0 230 150" role="img" aria-label="À gauche la teinte voulue, à droite ton mélange">
    <path d="M115 6A69 69 0 0 0 115 144Z" fill="${cib}"/><path class="demi" d="M115 6A69 69 0 0 1 115 144Z" fill="${m?col:"#f2f4f7"}"/>
    ${m?"":`<text x="150" y="80" text-anchor="middle" style="font:700 12px Arial,sans-serif" fill="#8a94a6">?</text>`}
    <circle cx="115" cy="75" r="69" fill="none" stroke="#6b7280" stroke-width="2"/><path d="M115 6V144" stroke="#fff" stroke-width="2"/></svg>`;
  const seau = `<svg width="210" height="${H+30}" viewBox="0 0 210 ${H+30}" role="img" aria-label="Le seau : ${m?lit(tx):"vide"}${ref?`, il faut ${lit(ref)}`:""}">
    <defs><clipPath id="mj-peintre-clip"><path d="M64 10L76 ${H+20}H162L174 10Z"/></clipPath></defs>
    <path d="M64 10L76 ${H+20}H162L174 10Z" fill="#f4f6fa"/>
    <g clip-path="url(#mj-peintre-clip)"><rect class="liq" x="54" y="${10+H-h}" width="130" height="${h+20}" fill="${col}"/></g>
    ${ligne!=null?`<path d="M58 ${10+ligne}H180" stroke="#d93025" stroke-width="2" stroke-dasharray="5 4"/><text x="54" y="${14+ligne}" text-anchor="end" style="font:700 13px Arial,sans-serif" fill="#d93025">${fr(ref)} L</text>`:""}
    <path d="M64 10L76 ${H+20}H162L174 10" fill="none" stroke="#6b7280" stroke-width="3" stroke-linejoin="round"/><path d="M60 10H178" stroke="#6b7280" stroke-width="4" stroke-linecap="round"/></svg>`;
  $("#mj-peintre-res").innerHTML=`<h2 style="font-family:var(--f-display);font-size:1.12rem;margin:0">Le résultat</h2>${disque}<div class="mj-peintre-cap"><span>Teinte voulue</span><span>Ton mélange</span></div>${seau}
    <div class="mj-peintre-vol">${m?`Dans le seau : ${lit(tx)}`:"Le seau est vide."}</div>`;
}
function lire(){ const C=S.C; return C.p.map((_,i)=>parse($("#mj-peintre-q"+i).value)); }
function melanger(){
  if(!S || S.fini) return;
  const C=S.C, x=lire();
  if(x.some(v=>isNaN(v))){ msg(`Écris une quantité pour chaque pot (un nombre, par exemple 7 ou 7,5).`, "mi"); const k=x.findIndex(v=>isNaN(v)); const el=$("#mj-peintre-q"+k); if(el) el.focus(); return; }
  if(x.every(v=>v===0)){ msg(`Le seau est vide : verse de la peinture !`, "mi"); return; }
  const tx=net(x.reduce((s,v)=>s+v,0));
  S.mix={tot:tx, col:couleurAffichee(C.p, C.a, x)||[1,1,1]};
  resultat();
  const R=juger(C, x);
  if(R.ok){ gagne(); return; }
  S.essais++;
  const nomP=i=>PIG[C.p[i]].nom;
  let h;
  if(R.propOK){ /* seule la quantité totale est fausse */
    h=`<b>La teinte est parfaite !</b> Les proportions sont justes. Mais le client veut <b>${lit(C.tot)}</b> et ton seau contient ${lit(tx)} : ${tx<C.tot?"il n'y en a pas assez":"il y en a trop"}.`;
  } else {
    h=`<b>Ce n'est pas la bonne teinte.</b> `;
    if(R.add) h+=`Tu as <b>ajouté</b> la même quantité à chaque pot : les proportions changent, donc la couleur aussi. Pour garder la teinte, il faut <b>multiplier</b> chaque quantité par le même nombre.`;
    else if(R.inv) h+=`On dirait que tu as <b>inversé</b> les quantités : la recette met ${lit(C.a[0])} de ${nomP(0)} pour ${lit(C.a[1])} de ${nomP(1)}.`;
    else h+= C.n===2 ? `Il y a trop de <b>${nomP(R.trop)}</b> par rapport au ${nomP(R.peu)}.` : `Il y a trop de <b>${nomP(R.trop)}</b> et pas assez de <b>${nomP(R.peu)}</b>.`;
  }
  h+="<br>"+(S.essais>=2 ? solution(C) : indice(C));
  msg(h, R.propOK ? "mi" : "ko");
}
/* aide après une erreur (sans donner la réponse) */
function indice(C){
  const sA=C.a.reduce((s,v)=>s+v,0);
  if(C.type==="total") return `<b>Aide :</b> la recette fait ${C.a.map(fr).join(" + ")} = ${lit(sA)}. Combien de fois faut-il la faire pour obtenir ${lit(C.tot)} ? Calcule ${fr(C.tot)} ÷ ${fr(sA)}, puis multiplie chaque quantité par ce nombre.`;
  const f=C.fixe;
  if(C.type==="verse") return `<b>Aide :</b> tu as ${lit(C.x[f])} de ${PIG[C.p[f]].nom} au lieu de ${lit(C.a[f])}. Calcule ${fr(C.x[f])} ÷ ${fr(C.a[f])} : c'est le coefficient. Multiplie les autres quantités de la recette par ce nombre.`;
  return `<b>Aide :</b> dans le tableau, le produit en croix donne ? = ${fr(C.x[f])} × ${fr(C.a[1-f])} ÷ ${fr(C.a[f])}.`;
}
/* correction complète (à partir du deuxième essai raté) */
function solution(C){
  const f=C.fixe, sA=C.a.reduce((s,v)=>s+v,0), k=fr(C.k);
  const lignes=C.p.map((n,i)=>(C.type!=="total"&&i===f)?null:`${maj(PIG[n].nom)} : ${fr(C.a[i])} × ${k} = <b>${lit(C.x[i])}</b>`).filter(Boolean);
  if(C.type==="total") return `<b>Correction :</b> ${fr(C.tot)} ÷ ${fr(sA)} = ${k}, donc on multiplie tout par ${k} (le coefficient de proportionnalité). ${lignes.join(" ; ")}. Écris ces quantités puis mélange.`;
  if(C.type==="verse") return `<b>Correction :</b> ${fr(C.x[f])} ÷ ${fr(C.a[f])} = ${k}, c'est le coefficient. ${lignes.join(" ; ")}. Écris ces quantités puis mélange.`;
  return `<b>Correction :</b> ? = ${fr(C.x[f])} × ${fr(C.a[1-f])} ÷ ${fr(C.a[f])} = ${fr(net(C.x[f]*C.a[1-f]))} ÷ ${fr(C.a[f])} = <b>${lit(C.x[1-f])}</b> de ${PIG[C.p[1-f]].nom}. Écris cette quantité puis mélange.`;
}
function gagne(){
  const C=S.C; S.fini=true; const p = S.essais===0 ? 3 : S.essais===1 ? 2 : 1; S.pts+=p;
  $("#mj-peintre-go").disabled=true; $("#mj-peintre-vider").disabled=true;
  R0.querySelectorAll(".mj-peintre-in input, .mj-peintre-in .pm").forEach(el=>el.disabled=true);
  const sous=$("#mj-peintre-cmd .mj-peintre-sous"); if(sous) sous.innerHTML=`Commande ${S.k+1} / ${NB} · <b>${S.pts} point${S.pts>1?"s":""}</b>`;
  const coef = C.type==="croix" ? `` : ` Toutes les quantités de la recette ont été multipliées par <b>${fr(C.k)}</b>.`;
  let h=`<b>Parfait, c'est exactement la teinte « ${C.nom} » !</b> +${p} point${p>1?"s":""}.${coef}`;
  const dernier = S.k===NB-1;
  if(dernier){
    const avant=ST.best[S.lv]||0, rec=S.pts>avant; if(rec){ ST.best[S.lv]=S.pts; save(); }
    h+=`<br><b>Niveau terminé : ${S.pts} / ${NB*3}</b> ${etoilesHTML(etoiles(S.pts))}${rec&&avant?" · record !":""}<br>`;
    h+= S.lv<LV.length-1 ? `<button class="btn primary" id="mj-peintre-next">Niveau suivant →</button> <button class="btn" id="mj-peintre-rejouer">Rejouer</button>` : `<button class="btn primary" id="mj-peintre-rejouer">Rejouer ce défi</button>`;
  } else h+=`<br><button class="btn primary" id="mj-peintre-next">Commande suivante →</button>`;
  msg(h,"ok"); if(dernier) barre();
  const n=$("#mj-peintre-next"); if(n){ n.onclick=()=>{ if(dernier) niveau(S.lv+1); else { S.k++; suivante(); } }; n.focus({preventScroll:true}); }
  const rj=$("#mj-peintre-rejouer"); if(rj){ rj.onclick=()=>niveau(S.lv); if(!n) rj.focus({preventScroll:true}); }
}
function msg(h,k){ const el=$("#mj-peintre-msg"); if(!el) return; el.hidden=!h; el.className="mj-peintre-msg "+(k||""); el.innerHTML=h; }

return {init, _t:{LV, PIG, DUOS, TRIOS, commande, juger, memeProportions, melange, couleurAffichee, dE, hex, parse, fr, net, nbDec, NB, LOUPE}};
})();
