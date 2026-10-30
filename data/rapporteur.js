/* Le rapporteur (6e, chapitres Angles) : un rapporteur virtuel à double graduation qu'on déplace et qu'on fait tourner,
   pour mesurer puis construire des angles. Les erreurs classiques (mauvaise graduation, rapporteur mal centré) sont expliquées. */
window.RAPPORTEUR = (function(){
const W=16, H=10, R=4.4;
const rad = d => d*Math.PI/180, deg = r => r*180/Math.PI;
const norm = a => ((a%360)+360)%360;
const dir = a => ({x:Math.cos(rad(a)), y:-Math.sin(rad(a))});     /* angle « mathématique » (sens inverse des aiguilles d'une montre) -> écran */
const ANG = n => `<span class="ang">${n}</span>`;
const ecart = (a,b) => { const d=Math.abs(norm(a)-norm(b)); return Math.min(d,360-d); };

/* niveaux : O sommet, a1 et a2 directions des côtés ; type mesure / construire / somme */
const LV = [
 {titre:"Premier angle", type:"mes", O:[3.5,8], a1:0, a2:40, noms:["A","O","B"], depart:[11.5,8.6,0],
  aide:"Fais glisser le rapporteur pour que son <b>centre</b> (la petite croix) soit exactement sur le sommet O, et que la ligne du bas soit sur le côté [OA). Lis ensuite la graduation qui part de 0 sur le côté [OA).",
  consigne:`Mesure l'angle ${ANG("AOB")}.`},
 {titre:"Un angle obtus", type:"mes", O:[5,8.2], a1:0, a2:128, noms:["A","O","B"], depart:[12,8.6,0],
  aide:"L'angle est plus grand qu'un angle droit : sa mesure est plus grande que 90°. Pars du 0 qui est sur le côté [OA).",
  consigne:`Mesure l'angle ${ANG("AOB")}.`},
 {titre:"Le côté est à gauche", type:"mes", O:[11.5,8.2], a1:180, a2:125, noms:["A","O","B"], depart:[4,8.6,0],
  aide:"Ici, le côté [OA) part vers la gauche : le 0 à utiliser est celui de gauche. Suis cette graduation (l'autre rangée de nombres) jusqu'au côté [OB).",
  consigne:`Mesure l'angle ${ANG("AOB")}.`},
 {titre:"Tourner le rapporteur", type:"mes", O:[5,7], a1:30, a2:95, noms:["A","O","B"], depart:[11.5,8.6,0],
  aide:"Aucun côté n'est horizontal : il faut <b>tourner</b> le rapporteur. Attrape la poignée ronde à droite de la ligne du bas, et tourne jusqu'à ce que la ligne du bas soit sur le côté [OA).",
  consigne:`Mesure l'angle ${ANG("AOB")}. Tu devras faire tourner le rapporteur.`},
 {titre:"Tourner encore", type:"mes", O:[8,6.6], a1:-20, a2:95, noms:["A","O","B"], depart:[3.5,8.6,0],
  aide:"Place le centre sur O, tourne pour aligner la ligne du bas avec un des côtés, puis lis la graduation qui part de 0 sur ce côté.",
  consigne:`Mesure l'angle ${ANG("AOB")}.`},
 {titre:"Construire un angle", type:"cons", O:[3.5,8.4], a1:0, cible:50, noms:["A","O","B"], depart:[11.5,8.6,0],
  aide:"Place le rapporteur (centre sur O, ligne du bas sur [OA)). Repère 50 sur la graduation qui part de 0 sur [OA). Puis choisis « Placer le point B » et clique juste à côté de cette graduation.",
  consigne:`Construis le point B tel que ${ANG("AOB")} = 50°.`},
 {titre:"Construire un angle obtus", type:"cons", O:[5.5,8.4], a1:0, cible:135, noms:["A","O","B"], depart:[12,8.6,0],
  aide:"135°, c'est plus qu'un angle droit. Lis bien la graduation qui part de 0 sur le côté [OA).",
  consigne:`Construis le point B tel que ${ANG("AOB")} = 135°.`},
 {titre:"Côté vers la gauche", type:"cons", O:[11.5,8.4], a1:180, cible:70, noms:["A","O","B"], depart:[4,8.6,0],
  aide:"Le côté [OA) part vers la gauche : utilise le 0 de gauche.",
  consigne:`Construis le point B tel que ${ANG("AOB")} = 70°.`},
 {titre:"Construire en tournant", type:"cons", O:[5.5,7.2], a1:25, cible:80, noms:["A","O","B"], depart:[12,8.6,0],
  aide:"Tourne le rapporteur pour que la ligne du bas soit sur [OA), puis repère 80.",
  consigne:`Construis le point B tel que ${ANG("AOB")} = 80°.`},
 {titre:"Défi : les angles du triangle", defi:true, type:"tri", tri:[[3,8.8],[12,8.8],[8.331,2.446]], noms:["A","B","C"], depart:[13,3,0], mes:[50,60,70],
  aide:"Mesure les trois angles un par un : à chaque fois, le centre du rapporteur va sur le sommet de l'angle et sa ligne du bas sur un côté. Pour l'angle au sommet C, il faut tourner le rapporteur. Additionne ensuite les trois mesures.",
  consigne:`Mesure les trois angles du triangle ABC, puis calcule leur somme. Que remarques-tu ?`}
];

let R0=null, cur=0, rap=null, drag=null, mode="rap", Bpt=null, done=[];
const KEY="staal-rapp6-";
const store={ get(k){ try{ return localStorage.getItem(KEY+k); }catch(e){ return null; } }, set(k,v){ try{ localStorage.setItem(KEY+k,v); }catch(e){} } };
const $ = id => R0.querySelector("#"+id);

function init(root){
  R0=root; try{ done=JSON.parse(store.get("done")||"[]"); }catch(e){ done=[]; }
  root.innerHTML=`<div class="rap">
    <div class="glevels" id="rlevels"></div>
    <div class="ggrid">
      <div class="gmain">
        <div class="rbar" id="rbar"></div>
        <div class="gboard"><svg id="rsvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Feuille avec un angle et un rapporteur"></svg></div>
        <p class="where">Fais glisser le rapporteur avec la souris (ou le doigt). Pour le tourner, attrape la <b>poignée ronde</b> au bout de sa ligne du bas.</p>
      </div>
      <aside class="gside"><h2 id="rtitre"></h2><p class="gcons" id="rcons"></p><div id="rq"></div>
        <div class="lmsg" id="rmsg" hidden></div>
        <details class="lhelp" id="rhelp"><summary>Besoin d'aide ?</summary><p id="raide"></p></details></aside>
    </div></div>`;
  const svg=$("rsvg");
  svg.addEventListener("pointerdown", e=>{ const p=world(e); e.preventDefault();
    const L=LV[cur];
    if(mode==="pt"){ if(L.type==="cons"){ Bpt=p; draw(); msg(""); } return; }
    const h=handle(); if(Math.hypot(p.x-h.x,p.y-h.y)<0.55){ drag={k:"rot"}; svg.setPointerCapture(e.pointerId); return; }
    if(inRap(p)){ drag={k:"move", dx:rap.x-p.x, dy:rap.y-p.y}; svg.setPointerCapture(e.pointerId); } });
  svg.addEventListener("pointermove", e=>{ if(!drag) return; const p=world(e);
    if(drag.k==="move"){ rap.x=Math.max(0,Math.min(W,p.x+drag.dx)); rap.y=Math.max(0,Math.min(H,p.y+drag.dy)); aimante(true); }
    else { rap.phi=deg(Math.atan2(-(p.y-rap.y), p.x-rap.x)); aimante(false); }
    draw(); });
  svg.addEventListener("pointerup", ()=>{ drag=null; });
  let st=+(store.get("niveau")||0); if(!(st>=0&&st<LV.length)) st=0; load(st);
  requestAnimationFrame(()=>{ const t=$("rlevels"); if(t && t.getBoundingClientRect().top>80) window.scrollTo({top: window.scrollY + t.getBoundingClientRect().top - 8}); });
}
function world(e){ const svg=$("rsvg"), p=svg.createSVGPoint(); p.x=e.clientX; p.y=e.clientY; const q=p.matrixTransform(svg.getScreenCTM().inverse()); return {x:q.x,y:q.y}; }
const handle = () => { const d=dir(rap.phi); return {x:rap.x+(R+0.45)*d.x, y:rap.y+(R+0.45)*d.y}; };
function inRap(p){ const dx=p.x-rap.x, dy=p.y-rap.y, r=Math.hypot(dx,dy); if(r>R+0.15) return false;
  const a=deg(Math.atan2(-dy,dx)); const rel=norm(a-rap.phi); return rel<=180 || r<0.6 || ecart(rel,0)<8 || ecart(rel,180)<8; }
/* le rapporteur « s'aimante » un peu : centre sur un sommet, ligne du bas sur un côté */
function sommets(){ const L=LV[cur]; if(L.type==="tri") return L.tri.map(([x,y])=>({x,y})); return [{x:L.O[0],y:L.O[1]}]; }
function cotes(){ const L=LV[cur]; if(L.type==="tri"){ const T=L.tri; const out=[]; for(let i=0;i<3;i++) for(let j=0;j<3;j++) if(i!==j) out.push(deg(Math.atan2(-(T[j][1]-T[i][1]), T[j][0]-T[i][0]))); return out; }
  const a=[L.a1]; if(L.type==="mes") a.push(L.a2); if(L.type==="cons" && Bpt) a.push(deg(Math.atan2(-(Bpt.y-L.O[1]), Bpt.x-L.O[0]))); return a; }
function aimante(centre){
  if(centre) for(const s of sommets()) if(Math.hypot(rap.x-s.x,rap.y-s.y)<0.22){ rap.x=s.x; rap.y=s.y; }
  for(const a of cotes()) for(const b of [a, a+180]) if(ecart(rap.phi,b)<2.5) rap.phi=norm(b);
}
function load(i){
  cur=i; store.set("niveau",i); const L=LV[i]; Bpt=null; mode="rap";
  rap={x:L.depart[0], y:L.depart[1], phi:L.depart[2]};
  $("rlevels").innerHTML = `<span class="ggroupe">Mesurer</span>` + LV.map((l,j)=>(j===5?`<span class="ggroupe">Construire</span>`:"")+(l.defi?`<span class="ggroupe">Défi</span>`:"")+`<button class="lnum${j===i?" on":""}${done.includes(j)?" ok":""}${l.defi?" defi":""}" data-i="${j}" aria-label="Niveau ${j+1}">${j+1}</button>`).join("");
  R0.querySelectorAll("#rlevels .lnum").forEach(b=>b.onclick=()=>load(+b.dataset.i));
  $("rtitre").textContent=`Niveau ${i+1} · ${L.titre.replace(/^Défi : /,"Défi · ")}`;
  $("rcons").innerHTML=L.consigne; $("raide").innerHTML=L.aide;
  if(L.type==="cons") $("rq").innerHTML=`<button class="btn primary" id="rok">Vérifier ma construction</button>`;
  else if(L.type==="tri") $("rq").innerHTML=[["r1","BAC"],["r2","ABC"],["r3","ACB"]].map(([id,n])=>`<div class="gqrow"><label for="${id}"><b>${ANG(n)} =</b></label><input id="${id}" class="gqin" inputmode="numeric" autocomplete="off"> °</div>`).join("")
    +`<div class="gqrow rsom"><label for="rin"><b>${ANG("BAC")} + ${ANG("ABC")} + ${ANG("ACB")} =</b></label><input id="rin" class="gqin" inputmode="numeric" autocomplete="off"> °</div><button class="btn primary" id="rok">Vérifier</button>`;
  else $("rq").innerHTML=`<div class="gqrow"><label for="rin"><b>${ANG("AOB")} =</b></label><input id="rin" class="gqin" inputmode="numeric" autocomplete="off"> °</div><button class="btn primary" id="rok">Vérifier</button>`;
  $("rok").onclick=verifier; R0.querySelectorAll("#rq input").forEach(inp=>inp.onkeydown=e=>{ if(e.key==="Enter") verifier(); });
  $("rbar").innerHTML = L.type==="cons" ? `<button class="btn rmode on" data-m="rap">Déplacer le rapporteur</button><button class="btn rmode" data-m="pt">Placer le point B</button><button class="btn" id="rreset">Remettre le rapporteur</button>` : `<button class="btn" id="rreset">Remettre le rapporteur</button>`;
  R0.querySelectorAll(".rmode").forEach(b=>b.onclick=()=>{ mode=b.dataset.m; R0.querySelectorAll(".rmode").forEach(x=>x.classList.toggle("on",x===b)); draw(); });
  $("rreset").onclick=()=>{ rap={x:L.depart[0], y:L.depart[1], phi:L.depart[2]}; draw(); };
  const h=$("rhelp"); if(h) h.open=false; msg(""); draw();
}
/* ------------ dessin ------------ */
function ray(O,a,len,cls){ const d=dir(a); let t=len; for(const [p,dp,lo,hi] of [[O.x,d.x,0,W],[O.y,d.y,0,H]]) if(Math.abs(dp)>1e-9){ const tt=dp>0?(hi-p)/dp:(lo-p)/dp; t=Math.min(t,tt); }
  return `<line x1="${O.x}" y1="${O.y}" x2="${O.x+t*d.x}" y2="${O.y+t*d.y}" class="${cls}"/>`; }
const croix = (p,cls="") => `<path d="M${p.x-.16} ${p.y-.16}L${p.x+.16} ${p.y+.16}M${p.x+.16} ${p.y-.16}L${p.x-.16} ${p.y+.16}" class="rpt ${cls}"/>`;
const lab = (p,t,dx=.22,dy=-.22) => `<text x="${p.x+dx}" y="${p.y+dy}" class="rlab">${t}</text>`;
function draw(){
  const svg=$("rsvg"); if(!svg) return; const L=LV[cur];
  let g='<rect width="16" height="10" fill="#fff"/>';
  for(let x=0;x<=W;x++) g+=`<line x1="${x}" y1="0" x2="${x}" y2="${H}" class="ggrid1"/>`;
  for(let y=0;y<=H;y++) g+=`<line x1="0" y1="${y}" x2="${W}" y2="${y}" class="ggrid1"/>`;
  if(L.type==="tri"){ const P=L.tri.map(([x,y])=>({x,y})); g+=`<polygon points="${P.map(p=>p.x+","+p.y).join(" ")}" class="rtri"/>`;
    P.forEach((p,k)=>{ g+=croix(p); g+=lab(p,L.noms[k], k===0?-.45:k===1?.2:.2, k===2?-.25:.5); }); }
  else { const O={x:L.O[0],y:L.O[1]};
    g+=ray(O,L.a1,7,"rside"); const A={x:O.x+3*dir(L.a1).x, y:O.y+3*dir(L.a1).y}; g+=croix(A)+lab(A,"A",0,-.3);
    if(L.type==="mes"){ g+=ray(O,L.a2,7,"rside"); const B={x:O.x+3*dir(L.a2).x, y:O.y+3*dir(L.a2).y}; g+=croix(B)+lab(B,"B",.25,0); }
    if(L.type==="cons" && Bpt){ const a=deg(Math.atan2(-(Bpt.y-O.y),Bpt.x-O.x)); g+=ray(O,a,7,"rside new"); g+=croix(Bpt,"new")+lab(Bpt,"B",.25,-.1); }
    g+=croix(O)+lab(O,"O",-.15,.55); }
  /* le rapporteur */
  let r=`<g transform="translate(${rap.x} ${rap.y}) rotate(${-rap.phi})" class="rrap${mode==="pt"?" ghost":""}">
    <path d="M${-R-.3} 0A${R+.3} ${R+.3} 0 0 1 ${R+.3} 0Z" class="rbody"/><path d="M${-R} 0A${R} ${R} 0 0 1 ${R} 0" class="rarc"/>
    <path d="M${-R-.3} 0H${R+.3}" class="rbase"/><path d="M0 -.35V.12M-.25 0H.25" class="rcentre"/>`;
  for(let t=0;t<=180;t++){ const c=Math.cos(rad(t)), s=-Math.sin(rad(t)), l=t%10===0?.42:t%5===0?.28:.16;
    r+=`<line x1="${R*c}" y1="${R*s}" x2="${(R-l)*c}" y2="${(R-l)*s}" class="rtick${t%10?"":" big"}"/>`;
    if(t%10===0){ r+=`<text x="${(R-.72)*c}" y="${(R-.72)*s+.1}" class="rnum ext" transform="rotate(${90-t} ${(R-.72)*c} ${(R-.72)*s})">${180-t}</text>`;
      r+=`<text x="${(R-1.18)*c}" y="${(R-1.18)*s+.09}" class="rnum int" transform="rotate(${90-t} ${(R-1.18)*c} ${(R-1.18)*s})">${t}</text>`; } }
  /* graduation intérieure, comme sur le rapporteur des élèves : un deuxième arc avec ses propres traits */
  const Ri=R-1.66;
  r+=`<path d="M${-Ri} 0A${Ri} ${Ri} 0 0 1 ${Ri} 0" class="rarc int"/>`;
  for(let t=0;t<=180;t++){ const c=Math.cos(rad(t)), s=-Math.sin(rad(t)), l=t%10===0?.3:t%5===0?.2:.11;
    r+=`<line x1="${Ri*c}" y1="${Ri*s}" x2="${(Ri+l)*c}" y2="${(Ri+l)*s}" class="rtick int${t%10?"":" big"}"/>`; }
  r+=`<path d="M0 0V${-Ri}" class="rtick int"/>`;
  r+=`<circle cx="${R+.45}" cy="0" r=".26" class="rhandle"/></g>`;
  svg.innerHTML=g+r;
}
/* ------------ vérification ------------ */
function centreOK(){ return sommets().some(s=>Math.hypot(rap.x-s.x,rap.y-s.y)<0.05); }
function verifier(){
  const L=LV[cur];
  if(L.type==="cons"){
    if(!Bpt) return msg(`<b>Pas encore !</b> Choisis « Placer le point B », puis clique là où tu veux placer B.`, "ko");
    const O={x:L.O[0],y:L.O[1]}, a=deg(Math.atan2(-(Bpt.y-O.y),Bpt.x-O.x)), m=ecart(a,L.a1);
    if(Math.hypot(Bpt.x-O.x,Bpt.y-O.y)<1) return msg("<b>Pas encore !</b> Place le point B un peu plus loin du sommet O, près de la graduation.", "ko");
    if(Math.abs(m-L.cible)<=1) return win(`${ANG("AOB")} mesure bien ${L.cible}°.`);
    if(Math.abs(m-(180-L.cible))<=1) return msg(`<b>Attention :</b> ton angle mesure ${Math.round(m)}°, et 180 − ${Math.round(m)} = ${L.cible}. Tu as lu la <b>mauvaise graduation</b> ! Utilise celle qui part de 0 sur le côté [OA).`, "ko");
    return msg(`<b>Pas encore !</b> Ton angle mesure environ ${Math.round(m)}°, au lieu de ${L.cible}°. Vérifie que le centre du rapporteur est bien sur O et que sa ligne du bas est sur [OA).`, "ko");
  }
  if(L.type==="tri") return verifTri(L);
  const v=lire("rin");
  if(!isFinite(v)) return msg("Écris une mesure en degrés.", "ko");
  const m=ecart(L.a1,L.a2);
  if(Math.abs(v-m)<=1) return win(`${ANG("AOB")} mesure bien ${m}°. C'est un angle ${m<90?"aigu":m===90?"droit":"obtus"}.`);
  if(Math.abs(v-(180-m))<=1) return msg(`<b>Attention :</b> tu as lu ${v}°, mais 180 − ${v} = ${180-v}… Tu as lu la <b>mauvaise graduation</b> ! L'angle est ${m<90?"aigu (plus petit qu'un angle droit)":"obtus (plus grand qu'un angle droit)"} : utilise la graduation qui part de 0 sur un côté de l'angle.`, "ko");
  if(!centreOK()) return msg("<b>Pas encore !</b> Le centre du rapporteur (la petite croix) doit être <b>exactement sur le sommet O</b>.", "ko");
  return msg(`<b>Pas encore !</b> Vérifie que la ligne du bas du rapporteur est bien sur un côté de l'angle, puis lis de nouveau la graduation.`, "ko");
}
const lire = id => { const t=(($(id)||{}).value||"").trim().replace(",","."); return t===""?NaN:+t; };
function verifTri(L){
  const noms=["BAC","ABC","ACB"], som=["A","B","C"], v=["r1","r2","r3"].map(lire), s=lire("rin");
  for(let k=0;k<3;k++){
    if(!isFinite(v[k])) return msg(`Écris la mesure de l'angle ${ANG(noms[k])}.`, "ko");
    if(Math.abs(v[k]-L.mes[k])<=1) continue;
    if(Math.abs(v[k]-(180-L.mes[k]))<=1) return msg(`<b>Attention à l'angle ${ANG(noms[k])} :</b> tu as lu ${v[k]}°, mais cet angle est ${L.mes[k]<90?"aigu (plus petit qu'un angle droit)":"obtus"}. Tu as lu la <b>mauvaise graduation</b> : utilise celle qui part de 0 sur un côté de l'angle.`, "ko");
    return msg(`<b>Pas encore pour l'angle ${ANG(noms[k])}.</b> Place le centre du rapporteur exactement sur le sommet ${som[k]}, sa ligne du bas sur un côté, puis lis de nouveau la graduation.`, "ko");
  }
  if(!isFinite(s)) return msg("Les trois mesures sont justes ! Il reste à écrire la <b>somme</b> des trois angles.", "ko");
  const t=v[0]+v[1]+v[2];
  if(s!==t) return msg(`<b>Les trois mesures sont justes</b>, mais vérifie ton addition : ${v[0]} + ${v[1]} + ${v[2]} ne fait pas ${s}.`, "ko");
  win(`${ANG("BAC")} mesure bien ${L.mes[0]}°, ${ANG("ABC")} mesure bien ${L.mes[1]}° et ${ANG("ACB")} mesure bien ${L.mes[2]}°.<br>${L.mes.join(" + ")} = 180°.<br>La somme des trois angles d'un triangle est toujours égale à <b>180°</b>, quel que soit le triangle !`);
}
function win(t){
  if(!done.includes(cur)){ done.push(cur); store.set("done", JSON.stringify(done)); }
  R0.querySelector(`#rlevels .lnum[data-i="${cur}"]`).classList.add("ok");
  msg(`<b>Bravo !</b> ${t}${cur<LV.length-1?`<br><button class="btn primary" id="rnext">Niveau suivant →</button>`:"<br>Tu as terminé tous les niveaux !"}`, "ok");
  const n=$("rnext"); if(n) n.onclick=()=>load(cur+1);
}
function msg(h,k){ const el=$("rmsg"); if(!el) return; el.hidden=!h; el.className="lmsg "+(k||""); el.innerHTML=h; }
function destroy(){ R0=null; drag=null; }
return {init, destroy, LV, _t:{get rap(){ return rap; }, setRap:(x,y,phi)=>{ rap={x,y,phi}; draw(); }, setB:(x,y)=>{ Bpt={x,y}; draw(); }, load:i=>load(i)}};
})();
