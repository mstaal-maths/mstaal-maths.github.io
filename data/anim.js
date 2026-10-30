/* Constructions animées : on voit les instruments (compas, règle, équerre, rapporteur) tracer, étape par étape.
   Dans un cours : <div class="anim" data-anim="ID"></div>  → le lecteur se monte tout seul.
   Chaque animation est déclarée avec ANIM.add("ID", {titre, sub, W, H, steps:K=>[ {t:"phrase", d:durée ms, f:(p,on)=>svg}, … ]}).
   f(p,on) dessine l'étape à l'avancement p (0→1) ; on=true pendant l'animation (on montre alors les instruments). */
(function(){
const NS='http://www.w3.org/2000/svg', CM=40, SLOW=1.6, PAUSE=1100;
const C={ink:'#15202e', arc:'#1e5aa8', res:'#c62828', soft:'#8aa0b8', grid:'#e6ecf3', ok:'#0b6b47', blue:'#1e5aa8', red:'#c62828', green:'#0b6b47', orange:'#d9730d', violet:'#6d28d9'};
const clamp=x=>Math.max(0,Math.min(1,x)), ease=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
const seg=(p,a,b)=>ease(clamp((p-a)/(b-a)));
const rad=d=>d*Math.PI/180, deg=r=>r*180/Math.PI;
const pt=(c,r,a)=>[c[0]+r*Math.cos(rad(a)), c[1]+r*Math.sin(rad(a))];
const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t];
const dist=(a,b)=>Math.hypot(b[0]-a[0],b[1]-a[1]);
const angTo=(a,b)=>deg(Math.atan2(b[1]-a[1],b[0]-a[0]));
const f=n=>(+n).toFixed(1);
const unit=(a,b)=>{ const d=dist(a,b)||1; return [(b[0]-a[0])/d,(b[1]-a[1])/d]; };
/* intersections de deux cercles (c1,r1) (c2,r2) */
const inter=(c1,r1,c2,r2)=>{ const d=dist(c1,c2), a=(r1*r1-r2*r2+d*d)/(2*d), h=Math.sqrt(Math.max(0,r1*r1-a*a)), u=unit(c1,c2), m=[c1[0]+u[0]*a,c1[1]+u[1]*a];
  return [[m[0]-u[1]*h,m[1]+u[0]*h],[m[0]+u[1]*h,m[1]-u[0]*h]]; };
/* projeté orthogonal de p sur la droite (a,b) */
const proj=(p,a,b)=>{ const u=unit(a,b), t=(p[0]-a[0])*u[0]+(p[1]-a[1])*u[1]; return [a[0]+u[0]*t,a[1]+u[1]*t]; };

const P={
  line:(a,b,o={})=>`<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${o.c||C.ink}" stroke-width="${o.w||2.6}" stroke-linecap="round"${o.dash?` stroke-dasharray="${o.dash}"`:''}/>`,
  partLine:(a,b,t,o)=>t<=0?'':P.line(a,lerp(a,b,Math.min(1,t)),o),
  /* droite « infinie » passant par a et b, prolongée de ext px de chaque côté */
  through:(a,b,ext=60)=>{ const u=unit(a,b); return [[a[0]-u[0]*ext,a[1]-u[1]*ext],[b[0]+u[0]*ext,b[1]+u[1]*ext]]; },
  arc:(c,r,a0,a1,t,o={})=>{ if(t<=0) return ''; t=Math.min(1,t); const e=a0+(a1-a0)*t, s=pt(c,r,a0), q=pt(c,r,e), large=Math.abs(e-a0)>180?1:0, sw=e>a0?1:0;
    if(Math.abs(e-a0)>=359.9) return `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r)}" fill="none" stroke="${o.c||C.arc}" stroke-width="${o.w||2.2}"/>`;
    return `<path d="M${f(s[0])} ${f(s[1])} A${f(r)} ${f(r)} 0 ${large} ${sw} ${f(q[0])} ${f(q[1])}" fill="none" stroke="${o.c||C.arc}" stroke-width="${o.w||2.2}" stroke-linecap="round"${o.dash?` stroke-dasharray="${o.dash}"`:''}/>`; },
  cross:(p,o={})=>{ const k=6; return `<g stroke="${o.c||C.ink}" stroke-width="2.4" stroke-linecap="round"><line x1="${f(p[0]-k)}" y1="${f(p[1]-k)}" x2="${f(p[0]+k)}" y2="${f(p[1]+k)}"/><line x1="${f(p[0]-k)}" y1="${f(p[1]+k)}" x2="${f(p[0]+k)}" y2="${f(p[1]-k)}"/></g>`; },
  dot:(p,o={})=>`<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${o.r||4}" fill="${o.c||C.ink}"/>`,
  label:(p,txt,dx=0,dy=0,o={})=>`<text x="${f(p[0]+dx)}" y="${f(p[1]+dy)}" font-family="Arial,sans-serif" font-size="${o.s||22}" font-weight="${o.wt||700}" fill="${o.c||C.ink}" text-anchor="${o.a||'middle'}" dominant-baseline="middle" paint-order="stroke" stroke="#fff" stroke-width="5"${o.it?' font-style="italic"':''}>${txt}</text>`,
  /* nom d'angle avec grand chapeau : P.angName([x,y],"ABC") */
  angName:(p,txt,o={})=>{ const s=o.s||20, w=txt.length*s*0.62; return P.label(p,txt,0,0,o)+`<path d="M${f(p[0]-w/2)} ${f(p[1]-s*0.62)} L${f(p[0])} ${f(p[1]-s*0.98)} L${f(p[0]+w/2)} ${f(p[1]-s*0.62)}" fill="none" stroke="${o.c||C.ink}" stroke-width="1.8" stroke-linejoin="round"/>`; },
  op:(t,svg)=>t<=0?'':(t>=1?svg:`<g opacity="${t.toFixed(2)}">${svg}</g>`),
  ticks:(a,b,n,o={})=>{ const m=lerp(a,b,.5), u=unit(a,b), v=[-u[1],u[0]], k=8; let s='';
    for(let i=0;i<n;i++){ const off=(i-(n-1)/2)*6, c=[m[0]+u[0]*off,m[1]+u[1]*off]; s+=P.line([c[0]-v[0]*k-u[0]*3,c[1]-v[1]*k-u[1]*3],[c[0]+v[0]*k+u[0]*3,c[1]+v[1]*k+u[1]*3],{c:o.c||C.res,w:2.2}); } return s; },
  /* codage d'angle droit au sommet o, u et v = vecteurs unitaires des deux côtés */
  right:(o,u,v,k=14,c=C.res)=>`<path d="M${f(o[0]+u[0]*k)} ${f(o[1]+u[1]*k)} L${f(o[0]+u[0]*k+v[0]*k)} ${f(o[1]+u[1]*k+v[1]*k)} L${f(o[0]+v[0]*k)} ${f(o[1]+v[1]*k)}" fill="none" stroke="${c}" stroke-width="2.2"/>`,
  /* arc de codage d'angle de sommet o entre les directions a0 et a1 (degrés) */
  angArc:(o,a0,a1,r=28,c=C.res,n=1)=>{ let s=''; for(let i=0;i<n;i++) s+=P.arc(o,r+i*5,a0,a1,1,{c,w:2}); return s; },
  /* polygone (rempli ou non) */
  poly:(pts,o={})=>`<polygon points="${pts.map(p=>f(p[0])+','+f(p[1])).join(' ')}" fill="${o.fill||'none'}" fill-opacity="${o.fo??1}" stroke="${o.c||C.ink}" stroke-width="${o.w||2.6}" stroke-linejoin="round"${o.dash?` stroke-dasharray="${o.dash}"`:''}/>`,
  /* quadrillage : origine o, pas s (px), nx × ny carreaux */
  grid:(o,s,nx,ny,c='#b9c6d6')=>{ let r=''; for(let i=0;i<=nx;i++) r+=`<line x1="${f(o[0]+i*s)}" y1="${f(o[1])}" x2="${f(o[0]+i*s)}" y2="${f(o[1]+ny*s)}" stroke="${c}" stroke-width="1"/>`;
    for(let j=0;j<=ny;j++) r+=`<line x1="${f(o[0])}" y1="${f(o[1]+j*s)}" x2="${f(o[0]+nx*s)}" y2="${f(o[1]+j*s)}" stroke="${c}" stroke-width="1"/>`; return r; },
  arrow:(a,b,o={})=>P.line(a,b,o)+(()=>{ const u=unit(a,b), v=[-u[1],u[0]], k=o.k||11; return `<path d="M${f(b[0]-u[0]*k+v[0]*k*.55)} ${f(b[1]-u[1]*k+v[1]*k*.55)} L${f(b[0])} ${f(b[1])} L${f(b[0]-u[0]*k-v[0]*k*.55)} ${f(b[1]-u[1]*k-v[1]*k*.55)}" fill="none" stroke="${o.c||C.ink}" stroke-width="${o.w||2.6}" stroke-linecap="round" stroke-linejoin="round"/>`; })(),
  /* flèche de cote double entre a et b, décalée de off px, avec texte */
  cote:(a,b,txt,off=-22,o={})=>{ const u=unit(a,b), v=[-u[1],u[0]], A=[a[0]+v[0]*off,a[1]+v[1]*off], B=[b[0]+v[0]*off,b[1]+v[1]*off], c=o.c||C.res;
    return P.arrow(lerp(A,B,.5),A,{c,w:2,k:9})+P.arrow(lerp(A,B,.5),B,{c,w:2,k:9})+P.label(lerp(A,B,.5),txt,v[0]*(off<0?-16:16),v[1]*(off<0?-16:16),{s:16,c}); },
};

/* ---------- instruments ---------- */
/* Compas : pointe sèche en p, mine en q ; side = +1/-1 : de quel côté est la charnière. */
function compass(p,q,side=1){
  const leg=150, d=Math.max(1,dist(p,q)), u=unit(p,q), n=[u[1]*side,-u[0]*side];
  const h=Math.sqrt(Math.max(0,leg*leg-(d/2)*(d/2))), m=lerp(p,q,.5), H=[m[0]+n[0]*h,m[1]+n[1]*h];
  const lp=(a,b,w0,w1)=>{ const e=unit(a,b), g=[-e[1],e[0]];
    return `${f(a[0]+g[0]*w0)},${f(a[1]+g[1]*w0)} ${f(b[0]+g[0]*w1)},${f(b[1]+g[1]*w1)} ${f(b[0]-g[0]*w1)},${f(b[1]-g[1]*w1)} ${f(a[0]-g[0]*w0)},${f(a[1]-g[1]*w0)}`; };
  const ns=lerp(H,p,.9), ps=lerp(H,q,.8), top=[H[0]+n[0]*34,H[1]+n[1]*34];
  return `<g class="tool"><polygon points="${lp(H,ns,7,3.5)}" fill="#7c8794" stroke="#3d4650" stroke-width="1"/>
    <line x1="${f(ns[0])}" y1="${f(ns[1])}" x2="${f(p[0])}" y2="${f(p[1])}" stroke="#3d4650" stroke-width="2"/>
    <polygon points="${lp(H,ps,7,4.5)}" fill="#7c8794" stroke="#3d4650" stroke-width="1"/>
    <polygon points="${lp(ps,lerp(ps,q,.75),5,5)}" fill="#f2c230" stroke="#9a7a10" stroke-width="1"/>
    <polygon points="${lp(lerp(ps,q,.75),q,4,.6)}" fill="#3b3b3b"/>
    <line x1="${f(H[0])}" y1="${f(H[1])}" x2="${f(top[0])}" y2="${f(top[1])}" stroke="#3d4650" stroke-width="7" stroke-linecap="round"/>
    <circle cx="${f(H[0])}" cy="${f(H[1])}" r="8" fill="#c9d1da" stroke="#3d4650" stroke-width="2"/></g>`;
}
/* Règle : graduation 0 en o, le long de la direction ang (degrés), len cm ; body=+1 : le corps est à droite du sens de lecture (en dessous pour ang=0). */
function ruler(o,ang,len,body=1,first=0){
  const u=[Math.cos(rad(ang)),Math.sin(rad(ang))], v=[-u[1]*body,u[0]*body], m=16, L=len*CM, w=38;
  const a=[o[0]-u[0]*m,o[1]-u[1]*m], b=[o[0]+u[0]*(L+m),o[1]+u[1]*(L+m)], c=[b[0]+v[0]*w,b[1]+v[1]*w], d=[a[0]+v[0]*w,a[1]+v[1]*w];
  let s=`<g class="tool"><polygon points="${f(a[0])},${f(a[1])} ${f(b[0])},${f(b[1])} ${f(c[0])},${f(c[1])} ${f(d[0])},${f(d[1])}" fill="#fff4c9" fill-opacity=".9" stroke="#8a7a3a" stroke-width="1.5"/>`;
  for(let i=0;i<=len*10;i++){ const x=[o[0]+u[0]*i*CM/10,o[1]+u[1]*i*CM/10], k=i%10===0?14:(i%5===0?10:6);
    s+=`<line x1="${f(x[0])}" y1="${f(x[1])}" x2="${f(x[0]+v[0]*k)}" y2="${f(x[1]+v[1]*k)}" stroke="#4a4020" stroke-width="${i%10===0?1.6:1}"/>`;
    if(i%10===0){ const t=[x[0]+v[0]*26,x[1]+v[1]*26]; s+=`<text x="${f(t[0])}" y="${f(t[1])}" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="#4a4020" text-anchor="middle" dominant-baseline="middle" transform="rotate(${f(ang)} ${f(t[0])} ${f(t[1])})">${i/10+first}</text>`; } }
  return s+'</g>';
}
/* Équerre : angle droit en o ; un côté (longueur a px) dans la direction ang, l'autre (b px) dans la direction ang+90*turn (turn=-1 : à gauche du premier côté, c.-à-d. « au-dessus » pour ang=0). */
function equerre(o,ang,a=170,b=110,turn=-1){
  const u=[Math.cos(rad(ang)),Math.sin(rad(ang))], v=[Math.cos(rad(ang+90*turn)),Math.sin(rad(ang+90*turn))];
  const A=[o[0]+u[0]*a,o[1]+u[1]*a], B=[o[0]+v[0]*b,o[1]+v[1]*b];
  const k=.38, i0=[o[0]+u[0]*22+v[0]*22,o[1]+u[1]*22+v[1]*22], iA=[i0[0]+u[0]*a*k,i0[1]+u[1]*a*k], iB=[i0[0]+v[0]*b*k,i0[1]+v[1]*b*k];
  let s=`<g class="tool"><path d="M${f(o[0])} ${f(o[1])} L${f(A[0])} ${f(A[1])} L${f(B[0])} ${f(B[1])} Z M${f(i0[0])} ${f(i0[1])} L${f(iB[0])} ${f(iB[1])} L${f(iA[0])} ${f(iA[1])} Z" fill="#9fd3c7" fill-opacity=".55" fill-rule="evenodd" stroke="#2f6f62" stroke-width="1.6" stroke-linejoin="round"/>`;
  for(let i=1;i<a/CM*10-3;i++){ const x=[o[0]+u[0]*i*CM/10,o[1]+u[1]*i*CM/10], k2=i%10===0?10:(i%5===0?7:4); s+=`<line x1="${f(x[0])}" y1="${f(x[1])}" x2="${f(x[0]+v[0]*k2)}" y2="${f(x[1]+v[1]*k2)}" stroke="#2f6f62" stroke-width="1"/>`; }
  s+=`<path d="M${f(o[0]+u[0]*12)} ${f(o[1]+u[1]*12)} L${f(o[0]+u[0]*12+v[0]*12)} ${f(o[1]+u[1]*12+v[1]*12)} L${f(o[0]+v[0]*12)} ${f(o[1]+v[1]*12)}" fill="none" stroke="#2f6f62" stroke-width="1.6"/>`;
  return s+'</g>';
}
/* Rapporteur : centre o, ligne du 0 dans la direction ang ; le demi-disque est du côté side (-1 = « au-dessus » pour ang=0). R = rayon px.
   Double graduation : extérieure de 0 à 180 dans le sens de ang→ang+180, intérieure dans l'autre sens. */
function rapporteur(o,ang=0,R=150,side=-1){
  const at=(a,r)=>pt(o,r,ang+side*a);
  const outer=[...Array(181).keys()].map(a=>at(a,R));
  let s=`<g class="tool"><path d="M${f(at(0,R)[0])} ${f(at(0,R)[1])} ${outer.map(p=>`L${f(p[0])} ${f(p[1])}`).join(' ')} Z" fill="#e8f1fb" fill-opacity=".82" stroke="#3b6aa0" stroke-width="1.6"/>`;
  for(let a=0;a<=180;a++){ const k=a%10===0?14:(a%5===0?9:5), p1=at(a,R), p2=at(a,R-k); s+=`<line x1="${f(p1[0])}" y1="${f(p1[1])}" x2="${f(p2[0])}" y2="${f(p2[1])}" stroke="#2b4f7a" stroke-width="${a%10===0?1.4:.8}"/>`;
    if(a%10===0){ const t1=at(a,R-24), t2=at(a,R-42); s+=`<text x="${f(t1[0])}" y="${f(t1[1])}" font-family="Arial,sans-serif" font-size="10.5" font-weight="700" fill="#2b4f7a" text-anchor="middle" dominant-baseline="middle">${a}</text><text x="${f(t2[0])}" y="${f(t2[1])}" font-family="Arial,sans-serif" font-size="9.5" fill="#c62828" text-anchor="middle" dominant-baseline="middle">${180-a}</text>`; } }
  const c1=at(0,R), c2=at(180,R); s+=`<line x1="${f(c1[0])}" y1="${f(c1[1])}" x2="${f(c2[0])}" y2="${f(c2[1])}" stroke="#2b4f7a" stroke-width="1.4"/>`;
  s+=`<circle cx="${f(o[0])}" cy="${f(o[1])}" r="5" fill="none" stroke="#2b4f7a" stroke-width="1.5"/><line x1="${f(at(90,0)[0])}" y1="${f(at(90,0)[1])}" x2="${f(at(90,22)[0])}" y2="${f(at(90,22)[1])}" stroke="#2b4f7a" stroke-width="1.4"/>`;
  return s+'</g>';
}
/* Crayon dont la pointe est en p */
function pencil(p,rot=-35){ return `<g class="tool" transform="translate(${f(p[0])} ${f(p[1])}) rotate(${rot})"><polygon points="0,0 9,-5 9,5" fill="#3b3b3b"/><rect x="9" y="-5" width="46" height="10" fill="#f2c230" stroke="#9a7a10"/><rect x="55" y="-5" width="10" height="10" fill="#e88" stroke="#a55"/></g>`; }

const K={C,CM,P,compass,ruler,equerre,rapporteur,pencil,seg,ease,clamp,pt,lerp,dist,angTo,unit,inter,proj,rad,deg};
const DEFS={};

/* ---------- lecteur ---------- */
const CSS=`.anim{margin:14px 0;border:1.5px solid var(--line,#d5dde8);border-radius:12px;padding:12px;background:var(--surface,#fff)}
.anim .an-h{font-weight:700;margin:0 0 10px;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.anim .an-h .an-ic{font-size:1.1em}
.anim .an-g{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:14px}
@media (max-width:820px){.anim .an-g{grid-template-columns:1fr}}
.anim .an-board{background:#fff;border-radius:9px;border:1px solid var(--line,#d5dde8);overflow:hidden}
.anim .an-board svg{display:block;width:100%;height:auto}
.anim .an-cap{margin-top:10px;min-height:3em;font-weight:700;background:color-mix(in srgb,var(--c,#1e5aa8) 12%,transparent);border-radius:9px;padding:9px 12px;display:flex;gap:10px;align-items:flex-start}
.anim .an-cap .n{flex:none;display:inline-grid;place-items:center;width:1.7em;height:1.7em;border-radius:50%;background:var(--c,#1e5aa8);color:#fff;font-size:.9em}
.anim .an-ctl{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.anim .an-ctl button{font:inherit;font-weight:700;padding:8px 12px;border-radius:9px;border:2px solid var(--c,#1e5aa8);background:var(--surface,#fff);color:var(--ink,#15202e);cursor:pointer}
.anim .an-ctl button.main{background:var(--c,#1e5aa8);color:#fff}
.anim .an-ctl button:disabled{opacity:.45;cursor:default}
.anim .an-steps{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px;min-width:0}
.anim .an-steps button{font:inherit;text-align:left;width:100%;display:flex;gap:9px;align-items:flex-start;padding:7px 9px;border-radius:9px;border:1.5px solid transparent;background:transparent;color:var(--ink,#15202e);cursor:pointer;line-height:1.45}
.anim .an-steps .n{flex:none;display:inline-grid;place-items:center;width:1.6em;height:1.6em;border-radius:50%;border:2px solid var(--line,#c9d3df);font-weight:700;font-size:.85em}
.anim .an-steps li.now button{border-color:var(--c,#1e5aa8);background:color-mix(in srgb,var(--c,#1e5aa8) 12%,transparent);font-weight:700}
.anim .an-steps li.now .n{border-color:var(--c,#1e5aa8);background:var(--c,#1e5aa8);color:#fff}
.anim .an-steps li.past .n{border-color:#0b6b47;color:#0b6b47}
.anim button:focus-visible{outline:3px solid var(--c,#1e5aa8);outline-offset:2px}
.sheet .anim,.pdoc .anim{display:none!important}
@media print{.anim{display:none!important}}`;
function injectCSS(){ if(document.getElementById('anim-css')) return; const s=document.createElement('style'); s.id='anim-css'; s.textContent=CSS; document.head.appendChild(s); }
const reduce=()=>{ try{ return matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } };

function mount(el){
  if(el.dataset.mounted) return; const id=el.dataset.anim, def=DEFS[id]; if(!def) return;
  el.dataset.mounted='1'; injectCSS();
  const W=def.W||640, H=def.H||400, S=def.steps(K);
  let i=0, p=0, playing=false, raf=0, last=0, waitUntil=0;
  el.innerHTML=`<p class="an-h"><span class="an-ic" aria-hidden="true">🎬</span>${def.titre}${def.sub?` <span style="font-weight:400">— ${def.sub}</span>`:''}</p>
  <div class="an-g"><div><div class="an-board"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${(def.titre+' : '+(def.sub||'')).replace(/"/g,'&quot;')}"></svg></div>
    <div class="an-cap"><span class="n">1</span><span class="tx"></span></div>
    <div class="an-ctl"><button type="button" class="prev">◀ Étape précédente</button><button type="button" class="main play">▶ Lecture</button><button type="button" class="next">Étape suivante ▶</button><button type="button" class="re">↺ Recommencer</button></div></div>
    <ol class="an-steps">${S.map((s,k)=>`<li><button type="button" data-i="${k}"><span class="n">${k+1}</span><span>${s.t}</span></button></li>`).join('')}</ol></div>`;
  const svg=el.querySelector('svg'), capN=el.querySelector('.an-cap .n'), capT=el.querySelector('.an-cap .tx'), list=el.querySelector('.an-steps'),
        bPlay=el.querySelector('.play'), bPrev=el.querySelector('.prev'), bNext=el.querySelector('.next');
  const defs=`<defs><pattern id="g-${id}" width="${CM/2}" height="${CM/2}" patternUnits="userSpaceOnUse"><path d="M${CM/2} 0 L0 0 0 ${CM/2}" fill="none" stroke="#eef2f7" stroke-width="1"/></pattern></defs><rect width="${W}" height="${H}" fill="#fff"/>${def.nogrid?'':`<rect width="${W}" height="${H}" fill="url(#g-${id})"/>`}`;
  const draw=()=>{ let s=''; for(let k=0;k<i;k++) s+=S[k].f(1,false); s+=S[i].f(p,p<1);
    svg.innerHTML=defs+s; capN.textContent=i+1; capT.innerHTML=S[i].t;
    [...list.children].forEach((li,k)=>li.className=k===i?'now':(k<i?'past':''));
    bPlay.textContent=playing?'⏸ Pause':'▶ Lecture'; bPrev.disabled=i===0; bNext.disabled=i===S.length-1&&p>=1; };
  const tick=ts=>{ const d=S[i].d*SLOW;
    if(p<1){ p=reduce()?1:Math.min(1,p+(ts-last)/d); last=ts; draw(); raf=requestAnimationFrame(tick); return; }
    if(playing && i<S.length-1){ if(!waitUntil) waitUntil=ts+PAUSE; if(ts<waitUntil){ raf=requestAnimationFrame(tick); return; } waitUntil=0; i++; p=0; last=ts; draw(); raf=requestAnimationFrame(tick); return; }
    playing=false; draw(); };
  const run=()=>{ cancelAnimationFrame(raf); last=performance.now(); waitUntil=0; raf=requestAnimationFrame(tick); };
  const go=(k,anim=true)=>{ i=Math.max(0,Math.min(S.length-1,k)); p=anim?0:1; draw(); if(anim) run(); };
  bPlay.onclick=()=>{ if(playing){ playing=false; draw(); return; } playing=true; if(i===S.length-1&&p>=1){ i=0; p=0; } else if(p>=1){ i++; p=0; } draw(); run(); };
  bNext.onclick=()=>{ playing=false; if(p<1){ p=1; cancelAnimationFrame(raf); draw(); return; } go(i+1); };
  bPrev.onclick=()=>{ playing=false; go(i-1); };
  el.querySelector('.re').onclick=()=>{ playing=false; go(0); };
  list.onclick=e=>{ const b=e.target.closest('button'); if(!b) return; playing=false; go(+b.dataset.i); };
  el._anim={go,set:(k,q)=>{ cancelAnimationFrame(raf); playing=false; i=k; p=q; draw(); },n:S.length};
  p=1; draw(); /* au repos : étape 1 affichée ; on lance avec Lecture */
}
function scan(root){ (root||document).querySelectorAll('.anim[data-anim]:not([data-mounted])').forEach(mount); }
let ST=0;
window.ANIM={K,add:(id,def)=>{ DEFS[id]=def; clearTimeout(ST); ST=setTimeout(()=>scan(),0); },defs:DEFS,mount,scan};
let T=0; const mo=new MutationObserver(()=>{ clearTimeout(T); T=setTimeout(()=>scan(),60); });
const start=()=>{ scan(); mo.observe(document.body,{childList:true,subtree:true}); };
if(document.body) start(); else document.addEventListener('DOMContentLoaded',start);
})();

/* ---- 3e-2.js ---- */
/* 3e-2 — Transformations : image d'un point par translation (au compas, parallélogramme) et image d'un triangle par rotation (rapporteur + compas) */
(function(){

/* ---------- Translation : M' est le 4e sommet du parallélogramme ABM'M (méthode du cours : (AB) // (MM'), AB = MM', même sens) ---------- */
ANIM.add('3e2-translation-compas',{titre:"Construire l'image d'un point par translation", sub:"image M' du point M par la translation qui transforme A en B", steps:K=>{
  const {P,C,seg,lerp,pt,dist,angTo,compass}=K;
  const A=[200,95], B=pt(A,260,9), M=pt(A,130,112), M2=[M[0]+B[0]-A[0],M[1]+B[1]-A[1]], rAB=dist(A,B), rAM=dist(A,M);
  const aM=angTo(M,M2), aB=angTo(B,M2), arc1=[aM-9,aM+9], arc2=[aB-11,aB+13];
  const open=(c,r,ang,p,side)=>compass(c,pt(c,Math.max(18,r*seg(p,.1,.8)),ang),side);
  const moveArc=(c0,c1,r,ang0,a0,a1,p,on,side)=>{ if(!on) return P.arc(c1,r,a0,a1,1);
    const m=seg(p,0,.35), t=seg(p,.4,.95);
    if(p<.38){ const c=lerp(c0,c1,m); return compass(c,pt(c,r,ang0+(a0-ang0)*m),side); }
    return P.arc(c1,r,a0,a1,t)+compass(c1,pt(c1,r,a0+(a1-a0)*t),side); };
  const pts=()=>P.cross(A)+P.label(A,'A',-16,-16)+P.cross(B)+P.label(B,'B',18,-14)+P.cross(M)+P.label(M,'M',-22,4);
  return [
  {t:"Voici les points A, B et M. Je cherche M', l'image de M par la translation qui transforme A en B.", d:2200, f:(p,on)=>
    P.op(on?seg(p,0,.5):1,pts())+P.op(on?seg(p,.4,.9):1,P.arrow(A,B,{w:2.4}))},
  {t:"Je pique en A et j'ouvre le compas jusqu'à B : l'écartement est égal à AB.", d:2800, f:(p,on)=>on?open(A,rAB,angTo(A,B),p,-1):''},
  {t:"Sans changer l'écartement, je pique en M et je trace un arc de cercle de rayon AB.", d:3800, f:(p,on)=>moveArc(A,M,rAB,angTo(A,B),arc1[0],arc1[1],p,on,-1)},
  {t:"Je pique en A et j'ouvre le compas jusqu'à M : l'écartement est égal à AM.", d:2800, f:(p,on)=>on?open(A,rAM,angTo(A,M),p,1):''},
  {t:"Sans changer l'écartement, je pique en B et je trace un arc de cercle de rayon AM.", d:3800, f:(p,on)=>moveArc(A,B,rAM,angTo(A,M),arc2[1],arc2[0],p,on,1)},
  {t:"Les deux arcs se coupent en M', du même côté que B : M' est l'image de M.", d:2000, f:(p,on)=>
    P.op(on?seg(p,0,.6):1,P.cross(M2,{c:C.res})+P.label(M2,"M'",29,-11,{c:C.res}))},
  {t:"Je trace la flèche de M vers M' : ABM'M est un parallélogramme, donc (AB) // (MM') et AB = MM', dans le même sens.", d:3400, f:(p,on)=>{ const st={c:C.soft,w:2,dash:'6 6'};
    return P.partLine(A,M,on?seg(p,0,.3):1,st)+P.partLine(B,M2,on?seg(p,.1,.4):1,st)
      +(on&&p<.6?P.partLine(M,M2,seg(p,.2,.6),{c:C.res,w:2.6}):P.arrow(M,M2,{c:C.res,w:2.6}))
      +P.op(on?seg(p,.55,.75):1,P.ticks(A,B,2)+P.ticks(M,lerp(M,M2,.94),2)+P.ticks(A,M,1)+P.ticks(B,M2,1))
      +P.op(on?seg(p,.7,.95):1,P.label([400,335],"ABM'M est un parallélogramme :",0,0,{s:19})+P.label([400,367],"(AB) // (MM') et AB = MM'",0,0,{s:19})); }},
  ]; }});

/* ---------- Rotation de centre C, d'angle 70° dans le sens antihoraire (méthode du cours : triangle ABC rectangle en A) ---------- */
ANIM.add('3e2-rotation-rapporteur',{titre:"Construire l'image d'un triangle par rotation", sub:"rotation de centre C, d'angle 70° dans le sens antihoraire", steps:K=>{
  const {P,C,seg,lerp,pt,dist,angTo,compass,ruler,rapporteur,pencil}=K;
  const Cc=[320,268], A=[320,148], B=[480,148], R=125, ANG=70;
  /* sur l'écran (y vers le bas), le sens antihoraire fait diminuer l'angle */
  const aA=angTo(Cc,A), aB=angTo(Cc,B), rA=dist(Cc,A), rB=dist(Cc,B), A2=pt(Cc,rA,aA-ANG), B2=pt(Cc,rB,aB-ANG);
  const legend=()=>{ const Q=[600,50], e=-235, end=pt(Q,20,e), dir=[Math.sin(e*Math.PI/180),-Math.cos(e*Math.PI/180)];
    return P.arc(Q,20,25,e,1,{c:C.orange,w:3})+P.arrow([end[0]-dir[0]*8,end[1]-dir[1]*8],end,{c:C.orange,w:3,k:12})+P.label([572,50],'sens antihoraire',0,0,{s:17,c:C.orange,a:'end'}); };
  const tri=()=>P.poly([A,B,Cc])+P.right(A,[1,0],[0,1],13,C.ink)+P.label(A,'A',-14,-16)+P.label(B,'B',16,-14)+P.label(Cc,'C',0,24);
  /* rapporteur centré en C, 0 sur [CX) ; flèche orange qui tourne de 70° dans le sens antihoraire ; marque à 70° */
  const proto=(a0,p,on)=>{ const mk=pt(Cc,R+7,a0-ANG); if(!on) return P.dot(mk,{r:4,c:C.arc});
    const sw=seg(p,.3,.75), e=a0-ANG*sw, q=pt(Cc,R+18,e), dir=[Math.sin(e*Math.PI/180),-Math.cos(e*Math.PI/180)];
    return P.op(seg(p,0,.25),rapporteur(Cc,a0,R,-1))+(sw>0?P.arc(Cc,R+18,a0,e,1,{c:C.orange,w:2.6})+(sw>.08?P.arrow([q[0]-dir[0]*7,q[1]-dir[1]*7],q,{c:C.orange,w:2.6,k:9}):''):'')
      +P.op(seg(p,.8,.95),P.dot(mk,{r:4,c:C.arc})); };
  /* demi-droite d'origine C passant par la marque (règle posée contre le trait) */
  const half=(a,L,p,on)=>{ const F=pt(Cc,L,a), t=on?seg(p,.25,.85):1; let s=P.partLine(Cc,F,t,{c:C.arc,w:2.2});
    if(on){ s=P.op(Math.min(seg(p,0,.2),1-seg(p,.9,1)),ruler(pt(Cc,L+12,a),a+180,Math.ceil((L+12)/40),1,0))+s; if(t>0&&t<1) s+=pencil(lerp(Cc,F,t)); } return s; };
  /* compas : pointe en C, j'ouvre jusqu'au point, puis la mine trace l'arc jusqu'à la demi-droite */
  const turn=(a0,r,p,on,side)=>{ if(!on) return P.arc(Cc,r,a0,a0-ANG,1,{dash:'8 6'});
    const o=seg(p,0,.3), t=seg(p,.35,.92);
    if(p<.33) return compass(Cc,pt(Cc,Math.max(20,r*o),a0),side);
    return P.arc(Cc,r,a0,a0-ANG*t,1,{dash:'8 6'})+compass(Cc,pt(Cc,r,a0-ANG*t),side); };
  const res=(X,nm,dx,dy)=>P.cross(X,{c:C.res})+P.label(X,nm,dx,dy,{c:C.res});
  const eq=(x,y,nm,rest)=>{ const s=19, w=nm.length*s*.62; return P.angName([x+w/2,y],nm,{s})+P.label([x+w+5,y],rest,0,0,{s,a:'start'}); };
  return [
  {t:"Voici le triangle ABC. Je le fais tourner autour de C, de 70° dans le sens antihoraire.", d:2400, f:(p,on)=>P.op(on?seg(p,0,.5):1,tri())+P.op(on?seg(p,.4,.9):1,legend())},
  {t:"Je place le centre du rapporteur sur C et le 0 sur [CA). Je tourne dans le sens antihoraire et je marque 70°.", d:4500, f:(p,on)=>proto(aA,p,on)},
  {t:"Avec la règle, je trace la demi-droite d'origine C qui passe par la marque.", d:3000, f:(p,on)=>half(aA-ANG,R+45,p,on)},
  {t:"Je pique en C, avec l'écartement CA, et je trace un arc depuis A jusqu'à la demi-droite : c'est A'.", d:4200, f:(p,on)=>
    turn(aA,rA,p,on,-1)+P.op(on?seg(p,.92,1):1,res(A2,"A'",-14,24))},
  {t:"Je recommence avec B : le centre du rapporteur sur C, le 0 sur [CB), et je marque 70° dans le sens antihoraire.", d:4500, f:(p,on)=>proto(aB,p,on)},
  {t:"Je trace la demi-droite d'origine C qui passe par cette marque.", d:3000, f:(p,on)=>half(aB-ANG,R+108,p,on)},
  {t:"Je pique en C, avec l'écartement CB, et je trace un arc depuis B jusqu'à la demi-droite : c'est B'.", d:4200, f:(p,on)=>
    turn(aB,rB,p,on,1)+P.op(on?seg(p,.92,1):1,res(B2,"B'",-24,4))},
  {t:"Je relie A', B' et C : le triangle A'B'C est l'image du triangle ABC. Le centre C est sa propre image.", d:3400, f:(p,on)=>{ const t=on?seg(p,0,.5):1;
    return P.partLine(Cc,A2,t,{c:C.res,w:2.8})+P.partLine(A2,B2,t,{c:C.res,w:2.8})+P.partLine(B2,Cc,t,{c:C.res,w:2.8})+res(A2,"A'",-14,24)+res(B2,"B'",-24,4)
      +P.op(on?seg(p,.5,.75):1,P.angArc(Cc,aA,aA-ANG,34,C.green)+P.label(pt(Cc,60,aA-ANG/2-8),'70°',0,0,{s:16,c:C.green})
        +P.angArc(Cc,aB,aB-ANG,52,C.green)+P.label(pt(Cc,82,aB-ANG/2+10),'70°',0,0,{s:16,c:C.green}))
      +P.op(on?seg(p,.7,.95):1,eq(372,322,"ACA'"," = 70° et CA' = CA")+eq(372,360,"BCB'"," = 70° et CB' = CB")); }},
  ]; }});

})();

/* ---- 3e-20.js ---- */
/* 3e-20 — L'homothétie : image d'un point par une homothétie de rapport positif (k = 2) puis négatif (k = −2), à la règle graduée */
(function(){
/* Règle graduée comme celle du moteur, mais les nombres restent toujours lisibles (jamais à l'envers), même quand la règle est tournée vers la gauche. */
function rulerU(K,o,ang,len,body=1,first=0){
  const {CM,rad}=K, F=n=>(+n).toFixed(1), u=[Math.cos(rad(ang)),Math.sin(rad(ang))], v=[-u[1]*body,u[0]*body], m=16, L=len*CM, w=38;
  let r=ang; while(r>90) r-=180; while(r<=-90) r+=180;
  const a=[o[0]-u[0]*m,o[1]-u[1]*m], b=[o[0]+u[0]*(L+m),o[1]+u[1]*(L+m)], c=[b[0]+v[0]*w,b[1]+v[1]*w], d=[a[0]+v[0]*w,a[1]+v[1]*w];
  let s=`<g class="tool"><polygon points="${F(a[0])},${F(a[1])} ${F(b[0])},${F(b[1])} ${F(c[0])},${F(c[1])} ${F(d[0])},${F(d[1])}" fill="#fff4c9" fill-opacity=".9" stroke="#8a7a3a" stroke-width="1.5"/>`;
  for(let i=0;i<=len*10;i++){ const x=[o[0]+u[0]*i*CM/10,o[1]+u[1]*i*CM/10], k=i%10===0?14:(i%5===0?10:6);
    s+=`<line x1="${F(x[0])}" y1="${F(x[1])}" x2="${F(x[0]+v[0]*k)}" y2="${F(x[1]+v[1]*k)}" stroke="#4a4020" stroke-width="${i%10===0?1.6:1}"/>`;
    if(i%10===0){ const t=[x[0]+v[0]*26,x[1]+v[1]*26]; s+=`<text x="${F(t[0])}" y="${F(t[1])}" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="#4a4020" text-anchor="middle" dominant-baseline="middle" transform="rotate(${F(r)} ${F(t[0])} ${F(t[1])})">${i/10+first}</text>`; } }
  return s+'</g>';
}
/* repère rouge sur la règle à la graduation x (cm) */
const mark=(K,o,ang,x,body)=>{ const {P,C,pt}=K, q=pt(o,x*K.CM,ang), u=[Math.cos(K.rad(ang)),Math.sin(K.rad(ang))], v=[-u[1]*body,u[0]*body];
  return P.line(q,[q[0]+v[0]*20,q[1]+v[1]*20],{c:C.res,w:3}); };

function homot(k){ return K=>{
  const {P,C,CM,seg,lerp,pt,pencil}=K, a=-12, OA=2.5, OA2=Math.abs(k)*OA, neg=k<0;
  const O=neg?[380,215]:[190,300], A=pt(O,OA*CM,a), dA2=neg?a+180:a, A2=pt(O,OA2*CM,dA2);
  const kTxt=neg?'−2':'2', B=-1; /* corps de la règle au-dessus du trait : les lettres sont en dessous */
  const lab=(X,t,c)=>P.label(X,t,0,26,{c:c||C.ink});
  /* le trait de construction : demi-droite [OA) (k > 0) ou droite (OA) (k < 0) */
  const L0=neg?pt(O,6.2*CM,a+180):O, L1=neg?pt(O,4.2*CM,a):pt(O,7.4*CM,a);
  const box=t=>P.op(t,`<rect x="${neg?60:330}" y="28" width="250" height="${neg?104:88}" rx="10" fill="#fff" stroke="${C.arc}" stroke-width="1.6"/>`
    +(neg?P.label([185,52],'distance à zéro de −2 : 2',0,0,{s:17,c:C.arc}):'')
    +P.label([neg?185:455,neg?84:56],"OA' = 2 × OA = 2 × 2,5",0,0,{s:19})+P.label([neg?185:455,neg?114:88],"OA' = 5 cm",0,0,{s:19,c:C.res}));
  return [
  {t:`Voici le centre O et le point A. Je cherche A', l'image de A par l'homothétie de centre O et de rapport ${kTxt}.`, d:2200, f:(p,on)=>
    P.op(on?seg(p,0,.6):1,P.cross(O)+lab(O,'O')+P.cross(A)+lab(A,'A'))},
  {t:neg?"Avec la règle, je trace la droite (OA) : A' sera sur cette droite, car il est aligné avec O et A.":"Avec la règle, je trace la demi-droite [OA) : A' sera dessus, car il est aligné avec O et A.", d:3400, f:(p,on)=>{
    const t=on?seg(p,.2,.85):1; let s=P.partLine(L0,L1,t,{c:C.arc,w:2.2});
    if(on){ s=P.op(Math.min(seg(p,0,.15),1-seg(p,.9,1)),rulerU(K,pt(L0,8,a+180),a,Math.ceil((K.dist(L0,L1)+8)/CM),B))+s; if(t>0&&t<1) s+=pencil(lerp(L0,L1,t)); }
    return s+P.cross(O)+P.cross(A); }},
  {t:"Je mesure OA : je place le 0 de la règle sur O et je lis OA = 2,5 cm.", d:3200, f:(p,on)=>{ if(!on) return '';
    return P.op(seg(p,0,.25),rulerU(K,O,a,neg?4:6,B))+P.op(seg(p,.4,.6),mark(K,O,a,OA,B)); }},
  {t:neg?"Je calcule avec la distance à zéro de −2, qui est 2 : OA' = 2 × 2,5 = 5 cm.":"Je calcule : OA' = 2 × OA = 2 × 2,5 = 5 cm.", d:2600, f:(p,on)=>box(on?seg(p,0,.6):1)},
  {t:neg?"k = −2 est négatif : A' est de l'autre côté de O. Le 0 sur O, je marque A' à 5 cm.":"k = 2 est positif : A' est du même côté que A. Le 0 sur O, je marque A' à 5 cm.", d:4000, f:(p,on)=>{
    const res=P.cross(A2,{c:C.res})+lab(A2,"A'",C.res);
    if(!on) return res;
    return P.op(seg(p,0,.3),rulerU(K,O,dA2,6,neg?-B:B))+P.op(seg(p,.35,.55),mark(K,O,dA2,OA2,neg?-B:B))+P.op(seg(p,.6,.85),res); }},
  {t:neg?"A et A' sont de part et d'autre de O : O, A et A' sont alignés et OA' = 2 × OA.":"A et A' sont du même côté de O : O, A et A' sont alignés et OA' = 2 × OA.", d:2800, f:(p,on)=>{
    const c1=P.cote(O,A,'2,5 cm',-24), c2=neg?P.cote(A2,O,'5 cm',-24):P.cote(O,A2,'5 cm',-64);
    return P.op(on?seg(p,0,.45):1,c1)+P.op(on?seg(p,.4,.85):1,c2); }},
  ]; }; }

ANIM.add('3e20-homothetie-positive',{titre:"Construire l'image d'un point par une homothétie", sub:"centre O, rapport 2 (positif)", steps:homot(2)});
ANIM.add('3e20-homothetie-negative',{titre:"Construire l'image d'un point par une homothétie", sub:"centre O, rapport −2 (négatif)", steps:homot(-2)});
})();

/* ---- 4e-16.js ---- */
/* 4e-16 — Repérage dans le plan : placer un point dont on connaît les coordonnées (exemples du cours : A(4 ; 3) et B(−4 ; −2)) */
(function(){
ANIM.add('4e16-placer-point',{titre:'Placer un point dans un repère', sub:'les points A(4 ; 3) et B(−4 ; −2)', nogrid:true, steps:K=>{
  const {P,C,seg,lerp}=K, U=34, O=[320,200], M=5, X=(x,y)=>[O[0]+U*x,O[1]-U*y], NB=v=>(v<0?'−':'')+Math.abs(v);
  /* nombres lus pour B placés hors des traits : « −4 » au-dessus de l'axe (on descend ensuite), « −2 » à droite de l'axe (le pointillé arrive par la gauche) */
  const XDY=v=>v===-4?-21:16, YDX=v=>v===-2?11:-9;
  const axes=()=>{ let s=P.grid(X(-M,M),U,2*M,2*M,'#d3dce7');
    s+=P.arrow(X(-M-.3,0),X(M+.6,0),{w:2.2,k:10})+P.arrow(X(0,-M-.3),X(0,M+.6),{w:2.2,k:10});
    for(let v=-M;v<=M;v++){ if(!v) continue; s+=P.line(X(v,0),[X(v,0)[0],X(v,0)[1]+4],{w:1.6})+P.label(X(v,0),NB(v),0,XDY(v),{s:15,wt:400});
      s+=P.line(X(0,v),[X(0,v)[0]-4,X(0,v)[1]],{w:1.6})+P.label(X(0,v),NB(v),YDX(v),0,{s:15,wt:400,a:YDX(v)>0?'start':'end'}); }
    return s+P.label(X(0,0),'0',-9,15,{s:15,wt:400,a:'end'}); };
  /* entoure le nombre lu sur un axe */
  const tw=v=>NB(v).length*8.6, ring=(c,v)=>`<circle cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" r="${Math.max(12,tw(v)/2+6).toFixed(1)}" fill="none" stroke="${C.arc}" stroke-width="2.4"/>`;
  const ringX=x=>ring([X(x,0)[0],X(x,0)[1]+XDY(x)],x), ringY=y=>ring([X(0,y)[0]+(YDX(y)>0?YDX(y)+tw(y)/2:YDX(y)-tw(y)/2),X(0,y)[1]],y);
  const go=(a,b,p,on)=>{ const t=on?seg(p,.1,.85):1; return t<.08?'':P.arrow(a,lerp(a,b,t),{c:C.arc,w:3.2,k:11}); };
  const dash=(x,y)=>P.line(X(x,y),X(0,y),{c:C.soft,w:2,dash:'6 5'});
  return [
  {t:"Voici un repère : l'axe des abscisses est horizontal, l'axe des ordonnées est vertical. L'origine a pour coordonnées (0 ; 0).", d:2400, f:(p,on)=>P.op(on?seg(p,0,.7):1,axes())},
  {t:"Pour placer A(4 ; 3), je lis d'abord l'abscisse 4 sur l'axe horizontal : j'avance de 4 vers la droite.", d:3000, f:(p,on)=>
    go(X(0,0),X(4,0),p,on)+P.op(on?seg(p,.8,.95):1,ringX(4))},
  {t:"Puis je lis l'ordonnée 3 : à partir de là, je monte de 3 (ici, 1 unité = 1 carreau).", d:3000, f:(p,on)=>go(X(4,0),X(4,3),p,on)},
  {t:"Je place A : il est en face de 4 sur l'axe des abscisses et en face de 3 sur l'axe des ordonnées.", d:2800, f:(p,on)=>
    P.op(on?seg(p,0,.4):1,dash(4,3)+ringY(3))+P.op(on?seg(p,.4,.8):1,P.cross(X(4,3),{c:C.res})+P.label(X(4,3),'A(4 ; 3)',12,-16,{c:C.res,a:'start'}))},
  {t:"Pour B(−4 ; −2) : l'abscisse −4 est négative, donc j'avance de 4 vers la gauche.", d:3000, f:(p,on)=>
    go(X(0,0),X(-4,0),p,on)+P.op(on?seg(p,.8,.95):1,ringX(-4))},
  {t:"L'ordonnée −2 est négative : je descends de 2. Je place B(−4 ; −2).", d:3400, f:(p,on)=>
    go(X(-4,0),X(-4,-2),on?Math.min(1,p/.65):1,on)+P.op(on?seg(p,.62,.8):1,dash(-4,-2)+ringY(-2))
    +P.op(on?seg(p,.75,.95):1,P.cross(X(-4,-2),{c:C.res})+P.label(X(-4,-2),'B(−4 ; −2)',-12,20,{c:C.res,a:'end'}))},
  ]; }});
})();

/* ---- 4e-2.js ---- */
/* 4e-2 — La translation : image d'une figure sur quadrillage (en comptant les carreaux) et image d'un point au compas (parallélogramme) */
(function(){

/* ---------- Sur quadrillage : je compte les carreaux de D à H, puis je fais le même déplacement à partir de chaque sommet ---------- */
ANIM.add('4e2-translation-quadrillage',{titre:"Construire l'image d'une figure sur quadrillage", sub:'par la translation qui transforme D en H', nogrid:true, steps:K=>{
  const {P,C,seg,pencil}=K, S=32, N=(i,j)=>[16+S*i,8+S*j], V=[6,2], n=V[0]+V[1];
  const D=[1,1], A=[2,5], B=[6,6], Cc=[3,9], im=q=>[q[0]+V[0],q[1]+V[1]];
  /* trajet en comptant les carreaux depuis q : t de 0 à 1 (6 carreaux vers la droite puis 2 vers le bas) */
  const walk=(q,t,o={})=>{ const k=t*n, h=Math.min(k,V[0]), v=Math.max(0,k-V[0]), c=[q[0]+V[0],q[1]], st={c:C.arc,w:o.w||2.4,dash:o.dash}; let s='';
    if(h>0) s+=P.line(N(...q),N(q[0]+h,q[1]),st);
    if(v>0) s+=P.line(N(...c),N(c[0],c[1]+v),st);
    if(o.arrow&&t>=1) s+=P.arrow(N(c[0],c[1]+V[1]-.6),N(c[0],c[1]+V[1]),{c:C.arc,w:st.w,k:10});
    if(o.num){ for(let i=1;i<=Math.floor(h+1e-6);i++) s+=P.label(N(q[0]+i-.5,q[1]),String(i),0,-13,{s:15,c:C.arc});
      for(let j=1;j<=Math.floor(v+1e-6);j++) s+=P.label(N(c[0],c[1]+j-.5),String(j),-13,0,{s:15,c:C.arc}); }
    if(o.pen&&t>0&&t<1) s+=pencil(v>0?N(c[0],c[1]+v):N(q[0]+h,q[1]));
    return s; };
  const one=(q,nm,dx,dy)=>(p,on)=>{ const t=on?seg(p,.05,.8):1, Q=im(q);
    return walk(q,t,{w:on?2.4:1.6,num:on,pen:on,dash:on?0:'5 4'})+P.op(on?seg(p,.8,.95):1,P.cross(N(...Q),{c:C.res})+P.label(N(...Q),nm+"’",dx,dy,{c:C.res})); };
  const tri=[A,B,Cc].map(q=>N(...q)), triI=[A,B,Cc].map(q=>N(...im(q)));
  return [
  {t:"Voici le triangle ABC et les points D et H.", d:1800, f:(p,on)=>P.grid([16,8],S,19,12)+P.op(on?seg(p,0,.6):1,P.poly(tri)+P.label(tri[0],'A',-18,-6)+P.label(tri[1],'B',6,22)+P.label(tri[2],'C',-18,10))
    +P.op(on?seg(p,.4,.9):1,P.cross(N(...D))+P.label(N(...D),'D',-16,-14)+P.cross(N(...im(D)))+P.label(N(...im(D)),'H',18,2))},
  {t:"Je compte les carreaux pour aller de D à H : 6 carreaux vers la droite, puis 2 carreaux vers le bas.", d:4200, f:(p,on)=>
    walk(D,on?seg(p,.05,.9):1,{num:true,pen:on,arrow:true})},
  {t:"Je fais le même déplacement à partir de A : 6 vers la droite, 2 vers le bas. J'obtiens A’.", d:3800, f:one(A,'A',-20,-4)},
  {t:"Je fais pareil à partir de B : j'obtiens B’.", d:3200, f:one(B,'B',20,4)},
  {t:"Je fais pareil à partir de C : j'obtiens C’.", d:3200, f:one(Cc,'C',20,8)},
  {t:"Je relie A’, B’ et C’ : le triangle A’B’C’ est l'image du triangle ABC par la translation qui transforme D en H.", d:3000, f:(p,on)=>{
    const t=on?seg(p,.05,.9):1; let s=''; for(let k=0;k<3;k++) s+=P.partLine(triI[k],triI[(k+1)%3],t*3-k,{c:C.res,w:2.8});
    return s+P.cross(triI[0],{c:C.res})+P.cross(triI[1],{c:C.res})+P.cross(triI[2],{c:C.res}); }},
  ]; }});

/* ---------- Sur feuille blanche : A' est le 4e sommet du parallélogramme CDA'A (méthode du cours, mêmes lettres) ---------- */
ANIM.add('4e2-translation-compas',{titre:"Construire l'image d'un point au compas", sub:"image A’ du point A par la translation qui transforme C en D", steps:K=>{
  const {P,C,seg,lerp,pt,dist,angTo,compass}=K;
  const Cp=[200,95], D=pt(Cp,260,9), A=pt(Cp,130,112), A2=[A[0]+D[0]-Cp[0],A[1]+D[1]-Cp[1]], rCD=dist(Cp,D), rCA=dist(Cp,A);
  const aA=angTo(A,A2), aD=angTo(D,A2); /* directions de A' vue de A et de D */
  const arc1=[aA-9,aA+9], arc2=[aD-11,aD+13];
  /* ouvrir le compas en c, de la pointe vers la mine dans la direction ang, jusqu'à r */
  const open=(c,r,ang,p,side)=>compass(c,pt(c,Math.max(18,r*seg(p,.1,.8)),ang),side);
  /* déplacer le compas (écartement r) de c0 vers c1 en tournant de ang0 à ang1, puis tracer l'arc */
  const moveArc=(c0,c1,r,ang0,a0,a1,p,on,side)=>{ if(!on) return P.arc(c1,r,a0,a1,1);
    const m=seg(p,0,.35), t=seg(p,.4,.95);
    if(p<.38){ const c=lerp(c0,c1,m); return compass(c,pt(c,r,ang0+(a0-ang0)*m),side); }
    return P.arc(c1,r,a0,a1,t)+compass(c1,pt(c1,r,a0+(a1-a0)*t),side); };
  const pts=()=>P.cross(Cp)+P.label(Cp,'C',-16,-16)+P.cross(D)+P.label(D,'D',18,-14)+P.cross(A)+P.label(A,'A',-20,4);
  return [
  {t:"Voici les points C, D et A. Je cherche A’, l'image de A par la translation qui transforme C en D.", d:2200, f:(p,on)=>
    P.op(on?seg(p,0,.5):1,pts())+P.op(on?seg(p,.4,.9):1,P.arrow(Cp,D,{w:2.4}))},
  {t:"Je pique en C et j'ouvre le compas jusqu'à D : l'écartement est égal à CD.", d:2800, f:(p,on)=>on?open(Cp,rCD,angTo(Cp,D),p,-1):''},
  {t:"Sans changer l'écartement, je pique en A et je trace un arc de cercle de rayon CD.", d:3800, f:(p,on)=>moveArc(Cp,A,rCD,angTo(Cp,D),arc1[0],arc1[1],p,on,-1)},
  {t:"Je pique en C et j'ouvre le compas jusqu'à A : l'écartement est égal à CA.", d:2800, f:(p,on)=>on?open(Cp,rCA,angTo(Cp,A),p,1):''},
  {t:"Sans changer l'écartement, je pique en D et je trace un arc de cercle de rayon CA.", d:3800, f:(p,on)=>moveArc(Cp,D,rCA,angTo(Cp,A),arc2[1],arc2[0],p,on,1)},
  {t:"Les deux arcs se coupent en A’, du même côté que D : A’ est l'image de A.", d:2000, f:(p,on)=>
    P.op(on?seg(p,0,.6):1,P.cross(A2,{c:C.res})+P.label(A2,"A’",27,-11,{c:C.res}))},
  {t:"Je trace [AA’] et [DA’] : CDA’A est un parallélogramme. Donc (CD) // (AA’) et CD = AA’.", d:3200, f:(p,on)=>{ const st={c:C.soft,w:2,dash:'6 6'};
    return P.partLine(Cp,A,on?seg(p,0,.3):1,st)+P.partLine(A,A2,on?seg(p,.1,.45):1,{c:C.res,w:2.6})+P.partLine(D,A2,on?seg(p,.2,.5):1,st)
      +P.op(on?seg(p,.5,.75):1,P.ticks(Cp,D,2)+P.ticks(A,A2,2)+P.ticks(Cp,A,1)+P.ticks(D,A2,1))
      +P.op(on?seg(p,.7,.95):1,P.label([400,335],"CDA’A est un parallélogramme :",0,0,{s:19})+P.label([400,367],"(CD) // (AA’) et CD = AA’",0,0,{s:19})); }},
  ]; }});

})();

/* ---- 5e-2.js ---- */
/* 5e-2 — Le demi-tour (symétrie centrale) : animations */
(function(){
/* trait [ab] tracé progressivement le long d'une règle (corps du côté body), avec le crayon */
const ruled=(K,a,b,t,on,o={})=>{ const {P,ruler,pencil,unit,lerp,dist,angTo}=K;
  const line=P.partLine(a,b,on?t:1,{c:o.c||K.C.arc,w:o.w||2.2,dash:o.dash}); if(!on) return line;
  const body=o.body||1, u=unit(a,b), v=[-u[1]*body,u[0]*body], lead=o.lead??24, org=[a[0]-u[0]*lead+v[0]*3,a[1]-u[1]*lead+v[1]*3];
  const len=Math.ceil((dist(a,b)+lead+8)/K.CM);
  return P.op(o.ro??1,ruler(org,angTo(a,b),len,body))+line+(t>0&&t<1?pencil(lerp(a,b,t)):''); };

/* ---------- symétrique d'un point par rapport à un point (méthode du cours en 3 étapes) ---------- */
ANIM.add('5e2-sym-point',{titre:"Construire le symétrique d'un point par un demi-tour", sub:"symétrique de A par rapport au point O", steps:K=>{
  const {P,C,seg,lerp,pt,dist,angTo,unit,compass}=K, A=[140,265], O=[320,205], A2=[2*O[0]-A[0],2*O[1]-A[1]], r=dist(O,A);
  const u=unit(A,O), E=[A2[0]+u[0]*62,A2[1]+u[1]*62], aA=angTo(O,A), aA2=angTo(O,A2), a0=aA2-16+360, a1=aA2+16+360;
  return [
  {t:"Je place le point A et le centre O.", d:1600, f:(p,on)=>P.op(seg(p,0,.45),P.cross(A)+P.label(A,'A',-4,26))+P.op(seg(p,.4,.85),P.cross(O)+P.label(O,'O',4,27))},
  {t:"Avec la règle, je trace la demi-droite [AO) : elle part de A et passe par O.", d:3600, f:(p,on)=>{ const t=seg(p,.2,.85);
    return ruled(K,A,E,t,on,{body:-1,ro:on?Math.min(seg(p,0,.15),1-seg(p,.9,1)):1})+P.op(on?seg(p,.8,1):1,P.label(E,'[AO)',-4,-22,{s:17,c:C.arc})); }},
  {t:"Je pique la pointe sèche en O et j'ouvre le compas jusqu'à A : l'écartement est OA.", d:3000, f:(p,on)=>{ if(!on) return '';
    const d=12+(r-12)*seg(p,.1,.8); return compass(O,pt(O,d,aA),-1); }},
  {t:"Sans changer l'écartement, je tourne le compas et je trace un arc de l'autre côté de O.", d:4400, f:(p,on)=>{
    if(!on) return P.arc(O,r,a0,a1,1);
    const t1=seg(p,0,.4), t2=seg(p,.45,.95), ang=t2>0?a0+(a1-a0)*t2:aA+(a0-aA)*t1;
    return P.arc(O,r,a0,a1,t2)+compass(O,pt(O,r,ang),-1); }},
  {t:"L'arc coupe la demi-droite en A' : A' est le symétrique de A par rapport à O.", d:2000, f:(p,on)=>
    P.op(seg(p,0,.6),P.cross(A2,{c:C.res})+P.label(A2,"A'",13,-24,{c:C.res}))},
  {t:"Je code : O est le milieu de [AA'], car OA = OA'.", d:2200, f:(p,on)=>P.op(seg(p,0,.6),P.ticks(A,O,1)+P.ticks(O,A2,1))},
  ]; }});

/* ---------- symétrique d'un triangle par un demi-tour ---------- */
ANIM.add('5e2-sym-triangle',{titre:"Construire le symétrique d'un triangle par un demi-tour", sub:"symétrique du triangle ABC par rapport au point O", steps:K=>{
  const {P,C,seg,lerp,pt,dist,angTo,unit,compass}=K, O=[320,200];
  const A=[90,110], B=[150,300], Cc=[215,215], S=q=>[2*O[0]-q[0],2*O[1]-q[1]], A2=S(A), B2=S(B), C2=S(Cc);
  /* construction du symétrique de X : demi-droite [XO) puis report de OX au compas */
  const build=(X,X2,side,lab,ld)=>(p,on)=>{ const u=unit(X,O), E=[X2[0]+u[0]*34,X2[1]+u[1]*34], r=dist(O,X), aX2=angTo(O,X2), a0=aX2-11, a1=aX2+11;
    let s=ruled(K,X,E,on?seg(p,.04,.4):1,on&&p<.45,{body:side,ro:on?Math.min(seg(p,0,.06),1-seg(p,.4,.45)):1});
    s+=P.arc(O,r,a0,a1,on?seg(p,.68,.92):1);
    if(on&&p>=.45&&p<.97){ const t=seg(p,.47,.58); s+=p<.62?compass(O,pt(O,12+(r-12)*t,angTo(O,X)),-1):compass(O,pt(O,r,a0+(a1-a0)*seg(p,.68,.92)),-1); }
    return s+P.op(on?seg(p,.9,1):1,P.cross(X2,{c:C.res})+P.label(X2,lab,ld[0],ld[1],{c:C.res})); };
  return [
  {t:"Voici le triangle ABC et le centre O.", d:1800, f:(p,on)=>P.op(seg(p,0,.6),P.poly([A,B,Cc])+P.label(A,'A',-16,-14)+P.label(B,'B',-16,14)+P.label(Cc,'C',-20,4))+P.op(seg(p,.5,.9),P.cross(O)+P.label(O,'O',0,26))},
  {t:"Je trace la demi-droite [AO), puis je reporte la longueur OA au compas de l'autre côté de O : j'obtiens A'.", d:4500, f:build(A,A2,1,"A'",[12,24])},
  {t:"Je fais de même pour B : demi-droite [BO), puis report de OB. J'obtiens B'.", d:4500, f:build(B,B2,-1,"B'",[16,-21])},
  {t:"Je fais de même pour C : demi-droite [CO), puis report de OC. J'obtiens C'.", d:4500, f:build(Cc,C2,1,"C'",[-15,21])},
  {t:"Je relie A', B' et C' dans le même ordre que A, B et C.", d:3000, f:(p,on)=>{ const t=on?p:1;
    return P.partLine(A2,B2,seg(t,.05,.35),{c:C.res,w:2.8})+P.partLine(B2,C2,seg(t,.35,.65),{c:C.res,w:2.8})+P.partLine(C2,A2,seg(t,.65,.95),{c:C.res,w:2.8}); }},
  {t:"Le triangle A'B'C' est le symétrique de ABC par rapport à O : O est le milieu de [AA'], [BB'] et [CC'].", d:2600, f:(p,on)=>
    P.op(seg(p,0,.35),P.ticks(A,O,1)+P.ticks(O,A2,1))+P.op(seg(p,.3,.65),P.ticks(B,O,2)+P.ticks(O,B2,2))+P.op(seg(p,.6,.95),P.ticks(Cc,O,3)+P.ticks(O,C2,3))},
  ]; }});
})();

/* ---- 5e-4.js ---- */
/* 5e-4 — Parallélogrammes : animations de construction */
(function(){
/* trait [ab] tracé progressivement le long d'une règle (corps du côté body), avec le crayon.
   rev : la règle est posée dans l'autre sens (simple bord droit, les nombres restent lisibles). */
const ruled=(K,a,b,t,on,o={})=>{ const {P,ruler,pencil,unit,lerp,dist,angTo}=K;
  const line=P.partLine(a,b,on?t:1,{c:o.c||K.C.arc,w:o.w||2.2,dash:o.dash}); if(!on) return line;
  const [s,e]=o.rev?[b,a]:[a,b], body=o.body||1, u=unit(s,e), v=[-u[1]*body,u[0]*body], lead=o.lead??24, org=[s[0]-u[0]*lead+v[0]*3,s[1]-u[1]*lead+v[1]*3];
  const len=Math.ceil((dist(a,b)+lead+8)/K.CM);
  return P.op(o.ro??1,ruler(org,angTo(s,e),len,body))+line+(t>0&&t<1?pencil(lerp(a,b,t)):''); };

/* parallélogramme commun aux deux animations : AB = 6 cm, AC = 8 cm */
const fig=K=>{ const A=[150,315], B=[390,315], Cc=K.pt(A,320,-22), D=[A[0]+Cc[0]-B[0],A[1]+Cc[1]-B[1]]; return {A,B,Cc,D,O:K.lerp(A,Cc,.5)}; };
const start=(K,{A,B,Cc})=>(p,on)=>{ const {P,seg}=K, t=on?p:1;
  return P.partLine(A,B,seg(t,0,.35))+P.partLine(B,Cc,seg(t,.3,.6))+P.op(seg(t,.55,.9),P.label(A,'A',-15,16)+P.label(B,'B',15,17)+P.label(Cc,'C',17,-13)); };
const par=(K,{A,B,Cc,D})=>K.P.label([320,374],'(AB) // (DC) et (AD) // (BC)',0,0,{s:19});
/* tracer [AD] puis [DC] en rouge, à la règle */
const sides=(K,{A,Cc,D})=>(p,on)=>{ const {seg}=K, o={c:K.C.res,w:2.8};
  return ruled(K,A,D,on?seg(p,.05,.42):1,on&&p<.47,{...o,body:-1,lead:30,ro:on?Math.min(seg(p,0,.05),1-seg(p,.42,.47)):1})
        +ruled(K,D,Cc,on?seg(p,.55,.92):1,on&&p>=.5,{...o,body:-1,lead:30,ro:on?Math.min(seg(p,.5,.55),1-seg(p,.93,.99)):1}); };

/* ---------- au compas, avec les côtés opposés de même longueur ---------- */
ANIM.add('5e4-para-compas',{titre:"Construire un parallélogramme au compas", sub:"ABCD, connaissant les sommets A, B et C", steps:K=>{
  const {P,C,seg,lerp,pt,dist,angTo,compass}=K, F=fig(K), {A,B,Cc,D}=F, rBC=dist(B,Cc), rAB=dist(A,B), aD=angTo(A,D), aDC=angTo(Cc,D);
  return [
  {t:"Je connais trois sommets A, B et C du parallélogramme ABCD : je trace [AB] et [BC].", d:2200, f:start(K,F)},
  {t:"Je pique en B et j'ouvre le compas jusqu'à C : l'écartement est BC.", d:2800, f:(p,on)=>on?compass(B,pt(B,12+(rBC-12)*seg(p,.1,.8),aD),-1):''},
  {t:"Sans changer l'écartement, je pique en A et je trace un arc.", d:3600, f:(p,on)=>{ const a0=aD-13, a1=aD+13, t=seg(p,.4,.92);
    if(!on) return P.arc(A,rBC,a0,a1,1);
    if(p<.35){ const q=lerp(B,A,seg(p,0,.33)); return compass(q,pt(q,rBC,aD+(a0-aD)*seg(p,.2,.35)),-1); }
    return P.arc(A,rBC,a0,a1,t)+compass(A,pt(A,rBC,a0+(a1-a0)*t),-1); }},
  {t:"Je pique en B et j'ouvre le compas jusqu'à A : l'écartement est AB.", d:2800, f:(p,on)=>on?compass(B,pt(B,12+(rAB-12)*seg(p,.1,.8),180),-1):''},
  {t:"Sans changer l'écartement, je pique en C et je trace un arc : il coupe le premier arc en D.", d:4200, f:(p,on)=>{ const a0=aDC+11, a1=aDC-11, t=seg(p,.42,.85);
    if(on&&p<.4){ const q=lerp(B,Cc,seg(p,0,.3)); return compass(q,pt(q,rAB,180+(a0-180)*seg(p,.3,.4)),-1); } /* même écartement AB pendant le déplacement de B vers C */
    return P.arc(Cc,rAB,a0,a1,on?t:1)+(on&&p<.88?compass(Cc,pt(Cc,rAB,a0+(a1-a0)*t),-1):'')
      +P.op(on?seg(p,.86,1):1,P.cross(D,{c:C.res})+P.label(D,'D',-25,5,{c:C.res})); }},
  {t:"Avec la règle, je trace [AD] et [DC].", d:3800, f:sides(K,F)},
  {t:"Les côtés opposés ont la même longueur : ABCD est un parallélogramme.", d:2600, f:(p,on)=>
    P.op(seg(p,0,.4),P.ticks(A,B,1)+P.ticks(D,Cc,1))+P.op(seg(p,.25,.65),P.ticks(A,D,2)+P.ticks(B,Cc,2))+P.op(seg(p,.6,1),par(K,F))},
  ]; }});

/* ---------- avec les diagonales qui ont le même milieu ---------- */
ANIM.add('5e4-para-diagonales',{titre:"Construire un parallélogramme avec ses diagonales", sub:"ABCD, connaissant les sommets A, B et C", steps:K=>{
  const {P,C,seg,lerp,pt,dist,angTo,unit,compass,ruler,pencil}=K, F=fig(K), {A,B,Cc,D,O}=F, rOB=dist(O,B), aB=angTo(O,B), aD=angTo(O,D);
  const u=unit(B,D), E=[D[0]+u[0]*38,D[1]+u[1]*38], acRuler=op=>P.op(op,ruler([A[0]-1.1,A[1]-2.8],-22,9,-1));
  return [
  {t:"Je connais trois sommets A, B et C du parallélogramme ABCD : je trace [AB] et [BC].", d:2200, f:start(K,F)},
  {t:"Je pose le 0 de la règle sur A et je trace la diagonale [AC] : elle mesure 8 cm.", d:3600, f:(p,on)=>{ const t=seg(p,.2,.85), L=P.partLine(A,Cc,on?t:1,{c:C.arc,w:2.2});
    return on?acRuler(Math.min(seg(p,0,.15),1-seg(p,.94,1)))+L+(t>0&&t<1?pencil(lerp(A,Cc,t)):''):L; }},
  {t:"Le milieu O de [AC] est à 8 ÷ 2 = 4 cm de A : je le place sur la graduation 4.", d:3000, f:(p,on)=>{ const m=P.op(on?seg(p,.45,.7):1,P.cross(O)+P.label(O,'O',0,25));
    return on?acRuler(Math.min(seg(p,0,.12),1-seg(p,.9,1)))+m+(p>.2&&p<.75?pencil(lerp(lerp(A,Cc,.3),O,seg(p,.2,.45))):''):m; }},
  {t:"Avec la règle, je trace la demi-droite [BO) : elle part de B et passe par O.", d:3400, f:(p,on)=>
    ruled(K,B,E,on?seg(p,.15,.85):1,on,{body:-1,rev:true,ro:on?Math.min(seg(p,0,.12),1-seg(p,.9,1)):1})},
  {t:"Avec le compas, je reporte la longueur OB de l'autre côté de O : j'obtiens D.", d:4500, f:(p,on)=>{ const a0=aD-360+14, a1=aD-360-14, t=seg(p,.55,.88); /* le compas tourne par le haut */
    let s=P.arc(O,rOB,a0,a1,on?t:1);
    if(on&&p<.92) s+=p<.3?compass(O,pt(O,12+(rOB-12)*seg(p,.03,.27),aB),1):compass(O,pt(O,rOB,p<.55?aB+(a0-aB)*seg(p,.3,.52):a0+(a1-a0)*t),1);
    return s+P.op(on?seg(p,.86,1):1,P.cross(D,{c:C.res})+P.label(D,'D',-25,5,{c:C.res})); }},
  {t:"Avec la règle, je trace [AD] et [DC].", d:3800, f:sides(K,F)},
  {t:"Les diagonales [AC] et [BD] ont le même milieu O : ABCD est un parallélogramme.", d:2600, f:(p,on)=>
    P.op(seg(p,0,.4),P.ticks(A,O,1)+P.ticks(O,Cc,1))+P.op(seg(p,.25,.65),P.ticks(B,O,2)+P.ticks(O,D,2))+P.op(seg(p,.6,1),par(K,F))},
  ]; }});
})();

/* ---- 5e-6.js ---- */
/* 5e-6 — Triangles : médiatrice, cercle circonscrit, hauteurs (animations de construction) */
(function(){
/* trait [ab] tracé progressivement le long d'une règle (corps du côté body), avec le crayon */
const ruled=(K,a,b,t,on,o={})=>{ const {P,ruler,pencil,unit,lerp,dist,angTo}=K;
  const line=P.partLine(a,b,on?t:1,{c:o.c||K.C.arc,w:o.w||2.2,dash:o.dash}); if(!on) return line;
  const [s,e]=o.rev?[b,a]:[a,b], body=o.body||1, u=unit(s,e), v=[-u[1]*body,u[0]*body], lead=o.lead??24, org=[s[0]-u[0]*lead+v[0]*3,s[1]-u[1]*lead+v[1]*3];
  const len=Math.ceil((dist(a,b)+lead+8)/K.CM);
  return P.op(o.ro??1,ruler(org,angTo(s,e),len,body))+line+(t>0&&t<1?pencil(lerp(a,b,t)):''); };
/* fondu d'entrée et de sortie d'un instrument pendant [a,b] */
const fade=(K,p,a,b,k=.06)=>Math.min(K.seg(p,a,a+k),1-K.seg(p,b-k,b));
/* côté de la charnière du compas : vers l'extérieur de la figure (loin du point G) */
const outSide=(K,p,q,G)=>{ const u=K.unit(p,q), m=K.lerp(p,q,.5), d=K.dist(p,q), h=Math.sqrt(Math.max(0,150*150-d*d/4));
  const top=sd=>{ const n=[u[1]*sd,-u[0]*sd]; return [m[0]+n[0]*(h+34),m[1]+n[1]*(h+34)]; }, inside=X=>X[0]>8&&X[0]<632&&X[1]>8&&X[1]<392;
  const out=((u[1])*(m[0]-G[0])+(-u[0])*(m[1]-G[1]))>=0?1:-1; return inside(top(out))||!inside(top(-out))?out:-out; };
/* quatre arcs de même rayon r : deux centrés en P (vers X1 et X2), puis deux centrés en Q */
const fourArcs=(K,P1,Q1,r,X1,X2,G,sp=13)=>(p,on)=>{ const {P,seg,pt,angTo,compass}=K; let s='';
  [[P1,X1],[P1,X2],[Q1,X1],[Q1,X2]].forEach(([c,x],k)=>{ const a=angTo(c,x), a0=a-sp, a1=a+sp, t=on?seg(p,k*.25+.03,k*.25+.22):1;
    s+=P.arc(c,r,a0,a1,t); if(on&&p>=k*.25&&p<(k+1)*.25){ const q=pt(c,r,a0+(a1-a0)*t); s+=compass(c,q,outSide(K,c,q,G)); } });
  return s; };

/* ---------- médiatrice à l'équerre (méthode du cours, segment [LT]) ---------- */
ANIM.add('5e6-mediatrice-equerre',{titre:"Construire la médiatrice à l'équerre", sub:"médiatrice du segment [LT]", steps:K=>{
  const {P,C,seg,lerp,ruler,pencil,equerre}=K, L=[200,250], T=[440,250], I=[320,250], top=[320,62], bot=[320,382];
  return [
  {t:"Voici le segment [LT].", d:1600, f:(p,on)=>P.partLine(L,T,on?seg(p,0,.7):1)+P.op(seg(p,.5,.9),P.cross(L)+P.cross(T)+P.label(L,'L',-22,0)+P.label(T,'T',22,0))},
  {t:"Je pose le 0 de la règle sur L : LT = 6 cm. Je place le milieu I à 3 cm de L.", d:3600, f:(p,on)=>{
    const m=P.op(on?seg(p,.5,.75):1,P.cross(I)+P.label(I,'I',-14,22)); if(!on) return m;
    return P.op(fade(K,p,0,1,.1),ruler([L[0],L[1]+3],0,7,1))+m+(p>.2&&p<.8?pencil(lerp(lerp(L,I,.3),I,seg(p,.2,.5))):''); }},
  {t:"Je place un côté de l'angle droit de l'équerre sur [LT], avec l'angle droit en I.", d:3000, f:(p,on)=>{ if(!on) return '';
    const t=seg(p,.05,.8); return P.op(seg(p,0,.2),equerre([I[0]+40*(1-t),I[1]-70*(1-t)],0,170,210,-1)); }},
  {t:"Je trace un trait le long de l'autre côté de l'angle droit : il passe par I.", d:3000, f:(p,on)=>{ const t=on?seg(p,.1,.85):1;
    let s=P.partLine(I,top,t,{c:C.res,w:2.8}); if(on){ s=equerre(I,0,170,210,-1)+s; if(t>0&&t<1) s+=pencil(lerp(I,top,t)); } return s; }},
  {t:"Je retire l'équerre et je prolonge le trait avec la règle : c'est la médiatrice (m) de [LT].", d:3400, f:(p,on)=>{ const t=on?seg(p,.25,.85):1;
    let s=P.partLine(I,bot,t,{c:C.res,w:2.8}); if(on){ s=P.op(1-seg(p,0,.15),equerre(I,0,170,210,-1))+P.op(fade(K,p,.12,1),ruler([326,62],90,8,-1))+s; if(t>0&&t<1) s+=pencil(lerp(I,bot,t)); }
    return s+P.op(on?seg(p,.85,1):1,P.label(top,'(m)',28,8,{c:C.res})); }},
  {t:"Je code : un angle droit en I et deux longueurs égales. (m) est perpendiculaire à [LT] et passe par son milieu.", d:2600, f:(p,on)=>
    P.op(seg(p,0,.4),P.right(I,[1,0],[0,-1]))+P.op(seg(p,.3,.7),P.ticks(L,I,2)+P.ticks(I,T,2))},
  ]; }});

/* ---------- médiatrice au compas (méthode du cours, segment [LT]) ---------- */
ANIM.add('5e6-mediatrice-compas',{titre:"Construire la médiatrice au compas", sub:"médiatrice du segment [LT]", steps:K=>{
  const {P,C,seg,lerp,pt,compass,ruler,pencil}=K, L=[200,215], T=[440,215], r=170, h=Math.sqrt(r*r-120*120), M=[320,215-h], N=[320,215+h];
  const arcWith=(c,a0,a1,p,on,side)=>{ const t=seg(p,.15,.85); return P.arc(c,r,a0,a1,on?t:1)+(on?compass(c,pt(c,r,a0+(a1-a0)*t),side):''); };
  return [
  {t:"Voici le segment [LT].", d:1600, f:(p,on)=>P.partLine(L,T,on?seg(p,0,.7):1)+P.op(seg(p,.5,.9),P.cross(L)+P.cross(T)+P.label(L,'L',-22,0)+P.label(T,'T',22,0))},
  {t:"Je prends une ouverture plus grande que la moitié de LT.", d:2600, f:(p,on)=>on?compass(L,pt(L,40+(r-40)*seg(p,.1,.8),-62),1):''},
  {t:"Je pique en L et je trace un arc au-dessus du segment, puis un arc en dessous.", d:4400, f:(p,on)=>
    arcWith(L,-62,-28,on?p*2:1,on&&p<.5,1)+(on&&p<.5?'':arcWith(L,28,62,on?(p-.5)*2:1,on,-1))},
  {t:"Avec cette même ouverture, je pique en T et je trace deux arcs de la même façon.", d:4400, f:(p,on)=>
    arcWith(T,-118,-152,on?p*2:1,on&&p<.5,-1)+(on&&p<.5?'':arcWith(T,152,118,on?(p-.5)*2:1,on,1))},
  {t:"Les arcs se coupent en deux points. Je les relie avec la règle : c'est la médiatrice (m) de [LT].", d:4000, f:(p,on)=>{ const a=[320,30], b=[320,385], t=seg(p,.35,.9);
    let s=P.op(on?seg(p,0,.25):1,P.cross(M)+P.cross(N)); let l=P.partLine(a,b,on?t:1,{c:C.res,w:2.8});
    if(on){ l=P.op(fade(K,p,.25,1),ruler([326,30],90,9,-1,0))+l; if(t>0&&t<1) l+=pencil(lerp(a,b,t)); }
    return s+l+P.op(on?seg(p,.88,1):1,P.label([320,40],'(m)',28,8,{c:C.res})); }},
  {t:"Je code : un angle droit et deux longueurs égales. (m) coupe [LT] en son milieu, perpendiculairement.", d:2600, f:(p,on)=>{ const I=[320,215];
    return P.op(seg(p,0,.4),P.right(I,[1,0],[0,-1]))+P.op(seg(p,.3,.7),P.ticks(L,I,2)+P.ticks(I,T,2)); }},
  ]; }});

/* ---------- cercle circonscrit à un triangle ---------- */
ANIM.add('5e6-cercle-circonscrit',{titre:"Construire le cercle circonscrit à un triangle", sub:"cercle qui passe par les trois sommets de ABC", steps:K=>{
  const {P,C,seg,lerp,pt,dist,angTo,unit,inter,compass}=K, A=[215,255], B=[425,255], Cc=[355,75], G=[(A[0]+B[0]+Cc[0])/3,(A[1]+B[1]+Cc[1])/3];
  const r1=150, [X1,X2]=inter(A,r1,B,r1), r2=150, [Y1,Y2]=inter(B,r2,Cc,r2);
  const u2=unit(Y1,Y2), m1=[320,22], m2=[320,384], n1=[Y1[0]-u2[0]*44,Y1[1]-u2[1]*44], n2=[Y2[0]+u2[0]*44,Y2[1]+u2[1]*44];
  /* O : intersection des deux médiatrices (x = 320 sur la médiatrice de [AB]) */
  const O=[320,Y1[1]+(320-Y1[0])*(Y2[1]-Y1[1])/(Y2[0]-Y1[0])], R=dist(O,A), aA=angTo(O,A);
  const lineStep=(a,b,body,lab,lp)=>(p,on)=>ruled(K,a,b,on?seg(p,.12,.88):1,on,{c:C.arc,w:2.2,body,ro:on?fade(K,p,0,1,.1):1})+P.op(on?seg(p,.85,1):1,P.label(b,lab,lp[0],lp[1],{s:16,c:C.arc}));
  return [
  {t:"Voici le triangle ABC.", d:1600, f:(p,on)=>P.op(seg(p,0,.6),P.poly([A,B,Cc])+P.label(A,'A',-16,14)+P.label(B,'B',16,14)+P.label(Cc,'C',0,-22))},
  {t:"Avec la même ouverture, je trace deux arcs centrés en A, puis deux arcs centrés en B.", d:4500, f:fourArcs(K,A,B,r1,X1,X2,G)},
  {t:"Je relie les points d'intersection des arcs : c'est la médiatrice de [AB].", d:3000, f:lineStep(m1,m2,-1,'',[0,0])},
  {t:"Je fais de même pour [BC] : deux arcs centrés en B, puis deux arcs centrés en C.", d:4500, f:fourArcs(K,B,Cc,r2,Y1,Y2,G)},
  {t:"Je relie les points d'intersection des arcs : c'est la médiatrice de [BC].", d:3000, f:lineStep(n2,n1,1,'',[0,0])},
  {t:"Les deux médiatrices se coupent en O : c'est le centre du cercle circonscrit.", d:2000, f:(p,on)=>P.op(seg(p,0,.6),P.cross(O,{c:C.res})+P.label(O,'O',18,18,{c:C.res}))},
  {t:"Je pique en O, j'ouvre le compas jusqu'à A et je trace le cercle : il passe par A, B et C.", d:4500, f:(p,on)=>{ const t=seg(p,.3,.95);
    let s=P.arc(O,R,aA,aA+360,on?t:1,{c:C.res,w:2.6}); if(on&&p<.97) s+=compass(O,p<.3?pt(O,12+(R-12)*seg(p,.02,.25),aA):pt(O,R,aA+360*t),1); return s; }},
  ]; }});

/* ---------- hauteur à l'équerre : pied sur le côté ---------- */
ANIM.add('5e6-hauteur-equerre',{titre:"Construire une hauteur à l'équerre", sub:"hauteur issue de A dans le triangle ABC", steps:K=>{
  const {P,C,seg,lerp,proj,unit,angTo,equerre,pencil}=K, A=[300,80], B=[110,330], Cc=[540,305], H=proj(A,B,Cc), ang=angTo(B,Cc), u=unit(B,Cc), v=unit(H,A);
  const S0=[H[0]-u[0]*120,H[1]-u[1]*120], EQ=o=>equerre(o,ang,150,280,-1);
  return [
  {t:"Voici le triangle ABC. Je veux tracer la hauteur issue de A.", d:1800, f:(p,on)=>P.op(seg(p,0,.6),P.poly([A,B,Cc])+P.label(A,'A',0,-22)+P.label(B,'B',-18,8)+P.label(Cc,'C',18,6))},
  {t:"Je place un côté de l'angle droit de l'équerre sur [BC], le côté opposé à A.", d:2800, f:(p,on)=>{ if(!on) return ''; const t=seg(p,.05,.8);
    return P.op(seg(p,0,.2),EQ([S0[0]+v[0]*60*(1-t),S0[1]+v[1]*60*(1-t)])); }},
  {t:"Je fais glisser l'équerre le long de [BC] jusqu'à ce que l'autre côté de l'angle droit passe par A.", d:3400, f:(p,on)=>on?EQ(lerp(S0,H,seg(p,.1,.85))):''},
  {t:"Je trace la droite le long de l'équerre, de A jusqu'à [BC].", d:3000, f:(p,on)=>{ const t=on?seg(p,.1,.85):1;
    let s=P.partLine(A,H,t,{c:C.res,w:2.8}); if(on){ s=EQ(H)+s; if(t>0&&t<1) s+=pencil(lerp(A,H,t)); } return s; }},
  {t:"Je place le pied H et je code l'angle droit : (h) est la hauteur issue de A.", d:2400, f:(p,on)=>
    P.op(seg(p,0,.4),P.dot(H,{c:C.res})+P.label(H,'H',0,24))+P.op(seg(p,.3,.7),P.right(H,u,v))+P.op(seg(p,.6,1),P.label(lerp(A,H,.45),'(h)',-30,0,{c:C.res}))},
  ]; }});

/* ---------- hauteur à l'équerre : pied sur le prolongement d'un côté ---------- */
ANIM.add('5e6-hauteur-exterieur',{titre:"Construire une hauteur quand le pied est à l'extérieur", sub:"hauteur issue de C dans le triangle ABC", steps:K=>{
  const {P,C,seg,lerp,proj,unit,angTo,equerre,pencil}=K, A=[120,330], B=[300,317], Cc=[485,80], H=proj(Cc,A,B), u=unit(A,B), v=unit(H,Cc), ang=angTo(B,A);
  const E=[H[0]+u[0]*44,H[1]+u[1]*44], S0=[H[0]-u[0]*110,H[1]-u[1]*110], EQ=o=>equerre(o,ang,150,250,1);
  return [
  {t:"Voici le triangle ABC. Je veux tracer la hauteur issue de C.", d:1800, f:(p,on)=>P.op(seg(p,0,.6),P.poly([A,B,Cc])+P.label(A,'A',-18,10)+P.label(B,'B',-4,24)+P.label(Cc,'C',0,-22))},
  {t:"Le pied de la hauteur sera en dehors de [AB] : je prolonge [AB] en pointillés avec la règle.", d:3400, f:(p,on)=>
    ruled(K,B,E,on?seg(p,.2,.85):1,on,{c:C.soft,w:2.2,dash:'7 6',body:1,lead:200,ro:on?fade(K,p,0,1,.1):1})},
  {t:"Je place un côté de l'angle droit de l'équerre sur la droite (AB).", d:2800, f:(p,on)=>{ if(!on) return ''; const t=seg(p,.05,.8);
    return P.op(seg(p,0,.2),EQ([S0[0]+v[0]*60*(1-t),S0[1]+v[1]*60*(1-t)])); }},
  {t:"Je fais glisser l'équerre le long de (AB) jusqu'à ce que l'autre côté de l'angle droit passe par C.", d:3400, f:(p,on)=>on?EQ(lerp(S0,H,seg(p,.1,.85))):''},
  {t:"Je trace la droite le long de l'équerre, de C jusqu'au prolongement de [AB].", d:3000, f:(p,on)=>{ const t=on?seg(p,.1,.85):1;
    let s=P.partLine(Cc,H,t,{c:C.res,w:2.8}); if(on){ s=EQ(H)+s; if(t>0&&t<1) s+=pencil(lerp(Cc,H,t)); } return s; }},
  {t:"Je place le pied H et je code l'angle droit : (h') est la hauteur issue de C.", d:2400, f:(p,on)=>
    P.op(seg(p,0,.4),P.dot(H,{c:C.res})+P.label(H,'H',4,24))+P.op(seg(p,.3,.7),P.right(H,[-u[0],-u[1]],v))+P.op(seg(p,.6,1),P.label(lerp(Cc,H,.5),"(h')",34,0,{c:C.res}))},
  ]; }});
})();

/* ---- 6e-11.js ---- */
/* 6e-11 — animations : construire un triangle avec la règle et le rapporteur */
(function(){
/* règle posée contre le segment [a,b] (sans mesurer) : le corps est du côté opposé au point ref ; graduations lisibles */
const edgeRuler=(K,a,b,ref,off=4)=>{ let o1=a,o2=b; if(Math.abs(K.angTo(a,b))>90){ o1=b; o2=a; }
  const ang=K.angTo(o1,o2), u=K.unit(o1,o2), d=K.dist(o1,o2);
  let body=1, v=[-u[1],u[0]]; if((ref[0]-o1[0])*v[0]+(ref[1]-o1[1])*v[1]>0){ body=-1; v=[u[1],-u[0]]; }
  return K.ruler([o1[0]+v[0]*off,o1[1]+v[1]*off],ang,Math.ceil(d/K.CM),body); };
/* tracé à la règle de a vers b : la règle apparaît, le crayon trace, la règle s'en va */
const ruled=(K,a,b,p,on,rul,o,t0=.2,t1=.85)=>{ const {P,seg,lerp,pencil}=K, t=seg(p,t0,t1);
  let s=P.partLine(a,b,on?t:1,o); if(on){ s=P.op(Math.min(seg(p,0,t0*.8),1-seg(p,.9,1)),rul)+s; if(t>0&&t<1) s+=pencil(lerp(a,b,t)); } return s; };
/* arc de codage entre les directions o→p et o→q */
const angle=(K,o,p,q,r,c)=>{ let a0=K.angTo(o,p), a1=K.angTo(o,q); if(a1<a0){ const x=a0; a0=a1; a1=x; } if(a1-a0>180){ const x=a0+360; a0=a1; a1=x; } return K.P.arc(o,r,a0,a1,1,{c,w:2.2}); };
/* dessin à main levée : traits légèrement tremblés, dans un cadre */
const sketch=(K,box,pts,names,extra,p)=>{ const {P,C,seg,lerp,unit}=K, G=[(pts[0][0]+pts[1][0]+pts[2][0])/3,(pts[0][1]+pts[1][1]+pts[2][1])/3], w=[5,-4,4];
  let s=`<rect x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}" rx="10" fill="#fbfcfe" stroke="${C.soft}" stroke-width="1.5" stroke-dasharray="5 5"/>`+P.label([box[0]+12,box[1]+16],'à main levée',0,0,{s:14,wt:400,c:'#5b6b7d',a:'start',it:1});
  [0,1,2].forEach(i=>{ const a=pts[i], b=pts[(i+1)%3], m=lerp(a,b,.5), u=unit(a,b), c=[m[0]-u[1]*w[i],m[1]+u[0]*w[i]];
    s+=P.op(seg(p,.05+i*.15,.2+i*.15),`<path d="M${a[0]} ${a[1]} Q${c[0].toFixed(1)} ${c[1].toFixed(1)} ${b[0]} ${b[1]}" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round"/>`); });
  s+=P.op(seg(p,.5,.7),names.map((n,i)=>{ const u=unit(G,pts[i]); return P.label(pts[i],n,u[0]*15,u[1]*15,{s:16}); }).join(''));
  return s+P.op(seg(p,.65,.9),extra); };

ANIM.add('6e11-triangle-cote-2-angles',{titre:'Construire un triangle connaissant un côté et deux angles', sub:'triangle ABC tel que AB = 5 cm, un angle de 40° en A et de 60° en B', steps:K=>{
  const {P,C,CM,seg,lerp,pt,ruler,rapporteur,pencil}=K, A=[200,330], B=[400,330], R=150, rA=pt(A,280,-40), rB=pt(B,215,240), o={c:C.arc,w:2.2};
  const Cc=(()=>{ const c=5*Math.sin(K.rad(60))/Math.sin(K.rad(80))*CM; return pt(A,c,-40); })();
  const sa=[40,122], sb=[176,120], sc=[128,58];
  /* rapporteur posé, valeur entourée, puis petit repère au crayon */
  const protract=(O,ang,side,val,dir,p,on)=>{ const tick=P.line(pt(O,R-3,dir),pt(O,R+10,dir),{c:C.arc,w:2.6});
    if(!on) return tick; const t=seg(p,.65,.8), g=pt(O,R-24,dir);
    return P.op(Math.min(seg(p,0,.25),1-seg(p,.92,1)),rapporteur(O,ang,R,side)+P.op(seg(p,.3,.45),`<circle cx="${g[0].toFixed(1)}" cy="${g[1].toFixed(1)}" r="12" fill="none" stroke="${C.orange}" stroke-width="2.6"/>`))
      +P.op(t,tick)+(t>0&&t<1||p>.6&&p<.88?pencil(pt(O,R+8,dir)):''); };
  return [
  {t:"Je fais un dessin à main levée codé : AB = 5 cm, un angle de 40° en A et de 60° en B.", d:3200, f:(p,on)=>sketch(K,[14,14,212,140],[sa,sb,sc],['A','B','C'],
    angle(K,sa,sb,sc,20,C.blue)+angle(K,sb,sa,sc,18,C.orange)+P.label(sa,'40°',36,-10,{s:14,c:C.blue})+P.label(sb,'60°',-34,-10,{s:14,c:C.orange})+P.label(lerp(sa,sb,.5),'5 cm',0,15,{s:14,wt:400}),on?p:1)},
  {t:"Je trace le côté connu : [AB] = 5 cm, avec la règle, le 0 sur A.", d:3000, f:(p,on)=>{ const t=seg(p,.25,.85);
    let s=P.partLine(A,B,on?t:1); if(on){ s=P.op(Math.min(seg(p,0,.2),1-seg(p,.92,1)),ruler(A,0,6,1))+s; if(t>0&&t<1) s+=pencil(lerp(A,B,t)); }
    return s+P.op(on?seg(p,.8,1):1,P.cross(A)+P.cross(B)+P.label(A,'A',-20,4)+P.label(B,'B',20,4)+P.label(lerp(A,B,.5),'5 cm',0,22,{s:17,wt:400})); }},
  {t:"Je pose le rapporteur : centre sur A, le 0 sur [AB]. Je marque 40°.", d:3800, f:(p,on)=>protract(A,0,-1,40,-40,p,on)},
  {t:"Avec la règle, je trace la demi-droite d'origine A qui passe par ce repère.", d:3000, f:(p,on)=>ruled(K,A,rA,p,on,edgeRuler(K,A,rA,B),o)},
  {t:"En B, je pose le rapporteur : centre sur B, le 0 sur [BA]. Je marque 60°.", d:3800, f:(p,on)=>protract(B,180,1,60,240,p,on)},
  {t:"Je trace la demi-droite d'origine B qui passe par ce repère, du même côté que la première.", d:3000, f:(p,on)=>ruled(K,B,rB,p,on,edgeRuler(K,B,rB,A),o)},
  {t:"Les deux demi-droites se coupent en C : le triangle ABC est construit.", d:2600, f:(p,on)=>
    P.op(seg(p,0,.3),P.cross(Cc)+P.label(Cc,'C',0,-26))+P.op(seg(p,.25,.7),P.poly([A,B,Cc],{c:C.res,w:2.8,fill:C.res,fo:.07}))
    +P.op(seg(p,.5,.9),P.angArc(A,-40,0,36,C.blue)+P.angArc(B,180,240,36,C.orange)+P.label(pt(A,62,-17),'40°',0,0,{s:17,c:C.blue})+P.label(pt(B,62,207),'60°',0,0,{s:17,c:C.orange})+P.label(lerp(A,B,.5),'5 cm',0,22,{s:17,c:C.res}))},
  ]; }});

ANIM.add('6e11-triangle-2-cotes-angle',{titre:"Construire un triangle connaissant deux côtés et l'angle compris", sub:'triangle DEF tel que DE = 4,5 cm, DF = 3,5 cm et un angle de 110° en D', steps:K=>{
  const {P,C,CM,seg,lerp,pt,ruler,rapporteur,pencil}=K, D=[220,330], E=[400,330], R=150, F=pt(D,3.5*CM,-110), rD=pt(D,250,-110), o={c:C.arc,w:2.2};
  const sd=[494,124], se=[610,124], sf=[470,56];
  const sk=(p)=>sketch(K,[420,14,206,140],[sd,se,sf],['D','E','F'],
    angle(K,sd,se,sf,18,C.blue)+P.label(sd,'110°',30,-24,{s:14,c:C.blue})+P.label(lerp(sd,se,.5),'4,5 cm',0,15,{s:14,wt:400})+P.label(lerp(sd,sf,.5),'3,5 cm',-30,4,{s:14,wt:400}),p);
  return [
  {t:"Je fais un dessin à main levée codé : DE = 4,5 cm, DF = 3,5 cm et un angle de 110° en D.", d:3200, f:(p,on)=>sk(on?p:1)},
  {t:"Je trace un des côtés connus : [DE] = 4,5 cm, avec la règle, le 0 sur D.", d:3000, f:(p,on)=>{ const t=seg(p,.25,.85);
    let s=P.partLine(D,E,on?t:1); if(on){ s=P.op(Math.min(seg(p,0,.2),1-seg(p,.92,1)),ruler(D,0,6,1))+s; if(t>0&&t<1) s+=pencil(lerp(D,E,t)); }
    return s+P.op(on?seg(p,.8,1):1,P.cross(D)+P.cross(E)+P.label(D,'D',-6,24)+P.label(E,'E',20,4)+P.label(lerp(D,E,.5),'4,5 cm',0,22,{s:17,wt:400})); }},
  {t:"Je pose le rapporteur : centre sur D, le 0 sur [DE]. Je compte depuis ce 0 et je marque 110°.", d:4000, f:(p,on)=>{ const dir=-110, tick=P.line(pt(D,R-3,dir),pt(D,R+10,dir),{c:C.arc,w:2.6});
    if(!on) return tick; const t=seg(p,.68,.82), g=pt(D,R-24,dir), z=pt(D,R-24,0);
    return P.op(Math.min(seg(p,0,.2),1-seg(p,.92,1)),rapporteur(D,0,R,-1)+P.op(seg(p,.22,.32),`<circle cx="${z[0].toFixed(1)}" cy="${z[1].toFixed(1)}" r="11" fill="none" stroke="${C.orange}" stroke-width="2.4"/>`)
      +P.arc(D,R-24,0,dir,seg(p,.3,.55),{c:C.orange,w:2.4,dash:'4 5'})+P.op(seg(p,.5,.6),`<circle cx="${g[0].toFixed(1)}" cy="${g[1].toFixed(1)}" r="13" fill="none" stroke="${C.orange}" stroke-width="2.6"/>`))
      +P.op(t,tick)+(p>.62&&p<.88?pencil(pt(D,R+8,dir)):''); }},
  {t:"Avec la règle, je trace la demi-droite d'origine D qui passe par ce repère.", d:3000, f:(p,on)=>ruled(K,D,rD,p,on,edgeRuler(K,D,rD,E),o)},
  {t:"Sur cette demi-droite, avec la règle, le 0 sur D, je place F tel que DF = 3,5 cm.", d:3200, f:(p,on)=>{ const t=seg(p,.5,.75);
    return (on?P.op(Math.min(seg(p,0,.2),1-seg(p,.9,1)),ruler(D,-110,5,-1)):'')+(on&&t>0&&t<1?pencil(F):'')+P.op(on?seg(p,.7,.8):1,P.cross(F)+P.label(F,'F',-22,-6)); }},
  {t:"Je trace le côté [EF] : le triangle DEF est construit.", d:3000, f:(p,on)=>{
    let s=ruled(K,F,E,on?Math.min(1,p*1.6):1,on&&p<.62,edgeRuler(K,F,E,D));
    return s+P.op(on?seg(p,.6,.8):1,P.poly([D,E,F],{c:C.res,w:2.8,fill:C.res,fo:.07}))
      +P.op(on?seg(p,.75,.95):1,P.angArc(D,-110,0,32,C.blue)+P.label(pt(D,58,-50),'110°',0,0,{s:17,c:C.blue})+P.label(lerp(D,E,.5),'4,5 cm',0,22,{s:17,c:C.res})+P.label(lerp(D,F,.5),'3,5 cm',-40,0,{s:17,c:C.res})); }},
  ]; }});
})();

/* ---- 6e-13.js ---- */
/* 6e-13 — animations (modèle validé par M. Staal), adaptées aux méthodes du cours de 6e-13 */
(function(){
const refl=(K,p,a,b)=>{ const h=K.proj(p,a,b); return [2*h[0]-p[0],2*h[1]-p[1]]; };
/* règle posée à off px du trait [ab], nombres dans le sens de lecture (comme dans 6e-6.js) ; le corps est du côté opposé au point ref, ou de son côté si inside */
const edgeRuler=(K,a,b,ref,off=4,inside=false)=>{ let o1=a,o2=b; if(Math.abs(K.angTo(a,b))>90){ o1=b; o2=a; }
  const ang=K.angTo(o1,o2), u=K.unit(o1,o2), d=K.dist(o1,o2);
  let body=1, v=[-u[1],u[0]]; if(((ref[0]-o1[0])*v[0]+(ref[1]-o1[1])*v[1]>0)!==inside){ body=-1; v=[u[1],-u[0]]; }
  return K.ruler([o1[0]+v[0]*off,o1[1]+v[1]*off],ang,Math.ceil(d/K.CM),body); };
/* distance d'un point au segment [ab] */
const dSeg=(p,a,b)=>{ const dx=b[0]-a[0], dy=b[1]-a[1], t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy))); return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy); };
const turnTo=(a,b,q)=>a+(((b-a)%360+540)%360-180)*q; /* rotation la plus courte de a vers b */

/* II.3 — symétrique d'un point avec le compas seulement (points M et N sur (d)) */
ANIM.add('symetrique-axial-compas',{titre:"Construire le symétrique d'un point au compas", sub:'symétrique de A par rapport à la droite (d)', steps:K=>{
  const {P,C,seg,lerp,pt,dist,angTo,compass}=K, X=320, A=[220,200], A2=[420,200], M=[X,120], N=[X,290], rM=dist(M,A), rN=dist(N,A);
  const aMA=angTo(M,A), aNA=angTo(N,A);
  return [
  {t:"Voici la droite (d) et le point A.", d:1600, f:(p,on)=>P.partLine([X,20],[X,385],on?seg(p,0,.6):1)+P.op(seg(p,.4,.8),P.label([X,30],'(d)',28,6)+P.cross(A)+P.label(A,'A',-20,-6))},
  {t:"Je place un point M sur la droite (d).", d:1500, f:(p,on)=>P.op(seg(p,.1,.7),P.cross(M)+P.label(M,'M',-22,-8))},
  {t:"Je pique en M, j'ouvre le compas jusqu'à A et je trace un arc qui passe par A et continue de l'autre côté de (d).", d:4500, f:(p,on)=>{
    const a0=aMA+10, a1=32; if(!on) return P.arc(M,rM,a0,a1,1);
    const o=seg(p,0,.25), t=seg(p,.3,.95);
    if(p<.25) return compass(M,pt(M,40+(rM-40)*o,aMA),1);
    return P.arc(M,rM,a0,a1,t)+compass(M,pt(M,rM,p<.3?turnTo(aMA,a0,seg(p,.25,.3)):a0+(a1-a0)*t),1); }},
  {t:"Je place un deuxième point N sur (d). Je pique en N et j'ouvre le compas jusqu'à A.", d:3000, f:(p,on)=>
    P.op(on?seg(p,0,.3):1,P.cross(N)+P.label(N,'N',-22,8))+(on&&p>.3?compass(N,pt(N,40+(rN-40)*seg(p,.35,.95),aNA),-1):'')},
  {t:"Sans changer l'écartement, je trace un arc de centre N de l'autre côté de (d).", d:3600, f:(p,on)=>{
    const a0=-22, a1=-62; if(!on) return P.arc(N,rN,a0,a1,1);
    const r=seg(p,0,.3), t=seg(p,.3,.95), ang=r<1?turnTo(aNA,a0,r):a0+(a1-a0)*t;
    return P.arc(N,rN,a0,a1,t)+compass(N,pt(N,rN,ang),-1); }},
  {t:"Les deux arcs se coupent en A' : c'est le symétrique de A par rapport à (d).", d:2400, f:(p,on)=>
    P.op(seg(p,0,.5),P.cross(A2,{c:C.res})+P.label(A2,"A'",28,-14,{c:C.res}))+P.partLine(A,A2,seg(p,.4,.9),{c:C.soft,w:2,dash:'6 6'})},
  {t:"Je code : (d) est perpendiculaire à [AA'] et le coupe en son milieu. En effet MA = MA' et NA = NA'.", d:2400, f:(p,on)=>{ const I=[X,200];
    return P.op(seg(p,0,.4),P.right(I,[1,0],[0,-1]))+P.op(seg(p,.3,.7),P.ticks(A,I,1)+P.ticks(I,A2,1)); }},
  ]; }});

/* II.2 — symétrique d'un point avec l'équerre et le compas (point H) */
ANIM.add('6e13-sym-equerre',{titre:"Construire le symétrique d'un point à l'équerre et au compas", sub:'symétrique de A par rapport à la droite (d)', steps:K=>{
  const {P,C,seg,lerp,pt,dist,angTo,unit,proj,compass,ruler,equerre,pencil}=K;
  const D1=[30,290], D2=[610,120], A=[240,95], H=proj(A,D1,D2), A2=[2*H[0]-A[0],2*H[1]-A[1]], r=dist(H,A);
  const u=unit(D1,D2), n=unit(H,A), aHA=angTo(H,A), aHA2=angTo(H,A2), L0=[A[0]+n[0]*30,A[1]+n[1]*30], L1=[A2[0]-n[0]*32,A2[1]-n[1]*32];
  const perp1=t=>P.partLine(L0,H,t,{c:C.arc,w:2}), perp2=t=>P.partLine(H,L1,t,{c:C.arc,w:2});
  return [
  {t:"Voici la droite (d) et le point A.", d:1600, f:(p,on)=>P.partLine(D1,D2,on?seg(p,0,.6):1)+P.op(seg(p,.4,.8),P.label([590,104],'(d)',0,0)+P.cross(A)+P.label(A,'A',-20,-8))},
  {t:"Je pose un côté de l'angle droit de l'équerre contre (d), et je la fais glisser jusqu'à ce que l'autre côté passe par A.", d:3400, f:(p,on)=>{
    if(!on) return ''; const o=lerp([H[0]-u[0]*130,H[1]-u[1]*130],H,seg(p,.1,.85)); return equerre(o,aHA,165,120,1); }},
  {t:"Je trace la perpendiculaire à (d) passant par A. Elle coupe (d) en H.", d:3000, f:(p,on)=>{ const t=on?seg(p,.05,.75):1;
    let s=perp1(t)+P.op(on?seg(p,.75,.95):1,P.dot(H,{r:3.5})+P.label(H,'H',20,18));
    if(on){ s=equerre(H,aHA,165,120,1)+s; if(t>0&&t<1) s+=pencil(lerp(L0,H,t)); } return s; }},
  {t:"Avec la règle, je prolonge la perpendiculaire de l'autre côté de (d).", d:3000, f:(p,on)=>{ const t=on?seg(p,.2,.85):1;
    let s=perp2(t); if(on){ s=P.op(1-seg(p,.9,1),ruler([H[0]+n[0]*70,H[1]+n[1]*70],aHA2,6,1))+s; if(t>0&&t<1) s+=pencil(lerp(H,L1,t)); } return s; }},
  {t:"Je pique en H, j'ouvre le compas jusqu'à A, puis je reporte la longueur AH de l'autre côté : je trace un petit arc.", d:4500, f:(p,on)=>{
    const a0=aHA2-12, a1=aHA2+12; if(!on) return P.arc(H,r,a0,a1,1);
    if(p<.3) return compass(H,pt(H,30+(r-30)*seg(p,0,.28),aHA),1);
    const q=seg(p,.3,.55), t=seg(p,.55,.95), ang=q<1?turnTo(aHA,a0,q):a0+(a1-a0)*t;
    return P.arc(H,r,a0,a1,t)+compass(H,pt(H,r,ang),1); }},
  {t:"L'arc coupe la perpendiculaire en A' : c'est le symétrique de A, avec HA' = HA.", d:2200, f:(p,on)=>
    P.op(seg(p,0,.6),P.cross(A2,{c:C.res})+P.label(A2,"A'",30,10,{c:C.res}))},
  {t:"Je code la figure : l'angle droit en H et les deux longueurs égales HA et HA'.", d:2200, f:(p,on)=>
    P.op(seg(p,0,.4),P.right(H,u,n))+P.op(seg(p,.3,.7),P.ticks(A,H,2)+P.ticks(H,A2,2))},
  ]; }});

/* I — symétrique d'une figure sur quadrillage, en comptant les carreaux */
ANIM.add('6e13-sym-quadrillage',{titre:"Construire le symétrique d'une figure sur un quadrillage", sub:'symétrique du triangle ABC par rapport à la droite (d)', nogrid:true, steps:K=>{
  const {P,C,seg,lerp,ruler,pencil,dist,angTo}=K, s=40, G=(i,j)=>[40+i*s,20+j*s], X=7;
  const pts={A:[4,1],B:[1,5],C:[5,7]}, im=q=>[2*X-q[0],q[1]];
  const lab={A:[-16,-16],B:[-20,0],C:[-6,20]}, lab2={A:[16,-16],B:[22,0],C:[6,20]};
  const tri=(n,q,col)=>P.poly(['A','B','C'].map(k=>G(...q(pts[k]))),{c:col,w:2.6,fill:col,fo:.08});
  /* position d'un numéro de carreau : au-dessus du trait de comptage, sinon en dessous, sinon décalé dans le carreau, jamais sur un côté du triangle */
  const sidesABC=[['A','B'],['B','C'],['C','A']].map(([a,b])=>[G(...pts[a]),G(...pts[b])]);
  const numAt=c=>{ for(const [dx,dy] of [[0,-13],[0,13],[-10,-13],[10,-13],[-10,13],[10,13]]){ const q=[c[0]+dx,c[1]+dy];
      if(sidesABC.every(([a,b])=>dSeg(q,a,b)>=14)) return [dx,dy]; } return [0,-13]; };
  const count=(k,p,on)=>{ const q=pts[k], n=X-q[0], Q=im(q), a=G(...q), b=G(X,q[1]), c=G(...Q);
    if(!on) return P.line(a,c,{c:C.soft,w:1.6,dash:'5 5'})+P.cross(c,{c:C.res})+P.label(c,k+"'",lab2[k][0],lab2[k][1],{c:C.res});
    const t1=seg(p,.05,.45), t2=seg(p,.5,.9); let s2=P.partLine(a,b,t1,{c:C.arc,w:2.4})+P.partLine(b,c,t2,{c:C.res,w:2.4});
    for(let i=1;i<=n;i++){ if(t1*n>=i-.5){ const c=G(q[0]+i-.5,q[1]), o=numAt(c); s2+=P.label(c,i,o[0],o[1],{s:16,c:C.arc}); } if(t2*n>=i-.5) s2+=P.label(G(X+i-.5,q[1]),i,0,-13,{s:16,c:C.res}); }
    return s2+P.op(seg(p,.9,1),P.cross(c,{c:C.res})+P.label(c,k+"'",lab2[k][0],lab2[k][1],{c:C.res})); };
  const phrase=(k,n)=>`Le point ${k} est à ${n} carreau${n>1?'x':''} de (d). Je compte ${n} carreau${n>1?'x':''} de l'autre côté, sur la même ligne : je place ${k}'.`;
  const sides=[['A','B'],['B','C'],['C','A']];
  return [
  {t:"Voici le triangle ABC et la droite (d) sur un quadrillage.", d:1800, f:(p,on)=>P.grid(G(0,0),s,14,9)+P.partLine([320,6],[320,394],on?seg(p,0,.5):1)+P.label([320,32],'(d)',26,0)+
    P.op(seg(p,.3,.8),tri('',q=>q,C.ink)+Object.keys(pts).map(k=>P.cross(G(...pts[k]))+P.label(G(...pts[k]),k,lab[k][0],lab[k][1])).join(''))},
  {t:phrase('A',3), d:3200, f:(p,on)=>count('A',p,on)},
  {t:phrase('B',6), d:3600, f:(p,on)=>count('B',p,on)},
  {t:phrase('C',2), d:3000, f:(p,on)=>count('C',p,on)},
  {t:"Avec la règle, je relie A', B' et C' dans le même ordre.", d:4200, f:(p,on)=>{ let r='';
    sides.forEach(([a,b],k)=>{ const A=G(...im(pts[a])), B=G(...im(pts[b])), t=on?seg(p,k/3+.05,(k+1)/3-.03):1;
      r+=P.partLine(A,B,t,{c:C.res,w:2.8});
      if(on&&p>=k/3&&p<(k+1)/3){ r+=ruler(A,angTo(A,B),Math.ceil(dist(A,B)/40)+1,k===1?1:-1); if(t>0&&t<1) r+=pencil(lerp(A,B,t)); } });
    return r; }},
  {t:"Les triangles ABC et A'B'C' sont symétriques par rapport à (d) : ils se superposent si on plie le long de (d).", d:2200, f:(p,on)=>
    P.op(seg(p,0,.6),P.poly(['A','B','C'].map(k=>G(...im(pts[k]))),{c:C.res,w:2.8,fill:C.res,fo:.1}))},
  ]; }});

/* III — symétrique d'un triangle : symétrique de chaque sommet, puis on relie */
ANIM.add('6e13-sym-triangle',{titre:"Construire le symétrique d'un triangle", sub:'symétrique du triangle IJK par rapport à la droite (d)', steps:K=>{
  const {P,C,seg,lerp,pt,dist,angTo,unit,proj,compass,ruler,equerre,pencil}=K;
  const T=p=>[p[0]*.42+90,p[1]*.42+8], D1=T([40,818]), D2=T([1040,68]), u=unit(D1,D2);
  const V={I:T([240,154]),J:T([574,280]),K:T([129,460])}, lab={I:[0,-20],J:[14,-16],K:[-20,-4]}, lab2={I:[22,12],J:[22,-12],K:[-26,-4]};
  const H={}, R={}; for(const k in V){ H[k]=proj(V[k],D1,D2); R[k]=refl(K,V[k],D1,D2); }
  const sym=(k,p,on)=>{ const v=V[k], h=H[k], w=R[k], r=dist(h,v), n=unit(h,v), e0=v, e1=[w[0]-n[0]*16,w[1]-n[1]*16];
    const aV=angTo(h,v), aW=angTo(h,w), a0=aW-10, a1=aW+10, ln={c:C.arc,w:1.8,dash:'6 5'};
    const res=P.cross(w,{c:C.res})+P.label(w,k+"'",lab2[k][0],lab2[k][1],{c:C.res});
    if(!on) return P.line(e0,h,ln)+P.line(h,e1,ln)+P.arc(h,r,a0,a1,1)+res;
    const t1=seg(p,0,.25), t2=seg(p,.27,.47); let s=P.partLine(e0,h,t1,ln)+P.partLine(h,e1,t2,ln);
    if(p<.26){ s=equerre(h,aV,Math.max(r+28,100),80,1)+s; if(t1>0&&t1<1) s+=pencil(lerp(e0,h,t1)); }
    else if(p<.49){ s=equerre(h,aW,Math.max(r+28,100),80,-1)+s; if(t2>0&&t2<1) s+=pencil(lerp(h,e1,t2)); }
    else { const o=seg(p,.5,.62), q=seg(p,.62,.75), t=seg(p,.75,.95);
      if(p<.62) s+=compass(h,pt(h,20+(r-20)*o,aV),1);
      else { const ang=q<1?turnTo(aV,a0,q):a0+(a1-a0)*t; s+=P.arc(h,r,a0,a1,t)+compass(h,pt(h,r,ang),1); } }
    return s+P.op(seg(p,.95,1),res); };
  const ph=k=>`Je construis ${k}' : avec l'équerre, je trace la perpendiculaire à (d) passant par ${k}, puis je reporte la longueur au compas.`;
  const tri=(Q,col)=>P.poly([Q.I,Q.J,Q.K],{c:col,w:2.8});
  return [
  {t:"Voici le triangle IJK et la droite (d).", d:1800, f:(p,on)=>P.partLine(D1,D2,on?seg(p,0,.6):1)+P.op(seg(p,.4,.8),P.label(D2,'(d)',20,16)+tri(V,C.ink)+Object.keys(V).map(k=>P.label(V[k],k,lab[k][0],lab[k][1])).join(''))},
  {t:ph('I'), d:4500, f:(p,on)=>sym('I',p,on)},
  {t:ph('J'), d:4500, f:(p,on)=>sym('J',p,on)},
  {t:ph('K'), d:4500, f:(p,on)=>sym('K',p,on)},
  {t:"Avec la règle, je relie I', J' et K' dans le même ordre.", d:4200, f:(p,on)=>{ let s=''; [['I','J'],['J','K'],['K','I']].forEach(([a,b],k)=>{
      const A=R[a], B=R[b], t=on?seg(p,k/3+.05,(k+1)/3-.03):1; s+=P.partLine(A,B,t,{c:C.res,w:2.8});
      if(on&&p>=k/3&&p<(k+1)/3){ s+=edgeRuler(K,A,B,R[['K','I','J'][k]],4,true); /* corps à l'intérieur du triangle : les noms I', J', K' restent visibles */ if(t>0&&t<1) s+=pencil(lerp(A,B,t)); } }); return s; }},
  {t:"Le triangle I'J'K' est le symétrique de IJK. Il a les mêmes longueurs : I'J' = IJ, J'K' = JK et I'K' = IK.", d:2600, f:(p,on)=>
    P.op(seg(p,0,.4),P.ticks(V.I,V.J,1)+P.ticks(R.I,R.J,1))+P.op(seg(p,.3,.7),P.ticks(V.J,V.K,2)+P.ticks(R.J,R.K,2))+P.op(seg(p,.6,1),P.ticks(V.I,V.K,3)+P.ticks(R.I,R.K,3))},
  ]; }});
})();

/* ---- 6e-15.js ---- */
/* 6e-15 — Angles (2) : la bissectrice d'un angle (au rapporteur, au compas) */
(function(){
const H = n => `<span class="ang">${n}</span>`;
const rp = (K,o,ang,a,r) => K.pt(o,r,ang-a);
const ring = (p,r,c) => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${r}" fill="none" stroke="${c}" stroke-width="2.8"/>`;
/* codage de deux angles de même mesure : un arc + un petit trait au milieu de l'arc */
const eqArc = (K,o,a0,a1,r,c) => { const m=(a0+a1)/2; return K.P.arc(o,r,a0,a1,1,{c,w:2.2})+K.P.line(K.pt(o,r-7,m),K.pt(o,r+7,m),{c,w:2.2}); };

/* ---------- Bissectrice au rapporteur ---------- */
ANIM.add('6e15-bissectrice-rapporteur',{titre:"Construire la bissectrice d'un angle au rapporteur", sub:"bissectrice [Oz) d'un angle de 70°", steps:K=>{
  const {P,C,seg,lerp,pt,ruler,pencil,rapporteur}=K, O=[225,335], R=200, Xe=[610,335], aY=-70, Ye=pt(O,290,aY), aZ=-35, Ze=pt(O,390,aZ), M=rp(K,O,0,35,R+6);
  const fig = () => P.line(O,Xe)+P.line(O,Ye)+P.dot(O,{r:4.5});
  const noms = () => P.label(O,'O',-4,26)+P.label(Xe,'x',14,0,{it:1})+P.label(Ye,'y',10,-12,{it:1});
  const posé = () => rapporteur(O,0,R,-1)+fig()+noms();
  return [
  {t:`Voici l'angle ${H('xOy')}. Je veux tracer sa bissectrice [Oz).`, d:2000, f:(p,on)=>{ const t=on?seg(p,0,.6):1;
    return P.partLine(O,Xe,t)+P.partLine(O,Ye,t)+P.op(on?seg(p,.5,.9):1,P.dot(O,{r:4.5})+noms()); }},
  {t:"Je mesure l'angle : centre du rapporteur en O, 0 sur [Ox). Sur la graduation bleue, je lis 70°.", d:4500, f:(p,on)=>{ if(!on) return '';
    const t=seg(p,0,.35), u=seg(p,.4,.85);
    if(t<1) return rapporteur(lerp([300,225],O,t),-25*(1-t),R,-1)+fig()+noms();
    return posé()+ring(rp(K,O,0,0,R-24),12,C.green)+P.arc(O,R+7,0,-70,u,{c:C.green,w:4.5})+(u<1?P.dot(rp(K,O,0,70*u,R+7),{c:C.green,r:6}):'')
      +P.op(seg(p,.86,.95),ring(rp(K,O,0,70,R-24),13,C.green)); }},
  {t:"Je divise la mesure par 2 : 70° ÷ 2 = 35°.", d:2000, f:(p,on)=>
    P.op(on?seg(p,.1,.6):1,P.label([480,55],'70° ÷ 2 = 35°',0,0,{s:24,c:C.res}))},
  {t:"Je replace le rapporteur et, sur la même graduation, je marque un petit point en face de 35.", d:4200, f:(p,on)=>{
    if(!on) return P.dot(M,{c:C.arc,r:4.5});
    const g=seg(p,0,.15), t=seg(p,.2,.6);
    return P.op(g,posé()+ring(rp(K,O,0,0,R-24),12,C.green))+P.arc(O,R+7,0,-35,t,{c:C.green,w:4.5})+(t>0&&t<1?P.dot(rp(K,O,0,35*t,R+7),{c:C.green,r:6}):'')
      +P.op(seg(p,.6,.7),P.line(rp(K,O,0,35,R-16),rp(K,O,0,35,R+1),{c:C.green,w:3.5}))+P.op(seg(p,.75,.85),P.dot(M,{c:C.arc,r:4.5}))+(p>.65&&p<.95?pencil(M,-60):''); }},
  {t:"Je retire le rapporteur et, avec la règle, je trace la demi-droite [Oz) qui passe par ce point.", d:3800, f:(p,on)=>{ const t=seg(p,.25,.85);
    let s=P.partLine(O,Ze,on?t:1,{c:C.res,w:2.8});
    if(on){ s=P.op(1-seg(p,0,.2),rapporteur(O,0,R,-1))+P.op(seg(p,.1,.25)*(1-seg(p,.9,1)),ruler(O,aZ,9,1))+s; if(t>0&&t<1) s+=pencil(lerp(O,Ze,t)); }
    return s+P.op(on?seg(p,.85,1):1,P.label(Ze,'z',12,-8,{it:1,c:C.res})); }},
  {t:`Je code : <span style="white-space:nowrap">${H('xOz')}&nbsp;=&nbsp;${H('zOy')}&nbsp;=&nbsp;35°</span>. [Oz) est la bissectrice de ${H('xOy')}.`, d:2600, f:(p,on)=>
    P.op(on?seg(p,0,.45):1,eqArc(K,O,0,aZ,62,C.orange)+eqArc(K,O,aZ,aY,62,C.orange)+P.label(pt(O,90,-17),'35°',0,0,{s:19,c:C.orange})+P.label(pt(O,90,-53),'35°',0,0,{s:19,c:C.orange}))},
  ]; }});

/* ---------- Bissectrice au compas ---------- */
ANIM.add('6e15-bissectrice-compas',{titre:"Construire la bissectrice d'un angle au compas", sub:"bissectrice [OC) d'un angle", steps:K=>{
  const {P,C,seg,lerp,pt,compass,ruler,pencil}=K, O=[150,350], r=150, aY=-64, A=pt(O,r,0), B=pt(O,r,aY), Cc=[A[0]+B[0]-O[0],A[1]+B[1]-O[1]],
        Xe=[600,350], Ye=pt(O,330,aY), aZ=aY/2, Ze=pt(O,440,aZ);
  const arcAt=(c,a0,a1,p,on,side)=>{ const t=seg(p,.15,.85); return P.arc(c,r,a0,a1,on?t:1)+(on?compass(c,pt(c,r,a0+(a1-a0)*t),side):''); };
  const fig = () => P.line(O,Xe)+P.line(O,Ye)+P.dot(O,{r:4.5});
  const aAC=K.angTo(A,Cc), aBC=K.angTo(B,Cc);
  return [
  {t:`Voici l'angle ${H('xOy')}.`, d:1600, f:(p,on)=>{ const t=on?seg(p,0,.6):1;
    return P.partLine(O,Xe,t)+P.partLine(O,Ye,t)+P.op(on?seg(p,.5,.9):1,P.dot(O,{r:4.5})+P.label(O,'O',-14,18)+P.label(Xe,'x',14,0,{it:1})+P.label(Ye,'y',10,-12,{it:1})); }},
  {t:"Je pique en O et je trace un arc de cercle : il coupe [Ox) en A et [Oy) en B.", d:4200, f:(p,on)=>
    arcAt(O,6,aY-6,on?seg(p,0,.8):1,on,1)+P.op(on?seg(p,.8,1):1,P.cross(A)+P.cross(B)+P.label(A,'A',17,22)+P.label(B,'B',-24,4))},
  {t:"Sans changer l'écartement, je pique en A et je trace un arc à l'intérieur de l'angle.", d:3800, f:(p,on)=>arcAt(A,aAC-16,aAC+16,on?p:1,on,-1)},
  {t:"Je garde le même écartement, je pique en B et je trace un arc : il coupe le premier en C.", d:4200, f:(p,on)=>
    arcAt(B,aBC+16,aBC-16,on?seg(p,0,.8):1,on,1)+P.op(on?seg(p,.8,1):1,P.cross(Cc)+P.label(Cc,'C',24,-1))},
  {t:"Avec la règle, je trace la demi-droite [OC) : c'est la bissectrice de l'angle.", d:3600, f:(p,on)=>{ const t=seg(p,.3,.9);
    let s=P.partLine(O,Ze,on?t:1,{c:C.res,w:2.8}); if(on){ s=P.op(1-seg(p,.92,1),ruler(O,aZ,11,1))+s; if(t>0&&t<1) s+=pencil(lerp(O,Ze,t)); }
    return s+P.op(on?seg(p,.85,1):1,P.label(Ze,'z',12,-8,{it:1,c:C.res})); }},
  {t:`Je code : <span style="white-space:nowrap">${H('xOC')}&nbsp;=&nbsp;${H('COy')}</span>. La demi-droite [OC) partage l'angle ${H('xOy')} en deux angles de même mesure.`, d:2600, f:(p,on)=>
    P.op(on?seg(p,0,.5):1,eqArc(K,O,0,aZ,52,C.orange)+eqArc(K,O,aZ,aY,52,C.orange))},
  ]; }});
})();

/* ---- 6e-19.js ---- */
/* 6e-19 — animations : patron du pavé droit (4 cm, 3 cm, 2 cm), comme dans le cours de M. Staal */
(function(){
ANIM.add('6e19-patron-pave',{titre:"Tracer le patron d'un pavé droit", sub:'pavé droit de 4 cm sur 3 cm sur 2 cm', H:440, steps:K=>{
  const {P,C,CM,seg,lerp,dist,angTo,ruler,equerre,pencil}=K;
  const col={L:'#dbe8f7', M:'#fde3c8', S:'#d8f0e4'}; /* 4×3 : bleu ; 4×2 : orange ; 3×2 : vert */
  /* faces du patron : [x, y, largeur, hauteur, couleur, nom] */
  const F={avant:[160,220,160,80,col.M,'avant'], dessous:[160,300,160,120,col.L,'dessous'], dessus:[160,100,160,120,col.L,'dessus'],
           arriere:[160,20,160,80,col.M,'arrière'], gauche:[40,220,120,80,col.S,'côté'], droite:[320,220,120,80,col.S,'côté']};
  /* côtés à tracer pour chaque face : [départ, arrivée, outil, réglage] ; R = règle (body), RL = règle dans le sens de lecture avec le 0 au point d'arrivée, à gauche (body), E = équerre (turn) */
  const SIDES={
    avant:[[[160,300],[320,300],'R',1],[[160,300],[160,220],'E',1],[[320,300],[320,220],'E',-1],[[160,220],[320,220],'R',-1]],
    dessous:[[[160,300],[160,420],'E',-1],[[320,300],[320,420],'E',1],[[160,420],[320,420],'R',-1]],
    dessus:[[[160,220],[160,100],'E',1],[[320,220],[320,100],'E',-1],[[160,100],[320,100],'R',-1]],
    arriere:[[[160,100],[160,20],'E',1],[[320,100],[320,20],'E',-1],[[160,20],[320,20],'R',1]],
    gauche:[[[160,220],[40,220],'RL',-1],[[160,300],[40,300],'RL',1],[[40,220],[40,300],'E',-1]],
    droite:[[[320,220],[440,220],'R',-1],[[320,300],[440,300],'R',1],[[440,220],[440,300],'E',1]]};
  const ink={c:C.ink,w:2.6};
  const fill=k=>{ const [x,y,w,h,c,nm]=F[k]; return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`+P.label([x+w/2,y+h/2],nm,0,0,{s:18,wt:400,c:'#41556b'}); };
  /* les 4 côtés du rectangle d'une face ; ceux qui ne sont pas dans SIDES ont déjà été tracés avec une face précédente */
  const rectE=k=>{ const [x,y,w,h]=F[k], a=[x,y], b=[x+w,y], c=[x+w,y+h], d=[x,y+h]; return [[a,b],[b,c],[c,d],[d,a]]; };
  const same=(e,s)=>(e[0]+''===s[0]+''&&e[1]+''===s[1]+'')||(e[0]+''===s[1]+''&&e[1]+''===s[0]+'');
  const shared=k=>rectE(k).filter(e=>!SIDES[k].some(s=>same(e,s)));
  /* remplissage d'abord, puis tous les traits par-dessus (même épaisseur) : une face colorée ne recouvre jamais une arête déjà tracée */
  const face=(k,p,on)=>{ if(!on) return fill(k)+rectE(k).map(e=>P.line(e[0],e[1],ink)).join('');
    const L=SIDES[k], n=L.length; let s=P.op(seg(p,.9,1),fill(k))+shared(k).map(e=>P.line(e[0],e[1],ink)).join(''), tool='';
    L.forEach(([a,b,T,o],i)=>{ const t=seg(p,i/n*.9+.03,(i+1)/n*.9-.02); s+=P.partLine(a,b,t,ink);
      if(p>=i/n*.9&&p<(i+1)/n*.9){ const ang=angTo(a,b), len=dist(a,b);
        tool=(T==='R'?ruler(a,ang,Math.ceil(len/CM)+1,o):T==='RL'?ruler(b,0,Math.ceil(len/CM)+1,o):equerre(a,ang,len+40,90,o))+(t>0&&t<1?pencil(lerp(a,b,t)):''); } });
    return s+tool; };
  /* pavé en perspective cavalière : face avant en vraie grandeur 4 cm × 2 cm, fuyantes à 45° réduites de moitié */
  const f0=[420,190], dx=1.5*CM*Math.SQRT1_2, A=f0, B=[580,190], Cc=[580,110], D=[420,110], sh=p=>[p[0]+dx,p[1]-dx];
  const pave=()=>`<polygon points="${[D,Cc,sh(Cc),sh(D)].map(q=>q.join(',')).join(' ')}" fill="${col.L}"/><polygon points="${[B,sh(B),sh(Cc),Cc].map(q=>q.join(',')).join(' ')}" fill="${col.S}"/>`+
    P.poly([A,B,Cc,D],{fill:col.M,c:C.ink,w:2.4})+P.line(B,sh(B),{w:2.4})+P.line(sh(B),sh(Cc),{w:2.4})+P.line(Cc,sh(Cc),{w:2.4})+P.line(D,sh(D),{w:2.4})+P.line(sh(D),sh(Cc),{w:2.4})+
    P.line(A,sh(A),{w:1.8,dash:'6 5'})+P.line(sh(A),sh(B),{w:1.8,dash:'6 5'})+P.line(sh(A),sh(D),{w:1.8,dash:'6 5'})+
    P.label([500,208],'4 cm',0,0,{s:19,wt:400})+P.label([386,150],'2 cm',0,0,{s:19,wt:400})+P.label(lerp(D,sh(D),.5),'3 cm',-34,-8,{s:19,wt:400});
  return [
  {t:"Voici le pavé droit : 4\u00a0cm de longueur, 3\u00a0cm de largeur et 2\u00a0cm de hauteur. Il a 6 faces rectangulaires.", d:2200, f:(p,on)=>P.op(on?seg(p,0,.6):1,pave())},
  {t:"Je trace d'abord la face avant : un rectangle de 4\u00a0cm sur 2\u00a0cm, avec la règle et l'équerre.", d:4500, f:(p,on)=>face('avant',p,on)},
  {t:"Sous la face avant, je trace la face du dessous : un rectangle de 4\u00a0cm sur 3\u00a0cm.", d:4000, f:(p,on)=>face('dessous',p,on)},
  {t:"Au-dessus de la face avant, je trace la face du dessus : 4\u00a0cm sur 3\u00a0cm.", d:4000, f:(p,on)=>face('dessus',p,on)},
  {t:"Au-dessus, je trace la face arrière : 4\u00a0cm sur 2\u00a0cm, comme la face avant.", d:4000, f:(p,on)=>face('arriere',p,on)},
  {t:"À gauche de la face avant, je trace une face de côté : 3\u00a0cm sur 2\u00a0cm.", d:4000, f:(p,on)=>face('gauche',p,on)},
  {t:"À droite de la face avant, je trace l'autre face de côté : 3\u00a0cm sur 2\u00a0cm.", d:4000, f:(p,on)=>face('droite',p,on)},
  {t:"J'obtiens un patron du pavé : en le pliant, les 6 faces forment le pavé sans se superposer.", d:2400, f:(p,on)=>
    P.op(seg(p,0,.6),P.label([240,432],'4 cm',0,0,{s:19,c:C.res})+P.label([326,360],'3 cm',0,0,{s:19,c:C.res,a:'start'})+P.label([446,260],'2 cm',0,0,{s:19,c:C.res,a:'start'}))},
  ]; }});
})();

/* ---- 6e-2.js ---- */
/* 6e-2 — Premiers éléments de géométrie : perpendiculaire et parallèles à l'équerre (méthodes du cours de M. Staal) */

/* IV.1 — Tracer la perpendiculaire à (d) passant par M (méthode en trois étapes du cours) */
ANIM.add('6e2-perp-equerre',{titre:"Tracer une perpendiculaire à l'équerre", sub:"perpendiculaire à (d) passant par le point M", steps:K=>{
  const {P,C,seg,lerp,pt,equerre,ruler,pencil}=K;
  const add=(a,b,k=1)=>[a[0]+b[0]*k,a[1]+b[1]*k];
  const a=-35, u=pt([0,0],1,a), n=pt([0,0],1,a-90), H=[360,262];
  const on_d=s=>add(H,u,s), on_k=s=>add(H,n,s), M=on_k(120);
  const d0=on_d(-215), d1=on_d(255), top=on_k(268), bot=on_k(-118), eTop=on_k(195);
  const eq=o=>equerre(o,a-90,210,110,1);
  return [
  {t:"Voici la droite (d) et le point M.", d:1800, f:(p,on)=>P.partLine(d0,d1,on?seg(p,0,.6):1)
    +P.op(on?seg(p,.4,.8):1,P.label(add(on_d(232),n,24),'(d)')+P.cross(M)+P.label(M,'M',-24,0))},
  {t:"Je place un des côtés de l'angle droit de l'équerre sur la droite (d).", d:2600, f:(p,on)=>{ if(!on) return '';
    const t=seg(p,.05,.75); return P.op(seg(p,0,.3),eq(add(on_d(-100),n,40*(1-t)))); }},
  {t:"Je fais glisser l'équerre le long de (d) jusqu'à ce que l'autre côté passe par le point M.", d:3200, f:(p,on)=>{ if(!on) return '';
    return eq(on_d(-100*(1-seg(p,.1,.85)))); }},
  {t:"Je trace la droite le long du côté de l'équerre.", d:3000, f:(p,on)=>{ const t=seg(p,.1,.85);
    let s=P.partLine(eTop,H,on?t:1,{c:C.res,w:2.6}); if(!on) return s;
    return eq(H)+s+(t>0&&t<1?pencil(lerp(eTop,H,t)):''); }},
  {t:"Je prolonge la droite à l'aide de la règle.", d:3600, f:(p,on)=>{ const t=seg(p,.25,.9);
    let s=P.partLine(top,bot,on?t:1,{c:C.res,w:2.6}); if(!on) return s;
    const r=P.op(seg(p,0,.2)*(1-seg(p,.93,1)),ruler(add(on_k(274),u,3),a+90,10,-1));
    return r+s+(t>0&&t<1?pencil(lerp(top,bot,t)):''); }},
  {t:"Je nomme la droite (d') et je code l'angle droit : (d') est perpendiculaire à (d).", d:2600, f:(p,on)=>
    P.op(seg(p,0,.35),P.label(on_k(248),"(d')",-34,0,{c:C.res}))+P.op(seg(p,.25,.6),P.right(H,u,n))
    +P.op(seg(p,.55,.9),P.label([545,322],"(d') ⊥ (d)",0,0,{c:C.res}))},
  ]; }});

/* IV.2 — Tracer la parallèle à (d) passant par M : on utilise deux fois la perpendiculaire */
ANIM.add('6e2-parallele-perp',{titre:"Tracer une parallèle avec deux perpendiculaires", sub:"parallèle à (d) passant par le point M", steps:K=>{
  const {P,C,seg,lerp,equerre,ruler,pencil}=K, X=260, Y=310, M=[X,150], H=[X,Y];
  const eq1=o=>equerre(o,-90,200,120,1), eq2=o=>equerre(o,0,220,110,1);
  const k0=[X,40], k1=[X,368], kE=[X,118], d0=[50,150], d1=[590,150], dE=[470,150];
  return [
  {t:"Voici la droite (d) et le point M.", d:1800, f:(p,on)=>P.partLine([50,Y],[590,Y],on?seg(p,0,.6):1)
    +P.op(on?seg(p,.4,.8):1,P.label([566,Y],'(d)',0,24)+P.cross(M)+P.label(M,'M',20,-20))},
  {t:"Je pose un côté de l'angle droit de l'équerre sur (d) et je la fais glisser jusqu'à ce que l'autre côté passe par M.", d:3600, f:(p,on)=>{ if(!on) return '';
    return P.op(seg(p,0,.2),eq1([X+160*(1-seg(p,.2,.85)),Y])); }},
  {t:"Je trace la droite (k) le long de l'équerre, puis je la prolonge avec la règle.", d:4400, f:(p,on)=>{
    if(!on) return P.line(k0,k1,{c:C.arc,w:2.4});
    const t1=seg(p,.05,.4), t2=seg(p,.55,.92);
    let s=P.op(1-seg(p,.42,.5),eq1(H))+P.partLine(kE,H,t1,{c:C.arc,w:2.4});
    if(p>.46) s=P.op(seg(p,.46,.55)*(1-seg(p,.94,1)),ruler([X-3,32],90,8.5,1))+P.partLine(kE,H,1,{c:C.arc,w:2.4})+P.partLine(k0,k1,t2,{c:C.arc,w:2.4});
    if(t1>0&&t1<1) s+=pencil(lerp(kE,H,t1)); if(t2>0&&t2<1) s+=pencil(lerp(k0,k1,t2));
    return s; }},
  {t:"Je nomme cette droite (k) et je code l'angle droit : (k) est perpendiculaire à (d).", d:2200, f:(p,on)=>
    P.op(seg(p,0,.4),P.label(k0,'(k)',-28,12,{c:C.arc}))+P.op(seg(p,.35,.75),P.right(H,[1,0],[0,-1],14,C.arc))},
  {t:"Je pose un côté de l'angle droit de l'équerre sur (k) et je la fais glisser jusqu'au point M.", d:3400, f:(p,on)=>{ if(!on) return '';
    return P.op(seg(p,0,.2),eq2([X,M[1]+80*(1-seg(p,.2,.85))])); }},
  {t:"Je trace la droite (d') le long de l'équerre, puis je la prolonge avec la règle.", d:4400, f:(p,on)=>{
    if(!on) return P.line(d0,d1,{c:C.res,w:2.6});
    const t1=seg(p,.05,.4), t2=seg(p,.55,.92);
    let s=P.op(1-seg(p,.42,.5),eq2(M))+P.partLine(M,dE,t1,{c:C.res,w:2.6});
    if(p>.46) s=P.op(seg(p,.46,.55)*(1-seg(p,.94,1)),ruler([40,147],0,14,-1))+P.partLine(M,dE,1,{c:C.res,w:2.6})+P.partLine(d0,d1,t2,{c:C.res,w:2.6});
    if(t1>0&&t1<1) s+=pencil(lerp(M,dE,t1)); if(t2>0&&t2<1) s+=pencil(lerp(d0,d1,t2));
    return s; }},
  {t:"Je nomme (d') et je code l'angle droit. (d) et (d') sont perpendiculaires à (k), donc (d') // (d).", d:3000, f:(p,on)=>
    P.op(seg(p,0,.3),P.label([566,150],"(d')",0,-24,{c:C.res}))+P.op(seg(p,.2,.5),P.right(M,[1,0],[0,1]))
    +P.op(seg(p,.5,.85),P.label([470,232],"(d') // (d)",0,0,{c:C.res}))},
  ]; }});

/* IV.2 — Autre méthode du cours : équerre sur (d), règle contre l'autre côté, on fait glisser l'équerre jusqu'à M */
ANIM.add('6e2-parallele-glissement',{titre:"Tracer une parallèle en faisant glisser l'équerre", sub:"parallèle à (d) passant par le point M", steps:K=>{
  const {P,C,seg,lerp,pt,equerre,ruler,pencil}=K;
  const add=(a,b,k=1)=>[a[0]+b[0]*k,a[1]+b[1]*k];
  const a=-15, u=pt([0,0],1,a), n=pt([0,0],1,a-90), E0=[150,330], h=150, E1=add(E0,n,h), M=add(E1,u,110);
  const eq=o=>equerre(o,a,200,120,-1), rul=()=>ruler(add(add(E0,n,-40),u,-1),a-90,8,-1);
  const d0=add(E0,u,-90), d1=add(E0,u,470), e0=add(E1,u,-60), e1=add(E1,u,480), eE=add(E1,u,190);
  return [
  {t:"Voici la droite (d) et le point M.", d:1800, f:(p,on)=>P.partLine(d0,d1,on?seg(p,0,.6):1)
    +P.op(on?seg(p,.4,.8):1,P.label(add(add(E0,u,440),n,-24),'(d)')+P.cross(M)+P.label(add(M,n,-24),'M'))},
  {t:"Je pose un des côtés de l'angle droit de l'équerre sur la droite (d).", d:2400, f:(p,on)=>{ if(!on) return '';
    return P.op(seg(p,0,.3),eq(add(E0,n,40*(1-seg(p,.05,.75))))); }},
  {t:"Je place la règle contre l'autre côté de l'équerre.", d:2600, f:(p,on)=>{ if(!on) return '';
    const t=seg(p,.05,.8); return `<g transform="translate(${(-u[0]*50*(1-t)).toFixed(1)} ${(-u[1]*50*(1-t)).toFixed(1)})">${P.op(seg(p,0,.3),rul())}</g>`+eq(E0); }},
  {t:"Je fais glisser l'équerre le long de la règle jusqu'à ce que son côté passe par le point M.", d:3400, f:(p,on)=>{ if(!on) return '';
    return rul()+eq(add(E0,n,h*seg(p,.1,.85))); }},
  {t:"Je trace la droite (d') le long de l'équerre.", d:2800, f:(p,on)=>{ const t=seg(p,.1,.85);
    let s=P.partLine(E1,eE,on?t:1,{c:C.res,w:2.6}); if(!on) return s;
    return rul()+eq(E1)+s+(t>0&&t<1?pencil(lerp(E1,eE,t)):''); }},
  {t:"Je prolonge la droite (d') avec la règle.", d:3400, f:(p,on)=>{ const t=seg(p,.25,.9);
    let s=P.partLine(e0,e1,on?t:1,{c:C.res,w:2.6}); if(!on) return s;
    return P.op(seg(p,0,.2)*(1-seg(p,.93,1)),ruler(add(add(E1,u,-65),n,3),a,14,-1))+s+(t>0&&t<1?pencil(lerp(e0,e1,t)):''); }},
  {t:"Je nomme la droite (d') : elle est parallèle à (d). On écrit (d') // (d).", d:2400, f:(p,on)=>
    P.op(seg(p,0,.4),P.label(add(add(E1,u,450),n,24),"(d')",0,0,{c:C.res}))+P.op(seg(p,.4,.8),P.label([485,165],"(d') // (d)",0,0,{c:C.res}))},
  ]; }});

/* ---- 6e-4.js ---- */
/* 6e-4 — animations (modèle validé par M. Staal) */

/* I.1 — Mesurer un segment : le zéro de la règle sur la première extrémité, on lit la graduation sur la seconde */
ANIM.add('6e4-mesurer-segment',{titre:'Mesurer un segment avec la règle graduée', sub:'longueur du segment [EF]', steps:K=>{
  const {P,C,CM,seg,ruler}=K, E=[180,190], F=[180+6*CM,190], RY=192;
  return [
  {t:"Voici le segment [EF].", d:1600, f:(p,on)=>P.partLine(E,F,on?seg(p,0,.7):1)
    +P.op(on?seg(p,.5,.9):1,P.cross(E)+P.cross(F)+P.label(E,'E',0,-26)+P.label(F,'F',0,-26))},
  {t:"Je pose la règle graduée le long du segment, avec le zéro sur le point E.", d:2800, f:(p,on)=>{ if(!on) return '';
    return P.op(seg(p,0,.3),ruler([E[0],RY+60*(1-seg(p,.05,.8))],0,10,1)); }},
  {t:"Je lis la graduation qui est sur le point F : c'est 6.", d:2600, f:(p,on)=>{ if(!on) return '';
    return ruler([E[0],RY],0,10,1)+P.op(seg(p,.2,.5),`<circle cx="${F[0]}" cy="${RY+26}" r="12" fill="none" stroke="${C.res}" stroke-width="2.6"/>`)
      +P.op(seg(p,.2,.5),P.line([F[0],F[1]-14],[F[0],RY+12],{c:C.res,w:2,dash:'4 4'})); }},
  {t:"La longueur du segment [EF] est 6 cm. On écrit EF = 6 cm.", d:2200, f:(p,on)=>
    P.op(seg(p,0,.4),P.line(E,F,{c:C.res,w:3}))+P.op(seg(p,.3,.8),P.label([(E[0]+F[0])/2,E[1]],'EF = 6 cm',0,-30,{c:C.res}))},
  ]; }});

/* I.1 — Tracer un segment [CD] tel que CD = 7 cm */
ANIM.add('6e4-tracer-segment',{titre:'Tracer un segment de longueur donnée', sub:'segment [CD] tel que CD = 7 cm', steps:K=>{
  const {P,C,CM,seg,lerp,ruler,pencil}=K, Cp=[170,200], D=[170+7*CM,200], RY=202, rul=()=>ruler([Cp[0],RY],0,10,1);
  return [
  {t:"Je place le point C.", d:1400, f:(p,on)=>P.op(seg(p,0,.6),P.cross(Cp)+P.label(Cp,'C',0,-26))},
  {t:"Je pose la règle graduée avec le zéro sur le point C.", d:2600, f:(p,on)=>{ if(!on) return '';
    return P.op(seg(p,0,.3),ruler([Cp[0],RY+60*(1-seg(p,.05,.8))],0,10,1)); }},
  {t:"Je marque le point D à la graduation 7.", d:2600, f:(p,on)=>{ const t=seg(p,.45,.8), mk=P.op(on?t:1,P.cross(D)+P.label(D,'D',0,-26));
    if(!on) return mk; const q=lerp([D[0]+60,D[1]-40],D,seg(p,.05,.45));
    return rul()+P.op(seg(p,.1,.4),`<circle cx="${D[0]}" cy="${RY+26}" r="12" fill="none" stroke="${C.res}" stroke-width="2.6"/>`)+mk+pencil(q); }},
  {t:"Je trace le segment [CD] le long de la règle.", d:2800, f:(p,on)=>{ const t=seg(p,.1,.85);
    const s=P.partLine(Cp,D,on?t:1,{c:C.res,w:3}); if(!on) return s;
    return rul()+s+P.cross(Cp)+P.cross(D)+(t>0&&t<1?pencil(lerp(Cp,D,t)):''); }},
  {t:"J'ai tracé le segment [CD] tel que CD = 7 cm.", d:2000, f:(p,on)=>
    P.op(seg(p,0,.6),P.label([(Cp[0]+D[0])/2,Cp[1]],'CD = 7 cm',0,-30,{c:C.res}))},
  ]; }});

/* I.2 — Reporter une longueur au compas (exemple du cours : AB reporté sur (d) à partir de C) */
ANIM.add('6e4-report-compas',{titre:'Reporter une longueur au compas', sub:'placer D sur (d) tel que CD = AB', steps:K=>{
  const {P,C,CM,seg,lerp,pt,compass}=K, r=5*CM, A=[100,190], B=[100+r,190], Y=340, Cp=[160,Y], D=[160+r,Y];
  return [
  {t:"Voici le segment [AB], la droite (d) et le point C.", d:1800, f:(p,on)=>P.partLine(A,B,on?seg(p,0,.5):1)+P.partLine([60,Y],[600,Y],on?seg(p,.2,.7):1)
    +P.op(on?seg(p,.5,.9):1,P.cross(A)+P.cross(B)+P.label(A,'A',-22,0)+P.label(B,'B',22,0)+P.cross(Cp)+P.label(Cp,'C',-16,-24)+P.label([590,Y],'(d)',0,24))},
  {t:"Je pique la pointe sèche du compas en A et j'écarte le compas jusqu'à B.", d:3200, f:(p,on)=>{ if(!on) return '';
    return compass(A,[A[0]+r*Math.max(.15,seg(p,.15,.85)),A[1]],1); }},
  {t:"Sans changer l'écartement, je pique la pointe sèche en C.", d:2800, f:(p,on)=>{ if(!on) return '';
    const np=lerp(A,Cp,seg(p,.1,.85)); return compass(np,[np[0]+r,np[1]],1); }},
  {t:"Je trace un arc de cercle qui coupe la droite (d) : c'est le point D.", d:3400, f:(p,on)=>{ const t=seg(p,.05,.8), a0=-14, a1=14;
    let s=P.arc(Cp,r,a0,a1,on?t:1)+P.op(on?seg(p,.8,1):1,P.cross(D,{c:C.res})+P.label(D,'D',20,-22,{c:C.res}));
    return s+(on?compass(Cp,pt(Cp,r,a0+(a1-a0)*t),1):''); }},
  {t:"Je code les longueurs égales : CD = AB. J'ai reporté la longueur AB sans la mesurer.", d:2600, f:(p,on)=>
    P.op(seg(p,0,.4),P.line(Cp,D,{c:C.res,w:3})+P.cross(Cp)+P.cross(D,{c:C.res}))+P.op(seg(p,.3,.6),P.ticks(A,B,2)+P.ticks(Cp,D,2))
    +P.op(seg(p,.55,.9),P.label([470,265],'CD = AB',0,0,{c:C.res}))},
  ]; }});

/* II — Construire le milieu d'un segment (méthode du cours : mesurer, diviser par 2, placer et coder) */
ANIM.add('6e4-milieu-regle',{titre:"Construire le milieu d'un segment", sub:'milieu I du segment [AB], avec AB = 8 cm', steps:K=>{
  const {P,C,CM,seg,lerp,ruler,pencil}=K, A=[160,220], B=[160+8*CM,220], I=[160+4*CM,220], RY=222, rul=()=>ruler([A[0],RY],0,10,1);
  const ring=x=>`<circle cx="${x}" cy="${RY+26}" r="12" fill="none" stroke="${C.res}" stroke-width="2.6"/>`;
  return [
  {t:"Voici le segment [AB].", d:1600, f:(p,on)=>P.partLine(A,B,on?seg(p,0,.7):1)
    +P.op(on?seg(p,.5,.9):1,P.cross(A)+P.cross(B)+P.label(A,'A',0,-26)+P.label(B,'B',0,-26))},
  {t:"Je mesure la longueur du segment avec la règle graduée : le zéro sur A, je lis 8 sur B.", d:3600, f:(p,on)=>{
    const res=P.op(on?seg(p,.75,1):1,P.label([I[0],80],'AB = 8 cm',0,0,{c:C.res})); if(!on) return res;
    return P.op(seg(p,0,.25),ruler([A[0],RY+60*(1-seg(p,.05,.5))],0,10,1))+P.op(seg(p,.55,.75),ring(B[0]))+res; }},
  {t:"Je divise cette longueur par 2 : 8 ÷ 2 = 4. Le milieu est à 4 cm de A.", d:2400, f:(p,on)=>
    P.op(seg(p,0,.5),P.label([I[0],125],'8 ÷ 2 = 4',0,0,{c:C.res}))},
  {t:"Je place le point I à la graduation 4, à partir de A.", d:3000, f:(p,on)=>{ const mk=P.op(on?seg(p,.5,.8):1,P.cross(I)+P.label(I,'I',0,-26));
    if(!on) return mk; const q=lerp([I[0]+60,I[1]-40],I,seg(p,.15,.5));
    return P.op(seg(p,0,.15),rul())+P.op(seg(p,.15,.4),ring(I[0]))+mk+pencil(q); }},
  {t:"Je code les deux longueurs égales : AI = IB = 4 cm. I est le milieu de [AB].", d:2600, f:(p,on)=>
    P.op(seg(p,0,.45),P.ticks(A,I,1)+P.ticks(I,B,1))+P.op(seg(p,.4,.85),P.label([I[0],275],'AI = IB = 4 cm',0,0,{c:C.res}))},
  ]; }});

/* III.3 — Construire un cercle au compas (modèle validé : centre O, rayon 3 cm) */
ANIM.add('cercle-compas',{titre:'Tracer un cercle au compas', sub:'cercle de centre O et de rayon 3 cm', steps:K=>{
  const {P,C,CM,seg,lerp,pt,compass,ruler}=K, O=[400,190], R0=[70,345], r=3*CM, side=1;
  return [
  {t:"Je place le centre O.", d:1200, f:(p,on)=>P.op(seg(p,0,.6),P.cross(O)+P.label(O,'O',-16,-16))},
  {t:"J'écarte le compas de la longueur du rayon, avec la règle graduée : la pointe sur le 0, la mine sur 3 cm.", d:4500, f:(p,on)=>{ if(!on) return '';
    const q=[R0[0]+r*Math.max(.12,seg(p,.2,.6)),R0[1]], k=seg(p,.62,.78);
    return ruler(R0,0,7,1)+compass(R0,q,side)
      +P.op(k,P.line([R0[0],R0[1]-6],[R0[0]+r,R0[1]-6],{c:C.res,w:4})+P.line([R0[0],R0[1]-14],[R0[0],R0[1]+2],{c:C.res,w:3})+P.line([R0[0]+r,R0[1]-14],[R0[0]+r,R0[1]+2],{c:C.res,w:3}))
      +P.op(k,P.label([R0[0]+r+16,R0[1]-26],'écartement : 3 cm',0,0,{c:C.res,a:'start',s:20})); }},
  {t:"Sans changer l'écartement, je pique la pointe du compas sur le centre O.", d:2600, f:(p,on)=>{ if(!on) return '';
    const np=lerp(R0,O,seg(p,.1,.85)); return P.op(1-seg(p,0,.35),ruler(R0,0,7,1))+compass(np,[np[0]+r,np[1]],side); }},
  {t:"Je tourne le compas en le tenant par la tête, sans changer l'écartement : la mine trace le cercle.", d:4200, f:(p,on)=>{ const t=seg(p,.05,.95);
    return P.arc(O,r,0,360,on?t:1,{c:C.res,w:2.6})+(on?compass(O,pt(O,r,360*t),side):''); }},
  {t:"Le cercle (C) de centre O et de rayon 3 cm est tracé. Tous ses points sont à 3 cm de O.", d:2400, f:(p,on)=>{ const M=pt(O,r,-40), t=seg(p,0,.5);
    return P.partLine(O,M,t,{c:C.ink,w:2.2,dash:'7 6'})+P.op(seg(p,.4,.8),P.cross(M)+P.label(M,'M',14,-14)+P.label(lerp(O,M,.5),'3 cm',pt([0,0],30,-130)[0],pt([0,0],30,-130)[1],{s:17}))+P.op(seg(p,.5,.9),P.label(pt(O,r,135),'(C)',-26,10,{c:C.res})); }},
  ]; }});

/* ---- 6e-6.js ---- */
/* 6e-6 — animations (modèle validé par M. Staal) */
(function(){
/* règle posée contre le segment [a,b] (sans mesurer) : le corps est du côté opposé au point ref ; graduations lisibles */
const edgeRuler=(K,a,b,ref,off=4)=>{ let o1=a,o2=b; if(Math.abs(K.angTo(a,b))>90){ o1=b; o2=a; }
  const ang=K.angTo(o1,o2), u=K.unit(o1,o2), d=K.dist(o1,o2);
  let body=1, v=[-u[1],u[0]]; if((ref[0]-o1[0])*v[0]+(ref[1]-o1[1])*v[1]>0){ body=-1; v=[u[1],-u[0]]; }
  return K.ruler([o1[0]+v[0]*off,o1[1]+v[1]*off],ang,Math.ceil(d/K.CM),body); };
/* tracé à la règle de a vers b : la règle apparaît, le crayon trace, la règle s'en va */
const ruled=(K,a,b,p,on,rul,o,t0=.2,t1=.85)=>{ const {P,seg,lerp,pencil}=K, t=seg(p,t0,t1);
  let s=P.partLine(a,b,on?t:1,o); if(on){ s=P.op(Math.min(seg(p,0,t0*.8),1-seg(p,.9,1)),rul)+s; if(t>0&&t<1) s+=pencil(lerp(a,b,t)); } return s; };

ANIM.add('mediatrice-compas',{titre:'Construire la médiatrice au compas', sub:'médiatrice du segment [LT]', steps:K=>{
  const {P,C,seg,lerp,pt,compass,ruler,pencil}=K, L=[200,215], T=[440,215], r=170, h=Math.sqrt(r*r-120*120), A=[320,215-h], B=[320,215+h];
  const arcWith=(c,a0,a1,p,on,side)=>{ const t=seg(p,.15,.85); return P.arc(c,r,a0,a1,on?t:1)+(on?compass(c,pt(c,r,a0+(a1-a0)*t),side):''); };
  return [
  {t:"Voici le segment [LT].", d:1600, f:(p,on)=>P.partLine(L,T,on?seg(p,0,.7):1)+P.op(seg(p,.5,.9),P.cross(L)+P.cross(T)+P.label(L,'L',-20,-4)+P.label(T,'T',20,-4))},
  {t:"J'écarte le compas de plus de la moitié de [LT].", d:2600, f:(p,on)=>on?compass(L,pt(L,40+(r-40)*seg(p,.1,.8),-62),1):''},
  {t:"Je pique en L et je trace deux arcs, de part et d'autre du segment.", d:4400, f:(p,on)=>
    arcWith(L,-62,-28,on?p*2:1,on&&p<.5,1)+(on&&p<.5?'':arcWith(L,28,62,on?(p-.5)*2:1,on,-1))},
  {t:"Sans changer l'écartement, je pique en T et je trace deux arcs de la même façon.", d:4400, f:(p,on)=>
    arcWith(T,-118,-152,on?p*2:1,on&&p<.5,-1)+(on&&p<.5?'':arcWith(T,152,118,on?(p-.5)*2:1,on,1))},
  {t:"Ils coupent les premiers arcs en deux points : je les nomme A et B.", d:1800, f:(p,on)=>P.op(seg(p,0,.6),P.cross(A)+P.cross(B)+P.label(A,'A',30,-4)+P.label(B,'B',30,4))},
  {t:"Avec la règle, je trace la droite (AB) : c'est la médiatrice (m) de [LT].", d:3600, f:(p,on)=>{ const a=[320,30], b=[320,385], t=seg(p,.3,.9);
    let s=P.partLine(a,b,on?t:1,{c:C.res,w:2.8}); if(on){ s=P.op(1-seg(p,.92,1),ruler([326,30],90,9,-1,0))+s; if(t>0&&t<1) s+=pencil(lerp(a,b,t)); }
    return s+P.op(on?seg(p,.85,1):1,P.label([320,40],'(m)',28,8,{c:C.res})); }},
  {t:"Je code la figure : un angle droit et deux longueurs égales. (m) coupe [LT] en son milieu, perpendiculairement.", d:2600, f:(p,on)=>{ const I=[320,215];
    return P.op(seg(p,0,.4),P.right(I,[1,0],[0,-1]))+P.op(seg(p,.3,.7),P.ticks(L,I,2)+P.ticks(I,T,2)); }},
  ]; }});

ANIM.add('6e6-mediatrice-equerre',{titre:"Construire la médiatrice à la règle et à l'équerre", sub:'médiatrice du segment [LT]', steps:K=>{
  const {P,C,CM,seg,lerp,compass,ruler,equerre,pencil}=K, L=[200,240], T=[440,240], I=[320,240], top=[320,50], bot=[320,380];
  return [
  {t:"Voici le segment [LT].", d:1600, f:(p,on)=>P.partLine(L,T,on?seg(p,0,.7):1)+P.op(seg(p,.5,.9),P.cross(L)+P.cross(T)+P.label(L,'L',-20,-4)+P.label(T,'T',20,-4))},
  {t:"Je mesure [LT] avec la règle, le 0 sur L : LT = 6 cm.", d:2800, f:(p,on)=>on?P.op(seg(p,0,.25),ruler(L,0,7,1))+P.op(seg(p,.45,.7),P.cote(L,T,'LT = 6 cm',-34)):''},
  {t:"Le milieu est à 6 ÷ 2 = 3 cm de L : je place précisément le point I.", d:3000, f:(p,on)=>{ const t=seg(p,.3,.8);
    let s=on?P.op(Math.min(seg(p,0,.2),1-seg(p,.9,1)),ruler(L,0,7,1))+P.op(seg(p,.15,.35),P.cote(L,I,'3 cm',-34)):'';
    s+=P.op(on?seg(p,.75,.85):1,P.cross(I)+P.label(I,'I',-14,22)); if(on&&t>0&&t<1) s+=pencil(lerp([I[0],I[1]-30],I,t)); return s; }},
  {t:"Je place l'équerre : son angle droit sur I, un côté contre [LT].", d:2600, f:(p,on)=>{ if(!on) return ''; const t=seg(p,.05,.8);
    return P.op(seg(p,0,.2),equerre(lerp([400,180],I,t),0,200,200,-1)); }},
  {t:"Le long de l'équerre, je trace la droite perpendiculaire à [LT] qui passe par I.", d:3400, f:(p,on)=>{ const t=seg(p,.15,.85);
    let s=on?equerre(I,0,200,200,-1):''; s+=P.partLine(I,top,on?t:1,{c:C.res,w:2.8}); if(on&&t>0&&t<1) s+=pencil(lerp(I,top,t)); return s; }},
  {t:"Avec la règle, je prolonge la droite de l'autre côté de [LT].", d:3200, f:(p,on)=>{ const t=seg(p,.25,.85);
    let s=P.partLine(I,bot,on?t:1,{c:C.res,w:2.8}); if(on){ s=P.op(Math.min(seg(p,0,.2),1-seg(p,.9,1)),ruler([324,top[1]],90,8,-1))+s; if(t>0&&t<1) s+=pencil(lerp(I,bot,t)); }
    return s+P.op(on?seg(p,.85,1):1,P.label(top,'(d)',28,8,{c:C.res})); }},
  {t:"Je code la figure : un angle droit et deux longueurs égales. (d) est la médiatrice de [LT].", d:2600, f:(p,on)=>
    P.op(seg(p,0,.4),P.right(I,[1,0],[0,-1]))+P.op(seg(p,.3,.7),P.ticks(L,I,2)+P.ticks(I,T,2))},
  ]; }});

ANIM.add('6e6-triangle-3-longueurs',{titre:'Construire un triangle connaissant ses trois longueurs', sub:'triangle ABC tel que BC = 4 cm, AB = 3 cm et AC = 3,5 cm', steps:K=>{
  const {P,C,CM,seg,lerp,pt,angTo,inter,compass,ruler,pencil}=K, B=[300,300], Cc=[460,300], rB=3*CM, rC=3.5*CM, R0=[40,345];
  const A=inter(B,rB,Cc,rC).sort((u,v)=>u[1]-v[1])[0], aB=angTo(B,A), aC=angTo(Cc,A);
  const setting=(r,p)=>{ const q=[R0[0]+r*Math.max(.12,seg(p,.25,.8)),R0[1]];
    return P.op(seg(p,0,.2),ruler(R0,0,5,1)+compass(R0,q,1))+P.op(seg(p,.82,.95),P.cote(R0,[R0[0]+r,R0[1]],'écartement : '+(r/CM+'').replace('.',',')+' cm',-22)); };
  const arcAt=(c,r,a0,a1,p,on,side)=>{ const t=seg(p,.15,.85); return P.arc(c,r,a0,a1,on?t:1)+(on?compass(c,pt(c,r,a0+(a1-a0)*t),side):''); };
  const G=[(A[0]+B[0]+Cc[0])/3,(A[1]+B[1]+Cc[1])/3], out=(a,b,k=22)=>{ const m=lerp(a,b,.5), u=K.unit(G,m); return [m[0]+u[0]*k,m[1]+u[1]*k]; };
  return [
  {t:"Je trace le côté [BC] = 4 cm avec la règle, le 0 sur B.", d:3000, f:(p,on)=>{ const t=seg(p,.25,.85);
    let s=P.partLine(B,Cc,on?t:1); if(on){ s=P.op(Math.min(seg(p,0,.2),1-seg(p,.92,1)),ruler(B,0,5,1))+s; if(t>0&&t<1) s+=pencil(lerp(B,Cc,t)); }
    return s+P.op(on?seg(p,.8,1):1,P.cross(B)+P.cross(Cc)+P.label(B,'B',-20,0)+P.label(Cc,'C',20,0)+P.label(lerp(B,Cc,.5),'4 cm',0,22,{s:17,wt:400})); }},
  {t:"J'écarte le compas de 3 cm sur la règle.", d:3200, f:(p,on)=>on?setting(rB,p):''},
  {t:"Je pique en B et je trace un arc de cercle au-dessus de [BC].", d:3400, f:(p,on)=>arcAt(B,rB,aB-24,aB+18,p,on,1)},
  {t:"J'écarte le compas de 3,5 cm sur la règle.", d:3200, f:(p,on)=>on?setting(rC,p):''},
  {t:"Je pique en C et je trace un arc qui coupe le premier.", d:3400, f:(p,on)=>arcAt(Cc,rC,aC+22,aC-18,p,on,-1)},
  {t:"Les deux arcs se coupent en A. Avec la règle, je trace [AB] et [AC].", d:4200, f:(p,on)=>{
    let s=P.op(on?seg(p,0,.15):1,P.cross(A)+P.label(A,'A',0,-24));
    s+=ruled(K,B,A,on?Math.min(1,p*2):1,on&&p<.5,edgeRuler(K,B,A,Cc));
    s+=on&&p<.5?'':ruled(K,A,Cc,on?(p-.5)*2:1,on,edgeRuler(K,A,Cc,B));
    return s; }},
  {t:"Le triangle ABC est construit : AB = 3 cm, AC = 3,5 cm et BC = 4 cm.", d:2400, f:(p,on)=>
    P.op(seg(p,0,.5),P.poly([A,B,Cc],{c:C.res,w:2.8,fill:C.res,fo:.07}))+P.op(seg(p,.4,.9),P.label(out(B,A),'3 cm',-10,0,{s:17,c:C.res})+P.label(out(A,Cc),'3,5 cm',16,0,{s:17,c:C.res})+P.label(lerp(B,Cc,.5),'4 cm',0,22,{s:17,c:C.res}))},
  ]; }});

ANIM.add('6e6-triangle-rectangle',{titre:'Construire un triangle rectangle', sub:'triangle ABC rectangle en A tel que AB = 4 cm et AC = 3 cm', steps:K=>{
  const {P,C,CM,seg,lerp,ruler,equerre,pencil}=K, A=[220,300], X=[500,300], Y=[220,70], B=[A[0]+4*CM,300], Cc=[220,A[1]-3*CM], o={c:C.arc,w:2.2};
  const mark=(q,p,on,lab,dx,dy)=>{ const t=seg(p,.5,.75); return (on&&t>0&&t<1?pencil(q):'')+P.op(on?seg(p,.7,.8):1,P.cross(q)+P.label(q,lab,dx,dy)); };
  return [
  {t:"Je place le point A et je trace, à la règle, un premier côté de l'angle droit.", d:3200, f:(p,on)=>
    P.op(on?seg(p,0,.15):1,P.cross(A)+P.label(A,'A',-20,16))+ruled(K,A,X,p,on,ruler([A[0],A[1]+4],0,7,1),o)},
  {t:"Avec l'équerre, angle droit en A et un côté contre le trait, je trace le deuxième côté.", d:3800, f:(p,on)=>{ const t=seg(p,.35,.85);
    let s=on?P.op(Math.min(seg(p,0,.25),1-seg(p,.92,1)),equerre(lerp([300,250],A,seg(p,0,.3)),0,220,240,-1)):''; s+=P.partLine(A,Y,on?t:1,o); if(on&&t>0&&t<1) s+=pencil(lerp(A,Y,t)); return s; }},
  {t:"Avec la règle, le 0 sur A, je place B à 4 cm sur le premier côté.", d:3000, f:(p,on)=>
    (on?P.op(Math.min(seg(p,0,.2),1-seg(p,.9,1)),ruler(A,0,6,1)):'')+mark(B,p,on,'B',6,24)},
  {t:"De la même façon, je place C à 3 cm de A sur le deuxième côté.", d:3000, f:(p,on)=>
    (on?P.op(Math.min(seg(p,0,.2),1-seg(p,.9,1)),ruler(A,-90,5,-1)):'')+mark(Cc,p,on,'C',-22,0)},
  {t:"Avec la règle, je trace le côté [BC].", d:2800, f:(p,on)=>ruled(K,Cc,B,p,on,edgeRuler(K,Cc,B,A))},
  {t:"Je code l'angle droit : le triangle ABC est rectangle en A, avec AB = 4 cm et AC = 3 cm.", d:2600, f:(p,on)=>
    P.op(seg(p,0,.5),P.poly([A,B,Cc],{c:C.res,w:2.8,fill:C.res,fo:.07})+P.right(A,[1,0],[0,-1],16))+P.op(seg(p,.4,.9),P.label(lerp(A,B,.5),'4 cm',0,22,{s:17,c:C.res})+P.label(lerp(A,Cc,.5),'3 cm',-34,0,{s:17,c:C.res}))},
  ]; }});

ANIM.add('6e6-cercle-circonscrit',{titre:'Construire le cercle circonscrit à un triangle', sub:'cercle qui passe par les trois sommets du triangle ABC', H:420, steps:K=>{
  const {P,C,seg,lerp,pt,angTo,unit,inter,compass,pencil}=K, O=[320,200], R=135;
  const A=pt(O,R,155), B=pt(O,R,20), Cc=pt(O,R,255), r=170, G=[(A[0]+B[0]+Cc[0])/3,(A[1]+B[1]+Cc[1])/3];
  const lab=(q,t)=>{ const u=unit(G,q); return P.label(q,t,u[0]*22,u[1]*22); };
  /* médiatrice de [a,b] : les deux points d'intersection des arcs, et la droite */
  const med=(a,b)=>{ const [m1,m2]=inter(a,r,b,r), u=unit(m1,m2); return {m1,m2,l1:[m1[0]-u[0]*40,m1[1]-u[1]*40],l2:[m2[0]+u[0]*40,m2[1]+u[1]*40]}; };
  const M1=med(A,B), M2=med(B,Cc);
  const arcs=(a,b,m,p,on)=>{ const pts=[[a,m.m1],[a,m.m2],[b,m.m1],[b,m.m2]]; let s='';
    pts.forEach(([c,q],i)=>{ const t=on?Math.max(0,Math.min(1,p*4-i)):1, a0=angTo(c,q)-16, a1=angTo(c,q)+16, side=(i%2?-1:1)*(c===a?1:-1);
      const tt=seg(t,.15,.85); s+=P.arc(c,r,a0,a1,on?tt:1); if(on&&t>0&&t<1) s+=compass(c,pt(c,r,a0+(a1-a0)*tt),side); }); return s; };
  const lineMed=(m,p,on)=>ruled(K,m.l1,m.l2,p,on,edgeRuler(K,m.l1,m.l2,G,5),{c:C.arc,w:2});
  return [
  {t:"Voici le triangle ABC.", d:1600, f:(p,on)=>P.op(on?seg(p,0,.6):1,P.poly([A,B,Cc]))+P.op(on?seg(p,.5,.9):1,P.cross(A)+P.cross(B)+P.cross(Cc)+lab(A,'A')+lab(B,'B')+lab(Cc,'C'))},
  {t:"Je pique en A puis en B, avec le même écartement, et je trace deux arcs de chaque côté de [AB].", d:4500, f:(p,on)=>arcs(A,B,M1,p,on)},
  {t:"Avec la règle, je trace la médiatrice de [AB].", d:2800, f:(p,on)=>lineMed(M1,p,on)},
  {t:"Je fais de même avec le côté [BC] : je pique en B, puis en C.", d:4500, f:(p,on)=>arcs(B,Cc,M2,p,on)},
  {t:"Avec la règle, je trace la médiatrice de [BC].", d:2800, f:(p,on)=>lineMed(M2,p,on)},
  {t:"Les deux médiatrices se coupent en un point : je le nomme O.", d:1800, f:(p,on)=>P.op(seg(p,0,.6),P.cross(O,{c:C.res})+P.label(O,'O',18,24,{c:C.res}))},
  {t:"Je pique en O, j'écarte le compas jusqu'à A et je trace le cercle.", d:4400, f:(p,on)=>{ const a0=155, t=seg(p,.25,.95);
    if(!on) return P.arc(O,R,0,360,1,{c:C.res,w:2.6});
    return P.arc(O,R,a0,a0+360,t,{c:C.res,w:2.6})+compass(O,pt(O,R*Math.max(.2,seg(p,0,.2)),a0+360*t),-1); }},
  {t:"Le cercle passe aussi par B et par C : c'est le cercle circonscrit au triangle ABC.", d:2600, f:(p,on)=>
    P.op(seg(p,0,.5),P.line(O,A,{c:C.soft,w:2,dash:'6 6'})+P.line(O,B,{c:C.soft,w:2,dash:'6 6'})+P.line(O,Cc,{c:C.soft,w:2,dash:'6 6'})+P.ticks(O,A,1)+P.ticks(O,B,1)+P.ticks(O,Cc,1))+P.op(seg(p,.4,.8),P.label([20,32],'OA = OB = OC',0,0,{c:C.res,a:'start'}))},
  ]; }});
})();

/* ---- 6e-9.js ---- */
/* 6e-9 — Angles (1) : mesurer et construire un angle au rapporteur */
(function(){
const H = n => `<span class="ang">${n}</span>`;
/* point de la graduation « a » (graduation extérieure, celle dont le 0 est dans la direction ang) d'un rapporteur centré en o */
const rp = (K,o,ang,a,r) => K.pt(o,r,ang-a);
const ring = (p,r,c) => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${r}" fill="none" stroke="${c}" stroke-width="2.8"/>`;
/* « ABC = 40° » écrit avec le grand chapeau */
const egal = (K,p,nom,txt,o={}) => { const s=o.s||24, w=nom.length*s*0.62; return K.P.angName(p,nom,{s,c:o.c})+K.P.label([p[0]+w/2+12,p[1]],txt,0,0,{s,c:o.c,a:'start'}); };

/* ---------- Mesurer un angle avec le rapporteur ---------- */
ANIM.add('6e9-mesurer-rapporteur',{titre:'Mesurer un angle avec le rapporteur', sub:"mesure de l'angle ABC", steps:K=>{
  const {P,C,seg,lerp,pt,rapporteur}=K, B=[300,300], aA=-15, aC=-55, R=200, L=290, A=pt(B,262,aA), Cc=pt(B,262,aC);
  const fig = () => P.line(B,pt(B,L,aA))+P.line(B,pt(B,L,aC))+P.cross(A)+P.cross(Cc)+P.cross(B);
  const noms = () => P.label(A,'A',4,24)+P.label(Cc,'C',22,8)+P.label(B,'B',-2,26);
  /* rapporteur posé (centre B, 0 sur [BA)), avec la figure redessinée par-dessus (il est transparent) */
  const posé = () => rapporteur(B,aA,R,-1)+fig();
  return [
  {t:`Voici l'angle ${H('ABC')} à mesurer. Son sommet est B, ses côtés sont [BA) et [BC).`, d:2200, f:(p,on)=>{ const t=on?seg(p,0,.6):1;
    return P.partLine(B,pt(B,L,aA),t)+P.partLine(B,pt(B,L,aC),t)+P.op(on?seg(p,.5,.9):1,P.cross(A)+P.cross(Cc)+P.cross(B)+noms()); }},
  {t:"J'estime d'abord : l'angle est aigu, donc sa mesure est entre 0° et 90°.", d:2200, f:(p,on)=>
    P.op(on?seg(p,0,.5):1,P.angArc(B,aC,aA,34,C.orange))+P.op(on?seg(p,.4,.9):1,P.label([24,40],'Aigu : entre 0° et 90°',0,0,{s:21,c:C.orange,a:'start'}))},
  {t:"Je place le centre du rapporteur sur le sommet B.", d:2800, f:(p,on)=>{ if(!on) return '';
    const t=seg(p,.05,.85); return rapporteur(lerp([395,215],B,t),20,R,-1)+fig(); }},
  {t:"Je fais tourner le rapporteur autour de B pour placer le 0 sur le côté [BA).", d:3000, f:(p,on)=>{ if(!on) return '';
    const t=seg(p,.05,.85); return rapporteur(B,20+(aA-20)*t,R,-1)+fig(); }},
  {t:"Sur [BA), c'est le 0 bleu. Le 0 rouge est de l'autre côté : je suis donc la graduation bleue.", d:3200, f:(p,on)=>{ if(!on) return '';
    const z=rp(K,B,aA,0,R-24), zr=rp(K,B,aA,180,R-42);
    return posé()+P.op(seg(p,.1,.4),ring(z,12,C.green))+P.op(seg(p,.5,.8),ring(zr,12,C.res)+P.line([zr[0]-8.5,zr[1]+8.5],[zr[0]+8.5,zr[1]-8.5],{c:C.res,w:2})); }},
  {t:"Je suis la graduation bleue à partir de 0 jusqu'au côté [BC) : je lis 40.", d:4200, f:(p,on)=>{ if(!on) return '';
    const t=seg(p,.1,.75), m=rp(K,B,aA,40*t,R+7);
    return posé()+ring(rp(K,B,aA,0,R-24),12,C.green)+P.arc(B,R+7,aA,aA-40,t,{c:C.green,w:4.5})+P.dot(m,{c:C.green,r:6})
      +P.op(seg(p,.78,.95),ring(rp(K,B,aA,40,R-24),13,C.green)); }},
  {t:`Je retire le rapporteur. L'angle est aigu, donc c'est 40° et pas 140° : <span style="white-space:nowrap">${H('ABC')}&nbsp;=&nbsp;40°</span>.`, d:2600, f:(p,on)=>
    P.op(on?seg(p,.1,.5):1,P.label(pt(B,62,(aA+aC)/2),'40°',0,0,{s:20,c:C.orange}))
    +P.op(on?seg(p,.45,.9):1,egal(K,[455,345],'ABC','= 40°',{c:C.res}))},
  ]; }});

/* ---------- Construire un angle de mesure donnée ---------- */
ANIM.add('6e9-construire-angle',{titre:'Construire un angle de mesure donnée', sub:"l'angle AOB tel que AOB = 30°", steps:K=>{
  const {P,C,seg,lerp,pt,ruler,pencil,rapporteur}=K, O=[240,330], R=200, A=[560,330], Xe=[615,330], aB=-30, Bp=pt(O,300,aB), Be=pt(O,340,aB), M=rp(K,O,0,30,R+6);
  const base = () => P.line(O,Xe)+P.cross(O)+P.cross(A);
  const posé = () => rapporteur(O,0,R,-1)+base()+P.label(O,'O',-2,26)+P.label(A,'A',0,24);
  return [
  {t:"Je trace un premier côté, la demi-droite [OA).", d:3000, f:(p,on)=>{ const t=seg(p,.15,.85);
    let s=P.partLine(O,Xe,on?t:1); if(on){ s=P.op(1-seg(p,.9,1),ruler(O,0,9,1))+s; if(t>0&&t<1) s+=pencil(lerp(O,Xe,t)); }
    return s+P.op(on?seg(p,.85,1):1,P.cross(O)+P.cross(A)+P.label(O,'O',-2,26)+P.label(A,'A',0,24)); }},
  {t:"Je place le centre du rapporteur en O et le 0 sur [OA).", d:3200, f:(p,on)=>{ if(!on) return '';
    const t=seg(p,.05,.85); return rapporteur(lerp([330,215],O,t),-25*(1-t),R,-1)+base(); }},
  {t:"Je suis la graduation bleue qui part de ce 0, et je marque un petit point en face de 30.", d:4400, f:(p,on)=>{
    if(!on) return P.dot(M,{c:C.arc,r:4.5});
    const t=seg(p,.15,.6), m=rp(K,O,0,30*t,R+7);
    return posé()+P.op(seg(p,0,.15),ring(rp(K,O,0,0,R-24),12,C.green))+P.arc(O,R+7,0,-30,t,{c:C.green,w:4.5})+(t<1?P.dot(m,{c:C.green,r:6}):'')
      +P.op(seg(p,.6,.7),ring(rp(K,O,0,30,R-24),13,C.green))+P.op(seg(p,.75,.85),P.dot(M,{c:C.arc,r:4.5}))+(p>.65&&p<.95?pencil(M,-60):''); }},
  {t:"Je retire le rapporteur : il reste le petit point.", d:2000, f:(p,on)=>{ if(!on) return '';
    const t=seg(p,.05,.8); return P.op(1-t,rapporteur(lerp(O,[290,250],t),0,R,-1))+base(); }},
  {t:"Avec la règle, je trace la demi-droite [OB) qui part de O et passe par ce point.", d:3600, f:(p,on)=>{ const t=seg(p,.2,.85);
    let s=P.partLine(O,Be,on?t:1,{c:C.res,w:2.8}); if(on){ s=P.op(1-seg(p,.9,1),ruler(O,aB,9,-1))+s; if(t>0&&t<1) s+=pencil(lerp(O,Be,t)); }
    return s+P.op(on?seg(p,.85,1):1,P.cross(Bp)+P.label(Bp,'B',-14,-20)); }},
  {t:`Je code l'angle : <span style="white-space:nowrap">${H('AOB')}&nbsp;=&nbsp;30°</span>.`, d:2200, f:(p,on)=>
    P.op(on?seg(p,0,.4):1,P.angArc(O,aB,0,48,C.orange)+P.label(pt(O,72,-15),'30°',0,0,{s:20,c:C.orange}))
    +P.op(on?seg(p,.4,.85):1,egal(K,[450,60],'AOB','= 30°',{c:C.res}))},
  ]; }});
})();
