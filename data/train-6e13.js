/* 6e · chapitre 13 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres figures */
TRAIN["6e-13"] = function(){
const {ri, pick, shuf, distinct, items} = TR;
const {gsym, randFig, reflP} = window.FIG13;
const A = n => `<span class="ang">${n}</span>`;
const L = "abcdef";

/* ---------- A. Compléter des figures sur quadrillage ---------- */
const axes = shuf([{t:"v",k:ri(4,5)},{t:"h",k:ri(4,5)},{t:"d",k:0}]);
const figs = axes.map(ax=>({ax, pts:randFig(9,ax)}));
/* symétriques ou pas : des paires tirées au hasard, dont certaines décalées */
const paires = shuf([true,true,false,false]).map(ok=>{ const ax={t:pick(["v","h"]),k:4}; const pts=randFig(8,ax); let o=pts.map(p=>reflP(p,ax)); let why="";
  if(!ok){ const t=pick(["dec","glisse"]); if(t==="dec"){ o=o.map(p=>ax.t==="v"?[p[0]+1,p[1]]:[p[0],p[1]+1]); why="La figure orange est trop loin de l'axe (décalée d'un carreau)."; } else { o=pts.map(p=>ax.t==="v"?[p[0]+4,p[1]]:[p[0],p[1]+4]); why="La figure orange a glissé : elle n'est pas retournée."; } }
  const segs = q => new Set(q.slice(1).map((p,i)=>[q[i].join(","),p.join(",")].sort().join("|")));
  const S1=segs(o), S2=segs(pts.map(p=>reflP(p,ax))); const same = S1.size===S2.size && [...S1].every(x=>S2.has(x));
  if(same) why=""; else if(!why) why="Les sommets ne sont pas à la même distance de l'axe.";
  return {ax,pts,o,same,why}; });
const draw = (pr) => gsym({n:9,c:20,axe:pr.ax,pts:pr.pts}).replace("</svg>", `<polyline points="${pr.o.map(p=>`${6+p[0]*20},${6+p[1]*20}`).join(" ")}" style="fill:rgba(224,122,0,.18);stroke:#e07a00;stroke-width:3;stroke-linejoin:round"/></svg>`);
const secA = {t:"Figures symétriques", e:[
  {n:"Exercice 1", t:"Symétriques ou pas ?", w:"Sur ton cahier", h:`<p>Les deux figures sont-elles symétriques par rapport à la droite rouge ?</p><div class="figs">${paires.map((p,i)=>`<figure><figcaption>${L[i]})</figcaption>${draw(p)}</figure>`).join("")}</div>`,
   c:items(paires.map(p=>p.same?"<b>Oui</b> : chaque sommet et son symétrique sont à la même distance de l'axe, de part et d'autre.":`<b>Non</b>. ${p.why}`),"<br>",true)},
  {n:"Exercice 2", t:"Compléter une figure", w:"Sur ton cahier (quadrillage)", h:`<p>Reproduis chaque figure sur ton cahier, puis trace son symétrique par rapport à la droite rouge en comptant les carreaux.</p><div class="figs">${figs.map((f,i)=>`<figure><figcaption>${L[i]})</figcaption>${gsym({n:9,c:20,axe:f.ax,pts:f.pts})}</figure>`).join("")}</div>`,
   c:`<div class="figs">${figs.map((f,i)=>`<figure><figcaption>${L[i]})</figcaption>${gsym({n:9,c:20,axe:f.ax,pts:f.pts,sym:true})}</figure>`).join("")}</div>${figs.some(f=>f.ax.t==="d")?"<p><i>Avec l'axe oblique, on compte en diagonale : un point et son symétrique échangent leur nombre de carreaux vers la droite et vers le bas.</i></p>":""}`}
 ]};

/* ---------- B. Le symétrique d'un point ---------- */
const dA = ri(2,6)+pick([0,0.5]), fr = x => String(x).replace(".",",");
/* figure (réduite, pas en vraie grandeur) : A et A' à l'équerre, B et B' au compas */
const figPt = (()=>{ const y=125, k=14, ya=y-k*dA, yb=y+k*dA, R="#c00000";
  const bx=235, by=y-55, mx=185, nx=295, rM=Math.hypot(bx-mx,by-y), rN=Math.hypot(bx-nx,by-y), b2=y+55;
  const arc=(cx,r)=>{ const a1=Math.asin(Math.min(1,(b2-y-14)/r)), a2=Math.asin(Math.min(1,(b2-y+14)/r)); const x1=cx+(bx>cx?1:-1)*r*Math.cos(a1), x2=cx+(bx>cx?1:-1)*r*Math.cos(a2); return `<path d="M${x1.toFixed(1)} ${(y+r*Math.sin(a1)).toFixed(1)} A${r.toFixed(1)} ${r.toFixed(1)} 0 0 ${bx>cx?1:0} ${x2.toFixed(1)} ${(y+r*Math.sin(a2)).toFixed(1)}" style="fill:none;stroke:#888;stroke-width:1.5"/>`; };
  const t=(x,yy,n,c)=>`<text x="${x}" y="${yy}" style="font-size:15px;font-weight:700;fill:${c||"var(--ink)"}">${n}</text>`, dot=(x,yy,c)=>`<circle cx="${x}" cy="${yy}" r="3.5" style="fill:${c||"var(--ink)"}"/>`;
  const tick=(yy)=>`<line x1="74" y1="${yy-3}" x2="86" y2="${yy+3}" style="stroke:var(--ink);stroke-width:1.5"/>`;
  return `<svg class="fig" viewBox="0 0 330 250" width="330" role="img" aria-label="Construction de A' à l'équerre et de B' au compas (figure réduite)"><line x1="10" y1="${y}" x2="320" y2="${y}" style="stroke:${R};stroke-width:2.5"/>${t(10,y-6,"(d)",R)}<line x1="80" y1="${ya-12}" x2="80" y2="${yb+12}" style="stroke:#888;stroke-width:1.5;stroke-dasharray:5 4"/><path d="M80 ${y-10} h10 v10" style="fill:none;stroke:var(--ink);stroke-width:1.3"/>${tick((y+ya)/2)}${tick((y+yb)/2)}${dot(80,ya)}${dot(80,yb,"#e07a00")}${t(88,ya+5,"A")}${t(88,yb+5,"A'","#e07a00")}${t(60,y+18,"H")}${arc(mx,rM)}${arc(nx,rN)}<line x1="${mx}" y1="${y}" x2="${bx}" y2="${by}" style="stroke:#888;stroke-width:1;stroke-dasharray:3 3"/><line x1="${nx}" y1="${y}" x2="${bx}" y2="${by}" style="stroke:#888;stroke-width:1;stroke-dasharray:3 3"/>${dot(mx,y)}${dot(nx,y)}${t(mx-6,y+18,"M")}${t(nx-4,y+18,"N")}${dot(bx,by)}${t(bx+7,by-4,"B")}${dot(bx,b2,"#e07a00")}${t(bx+7,b2+18,"B'","#e07a00")}</svg><p><i>Figure réduite.</i></p>`; })();
const vf = shuf([
  ["(AA') est perpendiculaire à (d) et A et A' sont à la même distance de (d).", true],
  ["(AA') est perpendiculaire à (d), A est à 3 cm de (d) et A' à 2 cm.", false],
  ["A et A' sont à 2 cm de (d), mais (AA') n'est pas perpendiculaire à (d).", false],
  ["(d) est la médiatrice de [AA'].", true]]);
const secB = {t:"Le symétrique d'un point", e:[
  {n:"Exercice 3", t:"Construire", w:"Sur une feuille blanche", h:`<p>1) Trace une droite (d) et place un point A à ${fr(dA)} cm de (d). Construis A', symétrique de A, avec l'équerre et le compas.</p><p>2) Place un point B qui n'est pas sur (d) et construis B', symétrique de B, avec le compas seulement.</p><p>3) Quelle est la longueur AA' ?</p>`,
   c:`<p>1) Je trace la perpendiculaire à (d) passant par A ; elle coupe (d) en H. Je reporte HA de l'autre côté : HA' = HA = ${fr(dA)} cm.</p><p>2) Je place deux points M et N sur (d), puis je trace l'arc de centre M passant par B et l'arc de centre N passant par B : ils se coupent en B'.</p><p>3) AA' = 2 × ${fr(dA)} = <b>${fr(2*dA)} cm</b>.</p>${figPt}`},
  {n:"Exercice 4", t:"Vrai ou faux ?", w:"Sur ton cahier", h:`<p>Dans chaque cas, A' est-il le symétrique de A par rapport à (d) ?</p><p>${items(vf.map(x=>x[0]),"<br>",true)}</p>`,
   c:items(vf.map(x=>x[1]?"<b>Oui</b>.":"<b>Non</b> : il faut à la fois (AA') ⊥ (d) et la même distance de chaque côté."),"<br>",true)}
 ]};

/* ---------- C. Propriétés ---------- */
const ab = ri(3,8), bc = ri(2,7), ang = ri(40,140), dg = Math.sqrt(ab*ab+bc*bc-2*ab*bc*Math.cos(ang*Math.PI/180)), pmin = Math.ceil((ab+bc+dg)*10)+5, per = ri(pmin, pmin+60); /* périmètre > AB + BC + diagonale : le quadrilatère existe */
const dO = ri(3,4), rO = ri(1,2);
const names = pick([["E","F","G","H"],["R","S","T","U"],["K","L","M","N"]]);
const [P,Q,R,S] = names;
const secC = {t:"Le symétrique d'une figure", e:[
  {n:"Exercice 5", t:"Utiliser les propriétés", w:"Sur ton cahier", h:`<p>Les quadrilatères ${names.join("")} et ${names.map(x=>x+"'").join("")} sont symétriques par rapport à une droite (d). On sait que ${P}${Q} = ${ab} cm, ${Q}${R} = ${bc} cm, ${A(P+Q+R)} = ${ang}° et que le périmètre de ${names.join("")} est ${fr(per/10)} cm.</p><p>Sans mesurer, donne : ${P}'${Q}', ${Q}'${R}', ${A(P+"'"+Q+"'"+R+"'")} et le périmètre de ${names.map(x=>x+"'").join("")}. Justifie.</p>`,
   c:`<p>${P}'${Q}' = <b>${ab} cm</b> ; ${Q}'${R}' = <b>${bc} cm</b> ; ${A(P+"'"+Q+"'"+R+"'")} = <b>${ang}°</b> ; périmètre : <b>${fr(per/10)} cm</b>.</p><p>La symétrie axiale conserve les longueurs, les angles et les périmètres.</p>`},
  {n:"Exercice 6", t:"Le symétrique d'un cercle", w:"Sur une feuille blanche", h:`<p>Trace une droite (d), un point O à ${dO} cm de (d) et le cercle de centre O de rayon ${rO} cm. Construis son symétrique par rapport à (d).</p>`,
   c:`<p>Je construis O', le symétrique du centre O. Puis je trace le cercle de centre O' et de <b>même rayon</b> : c'est le symétrique du cercle.</p><svg class="fig" viewBox="0 0 320 ${2*rO*22+50}" width="320" role="img" aria-label="Le cercle de centre O et son symétrique de centre O' (figure réduite)"><line x1="160" y1="4" x2="160" y2="${2*rO*22+46}" style="stroke:#c00000;stroke-width:2.5"/><text x="166" y="18" style="font-size:14px;fill:#c00000">(d)</text><line x1="${160-dO*22}" y1="${rO*22+25}" x2="${160+dO*22}" y2="${rO*22+25}" style="stroke:#888;stroke-width:1.5;stroke-dasharray:5 4"/><path d="M160 ${rO*22+15} h10 v10" style="fill:none;stroke:var(--ink);stroke-width:1.3"/><circle cx="${160-dO*22}" cy="${rO*22+25}" r="${rO*22}" style="fill:none;stroke:#1f6db0;stroke-width:2.5"/><circle cx="${160+dO*22}" cy="${rO*22+25}" r="${rO*22}" style="fill:none;stroke:#e07a00;stroke-width:2.5"/><circle cx="${160-dO*22}" cy="${rO*22+25}" r="3.5" style="fill:var(--ink)"/><circle cx="${160+dO*22}" cy="${rO*22+25}" r="3.5" style="fill:#e07a00"/><text x="${160-dO*22-6}" y="${rO*22+44}" style="font-size:15px;font-weight:700;fill:var(--ink)">O</text><text x="${160+dO*22-6}" y="${rO*22+44}" style="font-size:15px;font-weight:700;fill:#e07a00">O'</text></svg><p><i>Figure réduite : O et O' sont à ${dO} cm de (d), les deux cercles ont pour rayon ${rO} cm.</i></p>`}
 ]};

/* ---------- D. Axes ---------- */
const SENS = {A:"vertical",B:"horizontal",D:"horizontal",E:"horizontal",K:"horizontal",M:"vertical",T:"vertical",U:"vertical",V:"vertical",W:"vertical",Y:"vertical",H:"un vertical et un horizontal",I:"un vertical et un horizontal",O:"un vertical et un horizontal",X:"un vertical et un horizontal"};
const lettres = shuf([["A",1],["B",1],["D",1],["E",1],["H",2],["I",2],["K",1],["M",1],["N",0],["O",2],["S",0],["T",1],["U",1],["V",1],["W",1],["X",2],["Y",1],["Z",0],["F",0],["G",0],["L",0],["P",0],["R",0]]).slice(0,8);
const fu = shuf([["un carré",4],["un rectangle",2],["un losange",2],["un triangle équilatéral",3],["un triangle isocèle",1],["un segment",2],["un parallélogramme",0]]).slice(0,5);
const secD = {t:"Les axes de symétrie", e:[
  {n:"Exercice 7", t:"Les lettres", w:"Sur ton cahier", h:`<p>Combien d'axes de symétrie a chaque lettre (majuscule d'imprimerie) ?</p><p class="calc" style="font-size:1.6rem;letter-spacing:.5em;font-family:Arial,sans-serif">${lettres.map(x=>x[0]).join(" ")}</p>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Lettre</th>${lettres.map(x=>`<th>${x[0]}</th>`).join("")}</tr></thead><tbody><tr><th>Axes</th>${lettres.map(x=>`<td>${x[1]}</td>`).join("")}</tr></tbody></table></div><p>${lettres.map(x=>`${x[0]} : ${x[1]===0?"aucun axe":x[1]===1?"1 axe "+SENS[x[0]]:"2 axes ("+SENS[x[0]]+")"}`).join(" · ")}</p>`},
  {n:"Exercice 8", t:"Les figures usuelles", w:"Sur ton cahier", h:`<p>Trace chaque figure à main levée avec ses axes de symétrie, puis donne leur nombre : ${items(fu.map(x=>x[0]),"  ·  ",true)}</p>`,
   c:items(fu.map(x=>`${x[0]} : <b>${x[1]===0?"aucun axe":x[1]+" axe"+(x[1]>1?"s":"")}</b>`),"<br>",true)+img("c613ex/e9c.png","Les axes de symétrie des figures usuelles, tracés en rouge",470)+(fu.some(x=>x[1]===0)?"<p><i>Le parallélogramme (ni rectangle, ni losange) n'a aucun axe de symétrie : on ne trace rien.</i></p>":"")}
 ]};

return [secA, secB, secC, secD];
};
