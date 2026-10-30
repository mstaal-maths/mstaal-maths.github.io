/* 5e — Chapitre 5 : Nombres relatifs (« Tout est relatif ! »)
   Toutes les figures (droites graduées, repères, thermomètres, mot caché) sont dessinées en SVG
   à partir des valeurs : ce qui est dessiné est exactement ce qui est écrit dans la correction. */
(function(){
const VF=["Vrai","Faux"], LT="&lt;", GT="&gt;";
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const r3 = x => Math.round(x*1000)/1000;
/* écriture française d'un nombre relatif : −2,5 · 0 · 4 810 */
const F = x => { const r=r3(x); const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const Fs = x => (r3(x)>0?"+":"")+F(x);                       /* avec le signe + */
const cmp = (a,b) => r3(a)<r3(b)?LT:r3(a)>r3(b)?GT:"=";
const cols = arr => `<div class="calcs">${arr.map(x=>`<span${x.replace(/<[^>]+>/g,"").length>30?' style="white-space:normal"':""}>${x}</span>`).join("")}</div>`;
const RED = "#d0342c", BLUE = "#1e5aa8";

/* ------------------------------------------------------------------
   Droite graduée
   min, max · step = écart entre deux graduations · lab = écart entre deux nombres écrits
   pts [[nom, valeur]] croix + nom au-dessus · show : écrit l'abscisse sous la droite (correction)
   only [valeurs] : n'écrit que ces nombres · arcs [[a, b, texte, couleur]] · dots [[valeur, couleur, texte]]
------------------------------------------------------------------ */
function dg(o){
  const {min,max,step=1,lab=1,pts=[],w=540}=o, show=!!o.show;
  const x0=34, x1=w-46, u=(x1-x0)/(max-min), X=v=>x0+(v-min)*u;
  const top = (o.arcs ? 40 : 0) + (pts.some(p=>p[3]) ? 20 : 0), Y=52+top, H=(show?118:100)+top;
  let s=`<svg class="fig" viewBox="0 0 ${w} ${H}" width="${w}" role="img" aria-label="${o.alt||"Droite graduée"}">`;
  s+=`<line x1="${x0-22}" y1="${Y}" x2="${w-12}" y2="${Y}" class="ln"/><path d="M${w-22} ${Y-7} L${w-10} ${Y} L${w-22} ${Y+7}" class="ln"/>`;
  const n=Math.round((max-min)/step);
  for(let k=0;k<=n;k++){ const v=r3(min+k*step), big=Math.abs(v/lab-Math.round(v/lab))<1e-6, x=X(v).toFixed(1);
    s+=`<line x1="${x}" y1="${Y-(big?11:7)}" x2="${x}" y2="${Y+(big?11:7)}" class="ln" style="stroke-width:${big?2:1.4}"/>`;
    if(big && (!o.only || o.only.includes(v))) s+=`<text x="${x}" y="${Y+33}" class="lab">${F(v)}</text>`; }
  (o.arcs||[]).forEach(([a,b,t,col])=>{ const xa=X(a), xb=X(b), cx=(xa+xb)/2, h=Math.min(70, Math.abs(xb-xa)*0.45), cy=Y-h*2;
    const dx=xb-cx, dy=Y-6-cy, d=Math.hypot(dx,dy), ux=dx/d, uy=dy/d, ex=xb, ey=Y-6;
    s+=`<path d="M${xa.toFixed(1)} ${Y-6} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey}" style="fill:none;stroke:${col};stroke-width:2"/>`;
    s+=`<path d="M${(ex-ux*11-uy*6).toFixed(1)} ${(ey-uy*11+ux*6).toFixed(1)} L${ex.toFixed(1)} ${ey} L${(ex-ux*11+uy*6).toFixed(1)} ${(ey-uy*11-ux*6).toFixed(1)}" style="fill:none;stroke:${col};stroke-width:2"/>`;
    s+=`<text x="${cx.toFixed(1)}" y="${(Y-h-12).toFixed(1)}" text-anchor="middle" style="font-size:14px;fill:${col};font-weight:600">${t}</text>`; });
  (o.dots||[]).forEach(([v,col,t])=>{ const x=X(v).toFixed(1); s+=`<circle cx="${x}" cy="${Y}" r="5" style="fill:${col}"/>`; if(t) s+=`<text x="${x}" y="${Y+33}" class="lab" style="fill:${col};font-weight:700">${t}</text>`; });
  pts.forEach(([L,v,col,up])=>{ const x=X(v); s+=cross(x,Y)+`<text x="${x.toFixed(1)}" y="${Y-22-(up?20:0)}" class="ptl"${col?` style="fill:${col}"`:""}>${L}</text>`;
    if(show) s+=`<text x="${x.toFixed(1)}" y="${Y+56}" class="lab" style="fill:var(--c);font-weight:700">${F(v)}</text>`; });
  return s+"</svg>";
}

/* ------------------------------------------------------------------
   Repère orthogonal (1 carreau = 1 unité), par défaut de −5 à 5 et de −4 à 4
   pts [[nom, x, y, dx, dy]] · proj [noms] : pointillés vers les axes + valeurs · poly [noms] : polygone
   grads : toutes les graduations écrites · O : écrit « O » au lieu de « 0 » · axes : noms des axes
------------------------------------------------------------------ */
function rep(o={}){
  const xa=o.xa??-5, xb=o.xb??5, ya=o.ya??-4, yb=o.yb??4, u=o.u||28, m=o.axes?44:30, mr=o.axes?70:34;
  const W=(xb-xa)*u+m+mr, H=(yb-ya)*u+m*2;
  const X=x=>m+(x-xa)*u, Y=y=>m+(yb-y)*u;
  const P={}; (o.pts||[]).forEach(p=>P[p[0]]=p);
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${o.alt||"Repère du plan"}">`;
  for(let x=xa;x<=xb;x++) s+=`<line x1="${X(x)}" y1="${Y(yb)}" x2="${X(x)}" y2="${Y(ya)}" class="gridl"/>`;
  for(let y=ya;y<=yb;y++) s+=`<line x1="${X(xa)}" y1="${Y(y)}" x2="${X(xb)}" y2="${Y(y)}" class="gridl"/>`;
  const ov=o.grads?0:12;
  s+=`<line x1="${X(xa)-ov}" y1="${Y(0)}" x2="${X(xb)+22}" y2="${Y(0)}" class="axe2"/><path d="M${X(xb)+13} ${Y(0)-6} L${X(xb)+23} ${Y(0)} L${X(xb)+13} ${Y(0)+6}" class="axe2" style="fill:none"/>`;
  s+=`<line x1="${X(0)}" y1="${Y(ya)+ov}" x2="${X(0)}" y2="${Y(yb)-22}" class="axe2"/><path d="M${X(0)-6} ${Y(yb)-13} L${X(0)} ${Y(yb)-23} L${X(0)+6} ${Y(yb)-13}" class="axe2" style="fill:none"/>`;
  const t=(x,y,txt,a="middle",st="")=>`<text x="${x}" y="${y}" text-anchor="${a}" style="font-size:14px;fill:var(--ink);${st}">${txt}</text>`;
  if(o.grads){ const g="fill:var(--muted);font-size:13px"; for(let x=xa;x<=xb;x++) if(x) s+=t(X(x),Y(ya)+18,F(x),"middle",g); for(let y=ya;y<=yb;y++) if(y) s+=t(X(xa)-7,Y(y)+5,F(y),"end",g); }
  else { s+=t(X(1),Y(0)+18,"1")+t(X(0)-6,Y(1)+5,"1","end"); }
  if(!(o.pts||[]).some(p=>!p[1]&&!p[2])) s+=t(X(0)+5,Y(0)+17,o.O?"O":"0","start");
  if(o.axes){ s+=t(X(0),Y(yb)-30,"axe des ordonnées")+t(X(xb)+mr-4,Y(0)+30,"axe des","end")+t(X(xb)+mr-4,Y(0)+46,"abscisses","end"); }
  if(o.poly) s+=`<polygon points="${o.poly.map(n=>X(P[n][1])+","+Y(P[n][2])).join(" ")}" style="fill:color-mix(in srgb,var(--c) 12%,transparent);stroke:var(--c);stroke-width:2.2"/>`;
  (o.segs||[]).forEach(([a,b,col])=>{ s+=`<line x1="${X(P[a][1])}" y1="${Y(P[a][2])}" x2="${X(P[b][1])}" y2="${Y(P[b][2])}" style="stroke:${col||"var(--c)"};stroke-width:1.8;stroke-dasharray:7 5"/>`; });
  (o.proj||[]).forEach(n=>{ const [,x,y]=P[n]; const st="stroke:"+RED+";stroke-width:1.6;stroke-dasharray:6 4";
    if(y) s+=`<line x1="${X(x)}" y1="${Y(y)}" x2="${X(x)}" y2="${Y(0)}" style="${st}"/>`;
    if(x) s+=`<line x1="${X(x)}" y1="${Y(y)}" x2="${X(0)}" y2="${Y(y)}" style="${st}"/>`;
    if(!o.grads){ if(x) s+=t(X(x),Y(0)+(y>0?18:-8),F(x),"middle","fill:"+RED+";font-weight:700"); if(y) s+=t(X(0)+(x>0?-6:6),Y(y)+5,F(y),x>0?"end":"start","fill:"+RED+";font-weight:700"); } });
  (o.pts||[]).forEach(([L,x,y,dx=8,dy=-9])=>{ s+=cross(X(x),Y(y))+`<text x="${X(x)+dx}" y="${Y(y)+dy}" class="ptl" style="text-anchor:${dx<0?"end":"start"}">${L}</text>`; });
  return s+"</svg>";
}

/* ------------------------------------------------------------------
   Thermomètres de −10 °C à 10 °C (une graduation par degré)
------------------------------------------------------------------ */
function thermo(vals, show){
  const cw=92, top=44, Y=v=>top+(10-v)*10, W=vals.length*cw+10, H=show?332:300, bot=Y(-10);
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${Math.min(W,560)}" role="img" aria-label="Thermomètres">`;
  vals.forEach((v,i)=>{ const cx=26+i*cw;
    s+=`<text x="${cx}" y="22" text-anchor="middle" style="font-size:18px;font-weight:700;fill:var(--ink)">${"ABCDEFGH"[i]}</text>`;
    s+=`<rect x="${cx-10}" y="${top-10}" width="20" height="${bot-top+22}" rx="10" style="fill:#fff;stroke:var(--ink);stroke-width:2"/>`;
    s+=`<circle cx="${cx}" cy="${bot+24}" r="15" style="fill:${RED};stroke:var(--ink);stroke-width:2"/>`;
    s+=`<rect x="${cx-5}" y="${Y(v)}" width="10" height="${bot+16-Y(v)}" style="fill:${RED}"/>`;
    for(let k=-10;k<=10;k++){ const y=Y(k), big=k%5===0; s+=`<line x1="${cx+12}" y1="${y}" x2="${cx+(big?28:20)}" y2="${y}" style="stroke:var(--ink);stroke-width:${big?1.8:1.1}"/>`;
      if(big) s+=`<text x="${cx+32}" y="${y+5}" style="font-size:13px;fill:var(--ink)">${F(k)}</text>`; }
    if(show) s+=`<text x="${cx+14}" y="${bot+70}" text-anchor="middle" style="font-size:18px;font-weight:700;fill:var(--c)">${F(v)} °C</text>`;
  });
  return s+"</svg>";
}

/* ------------------------------------------------------------------
   Exercice 13 : le mot caché (cases, flèches et nombres de la fiche)
------------------------------------------------------------------ */
const MOT = {
  box:{W:[340,538,4.5],M:[502,538,1.09],Y:[664,538,2.05],U:[850,538,0.3],T:[270,670,3.2],I:[502,670,1.9],F:[734,670,-0.4],A:[966,670,-0.9],O:[1136,670,-0.45],
       E:[502,840,-2.65],R:[734,840,-2.6],L:[966,840,-1.25],N:[1136,840,-1.3],S:[734,972,-2.06],K:[966,972,-1.2]},
  arr:[["T","W"],["T","I"],["I","M"],["I","Y"],["I","F"],["F","U"],["F","A"],["A","O"],["A","L"],["L","N"],["L","K"],["L","R"],["R","E"],["R","S"]]
};
function motCache(sol){
  const B=MOT.box, hw=56, hh=37, path=["T","I","F","A","L","R","E"], dead=["M","N"];
  const onPath=(a,b)=>sol && path.indexOf(b)===path.indexOf(a)+1 && path.includes(a);
  let s=`<svg class="fig" viewBox="190 470 1030 560" width="640" role="img" aria-label="Le mot caché : cases reliées par des flèches">`;
  MOT.arr.forEach(([a,b])=>{ const [x1,y1]=B[a], [x2,y2]=B[b], dx=x2-x1, dy=y2-y1;
    const clip=(sx,sy)=>{ const k=Math.min(Math.abs(dx)>0.01?hw/Math.abs(dx):1e9, Math.abs(dy)>0.01?hh/Math.abs(dy):1e9); return [sx*k, sy*k]; };
    const [cx,cy]=clip(dx,dy), d=Math.hypot(dx,dy), ux=dx/d, uy=dy/d;
    const ax=x1+cx+ux*10, ay=y1+cy+uy*10, bx=x2-cx-ux*10, by=y2-cy-uy*10, on=onPath(a,b), col=on?"var(--c)":"#555", w=on?5:2.5;
    s+=`<line x1="${ax.toFixed(1)}" y1="${ay.toFixed(1)}" x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" style="stroke:${col};stroke-width:${w}"/>`;
    s+=`<path d="M${(bx-ux*16-uy*9).toFixed(1)} ${(by-uy*16+ux*9).toFixed(1)} L${bx.toFixed(1)} ${by.toFixed(1)} L${(bx-ux*16+uy*9).toFixed(1)} ${(by-uy*16-ux*9).toFixed(1)} Z" style="fill:${col};stroke:${col};stroke-width:2;stroke-linejoin:round"/>`; });
  Object.entries(B).forEach(([L,[x,y,v]])=>{ const se=L==="T"||L==="E", on=sol&&path.includes(L), dd=sol&&dead.includes(L);
    s+=`<rect x="${x-hw}" y="${y-hh}" width="${hw*2}" height="${hh*2}" rx="10" style="fill:${se?"#fde9b0":"#e9eff8"};stroke:${on?"var(--c)":"#222"};stroke-width:${on?5:2.5}${dd?";stroke-dasharray:9 6":""}"/>`;
    s+=`<text x="${x}" y="${y+10}" text-anchor="middle" style="font-size:27px;font-weight:700;fill:#222">${F(v)}</text>`;
    s+=`<circle cx="${x-hw}" cy="${y-hh}" r="19" style="fill:${on?"var(--c)":"#fff"};stroke:#222;stroke-width:2.2"/><text x="${x-hw}" y="${y-hh+7}" text-anchor="middle" style="font-size:20px;font-weight:700;fill:${on?"#fff":"#222"}">${L}</text>`;
    if(dd) s+=`<text x="${x}" y="${y-hh-14}" text-anchor="middle" style="font-size:19px;font-weight:700;fill:${RED}">impasse</text>`; });
  s+=`<text x="270" y="752" text-anchor="middle" style="font-size:19px;font-weight:700;fill:${RED}">DÉPART</text><text x="502" y="922" text-anchor="middle" style="font-size:19px;font-weight:700;fill:${RED}">ARRIVÉE</text>`;
  return s+"</svg>";
}

/* outils réutilisés par la fiche d'entraînement */
window.REL = {F, Fs, cmp, dg, rep, thermo, cols, LT, GT};

/* ===================== figures du chapitre ===================== */
const D_DIST = dg({min:-5, max:9, only:[-4,0], dots:[[-4,BLUE,"−4"],[7,RED,"+7"]], arcs:[[0,-4,"distance à zéro : 4",BLUE],[0,7,"distance à zéro : 7",RED]], alt:"Distance à zéro de −4 et de +7"});
const D_ABS = dg({min:-2, max:4, step:0.5, pts:[["E",-1.5],["A",0],["C",2]], alt:"Droite graduée avec les points E, A et C"});
const D_EX3 = dg({min:-1, max:2, step:0.1, pts:[["B",-0.6],["A",1.7]], alt:"Droite graduée de −1 à 2"});
const D_EX3b = dg({min:-1, max:2, step:0.1, alt:"Droite graduée vide de −1 à 2"});
const D_CMP = dg({min:-4, max:4, step:0.5, pts:[["−4",-4,RED],["−2",-2,RED],["−1,5",-1.5,RED,1],["1",1,RED],["3,5",3.5,RED]], alt:"Plus un nombre est à droite, plus il est grand"});
const R_DEF = rep({pts:[["A",2,1.5,10,-12]], proj:["A"], O:true, axes:true, alt:"Repère : le point A a pour coordonnées (2 ; 1,5)"});
const C6 = [["B",4,3],["C",-3,2],["D",-4,-1],["E",0,-3],["F",5,-1]];
const C6b = [["G",5,2],["H",-1,-1.5],["I",-2,0],["J",3,-2],["K",0,1.5]];
const R_EX6 = rep({pts:C6, alt:"Repère avec les points B, C, D, E et F"});
const coords = L => L.map(([n,x,y])=>`${n}(${F(x)} ; ${F(y)})`).join(" &nbsp; ");

/* Exercice 5 du dossier : les quatre droites */
const DR = [
  {min:-6,max:6,step:1,lab:1,p:[-4,-1,3,5]},
  {min:-1,max:1,step:0.1,lab:0.5,p:[-0.7,-0.2,0.4,0.9]},
  {min:-3,max:3,step:0.5,lab:1,p:[-2.5,-1,0.5,2.5]},
  {min:-40,max:40,step:5,lab:10,p:[-35,-10,15,30]}
];
const drw = (d,show) => dg({min:d.min,max:d.max,step:d.step,lab:d.lab,pts:d.p.map((v,i)=>["ABCD"[i],v]),show});
const D5b = [["A",-2.5],["B",1.5],["C",-0.5],["D",2],["E",-3.5]];

/* Exercice 11 et 12 */
const P11 = [["A",3,2],["B",-2,3],["C",-4,-1],["D",1,-3],["E",5,-2],["F",-3,0],["G",0,4],["H",4,1]];
const P11b = [["I",4,3],["J",-2,2],["K",-4,0],["L",0,-2]];

/* ===================== schémas (rappels en image) ===================== */
const S_SOUS = sch("Une soustraction qui « passe sous zéro »", dg({w:400, min:-5, max:7, only:[-5,0,5], dots:[[3,"var(--ink)","3"],[-2,RED,"−2"]], arcs:[[3,-2,"on recule de 5",RED]]})+`<p class="schN">3 − 5 : on part de 3 et on recule de 5. On passe 0 et on arrive à <b>−2</b>. Donc 3 − 5 = −2.</p>`);
const S_OPP = sch("Signe, distance à zéro, opposé", dg({w:400, min:-6, max:6, only:[-5,0,5], dots:[[-5,BLUE,"−5"],[5,RED,"+5"]], arcs:[[0,-5,"5",BLUE],[0,5,"5",RED]]})+`<p class="schN">−5 et +5 ont la même distance à zéro (5) mais des signes différents : ce sont des <b>nombres opposés</b>.</p>`);
const S_ABS = sch("La valeur absolue, c'est la distance à zéro", `<p class="calc">|−8| = 8 &nbsp;&nbsp; |+3,1| = 3,1 &nbsp;&nbsp; |0| = 0</p><p class="schN">On « enlève le signe ». Une valeur absolue n'est <b>jamais négative</b>.</p>`);
const S_POS = sch("Positif, négatif… et 0", `<div class="scroll"><table class="std"><thead><tr><th></th><th>positif</th><th>strictement positif</th><th>négatif</th><th>strictement négatif</th></tr></thead><tbody><tr><td><b>+3</b></td><td>✓</td><td>✓</td><td></td><td></td></tr><tr><td><b>−1,2</b></td><td></td><td></td><td>✓</td><td>✓</td></tr><tr><td><b>0</b></td><td>✓</td><td></td><td>✓</td><td></td></tr></tbody></table></div><p class="schN">0 est le seul nombre à la fois positif et négatif, mais ni strictement positif, ni strictement négatif.</p>`);
const S_ABSC = sch("Lire une abscisse", dg({w:400, min:-2, max:2, step:0.1, lab:1, pts:[["M",-1.3]], show:true})+`<p class="schN">Ici, une unité est partagée en 10 : chaque petit trait vaut 0,1. M est 3 petits traits à gauche de −1 : M(−1,3).</p>`);
const S_CMP = sch("Comparer deux nombres relatifs", dg({w:420, min:-4, max:4, step:0.5, pts:[["−4",-4,RED],["−2",-2,RED],["−1,5",-1.5,RED,1],["1",1,RED],["3,5",3.5,RED]]})+`<p class="schN">Le plus grand est le plus à droite. Entre deux négatifs, le plus grand est celui qui a la <b>plus petite</b> distance à zéro : −1,5 &gt; −2.</p>`);
const S_RANG = sch("Ranger dans l'ordre croissant", `<p class="schN">1) les négatifs, du plus loin de zéro au plus près ; 2) puis 0 ; 3) puis les positifs, du plus petit au plus grand.</p><p class="calc">−6 &lt; −2,5 &lt; −0,3 &lt; 0 &lt; 0,8 &lt; 4</p>`);
const S_COORD = sch("Lire les coordonnées d'un point", rep({pts:[["P",-3,2]], proj:["P"], alt:"Le point P a pour coordonnées (−3 ; 2)"})+`<p class="schN">On lit d'abord l'<b>abscisse</b> (axe horizontal), puis l'<b>ordonnée</b> (axe vertical) : P(−3 ; 2).</p>`);

/* explication d'une comparaison */
function cmpEx(a,b){
  const s=cmp(a,b);
  if(s==="=") return `${F(a)} et ${F(b)} sont égaux : un 0 à la fin de la partie décimale ne change pas le nombre.`;
  if((a<0)!==(b<0) || a===0 || b===0) return `Un nombre négatif est plus petit qu'un nombre positif : ${F(Math.min(a,b))} &lt; ${F(Math.max(a,b))}.`;
  if(a>0) return `Deux nombres positifs : le plus grand est celui qui a la plus grande distance à zéro.`;
  return `Deux nombres négatifs : le plus grand est celui qui a la plus petite distance à zéro (${F(Math.min(Math.abs(a),Math.abs(b)))} &lt; ${F(Math.max(Math.abs(a),Math.abs(b)))}).`;
}
const cmpSx = (a,b) => { let lo=Math.floor(Math.min(a,b)), hi=Math.ceil(Math.max(a,b)); if(hi-lo<1) hi=lo+1; const span=hi-lo; const step=span<=4?0.1:span<=8?0.5:span<=16?1:5, lab=span<=4?1:span<=8?1:span<=16?2:10;
  const l=Math.floor(lo/lab)*lab, h=Math.ceil(hi/lab)*lab; return dg({w:400, min:l, max:h, step, lab, pts:[[F(a),a,RED],[F(b),b,BLUE,1]]}); };
/* droite aléatoire pour lire une abscisse */
function readQ(level){
  let o;
  if(level===1){ const v=ri(-6,6)||-3; o={min:-6,max:6,step:1,lab:1,v}; }
  else if(level===2){ const v=r3(ri(-6,6)/2) || -2.5; o={min:-3,max:3,step:0.5,lab:1,v}; }
  else { if(Math.random()<0.5){ let v; do{ v=r3(ri(-10,10)/10); }while(!v||Math.abs(v*2-Math.round(v*2))<1e-6); o={min:-1,max:1,step:0.1,lab:0.5,v}; }
         else { let v; do{ v=ri(-8,8)*5; }while(!v||v%10===0); o={min:-40,max:40,step:5,lab:10,v}; } }
  return {q:"Quelle est l'abscisse du point A ?", fig:dg({w:400, min:o.min,max:o.max,step:o.step,lab:o.lab,pts:[["A",o.v]]}), rep:F(o.v), sx:dg({w:400, min:o.min,max:o.max,step:o.step,lab:o.lab,pts:[["A",o.v]],show:true})+`<p class="schN">Une graduation vaut ${F(o.step)}. A(${F(o.v)}).</p>`};
}

CH["5e-5"] = {
intro:"« Tout est relatif ! » : les nombres négatifs, la distance à zéro, les nombres opposés et la valeur absolue, le repérage sur une droite graduée, la comparaison et le rangement des nombres relatifs, et le repérage dans le plan.",
savoir:[
  "savoir ce qu'est un nombre relatif (un signe et une distance à zéro) et trouver l'opposé d'un nombre ;",
  "donner la valeur absolue d'un nombre relatif ;",
  "reconnaître un nombre positif, strictement positif, négatif, strictement négatif (et le cas de 0) ;",
  "lire l'abscisse d'un point sur une droite graduée, et placer un point d'abscisse donnée ;",
  "comparer deux nombres relatifs et ranger des nombres relatifs dans l'ordre croissant ou décroissant ;",
  "lire les coordonnées d'un point dans un repère et placer un point de coordonnées données."
],
cours:[
{k:"Activité 1", t:"Calculer le résultat d'une soustraction", h:`
  <p>Calcule quand c'est possible avec les nombres que tu connais.</p>
  ${cols(["a) 20 − 7 = ………","b) 6 − 10 = ………","c) 14 − 30 = ………","d) 10 − 6,2 = ………","e) 3,9 − 10 = ………"])}
  <details><summary>Voir la correction</summary><div class="corr">
   <p>a) 20 − 7 = 13 &nbsp;·&nbsp; d) 10 − 6,2 = 3,8</p>
   <p>b), c) et e) sont impossibles avec les nombres que l'on connaît : on enlève plus que ce que l'on a. Avec les nombres négatifs, on trouve :</p>
   <p>b) 6 − 10 = −4 &nbsp;·&nbsp; c) 14 − 30 = −16 &nbsp;·&nbsp; e) 3,9 − 10 = −6,1</p></div></details>
  <div class="retenir" data-l="Remarque"><p>Pour que toutes les soustractions aient un résultat, les mathématiciens ont inventé les <b>nombres négatifs</b>. Par exemple : 6 − 10 = −4.</p></div>`},
{k:"1", t:"Définition", h:`
  <div class="retenir" data-l="Définition"><p>Les <b>nombres relatifs</b> sont l'ensemble des nombres positifs et des nombres négatifs.</p></div>
  <div class="retenir" data-l="Remarque"><p>0 est à la fois un nombre positif et un nombre négatif. On ne met pas de signe devant lui.</p></div>
  <div class="retenir" data-l="Définition"><p>Un nombre relatif différent de 0 est composé :</p><ul><li>d'un <b>signe</b> : « + » ou « − » et</li><li>d'un nombre appelé sa <b>distance à zéro</b>.</li></ul></div>
  ${D_DIST}
  <p><b>Exemples :</b> +7 est un nombre relatif de signe « + » et de distance à zéro 7 ; −4 est un nombre relatif de signe « − » et de distance à zéro 4.</p>
  <div class="retenir" data-l="Définition"><p>Deux nombres relatifs ayant la même distance à zéro mais des signes différents sont des <b>nombres opposés</b>.</p></div>
  <p><b>Exemples :</b> 4 et −4 sont deux nombres opposés. L'opposé de −2,5 est 2,5. L'opposé de 0 est 0.</p>
  <p><b>Exemples de nombres négatifs dans la vie courante :</b></p>
  <ul><li>La température est de −7,3 °C.</li><li>Le plongeur est descendu à −50 m.</li><li>Le solde de mon compte est de −400 €.</li><li>L'ascenseur s'est arrêté à l'étage −2.</li></ul>`},
{k:"2", t:"Valeur absolue", h:`
  <div class="retenir" data-l="Définition"><p>La <b>valeur absolue</b> d'un nombre relatif est sa distance à zéro. On la note avec deux barres verticales : |a|.</p></div>
  <p><b>Exemples :</b> |+7| = 7 &nbsp;&nbsp; |−4| = 4 &nbsp;&nbsp; |−3,5| = 3,5 &nbsp;&nbsp; |0| = 0</p>
  <div class="retenir" data-l="Propriété"><p>Deux nombres opposés ont la même valeur absolue : |4| = |−4| = 4.</p><p>Une valeur absolue n'est jamais négative.</p></div>
  <p><b>Exercice 1 :</b> Complète.</p>
  ${cols(["a) |+9| = ………","b) |−12| = ………","c) |−2,5| = ………","d) Les deux nombres de valeur absolue 6 sont ……… et ………"])}
  <details><summary>Voir la correction</summary><div class="corr"><p>a) |+9| = 9 &nbsp;·&nbsp; b) |−12| = 12 &nbsp;·&nbsp; c) |−2,5| = 2,5</p><p>d) Les deux nombres de valeur absolue 6 sont 6 et −6.</p></div></details>`},
{k:"3", t:"Nombres positifs et nombres négatifs", h:`
  <div class="retenir" data-l="Définition"><ul><li>Un nombre est <b>positif</b> s'il est égal à 0 ou de signe « + ».</li><li>Un nombre est <b>strictement positif</b> s'il est de signe « + » (0 exclu).</li><li>Un nombre est <b>négatif</b> s'il est égal à 0 ou de signe « − ».</li><li>Un nombre est <b>strictement négatif</b> s'il est de signe « − » (0 exclu).</li></ul></div>
  <div class="retenir" data-l="Remarque"><p>0 est le seul nombre à la fois positif et négatif. Il n'est ni strictement positif, ni strictement négatif.</p></div>
  <p><b>Exemples :</b> +4 est positif et strictement positif. −2,5 est négatif et strictement négatif. 0 est positif et négatif (mais ni strictement positif, ni strictement négatif).</p>
  <p><b>Exercice 2 :</b> Coche les bonnes cases.</p>
  <div class="scroll"><table class="std"><thead><tr><th>Nombre</th><th>positif</th><th>strictement positif</th><th>négatif</th><th>strictement négatif</th></tr></thead><tbody>${["8","−2,5","0","0,6","−9"].map(n=>`<tr><td><b>${n}</b></td><td></td><td></td><td></td><td></td></tr>`).join("")}</tbody></table></div>
  <details><summary>Voir la correction</summary><div class="corr"><div class="scroll"><table class="std"><thead><tr><th>Nombre</th><th>positif</th><th>strictement positif</th><th>négatif</th><th>strictement négatif</th></tr></thead><tbody>
   <tr><td><b>8</b></td><td>✓</td><td>✓</td><td></td><td></td></tr><tr><td><b>−2,5</b></td><td></td><td></td><td>✓</td><td>✓</td></tr><tr><td><b>0</b></td><td>✓</td><td></td><td>✓</td><td></td></tr><tr><td><b>0,6</b></td><td>✓</td><td>✓</td><td></td><td></td></tr><tr><td><b>−9</b></td><td></td><td></td><td>✓</td><td>✓</td></tr>
  </tbody></table></div></div></details>`},
{k:"4", t:"Repérage sur une droite graduée", h:`
  <div class="retenir" data-l="Définition"><p>Sur une droite graduée, chaque point est repéré par un nombre relatif. On dit que ce nombre est l'<b>abscisse</b> de ce point.</p></div>
  ${D_ABS}
  <ul><li>Le point A est l'<b>origine</b> de la droite graduée. Son abscisse est 0. On note : <b>A(0)</b></li><li>L'abscisse du point C est 2. On note : <b>C(2)</b></li><li>L'abscisse du point E est −1,5. On note : <b>E(−1,5)</b></li></ul>
  <p><b>Exercice 3 :</b></p>
  <p>a) Note les abscisses des points A et B : A(………) &nbsp; B(………)</p>${D_EX3}
  <p>b) Place les points C(0,5) et D(−0,4) sur cette droite graduée.</p>${D_EX3b}
  <details><summary>Voir la correction</summary><div class="corr"><p>a) Entre deux nombres entiers, il y a 10 petits intervalles : chaque graduation vaut 0,1.</p><p>A(1,7) &nbsp; B(−0,6)</p>
   ${dg({min:-1, max:2, step:0.1, pts:[["B",-0.6],["A",1.7]], show:true})}
   <p>b) C est 5 graduations à droite de 0 ; D est 4 graduations à gauche de 0.</p>${dg({min:-1, max:2, step:0.1, pts:[["D",-0.4],["C",0.5]], show:true})}</div></details>`},
{k:"5", t:"Comparaison de nombres relatifs", h:`
  <div class="retenir" data-l="Propriété"><p>Lorsqu'on compare :</p><ul><li><b>deux nombres positifs</b>, le plus grand est celui qui a la plus grande distance à zéro ;</li><li><b>un nombre positif et un nombre négatif</b>, le plus grand est le nombre positif ;</li><li><b>deux nombres négatifs</b>, le plus grand est celui qui a la plus petite distance à zéro.</li></ul></div>
  <div class="retenir" data-l="Remarque"><p>Sur une droite graduée orientée vers la droite, le plus grand nombre est celui qui est le plus à droite.</p></div>
  ${D_CMP}
  <p><b>Exemples :</b> 3,5 &gt; 1 &nbsp;&nbsp;&nbsp; −2 &lt; 1 &nbsp;&nbsp;&nbsp; −4 &lt; −1,5</p>
  <p><b>Exercice 4 :</b> Compare les nombres avec &lt;, &gt; ou =.</p>
  ${cols(["a) 5 ……… −12","b) −20 ……… −3","c) 5,4 ……… 5,40","d) 9,5 ……… 9,38","e) −6,7 ……… −6,3","f) −4,86 ……… −4,5"])}
  <details><summary>Voir la correction</summary><div class="corr">
   <p>a) 5 &gt; −12 <i>(un positif est plus grand qu'un négatif)</i></p>
   <p>b) −20 &lt; −3 <i>(deux négatifs : 20 &gt; 3, donc −20 est le plus petit)</i></p>
   <p>c) 5,4 = 5,40</p>
   <p>d) 9,5 &gt; 9,38 <i>(9,50 &gt; 9,38)</i></p>
   <p>e) −6,7 &lt; −6,3 <i>(6,7 &gt; 6,3)</i></p>
   <p>f) −4,86 &lt; −4,5 <i>(4,86 &gt; 4,50)</i></p></div></details>
  <p><b>Exercice 5 :</b> Range les nombres 8,25 ; −8,12 ; 8,6 ; 8,09 ; −8,7 ; −8.</p>
  <p>a) Dans l'ordre croissant : ……… &lt; ……… &lt; ……… &lt; ……… &lt; ……… &lt; ………</p>
  <p>b) Dans l'ordre décroissant : ……… &gt; ……… &gt; ……… &gt; ……… &gt; ……… &gt; ………</p>
  <details><summary>Voir la correction</summary><div class="corr">
   <p>a) −8,7 &lt; −8,12 &lt; −8 &lt; 8,09 &lt; 8,25 &lt; 8,6</p>
   <p>b) 8,6 &gt; 8,25 &gt; 8,09 &gt; −8 &gt; −8,12 &gt; −8,7</p>
   <p><i>Les négatifs d'abord : −8,7 est le plus loin de zéro, donc le plus petit.</i></p></div></details>`},
{k:"6", t:"Repérage dans le plan", h:`
  <div class="retenir" data-l="Définition"><p>Un <b>repère orthogonal</b> du plan est composé de deux droites graduées perpendiculaires et de même origine O.</p></div>
  <div class="figs">${R_DEF}</div>
  <p>La droite horizontale est l'<b>axe des abscisses</b> ; la droite verticale est l'<b>axe des ordonnées</b>.</p>
  <p>Dans un plan, un point est repéré par deux nombres relatifs appelés <b>coordonnées</b>. Le premier nombre est l'<b>abscisse</b>, le deuxième est l'<b>ordonnée</b>.</p>
  <p><b>Exemple :</b> dans ce repère d'origine O, le point A a pour abscisse 2 et pour ordonnée 1,5. On note : <b>A(2 ; 1,5)</b>.</p>
  <p><b>Exercice 6 :</b></p>
  <div class="figs">${R_EX6}</div>
  <p>a) Indique les coordonnées des points B, C, D, E et F : B(……… ; ………) &nbsp; C(……… ; ………) &nbsp; D(……… ; ………) &nbsp; E(……… ; ………) &nbsp; F(……… ; ………)</p>
  <p>b) Dans le repère ci-dessous, place les points G(5 ; 2), H(−1 ; −1,5), I(−2 ; 0), J(3 ; −2) et K(0 ; 1,5).</p>
  <div class="figs">${rep({alt:"Repère vide"})}</div>
  <details><summary>Voir la correction</summary><div class="corr">
   <p>a) ${coords(C6)}</p>
   <div class="figs">${rep({pts:C6, proj:C6.map(p=>p[0]), grads:true})}</div>
   <p>b) I a pour ordonnée 0 : il est sur l'axe des abscisses. K a pour abscisse 0 : il est sur l'axe des ordonnées.</p>
   <div class="figs">${rep({pts:C6b, grads:true})}</div></div></details>`}
],

/* ===================== EXERCICES (dossier d'exercices, dans l'ordre de la classe) ===================== */
exos:[
{t:"Nombres relatifs, opposés, valeur absolue et droite graduée", e:[
  {n:"Activité 1", t:"Calculer le résultat de soustractions", w:"Sur ta feuille", h:`<p>Complète directement les pointillés.</p>
   ${cols(["a) 12 − 8 = ………","b) 3 − 8 = ………","c) 2 − 9 = ………","d) 100 − 71 = ………","e) 8 − 13 = ………","f) 10 − 4,3 = ………","g) 26 − 100 = ………","h) 14 − 30 = ………","i) 56 − 12 = ………","j) 15 − 22 = ………","k) 6,8 − 10 = ………","l) 3,4 − 5 = ………"])}`,
   c:`<p>Quand on enlève plus que ce que l'on a, le résultat est négatif : on calcule la différence entre les deux nombres et on met le signe −.</p>
   ${cols(["a) 12 − 8 = 4","b) 3 − 8 = −5","c) 2 − 9 = −7","d) 100 − 71 = 29","e) 8 − 13 = −5","f) 10 − 4,3 = 5,7","g) 26 − 100 = −74","h) 14 − 30 = −16","i) 56 − 12 = 44","j) 15 − 22 = −7","k) 6,8 − 10 = −3,2","l) 3,4 − 5 = −1,6"])}`},
  {n:"Exercice 1", t:"Les nombres relatifs dans la vie quotidienne", w:"Sur ta feuille", h:`<p>Écris le nombre relatif associé à chaque situation (complète les pointillés).</p>
   <p>a) Une voiture est garée au 4<sup>e</sup> sous-sol : ………</p><p>b) Charlemagne a été sacré empereur en 800 après J.-C. : ………</p><p>c) Le Mont Blanc culmine à 4 810 m d'altitude : ………</p><p>d) Ce matin, la température est de 5 °C en dessous de zéro : ………</p><p>e) Sur mon compte, je suis « à découvert » de 120 € : ………</p><p>f) Jules César est né 100 ans avant J.-C. : ………</p>`,
   c:`<p>a) −4 · b) +800 · c) +4 810 · d) −5 · e) −120 · f) −100</p><p><i>Sous le niveau 0 (sol, zéro degré, compte vide, naissance de J.-C.) : nombre négatif. Au-dessus : nombre positif.</i></p>`},
  {n:"Exercice 2", t:"Nombres relatifs et températures", w:"Sur ta feuille", h:`<p>Écris la température indiquée par chaque thermomètre (en °C).</p>${thermo([6,-4,0,-7,9,-10])}<p>A : ……… &nbsp; B : ……… &nbsp; C : ……… &nbsp; D : ……… &nbsp; E : ……… &nbsp; F : ………</p>`,
   c:`<p>Chaque graduation vaut 1 °C.</p><p>A : 6 °C · B : −4 °C · C : 0 °C · D : −7 °C · E : 9 °C · F : −10 °C</p>${thermo([6,-4,0,-7,9,-10],true)}`},
  {n:"Exercice 3", t:"Opposé et valeur absolue", w:"Sur ta feuille", h:`<p>Complète directement.</p>
   <p><b>1)</b> Donne l'opposé de chacun de ces nombres.</p>${cols(["a) 9 : ………","b) −4 : ………","c) 0 : ………","d) −2,7 : ………","e) +6,5 : ………"])}
   <p><b>2)</b> Complète.</p>${cols(["a) |+15| = ………","b) |−7,2| = ………","c) |−100| = ………","d) |0| = ………"])}
   <p><b>3)</b> Vrai ou faux ? Justifie sur ton cahier.</p><p>a) |−5| = |5| &nbsp;&nbsp; b) |−5| = −5 &nbsp;&nbsp; c) Un nombre et son opposé ont la même valeur absolue.</p>`,
   c:`<p><b>1)</b> L'opposé d'un nombre a la même distance à zéro, mais le signe contraire.</p><p>a) −9 · b) 4 · c) 0 · d) 2,7 · e) −6,5</p>
   <p><b>2)</b> a) |+15| = 15 · b) |−7,2| = 7,2 · c) |−100| = 100 · d) |0| = 0</p>
   <p><b>3)</b> a) <b>Vrai</b> : |−5| = 5 et |5| = 5. · b) <b>Faux</b> : |−5| = 5 ; une valeur absolue n'est jamais négative. · c) <b>Vrai</b> : un nombre et son opposé ont la même distance à zéro.</p>`},
  {n:"Exercice 4", t:"Positif, négatif, strictement positif, strictement négatif", w:"Sur ta feuille", h:`<p>Voici des nombres : −3 ; 0 ; +5,2 ; −0,8 ; 12 ; −10 ; 0,4. Recopie ceux qui sont :</p>
   <p>a) strictement positifs : ……………</p><p>b) négatifs : ……………</p><p>c) à la fois positifs et négatifs : ……………</p><p>d) ni strictement positifs, ni strictement négatifs : ……………</p>`,
   c:`<p>a) strictement positifs : +5,2 ; 12 ; 0,4</p><p>b) négatifs : −3 ; 0 ; −0,8 ; −10 <i>(0 est négatif !)</i></p><p>c) à la fois positifs et négatifs : 0</p><p>d) ni strictement positifs, ni strictement négatifs : 0</p>`},
  {n:"Exercice 5", t:"Nombres relatifs décimaux et droite graduée", w:"Sur ta feuille", h:`<p><b>1)</b> Sur chacune des droites graduées, lis l'abscisse des points marqués par une lettre.</p>
   ${DR.map((d,i)=>`<div style="break-inside:avoid"><p><b>Droite n°${i+1} :</b> A(………) &nbsp; B(………) &nbsp; C(………) &nbsp; D(………)</p>${drw(d)}</div>`).join("")}
   <p><b>2)</b> Sur la droite graduée ci-dessous, place les points A(−2,5), B(1,5), C(−0,5), D(2) et E(−3,5).</p>${dg({min:-4,max:3,step:0.5})}`,
   c:`<p><b>1)</b> On cherche d'abord combien vaut une graduation.</p>
   <div style="break-inside:avoid"><p><b>Droite n°1</b> (une graduation = 1) : A(−4) &nbsp; B(−1) &nbsp; C(3) &nbsp; D(5)</p>${drw(DR[0],true)}</div>
   <div style="break-inside:avoid"><p><b>Droite n°2</b> (une graduation = 0,1) : A(−0,7) &nbsp; B(−0,2) &nbsp; C(0,4) &nbsp; D(0,9)</p>${drw(DR[1],true)}</div>
   <div style="break-inside:avoid"><p><b>Droite n°3</b> (une graduation = 0,5) : A(−2,5) &nbsp; B(−1) &nbsp; C(0,5) &nbsp; D(2,5)</p>${drw(DR[2],true)}</div>
   <div style="break-inside:avoid"><p><b>Droite n°4</b> (une graduation = 5) : A(−35) &nbsp; B(−10) &nbsp; C(15) &nbsp; D(30)</p>${drw(DR[3],true)}</div>
   <p><b>2)</b> Une graduation vaut 0,5.</p>${dg({min:-4,max:3,step:0.5,pts:D5b,show:true})}`}
 ]},
{t:"Comparer et ranger des nombres relatifs", e:[
  {n:"Activité 2", t:"Relevé de températures : ranger dans l'ordre croissant", w:"Sur ta feuille", h:`<p>Marie a relevé les températures tous les matins à la même heure pendant une semaine.</p>
   <div class="scroll"><table class="std"><thead><tr><th>Lundi</th><th>Mardi</th><th>Mercredi</th><th>Jeudi</th><th>Vendredi</th><th>Samedi</th><th>Dimanche</th></tr></thead><tbody><tr><td>1,07 °C</td><td>−1,45 °C</td><td>1,5 °C</td><td>−1,8 °C</td><td>−0,5 °C</td><td>1,32 °C</td><td>−0,7 °C</td></tr></tbody></table></div>
   <p>Classe ces jours dans l'ordre croissant de leur température (du plus petit au plus grand). Tu indiqueras les températures.</p><p>………… &lt; ………… &lt; ………… &lt; ………… &lt; ………… &lt; ………… &lt; …………</p>`,
   c:`<p>Les températures négatives d'abord : −1,8 est la plus loin de zéro, donc la plus petite. Puis les positives, de la plus petite à la plus grande.</p>
   <p>Jeudi (−1,8 °C) &lt; Mardi (−1,45 °C) &lt; Dimanche (−0,7 °C) &lt; Vendredi (−0,5 °C) &lt; Lundi (1,07 °C) &lt; Samedi (1,32 °C) &lt; Mercredi (1,5 °C)</p>
   ${dg({min:-2,max:2,step:0.1,lab:1,pts:[["J",-1.8],["Ma",-1.45],["D",-0.7],["V",-0.5,0,1],["L",1.07],["S",1.32,0,1],["Me",1.5]],alt:"Les sept températures sur une droite graduée"})}`},
  {n:"Exercice 6", t:"Comparaison de nombres relatifs", w:"Sur ta feuille", h:`<p>Compare avec &lt;, &gt; ou = (complète directement).</p>
   ${cols(["a) −3,5 …… 3,2","b) −10 …… −2","c) 5,8 …… 5,17","d) −7,3 …… −7,9","e) −4 …… −6","f) 9,2 …… 9,20","g) 1,4 …… 1,04","h) −6,1 …… −6,25"])}`,
   c:`<p>a) −3,5 &lt; 3,2 <i>(un négatif est plus petit qu'un positif)</i></p><p>b) −10 &lt; −2 <i>(10 &gt; 2)</i></p><p>c) 5,8 &gt; 5,17 <i>(5,80 &gt; 5,17)</i></p><p>d) −7,3 &gt; −7,9 <i>(7,3 &lt; 7,9 : −7,3 est plus près de zéro)</i></p><p>e) −4 &gt; −6 <i>(4 &lt; 6)</i></p><p>f) 9,2 = 9,20</p><p>g) 1,4 &gt; 1,04 <i>(1,40 &gt; 1,04)</i></p><p>h) −6,1 &gt; −6,25 <i>(6,10 &lt; 6,25)</i></p>`},
  {n:"Exercice 7", t:"Ranger des nombres relatifs", w:"Sur ta feuille", h:`<p>Complète directement.</p>
   <p><b>1)</b> Range dans l'ordre croissant : 3,25 ; −3,12 ; 3,6 ; 3,09 ; −3,7 ; −3</p><p>………… &lt; ………… &lt; ………… &lt; ………… &lt; ………… &lt; …………</p>
   <p><b>2)</b> Range dans l'ordre décroissant : −4,10 ; 4,52 ; 4,7 ; 4,3 ; −4,25 ; 4,09 ; −4,3</p><p>……… &gt; ……… &gt; ……… &gt; ……… &gt; ……… &gt; ……… &gt; ………</p>`,
   c:`<p>Les négatifs d'abord : le plus loin de zéro est le plus petit. Puis les positifs, du plus petit au plus grand.</p><p><b>1)</b> −3,7 &lt; −3,12 &lt; −3 &lt; 3,09 &lt; 3,25 &lt; 3,6</p><p><b>2)</b> 4,7 &gt; 4,52 &gt; 4,3 &gt; 4,09 &gt; −4,10 &gt; −4,25 &gt; −4,3</p><p><i>Astuce : on écrit tous les nombres avec deux chiffres après la virgule (−3,70 ; −3,12 ; −3,00…) pour bien les comparer.</i></p>`},
  {n:"Exercice 8", t:"Problèmes de rangement", w:"Sur ton cahier", h:`<p><b>1)</b> Relevé de températures à 6 h : Briançon −8,5 °C ; Lille 1,5 °C ; Strasbourg −3,2 °C ; Brest 4 °C ; Grenoble −3,25 °C ; Nice 9 °C.</p><p>a) Quelle ville est la plus froide ? la plus chaude ?</p><p>b) Range les villes de la plus chaude à la plus froide.</p>
   <p><b>2)</b> Fosse des Mariannes : −10 994 m ; Lac Assal : −155 m ; Mont Blanc : +4 810 m ; Paris : +35 m ; mer Morte : −430 m. Range ces altitudes dans l'ordre croissant, puis dis quel est le point le plus bas.</p>`,
   c:`<p><b>1) a)</b> La ville la plus froide est Briançon (−8,5 °C). La ville la plus chaude est Nice (9 °C).</p>
   <p><b>b)</b> 9 &gt; 4 &gt; 1,5 &gt; −3,2 &gt; −3,25 &gt; −8,5 : Nice, Brest, Lille, Strasbourg, Grenoble, Briançon.</p><p><i>Attention : −3,2 &gt; −3,25 car 3,20 &lt; 3,25. Strasbourg est donc un peu moins froide que Grenoble.</i></p>
   <p><b>2)</b> −10 994 &lt; −430 &lt; −155 &lt; +35 &lt; +4 810</p><p>Fosse des Mariannes, mer Morte, lac Assal, Paris, Mont Blanc. Le point le plus bas est la fosse des Mariannes (−10 994 m).</p>`},
  {n:"Exercice 9", t:"Vrai ou faux ?", w:"Sur ton cahier", h:`<p>Réponds sur ton cahier et justifie chaque réponse (par un exemple, une droite graduée ou une propriété).</p>
   <p>a) −7 &lt; −2</p><p>b) −0,5 &gt; −0,05</p><p>c) Un nombre strictement négatif est toujours plus petit qu'un nombre strictement positif.</p><p>d) 0 est strictement positif.</p><p>e) |−8| est plus petit que |−3|.</p><p>f) Deux nombres opposés ont la même valeur absolue.</p><p>g) |−4,2| = −4,2</p>`,
   c:`<p>a) <b>Vrai</b> : deux nombres négatifs, le plus grand est celui qui a la plus petite distance à zéro ; 7 &gt; 2, donc −7 &lt; −2.</p>
   <p>b) <b>Faux</b> : 0,5 &gt; 0,05, donc −0,5 est plus loin de zéro : −0,5 &lt; −0,05.</p>
   <p>c) <b>Vrai</b> : un nombre strictement négatif est à gauche de 0 et un nombre strictement positif à droite de 0. <i>(0 n'est ni strictement positif, ni strictement négatif.)</i></p>
   <p>d) <b>Faux</b> : 0 n'a pas de signe ; il est positif, mais pas strictement positif.</p>
   <p>e) <b>Faux</b> : |−8| = 8 et |−3| = 3, et 8 &gt; 3.</p>
   <p>f) <b>Vrai</b> : c'est la propriété du cours, par exemple |4| = |−4| = 4.</p>
   <p>g) <b>Faux</b> : |−4,2| = 4,2 ; une valeur absolue n'est jamais négative.</p>`},
  {n:"Exercice 10", t:"Qui suis-je ? / Intercaler", w:"Sur ton cahier", h:`<p><b>1)</b> Trouve le nombre :</p><p>a) Je suis strictement négatif et ma valeur absolue est 7.</p><p>b) Je suis l'opposé de −3,4.</p><p>c) Je suis à la fois positif et négatif.</p><p>d) Ma valeur absolue est 5 et je suis plus grand que 0.</p><p>e) Je suis le plus petit nombre entier relatif strictement plus grand que −3.</p>
   <p><b>2)</b> Écris un nombre relatif compris entre :</p>${cols(["a) −3 et −2","b) −0,4 et −0,3","c) 1 et 1,1","d) −5 et −4,9"])}`,
   c:`<p><b>1)</b> a) −7 · b) 3,4 · c) 0 · d) 5 · e) −2 <i>(les entiers plus grands que −3 sont −2, −1, 0, 1… ; le plus petit est −2)</i></p>
   <p><b>2)</b> Il y a beaucoup de bonnes réponses, par exemple :</p><p>a) −2,5 · b) −0,35 · c) 1,05 · d) −4,95</p><p><i>Vérifie avec une droite graduée : −3 &lt; −2,5 &lt; −2.</i></p>`}
 ]},
{t:"Repérage dans le plan (activité 3)", e:[
  {n:"Exercice 11", t:"Coordonnées dans un repère", w:"Sur ta feuille", h:`<p>Complète directement, puis place les points dans le repère de droite.</p>
   <div class="figs">${rep({pts:P11, alt:"Repère de gauche avec les points A à H"})}${rep({alt:"Repère de droite, vide"})}</div>
   <p>a) Indique les coordonnées des points A à H (repère de gauche) : A(……… ; ………) &nbsp; B(……… ; ………) &nbsp; C(……… ; ………) &nbsp; D(……… ; ………) &nbsp; E(……… ; ………) &nbsp; F(……… ; ………) &nbsp; G(……… ; ………) &nbsp; H(……… ; ………)</p>
   <p>b) Dans le repère de droite, place les points I(4 ; 3), J(−2 ; 2), K(−4 ; 0) et L(0 ; −2).</p>`,
   c:`<p>a) On lit d'abord l'abscisse (horizontalement), puis l'ordonnée (verticalement).</p><p>${coords(P11.slice(0,4))}</p><p>${coords(P11.slice(4))}</p>
   <div class="figs">${rep({pts:P11, proj:["A","B","C","D","E","H"], grads:true})}</div>
   <p><i>F a pour ordonnée 0 : il est sur l'axe des abscisses. G a pour abscisse 0 : il est sur l'axe des ordonnées.</i></p>
   <p>b)</p><div class="figs">${rep({pts:P11b, grads:true})}</div>`},
  {n:"Exercice 12", t:"Repères et parallélogrammes", w:"Sur ta feuille", h:`<p>Utilise les deux repères ci-dessous.</p><div class="figs">${rep({alt:"Repère de gauche"})}${rep({alt:"Repère de droite"})}</div>
   <p><b>1)</b> Dans le repère de gauche, place A(−4 ; −2), B(1 ; −2) et C(3 ; 1). Place le point D pour que ABCD soit un parallélogramme et lis ses coordonnées : D(……… ; ………). Écris deux égalités de parallélisme : ……… // ……… et ……… // ………</p>
   <p><b>2)</b> Dans le repère de droite, place A(−3 ; 2), B(4 ; 1) et le point O, origine du repère. ABCD est un parallélogramme de centre O. Place C et D et lis leurs coordonnées : C(……… ; ………) D(……… ; ………). Que remarques-tu sur les coordonnées de A et de C ?</p>`,
   c:`<p><b>1)</b> Dans un parallélogramme, les côtés opposés sont parallèles et de même longueur. Pour aller de B à C, on avance de 2 carreaux vers la droite et on monte de 3 carreaux. On fait le même déplacement depuis A : on arrive en D.</p>
   <div class="figs">${rep({pts:[["A",-4,-2,-8,18],["B",1,-2,6,18],["C",3,1,8,-8],["D",-2,1,-8,-8]], poly:["A","B","C","D"], grads:true})}</div>
   <p>D(−2 ; 1). &nbsp; (AB) // (DC) et (AD) // (BC)</p>
   <p><b>2)</b> Les diagonales d'un parallélogramme se coupent en leur milieu. O est donc le milieu de [AC] et de [BD] : C est le symétrique de A par rapport à O, et D le symétrique de B.</p>
   <div class="figs">${rep({pts:[["A",-3,2,-8,-8],["B",4,1,8,-8],["C",3,-2,8,18],["D",-4,-1,-8,18],["O",0,0,6,18]], poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], grads:true})}</div>
   <p>C(3 ; −2) &nbsp; D(−4 ; −1)</p><p>Les coordonnées de C sont les <b>opposées</b> de celles de A : A(−3 ; 2) et C(3 ; −2).</p>`}
 ]},
{t:"Exercice en plus", e:[
  {n:"Exercice 13", t:"« Le mot caché »", w:"Sur ta feuille", h:`<p><b>Règle du jeu :</b> tu pars de la case T (départ). Tu te déplaces de case en case en suivant les flèches, mais on se déplace <b>obligatoirement vers un nombre plus petit</b>. Entoure au crayon les lettres utilisées. Une fois arrivé à la case E, relève toutes les lettres rencontrées et remets-les dans le bon ordre pour trouver le mot caché.</p>
   ${motCache(false)}<p>Mot caché : ……………………………</p>`,
   c:`<p>À chaque case, on compare le nombre de la case avec ceux des cases où mènent les flèches, et on ne prend que les nombres plus petits.</p>
   <p>T (3,2) → I (1,9) → F (−0,4) → A (−0,9) → L (−1,25) → R (−2,6) → E (−2,65)</p>
   <p><i>Pièges : W (4,5), Y (2,05), U (0,3), O (−0,45), K (−1,2) et S (−2,06) sont plus grands, on ne peut pas y aller. M (1,09) et N (−1,3) sont plus petits, mais ce sont des impasses : aucune flèche n'en repart.</i></p>
   ${motCache(true)}
   <p>Entre le départ et l'arrivée, on a rencontré les lettres I, F, A, L, R. Remises dans l'ordre, elles forment le mot <b>FLAIR</b>.</p>`}
 ]}
],

/* ===================== QUIZ ===================== */
quiz:[
{nom:"Soustractions et nombres négatifs", schema:S_SOUS, q:{
 1:[ {g:()=>{ const a=ri(1,9), b=a+ri(1,9); return {q:`Calcule ${a} − ${b}.`, rep:F(a-b), ex:`On enlève plus que ce qu'on a : ${b} − ${a} = ${b-a}, donc ${a} − ${b} = ${F(a-b)}.`, sx:dg({w:400, min:Math.min(-10,a-b-1),max:10,step:1,lab:5,only:[0],dots:[[a,"var(--ink)",F(a)],[a-b,RED,F(a-b)]],arcs:[[a,a-b,"on recule de "+b,RED]]})}; }},
     {g:()=>{ const n=ri(1,5); return {q:`Une voiture est garée au ${n===1?"1<sup>er</sup>":n+"<sup>e</sup>"} sous-sol. Quel nombre relatif correspond à cet étage ?`, c:shuf([F(-n),"+"+n,"0"]), rep:F(-n), ex:"Sous le rez-de-chaussée (étage 0), les étages sont négatifs.", sx:S_OPP}; }},
     {q:"Une température de 3 °C en dessous de zéro s'écrit :", c:["−3 °C","+3 °C","3 °C"], rep:"−3 °C", ex:"En dessous de zéro : nombre négatif.", sx:thermo([-3],true)} ],
 2:[ {g:()=>{ const a=ri(10,40), b=a+ri(5,40); return {q:`Calcule ${a} − ${b}.`, rep:F(a-b), ex:`${b} − ${a} = ${b-a}, donc ${a} − ${b} = ${F(a-b)}.`, sx:`<p class="calc">${a} − ${b} = −(${b} − ${a}) = ${F(a-b)}</p><p class="schN">On calcule « le plus grand moins le plus petit », puis on met le signe −.</p>`}; }},
     {g:()=>{ const a=ri(11,89), b=100; return {q:`Calcule ${a} − ${b}.`, rep:F(a-b), ex:`100 − ${a} = ${b-a}, donc ${a} − 100 = ${F(a-b)}.`, sx:`<p class="calc">${a} − 100 = ${F(a-b)} &nbsp; car &nbsp; 100 − ${a} = ${b-a}</p>`}; }},
     {g:()=>{ const n=ri(2,9)*50; return {q:`Sur son compte, Hugo est « à découvert » de ${n} €. Quel nombre relatif indique son solde (en €) ?`, rep:F(-n), ex:"À découvert : il doit de l'argent à la banque, le solde est négatif.", sx:S_OPP}; }} ],
 3:[ {g:()=>{ const a=ri(11,89), b=ri(Math.ceil(a/10)+1, 10); return {q:`Calcule ${F(a/10)} − ${b}.`, rep:F(a/10-b), ex:`${b} − ${F(a/10)} = ${F(b-a/10)}, donc ${F(a/10)} − ${b} = ${F(a/10-b)}.`, sx:`<p class="calc">${F(a/10)} − ${b} = ${F(a/10-b)} &nbsp; car &nbsp; ${b} − ${F(a/10)} = ${F(b-a/10)}</p>`}; }},
     {g:()=>{ const n=ri(2,9)*100; return {q:`Jules César est né 100 ans avant J.-C. Un roi a vécu ${n} ans avant J.-C. Quel nombre relatif associer à cette date ?`, rep:F(-n), ex:"Avant J.-C. : nombre négatif.", sx:S_OPP}; }} ]
}},
{nom:"Signe, distance à zéro et opposé", schema:S_OPP, q:{
 1:[ {g:()=>{ const a=ri(1,20)*pick([1,-1]); return {q:`Quel est l'opposé de ${Fs(a)} ?`, rep:F(-a), ex:`Même distance à zéro (${Math.abs(a)}), signe contraire.`, sx:S_OPP}; }},
     {g:()=>{ const a=-ri(1,30); return {q:`Quelle est la distance à zéro de ${F(a)} ?`, rep:F(-a), ex:`${F(a)} a pour signe « − » et pour distance à zéro ${F(-a)}.`, sx:S_OPP}; }},
     {g:()=>{ const a=ri(2,15); return {q:`Quel est le signe de −${a} ?`, c:["−","+"], rep:"−", ex:`−${a} est un nombre négatif : son signe est « − ».`}; }} ],
 2:[ {g:()=>{ const a=r3(ri(11,99)/10)*pick([1,-1]); return {q:`Quel est l'opposé de ${Fs(a)} ?`, rep:F(-a), ex:`L'opposé de ${Fs(a)} est ${F(-a)}.`, sx:S_OPP}; }},
     {g:()=>{ const a=ri(2,12); return {q:`Les nombres ${a} et −${a} sont :`, c:["opposés","égaux","tous les deux négatifs"], rep:"opposés", ex:"Même distance à zéro, signes différents : ce sont des nombres opposés.", sx:S_OPP}; }} ],
 3:[ {q:"Quel est l'opposé de 0 ?", rep:"0", ex:"L'opposé de 0 est 0 (0 n'a pas de signe).", sx:S_OPP},
     {q:"Vrai ou faux : l'opposé d'un nombre strictement négatif est toujours strictement positif.", c:VF, rep:"Vrai", ex:"On change le signe « − » en « + » : par exemple, l'opposé de −3,2 est 3,2.", sx:S_OPP},
     {q:"Vrai ou faux : −7 et 7 ont la même distance à zéro.", c:VF, rep:"Vrai", ex:"Leur distance à zéro est 7 : ce sont des nombres opposés.", sx:S_OPP} ]
}},
{nom:"Valeur absolue", schema:S_ABS, q:{
 1:[ {g:()=>{ const a=ri(1,50); return {q:`Complète : |−${a}| = …`, rep:String(a), ex:`La valeur absolue de −${a} est sa distance à zéro : ${a}.`, sx:S_ABS}; }},
     {g:()=>{ const a=ri(1,50); return {q:`Complète : |+${a}| = …`, rep:String(a), ex:`La distance à zéro de +${a} est ${a}.`, sx:S_ABS}; }} ],
 2:[ {g:()=>{ const a=r3(ri(11,99)/10); return {q:`Complète : |−${F(a)}| = …`, rep:F(a), ex:`|−${F(a)}| = ${F(a)}.`, sx:S_ABS}; }},
     {g:()=>{ const a=ri(2,15); return {q:`Quels sont les deux nombres de valeur absolue ${a} ?`, c:shuf([`${a} et −${a}`,`${a} et 0`,`−${a} et 0`]), rep:`${a} et −${a}`, ex:`Deux nombres opposés ont la même valeur absolue : |${a}| = |−${a}| = ${a}.`, sx:S_ABS}; }} ],
 3:[ {q:"Vrai ou faux : |−5| = −5.", c:VF, rep:"Faux", ex:"|−5| = 5 : une valeur absolue n'est jamais négative.", sx:S_ABS},
     {g:()=>{ const a=ri(2,9), b=ri(a+1,15); return {q:`Vrai ou faux : |−${b}| est plus petit que |−${a}|.`, c:VF, rep:"Faux", ex:`|−${b}| = ${b} et |−${a}| = ${a}, or ${b} &gt; ${a}.`, sx:S_ABS}; }},
     {q:"Complète : |0| = …", rep:"0", ex:"La distance de 0 à zéro est 0.", sx:S_ABS} ]
}},
{nom:"Positif, négatif, strictement…", schema:S_POS, q:{
 1:[ {g:()=>{ const a=r3(ri(1,99)/pick([1,10]))*pick([1,-1]); return {q:`Le nombre ${Fs(a)} est :`, c:["strictement positif","strictement négatif"], rep:a>0?"strictement positif":"strictement négatif", ex:`Son signe est « ${a>0?"+":"−"} ».`, sx:S_POS}; }},
     {q:"Le nombre 0 est :", c:["à la fois positif et négatif","strictement positif","strictement négatif"], rep:"à la fois positif et négatif", sx:S_POS} ],
 2:[ {q:"Parmi ces nombres, lequel est négatif mais pas strictement négatif ?", c:["0","−1","−0,1"], rep:"0", ex:"0 est négatif, mais il n'est pas strictement négatif.", sx:S_POS},
     {g:()=>{ const L=shuf([0, -ri(1,9), r3(ri(1,9)/10), -r3(ri(11,99)/10), ri(10,20), -ri(10,30)]); const n=L.filter(x=>x>0).length; return {q:`Combien de nombres sont strictement positifs dans cette liste : ${L.map(Fs).join(" ; ")} ?`, rep:String(n), ex:`Les nombres strictement positifs sont : ${L.filter(x=>x>0).map(Fs).join(" ; ")}. 0 n'est pas strictement positif.`, sx:S_POS}; }} ],
 3:[ {q:"Vrai ou faux : 0 est strictement positif.", c:VF, rep:"Faux", ex:"0 est positif, mais pas strictement positif.", sx:S_POS},
     {g:()=>{ const L=shuf([0, -ri(1,9), r3(ri(1,9)/10), -r3(ri(11,99)/10), ri(10,20)]); const n=L.filter(x=>x<=0).length; return {q:`Combien de nombres sont négatifs dans cette liste : ${L.map(Fs).join(" ; ")} ?`, rep:String(n), ex:`Les nombres négatifs sont : ${L.filter(x=>x<=0).map(Fs).join(" ; ")}. Attention, 0 est négatif !`, sx:S_POS}; }},
     {q:"Vrai ou faux : un nombre positif peut être égal à 0.", c:VF, rep:"Vrai", ex:"0 est positif (et négatif).", sx:S_POS} ]
}},
{nom:"Abscisse sur une droite graduée", schema:S_ABSC, q:{
 1:[ {g:()=>readQ(1)},
     {q:"Sur une droite graduée, l'origine a pour abscisse :", c:["0","1","−1"], rep:"0", ex:"L'origine de la droite graduée est le point d'abscisse 0."} ],
 2:[ {g:()=>readQ(2)} ],
 3:[ {g:()=>readQ(3)} ]
}},
{nom:"Comparer deux nombres relatifs", schema:S_CMP, q:{
 1:[ {g:()=>{ const a=-ri(1,20), b=ri(1,20), [x,y]=pick([[a,b],[b,a]]); return {q:`Compare : ${F(x)} … ${F(y)}`, c:[LT,GT,"="], rep:cmp(x,y), ex:cmpEx(x,y), sx:cmpSx(x,y)}; }},
     {g:()=>{ let a,b; do{ a=-ri(1,20); b=-ri(1,20); }while(a===b); return {q:`Compare : ${F(a)} … ${F(b)}`, c:[LT,GT,"="], rep:cmp(a,b), ex:cmpEx(a,b), sx:cmpSx(a,b)}; }} ],
 2:[ {g:()=>{ const u=-ri(1,9), a=r3(u-ri(1,9)/10); let b; do{ b=r3(u-ri(1,9)/10); }while(b===a); return {q:`Compare : ${F(a)} … ${F(b)}`, c:[LT,GT,"="], rep:cmp(a,b), ex:cmpEx(a,b), sx:cmpSx(a,b)}; }},
     {g:()=>{ const a=r3(ri(11,99)/10), b=-r3(ri(11,99)/10), [x,y]=pick([[a,b],[b,a]]); return {q:`Compare : ${F(x)} … ${F(y)}`, c:[LT,GT,"="], rep:cmp(x,y), ex:cmpEx(x,y), sx:cmpSx(x,y)}; }} ],
 3:[ {g:()=>{ const u=ri(1,9), d=ri(1,8), a=-r3(u+d/10), b=-r3(u+d/10+ri(1,9)/100), [x,y]=pick([[a,b],[b,a]]); return {q:`Compare : ${F(x)} … ${F(y)}`, c:[LT,GT,"="], rep:cmp(x,y), ex:cmpEx(x,y)+` Pense à écrire ${F(a)} = ${F(a)}0.`, sx:cmpSx(x,y)}; }},
     {g:()=>{ const d=ri(1,9), a=-r3(d/10), b=-r3(d/100), [x,y]=pick([[a,b],[b,a]]); return {q:`Compare : ${F(x)} … ${F(y)}`, c:[LT,GT,"="], rep:cmp(x,y), ex:cmpEx(x,y), sx:cmpSx(x,y)}; }},
     {g:()=>{ let k; do{ k=ri(11,99); }while(k%10===0); const a=-r3(k/10); return {q:`Compare : ${F(a)} … ${F(a)}0`, c:[LT,GT,"="], rep:"=", ex:"Un 0 à la fin de la partie décimale ne change pas le nombre."}; }} ]
}},
{nom:"Ranger des nombres relatifs", schema:S_RANG, q:{
 1:[ {g:()=>{ const L=TRd(4, ()=>ri(-15,15)); const m=Math.min(...L); return {q:`Quel est le plus petit de ces nombres : ${L.map(F).join(" ; ")} ?`, c:L.map(F), rep:F(m), ex:"Le plus petit est le plus à gauche sur la droite graduée.", sx:S_RANG}; }},
     {g:()=>{ const L=TRd(4, ()=>ri(-15,15)); const m=Math.max(...L); return {q:`Quel est le plus grand de ces nombres : ${L.map(F).join(" ; ")} ?`, c:L.map(F), rep:F(m), ex:"Le plus grand est le plus à droite sur la droite graduée.", sx:S_RANG}; }} ],
 2:[ {g:()=>{ const u=-ri(1,6), L=TRd(4, ()=>r3(u-ri(0,99)/100)); const m=Math.max(...L); return {q:`Quel est le plus grand de ces nombres : ${L.map(F).join(" ; ")} ?`, c:L.map(F), rep:F(m), ex:"Entre nombres négatifs, le plus grand est celui qui a la plus petite distance à zéro.", sx:S_RANG}; }} ],
 3:[ {g:()=>{ const u=ri(1,6), L=shuf([...TRd(2, ()=>-r3(u+ri(0,99)/100)), ...TRd(2, ()=>r3(u+ri(0,99)/100))]); const up=[...L].sort((a,b)=>a-b), byAbs=[...L].sort((a,b)=>Math.abs(a)-Math.abs(b)), negRev=[...L.filter(x=>x<0).sort((a,b)=>b-a), ...L.filter(x=>x>=0).sort((a,b)=>a-b)];
       const s=a=>a.map(F).join(" &lt; "); return {q:`Quel est le bon rangement dans l'ordre croissant ?`, c:shuf(uniq(s(up),[s(negRev),s(byAbs),s([...up].reverse())]).slice(0,3)), rep:s(up), ex:"Les négatifs d'abord, du plus loin de zéro au plus près, puis les positifs.", sx:S_RANG}; }} ]
}},
{nom:"Coordonnées d'un point", schema:S_COORD, q:{
 1:[ {g:()=>{ let x,y; do{ x=ri(-5,5); y=ri(-4,4); }while(!x||!y); return {q:"Lis les coordonnées du point M.", fig:rep({pts:[["M",x,y]]}), t:"M(□ ; □)", r:[F(x),F(y)], txt:true, ex:`Abscisse ${F(x)}, ordonnée ${F(y)}.`, sx:rep({pts:[["M",x,y]],proj:["M"]})}; }},
     {g:()=>{ let x,y; do{ x=ri(-4,4); y=ri(-4,4); }while(!x||!y||Math.abs(x)===Math.abs(y)||Math.abs(y)>4||Math.abs(x)>4); const nm=shuf(["M","N","R"]), P=shuf([[nm[0],x,y],[nm[1],y,x],[nm[2],-x,y]]); /* le bon point n'est pas toujours M */ const good=P.find(p=>p[1]===x&&p[2]===y)[0];
       return {q:`Quel point a pour coordonnées (${F(x)} ; ${F(y)}) ?`, fig:rep({pts:P}), c:["M","N","R"], rep:good, ex:`On avance de ${F(x)} sur l'axe des abscisses, puis de ${F(y)} sur l'axe des ordonnées.`, sx:rep({pts:[[good,x,y]],proj:[good]})}; }} ],
 2:[ {g:()=>{ const z=pick(["x","y"]); let x=ri(-5,5), y=ri(-4,4); if(z==="x") x=0; else y=0; if(!x&&!y) y=3; return {q:"Lis les coordonnées du point M.", fig:rep({pts:[["M",x,y]]}), t:"M(□ ; □)", r:[F(x),F(y)], txt:true, ex:x===0?"M est sur l'axe des ordonnées : son abscisse est 0.":"M est sur l'axe des abscisses : son ordonnée est 0.", sx:rep({pts:[["M",x,y]],proj:["M"],grads:true})}; }},
     {q:"Un point a pour ordonnée 0. Il se trouve sur :", c:["l'axe des abscisses","l'axe des ordonnées"], rep:"l'axe des abscisses", ex:"Ordonnée 0 : il n'est ni au-dessus ni en dessous de l'axe horizontal (l'axe des abscisses).", sx:S_COORD} ],
 3:[ {g:()=>{ let x,y; do{ x=ri(-9,9)/2; y=ri(-7,7)/2; }while(Number.isInteger(x)&&Number.isInteger(y)||!x||!y); return {q:"Lis les coordonnées du point M.", fig:rep({pts:[["M",x,y]]}), t:"M(□ ; □)", r:[F(x),F(y)], txt:true, ex:`Une coordonnée « tombe » au milieu d'un carreau : ${F(x)} et ${F(y)}.`, sx:rep({pts:[["M",x,y]],proj:["M"],grads:true})}; }},
     {q:"Dans A(−3 ; 5), le nombre 5 est :", c:["l'ordonnée de A","l'abscisse de A"], rep:"l'ordonnée de A", ex:"Le premier nombre est l'abscisse, le deuxième est l'ordonnée.", sx:S_COORD} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement — Chapitre 5", duree:45, info:"Durée : 45 min · Calculatrice non autorisée · Règle et crayon",
comp:[
  ["CONNAÎTRE","Je connais le vocabulaire : signe, distance à zéro, opposé, valeur absolue, positif, négatif.","Ex. 1 et 7 (5 points)"],
  ["CALCULER","Je calcule le résultat d'une soustraction, même quand il est négatif.","Ex. 2 (2 points)"],
  ["REPRÉSENTER","Je lis et je place des points sur une droite graduée et dans un repère.","Ex. 3 et 6 (7,5 points)"],
  ["RAISONNER","Je compare et je range des nombres relatifs.","Ex. 4 et 5 (5,5 points)"]
],
exos:[
{t:"Vrai ou faux ?", p:3, h:`<p>Réponds par Vrai ou Faux. Aucune justification n'est demandée.</p><p>a) −12 est un nombre relatif de distance à zéro 12.</p><p>b) L'opposé de −0,8 est 0,8.</p><p>c) |−11| = −11</p><p>d) 0 est à la fois positif et négatif.</p><p>e) −4,5 est strictement positif.</p><p>f) −2 &gt; −1</p>`,
 c:`<p>a) Vrai · b) Vrai · c) Faux (|−11| = 11) · d) Vrai · e) Faux (son signe est « − ») · f) Faux (−2 &lt; −1 : 2 &gt; 1)</p><p><i>0,5 point par réponse.</i></p>`},
{t:"Des soustractions qui passent sous zéro", p:2, h:`<p>Calcule.</p>${cols(["a) A = 7 − 15","b) B = 40 − 100","c) C = 2,5 − 4","d) D = 1 − 3,7"])}`,
 c:`<p>On enlève plus que ce que l'on a : on calcule « le plus grand moins le plus petit », puis on met le signe −.</p><div class="calcs">${[["a","A","7 − 15","−8","15 − 7 = 8"],["b","B","40 − 100","−60","100 − 40 = 60"],["c","C","2,5 − 4","−1,5","4 − 2,5 = 1,5"],["d","D","1 − 3,7","−2,7","3,7 − 1 = 2,7"]].map(([l,n,e,r,w])=>`<div><p class="calc">${l}) ${n} = ${e}<br>${n} = <b>${r}</b> &nbsp; <i>(${w})</i></p></div>`).join("")}</div><p><i>0,5 point par calcul.</i></p>`},
{t:"Une nouvelle graduation", p:3.5, h:`<p>Observe bien la droite graduée : une unité est partagée en <b>5</b>.</p>${dg({min:-2,max:2,step:0.2,lab:1,pts:[["A",-1.4],["B",-0.6],["C",0.8]]})}
  <p>a) Lis l'abscisse des points A, B et C.</p><p>b) Place les points D(1,6) et E(−1,8).</p><p>c) Place le point F dont l'abscisse est l'opposé de l'abscisse de B.</p><p>d) Range les abscisses des points A, B, C, D et E dans l'ordre croissant.</p>`,
 c:`<p>Une unité est partagée en 5 : une graduation vaut 1 ÷ 5 = 0,2.</p><p>a) A(−1,4) ; B(−0,6) ; C(0,8) <i>(1,5 point)</i></p><p>b) D et E sont placés sur la figure. <i>(1 point)</i></p><p>c) L'opposé de −0,6 est 0,6 : F(0,6). <i>(0,5 point)</i></p>
  ${dg({w:640, min:-2,max:2,step:0.2,lab:1,pts:[["E",-1.8],["A",-1.4],["B",-0.6],["F",0.6],["C",0.8],["D",1.6]],show:true})}
  <p>d) −1,8 &lt; −1,4 &lt; −0,6 &lt; 0,8 &lt; 1,6 <i>(0,5 point)</i></p>`},
{t:"Le tournoi de golf", p:3, h:`<p>Au golf, le score d'un joueur est un nombre relatif : « −3 » veut dire qu'il a utilisé 3 coups de moins que prévu, « +2 » qu'il a utilisé 2 coups de plus. <b>Le vainqueur est celui qui a le score le plus petit.</b></p>
  <div class="scroll"><table class="std"><thead><tr><th>Joueur</th><th>Léa</th><th>Malik</th><th>Inès</th><th>Tom</th><th>Sacha</th><th>Noé</th></tr></thead><tbody><tr><td><b>Score</b></td><td>−4</td><td>+4</td><td>−7</td><td>0</td><td>−5</td><td>+1</td></tr></tbody></table></div>
  <p>a) Qui a gagné le tournoi ?</p><p>b) Écris le classement, du premier au dernier, en rangeant les scores.</p><p>c) Quels sont les deux joueurs qui ont des scores opposés ?</p><p>d) Quel joueur a un score à la fois positif et négatif ?</p>`,
 c:`<p>a) Inès a gagné : −7 est le plus petit score. <i>(0,5 point)</i></p><p>b) −7 &lt; −5 &lt; −4 &lt; 0 &lt; +1 &lt; +4 : Inès, Sacha, Léa, Tom, Noé, Malik. <i>(1,5 point)</i></p><p>c) Léa (−4) et Malik (+4). <i>(0,5 point)</i></p><p>d) Tom : son score est 0. <i>(0,5 point)</i></p>`},
{t:"Comparer", p:2.5, h:`<p>Compare avec &lt;, &gt; ou =.</p>${cols(["a) −15 …… 2","b) −3,4 …… −3,7","c) 0 …… −0,1","d) −8 …… −8,0","e) −0,09 …… −0,1"])}`,
 c:`<p>a) −15 &lt; 2 · b) −3,4 &gt; −3,7 · c) 0 &gt; −0,1 · d) −8 = −8,0 · e) −0,09 &gt; −0,1 <i>(0,09 &lt; 0,10)</i></p><p><i>0,5 point par comparaison.</i></p>`},
{t:"La carte au trésor", p:4, h:`<p>Sur cette carte, le bateau est au point B, le palmier au point P et la cabane au point C.</p>${rep({pts:[["B",-3,3],["P",4,-1],["C",0,2]], alt:"Carte au trésor avec les points B, P et C"})}
  <p>a) Lis les coordonnées des points B, P et C.</p><p>b) Place le rocher R(−2 ; −1,5) et le puits W(−5 ; 0).</p><p>c) Le trésor T a pour coordonnées les opposées de celles du bateau. Écris les coordonnées de T, puis place-le.</p><p>d) Sur quel axe se trouve le puits W ? Explique.</p>`,
 c:`<p>a) B(−3 ; 3) · P(4 ; −1) · C(0 ; 2) <i>(1,5 point)</i></p><p>b) Voir la figure. <i>(1 point)</i></p><p>c) T(3 ; −3) <i>(0,5 point pour les coordonnées, 0,5 point pour le point placé)</i></p>
  <div class="figs">${rep({pts:[["B",-3,3],["P",4,-1],["C",0,2],["R",-2,-1.5],["W",-5,0,8,-9],["T",3,-3]], proj:["R","T"], grads:true})}</div>
  <p>d) W est sur l'axe des abscisses, car son ordonnée est 0. <i>(0,5 point)</i></p>`},
{t:"Qui suis-je ?", p:2, h:`<p>a) Je suis l'opposé de 6,3.</p><p>b) Je suis un nombre entier strictement compris entre −4 et −2.</p><p>c) Ma valeur absolue est 2 et je suis plus petit que 1.</p><p>d) Je suis le plus grand des nombres entiers strictement négatifs.</p>`,
 c:`<p>a) −6,3 · b) −3 · c) −2 <i>(2 et −2 ont pour valeur absolue 2, mais 2 &gt; 1)</i> · d) −1</p><p><i>0,5 point par réponse.</i></p>`}
],
/* ---- version aménagée (élèves à besoins éducatifs particuliers), faite comme M. Staal fait les siennes :
   même durée, environ une question sur cinq retirée (jamais un exercice entier), questions renumérotées, barème recalculé sur 20 ---- */
bep:{
titre:"Évaluation d'entraînement — Chapitre 5 · version aménagée", duree:45, info:"Version aménagée · Durée : 45 min · Calculatrice non autorisée · Règle et crayon",
note:"Même durée et mêmes exercices, avec environ une question sur cinq en moins (réparties dans plusieurs exercices). Les questions sont renumérotées et le barème est recalculé : la note reste sur 20.",
comp:[
  ["CONNAÎTRE","Je connais le vocabulaire : signe, distance à zéro, opposé, valeur absolue, positif, négatif.","Ex. 1 et 7 (5 points)"],
  ["CALCULER","Je calcule le résultat d'une soustraction, même quand il est négatif.","Ex. 2 (2 points)"],
  ["REPRÉSENTER","Je lis et je place des points sur une droite graduée et dans un repère.","Ex. 3 et 6 (8 points)"],
  ["RAISONNER","Je compare et je range des nombres relatifs.","Ex. 4 et 5 (5 points)"]
],
exos:[
{t:"Vrai ou faux ?", p:3, h:`<p>Réponds par Vrai ou Faux. Aucune justification n'est demandée.</p><p>a) −12 est un nombre relatif de distance à zéro 12.</p><p>b) L'opposé de −0,8 est 0,8.</p><p>c) |−11| = −11</p><p>d) 0 est à la fois positif et négatif.</p><p>e) −4,5 est strictement positif.</p>`,
 c:`<p>a) Vrai · b) Vrai · c) Faux (|−11| = 11) · d) Vrai · e) Faux (son signe est « − »)</p><p><i>0,5 point pour a), b) et e) ; 0,75 point pour c) et d).</i></p>`},
{t:"Des soustractions qui passent sous zéro", p:2, h:`<p>Calcule.</p>${cols(["a) A = 7 − 15","b) B = 40 − 100","c) C = 2,5 − 4"])}`,
 c:`<p>On enlève plus que ce que l'on a : on calcule « le plus grand moins le plus petit », puis on met le signe −.</p><div class="calcs">${[["a","A","7 − 15","−8","15 − 7 = 8"],["b","B","40 − 100","−60","100 − 40 = 60"],["c","C","2,5 − 4","−1,5","4 − 2,5 = 1,5"]].map(([l,n,e,r,w])=>`<div><p class="calc">${l}) ${n} = ${e}<br>${n} = <b>${r}</b> &nbsp; <i>(${w})</i></p></div>`).join("")}</div><p><i>0,5 point pour a) ; 0,75 point pour b) et c).</i></p>`},
{t:"Une nouvelle graduation", p:3.5, h:`<p>Observe bien la droite graduée : une unité est partagée en <b>5</b>.</p>${dg({min:-2,max:2,step:0.2,lab:1,pts:[["A",-1.4],["B",-0.6],["C",0.8]]})}
  <p>a) Lis l'abscisse des points A, B et C.</p><p>b) Place les points D(1,6) et E(−1,8).</p><p>c) Range les abscisses des points A, B, C, D et E dans l'ordre croissant.</p>`,
 c:`<p>Une unité est partagée en 5 : une graduation vaut 1 ÷ 5 = 0,2.</p><p>a) A(−1,4) ; B(−0,6) ; C(0,8) <i>(1,5 point)</i></p><p>b) D et E sont placés sur la figure. <i>(1,25 point)</i></p>
  ${dg({w:640, min:-2,max:2,step:0.2,lab:1,pts:[["E",-1.8],["A",-1.4],["B",-0.6],["C",0.8],["D",1.6]],show:true})}
  <p>c) −1,8 &lt; −1,4 &lt; −0,6 &lt; 0,8 &lt; 1,6 <i>(0,75 point)</i></p>`},
{t:"Le tournoi de golf", p:3, h:`<p>Au golf, le score d'un joueur est un nombre relatif : « −3 » veut dire qu'il a utilisé 3 coups de moins que prévu, « +2 » qu'il a utilisé 2 coups de plus. <b>Le vainqueur est celui qui a le score le plus petit.</b></p>
  <div class="scroll"><table class="std"><thead><tr><th>Joueur</th><th>Léa</th><th>Malik</th><th>Inès</th><th>Tom</th><th>Sacha</th><th>Noé</th></tr></thead><tbody><tr><td><b>Score</b></td><td>−4</td><td>+4</td><td>−7</td><td>0</td><td>−5</td><td>+1</td></tr></tbody></table></div>
  <p>a) Qui a gagné le tournoi ?</p><p>b) Écris le classement, du premier au dernier, en rangeant les scores.</p><p>c) Quels sont les deux joueurs qui ont des scores opposés ?</p>`,
 c:`<p>a) Inès a gagné : −7 est le plus petit score. <i>(0,75 point)</i></p><p>b) −7 &lt; −5 &lt; −4 &lt; 0 &lt; +1 &lt; +4 : Inès, Sacha, Léa, Tom, Noé, Malik. <i>(1,75 point)</i></p><p>c) Léa (−4) et Malik (+4). <i>(0,5 point)</i></p>`},
{t:"Comparer", p:2, h:`<p>Compare avec &lt;, &gt; ou =.</p>${cols(["a) −15 …… 2","b) −3,4 …… −3,7","c) 0 …… −0,1","d) −8 …… −8,0"])}`,
 c:`<p>a) −15 &lt; 2 · b) −3,4 &gt; −3,7 · c) 0 &gt; −0,1 · d) −8 = −8,0</p><p><i>0,5 point par comparaison.</i></p>`},
{t:"La carte au trésor", p:4.5, h:`<p>Sur cette carte, le bateau est au point B, le palmier au point P et la cabane au point C.</p>${rep({pts:[["B",-3,3],["P",4,-1],["C",0,2]], alt:"Carte au trésor avec les points B, P et C"})}
  <p>a) Lis les coordonnées des points B, P et C.</p><p>b) Place le rocher R(−2 ; −1,5) et le puits W(−5 ; 0).</p><p>c) Le trésor T a pour coordonnées les opposées de celles du bateau. Écris les coordonnées de T, puis place-le.</p><p>d) Sur quel axe se trouve le puits W ? Explique.</p>`,
 c:`<p>a) B(−3 ; 3) · P(4 ; −1) · C(0 ; 2) <i>(1,5 point)</i></p><p>b) Voir la figure. <i>(1 point)</i></p><p>c) T(3 ; −3) <i>(0,75 point pour les coordonnées, 0,5 point pour le point placé)</i></p>
  <div class="figs">${rep({pts:[["B",-3,3],["P",4,-1],["C",0,2],["R",-2,-1.5],["W",-5,0,8,-9],["T",3,-3]], proj:["R","T"], grads:true})}</div>
  <p>d) W est sur l'axe des abscisses, car son ordonnée est 0. <i>(0,75 point)</i></p>`},
{t:"Qui suis-je ?", p:2, h:`<p>a) Je suis l'opposé de 6,3.</p><p>b) Je suis un nombre entier strictement compris entre −4 et −2.</p><p>c) Je suis le plus grand des nombres entiers strictement négatifs.</p>`,
 c:`<p>a) −6,3 · b) −3 · c) −1</p><p><i>0,5 point pour a) ; 0,75 point pour b) et c).</i></p>`}
]}}
};

/* petit outil : n nombres distincts */
function TRd(n, f){ const s=new Set(); let g=0; while(s.size<n && g++<500) s.add(r3(f())); return [...s]; }

/* clavier texte pour toutes les réponses tapées (pour pouvoir écrire le signe −) */
CH["5e-5"].quiz.forEach(N=>Object.values(N.q).forEach(list=>list.forEach((it,i)=>{
  if(it.g){ const g=it.g; list[i]={g:()=>Object.assign(g(),{kb:"text"})}; } else it.kb="text";
})));
})();
