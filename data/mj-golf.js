/* Mini-golf des angles (6e) : l'élève tape l'angle de tir (en degrés, mesuré à partir d'une demi-droite de référence horizontale
   vers la droite, dans le sens inverse des aiguilles d'une montre, comme sur un rapporteur) et choisit la puissance.
   Physique : la balle roule en ligne droite avec un frottement constant, rebonds parfaits sur les murs (angle d'arrivée = angle de départ).
   9 trous : estimer, mesurer au rapporteur, puis calculer l'angle de tir d'un rebond (angle droit, angle plat, somme des angles du triangle). */
window.MJ_GOLF = (function(){
"use strict";
const KEY = "staal-mj-golf6";
const W = 960, H = 540, CAR = 30, BR = 8, STEP = 3*CAR, PMAX = 12, SMAX = PMAX*STEP, CAPV = 7*CAR, ACC = 300, MAXC = 5, RAPP = 220;
const NBSP = " ";
const rad = d => d*Math.PI/180, deg = r => r*180/Math.PI;
const ri = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const pick = a => a[Math.floor(Math.random()*a.length)];
const dir = t => ({x:Math.cos(rad(t)), y:-Math.sin(rad(t))});           /* angle « mathématique » -> vecteur écran (y vers le bas) */
const add = (p,v,k) => ({x:p.x + v.x*(k==null?1:k), y:p.y + v.y*(k==null?1:k)});
const dist = (a,b) => Math.hypot(a.x-b.x, a.y-b.y);
const angOf = (c,p) => { let a = deg(Math.atan2(-(p.y-c.y), p.x-c.x)); return a<0 ? a+360 : a; };   /* direction de c vers p, en degrés (0 à 360) */
const between = (c,u,v) => { let d = Math.abs(angOf(c,u)-angOf(c,v)); return d>180 ? 360-d : d; };  /* mesure de l'angle uĉv */
const f1 = v => (Math.round(v*10)/10).toString();
const ANG = n => `<span class="ang">${n}</span>`;
const reduced = () => { try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } };
const starsFor = c => c<=1 ? 3 : c===2 ? 2 : c===3 ? 1 : 0;
const pl = (n, s) => n + NBSP + s + (n>1 ? "s" : "");

/* ---------- Les 9 trous ---------- */
const TROUS = [
 {t:"Tir direct", d:"Estime l'angle à l'œil. Les repères 45°, 90° et 135° t'aident.", kind:"estim"},
 {t:"Sans repères", d:"Estime l'angle : seul l'angle droit est indiqué.", kind:"estim"},
 {t:"Le rapporteur", d:"Mesure l'angle au degré près avec le rapporteur.", kind:"mes"},
 {t:"Rapporteur et obstacles", d:"Fais tourner le fil du rapporteur vers le trou, puis lis la mesure.", kind:"mes"},
 {t:"Premier rebond", d:"L'angle droit est partagé en deux : calcule l'angle de tir.", kind:"calc"},
 {t:"Le mur renvoie", d:"Rebond sur le mur du haut : même angle à l'arrivée et au départ.", kind:"calc"},
 {t:"Rebond sur le côté", d:"Rebond sur un mur vertical : utilise le triangle.", kind:"calc"},
 {t:"Rebond sans aide", d:"Un rebond, de l'eau, et pas de figure : à toi de calculer.", kind:"calc"},
 {t:"Deux rebonds", d:"Le grand final : deux rebonds avant le trou.", kind:"calc"}
];
const MISSION = [
 "Estime l'angle entre la demi-droite de référence et la direction du trou.",
 "Estime l'angle de tir. Repère : l'angle droit mesure 90°.",
 "Affiche le rapporteur : le pointillé va de la balle au trou. Lis la mesure au degré près.",
 "Affiche le rapporteur et fais tourner son fil rouge vers le trou (souris ou flèches ← →).",
 "La balle doit viser le point P. Calcule l'angle de tir.",
 "Le mur renvoie la balle avec le même angle. Calcule l'angle de tir.",
 "Le mur de côté renvoie la balle avec le même angle. Calcule l'angle de tir.",
 "Calcule l'angle de tir. Bloqué ? Le coup de pouce dessine la figure.",
 "Deux rebonds : seul le premier compte pour le calcul !"
];

const BOX = {x0:16, y0:16, x1:944, y1:524};
function base(n){ return {n, box:Object.assign({},BOX), rects:[], water:[], cup:13, fig:[], guides:null, rapp:false, seg:false, aidsHidden:false, mir:false, pt:{}, kind:TROUS[n-1].kind}; }
function eff(b){ return {x0:b.x0+BR, y0:b.y0+BR, x1:b.x1-BR, y1:b.y1-BR}; }
function insideE(h, p, m){ const E=eff(h.box); return p.x>=E.x0+m && p.x<=E.x1-m && p.y>=E.y0+m && p.y<=E.y1-m; }
function rectDist(r, p){ const dx=Math.max(r.x-p.x, 0, p.x-(r.x+r.w)), dy=Math.max(r.y-p.y, 0, p.y-(r.y+r.h)); return Math.hypot(dx,dy); }
function rectSegDist(r, a, b){ let m=1e9; for(let i=0;i<=40;i++){ const p={x:a.x+(b.x-a.x)*i/40, y:a.y+(b.y-a.y)*i/40}; m=Math.min(m, rectDist(r,p)); } return m; }
function overlap(r, s, m){ return r.x < s.x+s.w+m && s.x < r.x+r.w+m && r.y < s.y+s.h+m && s.y < r.y+r.h+m; }

/* --- trous 1 et 2 : tir direct à estimer --- */
function gDirect(h){
  const n=h.n;
  h.cup = n===1 ? 20 : 17; h.guides = n===1 ? [45,90,135,180] : [90];
  for(let k=0;k<200;k++){
    const th = n===1 ? pick([20,30,40,50,60,70,80,100,110,120,130,140,150,160]) : 5*ri(2,34);
    if(n===2 && th%45===0 && Math.random()<.7) continue;
    const D = (n===1 ? ri(6,9) : ri(7,10))*CAR, B = {x:ri(150,810), y:ri(400,480)}, T = add(B, dir(th), D);
    if(!insideE(h, T, 46)) continue;
    h.pt = {B, T}; h.theta = th; return true;
  }
  return false;
}
/* --- trous 3 et 4 : mesurer au rapporteur --- */
function gMes(h){
  const n=h.n;
  h.rapp = true; h.seg = n===3; h.fil = true; h.cup = n===3 ? 13 : 14;
  for(let k=0;k<300;k++){
    const th = ri(10,170); if(n===3 && th%5===0) continue; if(n===4 && th%10===0) continue;
    const D = (n===3 ? ri(10,14) : ri(11,16))*CAR, B = {x:ri(250,710), y:ri(440,480)}, T = add(B, dir(th), D);
    if(!insideE(h, T, 40)) continue;
    h.pt = {B, T}; h.theta = th;
    if(n===4){ /* deux blocs de bois et une mare, loin du trajet et du rapporteur */
      h.rects = []; h.water = []; let ok = true;
      const shapes = [()=>({w:ri(80,140), h:22}), ()=>({w:22, h:ri(70,120)}), ()=>({w:ri(90,150), h:ri(55,80), water:true})];
      for(const mk of shapes){
        let placed=false;
        for(let j=0;j<120 && !placed;j++){
          const s = mk(), r = {x:ri(40, W-40-s.w), y:ri(40, H-40-s.h), w:s.w, h:s.h};
          if(rectDist(r,B) < RAPP+30 || rectDist(r,T) < 50 || rectSegDist(r,B,T) < 42) continue;
          if(h.rects.concat(h.water).some(o=>overlap(o,r,30))) continue;
          (s.water ? h.water : h.rects).push(r); placed = true;
        }
        if(!placed) ok = false;
      }
      if(!ok) continue;
    }
    return true;
  }
  return false;
}
/* --- rebond sur le mur du haut (trous 5, 6, 8) : construit vers la droite, retourné ensuite une fois sur deux --- */
function gTop(h, thr){
  const E = eff(h.box), yt = E.y0, tn = Math.tan(rad(thr)), sn = Math.sin(rad(thr)), cs = Math.cos(rad(thr));
  for(let k=0;k<400;k++){
    const B = {x:ri(60,330), y:ri(300,476)}, P = {x:B.x + (B.y-yt)/tn, y:yt};
    if(P.x-B.x < 130 || P.x > 720) continue;
    const Ty = ri(260, 476), d2 = (Ty-yt)/sn, T = {x:P.x + d2*cs, y:Ty};
    if(T.x > E.x1-50 || T.x-P.x < 110) continue;
    if((B.y-yt)/sn + d2 > 990) continue;
    const yTop = yt + 18*tn + 30;
    h.rects = [{x:P.x-10, y:yTop, w:20, h:h.box.y1-yTop}];
    h.pt = {B, T, P, Q:{x:B.x, y:yt}, N:{x:P.x+110, y:yt}};
    h.theta = thr; h.wall = "top"; return true;
  }
  return false;
}
/* --- rebond sur le mur de droite (trous 7, 8) --- */
function gSide(h, thr){
  const E = eff(h.box), XR = E.x1, tn = Math.tan(rad(thr)), sn = Math.sin(rad(thr)), cs = Math.cos(rad(thr));
  for(let k=0;k<400;k++){
    const B = {x:ri(150,620), y:ri(380,476)}, P = {x:XR, y:B.y - (XR-B.x)*tn};
    if(P.y < 170 || P.y > 340 || B.y-P.y < 60) continue;
    const Ty = ri(70, P.y-70), d2 = (P.y-Ty)/sn, T = {x:XR - d2*cs, y:Ty};
    if(T.x < 80 || XR-T.x < 90) continue;
    if((XR-B.x)/cs + d2 > 990) continue;
    const xEnd = XR - 18/tn - 30;
    h.rects = [{x:h.box.x0, y:P.y-10, w:xEnd-h.box.x0, h:20}];
    h.pt = {B, T, P, R:{x:XR, y:B.y}, N:{x:XR, y:Math.max(P.y-110, E.y0+4)}};
    h.theta = thr; h.wall = "side"; return true;
  }
  return false;
}
/* --- deux rebonds dans un couloir (trou 9) --- */
function gZig(h, thr){
  const tn = Math.tan(rad(thr)), sn = Math.sin(rad(thr)), cs = Math.cos(rad(thr));
  for(let k=0;k<400;k++){
    const y0 = ri(60,110); h.box = {x0:16, y0, x1:944, y1:y0+ri(300,340)};
    const E = eff(h.box);
    const B = {x:ri(50,140), y:E.y1-ri(12,40)}, P = {x:B.x + (B.y-E.y0)/tn, y:E.y0}, S = {x:P.x + (E.y1-E.y0)/tn, y:E.y1};
    if(P.x-B.x < 80) continue;
    const Ty = E.y1-ri(60,130), d3 = (E.y1-Ty)/sn, T = {x:S.x + d3*cs, y:Ty};
    if(T.x > E.x1-50 || T.x-S.x < 70) continue;
    if((B.y-E.y0)/sn + (E.y1-E.y0)/sn + d3 > 1000) continue;
    const yTop = E.y0 + 18*tn + 30, yBot = E.y1 - 18*tn - 30;
    h.rects = [{x:P.x-10, y:yTop, w:20, h:h.box.y1-yTop}, {x:S.x-10, y:h.box.y0, w:20, h:yBot-h.box.y0}];
    h.pt = {B, T, P, S, Q:{x:B.x, y:E.y0}, N:{x:P.x+110, y:E.y0}};
    h.theta = thr; h.wall = "zig"; return true;
  }
  return false;
}
/* mare(s) pour le trou 8, loin du trajet idéal */
function addWater(h, nb){
  const path = h.wall==="zig" ? [h.pt.B,h.pt.P,h.pt.S,h.pt.T] : [h.pt.B,h.pt.P,h.pt.T];
  for(let i=0;i<nb;i++){
    for(let j=0;j<150;j++){
      const r = {x:ri(40,W-200), y:ri(40,H-120), w:ri(90,160), h:ri(50,80)};
      if(r.x+r.w > h.box.x1-10 || r.y+r.h > h.box.y1-10 || r.x < h.box.x0+10 || r.y < h.box.y0+10) continue;
      if(rectDist(r,h.pt.B) < 60 || rectDist(r,h.pt.T) < 60) continue;
      let ok = true; for(let s=0;s<path.length-1;s++) if(rectSegDist(r,path[s],path[s+1]) < 46) ok = false;
      if(!ok || h.rects.concat(h.water).some(o=>overlap(o,r,24))) continue;
      h.water.push(r); break;
    }
  }
}
function mirror(h){
  const mx = p => ({x:W-p.x, y:p.y});
  for(const k in h.pt) h.pt[k] = mx(h.pt[k]);
  h.box = {x0:W-h.box.x1, y0:h.box.y0, x1:W-h.box.x0, y1:h.box.y1};
  const mr = r => ({x:W-r.x-r.w, y:r.y, w:r.w, h:r.h});
  h.rects = h.rects.map(mr); h.water = h.water.map(mr);
  h.theta = 180 - h.theta; h.mir = true;
}
/* figure (données et aides) à partir des points réels */
function figure(h){
  const F = [], p = h.pt, out = h.wall==="zig" ? "S" : "T";
  if(h.n===5){
    h.given = Math.round(between(p.B, p.Q, p.P));
    F.push({k:"seg", a:"B", b:"Q"}, {k:"seg", a:"B", b:"P"}, {k:"seg", a:"P", b:"T", faint:true}, {k:"right", c:"B", u:"X", v:"Q"},
           {k:"arc", c:"B", u:"Q", v:"P", r:66, lab:h.given+"°"}, {k:"mark", n:"P"});
    h.names = ["B","Q","P","T"]; h.calc = "t5";
  } else if(h.wall==="top" || h.wall==="zig"){
    h.given = Math.round(between(p.P, p.N, p[out]));
    F.push({k:"seg", a:"P", b:out}, h.wall==="zig" ? {k:"seg", a:"S", b:"T"} : null, {k:"arc", c:"P", u:"N", v:out, r:46, lab:h.given+"°"}, {k:"mark", n:"P"},
           h.wall==="zig" ? {k:"mark", n:"S"} : null,
           {k:"seg", a:"B", b:"Q", aid:true}, {k:"seg", a:"B", b:"P", aid:true}, {k:"right", c:"Q", u:"B", v:"P", aid:true},
           {k:"right", c:"B", u:"X", v:"Q", aid:true}, {k:"arc", c:"P", u:"Q", v:"B", r:46, lab:"?", aid:true});
    h.names = h.wall==="zig" ? ["B","P","N","S","T"] : ["B","P","N","T"]; h.aidNames = ["Q"]; h.calc = "top";
  } else {
    h.given = Math.round(between(p.P, p.N, p.T));
    F.push({k:"seg", a:"P", b:"T"}, {k:"arc", c:"P", u:"N", v:"T", r:46, lab:h.given+"°"}, {k:"mark", n:"P"},
           {k:"seg", a:"B", b:"R", aid:true}, {k:"seg", a:"B", b:"P", aid:true}, {k:"right", c:"R", u:"B", v:"P", aid:true},
           {k:"arc", c:"P", u:"R", v:"B", r:46, lab:"?", aid:true});
    h.names = ["B","P","N","T"]; h.aidNames = ["R"]; h.calc = "side";
  }
  h.fig = F.filter(Boolean);
}
/* réponse calculée à partir de la donnée (indépendamment de la géométrie : sert aussi au test) */
function answerFrom(h){
  const g = h.given, L = h.mir;
  if(h.calc==="t5") return L ? 90+g : 90-g;
  if(h.calc==="top") return L ? 180-g : g;
  if(h.calc==="side") return L ? 90+g : 90-g;
  return null;
}

/* ---------- Physique ---------- */
function prep(h){
  h.E = eff(h.box);
  h.rI = h.rects.map(r=>({x0:r.x-BR, y0:r.y-BR, x1:r.x+r.w+BR, y1:r.y+r.h+BR}));
  h.wI = h.water.map(r=>({x0:r.x, y0:r.y, x1:r.x+r.w, y1:r.y+r.h}));
  h.pt.X = {x:h.pt.B.x+150, y:h.pt.B.y};
}
function slab(r, x, y, d){
  let t0 = -Infinity, t1 = Infinity, ax = "";
  if(Math.abs(d.x)<1e-12){ if(x<r.x0 || x>r.x1) return null; }
  else { let a=(r.x0-x)/d.x, b=(r.x1-x)/d.x; if(a>b){ const z=a; a=b; b=z; } t0=a; ax="x"; t1=b; }
  if(Math.abs(d.y)<1e-12){ if(y<r.y0 || y>r.y1) return null; }
  else { let a=(r.y0-y)/d.y, b=(r.y1-y)/d.y; if(a>b){ const z=a; a=b; b=z; }
    if(a>t0+1e-9){ t0=a; ax="y"; } else if(Math.abs(a-t0)<=1e-9) ax="xy";
    t1=Math.min(t1,b); }
  if(t0>t1 || t0<1e-7) return null;
  return {t:t0, fx:ax.indexOf("x")>=0, fy:ax.indexOf("y")>=0};
}
function cast(h, x, y, d){
  const E = h.E; let t = Infinity, fx = false, fy = false, kind = "wall";
  if(d.x>1e-12){ t=(E.x1-x)/d.x; fx=true; } else if(d.x<-1e-12){ t=(E.x0-x)/d.x; fx=true; }
  let ty = Infinity; if(d.y>1e-12) ty=(E.y1-y)/d.y; else if(d.y<-1e-12) ty=(E.y0-y)/d.y;
  if(ty<t-1e-9){ t=ty; fx=false; fy=true; } else if(Math.abs(ty-t)<=1e-9) fy=true;
  for(const r of h.rI){ const c=slab(r,x,y,d); if(c && c.t<t-1e-9){ t=c.t; fx=c.fx; fy=c.fy; } }
  for(const r of h.wI){ const c=slab(r,x,y,d); if(c && c.t<t){ t=c.t; fx=fy=false; kind="water"; } }
  return {t:Math.max(t,0), fx, fy, kind};
}
/* trajet géométrique jusqu'à la distance S (le trajet ne dépend pas de la puissance, seulement l'endroit où la balle s'arrête) */
function trace(h, th, S){
  let x=h.pt.B.x, y=h.pt.B.y, d=dir(th), s=0; const pts=[{x,y,s:0}], ev=[]; let bounces=0;
  for(let k=0;k<80;k++){
    const rem = S-s; if(rem<=1e-9) break;
    const c = cast(h,x,y,d), tseg = Math.min(c.t, rem);
    const cx=h.pt.T.x-x, cy=h.pt.T.y-y, tc=cx*d.x+cy*d.y, perp2=cx*cx+cy*cy-tc*tc;
    if(perp2 < h.cup*h.cup){ const half=Math.sqrt(h.cup*h.cup-perp2), tin=tc-half;
      if(tin<=tseg && tc+half>=0) ev.push({type:"cup", sIn:s+Math.max(0,tin), sC:s+Math.max(0,Math.min(tc,tseg)), b:bounces}); }
    x+=d.x*tseg; y+=d.y*tseg; s+=tseg; pts.push({x,y,s});
    if(tseg===rem && c.t>rem) break;
    if(c.kind==="water"){ ev.push({type:"water", s}); break; }
    if(c.fx) d={x:-d.x, y:d.y}; if(c.fy) d={x:d.x, y:-d.y}; bounces++;
  }
  return {pts, ev, len:s, bounces};
}
function outcome(tr, S){
  for(const e of tr.ev){
    if(e.type==="water"){ if(e.s<=S) return {res:"water", s:e.s}; break; }
    if(S < e.sIn) break;
    if(S - e.sC <= CAPV) return {res:"cup", s:Math.min(S, e.sC), b:e.b};
  }
  return {res:"stop", s:Math.min(S, tr.len)};
}
function sim(h, th, p){ const tr=trace(h, th, SMAX), o=outcome(tr, p*STEP); return Object.assign(o, {tr}); }
/* puissances qui mettent la balle dans le trou ; avec nb : seulement par le trajet prévu (nb rebonds avant le trou) */
function powersFor(h, th, nb){ const tr=trace(h, th, SMAX), r=[]; for(let p=1;p<=PMAX;p++){ const o=outcome(tr,p*STEP); if(o.res==="cup" && (nb==null || o.b===nb)) r.push(p); } return r; }
const nbOf = h => h.n<=4 ? 0 : h.n<=8 ? 1 : 2;
function posAt(pts, s){
  for(let i=1;i<pts.length;i++) if(s<=pts[i].s || i===pts.length-1){
    const a=pts[i-1], b=pts[i], L=(b.s-a.s)||1, u=Math.min(1,Math.max(0,(s-a.s)/L));
    return {x:a.x+(b.x-a.x)*u, y:a.y+(b.y-a.y)*u};
  }
  return {x:pts[0].x, y:pts[0].y};
}
function validate(h){
  prep(h);
  const nb = nbOf(h), P = powersFor(h, h.theta, nb); if(P.length<2) return false;
  h.pOK = P;
  const tmin = h.kind==="estim" ? 1.5 : 0.45, tmax = h.kind==="estim" ? 9 : h.kind==="mes" ? 4 : 3;
  for(const dd of [-tmin, tmin]) if(!powersFor(h, h.theta+dd, nb).length) return false;
  /* trous à calculer : presque aucun autre angle gagnant, et surtout pas une réponse « naïve » (sur un terrain ouvert, les tirs « par la bande » restent permis) */
  if(h.kind==="calc"){
    const naive = [h.given, 180-h.given, 90-h.given, 90+h.given].filter(v=>Math.abs(v-h.theta)>tmax);
    let alt = 0;
    for(let a=0;a<=180;a+=0.25){ if(Math.abs(a-h.theta)<=tmax) continue;
      if(powersFor(h,a).length){ alt++; if(alt>8 || naive.some(v=>Math.abs(v-a)<=2.5)) return false; } }
    h.alt = alt;
  }
  /* fenêtre d'angles qui marchent (pour l'affichage du test) */
  let lo=h.theta, hi=h.theta; while(lo>h.theta-12 && powersFor(h,lo-0.25,nb).length) lo-=0.25; while(hi<h.theta+12 && powersFor(h,hi+0.25,nb).length) hi+=0.25;
  h.win = [lo, hi];
  if(hi-h.theta>tmax || h.theta-lo>tmax) return false;
  /* au rapporteur : pas de réussite « par chance » avec un angle faux de quelques degrés (retour par la bande) */
  if(h.kind==="mes") for(let a=h.theta-8;a<=h.theta+8;a+=0.25){ if(a>=lo-0.3 && a<=hi+0.3) continue; if(powersFor(h,a).length) return false; }
  return true;
}
function gen(n){
  for(let k=0;k<400;k++){
    const h = base(n); let ok;
    if(n<=2) ok = gDirect(h);
    else if(n<=4) ok = gMes(h);
    else if(n===5){ let t; do t=ri(32,66); while(t>=41 && t<=49); ok = gTop(h,t); if(ok && Math.random()<.5) mirror(h); }
    else if(n===6){ ok = gTop(h, ri(32,66)); if(ok && Math.random()<.5) mirror(h); }
    else if(n===7){ let t; do t=ri(28,60); while(t>=41 && t<=49); ok = gSide(h,t); if(ok && Math.random()<.5) mirror(h); }
    else if(n===8){ if(Math.random()<.5) ok = gTop(h, ri(32,66)); else { let t; do t=ri(28,60); while(t>=41 && t<=49); ok = gSide(h,t); }
      if(ok){ if(Math.random()<.5) mirror(h); addWater(h, ri(1,2)); h.aidsHidden = true; } }
    else { ok = gZig(h, ri(42,60)); if(ok && Math.random()<.6) mirror(h); h.aidsHidden = true; }
    if(!ok) continue;
    if(n>=5) figure(h);
    if(validate(h)) return h;
  }
  return null;
}

/* ---------- Explications ---------- */
function calcLines(h){
  const g=h.given, th=h.theta, L=h.mir, out = h.wall==="zig" ? "S" : "T";
  if(h.calc==="t5") return [`${ANG("xBQ")} = 90° (angle droit).`, L ? `${ANG("xBP")} = ${ANG("xBQ")} + ${ANG("QBP")} = 90° + ${g}° = ${th}°.` : `${ANG("xBP")} = ${ANG("xBQ")} − ${ANG("QBP")} = 90° − ${g}° = ${th}°.`];
  if(h.calc==="top") return [
    `Même angle au rebond : ${ANG("QPB")} = ${ANG("NP"+out)} = ${g}°.`,
    `Triangle BQP, rectangle en Q : ${ANG("QBP")} = 180° − 90° − ${g}° = ${90-g}°.`,
    L ? `Angle droit ${ANG("xBQ")} : ${ANG("xBP")} = 90° + ${90-g}° = ${th}°.` : `Angle droit ${ANG("xBQ")} : ${ANG("xBP")} = 90° − ${90-g}° = ${th}°.`];
  if(h.calc==="side") return [
    `Même angle au rebond : ${ANG("RPB")} = ${ANG("NPT")} = ${g}°.`,
    `Triangle BRP, rectangle en R : ${ANG("RBP")} = 180° − 90° − ${g}° = ${90-g}°.`,
    L ? `Angle plat ${ANG("xBR")} = 180° : ${ANG("xBP")} = 180° − ${90-g}° = ${th}°.` : `[BR) est la demi-droite de référence : ${ANG("xBP")} = ${ANG("RBP")} = ${th}°.`];
  return [];
}
function hintLines(h){
  if(h.calc==="t5") return h.mir
    ? [`L'angle de tir ${ANG("xBP")} est formé de l'angle droit ${ANG("xBQ")} et de l'angle ${ANG("QBP")}.`]
    : [`L'angle droit ${ANG("xBQ")} est partagé en deux angles : ${ANG("xBP")} (l'angle de tir) et ${ANG("QBP")}.`];
  const out = h.wall==="zig" ? "S" : "T";
  if(h.calc==="top") return [`1. Le mur renvoie la balle avec le même angle : ${ANG("QPB")} = ${ANG("NP"+out)}.`, `2. Dans un triangle, la somme des angles vaut 180°.`, `3. ${ANG("xBQ")} est un angle droit.`];
  return [`1. Le mur renvoie la balle avec le même angle : ${ANG("RPB")} = ${ANG("NPT")}.`, `2. Dans un triangle, la somme des angles vaut 180°.`, h.mir ? `3. ${ANG("xBR")} est un angle plat (180°).` : `3. [BR) est la demi-droite de référence.`];
}
function givenText(h){
  if(h.calc==="t5") return `${ANG("QBP")} = ${h.given}°`;
  if(h.calc==="top") return `${ANG("NP"+(h.wall==="zig"?"S":"T"))} = ${h.given}°`;
  if(h.calc==="side") return `${ANG("NPT")} = ${h.given}°`;
  return "";
}
const powList = P => P.length===1 ? String(P[0]) : P.slice(0,-1).join(", ") + " ou " + P[P.length-1];
/* explication d'un tir raté : écart d'angle (combien, dans quel sens) et puissance */
function explain(h, th, p, o){
  const L = [], P = h.pOK, okAng = powersFor(h, th).length>0, d = Math.round((th-h.theta)*10)/10, ad = Math.abs(d);
  let verdict = o.res==="water" ? "Plouf ! La balle est tombée dans l'eau." : okAng ? "Bon angle !" : ad<=3 ? "Presque !" : "Raté !";
  if(okAng){
    L.push(`Ton angle de ${f1(th).replace(".",",")}° était bon.`);
    if(P.indexOf(p)<0) L.push(p<P[0] ? `Pas assez fort : la balle s'est arrêtée avant le trou. Essaie la puissance ${powList(P)}.`
                                     : `Trop fort : la balle est passée au-dessus du trou sans tomber. Essaie la puissance ${powList(P)}.`);
  } else {
    L.push(`Tu as tiré à <b>${f1(th).replace(".",",")}°</b> au lieu de <b>${h.theta}°</b> : ton angle est trop ${d<0?"petit":"grand"} de <b>${f1(ad).replace(".",",")}°</b>. `
      + (d<0 ? `Augmente-le (sens inverse des aiguilles d'une montre).` : `Diminue-le (sens des aiguilles d'une montre).`));
    if(P.indexOf(p)<0) L.push(`Puissance : il fallait ${powList(P)}.`);
    if(h.kind==="estim"){
      if((th<90) !== (h.theta<90) && h.theta!==90) L.push(h.theta>90 ? `Le trou est à gauche de la verticale : l'angle est obtus, il mesure plus de 90°.` : `Le trou est à droite de la verticale : l'angle est aigu, il mesure moins de 90°.`);
      else if(ad>8) L.push(`Repères : angle droit 90°, sa moitié 45°, angle plat 180°.`);
    } else if(h.kind==="mes"){
      if(Math.abs(th-(180-h.theta))<=2 && Math.abs(h.theta-90)>6) L.push(`Tu as sans doute compté à partir de la gauche : le 0° est sur la demi-droite de référence, à droite.`);
      else L.push(`Rapporteur : centre sur la balle, 0° sur la demi-droite de référence ; lis la graduation sur la direction du trou.`);
    } else {
      if(Math.abs(th-h.given)<0.5) L.push(`Attention : ${h.given}° est la mesure donnée, pas forcément l'angle de tir.`);
      L.push(`<b>Le calcul :</b>`); calcLines(h).forEach(t=>L.push(t));
    }
  }
  return {verdict, lines:L, okAng};
}

/* ---------- Mémoire ---------- */
function load(){ try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }catch(e){ return {}; } }
function save(d){ try{ localStorage.setItem(KEY, JSON.stringify(d)); }catch(e){} }
const STAR = on => `<svg class="mj-golf-star${on?" on":""}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.9 6 6.5.8-4.8 4.5 1.2 6.5L12 17.2l-5.8 3.2 1.2-6.5L2.6 9.4l6.5-.8z"/></svg>`;
const STARS = n => `<span class="mj-golf-stars" role="img" aria-label="${n} étoile${n>1?"s":""} sur 3">${STAR(n>=1)}${STAR(n>=2)}${STAR(n>=3)}</span>`;

/* ---------- Style ---------- */
const CSS = `
.mj-golf{line-height:1.5;position:relative;font-family:var(--f-body);color:var(--ink);max-width:1180px;margin:0 auto}
.mj-golf *{box-sizing:border-box}
.mj-golf .btn{font-size:1rem}
.mj-golf-help{background:var(--surface);border:2px solid var(--line);border-radius:14px;padding:4px 16px;margin:0 0 14px}
.mj-golf-help summary{cursor:pointer;font-weight:700;padding:8px 0}
.mj-golf-help ul,.mj-golf-pop ul{margin:2px 0 10px;padding-left:1.2em;line-height:1.55}
.mj-golf-help li,.mj-golf-pop li{margin:3px 0}
.mj-golf-parc{display:flex;align-items:center;gap:12px 18px;flex-wrap:wrap;background:var(--surface);border:2px solid var(--c);border-radius:16px;padding:14px 18px;margin:0 0 16px}
.mj-golf-parc .mj-golf-ptxt{flex:1;min-width:240px}
.mj-golf-parc b{font-size:1.1rem}
.mj-golf-parc p{margin:2px 0 0;color:var(--muted);font-size:.95rem}
.mj-golf-menuhead{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 10px;flex-wrap:wrap}
.mj-golf-menuhead h2{font-family:var(--f-display);font-size:1.35rem;margin:0}
.mj-golf-tot{font-weight:600;color:var(--muted)}
.mj-golf-levels{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.mj-golf-lv{font:inherit;text-align:left;color:var(--ink);background:var(--surface);border:2px solid var(--line);border-radius:14px;padding:12px 14px;cursor:pointer;display:flex;flex-direction:column;gap:4px;min-height:118px;transition:border-color .15s,transform .15s}
.mj-golf-lv:hover,.mj-golf-lv:focus-visible{border-color:var(--c);transform:translateY(-2px)}
.mj-golf-lv .mj-golf-n{display:flex;align-items:center;justify-content:space-between;gap:6px}
.mj-golf-lv .mj-golf-n b{min-width:32px;height:32px;padding:0 6px;border-radius:10px;background:var(--c);color:var(--paper);display:grid;place-items:center;font-size:1rem}
.mj-golf-lv .mj-golf-tt{font-weight:700;font-size:1.02rem;line-height:1.3}
.mj-golf-lv .mj-golf-dd{font-size:.9rem;color:var(--muted);line-height:1.35}
.mj-golf-lv .mj-golf-rec{font-size:.85rem;color:var(--muted);margin-top:auto}
.mj-golf-stars{display:inline-flex;gap:2px;vertical-align:middle}
.mj-golf-star{width:18px;height:18px;fill:none;stroke:var(--muted);stroke-width:1.6;opacity:.6}
.mj-golf-star.on{fill:#f5b301;stroke:#b07d00;opacity:1}
.mj-golf-top{display:flex;align-items:center;gap:8px 14px;flex-wrap:wrap;margin:0 0 10px;min-height:46px}
.mj-golf-top .mj-golf-lvname{font-weight:700;font-size:1.05rem;margin-right:auto}
.mj-golf-top .mj-golf-lvname span{color:var(--c)}
.mj-golf-card{display:flex;gap:3px}
.mj-golf-card i{font-style:normal;min-width:26px;height:26px;border-radius:7px;border:2px solid var(--line);background:var(--surface);display:grid;place-items:center;font-size:.8rem;font-weight:700;color:var(--muted)}
.mj-golf-card i.cur{border-color:var(--c);color:var(--c)}
.mj-golf-card i.s3{background:#1f9d55;border-color:#1f9d55;color:#fff}
.mj-golf-card i.s2{background:#7cc36b;border-color:#7cc36b;color:#0d2b12}
.mj-golf-card i.s1{background:#f0b429;border-color:#f0b429;color:#2b1d00}
.mj-golf-card i.s0{background:#d64545;border-color:#d64545;color:#fff}
.mj-golf-coup{font-weight:700;background:var(--surface);border:2px solid var(--line);border-radius:999px;padding:3px 14px;display:flex;align-items:center;gap:8px;white-space:nowrap}
.mj-golf-top details{position:relative;margin:0;border:0;padding:0}
.mj-golf-top details summary{list-style:none;cursor:pointer;font-weight:600;border:2px solid var(--line);border-radius:999px;padding:4px 14px;background:var(--surface)}
.mj-golf-top details summary::-webkit-details-marker{display:none}
.mj-golf-pop{position:absolute;right:0;top:calc(100% + 8px);z-index:40;width:min(520px,90vw);background:var(--surface);border:2px solid var(--line);border-radius:14px;padding:6px 18px;box-shadow:0 12px 30px rgba(0,0,0,.18)}
.mj-golf-main{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:14px;align-items:start}
.mj-golf-course{position:relative;border-radius:14px;overflow:hidden;border:2px solid var(--line);background:#2e6b3b;aspect-ratio:16/9;max-height:var(--mjg-h,calc(100vh - 80px));max-width:calc(var(--mjg-h,100vh) * 16 / 9);margin:0 auto;width:100%}
.mj-golf-course svg{display:block;width:100%;height:100%;outline:none;touch-action:none;user-select:none;-webkit-user-select:none}
.mj-golf-course svg:focus-visible{box-shadow:inset 0 0 0 4px #ffd84d}
.mj-golf-course.fil svg{cursor:crosshair}
.mj-golf-panel{background:var(--surface);border:2px solid var(--line);border-radius:14px;padding:12px 14px;display:flex;flex-direction:column;gap:9px;min-width:0;max-height:var(--mjg-h,calc(100vh - 80px));overflow:auto}
.mj-golf-mis{margin:0;font-weight:600;line-height:1.4;font-size:.98rem}
.mj-golf-data{margin:0;background:var(--paper);border:2px dashed var(--line);border-radius:10px;padding:6px 10px;font-size:.98rem;line-height:1.5}
.mj-golf-data .ang{font-weight:700}
.mj-golf-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.mj-golf-row label{font-weight:700;min-width:5.4em}
.mj-golf-angin{font:inherit;font-size:1.45rem;font-weight:800;width:3.6em;text-align:center;padding:4px 6px;border-radius:12px;border:2px solid var(--line);background:var(--paper);color:var(--ink);font-variant-numeric:tabular-nums}
.mj-golf-angin:focus{outline:3px solid color-mix(in srgb,var(--c) 45%,transparent);border-color:var(--c)}
.mj-golf-deg{font-size:1.45rem;font-weight:800}
.mj-golf-pm{font:inherit;font-weight:800;font-size:1.2rem;width:36px;height:36px;border-radius:10px;border:2px solid var(--line);background:var(--paper);color:var(--ink);cursor:pointer;line-height:1}
.mj-golf-pm:hover{border-color:var(--c)}
.mj-golf-pv{font-size:1.45rem;font-weight:800;min-width:1.6em;text-align:center;font-variant-numeric:tabular-nums}
.mj-golf-range{flex:1;min-width:100px;accent-color:var(--c);height:24px;cursor:pointer}
.mj-golf-ptx{font-size:.95rem;color:var(--muted);font-weight:600;white-space:nowrap}
.mj-golf-row .mj-golf-shoot{margin-left:auto}
.mj-golf-warn{color:var(--ko);font-weight:600;font-size:.92rem;margin:-4px 0 0;min-height:0}
.mj-golf-warn:empty{display:none}
.mj-golf-shoot{font-size:1.08rem!important;padding:8px 18px}
.mj-golf-tools{display:flex;gap:8px;flex-wrap:wrap}
.mj-golf-tool{font:inherit;font-size:.92rem;font-weight:600;color:var(--ink);background:none;border:2px dashed var(--line);border-radius:999px;padding:5px 13px;cursor:pointer}
.mj-golf-tool[aria-pressed="true"]{border-style:solid;border-color:var(--c);background:color-mix(in srgb,var(--c) 14%,transparent)}
.mj-golf-tool:disabled{opacity:.5;cursor:default}
.mj-golf-hint{margin:0;font-size:.93rem;line-height:1.45;background:var(--warnbg);border:2px solid var(--warn);border-radius:10px;padding:6px 10px}
.mj-golf-hint p{margin:2px 0}
.mj-golf-fb{border-radius:12px;padding:8px 12px;border:2px solid var(--line);font-size:.94rem}
.mj-golf-fb.ok{background:var(--okbg);border-color:var(--ok)}
.mj-golf-fb.mid{background:var(--warnbg);border-color:var(--warn)}
.mj-golf-fb.ko{background:var(--kobg);border-color:var(--ko)}
.mj-golf-fb .mj-golf-verdict{font-weight:800;font-size:1.08rem;margin:0 0 2px}
.mj-golf-fb.ok .mj-golf-verdict{color:var(--ok)} .mj-golf-fb.mid .mj-golf-verdict{color:var(--warn)} .mj-golf-fb.ko .mj-golf-verdict{color:var(--ko)}
.mj-golf-fb p{margin:3px 0;line-height:1.42}
.mj-golf-end{position:absolute;inset:0;z-index:30;display:flex;align-items:flex-start;justify-content:center;padding-top:14px;background:rgba(10,30,16,.22)}
.mj-golf-end.card{align-items:center;padding-top:0;background:rgba(10,30,16,.45)}
.mj-golf-endbox{background:var(--surface);color:var(--ink);border:2px solid var(--line);border-radius:18px;padding:14px 24px;text-align:center;max-width:min(600px,94%);box-shadow:0 16px 40px rgba(0,0,0,.3)}
.mj-golf-endbox h3{font-family:var(--f-display);font-size:1.5rem;margin:0 0 4px}
.mj-golf-endbox .mj-golf-big .mj-golf-star{width:40px;height:40px}
.mj-golf-endbox p{margin:6px 0}
.mj-golf-endbox .mj-golf-new{color:var(--ok);font-weight:800}
.mj-golf-endbox .mj-golf-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:12px}
.mj-golf-sc{border-collapse:collapse;margin:8px auto;font-variant-numeric:tabular-nums}
.mj-golf-sc td,.mj-golf-sc th{border:1.5px solid var(--line);padding:3px 7px;text-align:center;font-size:.92rem}
.mj-golf-sc th{color:var(--muted);font-weight:700}
@keyframes mj-golf-pop{0%{transform:scale(.6);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
.mj-golf-endbox .mj-golf-big .mj-golf-star.on{animation:mj-golf-pop .5s both}
.mj-golf-endbox .mj-golf-big .mj-golf-star.on:nth-child(2){animation-delay:.18s}
.mj-golf-endbox .mj-golf-big .mj-golf-star.on:nth-child(3){animation-delay:.36s}
@keyframes mj-golf-ring{0%{r:14;opacity:.9}100%{r:46;opacity:0}}
.mj-golf-ringfx{animation:mj-golf-ring .9s ease-out 2}
@media (prefers-reduced-motion: reduce){ .mj-golf *{transition:none!important;animation:none!important} .mj-golf-ringfx{display:none} }
@media (max-width:980px){ .mj-golf-main{grid-template-columns:1fr} .mj-golf-levels{grid-template-columns:repeat(2,minmax(0,1fr))} .mj-golf-panel{max-height:none} }
html.fs-1 .mj-golf-main, html.fs-2 .mj-golf-main{grid-template-columns:minmax(0,1fr) 350px}
`;

/* ---------- Dessin SVG ---------- */
const TXT = (x, y, s, opt) => { opt=opt||{}; return `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${opt.a||"middle"}" dy=".35em" style="font:${opt.w||700} ${opt.fs||16}px Arial,Helvetica,sans-serif" fill="${opt.c||"#15213b"}" stroke="${opt.halo===false?"none":"#fff"}" stroke-width="4" stroke-linejoin="round" paint-order="stroke">${s}</text>`; };
function pill(x, y, s, col){
  const w = 14 + s.length*10.5;
  return `<g><rect x="${f1(x-w/2)}" y="${f1(y-14)}" width="${f1(w)}" height="28" rx="8" fill="#fff" stroke="${col||"#7a3fd0"}" stroke-width="2.2"/>${TXT(x, y, s, {c:col||"#7a3fd0", fs:18, w:800, halo:false})}</g>`;
}
function arcSvg(c, a1, a2, r){ /* arc de a1 à a2 (degrés, sens inverse des aiguilles), a2-a1 dans [0,360[ */
  let d = ((a2-a1)%360+360)%360; const s = add(c, dir(a1), r), e = add(c, dir(a1+d), r);
  return `M${f1(s.x)} ${f1(s.y)}A${r} ${r} 0 ${d>180?1:0} 0 ${f1(e.x)} ${f1(e.y)}`;
}
function arcBetween(c, u, v, r){ /* le plus petit arc entre les directions c->u et c->v */
  let a = angOf(c,u), b = angOf(c,v), d = ((b-a)%360+360)%360;
  if(d>180){ const z=a; a=b; b=z; d=360-d; }
  return {path:arcSvg(c, a, b, r), mid:a+d/2};
}
function rightMark(c, u, v, s){
  const du = dir(angOf(c,u)), dv = dir(angOf(c,v)), p1 = add(c,du,s), p3 = add(c,dv,s), p2 = add(p1,dv,s);
  return `<path d="M${f1(p1.x)} ${f1(p1.y)}L${f1(p2.x)} ${f1(p2.y)}L${f1(p3.x)} ${f1(p3.y)}" fill="none" stroke="#15213b" stroke-width="2"/>`;
}
function labOff(h, n){
  const p = h.pt[n], E = h.E;
  if(n==="B") return {dx:-18, dy:24};
  if(n==="T"){ /* du côté opposé au point de rebond, sous le drapeau */
    const P = h.pt.P; return P && P.x < p.x - 20 && p.x < E.x1 - 60 ? {dx:h.cup+16, dy:h.cup+6} : {dx:-(h.cup+15), dy:-4}; }
  if(Math.abs(p.y-E.y0)<1) return {dx:0, dy:26};
  if(Math.abs(p.y-E.y1)<1) return {dx:0, dy:-26};
  if(Math.abs(p.x-E.x1)<1) return {dx:-24, dy:0};
  if(Math.abs(p.x-E.x0)<1) return {dx:24, dy:0};
  return {dx:12, dy:-14};
}
function drawStatic(h, showAids, showRapp){
  const b = h.box, E = h.E, p = h.pt, g = [];
  g.push(`<defs><pattern id="mjg-grid" width="${CAR}" height="${CAR}" patternUnits="userSpaceOnUse"><path d="M${CAR} 0H0V${CAR}" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="1"/></pattern>
    <radialGradient id="mjg-ball" cx="35%" cy="32%" r="70%"><stop offset="0" stop-color="#fff"/><stop offset=".7" stop-color="#eef1f4"/><stop offset="1" stop-color="#b9c1cc"/></radialGradient></defs>`);
  g.push(`<rect width="${W}" height="${H}" fill="#2e6b3b"/>`);
  for(let i=0;i<40;i++){ const x=(i*137+29)%W, y=(i*71+13)%H; g.push(`<circle cx="${x}" cy="${y}" r="${10+(i%3)*5}" fill="#346f40"/><circle cx="${x-3}" cy="${y-3}" r="${4+(i%3)*2}" fill="#3d7c49"/>`); }
  g.push(`<rect x="${b.x0-8}" y="${b.y0-8}" width="${b.x1-b.x0+16}" height="${b.y1-b.y0+16}" rx="10" fill="none" stroke="#8a5a2b" stroke-width="16"/>`);
  g.push(`<rect x="${b.x0-15}" y="${b.y0-15}" width="${b.x1-b.x0+30}" height="${b.y1-b.y0+30}" rx="14" fill="none" stroke="#6b4220" stroke-width="2"/>`);
  g.push(`<rect x="${b.x0}" y="${b.y0}" width="${b.x1-b.x0}" height="${b.y1-b.y0}" fill="#4aa35a"/><rect x="${b.x0}" y="${b.y0}" width="${b.x1-b.x0}" height="${b.y1-b.y0}" fill="url(#mjg-grid)"/>`);
  g.push(`<rect x="${b.x0+1}" y="${b.y0+1}" width="${b.x1-b.x0-2}" height="${b.y1-b.y0-2}" fill="none" stroke="#c48a4f" stroke-width="2"/>`);
  for(const w of h.water){
    g.push(`<rect x="${w.x}" y="${w.y}" width="${w.w}" height="${w.h}" rx="18" fill="#3d8fdc" stroke="#2a67a8" stroke-width="3"/>`);
    for(let i=1;i<=Math.floor(w.h/22);i++){ const y=w.y+i*22-6, x0=w.x+16, x1=w.x+w.w-16; let d=`M${x0} ${y}`; for(let x=x0;x<x1-10;x+=20) d+=`q5 -5 10 0t10 0`; g.push(`<path d="${d}" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2"/>`); }
  }
  for(const r of h.rects) g.push(`<rect x="${f1(r.x)}" y="${f1(r.y)}" width="${f1(r.w)}" height="${f1(r.h)}" rx="3" fill="#9a6332" stroke="#6b4220" stroke-width="2"/><rect x="${f1(r.x+3)}" y="${f1(r.y+3)}" width="${f1(Math.max(0,r.w-6))}" height="${f1(Math.max(0,r.h-6))}" rx="2" fill="none" stroke="rgba(255,220,170,.35)" stroke-width="1.5"/>`);
  /* départ */
  g.push(`<circle cx="${f1(p.B.x)}" cy="${f1(p.B.y)}" r="20" fill="rgba(255,255,255,.16)" stroke="rgba(255,255,255,.5)" stroke-width="1.5"/>`);
  /* repères d'estimation */
  if(h.guides){
    for(const a of h.guides){ const e = add(p.B, dir(a), 150); g.push(`<path d="M${f1(p.B.x)} ${f1(p.B.y)}L${f1(e.x)} ${f1(e.y)}" stroke="rgba(255,255,255,.85)" stroke-width="2" stroke-dasharray="7 6"/>`);
      const l = add(p.B, dir(a), 176); g.push(TXT(l.x, l.y, a+"°", {fs:18, c:"#1b4d2a"})); }
    g.push(rightMark(p.B, p.X, add(p.B, dir(90), 10), 18).replace('stroke="#15213b"','stroke="#fff"'));
  }
  if(h.seg) g.push(`<path d="M${f1(p.B.x)} ${f1(p.B.y)}L${f1(p.T.x)} ${f1(p.T.y)}" stroke="#fff" stroke-width="2.4" stroke-dasharray="3 6" stroke-linecap="round"/>`);
  /* figure */
  const names = new Set(h.names||[]);
  for(const e of h.fig){
    if(e.aid && !showAids) continue;
    if(e.k==="seg"){ const a=p[e.a], c=p[e.b]; g.push(`<path d="M${f1(a.x)} ${f1(a.y)}L${f1(c.x)} ${f1(c.y)}" stroke="#fff" stroke-width="${e.faint?1.8:2.4}" stroke-dasharray="${e.aid?"12 7":"3 6"}" stroke-linecap="round" opacity="${e.faint?.75:1}"/>`); }
    else if(e.k==="right") g.push(rightMark(p[e.c], p[e.u], p[e.v], 18));
    else if(e.k==="mark"){ const q=p[e.n]; g.push(`<circle cx="${f1(q.x)}" cy="${f1(q.y)}" r="${BR}" fill="rgba(255,255,255,.35)" stroke="#fff" stroke-width="1.6" stroke-dasharray="3 2"/>`); }
  }
  for(const e of h.fig){
    if(e.k!=="arc" || (e.aid && !showAids)) continue;
    const c = p[e.c], A = arcBetween(c, p[e.u], p[e.v], e.r), col = e.lab==="?" ? "#b45309" : "#7a3fd0", half = between(c, p[e.u], p[e.v])/2;
    g.push(`<path d="${A.path}" fill="none" stroke="${col}" stroke-width="3.2"/>`);
    /* l'étiquette sur la bissectrice, assez loin des deux côtés de l'angle */
    const rl = Math.min(150, Math.max(e.r + 28, 30/Math.sin(rad(Math.max(half,8)))));
    const l = add(c, dir(A.mid), rl); g.push(pill(l.x, l.y, e.lab, col));
  }
  if(showAids && h.aidNames) h.aidNames.forEach(n=>names.add(n));
  /* référence (toujours horizontale, vers la droite) */
  g.push(refLine(h));
  if(h.n<=4 && !showRapp){ /* sens de mesure */
    const s = add(p.B, dir(6), 40), e = add(p.B, dir(62), 40), ah = add(p.B, dir(62), 40);
    g.push(`<path d="M${f1(s.x)} ${f1(s.y)}A40 40 0 0 0 ${f1(e.x)} ${f1(e.y)}" fill="none" stroke="#15213b" stroke-width="2"/><path d="M${f1(ah.x)} ${f1(ah.y)}l9 -2 -5 8z" fill="#15213b" transform="rotate(${f1(-62)} ${f1(ah.x)} ${f1(ah.y)})"/>`);
  }
  /* trou + drapeau */
  g.push(`<circle cx="${f1(p.T.x)}" cy="${f1(p.T.y)}" r="${h.cup+3}" fill="#e8f5e9" opacity=".9"/><circle cx="${f1(p.T.x)}" cy="${f1(p.T.y)}" r="${h.cup}" fill="#0f2a18"/><circle class="mj-golf-ringc" cx="${f1(p.T.x)}" cy="${f1(p.T.y)}" r="0" fill="none" stroke="#fff" stroke-width="3"/>`);
  g.push(`<g class="mj-golf-flag"><path d="M${f1(p.T.x+2)} ${f1(p.T.y)}V${f1(p.T.y-46)}" stroke="#f4f4f4" stroke-width="3"/><path d="M${f1(p.T.x+3)} ${f1(p.T.y-46)}l22 7 -22 7z" fill="#e53935"/></g>`);
  /* noms des points */
  for(const n of names){ const q=p[n]; if(!q) continue; const o=labOff(h,n);
    if(n==="Q" || n==="N" || n==="R") g.push(`<circle cx="${f1(q.x)}" cy="${f1(q.y)}" r="4" fill="#15213b" stroke="#fff" stroke-width="1.5"/>`);
    g.push(TXT(q.x+o.dx, q.y+o.dy, n, {fs:20, w:800})); }
  return g.join("");
}
function refLine(h){
  const p = h.pt, xe = {x:Math.min(p.B.x+150, h.E.x1+6), y:p.B.y};
  return `<path d="M${f1(p.B.x)} ${f1(p.B.y)}L${f1(xe.x)} ${f1(xe.y)}" stroke="#15213b" stroke-width="3.2" stroke-linecap="round"/>` + TXT(xe.x-6, xe.y-15, "x", {fs:20, w:800, a:"end"}) + TXT(Math.min(p.B.x+66, (p.B.x+xe.x)/2+6), p.B.y+18, "0°", {fs:15, w:700});
}
function drawRapp(B, phi, fil){
  const R = RAPP, g = [], P = (t,r) => add(B, dir(t), r);
  const e0 = P(0,R), e1 = P(180,R);
  g.push(`<path d="M${f1(e0.x+8)} ${f1(e0.y+6)}L${f1(e0.x)} ${f1(e0.y)}A${R} ${R} 0 0 0 ${f1(e1.x)} ${f1(e1.y)}L${f1(e1.x-8)} ${f1(e1.y+6)}Z" fill="rgba(235,244,255,.78)" stroke="#2f5fb8" stroke-width="1.6"/>`);
  for(let t=0;t<=180;t++){ const l = t%10===0 ? 16 : t%5===0 ? 11 : 6, a=P(t,R), c=P(t,R-l);
    g.push(`<path d="M${f1(a.x)} ${f1(a.y)}L${f1(c.x)} ${f1(c.y)}" stroke="#163a7a" stroke-width="${t%10===0?1.5:t%5===0?1.1:.8}"/>`); }
  for(let t=0;t<=180;t+=10){ const a=P(t,R-30); g.push(`<text x="${f1(a.x)}" y="${f1(a.y)}" dy=".35em" text-anchor="middle" style="font:700 14px Arial,sans-serif" fill="#163a7a">${t}</text>`); }
  const i0=P(0,52), i1=P(180,52);
  g.push(`<path d="M${f1(i0.x)} ${f1(i0.y)}A52 52 0 0 0 ${f1(i1.x)} ${f1(i1.y)}" fill="none" stroke="#2f5fb8" stroke-width="1"/>`);
  g.push(`<path d="M${f1(B.x-10)} ${f1(B.y)}H${f1(B.x+10)}M${f1(B.x)} ${f1(B.y-10)}V${f1(B.y+4)}" stroke="#c62828" stroke-width="1.8"/>`);
  if(fil){ const e = P(phi, R+46); g.push(`<path d="M${f1(B.x)} ${f1(B.y)}L${f1(e.x)} ${f1(e.y)}" stroke="#d93025" stroke-width="2.2"/><circle class="mj-golf-filh" cx="${f1(e.x)}" cy="${f1(e.y)}" r="10" fill="#d93025" stroke="#fff" stroke-width="2"/>`); }
  return g.join("");
}

/* ---------- Le jeu ---------- */
function init(root){
  if(!document.getElementById("mj-golf-css")){ const st=document.createElement("style"); st.id="mj-golf-css"; st.textContent=CSS; document.head.appendChild(st); }
  const data = load(); data.stars = data.stars || {}; data.coups = data.coups || {}; data.parc = data.parc || null;
  root.innerHTML = `<div class="mj-golf"><div class="mj-golf-menu"></div><div class="mj-golf-game" hidden></div></div>`;
  const WR = root.querySelector(".mj-golf"), MENU = WR.querySelector(".mj-golf-menu"), GAME = WR.querySelector(".mj-golf-game");
  const alive = () => root.isConnected && WR.isConnected;
  const $ = s => GAME.querySelector(s);
  let S = null, raf = 0;
  const HELP = `<ul>
    <li>Tape l'<b>angle de tir</b> en degrés, choisis la <b>puissance</b>, puis appuie sur <b>Entrée</b> (ou «${NBSP}Tirer${NBSP}»).</li>
    <li>L'angle se mesure à partir de la <b>demi-droite de référence</b> [Bx) (horizontale, vers la droite), dans le <b>sens inverse des aiguilles d'une montre</b>, comme avec un rapporteur : 0° à droite, 90° vers le haut, 180° à gauche.</li>
    <li>Puissance 1 à 12 : la balle roule <b>3 carreaux</b> par point de puissance. Trop fort, elle saute par-dessus le trou ! (Flèches ↑ ↓ dans la case de l'angle : changer la puissance.)</li>
    <li>Les murs renvoient la balle avec le <b>même angle</b> qu'à l'arrivée.</li>
    <li>Raté ? La balle revient au départ et on te dit de combien corriger. Dans le trou en 1 coup : 3 étoiles, 2 coups : 2, 3 coups : 1. ${MAXC} coups au maximum.</li></ul>`;

  function menu(){
    cancelAnimationFrame(raf); S = null; GAME.hidden = true; MENU.hidden = false;
    const tot = TROUS.reduce((s,_,i)=>s+(data.stars[i+1]||0),0), first = !Object.keys(data.stars).length;
    MENU.innerHTML = `<details class="mj-golf-help"${first?" open":""}><summary>Comment jouer&nbsp;?</summary>${HELP}</details>
      <div class="mj-golf-parc"><div class="mj-golf-ptxt"><b>Le parcours complet : 9 trous</b>
        <p>${data.parc ? `Record : ${pl(data.parc.coups,"coup")} au total, ${pl(data.parc.stars,"étoile")} sur 27.` : "Fais les 9 trous à la suite et compte tes coups, comme au vrai mini-golf."}</p></div>
        <button class="btn primary mj-golf-goparc">Jouer le parcours →</button></div>
      <div class="mj-golf-menuhead"><h2>Ou entraîne-toi sur un trou</h2><span class="mj-golf-tot">${pl(tot,"étoile")} sur ${TROUS.length*3}</span></div>
      <div class="mj-golf-levels">${TROUS.map((L,i)=>`<button class="mj-golf-lv" data-l="${i+1}">
        <span class="mj-golf-n"><b>Trou ${i+1}</b>${STARS(data.stars[i+1]||0)}</span><span class="mj-golf-tt">${L.t}</span><span class="mj-golf-dd">${L.d}</span>
        <span class="mj-golf-rec">${data.coups[i+1]!=null ? "Record : "+pl(data.coups[i+1],"coup") : "Pas encore joué"}</span></button>`).join("")}</div>`;
    MENU.querySelectorAll(".mj-golf-lv").forEach(b=>b.onclick=()=>{ S0 = {mode:"trou"}; start(+b.dataset.l); });
    MENU.querySelector(".mj-golf-goparc").onclick=()=>{ S0 = {mode:"parc", card:[]}; start(1); };
  }
  let S0 = null;   /* état du mode (trou seul ou parcours) */
  function scrollGame(){ try{ const r=root.getBoundingClientRect(); if(r.top<0 || r.top>140) { root.scrollIntoView({block:"start", behavior: reduced() ? "auto" : "smooth"}); } }catch(e){} }

  function start(n){
    cancelAnimationFrame(raf);
    const h = gen(n);
    S = {n, h, coups:0, phase:"aim", rapp:false, aids:!h.aidsHidden, hint:false, phi:90, power:(S && S.n===n-1 && S.power) ? S.power : 5, last:null};
    if(S0.mode==="parc" && S0.card.length===0) S.power = 5;
    MENU.hidden = true; GAME.hidden = false;
    const L = TROUS[n-1];
    GAME.innerHTML = `<div class="mj-golf-top">
        <button class="btn mj-golf-back">← Trous</button>
        <span class="mj-golf-lvname"><span>Trou ${n}${S0.mode==="parc"?" / 9":""}</span> · ${L.t}</span>
        ${S0.mode==="parc" ? `<span class="mj-golf-card" aria-label="Carte de score">${TROUS.map((_,i)=>`<i class="${i<S0.card.length?"s"+starsFor(S0.card[i]):i===n-1?"cur":""}">${i<S0.card.length?S0.card[i]:i+1}</i>`).join("")}</span>` : ""}
        <span class="mj-golf-coup" aria-live="polite"></span>
        <details><summary>Aide</summary><div class="mj-golf-pop">${HELP}</div></details></div>
      <div class="mj-golf-main">
        <div class="mj-golf-course"><svg viewBox="0 0 ${W} ${H}" tabindex="0" role="img" aria-label="Terrain de mini-golf, trou ${n}"><g class="g-static"></g><g class="g-trace"></g><g class="g-rapp"></g><g class="g-ball"></g></svg></div>
        <div class="mj-golf-panel">
          <p class="mj-golf-mis">${MISSION[n-1]}</p>
          ${h.given!=null ? `<p class="mj-golf-data">On sait : ${givenText(h)}.<br><span style="color:var(--muted);font-size:.9rem">Angle de tir : ${ANG("xBP")}, entre [Bx) et [BP).</span></p>` : ""}
          <div class="mj-golf-row"><label for="mjg-ang">Angle de tir</label><input id="mjg-ang" class="mj-golf-angin" type="text" inputmode="decimal" autocomplete="off" maxlength="6" aria-describedby="mjg-warn"><span class="mj-golf-deg">°</span><button class="btn primary mj-golf-shoot">Tirer</button></div>
          <p class="mj-golf-warn" id="mjg-warn" role="alert"></p>
          <div class="mj-golf-row"><label for="mjg-pow">Puissance</label><button class="mj-golf-pm" data-d="-1" aria-label="Moins fort">−</button><span class="mj-golf-pv"></span><button class="mj-golf-pm" data-d="1" aria-label="Plus fort">+</button></div>
          <div class="mj-golf-row"><input id="mjg-pow" class="mj-golf-range" type="range" min="1" max="${PMAX}" step="1" aria-label="Puissance"><span class="mj-golf-ptx"></span></div>
          <div class="mj-golf-tools">${h.rapp ? `<button class="mj-golf-tool mj-golf-trapp" aria-pressed="false">📐 Rapporteur</button>` : ""}${h.kind==="calc" ? `<button class="mj-golf-tool mj-golf-thint" aria-pressed="false">💡 Coup de pouce</button>` : ""}</div>
          <div class="mj-golf-hintbox"></div>
          <div class="mj-golf-fbbox"></div>
        </div></div>`;
    $(".mj-golf-back").onclick = menu;
    const inp = $(".mj-golf-angin"), rng = $(".mj-golf-range");
    inp.addEventListener("keydown", e=>{
      if(e.key==="Enter"){ e.preventDefault(); shoot(); }
      else if(e.key==="ArrowUp" || e.key==="ArrowDown"){ e.preventDefault(); setPow(S.power + (e.key==="ArrowUp"?1:-1)); }
    });
    inp.addEventListener("input", ()=>{ $(".mj-golf-warn").textContent=""; });
    rng.addEventListener("input", ()=>setPow(+rng.value));
    GAME.querySelectorAll(".mj-golf-pm").forEach(b=>b.onclick=()=>setPow(S.power + (+b.dataset.d)));
    $(".mj-golf-shoot").onclick = shoot;
    const tr = $(".mj-golf-trapp"); if(tr) tr.onclick = ()=>{ S.rapp=!S.rapp; tr.setAttribute("aria-pressed", S.rapp); $(".mj-golf-course").classList.toggle("fil", S.rapp); redraw(); };
    const th = $(".mj-golf-thint"); if(th) th.onclick = ()=>{ S.hint=!S.hint; S.aids = S.hint || !h.aidsHidden; th.setAttribute("aria-pressed", S.hint);
      $(".mj-golf-hintbox").innerHTML = S.hint ? `<div class="mj-golf-hint">${hintLines(h).map(t=>`<p>${t}</p>`).join("")}</div>` : ""; redraw(); };
    /* fil du rapporteur : souris (glisser) ou flèches quand le terrain a le focus */
    const svg = GAME.querySelector("svg");
    let drag = false;
    const toPt = e => { const m = svg.getScreenCTM(); if(!m) return null; const q = svg.createSVGPoint(); q.x=e.clientX; q.y=e.clientY; return q.matrixTransform(m.inverse()); };
    const setPhi = e => { const q=toPt(e); if(!q) return; let a = deg(Math.atan2(-(q.y-h.pt.B.y), q.x-h.pt.B.x)); if(a<-90) a=180; else if(a<0) a=0; S.phi = Math.round(a*2)/2; drawRappLayer(); };
    svg.addEventListener("pointerdown", e=>{ if(!S.rapp || !h.fil || S.phase!=="aim") return; drag=true; try{ svg.setPointerCapture(e.pointerId); }catch(_){} setPhi(e); e.preventDefault(); });
    svg.addEventListener("pointermove", e=>{ if(drag) setPhi(e); });
    const up = ()=>{ drag=false; }; svg.addEventListener("pointerup", up); svg.addEventListener("pointercancel", up);
    svg.addEventListener("keydown", e=>{ if(!S.rapp || !h.fil) return; if(e.key==="ArrowLeft"||e.key==="ArrowRight"){ e.preventDefault(); S.phi=Math.max(0,Math.min(180,S.phi+(e.key==="ArrowLeft"?1:-1)*(e.shiftKey?5:1))); drawRappLayer(); } });
    setPow(S.power); topbar(); redraw(); drawBall(h.pt.B, BR);
    scrollGame(); fitHeight(); setTimeout(fitHeight, reduced() ? 0 : 450);
    setTimeout(()=>{ if(alive() && S && S.h===h) inp.focus({preventScroll:true}); }, 30);
  }
  /* hauteur disponible sous la barre du jeu, pour jouer sans faire défiler la page */
  function fitHeight(){
    if(!alive() || GAME.hidden) return;
    const m = GAME.querySelector(".mj-golf-main"); if(!m) return;
    const r = m.getBoundingClientRect(), z = (m.offsetWidth ? r.width/m.offsetWidth : 1) || 1;
    const top = Math.max(r.top, 60), avail = (innerHeight - top - 10)/z;
    WR.style.setProperty("--mjg-h", Math.max(330, Math.round(avail)) + "px");
  }
  if(!window.__mjGolfResize){ window.__mjGolfResize = true; addEventListener("resize", ()=>{ const f = window.__mjGolfFit; if(f) f(); }); }
  window.__mjGolfFit = fitHeight;
  function setPow(v){
    S.power = Math.max(1, Math.min(PMAX, Math.round(v)));
    $(".mj-golf-pv").textContent = S.power; $(".mj-golf-range").value = S.power;
    $(".mj-golf-ptx").textContent = `${3*S.power} carreaux`;
    $(".mj-golf-ptx").title = `La balle roule ${3*S.power} carreaux (si elle ne tombe pas avant).`;
  }
  function topbar(){
    const c = S.coups + 1, st = starsFor(c);
    $(".mj-golf-coup").innerHTML = S.phase==="done" ? `${pl(S.coups,"coup")}` : `Coup n° ${Math.min(c,MAXC)} ${STARS(st)}`;
    $(".mj-golf-coup").title = S.phase==="done" ? "" : "Étoiles gagnées si ce coup est dans le trou";
  }
  function redraw(){
    const h = S.h;
    GAME.querySelector(".g-static").innerHTML = drawStatic(h, S.aids, S.rapp);
    drawRappLayer(); drawTrace();
  }
  function drawRappLayer(){ GAME.querySelector(".g-rapp").innerHTML = S.rapp ? drawRapp(S.h.pt.B, S.phi, S.h.fil) + refLine(S.h) : ""; }
  function drawTrace(cur){
    const g = GAME.querySelector(".g-trace"); let s = "";
    const L = cur || S.last;
    if(L){
      const pts = L.pts.filter(q=>q.s<=L.s).map(q=>`${f1(q.x)},${f1(q.y)}`); const e = posAt(L.pts, L.s); pts.push(`${f1(e.x)},${f1(e.y)}`);
      s += `<polyline points="${pts.join(" ")}" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="2.6" stroke-dasharray="1 7" stroke-linecap="round"/>`;
      if(!cur && L.res!=="cup") s += `<circle cx="${f1(e.x)}" cy="${f1(e.y)}" r="${BR}" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="2" stroke-dasharray="3 3"/>`;
      if(!cur && L.showIdeal){ const B=S.h.pt.B, a=add(B, dir(S.h.theta), 120), l=add(B, dir(S.h.theta), 150);
        s += `<path d="M${f1(B.x)} ${f1(B.y)}L${f1(a.x)} ${f1(a.y)}" stroke="#ffe066" stroke-width="3" stroke-dasharray="8 5"/>` + pill(l.x, l.y, S.h.theta+"°", "#a16207"); }
    }
    g.innerHTML = s;
  }
  function drawBall(q, r){
    GAME.querySelector(".g-ball").innerHTML = r>0.3 ? `<ellipse cx="${f1(q.x+2)}" cy="${f1(q.y+3)}" rx="${f1(r)}" ry="${f1(r*.8)}" fill="rgba(0,0,0,.25)"/><circle cx="${f1(q.x)}" cy="${f1(q.y)}" r="${f1(r)}" fill="url(#mjg-ball)" stroke="#8a95a3" stroke-width="1"/>` : "";
  }
  function parseAng(v){
    v = String(v).trim().replace(/°/g,"").replace(",",".").replace(/\s/g,"");
    if(!/^\d+(\.\d+)?$/.test(v)) return null;
    const a = parseFloat(v); return a>=0 && a<=180 ? Math.round(a*10)/10 : NaN;
  }
  function shoot(){
    if(!S || S.phase!=="aim") return;
    const inp = $(".mj-golf-angin"), a = parseAng(inp.value), warn = $(".mj-golf-warn");
    if(a==null || isNaN(a)){ warn.textContent = a==null ? "Écris un angle en degrés (un nombre entre 0 et 180)." : "L'angle de tir est compris entre 0° et 180°."; inp.focus(); inp.select(); return; }
    warn.textContent = "";
    const h = S.h, p = S.power, o = sim(h, a, p);
    S.coups++; S.phase = "roll"; S.shot = {a, p};
    $(".mj-golf-fbbox").innerHTML = ""; GAME.querySelectorAll(".mj-golf-shoot,.mj-golf-angin,.mj-golf-pm,.mj-golf-range").forEach(el=>el.disabled=true);
    const shot = {pts:o.tr.pts, s:o.s, res:o.res};
    animate(shot, ()=>after(a, p, o, shot));
  }
  function animate(shot, done){
    S.last = null; drawTrace();
    const total = S.power*STEP, Tt = Math.sqrt(2*total/ACC), tEnd = Tt*(1-Math.sqrt(Math.max(0, 1-Math.min(1, shot.s/total))));
    const fin = () => {
      const e = posAt(shot.pts, shot.s);
      if(shot.res==="cup" || shot.res==="water") sink(e, shot.res, ()=>{ S.last = shot; drawTrace(); done(); });
      else { drawBall(e, BR); S.last = shot; drawTrace(); done(); }
    };
    if(reduced()){ fin(); return; }
    const t0 = performance.now();
    const step = now => {
      if(!alive() || !S) return;
      const t = Math.min(tEnd, (now-t0)/1000), s = total*(1-Math.pow(1-t/Tt, 2)), sc = Math.min(s, shot.s);
      const q = posAt(shot.pts, sc); drawBall(q, BR); drawTrace({pts:shot.pts, s:sc, res:"roll"});
      if(t>=tEnd-1e-6){ fin(); return; }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }
  function sink(e, kind, done){
    const T = S.h.pt.T, target = kind==="cup" ? T : e;
    if(reduced()){ drawBall(target, 0); done(); return; }
    const t0 = performance.now(), dur = 320;
    const step = now => {
      if(!alive() || !S) return;
      const u = Math.min(1, (now-t0)/dur), q = {x:e.x+(target.x-e.x)*u, y:e.y+(target.y-e.y)*u};
      drawBall(q, BR*(1-u*(kind==="cup"?0.9:1)));
      if(kind==="water"){ const g=GAME.querySelector(".g-ball"); g.insertAdjacentHTML("beforeend", `<circle cx="${f1(e.x)}" cy="${f1(e.y)}" r="${f1(8+u*22)}" fill="none" stroke="#fff" stroke-width="2.5" opacity="${f1(1-u)}"/>`); }
      if(u<1) raf = requestAnimationFrame(step); else { drawBall(target, 0); done(); }
    };
    raf = requestAnimationFrame(step);
  }
  function after(a, p, o, shot){
    if(!alive() || !S) return;
    const h = S.h, fb = $(".mj-golf-fbbox");
    if(o.res==="cup"){
      S.phase = "done";
      const st = starsFor(S.coups);
      const lines = [a===h.theta ? `Angle de tir : <b>${h.theta}°</b>, c'est exactement la bonne mesure. Puissance ${p}.` : `Ton angle : <b>${f1(a).replace(".",",")}°</b>. La mesure exacte était <b>${h.theta}°</b> : c'est passé quand même ! Puissance ${p}.`];
      if(h.kind==="calc"){ lines.push(`<b>Le calcul :</b>`); calcLines(h).forEach(t=>lines.push(t)); }
      fb.innerHTML = `<div class="mj-golf-fb ok" role="status"><p class="mj-golf-verdict">Dans le trou${S.coups===1?" du premier coup":""} !</p>${lines.map(t=>`<p>${t}</p>`).join("")}</div>`;
      const ring = GAME.querySelector(".mj-golf-ringc"); if(ring && !reduced()) ring.classList.add("mj-golf-ringfx");
      topbar(); finish(st);
      return;
    }
    const ex = explain(h, a, p, o);
    S.last = Object.assign(shot, {showIdeal: !ex.okAng});
    if(S.coups >= MAXC){
      S.phase = "done";
      fb.innerHTML = `<div class="mj-golf-fb ko" role="status"><p class="mj-golf-verdict">${ex.verdict}</p>${ex.lines.map(t=>`<p>${t}</p>`).join("")}<p><b>Plus de coups.</b> Regarde le bon tir : ${h.theta}°, puissance ${h.pOK[Math.floor((h.pOK.length-1)/2)]}.</p></div>`;
      topbar();
      setTimeout(()=>{ if(!alive() || !S || S.h!==h) return;
        const pg = h.pOK[Math.floor((h.pOK.length-1)/2)], o2 = sim(h, h.theta, pg), sh = {pts:o2.tr.pts, s:o2.s, res:o2.res};
        const keep = S.power; S.power = pg; drawBall(h.pt.B, BR);
        animate(sh, ()=>{ S.power = keep; finish(0); }); }, reduced() ? 0 : 900);
      return;
    }
    S.phase = "aim";
    const cls = ex.okAng ? "mid" : "ko";
    fb.innerHTML = `<div class="mj-golf-fb ${cls}" role="status"><p class="mj-golf-verdict">${ex.verdict} <span style="font-weight:600;font-size:.9rem;color:var(--muted)">Encore ${pl(MAXC-S.coups,"coup")}.</span></p>${ex.lines.map(t=>`<p>${t}</p>`).join("")}</div>`;
    const mis = $(".mj-golf-mis"); if(mis) mis.hidden = true;
    /* après un tir raté : la figure complète s'affiche (le calcul y fait référence) */
    if(h.kind==="calc" && !ex.okAng){ $(".mj-golf-hintbox").innerHTML = ""; if(!S.aids){ S.aids = true; redraw(); } }
    drawTrace();
    setTimeout(()=>{ if(!alive() || !S || S.h!==h || S.phase!=="aim") return; drawBall(h.pt.B, BR);
      GAME.querySelectorAll(".mj-golf-shoot,.mj-golf-angin,.mj-golf-pm,.mj-golf-range").forEach(el=>el.disabled=false);
      const inp=$(".mj-golf-angin"); inp.focus({preventScroll:true}); inp.select(); }, reduced() ? 0 : 450);
    topbar();
  }
  function finish(st){
    const n = S.n, coups = st>0 ? S.coups : MAXC+1;
    const rec = st>0 && (data.coups[n]==null || coups<data.coups[n]);
    if(st>0){ if(rec) data.coups[n] = coups; data.stars[n] = Math.max(data.stars[n]||0, st); save(data); }
    const parc = S0.mode==="parc";
    if(parc) S0.card.push(st>0 ? coups : MAXC+1);
    const box = document.createElement("div"); box.className = "mj-golf-end";
    const lastP = parc && n===9;
    const title = st===3 ? "Du premier coup !" : st===2 ? "Bien joué !" : st===1 ? "C'est dans le trou !" : "Trou non réussi";
    let body = `<div class="mj-golf-big">${STARS(st)}</div><p>${st>0 ? `Dans le trou en <b>${pl(coups,"coup")}</b>.` : `On compte ${MAXC+1} coups pour ce trou.`}</p>`;
    if(!parc) body += rec ? `<p class="mj-golf-new">Nouveau record sur ce trou !</p>` : data.coups[n]!=null ? `<p>Record : ${pl(data.coups[n],"coup")}</p>` : "";
    let btns;
    if(parc && !lastP) btns = `<button class="btn primary mj-golf-e-next">Trou ${n+1} →</button><button class="btn mj-golf-e-menu">Abandonner le parcours</button>`;
    else if(lastP) btns = `<button class="btn primary mj-golf-e-card">Voir ma carte de score</button>`;
    else btns = `<button class="btn mj-golf-e-again">Rejouer (nouveau terrain)</button>${n<9?`<button class="btn primary mj-golf-e-nexttrou">Trou ${n+1} →</button>`:""}<button class="btn mj-golf-e-menu">Tous les trous</button>`;
    box.innerHTML = `<div class="mj-golf-endbox" role="dialog" aria-label="Résultat du trou"><h3>${title}</h3>${body}<div class="mj-golf-btns">${btns}</div></div>`;
    $(".mj-golf-course").appendChild(box);
    const on = (c, f) => { const b = box.querySelector(c); if(b) b.onclick = f; return b; };
    on(".mj-golf-e-next", ()=>start(n+1)); on(".mj-golf-e-menu", menu); on(".mj-golf-e-again", ()=>start(n)); on(".mj-golf-e-nexttrou", ()=>start(n+1)); on(".mj-golf-e-card", scoreCard);
    const f = box.querySelector(".btn.primary") || box.querySelector(".btn"); if(f) f.focus({preventScroll:true});
  }
  function scoreCard(){
    const card = S0.card, tot = card.reduce((a,b)=>a+b,0), stars = card.reduce((a,c)=>a+(c<=MAXC?starsFor(c):0),0);
    const rec = !data.parc || tot<data.parc.coups || (tot===data.parc.coups && stars>data.parc.stars);
    if(rec){ data.parc = {coups:tot, stars}; save(data); }
    const box = document.createElement("div"); box.className = "mj-golf-end card";
    box.innerHTML = `<div class="mj-golf-endbox" role="dialog" aria-label="Carte de score"><h3>Parcours terminé !</h3>
      <table class="mj-golf-sc"><tr><th>Trou</th>${card.map((_,i)=>`<th>${i+1}</th>`).join("")}<th>Total</th></tr>
      <tr><th>Coups</th>${card.map(c=>`<td>${c}</td>`).join("")}<td><b>${tot}</b></td></tr>
      <tr><th>Étoiles</th>${card.map(c=>`<td>${c<=MAXC?starsFor(c):0}</td>`).join("")}<td><b>${stars}</b></td></tr></table>
      <p><b>${pl(tot,"coup")}</b> au total, <b>${pl(stars,"étoile")}</b> sur 27.</p>
      ${rec ? `<p class="mj-golf-new">Nouveau record du parcours !</p>` : `<p>Record : ${pl(data.parc.coups,"coup")}.</p>`}
      <p style="color:var(--muted);font-size:.92rem">Le parcours parfait : 9 coups, un par trou.</p>
      <div class="mj-golf-btns"><button class="btn primary mj-golf-e-re">Rejouer le parcours</button><button class="btn mj-golf-e-menu">Tous les trous</button></div></div>`;
    const old = GAME.querySelector(".mj-golf-end"); if(old) old.remove();
    $(".mj-golf-course").appendChild(box);
    box.querySelector(".mj-golf-e-re").onclick = ()=>{ S0 = {mode:"parc", card:[]}; start(1); };
    box.querySelector(".mj-golf-e-menu").onclick = menu;
    box.querySelector(".mj-golf-e-re").focus({preventScroll:true});
    S.phase = "card";
  }
  /* état lisible par les tests automatiques */
  root._mjEtat = () => S ? {n:S.n, phi:S.phi, theta:S.h.theta, pOK:S.h.pOK.slice(), coups:S.coups, phase:S.phase, given:S.h.given, mir:S.h.mir, kind:S.h.kind, card:S0 && S0.card ? S0.card.slice() : null, win:S.h.win} : {phase:"menu"};
  menu();
}
return {init, _t:{TROUS, gen, sim, trace, outcome, powersFor, validate, answerFrom, calcLines, explain, between, angOf, dir, prep, W, H, BR, CAR, STEP, PMAX, CAPV, MAXC}};
})();
