/* 3e — Chapitre 20 : L'homothétie (Transformations du plan 2 : cours et fiches d'exercices de M. Staal)
   Figures du cours et des exercices de lecture : celles des documents Word (img/3k20co, img/3k20ex).
   Figures de construction (activité 1, exercices 7 et 7 bis) et figures du QCM / de l'entraînement : SVG calculés
   (chaque image M' vérifie OM' = k × OM en coordonnées). */
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

const co=(p,alt,w)=>img("3k20co/"+p+".png",alt,w), ex=(p,alt,w)=>img("3k20ex/"+p+".png",alt,w);
const sub=(n,i)=>`${n}<sub>${i}</sub>`;
const Kt=k=>F(k);                          /* écriture du rapport */
const az=k=>F(Math.abs(k));                 /* distance à zéro */

/* ------------------------------------------------------------------
   Figure d'homothétie sur quadrillage
   P : points (centre compris) · cn : nom du centre · imgs : [[k, suffixe, couleur]] · tri : noms de la figure
------------------------------------------------------------------ */
function homFig(o){
  const {P, cn, tri, imgs=[], show, grid, k=26, rays=true, alt="Figure et centre d'homothétie"} = o, C=P[cn];
  const Q={...P}, poly=[[tri,"orig"]], lab=[...Object.keys(P)], labc={}, name={}, seg=[];
  if(show) imgs.forEach(([kk,s])=>{ const nm=tri.map(n=>n===cn?n:n+s); tri.forEach(n=>{ if(n!==cn){ Q[n+s]=V.hom(P[n],C,kk); lab.push(n+s); labc[n+s]="var(--c)"; name[n+s]=/^\d$/.test(s)?`${n}<tspan baseline-shift="sub" style="font-size:12px">${s}</tspan>`:n+s; } }); poly.push([nm,"img"]); });
  if(show && rays){ tri.filter(n=>n!==cn).forEach(n=>{ const pts=[P[n],C,...imgs.map(([kk,s])=>Q[n+s])]; let a=pts[0], b=pts[0]; let best=-1;
      for(const p of pts) for(const q of pts){ const d=V.d(p,q); if(d>best){ best=d; a=p; b=q; } } seg.push([a,b,"d"]); }); }
  const gr=grid||(()=>{ const xs=Object.values(Q).map(p=>p[0]), ys=Object.values(Q).map(p=>p[1]); return [Math.floor(Math.min(...xs))-1,Math.floor(Math.min(...ys))-1,Math.ceil(Math.max(...xs))+1,Math.ceil(Math.max(...ys))+1]; })();
  return geo({P:Q, grid:gr, k, pad:20, poly, seg, x:lab, lab, labc, name, cen:o.cen||C, off:o.off, alt});
}
/* Activité 1 : A(0 ; 0), B(6 ; 0), C(2 ; 4), quadrillage de −4 à 20 et de −3 à 13 (une marge d'un carreau autour de B'(18 ; 0) et C'(6 ; 12)) */
const ACT={P:{A:[0,0],B:[6,0],C:[2,4]}, cn:"A", tri:["A","B","C"], grid:[-4,-3,20,13], k:17};
/* Exercice 7 : A(0 ; 0), B(4 ; 0), C(5 ; 3) ; exercice 7 bis : O(0 ; 0), A(2 ; 0), B(2 ; −2), C(4 ; 1) */
const E7={P:{A:[0,0],B:[4,0],C:[5,3]}, cn:"A", tri:["A","B","C"], grid:[-5,-2.4,15,6.6], k:24, imgs:[[2,"1"],[-0.5,"2"]], off:{A:[-12,-10]}};
const E7b={P:{O:[0,0],A:[2,0],B:[2,-2],C:[4,1]}, cn:"O", tri:["A","B","C"], grid:[-5.4,-2.5,4.4,2.5], k:40, imgs:[[0.5,"1"],[-1,"2"]], cen:[1,0]};

/* ------------------------------------------------------------------
   Homothétie tirée au hasard sur quadrillage (QCM, entraînement)
------------------------------------------------------------------ */
const KS=[2,3,-1,-2,-3,0.5,-0.5,1.5,-1.5,2.5];
function randHom(ks=KS, nm=["A","B","C"]){
  for(let g=0;g<400;g++){ const k=pick(ks), m=Number.isInteger(k)?1:2;
    const big=Math.abs(k)<1, s=big?2:1;             /* figure assez grande quand on réduit */
    const pts=[[ri(1,3)*m*s,ri(-1,1)*m*s],[ri(2,4)*m*s,ri(1,3)*m*s],[ri(1,4)*m*s,ri(-3,-1)*m*s]];
    const A2=Math.abs((pts[1][0]-pts[0][0])*(pts[2][1]-pts[0][1])-(pts[2][0]-pts[0][0])*(pts[1][1]-pts[0][1])); if(A2<4*m*m*s*s) continue;
    const all=[...pts,...pts.map(p=>V.mul(p,k))], xs=all.map(p=>p[0]), ys=all.map(p=>p[1]); if(Math.max(...xs)-Math.min(...xs)>24||Math.max(...ys)-Math.min(...ys)>16) continue;
    const P={O:[0,0]}; nm.forEach((n,i)=>P[n]=pts[i]); return {k, P, nm}; }
  return {k:2, P:{O:[0,0],A:[1,0],B:[3,2],C:[2,-1]}, nm};
}
/* figure : le triangle et son image (sans les rayons) ; montre le centre O */
const randFig=(H,show,w)=>{ const Q={...H.P}; H.nm.forEach(n=>Q[n+"'"]=V.hom(H.P[n],[0,0],H.k)); const xs=Object.values(Q).map(p=>p[0]), ys=Object.values(Q).map(p=>p[1]);
  const labc={}; H.nm.forEach(n=>labc[n+"'"]="var(--c)");
  return geo({P:Q, grid:[Math.min(...xs)-1,Math.min(...ys)-1,Math.max(...xs)+1,Math.max(...ys)+1], k:Math.min(20, (w||300)/(Math.max(...xs)-Math.min(...xs)+2)), pad:16, poly:[[H.nm,"orig"],[H.nm.map(n=>n+"'"),"img"]],
    seg:show?H.nm.map(n=>{ const a=H.P[n], b=Q[n+"'"]; const ends=[a,b,[0,0]].sort((p,q)=>p[0]-q[0]||p[1]-q[1]); return [ends[0],ends[2],"d"]; }):[], x:Object.keys(Q), labc, cen:[0,0], off:{O:[0,-14]}, alt:"Triangle, son image et le point O sur quadrillage"}); };
const kTxt=k=>`${F(k)}`;
const natTxt=k=>Math.abs(k)>1?"un agrandissement":Math.abs(k)<1?"une réduction":"une reproduction";

/* ===================== schémas ===================== */
const S_DEF=sch("L'homothétie", `${co("h5","Homothétie de centre O et de rapport 2",230)}<p class="schN">Un point et son image sont alignés avec le centre O.</p><p class="schN">k &gt; 0 : du même côté de O. k &lt; 0 : de part et d'autre de O.</p><p class="schN">OM' = (distance à zéro de k) × OM.</p>`);
const S_NAT=sch("Agrandissement ou réduction ?", `<p class="schN">k &gt; 1 ou k &lt; −1 : <b>agrandissement</b>.</p><p class="schN">−1 &lt; k &lt; 1 : <b>réduction</b>.</p><p class="schN">k = 1 ou k = −1 : <b>reproduction</b>.</p><p class="schN">Exemple : k = −0,5 → réduction de rapport 0,5.</p>`);
const S_RAP=sch("Retrouver le rapport", `<p class="schN">Distance à zéro de k = ${"{A'B'/AB}"} (longueur image ÷ longueur de départ).</p><p class="schN">Signe : + si la figure et son image sont du même côté du centre, − si elles sont de part et d'autre.</p>`);
const S_LON=sch("Calculer une longueur", `<p class="calc">A'B' = (distance à zéro de k) × AB</p><p class="schN">Exemple : k = −3 et AB = 2 cm donc A'B' = 3 × 2 = 6 cm.</p>`);
const S_AIR=sch("Calculer une aire", `<p class="calc">Aire de l'image = k² × aire de départ</p><p class="schN">Exemple : k = 2 → l'aire est multipliée par 2² = 4.</p>`);

CH["3e-20"] = {
intro:"Une homothétie agrandit ou réduit une figure à partir d'un point, son centre : on apprend à la reconnaître, à trouver son centre et son rapport, à construire une image et à calculer des longueurs et des aires.",
savoir:[
  "connaître la définition d'une homothétie (centre, rapport positif ou négatif) ;",
  "savoir si une homothétie est un agrandissement, une réduction ou une reproduction ;",
  "trouver le centre et le rapport d'une homothétie ;",
  "construire l'image d'une figure par une homothétie ;",
  "calculer une longueur, retrouver un rapport et calculer une aire avec le rapport d'homothétie."
],

/* ===================== COURS ===================== */
cours:[
{k:"1", t:"Définition", h:`
  <div class="retenir" data-l="Définition"><p>Une <b>homothétie de rapport k</b> (avec k un nombre relatif non nul) permet d'agrandir ou de réduire une figure à partir d'un point choisi, appelé <b>centre</b>.</p>
   <ul><li>Si la <b>distance à zéro de k est plus grande que 1</b>, alors c'est un agrandissement.</li><li>Si la <b>distance à zéro de k est comprise entre 0 et 1</b>, alors c'est une réduction.</li><li>Si la <b>distance à zéro de k est égale à 1</b>, alors c'est une reproduction.</li></ul>
   <ul><li>Si <b>k &gt; 0</b>, la figure initiale et son image se trouvent <b>du même côté</b> par rapport au centre d'homothétie.</li><li>Si <b>k &lt; 0</b>, la figure initiale et son image se trouvent <b>de part et d'autre</b> du centre d'homothétie.</li></ul></div>
  <h4>a) Si le centre d'homothétie appartient à la figure initiale</h4>
  <p>Dans chaque cas, AB'C' est l'image de ABC par l'homothétie de centre <b>A</b> et de rapport k.</p>
  <div class="retenir" data-l="Propriétés"><ul><li>Un point et son image sont alignés avec le centre d'homothétie. En effet, les points <b>A</b>, B et B' sont alignés, et les points <b>A</b>, C et C' également.</li><li>(BC) // (B'C')</li><li><b>A</b>B' = k × <b>A</b>B ; <b>A</b>C' = k × <b>A</b>C et B'C' = k × BC (avec la distance à zéro de k quand k est négatif).</li></ul></div>
  <div class="figs">${fig(`Le triangle A${sub("B",1)}${sub("C",1)} est l'image de ABC par l'homothétie de centre A et de rapport 2.`,co("h1","Homothétie de centre A et de rapport 2",280))}${fig(`Le triangle A${sub("B",3)}${sub("C",3)} est l'image de ABC par l'homothétie de centre A et de rapport 0,5.`,co("h2","Homothétie de centre A et de rapport 0,5",180))}</div>
  <p>Les points B et ${sub("B",1)} sont alignés avec <b>A</b> et, comme <b>k &gt; 0</b>, ils sont <b>du même côté par rapport à A</b> : A${sub("B",1)} = 2 × AB.</p><p>De même, B et ${sub("B",3)} sont du même côté de A : A${sub("B",3)} = 0,5 × AB.</p>
  <div class="figs">${fig(`Le triangle A${sub("B",2)}${sub("C",2)} est l'image de ABC par l'homothétie de centre A et de rapport −2.`,co("h3","Homothétie de centre A et de rapport −2",300))}${fig(`Le triangle A${sub("B",4)}${sub("C",4)} est l'image de ABC par l'homothétie de centre A et de rapport −0,5.`,co("h4","Homothétie de centre A et de rapport −0,5",200))}</div>
  <p>Les points B et ${sub("B",2)} sont alignés avec <b>A</b> et, comme <b>k &lt; 0</b>, ils sont <b>de part et d'autre de A</b> : A${sub("B",2)} = 2 × AB.</p><p>De même, B et ${sub("B",4)} sont de part et d'autre de A : A${sub("B",4)} = 0,5 × AB.</p>
  <h4>b) Si le centre d'homothétie n'appartient pas à la figure initiale</h4>
  <p>Dans chaque cas, A'B'C' est l'image de ABC par l'homothétie de centre <b>O</b> et de rapport k.</p>
  <div class="retenir" data-l="Propriétés"><ul><li>Un point et son image sont alignés avec le centre d'homothétie. En effet, les points <b>O</b>, A et A' sont alignés ; les points <b>O</b>, B et B' sont alignés et les points <b>O</b>, C et C' également.</li><li>(AB) // (A'B') ; (AC) // (A'C') et (BC) // (B'C')</li><li><b>O</b>A' = k × <b>O</b>A ; <b>O</b>B' = k × <b>O</b>B et <b>O</b>C' = k × <b>O</b>C</li><li>mais on a aussi : A'B' = k × AB ; A'C' = k × AC et B'C' = k × BC (avec la distance à zéro de k quand k est négatif).</li></ul></div>
  <div class="figs">${fig(`Le triangle ${sub("A",1)}${sub("B",1)}${sub("C",1)} est l'image de ABC par l'homothétie de centre O et de rapport 2.`,co("h5","Homothétie de centre O et de rapport 2",300))}${fig(`Le triangle ${sub("A",3)}${sub("B",3)}${sub("C",3)} est l'image de ABC par l'homothétie de centre O et de rapport 0,5.`,co("h6","Homothétie de centre O et de rapport 0,5",220))}</div>
  <p>Les points B et ${sub("B",1)} sont alignés avec <b>O</b> et, comme <b>k &gt; 0</b>, ils sont <b>du même côté par rapport à O</b> : O${sub("B",1)} = 2 × OB.</p><p>De même : O${sub("B",3)} = 0,5 × OB.</p>
  <div class="anim" data-anim="3e20-homothetie-positive"></div>
  <div class="figs">${fig(`Le triangle ${sub("A",2)}${sub("B",2)}${sub("C",2)} est l'image de ABC par l'homothétie de centre O et de rapport −2.`,co("h7","Homothétie de centre O et de rapport −2",330))}${fig(`Le triangle ${sub("A",4)}${sub("B",4)}${sub("C",4)} est l'image de ABC par l'homothétie de centre O et de rapport −0,5.`,co("h8","Homothétie de centre O et de rapport −0,5",240))}</div>
  <p>Les points B et ${sub("B",2)} sont alignés avec <b>O</b> et, comme <b>k &lt; 0</b>, ils sont <b>de part et d'autre de O</b> : O${sub("B",2)} = 2 × OB.</p><p>De même : O${sub("B",4)} = 0,5 × OB.</p>
  <div class="anim" data-anim="3e20-homothetie-negative"></div>`},
{k:"2", t:"Agrandissement, réduction ou reproduction ?", h:`
  <div class="retenir" data-l="Propriété"><p>On considère l'homothétie de centre O et de rapport <b>k</b>.</p><ul><li>Si <b>k &gt; 1</b> ou <b>k &lt; −1</b>, la figure image est un <b>agrandissement</b> de la figure initiale.</li><li>Si <b>−1 &lt; k &lt; 1</b>, la figure image est une <b>réduction</b> de la figure initiale.</li><li>Si <b>k = 1</b> ou <b>k = −1</b>, la figure image est une <b>reproduction</b> de la figure initiale.</li></ul></div>
  <p><b>Exemple 1 :</b> k = 2, donc le triangle A'B'C' est un <b>agrandissement</b> du triangle ABC de rapport 2.</p><p class="calc">En effet : A'C' = 2 × AC ; B'C' = 2 × BC ; A'B' = 2 × AB</p>
  <p><b>Exemple 2 :</b> k = −0,5, donc le triangle A'B'C' est une <b>réduction</b> du triangle ABC de rapport 0,5.</p><p class="calc">En effet : A'C' = 0,5 × AC ; B'C' = 0,5 × BC ; A'B' = 0,5 × AB</p>
  <p><b>Exemple 3 :</b> le triangle A'B'C' est l'image du triangle ABC par l'<b>homothétie</b> de <b>centre A</b> et de <b>rapport −3</b>.</p>
  ${co("h9","Homothétie de centre A et de rapport −3",360)}
  <p>k = −3 et −3 &lt; −1 : le triangle A'B'C' est un <b>agrandissement</b> du triangle ABC de rapport 3.</p><p>Comme k &lt; 0, B et B' sont de part et d'autre de A, ainsi que C et C'.</p><p class="calc">A'B' = 3 × AB ; A'C' = 3 × AC ; B'C' = 3 × BC</p>
  <div class="attention"><b>En lien avec le chapitre « Agrandissement, réduction et triangles semblables »</b>, il faut savoir également : calculer la longueur d'un côté en utilisant le rapport d'homothétie, retrouver le rapport d'homothétie et calculer l'aire d'une figure en utilisant le rapport d'homothétie.</div>`},
{k:"3", t:"Calculs de longueurs", h:`
  <div class="retenir" data-l="Méthode"><p>Si A'B'C' est l'image de ABC par une homothétie de rapport k, les longueurs sont multipliées par la distance à zéro de k :</p><p class="calc">A'B' = (distance à zéro de k) × AB</p></div>
  <p><b>Exemple :</b> le triangle A'B'C' est l'image du triangle ABC par l'homothétie de centre O et de rapport −3, et AB = 2 cm.</p><p class="calc">A'B' = 3 × AB<br>A'B' = 3 × 2<br>A'B' = 6 cm</p>`},
{k:"4", t:"Calculs d'aires", h:`
  <div class="retenir" data-l="Propriété"><p>Si une figure est l'image d'une autre par une homothétie de rapport k, son aire est multipliée par k² :</p><p class="calc">Aire de l'image = k² × aire de la figure initiale</p></div>
  <p><b>Exemple :</b> une figure a une aire de 5 cm². Par l'homothétie de rapport −2, son image a pour aire :</p><p class="calc">A' = (−2)² × 5<br>A' = 4 × 5<br>A' = 20 cm²</p>`},
{k:"5", t:"Retrouver le rapport d'agrandissement", h:`
  <div class="retenir" data-l="Méthode"><p>On divise une longueur de l'image par la longueur correspondante de la figure initiale :</p><p class="calc">distance à zéro de k = ${"{A'B'/AB}"}</p><p>Puis on choisit le signe :</p><ul><li>k &gt; 0 si la figure et son image sont <b>du même côté</b> du centre ;</li><li>k &lt; 0 si elles sont <b>de part et d'autre</b> du centre.</li></ul></div>
  <p><b>Exemple :</b> dans l'exemple 3 ci-dessus, A'B' = 3 × AB : ${"{A'B'/AB}"} = 3, et les deux triangles sont de part et d'autre de A, donc k = −3.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Découvrir l'homothétie", e:[
  {n:"Activité 1", t:"Découvrir une nouvelle transformation : l'homothétie", w:"Sur ta feuille", h:`<p><b>1) a)</b> Trace le triangle AB'C' tel que :</p><ul><li>B' ∈ [AB) et AB' = 3 AB ;</li><li>C' ∈ [AC) et AC' = 3 AC.</li></ul>${homFig(ACT)}
   <p><b>b)</b> Que peut-on dire des droites (BC) et (B'C') ?</p><p><b>c)</b> Compare les longueurs BC et B'C'.</p>
   <p><b>On dira que le triangle AB'C' est l'image du triangle ABC par l'homothétie de centre A et de rapport 3.</b></p>
   <p><b>2)</b> Trace le triangle AB''C'', image du triangle ABC par l'homothétie de centre A et de rapport ${"{1/2}"} (avec B'' ∈ [AB] et C'' ∈ [AC]).</p>
   <p><b>Premier bilan :</b> soit AB'C' l'image du triangle ABC par une homothétie de centre A et de rapport k. Que peut-on dire ?</p>`,
   c:`<p><b>1) a)</b> AB = 6 carreaux, donc AB' = 3 × 6 = 18 carreaux sur la demi-droite [AB). Pour aller de A à C : 2 carreaux vers la droite et 4 vers le haut ; pour aller de A à C' : 3 × 2 = 6 carreaux vers la droite et 3 × 4 = 12 vers le haut.</p>
   ${homFig({...ACT, show:true, imgs:[[3,"'"],[0.5,"''"]]})}
   <p><b>b)</b> Les droites (BC) et (B'C') sont <b>parallèles</b> : (BC) // (B'C').</p><p><b>c)</b> B'C' = 3 × BC.</p>
   <p><b>2)</b> AB'' = 6 ÷ 2 = 3 carreaux ; C'' est à 1 carreau vers la droite et 2 vers le haut de A (milieu de [AC]).</p>
   <p><b>Premier bilan :</b> les points A, B et B' sont alignés, ainsi que A, C et C' ; (BC) // (B'C') ; AB' = k × AB, AC' = k × AC et B'C' = k × BC.</p>`}
 ]},
{t:"Trouver le centre et le rapport d'une homothétie", e:[
  {n:"Exercice 1", t:"Centre, rapport et longueur", w:"Sur ta feuille", h:`<p><b>Situation 1 :</b> on passe du triangle OBE au triangle ABC par une homothétie.</p>${ex("e1a","Triangles OBE et ABC : BO = 8 cm, BC = 32 cm, OE = 4,5 cm, BA = 20 cm",280)}
   <p><b>1)</b> L'homothétie est de centre …… et de rapport …… (calcul : ……).</p><p><b>2)</b> AC = …… cm (calcul : ……).</p>
   <p><b>Situation 2 :</b> on passe du triangle OBE au triangle ABC par une homothétie.</p>${ex("e1b","Triangles OBE et ABC : BO = 10 cm, BC = 6 cm, CA = 3,5 cm",200)}
   <p><b>3)</b> L'homothétie est de centre …… et de rapport …… (calcul : ……).</p><p><b>4)</b> OE = …… cm (calcul : ……).</p>`,
   c:`<p><b>1)</b> B est commun aux deux triangles : l'homothétie est de <b>centre B</b>. O a pour image C :</p><p class="calc">k = ${"{BC/BO}"}<br>k = ${"{32/8}"}<br>k = <b>4</b></p><p>(positif : C et O sont du même côté de B).</p>
   <p><b>2)</b> E a pour image A et O a pour image C, donc :</p><p class="calc">AC = 4 × OE<br>AC = 4 × 4,5<br>AC = <b>18 cm</b></p>
   <p><b>3)</b> Centre <b>B</b>. O a pour image C :</p><p class="calc">k = ${"{BC/BO}"}<br>k = ${"{6/10}"}<br>k = <b>0,6</b></p><p>(C et O sont du même côté de B : c'est une réduction).</p>
   <p><b>4)</b> E a pour image A et O a pour image C, donc CA = 0,6 × OE. D'où :</p><p class="calc">OE = 3,5 ÷ 0,6<br>OE = ${"{35/6}"}<br>OE ≈ <b>5,83 cm</b></p>`},
  {n:"Exercice 2", t:"Trouver le centre et le rapport", w:"Sur ta feuille", h:`<p><b>Situation 1 :</b> on passe du triangle ABC au triangle EBO par une homothétie.</p>${ex("e2a","Triangles ABC et EBO : BA = 4,2 cm, AC = 7 cm, BC = 6,3 cm, BO = 9,45 cm",230)}<p>L'homothétie est de centre …… et de rapport …… (calcul : ……).</p>
   <p><b>Situation 2 :</b> on passe du triangle ABC au triangle A'B'C' par une homothétie.</p>${ex("e2b","Triangles ABC et A'B'C' : AB = 3 cm, AC = 1,8 cm, A'C' = 4,5 cm",210)}<p>L'homothétie est de centre …… et de rapport …… (calcul : ……).</p>
   <p><b>Situation 3 :</b> on passe du triangle ABC au triangle EBD par une homothétie.</p>${ex("e2c","Triangles ABC et EBD : AB = 4,5 cm, AC = 4 cm, BC = 3 cm, BD = 1,8 cm",220)}<p>L'homothétie est de centre …… et de rapport …… (calcul : ……).</p>`,
   c:`<p><b>Situation 1 :</b> <b>centre B</b>. C a pour image O, et C et O sont de part et d'autre de B : le rapport est négatif. ${"{BO/BC}"} = ${"{9,45/6,3}"} = 1,5, donc le rapport est <b>−1,5</b>.</p>
   <p><b>Situation 2 :</b> <b>centre O</b> (O = A = A'). C a pour image C', du même côté de O : ${"{A'C'/AC}"} = ${"{4,5/1,8}"} = 2,5, donc le rapport est <b>2,5</b>.</p>
   <p><b>Situation 3 :</b> <b>centre B</b>. A a pour image D, et A et D sont de part et d'autre de B : ${"{BD/BA}"} = ${"{1,8/4,5}"} = 0,4, donc le rapport est <b>−0,4</b>.</p>`},
  {n:"Exercice 3", t:"Trouver le centre et le rapport d'homothétie", w:"Sur ta feuille", h:`<p>Trouve le centre et le rapport d'homothétie en t'aidant du quadrillage.</p><p>Dans chaque cas, le triangle A'B'C' est l'image du triangle ABC par l'homothétie de centre …… et de rapport ……</p>
   <div class="figs">${fig("Cas 1",ex("e3a","Cas 1",300))}${fig("Cas 2",ex("e3b","Cas 2",280))}${fig("Cas 3",ex("e3c","Cas 3",250))}${fig("Cas 4",ex("e3d","Cas 4",280))}${fig("Cas 5",ex("e3e","Cas 5",200))}${fig("Cas 6",ex("e3f","Cas 6",300))}</div>`,
   c:`<p>On cherche le point où se coupent les droites (AA'), (BB') et (CC') : c'est le centre. Puis on compare les distances au centre en comptant les carreaux.</p>
   <p><b>Cas 1 :</b> centre <b>O</b> ; OA' = 2 × OA et A' est du même côté que A : rapport <b>2</b>.</p>
   <p><b>Cas 2 :</b> centre <b>O</b> ; OA' = 0,5 × OA et les triangles sont de part et d'autre de O : rapport <b>−0,5</b>.</p>
   <p><b>Cas 3 :</b> centre <b>A</b> ; AB' = 2 × AB, du même côté : rapport <b>2</b>.</p>
   <p><b>Cas 4 :</b> centre <b>O</b> ; OA' = OA et les triangles sont de part et d'autre de O : rapport <b>−1</b> (c'est la symétrie de centre O).</p>
   <p><b>Cas 5 :</b> centre <b>A</b> (A' = A) ; AC' = 2 × AC et C' est de l'autre côté de A : rapport <b>−2</b>.</p>
   <p><b>Cas 6 :</b> centre <b>O</b> ; OA' = 0,5 × OA (1,5 carreau au lieu de 3), du même côté : rapport <b>0,5</b>.</p>`}
 ]},
{t:"Calculer avec le rapport d'homothétie", e:[
  {n:"Exercice 4", t:"Calculer une longueur", w:"Sur ta feuille", h:`<p>Dans les deux cas, calcule A'B'. Note directement le calcul et le résultat.</p>
   <div class="figs">${fig("1) Le triangle A'B'C' est l'image du triangle ABC par l'homothétie de centre O et de rapport 2,5.",ex("e4a","AB = 3 cm, AC = 1,8 cm, centre O = A",210))}${fig("2) Le triangle A'B'C' est l'image du triangle ABC par l'homothétie de centre O et de rapport −0,5.",ex("e4b","AB = 3 cm, AC = 1,8 cm",300))}</div>`,
   c:`<p><b>1)</b></p><p class="calc">A'B' = 2,5 × AB<br>A'B' = 2,5 × 3<br>A'B' = <b>7,5 cm</b></p><p><b>2)</b> On utilise la distance à zéro de −0,5 :</p><p class="calc">A'B' = 0,5 × AB<br>A'B' = 0,5 × 3<br>A'B' = <b>1,5 cm</b></p>`},
  {n:"Exercice 5", t:"Trouver le rapport d'homothétie", w:"Sur ta feuille", h:`<p>Dans chaque cas, calcule le rapport d'homothétie k. Note directement le calcul et le résultat.</p>
   <div class="figs">${fig("1) Le triangle A'B'C' est l'image du triangle ABC par une homothétie de centre O.",ex("e5a","AB = 4,5 cm, AC = 3 cm, A'B' = 7,2 cm",260))}${fig("2) Le triangle A'B'C' est l'image du triangle ABC par une homothétie de centre O.",ex("e5b","AB = 2,5 cm, BC = 3 cm, AC = 1,9 cm ; A'C' = 2,28 cm, A'B' = 3 cm",270))}${fig("3) Le triangle A'B'C' est l'image du triangle ABC par une homothétie de centre A.",ex("e5c","AB = 2 cm, AC = 1,4 cm, A'C' = 4,2 cm",260))}</div>`,
   c:`<p><b>1)</b> ${"{A'B'/AB}"} = ${"{7,2/4,5}"} = 1,6 et les triangles sont du même côté de O : <b>k = 1,6</b>.</p>
   <p><b>2)</b> ${"{A'B'/AB}"} = ${"{3/2,5}"} = 1,2 (et ${"{2,28/1,9}"} = 1,2) ; les triangles sont de part et d'autre de O : <b>k = −1,2</b>.</p>
   <p><b>3)</b> ${"{A'C'/AC}"} = ${"{4,2/1,4}"} = 3 ; C et C' sont de part et d'autre de A : <b>k = −3</b>.</p>`},
  {n:"Exercice 6", t:"Calculer une aire", w:"Sur ton cahier", h:`${ex("e6","Triangle ABC, centre O et triangle A'B'C'",280)}<p>Le triangle A'B'C' est l'image du triangle ABC par l'homothétie de centre O de rapport 3,5.</p><p>L'aire du triangle ABC est égale à 7 cm².</p><p>Calcule l'aire du triangle A'B'C'.</p>`,
   c:`<p>Par une homothétie de rapport 3,5, les aires sont multipliées par 3,5².</p><p class="calc">Aire(A'B'C') = 3,5² × 7<br>Aire(A'B'C') = 12,25 × 7<br>Aire(A'B'C') = 85,75 cm²</p><p>L'aire du triangle A'B'C' est <b>85,75 cm²</b>.</p>`}
 ]},
{t:"Construire l'image d'une figure", e:[
  {n:"Exercice 7", t:"Construction (centre A)", w:"Sur ta feuille", h:`<p><b>a)</b> Trace le triangle ${sub("A",1)}${sub("B",1)}${sub("C",1)}, image du triangle ABC par l'homothétie de centre A et de rapport 2.</p><p><b>b)</b> Trace le triangle ${sub("A",2)}${sub("B",2)}${sub("C",2)}, image du triangle ABC par l'homothétie de centre A et de rapport −0,5.</p>${homFig(E7)}`,
   c:`<p>A est le centre : ${sub("A",1)} = ${sub("A",2)} = A.</p><p><b>a)</b> Pour aller de A à B : 4 carreaux vers la droite, donc ${sub("B",1)} est à 2 × 4 = 8 carreaux à droite de A. Pour aller de A à C : 5 vers la droite et 3 vers le haut, donc ${sub("C",1)} est à 10 vers la droite et 6 vers le haut.</p>
   <p><b>b)</b> Rapport −0,5 : on prend la moitié des déplacements, dans l'autre sens. ${sub("B",2)} est à 2 carreaux à gauche de A ; ${sub("C",2)} est à 2,5 carreaux vers la gauche et 1,5 vers le bas.</p>${homFig({...E7, show:true})}`},
  {n:"Exercice 7 bis", t:"Construction (centre O)", w:"Sur ta feuille", h:`<p><b>a)</b> Trace le triangle ${sub("A",1)}${sub("B",1)}${sub("C",1)}, image du triangle ABC par l'homothétie de centre O et de rapport 0,5.</p><p><b>b)</b> Trace le triangle ${sub("A",2)}${sub("B",2)}${sub("C",2)}, image du triangle ABC par l'homothétie de centre O et de rapport −1.</p>${homFig(E7b)}`,
   c:`<p><b>a)</b> Rapport 0,5 : chaque point image est au milieu du segment qui le relie à O (${sub("A",1)} milieu de [OA], ${sub("B",1)} milieu de [OB], ${sub("C",1)} milieu de [OC]).</p><p><b>b)</b> Rapport −1 : chaque point image est le symétrique du point par rapport à O (O milieu de [A${sub("A",2)}], de [B${sub("B",2)}] et de [C${sub("C",2)}]).</p>${homFig({...E7b, show:true})}`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Définition", schema:S_DEF, q:{
 1:[ {g:()=>{ const k=pick([-3,-2,-1.5,-0.5,0.5,1.5,2,3]); return {q:`Par une homothétie de centre O et de rapport ${F(k)}, un point M et son image M' sont…`, c:["du même côté de O","de part et d'autre de O"], rep:k>0?"du même côté de O":"de part et d'autre de O", ex:k>0?"k > 0 : la figure et son image sont du même côté du centre.":"k < 0 : la figure et son image sont de part et d'autre du centre.", sx:S_DEF}; }} ],
 2:[ {q:"M' est l'image de M par une homothétie de centre O. Les points O, M et M' sont…", c:["alignés","sur un même cercle de centre O","les sommets d'un triangle rectangle"], rep:"alignés", ex:"Un point et son image sont alignés avec le centre d'homothétie.", sx:S_DEF},
     {q:"A'B'C' est l'image de ABC par une homothétie. Que peut-on dire des droites (AB) et (A'B') ?", c:["elles sont parallèles","elles sont perpendiculaires","elles se coupent au centre"], rep:"elles sont parallèles", ex:"(AB) // (A'B'), (AC) // (A'C') et (BC) // (B'C').", sx:S_DEF} ],
 3:[ {g:()=>{ const k=pick([-3,-2,-1.5,-0.5,0.5,1.5,2,3,2.5,-2.5]), om=ri(2,8); return {q:`OM = ${om} cm. M' est l'image de M par l'homothétie de centre O et de rapport ${F(k)}. Que vaut OM' ?`, c:shuf(uniq(`${F(Math.abs(k)*om)} cm`,[`${F(om/Math.abs(k),2)} cm`,`${F(om+Math.abs(k))} cm`,`${F(Math.abs(k)*om+om)} cm`])), rep:`${F(Math.abs(k)*om)} cm`, ex:`<br>OM' = ${az(k)} × OM<br>OM' = ${az(k)} × ${om}<br>OM' = ${F(Math.abs(k)*om)} cm${k<0?"<br>(M' est de l'autre côté de O)":""}`, sx:S_DEF}; }} ]
}},
{nom:"Agrandissement ou réduction ?", schema:S_NAT, q:{
 1:[ {g:()=>{ const k=pick([3,2,1.5,0.5,0.25,0.8,4]); const r=natTxt(k); return {q:`Une homothétie a pour rapport ${F(k)}. L'image d'une figure est…`, c:["un agrandissement","une réduction","une reproduction"], rep:r, ex:k>1?"k > 1 : agrandissement.":"0 < k < 1 : réduction.", sx:S_NAT}; }} ],
 2:[ {g:()=>{ const k=pick([-3,-2,-1.5,-0.5,-0.25,-0.8,-1,1]); const r=natTxt(k); return {q:`Une homothétie a pour rapport ${F(k)}. L'image d'une figure est…`, c:["un agrandissement","une réduction","une reproduction"], rep:r, ex:`On regarde la distance à zéro de k : ${az(k)}${Math.abs(k)>1?" > 1 : agrandissement.":Math.abs(k)<1?" < 1 : réduction.":" = 1 : reproduction."}`, sx:S_NAT}; }} ],
 3:[ {g:()=>{ const k=pick([-3,-2,-0.5,-0.4,-1.5]); return {q:`Par l'homothétie de rapport ${F(k)}, la figure image est…`, c:shuf([`${Math.abs(k)>1?"un agrandissement":"une réduction"} de rapport ${az(k)}`,`${Math.abs(k)>1?"une réduction":"un agrandissement"} de rapport ${az(k)}`,`${Math.abs(k)>1?"un agrandissement":"une réduction"} de rapport ${F(k)}`]), rep:`${Math.abs(k)>1?"un agrandissement":"une réduction"} de rapport ${az(k)}`, ex:`Le rapport d'agrandissement ou de réduction est la distance à zéro de k : ${az(k)}.`, sx:S_NAT}; }} ]
}},
{nom:"Centre et rapport", schema:S_RAP, q:{
 1:[ {g:()=>{ const H=randHom([2,3,-1,-2,0.5,-0.5]); return {q:"Le triangle A'B'C' est l'image du triangle ABC par une homothétie de centre O. Quel est son rapport ?", fig:randFig(H,false,300), c:shuf(uniq(F(H.k),[F(-H.k),F(1/H.k),F(-1/H.k)])), rep:F(H.k), ex:`OA' = ${az(H.k)} × OA (on compte les carreaux) et les triangles sont ${H.k>0?"du même côté":"de part et d'autre"} de O : k = ${F(H.k)}.`, sx:S_RAP}; }} ],
 2:[ {g:()=>{ const a=ri(2,9)*pick([0.5,1]), k=pick([1.5,2,2.5,3,0.4,0.5,0.6,-1.5,-2,-0.5,-3]), b=r3(Math.abs(k)*a), s=k>0; return {q:`AB = ${F(a)} cm et A'B' = ${F(b)} cm. A'B'C' est l'image de ABC par une homothétie de centre O, et les deux triangles sont ${s?"du même côté":"de part et d'autre"} de O. Quel est le rapport ?`, c:shuf(uniq(F(k),[F(-k),F(r3(1/k),2),F(r3(-1/k),2)])), rep:F(k), ex:`${"{A'B'/AB}"} = ${F(b)} ÷ ${F(a)} = ${az(k)} ; ${s?"même côté : k > 0":"de part et d'autre : k < 0"}.`, sx:S_RAP}; }} ],
 3:[ {g:()=>{ const H=randHom([1.5,-1.5,2.5,-2,3,-3,-0.5]); return {q:"Le triangle A'B'C' est l'image du triangle ABC par une homothétie de centre O. Quel est son rapport ?", fig:randFig(H,false,300), c:shuf(uniq(F(H.k),[F(-H.k),F(r3(1/H.k),2),F(r3(H.k+1))])), rep:F(H.k), ex:`OA' = ${az(H.k)} × OA (on compte les carreaux) et les triangles sont ${H.k>0?"du même côté":"de part et d'autre"} de O : k = ${F(H.k)}.`, sx:S_RAP}; }} ]
}},
{nom:"Calculer une longueur", schema:S_LON, q:{
 1:[ {g:()=>{ const k=pick([2,3,4,1.5,2.5]), a=ri(2,9); return {q:`A'B'C' est l'image de ABC par l'homothétie de centre O et de rapport ${F(k)}. AB = ${a} cm. Combien mesure A'B' (en cm) ?`, rep:[F(k*a),F(k*a)+" cm"], ex:`<br>A'B' = ${F(k)} × ${a}<br>A'B' = ${F(k*a)} cm`, sx:S_LON}; }} ],
 2:[ {g:()=>{ const k=pick([-2,-3,-0.5,-1.5,-2.5,0.5,0.25]), a=ri(2,12)*2; return {q:`A'B'C' est l'image de ABC par l'homothétie de centre O et de rapport ${F(k)}. AB = ${a} cm. Combien mesure A'B' (en cm) ?`, rep:[F(Math.abs(k)*a),F(Math.abs(k)*a)+" cm"], ex:`<br>A'B' = ${az(k)} × ${a}<br>A'B' = ${F(Math.abs(k)*a)} cm<br>(une longueur est toujours positive : on prend la distance à zéro de k).`, sx:S_LON}; }} ],
 3:[ {g:()=>{ const k=pick([2,2.5,4,-2,-4,-2.5,0.5,-0.5]), a=ri(2,9)*2, b=r3(Math.abs(k)*a); return {q:`A'B'C' est l'image de ABC par l'homothétie de centre O et de rapport ${F(k)}. A'B' = ${F(b)} cm. Combien mesure AB (en cm) ?`, rep:[F(a),F(a)+" cm"], ex:`A'B' = ${az(k)} × AB, donc :<br>AB = ${F(b)} ÷ ${az(k)}<br>AB = ${F(a)} cm`, sx:S_LON}; }} ]
}},
{nom:"Calculer une aire", schema:S_AIR, q:{
 1:[ {g:()=>{ const k=pick([2,3,-2,-3,10]); return {q:`Par une homothétie de rapport ${F(k)}, l'aire d'une figure est multipliée par…`, c:shuf(uniq(F(k*k),[F(Math.abs(k)),F(2*Math.abs(k)),F(k*k*k)])), rep:F(k*k), ex:`L'aire est multipliée par k² = (${F(k)})² = ${k*k}.`, sx:S_AIR}; }} ],
 2:[ {g:()=>{ const k=pick([2,3,1.5,-2,-1.5,2.5]), A=ri(2,12); return {q:`Une figure a une aire de ${A} cm². Quelle est l'aire de son image par l'homothétie de rapport ${F(k)} (en cm²) ?`, rep:[F(k*k*A),F(k*k*A)+" cm²"], ex:`k² = ${F(k*k)} ; ${F(k*k)} × ${A} = ${F(k*k*A)} cm².`, sx:S_AIR}; }} ],
 3:[ {g:()=>{ const k=pick([0.5,-0.5,0.2,-0.1,0.4]), A=ri(2,9)*100; return {q:`Une figure a une aire de ${A} cm². Quelle est l'aire de son image par l'homothétie de rapport ${F(k)} (en cm²) ?`, rep:[F(r3(k*k*A)),F(r3(k*k*A))+" cm²"], ex:`k² = ${F(r3(k*k))} ; ${F(r3(k*k))} × ${A} = ${F(r3(k*k*A))} cm². Pour une réduction, l'aire diminue.`, sx:S_AIR}; }},
     {g:()=>{ const kk=pick([2,3,4,5]); const A=ri(2,6); return {q:`Par une homothétie de centre O, une figure d'aire ${A} cm² a une image d'aire ${A*kk*kk} cm², du même côté de O. Quel est le rapport ?`, c:shuf(uniq(String(kk),[String(kk*kk),F(-kk),F(kk/2)])), rep:String(kk), ex:`L'aire est multipliée par ${A*kk*kk} ÷ ${A} = ${kk*kk} = ${kk}², donc la distance à zéro de k est ${kk}. Même côté : k = ${kk}.`, sx:S_AIR}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
  const G2a={k:2, P:{O:[0,0],A:[2,1],B:[4,1],C:[3,3]}, nm:["A","B","C"]};
  const G2b={k:-1.5, P:{O:[0,0],A:[2,0],B:[4,2],C:[2,4]}, nm:["A","B","C"]};
  const G3={P:{O:[0,0],A:[2,2],B:[6,2],C:[4,6]}, cn:"O", tri:["A","B","C"], grid:[-4,-4,10,10], k:22, imgs:[[1.5,"1"],[-0.5,"2"]], cen:[4,3]};
  return {
  titre:"Évaluation d'entraînement · chapitre 20", duree:50, info:"Durée : 50 min · Calculatrice autorisée · Règle graduée",
  comp:[
    ["CHERCHER","Je reconnais un agrandissement, une réduction et la position de l'image.","Ex. 1 (3 points)"],
    ["MODÉLISER","Je trouve le centre et le rapport d'une homothétie.","Ex. 2 (4 points)"],
    ["REPRÉSENTER","Je construis l'image d'une figure par une homothétie.","Ex. 3 (4 points)"],
    ["CALCULER","Je calcule des longueurs et des aires avec le rapport d'homothétie.","Ex. 4 et 5 (9 points)"]
  ],
  exos:[
  {t:"Vrai ou faux ?", p:3, h:`<p>Réponds par Vrai ou Faux. Justifie quand la réponse est « Faux ».</p><p>a) Une homothétie de rapport 0,8 est un agrandissement.</p><p>b) Par une homothétie de rapport −4, une figure et son image sont de part et d'autre du centre.</p><p>c) Une homothétie de rapport −1 est une reproduction.</p><p>d) Par une homothétie de rapport −2,5, les longueurs sont multipliées par 2,5.</p><p>e) Un point, son image et le centre d'une homothétie sont toujours alignés.</p><p>f) Par une homothétie de rapport 3, l'aire d'une figure est multipliée par 6.</p>`,
   c:`<p>a) Faux : −1 &lt; 0,8 &lt; 1, c'est une réduction. · b) Vrai (k &lt; 0). · c) Vrai. · d) Vrai (distance à zéro de −2,5). · e) Vrai. · f) Faux : elle est multipliée par 3² = 9.</p><p><i>0,5 point par réponse.</i></p>`},
  {t:"Trouver le centre et le rapport", p:4, h:`<p>Dans chaque cas, le triangle A'B'C' est l'image du triangle ABC par une homothétie. Donne son centre et son rapport, en t'aidant du quadrillage.</p><div class="figs">${fig("Cas a)",randFig(G2a,false,300))}${fig("Cas b)",randFig(G2b,false,300))}</div>`,
   c:`<div class="figs">${fig("Cas a)",randFig(G2a,true,300))}${fig("Cas b)",randFig(G2b,true,300))}</div><p><b>a)</b> Les droites (AA'), (BB') et (CC') se coupent en O : centre <b>O</b>. OA' = 2 × OA et A' est du même côté que A : rapport <b>2</b>. <i>(1 point pour le centre, 1 point pour le rapport)</i></p><p><b>b)</b> Centre <b>O</b>. OA' = 1,5 × OA (3 carreaux au lieu de 2) et les triangles sont de part et d'autre de O : rapport <b>−1,5</b>. <i>(1 point pour le centre, 1 point pour le rapport)</i></p>`},
  {t:"Construire des images", p:4, h:`<p>Recopie la figure sur ton cahier en respectant les carreaux.</p><p><b>a)</b> Trace le triangle ${sub("A",1)}${sub("B",1)}${sub("C",1)}, image du triangle ABC par l'homothétie de centre O et de rapport 1,5.</p><p><b>b)</b> Trace le triangle ${sub("A",2)}${sub("B",2)}${sub("C",2)}, image du triangle ABC par l'homothétie de centre O et de rapport −0,5.</p>${homFig(G3)}`,
   c:`${homFig({...G3, show:true})}<p><b>a)</b> On multiplie les déplacements depuis O par 1,5.</p><p>De O à A : 2 carreaux vers la droite et 2 vers le haut, donc ${sub("A",1)} est à 3 vers la droite et 3 vers le haut de O.</p><p>De O à B : 6 vers la droite et 2 vers le haut, donc ${sub("B",1)} est à 9 vers la droite et 3 vers le haut.</p><p>De O à C : 4 vers la droite et 6 vers le haut, donc ${sub("C",1)} est à 6 vers la droite et 9 vers le haut. <i>(2 points)</i></p><p><b>b)</b> On prend la moitié des déplacements, dans l'autre sens : ${sub("A",2)} est à 1 carreau vers la gauche et 1 vers le bas de O ; ${sub("B",2)} à 3 vers la gauche et 1 vers le bas ; ${sub("C",2)} à 2 vers la gauche et 3 vers le bas. <i>(2 points)</i></p>`},
  {t:"Calculer des longueurs", p:5, h:`<p>Le triangle RST est tel que RS = 4,8 cm, ST = 3,6 cm et RT = 6 cm.</p><p>Le triangle R'S'T' est l'image du triangle RST par l'homothétie de centre O et de rapport −2,5.</p><p><b>a)</b> R'S'T' est-il un agrandissement ou une réduction de RST ? Les deux triangles sont-ils du même côté de O ?</p><p><b>b)</b> Calcule R'S', S'T' et R'T'.</p><p><b>c)</b> Un autre triangle UVW est l'image de RST par une homothétie de centre O ; UV = 1,2 cm est l'image de RS et les deux triangles sont du même côté de O. Calcule le rapport de cette homothétie.</p>`,
   c:`<p><b>a)</b> −2,5 &lt; −1 : c'est un agrandissement (de rapport 2,5). k &lt; 0 : les triangles sont de part et d'autre de O. <i>(1 point)</i></p><p><b>b)</b></p><div class="calcs"><p class="calc">R'S' = 2,5 × 4,8<br>R'S' = 12 cm</p><p class="calc">S'T' = 2,5 × 3,6<br>S'T' = 9 cm</p><p class="calc">R'T' = 2,5 × 6<br>R'T' = 15 cm</p></div><p><i>(1 point par longueur)</i></p><p><b>c)</b> ${"{UV/RS}"} = ${"{1,2/4,8}"} = 0,25 et les triangles sont du même côté de O : k = 0,25. <i>(1 point)</i></p>`},
  {t:"Calculer des aires", p:4, h:`<p><b>a)</b> Un logo a une aire de 12 cm². On l'agrandit par une homothétie de rapport 1,5. Quelle est l'aire du logo agrandi ?</p><p><b>b)</b> Une figure d'aire 50 cm² a pour image, par une homothétie de centre O, une figure d'aire 2 cm². La figure et son image sont de part et d'autre de O. Quel est le rapport de cette homothétie ?</p>`,
   c:`<p><b>a)</b> L'aire est multipliée par 1,5² = 2,25 :</p><p class="calc">A' = 2,25 × 12<br>A' = <b>27 cm²</b></p><p><i>(2 points)</i></p><p><b>b)</b> L'aire est multipliée par ${"{2/50}"} = 0,04 = 0,2². La distance à zéro de k est donc 0,2 et, comme les figures sont de part et d'autre de O, <b>k = −0,2</b>. <i>(1 point pour 0,2, 1 point pour le signe)</i></p>`}
  ]};
})()
};
window.G3k20={V, geo, F, ang, fig, sub, homFig, randHom, randFig, natTxt, az};
})();
