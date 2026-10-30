/* 4e — Chapitre 16 : Proportionnalité et graphiques, repérage
   Sources : cours C4 « Proportionnalité – Caractérisation graphique », cours F3 « Repérage dans le plan (rappels) » et « Repérage dans le pavé droit »,
   activité découverte « Au cinéma » et son corrigé, feuille d'exercices, feuilles de corrections, « Exercice en + », consignes de la semaine 4 de M. Staal.
   Les exercices A à D sont les exercices du manuel donnés dans les consignes : énoncés réécrits à partir des corrections de M. Staal.
   Tous les repères, graphiques et pavés droits sont dessinés en SVG à partir des valeurs exactes. */
(function(){
const VF=["Vrai","Faux"], ON=["Oui","Non"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const rd=(x,k=4)=>Math.round(x*10**k)/10**k;
const N=(x,k=4)=>{ const v=rd(x,k); const [i,d]=String(Math.abs(v)).split("."); return (v<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const F=(a,b)=>`{${a}/${b}}`;
const C2=(x,y)=>`(${N(x)} ; ${N(y)})`, C3=(x,y,z)=>`(${N(x)} ; ${N(y)} ; ${N(z)})`;
const fr=v=>v===0.5?F(1,2):N(v);   /* ½ écrit en fraction comme dans les corrections de M. Staal */
const C3f=(x,y,z)=>`(${fr(x)} ; ${fr(y)} ; ${fr(z)})`;
const tab=(head,rows)=>`<div class="scroll"><table class="std"><thead><tr>${head.map((h,i)=>`<th>${i?h:`<b>${h}</b>`}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const BLUE="#1e5aa8", GRN="#1e8a4c", RED="#c0392b", PUR="#8e44ad", ORA="#d9730d";
let UID=0;

/* ------------------------------------------------------------------
   Repère du plan en SVG
   xmin…xmax, ymin…ymax · gx, gy : pas du quadrillage · lx, ly : pas des nombres écrits · sub : petits carreaux par carreau
   kx, ky : pixels par unité · pts [[nom,x,y,couleur,dx,dy]] (croix) · lines [{p:[[x,y]…],col,dash}] · fns [{f,a,b,col}]
   xt, yt : titres des axes
------------------------------------------------------------------ */
function rep(o){
  const {xmin=0,xmax,ymin=0,ymax,gx=1,gy=1,lx=gx,ly=gy,sub=1,kx=36,ky=36,pts=[],lines=[],fns=[],xt="",yt="",alt="Repère"}=o, id="cl16_"+(UID++);
  const ml=o.ml??(ymin<0||xmin<0?20:46), mr=xt?Math.max(28,xt.length*7.2-10):22, mt=yt?34:20, mb=xmin<0||ymin<0?20:34;
  const X=x=>ml+(x-xmin)*kx, Y=y=>mt+(ymax-y)*ky, f=v=>v.toFixed(1);
  const W=Math.round(X(xmax)+mr), H=Math.round(Y(ymin)+mb), ox=xmin<=0&&xmax>=0?0:xmin, oy=ymin<=0&&ymax>=0?0:ymin;
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${alt}"><defs><clipPath id="${id}"><rect x="${f(X(xmin))}" y="${f(Y(ymax))}" width="${f((xmax-xmin)*kx)}" height="${f((ymax-ymin)*ky)}"/></clipPath></defs>`;
  const near=(v,st)=>Math.abs(v/st-Math.round(v/st))<1e-6;
  if(sub>1){ for(let v=xmin;v<=xmax+1e-9;v=rd(v+gx/sub)) if(!near(v,gx)) s+=`<line x1="${f(X(v))}" y1="${f(Y(ymin))}" x2="${f(X(v))}" y2="${f(Y(ymax))}" class="gridl" style="stroke-width:.5"/>`;
    for(let v=ymin;v<=ymax+1e-9;v=rd(v+gy/sub)) if(!near(v,gy)) s+=`<line x1="${f(X(xmin))}" y1="${f(Y(v))}" x2="${f(X(xmax))}" y2="${f(Y(v))}" class="gridl" style="stroke-width:.5"/>`; }
  for(let v=xmin;v<=xmax+1e-9;v=rd(v+gx)) s+=`<line x1="${f(X(v))}" y1="${f(Y(ymin))}" x2="${f(X(v))}" y2="${f(Y(ymax))}" class="gridl"/>`;
  for(let v=ymin;v<=ymax+1e-9;v=rd(v+gy)) s+=`<line x1="${f(X(xmin))}" y1="${f(Y(v))}" x2="${f(X(xmax))}" y2="${f(Y(v))}" class="gridl"/>`;
  s+=`<line x1="${f(X(xmin))}" y1="${f(Y(oy))}" x2="${f(X(xmax)+12)}" y2="${f(Y(oy))}" class="axe2"/><path d="M${f(X(xmax)+14)} ${f(Y(oy))} l-9 -5 l0 10 z" style="fill:var(--ink)"/>`;
  s+=`<line x1="${f(X(ox))}" y1="${f(Y(ymin))}" x2="${f(X(ox))}" y2="${f(Y(ymax)-12)}" class="axe2"/><path d="M${f(X(ox))} ${f(Y(ymax)-14)} l-5 9 l10 0 z" style="fill:var(--ink)"/>`;
  for(let v=xmin;v<=xmax+1e-9;v=rd(v+lx)) if(Math.abs(v-ox)>1e-9 || ox!==0) s+=`<text x="${f(X(v))}" y="${f(Y(oy)+17)}" text-anchor="middle" style="font-size:13px;paint-order:stroke;stroke:var(--surface);stroke-width:4px;stroke-linejoin:round;">${N(v)}</text>`;
  for(let v=ymin;v<=ymax+1e-9;v=rd(v+ly)) if(Math.abs(v-oy)>1e-9 || oy!==0) s+=`<text x="${f(X(ox)-5)}" y="${f(Y(v)+4.5)}" text-anchor="end" style="font-size:13px;paint-order:stroke;stroke:var(--surface);stroke-width:4px;stroke-linejoin:round;">${N(v)}</text>`;
  if(ox===0&&oy===0) s+=`<text x="${f(X(0)-5)}" y="${f(Y(0)+16)}" text-anchor="end" style="font-size:13px">0</text>`;
  if(xt) s+=`<text x="${f(X(xmax)+4)}" y="${f(Y(oy)-8)}" text-anchor="end" style="font-size:14px;font-weight:600">${xt}</text>`;
  if(yt) s+=`<text x="${f(X(ox)+8)}" y="${f(Y(ymax)-16)}" style="font-size:14px;font-weight:600">${yt}</text>`;
  s+=`<g clip-path="url(#${id})">`;
  fns.forEach(({f:g,a=xmin,b=xmax,col=BLUE,dash})=>{ const P=[]; for(let i=0;i<=80;i++){ const x=a+(b-a)*i/80; P.push(f(X(x))+","+f(Y(g(x)))); } s+=`<polyline points="${P.join(" ")}" style="fill:none;stroke:${col};stroke-width:2.6${dash?";stroke-dasharray:7 5":""}"/>`; });
  lines.forEach(({p,col=RED,dash})=>{ s+=`<polyline points="${p.map(([x,y])=>f(X(x))+","+f(Y(y))).join(" ")}" style="fill:none;stroke:${col};stroke-width:2.4${dash?";stroke-dasharray:7 5":""}"/>`; });
  s+=`</g>`;
  pts.forEach(([n,x,y,col="var(--ink)",dx=9,dy=-9])=>{ const px=X(x), py=Y(y); s+=`<path d="M${f(px-5.5)} ${f(py-5.5)} L${f(px+5.5)} ${f(py+5.5)} M${f(px+5.5)} ${f(py-5.5)} L${f(px-5.5)} ${f(py+5.5)}" style="stroke:${col};stroke-width:2.4"/>`;
    if(n) s+=`<text x="${f(px+dx)}" y="${f(py+dy+5)}" text-anchor="middle" style="font-size:16px;font-weight:700;fill:${col}">${n}</text>`; });
  return s+"</svg>";
}

/* ------------------------------------------------------------------
   Pavé droit en perspective cavalière
   a, b, c : dimensions selon l'abscisse, l'ordonnée, l'altitude · ex, ey, ez : vecteurs écran d'une unité
   V {"x,y,z":nom} sommets nommés · hid "x,y,z" sommet caché (arêtes en pointillés) · pts [[nom,x,y,z,couleur,dx,dy]]
   grid : quadrillage des faces visibles (pavé découpé en cubes unités) · red [["x,y,z","x,y,z"]] arêtes en couleur
------------------------------------------------------------------ */
function pave(o){
  const {a=1,b=1,c=1,ex,ey,ez,V={},hid,pts=[],red=[],grid=false,alt="Pavé droit"}=o, pad=o.pad??30;
  const P0=(x,y,z)=>[x*ex[0]+y*ey[0]+z*ez[0], x*ex[1]+y*ey[1]+z*ez[1]];
  const corners=[]; for(const x of [0,a]) for(const y of [0,b]) for(const z of [0,c]) corners.push([x,y,z]);
  const pr=corners.map(p=>P0(...p)), mnx=Math.min(...pr.map(p=>p[0])), mxx=Math.max(...pr.map(p=>p[0])), mny=Math.min(...pr.map(p=>p[1])), mxy=Math.max(...pr.map(p=>p[1]));
  const P=(x,y,z)=>{ const q=P0(x,y,z); return [pad+q[0]-mnx, pad+q[1]-mny]; }, f=v=>v.toFixed(1);
  const W=Math.round(mxx-mnx+2*pad), H=Math.round(mxy-mny+2*pad), key=p=>p.map(v=>rd(v,6)).join(",");
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${o.w?Math.min(o.w,W):W}" role="img" aria-label="${alt}">`;
  const L=(p,q,st)=>{ const A=P(...p), B=P(...q); return `<line x1="${f(A[0])}" y1="${f(A[1])}" x2="${f(B[0])}" y2="${f(B[1])}" style="${st}"/>`; };
  const H0=hid?hid.split(",").map(Number):null;
  if(grid){ const g="stroke:var(--muted);stroke-width:1;opacity:.55", vis=(k,v)=>!H0||Math.abs(H0[k]-v)>1e-9;   /* faces opposées au sommet caché */
    const fx=H0&&H0[0]===0?a:0, fy=H0&&H0[1]===0?b:0, fz=H0&&H0[2]===0?c:0;
    for(let i=1;i<a;i++){ s+=L([i,fy,0],[i,fy,c],g)+L([i,0,fz],[i,b,fz],g); }
    for(let j=1;j<b;j++){ s+=L([fx,j,0],[fx,j,c],g)+L([0,j,fz],[a,j,fz],g); }
    for(let k=1;k<c;k++){ s+=L([0,fy,k],[a,fy,k],g)+L([fx,0,k],[fx,b,k],g); } }
  const E=[]; corners.forEach(p=>corners.forEach(q=>{ const d=[0,1,2].filter(i=>p[i]!==q[i]); if(d.length===1 && key(p)<key(q)) E.push([p,q]); }));
  const isRed=(p,q)=>red.some(([u,v])=>(u===key(p)&&v===key(q))||(u===key(q)&&v===key(p)));
  E.forEach(([p,q])=>{ const h=hid&&(key(p)===hid||key(q)===hid), r=isRed(p,q);
    s+=L(p,q,`stroke:${r?RED:"var(--ink)"};stroke-width:${r?2.8:2};${h?"stroke-dasharray:6 5;":""}stroke-linecap:round`); });
  const cen=P(a/2,b/2,c/2);
  Object.entries(V).forEach(([k,n])=>{ const p=P(...k.split(",").map(Number)); let u=[p[0]-cen[0],p[1]-cen[1]]; const d=Math.hypot(...u)||1; u=[u[0]/d,u[1]/d];
    s+=`<text x="${f(p[0]+u[0]*16)}" y="${f(p[1]+u[1]*16+6)}" text-anchor="middle" style="font-size:17px;font-weight:700;fill:var(--ink)">${n}</text>`; });
  pts.forEach(([n,x,y,z,col=RED,dx=12,dy=-10])=>{ const p=P(x,y,z); s+=`<path d="M${f(p[0]-5)} ${f(p[1]-5)} L${f(p[0]+5)} ${f(p[1]+5)} M${f(p[0]+5)} ${f(p[1]-5)} L${f(p[0]-5)} ${f(p[1]+5)}" style="stroke:${col};stroke-width:2.4"/><text x="${f(p[0]+dx)}" y="${f(p[1]+dy+5)}" text-anchor="middle" style="font-size:16px;font-weight:700;fill:${col}">${n}</text>`; });
  return s+"</svg>";
}
/* orientation « classique » : abscisse vers la droite, ordonnée en profondeur, altitude vers le haut */
const PROJ=(s=60,d=0.5)=>({ex:[s,0], ey:[s*d*0.75,-s*d*0.62], ez:[0,-s]});

window.G416={rep, pave, PROJ, N, F, C2, C3, C3f, fr, tab, BLUE, GRN, RED, PUR, ORA};

/* ===================== figures du cours ===================== */
const R1 = rep({xmin:-6,xmax:6,ymin:-6,ymax:6,kx:28,ky:28, pts:[["A",4,3,RED],["B",-4,-2,RED]], alt:"Repère orthogonal avec les points A(4 ; 3) et B(−4 ; −2)"});
const R1c = rep({xmin:-6,xmax:6,ymin:-6,ymax:6,kx:28,ky:28, pts:[["A",4,3,RED],["B",-4,-2,RED],["C",0,4,BLUE,16,-2]], alt:"Les points A, B et C"});
const R2 = rep({xmin:-3,xmax:3,ymin:-6,ymax:6,gx:0.5,lx:1,kx:48,ky:24, pts:[["D",-1,-3,RED],["E",1.5,4,RED]], alt:"Repère : une unité vaut deux carreaux en abscisses et un carreau en ordonnées ; points D et E"});
const R2c = rep({xmin:-3,xmax:3,ymin:-6,ymax:6,gx:0.5,lx:1,kx:48,ky:24, pts:[["D",-1,-3,RED],["E",1.5,4,RED],["F",2,-2,BLUE]], alt:"Les points D, E et F"});
const C_EX = rep({xmin:0,xmax:6,ymin:0,ymax:16,gx:1,gy:2,kx:40,ky:15, pts:[["",0,0,RED],["",1,3,RED],["C",3,9,RED,-12,-6],["",4,12,RED],["",5,15,RED]], lines:[{p:[[0,0],[16/3,16]],col:GRN}], xt:"Prix (€)", yt:"Masse (kg)", alt:"Les points du tableau sont alignés sur une droite qui passe par l'origine"});
const EXg = (pp,join,title) => `<figure style="max-width:230px">${rep({xmin:0,xmax:7,ymin:0,ymax:3.5,gx:1,gy:0.5,ly:1,kx:28,ky:44, pts:pp.map(p=>["",p[0],p[1],RED]), lines:[{p:join,col:RED,dash:true}], alt:title})}<figcaption>${title}</figcaption></figure>`;
const C_G3 = `<div class="figs">${EXg([[2,1],[4,2],[6,3]],[[0,0],[2,1],[4,2],[6,3]],"Une droite qui passe par l'origine")}${EXg([[3,1],[5,2],[6,3]],[[0,0],[3,1],[5,2],[6,3]],"Une courbe qui passe par l'origine")}${EXg([[0,2/3],[1,1],[4,2],[7,3]],[[0,2/3],[7,3]],"Une droite qui ne passe pas par l'origine")}</div>`;
/* pavé du cours : ABCDEFGH, repère (A ; B, D, E) */
const PV1o = {a:1,b:1,c:1, ex:[150,0], ey:[48,-40], ez:[0,-95], V:{"0,0,0":"A","1,0,0":"B","1,1,0":"C","0,1,0":"D","0,0,1":"E","1,0,1":"F","1,1,1":"G","0,1,1":"H"}, hid:"0,1,0", red:[["0,0,0","1,0,0"],["0,0,0","0,1,0"],["0,0,0","0,0,1"]]};
const PV1 = pave({...PV1o, pts:[["M",1,1,0.5,BLUE,16,4]], alt:"Pavé droit ABCDEFGH ; M est le milieu de [CG]"});
const PV1c = pave({...PV1o, pts:[["M",1,1,0.5,BLUE,16,4],["K",0.5,0,0,RED,0,22],["L",0,0.5,0.5,RED,-14,-6],["P",0.5,1,1,RED,0,-12]], alt:"Les points K, L et P placés dans le pavé"});
const PV2o = {a:4,b:3,c:3, ex:[46,0], ey:[20,-17], ez:[0,-46], grid:true, hid:"0,3,0", V:{"0,0,0":"O","1,0,0":"I","0,1,0":"J","0,0,1":"K","4,0,0":"A","4,3,0":"B","0,3,0":"C","0,0,3":"D","4,0,3":"E","4,3,3":"F","0,3,3":"G"}, red:[["0,0,0","1,0,0"]]};
const PV2 = pave({...PV2o, pts:[["S",1,2,3,RED,-10,-8]], alt:"Pavé droit découpé en cubes unités, repère (O ; I, J, K)"});
const PV2c = pave({...PV2o, pts:[["S",1,2,3,RED,-10,-8],["T",2,1,3,BLUE,0,-10],["M",3,1,0,BLUE,0,20],["R",4,2,2,BLUE,14,-6]], alt:"Les points T, M et R placés"});

/* ===================== schémas ===================== */
const S_COO=sch("Lire les coordonnées d'un point", rep({xmin:-4,xmax:4,ymin:-3,ymax:3,kx:26,ky:26,pts:[["A",3,2,RED],["B",-2,-1,RED]]})+`<p class="schN">A(3 ; 2) : on lit d'abord l'<b>abscisse</b> (axe horizontal), puis l'<b>ordonnée</b> (axe vertical).</p>`);
const S_GR=sch("Reconnaître la proportionnalité sur un graphique", `${C_G3}<p class="schN">Proportionnalité ⇔ points alignés <b>avec l'origine du repère</b> (une droite qui passe par l'origine).</p>`);
const S_LEC=sch("Lire un graphique de proportionnalité", rep({xmin:0,xmax:6,ymin:0,ymax:12,gx:1,gy:2,kx:34,ky:13,lines:[{p:[[0,0],[6,12]],col:BLUE}],pts:[["",3,6,RED]],xt:"x",yt:"y"})+`<p class="schN">La droite passe par l'origine : y = 2 × x. Pour x = 3, on lit y = 6.</p>`);
const S_PAV=sch("Repérage dans le pavé droit", pave({...PV1o, pts:[["M",1,1,0.5,BLUE,16,4]]})+`<p class="schN">Repère (A ; B, D, E) : A est l'origine, [AB] donne l'abscisse, [AD] l'ordonnée, [AE] l'altitude. D(0 ; 1 ; 0), F(1 ; 0 ; 1), M(1 ; 1 ; 0,5).</p>`);

/* ---------- générateurs du QCM ---------- */
const qPoint = (half)=>{ let x,y; do{ x=half?ri(-8,8)/2:ri(-5,5); y=half?ri(-8,8)/2:ri(-4,4); }while(!x||!y||(!half&&false)||(half&&Number.isInteger(x)&&Number.isInteger(y))); return {x,y}; };
const GRAPH4 = ()=>{ const k=pick([0.5,0.75,1.25,1.5]); const T=pick(["prop","noorig","courbe"]); let P;
  if(T==="prop") P=[1,2,3,4].map(x=>[x,x*k]); else if(T==="noorig"){ const b=pick([0.5,1,1.5]); P=[1,2,3,4].map(x=>[x,x*k*0.75+b]); } else P=[1,2,3,4].map(x=>[x,rd(x*x*k/3,2)]);
  return {T, P, fig:rep({xmin:0,xmax:5,ymin:0,ymax:6,gx:1,gy:1,sub:4,kx:40,ky:34,pts:P.map(p=>["",p[0],p[1],RED])})}; };
const CUBEN = {"0,0,0":"A","1,0,0":"B","1,1,0":"C","0,1,0":"D","0,0,1":"E","1,0,1":"F","1,1,1":"G","0,1,1":"H"};
const CUBEo = {a:1,b:1,c:1, ex:[120,0], ey:[50,-42], ez:[0,-120], V:CUBEN, hid:"0,1,0", red:[["0,0,0","1,0,0"],["0,0,0","0,1,0"],["0,0,0","0,0,1"]]};

CH["4e-16"] = {
intro:"Lire et placer des points dans un repère du plan, reconnaître sur un graphique une situation de proportionnalité, représenter graphiquement une situation, et se repérer dans un pavé droit.",
savoir:[
  "lire les coordonnées d'un point dans un repère et placer un point connaissant ses coordonnées ;",
  "savoir qu'une situation de proportionnalité est représentée par des points alignés avec l'origine du repère ;",
  "reconnaître graphiquement si une situation est proportionnelle ou non ;",
  "représenter une situation dans un repère et lire des valeurs sur un graphique ;",
  "lire et placer un point dans un pavé droit (abscisse, ordonnée, altitude)."
],

/* ===================== COURS ===================== */
cours:[
{k:"1", t:"Repérage dans le plan (rappels)", h:`
  <div class="retenir" data-l="Définition"><p>Un <b>repère orthogonal</b> du plan est constitué de deux droites graduées <b>perpendiculaires</b>.</p><p>L'une est appelée <b>axe des abscisses</b>, l'autre <b>axe des ordonnées</b>.</p><p>Leur point d'intersection est appelé <b>origine du repère</b> et a pour coordonnées (0 ; 0).</p></div>
  <div class="retenir" data-l="Vocabulaire"><p>Dans un repère, chaque point est repéré par deux nombres relatifs appelés <b>coordonnées</b> de ce point.</p><p>Le premier nombre, lu sur l'<b>axe horizontal</b>, est l'<b>abscisse</b>.</p><p>Le second nombre, lu sur l'<b>axe vertical</b>, est l'<b>ordonnée</b>.</p></div>
  <p><b>Compétences :</b> lire les coordonnées d'un point dans un repère ; placer un point dans un repère lorsqu'on connaît ses coordonnées.</p>
  <p><b>Exemples :</b></p>${R1}
  <p>• Le point A a pour abscisse <b>4</b> et pour ordonnée <b>3</b>. On note <b>A(4 ; 3)</b>.</p><p>• Le point B a pour coordonnées <b>B(−4 ; −2)</b>.</p><p>• Place le point C tel que <b>C(0 ; 4)</b>.</p>
  <div class="anim" data-anim="4e16-placer-point"></div>
  <details><summary>Voir la correction</summary><div class="corr">${R1c}<p>C a pour abscisse 0 : il est sur l'axe des ordonnées, à la hauteur 4.</p></div></details>
  ${R2}
  <p>• Les points D et E ont pour coordonnées <b>D(−1 ; −3)</b> et <b>E(1,5 ; 4)</b>.</p><p>• Place le point F tel que <b>F(2 ; −2)</b>.</p>
  <details><summary>Voir la correction</summary><div class="corr">${R2c}</div></details>
  <div class="attention"><b>ATTENTION :</b> l'unité peut être différente sur les deux axes. Ici, une unité vaut 2 carreaux sur l'axe des abscisses et 1 carreau sur l'axe des ordonnées.</div>`},
{k:"2", t:"Représentation graphique de la proportionnalité", h:`
  <div class="retenir" data-l="Propriété 1"><p><b>Si</b> on représente une situation de proportionnalité dans un repère, <b>alors</b> les <b>points sont alignés avec l'origine du repère</b>, c'est-à-dire qu'ils forment une droite passant par l'origine.</p></div>
  <p><b>Exemple :</b> voici un tableau de proportionnalité. Nous souhaitons représenter graphiquement cette situation de proportionnalité.</p>
  ${tab(["Prix en euros","0","1","3","4","5"],[["Masse en kg","0","3","9","12","15"]])}
  ${C_EX}
  <p>La droite passe par l'origine. Elle passe aussi par le point C de coordonnées (3 ; 9).</p><p>On observe que les points forment une droite qui passe par l'origine du repère.</p>
  <div class="retenir" data-l="Propriété 2"><p><b>Si</b>, dans un graphique, les <b>points sont alignés avec l'origine du repère</b>, <b>alors</b> ce graphique représente une situation de proportionnalité.</p></div>
  <p><b>Exemples :</b></p>${C_G3}
  <p>• <b>1<sup>er</sup> graphique :</b> les points forment une <b>droite passant par l'origine du repère</b>. Ce graphique représente donc bien une situation de proportionnalité.</p>
  <p>• <b>2<sup>e</sup> graphique :</b> les points forment une <b>courbe passant par l'origine</b> du repère. Une courbe <b>n'est pas une droite</b>. Donc ce graphique ne représente pas une situation de proportionnalité.</p>
  <p>• <b>3<sup>e</sup> graphique :</b> les points forment <b>une droite</b>, mais celle-ci <b>ne passe pas par l'origine du repère</b>. Donc ce graphique ne représente pas une situation de proportionnalité.</p>`},
{k:"3", t:"Repérage dans le pavé droit", h:`
  <div class="retenir" data-l="Définition"><p>Dans un parallélépipède rectangle (ou pavé droit), un repère est formé par trois arêtes ayant un sommet commun appelé <b>origine du repère</b>.</p><p>Tout point d'un parallélépipède rectangle est donc repéré par 3 nombres : l'<b>abscisse</b>, l'<b>ordonnée</b> et l'<b>altitude</b>.</p></div>
  <p><b>Compétences :</b> lire les coordonnées d'un point dans un parallélépipède rectangle ; placer un point dans un parallélépipède rectangle lorsqu'on connaît ses coordonnées.</p>
  <p><b>Exercice 1 :</b> ABCDEFGH est un parallélépipède rectangle. M est le milieu de l'arête [CG].</p>${PV1}
  <div class="retenir" data-l="Méthode"><p>On travaille ici dans le repère <b>(A ; B, D, E)</b>. Cela veut dire que :</p><p>• <b>A</b> est l'origine du repère ;</p><p>• l'arête <b>[AB]</b> représente <b>une unité en abscisse</b> ;</p><p>• l'arête <b>[AD]</b> représente <b>une unité en ordonnée</b> ;</p><p>• l'arête <b>[AE]</b> représente <b>une unité en altitude</b>.</p></div>
  <p><b>Exemple :</b> les coordonnées du point D sont <b>D(0 ; 1 ; 0)</b>.</p>
  <p><b>a)</b> Coordonnées : <b>A(0 ; 0 ; 0)</b> · <b>F(1 ; 0 ; 1)</b> · <b>H(0 ; 1 ; 1)</b> · <b>M(1 ; 1 ; 0,5)</b>.</p>
  <p><b>b)</b> Place les points K(0,5 ; 0 ; 0), L(0 ; 0,5 ; 0,5) et P(0,5 ; 1 ; 1).</p>
  <details><summary>Voir la correction</summary><div class="corr">${PV1c}<p>K est le milieu de [AB]. L est le centre de la face ADHE. P est le milieu de [HG].</p></div></details>
  <p><b>Exercice 2 :</b> on considère le repère <b>(O ; I, J, K)</b>.</p>${PV2}
  <p><b>a)</b> Coordonnées : <b>A(4 ; 0 ; 0)</b> · <b>F(4 ; 3 ; 3)</b> · <b>G(0 ; 3 ; 3)</b> · <b>S(1 ; 2 ; 3)</b>.</p><p>Pour S : on avance de 1 en abscisse, de 2 en ordonnée, puis on monte de 3 en altitude.</p>
  <p><b>b)</b> Place les points de coordonnées T(2 ; 1 ; 3), M(3 ; 1 ; 0) et R(4 ; 2 ; 2).</p>
  <details><summary>Voir la correction</summary><div class="corr">${PV2c}<p>T est sur la face du dessus (altitude 3), M sur la face du dessous (altitude 0) et R sur la face de droite (abscisse 4).</p></div></details>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Reconnaître graphiquement la proportionnalité", note:"Les exercices A à D sont les exercices du manuel que M. Staal avait donnés dans ses consignes.", e:[]},
{t:"Représenter graphiquement une situation", e:[]},
{t:"Repérage dans le pavé droit", e:[]}
],
quiz:[], eval:null
};

/* ===================== EXERCICES (suite) ===================== */
const CINE=[["Cinémarin",[7.5,15,30,75]],["Cinéma Le Concorde",[11.5,18,31,70]],["Cinéma Le Club",[9.5,17,25,50]],["Cinéville",[8.5,17,34,85]]];
const cineG=(v,join)=>rep({xmin:0,xmax:11,ymin:0,ymax:90,gx:1,gy:10,ly:20,kx:24,ky:2.4,pts:[1,2,4,10].map((x,i)=>["",x,v[i],RED]),lines:join?[{p:[[1,v[0]],[2,v[1]],[4,v[2]],[10,v[3]]],col:BLUE}]:[],xt:"places",yt:"Prix (€)"});
const ACT = {n:"Activité découverte", t:"Au cinéma", w:"Sur ton cahier", h:`<p>On a relevé les prix des places dans quatre cinémas différents. Les résultats sont présentés dans les tableaux suivants :</p>
  ${CINE.map(([n,v])=>`<p><b>${n}</b></p>${tab(["Nb de places","1","2","4","10"],[["Prix payé (en €)",...v.map(x=>N(x))]])}`).join("")}
  <p><b>1)</b> Parmi ces quatre tableaux, lesquels représentent des situations de proportionnalité ? Justifie.</p>
  <p><b>2)</b> On a représenté ces quatre situations dans un graphique. Quel est le point commun des représentations graphiques des situations proportionnelles trouvées à la question 1 ?</p><p><i>Aide : que se passe-t-il si l'on veut relier les points du graphique ?</i></p>
  <div class="figs">${CINE.map(([n,v])=>`<figure>${cineG(v,false)}<figcaption>${n}</figcaption></figure>`).join("")}</div>
  <p><b>3) Conclusion :</b> comment est représentée graphiquement une situation de proportionnalité ?</p>`,
 c:`<p><b>1)</b> <b>Cinémarin :</b> on cherche un coefficient de proportionnalité : ${F("7,5",1)} = 7,5 ; ${F(15,2)} = 7,5 ; ${F(30,4)} = 7,5 ; ${F(75,10)} = 7,5. On trouve 7,5 comme coefficient : <b>la situation est proportionnelle</b>.</p>
  <p><b>Le Concorde :</b> une place coûte 11,50 €, mais si je double le nombre de places, le prix n'est pas doublé (11,5 × 2 ≠ 18). Cela suffit : <b>la situation n'est pas proportionnelle</b>.</p>
  <p><b>Le Club :</b> deux places coûtent 17 €, mais pour 4 places le prix n'est pas doublé (17 × 2 ≠ 25) : <b>la situation n'est pas proportionnelle</b>.</p>
  <p><b>Cinéville :</b> une place coûte 8,50 €. 8,5 × 2 = 17 ; 8,5 × 4 = 34 ; 8,5 × 10 = 85 : <b>la situation est proportionnelle</b>.</p>
  <p><b>2)</b> Les situations proportionnelles sont celles du Cinémarin et du Cinéville. On relie les points dans chaque graphique :</p>
  <div class="figs">${CINE.map(([n,v])=>`<figure>${cineG(v,true)}<figcaption>${n}</figcaption></figure>`).join("")}</div>
  <p>Pour le Cinémarin, Le Concorde et le Cinéville, <b>les points sont alignés et forment une droite</b>.</p><p>Pour le Cinémarin et le Cinéville, la droite <b>passe par l'origine du repère</b>, contrairement à la droite du cinéma Le Concorde (qui partirait de 5 €).</p>
  <p><b>3)</b> Une situation de proportionnalité est représentée graphiquement par <b>des points alignés avec l'origine du repère</b> : si on relie ces points, ils forment <b>une droite qui passe par l'origine du repère</b>.</p>`};
const EXA_G = rep({xmin:0,xmax:7,ymin:-1,ymax:8.8,gx:1,gy:1,kx:40,ky:30,ml:24, fns:[{f:x=>2*x,a:0,b:7,col:BLUE},{f:x=>x/2,a:0,b:7,col:GRN},{f:x=>x+3,a:0,b:7,col:PUR},{f:x=>x*x/3,a:0,b:7,col:RED}], alt:"Quatre courbes : bleue, verte, violette et rouge"});
const EXA = {n:"Exercice A", t:"Quelles courbes traduisent la proportionnalité ?", w:"Sur ton cahier", h:`<p>Voici quatre courbes tracées dans un même repère : une bleue, une verte, une violette et une rouge.</p>${EXA_G}<p>Quelles courbes traduisent une situation de proportionnalité ? Justifie.</p>`,
 c:`<p>• La courbe <b style="color:${PUR}">violette</b> est une droite, mais elle ne passe pas par l'origine du repère : <b>elle ne traduit pas une situation de proportionnalité</b>.</p><p>• La courbe <b style="color:${RED}">rouge</b> passe par l'origine du repère, mais ce n'est pas une droite : <b>elle ne traduit pas une situation de proportionnalité</b>.</p><p>• Les courbes <b style="color:${GRN}">verte</b> et <b style="color:${BLUE}">bleue</b> sont des droites passant par l'origine du repère : <b>elles traduisent une situation de proportionnalité</b>.</p>`};
const B4=[["a",[[1,1.25],[2,2.5],[3,3.75],[4,5]]],["b",[[1,0.25],[2,1],[3,3],[4,5.5]]],["c",[[1,2.5],[2,3.5],[3,4.5],[4,5.5]]],["d",[[1,0.75],[2,1.5],[3,2.25],[4,3]]]];
const g4=(P,join)=>rep({xmin:0,xmax:4.6,ymin:0,ymax:5.8,gx:1,gy:1,sub:4,kx:44,ky:34,pts:P.map(p=>["",p[0],p[1],RED]),lines:join?[{p:join,col:BLUE,dash:true}]:[]});
const EXB = {n:"Exercice B", t:"Proportionnel ou non ?", w:"Sur ton cahier", h:`<p>Dans chaque cas, indique si le graphique représente une situation de proportionnalité. Justifie.</p><div class="figs">${B4.map(([l,P])=>`<figure>${g4(P)}<figcaption>${l})</figcaption></figure>`).join("")}</div>`,
 c:`<div class="figs">${B4.map(([l,P])=>`<figure>${g4(P, l==="a"||l==="d"?[[0,0],P[3]]:l==="c"?[[0,1.5],P[3]]:P)}<figcaption>${l})</figcaption></figure>`).join("")}</div>
  <p><b>a)</b> Lorsqu'on relie les points, ils forment une droite passant par l'origine du repère : <b>c'est une situation de proportionnalité</b>.</p>
  <p><b>b)</b> Lorsqu'on relie les points, ils ne forment pas une droite : <b>la situation n'est pas proportionnelle</b>.</p>
  <p><b>c)</b> Lorsqu'on relie les points, ils forment une droite, mais celle-ci ne passe pas par l'origine du repère : <b>la situation n'est pas proportionnelle</b>.</p>
  <p><b>d)</b> Lorsqu'on relie les points, ils forment une droite passant par l'origine du repère : <b>c'est une situation de proportionnalité</b>.</p>`};
const ESS=(extra=[])=>rep({xmin:0,xmax:70,ymin:0,ymax:95,gx:10,gy:10,sub:5,kx:7,ky:2.6,fns:[{f:x=>x*9/7,a:0,b:70,col:PUR}],xt:"Volume (L)",yt:"Prix (€)",...(extra.length?{lines:extra}:{} )});
const EXC = {n:"Exercice C", t:"Le plein d'essence", w:"Sur ton cahier", h:`<p>Le graphique donne le prix payé à la pompe en fonction du volume d'essence.</p>${ESS()}<p><b>1)</b> Quel est le prix d'un plein de 54 L ?</p><p><b>2)</b> Le prix payé est-il proportionnel au volume d'essence ? Justifie.</p>`,
 c:`${ESS([{p:[[54,0],[54,54*9/7],[0,54*9/7]],col:BLUE,dash:true}])}<p><b>1)</b> On part de 54 L sur l'axe horizontal, on monte jusqu'à la droite, puis on lit sur l'axe vertical : pour un plein de 54 L, le prix est d'<b>environ 70 €</b>.</p>
  <p><b>2)</b> La situation est représentée par une droite qui passe par l'origine du repère : <b>elle est donc proportionnelle</b>.</p>`};
const CUV=(withLine)=>rep({xmin:0,xmax:160,ymin:0,ymax:400,gx:10,gy:40,lx:20,ly:40,kx:3,ky:0.6,pts:[[ "",30,80],["",45,120],["",90,240],["",150,400]].map(p=>[p[0],p[1],p[2],RED]),lines:withLine?[{p:[[0,0],[150,400]],col:GRN},{p:[[0,300],[112.5,300],[112.5,0]],col:BLUE,dash:true}]:[],xt:"Hauteur (cm)",yt:"Capacité (L)",ml:44});
const EX1 = {n:"Exercice 1", t:"Les cuves", w:"Sur ton cahier", h:`<p>Voici des renseignements sur des cuves.</p>${tab(["Hauteur (en cm)","30","45","90","150"],[["Capacité (en L)","80","120","240","400"]])}
  <p><b>a)</b> Représente ce tableau dans un repère (unités : 1 carreau pour 10 cm en abscisses et 1 carreau pour 40 L en ordonnées).</p><p><b>b)</b> Indique s'il s'agit d'un tableau de proportionnalité :</p><p>• en utilisant le graphique ;</p><p>• en utilisant le tableau.</p><p><b>c)</b> En utilisant le graphique, estime la hauteur d'une cuve de 300 L. Détermine ce résultat par le calcul.</p>`,
 c:`<p><b>a)</b></p>${CUV(true)}
  <p><b>b) D'après le graphique :</b> lorsqu'on relie les points, ils forment une droite qui passe par l'origine du repère. Ce graphique représente donc une situation de proportionnalité.</p>
  <p><b>D'après le tableau :</b> pour 30 cm, la capacité est de 80 L.</p><p>• 3<sup>e</sup> colonne : si l'on multiplie par 3 la hauteur (30 × 3 = 90 cm), la capacité est bien multipliée par 3 (80 × 3 = 240 L).</p><p>• 4<sup>e</sup> colonne : si l'on multiplie par 5 la hauteur (30 × 5 = 150 cm), la capacité est bien multipliée par 5 (80 × 5 = 400 L).</p><p>• 2<sup>e</sup> colonne : pour 90 cm, la capacité est de 240 L. Si on divise la hauteur par 2 (90 ÷ 2 = 45 cm), la capacité est bien divisée par 2 (240 ÷ 2 = 120 L).</p><p>Le tableau est donc un tableau de proportionnalité.</p>
  <p><b>c) D'après le graphique</b> (tracé en bleu), pour une capacité de 300 L, la hauteur est d'environ 112 cm.</p><p><b>Par le calcul :</b></p>${tab(["Hauteur (en cm)","150","<i>h</i>"],[["Capacité (en L)","400","300"]])}<p class="calc"><i>h</i> = ${F("150 × 300",400)}<br><i>h</i> = 112,5 cm</p><p>On retrouve bien la valeur approchée graphiquement. Le graphique ne permet pas de donner une valeur exacte.</p>`};
const CARg=(T,peri)=>rep({xmin:0,xmax:5,ymin:0,ymax:peri?20:22,gx:1,gy:2,ly:4,sub:2,kx:44,ky:10,pts:T.map(([c,p,a])=>["",c,peri?p:a,RED]),lines:peri?[{p:[[0,0],[5,20]],col:GRN,dash:true}]:[],xt:"côté (cm)",yt:peri?"Périmètre (cm)":"Aire (cm²)"});
const CART=[[1,4,1],[2,8,4],[3,12,9],[4,16,16],[4.5,18,20.25]];
const EXD = {n:"Exercice D", t:"Le périmètre et l'aire d'un carré", w:"Sur ton cahier", h:`<p><b>Rappels :</b> périmètre du carré = 4 × côté ; aire du carré = côté × côté.</p>
  <p><b>1)</b> Recopie et complète le tableau.</p>${tab(["Longueur du côté (en cm)","1","2","3","4","4,5"],[["Périmètre (en cm)","","","","",""],["Aire (en cm²)","","","","",""]])}
  <p><b>2)</b> Représente dans un repère le périmètre du carré en fonction de la longueur de son côté.</p><p><i>Aide : la longueur du côté du carré est en abscisses, le périmètre est en ordonnées.</i></p>
  <p><b>3)</b> Représente dans un autre repère l'aire du carré en fonction de la longueur de son côté.</p><p><b>4)</b> Le périmètre d'un carré est-il proportionnel à la longueur de son côté ? Et l'aire ? Justifie avec les graphiques.</p>`,
 c:`<p><b>1)</b></p>${tab(["Longueur du côté (en cm)","1","2","3","4","4,5"],[["Périmètre (en cm)","4","8","12","16","18"],["Aire (en cm²)","1","4","9","16","20,25"]])}
  <div class="figs"><figure>${CARg(CART,true)}<figcaption>2) Périmètre en fonction du côté</figcaption></figure><figure>${CARg(CART,false)}<figcaption>3) Aire en fonction du côté</figcaption></figure></div>
  <p><b>4)</b> Sur le graphique du périmètre, on peut tracer une droite reliant tous les points et passant par l'origine : <b>le périmètre d'un carré est proportionnel à la longueur de son côté</b>.</p><p>Sur le graphique de l'aire, on ne peut pas tracer une droite qui relie tous les points : <b>l'aire d'un carré n'est pas proportionnelle à la longueur de son côté</b>.</p>`};
const EPa=[[1,2],[2,4],[4.5,7],[5.5,11]], EPb=[[1,2.25],[3,6.75],[5,11.25],[6,13.5]];
const EPg=(P,line)=>rep({xmin:0,xmax:7,ymin:0,ymax:15,gx:1,gy:1,ly:2,sub:2,kx:34,ky:14,pts:P.map(p=>["",p[0],p[1],"var(--ink)"]),lines:line?[{p:line,col:RED}]:[],xt:"x",yt:"y"});
const EXP = {n:"Exercice en +", t:"Graphiquement et par le calcul", w:"Sur ton cahier", h:`<p>Pour chaque tableau, représente les points dans un repère, puis indique si c'est une situation de proportionnalité :</p><p>• graphiquement ;</p><p>• par le calcul.</p>
  <p><b>1)</b></p>${tab(["x","1","2","4,5","5,5"],[["y","2","4","7","11"]])}<p><b>2)</b></p>${tab(["x","1","3","5","6"],[["y","2,25","6,75","11,25","13,5"]])}`,
 c:`<div class="figs"><figure>${EPg(EPa)}<figcaption>1)</figcaption></figure><figure>${EPg(EPb,[[0,0],[6.6,14.85]])}<figcaption>2)</figcaption></figure></div>
  <p><b>1) Graphiquement :</b> on ne peut pas relier l'ensemble des points pour former une droite passant par l'origine : la situation n'est pas proportionnelle.</p><p><b>Par le calcul :</b> on recherche s'il existe un coefficient de proportionnalité : ${F(2,1)} = 2 ; ${F(4,2)} = 2 ; ${F(7,"4,5")} ≈ 1,6. Il n'y a pas de coefficient de proportionnalité : <b>la situation n'est pas proportionnelle</b>.</p>
  <p><b>2) Graphiquement :</b> on peut relier les points et former une droite passant par l'origine : la situation est proportionnelle.</p><p><b>Par le calcul :</b> ${F("2,25",1)} = 2,25 ; ${F("6,75",3)} = 2,25 ; ${F("11,25",5)} = 2,25 ; ${F("13,5",6)} = 2,25. On trouve le coefficient de proportionnalité 2,25 : <b>la situation est proportionnelle</b>.</p>`};
const CUBE2 = pave({...CUBEo, alt:"Cube ABCDEFGH"});
const EX2 = {n:"Exercice 2", t:"Les coordonnées des sommets d'un cube", w:"Sur ton cahier", h:`<p>ABCDEFGH est le cube représenté ci-contre.</p>${CUBE2}<p>Écris les coordonnées de tous les points de la figure, dans le repère (A ; B, D, E).</p>`,
 c:`<p>A(0 ; 0 ; 0) ; B(1 ; 0 ; 0) ; C(1 ; 1 ; 0) ; D(0 ; 1 ; 0)</p><p>E(0 ; 0 ; 1) ; F(1 ; 0 ; 1) ; G(1 ; 1 ; 1) ; H(0 ; 1 ; 1)</p>`};
const MN = {"0,0,0":"M","1,0,0":"N","1,1,0":"P","0,1,0":"Q","0,0,1":"R","1,0,1":"S","1,1,1":"T","0,1,1":"U"};
const PV3 = pave({a:1,b:1,c:1, ex:[330,0], ey:[60,-48], ez:[0,-90], V:MN, hid:"0,1,0", alt:"Parallélépipède rectangle MNPQRSTU"});
const EX3 = {n:"Exercice 3", t:"Changer de repère", w:"Sur ton cahier", h:`<p>MNPQRSTU est le parallélépipède rectangle représenté ci-dessous.</p>${PV3}
  <p>Lis les coordonnées de tous les points de la figure :</p><p><b>a)</b> dans le repère (M ; N, Q, R) ;</p><p><b>b)</b> dans le repère (P ; Q, N, T).</p>
  <div class="retenir" data-l="Aide"><p>Travailler dans le repère <b>(M ; N, Q, R)</b> veut dire que :</p><p>• <b>M</b> est l'origine du repère ;</p><p>• l'arête <b>[MN]</b> représente une unité en abscisse ;</p><p>• l'arête <b>[MQ]</b> représente une unité en ordonnée ;</p><p>• l'arête <b>[MR]</b> représente une unité en altitude.</p></div>
  <div class="attention"><b>ATTENTION :</b> le repère change entre la question a) et la question b), donc les coordonnées des points changent.</div>`,
 c:`<p><b>a)</b> M(0 ; 0 ; 0) ; N(1 ; 0 ; 0) ; P(1 ; 1 ; 0) ; Q(0 ; 1 ; 0)</p><p>R(0 ; 0 ; 1) ; S(1 ; 0 ; 1) ; T(1 ; 1 ; 1) ; U(0 ; 1 ; 1)</p>
  <p><b>b)</b> M(1 ; 1 ; 0) ; N(0 ; 1 ; 0) ; P(0 ; 0 ; 0) ; Q(1 ; 0 ; 0)</p><p>R(1 ; 1 ; 1) ; S(0 ; 1 ; 1) ; T(0 ; 0 ; 1) ; U(1 ; 0 ; 1)</p>`};
/* exercice 4 : repère (A ; B, D, E) avec [AB] vers l'avant */
const P4o = {a:1,b:1,c:1, ex:[-58,48], ey:[230,0], ez:[0,-125], V:{"0,0,0":"A","1,0,0":"B","1,1,0":"C","0,1,0":"D","0,0,1":"E","1,0,1":"F","1,1,1":"G","0,1,1":"H"}, hid:"0,0,0"};
const PV4 = pave({...P4o, alt:"Parallélépipède rectangle ABCDEFGH en perspective cavalière"});
const PV4c = pave({...P4o, pts:[["I",0.5,0,1,RED,-14,-6],["J",0,0.5,0.5,RED,0,-12],["K",1,0.5,0,RED,0,22],["M",0.5,1,0,BLUE,16,12],["N",0.5,1,1,BLUE,16,-6],["P",0.5,0.5,1,BLUE,0,-12]], alt:"Les points I, J, K, M, N et P"});
const EX4 = {n:"Exercice 4", t:"Placer des points dans un pavé droit", w:"Sur ton cahier", h:`<p><b>a)</b> Représente en perspective cavalière un parallélépipède rectangle ABCDEFGH, comme celui-ci :</p>${PV4}
  <p><b>b)</b> Place les points I, J, K dont les coordonnées dans le repère (A ; B, D, E) sont : I(${F(1,2)} ; 0 ; 1) ; J(0 ; ${F(1,2)} ; ${F(1,2)}) ; K(1 ; ${F(1,2)} ; 0).</p>
  <p><b>c)</b> Place le milieu M de l'arête [CD], le milieu N de l'arête [GH] et le point d'intersection P des diagonales de la face EFGH.</p><p>Quelles sont les coordonnées des points M, N et P ?</p>`,
 c:`${PV4c}<p><b>b)</b> I est le milieu de [EF] ; J est le centre de la face ADHE ; K est le milieu de [BC].</p><p><b>c)</b> M(${F(1,2)} ; 1 ; 0) ; N(${F(1,2)} ; 1 ; 1) ; P(${F(1,2)} ; ${F(1,2)} ; 1)</p>`};
CH["4e-16"].exos[0].e=[ACT,EXA,EXB,EXC]; CH["4e-16"].exos[1].e=[EX1,EXD,EXP]; CH["4e-16"].exos[2].e=[EX2,EX3,EX4];

/* ===================== QCM ===================== */
CH["4e-16"].quiz=[
{nom:"Coordonnées d'un point dans le plan", schema:S_COO, q:{
 1:[ {g:()=>{ const {x,y}=qPoint(false); return {q:"Lis les coordonnées du point M.", fig:rep({xmin:-5,xmax:5,ymin:-4,ymax:4,kx:28,ky:28,pts:[["M",x,y,RED]]}), t:"M(□ ; □)", r:[N(x),N(y)], kb:"text", ex:`Abscisse ${N(x)} (axe horizontal), ordonnée ${N(y)} (axe vertical) : M${C2(x,y)}.`, sx:S_COO}; }},
     {q:"Dans A(4 ; 3), le nombre 4 est…", c:["l'abscisse de A","l'ordonnée de A"], rep:"l'abscisse de A", ex:"Le premier nombre est l'abscisse, le second est l'ordonnée.", sx:S_COO} ],
 2:[ {g:()=>{ let x,y; do{ x=ri(-4,4); y=ri(-4,4); }while(!x||!y||Math.abs(x)===Math.abs(y)); const P=shuf([["M",x,y],["N",y,x],["R",-x,y]]); const good=P.find(p=>p[1]===x&&p[2]===y)[0];
       return {q:`Quel point a pour coordonnées ${C2(x,y)} ?`, fig:rep({xmin:-5,xmax:5,ymin:-5,ymax:5,kx:26,ky:26,pts:P.map(p=>[p[0],p[1],p[2],RED])}), c:["M","N","R"], rep:good, ex:`On avance de ${N(x)} sur l'axe des abscisses, puis de ${N(y)} sur l'axe des ordonnées.`, sx:S_COO}; }},
     {q:"L'origine du repère a pour coordonnées…", c:["(0 ; 0)","(1 ; 1)","(0 ; 1)"], rep:"(0 ; 0)", sx:S_COO} ],
 3:[ {g:()=>{ let x,y; do{ x=ri(-5,5)/2; y=ri(-5,5); }while(!x||!y||Number.isInteger(x)); return {q:"Attention à l'unité : une unité vaut 2 carreaux en abscisses. Lis les coordonnées du point M.", fig:rep({xmin:-3,xmax:3,ymin:-5,ymax:5,gx:0.5,lx:1,kx:44,ky:22,pts:[["M",x,y,RED]]}), t:"M(□ ; □)", r:[N(x),N(y)], kb:"text", ex:`Un carreau vaut 0,5 en abscisses : M${C2(x,y)}.`, sx:S_COO}; }} ]
}},
{nom:"Reconnaître graphiquement la proportionnalité", schema:S_GR, q:{
 1:[ {q:"Une situation de proportionnalité est représentée par…", c:["des points alignés avec l'origine du repère","des points alignés","une courbe qui passe par l'origine"], rep:"des points alignés avec l'origine du repère", sx:S_GR} ],
 2:[ {g:()=>{ const G=GRAPH4(); return {q:"Ce graphique représente-t-il une situation de proportionnalité ?", fig:G.fig, c:ON, rep:G.T==="prop"?"Oui":"Non", ex:G.T==="prop"?"Les points sont alignés avec l'origine du repère.":G.T==="noorig"?"Les points sont alignés, mais la droite ne passe pas par l'origine.":"Les points ne sont pas alignés : ils forment une courbe.", sx:S_GR}; }} ],
 3:[ {g:()=>{ const G=GRAPH4(); const R={prop:"les points sont alignés avec l'origine",noorig:"la droite ne passe pas par l'origine",courbe:"les points ne sont pas alignés"}; return {q:"Quelle phrase décrit ce graphique ?", fig:G.fig, c:Object.values(R), rep:R[G.T], ex:G.T==="prop"?"C'est donc une situation de proportionnalité.":"Ce n'est donc pas une situation de proportionnalité.", sx:S_GR}; }},
     {q:"Vrai ou faux : si les points d'un graphique sont alignés, la situation est toujours proportionnelle.", c:VF, rep:"Faux", ex:"Il faut aussi que la droite passe par l'origine du repère.", sx:S_GR} ]
}},
{nom:"Lire un graphique de proportionnalité", schema:S_LEC, q:{
 1:[ {g:()=>{ const k=pick([2,3,4]), x=ri(1,5); const ym=6*k; return {q:`La droite représente une situation de proportionnalité. Quelle est l'ordonnée du point d'abscisse ${x} ?`, fig:rep({xmin:0,xmax:6,ymin:0,ymax:ym,gx:1,gy:k===4?2:1,ly:k,kx:36,ky:200/ym,fns:[{f:t=>k*t,a:0,b:6,col:BLUE}],pts:[["",x,k*x,RED]]}), rep:[N(k*x)], ex:`On monte de ${x} jusqu'à la droite et on lit ${N(k*x)}.`, sx:S_LEC}; }} ],
 2:[ {g:()=>{ const k=pick([2,3,4,1.5,2.5,0.5]); return {q:"Cette droite passe par l'origine. Par quel nombre multiplie-t-on l'abscisse pour obtenir l'ordonnée (coefficient de proportionnalité) ?", fig:rep({xmin:0,xmax:6,ymin:0,ymax:Math.ceil(6*k),gx:1,gy:1,ly:Math.ceil(6*k)>10?2:1,kx:36,ky:200/Math.ceil(6*k),fns:[{f:t=>k*t,a:0,b:6,col:BLUE}],pts:[["",2,2*k,RED]]}), rep:[N(k)], ex:`Le point (2 ; ${N(2*k)}) est sur la droite : ${N(2*k)} ÷ 2 = ${N(k)}.`, sx:S_LEC}; }} ],
 3:[ {g:()=>{ const k=pick([1.2,1.5,0.8,2.5]), x=pick([20,30,40,50]); return {q:`Le prix est proportionnel au volume : ${x} L coûtent ${N(k*x)} €. Combien coûtent ${x*2} L ?`, rep:[N(2*k*x),N(2*k*x)+" €",N(2*k*x)+"€"], ex:`On double le volume, donc on double le prix : ${N(k*x)} × 2 = ${N(2*k*x)} €.`, sx:S_LEC}; }} ]
}},
{nom:"Repérage dans le pavé droit", schema:S_PAV, q:{
 1:[ {g:()=>{ const K=pick(Object.keys(CUBEN).filter(k=>k!=="0,0,0")), n=CUBEN[K], c=K.split(","); return {q:`Dans le repère (A ; B, D, E), quelles sont les coordonnées du sommet ${n} ?`, fig:pave(CUBEo), t:`${n}(□ ; □ ; □)`, r:c, ex:`${n}(${c.join(" ; ")}) : abscisse selon [AB], ordonnée selon [AD], altitude selon [AE].`, sx:S_PAV}; }} ],
 2:[ {g:()=>{ const K=pick(Object.keys(CUBEN)), n=CUBEN[K], c=K.split(",").map(Number); const good=C3(...c); const bad=[C3(c[1],c[0],c[2]),C3(c[0],c[2],c[1]),C3(1-c[0],1-c[1],c[2])]; if(new Set([good,...bad]).size<3) return {q:"Dans le repère (A ; B, D, E), quelles sont les coordonnées de G ?", fig:pave(CUBEo), c:["(1 ; 1 ; 1)","(1 ; 0 ; 1)","(0 ; 1 ; 1)"], rep:"(1 ; 1 ; 1)", sx:S_PAV};
       return {q:`Dans le repère (A ; B, D, E), quelles sont les coordonnées de ${n} ?`, fig:pave(CUBEo), c:uniq(good,bad), rep:good, ex:`${n}${good}.`, sx:S_PAV}; }} ],
 3:[ {g:()=>{ const L=[["le milieu de [AB]",[0.5,0,0]],["le milieu de [EF]",[0.5,0,1]],["le milieu de [CG]",[1,1,0.5]],["le milieu de [BC]",[1,0.5,0]],["le centre de la face EFGH",[0.5,0.5,1]],["le centre de la face ADHE",[0,0.5,0.5]],["le milieu de [GH]",[0.5,1,1]]]; const [t,c]=pick(L);
       return {q:`Dans le repère (A ; B, D, E), quelles sont les coordonnées ${t.replace(/^le /,"du ")} ?`, fig:pave(CUBEo), t:"(□ ; □ ; □)", r:c.map(v=>[N(v), v===0.5?"1/2":N(v)]), ex:`${t[0].toUpperCase()+t.slice(1)} : ${C3(...c)}.`, sx:S_PAV}; }} ]
}}
];

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
const EV1 = rep({xmin:-4,xmax:4,ymin:-4,ymax:4,gx:0.5,lx:1,kx:52,ky:28, pts:[["A",2,3,RED],["B",-3,1,RED],["C",-1.5,-2,RED],["D",0,-3,RED,16,6]], alt:"Repère avec les points A, B, C et D"});
const EV1c = rep({xmin:-4,xmax:4,ymin:-4,ymax:4,gx:0.5,lx:1,kx:52,ky:28, pts:[["A",2,3,RED],["B",-3,1,RED],["C",-1.5,-2,RED],["D",0,-3,RED,16,6],["E",3.5,-1,BLUE],["F",-2,0,BLUE,0,-12]], alt:"Les points E et F placés"});
const EV2 = [["a",[[1,1.5],[2,2.5],[3,3.5],[4,4.5]]],["b",[[1,1.25],[2,2.5],[3,3.75],[4,5]]],["c",[[1,0.5],[2,1.5],[3,3],[4,5]]],["d",[[1,0.5],[2,1],[3,1.5],[4,2]]]];
const JUS=(join)=>rep({xmin:0,xmax:14,ymin:0,ymax:22,gx:1,gy:2,lx:2,ly:2,kx:26,ky:10, pts:[[2,3],[5,7.5],[8,12],[12,18]].map(p=>["",p[0],p[1],RED]), lines:join?[{p:[[0,0],[14,21]],col:GRN},{p:[[10,0],[10,15],[0,15]],col:BLUE,dash:true}]:[], xt:"Volume (L)", yt:"Prix (€)"});
const EVPo = {a:3,b:2,c:2, ex:[56,0], ey:[24,-20], ez:[0,-56], grid:true, hid:"0,2,0", V:{"0,0,0":"A","3,0,0":"B","3,2,0":"C","0,2,0":"D","0,0,2":"E","3,0,2":"F","3,2,2":"G","0,2,2":"H"}};
CH["4e-16"].eval={
titre:"Évaluation d'entraînement · chapitre 16", duree:50, info:"Durée : 50 min · Calculatrice autorisée · Règle et crayon à papier",
comp:[
  ["REPRÉSENTER","Je lis et je place des points dans un repère du plan.","Ex. 1 (4 points)"],
  ["RAISONNER","Je reconnais graphiquement une situation de proportionnalité.","Ex. 2 (4 points)"],
  ["MODÉLISER","Je représente une situation dans un repère et je lis un graphique.","Ex. 3 (6 points)"],
  ["REPRÉSENTER","Je lis et je place des points dans un pavé droit.","Ex. 4 (6 points)"]
],
exos:[
{t:"Dans le plan", p:4, h:`<p>Attention : une unité vaut 2 carreaux sur l'axe des abscisses.</p>${EV1}<p>a) Lis les coordonnées des points A, B, C et D.</p><p>b) Reproduis le repère et place les points E(3,5 ; −1) et F(−2 ; 0).</p>`,
 c:`<p>a) A(2 ; 3) · B(−3 ; 1) · C(−1,5 ; −2) · D(0 ; −3) <i>(0,5 point par point, soit 2 points)</i></p><p>b) Voir la figure. <i>(1 point par point placé, soit 2 points)</i></p>${EV1c}`},
{t:"Proportionnel ou non ?", p:4, h:`<p>Pour chaque graphique, indique s'il représente une situation de proportionnalité. Justifie.</p><div class="figs">${EV2.map(([l,P])=>`<figure>${g4(P)}<figcaption>${l})</figcaption></figure>`).join("")}</div>`,
 c:`<p>a) Les points sont alignés, mais la droite ne passe pas par l'origine : ce n'est pas une situation de proportionnalité. <i>(1 point)</i></p><p>b) Les points sont alignés avec l'origine : c'est une situation de proportionnalité. <i>(1 point)</i></p><p>c) Les points ne sont pas alignés : ce n'est pas une situation de proportionnalité. <i>(1 point)</i></p><p>d) Les points sont alignés avec l'origine : c'est une situation de proportionnalité. <i>(1 point)</i></p>`},
{t:"Le jus de pomme", p:6, h:`<p>Au marché, un producteur vend du jus de pomme. Voici ses prix :</p>${tab(["Volume (en L)","2","5","8","12"],[["Prix (en €)","3","7,5","12","18"]])}
  <p>a) Montre par le calcul que le prix est proportionnel au volume.</p><p>b) Représente ce tableau dans un repère (1 carreau pour 1 L en abscisses et 1 carreau pour 2 € en ordonnées).</p><p>c) Comment vois-tu sur le graphique que c'est une situation de proportionnalité ?</p><p>d) Lis sur le graphique le prix de 10 L de jus.</p><p>e) Calcule le volume de jus que l'on peut acheter avec 27 €.</p>`,
 c:`<p>a) ${F(3,2)} = 1,5 ; ${F("7,5",5)} = 1,5 ; ${F(12,8)} = 1,5 ; ${F(18,12)} = 1,5. Tous les quotients sont égaux : le prix est proportionnel au volume (1,50 € le litre). <i>(1,5 point)</i></p>
  <p>b) Voir le graphique. <i>(1,5 point)</i></p>${JUS(true)}<p>c) Les points sont alignés avec l'origine du repère. <i>(1 point)</i></p><p>d) Pour 10 L, on lit 15 € (tracé en bleu). <i>(1 point)</i></p><p>e) 27 ÷ 1,5 = 18 : on peut acheter 18 L de jus. <i>(1 point)</i></p>`},
{t:"Dans le pavé droit", p:6, h:`<p>ABCDEFGH est un pavé droit découpé en cubes identiques. On travaille dans le repère d'origine A où une arête de petit cube vaut une unité : l'abscisse se lit selon [AB], l'ordonnée selon [AD] et l'altitude selon [AE].</p>${pave({...EVPo,alt:"Pavé droit ABCDEFGH de 3 sur 2 sur 2 cubes"})}
  <p>a) Donne les coordonnées des sommets B, D, E et G.</p><p>b) Donne les coordonnées du milieu I de l'arête [EF].</p><p>c) Place les points J(2 ; 1 ; 2) et K(0 ; 1 ; 1). Sur quelle face du pavé se trouve chacun de ces points ?</p>`,
 c:`<p>a) B(3 ; 0 ; 0) · D(0 ; 2 ; 0) · E(0 ; 0 ; 2) · G(3 ; 2 ; 2) <i>(0,5 point par sommet, soit 2 points)</i></p><p>b) E(0 ; 0 ; 2) et F(3 ; 0 ; 2), donc I(1,5 ; 0 ; 2). <i>(1 point)</i></p>
  ${pave({...EVPo,pts:[["I",1.5,0,2,BLUE,0,-12],["J",2,1,2,RED,0,-12],["K",0,1,1,RED,-14,-4]],alt:"Les points I, J et K"})}
  <p>c) J est sur la face du dessus EFGH (altitude 2) ; K est sur la face de gauche ADHE (abscisse 0). <i>(1 point par point placé et 0,5 point par face, soit 3 points)</i></p>`}
]};
})();
