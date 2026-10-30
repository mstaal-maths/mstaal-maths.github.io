/* 3e — Chapitre 10 : Agrandissement, réduction et triangles semblables (cours et fiche d'exercices de M. Staal)
   Figures du cours et de la fiche : celles des documents Word (img/3k10co, img/3k10ex).
   Le QCM d'exercice 6 (scan de manuel tourné) est retapé en tableau ; les sujets de brevet sont retapés (figures recadrées).
   Figures du QCM et de l'entraînement : triangles SVG construits à partir des longueurs (outil tri). */
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

const co=(p,alt,w)=>img("3k10co/"+p+".png",alt,w), ex=(p,alt,w,e="png")=>img("3k10ex/"+p+"."+e,alt,w);
const tab=(head,rows)=>`<div class="scroll"><table class="std"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const Fr=(a,b)=>`{${a}/${b}}`;

/* ------------------------------------------------------------------
   Triangle SVG à partir de ses trois côtés
   n = "ABC" · a = BC, b = CA, c = AB · show {a,b,c} : longueurs écrites (texte) · angs {A:"40°"} · rot (degrés) · flip
------------------------------------------------------------------ */
function triSVG(n, a, b, c, o={}){
  const [A,B,C]=n.split(""), T=V.tri(a,b,c); let P={[A]:T.A,[B]:T.B,[C]:T.C};
  if(o.flip) P=MAP(P,p=>[a-p[0],p[1]]);
  if(o.rot) P=MAP(P,p=>V.rot(p,[a/2,0],o.rot));
  const len=[]; const L=o.show||{}; if(L.a) len.push([B,C,L.a]); if(L.b) len.push([C,A,L.b]); if(L.c) len.push([A,B,L.c]);
  const angs=Object.entries(o.angs||{}).map(([v,t])=>{ const oth=n.split("").filter(x=>x!==v); return [v,oth[0],oth[1],t,0.5*(o.k?30/o.k:1),o.col&&o.col[v]]; });
  return geo({P, k:o.k||30, pad:o.pad??34, poly:[[[A,B,C],"orig"]], len, angs, lab:[A,B,C], cen:[(P[A][0]+P[B][0]+P[C][0])/3,(P[A][1]+P[B][1]+P[C][1])/3], w:o.w, alt:o.alt||`Triangle ${n}`});
}
const NOMS3=["ABC","DEF","GHI","JKL","MNP","RST","UVW","EFG","IJK","LMN"];
const ratio=(x,y)=>r3(x/y);

/* ===================== schémas ===================== */
const S_K=sch("Agrandissement et réduction", `<p class="calc">longueur finale = k × longueur initiale</p><p class="calc">k = ${Fr("longueur finale","longueur initiale")}</p><p class="schN">k &gt; 1 : agrandissement ; k &lt; 1 : réduction ; k = 1 : reproduction. Les angles ne changent pas.</p>`);
const S_AV=sch("Aires et volumes", `<p class="schN">Toutes les longueurs × k :</p><p class="calc">aires × k² · volumes × k³</p><p class="schN">Exemple : k = 3 → aire × 9 et volume × 27.</p>`);
const S_SL=sch("Triangles semblables : longueurs", `${triSVG("ABC",4,3,2,{show:{a:"4",b:"3",c:"2"},k:24})}${triSVG("DEF",6,4.5,3,{show:{a:"6",b:"4,5",c:"3"},k:24})}<p class="schN">On range les côtés dans l'ordre et on calcule les quotients : ${Fr(3,2)} = ${Fr("4,5",3)} = ${Fr(6,4)} = 1,5. Les longueurs sont proportionnelles : les triangles sont semblables.</p>`);
const S_SA=sch("Triangles semblables : angles", `<p class="schN">Si deux triangles sont semblables, alors leurs angles sont deux à deux de même mesure.</p><p class="schN">Si deux triangles ont deux angles deux à deux de même mesure, alors ils sont semblables.</p><p class="schN">Somme des angles d'un triangle : 180°.</p>`);

CH["3e-10"] = {
intro:"Agrandir ou réduire une figure, c'est multiplier toutes ses longueurs par un même nombre k : on calcule des longueurs, des aires et des volumes, puis on reconnaît des triangles semblables.",
savoir:[
  "calculer les longueurs d'un agrandissement ou d'une réduction, et retrouver le rapport k ;",
  "connaître l'effet d'un agrandissement ou d'une réduction de rapport k sur les aires (× k²) et sur les volumes (× k³) ;",
  "prouver que deux triangles sont semblables avec les longueurs de leurs côtés ;",
  "calculer une longueur dans des triangles semblables ;",
  "prouver que deux triangles sont semblables avec leurs angles, et utiliser l'égalité des angles."
],

/* ===================== COURS ===================== */
cours:[
{k:"1", t:"Agrandissement et réduction : définition", h:`
  <div class="retenir" data-l="Définition"><p>Multiplier toutes les longueurs d'une figure ou d'un solide par un nombre strictement positif <b>k</b>, c'est faire :</p><ul><li>un <b>agrandissement de rapport k</b> si k &gt; 1 ;</li><li>une <b>réduction de rapport k</b> si k &lt; 1 ;</li><li>(une reproduction de rapport k si k = 1).</li></ul></div>
  <div class="retenir" data-l="Propriété"><p>Lors d'un agrandissement ou d'une réduction, les mesures des angles sont inchangées.</p></div>
  <div class="retenir" data-l="Remarque"><p>L'agrandissement ou la réduction d'une figure ou d'un solide est <b>une situation de proportionnalité</b>. Le rapport d'agrandissement ou de réduction <b>k est le coefficient de proportionnalité</b>.</p><p class="calc">On a donc : longueurs initiales × k = longueurs finales, donc k = ${Fr("longueurs finales","longueurs initiales")}</p></div>
  <p><b>Exemple 1 :</b> le rectangle LOIN est une <b>réduction du rectangle EFGH de rapport 0,6</b>.</p>${co("rect","Rectangle EFGH de 10 cm sur 4 cm et rectangle LOIN de 6 cm sur 2,4 cm",300)}
  ${tab(["Longueurs initiales (en cm)","4","10"],[["Longueurs finales (en cm)","2,4","6"]])}<p class="calc">× 0,6 : ${Fr(6,10)} = ${Fr("2,4",4)} = 0,6</p><p>0,6 est le coefficient de proportionnalité.</p>
  <p><b>Exemple 2 :</b> la pyramide ABCDE est un <b>agrandissement de la pyramide JIFGH de rapport 2,5</b>. Toutes les longueurs sont en cm.</p>${co("pyr","Pyramide JIFGH et son agrandissement ABCDE",300)}
  ${tab(["Longueurs initiales (en cm)","2","1,5","2,4"],[["Longueurs finales (en cm)","5","3,75","6"]])}<p class="calc">× 2,5 : ${Fr(5,2)} = ${Fr("3,75","1,5")} = ${Fr(6,"2,4")} = 2,5</p><p>2,5 est le coefficient de proportionnalité.</p>`},
{k:"2", t:"Effets d'un agrandissement ou d'une réduction sur les aires et les volumes", h:`
  <div class="retenir" data-l="Propriété"><p>Lorsque toutes les longueurs d'une figure sont multipliées par <b>k</b> :</p><ul><li>les aires sont multipliées par <b>k²</b> ;</li><li>les volumes sont multipliés par <b>k³</b>.</li></ul></div>
  <p><b>Exemple 1 :</b> un rectangle a une aire de 40 cm². On réduit cette figure d'un rapport de 0,6. Quelle sera l'aire du rectangle réduit ?</p>
  <p class="calc">A<sub>réduite</sub> = A<sub>initiale</sub> × k²<br>A<sub>réduite</sub> = 40 × 0,6²<br>A<sub>réduite</sub> = 14,4 cm²</p>
  <p><b>Exemple 2 :</b> une pyramide a un volume de 2,4 cm³. On agrandit cette figure d'un rapport de 2,5. Quel sera le volume de la pyramide agrandie ?</p>
  <p class="calc">V<sub>agrandi</sub> = V<sub>initial</sub> × k³<br>V<sub>agrandi</sub> = 2,4 × 2,5³<br>V<sub>agrandi</sub> = 37,5 cm³</p>`},
{k:"3", t:"Triangles semblables et longueurs", h:`
  <div class="retenir" data-l="Définition"><p><b>Si deux triangles ont des longueurs deux à deux proportionnelles</b>, c'est-à-dire que l'un est l'agrandissement de l'autre (et inversement pour la réduction), alors on dit que ce sont des <b>triangles semblables</b>.</p></div>
  <h4>a) Prouver que deux triangles sont semblables à l'aide des longueurs des côtés</h4>
  <p><b>Exemple 1 :</b> les triangles GHI et JKL sont-ils semblables ?</p>${co("ghi","Triangle GHI (GH = 2 cm, GI = 3 cm, HI = 4 cm) et triangle JKL (KL = 0,8 cm, JK = 1,2 cm, JL = 1,6 cm)",330)}
  <div class="retenir" data-l="Méthode"><p>On range les longueurs des côtés de chaque triangle dans l'ordre croissant, puis on calcule les quotients des longueurs correspondantes.</p></div>
  <p>Triangle JKL : 0,8 cm ; 1,2 cm ; 1,6 cm. Triangle GHI : 2 cm ; 3 cm ; 4 cm.</p><p class="calc">${Fr("0,8",2)} = 0,4 · ${Fr("1,2",3)} = 0,4 · ${Fr("1,6",4)} = 0,4</p><p>Les longueurs sont deux à deux proportionnelles : <b>les triangles GHI et JKL sont semblables</b> (JKL est une réduction de GHI de rapport 0,4).</p>
  <h4>b) Déterminer la longueur d'un côté dans des triangles semblables</h4>
  <p><b>Exemple 2 :</b> les triangles RST et LKM sont semblables. Les sommets homologues sont : K et S ; M et R ; L et T. Calcule KM.</p>${co("rst","Triangle RST (RS = 6 cm, RT = 7,5 cm, ST = 3 cm) et triangle LKM (LK = 2 cm, LM = 5 cm, KM = ?)",330)}
  <p>Les côtés homologues sont [LK] et [TS], [LM] et [TR], [KM] et [SR]. Les longueurs sont proportionnelles :</p><p class="calc">${Fr("LK","TS")} = ${Fr("LM","TR")} = ${Fr("KM","SR")} donc ${Fr(2,3)} = ${Fr(5,"7,5")} = ${Fr("KM",6)}</p><p class="calc">KM = 6 × ${Fr(2,3)}<br>KM = 4 cm</p>`},
{k:"4", t:"Triangles semblables et angles", h:`
  <h4>a) Déterminer la mesure d'un angle dans des triangles semblables</h4>
  <div class="retenir" data-l="Propriété"><p><b>Si</b> deux triangles sont semblables, <b>alors</b> leurs <b>angles ont deux à deux la même mesure</b>.</p></div>
  ${co("angghi","Triangles semblables GHI et JKL avec les angles de même mesure codés de la même couleur",260)}
  <p><b>Exemple 3 :</b> les triangles GHI et JKL sont semblables (G et K, H et L, I et J sont homologues). Donc les angles sont deux à deux de même mesure :</p><p class="calc">${ang("GHI")} = ${ang("KLJ")} ; ${ang("GIH")} = ${ang("KJL")} et ${ang("HGI")} = ${ang("JKL")}</p>
  <h4>b) Prouver que deux triangles sont semblables à l'aide des mesures d'angles</h4>
  <div class="retenir" data-l="Propriété"><p><b>Si</b> deux triangles ont deux angles deux à deux de même mesure, <b>alors</b> ces triangles sont <b>semblables</b>.</p></div>
  <p><b>Exemple 4 :</b> prouve que les triangles ABC et DEF sont semblables.</p>${co("abcdef","Triangle ABC avec des angles de 40° et 30°, triangle DEF avec des angles de 40° et 110°",160)}
  <p>Dans le triangle ABC, la somme des angles vaut 180° :</p><p class="calc">${ang("ACB")} = 180° − 40° − 30°<br>${ang("ACB")} = 110°</p><p>Donc ${ang("BAC")} = ${ang("EDF")} = 40° et ${ang("ACB")} = ${ang("DEF")} = 110°.</p><p>Les triangles ABC et DEF ont deux angles deux à deux de même mesure : <b>ils sont semblables</b>.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Agrandir ou réduire", e:[
  {n:"Activité 1", t:"Agrandir ou réduire une figure ou un solide (calculatrice autorisée)", w:"Sur ta feuille", h:`<p><b>1)</b> Le triangle ZOP est un agrandissement du triangle TIN de rapport 3.</p><p><b>2)</b> Le triangle SUR est une réduction du triangle TIN de rapport 0,5.</p>${ex("tin","Triangle TIN (TN = 2 cm, TI = 3 cm, NI = 4 cm), son agrandissement ZOP et sa réduction SUR",470)}
   <p><b>3)</b> On réalise un agrandissement du cône de rapport 1,6.</p>${ex("cone","Cône de hauteur AB = 5 cm et de rayon BC = 1,2 cm, et son agrandissement de sommet F, de hauteur FE et de rayon EG",230)}
   <p><b>Questions :</b></p><p><b>a)</b> Sur le dessin, indique au crayon de bois les dimensions des figures agrandies ou réduites.</p><p><b>b)</b> On a agrandi ou réduit une figure d'un rapport k. Quelle est la formule générale qui permet de trouver les dimensions de la figure agrandie ou réduite ?</p><p><b>c)</b> Si k ……, il s'agit d'un agrandissement. Si k ……, il s'agit d'une réduction. Si k ……, il s'agit d'une reproduction.</p>`,
   c:`<p><b>a)</b> ZOP (× 3) :</p><div class="calcs"><p class="calc">ZP = 3 × 2<br>ZP = 6 cm</p><p class="calc">ZO = 3 × 3<br>ZO = 9 cm</p><p class="calc">PO = 3 × 4<br>PO = 12 cm</p></div><p>SUR (× 0,5) :</p><div class="calcs"><p class="calc">SR = 0,5 × 2<br>SR = 1 cm</p><p class="calc">SU = 0,5 × 3<br>SU = 1,5 cm</p><p class="calc">RU = 0,5 × 4<br>RU = 2 cm</p></div><p>Cône (× 1,6) :</p><div class="calcs"><p class="calc">FE = 1,6 × 5<br>FE = 8 cm</p><p class="calc">EG = 1,6 × 1,2<br>EG = 1,92 cm</p></div><p>Les dimensions à écrire sur le dessin :</p><div class="figs">${fig("ZOP : agrandissement de rapport 3",triSVG("ZPO",12,9,6,{show:{a:"12 cm",b:"9 cm",c:"6 cm"},k:22,alt:"Triangle ZOP : ZP = 6 cm, ZO = 9 cm, PO = 12 cm"}))}${fig("SUR : réduction de rapport 0,5",triSVG("SRU",2,1.5,1,{show:{a:"2 cm",b:"1,5 cm",c:"1 cm"},k:60,alt:"Triangle SUR : SR = 1 cm, SU = 1,5 cm, RU = 2 cm"}))}${fig("Cône agrandi de rapport 1,6",`<svg class="fig" viewBox="0 0 220 250" width="210" role="img" aria-label="Cône agrandi : hauteur FE = 8 cm, rayon EG = 1,92 cm"><ellipse cx="100" cy="200" rx="80" ry="18" style="fill:none;stroke:var(--ink);stroke-width:2.2"/><line x1="100" y1="30" x2="20" y2="200" style="stroke:var(--ink);stroke-width:2.2"/><line x1="100" y1="30" x2="180" y2="200" style="stroke:var(--ink);stroke-width:2.2"/><line x1="100" y1="30" x2="100" y2="200" style="stroke:#1e8a4c;stroke-width:2.2;stroke-dasharray:6 4"/><line x1="100" y1="200" x2="180" y2="200" style="stroke:var(--ink);stroke-width:2.2"/><path d="M100 188 L112 188 L112 200" style="fill:none;stroke:var(--ink);stroke-width:1.6"/><text x="100" y="22" text-anchor="middle" style="font-weight:700;font-size:16px;fill:var(--ink)">F</text><text x="92" y="236" text-anchor="middle" style="font-weight:700;font-size:16px;fill:var(--ink)">E</text><text x="194" y="206" text-anchor="middle" style="font-weight:700;font-size:16px;fill:var(--ink)">G</text><text x="95" y="155" text-anchor="end" style="font-size:14px;font-weight:600;fill:#1e5aa8">8 cm</text><text x="140" y="214" text-anchor="middle" style="font-size:13px;font-weight:600;fill:#1e5aa8">1,92 cm</text></svg>`)}</div><p><i>(Les figures ne sont pas en vraie grandeur.)</i></p>
   <p><b>b)</b> longueur de la figure agrandie ou réduite = k × longueur de la figure de départ.</p><p><b>c)</b> Si k &gt; 1, c'est un agrandissement. Si k &lt; 1, c'est une réduction. Si k = 1, c'est une reproduction.</p>`},
  {n:"Activité 2", t:"Calculer le rapport d'agrandissement ou de réduction", w:"Sur ta feuille", h:`<p><b>1)</b> La pyramide ABCDE est un agrandissement de la pyramide JIFGH. Toutes les longueurs sont en cm. Calcule le rapport d'agrandissement.</p>${ex("pyr","Pyramide JIFGH (2 ; 1,5 ; 2,4) et pyramide ABCDE (5 ; 3,75 ; 6 ; 8)",280)}
   <p><b>2)</b> Le rectangle LOIN est une réduction du rectangle EFGH. Calcule le rapport de réduction.</p>${ex("rect","Rectangle EFGH (10 cm et 4 cm) et rectangle LOIN (6 cm et 2,4 cm)",300)}`,
   c:`<p><b>1)</b></p><p class="calc">k = ${Fr("longueur finale","longueur initiale")}<br>k = ${Fr(5,2)}<br>k = 2,5</p><p>Vérification : ${Fr("3,75","1,5")} = 2,5 et ${Fr(6,"2,4")} = 2,5. Le rapport d'agrandissement est <b>2,5</b>.</p>
   <p><b>2)</b></p><p class="calc">k = ${Fr(6,10)}<br>k = 0,6</p><p>Vérification : ${Fr("2,4",4)} = 0,6. Le rapport de réduction est <b>0,6</b>.</p>`},
  {n:"Exercice 1", t:"Réduction triangle", w:"Sur ton cahier", h:`<p>Le triangle BEC est une réduction du triangle LIN.</p>${ex("lin","Triangle LIN rectangle en N (LI = 6,25 ; IN = 3,75 ; LN = 5 cm) et triangle BEC (BE = 2,5 cm ; EC = 1,5 cm ; BC = 2 cm)",400)}<p>Calcule le rapport de réduction.</p>`,
   c:`<p>Les côtés homologues : [BC] et [LN], [EC] et [IN], [BE] et [LI].</p><p class="calc">k = ${Fr("BC","LN")}<br>k = ${Fr(2,5)}<br>k = 0,4</p><p class="calc">${Fr("1,5","3,75")} = 0,4 · ${Fr("2,5","6,25")} = 0,4</p><p>Le rapport de réduction est <b>0,4</b>.</p>`},
  {n:"Exercice 2", t:"Agrandissement triangle", w:"Sur ton cahier", h:`${ex("proj","Triangle FGH sur l'ordinateur et sur le tableau",300)}<p>Un professeur projette, sur le tableau, un triangle FGH à l'aide d'un vidéoprojecteur.</p><ul><li>Sur l'ordinateur, le triangle FGH est tel que FG = 3 cm, FH = 4,5 cm et GH = 6 cm.</li><li>Sur le tableau, GH = 105 cm.</li></ul><p><b>a)</b> Quel est le rapport d'agrandissement ?</p><p><b>b)</b> Calcule les longueurs FH et FG affichées sur le tableau.</p>`,
   c:`<p><b>a)</b></p><p class="calc">k = ${Fr(105,6)}<br>k = <b>17,5</b></p><p><b>b)</b></p><div class="calcs"><p class="calc">FH = 17,5 × 4,5<br>FH = <b>78,75 cm</b></p><p class="calc">FG = 17,5 × 3<br>FG = <b>52,5 cm</b></p></div>`},
  {n:"Exercice 3", t:"Maquette et réduction", w:"Sur ton cahier", h:`<p>La pyramide du Louvre EFGHI est une pyramide régulière à base carrée de hauteur 21,65 m.</p><p>Données : FG = 35,50 m et EG = 33,15 m.</p>${ex("louvre","La pyramide du Louvre",260)}<p>On veut réaliser une maquette de cette pyramide qui sera une réduction de rapport 0,008. La pyramide réduite se nomme SABCD.</p>${ex("pyrsabcd","Pyramide réduite SABCD de hauteur [SH]",240)}<p>On cherche à connaître les dimensions de la pyramide réduite : calcule la longueur AB et la longueur SH. Donne les réponses en cm.</p>`,
   c:`<p>[AB] correspond à [FG] et [SH] à la hauteur de la pyramide du Louvre.</p><p class="calc">AB = 0,008 × 35,50<br>AB = 0,284 m<br>AB = <b>28,4 cm</b></p><p class="calc">SH = 0,008 × 21,65<br>SH = 0,1732 m<br>SH = <b>17,32 cm</b></p>`},
  {n:"Exercice 4", t:"Image agrandie", w:"Sur ton cahier", h:`${ex("fourmi","Dessin d'une fourmi",280)}<p>Sur ce dessin, la fourmi a une longueur d'environ 5 cm. En réalité, une fourmi a une longueur d'environ 4 mm.</p><p>Quel est le rapport d'agrandissement de cette photo ?</p>`,
   c:`<p>On exprime les deux longueurs dans la même unité : 5 cm = 50 mm.</p><p class="calc">k = ${Fr(50,4)}<br>k = 12,5</p><p>Le rapport d'agrandissement est <b>12,5</b>.</p>`}
 ]},
{t:"Effets sur les aires et les volumes", e:[
  {n:"Activité 3", t:"Effets d'un agrandissement ou d'une réduction sur les aires et les volumes", w:"Sur ton cahier", h:`${ex("cubes","Cube n°1 d'arête 2 cm et cube n°2",300)}<p>Le cube n°2 est un agrandissement du cube n°1 de rapport 3.</p><ul><li>L'aire A<sub>1</sub> de chaque face du cube n°1 est de 4 cm² (car A<sub>1</sub> = c × c = 2 × 2 = 4 cm²).</li><li>Le volume V<sub>1</sub> du cube n°1 est de 8 cm³ (car V<sub>1</sub> = c × c × c = 2 × 2 × 2 = 8 cm³).</li></ul>
   <p><b>1)</b> Calcule l'aire d'une face du cube n°2.</p><p><i>Il y a deux techniques possibles. L'objectif est de trouver la technique qui utilise l'aire A<sub>1</sub> et le rapport d'agrandissement.</i></p><p><b>2)</b> Calcule le volume du cube n°2.</p><p><i>Il y a deux techniques possibles. L'objectif est de trouver la technique qui utilise le volume V<sub>1</sub> et le rapport d'agrandissement.</i></p>`,
   c:`<p><b>1)</b> Technique 1 : l'arête du cube n°2 mesure 3 × 2 = 6 cm.</p><p class="calc">A<sub>2</sub> = 6 × 6<br>A<sub>2</sub> = 36 cm²</p><p>Technique 2 :</p><p class="calc">A<sub>2</sub> = A<sub>1</sub> × 3²<br>A<sub>2</sub> = 4 × 9<br>A<sub>2</sub> = <b>36 cm²</b></p><p>L'aire est multipliée par k².</p>
   <p><b>2)</b> Technique 1 :</p><p class="calc">V<sub>2</sub> = 6 × 6 × 6<br>V<sub>2</sub> = 216 cm³</p><p>Technique 2 :</p><p class="calc">V<sub>2</sub> = V<sub>1</sub> × 3³<br>V<sub>2</sub> = 8 × 27<br>V<sub>2</sub> = <b>216 cm³</b></p><p>Le volume est multiplié par k³.</p>`},
  {n:"Exercice 5", t:"Effets d'un agrandissement ou d'une réduction sur les aires et les volumes", w:"Sur ta feuille", h:`<p>Chaque problème est indépendant. Résous chaque problème en justifiant.</p>
   <p><b>Problème 1 :</b> un rectangle a une aire de 40 cm². On réduit cette figure d'un rapport de 0,6. Quelle sera l'aire du rectangle réduit ?</p>
   <p><b>Problème 2 :</b> une pyramide a un volume de 2,4 dm³. On agrandit cette figure d'un rapport de 2,5. Quel sera le volume de la pyramide agrandie ?</p>
   <p><b>Problème 3 :</b> un disque a une aire de 4π cm². Détermine l'aire d'un agrandissement de ce disque de rapport 6. Donne la valeur exacte.</p>
   <div class="figs">${ex("camion","Camion de travail",200,"jpg")}${ex("jouet","Camion en jouet",200)}</div>
   <p><b>Problème 4 :</b> mon camion au travail a un volume de 80 m³. Le camion en jouet de mon fils est une réduction de mon camion de travail de rapport ${Fr(1,25)}. Quel est le volume du camion en jouet ? Convertis ta réponse en dm³.</p><p><i>Remarque : sur la calculatrice, « × 10<sup>−3</sup> » veut dire « × 0,001 ».</i></p>`,
   c:`<p><b>Problème 1 :</b> les aires sont multipliées par k² :</p><p class="calc">A = 40 × 0,6²<br>A = 40 × 0,36<br>A = <b>14,4 cm²</b></p>
   <p><b>Problème 2 :</b> les volumes sont multipliés par k³ :</p><p class="calc">V = 2,4 × 2,5³<br>V = 2,4 × 15,625<br>V = <b>37,5 dm³</b></p>
   <p><b>Problème 3 :</b></p><p class="calc">A = 4π × 6²<br>A = 4π × 36<br>A = <b>144π cm²</b></p>
   <p><b>Problème 4 :</b></p><p class="calc">V = 80 × (${Fr(1,25)})³<br>V = ${Fr(80,"15 625")}<br>V = 0,005 12 m³<br>V = <b>5,12 dm³</b></p><p>(1 m³ = 1 000 dm³)</p>`},
  {n:"Exercice 6", t:"QCM", w:"Sur ta feuille", h:`<p>Pour chaque question, une seule des trois réponses proposées est exacte. Entoure-la au crayon de bois.</p>
   ${tab(["Proposition","A","B","C"],[["1) Un rectangle subit un agrandissement de rapport 4, donc :","son aire ne change pas.","son aire est multipliée par 4.","son aire est multipliée par 16."],["2) Un carré d'aire 23 cm² a maintenant une aire de 1 127 cm², donc :","on a fait un agrandissement de rapport 49.","on a fait un agrandissement de rapport 7.","on a fait une réduction de rapport 49."],["3) Un pavé droit subit une réduction de rapport 0,5, donc :","son volume est multiplié par 0,5.","son volume est multiplié par 0,5².","son volume est multiplié par 0,5³."],["4) Si on multiplie par 3 les longueurs des arêtes d'un cube :","son volume est multiplié par 27.","son volume est multiplié par 9.","son volume est multiplié par 3."]])}`,
   c:`<p><b>1) C</b> : l'aire est multipliée par 4² = 16.</p><p><b>2) B</b> : ${Fr("1 127",23)} = 49 = 7², donc les longueurs ont été multipliées par 7.</p><p><b>3) C</b> : le volume est multiplié par 0,5³.</p><p><b>4) A</b> : le volume est multiplié par 3³ = 27.</p>`},
  {n:"Exercice 7", t:"Brevet Nouvelle-Calédonie, décembre 2019", w:"Sur ton cahier", h:`${ex("abcd_efgh","Quadrilatère ABCD (AD = 35 cm, AC = 80 cm, CD = 60 cm) et son agrandissement EFGH (GE = 1 m)",230)}<p>Le quadrilatère EFGH est un agrandissement de ABCD.</p><p>Le schéma n'est pas à l'échelle.</p><p>On donne AC = 80 cm et GE = 1 m.</p><p><b>1)</b> Montrer que le coefficient d'agrandissement est 1,25.</p><p><b>2)</b> Calculer GH et EF.</p><p><b>3)</b> On considère que l'aire du quadrilatère ABCD est égale à 1 950 cm². Calculer l'aire de EFGH en cm². Arrondir à l'unité.</p>`,
   c:`<p><b>1)</b> [GE] est l'image de [CA] : GE = 1 m = 100 cm, donc :</p><p class="calc">k = ${Fr(100,80)}<br>k = <b>1,25</b></p><p><b>2)</b></p><p class="calc">GH = 1,25 × CD<br>GH = 1,25 × 60<br>GH = <b>75 cm</b></p><p>D'après le codage, AB = AD = 35 cm, donc :</p><p class="calc">EF = 1,25 × AB<br>EF = 1,25 × 35<br>EF = <b>43,75 cm</b></p><p><b>3)</b> Les aires sont multipliées par k² :</p><p class="calc">A = 1 950 × 1,25²<br>A = 1 950 × 1,562 5<br>A = 3 046,875</p><p>soit environ <b>3 047 cm²</b>.</p>`},
  {n:"Exercice 8", t:"Brevet Polynésie, juillet 2019", w:"Sur ton cahier", h:`${ex("louvre2","La pyramide du Louvre",260)}<p>La pyramide du Louvre à Paris est une pyramide à base carrée de côté 35,4 m et de hauteur 21,6 m. C'est une réduction de la pyramide de Khéops en Égypte, qui mesure environ 230,5 m de côté.</p>
   <p><b>1)</b> Montrer que la hauteur de la pyramide de Khéops est d'environ 140,6 m.</p><p><b>2)</b> Calculer le volume en m³ de la pyramide du Louvre. (Arrondir à l'unité.)</p><p><b>3)</b> Par quel nombre peut-on multiplier le volume de la pyramide du Louvre pour obtenir celui de la pyramide de Khéops ? (Arrondir à l'unité.)</p><p><b>Rappel :</b> volume d'une pyramide = ${Fr("aire de la base × hauteur",3)}</p>`,
   c:`<p><b>1)</b> Le rapport d'agrandissement de la pyramide du Louvre à celle de Khéops est k = ${Fr("230,5","35,4")}. Hauteur de Khéops : 21,6 × ${Fr("230,5","35,4")} ≈ <b>140,6 m</b>.</p>
   <p><b>2)</b></p><p class="calc">V = ${Fr("35,4² × 21,6",3)}<br>V = ${Fr("1 253,16 × 21,6",3)}<br>V = 9 022,752</p><p>soit environ <b>9 023 m³</b>.</p>
   <p><b>3)</b> Les volumes sont multipliés par k³ = (${Fr("230,5","35,4")})³ ≈ 276,06 : on peut multiplier par environ <b>276</b>.</p>`}
 ]},
{t:"Triangles semblables : longueurs", e:[
  {n:"Activité 4", t:"Triangles semblables ?", w:"Sur ton cahier", h:`<p><b>Définition :</b> deux triangles sont semblables quand l'un est un agrandissement de l'autre (et, inversement, l'un est une réduction de l'autre).</p>
   <p><b>Problème 1 :</b> les triangles ABC et EFG sont-ils semblables ? Justifie.</p>${ex("abc_efg","Triangle EFG (EF = 1,4 ; FG = 2 ; EG = 3,2 cm) et triangle ABC (AB = 2,38 ; BC = 3,5 ; AC = 5,44 cm)",420)}
   <p><b>Problème 2 :</b> les triangles LKM et RST sont-ils semblables ? Justifie.</p>${ex("lkm_rst","Triangle RST (RS = 6 ; RT = 7,5 ; ST = 3 cm) et triangle LKM (LK = 2 ; KM = 4 ; LM = 5 cm)",340)}`,
   c:`<p><b>Problème 1 :</b> on range les côtés dans l'ordre : EFG : 1,4 ; 2 ; 3,2 et ABC : 2,38 ; 3,5 ; 5,44.</p><p class="calc">${Fr("2,38","1,4")} = 1,7 · ${Fr("3,5",2)} = 1,75 · ${Fr("5,44","3,2")} = 1,7</p><p>Les quotients ne sont pas tous égaux (1,7 ≠ 1,75) : <b>les triangles ne sont pas semblables</b>.</p>
   <p><b>Problème 2 :</b> LKM : 2 ; 4 ; 5 et RST : 3 ; 6 ; 7,5.</p><p class="calc">${Fr(3,2)} = 1,5 · ${Fr(6,4)} = 1,5 · ${Fr("7,5",5)} = 1,5</p><p>Les longueurs sont proportionnelles : <b>les triangles LKM et RST sont semblables</b> (RST est un agrandissement de LKM de rapport 1,5).</p>`},
  {n:"Exercice 9", t:"Démontrer que deux triangles sont semblables", w:"Sur ton cahier", h:`${ex("ghi_kjl","Triangle GHI (GH = 2 ; GI = 3 ; HI = 4 cm) et triangle KJL (KL = 0,8 ; JK = 1,2 ; JL = 1,6 cm)",330)}<p>Démontre que les triangles GHI et KJL sont semblables.</p>`,
   c:`<p>On range les côtés : KJL : 0,8 ; 1,2 ; 1,6 et GHI : 2 ; 3 ; 4.</p><p class="calc">${Fr("0,8",2)} = 0,4 · ${Fr("1,2",3)} = 0,4 · ${Fr("1,6",4)} = 0,4</p><p>Les longueurs des côtés sont deux à deux proportionnelles : <b>les triangles GHI et KJL sont semblables</b>.</p>`},
  {n:"Exercice 10", t:"La pente des toits", w:"Sur ton cahier", h:`${ex("maisons","Deux maisons : toit ABC (AB = BC = 3,9 m, AC = 7,2 m) et toit EDF (ED = DF = 6,5 m, EF = 12 m)",360)}<p>On cherche à savoir si la pente du toit est la même pour ces deux maisons.</p><p><b>1)</b> Démontre que les triangles ABC et EDF sont semblables.</p><p><b>2)</b> Que peut-on dire de la mesure des angles ${ang("BAC")} et ${ang("DEF")}, qui correspond à la pente du toit de chaque maison ?</p>`,
   c:`<p><b>1)</b> ABC : 3,9 ; 3,9 ; 7,2 et EDF : 6,5 ; 6,5 ; 12.</p><p class="calc">${Fr("6,5","3,9")} = ${Fr(5,3)} · ${Fr(12,"7,2")} = ${Fr(5,3)}</p><p>Les longueurs sont proportionnelles : <b>les triangles ABC et EDF sont semblables</b> (A et E, B et D, C et F sont homologues).</p>
   <p><b>2)</b> Les triangles sont semblables, donc leurs angles sont deux à deux de même mesure : <b>${ang("BAC")} = ${ang("DEF")}</b>. Les deux toits ont la même pente.</p>`},
  {n:"Exercice 11", t:"Calculer une longueur lorsque deux triangles sont semblables", w:"Sur ton cahier", h:`${ex("mer","Triangle MER (ME = 3,5 cm ; ER = 6,5 cm) et triangle ACL (AC = 1,6 cm ; CL = 1,4 cm ; AL = 2,6 cm)",380)}<p>Ces triangles semblables ont pour sommets homologues : M et C ; E et L ; R et A.</p><p>Cet exercice peut être réalisé de différentes façons.</p>
   <p><b>Méthode 1 : méthode libre.</b> a) Calcule la longueur MR avec la méthode de ton choix. Justifie.</p><p><b>Méthode 2 : méthode que l'on doit savoir utiliser en 3e.</b> a) Écris trois rapports de longueurs égaux. b) Calcule la longueur MR.</p>`,
   c:`<p><b>Méthode 1 :</b></p><p class="calc">k = ${Fr("ME","CL")}<br>k = ${Fr("3,5","1,4")}<br>k = 2,5</p><p>MER est un agrandissement de CLA de rapport 2,5. Donc :</p><p class="calc">MR = 2,5 × CA<br>MR = 2,5 × 1,6<br>MR = <b>4 cm</b></p>
   <p><b>Méthode 2 :</b> a) Les côtés homologues sont proportionnels : ${Fr("ME","CL")} = ${Fr("ER","LA")} = ${Fr("MR","CA")}.</p><p>b) ${Fr("3,5","1,4")} = ${Fr("6,5","2,6")} = ${Fr("MR","1,6")}, donc :</p><p class="calc">MR = ${Fr("3,5 × 1,6","1,4")}<br>MR = <b>4 cm</b></p>`}
 ]},
{t:"Triangles semblables : angles", e:[
  {n:"Activité 5", t:"Triangles semblables et angles", w:"Sur ta feuille", h:`<p>Il existe 2 propriétés qui font un lien entre les triangles semblables et les mesures d'angles. Essaie de les trouver par toi-même en complétant les pointillés au crayon de bois.</p>
   <div class="figs">${ex("act5a","Deux triangles semblables sur quadrillage",260)}${ex("act5b","Deux triangles ABC et DEF avec leurs angles codés",260)}</div>
   <p><b>Propriété 1 :</b> si deux triangles sont semblables, alors leurs angles ……</p><p><b>Propriété 2 :</b> si deux triangles ont leurs angles deux à deux de même mesure, alors ces triangles ……</p>`,
   c:`<p><b>Propriété 1 :</b> si deux triangles sont semblables, alors leurs angles <b>sont deux à deux de même mesure</b>.</p><p><b>Propriété 2 :</b> si deux triangles ont leurs angles deux à deux de même mesure, alors ces triangles <b>sont semblables</b> (il suffit même de deux angles).</p>`},
  {n:"Exercice 12", t:"Prouver que deux triangles sont semblables (à l'aide des angles)", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> prouve que ces deux triangles sont semblables.</p>${ex("p1","Triangle ABC (70° en A, 30° en B) et triangle DEF (70° en D, 80° en F)",250)}
   <p><b>Problème 2 :</b> les points A, E et C sont alignés et les points A, B et D sont alignés. Prouve que les triangles ACD et AEB sont semblables.</p>${ex("p2","Triangles ACD et AEB : 23° en A, 47° en B, 110° en C",150)}
   <p><b>Problème 3 :</b></p>${ex("p3","a) Triangle ABC avec deux angles de 55° et AB = 2 cm ; triangle DEF isocèle en E avec un angle de 70° et DE = 1,4 cm",330)}
   <p><b>Problème 4 :</b> reprends les deux maisons de l'exercice 10. Montre que la pente du toit des deux maisons est la même, c'est-à-dire montre que les angles ${ang("BAC")} et ${ang("DEF")} ont la même mesure.</p>${ex("maisons","Les deux maisons",300)}`,
   c:`<p><b>Problème 1 :</b> dans ABC :</p><p class="calc">${ang("ACB")} = 180° − 70° − 30°<br>${ang("ACB")} = 80°</p><p>Donc ${ang("BAC")} = ${ang("EDF")} = 70° et ${ang("ACB")} = ${ang("DFE")} = 80° : deux angles deux à deux de même mesure, <b>les triangles sont semblables</b>.</p>
   <p><b>Problème 2 :</b> l'angle ${ang("CAD")} est commun aux deux triangles (23°). Dans AEB :</p><p class="calc">${ang("AEB")} = 180° − 23° − 47°<br>${ang("AEB")} = 110°</p><p>Donc ${ang("AEB")} = ${ang("ACD")}. Les triangles ACD et AEB ont deux angles deux à deux de même mesure : <b>ils sont semblables</b>.</p>
   <p><b>Problème 3 : a)</b> Dans ABC :</p><p class="calc">${ang("ABC")} = 180° − 55° − 55°<br>${ang("ABC")} = 70°</p><p>DEF est isocèle en E, donc ${ang("EDF")} = ${ang("EFD")}.</p><p class="calc">${ang("EDF")} = (180° − 70°) ÷ 2<br>${ang("EDF")} = 110° ÷ 2<br>${ang("EDF")} = 55°</p><p>Les deux triangles ont leurs angles deux à deux de même mesure (55°, 55°, 70°) : <b>ils sont semblables</b>.</p><p><b>b)</b> B et E sont homologues (70°), A et D aussi : [DE] est l'image de [AB]. Rapport de réduction : ${Fr("1,4",2)} = <b>0,7</b>.</p>
   <p><b>Problème 4 :</b> les triangles ABC et EDF sont semblables (exercice 10 : longueurs proportionnelles). Donc leurs angles sont deux à deux de même mesure, et ${ang("BAC")} = ${ang("DEF")} : <b>les deux toits ont la même pente</b>.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Agrandissement et réduction", schema:S_K, q:{
 1:[ {g:()=>{ const k=pick([0.2,0.5,0.6,0.8,1.5,2,2.5,3,1]); return {q:`On multiplie toutes les longueurs d'une figure par ${F(k)}. C'est…`, c:["un agrandissement","une réduction","une reproduction"], rep:k>1?"un agrandissement":k<1?"une réduction":"une reproduction", ex:k>1?"k > 1 : agrandissement.":k<1?"k < 1 : réduction.":"k = 1 : reproduction.", sx:S_K}; }} ],
 2:[ {g:()=>{ const k=pick([1.5,2,2.5,3,0.5,0.4,0.6]), a=ri(2,12); return {q:`Une figure est ${k>1?"agrandie":"réduite"} avec le rapport ${F(k)}. Un côté mesure ${a} cm. Combien mesure ce côté sur la nouvelle figure (en cm) ?`, rep:[F(k*a),F(k*a)+" cm"], ex:`${F(k)} × ${a} = ${F(k*a)} cm.`, sx:S_K}; }} ],
 3:[ {g:()=>{ const k=pick([0.4,0.6,0.75,1.5,2.5,1.2,0.8]), a=ri(2,9)*5, b=r3(k*a); return {q:`Un côté mesure ${a} cm sur la figure initiale et ${F(b)} cm sur la figure finale. Quel est le rapport k ?`, rep:[F(k)], c:shuf(uniq(F(k),[F(r3(1/k),2),F(r3(b-a)),F(r3(k*k))])), ex:`<br>k = ${Fr("longueur finale","longueur initiale")}<br>k = ${F(b)} ÷ ${a}<br>k = ${F(k)}`, sx:S_K}; }},
     {q:"Lors d'un agrandissement de rapport 2, que deviennent les angles ?", c:["ils ne changent pas","ils sont multipliés par 2","ils sont multipliés par 4"], rep:"ils ne changent pas", ex:"Lors d'un agrandissement ou d'une réduction, les mesures des angles sont inchangées.", sx:S_K} ]
}},
{nom:"Aires et volumes", schema:S_AV, q:{
 1:[ {g:()=>{ const k=pick([2,3,4,5,10]), t=pick(["aire","volume"]); const r=t==="aire"?k*k:k*k*k; return {q:`On agrandit une figure avec le rapport ${k}. Par combien est multiplié${t==="aire"?"e son aire":" son volume"} ?`, c:shuf(uniq(String(r),[String(k),String(t==="aire"?k*k*k:k*k),String(2*k)])), rep:String(r), ex:t==="aire"?`Aire × k² = ${k}² = ${k*k}.`:`Volume × k³ = ${k}³ = ${k*k*k}.`, sx:S_AV}; }} ],
 2:[ {g:()=>{ const k=pick([0.5,0.6,1.5,2,2.5,3]), A=ri(2,15)*4; return {q:`Un rectangle a une aire de ${A} cm². On ${k>1?"l'agrandit":"le réduit"} avec le rapport ${F(k)}. Quelle est la nouvelle aire (en cm²) ?`, rep:[F(r3(A*k*k)),F(r3(A*k*k))+" cm²"], ex:`<br>A = ${A} × ${F(k)}²<br>A = ${A} × ${F(r3(k*k))}<br>A = ${F(r3(A*k*k))} cm²`, sx:S_AV}; }} ],
 3:[ {g:()=>{ const k=pick([0.5,2,3,1.5,0.1]), V0=pick([2,4,8,16,24,40]); return {q:`Un solide a un volume de ${V0} cm³. On ${k>1?"l'agrandit":"le réduit"} avec le rapport ${F(k)}. Quel est le nouveau volume (en cm³) ?`, rep:[F(r3(V0*k**3),4),F(r3(V0*k**3),4)+" cm³"], ex:`<br>V = ${V0} × ${F(k)}³<br>V = ${V0} × ${F(r3(k**3),4)}<br>V = ${F(r3(V0*k**3),4)} cm³`, sx:S_AV}; }},
     {g:()=>{ const k=pick([2,3,4,5,7]), A=ri(3,30); return {q:`Un carré d'aire ${A} cm² a maintenant une aire de ${A*k*k} cm². Quel est le rapport d'agrandissement ?`, c:shuf(uniq(String(k),[String(k*k),String(2*k),String(k*k*k)])), rep:String(k), ex:`${A*k*k} ÷ ${A} = ${k*k} = ${k}² : les longueurs ont été multipliées par ${k}.`, sx:S_AV}; }} ]
}},
{nom:"Triangles semblables : longueurs", schema:S_SL, q:{
 1:[ {q:"Deux triangles sont semblables quand…", c:["leurs longueurs sont deux à deux proportionnelles","ils ont un côté de même longueur","ils ont le même périmètre"], rep:"leurs longueurs sont deux à deux proportionnelles", sx:S_SL} ],
 2:[ {g:()=>{ const base=pick([[2,3,4],[3,4,5],[4,5,6],[2,2.5,4],[3,5,7]]), k=pick([1.5,2,2.5,0.5,1.2]), yes=Math.random()<0.5; const s2=base.map(x=>r3(x*k)); if(!yes) s2[2]=r3(s2[2]+pick([0.5,1,-0.5])); const [n1,n2]=shuf(NOMS3).slice(0,2);
       return {q:`Le triangle ${n1} a pour côtés ${base.map(x=>F(x)).join(" cm ; ")} cm. Le triangle ${n2} a pour côtés ${s2.map(x=>F(x)).join(" cm ; ")} cm. Sont-ils semblables ?`, c:["Oui","Non"], rep:yes?"Oui":"Non", ex:`Quotients : ${s2.map((x,i)=>`${F(x)} ÷ ${F(base[i])} = ${F(r3(x/base[i]),3)}`).join(" ; ")}. ${yes?"Ils sont égaux : les triangles sont semblables.":"Ils ne sont pas tous égaux : les triangles ne sont pas semblables."}`, sx:S_SL}; }} ],
 3:[ {g:()=>{ const s=pick([[2,4,5],[3,4,6],[2,3,4],[4,5,7]]), k=pick([1.5,2,2.5,3]); const i=ri(0,2);
       return {q:`Les triangles ABC et DEF sont semblables : AB = ${s[0]} cm, BC = ${s[1]} cm, CA = ${s[2]} cm, et DE = ${F(s[0]*k)} cm (A et D, B et E, C et F sont homologues). Combien mesure ${["EF","FD"][i%2]} (en cm) ?`, rep:[F(s[1+i%2]*k),F(s[1+i%2]*k)+" cm"], ex:`<br>k = ${Fr("DE","AB")}<br>k = ${F(s[0]*k)} ÷ ${s[0]}<br>k = ${F(k)}<br>${["EF","FD"][i%2]} = ${F(k)} × ${s[1+i%2]}<br>${["EF","FD"][i%2]} = ${F(s[1+i%2]*k)} cm`, sx:S_SL}; }} ]
}},
{nom:"Triangles semblables : angles", schema:S_SA, q:{
 1:[ {q:"Si deux triangles sont semblables, alors leurs angles…", c:["sont deux à deux de même mesure","sont tous égaux à 60°","sont proportionnels"], rep:"sont deux à deux de même mesure", sx:S_SA} ],
 2:[ {g:()=>{ const a=ri(25,80), b=ri(25,80), c=180-a-b; return {q:`Dans un triangle, deux angles mesurent ${a}° et ${b}°. Combien mesure le troisième angle (en degrés) ?`, rep:[String(c),c+"°"], ex:`180° − ${a}° − ${b}° = ${c}°.`, sx:S_SA}; }} ],
 3:[ {g:()=>{ const a=ri(25,75), b=ri(25,75), c=180-a-b, yes=Math.random()<0.5, d=yes?c:c+pick([-6,-4,4,6]);
       return {q:`Le triangle ABC a des angles de ${a}° et ${b}°. Le triangle DEF a des angles de ${a}° et ${d}°. Sont-ils semblables ?`, c:["Oui","Non"], rep:yes?"Oui":"Non", ex:`Le troisième angle de ABC mesure 180° − ${a}° − ${b}° = ${c}°. ${yes?`ABC et DEF ont deux angles de même mesure (${a}° et ${c}°) : ils sont semblables.`:`Les angles de ABC sont ${a}°, ${b}°, ${c}° ; ceux de DEF sont ${a}°, ${d}° et ${180-a-d}° : ils ne sont pas deux à deux égaux.`}`, sx:S_SA}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
  titre:"Évaluation d'entraînement · chapitre 10", duree:55, info:"Durée : 55 min · Calculatrice autorisée · Règle et rapporteur",
  comp:[
    ["CALCULER","Je calcule des longueurs et un rapport d'agrandissement ou de réduction.","Ex. 1 (4 points)"],
    ["CALCULER","J'utilise l'effet d'un agrandissement ou d'une réduction sur les aires et les volumes.","Ex. 2 (4 points)"],
    ["RAISONNER","Je prouve que deux triangles sont semblables (longueurs ou angles).","Ex. 3 et 5 (7 points)"],
    ["CALCULER","Je calcule une longueur dans des triangles semblables.","Ex. 4 (5 points)"]
  ],
  exos:[
  {t:"Une affiche", p:4, h:`<p>Une photo rectangulaire mesure 12 cm sur 8 cm. On l'agrandit pour en faire une affiche dont la longueur mesure 54 cm.</p><p><b>a)</b> Calcule le rapport d'agrandissement.</p><p><b>b)</b> Calcule la largeur de l'affiche.</p><p><b>c)</b> On réduit ensuite la photo de départ avec le rapport 0,75 pour une carte postale. Donne les dimensions de la carte.</p>`,
   c:`<p><b>a)</b></p><p class="calc">k = ${Fr(54,12)}<br>k = 4,5</p><p><i>(1,5 point)</i></p><p><b>b)</b> 4,5 × 8 = 36 cm. <i>(1 point)</i></p><p><b>c)</b> 0,75 × 12 = 9 cm et 0,75 × 8 = 6 cm : la carte mesure 9 cm sur 6 cm. <i>(1,5 point)</i></p>`},
  {t:"Aires et volumes", p:4, h:`<p><b>a)</b> Un jardin a une aire de 250 m². Sur un plan, il est représenté par une réduction de rapport 0,02. Quelle est l'aire du jardin sur le plan, en m² puis en cm² ?</p><p><b>b)</b> Une boîte a un volume de 1,5 L. On fabrique une boîte agrandie de rapport 2. Quel est son volume ?</p>`,
   c:`<p><b>a)</b> Les aires sont multipliées par k² = 0,02² = 0,000 4 :</p><p class="calc">A = 250 × 0,000 4<br>A = 0,1 m²<br>A = 1 000 cm²</p><p><i>(2 points)</i></p><p><b>b)</b> Les volumes sont multipliés par k³ = 2³ = 8 :</p><p class="calc">V = 1,5 × 8<br>V = 12 L</p><p><i>(2 points)</i></p>`},
  {t:"Semblables ou pas ?", p:3, h:`<p>Les triangles suivants sont-ils semblables ? Justifie.</p><div class="figs">${triSVG("KLM",5,4,3,{show:{a:"5 cm",b:"4 cm",c:"3 cm"},k:30})}${triSVG("PQR",7.5,6,4.5,{show:{a:"7,5 cm",b:"6 cm",c:"4,5 cm"},k:30,rot:15})}${triSVG("STU",8,6.5,4.8,{show:{a:"8 cm",b:"6,5 cm",c:"4,8 cm"},k:24})}</div><p><b>a)</b> KLM et PQR ? <b>b)</b> KLM et STU ?</p>`,
   c:`<p><b>a)</b> ${Fr("4,5",3)} = 1,5 ; ${Fr(6,4)} = 1,5 ; ${Fr("7,5",5)} = 1,5 : les longueurs sont proportionnelles, KLM et PQR sont semblables. <i>(1,5 point)</i></p><p><b>b)</b> ${Fr("4,8",3)} = 1,6 ; ${Fr("6,5",4)} = 1,625 : les quotients ne sont pas égaux, KLM et STU ne sont pas semblables. <i>(1,5 point)</i></p>`},
  {t:"Calculer des longueurs", p:5, h:`<p>Les triangles ABC et DEF sont semblables. Les sommets homologues sont : A et D ; B et E ; C et F.</p><div class="figs">${triSVG("ABC",4.2,3.6,2.4,{show:{a:"4,2 cm",b:"3,6 cm",c:"AB = ?"},k:30})}${triSVG("DEF",7,6,4,{show:{a:"EF = ?",b:"6 cm",c:"4 cm"},k:30,flip:true})}</div><p>On donne BC = 4,2 cm, CA = 3,6 cm, DE = 4 cm et DF = 6 cm.</p><p><b>a)</b> Écris les trois rapports de longueurs égaux.</p><p><b>b)</b> Calcule le rapport qui permet de passer de ABC à DEF.</p><p><b>c)</b> Calcule EF puis AB.</p>`,
   c:`<p><b>a)</b> ${Fr("DE","AB")} = ${Fr("EF","BC")} = ${Fr("DF","AC")} <i>(1 point)</i></p><p><b>b)</b> ${Fr("DF","AC")} = ${Fr(6,"3,6")} = ${Fr(5,3)} (environ 1,67). <i>(1 point)</i></p><p><b>c)</b></p><p class="calc">EF = ${Fr(5,3)} × 4,2<br>EF = 7 cm</p><p><i>(1,5 point)</i></p><p class="calc">AB = DE ÷ ${Fr(5,3)}<br>AB = 4 × ${Fr(3,5)}<br>AB = 2,4 cm</p><p><i>(1,5 point)</i></p>`},
  {t:"Avec les angles", p:4, h:`<p>Les points R, U et S sont alignés, ainsi que les points R, V et T. On donne ${ang("SRT")} = 38°, ${ang("RUV")} = 64° et ${ang("RTS")} = 78°.</p>${geo({P:{R:[0,0],S:[6,0],T:V.add([0,0],V.mul([Math.cos(38*Math.PI/180),Math.sin(38*Math.PI/180)],6*Math.sin(64*Math.PI/180)/Math.sin(78*Math.PI/180))),U:[3.2,0],V:V.mul([Math.cos(38*Math.PI/180),Math.sin(38*Math.PI/180)],3.2*Math.sin(64*Math.PI/180)/Math.sin(78*Math.PI/180))}, k:46, pad:30, poly:[[["R","S","T"],"orig"]], seg:[["U","V","ln"]], angs:[["R","S","T","38°",0.9],["U","R","V","64°",0.6],["T","R","S","78°",0.6]], x:["R","S","T","U","V"], cen:[3,1.5], alt:"Triangle RST et segment [UV]"})}
   <p><b>a)</b> Calcule ${ang("RVU")}.</p><p><b>b)</b> Démontre que les triangles RUV et RST sont semblables. Précise les sommets homologues.</p><p><b>c)</b> Calcule ${ang("RST")}.</p>`,
   c:`<p><b>a)</b> Dans le triangle RUV :</p><p class="calc">${ang("RVU")} = 180° − 38° − 64°<br>${ang("RVU")} = 78°</p><p><i>(1 point)</i></p><p><b>b)</b> ${ang("URV")} = ${ang("SRT")} = 38° (angle commun) et ${ang("RVU")} = ${ang("RTS")} = 78°. Les triangles RUV et RST ont deux angles deux à deux de même mesure : ils sont semblables. Sommets homologues : R et R, V et T, U et S. <i>(2 points)</i></p><p><b>c)</b> Les angles homologues ont la même mesure : ${ang("RST")} = ${ang("RUV")} = 64° (ou 180° − 38° − 78° = 64°). <i>(1 point)</i></p>`}
  ]}
};
window.G3k10={V, geo, F, ang, fig, triSVG, NOMS3, Fr};
})();
