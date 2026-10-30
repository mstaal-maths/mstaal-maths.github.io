/* 4e — Chapitre 2 : La translation (cours, fiche d'exercices, exercices en +, activités et TP de M. Staal)
   Photos (frises, pavages) : images des documents Word (img/4k2co, 4k2ex, 4k2cr).
   Figures de construction : redessinées en SVG avec les coordonnées des figures de M. Staal ;
   les images par translation sont calculées (ce qui est dessiné est exactement la bonne réponse). */
(function(){
const VF=["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const co=(p,alt,w)=>img("4k2co/"+p+".png",alt,w), ex=(p,alt,w)=>img("4k2ex/"+p+".png",alt,w), cr=(p,alt,w)=>img("4k2cr/"+p+".png",alt,w);
const fig=(cap,body)=>{ const m=/^<img[^>]*width:(\d+)px/.exec(body); return `<figure${m?` style="max-width:${Math.max(+m[1],150)}px"`:""}>${body}${cap?`<figcaption>${cap}</figcaption>`:""}</figure>`; };
const ang=s=>`<span class="ang">${s}</span>`;
const r3=x=>Math.round(x*1000)/1000;
const F=x=>{ const r=r3(x); const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
/* vecteur : flèche au-dessus des deux lettres */
const vec=s=>`<span style="display:inline-block;position:relative;padding-top:.42em;line-height:1;white-space:nowrap">${s}<svg aria-hidden="true" viewBox="0 0 100 12" preserveAspectRatio="none" style="position:absolute;left:0;top:0;width:100%;height:.42em;overflow:visible"><path d="M3 6H95M83 1L97 6L83 11" fill="none" stroke="currentColor" stroke-width="1.5" vector-effect="non-scaling-stroke"/></svg></span>`;

/* ------------------------------------------------------------------
   Figure SVG (coordonnées en carreaux, y vers le BAS comme sur la feuille)
   grid [x0,y0,x1,y1] quadrillage · polys [[pts, classe]] (orig / img / ln / fl) · lines [[p,q,classe]]
   pts [[nom,x,y,dx,dy]] croix + nom · vecs [[p,q,couleur]] flèches · txt [[texte,x,y,style]]
------------------------------------------------------------------ */
const C_INK="var(--ink)", C_C="var(--c)";
function G(o){
  const k=o.k||30, pad=o.pad??22, all=[];
  if(o.grid){ all.push([o.grid[0],o.grid[1]],[o.grid[2],o.grid[3]]); }
  (o.polys||[]).forEach(([p])=>p.forEach(q=>all.push(q)));
  (o.lines||[]).forEach(([p,q])=>all.push(p,q));
  (o.pts||[]).forEach(([,x,y])=>all.push([x,y]));
  (o.vecs||[]).forEach(([p,q])=>all.push(p,q));
  (o.txt||[]).forEach(([,x,y])=>all.push([x,y]));
  (o.box||[]).forEach(p=>all.push(p));
  const mx=Math.min(...all.map(p=>p[0])), Mx=Math.max(...all.map(p=>p[0])), my=Math.min(...all.map(p=>p[1])), My=Math.max(...all.map(p=>p[1]));
  const X=x=>pad+(x-mx)*k, Y=y=>pad+(y-my)*k, f=v=>v.toFixed(1);
  const W=Math.round((Mx-mx)*k+2*pad), H=Math.round((My-my)*k+2*pad);
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${o.w?Math.min(o.w,W):W}" role="img" aria-label="${o.alt||"Figure"}">`;
  if(o.grid){ const [x0,y0,x1,y1]=o.grid;
    for(let x=Math.ceil(x0);x<=x1+1e-9;x++) s+=`<line x1="${f(X(x))}" y1="${f(Y(y0))}" x2="${f(X(x))}" y2="${f(Y(y1))}" class="gridl"/>`;
    for(let y=Math.ceil(y0);y<=y1+1e-9;y++) s+=`<line x1="${f(X(x0))}" y1="${f(Y(y))}" x2="${f(X(x1))}" y2="${f(Y(y))}" class="gridl"/>`; }
  (o.rect||[]).forEach(([a,b])=>{ s+=`<rect x="${f(X(a[0]))}" y="${f(Y(a[1]))}" width="${f((b[0]-a[0])*k)}" height="${f((b[1]-a[1])*k)}" style="fill:none;stroke:var(--ink);stroke-width:2.6"/>`; });
  const PS={orig:'class="orig"', img:'class="img"', ln:'style="fill:none;stroke:var(--ink);stroke-width:2.4;stroke-linejoin:round;stroke-linecap:round"', li:'style="fill:none;stroke:var(--c);stroke-width:2.6;stroke-linejoin:round;stroke-linecap:round"'};
  (o.polys||[]).forEach(([p,c,open,col])=>{ const pts=p.map(q=>f(X(q[0]))+","+f(Y(q[1]))).join(" ");
    s+= col ? `<${open?"polyline":"polygon"} points="${pts}" style="fill:${open?"none":col+"33"};stroke:${col};stroke-width:2.6;stroke-linejoin:round;stroke-linecap:round"/>`
            : `<${open?"polyline":"polygon"} points="${pts}" ${PS[c||"orig"]}/>`; });
  const LS={ln:"stroke:var(--ink);stroke-width:2.4", li:"stroke:var(--c);stroke-width:2.6", cons:"stroke:var(--muted);stroke-width:1.5;stroke-dasharray:6 5", fin:"stroke:var(--ink);stroke-width:1.6"};
  (o.lines||[]).forEach(([p,q,c])=>{ s+=`<line x1="${f(X(p[0]))}" y1="${f(Y(p[1]))}" x2="${f(X(q[0]))}" y2="${f(Y(q[1]))}" style="${LS[c||"ln"]};stroke-linecap:round"/>`; });
  (o.vecs||[]).forEach(([p,q,col])=>{ const c=col||C_INK, x1=X(p[0]), y1=Y(p[1]), x2=X(q[0]), y2=Y(q[1]), L=Math.hypot(x2-x1,y2-y1), ux=(x2-x1)/L, uy=(y2-y1)/L, h=12, w=5;
    s+=`<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2-ux*h*0.8)}" y2="${f(y2-uy*h*0.8)}" style="stroke:${c};stroke-width:2"/><polygon points="${f(x2)},${f(y2)} ${f(x2-ux*h-uy*w)},${f(y2-uy*h+ux*w)} ${f(x2-ux*h+uy*w)},${f(y2-uy*h-ux*w)}" style="fill:${c}"/>`; });
  (o.pts||[]).forEach(([n,x,y,dx=10,dy=-10,col])=>{ const px=X(x), py=Y(y), c=col||C_INK;
    s+=`<path d="M${f(px-5)} ${f(py-5)}L${f(px+5)} ${f(py+5)}M${f(px-5)} ${f(py+5)}L${f(px+5)} ${f(py-5)}" style="stroke:${c};stroke-width:2"/>`;
    if(n) s+=`<text x="${f(px+dx)}" y="${f(py+dy+5)}" text-anchor="middle" style="font-weight:700;font-size:16px;fill:${c}">${n}</text>`; });
  (o.txt||[]).forEach(([t,x,y,st])=>{ s+=`<text x="${f(X(x))}" y="${f(Y(y)+5)}" text-anchor="middle" style="font-weight:700;font-size:16px;fill:var(--ink);${st||""}">${t}</text>`; });
  return s+"</svg>";
}
const add=(p,v)=>[r3(p[0]+v[0]),r3(p[1]+v[1])], sub=(q,p)=>[r3(q[0]-p[0]),r3(q[1]-p[1])];
const trans=(pts,v)=>pts.map(p=>add(p,v));
/* étiquette décalée vers l'extérieur d'une figure */
const offOut=(p,pts,d=15)=>{ const c=[pts.reduce((a,q)=>a+q[0],0)/pts.length, pts.reduce((a,q)=>a+q[1],0)/pts.length]; let u=[p[0]-c[0],p[1]-c[1]]; const n=Math.hypot(...u)||1; return [u[0]/n*d, u[1]/n*d]; };
const lab=(names,pts,prime="",col)=>names.map((n,i)=>{ const [dx,dy]=offOut(pts[i],pts); return [n+prime,pts[i][0],pts[i][1],dx,dy,col]; });

/* ------------------------------------------------------------------
   La figure « A … L » (Exercice 4 et Activité rapide) : quadrillage, y vers le bas
------------------------------------------------------------------ */
const LP={A:[4,1],B:[9,1],C:[14,1],D:[19,1],E:[2,3],F:[7,3],G:[12,3],H:[17,3],I:[0,5],J:[5,5],K:[10,5],L:[15,5]};
const LSEG=["AD","EH","IL","IA","JB","KC","LD","AK","BL","CH","EJ"];
const LTRI=["AEF","ABF","BFG","BCG","CGH","CDH","EIJ","EFJ","FJK","FGK","GKL","GHL"];
const LQUAD=["ABFE","BCGF","CDHG","EFJI","FGKJ","GHLK"];
function latSVG(P,SEG,o={}){ const lines=SEG.map(s=>[P[s[0]],P[s[1]],"ln"]);
  const xs=Object.values(P).map(p=>p[0]), ys=Object.values(P).map(p=>p[1]);
  return G({k:o.k||26, grid:[Math.min(...xs),Math.min(...ys)-1,Math.max(...xs)+1,Math.max(...ys)+1], lines, polys:o.polys||[], pts:Object.entries(P).map(([n,[x,y]])=>[n,x,y,0,y===Math.min(...ys)?-14:y===Math.max(...ys)?22:-12]), w:o.w||560, alt:o.alt||"Figure formée de triangles et de parallélogrammes"}); }
const nameAt=(P,x,y)=>Object.keys(P).find(n=>Math.abs(P[n][0]-x)<1e-9&&Math.abs(P[n][1]-y)<1e-9);
const imgFig=(P,fg,v)=>{ const r=fg.split("").map(n=>nameAt(P,P[n][0]+v[0],P[n][1]+v[1])); return r.every(Boolean)?r.join(""):null; };
const vOf=(P,p,q)=>[P[q][0]-P[p][0],P[q][1]-P[p][1]];
/* même figure (mêmes sommets, ordre quelconque) */
const sameSet=(a,b)=>a.length===b.length&&[...a].sort().join("")===[...b].sort().join("");
/* une ligne de tableau : translation (p → q), figure initiale, image */
function latRows(P,FIGS,n){
  const names=Object.keys(P), out=[], seen=new Set();
  for(let g=0;g<4000&&out.length<n;g++){
    const fg=pick(FIGS), p=pick(names), q=pick(names); if(p===q) continue;
    const im=imgFig(P,fg,vOf(P,p,q)); if(!im||!FIGS.some(F2=>sameSet(F2,im))) continue;
    if(seen.has(fg)||seen.has(im)) continue; seen.add(fg); seen.add(im);
    out.push({p,q,fg,im,type:out.length%4});
  }
  return out;
}

/* ------------------------------------------------------------------
   L'hexagone ABCDEF de centre O (Exercice 5)
------------------------------------------------------------------ */
const HX=(()=>{ const P={O:[0,0]}; "ABCDEF".split("").forEach((n,i)=>{ const t=(90-60*i)*Math.PI/180; P[n]=[r3(Math.cos(t)),r3(Math.sin(t))]; }); return P; })();
const HTRI=["OAB","OBC","OCD","ODE","OEF","OFA"];
const hxName=(x,y)=>Object.keys(HX).find(n=>Math.abs(HX[n][0]-x)<0.01&&Math.abs(HX[n][1]-y)<0.01);
/* image d'un triangle (écrit dans l'ordre de l'énoncé) par la translation p → q */
const hxImg=(tri,p,q)=>{ const v=[HX[q][0]-HX[p][0],HX[q][1]-HX[p][1]]; const r=tri.split("").map(n=>hxName(HX[n][0]+v[0],HX[n][1]+v[1])); return r.every(Boolean)?r.join(""):null; };
const hxIsTri=t=>HTRI.some(T=>sameSet(T,t));
function hxQuestion(){
  for(let g=0;g<2000;g++){
    const T=pick(HTRI).split(""), t=shuf(T).join(""), p=pick(Object.keys(HX)), q=pick(Object.keys(HX)); if(p===q) continue;
    const im=hxImg(t,p,q); if(!im||!hxIsTri(im)||sameSet(im,t)) continue;
    return {t,p,q,im};
  }
  return {t:"AFO",p:"F",q:"O",im:"BOC"};
}

/* ------------------------------------------------------------------
   Données des figures de M. Staal
------------------------------------------------------------------ */
/* cours, exercice 1 : la même figure, deux translations */
const OIE=[[3,2],[5,2],[5,1],[6,1],[7,2],[6,2],[6,3],[3,3]], PATTES=[[[4,3],[4,4]],[[5,3],[5,4]]];
function oie(v, D, H, grid, img, arrow){ const sh=p=>add(p,v);
  const o={k:30, grid, polys:[[OIE,"ln"]], lines:PATTES.map(([a,b])=>[a,b,"ln"]), pts:[["D",...D,-12,-10],["H",...H,12,-10]], vecs:arrow?[[D,H]]:[], txt:[["F",4.6,2.55,"font-style:italic;font-family:serif"]], w:280, alt:"La figure F et les points D et H"};
  if(img){ o.polys.push([OIE.map(sh),"li"]); PATTES.forEach(([a,b])=>o.lines.push([sh(a),sh(b),"li"])); o.txt.push(["F’",4.6+v[0],2.55+v[1],"font-style:italic;font-family:serif;fill:var(--c)"]); o.lines.push([D,H,"cons"]); o.alt="La figure F et son image F’"; }
  return G(o);
}
/* cours, exercice 2 (feuille blanche) : triangle AEB, translation qui transforme C en D */
const sc=(P,s)=>Object.fromEntries(Object.entries(P).map(([n,[x,y]])=>[n,[r3(x/s),r3(y/s)]]));
const CEX2=sc({C:[134,103],D:[393,142],A:[111,149],E:[189,306],B:[34,355]},40);
function blank(P, tri, from, to, o={}){
  const pts=tri.split("").map(n=>P[n]), v=sub(P[to],P[from]);
  /* box : la place de l'image est toujours réservée (l'élève construit l'image sur la figure) */
  const g={k:o.k||40, pad:28, box:trans(pts,v), polys:[[pts,"orig"]], pts:[...lab(tri.split(""),pts), ...[from,to].filter(n=>!tri.includes(n)).map(n=>[n,...P[n],10,-10])], w:o.w||360, alt:o.alt||"Figure sur feuille blanche"};
  if(o.vec) g.vecs=[[P[from],P[to]]];
  if(o.sol){ const im=trans(pts,v); g.polys.push([im,"img"]); g.pts.push(...lab(tri.split(""),im,"’",C_C).filter(q=>!Object.values(P).some(r=>Math.hypot(r[0]-q[1],r[1]-q[2])<0.05))); pts.forEach((p,i)=>g.lines=(g.lines||[]).concat([[p,im[i],"cons"]])); g.lines.push([P[from],P[to],"cons"]); g.alt=o.altS||"La figure et son image par la translation"; }
  return G(g);
}
/* exercice 1 : frises */
const E1A={motif:[[1,1],[2,1],[2,2],[3,2],[3,3],[1,3]], G:[1,4], H:[4,4], grid:[0,0,18,5]};
const E1B={motif:[[1,2],[3,2],[3,4]], L:[2,1], M:[4,1], grid:[0,0,17,5]};
const E1C={motif:sc({a:[30,22],b:[83,75],c:[30,128]},40), v0:[30/40,180/40], v1:[185/40,180/40]};
const E1D={motif:sc({a:[23,25],b:[75,129],c:[127,77]},40), W:[178/40,232/40], Z:[281/40,232/40]};
function frise(o, n, sol){ const v=o.v; const g={k:o.k, grid:o.grid, polys:[[o.motif,o.open?"ln":"orig",o.open]], pts:o.pts||[], vecs:o.vecs||[], w:o.w||560, alt:o.alt, box:o.box};
  if(sol) for(let i=1;i<=n;i++) g.polys.push([trans(o.motif,[v[0]*i,v[1]*i]),o.open?"li":"img",o.open]);
  return G(g); }
const fr1a=sol=>frise({k:28, grid:E1A.grid, motif:E1A.motif, v:sub(E1A.H,E1A.G), pts:[["G",...E1A.G,0,-12],["H",...E1A.H,0,-12]], vecs:[[E1A.G,E1A.H]], alt:"Frise a : motif en L, de G vers H"},3,sol);
const fr1b=sol=>frise({k:30, grid:E1B.grid, motif:E1B.motif, v:sub(E1B.M,E1B.L), pts:[["L",...E1B.L,0,-12],["M",...E1B.M,0,-12]], alt:"Frise b : motif triangle, de L vers M"},3,sol);
const fr1c=sol=>frise({k:40, motif:Object.values(E1C.motif), open:true, v:sub(E1C.v1,E1C.v0), vecs:[[E1C.v0,E1C.v1]], box:[[0.5,0.3],[15,4.8]], alt:"Frise c : motif en chevron et flèche"},3,sol);
const fr1d=sol=>frise({k:40, motif:Object.values(E1D.motif), open:true, v:sub(E1D.Z,E1D.W), pts:[["W",...E1D.W,0,-12],["Z",...E1D.Z,0,-12]], box:[[0.4,0.4],[11.2,6]], alt:"Frise d : motif en V, de W vers Z"},3,sol);

/* exercice 3 : les parallélogrammes */
const PA={A:[5,3],B:[8,3],C:[9,2],D:[6,2]};
const PAR=[[[5,3],[8,3],[9,2],[6,2]],[[6,2],[9,2],[10,1],[7,1]],[[9,2],[10,3],[10,6],[9,5]],[[1,4],[4,4],[5,3],[2,3]],[[5,3],[6,4],[6,7],[5,6]]];
const parSVG=()=>G({k:34, grid:[0,0,11,7], polys:PAR.map((p,i)=>[p,"",false,i===2||i===4?"#c2185b":"#4c8a2b"]), pts:[["A",5,3,-14,-12],["B",8,3,6,18],["C",9,2,14,-8],["D",6,2,-12,-12]], txt:PAR.map((p,i)=>[String(i+1),p.reduce((a,q)=>a+q[0],0)/4,p.reduce((a,q)=>a+q[1],0)/4,"fill:#d0342c"]), w:380, alt:"Cinq parallélogrammes numérotés de 1 à 5"});

/* exercices 6 et 7 : pavages dans un rectangle */
function pavage(base, u, w, rect, n){ const out=[]; const [r0,r1]=rect;
  for(let a=-n;a<=n;a++) for(let b=-n;b<=n;b++){ const v=[a*u[0]+b*w[0], a*u[1]+b*w[1]], t=trans(base,v);
    if(t.every(p=>p[0]>=r0[0]-1e-9&&p[0]<=r1[0]+1e-9&&p[1]>=r0[1]-1e-9&&p[1]<=r1[1]+1e-9)) out.push({t,first:!a&&!b}); }
  return out; }
const E6={F:[0,2],G:[1,1],E:[0,4],D:[2,6],A:[3,4],B:[5,4],C:[5,6],rect:[[3,0],[9,10]]};
const E7={M:[0,0],N:[2,0],K:[0,2],L:[2,5],H:[3,2],I:[5,0],J:[5,3],rect:[[3,0],[11,9]]};
function pav6(sol){ const base=[E6.A,E6.B,E6.C], T=sol?pavage(base,sub(E6.D,E6.E),sub(E6.G,E6.F),E6.rect,8):[{t:base,first:true}];
  return G({k:30, grid:[0,0,9,10], rect:[E6.rect], polys:T.map(x=>[x.t,x.first?"orig":"img"]), vecs:[[E6.F,E6.G],[E6.E,E6.D]], pts:[["F",...E6.F,-12,-8],["G",...E6.G,10,-10],["E",...E6.E,8,-12],["D",...E6.D,10,-8],["A",...E6.A,-12,-10],["B",...E6.B,8,-12],["C",...E6.C,12,8]], w:330, alt:sol?"Le pavage construit dans le rectangle":"Le triangle ABC, les vecteurs et le rectangle"}); }
function pav7(sol){ const base=[E7.H,E7.I,E7.J], T=sol?pavage(base,sub(E7.L,E7.K),sub(E7.N,E7.M),E7.rect,8):[{t:base,first:true}];
  return G({k:30, rect:[E7.rect], box:[[0,0],[11,9]], polys:T.map(x=>[x.t,x.first?"orig":"img"]), vecs:[[E7.M,E7.N],[E7.K,E7.L]], pts:[["M",...E7.M,4,-12],["N",...E7.N,4,-12],["K",...E7.K,8,-10],["L",...E7.L,10,-8],["H",...E7.H,10,-8],["I",...E7.I,8,-12],["J",...E7.J,10,14]], w:360, alt:sol?"Le pavage construit dans le rectangle":"Le triangle HIJ, les vecteurs et le rectangle"}); }

/* feuille blanche : activité démonstration, exercice 8 */
const ADEM=sc({D:[408,43],E:[197,127],A:[463,129],B:[359,328],C:[557,391]},45);
const E81=sc({A:[68,93],B:[308,32],P:[140,165],I:[67,337],C:[248,377]},40);
const E82=sc({A:[77,338],B:[160,467],C:[405,485],D:[315,121],E:[611,536],F:[282,600]},55);
const E83=sc({A:[160,134],B:[62,323],C:[250,382],D:[470,61]},45);

/* exercices en + : drapeau et avion sur quadrillage */
const FLAG={pole:[[5,7],[5,3]], tri:[[5,3],[7,4],[5,5]], A:[5,7], B:[10,7], C:[1,4]};
function flagSVG(sol){ const o={k:30, grid:[0,0,13,8], polys:[[FLAG.tri,"orig"]], lines:[[...FLAG.pole,"ln"]], pts:[["A",...FLAG.A,8,-12],["B",...FLAG.B,8,-12],["C",...FLAG.C,8,-12]], txt:[["1",5.6,4.05]], w:400, alt:"Le drapeau 1 et les points A, B et C"};
  if(sol) [["B","2"],["C","3"]].forEach(([q,n])=>{ const v=sub(FLAG[q],FLAG.A); o.polys.push([trans(FLAG.tri,v),"img"]); o.lines.push([add(FLAG.pole[0],v),add(FLAG.pole[1],v),"li"]); o.txt.push([n,5.6+v[0],4.05+v[1],"fill:var(--c)"]); });
  return G(o); }
const PLANE={body:[[4,2],[5,3],[8,3],[9,4],[4,4]], wing:[[6,4],[5,5],[7,4]], S:[3,1], Q:[8,1], R:[14,3], T:[2,5]};
function planeSVG(sol){ const o={k:28, grid:[0,0,17,10], polys:[[PLANE.body,"orig"],[PLANE.wing,"orig"]], pts:[["S",...PLANE.S,8,-12],["Q",...PLANE.Q,8,-12],["R",...PLANE.R,8,-12],["T",...PLANE.T,8,-12]], txt:[["1",6.5,3.55]], w:470, alt:"L'avion 1 et les points Q, R, S et T"};
  if(sol) [["Q","R","2"],["S","T","3"]].forEach(([p,q,n])=>{ const v=sub(PLANE[q],PLANE[p]); o.polys.push([trans(PLANE.body,v),"img"],[trans(PLANE.wing,v),"img"]); o.txt.push([n,6.5+v[0],3.55+v[1],"fill:var(--c)"]); });
  return G(o); }

/* activité téléphérique */
const TEL={A:[0,0],D:[-1,1],E:[1,1],F:[-1,2],G:[1,2], A2:[6,1], A1:[-4.9,-3.75]};
const TELP=[TEL.A,TEL.E,TEL.G,TEL.F,TEL.D];
function telSVG(sol){ const o={k:34, grid:[-1,-1,12,4], lines:[[[-7.4,-5.66],TEL.A,"ln"],[TEL.A,[12,2],"ln"]], polys:[[TELP,"orig"]], pts:[["A",0,0,6,-14],["D",-1,1,-12,-8],["E",1,1,12,-8],["F",-1,2,-12,10],["G",1,2,12,10],["A’",...TEL.A1,0,-14],["A’’",...TEL.A2,0,-14]], w:560, alt:"Le téléphérique AEGFD sur son câble"};
  if(sol){ [[TEL.A2,"’’"],[TEL.A1,"’"]].forEach(([q,pr])=>{ const v=sub(q,TEL.A), im=trans(TELP,v); o.polys.push([im,"img"]); ["E","G","F","D"].forEach((n,i)=>o.pts.push([n+pr,...im[i+1],n==="D"||n==="F"?-16:16,n==="F"||n==="G"?12:-8,C_C])); }); o.lines.push([TEL.A,TEL.A2,"cons"],[TEL.A,TEL.A1,"cons"]); o.alt="Le téléphérique en A’ et en A’’"; }
  return G(o); }

/* TP Scratch : la frise du script de M. Staal (pixels Scratch, y vers le haut) */
function scratchFrise(){ const cols=["#9ccc1c","#18b45a","#1e5aa8","#8a2be2","#d0342c"]; let s="";
  for(let i=0;i<5;i++){ const x0=-220+90*i, P=[[x0,0],[x0,60],[x0+60,60],[x0+60,0],[x0+30,0],[x0+30,30],[x0+60,30],[x0+60,0]];
    s+=`<polyline points="${P.map(([x,y])=>(x+235)+","+(75-y)).join(" ")}" style="fill:none;stroke:${cols[i]};stroke-width:4;stroke-linejoin:miter"/>`; }
  return `<svg class="fig" viewBox="0 0 460 90" width="460" role="img" aria-label="La frise de 5 motifs dessinée par le script">${s}</svg>`; }
function scratchMotif(){ return `<svg class="fig" viewBox="0 0 200 170" width="200" role="img" aria-label="Le motif : un carré de 60 pixels avec un petit carré de 30 pixels">
  <polyline points="60,150 60,30 180,30 180,150 120,150 120,90 180,90 180,150" style="fill:none;stroke:var(--ink);stroke-width:3"/>
  <text x="120" y="20" text-anchor="middle" style="font-size:14px;fill:var(--ink)">60 pixels</text><text x="40" y="95" text-anchor="middle" style="font-size:14px;fill:var(--ink)">60</text><text x="150" y="166" text-anchor="middle" style="font-size:14px;fill:var(--ink)">30 pixels</text></svg>`; }

/* outils pour la fiche d'entraînement */
window.T42={G, add, sub, trans, lab, F, vec, ang, latSVG, LP, LSEG, LTRI, LQUAD, latRows, imgFig, vOf, HX, HTRI, hxQuestion, pavage, blank, C_C};

/* ===================== schémas ===================== */
const S_TR=sch("La translation", `${co("exemple","F’ est l’image de F par la translation qui transforme A en B",240)}<p class="schN">On fait <b>glisser</b> la figure selon la flèche de A vers B : même direction, même sens, même longueur. Ici : 5 carreaux vers la droite et 2 vers le bas.</p>`);
const S_FP=sch("Frise et pavage", `<p class="schN">Une <b>frise</b> : un motif de base qui se répète par <b>une</b> translation.</p><p class="schN">Un <b>pavage</b> : un motif de base qui se répète par <b>deux</b> translations.</p>`);
const S_QD=sch("Construire sur quadrillage", `${oie([1,3],[1,1],[2,4],[0,0,9,8],true)}<p class="schN">De D à H : 1 carreau vers la droite et 3 vers le bas. Chaque sommet de F glisse de la même façon.</p>`);
const S_CONS=sch("Ce que conserve une translation", `<p class="schN">Une translation conserve les <b>longueurs</b>, l'<b>alignement</b>, les <b>mesures d'angles</b> et les <b>aires</b>.</p><p class="schN">L'image d'un triangle est un triangle de mêmes dimensions : il a seulement glissé.</p>`);
const S_LAT=sch("Lire une translation sur une figure", latSVG(LP,LSEG,{k:18,w:380})+`<p class="schN">Pour trouver l'image d'une figure, on fait glisser <b>chaque sommet</b> de la même façon que le point de départ glisse vers le point d'arrivée.</p>`);

/* ---------- générateurs du QCM ---------- */
function qLat(kind){
  for(let g=0;g<200;g++){ const [r]=latRows(LP,[...LTRI,...LQUAD],1); if(!r) continue;
    const others=shuf([...LTRI,...LQUAD].filter(t=>t.length===r.im.length&&!sameSet(t,r.im)&&!sameSet(t,r.fg)));
    const formul=Math.random()<0.5?`la translation qui transforme ${r.p} en ${r.q}`:`la translation de vecteur ${vec(r.p+r.q)}`;
    if(kind===1) return {q:`Sur la figure, quelle est l'image de ${r.fg} par ${formul} ?`, fig:latSVG(LP,LSEG,{k:22,w:470}), c:uniq(r.im,[others[0],others[1],r.fg]), rep:r.im, ex:`On fait glisser chaque sommet comme ${r.p} glisse vers ${r.q} : ${r.fg.split("").map((n,i)=>`${n} → ${r.im[i]}`).join(" ; ")}.`, sx:S_LAT};
    if(r.fg.includes(r.p)||r.im.includes(r.p)) continue;
    return {q:`Sur la figure, ${r.im} est l'image de ${r.fg} par la translation qui transforme ${r.p} en … ?`, fig:latSVG(LP,LSEG,{k:22,w:470}), c:uniq(r.q,shuf(Object.keys(LP).filter(n=>n!==r.q&&n!==r.p)).slice(0,3)), rep:r.q, ex:`${r.fg[0]} a pour image ${r.im[0]} : il faut glisser de la même façon depuis ${r.p}. On arrive en ${r.q}.`, sx:S_LAT};
  }
  return {q:"Sur la figure, quelle est l'image de ABF par la translation qui transforme F en G ?", fig:latSVG(LP,LSEG,{k:22,w:470}), c:["BCG","CDH","AEF"], rep:"BCG", ex:"A → B ; B → C ; F → G.", sx:S_LAT};
}
function qGrid(rev,simple){
  for(let g=0;g<800;g++){ const v=simple?(Math.random()<0.5?[pick([-5,-4,-3,-2,2,3,4,5]),0]:[0,pick([-4,-3,-2,2,3,4])]):[ri(-4,4),ri(-3,3)]; if(!v[0]&&!v[1]||Math.abs(v[0])===Math.abs(v[1])) continue;
    const A=[ri(0,10),ri(0,7)], B=add(A,v), M=[ri(0,10),ri(0,7)], good=rev?sub(M,v):add(M,v), bad1=rev?add(M,v):sub(M,v), bad2=add(M,[v[1],v[0]]), bad3=add(M,[-v[1],-v[0]]);
    const all=[A,B,M,good,bad1,bad2,bad3]; if(all.some(p=>p[0]<0||p[0]>10||p[1]<0||p[1]>7)) continue;
    const keys=all.map(p=>p.join(",")); if(new Set(keys).size!==keys.length) continue;
    const bad=pick([bad1,bad2,bad3]); const L=shuf(["P","Q","R"]), cands=shuf([good,bad,pick([bad1,bad2,bad3].filter(b=>b!==bad))]);
    const nm=cands.map((p,i)=>[L[i],p]), rep=nm.find(x=>x[1]===good)[0];
    const svg=G({k:28, grid:[0,0,10,7], vecs:[[A,B]], pts:[["A",...A,-10,-10],["B",...B,10,-10],["M",...M,-10,-10],...nm.map(([n,p])=>[n,...p,10,-10,C_C])], w:330, alt:"Quadrillage avec A, B, M et trois points P, Q, R"});
    const dir=(v[0]?`${Math.abs(v[0])} carreau${Math.abs(v[0])>1?"x":""} vers la ${v[0]>0?"droite":"gauche"}`:"")+(v[0]&&v[1]?" et ":"")+(v[1]?`${Math.abs(v[1])} carreau${Math.abs(v[1])>1?"x":""} vers le ${v[1]>0?"bas":"haut"}`:"");
    return rev ? {q:"Quel point a pour image M par la translation qui transforme A en B ?", fig:svg, c:["P","Q","R"], rep, ex:`De A à B : ${dir}. Le point cherché glisse de cette façon et arrive en M : on fait le chemin inverse depuis M et on trouve ${rep}.`, sx:S_QD}
      : {q:"Quel point est l'image de M par la translation qui transforme A en B ?", fig:svg, c:["P","Q","R"], rep, ex:`De A à B : ${dir}. On fait la même chose depuis M : on arrive en ${rep}.`, sx:S_QD};
  }
}
const CONS=[["longueurs","Vrai"],["aires","Vrai"],["mesures d'angles","Vrai"],["l'alignement","Vrai"],["positions des figures","Faux"]];

CH["4e-2"] = {
intro:"Faire glisser une figure selon une flèche : reconnaître une translation dans une frise ou un pavage, construire l'image d'une figure sur quadrillage et sur feuille blanche, et utiliser ce que la translation conserve.",
savoir:[
  "comprendre ce qu'est une translation (direction, sens, longueur) ;",
  "sur une frise ou un pavage, repérer le motif de base et les translations qui le reproduisent ;",
  "sur quadrillage, tracer l'image d'une figure par translation ;",
  "sur feuille blanche, tracer l'image d'une figure par translation ;",
  "utiliser les propriétés de conservation d'une translation."
],

/* ===================== COURS ===================== */
cours:[
{k:"1", t:"Translation", h:`
  <div class="retenir" data-l="Définition"><p>Transformer une figure par <b>translation</b>, c'est la faire <b>glisser</b> selon une flèche, nommée <b>vecteur</b>, qui indique une <b>direction</b>, un <b>sens</b> et une <b>longueur</b>.</p></div>
  <p><b>Exemple :</b></p>
  ${co("exemple","La figure F et son image F’ : elle a glissé de A vers B",380)}
  <div class="retenir" data-l="Vocabulaire"><p>Il existe deux formulations possibles :</p><ul><li>La figure F’ est l'image de la figure F par <b>la translation qui transforme A en B</b>.</li><li>La figure F’ est l'image de la figure F par <b>la translation de vecteur ${vec("AB")}</b>.</li></ul></div>
  <p><b>Comment tracer le point M’, image du point M par cette translation ?</b></p>
  <p>À partir de M, on fait le même déplacement que de A vers B : même direction, même sens et même longueur.</p>
  <p>Ici, de A à B, on avance de 5 carreaux vers la droite et de 2 carreaux vers le bas. On fait pareil à partir de M : on obtient M’.</p>`},
{k:"2", t:"Frises et pavages", h:`
  <div class="retenir" data-l="Définition"><p>Une <b>frise</b> est une bande rectangulaire sur laquelle un <b>motif de base</b> se répète par translation.</p></div>
  ${co("frise","Une frise sculptée : une fleur qui se répète",430)}
  <div class="retenir" data-l="Définition"><p>Un <b>pavage</b> est une portion du plan sur laquelle un <b>motif de base</b> se répète par <b>deux</b> translations.</p></div>
  ${co("pavage","Un pavage de triangles gris",340)}
  <p><b>À toi de jouer :</b></p><p><b>a)</b> Sur la frise et le pavage, entoure le motif de base.</p><p><b>b)</b> Indique, par des flèches, les translations qui permettent de construire cette frise et ce pavage.</p>
  <details><summary>Voir la correction</summary><div class="corr"><p><b>Frise :</b> le motif de base est une fleur avec ses feuilles. Une seule flèche horizontale suffit : elle va du centre d'une fleur au centre de la fleur suivante.</p><p><b>Pavage :</b> le motif de base est une « étoile » de triangles. Il faut deux flèches : une horizontale (vers le motif voisin de droite) et une oblique (vers le motif voisin de la ligne du dessous).</p></div></details>`},
{k:"3", t:"Construire l'image d'une figure par translation", h:`
  <h4>Sur quadrillage</h4>
  <p><b>Exercice 1 :</b> dans les deux cas suivants, trace la figure F’, image de la figure F par la translation qui transforme D en H.</p>
  <div class="figs">${fig("Cas n°1",oie([1,3],[1,1],[2,4],[0,0,9,8],false,true))}${fig("Cas n°2",oie([-3,4],[4,3],[1,7],[0,0,8,8]))}</div>
  <div class="retenir" data-l="Méthode"><p><b>Sur quadrillage :</b> je compte les carreaux pour aller de D à H. Puis je fais le même déplacement à partir de chaque sommet de la figure.</p></div>
  <div class="anim" data-anim="4e2-translation-quadrillage"></div>
  <details><summary>Voir la correction</summary><div class="corr"><p><b>Cas n°1 :</b> de D à H, 1 carreau vers la droite et 3 carreaux vers le bas.</p><p><b>Cas n°2 :</b> de D à H, 3 carreaux vers la gauche et 4 carreaux vers le bas.</p><div class="figs">${fig("Cas n°1",oie([1,3],[1,1],[2,4],[0,0,9,8],true,true))}${fig("Cas n°2",oie([-3,4],[4,3],[1,7],[0,0,8,8],true))}</div></div></details>
  <h4>Sur feuille blanche</h4>
  <p><b>Exercice 2 :</b> trace l'image du triangle AEB par la translation de vecteur ${vec("CD")} (la translation qui transforme C en D). On la notera A’E’B’.</p>
  ${blank(CEX2,"AEB","C","D",{w:340})}
  <div class="retenir" data-l="Méthode"><p><b>Sur feuille blanche</b>, pour placer A’, l'image de A :</p><ul><li>je trace un arc de cercle de centre A et de rayon CD ;</li><li>je trace un arc de cercle de centre D et de rayon CA ;</li><li>A’ est le point d'intersection de ces deux arcs, du même côté que D : CDA’A est un parallélogramme.</li></ul><p>Je recommence pour E’ et B’, puis je relie A’, E’ et B’.</p></div>
  <div class="anim" data-anim="4e2-translation-compas"></div>
  <details><summary>Voir la correction</summary><div class="corr">${blank(CEX2,"AEB","C","D",{w:340,sol:true,altS:"Le triangle AEB et son image A’E’B’"})}<p>Les segments [AA’], [EE’] et [BB’] ont la même direction, le même sens et la même longueur que [CD].</p></div></details>`},
{k:"4", t:"Propriétés de conservation", h:`
  <div class="retenir" data-l="Propriétés"><p>Une translation conserve :</p><ul><li>les longueurs,</li><li>l'alignement,</li><li>les mesures d'angles,</li><li>les aires.</li></ul></div>
  ${co("conserv","Un pavage : le motif ABCD se répète par translation, sans changer de forme ni de taille",480)}
  <p>Tous les motifs de ce pavage sont les images du motif ABCD par des translations : ils ont tous les mêmes longueurs, les mêmes angles et la même aire.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Frises", e:[
  {n:"Activité 1", t:"Frises", w:"Sur ta feuille", h:`<p>Une <b>frise</b> est une bande rectangulaire illimitée sur laquelle des <b>motifs</b> apparaissent de façon répétée.</p><p>Voici 3 morceaux de frises. À toi de reconnaître un motif répété.</p>
   <div class="figs">${fig("Frise ①",ex("a1f1","Frise de flèches orange",380))}</div>
   <div class="figs">${fig("Frise ② : frise d'une église romane de Saintonge (Charente-Maritime)",ex("a1f2","Frise sculptée de feuilles",330))}${fig("L'église",ex("a1eglise","Le portail de l'église",230))}</div>
   <div class="figs">${fig("Frise ③",ex("a1f3","Frise de gouttes bleues",380))}</div>`,
   c:`<p><b>Frise ① :</b> le motif répété est <b>une flèche orange</b> (un chevron). On passe d'une flèche à la suivante en la faisant glisser vers la droite.</p>
   <p><b>Frise ② :</b> le motif répété est <b>une feuille en forme de cœur</b>, avec ses deux volutes au-dessus.</p>
   <p><b>Frise ③ :</b> le motif répété est formé de <b>deux gouttes en bas et de deux gouttes en haut</b>.</p>
   <p>Dans chaque frise, le motif glisse toujours de la même façon : c'est une translation.</p>`},
  {n:"Exercice 1", t:"Reproduire des frises", w:"Sur ta feuille", h:`<p>Dans chaque cas, le motif de base de la frise est représenté.</p><p>Continue la frise en reproduisant 3 motifs de base :</p>
   <p><b>a)</b> par la translation qui transforme G en H.</p>${fr1a()}
   <p><b>b)</b> par la translation qui transforme L en M.</p>${fr1b()}
   <p><b>c)</b> par la translation représentée par la flèche.</p>${fr1c()}
   <p><b>d)</b> par la translation qui transforme W en Z.</p>${fr1d()}`,
   c:`<p><b>a)</b> De G à H : 3 carreaux vers la droite.</p>${fr1a(true)}
   <p><b>b)</b> De L à M : 2 carreaux vers la droite.</p>${fr1b(true)}
   <p><b>c)</b> On reporte la longueur de la flèche (au compas ou à la règle), toujours vers la droite.</p>${fr1c(true)}
   <p><b>d)</b> On reporte la longueur WZ, vers la droite, à partir de chaque sommet du motif.</p>${fr1d(true)}`},
  {n:"Exercice 2", t:"Observations de frises", w:"Sur ta feuille", h:`<p><b>1)</b> Sur chaque frise, entoure le motif de base qui a été reproduit plusieurs fois par translation.</p><p><b>2)</b> Ensuite, explique comment le motif de base a été construit.</p>
   ${ex("e2f12","Frises 1 et 2",560)}${ex("e2f34","Frises 3 et 4",560)}`,
   c:`<p><b>1)</b> Dans chaque frise, le motif de base est la partie qui se répète, toujours décalée de la même longueur vers la droite :</p>
   <ul><li><b>Frise 1 :</b> le losange du milieu avec ses quatre triangles.</li><li><b>Frise 2 :</b> un chevron « Λ » avec ses deux pointes.</li><li><b>Frise 3 :</b> une « étoile » formée de deux grands triangles pointus.</li><li><b>Frise 4 :</b> le motif en forme de « Z » avec ses deux triangles.</li></ul>
   <p><b>2)</b> Chaque motif de base est lui-même construit avec des symétries :</p>
   <ul><li><b>Frise 1 :</b> le motif a deux axes de symétrie (un vertical et un horizontal).</li><li><b>Frise 2 :</b> le motif a un axe de symétrie vertical.</li><li><b>Frise 3 :</b> le motif a un axe de symétrie horizontal.</li><li><b>Frise 4 :</b> le motif a un centre de symétrie (symétrie centrale).</li></ul>`}
 ]},
{t:"Pavages", e:[
  {n:"Activité 2", t:"Pavages", w:"Sur ta feuille", h:`<p>Un <b>pavage</b> est une portion de plan sur laquelle des <b>motifs</b> apparaissent de façon répétée.</p><p><b>1)</b> À toi de reconnaître le motif de base de ces deux pavages.</p><p><b>2)</b> Ensuite, explique de quelle manière il a été reproduit. (Attention : ne pas tenir compte des couleurs !)</p>
   <div class="figs">${fig("Pavage ① : le motif pied-de-poule est un motif utilisé dans le textile",ex("a2pied","Pavage pied-de-poule",260))}${fig("",ex("a2manteau","Un manteau pied-de-poule",140))}${fig("Pavage ②",ex("a2hexa","Pavage de tomettes hexagonales",250))}</div>`,
   c:`<p><b>Pavage ① :</b> le motif de base est une « dent » noire du pied-de-poule.</p><p>Il est reproduit par <b>deux translations</b> : une translation horizontale (vers le motif voisin de droite) et une translation verticale (vers le motif voisin du dessous).</p>
   <p><b>Pavage ② :</b> le motif de base est <b>un hexagone</b> (une tomette).</p><p>Il est reproduit par <b>deux translations</b> : une verticale (vers la tomette du dessous) et une oblique (vers la tomette voisine de la colonne suivante).</p>`}
 ]},
{t:"Reconnaître une translation", e:[
  {n:"Exercice 3", t:"Reconnaître des transformations", w:"Sur ton cahier", h:`<p>Complète, si possible, les phrases suivantes par une transformation et ses caractéristiques.</p><p>Tu ne peux pas rajouter de points sur la figure.</p>${parSVG()}
   <p>La transformation qui permet de passer du parallélogramme 1 au parallélogramme :</p><p><b>a)</b> 2 est : ……………</p><p><b>b)</b> 3 est : ……………</p><p><b>c)</b> 4 est : ……………</p><p><b>d)</b> 5 est : ……………</p>`,
   c:`<p><b>a)</b> 2 : la <b>translation qui transforme A en D</b> (ou B en C).</p>
   <p><b>b)</b> 3 : la <b>rotation de centre C, d'angle 90°</b>, dans le sens inverse des aiguilles d'une montre.</p>
   <p><b>c)</b> 4 : la <b>translation qui transforme C en A</b>.</p>
   <p><b>d)</b> 5 : la <b>rotation de centre A, d'angle 90°</b>, dans le sens des aiguilles d'une montre.</p>`},
  {n:"Exercice 4", t:"Observation de frise", w:"Sur ton cahier", h:`<p>Observe la figure ci-dessous et complète le tableau.</p>${latSVG(LP,LSEG,{w:560})}
   <div class="scroll"><table class="std"><thead><tr><th></th><th>Translation</th><th>Figure initiale</th><th>Image obtenue</th></tr></thead><tbody>
   <tr><th>①</th><td>qui transforme G en H</td><td>BCG</td><td>……</td></tr><tr><th>②</th><td>qui transforme K en J</td><td>FBG</td><td>……</td></tr><tr><th>③</th><td>qui transforme H en K</td><td>……</td><td>EIJF</td></tr><tr><th>④</th><td>qui transforme I en ……</td><td>ABF</td><td>CDH</td></tr></tbody></table></div>`,
   c:`<p>① De G à H : 5 carreaux vers la droite. B → C ; C → D ; G → H : l'image est <b>CDH</b>.</p>
   <p>② De K à J : 5 carreaux vers la gauche. F → E ; B → A ; G → F : l'image est <b>EAF</b>.</p>
   <p>③ On cherche la figure qui a pour image EIJF. On fait le chemin inverse (de K vers H) : E vient de B, I vient de F, J vient de G et F vient de C. La figure initiale est <b>BFGC</b>.</p>
   <p>④ A a pour image C : 10 carreaux vers la droite. I glisse aussi de 10 carreaux vers la droite : la translation transforme I en <b>K</b>.</p>`},
  {n:"Exercice 5", t:"Dans un hexagone", w:"Sur ton cahier", h:`${ex("e5","Hexagone ABCDEF de centre O",220)}<p>L'hexagone ABCDEF est composé de six triangles équilatéraux.</p><p>Complète les phrases suivantes.</p>
   <p><b>a)</b> L'image du triangle FAO par la symétrie axiale d'axe (AO) est ……</p><p><b>b)</b> L'image du triangle FEO par la symétrie axiale d'axe (OB) est ……</p><p><b>c)</b> L'image du triangle ABO par la symétrie centrale de centre O est ……</p><p><b>d)</b> L'image du triangle AFO par la translation qui transforme F en O est ……</p><p><b>e)</b> L'image du triangle OED par la translation qui transforme O en A est ……</p><p><b>f)</b> L'image du triangle FEO par la translation qui transforme D en C est ……</p>`,
   c:`<p><b>a)</b> A et O sont sur l'axe, F a pour image B : <b>BAO</b>.</p>
   <p><b>b)</b> E et O sont sur l'axe (BE), F a pour image D : <b>DEO</b>.</p>
   <p><b>c)</b> A → D ; B → E ; O → O : <b>DEO</b>.</p>
   <p><b>d)</b> F glisse vers O, donc A glisse vers B et O glisse vers C : <b>BOC</b>.</p>
   <p><b>e)</b> O glisse vers A, donc E glisse vers F et D glisse vers O : <b>AFO</b>.</p>
   <p><b>f)</b> D glisse vers C, donc F glisse vers A, E glisse vers O et O glisse vers B : <b>AOB</b>.</p>`}
 ]},
{t:"Construire un pavage", e:[
  {n:"Exercice 6", t:"Un pavage sur quadrillage", w:"Sur ta feuille", h:`<p>À l'intérieur du rectangle noir, construis un pavage en transformant chaque triangle par les translations de vecteur ${vec("ED")} et de vecteur ${vec("FG")}.</p>${pav6()}`,
   c:`<p>De E à D : 2 carreaux vers la droite et 2 vers le bas. De F à G : 1 carreau vers la droite et 1 vers le haut.</p><p>On applique ces translations au triangle ABC, puis aux nouveaux triangles, tant qu'ils restent dans le rectangle.</p>${pav6(true)}`},
  {n:"Exercice 7", t:"Un pavage sur feuille blanche", w:"Sur ta feuille", h:`<p>À l'intérieur du rectangle noir, construis un pavage en transformant chaque triangle par les translations de vecteur ${vec("KL")} et de vecteur ${vec("MN")}.</p>${pav7()}`,
   c:`<p>On reporte les flèches ${vec("KL")} et ${vec("MN")} à partir de chaque sommet (au compas, avec des parallélogrammes).</p><p>On obtient 12 triangles dans le rectangle.</p>${pav7(true)}`}
 ]},
{t:"Construire l'image d'une figure", e:[
  {n:"Activité 3", t:"Le téléphérique", w:"Sur ta feuille", h:`<p>Le téléphérique de Renon, situé dans la région du Trentin-Haut-Adige en Italie, relie la ville de Bolzano au plateau de Renon sur une distance de 4 500 m.</p><p>Ci-dessous, on a représenté le téléphérique par le polygone AEGFD pendant sa descente.</p>
   <p><b>1)</b> Représente le téléphérique quand il sera au point A’’. On appellera ses points E’’, F’’, G’’ et D’’.</p><p><b>2)</b> Représente le téléphérique quand il était au point A’. On appellera ses points E’, F’, G’ et D’.</p>${telSVG()}`,
   c:`<p><b>1)</b> De A à A’’ : 6 carreaux vers la droite et 1 vers le bas. On fait glisser chaque sommet de la même façon.</p><p><b>2)</b> Pour A’, il n'y a pas de quadrillage : on reporte la flèche de A vers A’ à partir de chaque sommet (même direction, même sens, même longueur).</p>${telSVG(true)}<p>Le téléphérique ne tourne pas : il glisse le long du câble. C'est une translation.</p>`},
  {n:"Activité 4", t:"Démonstration", w:"Sur ta feuille", h:`<p><b>1)</b> Construis l'image du triangle ABC par la translation qui transforme D en E.</p>${blank(ADEM,"ABC","D","E",{w:340})}`,
   c:`${blank(ADEM,"ABC","D","E",{w:340,sol:true,altS:"Le triangle ABC et son image A’B’C’"})}<p>A’ est tel que DEA’A est un parallélogramme : arc de centre A et de rayon DE, arc de centre E et de rayon DA.</p><p>On fait de même pour B’ et C’.</p>`},
  {n:"Exercice 8", t:"Construire une image par translation", w:"Sur ta feuille", h:`<p><b>1)</b> Construis l'image du triangle PIC par la translation de vecteur ${vec("AB")}. Nomme-la P’I’C’.</p>${blank(E81,"PIC","A","B",{vec:true,w:330})}
   <p><b>2)</b> Construis l'image du quadrilatère ABCD par la translation qui transforme E en F. Nomme-la A’B’C’D’.</p>${blank(E82,"ABCD","E","F",{w:420})}
   <p><b>3)</b> Construis l'image du triangle ABC par la translation de vecteur ${vec("AD")}. Nomme-la A’B’C’.</p>${blank(E83,"ABC","A","D",{w:400})}`,
   c:`<p><b>1)</b> ABP’P, ABI’I et ABC’C sont des parallélogrammes.</p>${blank(E81,"PIC","A","B",{vec:true,w:330,sol:true,altS:"Le triangle PIC et son image P’I’C’"})}
   <p><b>2)</b> Chaque sommet glisse comme E glisse vers F (vers la gauche et un peu vers le bas).</p>${blank(E82,"ABCD","E","F",{w:420,sol:true,altS:"Le quadrilatère ABCD et son image A’B’C’D’"})}
   <p><b>3)</b> A a pour image D : le point A’ est confondu avec D. Puis ADB’B et ADC’C sont des parallélogrammes.</p>${blank(E83,"ABC","A","D",{w:400,sol:true,altS:"Le triangle ABC et son image A’B’C’"})}`},
  {n:"Exercice 9", t:"Le drapeau (exercice en +)", w:"Sur ta feuille", h:`<p><b>a)</b> Trace le drapeau 2, image du drapeau 1 par la translation qui transforme A en B.</p><p><b>b)</b> Trace le drapeau 3, image du drapeau 1 par la translation qui transforme A en C.</p>${flagSVG()}`,
   c:`<p><b>a)</b> De A à B : 5 carreaux vers la droite.</p><p><b>b)</b> De A à C : 4 carreaux vers la gauche et 3 vers le haut.</p>${flagSVG(true)}`},
  {n:"Exercice 10", t:"L'avion (exercice en +)", w:"Sur ta feuille", h:`<p><b>a)</b> Trace l'avion 2, image de l'avion 1 par la translation qui transforme Q en R.</p><p><b>b)</b> Trace l'avion 3, image de l'avion 1 par la translation qui transforme S en T.</p>${planeSVG()}`,
   c:`<p><b>a)</b> De Q à R : 6 carreaux vers la droite et 2 vers le bas.</p><p><b>b)</b> De S à T : 1 carreau vers la gauche et 4 vers le bas.</p>${planeSVG(true)}`}
 ]},
{t:"Démontrer avec une translation", e:[
  {n:"Exercice 11", t:"Démonstration", w:"Sur ton cahier", h:`<p>La frise ci-dessous a été construite à l'aide d'une même translation à partir du motif de base.</p><div class="figs">${fig("Motif de base",ex("e9motif","Le motif de base avec ses codages",120))}${fig("Frise",ex("e9frise","La frise et le quadrilatère ABCD",320))}</div><p>Détermine la nature du quadrilatère ABCD en justifiant rigoureusement.</p>`,
   c:`<p>Sur le motif de base, les quatre « bras » qui partent du centre sont codés de la même longueur.</p>
   <p>Les côtés [DA], [AB], [BC] et [CD] du quadrilatère sont des bras du motif de base ou de ses images par la translation.</p>
   <p>Or une translation conserve les longueurs. Donc DA = AB = BC = CD.</p>
   <p>Un quadrilatère qui a ses quatre côtés de la même longueur est un losange. Donc <b>ABCD est un losange</b>.</p>`}
 ]},
{t:"Sur l'ordinateur", e:[
  {n:"Activité 5", t:"Une frise avec Scratch (TP)", w:"Sur ton cahier", h:`<p>Écris un script qui permet de reproduire cette frise sur Scratch. Mets de la couleur quand la frise sera terminée.</p>${scratchFrise()}
   <p><b>Indications :</b></p><p>Ton script doit commencer ainsi, pour que le lutin se replace toujours au même endroit quand tu cliques sur le drapeau vert. Il ira aux coordonnées (−220 ; 0).</p>${ex("a5debut","Début du script : quand drapeau cliqué, effacer tout, aller à x : −220, y : 0",190)}<p>Le bloc « effacer tout » efface les tracés précédents.</p>
   <p>Voici les mesures pour tracer le premier motif.</p>${scratchMotif()}<p>Ce motif sera répété 5 fois par translation. Entre deux motifs, il y a une distance de 30 pixels.</p>`,
   c:`${cr("a5script","Script de la frise : répéter 5 fois le motif, puis avancer de 30 pixels et changer de couleur",250)}
   <p>Dans la boucle « répéter 5 fois » :</p><ul><li>« répéter 3 fois : avancer de 60, tourner de 90 degrés » trace trois côtés du grand carré de 60 pixels ;</li><li>« répéter 4 fois : avancer de 30, tourner de 90 degrés » trace le petit carré de 30 pixels ;</li><li>puis on relève le stylo et on avance de 30 pixels : c'est l'écart entre deux motifs ;</li><li>« ajouter 40 à la couleur du stylo » change la couleur de chaque motif.</li></ul>
   <p>Chaque motif est l'image du précédent par une translation de 60 + 30 = 90 pixels vers la droite.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"La translation", schema:S_TR, q:{
 1:[ {q:"Transformer une figure par translation, c'est la faire…", c:["glisser","tourner","se retourner comme dans un miroir"], rep:"glisser", ex:"Une translation fait glisser la figure selon une flèche.", sx:S_TR},
     {q:"La flèche d'une translation (le vecteur) indique…", c:["une direction, un sens et une longueur","seulement une longueur","un centre et un angle"], rep:"une direction, un sens et une longueur", sx:S_TR} ],
 2:[ {g:()=>qLat(1)} ],
 3:[ {g:()=>qLat(2)},
     {g:()=>{ const [p,q]=shuf("ABCDEFGHKLMN".split("")).slice(0,2); return {q:`« La translation qui transforme ${p} en ${q} » s'écrit aussi…`, c:[`la translation de vecteur ${vec(p+q)}`,`la translation de vecteur ${vec(q+p)}`,`la symétrie de centre ${p}`], rep:`la translation de vecteur ${vec(p+q)}`, ex:`La flèche part de ${p} et arrive en ${q} : c'est le vecteur ${vec(p+q)}.`, sx:S_TR}; }} ]
}},
{nom:"Frises et pavages", schema:S_FP, q:{
 1:[ {q:"Dans une frise, le motif de base se répète par…", c:["une translation","deux translations","une symétrie centrale"], rep:"une translation", sx:S_FP} ],
 2:[ {q:"Dans un pavage, le motif de base se répète par…", c:["deux translations","une seule translation","aucune translation"], rep:"deux translations", ex:"Un pavage remplit une portion du plan : il faut deux directions de glissement.", sx:S_FP},
     {q:"Une frise est…", c:["une bande rectangulaire","une portion du plan entière","un cercle"], rep:"une bande rectangulaire", ex:"Une frise est une bande rectangulaire sur laquelle un motif de base se répète par translation.", sx:S_FP} ],
 3:[ {g:()=>{ const d=ri(2,6), e=ri(1,4); return {q:`Dans une frise, le motif de base mesure ${d} cm de large. Entre deux motifs, il y a un espace de ${e} cm. De combien de centimètres glisse chaque motif par la translation ?`, rep:[String(d+e),(d+e)+" cm"], ex:`Le motif glisse de sa largeur plus l'espace : ${d} + ${e} = ${d+e} cm.`, sx:S_FP}; }} ]
}},
{nom:"Construire sur quadrillage", schema:S_QD, q:{
 1:[ {g:()=>qGrid(false,true)} ],
 2:[ {g:()=>qGrid()} ],
 3:[ {g:()=>qGrid(true)} ]
}},
{nom:"Reconnaître une translation", schema:sch("Dans l'hexagone", ex("e5","Hexagone ABCDEF de centre O",200)+`<p class="schN">Pour la translation qui transforme X en Y, chaque sommet glisse de la même façon que X vers Y.</p>`), q:{
 1:[ {q:"Le parallélogramme 2 est obtenu en faisant glisser le parallélogramme 1, sans le tourner. C'est…", c:["une translation","une rotation","une symétrie axiale"], rep:"une translation", ex:"Glisser sans tourner ni retourner : c'est une translation."} ],
 2:[ {g:()=>{ const h=hxQuestion(), others=shuf(HTRI.filter(T=>!sameSet(T,h.im)).map(T=>shuf(T.split("")).join(""))); return {q:`Dans l'hexagone ABCDEF de centre O, quelle est l'image du triangle ${h.t} par la translation qui transforme ${h.p} en ${h.q} ?`, fig:ex("e5","Hexagone ABCDEF de centre O",200), c:uniq(h.im,others.slice(0,2)), rep:h.im, ex:`${h.p} glisse vers ${h.q} ; alors ${h.t.split("").map((n,i)=>`${n} → ${h.im[i]}`).join(" ; ")}.`}; }} ],
 3:[ {g:()=>{ const h=hxQuestion(); const cand=Object.keys(HX).filter(n=>n!==h.p&&hxImg(h.t,h.p,n)===h.im); const bads=shuf(Object.keys(HX).filter(n=>!cand.includes(n)&&n!==h.p)).slice(0,2);
       return {q:`Dans l'hexagone ABCDEF de centre O, ${h.im} est l'image de ${h.t} par la translation qui transforme ${h.p} en … ?`, fig:ex("e5","Hexagone ABCDEF de centre O",200), c:uniq(h.q,bads), rep:h.q, ex:`${h.t[h.t[0]===h.p?1:0]} a pour image ${h.im[h.t[0]===h.p?1:0]} : ${h.p} glisse de la même façon et arrive en ${h.q}.`}; }} ]
}},
{nom:"Propriétés de conservation", schema:S_CONS, q:{
 1:[ {g:()=>{ const [w,r]=pick(CONS); return {q:`Vrai ou faux : une translation conserve ${w==="l'alignement"?"l'alignement":"les "+w}.`, c:VF, rep:r, ex:r==="Vrai"?"Une translation conserve les longueurs, l'alignement, les mesures d'angles et les aires.":"La figure a glissé : sa position change, mais pas sa forme ni sa taille.", sx:S_CONS}; }} ],
 2:[ {g:()=>{ const a=ri(21,89)/10; return {q:`[A’B’] est l'image du segment [AB] par une translation et AB = ${F(a)} cm. Combien mesure A’B’ (en cm) ?`, rep:[F(a),F(a)+" cm"], ex:`Une translation conserve les longueurs : A’B’ = AB = ${F(a)} cm.`, sx:S_CONS}; }},
     {g:()=>{ const a=ri(25,140); return {q:`A’B’C’ est l'image du triangle ABC par une translation et ${ang("ABC")} = ${a}°. Combien mesure ${ang("A’B’C’")} (en degrés) ?`, c:uniq(a+"°",[(180-a)+"°",(2*a>180?Math.round(a/2):2*a)+"°",(90-a>0?90-a:a+10)+"°"]), rep:a+"°", ex:`Une translation conserve les mesures d'angles : ${ang("A’B’C’")} = ${ang("ABC")} = ${a}°.`, sx:S_CONS}; }} ],
 3:[ {g:()=>{ const s=ri(12,60)/2; return {q:`Le triangle ABC a pour aire ${F(s)} cm². Quelle est l'aire de son image A’B’C’ par une translation (en cm²) ?`, rep:[F(s),F(s)+" cm²"], ex:`Une translation conserve les aires : ${F(s)} cm².`, sx:S_CONS}; }},
     {q:"A, B et C sont alignés. A’, B’ et C’ sont leurs images par une translation. Alors…", c:["A’, B’ et C’ sont alignés","A’, B’ et C’ ne sont jamais alignés","on ne peut pas savoir"], rep:"A’, B’ et C’ sont alignés", ex:"Une translation conserve l'alignement.", sx:S_CONS} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
  const P={M:[2,0],N:[6,0],P:[10,0],Q:[14,0],R:[0,3],S:[4,3],T:[8,3],U:[12,3]}, SEG=["MQ","RU","RM","SN","TP","UQ","MS","NT","PU"];
  const r1=imgFig(P,"RSM",vOf(P,"M","N")), r2=imgFig(P,"PQU",vOf(P,"T","R")), r3i=imgFig(P,"TUP",vOf(P,"T","R")), r4=nameAt(P,P.M[0]+P.P[0]-P.M[0],0);
  const LAT2=latSVG(P,SEG,{w:470,alt:"Figure formée de triangles, points M à U"});
  const HOUSE=[[1,3],[1,2],[2,1],[3,2],[3,3]], R0=[1,4], S0=[5,4];
  const fri=sol=>{ const o={k:28, grid:[0,0,16,5], polys:[[HOUSE,"orig"]], pts:[["R",...R0,0,-12],["S",...S0,0,-12]], vecs:[[R0,S0]], w:470, alt:"Frise : motif en forme de maison, de R vers S"}; if(sol) for(let i=1;i<=2;i++) o.polys.push([trans(HOUSE,[4*i,0]),"img"]); return G(o); };
  const ARROW=[[2,2],[4,2],[4,1],[6,3],[4,5],[4,4],[2,4]], E0=[8,1], F0=[11,3];
  const fle=sol=>{ const o={k:28, grid:[0,0,12,8], polys:[[ARROW,"orig"]], pts:[["E",...E0,-10,-10],["F",...F0,10,-10],["K",...ARROW[3],14,-8]], vecs:[[E0,F0]], w:360, alt:"Quadrillage : une flèche et les points E et F"}; if(sol){ o.polys.push([trans(ARROW,sub(F0,E0)),"img"]); o.pts.push(["K’",...add(ARROW[3],sub(F0,E0)),16,-8,C_C]); } return G(o); };
  const BL={R:[1,4],S:[4.2,5.6],T:[3,1.5],U:[6,1],V:[8.5,2.3]};
  return {
titre:"Évaluation d'entraînement · chapitre 2", duree:45, info:"Durée : 45 min · Calculatrice non autorisée · Règle, équerre, compas et crayon",
comp:[
  ["CONNAÎTRE","Je connais le vocabulaire de la translation et ce qu'elle conserve.","Ex. 1 et 6 (6 points)"],
  ["MODÉLISER","Je reconnais une translation sur une figure, une frise ou un pavage.","Ex. 2 et 3 (7 points)"],
  ["REPRÉSENTER","Je construis l'image d'une figure par translation, sur quadrillage et sur feuille blanche.","Ex. 4 et 5 (7 points)"]
],
exos:[
{t:"Vocabulaire", p:3, h:`<p>Complète la phrase.</p><p>Transformer une figure par translation, c'est la faire …………… selon une flèche, appelée …………… .</p><p>Cette flèche indique une …………… , un …………… et une …………… .</p><p>La translation qui transforme R en S s'écrit aussi la translation de …………… RS.</p>`,
 c:`<p>glisser · vecteur · direction · sens · longueur · vecteur ${vec("RS")}</p><p><i>(0,5 point par mot)</i></p>`},
{t:"Lire une figure", p:4, h:`<p>Observe la figure, puis recopie et complète le tableau.</p>${LAT2}
  <div class="scroll"><table class="std"><thead><tr><th></th><th>Translation</th><th>Figure initiale</th><th>Image obtenue</th></tr></thead><tbody>
  <tr><th>①</th><td>de vecteur ${vec("MN")}</td><td>RSM</td><td>……</td></tr><tr><th>②</th><td>qui transforme T en R</td><td>PQU</td><td>……</td></tr><tr><th>③</th><td>qui transforme R en T</td><td>……</td><td>TUP</td></tr><tr><th>④</th><td>qui transforme M en ……</td><td>MNS</td><td>PQU</td></tr></tbody></table></div>`,
 c:`<p>① ${r1} <i>(1 point)</i></p><p>② ${r2} <i>(1 point)</i></p><p>③ ${r3i} : on fait le chemin inverse, de T vers R. <i>(1 point)</i></p><p>④ M a pour image P : la translation transforme M en ${r4}. <i>(1 point)</i></p>`},
{t:"Frise et pavage", p:3, h:`<p><b>a)</b> Complète : dans une frise, le motif de base se répète par …… translation ; dans un pavage, il se répète par …… translations.</p><p><b>b)</b> Continue la frise en reproduisant 2 motifs de base par la translation qui transforme R en S.</p>${fri()}`,
 c:`<p><b>a)</b> une translation ; deux translations <i>(1 point)</i></p><p><b>b)</b> De R à S : 4 carreaux vers la droite. <i>(2 points : 1 point par motif)</i></p>${fri(true)}`},
{t:"Construire sur quadrillage", p:3, h:`<p>Construis l'image de la flèche par la translation qui transforme E en F. Nomme K’ l'image du point K.</p>${fle()}`,
 c:`<p>De E à F : 3 carreaux vers la droite et 2 vers le bas. Chaque sommet glisse de la même façon.</p>${fle(true)}<p><i>(3 points : 2 points pour la figure exacte, 1 point pour K’ bien placé et nommé)</i></p>`},
{t:"Construire sur feuille blanche", p:4, h:`<p><b>a)</b> Reproduis la figure (U, V et le triangle RST), puis construis le triangle R’S’T’, image du triangle RST par la translation qui transforme U en V. Laisse apparents tes traits de construction.</p>${blank(BL,"RST","U","V",{w:340,alt:"Le triangle RST et les points U et V"})}<p><b>b)</b> Explique comment tu as placé le point R’.</p>`,
 c:`${blank(BL,"RST","U","V",{w:360,sol:true,altS:"Le triangle RST et son image R’S’T’"})}<p><b>a)</b> R’, S’ et T’ sont placés au compas ; on relie R’, S’ et T’. <i>(3 points : 1 point par sommet)</i></p><p><b>b)</b> UVR’R est un parallélogramme : arc de centre R et de rayon UV, arc de centre V et de rayon UR ; R’ est le point d'intersection, du même côté que V. <i>(1 point)</i></p>`},
{t:"Ce que conserve une translation", p:3, h:`<p>Le triangle KLM a pour image le triangle K’L’M’ par une translation.</p><p>On sait que KL = 4,6 cm, ${ang("KLM")} = 38° et que l'aire de KLM est 9,2 cm².</p><p><b>a)</b> Donne la longueur K’L’.</p><p><b>b)</b> Donne la mesure de l'angle ${ang("K’L’M’")}.</p><p><b>c)</b> Donne l'aire du triangle K’L’M’.</p><p>Justifie chaque réponse.</p>`,
 c:`<p><b>a)</b> Une translation conserve les longueurs : K’L’ = KL = 4,6 cm. <i>(1 point)</i></p><p><b>b)</b> Une translation conserve les mesures d'angles : ${ang("K’L’M’")} = ${ang("KLM")} = 38°. <i>(1 point)</i></p><p><b>c)</b> Une translation conserve les aires : l'aire de K’L’M’ est 9,2 cm². <i>(1 point)</i></p>`}
]};
})()
};
})();
