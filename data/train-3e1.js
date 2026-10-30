/* 3e · chapitre 1 — fiche d'entraînement : les exercices de la fiche de M. Staal (arithmétique), avec d'autres nombres.
   Toutes les corrections sont calculées par le code (outils window.ARI3 de data/3e-1.js). */
TRAIN["3e-1"] = function(){
const {ri, pick, shuf, distinct} = TR;
const {gcd, isPrime, PRIMES, divisors, spf, factors, pow, flat, steps, stepLines, common, pgcdLine, divTxt, digitSum, digitTxt, comTxt, sp, X, tab, critTab} = window.ARI3;
const listTxt = L => L.length>1 ? L.slice(0,-1).join(", ")+" et "+L[L.length-1] : String(L[0]);
/* « 24 = 1 × 24 = 2 × 12 = 3 × 8 = 4 × 6 » : les produits qui donnent n (on trouve les diviseurs deux par deux) */
const pairs = n => `${sp(n)} = `+divisors(n).filter(d=>d*d<=n).map(d=>`${d} × ${sp(n/d)}`).join(" = ");
const RICH = [12,18,20,24,28,30,32,36,40,42,44,45,48,50,52,54,56,60,63,64,66,70,72,75,80,84,90,96,100];

/* ===== Activité 1 : partage de ballons ===== */
const A1 = (()=>{ let k,N; do{ k=ri(5,9); N=ri(300,700); }while(N%k===0); let M; do{ M=pick([2,3,5])*pick([3,7,11,13])*pick([1,2,3,5]); }while(M<60||divisors(M).length<6); return {k,N,M}; })();
/* ===== Exercice 1 : diviseurs et multiples ===== */
const E1 = distinct(3, ()=>pick(RICH), x=>x).sort((a,b)=>a-b);
const m1 = ri(6,25);
/* ===== Exercice 2 : critères ===== */
const E2 = (()=>{ const L=[]; const mk=[()=>ri(100,999)*10, ()=>ri(100,999)*10+5, ()=>{ let n; do{ n=ri(100,999)*2; }while(n%10===0); return n; }, ()=>{ let n; do{ n=ri(12,111)*9; }while(n%2===0||n%5===0); return n; }];
  shuf(mk).forEach(f=>L.push(f())); return L; })();
/* ===== Activité rapide : vrai ou faux ===== */
const V1 = ri(100,999)*10+pick([5,0,3,7]), V2 = (()=>{ let n; do{ n=ri(100,999); }while(n%3===0); return n; })();
/* ===== Exercice 3 : affirmations ===== */
const E3 = shuf([
  (()=>{ const n=ri(50,150)*2; return n; })(),
  (()=>{ let n; do{ n=3*ri(13,60); }while(n%2===0||n%5===0); return n; })(),
  pick(PRIMES.filter(p=>p>40&&p<200)),
  pick([77,91,119,133,143,161,187,203,209,217,221,247,253,259])
]);
const prem = n => isPrime(n) ? `<b>Vraie.</b> ${n} n'est divisible ni par 2, ni par 3, ni par 5, ni par 7, ni par 11, ni par 13 : ses seuls diviseurs sont 1 et ${n}.`
  : `<b>Fausse.</b> ${n%2===0?`${n} est pair : `:spf(n)===3?`${digitTxt(n)}, un multiple de 3 : `:""}${n} = ${spf(n)} × ${n/spf(n)}. Il a d'autres diviseurs que 1 et ${n}.`;
/* ===== Décompositions ===== */
const D = distinct(6, ()=>{ let n; do{ n=pick([2,4,8,16,3,9,27,6,12])*pick([1,3,5,7,11,13,25]); }while(n<20||n>500||isPrime(n)); return n; }, x=>x).sort((a,b)=>a-b);
const decC = n => `<p class="calc">${stepLines(n).join("<br>")}${steps(n).length>1&&pow(factors(n))!==flat(factors(n))?` = ${pow(factors(n))}`:""}</p>`;
/* ===== N = a × b ===== */
const AB = (()=>{ const a=pick([12,18,20,28,44,45,50,63]), b=pick([15,21,22,26,33,35,39,49,55]); return {a,b,n:a*b}; })();
const fAB = factors(AB.n);
const candDiv = (()=>{ const ps=[...new Set(fAB)], q=pick([7,11,13,17,19].filter(p=>!fAB.includes(p)));
  const good = distinct(3, ()=>{ const k=ri(1,3); let d=1; shuf(fAB).slice(0,k).forEach(p=>d*=p); return d; }, x=>x).filter(d=>d>1);
  return shuf([...good.map(d=>[d,true]), [ps[0]*q,false], [q,false]]); })();
/* ===== Exercice 4 : plus grand diviseur commun ===== */
const E4 = distinct(4, ()=>{ let a,b; do{ const g=pick([1,2,3,4,5,6,7,10,12,14,15,21,25,30]); a=g*ri(2,40); b=g*ri(2,40); }while(a===b||a<20||b<20||a>2000||b>2000||isPrime(a)||isPrime(b)); return [a,b]; }, x=>x.join("-"));
/* ===== Activité 3 : toutes les possibilités ===== */
const P1 = (()=>{ let a,b; do{ a=ri(8,40); b=ri(8,40); }while(a===b||gcd(a,b)<2||divisors(gcd(a,b)).length<3); return {a,b,c:divisors(gcd(a,b))}; })();
/* ===== Problèmes « au maximum » ===== */
const CTX = [["roses","tulipes","bouquets"],["crevettes","huîtres","assiettes"],["croissants","pains au chocolat","corbeilles"],["pommes","poires","paquets"],["chocolats au lait","chocolats blancs","boîtes"],["filles","garçons","équipes"]];
const PB = distinct(2, ()=>{ const K=pick(CTX); let a,b,g; do{ g=ri(6,40); a=g*ri(2,14); b=g*ri(2,14); }while(a===b||gcd(a/g,b/g)!==1||a>600||b>600); return {K,a,b,g}; }, x=>x.K[0]);
/* ===== Plantation ===== */
const PL = (()=>{ for(let t=0;t<5000;t++){ const d=ri(8,25), k=[ri(15,45),ri(15,45),ri(15,45)]; const [x,y,z]=[...k].sort((u,v)=>u-v);
    if(x===y||y===z||x+y<=z+3) continue; if(gcd(gcd(k[0],k[1]),k[2])!==1) continue; const s=k.map(v=>v*d); if(s.some(v=>v>900)) continue; return {d,k,s}; }
  return {d:14,k:[37,32,25],s:[518,448,350]}; })();
const prix = ri(35,80);

return [
 {t:"Multiples, diviseurs et critères de divisibilité", e:[
  {n:"Activité 1", t:"Partage de ballons", w:"Sur ton cahier", h:`<p><b>1.</b> À la fin d'une fête, les ${A1.k} enfants présents se partagent équitablement ${A1.N} ballons. Combien reste-t-il de ballons ?</p><p><b>2.</b> L'année suivante, les enfants présents se partagent équitablement la <b>totalité</b> de ${A1.M} ballons. Combien pouvait-il y avoir d'enfants ? Donne toutes les possibilités.</p>`,
   c:`<p><b>1.</b> ${A1.N} = ${A1.k} × ${Math.floor(A1.N/A1.k)} + ${A1.N%A1.k} : il reste <b>${A1.N%A1.k} ballon${A1.N%A1.k>1?"s":""}</b>.</p><p><b>2.</b> Le nombre d'enfants est un diviseur de ${A1.M} (le partage tombe juste).</p><p class="calc">${pairs(A1.M)}</p><p>Les diviseurs de ${A1.M} sont : ${divTxt(A1.M)}.</p><p>Il y a plusieurs enfants : <b>${listTxt(divisors(A1.M).slice(1))}</b> enfants.</p>`},
  {n:"Exercice 1", t:"Diviseurs et multiples", w:"Sur ton cahier", h:`<p><b>a)</b> Cite tous les diviseurs de ${E1[0]}.</p><p><b>b)</b> Cite tous les diviseurs de ${E1[1]}.</p><p><b>c)</b> Cite tous les diviseurs de ${E1[2]}.</p><p><b>d)</b> Cite trois multiples de ${m1}.</p><p><b>e)</b> Cite les <b>trois premiers multiples</b> de ${m1}.</p>`,
   c:`${E1.map((n,i)=>`<p><b>${"abc"[i]})</b> ${pairs(n)}.</p><p>Les diviseurs de ${n} sont ${divTxt(n)}.</p>`).join("")}<p><b>d)</b> ${m1} × 1 = ${m1} ; ${m1} × 2 = ${2*m1} ; ${m1} × 3 = ${3*m1}. Par exemple ${m1}, ${2*m1} et ${3*m1}.</p><p><b>e)</b> ${m1} × 0 = 0 ; ${m1} × 1 = ${m1} ; ${m1} × 2 = ${2*m1}. Les trois premiers multiples de ${m1} sont 0, ${m1} et ${2*m1}.</p>`},
  {n:"Exercice 2", t:"Critères de divisibilité", w:"Sur ton cahier", h:`<p>Recopie et complète le tableau en mettant une croix lorsque le nombre est divisible par 2, 3, 5, 9 ou 10.</p>${critTab(E2,false)}`,
   c:`${critTab(E2,true)}<p>Sommes des chiffres : ${E2.map(n=>`${sp(n)} → ${digitTxt(n)}`).join(" · ")}</p>`},
  {n:"Activité rapide", t:"Vrai ou faux ?", w:"Sur ton cahier", h:`<p><b>a)</b> Vrai ou faux ? ${sp(V1)} est un multiple de 5. Justifie.</p><p><b>b)</b> Vrai ou faux ? 3 est un diviseur de ${V2}. Justifie.</p>`,
   c:`<p><b>a)</b> ${V1%5===0?`Vrai : ${sp(V1)} se termine par ${V1%10}.`:`Faux : ${sp(V1)} se termine par ${V1%10}, pas par 0 ou 5.`}</p><p><b>b)</b> Faux : ${digitTxt(V2)}, qui n'est pas un multiple de 3.</p>`}
 ]},
 {t:"Nombres premiers", e:[
  {n:"Exercice 3", t:"Affirmations sur les nombres premiers", w:"Sur ton cahier", h:`<p>Indique, <b>en justifiant rigoureusement</b>, si chacune des affirmations est vraie ou fausse.</p>${E3.map((n,i)=>`<p><b>Affirmation ${i+1} :</b> ${n} est un nombre premier.</p>`).join("")}`,
   c:E3.map((n,i)=>`<p><b>Affirmation ${i+1} :</b> ${prem(n)}</p>`).join("")}
 ]},
 {t:"Décomposition en produit de facteurs premiers", e:[
  {n:"Exercice en + 1", t:"Décomposer", w:"Sur ton cahier", h:`<p>Décompose les nombres suivants en produit de facteurs premiers.</p><div class="calcs">${D.map(n=>`<span>${n}</span>`).join("")}</div>`,
   c:D.map(decC).join("")},
  {n:"Exercice en + 2", t:"Utiliser une décomposition", w:"Sur ton cahier", h:`<p>On sait que ${sp(AB.n)} = ${AB.a} × ${AB.b}.</p><p><b>a)</b> Écris la décomposition en facteurs premiers de ${sp(AB.n)}.</p><p><b>b)</b> Parmi les nombres suivants, quels sont les diviseurs de ${sp(AB.n)} ? <i>Ne fais pas de calculs.</i></p><div class="calcs">${candDiv.map(([d])=>`<span>${pow(factors(d))}</span>`).join("")}</div>`,
   c:`<p><b>a)</b> ${AB.a} = ${flat(factors(AB.a))} et ${AB.b} = ${flat(factors(AB.b))}.</p><p class="calc">${sp(AB.n)} = ${flat(factors(AB.n))} = ${pow(factors(AB.n))}</p><p><b>b)</b> ${candDiv.map(([d,ok])=>`${pow(factors(d))} : <b>${ok?"oui":"non"}</b>`).join(" · ")}</p><p>Un diviseur ne contient que des facteurs de la décomposition de ${sp(AB.n)}.</p>`}
 ]},
 {t:"Plus grand diviseur commun et problèmes de partage", e:[
  {n:"Exercice 4", t:"Recherche du plus grand diviseur commun", w:"Sur ton cahier", h:`<p>Pour chaque cas, décompose les deux nombres en produit de facteurs premiers, puis donne leur plus grand diviseur commun.</p>${E4.map(([a,b],i)=>`<p><b>Cas n° ${i+1} :</b> ${sp(a)} et ${sp(b)}</p>`).join("")}`,
   c:E4.map(([a,b],i)=>{ const g=gcd(a,b), c=common(factors(a),factors(b)); return `<p><b>Cas n° ${i+1} :</b></p><p class="calc">${pgcdLine(a,g)}<br>${pgcdLine(b,g)}</p><p>${comTxt(a,b)}. Le plus grand diviseur commun est <b>${sp(g)}</b>.</p>`; }).join("")},
  {n:"Activité 3", t:"Toutes les possibilités", w:"Sur ton cahier", h:`<p>Un fleuriste a ${P1.a} roses rouges et ${P1.b} roses blanches. Il veut faire des bouquets identiques avec toutes ses fleurs.</p><p><b>a)</b> Combien de bouquets peut-il faire ? Donne toutes les possibilités.</p><p><b>b)</b> Quelle sera la composition de chaque bouquet ?</p>`,
   c:`<p><b>a)</b> Diviseurs de ${P1.a} : ${divTxt(P1.a)}. Diviseurs de ${P1.b} : ${divTxt(P1.b)}.</p><p>Diviseurs communs : <b>${listTxt(P1.c)}</b>.</p><p><b>b)</b></p>${tab(["Nombre de bouquets","Roses rouges","Roses blanches"],P1.c.map(d=>[String(d),String(P1.a/d),String(P1.b/d)]))}`},
  ...PB.map((P,i)=>({n:`Exercice ${5+i}`, t:"Le plus grand nombre possible", w:"Sur ton cahier", h:`<p>On dispose de ${P.a} ${P.K[0]} et de ${P.b} ${P.K[1]}. On veut faire des ${P.K[2]} identiques en utilisant tout.</p><p><b>a)</b> Combien ${/^[aeiouéè]/.test(P.K[2])?"d'":"de "}${P.K[2]} peut-on faire au maximum ?</p><p><b>b)</b> Quelle sera la composition de chacun${P.K[2]==="assiettes"||P.K[2]==="corbeilles"||P.K[2]==="boîtes"||P.K[2]==="équipes"?"e":""} ?</p>`,
   c:`<p class="calc">${pgcdLine(P.a,P.g)}<br>${pgcdLine(P.b,P.g)}</p><p><b>a)</b> ${comTxt(P.a,P.b)}. On peut faire <b>${P.g} ${P.K[2]}</b> au maximum.</p><p><b>b)</b> ${P.a} ÷ ${P.g} = ${P.a/P.g} et ${P.b} ÷ ${P.g} = ${P.b/P.g} : <b>${P.a/P.g} ${P.K[0]} et ${P.b/P.g} ${P.K[1]}</b>.</p>`})),
  {n:"Exercice en + 3", t:"Plantation", w:"Sur ton cahier", h:`<p>Un terrain de camping a la forme d'un triangle dont les côtés mesurent ${PL.s.join(" m, ").replace(/, (\d+)$/," et $1")} m.</p><p>On plante des arbres régulièrement espacés le long des côtés, avec un arbre à chaque sommet. La distance entre deux arbres consécutifs est un nombre entier de mètres.</p><p><b>1.</b> Quel est le nombre minimum d'arbres à acheter ?</p><p><b>2.</b> Un arbre coûte ${prix} €. Quel sera le coût total ?</p>`,
   c:`<p><b>1.</b> La distance doit diviser les trois longueurs et être la plus grande possible : c'est leur plus grand diviseur commun.</p><p class="calc">${PL.s.map(v=>`${v} = ${flat(factors(v))}`).join("<br>")}</p><p>Le plus grand diviseur commun est ${PL.d}${factors(PL.d).length>1?` = ${flat(factors(PL.d))}`:""} : un arbre tous les ${PL.d} m.</p>
   <p>Périmètre : ${PL.s.join(" + ")} = ${sp(PL.s[0]+PL.s[1]+PL.s[2])} m. ${sp(PL.s[0]+PL.s[1]+PL.s[2])} ÷ ${PL.d} = ${(PL.s[0]+PL.s[1]+PL.s[2])/PL.d} : il faut <b>${(PL.s[0]+PL.s[1]+PL.s[2])/PL.d} arbres</b>.</p><p><b>2.</b> ${(PL.s[0]+PL.s[1]+PL.s[2])/PL.d} × ${prix} = <b>${sp((PL.s[0]+PL.s[1]+PL.s[2])/PL.d*prix)} €</b>.</p>`}
 ]}
];
};
