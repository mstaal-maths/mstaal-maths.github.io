/* 4e · chapitre 8 — fiche d'entraînement : les exercices de la fiche de M. Staal avec d'autres solides, d'autres figures et d'autres longueurs
   (outils window.S48 de data/4e-8.js). */
TRAIN["4e-8"] = function(){
const {ri, pick, shuf} = TR;
const {grid, pyrFig, conesFig, netSA, netReg, netTet, F} = window.S48;
const fig=(cap,body)=>`<figure>${body}${cap?`<figcaption>${cap}</figcaption>`:""}</figure>`;
const POLY={3:["triangle","triangles"],4:["quadrilatère","quadrilatères"],5:["pentagone","pentagones"],6:["hexagone","hexagones"],8:["octogone","octogones"]};

/* ================= 1. Compter faces, sommets, arêtes ================= */
const SOLS=shuf([
  ...[3,4,5,6,8].map(n=>({nom:`une pyramide dont la base est un ${POLY[n][0]}`, f:n+1, s:n+1, a:2*n, b:`1 ${POLY[n][0]}`, l:`${n} triangles`})),
  ...[3,5,6,8].map(n=>({nom:`un prisme droit dont les bases sont des ${POLY[n][1]}`, f:n+2, s:2*n, a:3*n, b:`2 ${POLY[n][1]}`, l:`${n} rectangles`})),
  {nom:"un cube", f:6, s:8, a:12, b:"2 carrés", l:"4 carrés"},
  {nom:"un cône de révolution", f:2, s:1, a:0, b:"1 disque", l:"1 face courbe (portion de disque)"},
  {nom:"un cylindre de révolution", f:3, s:0, a:0, b:"2 disques", l:"1 face courbe (rectangle une fois déroulée)"}
]).slice(0,5);
const nA=pick([3,4,5,6,8]), qA=pick(["faces","arêtes","sommets"]), vA=qA==="arêtes"?2*nA:nA+1;

/* ================= 2. Pyramides particulières ================= */
const DESC=shuf([
  ["Sa base est un triangle.","un tétraèdre"],
  ["Sa base est un carré et ses quatre faces latérales sont des triangles isocèles identiques.","une pyramide régulière"],
  ["Sa base est un triangle équilatéral et ses trois faces latérales sont des triangles isocèles identiques.","un tétraèdre et une pyramide régulière"],
  ["Sa base est un rectangle de 4 cm sur 6 cm.","ni l'un ni l'autre"],
  ["Sa base est un pentagone régulier et ses faces latérales sont des triangles isocèles identiques.","une pyramide régulière"],
  ["Sa base est un carré et une arête latérale est perpendiculaire à la base.","ni l'un ni l'autre"]
]).slice(0,4);

/* ================= 3. Perspective cavalière ================= */
function pyrRand(){
  const a=ri(3,6), r=ri(1,3), x0=ri(0,1), y0=ri(7,8), base=[[x0,y0],[x0+a,y0],[x0+a+r,y0-r],[x0+r,y0-r]];
  const mode=ri(0,2);
  /* S ne doit pas être dans le prolongement d'un côté de la base ; si l'on donne l'arête gauche de la base en pointillés (mode 2), la face de gauche doit être cachée */
  let S; do{ S=[x0+ri(1,a), ri(0,2)]; }while(S[0]+S[1]===x0+y0 || (mode===2 && S[0]+S[1]>x0+y0));
  const size=[x0+a+r+1, y0+1], given= mode===0 ? [[base[0],base[1]],[base[1],base[2]]] : mode===1 ? [[base[0],base[1]],[base[1],base[2]],[S,base[1]]] : [[base[0],base[1]],[base[0],base[3],"h"],[base[3],base[2],"h"]];
  return {size, base, S, given, cross:true, Sd:[0,-14]};
}
const PYs=[pyrRand(),pyrRand()];
const cx=ri(2,3), rx=ri(15,25)/10, hc=ri(3,4);
const CN=[{S:[cx,0.5],c:[cx,0.5+hc],rx,ry:0.5,given:[pick(["L","R"]),"front"]},{S:[cx+5,0.5],c:[cx+5,0.5+hc],rx,ry:0.5,given:["L","R"]}];

/* ================= 4. Patrons ================= */
const pa=ri(3,6), pb=ri(3,5), ph=ri(3,6);
const tc=ri(3,6), tl=tc+ri(1,3);
const ta=ri(4,7);

return [
 {t:"Les solides", e:[
  {n:"Exercice 1", t:"Faces, sommets et arêtes", w:"Sur ton cahier", h:`<p>Pour chaque solide, donne le nombre de faces, de sommets et d'arêtes, puis le nombre et la nature de ses bases et de ses faces latérales.</p>${SOLS.map((x,i)=>`<p><b>${"abcde"[i]})</b> ${x.nom[0].toUpperCase()+x.nom.slice(1)}</p>`).join("")}<p><b>f)</b> Une pyramide a ${vA} ${qA}. Quelle est la nature de sa base ?</p>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th></th><th>Faces</th><th>Sommets</th><th>Arêtes</th><th>Bases</th><th>Faces latérales</th></tr></thead><tbody>${SOLS.map((x,i)=>`<tr><th>${"abcde"[i]})</th><td>${x.f}</td><td>${x.s}</td><td>${x.a}</td><td>${x.b}</td><td>${x.l}</td></tr>`).join("")}</tbody></table></div>
   <p><b>f)</b> ${qA==="arêtes"?`${vA} arêtes = ${nA} arêtes de la base + ${nA} arêtes latérales`:qA==="faces"?`${vA} faces = 1 base + ${nA} faces latérales`:`${vA} sommets = ${nA} sommets de la base + le sommet`} : la base est un <b>${POLY[nA][0]}</b>.</p>`}
 ]},
 {t:"Les pyramides", e:[
  {n:"Exercice 2", t:"Tétraèdre ou pyramide régulière ?", w:"Sur ton cahier", h:`<p>Pour chaque pyramide, dis si c'est un tétraèdre, une pyramide régulière, les deux, ou ni l'un ni l'autre.</p>${DESC.map((d,i)=>`<p><b>${"abcd"[i]})</b> ${d[0]}</p>`).join("")}`,
   c:DESC.map((d,i)=>`<p><b>${"abcd"[i]})</b> ${d[1].startsWith("ni ")?"Ce n'est":"C'est"} <b>${d[1]}</b>.</p>`).join("")+`<p>Rappel : tétraèdre = base triangulaire ; pyramide régulière = base polygone régulier et faces latérales triangles isocèles identiques.</p>`}
 ]},
 {t:"Perspective cavalière", e:[
  {n:"Exercice 3", t:"Compléter des pyramides", w:"Sur ton cahier", h:`<p>Reproduis et complète les représentations en perspective cavalière de ces pyramides à base rectangulaire et de sommet S.</p><div class="figs">${PYs.map((o,i)=>fig("①②"[i],pyrFig(o))).join("")}</div>`,
   c:`<p>On complète la base (parallélogramme), puis on relie S aux quatre sommets. Arêtes cachées en pointillés.</p><div class="figs">${PYs.map((o,i)=>fig("①②"[i],pyrFig(o,true))).join("")}</div>`},
  {n:"Exercice 4", t:"Compléter des cônes", w:"Sur ton cahier", h:`<p>Reproduis et complète les représentations en perspective cavalière de ces deux cônes.</p>${conesFig(CN,false,[cx+5+3,1+hc+0.6],"Deux cônes à compléter")}`,
   c:`${conesFig(CN,true,[cx+5+3,1+hc+0.6],"Les deux cônes complétés")}<p>La moitié arrière de la base est cachée : en pointillés.</p>`}
 ]},
 {t:"Patrons", e:[
  {n:"Exercice 5", t:"Patron d'une pyramide", w:"Sur ta feuille", h:`<p>SABCD est une pyramide à base rectangulaire : AB = ${pa} cm et BC = ${pb} cm.</p><p>L'arête [SA] est perpendiculaire à la base et SA = ${ph} cm. Les triangles SBC et SDC sont rectangles en B et en D.</p><p>Construis le patron de cette pyramide.</p>`,
   c:`${netSA(pa,pb,ph,{len:[["A","B",pa+" cm",0,14],["B","C",pb+" cm",26,0],["A","S1",ph+" cm",-32,0]]})}<p>Base ABCD ; faces SAB et SAD rectangles en A (SA = ${ph} cm) ; faces SBC et SDC rectangles en B et en D, en reportant SB et SD au compas.</p>`},
  {n:"Exercice 6", t:"Patron d'une pyramide régulière", w:"Sur ta feuille", h:`<p>SABCD est une pyramide régulière à base carrée de côté ${tc} cm. Ses arêtes latérales mesurent ${tl} cm.</p><p>Construis un patron de cette pyramide.</p>`,
   c:`${netReg(tc,tl)}<p>Le carré de ${tc} cm, puis sur chaque côté un triangle isocèle de côtés ${tc} cm, ${tl} cm et ${tl} cm (arcs de rayon ${tl} cm au compas).</p>`},
  {n:"Exercice 7", t:"Patron d'un tétraèdre", w:"Sur ta feuille", h:`<p>HDCB est un tétraèdre : HD = DC = CB = ${ta} cm. L'arête [HD] est perpendiculaire à la base DCB et le triangle DCB est rectangle en C.</p><p>Construis le patron de ce tétraèdre.</p>`,
   c:`${netTet(ta)}<p>Base DCB rectangle en C ; faces HDC et HDB rectangles en D (HD = ${ta} cm) ; face HCB rectangle en C, en reportant HC au compas.</p>`}
 ]}
];
};
