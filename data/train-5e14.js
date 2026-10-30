/* 5e · chapitre 14 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres.
   Les graphiques et les corrections sont produits à partir des mêmes valeurs. */
TRAIN["5e-14"] = function(){
const {ri, pick, shuf, distinct} = TR;
const {gr, F, Q, P, r3, TB} = window.GRA;
const NM = "ABCDEF";

/* ===== A. Se repérer ===== */
/* Activité : six points, dont un sur chaque axe et un à coordonnées décimales */
const A1 = (()=>{ const pts = distinct(3, ()=>[ri(1,6), ri(1,5)], p=>p.join());
  const ax = [[0, ri(1,5)], [ri(1,6), 0]], dec = [ri(1,5)+0.5, ri(1,4)+0.5];
  const all = shuf([...pts, ...ax, dec]); return all.map(([x,y],i)=>[NM[i],x,y, 11, x===0?-8:-10]); })();
/* Exercice 1 : placer des points */
const E1 = (()=>{ const pts = distinct(3, ()=>[ri(1,7), ri(1,6)], p=>p.join()); const all = shuf([...pts, [ri(1,6)+0.5, ri(1,5)], [0, ri(1,6)], [ri(1,7), 0]]); return all.map(([x,y],i)=>[NM[i],x,y]); })();
const onY = E1.filter(p=>p[1]===0), onX = E1.filter(p=>p[2]===0);
/* Exercice 2 : rectangle */
const R2 = (()=>{ const x1=ri(0,2), x2=ri(x1+2,6), y1=ri(0,2), y2=ri(y1+2,5); return {x1,x2,y1,y2}; })();
const L2 = R2.x2-R2.x1, l2 = R2.y2-R2.y1;
const secA = {t:"Se repérer dans le plan", e:[
  {n:"Activité 1", t:"Lire des coordonnées", w:"Sur ton cahier", h:`<div class="figs">${gr({xmax:6, ymax:5, pts:A1, alt:"Repère avec six points"})}</div><p>Écris les coordonnées des points A, B, C, D, E et F.</p>`,
   c:`<p>${A1.map(([n,x,y])=>P(n,x,y)).join(" · ")}</p><div class="figs">${gr({xmax:6, ymax:5, pts:A1, proj:A1.map(p=>[p[1],p[2]])})}</div>`},
  {n:"Exercice 1", t:"Placer des points", w:"Sur ton cahier", h:`<p>Trace un repère orthogonal (origine O en bas à gauche, 1 cm pour une unité ; abscisses jusqu'à 7, ordonnées jusqu'à 6).</p><p>Place les points : ${E1.map(([n,x,y])=>P(n,x,y)).join(" &nbsp; ")}.</p><p>Que remarques-tu pour les points ${[...onY,...onX].map(p=>p[0]).join(" et ")} ?</p>`,
   c:`<div class="figs">${gr({xmax:7, ymax:6, pts:E1.map(([n,x,y])=>[n,x,y,11,x===0?-8:-10]), pw:280, ph:240})}</div>${onY.map(p=>`<p>${p[0]} est sur l'axe des ordonnées (son abscisse est 0).</p>`).join("")}${onX.map(p=>`<p>${p[0]} est sur l'axe des abscisses (son ordonnée est 0).</p>`).join("")}`},
  {n:"Exercice 2", t:"Un rectangle dans le repère", w:"Sur ton cahier", h:`<p>Dans un repère orthogonal, on place les points ${P("A",R2.x1,R2.y2)}, ${P("B",R2.x2,R2.y2)} et ${P("C",R2.x2,R2.y1)}.</p><p>a) Place ces trois points. Quelle est la nature du triangle ABC ?</p><p>b) Place le point D pour que ABCD soit un rectangle. Donne ses coordonnées.</p><p>c) Calcule le périmètre et l'aire du rectangle ABCD (unité : 1 cm).</p>`,
   c:`<div class="figs">${gr({xmax:7, ymax:6, poly:[[R2.x1,R2.y2],[R2.x2,R2.y2],[R2.x2,R2.y1],[R2.x1,R2.y1]], pts:[["A",R2.x1,R2.y2,-10,-10],["B",R2.x2,R2.y2],["C",R2.x2,R2.y1,11,18],["D",R2.x1,R2.y1,-10,18]], pw:280, ph:240})}</div>
   <p>a) AB est horizontal (même ordonnée ${R2.y2}) ; BC est vertical (même abscisse ${R2.x2}). Le triangle ABC est <b>rectangle en B</b>.</p><p>b) <b>${P("D",R2.x1,R2.y1)}</b> : même abscisse que A, même ordonnée que C.</p><p>c) AB = ${R2.x2} − ${R2.x1} = ${L2} cm et BC = ${R2.y2} − ${R2.y1} = ${l2} cm.</p><p>Le périmètre P :</p><p class="calc">P = 2 × (${L2} + ${l2})<br>P = 2 × ${L2+l2}<br>P = <b>${2*(L2+l2)} cm</b></p><p>Aire : ${L2} × ${l2} = <b>${L2*l2} cm<sup>2</sup></b>.</p>`}
 ]};

/* ===== B. Une grandeur qui dépend d'une autre ===== */
const v3 = pick([3,4,5,6]), t3 = ri(2,4), d3 = v3*ri(1,4), ys3 = v3===3?2:v3===5?5:v3===6?3:2;
const G3 = o => gr(Object.assign({xmax:5, ymax:v3*4+ys3, ys:ys3, pts:[1,2,3,4].map(h=>["",h,v3*h]), segs:[[0,0,4,4*v3]], title:"Un randonneur", xt:"Durée (h)", yt:"Distance (km)"}, o));
const s4 = pick([40,50,70,80]), yst = s4<=50?50:100;
const secB = {t:"Une grandeur qui dépend d'une autre", e:[
  {n:"Exercice 3", t:"Lire un graphique", w:"Sur ton cahier", h:`<p>Le graphique représente la distance parcourue par un randonneur selon la durée de sa marche.</p><div class="figs">${G3({})}</div><p>a) Quelle distance a-t-il parcourue en ${t3} heures ?</p><p>b) Combien de temps lui faut-il pour parcourir ${d3} km ?</p><p>c) Recopie et complète le tableau avec les valeurs lues sur le graphique, puis calcule les quotients distance ÷ durée.</p>${TB(["Durée (h)","1","2","3","4"],[["Distance (km)","","","",""]])}<p>d) Cette situation est-elle une situation de proportionnalité ? Quelle est la vitesse moyenne ?</p>`,
   c:`<div class="figs">${G3({proj:[[t3,v3*t3],[d3/v3,d3]]})}</div><p>a) On part de ${t3} h sur l'axe horizontal, on monte jusqu'à la droite, puis on lit l'ordonnée : <b>${v3*t3} km</b>.</p><p>b) On part de ${d3} km sur l'axe vertical, on va jusqu'à la droite, puis on lit l'abscisse : <b>${d3/v3} h</b>.</p><p>c)</p>${TB(["Durée (h)","1","2","3","4"],[["Distance (km)",...[1,2,3,4].map(h=>String(v3*h))]])}<p class="calc">${[1,2,3,4].map(h=>`${v3*h} ÷ ${h} = ${v3}`).join(" &nbsp;&nbsp; ")}</p><p>d) <b>Oui</b> : les quotients sont égaux et les points sont alignés avec l'origine. La vitesse moyenne est <b>${v3} km/h</b>.</p>`},
  {n:"Exercice 4", t:"Construire un graphique", w:"Sur ton cahier", h:`<p>Un enfant marche à vitesse constante. Voici la distance parcourue selon la durée :</p>${TB(["Durée (min)","1","2","3","4","5"],[["Distance (m)",...[1,2,3,4,5].map(m=>String(s4*m))]])}<p>Construis un graphique : en abscisse, 1 cm pour 1 minute (jusqu'à 6) ; en ordonnée, 1 cm pour ${yst} m. Place les points et relie-les.</p>`,
   c:`<p>Les points ${[1,2,3,4,5].map(m=>`(${m} ; ${s4*m})`).join(", ")} sont alignés avec l'origine : c'est une situation de proportionnalité (coefficient ${s4} m/min).</p><div class="figs">${gr({xmax:6, ymax:Math.ceil((5*s4+1)/yst)*yst, ys:yst, pts:[1,2,3,4,5].map(m=>["",m,s4*m]), segs:[[0,0,5,5*s4]], xt:"Durée (min)", yt:"Distance (m)", pw:6*40, ph:Math.ceil((5*s4+1)/yst)*40})}</div>`}
 ]};

/* ===== C. Proportionnalité sur un graphique ===== */
const k5 = ri(1,2), a5 = ri(1,2), b5 = ri(1,3);
const NL = pick([[[1,1],[2,4],[3,9]], [[1,1],[2,2],[3,6],[4,7]], [[1,2],[2,3],[3,6],[4,9]]]);   /* points non alignés */
const G5d = shuf([
  {pts:[1,2,3,4].map(x=>[x,k5*x]), ok:true, why:`les points ${[1,2,3,4].map(x=>`(${x} ; ${k5*x})`).join(", ")} sont alignés avec l'origine ; coefficient ${k5}.`},
  {pts:[1,2,3,4].map(x=>[x,a5*x+b5]), ok:false, why:`les points sont alignés, mais pas avec l'origine (${Q(a5+b5,1)} = ${a5+b5} et ${Q(2*a5+b5,2)} = ${F((2*a5+b5)/2)}).`},
  {pts:NL, ok:false, why:""}
]);
G5d.forEach(g=>{ if(!g.ok && !g.why) g.why = `les points ne sont pas alignés (${g.pts.map(([x,y])=>`${Q(y,x)} ${Math.abs(r3(y/x)-y/x)<1e-9?"=":"≈"} ${F(Math.round(y/x*100)/100)}`).join(" ; ")}).`; });
const ymax5 = Math.ceil(Math.max(10, ...G5d.flatMap(g=>g.pts.map(p=>p[1])))/2)*2;
const T6 = shuf([
  (()=>{ const L0=ri(8,15), c=pick([2,3,4]); const m=[50,100,150,200]; return {titre:"Longueur d'un ressort selon la masse accrochée.", h1:"Masse (g)", h2:"Longueur (cm)", x:m, y:m.map(v=>L0+c*v/50), ok:false}; })(),
  (()=>{ const p=pick([2.5,3.5,4.5,5.5,4]); const n=[1,3,5,10]; return {titre:"Prix d'entrées à la piscine.", h1:"Nombre de tickets", h2:"Prix (€)", x:n, y:n.map(v=>r3(p*v)), ok:true, k:p}; })()
]);
const q6 = t => t.x.map((x,i)=>{ const v=t.y[i]/x, ex=Math.abs(r3(v)-v)<1e-9; return `${Q(F(t.y[i]),x)} ${ex?"=":"≈"} ${F(ex?r3(v):Math.round(v*100)/100)}`; }).join(" ; ");
const pA = pick([2,3]), eB = ri(2,5), qB = 1;
const H7 = [1,2,3,4,5,6], h0 = eB/(pA-qB), hA = Number.isInteger(h0) ? h0+1 : Math.ceil(h0);
const k8 = pick([2,4,5]), X8 = shuf([2,3,4,5,6,10]).slice(0,4).sort((a,b)=>a-b);
const secC = {t:"Reconnaître la proportionnalité sur un graphique", e:[
  {n:"Exercice 5", t:"Reconnaître une situation de proportionnalité", w:"Sur ton cahier", h:`<p>Pour chaque graphique, dis s'il représente une situation de proportionnalité, et justifie.</p><div class="figs">${G5d.map((g,i)=>gr({xmax:5, ymax:ymax5, ys:2, pts:g.pts.map(([x,y])=>["",x,y]), title:"Graphique "+(i+1), pw:200, ph:170})).join("")}</div>`,
   c:G5d.map((g,i)=>`<p>${"abc"[i]}) Graphique ${i+1} : <b>${g.ok?"oui":"non"}</b> — ${g.why}</p>`).join("")},
  {n:"Exercice 6", t:"Tableaux et proportionnalité", w:"Sur ton cahier", h:`<p>Pour chaque tableau, calcule les quotients, puis dis si les points associés seraient alignés avec l'origine.</p>${T6.map((t,i)=>`<p>${"ab"[i]}) ${t.titre}</p>${TB([t.h1,...t.x.map(String)],[[t.h2,...t.y.map(v=>t.ok&&!Number.isInteger(v)&&/,\d$/.test(F(v)) ? F(v)+"0" : F(v))]])}`).join("")}`,
   c:T6.map((t,i)=>`<p>${"ab"[i]}) ${q6(t)} : ${t.ok?`les quotients sont égaux. Les points sont alignés avec l'origine : c'est une situation de <b>proportionnalité</b> (coefficient ${F(t.k)}).`:`les quotients sont différents. Les points ne sont pas alignés avec l'origine : ce n'est <b>pas</b> une situation de proportionnalité.`}</p>`).join("")},
  {n:"Exercice 7", t:"Deux formules de stationnement", w:"Sur ton cahier", h:`<p><b>Formule A :</b> ${pA} € par heure. <b>Formule B :</b> ${eB} € pour l'entrée, puis ${qB} € par heure.</p><p><b>1)</b> Recopie et complète le tableau.</p>${TB(["Durée (h)",...H7.map(String)],[["Prix formule A (€)",...H7.map(()=>"")],["Prix formule B (€)",...H7.map(()=>"")]])}<p><b>2)</b> Laquelle de ces formules correspond à une situation de proportionnalité ? Explique.</p><p><b>3)</b> À partir de combien d'heures la formule A coûte-t-elle plus cher que la formule B ?</p>`,
   c:`<p><b>1)</b></p>${TB(["Durée (h)",...H7.map(String)],[["Prix formule A (€)",...H7.map(h=>String(pA*h))],["Prix formule B (€)",...H7.map(h=>String(eB+qB*h))]])}<p><b>2)</b> La <b>formule A</b> : le prix est le produit de la durée par ${pA} (coefficient ${pA} €/h). Pour la formule B, ${Q(eB+qB,1)} = ${eB+qB} et ${Q(eB+2*qB,2)} = ${F((eB+2*qB)/2)} : les quotients sont différents.</p><p><b>3)</b> ${Number.isInteger(h0)?`À ${h0} h, les deux formules coûtent ${pA*h0} €. `:""}À ${hA} h, la formule A coûte ${pA*hA} € et la formule B ${eB+qB*hA} €${hA>1&&!Number.isInteger(h0)?` (à ${hA-1} h : A ${pA*(hA-1)} €, B ${eB+qB*(hA-1)} €)`:""}. À partir de <b>${hA} heures</b>, la formule A est plus chère.</p>`},
  {n:"Exercice 8", t:"Utiliser le coefficient de proportionnalité", w:"Sur ton cahier", h:`<p>Dans un repère, on place le point A(1 ; ${k8}).</p><p>a) La situation est une situation de proportionnalité dont le graphique passe par A. Quel est le coefficient de proportionnalité ?</p><p>b) Calcule les ordonnées des points d'abscisses ${X8.join(" ; ")}.</p><p>c) Place tous les points dans un repère. Que constates-tu ?</p>`,
   c:`<p>a) Le coefficient est l'ordonnée du point d'abscisse 1, soit <b>${k8}</b>.</p><p>b)</p>${TB(["Abscisse","1",...X8.map(String)],[["Ordonnée",String(k8),...X8.map(x=>String(k8*x))]])}<p>c) Les points sont <b>alignés avec l'origine</b>.</p><div class="figs">${gr({xmax:11, ymax:k8*11, ys:k8, yl:k8*2, pts:[["A",1,k8,-12,-4],...X8.map(x=>["",x,k8*x])], segs:[[0,0,11,11*k8,1]], pw:330, ph:250})}</div>`}
 ]};

return [secA, secB, secC];
};
