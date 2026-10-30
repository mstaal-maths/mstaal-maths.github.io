/* 3e — Chapitre 18 : La réciproque du théorème de Thalès (cours et fiche d'exercices de M. Staal)
   Figures du cours et de la fiche : celles des documents Word (img/3k18co, img/3k18ex).
   Les quatre situations de la « suite de l'activité 1 », la voile (brevet 2011), l'étayage (brevet 2014),
   les figures de référence, du QCM, de l'entraînement et de l'éval sont dessinées en SVG à partir des longueurs. */
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
  (o.x||[]).forEach(n=>{ const p=g(n), x=X(p[0]), y=Y(p[1]); s+=`<path d="M${f(x-5)} ${f(y-5)} L${f(x+5)} ${f(y+5)} M${f(x+5)} ${f(y-5)} L${f(x-5)} ${f(y+5)}" style="stroke:var(--ink);stroke-width:2"/>`; });
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

const co=(p,alt,w)=>img("3k18co/"+p+".png",alt,w), ex=(p,alt,w)=>img("3k18ex/"+p+".png",alt,w);
const Fr=(a,b)=>`{${a}/${b}}`;
const D2R=Math.PI/180;
/* deux droites sécantes en A : sur la 1re (direction a1), des points à des abscisses ; sur la 2e (direction a2) aussi.
   p1 = {nom:abscisse}, p2 = {nom:abscisse} · seg [[n1,n2,style]] · lens {n1n2:"texte"} */
function sec(o){
  const {A="A", a1=0, a2=40, p1, p2, seg=[], lens={}, w=300, alt="Deux droites sécantes"} = o;
  const u=[Math.cos(a1*D2R),Math.sin(a1*D2R)], v=[Math.cos(a2*D2R),Math.sin(a2*D2R)];
  const P={[A]:[0,0]}; Object.entries(p1).forEach(([n,t])=>P[n]=V.mul(u,t)); Object.entries(p2).forEach(([n,t])=>P[n]=V.mul(v,t));
  const ends=(d,vals)=>{ const lo=Math.min(0,...vals)-0.12*Math.max(...vals.map(Math.abs)), hi=Math.max(0,...vals)+0.12*Math.max(...vals.map(Math.abs)); return [V.mul(d,lo),V.mul(d,hi)]; };
  const L1=ends(u,Object.values(p1)), L2=ends(v,Object.values(p2));
  const xs=[...Object.values(P),...L1,...L2].map(p=>p[0]), k=Math.min(40,(w-70)/(Math.max(...xs)-Math.min(...xs)));
  const len=Object.entries(lens).map(([s,t])=>{ const m=s.match(/^([A-Z]['₁]?)([A-Z]['₁]?)$/); return [m[1],m[2],t]; });
  const all=Object.values(P), cen=[all.reduce((a,p)=>a+p[0],0)/all.length+0.01, all.reduce((a,p)=>a+p[1],0)/all.length+0.01];
  return geo({P, k, pad:40, seg:[[L1[0],L1[1],"ln"],[L2[0],L2[1],"ln"],...seg], x:Object.keys(P), lab:Object.keys(P), len, cen, alt});
}
/* conclusion type */
const conc=(o)=>{ const {A,M,B,N,C,am,ab,an,ac,ord=true}=o; const q1=r3(am/ab), q2=r3(an/ac), eq=Math.abs(am/ab-an/ac)<1e-9;
  return {eq, par:eq&&ord, q1, q2}; };

/* les quatre situations de la suite de l'activité 1 */
const SIT=[
  {t:"Situation 1", f:()=>sec({p1:{M:4,B:10}, p2:{N:6,C:15}, a1:38, a2:0, seg:[["M","N","c"],["B","C","c"]], alt:"Situation 1"}), r:`${Fr("AM","AB")} = ${Fr(4,10)} = 0,4 et ${Fr("AN","AC")} = ${Fr(6,15)} = 0,4`, s:"Les droites (MN) et (BC) semblent parallèles."},
  {t:"Situation 2", f:()=>sec({p1:{B:-16,M:8}, p2:{N:6,C:12}, a1:10, a2:58, seg:[["M","N","c"],["B","C","c"]], alt:"Situation 2"}), r:`${Fr("AM","AB")} = ${Fr(8,16)} = 0,5 et ${Fr("AN","AC")} = ${Fr(6,12)} = 0,5`, s:"Les droites (MN) et (BC) ne semblent pas parallèles."},
  {t:"Situation 3", f:()=>sec({p1:{B:-1.5,M:6}, p2:{C:-2,N:8}, a1:32, a2:0, seg:[["M","N","c"],["B","C","c"]], w:340, alt:"Situation 3"}), r:`${Fr("AM","AB")} = ${Fr(6,"1,5")} = 4 et ${Fr("AN","AC")} = ${Fr(8,2)} = 4`, s:"Les droites (MN) et (BC) semblent parallèles."},
  {t:"Situation 4", f:()=>sec({p1:{C:-6,M:4}, p2:{B:-8,N:3}, a1:32, a2:-8, seg:[["M","N","c"],["B","C","c"]], alt:"Situation 4"}), r:`${Fr("AM","AB")} = ${Fr(4,8)} = 0,5 et ${Fr("AN","AC")} = ${Fr(3,6)} = 0,5`, s:"Les droites (MN) et (BC) ne semblent pas parallèles."}
];
const SITL={0:{AM:"4",AB:"10",AN:"6",AC:"15"},1:{AM:"8",AB:"16",AN:"6",AC:"12"},2:{AM:"6",AB:"1,5",AN:"8",AC:"2"},3:{AM:"4",AB:"8",AN:"3",AC:"6"}};
const sitFig=i=>{ const S=SIT[i]; return S.f(); };
const sitTxt=i=>Object.entries(SITL[i]).map(([k,v])=>`${k} = ${v}`).join(" ; ");

/* figures de référence */
const REF1=sec({p1:{M:2.4,B:5}, p2:{N:2.2,C:4.6}, a1:-62, a2:-118, seg:[["M","N","c"],["B","C","c"]], w:220, alt:"Première figure de référence"});
const REF2=sec({p1:{M:-2.2,B:3}, p2:{N:-2.6,C:3.5}, a1:-118, a2:-62, seg:[["M","N","c"],["B","C","c"]], w:220, alt:"Deuxième figure de référence"});

/* voile (brevet 2011) et étayage (brevet 2014) */
const VO=(()=>{ const y=(5.29+17.64-11.56)/8.4, x=Math.sqrt(5.29-y*y); const W=[x,y]; return {P:{P:[0,0],M:[0,4.2],W,C:[0,3.78],T:V.mul(V.unit(W),1.88)}}; })();
const voileSVG=geo({P:VO.P, k:58, pad:40, poly:[[["P","M","W"],"orig"]], seg:[["C","T","cd"]], x:["P","M","W","C","T"], lab:["P","M","W","C","T"], len:[["M","W","MW = 3,40 m"],["P","M","PM = 4,20 m"]], txt:[["PC = 3,78 m",[0,1.9],-48,0,"fill:#1e5aa8;font-size:13px"]], cen:[0.8,1.8], alt:"La voile PMW et la couture [CT]"});
const etaSVG=geo({P:{A:[0,0],B:[0,3.5],E:[-2.625,0],C:[0,1.5],D:[-1.5,1.5]}, k:50, pad:36, poly:[[["A","B","E"],"ln"]], seg:[["C","D","c"]], right:[["A","B","E"]], x:["A","B","C","D","E"], lab:["A","B","C","D","E"], cen:[-1,1.2], alt:"Schéma de l'étayage : triangle ABE rectangle en A et barre [CD]"});

/* tirage pour le QCM / l'entraînement : configuration de Thalès avec des longueurs données, parallèle ou non */
const NM=[["A","M","N","B","C"],["O","R","S","T","U"],["K","L","N","M","O"],["E","F","G","H","I"],["P","Q","R","S","T"]];
function randRec(){
  const conf=pick([1,1,2]), par=Math.random()<0.5, [A,M,N,B,C]=pick(NM);
  const k=pick([0.4,0.5,0.6,0.75,0.25,0.8,0.3]), ab=pick([5,6,8,10,12,7.5,4.5]), ac=pick([4,5,6,8,9,10,7.2]);
  const am=r3(k*ab); let an=r3(k*ac); if(!par) an=r3(an+pick([-1,1])*pick([0.2,0.3,0.4,0.5]));
  return {A,M,N,B,C,conf,par:par||Math.abs(am/ab-an/ac)<1e-9,am,ab,an,ac};
}
const recFig=(R,w=280)=>sec({A:R.A, p1:{[R.M]:R.conf===2?-R.am:R.am,[R.B]:R.ab}, p2:{[R.N]:R.conf===2?-R.an:R.an,[R.C]:R.ac}, a1:0, a2:ri(35,55), seg:[[R.M,R.N,"c"],[R.B,R.C,"c"]], w, alt:"Deux droites sécantes et deux segments"});
const recCorr=(R)=>{ const q1=R.am/R.ab, q2=R.an/R.ac, eq=Math.abs(q1-q2)<1e-9;
  const w=x=>Math.abs(x-r3(x))<1e-9?"=":"≈";
  return `<p>Les points ${R.A}, ${R.M}, ${R.B} d'une part et les points ${R.A}, ${R.N}, ${R.C} d'autre part sont alignés dans le même ordre.</p><p class="calc">${Fr(R.A+R.M,R.A+R.B)} = ${Fr(F(R.am),F(R.ab))} ${w(q1)} ${F(q1)} et ${Fr(R.A+R.N,R.A+R.C)} = ${Fr(F(R.an),F(R.ac))} ${w(q2)} ${F(q2)}</p><p>${eq?`Les quotients sont égaux : d'après la réciproque du théorème de Thalès, <b>(${R.M}${R.N}) // (${R.B}${R.C})</b>.`:`Les quotients ne sont pas égaux : d'après la propriété 2, <b>les droites (${R.M}${R.N}) et (${R.B}${R.C}) ne sont pas parallèles</b>.`}</p>`; };

/* ===================== schémas ===================== */
const S_REC=sch("La réciproque du théorème de Thalès", `<div class="figs">${REF1}${REF2}</div><p class="schN">Si A, M, B et A, N, C sont alignés <b>dans le même ordre</b> et si ${Fr("AM","AB")} = ${Fr("AN","AC")}, alors (MN) // (BC).</p><p class="schN">Si ${Fr("AM","AB")} ≠ ${Fr("AN","AC")}, alors (MN) et (BC) ne sont pas parallèles.</p>`);
const S_ORD=sch("Dans le même ordre", `<p class="schN">Première configuration : M est sur [AB] et N est sur [AC].</p><p class="schN">Deuxième configuration : A est entre M et B, et A est entre N et C.</p><p class="schN">Si l'ordre n'est pas le même, on ne peut pas conclure, même si les quotients sont égaux.</p>`);
const S_DIF=sch("Thalès ou sa réciproque ?", `<p class="schN"><b>Théorème de Thalès</b> : on sait que les droites sont parallèles → on <b>calcule une longueur</b>.</p><p class="schN"><b>Réciproque</b> : on veut savoir si deux droites sont parallèles → on <b>compare deux quotients</b>.</p>`);

CH["3e-18"] = {
intro:"La réciproque du théorème de Thalès permet de prouver que deux droites sont parallèles (ou qu'elles ne le sont pas) en comparant deux quotients de longueurs.",
savoir:[
  "connaître la réciproque du théorème de Thalès et la condition « dans le même ordre » ;",
  "prouver que deux droites sont parallèles en comparant deux quotients ;",
  "prouver que deux droites ne sont pas parallèles ;",
  "savoir choisir entre le théorème de Thalès (calculer une longueur) et sa réciproque (prouver un parallélisme) ;",
  "résoudre des problèmes de brevet qui mélangent Pythagore, Thalès et sa réciproque."
],

/* ===================== COURS ===================== */
cours:[
{k:"1", t:"Deux nouvelles propriétés pour démontrer que deux droites sont parallèles ou non", h:`
  <p>Deux figures de référence :</p><div class="figs">${REF1}${REF2}</div>
  <div class="retenir" data-l="Propriété 1"><p><b>Si</b> on sait que :</p><ul><li>les points A, M et B d'une part et les points A, N et C d'autre part sont alignés <b>dans le même ordre</b> ;</li><li>${Fr("AM","AB")} = ${Fr("AN","AC")} ;</li></ul><p><b>Alors</b> les droites (MN) et (BC) sont parallèles.</p></div>
  <p>La propriété 1 (la <b>réciproque du théorème de Thalès</b>) permet de prouver que deux droites sont parallèles.</p>
  <div class="retenir" data-l="Propriété 2"><p><b>Si</b> on sait que :</p><ul><li>les points A, M et B d'une part et les points A, N et C d'autre part sont alignés dans le même ordre ;</li><li>${Fr("AM","AB")} ≠ ${Fr("AN","AC")} ;</li></ul><p><b>Alors</b> les droites (MN) et (BC) ne sont pas parallèles.</p></div>
  <p>La propriété 2 permet de prouver que deux droites ne sont pas parallèles.</p>`},
{k:"2", t:"Exercices d'application", h:`
  <h4>Application 1</h4><p>Les droites (AB) et (FH) sont-elles parallèles ?</p>${co("app1","G, A, F alignés et G, B, H alignés : GA = 1,9 cm ; GF = 5,7 cm ; GB = 2,1 cm ; BH = 4,2 cm",300)}
  <p><b>Résolution :</b></p><ul><li>Les points G, A et F d'une part et les points G, B et H d'autre part sont alignés <b>dans le même ordre</b> ;</li></ul><p class="calc">${Fr("GA","GF")} = ${Fr("1,9","5,7")} = ${Fr(1,3)} et ${Fr("GB","GH")} = ${Fr("2,1","2,1 + 4,2")} = ${Fr("2,1","6,3")} = ${Fr(1,3)}</p><p>Alors ${Fr("GA","GF")} = ${Fr("GB","GH")}.</p><p>Donc, d'après la réciproque du théorème de Thalès, les droites (AB) et (FH) sont parallèles.</p>
  <h4>Application 2</h4><p>Les droites (BC) et (DE) sont-elles parallèles ?</p>${co("app2","B, A, E alignés et C, A, D alignés : AB = 4,8 cm ; AE = 1,8 cm ; AC = 5 cm ; AD = 2,4 cm",240)}
  <p><b>Résolution :</b></p><ul><li>Les points B, A et E d'une part et les points C, A et D d'autre part sont alignés dans le même ordre ;</li></ul><p class="calc">${Fr("AB","AE")} = ${Fr("4,8","1,8")} = ${Fr(8,3)} et ${Fr("AC","AD")} = ${Fr(5,"2,4")} = ${Fr(25,12)}</p><p>Alors ${Fr("AB","AE")} ≠ ${Fr("AC","AD")} (${Fr(8,3)} = ${Fr(32,12)} ≠ ${Fr(25,12)}).</p><p>Donc, d'après la propriété 2, les droites (BC) et (DE) ne sont pas parallèles.</p>`},
{k:"3", t:"Différence entre le théorème de Thalès et sa réciproque", h:`
  <div class="retenir" data-l="À retenir"><p>On utilise le <b>THÉORÈME DE THALÈS</b> pour <b>calculer une longueur</b> (on sait que deux droites sont parallèles).</p><p>On utilise la <b>RÉCIPROQUE DU THÉORÈME DE THALÈS</b> pour prouver que <b>deux droites sont parallèles</b>.</p></div>
  <p><b>Exemple 1 (théorème de Thalès) :</b> les longueurs sont en cm et on sait que les droites (AB) et (FH) sont parallèles. Calcule la longueur AB (arrondie au centième).</p>${co("thales","GA = 3 ; GF = 11 ; GB = 3,2 ; FH = 8",240)}
  <ul><li>Les points G, A et F sont alignés ;</li><li>les points G, B et H sont alignés ;</li><li>(AB) // (FH).</li></ul><p>Donc, d'après le théorème de Thalès :</p><p class="calc">${Fr("GA","GF")} = ${Fr("GB","GH")} = ${Fr("AB","FH")} donc ${Fr(3,11)} = ${Fr("3,2","GH")} = ${Fr("AB",8)}</p><p class="calc">AB = ${Fr("8 × 3",11)} ≈ 2,18 cm</p>
  <p><b>Exemple 2 (réciproque) :</b> les droites (AB) et (FH) de l'application 1 sont-elles parallèles ? On compare ${Fr("GA","GF")} et ${Fr("GB","GH")} : ils sont égaux à ${Fr(1,3)}, et l'ordre est le même, donc (AB) // (FH).</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Rappel : calculer une longueur", e:[
  {n:"Activité rappel", t:"Calcul d'une longueur", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> sachant que (ED) // (BC), quelle est la longueur du segment [ED] ?</p>${ex("r1","A, E, C alignés et A, D, B alignés : AE = 10,5 cm ; AD = 12 cm ; AB = 15 cm ; BC = 9 cm",340)}
   <p><b>Problème 2 :</b> (UR) // (TS). Calcule UV.</p>${ex("r2","Les droites (UR) et (TS) parallèles ; UR = 4 cm ; VS = 2,4 cm ; TS = 3 cm",230)}`,
   c:`<p><b>Problème 1 :</b> A, E, C sont alignés ; A, D, B sont alignés ; (ED) // (BC). D'après le théorème de Thalès :</p><p class="calc">${Fr("AD","AB")} = ${Fr("AE","AC")} = ${Fr("ED","BC")} donc ${Fr(12,15)} = ${Fr("ED",9)} et ED = ${Fr("12 × 9",15)} = 7,2 cm</p>
   <p><b>Problème 2 :</b> U, V, S sont alignés ; R, V, T sont alignés ; (UR) // (TS). D'après le théorème de Thalès :</p><p class="calc">${Fr("VU","VS")} = ${Fr("VR","VT")} = ${Fr("UR","ST")} donc ${Fr("UV","2,4")} = ${Fr(4,3)} et UV = ${Fr("2,4 × 4",3)} = 3,2 cm</p>`}
 ]},
{t:"Découvrir la réciproque", e:[
  {n:"Activité 1", t:"Prouver si les droites (MN) et (BC) sont parallèles ou non", w:"Sur ta feuille", h:`<p>Dans chaque cas, prouve si les droites sont parallèles ou pas. Les mesures sont en cm.</p><div class="figs">${fig("a)",ex("a1a","AM = 2,5 ; MN = 2 ; AN = 3 ; AB = 10 ; BC = 8 ; AC = 12",280))}${fig("b)",ex("a1b","AM = 4,32 ; MN = 4,56 ; AN = 6,79 ; AB = 10 ; BC = 8 ; AC = 12",280))}</div>
   <p><b>Bilan :</b> complète les deux propriétés.</p><p>Propriété 1 : <b>Si</b> …… <b>alors</b> les droites (MN) et (BC) sont parallèles.</p><p>Propriété 2 : <b>Si</b> …… <b>alors</b> les droites (MN) et (BC) ne sont pas parallèles.</p>`,
   c:`<p><b>a)</b> ${Fr("AM","AB")} = ${Fr("2,5",10)} = 0,25 et ${Fr("AN","AC")} = ${Fr(3,12)} = 0,25 : les quotients sont égaux, les droites (MN) et (BC) sont parallèles.</p>
   <p><b>b)</b> ${Fr("AM","AB")} = ${Fr("4,32",10)} = 0,432 et ${Fr("AN","AC")} = ${Fr("6,79",12)} ≈ 0,566 : les quotients ne sont pas égaux, les droites (MN) et (BC) ne sont pas parallèles.</p>
   <p><b>Bilan :</b> Propriété 1 : si ${Fr("AM","AB")} = ${Fr("AN","AC")}, alors (MN) // (BC). Propriété 2 : si ${Fr("AM","AB")} ≠ ${Fr("AN","AC")}, alors (MN) et (BC) ne sont pas parallèles.</p>`},
  {n:"Activité 2", t:"Réciproque du théorème de Thalès (propriétés complètes)", w:"Sur ta feuille", h:`<p>Nous venons de noter que : si ${Fr("AM","AB")} = ${Fr("AN","AC")}, alors les droites (MN) et (BC) sont parallèles.</p><p>Or, dans les situations 2 et 4, les rapports ${Fr("AM","AB")} et ${Fr("AN","AC")} sont bien égaux, mais les droites ne semblent pas parallèles.</p>
   <div class="figs">${SIT.map((S,i)=>fig(`<b>${S.t}</b> : ${sitTxt(i)}<br>${S.r}<br>${S.s}`,sitFig(i))).join("")}</div>
   <p>Quelle condition doit-on ajouter pour être sûr que les droites sont bien parallèles ?</p><p><b>Bilan :</b> complète l'énoncé de la réciproque du théorème de Thalès : « Si …… et si ${Fr("AM","AB")} = ${Fr("AN","AC")}, alors les droites (MN) et (BC) sont parallèles. »</p>`,
   c:`<p>Dans les situations 1 et 3, les points A, M, B et A, N, C sont dans le même ordre : M est sur [AB] et N est sur [AC] (situation 1), ou A est entre M et B et entre N et C (situation 3).</p><p>Dans la situation 2, A est entre B et M, mais N est entre A et C : l'ordre n'est pas le même.</p><p>Dans la situation 4, M n'est même pas sur la droite (AB) : les points A, M, B ne sont pas alignés.</p>
   <p><b>Condition à ajouter :</b> les points A, M, B d'une part et A, N, C d'autre part doivent être <b>alignés dans le même ordre</b>.</p><p><b>Bilan :</b> si les points A, M, B d'une part et les points A, N, C d'autre part sont alignés dans le même ordre, et si ${Fr("AM","AB")} = ${Fr("AN","AC")}, alors les droites (MN) et (BC) sont parallèles.</p>`}
 ]},
{t:"Utiliser la réciproque", e:[
  {n:"Exercice 1", t:"Droites parallèles ?", w:"Sur ton cahier", h:`<p>Dans chaque situation, les droites (BC) et (MN) sont-elles parallèles ?</p><div class="figs">${fig("Situation n°1 : AB = 10,5 cm ; AN = 12 cm ; AC = 7 cm ; AM = 8 cm",ex("s1","Situation 1",180))}${fig("Situation n°2 : AM = 4 cm ; AN = 4,5 cm ; AB = 7,2 cm ; AC = 6 cm",ex("s2","Situation 2",130))}${fig("Situation n°3 : AB = 7 ; AM = 12 ; AC = 6 ; AN = 9,6 ; BC = 5 ; MN = 8",ex("s3","Situation 3",250))}</div>`,
   c:`<p><b>Situation n°1 :</b> A, B, N et A, C, M sont alignés dans le même ordre.</p><p class="calc">${Fr("AB","AN")} = ${Fr("10,5",12)} = 0,875 et ${Fr("AC","AM")} = ${Fr(7,8)} = 0,875</p><p>Les quotients sont égaux : d'après la réciproque du théorème de Thalès, <b>(BC) // (MN)</b>.</p>
   <p><b>Situation n°2 :</b> M, A, B et N, A, C sont alignés dans le même ordre.</p><p class="calc">${Fr("AM","AB")} = ${Fr(4,"7,2")} = ${Fr(5,9)} ≈ 0,556 et ${Fr("AN","AC")} = ${Fr("4,5",6)} = 0,75</p><p>Les quotients ne sont pas égaux : d'après la propriété 2, <b>(BC) et (MN) ne sont pas parallèles</b>.</p>
   <p><b>Situation n°3 :</b> A, B, M et A, C, N sont alignés dans le même ordre.</p><p class="calc">${Fr("AB","AM")} = ${Fr(7,12)} ≈ 0,583 et ${Fr("AC","AN")} = ${Fr(6,"9,6")} = 0,625</p><p>Les quotients ne sont pas égaux : d'après la propriété 2, <b>(BC) et (MN) ne sont pas parallèles</b>.</p><p>(Les longueurs BC et MN ne servent pas.)</p>`},
  {n:"Exercice 2", t:"Les étagères", w:"Sur ton cahier", h:`${ex("etagere","Chambre mansardée : A, D, B sur le mur (AD = 2 m ; DB = 50 cm), A, E, C sur le toit (AE = 2,40 m ; EC = 70 cm), étagère [DE]",240)}<p>Dans sa chambre mansardée, Justine a installé une étagère (voir le dessin).</p><p>Le mur (AB) et le sol (BC) sont perpendiculaires.</p><p>Justine se demande si cette étagère est parallèle au sol. Peux-tu l'aider ?</p>`,
   c:`<p>A, D, B et A, E, C sont alignés dans le même ordre. AB = 2 + 0,5 = 2,5 m et AC = 2,40 + 0,70 = 3,10 m.</p><p class="calc">${Fr("AD","AB")} = ${Fr(2,"2,5")} = 0,8 et ${Fr("AE","AC")} = ${Fr("2,40","3,10")} ≈ 0,774</p><p>Les quotients ne sont pas égaux : d'après la propriété 2, <b>l'étagère (DE) n'est pas parallèle au sol (BC)</b>.</p>`},
  {n:"Exercice 3", t:"Piano", w:"Sur ton cahier", h:`${ex("piano","Support de piano : E, G, D alignés et F, G, C alignés",300)}<p>Pour ce piano : GE = 48 cm ; GF = 60 cm ; ED = 1,2 m et CF = 1,5 m.</p><p>Le sol est représenté par la droite (CD).</p><p>Le clavier est-il parallèle au sol ?</p>`,
   c:`<p>E, G, D et F, G, C sont alignés dans le même ordre (G est entre les deux). GD = 120 − 48 = 72 cm et GC = 150 − 60 = 90 cm.</p><p class="calc">${Fr("GE","GD")} = ${Fr(48,72)} = ${Fr(2,3)} et ${Fr("GF","GC")} = ${Fr(60,90)} = ${Fr(2,3)}</p><p>Les quotients sont égaux : d'après la réciproque du théorème de Thalès, <b>(EF) // (CD)</b>. Le clavier est parallèle au sol.</p>`},
  {n:"Exercice 4", t:"Le viaduc de Millau (brevet, juin 2016)", w:"Sur ton cahier", h:`<p>Le viaduc de Millau est un pont qui franchit la vallée du Tarn, dans l'Aveyron. Il est constitué de 7 pylônes verticaux équipés chacun de 22 câbles appelés haubans.</p><p>Le schéma, qui n'est pas à l'échelle, représente un pylône et deux de ses haubans.</p>${ex("millau","Pylône [AB], haubans [CD] et [EF], chaussée (AD)",340)}<p>On dispose des informations suivantes : AB = 89 m ; AC = 72 m ; AD = 154 m ; AF = 138,6 m ; CD = 170 m et EC = 7,2 m.</p><p><b>1)</b> Prouver que le pylône est perpendiculaire à la chaussée.</p><p><b>2)</b> Les haubans [CD] et [EF] sont-ils parallèles ?</p><p><b>3)</b> Calculer la mesure de l'angle ${ang("CDA")} formé par le hauban [CD] et la chaussée. Arrondir au degré près.</p>`,
   c:`<p><b>1)</b> Dans le triangle ACD : CD² = 170² = 28 900 et AC² + AD² = 72² + 154² = 5 184 + 23 716 = 28 900. Donc CD² = AC² + AD² : d'après la réciproque du théorème de Pythagore, ACD est rectangle en A. <b>Le pylône est perpendiculaire à la chaussée.</b></p>
   <p><b>2)</b></p><p class="calc">AE = AC − EC<br>AE = 72 − 7,2<br>AE = 64,8 m</p><p>A, E, C et A, F, D sont alignés dans le même ordre.</p><p class="calc">${Fr("AE","AC")} = ${Fr("64,8",72)} = 0,9 et ${Fr("AF","AD")} = ${Fr("138,6",154)} = 0,9</p><p>Les quotients sont égaux : d'après la réciproque du théorème de Thalès, <b>(EF) // (CD)</b>.</p>
   <p><b>3)</b> Dans le triangle ACD rectangle en A : cos ${ang("CDA")} = ${Fr("AD","CD")} = ${Fr(154,170)}, donc ${ang("CDA")} ≈ <b>25°</b>.</p>`},
  {n:"Exercice 5", t:"Réparation d'une voile (brevet, juin 2011)", w:"Sur ton cahier", h:`<p>Un centre nautique souhaite effectuer une réparation sur une voile. La voile a la forme du triangle PMW ci-dessous. On souhaite faire une couture suivant le segment [CT] (en pointillés).</p>${voileSVG}<p><i>Les deux questions sont indépendantes.</i></p><p><b>1)</b> Pour cette question, on considère que la couture (CT) est parallèle à (MW). La quantité de fil nécessaire pour réaliser une couture est le double de la longueur de cette couture. Est-ce que 6 mètres de fil suffiront ?</p><p><b>2)</b> Une fois la couture terminée, on note les mesures suivantes : PT = 1,88 m et PW = 2,30 m. Finalement, la couture réalisée est-elle parallèle à (MW) ?</p>`,
   c:`<p><b>1)</b> P, C, M et P, T, W sont alignés ; (CT) // (MW). D'après le théorème de Thalès :</p><p class="calc">${Fr("PC","PM")} = ${Fr("CT","MW")} donc CT = ${Fr("3,78 × 3,40","4,20")} = 3,06 m</p><p>Il faut 2 × 3,06 = 6,12 m de fil : <b>6 mètres ne suffiront pas</b>.</p>
   <p><b>2)</b> P, C, M et P, T, W sont alignés dans le même ordre.</p><p class="calc">${Fr("PC","PM")} = ${Fr("3,78","4,20")} = 0,9 et ${Fr("PT","PW")} = ${Fr("1,88","2,30")} ≈ 0,817</p><p>Les quotients ne sont pas égaux : d'après la propriété 2, <b>la couture n'est pas parallèle à (MW)</b>.</p>`},
  {n:"Exercice 6", t:"Construction de mur (brevet, juin 2014)", w:"Sur ton cahier", h:`<p>Pour construire un mur vertical, il faut parfois utiliser un coffrage et un étayage qui maintiendra la structure verticale le temps que le béton sèche.</p><p>Cet étayage peut se représenter par le schéma ci-dessous. Les poutres de fer sont coupées et fixées de façon que :</p><ul><li>les segments [AB] et [AE] sont perpendiculaires ;</li><li>le point C est situé sur la barre [AB] ; le point D est situé sur la barre [BE] ;</li><li>AB = 3,5 m ; AE = 2,625 m et CD = 1,5 m.</li></ul>${etaSVG}<p><b>1)</b> Calculer BE.</p><p><b>2)</b> Les barres [CD] et [AE] doivent être parallèles. À quelle distance de B faut-il placer le point C ?</p>`,
   c:`<p><b>1)</b> Le triangle ABE est rectangle en A. D'après le théorème de Pythagore : BE² = AB² + AE² = 3,5² + 2,625² = 12,25 + 6,890 625 = 19,140 625, donc BE = √19,140 625 = <b>4,375 m</b>.</p>
   <p><b>2)</b> B, C, A et B, D, E sont alignés ; (CD) // (AE). D'après le théorème de Thalès :</p><p class="calc">${Fr("BC","BA")} = ${Fr("CD","AE")} donc BC = ${Fr("3,5 × 1,5","2,625")} = 2 m</p><p>Il faut placer C <b>à 2 m de B</b>.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"L'énoncé de la réciproque", schema:S_REC, q:{
 1:[ {q:"À quoi sert la réciproque du théorème de Thalès ?", c:["à prouver que deux droites sont parallèles","à calculer une longueur","à prouver qu'un triangle est rectangle"], rep:"à prouver que deux droites sont parallèles", sx:S_DIF},
     {q:"On sait que deux droites sont parallèles et on cherche une longueur. On utilise…", c:["le théorème de Thalès","la réciproque du théorème de Thalès","la propriété 2"], rep:"le théorème de Thalès", sx:S_DIF} ],
 2:[ {q:"Les points A, M, B et A, N, C sont alignés dans le même ordre, et AM/AB ≠ AN/AC. Que peut-on conclure ?", c:["(MN) et (BC) ne sont pas parallèles","(MN) // (BC)","on ne peut rien conclure"], rep:"(MN) et (BC) ne sont pas parallèles", ex:"C'est la propriété 2.", sx:S_REC} ],
 3:[ {q:"Les quotients AM/AB et AN/AC sont égaux, mais M est entre A et B alors que A est entre N et C. Que peut-on conclure ?", c:["on ne peut pas utiliser la réciproque","(MN) // (BC)","(MN) et (BC) ne sont pas parallèles"], rep:"on ne peut pas utiliser la réciproque", ex:"Les points ne sont pas alignés dans le même ordre : la réciproque ne s'applique pas (et ici les droites ne sont pas parallèles).", sx:S_ORD} ]
}},
{nom:"Prouver un parallélisme", schema:S_REC, q:{
 1:[ {g:()=>{ const R=randRec(); return {q:`${R.A}${R.M} = ${F(R.am)} ; ${R.A}${R.B} = ${F(R.ab)} ; ${R.A}${R.N} = ${F(R.an)} ; ${R.A}${R.C} = ${F(R.ac)} (en cm). Les points sont alignés dans le même ordre. Les droites (${R.M}${R.N}) et (${R.B}${R.C}) sont-elles parallèles ?`, fig:recFig(R), c:["Oui","Non"], rep:Math.abs(R.am/R.ab-R.an/R.ac)<1e-9?"Oui":"Non", ex:`${Fr(R.A+R.M,R.A+R.B)} ${Math.abs(R.am/R.ab-r3(R.am/R.ab))<1e-9?"=":"≈"} ${F(R.am/R.ab)} et ${Fr(R.A+R.N,R.A+R.C)} ${Math.abs(R.an/R.ac-r3(R.an/R.ac))<1e-9?"=":"≈"} ${F(R.an/R.ac)}.`, sx:S_REC}; }} ],
 2:[ {g:()=>{ const R=randRec(); return {q:`${R.A}${R.M} = ${F(R.am)} ; ${R.A}${R.B} = ${F(R.ab)} ; ${R.A}${R.N} = ${F(R.an)} ; ${R.A}${R.C} = ${F(R.ac)} (en cm). Les droites (${R.M}${R.N}) et (${R.B}${R.C}) sont-elles parallèles ?`, fig:recFig(R), c:["Oui","Non"], rep:Math.abs(R.am/R.ab-R.an/R.ac)<1e-9?"Oui":"Non", ex:`On compare ${Fr(R.A+R.M,R.A+R.B)} = ${Fr(F(R.am),F(R.ab))} et ${Fr(R.A+R.N,R.A+R.C)} = ${Fr(F(R.an),F(R.ac))} (produits en croix : ${F(R.am)} × ${F(R.ac)} = ${F(R.am*R.ac)} et ${F(R.an)} × ${F(R.ab)} = ${F(R.an*R.ab)}).`, sx:S_REC}; }} ],
 3:[ {g:()=>{ const k=pick([0.4,0.5,0.6,0.75]), ab=pick([6,8,10,12]), mb=r3((1-k)*ab), ac=pick([5,8,9,10]), an=r3(k*ac), par=Math.random()<0.5, an2=par?an:r3(an+0.5);
       return {q:`M est sur [AB] et N sur [AC]. AM = ${F(r3(k*ab))} cm ; MB = ${F(mb)} cm ; AN = ${F(an2)} cm ; AC = ${ac} cm. (MN) et (BC) sont-elles parallèles ?`, c:["Oui","Non"], rep:par?"Oui":"Non", ex:`Attention : AB = AM + MB = ${ab} cm. ${Fr("AM","AB")} = ${F(k)} et ${Fr("AN","AC")} ${Math.abs(an2/ac-r3(an2/ac))<1e-9?"=":"≈"} ${F(an2/ac)}.`, sx:S_REC}; }} ]
}},
{nom:"Thalès ou sa réciproque ?", schema:S_DIF, q:{
 1:[ {g:()=>{ const s=pick([["On sait que (MN) // (BC) et on cherche MN.","le théorème de Thalès"],["On veut savoir si (MN) et (BC) sont parallèles.","la réciproque du théorème de Thalès"],["On veut prouver que (EF) // (CD).","la réciproque du théorème de Thalès"],["On sait que (DE) // (BC) et on cherche AD.","le théorème de Thalès"]]); return {q:s[0]+" Que faut-il utiliser ?", c:["le théorème de Thalès","la réciproque du théorème de Thalès"], rep:s[1], sx:S_DIF}; }} ],
 2:[ {g:()=>{ const k=pick([0.4,0.5,0.6,0.75,0.8]), bc=pick([5,6,8,10,12]), ab=pick([5,10,15,20]); return {q:`(MN) // (BC), AM = ${F(k*ab)} cm, AB = ${ab} cm et BC = ${bc} cm. Combien mesure MN (en cm) ?`, rep:[F(r3(k*bc)),F(r3(k*bc))+" cm"], ex:`Théorème de Thalès : MN = ${Fr(`${F(k*ab)} × ${bc}`,ab)} = ${F(r3(k*bc))} cm.`, sx:S_DIF}; }} ],
 3:[ {g:()=>{ let ab,ae,bc; do{ ab=pick([3,3.5,4,4.5,5]); ae=pick([2,2.4,2.625,3]); bc=pick([1.5,2]); }while(Math.abs(bc*ae/ab*100-Math.round(bc*ae/ab*100))>1e-9); const cd=r3(bc*ae/ab); return {q:`Triangle ABE rectangle en A, C sur [AB], D sur [BE], AB = ${F(ab)} m, AE = ${F(ae)} m. On veut (CD) // (AE) avec BC = ${F(bc)} m. Combien mesure CD (en m) ?`, rep:[F(cd),F(cd)+" m"], ex:`${Fr("BC","BA")} = ${Fr("CD","AE")} donc CD = ${Fr(`${F(bc)} × ${F(ae)}`,F(ab))} ${Math.abs(bc*ae/ab-cd)<1e-9?"=":"≈"} ${F(cd)} m.`, sx:S_DIF}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
  const E2a=sec({p1:{M:3.6,B:6}, p2:{N:4.5,C:7.5}, a1:0, a2:42, seg:[["M","N","c"],["B","C","c"]], lens:{AM:"3,6",MB:"2,4",AN:"4,5",NC:"3"}, alt:"Figure a)"});
  const E2b=sec({A:"O", p1:{R:-2.8,S:4}, p2:{T:-3.4,U:5}, a1:0, a2:48, seg:[["R","T","c"],["S","U","c"]], w:320, alt:"Figure b)"});
  return {
  titre:"Évaluation d'entraînement · chapitre 18", duree:50, info:"Durée : 50 min · Calculatrice autorisée",
  comp:[
    ["CONNAÎTRE","Je connais la réciproque du théorème de Thalès et ses conditions.","Ex. 1 (3 points)"],
    ["RAISONNER","Je prouve que deux droites sont parallèles ou non.","Ex. 2 et 3 (9 points)"],
    ["MODÉLISER","Je choisis entre Thalès, sa réciproque et Pythagore dans un problème.","Ex. 4 (8 points)"]
  ],
  exos:[
  {t:"Vrai ou faux ?", p:3, h:`<p>Réponds par Vrai ou Faux et justifie quand c'est faux.</p><p>a) Pour calculer une longueur quand on sait que deux droites sont parallèles, on utilise la réciproque du théorème de Thalès.</p><p>b) Si A, M, B et A, N, C sont alignés dans le même ordre et si ${Fr("AM","AB")} = ${Fr("AN","AC")}, alors (MN) // (BC).</p><p>c) Si les quotients sont égaux, les droites sont toujours parallèles, quel que soit l'ordre des points.</p>`,
   c:`<p>a) Faux : on utilise le théorème de Thalès. <i>(1 point)</i></p><p>b) Vrai : c'est la réciproque du théorème de Thalès. <i>(1 point)</i></p><p>c) Faux : il faut que les points soient alignés dans le même ordre. <i>(1 point)</i></p>`},
  {t:"Parallèles ou non ?", p:5, h:`<p>Dans chaque cas, les points sont alignés comme sur la figure (longueurs en cm). Les droites colorées sont-elles parallèles ? Justifie.</p><div class="figs">${fig("a) (MN) et (BC) ?",E2a)}${fig("b) OR = 2,8 ; OS = 4 ; OT = 3,4 ; OU = 5. (RT) et (SU) ?",E2b)}</div>`,
   c:`<p><b>a)</b> A, M, B et A, N, C sont alignés dans le même ordre. AB = 3,6 + 2,4 = 6 et AC = 4,5 + 3 = 7,5. ${Fr("AM","AB")} = ${Fr("3,6",6)} = 0,6 et ${Fr("AN","AC")} = ${Fr("4,5","7,5")} = 0,6 : d'après la réciproque du théorème de Thalès, (MN) // (BC). <i>(2,5 points)</i></p><p><b>b)</b> R, O, S et T, O, U sont alignés dans le même ordre. ${Fr("OR","OS")} = ${Fr("2,8",4)} = 0,7 et ${Fr("OT","OU")} = ${Fr("3,4",5)} = 0,68 : les quotients ne sont pas égaux, donc (RT) et (SU) ne sont pas parallèles. <i>(2,5 points)</i></p>`},
  {t:"La table à repasser", p:4, h:`<p>Les pieds [AD] et [BC] d'une table à repasser se croisent en O. On mesure OA = 42 cm, OD = 63 cm, OB = 36 cm et OC = 54 cm. Les points A et B sont sur la planche, C et D sur le sol.</p><p>La planche (AB) est-elle parallèle au sol (CD) ? Justifie.</p>`,
   c:`<p>A, O, D et B, O, C sont alignés dans le même ordre (O est entre les deux points). <i>(1 point)</i></p><p class="calc">${Fr("OA","OD")} = ${Fr(42,63)} = ${Fr(2,3)} et ${Fr("OB","OC")} = ${Fr(36,54)} = ${Fr(2,3)} <i>(2 points)</i></p><p>Les quotients sont égaux : d'après la réciproque du théorème de Thalès, (AB) // (CD). La planche est parallèle au sol. <i>(1 point)</i></p>`},
  {t:"Le toboggan", p:8, h:`<p>Un toboggan est modélisé par le triangle ABC rectangle en B : l'échelle [AB] est verticale, la glissière est [AC] et le sol est (BC). On donne AB = 2,4 m et BC = 3,2 m.</p><p>Une barre de renfort [DE] relie un point D de [AB] à un point E de [AC], avec AD = 0,9 m et AE = 1,5 m.</p><p><b>1)</b> Calcule AC.</p><p><b>2)</b> La barre [DE] est-elle parallèle au sol ?</p><p><b>3)</b> On veut une deuxième barre [FG], parallèle au sol, avec F sur [AB] et AF = 1,8 m (G sur [AC]). Calcule FG.</p>`,
   c:`<p><b>1)</b> ABC est rectangle en B. D'après le théorème de Pythagore : AC² = 2,4² + 3,2² = 5,76 + 10,24 = 16, donc AC = 4 m. <i>(2,5 points)</i></p><p><b>2)</b> A, D, B et A, E, C sont alignés dans le même ordre. ${Fr("AD","AB")} = ${Fr("0,9","2,4")} = 0,375 et ${Fr("AE","AC")} = ${Fr("1,5",4)} = 0,375. D'après la réciproque du théorème de Thalès, (DE) // (BC) : la barre est parallèle au sol. <i>(3 points)</i></p><p><b>3)</b> A, F, B et A, G, C sont alignés ; (FG) // (BC). D'après le théorème de Thalès : ${Fr("AF","AB")} = ${Fr("FG","BC")} donc FG = ${Fr("1,8 × 3,2","2,4")} = 2,4 m. <i>(2,5 points)</i></p>`}
  ]};
})()
};
window.G3k18={V, geo, F, ang, fig, Fr, sec, randRec, recFig, recCorr};
})();
