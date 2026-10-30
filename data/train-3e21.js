/* 3e · chapitre 21 — fiche d'entraînement : les exercices de la fiche de M. Staal (preuve et arithmétique), avec d'autres nombres et d'autres affirmations du même type.
   Les développements sont calculés par le moteur window.ALG3. */
TRAIN["3e-21"] = function(){
const {ri, pick, shuf, distinct} = TR;
const AL = window.ALG3, {devLines} = AL;
const calc = lines => `<p class="calc">${lines.join("<br>")}</p>`;
const dv = (nm,s) => calc(devLines(nm,s,{sort:true}));
const n = "<i>n</i>";
const N = v => String(v).replace("-","−");
const sp = v => String(v).replace(/\B(?=(\d{3})+(?!\d))/g," ");

/* ===== Activité : somme de k entiers consécutifs, multiple de k ? ===== */
const K = pick([3,4,5,6,7]), A0 = ri(2,20), A1 = ri(21,60);
const consec = (a,k) => Array.from({length:k},(_,i)=>a+i);
const sumC = (a,k) => consec(a,k).reduce((s,v)=>s+v,0);
const tri = K*(K-1)/2;                                   /* 0 + 1 + … + (K − 1) */
const termes = Array.from({length:K},(_,i)=>i?`(${n} + ${i})`:n).join(" + ");
const ACT = K%2===1
  ? `${calc([`S = ${termes}`,`S = ${K}${n} + ${tri}`,`S = ${K}(${n} + ${tri/K})`])}<p>La somme est de la forme ${K} × (${n} + ${tri/K}) : c'est toujours un <b>multiple de ${K}</b>. L'affirmation est <b>vraie</b>.</p>`
  : `${calc([`S = ${termes}`,`S = ${K}${n} + ${tri}`])}<p>${tri} n'est pas un multiple de ${K} : la somme n'est jamais un multiple de ${K}.</p><p>Contre-exemple : ${consec(1,K).join(" + ")} = ${sumC(1,K)}, qui n'est pas un multiple de ${K} (${sumC(1,K)} = ${K} × ${Math.floor(sumC(1,K)/K)} + ${sumC(1,K)%K}). L'affirmation est <b>fausse</b>.</p>`;

/* ===== Ex 1 : propriétés de parité ===== */
const PROPS = [
  {t:"la somme de deux nombres impairs est un nombre pair", ex:()=>{ const a=2*ri(1,20)+1, b=2*ri(1,20)+1; return `${a} + ${b} = ${a+b}`; }, p:[`(2${n} + 1) + (2${n}' + 1)`,`2${n} + 2${n}' + 2`,`2(${n} + ${n}' + 1)`], c:`de la forme 2 × (un entier) : c'est un nombre pair`, w:`Soit 2${n} + 1 et 2${n}' + 1 deux nombres impairs (${n} et ${n}' entiers).`},
  {t:"la somme d'un nombre pair et d'un nombre impair est un nombre impair", ex:()=>{ const a=2*ri(1,20), b=2*ri(1,20)+1; return `${a} + ${b} = ${a+b}`; }, p:[`2${n} + (2${n}' + 1)`,`2(${n} + ${n}') + 1`], c:`de la forme 2 × (un entier) + 1 : c'est un nombre impair`, w:`Soit 2${n} un nombre pair et 2${n}' + 1 un nombre impair (${n} et ${n}' entiers).`},
  {t:"la somme de deux multiples de 3 est un multiple de 3", ex:()=>{ const a=3*ri(2,20), b=3*ri(2,20); return `${a} + ${b} = ${a+b} = 3 × ${(a+b)/3}`; }, p:[`3${n} + 3${n}'`,`3(${n} + ${n}')`], c:`de la forme 3 × (un entier) : c'est un multiple de 3`, w:`Soit 3${n} et 3${n}' deux multiples de 3 (${n} et ${n}' entiers).`},
  {t:"le double d'un nombre impair, augmenté de 2, est un multiple de 4", ex:()=>{ const a=2*ri(1,20)+1; return `2 × ${a} + 2 = ${2*a+2} = 4 × ${(2*a+2)/4}`; }, p:[`2(2${n} + 1) + 2`,`4${n} + 2 + 2`,`4${n} + 4`,`4(${n} + 1)`], c:`de la forme 4 × (un entier) : c'est un multiple de 4`, w:`Soit 2${n} + 1 un nombre impair (${n} entier).`},
  {t:"la somme de deux nombres pairs consécutifs est un multiple de 2 mais jamais de 4", ex:()=>{ const a=2*ri(1,20); return `${a} + ${a+2} = ${2*a+2}`; }, p:[`2${n} + (2${n} + 2)`,`4${n} + 2`,`2(2${n} + 1)`], c:`égale à 2 × (un nombre impair) : c'est un multiple de 2. Comme 4${n} + 2 = 4 × ${n} + 2, le reste de la division par 4 est 2 : ce n'est jamais un multiple de 4`, w:`Deux nombres pairs consécutifs s'écrivent 2${n} et 2${n} + 2 (${n} entier).`}
];
const P2 = shuf(PROPS).slice(0,2);

/* ===== Ex 2 : somme de k consécutifs et nombre du milieu ===== */
const Z = (()=>{ const ok=Math.random()<0.6; if(ok){ const k=pick([3,5,7]), m=(k-1)/2; return {ok, k, m, txt:`la somme de ${k} nombres entiers positifs consécutifs est égale à ${k} fois le nombre du milieu`}; }
  return {ok, k:4, m:1, txt:"la somme de quatre nombres entiers positifs consécutifs est égale à 4 fois le deuxième"}; })();
const Za = ri(2,15);
const ZT = Array.from({length:Z.k},(_,i)=>i?`(${n} + ${i})`:n).join(" + ");
const ZC = Z.ok
  ? `${calc([`S = ${ZT}`,`S = ${Z.k}${n} + ${Z.k*Z.m}`,`S = ${Z.k}(${n} + ${Z.m})`])}<p>Le nombre du milieu est ${n} + ${Z.m} : la somme est bien égale à ${Z.k} fois ce nombre. L'affirmation est <b>vraie</b>.</p>`
  : `${calc([`S = ${ZT}`,`S = 4${n} + 6`])}<p>4 fois le deuxième nombre donne 4(${n} + 1) = 4${n} + 4, et 4${n} + 6 ≠ 4${n} + 4 : l'affirmation est <b>fausse</b>.</p>`;

/* ===== Ex 3 : type brevet ===== */
const V = pick([
  {t:"Léa pense qu'en multipliant deux nombres impairs consécutifs et en ajoutant 1, on obtient toujours un multiple de 4.", ex:a=>{ const u=2*a+1, v=2*a+3; return [`${u} × ${v} + 1 = ${sp(u*v+1)}`, u*v+1]; }, src:"(2n+1)(2n+3)+1", f:`4(${n}² + 2${n} + 1)`, w:`Deux nombres impairs consécutifs s'écrivent 2${n} + 1 et 2${n} + 3.`, div:4},
  {t:"Hugo pense que la différence entre les carrés de deux entiers qui encadrent un nombre entier (le précédent et le suivant) est toujours un multiple de 4.", ex:a=>[`${a+1}² − ${a-1}² = ${sp((a+1)**2)} − ${sp((a-1)**2)} = ${sp(4*a)}`, 4*a], src:"(n+1)2-(n-1)2", lines:[`R = (${n} + 1)² − (${n} − 1)²`,`R = (${n} + 1)(${n} + 1) − (${n} − 1)(${n} − 1)`,`R = (${n}² + ${n} + ${n} + 1) − (${n}² − ${n} − ${n} + 1)`,`R = ${n}² + 2${n} + 1 − ${n}² + 2${n} − 1`,`R = 4${n}`], f:`4${n}`, w:`Le précédent et le suivant de ${n} s'écrivent ${n} − 1 et ${n} + 1.`, div:4},
  {t:"Inès pense que le produit de deux nombres pairs consécutifs est toujours un multiple de 4.", ex:a=>[`${2*a} × ${2*a+2} = ${sp(2*a*(2*a+2))}`, 2*a*(2*a+2)], src:"2n(2n+2)", f:`4(${n}² + ${n})`, w:`Deux nombres pairs consécutifs s'écrivent 2${n} et 2${n} + 2.`, div:4}
]);
const Va = ri(2,9), Vb = ri(10,25), E1 = V.ex(Va), E2 = V.ex(Vb);

return [
 {t:"Preuve et arithmétique", e:[
  {n:"Activité", t:"Nombres consécutifs", w:"Sur ton cahier", h:`<p>« La somme de ${K} nombres entiers positifs consécutifs est toujours un multiple de ${K}. »</p><p><b>1.</b> Teste avec ${consec(A0,K).join(", ")}, puis avec ${consec(A1,K).join(", ")}.</p><p><b>2.</b> Cette affirmation est-elle vraie ? Prouve-le.</p>`,
   c:`<p><b>1.</b> ${consec(A0,K).join(" + ")} = ${sumC(A0,K)}${sumC(A0,K)%K?"":` = ${K} × ${sumC(A0,K)/K}`} ; ${consec(A1,K).join(" + ")} = ${sumC(A1,K)}${sumC(A1,K)%K?"":` = ${K} × ${sumC(A1,K)/K}`}.</p><p><b>2.</b> On écrit ${K} nombres consécutifs : ${Array.from({length:K},(_,i)=>i?`${n} + ${i}`:n).join(", ")}.</p>${ACT}`},
  {n:"Ex 1", t:"Prouver une propriété", w:"Sur ton cahier", h:`<p>Prouve que :</p>${P2.map((P,i)=>`<p><b>${"ab"[i]})</b> ${P.t}${i<P2.length-1?" ;":"."}</p>`).join("")}<p>Commence par un exemple pour chacune.</p>`,
   c:P2.map((P,i)=>`<p><b>${"ab"[i]})</b> Exemple : ${P.ex()}.</p><p>${P.w}</p>${calc(P.p.map(l=>"S = "+l))}<p>S est ${P.c}.</p>`).join("")},
  {n:"Ex 2", t:"Vrai ou faux ?", w:"Sur ton cahier", h:`<p>Zoé affirme : « ${Z.txt[0].toUpperCase()+Z.txt.slice(1)}. »</p><p>Qu'en penses-tu ? Explique.</p>`,
   c:`<p>Exemple : ${consec(Za,Z.k).join(" + ")} = ${sumC(Za,Z.k)} et ${Z.k} × ${Za+Z.m} = ${Z.k*(Za+Z.m)}.${Z.ok?"":" C'est déjà un contre-exemple."}</p><p>Avec ${n} le premier nombre :</p>${ZC}`},
  {n:"Ex 3", t:"Le résultat est-il toujours un multiple de 4 ?", w:"Sur ton cahier", h:`<p>${V.t}</p><p>Dans tout l'exercice, ${n} est un nombre entier. ${V.w}</p><p><b>1.</b> Teste l'affirmation avec ${n} = ${Va}, puis avec ${n} = ${Vb}.</p><p><b>2.</b> Écris le résultat avec ${n}, développe et réduis.</p><p><b>3.</b> Prouve que le résultat est toujours un multiple de 4.</p>`,
   c:`<p><b>1.</b> Avec ${n} = ${Va} : ${E1[0]} = 4 × ${sp(E1[1]/4)}. Avec ${n} = ${Vb} : ${E2[0]} = 4 × ${sp(E2[1]/4)}.</p><p><b>2.</b></p>${V.lines?calc(V.lines):dv("R",V.src)}<p><b>3.</b> R = ${V.f} : c'est de la forme 4 × (un entier), donc toujours un <b>multiple de 4</b>.</p>`}
 ]}
];
};
