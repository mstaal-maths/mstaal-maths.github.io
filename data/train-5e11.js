/* 5e · chapitre 11 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres.
   Toutes les corrections sont calculées par le code. */
TRAIN["5e-11"] = function(){
const {ri, pick, shuf, distinct, items} = TR;
const {F, F2, Q, gcd, T2, TB, r3, KC} = window.PROP;
const qt = (y,x) => { const q=y/x; return Math.abs(r3(q)-q)<1e-9 ? "= "+F(q) : "≈ "+F(Math.round(q*1000)/1000); };
const B = v => `<b>${v}</b>`;

/* ===== A. Reconnaître ===== */
/* Activité : une situation proportionnelle (prix au kg), une qui ne l'est pas (âge / taille) */
const pk = ri(15,45)/10, mk = [1, ri(2,4), ri(5,8)];
const ages = [ri(3,5), ri(7,10), ri(12,15)], tail = (()=>{ const t0=ri(95,115)/100; return [t0, r3(t0+ri(20,35)/100), r3(t0+ri(50,70)/100)]; })();
/* Exercice 1 : deux tableaux (un oui, un non) + quatre situations */
const tabOk = (()=>{ const k=pick([1.5,2.5,3,0.5,4]), x=distinct(3,()=>ri(2,12),v=>v).sort((a,b)=>a-b); return {x, y:x.map(v=>r3(v*k)), k}; })();
const tabNo = (()=>{ const k=pick([2,2.5,3,1.5]), x=distinct(3,()=>ri(2,12),v=>v).sort((a,b)=>a-b); const y=x.map(v=>r3(v*k)); y[2]=r3(x[2]*(k+0.5)); return {x, y, k}; })();
const lst = t => t.x.join(" | ")+" en première ligne et "+t.y.map(F).join(" | ")+" en seconde ligne";
const cr = ri(9,15)/10;
const SIT = shuf([
  ["Le périmètre d'un carré et la longueur de son côté", true, `<i>P</i> = 4<i>c</i> : coefficient 4.`],
  ["L'aire d'un carré et la longueur de son côté", false, `côté 2 cm : aire 4 cm<sup>2</sup> ; côté 4 cm : aire 16 cm<sup>2</sup> (pas le double).`],
  [`Le nombre de croissants achetés et le prix payé (${F2(cr)} € pièce)`, true, `on multiplie le nombre de croissants par ${F2(cr)}.`],
  ["L'âge d'une personne et sa masse", false, `une personne de 20 ans ne pèse pas deux fois plus qu'à 10 ans.`],
  ["L'âge d'une personne et sa taille", false, `on ne grandit pas toujours de la même façon.`]
]).slice(0,4);
const E1 = shuf([[lst(tabOk), true, `${tabOk.x.map((v,i)=>`${Q(F(tabOk.y[i]),v)} ${qt(tabOk.y[i],v)}`).join(" ; ")} : les quotients sont égaux, coefficient ${F(tabOk.k)}.`],
                 [lst(tabNo), false, `${tabNo.x.map((v,i)=>`${Q(F(tabNo.y[i]),v)} ${qt(tabNo.y[i],v)}`).join(" ; ")} : un quotient est différent.`], ...SIT]);
const secA = {t:"Reconnaître la proportionnalité", e:[
  {n:"Activité 1", t:"Proportionnel ou non ?", w:"Sur ton cahier", h:`<p><b>Situation 1 :</b> le prix de pommes achetées au marché.</p>${T2("Masse (kg)",mk.map(String),"Prix (€)",mk.map(m=>F2(m*pk)),["Prix ÷ masse",["","",""]])}
   <p><b>Situation 2 :</b> l'âge et la taille d'un enfant.</p>${T2("Âge (ans)",ages.map(String),"Taille (m)",tail.map(F2),["Taille ÷ âge",["","",""]])}
   <p><b>1)</b> Complète les tableaux. Dans quelle situation les quotients sont-ils tous égaux ?</p><p><b>2)</b> Dans quelle situation les deux grandeurs sont-elles proportionnelles ? Quel est alors le coefficient ?</p>`,
   c:`${T2("Masse (kg)",mk.map(String),"Prix (€)",mk.map(m=>F2(m*pk)),["Prix ÷ masse",mk.map(()=>F(pk))])}${T2("Âge (ans)",ages.map(String),"Taille (m)",tail.map(F2),["Taille ÷ âge",ages.map((a,i)=>qt(tail[i],a).replace("= ",""))])}
   <p><b>1)</b> Dans la situation 1, les quotients valent tous ${F(pk)}. Dans la situation 2, ils sont différents.</p><p><b>2)</b> La situation 1 est une situation de proportionnalité, de coefficient <b>${F(pk)}</b> (le prix d'un kilogramme). La situation 2 n'en est pas une.</p>`},
  {n:"Exercice 1", t:"Reconnaître une situation de proportionnalité", w:"Sur ton cahier", h:`<p>Pour chaque situation, réponds oui ou non, et justifie.</p>${E1.map(([s],i)=>`<p>${"abcdef"[i]}) ${s}</p>`).join("")}`,
   c:E1.map(([s,ok,why],i)=>`<p>${"abcdef"[i]}) <b>${ok?"oui":"non"}</b> — ${why}</p>`).join("")}
 ]};

/* ===== B. Calculer une valeur ===== */
const t2a = (()=>{ const k=pick([1.5,2.5,3.5,1.2,0.8]), x=[2,4,ri(5,9),10]; return {x,k}; })();
const t2b = (()=>{ const k=pick([0.4,0.6,0.8,1.5]), x=[10,25,40,5]; return {x,k}; })();
const lin = (()=>{ const n=pick([4,6]), p=2*ri(3,12), h=n/2; return {n, p, h, cols:[n, 2*n, h, n+h, 2*n+h]}; })();
const linEx = (c,i) => [``, `${c} = ${lin.n} × 2 donc ${lin.p} × 2 = ${2*lin.p}`, `${c} = ${lin.n} ÷ 2 donc ${lin.p} ÷ 2 = ${lin.p/2}`, `${c} = ${lin.n} + ${lin.h} donc ${lin.p} + ${lin.p/2} = ${lin.p*1.5}`, `${c} = ${2*lin.n} + ${lin.h} donc ${2*lin.p} + ${lin.p/2} = ${lin.p*2.5}`][i];
const st = (()=>{ const n=pick([4,5,6]), u=ri(80,250)/100, m=ri(7,12); return {n,u,m}; })();
const oe = (()=>{ const n=12, u=ri(50,70), m=ri(2,11); return {n,u,m}; })();
const car = (()=>{ const c=ri(5,9), k=pick([4,3,5]), m=pick([6.5,5.5,7.5,8.5,2.5]); return {c, L:c*k, d:k*100, m}; })();
const crp = [["Farine (g)",ri(4,6)*50],["Œufs",pick([2,4])],["Lait (cL)",ri(3,6)*10],["Sucre (g)",ri(2,4)*10]];
const vit = pick([12,16,20,24,30]), vh = pick([2,3,4]), vh2 = pick([1.5,2.5,3.5]), vd = vit*pick([1.5,2.5,3]);
const hm = t => `${Math.floor(t)} h${t%1?" 30 min":""}`;
const ech = pick([[25000,250],[50000,500],[100000,1000]]), cm1 = ri(2,9), cm2 = ri(5,19)/2, km3 = (ech[1]===250? ri(1,4) : ri(2,9));
const secB = {t:"Calculer une valeur dans une situation de proportionnalité", e:[
  {n:"Exercice 2", t:"Compléter avec le coefficient", w:"Sur ton cahier", h:`<p>Ces tableaux sont des tableaux de proportionnalité. Recopie-les et complète-les en cherchant le coefficient.</p>${T2("Masse (kg)",t2a.x.map(String),"Prix (€)",[F(2*t2a.k),"","",F(10*t2a.k)])}${T2("Durée (min)",t2b.x.map(String),"Eau (L)",["",F(25*t2b.k),F(40*t2b.k),""])}`,
   c:`${T2("Masse (kg)",t2a.x.map(String),"Prix (€)",t2a.x.map((v,i)=>i===1||i===2?B(F(v*t2a.k)):F(v*t2a.k)))}<p>Coefficient : ${F(2*t2a.k)} ÷ 2 = ${F(t2a.k)}.</p>${T2("Durée (min)",t2b.x.map(String),"Eau (L)",t2b.x.map((v,i)=>i===0||i===3?B(F(v*t2b.k)):F(v*t2b.k)))}<p>Coefficient : ${F(25*t2b.k)} ÷ 25 = ${F(t2b.k)}.</p>`},
  {n:"Exercice 3", t:"Utiliser la linéarité", w:"Sur ton cahier", h:`<p>Un paquet de ${lin.n} minifigurines coûte ${lin.p} €. Complète en utilisant la linéarité (sans retour à l'unité).</p>${T2("Nombre de minifigurines",lin.cols.map(String),"Prix (€)",[String(lin.p),"","","",""])}<p>Explique comment tu as obtenu les deux derniers prix.</p>`,
   c:`${T2("Nombre de minifigurines",lin.cols.map(String),"Prix (€)",lin.cols.map((c,i)=>i?B(F(c*lin.p/lin.n)):String(lin.p)))}<p>${lin.cols.map(linEx).slice(1).join("</p><p>")}</p>`},
  {n:"Exercice 4", t:"Retour à l'unité", w:"Sur ton cahier", h:`<p>Utilise le retour à l'unité.</p><p>a) ${st.n} stylos coûtent ${F2(st.n*st.u)} €. Combien coûtent ${st.m} stylos ?</p><p>b) ${oe.n} œufs pèsent ${oe.n*oe.u} g. Combien pèsent ${oe.m} œufs ?</p><p>c) Une voiture consomme ${car.L} L pour ${car.d} km. Combien consomme-t-elle pour ${F(car.m*100)} km ?</p>`,
   c:`<p>a) 1 stylo : ${F2(st.n*st.u)} ÷ ${st.n} = ${F2(st.u)} € ; ${st.m} stylos : ${st.m} × ${F2(st.u)} = <b>${F2(st.m*st.u)} €</b>.</p><p>b) 1 œuf : ${oe.n*oe.u} ÷ ${oe.n} = ${oe.u} g ; ${oe.m} œufs : ${oe.m} × ${oe.u} = <b>${oe.m*oe.u} g</b>.</p><p>c) 100 km : ${car.L} ÷ ${car.d/100} = ${car.c} L ; ${F(car.m*100)} km : ${F(car.m)} × ${car.c} = <b>${F(car.m*car.c)} L</b>.</p>`},
  {n:"Exercice 5", t:"La recette de crêpes", w:"Sur ton cahier", h:`<p>Voici une recette de crêpes pour 4 personnes. Complète pour 6, 8 et 10 personnes.</p>${TB(["Ingrédients","4 personnes","6 personnes","8 personnes","10 personnes"], crp.map(([n,q])=>[n,String(q),"","",""]))}`,
   c:`${TB(["Ingrédients","4 personnes","6 personnes","8 personnes","10 personnes"], crp.map(([n,q])=>[n,String(q),F(q*1.5),F(q*2),F(q*2.5)]))}<p>6 = 4 × 1,5 ; 8 = 4 × 2 ; 10 = 4 × 2,5.</p><p>On multiplie chaque quantité par 1,5, par 2 ou par 2,5.</p>`},
  {n:"Exercice 6", t:"Vitesse moyenne", w:"Sur ton cahier", h:`<p>Un cycliste roule à la vitesse moyenne constante de ${vit} km/h.</p><p><b>1)</b> Quelle distance parcourt-il en ${vh} h ? en 30 min ? en ${hm(vh2)} ?</p><p><b>2)</b> Quelle durée lui faut-il pour parcourir ${F(vd)} km ?</p>`,
   c:`<p>La distance est proportionnelle à la durée : en 1 h, le cycliste parcourt ${vit} km.</p><p><b>1)</b> En ${vh} h : ${vh} × ${vit} = <b>${vh*vit} km</b>.</p><p>En 30 min (0,5 h) : ${vit} ÷ 2 = <b>${F(vit/2)} km</b>.</p><p>En ${hm(vh2)} (${F(vh2)} h) : ${F(vh2)} × ${vit} = <b>${F(vh2*vit)} km</b>.</p><p><b>2)</b> ${F(vd)} ÷ ${vit} = ${(vd/vit)%1?`${F(vd/vit)} h, soit <b>${hm(vd/vit)}</b>`:`<b>${F(vd/vit)} h</b>`}.</p>`},
  {n:"Exercice 7", t:"Lire une carte", w:"Sur ton cahier", h:`<p>Sur une carte à l'échelle ${Q(1,F(ech[0]))}, 1 cm représente ${ech[1]} m dans la réalité.</p><p>a) Deux villes sont distantes de ${cm1} cm sur la carte. Quelle est la distance réelle, en kilomètres ?</p><p>b) Un chemin mesure ${F(cm2)} cm sur la carte. Quelle est sa longueur réelle ?</p><p>c) Un sentier mesure ${km3} km dans la réalité. Quelle longueur a-t-il sur la carte ?</p>`,
   c:`<p>a) ${cm1} × ${ech[1]} = ${F(cm1*ech[1])} m, soit <b>${F(cm1*ech[1]/1000)} km</b>.</p><p>b) ${F(cm2)} × ${ech[1]} = ${F(cm2*ech[1])} m, soit <b>${F(cm2*ech[1]/1000)} km</b>.</p><p>c) ${km3} km = ${F(km3*1000)} m et ${F(km3*1000)} ÷ ${ech[1]} = ${F(km3*1000/ech[1])} : <b>${F(km3*1000/ech[1])} cm</b> sur la carte.</p>`}
 ]};

/* ===== C. Proportions et pourcentages ===== */
const br = (()=>{ const t=pick([20,40,50,80]); let a,b; do{ a=ri(t/5,t/2); b=ri(t/5,t/2); }while(a===b||t-a-b<t/10); return {t, v:[a,b,t-a-b]}; })();
const irr = (n,t) => { const g=gcd(n,t); return g>1 ? `${Q(n,t)} = ${Q(n/g,t/g)}` : Q(n,t); };
const M9 = shuf([[50,pick([60,90,140,250])],[25,pick([40,80,120,200])],[10,pick([70,350,480,1200])],[1,pick([300,800,1500])],[75,pick([40,80,120])],[20,pick([30,60,150])]]);
const P10 = distinct(3, ()=>[pick([12,15,18,30,35,45]), pick([40,60,80,120,150,200,250])], x=>x.join());
const S10 = distinct(3, ()=>{ const t=pick([20,24,25,40,50,150,200]); let n; do{ n=ri(2,t-1); }while((n*100/t)%1 && (n*1000/t)%1); return [n,t]; }, x=>x.join());
const el = (()=>{ const t=pick([20,25,50]); let v; do{ const a=ri(2,t-6), b=ri(1,t-a-3), c=ri(1,t-a-b-1); v=[a,b,c,t-a-b-c]; }while(v.some(x=>x<1)); return {t, v}; })();
const NOMS = shuf(["Chloé","Hugo","Zoé","Léo","Inès","Malo"]).slice(0,4);
const c12a = (()=>{ const a=ri(15,24), p=a*4+pick([0,0,-4,4]); return {a,p}; })();
const c12b = (()=>{ let A,B; do{ A=[ri(30,50),400]; B=[ri(28,45),350]; }while(Math.abs(A[0]/A[1]-B[0]/B[1])<0.002); return {A,B}; })();
const c12c = (()=>{ let f,pile,face; do{ f=ri(8,15); pile=ri(8,14); face=20-pile; }while(f*4===face*5); return {f,pile,face}; })();
const r13 = [[ri(5,12)*5, pick([10,20,30])],[ri(4,10)*10, pick([15,25,5])],[ri(4,12)*10, pick([10,20,5])]];
const art = (()=>{ const L=pick([60,80,100,120]), l=pick([40,60,80].filter(v=>v<L)), s=[pick([2,4,5]), pick([8,10])]; return {L,l,s}; })();
const secC = {t:"Proportions et pourcentages", e:[
  {n:"Exercice 8", t:"Les briques de la boîte", w:"Sur ton cahier", h:`<p>Une boîte contient ${br.t} briques : ${br.v[0]} rouges, ${br.v[1]} bleues et ${br.v[2]} jaunes. Donne chaque proportion sous trois formes : fraction irréductible, nombre décimal et pourcentage.</p>`,
   c:`${TB(["Couleur","Fraction irréductible","Nombre décimal","Pourcentage"], ["Rouge","Bleue","Jaune"].map((c,i)=>[c, irr(br.v[i],br.t), String(+(br.v[i]/br.t).toFixed(6)).replace(".",","), F(br.v[i]*100/br.t)+" %"]))}<p>Vérification : la somme des pourcentages fait 100 %.</p>`},
  {n:"Exercice 9", t:"Pourcentages mentaux", w:"Sur ton cahier", h:`<p>Calcule mentalement.</p><p>${items(M9.map(([p,N])=>`${p} % de ${F(N)}`)," ",true)}</p>`,
   c:`<p>${items(M9.map(([p,N])=>`${p} % de ${F(N)} : ${p===50?`la moitié, ${F(N)} ÷ 2`:p===25?`le quart, ${F(N)} ÷ 4`:p===10?`${F(N)} ÷ 10`:p===1?`${F(N)} ÷ 100`:p===75?`trois quarts, ${F(N)} ÷ 4 = ${F(N/4)} puis ${F(N/4)} × 3`:`10 % de ${F(N)} = ${F(N/10)}, puis ${F(N/10)} × 2`} = <b>${F(N*p/100)}</b>`),"</p><p>",true)}</p>`},
  {n:"Exercice 10", t:"Calculer avec des pourcentages", w:"Sur ton cahier", h:`<p>Calcule (calculatrice autorisée).</p><p>${items([...P10.map(([t,N])=>`${t} % de ${N}`), ...S10.map(([n,t])=>`${n} élèves sur ${t} : quel pourcentage ?`)]," ",true)}</p>`,
   c:`<p>Pour <i>t</i> % de Q, je calcule Q × ${Q("t",100)}. Pour un pourcentage, je calcule la proportion ${Q("quantité","total")}.</p>${[...P10.map(([t,N])=>KC("P",[`${N} × ${Q(t,100)}`,`${F(N*t)} ÷ 100`,`<b>${F(N*t/100)}</b>`])), ...S10.map(([n,t])=>KC("p",[Q(n,t),`${n} ÷ ${t}`,F(n/t),`<b>${F(n*100/t)} %</b>`]))].map((k,i)=>`<p>${"abcdef"[i]})</p>${k}`).join("")}`},
  {n:"Exercice 11", t:"L'élection des délégués", w:"Sur ton cahier", h:`<p>${el.t} élèves ont voté, chacun pour un seul candidat.</p>${TB(["Candidat",...NOMS,"Total"],[["Nombre de voix",...el.v.map(String),String(el.t)],["Pourcentage","","","","",""]])}<p>Complète le tableau. Que vaut la somme des pourcentages ? Pourquoi ?</p>`,
   c:`${TB(["Candidat",...NOMS,"Total"],[["Nombre de voix",...el.v.map(String),String(el.t)],["Pourcentage",...el.v.map(v=>F(v*100/el.t)+" %"),"100 %"]])}<p>Chaque pourcentage : ${Q("voix",el.t)} = ${Q(`voix × ${100/el.t}`,100)}.</p><p>La somme vaut <b>100 %</b> : toutes les voix représentent le tout.</p>`},
  {n:"Exercice 12", t:"Comparer des proportions", w:"Sur ton cahier", h:`<p>a) En 5<sup>e</sup>C, ${c12a.a} élèves sur 25 ont réussi leur ASSR. En 5<sup>e</sup>D, le taux de réussite est de ${c12a.p} %. Lola affirme : « La proportion d'élèves ayant réussi est la même dans les deux classes. » A-t-elle raison ?</p><p>b) Dans la préparation A, il y a ${c12b.A[0]} mL de sirop pour ${c12b.A[1]} mL de boisson. Dans la préparation B, il y a ${c12b.B[0]} mL de sirop pour ${c12b.B[1]} mL. Laquelle est la plus concentrée en sirop ?</p><p>c) Majid obtient ${c12c.f} fois Face sur 25 lancers. Alice obtient ${c12c.pile} fois Pile sur 20 lancers. Qui a obtenu la plus grande proportion de Face ?</p>`,
   c:(()=>{ const pa=c12a.a*4, A=c12b.A[0]/c12b.A[1], Bq=c12b.B[0]/c12b.B[1], m=c12c.f*4, al=c12c.face*5;
     return `<p>a) En 5<sup>e</sup>C :</p>${KC("p",[Q(c12a.a,25),Q(pa,100),`${pa} %`])}<p>${pa===c12a.p?"<b>Oui, Lola a raison</b>.":`<b>Non</b>, ${pa} % ≠ ${c12a.p} %.`}</p>
     <p>b) A : ${Q(c12b.A[0],c12b.A[1])} ${qt(c12b.A[0],c12b.A[1])} ; B : ${Q(c12b.B[0],c12b.B[1])} ${qt(c12b.B[0],c12b.B[1])}. <b>La préparation ${A>Bq?"A":"B"}</b> est la plus concentrée.</p>
     <p>c) Majid :</p>${KC("p",[Q(c12c.f,25),Q(m,100),`${m} %`])}<p>Alice a 20 − ${c12c.pile} = ${c12c.face} Face sur 20 :</p>${KC("p",[Q(c12c.face,20),Q(al,100),`${al} %`])}<p><b>${m>al?"Majid":"Alice"}</b> a la plus grande proportion de Face.</p>`; })()},
  {n:"Exercice 13", t:"Réductions et augmentations", w:"Sur ton cahier", h:`<p>a) Un jeu coûte ${r13[0][0]} €. Pendant les soldes, il bénéficie d'une réduction de ${r13[0][1]} %. Quel est le montant de la réduction ? Quel est le nouveau prix ?</p><p>b) Un sweat coûte ${r13[1][0]} €. Un magasin propose ${r13[1][1]} % de réduction. Quel est son prix après réduction ?</p><p>c) Un abonnement coûte ${r13[2][0]} € par an. Son prix augmente de ${r13[2][1]} %. Quel est le nouveau prix ?</p>`,
   c:(()=>{ const R=r13.map(([P,t])=>P*t/100); return `<p>a) Réduction : ${r13[0][0]} × ${Q(r13[0][1],100)} = <b>${F2(R[0])} €</b> ; nouveau prix : ${r13[0][0]} − ${F2(R[0])} = <b>${F2(r13[0][0]-R[0])} €</b>.</p><p>b) Réduction : ${r13[1][0]} × ${Q(r13[1][1],100)} = ${F2(R[1])} € ; prix : ${r13[1][0]} − ${F2(R[1])} = <b>${F2(r13[1][0]-R[1])} €</b>.</p><p>c) Augmentation : ${r13[2][0]} × ${Q(r13[2][1],100)} = ${F2(R[2])} € ; nouveau prix : ${r13[2][0]} + ${F2(R[2])} = <b>${F2(r13[2][0]+R[2])} €</b>.</p>`; })()},
  {n:"Exercice 14", t:"Une œuvre à l'échelle", w:"Sur ton cahier", h:`<p>On reproduit une œuvre de ${art.L} cm sur ${art.l} cm à l'échelle ${Q(1,art.s[0])} (toutes les longueurs sont divisées par ${art.s[0]}).</p><p><b>1)</b> Quelles sont les dimensions de la reproduction ?</p><p><b>2)</b> Quelles seraient les dimensions à l'échelle ${Q(1,art.s[1])} ?</p>`,
   c:`<p><b>1)</b> ${art.L} ÷ ${art.s[0]} = ${F(art.L/art.s[0])} cm et ${art.l} ÷ ${art.s[0]} = ${F(art.l/art.s[0])} cm : <b>${F(art.L/art.s[0])} cm sur ${F(art.l/art.s[0])} cm</b>.</p><p><b>2)</b> ${art.L} ÷ ${art.s[1]} = ${F(art.L/art.s[1])} cm et ${art.l} ÷ ${art.s[1]} = ${F(art.l/art.s[1])} cm : <b>${F(art.L/art.s[1])} cm sur ${F(art.l/art.s[1])} cm</b>.</p>`}
 ]};

return [secA, secB, secC];
};
