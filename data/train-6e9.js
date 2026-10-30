/* 6e · chapitre 9 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres angles */
TRAIN["6e-9"] = function(){
const {ri, pick, shuf, sp, distinct, items} = TR;
const {angSVG} = window.FIG9;
const A = n => `<span class="ang">${n}</span>`;
const nat = m => m===0?"nul":m<90?"aigu":m===90?"droit":m<180?"obtus":"plat";
const LET = "ABCDEFGHIJKLMNOPRSTUVWXYZ".split("");

/* rapporteur en SVG : un côté sur le 0 de droite (base "d") ou de gauche (base "g") */
function rapp(m, base, names){
  const W=410, H=240, cx=205, cy=206, R=168, rad=d=>d*Math.PI/180;
  const P=(d,r)=>[ (cx+r*Math.cos(rad(d))).toFixed(1), (cy-r*Math.sin(rad(d))).toFixed(1) ];
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="360" role="img" aria-label="Un rapporteur posé sur un angle">`;
  s+=`<path d="M${cx-R} ${cy} A${R} ${R} 0 0 1 ${cx+R} ${cy} Z" style="fill:#e8f1fb;stroke:#1e5aa8;stroke-width:1.5"/>`;
  for(let d=0; d<=180; d+=5){ const big=d%10===0, [x1,y1]=P(d,R), [x2,y2]=P(d,R-(big?13:7)); s+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:#1e5aa8;stroke-width:${big?1.4:.8}"/>`; }
  for(let d=0; d<=180; d+=10){ const dy=(d===0||d===180)?-8:0, [x,y0]=P(d,R-23), [u,v0]=P(d,R-42), y=+y0+dy, v=+v0+dy;
    s+=`<text x="${x}" y="${(+y+4).toFixed(1)}" text-anchor="middle" style="font-size:11px;fill:#1e5aa8;font-weight:600">${d}</text>`;
    s+=`<text x="${u}" y="${(+v+4).toFixed(1)}" text-anchor="middle" style="font-size:10px;fill:#d0342c">${180-d}</text>`; }
  s+=`<circle cx="${cx}" cy="${cy}" r="2.5" style="fill:var(--ink)"/>`;
  const a0 = base==="d"?0:180, a1 = base==="d"?m:180-m;
  const [x0,y0]=P(a0,R+14), [xa,ya]=P(a1,R+14);
  s+=`<line x1="${cx}" y1="${cy}" x2="${x0}" y2="${y0}" class="ln" style="stroke-width:2.5"/><line x1="${cx}" y1="${cy}" x2="${xa}" y2="${ya}" class="ln" style="stroke-width:2.5"/>`;
  const [n1,n0,n2]=names, [tx,ty]=P(a1,R+26);
  s+=`<text x="${base==="d"?W-10:10}" y="${cy-6}" text-anchor="${base==="d"?"end":"start"}" style="font-size:15px;font-weight:700;fill:var(--ink)">${n1}</text><text x="${cx}" y="${cy+20}" text-anchor="middle" style="font-size:15px;font-weight:700;fill:var(--ink)">${n0}</text><text x="${tx}" y="${(+ty+5).toFixed(1)}" text-anchor="middle" style="font-size:15px;font-weight:700;fill:var(--ink)">${n2}</text>`;
  return s+"</svg>";
}

/* ---------- A. La notion d'angle ---------- */
const v1 = distinct(3, ()=>shuf(LET).slice(0,3), x=>x.join(""));
const nm = v1.map(t=>t.join(""));
const v2 = shuf(LET).slice(0,3);
const fauxNoms = [v2[1]+v2[0]+v2[2], v2[0]+v2[2]+v2[1]];
const secA = {t:"La notion d'angle", e:[
  {n:"Exercice 1", t:"Le vocabulaire", w:"Sur ton cahier", h:`<p>Pour chaque angle, donne son sommet et ses côtés : ${items(nm.map(A),"  ·  ",true)}</p>`,
   c:items(nm.map(n=>`${A(n)} : sommet <b>${n[1]}</b>, côtés [${n[1]}${n[0]}) et [${n[1]}${n[2]})`),"<br>",true)},
  {n:"Exercice 2", t:"Nommer un angle", w:"Sur ton cahier", h:`<p>L'angle de sommet ${v2[1]} a pour côtés [${v2[1]}${v2[0]}) et [${v2[1]}${v2[2]}).</p><p>1) Écris ses deux noms.</p><p>2) Léo l'a nommé ${A(fauxNoms[0])}. Pourquoi est-ce faux ?</p>`,
   c:`<p>1) ${A(v2.join(""))} ou ${A(v2[2]+v2[1]+v2[0])}.</p><p>2) Dans ${A(fauxNoms[0])}, la lettre du milieu est ${fauxNoms[0][1]} : ce serait un angle de sommet ${fauxNoms[0][1]}. Le sommet ${v2[1]} doit être <b>au milieu</b>.</p>`},
  (()=>{ const m=ri(30,70), a=ri(0,30); return {n:"Exercice 3", t:"Quel angle est le plus grand ?", w:"Sur ton cahier", h:`<div class="figs">${angSVG(a,a+m,{w:150,h:110,L:50,r:16,names:["","1",""]})}${angSVG(a+5,a+5+m,{w:240,h:170,L:130,r:22,names:["","2",""]})}</div><p>Tom dit : « l'angle 2 est plus grand, car ses côtés sont plus longs ». A-t-il raison ?</p>`,
   c:`<p><b>Non.</b> Les deux angles ont la même ouverture (${m}° chacun). La taille d'un angle ne dépend pas de la longueur de ses côtés.</p>`}; })()
 ]};

/* ---------- B. Nature et mesure ---------- */
const m4 = shuf([ri(5,85), ri(95,175), 90, 180, ri(5,85), ri(95,175)]);
const est = distinct(4, ()=>5*ri(3,34), x=>x).map(m=>[m, ri(0,25)]);
const secB = {t:"Nature et mesure d'un angle", e:[
  {n:"Exercice 4", t:"La nature d'un angle", w:"Sur ton cahier", h:`<p>Donne la nature de l'angle qui mesure : ${items(m4.map(m=>m+"°"),"  ·  ",true)}</p>`,
   c:items(m4.map(m=>`${m}° : <b>${nat(m)}</b>`),"  ·  ",true)},
  {n:"Exercice 5", t:"Estimer la mesure d'un angle", w:"Sur ton cahier", h:`<p>Sans rapporteur, estime la mesure de chaque angle (à 10° près).</p><div class="figs">${est.map(([m,a],i)=>angSVG(a,a+m,{w:200,h:140,L:80,r:20,cx:m>100?120:80,label:String(i+1)})).join("")}</div>`,
   c:`<p>Mesures exactes : ${est.map(([m],i)=>`${i+1}) <b>${m}°</b> (${nat(m)})`).join(" · ")}</p><p>Ton estimation est réussie si elle est à 10° près.</p>`}
 ]};

/* ---------- C. Le rapporteur ---------- */
const lr = distinct(3, ()=>5*ri(3,33), x=>x).map(m=>[m, pick(["d","g"]), shuf(LET).slice(0,3)]);
const pi = ri(15,75);
const secC = {t:"Lire un rapporteur", e:[
  {n:"Exercice 6", t:"Lire la mesure", w:"Sur ton cahier", h:`<p>Lis la mesure de chaque angle. Attention à la graduation !</p><div class="figs">${lr.map(([m,b,n])=>rapp(m,b,n)).join("")}</div>`,
   c:items(lr.map(([m,b,n])=>`${A(n.join(""))} = <b>${m}°</b> : le 0 est sur le côté [${n[1]}${n[0]}), on lit la graduation ${b==="d"?"extérieure (bleue)":"intérieure (rouge)"}. L'angle est ${nat(m)}.`),"<br>",true)},
  {n:"Exercice 7", t:"Qui a raison ?", w:"Sur ton cahier", h:`<p>Pour mesurer un angle ${A("RST")} aigu, Inès trouve ${pi}° et Hugo trouve ${180-pi}°. Qui a raison ? Quelle erreur a faite l'autre ?</p>`,
   c:`<p><b>Inès a raison</b> : un angle aigu mesure moins de 90°. Hugo a lu la mauvaise graduation : ${pi} + ${180-pi} = 180.</p>`}
 ]};

/* ---------- D. Construire et calculer ---------- */
const k8 = distinct(4, ()=>ri(3,34)*5+pick([0,0,2,3]), x=>x).map(m=>[m, shuf(LET).slice(0,3)]);
const ea=ri(25,70), eb=ri(25,70);
const hh = shuf([[1,30],[2,0],[3,30],[4,0],[5,0],[2,30],[4,30]]).slice(0,3);
const ang = ([h,mn]) => { const p = (h%12)*30 + mn/2, g = mn*6; let d=Math.abs(p-g); return d>180?360-d:d; };
const hs = ([h,mn]) => `${h} h${mn?" "+mn:""}`;
const fmt = d => String(d).replace(".",",");
const secD = {t:"Construire et calculer", e:[
  {n:"Exercice 8", t:"Construire des angles", w:"Sur ton cahier", h:`<p>Construis les angles suivants (trace d'abord un côté), puis code-les : ${items(k8.map(([m,n])=>`${A(n.join(""))} = ${m}°`),"  ·  ",true)}</p>`,
   c:`<p>Centre du rapporteur sur le sommet, 0 sur le premier côté, petit point en face de la mesure, puis on trace le second côté.</p><div class="figs">${k8.map(([m,n])=>angSVG(0,m,{w:m>90?230:210,h:m>90?150:140,L:80,r:22,cx:m>90?120:50,names:n,label:m+"°"})).join("")}</div>`},
  {n:"Exercice 9", t:"Un éventail", w:"Sur ton cahier", h:`<p>1) Construis ${A("xOy")} = ${ea}°, puis [Oz) telle que ${A("yOz")} = ${eb}°, à l'extérieur de l'angle ${A("xOy")}.</p><p>2) Sans mesurer, donne la mesure de ${A("xOz")}. Vérifie au rapporteur.</p>`,
   c:`${(()=>{ const cx=90, cy=150, L=115, rd=d=>d*Math.PI/180, P=(d,r)=>[(cx+r*Math.cos(rd(d))).toFixed(1),(cy-r*Math.sin(rd(d))).toFixed(1)];
     const arc=(d1,d2,r,col)=>{ const [x1,y1]=P(d1,r),[x2,y2]=P(d2,r); return `<path d="M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 0 0 ${x2} ${y2} Z" style="fill:${col};fill-opacity:.2;stroke:${col};stroke-width:2"/>`; };
     const lab=(d,r,t,col)=>{ const [x,y]=P(d,r); return `<text x="${x}" y="${(+y+5).toFixed(1)}" text-anchor="middle" style="font-size:13px;font-weight:700;fill:${col}">${t}</text>`; };
     let g=`<svg class="fig" viewBox="0 0 250 175" width="250" role="img" aria-label="Les demi-droites [Ox), [Oy) et [Oz)">`+arc(0,ea,30,"#e08a00")+arc(ea,ea+eb,46,"#1e5aa8");
     [[0,"x"],[ea,"y"],[ea+eb,"z"]].forEach(([d,n])=>{ const [x,y]=P(d,L), [tx,ty]=P(d,L+13); g+=`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" class="ln"/><text x="${tx}" y="${(+ty+5).toFixed(1)}" text-anchor="middle" style="font-size:15px;font-weight:600;fill:var(--ink)">${n}</text>`; });
     return g+lab(ea/2,42,ea+"°","#e08a00")+lab(ea+eb/2,60,eb+"°","#1e5aa8")+`<text x="${cx-4}" y="${cy+20}" text-anchor="middle" style="font-size:15px;font-weight:600;fill:var(--ink)">O</text></svg>`; })()}<p>Les deux angles sont côte à côte : ${A("xOz")} = ${ea}° + ${eb}° = <b>${ea+eb}°</b>.</p>`},
  {n:"Exercice 10", t:"Les angles d'une pendule", w:"Sur ton cahier", h:`<p>Quel angle forment les deux aiguilles à chacun de ces horaires ?</p><p>${items(hh.map(hs),"  ·  ",true)}</p><p><i>Aide : entre deux nombres du cadran, il y a 360° ÷ 12 = 30°.</i></p>`,
   c:items(hh.map(t=>{ const d=ang(t); return `${hs(t)} : ${t[1]===30?`la petite aiguille est au milieu entre deux nombres, ${fmt(d/30)} × 30 = `:`${d/30} × 30 = `}<b>${fmt(d)}°</b>`; }),"<br>",true)}
 ]};

/* ---------- E. Programmer ---------- */
const pol = pick([[3,"un triangle équilatéral"],[4,"un carré"],[5,"un pentagone régulier"],[6,"un hexagone régulier"],[8,"un octogone régulier"]]);
const pas = 10*ri(5,12), Lr=10*ri(8,15), lr2=10*ri(3,7);
const secE = {t:"Programmer un déplacement", e:[
  {n:"Exercice 11", t:"Quelle figure ?", w:"Sur ton cahier", h:`<p class="calc">répéter ${pol[0]} fois<br>&nbsp;&nbsp;&nbsp;avancer de ${pas} pas<br>&nbsp;&nbsp;&nbsp;tourner ↻ de ${360/pol[0]} degrés</p><p>Quelle figure trace ce programme ? Quel angle forment deux côtés consécutifs ?</p>`,
   c:`<p>Le lutin trace <b>${pol[1]}</b> de côté ${pas} pas (${pol[0]} côtés, et ${pol[0]} × ${360/pol[0]} = 360 : il fait un tour complet).</p><p>Angle entre deux côtés : 180° − ${360/pol[0]}° = <b>${180-360/pol[0]}°</b>.</p>`},
  {n:"Exercice 12", t:"Écrire un programme", w:"Sur ton cahier", h:`<p>Écris un programme qui trace un rectangle de ${Lr} pas sur ${lr2} pas, avec une boucle « répéter ».</p>`,
   c:`<p class="calc">stylo en position d'écriture<br>répéter <b>2</b> fois<br>&nbsp;&nbsp;&nbsp;avancer de <b>${Lr}</b> pas<br>&nbsp;&nbsp;&nbsp;tourner ↻ de <b>90</b> degrés<br>&nbsp;&nbsp;&nbsp;avancer de <b>${lr2}</b> pas<br>&nbsp;&nbsp;&nbsp;tourner ↻ de <b>90</b> degrés</p>`}
 ]};

return [secA, secB, secC, secD, secE];
};
