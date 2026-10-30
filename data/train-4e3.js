/* 4e · chapitre 3 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres.
   Les tableaux et les corrections sont calculés à partir des mêmes valeurs. */
TRAIN["4e-3"] = function(){
const {ri, pick, shuf} = TR;
const {ptab, croix, tab, N, E, F, rd} = window.P43;
const ok2 = x => Math.abs(x*100-Math.round(x*100))<1e-6;   /* au plus 2 décimales */
const eq = (x,y) => Math.abs(x-y)<1e-9;
const app = (v,k=2) => ok2(v) && eq(v,rd(v,2)) ? "= "+E(v) : "≈ "+E(rd(v,k));

/* ===== Activité rapide ===== */
const AR = (()=>{ const a=pick([20,30,40,50,60]), m=pick([2,3,4,5]), ka=pick([110,120,130,150,160]);
  const h=pick([2,3,4,5]), k=pick([5,6,7,8]), h2=h+ri(2,6);
  const n=pick([4,6,8,10]), u=pick([0.75,0.85,0.95,1.05,1.15]); return {a,m,ka,h,k,h2,n,u,n2:n*1.5}; })();

/* ===== Activité 1 : baguettes ===== */
const B = (()=>{ const u=pick([0.85,0.9,0.95,1.05,1.1,1.2]), cols=shuf([3,4,5,6,7,8,9,10,11,12,13,15]).slice(0,3).sort((x,y)=>x-y); return {u, cols}; })();

/* ===== Exercice 1 : prime annuelle ===== */
const P = (()=>{ const c=pick([10,16,20,25,40]), pB=pick([400,500,600,800]); let pD,pE; do{ pD=25*ri(Math.ceil(pB/25)+2, Math.floor(3*pB/25)); pE=25*ri(Math.ceil(pB/25)+2, Math.floor(3*pB/25)); }while(pD>=pE); return {c, pB, pA:pB/4, pC:2*pB, pD, pE}; })();
const PH = ["Ventes (en €)",N(P.c*P.pA),N(P.c*P.pB),"",N(P.c*P.pD),N(P.c*P.pE),N(P.c*(P.pD+P.pE))];

/* ===== Exercice 2 : jardinage ===== */
const J = (()=>{ const H=pick([10,20,25,30,40]), r=ri(950,1450)/100; const h2=ri(5,35), h3=ri(5,30); return {H, r, g:rd(H*r), h2, h3, g3:rd(h3*r)}; })();

/* ===== Exercice 3 : supermarché ===== */
const S = (()=>{ const p=pick([1.2,1.5,1.8,2.2,2.4,3.5]), m1=pick([1.5,2.5,0.5,3.5]), m2=ri(1100,2900)/1000; return {p,m1,m2}; })();

/* ===== Exercice 4 : restaurant ===== */
const R = (()=>{ const a=ri(2,6), b=ri(2,6), c=ri(2,4), d=ri(2,5), e=ri(2,4), pu=pick([0.85,0.9,0.95,1.1]), mp=ri(300,550)/1000, pp=pick([17,18,19,21,22]), mr=ri(35,55)*10, pr=pick([6.9,7.5,7.9,8.4]);
  const nb=a+b+c+d+e, t1=rd(nb*pu), t2=rd(mp*pp,4), t3=rd(mr/1000*pr,4), tot=t1+t2+t3, bud=pick([25,30,35,40]); return {a,b,c,d,e,pu,mp,pp,mr,pr,nb,t1,t2,t3,tot,bud}; })();

/* ===== Exercice 5 : journaux ===== */
const JO = (()=>{ for(let g=0;g<500;g++){ const M=pick([600,800,900,1000,1200]), L=pick([10,12,15,16,20]), M2=50*ri(6,22); if(M2!==M && ok2(L*M2/M)) return {M,L,M2,y:L*M2/M}; } return {M:900,L:15,M2:750,y:12.5}; })();

/* ===== Exercices 6, 7, 8 : monnaies ===== */
const UK = {t:pick([1.12,1.15,1.17,1.18,1.2]), e:pick([50,60,80,100,120,150])};
const US = (()=>{ const e1=ri(20,45), t=ri(105,135)/100; return {e1, d1:rd(e1*t,2), e2:pick([50,60,75,80,100,120])}; })();
const SO = (()=>{ const t=pick([1.15,1.18,1.2,1.25,1.35]), n=pick([2,3,4]); let p; do{ p=ri(300,900)/10*n; }while(!ok2(p*t/n)); return {t,n,p:rd(p,1)}; })();
const SOn = ["","une","deux","trois","quatre"][SO.n];

/* ===== Activité 2 : bracelets ===== */
const BR = (()=>{ for(let g=0;g<500;g++){ const pb=pick([1.2,1.5,1.6,1.8,2]), pn=pick([0.6,0.75,0.8,0.9,1]), fp=pick([4,5,6,7.5]); const s=fp/(pb-pn); const cols=[4,8,10]; if(pn<pb && s>4 && s<10 && Math.abs(s-Math.round(s))>1e-6) return {pb,pn,fp,s,cols}; } return {pb:1.5,pn:0.75,fp:5,s:20/3,cols:[4,8,10]}; })();
const priceB=n=>rd(n*BR.pb), priceN=n=>rd(n*BR.pn+BR.fp);

/* ===== Exercice 9 : situations ===== */
const SIT = (()=>{ const k=pick([25,20,30,40]), v=shuf([1,0.2,0.4,0.6,0.8,1.2,1.5]).slice(0,3); const pr={h:["Volume de pâte à crêpe (L)","Nombre de crêpes préparées"], x:v, y:v.map(x=>rd(x*k)), ok:true, k};
  let ag, t; do{ ag=shuf([3,5,8,10,12,15]).slice(0,3).sort((a,b)=>a-b); t=ag.map(a=>rd(0.5+a*ri(7,9)/100,2)); }while(new Set(ag.map((a,i)=>rd(t[i]/a,3))).size<3); const np={h:["Âge (années)","Taille (m)"], x:ag, y:t, ok:false};
  return shuf([pr,np]); })();

/* ===== Exercice 11 : yaourts ===== */
const Y = (()=>{ const n1=pick([4,6,8]), n2=pick([10,12,16]), u=pick([0.25,0.3,0.35,0.4]), red=pick([0.05,0.1]); return {n1, n2, p1:rd(n1*u), p2:rd(n2*(u-red)), u, u2:rd(u-red)}; })();

/* ===== Défis ===== */
const D1 = (()=>{ const q=pick([0.2,0.25,0.3,0.5]), j=pick([2,3,4]), s=pick([40,50,60,80,100]), j2=pick([5,6,7,10]), s2=pick([90,120,150,160,200]); return {q,j,s,L:rd(q*j*s),j2,s2,R:rd(q*j2*s2)}; })();
const D3 = (()=>{ for(let g=0;g<800;g++){ const c=pick([4,5,6,7,8]), km=pick([400,450,500,560,600,700]), p=pick([1.2,1.3,1.4,1.5,1.6,1.7]), a=pick([0.1,0.2]); const L=km*c/100, B=rd(L*p,4), L2=B/(p+a), km2=L2*100/c; if(ok2(L2) && Number.isInteger(rd(km2,6))) return {c,km,p,a,L,B,L2,km2:rd(km2,6)}; } return {c:5,km:560,p:1.3,a:0.1,L:28,B:36.4,L2:26,km2:520}; })();

return [
 {t:"Compléter un tableau sans le produit en croix", e:[
  {n:"Activité rapide", t:"Choisir la meilleure méthode", w:"Sur ton cahier", h:`<p>Ces situations sont toutes des situations de proportionnalité. Trouve le nombre manquant en utilisant le moins possible ta calculatrice.</p>
   <p><b>a)</b></p>${tab(["Masse de fromage (en g)",String(AR.a),String(AR.a*AR.m)],[["Apport calorique (en kcal)",String(AR.ka),"…"]])}
   <p><b>b)</b></p>${tab(["Hauteur d'eau (en cm)",String(AR.h),String(AR.h2)],[["Nombre de litres",String(AR.h*AR.k),"…"]])}
   <p><b>c)</b></p>${tab(["Nombre de croissants",String(AR.n),String(AR.n2)],[["Prix (en €)",E(AR.n*AR.u),"…"]])}`,
   c:`<p><b>a)</b> ${AR.a*AR.m} = ${AR.a} × ${AR.m}, donc ${AR.ka} × ${AR.m} = <b>${AR.ka*AR.m} kcal</b>.</p>${ptab({h1:"Masse (en g)",h2:"Apport (en kcal)",r1:[String(AR.a),String(AR.a*AR.m)],r2:[String(AR.ka),"!"+AR.ka*AR.m],top:[[0,1,"× "+AR.m]],bot:[[0,1,"× "+AR.m]]})}
   <p><b>b)</b> ${AR.h*AR.k} ÷ ${AR.h} = ${AR.k} (coefficient), donc ${AR.h2} × ${AR.k} = <b>${AR.h2*AR.k} L</b>.</p>${ptab({h1:"Hauteur (en cm)",h2:"Nombre de litres",r1:[String(AR.h),String(AR.h2)],r2:[String(AR.h*AR.k),"!"+AR.h2*AR.k],side:"× "+AR.k})}
   <p><b>c)</b> ${AR.n2} = ${AR.n} + ${AR.n/2} et ${AR.n/2} croissants coûtent ${E(AR.n*AR.u)} ÷ 2 = ${E(AR.n*AR.u/2)} €. Donc ${E(AR.n*AR.u)} + ${E(AR.n*AR.u/2)} = <b>${E(AR.n2*AR.u)} €</b>.</p>`},
  {n:"Activité 1", t:"Chez le boulanger", w:"Sur ton cahier", h:`<p>Le boulanger nous a vendu 2 baguettes au prix de ${E(2*B.u)} €. Il n'y a pas d'offre en cours dans la boulangerie.</p><p>Recopie et complète le tableau.</p>
   ${tab(["Nombre de baguettes","2",...B.cols.map(String)],[["Prix (en €)",E(2*B.u),"","",""]])}`,
   c:`<p>Le prix est proportionnel au nombre de baguettes. Une baguette coûte ${E(2*B.u)} ÷ 2 = ${E(B.u)} €.</p>${ptab({h1:"Nombre de baguettes",h2:"Prix (en €)",r1:["2",...B.cols.map(String)],r2:[E(2*B.u),...B.cols.map(n=>"!"+E(n*B.u))],side:"× "+N(B.u)})}
   <p>${B.cols.map(n=>`${n} × ${E(B.u)} = ${E(n*B.u)} €`).join(" · ")}</p>`},
  {n:"Exercice 1", t:"Prime annuelle (sans calculatrice)", w:"Sur ton cahier", h:`<p>La prime annuelle d'un vendeur est proportionnelle au montant de ses ventes. Recopie et complète les cases vides. Note les calculs et la méthode utilisée.</p>
   ${tab(PH,[["Primes (en €)","",N(P.pB),N(P.pC),N(P.pD),N(P.pE),""]])}`,
   c:`<p>${N(P.c*P.pB)} ÷ ${N(P.pB)} = ${P.c} : on divise les ventes par ${P.c} pour obtenir la prime.</p>
   <p>• ${N(P.c*P.pA)} = ${N(P.c*P.pB)} ÷ 4, donc la prime est ${N(P.pB)} ÷ 4 = <b>${N(P.pA)} €</b>.</p><p>• ${N(P.pC)} = ${N(P.pB)} × 2, donc les ventes sont ${N(P.c*P.pB)} × 2 = <b>${N(P.c*P.pC)} €</b>.</p><p>• ${N(P.c*(P.pD+P.pE))} = ${N(P.c*P.pD)} + ${N(P.c*P.pE)}, donc la prime est ${N(P.pD)} + ${N(P.pE)} = <b>${N(P.pD+P.pE)} €</b>.</p>
   ${tab(PH.map((x,i)=>i===3?`<b>${N(P.c*P.pC)}</b>`:x),[["Primes (en €)",`<b>${N(P.pA)}</b>`,N(P.pB),N(P.pC),N(P.pD),N(P.pE),`<b>${N(P.pD+P.pE)}</b>`]])}`},
  {n:"Exercice 2", t:"Travaux de jardinage (calculatrice autorisée)", w:"Sur ton cahier", h:`<p>Gaspard effectue des travaux de jardinage. Il est payé à l'heure.</p><p>Cette semaine, pour ${J.H} h de travail, il a gagné ${E(J.g)} €.</p>
   <p><b>a)</b> Combien est-il payé pour 1 h de travail ?</p><p><b>b)</b> La semaine prochaine, il prévoit de travailler ${J.h2} h. Quelle somme va-t-il gagner ?</p><p><b>c)</b> La semaine dernière, il a gagné ${E(J.g3)} €. Combien d'heures a-t-il travaillé ?</p>`,
   c:`<p><b>a)</b> ${E(J.g)} ÷ ${J.H} = ${E(J.r)} : il est payé <b>${E(J.r)} €</b> pour 1 h.</p><p><b>b)</b> ${J.h2} × ${E(J.r)} = ${E(J.h2*J.r)} : il va gagner <b>${E(J.h2*J.r)} €</b>.</p><p><b>c)</b> ${E(J.g3)} ÷ ${E(J.r)} = ${J.h3} : il a travaillé <b>${J.h3} h</b>.</p>`},
  {n:"Exercice 3", t:"Au supermarché (calculatrice autorisée)", w:"Sur ton cahier", h:`<p>Les citrons sont vendus à 1 € l'unité.</p><p>Les carottes sont vendues à ${E(S.p)} €/kg.</p>
   <p><b>a)</b> Le prix des citrons est-il proportionnel à leur poids ?</p><p><b>b)</b> Peut-on dire la même chose des carottes ?</p><p><b>c)</b> Quel serait le prix de ${N(S.m1)} kg de carottes ?</p><p><b>d)</b> Quel serait le prix de ${N(S.m2,3)} kg de carottes ?</p>`,
   c:`<p><b>a)</b> Non : les citrons sont vendus à l'unité, le prix dépend du nombre de citrons et pas de leur poids.</p><p><b>b)</b> Oui : les carottes sont vendues au kilogramme, le prix est proportionnel au poids (coefficient ${N(S.p)}).</p>
   <p><b>c)</b> ${N(S.m1)} × ${E(S.p)} = ${N(S.m1*S.p)} : <b>${E(S.m1*S.p)} €</b>.</p><p><b>d)</b> ${N(S.m2,3)} × ${E(S.p)} = ${N(S.m2*S.p,4)} : ${ok2(S.m2*S.p)?"":"environ "}<b>${E(rd(S.m2*S.p,2))} €</b>.</p>`},
  {n:"Exercice 4", t:"Restaurant asiatique", w:"Sur ton cahier", h:`<p>Anna et Philippe achètent des plats asiatiques à emporter. Voici leur commande :</p>
   <div class="attention"><p>${R.a} nems poulet ; ${R.b} samoussas au bœuf ; ${R.c} nems crevettes ;</p><p>${R.d} nems crabe et ${R.e} samoussas au porc ;</p><p>une part de porc au caramel de ${N(R.mp,3)} kg avec une part de riz cantonais de ${R.mr} g.</p></div>
   <p>Le prix de chaque nem et samoussa est de ${E(R.pu)} €.</p><p>Le prix du porc au caramel est de ${R.pp} €/kg.</p><p>Le prix du riz est de ${E(R.pr)} €/kg.</p>
   <p><b>Philippe possède ${R.bud} € en liquide. Doit-il sortir sa carte bleue pour payer ou est-ce que sa monnaie suffira ?</b></p>`,
   c:`<p>Nems et samoussas : ${R.a} + ${R.b} + ${R.c} + ${R.d} + ${R.e} = ${R.nb}.</p>
   <p class="calc">Nems et samoussas : ${R.nb} × ${E(R.pu)} = ${E(R.t1)} €<br>Porc au caramel : ${N(R.mp,3)} × ${R.pp} = ${N(R.t2)} €<br>Riz : ${R.mr} g = ${N(R.mr/1000,3)} kg et ${N(R.mr/1000,3)} × ${E(R.pr)} = ${N(R.t3)} €</p>
   ${ok2(R.tot)?`<p class="calc">Total : ${E(R.t1)} + ${N(R.t2)} + ${N(R.t3)} = ${N(R.tot)} €</p>`:`<p>Total T :</p><p class="calc">T = ${E(R.t1)} + ${N(R.t2)} + ${N(R.t3)}<br>T = ${N(R.tot)}<br>T ≈ ${E(rd(R.tot,2))} €</p>`}
   <p>${R.tot<=R.bud?`${E(rd(R.tot,2))} € &lt; ${R.bud} € : <b>sa monnaie suffira</b>.`:`${E(rd(R.tot,2))} € &gt; ${R.bud} € : <b>il doit sortir sa carte bleue</b>.`}</p>`}
 ]},
 {t:"Compléter un tableau avec le produit en croix", e:[
  {n:"Exercice 5", t:"Journaux à imprimer", w:"Sur ton cahier", h:`<p>La masse d'un rouleau de papier est proportionnelle à la longueur de papier.</p>${tab(["Masse (en kg)",N(JO.M),N(JO.M2)],[["Longueur (en km)",String(JO.L),"<i>y</i>"]])}
   <p><b>a)</b> Calcule la valeur de <i>y</i>. Explique l'ensemble de tes calculs.</p><p><b>b)</b> Interprète ce résultat.</p>`,
   c:`${croix(N(JO.M),String(JO.L),N(JO.M2),"!y")}<p><b>a)</b> D'après l'égalité des produits en croix :</p><p class="calc">${N(JO.M)} × <i>y</i> = ${JO.L} × ${N(JO.M2)}<br><i>y</i> = ${F(`${JO.L} × ${N(JO.M2)}`,N(JO.M))}<br><i>y</i> = ${F(N(JO.L*JO.M2),N(JO.M))}<br><i>y</i> = ${N(JO.y)}</p><p><b>b)</b> Un rouleau de ${N(JO.M2)} kg contient <b>${N(JO.y)} km</b> de papier.</p>`},
  {n:"Exercice 6", t:"Voyage au Royaume-Uni", w:"Sur ton cahier", h:`<p>Le cours de la livre sterling est de ${E(UK.t)} € : 1 £ = ${E(UK.t)} €.</p><p>Avant de partir, j'ai échangé ${UK.e} € dans un bureau de change.</p><p>Combien ai-je de livres sterling pour mon voyage ?</p>`,
   c:`${tab(["Livres sterling (£)","1","<i>x</i>"],[["Euros (€)",E(UK.t),String(UK.e)]])}<p class="calc"><i>x</i> × ${E(UK.t)} = 1 × ${UK.e}<br><i>x</i> = ${UK.e} ÷ ${E(UK.t)}<br><i>x</i> ${app(UK.e/UK.t)}</p><p>J'ai ${ok2(UK.e/UK.t)?"":"environ "}<b>${E(rd(UK.e/UK.t,2))} £</b>.</p>`},
  {n:"Exercice 7", t:"Voyage aux États-Unis", w:"Sur ton cahier", h:`<p>L'an dernier, Zoé a échangé ${US.e1} € contre ${E(US.d1)} $.</p><p>Le cours du dollar n'a pas changé et cette fois, elle échange avant de partir ${US.e2} €.</p><p>Combien aura-t-elle de dollars ?</p>`,
   c:`${tab(["Euros (€)",String(US.e1),String(US.e2)],[["Dollars ($)",E(US.d1),"<i>x</i>"]])}<p class="calc">${US.e1} × <i>x</i> = ${E(US.d1)} × ${US.e2}<br><i>x</i> = ${F(`${E(US.d1)} × ${US.e2}`,US.e1)}<br><i>x</i> = ${F(N(US.d1*US.e2),US.e1)}<br><i>x</i> ${app(US.d1*US.e2/US.e1)}</p><p>Zoé aura ${ok2(US.d1*US.e2/US.e1)?"":"environ "}<b>${E(rd(US.d1*US.e2/US.e1,2))} $</b>.</p>`},
  {n:"Exercice 8", t:"Livre sterling", w:"Sur ton cahier", h:`<p>Le cours de la livre sterling est de ${E(SO.t)} €. Sophie achète sur internet ${SOn} places pour un concert à Londres. Elle paie ${N(SO.p)} livres sterling.</p><p><b>Combien coûte en euros une place de concert ?</b></p>`,
   c:`<p>1 £ = ${E(SO.t)} €, donc le prix P en euros de ${N(SO.p)} £ :</p><p class="calc">P = ${N(SO.p)} × ${E(SO.t)}<br>P = ${N(SO.p*SO.t)} €</p><p>Pour une place : ${N(SO.p*SO.t)} ÷ ${SO.n} = ${E(SO.p*SO.t/SO.n)}.</p><p>Une place coûte <b>${E(SO.p*SO.t/SO.n)} €</b>.</p>`}
 ]},
 {t:"Démontrer qu'un tableau est proportionnel", e:[
  {n:"Activité 2", t:"Bracelets en élastiques", w:"Sur ton cahier", h:`<p>Louise veut acheter des sachets d'élastiques. Elle a le choix entre :</p>${tab(["Le Bazar","Netbracelet"],[[`${E(BR.pb)} € le sachet`,`${E(BR.pn)} € le sachet + frais de port ${E(BR.fp)} €`]])}
   <p><b>a)</b> Complète un tableau pour chaque magasin (4, 8 et 10 sachets). Explique le choix de magasin de Louise selon le nombre de sachets.</p><p><b>b)</b> Indique pour chaque tableau si c'est un tableau de proportionnalité. <b>Explique.</b></p>`,
   c:`${tab(["Nombre de sachets achetés",...BR.cols.map(String)],[["Prix chez « Le Bazar » en €",...BR.cols.map(n=>E(priceB(n)))],["Prix chez « Netbracelet » en €",...BR.cols.map(n=>E(priceN(n)))]])}
   <p><b>a)</b> ${BR.cols.map(n=>`${n} sachets : ${priceB(n)<priceN(n)?"Le Bazar":"Netbracelet"} (${E(Math.min(priceB(n),priceN(n)))} € &lt; ${E(Math.max(priceB(n),priceN(n)))} €)`).join(" · ")}</p><p>Le Bazar est moins cher jusqu'à ${Math.floor(BR.s)} sachets, Netbracelet à partir de ${Math.floor(BR.s)+1} sachets.</p>
   <p><b>b)</b> Le Bazar : ${BR.cols.map(n=>`${E(priceB(n))} ÷ ${n} = ${N(BR.pb)}`).join(" ; ")}. Les quotients sont égaux : <b>c'est un tableau de proportionnalité</b>.</p>
   <p>Netbracelet : ${E(priceN(4))} ÷ 4 = ${N(priceN(4)/4,3)} et ${E(priceN(8))} ÷ 8 ${Number.isInteger(rd(priceN(8)/8*1000,6))?"=":"≈"} ${N(priceN(8)/8,3)}. Les quotients sont différents : <b>ce n'est pas un tableau de proportionnalité</b> (à cause des frais de port).</p>`},
  {n:"Exercice 9", t:"Situations de proportionnalité ?", w:"Sur ton cahier", h:`<p>Parmi les situations suivantes, lesquelles sont des situations de proportionnalité ? <b>Justifie.</b></p>${SIT.map((T,i)=>`<p><b>${"ab"[i]})</b></p>${tab([T.h[0],...T.x.map(x=>N(x))],[[T.h[1],...T.y.map(y=>N(y))]])}`).join("")}`,
   c:SIT.map((T,i)=>`<p><b>${"ab"[i]})</b> ${T.x.map((x,j)=>`${N(T.y[j])} ÷ ${N(x)} ${Number.isInteger(rd(T.y[j]/x*1000,6))?"=":"≈"} ${N(T.y[j]/x,3)}`).join(" ; ")}. ${T.ok?`Les quotients sont égaux : <b>c'est une situation de proportionnalité</b>.`:`Les quotients ne sont pas tous égaux : <b>ce n'est pas une situation de proportionnalité</b>.`}</p>`).join("")},
  {n:"Exercice 11", t:"Pack de yaourts", w:"Sur ton cahier", h:`<p>Un pack de ${Y.n1} yaourts coûte ${E(Y.p1)} €. Un pack de ${Y.n2} yaourts de la même marque est vendu à ${E(Y.p2)} €.</p><p>Le prix du pack est-il proportionnel au nombre de yaourts ? Explique.</p>`,
   c:`<p class="calc">${E(Y.p1)} ÷ ${Y.n1} = ${N(Y.u)} · ${E(Y.p2)} ÷ ${Y.n2} = ${N(Y.u2)}</p><p>${N(Y.u)} ≠ ${N(Y.u2)} : le prix du pack <b>n'est pas proportionnel</b> au nombre de yaourts.</p>`}
 ]},
 {t:"Pour aller plus loin : les défis", e:[
  {n:"Défi 1", t:"Le jardinier", w:"Sur ton cahier", h:`<p>Un jardinier utilise ${N(D1.L)} L d'eau pour arroser pendant ${D1.j} jours un potager de ${D1.s} m<sup>2</sup>.</p><p>Quelle quantité d'eau va-t-il utiliser pour arroser pendant ${D1.j2} jours un potager de ${D1.s2} m<sup>2</sup> ?</p>`,
   c:`<p>En 1 jour, pour ${D1.s} m<sup>2</sup> : ${N(D1.L)} ÷ ${D1.j} = ${N(D1.L/D1.j)} L.</p><p>En 1 jour, pour 1 m<sup>2</sup> : ${N(D1.L/D1.j)} ÷ ${D1.s} = ${N(D1.q)} L.</p><p>${N(D1.q)} × ${D1.s2} × ${D1.j2} = ${N(D1.R)} : il va utiliser <b>${N(D1.R)} L</b> d'eau.</p>`},
  {n:"Défi 3", t:"Le budget essence", w:"Sur ton cahier", h:`<p>La voiture de Laura consomme ${D3.c} L pour 100 km. Laura parcourt en moyenne ${D3.km} km par semaine.</p><p>Avant le 1<sup>er</sup> juin, 1 L d'essence coûte ${E(D3.p)} €. Le 1<sup>er</sup> juin, le prix augmente de ${Math.round(D3.a*100)} centimes.</p><p>Laura veut conserver le même budget pour l'essence : elle prendra plus souvent son vélo.</p><p><b>Combien de kilomètres doit-elle parcourir en vélo chaque semaine ?</b></p>`,
   c:`<p>Essence pour ${D3.km} km : ${D3.km} ÷ 100 × ${D3.c} = ${N(D3.L)} L. Budget : ${N(D3.L)} × ${E(D3.p)} = ${E(D3.B)} €.</p><p>Nouveau prix : ${E(D3.p+D3.a)} €. ${E(D3.B)} ÷ ${E(D3.p+D3.a)} = ${N(D3.L2)} L.</p><p>Avec ${N(D3.L2)} L, elle roule ${N(D3.L2)} ÷ ${D3.c} × 100 = ${N(D3.km2)} km.</p><p>${D3.km} − ${N(D3.km2)} = ${N(D3.km-D3.km2)} : elle doit parcourir <b>${N(D3.km-D3.km2)} km en vélo</b>.</p>`}
 ]}
];
};
