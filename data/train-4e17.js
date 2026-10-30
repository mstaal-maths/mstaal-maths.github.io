/* 4e · chapitre 17 — fiche d'entraînement : les exercices de M. Staal (vocabulaire, tableaux d'effectifs,
   diagrammes, moyennes) avec d'autres données. Diagrammes et corrections calculés à partir des mêmes valeurs (window.ST17). */
TRAIN["4e-17"] = function(){
const {ri, pick, shuf, distinct} = TR;
const {bars,pie,tab,N,F,sum,rd,eq,pond,ymaxOf,gcd} = window.ST17;
const cnt=(arr,vals)=>vals.map(v=>arr.filter(x=>x===v).length);
/* n entiers entre lo et hi de somme tot */
const split=(n,tot,lo,hi)=>{ for(let g=0;g<5000;g++){ const v=[]; for(let i=0;i<n-1;i++) v.push(ri(lo,hi)); const l=tot-sum(v); if(l>=lo&&l<=hi) return [...v,l]; } return null; };

/* ===== A. Vocabulaire et tableau d'effectifs ===== */
const A1=(()=>{ const T=pick([20,25,50]), vals=pick([[11,12,13,14],[12,13,14,15,16],[1,2,3,4],[0,1,2,3,4]]); let e; do{ e=split(vals.length,T,1,Math.ceil(T/2)); }while(!e);
  const list=shuf(vals.flatMap((v,i)=>Array(e[i]).fill(v))); const ctx=vals[0]>=11?["les élèves d'un club de sport","l'âge (en ans)"]:["les familles d'un immeuble","le nombre d'enfants"]; return {T,vals,e,list,ctx}; })();
const A2=(()=>{ const T=pick([40,80,200]); let e; do{ e=split(4,T,Math.round(T/20),Math.round(T/2)); }while(!e||e.some(x=>(x*1000/T)%5)); return {T,e}; })();
const MET=["Programmeurs","Électroniciens","Infographistes","Commerciaux"];

/* ===== B. Diagrammes ===== */
const SP=["Foot","Danse","Tennis","Judo","Rugby","Gym"];
const B3=(()=>{ const T=pick([20,24,30,36]); let e; do{ e=split(6,T,1,Math.ceil(T/3)); }while(!e); return {T,e,k:360/T}; })();

/* ===== C. Moyenne d'une série ===== */
const mean=(n,lo,hi)=>{ let v; do{ v=Array.from({length:n},()=>ri(lo,hi)); }while(sum(v)%n); return v; };
const C4=mean(7,3,19), C5=mean(7,25,110), C6=mean(12,52,68);

/* ===== D. Tableau d'effectifs ===== */
const D7=(()=>{ for(;;){ const m=pick([[10,15,20],[12,15,20],[5,10,25],[12,18,24]]), e=[ri(2,8),ri(2,8),ri(2,8)], t=sum(e), s=e[0]*m[0]+e[1]*m[1]+e[2]*m[2]; if(t<10||t>20) continue; if(Math.abs(rd(s/t,2)-s/t)>1e-9) continue;
  const list=shuf(m.flatMap((v,i)=>Array(e[i]).fill(v))); return {m,e,t,s,list}; } })();
const D8=(()=>{ for(;;){ const a=ri(11,14), vals=[a,a+1,a+2,a+3,a+4], e=vals.map(()=>ri(1,7)), t=sum(e), s=e.reduce((x,n,i)=>x+n*vals[i],0); if(Math.abs(rd(s/t,2)-s/t)>1e-9) continue; return {vals,e,t,s}; } })();
const D9=(()=>{ const vals=[pick([1200,1300,1400]),pick([1600,1700,1800]),pick([2100,2400,2600]),pick([3200,3500]),pick([6000,7500,8000])], e=[ri(30,60),ri(15,30),ri(8,20),ri(4,12),ri(1,3)], t=sum(e), s=e.reduce((x,n,i)=>x+n*vals[i],0); return {vals,e,t,s}; })();

/* ===== E. Diagrammes et moyenne ===== */
const E10=(()=>{ for(;;){ const e=Array.from({length:7},()=>ri(0,6)), t=sum(e), s=e.reduce((x,n,i)=>x+n*i,0); if(t<15||e[0]===0||Math.abs(rd(s/t,2)-s/t)>1e-9) continue; return {e,t,s,q:ri(1,6)}; } })();
const E11=(()=>{ let v; do{ v=Array.from({length:12},()=>ri(3,19)); }while(sum(v)%6||new Set(v).size<5||v.filter(x=>x===Math.max(...v)).length>1); return v; })();
const JOURS=["Lun.","Mar.","Mer.","Jeu.","Ven.","Sam.","Dim."], JN=["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"];
const E12=(()=>{ let v; do{ v=Array.from({length:7},()=>ri(0,18)); }while(v.filter(x=>x===Math.max(...v)).length>1||v.filter(x=>x===Math.min(...v)).length>1||sum(v)%7===0); const claim=Math.max(1,Math.round(sum(v)/7)+pick([1,2,-1,-2])); return {v,claim}; })();

return [
 {t:"Vocabulaire et tableau d'effectifs", e:[
  {n:"Exercice 1", t:"Une enquête", w:"Sur ton cahier", h:`<p>On a interrogé ${A1.ctx[0]} sur ${A1.ctx[1]}. Voici leurs réponses :</p><p class="calc" style="white-space:normal">${A1.list.join(" – ")}</p>
   <p><b>1)</b> Quelle est la population étudiée ? Quel est le caractère étudié ? Quelles sont les valeurs ?</p><p><b>2)</b> a) Construis un tableau d'effectifs.</p><p>b) Ajoute une ligne avec la fréquence de chaque valeur sous forme fractionnaire.</p><p>c) Ajoute une dernière ligne avec la fréquence de chaque valeur en pourcentage.</p>`,
   c:`<p><b>1)</b> Population : ${A1.ctx[0]}. Caractère : ${A1.ctx[1]}. Valeurs : ${A1.vals.join(", ")}.</p><p><b>2)</b></p>${tab(["Valeurs",...A1.vals.map(String),"Total"],[["Effectifs",...A1.e.map(String),String(A1.T)],["Fréquences",...A1.e.map(n=>F(n,A1.T)),`${F(A1.T,A1.T)} = 1`],["Fréquences (en %)",...A1.e.map(n=>N(n*100/A1.T)),"100"]])}<p>Par exemple, pour la valeur ${A1.vals[0]} :</p><p class="calc">f = ${F(A1.e[0],A1.T)}<br>f = ${N(A1.e[0]/A1.T)}<br>f = ${N(A1.e[0]*100/A1.T)} %</p><p>On vérifie : ${A1.e.map(n=>N(n*100/A1.T)).join(" + ")} = 100.</p>`},
  {n:"Exercice 2", t:"Les employés d'une entreprise", w:"Sur ton cahier", h:`<p>Une entreprise emploie ${A2.e[0]} programmeurs, ${A2.e[1]} électroniciens, ${A2.e[2]} infographistes et ${A2.e[3]} commerciaux.</p><p>a) Calcule l'effectif total. Que représente-t-il ?</p><p>b) Construis un tableau donnant l'effectif et la fréquence (en %) de chaque métier.</p>`,
   c:`<p>a) ${A2.e.join(" + ")} = ${A2.T} : c'est le nombre d'employés de l'entreprise.</p><p>b)</p>${tab(["Métier","Effectifs","Fréquence (en %)"],[...MET.map((m,i)=>[m,String(A2.e[i]),N(A2.e[i]*100/A2.T)]),["Total",String(A2.T),"100"]])}<p>Par exemple, pour les programmeurs :</p><p class="calc">f = ${F(A2.e[0],A2.T)}<br>f = ${N(A2.e[0]/A2.T,4)}<br>f = ${N(A2.e[0]*100/A2.T)} %</p>`}
 ]},
 {t:"Diagrammes en bâtons et diagrammes circulaires", e:[
  {n:"Exercice 3", t:"Construire un diagramme en bâtons et un diagramme circulaire", w:"Sur ton cahier", h:`<p>On a interrogé des élèves sur leur sport préféré.</p>${tab(["Valeurs",...SP,"Total"],[["Effectif",...B3.e.map(String),String(B3.T)]])}<p><b>1)</b> Représente ces données dans un diagramme en bâtons (sports en abscisse, effectifs en ordonnée), avec un titre et le nom des axes.</p><p><b>2)</b> Représente ces données dans un diagramme circulaire, avec un titre et une légende.</p>`,
   c:`<p><b>1)</b></p>${bars({cats:SP, vals:B3.e, title:"Sport préféré des élèves", ylab:"Effectifs", xlab:"Sports", ymax:ymaxOf(B3.e,1), ystep:1, ylabStep:ymaxOf(B3.e,1)>10?2:1, w:520, H:320})}
   <p><b>2)</b> 360 ÷ ${B3.T} = ${B3.k} : un élève correspond à ${B3.k}°.</p>${tab(["Valeurs",...SP,"Total"],[["Effectifs",...B3.e.map(String),String(B3.T)],["Degrés",...B3.e.map(n=>`<b>${n*B3.k}</b>`),"360"]])}<p>On vérifie que ${B3.e.map(n=>n*B3.k).join(" + ")} = 360.</p>
   ${pie({vals:B3.e, title:"Sport préféré des élèves", lab:i=>[SP[i], B3.e[i]*B3.k+"°"]})}`}
 ]},
 {t:"Moyenne d'une série statistique", e:[
  {n:"Exercice 4", t:"Moyenne en technologie", w:"Sur ton cahier", h:`<p>Voici les notes (sur 20) d'un élève en technologie ce trimestre :</p><p class="calc">${C4.join(" ; ")}</p><p>Calcule sa moyenne trimestrielle.</p>`,
   c:`<p class="calc">M = {${C4.join(" + ")}/7}<br>M = {${sum(C4)}/7}<br>M = ${sum(C4)/7}</p><p>Sa moyenne est de <b>${sum(C4)/7} sur 20</b>.</p>`},
  {n:"Exercice 5", t:"Les SMS", w:"Sur ton cahier", h:`<p>Voici le nombre de SMS envoyés par Nolly chaque jour d'une semaine :</p>${tab(["Jour",...JOURS],[["SMS",...C5.map(String)]])}<p><b>1)</b> Combien de SMS a-t-elle envoyés dans la semaine ?</p><p><b>2)</b> Combien de SMS envoie-t-elle en moyenne par jour ?</p>`,
   c:`<p><b>1)</b> ${C5.join(" + ")} = <b>${sum(C5)} SMS</b>.</p><p><b>2)</b> {${sum(C5)}/7} = ${sum(C5)/7} : en moyenne <b>${sum(C5)/7} SMS par jour</b>.</p>`},
  {n:"Exercice 6", t:"Une douzaine d'œufs", w:"Sur ton cahier", h:`<p>Voici les masses (en g) des œufs d'une boîte de douze :</p><p class="calc" style="white-space:normal">${C6.join(" ; ")}</p><p><b>1)</b> Quelle est la masse totale des œufs ?</p><p><b>2)</b> Quelle est la masse moyenne d'un œuf ?</p>`,
   c:`<p><b>1)</b> ${C6.join(" + ")} = <b>${sum(C6)} g</b>.</p><p><b>2)</b> {${sum(C6)}/12} = ${sum(C6)/12} : la masse moyenne d'un œuf est de <b>${sum(C6)/12} g</b>.</p>`}
 ]},
 {t:"Moyenne à partir d'un tableau d'effectifs", e:[
  {n:"Exercice 7", t:"Des sacs de terreau", w:"Sur ton cahier", h:`<p>Voici la masse (en kg) des sacs commandés à une jardinerie :</p><p class="calc" style="white-space:normal">${D7.list.join(" – ")}</p><p><b>1)</b> Construis le tableau d'effectifs.</p><p><b>2)</b> Combien y a-t-il de commandes ?</p><p><b>3)</b> Calcule la masse moyenne d'une commande.</p>`,
   c:`<p><b>1)</b></p>${tab(["Masse du sac (kg)",...D7.m.map(String)],[["Nombre de commandes",...D7.e.map(String)]])}<p><b>2)</b> ${D7.e.join(" + ")} = ${D7.t} commandes.</p><p><b>3)</b></p><p class="calc">M = ${pond(D7.m,D7.e)}<br>M = {${D7.s}/${D7.t}}<br>M = ${N(D7.s/D7.t)}</p><p>La masse moyenne d'une commande est de <b>${N(D7.s/D7.t)} kg</b>.</p>`},
  {n:"Exercice 8", t:"L'âge des participants", w:"Sur ton cahier", h:`<p>Voici l'âge des participants à un stage :</p>${tab(["Âge (en ans)",...D8.vals.map(String)],[["Effectif",...D8.e.map(String)]])}<p><b>1)</b> Quel est l'effectif total ?</p><p><b>2)</b> Calcule l'âge moyen d'un participant.</p>`,
   c:`<p><b>1)</b> ${D8.e.join(" + ")} = ${D8.t}.</p><p><b>2)</b></p><p class="calc">M = ${pond(D8.vals,D8.e)}<br>M = {${D8.s}/${D8.t}}<br>M = ${N(D8.s/D8.t)}</p><p>L'âge moyen est de <b>${N(D8.s/D8.t)} ans</b>.</p>`},
  {n:"Exercice 9", t:"Les salaires d'une PME", w:"Sur ton cahier", h:`<p>Voici les salaires mensuels (en €) des employés d'une PME :</p>${tab(["Salaire (en €)",...D9.vals.map(x=>N(x))],[["Effectif",...D9.e.map(String)]])}<p><b>1)</b> Quel est l'effectif de cette PME ?</p><p><b>2)</b> Calcule le salaire moyen, arrondi à l'euro.</p>`,
   c:`<p><b>1)</b> ${D9.e.join(" + ")} = ${D9.t}.</p><p><b>2)</b></p><p class="calc">M = ${pond(D9.vals,D9.e)}<br>M = {${N(D9.s)}/${D9.t}}<br>M ${Number.isInteger(D9.s/D9.t)?"=":"≈"} ${N(D9.s/D9.t,0)}</p><p>Le salaire moyen est d'environ <b>${N(D9.s/D9.t,0)} €</b>.</p>`}
 ]},
 {t:"Moyenne à partir d'un diagramme", e:[
  {n:"Exercice 10", t:"Les spams", w:"Sur ton cahier", h:`<p>Voici le nombre de spams reçus hier par les élèves d'une classe :</p>${bars({cats:["0","1","2","3","4","5","6"], vals:E10.e, title:"Nombre de spams reçus", ylab:"Nombre d'élèves", xlab:"Nombre de spams", ymax:7, ystep:1, ylabStep:1, w:500, H:300})}
   <p><b>1)</b> a) Combien d'élèves n'ont pas reçu de spam ?</p><p>b) Combien d'élèves ont reçu exactement ${E10.q} spam${E10.q>1?"s":""} ?</p><p>c) Combien d'élèves ont répondu ?</p><p><b>2)</b> a) Combien de spams ont-ils reçus en tout ?</p><p>b) Calcule le nombre moyen de spams reçus par élève.</p>`,
   c:`<p><b>1)</b> a) ${E10.e[0]} élèves. b) ${E10.e[E10.q]} élève${E10.e[E10.q]>1?"s":""}. c) ${E10.e.join(" + ")} = ${E10.t} élèves.</p><p><b>2)</b> a) ${E10.e.map((n,i)=>`${n} × ${i}`).join(" + ")} = ${E10.s} spams.</p><p>b) {${E10.s}/${E10.t}} = ${N(E10.s/E10.t)} : en moyenne <b>${N(E10.s/E10.t)} spams</b> par élève.</p>`},
  {n:"Exercice 11", t:"Les notes de Mathieu", w:"Sur ton cahier", h:`<p>Voici les notes (sur 20) de Mathieu aux 12 devoirs de l'année :</p>${bars({cats:E11.map((_,i)=>String(i+1)), vals:E11, title:"Notes de Mathieu", ylab:"Note sur 20", xlab:"Numéro du devoir", ymax:20, ystep:1, ylabStep:2, w:540, H:330})}<p><b>1)</b> À quel devoir Mathieu a-t-il eu sa meilleure note ?</p><p><b>2)</b> Calcule sa moyenne.</p>`,
   c:`<p><b>1)</b> Au devoir n° ${E11.indexOf(Math.max(...E11))+1} (${Math.max(...E11)} sur 20).</p><p><b>2)</b></p><p class="calc">M = {${E11.join(" + ")}/12}<br>M = {${sum(E11)}/12}<br>M = ${N(sum(E11)/12)}</p><p>Sa moyenne est de <b>${N(sum(E11)/12)} sur 20</b>.</p>`},
  {n:"Exercice 12", t:"La pluie de la semaine", w:"Sur ton cahier", h:`${bars({cats:JOURS, vals:E12.v, title:"Précipitations de la semaine", ylab:"Hauteur de pluie (mm)", ymax:ymaxOf(E12.v), ystep:1, ylabStep:2, w:520, H:300})}<p><b>1)</b> Quel a été le jour le plus pluvieux ? le moins pluvieux ?</p><p><b>2)</b> Un voisin affirme qu'il a plu en moyenne ${E12.claim} mm par jour. A-t-il raison ?</p>`,
   c:`<p><b>1)</b> Le plus pluvieux : le ${JN[E12.v.indexOf(Math.max(...E12.v))]} (${Math.max(...E12.v)} mm). Le moins pluvieux : le ${JN[E12.v.indexOf(Math.min(...E12.v))]} (${Math.min(...E12.v)} mm).</p>
   <p><b>2)</b> S'il avait plu ${E12.claim} mm chaque jour, il serait tombé ${E12.claim} × 7 = ${E12.claim*7} mm. Or il est tombé ${E12.v.join(" + ")} = ${sum(E12.v)} mm. Le voisin a <b>tort</b>.</p><p>La vraie moyenne est ${sum(E12.v)} ÷ 7 ≈ ${N(sum(E12.v)/7,2)} mm par jour.</p>`}
 ]}
];
};
