/* 5e — Chapitre 15 : Géométrie dans l'espace (cours et fiche d'exercices de M. Staal)
   Solides en perspective cavalière, patrons, pile de cubes : dessinés en SVG à partir des dimensions
   (ce qui est dessiné correspond exactement au texte). Les images du Word sont reprises quand elles sont nettes. */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const rd = (x,k=3) => Math.round(x*10**k)/10**k;
const N = (x,k=3) => { const v=rd(x,k); const [i,d]=String(Math.abs(v)).split("."); return (v<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const F = (a,b) => `{${a}/${b}}`;
const PI = "<i>π</i>";
/* calcul en chaîne (choix de M. Staal) : une étape par ligne, chaque ligne commence par le nom de la grandeur ; « ≈ … » pour une valeur arrondie */
const KCl = (n, L) => L.map(String).filter((x,i,a)=>i===0||x!==a[i-1]).map(x=>/^≈/.test(String(x))?`${n} ${x}`:`${n} = ${x}`).join("<br>");
const KC = (n, L) => `<p class="calc">${KCl(n,L)}</p>`;
const KCi = (n, L) => `<span class="calc" style="display:block;margin:6px 0">${KCl(n,L)}</span>`;
const co = (p,alt,w) => img("5k15co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("5k15ex/"+p+".png", alt, w);
const cr = (p,alt,w) => img("5k15cr/"+p+".png", alt, w);

const FACE = "fill:color-mix(in srgb,var(--c) 13%,var(--surface))", DASH = "stroke-dasharray:6 5";
const LAB = "font-size:15px;fill:var(--c);font-weight:600";
const fx = v => v.toFixed(1);
/* enveloppe : points [[x,y]] → viewBox avec une marge */
const box = (P, pad=34) => { const xs=P.map(p=>p[0]), ys=P.map(p=>p[1]); const x0=Math.min(...xs)-pad, y0=Math.min(...ys)-pad, w=Math.max(...xs)-Math.min(...xs)+2*pad, h=Math.max(...ys)-Math.min(...ys)+2*pad; return {x0,y0,w,h}; };
const svgOpen = (B, alt, maxw) => `<svg class="fig" viewBox="${fx(B.x0)} ${fx(B.y0)} ${fx(B.w)} ${fx(B.h)}" width="${Math.round(Math.min(B.w, maxw||9999))}" role="img" aria-label="${alt}">`;
const seg = (a,b,hid) => `<line x1="${fx(a[0])}" y1="${fx(a[1])}" x2="${fx(b[0])}" y2="${fx(b[1])}" class="ln"${hid?` style="${DASH};stroke-width:1.6"`:""}/>`;
const txt = (x,y,t,st="",a="middle") => `<text x="${fx(x)}" y="${fx(y)}" text-anchor="${a}" style="${LAB};${st}">${t}</text>`;

/* ------------------------------------------------------------------
   Solides en perspective cavalière (angle 45°, coefficient 1/2), u = pixels par cm
   pave : {L, l, h} (cube : L = l = h) · prisme : base triangle rectangle de côtés p (horizontal) et q (vertical), longueur L
   cyl : {r, h} (axe vers l'arrière) · lab : textes écrits le long des arêtes
------------------------------------------------------------------ */
function solid(type, o){
  const u=o.u||30, alt=o.alt||"Solide en perspective cavalière", lab=o.lab||{};
  const depth = type==="cyl" ? o.h : type==="prisme" ? o.L : o.l, k=depth*u*0.5/Math.SQRT2, D=([x,y])=>[x+k,y-k];
  let body="", P=[];
  if(type==="pave"){
    const A=[0,0], B=[o.L*u,0], C=[o.L*u,-o.h*u], Dd=[0,-o.h*u], A2=D(A), B2=D(B), C2=D(C), D2=D(Dd);
    body+=`<polygon points="${[A,B,C,Dd].map(p=>p.map(fx).join(",")).join(" ")}" style="${FACE}"/>`;
    body+=seg(A2,B2,1)+seg(A2,D2,1)+seg(A,A2,1)+seg(A,B)+seg(B,C)+seg(C,Dd)+seg(Dd,A)+seg(Dd,D2)+seg(C,C2)+seg(B,B2)+seg(D2,C2)+seg(C2,B2);
    if(lab.L) body+=txt(o.L*u/2, 24, lab.L);
    if(lab.h) body+=txt(-10, -o.h*u/2+5, lab.h, "", "end");
    if(lab.l){ const m=[(B[0]+B2[0])/2+15, (B[1]+B2[1])/2+15]; body+=`<text transform="translate(${fx(m[0])} ${fx(m[1])}) rotate(-45)" text-anchor="middle" style="${LAB}">${lab.l}</text>`; }
    P=[A,B,C,Dd,A2,B2,C2,D2];
  } else if(type==="prisme"){
    /* o.s : décalage du sommet (en cm, 0 = triangle rectangle) ; il doit rester inférieur à q pour que les arêtes cachées soient les mêmes */
    const sx=(o.s||0)*u, A=[0,0], B=[o.p*u,0], C=[sx,-o.q*u], A2=D(A), B2=D(B), C2=D(C);
    body+=`<polygon points="${[A,B,C].map(p=>p.map(fx).join(",")).join(" ")}" style="${FACE}"/>`;
    body+=seg(A2,B2,1)+seg(A2,C2,1)+seg(A,A2,1)+seg(A,B)+seg(B,C)+seg(C,A)+seg(B,B2)+seg(C,C2)+seg(B2,C2);
    if(lab.t) body+=`<line x1="${fx(sx)}" y1="${fx(-o.q*u)}" x2="${fx(sx)}" y2="0" style="stroke:var(--c);stroke-width:1.6"/><polyline points="${fx(sx)},-9 ${fx(sx+9)},-9 ${fx(sx+9)},0" style="fill:none;stroke:var(--c);stroke-width:1.4"/>`+txt(sx/2-8, -o.q*u/2+5, lab.t, "", "end");
    if(lab.p) body+=txt(o.p*u/2, 24, lab.p);
    if(lab.q) body+=txt(-10, -o.q*u/2+5, lab.q, "", "end");
    if(lab.r){ const a=Math.atan2(o.q,o.p)*180/Math.PI, nn=Math.hypot(o.p,o.q), m=[o.p*u/2+9*o.q/nn, -o.q*u/2-9*o.p/nn]; body+=`<text transform="translate(${fx(m[0])} ${fx(m[1])}) rotate(${fx(a)})" text-anchor="middle" style="${LAB}">${lab.r}</text>`; }
    if(lab.L){ const m=[(B[0]+B2[0])/2+12, (B[1]+B2[1])/2+12]; body+=`<text transform="translate(${fx(m[0])} ${fx(m[1])}) rotate(-45)" text-anchor="middle" style="${LAB}">${lab.L}</text>`; }
    P=[A,B,C,A2,B2,C2];
  } else { /* cylindre */
    const R=o.r*u, F0=[0,0], B0=D(F0), n=1/Math.SQRT2;
    const p1=[B0[0]+R*n, B0[1]+R*n], p2=[B0[0]-R*n, B0[1]-R*n], q1=[R*n, R*n], q2=[-R*n, -R*n];
    body+=`<path d="M${fx(p1[0])} ${fx(p1[1])} A${fx(R)} ${fx(R)} 0 0 1 ${fx(p2[0])} ${fx(p2[1])}" class="ln" style="${DASH};stroke-width:1.6"/>`;
    body+=`<path d="M${fx(p2[0])} ${fx(p2[1])} A${fx(R)} ${fx(R)} 0 0 1 ${fx(p1[0])} ${fx(p1[1])}" class="ln"/>`;
    body+=seg(q1,p1)+seg(q2,p2);
    body+=`<circle cx="0" cy="0" r="${fx(R)}" class="ln" style="${FACE}"/>`;
    if(lab.r){ body+=seg([0,0],[R,0],0).replace('class="ln"','class="ln" style="stroke:var(--c);stroke-width:1.6"')+txt(R*0.45, -8, lab.r, "font-size:13px"); }
    if(lab.h){ const m=[(q1[0]+p1[0])/2+12, (q1[1]+p1[1])/2+12]; body+=`<text transform="translate(${fx(m[0])} ${fx(m[1])}) rotate(-45)" text-anchor="middle" style="${LAB}">${lab.h}</text>`; }
    P=[[-R,-R],[R,R],[B0[0]+R,B0[1]-R],[B0[0]-R,B0[1]+R]];
  }
  const B=box(P, Object.keys(lab).length ? Math.max(o.pad||36, 78) : (o.pad||36));
  return svgOpen(B, alt, o.maxw)+body+"</svg>";
}

/* ------------------------------------------------------------------
   Patron du pavé (bande de quatre rectangles L×h, l×h, L×h, l×h, et deux rectangles L×l
   au-dessus et en dessous du premier) — u pixels par cm
------------------------------------------------------------------ */
function patPave(L,l,h,u=26){
  const R=(x,y,w,hh,t)=>`<rect x="${fx(x*u)}" y="${fx(y*u)}" width="${fx(w*u)}" height="${fx(hh*u)}" class="ln" style="${FACE}"/>`+(t?`<text x="${fx((x+w/2)*u)}" y="${fx((y+hh/2)*u+5)}" text-anchor="middle" style="font-size:14px;fill:var(--ink)">${t}</text>`:"");
  const W=(2*L+2*l)*u, H=(2*l+h)*u;
  let s=`<svg class="fig" viewBox="-30 -10 ${fx(W+44)} ${fx(H+20)}" width="${Math.round(Math.min(W+44,560))}" role="img" aria-label="Patron d'un pavé droit de ${N(L)} cm sur ${N(l)} cm sur ${N(h)} cm">`;
  s+=R(0,0,L,l,`${N(L)} × ${N(l)}`)+R(0,l,L,h,`${N(L)} × ${N(h)}`)+R(L,l,l,h,`${N(l)} × ${N(h)}`)+R(L+l,l,L,h,`${N(L)} × ${N(h)}`)+R(2*L+l,l,l,h,`${N(l)} × ${N(h)}`)+R(0,l+h,L,l,`${N(L)} × ${N(l)}`);
  return s+"</svg>";
}

/* ------------------------------------------------------------------
   Patron du prisme droit à base triangle rectangle (côtés de l'angle droit p et q, hypoténuse r, longueur L)
   v = textes [a, b, c, d] écrits sur le patron (lettres ou longueurs)
------------------------------------------------------------------ */
function patPrisme(p,q,r,L,v,u=24){
  const y0=p*u, X=[0,p*u,(p+q)*u,(p+q+r)*u], H=L*u;
  let s=`<svg class="fig" viewBox="-44 -12 ${fx(X[3]+60)} ${fx(2*p*u+H+24)}" width="${Math.round(Math.min(X[3]+60,520))}" role="img" aria-label="Patron d'un prisme droit à base triangulaire">`;
  [[0,1],[1,2],[2,3]].forEach(([a,b])=>{ s+=`<rect x="${fx(X[a])}" y="${fx(y0)}" width="${fx(X[b]-X[a])}" height="${fx(H)}" class="ln" style="${FACE}"/>`; });
  s+=`<polygon points="${fx(X[1])},${fx(y0)} ${fx(X[2])},${fx(y0)} ${fx(X[1])},0" class="ln" style="${FACE}"/>`;
  s+=`<polygon points="${fx(X[1])},${fx(y0+H)} ${fx(X[2])},${fx(y0+H)} ${fx(X[1])},${fx(y0+H+p*u)}" class="ln" style="${FACE}"/>`;
  s+=txt(X[1]/2, y0-8, v[0])+txt(-8, y0+H/2+5, v[1], "", "end")+txt((X[2]+X[3])/2, y0-8, v[2])+txt(X[1]-8, y0/2+5, v[3], "", "end");
  return s+"</svg>";
}

/* pile de cubes vue de dessus : grille de nombres */
function pile(g, u=46){
  const n=g.length, m=g[0].length;
  let s=`<svg class="fig" viewBox="-4 -4 ${m*u+8} ${n*u+8}" width="${m*u+8}" role="img" aria-label="Pile de cubes vue de dessus">`;
  g.forEach((row,i)=>row.forEach((v,j)=>{ s+=`<rect x="${j*u}" y="${i*u}" width="${u}" height="${u}" class="ln" style="${v?FACE:"fill:var(--surface)"}"/><text x="${j*u+u/2}" y="${i*u+u/2+7}" text-anchor="middle" style="font-size:20px;fill:var(--ink)">${v}</text>`; }));
  return s+"</svg>";
}

/* ------------------------------------------------------------------
   Figures de six carrés numérotées (patrons de cube ou non) · mark[i] : true / false pour la correction
------------------------------------------------------------------ */
function nets(list, mark){
  const c=24, sw=165, sh=142, cols=Math.min(3,list.length), rows=Math.ceil(list.length/cols);
  let s=`<svg class="fig" viewBox="0 0 ${cols*sw} ${rows*sh}" width="${cols*sw}" role="img" aria-label="Six figures formées de six carrés">`;
  list.forEach((cells,i)=>{ const ox=(i%cols)*sw+28, oy=Math.floor(i/cols)*sh+14, ok=mark?mark[i]:null;
    s+=`<text x="${ox-20}" y="${oy+16}" style="font-size:18px;font-weight:700;fill:var(--ink)">${i+1}</text>`;
    cells.forEach(([x,y])=>{ s+=`<rect x="${ox+6+x*c}" y="${oy+y*c}" width="${c}" height="${c}" style="fill:${ok===true?"color-mix(in srgb,var(--c) 35%,var(--surface))":ok===false?"color-mix(in srgb,var(--ink) 8%,var(--surface))":"color-mix(in srgb,var(--c) 13%,var(--surface))"};stroke:var(--ink);stroke-width:1.8"/>`; });
    if(ok!==null && ok!==undefined) s+=`<text x="${ox+6}" y="${oy+(Math.max(...cells.map(p=>p[1]))+1)*c+20}" style="font-size:15px;font-weight:700;fill:${ok?"var(--c)":"var(--muted)"}">${ok?"patron":"pas un patron"}</text>`;
  });
  return s+"</svg>";
}
/* les 11 patrons du cube et des figures de six carrés qui n'en sont pas (vérifiés par pliage) */
const NETS_OK = [[[0,0],[0,1],[1,1],[1,2],[2,1],[3,1]],[[0,0],[0,1],[1,1],[2,1],[2,2],[3,1]],[[0,1],[1,0],[1,1],[1,2],[2,1],[3,1]],[[0,0],[0,1],[0,2],[1,1],[2,1],[3,1]],[[0,1],[1,0],[1,1],[2,1],[2,2],[3,1]],[[0,0],[1,0],[1,1],[2,1],[2,2],[3,2]],[[0,0],[1,0],[2,0],[2,1],[3,1],[4,1]],[[0,0],[1,0],[1,1],[1,2],[2,1],[3,1]],[[0,0],[1,0],[1,1],[2,1],[2,2],[3,1]],[[0,0],[0,1],[1,1],[2,1],[3,1],[3,2]],[[0,0],[0,1],[1,1],[2,1],[2,2],[3,2]]];
const NETS_KO = [[[0,0],[1,0],[1,1],[2,0],[2,1],[3,0]],[[0,0],[0,1],[0,2],[1,0],[1,1],[2,0]],[[0,0],[1,0],[1,1],[1,2],[2,2],[3,2]],[[0,0],[0,1],[0,2],[1,0],[1,2],[2,0]],[[0,0],[1,0],[2,0],[2,1],[2,2],[3,1]],[[0,0],[0,1],[1,0],[2,0],[2,1],[3,1]],[[0,0],[0,1],[1,0],[1,1],[2,0],[3,0]],[[0,0],[1,0],[1,1],[2,1],[3,1],[4,1]],[[0,0],[0,1],[1,1],[1,2],[2,2],[3,2]],[[0,0],[0,1],[1,0],[2,0],[3,0],[4,0]],[[0,0],[0,1],[1,0],[2,0],[2,1],[3,0]],[[0,0],[1,0],[1,1],[2,0],[3,0],[4,0]],[[0,0],[1,0],[1,1],[2,0],[2,1],[3,1]],[[0,0],[0,1],[1,0],[1,1],[2,0],[2,1]],[[0,0],[1,0],[2,0],[2,1],[3,0],[4,0]],[[0,0],[1,0],[1,1],[1,2],[2,0],[3,0]],[[0,0],[0,1],[0,2],[1,0],[2,0],[3,0]],[[0,0],[0,1],[1,0],[2,0],[3,0],[3,1]]];
/* même figure tournée ou retournée (reste un patron ou non) */
const turn = cells => { let c=cells.map(p=>[...p]); if(Math.random()<0.5) c=c.map(([x,y])=>[-x,y]); for(let k=ri(0,3);k>0;k--) c=c.map(([x,y])=>[y,-x]);
  const mx=Math.min(...c.map(p=>p[0])), my=Math.min(...c.map(p=>p[1])); c=c.map(([x,y])=>[x-mx,y-my]);
  if(Math.max(...c.map(p=>p[1]))>Math.max(...c.map(p=>p[0]))) c=c.map(([x,y])=>[y,x]); return c; };

/* outils réutilisés par la fiche d'entraînement */
window.GEO15 = {solid, patPave, patPrisme, pile, nets, NETS_OK, NETS_KO, turn, N, F, rd, PI, KC, KCi};

/* ===================== figures de la fiche ===================== */
const E2N = [[[1,0],[0,1],[1,1],[2,1],[3,1],[1,2]],[[0,0],[1,0],[2,0],[3,0],[0,1],[1,1]],[[0,0],[1,0],[1,1],[2,1],[2,2],[3,2]],[[0,0],[1,0],[2,0],[0,1],[0,2],[1,2]],[[1,0],[0,1],[1,1],[2,1],[1,2],[1,3]],[[1,0],[0,1],[1,1],[2,1],[1,2],[2,2]]];
const E2ok = [true,false,true,false,true,false];
const E5G = [[3,1,0],[2,2,1],[1,0,0]];

/* ===================== schémas (rappels en image) ===================== */
const S_SOL = sch("Les solides du chapitre", `<div class="figs">${solid("pave",{L:3,l:2,h:1.6,u:26,pad:14})}${solid("prisme",{p:2.2,q:1.8,L:2.4,u:26,pad:14})}${solid("cyl",{r:1,h:2.4,u:26,pad:14})}</div><p class="schN">Pavé droit, cube et prisme droit : deux bases polygones, faces latérales rectangles. Cylindre : deux bases disques.</p>`);
const S_CAV = sch("Perspective cavalière", solid("pave",{L:4,l:3,h:2,u:30,lab:{L:"4 cm",h:"2 cm",l:"1,5 cm"}})+`<p class="schN">Face avant en vraie grandeur. Arêtes fuyantes à 45°, réduites de moitié : 3 cm → 1,5 cm. Arêtes cachées en pointillés.</p>`);
const S_PAT = sch("Patrons", `${nets([NETS_OK[2]]).replace(/<text[^>]*>1<\/text>/,"")}<p class="schN">Un patron se découpe et se plie pour fabriquer le solide. Cylindre : deux disques et un rectangle. Prisme droit : deux bases et autant de rectangles que la base a de côtés.</p>`);
const S_DISQ = sch("Aire d'un disque", `<p class="calc">A = ${PI} × r × r<br>r = 3 cm :<br>A = ${PI} × 3²<br>A = 9${PI}<br>A ≈ 28,3 cm²</p><p class="schN">Si on donne le diamètre, on le divise par 2 pour avoir le rayon.</p>`);
const S_VOL = sch("Volumes", `<p class="calc">Prisme droit, cylindre : V = aire de la base × hauteur<br>Pavé : V = L × l × h &nbsp; Cube : V = c³<br>Cylindre : V = ${PI} × r² × h</p>`);
const S_UNIT = sch("Unités de volume et de capacité", `<p class="calc">1 m³ = 1 000 dm³ = 1 000 L<br>1 dm³ = 1 000 cm³ = 1 L<br>1 cm³ = 1 mL &nbsp; 1 L = 100 cL = 1 000 mL</p>`);

/* ---------- générateurs ---------- */
const SOLN = {pave:"pavé droit", cube:"cube", prisme:"prisme droit", cyl:"cylindre"};
function solFig(t){ if(t==="pave"){ const d=shuf([ri(35,50)/10, ri(18,30)/10, ri(10,16)/10]); return solid("pave",{L:d[0],l:d[1],h:d[2],u:30}); }
  if(t==="cube"){ const c=ri(20,30)/10; return solid("pave",{L:c,l:c,h:c,u:30}); }
  if(t==="prisme") return solid("prisme",{p:ri(20,35)/10,q:ri(20,35)/10,L:ri(25,40)/10,u:30});
  return solid("cyl",{r:ri(10,16)/10,h:ri(25,40)/10,u:30}); }
const POLY = [["triangle",3],["quadrilatère",4],["pentagone",5],["hexagone",6]];

CH["5e-15"] = {
intro:"Reconnaître et représenter en perspective cavalière le pavé droit, le cube, le prisme droit et le cylindre, relier un solide et son patron, calculer l'aire d'un disque et des volumes, et convertir des unités de volume et de capacité.",
savoir:[
  "reconnaître et représenter en perspective cavalière un pavé droit, un cube, un prisme droit, un cylindre ;",
  "relier un solide et son patron ;",
  "calculer l'aire d'un disque ;",
  "calculer le volume d'un cube, d'un pavé droit, d'un prisme droit, d'un cylindre ;",
  "convertir des unités de volume et de capacité."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Reconnaître et représenter des solides", h:`
  ${co("solides","Un pavé droit, un cube, un prisme droit et un cylindre en perspective cavalière",640)}
  <div class="retenir" data-l="Définition"><p>Un <b>prisme droit</b> est un solide qui a :</p><ul><li>deux faces parallèles et superposables : les <b>bases</b>, qui sont des polygones ;</li><li>d'autres faces (les <b>faces latérales</b>) qui sont des rectangles.</li></ul><p>Le <b>pavé droit</b> et le <b>cube</b> sont des prismes droits.</p>
   <p>Un <b>cylindre de révolution</b> est un solide qui a deux bases qui sont des disques identiques et parallèles, et une surface latérale courbe.</p></div>
  <h4>Perspective cavalière</h4>
  <div class="retenir" data-l="Méthode"><p>Pour représenter un solide sur une feuille :</p><ul><li>les faces <b>parallèles au plan de la feuille</b> (faces « de face ») sont dessinées en <b>vraie grandeur</b> ;</li><li>les arêtes qui partent « vers l'arrière » (<b>fuyantes</b>) sont dessinées parallèles entre elles, avec un angle donné (souvent 45°), et réduites par un <b>coefficient</b> (souvent ${F(1,2)}) ;</li><li>les arêtes <b>cachées</b> sont en <b>pointillés</b>.</li></ul></div>`},
{k:"II", t:"Patrons", h:`
  <div class="retenir" data-l="Définition"><p>Un <b>patron</b> d'un solide est une figure plane qui, une fois découpée et pliée, permet de fabriquer ce solide.</p></div>
  ${co("patrons","Patrons d'un pavé droit, d'un prisme droit et d'un cylindre",640)}
  <div class="retenir" data-l="À retenir"><p>Le patron d'un <b>cylindre</b> est formé de deux disques et d'un rectangle. Une dimension du rectangle est la hauteur du cylindre ; l'autre est le périmètre du disque de base.</p>
   <p>Le patron d'un <b>prisme droit</b> est formé de deux bases et d'autant de rectangles que la base a de côtés.</p></div>`},
{k:"III", t:"Aire du disque et volumes", h:`
  <h4>1. Aire d'un disque</h4>
  <div class="retenir" data-l="Définition"><p>L'<b>aire d'un disque</b> de rayon <i>r</i> est :</p><p class="calc"><i>A</i> = ${PI} × <i>r</i> × <i>r</i> = ${PI}<i>r</i>²</p></div>
  <p><b>Exemple :</b> pour <i>r</i> = 3 cm :</p>${KC("<i>A</i>",[`${PI} × 3²`,`9${PI}`,"≈ 28,3 cm²"])}
  <h4>2. Volumes</h4>
  <div class="retenir" data-l="Définition"><p>Le volume d'un <b>prisme droit</b> (ou d'un <b>cylindre</b>) est :</p><p class="calc"><i>V</i> = aire de la base × hauteur</p>
   <p>Pavé droit de longueur <i>L</i>, largeur <i>l</i>, hauteur <i>h</i> : <i>V</i> = <i>L</i> × <i>l</i> × <i>h</i></p><p>Cube d'arête <i>c</i> : <i>V</i> = <i>c</i>³</p><p>Cylindre de rayon <i>r</i> : <i>V</i> = ${PI}<i>r</i>² × <i>h</i></p></div>
  <p><b>Exemple :</b> le volume <i>V</i> d'un cylindre de rayon 5 cm et de hauteur 10 cm :</p>${KC("<i>V</i>",[`${PI} × 5² × 10`,`250${PI}`,"≈ 785 cm³"])}
  <h4>3. Unités</h4>
  <div class="retenir" data-l="À retenir"><div class="scroll"><table class="std"><thead><tr><th>m³</th><th>dm³</th><th>cm³</th></tr></thead><tbody><tr><td>1 m³ = 1 000 dm³</td><td>1 dm³ = 1 000 cm³</td><td>1 L = 1 dm³</td></tr><tr><td>1 L = 100 cL = 1 000 mL</td><td>1 mL = 1 cm³</td><td>1 m³ = 1 000 L</td></tr></tbody></table></div></div>
  <p><b>À toi de jouer :</b> calcule le volume d'un pavé de 5 cm sur 4 cm sur 3 cm, et exprime-le en mL.</p>
  <details><summary>Voir la correction</summary><div class="corr"><p class="calc">V = 5 × 4 × 3<br>V = 60 cm³<br>V = 60 mL</p><p>(car 1 cm³ = 1 mL)</p></div></details>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Reconnaître et représenter des solides", e:[
  {n:"Activité 1", t:"Reconnaître des solides", w:"Sur ta feuille", h:`${ex("act1","Quatre solides A, B, C et D en perspective cavalière",640)}
   <p><b>1)</b> Donne le nom de chaque solide : A : ……… B : ……… C : ……… D : ………</p><p><b>2)</b> Lesquels de ces solides sont des prismes droits ?</p><p><b>3)</b> Quelles arêtes sont dessinées en pointillés ? Pourquoi ?</p>`,
   c:`<p><b>1)</b> A : pavé droit · B : cube · C : prisme droit (à base triangulaire) · D : cylindre</p><p><b>2)</b> A, B (cube) et C sont des prismes droits. Le cylindre n'en est pas un : ses bases sont des disques.</p><p><b>3)</b> Les arêtes cachées, c'est-à-dire celles qu'on ne verrait pas si le solide était opaque, sont en pointillés.</p>`},
  {n:"Exercice 1", t:"Dessiner en perspective cavalière", w:"Sur ton cahier", h:`<p>Sur ton cahier à petits carreaux, représente en perspective cavalière (angle de fuite 45°, coefficient ${F(1,2)}) :</p><p><b>a)</b> un pavé droit de longueur 4 cm, de largeur 3 cm et de hauteur 2 cm ;</p><p><b>b)</b> un cylindre de rayon 1,5 cm et de hauteur 4 cm.</p>`,
   c:`<p><b>a)</b> La face avant est un rectangle de 4 cm sur 2 cm, en vraie grandeur. Les arêtes fuyantes mesurent 3 × ${F(1,2)} = 1,5 cm et font 45° avec l'horizontale. On met en pointillés les 3 arêtes cachées.</p>
   <p><b>b)</b> Le disque de la face avant est en vraie grandeur (rayon 1,5 cm). La hauteur est réduite : 4 × ${F(1,2)} = 2 cm. Le disque arrière est le translaté du disque avant ; sa moitié cachée est en pointillés.</p><div class="figs">${solid("pave",{L:4,l:3,h:2,u:34,lab:{L:"4 cm",h:"2 cm",l:"1,5 cm"},alt:"Pavé droit de 4 cm sur 3 cm sur 2 cm en perspective cavalière"})}${solid("cyl",{r:1.5,h:4,u:34,lab:{r:"1,5 cm",h:"2 cm"},alt:"Cylindre de rayon 1,5 cm et de hauteur 4 cm en perspective cavalière"})}</div>`},
  {n:"Exercice 2", t:"Patrons d'un cube", w:"Sur ta feuille", h:`<p>Parmi ces six figures, indique lesquelles sont des patrons d'un cube.</p><p>Pour t'aider, tu peux les reproduire sur ton cahier, les découper et les plier.</p><p>Les patrons de cube sont les figures numéros ………</p>${nets(E2N)}`,
   c:`<p>Les figures <b>1, 3 et 5</b> sont des patrons de cube.</p><p>Les figures 2, 4 et 6 n'en sont pas : en pliant, deux carrés se superposeraient et une face du cube resterait vide (par exemple, un bloc de 2 carrés sur 2 ne peut pas se plier).</p>${nets(E2N,E2ok)}`},
  {n:"Exercice 3", t:"Patron d'un pavé", w:"Sur ton cahier", h:`<p>Un pavé droit mesure 5 cm de longueur, 3 cm de largeur et 2 cm de hauteur.</p><p><b>1)</b> Dessine un patron de ce pavé à l'échelle 1 (carreaux de 1 cm).</p><p><b>2)</b> Combien de faces a ce pavé ? Quelles sont leurs dimensions ?</p><p><b>3)</b> Calcule l'aire totale du patron.</p>`,
   c:`<p><b>1)</b> Par exemple : une bande de quatre rectangles (5 × 2, 3 × 2, 5 × 2, 3 × 2) avec, au-dessus et en dessous du premier rectangle 5 × 2, un rectangle de 5 × 3 (dimensions en cm).</p>${patPave(5,3,2)}
   <p><b>2)</b> 6 faces : deux de 5 × 3, deux de 5 × 2, deux de 3 × 2.</p><p><b>3)</b> L'aire totale A :</p>${KC("A",["2 × (5 × 3) + 2 × (5 × 2) + 2 × (3 × 2)","30 + 20 + 12","62 cm²"])}`},
  {n:"Exercice 4", t:"Relier un prisme et son patron", w:"Sur ta feuille", h:`<p>Voici un prisme droit dont la base est un triangle rectangle, et un patron de ce prisme. Complète directement sur la fiche.</p>
   <div class="figs">${ex("e4a","Prisme droit : triangle de côtés 3 cm, 4 cm et 5 cm, longueur 6 cm",300)}${ex("e4b","Patron du prisme avec les longueurs a, b, c et d",320)}</div>
   <p><i>a</i> = ……… cm ; <i>b</i> = ……… cm ; <i>c</i> = ……… cm ; <i>d</i> = ……… cm.</p><p>Combien le patron comporte-t-il de faces ? ………</p><p>Quelle est la nature des faces latérales ? ………</p>`,
   c:`<p><i>a</i> = 3 cm ; <i>b</i> = 6 cm (la hauteur du prisme) ; <i>c</i> = 5 cm ; <i>d</i> = 3 cm.</p><p>Le patron comporte 5 faces : 2 triangles et 3 rectangles. Les faces latérales sont des rectangles.</p>${cr("e4c","Patron du prisme avec les longueurs",320)}`},
  {n:"Exercice 5", t:"Dénombrer des cubes", w:"Sur ton cahier", h:`<p>Voici une pile de cubes identiques, vue de dessus.</p><p>Le nombre dans chaque case donne le nombre de cubes empilés à cet endroit.</p>${pile(E5G)}
   <p><b>a)</b> Combien de cubes la pile contient-elle ?</p><p><b>b)</b> Quelle est la hauteur maximale de la pile (en nombre de cubes) ?</p><p><b>c)</b> Chaque cube a une arête de 2 cm. Calcule le volume de la pile.</p>`,
   c:`<p><b>a)</b> 3 + 1 + 0 + 2 + 2 + 1 + 1 + 0 + 0 = 10 cubes.</p><p><b>b)</b> 3 cubes.</p><p><b>c)</b> Volume d'un cube : 2³ = 8 cm³. Volume de la pile : 10 × 8 = 80 cm³.</p>`}
 ]},
{t:"Aire du disque et volumes", e:[
  {n:"Exercice 6", t:"Aire d'un disque", w:"Sur ton cahier", h:`<p>Calcule l'aire de chaque disque.</p><p>Donne la valeur exacte (avec ${PI}), puis une valeur approchée au dixième.</p>
   <div class="scroll"><table class="std"><tbody><tr><td><b>a)</b> rayon 3 cm</td><td><b>b)</b> rayon 5 cm</td><td><b>c)</b> rayon 10 cm</td></tr><tr><td><b>d)</b> diamètre 8 cm</td><td><b>e)</b> rayon 1,5 cm</td><td><b>f)</b> diamètre 14 cm</td></tr></tbody></table></div>`,
   c:`<p>L'aire A de chaque disque :</p><div class="calcs">${[["3","9","28,3"],["5","25","78,5"],["10","100","314,2"],["4","16","50,3"],["1,5","2,25","7,1"],["7","49","153,9"]].map(([r,e,a],i)=>`<div><p><b>${"abcdef"[i]})</b></p>${KC("A",[`${PI} × ${r}²`,`${e}${PI}`,`≈ ${a} cm²`])}</div>`).join("")}</div>
   <p>Pour d) et f), le rayon est la moitié du diamètre : 4 cm et 7 cm.</p>`},
  {n:"Exercice 7", t:"Volume d'un cube et d'un pavé", w:"Sur ton cahier", h:`<p>Calcule le volume de chaque solide.</p><p><b>a)</b> un cube d'arête 6 cm ;</p><p><b>b)</b> un pavé droit de 8 cm de longueur, 5 cm de largeur et 3 cm de hauteur ;</p><p><b>c)</b> un aquarium (pavé droit) de 60 cm de longueur, 30 cm de largeur et 40 cm de hauteur : donne son volume en cm³, puis sa capacité en litres.</p>`,
   c:`<p><b>a)</b></p>${KC("V",["6³","6 × 6 × 6","216 cm³"])}<p><b>b)</b> 8 × 5 × 3 = 120 cm³.</p><p><b>c)</b></p>${KC("V",["60 × 30 × 40","72 000 cm³","72 dm³"])}<p>Soit une capacité de 72 L.</p>`},
  {n:"Exercice 8", t:"Convertir des unités", w:"Sur ta feuille", h:`<p>Convertis directement sur la fiche.</p>
   <div class="scroll"><table class="std"><tbody><tr><td><b>a)</b> 3 dm³ = ……… cm³</td><td><b>b)</b> 2 L = ……… cm³</td><td><b>c)</b> 5 000 cm³ = ……… L</td></tr><tr><td><b>d)</b> 0,4 m³ = ……… L</td><td><b>e)</b> 75 cL = ……… L</td><td><b>f)</b> 250 mL = ……… cm³</td></tr></tbody></table></div>`,
   c:`<p><b>a)</b> 1 dm³ = 1 000 cm³, donc 3 dm³ = 3 × 1 000 = 3 000 cm³.</p><p><b>b)</b> 1 L = 1 000 cm³, donc 2 L = 2 × 1 000 = 2 000 cm³.</p><p><b>c)</b> 1 000 cm³ = 1 L, donc 5 000 cm³ = 5 000 ÷ 1 000 = 5 L.</p><p><b>d)</b> 1 m³ = 1 000 L, donc 0,4 m³ = 0,4 × 1 000 = 400 L.</p><p><b>e)</b> 1 L = 100 cL, donc 75 cL = 75 ÷ 100 = 0,75 L.</p><p><b>f)</b> 1 mL = 1 cm³, donc 250 mL = 250 cm³.</p>`},
  {n:"Exercice 9", t:"Volume d'un prisme droit", w:"Sur ton cahier", h:`<p>La base d'un prisme droit est un triangle rectangle dont les côtés de l'angle droit mesurent 3 cm et 4 cm. Sa hauteur est de 8 cm.</p><p><b>a)</b> Calcule l'aire de la base.</p><p><b>b)</b> Calcule le volume du prisme.</p><p><b>c)</b> Quelle serait la hauteur d'un prisme de même base et de volume 30 cm³ ?</p>`,
   c:`<p><b>a)</b> ${F("3 × 4",2)} = 6 cm².</p><p><b>b)</b> 6 × 8 = 48 cm³.</p><p><b>c)</b> 30 ÷ 6 = 5 cm.</p>`},
  {n:"Exercice 10", t:"Volume d'un cylindre", w:"Sur ton cahier", h:`<p>Pour ${PI}, utilise la touche de ta calculatrice.</p><p><b>a)</b> Un cylindre a pour rayon 5 cm et pour hauteur 10 cm. Calcule son volume (valeur exacte puis arrondi à l'unité), puis sa capacité en litres (arrondie au centième).</p><p><b>b)</b> Une bouteille cylindrique a pour diamètre 6 cm et pour hauteur 20 cm. Peut-elle contenir 0,5 L d'eau ? Justifie.</p><p><b>c)</b> Une boîte de conserve a pour rayon 4 cm et pour hauteur 11 cm. Calcule sa contenance en mL (arrondie à l'unité).</p>`,
   c:`<p><b>a)</b></p>${KC("<i>V</i>",[`${PI} × 5² × 10`,`250${PI}`,"≈ 785 cm³"])}<p>785 cm³ = 0,785 dm³, soit environ 0,79 L.</p><p><b>b)</b> Rayon : 3 cm.</p>${KC("<i>V</i>",[`${PI} × 3² × 20`,`180${PI}`,"≈ 565 cm³","≈ 0,57 L"])}<p>Comme 0,57 &gt; 0,5 : oui, la bouteille peut contenir 0,5 L.</p><p><b>c)</b></p>${KC("<i>V</i>",[`${PI} × 4² × 11`,`176${PI}`,"≈ 553 cm³"])}<p>Soit environ 553 mL.</p>`},
  {n:"Exercice 11", t:"La piscine", w:"Sur ton cahier", h:`<p>Une piscine a la forme d'un pavé droit de 10 m de longueur, 5 m de largeur et 1,5 m de profondeur.</p><p><b>a)</b> Calcule son volume en m³, puis sa contenance en litres.</p><p><b>b)</b> On la remplit avec un robinet dont le débit est de 1 500 L par heure. Combien d'heures faut-il pour la remplir complètement ?</p><p><b>c)</b> La piscine est remplie seulement aux deux tiers. Combien de litres d'eau contient-elle ?</p>`,
   c:`<p><b>a)</b></p>${KC("V",["10 × 5 × 1,5","75 m³","75 000 L"])}<p><b>b)</b> 75 000 ÷ 1 500 = 50 : il faut 50 heures.</p><p><b>c)</b> ${F(2,3)} × 75 000 = 50 000 L.</p>`},
  {n:"Exercice 12", t:"Pour aller plus loin : le Flatiron", w:"Sur ton cahier", h:`<p>Le Flatiron Building, à New York, est un célèbre immeuble dont la forme rappelle un prisme droit à base triangulaire.</p><p>On en construit une maquette : la base est un triangle de base 6 cm et de hauteur 4 cm ; la hauteur de la maquette est 25 cm.</p><p><b>a)</b> Calcule l'aire de la base de la maquette.</p><p><b>b)</b> Calcule le volume de la maquette.</p><p><b>c)</b> Dessine la maquette en perspective cavalière (angle 45°, coefficient ${F(1,2)}).</p>`,
   c:`<p><b>a)</b> ${F("6 × 4",2)} = 12 cm².</p><p><b>b)</b> 12 × 25 = 300 cm³.</p><p><b>c)</b> On dessine le triangle de base 6 cm et de hauteur 4 cm en vraie grandeur. Puis on trace les arêtes fuyantes de 25 × ${F(1,2)} = 12,5 cm à 45°, et on met en pointillés les arêtes cachées.</p>${solid("prisme",{p:6,q:4,s:2,L:25,u:24,lab:{p:"6 cm",t:"4 cm",L:"12,5 cm"},maxw:520,alt:"Maquette en perspective cavalière : triangle de base 6 cm et de hauteur 4 cm, arêtes fuyantes de 12,5 cm"})}`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Reconnaître et représenter les solides", schema:S_SOL, q:{
 1:[ {g:()=>{ const t=pick(["pave","cube","prisme","cyl"]); return {q:"Quel est le nom de ce solide ?", fig:solFig(t), c:Object.values(SOLN), rep:SOLN[t], ex:t==="cyl"?"Deux bases qui sont des disques.":t==="prisme"?"Deux bases triangulaires, faces latérales rectangulaires.":t==="cube"?"Toutes les arêtes ont la même longueur.":"Six faces rectangulaires.", sx:S_SOL}; }} ],
 2:[ {g:()=>{ const [nm,n]=pick(POLY); return {q:`Combien de faces a un prisme droit dont la base est un ${nm} ?`, rep:String(n+2), ex:`2 bases + ${n} faces latérales (une par côté de la base) = ${n+2}.`, sx:S_SOL}; }},
     {q:"Vrai ou faux : un cylindre est un prisme droit.", c:VF, rep:"Faux", ex:"Les bases d'un cylindre sont des disques, pas des polygones.", sx:S_SOL} ],
 3:[ {g:()=>{ const l=ri(2,30)/2; return {q:`En perspective cavalière (coefficient ${F(1,2)}), une arête fuyante mesure en réalité ${N(l)} cm. Quelle longueur a-t-elle sur le dessin (en cm) ?`, rep:[N(l/2), N(l/2)+" cm"], ex:`${N(l)} × ${F(1,2)} = ${N(l/2)} cm.`, sx:S_CAV}; }},
     {q:"En perspective cavalière, les arêtes cachées sont dessinées…", c:["en pointillés","en vraie grandeur","plus épaisses"], rep:"en pointillés", sx:S_CAV} ]
}},
{nom:"Patrons", schema:S_PAT, q:{
 1:[ {q:"Le patron d'un cylindre est formé…", c:["de deux disques et d'un rectangle","d'un disque et d'un rectangle","de deux disques et de deux rectangles"], rep:"de deux disques et d'un rectangle", sx:S_PAT},
     {g:()=>{ const [nm,n]=pick(POLY); return {q:`Le patron d'un prisme droit dont la base est un ${nm} comporte combien de rectangles (faces latérales) ?`, rep:String(n), ex:`Autant de rectangles que la base a de côtés : ${n}.`, sx:S_PAT}; }} ],
 2:[ {g:()=>{ const ok=Math.random()<0.5, c=turn(pick(ok?NETS_OK:NETS_KO)); return {q:"Cette figure est-elle un patron de cube ?", fig:nets([c]).replace(/<text[^>]*>1<\/text>/,""), c:["Oui","Non"], rep:ok?"Oui":"Non", ex:ok?"En la pliant, on obtient bien les 6 faces du cube.":"En la pliant, deux carrés se superposeraient et une face du cube resterait vide.", sx:S_PAT}; }} ],
 3:[ {g:()=>{ const [L,l,h]=shuf([ri(2,9),ri(2,9),ri(2,9)]); const A=2*(L*l+L*h+l*h); return {q:`Un pavé droit mesure ${L} cm × ${l} cm × ${h} cm. Quelle est l'aire totale de son patron (en cm²) ?`, rep:[String(A), A+" cm²"], ex:KCi("A",[`2 × (${L} × ${l}) + 2 × (${L} × ${h}) + 2 × (${l} × ${h})`,`${2*L*l} + ${2*L*h} + ${2*l*h}`,`${A} cm²`]), sx:S_PAT}; }},
     {q:"Dans le patron d'un cylindre, une dimension du rectangle est la hauteur du cylindre. L'autre est…", c:["le périmètre du disque de base","le rayon du disque de base","l'aire du disque de base"], rep:"le périmètre du disque de base", sx:S_PAT} ]
}},
{nom:"Aire d'un disque", schema:S_DISQ, q:{
 1:[ {g:()=>{ const r=ri(3,12); return {q:`Quelle est l'aire exacte d'un disque de rayon ${r} cm ?`, c:shuf(uniq(`${r*r}${PI} cm²`,[`${2*r}${PI} cm²`,`${r}${PI} cm²`,`${r*r} cm²`])), rep:`${r*r}${PI} cm²`, ex:`${PI} × ${r} × ${r} = ${r*r}${PI} cm².`, sx:S_DISQ}; }} ],
 2:[ {g:()=>{ const d=2*ri(2,10), r=d/2; return {q:`Quelle est l'aire exacte d'un disque de diamètre ${d} cm ?`, c:shuf(uniq(`${r*r}${PI} cm²`,[`${d*d}${PI} cm²`,`${d}${PI} cm²`,`${r}${PI} cm²`])), rep:`${r*r}${PI} cm²`, ex:`Le rayon vaut ${d} ÷ 2 = ${r} cm. ${PI} × ${r}² = ${r*r}${PI} cm².`, sx:S_DISQ}; }} ],
 3:[ {g:()=>{ const r=ri(3,25)/2, A=Math.PI*r*r; return {q:`Aire d'un disque de rayon ${N(r)} cm, arrondie au dixième (en cm²) ?`, rep:[N(A,1), N(A,1)+" cm²"], ex:KCi("A",[`${PI} × ${N(r)}²`,`${N(r*r)}${PI}`,`≈ ${N(A,1)} cm²`]), sx:S_DISQ}; }} ]
}},
{nom:"Volumes", schema:S_VOL, q:{
 1:[ {g:()=>{ const c=ri(2,10); return {q:`Quel est le volume d'un cube d'arête ${c} cm (en cm³) ?`, rep:[String(c**3), c**3+" cm³"], ex:`${c} × ${c} × ${c} = ${c**3} cm³.`, sx:S_VOL}; }},
     {g:()=>{ const L=ri(3,12), l=ri(2,9), h=ri(2,9); return {q:`Quel est le volume d'un pavé droit de ${L} cm × ${l} cm × ${h} cm (en cm³) ?`, rep:[String(L*l*h), L*l*h+" cm³"], ex:`${L} × ${l} × ${h} = ${L*l*h} cm³.`, sx:S_VOL}; }} ],
 2:[ {g:()=>{ let a,b; do{ a=ri(2,10); b=ri(2,10); }while(a*b%2); const h=ri(3,15), B=a*b/2; return {q:`La base d'un prisme droit est un triangle rectangle de côtés de l'angle droit ${a} cm et ${b} cm. Sa hauteur est ${h} cm. Volume (en cm³) ?`, rep:[String(B*h), B*h+" cm³"], ex:`Aire de la base : ${F(`${a} × ${b}`,2)} = ${B} cm². Volume : ${B} × ${h} = ${B*h} cm³.`, sx:S_VOL}; }} ],
 3:[ {g:()=>{ const r=ri(2,8), h=ri(3,15), V=Math.PI*r*r*h; return {q:`Volume d'un cylindre de rayon ${r} cm et de hauteur ${h} cm, arrondi à l'unité (en cm³) ?`, rep:[String(Math.round(V)), Math.round(V)+" cm³"], ex:KCi("V",[`${PI} × ${r}² × ${h}`,`${r*r*h}${PI}`,`≈ ${Math.round(V)} cm³`]), sx:S_VOL}; }},
     {g:()=>{ let a,b; do{ a=ri(2,10); b=ri(2,10); }while(a*b%2); const B=a*b/2, k=ri(2,12); return {q:`Un prisme droit a pour base un triangle rectangle de côtés de l'angle droit ${a} cm et ${b} cm. Son volume est ${B*k} cm³. Quelle est sa hauteur (en cm) ?`, rep:[String(k), k+" cm"], ex:`Aire de la base : ${B} cm². ${B*k} ÷ ${B} = ${k} cm.`, sx:S_VOL}; }} ]
}},
{nom:"Unités de volume et de capacité", schema:S_UNIT, q:{
 1:[ {g:()=>{ const n=ri(2,40); return pick([{q:`${n} dm³ = … cm³`, rep:N(n*1000), ex:`1 dm³ = 1 000 cm³.`, sx:S_UNIT},{q:`${n} L = … cm³`, rep:N(n*1000), ex:`1 L = 1 dm³ = 1 000 cm³.`, sx:S_UNIT},{q:`${N(n*1000)} cm³ = … L`, rep:String(n), ex:`1 000 cm³ = 1 dm³ = 1 L.`, sx:S_UNIT}]); }},
     {g:()=>{ const n=ri(5,999); return {q:`${n} mL = … cm³`, rep:String(n), ex:"1 mL = 1 cm³.", sx:S_UNIT}; }} ],
 2:[ {g:()=>{ const n=ri(1,29)/10; return {q:`${N(n)} m³ = … L`, rep:N(n*1000), ex:`1 m³ = 1 000 L, donc ${N(n)} × 1 000 = ${N(n*1000)} L.`, sx:S_UNIT}; }},
     {g:()=>{ const n=ri(5,99); return {q:`${n} cL = … L`, rep:N(n/100), ex:`1 L = 100 cL, donc ${n} ÷ 100 = ${N(n/100)} L.`, sx:S_UNIT}; }} ],
 3:[ {g:()=>{ const L=10*ri(3,10), l=10*ri(2,5), h=10*ri(2,5), V=L*l*h; return {q:`Un aquarium (pavé droit) mesure ${L} cm × ${l} cm × ${h} cm. Quelle est sa capacité en litres ?`, rep:[N(V/1000), N(V/1000)+" L"], ex:KCi("V",[`${L} × ${l} × ${h}`,`${N(V)} cm³`,`${N(V/1000)} dm³`,`${N(V/1000)} L`]), sx:S_UNIT}; }},
     {g:()=>{ const L=ri(6,15), l=ri(3,8), p=ri(10,20)/10, V=rd(L*l*p,3); return {q:`Une piscine (pavé droit) mesure ${L} m × ${l} m × ${N(p)} m. Quelle est sa contenance en litres ?`, rep:[N(V*1000), N(V*1000)+" L"], ex:KCi("V",[`${L} × ${l} × ${N(p)}`,`${N(V)} m³`,`${N(V*1000)} L`]), sx:S_UNIT}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
/* patron d'un cylindre : un rectangle (périmètre de la base × hauteur) et deux disques posés sur ses grands côtés */
const patCyl = (r,h,u=24) => { const L=2*Math.PI*r*u, H=h*u, R=r*u, cx=L*0.35;
  return `<svg class="fig" viewBox="-6 -6 ${fx(L+12)} ${fx(H+4*R+12)}" width="${Math.round(L+12)}" role="img" aria-label="Patron d'un cylindre : un rectangle et deux disques">`+
   `<rect x="0" y="${fx(2*R)}" width="${fx(L)}" height="${fx(H)}" class="ln" style="${FACE}"/>`+
   `<circle cx="${fx(cx)}" cy="${fx(R)}" r="${fx(R)}" class="ln" style="${FACE}"/><circle cx="${fx(cx)}" cy="${fx(3*R+H)}" r="${fx(R)}" class="ln" style="${FACE}"/></svg>`; };
const NOV = ["","","",""];
const PATS = `<div class="figs"><figure><figcaption>Patron A</figcaption>${patCyl(1,2.6)}</figure><figure><figcaption>Patron B</figcaption>${patPave(3,2,1.5,24).replace(/<text[^>]*>[^<]*<\/text>/g,"")}</figure><figure><figcaption>Patron C</figcaption>${patPrisme(2,3,3.6,3.4,NOV,22)}</figure></div>`;
const PRI = solid("prisme",{p:6,q:5,L:10,u:20,lab:{p:"6 cm",q:"5 cm",L:"10 cm"},alt:"Prisme droit : la base est un triangle rectangle dont les côtés de l'angle droit mesurent 6 cm et 5 cm ; la hauteur du prisme est 10 cm"});
const COMP = (a,b,c) => [
  ["REPRÉSENTER","Je reconnais les solides usuels et je les relie à leurs patrons.",`Ex. 1 (${a} points)`],
  ["CALCULER","Je calcule l'aire d'un disque et des volumes, et je convertis des unités de volume et de capacité.",`Ex. 2, 3 et 4 (${b} points)`],
  ["MODÉLISER","Je calcule le volume et la contenance d'un objet de la vie courante.",`Ex. 5 (${c} points)`]
];
const INFO = "Durée : 45 min · Calculatrice non autorisée";
const SOL1 = `<p>1. Patron A : un <b>cylindre</b> (deux disques et un rectangle).</p><p>Patron B : un <b>pavé droit</b> (six rectangles).</p><p>Patron C : un <b>prisme droit</b> à base triangulaire (deux triangles et trois rectangles).</p>`;
const SOL2 = `<p>2. Le patron est formé des 2 bases (deux <b>hexagones</b>) et d'autant de rectangles que l'hexagone a de côtés (six <b>rectangles</b>) : en tout, <b>8 faces</b>.</p>`;
const SOL3 = `<p>3. <b>Non</b> : les bases d'un prisme droit sont des polygones. Ici, les bases sont des disques : c'est un cylindre.</p>`;
const AIRE_A = `<p class="calc">A = ${PI} × r × r<br>A = ${PI} × 4 × 4<br>A = 16${PI} m²</p>`;
const AIRE_C = `<p>Le diamètre est 16 m, donc le rayon est 16 ÷ 2 = 8 m.</p><p class="calc">A = ${PI} × 8 × 8<br>A = 64${PI} m²</p><p>Deux fois la première surface : 2 × 16${PI} = 32${PI} m². Or 64${PI} ≠ 32${PI}.</p><p>Lucas a <b>tort</b> : 64${PI} = 4 × 16${PI}, la surface est <b>quatre fois</b> plus grande.</p>`;
const VOLa = `<p class="calc">V = c × c × c<br>V = 3 × 3 × 3<br>V = 27 cm³</p>`;
const VOLb = `<p>Aire de la base (triangle rectangle) :</p><p class="calc">B = ${F("6 × 5",2)}<br>B = ${F(30,2)}<br>B = 15 cm²</p><p>Volume du prisme :</p><p class="calc">V = B × h<br>V = 15 × 10<br>V = 150 cm³</p>`;
const VOLc = `<p>Le diamètre est 4 cm, donc le rayon est 4 ÷ 2 = 2 cm.</p><p class="calc">V = ${PI} × r × r × h<br>V = ${PI} × 2 × 2 × 10<br>V = 40${PI} cm³</p>`;
const CONVh = `<p>Complète.</p><div class="scroll"><table class="std"><tbody><tr><td><b>a)</b> 1,5 dm³ = ……… cm³</td><td><b>b)</b> 750 mL = ……… cm³</td></tr><tr><td><b>c)</b> 2 m³ = ……… L</td><td><b>d)</b> 4 200 cm³ = ……… L</td></tr></tbody></table></div>`;
const CONVc = `<p>a) 1 dm³ = 1 000 cm³, donc 1,5 dm³ = 1,5 × 1 000 = <b>1 500 cm³</b>.</p><p>b) 1 mL = 1 cm³, donc 750 mL = <b>750 cm³</b>.</p><p>c) 1 m³ = 1 000 L, donc 2 m³ = 2 × 1 000 = <b>2 000 L</b>.</p><p>d) 1 L = 1 000 cm³, donc 4 200 cm³ = 4 200 ÷ 1 000 = <b>4,2 L</b>.</p>`;
const BACh = `<p>Un bac à sable a la forme d'un pavé droit de 2 m de longueur et de 1,5 m de largeur.</p><p>On veut le remplir de sable sur une hauteur de 20 cm.</p>`;
const BAC1 = `<p>1. On écrit toutes les longueurs dans la même unité : 20 cm = 0,2 m.</p><p class="calc">V = L × l × h<br>V = 2 × 1,5 × 0,2<br>V = 3 × 0,2<br>V = 0,6 m³</p>`;
const BAC2 = `<p>2. 1 m³ = 1 000 L, donc 0,6 m³ = 0,6 × 1 000 = <b>600 L</b>.</p>`;
const BAC3 = `<p>3. On cherche combien de fois 25 L dans 600 L :</p><p class="calc">600 ÷ 25 = 24</p><p>Il faut acheter <b>24 sacs</b> de sable.</p>`;
return {
titre:"Évaluation d'entraînement — Chapitre 15", duree:45, info:INFO,
comp:COMP(4,"11,5","4,5"),
exos:[
{t:"Solides et patrons", p:4, h:`<p>Voici trois patrons.</p>${PATS}
  <p>1. Quel solide obtient-on en pliant chacun de ces patrons ?</p><p>2. Un prisme droit a pour bases deux hexagones. De combien de faces son patron est-il formé ? Quelles sont leurs formes ?</p><p>3. Le patron A est-il le patron d'un prisme droit ? Explique.</p><p>4. Dans le patron A, les disques ont pour rayon 1 cm. Quelle est la longueur du rectangle ? Donne la valeur exacte, avec ${PI}.</p>`,
 c:`${SOL1}<p><i>(1,5 point : 0,5 par solide)</i></p>${SOL2}<p><i>(1 point)</i></p>${SOL3}<p><i>(0,5 point)</i></p>
  <p>4. La longueur du rectangle est le périmètre du disque de base :</p><p class="calc">2 × ${PI} × 1 = 2${PI} cm</p><p>La longueur du rectangle est <b>2${PI} cm</b> (environ 6,3 cm). <i>(1 point)</i></p>`},
{t:"Aire d'un disque", p:4, h:`<p>Un arroseur automatique tourne sur lui-même : il arrose une pelouse en forme de disque de rayon 4 m.</p>
  <p>a) Calcule l'aire exacte de la surface arrosée, avec ${PI}.</p><p>b) En prenant ${PI} ≈ 3,14, donne une valeur approchée de cette aire.</p><p>c) Lucas affirme : « Un arroseur qui arrose un disque de diamètre 16 m arrose une surface deux fois plus grande. » A-t-il raison ? Justifie par un calcul.</p>`,
 c:`<p>a)</p>${AIRE_A}<p>L'aire exacte est <b>16${PI} m²</b>. <i>(1 point)</i></p><p>b)</p><p class="calc">A ≈ 16 × 3,14<br>A ≈ 50,24 m²</p><p>La surface arrosée mesure environ <b>50,24 m²</b>. <i>(1 point)</i></p>
  <p>c)</p>${AIRE_C}<p><i>(2 points : 1 pour le calcul de l'aire, 1 pour la conclusion justifiée)</i></p>`},
{t:"Calculer des volumes", p:5.5, h:`<p>a) Calcule le volume d'un cube d'arête 3 cm.</p><p>b) Voici un prisme droit. Sa base est un triangle rectangle dont les côtés de l'angle droit mesurent 6 cm et 5 cm. Sa hauteur est 10 cm.</p>${PRI}<p>Calcule l'aire de sa base, puis son volume.</p>
  <p>c) Un cylindre a pour diamètre 4 cm et pour hauteur 10 cm. Calcule son volume exact, puis une valeur approchée en prenant ${PI} ≈ 3,14.</p><p>d) Un pavé droit a un volume de 60 cm³. Sa longueur est 5 cm et sa largeur 4 cm. Quelle est sa hauteur ?</p>`,
 c:`<p>a)</p>${VOLa}<p><i>(1 point)</i></p><p>b)</p>${VOLb}<p><i>(2 points : 1 pour l'aire de la base, 1 pour le volume)</i></p>
  <p>c)</p>${VOLc}<p class="calc">V ≈ 40 × 3,14<br>V ≈ 125,6 cm³</p><p><i>(1,5 point : 1 pour la valeur exacte, 0,5 pour la valeur approchée)</i></p>
  <p>d) V = L × l × h, donc 60 = 5 × 4 × h, c'est-à-dire 60 = 20 × h.</p><p class="calc">h = 60 ÷ 20<br>h = 3 cm</p><p>La hauteur du pavé est <b>3 cm</b>. <i>(1 point)</i></p>`},
{t:"Conversions", p:2, h:CONVh, c:`${CONVc}<p><i>0,5 point par conversion.</i></p>`},
{t:"Problème : le bac à sable", p:4.5, h:`${BACh}
  <p>1. Calcule le volume de sable nécessaire, en m³.</p><p>2. Exprime ce volume en litres.</p><p>3. Le sable est vendu en sacs de 25 L. Combien de sacs faut-il acheter ?</p>`,
 c:`${BAC1}<p><i>(1,5 point : 0,5 pour la conversion, 1 pour le volume)</i></p>${BAC2}<p><i>(1 point)</i></p>${BAC3}<p><i>(2 points)</i></p>`}
],
bep:{
titre:"Évaluation d'entraînement — Chapitre 15 · version aménagée", duree:45, info:"Version aménagée · "+INFO,
note:"Même durée, avec environ une question sur cinq en moins (les questions restantes sont renumérotées). Toujours sur 20 : les points sont répartis sur les questions gardées. Les justifications restent demandées.",
comp:COMP("3,5","10,5",6),
exos:[
{t:"Solides et patrons", p:3.5, h:`<p>Voici trois patrons.</p>${PATS}
  <p>1. Quel solide obtient-on en pliant chacun de ces patrons ?</p><p>2. Un prisme droit a pour bases deux hexagones. De combien de faces son patron est-il formé ? Quelles sont leurs formes ?</p><p>3. Le patron A est-il le patron d'un prisme droit ? Explique.</p>`,
 c:`${SOL1}<p><i>(1,5 point : 0,5 par solide)</i></p>${SOL2}<p><i>(1,5 point)</i></p>${SOL3}<p><i>(0,5 point)</i></p>`},
{t:"Aire d'un disque", p:3.5, h:`<p>Un arroseur automatique tourne sur lui-même : il arrose une pelouse en forme de disque de rayon 4 m.</p>
  <p>a) Calcule l'aire exacte de la surface arrosée, avec ${PI}.</p><p>b) Lucas affirme : « Un arroseur qui arrose un disque de diamètre 16 m arrose une surface deux fois plus grande. » A-t-il raison ? Justifie par un calcul.</p>`,
 c:`<p>a)</p>${AIRE_A}<p>L'aire exacte est <b>16${PI} m²</b>. <i>(1,5 point)</i></p><p>b)</p>${AIRE_C}<p><i>(2 points : 1 pour le calcul de l'aire, 1 pour la conclusion justifiée)</i></p>`},
{t:"Calculer des volumes", p:5, h:`<p>a) Calcule le volume d'un cube d'arête 3 cm.</p><p>b) Voici un prisme droit. Sa base est un triangle rectangle dont les côtés de l'angle droit mesurent 6 cm et 5 cm. Sa hauteur est 10 cm.</p>${PRI}<p>Calcule l'aire de sa base, puis son volume.</p>
  <p>c) Un cylindre a pour diamètre 4 cm et pour hauteur 10 cm. Calcule son volume exact.</p>`,
 c:`<p>a)</p>${VOLa}<p><i>(1,5 point)</i></p><p>b)</p>${VOLb}<p><i>(2 points : 1 pour l'aire de la base, 1 pour le volume)</i></p><p>c)</p>${VOLc}<p><i>(1,5 point)</i></p>`},
{t:"Conversions", p:2, h:CONVh, c:`${CONVc}<p><i>0,5 point par conversion.</i></p>`},
{t:"Problème : le bac à sable", p:6, h:`${BACh}
  <p>1. Calcule le volume de sable nécessaire, en m³.</p><p>2. Exprime ce volume en litres.</p><p>3. Le sable est vendu en sacs de 25 L. Combien de sacs faut-il acheter ?</p>`,
 c:`${BAC1}<p><i>(2 points : 0,5 pour la conversion, 1,5 pour le volume)</i></p>${BAC2}<p><i>(1,5 point)</i></p>${BAC3}<p><i>(2,5 points)</i></p>`}
]}
};
})()
};
})();
