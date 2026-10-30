/* Outils partagés : figures géométriques construites (symétries) et division posée */
const G = {
  sym:(P,O)=>[2*O[0]-P[0], 2*O[1]-P[1]],
  foot:(P,A,B)=>{ const dx=B[0]-A[0], dy=B[1]-A[1], t=((P[0]-A[0])*dx+(P[1]-A[1])*dy)/(dx*dx+dy*dy); return [A[0]+t*dx, A[1]+t*dy]; },
  refl:(P,A,B)=>{ const H=G.foot(P,A,B); return [2*H[0]-P[0], 2*H[1]-P[1]]; },
  inter:(A,B,C,D)=>{ const a1=B[1]-A[1], b1=A[0]-B[0], c1=a1*A[0]+b1*A[1], a2=D[1]-C[1], b2=C[0]-D[0], c2=a2*C[0]+b2*C[1], det=a1*b2-a2*b1; return [(c1*b2-c2*b1)/det, (a1*c2-a2*c1)/det]; },
  /* applique une transformation à une liste de points nommés : renvoie {nom': coord} */
  map:(pts, names, f, suffix="'")=>{ const o={}; names.forEach(n=>o[n+suffix]=f(pts[n])); return o; }
};

/*
  geo(o) dessine une figure :
  o.pts     {nom:[x,y]}           coordonnées (unités libres, multipliées par o.s)
  o.s       échelle (défaut 1)    o.grid {c:colonnes, r:lignes} : quadrillage en unités (o.s = taille d'un carreau)
  o.polys   [{v:[noms], k:"orig"|"img"}]   o.segs [[A,B,k]]   o.circles [{c:nom, r:rayon, k}]
  o.lines   [{a,b,lab}]  droites infinies passant par deux points (noms ou coordonnées)
  o.cons    [[P, O, P2, n]]  construction d'un demi-tour : pointillés P→P2 avec codage (n traits)
  o.ax      [[P, P2, A, B, n]] construction d'une symétrie axiale par rapport à (AB)
  o.marks   noms des points à marquer d'une croix (défaut : tous les sommets et centres)
  o.hide    noms à ne pas étiqueter
*/
function geo(o){
  const s=o.s||1, P={}; for(const k in o.pts) P[k]=[o.pts[k][0]*s, o.pts[k][1]*s];
  const pt = v => Array.isArray(v) ? [v[0]*s, v[1]*s] : P[v];
  const used=new Set(); (o.polys||[]).forEach(p=>p.v.forEach(n=>used.add(n))); (o.segs||[]).forEach(g=>{used.add(g[0]);used.add(g[1]);});
  (o.circles||[]).forEach(c=>used.add(c.c)); (o.marks||[]).forEach(n=>used.add(n)); (o.cons||[]).forEach(c=>c.slice(0,3).forEach(n=>used.add(n))); (o.ax||[]).forEach(c=>c.slice(0,2).forEach(n=>used.add(n)));
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9; const grow=(x,y,r=0)=>{x0=Math.min(x0,x-r);y0=Math.min(y0,y-r);x1=Math.max(x1,x+r);y1=Math.max(y1,y+r);};
  used.forEach(n=>{ if(!P[n]) return; grow(...P[n]); const L=String((o.names&&o.names[n])||n).length; if(L>2){ grow(P[n][0]-L*7-12, P[n][1]); grow(P[n][0]+L*7+12, P[n][1]); } }); (o.circles||[]).forEach(c=>grow(...P[c.c], c.r*s));
  (o.lines||[]).forEach(l=>{ const A=pt(l.a), B=pt(l.b); if(!o.grid){ grow(...A); grow(...B); } });
  if(o.grid){ grow(0,0); grow(o.grid.c*s, o.grid.r*s); }
  let W0=x1-x0; const maxW = o.w || Math.min(620, W0+60); const K=Math.max(1,(W0+60)/maxW);
  const m=(o.grid?22:30)*K; x0-=m; y0-=m; x1+=m; y1+=m; const W=x1-x0, H=y1-y0;
  let svg=`<svg class="fig geo" viewBox="${x0.toFixed(1)} ${y0.toFixed(1)} ${W.toFixed(1)} ${H.toFixed(1)}" width="${maxW.toFixed(0)}" role="img" aria-label="${o.alt||"Figure de géométrie"}">`;
  if(o.grid){ for(let i=0;i<=o.grid.c;i++) svg+=`<line x1="${i*s}" y1="0" x2="${i*s}" y2="${o.grid.r*s}" class="gridl"/>`; for(let j=0;j<=o.grid.r;j++) svg+=`<line x1="0" y1="${j*s}" x2="${o.grid.c*s}" y2="${j*s}" class="gridl"/>`; }
  const L=Math.max(W,H)*3;
  (o.lines||[]).forEach(l=>{ const A=pt(l.a), B=pt(l.b), d=Math.hypot(B[0]-A[0],B[1]-A[1]), ux=(B[0]-A[0])/d, uy=(B[1]-A[1])/d;
    svg+=`<line x1="${A[0]-ux*L}" y1="${A[1]-uy*L}" x2="${A[0]+ux*L}" y2="${A[1]+uy*L}" class="${l.k||"axe2"}"/>`;
    if(l.lab){ const f=l.t??0, X=A[0]+(B[0]-A[0])*f, Y=A[1]+(B[1]-A[1])*f; svg+=`<text x="${(X+10*K).toFixed(1)}" y="${(Y-6*K).toFixed(1)}" class="glab" style="font-size:${16*K}px">${l.lab}</text>`; } });
  (o.circles||[]).forEach(c=>svg+=`<circle cx="${P[c.c][0]}" cy="${P[c.c][1]}" r="${c.r*s}" class="${c.k||"orig"}" fill-opacity="0"/>`);
  (o.polys||[]).forEach(p=>svg+=`<polygon points="${p.v.map(n=>P[n].join(",")).join(" ")}" class="${p.k||"orig"}"/>`);
  (o.segs||[]).forEach(g=>svg+=`<line x1="${P[g[0]][0]}" y1="${P[g[0]][1]}" x2="${P[g[1]][0]}" y2="${P[g[1]][1]}" class="${g[2]||"orig"}"/>`);
  const tick=(A,B,n)=>{ const mx=(A[0]+B[0])/2, my=(A[1]+B[1])/2, d=Math.hypot(B[0]-A[0],B[1]-A[1])||1, ux=(B[0]-A[0])/d, uy=(B[1]-A[1])/d; let t="";
    for(let i=0;i<n;i++){ const off=(i-(n-1)/2)*4.5*K, cx=mx+ux*off, cy=my+uy*off; t+=`<line x1="${cx-uy*6*K}" y1="${cy+ux*6*K}" x2="${cx+uy*6*K}" y2="${cy-ux*6*K}" class="tick"/>`; } return t; };
  (o.cons||[]).forEach(([a,c,b,n])=>{ const A=P[a],C=P[c],B=P[b]; svg+=`<line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}" class="cons"/>`+tick(A,C,n||1)+tick(C,B,n||1); });
  (o.ax||[]).forEach(([a,b,la,lb,n])=>{ const A=P[a],B=P[b],H=G.foot(A,pt(la),pt(lb)); svg+=`<line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}" class="cons"/>`+tick(A,H,n||1)+tick(H,B,n||1);
    const d=Math.hypot(B[0]-A[0],B[1]-A[1])||1, ux=(B[0]-A[0])/d, uy=(B[1]-A[1])/d, Ld=pt(lb), Lc=pt(la), e=Math.hypot(Ld[0]-Lc[0],Ld[1]-Lc[1]), vx=(Ld[0]-Lc[0])/e, vy=(Ld[1]-Lc[1])/e, q=7*K;
    if(d>1) svg+=`<path d="M${H[0]+ux*q} ${H[1]+uy*q} L${H[0]+ux*q+vx*q} ${H[1]+uy*q+vy*q} L${H[0]+vx*q} ${H[1]+vy*q}" class="tick" fill="none"/>`; });
  /* étiquettes : écartées du centre des polygones */
  const hide=new Set(o.hide||[]), placed=[];
  used.forEach(n=>{ if(!P[n]) return; const [x,y]=P[n]; const c5=5*K; svg+=`<path d="M${x-c5} ${y-c5} L${x+c5} ${y+c5} M${x+c5} ${y-c5} L${x-c5} ${y+c5}" class="gx"/>`;
    if(hide.has(n)) return;
    const poly=(o.polys||[]).find(p=>p.v.includes(n)); let dx=10*K, dy=-10*K;
    if(poly){ const cx=poly.v.reduce((a,v)=>a+P[v][0],0)/poly.v.length, cy=poly.v.reduce((a,v)=>a+P[v][1],0)/poly.v.length, d=Math.hypot(x-cx,y-cy)||1; dx=(x-cx)/d*17*K; dy=(y-cy)/d*17*K; }
    const isImg = /['’₁₂₃]|\d$/.test(n) && n.length>1;
    let k=1; while(k<2.6 && placed.some(([px,py])=>Math.hypot(px-(x+dx*k),py-(y+dy*k))<16*K)) k+=0.4;
    if(k>=2.6){ k=1; const t=dx; dx=-dy; dy=t; }
    dx*=k; dy*=k; placed.push([x+dx,y+dy]);
    svg+=`<text x="${(x+dx).toFixed(1)}" y="${(y+dy+5*K).toFixed(1)}" class="glab${isImg?" gimg":""}" text-anchor="middle" style="font-size:${16*K}px">${(o.names&&o.names[n])||n}</text>`; });
  return svg+(o.extra||"")+"</svg>";
}

/* Motif « drapeau » et ses images : list = [{n:numéro, f:transformation du point}] */
const FLAG=[[60,150],[60,80],[102,96],[66,110],[66,150]];
function flags(list, W=380, H=260, extra=""){
  let s=`<svg class="fig geo" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Motifs numérotés">`;
  list.forEach(({n,f})=>{ const pts=FLAG.map(f); const [cx,cy]=f([44,128]);
    s+=`<polygon points="${pts.map(p=>p.map(v=>v.toFixed(1)).join(",")).join(" ")}" class="orig"/>`;
    s+=`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="11" fill="var(--surface)" stroke="var(--ink)" stroke-width="1.2"/><text x="${cx.toFixed(1)}" y="${(cy+5).toFixed(1)}" class="gnum">${n}</text>`; });
  return s+extra+"</svg>";
}
const TF={
  id:p=>p, vx:a=>p=>[2*a-p[0],p[1]], hy:b=>p=>[p[0],2*b-p[1]], rot:(cx,cy)=>p=>[2*cx-p[0],2*cy-p[1]],
  tr:(dx,dy)=>p=>[p[0]+dx,p[1]+dy], q:(cx,cy)=>p=>[cx-(p[1]-cy),cy+(p[0]-cx)], o:(f,g)=>p=>f(g(p))
};

/* Division euclidienne posée (potence) */
function potence(N, d){
  const D=String(N).split("").map(Number); let i=0, cur=0;
  while(i<D.length && (cur<d || i===0)){ cur=cur*10+D[i]; i++; if(cur>=d) break; }
  const lines=[{t:String(N), end:D.length-1}]; let q="", end=i-1;
  while(true){
    const qq=Math.floor(cur/d), prod=qq*d, rem=cur-prod; q+=qq;
    lines.push({t:String(prod), end, sub:true});
    if(i<D.length){ const nxt=rem*10+D[i]; lines.push({t:String(nxt), end:i}); cur=nxt; end=i; i++; }
    else { lines.push({t:String(rem), end, last:true}); break; }
  }
  const html=lines.map(l=>`<div class="pl${l.sub?" sub":""}${l.last?" rest":""}" style="padding-left:${l.end+1-l.t.length}ch"><span${l.sub?' class="mn"':""}>${l.t}</span></div>`).join("");
  return `<div class="pot" role="img" aria-label="Division posée de ${N} par ${d} : quotient ${Number(q)}, reste ${lines[lines.length-1].t}"><div class="pleft">${html}</div><div class="pright"><div class="pd">${d}</div><div class="pq">${Number(q)}</div></div></div>`;
}
