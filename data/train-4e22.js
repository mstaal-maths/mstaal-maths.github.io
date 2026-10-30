/* 4e · chapitre 22 — fiche d'entraînement : les activités et exercices de M. Staal, avec d'autres nombres.
   Toutes les solutions sont calculées par le solveur EQ22 (4e-22.js). */
TRAIN["4e-22"] = function(){
const {ri, pick, shuf, items} = TR;
const {nz, F, X, E, prog, progs} = window.CL7;
const {Q, QS, solve, balance} = window.EQ22;
const x=X("x"), n=X("n"), b=X("b");
const sol=(a,bb,c,d,o)=>{ const S=solve(a,bb,c,d,o); return `<p class="calc">${S.L.join("<br>")}</p><p>La solution est <b>${S.s}</b>.</p>`; };
const eqW=(a,bb,c,d)=>`${E([[a,"x"],[bb,""]])} = ${E([[c,"x"],[d,""]])}`;

/* ===== A. Activité 1 : remonter un programme ===== */
const a1=pick([4,5,8]), b1=ri(1,9), r1=[a1*ri(2,9)+b1, a1*ri(2,9)+b1+pick([1,2,3]), -ri(10,40)];
const a2=ri(2,a1-1), b2=b1+(a1-a2)*ri(2,9);        /* Lou et Jules : même nombre entier */
const s3=(b2-b1)/(a1-a2);
const p5=[ri(5,9),ri(1,9)], q5=[ri(2,4),ri(10,20)]; /* partie 5 : solution souvent fractionnaire */
const S5=solve(p5[0],p5[1],q5[0],q5[1],{v:"n"});
const back=(r,a,bb)=>`${F(r)} − ${bb} = ${F(r-bb)}, puis ${F(r-bb)} ÷ ${a} = <b>${QS(Q(r-bb,a))}</b>`;
const secA={t:"Retrouver le nombre choisi au départ", e:[
  {n:"Activité 1", t:"Trouve le nombre choisi au départ", w:"Sur ton cahier", h:`<p><b>Lou :</b> « Je multiplie mon nombre par ${a1}, puis j'ajoute ${b1}. »</p><p><b>1)</b> Lou a trouvé ${F(r1[0])}, puis ${F(r1[1])}, puis ${F(r1[2])}. Quels nombres de départ a-t-elle choisis ?</p>
   <p><b>Jules :</b> « Moi, je multiplie mon nombre par ${a2}, puis j'ajoute ${b2}. »</p><p><b>2)</b> Lou et Jules choisissent le même nombre et trouvent le même résultat. Quel est ce nombre ?</p>
   <p><b>3)</b> Nouveaux programmes : Lou multiplie par ${p5[0]} et ajoute ${p5[1]} ; Jules multiplie par ${q5[0]} et ajoute ${q5[1]}. Ils choisissent le même nombre ${n} et trouvent le même résultat. Écris une équation et trouve ${n}.</p>`,
   c:`<p><b>1)</b> Je remonte le programme (opérations inverses) :</p><p>${r1.map(r=>back(r,a1,b1)).join("</p><p>")}</p>
   <p><b>2)</b> ${a1}${n} + ${b1} = ${a2===1?"":a2}${n} + ${b2}</p>${sol(a1,b1,a2,b2,{v:"n"})}<p>Vérification : ${a1} × ${s3} + ${b1} = ${a1*s3+b1} et ${a2} × ${s3} + ${b2} = ${a2*s3+b2}.</p>
   <p><b>3)</b> ${p5[0]}${n} + ${p5[1]} = ${q5[0]}${n} + ${q5[1]}</p><p class="calc">${S5.L.join("<br>")}</p><p>Le nombre choisi est <b>${S5.s}</b>.</p>`}
 ]};

/* ===== B. Balances ===== */
const m1=ri(2,7)*50, w1=pick([100,200]), k2=pick([3,4,5]), m2=k2*ri(4,30)*5;
const bb3=(()=>{ const m=ri(10,60)*5; const g=ri(2,4), d=g+ri(1,2), W=pick([500,600,700]); return {g,d,W,m, R:W-(d-g)*m}; })();
const B3ok=bb3.R>0;
const secB={t:"Découvrir les équations avec des balances", e:[
  {n:"Activité 2", t:"Masse de la boule", w:"Sur ton cahier", h:`<p>Les balances sont équilibrées. Les masses sont en grammes.</p><p>Pour chaque balance, écris une équation (${b} = masse d'une boule), puis trouve la masse d'une boule.</p>
   <p><b>Cas 1</b></p>${balance([{b:1},{w:w1}],[{w:m1+w1}],{alt:`À gauche une boule et ${w1} g ; à droite ${m1+w1} g`})}
   <p><b>Cas 2</b></p>${balance([{b:k2}],[{w:m2}],{alt:`À gauche ${k2} boules ; à droite ${m2} g`})}
   ${B3ok?`<p><b>Cas 3</b></p>${balance([{b:bb3.d},{w:bb3.R}],[{b:bb3.g},{w:bb3.W}],{alt:`À gauche ${bb3.d} boules et ${bb3.R} g ; à droite ${bb3.g} boules et ${bb3.W} g`})}`:""}`,
   c:`<p><b>Cas 1 :</b> ${b} + ${w1} = ${m1+w1}</p>${sol(1,w1,0,m1+w1,{v:"b"})}<p><b>Cas 2 :</b> ${k2}${b} = ${m2}</p>${sol(k2,0,0,m2,{v:"b"})}${B3ok?`<p><b>Cas 3 :</b> ${bb3.d}${b} + ${bb3.R} = ${bb3.g}${b} + ${bb3.W}</p>${sol(bb3.d,bb3.R,bb3.g,bb3.W,{v:"b"})}`:""}<p>Les masses sont en grammes.</p>`}
 ]};

/* ===== C. Exercice 1 : résoudre des équations (mêmes formes que la fiche) ===== */
const forms=[
  ()=>{ const c=ri(1,6), a=c+1, s=ri(1,9), bb=ri(1,9); return [a,bb,c,s+bb]; },
  ()=>{ const c=1, a=ri(3,6), s=pick([1.5,2.5,3.5,2,3]), bb=ri(1,9); return [a,bb,c,(a-1)*s+bb]; },
  ()=>{ const a=ri(1,3), c=a+ri(2,4), d=ri(5,15), bb=d+ri(1,9); return [a,bb,c,d]; },
  ()=>{ const c=ri(2,5), a=c+ri(2,5); return [a,0,c,ri(2,12)]; },
  ()=>[0,ri(5,15),ri(2,9),ri(1,4)],
  ()=>{ const a=ri(2,9); return [a,0,0,a*ri(2,9)]; },
  ()=>{ const a=ri(2,8), c=a+ri(2,8); return [a,ri(2,9),c,0]; },
  ()=>{ const c=ri(3,9), a=c+ri(2,5), s=ri(1,6), bb=ri(1,5); return [a,bb,c,(a-c)*s+bb]; },
  ()=>[pick([4,5,8,10]),0,0,ri(1,9)],
  ()=>{ const a=ri(3,9); return [a,ri(1,5),0,ri(6,12)]; }
];
const E1=forms.map(f=>f());
const w1x=([a,bb,c,d])=>`${a===0?F(bb):E([[a,"x"],[bb,""]])} = ${c===0?F(d):E([[c,"x"],[d,""]])}`;
/* ===== E. équations avec des négatifs ===== */
const E12=Array.from({length:5},()=>{ let a,c,bb,d; do{ a=nz(-6,8); c=nz(-6,8); bb=nz(-12,12); d=nz(-12,12); }while(a===c || (bb>0&&d>0&&a>0&&c>0)); return [a,bb,c,d]; });
const secC={t:"Résoudre des équations", e:[
  {n:"Exercice 1", t:"Résoudre des équations", w:"Sur ton cahier", h:`<p>Résous les équations suivantes.</p><div class="calcs">${E1.map((t,i)=>`<span>${TR.L[i]}) ${w1x(t)}</span>`).join("")}</div>`,
   c:E1.map((t,i)=>`<p><b>${TR.L[i]})</b></p>`+sol(...t)).join("")},
  {n:"Exercice 12", t:"Équations avec des nombres négatifs", w:"Sur ton cahier", h:`<p>Résous les équations suivantes.</p><div class="calcs">${E12.map((t,i)=>`<span>${TR.L[i]}) ${eqW(...t)}</span>`).join("")}</div>`,
   c:E12.map((t,i)=>`<p><b>${TR.L[i]})</b></p>`+sol(...t)).join("")}
 ]};

/* ===== D. Problèmes ===== */
const dv=(()=>{ const p=ri(4,8), q=ri(1,p-2), d=pick([5,6,7.5,8,9.5,12]); const A=ri(20,60); return {p,q,d,A,B:A+(p-q)*d}; })();
const L3=ri(6,15), P3=2*L3+ri(5,25);
const pr4={a:ri(3,9), bb:ri(2,9)};
const r4=[pr4.a*ri(2,9)+pr4.bb+pick([0.4,0.8,1.2])*pr4.a, 0];
const k7=ri(2,4), s7=ri(3,8), p7=ri(1,9), m7=k7*s7-p7-s7>0?k7*s7-p7-s7:null;
const t9=(()=>{ /* carré x + a, triangle équilatéral x + c : 4x + 4a = 3x + 3c → x = 3c − 4a */ let a,c; do{ a=ri(1,5); c=ri(2,9); }while(3*c-4*a<=0); return {a,c,s:3*c-4*a}; })();
const mel=(()=>{ const a=ri(4,7), bb=ri(1,9), k=ri(2,3), m=ri(2,8); return {a,bb,k,m}; })();
const seg={L:pick([5.6,7,8.4,11.2,14])};      /* multiples de 1,4 : AM = 4L ÷ 7 tombe juste */
const secD={t:"Résoudre des problèmes avec une équation", e:[
  {n:"Exercice 2", t:"Prix d'un DVD", w:"Sur ton cahier", h:`<p>Deux bons cadeaux ont la même valeur :</p><p>bon 1 : ${dv.p} DVD et un jeu à ${dv.A} € ; bon 2 : ${dv.q} DVD et une console de jeux à ${F(dv.B)} €.</p><p>Tous les DVD ont le même prix. Quel est le prix d'un DVD ?</p>`,
   c:`<p>On appelle ${X("d")} le prix d'un DVD : ${dv.p}${X("d")} + ${dv.A} = ${dv.q===1?"":dv.q}${X("d")} + ${F(dv.B)}.</p>${sol(dv.p,dv.A,dv.q,dv.B,{v:"d"})}<p>Un DVD coûte ${F(dv.d)} €.</p>`},
  {n:"Exercice 3", t:"Largeur d'un rectangle", w:"Sur ton cahier", h:`<p>Un rectangle a pour longueur ${L3}. Quelle doit être sa largeur pour que son périmètre soit égal à ${P3} ?</p>`,
   c:`<p>Si ${x} est la largeur : 2 × (${L3} + ${x}) = ${2*L3} + 2${x}.</p>${sol(2,2*L3,0,P3)}`},
  {n:"Exercice 4", t:"Retrouver le nombre de départ", w:"Sur ton cahier", h:`${progs(prog("Programme",["Choisir un nombre",`Multiplier par ${pr4.a}`,`Ajouter ${pr4.bb}`]))}<p><b>a)</b> Le résultat est ${F(r4[0])}. Quel était le nombre de départ ?</p><p><b>b)</b> Le résultat est 0. Quel était le nombre de départ ?</p>`,
   c:`<p>Le résultat est ${pr4.a}${x} + ${pr4.bb}.</p><p><b>a)</b></p>${sol(pr4.a,pr4.bb,0,r4[0])}<p><b>b)</b></p>${sol(pr4.a,pr4.bb,0,0)}`},
  {n:"Exercice 7", t:"Un rectangle qui devient un carré", w:"Sur ton cahier", h:`<p>Un rectangle a pour longueur ${x} + ${m7||6} et pour largeur ${m7?k7:3}${x} − ${m7?p7:4}. Quelle doit être la valeur de ${x} pour que ce soit un carré ? Quel est alors son côté ?</p>`,
   c:`${sol(1,m7||6,m7?k7:3,-(m7?p7:4))}<p>Le côté mesure alors ${m7?s7+m7:11}.</p>`},
  {n:"Exercice 9", t:"Même périmètre", w:"Sur ton cahier", h:`<p>Un carré a pour côté ${x} + ${t9.a}. Un triangle équilatéral a pour côté ${x} + ${t9.c}. Pour quelle valeur de ${x} ont-ils le même périmètre ?</p>`,
   c:`<p>Carré : 4(${x} + ${t9.a}) = 4${x} + ${4*t9.a}. Triangle : 3(${x} + ${t9.c}) = 3${x} + ${3*t9.c}.</p>${sol(4,4*t9.a,3,3*t9.c)}`},
  {n:"Exercice 10", t:"Les programmes de Mélanie", w:"Sur ton cahier", h:`${progs(prog("Programme 1",["Choisir un nombre",`Multiplier par ${mel.a}`,`Ajouter ${mel.bb}`]),prog("Programme 2",["Choisir un nombre",`Soustraire ${mel.m}`,`Multiplier par ${mel.k}`]))}<p>Mélanie trouve le même résultat avec les deux programmes, en partant du même nombre. Quel était ce nombre ?</p>`,
   c:`<p>Programme 1 : ${mel.a}${x} + ${mel.bb}. Programme 2 : (${x} − ${mel.m}) × ${mel.k} = ${mel.k}${x} − ${mel.k*mel.m}.</p>${sol(mel.a,mel.bb,mel.k,-mel.k*mel.m)}`},
  {n:"Exercice 11", t:"Une histoire de périmètre", w:"Sur ton cahier", h:`<p>Le segment [AB] mesure ${F(seg.L)} cm. M est un point de [AB]. On construit un triangle équilatéral de côté [AM] et un carré de côté [MB].</p><p>Où placer M pour que le triangle et le carré aient le même périmètre ?</p>`,
   c:`<p>On appelle ${x} = AM. Alors MB = ${F(seg.L)} − ${x}. Triangle : 3${x}. Carré : 4(${F(seg.L)} − ${x}) = ${F(4*seg.L)} − 4${x}.</p>${sol(3,0,-4,4*seg.L,{od:"n"})}<p>Il faut placer M à ${QS(Q(4*seg.L,7))} cm de A.</p>`}
 ]};

return [secA, secB, secC, secD];
};
