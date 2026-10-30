/* 6e · chapitre 12 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres */
TRAIN["6e-12"] = function(){
const {ri, pick, shuf, distinct, items} = TR;
const {ptab, D} = window.FIG12;
const L = "abcdefgh";
const M = c => c%100===0 ? D(c/100) : D(c,2).includes(",") && D(c,2).split(",")[1].length===1 ? D(c,2)+"0" : D(c,2);

/* ---------- A. Reconnaître ---------- */
/* tableau à coefficient entier ou décimal (k en dixièmes), proportionnel ou non */
const tab = prop => { const k=pick([ri(2,9)*10, ri(11,49)]), c=distinct(3, ()=>ri(2,12), x=>x).sort((a,b)=>a-b), v=c.map(x=>x*k); if(!prop){ const j=ri(1,2); v[j]+=pick([-10,10,20,-5,5]); } return {c, v, k, prop}; };
const t1 = shuf([tab(true), tab(true), tab(false), tab(false)]);
const just = t => { const r=t.c.map((x,i)=>{ const q=t.v[i]*10/x; return `${D(t.v[i],1)} ÷ ${x} ${Number.isInteger(q)?"= "+D(q,2):"≈ "+D(Math.round(q),2)}`; }); return r.join(" ; "); };
const p2 = ri(2,4), u2 = ri(9,15)*10, n2 = p2+ri(3,6), bad2 = n2*u2 - pick([10,20,30,40]);
const secA = {t:"Reconnaître une situation de proportionnalité", e:[
  {n:"Exercice 1", t:"Des tableaux", w:"Sur ton cahier", h:`<p>Pour chaque tableau, dis si c'est un tableau de proportionnalité. Si oui, donne le coefficient.</p>${t1.map((t,i)=>`<p>${L[i]})</p>${ptab(["Grandeur 1","Grandeur 2"],t.c,t.v.map(x=>D(x,1)))}`).join("")}`,
   c:t1.map((t,i)=>`<p>${L[i]}) ${just(t)} : ${t.prop?`<b>oui, coefficient ${D(t.k,1)}</b>`:"<b>non</b>, les résultats sont différents"}.</p>`).join("")},
  {n:"Exercice 2", t:"Le prix du pain", w:"Sur ton cahier", h:`<p>${p2} pains coûtent ${M(p2*u2)} € et ${n2} pains coûtent ${M(bad2)} €. Fais un tableau, puis dis si le prix est proportionnel au nombre de pains.</p>`,
   c:`${ptab(["Nombre de pains","Prix (en €)"],[p2,n2],[M(p2*u2),M(bad2)])}<p>${M(p2*u2)} ÷ ${p2} = ${M(u2)}, mais ${n2} × ${M(u2)} = ${M(n2*u2)}, et non ${M(bad2)}. <b>Le prix n'est pas proportionnel</b> au nombre de pains (les gros achats sont moins chers).</p>`},
  {n:"Exercice 3", t:"Vrai ou faux ?", w:"Sur ton cahier", h:`<p>a) Une baguette coûte 1,10 €. Donc 5 baguettes coûtent 5 × 1,10 €.</p><p>b) Un bébé de 3 mois pèse 6 kg. À 6 mois, il pèsera 12 kg.</p><p>c) Une imprimante imprime 20 pages en 1 min. En 5 min, au même rythme, elle imprime 100 pages.</p><p>d) Avec 2 € de plus, on a toujours 2 fois plus de bonbons.</p>`,
   c:`<p>a) <b>Vrai</b> : le prix est proportionnel au nombre de baguettes.</p><p>b) <b>Faux</b> : la masse n'est pas proportionnelle à l'âge.</p><p>c) <b>Vrai</b> : au même rythme, le nombre de pages est proportionnel à la durée : 5 × 20 = 100.</p><p>d) <b>Faux</b> : ajouter 2 €, ce n'est pas multiplier par 2.</p>`}
 ]};

/* ---------- B. Quatrième proportionnelle ---------- */
const pl = ri(3,5), pu = ri(4,9), pm = pl+pick([1,2,3]);
const rp = pick([4,6]), rq = rp===4?[8,6]:[3,9];
const ing = [["Œufs",2*ri(1,2),1],["Sucre (en g)",10*ri(6,15)*(rp===4?2:1),1],["Chocolat (en g)",50*ri(2,5),1],["Beurre (en g)",20*ri(2,6),1]];
if(rp===6) ing[0][1] = 2*ri(2,3);
const q = (v,n) => v*n/rp;
const k6 = ri(3,9), c6 = [2,3,5], c6b = [k6*10, k6*20];
const pp = pick([2,3,4]), pd = pick([1,2,3]);
const k7a = pick([[15,1],[25,1],[35,1],[12,1],[45,1]]), k7b = pick([[4,1],[8,1],[6,1]]);
const secB = {t:"Calculer une quatrième proportionnelle", e:[
  {n:"Exercice 4", t:"Les places de cinéma", w:"Sur ton cahier", h:`<p>${pl} places de cinéma coûtent ${pl*pu} €. Le prix est proportionnel au nombre de places. Combien coûtent ${pm} places ?</p>`,
   c:`${ptab(["Nombre de places","Prix (en €)"],[pl,1,pm],[pl*pu,pu,pm*pu],{red:[[1,1],[1,2]],arcs:[{a:0,b:1,t:"÷ "+pl},{a:1,b:2,t:"× "+pm}]})}<p>1 place coûte ${pl*pu} ÷ ${pl} = ${pu} €. ${pm} places coûtent ${pm} × ${pu} = ${pm*pu} €. <b>${pm} places coûtent ${pm*pu} €.</b></p>`},
  {n:"Exercice 5", t:"La recette", w:"Sur ton cahier", h:`<p>Voici une recette pour ${rp} personnes. Complète pour ${rq[0]} et pour ${rq[1]} personnes.</p><div class="scroll"><table class="std"><thead><tr><th>Ingrédient</th><th>Pour ${rp}</th><th>Pour ${rq[0]}</th><th>Pour ${rq[1]}</th></tr></thead><tbody>${ing.map(([n,v])=>`<tr><th>${n}</th><td>${v}</td><td></td><td></td></tr>`).join("")}</tbody></table></div>`,
   c:`<p>${rp===4?"Pour 8 : × 2. Pour 6 : 4 personnes + 2 personnes (la moitié), soit × 1,5.":"Pour 3 : la moitié (÷ 2). Pour 9 : 6 personnes + 3 personnes, soit × 1,5."}</p><div class="scroll"><table class="std"><thead><tr><th>Ingrédient</th><th>Pour ${rp}</th><th>Pour ${rq[0]}</th><th>Pour ${rq[1]}</th></tr></thead><tbody>${ing.map(([n,v])=>`<tr><th>${n}</th><td>${v}</td><td><b>${D(q(v,rq[0])*10,1)}</b></td><td><b>${D(q(v,rq[1])*10,1)}</b></td></tr>`).join("")}</tbody></table></div>`},
  {n:"Exercice 6", t:"Compléter des tableaux", w:"Sur ton cahier", h:`<p>Ces tableaux sont des tableaux de proportionnalité. Complète-les.</p><p>1)</p>${ptab(["Masse (en kg)","Prix (en €)"],[c6[0],c6[1],c6[2],"",""],[c6[0]*k6,"","",c6b[0],c6b[1]])}<p>2)</p>${ptab(["Nombre de pas","Distance (en m)"],[pp,4*pp,5*pp],[pd,"",""])}`,
   c:`<p>1) Coefficient : ${c6[0]*k6} ÷ ${c6[0]} = ${k6}.</p>${ptab(["Masse (en kg)","Prix (en €)"],[...c6,10,20],[c6[0]*k6,c6[1]*k6,c6[2]*k6,...c6b],{red:[[1,1],[1,2],[0,3],[0,4]],coef:"× "+k6,cw:54})}<p>2) ${4*pp} pas = 4 × ${pp} pas → 4 × ${pd} = ${4*pd} m. ${5*pp} pas = ${4*pp} + ${pp} pas → ${4*pd} + ${pd} = ${5*pd} m.</p>${ptab(["Nombre de pas","Distance (en m)"],[pp,4*pp,5*pp],[pd,4*pd,5*pd],{red:[[1,1],[1,2]],arcs:[{a:0,b:1,t:"× 4",pos:"b"}]})}`},
  {n:"Exercice 7", t:"Avec le coefficient", w:"Sur ton cahier", h:`<p>Calcule le coefficient, puis complète.</p><p>a)</p>${ptab(["Grandeur 1","Grandeur 2"],[2,3,6,"0,5"],[D(2*k7a[0],k7a[1]),"","",""])}<p>b)</p>${ptab(["Grandeur 1","Grandeur 2"],[5,7,15,"2,5"],[D(5*k7b[0],k7b[1]),"","",""])}`,
   c:`<p>a) Coefficient : ${D(2*k7a[0],1)} ÷ 2 = <b>${D(k7a[0],1)}</b>.</p>${ptab(["Grandeur 1","Grandeur 2"],[2,3,6,"0,5"],[D(2*k7a[0],1),D(3*k7a[0],1),D(6*k7a[0],1),D(5*k7a[0],2)],{red:[[1,1],[1,2],[1,3]],coef:"× "+D(k7a[0],1)})}<p>b) Coefficient : ${D(5*k7b[0],1)} ÷ 5 = <b>${D(k7b[0],1)}</b>.</p>${ptab(["Grandeur 1","Grandeur 2"],[5,7,15,"2,5"],[D(5*k7b[0],1),D(7*k7b[0],1),D(15*k7b[0],1),D(25*k7b[0],2)],{red:[[1,1],[1,2],[1,3]],coef:"× "+D(k7b[0],1)})}`}
 ]};

/* ---------- C. Problèmes ---------- */
const ins = ri(2,5), ph = pick([150,200,250]), H = [1,2,4,6];
const br = ri(3,6), bp = br*pick([2,3])*pick([1,2]) /* prix total divisible */, bm = pick([3,4,5]), bl = pick([5,6,7,8]);
const cons = ri(5,8), km1 = pick([200,250,300,350]), km2 = pick([20,30,40,50]);
const deb = ri(4,9), mn = pick([2,3,4]), vol = deb*pick([20,25,30]);
const ph2 = pick([[20,3],[25,3],[40,6],[50,4]]), nph = pick([60,80,100,120]);
const secC = {t:"Résoudre des problèmes", e:[
  {n:"Exercice 8", t:"Attention au piège !", w:"Sur ton cahier", h:`<p>Pour louer un vélo, on paie ${ins} € d'inscription, puis ${M(ph)} € par heure.</p><p>1) Complète le tableau.</p>${ptab(["Durée (en h)","Prix (en €)"],H,["","","",""])}<p>2) Le prix est-il proportionnel à la durée ? Justifie.</p><p>3) Zoé dit : « Pour 2 h je paie ${M(ins*100+2*ph)} €, donc pour 4 h je paierai ${M(2*(ins*100+2*ph))} €. » A-t-elle raison ?</p>`,
   c:`${ptab(["Durée (en h)","Prix (en €)"],H,H.map(h=>M(ins*100+h*ph)),{red:[[1,0],[1,1],[1,2],[1,3]]})}<p>2) ${M(ins*100+ph)} ÷ 1 = ${M(ins*100+ph)} et ${M(ins*100+2*ph)} ÷ 2 = ${M((ins*100+2*ph)/2)} : <b>ce n'est pas proportionnel</b> (à cause de l'inscription).</p><p>3) <b>Non</b> : pour 4 h, on paie ${ins} + ${M(ph)} × 4 = <b>${M(ins*100+4*ph)} €</b>. L'inscription ne se paie qu'une fois.</p>`},
  {n:"Exercice 9", t:"Des problèmes", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> ${br} bracelets identiques coûtent ${bp} €. Combien coûtent ${br*bm} bracelets ? Combien de bracelets peut-on acheter avec ${bp*bl} € ?</p><p><b>Problème 2 :</b> une voiture consomme ${cons} L pour 100 km. Combien consomme-t-elle pour ${km1} km ? Et pour ${km2} km ?</p><p><b>Problème 3 :</b> un robinet débite ${deb*mn} L en ${mn} min. Combien de litres coulent en 10 min ? Combien de temps faut-il pour remplir ${vol} L ?</p><p><b>Problème 4 :</b> ${ph2[0]} photocopies coûtent ${ph2[1]} €. Combien coûtent ${nph} photocopies ?</p>`,
   c:`<p><b>Problème 1 :</b> ${br*bm} = ${bm} × ${br}, donc ${bm} × ${bp} = <b>${bm*bp} €</b>. ${bp*bl} € = ${bl} × ${bp} €, donc ${bl} × ${br} = <b>${bl*br} bracelets</b>.</p><p><b>Problème 2 :</b> coefficient ${cons} ÷ 100 = ${D(cons,2)}. ${km1} × ${D(cons,2)} = <b>${D(km1*cons,2)} L</b> ; ${km2} × ${D(cons,2)} = <b>${D(km2*cons,2)} L</b>.</p><p><b>Problème 3 :</b> en 1 min : ${deb*mn} ÷ ${mn} = ${deb} L. En 10 min : <b>${10*deb} L</b>. Pour ${vol} L : ${vol} ÷ ${deb} = <b>${vol/deb} min</b>.</p><p><b>Problème 4 :</b> 1 photocopie coûte ${ph2[1]} ÷ ${ph2[0]} = ${D(ph2[1]*1000/ph2[0],3)} €. ${nph} × ${D(ph2[1]*1000/ph2[0],3)} = ${D(nph*ph2[1]*1000/ph2[0],3)}. <b>${nph} photocopies coûtent ${M(nph*ph2[1]*100/ph2[0])} €.</b></p>`}
 ]};

return [secA, secB, secC];
};
