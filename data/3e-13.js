/* 3e — Chapitre 13 : Le théorème de Thalès (calcul de longueur) — cours complété (scan « Cours G2 » de M. Staal),
   activités d'introduction et fiche d'exercices de M. Staal.
   Figures du cours et de la fiche : celles des documents Word (img/3k13co, img/3k13ex) ; figures recadrées pour les
   exercices de manuels inclus dans la fiche. Figures de l'activité 1, du QCM, de l'entraînement et de l'éval : SVG calculés. */
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

const co=(p,alt,w,e="png")=>img("3k13co/"+p+"."+e,alt,w), ex=(p,alt,w)=>img("3k13ex/"+p+".png",alt,w);
const Fr=(a,b)=>`{${a}/${b}}`;

/* ------------------------------------------------------------------
   Configuration de Thalès : sommet A, points M ∈ (AB) et N ∈ (AC), M = k·B et N = k·C
   (0 < k < 1 : première configuration ; k < 0 : deuxième configuration, « papillon »)
   n = {A,M,N,B,C} noms · lens {AM:"…", …} longueurs écrites · rot rotation (degrés)
------------------------------------------------------------------ */
function thalesFig(o){
  const {n={A:"A",M:"M",N:"N",B:"B",C:"C"}, AB=6, AC=5, ang0=38, k=0.5, rot=0, lens={}, w=300, par=true} = o;
  const u=[Math.cos(rot*Math.PI/180),Math.sin(rot*Math.PI/180)], v=[Math.cos((rot+ang0)*Math.PI/180),Math.sin((rot+ang0)*Math.PI/180)];
  const P={[n.A]:[0,0],[n.B]:V.mul(u,AB),[n.C]:V.mul(v,AC),[n.M]:V.mul(u,k*AB),[n.N]:V.mul(v,k*AC)};
  const ext=(p,q)=>{ const d=V.unit(V.sub(q,p)); return [V.sub(p,V.mul(d,0.5)),V.add(q,V.mul(d,0.5))]; };
  const lo=k<0?n.M:n.A, lo2=k<0?n.N:n.A;
  const L1=ext(P[lo],P[n.B]), L2=ext(P[lo2],P[n.C]);
  const pts={}; Object.entries(P).forEach(([kk,p])=>pts[kk]=p);
  const len=Object.entries(lens).map(([s,t])=>{ const a=n[s[0]]||s[0], b=n[s[1]]||s[1]; return [a,b,t]; });
  const xs=[...Object.values(P),L1[0],L1[1],L2[0],L2[1]].map(p=>p[0]), sc=Math.min(36,(w-70)/(Math.max(...xs)-Math.min(...xs)));
  return geo({P:pts, k:sc, pad:40, seg:[[L1[0],L1[1],"ln"],[L2[0],L2[1],"ln"],[n.M,n.N,par?"c":"ln"],[n.B,n.C,par?"c":"ln"]], x:Object.values(n), lab:Object.values(n), len, cen:V.mid(V.mid(P[n.B],P[n.C]),V.mid(P[n.M],P[n.N])), alt:o.alt||"Configuration de Thalès"});
}
const LET5=[{A:"A",M:"M",N:"N",B:"B",C:"C"},{A:"K",M:"L",N:"N",B:"M",C:"O"},{A:"R",M:"S",N:"T",B:"U",C:"V"},{A:"E",M:"F",N:"G",B:"H",C:"I"},{A:"O",M:"P",N:"Q",B:"R",C:"S"},{A:"C",M:"D",N:"E",B:"A",C:"B"}];
/* tirage d'une situation de Thalès avec des longueurs « propres » */
function randThales(conf){
  const k=conf===2?-pick([0.5,0.4,0.6,0.75,1.5,0.8,1.25]):pick([0.4,0.5,0.6,0.25,0.75,0.3,0.8]);
  let AB, AC, BC; do{ AB=pick([4,5,6,8,10,12,7.5,9]); AC=pick([3,4,5,6,8,9,7.2,4.5]); BC=pick([3,4,5,6,7,4.5,5.5,6.5]); }while(BC<=Math.abs(AB-AC)+0.8||BC>=AB+AC-0.8);
  const n=pick(LET5); return {k, AB, AC, BC, AM:r3(Math.abs(k)*AB), AN:r3(Math.abs(k)*AC), MN:r3(Math.abs(k)*BC), n, conf:conf||(k<0?2:1)};
}
/* figure tirée : angle au sommet compatible avec BC */
const angFor=(b,c,a)=>{ const cs=(b*b+c*c-a*a)/(2*b*c); return Math.acos(Math.max(-0.95,Math.min(0.95,cs)))*180/Math.PI; };
const randFig=(T,lens,w=300)=>thalesFig({n:T.n, AB:T.AB, AC:T.AC, k:T.k, ang0:angFor(T.AB,T.AC,T.BC), rot:ri(-15,15), lens:{}, w});

/* ===================== schémas ===================== */
const S_CONF=sch("Le théorème de Thalès", `${co("config","Les deux configurations de Thalès",300)}<p class="schN">Si A, M, B sont alignés, A, N, C sont alignés et (MN) // (BC), alors :</p><p class="calc">${Fr("AM","AB")} = ${Fr("AN","AC")} = ${Fr("MN","BC")}</p>`);
const S_RED=sch("Rédiger avec Thalès", `<p class="schN">1) Les points … sont alignés et les points … sont alignés.</p><p class="schN">2) Les droites (…) et (…) sont parallèles.</p><p class="schN">3) D'après le théorème de Thalès : ${Fr("AM","AB")} = ${Fr("AN","AC")} = ${Fr("MN","BC")}.</p><p class="schN">4) On remplace par les longueurs connues et on fait un produit en croix.</p>`);
const S_PC=sch("Le produit en croix", `<p class="calc">${Fr(3,7)} = ${Fr("1,40","AE")} donc AE = ${Fr("7 × 1,40",3)} ≈ 3,27 m</p><p class="schN">On multiplie en diagonale les deux nombres connus, puis on divise par le troisième.</p>`);

CH["3e-13"] = {
intro:"Le théorème de Thalès permet de calculer une longueur quand deux droites parallèles coupent deux droites sécantes : on l'utilise pour mesurer des hauteurs et des distances impossibles à mesurer directement.",
savoir:[
  "reconnaître une configuration de Thalès (deux alignements et deux droites parallèles) ;",
  "écrire les égalités de quotients du théorème de Thalès ;",
  "calculer une longueur à l'aide du théorème de Thalès, dans les deux configurations ;",
  "rédiger la démonstration (conditions, égalités, produit en croix) ;",
  "résoudre des problèmes concrets avec le théorème de Thalès."
],

/* ===================== COURS ===================== */
cours:[
{k:"0", t:"Rappel : triangles semblables", h:`
  <div class="retenir" data-l="Définition"><p>Des triangles sont semblables lorsque leurs angles sont de même mesure.</p></div>
  ${co("ts1","Triangles semblables ABC et EFD avec les angles de même mesure codés de la même couleur",300)}
  <p><b>Exemple :</b> les triangles ABC et EFD sont semblables car ${ang("ABC")} = ${ang("EFD")}, ${ang("BAC")} = ${ang("FED")} et ${ang("BCA")} = ${ang("FDE")}.</p>
  <div class="retenir" data-l="Propriété"><p>Si deux triangles sont semblables, alors les longueurs de leurs côtés sont deux à deux proportionnelles.</p></div>
  ${co("ts2","Triangles ABC (BA = 2 cm, BC = 3 cm, AC = 1,5 cm) et EFD (EF = 4 cm, FD = 6 cm, ED = 3 cm)",260)}
  <p><b>Exemple :</b> les triangles étant semblables, leurs côtés sont proportionnels deux à deux :</p><p class="calc">${Fr(4,2)} = ${Fr(3,"1,5")} = ${Fr(6,3)} = 2</p><p>On a donc l'égalité :</p><p class="calc">${Fr("EF","BA")} = ${Fr("FD","CB")} = ${Fr("ED","AC")}</p>`},
{k:"1", t:"Énoncé du théorème de Thalès", h:`
  <div class="retenir" data-l="Propriété"><p><b>Si</b> les points A, M, B sont alignés,</p><p>les points A, N et C sont alignés,</p><p>et si les droites (MN) et (BC) sont parallèles,</p><p><b>alors :</b></p><p class="calc">${Fr("AM","AB")} = ${Fr("AN","AC")} = ${Fr("MN","BC")}</p><p>On a aussi : ${Fr("AB","AM")} = ${Fr("AC","AN")} = ${Fr("BC","MN")}</p></div>
  ${co("config","Première configuration (M sur [AB], N sur [AC]) et deuxième configuration (M et N de l'autre côté de A)",420)}
  <div class="retenir" data-l="Remarque"><p>Dans les deux cas, les triangles AMN et ABC sont semblables. Sur ces figures, le triangle ABC est un agrandissement du triangle AMN.</p></div>`},
{k:"2", t:"Calculer une longueur à l'aide du théorème de Thalès", h:`
  <div class="retenir" data-l="Méthode"><p><b>1)</b> J'écris les deux alignements de points.</p><p><b>2)</b> J'écris les deux droites parallèles (en le justifiant si besoin : deux droites perpendiculaires à une même droite sont parallèles).</p><p><b>3)</b> « D'après le théorème de Thalès, on peut écrire : » les trois quotients égaux.</p><p><b>4)</b> Je remplace par les longueurs connues et je calcule la longueur cherchée avec un produit en croix.</p></div>
  <h4>Exemple 1 : première configuration</h4>
  <p>Mattéo et Yasmine s'amusent à essayer de calculer la hauteur d'un arbre.</p><p>Mattéo, qui mesure 1,40 m, se place dans l'ombre de l'arbre, à 4 m de celui-ci.</p><p>Yasmine remarque que l'ombre de l'arbre mesure 7 m de long.</p><p>On considère que Mattéo et l'arbre sont perpendiculaires au sol. Quelle est la hauteur de l'arbre ?</p>
  ${co("arbre","L'arbre [AE], Mattéo [BD] et l'extrémité C de l'ombre",280)}
  <p>DC = 7 − 4 = 3 m.</p><p>Les points A, B, C sont alignés et les points C, D, E sont alignés.</p><p>On sait que (AE) ⊥ (EC) et (BD) ⊥ (EC), donc (AE) // (BD).</p><p>D'après le théorème de Thalès, on peut écrire :</p>
  <p class="calc">${Fr("BC","AC")} = ${Fr("CD","CE")} = ${Fr("BD","AE")} donc ${Fr("BC","AC")} = ${Fr(3,7)} = ${Fr("1,40","AE")}</p><p class="calc">À l'aide du produit en croix : AE = ${Fr("7 × 1,40",3)} ≈ 3,27 m</p><p>La hauteur de l'arbre est d'environ <b>3,27 m</b>.</p>
  <h4>Exemple 2 : deuxième configuration</h4>
  <p>On a modélisé géométriquement un tabouret pliant par les segments [CB] et [AD] pour l'armature métallique et le segment [CD] pour l'assise en toile.</p>${co("tabouret","Tabouret pliant : les pieds [CB] et [AD] se croisent en G",260,"jpg")}
  <p>On sait que CG = DG = 30 cm, AG = BG = 45 cm et AB = 51 cm.</p><p>Pour des raisons de confort, l'assise [CD] est parallèle au sol, ici représenté par la droite (AB). Détermine la longueur CD de l'assise.</p>
  <p>Les points C, G, B et les points A, G, D sont alignés. On sait également que (CD) // (AB).</p><p>D'après le théorème de Thalès, on peut écrire :</p>
  <p class="calc">${Fr("CG","GB")} = ${Fr("GD","GA")} = ${Fr("CD","AB")} donc ${Fr(30,45)} = ${Fr(30,45)} = ${Fr("CD",51)}</p><p class="calc">CD = ${Fr("30 × 51",45)} = 34 cm</p><p>L'assise a une longueur de <b>34 cm</b>.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Découvrir le théorème de Thalès", e:[
  {n:"Activité 1", t:"Hauteur du collège", w:"Sur ton cahier", h:`<p>M. Guinaudeau cherche à mesurer la hauteur du collège dont il est le directeur.</p><p>Tout d'abord, il remarque que l'ombre du collège mesure 12 m de long.</p><p>Ensuite, il se place dans l'ombre du bâtiment, de telle sorte qu'on ne voie pas sa propre ombre mais qu'il soit le plus loin possible du collège.</p><p>Sa distance avec la pointe de l'ombre est de 4 m. M. Guinaudeau mesure 1,80 m.</p><p>Quel calcul va-t-il faire pour estimer la hauteur du collège ?</p>
   ${geo({P:{C:[0,5.4],E:[0,0],B:[8,1.8],D:[8,0],A:[12,0]}, k:26, pad:30, box:[[-2.4,-1],[12.5,6]], poly:[[[[-2.2,0],[0,0],[0,5.4],[-2.2,5.4]],"orig"]], seg:[["C","A","d"],["B","D","k"],["E","A","ln"]], right:[["E","A","C"],["D","A","B"]], x:["A","B","C","D","E"], lab:["A","B","C","D","E"], off:{C:[6,-12],E:[0,18],D:[0,18],A:[6,-12],B:[-8,-12]}, len:[["D","A","4 m",1],["B","D","1,80 m",1]], txt:[["Collège",[-1.1,2.7],0,0,"font-size:14px"],["12 m (de E à A)",[6,-0.9],0,0,"fill:#1e5aa8;font-size:14px"]], alt:"Le collège [CE], M. Guinaudeau [BD] et la pointe de l'ombre A"})}`,
   c:`<p>Les triangles ABD et ACE sont semblables : le triangle ACE est un agrandissement du triangle ABD.</p><p>Le rapport d'agrandissement k est :</p><p class="calc">k = ${Fr("AE","AD")}<br>k = ${Fr(12,4)}<br>k = 3</p><p>Hauteur du collège :</p><p class="calc">CE = 3 × BD<br>CE = 3 × 1,80<br>CE = 5,40 m</p><p>Avec le théorème de Thalès : A, B, C sont alignés, A, D, E sont alignés et (BD) // (CE) (toutes les deux perpendiculaires au sol), donc ${Fr("AD","AE")} = ${Fr("BD","CE")}, soit ${Fr(4,12)} = ${Fr("1,80","CE")} et CE = ${Fr("12 × 1,80",4)} = <b>5,40 m</b>.</p>`},
  {n:"Activité 2", t:"Voile d'ombrage", w:"Sur ton cahier", h:`${ex("voile","Schéma de la voile d'ombrage : K, L, M alignés et K, N, O alignés",330)}<p>Des clients souhaitent installer, au-dessus de leur piscine, une grande voile d'ombrage construite sur mesure.</p><p>Elle se composera de deux parties détachables reliées par une fermeture éclair, comme le montre le schéma (qui n'est pas à l'échelle).</p><p><b>Données :</b></p><ul><li>la fermeture éclair est représentée par le segment [LN] ;</li><li>(LN) // (MO) ;</li><li>KL = 5 m ; KM = 8 m ; KO = 11,2 m ; MO = 10,4 m ;</li><li>les poteaux placés sur les points K, L et M sont alignés ;</li><li>les poteaux placés sur les points K, N et O sont alignés.</li></ul><p>Calcule la longueur de la fermeture éclair nécessaire pour cette voile d'ombrage.</p>`,
   c:`<p>Les points K, L, M sont alignés et les points K, N, O sont alignés. De plus, (LN) // (MO).</p><p>D'après le théorème de Thalès, on peut écrire :</p><p class="calc">${Fr("KL","KM")} = ${Fr("KN","KO")} = ${Fr("LN","MO")} donc ${Fr(5,8)} = ${Fr("KN","11,2")} = ${Fr("LN","10,4")}</p><p class="calc">LN = ${Fr("5 × 10,4",8)} = 6,5 m</p><p>La fermeture éclair doit mesurer <b>6,5 m</b>.</p>`},
  {n:"Activité 3", t:"Deuxième configuration", w:"Sur ton cahier", h:`<p>On sait que les droites (CE) et (DB) sont parallèles. Calcule la longueur AE.</p>${thalesFig({n:{A:"A",M:"C",N:"E",B:"B",C:"D"}, AB:3, AC:4.2, k:-2.5/3, ang0:30, rot:0, lens:{AM:"2,5 cm",AC:"4,2 cm",AB:"3 cm"}, w:300, alt:"Les droites (CE) et (DB) sont parallèles ; AC = 2,5 cm, AD = 4,2 cm, AB = 3 cm"})}`,
   c:`<p>Les points C, A, B sont alignés et les points E, A, D sont alignés. De plus, (CE) // (DB).</p><p>D'après le théorème de Thalès, on peut écrire :</p><p class="calc">${Fr("AC","AB")} = ${Fr("AE","AD")} = ${Fr("CE","BD")} donc ${Fr("2,5",3)} = ${Fr("AE","4,2")}</p><p class="calc">AE = ${Fr("2,5 × 4,2",3)} = 3,5 cm</p>`},
  {n:"Activité rapide", t:"Configuration de Thalès ?", w:"À l'oral", h:`<p>Dans quels cas peut-on utiliser le théorème de Thalès ?</p>${ex("configs","Quatre figures a), b), c) et d)",560)}`,
   c:`<p><b>a)</b> Non : (LN) // (MO), mais les points K, L et O ne sont pas alignés.</p><p><b>b)</b> Oui : K, N, M sont alignés, K, L, O sont alignés et (LN) // (MO).</p><p><b>c)</b> Non : on ne sait pas si (LN) et (MO) sont parallèles.</p><p><b>d)</b> Oui : K, N, M sont alignés, K, L et le point du bas sont alignés, et les deux droites qui portent les angles droits sont perpendiculaires à la même droite, donc parallèles.</p>`}
 ]},
{t:"Écrire les égalités de quotients", e:[
  {n:"Exercice 1", t:"Égalités de quotients", w:"Sur ta feuille", h:`<p>Dans chaque cas :</p><p><b>1)</b> Indique si l'on est ou non dans une configuration pour utiliser le théorème de Thalès. Si oui, indique les 3 conditions.</p><p><b>2)</b> Si oui, écris les égalités de quotients.</p><div class="figs">${fig("a)",ex("q10","Figure FGHIJ",230))}${fig("b)",ex("q11","Figure ABCDE",170))}${fig("c)",ex("q12","Figure PSARI, (PS) // (RI)",230))}${fig("d)",ex("q13","Figure COLSB",230))}</div><p><i>Dans le cas a), l'énoncé de la fiche indique (FG) // (IJ).</i></p>`,
   c:`<p><b>a)</b> Non : les points F, I et J ne sont pas alignés (et (IJ) ne peut pas être parallèle à (FG)). On ne peut pas utiliser le théorème de Thalès.</p>
   <p><b>b)</b> Non : A, E, C sont alignés et B, E, D sont alignés, mais on ne sait pas si (AB) et (DC) sont parallèles.</p>
   <p><b>c)</b> Oui : P, A, I sont alignés ; S, A, R sont alignés ; (PS) // (RI). Donc ${Fr("AP","AI")} = ${Fr("AS","AR")} = ${Fr("PS","IR")}.</p>
   <p><b>d)</b> Non : C, O, L sont alignés et S, B, L sont alignés, mais on ne sait pas si (OB) et (CS) sont parallèles. (Si on le savait, on écrirait ${Fr("LO","LC")} = ${Fr("LB","LS")} = ${Fr("OB","CS")}.)</p>`}
 ]},
{t:"Calculer une longueur", e:[
  {n:"Exercice 2", t:"Calculer une longueur en utilisant le théorème de Thalès", w:"Sur ta feuille", h:`<p><b>1)</b> Parmi ces quatre situations, entoure au crayon de bois celles qui sont dans une configuration de Thalès.</p><p><b>2)</b> Parmi les situations entourées, calcule la longueur demandée grâce au théorème de Thalès.</p>${ex("e1","Quatre situations : a) KN, b) SR, c) DE, d) FI",620)}`,
   c:`<p><b>1)</b> Les situations a), b) et c) sont des configurations de Thalès. Dans la situation d), on ne sait pas si (JI) et (GH) sont parallèles.</p>
   <p><b>a)</b> Les points K, O, N sont alignés et les points K, L, M sont alignés. De plus, (OL) // (NM).</p><p>D'après le théorème de Thalès :</p><p class="calc">${Fr("KO","KN")} = ${Fr("KL","KM")} = ${Fr("OL","NM")}<br>${Fr(5,"KN")} = ${Fr("1,8","4,5")}<br>KN = ${Fr("5 × 4,5","1,8")}<br>KN = 12,5</p><p>KN mesure <b>12,5 m</b>.</p>
   <p><b>b)</b> Les points L, R, M sont alignés et les points L, S, P sont alignés. De plus, (SR) // (PM).</p><p>D'après le théorème de Thalès :</p><p class="calc">${Fr("LR","LM")} = ${Fr("LS","LP")} = ${Fr("SR","PM")}<br>${Fr("5,2",8)} = ${Fr("SR",4)}<br>SR = ${Fr("5,2 × 4",8)}<br>SR = 2,6</p><p>SR mesure <b>2,6 cm</b>.</p>
   <p><b>c)</b> Les points C, D, B sont alignés et les points C, E, A sont alignés. De plus, (DE) // (BA).</p><p>D'après le théorème de Thalès :</p><p class="calc">${Fr("CD","CB")} = ${Fr("CE","CA")} = ${Fr("DE","BA")}<br>${Fr("7,5",12)} = ${Fr("DE",8)}<br>DE = ${Fr("7,5 × 8",12)}<br>DE = 5</p><p>DE mesure <b>5 cm</b>.</p>`},
  {n:"Exercice 3", t:"Calculer une longueur en utilisant le théorème de Thalès", w:"Sur ton cahier", h:`<p>Les droites (TR) et (CB) sont parallèles. Calcule la longueur TR.</p>${ex("e2","A, T, C alignés ; A, R, B alignés ; AR = 3,4 m ; RB = 1,5 m ; CB = 9 m",290)}`,
   c:`<p>A, T, C sont alignés et A, R, B sont alignés ; (TR) // (CB).</p><p class="calc">AB = AR + RB<br>AB = 3,4 + 1,5<br>AB = 4,9 m</p><p class="calc">${Fr("AT","AC")} = ${Fr("AR","AB")} = ${Fr("TR","CB")} donc ${Fr("3,4","4,9")} = ${Fr("TR",9)}</p><p class="calc">TR = ${Fr("3,4 × 9","4,9")} ≈ 6,24 m</p>`},
  {n:"Exercice 4", t:"Calcul d'une longueur", w:"Sur ton cahier", h:`<p>Dans chaque cas, indique les conditions qui te permettent d'utiliser le théorème de Thalès et calcule la longueur demandée.</p><div class="figs">${fig("a) Les droites (MN) et (TS) sont parallèles. Calcule la longueur RT.",ex("rt","MR = 4,5 cm ; RS = 1,8 cm ; MN = 4 cm ; RN = 3 cm",260))}${fig("b) (AC) // (OE). Calcule la longueur du segment [OE].",ex("oe","AB = 4,2 cm ; AC = 7 cm ; BC = 6,3 cm ; BO = 9 cm",230))}</div>`,
   c:`<p><b>a)</b> M, R, S sont alignés ; N, R, T sont alignés ; (MN) // (TS).</p><p class="calc">${Fr("RS","RM")} = ${Fr("RT","RN")} = ${Fr("TS","NM")} donc ${Fr("1,8","4,5")} = ${Fr("RT",3)} et RT = ${Fr("1,8 × 3","4,5")} = 1,2 cm</p>
   <p><b>b)</b> A, B, E sont alignés ; C, B, O sont alignés ; (AC) // (OE).</p><p class="calc">${Fr("BO","BC")} = ${Fr("BE","BA")} = ${Fr("OE","CA")} donc ${Fr(9,"6,3")} = ${Fr("OE",7)} et OE = ${Fr("9 × 7","6,3")} = 10 cm</p>`}
 ]},
{t:"Problèmes", e:[
  {n:"Exercice 5", t:"La hauteur de la pyramide de Khéops", w:"Sur ton cahier", h:`<p>Thalès est un mathématicien, philosophe et astronome grec né en −624. C'est le premier homme qui a pu déterminer la hauteur de la pyramide de Khéops.</p><p>Lors d'une journée ensoleillée, Thalès aurait placé sa canne de sorte que son ombre coïncide avec celle de la pyramide, comme sur le dessin.</p>${ex("kheops","La canne [IJ], la pyramide de hauteur [BC] et l'extrémité A des ombres",330)}<p>Il connaissait les mesures suivantes : IJ = 90 cm, DB = 116 m, IA = 1,9 m et AD = 202,9 m.</p><p>Détermine la hauteur de la pyramide de Khéops. Donne une valeur approchée au centième près.</p>`,
   c:`<p>A, I, B sont alignés ; A, J, C sont alignés ; (IJ) // (BC) (la canne et la hauteur sont verticales).</p><p class="calc">AB = AD + DB<br>AB = 202,9 + 116<br>AB = 318,9 m</p><p>IJ = 0,9 m.</p><p class="calc">${Fr("AI","AB")} = ${Fr("IJ","BC")} donc ${Fr("1,9","318,9")} = ${Fr("0,9","BC")}</p><p class="calc">BC = ${Fr("318,9 × 0,9","1,9")} ≈ 151,06 m</p><p>La pyramide mesure environ <b>151,06 m</b> de haut.</p>`},
  {n:"Exercice 6", t:"Estimation de la hauteur du Mont-Saint-Michel", w:"Sur ton cahier", h:`${ex("mont","Le Mont-Saint-Michel",260)}<p>Éric veut estimer la hauteur du Mont-Saint-Michel. Pour cela, il s'installe à 3,7 km du Mont et essaie de mesurer la hauteur du Mont avec une règle. La règle est :</p><ul><li>entre lui et le Mont ;</li><li>à 60 cm de ses yeux ;</li><li>parallèle à la hauteur du Mont-Saint-Michel.</li></ul><p>Sur sa règle, le sommet du Mont coïncide avec la graduation 1,5 cm.</p><p>Représente la situation avec un dessin à main levée, puis calcule la hauteur réelle du Mont-Saint-Michel.</p>${ex("mont2","Éric, sa règle et le Mont",300)}`,
   c:`<p><b>Le dessin à main levée :</b></p>${geo({P:{Y:[0,0],R:[3,0],S:[3,1.2],M:[12,0],H:[12,4.8]}, k:30, pad:34, box:[[0,-1.6],[14,0]], seg:[["Y","M","ln"],["Y","H","ln"],["R","S","c"],["M","H","c"]], x:["Y","R","S","M","H"], lab:["Y","R","S","M","H"], off:{Y:[-14,4],R:[0,20],S:[-12,-8],M:[0,20],H:[0,-12]}, txt:[["0,6 m",[1.5,0],0,16,"fill:#1e5aa8;font-size:14px"],["1,5 cm",[3,0.6],30,0,"fill:#1e5aa8;font-size:14px"],["3 700 m (de Y à M)",[6,0],0,42,"fill:#1e5aa8;font-size:14px"],["hauteur ?",[12,2.4],42,0,"fill:#1e5aa8;font-size:14px"]], alt:"Les yeux Y d'Éric, la règle [RS] et la hauteur [MH] du Mont"})}<p>(RS) // (MH)</p>
   <p>On note Y les yeux d'Éric, [RS] la partie de la règle (RS = 1,5 cm = 0,015 m) et [MH] la hauteur du Mont.</p><p>Les points Y, R, M sont alignés et les points Y, S, H sont alignés. De plus, (RS) // (MH).</p><p>La distance des yeux à la règle est YR = 0,6 m et la distance au Mont est YM = 3,7 km = 3 700 m.</p><p>D'après le théorème de Thalès :</p><p class="calc">${Fr("YR","YM")} = ${Fr("YS","YH")} = ${Fr("RS","MH")}<br>${Fr("0,6","3 700")} = ${Fr("0,015","MH")}<br>MH = ${Fr("3 700 × 0,015","0,6")}<br>MH = 92,5 m</p><p>Le Mont-Saint-Michel mesure environ <b>92,5 m</b> (la règle donne une estimation).</p>`},
  {n:"Exercice 7", t:"Réglage des feux de croisement", w:"Sur ton cahier", h:`<p>Pour effectuer un réglage rapide des feux de croisement d'un véhicule, on place celui-ci devant un mur vertical comme sur ce schéma.</p>${ex("feux","La voiture, les feux P, le mur [AB] et le point M",380)}<p>La portée des feux, représentée par le segment [HM], doit être de 30 m et la hauteur des feux, représentée par [HP], est égale à 80 cm.</p><p>La distance entre le mur et la voiture est de 3 m.</p><p>Calcule la hauteur de réglage AB.</p>`,
   c:`<p>M, B, P sont alignés ; M, A, H sont alignés ; (AB) // (HP) (perpendiculaires au sol).</p><p class="calc">MA = MH − HA<br>MA = 30 − 3<br>MA = 27 m</p><p class="calc">${Fr("MA","MH")} = ${Fr("AB","HP")} donc ${Fr(27,30)} = ${Fr("AB","0,8")} et AB = ${Fr("27 × 0,8",30)} = 0,72 m</p><p>La hauteur de réglage est <b>72 cm</b>.</p>`},
  {n:"Exercice 8", t:"Une bonne vue", w:"Sur ton cahier", h:`${ex("oeil","Schéma de l'œil : l'objet [AB], le point F et l'image [CD]",380)}<p>Le cristallin est une partie de l'œil qui projette sur la rétine une image de l'objet, réduite et inversée, selon le schéma.</p><p>L'objet [AB] et l'image de l'objet [CD] sont perpendiculaires à la droite (AC).</p><p><b>Données :</b> AB = 5,5 mm ; AC = 18 mm et AF = 16,5 mm.</p><p>Calcule la hauteur de l'image de cet objet.</p>`,
   c:`<p>A, F, C sont alignés ; B, F, D sont alignés ; (AB) // (CD) (perpendiculaires à (AC)).</p><p class="calc">FC = AC − AF<br>FC = 18 − 16,5<br>FC = 1,5 mm</p><p class="calc">${Fr("FC","FA")} = ${Fr("CD","AB")} donc ${Fr("1,5","16,5")} = ${Fr("CD","5,5")} et CD = ${Fr("1,5 × 5,5","16,5")} = 0,5 mm</p><p>L'image mesure <b>0,5 mm</b>.</p>`},
  {n:"Exercice 9", t:"Calcul du rayon de la Terre selon Ératosthène", w:"Sur ton cahier", h:`${ex("erato","Le centre C de la Terre, Syène S, Alexandrie A, l'obélisque [AE] et son ombre [AF]",260)}<p>Le mathématicien grec Ératosthène (−276 ; −194) évalua la longueur r du rayon de la Terre.</p><p>Pour cela, il observa les ombres le jour du solstice d'été, à midi, dans deux villes.</p><p>À Syène (au point S), les rayons du Soleil étaient verticaux : on pouvait voir le reflet du Soleil au fond d'un puits.</p><p>À Alexandrie (A), 800 km plus au nord, un obélisque [AE] de 8 m de haut avait une ombre [AF] de 1 m de long.</p><p>Comme le Soleil est très loin, on peut considérer que les droites qui vont de F au Soleil et de S au Soleil sont parallèles.</p><p>À l'aide du schéma, calcule le rayon de la Terre selon la méthode d'Ératosthène.</p>`,
   c:`<p>On considère que F, A, S sont alignés (l'arc de 800 km est assimilé à un segment) et que E, A, C sont alignés. Les droites (FE) et (SC) sont parallèles (rayons du Soleil).</p><p class="calc">${Fr("AF","AS")} = ${Fr("AE","AC")} donc ${Fr("1 m","800 km")} = ${Fr("8 m","AC")}</p><p class="calc">AC = 8 × 800 = 6 400 km</p><p>Le rayon de la Terre est d'environ <b>6 400 km</b> (la hauteur de l'obélisque est négligeable).</p>`},
  {n:"Exercice 10", t:"Fabrication de cisailles", w:"Sur ton cahier", h:`${ex("cisailles","Cisailles : poignées de 10 cm",300)}<p>On souhaite fabriquer des cisailles de façon qu'à un écartement de 14 cm des poignées corresponde une ouverture de 50 cm des lames (en jaune sur le schéma).</p><p>Quelle est la longueur d'une lame ? Donne un arrondi au dixième.</p>`,
   c:`<p>Les extrémités des poignées, l'axe et les extrémités des lames forment une deuxième configuration de Thalès : les segments qui joignent les extrémités des poignées (14 cm) et celles des lames (50 cm) sont parallèles.</p><p class="calc">${Fr("longueur d'une lame","10")} = ${Fr(50,14)} donc lame = ${Fr("10 × 50",14)} ≈ 35,7 cm</p><p>Une lame mesure environ <b>35,7 cm</b>.</p>`},
  {n:"Exercice 11", t:"Échelle de peintre", w:"Sur ton cahier", h:`${ex("echelle","Échelle de peintre : sommet A, barre [BB'], pieds C et C'",150)}<p>Détermine la longueur BB' pour que l'écartement CC' des pieds de l'échelle de peintre soit de 1,63 m. Le résultat sera donné au cm près.</p><p>Données : AB = 1,16 m et AC = 3,15 m. La droite (BB') est parallèle au sol.</p>`,
   c:`<p>A, B, C sont alignés ; A, B', C' sont alignés ; (BB') // (CC').</p><p class="calc">${Fr("AB","AC")} = ${Fr("BB'","CC'")} donc ${Fr("1,16","3,15")} = ${Fr("BB'","1,63")} et BB' = ${Fr("1,16 × 1,63","3,15")} ≈ 0,60 m</p><p>BB' doit mesurer environ <b>60 cm</b>.</p>`},
  {n:"Exercice 12", t:"La profondeur d'un puits", w:"Sur ton cahier", h:`${ex("puits","L'arpenteur : œil O, pieds T, bord du puits B, diamètre [CB], fond F",300)}<p>Dans l'Antiquité, un arpenteur mesurait la profondeur d'un puits dont on connaissait le diamètre, en alignant son œil avec le bord du puits et avec le coin opposé du fond du puits.</p><p>Connaissant la distance de recul par rapport au puits et la distance entre les pieds et l'œil de l'arpenteur, on pouvait en déduire la profondeur du puits.</p><p>À toi de la déterminer (OT = 1,50 m ; BT = 1 m ; CB = 1,20 m).</p>`,
   c:`<p>O, B, F sont alignés ; T, B, C sont alignés ; (OT) // (CF) (verticales).</p><p class="calc">${Fr("BC","BT")} = ${Fr("CF","TO")} donc ${Fr("1,20",1)} = ${Fr("CF","1,50")} et CF = 1,20 × 1,50 = 1,80 m</p><p>Le puits a une profondeur de <b>1,80 m</b>.</p>`}
 ]},
{t:"Pour aller plus loin", note:"Exercices de manuels inclus dans la fiche de M. Staal.", e:[
  {n:"Exercice 13", t:"Course à pied", w:"Sur ton cahier", h:`<p>Des élèves participent à une course à pied. Avant l'épreuve, un plan leur a été remis.</p><p>On convient que :</p><ul><li>les droites (AE) et (BD) se coupent en C ;</li><li>les droites (AB) et (DE) sont parallèles ;</li><li>ABC est un triangle rectangle en A.</li></ul><p>AB = 300 m ; AC = 400 m ; CE = 1 000 m.</p><p>Calcule la longueur réelle du parcours ABCDE.</p>${geo({P:{A:[0,0],B:[0,3],C:[4,0],D:[14,-7.5],E:[14,0]}, k:22, pad:30, pl:[[["A","B","C","D","E"],"c"]], seg:[["A","C","d"],["C","E","d"]], right:[["A","B","C"]], x:["A","B","C","D","E"], lab:["A","B","C","D","E"], cen:[6,-1], len:[["A","B","300 m"],["A","C","400 m",1],["C","E","1 000 m",1]], alt:"Parcours ABCDE"})}<p><i>(Schéma qui n'est pas à l'échelle et ne respecte pas les angles.)</i></p>`,
   c:`<p>Dans le triangle ABC rectangle en A, d'après le théorème de Pythagore :</p><p class="calc">BC² = AB² + AC²<br>BC² = 300² + 400²<br>BC² = 90 000 + 160 000<br>BC² = 250 000<br>BC = √250 000 = 500 m</p><p>Les points A, C, E sont alignés ; B, C, D sont alignés ; (AB) // (DE). D'après le théorème de Thalès :</p><p class="calc">${Fr("CE","CA")} = ${Fr("CD","CB")} = ${Fr("DE","AB")} donc ${Fr("1 000",400)} = ${Fr("CD",500)} = ${Fr("DE",300)}</p><p class="calc">{1 000/400} = 2,5<br>CD = 2,5 × 500 = 1 250 m<br>DE = 2,5 × 300 = 750 m</p><p>Parcours : 300 + 500 + 1 250 + 750 = <b>2 800 m</b>.</p>`},
  {n:"Exercice 14", t:"Éclipse de Soleil", w:"Sur ton cahier", h:`<p>Une éclipse de Soleil se produit lorsque la Lune passe entre le Soleil et la Terre et cache entièrement le Soleil.</p><p>Sur le schéma, un rayon part d'un point de la Terre, frôle le bord de la Lune et le bord du Soleil ; les rayons de la Lune et du Soleil sont parallèles.</p><p>On donne : distance Terre-Lune = 375 000 km ; distance Terre-Soleil = 150 000 000 km ; rayon de la Terre = 6 370 km ; rayon de la Lune = 1 750 km.</p><p>Calcule le rayon du Soleil.</p>`,
   c:`<p>Le point de la Terre, le centre de la Lune et le centre du Soleil sont alignés ; le point de la Terre, le bord de la Lune et le bord du Soleil aussi ; les rayons de la Lune et du Soleil sont parallèles.</p><p class="calc">${Fr("rayon du Soleil","1 750")} = ${Fr("150 000 000","375 000")} = 400</p><p class="calc">rayon du Soleil = 400 × 1 750 = 700 000 km</p><p>Le rayon du Soleil est d'environ <b>700 000 km</b> (le rayon de la Terre ne sert pas ici).</p>`},
  {n:"Exercice 15", t:"Vers le brevet (Nouvelle-Calédonie, 2013)", w:"Sur ton cahier", h:`<p>En se retournant lors d'une marche arrière, le conducteur d'une voiture voit le sol à 6 m derrière sa voiture. Sur le schéma, la zone grisée correspond à ce que le conducteur ne voit pas lorsqu'il regarde en arrière.</p>${ex("voiture","La voiture, [AE], [BD] et le point C",330)}<p>Données : (AE) // (BD) ; AE = 1,50 m ; BD = 1,10 m ; EC = 6 m.</p><p><b>a)</b> Calcule DC.</p><p><b>b)</b> Déduis-en que ED = 1,60 m.</p><p><b>c)</b> Une fillette mesure 1,10 m. Elle passe à 1,40 m derrière la voiture. Le conducteur peut-il la voir ? Explique.</p>`,
   c:`<p><b>a)</b> Les points C, D, E sont alignés et les points C, B, A sont alignés. De plus, (AE) // (BD).</p><p>D'après le théorème de Thalès :</p><p class="calc">${Fr("CD","CE")} = ${Fr("CB","CA")} = ${Fr("BD","AE")}<br>${Fr("CD",6)} = ${Fr("1,10","1,50")}<br>CD = ${Fr("6 × 1,10","1,50")}<br>CD = 4,4</p><p>DC mesure <b>4,4 m</b>.</p><p><b>b)</b></p><p class="calc">ED = EC − DC<br>ED = 6 − 4,4<br>ED = <b>1,60 m</b></p><p><b>c)</b> À 1,40 m de E, on est avant D : la zone cachée y est plus haute que BD = 1,10 m (elle mesure 1,50 × ${Fr("4,6",6)} = 1,15 m). La fillette, qui mesure 1,10 m, est entièrement cachée : <b>le conducteur ne peut pas la voir</b>.</p>`},
  {n:"Exercice 16", t:"Vers le brevet (Amérique du Nord, 2002)", w:"Sur ton cahier", h:`${ex("cones","Deux cônes de révolution opposés par le sommet S",200)}<p>Les deux cônes de révolution de rayons KA et IB sont opposés par le sommet.</p><p>Les droites (AB) et (KI) se coupent en S et, de plus, (BI) et (KA) sont parallèles.</p><p>On donne KA = 4,5 cm, KS = 6 cm et SI = 4 cm.</p><p><b>a)</b> Calcule BI.</p><p><b>b)</b> Calcule le volume V<sub>1</sub> du cône 1 (valeur exacte puis valeur arrondie au cm³).</p><p><b>c)</b> Le cône 2 est une réduction du cône 1. Quel est le coefficient de réduction ?</p><p><b>d)</b> Déduis-en le volume V<sub>2</sub> du cône 2.</p>`,
   c:`<p><b>a)</b> Les points A, S, B sont alignés et les points K, S, I sont alignés. De plus, (BI) // (KA).</p><p>D'après le théorème de Thalès :</p><p class="calc">${Fr("SI","SK")} = ${Fr("SB","SA")} = ${Fr("BI","AK")}<br>${Fr(4,6)} = ${Fr("BI","4,5")}<br>BI = ${Fr("4 × 4,5",6)}<br>BI = 3</p><p>BI mesure <b>3 cm</b>.</p><p><b>b)</b></p><p class="calc">V<sub>1</sub> = ${Fr("π × 4,5² × 6",3)}<br>V<sub>1</sub> = 40,5π<br>V<sub>1</sub> ≈ <b>127 cm³</b></p><p><b>c)</b></p><p class="calc">k = ${Fr("SI","SK")}<br>k = ${Fr(4,6)}<br>k = <b>${Fr(2,3)}</b></p><p><b>d)</b></p><p class="calc">V<sub>2</sub> = (${Fr(2,3)})³ × 40,5π<br>V<sub>2</sub> = ${Fr(8,27)} × 40,5π<br>V<sub>2</sub> = 12π<br>V<sub>2</sub> ≈ <b>38 cm³</b></p>`},
  {n:"Exercice 17", t:"Le tabouret pliant", w:"Sur ton cahier", h:`${ex("tabouret2","Tabouret pliant CDAB, les pieds se croisent en G",130)}<p>On a modélisé un tabouret pliant : CG = DG = 30 cm ; AG = BG = 45 cm.</p><p>L'assise [CD] est parallèle au sol, qui est représenté par la droite (AB).</p><p>Quelle doit être la longueur AB pour que la longueur CD de l'assise soit de 34 cm ?</p>`,
   c:`<p>C, G, B et D, G, A sont alignés ; (CD) // (AB).</p><p class="calc">${Fr("GB","GC")} = ${Fr("AB","CD")} donc ${Fr(45,30)} = ${Fr("AB",34)} et AB = ${Fr("45 × 34",30)} = 51 cm</p>`},
  {n:"Exercice 18", t:"Océane et le stade", w:"Sur ton cahier", h:`<p>Océane peut, malgré le collège, voir de sa fenêtre le stade dans son intégralité.</p>${ex("oceane","Immeuble d'Océane (35 m), collège de hauteur h, stade ; distances 20 m, 40 m et 45 m",440)}<p>Quelle est la hauteur maximale h du collège ?</p>`,
   c:`<p>On regarde le rayon visuel qui part de la fenêtre d'Océane (à 35 m) et arrive au début du stade. Il est à 20 + 40 + 45 = 105 m du pied de l'immeuble.</p><p>L'immeuble et le mur du collège sont verticaux, donc parallèles : configuration de Thalès de sommet le début du stade.</p><p class="calc">${Fr("h",35)} = ${Fr(45,105)} donc h = ${Fr("35 × 45",105)} = 15 m</p><p>Le collège mesure au plus <b>15 m</b>.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Reconnaître une configuration", schema:S_CONF, q:{
 1:[ {q:"Pour utiliser le théorème de Thalès, il faut…", c:["deux alignements de points et deux droites parallèles","un triangle rectangle","deux triangles de même aire"], rep:"deux alignements de points et deux droites parallèles", sx:S_CONF} ],
 2:[ {g:()=>{ const T=randThales(pick([1,2])); return {q:`Sur la figure, les points ${T.n.A}, ${T.n.M}, ${T.n.B} sont alignés et les points ${T.n.A}, ${T.n.N}, ${T.n.C} sont alignés. Quelle condition manque-t-il pour utiliser le théorème de Thalès ?`, fig:randFig(T,{}), c:shuf([`(${T.n.M}${T.n.N}) // (${T.n.B}${T.n.C})`,`(${T.n.M}${T.n.N}) ⊥ (${T.n.B}${T.n.C})`,`${T.n.A}${T.n.M} = ${T.n.A}${T.n.N}`]), rep:`(${T.n.M}${T.n.N}) // (${T.n.B}${T.n.C})`, ex:"Il faut que les deux droites qui ne passent pas par le sommet soient parallèles.", sx:S_CONF}; }} ],
 3:[ {q:"Deux droites perpendiculaires à une même droite sont…", c:["parallèles","perpendiculaires","sécantes"], rep:"parallèles", ex:"C'est ce qu'on utilise pour justifier le parallélisme d'un arbre et d'une personne, tous deux perpendiculaires au sol.", sx:S_RED},
     {q:"Le triangle AMN est obtenu dans une configuration de Thalès avec (MN) // (BC). Les triangles AMN et ABC sont…", c:["semblables","isométriques (superposables)","rectangles"], rep:"semblables", ex:"Dans les deux configurations, les triangles AMN et ABC ont les mêmes angles : l'un est un agrandissement de l'autre.", sx:S_CONF} ]
}},
{nom:"Les égalités de quotients", schema:S_CONF, q:{
 1:[ {g:()=>{ const T=randThales(1), n=T.n; const good=`${Fr(n.A+n.M,n.A+n.B)} = ${Fr(n.A+n.N,n.A+n.C)} = ${Fr(n.M+n.N,n.B+n.C)}`;
       return {q:`(${n.M}${n.N}) // (${n.B}${n.C}). Quelle égalité donne le théorème de Thalès ?`, fig:randFig(T,{}), c:shuf([good,`${Fr(n.A+n.M,n.M+n.B)} = ${Fr(n.A+n.N,n.N+n.C)} = ${Fr(n.M+n.N,n.B+n.C)}`,`${Fr(n.A+n.M,n.A+n.C)} = ${Fr(n.A+n.N,n.A+n.B)} = ${Fr(n.M+n.N,n.B+n.C)}`]), rep:good, ex:"On écrit les longueurs du petit triangle au numérateur et celles du grand triangle au dénominateur, côté par côté.", sx:S_CONF}; }} ],
 2:[ {g:()=>{ const T=randThales(2), n=T.n; const good=`${Fr(n.A+n.M,n.A+n.B)} = ${Fr(n.A+n.N,n.A+n.C)} = ${Fr(n.M+n.N,n.B+n.C)}`;
       return {q:`(${n.M}${n.N}) // (${n.B}${n.C}). Quelle égalité donne le théorème de Thalès ?`, fig:randFig(T,{}), c:shuf([good,`${Fr(n.A+n.M,n.A+n.C)} = ${Fr(n.A+n.N,n.A+n.B)} = ${Fr(n.M+n.N,n.B+n.C)}`,`${Fr(n.M+n.B,n.A+n.B)} = ${Fr(n.N+n.C,n.A+n.C)} = ${Fr(n.M+n.N,n.B+n.C)}`]), rep:good, ex:`Les triangles ${n.A}${n.M}${n.N} et ${n.A}${n.B}${n.C} ont le sommet ${n.A} en commun : on compare leurs côtés.`, sx:S_CONF}; }} ],
 3:[ {q:"Avec ses deux droites parallèles, une configuration de Thalès « papillon » (deuxième configuration) a son sommet commun…", c:["entre les deux droites parallèles","en dehors des deux droites parallèles","sur une des droites parallèles"], rep:"entre les deux droites parallèles", sx:S_CONF} ]
}},
{nom:"Calculer une longueur", schema:S_PC, q:{
 1:[ {g:()=>{ let a,b,c; do{ a=pick([2,3,4,5,6]); b=pick([6,8,10,12,15]); c=pick([3,4,6,9,12]); }while((b*c)%a||a>=b); const x=b*c/a; return {q:`${Fr(a,b)} = ${Fr(c,"x")}. Combien vaut x ?`, rep:[F(x)], ex:`x = ${Fr(`${b} × ${c}`,a)} = ${F(x)}.`, sx:S_PC}; }} ],
 2:[ {g:()=>{ const T=randThales(1), n=T.n; return {q:`(${n.M}${n.N}) // (${n.B}${n.C}). ${n.A}${n.M} = ${F(T.AM)} cm, ${n.A}${n.B} = ${F(T.AB)} cm et ${n.B}${n.C} = ${F(T.BC)} cm. Calcule ${n.M}${n.N} (en cm).`, fig:randFig(T,{AM:F(T.AM),AB:F(T.AB),BC:F(T.BC)}), rep:[F(T.MN),F(T.MN)+" cm"], ex:`${Fr(n.A+n.M,n.A+n.B)} = ${Fr(n.M+n.N,n.B+n.C)} donc ${n.M}${n.N} = ${Fr(`${F(T.AM)} × ${F(T.BC)}`,F(T.AB))} = ${F(T.MN)} cm.`, sx:S_CONF}; }} ],
 3:[ {g:()=>{ const T=randThales(2), n=T.n; return {q:`(${n.M}${n.N}) // (${n.B}${n.C}). ${n.A}${n.M} = ${F(T.AM)} cm, ${n.A}${n.B} = ${F(T.AB)} cm et ${n.A}${n.N} = ${F(T.AN)} cm. Calcule ${n.A}${n.C} (en cm).`, fig:randFig(T,{AM:F(T.AM),AB:F(T.AB),AN:F(T.AN)}), rep:[F(T.AC),F(T.AC)+" cm"], ex:`${Fr(n.A+n.M,n.A+n.B)} = ${Fr(n.A+n.N,n.A+n.C)} donc ${n.A}${n.C} = ${Fr(`${F(T.AB)} × ${F(T.AN)}`,F(T.AM))} = ${F(T.AC)} cm.`, sx:S_CONF}; }},
     {g:()=>{ const T=randThales(1), n=T.n; return {q:`(${n.M}${n.N}) // (${n.B}${n.C}). ${n.A}${n.N} = ${F(T.AN)} cm, ${n.A}${n.C} = ${F(T.AC)} cm et ${n.M}${n.N} = ${F(T.MN)} cm. Calcule ${n.B}${n.C} (en cm).`, fig:randFig(T,{AN:F(T.AN),AC:F(T.AC),MN:F(T.MN)}), rep:[F(T.BC),F(T.BC)+" cm"], ex:`${Fr(n.A+n.N,n.A+n.C)} = ${Fr(n.M+n.N,n.B+n.C)} donc ${n.B}${n.C} = ${Fr(`${F(T.AC)} × ${F(T.MN)}`,F(T.AN))} = ${F(T.BC)} cm.`, sx:S_CONF}; }} ]
}},
{nom:"Problèmes", schema:S_RED, q:{
 1:[ {g:()=>{ const om=pick([3,4,5,6,8]), h=pick([1.5,1.6,1.8,2]), k=pick([2,3,4,5]); const L=om*k; return {q:`Une personne de ${F(h)} m se tient à ${om} m de l'extrémité de l'ombre d'un arbre. L'ombre de l'arbre mesure ${L} m. Quelle est la hauteur de l'arbre (en m) ?`, rep:[F(r3(h*k)),F(r3(h*k))+" m"], ex:`${Fr(om,L)} = ${Fr(F(h),"h")} donc h = ${Fr(`${L} × ${F(h)}`,om)} = ${F(r3(h*k))} m.`, sx:S_RED}; }} ],
 2:[ {g:()=>{ let cg,ag,cd; do{ cg=pick([20,24,30,36]); ag=pick([30,36,45,48,54]); cd=pick([24,30,34,36,40]); }while((cd*ag*100)%cg||ag<=cg); const ab=cd*ag/cg; return {q:`Tabouret pliant : CG = DG = ${cg} cm, AG = BG = ${ag} cm, (CD) // (AB) et CD = ${cd} cm. Combien mesure AB (en cm) ?`, rep:[F(ab,2),F(ab,2)+" cm"], ex:`${Fr("AB","CD")} = ${Fr("AG","DG")} donc AB = ${Fr(`${cd} × ${ag}`,cg)} = ${F(ab,2)} cm.`, sx:S_RED}; }} ],
 3:[ {g:()=>{ let hp,hm,ha,ab; do{ hp=pick([0.6,0.7,0.8,0.9]); hm=pick([20,25,30,40]); ha=pick([2,3,4,5]); ab=hp*(hm-ha)/hm; }while(Math.abs(ab*1e4-Math.round(ab*1e4))>1e-6); ab=Math.round(ab*1e4)/1e4; return {q:`Réglage des feux : HP = ${F(hp)} m, HM = ${hm} m et le mur est à HA = ${ha} m de la voiture. Quelle est la hauteur de réglage AB (en cm) ?`, rep:[F(r3(ab*100)),F(r3(ab*100))+" cm"], ex:`MA = ${hm} − ${ha} = ${hm-ha} m. AB = ${Fr(`${F(hp)} × ${hm-ha}`,hm)} = ${F(ab,4)} m = ${F(r3(ab*100))} cm.`, sx:S_RED}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
  const F1=thalesFig({n:{A:"S",M:"R",N:"T",B:"U",C:"V"}, AB:7.5, AC:6, k:0.4, ang0:angFor(7.5,6,6.5), rot:-5, lens:{}, w:320, alt:"Figure de l'exercice 2"});
  const F2=thalesFig({n:{A:"O",M:"P",N:"Q",B:"R",C:"S"}, AB:6, AC:4.8, k:-0.75, ang0:angFor(6,4.8,4.8), rot:8, lens:{}, w:320, alt:"Figure de l'exercice 3"});
  return {
  titre:"Évaluation d'entraînement · chapitre 13", duree:50, info:"Durée : 50 min · Calculatrice autorisée",
  comp:[
    ["CHERCHER","Je reconnais une configuration de Thalès et j'écris les égalités de quotients.","Ex. 1 (3 points)"],
    ["CALCULER","Je calcule une longueur avec le théorème de Thalès en rédigeant.","Ex. 2 et 3 (10 points)"],
    ["MODÉLISER","Je résous un problème concret avec le théorème de Thalès.","Ex. 4 et 5 (7 points)"]
  ],
  exos:[
  {t:"Les bonnes conditions", p:3, h:`<p>Les points D, E, F sont alignés et les points D, G, H sont alignés. Les droites (EG) et (FH) sont parallèles. E est sur le segment [DF] et G sur le segment [DH].</p><p><b>a)</b> Fais une figure à main levée.</p><p><b>b)</b> Écris les égalités de quotients données par le théorème de Thalès.</p><p><b>c)</b> On ajoute un point K tel que D, K et F ne sont pas alignés. Peut-on utiliser le théorème de Thalès dans les triangles DKG et DFH ? Pourquoi ?</p>`,
   c:`<p><b>a)</b> Triangle DFH avec E sur [DF], G sur [DH] et (EG) parallèle à (FH) : <i>(0,5 point)</i></p>${geo({P:{D:[0,0],F:[6,-1.2],H:[4.6,2.6],E:[2.7,-0.54],G:[2.07,1.17]}, k:36, pad:30, seg:[["D","F","ln"],["D","H","ln"],["E","G","c"],["F","H","c"]], x:["D","E","F","G","H"], lab:["D","E","F","G","H"], off:{D:[-16,0],E:[0,20],F:[8,18],G:[-6,-12],H:[6,-12]}, alt:"Triangle DFH, E sur [DF], G sur [DH], (EG) parallèle à (FH)"})}<p>(EG) // (FH)</p><p><b>b)</b> ${Fr("DE","DF")} = ${Fr("DG","DH")} = ${Fr("EG","FH")} <i>(1,5 point)</i></p><p><b>c)</b> Non : il faut deux alignements avec le sommet commun ; D, K et F ne sont pas alignés. <i>(1 point)</i></p>`},
  {t:"Première configuration", p:5, h:`<p>Sur la figure, les points S, R, U sont alignés, ainsi que S, T, V. Les droites (RT) et (UV) sont parallèles.</p>${F1}<p>On donne SR = 3 cm, SU = 7,5 cm, UV = 6,5 cm et SV = 6 cm.</p><p><b>a)</b> Calcule RT.</p><p><b>b)</b> Calcule ST.</p>`,
   c:`<p>S, R, U sont alignés ; S, T, V sont alignés ; (RT) // (UV). D'après le théorème de Thalès : ${Fr("SR","SU")} = ${Fr("ST","SV")} = ${Fr("RT","UV")}. <i>(2 points)</i></p><p><b>a)</b> ${Fr(3,"7,5")} = ${Fr("RT","6,5")} donc RT = ${Fr("3 × 6,5","7,5")} = 2,6 cm. <i>(1,5 point)</i></p><p><b>b)</b> ${Fr(3,"7,5")} = ${Fr("ST",6)} donc ST = ${Fr("3 × 6","7,5")} = 2,4 cm. <i>(1,5 point)</i></p>`},
  {t:"Deuxième configuration", p:5, h:`<p>Les droites (PR) et (QS) se coupent en O. Les droites (PQ) et (RS) sont parallèles.</p>${F2}<p>On donne OP = 4,5 cm, OR = 6 cm, PQ = 3,6 cm et OS = 4,8 cm.</p><p><b>a)</b> Calcule RS.</p><p><b>b)</b> Calcule OQ.</p>`,
   c:`<p>P, O, R sont alignés ; Q, O, S sont alignés ; (PQ) // (RS). D'après le théorème de Thalès : ${Fr("OP","OR")} = ${Fr("OQ","OS")} = ${Fr("PQ","RS")}. <i>(2 points)</i></p><p><b>a)</b> ${Fr("4,5",6)} = ${Fr("3,6","RS")} donc RS = ${Fr("6 × 3,6","4,5")} = 4,8 cm. <i>(1,5 point)</i></p><p><b>b)</b> ${Fr("4,5",6)} = ${Fr("OQ","4,8")} donc OQ = ${Fr("4,5 × 4,8",6)} = 3,6 cm. <i>(1,5 point)</i></p>`},
  {t:"Le lampadaire", p:4, h:`<p>Un soir, Lina (1,60 m) se tient debout à 5 m d'un lampadaire. Son ombre sur le sol mesure 2 m.</p><p>Le lampadaire et Lina sont perpendiculaires au sol. La lampe, le sommet de la tête de Lina et l'extrémité de son ombre sont alignés.</p><p>Calcule la hauteur du lampadaire. Rédige ta réponse.</p>`,
   c:`<p>On note L la lampe, P le pied du lampadaire, T la tête de Lina, F ses pieds et E l'extrémité de l'ombre. E, T, L sont alignés ; E, F, P sont alignés ; (TF) // (LP) car elles sont toutes les deux perpendiculaires au sol. <i>(1,5 point)</i></p><p>EP = 2 + 5 = 7 m. D'après le théorème de Thalès : ${Fr("EF","EP")} = ${Fr("TF","LP")} donc ${Fr(2,7)} = ${Fr("1,60","LP")}. <i>(1,5 point)</i></p><p>LP = ${Fr("7 × 1,60",2)} = 5,6 m : le lampadaire mesure 5,60 m. <i>(1 point)</i></p>`},
  {t:"La rampe", p:3, h:`<p>Une rampe d'accès [AC] monte régulièrement. À 1,2 m du point de départ A (mesuré sur le sol), un poteau vertical [BD] mesure 0,15 m entre le sol et la rampe. Au bout de la rampe, le sol est à 4,8 m du point A.</p><p>Quelle est la hauteur de la rampe à son extrémité C ?</p>`,
   c:`<p>A, B, E sont alignés (sur le sol, E au pied de C) ; A, D, C sont alignés (sur la rampe) ; (BD) // (EC) (verticales). <i>(1 point)</i></p><p class="calc">${Fr("AB","AE")} = ${Fr("BD","EC")} donc ${Fr("1,2","4,8")} = ${Fr("0,15","EC")} et EC = ${Fr("4,8 × 0,15","1,2")} = 0,6 m <i>(2 points)</i></p><p>La rampe atteint une hauteur de 0,6 m, soit 60 cm.</p>`}
  ]};
})()
};
window.G3k13={V, geo, F, ang, fig, Fr, thalesFig, randThales, randFig, LET5};
})();
