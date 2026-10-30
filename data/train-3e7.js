/* 3e · chapitre 7 — fiche d'entraînement : les exercices de la fiche de M. Staal sur les grandeurs composées, avec d'autres nombres.
   Les corrections sont calculées par le code (outils window.GC3 de data/3e-7.js). */
TRAIN["3e-7"] = function(){
const {ri, pick, shuf} = TR;
const {N, N2, pt, tab, rd, hm} = window.GC3;
const pad = m => String(m).padStart(2,"0");
/* « = » si la valeur affichée est exacte, « ≈ » sinon */
const ap = (x,k) => Math.abs(x*10**k-Math.round(x*10**k))<1e-6 ? "=" : "≈";

/* ===== 1. Conversions de durées ===== */
const C1 = {m:ri(3,25), h:ri(1,6), mm:ri(5,55), d:ri(2,5)};
const C2 = (()=>{ const h=ri(8,20), m=ri(1,29), M=h*60+m; return {h, m, M}; })();

/* ===== 2. Grandeurs composées ===== */
const A1 = {v:ri(600,950)/10, t:ri(2,5), d2:ri(1500,1990)/10, t2:2, e:pick([1,2,3]), n:ri(3,7)};
const E1 = (()=>{ const t=ri(3,6), v=ri(160,210)/2, v2=ri(600,900)/10, t2=ri(2,6); return {d:rd(v*t,2), t, v, v2, t2, d2:rd(v2*t2,2)}; })();
const E2 = (()=>{ let m,P; do{ m=ri(11,39)/10; P=ri(150,600)/100; }while(Math.abs((P/m*100)%1-0.5)<0.02); return {m, P, p2:ri(120,480)/100, m2:ri(15,59)/10}; })();
const E3 = {t:ri(985,1150)/100};
const E4 = (()=>{ const V=ri(150,600)*1000000, D=ri(15,40); return {V, D, s:V/D}; })();
const E5 = {t:ri(2,9)};

/* ===== 3. Sujets de brevet ===== */
const LM = (()=>{ const L=13.629, tours=ri(360,395), D=rd((tours+ri(5,85)/100)*L,3); let mph, kmh; do{ mph=ri(180,215); kmh=ri(295,345); }while(Math.abs(mph*1.609-kmh)<3); return {L, D, mph, kmh}; })();
const toursLM = Math.floor(LM.D/LM.L), vLM = Math.round(LM.D/24), mphKm = rd(LM.mph*1.609,3);
const DU = (()=>{ for(let g=0;g<500;g++){ const ce=pick([5.8,6,6.2,6.4,6.8]), cd=rd(ce-pick([0.8,1,1.2]),1), pe=ri(1500,1900)/1000, pg=ri(1250,1700)/1000, km=ri(150,260)*100, ae=ri(195,235)*100, diff=pick([1800,2000,2200,2400,2600]);
  const eco=rd(ce*km/100*pe,2)-rd(cd*km/100*pg,2); if(pg>pe-0.1 || eco<=0) continue; const n=diff/eco; if(n<2.2||n>9.8||Math.abs(n-Math.round(n))<0.05) continue;
  return {ce, cd, pe, pg, km, ae, ad:ae+diff, diff}; }
  return {ce:6.2, cd:5.2, pe:1.415, pg:1.224, km:22300, ae:21550, ad:23950, diff:2400}; })();
const Le = rd(DU.ce*DU.km/100,2), Ld = rd(DU.cd*DU.km/100,2), Be = rd(Le*DU.pe,2), Bd = rd(Ld*DU.pg,2), Eco = rd(Be-Bd,2), nY = DU.diff/Eco;

/* ===== 4. Grandeurs composées et conversions ===== */
const A2 = (()=>{ const D=pick([0.2,0.25,0.4,0.5]), t=ri(10,30); return {D, t, V:rd(D*t*60,2), c:ri(30,80)/10}; })();
const E6 = {v:pick([36,54,72,90,108,126]), t:pick([1,2])};
const E7 = {D:pick([500,800,1200,1500,2000,2500]), m:ri(2,10)};
const E8 = {v:pick([8,9,11,12,14,15,16])};
const E9 = {D:pick([0.1,0.15,0.2,0.25,0.3,0.4])};
const E10 = (()=>{ const m=pick([15,20,30,40,45]), T=60+m; let d; do{ d=ri(4,12); }while(!Number.isInteger(rd(d*60/T*100,6))); return {m, T, d, v:d*60/T}; })();
const SUP = {p:pick([0.1,0.2,0.3,0.4,0.5])};

return [
 {t:"Conversions de durées", e:[
  {n:"Exercice 1", t:"Conversions de durée", w:"Sur ton cahier", h:`<p>Rappel : 1 h = 60 min / 1 min = 60 s / 1 h = 3 600 s.</p><p><b>1)</b> Convertis ${C1.m} min en secondes.</p><p><b>2)</b> Convertis ${C1.h} h ${C1.mm} min en minutes.</p><p><b>3)</b> Convertis ${C1.d} jours en secondes.</p>`,
   c:`<p><b>1)</b> ${C1.m} × 60 = <b>${N(C1.m*60)} s</b>.</p><p><b>2)</b></p><p class="calc">t = ${C1.h} × 60 + ${C1.mm}<br>t = ${C1.h*60} + ${C1.mm}<br>t = <b>${C1.h*60+C1.mm} min</b></p><p><b>3)</b> ${C1.d} jours = ${C1.d*24} h et ${C1.d*24} × 3 600 = <b>${N(C1.d*86400)} s</b>.</p>`},
  {n:"Exercice 2", t:"Des minutes aux heures", w:"Sur ton cahier", h:`<p><b>a)</b> ${N(C2.M)} min représentent combien d'heures ? Donne un arrondi à l'unité.</p><p><b>b)</b> Convertis ${N(C2.M)} min en heures et minutes.</p>`,
   c:`<p><b>a)</b> ${N(C2.M)} ÷ 60 ${Math.abs(C2.M/60-rd(C2.M/60,2))>1e-9?"≈":"="} ${N(C2.M/60,2)} : environ <b>${Math.round(C2.M/60)} h</b>.</p><p><b>b)</b> ${C2.h} h = ${N(C2.h*60)} min, donc ${N(C2.M)} min = ${N(C2.h*60)} min + ${C2.m} min = <b>${C2.h} h ${pad(C2.m)} min</b>.</p>`}
 ]},
 {t:"Grandeurs composées", e:[
  {n:"Exercice 3", t:"Vitesse et énergie", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> une voiture roule à une vitesse moyenne de ${N(A1.v)} km/h. En ${A1.t} h, combien de kilomètres a-t-elle parcourus ?</p><p><b>Problème 2 :</b> une voiture a roulé ${A1.t2} h et a parcouru ${N(A1.d2)} km. Quelle a été sa vitesse moyenne en km/h ?</p><p><b>Problème 3 :</b> mon lave-vaisselle a une puissance de 1 kW et il lave pendant ${A1.e} h. Cette semaine, je l'ai mis en route ${A1.n} fois. Combien d'énergie ai-je consommée en kWh ?</p>`,
   c:`<p><b>Problème 1 :</b> ${N(A1.v)} × ${A1.t} = <b>${N(rd(A1.v*A1.t,2))} km</b>.</p><p><b>Problème 2 :</b> ${N(A1.d2)} ÷ 2 = <b>${N(A1.d2/2)} km/h</b>.</p><p><b>Problème 3 :</b> un lavage : 1 kW × ${A1.e} h = ${A1.e} kWh. ${A1.n} lavages : ${A1.n} × ${A1.e} = <b>${A1.n*A1.e} kWh</b>.</p>`},
  {n:"Exercice 4", t:"La vitesse moyenne en km/h", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> un routier a parcouru ${N(E1.d)} km en ${E1.t} h. Quelle a été sa vitesse moyenne en km/h ?</p><p><b>Problème 2 :</b> un automobiliste a roulé à une vitesse moyenne de ${N(E1.v2)} km/h et a parcouru ${N(E1.d2)} km. Combien d'heures a-t-il roulé ?</p>`,
   c:`<p><b>Problème 1 :</b></p><p class="calc">V = {d/t}<br>V = ${N(E1.d)} ÷ ${E1.t}<br>V = <b>${N(E1.v)} km/h</b></p><p><b>Problème 2 :</b></p><p class="calc">t = {d/V}<br>t = ${N(E1.d2)} ÷ ${N(E1.v2)}<br>t = <b>${E1.t2} h</b></p>`},
  {n:"Exercice 5", t:"Le prix au kilo en €/kg", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> j'ai acheté ${N(E2.m)} kg de poires et j'ai payé ${N2(E2.P)} €. Quel est le prix au kilo des poires ?</p><p><b>Problème 2 :</b> les courgettes sont à ${N2(E2.p2)} €/kg. J'achète ${N(E2.m2)} kg de courgettes. Combien vais-je payer ?</p>`,
   c:`<p><b>Problème 1 :</b> ${N2(E2.P)} ÷ ${N(E2.m)} ${ap(E2.P/E2.m,2)} <b>${N2(E2.P/E2.m)} €/kg</b>.</p><p><b>Problème 2 :</b></p><p class="calc">P = ${N2(E2.p2)} × ${N(E2.m2)}<br>P = ${N(rd(E2.p2*E2.m2,4))}${ap(E2.p2*E2.m2,2)==="="?"":`<br>P ≈ ${N2(E2.p2*E2.m2)}`}</p><p>Je vais payer <b>${N2(E2.p2*E2.m2)} €</b>.</p>`},
  {n:"Exercice 6", t:"Un sprinteur", w:"Sur ton cahier", h:`<p>Un sprinteur court le 100 m en ${N(E3.t)} s.</p><p>Calcule sa vitesse moyenne en m/s. Arrondis au centième.</p>`,
   c:`<p class="calc">V = {d/t}<br>V = {100/${N(E3.t)}}<br>V ${ap(100/E3.t,2)} <b>${N2(100/E3.t)} m/s</b></p>`},
  {n:"Exercice 7", t:"Le remplissage d'un barrage", w:"Sur ton cahier", h:`<p>Un barrage a une retenue d'eau d'environ ${N(E4.V)} m<sup>3</sup>. Une rivière y déverse son eau avec un débit moyen de ${E4.D} m<sup>3</sup>/s.</p><p>Calcule la durée de remplissage de ce barrage, arrondie à l'unité : <b>a)</b> en secondes ; <b>b)</b> en heures ; <b>c)</b> en jours.</p>`,
   c:`<p><b>a)</b></p><p class="calc">t = {V/D}<br>t = ${N(E4.V)} ÷ ${E4.D}<br>t ${ap(E4.s,0)} <b>${N(Math.round(E4.s))} s</b></p><p><b>b)</b> ${N(Math.round(E4.s))} ÷ 3 600 ≈ <b>${N(Math.round(E4.s/3600))} h</b>.</p><p><b>c)</b> ${N(rd(E4.s/3600,2))} ÷ 24 ≈ <b>${N(Math.round(E4.s/86400))} jours</b>.</p>`},
  {n:"Exercice 8", t:"Orage et vitesse du son", w:"Sur ton cahier", h:`<p>Le son se déplace à la vitesse de 330 m/s.</p><p>On entend le tonnerre ${E5.t} s après avoir vu un éclair. À quelle distance se situe l'orage ? Convertis en kilomètres.</p>`,
   c:`${pt(["Distance (en m)","330","D"],["Temps (en s)","1",String(E5.t)])}<p class="calc">D = 330 × ${E5.t}<br>D = ${N(330*E5.t)} m</p><p>soit <b>${N(330*E5.t/1000)} km</b>.</p>`}
 ]},
 {t:"Sujets de brevet", e:[
  {n:"Exercice 9", t:"Une course de 24 heures", w:"Sur ton cahier", h:`<p>Sur une course de 24 heures, les voitures tournent sur un circuit dont un tour mesure ${N(LM.L)} km.</p><p>La voiture gagnante a parcouru ${N(LM.D)} km.</p><p><b>1)</b> Détermine le nombre de tours complets effectués par cette voiture.</p><p><b>2)</b> Calcule sa vitesse moyenne en km/h. Arrondis à l'unité.</p><p><b>3)</b> 1 mile ≈ 1 609 m. La voiture n° 37 roule à ${LM.mph} mph (miles par heure) et la voiture n° 38 à ${LM.kmh} km/h. Quelle est la plus rapide ?</p>`,
   c:`<p><b>1)</b> {${N(LM.D)}/${N(LM.L)}} ≈ ${N(LM.D/LM.L,1)} : <b>${toursLM} tours complets</b>.</p><p><b>2)</b> {${N(LM.D)}/24} ≈ <b>${vLM} km/h</b>.</p><p><b>3)</b> ${LM.mph} mph ≈ ${LM.mph} × 1,609 = ${N(mphKm)} km/h. ${mphKm>LM.kmh?`${N(mphKm)} &gt; ${LM.kmh} : la plus rapide est la <b>n° 37</b>.`:`${N(mphKm)} &lt; ${LM.kmh} : la plus rapide est la <b>n° 38</b>.`}</p>`},
  {n:"Exercice 10", t:"Essence ou diesel ?", w:"Sur ton cahier", h:`<p>Une voiture existe en deux versions.</p>${tab(["","Version ESSENCE","Version DIESEL"],[["Consommation moyenne",`${N(DU.ce)} L pour 100 km`,`${N(DU.cd)} L pour 100 km`],["Prix d'un litre de carburant",`${N(DU.pe)} €`,`${N(DU.pg)} €`],["Prix d'achat",`${N(DU.ae)} €`,`${N(DU.ad)} €`]])}<p>Le propriétaire parcourt ${N(DU.km)} km par an.</p><p><b>1)</b> Calcule, pour chaque version, la consommation de carburant (en L) et le budget de carburant (en €) pour un an.</p><p><b>2)</b> Il choisit la version diesel. Au bout de combien d'années l'économie de carburant compensera-t-elle la différence de prix d'achat ?</p>`,
   c:`<p><b>1)</b> Essence : ${N(DU.ce)} × ${N(DU.km)} ÷ 100 = ${N(Le)} L, et ${N(Le)} × ${N(DU.pe)} ${Math.abs(Le*DU.pe-Be)>1e-9?"≈":"="} <b>${N2(Be)} €</b>.</p><p>Diesel : ${N(DU.cd)} × ${N(DU.km)} ÷ 100 = ${N(Ld)} L, et ${N(Ld)} × ${N(DU.pg)} ${Math.abs(Ld*DU.pg-Bd)>1e-9?"≈":"="} <b>${N2(Bd)} €</b>.</p><p><b>2)</b> Économie par an : ${N2(Be)} − ${N2(Bd)} = ${N2(Eco)} €. Différence de prix d'achat : ${N(DU.ad)} − ${N(DU.ae)} = ${N(DU.diff)} €.</p><p>${N(DU.diff)} ÷ ${N2(Eco)} ≈ ${N(nY,1)} : ${Number.isInteger(rd(nY,6))?`la différence est compensée au bout de <b>${nY} ans</b>.`:`la différence est compensée <b>au cours de la ${Math.ceil(nY)}<sup>e</sup> année</b>.`}</p>`}
 ]},
 {t:"Grandeurs composées et conversions", e:[
  {n:"Exercice 11", t:"Débit et vitesse", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> un ballon d'eau chaude de ${N(A2.V)} L se vide en ${A2.t} min. Quel est le débit en L/s ?</p><p><b>Problème 2 :</b> un cycliste a une vitesse moyenne de ${N(A2.c)} m/s. Quelle est sa vitesse moyenne en km/h ?</p>`,
   c:`<p><b>Problème 1 :</b> ${A2.t} min = ${N(A2.t*60)} s.</p><p class="calc">D = ${N(A2.V)} ÷ ${N(A2.t*60)}<br>D = <b>${N(A2.D)} L/s</b></p><p><b>Problème 2 :</b> en 1 h = 3 600 s : ${N(A2.c)} × 3 600 = ${N(rd(A2.c*3600,2))} m = ${N(rd(A2.c*3.6,4))} km. Sa vitesse est de <b>${N(rd(A2.c*3.6,4))} km/h</b>.</p>`},
  {n:"Exercice 12", t:"Temps de réaction", w:"Sur ton cahier", h:`<p>Un conducteur met ${E6.t} s avant de commencer à freiner quand il voit un obstacle.</p><p>Calcule la distance parcourue, en m, pendant ce temps de réaction s'il roule à ${E6.v} km/h.</p>`,
   c:`<p>${E6.v} km = ${N(E6.v*1000)} m en 3 600 s. En 1 s : ${N(E6.v*1000)} ÷ 3 600 = ${N(E6.v/3.6)} m.</p><p>En ${E6.t} s : <b>${N(E6.v/3.6*E6.t)} m</b>.</p>`},
  {n:"Exercice 13", t:"Sous le pont", w:"Sur ton cahier", h:`<p>Sous un pont, une rivière a un débit de ${N(E7.D)} m<sup>3</sup>/s.</p><p>Tom traverse le pont en ${E7.m} min. Combien de litres d'eau sont passés sous le pont pendant ce temps ?</p>`,
   c:`<p>${E7.m} min = ${E7.m*60} s. ${N(E7.D)} × ${E7.m*60} = ${N(E7.D*E7.m*60)} m<sup>3</sup>, soit <b>${N(E7.D*E7.m*60000)} L</b>.</p>`},
  {n:"Exercice 14", t:"Vitesse d'un coureur", w:"Sur ton cahier", h:`<p>Un coureur a une vitesse moyenne de ${E8.v} km/h.</p><p>Quelle est sa vitesse moyenne en m/s ? Arrondis au centième.</p>`,
   c:`<p>${N(E8.v*1000)} m en 3 600 s : ${N(E8.v*1000)} ÷ 3 600 ${ap(E8.v/3.6,2)} <b>${N2(E8.v/3.6)} m/s</b>.</p>`},
  {n:"Exercice 15", t:"Débit d'un robinet", w:"Sur ton cahier", h:`<p>Le débit moyen d'un robinet est de ${N(E9.D)} L/s.</p><p>Transforme ce débit : <b>a)</b> en L/min ; <b>b)</b> en L/h ; <b>c)</b> en m<sup>3</sup>/h.</p>`,
   c:`<p><b>a)</b> ${N(E9.D)} × 60 = <b>${N(E9.D*60)} L/min</b>.</p><p><b>b)</b> ${N(E9.D)} × 3 600 = <b>${N(E9.D*3600)} L/h</b>.</p><p><b>c)</b> ${N(E9.D*3600)} L = ${N(E9.D*3.6)} m<sup>3</sup> : le débit est de <b>${N(E9.D*3.6)} m<sup>3</sup>/h</b>.</p>`},
  {n:"Exercice 16", t:"Vitesse d'un marcheur", w:"Sur ton cahier", h:`<p>Un randonneur a parcouru ${E10.d} km en 1 h ${E10.m} min.</p><p>Calcule sa vitesse moyenne en km/h.</p>`,
   c:`<p>1 h ${E10.m} min = ${E10.T} min.</p>${pt(["Distance (en km)",String(E10.d),"D"],["Temps (en min)",String(E10.T),"60"])}<p class="calc">D = ${E10.d} × 60 ÷ ${E10.T}<br>D = <b>${N(E10.v)} km/h</b></p>`},
  {n:"Exercice 17", t:"Un chargeur branché pour rien", w:"Sur ton cahier", h:`<p>Un chargeur branché sur une prise, mais non connecté à un téléphone, développe une puissance de ${N(SUP.p)} W.</p><p><b>a)</b> Calcule l'énergie consommée en une journée complète, en Wh.</p><p><b>b)</b> Calcule l'énergie consommée en une année de 365 jours. Convertis en kWh.</p>`,
   c:`<p><b>a)</b></p><p class="calc">E = P × t<br>E = ${N(SUP.p)} × 24<br>E = <b>${N(SUP.p*24)} Wh</b></p><p><b>b)</b> ${N(SUP.p*24)} × 365 = ${N(rd(SUP.p*24*365,2))} Wh = <b>${N(rd(SUP.p*24*365/1000,4))} kWh</b>.</p>`}
 ]}
];
};
