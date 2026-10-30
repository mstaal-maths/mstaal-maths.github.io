/* 5e — Chapitre 4 : Parallélogrammes et aire (« La famille géométrique qui les relie ! »)
   + évaluation d'entraînement commune aux chapitres 3 et 4.
   Toutes les figures sont calculées : les longueurs et les angles dessinés sont exacts (à l'échelle). */
(function(){
const C=window.C5, VF=["Vrai","Faux"], ON=["Oui","Non"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const fr = x => String(Math.round(x*100)/100).replace(".",",");          /* 4.5 → « 4,5 » */
const ov = t => `<span class="ang">${t}</span>`;     /* nom d'angle */
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const ex = (p,alt,w) => img("5c4ex/"+p+".png", alt, w);

/* ------------------------------------------------------------------
   Géométrie (coordonnées en cm, y vers le haut)
------------------------------------------------------------------ */
const rad=d=>d*Math.PI/180, P=(r,a)=>[r*Math.cos(rad(a)), r*Math.sin(rad(a))];
const add=(a,b)=>[a[0]+b[0],a[1]+b[1]], sub=(a,b)=>[a[0]-b[0],a[1]-b[1]], mul=(a,k)=>[a[0]*k,a[1]*k], dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const fourth=(a,b,c)=>add(a,sub(c,b));            /* ABCD parallélogramme : D = A + C − B */
/* point à distance r1 de A et r2 de B (côté gauche de AB) */
const inter2=(A,B,r1,r2,left=true)=>{ const d=dist(A,B), x=(r1*r1-r2*r2+d*d)/(2*d), h=Math.sqrt(Math.max(0,r1*r1-x*x)), u=mul(sub(B,A),1/d), n=left?[-u[1],u[0]]:[u[1],-u[0]]; return add(add(A,mul(u,x)),mul(n,h)); };

/* ------------------------------------------------------------------
   Dessin d'une figure codée
   o.pts {nom:[x,y]} en cm · o.s = pixels par cm · o.poly [noms] · o.segs [[a,b,classe]]
   o.ticks [[a,b,n]] codage du segment [ab] (n traits) · o.rights [[sommet,a,b]] angle droit
   o.arcs [[sommet,a,b,texte,couleur]] · o.lens [[a,b,texte]] longueur écrite
   o.marks [noms] croix · o.hide [noms] sans étiquette · o.w largeur max
------------------------------------------------------------------ */
function fq(o){
  let s=o.s||30; const Q={};
  if(o.fit){ const xs=Object.values(o.pts).map(p=>p[0]), ys=Object.values(o.pts).map(p=>p[1]); const span=Math.max(Math.max(...xs)-Math.min(...xs), (Math.max(...ys)-Math.min(...ys))*1.3); if(span*s>o.fit) s=o.fit/span; } for(const k in o.pts) Q[k]=[o.pts[k][0]*s, -o.pts[k][1]*s];
  const poly=o.poly||[], used=new Set([...poly, ...(o.marks||[]), ...(o.segs||[]).flat().filter(x=>typeof x==="string"&&Q[x])]);
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9; used.forEach(n=>{ const [x,y]=Q[n]; x0=Math.min(x0,x); y0=Math.min(y0,y); x1=Math.max(x1,x); y1=Math.max(y1,y); });
  (o.segs||[]).forEach(([a,b])=>[Q[a],Q[b]].forEach(p=>{ if(p){ x0=Math.min(x0,p[0]); y0=Math.min(y0,p[1]); x1=Math.max(x1,p[0]); y1=Math.max(y1,p[1]); } }));
  const m=o.m||(o.lens&&o.lens.length?56:34); x0-=m; y0-=m; x1+=m; y1+=m;
  const W=x1-x0, H=y1-y0, w=Math.min(o.w||420, W);
  const cen = poly.length ? [poly.reduce((t,n)=>t+Q[n][0],0)/poly.length, poly.reduce((t,n)=>t+Q[n][1],0)/poly.length] : [(x0+x1)/2,(y0+y1)/2];
  let svg=`<svg class="fig geo" viewBox="${x0.toFixed(1)} ${y0.toFixed(1)} ${W.toFixed(1)} ${H.toFixed(1)}" width="${w.toFixed(0)}" role="img" aria-label="${o.alt||"Figure de géométrie"}">`;
  /* angles colorés (sous le reste) */
  (o.arcs||[]).forEach(([v,a,b,t,col])=>{ const V=Q[v], A=Q[a], B=Q[b], r=o.ar||22; const ua=Math.atan2(A[1]-V[1],A[0]-V[0]), ub=Math.atan2(B[1]-V[1],B[0]-V[0]);
    let d=ub-ua; while(d<=-Math.PI) d+=2*Math.PI; while(d>Math.PI) d-=2*Math.PI;
    const p1=[V[0]+r*Math.cos(ua),V[1]+r*Math.sin(ua)], p2=[V[0]+r*Math.cos(ub),V[1]+r*Math.sin(ub)];
    svg+=`<path d="M${V[0].toFixed(1)} ${V[1].toFixed(1)} L${p1[0].toFixed(1)} ${p1[1].toFixed(1)} A${r} ${r} 0 0 ${d>0?1:0} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)} Z" style="fill:${col||"#8bc34a"};fill-opacity:.45;stroke:none"/>`;
    if(t){ const um=ua+d/2, tx=V[0]+(r+16)*Math.cos(um), ty=V[1]+(r+16)*Math.sin(um); svg+=`<text x="${tx.toFixed(1)}" y="${(ty+5).toFixed(1)}" class="glab" text-anchor="middle" style="font-size:14px;font-weight:600">${t}</text>`; } });
  (o.polys2||[]).forEach(pp=>{ svg+=`<polygon points="${pp.map(n=>Q[n].map(v=>v.toFixed(1)).join(",")).join(" ")}" class="orig"/>`; });
  if(poly.length) svg+=`<polygon points="${poly.map(n=>Q[n].map(v=>v.toFixed(1)).join(",")).join(" ")}" class="${o.k||"orig"}"/>`;
  (o.segs||[]).forEach(([a,b,k])=>{ const A=Q[a]||a, B=Q[b]||b; svg+=`<line x1="${A[0].toFixed(1)}" y1="${A[1].toFixed(1)}" x2="${B[0].toFixed(1)}" y2="${B[1].toFixed(1)}" class="${k||"cons"}"/>`; });
  (o.ticks||[]).forEach(([a,b,n,col])=>{ const A=Q[a], B=Q[b], mx=(A[0]+B[0])/2, my=(A[1]+B[1])/2, d=Math.hypot(B[0]-A[0],B[1]-A[1]), ux=(B[0]-A[0])/d, uy=(B[1]-A[1])/d;
    for(let i=0;i<n;i++){ const off=(i-(n-1)/2)*5, cx=mx+ux*off, cy=my+uy*off; svg+=`<line x1="${(cx-uy*7+ux*2).toFixed(1)}" y1="${(cy+ux*7+uy*2).toFixed(1)}" x2="${(cx+uy*7-ux*2).toFixed(1)}" y2="${(cy-ux*7-uy*2).toFixed(1)}" style="stroke:${col||"#e0436b"};stroke-width:2"/>`; } });
  (o.rights||[]).forEach(([v,a,b])=>{ const V=Q[v], A=Q[a], B=Q[b], q=10, da=dist(A,V), db=dist(B,V), ua=[(A[0]-V[0])/da,(A[1]-V[1])/da], ub=[(B[0]-V[0])/db,(B[1]-V[1])/db];
    const p1=[V[0]+ua[0]*q,V[1]+ua[1]*q], p2=[V[0]+(ua[0]+ub[0])*q,V[1]+(ua[1]+ub[1])*q], p3=[V[0]+ub[0]*q,V[1]+ub[1]*q];
    svg+=`<path d="M${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L${p2[0].toFixed(1)} ${p2[1].toFixed(1)} L${p3[0].toFixed(1)} ${p3[1].toFixed(1)}" class="thin"/>`; });
  (o.lens||[]).forEach(([a,b,t,side,dd,tt])=>{ const A=Q[a], B=Q[b], f=tt??0.5, mx=A[0]+(B[0]-A[0])*f, my=A[1]+(B[1]-A[1])*f, d=Math.hypot(B[0]-A[0],B[1]-A[1]); let nx=-(B[1]-A[1])/d, ny=(B[0]-A[0])/d;
    if(side===undefined){ if((mx+nx*10-cen[0])**2+(my+ny*10-cen[1])**2 < (mx-cen[0])**2+(my-cen[1])**2){ nx=-nx; ny=-ny; } } else if(side<0){ nx=-nx; ny=-ny; }
    const D2=dd||15, anc = Math.abs(nx)>0.75 ? (nx>0?"start":"end") : "middle", D3 = anc==="middle" ? D2 : Math.min(D2,9); svg+=`<text x="${(mx+nx*D3).toFixed(1)}" y="${(my+ny*D3+5).toFixed(1)}" class="glab" text-anchor="${anc}" style="font-size:14px;fill:var(--c);font-weight:600;paint-order:stroke;stroke:var(--surface);stroke-width:4px">${t}</text>`; });
  (o.arrows||[]).forEach(([a,b,n])=>{ const A=Q[a], B=Q[b], d=Math.hypot(B[0]-A[0],B[1]-A[1]), ux=(B[0]-A[0])/d, uy=(B[1]-A[1])/d; for(let i=0;i<(n||1);i++){ const cx=(A[0]+B[0])/2+ux*(i*7-((n||1)-1)*3.5), cy=(A[1]+B[1])/2+uy*(i*7-((n||1)-1)*3.5);
    svg+=`<path d="M${(cx-ux*5-uy*5).toFixed(1)} ${(cy-uy*5+ux*5).toFixed(1)} L${(cx+ux*3).toFixed(1)} ${(cy+uy*3).toFixed(1)} L${(cx-ux*5+uy*5).toFixed(1)} ${(cy-uy*5-ux*5).toFixed(1)}" style="fill:none;stroke:#1e5aa8;stroke-width:2"/>`; } });
  (o.marks||[]).forEach(n=>{ const [x,y]=Q[n]; svg+=`<path d="M${x-5} ${y-5} L${x+5} ${y+5} M${x+5} ${y-5} L${x-5} ${y+5}" class="gx"${(o.blue||[]).includes(n)?' style="stroke:#1d63d8;stroke-width:2.2"':""}/>`; });
  const hide=new Set(o.hide||[]);
  used.forEach(n=>{ if(hide.has(n)) return; const [x,y]=Q[n]; let dx=x-cen[0], dy=y-cen[1], d=Math.hypot(dx,dy);
    if(o.lab&&o.lab[n]){ [dx,dy]=o.lab[n]; d=Math.hypot(dx,dy); } else if(d<1 || (o.marks||[]).includes(n) && !poly.includes(n)){ dx=11; dy=-11; d=Math.hypot(dx,dy); }
    const k=(o.marks||[]).includes(n)&&!poly.includes(n)?19:17;
    svg+=`<text x="${(x+dx/d*k).toFixed(1)}" y="${(y+dy/d*k+5).toFixed(1)}" class="glab" text-anchor="middle"${(o.blue||[]).includes(n)?' style="fill:#1d63d8;font-weight:700"':""}>${(o.names&&o.names[n])||n}</text>`; });
  return svg+(o.extra||"")+"</svg>";
}
/* parallélogramme « standard » ABCD de centre O (pour le cours) */
const STD = (()=>{ const A=[0,0], B=[5,0], D=[1.6,2.4], Cc=fourth(B,A,D); return {A,B,C:Cc,D,O:mul(add(A,Cc),.5)}; })();
const rn = (pts, map) => { const o={}; for(const k in map) o[map[k]]=pts[k]; return o; };

/* ------------------------------------------------------------------
   Figures du cours
------------------------------------------------------------------ */
const F_DEF = fq({pts:STD, poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], marks:["O"], alt:"Parallélogramme ABCD de centre O"});
const LKJI = rn(STD,{D:"L",C:"K",B:"J",A:"I",O:"M"});
const F_SYM = fq({pts:LKJI, poly:["L","K","J","I"], segs:[["L","J","cons"],["K","I","cons"]], marks:["M"], blue:["M"], alt:"LKJI parallélogramme de centre M"});   /* centre de symétrie en bleu (convention de M. Staal) */
const F_P2 = fq({pts:STD, poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], ticks:[["A","O",1],["O","C",1],["B","O",2],["O","D",2]], hide:["O"], marks:["O"], alt:"Les diagonales se coupent en leur milieu"});
const F_P3 = fq({pts:STD, poly:["A","B","C","D"], ticks:[["A","B",1],["D","C",1],["B","C",2],["A","D",2]], alt:"Côtés opposés de même longueur"});
const F_P4 = fq({pts:STD, poly:["A","B","C","D"], arcs:[["A","B","D","","#8bc34a"],["C","D","B","","#8bc34a"],["B","C","A","","#e57fb0"],["D","A","C","","#e57fb0"]], alt:"Angles opposés égaux"});
/* figures particulières */
const RECT={A:[0,2.6],B:[4.6,2.6],C:[4.6,0],D:[0,0]}; RECT.O=mul(add(RECT.A,RECT.C),.5);
const LOS={A:[0,0],B:[2.4,1.6],C:[4.8,0],D:[2.4,-1.6]}; LOS.O=[2.4,0];
const CAR={A:[0,2.2],B:[2.2,2.2],C:[2.2,0],D:[0,0]}; CAR.O=[1.1,1.1];
const CARd={A:[0,0],B:[1.8,1.8],C:[3.6,0],D:[1.8,-1.8]}; CARd.O=[1.8,0];
const F_RECT = fq({pts:RECT, poly:["A","B","C","D"], rights:[["A","B","D"],["B","C","A"],["C","D","B"],["D","A","C"]], s:28, alt:"Rectangle"});
const F_LOS = fq({pts:LOS, poly:["A","B","C","D"], ticks:[["A","B",1],["B","C",1],["C","D",1],["D","A",1]], s:28, alt:"Losange"});
const F_CAR = fq({pts:CAR, poly:["A","B","C","D"], rights:[["A","B","D"],["B","C","A"],["C","D","B"],["D","A","C"]], ticks:[["A","B",1],["B","C",1],["C","D",1],["D","A",1]], s:30, alt:"Carré"});
const F_RECTd = fq({pts:RECT, poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], ticks:[["A","O",2],["O","C",2],["B","O",2],["O","D",2]], marks:["O"], hide:["O"], s:28, alt:"Diagonales du rectangle"});
const F_LOSd = fq({pts:LOS, poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], rights:[["O","C","B"]], ticks:[["A","O",1],["O","C",1],["B","O",2],["O","D",2]], marks:["O"], hide:["O"], s:28, alt:"Diagonales du losange"});
const F_CARd = fq({pts:CARd, poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], rights:[["O","C","B"]], ticks:[["A","O",2],["O","C",2],["B","O",2],["O","D",2]], marks:["O"], hide:["O"], s:30, alt:"Diagonales du carré"});
/* aire */
const AIRE={A:[0,0],B:[6,0],D:[1.6,4],C:[7.6,4],H:[1.6,0]};
const F_AIRE = fq({pts:AIRE, poly:["A","B","C","D"], segs:[["D","H","cons"]], rights:[["H","B","D"]], lens:[["A","B","base = 6 cm",1],["D","H","hauteur = 4 cm",1,62]], hide:["H"], s:30, alt:"Base et hauteur d'un parallélogramme"});
/* « Autrement dit » : la carte des parallélogrammes particuliers */
const MAP = (()=>{ const T=(x,y,t,a="start")=>`<text x="${x}" y="${y}" text-anchor="${a}" class="glab" style="font-size:13px;paint-order:stroke;stroke:var(--surface);stroke-width:5px">${t}</text>`;
 return `<svg class="fig" viewBox="0 0 680 400" width="660" role="img" aria-label="Du parallélogramme au rectangle, au losange et au carré">
 <defs><marker id="am4" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--ink)"/></marker></defs>
 <path d="M110 168 C110 70 170 50 268 50" class="ln" marker-end="url(#am4)"/><path d="M110 222 C110 330 170 345 262 345" class="ln" marker-end="url(#am4)"/>
 <path d="M412 50 C540 50 590 80 595 160" class="ln" marker-end="url(#am4)"/><path d="M430 345 C540 345 590 320 595 240" class="ln" marker-end="url(#am4)"/>
 <polygon points="40,170 210,170 185,220 15,220" class="orig"/>${T(112,200,"<tspan style='font-weight:700;font-size:15px'>Parallélogramme</tspan>","middle")}
 <rect x="275" y="25" width="135" height="50" class="orig"/>${T(342,55,"<tspan style='font-weight:700;font-size:15px'>Rectangle</tspan>","middle")}
 <polygon points="345,312 425,345 345,378 265,345" class="orig"/>${T(345,350,"<tspan style='font-weight:700;font-size:15px'>Losange</tspan>","middle")}
 <rect x="562" y="165" width="70" height="70" class="orig"/>${T(597,205,"<tspan style='font-weight:700;font-size:15px'>Carré</tspan>","middle")}
 ${T(125,108,"qui a un angle droit")}${T(125,124,"ou des diagonales")}${T(125,140,"de même longueur")}
 ${T(125,262,"qui a deux côtés consécutifs")}${T(125,278,"de même longueur ou des")}${T(125,294,"diagonales perpendiculaires")}
 ${T(430,96,"qui a deux côtés consécutifs")}${T(430,112,"de même longueur ou des")}${T(430,128,"diagonales perpendiculaires")}
 ${T(430,282,"qui a un angle droit ou")}${T(430,298,"des diagonales de")}${T(430,314,"même longueur")}
</svg>`; })();

/* ------------------------------------------------------------------
   Données des exercices de la fiche (figures exactes)
------------------------------------------------------------------ */
/* Ex 2 : sur quadrillage */
const G2={A:[3,2],B:[7,3],C:[4,5]}; G2.D=add(G2.B,sub(G2.C,G2.A)); G2.E=add(G2.A,sub(G2.B,G2.C));
const gridFig = (pts, extra={}) => geo({pts, grid:{c:10,r:7}, s:30, w:350, marks:Object.keys(pts), ...extra});
/* Ex 3 : ABCD (5,4 cm ; 60° ; 3 cm) et LIRE de centre O (non en vraie grandeur) */
const E3a=(()=>{ const B=[5.4,0], A=[0,0], Cc=add(B,P(3,-120)); return {A,B,C:Cc,D:fourth(A,B,Cc)}; })();
const E3b=(()=>{ const O=[0,0], th=Math.acos((2.3*2.3+3.2*3.2-16)/(2*2.3*3.2))*180/Math.PI, I=P(2.3,35), R=P(3.2,35-th); return {O,I,R,L:mul(R,-1),E:mul(I,-1)}; })();
/* Activité 2 (BC corrigé : 4,5 cm) */
const A2=(()=>{ const E=[0,0], Cc=P(2.3,40), B=P(3.2,40-Math.acos((2.3*2.3+3.2*3.2-4.5*4.5)/(2*2.3*3.2))*180/Math.PI); return {E,C:Cc,B,A:mul(Cc,-1),D:mul(B,-1)}; })();
/* Ex 4 */
const X4={
 a:(()=>{ const O=[0,0], I=[4,0], L=P(2.5,-117); return {O,I,L,N:add(L,I)}; })(),
 b:(()=>{ const I=[0,0], J=[6,0], K=inter2(I,J,7,4); return {I,J,K,L:fourth(K,J,I)}; })(),
 c:(()=>{ const S=[0,0], I=[5,0], G=P(2,50); return {S,I,G,R:add(G,I)}; })(),
 d:(()=>{ const J=[0,0], F=P(4.3,100), th=Math.acos((4.3*4.3+9-36)/(2*4.3*3))*180/Math.PI, G=P(3,100-th); return {J,F,G,H:mul(F,-1),I:mul(G,-1)}; })(),
 e:(()=>{ const E=[0,0], D=P(5,200), Cc=P(2.5,280); return {E,D,C:Cc,B:mul(D,-1),A:mul(Cc,-1)}; })(),
 f:(()=>{ const R=[0,0], O=[4,0], M=inter2(R,O,6,5); return {R,O,M,E:fourth(R,O,M)}; })(),
 g:(()=>{ const U=[0,0], N=[5.5,0], L=P(3,108); return {U,N,L,E:add(L,N)}; })()
};
/* Ex 8 et 9 */
const X8a=(()=>{ const K=[0,0], J=P(4.1,166), L=P(4.1,194); return {K,J,L,I:fourth(J,K,L)}; })();
const X8b=(()=>{ const N=[0,0], O=[3.8,0], h=Math.sqrt(4.5*4.5-3.8*3.8); return {N,O,I:[3.8,h],L:[0,h]}; })();
const X9a={E:[0,3.5],F:[-2,0],G:[0,-3.5],H:[2,0],O:[0,0]};
const X9b=(()=>{ const h=Math.sqrt(49-36); return {A:[0,h],D:[6,h],C:[6,0],B:[0,0],O:[3,h/2]}; })();
const X9c=(()=>{ const c=4/Math.SQRT2; return {M:[0,c],N:[c,c],O:[c,0],P:[0,0],K:[c/2,c/2]}; })();
/* vérification interne : les longueurs dessinées sont celles de l'énoncé */
const CHK=[[E3b,"I","R",4],[E3b,"O","I",2.3],[E3b,"O","R",3.2],[X4.a,"O","I",4],[X4.a,"O","L",2.5],[X4.b,"I","J",6],[X4.b,"J","K",4],[X4.b,"I","K",7],[X4.c,"G","S",2],[X4.c,"S","I",5],[X4.d,"F","G",6],[X4.d,"F","J",4.3],[X4.d,"J","G",3],[X4.e,"D","E",5],[X4.e,"E","C",2.5],[X4.f,"R","O",4],[X4.f,"R","M",6],[X4.f,"O","M",5],[X4.g,"L","U",3],[X4.g,"U","N",5.5],[X8a,"I","J",4.1],[X8a,"J","K",4.1],[X8b,"N","O",3.8],[X8b,"N","I",4.5],[X9b,"A","D",6],[X9b,"A","C",7],[X9c,"P","N",4],[A2,"E","C",2.3],[A2,"E","B",3.2],[A2,"B","C",4.5]];
window.CHK54 = CHK.map(([o,a,b,l])=>Math.abs(dist(o[a],o[b])-l));
const angle=(V,A,B)=>{ const u=sub(A,V), v=sub(B,V); return Math.acos((u[0]*v[0]+u[1]*v[1])/(Math.hypot(...u)*Math.hypot(...v)))*180/Math.PI; };
window.CHK54ang = [[angle(X4.a.O,X4.a.I,X4.a.L),117],[angle(X4.c.S,X4.c.G,X4.c.I),50],[angle(X4.e.E,X4.e.D,X4.e.C),80],[angle(X4.g.U,X4.g.L,X4.g.N),108],[angle(X8a.K,X8a.J,X8a.L),28]].map(([a,b])=>Math.abs(a-b));

/* figures « énoncé » (codées, échelle réduite) et « correction » (à l'échelle, réduites à l'écran) */
const S4=26, FIT=170;
const sides=(o,v)=>v.map((n,i)=>[n,v[(i+1)%v.length]]);

/* ------------------------------------------------------------------
   Schémas « rappel en image » (exemples différents des questions)
------------------------------------------------------------------ */
const SC_DEF = sch("Côtés opposés parallèles", fq({pts:STD, poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], marks:["O"], s:24})+`<p class="schN">(AB) // (DC) et (AD) // (BC). Le point O, où se coupent les diagonales, est le <b>centre</b>.</p>`);
const SC_PROP = sch("Ce que je sais sur un parallélogramme", `<div class="schRow">${fq({pts:STD, poly:["A","B","C","D"], ticks:[["A","B",1],["D","C",1],["B","C",2],["A","D",2]], s:22})}${fq({pts:STD, poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], ticks:[["A","O",1],["O","C",1],["B","O",2],["O","D",2]], marks:["O"], hide:["O"], s:22})}</div><p class="schN">Côtés opposés de même longueur · diagonales qui se coupent en leur milieu · angles opposés égaux · un centre de symétrie.</p>`);
const SC_PROUVE = sch("Pour prouver que c'est un parallélogramme", `<p class="schN">Il suffit d'une de ces propriétés :</p><ul class="steps"><li>côtés opposés parallèles (les deux paires) ;</li><li>côtés opposés de même longueur (les deux paires) ;</li><li>deux côtés opposés parallèles <b>et</b> de même longueur ;</li><li>diagonales qui se coupent en leur milieu.</li></ul><p class="schN">Attention : une seule paire de côtés parallèles ne suffit pas (c'est peut-être un trapèze).</p>`);
const SC_PART = sch("Rectangle, losange, carré", `<div class="schRow">${F_RECTd}${F_LOSd}</div><p class="schN">Rectangle : diagonales de même longueur. Losange : diagonales perpendiculaires. Carré : les deux à la fois.</p>`);
const SC_NAT = sch("Du parallélogramme au carré", MAP);
const SC_AIRE = sch("Aire = base × hauteur", F_AIRE+`<p class="calc">Aire = 6 × 4 = 24 cm²</p><p class="schN">La hauteur est perpendiculaire à la base : ce n'est pas la longueur du côté penché.</p>`);

/* ------------------------------------------------------------------
   Évaluation d'entraînement n° 2 (chapitres 3 et 4)
------------------------------------------------------------------ */
/* ---- Évaluation d'entraînement n° 2 : mêmes compétences que l'évaluation de M. Staal, mais des exercices d'un autre type ---- */
/* Ex 6a : RS = 6, ST = 4, RT = 8 ⇒ T = (7 ; √15) */
const EV6a=(()=>{ const R=[0,0], S=[6,0], T=[7,Math.sqrt(15)]; return {R,S,T,U:fourth(T,S,R)}; })();
window.CHK54.push(Math.abs(dist(EV6a.R,EV6a.S)-6), Math.abs(dist(EV6a.S,EV6a.T)-4), Math.abs(dist(EV6a.R,EV6a.T)-8), Math.abs(dist(EV6a.T,EV6a.U)-6), Math.abs(dist(EV6a.R,EV6a.U)-4));
/* Ex 6b : losange EFGH de côté 4 cm, EG = 6 cm ⇒ F = (3 ; −√7) */
const EV6b=(()=>{ const E=[0,0], G=[6,0], r=Math.sqrt(7); return {E,F:[3,-r],G,H:[3,r]}; })();
window.CHK54.push(Math.abs(dist(EV6b.E,EV6b.F)-4), Math.abs(dist(EV6b.F,EV6b.G)-4), Math.abs(dist(EV6b.G,EV6b.H)-4), Math.abs(dist(EV6b.H,EV6b.E)-4), Math.abs(dist(EV6b.E,EV6b.G)-6));
/* Ex 7 : rectangle 4 × 3 ⇒ diagonales de 5, demi-diagonales de 2,5 */
const EV7={K:[0,0],L:[4,0],M:[4,3],N:[0,3],O:[2,1.5]};
window.CHK54.push(Math.abs(dist(EV7.O,EV7.K)-2.5), Math.abs(dist(EV7.O,EV7.N)-2.5));
const EV7fig = fq({pts:EV7, poly:["K","L","M","N"], segs:[["K","M"],["L","N"]], marks:["O"], lab:{O:[0,1]}, s:34, m:30, alt:"Le parallélogramme KLMN et ses diagonales"})+`<p class="dat">OK = 2,5 cm et ON = 2,5 cm</p>`;
/* Ex 8 : contre-exemple (trapèze aux diagonales de même longueur) */
const EV8fig = fq({pts:{A:[0,0],B:[4,0],C:[3,1.8],D:[1,1.8]}, poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], s:30, alt:"Un trapèze dont les diagonales ont la même longueur"})+`<p class="dat">AC = BD</p>`;
/* Ex 9 : deux parallélogrammes sur quadrillage (1 carreau = 1 cm), même aire 24 */
const EV9a = geo({pts:{A:[1,5],B:[7,5],C:[9,1],D:[3,1]}, grid:{c:10,r:6}, s:30, w:330, polys:[{v:["A","B","C","D"]}], marks:["A","B","C","D"], alt:"Le parallélogramme ABCD sur quadrillage"});
const EV9b = geo({pts:{E:[1,4],F:[9,4],G:[13,1],H:[5,1]}, grid:{c:14,r:5}, s:30, w:450, polys:[{v:["E","F","G","H"]}], marks:["E","F","G","H"], alt:"Le parallélogramme EFGH sur quadrillage"});
const EVAL = {
titre:"Évaluation d'entraînement — Chapitres 3 et 4", duree:55, info:"Durée : 55 min · Calculatrice non autorisée · Règle, équerre et compas",
comp:[
  ["MODÉLISER","Je passe d'un problème à une expression, et d'une expression à un programme de calcul.","Ex. 3, 4 et 5 (6,5 points)"],
  ["CALCULER","Je connais et j'utilise les priorités opératoires. Je calcule l'aire d'un parallélogramme.","Ex. 1, 2 et 9 (7 points)"],
  ["REPRÉSENTER","Je construis un parallélogramme en vraie grandeur.","Ex. 6 (3 points)"],
  ["RAISONNER","J'utilise les propriétés du parallélogramme pour calculer et démontrer, et je repère un raisonnement faux.","Ex. 7 et 8 (3,5 points)"]
],
exos:[
{t:"Vrai ou faux ?", p:2, h:`<p>Pour chaque égalité, écris « vrai » ou « faux ». Si elle est fausse, recopie-la en ajoutant des parenthèses pour qu'elle devienne vraie.</p>
  <p>a) 3 + 5 × 2 = 16</p><p>b) 20 − 8 − 2 = 10</p><p>c) 36 ÷ 6 ÷ 2 = 12</p><p>d) {12 + 8/4} = 5</p>`,
 c:`<p>a) <b>Faux</b> : la multiplication est prioritaire. Avec des parenthèses : (3 + 5) × 2 = 16.</p><div class="calcs">${C.html("3 + 5 × 2","A")}${C.html("(3 + 5) × 2","B")}</div>
  <p>b) <b>Vrai</b> : on calcule de gauche à droite.</p><div class="calcs">${C.html("20 − 8 − 2","C")}</div>
  <p>c) <b>Faux</b> : on calcule de gauche à droite. Avec des parenthèses : 36 ÷ (6 ÷ 2) = 12.</p><div class="calcs">${C.html("36 ÷ 6 ÷ 2","D")}${C.html("36 ÷ (6 ÷ 2)","E")}</div>
  <p>d) <b>Vrai</b> : le trait de fraction regroupe le numérateur.</p><div class="calcs"><p class="calc">F = {12 + 8/4}<br>F = (12 + 8) ÷ 4<br>F = 20 ÷ 4<br>F = 5</p></div><p><i>0,5 point par égalité.</i></p>`},
{t:"Le calcul de Théo", p:3, h:`<p>Théo a calculé B ainsi :</p><p class="calc">B = 18 − 2 × 3 + 4<br>B = 16 × 3 + 4<br>B = 48 + 4<br>B = 52</p>
  <p>a) Explique l'erreur de Théo.</p><p>b) Refais le calcul de B correctement, en détaillant tes étapes.</p>
  <p>c) Calcule C et D en détaillant toutes tes étapes.</p><div class="calcs"><span>C = 3 × [20 − (2 + 3) × 2]</span><span>D = 7,5 + 2,5 × 4</span></div>`,
 c:`<p>a) Théo a fait la soustraction 18 − 2 en premier. Or la multiplication est prioritaire : il fallait d'abord calculer 2 × 3. <i>(0,5 point)</i></p>
  <p>b) <i>(0,5 point)</i></p>${C.html("18 − 2 × 3 + 4","B")}
  <p>c) On commence par les parenthèses, à l'intérieur des crochets. <i>(1 point pour C, 1 point pour D)</i></p><div class="calcs">${C.html("3 × [20 − (2 + 3) × 2]","C")}${C.html("7,5 + 2,5 × 4","D")}</div>`},
{t:"Le bon calcul pour chaque problème", p:2, h:`<p>Pour chaque problème, écris la lettre de l'expression qui permet de le résoudre (attention, il y a des expressions en trop), puis calcule le résultat.</p>
  <p><b>Problème 1 :</b> je choisis le nombre 6, j'ajoute 4, puis je multiplie le résultat par 3.</p>
  <p><b>Problème 2 :</b> Sarah a 30 €. Elle achète 6 stylos à 4 € l'un. Combien d'argent lui reste-t-il ?</p>
  <p><b>Problème 3 :</b> trois amis se partagent équitablement le prix d'un repas à 30 € et d'un gâteau à 6 €. Combien paie chacun ?</p>
  <p><b>Problème 4 :</b> une fleuriste prépare 4 bouquets de 6 roses, et il lui reste 3 roses. Combien avait-elle de roses ?</p>
  <div class="calcs"><span><b>A</b> &nbsp; 6 + 4 × 3</span><span><b>B</b> &nbsp; (30 + 6) ÷ 3</span><span><b>C</b> &nbsp; 4 × 6 + 3</span><span><b>D</b> &nbsp; (6 + 4) × 3</span><span><b>E</b> &nbsp; 30 + 6 ÷ 3</span><span><b>F</b> &nbsp; (30 − 6) × 4</span><span><b>G</b> &nbsp; 30 − 6 × 4</span></div>`,
 c:`<p><b>Problème 1 :</b> expression D.</p>${C.html("(6 + 4) × 3","D")}
  <p><b>Problème 2 :</b> expression G.</p>${C.html("30 − 6 × 4","G")}<p>Il lui reste 6 €.</p>
  <p><b>Problème 3 :</b> expression B.</p>${C.html("(30 + 6) ÷ 3","B")}<p>Chacun paie 12 €.</p>
  <p><b>Problème 4 :</b> expression C.</p>${C.html("4 × 6 + 3","C")}<p>Elle avait 27 roses.</p>
  <p>Les expressions A, E et F ne conviennent pas. Par exemple, dans A = 6 + 4 × 3, on multiplierait 4 par 3 avant d'ajouter 6. <i>(0,25 point par lettre juste, 0,25 point par résultat juste)</i></p>`},
{t:"Retrouver le programme de calcul", p:1.5, h:`<p>Nina a choisi un nombre et lui a appliqué un programme de calcul. Elle a écrit tous ses calculs en une seule expression :</p><p class="calc">(9 − 4) × 6 + 2</p>
  <p>a) Quel nombre Nina a-t-elle choisi ?</p><p>b) Écris son programme de calcul, étape par étape.</p><p>c) Calcule le résultat obtenu par Nina, en détaillant tes étapes.</p>`,
 c:`<p>a) Nina a choisi le nombre 9. <i>(0,25 point)</i></p>
  <p>b) <i>(0,75 point : les étapes doivent être dans le bon ordre)</i></p><div class="pgc"><b>Programme</b><ul><li>Choisir un nombre</li><li>Soustraire 4</li><li>Multiplier par 6</li><li>Ajouter 2</li></ul></div>
  <p>c) <i>(0,5 point)</i> J'appelle A cette expression.</p>${C.html("(9 − 4) × 6 + 2","A")}`},
{t:"Sortie au zoo", p:3, h:`<p>Les 25 élèves d'une classe vont au zoo. Le car coûte 300 € pour toute la classe, et l'entrée coûte 7 € par élève. Les élèves se partagent équitablement le prix du car. Combien chaque élève paie-t-il en tout ?</p>
  <p>1) Écris une seule expression qui permet de résoudre le problème.</p><p>2) Effectue le calcul en détaillant tes étapes.</p><p>3) Conclus par une phrase.</p>`,
 c:`<p>1) Chaque élève paie sa part du car (300 ÷ 25) et son entrée (7 €) : 300 ÷ 25 + 7. <i>(1 point)</i></p>
  <p>2) <i>(1,5 point)</i> J'appelle A cette expression.</p>${C.html("300 ÷ 25 + 7","A")}
  <p>3) Chaque élève paie 19 €. <i>(0,5 point)</i></p>
  <p><i>Une autre expression juste :</i></p>${C.html("(300 + 25 × 7) ÷ 25","B")}`},
{t:"Constructions", p:3, h:`<p>Construis ces deux figures en vraie grandeur. Laisse apparents tes traits de construction.</p>
  <p>a) Le parallélogramme RSTU tel que RS = 6 cm, ST = 4 cm et RT = 8 cm.</p>
  <p>b) Le losange EFGH de côté 4 cm tel que EG = 6 cm.</p>`,
 c:`<p><b>a)</b> Je trace [RS] de 6 cm. Je place T avec deux arcs de cercle : centre R, rayon 8 cm, et centre S, rayon 4 cm. Les côtés opposés d'un parallélogramme ont la même longueur : je place U avec deux arcs, centre T, rayon 6 cm, et centre R, rayon 4 cm. <i>(1,5 point)</i></p>${fq({pts:EV6a, poly:["R","S","T","U"], segs:[["R","T"]], lens:[["R","S","6 cm",1],["S","T","4 cm",1],["R","T","8 cm",-1,14,0.4]], s:26})}
  <p><b>b)</b> Un losange a quatre côtés de 4 cm. Je trace la diagonale [EG] de 6 cm. Je place F avec deux arcs de rayon 4 cm, de centres E et G, d'un côté de [EG], puis H de la même façon de l'autre côté. <i>(1,5 point)</i></p>${fq({pts:EV6b, poly:["E","F","G","H"], segs:[["E","G"]], ticks:[["E","F",1],["F","G",1],["G","H",1],["H","E",1]], lens:[["E","G","6 cm",-1,12]], s:26})}`},
{t:"Enquête sur KLMN", p:2, h:`<p>KLMN est un parallélogramme de centre O. <i>Figure à main levée.</i></p>${EV7fig}
  <p>a) Calcule les longueurs KM et LN. Justifie.</p><p>b) Déduis-en la nature précise du parallélogramme KLMN. Justifie.</p><p>c) Quelle est la mesure de l'angle ${ov("KLM")} ? Justifie.</p>`,
 c:`<p>a) Je sais que KLMN est un parallélogramme de centre O. Or si un quadrilatère est un parallélogramme, alors ses diagonales se coupent en leur milieu. Donc O est le milieu de [KM] et de [LN] : KM = 2 × 2,5 = 5 cm et LN = 2 × 2,5 = 5 cm. <i>(0,75 point)</i></p>
  <p>b) Je sais que KLMN est un parallélogramme qui a des diagonales de même longueur (KM = LN = 5 cm). Or si un parallélogramme a des diagonales de même longueur, alors c'est un rectangle. Donc KLMN est un rectangle. <i>(0,75 point)</i></p>
  <p>c) Un rectangle a quatre angles droits, donc ${ov("KLM")} = 90°. <i>(0,5 point)</i></p>`},
{t:"Qui a raison ?", p:1.5, h:`<p>Léo et Inès ont chacun écrit une démonstration.</p>
  <p><b>Léo :</b> « Je sais que les diagonales de ABCD ont la même longueur. Or si un quadrilatère a ses diagonales de même longueur, alors c'est un parallélogramme. Donc ABCD est un parallélogramme. »</p>
  <p><b>Inès :</b> « Je sais que les diagonales de IJKL se coupent en leur milieu. Or si un quadrilatère a ses diagonales qui se coupent en leur milieu, alors c'est un parallélogramme. Donc IJKL est un parallélogramme. »</p>
  <p>a) Qui a fait un raisonnement juste ?</p><p>b) Explique l'erreur de l'autre, et dessine à main levée un quadrilatère qui le prouve.</p>`,
 c:`<p>a) <b>Inès</b> a raison : elle utilise une propriété du cours. <i>(0,5 point)</i></p>
  <p>b) La « propriété » de Léo est fausse : des diagonales de même longueur ne suffisent pas, il faut qu'elles se coupent en leur milieu. Par exemple, ce quadrilatère a des diagonales de même longueur, mais ce n'est pas un parallélogramme. <i>(1 point)</i></p>${EV8fig}`},
{t:"Même aire ?", p:2, h:`<p>Sur le quadrillage, chaque carreau représente 1 cm.</p><p><b>Parallélogramme ABCD</b></p>${EV9a}<p><b>Parallélogramme EFGH</b></p>${EV9b}
  <p>Mila affirme : « EFGH est plus long et plus penché que ABCD, donc son aire est plus grande. »</p>
  <p>a) Calcule l'aire de ABCD et l'aire de EFGH.</p><p>b) Mila a-t-elle raison ?</p><p>c) Un autre parallélogramme a une aire de 36 cm² et une base de 8 cm. Quelle est sa hauteur ?</p>`,
 c:`<p>a) ABCD : la base [AB] mesure 6 carreaux et la hauteur 4 carreaux. Aire = 6 × 4 = 24 cm². EFGH : la base [EF] mesure 8 carreaux et la hauteur 3 carreaux. Aire = 8 × 3 = 24 cm². <i>(1 point)</i></p>
  <p>b) Non, Mila a tort : les deux parallélogrammes ont la même aire, 24 cm². La hauteur se mesure perpendiculairement à la base, pas le long du côté penché. <i>(0,5 point)</i></p>
  <p>c) Aire = base × hauteur, donc 8 × hauteur = 36 et hauteur = 36 ÷ 8 = 4,5 cm. <i>(0,5 point)</i></p>`}
]};
/* ---- version aménagée (élèves à besoins éducatifs particuliers), faite comme M. Staal fait les siennes :
   même durée, environ une question sur cinq retirée (jamais un exercice entier), questions renumérotées, barème recalculé sur 20 ---- */
EVAL.bep = {
titre:"Évaluation d'entraînement — Chapitres 3 et 4 · version aménagée", duree:55, info:"Version aménagée · Durée : 55 min · Calculatrice non autorisée · Règle, équerre et compas",
note:"Même durée et mêmes exercices, avec environ une question sur cinq en moins (réparties dans plusieurs exercices). Les questions sont renumérotées et le barème est recalculé : la note reste sur 20. Les justifications sont toujours demandées.",
comp:[
  ["MODÉLISER","Je passe d'un problème à une expression, et d'une expression à un programme de calcul.","Ex. 3, 4 et 5 (7 points)"],
  ["CALCULER","Je connais et j'utilise les priorités opératoires. Je calcule l'aire d'un parallélogramme.","Ex. 1, 2 et 9 (6 points)"],
  ["REPRÉSENTER","Je construis un parallélogramme en vraie grandeur.","Ex. 6 (3,5 points)"],
  ["RAISONNER","J'utilise les propriétés du parallélogramme pour calculer et démontrer, et je repère un raisonnement faux.","Ex. 7 et 8 (3,5 points)"]
],
exos:[
{t:"Vrai ou faux ?", p:1.5, h:`<p>Pour chaque égalité, écris « vrai » ou « faux ». Si elle est fausse, recopie-la en ajoutant des parenthèses pour qu'elle devienne vraie.</p>
  <p>a) 3 + 5 × 2 = 16</p><p>b) 36 ÷ 6 ÷ 2 = 12</p><p>c) {12 + 8/4} = 5</p>`,
 c:`<p>a) <b>Faux</b> : la multiplication est prioritaire. Avec des parenthèses : (3 + 5) × 2 = 16.</p><div class="calcs">${C.html("3 + 5 × 2","A")}${C.html("(3 + 5) × 2","B")}</div>
  <p>b) <b>Faux</b> : on calcule de gauche à droite. Avec des parenthèses : 36 ÷ (6 ÷ 2) = 12.</p><div class="calcs">${C.html("36 ÷ 6 ÷ 2","C")}${C.html("36 ÷ (6 ÷ 2)","D")}</div>
  <p>c) <b>Vrai</b> : le trait de fraction regroupe le numérateur.</p><div class="calcs"><p class="calc">E = {12 + 8/4}<br>E = (12 + 8) ÷ 4<br>E = 20 ÷ 4<br>E = 5</p></div><p><i>0,5 point par égalité.</i></p>`},
{t:"Le calcul de Théo", p:2.5, h:`<p>Théo a calculé B ainsi :</p><p class="calc">B = 18 − 2 × 3 + 4<br>B = 16 × 3 + 4<br>B = 48 + 4<br>B = 52</p>
  <p>a) Explique l'erreur de Théo.</p><p>b) Refais le calcul de B correctement, en détaillant tes étapes.</p>
  <p>c) Calcule C en détaillant toutes tes étapes.</p><div class="calcs"><span>C = 3 × [20 − (2 + 3) × 2]</span></div>`,
 c:`<p>a) Théo a fait la soustraction 18 − 2 en premier. Or la multiplication est prioritaire : il fallait d'abord calculer 2 × 3. <i>(0,5 point)</i></p>
  <p>b) <i>(0,75 point)</i></p>${C.html("18 − 2 × 3 + 4","B")}
  <p>c) On commence par les parenthèses, à l'intérieur des crochets. <i>(1,25 point)</i></p>${C.html("3 × [20 − (2 + 3) × 2]","C")}`},
{t:"Le bon calcul pour chaque problème", p:1.5, h:`<p>Pour chaque problème, écris la lettre de l'expression qui permet de le résoudre (attention, il y a des expressions en trop), puis calcule le résultat.</p>
  <p><b>Problème 1 :</b> je choisis le nombre 6, j'ajoute 4, puis je multiplie le résultat par 3.</p>
  <p><b>Problème 2 :</b> Sarah a 30 €. Elle achète 6 stylos à 4 € l'un. Combien d'argent lui reste-t-il ?</p>
  <p><b>Problème 3 :</b> trois amis se partagent équitablement le prix d'un repas à 30 € et d'un gâteau à 6 €. Combien paie chacun ?</p>
  <div class="calcs"><span><b>A</b> &nbsp; 6 + 4 × 3</span><span><b>B</b> &nbsp; (30 + 6) ÷ 3</span><span><b>C</b> &nbsp; 4 × 6 + 3</span><span><b>D</b> &nbsp; (6 + 4) × 3</span><span><b>E</b> &nbsp; 30 + 6 ÷ 3</span><span><b>F</b> &nbsp; (30 − 6) × 4</span><span><b>G</b> &nbsp; 30 − 6 × 4</span></div>`,
 c:`<p><b>Problème 1 :</b> expression D.</p>${C.html("(6 + 4) × 3","D")}
  <p><b>Problème 2 :</b> expression G.</p>${C.html("30 − 6 × 4","G")}<p>Il lui reste 6 €.</p>
  <p><b>Problème 3 :</b> expression B.</p>${C.html("(30 + 6) ÷ 3","B")}<p>Chacun paie 12 €.</p>
  <p>Les expressions A, C, E et F ne conviennent pas. Par exemple, dans A = 6 + 4 × 3, on multiplierait 4 par 3 avant d'ajouter 6. <i>(0,25 point par lettre juste, 0,25 point par résultat juste)</i></p>`},
{t:"Retrouver le programme de calcul", p:2, h:`<p>Nina a choisi un nombre et lui a appliqué un programme de calcul. Elle a écrit tous ses calculs en une seule expression :</p><p class="calc">(9 − 4) × 6 + 2</p>
  <p>a) Quel nombre Nina a-t-elle choisi ?</p><p>b) Écris son programme de calcul, étape par étape.</p><p>c) Calcule le résultat obtenu par Nina, en détaillant tes étapes.</p>`,
 c:`<p>a) Nina a choisi le nombre 9. <i>(0,25 point)</i></p>
  <p>b) <i>(1 point : les étapes doivent être dans le bon ordre)</i></p><div class="pgc"><b>Programme</b><ul><li>Choisir un nombre</li><li>Soustraire 4</li><li>Multiplier par 6</li><li>Ajouter 2</li></ul></div>
  <p>c) <i>(0,75 point)</i> J'appelle A cette expression.</p>${C.html("(9 − 4) × 6 + 2","A")}`},
{t:"Sortie au zoo", p:3.5, h:`<p>Les 25 élèves d'une classe vont au zoo. Le car coûte 300 € pour toute la classe, et l'entrée coûte 7 € par élève. Les élèves se partagent équitablement le prix du car. Combien chaque élève paie-t-il en tout ?</p>
  <p>1) Écris une seule expression qui permet de résoudre le problème.</p><p>2) Effectue le calcul en détaillant tes étapes.</p><p>3) Conclus par une phrase.</p>`,
 c:`<p>1) Chaque élève paie sa part du car (300 ÷ 25) et son entrée (7 €) : 300 ÷ 25 + 7. <i>(1,25 point)</i></p>
  <p>2) <i>(1,75 point)</i> J'appelle A cette expression.</p>${C.html("300 ÷ 25 + 7","A")}
  <p>3) Chaque élève paie 19 €. <i>(0,5 point)</i></p>
  <p><i>Une autre expression juste :</i></p>${C.html("(300 + 25 × 7) ÷ 25","B")}`},
{t:"Constructions", p:3.5, h:`<p>Construis ces deux figures en vraie grandeur. Laisse apparents tes traits de construction.</p>
  <p>a) Le parallélogramme RSTU tel que RS = 6 cm, ST = 4 cm et RT = 8 cm.</p>
  <p>b) Le losange EFGH de côté 4 cm tel que EG = 6 cm.</p>`,
 c:`<p><b>a)</b> Je trace [RS] de 6 cm. Je place T avec deux arcs de cercle : centre R, rayon 8 cm, et centre S, rayon 4 cm. Les côtés opposés d'un parallélogramme ont la même longueur : je place U avec deux arcs, centre T, rayon 6 cm, et centre R, rayon 4 cm. <i>(1,75 point)</i></p>${fq({pts:EV6a, poly:["R","S","T","U"], segs:[["R","T"]], lens:[["R","S","6 cm",1],["S","T","4 cm",1],["R","T","8 cm",-1,14,0.4]], s:26})}
  <p><b>b)</b> Un losange a quatre côtés de 4 cm. Je trace la diagonale [EG] de 6 cm. Je place F avec deux arcs de rayon 4 cm, de centres E et G, d'un côté de [EG], puis H de la même façon de l'autre côté. <i>(1,75 point)</i></p>${fq({pts:EV6b, poly:["E","F","G","H"], segs:[["E","G"]], ticks:[["E","F",1],["F","G",1],["G","H",1],["H","E",1]], lens:[["E","G","6 cm",-1,12]], s:26})}`},
{t:"Enquête sur KLMN", p:2, h:`<p>KLMN est un parallélogramme de centre O. <i>Figure à main levée.</i></p>${EV7fig}
  <p>a) Calcule les longueurs KM et LN. Justifie.</p><p>b) Déduis-en la nature précise du parallélogramme KLMN. Justifie.</p>`,
 c:`<p>a) Je sais que KLMN est un parallélogramme de centre O. Or si un quadrilatère est un parallélogramme, alors ses diagonales se coupent en leur milieu. Donc O est le milieu de [KM] et de [LN] : KM = 2 × 2,5 = 5 cm et LN = 2 × 2,5 = 5 cm. <i>(1 point)</i></p>
  <p>b) Je sais que KLMN est un parallélogramme qui a des diagonales de même longueur (KM = LN = 5 cm). Or si un parallélogramme a des diagonales de même longueur, alors c'est un rectangle. Donc KLMN est un rectangle. <i>(1 point)</i></p>`},
{t:"Qui a raison ?", p:1.5, h:`<p>Léo et Inès ont chacun écrit une démonstration.</p>
  <p><b>Léo :</b> « Je sais que les diagonales de ABCD ont la même longueur. Or si un quadrilatère a ses diagonales de même longueur, alors c'est un parallélogramme. Donc ABCD est un parallélogramme. »</p>
  <p><b>Inès :</b> « Je sais que les diagonales de IJKL se coupent en leur milieu. Or si un quadrilatère a ses diagonales qui se coupent en leur milieu, alors c'est un parallélogramme. Donc IJKL est un parallélogramme. »</p>
  <p>a) Qui a fait un raisonnement juste ?</p><p>b) Explique l'erreur de l'autre, et dessine à main levée un quadrilatère qui le prouve.</p>`,
 c:`<p>a) <b>Inès</b> a raison : elle utilise une propriété du cours. <i>(0,5 point)</i></p>
  <p>b) La « propriété » de Léo est fausse : des diagonales de même longueur ne suffisent pas, il faut qu'elles se coupent en leur milieu. Par exemple, ce quadrilatère a des diagonales de même longueur, mais ce n'est pas un parallélogramme. <i>(1 point)</i></p>${EV8fig}`},
{t:"Même aire ?", p:2, h:`<p>Sur le quadrillage, chaque carreau représente 1 cm.</p><p><b>Parallélogramme ABCD</b></p>${EV9a}<p><b>Parallélogramme EFGH</b></p>${EV9b}
  <p>Mila affirme : « EFGH est plus long et plus penché que ABCD, donc son aire est plus grande. »</p>
  <p>a) Calcule l'aire de ABCD et l'aire de EFGH.</p><p>b) Mila a-t-elle raison ? Explique.</p>`,
 c:`<p>a) ABCD : la base [AB] mesure 6 carreaux et la hauteur 4 carreaux. Aire = 6 × 4 = 24 cm². EFGH : la base [EF] mesure 8 carreaux et la hauteur 3 carreaux. Aire = 8 × 3 = 24 cm². <i>(1,25 point)</i></p>
  <p>b) Non, Mila a tort : les deux parallélogrammes ont la même aire, 24 cm². La hauteur se mesure perpendiculairement à la base, pas le long du côté penché. <i>(0,75 point)</i></p>`}
]};

/* ====================================================================== */
CH["5e-4"] = {
intro:"Le parallélogramme : définition, propriétés, comment prouver qu'un quadrilatère est un parallélogramme, rectangle, losange et carré, et l'aire du parallélogramme.",
savoir:[
  "connaître la définition et les propriétés du parallélogramme, et les utiliser pour trouver une longueur ou un angle ;",
  "prouver qu'un quadrilatère est un parallélogramme, puis qu'un parallélogramme est un rectangle, un losange ou un carré ;",
  "construire un parallélogramme (ou un rectangle, un losange, un carré) en vraie grandeur ;",
  "calculer l'aire d'un parallélogramme : base × hauteur."
],
cours:[
{t:"Définition et vocabulaire", h:`
  <div class="retenir" data-l="Définition"><p>Un <b>parallélogramme</b> est un quadrilatère dont les côtés <b>opposés sont parallèles</b>.</p></div>
  <div class="retenir" data-l="Vocabulaire"><p>Le point d'intersection de ses diagonales est appelé le <b>centre du parallélogramme</b>.</p></div>
  <p><b>Exemple :</b> ici, ABCD est un parallélogramme de centre O : (AB) // (DC) et (AD) // (BC).</p>${F_DEF}`},
{t:"Propriétés du parallélogramme et démonstrations", h:`
  <h4>a) Si j'ai un parallélogramme, je peux dire…</h4>
  <div class="retenir" data-l="Propriété 1"><p><b>Si</b> un quadrilatère est un parallélogramme, <b>alors</b> il possède un centre de symétrie : le point d'intersection de ses diagonales.</p></div>
  <p><b>Exemple :</b> LKJI est un parallélogramme. Le point M est son centre de symétrie.</p>${F_SYM}
  <div class="retenir" data-l="Propriété 2"><p><b>Si</b> un quadrilatère est un parallélogramme, <b>alors</b> ses diagonales se coupent en leur milieu.</p></div>${F_P2}
  <div class="retenir" data-l="Propriété 3"><p><b>Si</b> un quadrilatère est un parallélogramme, <b>alors</b> ses côtés opposés sont de même longueur.</p></div>${F_P3}
  <div class="retenir" data-l="Propriété 4"><p><b>Si</b> un quadrilatère est un parallélogramme, <b>alors</b> ses angles opposés sont égaux.</p></div>${F_P4}
  <h4>b) Si je veux montrer qu'un quadrilatère est un parallélogramme</h4>
  <div class="retenir" data-l="Propriétés"><p><b>Propriété 1 : Si</b> un quadrilatère a ses côtés opposés parallèles, <b>alors</b> c'est un parallélogramme.</p>
   <p><b>Propriété 2 : Si</b> un quadrilatère a ses côtés opposés de même longueur, <b>alors</b> c'est un parallélogramme.</p>
   <p><b>Propriété 3 : Si</b> un quadrilatère a deux côtés opposés parallèles et de même longueur, <b>alors</b> c'est un parallélogramme.</p>
   <p><b>Propriété 4 : Si</b> un quadrilatère a ses diagonales qui se coupent en leur milieu, <b>alors</b> c'est un parallélogramme.</p></div>
  <div class="anim" data-anim="5e4-para-compas"></div>
  <div class="anim" data-anim="5e4-para-diagonales"></div>`},
{t:"Parallélogrammes particuliers", h:`
  <h4>a) Rappels de 6<sup>e</sup></h4>
  <div class="cgrid"><figure><figcaption>Un <b>rectangle</b> est un quadrilatère qui a quatre angles droits.</figcaption>${F_RECT}</figure><figure><figcaption>Un <b>losange</b> est un quadrilatère qui a quatre côtés de même longueur.</figcaption>${F_LOS}</figure><figure><figcaption>Un <b>carré</b> est un quadrilatère qui a quatre angles droits et quatre côtés de même longueur.</figcaption>${F_CAR}</figure></div>
  <p>Le rectangle, le losange et le carré sont des parallélogrammes particuliers, car ils ont tous des côtés opposés parallèles.</p>
  <div class="retenir" data-l="Définitions"><p><b>Rectangle :</b> parallélogramme qui a un angle droit.</p><p><b>Losange :</b> parallélogramme qui a deux côtés consécutifs de même longueur.</p><p><b>Carré :</b> parallélogramme qui a un angle droit et deux côtés consécutifs de même longueur (c'est à la fois un rectangle et un losange).</p></div>
  <div class="retenir" data-l="Propriétés"><p>Si un quadrilatère est un <b>rectangle</b>, alors ses diagonales sont de même longueur.</p><p>Si un quadrilatère est un <b>losange</b>, alors ses diagonales sont perpendiculaires.</p><p>Si un quadrilatère est un <b>carré</b>, alors ses diagonales sont perpendiculaires et de même longueur.</p></div>
  <div class="cgrid"><figure>${F_RECTd}<figcaption>Rectangle</figcaption></figure><figure>${F_LOSd}<figcaption>Losange</figcaption></figure><figure>${F_CARd}<figcaption>Carré</figcaption></figure></div>
  <h4>b) Si je veux montrer qu'un parallélogramme est un rectangle, un losange ou un carré</h4>
  <div class="retenir" data-l="Propriétés"><div class="scroll"><table class="std"><thead><tr><th>Propriétés avec les côtés</th><th>Propriétés avec les diagonales</th></tr></thead><tbody>
   <tr><td><b>Si</b> un parallélogramme a <b>deux côtés consécutifs perpendiculaires</b>, <b>alors</b> c'est un <b>rectangle</b>.</td><td><b>Si</b> un parallélogramme a des <b>diagonales de même longueur</b>, <b>alors</b> c'est un <b>rectangle</b>.</td></tr>
   <tr><td><b>Si</b> un parallélogramme a <b>deux côtés consécutifs de même longueur</b>, <b>alors</b> c'est un <b>losange</b>.</td><td><b>Si</b> un parallélogramme a des <b>diagonales perpendiculaires</b>, <b>alors</b> c'est un <b>losange</b>.</td></tr>
   <tr><td><b>Si</b> un parallélogramme a <b>deux côtés consécutifs perpendiculaires et de même longueur</b>, <b>alors</b> c'est un <b>carré</b>.</td><td><b>Si</b> un parallélogramme a des <b>diagonales de même longueur et perpendiculaires</b>, <b>alors</b> c'est un <b>carré</b>.</td></tr></tbody></table></div></div>
  <p><b>Autrement dit :</b></p>${MAP}`},
{t:"Aire du parallélogramme", h:`
  <div class="retenir" data-l="Formule"><p class="big">Aire = base × hauteur</p><p>La hauteur est mesurée perpendiculairement à la base choisie.</p></div>
  ${F_AIRE}
  <p><b>Exemple :</b> un parallélogramme de base 6 cm et de hauteur 4 cm a une aire de 6 × 4 = 24 cm².</p>
  <p>Pour une figure complexe, on la découpe en plusieurs parallélogrammes (ou triangles) et on additionne les aires obtenues.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Repérer et tracer des parallélogrammes", e:[
  {n:"Activité 1", t:"Quadrilatères particuliers", h:`<p><b>Rappels de 6<sup>e</sup></b></p>
   <div class="cgrid"><figure><figcaption><b>Le rectangle</b> – Définition : quadrilatère qui a 4 angles droits.</figcaption>${F_RECT}</figure><figure><figcaption><b>Le losange</b> – Définition : quadrilatère qui a 4 côtés de même mesure.</figcaption>${F_LOS}</figure><figure><figcaption><b>Le carré</b> – Définition : quadrilatère qui a 4 angles droits et 4 côtés de même mesure.</figcaption>${F_CAR}</figure></div>
   <p>Relis ces trois définitions et observe le codage de chaque figure : les petits carrés indiquent les angles droits, les petits traits indiquent les côtés de même longueur.</p>`,
   c:`<p>Cette activité est un rappel : il n'y a rien à calculer, mais il faut savoir lire le codage.</p>
   <p><b>Rectangle</b> : 4 petits carrés, donc 4 angles droits.</p><p><b>Losange</b> : le même petit trait sur les 4 côtés, donc 4 côtés de même longueur.</p><p><b>Carré</b> : 4 angles droits <b>et</b> 4 côtés de même longueur.</p>
   <p><i>À retenir : un carré est à la fois un rectangle (il a 4 angles droits) et un losange (il a 4 côtés de même longueur).</i></p>`},
  {n:"Exercice 1", t:"Repérer des parallélogrammes", w:"Sur ton cahier", h:`${ex("ex1","Droites de couleur et points d'intersection",420)}<p>Donne trois noms de parallélogrammes de la figure, sachant que deux droites de même couleur sont parallèles entre elles.</p>`,
   c:`<p>Chaque parallélogramme est formé par deux paires de droites parallèles.</p>
   <p>Droites rouges et droites bleues : <b>SPGI</b>.</p><p>Droites rouges et droites vertes : <b>MRNH</b>.</p><p>Droites bleues et droites vertes : <b>KLOJ</b>.</p>
   <p><i>On peut nommer un parallélogramme en partant de n'importe quel sommet, en tournant dans un sens ou dans l'autre : SPGI, PGIS, ISPG… sont justes. Mais SGPI ne l'est pas, car S et G ne sont pas voisins.</i></p>`},
  {n:"Exercice 2", t:"Tracer des parallélogrammes", w:"Sur ton cahier", h:`<p>Reproduis les points A, B et C sur ton cahier : <b>un carreau de la figure = un carreau de ton cahier</b>.</p>${gridFig({A:G2.A,B:G2.B,C:G2.C})}<p>a) Place le point D tel que ABDC soit un parallélogramme. b) Place le point E tel que AEBC soit un parallélogramme.</p>`,
   c:`<p>a) ABDC est un parallélogramme : [AB] et [CD] sont des côtés opposés, donc ils sont parallèles et de même longueur. Pour aller de A à B, on se déplace de 4 carreaux vers la droite et de 1 carreau vers le bas. Je fais le même déplacement à partir de C : j'arrive en D.</p>
   <p>b) AEBC est un parallélogramme : [AE] et [BC] sont des côtés opposés, donc ils sont parallèles et de même longueur. Pour aller de C à B : 3 carreaux vers la droite et 2 vers le haut. Je fais le même déplacement à partir de A : j'arrive en E.</p>
   ${geo({pts:G2, grid:{c:10,r:7}, s:30, w:350, polys:[{v:["A","B","D","C"]},{v:["A","E","B","C"],k:"img"}], marks:["A","B","C","D","E"]})}
   <p><i>Vérification : les diagonales d'un parallélogramme se coupent en leur milieu. Le milieu de [AD] est aussi celui de [BC].</i></p>`},
  {n:"Exercice 3", t:"Lire les informations sur un parallélogramme", w:"Sur ton cahier", h:`<p>Les deux quadrilatères ABCD et LIRE sont des parallélogrammes ; LIRE a pour centre O. Les longueurs sont en cm. <i>Les figures ne sont pas en vraie grandeur.</i></p>
   <div class="figs">${fq({pts:E3a, poly:["A","B","C","D"], arcs:[["B","A","C","60°"]], lens:[["A","B","5,4 cm"],["B","C","3 cm"]], s:30})}${fq({pts:E3b, poly:["L","I","R","E"], segs:[["L","R"],["I","E"]], marks:["O"], lens:[["O","I","2,3"],["O","R","3,2"],["I","R","4"]], s:30})}</div>
   <p>En t'aidant des propriétés du cours, recopie chaque figure et écris dessus le maximum d'informations (longueurs, mesures d'angles, droites parallèles, codages…).</p>`,
   c:`<p><b>ABCD :</b></p><p>Côtés opposés parallèles : (AB) // (DC) et (AD) // (BC).</p><p>Côtés opposés de même longueur : DC = AB = 5,4 cm et AD = BC = 3 cm.</p><p>Angles opposés égaux : ${ov("ADC")} = ${ov("ABC")} = 60°, et ${ov("DAB")} = ${ov("BCD")} (ces deux angles ont la même mesure).</p>
   ${fq({pts:E3a, poly:["A","B","C","D"], arcs:[["B","A","C","60°"],["D","C","A","60°"]], lens:[["A","B","5,4 cm"],["B","C","3 cm"],["D","C","5,4 cm"],["A","D","3 cm"]], s:30})}
   <p><b>LIRE :</b></p><p>Côtés opposés parallèles : (LI) // (ER) et (LE) // (IR).</p><p>Côtés opposés de même longueur : LE = IR = 4 cm.</p><p>Diagonales qui se coupent en leur milieu : OE = OI = 2,3 cm et OL = OR = 3,2 cm. Donc IE = 2 × 2,3 = 4,6 cm et LR = 2 × 3,2 = 6,4 cm.</p>
   ${fq({pts:E3b, poly:["L","I","R","E"], segs:[["L","R"],["I","E"]], marks:["O"], lens:[["O","I","2,3"],["O","R","3,2"],["I","R","4"],["O","E","2,3"],["O","L","3,2"],["L","E","4"]], ticks:[["O","I",1],["O","E",1],["O","R",2],["O","L",2]], s:44})}`},
  {n:"Activité 2", t:"Utiliser les propriétés pour démontrer et construire", w:"Sur ton cahier", h:`<p>ABCD est un parallélogramme de centre E. On donne : EC = 2,3 cm, EB = 3,2 cm et BC = 4,5 cm. <i>La figure n'est pas en vraie grandeur.</i></p>
   ${fq({pts:A2, poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], marks:["E"], lens:[["E","C","2,3"],["E","B","3,2"],["B","C","4,5"]], s:30})}
   <p>1. Donne les longueurs DE et EA. Justifie. 2. Construis ce parallélogramme en vraie grandeur.</p>`,
   c:`<p>1. Je sais que ABCD est un parallélogramme de centre E. Or si un quadrilatère est un parallélogramme, alors ses diagonales se coupent en leur milieu. Donc DE = EB = 3,2 cm et EA = EC = 2,3 cm.</p>
   <p>2. Construction :</p><ol><li>Je trace [BC] de 4,5 cm.</li><li>Avec le compas : un arc de centre C et de rayon 2,3 cm, un arc de centre B et de rayon 3,2 cm. Ils se coupent en E.</li><li>Je trace la demi-droite [CE) et je place A tel que EA = 2,3 cm.</li><li>Je trace la demi-droite [BE) et je place D tel que ED = 3,2 cm.</li><li>Je trace le quadrilatère ABCD.</li></ol>
   ${fq({pts:A2, poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], marks:["E"], ticks:[["E","C",1],["E","A",1],["E","B",2],["E","D",2]], s:30})}<p><i>Figure réduite : sur ton cahier, BC mesure 4,5 cm.</i></p>`},
  {n:"Exercice 4", t:"Tracés de parallélogrammes", w:"Sur ton cahier", h:`<p>Construis ces parallélogrammes en vraie grandeur sur ton cahier. Pour c), f) et g), fais un dessin à main levée avant de les tracer. <i>Les figures a), b), d) et e) ne sont pas en vraie grandeur.</i></p>
   <div class="cgrid">
    <figure><figcaption><b>a)</b> le parallélogramme OINL</figcaption>${fq({pts:X4.a, poly:["O","I","N","L"], arcs:[["O","I","L","117°","#e57fb0"]], lens:[["O","I","4 cm"],["O","L","2,5 cm"]], s:S4, fit:FIT})}</figure>
    <figure><figcaption><b>b)</b> le parallélogramme LKJI</figcaption>${fq({pts:X4.b, poly:["L","K","J","I"], segs:[["I","K","ln"]],  s:S4, fit:FIT})}<p class="dat">${"IJ = "+"6 cm"} · ${"JK = "+"4 cm"} · ${"IK = "+"7 cm"}</p></figure>
    <figure><figcaption><b>d)</b> le parallélogramme FGHI de centre J</figcaption>${fq({pts:X4.d, poly:["F","G","H","I"], segs:[["F","H"],["G","I"]], marks:["J"],  s:S4, fit:FIT})}<p class="dat">${"FG = "+"6 cm"} · ${"FJ = "+"4,3 cm"} · ${"JG = "+"3 cm"}</p></figure>
    <figure><figcaption><b>e)</b> le parallélogramme ABCD de centre E</figcaption>${fq({pts:X4.e, poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], marks:["E"], arcs:[["E","D","C","80°","#7fb2e5"]],  s:S4, fit:FIT})}<p class="dat">${"DE = "+"5 cm"} · ${"EC = "+"2,5 cm"}</p></figure>
   </div>
   <p>c) Trace un parallélogramme GRIS tel que GS = 2 cm, SI = 5 cm et ${ov("GSI")} = 50°.</p><p>f) Trace un parallélogramme ROME tel que RO = 4 cm, RM = 6 cm et OM = 5 cm.</p><p>g) Trace un parallélogramme LUNE tel que LU = 3 cm, UN = 5,5 cm et ${ov("LUN")} = 108°.</p>`,
   c:`<p>Les figures ci-dessous sont à l'échelle, mais réduites : sur ton cahier, les longueurs doivent être celles de l'énoncé.</p>
   <div class="cgrid">
    <figure><figcaption><b>a)</b> Je trace [OI] de 4 cm, puis l'angle de 117° en O et L à 2,5 cm de O. Côtés opposés de même longueur : N est à 2,5 cm de I et à 4 cm de L (compas).</figcaption>${fq({pts:X4.a, poly:["O","I","N","L"], arcs:[["O","I","L","117°","#e57fb0"]], s:S4, fit:FIT})}</figure>
    <figure><figcaption><b>b)</b> Je trace [IJ] de 6 cm. K est à 4 cm de J et à 7 cm de I (deux arcs). Puis L est à 6 cm de K et à 4 cm de I.</figcaption>${fq({pts:X4.b, poly:["L","K","J","I"], segs:[["I","K","cons"]], s:S4, fit:FIT})}</figure>
    <figure><figcaption><b>c)</b> Je trace [SI] de 5 cm, l'angle de 50° en S, et G à 2 cm de S. R est à 5 cm de G et à 2 cm de I.</figcaption>${fq({pts:X4.c, poly:["G","R","I","S"], arcs:[["S","I","G","50°"]], s:S4, fit:FIT})}</figure>
    <figure><figcaption><b>d)</b> Je trace le triangle FJG (FG = 6 cm, FJ = 4,3 cm, JG = 3 cm). Les diagonales se coupent en leur milieu : je prolonge [FJ) de 4,3 cm (point H) et [GJ) de 3 cm (point I).</figcaption>${fq({pts:X4.d, poly:["F","G","H","I"], segs:[["F","H"],["G","I"]], marks:["J"], s:S4, fit:FIT})}</figure>
    <figure><figcaption><b>e)</b> Les diagonales se coupent en leur milieu : DB = 2 × 5 = 10 cm et AC = 2 × 2,5 = 5 cm. Je trace [DB] de 10 cm et son milieu E, puis une droite qui fait un angle de 80° avec [ED] en E, et je place C et A à 2,5 cm de E.</figcaption>${fq({pts:X4.e, poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], marks:["E"], arcs:[["E","D","C","80°","#7fb2e5"]], s:S4, fit:FIT})}</figure>
    <figure><figcaption><b>f)</b> Je trace le triangle ROM (RO = 4 cm, RM = 6 cm, OM = 5 cm). Puis E est à 5 cm de R et à 4 cm de M.</figcaption>${fq({pts:X4.f, poly:["R","O","M","E"], segs:[["R","M","cons"]], s:S4, fit:FIT})}</figure>
    <figure><figcaption><b>g)</b> Je trace [UN] de 5,5 cm, l'angle de 108° en U, et L à 3 cm de U. E est à 5,5 cm de L et à 3 cm de N.</figcaption>${fq({pts:X4.g, poly:["L","U","N","E"], arcs:[["U","N","L","108°","#e57fb0"]], s:S4, fit:FIT})}</figure>
   </div>`}
 ]},
{t:"Prouver qu'un quadrilatère est un parallélogramme", e:[
  {n:"Activité 3", t:"Vraie ou fausse ?", w:"Sur ton cahier", h:`<p>Parmi ces propriétés, certaines sont vraies et d'autres sont fausses. Recopie les propriétés vraies.</p>
   <p>a) Si un quadrilatère a deux côtés opposés parallèles, alors c'est un parallélogramme.</p><p>b) Si un quadrilatère a ses côtés opposés parallèles, alors c'est un parallélogramme.</p><p>c) Si un quadrilatère a deux côtés opposés de même longueur, alors c'est un parallélogramme.</p><p>d) Si un quadrilatère a ses côtés opposés de même longueur, alors c'est un parallélogramme.</p><p>e) Si un quadrilatère a deux côtés opposés parallèles et de même longueur, alors c'est un parallélogramme.</p><p>f) Si un quadrilatère a ses diagonales qui se coupent en leur milieu, alors c'est un parallélogramme.</p>`,
   c:`<p>a) <b>Fausse</b> : un trapèze a deux côtés opposés parallèles, mais ce n'est pas un parallélogramme.</p>
   ${fq({pts:{A:[0,0],B:[5,0],C:[3.6,2],D:[1,2]}, poly:["A","B","C","D"], s:22, alt:"Trapèze"})}
   <p>b) <b>Vraie</b> (c'est la définition).</p>
   <p>c) <b>Fausse</b> : ce trapèze a deux côtés opposés de même longueur, mais ce n'est pas un parallélogramme.</p>
   ${fq({pts:{A:[0,0],B:[5,0],C:[3.8,2],D:[1.2,2]}, poly:["A","B","C","D"], ticks:[["A","D",1],["B","C",1]], s:22, alt:"Trapèze isocèle"})}
   <p>d) <b>Vraie</b> : c'est la propriété 2 du cours.</p><p>e) <b>Vraie</b> : c'est la propriété 3 du cours.</p><p>f) <b>Vraie</b> : c'est la propriété 4 du cours.</p>`},
  {n:"Exercice 5", t:"Prouver qu'un quadrilatère est un parallélogramme", w:"Sur ton cahier", h:`<p>a) Parmi les 6 quadrilatères ci-dessous, lesquels sont des parallélogrammes ? b) Justifie rigoureusement pourquoi ces quadrilatères sont des parallélogrammes. <i>On ne peut utiliser que les codages et les informations écrites.</i></p>
   <div class="cgrid">
    <figure><figcaption><b>a.</b></figcaption>${fq({pts:{A:[0,0],B:[3.4,0],C:[4.4,1.6],D:[1,1.6]}, poly:["A","B","C","D"], hide:["A","B","C","D"], s:24, m:16})}</figure>
    <figure><figcaption><b>b.</b></figcaption>${fq({pts:{A:[0,0],B:[3.4,0],C:[4.2,1.7],D:[0.8,1.7]}, poly:["A","B","C","D"], ticks:[["A","B",1],["D","C",1],["B","C",2],["A","D",2]], hide:["A","B","C","D"], s:24, m:16})}</figure>
    <figure><figcaption><b>c.</b> (LI) // (ER)</figcaption>${fq({pts:{L:[0,2],I:[3,2],R:[3,0],E:[0,0]}, poly:["L","I","R","E"], lens:[["L","I","4"],["E","R","4"]], s:24})}</figure>
    <figure><figcaption><b>d.</b></figcaption>${fq({pts:{A:[0,0],B:[3.4,0],C:[4.6,1.6],D:[1.2,1.6],O:[2.3,0.8]}, poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], ticks:[["A","O",2],["O","C",2],["B","O",1],["O","D",1]], hide:["A","B","C","D","O"], s:24, m:16})}</figure>
    <figure><figcaption><b>e.</b></figcaption>${fq({pts:{A:[0,0],B:[3.4,0],C:[2.8,1.7],D:[0,1.7]}, poly:["A","B","C","D"], lens:[["D","C","5"],["A","D","5"]], hide:["A","B","C","D"], s:24, m:20})}</figure>
    <figure><figcaption><b>f.</b></figcaption>${fq({pts:{A:[0,0],B:[3.6,0],C:[4.4,1.6],D:[0.8,1.6]}, poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], lens:[["A","C","8",1,12,0.78],["B","D","8",-1,12,0.78]], hide:["A","B","C","D"], s:24, m:16})}</figure>
   </div>`,
   c:`<p>a) Les parallélogrammes sont <b>b</b>, <b>c</b> et <b>d</b>.</p>
   <p>b) <b>b.</b> Je sais que ses côtés opposés sont de même longueur (codages). Or si un quadrilatère a ses côtés opposés de même longueur, alors c'est un parallélogramme. Donc le quadrilatère b est un parallélogramme.</p>
   <p><b>c.</b> Je sais que (LI) // (ER) et LI = ER = 4. Or si un quadrilatère a deux côtés opposés parallèles et de même longueur, alors c'est un parallélogramme. Donc LIRE est un parallélogramme.</p>
   <p><b>d.</b> Je sais que ses diagonales se coupent en leur milieu (codages). Or si un quadrilatère a ses diagonales qui se coupent en leur milieu, alors c'est un parallélogramme. Donc le quadrilatère d est un parallélogramme.</p>
   <p><b>a.</b> Aucune information : on ne peut rien prouver, même s'il « a l'air » d'un parallélogramme. <b>e.</b> Deux côtés <b>consécutifs</b> de même longueur ne suffisent pas. <b>f.</b> Des diagonales de même longueur ne suffisent pas : il faut qu'elles se coupent en leur milieu.</p>`}
 ]},
{t:"Parallélogrammes particuliers", e:[
  {n:"Activité 4", t:"Propriétés des parallélogrammes particuliers", w:"Sur ton cahier", h:`<p>Recopie et complète chaque phrase avec <b>rectangle</b>, <b>losange</b> ou <b>carré</b>.</p>
   <p>a) Un parallélogramme qui a un angle droit est un ……</p><p>b) Un parallélogramme qui a des diagonales de même longueur est un ……</p><p>c) Un parallélogramme qui a deux côtés consécutifs de même longueur est un ……</p><p>d) Un parallélogramme qui a des diagonales perpendiculaires est un ……</p><p>e) Un rectangle qui a des diagonales perpendiculaires est un ……</p><p>f) Un losange qui a un angle droit est un ……</p>`,
   c:`<p>a) rectangle</p><p>b) rectangle</p><p>c) losange</p><p>d) losange</p><p>e) carré</p><p>f) carré</p>${MAP}`},
  {n:"Exercice 6", t:"Prouver la nature d'un parallélogramme avec ses côtés", w:"Sur ton cahier", h:`<p>Les quadrilatères suivants sont des parallélogrammes. <i>Ils sont dessinés à main levée.</i></p>${ex("ex6","Six parallélogrammes codés numérotés de 1 à 6",640)}<p>1. Parmi eux, il y a des parallélogrammes particuliers. Donne la nature de chacun. 2. Justifie ton choix pour le parallélogramme 4 et pour le parallélogramme 5.</p>`,
   c:`<p>1. ① rectangle · ② carré · ③ losange · ④ rectangle · ⑤ carré · ⑥ losange</p>
   <p>2. <b>④</b> Je sais que ④ est un parallélogramme qui a un angle droit (deux côtés consécutifs perpendiculaires). Or si un parallélogramme a deux côtés consécutifs perpendiculaires, alors c'est un rectangle. Donc ④ est un rectangle.</p>
   <p><b>⑤</b> Je sais que ⑤ est un parallélogramme qui a un angle droit et deux côtés consécutifs de même longueur. Or si un parallélogramme a deux côtés consécutifs perpendiculaires et de même longueur, alors c'est un carré. Donc ⑤ est un carré.</p>`},
  {n:"Exercice 7", t:"Prouver la nature d'un parallélogramme avec ses diagonales", w:"Sur ton cahier", h:`${ex("ex7","Diagonales codées de quatre quadrilatères",640)}<p>1. En observant les codages des diagonales de ces quatre quadrilatères, donne leur nature. 2. Justifie ton choix pour ABCD et pour EFGH.</p>`,
   c:`<p>1. a. ABCD : rectangle · b. EFGH : losange · c. IJKL : carré · d. MNOP : parallélogramme</p>
   <p>2. <b>ABCD</b> : je sais que ses diagonales se coupent en leur milieu, donc ABCD est un parallélogramme. De plus, ses diagonales ont la même longueur (les quatre moitiés ont le même codage). Or si un parallélogramme a des diagonales de même longueur, alors c'est un rectangle. Donc ABCD est un rectangle.</p>
   <p><b>EFGH</b> : je sais que ses diagonales se coupent en leur milieu, donc EFGH est un parallélogramme. De plus, ses diagonales sont perpendiculaires. Or si un parallélogramme a des diagonales perpendiculaires, alors c'est un losange. Donc EFGH est un losange.</p>`},
  {n:"Exercice 8", t:"Construire avec les propriétés des côtés", w:"Sur ton cahier", h:`<p>Construis en vraie grandeur. <i>Les figures ne sont pas en vraie grandeur.</i></p>
   <div class="figs"><figure><figcaption>1. Le losange IJKL</figcaption>${fq({pts:X8a, poly:["I","J","K","L"], arcs:[["K","J","L","28°","#e57fb0"]],  ticks:[["I","J",1],["J","K",1],["K","L",1],["L","I",1]], s:28, ar:40})}<p class="dat">${"IL = "+"4,1 cm"}</p></figure>
   <figure><figcaption>2. Le rectangle LION</figcaption>${fq({pts:X8b, poly:["L","I","O","N"], segs:[["N","I","ln"]], rights:[["O","N","I"]],  s:34})}<p class="dat">${"NO = "+"3,8 cm"} · ${"NI = "+"4,5 cm"}</p></figure></div>`,
   c:`<p><b>1.</b> Je trace l'angle ${ov("JKL")} de 28°, et je place J et L à 4,1 cm de K. Puis I est à 4,1 cm de J et à 4,1 cm de L (deux arcs de cercle) : les quatre côtés ont la même longueur.</p>
   ${fq({pts:X8a, poly:["I","J","K","L"], arcs:[["K","J","L","28°","#e57fb0"]], ticks:[["I","J",1],["J","K",1],["K","L",1],["L","I",1]], s:28, ar:40})}
   <p><b>2.</b> Je trace [NO] de 3,8 cm, puis la perpendiculaire à (NO) en O. Avec le compas, un arc de centre N et de rayon 4,5 cm coupe cette perpendiculaire en I. Enfin, L est tel que NL = OI et LI = NO (ou je trace les perpendiculaires).</p>
   ${fq({pts:X8b, poly:["L","I","O","N"], segs:[["N","I","cons"]], rights:[["O","N","I"],["N","L","O"],["L","I","N"],["I","O","L"]], s:34})}`},
  {n:"Exercice 9", t:"Construire avec les propriétés des diagonales", w:"Sur ton cahier", h:`<p>Construis en vraie grandeur. <i>Les figures ne sont pas en vraie grandeur.</i></p>
   <div class="figs"><figure><figcaption>1. Le losange EFGH de centre O</figcaption>${fq({pts:X9a, poly:["E","F","G","H"], segs:[["E","G"],["F","H"]], marks:["O"], rights:[["O","H","E"]],  s:22})}<p class="dat">${"EO = "+"3,5 cm"} · ${"OH = "+"2 cm"}</p></figure>
   <figure><figcaption>2. Le rectangle ABCD de centre O</figcaption>${fq({pts:X9b, poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], marks:["O"],  s:24})}<p class="dat">${"AD = "+"6 cm"} · ${"AO = "+"3,5 cm"}</p></figure>
   <figure><figcaption>3. Le carré MNOP</figcaption>${fq({pts:X9c, poly:["M","N","O","P"], segs:[["P","N","ln"]],  hide:["K"], s:34})}<p class="dat">${"PN = "+"4 cm"}</p></figure></div>`,
   c:`<p><b>1.</b> Un losange a des diagonales perpendiculaires qui se coupent en leur milieu. Je trace [EG] de 2 × 3,5 = 7 cm et son milieu O, puis la perpendiculaire à (EG) en O. Je place F et H sur cette perpendiculaire, à 2 cm de O.</p>
   ${fq({pts:X9a, poly:["E","F","G","H"], segs:[["E","G"],["F","H"]], marks:["O"], rights:[["O","H","E"]], ticks:[["E","O",2],["O","G",2],["F","O",1],["O","H",1]], s:22})}
   <p><b>2.</b> Un rectangle a des diagonales de même longueur qui se coupent en leur milieu. Je trace [AD] de 6 cm. A et D sont à 3,5 cm de O : deux arcs de rayon 3,5 cm, de centres A et D, se coupent en O. Je prolonge [AO) et [DO) de 3,5 cm : j'obtiens C et B.</p>
   ${fq({pts:X9b, poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], marks:["O"], ticks:[["A","O",1],["O","C",1],["B","O",1],["O","D",1]], s:24})}
   <p><b>3.</b> Un carré a des diagonales perpendiculaires, de même longueur, qui se coupent en leur milieu. Je trace [PN] de 4 cm et son milieu K, puis la perpendiculaire à (PN) en K. Je place M et O sur cette perpendiculaire, à 2 cm de K (MO = PN = 4 cm, donc KM = KO = 4 ÷ 2 = 2 cm).</p>
   ${fq({pts:X9c, poly:["M","N","O","P"], segs:[["P","N"],["M","O"]], marks:["K"], rights:[["K","N","M"]], ticks:[["P","K",1],["K","N",1],["M","K",1],["K","O",1]], s:34})}`}
 ]}
],

/* ===================== QUIZ ===================== */
quiz:[
{nom:"Définition et vocabulaire", schema:SC_DEF, q:{
 1:[ {q:"Un parallélogramme est un quadrilatère dont…", c:["les côtés opposés sont parallèles","deux côtés sont parallèles","les quatre angles sont droits"], rep:"les côtés opposés sont parallèles"},
     {q:"Comment appelle-t-on le point d'intersection des diagonales d'un parallélogramme ?", c:["le centre","le milieu","le sommet"], rep:"le centre"} ],
 2:[ {q:"ABCD est un parallélogramme. Quel côté est opposé à [AB] ?", c:["[CD]","[BC]","[AD]"], rep:"[CD]", ex:"Dans ABCD, les sommets se suivent : [AB] et [CD] sont opposés."},
     {q:"ABCD est un parallélogramme. Quelles droites sont parallèles ?", c:["(AD) et (BC)","(AB) et (BC)","(AC) et (BD)"], rep:"(AD) et (BC)"},
     {q:"ABCD est un parallélogramme. Quelles sont ses diagonales ?", c:["[AC] et [BD]","[AB] et [CD]","[AD] et [BC]"], rep:"[AC] et [BD]"} ],
 3:[ {q:"Le parallélogramme ABCD peut aussi s'appeler :", c:["BCDA","ACBD","ABDC"], rep:"BCDA", ex:"On part d'un sommet et on suit les côtés : B, C, D, A."},
     {q:"Vrai ou faux : un rectangle est un parallélogramme.", c:VF, rep:"Vrai", ex:"Ses côtés opposés sont parallèles."} ]
}},
{nom:"Propriétés du parallélogramme", schema:SC_PROP, q:{
 1:[ {g:()=>{ const x=ri(30,90)/10; return {q:`ABCD est un parallélogramme et AB = ${fr(x)} cm. Combien mesure CD (en cm) ?`, rep:fr(x), ex:"Côtés opposés de même longueur."}; }},
     {g:()=>{ const a=ri(40,140); return {q:`ABCD est un parallélogramme et ${ov("ABC")} = ${a}°. Combien mesure ${ov("CDA")} (en °) ?`, rep:String(a), ex:"Les angles opposés sont égaux."}; }} ],
 2:[ {g:()=>{ const ac=ri(30,90)/5; return {q:`ABCD est un parallélogramme de centre O et AC = ${fr(ac)} cm. Combien mesure OA (en cm) ?`, rep:fr(ac/2), ex:"Les diagonales se coupent en leur milieu : OA = AC ÷ 2."}; }},
     {g:()=>{ const oa=ri(15,45)/10; return {q:`ABCD est un parallélogramme de centre O et OB = ${fr(oa)} cm. Combien mesure BD (en cm) ?`, rep:fr(oa*2), ex:"O est le milieu de [BD] : BD = 2 × OB."}; }},
     {q:"ABCD est un parallélogramme de centre O. Quel est le symétrique du point A par rapport à O ?", c:["C","B","D"], rep:"C", ex:"O est le centre de symétrie et le milieu de [AC]."} ],
 3:[ {g:()=>{ const a=ri(3,7), b=ri(2,5); return {q:`ABCD est un parallélogramme avec AB = ${a} cm et BC = ${b} cm. Quel est son périmètre (en cm) ?`, rep:String(2*(a+b)), ex:`Côtés opposés de même longueur : ${a} + ${b} + ${a} + ${b} = ${2*(a+b)} cm.`}; }},
     {q:"Vrai ou faux : les diagonales d'un parallélogramme ont toujours la même longueur.", c:VF, rep:"Faux", ex:"Elles se coupent en leur milieu, mais n'ont pas forcément la même longueur (c'est le cas du rectangle)."} ]
}},
{nom:"Prouver que c'est un parallélogramme", schema:SC_PROUVE, q:{
 1:[ {q:"Un quadrilatère a ses côtés opposés parallèles. C'est :", c:["un parallélogramme","un rectangle","on ne peut pas savoir"], rep:"un parallélogramme"},
     {q:"Un quadrilatère a ses diagonales qui se coupent en leur milieu. C'est :", c:["un parallélogramme","un losange","on ne peut pas savoir"], rep:"un parallélogramme"} ],
 2:[ {q:"Vrai ou faux : un quadrilatère qui a deux côtés opposés parallèles est un parallélogramme.", c:VF, rep:"Faux", ex:"Un trapèze a deux côtés opposés parallèles sans être un parallélogramme."},
     {q:"Un quadrilatère a deux côtés opposés parallèles et de même longueur. C'est :", c:["un parallélogramme","on ne peut pas savoir"], rep:"un parallélogramme"},
     {q:"Un quadrilatère a ses côtés opposés de même longueur. C'est :", c:["un parallélogramme","on ne peut pas savoir"], rep:"un parallélogramme"} ],
 3:[ {q:"Vrai ou faux : un quadrilatère qui a des diagonales de même longueur est un parallélogramme.", c:VF, rep:"Faux", ex:"Il faut que les diagonales se coupent en leur milieu."},
     {q:"Vrai ou faux : un quadrilatère qui a deux côtés consécutifs de même longueur est un parallélogramme.", c:VF, rep:"Faux", ex:"Il faut que les côtés <b>opposés</b> soient de même longueur (les deux paires)."},
     {q:"Les diagonales [EG] et [FH] du quadrilatère EFGH ont le même milieu. Quelle propriété permet de dire que EFGH est un parallélogramme ?", c:["Les diagonales se coupent en leur milieu","Les côtés opposés sont parallèles","Les angles opposés sont égaux"], rep:"Les diagonales se coupent en leur milieu"} ]
}},
{nom:"Rectangle, losange, carré", schema:SC_PART, q:{
 1:[ {q:"Un rectangle est un parallélogramme qui a…", c:["un angle droit","deux côtés consécutifs de même longueur","des diagonales perpendiculaires"], rep:"un angle droit"},
     {q:"Un losange est un parallélogramme qui a…", c:["deux côtés consécutifs de même longueur","un angle droit","des diagonales de même longueur"], rep:"deux côtés consécutifs de même longueur"} ],
 2:[ {q:"Les diagonales d'un rectangle sont…", c:["de même longueur","perpendiculaires","parallèles"], rep:"de même longueur"},
     {q:"Les diagonales d'un losange sont…", c:["perpendiculaires","de même longueur","parallèles"], rep:"perpendiculaires"},
     {g:()=>{ const x=ri(30,80)/10; return {q:`ABCD est un rectangle et AC = ${fr(x)} cm. Combien mesure BD (en cm) ?`, rep:fr(x), ex:"Les diagonales d'un rectangle ont la même longueur."}; }} ],
 3:[ {q:"Vrai ou faux : un carré est à la fois un rectangle et un losange.", c:VF, rep:"Vrai"},
     {g:()=>{ const x=ri(20,50)/10; return {q:`ABCD est un carré de centre O et AC = ${fr(2*x)} cm. Combien mesure OD (en cm) ?`, rep:fr(x), ex:`Diagonales de même longueur qui se coupent en leur milieu : BD = ${fr(2*x)} cm, donc OD = ${fr(x)} cm.`}; }} ]
}},
{nom:"Prouver la nature d'un parallélogramme", schema:SC_NAT, q:{
 1:[ {q:"Un parallélogramme a un angle droit. C'est :", c:["un rectangle","un losange","un carré"], rep:"un rectangle"},
     {q:"Un parallélogramme a deux côtés consécutifs de même longueur. C'est :", c:["un losange","un rectangle","un carré"], rep:"un losange"} ],
 2:[ {q:"Un parallélogramme a des diagonales perpendiculaires. C'est :", c:["un losange","un rectangle","un carré"], rep:"un losange"},
     {q:"Un parallélogramme a des diagonales de même longueur. C'est :", c:["un rectangle","un losange","un carré"], rep:"un rectangle"} ],
 3:[ {q:"Un parallélogramme a des diagonales de même longueur et perpendiculaires. C'est :", c:["un carré","un rectangle","un losange"], rep:"un carré"},
     {q:"Un losange a un angle droit. C'est :", c:["un carré","un rectangle","seulement un losange"], rep:"un carré"},
     {q:"Un rectangle a deux côtés consécutifs de même longueur. C'est :", c:["un carré","un losange seulement","seulement un rectangle"], rep:"un carré"} ]
}},
{nom:"Aire du parallélogramme", schema:SC_AIRE, q:{
 1:[ {q:"Quelle est la formule de l'aire d'un parallélogramme ?", c:["base × hauteur","côté × côté","base + hauteur"], rep:"base × hauteur"},
     {g:()=>{ const b=ri(3,9), h=ri(2,7); return {q:`Un parallélogramme a une base de ${b} cm et une hauteur de ${h} cm. Quelle est son aire (en cm²) ?`, rep:String(b*h), ex:`${b} × ${h} = ${b*h} cm².`}; }} ],
 2:[ {g:()=>{ const b=ri(3,9), h=ri(2,6), c=h+ri(1,3); return {q:`Un parallélogramme a une base de ${b} cm, une hauteur de ${h} cm et un côté penché de ${c} cm. Quelle est son aire (en cm²) ?`, rep:String(b*h), ex:`L'aire A :<span class="calc" style="display:block;margin:6px 0">A = base × hauteur<br>A = ${b} × ${h}<br>A = ${b*h} cm²</span>Le côté penché ne sert pas.`}; }},
     {g:()=>{ const b=ri(4,12), h=ri(2,8)/2; return {q:`Base : ${b} cm, hauteur : ${fr(h)} cm. Quelle est l'aire du parallélogramme (en cm²) ?`, rep:C.txt(C.val(`${b} × ${fr(h)}`)), ex:`${b} × ${fr(h)} = ${C.txt(C.val(`${b} × ${fr(h)}`))} cm².`}; }} ],
 3:[ {g:()=>{ const h=ri(2,8), b=ri(2,9), A=b*h; return {q:`Un parallélogramme a une aire de ${A} cm² et une base de ${b} cm. Quelle est sa hauteur (en cm) ?`, rep:String(h), ex:`${b} × hauteur = ${A}, donc hauteur = ${A} ÷ ${b} = ${h} cm.`}; }},
     {q:"Vrai ou faux : la hauteur d'un parallélogramme est perpendiculaire à la base.", c:VF, rep:"Vrai"} ]
}}
],
eval: EVAL
};
/* le chapitre 3 a sa propre évaluation d'entraînement, plus courte (5e-3.js) */
window.FIG54 = {fq, P, add, sub, mul, dist, fourth, inter2, MAP};
})();
