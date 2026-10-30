/* 3e · chapitre 23 — fiche d'entraînement : les exercices de M. Staal sur le ratio, avec d'autres nombres.
   Les collections de symboles sont tirées au hasard et dessinées en SVG ; les corrections sont calculées (outils window.RAT3). */
TRAIN["3e-23"] = function(){
const {ri, pick, shuf} = TR;
const {N, R, gcd, sum, syms, mix, bande, SYM_NOM, partage, DE} = window.RAT3;
const pl = (n,w) => n>1 ? w+"s" : w;

/* ===== 1. Écrire un ratio ===== */
const PAIRS = shuf([["X","S"],["M","H"],["H","T"],["S","C"]]);
const E1 = PAIRS.map(([a,b])=>{ let x,y; do{ x=ri(2,10); y=ri(2,14); }while(x===y); return {a,b,x,y,rows:mix(a,x,b,y)}; });
const B = (()=>{ let a,b,c; do{ a=ri(2,12); b=ri(2,12); c=ri(2,12); }while(a===b||b===c||a===c); const k=pick([2,3,4]); let d,e; do{ d=ri(1,6); e=ri(1,6); }while(d===e||gcd(d,e)>1); return {a,b,c,f:ri(3,11),g:ri(3,11),k,d,e}; })();

/* ===== 2. Partager ===== */
const A1 = (()=>{ const r=pick([[2,3],[3,4],[1,3],[3,2],[2,5]]), p=ri(10,60); return {r, Q:sum(r)*p}; })();
const V2 = (()=>{ const r=pick([[3,1],[2,1],[4,1]]), p=pick([50,75,100,125,150,200]); return {r, Q:sum(r)*p}; })();
const S3 = (()=>{ const r=pick([[10,6,5],[8,5,3],[6,4,3],[5,3,2]]), p=pick([10,15,20,25,30,40]); return {r, Q:sum(r)*p}; })();
const C4 = (()=>{ let ages; do{ ages=[ri(3,9),ri(6,12),ri(10,15)]; }while(new Set(ages).size<3); const p=ri(2,6); return {r:ages, Q:sum(ages)*p, noms:shuf(["Horatio","William","Juliette","Léon","Alba","Noé"]).slice(0,3)}; })();
const I5 = (()=>{ const m=pick([[200,300],[300,500],[400,600],[200,500],[300,700],[250,750]]), g=gcd(m[0],m[1]), r=[m[0]/g,m[1]/g], p=pick([250,500,750,1000,1375]); return {m, r, Q:sum(r)*p}; })();
const L6 = (()=>{ const r=pick([[3,5],[2,3],[1,4],[3,7],[4,5]]), p=ri(3,25); return {r, Q:sum(r)*p}; })();

return [
 {t:"Écrire un ratio", e:[
  {n:"Exercice 1", t:"Quel est le ratio ?", w:"Sur ton cahier", h:`<p>Quel est le ratio…</p>`+E1.map((o,i)=>`<p><b>${i+1})</b> … ${DE(SYM_NOM[o.a]+"s")} pour les ${SYM_NOM[o.b]}s ?</p>${syms(o.rows,"Collection de symboles")}`).join(""),
   c:E1.map((o,i)=>`<p><b>${i+1})</b> ${o.x} ${pl(o.x,SYM_NOM[o.a])} et ${o.y} ${pl(o.y,SYM_NOM[o.b])} : <b>${R([o.x,o.y])}</b>.</p>`).join("")},
  {n:"Exercice 2", t:"Ratios de bonbons", w:"Sur ton cahier", h:`<p><b>a)</b> Un paquet contient ${B.f} bonbons à la fraise et ${B.g} au cola. Dans quel ratio sont les bonbons à la fraise et au cola ?</p><p><b>b)</b> Un paquet contient ${B.a} bonbons à la fraise, ${B.b} au cola et ${B.c} au citron. Dans quel ratio sont les bonbons à la fraise, au cola et au citron ?</p><p><b>c)</b> Un paquet contient ${B.d*B.k} bonbons à la fraise et ${B.e*B.k} au cola. Écris ce ratio, puis avec les plus petits nombres entiers possibles.</p>`,
   c:`<p><b>a)</b> <b>${R([B.f,B.g])}</b>.</p><p><b>b)</b> <b>${R([B.a,B.b,B.c])}</b>.</p><p><b>c)</b> <b>${R([B.d*B.k,B.e*B.k])}</b>, et en divisant par ${B.k} : <b>${R([B.d,B.e])}</b>.</p>`}
 ]},
 {t:"Partager une quantité selon un ratio", e:[
  {n:"Exercice 3", t:"Un partage entre deux sœurs", w:"Sur ton cahier", h:`<p>${N(A1.Q)} € sont partagés entre Mona et Ninon dans le ratio ${R(A1.r)}.</p><p>Combien chacune d'elles reçoit-elle ?</p>`,
   c:`${bande(A1.r,["Mona","Ninon"])}${partage(A1.Q,A1.r,["Mona reçoit","Ninon reçoit"])}`},
  {n:"Exercice 4", t:"La vinaigrette", w:"Sur ton cahier", h:`<p>Retrouve la quantité d'huile et de vinaigre pour ${N(V2.Q)} mL de vinaigrette réalisée dans le ratio ${R(V2.r)}.</p>`,
   c:partage(V2.Q,V2.r,[["il faut","d'huile"],["il faut","de vinaigre"]],"mL")},
  {n:"Exercice 5", t:"Le « sable » des biscuits", w:"Sur ton cahier", h:`<p>Un « sable » pour biscuits est réalisé avec de la farine, du beurre et du sucre dans le ratio ${R(S3.r)}.</p><p>Quelles masses de farine, de beurre et de sucre faut-il pour ${N(S3.Q)} g de « sable » ?</p>`,
   c:partage(S3.Q,S3.r,[["il faut","de farine"],["il faut","de beurre"],["il faut","de sucre"]],"g")},
  {n:"Exercice 6", t:"Les chocolats", w:"Sur ton cahier", h:`<p>${C4.noms[0]}, ${C4.noms[1]} et ${C4.noms[2]} ont respectivement ${C4.r[0]}, ${C4.r[1]} et ${C4.r[2]} ans.</p><p>On partage ${C4.Q} chocolats dans le ratio de leurs âges ${R(C4.r)}.</p><p>Combien de chocolats aura chaque enfant ?</p>`,
   c:partage(C4.Q,C4.r,C4.noms.map(n=>n+" aura"),"chocolats")},
  {n:"Exercice 7", t:"L'investissement", w:"Sur ton cahier", h:`<p>J'ai investi ${N(I5.m[0])} € et toi ${N(I5.m[1])} € dans une société.</p><p>Nous avons maintenant ${N(I5.Q)} € à nous partager proportionnellement à nos mises.</p><p>Combien chacun de nous va-t-il obtenir ?</p>`,
   c:`<p>Le ratio est ${R(I5.m)}, ou encore ${R(I5.r)}.</p>${partage(I5.Q,I5.r,["je récupère","tu récupères"])}`},
  {n:"Exercice 8", t:"Le loto", w:"Sur ton cahier", h:`<p>Deux amis ont joué au loto. Leur mise s'est faite selon le ratio ${R(L6.r)}.</p><p>Ils gagnent ${N(L6.Q)} €. Quelle somme revient à chacun d'eux ?</p>`,
   c:partage(L6.Q,L6.r,["le premier reçoit","le second reçoit"])}
 ]}
];
};
