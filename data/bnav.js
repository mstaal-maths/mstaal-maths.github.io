/* Bataille navale du repère (5e, chapitre Nombres relatifs, repérage dans le plan).
   L'élève tire en ÉCRIVANT des coordonnées ; quand l'ordinateur tire, l'élève doit CLIQUER sur le point annoncé.
   Deux niveaux : nombres positifs (0 à 8), puis nombres relatifs (−5 à 5). Les bateaux sont posés sur les points du quadrillage. */
window.BNAV = (function(){
const MODES = {
  pos:{nom:"Nombres positifs", min:0, max:8},
  rel:{nom:"Nombres relatifs", min:-5, max:5}
};
const TAILLES=[4,3,3,2];
const fmt = v => String(v).replace("-","−");
const co = (x,y) => `(${fmt(x)} ; ${fmt(y)})`;
let R0=null, M=null, mode="rel", moi=null, lui=null, tour="eleve", attente=null, fini=false, tirs=0, ia=null, dernier="", minuteur=null;
const KEY="staal-bnav5-";
const store={ get(k){ try{ return localStorage.getItem(KEY+k); }catch(e){ return null; } }, set(k,v){ try{ localStorage.setItem(KEY+k,v); }catch(e){} } };
const $ = id => R0.querySelector("#"+id);
const tactile = () => { try{ return matchMedia("(pointer: coarse)").matches; }catch(e){ return false; } };   /* écran tactile : on écrit avec le pavé du jeu */
const rnd = (a,b) => a+Math.floor(Math.random()*(b-a+1));
function flotte(){
  for(let essai=0; essai<500; essai++){
    const bat=[], pris=new Set(), ok=TAILLES.every(n=>{
      for(let t=0;t<200;t++){ const h=Math.random()<.5, x=rnd(M.min, M.max-(h?n-1:0)), y=rnd(M.min+(h?0:n-1), M.max);
        const cases=[...Array(n)].map((_,k)=>h?[x+k,y]:[x,y-k]);
        /* pas de bateaux collés : on garde une case libre autour */
        if(cases.some(([a,b])=>{ for(let i=-1;i<=1;i++) for(let j=-1;j<=1;j++) if(pris.has((a+i)+","+(b+j))) return true; return false; })) continue;
        cases.forEach(([a,b])=>pris.add(a+","+b)); bat.push({cases, touches:new Set()}); return true; }
      return false; });
    if(ok) return {bat, tirs:new Map()};
  }
}
function init(root){
  R0=root; mode=store.get("mode")||"rel";
  root.innerHTML=`<div class="bnav">
    <div class="bmodes" id="bmodes"></div>
    <div class="bgrid">
      <section class="bzone" id="zlui"><h3>Flotte de l'ordinateur <span class="bici">tu tires ici</span></h3><div id="blui"></div></section>
      <section class="bzone" id="zmoi"><h3>Ma flotte <span class="bici">l'ordinateur tire ici</span></h3><div id="bmoi"></div></section>
      <aside class="gside bside">
        <div id="bpanneau"></div>
        <div class="lmsg" id="bmsg" hidden></div>
        <p class="where" id="bscore"></p>
        <button class="btn" id="bnew">Nouvelle partie</button>
        <details class="lhelp"><summary>Rappel : lire des coordonnées</summary><p>Un point est repéré par deux nombres : d'abord l'<b>abscisse</b> (on se déplace horizontalement, à droite si elle est positive, à gauche si elle est négative), puis l'<b>ordonnée</b> (on monte si elle est positive, on descend si elle est négative). On écrit par exemple <b>(−3 ; 2)</b>.</p></details>
      </aside>
    </div></div>`;
  $("bnew").onclick=nouvelle;
  nouvelle();
}
function nouvelle(){
  M=MODES[mode]; store.set("mode",mode);
  $("bmodes").innerHTML=Object.entries(MODES).map(([k,v])=>`<button class="btn bmode${k===mode?" on":""}" data-m="${k}">${v.nom} (de ${fmt(v.min)} à ${v.max})</button>`).join("");
  R0.querySelectorAll(".bmode").forEach(b=>b.onclick=()=>{ mode=b.dataset.m; nouvelle(); });
  clearTimeout(minuteur); moi=flotte(); lui=flotte(); tour="eleve"; attente=null; fini=false; tirs=0; ia={cibles:[]}; dernier="";
  msg(""); panneau(); draw();
}
const SZ=()=>M.max-M.min;   /* nombre d'intervalles */
function svgRepere(id, F, montrer){
  const n=SZ(), pad=1.1, size=n+2*pad, X=x=>pad+(x-M.min), Y=y=>pad+(M.max-y);
  let g=`<svg viewBox="0 0 ${size} ${size}" class="bsvg" data-g="${id}" role="img" aria-label="Repère">`;
  g+=`<rect width="${size}" height="${size}" fill="#f2f8ff"/>`;
  for(let v=M.min; v<=M.max; v++){ g+=`<line x1="${X(v)}" y1="${Y(M.min)}" x2="${X(v)}" y2="${Y(M.max)}" class="bq"/><line x1="${X(M.min)}" y1="${Y(v)}" x2="${X(M.max)}" y2="${Y(v)}" class="bq"/>`; }
  const ox=Math.max(M.min,0), oy=Math.max(M.min,0);
  g+=`<line x1="${X(M.min)-.4}" y1="${Y(oy)}" x2="${X(M.max)+.55}" y2="${Y(oy)}" class="bax"/><line x1="${X(ox)}" y1="${Y(M.min)+.4}" x2="${X(ox)}" y2="${Y(M.max)-.55}" class="bax"/>`;
  g+=`<path d="M${X(M.max)+.55} ${Y(oy)}l-.25 -.13v.26z" class="baxf"/><path d="M${X(ox)} ${Y(M.max)-.55}l-.13 .25h.26z" class="baxf"/>`;
  for(let v=M.min; v<=M.max; v++){ if(v!==0 || M.min===0){
      g+=`<text x="${X(v)}" y="${Y(oy)+.42}" class="bnum" text-anchor="middle">${fmt(v)}</text>`; }
    if(v!==0) g+=`<text x="${X(ox)-.18}" y="${Y(v)+.12}" class="bnum" text-anchor="end">${fmt(v)}</text>`; }
  if(M.min<0) g+=`<text x="${X(0)-.15}" y="${Y(0)+.42}" class="bnum" text-anchor="end">0</text>`;
  g+=`<text x="${X(M.max)+.5}" y="${Y(oy)-.2}" class="bnum b">x</text><text x="${X(ox)+.2}" y="${Y(M.max)-.4}" class="bnum b">y</text>`;
  /* bateaux */
  F.bat.forEach(b=>{ const coule=b.touches.size===b.cases.length; if(!montrer && !coule) return;
    const xs=b.cases.map(c=>X(c[0])), ys=b.cases.map(c=>Y(c[1]));
    g+=`<rect x="${Math.min(...xs)-.32}" y="${Math.min(...ys)-.32}" width="${Math.max(...xs)-Math.min(...xs)+.64}" height="${Math.max(...ys)-Math.min(...ys)+.64}" rx=".32" class="bbat${coule?" coule":""}"/>`; });
  /* tirs */
  F.tirs.forEach((res,k)=>{ const [x,y]=k.split(",").map(Number);
    g+= res==="eau" ? `<circle cx="${X(x)}" cy="${Y(y)}" r=".14" class="beau"/>` : `<path d="M${X(x)-.22} ${Y(y)-.22}L${X(x)+.22} ${Y(y)+.22}M${X(x)+.22} ${Y(y)-.22}L${X(x)-.22} ${Y(y)+.22}" class="btouche"/>`; });
  /* zone de clic (points du quadrillage) sur ma flotte */
  if(id==="moi") for(let x=M.min;x<=M.max;x++) for(let y=M.min;y<=M.max;y++) g+=`<circle cx="${X(x)}" cy="${Y(y)}" r=".42" class="bclic" data-x="${x}" data-y="${y}"/>`;
  return g+"</svg>";
}
function draw(){
  $("blui").innerHTML=svgRepere("lui", lui, fini);
  $("bmoi").innerHTML=svgRepere("moi", moi, true);
  R0.querySelectorAll(".bclic").forEach(c=>c.onclick=()=>clicMoi(+c.dataset.x, +c.dataset.y));
  const zl=$("zlui"), zm=$("zmoi"); zl.classList.toggle("actif", !fini&&tour==="eleve"); zm.classList.toggle("actif", !fini&&tour!=="eleve");
  $("bscore").textContent = `Bateaux de l'ordinateur coulés : ${lui.bat.filter(b=>b.touches.size===b.cases.length).length} sur ${lui.bat.length} · tes bateaux coulés : ${moi.bat.filter(b=>b.touches.size===b.cases.length).length} sur ${moi.bat.length}`;
}
function panneau(){
  const p=$("bpanneau");
  if(fini){ p.innerHTML=""; return; }
  const barre=`<div class="btour" aria-label="À qui de jouer"><span class="${tour==="eleve"?"on":""}">① À toi</span><span class="${tour!=="eleve"?"on":""}">② À l'ordinateur</span></div>`;
  if(tour==="eleve"){
    p.innerHTML=barre+`<h3>À toi de tirer !</h3><p>Écris les coordonnées du point où tu tires, sur la <b>flotte de l'ordinateur</b>.</p>
      <form id="bform" class="bform"><label for="bin">Je tire en</label><input id="bin" class="bin" autocomplete="off" placeholder="( x ; y )" inputmode="${tactile()?"none":"text"}"><button class="btn primary">Feu !</button></form>
      <div class="bkeys">${["−","0","1","2","3","4","5","6","7","8","9",";",",","(",")","⌫"].filter(k=>mode==="rel"||k!=="−").map(k=>`<button class="ckey bk" data-k="${k}">${k}</button>`).join("")}</div>`;
    const inp=$("bin"); if(!tactile()) setTimeout(()=>inp.focus({preventScroll:true}),0);
    $("bform").onsubmit=e=>{ e.preventDefault(); tirer(inp.value); };
    R0.querySelectorAll(".bk").forEach(b=>b.onclick=e=>{ e.preventDefault(); const k=b.dataset.k; if(k==="⌫") inp.value=inp.value.slice(0,-1); else inp.value+=k; if(!tactile()) inp.focus({preventScroll:true}); });
  } else if(tour==="reflexion"){
    p.innerHTML=barre+`<div class="bres">${dernier}</div><h3>Maintenant, c'est l'ordinateur qui tire…</h3><p class="bannonce bpense">L'ordinateur réfléchit<span>.</span><span>.</span><span>.</span></p>`;
  } else {
    p.innerHTML=barre+`<div class="bres">${dernier}</div><h3>C'est l'ordinateur qui tire !</h3><p class="bannonce">« Je tire en <b>${co(attente[0],attente[1])}</b>. »</p><p>Clique sur ce point dans <b>ta flotte</b> (le repère « Ma flotte ») pour voir s'il t'a touché.</p>`;
  }
}
function lire(t){
  const s=t.replace(/[−–]/g,"-").replace(/\s+/g,"");
  if(/^\(?-?\d+,-?\d+\)?$/.test(s)) return "virgule";
  const m=/^\(?(-?\d+);(-?\d+)\)?$/.exec(s);
  if(!m) return null; return [+m[1], +m[2]];
}
function tirer(t){
  if(fini||tour!=="eleve") return;
  const c=lire(t);
  if(c==="virgule") return msg(`<b>Attention à la virgule !</b> Entre l'abscisse et l'ordonnée, on met toujours un <b>point-virgule « ; »</b>. La virgule sert à écrire les nombres décimaux : ${esc(t)} pourrait se lire comme un seul nombre ! Écris par exemple <b>(3 ; 2)</b>.`, "ko");
  if(!c) return msg("Écris les coordonnées comme ceci : <b>(3 ; −2)</b>, avec l'abscisse d'abord, puis l'ordonnée, séparées par un point-virgule.", "ko");
  const [x,y]=c;
  if(x<M.min||x>M.max||y<M.min||y>M.max) return msg(`Le point ${co(x,y)} est en dehors du repère : les coordonnées vont de ${fmt(M.min)} à ${M.max}.`, "ko");
  const k=x+","+y; if(lui.tirs.has(k)) return msg(`Tu as déjà tiré en ${co(x,y)} ! Choisis un autre point.`, "ko");
  tirs++;
  const b=lui.bat.find(b=>b.cases.some(([a,bb])=>a===x&&bb===y));
  let r;
  if(b){ b.touches.add(k); lui.tirs.set(k,"touche"); r = b.touches.size===b.cases.length ? `<b>Touché, coulé !</b> en ${co(x,y)}.` : `<b>Touché !</b> en ${co(x,y)}.`; }
  else { lui.tirs.set(k,"eau"); r=`<b>À l'eau</b> en ${co(x,y)}.`; }
  if(lui.bat.every(b=>b.touches.size===b.cases.length)){ fini=true; draw(); panneau(); return msg(`${r}<br><b>Bravo, tu as coulé toute la flotte de l'ordinateur en ${tirs} tirs !</b>`, "ok"); }
  /* au tour de l'ordinateur : il « réfléchit » un instant, puis annonce son tir */
  dernier=`Ton tir : ${r}`; msg("");
  tour="reflexion"; attente=null; draw(); panneau();
  minuteur=setTimeout(()=>{ if(!R0||fini) return; tour="ordi"; attente=choixOrdi(); draw(); panneau(); }, 1100);
}
function choixOrdi(){
  while(ia.cibles.length){ const c=ia.cibles.shift(); if(!moi.tirs.has(c[0]+","+c[1]) && c[0]>=M.min&&c[0]<=M.max&&c[1]>=M.min&&c[1]<=M.max) return c; }
  for(;;){ const c=[rnd(M.min,M.max), rnd(M.min,M.max)]; if(!moi.tirs.has(c[0]+","+c[1])) return c; }
}
function clicMoi(x,y){
  if(fini||tour!=="ordi") return;
  const [ax,ay]=attente;
  if(x!==ax||y!==ay){
    const dx = ax>0 ? `de ${ax} vers la droite` : ax<0 ? `de ${-ax} vers la gauche` : "pas du tout horizontalement";
    const dy = ay>0 ? `on monte de ${ay}` : ay<0 ? `on descend de ${-ay}` : "on ne monte pas et on ne descend pas";
    return msg(`Non : tu as cliqué sur ${co(x,y)}. Pour aller en ${co(ax,ay)}, on part de l'origine, on se déplace ${dx}, puis ${dy}.`, "ko");
  }
  const k=x+","+y, b=moi.bat.find(b=>b.cases.some(([a,bb])=>a===x&&bb===y));
  let r;
  if(b){ b.touches.add(k); moi.tirs.set(k,"touche"); const coule=b.touches.size===b.cases.length; r = coule ? "L'ordinateur a coulé un de tes bateaux !" : "L'ordinateur a touché un de tes bateaux !";
    if(!coule) ia.cibles.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]); else ia.cibles=[]; }
  else { moi.tirs.set(k,"eau"); r="L'ordinateur a tiré à l'eau."; }
  if(moi.bat.every(b=>b.touches.size===b.cases.length)){ fini=true; draw(); panneau(); return msg(`${r}<br><b>L'ordinateur a gagné…</b> Tu prends ta revanche ? Clique sur « Nouvelle partie ».`, "ko"); }
  tour="eleve"; attente=null; draw(); panneau(); msg(`Bien repéré ! ${r} <b>C'est de nouveau à toi de tirer.</b>`, "");
}
const esc = t => String(t).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function msg(h,k){ const el=$("bmsg"); if(!el) return; el.hidden=!h; el.className="lmsg "+(k||""); el.innerHTML=h; }
function destroy(){ clearTimeout(minuteur); R0=null; }
return {init, destroy, _t:{get lui(){ return lui; }, get attente(){ return attente; }, get tour(){ return tour; }, lire}};
})();
