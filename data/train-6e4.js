/* 6e · chapitre 4 — fiche d'entraînement : les exercices de la fiche de classe, avec d'autres nombres. */
TRAIN["6e-4"] = function(){
const {ri, pick, shuf} = TR;
const {segFig, circFig} = window.FIG4;
const fr = x => String(Math.round(x*100)/100).replace(".",",");
const L = "abcdefgh";

/* Exercice 2 : trois cas */
const a1=ri(2,9), b1=ri(2,9);
const c2=ri(11,30), b2=ri(3,c2-3);
const n3=ri(3,6), l3=ri(2,5);
const pts3=[["A",0]]; for(let i=1;i<n3;i++) pts3.push(["CDEFGH"[i-1], i/n3]); pts3.push(["B",1]);
const u2=pick(["cm","mm"]);
/* Exercice 3 */
const t3=ri(12,30), a3=ri(3,t3-3), u3=pick(["m","km"]);
const t4=ri(10,25), a4=ri(2,t4-2), u4=pick(["m","km","cm"]);
/* Exercice 4 */
const m4=ri(3,12), d4=2*ri(3,10);
/* Activité 2 : carte */
const ech=pick([10,20,25,50]), dz=ech*pick([2,3,4]);
const villes=shuf(shuf(["Ancenis","Bressuire","Cholet","Clisson","Mortagne","Montaigu","Pornic","Vallet"]).slice(0,5).map((v,i)=>[v, Math.round(dz*(i===0?0.4+Math.random()*0.5:i===1?1.1+Math.random()*0.5:0.4+Math.random()*1.2))]));
/* Exercice 6 : position par rapport au cercle */
const r6=ri(2,5);
const p6=shuf([["B","in"],["D","out"],["E","on"],["F","on"],["G","in"]]).map(([n,k])=>[n,k, k==="on"?r6: k==="in"? Math.round((r6-pick([0.5,1,1.5]))*10)/10 : Math.round((r6+pick([0.5,1,2]))*10)/10]);
/* Exercice 7 */
const t7=shuf([["r",ri(2,9)],["d",2*ri(2,9)],["r",ri(11,49)/10],["d",2*ri(3,9)+1]]);
/* Exercice 8 */
const r8=ri(2,5), ta8=r8+ri(3,7);
/* Exercice 11 */
const ra=ri(3,6), rb=ri(2,ra-1);

const sign = (d,r) => d<r?"&lt;":d>r?"&gt;":"=";
return [
 {t:"Distance entre deux points", e:[
  {n:"Exercice 2", t:"Calculer une longueur", w:"Sur ton cahier", h:`<p>Dans chaque cas, calcule la distance AB. Justifie.</p>
   <p><b>a.</b></p>${segFig({pts:[["A",0],["M",a1/(a1+b1)],["B",1]], lens:[[0,1,a1+" cm"],[1,2,b1+" cm"]]})}
   <p><b>b.</b></p>${segFig({pts:[["A",0],["B",(c2-b2)/c2],["C",1]], lens:[[1,2,b2+" "+u2,1],[0,2,c2+" "+u2]]})}
   <p><b>c.</b> Les petits segments ont tous la même longueur.</p>${segFig({w:440, pts:pts3, ticks:[...Array(n3)].map((_,i)=>[i,i+1,1]), lens:[[0,1,l3+" cm"]]})}`,
   c:`<p><b>a.</b> M appartient au segment [AB], donc AB = AM + MB = ${a1} + ${b1} = <b>${a1+b1} cm</b>.</p>
   <p><b>b.</b> B appartient au segment [AC], donc AB = AC − BC = ${c2} − ${b2} = <b>${c2-b2} ${u2}</b>.</p>
   <p><b>c.</b> Il y a ${n3} segments de ${l3} cm, donc AB = ${n3} × ${l3} = <b>${n3*l3} cm</b>.</p>`},
  {n:"Exercice 3", t:"Dessin à main levée et calcul", w:"Sur ton cahier", h:`<p><b>a)</b> Le segment [MR] mesure ${t3} ${u3} et le point L appartient à [MR], avec ML = ${a3} ${u3}. Fais un dessin à main levée, puis calcule la distance RL.</p>
   <p><b>b)</b> Le point G appartient au segment [EF], avec GE = ${a4} ${u4} et EF = ${t4} ${u4}. Fais un dessin à main levée, puis calcule la distance GF.</p>`,
   c:`<p><b>a)</b></p>${segFig({pts:[["M",0],["L",a3/t3],["R",1]], lens:[[0,1,a3+" "+u3],[0,2,t3+" "+u3,1]]})}<p>L appartient au segment [MR], donc RL = MR − ML = ${t3} − ${a3} = <b>${t3-a3} ${u3}</b>.</p>
   <p><b>b)</b></p>${segFig({pts:[["E",0],["G",a4/t4],["F",1]], lens:[[0,1,a4+" "+u4],[0,2,t4+" "+u4,1]]})}<p>G appartient au segment [EF], donc GF = EF − GE = ${t4} − ${a4} = <b>${t4-a4} ${u4}</b>.</p>`},
  {n:"Exercice 4", t:"Milieu d'un segment (calcul)", w:"Sur ton cahier", h:`<p><b>a)</b> Le segment [MR] mesure ${m4} cm et R est le milieu du segment [MP]. Fais un dessin à main levée, puis calcule la distance MP.</p><p><b>b)</b> Le segment [LF] mesure ${d4} cm et A est le milieu du segment [LF]. Fais un dessin à main levée, puis calcule la longueur AF.</p>`,
   c:`<p><b>a)</b></p>${segFig({pts:[["M",0],["R",0.5],["P",1]], ticks:[[0,1,1],[1,2,1]], lens:[[0,1,m4+" cm"]]})}<p>R est le milieu de [MP], donc MP = 2 × MR = 2 × ${m4} = <b>${2*m4} cm</b>.</p>
   <p><b>b)</b></p>${segFig({pts:[["L",0],["A",0.5],["F",1]], ticks:[[0,1,1],[1,2,1]], lens:[[0,2,d4+" cm",1]]})}<p>A est le milieu de [LF], donc AF = LF ÷ 2 = ${d4} ÷ 2 = <b>${d4/2} cm</b>.</p>`}
 ]},
 {t:"Cercle et disque", e:[
  {n:"Activité 2", t:"Zone d'alerte", w:"Sur ton cahier", h:`<p>Une alerte concerne toute la zone située à ${dz} km ou moins d'une ville V. Sur la carte, <b>1 cm représente ${ech} km</b>.</p>
   <p>a) À combien de centimètres sur la carte correspondent ${dz} km ?</p><p>b) Quelle figure faut-il tracer pour représenter la zone d'alerte ?</p><p>c) Voici les distances réelles entre V et d'autres villes. Lesquelles sont dans la zone ? ${villes.map(([v,d])=>`${v} : ${d} km`).join(" · ")}</p>`,
   c:`<p>a) ${dz} ÷ ${ech} = ${dz/ech} : ${dz} km correspondent à <b>${dz/ech} cm</b> sur la carte.</p><p>b) Le <b>disque de centre V et de rayon ${dz/ech} cm</b> (sur la carte).</p>
   <p>c) On compare chaque distance à ${dz} km :<br>${villes.map(([v,d])=>`${v} : ${d} km ${d<dz?"&lt;":d>dz?"&gt;":"="} ${dz} km, donc ${d<=dz?"dans la zone":"en dehors"}.`).join("<br>")}</p><p>Dans la zone (${dz} km ou moins) : ${villes.filter(x=>x[1]<=dz).map(x=>x[0]).join(", ")||"aucune"}. En dehors : ${villes.filter(x=>x[1]>dz).map(x=>x[0]).join(", ")||"aucune"}.</p>`},
  {n:"Exercice 6", t:"Rayon et distance au centre", w:"Sur ton cahier", h:`<p>(C) est le cercle de centre A et de rayon ${r6} cm. On connaît la distance de A à cinq points : ${p6.map(([n,,d])=>`A${n} = ${fr(d)} cm`).join(" ; ")}.</p>
   <p>1) Pour chaque point, dis s'il est sur le cercle, à l'intérieur ou à l'extérieur.</p><p>2) Quels points appartiennent au disque de centre A et de rayon ${r6} cm ?</p>`,
   c:`<p>1) ${p6.map(([n,k,d])=>`${n} : A${n} ${sign(d,r6)} ${r6} cm, donc ${n} est ${k==="on"?"sur le cercle":k==="in"?"à l'intérieur":"à l'extérieur"}.`).join("<br>")}</p>
   <p>2) Le disque contient les points du cercle et de l'intérieur : ${p6.filter(x=>x[1]!=="out").map(x=>x[0]).sort().join(", ")}.</p>`},
  {n:"Exercice 7", t:"Rayon et diamètre", w:"Sur ton cahier", h:`<p>Recopie et complète le tableau.</p><div class="scroll"><table class="std"><tbody><tr><th>Rayon</th>${t7.map(([k,v])=>`<td>${k==="r"?fr(v)+" cm":"……"}</td>`).join("")}</tr><tr><th>Diamètre</th>${t7.map(([k,v])=>`<td>${k==="d"?fr(v)+" cm":"……"}</td>`).join("")}</tr></tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><tbody><tr><th>Rayon</th>${t7.map(([k,v])=>`<td>${k==="r"?fr(v):"<b>"+fr(v/2)+"</b>"} cm</td>`).join("")}</tr><tr><th>Diamètre</th>${t7.map(([k,v])=>`<td>${k==="d"?fr(v):"<b>"+fr(2*v)+"</b>"} cm</td>`).join("")}</tr></tbody></table></div><p>diamètre = 2 × rayon ; rayon = diamètre ÷ 2.</p><p>${t7.map(([k,v])=>k==="r"?`2 × ${fr(v)} = ${fr(2*v)}`:`${fr(v)} ÷ 2 = ${fr(v/2)}`).join(" ; ")}</p>`},
  {n:"Exercice 8", t:"Calculer une longueur avec un cercle", w:"Sur ton cahier", h:`<p>(C) est le cercle de centre A et de rayon ${r8} cm ; R et C appartiennent au cercle (C) ; les points T, R, A et C sont alignés dans cet ordre ; TA = ${ta8} cm.</p>
   ${segFig({w:440, pts:[["T",0],["R",(ta8-r8)/(ta8+r8)],["A",ta8/(ta8+r8)],["C",1]]})}<p>a) Quelle est la longueur du segment [TC] ? Justifie. &nbsp; b) Quelle est la longueur du segment [TR] ? Justifie.</p>`,
   c:`<p>a) Je sais que C appartient au cercle de centre A et de rayon ${r8} cm, donc AC = ${r8} cm. Comme A est entre T et C : TC = TA + AC = ${ta8} + ${r8} = <b>${ta8+r8} cm</b>.</p>
   <p>b) Je sais que R appartient au cercle de centre A et de rayon ${r8} cm, donc AR = ${r8} cm. Comme R est entre T et A : TR = TA − AR = ${ta8} − ${r8} = <b>${ta8-r8} cm</b>.</p>`},
  {n:"Exercice 11", t:"Deux cercles", w:"Sur ton cahier", h:`<p>Le cercle (C₁) a pour centre A et pour rayon ${ra} cm, le cercle (C₂) a pour centre B et pour rayon ${rb} cm. Ces deux cercles se coupent en C et D.</p><p>a) Quelle est la longueur du segment [BC] ? Justifie. &nbsp; b) Quelle est la longueur du segment [AD] ? Justifie.</p>`,
   c:`<p>a) C appartient au cercle (C₂) de centre B et de rayon ${rb} cm, donc <b>BC = ${rb} cm</b>.</p><p>b) D appartient au cercle (C₁) de centre A et de rayon ${ra} cm, donc <b>AD = ${ra} cm</b>.</p>`}
 ]}
];
};
