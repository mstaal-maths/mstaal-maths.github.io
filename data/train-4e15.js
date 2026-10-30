/* 4e · chapitre 15 — fiche d'entraînement : les exercices de M. Staal (fiche et exercices donnés), avec d'autres nombres. */
TRAIN["4e-15"] = function(){
const {ri, pick, shuf, distinct} = TR;
const {ptab, tab, N, E, F, exact, rd, BISC} = window.P415;
const isInt = x => Number.isInteger(rd(x,6));
const app = (t,q) => `P = ${F(N(t),100)} × ${N(q)}<br>P = ${N(t/100)} × ${N(q)}<br>P = ${N(t*q/100)}`;

/* ===== appliquer ===== */
const A = (()=>{ let t,n; do{ t=pick([20,40,60,80,30,70]); n=ri(15,120); }while(!isInt(t*n/100)); return {t,n}; })();
const B = (()=>{ let t,n; do{ t=pick([12,24,36,44,48,64]); n=25*ri(4,16); }while(!isInt(t*n/100)); return {t,n}; })();
const C = {t:pick([5,10,15,20,25,35]), m:pick([200,400,500,600,800,1200])};
const BI = (()=>{ const mg=pick([2.4,3.2,3.6,4.5,5.5,6.8]), pr=pick([8,10,12,15]); return {mg, pr, gl:rd(100-mg-pr-pick([0,1,2]),1), m:pick([12,15,20,24,25,30])}; })();

/* ===== chercher ===== */
const D = (()=>{ let n,k; do{ n=pick([20,25,40,45,50,60,75,80]); k=ri(3,n-2); }while(!isInt(k*100/n)); return {n,k}; })();
const EE = (()=>{ let n,k; do{ n=pick([120,160,200,240,320,400]); k=ri(20,n-20); }while(!isInt(k*100/n)); return {n,k}; })();
const FV = (()=>{ const n=pick([24,25,26,27,28,29,30]); let a,b,c; do{ a=ri(8,n-4); b=ri(2,n-a-1); c=n-a-b; }while(c<1||a<=b||b<=c); return {n, v:[a,b,c], p:[a,b,c].map(x=>Math.round(x*100/n))}; })();
const NOMS = shuf(["Claire","Martin","Léo","Inès","Hugo","Sarah"]).slice(0,3);

/* ===== augmentations et réductions ===== */
const P1 = (()=>{ const t=pick([10,15,20,25,30,40]); let p; do{ p=ri(1500,9999)/100; }while(!exact(p*t/100)); return {t,p}; })();
const P2 = (()=>{ const t=pick([2,3,4,5,6,8,10]), s=10*ri(120,250); return {t,s}; })();
const P3 = (()=>{ const t=pick([12.5,15,17.5,20,22.5]), v=1000*ri(8,35); return {t,v}; })();
const G = (()=>{ let m,t; do{ m=ri(18,29)/2; t=pick([4,6,8,10,12,15]); }while(!exact(m*t/100)||m*(1+t/100)>20); return {m,t}; })();

/* ===== chercher une évolution ===== */
const H = (()=>{ let p,t; do{ p=ri(30,120); t=pick([5,10,12.5,15,20,25,7.5]); }while(!exact(p*t/100)); return {p,t,a:rd(p*t/100,2)}; })();
const I = (()=>{ let p,r; do{ p=10*ri(15,60); r=5*ri(4,30); }while(r>=p/2||isInt(r*100/p)); return {p,r,pc:Math.round(r*100/p)}; })();
const J = (()=>{ let p,t; do{ p=ri(20,90); t=pick([15,20,25,30,35,40,45]); }while(!exact(p*t/100)); return {p,t,n:rd(p*(100-t)/100,2)}; })();
const W = (()=>{ let a,t; do{ a=ri(120,300); t=pick([2,3,4,5,6,8]); }while(!isInt(a*t/100)); return {a,t,b:a+a*t/100}; })();
const AM = (()=>{ const a=pick([5,6,6.25,7.5,8,8.75]); let t,b; do{ t=pick([4,8,10,12,16,20]); b=rd(a*(100-t)/100,4); }while(!exact(b*100)); return {a,b,t}; })();

return [
 {t:"Appliquer un pourcentage", e:[
  {n:"Exercice A", t:"Les poules rousses", w:"Sur ton cahier", h:`<p>Dans un poulailler de ${A.n} poules, ${A.t} % des poules sont rousses. Combien y a-t-il de poules rousses ?</p>`,
   c:`${ptab({h1:"Nombre de poules rousses",h2:"Nombre total de poules",r1:[String(A.t),"!"+N(A.t*A.n/100)],r2:["100",String(A.n)]})}<p class="calc">${app(A.t,A.n)}</p><p>Il y a <b>${N(A.t*A.n/100)} poules rousses</b>.</p>`},
  {n:"Exercice B", t:"Les filles du club", w:"Sur ton cahier", h:`<p>Un club sportif compte ${B.n} licenciés. ${B.t} % des licenciés sont des filles. Combien de filles sont licenciées ?</p>`,
   c:`<p class="calc">${app(B.t,B.n)}</p><p>Il y a <b>${N(B.t*B.n/100)} filles licenciées</b>.</p>`},
  {n:"Exercice C", t:"Le sucre", w:"Sur ton cahier", h:`<p>Léa prépare un gâteau de ${C.m} g. Le sucre représente ${C.t} % de la masse du gâteau. Quelle masse de sucre a-t-elle utilisée ?</p>`,
   c:`<p class="calc">${app(C.t,C.m)}</p><p>Elle a utilisé <b>${N(C.t*C.m/100)} g de sucre</b>.</p>`},
  {n:"Exercice 1", t:"Le paquet de biscuits", w:"Sur ton cahier", h:`<p>Sur un paquet de biscuits, on a relevé les informations suivantes :</p>${BISC(N(BI.mg),N(BI.pr),N(BI.gl),BI.m)}<p>Quelle est la masse de matières grasses dans un biscuit ?</p>`,
   c:`<p class="calc">${app(BI.mg,BI.m)}</p><p>Il y a <b>${N(BI.mg*BI.m/100)} g de matières grasses</b> dans un biscuit.</p>`}
 ]},
 {t:"Chercher un pourcentage", e:[
  {n:"Exercice D", t:"Les vaches noires", w:"Sur ton cahier", h:`<p>Dans une ferme, ${D.k} vaches sur ${D.n} sont noires. Quel est le pourcentage de vaches noires ?</p>`,
   c:`${ptab({h1:"Nombre de vaches noires",h2:"Nombre total de vaches",r1:[String(D.k),"!"+N(D.k*100/D.n)],r2:[String(D.n),"100"]})}<p class="calc">p = ${F(D.k,D.n)}<br>p = ${N(D.k/D.n)}<br>p = ${F(N(D.k*100/D.n),100)}<br>p = ${N(D.k*100/D.n)} %</p><p>Il y a <b>${N(D.k*100/D.n)} % de vaches noires</b>.</p>`},
  {n:"Exercice E", t:"Les filles d'un autre club", w:"Sur ton cahier", h:`<p>Un club compte ${EE.n} licenciés, dont ${EE.k} filles. Quel est le pourcentage de filles dans ce club ?</p>`,
   c:`<p class="calc">p = ${F(EE.k,EE.n)}<br>p = ${N(EE.k/EE.n)}<br>p = ${F(N(EE.k*100/EE.n),100)}<br>p = ${N(EE.k*100/EE.n)} %</p><p>Il y a <b>${N(EE.k*100/EE.n)} % de filles</b>.</p>`},
  {n:"Exercice F", t:"L'élection du délégué", w:"Sur ton cahier", h:`<p>Pour élire le délégué, les ${FV.n} élèves de la classe ont voté.</p>${tab(["Candidat",...NOMS],[["Nombre de voix",...FV.v.map(String)]])}<p>Calcule le pourcentage de voix de chaque candidat. Arrondis à l'unité.</p>`,
   c:`${FV.v.map((v,i)=>`<p>• ${NOMS[i]} :</p><p class="calc">p = ${F(v,FV.n)}<br>p ${isInt(v*100/FV.n)?"=":"≈"} ${N(rd(v/FV.n,2))}<br>p ${isInt(v*100/FV.n)?"=":"≈"} <b>${FV.p[i]} %</b></p>`).join("")}<p>${FV.p.join(" % + ")} % = ${FV.p.reduce((a,b)=>a+b,0)} %${FV.p.reduce((a,b)=>a+b,0)===100?".":" : on ne trouve pas exactement 100 % car les pourcentages sont arrondis."}</p>`}
 ]},
 {t:"Appliquer un pourcentage d'augmentation ou de réduction", e:[
  {n:"Exercice 2", t:"Différentes situations", w:"Sur ton cahier", h:`<p><b>Problème 1 –</b> Pendant les soldes, Sophie achète un pantalon qui a une réduction de ${P1.t} %. Ce pantalon coûte à la base ${E(P1.p)} €. Combien va-t-elle le payer ?</p>
   <p><b>Problème 2 –</b> Le salaire de Paul était de ${N(P2.s)} €. Il a augmenté de ${P2.t} %. Combien gagne-t-il aujourd'hui ?</p><p><b>Problème 3 –</b> Une voiture perd ${N(P3.t)} % de sa valeur chaque année. Olivier l'achète ${N(P3.v)} €. Quelle sera sa valeur un an plus tard ?</p>`,
   c:`<p><b>Problème 1 :</b> ${N(P1.t/100)} × ${E(P1.p)} = ${E(P1.p*P1.t/100)}. ${E(P1.p)} − ${E(P1.p*P1.t/100)} = ${E(P1.p*(100-P1.t)/100)} : le pantalon coûte <b>${E(P1.p*(100-P1.t)/100)} €</b>.</p>
   <p><b>Problème 2 :</b> ${N(P2.t/100)} × ${N(P2.s)} = ${N(P2.s*P2.t/100)}. ${N(P2.s)} + ${N(P2.s*P2.t/100)} = ${N(P2.s*(100+P2.t)/100)} : il gagne <b>${E(P2.s*(100+P2.t)/100)} €</b>.</p>
   <p><b>Problème 3 :</b> ${N(P3.t/100)} × ${N(P3.v)} = ${N(P3.v*P3.t/100)}. ${N(P3.v)} − ${N(P3.v*P3.t/100)} = ${N(P3.v*(100-P3.t)/100)} : la voiture vaudra <b>${E(P3.v*(100-P3.t)/100)} €</b>.</p>`},
  {n:"Exercice G", t:"La moyenne de la classe", w:"Sur ton cahier", h:`<p>La moyenne générale d'une classe était de ${N(G.m)}. Elle a augmenté de ${G.t} %. Quelle est la nouvelle moyenne ?</p>`,
   c:`<p>${N(G.t/100)} × ${N(G.m)} = ${N(G.m*G.t/100)} : la moyenne a augmenté de ${N(G.m*G.t/100)} point${G.m*G.t/100>=2?"s":""}.</p><p>${N(G.m)} + ${N(G.m*G.t/100)} = ${N(G.m*(100+G.t)/100)} : la nouvelle moyenne est <b>${N(G.m*(100+G.t)/100)}</b>.</p>`}
 ]},
 {t:"Chercher un pourcentage d'augmentation ou de réduction", e:[
  {n:"Exercice H", t:"Les chaussures", w:"Sur ton cahier", h:`<p>Une paire de chaussures coûtait ${H.p} €. Son prix a augmenté de ${E(H.a)} €. Quel est le pourcentage d'augmentation ?</p>`,
   c:`<p class="calc">p = ${F(E(H.a),H.p)}<br>p = ${N(H.t/100)}<br>p = ${F(N(H.t),100)}<br>p = ${N(H.t)} %</p><p>Le prix a augmenté de <b>${N(H.t)} %</b>.</p>`},
  {n:"Exercice I", t:"La remise", w:"Sur ton cahier", h:`<p>Sur un article qui coûte ${I.p} €, un vendeur fait une remise de ${I.r} €. Quel est le pourcentage de réduction ? Arrondis à l'unité.</p>`,
   c:`<p class="calc">p = ${F(I.r,I.p)}<br>p ≈ ${N(rd(I.r/I.p,2))}<br>p ≈ ${F(I.pc,100)}<br>p ≈ ${I.pc} %</p><p>Le pourcentage de réduction est d'environ <b>${I.pc} %</b>.</p>`},
  {n:"Exercice J", t:"Les lunettes", w:"Sur ton cahier", h:`<p>Une paire de lunettes coûtait ${J.p} €. Elle est maintenant vendue ${E(J.n)} €. Quel est le pourcentage de réduction ?</p>`,
   c:`<p>${J.p} − ${E(J.n)} = ${E(J.p-J.n)} : le prix a baissé de ${E(J.p-J.n)} €.</p><p class="calc">p = ${F(E(J.p-J.n),J.p)}<br>p = ${N(J.t/100)}<br>p = ${F(J.t,100)}<br>p = ${J.t} %</p><p>Le pourcentage de réduction est de <b>${J.t} %</b>.</p>`},
  {n:"Exercice 3", t:"Différentes situations (2)", w:"Sur ton cahier", h:`<p><b>Problème 1 –</b> Une famille a utilisé ${W.a} m³ d'eau en 2017 et ${N(W.b)} m³ en 2018. Quel est le pourcentage d'augmentation de cette consommation ?</p>
   <p><b>Problème 2 –</b> En quelques années, la surface d'une forêt est passée de ${N(AM.a)} millions à ${N(AM.b)} millions de km². Exprime cette diminution en pourcentage.</p>`,
   c:`<p><b>Problème 1 :</b> ${N(W.b)} − ${W.a} = ${N(W.b-W.a)}.</p><p class="calc">p = ${F(N(W.b-W.a),W.a)}<br>p = ${N(W.t/100)}<br>p = ${W.t} %</p><p>La consommation a augmenté de <b>${W.t} %</b>.</p>
   <p><b>Problème 2 :</b> ${N(AM.a)} − ${N(AM.b)} = ${N(AM.a-AM.b)}.</p><p class="calc">p = ${F(N(AM.a-AM.b),N(AM.a))}<br>p = ${N(AM.t/100)}<br>p = ${AM.t} %</p><p>La surface a diminué de <b>${AM.t} %</b>.</p>`}
 ]}
];
};
