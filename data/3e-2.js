/* 3e — Chapitre 2 : Transformations du plan 1 — symétries, translation et rotation (cours et fiche d'exercices de M. Staal)
   Les figures de construction sont redessinées en SVG à partir des coordonnées lues sur les figures de la fiche :
   les images des corrections sont calculées (symétrie, translation, rotation) à partir des mêmes points.
   Les figures des rosaces et pavages sont celles de la fiche (img/3k2ex), le cours garde les figures du Word (img/3k2co). */
(function(){
/* ---------- petite géométrie (unités : cm ou carreaux, y vers le haut) ---------- */
const V={
  add:(a,b)=>[a[0]+b[0],a[1]+b[1]], sub:(a,b)=>[a[0]-b[0],a[1]-b[1]], mul:(a,k)=>[a[0]*k,a[1]*k],
  d:(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]), mid:(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2], dot:(a,b)=>a[0]*b[0]+a[1]*b[1],
  perp:u=>[-u[1],u[0]], unit:u=>{ const n=Math.hypot(u[0],u[1]); return [u[0]/n,u[1]/n]; },
  /* rotation de centre c, d'angle deg (positif = sens antihoraire) */
  rot:(p,c,deg)=>{ const t=deg*Math.PI/180, x=p[0]-c[0], y=p[1]-c[1]; return [c[0]+x*Math.cos(t)-y*Math.sin(t), c[1]+x*Math.sin(t)+y*Math.cos(t)]; },
  /* symétrique de p par rapport à la droite (ab) */
  refl:(p,a,b)=>{ const u=V.unit(V.sub(b,a)), w=V.sub(p,a), t=V.dot(w,u), f=V.add(a,V.mul(u,t)); return V.sub(V.mul(f,2),p); },
  sym:(p,c)=>[2*c[0]-p[0],2*c[1]-p[1]],
  tr:(p,a,b)=>[p[0]+b[0]-a[0],p[1]+b[1]-a[1]],
  /* homothétie de centre c et de rapport k */
  hom:(p,c,k)=>[c[0]+k*(p[0]-c[0]), c[1]+k*(p[1]-c[1])],
  /* angle orienté de la direction (en degrés) */
  dir:(a,b)=>Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI,
  ang:(v,a,b)=>{ const u=V.sub(a,v), w=V.sub(b,v); return Math.acos(Math.max(-1,Math.min(1,V.dot(u,w)/Math.hypot(...u)/Math.hypot(...w))))*180/Math.PI; },
  /* triangle de côtés BC = a, CA = b, AB = c : B(0;0), C(a;0), A au-dessus */
  tri:(a,b,c)=>{ const x=(c*c-b*b+a*a)/(2*a); return {A:[x,Math.sqrt(Math.max(0,c*c-x*x))],B:[0,0],C:[a,0]}; }
};
const MAP=(P,f)=>{ const o={}; Object.entries(P).forEach(([k,p])=>o[k]=f(p)); return o; };
const COL={ink:"var(--ink)", c:"var(--c)", red:"#c0392b", blue:"#1e5aa8", grn:"#1e8a4c", ora:"#d9730d", mut:"var(--muted)"};
/* Figure SVG
   P {nom:[x,y]} · k px par unité · grid [x0,y0,x1,y1] quadrillage · box [[x,y]] points à inclure
   poly [[noms ou points], classe] (orig, img, ln) · seg [[a,b,style]] · line [[a,b,style,e1,e2]] droite prolongée
   vec [[a,b,couleur]] flèche · circ [[c,r,style]] · arc [[c,r,deg0,deg1,style]] arc de cercle (sens antihoraire de deg0 à deg1)
   angs [[sommet,a,b,texte,rayon,couleur]] · right [[sommet,a,b]] · ticks [[a,b,n]] codage
   x [noms] croix · lab [noms] (défaut : noms de x) · off {nom:[dx,dy]} · txt [[texte,[x,y],dx,dy,style]]
   len [[a,b,texte,côté]] longueur écrite le long d'un segment */
const STY={ln:"stroke:var(--ink);stroke-width:2.2", thin:"stroke:var(--ink);stroke-width:1.5", d:"stroke:var(--muted);stroke-width:1.6;stroke-dasharray:6 5",
  c:"stroke:var(--c);stroke-width:2.4", cd:"stroke:var(--c);stroke-width:2;stroke-dasharray:8 5", r:`stroke:${COL.red};stroke-width:2.4`, rd:`stroke:${COL.red};stroke-width:2;stroke-dasharray:8 5`,
  b:`stroke:${COL.blue};stroke-width:2.4`, bd:`stroke:${COL.blue};stroke-width:1.8;stroke-dasharray:6 4`, g:`stroke:${COL.grn};stroke-width:2.4`, o:`stroke:${COL.ora};stroke-width:2.4`, k:"stroke:var(--ink);stroke-width:3.2"};
function geo(o){
  const k=o.k||30, pad=o.pad??30, P=o.P||{}, g=a=>typeof a==="string"?P[a]:a, f=v=>v.toFixed(1);
  const all=[...Object.values(P), ...(o.box||[])];
  if(o.grid){ all.push([o.grid[0],o.grid[1]],[o.grid[2],o.grid[3]]); }
  (o.circ||[]).forEach(([c,r])=>{ const C=g(c); all.push([C[0]-r,C[1]-r],[C[0]+r,C[1]+r]); });
  (o.arc||[]).forEach(([c,r,a0,a1])=>{ const C=g(c); for(let i=0;i<=16;i++){ const t=(a0+(a1-a0)*i/16)*Math.PI/180; all.push([C[0]+r*Math.cos(t),C[1]+r*Math.sin(t)]); } });
  const ends=[]; (o.line||[]).forEach(([a,b,t,e1=1,e2=1])=>{ const A=g(a), B=g(b), u=V.unit(V.sub(B,A)); const e=[V.sub(A,V.mul(u,e1)),V.add(B,V.mul(u,e2)),t]; ends.push(e); if(!o.clip) all.push(e[0],e[1]); });
  const mx=Math.min(...all.map(p=>p[0])), Mx=Math.max(...all.map(p=>p[0])), my=Math.min(...all.map(p=>p[1])), My=Math.max(...all.map(p=>p[1]));
  const X=x=>pad+(x-mx)*k, Y=y=>pad+(My-y)*k;
  const W=Math.round((Mx-mx)*k+2*pad), H=Math.round((My-my)*k+2*pad);
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${o.w?Math.min(o.w,W):W}" role="img" aria-label="${o.alt||"Figure de géométrie"}">`;
  if(o.grid){ const [x0,y0,x1,y1]=o.grid; for(let x=Math.ceil(x0);x<=x1+1e-9;x++) s+=`<line x1="${f(X(x))}" y1="${f(Y(y0))}" x2="${f(X(x))}" y2="${f(Y(y1))}" class="gridl"/>`;
    for(let y=Math.ceil(y0);y<=y1+1e-9;y++) s+=`<line x1="${f(X(x0))}" y1="${f(Y(y))}" x2="${f(X(x1))}" y2="${f(Y(y))}" class="gridl"/>`; }
  const L=(a,b,t)=>`<line x1="${f(X(a[0]))}" y1="${f(Y(a[1]))}" x2="${f(X(b[0]))}" y2="${f(Y(b[1]))}" style="${STY[t||"ln"]};fill:none;stroke-linecap:round"/>`;
  (o.poly||[]).forEach(([N,cls="orig"])=>{ s+=`<polygon points="${N.map(n=>f(X(g(n)[0]))+","+f(Y(g(n)[1]))).join(" ")}" class="${cls==="ln"?"ln":cls}"${cls==="ln"?' style="stroke-linejoin:round"':""}/>`; });
  (o.pl||[]).forEach(([N,t])=>{ s+=`<polyline points="${N.map(n=>f(X(g(n)[0]))+","+f(Y(g(n)[1]))).join(" ")}" style="${STY[t||"ln"]};fill:none;stroke-linejoin:round;stroke-linecap:round"/>`; });
  (o.circ||[]).forEach(([c,r,t])=>{ const C=g(c); s+=`<circle cx="${f(X(C[0]))}" cy="${f(Y(C[1]))}" r="${f(r*k)}" style="fill:none;${STY[t||"d"]}"/>`; });
  (o.arc||[]).forEach(([c,r,a0,a1,t])=>{ const C=g(c), p0=[C[0]+r*Math.cos(a0*Math.PI/180),C[1]+r*Math.sin(a0*Math.PI/180)], p1=[C[0]+r*Math.cos(a1*Math.PI/180),C[1]+r*Math.sin(a1*Math.PI/180)];
    s+=`<path d="M${f(X(p0[0]))} ${f(Y(p0[1]))} A${f(r*k)} ${f(r*k)} 0 ${Math.abs(a1-a0)>180?1:0} ${a1>a0?0:1} ${f(X(p1[0]))} ${f(Y(p1[1]))}" style="fill:none;${STY[t||"d"]}"/>`; });
  ends.forEach(([a,b,t])=>{ s+=L(a,b,t); });
  (o.seg||[]).forEach(([a,b,t])=>{ s+=L(g(a),g(b),t); });
  (o.vec||[]).forEach(([a,b,col])=>{ const A=g(a), B=g(b), p=[X(A[0]),Y(A[1])], q=[X(B[0]),Y(B[1])], u=V.unit(V.sub(q,p)), n=V.perp(u), c=col||"var(--ink)";
    const h=V.sub(q,V.mul(u,13)); s+=`<line x1="${f(p[0])}" y1="${f(p[1])}" x2="${f(h[0])}" y2="${f(h[1])}" style="stroke:${c};stroke-width:2.2"/><polygon points="${f(q[0])},${f(q[1])} ${f(h[0]+n[0]*5.5)},${f(h[1]+n[1]*5.5)} ${f(h[0]-n[0]*5.5)},${f(h[1]-n[1]*5.5)}" style="fill:${c}"/>`; });
  (o.ticks||[]).forEach(([a,b,n=1,t=.5])=>{ const A=g(a), B=g(b), px=[X(A[0]+(B[0]-A[0])*t), Y(A[1]+(B[1]-A[1])*t)];
    const dx=X(B[0])-X(A[0]), dy=Y(B[1])-Y(A[1]), n0=Math.hypot(dx,dy), ux=dx/n0, uy=dy/n0;
    for(let i=0;i<n;i++){ const off=(i-(n-1)/2)*5, cx=px[0]+ux*off, cy=px[1]+uy*off; s+=`<line x1="${f(cx+uy*7+ux*3)}" y1="${f(cy-ux*7+uy*3)}" x2="${f(cx-uy*7-ux*3)}" y2="${f(cy+ux*7-uy*3)}" style="stroke:${COL.red};stroke-width:2"/>`; } });
  (o.right||[]).forEach(([v,a,b])=>{ const Vv=g(v), A=g(a), B=g(b), p=[X(Vv[0]),Y(Vv[1])];
    const da=V.unit([X(A[0])-p[0],Y(A[1])-p[1]]), db=V.unit([X(B[0])-p[0],Y(B[1])-p[1]]), z=11;
    s+=`<path d="M${f(p[0]+da[0]*z)} ${f(p[1]+da[1]*z)} L${f(p[0]+da[0]*z+db[0]*z)} ${f(p[1]+da[1]*z+db[1]*z)} L${f(p[0]+db[0]*z)} ${f(p[1]+db[1]*z)}" style="fill:none;stroke:var(--ink);stroke-width:1.6"/>`; });
  (o.angs||[]).forEach(([v,a,b,t,r=0.9,col])=>{ const C=g(v); let a0=V.dir(C,g(a)), a1=V.dir(C,g(b)); let d=a1-a0; while(d>180) d-=360; while(d<-180) d+=360; const c=col||COL.grn;
    const p0=[C[0]+r*Math.cos(a0*Math.PI/180),C[1]+r*Math.sin(a0*Math.PI/180)], p1=[C[0]+r*Math.cos((a0+d)*Math.PI/180),C[1]+r*Math.sin((a0+d)*Math.PI/180)];
    s+=`<path d="M${f(X(C[0]))} ${f(Y(C[1]))} L${f(X(p0[0]))} ${f(Y(p0[1]))} A${f(r*k)} ${f(r*k)} 0 0 ${d>0?0:1} ${f(X(p1[0]))} ${f(Y(p1[1]))} Z" style="fill:${c};fill-opacity:.22;stroke:${c};stroke-width:1.6"/>`;
    if(t){ const am=(a0+d/2)*Math.PI/180, rr=r+0.25+String(t).length*0.09; s+=`<text x="${f(X(C[0]+rr*Math.cos(am)))}" y="${f(Y(C[1]+rr*Math.sin(am))+5)}" text-anchor="middle" style="font-size:14px;font-weight:700;fill:${c}">${t}</text>`; } });
  (o.x||[]).forEach(n=>{ const p=g(n), x=X(p[0]), y=Y(p[1]), xc=(typeof n==="string"&&o.xc&&o.xc[n])||o.xcol||"var(--ink)"; s+=`<path d="M${f(x-5)} ${f(y-5)} L${f(x+5)} ${f(y+5)} M${f(x+5)} ${f(y-5)} L${f(x-5)} ${f(y+5)}" style="stroke:${xc};stroke-width:2"/>`; });
  (o.dots||[]).forEach(n=>{ const p=g(n); s+=`<circle cx="${f(X(p[0]))}" cy="${f(Y(p[1]))}" r="3.4" style="fill:var(--ink)"/>`; });
  const names=o.lab||o.x||[], cen=o.cen?g(o.cen):(()=>{ const T=names.map(n=>P[n]).filter(Boolean); return T.length?[T.reduce((a,p)=>a+p[0],0)/T.length, T.reduce((a,p)=>a+p[1],0)/T.length]:[0,0]; })();
  names.forEach(n=>{ const p=P[n]; if(!p) return; let d=o.off&&o.off[n]; if(!d){ let u=[X(p[0])-X(cen[0]),Y(p[1])-Y(cen[1])]; if(Math.hypot(...u)<1) u=[0.6,-0.8]; u=V.unit(u); d=[u[0]*16,u[1]*16]; }
    const col=(o.labc&&o.labc[n])||"var(--ink)";
    s+=`<text x="${f(X(p[0])+d[0])}" y="${f(Y(p[1])+d[1]+6)}" text-anchor="middle" style="font-weight:700;font-size:16px;fill:${col}">${(o.name&&o.name[n])||n}</text>`; });
  (o.len||[]).forEach(([a,b,t,side])=>{ const A=g(a), B=g(b), m=[(X(A[0])+X(B[0]))/2,(Y(A[1])+Y(B[1]))/2]; let nrm=V.unit(V.perp([X(B[0])-X(A[0]),Y(B[1])-Y(A[1])]));
    const c=[X(cen[0]),Y(cen[1])]; if(V.dot(nrm,V.sub(m,c))<0) nrm=V.mul(nrm,-1); if(side) nrm=V.mul(nrm,-1);
    const tw=String(t).replace(/<[^>]*>/g,"").length*7.6, dd=11+Math.abs(nrm[0])*tw/2+Math.abs(nrm[1])*3, q=[m[0]+nrm[0]*dd, m[1]+nrm[1]*dd+5];
    s+=`<text x="${f(q[0])}" y="${f(q[1])}" text-anchor="middle" style="font-size:14px;font-weight:600;fill:${COL.blue}">${t}</text>`; });
  (o.txt||[]).forEach(([t,p,dx=0,dy=0,st=""])=>{ const q=g(p); s+=`<text x="${f(X(q[0])+dx)}" y="${f(Y(q[1])+dy+5)}" text-anchor="middle" style="font-size:15px;font-weight:700;fill:var(--ink);${st}">${t}</text>`; });
  return s+"</svg>";
}
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const fig=(cap,body)=>`<figure>${body}${cap?`<figcaption>${cap}</figcaption>`:""}</figure>`;
const ang=s=>`<span class="ang">${s}</span>`;
const r3=x=>Math.round(x*1000)/1000;
/* écriture française d'un nombre : 1 000 · 2,5 · −3 */
const F=(x,k=3)=>{ const r=Math.round(x*10**k)/10**k; const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const gcd=(a,b)=>b?gcd(b,a%b):a;
const VF=["Vrai","Faux"];

const co=(p,alt,w)=>img("3k2co/"+p+".png",alt,w), ex=(p,alt,w)=>img("3k2ex/"+p+".png",alt,w);
const pr=s=>s.split("").map(c=>c+"'").join("");           /* "DEC" -> "D'E'C'" */
const vec=s=>`<span style="display:inline-block;position:relative;padding-top:.5em;line-height:1;white-space:nowrap">${s}<svg aria-hidden="true" style="position:absolute;left:0;top:0;width:100%;height:.45em;overflow:visible" viewBox="0 0 100 10" preserveAspectRatio="none"><line x1="2" y1="5" x2="95" y2="5" stroke="currentColor" stroke-width="1.6" vector-effect="non-scaling-stroke"/><path d="M80 0.5 L98 5 L80 9.5" fill="none" stroke="currentColor" stroke-width="1.6" vector-effect="non-scaling-stroke"/></svg></span>`;

/* ------------------------------------------------------------------
   Drapeaux (Activité 1) : rectangle 5 × 4 carreaux et mât de 4 carreaux
------------------------------------------------------------------ */
const FLAG=K=>({r:[K,[K[0]+5,K[1]],[K[0]+5,K[1]+4],[K[0],K[1]+4]], m:[K,[K[0],K[1]-4]]});
function flags(K, T, grid, show, extra={}){
  const a=FLAG(K), b={r:a.r.map(T), m:a.m.map(T)}, c1=[K[0]+2.5,K[1]+2], c2=T(c1);
  const o={grid, k:o0k(grid), pad:12, poly:[[a.r,"orig"],[b.r,"img"]], seg:[[a.m[0],a.m[1],"k"],[b.m[0],b.m[1],"k"]],
    txt:[["Figure 1",c1,0,0,"font-size:14px"],["Figure 2",c2,0,0,"font-size:14px"]], alt:"Figure 1 et figure 2 sur quadrillage"};
  if(show) Object.entries(extra).forEach(([k,v])=>{ o[k]=Array.isArray(v)?(o[k]||[]).concat(v):v; });
  return geo(o);
}
const o0k=gr=>Math.min(20, 330/(gr[2]-gr[0]));
/* les six transformations de l'activité 1 (carreaux) */
const A1=[
 {K:[1,4], grid:[0,-1,16,9], T:p=>[16-p[0],p[1]], ex:{line:[[[8,-1],[8,9],"rd",0,0]], txt:[["(d)",[8,8.6],14,0,"fill:#c0392b"]]},
  rep:"<b>Symétrie axiale</b> : la figure 1 se retourne. L'axe de symétrie <b style=\"color:#c0392b\">(d)</b> (en rouge) est la droite verticale située à 2 carreaux à droite de la figure 1 (au milieu des deux figures)."},
 {K:[1,8], grid:[0,-1,18,13], T:p=>[p[0]+11,p[1]-4], ex:{vec:[[[1,8],[12,4],"#c0392b"]]},
  rep:"<b>Translation</b> : la figure glisse sans tourner, de 11 carreaux vers la droite et de 4 carreaux vers le bas (flèche rouge)."},
 {K:[1,4], grid:[0,-1,16,19], T:p=>[16-p[0],18-p[1]], ex:{x:[[8,9]], xcol:"#1e5aa8", txt:[["O",[8,9],12,-12,"fill:#1e5aa8"]], seg:[[[1,0],[15,18],"bd"]]},
  rep:"<b>Symétrie centrale</b> : la figure 1 fait un demi-tour (180°). Le centre de symétrie <b style=\"color:#1e5aa8\">O</b> (en bleu) est le milieu du segment qui relie un point de la figure 1 à son image (le bas du mât et le haut du mât de la figure 2)."},
 {K:[12,4], grid:[0,-1,18,16], T:p=>[p[1]+2,p[0]-2], ex:{line:[[[2,0],[17,15],"rd",0,0]], txt:[["(d)",[16,14],-16,0,"fill:#c0392b"]]},
  rep:"<b>Symétrie axiale</b> : la figure 1 se retourne. L'axe de symétrie <b style=\"color:#c0392b\">(d)</b> (en rouge) est une droite oblique : elle suit les diagonales des carreaux."},
 {K:[10,6], grid:[0,0,17,12], T:p=>V.rot(p,[10,2],90), ex:{x:[[10,2]], txt:[["O",[10,2],12,14,"fill:#c0392b"]], angs:[[[10,2],[10,6],[6,2],"90°",1.4,"#c0392b"]]},
  rep:"<b>Rotation</b> de centre O (le bas du mât de la figure 1), d'angle 90° dans le sens antihoraire : la figure tourne d'un quart de tour."},
 {K:[13,4], grid:[0,-1,19,10], T:p=>[p[0]-11,p[1]], ex:{vec:[[[13,8],[2,8],"#c0392b"]]},
  rep:"<b>Translation</b> : la figure glisse sans tourner, de 11 carreaux vers la gauche (flèche rouge)."}
];
const A1fig=(i,show)=>flags(A1[i].K, A1[i].T, A1[i].grid, show, A1[i].ex);

/* ------------------------------------------------------------------
   Exercice 1 : triangle DEC (carreaux), images par symétrie et translation
------------------------------------------------------------------ */
const T0={D:[2,3],E:[0,0],C:[4,2]};
const imgPts=(P,T)=>{ const o={}; ["D","E","C"].forEach(n=>o[n+"'"]=T(P[n])); return o; };
function ex1Axial(grid, show){
  const A=[4,0], B=[5,1], T=p=>V.refl(p,A,B), I=imgPts(T0,T), P={...T0, ...(show?I:{})};
  const o={P, grid:grid?[-1,-5,8,3]:null, box:grid?[]:[[-1,-5],[8,3]], k:28, pad:26, poly:[[["D","E","C"],"orig"]], line:[[[-1,-5],[7,3],"r",0,0]], x:Object.keys(P), cen:[3,-1],
    txt:[["(d)",[7,3],-16,4,"fill:#c0392b"]], alt:"Triangle DEC et droite (d)"};
  if(show){ o.poly.push([["D'","E'","C'"],"img"]); o.labc={"D'":"var(--c)","E'":"var(--c)","C'":"var(--c)"};
    if(!grid){ o.seg=["D","E","C"].map(n=>[n,n+"'","d"]); o.right=["D","E","C"].map(n=>{ const m=V.mid(P[n],P[n+"'"]); return [m,P[n],[7,3]]; }); o.ticks=["D","E","C"].flatMap((n,i)=>[[n,n+"'",i+1,.25],[n,n+"'",i+1,.75]]); }
    o.off={"D'":[14,6],"E'":[14,10],"C'":[16,4]}; }
  return geo(o);
}
function ex1Central(grid, show){
  const Fp=[0,-2], T=p=>V.sym(p,Fp), I=imgPts(T0,T), P={...T0, F:Fp, ...(show?I:{})};
  const o={P, grid:grid?[-5,-8,5,4]:null, box:grid?[]:[[-5,-8],[5,4]], k:26, pad:26, poly:[[["D","E","C"],"orig"]], x:Object.keys(P), xc:{F:"#1e5aa8"}, labc:{F:"#1e5aa8"}, cen:[0,-2], off:{F:[14,4]}, alt:"Triangle DEC et point F"};
  if(show){ o.poly.push([["D'","E'","C'"],"img"]); o.labc={F:"#1e5aa8","D'":"var(--c)","E'":"var(--c)","C'":"var(--c)"};
    if(!grid){ o.seg=["D","E","C"].map(n=>[n,n+"'","d"]); o.ticks=["D","E","C"].flatMap((n,i)=>[[n,"F",i+1],["F",n+"'",i+1]]); } }
  return geo(o);
}
function ex1Trans(grid, show){
  const H=[5,4], I0=[9,3], T=p=>V.tr(p,H,I0), I=imgPts(T0,T), P={...T0, H, I:I0, ...(show?I:{})};
  const o={P, grid:grid?[-1,-2,10,5]:null, box:grid?[]:[[-1,-2],[10,5]], k:28, pad:26, poly:[[["D","E","C"],"orig"]], vec:[["H","I"]], x:Object.keys(P), cen:[4,1], off:{H:[0,-14],I:[6,-14]}, alt:"Triangle DEC et points H et I"};
  if(show){ o.poly.push([["D'","E'","C'"],"img"]); o.labc={"D'":"var(--c)","E'":"var(--c)","C'":"var(--c)"}; if(!grid) o.vec.push(...["D","E","C"].map(n=>[n,n+"'","var(--muted)"])); o.off={...o.off,"D'":[2,-16],"C'":[16,-4],"E'":[8,16]}; }
  return geo(o);
}

/* ------------------------------------------------------------------
   Rotations : figure de départ, image, arcs de construction et angles
------------------------------------------------------------------ */
/* P : points · cn : nom du centre · deg (positif = antihoraire) · shape : noms de la figure · closed */
function rotFig(o){
  const {P, cn, deg, shape, closed=true, show, grid, k=30, lab, t=`${Math.abs(deg)}°`} = o, C=P[cn];
  const Q={...P}, names=shape.filter(n=>n!==cn);
  if(show) names.forEach(n=>{ Q[n+"'"]=V.rot(P[n],C,deg); });
  const sh=s=>s.map(n=>n===cn?cn:n), im=shape.map(n=>n===cn?cn:n+"'");
  const g={P:Q, grid, k, pad:22, x:Object.keys(Q), cen:o.cen, off:o.off, alt:o.alt||"Figure à transformer par rotation"};
  if(closed){ g.poly=[[sh(shape),"orig"]]; if(show) g.poly.push([im,"img"]); }
  else { g.pl=[[shape,"ln"]]; if(show) g.pl.push([im,"c"]); }
  if(show){ g.labc={}; names.forEach(n=>g.labc[n+"'"]="var(--c)");
    if(!grid){ g.arc=names.map(n=>{ const r=V.d(C,P[n]), a0=V.dir(C,P[n]); return [cn, r, a0, a0+deg, "d"]; });
      g.seg=names.flatMap(n=>[[cn,n,"d"],[cn,n+"'","d"]]);
      g.angs=[[cn, names[0], names[0]+"'", t, Math.min(1.1,0.35*V.d(C,P[names[0]]))]]; } }
  return geo(g);
}
/* Activité 2 */
const R1={P:{A:[0,3],B:[0,0],C:[2,0]}, cn:"A", deg:90, shape:["A","B","C"], closed:false, grid:[-2,-1,6,6], k:30, cen:[1,2], off:{A:[-12,-6]}};
const R2={P:{A:[0,3],B:[0,0],C:[2,0]}, cn:"A", deg:70, shape:["A","B","C"], closed:false, k:42, cen:[0.5,1.5], off:{A:[-12,-6],B:[-12,10],C:[10,14]}};
const R3={P:{A:[0,0],B:[3,-1],D:[4,0],C:[5,-3]}, cn:"A", deg:-142, shape:["B","D","C"], k:34, cen:[1,-1]};
/* Exercice 2 */
const S1={P:{A:[0,0],B:[0.5,-5],C:[4.7,-5.4]}, cn:"C", deg:-102, shape:["A","B","C"], k:34, cen:[1.7,-3.5]};
const S2={P:{D:[0,0],A:[-6,-1.3],B:[-7.5,-6.3],C:[-1.4,-10.5]}, cn:"D", deg:84, shape:["A","B","C"], k:24, cen:[-5,-6]};
const S3={P:{E:[0,0],D:[-7.8,0],A:[-11.4,-3.3],B:[-10.1,-5.3],C:[-6.4,-5.6]}, cn:"E", deg:77, shape:["A","B","C","D"], k:24, cen:[-9,-3.5]};

/* ------------------------------------------------------------------
   Modèles pour le QCM et la fiche d'entraînement
------------------------------------------------------------------ */
/* hexagone régulier ABCDEF (A en haut, sens horaire) de centre O */
const HEX=(()=>{ const P={O:[0,0]}; "ABCDEF".split("").forEach((n,i)=>{ const a=(90-60*i)*Math.PI/180; P[n]=[Math.cos(a),Math.sin(a)]; }); return P; })();
const HEXTRI=["OAB","OBC","OCD","ODE","OEF","OFA"];
/* pentagone régulier ABCDE (A en bas à gauche, sens antihoraire) de centre O */
const PEN=(()=>{ const P={O:[0,0]}; "ABCDE".split("").forEach((n,i)=>{ const a=(-126+72*i)*Math.PI/180; P[n]=[Math.cos(a),Math.sin(a)]; }); return P; })();
/* pavage carré : ABCD de centre M (A en haut), EHGF milieux, I J K L */
const PAV={M:[0,0],A:[0,2],B:[-2,0],C:[0,-2],D:[2,0],E:[-1,1],H:[1,1],G:[1,-1],F:[-1,-1],I:[0,1],J:[-1,0],L:[1,0],K:[0,-1]};
const PAVTRI=["AEI","AIH","BEJ","BJF","CFK","CKG","DHL","DLG","MEI","MIH","MHL","MLG","MGK","MKF","MFJ","MJE"];
const nameOf=(P,p)=>Object.keys(P).find(n=>V.d(P[n],p)<1e-6);
/* image d'un triangle (nom) par la transformation T dans le modèle P ; null si elle sort de la figure */
const imgTri=(P,t,T)=>{ const r=t.split("").map(n=>nameOf(P,T(P[n]))); return r.every(Boolean)?r.join(""):null; };
const sameSet=(a,b)=>[...a].sort().join("")===[...b].sort().join("");
function hexSVG(w=220, circ=true){ const P=HEX; return geo({P, k:w/2.6, pad:26, circ:circ?[["O",1,"ln"]]:[], poly:[["ABCDEF".split(""),"ln"]], seg:"ABCDEF".split("").map(n=>["O",n,"thin"]), lab:Object.keys(P), cen:[0,0], off:{O:[14,14]}, alt:"Hexagone régulier ABCDEF de centre O"}); }
function penSVG(w=200){ const P=PEN; return geo({P, k:w/2.6, pad:26, poly:[["ABCDE".split(""),"ln"]], seg:"ABCDE".split("").map(n=>["O",n,"thin"]), lab:Object.keys(P), cen:[0,0], off:{O:[0,-12]}, alt:"Pentagone régulier ABCDE de centre O"}); }
function pavSVG(w=230){ const P=PAV; return geo({P, k:w/4.8, pad:24, poly:[[["A","B","C","D"],"ln"],[["E","H","G","F"],"ln"]], seg:[["A","C","thin"],["B","D","thin"],["E","G","thin"],["H","F","thin"]], lab:Object.keys(P), cen:[0.01,0.02],
  off:{M:[14,-6],I:[10,-8],J:[-8,-10],L:[10,-10],K:[10,14]}, alt:"Pavage du carré ABCD"}); }
/* questions générées dans l'hexagone */
const HEXTR=()=>{ const pts="OABCDEF".split("");
  for(let g=0;g<500;g++){ const kind=pick(["tr","tr","sym","axe","rot"]), t=pick(HEXTRI.map(x=>shuf(x.split("")).join("")));
    let T, txt, ex;
    if(kind==="tr"){ const a=pick(pts), b=pick(pts); if(a===b) continue; T=p=>V.tr(p,HEX[a],HEX[b]); txt=Math.random()<0.5?`la translation qui transforme ${a} en ${b}`:`la translation de vecteur ${vec(a+b)}`; ex="La figure glisse : chaque point se déplace comme "+a+" va vers "+b+"."; }
    else if(kind==="sym"){ T=p=>V.sym(p,HEX.O); txt="la symétrie de centre O"; ex="Chaque sommet est envoyé sur le sommet opposé (demi-tour autour de O)."; }
    else if(kind==="axe"){ const a=pick("ABCDEF".split("")); T=p=>V.refl(p,HEX.O,HEX[a]); txt=`la symétrie d'axe (O${a})`; ex=`On plie la figure suivant la droite (O${a}).`; }
    else { const n=ri(1,2), s=pick([1,-1]); T=p=>V.rot(p,HEX.O,s*60*n); txt=`la rotation de centre O, d'angle ${60*n}° dans le sens ${s>0?"antihoraire":"horaire"}`; ex=`L'angle entre deux sommets voisins est 360° ÷ 6 = 60°. On tourne de ${n} cran${n>1?"s":""}.`; }
    const r=imgTri(HEX,t,T); if(!r||sameSet(r,t)||!HEXTRI.some(x=>sameSet(x,r))) continue;
    const bad=shuf(HEXTRI.filter(x=>!sameSet(x,r)&&!sameSet(x,t))).slice(0,2).map(x=>shuf(x.split("")).join(""));
    return {q:`Dans l'hexagone régulier ABCDEF de centre O, quelle est l'image du triangle ${t} par ${txt} ?`, c:shuf(uniq(r,[...bad, t])), rep:r, ex:ex+` ${t.split("").map((n,i)=>n+" → "+r[i]).join(" ; ")}.`};
  } return {q:"Dans l'hexagone régulier ABCDEF de centre O, quelle est l'image du triangle AFO par la translation qui transforme A en B ?", c:["BOC","AFO","DEO"], rep:"BOC", ex:"A → B ; F → O ; O → C."};
};
const PENTR=()=>{ const t=pick(["OAB","OBC","OCD","ODE","OEA"]), n=ri(1,4), s=pick([1,-1]), T=p=>V.rot(p,PEN.O,s*72*n), r=imgTri(PEN,t,T);
  const bad=shuf(["OAB","OBC","OCD","ODE","OEA"].filter(x=>!sameSet(x,r))).slice(0,2);
  return {q:`Le pentagone régulier ABCDE de centre O est composé de 5 triangles isocèles égaux. Quelle est l'image du triangle ${t} par la rotation de centre O, d'angle ${72*n}° dans le sens ${s>0?"antihoraire":"horaire"} ?`, c:shuf(uniq(r,bad)), rep:r, ex:`360° ÷ 5 = 72° : on tourne de ${n} cran${n>1?"s":""}. ${t.split("").map((x,i)=>x+" → "+r[i]).join(" ; ")}.`}; };
const PAVTR=()=>{ for(let g=0;g<500;g++){ const t=pick(PAVTRI), kind=pick(["axe","axe","tr","rot","sym"]); let T, txt;
    if(kind==="axe"){ const ax=pick([["B","D"],["A","C"],["E","G"],["H","F"]]); T=p=>V.refl(p,PAV[ax[0]],PAV[ax[1]]); txt=`la symétrie d'axe (${ax.join("")})`; }
    else if(kind==="tr"){ const [a,b]=pick([["E","B"],["I","M"],["M","L"],["J","M"],["E","I"],["F","K"],["H","L"],["M","K"],["A","H"],["G","D"],["E","A"],["K","G"]]); T=p=>V.tr(p,PAV[a],PAV[b]); txt=`la translation qui transforme ${a} en ${b}`; }
    else if(kind==="sym"){ T=p=>V.sym(p,PAV.M); txt="la symétrie de centre M"; }
    else { const s=pick([1,-1]); T=p=>V.rot(p,PAV.M,90*s); txt=`la rotation de centre M, d'angle 90° dans le sens ${s>0?"antihoraire":"horaire"}`; }
    const r=imgTri(PAV,t,T); if(!r||sameSet(r,t)||!PAVTRI.some(x=>sameSet(x,r))) continue;
    const bad=shuf(PAVTRI.filter(x=>!sameSet(x,r)&&!sameSet(x,t))).slice(0,2);
    return {t, r, txt, q:`Quelle est l'image du triangle ${t} par ${txt} ?`, c:shuf(uniq(r,[...bad,t])), ex:`${t.split("").map((x,i)=>x+" → "+r[i]).join(" ; ")}.`}; }
  return {t:"BEJ", r:"BFJ", txt:"la symétrie d'axe (BD)", q:"Quelle est l'image du triangle BEJ par la symétrie d'axe (BD) ?", c:["BFJ","AEI","MJE"], ex:"B → B ; E → F ; J → J."}; };
/* rosace de n motifs numérotés dans le sens horaire (motif 1 en haut à droite) */
function rosace(n, w=230){ const R=1, r1=0.5, k=w/2.4, cx=w/2, cy=w/2, d=180/n, f=v=>v.toFixed(1); let s=`<svg class="fig" viewBox="0 0 ${w} ${w}" width="${w}" role="img" aria-label="Rosace de ${n} motifs numérotés">`;
  const P=(a,r)=>[cx+k*r*Math.cos(a*Math.PI/180), cy-k*r*Math.sin(a*Math.PI/180)];
  for(let i=1;i<=n;i++){ const th=90-(i-0.5)*360/n, L=P(th+d,r1), T=P(th,R), Rr=P(th-d,r1);
    s+=`<polygon points="${cx},${cy} ${f(L[0])},${f(L[1])} ${f(T[0])},${f(T[1])}" style="fill:#e8458b;stroke:#7a1f47;stroke-width:1.2"/><polygon points="${cx},${cy} ${f(T[0])},${f(T[1])} ${f(Rr[0])},${f(Rr[1])}" style="fill:#f7b6d2;stroke:#7a1f47;stroke-width:1.2"/>`;
    const q=P(th,0.62); s+=`<text x="${f(q[0])}" y="${f(q[1]+6)}" text-anchor="middle" style="font-weight:700;font-size:16px;fill:#1a1a1a">${i}</text>`; }
  return s+`<text x="${cx+12}" y="${cy+18}" text-anchor="middle" style="font-weight:700;font-size:15px;fill:#1a1a1a">R</text></svg>`; }
const mod=(a,n)=>((a-1)%n+n)%n+1;
const ROSQ=()=>{ const n=pick([5,6,8,10,12]), a=360/n, i=ri(1,n), kind=pick(["rot","rot","angle", ...(n%2?[]:["sym"])]);
  if(kind==="angle"){ const j=mod(i+1,n); return {q:"Cette rosace a été créée en reproduisant le motif 1 par rotations successives de centre R. Quelle rotation permet de passer du motif "+i+" au motif "+j+" ?", fig:rosace(n,200), c:shuf(uniq(`angle ${F(a)}°, sens horaire`,[`angle ${F(a)}°, sens antihoraire`,`angle ${F(2*a)}°, sens horaire`,`angle ${n}°, sens horaire`])), rep:`angle ${F(a)}°, sens horaire`, ex:`Il y a ${n} motifs : 360° ÷ ${n} = ${F(a)}°. Les numéros augmentent dans le sens des aiguilles d'une montre.`}; }
  if(kind==="sym"){ const j=mod(i+n/2,n); return {q:`Quelle est l'image du motif ${i} par la symétrie de centre R ?`, fig:rosace(n,200), c:shuf(uniq(String(j),[String(mod(i+1,n)),String(mod(i-1,n)),String(mod(i+n/2+1,n))])), rep:String(j), ex:`La symétrie de centre R est un demi-tour (180°) : 180° ÷ ${F(a)}° = ${n/2} crans.`}; }
  const m=ri(1,Math.min(4,n-1)), s=pick([1,-1]), j=mod(i+s*m,n);
  return {q:`Quelle est l'image du motif ${i} par la rotation de centre R, d'angle ${F(m*a)}° dans le sens ${s>0?"horaire":"antihoraire"} ?`, fig:rosace(n,200), c:shuf(uniq(String(j),[String(mod(i-s*m,n)),String(mod(i+s*(m+1),n)),String(mod(i+s,n))])), rep:String(j), ex:`360° ÷ ${n} = ${F(a)}° entre deux motifs voisins. ${F(m*a)}° ÷ ${F(a)}° = ${m} cran${m>1?"s":""} dans le sens ${s>0?"horaire":"antihoraire"}.`}; };
/* drapeau transformé au hasard (QCM) */
const FLAGQ=()=>{ const kind=pick(["axe","centre","trans","rot"]); let T, rep, ex, grid=[0,-1,16,12], K=[2,5];
  if(kind==="axe"){ const c=ri(7,9); T=p=>[2*c-p[0],p[1]]; rep="une symétrie axiale"; ex="La figure est retournée : on peut la plier suivant une droite verticale."; grid=[0,0,2*c,10]; K=[1,5]; }
  else if(kind==="centre"){ T=p=>[16-p[0],17-p[1]]; rep="une symétrie centrale"; ex="La figure a fait un demi-tour : le mât est maintenant en haut, à droite."; grid=[0,-1,16,18]; K=[1,4]; }
  else if(kind==="trans"){ const dx=ri(7,10), dy=pick([-3,-2,0,2,3]); T=p=>[p[0]+dx,p[1]+dy]; rep="une translation"; ex=`La figure a glissé sans tourner (${dx} carreaux vers la droite${dy?`, ${Math.abs(dy)} vers le ${dy>0?"haut":"bas"}`:""}).`; grid=[0,Math.min(-1,-1+dy),dx+7,Math.max(9,9+dy)]; K=[1,4]; }
  else { const s=pick([1,-1]); const C=[9,4]; T=p=>V.rot(p,C,90*s); rep="une rotation"; ex=`La figure a tourné d'un quart de tour (90°) dans le sens ${s>0?"antihoraire":"horaire"}, sans être retournée.`; K=[9,8]; grid=s>0?[0,-1,15,13]:[3,-2,19,13]; }
  return {q:"La figure 2 est l'image de la figure 1 par…", fig:flags(K,T,grid,false), c:["une symétrie axiale","une symétrie centrale","une translation","une rotation"], rep, ex}; };

/* ===================== schémas ===================== */
const S_TR=sch("Les quatre transformations", `<p class="schN"><b>Symétrie axiale</b> : on plie suivant une droite (l'axe).</p><p class="schN"><b>Symétrie centrale</b> : demi-tour (180°) autour d'un point (le centre).</p><p class="schN"><b>Translation</b> : on fait glisser selon une flèche (le vecteur).</p><p class="schN"><b>Rotation</b> : on fait tourner autour d'un point (le centre), d'un angle, dans un sens.</p>`);
const S_SYM=sch("Tracer M' par symétrie", `<div class="figs">${fig("axe (d)",co("ax2","Symétrie axiale",150))}${fig("centre O",co("ce2","Symétrie centrale",150))}</div><p class="schN">Axiale : (d) coupe [MM'] perpendiculairement en son milieu.</p><p class="schN">Centrale : M, O et M' sont alignés et OM = OM'.</p>`);
const S_TRA=sch("Tracer M' par translation", `${co("tr2","Translation qui transforme A en B",170)}<p class="schN">(AB) // (MM'), AB = MM' et le sens de A vers B est le même que de M vers M'.</p>`);
const S_ROT=sch("Tracer M' par rotation", `${co("ro2","Rotation de centre O d'angle 60°",150)}<p class="schN">${ang("MOM'")} = 60° dans le sens donné et OM = OM'. On utilise le rapporteur et le compas.</p>`);
const S_HEX=sch("Repérer des images dans une figure", `${hexSVG(170)}<p class="schN">On cherche l'image de chaque sommet, un par un, puis on écrit le nom de la figure obtenue dans le même ordre.</p><p class="schN">Hexagone : 360° ÷ 6 = 60° entre deux sommets voisins.</p>`);
const S_ROS=sch("Rosaces", `${rosace(6,150)}<p class="schN">n motifs : angle entre deux motifs voisins = 360° ÷ n.</p><p class="schN">Ici : 360° ÷ 6 = 60°. La symétrie de centre R est la rotation de 180°.</p>`);

window.G3k2={V, geo, F, ang, fig, vec, pr, flags, rotFig, HEX, HEXTRI, PEN, PAV, PAVTRI, imgTri, sameSet, nameOf, HEXTR, PENTR, PAVTR, ROSQ, rosace, hexSVG, penSVG, pavSVG, mod};

CH["3e-2"] = {
intro:"Reconnaître et construire l'image d'une figure par une symétrie axiale, une symétrie centrale, une translation et une rotation, puis retrouver des images dans des rosaces et des pavages.",
savoir:[
  "reconnaître une symétrie axiale, une symétrie centrale, une translation et une rotation, et donner leurs caractéristiques ;",
  "construire l'image d'une figure par symétrie axiale, par symétrie centrale et par translation (avec et sans quadrillage) ;",
  "construire l'image d'une figure par une rotation (rapporteur et compas) ;",
  "retrouver l'image d'une figure par une transformation dans une rosace ou un pavage."
],

/* ===================== COURS ===================== */
cours:[
{k:"1", t:"Les quatre transformations du plan", h:`
  <h4>La symétrie axiale</h4>
  <div class="retenir" data-l="Définition"><p>Deux figures sont <b>symétriques par rapport à une droite</b> lorsque, <b>en pliant suivant cette droite</b>, les deux figures se superposent.</p><p><b>Caractéristique :</b> une droite, appelée « <b>axe de symétrie</b> ».</p></div>
  <div class="figs">${co("ax1","Figure F et droite (d)",110)}<p>→</p>${co("ax2","La figure F' est le symétrique de F par rapport à (d)",150)}</div>
  <p>La figure F' est le symétrique de la figure F <b>par rapport à la droite (d)</b>.</p>
  <div class="retenir" data-l="Méthode"><p>Pour tracer le point M', il faut que :</p><ul><li>la droite (d) coupe [MM'] perpendiculairement en son milieu.</li></ul></div>
  <h4>La symétrie centrale</h4>
  <div class="retenir" data-l="Définition"><p>Transformer une figure par symétrie centrale, <b>c'est la faire tourner d'un demi-tour (180°) autour d'un point</b>.</p><p><b>Caractéristique :</b> un point, appelé « <b>centre de symétrie</b> ».</p></div>
  <div class="figs">${co("ce1","Figure F et point O",100)}<p>→</p>${co("ce2","La figure F' est le symétrique de F par rapport au point O",190)}</div>
  <p>La figure F' est le symétrique de la figure F <b>par rapport au point O</b>.</p>
  <div class="retenir" data-l="Méthode"><p>Pour tracer le point M', il faut que :</p><ul><li>M, O et M' soient alignés ;</li><li>et OM = OM'.</li></ul></div>
  <h4>La translation</h4>
  <div class="retenir" data-l="Définition"><p>Transformer une figure par translation, <b>c'est la faire glisser selon une direction, un sens et une longueur donnés</b> (selon une flèche).</p><p><b>Caractéristique :</b> une flèche, appelée « <b>vecteur</b> ».</p></div>
  <div class="figs">${co("tr1","Figure F et flèche de A vers B",120)}<p>→</p>${co("tr2","La figure F' est l'image de F par la translation qui transforme A en B",190)}</div>
  <p>La figure F' est l'image de la figure F par la translation <b>qui transforme A en B</b>.</p><p>Ou : la figure F' est l'image de la figure F par la translation <b>de vecteur ${vec("AB")}</b>.</p>
  <div class="retenir" data-l="Méthode"><p>Pour tracer le point M', il faut que :</p><ul><li>(AB) // (MM') ;</li><li>AB = MM' ;</li><li>et le sens de A vers B soit le même que de M vers M'.</li></ul></div>
  <div class="anim" data-anim="3e2-translation-compas"></div>
  <h4>La rotation</h4>
  <div class="retenir" data-l="Définition"><p>Transformer une figure par rotation, <b>c'est la faire tourner autour d'un point, selon un angle et un sens donnés</b>.</p><p><b>Caractéristiques :</b></p><ul><li>un point, appelé « <b>centre de rotation</b> » ;</li><li>un <b>angle</b> ;</li><li>un <b>sens</b> (sens horaire ou sens antihoraire).</li></ul></div>
  <div class="figs">${co("ro2","Figure F et point O",110)}<p>→</p>${co("ro1","La figure F' est l'image de F par la rotation de centre O, d'angle 60° dans le sens antihoraire",170)}</div>
  <p>La figure F' est l'image de la figure F par la rotation <b>de centre O, d'angle 60° dans le sens antihoraire</b>.</p>
  <div class="retenir" data-l="Méthode"><p>Pour tracer le point M', il faut que :</p><ul><li>${ang("MOM'")} = 60° dans le sens antihoraire ;</li><li>et OM = OM'.</li></ul></div>`},
{k:"2", t:"Construire l'image d'une figure par rotation", h:`
  <p><b>Méthode :</b> construire l'image du triangle ABC par la rotation de centre C, d'angle 70° dans le sens antihoraire.</p>
  <div class="figs">${co("abc","Le triangle ABC de départ",110)}</div>
  ${co("meth","Les trois étapes de la construction",620)}
  <div class="retenir" data-l="Méthode"><p><b>①</b> On construit, à l'aide du rapporteur et du compas, l'image A' du point A : ${ang("ACA'")} = 70° dans le sens antihoraire et CA' = CA.</p><p><b>②</b> On construit de façon analogue l'image B' du point B : ${ang("BCB'")} = 70° et CB' = CB.</p><p><b>③</b> Le triangle A'B'C est l'image du triangle ABC (le centre C est sa propre image).</p></div>
  <div class="anim" data-anim="3e2-rotation-rapporteur"></div>
  <p>Quand <b>le centre de rotation n'appartient pas à la figure</b> :</p>
  ${co("rotO","Rotation de centre O d'angle 70° : la figure F et son image F'",330)}
  <p>Ici, la figure F' est l'image de la figure F par la rotation de centre O, d'angle 70° dans le sens antihoraire.</p>`},
{k:"3", t:"Les transformations dans des rosaces et des pavages", h:`
  <p><b>Exercice (Brevet, Amérique du Nord 2021) :</b></p>
  <div class="figs">${co("brevet","La figure obtenue avec les carrés numérotés de 1 à 8",270)}</div>
  <p>On a construit un carré ABCD.</p><p>On a construit le point O sur la droite (DB), à l'extérieur du segment [DB] et tel que OB = AB.</p><p>Le point H est le symétrique de D par rapport à O.</p><p>On a obtenu la figure ci-dessus en utilisant plusieurs fois la même rotation de centre O et d'angle 45°.</p><p>La figure obtenue est symétrique par rapport à l'axe (DB) et par rapport au point O.</p><p>Aucune justification n'est demandée.</p>
  <p><b>a)</b> Donner deux carrés différents, images l'un de l'autre par la symétrie axiale d'axe (DB).</p><p><b>b)</b> Le carré 3 est-il l'image du carré 8 par la symétrie centrale de centre O ?</p><p><b>c)</b> On considère la rotation de centre O qui transforme le carré 1 en le carré 2. Quelle est l'image du carré 8 par cette rotation ?</p><p><b>d)</b> On considère la rotation de centre O qui transforme le carré 2 en le carré 5. Préciser l'image du segment [EF] par cette rotation.</p>
  <details><summary>Voir la correction</summary><div class="corr"><p><b>a)</b> Les carrés 2 et 8 (ou 3 et 7, ou 4 et 6).</p><p><b>b)</b> Non : l'image du carré 8 par la symétrie de centre O est le carré 4.</p><p><b>c)</b> Cette rotation fait tourner de 45° dans le sens horaire : l'image du carré 8 est le carré 1.</p><p><b>d)</b> Cette rotation fait tourner de 3 × 45° = 135° dans le sens horaire : l'image du segment [EF] est le segment [HI].</p></div></details>
  <div class="retenir" data-l="À retenir"><p>Dans une rosace de n motifs obtenue par rotations successives, l'angle entre deux motifs voisins est 360° ÷ n.</p><p>Pour trouver l'image d'une figure, on cherche l'image de chaque sommet, puis on écrit le nom de la figure image dans le même ordre.</p></div>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Reconnaître une transformation", e:[
  {n:"Activité 1", t:"Différentes transformations du plan", w:"Sur ta feuille", h:`<p>Dans chaque cas, la figure 2 est l'image de la figure 1 par une transformation.</p><p>Au crayon de bois, indique la transformation et ses caractéristiques.</p>
   <div class="figs">${A1.map((x,i)=>fig("Transformation "+(i+1),A1fig(i,false))).join("")}</div>`,
   c:`<div class="figs">${A1.map((x,i)=>fig("Transformation "+(i+1),A1fig(i,true))).join("")}</div>${A1.map((x,i)=>`<p><b>Transformation ${i+1} :</b> ${x.rep}</p>`).join("")}`}
 ]},
{t:"Symétries et translation (rappels)", e:[
  {n:"Exercice 1", t:"Constructions d'images par symétrie et translation", w:"Sur ta feuille", h:`<div class="attention"><b>CONSIGNES :</b> pour les constructions avec quadrillage, ne laisse pas les traits de construction. Pour les constructions sans quadrillage, laisse les traits de construction.</div>
   <p><b>Symétrie axiale :</b> dans les deux cas, trace le symétrique du triangle DEC par rapport à la droite <b style="color:#c0392b">(d)</b> (l'axe de symétrie, en rouge). Tu le nommeras D'E'C'.</p><div class="figs">${ex1Axial(true,false)}${ex1Axial(false,false)}</div>
   <p><b>Symétrie centrale :</b> dans les deux cas, trace le symétrique du triangle DEC par rapport au point <b style="color:#1e5aa8">F</b> (le centre de symétrie, en bleu). Tu le nommeras D'E'C'.</p><div class="figs">${ex1Central(true,false)}${ex1Central(false,false)}</div>
   <p><b>Translation :</b> dans les deux cas, trace l'image du triangle DEC par la translation qui transforme H en I. Tu la nommeras D'E'C'.</p><div class="figs">${ex1Trans(true,false)}${ex1Trans(false,false)}</div>`,
   c:`<p><b>Symétrie axiale :</b> (d) coupe [DD'], [EE'] et [CC'] perpendiculairement en leur milieu. Sur le quadrillage, (d) suit les diagonales des carreaux : on compte les diagonales de chaque côté de (d).</p><div class="figs">${ex1Axial(true,true)}${ex1Axial(false,true)}</div>
   <p><b>Symétrie centrale :</b> F est le milieu de [DD'], de [EE'] et de [CC']. Sur le quadrillage : pour aller de E à F, on descend de 2 carreaux, donc on descend encore de 2 carreaux pour placer E'.</p><div class="figs">${ex1Central(true,true)}${ex1Central(false,true)}</div>
   <p><b>Translation :</b> pour aller de H à I, on se déplace de 4 carreaux vers la droite et de 1 carreau vers le bas. On fait le même déplacement à partir de D, de E et de C. Sans quadrillage : (HI) // (DD') et HI = DD' (on peut tracer le parallélogramme HIDD'), de même pour E et C.</p><div class="figs">${ex1Trans(true,true)}${ex1Trans(false,true)}</div>`}
 ]},
{t:"Construire l'image d'une figure par rotation", e:[
  {n:"Activité 2", t:"Construire l'image d'une figure par rotation", w:"Sur ta feuille", h:`<p><b>1)</b> Trace l'image de ABC par la rotation de centre A, d'angle 90° dans le sens antihoraire. Nomme-la A'B'C'.</p>${rotFig(R1)}
   <p><b>2)</b> Trace l'image de ABC par la rotation de centre A, d'angle 70° dans le sens antihoraire. Nomme-la A'B'C'. <i>Laisse les traits de construction.</i></p>${rotFig(R2)}
   <p><b>3)</b> Trace l'image du triangle BCD par la rotation de centre A, d'angle 142° dans le sens horaire. Nomme-la B'C'D'.</p>${rotFig(R3)}`,
   c:`<p><b>1)</b> A est le centre : il ne bouge pas (A' = A). [AB] est vertical vers le bas : en tournant d'un quart de tour dans le sens antihoraire, [AB'] est horizontal vers la droite, avec AB' = AB = 3 carreaux. De même, C' est à 3 carreaux à droite et 2 carreaux au-dessus de A.</p>${rotFig({...R1, show:true})}
   <p><b>2)</b> Avec le rapporteur : ${ang("BAB'")} = 70° dans le sens antihoraire. Avec le compas : AB' = AB. De même pour C : ${ang("CAC'")} = 70° et AC' = AC.</p>${rotFig({...R2, show:true})}
   <p><b>3)</b> Pour chaque sommet M du triangle : ${ang("MAM'")} = 142° dans le sens horaire (rapporteur) et AM' = AM (compas).</p>${rotFig({...R3, show:true})}`},
  {n:"Exercice 2", t:"Construire une image par rotation sur feuille blanche", w:"Sur ta feuille", h:`<p><b>1)</b> Construis l'image du triangle ABC par la rotation de centre C, d'angle 102° dans le sens horaire. Nomme-la A'B'C'.</p>${rotFig(S1)}
   <p><b>2)</b> Construis l'image du triangle ABC par la rotation de centre D, d'angle 84° dans le sens antihoraire. Nomme-la A'B'C'.</p>${rotFig(S2)}
   <p><b>3)</b> Construis l'image du quadrilatère ABCD par la rotation de centre E, d'angle 77° dans le sens antihoraire. Nomme-la A'B'C'D'.</p>${rotFig(S3)}`,
   c:`<p>Pour chaque sommet M de la figure : on trace la demi-droite [OM') qui fait avec [OM) l'angle demandé, dans le bon sens (rapporteur), puis on reporte la longueur OM (compas). O est le centre de la rotation.</p>
   <p><b>1)</b> C est le centre : C' = C. ${ang("ACA'")} = ${ang("BCB'")} = 102° dans le sens horaire.</p>${rotFig({...S1, show:true})}
   <p><b>2)</b> ${ang("ADA'")} = ${ang("BDB'")} = ${ang("CDC'")} = 84° dans le sens antihoraire, et DA' = DA, DB' = DB, DC' = DC.</p>${rotFig({...S2, show:true})}
   <p><b>3)</b> ${ang("AEA'")} = ${ang("BEB'")} = ${ang("CEC'")} = ${ang("DED'")} = 77° dans le sens antihoraire, et EA' = EA, EB' = EB, EC' = EC, ED' = ED.</p>${rotFig({...S3, show:true})}`}
 ]},
{t:"Repérer des images dans des rosaces et des pavages", e:[
  {n:"Activité 3", t:"Repérer des images", w:"Sur ta feuille", h:`<p><b>Cas n°1 :</b> cette rosace a été créée en reproduisant le motif 1 par rotations successives.</p>${ex("rosace","Rosace de 6 motifs numérotés de 1 à 6 autour du point R",190)}
   <p>La rotation qui permet de passer <b>du motif 1 au motif 2</b> est la rotation de centre R, d'angle ……… dans le sens ……………</p>
   <p><b>Cas n°2 :</b> le pentagone ABCDE est composé de 5 triangles isocèles égaux.</p>${ex("penta","Pentagone ABCDE de centre O",200)}
   <p>Par quelle transformation passe-t-on <b>du triangle DOC au triangle COB</b> ?</p>
   <p><b>Cas n°3 :</b> l'hexagone ABCDEF est composé de six triangles équilatéraux.</p>${ex("hexa","Hexagone ABCDEF de centre O",230)}
   <p><b>a)</b> L'image du triangle AFO par la translation qui transforme A en B est ………</p><p><b>b)</b> L'image du triangle ABO par la translation de vecteur ${vec("CD")} est ………</p>`,
   c:`<p><b>Cas n°1 :</b> il y a 6 motifs : 360° ÷ 6 = 60°. On passe du motif 1 au motif 2 par la rotation de centre R, d'angle <b>60°</b> dans le sens <b>horaire</b>.</p>
   <p><b>Cas n°2 :</b> D → C, O → O et C → B. On passe du triangle DOC au triangle COB par la <b>rotation de centre O, d'angle 72° dans le sens horaire</b> (360° ÷ 5 = 72°).</p>
   <p><b>Cas n°3 :</b></p><p><b>a)</b> A → B, F → O et O → C : l'image du triangle AFO est le triangle <b>BOC</b>.</p><p><b>b)</b> A → F, B → O et O → E : l'image du triangle ABO est le triangle <b>FOE</b>.</p>`},
  {n:"Exercice 3", t:"Retrouver les images", w:"Sur ta feuille", h:`<p><b>Cas n°1 :</b> cette rosace a été créée en reproduisant le motif 1 par rotations successives.</p>${ex("rosace","Rosace de 6 motifs numérotés de 1 à 6 autour du point R",190)}
   <p><b>a)</b> L'image du motif 2 par la rotation de centre R, d'angle 120° dans le sens antihoraire est le motif …</p><p><b>b)</b> L'image du motif 4 par la symétrie de centre R est le motif …</p>
   <p><b>Cas n°2 :</b> le pentagone ABCDE est composé de 5 triangles isocèles égaux.</p>${ex("penta","Pentagone ABCDE de centre O",200)}
   <p><b>a)</b> L'image du triangle DOE par la rotation de centre O, d'angle 144° dans le sens horaire est ………</p><p><b>b)</b> L'image du triangle OAB par la symétrie d'axe (OA) est ………</p>
   <p><b>Cas n°3 :</b> l'hexagone ABCDEF est composé de six triangles équilatéraux.</p>${ex("hexa","Hexagone ABCDEF de centre O",230)}
   <p><b>a)</b> L'image du triangle OBC par la translation qui transforme B en O est ………</p><p><b>b)</b> L'image du triangle OED par la translation de vecteur ${vec("CB")} est ………</p><p><b>c)</b> L'image du triangle OEF par la symétrie d'axe (OB) est ………</p>
   <p><b>Cas n°4 :</b> à partir du triangle BEJ, rectangle isocèle en J, on a obtenu le pavage ci-dessous.</p>${ex("pavage","Pavage obtenu à partir du triangle BEJ",230)}
   <p><b>a)</b> Quelle est l'image du triangle BEJ par la symétrie d'axe (BD) ?</p><p><b>b)</b> Quelle est l'image du triangle AMH par la translation qui transforme E en B ?</p><p><b>c)</b> Par quelle transformation passe-t-on du triangle AMH au triangle DMG ?</p>`,
   c:`<p><b>Cas n°1 :</b></p><p><b>a)</b> 120° = 2 × 60° : on tourne de 2 motifs dans le sens antihoraire (2 → 1 → 6). C'est le motif <b>6</b>.</p><p><b>b)</b> La symétrie de centre R est un demi-tour (180° = 3 × 60°). C'est le motif <b>1</b>.</p>
   <p><b>Cas n°2 :</b></p><p><b>a)</b> 144° = 2 × 72° : D → B, O → O et E → C. C'est le triangle <b>BOC</b>.</p><p><b>b)</b> O et A sont sur l'axe : ils ne bougent pas, et B → E. C'est le triangle <b>OAE</b>.</p>
   <p><b>Cas n°3 :</b></p><p><b>a)</b> O → E, B → O et C → D. C'est le triangle <b>EOD</b>.</p><p><b>b)</b> O → A, E → F et D → O. C'est le triangle <b>AFO</b>.</p><p><b>c)</b> O reste fixe, E est sur l'axe (OB) donc il reste fixe, et F → D. C'est le triangle <b>OED</b>.</p>
   <p><b>Cas n°4 :</b></p><p><b>a)</b> B → B, E → F et J → J. C'est le triangle <b>BFJ</b>.</p><p><b>b)</b> A → E, M → F et H → M. C'est le triangle <b>EFM</b>.</p><p><b>c)</b> A → D, M → M et H → G : c'est la <b>rotation de centre M, d'angle 90° dans le sens horaire</b>.</p>`},
  {n:"Exercice 4", t:"Brevet, Amérique du Nord, juin 2019", w:"Sur ta feuille", h:`<p><i>Dans cet exercice, aucune justification n'est attendue.</i></p><p>On considère l'hexagone ABCDEF de centre O représenté ci-dessous.</p>${ex("hexb","Hexagone ABCDEF de centre O",220)}
   <p><b>1)</b> Parmi les propositions suivantes, entoure la figure qui correspond à l'image du quadrilatère CDEO par la symétrie de centre O.</p>
   <div class="scroll"><table class="std"><thead><tr><th>Proposition 1</th><th>Proposition 2</th><th>Proposition 3</th></tr></thead><tbody><tr><td>ABFO</td><td>ABOF</td><td>ABCO</td></tr></tbody></table></div>
   <p><b>2)</b> Quelle est l'image du segment [AO] par la symétrie d'axe (CF) ?</p>
   <p><b>3)</b> On considère la rotation de centre O qui transforme le triangle OAB en le triangle OCD. Quelle est l'image du triangle BOC par cette rotation ?</p>
   <p><b>4)</b> La figure ci-dessous représente un pavage dont le motif de base a la même forme que l'hexagone ci-dessus. On a numéroté certains de ces hexagones.</p>${ex("pavh","Pavage d'hexagones numérotés de 1 à 24",300)}
   <p>Quelle est l'image de l'hexagone 14 par la translation qui transforme l'hexagone 2 en l'hexagone 12 ?</p>`,
   c:`<p><b>1)</b> C → F, D → A, E → B et O → O : l'image de CDEO est FABO, c'est-à-dire <b>ABOF</b> (proposition 2 : mêmes sommets, dans le même ordre autour de la figure).</p>
   <p><b>2)</b> A → E et O → O (O est sur l'axe) : c'est le segment <b>[EO]</b>.</p>
   <p><b>3)</b> Cette rotation envoie A sur C et B sur D : elle fait tourner de 120° dans le sens horaire. B → D, O → O et C → E : c'est le triangle <b>DOE</b>.</p>
   <p><b>4)</b> Pour aller de l'hexagone 2 à l'hexagone 12, on se déplace d'une colonne vers la gauche et de trois demi-hexagones vers le bas. On fait le même déplacement à partir de l'hexagone 14 : c'est l'hexagone <b>19</b>.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Reconnaître une transformation", schema:S_TR, q:{
 1:[ {g:()=>{ const t=pick([["la faisant tourner d'un demi-tour (180°) autour d'un point","une symétrie centrale"],["la faisant glisser selon une direction, un sens et une longueur donnés","une translation"],["la pliant suivant une droite","une symétrie axiale"],["la faisant tourner autour d'un point, selon un angle et un sens donnés","une rotation"]]);
       return {q:`Transformer une figure en ${t[0]}, c'est utiliser…`, c:["une symétrie axiale","une symétrie centrale","une translation","une rotation"], rep:t[1], sx:S_TR}; }} ],
 2:[ {g:()=>({...FLAGQ(), sx:S_TR})} ],
 3:[ {g:()=>{ const t=pick([["une rotation","un centre, un angle et un sens"],["une translation","un vecteur (une flèche)"],["une symétrie axiale","un axe (une droite)"],["une symétrie centrale","un centre (un point)"]]);
       return {q:`Quelles sont les caractéristiques d'${t[0]} ?`, c:["un centre, un angle et un sens","un vecteur (une flèche)","un axe (une droite)","un centre (un point)"], rep:t[1], sx:S_TR}; }},
     {q:"Une symétrie centrale est une rotation particulière. Quel est son angle ?", c:["180°","90°","360°","60°"], rep:"180°", ex:"Une symétrie centrale, c'est un demi-tour : une rotation de 180° (dans un sens ou dans l'autre).", sx:S_TR} ]
}},
{nom:"Symétries", schema:S_SYM, q:{
 1:[ {q:"M' est le symétrique de M par rapport au point O. Que peut-on dire ?", c:["M, O et M' sont alignés et OM = OM'","(MM') est perpendiculaire à O","OM = 2 × OM'"], rep:"M, O et M' sont alignés et OM = OM'", ex:"O est le milieu de [MM'].", sx:S_SYM},
     {q:"M' est le symétrique de M par rapport à la droite (d). Que peut-on dire ?", c:["(d) coupe [MM'] perpendiculairement en son milieu","(d) est parallèle à (MM')","M, M' et un point de (d) sont alignés"], rep:"(d) coupe [MM'] perpendiculairement en son milieu", sx:S_SYM} ],
 2:[ {g:()=>{ let q; do{ q=HEXTR(); }while(!/symétrie/.test(q.q)); return {...q, fig:hexSVG(200), sx:S_HEX}; }} ],
 3:[ {g:()=>{ let q; do{ q=PAVTR(); }while(!/symétrie/.test(q.txt)); return {q:q.q, fig:pavSVG(220), c:q.c, rep:q.r, ex:q.ex, sx:S_SYM}; }} ]
}},
{nom:"Translation", schema:S_TRA, q:{
 1:[ {q:"M' est l'image de M par la translation qui transforme A en B. Laquelle de ces affirmations est fausse ?", c:["(AB) est perpendiculaire à (MM')","(AB) // (MM')","AB = MM'","le sens de A vers B est le même que de M vers M'"], rep:"(AB) est perpendiculaire à (MM')", ex:"Pour une translation : (AB) // (MM'), AB = MM' et même sens.", sx:S_TRA} ],
 2:[ {g:()=>{ let q; do{ q=HEXTR(); }while(!/translation/.test(q.q)); return {...q, fig:hexSVG(200), sx:S_HEX}; }} ],
 3:[ {g:()=>{ let q; do{ q=PAVTR(); }while(!/translation/.test(q.txt)); return {q:q.q, fig:pavSVG(220), c:q.c, rep:q.r, ex:q.ex, sx:S_TRA}; }},
     {g:()=>{ const dx=ri(1,6)*pick([1,-1]), dy=ri(1,5)*pick([1,-1]); const h=x=>`${Math.abs(x)} carreau${Math.abs(x)>1?"x":""}`;
       return {q:`Pour aller de H à I sur un quadrillage, on se déplace de ${h(dx)} vers la ${dx>0?"droite":"gauche"} et de ${h(dy)} vers le ${dy>0?"haut":"bas"}. Comment place-t-on l'image de D par la translation qui transforme H en I ?`, c:shuf(uniq(`${h(dx)} vers la ${dx>0?"droite":"gauche"} et ${h(dy)} vers le ${dy>0?"haut":"bas"} à partir de D`,[`${h(dx)} vers la ${dx>0?"gauche":"droite"} et ${h(dy)} vers le ${dy>0?"bas":"haut"} à partir de D`,`${h(dy)} vers la ${dx>0?"droite":"gauche"} et ${h(dx)} vers le ${dy>0?"haut":"bas"} à partir de D`])), rep:`${h(dx)} vers la ${dx>0?"droite":"gauche"} et ${h(dy)} vers le ${dy>0?"haut":"bas"} à partir de D`, ex:"On fait exactement le même déplacement que de H vers I.", sx:S_TRA}; }} ]
}},
{nom:"Rotation", schema:S_ROT, q:{
 1:[ {g:()=>{ let a; do{ a=ri(25,170); }while(a===90); return {q:`M' est l'image de M par la rotation de centre O, d'angle ${a}° dans le sens antihoraire. Que peut-on dire ?`, c:[`${ang("MOM'")} = ${a}° et OM = OM'`,`${ang("OMM'")} = ${a}° et OM = MM'`,`${ang("MOM'")} = ${180-a}° et OM = OM'`], rep:`${ang("MOM'")} = ${a}° et OM = OM'`, ex:"Le centre O est à la même distance de M et de M', et l'angle de sommet O est l'angle de la rotation.", sx:S_ROT}; }} ],
 2:[ {g:()=>({...PENTR(), fig:penSVG(190), sx:S_ROT})},
     {g:()=>{ let q; do{ q=HEXTR(); }while(!/rotation/.test(q.q)); return {...q, fig:hexSVG(200), sx:S_HEX}; }} ],
 3:[ {g:()=>{ const s=pick([1,-1]), t=pick(["MEI","MIH","MHL","MLG","MGK","MKF","MFJ","MJE"]), r=imgTri(PAV,t,p=>V.rot(p,PAV.M,90*s)); return {q:`Par quelle transformation passe-t-on du triangle ${t} au triangle ${r} ?`, fig:pavSVG(220), c:shuf([`la rotation de centre M, d'angle 90° dans le sens ${s>0?"antihoraire":"horaire"}`,`la rotation de centre M, d'angle 90° dans le sens ${s>0?"horaire":"antihoraire"}`,"la symétrie de centre M"]), rep:`la rotation de centre M, d'angle 90° dans le sens ${s>0?"antihoraire":"horaire"}`, ex:`${t.split("").map((x,i)=>x+" → "+r[i]).join(" ; ")} : un quart de tour autour de M.`, sx:S_ROT}; }} ]
}},
{nom:"Rosaces et pavages", schema:S_ROS, q:{
 1:[ {g:()=>{ const n=pick([5,6,8,9,10,12]); return {q:`Une rosace est formée de ${n} motifs identiques, obtenus par rotations successives de même centre. Quel est l'angle entre deux motifs voisins ?`, c:shuf(uniq(F(360/n)+"°",[F(180/n)+"°",n*10+"°",F(360/(n+1),1)+"°"])), rep:F(360/n)+"°", ex:`360° ÷ ${n} = ${F(360/n)}°.`, sx:S_ROS}; }} ],
 2:[ {g:()=>({...ROSQ(), sx:S_ROS})} ],
 3:[ {g:()=>{ const q=PAVTR(); return {q:q.q, fig:pavSVG(220), c:q.c, rep:q.r, ex:q.ex, sx:S_HEX}; }},
     {g:()=>({...HEXTR(), fig:hexSVG(200), sx:S_HEX})} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
  /* Ex. 1 : quatre drapeaux */
  const E1=[
    {K:[1,4], grid:[0,-1,14,9], T:p=>[p[0]+7,p[1]+1], r:"Translation : la figure glisse de 7 carreaux vers la droite et de 1 carreau vers le haut.", ex:{vec:[[[1,4],[8,5],"#c0392b"]]}},
    {K:[8,6], grid:[6,-4,17,11], T:p=>V.rot(p,[8,2],-90), r:"Rotation de centre O (le bas du mât de la figure 1), d'angle 90° dans le sens horaire.", ex:{x:[[8,2]], txt:[["O",[8,2],-12,14,"fill:#c0392b"]]}},
    {K:[3,8], grid:[0,-7,10,13], T:p=>[p[0],6-p[1]], r:"Symétrie axiale d'axe horizontal <b style=\"color:#c0392b\">(d)</b> (en rouge) : la droite située au milieu des deux mâts.", ex:{line:[[[0,3],[10,3],"rd",0,0]], txt:[["(d)",[10,3],-14,-12,"fill:#c0392b"]]}},
    {K:[1,3], grid:[0,-1,14,16], T:p=>[14-p[0],15-p[1]], r:"Symétrie centrale de centre <b style=\"color:#1e5aa8\">O</b> (en bleu) : la figure fait un demi-tour ; O est le milieu du segment qui relie un point à son image.", ex:{x:[[7,7.5]], xcol:"#1e5aa8", txt:[["O",[7,7.5],12,-12,"fill:#1e5aa8"]]}}
  ];
  /* Ex. 2 : triangle sur quadrillage */
  const P2={A:[1,1],B:[4,2],C:[2,4]};
  const ax2=x=>[10-x[0],x[1]], ce2=x=>V.sym(x,[6,0]), tr2=x=>V.tr(x,[12,5],[11,0]);
  const g2=(show)=>{ const P={...P2, O:[6,0], K:[12,5], L:[11,0]}; const o={P, grid:[-1,-5,13,6], k:24, pad:14, poly:[[["A","B","C"],"orig"]], line:[[[5,-5],[5,6],"r",0,0]], vec:[["K","L"]], x:["A","B","C","O","K","L"], xc:{O:"#1e5aa8"}, labc:{O:"#1e5aa8"}, cen:[3,2], off:{O:[12,12],K:[-10,-10],L:[12,-10]}, txt:[["(d)",[5,6],14,6,"fill:#c0392b"]], alt:"Triangle ABC, droite (d), point O et points K et L"};
    if(show){ const I1={}, I2={}, I3={}; ["A","B","C"].forEach(n=>{ I1[n+"1"]=ax2(P2[n]); I2[n+"2"]=ce2(P2[n]); I3[n+"3"]=tr2(P2[n]); }); Object.assign(P,I1,I2,I3); o.poly.push([Object.keys(I1),"img"],[Object.keys(I2),"img"],[Object.keys(I3),"img"]); o.lab=[...o.x,...Object.keys(I1),...Object.keys(I2),...Object.keys(I3)]; o.labc={O:"#1e5aa8"}; o.lab.slice(6).forEach(n=>o.labc[n]="var(--c)"); o.off={...o.off,A1:[0,16],B1:[-14,0],C1:[0,-12],A2:[0,-12],B2:[0,16],C2:[0,16],A3:[-14,0],B3:[14,0],C3:[0,-12]}; o.name={A1:"A₁",B1:"B₁",C1:"C₁",A2:"A₂",B2:"B₂",C2:"C₂",A3:"A₃",B3:"B₃",C3:"C₃"}; }
    return geo(o); };
  /* Ex. 3 : rotations */
  const Q1={P:{O:[0,0],M:[0,-3],N:[3,-3],R:[3,-1]}, cn:"O", deg:90, shape:["M","N","R"], closed:false, grid:[-1,-4,4,4], k:28, cen:[1.5,-0.5], off:{O:[-10,-10]}};
  const Q2={P:{S:[0,0],T:[4.5,0],U:[2.9*Math.cos(59*Math.PI/180),2.9*Math.sin(59*Math.PI/180)]}, cn:"S", deg:-65, shape:["S","T","U"], k:38, cen:[2,0.8]};
  /* Ex. 4 : rosace de 8 motifs */
  /* Ex. 5 : hexagone */
  return {
  titre:"Évaluation d'entraînement · chapitre 2", duree:50, info:"Durée : 50 min · Calculatrice autorisée · Règle, équerre, compas et rapporteur",
  comp:[
    ["MODÉLISER","Je reconnais une transformation et je donne ses caractéristiques.","Ex. 1 (4 points)"],
    ["REPRÉSENTER","Je construis l'image d'une figure par symétrie axiale, symétrie centrale, translation et rotation.","Ex. 2 et 3 (9 points)"],
    ["RAISONNER","Je retrouve des images dans une rosace et dans un pavage.","Ex. 4 et 5 (7 points)"]
  ],
  exos:[
  {t:"Reconnaître une transformation", p:4, h:`<p>Dans chaque cas, la figure 2 est l'image de la figure 1. Donne la transformation et ses caractéristiques.</p><div class="figs">${E1.map((x,i)=>fig(`Cas ${"abcd"[i]})`,flags(x.K,x.T,x.grid,false))).join("")}</div>`,
   c:`<div class="figs">${E1.map((x,i)=>fig(`Cas ${"abcd"[i]})`,flags(x.K,x.T,x.grid,true,x.ex))).join("")}</div>${E1.map((x,i)=>`<p><b>${"abcd"[i]})</b> ${x.r} <i>(1 point : 0,5 pour la transformation, 0,5 pour ses caractéristiques)</i></p>`).join("")}`},
  {t:"Constructions sur quadrillage", p:5, h:`<p>Sur la figure ci-dessous (à recopier sur ton cahier en respectant les carreaux) :</p><p><b>a)</b> trace le symétrique A₁B₁C₁ du triangle ABC par rapport à la droite <b style="color:#c0392b">(d)</b> (en rouge) ;</p><p><b>b)</b> trace le symétrique A₂B₂C₂ du triangle ABC par rapport au point <b style="color:#1e5aa8">O</b> (en bleu) ;</p><p><b>c)</b> trace l'image A₃B₃C₃ du triangle ABC par la translation qui transforme K en L.</p>${g2(false)}`,
   c:`${g2(true)}<p><b>a)</b> (d) coupe [AA₁], [BB₁] et [CC₁] perpendiculairement en leur milieu : A₁(9 ; 1), B₁(6 ; 2), C₁(8 ; 4) en comptant les carreaux. <i>(1,5 point)</i></p><p><b>b)</b> O est le milieu de [AA₂], [BB₂] et [CC₂]. <i>(1,5 point)</i></p><p><b>c)</b> De K à L : 1 carreau vers la gauche et 5 carreaux vers le bas. On fait le même déplacement à partir de A, B et C. <i>(2 points)</i></p>`},
  {t:"Constructions par rotation", p:4, h:`<p><b>1)</b> Recopie la figure sur ton cahier. Trace l'image de la ligne MNR par la rotation de centre O, d'angle 90° dans le sens antihoraire.</p>${rotFig(Q1)}<p><b>2)</b> Construis un triangle STU tel que ST = 4,5 cm, SU = 2,9 cm et ${ang("TSU")} = 59°. Puis construis son image par la rotation de centre S, d'angle 65° dans le sens horaire. Laisse les traits de construction.</p>`,
   c:`<p><b>1)</b> Chaque point tourne d'un quart de tour autour de O dans le sens antihoraire, à la même distance de O. <i>(2 points)</i></p>${rotFig({...Q1,show:true})}<p><b>2)</b> S est le centre : il ne bouge pas. ${ang("TST'")} = ${ang("USU'")} = 65° dans le sens horaire (rapporteur), ST' = ST et SU' = SU (compas). <i>(1 point pour le triangle, 1 point pour son image)</i></p>${rotFig({...Q2,show:true, off:{S:[-12,6]}})}`},
  {t:"Une rosace", p:4, h:`<p>Cette rosace a été obtenue en reproduisant le motif 1 par rotations successives de centre R.</p>${rosace(8,220)}<p><b>a)</b> Quel est l'angle de la rotation qui transforme le motif 1 en le motif 2 ? Dans quel sens ?</p><p><b>b)</b> Quelle est l'image du motif 3 par la rotation de centre R, d'angle 90° dans le sens horaire ?</p><p><b>c)</b> Quelle est l'image du motif 7 par la symétrie de centre R ?</p><p><b>d)</b> Quelle est l'image du motif 2 par la rotation de centre R, d'angle 135° dans le sens antihoraire ?</p>`,
   c:`<p><b>a)</b> 8 motifs : 360° ÷ 8 = 45°, dans le sens horaire. <i>(1 point)</i></p><p><b>b)</b> 90° = 2 × 45° : 3 → 4 → 5. C'est le motif 5. <i>(1 point)</i></p><p><b>c)</b> 180° = 4 × 45° : 7 → 8 → 1 → 2 → 3. C'est le motif 3. <i>(1 point)</i></p><p><b>d)</b> 135° = 3 × 45°, dans le sens antihoraire : 2 → 1 → 8 → 7. C'est le motif 7. <i>(1 point)</i></p>`},
  {t:"Dans un hexagone", p:3, h:`<p>L'hexagone régulier ABCDEF de centre O est composé de six triangles équilatéraux.</p>${hexSVG(220)}<p><b>a)</b> Quelle est l'image du triangle OCD par la translation qui transforme C en O ?</p><p><b>b)</b> Quelle est l'image du triangle OAB par la symétrie d'axe (AD) ?</p><p><b>c)</b> Quelle est l'image du triangle OBC par la rotation de centre O, d'angle 120° dans le sens horaire ?</p>`,
   c:`<p><b>a)</b> O → F, C → O et D → E : c'est le triangle FOE. <i>(1 point)</i></p><p><b>b)</b> O et A sont sur l'axe (AD) : ils ne bougent pas, et B → F. C'est le triangle OAF. <i>(1 point)</i></p><p><b>c)</b> 120° = 2 × 60° dans le sens horaire : O → O, B → D et C → E. C'est le triangle ODE. <i>(1 point)</i></p>`}
  ]};
})()
};
})();
