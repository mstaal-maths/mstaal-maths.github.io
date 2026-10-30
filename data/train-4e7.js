/* 4e · chapitre 7 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres.
   Toutes les réductions des corrections sont calculées par l'outil CL7 (défini dans 4e-7.js). */
TRAIN["4e-7"] = function(){
const {ri, pick, shuf, items} = TR;
const {nz, r3, F, X, T, E, R, red, fac, prod, opp, prog, progs, tab, fleche} = window.CL7;
const tail = ts => ts.map(([c,v])=>T(c,v,false)).join("");
const {chns}=window.CHN4;   /* calculs en chaîne « A = … » */
const x=X("x"), n=X("n"), s=X("s");
const NB=["","une","deux","trois","quatre","cinq"];

/* ===== A. Produire une expression littérale ===== */
/* Activité 1 : des tables et des chaises (c chaises sur chaque grand côté de chaque table, e à chaque bout) */
const c1=ri(1,3), e1=ri(1,2), ch=t=>2*c1*t+2*e1, N1=[ri(8,15), ri(30,60)];
/* Exercices 1 à 3 : une suite de motifs qui augmente de p à chaque étape */
const p2=ri(2,7), q2=ri(Math.max(-3,1-p2),6)||1, u=k=>p2*k+q2, K2=ri(30,100);
const OBJ=pick(["carrés","allumettes","jetons","segments"]); const deO=/^[aeiouéè]/.test(OBJ)?"d'"+OBJ:"de "+OBJ;
/* Exercice 4 : deux programmes */
const a4=ri(2,9), b4=ri(1,9), c4=ri(1,9), d4=ri(2,9), t4=ri(2,9);
/* Exercice 5 : modéliser */
const m5={b:ri(2,9), k:ri(2,9), c:ri(1,9), s:ri(2,9), d:ri(1,9), g:pick([2,3,4]), dvd:ri(5,25), f:pick([30,40,50,60]), r:pick([0.05,0.1,0.2,0.15]), q:[ri(2,9),ri(2,9),ri(2,9)], L:ri(2,9)};
const secA={t:"Produire une expression littérale", e:[
  {n:"Activité 1", t:"Des tables et des chaises", w:"Sur ton cahier", h:`<p>On dispose côte à côte des tables rectangulaires pour former une grande table.</p><p>Chaque table a ${c1} chaise${c1>1?"s":""} sur chacun de ses deux grands côtés, et on place ${e1} chaise${e1>1?"s":""} à chaque bout de la grande table.</p>
   <p><b>a)</b> Combien de chaises peut-on disposer avec une table, deux tables et trois tables ?</p><p><b>b)</b> Combien de chaises avec ${N1[0]} tables ? avec ${N1[1]} tables ? Explique.</p><p><b>c)</b> Combien de chaises avec ${n} tables ?</p>`,
   c:`<p><b>a)</b> 1 table : ${ch(1)} · 2 tables : ${ch(2)} · 3 tables : ${ch(3)} chaises.</p><p><b>b)</b> ${N1.map(t=>`${t} tables : ${c1>1?c1+" × ":""}${t} + ${c1>1?c1+" × ":""}${t} + ${2*e1} = <b>${ch(t)}</b> chaises`).join(" · ")}</p><p><b>c)</b> ${c1>1?c1:""}${n} + ${c1>1?c1:""}${n} + ${2*e1} = <b>${R([[2*c1,"n"],[2*e1,""]])}</b> chaises.</p>`},
  {n:"Exercice 1", t:"Une suite de motifs", w:"Sur ton cahier", h:`<p>Voici le nombre ${deO} aux premières étapes d'une suite de motifs :</p>${tab(["Étape","1","2","3","4"],[["Nombre "+deO,...[1,2,3,4].map(k=>String(u(k)))]])}
   <p>À chaque étape, on ajoute toujours le même nombre ${deO}.</p><p><b>a)</b> Combien y en aura-t-il à l'étape 5 ?</p><p><b>b)</b> Combien y en aura-t-il à l'étape ${K2} ?</p><p><b>c)</b> Donne une expression qui calcule le nombre ${deO} à l'étape ${n}.</p>`,
   c:`<p>On ajoute ${p2} ${OBJ} à chaque étape.</p><p><b>a)</b> ${u(4)} + ${p2} = <b>${u(5)}</b></p><p><b>b)</b> ${u(1)} + ${K2-1} × ${p2} = <b>${u(K2)}</b></p><p><b>c)</b> <b>${R([[p2,"n"],[q2,""]])}</b> &nbsp; Vérification : à l'étape 4, ${p2} × 4 ${q2<0?"−":"+"} ${Math.abs(q2)} = ${u(4)}.</p>`},
  {n:"Exercice 4", t:"Programme de calcul", w:"Sur ton cahier", h:`${progs(prog("Programme 1",["Choisir un nombre",`Multiplier par ${a4}`,`Soustraire ${b4}`]),prog("Programme 2",["Choisir un nombre",`Ajouter ${c4}`,`Multiplier par ${d4}`]))}
   <p><b>1)</b> Teste le programme 1 avec le nombre ${t4}.</p><p><b>2)</b> Écris une expression littérale qui donne le résultat du programme 1 avec n'importe quel nombre ${x} choisi au départ.</p><p><b>3)</b> Réponds aux questions 1 et 2 pour le programme 2.</p>`,
   c:`<p><b>1)</b> ${t4} × ${a4} = ${t4*a4} ; ${t4*a4} − ${b4} = <b>${t4*a4-b4}</b></p><p><b>2)</b> ${x} × ${a4} − ${b4} = <b>${R([[a4,"x"],[-b4,""]])}</b></p><p><b>3)</b> ${t4} + ${c4} = ${t4+c4} ; ${t4+c4} × ${d4} = <b>${(t4+c4)*d4}</b> · Expression : <b>(${x} + ${c4}) × ${d4}</b></p>`},
  {n:"Exercice 5", t:"Modéliser par une expression littérale", w:"Sur ton cahier", h:`<p>Modélise chaque situation par une expression littérale.</p>
   <p><b>1)</b> Soit ${X("a")} le nombre choisi : « Choisir un nombre ; élever ce nombre au carré ; soustraire ${m5.b} ». A = ……</p>
   <p><b>2)</b> Soit ${X("b")} le nombre choisi : « Choisir un nombre ; multiplier par ${m5.k} ; ajouter ${m5.c} ». B = ……</p>
   <p><b>3)</b> Soit ${x} le nombre choisi : « Choisir un nombre ; soustraire ${m5.s} ; multiplier par le nombre de départ ; ajouter ${m5.d} ». C = ……</p>
   <p><b>4)</b> Mia achète ${NB[m5.g]} jeux au même prix ${X("p")} (en €) et un DVD à ${m5.dvd} €. Exprime sa dépense totale : D = ……</p>
   <p><b>5)</b> Une location de voiture coûte ${m5.f} € pour le véhicule et ${F(m5.r)} € par kilomètre parcouru. On note ${X("k")} le nombre de kilomètres. E = ……</p>
   <p><b>6)</b> Un quadrilatère a des côtés de longueurs ${x}, ${m5.q[0]}, ${m5.q[1]} et ${m5.q[2]}. Exprime son périmètre F.</p>
   <p><b>7)</b> Un rectangle a pour côtés ${x} et ${m5.L}. Exprime son périmètre K et son aire L, puis réduis-les.</p>`,
   c:chns([["A",[`${X("a")} × ${X("a")} − ${m5.b}`,`<b>${R([[1,"a2"],[-m5.b,""]])}</b>`]],["B",[`${X("b")} × ${m5.k} + ${m5.c}`,`<b>${R([[m5.k,"b"],[m5.c,""]])}</b>`]],["C",[`<b>(${x} − ${m5.s}) × ${x} + ${m5.d}</b>`]],
   ["D",[`${X("p")} × ${m5.g} + ${m5.dvd}`,`<b>${R([[m5.g,"p"],[m5.dvd,""]])}</b>`]],["E",[`${X("k")} × ${F(m5.r)} + ${m5.f}`,`<b>${R([[m5.r,"k"],[m5.f,""]])}</b>`]],
   ["F",[`${x} + ${m5.q.join(" + ")}`,`<b>${R([[1,"x"],...m5.q.map(v=>[v,""])])}</b>`]],["K",[`${x} + ${m5.L} + ${x} + ${m5.L}`,`<b>${R([[1,"x"],[m5.L,""],[1,"x"],[m5.L,""]])}</b>`]],["L",[`${x} × ${m5.L}`,`<b>${E([[m5.L,"x"]])}</b>`]]])}
 ]};

/* ===== B. Réduire une expression littérale ===== */
const VAR=pick(["x","a","y"]);
const P6=[ /* exercice 6 : produits */
  ()=>{ const k=ri(2,9); return [[k,""],[1,VAR]]; }, ()=>{ const k=ri(2,9); return [[1,VAR],[k,""]]; }, ()=>{ const k=-ri(2,9); return [[k,""],[1,VAR]]; },
  ()=>[[nz(-9,9),""],[ri(2,9),VAR]], ()=>[[ri(2,9),VAR],[nz(-9,9),""]], ()=>[[ri(2,6),VAR],[1,VAR]], ()=>[[ri(2,6),VAR],[nz(-6,6),"y"===VAR?"x":"y"]]
];
const S6=[ /* exercice 6 : sommes */
  ()=>[[ri(2,9),VAR],[nz(-9,9),""]], ()=>[[ri(2,9),VAR],[nz(-9,-1),""],[1,VAR]], ()=>[[ri(2,9),""],[ri(2,9),VAR],[ri(2,9),""]], ()=>[[ri(2,9),""],[ri(2,9),VAR],[-ri(1,9),""]],
  ()=>[[-ri(2,9),""],[ri(3,9),VAR],[ri(1,9),""],[-ri(1,9),VAR]], ()=>[[ri(2,9),""],[ri(2,9),VAR],[-ri(2,9),VAR+"2"],[-ri(1,9),VAR+"2"]], ()=>[[ri(2,9),""],[-ri(2,9),VAR]]
];
const prodLine=([p,q],i)=>`${fac(p,true)} × ${fac(q)}`;
const red6=shuf([...P6.map(f=>({t:"p",v:f()})), ...S6.map(f=>({t:"s",v:f()}))]);
const sh6=o=>o.t==="p"?prodLine(o.v):E(o.v);
const co6=o=>o.t==="p"?E([prod(...o.v)]):(red(o.v).length===o.v.length?"non réductible":R(o.v));
/* Puissance 4 : tables de 3 lignes et 4 colonnes */
const lin=()=>[[nz(-6,6),"x"],[nz(-9,9),""]];
const RA=[lin(),[[nz(-9,9),""]],[[nz(-6,6),"x"]]], CA=[[[nz(-9,9),""]],lin(),[[nz(-6,6),"x"],[nz(-9,9),""]],[[nz(-6,6),"x"]]];
const RB=[[nz(-7,7),"x"],[nz(-9,9),""],[nz(-5,5),"a"]], CB=[[nz(-9,9),""],[nz(-6,6),"x"],[nz(-5,5),"y"],[nz(-5,5),"a"]];
const tA=w=>tab(["+",...CA.map(E)], RA.map(r=>[E(r),...CA.map(c=>w?R([...r,...c]):"")]));
const tB=w=>tab(["×",...CB.map(t=>E([t]))], RB.map(r=>[E([r]),...CB.map(c=>w?E([prod(r,c)]):"")]));
/* Activité 2 : le casino */
const g=ri(5,30), k=ri(2,5), m=ri(5,30), who=pick(["Léo","Inès","Sam","Lina"]);
const CAS=[["+","+",`a gagné ${k} fois ${s} € et ${m} €`],["+","−",`a gagné ${k} fois ${s} € mais a perdu ensuite ${m} €`],["−","+",`a perdu ${k} fois ${s} € et aussi ${m} €`]];
const cas=(o1,o2)=>{ const sg1=o1==="+"?1:-1, sg2=o2==="+"?1:-1; const inner=[[k,"s"],[sg2*m,""]]; const out=[[g,""],...inner.map(([c,v])=>[sg1*c,v])];
  return {q:`${g} ${o1} (${E(inner)})`, l2:E(out), r:R(out)}; };
/* Exercice 7 : réductions de toutes sortes */
const e7=[
  (()=>{ const c=ri(2,9), p=[ri(2,9),"a"], q=[ri(2,9),""]; return [`${c} + (${E([p,q])})`, [[c,""],p,q]]; })(),
  (()=>{ const u=[ri(5,9),"a"], p=[ri(2,4),"a"], q=[ri(2,9),""]; return [`${E([u])} − (${E([p,q])})`, [u,...opp([p,q])]]; })(),
  (()=>{ const c=ri(2,9), p=[ri(2,9),"x"], q=[-ri(2,9),""]; return [`${c} − (${E([p,q])})`, [[c,""],...opp([p,q])]]; })(),
  (()=>{ const u=[ri(2,15),"x2"], p=[-ri(2,9),"x"], q=[-ri(2,9),""]; return [`${E([u])} + (${E([p,q])})`, [u,p,q]]; })(),
  (()=>{ const t=[[ri(2,12),"x2"],[ri(2,9),"x2"],[ri(2,9),""],[-ri(2,9),"x"],[ri(2,9),"x"],[-ri(2,9),""]]; return [E(t), t]; })(),
  (()=>{ const t=[[ri(5,12),""],[-ri(2,12),"t"],[-ri(2,9),"t2"],[ri(2,9),"t2"],[-ri(2,9),""]]; return [E(t), t]; })(),
  (()=>{ const u=[[ri(2,9),"x2"],[ri(2,9),""]], p=[ri(2,9),"x"], q=[-ri(2,9),""]; return [`${E(u)} − (${E([p,q])})`, [...u,...opp([p,q])]]; })(),
  (()=>{ const p=[ri(2,9),"x"], q=[-ri(2,9),""], v=[ri(2,9),"x"]; return [`(${E([p,q])}) + ${E([v])}`, [p,q,v]]; })(),
  (()=>{ const u=[ri(2,9),"a2"], A=[[ri(2,6),"a"],[-ri(2,6),""]], B=[[ri(2,6),"a"],[ri(2,9),"a"]]; return [`${E([u])} + ${fac(A[0],true)} × ${fac(A[1])} + ${fac(B[0],true)} × ${fac(B[1])}`, [u,prod(...A),prod(...B)]]; })(),
  (()=>{ const A=[[ri(2,6),"y"],[ri(2,6),"x"]], p=[-ri(2,9),"y"], c=ri(2,9), q=[ri(1,9),"y"]; return [`${fac(A[0],true)} × ${fac(A[1])}${tail([p,[c,""],q])}`, [prod(...A),p,[c,""],q]]; })()
];
const secB={t:"Réduire une expression littérale", e:[
  {n:"Exercice 6", t:"Entraînement à la réduction d'expressions littérales", w:"Sur ton cahier", h:`<p>Réduis les expressions littérales suivantes lorsque c'est possible.</p><div class="calcs">${red6.map((o,i)=>`<span>${"ABCDEFGHIJKLMN"[i]} = ${sh6(o)}</span>`).join("")}</div>`,
   c:chns(red6.map((o,i)=>{ const r=co6(o); return ["ABCDEFGHIJKLMN"[i], r==="non réductible"?[`${sh6(o)} : non réductible`]:[sh6(o),r]]; }))},
  {n:"Puissance 4", t:"Réduction d'écritures littérales", w:"Sur ton cahier", h:`<p>Recopie et complète chaque tableau avec l'expression <b>réduite</b>.</p><p><b>Tableau 1 :</b> la somme de l'expression de la ligne et de celle de la colonne.</p>${tA(false)}<p><b>Tableau 2 :</b> le produit de l'expression de la ligne et de celle de la colonne.</p>${tB(false)}`,
   c:`<p><b>Tableau 1</b></p>${tA(true)}<p><b>Tableau 2</b></p>${tB(true)}`},
  {n:"Activité 2", t:"Un « + » ou un « − » devant une parenthèse", w:"Sur ton cahier", h:`<p>Dans chaque cas, ${s} représente une somme d'argent en €. Lundi, ${who} a gagné ${g} € au jeu. Le mardi :</p>${CAS.map(([o1,o2,t],i)=>`<p><b>Cas n° ${i+1} :</b> ${who} ${t}. Le total de ses gains est ${"ABC"[i]} = ${cas(o1,o2).q}.</p>`).join("")}<p><b>Cas n° 4 :</b> D = ${cas("−","−").q}.</p><p>Réduis A, B, C et D.</p>`,
   c:[["+","+"],["+","−"],["−","+"],["−","−"]].map(([o1,o2],i)=>{ const C=cas(o1,o2), L="ABCD"[i]; return `<p class="calc">${L} = ${C.q}<br>${L} = ${C.l2}<br>${L} = <b>${C.r}</b></p>`; }).join("")},
  {n:"Exercice 7", t:"Réductions de toutes sortes d'expressions", w:"Sur ton cahier", h:`<p>Réduis chaque expression.</p><div class="calcs">${e7.map(([q],i)=>`<span>${"ABCDEFGHIJ"[i]} = ${q}</span>`).join("")}</div>`,
   c:`<div class="figs" style="gap:28px">${e7.map(([q,t],i)=>{ const L="ABCDEFGHIJ"[i], st=[q]; if(E(t)!==q && E(t)!==R(t)) st.push(E(t)); st.push(`<b>${R(t)}</b>`); return `<p class="calc">${st.map(z=>`${L} = ${z}`).join("<br>")}</p>`; }).join("")}</div>`}
 ]};

/* ===== C. Expressions et figures ===== */
const p9=ri(2,9), k9=ri(2,5);
const secC={t:"Pour aller plus loin : expressions et figures", e:[
  {n:"Exercice 9", t:"Périmètre d'une figure", w:"Sur ton cahier", h:`${fleche(`${x} + ${p9}`,`${k9}${x}`)}<p>Exprime en fonction de ${x} le périmètre de la figure, puis réduis l'expression.</p><p>Les côtés codés de la même façon ont la même longueur.</p>`,
   c:`<p>2 côtés de longueur ${x} + ${p9} et 4 côtés de longueur ${k9}${x} :</p><p>On note P le périmètre.</p><p class="calc">P = ${x} + ${p9} + ${x} + ${p9} + ${k9}${x} + ${k9}${x} + ${k9}${x} + ${k9}${x}<br>P = <b>${R([[1,"x"],[p9,""],[1,"x"],[p9,""],[k9,"x"],[k9,"x"],[k9,"x"],[k9,"x"]])}</b></p>`}
 ]};

return [secA, secB, secC];
};
