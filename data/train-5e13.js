/* 5e · chapitre 13 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres.
   Les diagrammes et les corrections sont produits à partir des mêmes valeurs. */
TRAIN["5e-13"] = function(){
const {ri, pick, shuf, distinct} = TR;
const {bars, pie, line, tab, N, F, irr, gcd, sum, KC} = window.STAT13;
/* n entiers entre lo et hi, de somme tot */
const split = (n, tot, lo, hi, fb) => { for(let g=0; g<3000; g++){ const v=[]; for(let i=0;i<n-1;i++) v.push(ri(lo,hi)); const l=tot-sum(v); if(l>=lo && l<=hi) return [...v, l]; } return fb; };
const uniqMax = v => v.filter(x=>x===Math.max(...v)).length===1;
const uniqMin = v => v.filter(x=>x===Math.min(...v)).length===1;

/* ===== Activité 1 : recueillir des données ===== */
const A1 = (()=>{ const tot=pick([20,24,30]); const v=split(4,tot,2,Math.round(tot/2),tot===20?[8,4,5,3]:tot===24?[9,4,7,4]:[11,5,9,5]); /* bus, vélo, pied, voiture */
  const L=shuf([..."BVPT"].flatMap((l,i)=>Array(v[i]).fill(l))); const rows=[]; for(let i=0;i<L.length;i+=tot===24?8:10) rows.push(L.slice(i,i+(tot===24?8:10)));
  return {tot, v, rows}; })();
const HEAD1 = ["Moyen de transport","Bus","Vélo","À pied","Voiture","Total"];

/* ===== Exercice 1 : fréquences ===== */
const E1 = (()=>{ const t=pick([20,25,50]); return {t, v:split(4,t,1,Math.round(t/2),t===20?[4,9,5,2]:t===25?[5,11,6,3]:[10,22,12,6])}; })();

/* ===== Exercice 2 : fréquences et comparaison ===== */
const E2 = (()=>{ const n=pick([20,24,28,32,36,40]); const P=[10,20,25,30,40,50,60,70,75,80,90].filter(p=>n*p%100===0);
  const p=shuf(P).slice(0,3); let M, m; do{ M=pick([20,25,30,50]); m=ri(1,M-1); }while(m*100%M!==0 || m*100/M===p[0]);
  return {n, p, k:p.map(x=>n*x/100), M, m, q:m*100/M}; })();
const CAR = ["portent des lunettes","ont les cheveux bruns","sont nés avant juillet"];

/* ===== Exercice 3 : lire un diagramme en barres ===== */
const JOURS = ["Lundi","Mardi","Jeudi","Vendredi"];
const E3 = (()=>{ for(let g=0; g<3000; g++){ const T=pick([20,25,40,50]), ven=ri(2,5), k=ri(2,3), im=ri(0,2), mx=k*ven; const r=T-ven-mx;
    const o=[0,1,2].filter(i=>i!==im); const a=ri(1,mx-1), b=r-a; if(b<1||b>=mx||a===ven&&false) continue;
    const v=[0,0,0,ven]; v[im]=mx; v[o[0]]=a; v[o[1]]=b; return {T, v, im, k}; }
  return {T:40, v:[12,8,15,5], im:2, k:3}; })();
const E3o = {cats:JOURS, vals:E3.v, title:"Livres empruntés au CDI", ylab:"Nombre de livres", ymax:Math.ceil((Math.max(...E3.v)+1)/2)*2, ystep:1, ylabStep:2};

/* ===== Exercice 4 : construire un diagramme en barres ===== */
const SP = ["Football","Basket","Judo","Danse"];
const E4 = distinct(4, ()=>2*ri(1,7), x=>x);

/* ===== Exercice 5 : construire un diagramme circulaire ===== */
const PLATS = ["Poisson","Viande","Végétarien","Œufs"];
const E5 = (()=>{ const t=pick([12,18,20,24,30,36,40]); return {t, k:360/t, v:split(4,t,Math.ceil(t/12),t,[1,1,1].map(()=>Math.floor(t/4)).concat([t-3*Math.floor(t/4)]))}; })();

/* ===== Exercice 6 : lire un diagramme circulaire ===== */
const TR6 = ["Bus","Vélo","À pied","Voiture"];
const E6 = (()=>{ const n=pick([200,300,400,500,600]); let p; do{ p=split(4,20,2,8,[8,3,5,4]).map(x=>x*5); }while(!uniqMax(p)||!uniqMin(p)); return {n, p}; })();
const im6 = E6.p.indexOf(Math.max(...E6.p)), in6 = E6.p.indexOf(Math.min(...E6.p)), pv = E6.p[1]+E6.p[2];

/* ===== Exercice 7 : lire un graphique cartésien ===== */
const E7 = (()=>{ const im=ri(3,5); let y; do{ let t=ri(4,9); y=[t]; for(let i=1;i<7;i++){ t += i<=im ? ri(1,4) : -ri(1,3); y.push(t); } }while(Math.min(...y)<1); return {y, im}; })();
const H7 = [6,8,10,12,14,16,18], q7 = shuf([0,1,2,3,4,5,6].filter(i=>i!==E7.im)).slice(0,2).sort((a,b)=>a-b);
const E7o = {xs:H7, ys:E7.y, title:"Températures relevées à Cholet", xlab:"Heure (h)", ylab:"Température (°C)", xmax:20, xstep:2, ymax:Math.ceil((Math.max(...E7.y)+1)/2)*2, ystep:1, ylabStep:2};

/* ===== Exercice 8 : construire un graphique cartésien ===== */
const E8 = (()=>{ let t=ri(1,3); const y=[t]; for(let i=1;i<5;i++){ t+=ri(1,4); y.push(t); } return y; })();

/* ===== Exercice 9 : choisir une représentation ===== */
const SIT = {
  "graphique cartésien":["l'évolution de la population d'une ville de 1950 à 2020","la température relevée toutes les deux heures pendant une journée","la taille d'une plante mesurée chaque semaine"],
  "diagramme en barres":["la comparaison du nombre de médailles de 5 pays aux Jeux olympiques","la comparaison du nombre de livres empruntés au CDI selon les jours"],
  "diagramme circulaire":["la répartition du budget d'une famille (logement, nourriture, loisirs, autres)","la répartition des élèves d'un collège selon leur moyen de transport","la répartition des plats choisis à la cantine"]
};
const WHY = {"graphique cartésien":"on suit une évolution","diagramme en barres":"on compare des effectifs","diagramme circulaire":"on montre la répartition d'un tout"};
const E9 = shuf(Object.keys(SIT)).map(k=>[pick(SIT[k]), k]);

/* ===== Exercice 10 : moyennes ===== */
const intMean = n => { let v; do{ v=Array.from({length:n},()=>ri(3,18)); }while(sum(v)%n); return v; };
const M10 = [intMean(5), intMean(5),
  (()=>{ let v; do{ v=Array.from({length:4},()=>ri(140,170)); }while(sum(v)%4); return v; })(),
  (()=>{ let v; do{ v=Array.from({length:4},()=>ri(3,14)/2); }while(!Number.isInteger(sum(v))); return v; })()];
const mLine = (v,u="",d=1) => KC("M",[`(${v.map(x=>N(x/d)).join(" + ")}) ÷ ${v.length}`,`${N(sum(v)/d)} ÷ ${v.length}`,`<b>${N(sum(v)/d/v.length,4)}${u}</b>`]);

/* ===== Exercice 11 : températures de la semaine ===== */
const E11 = (()=>{ let v; do{ v=Array.from({length:7},()=>ri(8,24)); }while(sum(v)%7===0); return v; })();

/* ===== Exercice 12 : raisonner avec la moyenne ===== */
const E12 = (()=>{ let a,b,c,m,x; do{ a=ri(6,18); b=ri(6,18); c=ri(6,18); m=ri(10,14); x=4*m-a-b-c; }while(x<0||x>20); return {a,b,c,m,x}; })();
const mA = (ri(110,140)/10), mB = mA - ri(3,9)/10;

return [
 {t:"Effectifs et fréquences", e:[
  {n:"Activité 1", t:"Recueillir et organiser des données", w:"Sur ton cahier", h:`<p>On a demandé à ${A1.tot} élèves comment ils viennent au collège.</p><p><b>B</b> = bus ; <b>V</b> = vélo ; <b>P</b> = à pied ; <b>T</b> = voiture.</p>
   <div class="scroll"><table class="std"><tbody>${A1.rows.map(r=>`<tr>${r.map(l=>`<td><b>${l}</b></td>`).join("")}</tr>`).join("")}</tbody></table></div>
   <p><b>1)</b> Recopie et complète le tableau des effectifs.</p>${tab(HEAD1,[["Effectif","","","","",""]])}<p><b>2)</b> Quelle est la fréquence du bus ? Écris-la sous forme d'une fraction irréductible.</p>`,
   c:`<p><b>1)</b></p>${tab(HEAD1,[["Effectif",...A1.v.map(String),String(A1.tot)]])}<p><b>2)</b> Fréquence du bus : ${F(A1.v[0],A1.tot)}${gcd(A1.v[0],A1.tot)>1?` = ${irr(A1.v[0],A1.tot)} (on divise ${A1.v[0]} et ${A1.tot} par ${gcd(A1.v[0],A1.tot)})`:" (déjà irréductible)"}.</p>`},
  {n:"Exercice 1", t:"Calculer des fréquences", w:"Sur ton cahier", h:`<p>On a interrogé ${E1.t} élèves sur le nombre de frères et sœurs qu'ils ont. Recopie et complète le tableau.</p>
   ${tab(["Nombre de frères et sœurs","0","1","2","3","Total"],[["Effectif",...E1.v.map(String),""],["Fréquence (fraction)","","","","",""],["Fréquence (nombre décimal)","","","","",""],["Fréquence (pourcentage)","","","","",""]])}<p>Vérifie que la somme des fréquences en pourcentage vaut 100 %.</p>`,
   c:`${tab(["Nombre de frères et sœurs","0","1","2","3","Total"],[["Effectif",...E1.v.map(String),String(E1.t)],["Fréquence (fraction)",...E1.v.map(x=>F(x,E1.t)),"1"],["Fréquence (nombre décimal)",...E1.v.map(x=>N(x/E1.t)),"1"],["Fréquence (pourcentage)",...E1.v.map(x=>N(x*100/E1.t)+" %"),"100 %"]])}
   <p>${E1.v.map(x=>N(x*100/E1.t)).join(" + ")} = 100 : la somme des fréquences est bien 100 %.</p>`},
  {n:"Exercice 2", t:"Fréquences et comparaison", w:"Sur ton cahier", h:`<p>Dans une classe de ${E2.n} élèves, ${E2.k.map((k,i)=>`${k} ${CAR[i]}`).join(", ").replace(/, ([^,]*)$/," et $1")}.</p>
   <p><b>a)</b> Calcule la fréquence de chaque caractéristique sous forme de fraction irréductible, puis en pourcentage.</p><p><b>b)</b> Dans une autre classe, ${E2.m} ${E2.m===1?"élève":"élèves"} sur ${E2.M} ${E2.m===1?"porte":"portent"} des lunettes. Dans quelle classe la proportion d'élèves qui portent des lunettes est-elle la plus grande ?</p>`,
   c:`<p>Fréquence f = ${F("effectif","effectif total")}. On simplifie la fraction, puis on l'écrit en pourcentage.</p>${E2.k.map((k,i)=>`<p>${i?"":"<b>a)</b> "}${["Lunettes","Cheveux bruns","Nés avant juillet"][i]} :</p>${KC("f",[F(k,E2.n),irr(k,E2.n),E2.p[i]+" %"])}`).join("")}
   <p><b>b)</b> Dans l'autre classe :</p>${KC("f",[F(E2.m,E2.M),N(E2.q/100),E2.q+" %"])}<p>${E2.q>E2.p[0]?`${E2.q} % &gt; ${E2.p[0]} % : la proportion est plus grande dans l'autre classe.`:`${E2.q} % &lt; ${E2.p[0]} % : la proportion est plus grande dans la première classe.`}</p>`}
 ]},
 {t:"Lire et construire des représentations", e:[
  {n:"Exercice 3", t:"Lire un diagramme en barres", w:"Sur ton cahier", h:`<p>Le diagramme donne le nombre de livres empruntés au CDI selon les jours de la semaine.</p>${bars(E3o)}
   <p><b>a)</b> Combien de livres ont été empruntés le ${JOURS[E3.im===0?1:0].toLowerCase()} ? le vendredi ?</p><p><b>b)</b> Quel jour y a-t-il eu le plus d'emprunts ? Combien de fois plus que le vendredi ?</p><p><b>c)</b> Quel est le nombre total de livres empruntés ? Calcule la fréquence du lundi en pourcentage.</p>`,
   c:`<p><b>a)</b> ${JOURS[E3.im===0?1:0]} : ${E3.v[E3.im===0?1:0]} livre${E3.v[E3.im===0?1:0]>1?"s":""} ; vendredi : ${E3.v[3]} livre${E3.v[3]>1?"s":""}.</p><p><b>b)</b> Le ${JOURS[E3.im].toLowerCase()} (${E3.v[E3.im]} livres). ${E3.v[E3.im]} ÷ ${E3.v[3]} = ${E3.k} : ${E3.k===2?"deux":"trois"} fois plus que le vendredi.</p>
   <p><b>c)</b> Total : ${E3.v.join(" + ")} = ${E3.T} livres.</p><p>Fréquence du lundi :</p>${KC("f",[F(E3.v[0],E3.T),N(E3.v[0]/E3.T),N(E3.v[0]*100/E3.T)+" %"])}${bars({...E3o, show:true})}`},
  {n:"Exercice 4", t:"Construire un diagramme en barres", w:"Sur ton cahier", h:`<p>Les élèves d'un club choisissent leur sport :</p>${tab(["Sport",...SP],[["Nombre d'élèves",...E4.map(String)]])}
   <p>Construis un diagramme en barres :</p><p>axe vertical : 1 cm pour 2 élèves ;</p><p>barres de 1 cm de largeur, espacées de 1 cm.</p><p>N'oublie pas le titre et les graduations.</p>`,
   c:(()=>{ const ym=Math.max(...E4)+(Math.max(...E4)%4?2:0); /* à l'échelle de la consigne : 1 cm = 45 px */
     return `<p>1 cm pour 2 élèves : on divise chaque effectif par 2 pour avoir la hauteur de la barre.</p>${E4.map((v,i)=>`<p>${SP[i]} : ${v} ÷ 2 = ${v/2} cm</p>`).join("")}${bars({cats:SP, vals:E4, title:"Sport pratiqué au club", ylab:"Nombre d'élèves", ymax:ym, ystep:2, ylabStep:2, show:true, bwr:0.5, w:80+8*45, H:104+ym/2*45})}`; })()},
  {n:"Exercice 5", t:"Construire un diagramme circulaire", w:"Sur ton cahier", h:`<p>À la cantine, ${E5.t} élèves ont choisi leur plat. Le diagramme circulaire complet représente ${E5.t} élèves, soit 360°.</p>
   ${tab(["Plat",...PLATS,"Total"],[["Effectif",...E5.v.map(String),String(E5.t)],["Angle (en degrés)","","","","","360"]])}<p><b>1)</b> Recopie et complète le tableau des angles (proportionnalité).</p><p><b>2)</b> Construis le diagramme circulaire (rayon 4 cm, rapporteur).</p>`,
   c:`${tab(["Plat",...PLATS,"Total"],[["Effectif",...E5.v.map(String),String(E5.t)],["Angle (en degrés)",...E5.v.map(x=>String(x*E5.k)),"360"]])}
   <p><b>1)</b> 360 ÷ ${E5.t} = ${E5.k} : 1 élève correspond à ${E5.k}°.</p>${E5.v.map((x,i)=>`<p>${PLATS[i]} : ${x} × ${E5.k} = ${x*E5.k}°</p>`).join("")}<p>Vérification : ${E5.v.map(x=>x*E5.k).join(" + ")} = 360.</p>
   <p><b>2)</b> On trace un cercle de rayon 4 cm et un rayon, puis les secteurs les uns à la suite des autres.</p>${pie({cats:PLATS, vals:E5.v, title:"Plat choisi à la cantine", lab:i=>[PLATS[i], E5.v[i]*E5.k+"°"]})}`},
  {n:"Exercice 6", t:"Lire un diagramme circulaire", w:"Sur ton cahier", h:`<p>Le diagramme représente le moyen de transport des ${N(E6.n)} élèves d'un collège.</p>${pie({vals:E6.p, title:"Moyen de transport", lab:i=>[TR6[i], E6.p[i]+" %"]})}
   <p><b>a)</b> Quel moyen de transport est le plus utilisé ? le moins utilisé ?</p><p><b>b)</b> Calcule le nombre d'élèves pour chaque moyen de transport.</p><p><b>c)</b> Quelle fraction des élèves vient à pied ou à vélo ?</p>`,
   c:`<p><b>a)</b> Le plus utilisé : ${TR6[im6].toLowerCase()} (${E6.p[im6]} %). Le moins utilisé : ${TR6[in6].toLowerCase()} (${E6.p[in6]} %).</p>
   <p><b>b)</b> ${E6.p.map((p,i)=>`${TR6[i]} : ${N(E6.n)} × ${F(p,100)} = ${N(E6.n*p/100)} élèves`).join("</p><p>")}</p><p>Total : ${E6.p.map(p=>N(E6.n*p/100)).join(" + ")} = ${N(E6.n)}.</p>
   <p><b>c)</b> La fraction f des élèves qui viennent à pied ou à vélo :</p>${KC("f",[`${E6.p[2]} % + ${E6.p[1]} %`,pv+" %",F(pv,100),irr(pv,100)])}<p>${irr(pv,100)} des élèves viennent à pied ou à vélo.</p>`},
  {n:"Exercice 7", t:"Lire un graphique cartésien", w:"Sur ton cahier", h:`<p>On a relevé la température à Cholet un jour de printemps.</p>${line(E7o)}
   <p><b>a)</b> Quelle était la température à ${H7[q7[0]]} h ? à ${H7[q7[1]]} h ?</p><p><b>b)</b> À quelle heure la température relevée est-elle maximale ? Quelle est cette température ?</p><p><b>c)</b> Pendant quelle période de relevés la température a-t-elle baissé ?</p><p><b>d)</b> De combien de degrés la température a-t-elle augmenté entre 6 h et ${H7[E7.im]} h ?</p>`,
   c:`<p><b>a)</b> À ${H7[q7[0]]} h : ${E7.y[q7[0]]} °C ; à ${H7[q7[1]]} h : ${E7.y[q7[1]]} °C.</p><p><b>b)</b> Maximum à ${H7[E7.im]} h : ${E7.y[E7.im]} °C.</p><p><b>c)</b> Entre ${H7[E7.im]} h et 18 h (de ${E7.y[E7.im]} °C à ${E7.y[6]} °C).</p><p><b>d)</b> ${E7.y[E7.im]} − ${E7.y[0]} = ${E7.y[E7.im]-E7.y[0]} : la température a augmenté de ${E7.y[E7.im]-E7.y[0]} °C.</p>${line({...E7o, show:true})}`},
  {n:"Exercice 8", t:"Construire un graphique cartésien", w:"Sur ton cahier", h:`<p>On mesure la taille d'une plante chaque semaine.</p>${tab(["Semaine","0","1","2","3","4"],[["Taille (cm)",...E8.map(String)]])}
   <p>Construis un graphique cartésien :</p><p>en abscisse, la semaine (1 cm pour 1 semaine) ;</p><p>en ordonnée, la taille (1 cm pour 2 cm).</p><p>Place les points puis relie-les.</p>`,
   c:(()=>{ const ym=Math.ceil((Math.max(...E8)+1)/2)*2; /* à l'échelle de la consigne : 1 cm = 44 px */
     return `<p>On place un point pour chaque colonne du tableau :</p><p>${E8.map((y,i)=>`(${i} ; ${y})`).join(", ")}.</p><p>L'abscisse est la semaine, l'ordonnée est la taille en cm.</p>${line({xs:[0,1,2,3,4], ys:E8, title:"Croissance de la plante", xlab:"Semaine", ylab:"Taille (cm)", xmax:5, xstep:1, ymax:ym, ystep:1, ylabStep:2, w:88+5*44, H:116+ym/2*44, show:true})}`; })()},
  {n:"Exercice 9", t:"Choisir une représentation", w:"Sur ton cahier", h:`<p>Pour chaque situation, indique en une phrase la représentation la plus adaptée : diagramme en barres, diagramme circulaire ou graphique cartésien.</p>${E9.map(([s],i)=>`<p><b>${"abc"[i]})</b> ${s[0].toUpperCase()+s.slice(1)}.</p>`).join("")}`,
   c:E9.map(([,k],i)=>`<p><b>${"abc"[i]})</b> Un ${k} : ${WHY[k]}.</p>`).join("")}
 ]},
 {t:"La moyenne", e:[
  {n:"Exercice 10", t:"Calculer une moyenne", w:"Sur ton cahier", h:`<p>Calcule la moyenne de chaque série.</p><p><b>a)</b> ${M10[0].join(" ; ")}</p><p><b>b)</b> ${M10[1].join(" ; ")}</p><p><b>c)</b> ${M10[2].map(x=>N(x/100)+" m").join(" ; ")}</p><p><b>d)</b> ${M10[3].map(x=>N(x)).join(" ; ")}</p>`,
   c:`<p>La moyenne M de chaque série :</p><p><b>a)</b></p>${mLine(M10[0])}<p><b>b)</b></p>${mLine(M10[1])}<p><b>c)</b></p>${mLine(M10[2]," m",100)}<p><b>d)</b></p>${mLine(M10[3])}`},
  {n:"Exercice 11", t:"Températures de la semaine", w:"Sur ton cahier", h:`<p>Voici les températures maximales relevées pendant une semaine :</p><p>${E11.map(x=>x+" °C").join(" ; ")}.</p><p><b>a)</b> Quelle est la température maximale moyenne de la semaine (arrondie au dixième) ?</p><p><b>b)</b> Quelle est la différence entre la température la plus haute et la plus basse ?</p>`,
   c:`<p><b>a)</b> Somme : ${E11.join(" + ")} = ${sum(E11)}. Moyenne : ${sum(E11)} ÷ 7 ≈ <b>${N(sum(E11)/7,1)} °C</b>.</p><p><b>b)</b> ${Math.max(...E11)} − ${Math.min(...E11)} = ${Math.max(...E11)-Math.min(...E11)} : l'écart est de <b>${Math.max(...E11)-Math.min(...E11)} °C</b>.</p>`},
  {n:"Exercice 12", t:"Raisonner avec la moyenne", w:"Sur ton cahier", h:`<p><b>a)</b> Léa a obtenu ${E12.a}, ${E12.b} et ${E12.c} à ses trois premiers devoirs. Quelle note doit-elle obtenir au quatrième pour avoir ${E12.m} de moyenne ?</p>
   <p><b>b)</b> La moyenne de la classe de 5eA est ${N(mA)} et celle de 5eB est ${N(mB)}. Peut-on affirmer que chaque élève de 5eA a une meilleure note que chaque élève de 5eB ? Explique.</p>`,
   c:`<p><b>a)</b> Pour avoir ${E12.m} de moyenne sur 4 devoirs, la somme doit valoir 4 × ${E12.m} = ${4*E12.m}. Les trois premières notes font ${E12.a} + ${E12.b} + ${E12.c} = ${E12.a+E12.b+E12.c}. Il faut donc ${4*E12.m} − ${E12.a+E12.b+E12.c} = <b>${E12.x}</b>.</p>
   <p><b>b)</b> Non : la moyenne résume la série par un seul nombre. Un élève de 5eB peut avoir une meilleure note qu'un élève de 5eA, même si la moyenne de 5eA est plus élevée.</p>`}
 ]}
];
};
