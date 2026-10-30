/* 3e · chapitre 17 — fiche d'entraînement : les exercices de probabilités de M. Staal, avec d'autres nombres.
   Roues, diagrammes et tableaux d'issues produits à partir des valeurs tirées ; corrections calculées (outils window.PROB3). */
TRAIN["3e-17"] = function(){
const {ri, pick, shuf} = TR;
const {N, F, irr, frs, frc, gcd, sum, te, roue, barres, tab2, issue, rd} = window.PROB3;
const mult=(n,m)=>Array.from({length:n},(_,i)=>i+1).filter(x=>x%m===0);
const isP=x=>x>1&&[...Array(x).keys()].slice(2).every(d=>x%d);

/* ===== 1. Calculer des probabilités ===== */
const RO = (()=>{ let nums; do{ nums=Array.from({length:pick([8,10,12])},()=>ri(1,5)); }while(new Set(nums).size<4); return nums; })();
const cnt = k => RO.filter(x=>x===k).length;
const pairs = RO.filter(x=>x%2===0).length;
const U = (()=>{ const n=pick([20,24,30,36]), s=pick([n-5,n-6,n-4]), m=pick([4,5,6,7].filter(x=>x!==s)); const A=Array.from({length:n-s},(_,i)=>s+1+i), B=mult(n,m), AB=A.filter(x=>B.includes(x)), AuB=[...new Set([...A,...B])].sort((a,b)=>a-b); return {n,s,m,A,B,AB,AuB}; })();
const J = (()=>{ let v; do{ v=Array.from({length:8},()=>pick([4,5,9,10,14,15,18,20,25,26])); }while(new Set(v).size<4); const t=pick([...new Set(v)].filter(x=>v.filter(y=>y===x).length>=2).concat([v[0]])), out=v.find(x=>x!==t); return {v, t, out, m5:v.filter(x=>x%5===0).length}; })();
const CO = (()=>{ let a,b,v; do{ b=pick([3,4,5,7,8]); a=ri(1,b-1); v=pick([4,6,8,9,10,12]); }while(gcd(a,b)>1||(v*b)%a); return {a,b,v,tot:v*b/a}; })();
const DZ = (()=>{ const n=pick([10,12,15,16,18]), m=pick([3,4]), rem=[...Array(n).keys()].map(i=>i+1).filter(x=>!(pick([6])%x===0)); return {n, m, rem, pr:rem.filter(isP)}; })();

/* ===== 2. Fréquences ===== */
const DE = (()=>{ const faces=["bleu","rouge","jaune","vert","noir"]; let e; do{ e=[ri(10,20),ri(10,20),ri(10,20),ri(10,20)]; }while(sum(e)>75||sum(e)<60); e.push(100-sum(e)); const k=ri(0,3); return {faces, e, k}; })();
const PI = (()=>{ const f=pick([0.3,0.35,0.4,0.45,0.55,0.6,0.65]); return {f}; })();
const SAC = (()=>{ for(let g=0;g<500;g++){ const t=pick([10,20]); const a=[ri(1,t-3),0,0,0]; a[1]=ri(1,t-a[0]-2); a[2]=ri(1,t-a[0]-a[1]-1); a[3]=t-a[0]-a[1]-a[2]; if(a[3]>=1 && new Set(a).size===4) return {t,a}; } return {t:20,a:[10,5,4,1]}; })();
const XLS = (()=>{ const n=pick([6,8,10,12]), k=ri(1,n); return {n,k,eff:ri(5,15)}; })();

/* ===== 3. Deux épreuves ===== */
const UR = (()=>{ const b=pick([1,2]), v=pick([1,2,3]).toString(); const L=[...Array(b).keys()].map(i=>b>1?"B"+(i+1):"B").concat([...Array(+v).keys()].map(i=>+v>1?"V"+(i+1):"V")); return {L, nb:b, nv:+v}; })();
const LET = pick([["A","B","C"],["A","B","C","D"]]);
const la = pick(LET), lb = pick(LET.filter(x=>x!==la));

return [
 {t:"Calculer des probabilités", e:[
  {n:"Exercice 1", t:"La roue de loterie", w:"Sur ton cahier", h:`<p>On tourne cette roue équilibrée et on relève le numéro du secteur qui s'arrête en face du repère.</p>${roue(RO)}<p><b>1)</b> Donne la probabilité de chaque issue.</p><p><b>2)</b> Calcule la probabilité de l'événement « Obtenir un nombre pair ».</p><p><b>3)</b> Quel est l'événement contraire ? Quelle est sa probabilité ?</p><p><b>4)</b> Quelle est la probabilité d'obtenir 7 ? Et d'obtenir un nombre inférieur à 7 ?</p>`,
   c:`<p><b>1)</b></p><div class="calcs">${[...new Set(RO)].sort().map(k=>`<p class="calc">${frc(`P(${k})`,cnt(k),RO.length)}</p>`).join("")}</div><p><b>2)</b> ${pairs} secteurs pairs sur ${RO.length} :</p><p class="calc">${frc("P(pair)",pairs,RO.length)}</p><p><b>3)</b> « Obtenir un nombre impair » :</p><p class="calc">${frc("P(impair)",RO.length-pairs,RO.length,`1 − ${F(pairs,RO.length)}`)}</p><p><b>4)</b> P(7) = <b>0</b> (impossible) ; P(nombre inférieur à 7) = <b>1</b> (certain).</p>`},
  {n:"Exercice 2", t:"Urne", w:"Sur ton cahier", h:`<p>Une urne contient ${U.n} boules numérotées de 1 à ${U.n}. On en tire une au hasard.</p><p>A : « Obtenir un numéro plus grand que ${U.s} » ; B : « Obtenir un multiple de ${U.m} ».</p><p><b>1)</b> Calcule P(A) et P(B).</p><p><b>2)</b> Quelle est la probabilité que A et B se réalisent tous les deux ?</p><p><b>3)</b> Quelle est la probabilité que l'un au moins des deux se réalise ?</p>`,
   c:`<p><b>1)</b> A : ${U.A.join(", ")}, donc :</p><p class="calc">${frc("P(A)",U.A.length,U.n)}</p><p>B : ${U.B.join(", ")}, donc :</p><p class="calc">${frc("P(B)",U.B.length,U.n)}</p><p><b>2)</b> ${U.AB.length?`${U.AB.join(", ")} : ${frs(U.AB.length,U.n)}`:"Aucun numéro : la probabilité est 0"}.</p><p><b>3)</b> ${U.AuB.join(", ")} : ${frs(U.AuB.length,U.n)}.</p>`},
  {n:"Exercice 3", t:"Les jetons", w:"Sur ton cahier", h:`<p>Un sac contient les huit jetons suivants :</p><p class="calc">${J.v.join(" &nbsp; ")}</p><p><b>1) a)</b> Quelle est la probabilité de tirer un jeton « ${J.t} » ?</p><p><b>b)</b> Quelle est la probabilité de tirer un multiple de 5 ?</p><p><b>2)</b> On tire un jeton « ${J.out} » et on le garde. Quelle est maintenant la probabilité de tirer un jeton « ${J.t} » ? Est-ce la même qu'au 1 a) ?</p>`,
   c:(()=>{ const c=J.v.filter(x=>x===J.t).length; return `<p><b>1) a)</b> ${frs(c,8)}.</p><p><b>b)</b> ${J.m5} multiple${J.m5>1?"s":""} de 5 : ${frs(J.m5,8)}.</p><p><b>2)</b> Il reste 7 jetons dont ${c} « ${J.t} » : ${frs(c,7)}. ${F(c,7)} ≠ ${F(c,8)} : ce n'est <b>pas la même</b>.</p>`; })()},
  {n:"Exercice 4", t:"Composition d'une urne", w:"Sur ton cahier", h:`<p>Une urne ne contient que des boules vertes et des boules bleues. La probabilité d'obtenir une boule verte est ${F(CO.a,CO.b)}.</p><p><b>1)</b> Quelle est la probabilité d'obtenir une boule bleue ?</p><p><b>2)</b> Il y a ${CO.v} boules vertes. Combien y a-t-il de boules bleues ?</p>`,
   c:`<p><b>1)</b> 1 − ${F(CO.a,CO.b)} = <b>${F(CO.b-CO.a,CO.b)}</b>.</p><p><b>2)</b> Les ${CO.v} vertes représentent ${F(CO.a,CO.b)} des boules : ${CO.v} ÷ ${CO.a} × ${CO.b} = ${CO.tot} boules. Il y a donc ${CO.tot} − ${CO.v} = <b>${CO.tot-CO.v} ${CO.tot-CO.v>1?"boules bleues":"boule bleue"}</b>.</p>`},
  {n:"Exercice 5", t:"Pair ou multiple ?", w:"Sur ton cahier", h:`<p>Une urne contient ${DZ.n} boules numérotées de 1 à ${DZ.n}.</p><p><b>1)</b> Est-il plus probable d'obtenir un numéro pair ou un multiple de ${DZ.m} ?</p><p><b>2)</b> On enlève les boules dont le numéro est un diviseur de 6. Quelle est alors la probabilité d'obtenir un nombre premier ?</p>`,
   c:(()=>{ const p=mult(DZ.n,2).length, q=mult(DZ.n,DZ.m).length; return `<p><b>1)</b> Pairs : ${mult(DZ.n,2).join(", ")}, soit ${frs(p,DZ.n)}.</p><p>Multiples de ${DZ.m} : ${mult(DZ.n,DZ.m).join(", ")}, soit ${frs(q,DZ.n)}.</p><p>${p>q?"Il est plus probable d'obtenir un numéro <b>pair</b>.":p<q?`Il est plus probable d'obtenir un <b>multiple de ${DZ.m}</b>.`:"C'est <b>aussi probable</b>."}</p><p><b>2)</b> On enlève 1, 2, 3 et 6. Il reste ${DZ.rem.length} boules, dont ${DZ.pr.length} nombres premiers (${DZ.pr.join(", ")}) : ${frs(DZ.pr.length,DZ.rem.length)}${Number.isInteger(rd(DZ.pr.length/DZ.rem.length*1000,6))?` = ${N(DZ.pr.length/DZ.rem.length)}`:""}.</p>`; })()}
 ]},
 {t:"Fréquences et probabilités", e:[
  {n:"Exercice 6", t:"Le dé coloré", w:"Sur ton cahier", h:`<p>Un dé équilibré a une face bleue, une rouge, une jaune, une verte et deux noires. On le lance 100 fois :</p>${barres({cats:DE.faces, vals:DE.e, ymax:Math.ceil((Math.max(...DE.e)+1)/5)*5, ystep:5, w:380, H:260})}<p><b>1)</b> Donne la fréquence d'apparition du ${DE.faces[DE.k]} et celle du noir.</p><p><b>2)</b> Donne la probabilité d'obtenir ${DE.faces[DE.k]} et celle d'obtenir noir.</p><p><b>3)</b> Pourquoi les fréquences ne sont-elles pas égales aux probabilités ?</p>`,
   c:`<p><b>1)</b> ${DE.faces[DE.k]} : {${DE.e[DE.k]}/100} = ${N(DE.e[DE.k]/100)} ; noir : {${DE.e[4]}/100} = ${N(DE.e[4]/100)}.</p><p><b>2)</b></p><p class="calc">P(${DE.faces[DE.k]}) = {1/6}<br>P(${DE.faces[DE.k]}) ≈ 0,17</p><p class="calc">P(noir) = {2/6}<br>P(noir) = {1/3}<br>P(noir) ≈ 0,33</p><p><b>3)</b> 100 lancers ne suffisent pas : c'est sur un très grand nombre de lancers que les fréquences se rapprochent des probabilités.</p>`},
  {n:"Exercice 7", t:"La punaise", w:"Sur ton cahier", h:`<p>On lance une punaise 1 000 fois. Elle tombe sur le côté (position 1) ou sur la tête (position 2). La fréquence de la position 1 se stabilise autour de ${N(PI.f)}.</p><p>Estime la probabilité de chaque position.</p>`,
   c:`<p>P(position 1) ≈ <b>${N(PI.f)}</b> et, par l'événement contraire :</p><p class="calc">P(position 2) ≈ 1 − ${N(PI.f)}<br>P(position 2) ≈ <b>${N(rd(1-PI.f,2))}</b></p>`},
  {n:"Exercice 8", t:"Composition d'un sac", w:"Sur ton cahier", h:`<p>Un sac contient ${SAC.t} jetons jaunes, verts, rouges ou bleus. On tire un jeton avec remise un très grand nombre de fois. Les fréquences se stabilisent autour de :</p>${te(["Couleur","jaune","vert","rouge","bleu"],["Fréquence",...SAC.a.map(x=>N(x/SAC.t))])}<p>Propose une composition du sac.</p>`,
   c:`<p>On multiplie chaque fréquence par ${SAC.t} :</p>${te(["Couleur","jaune","vert","rouge","bleu"],["Nombre de jetons",...SAC.a.map(x=>`${N(x/SAC.t)} × ${SAC.t} = ${x}`)])}<p>Vérification : ${SAC.a.join(" + ")} = ${SAC.t}.</p>`},
  {n:"Exercice 9", t:"Probabilité et tableur", w:"Sur ton cahier", h:`<p>Une roue équilibrée a ${XLS.n} secteurs numérotés de 1 à ${XLS.n}. Avec un tableur, on simule 100 fois l'expérience dans les cellules A1 à J10.</p><p><b>1)</b> Quelle formule faut-il saisir en A1 ?</p><p><b>2)</b> En L2, on veut compter le nombre de fois où le secteur ${XLS.k} est sorti. Quelle formule faut-il saisir ?</p><p><b>3)</b> On obtient ${XLS.eff}. Quelle formule saisir en M2 pour calculer la fréquence ? Quelle fréquence obtient-on ?</p>`,
   c:`<p><b>1)</b> <b>=ALEA.ENTRE.BORNES(1;${XLS.n})</b>.</p><p><b>2)</b> <b>=NB.SI(A1:J10;${XLS.k})</b>.</p><p><b>3)</b> <b>=L2/100</b> : {${XLS.eff}/100} = ${N(XLS.eff/100)}. (La probabilité est {1/${XLS.n}} ${Number.isInteger(1000/XLS.n)?"=":"≈"} ${N(Number.isInteger(1000/XLS.n)?1/XLS.n:rd(1/XLS.n,2))}.)</p>`}
 ]},
 {t:"Expériences à deux épreuves", e:[
  {n:"Exercice 10", t:"Deux boules avec remise", w:"Sur ton cahier", h:`<p>Une urne contient ${UR.nb} boule${UR.nb>1?"s":""} bleue${UR.nb>1?"s":""} et ${UR.nv} boule${UR.nv>1?"s":""} violette${UR.nv>1?"s":""}${UR.L.length>2?" (numérotées)":""}. On tire deux boules successivement, avec remise.</p><p><b>1)</b> Construis un tableau des issues.</p><p><b>2)</b> Quelle est la probabilité d'obtenir deux boules violettes ?</p><p><b>3)</b> Quelle est la probabilité d'obtenir au moins une boule bleue ?</p>`,
   c:(()=>{ const n=UR.L.length, vv=UR.nv*UR.nv; return `<p><b>1)</b></p>${tab2(UR.L,UR.L,(a,b)=>a[0]==="V"&&b[0]==="V")}<p>Il y a ${n} × ${n} = ${n*n} issues.</p><p><b>2)</b> ${vv} issue${vv>1?"s":""} (en gras) :</p><p class="calc">${frc("p",vv,n*n)}</p><p><b>3)</b> C'est l'événement contraire :</p><p class="calc">${frc("q",n*n-vv,n*n,`1 − ${F(vv,n*n)}`)}</p>`; })()},
  {n:"Exercice 11", t:"Les jetons lettres", w:"Sur ton cahier", h:`<p>Un sac contient ${LET.length} jetons : ${LET.join(", ")}. On tire successivement et avec remise 2 jetons.</p><p><b>1)</b> Construis un tableau des issues.</p><p><b>2)</b> Quelle est la probabilité d'obtenir les lettres ${la} et ${lb} ?</p><p><b>3)</b> Quelle est la probabilité d'obtenir au moins une fois la lettre ${la} ?</p>`,
   c:(()=>{ const n=LET.length; return `<p><b>1)</b></p>${tab2(LET,LET)}<p>${n} × ${n} = ${n*n} issues.</p><p><b>2)</b> ${issue(la,lb)} et ${issue(lb,la)} : ${frs(2,n*n)}.</p><p><b>3)</b> ${n} issues avec ${la} en premier, ${n} avec ${la} en second, mais ${issue(la,la)} est comptée deux fois : ${2*n-1} issues, soit ${frs(2*n-1,n*n)}.</p>`; })()}
 ]}
];
};
