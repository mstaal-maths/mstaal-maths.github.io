/* 3e · chapitre 6 — fiche d'entraînement : les exercices de la fiche de M. Staal sur les pourcentages, avec d'autres nombres.
   Toutes les corrections sont calculées par le code (outils window.PCT3 de data/3e-6.js). */
TRAIN["3e-6"] = function(){
const {ri, pick, shuf, distinct} = TR;
const {N, E, E0, P, K, kLine, kChain, rd, evo, tab} = window.PCT3;
const up = t => t>0;

/* ===== 1. Pourcentage d'une quantité ===== */
const A1 = (()=>{ const d=pick([4,5,8]), q=d*ri(3,12)*(d===8?1:2), a=pick(d===4?[1,3]:d===5?[2,3,4]:[3,5,7]), t=pick([12,24,36,48,52,64]); return {d,q,a,t}; })();
const W = {t:pick([85,90,92,95]), m:ri(21,58)/10};
const M = (()=>{ const n=pick([40,60,80,120,200]); let b,c; do{ b=pick([50,60,70,75]); c=pick([5,10,15,20]); }while(b+c>=100 || (n*c)%100); return {n,b,c}; })();
const H = {p:pick([120,150,180,240,320,450]), t:pick([8,12,15,18,24])};
const D = {p:ri(5,40)*2, t:pick([10,20,25,30,40])};
const V = (()=>{ const n=pick([20,25,30]); let a,b; do{ a=pick([20,30,40,44,48,52,60]); b=pick([4,8,10,12,16,20]); }while(a+b>=90 || (n*a)%100 || (n*b)%100); return {n,a,b}; })();
const S = {s:ri(130000,180000)/100, t:pick([1.2,1.8,2.3,2.5,3.1])};

/* ===== 2. Augmenter ===== */
const I2 = {t:pick([10,15,20,25,30]), a:ri(8,40)*5, b:ri(3,15)*2};
const E2 = {p:ri(40,200), t:pick([6,7,9,14,17,23])};
const C2 = shuf([pick([18,36,45,64]), pick([3,4,6,8]), pick([1.5,2.5,3.5,12.5])]);

/* ===== 3. Diminuer ===== */
const D3 = {p:ri(16,70)*5, t:pick([15,20,25,30,35,40])};
const R3 = {a:pick([30,40,50]), b:pick([15,20,25]), p:ri(5000,19999)/100};
const C3 = shuf([pick([12,28,36,55]), pick([2,4,7,9]), pick([0.5,2.5,7.5,12.5])]);
const Q3 = (()=>{ const a=pick([15,35,45,65]), b=pick([15,25,35,40]), c=pick([12,25,40,60]), d=pick([5,15,30,45]);
  return [
   {q:`Un prix a été multiplié par ${N(K(a))} ; il a augmenté de :`, c:[P(rd(K(a)*10,2)), P(a), P(100+a)], g:1, e:`${N(K(a))} = {100/100} + {${a}/100}`},
   {q:`Un prix a été multiplié par ${N(K(-b))} ; il a baissé de :`, c:[P(100-b), P(b), P(rd(K(-b)*10,3))], g:1, e:`${N(K(-b))} = {100/100} − {${b}/100}`},
   {q:`Un prix a augmenté de ${P(c)} ; il a été multiplié par :`, c:[N(c/100), N(K(-c)), N(K(c))], g:2, e:`{100/100} + {${c}/100} = ${N(K(c))}`},
   {q:`Un prix a baissé de ${P(d)} ; il a été multiplié par :`, c:[N(d/100), N(K(-d)), N(K(d))], g:1, e:`{100/100} − {${d}/100} = ${N(K(-d))}`}
  ]; })();
const B3 = {t:pick([4,6,8,15]), p:pick([40,50,60,80])};

/* ===== 4. Évolutions successives ===== */
const PAIRS = [[10,20],[20,30],[-20,10],[-30,20],[40,-40],[-20,25],[25,-20],[-40,50],[50,-20],[-10,-20],[10,-10],[-25,20],[30,-10],[-50,40]];
const evs = shuf(PAIRS);
const verb = t => t>0?`augmente de ${P(t)}`:`baisse de ${P(-t)}`;
const glob = ([a,b]) => { const k=rd(K(a)*K(b),6), t=rd((k-1)*100,4); return {k, t}; };
const globTxt = ([a,b]) => { const {k,t}=glob([a,b]); return t===0 ? `${N(K(a))} × ${N(K(b))} = ${N(k)} : le prix ne change pas.` : `</p><p class="calc">k = ${N(K(a))} × ${N(K(b))}<br>k = ${N(k)}<br>k = {100/100} ${t>0?"+":"−"} {${N(Math.abs(t))}/100}</p><p>Le prix ${t>0?"augmente":"baisse"} de <b>${P(Math.abs(t))}</b>.`; };
const A4 = {p:ri(10,40)*5, t:pick([10,20,30,50])};
const E4 = evs.slice(0,2), Q4 = evs.slice(2,5).map(([a,b])=>[a,b, Math.random()<0.5 ? glob([a,b]).t : a+b]);

/* ===== 5. Valeur initiale et pourcentage d'évolution ===== */
const PI1 = (()=>{ const t=pick([10,12,15,20,25]), pi=ri(6,40)*5; return {t, pi, f:rd(pi*(100-t)/100,2)}; })();
const EV1 = (()=>{ const a=pick([40,45,50,60,75,80]), t=pick([12,16,24,36,44]); return {a, t, b:rd(a*(100+t)/100,2)}; })();
const PB = shuf([
  (()=>{ const t=pick([8,12,15,20]), pi=ri(8,30)*5, f=rd(pi*(100-t)/100,2); return {h:`Après une remise de ${P(t)}, un jeu coûte ${E(f)}. Quel était son prix avant la remise ?`, c:`</p><p class="calc">${kChain(-t)}</p><p class="calc">P<sub>initial</sub> × ${N(K(-t))} = ${E0(f)}<br>P<sub>initial</sub> = ${E0(f)} ÷ ${N(K(-t))}<br>P<sub>initial</sub> = ${E0(pi)}</p><p>Le jeu coûtait <b>${E(pi)}</b>.`}; })(),
  (()=>{ const a=ri(20,90)*100, t=pick([2,3,4,5,6]), b=a*(100+t)/100; return {h:`En une année, la population d'une ville est passée de ${N(a)} à ${N(b)} habitants. Quel est le pourcentage d'augmentation ?`, c:`</p><p class="calc">k = ${N(b)} ÷ ${N(a)}<br>k = ${N(K(t))}<br>k = {100/100} + {${t}/100}</p><p>Augmentation de <b>${P(t)}</b>.`}; })(),
  (()=>{ const a=pick([100,120,150,200,250]), t=pick([8,12,14,16,18]), b=a*(100-t)/100; return {h:`En une année, la consommation d'eau d'une famille est passée de ${N(a)} m<sup>3</sup> à ${N(b)} m<sup>3</sup>. Calcule le pourcentage de diminution.`, c:`</p><p class="calc">k = ${N(b)} ÷ ${N(a)}<br>k = ${N(K(-t))}<br>k = {100/100} − {${t}/100}</p><p>Diminution de <b>${P(t)}</b>.`}; })(),
  (()=>{ const t=pick([2,4,5,10,30]), pi=ri(10,80)*5, f=rd(pi*(100+t)/100,2); return {h:`Un objet coûte ${E(f)} après une hausse de ${P(t)}. Quel était son prix avant la hausse ?`, c:`</p><p class="calc">${kChain(t)}</p><p class="calc">P<sub>initial</sub> × ${N(K(t))} = ${E0(f)}<br>P<sub>initial</sub> = ${E0(f)} ÷ ${N(K(t))}<br>P<sub>initial</sub> = ${E0(pi)}</p><p>L'objet coûtait <b>${E(pi)}</b>.`}; })(),
  (()=>{ const a=pick([40,48,60,64,80,120]), t=pick([10,15,20,25,30,40]), b=a*(100-t)/100; return {h:`Pendant les soldes, un manteau est passé de ${E(a)} à ${E(b)}. Quel a été le pourcentage de remise ?`, c:`</p><p class="calc">k = ${E0(b)} ÷ ${N(a)}<br>k = ${N(K(-t))}<br>k = {100/100} − {${t}/100}</p><p>Remise de <b>${P(t)}</b>.`}; })(),
  (()=>{ const t=pick([3,6,8,12]), p=ri(4,30)*5, f=rd(p*(100+t)/100,2); return {h:`Un abonnement à ${E(p)} augmente de ${P(t)}. Quel est son nouveau montant ?`, c:`</p><p class="calc">${kChain(t)}</p><p>${N(K(t))} × ${N(p)} = <b>${E(f)}</b>.`}; })()
]);

return [
 {t:"Calculer le pourcentage d'une quantité", e:[
  {n:"Exercice 1", t:"Prendre une fraction d'une quantité", w:"Sur ton cahier", h:`<p>Dans chaque cas, indique la somme que je possède. Justifie.</p><p><b>a)</b> J'ai {1/${A1.d}} de ${N(A1.q)} €.</p><p><b>b)</b> J'ai {${A1.a}/${A1.d}} de ${N(A1.q)} €.</p><p><b>c)</b> J'ai ${P(A1.t)} de ${N(A1.q)} €.</p>`,
   c:`<p><b>a)</b> ${N(A1.q)} ÷ ${A1.d} = <b>${E(A1.q/A1.d)}</b></p><p><b>b)</b></p><p class="calc">P = ${A1.a} × ${N(A1.q)} ÷ ${A1.d}<br>P = ${N(A1.a*A1.q)} ÷ ${A1.d}<br>P = <b>${E(A1.a*A1.q/A1.d)}</b></p><p><b>c)</b></p><p class="calc">P = {${A1.t}/100} × ${N(A1.q)}<br>P = ${N(A1.t/100)} × ${N(A1.q)}<br>P = <b>${E(A1.t*A1.q/100)}</b></p>`},
  {n:"Exercice 2", t:"Pourcentage d'eau dans un fruit", w:"Sur ton cahier", h:`<p>En moyenne, une pastèque contient ${P(W.t)} d'eau.</p><p>Quelle masse d'eau contient une pastèque de ${N(W.m)} kg ?</p>`,
   c:`<p class="calc">P = {${W.t}/100} × ${N(W.m)}<br>P = ${N(W.t/100)} × ${N(W.m)}<br>P = <b>${N(rd(W.t*W.m/100,4))} kg</b></p>`},
  {n:"Exercice 3", t:"Troupeau de moutons", w:"Sur ton cahier", h:`<p>Un troupeau est constitué de ${M.n} moutons. ${P(M.b)} d'entre eux sont blancs, ${P(M.c)} sont noirs et les autres sont bruns.</p><p>Combien de moutons sont noirs ?</p>`,
   c:`<p class="calc">P = {${M.c}/100} × ${M.n}<br>P = ${N(M.c/100)} × ${M.n}<br>P = <b>${M.n*M.c/100} moutons noirs</b></p>`},
  {n:"Exercice 4", t:"Une augmentation", w:"Sur ton cahier", h:`<p>Un billet d'avion à ${E(H.p)} augmente de ${P(H.t)}.</p><p>Calcule le montant de l'augmentation, puis le nouveau prix.</p>`,
   c:`<p>Augmentation : ${N(H.t/100)} × ${N(H.p)} = ${E(H.p*H.t/100)}.</p><p>Nouveau prix : ${N(H.p)} + ${E0(H.p*H.t/100)} = <b>${E(H.p*(100+H.t)/100)}</b>.</p>`},
  {n:"Exercice 5", t:"Soldes", w:"Sur ton cahier", h:`<p>Un pull coûtait ${E(D.p)}. Pendant les soldes, son prix a baissé de ${P(D.t)}.</p><p>Calcule le montant de la réduction, puis le prix du pull après réduction.</p>`,
   c:`<p>Réduction : ${N(D.t/100)} × ${N(D.p)} = ${E(D.p*D.t/100)}.</p><p>Prix soldé : ${N(D.p)} − ${E0(D.p*D.t/100)} = <b>${E(D.p*(100-D.t)/100)}</b>.</p>`},
  {n:"Exercice 6", t:"Élections de délégués", w:"Sur ton cahier", h:`<p>Les ${V.n} élèves d'une classe ont voté. Léa a obtenu ${P(V.a)} des voix, Margaux ${P(V.b)} et Nina le reste des voix.</p><p>Combien d'élèves ont voté pour chacune d'elles ?</p>`,
   c:`<p>Léa : ${N(V.a/100)} × ${V.n} = <b>${V.n*V.a/100} élèves</b>.</p><p>Margaux : ${N(V.b/100)} × ${V.n} = <b>${V.n*V.b/100} élèves</b>.</p><p>Nina : ${V.n} − ${V.n*V.a/100} − ${V.n*V.b/100} = <b>${V.n-V.n*V.a/100-V.n*V.b/100} élèves</b> (${P(100-V.a-V.b)} des voix).</p>`},
  {n:"Exercice 7", t:"Un salaire", w:"Sur ton cahier", h:`<p>Un salaire mensuel de ${E(S.s)} augmente de ${P(S.t)}.</p><p>Quel est son nouveau montant ? Arrondis au centime.</p>`,
   c:`<p>Augmentation : ${N(S.t/100)} × ${E0(S.s)} ≈ ${E(S.s*S.t/100)}.</p><p>Nouveau salaire S :</p><p class="calc">S = ${N(K(S.t))} × ${E0(S.s)}<br>S = ${N(rd(S.s*K(S.t),6),6)}<br>S ≈ <b>${E(S.s*K(S.t))}</b></p>`}
 ]},
 {t:"Augmenter une valeur d'un pourcentage", e:[
  {n:"Exercice 8", t:"Deux articles augmentent", w:"Sur ton cahier", h:`<p>Un gérant augmente tous ses prix de ${P(I2.t)}.</p><p>Une planche de surf coûtait ${E(I2.a)} et un ballon de basket ${E(I2.b)}.</p><p>Trouve leurs nouveaux prix <b>en un seul calcul</b> chacun.</p>`,
   c:`<p class="calc">${kChain(I2.t)}</p><p>Planche : ${N(K(I2.t))} × ${N(I2.a)} = <b>${E(I2.a*K(I2.t))}</b>.</p><p>Ballon : ${N(K(I2.t))} × ${N(I2.b)} = <b>${E(I2.b*K(I2.t))}</b>.</p>`},
  {n:"Exercice 9", t:"Une facture qui augmente", w:"Sur ton cahier", h:`<p>Les tarifs d'une compagnie d'énergie augmentent de ${P(E2.t)}.</p><p>Une famille payait une facture annuelle de ${E(E2.p)}.</p><p>Quel sera le montant de sa nouvelle facture ?</p>`,
   c:`<p class="calc">${kChain(E2.t)}</p><p>${N(K(E2.t))} × ${N(E2.p)} = <b>${E(E2.p*K(E2.t))}</b>.</p>`},
  {n:"Exercice 10", t:"Coefficient d'une augmentation", w:"Sur ton cahier", h:`<p>Dans chaque cas, justifie ta réponse.</p>`+C2.map((t,i)=>`<p><b>${"abc"[i]})</b> Augmenter une valeur de ${P(t)} revient à la multiplier par quel nombre ?</p>`).join(""),
   c:`<div class="calcs">${C2.map((t,i)=>`<p class="calc"><b>${"abc"[i]})</b> ${P(t)}<br>${kChain(t)}</p>`).join("")}</div>`}
 ]},
 {t:"Diminuer une valeur d'un pourcentage", e:[
  {n:"Exercice 11", t:"Une réduction en un calcul", w:"Sur ton cahier", h:`<p>Un article coûtait ${E(D3.p)}. Son prix baisse de ${P(D3.t)}.</p><p>Trouve, <b>en un calcul</b>, son prix après réduction.</p>`,
   c:`<p class="calc">${kChain(-D3.t)}</p><p>${N(K(-D3.t))} × ${N(D3.p)} = <b>${E(D3.p*K(-D3.t))}</b>.</p>`},
  {n:"Exercice 12", t:"Soldes au magasin de sport", w:"Sur ton cahier", h:`<p>Pour les soldes, un magasin fait une remise de ${P(R3.a)} sur les chaussures et de ${P(R3.b)} sur tous les vêtements.</p><p>Un manteau coûtait ${E(R3.p)}. Combien coûte-t-il pendant les soldes ? Arrondis au centime.</p>`,
   c:`<p>Un manteau est un vêtement : la remise est de ${P(R3.b)} (les ${P(R3.a)} ne servent pas).</p><p class="calc">P = ${N(K(-R3.b))} × ${E0(R3.p)}<br>P = ${N(rd(R3.p*K(-R3.b),6))}<br>P ≈ <b>${E(R3.p*K(-R3.b))}</b></p>`},
  {n:"Exercice 13", t:"Coefficient d'une diminution", w:"Sur ton cahier", h:`<p>Dans chaque cas, justifie ta réponse.</p>`+C3.map((t,i)=>`<p><b>${"abc"[i]})</b> Diminuer une valeur de ${P(t)} revient à la multiplier par quel nombre ?</p>`).join(""),
   c:`<div class="calcs">${C3.map((t,i)=>`<p class="calc"><b>${"abc"[i]})</b> ${P(t)}<br>${kChain(-t)}</p>`).join("")}</div>`},
  {n:"Exercice 14", t:"Coefficient multiplicateur : QCM", w:"Sur ton cahier", h:`<p>Pour chaque question, choisis la bonne réponse.</p>${tab(["Question","A","B","C"],Q3.map((x,i)=>[`<b>${i+1})</b> ${x.q}`,...x.c]))}`,
   c:Q3.map((x,i)=>`<p><b>${i+1})</b> Réponse ${"ABC"[x.g]} : ${x.e}.</p>`).join("")},
  {n:"Exercice 15", t:"Bilan", w:"Sur ton cahier", h:`<p>Recopie et complète le tableau.</p>${tab(["","Calculs"],[[`Prendre ${P(B3.t)} de ${E(B3.p)}`,""],[`Augmenter ${E(B3.p)} de ${P(B3.t)}`,""],[`Diminuer ${E(B3.p)} de ${P(B3.t)}`,""]])}`,
   c:tab(["","Calculs"],[[`Prendre ${P(B3.t)} de ${E(B3.p)}`,`P = {${B3.t}/100} × ${N(B3.p)}<br>P = ${N(B3.t/100)} × ${N(B3.p)}<br>P = ${E(B3.t*B3.p/100)}`],[`Augmenter ${E(B3.p)} de ${P(B3.t)}`,`{100/100} + {${B3.t}/100} = ${N(K(B3.t))} ; ${N(K(B3.t))} × ${N(B3.p)} = ${E(B3.p*K(B3.t))}`],[`Diminuer ${E(B3.p)} de ${P(B3.t)}`,`{100/100} − {${B3.t}/100} = ${N(K(-B3.t))} ; ${N(K(-B3.t))} × ${N(B3.p)} = ${E(B3.p*K(-B3.t))}`]])}
 ]},
 {t:"Évolutions successives", e:[
  {n:"Exercice 16", t:"Hausse puis baisse", w:"Sur ton cahier", h:`<p>Un gérant augmente ses prix de ${P(A4.t)} en janvier. Un mois après, il les baisse de ${P(A4.t)}.</p><p>Une planche de surf coûtait ${E(A4.p)}.</p><p><b>a)</b> Calcule son prix après chaque évolution. A-t-il baissé, augmenté ou est-il resté le même ?</p><p><b>b)</b> Calcule le pourcentage d'évolution global.</p>`,
   c:`<p><b>a)</b> ${N(K(A4.t))} × ${N(A4.p)} = ${E(A4.p*K(A4.t))}, puis ${N(K(-A4.t))} × ${E0(A4.p*K(A4.t))} = ${E(A4.p*K(A4.t)*K(-A4.t))} : le prix a <b>baissé</b>.</p><p><b>b)</b> ${globTxt([A4.t,-A4.t])}</p>`},
  {n:"Exercice 17", t:"Deux évolutions", w:"Sur ton cahier", h:E4.map(([a,b],i)=>`<p><b>${i+1})</b> Le prix d'un objet ${verb(a)}, puis ce nouveau prix ${verb(b)}. De quel pourcentage a évolué le prix initial ?</p>`).join(""),
   c:E4.map((x,i)=>`<p><b>${i+1})</b> ${globTxt(x)}</p>`).join("")},
  {n:"Exercice 18", t:"Vrai ou faux ?", w:"Sur ton cahier", h:`<p>Pour chaque affirmation, dis si elle est vraie ou fausse. Justifie.</p>`+Q4.map(([a,b,cl],i)=>`<p><b>${i+1})</b> « Un prix qui ${verb(a)} puis ${verb(b)} ${cl===0?"revient au prix de départ":cl>0?`augmente au total de ${P(cl)}`:`baisse au total de ${P(-cl)}`}. »</p>`).join(""),
   c:Q4.map(([a,b,cl],i)=>{ const {t}=glob([a,b]), ok=rd(t,4)===cl; return `<p><b>${i+1}) ${ok?"VRAI":"FAUX"}.</b> ${globTxt([a,b])}</p>`; }).join("")}
 ]},
 {t:"Valeur initiale et pourcentage d'évolution", e:[
  {n:"Exercice 19", t:"Prix initial et pourcentage d'évolution", w:"Sur ton cahier", h:`<p><b>Partie 1 :</b> un article coûte ${E(PI1.f)} après une réduction de ${P(PI1.t)}. Quel était son prix avant la réduction ?</p>${evo({l:["PI","?"], r:["PF",E(PI1.f)], k:"− "+P(PI1.t)})}<p><b>Partie 2 :</b> un objet coûte ${E(EV1.a)}. Après une augmentation, son prix est de ${E(EV1.b)}. Quel est le pourcentage d'augmentation ?</p>${evo({l:["PI",E(EV1.a)], r:["PF",E(EV1.b)], k:"?"})}`,
   c:`<p><b>Partie 1 :</b></p><p class="calc">PI × ${N(K(-PI1.t))} = ${E0(PI1.f)}<br>PI = ${E0(PI1.f)} ÷ ${N(K(-PI1.t))}<br>PI = <b>${E(PI1.pi)}</b></p><p><b>Partie 2 :</b></p><p class="calc">${N(EV1.a)} × k = ${E0(EV1.b)}<br>k = ${E0(EV1.b)} ÷ ${N(EV1.a)}<br>k = ${N(K(EV1.t))}<br>k = {100/100} + {${EV1.t}/100}</p><p>Augmentation de <b>${P(EV1.t)}</b>.</p>`},
  {n:"Exercice 20", t:"Problèmes", w:"Sur ton cahier", h:`<p>Chaque problème est indépendant.</p>`+PB.map((x,i)=>`<p><b>Problème ${i+1} :</b> ${x.h}</p>`).join(""),
   c:PB.map((x,i)=>`<p><b>${i+1})</b> ${x.c}</p>`).join("")}
 ]}
];
};
