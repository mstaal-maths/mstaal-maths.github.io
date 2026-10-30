/* 4e — Chapitre 8 : Pyramide et cône (cours « Solides – La pyramide et le cône », activité d'introduction et fiche bilan,
   activité 2 « Pyramides » et fiche d'exercices de M. Staal). Images : documents Word (img/4k8co, 4k8ex, 4k8cr),
   recadrées comme dans les Word. Patrons et perspectives des corrections : dessinés en SVG à partir des longueurs. */
(function(){
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const co=(p,alt,w)=>img("4k8co/"+p+".png",alt,w), ex=(p,alt,w)=>img("4k8ex/"+p+".png",alt,w), cr=(p,alt,w)=>img("4k8cr/"+p+".png",alt,w);
const fig=(cap,body)=>{ const m=/^<img[^>]*width:(\d+)px/.exec(body); return `<figure${m?` style="max-width:${Math.max(+m[1],150)}px"`:""}>${body}${cap?`<figcaption>${cap}</figcaption>`:""}</figure>`; };
const r3=x=>Math.round(x*1000)/1000;
const F=x=>{ const r=r3(x); const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const f1=v=>v.toFixed(1);

/* ------------------------------------------------------------------
   Dessin sur quadrillage (coordonnées en carreaux, y vers le bas)
   segs [[p,q,"v"|"h"|"g"]] : v visible, h caché (pointillés), g donné (gris foncé) · pts [[nom,p,dx,dy]] · ell [[c,rx,ry,"front"|"back"|"full",style]]
------------------------------------------------------------------ */
function grid(o){
  const k=o.k||28, pad=o.pad??18, [W0,H0]=o.size, X=x=>pad+x*k, Y=y=>pad+y*k;
  const W=Math.round(W0*k+2*pad), H=Math.round(H0*k+2*pad);
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${Math.min(o.w||W,W)}" role="img" aria-label="${o.alt||"Figure sur quadrillage"}">`;
  if(!o.nogrid){ for(let x=0;x<=W0;x++) s+=`<line x1="${X(x)}" y1="${Y(0)}" x2="${X(x)}" y2="${Y(H0)}" class="gridl"/>`; for(let y=0;y<=H0;y++) s+=`<line x1="${X(0)}" y1="${Y(y)}" x2="${X(W0)}" y2="${Y(y)}" class="gridl"/>`; }
  const ST={v:"stroke:var(--ink);stroke-width:2.4", h:"stroke:var(--ink);stroke-width:2;stroke-dasharray:6 5", nv:"stroke:var(--c);stroke-width:2.6", nh:"stroke:var(--c);stroke-width:2.2;stroke-dasharray:6 5"};
  (o.ell||[]).forEach(([c,rx,ry,part,st])=>{ const cx=X(c[0]), cy=Y(c[1]), RX=rx*k, RY=ry*k;
    if(part==="full") s+=`<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(RX)}" ry="${f1(RY)}" style="fill:none;${ST[st||"v"]}"/>`;
    else s+=`<path d="M${f1(cx-RX)} ${f1(cy)} A${f1(RX)} ${f1(RY)} 0 0 ${part==="front"?0:1} ${f1(cx+RX)} ${f1(cy)}" style="fill:none;${ST[st||"v"]}"/>`; });
  (o.segs||[]).forEach(([p,q,t])=>{ s+=`<line x1="${f1(X(p[0]))}" y1="${f1(Y(p[1]))}" x2="${f1(X(q[0]))}" y2="${f1(Y(q[1]))}" style="${ST[t||"v"]};stroke-linecap:round"/>`; });
  (o.pts||[]).forEach(([n,p,dx=10,dy=-10,cross])=>{ const px=X(p[0]), py=Y(p[1]); if(cross) s+=`<path d="M${f1(px-4)} ${f1(py-4)}L${f1(px+4)} ${f1(py+4)}M${f1(px-4)} ${f1(py+4)}L${f1(px+4)} ${f1(py-4)}" style="stroke:var(--ink);stroke-width:1.8"/>`;
    s+=`<text x="${f1(px+dx)}" y="${f1(py+dy+5)}" text-anchor="middle" style="font-weight:700;font-size:16px;fill:var(--ink)">${n}</text>`; });
  return s+"</svg>";
}
/* pyramide à base parallélogramme F1 F2 B2 B1 (dans cet ordre) et sommet S, vue de dessus :
   une face latérale est vue si S est du même côté de son arête de base que l'intérieur de la base (la base est toujours cachée par dessous) */
const side=(p,a,b)=>Math.sign((b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]));
function pyrEdges(base,S){
  const n=base.length, c=[base.reduce((a,p)=>a+p[0],0)/n, base.reduce((a,p)=>a+p[1],0)/n];
  const front=base.map((p,i)=>{ const q=base[(i+1)%n]; return side(S,p,q)===side(c,p,q); });
  const E=[]; base.forEach((p,i)=>{ E.push([p,base[(i+1)%n],front[i]?"v":"h"]); E.push([S,p,(front[i]||front[(i-1+n)%n])?"v":"h"]); });
  return E;
}
const same=(a,b)=>Math.abs(a[0]-b[0])<1e-9&&Math.abs(a[1]-b[1])<1e-9;
const segEq=(e,g)=>(same(e[0],g[0])&&same(e[1],g[1]))||(same(e[0],g[1])&&same(e[1],g[0]));
/* figure à compléter (given) ou complétée (les traits ajoutés en couleur) */
function pyrFig(o, sol){
  const E=pyrEdges(o.base,o.S), segs=o.given.map(g=>[g[0],g[1],g[2]||"v"]);
  if(sol) E.forEach(e=>{ if(!o.given.some(g=>segEq(e,g))) segs.push([e[0],e[1],e[2]==="v"?"nv":"nh"]); });
  return grid({size:o.size, k:o.k||26, segs, pts:[["S",o.S,o.Sd?.[0]??10,o.Sd?.[1]??-10,o.cross]], w:o.w||230, alt:sol?"La pyramide complétée en perspective cavalière":"Début de la représentation d'une pyramide de sommet S"});
}
/* cône : sommet S, centre de la base c, rayons rx, ry */
function coneFig(o, sol){
  const {S,c,rx,ry}=o, L=[c[0]-rx,c[1]], R=[c[0]+rx,c[1]];
  const segs=[], ell=[];
  if(o.given.includes("L")) segs.push([S,L,"v"]); if(o.given.includes("R")) segs.push([S,R,"v"]); if(o.given.includes("front")) ell.push([c,rx,ry,"front","v"]);
  if(sol&&o.top){ segs.push([S,L,"nv"],[S,R,"nv"]); ell.push([c,rx,ry,"full","nv"]); return {segs, ell}; }
  if(sol){ if(!o.given.includes("L")) segs.push([S,L,"nv"]); if(!o.given.includes("R")) segs.push([S,R,"nv"]); if(!o.given.includes("front")) ell.push([c,rx,ry,"front","nv"]); ell.push([c,rx,ry,"back","nh"]);
    if(o.h){ segs.push([S,c,"nh"],[c,R,"nh"]); } }
  return {segs, ell};
}
function conesFig(list, sol, size, alt){ const segs=[], ell=[], pts=[];
  list.forEach(o=>{ const r=coneFig(o,sol); segs.push(...r.segs); ell.push(...r.ell); if(o.name) pts.push([o.name,o.S,10,-10]); });
  return grid({size, k:32, segs, ell, pts, w:420, alt}); }

/* ------------------------------------------------------------------
   Patrons (coordonnées en cm, y vers le haut) : polys [[noms]] · P {nom:[x,y]} · marks [[a,b,n]] codages · right [[sommet,a,b]]
------------------------------------------------------------------ */
function net(o){
  const P=o.P, all=Object.values(P), mx=Math.min(...all.map(p=>p[0])), Mx=Math.max(...all.map(p=>p[0])), my=Math.min(...all.map(p=>p[1])), My=Math.max(...all.map(p=>p[1]));
  const k=o.k||Math.min(26, 330/(Mx-mx), 330/(My-my)), pad=30, X=x=>pad+(x-mx)*k, Y=y=>pad+(My-y)*k;
  const W=Math.round((Mx-mx)*k+2*pad), H=Math.round((My-my)*k+2*pad), g=n=>P[n];
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${Math.min(o.w||W,W)}" role="img" aria-label="${o.alt||"Patron"}">`;
  (o.polys||[]).forEach((N,i)=>{ s+=`<polygon points="${N.map(n=>f1(X(g(n)[0]))+","+f1(Y(g(n)[1]))).join(" ")}" style="fill:${i===0?"color-mix(in srgb,var(--c) 18%,transparent)":"none"};stroke:var(--ink);stroke-width:2;stroke-linejoin:round"/>`; });
  (o.marks||[]).forEach(([a,b,n])=>{ const A=g(a), B=g(b), m=[(X(A[0])+X(B[0]))/2,(Y(A[1])+Y(B[1]))/2], d=[X(B[0])-X(A[0]),Y(B[1])-Y(A[1])], L=Math.hypot(...d), u=[d[0]/L,d[1]/L];
    for(let i=0;i<n;i++){ const off=(i-(n-1)/2)*5, c=[m[0]+u[0]*off,m[1]+u[1]*off]; s+=`<line x1="${f1(c[0]+u[1]*6)}" y1="${f1(c[1]-u[0]*6)}" x2="${f1(c[0]-u[1]*6)}" y2="${f1(c[1]+u[0]*6)}" style="stroke:#d0342c;stroke-width:2"/>`; } });
  (o.right||[]).forEach(([v,a,b])=>{ const V=[X(g(v)[0]),Y(g(v)[1])], ua=[X(g(a)[0])-V[0],Y(g(a)[1])-V[1]], ub=[X(g(b)[0])-V[0],Y(g(b)[1])-V[1]], la=Math.hypot(...ua), lb=Math.hypot(...ub), z=9;
    const p1=[V[0]+ua[0]/la*z,V[1]+ua[1]/la*z], p3=[V[0]+ub[0]/lb*z,V[1]+ub[1]/lb*z], p2=[p1[0]+ub[0]/lb*z,p1[1]+ub[1]/lb*z];
    s+=`<path d="M${f1(p1[0])} ${f1(p1[1])}L${f1(p2[0])} ${f1(p2[1])}L${f1(p3[0])} ${f1(p3[1])}" style="fill:none;stroke:var(--ink);stroke-width:1.5"/>`; });
  const cen=o.cen||[(mx+Mx)/2,(my+My)/2];
  (o.lab||Object.keys(P)).forEach(n=>{ const p=g(n); let d=o.off&&o.off[n]; if(!d){ let u=[p[0]-cen[0],p[1]-cen[1]]; const L=Math.hypot(...u)||1; d=[u[0]/L*15,-u[1]/L*15]; }
    s+=`<text x="${f1(X(p[0])+d[0])}" y="${f1(Y(p[1])+d[1]+5)}" text-anchor="middle" style="font-weight:700;font-size:15px;fill:var(--ink)">${n.replace(/\d+$/,"")}</text>`; });
  (o.len||[]).forEach(([a,b,t,dx=0,dy=0])=>{ const A=g(a), B=g(b); s+=`<text x="${f1((X(A[0])+X(B[0]))/2+dx)}" y="${f1((Y(A[1])+Y(B[1]))/2+dy+5)}" text-anchor="middle" style="font-size:14px;font-weight:600;fill:var(--ink)">${t}</text>`; });
  return s+"</svg>";
}
/* patron d'une pyramide SABCD dont l'arête [SA] est perpendiculaire à la base rectangle ABCD (AB = a, BC = b, SA = h) */
function netSA(a,b,h,o={}){
  const P={A:[0,0],B:[a,0],C:[a,b],D:[0,b]}, SB=Math.hypot(a,h), SD=Math.hypot(b,h);
  P.S1=[0,-h]; P.S2=[-h,0]; P.S3=[a+SB,0]; P.S4=[0,b+SD];
  return net({P, polys:[["A","B","C","D"],["A","B","S1"],["A","D","S2"],["B","C","S3"],["D","C","S4"]], right:[["A","B","S1"],["A","D","S2"],["B","C","S3"],["D","C","S4"]], marks:[["A","S1",1],["A","S2",1],["B","S1",2],["B","S3",2],["D","S2",3],["D","S4",3],["C","S3",4],["C","S4",4]], len:o.len||[], cen:[a/2,b/2], w:o.w||330, alt:o.alt||"Patron de la pyramide SABCD"});
}
/* patron d'une pyramide régulière à base carrée (côté c, arêtes latérales l) */
function netReg(c,l,N="SABCD",o={}){
  const [s,a,b,cc,d]=N.split(""), h=Math.sqrt(l*l-c*c/4), P={[a]:[0,0],[b]:[c,0],[cc]:[c,c],[d]:[0,c]};
  P[s+"1"]=[c/2,-h]; P[s+"2"]=[c+h,c/2]; P[s+"3"]=[c/2,c+h]; P[s+"4"]=[-h,c/2];
  return net({P, polys:[[a,b,cc,d],[a,b,s+"1"],[b,cc,s+"2"],[cc,d,s+"3"],[d,a,s+"4"]], marks:[[a,b,1],[b,cc,1],[cc,d,1],[d,a,1],[a,s+"1",2],[b,s+"1",2],[b,s+"2",2],[cc,s+"2",2],[cc,s+"3",2],[d,s+"3",2],[d,s+"4",2],[a,s+"4",2]], right:[[a,b,d]], len:o.len||[], cen:[c/2,c/2], w:o.w||300, alt:o.alt||"Patron d'une pyramide régulière à base carrée"});
}
/* patron du tétraèdre HDCB : HD perpendiculaire à la base, DCB rectangle en C, HD = DC = CB = a */
function netTet(a,o={}){
  const P={D:[0,0],C:[a,0],B:[a,a]}, DB=a*Math.SQRT2, HC=a*Math.SQRT2, u=[-1/Math.SQRT2,1/Math.SQRT2];
  P.H1=[0,-a]; P.H2=[u[0]*a,u[1]*a]; P.H3=[a+HC,0];
  return net({P, polys:[["D","C","B"],["D","C","H1"],["D","B","H2"],["C","B","H3"]], right:[["C","D","B"],["D","C","H1"],["D","B","H2"],["C","B","H3"]], marks:[["D","H1",1],["D","H2",1],["D","C",1],["C","B",1],["C","H1",2],["C","H3",2],["B","H2",3],["B","H3",3]], cen:[a*0.66,a*0.33], w:o.w||320, alt:o.alt||"Patron du tétraèdre HDCB"});
}
window.S48={grid, pyrEdges, pyrFig, coneFig, conesFig, net, netSA, netReg, netTet, F};

/* ===================== données ===================== */
const SOL=[ /* activité 1 : [n°, groupe, faces, sommets, arêtes, nb bases, nature, nb latérales, nature] */
 [1,"Parallélépipède rectangle",6,8,12,2,"rectangles",4,"rectangles"],
 [2,"Autre : cône de révolution",2,1,0,1,"disque",1,"portion de disque (face courbe)"],
 [3,"Cube",6,8,12,2,"carrés",4,"carrés"],
 [4,"Autre : pyramide à base rectangulaire",5,5,8,1,"rectangle",4,"triangles"],
 [5,"Cylindre",3,0,0,2,"disques",1,"face courbe (un rectangle quand on la déroule)"],
 [6,"Prisme droit à base triangulaire",5,6,9,2,"triangles",3,"rectangles"],
 [7,"Prisme droit à base hexagonale",8,12,18,2,"hexagones",6,"rectangles"],
 [8,"Autre : cône de révolution",2,1,0,1,"disque",1,"portion de disque (face courbe)"],
 [9,"Autre : pyramide à base triangulaire (tétraèdre)",4,4,6,1,"triangle",3,"triangles"]];
/* exercice 2 : figures de M. Staal (en carreaux) */
const PY=[
 {size:[10,11], base:[[1,10],[6,10],[9,7],[4,7]], S:[5,1.5], given:[[[1,10],[6,10]],[[6,10],[9,7]],[[1,10],[4,7],"h"],[[4,7],[9,7],"h"],[[5,1.5],[4,7],"h"]], Sd:[10,-6]},
 {size:[8,8], base:[[1,7],[5,7],[7,4],[3,4]], S:[4,1], given:[[[1,7],[5,7]],[[5,7],[7,4]],[[4,1],[5,7]]], cross:true, Sd:[0,-14]},
 {size:[11,9], base:[[0,8],[8,8],[10,6],[2,6]], S:[5,1], given:[[[0,8],[8,8]],[[8,8],[10,6]]], cross:true, Sd:[0,-14]},
 {size:[8,10], base:[[0,9],[3,9],[8,3],[5,3]], S:[3,4], given:[[[0,9],[5,3],"h"],[[5,3],[8,3]]], cross:true, Sd:[0,-14]}];
const CONES=[{S:[2,0],c:[2,4],rx:2,ry:0.5,given:["L","front"]},{S:[7,1],c:[7,4],rx:2,ry:0.5,given:["L","R"]}];
/* défi : P1 P2 P3 P4 */
const DF={P1:[1,3],P2:[3,1],P3:[6,2],P4:[6,7]};
function defiFig(kind){ const {P1,P2,P3,P4}=DF, d=[0,5], ad=p=>[p[0]+d[0],p[1]+d[1]], Q=[P1[0]+P3[0]-P2[0],P1[1]+P3[1]-P2[1]];
  const segs=[[P1,P2,"v"],[P2,P3,"v"],[P3,P4,"v"]];
  if(kind==="pave") segs.push([P1,Q,"nv"],[Q,P3,"nv"],[P1,ad(P1),"nv"],[Q,ad(Q),"nv"],[ad(P1),ad(Q),"nv"],[ad(Q),P4,"nv"],[P2,ad(P2),"nh"],[ad(P2),ad(P1),"nh"],[ad(P2),P4,"nh"]);
  if(kind==="prisme1") segs.push([P1,P3,"nv"],[P1,ad(P1),"nv"],[ad(P1),P4,"nv"],[P2,ad(P2),"nh"],[ad(P2),ad(P1),"nh"],[ad(P2),P4,"nh"]);
  if(kind==="prisme2"){ const v=[P1[0]-P2[0],P1[1]-P2[1]], m=p=>[p[0]+v[0],p[1]+v[1]]; segs.push([P1,m(P3),"nv"],[P3,m(P3),"nv"],[m(P3),m(P4),"nv"],[P4,m(P4),"nv"],[P1,m(P4),"nv"],[P2,P4,"nh"]); }
  return grid({size:[7,10], k:26, segs, w:200, alt:kind==="pave"?"Le parallélépipède rectangle":"Un prisme droit à base triangulaire"}); }

/* ===================== schémas ===================== */
const S_SOL=sch("Les solides déjà connus", `<p class="schN"><b>Prisme droit</b> : 2 bases polygones parallèles et superposables, faces latérales rectangles.</p><p class="schN"><b>Pavé droit</b> : toutes les faces sont des rectangles. <b>Cube</b> : toutes les faces sont des carrés.</p><p class="schN"><b>Cylindre</b> : 2 bases disques, une face latérale qui se déroule en rectangle.</p>`);
const S_PYR=sch("La pyramide", `${co("def","Pyramide : sommet, hauteur, base polygone, faces latérales triangles",300)}<p class="schN">Une base polygone, des faces latérales triangles qui se rejoignent au sommet. La hauteur est perpendiculaire à la base.</p>`);
const S_PART=sch("Pyramides particulières", `<p class="schN"><b>Tétraèdre</b> : la base est un triangle (4 faces triangulaires).</p><p class="schN"><b>Pyramide régulière</b> : la base est un polygone régulier et les faces latérales sont des triangles isocèles identiques.</p>`);
const S_PAT=sch("Patron d'une pyramide", `${co("patron","Patron d'une pyramide régulière à base carrée",170)}<p class="schN">La base, et un triangle sur chaque côté de la base. Les arêtes qui se rejoignent au sommet ont la même longueur deux à deux.</p>`);
const S_CONE=sch("Le cône de révolution", `${co("cone2","Cône : sommet S, hauteur [SO], génératrice [SA], base disque",120)}<p class="schN">Base : un disque. Face latérale : une portion de disque. [SO] est la hauteur, [SA] une génératrice. On l'obtient en faisant tourner le triangle SOA rectangle en O autour de [SO].</p>`);

/* ---------- générateurs ---------- */
const POLY={3:"triangle",4:"quadrilatère",5:"pentagone",6:"hexagone",8:"octogone"};
const qCount=()=>{ const n=pick([3,4,5,6,8]), w=pick(["faces","sommets","arêtes"]), good=w==="arêtes"?2*n:n+1; return {q:`Une pyramide a pour base un ${POLY[n]}. Combien a-t-elle ${w==='arêtes'?"d'arêtes":'de '+w} ?`, c:uniq(String(good),[String(n),String(2*n+2),String(3*n),String(n+2)]).slice(0,4), rep:String(good), ex:`Base à ${n} côtés : ${n} faces latérales + 1 base = ${n+1} faces ; ${n} sommets de la base + le sommet = ${n+1} sommets ; ${n} arêtes de la base + ${n} arêtes latérales = ${2*n} arêtes.`, sx:S_PYR}; };

CH["4e-8"] = {
intro:"Deux nouveaux solides qui ont un sommet : la pyramide (base polygone, faces latérales triangles) et le cône de révolution (base disque). On apprend à les reconnaître, à les représenter en perspective cavalière et à construire leurs patrons.",
savoir:[
  "reconnaître un prisme droit, un pavé, un cube, un cylindre, une pyramide et un cône ;",
  "connaître le vocabulaire : base, face latérale, sommet, arête, hauteur, génératrice ;",
  "reconnaître un tétraèdre et une pyramide régulière ;",
  "construire le patron d'une pyramide ;",
  "représenter une pyramide et un cône en perspective cavalière."
],

/* ===================== COURS ===================== */
cours:[
{k:"0", t:"Rappels : les solides déjà connus", h:`
  <p>Bilan de l'activité 1 (solides vus en 6e et en 5e).</p>
  <div class="retenir" data-l="Définition"><p><b>Le prisme droit</b> est un solide qui a :</p><ul><li>deux faces parallèles et superposables, appelées <b>bases</b>, qui sont des <b>polygones</b> ;</li><li>des <b>faces latérales</b> qui sont toutes des <b>rectangles</b>.</li></ul></div>
  <div class="retenir" data-l="Définition"><p>Le <b>parallélépipède rectangle</b> (ou pavé droit) est un prisme droit particulier : toutes ses faces sont des <b>rectangles</b>.</p><p>Le <b>cube</b> est un prisme droit particulier : toutes ses faces sont des <b>carrés</b>.</p></div>
  <div class="retenir" data-l="Définition"><p><b>Le cylindre de révolution</b> est un solide qui a :</p><ul><li>deux <b>bases</b> parallèles et superposables qui sont des <b>disques</b> ;</li><li>une <b>face latérale</b> dont le patron est un <b>rectangle</b>.</li></ul></div>`},
{k:"1", t:"La pyramide", h:`
  <h4>a) Définition</h4>
  <div class="retenir" data-l="Définition"><p>La <b>pyramide</b> est un solide constitué :</p><ul><li>d'une <b>base</b> qui est un <b>polygone</b> ;</li><li>de <b>faces latérales</b> qui sont des <b>triangles</b>.</li></ul><p>Le sommet commun aux faces latérales triangulaires s'appelle <b>le sommet</b> de la pyramide.</p><p><b>La hauteur</b> de la pyramide est le segment qui représente la distance entre le sommet et la base de la pyramide (<b>segment perpendiculaire à la base</b>).</p></div>
  <p><b>Exemple :</b> la pyramide de sommet S et de hauteur [SH].</p>${co("def","La pyramide : le sommet S, la hauteur [SH], une arête latérale, une face latérale (un triangle) et la base (un polygone)",400)}
  <h4>b) Pyramides particulières</h4>
  <div class="retenir" data-l="Définition"><p>Un <b>tétraèdre</b> est une pyramide dont la base est un triangle.</p></div>
  ${co("tetra","Un tétraèdre : la base est un triangle",260)}
  <div class="retenir" data-l="Définition"><p>Une <b>pyramide régulière</b> est une pyramide dont la <b>base</b> est un <b>polygone régulier</b> et dont les <b>faces latérales</b> sont des <b>triangles isocèles identiques</b>.</p><p>Par exemple, un triangle équilatéral est un polygone régulier car il a 3 côtés de même longueur ; un carré est un polygone régulier…</p></div>
  ${co("reg","La pyramide régulière SABCD : base carrée ABCD de centre O, arêtes latérales codées de même longueur",220)}
  <h4>c) Patron d'une pyramide</h4>
  <p><b>Exemple :</b> nous avons construit le patron de la pyramide régulière SABCD.</p>
  ${co("plier","On déplie les faces latérales de la pyramide SABCD, étape par étape",560)}
  ${co("patron","Le patron de la pyramide régulière SABCD : un carré et quatre triangles isocèles",230)}
  <div class="attention"><b>Remarque :</b> il existe plusieurs patrons d'une même pyramide.</div>
  <p><b>À toi de jouer (exercice 1) :</b> construis le patron de cette pyramide. La base est rectangulaire.</p>${co("ex1","Pyramide EABCD à base rectangulaire : AD = 2 cm, DC = 3 cm, EC = 2,5 cm",260)}
  <details><summary>Voir la correction</summary><div class="corr">${cr("ex1patron","Le patron de la pyramide EABCD : le rectangle ABCD et les quatre triangles, avec les codages",380)}
  <p>On trace d'abord la base : le rectangle ABCD de 3 cm sur 2 cm.</p><p>[EC] est perpendiculaire à la base : les faces ECB et ECD sont rectangles en C (EC = 2,5 cm). On les trace à l'équerre.</p><p>Les deux autres faces EAB et EAD se tracent au compas : EB et ED sont déjà dessinées sur les faces voisines (codages).</p></div></details>`},
{k:"2", t:"Le cône de révolution", h:`
  <div class="retenir" data-l="Définition"><p>Un <b>cône de révolution</b> est un solide constitué :</p><ul><li>d'une <b>base</b> en forme de <b>disque</b> ;</li><li>d'une <b>face latérale</b> définie par une <b>portion de disque</b>, aussi appelée secteur circulaire.</li></ul><p><b>La hauteur</b> du cône est le segment qui représente la distance entre le sommet et la base du cône (<b>segment perpendiculaire à la base</b>).</p></div>
  <div class="retenir" data-l="À retenir"><p><b>Remarque :</b> un cône de révolution est obtenu en faisant tourner un triangle rectangle autour de l'un des côtés de son angle droit.</p><p>Les <b>génératrices</b> d'un cône de révolution sont des segments qui ont pour extrémités le sommet du cône et un point du cercle délimitant le disque de base.</p></div>
  <div class="figs">${fig("Le triangle rectangle tourne autour d'un côté de l'angle droit : il « génère » le cône.",co("cone1","Un triangle rectangle qui tourne autour d'un côté de son angle droit",130))}${fig("S : le sommet · [SO] : la hauteur · [SA] : une génératrice · la base : un disque de centre O",co("cone2","Le cône de sommet S, de hauteur [SO], une génératrice [SA] et la base",170))}</div>
  <p><b>Exercice 2 :</b> construis différentes représentations en perspective cavalière d'un cône.</p>
  <div class="attention">Dans une représentation en perspective cavalière, les arêtes en pointillés sont les arêtes cachées.</div>
  <details><summary>Voir la correction</summary><div class="corr">${conesFig([{S:[2,0],c:[2,4],rx:2,ry:0.5,given:[],h:true,name:"S"},{S:[7.5,4],c:[7.5,0.5],rx:1.5,ry:0.4,given:[],name:"",top:true}],true,[10,5],"Deux cônes en perspective cavalière")}<p>La base est un disque : en perspective cavalière, on le dessine comme une « ellipse » (un cercle aplati).</p><p>La moitié arrière de la base est cachée : on la trace en pointillés. On relie le sommet aux deux bords de la base.</p><p>Le cône peut aussi être dessiné « à l'envers », sommet en bas : vu d'en haut, toute sa base est visible.</p></div></details>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Les solides", e:[
  {n:"Activité 1", t:"Remplir le tableau", w:"Sur ta feuille", h:`<p>Pour chaque solide, indique son groupe (cube, parallélépipède rectangle, prisme droit, cylindre ou autre : indique son nom), le nombre total de faces, de sommets et d'arêtes, puis le nombre et la nature de ses bases (faces parallèles au sol) et de ses faces latérales (les autres faces).</p>
   <div class="figs">${[1,2,3,4,5,6,7,8,9].map(i=>{ const N=[0,4,7,6,9,8,5,3,2,1][i]; /* numéro écrit dans l'image de M. Staal */ return fig(`Solide ${N}`,ex("s"+i,"Solide "+N,[0,150,150,100,110,90,100,150,100,110][i])); }).join("")}</div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>N°</th><th>Groupe</th><th>Faces</th><th>Sommets</th><th>Arêtes</th><th>Bases</th><th>Faces latérales</th></tr></thead><tbody>${SOL.map(r=>`<tr><th>${r[0]}</th><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]} ${r[6]}</td><td>${r[7]} ${r[8]}</td></tr>`).join("")}</tbody></table></div>
   <p>Le cylindre et le cône n'ont pas d'arête : leurs bords sont des cercles, pas des segments.</p><p>Les solides 4 et 9 ont des faces latérales triangulaires qui se rejoignent en un sommet : ce sont des <b>pyramides</b>. Les solides 2 et 8 sont des <b>cônes</b>.</p>`}
 ]},
{t:"Les pyramides", e:[
  {n:"Activité 2", t:"Pyramides", w:"Sur ta feuille", h:`<p><b>1)</b> À l'aide de ces représentations en perspective cavalière et de ces patrons de pyramides (et de l'activité 1), trouve la définition d'une pyramide.</p>
   <div class="figs">${fig("a)",ex("pa","Pyramide SABCDE à base pentagonale, SE = 4 cm",150))}${fig("b)",ex("pb","Patron en étoile : base ORITE et cinq triangles de sommet D",200))}${fig("c)",ex("pc","Pyramide SABCD : SA = 12 cm perpendiculaire à la base, AB = 9 cm, BC = 6 cm",160))}</div>
   <div class="figs">${fig("d)",ex("pd","Patron : le triangle EIN et trois triangles de sommet R",190))}${fig("e) ABCD est un carré de côté 5 cm et BE = 7 cm.",grid({size:[7,5.6],k:30,nogrid:true,segs:[[[0,5],[4.6,5]],[[4.6,5],[6.4,3.6]],[[0.5,0],[0,5]],[[0.5,0],[4.6,5]],[[0.5,0],[6.4,3.6]],[[0,5],[1.8,3.6],"h"],[[1.8,3.6],[6.4,3.6],"h"],[[0.5,0],[1.8,3.6],"h"],[[3.2,4.3],[0.5,0],"h"],[[0,5],[6.4,3.6],"h"],[[4.6,5],[1.8,3.6],"h"]],pts:[["E",[0.5,0],0,-10],["A",[0,5],-10,8],["B",[4.6,5],4,16],["C",[6.4,3.6],12,0],["D",[1.8,3.6],-12,-4],["F",[3.2,4.3],2,16]],w:220,alt:"Pyramide EABCD à base carrée, de hauteur [EF]"}).replace("</svg>",`<path d="M109.2 139.4 L118 137.5 L122.8 145.1" style="fill:none;stroke:var(--ink);stroke-width:1.5"/></svg>`))}${fig("f) ETUO est un carré.",ex("pf","Pyramide RETUO : base carrée de 3 cm, hauteur [RS] de 8 cm",170))}</div>
   <div class="figs">${fig("g)",ex("pg","Patron : le quadrilatère SEMP et quatre triangles de sommet T",170))}${fig("h)",ex("ph","Pyramide AEZI : base EZI, hauteur [AT] de 4",190))}${fig("i)",ex("pi","Pyramide de sommet P et de base QRST",170))}</div>
   <p>En t'aidant de ton cours, réponds aux questions suivantes.</p><p><b>2)</b> Colorie, au crayon de bois, la base de chaque pyramide.</p><p><b>3)</b> Entoure les tétraèdres en vert et les pyramides régulières en rouge.</p><p><b>4)</b> Si cela est possible, indique la hauteur de chaque pyramide.</p><p><b>5)</b> Sur une feuille de brouillon, construis le patron de la pyramide <b>e)</b>.</p>`,
   c:`<p><b>1)</b> Une pyramide est un solide qui a une <b>base</b> en forme de <b>polygone</b> et des <b>faces latérales</b> qui sont des <b>triangles</b> ; ces triangles ont un sommet commun : le sommet de la pyramide.</p>
   <p><b>2) et 4)</b></p><div class="scroll"><table class="std"><thead><tr><th></th><th>Base</th><th>Hauteur</th><th>Particularité</th></tr></thead><tbody>
   <tr><th>a)</th><td>le pentagone ABCDE</td><td>pas tracée</td><td>—</td></tr>
   <tr><th>b)</th><td>le pentagone ORITE (patron)</td><td>impossible sur un patron</td><td>régulière (côtés de la base et arêtes latérales codés)</td></tr>
   <tr><th>c)</th><td>le rectangle ABCD</td><td>[SA], 12 cm</td><td>—</td></tr>
   <tr><th>d)</th><td>le triangle EIN (patron)</td><td>impossible sur un patron</td><td>tétraèdre</td></tr>
   <tr><th>e)</th><td>le carré ABCD</td><td>[EF]</td><td>régulière</td></tr>
   <tr><th>f)</th><td>le carré ETUO</td><td>[RS], 8 cm</td><td>régulière</td></tr>
   <tr><th>g)</th><td>le quadrilatère SEMP (patron)</td><td>impossible sur un patron</td><td>—</td></tr>
   <tr><th>h)</th><td>le triangle EZI</td><td>[AT], 4</td><td>tétraèdre</td></tr>
   <tr><th>i)</th><td>le quadrilatère QRST</td><td>pas tracée</td><td>—</td></tr></tbody></table></div>
   <p><b>3)</b> Tétraèdres (en vert) : <b>d) et h)</b>. Pyramides régulières (en rouge) : <b>b), e) et f)</b> (base carrée ou pentagone aux côtés égaux et arêtes latérales de même longueur).</p>
   <p><b>5)</b> Patron de la pyramide e) : le carré ABCD de 5 cm de côté et quatre triangles isocèles dont les côtés mesurent 5 cm, 7 cm et 7 cm (on trace les arcs de rayon 7 cm au compas).</p>${netReg(5,7,"EABCD",{w:300,alt:"Patron de la pyramide EABCD : un carré de 5 cm et quatre triangles isocèles de côtés 7 cm"})}`}
 ]},
{t:"Perspective cavalière", e:[
  {n:"Exercice 1", t:"Représentation en perspective cavalière d'un cône", w:"Sur ta feuille", h:`<p><b>a)</b> Complète les représentations en perspective cavalière des deux cônes de sommet S.</p>${ex("e1c","Deux cônes à compléter sur quadrillage",340)}<p><b>b)</b> Sur ton cahier, dessine deux représentations en perspective cavalière différentes d'un cône de sommet R.</p>`,
   c:`<p><b>a)</b> En couleur, les traits ajoutés. La moitié arrière de la base est cachée : en pointillés.</p>${conesFig(CONES,true,[10,5],"Les deux cônes complétés")}<p><b>b)</b> Par exemple, un cône « debout » et un cône « la pointe en bas » (voir la correction de l'exercice 2 du cours) ; on nomme R le sommet.</p>`},
  {n:"Exercice 2", t:"Représentation en perspective cavalière de pyramides", w:"Sur ta feuille", h:`<p>Avec ton crayon de bois et ta règle, complète les représentations en perspective cavalière des différentes pyramides à base rectangulaire et de sommet S.</p>
   <div class="figs">${fig("①",ex("e2f1","Figure 1",180))}${fig("②",ex("e2f2","Figure 2",150))}${fig("③",ex("e2f3","Figure 3",200))}${fig("④",ex("e2f4","Figure 4",170))}</div>`,
   c:`<p>On complète d'abord la base : c'est un parallélogramme (les côtés opposés sont parallèles et de même longueur). Puis on relie S aux quatre sommets de la base. Les arêtes cachées sont en pointillés.</p>
   <div class="figs">${PY.map((o,i)=>fig("①②③④"[i],pyrFig(o,true))).join("")}</div>`}
 ]},
{t:"Patrons", e:[
  {n:"Exercice 3", t:"Patron d'une pyramide", w:"Sur ta feuille", h:`<p>Avec tes instruments de géométrie, construis le patron de la pyramide SABCD à base rectangulaire.</p>${ex("e3","Pyramide SABCD : SA = 5 cm perpendiculaire à la base, AB = 5 cm, BC = 4 cm",200)}<p><b>Données :</b></p><ul><li>le triangle SBC est rectangle en B ;</li><li>le triangle SDC est rectangle en D.</li></ul><p>Tu découperas et plieras ton patron pour vérifier qu'il est correct.</p>`,
   c:`${netSA(5,4,5,{len:[["A","B","5 cm",0,14],["B","C","4 cm",26,0],["A","S1","5 cm",-32,0]]})}
   <p>On trace la base : le rectangle ABCD (AB = 5 cm, BC = 4 cm).</p><p>[SA] est perpendiculaire à la base : SAB et SAD sont rectangles en A, avec SA = 5 cm.</p><p>SBC est rectangle en B : on reporte SB (déjà tracée sur SAB) au compas, perpendiculairement à [BC]. SDC est rectangle en D : on reporte SD (déjà tracée sur SAD).</p><p>Les arêtes qui se rejoignent quand on plie ont la même longueur : elles ont le même codage.</p>`},
  {n:"Exercice 4", t:"Patron d'un tétraèdre", w:"Sur ta feuille", h:`${ex("e4","Tétraèdre HDCB : HD = DC = CB = 6 cm, angles droits en D et en C",190)}<p>Construis le patron de ce tétraèdre.</p>`,
   c:`${netTet(6)}<p>Les codages indiquent HD = DC = CB = 6 cm. Les angles ${'<span class="ang">HDC</span>'}, ${'<span class="ang">HDB</span>'} et ${'<span class="ang">DCB</span>'} sont droits.</p>
   <p>On trace la base DCB (rectangle en C), puis la face HDC rectangle en D et la face HDB rectangle en D (HD = 6 cm).</p><p>La dernière face HCB est rectangle en C : on reporte HC au compas depuis la face HDC. Les arêtes qui se rejoignent ont le même codage.</p>`},
  {n:"Exercice 5", t:"Défi : trois représentations en perspective cavalière différentes", w:"Sur ta feuille", h:`<p>Complète les figures pour obtenir les représentations en perspective cavalière :</p><ul><li>d'un parallélépipède rectangle ;</li><li>de deux prismes droits à base triangulaire différents.</li></ul><div class="figs">${fig("",ex("defi","Le départ : trois segments sur quadrillage",150))}${fig("",ex("defi","Le départ : trois segments sur quadrillage",150))}${fig("",ex("defi","Le départ : trois segments sur quadrillage",150))}</div>`,
   c:`<p>Une solution possible pour chaque figure (traits ajoutés en couleur, arêtes cachées en pointillés) :</p><div class="figs">${fig("Parallélépipède rectangle",defiFig("pave"))}${fig("Prisme : bases triangulaires en haut et en bas",defiFig("prisme1"))}${fig("Prisme : bases triangulaires devant et derrière",defiFig("prisme2"))}</div><p>Dans chaque cas, les arêtes parallèles dans la réalité restent parallèles sur le dessin, et elles ont la même longueur.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Les solides déjà connus", schema:S_SOL, q:{
 1:[ {g:()=>{ const s=pick([["Toutes mes faces sont des carrés.","un cube"],["Toutes mes faces sont des rectangles, mais elles ne sont pas toutes des carrés.","un pavé droit"],["J'ai deux bases qui sont des disques.","un cylindre"]]); return {q:`Je suis un solide. ${s[0]} Qui suis-je ?`, c:["un cube","un pavé droit","un cylindre","une pyramide"], rep:s[1], sx:S_SOL}; }} ],
 2:[ {q:"Les faces latérales d'un prisme droit sont des…", c:["rectangles","triangles","disques"], rep:"rectangles", ex:"Un prisme droit a deux bases polygones et des faces latérales rectangles.", sx:S_SOL},
     {g:()=>{ const n=pick([3,4,5,6]); return {q:`Un prisme droit a pour bases deux ${POLY[n]}s. Combien a-t-il de faces latérales ?`, c:uniq(String(n),[String(n+2),String(2*n),String(n-1)]), rep:String(n), ex:`Une face latérale par côté de la base : ${n}.`, sx:S_SOL}; }} ],
 3:[ {g:()=>{ const n=pick([3,4,5,6]), w=pick(["faces","sommets","arêtes"]), good=w==="faces"?n+2:w==="sommets"?2*n:3*n; return {q:`Un prisme droit a pour bases deux ${POLY[n]}s. Combien a-t-il ${w==='arêtes'?"d'arêtes":'de '+w} ?`, c:uniq(String(good),[String(n+2),String(2*n),String(3*n),String(n+1)]), rep:String(good), ex:`${n+2} faces (2 bases + ${n} faces latérales) ; ${2*n} sommets ; ${3*n} arêtes.`, sx:S_SOL}; }} ]
}},
{nom:"La pyramide", schema:S_PYR, q:{
 1:[ {q:"Les faces latérales d'une pyramide sont des…", c:["triangles","rectangles","disques"], rep:"triangles", sx:S_PYR},
     {q:"La base d'une pyramide est…", c:["un polygone","un disque","toujours un carré"], rep:"un polygone", ex:"La base peut être un triangle, un carré, un pentagone…", sx:S_PYR} ],
 2:[ {g:qCount} ],
 3:[ {q:"La hauteur d'une pyramide est…", c:["le segment perpendiculaire à la base qui part du sommet","une arête latérale","le plus grand côté de la base"], rep:"le segment perpendiculaire à la base qui part du sommet", ex:"La hauteur représente la distance entre le sommet et la base.", sx:S_PYR},
     {g:()=>{ const f=pick([4,5,6,7,9]), n=f-1; return {q:`Une pyramide a ${f} faces. Quelle est la nature de sa base ?`, c:uniq(`un ${POLY[n]||n+" côtés"}`,["un triangle","un quadrilatère","un pentagone","un hexagone","un octogone"].filter(x=>x!==`un ${POLY[n]}`).slice(0,3)), rep:`un ${POLY[n]}`, ex:`${f} faces = 1 base + ${n} faces latérales : la base a ${n} côtés.`, sx:S_PYR}; }} ]
}},
{nom:"Pyramides particulières", schema:S_PART, q:{
 1:[ {q:"Un tétraèdre est une pyramide dont la base est…", c:["un triangle","un carré","un disque"], rep:"un triangle", sx:S_PART} ],
 2:[ {q:"Une pyramide régulière a une base qui est un polygone régulier et des faces latérales qui sont…", c:["des triangles isocèles identiques","des triangles rectangles","des rectangles"], rep:"des triangles isocèles identiques", sx:S_PART},
     {g:()=>{ const s=pick([["Sa base est un carré et ses quatre arêtes latérales ont la même longueur.","Oui"],["Sa base est un rectangle de 3 cm sur 5 cm.","Non"],["Sa base est un triangle équilatéral et ses trois arêtes latérales ont la même longueur.","Oui"],["Sa base est un carré, mais une seule arête latérale est perpendiculaire à la base.","Non"]]); return {q:`Cette pyramide est-elle régulière ? ${s[0]}`, c:["Oui","Non"], rep:s[1], ex:s[1]==="Oui"?"La base est un polygone régulier et les faces latérales sont des triangles isocèles identiques.":"Pour être régulière, la base doit être un polygone régulier et les faces latérales des triangles isocèles identiques.", sx:S_PART}; }} ],
 3:[ {q:"Combien de faces a un tétraèdre ?", c:["4","3","5","6"], rep:"4", ex:"Une base triangulaire et 3 faces latérales triangulaires : 4 faces, toutes des triangles.", sx:S_PART} ]
}},
{nom:"Patron d'une pyramide", schema:S_PAT, q:{
 1:[ {g:()=>{ const n=pick([3,4,5,6]); return {q:`Dans le patron d'une pyramide dont la base est un ${POLY[n]}, combien y a-t-il de triangles autour de la base ?`, c:uniq(String(n),[String(n+1),String(n-1),"4"]), rep:String(n), ex:`Un triangle (une face latérale) sur chaque côté de la base.`, sx:S_PAT}; }} ],
 2:[ {q:"Une même pyramide peut avoir…", c:["plusieurs patrons","un seul patron","aucun patron"], rep:"plusieurs patrons", sx:S_PAT},
     {g:()=>{ const c=ri(3,7), l=c+ri(1,4); return {q:`On construit le patron d'une pyramide régulière à base carrée de côté ${c} cm, dont les arêtes latérales mesurent ${l} cm. Quelles sont les longueurs des côtés de chaque triangle ?`, c:uniq(`${c} cm, ${l} cm et ${l} cm`,[`${c} cm, ${c} cm et ${l} cm`,`${l} cm, ${l} cm et ${l} cm`]), rep:`${c} cm, ${l} cm et ${l} cm`, ex:`Chaque triangle a un côté de la base (${c} cm) et deux arêtes latérales (${l} cm) : il est isocèle.`, sx:S_PAT}; }} ],
 3:[ {q:"Dans le patron d'une pyramide, deux côtés de triangles voisins qui se rejoignent quand on plie…", c:["ont la même longueur","sont perpendiculaires","sont parallèles"], rep:"ont la même longueur", ex:"Ils forment la même arête de la pyramide : on les code de la même façon.", sx:S_PAT} ]
}},
{nom:"Le cône de révolution", schema:S_CONE, q:{
 1:[ {q:"La base d'un cône de révolution est…", c:["un disque","un polygone","un rectangle"], rep:"un disque", sx:S_CONE} ],
 2:[ {q:"Un cône de révolution est obtenu en faisant tourner…", c:["un triangle rectangle autour d'un côté de son angle droit","un rectangle autour d'un de ses côtés","un triangle équilatéral autour d'un côté"], rep:"un triangle rectangle autour d'un côté de son angle droit", ex:"Un rectangle qui tourne autour d'un côté donne un cylindre.", sx:S_CONE},
     {q:"Un segment qui joint le sommet d'un cône à un point du cercle de base s'appelle…", c:["une génératrice","la hauteur","un rayon"], rep:"une génératrice", sx:S_CONE} ],
 3:[ {q:"Dans une représentation en perspective cavalière d'un cône, la moitié arrière du cercle de base est dessinée…", c:["en pointillés","en trait plein","elle n'est pas dessinée"], rep:"en pointillés", ex:"Les arêtes et les bords cachés sont en pointillés.", sx:S_CONE},
     {q:"La face latérale d'un cône de révolution, une fois déroulée, est…", c:["une portion de disque","un rectangle","un triangle"], rep:"une portion de disque", ex:"C'est un secteur circulaire.", sx:S_CONE} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
  const P4={size:[9,9], base:[[1,8],[6,8],[8,6],[3,6]], S:[4,1], given:[[[1,8],[6,8]],[[6,8],[8,6]],[[4,1],[1,8]]], cross:true, Sd:[0,-14]};
  return {
titre:"Évaluation d'entraînement · chapitre 8", duree:50, info:"Durée : 50 min · Calculatrice non autorisée · Règle, équerre, compas et crayon à papier",
comp:[
  ["CONNAÎTRE","Je connais le vocabulaire des solides : base, face latérale, sommet, arête, hauteur, génératrice.","Ex. 1 et 4 (7 points)"],
  ["CHERCHER","Je reconnais une pyramide, un tétraèdre, une pyramide régulière et je compte faces, sommets et arêtes.","Ex. 2 (4 points)"],
  ["REPRÉSENTER","Je complète une représentation en perspective cavalière et je construis le patron d'une pyramide.","Ex. 3 et 5 (9 points)"]
],
exos:[
{t:"Vocabulaire", p:4, h:`<p>Complète les phrases.</p><p><b>a)</b> Une pyramide a une base qui est un …………… et des faces latérales qui sont des …………… .</p><p><b>b)</b> Un tétraèdre est une pyramide dont la base est un …………… .</p><p><b>c)</b> Une pyramide régulière a pour base un polygone …………… et ses faces latérales sont des triangles …………… identiques.</p><p><b>d)</b> La hauteur d'une pyramide est …………… à sa base.</p>`,
 c:`<p><b>a)</b> polygone ; triangles <i>(1 point)</i></p><p><b>b)</b> triangle <i>(0,5 point)</i></p><p><b>c)</b> régulier ; isocèles <i>(1,5 point)</i></p><p><b>d)</b> perpendiculaire <i>(1 point)</i></p>`},
{t:"Compter", p:4, h:`<p>Recopie et complète le tableau.</p><div class="scroll"><table class="std"><thead><tr><th>Solide</th><th>Nombre de faces</th><th>Nombre de sommets</th><th>Nombre d'arêtes</th></tr></thead><tbody><tr><th>Pyramide à base hexagonale</th><td></td><td></td><td></td></tr><tr><th>Tétraèdre</th><td></td><td></td><td></td></tr><tr><th>Prisme droit à base pentagonale</th><td></td><td></td><td></td></tr></tbody></table></div><p>Une pyramide a 10 arêtes. Quelle est la nature de sa base ?</p>`,
 c:`<div class="scroll"><table class="std"><thead><tr><th>Solide</th><th>Faces</th><th>Sommets</th><th>Arêtes</th></tr></thead><tbody><tr><th>Pyramide à base hexagonale</th><td>7</td><td>7</td><td>12</td></tr><tr><th>Tétraèdre</th><td>4</td><td>4</td><td>6</td></tr><tr><th>Prisme droit à base pentagonale</th><td>7</td><td>10</td><td>15</td></tr></tbody></table></div><p><i>(3 points : 1 point par ligne)</i></p><p>10 arêtes = 5 arêtes de la base + 5 arêtes latérales : la base est un <b>pentagone</b>. <i>(1 point)</i></p>`},
{t:"Perspective cavalière", p:3, h:`<p>Reproduis et complète la représentation en perspective cavalière de cette pyramide à base rectangulaire et de sommet S.</p>${pyrFig(P4)}`,
 c:`${pyrFig(P4,true)}<p>On complète la base (parallélogramme), puis on relie S aux quatre sommets ; les arêtes cachées sont en pointillés. <i>(1 point pour la base, 1 point pour les arêtes latérales, 1 point pour les pointillés)</i></p>`},
{t:"Le cône", p:3, h:`<p>Observe ce cône de révolution de sommet S. O est le centre de sa base.</p>${grid({size:[6,6],k:30,nogrid:true,segs:[[[3,0.5],[1,5]],[[3,0.5],[5,5]],[[3,0.5],[3,5],"h"],[[3,5],[5,5],"h"]],ell:[[[3,5],2,0.5,"front","v"],[[3,5],2,0.5,"back","h"]],pts:[["S",[3,0.5],0,-10],["O",[3,5],-12,4],["M",[5,5],12,0]],w:200,alt:"Cône de sommet S, de base de centre O, et un point M du cercle de base"})}<p><b>a)</b> Comment s'appelle le segment [SO] ? Et le segment [SM] ?</p><p><b>b)</b> Quelle est la nature de la base ?</p><p><b>c)</b> Quel triangle faut-il faire tourner, et autour de quel côté, pour obtenir ce cône ?</p>`,
 c:`<p><b>a)</b> [SO] est la <b>hauteur</b> du cône ; [SM] est une <b>génératrice</b>. <i>(1 point)</i></p><p><b>b)</b> La base est un <b>disque</b> de centre O. <i>(1 point)</i></p><p><b>c)</b> On fait tourner le triangle SOM, rectangle en O, autour du côté [SO]. <i>(1 point)</i></p>`},
{t:"Patron", p:6, h:`<p>SEFGH est une pyramide régulière à base carrée. Sa base EFGH est un carré de 4 cm de côté et ses arêtes latérales mesurent 5 cm.</p><p><b>a)</b> Quelle est la nature des faces latérales ? Justifie.</p><p><b>b)</b> Construis un patron de cette pyramide. N'oublie pas les lettres et les codages.</p>`,
 c:`<p><b>a)</b> La pyramide est régulière : ses faces latérales sont des triangles isocèles identiques, de côtés 4 cm, 5 cm et 5 cm. <i>(1,5 point)</i></p><p><b>b)</b></p>${netReg(4,5,"SEFGH",{w:280,alt:"Patron de la pyramide SEFGH"})}<p><i>(4,5 points : 1 point pour le carré, 2 points pour les quatre triangles, 1 point pour les lettres, 0,5 point pour les codages)</i></p>`}
]};
})()
};
})();
