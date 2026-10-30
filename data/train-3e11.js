/* 3e · chapitre 11 — fiche d'entraînement : les exercices de statistiques de M. Staal, avec d'autres données.
   Diagrammes en bâtons et histogrammes dessinés en SVG à partir des valeurs tirées ; corrections calculées (outils window.STAT3). */
TRAIN["3e-11"] = function(){
const {ri, pick, shuf} = TR;
const {N, F, irr, gcd, sum, sortN, tab, te, batons, histo, medList, medTab, meanTab, rd} = window.STAT3;
const N2 = x => { const v=rd(x,2); if(Number.isInteger(v)) return N(v); const [i,d]=v.toFixed(2).split("."); return i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+","+d; };
const eq = (a,b) => Math.abs(a-b)<1e-9 ? "=" : "≈";
const cls=(v,a,w,n)=>Array.from({length:n},(_,i)=>v.filter(x=>x>=a+i*w&&x<a+(i+1)*w).length);
const serie=(n,lo,hi)=>Array.from({length:n},()=>ri(lo,hi));

/* ===== 1. Moyenne, étendue, fréquence ===== */
const CIN = (()=>{ const T=[4,6,6.4,7.5,9.5]; let v; do{ v=Array.from({length:pick([12,15,16,20])},()=>pick(T)); }while(new Set(v).size<4 || Math.max(...v)===Math.min(...v)); return v; })();
const PT = (()=>{ const vals=[38,39,40,41,42,43,44,45].slice(ri(0,1)).slice(0,7); const e=vals.map((_,i)=>ri(1,4)+(i>1&&i<5?ri(4,12):0)); return {vals, e, k:ri(1,vals.length-2)}; })();
const AT = (()=>{ let e,M; do{ e=[ri(2,6),ri(5,10),ri(8,14),ri(6,12),ri(4,10),ri(1,4),ri(0,2)]; M=meanTab([1,2,3,4,5,6,7],e); }while(sum(e)<35||Math.abs(M.m-3)<0.05); return {e, M, s:ri(3,5)}; })();
const MAC = (()=>{ const j=["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"]; let v; do{ v=serie(7,180,480); }while(new Set(v).size<7); return {j, v}; })();

/* ===== 2. Médiane ===== */
const BW1 = serie(pick([9,11,13]),80,140), BW2 = serie(pick([8,10,12]),70,180);
const CART = (()=>{ const vals=[3,4,5,6,7,8,9,10].slice(ri(0,1)).slice(0,7); return {vals, e:vals.map(()=>ri(1,8))}; })();
const SAL = (()=>{ for(let g=0;g<500;g++){ const vals=[ri(90,100)*10, ri(120,130)*10, ri(140,160)*10, ri(220,250)*10, ri(380,450)*10], e=[ri(1,3),ri(12,22),ri(4,9),ri(1,3),1], M=meanTab(vals,e); if(Number.isInteger(rd(M.m*100,6))) return {vals, e, M}; } const vals=[940,1250,1450,2300,3950], e=[1,20,7,2,1]; return {vals, e, M:meanTab(vals,e)}; })();

/* ===== 3. Classes et histogrammes ===== */
const MOU = serie(12,0,14);
const PRE = {w:pick([2,3,5]), e:[ri(3,12),ri(3,12),ri(3,12),ri(3,12)]};
const NX = (()=>{ const v=serie(30,28,37); return {v, e:cls(v,28,2,5)}; })();

/* ===== 4. Révisions ===== */
const TEMP = Array.from({length:pick([5,7,9])},()=>ri(365,402)/10);
const LIV = serie(pick([9,11]),0,9);

const moyL = v => `{${v.map(x=>N(x)).join(" + ")}/${v.length}} = {${N(rd(sum(v),4))}/${v.length}}`;
/* la même moyenne écrite en chaîne, une étape par ligne */
const moyC = (v,nm="M") => `<p class="calc" style="white-space:normal">${nm} = {${v.map(x=>N(x)).join(" + ")}/${v.length}}</p><p class="calc">${nm} = {${N(rd(sum(v),4))}/${v.length}}<br>${nm} ${eq(sum(v)/v.length,rd(sum(v)/v.length,1))} <b>${N(rd(sum(v)/v.length,1))}</b></p>`;

return [
 {t:"Moyenne, étendue et fréquence", e:[
  {n:"Exercice 1", t:"Au cinéma", w:"Sur ton cahier", h:`<p>Un cinéma propose les tarifs 4 €, 6 €, 6,40 €, 7,50 € et 9,50 €. Le caissier note les prix des ${CIN.length} entrées d'un après-midi :</p><p class="calc" style="white-space:normal">${CIN.map(N2).join(" – ")}</p><p><b>a)</b> Détermine le prix moyen d'une place (arrondi au centime).</p><p><b>b)</b> Détermine l'étendue des prix.</p><p><b>c)</b> Interprète ces deux nombres par une phrase.</p>`,
   c:`${(()=>{ const T=[4,6,6.4,7.5,9.5].filter(t=>CIN.includes(t)), n=T.map(t=>CIN.filter(x=>x===t).length);
     return `<p><b>a)</b> On compte les places de chaque prix : ${T.map((t,i)=>`${n[i]} à ${N2(t)} €`).join(", ")} (${CIN.length} places).</p><p class="calc">M = {${T.map((t,i)=>`${n[i]} × ${N2(t)}`).join(" + ")}/${CIN.length}}<br>M = {${N2(sum(CIN))}/${CIN.length}}<br>M ${Number.isInteger(rd(sum(CIN)/CIN.length*100,6))?"=":"≈"} ${N2(sum(CIN)/CIN.length)}</p><p>Le prix moyen d'une place est ${Number.isInteger(rd(sum(CIN)/CIN.length*100,6))?"de":"d'environ"} <b>${N2(sum(CIN)/CIN.length)} €</b>.</p>`; })()}<p><b>b)</b> ${N2(Math.max(...CIN))} − ${N2(Math.min(...CIN))} = <b>${N2(Math.max(...CIN)-Math.min(...CIN))} €</b>.</p><p><b>c)</b> La recette aurait été la même si chaque client avait payé ${N2(sum(CIN)/CIN.length)} €. L'écart entre la place la plus chère et la moins chère est de ${N2(Math.max(...CIN)-Math.min(...CIN))} €.</p>`},
  {n:"Exercice 2", t:"Pointures", w:"Sur ton cahier", h:`<p>Voici les pointures des ${sum(PT.e)} joueurs d'un club :</p>${te(["Pointure",...PT.vals.map(String)],["Effectif",...PT.e.map(String)])}<p><b>a)</b> Calcule l'étendue des pointures.</p><p><b>b)</b> Calcule la pointure moyenne (arrondie au dixième).</p><p><b>c)</b> Donne, en fraction irréductible, la fréquence des joueurs qui chaussent du ${PT.vals[PT.k]}.</p>`,
   c:(()=>{ const M=meanTab(PT.vals,PT.e); return `<p><b>a)</b> ${PT.vals[PT.vals.length-1]} − ${PT.vals[0]} = <b>${PT.vals[PT.vals.length-1]-PT.vals[0]}</b>.</p><p><b>b)</b></p><p class="calc" style="white-space:normal">${M.ch()}<br>M ${eq(M.m,rd(M.m,1))} <b>${N(rd(M.m,1))}</b></p><p><b>c)</b> {${PT.e[PT.k]}/${M.n}}${gcd(PT.e[PT.k],M.n)>1?` = <b>${irr(PT.e[PT.k],M.n)}</b>`:" (déjà irréductible)"}.</p>`; })()},
  {n:"Exercice 3", t:"Temps d'attente en caisse", w:"Sur ton cahier", h:`<p>Un directeur de supermarché a relevé les temps d'attente, en min, de ${AT.M.n} clients :</p>${batons({vals:["1","2","3","4","5","6","7"], eff:AT.e, xlab:"Temps d'attente (en min)", ymax:Math.max(...AT.e)+1, ystep:1, ylabStep:2, w:420, H:270})}<p><b>1) a)</b> Quelle est la fréquence des clients qui ont attendu 3 min ?</p><p><b>b)</b> Combien de clients ont attendu ${AT.s} minutes ou plus ?</p><p><b>2)</b> Le directeur ouvre une caisse supplémentaire si le temps moyen d'attente dépasse 3 min. Doit-il ouvrir une caisse ?</p>`,
   c:`<p><b>1) a)</b> {${AT.e[2]}/${AT.M.n}} ${eq(AT.e[2]/AT.M.n,rd(AT.e[2]/AT.M.n,2))} ${N(rd(AT.e[2]/AT.M.n,2))}, soit ${eq(AT.e[2]/AT.M.n*100,rd(AT.e[2]/AT.M.n*100,0))==="="?"":"environ "}<b>${N(rd(AT.e[2]/AT.M.n*100,0))} %</b>.</p><p><b>b)</b> ${AT.e.slice(AT.s-1).join(" + ")} = <b>${sum(AT.e.slice(AT.s-1))} clients</b>.</p><p><b>2)</b></p><p class="calc" style="white-space:normal">${AT.M.ch()}<br>M ${eq(AT.M.m,rd(AT.M.m,2))} ${N(rd(AT.M.m,2))}</p><p>${AT.M.m>3?`${N(rd(AT.M.m,2))} min &gt; 3 min : il doit <b>ouvrir une caisse</b>.`:`${N(rd(AT.M.m,2))} min &lt; 3 min : il <b>n'a pas besoin</b> d'ouvrir une caisse.`}</p>`},
  {n:"Exercice 4", t:"Vente de macarons", w:"Sur ton cahier", h:`<p>Voici le nombre de macarons vendus une semaine par une boutique (extrait de tableur) :</p>${tab(["","A","B","C","D","E","F","G","H","I"],[["1","",...MAC.j,"Total"],["2","Macarons vendus",...MAC.v.map(String),""]])}<p><b>1)</b> Quelle formule faut-il saisir en I2 pour calculer le total ?</p><p><b>2)</b> Calcule le nombre moyen de macarons vendus par jour (arrondi à l'unité).</p><p><b>3)</b> Quel est le nombre médian ? Justifie.</p><p><b>4)</b> Calcule l'étendue de la série.</p>`,
   c:`<p><b>1)</b> <b>=SOMME(B2:H2)</b>.</p><p><b>2)</b> {${N(sum(MAC.v))}/7} ${eq(sum(MAC.v)/7,Math.round(sum(MAC.v)/7))} <b>${Math.round(sum(MAC.v)/7)}</b>.</p><p><b>3)</b></p>${medList(MAC.v).txt}<p><b>4)</b> ${Math.max(...MAC.v)} − ${Math.min(...MAC.v)} = <b>${Math.max(...MAC.v)-Math.min(...MAC.v)}</b>.</p>`}
 ]},
 {t:"La médiane", e:[
  {n:"Exercice 5", t:"Au bowling", w:"Sur ton cahier", h:`<p><b>Équipe 1 :</b> ${BW1.join(" – ")}</p><p><b>Équipe 2 :</b> ${BW2.join(" – ")}</p><p>Pour chaque équipe, calcule la médiane des scores.</p>`,
   c:`<p><b>Équipe 1 :</b></p>${medList(BW1).txt}<p><b>Équipe 2 :</b></p>${medList(BW2).txt}`},
  {n:"Exercice 6", t:"Poids des cartables", w:"Sur ton cahier", h:`<p>On a pesé le cartable de ${sum(CART.e)} élèves :</p>${te(["Poids (en kg)",...CART.vals.map(String)],["Effectifs",...CART.e.map(String)])}<p>Calcule le poids médian d'un cartable.</p>`,
   c:medTab(CART.vals,CART.e," kg").txt},
  {n:"Exercice 7", t:"Temps médian d'attente", w:"Sur ton cahier", h:`<p>On reprend le diagramme de l'exercice 3.</p>${batons({vals:["1","2","3","4","5","6","7"], eff:AT.e, xlab:"Temps d'attente (en min)", ymax:Math.max(...AT.e)+1, ystep:1, ylabStep:2, w:420, H:270})}<p>Calcule le temps médian d'attente. Interprète ce résultat.</p>`,
   c:(()=>{ const r=medTab([1,2,3,4,5,6,7],AT.e," min"); return `${r.txt}<p>Au moins la moitié des clients ont attendu ${N(r.m)} min ou moins, et au moins la moitié ${N(r.m)} min ou plus.</p>`; })()},
  {n:"Exercice 8", t:"Moyenne et médiane des salaires", w:"Sur ton cahier", h:`${tab(["","Débutants","Employés","Ouvriers spécialisés","Cadres","Patron"],[["Salaire mensuel (en €)",...SAL.vals.map(v=>N(v))],["Effectifs",...SAL.e.map(String)]])}<p><b>1)</b> Calcule le salaire moyen.</p><p><b>2)</b> Calcule le salaire médian.</p><p><b>3)</b> Explique l'écart entre les deux.</p>`,
   c:(()=>{ const r=medTab(SAL.vals,SAL.e," €"); return `<p><b>1)</b></p><p class="calc" style="white-space:normal">${SAL.M.ch()}<br>M = <b>${N2(SAL.M.m)} €</b></p><p><b>2)</b></p>${r.txt}<p><b>3)</b> Les salaires élevés des cadres et du patron font augmenter la moyenne, mais pas la médiane.</p>`; })()}
 ]},
 {t:"Séries regroupées en classes et histogrammes", e:[
  {n:"Exercice 9", t:"Les moutons des communes", w:"Sur ton cahier", h:`<p>Voici le nombre de moutons dans 12 communes :</p>${te(["Commune",..."ABCDEFGHIJKL"],["Moutons",...MOU.map(String)])}<p><b>a)</b> Regroupe les données en classes d'amplitude 5 (0 ≤ n &lt; 5 ; 5 ≤ n &lt; 10 ; 10 ≤ n &lt; 15).</p><p><b>b)</b> Combien de communes ont au moins 5 moutons ?</p><p><b>c)</b> Représente les données par un histogramme.</p>`,
   c:(()=>{ const e=cls(MOU,0,5,3); return `<p><b>a)</b></p>${te(["Nombre n de moutons","0 ≤ n &lt; 5","5 ≤ n &lt; 10","10 ≤ n &lt; 15"],["Communes",...e.map(String)])}<p><b>b)</b> ${e[1]} + ${e[2]} = <b>${e[1]+e[2]} communes</b>.</p><p><b>c)</b></p>${histo({b:[0,5,10,15], eff:e, xlab:"Nombre de moutons", ylab:"Communes", ymax:Math.max(...e)+1, ystep:1, w:340, H:260, show:true})}`; })()},
  {n:"Exercice 10", t:"Histogramme et précipitations", w:"Sur ton cahier", h:`<p>Représente par un histogramme ces précipitations P, en mm :</p>${te(["P",...[0,1,2,3].map(i=>`${i*PRE.w} ≤ P &lt; ${(i+1)*PRE.w}`)],["Effectif",...PRE.e.map(String)])}`,
   c:histo({b:[0,1,2,3,4].map(i=>i*PRE.w), eff:PRE.e, xlab:"Précipitations P (en mm)", ymax:Math.max(...PRE.e)+1, ystep:1, ylabStep:2, w:400, show:true})},
  {n:"Exercice 11", t:"Calibre de noix", w:"Sur ton cahier", h:`<p>Voici le calibre, en mm, de 30 noix :</p><p class="calc" style="white-space:normal">${NX.v.join(" ; ")}</p><p><b>a)</b> Regroupe les calibres en classes d'amplitude 2 mm, de 28 à 38 mm.</p><p><b>b)</b> Combien de noix ont un calibre au moins égal à 32 mm ?</p>`,
   c:`<p><b>a)</b></p>${te(["Calibre c","28 ≤ c &lt; 30","30 ≤ c &lt; 32","32 ≤ c &lt; 34","34 ≤ c &lt; 36","36 ≤ c &lt; 38"],["Effectif",...NX.e.map(String)])}<p><b>b)</b> ${NX.e.slice(2).join(" + ")} = <b>${sum(NX.e.slice(2))} noix</b>.</p>`}
 ]},
 {t:"Exercices de révision", e:[
  {n:"Exercice 12", t:"Température", w:"Sur ton cahier", h:`<p>Un médecin a relevé les températures, en °C, de ${TEMP.length} patients :</p><p class="calc">${TEMP.map(x=>N(x)).join(" / ")}</p><p><b>1)</b> Calcule la température moyenne (arrondie au dixième).</p><p><b>2)</b> Détermine la température médiane.</p><p><b>3)</b> Calcule l'étendue.</p>`,
   c:`<p><b>1)</b></p>${moyC(TEMP)}<p>La température moyenne est ${eq(sum(TEMP)/TEMP.length,rd(sum(TEMP)/TEMP.length,1))==="="?"de":"d'environ"} <b>${N(rd(sum(TEMP)/TEMP.length,1))} °C</b>.</p><p><b>2)</b></p>${medList(TEMP).txt}<p><b>3)</b> ${N(Math.max(...TEMP))} − ${N(Math.min(...TEMP))} = <b>${N(rd(Math.max(...TEMP)-Math.min(...TEMP),1))} °C</b>.</p>`},
  {n:"Exercice 13", t:"Livres lus", w:"Sur ton cahier", h:`<p>${LIV.length} élèves ont dit combien de livres ils ont lus cette année :</p><p class="calc">${LIV.join(" – ")}</p><p>Calcule l'étendue, la moyenne (arrondie au dixième) et la médiane de cette série. Interprète la médiane.</p>`,
   c:(()=>{ const r=medList(LIV); return `<p><b>Étendue :</b> ${Math.max(...LIV)} − ${Math.min(...LIV)} = <b>${Math.max(...LIV)-Math.min(...LIV)}</b>.</p><p><b>Moyenne :</b></p>${moyC(LIV)}<p><b>Médiane :</b></p>${r.txt}<p>Au moins la moitié des élèves ont lu ${N(r.m)} livres ou moins, et au moins la moitié ${N(r.m)} livres ou plus.</p>`; })()}
 ]}
];
};
