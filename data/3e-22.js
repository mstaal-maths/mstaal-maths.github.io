/* 3e — Chapitre 22 : Repérage dans l'espace et sections
   Cours « Cours complété », activité d'introduction, « Exercices » (repérage sur la sphère) et « Sections planes 2022 / Exercices »
   de M. Staal (dossier « 24 - Repérage dans l'espace et Sections de solide »), complétés par trois exercices de l'ancienne fiche
   « Sections planes de solides » (la géode, la section de pavé HEJI, les exercices d'entraînement).
   Les globes, le planisphère et les pavés sont redessinés en SVG à partir de coordonnées exactes (outils window.ESP3) :
   les images d'origine étaient trop petites pour lire les coordonnées sans ambiguïté. */
(function(){
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const co=(p,alt,w)=>img("3k22co/"+p,alt,w), ex=(p,alt,w)=>img("3k22ex/"+p,alt,w);
const fig=(cap,body)=>`<figure>${body}${cap?`<figcaption>${cap}</figcaption>`:""}</figure>`;
const rd=(x,k=3)=>Math.round(x*10**k+1e-9)/10**k;
const F=(x,k=3)=>{ const r=rd(x,k); const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const RAD=Math.PI/180;
const RED="#d0342c", GRN="#1e8a4c", BLUE="#1e5aa8", ORA="#d9730d";
/* coordonnées géographiques : lat > 0 = Nord, lon > 0 = Est */
const LAT=a=>a===0?"0°":Math.abs(a)+"°"+(a>0?"N":"S"), LON=a=>a===0?"0°":Math.abs(a)+"°"+(a>0?"E":"O");
const GEO=(la,lo)=>`(${LAT(la)} ; ${LON(lo)})`;
const P3=(x,y,z)=>`(${F(x)} ; ${F(y)} ; ${F(z)})`;
const txt=(x,y,t,st="")=>`<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" style="font-size:14px;font-weight:700;fill:var(--ink);${st}">${t}</text>`;

/* ------------------------------------------------------------------
   Globe (projection orthographique) : grille tous les 10°, équateur et méridien de Greenwich
   o = {lat0, lon0, R, pts:[[nom, lat, lon]], color:true (équateur rouge, Greenwich vert), lab:true (graduations)}
------------------------------------------------------------------ */
function globe(o){
  const R=o.R||200, f0=(o.lat0??20)*RAD, l0=(o.lon0??10)*RAD, pad=56, cx=R+pad, cy=R+pad, W=2*R+2*pad;
  const pr=(la,lo)=>{ const f=la*RAD, d=lo*RAD-l0; return {x:cx+R*Math.cos(f)*Math.sin(d), y:cy-R*(Math.cos(f0)*Math.sin(f)-Math.sin(f0)*Math.cos(f)*Math.cos(d)), v:Math.sin(f0)*Math.sin(f)+Math.cos(f0)*Math.cos(f)*Math.cos(d)}; };
  const path=(pts,st)=>{ let s="", d=""; pts.forEach(p=>{ if(p.v>=0){ d+=(d?"L":"M")+p.x.toFixed(1)+" "+p.y.toFixed(1); } else if(d){ s+=`<path d="${d}" style="fill:none;${st}"/>`; d=""; } }); if(d) s+=`<path d="${d}" style="fill:none;${st}"/>`; return s; };
  const grid="stroke:#7fa7d8;stroke-width:1.1", eq=o.color===false?"stroke:var(--ink);stroke-width:2.2":`stroke:${RED};stroke-width:3`, gr=o.color===false?"stroke:var(--ink);stroke-width:2.2":`stroke:${GRN};stroke-width:3`;
  let s=`<svg class="fig" viewBox="0 0 ${W} ${W}" width="${Math.min(W,o.w||W)}" role="img" aria-label="${o.alt||"Globe terrestre avec les parallèles et les méridiens"}">`;
  s+=`<circle cx="${cx}" cy="${cy}" r="${R}" style="fill:#e6f0fb;stroke:#4a78b5;stroke-width:2"/>`;
  for(let la=-80; la<=80; la+=10){ if(la===0) continue; const p=[]; for(let lo=-180; lo<=180; lo+=2) p.push(pr(la,lo)); s+=path(p,grid); }
  for(let lo=-180; lo<180; lo+=10){ if(lo===0) continue; const p=[]; for(let la=-90; la<=90; la+=2) p.push(pr(la,lo)); s+=path(p,grid); }
  { const p=[]; for(let lo=-180; lo<=180; lo+=2) p.push(pr(0,lo)); s+=path(p,eq); }
  { const p=[]; for(let la=-90; la<=90; la+=2) p.push(pr(la,0)); s+=path(p,gr); }
  if(o.lab!==false){
    /* graduations : latitudes le long du méridien de Greenwich, longitudes sous l'équateur (comme sur la fiche de M. Staal) */
    const ls="font-size:13px;font-weight:700;fill:#1b2a44;paint-order:stroke;stroke:#e6f0fb;stroke-width:4px";
    for(let la=-40; la<=60; la+=10){ if(la===0) continue; const q=pr(la,0); if(q.v>0.1 && !(o.pts||[]).some(([,pa,po])=>Math.abs(pa-la)<8 && po>=-2 && po<=14)) s+=`<text x="${(q.x+5).toFixed(1)}" y="${(q.y-3).toFixed(1)}" style="${ls}">${Math.abs(la)}°${la>0?"N":"S"}</text>`; }
    for(let lo=-80; lo<=80; lo+=20){ const q=pr(0,lo); if(q.v>0.25 && !(o.pts||[]).some(([,pa,po])=>pa<=4 && pa>=-14 && po-lo>=-6 && po-lo<=18)) s+=`<text x="${(q.x+3).toFixed(1)}" y="${(q.y+17).toFixed(1)}" style="${ls}">${lo===0?"0°":Math.abs(lo)+"°"+(lo>0?"E":"O")}</text>`; }
  }
  if(o.names!==false){ const a=pr(70,-12), b=pr(-10,(o.lon0??10)+66); if(a.v>0) s+=txt(a.x,a.y,"Greenwich",`font-size:13px;fill:${o.color===false?"var(--ink)":GRN};paint-order:stroke;stroke:#e6f0fb;stroke-width:3px`); if(b.v>0) s+=txt(b.x,b.y-4,"Équateur",`font-size:13px;fill:${o.color===false?"var(--ink)":RED};paint-order:stroke;stroke:#e6f0fb;stroke-width:3px`); }
  (o.pts||[]).forEach(([n,la,lo])=>{ const q=pr(la,lo); s+=`<circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="5.5" style="fill:#c2185b;stroke:#fff;stroke-width:1.5"/>`+txt(q.x+13,q.y-9,n,"font-size:18px;paint-order:stroke;stroke:#e6f0fb;stroke-width:4px"); });
  return s+"</svg>";
}
/* ------------------------------------------------------------------ planisphère (grille seule, tous les 10°) */
function plani(o){
  const k=o.k||2.2, ml=46, mt=14, W=Math.round(360*k+ml+20), H=Math.round(140*k+mt+40), X=lo=>ml+(lo+180)*k, Y=la=>mt+(80-la)*k;
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${o.alt||"Planisphère : grille des latitudes et des longitudes"}"><rect x="${ml}" y="${mt}" width="${360*k}" height="${140*k}" style="fill:#e6f0fb;stroke:#4a78b5;stroke-width:1.5"/>`;
  for(let lo=-180; lo<=180; lo+=10){ const big=lo%30===0; s+=`<line x1="${X(lo)}" y1="${mt}" x2="${X(lo)}" y2="${Y(-60)}" style="stroke:#7fa7d8;stroke-width:${big?1.3:0.6}"/>`; if(big) s+=txt(X(lo),Y(-60)+16,Math.abs(lo)+"°","font-size:11px"); }
  for(let la=-60; la<=80; la+=10){ s+=`<line x1="${ml}" y1="${Y(la)}" x2="${X(180)}" y2="${Y(la)}" style="stroke:#7fa7d8;stroke-width:${la%20===0?1.3:0.6}"/>`; if(la%20===0) s+=`<text x="${ml-5}" y="${Y(la)+4}" text-anchor="end" style="font-size:11px;font-weight:700;fill:var(--ink)">${la===0?"0°":Math.abs(la)+"°"+(la>0?"N":"S")}</text>`; }
  s+=txt(X(-180)+16,Y(-60)+30,"Ouest","font-size:12px")+txt(X(180)-14,Y(-60)+30,"Est","font-size:12px");
  if(o.color){ s+=`<line x1="${ml}" y1="${Y(0)}" x2="${X(180)}" y2="${Y(0)}" style="stroke:${RED};stroke-width:3"/><line x1="${X(0)}" y1="${mt}" x2="${X(0)}" y2="${Y(-60)}" style="stroke:${GRN};stroke-width:3"/>`; }
  (o.pts||[]).forEach(([n,la,lo])=>{ const x=X(lo), y=Y(la); s+=`<path d="M${x-5} ${y}H${x+5}M${x} ${y-5}V${y+5}" style="stroke:#c2185b;stroke-width:2.6"/>`+txt(x+11,y-6,n,"font-size:15px;paint-order:stroke;stroke:#e6f0fb;stroke-width:3px"); });
  return s+"</svg>";
}
/* ------------------------------------------------------------------ pavé droit en perspective cavalière
   L (abscisses, vers la droite), P (ordonnées, en profondeur), Hh (altitudes) en unités ; names {sommet : nom} ;
   les 8 sommets : "000","100","010","110","001","101","011","111" (x y z en 0/1) ; pts [[nom,x,y,z]] en unités */
function pave(o){
  const L=o.L||1, P=o.P||1, Hh=o.H||1, k=o.k||Math.min(140/L, 120/Hh, 150/P), dx=0.55*k*Math.cos(35*RAD), dy=0.55*k*Math.sin(35*RAD), ml=40, mb=36;
  const W=Math.round(L*k+P*dx+2*ml), Ht=Math.round(Hh*k+P*dy+2*mb);
  const Q=(x,y,z)=>[ml+x*k+y*dx, Ht-mb-z*k-y*dy];
  const V=c=>Q(+c[0]*L,+c[1]*P,+c[2]*Hh);
  const hid=["000","100","001"].includes("x")?[]:["010"]; /* sommet caché : derrière en bas à gauche */
  const E=[["000","100"],["100","110"],["110","010"],["010","000"],["001","101"],["101","111"],["111","011"],["011","001"],["000","001"],["100","101"],["110","111"],["010","011"]];
  let s=`<svg class="fig" viewBox="0 0 ${W} ${Ht}" width="${W}" role="img" aria-label="${o.alt||"Pavé droit"}">`;
  (o.fill||[]).forEach(([ps,col,ns])=>{ s+=`<polygon points="${ps.map(p=>Q(...p).map(v=>v.toFixed(1)).join(",")).join(" ")}" style="fill:${col};fill-opacity:.45;stroke:${ns?"none":col};stroke-width:2"/>`; });
  /* segments supplémentaires [[x,y,z],[x,y,z],couleur,pointillés] (ex. bords d'une section, cachés ou non) */
  (o.segs||[]).forEach(([a,b,col,d])=>{ const A=Q(...a), B=Q(...b); s+=`<line x1="${A[0].toFixed(1)}" y1="${A[1].toFixed(1)}" x2="${B[0].toFixed(1)}" y2="${B[1].toFixed(1)}" style="stroke:${col};stroke-width:2.6;${d?"stroke-dasharray:6 4":""}"/>`; });
  E.forEach(([a,b])=>{ const A=V(a), B=V(b), d=hid.includes(a)||hid.includes(b); s+=`<line x1="${A[0].toFixed(1)}" y1="${A[1].toFixed(1)}" x2="${B[0].toFixed(1)}" y2="${B[1].toFixed(1)}" style="stroke:var(--ink);stroke-width:2;${d?"stroke-dasharray:6 4":""}"/>`; });
  (o.axes||[]).forEach(([a,b,col])=>{ const A=V(a), B=V(b); s+=`<line x1="${A[0].toFixed(1)}" y1="${A[1].toFixed(1)}" x2="${B[0].toFixed(1)}" y2="${B[1].toFixed(1)}" style="stroke:${col};stroke-width:3.2;${a==="010"||b==="010"?"stroke-dasharray:6 4":""}"/>`; });
  const off={"000":[-12,14],"100":[12,14],"010":[-12,-4],"110":[14,6],"001":[-12,-6],"101":[13,14],"011":[-6,-8],"111":[12,-8]};
  Object.entries(o.names||{}).forEach(([c,n])=>{ const A=V(c); s+=txt(A[0]+off[c][0],A[1]+off[c][1]+4,n,"font-size:16px"); });
  (o.pts||[]).forEach(([n,x,y,z,dxx=12,dyy=-8])=>{ const A=Q(x,y,z); s+=`<circle cx="${A[0].toFixed(1)}" cy="${A[1].toFixed(1)}" r="4" style="fill:#c2185b"/>`+txt(A[0]+dxx,A[1]+dyy,n,"font-size:15px;fill:#c2185b"); });
  (o.len||[]).forEach(([a,b,t,dx2=0,dy2=0])=>{ const A=Q(...a), B=Q(...b); s+=txt((A[0]+B[0])/2+dx2,(A[1]+B[1])/2+dy2,t,"font-size:14px"); });
  return s+"</svg>";
}
/* droite graduée de −0,5 à 0,5 (pas 0,1) */
function droite(xA){ const X=v=>40+(v+0.5)*300; let s=`<svg class="fig" viewBox="0 0 380 70" width="380" role="img" aria-label="Droite graduée : le point A a pour abscisse ${F(xA)}"><line x1="20" y1="40" x2="365" y2="40" style="stroke:var(--ink);stroke-width:2"/><path d="M358 34L366 40L358 46" style="fill:none;stroke:var(--ink);stroke-width:2"/>`;
  for(let i=-5;i<=5;i++){ const x=X(i/10); s+=`<line x1="${x}" y1="34" x2="${x}" y2="46" style="stroke:var(--ink);stroke-width:${i===0?2.4:1.4}"/>`; }
  s+=txt(X(0),64,"0")+txt(X(0.1),64,"0,1")+`<circle cx="${X(xA)}" cy="40" r="4.5" style="fill:#c2185b"/>`+txt(X(xA),24,"A","fill:#c2185b;font-size:16px"); return s+"</svg>"; }
/* section HEJI dessinée en vraie grandeur (1 cm = 37,8 px, l'unité « cm » du navigateur) : HE = l (côté vertical), EJ = L (côté horizontal) */
function rectVG(L,l,tL,tl){ const k=37.8, m=30, x0=m+44, y0=m, x1=x0+L*k, y1=y0+l*k, W=x1+m+14, Ht=y1+m+14, q=9;
  const ra=(x,y,sx,sy)=>`<path d="M${(x+sx*q).toFixed(1)} ${y.toFixed(1)}L${(x+sx*q).toFixed(1)} ${(y+sy*q).toFixed(1)}L${x.toFixed(1)} ${(y+sy*q).toFixed(1)}" style="fill:none;stroke:var(--ink);stroke-width:1.4"/>`;
  return `<svg class="fig" viewBox="0 0 ${W.toFixed(1)} ${Ht.toFixed(1)}" width="${W.toFixed(1)}" role="img" aria-label="Rectangle HEJI en vraie grandeur : ${tl} sur ${tL}">`
   +`<polygon points="${x0},${y0} ${x0},${y1.toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)} ${x1.toFixed(1)},${y0}" style="fill:${ORA};fill-opacity:.25;stroke:${ORA};stroke-width:2.4"/>`
   +ra(x0,y0,1,1)+ra(x0,y1,1,-1)+ra(x1,y1,-1,-1)+ra(x1,y0,-1,1)
   +txt(x0-12,y0-6,"H","font-size:16px")+txt(x0-12,y1+16,"E","font-size:16px")+txt(x1+12,y1+16,"J","font-size:16px")+txt(x1+12,y0-6,"I","font-size:16px")
   +txt(x0-26,(y0+y1)/2+5,tl,"font-weight:400")+txt((x0+x1)/2,y1+20,tL,"font-weight:400")+"</svg>"; }
window.ESP3={globe, plani, pave, droite, rectVG, GEO, LAT, LON, P3, F, rd};

/* ===================== figures ===================== */
const PAVE_C=pave({L:1.6,P:1,H:1, k:120, names:{"000":"A","100":"B","110":"C","010":"D","001":"E","101":"F","111":"G","011":"H"}, axes:[["000","100",RED],["000","010",GRN],["000","001",BLUE]], pts:[["M",1.6,1,0.5,14,6]], alt:"Pavé droit ABCDEFGH : M est le milieu de [CG]"});
const PAVE_ACT=pave({L:1.6,P:1,H:1, k:120, names:{"000":"O","100":"A","010":"C","001":"D"}, axes:[["000","100",RED],["000","010",GRN],["000","001",BLUE]], alt:"Pavé droit : repère (O ; A, C, D)"});
const PAVE_ACTc=pave({L:1.6,P:1,H:1, k:120, names:{"000":"O","100":"A","010":"C","001":"D","110":"E","101":"F","111":"G","011":"H"}, axes:[["000","100",RED],["000","010",GRN],["000","001",BLUE]], pts:[["K",0.8,0.5,1,0,-10],["I",1.6,0,0.5,14,4]], alt:"Pavé droit : repère (O ; A, C, D) et les points placés"});
const G_EX1=[["A",0,0],["M",20,30],["N",30,-20],["P",-20,50]];
const G_EX2=[["O",0,0],["A",10,60],["B",40,-10],["C",-20,30],["D",-10,-20],["E",0,30],["F",0,-50]];
const CITIES=[["W",40,-80,"Washington"],["L",40,-10,"Lisbonne"],["M",60,40,"Moscou"],["T",40,140,"Tokyo"],["B",-20,-50,"Brasilia"],["C",-40,150,"Canberra"],["P",-30,30,"Prétoria"]];
/* section d'un cube (exercice 2) : a) plan parallèle à la face de droite passant par A (sur l'arête du haut de la face avant) ; b) plan parallèle à la face du dessus passant par A (sur l'arête verticale de gauche) */
const CUBE_A=pave({L:1,P:1,H:1,k:130, fill:[[[[1,0,0],[1,1,0],[1,1,1],[1,0,1]],"#d63384"],[[[0.25,0,0],[0.25,1,0],[0.25,1,1],[0.25,0,1]],ORA]], pts:[["A",0.25,0,1,-6,-10]], alt:"Cube : la section parallèle à la face de droite passant par A est un carré"});
const CUBE_B=pave({L:1,P:1,H:1,k:130, fill:[[[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],"#d63384"],[[[0,0,0.25],[1,0,0.25],[1,1,0.25],[0,1,0.25]],ORA]], pts:[["A",0,0,0.25,-14,4]], alt:"Cube : la section parallèle à la face du dessus passant par A est un carré"});
/* motte de beurre : A sur l'arête de gauche de la face du dessus, B sur l'arête avant de la face du dessus ; la section est le rectangle ABB'A' (côtés cachés en pointillés) */
const BEURRE=(()=>{ const H=0.8, a=[0,1,H], b=[1,0,H], b2=[1,0,0], a2=[0,1,0];
  return pave({L:2.4,P:1.8,H, k:110, fill:[[[a,b,b2,a2],ORA,1]], segs:[[a,b,ORA],[b,b2,ORA],[b2,a2,ORA,1],[a2,a,ORA,1]], pts:[["A",...a,-18,-6],["B",...b,4,-10]], alt:"Motte de beurre : la section par le plan passant par A et B, parallèle à une arête verticale, est un rectangle"}); })();

/* ===================== schémas ===================== */
const S_PLAN=sch("Se repérer dans le plan et dans l'espace", `<p class="schN">Sur une droite graduée : 1 nombre, l'<b>abscisse</b>. Dans le plan : 2 nombres (x ; y), <b>abscisse</b> et <b>ordonnée</b>. Dans l'espace : 3 nombres (x ; y ; z), <b>abscisse</b>, <b>ordonnée</b> et <b>altitude</b>.</p>${PAVE_C}<p class="schN">Repère (A ; B, D, E) : A(0 ; 0 ; 0), C(1 ; 1 ; 0), G(1 ; 1 ; 1), M(1 ; 1 ; 0,5).</p>`);
const S_GEO=sch("Latitude et longitude", `${globe({R:120,pts:[["B",40,50],["C",40,-30],["D",-20,10]],w:300})}<p class="schN">On écrit (latitude ; longitude). Latitude : Nord ou Sud de l'équateur (0° à 90°). Longitude : Ouest ou Est du méridien de Greenwich (0° à 180°). Ici B(40°N ; 50°E).</p>`);
const S_SEC=sch("Sections planes", `<p class="schN"><b>Pavé</b> : parallèle à une face → rectangle comme la face ; parallèle à une arête → rectangle. <b>Cylindre</b> : parallèle à la base → disque de même rayon ; parallèle à l'axe → rectangle. <b>Cône, pyramide</b> : parallèle à la base → réduction de la base. <b>Sphère</b> : un cercle (ou un point).</p>`);
const S_SPH=sch("Section d'une sphère", `${ex("e3.png","Section d'une sphère de centre O par un plan : cercle de centre A et de rayon AB",150)}<p class="calc">OAB rectangle en A : AB² = OB² − OA²</p><p class="schN">OB est le rayon de la sphère, OA la distance du centre au plan.</p>`);
const S_RED=sch("Section d'un cône ou d'une pyramide", `${ex("e4.png","Cône de sommet S coupé parallèlement à sa base : cercle de centre I et de rayon IB",120)}<p class="calc">{SI/SO} = {IB/OA} = k (coefficient de réduction)</p><p class="schN">La section est une réduction de la base. Le volume est multiplié par k³.</p>`);

/* ---------- générateurs ---------- */
const NAT=[["un pavé droit","parallèle à une face","un rectangle de mêmes dimensions que la face"],["un pavé droit","parallèle à une arête","un rectangle"],["un cylindre","parallèle à sa base","un disque de même rayon que la base"],["un cylindre","parallèle à son axe","un rectangle"],["un cône","parallèle à sa base","un disque (réduction de la base)"],["une pyramide","parallèle à sa base","une réduction de la base"],["une sphère","qui ne passe pas par son centre","un cercle"]];
const NATX={"un rectangle de mêmes dimensions que la face":["un rectangle"],"un disque de même rayon que la base":["un cercle"],"un disque (réduction de la base)":["une réduction de la base","un cercle"],"une réduction de la base":["un triangle"]};
const NATC=["un rectangle de mêmes dimensions que la face","un rectangle","un disque de même rayon que la base","un disque (réduction de la base)","une réduction de la base","un cercle","un triangle"];
const gp=()=>[10*ri(-3,5), 10*ri(-6,8)];

CH["3e-22"] = {
intro:"Se repérer sur une droite, dans le plan, dans un pavé droit et sur la Terre (latitude et longitude), et connaître la nature des sections planes des solides.",
savoir:[
  "lire l'abscisse d'un point sur une droite graduée et les coordonnées d'un point dans un repère du plan ;",
  "lire et placer un point de coordonnées (x ; y ; z) dans un pavé droit ;",
  "lire et placer un point de coordonnées géographiques (latitude ; longitude) sur un globe ou un planisphère ;",
  "connaître la nature de la section d'un pavé, d'un cylindre, d'un cône, d'une pyramide et d'une sphère par un plan ;",
  "calculer des longueurs dans une section (théorème de Pythagore, réduction)."
],

/* ===================== COURS ===================== */
cours:[
{k:"1", t:"Repérage sur une droite graduée et dans le plan", h:`
  <h4>a) Repérage sur une droite graduée</h4>
  <div class="retenir" data-l="Définition"><p>Sur une droite graduée, un point est repéré par son <b>abscisse</b>.</p></div>
  ${droite(-0.3)}<p><b>Exemple :</b> sur la droite graduée ci-dessus, l'abscisse du point A est <b>−0,3</b>.</p>
  <h4>b) Repérage dans le plan</h4>
  <div class="retenir" data-l="Définition"><p>Pour se repérer dans le plan, on utilise un repère du plan. Pour cela, on choisit :</p><ul><li>un point O, appelé <b>origine du repère</b> ;</li><li>deux axes perpendiculaires d'origine O : l'<b>axe des abscisses</b> et l'<b>axe des ordonnées</b>.</li></ul><p>Chaque point du plan est alors repéré par un unique couple de coordonnées (<b>x</b> ; <b>y</b>).</p></div>
  ${co("plan.png","Repère du plan d'origine O ; le point A a pour coordonnées (0,5 ; −1,5)",300)}
  <p><b>Exemple :</b> dans le repère ci-dessus, les coordonnées du point A sont (0,5 ; −1,5). On note A(<b>0,5</b> ; <b>−1,5</b>).</p>`},
{k:"2", t:"Repérage dans un parallélépipède rectangle", h:`
  <div class="retenir" data-l="Définition"><p>Pour se repérer dans l'espace, on a besoin d'un repère de l'espace. Dans l'exemple, le repère est noté (A ; B, D, E). On prend :</p><ul><li>le point A, l'<b>origine du repère</b> ;</li><li>trois axes perpendiculaires entre eux : l'<b>abscisse</b> représentée par l'arête [AB], l'<b>ordonnée</b> représentée par l'arête [AD] et l'<b>altitude</b> représentée par l'arête [AE].</li></ul><p>Chaque point de l'espace est alors repéré par un unique triplet de coordonnées (<b>x</b> ; <b>y</b> ; <b>z</b>).</p></div>
  ${PAVE_C}
  <p><b>Exemple :</b> ABCDEFGH est un parallélépipède rectangle et M est le milieu de [CG]. Coordonnées des points dans le repère (A ; B, D, E) :</p>
  <div class="scroll"><table class="std"><tbody><tr><td>A(0 ; 0 ; 0)</td><td>B(1 ; 0 ; 0)</td><td>C(1 ; 1 ; 0)</td><td>D(0 ; 1 ; 0)</td></tr><tr><td>E(0 ; 0 ; 1)</td><td>F(1 ; 0 ; 1)</td><td>G(1 ; 1 ; 1)</td><td>H(0 ; 1 ; 1)</td></tr><tr><td colspan="4">M(1 ; 1 ; 0,5)</td></tr></tbody></table></div>`},
{k:"3", t:"Repérage sur une sphère : coordonnées géographiques", h:`
  <div class="retenir" data-l="Définition"><p>On se repère sur une sphère grâce aux coordonnées géographiques <b>(latitude ; longitude)</b>.</p><ul><li>La <b>latitude</b> exprime la position Nord-Sud par rapport à l'<b>équateur</b>. Elle varie de 90°N à 90°S.</li><li>La <b>longitude</b> exprime la position Ouest-Est par rapport au <b>méridien de Greenwich</b>. Elle varie de 180°O à 180°E.</li></ul></div>
  ${co("latlong.jpg","Repérage d'un point M sur la Terre : méridien, parallèle, longitude et latitude",560)}
  <div class="retenir" data-l="Vocabulaire"><ul><li>Un <b>méridien</b> est un demi-cercle qui va du pôle Nord au pôle Sud. Tous les points d'un même méridien ont la même longitude.</li><li>Un <b>parallèle</b> est un cercle parallèle à l'équateur. Tous les points d'un même parallèle ont la même latitude.</li></ul></div>
  <p><b>Exemple :</b> quelles sont les coordonnées des points B, C et D ?</p>
  <div class="figs">${co("globe1.png","Globe avec les points B, C et D",230)}${co("globe2.png","Latitude et longitude du point B",230)}</div>
  <p>B(40°N ; 50°E) &nbsp; C(40°N ; 30°O) &nbsp; D(20°S ; 10°E)</p>`},
{k:"4", t:"Sections planes de solides", h:`
  <div class="retenir" data-l="Définition"><p>On appelle <b>section d'un solide</b> par un plan l'<b>intersection</b> de ce solide avec ce plan.</p></div>
  <h4>a) Section d'un pavé droit et d'un cylindre</h4>
  ${co("sect1.png","Sections d'un pavé droit et d'un cylindre par un plan",520)}
  <div class="retenir" data-l="Propriétés"><ul><li>La section d'un pavé droit par un plan <b>parallèle à une face</b> est un <b>rectangle</b> de mêmes dimensions que la face.</li><li>La section d'un pavé droit par un plan <b>parallèle à une arête</b> est un <b>rectangle</b> dont l'une des dimensions est la longueur de cette arête.</li><li>La section d'un cylindre par un plan <b>parallèle à une base</b> est un <b>cercle</b> (un disque) de même rayon que la base.</li><li>La section d'un cylindre par un plan <b>parallèle à son axe</b> est un <b>rectangle</b> dont l'une des dimensions est la hauteur du cylindre.</li></ul></div>
  <h4>b) Section d'un cône, d'une pyramide et d'une sphère</h4>
  ${co("sect2.png","Sections d'un cône, d'une pyramide et d'une sphère par un plan",520)}
  <div class="retenir" data-l="Propriétés"><ul><li>La section d'un cône par un plan <b>parallèle à sa base</b> est un <b>cercle</b>, <b>réduction du cercle de base</b>. Son centre appartient à la hauteur du cône. Rapport de réduction : {SI/SO} = {SJ/SA} = {IJ/OA}.</li><li>La section d'une pyramide par un plan <b>parallèle à sa base</b> est une <b>réduction de la base</b> : ses côtés sont parallèles à ceux de la base. Rapport de réduction : {SI/SA} = {SJ/SB} = {IJ/AB}.</li><li>La section d'une sphère de centre O et de rayon [OA] par un plan passant par un point M de [OA] (et perpendiculaire à (OA)) est : le point A si M = A ; un grand cercle si M = O ; un cercle de centre M sinon.</li></ul></div>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Se repérer dans un pavé droit", e:[
  {n:"Activité 1", t:"Se repérer dans un pavé droit", w:"Sur ton cahier", h:`<p>Voici un pavé droit et le repère (O ; A, C, D).</p>${PAVE_ACT}<p><b>1)</b> Donne les coordonnées des points O, A, C et D.</p><p><b>2)</b> Nomme E le sommet de coordonnées (1 ; 1 ; 0), F le sommet (1 ; 0 ; 1), G le sommet (1 ; 1 ; 1) et H le sommet (0 ; 1 ; 1).</p><p><b>3)</b> Place le point I(1 ; 0 ; 0,5) et le centre K de la face du dessus. Donne les coordonnées de K.</p>`,
   c:`${PAVE_ACTc}<p><b>1)</b> O(0 ; 0 ; 0), A(1 ; 0 ; 0), C(0 ; 1 ; 0), D(0 ; 0 ; 1).</p><p><b>2)</b> Voir la figure.</p><p><b>3)</b> I est le milieu de l'arête [AF]. K est le centre de la face DFGH : <b>K(0,5 ; 0,5 ; 1)</b>.</p>`}
 ]},
{t:"Se repérer sur une sphère", e:[
  {n:"Activité 2", t:"Coordonnées géographiques", w:"Sur ton cahier", h:`<div class="figs">${co("globe1.png","Globe avec les points B, C et D",230)}${co("globe2.png","Latitude et longitude du point B",230)}</div><p><b>1)</b> On a B(40°N ; 50°E). Note les coordonnées des points C et D.</p><p><b>2)</b> Place le point B sur un planisphère.</p>`,
   c:`<p><b>1)</b> C(40°N ; 30°O) et D(20°S ; 10°E).</p><p><b>2)</b></p>${plani({pts:[["B",40,50]],color:true,k:1.6})}<p>B est à l'intersection du parallèle 40°N et du méridien 50°E.</p>`},
  {n:"Exercice 1", t:"Lire et placer des points sur le globe", w:"Sur ton cahier", h:`${globe({pts:G_EX1, lat0:20, lon0:10})}<p><b>1)</b> Donne les coordonnées des points M, N et P.</p><p><b>2) a)</b> Place un point R qui a la même latitude que M.</p><p><b>b)</b> Place un point S qui a la même longitude que M.</p><p><b>c)</b> Complète les deux phrases suivantes avec « longitude » ou « latitude » :</p><p>« Tous les points situés sur un même parallèle ont la même ……… »</p><p>« Tous les points situés sur un même méridien ont la même ……… »</p>`,
   c:`<p><b>1)</b> M(20°N ; 30°E) ; N(30°N ; 20°O) ; P(20°S ; 50°E).</p>${globe({pts:[...G_EX1,["R",20,-10],["S",-10,30]], lat0:20, lon0:10})}<p><b>2) a)</b> R est sur le parallèle 20°N, par exemple R(20°N ; 10°O).</p><p><b>b)</b> S est sur le méridien 30°E, par exemple S(10°S ; 30°E).</p><p><b>c)</b> Tous les points situés sur un même parallèle ont la même <b>latitude</b>. Tous les points situés sur un même méridien ont la même <b>longitude</b>.</p>`},
  {n:"Exercice 2", t:"Lire des coordonnées géographiques", w:"Sur ton cahier", h:`<p>On a représenté ci-dessous l'équateur et le méridien de Greenwich. Les lignes sont tracées tous les 10°.</p>${globe({pts:G_EX2, lat0:15, lon0:5, color:false, eqLab:0})}<p><b>a)</b> Donne les coordonnées des points A, B, C, D, E, F et O.</p><p><b>b)</b> Cite deux points qui ont la même latitude.</p><p><b>c)</b> Cite deux points qui ont la même longitude.</p>`,
   c:`<p><b>a)</b> A(10°N ; 60°E) ; B(40°N ; 10°O) ; C(20°S ; 30°E) ; D(10°S ; 20°O) ; E(0° ; 30°E) ; F(0° ; 50°O) ; O(0° ; 0°).</p><p><b>b)</b> E, F et O sont sur l'équateur : ils ont la même latitude (0°).</p><p><b>c)</b> C et E sont sur le même méridien : ils ont la même longitude (30°E).</p>`},
  {n:"Exercice 3", t:"Le planisphère", w:"Sur ton cahier", h:`<p>Voici un planisphère : les lignes sont tracées tous les 10°.</p>${plani({pts:CITIES})}<p><b>a)</b> Repasse en rouge l'équateur et en vert le méridien de Greenwich.</p><p><b>b)</b> Quelques capitales ont été placées sur ce planisphère : Washington, Lisbonne, Moscou, Tokyo, Brasilia, Canberra et Prétoria. Détermine les coordonnées géographiques de chacune de ces villes (W, L, M, T, B, C et P).</p>`,
   c:`<p><b>a)</b> Sur la figure : l'équateur (0°) est en rouge et le méridien de Greenwich (0°) est en vert.</p>${plani({pts:CITIES,color:true})}<p><b>b)</b> ${CITIES.map(([n,la,lo,v])=>`${n}${GEO(la,lo)} : ${v}`).join(" ; ")}.</p><p>Ce sont des valeurs arrondies à la dizaine : par exemple, Washington est en réalité à environ (39°N ; 77°O).</p>`}
 ]},
{t:"Sections planes de solides", e:[
  {n:"Exercice 4", t:"Donner la nature d'une section", w:"Sur ton cahier", h:`<p>Ces quatre solides ont été coupés par un plan. Leur section est tracée en rouge. Indique leur nature.</p><div class="figs">${fig("a) Le plan est parallèle à la face ABCD. · b) Le plan est parallèle à l'axe (OO').",ex("e1ab.png","a) Pavé droit coupé parallèlement à la face ABCD ; b) cylindre coupé parallèlement à son axe",460))}${fig("c) Le plan est parallèle à la base rectangulaire ABCD. · d) Le plan passe par O' et est parallèle au plan du disque de base.",ex("e1cd.png","c) Pyramide coupée parallèlement à sa base ; d) cône coupé parallèlement à sa base",440))}</div>`,
   c:`<p><b>a)</b> Un <b>rectangle</b> de mêmes dimensions que la face ABCD.</p><p><b>b)</b> Un <b>rectangle</b> (l'une de ses dimensions est la hauteur du cylindre).</p><p><b>c)</b> Un <b>rectangle</b> : c'est une réduction de la base ABCD.</p><p><b>d)</b> Un <b>disque</b> (un cercle) de centre O' : c'est une réduction du disque de base.</p>`},
  {n:"Exercice 5", t:"Construire une section (au crayon de bois)", w:"Sur ta feuille", h:`<p><b>1)</b> Dans chaque cas, trace, en perspective cavalière, la section du cube par le plan passant par A et parallèle à la face colorée.</p>${ex("e2cube.png","a) cube avec A sur l'arête du haut de la face avant, face de droite colorée ; b) cube avec A sur l'arête verticale de gauche, face du dessus colorée",400)}
   <p><b>2)</b> Trace, en perspective cavalière, la section de la motte de beurre (un pavé droit) par le plan passant par les points A et B et parallèle à une arête verticale de la motte.</p>${ex("e2beurre.png","Motte de beurre : A et B sont sur la face du dessus",260)}`,
   c:`<div class="figs">${fig("a)",CUBE_A)}${fig("b)",CUBE_B)}</div><p><b>a)</b> Le plan est parallèle à la face de droite : la section est un <b>carré</b> identique à cette face, qui passe par A.</p><p><b>b)</b> Le plan est parallèle à la face du dessus : la section est un <b>carré</b> horizontal qui passe par A.</p><p><b>2)</b> On relie A et B sur la face du dessus, puis on trace deux segments verticaux depuis A et depuis B jusqu'à la face du dessous, et on les relie : la section est un <b>rectangle</b> dont une dimension est la hauteur de la motte.</p><p>Les côtés de la section qui sont sur des faces cachées sont en pointillés.</p>${fig("2)",BEURRE)}`},
  {n:"Exercice 6", t:"Section d'une sphère", w:"Sur ton cahier", h:`${ex("e3.png","Sphère de centre O coupée par un plan selon un cercle de centre A passant par B",170)}<p>S est une sphère de centre O et de rayon 10 cm.</p><p>Un plan coupe la sphère selon un cercle de centre A tel que OA = 8 cm.</p><p>Calcule le rayon [AB] de ce cercle.</p>`,
   c:`<p>Le triangle OAB est rectangle en A et OB = 10 cm (B est sur la sphère). D'après le théorème de Pythagore :</p><p class="calc">OB² = OA² + AB²<br>AB² = 10² − 8² = 100 − 64 = 36<br>AB = √36 = 6 cm</p><p>Le cercle de section a pour rayon <b>6 cm</b>.</p>`},
  {n:"Exercice 7", t:"Section d'un cône", w:"Sur ton cahier", h:`${ex("e4.png","Cône de sommet S et de base de centre O ; section parallèle à la base de centre I passant par B",130)}<p>Le cône C de sommet S et de base un disque de centre O est coupé par un plan parallèle à sa base.</p><p>La section est le cercle de centre I qui passe par B, point d'intersection du segment [SA] avec le plan.</p><p>On donne SO = 10 cm, OA = 7,5 cm et SI = 6 cm.</p><p>Calcule le rayon [IB] de cette section.</p>`,
   c:`<p>La section est une réduction de la base. Dans les triangles SIB et SOA, (IB) // (OA) : d'après le théorème de Thalès,</p><p class="calc">{SI/SO} = {IB/OA}<br>{6/10} = {IB/7,5}<br>IB = {6 × 7,5/10} = 4,5 cm</p><p>Le rayon de la section est <b>4,5 cm</b> (coefficient de réduction k = 0,6).</p>`},
  {n:"Exercice 8", t:"Section d'une pyramide", w:"Sur ton cahier", h:`${ex("e5.png","Pyramide SABCD à base carrée de hauteur [SO] ; section MNPQ parallèle à la base passant par I",170)}<p>SABCD est une pyramide à base carrée de côté 6 cm et de hauteur [SO] avec SO = 7,5 cm.</p><p>Un plan parallèle à la base coupe [SO] en I de sorte que SI = 3,9 cm. La section est le quadrilatère MNPQ.</p><p><b>1)</b> Calcule le volume V, en cm³, de la pyramide SABCD.</p><p><b>2)</b> V' est le volume, en cm³, de la pyramide SMNPQ.</p><p><b>a)</b> Exprime V' en fonction de V.</p><p><b>b)</b> Donne une valeur approchée de V' au centième près.</p><p><b>Rappel :</b> V<sub>pyramide</sub> = <span class="fr"><span>A<sub>base</sub> × h</span><span>3</span></span>.</p>`,
   c:`<p><b>1)</b></p><p class="calc">V = {6 × 6 × 7,5/3}<br>V = {270/3}<br>V = <b>90 cm³</b></p><p><b>2) a)</b> SMNPQ est une réduction de SABCD de coefficient k :</p><p class="calc">k = {SI/SO}<br>k = {3,9/7,5}<br>k = 0,52</p><p>Les volumes sont multipliés par k³ :</p><p class="calc">V' = 0,52³ × V<br>V' = 0,140608 × V</p><p><b>b)</b></p><p class="calc">V' = 0,140608 × 90<br>V' ≈ <b>12,65 cm³</b></p><p>Vérification : MNPQ est un carré de côté 0,52 × 6 = 3,12 cm, et :</p><p class="calc">V' = {3,12² × 3,9/3}<br>V' = 12,654 72<br>V' ≈ 12,65 cm³</p>`},
  {n:"Exercice 9", t:"La géode", w:"Sur ton cahier", h:`${ex("geode.jpg","Photo de la Géode à Paris",260)}<p>La Géode, salle de cinéma à Paris, est une sphère de 36 m de diamètre.</p><p>La partie visible au-dessus du sol est une calotte sphérique de 29 m de hauteur.</p><p>Calcule la surface au sol de ce bâtiment.</p>`,
   c:`<p>Le rayon de la sphère est 36 ÷ 2 = 18 m. Le sol coupe la sphère selon un disque. La distance du centre O au sol est 29 − 18 = 11 m.</p><p>Si r est le rayon du disque au sol, d'après le théorème de Pythagore :</p><p class="calc">18² = 11² + r²<br>r² = 324 − 121 = 203<br>r = √203 ≈ 14,25 m</p><p>Surface S au sol :</p><p class="calc">S = π × r²<br>S = 203π<br>S ≈ 637,7 m²</p><p>La surface au sol est d'environ <b>638 m²</b>.</p>`},
  {n:"Exercice 10", t:"Section de pavé", w:"Sur ton cahier", h:`${ex("heji.png","Pavé ABCDEFGH dans un repère : la section HEJI est hachurée",330)}<p>Sur la figure, ABCDEFGH est un pavé droit et HEJI est la section de ce pavé par un plan parallèle à l'arête [GF].</p><p>On donne : AB = 4 cm, AD = 2 cm, AE = 3 cm et IC = 1 cm.</p><p><b>1)</b> Quelle est la nature de la section HEJI ?</p><p><b>2)</b> Représente cette section en vraie grandeur.</p>`,
   c:`<p><b>1)</b> Le plan est parallèle à l'arête [GF] : la section HEJI est un <b>rectangle</b>, avec HE = GF = AD = 2 cm.</p><p><b>2)</b> Il faut la longueur EJ. J est sur [BF] avec BJ = IC = 1 cm, donc FJ = 3 − 1 = 2 cm. Le triangle EFJ est rectangle en F et EF = AB = 4 cm :</p><p class="calc">EJ² = EF² + FJ² = 4² + 2² = 16 + 4 = 20<br>EJ = √20 ≈ 4,5 cm</p><p>On trace un rectangle de 2 cm sur √20 ≈ 4,5 cm :</p>${rectVG(Math.sqrt(20),2,"√20 ≈ 4,5 cm","2 cm")}`},
  {n:"Exercice 11", t:"Exercices d'entraînement (sans rédaction parfaite)", w:"Sur ton cahier", h:`<div class="figs">${fig("1. Quelle est la longueur HB ? (AC = 8 cm, AH = 6 cm)",ex("t1.png","Sphère de centre A et de rayon AC = 8 cm, section de centre H avec AH = 6 cm",180))}${fig("2. Quelle est la longueur HA ? (AC = 20 cm, HB = 15 cm)",ex("t2.png","Sphère de centre A et de rayon AC = 20 cm, section de centre H et de rayon HB = 15 cm",180))}${fig("3. Détermine l'aire du disque gris. (SH = 2 cm, HO = 8 cm, OA = 4 cm)",ex("t3.png","Cône de sommet S : SH = 2 cm, HO = 8 cm, OA = 4 cm",170))}</div>
   <div class="figs">${fig("4. Quelle est la longueur HO ? (SH = 3,9 cm, HB = 3,5 cm, OA = 7 cm)",ex("t4.png","Cône de sommet S : SH = 3,9 cm, HB = 3,5 cm, OA = 7 cm",190))}${fig("5. Quelle est la longueur DE ? (rayon 6 cm, HB = 3,5 cm)",ex("t5.png","Cylindre de rayon 6 cm coupé parallèlement à son axe à 3,5 cm du centre",200))}${fig("6. Quelle est la longueur HB ? (rayon 4 cm, DE = 6 cm)",ex("t6.png","Cylindre de rayon 4 cm coupé parallèlement à son axe ; la section a pour largeur DE = 6 cm",200))}</div>`,
   c:`<p><b>1.</b> AHB rectangle en H et AB = 8 cm (rayon) : HB² = 8² − 6² = 28, donc HB = √28 ≈ <b>5,29 cm</b>.</p>
   <p><b>2.</b> AB = 20 cm (rayon) : HA² = 20² − 15² = 400 − 225 = 175, donc HA = √175 ≈ <b>13,23 cm</b>.</p>
   <p><b>3.</b> SO = 2 + 8 = 10 cm. Réduction de coefficient k :</p><p class="calc">k = {SH/SO}<br>k = {2/10}<br>k = 0,2</p><p class="calc">HB = 0,2 × 4<br>HB = 0,8 cm</p><p class="calc">A = π × 0,8²<br>A = 0,64π<br>A ≈ <b>2,01 cm²</b></p>
   <p><b>4.</b> {SH/SO} = {HB/OA} donc SO = {3,9 × 7/3,5} = 7,8 cm et HO = 7,8 − 3,9 = <b>3,9 cm</b>.</p>
   <p><b>5.</b> Le triangle BHE est rectangle en H avec BE = 6 cm (rayon) : HE² = 6² − 3,5² = 36 − 12,25 = 23,75, donc HE ≈ 4,87 cm.</p><p class="calc">DE = 2 × HE<br>DE = 2√23,75<br>DE ≈ <b>9,75 cm</b></p>
   <p><b>6.</b> La section est un rectangle : FG = DE = 6 cm, donc HF = 3 cm (H est le milieu de [FG]). BHF rectangle en H et BF = 4 cm : HB² = 4² − 3² = 7, donc HB = √7 ≈ <b>2,65 cm</b>.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Repérage dans le plan et dans un pavé", schema:S_PLAN, q:{
 1:[ {q:"Dans l'espace, un point est repéré par…", c:["trois coordonnées (x ; y ; z)","deux coordonnées (x ; y)","une abscisse"], rep:"trois coordonnées (x ; y ; z)", ex:"Abscisse, ordonnée et altitude.", sx:S_PLAN},
     {g:()=>{ const v=pick(["A","B","C","D","E","F","G","H"]), C={A:[0,0,0],B:[1,0,0],C:[1,1,0],D:[0,1,0],E:[0,0,1],F:[1,0,1],G:[1,1,1],H:[0,1,1]}; return {q:`ABCDEFGH est un pavé droit (voir la figure). Quelles sont les coordonnées de ${v} dans le repère (A ; B, D, E) ?`, fig:PAVE_C, c:Object.values(C).map(a=>P3(...a)).filter((x,i,a)=>a.indexOf(x)===i).filter(x=>x!==P3(...C[v])).sort(()=>Math.random()-0.5).slice(0,3).concat([P3(...C[v])]), rep:P3(...C[v]), ex:`${v} est à ${C[v][0]} sur l'axe (AB), ${C[v][1]} sur l'axe (AD) et ${C[v][2]} sur l'axe (AE).`, sx:S_PLAN}; }} ],
 2:[ {g:()=>{ const s=pick([["le milieu de [CG]",[1,1,0.5]],["le milieu de [AE]",[0,0,0.5]],["le milieu de [EF]",[0.5,0,1]],["le milieu de [BC]",[1,0.5,0]],["le centre de la face EFGH",[0.5,0.5,1]],["le centre de la face ABCD",[0.5,0.5,0]],["le milieu de [DH]",[0,1,0.5]]]); return {q:`Dans le pavé ABCDEFGH et le repère (A ; B, D, E), quelles sont les coordonnées du point K, ${s[0]} ?`, fig:PAVE_C, c:uniq(P3(...s[1]),[P3(...s[1].map(v=>v===0.5?1:v)),P3(...[s[1][1],s[1][0],s[1][2]]),P3(...[s[1][2],s[1][1],s[1][0]])]), rep:P3(...s[1]), ex:`On lit l'abscisse (selon [AB]), puis l'ordonnée (selon [AD]), puis l'altitude (selon [AE]) : K${P3(...s[1])}.`, sx:S_PLAN}; }} ],
 3:[ {g:()=>{ const a=ri(2,6), b=ri(2,5), c=ri(2,5), v=pick([["C",[a,b,0]],["F",[a,0,c]],["G",[a,b,c]],["H",[0,b,c]]]); return {q:`ABCDEFGH est un pavé droit avec AB = ${a} cm, AD = ${b} cm et AE = ${c} cm. Dans un repère d'origine A, d'axes (AB), (AD), (AE) et d'unité 1 cm, quelles sont les coordonnées de ${v[0]} ?`, c:uniq(P3(...v[1]),[P3(...[v[1][1],v[1][0],v[1][2]]),P3(1,1,1),P3(...v[1].map(x=>x?1:0))]), rep:P3(...v[1]), ex:`Avec l'unité 1 cm, on lit les longueurs : ${v[0]}${P3(...v[1])}.`, sx:S_PLAN}; }} ]
}},
{nom:"Latitude et longitude", schema:S_GEO, q:{
 1:[ {q:"La latitude d'un point exprime sa position…", c:["Nord-Sud par rapport à l'équateur","Ouest-Est par rapport au méridien de Greenwich","par rapport au pôle Nord"], rep:"Nord-Sud par rapport à l'équateur", ex:"La latitude va de 90°N à 90°S. La longitude, elle, va de 180°O à 180°E.", sx:S_GEO},
     {q:"Tous les points situés sur un même méridien ont la même…", c:["longitude","latitude","altitude"], rep:"longitude", ex:"Un méridien relie les pôles : longitude constante. Sur un parallèle, c'est la latitude qui est constante.", sx:S_GEO} ],
 2:[ {g:()=>{ let la,lo; do{ [la,lo]=gp(); }while(la===0&&lo===0); return {q:"Quelles sont les coordonnées géographiques du point K ?", fig:globe({pts:[["K",la,lo]],R:170,w:420}), c:uniq(GEO(la,lo),[GEO(-la||10,lo),GEO(la,-lo||10),GEO(lo>=-80&&lo<=80?lo:la,la)]), rep:GEO(la,lo), ex:`K est sur le parallèle ${LAT(la)} et sur le méridien ${LON(lo)} : K${GEO(la,lo)}.`, sx:S_GEO}; }} ],
 3:[ {g:()=>{ const P=shuf(CITIES).slice(0,1)[0]; return {q:`Sur ce planisphère, quelles sont les coordonnées du point ${P[0]} ?`, fig:plani({pts:[[P[0],P[1],P[2]]],k:1.6}), c:uniq(GEO(P[1],P[2]),[GEO(-P[1],P[2]),GEO(P[1],-P[2]),GEO(-P[1],-P[2])]), rep:GEO(P[1],P[2]), ex:`On lit d'abord la latitude (Nord ou Sud), puis la longitude (Ouest ou Est de Greenwich) : ${P[0]}${GEO(P[1],P[2])}.`, sx:S_GEO}; }} ]
}},
{nom:"Nature d'une section", schema:S_SEC, q:{
 1:[ {g:()=>{ const s=pick(NAT); return {q:`On coupe ${s[0]} par un plan ${s[1]}. La section est…`, c:uniq(s[2],shuf(NATC.filter(x=>x!==s[2]&&!(NATX[s[2]]||[]).includes(x))).slice(0,3)), rep:s[2], ex:`D'après le cours : ${s[0]} coupé${s[0].startsWith("une")?"e":""} par un plan ${s[1]} donne ${s[2]}.`, sx:S_SEC}; }} ],
 2:[ {q:"On appelle section d'un solide par un plan…", c:["l'intersection de ce solide avec ce plan","la base du solide","le patron du solide"], rep:"l'intersection de ce solide avec ce plan", sx:S_SEC},
     {q:"Une sphère de centre O est coupée par un plan qui passe par O. La section est…", c:["un grand cercle (de même rayon que la sphère)","un point","un cercle plus petit"], rep:"un grand cercle (de même rayon que la sphère)", ex:"Si le plan passe par le centre, on obtient un grand cercle.", sx:S_SEC} ],
 3:[ {g:()=>{ const L=ri(3,8), l=ri(2,6), h=ri(2,7); return {q:`Un pavé droit de dimensions ${L} cm × ${l} cm × ${h} cm est coupé par un plan parallèle à sa face de ${L} cm × ${h} cm. Quelles sont les dimensions de la section ?`, c:uniq(`${L} cm × ${h} cm`,[`${L} cm × ${l} cm`,`${l} cm × ${h} cm`]), rep:`${L} cm × ${h} cm`, ex:"Parallèle à une face : un rectangle de mêmes dimensions que la face.", sx:S_SEC}; }} ]
}},
{nom:"Calculer dans une section", schema:S_SPH, q:{
 1:[ {g:()=>{ const [a,b,c]=pick([[3,4,5],[6,8,10],[5,12,13],[9,12,15],[8,15,17]]); return {q:`Une sphère de rayon ${c} cm est coupée par un plan situé à ${a} cm de son centre. Quel est le rayon du cercle de section (en cm) ?`, rep:[String(b),b+" cm"], ex:`Pythagore : r² = ${c}² − ${a}² = ${c*c} − ${a*a} = ${b*b}, donc r = ${b} cm.`, sx:S_SPH}; }} ],
 2:[ {g:()=>{ let R,d; do{ R=ri(5,20); d=ri(1,R-1); }while(Number.isInteger(Math.sqrt(R*R-d*d))); const r=Math.sqrt(R*R-d*d); return {q:`Une sphère de rayon ${R} cm est coupée par un plan situé à ${d} cm de son centre. Rayon du cercle de section, arrondi au dixième (en cm) ?`, rep:[F(r,1),F(r,1)+" cm"], ex:`r² = ${R}² − ${d}² = ${R*R-d*d}, donc r = √${R*R-d*d} ≈ ${F(r,1)} cm.`, sx:S_SPH}; }} ],
 3:[ {g:()=>{ const SO=ri(8,15), k=pick([0.2,0.4,0.5,0.6,0.8]), OA=ri(3,9), SI=rd(SO*k); return {q:`Un cône de hauteur SO = ${SO} cm et de rayon OA = ${OA} cm est coupé par un plan parallèle à sa base, à SI = ${F(SI)} cm du sommet. Quel est le rayon de la section (en cm) ?`, rep:[F(OA*k),F(OA*k)+" cm"], ex:`<br>k = {SI/SO}<br>k = {${F(SI)}/${SO}}<br>k = ${F(k)}<br>rayon = ${F(k)} × ${OA}<br>rayon = ${F(OA*k)} cm`, sx:S_RED}; }},
     {g:()=>{ const k=pick([0.5,0.4,0.3,0.2]), V=ri(2,9)*50; return {q:`Une pyramide de volume ${V} cm³ est coupée parallèlement à sa base. La petite pyramide est une réduction de coefficient ${F(k)}. Quel est son volume (en cm³) ?`, rep:[F(V*k**3),F(V*k**3)+" cm³"], ex:`Les volumes sont multipliés par k³ :<br>V' = ${F(k)}³ × ${V}<br>V' = ${F(k**3)} × ${V}<br>V' = ${F(V*k**3)} cm³`, sx:S_RED}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
  const GE=[["A",30,-20],["B",50,20],["C",-10,40],["D",0,-30]];
  const PV=pave({L:1.6,P:1,H:1,k:120,names:{"000":"R","100":"S","110":"T","010":"U","001":"V","101":"W","111":"X","011":"Y"},axes:[["000","100",RED],["000","010",GRN],["000","001",BLUE]],pts:[["K",0.8,0,1,0,-10]],alt:"Pavé droit RSTUVWXY ; K est le milieu de [VW]"});
  return {
titre:"Évaluation d'entraînement · chapitre 22", duree:45, info:"Durée : 45 min · Calculatrice autorisée",
comp:[
  ["REPRÉSENTER","Je lis des coordonnées géographiques sur un globe.","Ex. 1 (5 points)"],
  ["REPRÉSENTER","Je lis des coordonnées dans un pavé droit.","Ex. 2 (4 points)"],
  ["CONNAÎTRE","Je connais la nature des sections planes des solides.","Ex. 3 (3 points)"],
  ["CALCULER","Je calcule une longueur ou un volume dans une section.","Ex. 4 et 5 (8 points)"]
],
exos:[
{t:"Sur le globe", p:5, h:`${globe({pts:GE,lat0:20,lon0:5})}<p><b>1)</b> Donne les coordonnées géographiques des points A, B, C et D.</p><p><b>2)</b> Lequel de ces points est sur l'équateur ?</p><p><b>3)</b> Un point E a la même longitude que A et la même latitude que C. Donne ses coordonnées.</p>`,
 c:`<p><b>1)</b> A(30°N ; 20°O) ; B(50°N ; 20°E) ; C(10°S ; 40°E) ; D(0° ; 30°O). <i>(0,75 point par point, soit 3 points)</i></p><p><b>2)</b> D : sa latitude est 0°. <i>(0,5 point)</i></p><p><b>3)</b> E(10°S ; 20°O). <i>(1,5 point)</i></p>`},
{t:"Dans un pavé droit", p:4, h:`${PV}<p>RSTUVWXY est un pavé droit. On utilise le repère (R ; S, U, V).</p><p><b>1)</b> Donne les coordonnées des points S, T et X.</p><p><b>2)</b> K est le milieu de [VW]. Donne ses coordonnées.</p><p><b>3)</b> Quel sommet a pour coordonnées (0 ; 1 ; 1) ?</p>`,
 c:`<p><b>1)</b> S(1 ; 0 ; 0) ; T(1 ; 1 ; 0) ; X(1 ; 1 ; 1). <i>(0,5 point chacun, soit 1,5 point)</i></p><p><b>2)</b> K(0,5 ; 0 ; 1). <i>(1,5 point)</i></p><p><b>3)</b> Y. <i>(1 point)</i></p>`},
{t:"Nature des sections", p:3, h:`<p>Donne la nature de chaque section.</p><p><b>a)</b> Un cylindre coupé par un plan parallèle à sa base.</p><p><b>b)</b> Une pyramide à base triangulaire coupée par un plan parallèle à sa base.</p><p><b>c)</b> Un pavé droit coupé par un plan parallèle à une de ses arêtes.</p>`,
 c:`<p><b>a)</b> Un disque de même rayon que la base. <b>b)</b> Un triangle, réduction de la base. <b>c)</b> Un rectangle.</p><p><i>(1 point par réponse)</i></p>`},
{t:"La boule de bowling", p:4, h:`<p>Une boule de rayon 12 cm est coupée par un plan situé à 7 cm de son centre O. La section est un disque de centre H.</p><p><b>1)</b> Calcule le rayon de ce disque. Arrondis au dixième.</p><p><b>2)</b> Calcule l'aire de ce disque. Arrondis à l'unité.</p>`,
 c:`<p><b>1)</b> Si M est un point du bord du disque, OHM est rectangle en H avec OM = 12 cm et OH = 7 cm. D'après le théorème de Pythagore :</p><p class="calc">HM² = 12² − 7² = 144 − 49 = 95<br>HM = √95 ≈ 9,7 cm</p><p><i>(2,5 points)</i></p><p><b>2)</b></p><p class="calc">A = π × HM²<br>A = 95π<br>A ≈ 298 cm²</p><p><i>(1,5 point)</i></p>`},
{t:"Le cône de glace", p:4, h:`<p>Un cône de sommet S a pour hauteur SO = 12 cm et pour rayon de base OA = 5 cm.</p><p>On le coupe par un plan parallèle à sa base qui passe par le point I de [SO] tel que SI = 9 cm.</p><p><b>1)</b> Quelle est la nature de la section ?</p><p><b>2)</b> Calcule le coefficient de réduction, puis le rayon IB de la section.</p><p><b>3)</b> Le grand cône a un volume de 100π cm³. Calcule la valeur exacte du volume du petit cône.</p>`,
 c:`<p><b>1)</b> Un disque de centre I : une réduction du disque de base. <i>(0,5 point)</i></p><p><b>2)</b></p><p class="calc">k = {SI/SO}<br>k = {9/12}<br>k = 0,75</p><p class="calc">IB = 0,75 × 5<br>IB = 3,75 cm</p><p><i>(2 points)</i></p><p><b>3)</b></p><p class="calc">V' = k³ × V<br>V' = 0,75³ × 100π<br>V' = 0,421875 × 100π<br>V' = 42,1875π cm³<br>V' ≈ 132,5 cm³</p><p><i>(1,5 point)</i></p>`}
]}; })()
};
})();
