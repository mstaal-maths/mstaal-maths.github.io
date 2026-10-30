/* 5e · chapitre 15 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres.
   Les solides, les patrons et les corrections sont produits à partir des mêmes valeurs. */
TRAIN["5e-15"] = function(){
const {ri, pick, shuf} = TR;
const {solid, patPave, patPrisme, pile, nets, NETS_OK, NETS_KO, turn, N, F, rd, PI, KC} = window.GEO15;
const L6 = "abcdef";

/* ===== Activité 1 : reconnaître des solides ===== */
const SOL = shuf([
  ["pavé droit", ()=>solid("pave",{L:ri(35,45)/10,l:ri(25,35)/10,h:ri(15,22)/10,u:30,pad:16})],
  ["cube", ()=>{ const c=ri(22,28)/10; return solid("pave",{L:c,l:c,h:c,u:30,pad:16}); }],
  ["prisme droit (à base triangulaire)", ()=>solid("prisme",{p:ri(25,32)/10,q:ri(25,32)/10,L:ri(28,38)/10,u:30,pad:16})],
  ["cylindre", ()=>solid("cyl",{r:ri(11,15)/10,h:ri(28,38)/10,u:30,pad:16})]
]);
const SOLf = SOL.map(([,f])=>f());
const prisms = SOL.map(([n],i)=>[n,"ABCD"[i]]).filter(([n])=>n!=="cylindre").map(x=>x[1]);

/* ===== Exercice 1 : perspective cavalière ===== */
const P1 = (()=>{ let L,l,h; do{ L=ri(3,6); l=ri(2,5); h=ri(2,4); }while(L===l||l===h||L===h); return {L,l,h}; })();
const C1 = {r:pick([1,1.5,2,2.5]), h:pick([2,3,4,5,6])};

/* ===== Exercice 2 : patrons de cube ===== */
const nOk = ri(2,4);
const E2 = shuf([...shuf(NETS_OK).slice(0,nOk).map(c=>[turn(c),true]), ...shuf(NETS_KO).slice(0,6-nOk).map(c=>[turn(c),false])]);
const okNums = E2.map(([,o],i)=>o?i+1:0).filter(Boolean), koNums = E2.map(([,o],i)=>o?0:i+1).filter(Boolean);
const list = a => a.length>1 ? a.slice(0,-1).join(", ")+" et "+a[a.length-1] : String(a[0]);

/* ===== Exercice 3 : patron d'un pavé ===== */
const P3 = (()=>{ let L,l,h; do{ L=ri(3,6); l=ri(2,5); h=ri(1,4); }while(!(L>l && l>h)); return {L,l,h}; })();
const A3 = 2*(P3.L*P3.l + P3.L*P3.h + P3.l*P3.h);

/* ===== Exercice 4 : prisme et patron ===== */
const TRI = pick([[3,4,5],[4,3,5],[1.5,2,2.5],[2,1.5,2.5],[3,2.25,3.75]]);
const [p4,q4,r4] = TRI, L4 = ri(4,8);
const lab4 = {p:N(p4)+" cm", q:N(q4)+" cm", r:N(r4)+" cm", L:L4+" cm"};

/* ===== Exercice 5 : pile de cubes ===== */
const G5 = (()=>{ let g; do{ g=[0,1,2].map(()=>[0,1,2].map(()=>Math.random()<0.25?0:ri(1,4))); }while(g.flat().filter(x=>x===0).length<1 || g.flat().every(x=>x===0)); return g; })();
const n5 = G5.flat().reduce((a,b)=>a+b,0), m5 = Math.max(...G5.flat()), c5 = ri(1,3);

/* ===== Exercice 6 : aires de disques ===== */
const disc = ([k,v]) => { const r=k==="rayon"?v:v/2; return {r, ex:rd(r*r,4), ap:Math.PI*r*r}; };
let D6; do{ D6 = shuf([
  ...[ri(2,6), ri(7,12)].map(r=>["rayon",r]),
  ["rayon", ri(1,9)+0.5],
  ["diamètre", 2*ri(2,9)], ["diamètre", 2*ri(5,12)],
  ["rayon", pick([10,20,15])]
]); }while(new Set(D6.map(d=>disc(d).r)).size<6);   /* six disques de rayons différents */

/* ===== Exercice 7 : cube, pavé, aquarium ===== */
const c7 = ri(3,12), P7 = [ri(5,12), ri(3,8), ri(2,6)], Q7 = [10*ri(4,10), 10*ri(2,5), 10*ri(3,6)];
const V7 = Q7[0]*Q7[1]*Q7[2];

/* ===== Exercice 8 : conversions ===== */
const CV = shuf([
  ()=>{ const n=ri(2,20); return [`${n} dm³ = ……… cm³`, `1 dm³ = 1 000 cm³, donc ${n} dm³ = ${n} × 1 000 = ${N(n*1000)} cm³.`]; },
  ()=>{ const n=ri(2,9); return [`${n} L = ……… cm³`, `1 L = 1 000 cm³, donc ${n} L = ${n} × 1 000 = ${N(n*1000)} cm³.`]; },
  ()=>{ const n=ri(2,30); return [`${N(n*1000)} cm³ = ……… L`, `1 000 cm³ = 1 L, donc ${N(n*1000)} cm³ = ${N(n*1000)} ÷ 1 000 = ${n} L.`]; },
  ()=>{ const n=ri(1,9)/10+pick([0,0,1,2]); return [`${N(n)} m³ = ……… L`, `1 m³ = 1 000 L, donc ${N(n)} m³ = ${N(n)} × 1 000 = ${N(n*1000)} L.`]; },
  ()=>{ const n=ri(5,95); return [`${n} cL = ……… L`, `1 L = 100 cL, donc ${n} cL = ${n} ÷ 100 = ${N(n/100)} L.`]; },
  ()=>{ const n=10*ri(5,99); return [`${n} mL = ……… cm³`, `1 mL = 1 cm³, donc ${n} mL = ${n} cm³.`]; },
  ()=>{ const n=ri(2,9); return [`${n} m³ = ……… dm³`, `1 m³ = 1 000 dm³, donc ${n} m³ = ${n} × 1 000 = ${N(n*1000)} dm³.`]; }
]).slice(0,6).map(f=>f());

/* ===== Exercice 9 : prisme droit ===== */
const E9 = (()=>{ let a,b; do{ a=ri(2,9); b=ri(2,9); }while(a===b||a*b%2); const B=a*b/2, h=ri(4,15), k=ri(2,12); return {a,b,B,h,k:k===h?k+1:k}; })();

/* ===== Exercice 10 : cylindres ===== */
const E10 = (()=>{ const r=ri(2,8), h=ri(5,20), r2=ri(3,6), h2=ri(8,14); let d,hb,cap,Vb;
  do{ d=2*ri(3,5); hb=ri(15,30); cap=pick([0.5,1]); Vb=Math.PI*(d/2)**2*hb; }while(Math.abs(Vb-cap*1000)<20);
  const Va=Math.PI*r*r*h, Vc=Math.PI*r2*r2*h2; return {r,h,Va,d,hb,cap,Vb,r2,h2,Vc}; })();
const okB = E10.Vb > E10.cap*1000;

/* ===== Exercice 11 : la piscine ===== */
const E11 = (()=>{ for(let g=0; g<2000; g++){ const L=ri(6,15), l=ri(3,8), p=pick([1,1.2,1.5,1.6,1.8,2]), V=rd(L*l*p,3), Li=Math.round(V*1000);
    const db=pick([1000,1200,1500,2000,2500,3000]), fr=pick([[2,3],[3,4],[1,2],[3,5]]); if(Li%db || Li%fr[1]) continue; return {L,l,p,V,Li,db,fr}; }
  return {L:10,l:5,p:1.5,V:75,Li:75000,db:1500,fr:[2,3]}; })();
const FRW = {"2/3":"aux deux tiers","3/4":"aux trois quarts","1/2":"à moitié","3/5":"aux trois cinquièmes"};

/* ===== Exercice 12 : la maquette ===== */
const E12 = (()=>{ let b,t; do{ b=ri(4,10); t=ri(3,8); }while(b*t%2); return {b,t,H:ri(15,35),s:Math.min(Math.round(b/3),t-1)}; })();

return [
 {t:"Reconnaître et représenter des solides", e:[
  {n:"Activité 1", t:"Reconnaître des solides", w:"Sur ton cahier", h:`<div class="figs">${SOLf.map((s,i)=>`<figure><figcaption><b>${"ABCD"[i]}</b></figcaption>${s}</figure>`).join("")}</div>
   <p><b>1)</b> Donne le nom de chaque solide.</p><p><b>2)</b> Lesquels de ces solides sont des prismes droits ?</p><p><b>3)</b> Quelles arêtes sont dessinées en pointillés ? Pourquoi ?</p>`,
   c:`<p><b>1)</b> ${SOL.map(([n],i)=>`${"ABCD"[i]} : ${n}`).join(" · ")}</p><p><b>2)</b> ${list(prisms)} sont des prismes droits. Le cylindre n'en est pas un : ses bases sont des disques.</p><p><b>3)</b> Les arêtes cachées, c'est-à-dire celles qu'on ne verrait pas si le solide était opaque, sont en pointillés.</p>`},
  {n:"Exercice 1", t:"Dessiner en perspective cavalière", w:"Sur ton cahier", h:`<p>Sur ton cahier à petits carreaux, représente en perspective cavalière (angle de fuite 45°, coefficient ${F(1,2)}) :</p><p><b>a)</b> un pavé droit de longueur ${P1.L} cm, de largeur ${P1.l} cm et de hauteur ${P1.h} cm ;</p><p><b>b)</b> un cylindre de rayon ${N(C1.r)} cm et de hauteur ${C1.h} cm.</p>`,
   c:`<p><b>a)</b> La face avant est un rectangle de ${P1.L} cm sur ${P1.h} cm, en vraie grandeur. Les arêtes fuyantes mesurent ${P1.l} × ${F(1,2)} = ${N(P1.l/2)} cm et font 45° avec l'horizontale. On met en pointillés les 3 arêtes cachées.</p>
   ${solid("pave",{L:P1.L,l:P1.l,h:P1.h,u:30,lab:{L:P1.L+" cm",h:P1.h+" cm",l:N(P1.l/2)+" cm"},maxw:520})}
   <p><b>b)</b> Le disque de la face avant est en vraie grandeur (rayon ${N(C1.r)} cm). La hauteur est réduite : ${C1.h} × ${F(1,2)} = ${N(C1.h/2)} cm. Le disque arrière est le translaté du disque avant ; sa moitié cachée est en pointillés.</p>
   ${solid("cyl",{r:C1.r,h:C1.h,u:30,lab:{r:N(C1.r)+" cm",h:N(C1.h/2)+" cm"},maxw:520})}`},
  {n:"Exercice 2", t:"Patrons d'un cube", w:"Sur ton cahier", h:`<p>Parmi ces six figures, indique lesquelles sont des patrons d'un cube.</p><p>Pour t'aider, tu peux les reproduire sur ton cahier, les découper et les plier.</p>${nets(E2.map(x=>x[0]))}`,
   c:`<p>Les figures <b>${list(okNums)}</b> sont des patrons de cube.</p><p>${koNums.length>1?`Les figures ${list(koNums)} n'en sont pas`:`La figure ${koNums[0]} n'en est pas un`} : en pliant, deux carrés se superposeraient et une face du cube resterait vide.</p>${nets(E2.map(x=>x[0]), E2.map(x=>x[1]))}`},
  {n:"Exercice 3", t:"Patron d'un pavé", w:"Sur ton cahier", h:`<p>Un pavé droit mesure ${P3.L} cm de longueur, ${P3.l} cm de largeur et ${P3.h} cm de hauteur.</p><p><b>1)</b> Dessine un patron de ce pavé à l'échelle 1 (carreaux de 1 cm).</p><p><b>2)</b> Combien de faces a ce pavé ? Quelles sont leurs dimensions ?</p><p><b>3)</b> Calcule l'aire totale du patron.</p>`,
   c:`<p><b>1)</b> Par exemple : une bande de quatre rectangles (${P3.L} × ${P3.h}, ${P3.l} × ${P3.h}, ${P3.L} × ${P3.h}, ${P3.l} × ${P3.h}) avec, au-dessus et en dessous du premier, un rectangle de ${P3.L} × ${P3.l} (dimensions en cm).</p>${patPave(P3.L,P3.l,P3.h)}
   <p><b>2)</b> 6 faces : deux de ${P3.L} × ${P3.l}, deux de ${P3.L} × ${P3.h}, deux de ${P3.l} × ${P3.h}.</p>
   <p><b>3)</b> L'aire totale A :</p>${KC("A",[`2 × (${P3.L} × ${P3.l}) + 2 × (${P3.L} × ${P3.h}) + 2 × (${P3.l} × ${P3.h})`,`${2*P3.L*P3.l} + ${2*P3.L*P3.h} + ${2*P3.l*P3.h}`,`${A3} cm²`])}`},
  {n:"Exercice 4", t:"Relier un prisme et son patron", w:"Sur ton cahier", h:`<p>Voici un prisme droit dont la base est un triangle rectangle, et un patron de ce prisme.</p>
   <div class="figs">${solid("prisme",{p:p4,q:q4,L:L4,u:Math.round(150/Math.max(p4,q4)),lab:lab4,maxw:420})}${patPrisme(p4,q4,r4,L4,["a","b","c","d"],p4<2.5&&q4<2.5?30:22)}</div>
   <p>Donne les longueurs <i>a</i>, <i>b</i>, <i>c</i> et <i>d</i>.</p><p>Combien le patron comporte-t-il de faces ?</p><p>Quelle est la nature des faces latérales ?</p>`,
   c:`<p><i>a</i> = ${N(p4)} cm ; <i>b</i> = ${L4} cm (la hauteur du prisme) ; <i>c</i> = ${N(r4)} cm ; <i>d</i> = ${N(p4)} cm.</p><p>Le patron comporte 5 faces : 2 triangles et 3 rectangles. Les faces latérales sont des rectangles.</p>
   ${patPrisme(p4,q4,r4,L4,[N(p4)+" cm",L4+" cm",N(r4)+" cm",N(p4)+" cm"],p4<2.5&&q4<2.5?30:22)}`},
  {n:"Exercice 5", t:"Dénombrer des cubes", w:"Sur ton cahier", h:`<p>Voici une pile de cubes identiques, vue de dessus.</p><p>Le nombre dans chaque case donne le nombre de cubes empilés à cet endroit.</p>${pile(G5)}
   <p><b>a)</b> Combien de cubes la pile contient-elle ?</p><p><b>b)</b> Quelle est la hauteur maximale de la pile (en nombre de cubes) ?</p><p><b>c)</b> Chaque cube a une arête de ${c5} cm. Calcule le volume de la pile.</p>`,
   c:`<p><b>a)</b> ${G5.flat().join(" + ")} = ${n5} cubes.</p><p><b>b)</b> ${m5} cube${m5>1?"s":""}.</p><p><b>c)</b> Volume d'un cube : ${c5}³ = ${c5**3} cm³. Volume de la pile : ${n5} × ${c5**3} = ${n5*c5**3} cm³.</p>`}
 ]},
 {t:"Aire du disque et volumes", e:[
  {n:"Exercice 6", t:"Aire d'un disque", w:"Sur ton cahier", h:`<p>Calcule l'aire de chaque disque.</p><p>Donne la valeur exacte (avec ${PI}), puis une valeur approchée au dixième.</p><p>${D6.map(([k,v],i)=>`<b>${L6[i]})</b> ${k} ${N(v)} cm`).join(" &nbsp; ")}</p>`,
   c:`<p>L'aire A de chaque disque :</p><div class="calcs">${D6.map((d,i)=>{ const o=disc(d); return `<div><p><b>${L6[i]})</b>${d[0]==="diamètre"?` r = ${d[1]} ÷ 2 = ${N(o.r)} cm`:""}</p>${KC("A",[`${PI} × ${N(o.r)}²`,`${N(o.ex)}${PI}`,`≈ ${N(o.ap,1)} cm²`])}</div>`; }).join("")}</div>`},
  {n:"Exercice 7", t:"Volume d'un cube et d'un pavé", w:"Sur ton cahier", h:`<p>Calcule le volume de chaque solide.</p><p><b>a)</b> un cube d'arête ${c7} cm ;</p><p><b>b)</b> un pavé droit de ${P7[0]} cm de longueur, ${P7[1]} cm de largeur et ${P7[2]} cm de hauteur ;</p><p><b>c)</b> un aquarium (pavé droit) de ${Q7[0]} cm de longueur, ${Q7[1]} cm de largeur et ${Q7[2]} cm de hauteur : donne son volume en cm³, puis sa capacité en litres.</p>`,
   c:`<p><b>a)</b></p>${KC("V",[`${c7}³`,`${c7} × ${c7} × ${c7}`,`${N(c7**3)} cm³`])}<p><b>b)</b> ${P7.join(" × ")} = ${N(P7[0]*P7[1]*P7[2])} cm³.</p><p><b>c)</b></p>${KC("V",[Q7.join(" × "),`${N(V7)} cm³`,`${N(V7/1000)} dm³`])}<p>Soit une capacité de ${N(V7/1000)} L.</p>`},
  {n:"Exercice 8", t:"Convertir des unités", w:"Sur ton cahier", h:`<p>Convertis.</p><div class="calcs">${CV.map(([q],i)=>`<span><b>${L6[i]})</b> ${q}</span>`).join("")}</div>`,
   c:CV.map(([,r],i)=>`<p><b>${L6[i]})</b> ${r}</p>`).join("")},
  {n:"Exercice 9", t:"Volume d'un prisme droit", w:"Sur ton cahier", h:`<p>La base d'un prisme droit est un triangle rectangle dont les côtés de l'angle droit mesurent ${E9.a} cm et ${E9.b} cm. Sa hauteur est de ${E9.h} cm.</p><p><b>a)</b> Calcule l'aire de la base.</p><p><b>b)</b> Calcule le volume du prisme.</p><p><b>c)</b> Quelle serait la hauteur d'un prisme de même base et de volume ${E9.B*E9.k} cm³ ?</p>`,
   c:`<p><b>a)</b> ${F(`${E9.a} × ${E9.b}`,2)} = ${E9.B} cm².</p><p><b>b)</b> ${E9.B} × ${E9.h} = ${E9.B*E9.h} cm³.</p><p><b>c)</b> ${E9.B*E9.k} ÷ ${E9.B} = ${E9.k} cm.</p>`},
  {n:"Exercice 10", t:"Volume d'un cylindre", w:"Sur ton cahier", h:`<p>Pour ${PI}, utilise la touche de ta calculatrice.</p><p><b>a)</b> Un cylindre a pour rayon ${E10.r} cm et pour hauteur ${E10.h} cm. Calcule son volume (valeur exacte puis arrondi à l'unité), puis sa capacité en litres (arrondie au centième).</p><p><b>b)</b> Une bouteille cylindrique a pour diamètre ${E10.d} cm et pour hauteur ${E10.hb} cm. Peut-elle contenir ${N(E10.cap)} L d'eau ? Justifie.</p><p><b>c)</b> Une boîte de conserve a pour rayon ${E10.r2} cm et pour hauteur ${E10.h2} cm. Calcule sa contenance en mL (arrondie à l'unité).</p>`,
   c:`<p><b>a)</b></p>${KC("<i>V</i>",[`${PI} × ${E10.r}² × ${E10.h}`,`${E10.r**2*E10.h}${PI}`,`≈ ${N(Math.round(E10.Va))} cm³`])}<p>${N(Math.round(E10.Va))} cm³ = ${N(Math.round(E10.Va)/1000)} dm³, soit environ ${N(E10.Va/1000,2)} L.</p>
   <p><b>b)</b> Rayon : ${E10.d/2} cm.</p>${KC("<i>V</i>",[`${PI} × ${E10.d/2}² × ${E10.hb}`,`${(E10.d/2)**2*E10.hb}${PI}`,`≈ ${N(Math.round(E10.Vb))} cm³`,`≈ ${N(E10.Vb/1000,2)} L`])}<p>${okB?`Comme ${N(E10.Vb/1000,2)} &gt; ${N(E10.cap)} : oui, la bouteille peut contenir ${N(E10.cap)} L.`:`Comme ${N(E10.Vb/1000,2)} &lt; ${N(E10.cap)} : non, la bouteille ne peut pas contenir ${N(E10.cap)} L.`}</p>
   <p><b>c)</b></p>${KC("<i>V</i>",[`${PI} × ${E10.r2}² × ${E10.h2}`,`${E10.r2**2*E10.h2}${PI}`,`≈ ${N(Math.round(E10.Vc))} cm³`])}<p>Soit environ ${N(Math.round(E10.Vc))} mL.</p>`},
  {n:"Exercice 11", t:"La piscine", w:"Sur ton cahier", h:`<p>Une piscine a la forme d'un pavé droit de ${E11.L} m de longueur, ${E11.l} m de largeur et ${N(E11.p)} m de profondeur.</p><p><b>a)</b> Calcule son volume en m³, puis sa contenance en litres.</p><p><b>b)</b> On la remplit avec un robinet dont le débit est de ${N(E11.db)} L par heure. Combien d'heures faut-il pour la remplir complètement ?</p><p><b>c)</b> La piscine est remplie seulement ${FRW[E11.fr.join("/")]}. Combien de litres d'eau contient-elle ?</p>`,
   c:`<p><b>a)</b></p>${KC("V",[`${E11.L} × ${E11.l} × ${N(E11.p)}`,`${N(E11.V)} m³`,`${N(E11.Li)} L`])}<p><b>b)</b> ${N(E11.Li)} ÷ ${N(E11.db)} = ${E11.Li/E11.db} : il faut ${E11.Li/E11.db} heures.</p><p><b>c)</b> ${F(E11.fr[0],E11.fr[1])} × ${N(E11.Li)} = ${N(E11.Li/E11.fr[1]*E11.fr[0])} L.</p>`},
  {n:"Exercice 12", t:"La maquette", w:"Sur ton cahier", h:`<p>On construit la maquette d'un immeuble en forme de prisme droit à base triangulaire.</p><p>La base est un triangle de base ${E12.b} cm et de hauteur ${E12.t} cm ; la hauteur de la maquette est ${E12.H} cm.</p><p><b>a)</b> Calcule l'aire de la base de la maquette.</p><p><b>b)</b> Calcule le volume de la maquette.</p><p><b>c)</b> Dessine la maquette en perspective cavalière (angle 45°, coefficient ${F(1,2)}).</p>`,
   c:`<p><b>a)</b> ${F(`${E12.b} × ${E12.t}`,2)} = ${E12.b*E12.t/2} cm².</p><p><b>b)</b> ${E12.b*E12.t/2} × ${E12.H} = ${N(E12.b*E12.t/2*E12.H)} cm³.</p><p><b>c)</b> On dessine le triangle de base ${E12.b} cm et de hauteur ${E12.t} cm en vraie grandeur. Puis on trace les arêtes fuyantes de ${E12.H} × ${F(1,2)} = ${N(E12.H/2)} cm à 45°, et on met en pointillés les arêtes cachées.</p>${solid("prisme",{p:E12.b,q:E12.t,s:E12.s,L:E12.H,u:Math.min(30,Math.round(440/(E12.b+E12.H*0.354))),lab:{p:E12.b+" cm",t:E12.t+" cm",L:N(E12.H/2)+" cm"},maxw:520,alt:"Maquette en perspective cavalière"})}`}
 ]}
];
};
