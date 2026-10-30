/* 4e — Chapitre 10 : Volumes de la pyramide et du cône (cours, fiche d'exercices, rappels de conversions,
   exercices de révisions et exercices pour les plus rapides de M. Staal)
   Les photos viennent des documents Word (img/4k10co, img/4k10ex) ; les figures de géométrie sont dessinées en SVG
   à partir des valeurs : ce qui est dessiné est exactement ce qui est écrit. */
(function(){
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const co=(p,alt,w)=>img("4k10co/"+p,alt,w), ex=(p,alt,w)=>img("4k10ex/"+p,alt,w);
const fig=(cap,body)=>`<figure>${body}${cap?`<figcaption>${cap}</figcaption>`:""}</figure>`;
const rd=(x,k=3)=>Math.round(x*10**k)/10**k;
/* écriture française : 1 000 · 14,58 · −2,5 */
const N=(x,k=3)=>{ const v=rd(x,k); const [i,d]=String(Math.abs(v)).split("."); return (v<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
/* réponses tapées : avec ou sans l'unité */
const U=(s,u)=>[s, s+" "+u, s+u];
const RED="#d0342c", BLUE="#1e5aa8", GRN="#1e8a4c", FILL="color-mix(in srgb,var(--c) 16%,transparent)";
const T=(x,y,t,st="",a="middle")=>`<text x="${(+x).toFixed(1)}" y="${(+y).toFixed(1)}" text-anchor="${a}" style="font-size:15px;${st}">${t}</text>`;
const ln=(a,b,dash,st="")=>`<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" class="${dash?"thin":"ln"}" style="${dash?"stroke-dasharray:6 5;":""}${st}"/>`;

/* ------------------------------------------------------------------
   Solide en perspective cavalière (coordonnées en unités, y = profondeur)
   V {nom:[x,y,z]} · E [[a,b,caché]] · F [[noms…]] faces colorées · lab {nom:[dx,dy]} noms des sommets
   txt [[point 3D ou nom, texte, dx, dy, style]] · hgt [[a,b]] hauteurs (pointillés verts) · k échelle (px par unité)
------------------------------------------------------------------ */
function sol(o){
  const k=o.k||40, kx=0.5, ky=0.36, P={};
  Object.entries(o.V).forEach(([n,[x,y,z]])=>P[n]=[(x+y*kx)*k, -(z+y*ky)*k]);
  const g=a=>typeof a==="string"?P[a]:[(a[0]+a[1]*kx)*k, -(a[2]+a[1]*ky)*k];
  const all=[...Object.values(P)], pad=o.pad||46;
  (o.call||[]).forEach(([p,t,dx,dy])=>{ const q=g(p), w=t.length*8; all.push([q[0]+dx+(dx<0?-w:w),q[1]+dy]); });
  const mx=Math.min(...all.map(p=>p[0]))-pad, Mx=Math.max(...all.map(p=>p[0]))+pad+(o.padR||0), my=Math.min(...all.map(p=>p[1]))-pad+6, My=Math.max(...all.map(p=>p[1]))+pad-6;
  const W=Math.round(Mx-mx), H=Math.round(My-my), s0=([x,y])=>[x-mx,y-my];
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${o.w?Math.min(o.w,W):W}" role="img" aria-label="${o.alt||"Solide"}">`;
  (o.F||[]).forEach(f=>{ s+=`<polygon points="${f.map(n=>s0(g(n)).map(v=>v.toFixed(1)).join(",")).join(" ")}" style="fill:${FILL};stroke:none"/>`; });
  (o.E||[]).forEach(([a,b,h])=>{ s+=ln(s0(g(a)),s0(g(b)),h); });
  (o.hgt||[]).forEach(([a,b])=>{ s+=ln(s0(g(a)),s0(g(b)),false,`stroke:${GRN};stroke-width:2.2;stroke-dasharray:7 5`); });
  (o.right||[]).forEach(([v,a,b])=>{ const V=s0(g(v)), A=s0(g(a)), B=s0(g(b)), u=[A[0]-V[0],A[1]-V[1]], w=[B[0]-V[0],B[1]-V[1]], nu=Math.hypot(...u), nw=Math.hypot(...w), r=10;
    const p1=[V[0]+u[0]/nu*r,V[1]+u[1]/nu*r], p3=[V[0]+w[0]/nw*r,V[1]+w[1]/nw*r], p2=[p1[0]+w[0]/nw*r,p1[1]+w[1]/nw*r];
    s+=`<path d="M${p1[0].toFixed(1)} ${p1[1].toFixed(1)} L${p2[0].toFixed(1)} ${p2[1].toFixed(1)} L${p3[0].toFixed(1)} ${p3[1].toFixed(1)}" class="thin"/>`; });
  Object.entries(o.lab||{}).forEach(([n,[dx,dy]])=>{ const [x,y]=s0(P[n]); s+=T(x+dx,y+dy,n,"font-size:16px;font-weight:600"); });
  (o.txt||[]).forEach(([p,t,dx=0,dy=0,st=""])=>{ const [x,y]=s0(g(p)); s+=T(x+dx,y+dy,t,`fill:var(--c);font-weight:700;${st}`); });
  (o.call||[]).forEach(([p,t,dx,dy,col="var(--ink)"])=>{ const [x,y]=s0(g(p)); s+=`<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="${(x+dx).toFixed(1)}" y2="${(y+dy).toFixed(1)}" style="stroke:${col};stroke-width:1.3"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" style="fill:${col}"/>`;
    s+=T(x+dx+(dx<0?-5:5),y+dy+5,t,`fill:${col};font-weight:700`,dx<0?"end":"start"); });
  return s+"</svg>";
}

/* pyramide à base rectangulaire a × b (b = profondeur), sommet au-dessus du centre de la base (ou d'un sommet : top="A") */
function pyrRect(a,b,h,o={}){
  const S = o.top==="A" ? [0,0,h] : [a/2,b/2,h], O=[a/2,b/2,0];
  const V={A:[0,0,0],B:[a,0,0],C:[a,b,0],D:[0,b,0],S};
  const k=o.k||Math.min(46, 190/Math.max(a+b*0.5,h+b*0.36));
  const E=[["A","B"],["B","C"],["C","D",1],["D","A",1],["S","A"],["S","B"],["S","C"],["S","D",1]];
  const t=[]; if(o.la) t.push([[a/2,0,0],o.la,0,24]); if(o.lb) t.push([[a,b/2,0],o.lb,30,10]); if(o.lh && o.top==="A") t.push([[0,0,h/2],o.lh,-30,0]);
  const call = o.lh && o.top!=="A" ? [[[a/2,b/2,h/2],o.lh,(a/2+b*0.25)*k+24,0,GRN]] : [];
  return sol({V, E, call, hgt:o.top==="A"?[]:[["S",O]], right:o.top==="A"?[["A","B","S"]]:[[O,[a,b/2,0],"S"]], F:[["A","B","C","D"]], lab:o.names?{A:[-10,16],B:[8,18],C:[12,4],D:[-12,-4],S:[0,-10]}:{}, txt:t, k, alt:o.alt||"Pyramide à base rectangulaire", w:o.w});
}
/* pyramide à base triangulaire rectangle en A : AB = a (largeur), AC = c (profondeur), hauteur SA = h */
function tetraA(a,c,h,o={}){
  const V={A:[0,0,0],B:[a,0,0],C:[0,c,0],S:[0,0,h]}, k=o.k||Math.min(42,200/Math.max(a+c*0.5,h+c*0.36));
  return sol({V, E:[["A","B",1],["A","C",1],["B","C"],["S","A",1],["S","B"],["S","C"]], F:[["A","B","C"]], right:[["A","B","C"],["A","B","S"]], lab:{A:[-12,14],B:[6,18],C:[12,4],S:[0,-10]},
    txt:o.t||[], k, alt:o.alt||"Pyramide SABC", w:o.w});
}
/* cube ABCDEFGH et tétraèdre ADCH */
function cubeTetra(c,lab){
  const V={A:[0,0,0],B:[c,0,0],C:[c,c,0],D:[0,c,0],E:[0,0,c],F:[c,0,c],G:[c,c,c],H:[0,c,c]};
  return sol({V, k:150/c/1.5*1.5, F:[["A","C","H"]], E:[["A","B"],["B","C"],["C","D",1],["D","A",1],["E","F"],["F","G"],["G","H"],["H","E"],["A","E"],["B","F"],["C","G"],["D","H",1],["A","C"],["A","H"],["C","H"]],
    lab:{A:[-10,16],B:[8,18],C:[14,6],D:[-12,-6],E:[-12,-4],F:[-8,-8],G:[10,-8],H:[0,-10]}, txt:[[[c/2,0,0],lab,0,24]], alt:"Cube ABCDEFGH et tétraèdre ADCH"});
}
/* cuve : cube d'arête c posé sur une pyramide régulière à base carrée de hauteur h (sommet en bas) */
function cuve(c,h,lc,lh){
  const V={A:[0,0,h+c],B:[c,0,h+c],C:[c,c,h+c],D:[0,c,h+c],E:[0,0,h],F:[c,0,h],G:[c,c,h],H:[0,c,h],S:[c/2,c/2,0]}, k=250/(h+c);
  const t=[[[0,0,h+c/2],lc,-30,5]];
  return sol({V, k, E:[["A","B"],["B","C"],["C","D"],["D","A"],["E","F"],["F","G"],["G","H",1],["H","E",1],["A","E"],["B","F"],["C","G"],["D","H",1],["S","E"],["S","F"],["S","G"],["S","H",1]],
    hgt:[["S",[c/2,c/2,h]]], call:[[[c/2,c/2,h*0.45],lh,-110,10,GRN]], lab:{A:[-12,-4],B:[4,-8],C:[10,-6],D:[-6,-10],E:[-12,8],F:[-14,16],G:[14,6],H:[-10,-8],S:[0,20]}, txt:t, alt:"Cuve : un cube posé sur une pyramide", padR:20});
}

/* ------------------------------------------------------------------
   Solides de révolution (dessin de face, base en ellipse)
------------------------------------------------------------------ */
const ell=(cx,cy,rx,ry,half,dash,st="")=>{ /* half : "f" devant (bas), "b" derrière (haut), "a" ellipse complète */
  if(half==="a") return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" class="${dash?"thin":"ln"}" style="${dash?"stroke-dasharray:6 5;":""}${st}"/>`;
  return `<path d="M${cx-rx} ${cy} A${rx} ${ry} 0 0 ${half==="f"?0:1} ${cx+rx} ${cy}" class="${dash?"thin":"ln"}" style="${dash?"stroke-dasharray:6 5;":""}${st}"/>`; };
const hgtL=(x,y1,y2)=>`<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" style="stroke:${GRN};stroke-width:2.2;stroke-dasharray:7 5"/>`;
const rA=(x,y)=>`<path d="M${x+10} ${y} L${x+10} ${y-10} L${x} ${y-10}" class="thin"/>`;
/* cône : r, h en unités ; lr, lh textes */
function cone(r,h,lr,lh,o={}){
  const k=o.k||Math.min(34, 150/Math.max(h,r*1.4)), R=r*k, H=h*k, ry=R*0.3, cx=Math.max(R+20,60), cy=H+30, W=cx+Math.max(R,R/2+90)+20, Ht=cy+ry+(lr?34:14);
  let s=`<svg class="fig" viewBox="0 0 ${W.toFixed(0)} ${Ht.toFixed(0)}" width="${W.toFixed(0)}" role="img" aria-label="${o.alt||"Cône de révolution"}">`;
  s+=`<ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${ry}" style="fill:${FILL};stroke:none"/>`;
  s+=ell(cx,cy,R,ry,"f")+ell(cx,cy,R,ry,"b",1)+ln([cx-R,cy],[cx,cy-H])+ln([cx+R,cy],[cx,cy-H])+hgtL(cx,cy-H,cy)+ln([cx,cy],[cx+R,cy],1)+rA(cx,cy);
  if(lh) s+=`<line x1="${cx}" y1="${cy-H/2}" x2="${cx+R/2+14}" y2="${cy-H/2}" style="stroke:${GRN};stroke-width:1.3"/>`+T(cx+R/2+18,cy-H/2+5,lh,`fill:${GRN};font-weight:700`,"start");
  if(lr) s+=T(cx+R/2,cy+ry+22,lr,"fill:var(--c);font-weight:700");
  return s+"</svg>";
}
/* tour : cylindre (rayon r, hauteur h1) surmonté d'un cône (hauteur h2) */
function tour(r,h1,h2,lr,l1,l2,o={}){
  const k=o.k||Math.min(16, 210/(h1+h2)), R=Math.max(r*k,26), H1=h1*k, H2=h2*k, ry=R*0.3, cx=R+30, top=24, cy1=top+H2, cy2=cy1+H1, W=cx+R+80, Ht=cy2+ry+34;
  let s=`<svg class="fig" viewBox="0 0 ${W.toFixed(0)} ${Ht.toFixed(0)}" width="${W.toFixed(0)}" role="img" aria-label="${o.alt||"Cylindre surmonté d'un cône"}">`;
  s+=`<rect x="${cx-R}" y="${cy1}" width="${2*R}" height="${H1}" style="fill:${FILL};stroke:none"/>`;
  s+=ln([cx-R,cy1],[cx,top])+ln([cx+R,cy1],[cx,top])+ell(cx,cy1,R,ry,"f")+ell(cx,cy1,R,ry,"b",1)+ln([cx-R,cy1],[cx-R,cy2])+ln([cx+R,cy1],[cx+R,cy2])+ell(cx,cy2,R,ry,"f")+ell(cx,cy2,R,ry,"b",1)+ln([cx,cy2],[cx+R,cy2],1);
  s+=hgtL(cx,top,cy2);
  s+=`<line x1="${cx+R+14}" y1="${top}" x2="${cx+R+14}" y2="${cy1}" class="thin"/><line x1="${cx+R+14}" y1="${cy1}" x2="${cx+R+14}" y2="${cy2}" class="thin"/>`;
  [top,cy1,cy2].forEach(y=>{ s+=`<line x1="${cx+R+8}" y1="${y}" x2="${cx+R+20}" y2="${y}" class="thin"/>`; });
  s+=T(cx+R+24,(top+cy1)/2+5,l2,"fill:var(--c);font-weight:700","start")+T(cx+R+24,(cy1+cy2)/2+5,l1,"fill:var(--c);font-weight:700","start")+T(cx+R/2,ry>=22?cy2+ry/2+6:cy2+ry+22,lr,"fill:var(--c);font-weight:700");   /* rayon écrit juste sous le rayon en pointillés quand il y a la place */
  return s+"</svg>";
}
/* tronc de cône (cavité de muffin) : grand cône R, H ; on retire le petit cône r, H − e ; e = hauteur du tronc */
function tronc(R,H,r,e,lD,lr,le,lH){
  const k=150/H, RR=R*k, HH=H*k, rr=r*k, E=e*k, ry=RR*0.28, ry2=rr*0.28, cx=RR+76, top=ry+38, yb=top+E, ys=top+HH, W=cx+RR+140, Ht=ys+20;
  let s=`<svg class="fig" viewBox="0 0 ${W.toFixed(0)} ${Ht.toFixed(0)}" width="${W.toFixed(0)}" role="img" aria-label="Tronc de cône">`;
  s+=`<path d="M${cx-RR} ${top} L${cx-rr} ${yb} L${cx+rr} ${yb} L${cx+RR} ${top} Z" style="fill:${FILL};stroke:none"/>`;
  s+=ell(cx,top,RR,ry,"a")+ln([cx-RR,top],[cx-rr,yb])+ln([cx+RR,top],[cx+rr,yb])+ell(cx,yb,rr,ry2,"f")+ell(cx,yb,rr,ry2,"b",1);
  s+=ln([cx-rr,yb],[cx,ys],1,"stroke:#888")+ln([cx+rr,yb],[cx,ys],1,"stroke:#888")+ln([cx-rr,yb],[cx,yb],1)+hgtL(cx,top,ys);
  s+=`<line x1="${cx-RR}" y1="${top-ry-12}" x2="${cx+RR}" y2="${top-ry-12}" class="thin"/>`+T(cx,top-ry-17,lD,"fill:var(--c);font-weight:700");
  s+=T(cx-rr-6,yb+5,lr,"fill:var(--c);font-weight:700","end");
  s+=`<line x1="${cx+RR+14}" y1="${top}" x2="${cx+RR+14}" y2="${yb}" class="thin"/>`+T(cx+RR+20,(top+yb)/2+5,le,"fill:var(--c);font-weight:700","start");
  s+=`<line x1="${cx+RR+70}" y1="${top}" x2="${cx+RR+70}" y2="${ys}" class="thin"/>`+T(cx+RR+76,(top+ys)/2+5,lH,"fill:var(--c);font-weight:700","start");
  [top,yb].forEach(y=>{ s+=`<line x1="${cx+RR+8}" y1="${y}" x2="${cx+RR+20}" y2="${y}" class="thin"/>`; }); [top,ys].forEach(y=>{ s+=`<line x1="${cx+RR+64}" y1="${y}" x2="${cx+RR+76}" y2="${y}" class="thin"/>`; });
  return s+"</svg>";
}
/* piscine vue de haut : rectangle ACFH (AC = L, AH = l) dont on coupe les coins C et F (BC = GF = a, CD = EF = b) */
function piscine(L,l,a,b,o={}){
  const k=Math.min(40, 380/L), X=x=>40+x*k, Y=y=>30+y*k, W=X(L)+44, H=Y(l)+34;
  const P={A:[0,0],B:[L-a,0],C:[L,0],D:[L,b],E:[L,l-b],F:[L,l],G:[L-a,l],H:[0,l]};
  const p=n=>[X(P[n][0]),Y(P[n][1])];
  let s=`<svg class="fig" viewBox="0 0 ${W.toFixed(0)} ${H.toFixed(0)}" width="${W.toFixed(0)}" role="img" aria-label="La piscine vue de haut">`;
  s+=`<polygon points="${["A","B","D","E","G","H"].map(n=>p(n).map(v=>v.toFixed(1)).join(",")).join(" ")}" style="fill:${FILL};stroke:var(--ink);stroke-width:2.4;stroke-linejoin:round"/>`;
  s+=ln(p("B"),p("C"),1)+ln(p("C"),p("D"),1)+ln(p("E"),p("F"),1)+ln(p("F"),p("G"),1);
  const tick=(m,n,cnt)=>{ const A=p(m), B=p(n), M=[(A[0]+B[0])/2,(A[1]+B[1])/2], hor=Math.abs(A[1]-B[1])<1; let t=""; for(let i=0;i<cnt;i++){ const d=(i-(cnt-1)/2)*5; t+=hor?`<line x1="${M[0]+d}" y1="${M[1]-7}" x2="${M[0]+d}" y2="${M[1]+7}" class="thin"/>`:`<line x1="${M[0]-7}" y1="${M[1]+d}" x2="${M[0]+7}" y2="${M[1]+d}" class="thin"/>`; } return t; };
  s+=tick("B","C",1)+tick("G","F",1)+tick("C","D",2)+tick("E","F",2);
  const off={A:[-12,-8],B:[0,-10],C:[12,-8],D:[16,5],E:[16,5],F:[12,18],G:[0,20],H:[-12,18]};
  Object.keys(P).forEach(n=>{ const [x,y]=p(n); s+=T(x+off[n][0],y+off[n][1],n,"font-size:16px;font-weight:600"); });
  return s+"</svg>";
}
/* pyramide étiquetée (vocabulaire) */
const PYR_VOC = (()=>{ const V={A:[0,0,0],B:[4,0,0],C:[4.6,3,0],D:[0.4,3,0],S:[2.2,1.5,4.2]}, O=[2.2,1.5,0];
  return sol({V, k:40, F:[["A","B","C","D"]], E:[["A","B"],["B","C"],["C","D",1],["D","A",1],["S","A"],["S","B"],["S","C"],["S","D",1]], hgt:[["S",O]], right:[[O,[4.3,1.5,0],"S"]],
    call:[["S","le sommet",60,-4],[[2.2,1.5,1.3],"la hauteur",-150,-30,GRN],[[2.4,1.3,0],"la base",-150,50],[[(4+4.6+2.2)/3,(0+3+1.5)/3,4.2/3],"une face latérale",90,-40]], alt:"Pyramide : le sommet, la hauteur, la base, une face latérale"}); })();

/* ------------------------------------------------------------------
   Tableau de conversion des volumes et des capacités
------------------------------------------------------------------ */
const UV=["km³","hm³","dam³","m³","dm³","cm³","mm³"], CAP={11:"kL",12:"hL",13:"daL",14:"L",15:"dL",16:"cL",17:"mL"};
const convTab = (rows=[]) => `<div class="scroll"><table class="std" style="text-align:center"><thead><tr>${UV.map(u=>`<th colspan="3">${u}</th>`).join("")}</tr></thead><tbody>
  <tr>${Array.from({length:21},(_,i)=>`<td style="${i%3===2?"border-right:2.5px solid var(--ink)":""}">${CAP[i]?`<b style="color:var(--c)">${CAP[i]}</b>`:""}</td>`).join("")}</tr>
  ${rows.map(r=>`<tr>${Array.from({length:21},(_,i)=>`<td style="${i%3===2?"border-right:2.5px solid var(--ink)":""}">${r[i]??""}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;

/* outils réutilisés par la fiche d'entraînement */
window.VOL10 = {sol, pyrRect, tetraA, cone, tour, tronc, piscine, cuve, cubeTetra, N, rd, U, fig, co, ex, convTab};

/* ===================== figures ===================== */
const F_EX1 = co("ex1.png","Pyramide à base carrée de côté 2,5 cm ; l'arête de 7 cm est perpendiculaire à la base",150);
const F_CUBE = cubeTetra(4,"4 cm");
const F_CUVE = cuve(2.5,3,"2,5 m","3 m");
const F_PISC = piscine(10,4,2,1.5);

/* ===================== schémas (rappels en image) ===================== */
const S_CONV = sch("Convertir des volumes", convTab()+`<p class="schN">Entre deux unités de volume qui se suivent : <b>× 1 000</b> ou <b>÷ 1 000</b> (3 colonnes).</p><p class="schN">1 L = 1 dm³ · 1 mL = 1 cm³ · 1 m³ = 1 000 L</p>`);
const S_PYR = sch("Volume d'une pyramide", `<div class="figs">${pyrRect(4,3,4,{k:30,la:"base",lh:"h"})}</div><p class="calc">V = {aire de la base × hauteur/3} = {B × h/3}</p>`);
const S_CONE = sch("Volume d'un cône", `<div class="figs">${cone(2,4,"r","h",{k:30})}</div><p class="calc">V = {π × r² × h/3}</p><p class="schN">La base est un disque : B = π × r².</p>`);
const S_INV = sch("Quand on connaît le volume", `<p class="calc">V = {B × h/3} &nbsp;donc&nbsp; h = {3 × V/B} &nbsp;et&nbsp; B = {3 × V/h}</p><p class="schN">Exemple : V = 200 cm³ et h = 12 cm, donc :</p><p class="calc">B = 3 × 200 ÷ 12<br>B = 50 cm²</p>`);
const S_COMP = sch("Solide composé", `<div class="figs">${tour(2,6,3,"r","h₁","h₂",{k:14})}</div><p class="schN">On découpe le solide en solides connus, on calcule chaque volume, puis on additionne (ou on soustrait).</p>`);

/* ---------- générateurs du QCM ---------- */
/* conversions : [valeur, unité de départ, unité d'arrivée] en puissances de 10 */
const PW={"km³":9,"hm³":6,"dam³":3,"m³":0,"dm³":-3,"cm³":-6,"mm³":-9,"kL":0,"hL":-1,"daL":-2,"L":-3,"dL":-4,"cL":-5,"mL":-6};
const conv=(v,a,b)=>rd(v*10**(PW[a]-PW[b]),9);
const qConv=(units,vals)=>{ for(let g=0;g<200;g++){ const [a,b]=shuf(units).slice(0,2), v=pick(vals), r=conv(v,a,b); if(PW[a]===PW[b]) continue; if(r>=1e7||r<0.0001) continue;
  return {q:`Convertis : ${N(v,6)} ${a} = ? ${b}`, rep:[N(r,6)], ex:`${PW[a]>PW[b]?`On multiplie par ${N(10**(PW[a]-PW[b]))}`:`On divise par ${N(10**(PW[b]-PW[a]))}`} : ${N(v,6)} ${a} = ${N(r,6)} ${b}.`, sx:S_CONV, kb:"text"}; }
  return {q:"Convertis : 3 m³ = ? dm³", rep:["3 000"], ex:"1 m³ = 1 000 dm³.", sx:S_CONV}; };

CH["4e-10"] = {
intro:"Convertir des volumes, calculer le volume d'une pyramide et d'un cône de révolution, et résoudre des problèmes de volumes.",
savoir:[
  "convertir des unités de volume et de capacité (1 L = 1 dm³) ;",
  "connaître le vocabulaire de la pyramide et du cône de révolution (base, sommet, hauteur) ;",
  "calculer le volume d'une pyramide : V = {B × h/3} ;",
  "calculer le volume d'un cône de révolution : V = {π × r² × h/3} ;",
  "retrouver une hauteur ou l'aire d'une base quand on connaît le volume ;",
  "calculer le volume d'un solide composé de solides usuels."
],

/* ===================== COURS ===================== */
cours:[
{k:"1", t:"Unités de volumes", h:`
  ${convTab()}
  <div class="retenir" data-l="À retenir"><p><b>1 L = 1 dm³</b></p><p>Dans le tableau, chaque unité de volume a <b>3 colonnes</b> : pour passer d'une unité de volume à la suivante, on multiplie (ou on divise) par <b>1 000</b>.</p><p>Donc 1 m³ = 1 000 L et 1 cm³ = 1 mL.</p></div>
  <p><b>Exemples de conversions :</b></p>
  <p class="calc">14,7 dm³ = 14 700 cm³ &nbsp;&nbsp;(1 dm³ = 1 000 cm³, donc 14,7 × 1 000)</p>
  <p class="calc">85 L = 85 dm³ = 0,085 m³ &nbsp;&nbsp;(85 ÷ 1 000)</p>
  <p class="calc">0,36 cm³ = 0,36 mL = 0,036 cL &nbsp;&nbsp;(1 cL = 10 mL, donc 0,36 ÷ 10)</p>`},
{k:"2", t:"Volume d'une pyramide", h:`
  <div class="retenir" data-l="Définition"><p>Une <b>pyramide</b> est un solide constitué :</p><p>– d'une <b>base</b> qui est un polygone ;</p><p>– et de faces latérales qui sont des triangles ayant un <b>sommet</b> commun.</p><p>La distance entre le sommet de la pyramide et sa base est appelée <b>la hauteur</b> de la pyramide.</p></div>
  <div class="figs">${co("pyr2.jpg","Une pyramide à base rectangulaire et une pyramide à base hexagonale",440)}${PYR_VOC}</div>
  <div class="retenir" data-l="Définition"><p>Le volume V d'une pyramide est :</p><p class="calc">V = {aire de la base × hauteur/3} = {B × h/3}</p><p>B est l'aire de la base et h est la hauteur de la pyramide.</p></div>
  <p><b>Exercice 1 :</b> calcule le volume de cette pyramide à base carrée.</p>${F_EX1}
  <details><summary>Voir la correction</summary><div class="corr"><p>La base est un carré de côté 2,5 cm :</p><p class="calc">B = 2,5 × 2,5<br>B = 6,25 cm²</p><p>L'arête de 7 cm est perpendiculaire à la base : c'est la hauteur, h = 7 cm.</p><p class="calc">V = {B × h/3}<br>V = {6,25 × 7/3}<br>V = {43,75/3}<br>V ≈ 14,58 cm³</p></div></details>
  <p><b>Exercice 2 :</b> ci-dessous, le tétraèdre ADCH est inscrit dans le cube ABCDEFGH qui a pour côté 4 cm.</p><p>Quel est le volume du tétraèdre en cm³ ?</p>${F_CUBE}
  <details><summary>Voir la correction</summary><div class="corr"><p>On prend pour base le triangle ADC, rectangle en D :</p><p class="calc">B = 4 × 4 ÷ 2<br>B = 8 cm²</p><p>La hauteur correspondante est l'arête [DH], perpendiculaire à la base : h = 4 cm.</p><p class="calc">V = {B × h/3}<br>V = {8 × 4/3}<br>V = {32/3}<br>V ≈ 10,67 cm³</p></div></details>`},
{k:"3", t:"Volume du cône de révolution", h:`
  <div class="retenir" data-l="Définition"><p>Un <b>cône de révolution</b> est un solide constitué :</p><p>– d'une <b>base</b> en forme de disque ;</p><p>– d'une surface latérale définie par une portion de disque, aussi appelée secteur circulaire.</p></div>
  ${co("cone.png","Cône de révolution : le sommet S, une génératrice, la hauteur, le disque de base",340)}
  <p><b>Remarque :</b> un cône de révolution est obtenu en faisant tourner un triangle rectangle autour de l'un des côtés de son angle droit.</p>
  <div class="retenir" data-l="Définition"><p>Le volume V d'un cône de révolution est :</p><p class="calc">V = {aire de la base × hauteur/3} = {π × r² × h/3}</p><p>r est le rayon du disque de base et h est la hauteur du cône.</p></div>
  <p><b>Exercice :</b> combien de champagne, en cL, puis-je mettre dans cette flûte ?</p>${co("flute.png","Flûte à champagne : diamètre 55 mm, hauteur totale 165 mm, pied de 20 mm",170)}
  <details><summary>Voir la correction</summary><div class="corr"><p>Le champagne remplit un cône (on ne compte pas le pied).</p><p>Hauteur du cône :</p><p class="calc">h = 165 − 20<br>h = 145 mm<br>h = 14,5 cm</p><p>Rayon :</p><p class="calc">r = 55 ÷ 2<br>r = 27,5 mm<br>r = 2,75 cm</p><p class="calc">V = {π × 2,75² × 14,5/3}<br>V ≈ 114,83 cm³</p><p>1 cm³ = 1 mL, donc :</p><p class="calc">V ≈ 114,83 mL<br>V ≈ 11,5 cL</p><p>On peut mettre environ <b>11,5 cL</b> de champagne dans cette flûte.</p></div></details>`},
{k:"4", t:"Formulaire : périmètres, aires et volumes", h:`
  <h4>Périmètres et aires</h4>
  <p>Le <b>périmètre</b> d'une figure correspond à la longueur de son contour.</p><p>L'<b>aire</b> d'une figure correspond à la mesure de sa surface.</p>
  <div class="retenir" data-l="Formulaire"><div class="scroll"><table class="std"><thead><tr><th>Figure</th><th>Périmètre</th><th>Aire</th></tr></thead><tbody>
   <tr><th>Carré de côté c</th><td>4 × c</td><td>c × c</td></tr>
   <tr><th>Rectangle de longueur L et de largeur l</th><td>2 × (L + l)</td><td>L × l</td></tr>
   <tr><th>Cercle – disque de rayon r</th><td>Périmètre du cercle : 2 × π × r</td><td>Aire du disque : π × r × r</td></tr>
   <tr><th>Triangle quelconque (côtés a, b, c ; hauteur h relative à la base b)</th><td>a + b + c</td><td>{b × h/2}</td></tr>
   <tr><th>Triangle rectangle (côtés de l'angle droit a et b)</th><td>somme des trois côtés</td><td>{a × b/2}</td></tr>
  </tbody></table></div></div>
  <h4>Volumes</h4>
  <div class="retenir" data-l="Formulaire"><div class="scroll"><table class="std"><thead><tr><th>Solide</th><th>Volume</th><th>Formule générale</th></tr></thead><tbody>
   <tr><th>Cube d'arête c</th><td>c × c × c</td><td rowspan="4">V = B × h<br>(aire de la base × hauteur)</td></tr>
   <tr><th>Pavé droit</th><td>L × l × h</td></tr>
   <tr><th>Prisme droit</th><td>aire de la base × hauteur</td></tr>
   <tr><th>Cylindre de révolution</th><td>π × r × r × h</td></tr>
   <tr><th>Pyramide</th><td>{aire de la base × hauteur/3}</td><td rowspan="2">V = {B × h/3}</td></tr>
   <tr><th>Cône de révolution</th><td>{π × r × r × h/3}</td></tr>
  </tbody></table></div></div>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Rappels : unités de volume et conversions", e:[
  {n:"Activité 1", t:"Différentes tailles de sac poubelle", w:"Sur ton cahier", h:`<div class="figs">${ex("poubelle.png","Poubelle cylindrique",110)}</div>
   <p>Mathilde vient d'acheter une poubelle de forme cylindrique.</p><p>Sa hauteur est 55 cm et son diamètre est 26,5 cm.</p><p>Elle hésite sur la capacité des sacs-poubelles à mettre à l'intérieur.</p><p>Doit-elle choisir des sacs de 10 L, 30 L ou 50 L ?</p>`,
   c:`<p>Rayon : 26,5 ÷ 2 = 13,25 cm.</p><p class="calc">V = π × r² × h<br>V = π × 13,25² × 55<br>V ≈ 30 335 cm³</p><p>1 L = 1 dm³ = 1 000 cm³, donc V ≈ 30,3 L.</p><p>Elle doit choisir des <b>sacs de 30 L</b> (10 L est trop petit, 50 L est beaucoup trop grand).</p>`},
  {n:"Exercice 1", t:"Conversions", w:"Sur ta feuille", h:`<p><b>Partie 1</b></p><p>a) 45 m³ = ………… dm³</p><p>b) 3,1 m³ = ………… dm³</p><p>c) 500 dm³ = ………… m³</p><p>d) 0,0053 m³ = ………… dm³</p><p>e) 48,5 dm³ = ………… m³</p><p>f) 5,67 cm³ = ………… mm³</p><p>g) 78 dam³ = ………… m³</p><p>h) 0,00024 m³ = ………… cm³</p><p>i) 86 cm³ = ………… dm³</p>
   <p><b>Partie 2</b></p><p>a) 86 dm³ = ………… L</p><p>b) 4 m³ = ………… L</p><p>c) 500 cm³ = ………… L</p><p>d) 63 L = ………… m³</p><p>e) 7 854 cm³ = ………… L</p><p>f) 3 000 cm³ = ………… mL</p><p>g) 12,5 hL = ………… cm³</p><p>h) 0,73 dL = ………… dm³</p><p>i) 25 cm³ = ………… L</p>`,
   c:`<p><b>Partie 1</b> (1 m³ = 1 000 dm³ ; 1 dm³ = 1 000 cm³ ; 1 cm³ = 1 000 mm³ ; 1 dam³ = 1 000 m³)</p><p>a) 45 × 1 000 = 45 000 : 45 m³ = <b>45 000 dm³</b> · b) 3,1 × 1 000 = 3 100 : 3,1 m³ = <b>3 100 dm³</b> · c) 500 ÷ 1 000 = 0,5 : 500 dm³ = <b>0,5 m³</b> · d) 0,0053 × 1 000 = 5,3 : 0,0053 m³ = <b>5,3 dm³</b> · e) 48,5 ÷ 1 000 = 0,0485 : 48,5 dm³ = <b>0,0485 m³</b> · f) 5,67 × 1 000 = 5 670 : 5,67 cm³ = <b>5 670 mm³</b> · g) 78 × 1 000 = 78 000 : 78 dam³ = <b>78 000 m³</b> · h) 1 m³ = 1 000 000 cm³ et 0,00024 × 1 000 000 = 240 : 0,00024 m³ = <b>240 cm³</b> · i) 86 ÷ 1 000 = 0,086 : 86 cm³ = <b>0,086 dm³</b></p>
   <p><b>Partie 2</b> (1 L = 1 dm³ ; 1 m³ = 1 000 L ; 1 cm³ = 1 mL)</p><p>a) 1 dm³ = 1 L : 86 dm³ = <b>86 L</b> · b) 4 × 1 000 = 4 000 : 4 m³ = <b>4 000 L</b> · c) 500 cm³ = 0,5 dm³ (500 ÷ 1 000) : 500 cm³ = <b>0,5 L</b> · d) 63 L = 63 dm³ et 63 ÷ 1 000 = 0,063 : 63 L = <b>0,063 m³</b> · e) 7 854 cm³ = 7,854 dm³ (7 854 ÷ 1 000) : 7 854 cm³ = <b>7,854 L</b> · f) 1 cm³ = 1 mL : 3 000 cm³ = <b>3 000 mL</b> · g) 1 hL = 100 L : 12,5 hL = 1 250 L = 1 250 dm³ = <b>1 250 000 cm³</b> (1 250 × 1 000) · h) 1 L = 10 dL : 0,73 dL = 0,073 L = <b>0,073 dm³</b> · i) 25 cm³ = 25 mL et 1 L = 1 000 mL : 25 cm³ = <b>0,025 L</b></p>`},
  {n:"Exercice 2", t:"Un intrus", w:"Sur ton cahier", h:`<p>Parmi la liste de volumes suivante, il y a un intrus ! Retrouve-le.</p>
   <p class="calc">380 000 dm³ &nbsp;·&nbsp; 3 800 000 dL &nbsp;·&nbsp; 0,380 dam³ &nbsp;·&nbsp; 380 m³ &nbsp;·&nbsp; 380 000 L &nbsp;·&nbsp; 3 800 000 cm³</p>`,
   c:`<p>On convertit tout en m³ :</p><p>380 000 dm³ = 380 m³ · 3 800 000 dL = 380 000 L = 380 m³ · 0,380 dam³ = 380 m³ · 380 000 L = 380 m³</p><p>Mais 3 800 000 cm³ = 3 800 dm³ = 3,8 m³.</p><p>L'intrus est <b>3 800 000 cm³</b>.</p>`},
  {n:"Exercice 3", t:"Grandeurs égales", w:"Sur ta feuille", h:`<p>Trouve un chemin qui permet d'aller de A à B en reliant les bulles correspondant à des grandeurs égales.</p>${ex("chemin.png","Réseau de bulles de A (72 dm³) à B (72 000 cm³)",560)}`,
   c:`<p>72 dm³ = 72 L = 0,072 m³ = 720 dL = 72 000 mL = 72 000 cm³.</p><p>Les autres bulles ne conviennent pas : 7,2 m³ = 7 200 L ; 7,2 cm³ = 0,0072 L ; 72 dL = 7,2 L ; 720 cL = 7,2 L.</p>
   <p>Un chemin : <b>72 dm³ → 0,072 m³ → 72 L → 720 dL → 72 000 cm³</b> (on peut aussi passer par 72 000 mL avant d'arriver en B).</p>`},
  {n:"Exercice 4", t:"Capacité d'une casserole", w:"Sur ton cahier", h:`${ex("casserole.png","Casserole : diamètre 14 cm, hauteur 7 cm, contenance 1 L",250)}<p>Les indications données pour cette casserole de forme cylindrique sont-elles cohérentes ?</p>`,
   c:`<p>Rayon : 14 ÷ 2 = 7 cm ; hauteur : 7 cm.</p><p class="calc">V = π × 7² × 7<br>V = 343 × π<br>V ≈ 1 077,6 cm³</p><p>1 000 cm³ = 1 L, donc V ≈ 1,08 L.</p><p>La casserole remplie jusqu'au bord contient environ 1,08 L : une contenance de 1 L est <b>cohérente</b> (on ne la remplit pas jusqu'au bord).</p>`}
 ]},
{t:"Révisions : pavé droit, prisme droit et cylindre", e:[
  {n:"Exercice 5", t:"Une plaquette de beurre", w:"Sur ton cahier", h:`${ex("beurre.png","Plaquette de beurre",200)}<p>Une plaquette de beurre a pour longueur 11,5 cm, pour largeur 6,5 cm et pour hauteur 4 cm.</p><p>Quel est le volume d'une plaquette de beurre en cm³ ?</p>`,
   c:`<p>La plaquette est un pavé droit.</p><p class="calc">V = L × l × h<br>V = 11,5 × 6,5 × 4<br>V = 299 cm³</p>`},
  {n:"Exercice 6", t:"Une tente", w:"Sur ton cahier", h:`${ex("tente.png","Tente en forme de prisme droit : base triangulaire de 1,20 m et de hauteur 0,90 m, longueur 2,10 m",180)}<p>Cette tente a la forme d'un prisme droit.</p><p>Calcule son volume.</p>`,
   c:`<p>La base est un triangle de base 1,20 m et de hauteur 0,90 m :</p><p class="calc">B = 1,20 × 0,90 ÷ 2<br>B = 0,54 m²</p><p>La hauteur du prisme est 2,10 m :</p><p class="calc">V = B × h<br>V = 0,54 × 2,10<br>V = 1,134 m³</p>`},
  {n:"Exercice 7", t:"Le château d'eau de Luçon", w:"Sur ton cahier", h:`<p>Le château d'eau de Luçon est assimilé à un cylindre de diamètre 5 m et de hauteur 25 m.</p><p>Combien de litres d'eau peut contenir ce château d'eau ? Arrondis au centième près.</p>`,
   c:`<p>Rayon : 5 ÷ 2 = 2,5 m.</p><p class="calc">V = π × 2,5² × 25<br>V = 156,25 × π<br>V ≈ 490,873 85 m³</p><p>1 m³ = 1 000 L, donc le château d'eau peut contenir environ <b>490 873,85 L</b>.</p>`},
  {n:"Exercice 8", t:"La piscine de Sylvia", w:"Sur ton cahier", h:`<div class="figs">${ex("piscine.png","La piscine en perspective",300)}${fig("La piscine vue de haut (partie colorée)",F_PISC)}</div>
   <p>Combien de litres d'eau Sylvia doit-elle mettre dans sa piscine, si elle veut une hauteur d'eau de 1,60 m ?</p><p><b>Données :</b> ACFH est un rectangle ; AC = 10 m ; AH = 4 m ; BC = 2 m ; CD = 1,5 m.</p>`,
   c:`<p>La piscine est un prisme droit : sa base est le rectangle ACFH auquel on enlève les deux triangles rectangles BCD et EFG.</p>
   <p class="calc">Aire de ACFH : 10 × 4 = 40 m²<br>Aire d'un triangle : 2 × 1,5 ÷ 2 = 1,5 m²<br>Aire de la base : 40 − 2 × 1,5 = 37 m²</p>
   <p class="calc">V = 37 × 1,60<br>V = 59,2 m³</p><p>1 m³ = 1 000 L : Sylvia doit mettre <b>59 200 L</b> d'eau.</p>`}
 ]},
{t:"Volumes de la pyramide et du cône", e:[
  {n:"Exercice 9", t:"Baraque à frites", w:"Sur ton cahier", h:`<p>Michel vend ses frites dans des cornets de forme conique alors que chez Léon, les cornets ont la forme d'une pyramide à base carrée.</p>${ex("frites.png","Cornet conique de diamètre 12 cm et cornet pyramidal à base carrée de côté 11 cm, tous les deux de hauteur 13 cm",400)}<p>Quel est le cornet de frites de plus grand volume ?</p>`,
   c:`<p><b>Chez Michel</b> (cône) : rayon 12 ÷ 2 = 6 cm, hauteur 13 cm.</p><p class="calc">V = {π × 6² × 13/3}<br>V = 156 × π<br>V ≈ 490,1 cm³</p>
   <p><b>Chez Léon</b> (pyramide) : base carrée de côté 11 cm, hauteur 13 cm.</p><p class="calc">B = 11 × 11<br>B = 121 cm²</p><p class="calc">V = {121 × 13/3}<br>V = {1 573/3}<br>V ≈ 524,3 cm³</p><p>Le cornet de <b>Léon</b> a le plus grand volume.</p>`},
  {n:"Exercice 10", t:"Tétraèdre", w:"Sur ton cahier", h:`${ex("tetra.png","Tétraèdre SABC : le triangle ABC est rectangle en A et [SA] est perpendiculaire à la base",220)}<p><b>Données :</b> AB = 2 cm ; AC = 4,8 cm ; SA = 9 cm.</p><p>Quel est le volume du tétraèdre en cm³ ?</p>`,
   c:`<p>La base est le triangle ABC, rectangle en A :</p><p class="calc">B = {AB × AC/2}<br>B = {2 × 4,8/2}<br>B = 4,8 cm²</p><p>La hauteur est SA = 9 cm (le codage montre que [SA] est perpendiculaire à la base).</p><p class="calc">V = {B × h/3}<br>V = {4,8 × 9/3}<br>V = 14,4 cm³</p>`},
  {n:"Exercice 11", t:"Un berlingot de lait concentré", w:"Sur ton cahier", h:`${ex("berlingot.png","Berlingot de lait en forme de pyramide",180)}<p>Un berlingot de lait concentré a la forme d'une pyramide régulière SABCD à base carrée de 5 cm de côté et de hauteur 3 cm.</p><p>Combien de berlingots vais-je pouvoir préparer avec 1 L de lait concentré ?</p>`,
   c:`<p class="calc">V = {5 × 5 × 3/3}<br>V = 25 cm³</p><p>1 L = 1 dm³ = 1 000 cm³ et 1 000 ÷ 25 = 40.</p><p>Je pourrai préparer <b>40 berlingots</b>.</p>`},
  {n:"Exercice 12", t:"Une tour", w:"Sur ton cahier", h:`${ex("tour.png","Tour : cylindre de rayon 2,5 m et de hauteur 10 m surmonté d'un cône de hauteur 5 m",100)}<p>Cette tour cylindrique est surmontée d'un toit conique.</p><p>Donne le volume de cette tour en m³. Donne un arrondi au centième.</p>`,
   c:`<p><b>Le cylindre</b> : rayon 2,5 m, hauteur 10 m.</p><p class="calc">V₁ = π × 2,5² × 10<br>V₁ = 62,5 × π<br>V₁ ≈ 196,35 m³</p><p><b>Le cône</b> : rayon 2,5 m, hauteur 5 m.</p><p class="calc">V₂ = {π × 2,5² × 5/3}<br>V₂ ≈ 32,72 m³</p>
   <p class="calc">V = V₁ + V₂<br>V ≈ 229,07 m³</p><p>Le volume de la tour est environ <b>229,07 m³</b>.</p>`},
  {n:"Exercice 13", t:"Des muffins", w:"Sur ton cahier", h:`<div class="figs">${ex("moule.png","Moule à 9 muffins",200)}${ex("muffin.png","Tronc de cône : diamètre 7,5 cm en haut, rayon 2,5 cm en bas, hauteur 4 cm ; cône complet de hauteur 12 cm",190)}</div>
   <p>Un moule à muffins est constitué de 9 cavités identiques.</p><p>Elles ont la forme d'un tronc de cône (cône coupé par un plan parallèle à sa base) représenté ci-dessus.</p><p>Pour cuisiner des muffins, Léa a préparé 1 litre de pâte.</p><p>A-t-elle suffisamment de pâte pour remplir entièrement les 9 cavités du moule ?</p>`,
   c:`<p>Le tronc de cône est un grand cône auquel on enlève un petit cône.</p><p><b>Grand cône</b> : rayon 7,5 ÷ 2 = 3,75 cm, hauteur 12 cm.</p><p class="calc">V₁ = {π × 3,75² × 12/3}<br>V₁ = 56,25 × π<br>V₁ ≈ 176,71 cm³</p>
   <p><b>Petit cône</b> : rayon 2,5 cm, hauteur 12 − 4 = 8 cm.</p><p class="calc">V₂ = {π × 2,5² × 8/3}<br>V₂ ≈ 52,36 cm³</p>
   <p class="calc">Une cavité : V₁ − V₂ ≈ 124,35 cm³</p><p>Pour les 9 cavités :</p><p class="calc">V = 9 × 124,35<br>V ≈ 1 119 cm³<br>V ≈ 1,12 L</p><p>1,12 L &gt; 1 L : <b>non</b>, Léa n'a pas assez de pâte pour remplir entièrement les 9 cavités.</p>`},
  {n:"Exercice 14", t:"Récolte de blé", w:"Sur ton cahier", h:`<p>Un agriculteur vient de récolter son blé. Il a rempli sa remorque entièrement à 13 reprises et souhaite déposer son grain dans son silo à grain.</p>
   <p><b>Document 1 :</b> dimensions de la remorque.</p><p>l = 2,20 m ; L = 7,50 m ; h = 2,10 m</p>${ex("remorque.png","Tracteur et remorque",300)}
   <p><b>Document 2 :</b> caractéristiques du silo. Le silo à grain est formé :</p><p>– d'un cylindre de 4 m de rayon et d'une hauteur égale à 8 m ;</p><p>– d'un cône de rayon 4 m et de 2,5 m de hauteur.</p>${ex("silo.png","Silo à grain : un cylindre posé sur un cône",130)}
   <p>Aura-t-il suffisamment de place dans son silo pour stocker son grain ?</p><p><i>On considérera que le blé récolté occupe exactement le volume de la remorque. Le blé ne dépassera donc pas la hauteur de la remorque.</i></p>`,
   c:`<p><b>Le blé</b> : une remorque contient 2,20 × 7,50 × 2,10 = 34,65 m³.</p><p class="calc">13 × 34,65 = 450,45 m³</p>
   <p><b>Le silo</b> :</p><p>Cylindre :</p><p class="calc">V₁ = π × 4² × 8<br>V₁ = 128 × π<br>V₁ ≈ 402,12 m³</p><p>Cône :</p><p class="calc">V₂ = {π × 4² × 2,5/3}<br>V₂ ≈ 41,89 m³</p><p class="calc">Silo : 402,12 + 41,89 ≈ 444,01 m³</p>
   <p>444,01 m³ &lt; 450,45 m³ : <b>non</b>, il n'aura pas assez de place pour stocker tout son grain.</p>`},
  {n:"Exercice 15", t:"Quand on connaît le volume !", w:"Sur ton cahier", h:`<p><b>1)</b> Cette sculpture de Ruth Francken est une pyramide d'un volume égal à 11 026 cm³. Elle est posée sur sa base, un triangle équilatéral d'aire 894 cm².</p><p>Quelle est la hauteur de la sculpture ?</p>
   <p><b>2)</b> Un cône de révolution a un volume de 200 cm³ et sa hauteur mesure 12 cm.</p><p>Quelle est l'aire de sa base ?</p>`,
   c:`<p><b>1)</b> V = {B × h/3}, donc 3 × V = B × h et h = {3 × V/B}.</p><p class="calc">h = {3 × 11 026/894}<br>h = {33 078/894}<br>h = 37 cm</p><p>La sculpture mesure <b>37 cm</b> de haut.</p>
   <p><b>2)</b> De même, B = {3 × V/h}.</p><p class="calc">B = {3 × 200/12}<br>B = {600/12}<br>B = 50 cm²</p><p>L'aire de sa base est <b>50 cm²</b>.</p>`}
 ]},
{t:"Pour les plus rapides", e:[
  {n:"Exercice 16", t:"Cuboctaèdre", w:"Sur ton cahier", h:`${ex("cubocta.png","Cuboctaèdre dans un cube",220)}<p>Ce solide (appelé cuboctaèdre) a été obtenu en retirant d'un cube d'arête 6 cm huit pyramides identiques.</p><p>Calcule le volume du cuboctaèdre.</p>`,
   c:`<p>Chaque pyramide retirée est dans un coin du cube : ses trois arêtes issues du coin mesurent 6 ÷ 2 = 3 cm et sont perpendiculaires deux à deux.</p>
   <p class="calc">Base (triangle rectangle) : 3 × 3 ÷ 2 = 4,5 cm²<br>Une pyramide : {4,5 × 3/3} = 4,5 cm³<br>Huit pyramides : 8 × 4,5 = 36 cm³</p>
   <p class="calc">Cube : 6 × 6 × 6 = 216 cm³<br>Cuboctaèdre : 216 − 36 = 180 cm³</p><p>Le volume du cuboctaèdre est <b>180 cm³</b>.</p>`},
  {n:"Exercice 17", t:"Une cuve", w:"Sur ton cahier", h:`${F_CUVE}<p>Une cuve a la forme ci-contre.</p><p>Sa partie supérieure est un cube de 2,5 m d'arête.</p><p>Sa partie inférieure est une pyramide régulière à base carrée de 3 m de hauteur.</p><p>La cuve contient 17 500 L d'eau.</p><p>À quelle distance du bord supérieur se trouve le niveau d'eau ?</p>`,
   c:`<p>Pyramide :</p><p class="calc">V₁ = {2,5 × 2,5 × 3/3}<br>V₁ = 6,25 m³<br>V₁ = 6 250 L</p><p>Cube :</p><p class="calc">V₂ = 2,5 × 2,5 × 2,5<br>V₂ = 15,625 m³<br>V₂ = 15 625 L</p>
   <p>La pyramide est pleine : il reste 17 500 − 6 250 = 11 250 L d'eau dans le cube.</p><p>Il reste vide dans le cube un volume V :</p><p class="calc">V = 15 625 − 11 250<br>V = 4 375 L<br>V = 4,375 m³</p>
   <p>Cette partie vide est un pavé droit de base 2,5 × 2,5 = 6,25 m² :</p><p>La hauteur vide h :</p><p class="calc">h = 4,375 ÷ 6,25<br>h = 0,7 m</p><p>Le niveau d'eau est à <b>0,7 m (70 cm)</b> du bord supérieur.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Conversions de volumes", schema:S_CONV, q:{
 1:[ {g:()=>qConv(["m³","dm³","cm³"],[2,3.5,45,0.8,12,0.25,7])},
     {g:()=>{ const v=pick([2,3,5,8,12,25,40,1.5,0.5]); return {q:`${N(v)} dm³ = ? L`, rep:[N(v)], ex:"1 dm³ = 1 L.", sx:S_CONV}; }} ],
 2:[ {g:()=>qConv(["m³","L","cm³","dm³","mL"],[4,63,500,1.2,86,7854,0.75])},
     {g:()=>{ const v=pick([1,2,3,5,1.5,2.5,0.4]); return {q:`${N(v)} m³ = ? L`, c:shuf(uniq(N(v*1000)+" L",[N(v*100)+" L",N(v*10)+" L",N(v*1e6)+" L"])), rep:N(v*1000)+" L", ex:"1 m³ = 1 000 dm³ = 1 000 L.", sx:S_CONV}; }} ],
 3:[ {g:()=>qConv(["hL","dL","cL","cm³","m³","dm³"],[12.5,0.73,25,350,3,48])},
     {g:()=>{ const v=pick([380,45,72,1.2,6]); const ok=[[v*1000,"dm³"],[v*1000,"L"],[v*10000,"dL"],[v/1000,"dam³"]], bad=pick([[v*1e5,"cm³"],[v*100,"L"],[v,"dm³"]]);
       const list=shuf([...shuf(ok).slice(0,3),bad]).map(([x,u])=>N(x,6)+" "+u); const b=N(bad[0],6)+" "+bad[1];
       return {q:`Ces volumes sont égaux à ${N(v)} m³, sauf un : lequel ?`, c:list, rep:b, ex:`${b} ne vaut pas ${N(v)} m³ (on a ${N(v)} m³ = ${N(v*1000)} L = ${N(v*1e6)} cm³).`, sx:S_CONV}; }} ]
}},
{nom:"Volume d'une pyramide", schema:S_PYR, q:{
 1:[ {q:"La formule du volume d'une pyramide (B : aire de la base, h : hauteur) est :", c:["V = {B × h/3}","V = B × h","V = {B × h/2}","V = 3 × B × h"], rep:"V = {B × h/3}", ex:"Le volume d'une pyramide est le tiers du volume du prisme de même base et de même hauteur.", sx:S_PYR},
     {g:()=>{ let B,h; do{ B=pick([12,15,18,20,24,30,36,45]); h=ri(2,12); }while((B*h)%3); return {q:`Une pyramide a une base d'aire ${B} cm² et une hauteur de ${h} cm. Quel est son volume (en cm³) ?`, rep:U(N(B*h/3),"cm³"), ex:`<br>V = {${B} × ${h}/3}<br>V = {${B*h}/3}<br>V = ${N(B*h/3)} cm³`, sx:S_PYR}; }} ],
 2:[ {g:()=>{ let a,h; do{ a=ri(2,9); h=ri(2,15); }while((a*a*h)%3); return {q:`Une pyramide a pour base un carré de côté ${a} cm et pour hauteur ${h} cm. Quel est son volume (en cm³) ?`, fig:pyrRect(a,a,h,{la:a+" cm",lh:h+" cm",w:260}), rep:U(N(a*a*h/3),"cm³"), ex:`<br>B = ${a} × ${a}<br>B = ${a*a} cm²<br>V = {${a*a} × ${h}/3}<br>V = ${N(a*a*h/3)} cm³`, sx:S_PYR}; }},
     {g:()=>{ let a,b,h; do{ a=ri(3,9); b=ri(2,7); h=ri(3,12); }while((a*b*h)%3||a===b); return {q:`Une pyramide a pour base un rectangle de ${a} cm sur ${b} cm et pour hauteur ${h} cm. Quel est son volume (en cm³) ?`, fig:pyrRect(a,b,h,{la:a+" cm",lb:b+" cm",lh:h+" cm",w:280}), rep:U(N(a*b*h/3),"cm³"), ex:`<br>B = ${a} × ${b}<br>B = ${a*b} cm²<br>V = {${a*b} × ${h}/3}<br>V = ${N(a*b*h/3)} cm³`, sx:S_PYR}; }} ],
 3:[ {g:()=>{ let a,c,h; do{ a=ri(2,8); c=ri(2,8); h=ri(3,12); }while((a*c*h)%6); return {q:`SABC est une pyramide : ABC est rectangle en A, AB = ${a} cm, AC = ${c} cm et la hauteur SA mesure ${h} cm. Quel est son volume (en cm³) ?`, fig:tetraA(a,c,h,{w:240}), rep:U(N(a*c*h/6),"cm³"), ex:`<br>B = {${a} × ${c}/2}<br>B = ${N(a*c/2)} cm²<br>V = {${N(a*c/2)} × ${h}/3}<br>V = ${N(a*c*h/6)} cm³`, sx:S_PYR}; }},
     {g:()=>{ const c=pick([3,6,9,12]); return {q:`Le tétraèdre ADCH est inscrit dans un cube ABCDEFGH d'arête ${c} cm. Quel est son volume (en cm³) ?`, fig:cubeTetra(c,c+" cm"), rep:U(N(c**3/6),"cm³"), ex:`Base ADC : ${c} × ${c} ÷ 2 = ${N(c*c/2)} cm² ; hauteur DH = ${c} cm.<br>V = {${N(c*c/2)} × ${c}/3}<br>V = ${N(c**3/6)} cm³`, sx:S_PYR}; }} ]
}},
{nom:"Volume d'un cône", schema:S_CONE, q:{
 1:[ {q:"La formule du volume d'un cône de révolution de rayon r et de hauteur h est :", c:["V = {π × r² × h/3}","V = π × r² × h","V = {π × r × h/3}","V = 2 × π × r × h"], rep:"V = {π × r² × h/3}", ex:"La base est un disque d'aire π × r², et on divise par 3 comme pour la pyramide.", sx:S_CONE},
     {q:"Un cône de révolution est obtenu en faisant tourner…", c:["un triangle rectangle autour d'un côté de son angle droit","un rectangle autour d'un de ses côtés","un disque autour d'un diamètre"], rep:"un triangle rectangle autour d'un côté de son angle droit", ex:"C'est la remarque du cours.", sx:S_CONE} ],
 2:[ {g:()=>{ const r=ri(2,9), h=ri(3,15), v=Math.PI*r*r*h/3; return {q:`Un cône de révolution a un rayon de ${r} cm et une hauteur de ${h} cm. Quel est son volume, arrondi à l'unité (en cm³) ?`, fig:cone(r,h,r+" cm",h+" cm",{w:240}), rep:U(N(v,0),"cm³"), ex:`<br>V = {π × ${r}² × ${h}/3}<br>V ≈ ${N(v,2)}<br>V ≈ ${N(v,0)} cm³`, sx:S_CONE}; }} ],
 3:[ {g:()=>{ const d=pick([4,6,8,10,12]), h=ri(6,15), r=d/2, v=Math.PI*r*r*h/3; return {q:`Un cône a un diamètre de ${d} cm et une hauteur de ${h} cm. Quel est son volume, arrondi à l'unité (en cm³) ?`, c:shuf(uniq(N(v,0)+" cm³",[N(Math.PI*d*d*h/3,0)+" cm³",N(Math.PI*r*r*h,0)+" cm³",N(Math.PI*r*h/3,0)+" cm³"])), rep:N(v,0)+" cm³", ex:`Attention : le rayon est ${d} ÷ 2 = ${r} cm.<br>V = {π × ${r}² × ${h}/3}<br>V ≈ ${N(v,0)} cm³`, sx:S_CONE}; }},
     {g:()=>{ const r=ri(2,5), h=ri(8,15), v=Math.PI*r*r*h/3; return {q:`Un verre conique a un rayon de ${r} cm et une hauteur de ${h} cm. Quelle est sa contenance, arrondie au dixième de cL ?`, rep:U(N(v/10,1),"cL"), ex:`(1 cL = 10 mL)<br>V = {π × ${r}² × ${h}/3}<br>V ≈ ${N(v,2)} cm³<br>V ≈ ${N(v,2)} mL<br>V ≈ ${N(v/10,1)} cL`, sx:S_CONE, kb:"text"}; }} ]
}},
{nom:"Quand on connaît le volume", schema:S_INV, q:{
 1:[ {g:()=>{ const B=pick([10,12,15,20,24,30,40]), h=ri(2,12), V=B*h/3; if(!Number.isInteger(V)) return {q:`Une pyramide a un volume de ${B*h} cm³ et une base d'aire ${B*3} cm². Quelle est sa hauteur (en cm) ?`, rep:U(String(h),"cm"), ex:`<br>h = {3 × ${B*h}/${B*3}}<br>h = ${h} cm`, sx:S_INV};
       return {q:`Une pyramide a un volume de ${V} cm³ et une base d'aire ${B} cm². Quelle est sa hauteur (en cm) ?`, rep:U(String(h),"cm"), ex:`<br>h = {3 × V/B}<br>h = {3 × ${V}/${B}}<br>h = {${3*V}/${B}}<br>h = ${h} cm`, sx:S_INV}; }} ],
 2:[ {g:()=>{ const h=pick([3,4,5,6,8,9,10,12,15]), B=ri(4,40), V=B*h/3; if(!Number.isInteger(V)) return {q:`Un cône a un volume de ${B*h} cm³ et une hauteur de ${3*h} cm. Quelle est l'aire de sa base (en cm²) ?`, rep:U(String(B),"cm²"), ex:`<br>B = {3 × ${B*h}/${3*h}}<br>B = ${B} cm²`, sx:S_INV};
       return {q:`Un cône a un volume de ${V} cm³ et une hauteur de ${h} cm. Quelle est l'aire de sa base (en cm²) ?`, rep:U(String(B),"cm²"), ex:`<br>B = {3 × V/h}<br>B = {3 × ${V}/${h}}<br>B = {${3*V}/${h}}<br>B = ${B} cm²`, sx:S_INV}; }} ],
 3:[ {g:()=>{ const a=pick([2,3,4,5,6]), h=ri(2,8)*3, V=a*a*h/3; return {q:`Une pyramide à base carrée de côté ${a} cm a un volume de ${V} cm³. Quelle est sa hauteur (en cm) ?`, rep:U(String(h),"cm"), ex:`<br>B = ${a} × ${a}<br>B = ${a*a} cm²<br>h = {3 × ${V}/${a*a}}<br>h = ${h} cm`, sx:S_INV}; }},
     {q:"Si V = {B × h/3}, alors h est égal à…", c:["{3 × V/B}","{V/3 × B}","3 × V × B","{B/3 × V}"], rep:"{3 × V/B}", ex:"On multiplie par 3 : 3 × V = B × h, puis on divise par B.", sx:S_INV} ]
}},
{nom:"Solides composés", schema:S_COMP, q:{
 1:[ {g:()=>{ const [a,h]=pick([[5,3],[5,6],[10,3],[5,12],[10,6],[2,15],[5,15]]), V=a*a*h/3, n=1000/V; return {q:`Un berlingot a la forme d'une pyramide à base carrée de côté ${a} cm et de hauteur ${h} cm. Combien de berlingots peut-on remplir avec 1 L de lait ?`, rep:[String(n)], ex:`<br>V = {${a} × ${a} × ${h}/3}<br>V = ${V} cm³<br>1 L = 1 000 cm³ et 1 000 ÷ ${V} = ${n}.`, sx:S_PYR}; }} ],
 2:[ {g:()=>{ const r=ri(2,5), h1=ri(6,14), h2=ri(2,6), v=Math.PI*r*r*h1+Math.PI*r*r*h2/3; return {q:`Une tour est formée d'un cylindre de rayon ${r} m et de hauteur ${h1} m, surmonté d'un cône de même rayon et de hauteur ${h2} m. Quel est son volume, arrondi à l'unité (en m³) ?`, fig:tour(r,h1,h2,r+" m",h1+" m",h2+" m",{w:200}), rep:U(N(v,0),"m³"), ex:`Cylindre : π × ${r}² × ${h1} ≈ ${N(Math.PI*r*r*h1,2)} m³. Cône : {π × ${r}² × ${h2}/3} ≈ ${N(Math.PI*r*r*h2/3,2)} m³. Total ≈ ${N(v,0)} m³.`, sx:S_COMP}; }} ],
 3:[ {g:()=>{ const a=pick([6,12,18]), p=a/2, vp=p*p/2*p/3; return {q:`On retire d'un cube d'arête ${a} cm huit pyramides identiques, une à chaque coin : leurs trois arêtes issues du coin mesurent ${p} cm. Quel est le volume du solide obtenu (en cm³) ?`, rep:U(N(a**3-8*vp),"cm³"), ex:`Une pyramide : {${p} × ${p}/2} × ${p} ÷ 3 = ${N(vp)} cm³. Cube : ${N(a**3)} cm³. ${N(a**3)} − 8 × ${N(vp)} = ${N(a**3-8*vp)} cm³.`, sx:S_COMP}; }},
     {q:"Pour calculer le volume d'un tronc de cône (cône coupé par un plan parallèle à sa base), on…", c:["soustrait le volume du petit cône à celui du grand cône","additionne les volumes du grand et du petit cône","divise le volume du grand cône par 2"], rep:"soustrait le volume du petit cône à celui du grand cône", ex:"Le tronc de cône, c'est le grand cône auquel on a enlevé le petit cône du bas.", sx:S_COMP} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 10", duree:50, info:"Durée : 50 min · Calculatrice autorisée · Règle · Les calculs doivent être détaillés",
comp:[
  ["CONNAÎTRE","Je connais les formules de volume et je sais convertir des volumes et des capacités.","Ex. 1 (4 points)"],
  ["CALCULER","Je calcule le volume d'une pyramide et d'un cône de révolution.","Ex. 2 et 3 (7 points)"],
  ["MODÉLISER","Je décompose un solide en solides connus pour calculer son volume.","Ex. 4 (4 points)"],
  ["RAISONNER","J'utilise une formule de volume pour retrouver une longueur, une aire ou résoudre un problème.","Ex. 5 et 6 (5 points)"]
],
exos:[
{t:"QCM", p:4, h:`<p>Pour chaque question, une seule réponse est exacte. Écris le numéro de la question et la lettre de la bonne réponse. Aucune justification n'est demandée.</p>
  <div class="scroll"><table class="std"><thead><tr><th></th><th>Question</th><th>A</th><th>B</th><th>C</th></tr></thead><tbody>
  <tr><th>1</th><td>2,5 m³ = …</td><td>250 L</td><td>2 500 L</td><td>25 000 L</td></tr>
  <tr><th>2</th><td>350 cm³ = …</td><td>35 cL</td><td>3,5 cL</td><td>350 cL</td></tr>
  <tr><th>3</th><td>Le volume d'une pyramide de base B et de hauteur h est …</td><td>B × h</td><td>{B × h/2}</td><td>{B × h/3}</td></tr>
  <tr><th>4</th><td>La base d'un cône de révolution est …</td><td>un triangle</td><td>un disque</td><td>un carré</td></tr>
  </tbody></table></div>`,
 c:`<p>1) B : 1 m³ = 1 000 L, donc 2,5 m³ = 2 500 L · 2) A : 350 cm³ = 350 mL = 35 cL · 3) C : V = {B × h/3} · 4) B : un disque</p><p><i>(1 point par bonne réponse)</i></p>`},
{t:"Une pyramide à base rectangulaire", p:3, h:`${pyrRect(6,4,9,{la:"6 cm",lb:"4 cm",lh:"9 cm",names:true,w:300})}<p>SABCD est une pyramide de hauteur 9 cm. Sa base ABCD est un rectangle de longueur AB = 6 cm et de largeur BC = 4 cm.</p><p>a) Calcule l'aire de la base ABCD.</p><p>b) Calcule le volume de la pyramide SABCD.</p><p>c) Exprime ce volume en mL.</p>`,
 c:`<p>a)</p><p class="calc">B = 6 × 4<br>B = 24 cm²</p><p><i>(1 point)</i></p><p>b)</p><p class="calc">V = {B × h/3}<br>V = {24 × 9/3}<br>V = 72 cm³</p><p><i>(1,5 point)</i></p><p>c) 1 cm³ = 1 mL, donc V = 72 mL. <i>(0,5 point)</i></p>`},
{t:"Le cornet de glace", p:4, h:`${cone(2.5,12,"","12 cm",{w:170})}<p>Un cornet de glace a la forme d'un cône de révolution de diamètre 5 cm et de hauteur 12 cm.</p><p>a) Quel est le rayon de la base du cornet ?</p><p>b) Calcule le volume du cornet, arrondi au dixième de cm³.</p><p>c) Le glacier dispose de 1 L de glace. Combien de cornets peut-il remplir entièrement ?</p>`,
 c:`<p>a)</p><p class="calc">r = 5 ÷ 2<br>r = 2,5 cm</p><p><i>(0,5 point)</i></p><p>b)</p><p class="calc">V = {π × 2,5² × 12/3}<br>V = 25 × π<br>V ≈ 78,5 cm³</p><p><i>(2 points : 1 point pour la formule, 1 point pour le calcul)</i></p><p>c) 1 L = 1 000 cm³ et 1 000 ÷ 78,5 ≈ 12,7 : il peut remplir entièrement <b>12 cornets</b>. <i>(1,5 point)</i></p>`},
{t:"Une yourte", p:4, h:`${tour(3,2,1.5,"3 m","2 m","1,5 m",{k:40,w:250})}<p>Une yourte est formée d'un cylindre de rayon 3 m et de hauteur 2 m, surmonté d'un toit en forme de cône de même rayon et de hauteur 1,5 m.</p><p>Calcule le volume de la yourte, arrondi au dixième de m³.</p>`,
 c:`<p>Cylindre :</p><p class="calc">V₁ = π × 3² × 2<br>V₁ = 18 × π<br>V₁ ≈ 56,55 m³</p><p><i>(1,5 point)</i></p><p>Cône :</p><p class="calc">V₂ = {π × 3² × 1,5/3}<br>V₂ = 4,5 × π<br>V₂ ≈ 14,14 m³</p><p><i>(1,5 point)</i></p><p>Yourte :</p><p class="calc">V = 18π + 4,5π<br>V = 22,5 × π<br>V ≈ 70,7 m³</p><p><i>(1 point)</i></p>`},
{t:"Quand on connaît le volume", p:2, h:`<p>a) Une pyramide a un volume de 120 cm³ et sa base a une aire de 24 cm². Calcule sa hauteur.</p><p>b) Un cône a un volume de 314 cm³ et une hauteur de 12 cm. Calcule l'aire de sa base.</p>`,
 c:`<p>a)</p><p class="calc">h = {3 × V/B}<br>h = {3 × 120/24}<br>h = {360/24}<br>h = 15 cm</p><p><i>(1 point)</i></p><p>b)</p><p class="calc">B = {3 × V/h}<br>B = {3 × 314/12}<br>B = {942/12}<br>B = 78,5 cm²</p><p><i>(1 point)</i></p>`},
{t:"Les bougies", p:3, h:`<p>Zoé fabrique des bougies en forme de pyramide à base carrée de côté 8 cm et de hauteur 12 cm.</p><p>Elle a fait fondre 2 L de cire.</p><p>Combien de bougies peut-elle fabriquer ? Justifie.</p>`,
 c:`<p>Volume d'une bougie :</p><p class="calc">V = {8 × 8 × 12/3}<br>V = {768/3}<br>V = 256 cm³</p><p><i>(1,5 point)</i></p><p>2 L = 2 dm³ = 2 000 cm³ <i>(0,5 point)</i></p><p>2 000 ÷ 256 ≈ 7,8 : elle peut fabriquer <b>7 bougies</b> (il restera de la cire). <i>(1 point)</i></p>`}
]}
};
})();
