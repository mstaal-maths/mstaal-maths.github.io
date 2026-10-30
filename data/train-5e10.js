/* 5e · chapitre 10 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres.
   Toutes les corrections sont calculées par le code. */
TRAIN["5e-10"] = function(){
const {ri, pick, shuf, distinct, items} = TR;
const {F, X, mono, lin, par, r3, NL} = window.ALG;
const NM = "ABCDEFGHI";
const cols = arr => `<div class="calcs">${arr.map(x=>`<span>${x}</span>`).join("")}</div>`;
const grid = arr => `<div class="calcs">${arr.map(([n,ch])=>`<div>${NL(n,ch)}</div>`).join("")}</div>`;
const sg = b => b<0 ? "−" : "+";
const tab = (head, rows) => `<div class="scroll"><table class="std"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const NB = ["","un","deux","trois","quatre","cinq","six"];

/* ===== A. Expressions littérales ===== */
/* Activité : allumettes */
const NS = [1,2,3, ri(4,6), ri(7,15)];
const target = (()=>{ const ok=Math.random()<0.6; let T; do{ T=ri(40,160); }while(((T-1)%3===0)!==ok); return T; })();
const tOk = (target-1)%3===0;
/* Ex 1 : traduire */
const v1 = pick(["n","x","y"]), k1=ri(2,9), k2=ri(2,9);
const TRAD = shuf([
  [`le double de ${X(v1)}`, mono(2,v1)],
  [`le prédécesseur de ${X(v1)}`, lin(1,-1,v1)],
  [`le triple de ${X(v1)} augmenté de ${k1}`, lin(3,k1,v1)],
  [`le double de ${X(v1)} augmenté de ${k2}`, lin(2,k2,v1)],
  [`la moitié de ${X(v1)}`, `${X(v1)} ÷ 2`],
  [`le successeur de ${X(v1)}`, lin(1,1,v1)],
  [`le triple de ${X(v1)}`, mono(3,v1)]
]).slice(0,4).concat(shuf([
  [`le périmètre d'un carré de côté ${X("c")}`, mono(4,"c")],
  [`l'aire d'un rectangle de côtés ${X("a")} et ${X("b")}`, X("a")+X("b")],
  [`le périmètre d'un rectangle de longueur ${X("L")} et de largeur ${X("l")}`, `2(${X("L")}+${X("l")})`]
]).slice(0,2));
/* Ex 2 : tableau de valeurs */
const xs = [0, ri(1,4), ri(1,3)+0.5, ri(5,6)];
const a2=ri(2,6), b2=ri(1,9), k3=ri(2,6), c3=ri(1,5), d4=ri(1,3), e5=ri(1,9);
const c4 = d4*xs[3] + ri(0,8);                     /* c − d x reste positif */
const E2 = [[lin(a2,b2), x=>a2*x+b2],[par(k3,c3), x=>k3*(x+c3)],[`${c4} − ${mono(d4)}`, x=>c4-d4*x],[`${X("x")} × ${X("x")} + ${e5}`, x=>x*x+e5]];
/* Ex 3 : programme de calcul */
const p3 = (()=>{ let a,k,b; do{ a=ri(1,9); k=ri(2,5); b=ri(1,k*a-1); }while(k*a-b<=0); return {a,k,b}; })();
const n3 = [ri(2,9), ri(1,6)+0.5];
const run3 = x => { const s1=r3(x+p3.a), s2=r3(s1*p3.k), s3=r3(s2-p3.b); return `${F(x)} + ${p3.a} = ${F(s1)} ; ${F(s1)} × ${p3.k} = ${F(s2)} ; ${F(s2)} − ${p3.b} = <b>${F(s3)}</b>`; };
/* Ex 4 : tester une égalité a x + b = x + d, de solution s */
const a4=ri(2,4), s4=ri(1,6), b4=ri(1,9), d4b=(a4-1)*s4+b4;
const T4 = shuf([s4, ...distinct(3, ()=>{ let v; do{ v=ri(0,10); }while(v===s4); return v; }, x=>x)]);
const secA = {t:"Expressions littérales", e:[
  {n:"Activité 1", t:"Des carrés d'allumettes", w:"Sur ton cahier", h:`<p>Voici des lignes de carrés construites avec des allumettes.</p>${img("5k10ex/act1.png","Une ligne de 1 carré, une ligne de 2 carrés et une ligne de 3 carrés faites avec des allumettes",500)}
   <p><b>1)</b> Complète le tableau.</p>${tab(["Nombre de carrés",...NS.map(String)],[["Nombre d'allumettes","4","","","",""]])}
   <p><b>2)</b> Écris une formule qui donne le nombre d'allumettes pour ${X("n")} carrés.</p><p><b>3)</b> Peut-on construire une ligne avec exactement ${target} allumettes ? Si oui, combien de carrés ?</p>`,
   c:`<p><b>1)</b></p>${tab(["Nombre de carrés",...NS.map(String)],[["Nombre d'allumettes",...NS.map(n=>String(3*n+1))]])}<p><b>2)</b> On ajoute 3 allumettes par carré, le premier en demande 4 : <b>3${X("n")} + 1</b>.</p>
   <p><b>3)</b> On cherche ${X("n")} tel que 3${X("n")} + 1 = ${target} : 3${X("n")} = ${target-1}.</p>${tOk?`<p>${X("n")} = ${target-1} ÷ 3 = ${(target-1)/3}. <b>Oui</b>, avec ${(target-1)/3} carrés : 3 × ${(target-1)/3} + 1 = ${target}.</p>`:`<p>${target-1} n'est pas un multiple de 3 : ${target-1} ÷ 3 ne tombe pas juste. <b>Non</b>, c'est impossible.</p>`}`},
  {n:"Exercice 1", t:"Traduire par une expression", w:"Sur ton cahier", h:`<p>Écris chaque expression avec la lettre indiquée.</p><p>${items(TRAD.map(([t])=>t+" : ………")," ",true)}</p>`,
   c:`<p>On supprime le signe × devant une lettre.</p><p>${items(TRAD.map(([t,r])=>t+" : <b>"+r+"</b>"),"</p><p>",true)}</p>`},
  {n:"Exercice 2", t:"Calculer la valeur d'une expression", w:"Sur ton cahier", h:`<p>Recopie et complète le tableau.</p>${tab(["Valeur de "+X("x"),...xs.map(F)], E2.map(([e])=>[e,"","","",""]))}`,
   c:`${tab(["Valeur de "+X("x"),...xs.map(F)], E2.map(([e,f])=>[e,...xs.map(x=>F(f(x)))]))}<p>On remplace ${X("x")} par sa valeur en remettant le signe ×, puis on respecte les priorités.</p>`},
  {n:"Exercice 3", t:"Programme de calcul", w:"Sur ton cahier", h:`<p>« Choisis un nombre ; ajoute ${p3.a} ; multiplie le résultat par ${p3.k} ; soustrais ${p3.b}. »</p><p><b>1)</b> Applique ce programme au nombre ${F(n3[0])}, puis au nombre ${F(n3[1])}.</p><p><b>2)</b> Écris une expression qui donne le résultat pour un nombre ${X("x")}.</p><p><b>3)</b> Réduis cette expression, puis vérifie avec ${F(n3[0])}.</p>`,
   c:`<p><b>1)</b> Avec ${F(n3[0])} : ${run3(n3[0])}.</p><p>Avec ${F(n3[1])} : ${run3(n3[1])}.</p><p><b>2)</b> ${par(p3.k,p3.a)} − ${p3.b}</p><p><b>3)</b></p>${NL("A",`${par(p3.k,p3.a)} − ${p3.b} = ${p3.k} × ${X("x")} + ${p3.k} × ${p3.a} − ${p3.b} = ${lin(p3.k,p3.k*p3.a)} − ${p3.b} = <b>${lin(p3.k,p3.k*p3.a-p3.b)}</b>`)}<p>Avec ${X("x")} = ${F(n3[0])} : ${p3.k} × ${F(n3[0])} + ${p3.k*p3.a-p3.b} = ${F(p3.k*n3[0]+p3.k*p3.a-p3.b)} ✓</p>`},
  {n:"Exercice 4", t:"Tester une égalité", w:"Sur ton cahier", h:`<p>Teste l'égalité ${lin(a4,b4)} = ${lin(1,d4b)} pour chaque valeur de ${X("x")}.</p>${tab(["Valeur de "+X("x"),"Valeur de "+lin(a4,b4),"Valeur de "+lin(1,d4b),"Égalité vraie ou fausse ?"], T4.map(x=>[String(x),"","",""]))}`,
   c:tab(["Valeur de "+X("x"),"Valeur de "+lin(a4,b4),"Valeur de "+lin(1,d4b),"Égalité vraie ou fausse ?"], T4.map(x=>[String(x),String(a4*x+b4),String(x+d4b),a4*x+b4===x+d4b?"<b>vraie</b>":"fausse"]))}
 ]};

/* ===== B. Développer, factoriser, réduire ===== */
const VV = ["x","y","a","z","x","t"];
const dev = shuf([
  [ri(2,9), ri(2,9)], [ri(2,9), -ri(1,9)], [ri(2,9), ri(2,9)], [pick([1.5,2.5,0.5]), ri(2,8)], [ri(2,9), -ri(1,9)], [10, pick([0.5,0.2,0.3,1.5])]
]).map(([k,b],i)=>[k,b,VV[i]]);
const ment = shuf([
  (()=>{ let a, d; do { a=ri(3,9); d=ri(1,5); } while(a===7 && d===2); return [a,100,d]; })(),  /* jamais 7 × 102 (exemple de l'énoncé) */
  (()=>{ const a=ri(3,9), d=ri(1,3); return [a,100,-d]; })(),
  (()=>{ const a=ri(11,19); return [a,20,1]; })(),
  (()=>{ const a=ri(11,15); return [a,100,-1]; })(),
  (()=>{ const a=ri(3,9), d=ri(1,9); return [a,200,d]; })()
]);
const fac = shuf([
  [ri(2,9), ri(2,6)], [ri(2,9), -ri(1,6)], ["L", ri(2,9)], [ri(2,9), -1], [pick([1.5,2.5]), 2], [ri(2,9), ri(2,6)]
]);
const facH = ([k,b],v) => k==="L" ? `${b}${X("a")} + ${b}${X("b")}` : lin(k,r3(k*b),v);
const facC = ([k,b],v) => k==="L" ? `${b}(${X("a")}+${X("b")})` : par(k,b,v);
/* réduire : 8 expressions comme sur la fiche */
const R = [];
{ const a=ri(2,9), b=ri(2,9); R.push([`${mono(a)} + ${mono(b)}`, `(${a}+${b})${X("x")} = ${mono(a+b)}`]); }
{ const a=ri(5,12), b=ri(1,a-2), c=ri(1,9); R.push([`${mono(a)} − ${mono(b)} + ${c}`, `(${a}−${b})${X("x")} + ${c} = ${lin(a-b,c)}`]); }
{ const c=ri(2,9), a=ri(2,6), d=ri(1,6); R.push([`${c} + ${mono(a)} + ${X("x")} + ${d}`, `${mono(a)} + ${X("x")} + ${c} + ${d} = ${lin(a+1,c+d)}`]); }
{ const a=ri(7,12), b=ri(1,a-3); R.push([`${mono(a,"a")} − ${mono(b,"a")} − ${X("a")}`, `(${a}−${b}−1)${X("a")} = ${mono(a-b-1,"a")}`]); }
{ const a=ri(2,6), b=ri(3,9), c=ri(2,6), d=ri(1,b-1); R.push([`${mono(a)} + ${b} + ${mono(c)} − ${d}`, `${mono(a)} + ${mono(c)} + ${b} − ${d} = ${lin(a+c,b-d)}`]); }
{ const k=ri(2,5), b=ri(1,6), c=ri(1,6); R.push([`${par(k,b)} + ${mono(c)}`, `${lin(k,k*b)} + ${mono(c)} = ${lin(k+c,k*b)}`]); }
{ const k=ri(4,7), b=ri(1,6), c=ri(1,k-1); R.push([`${par(k,b)} − ${mono(c)}`, `${lin(k,k*b)} − ${mono(c)} = ${lin(k-c,k*b)}`]); }
{ const c=ri(9,14), k=ri(2,4), b=ri(1,Math.floor((c-1)/k)); R.push([`${c} + ${par(k,-b)}`, `${c} + ${lin(k,-k*b)} = ${lin(k,c-k*b)}`]); }
const secB = {t:"Développer, factoriser, réduire", e:[
  {n:"Exercice 5", t:"Développer", w:"Sur ton cahier", h:`<p>Développe chaque expression.</p>${cols(dev.map(([k,b,v],i)=>`${NM[i]} = ${par(k,b,v)}`))}`,
   c:`<p>${X("k")}(${X("a")}+${X("b")}) = ${X("k")}${X("a")} + ${X("k")}${X("b")} et ${X("k")}(${X("a")}−${X("b")}) = ${X("k")}${X("a")} − ${X("k")}${X("b")}.</p>${grid(dev.map(([k,b,v],i)=>[NM[i], `${par(k,b,v)} = ${F(k)} × ${X(v)} ${sg(b)} ${F(k)} × ${F(Math.abs(b))} = ${lin(k,r3(k*b),v)}`]))}`},
  {n:"Exercice 6", t:"Calcul mental", w:"Sur ton cahier", h:`<p>Calcule mentalement en utilisant la distributivité, comme dans l'exemple : 7 × 102 = 7 × (100+2) = 700 + 14 = 714.</p>${cols(ment.map(([a,h,d],i)=>`${NM[i]} = ${a} × ${h+d}`))}`,
   c:grid(ment.map(([a,h,d],i)=>[NM[i], `${a} × ${h+d} = ${a} × (${h}${sg(d)}${Math.abs(d)}) = ${a} × ${h} ${sg(d)} ${a} × ${Math.abs(d)} = ${F(a*h)} ${sg(d)} ${F(a*Math.abs(d))} = <b>${F(a*(h+d))}</b>`]))},
  {n:"Exercice 7", t:"Factoriser", w:"Sur ton cahier", h:`<p>Factorise chaque expression.</p>${cols(fac.map((f,i)=>`${NM[i]} = ${facH(f,VV[i])}`))}`,
   c:`<p>On cherche le facteur commun, puis on le met devant la parenthèse.</p>${grid(fac.map(([k,b],i)=>[NM[i], `${facH([k,b],VV[i])} = ${k==="L" ? `${b} × ${X("a")} + ${b} × ${X("b")}` : `${F(k)} × ${X(VV[i])} ${sg(b)} ${F(k)} × ${F(Math.abs(b))}`} = ${facC([k,b],VV[i])}`]))}`},
  {n:"Exercice 8", t:"Réduire une expression", w:"Sur ton cahier", h:`<p>Réduis chaque expression (développe d'abord si nécessaire).</p>${cols(R.map(([e],i)=>`${NM[i]} = ${e}`))}`,
   c:`<p>Je regroupe les termes en ${X("x")} entre eux, et les nombres entre eux. Je développe d'abord s'il y a une parenthèse.</p>${grid(R.map(([e,r],i)=>[NM[i], `${e} = ${r}`]))}`}
 ]};

/* ===== C. Démontrer et réfuter ===== */
const b9=ri(2,9), k9=pick([2,3,4,5]), MUL=k=>k===2?"le double":k===3?"le triple":k+" fois";
const n9 = [ri(2,9), ri(10,15), ri(1,5)+0.5];
const run9 = x => { const s1=r3(x+b9), s2=r3(s1*k9), s3=r3(s2-k9*b9); return `${F(x)} + ${b9} = ${F(s1)} ; ${F(s1)} × ${k9} = ${F(s2)} ; ${F(s2)} − ${k9*b9} = <b>${F(s3)}</b>`; };
const c10 = (()=>{ const n=ri(2,20), d=ri(1,9)/10, a=ri(2,12); return shuf([
  [`La somme de deux entiers consécutifs est un multiple de 2.`, `Contre-exemple : ${n} + ${n+1} = ${2*n+1} n'est pas un multiple de 2 (une somme de deux entiers consécutifs est toujours impaire).`],
  [`Un nombre multiplié par lui-même est toujours plus grand que lui.`, `Contre-exemple : ${F(d)} × ${F(d)} = ${F(d*d)}, qui est plus petit que ${F(d)}.`],
  [`Le produit de deux nombres entiers est toujours plus grand que chacun d'eux.`, `Contre-exemple : ${a} × 0 = 0, qui est plus petit que ${a}.`],
  [`Le double d'un nombre est toujours plus grand que ce nombre.`, `Contre-exemple : le double de 0 est 0, qui n'est pas plus grand que 0.`]
]).slice(0,3); })();
const t11 = distinct(3, ()=>ri(1,40), x=>x).sort((a,b)=>a-b);
const secC = {t:"Démontrer et réfuter", e:[
  {n:"Exercice 9", t:"Un programme qui cache un secret", w:"Sur ton cahier", h:`<p>« Choisis un nombre ; ajoute ${b9} ; multiplie par ${k9} ; soustrais ${k9*b9}. »</p><p><b>1)</b> Applique le programme aux nombres ${F(n9[0])}, ${F(n9[1])} et ${F(n9[2])}. Que remarques-tu ?</p><p><b>2)</b> Démontre ta conjecture en appelant ${X("x")} le nombre choisi.</p>`,
   c:`<p><b>1)</b> ${n9.map(x=>`Avec ${F(x)} : ${run9(x)}.`).join("</p><p>")}</p><p>Le résultat est toujours <b>${MUL(k9)}</b>${k9>3?" le":" du"} nombre choisi.</p><p><b>2)</b></p>${NL("A",`${par(k9,b9)} − ${k9*b9} = ${lin(k9,k9*b9)} − ${k9*b9} = ${mono(k9)}`)}<p>C'est ${MUL(k9)}${k9>3?"":" de"} ${X("x")}, quel que soit le nombre choisi.</p>`},
  {n:"Exercice 10", t:"Contre-exemples", w:"Sur ton cahier", h:`<p>Dis si chaque affirmation est vraie ou fausse. Si elle est fausse, donne un contre-exemple.</p>${c10.map(([s],i)=>`<p>${"abc"[i]}) ${s}</p>`).join("")}`,
   c:c10.map(([,r],i)=>`<p>${"abc"[i]}) <b>Faux.</b> ${r}</p>`).join("")+`<p><i>D'autres contre-exemples sont possibles.</i></p>`},
  {n:"Exercice 11", t:"Trois entiers consécutifs", w:"Sur ton cahier", h:`<p><b>1)</b> Teste avec les entiers consécutifs qui commencent par ${t11.join(", puis par ")} : la somme de trois entiers consécutifs est-elle toujours un multiple de 3 ?</p><p><b>2)</b> Démontre-le avec une lettre : si ${X("n")} est le plus petit des trois entiers, écris la somme et factorise-la.</p>`,
   c:`<p><b>1)</b> ${t11.map(n=>`${n} + ${n+1} + ${n+2} = ${3*n+3} = 3 × ${n+1}`).join(" ; ")} : ce sont des multiples de 3.</p><p><b>2)</b> Les trois entiers sont ${X("n")}, ${X("n")} + 1 et ${X("n")} + 2.</p>${NL("S",`${X("n")} + (${X("n")}+1) + (${X("n")}+2) = ${X("n")} + ${X("n")} + ${X("n")} + 1 + 2 = 3${X("n")} + 3 = 3(${X("n")}+1)`)}<p>C'est un multiple de 3.</p>`}
 ]};

/* ===== D. Équations ===== */
const e12 = [
  (()=>{ const s=ri(2,40), b=ri(2,20); return [`${X("x")} + ${b} = ${s+b}`, `${X("x")} = ${s+b} − ${b} = <b>${s}</b>`]; })(),
  (()=>{ const s=ri(2,40), b=ri(5,30); return [`${b} + ${X("x")} = ${s+b}`, `${X("x")} = ${s+b} − ${b} = <b>${s}</b>`]; })(),
  (()=>{ const s=ri(11,89)/10, b=ri(11,49)/10; return [`${X("x")} + ${F(b)} = ${F(s+b)}`, `${X("x")} = ${F(s+b)} − ${F(b)} = <b>${F(s)}</b>`]; })(),
  (()=>{ const s=ri(1,9)/10, b=ri(1,9)/10; return [`${X("x")} + ${F(b)} = ${F(s+b)}`, `${X("x")} = ${F(s+b)} − ${F(b)} = <b>${F(s)}</b>`]; })()
];
const e13 = [
  (()=>{ const a=ri(2,9), s=ri(2,12); return [a, a*s]; })(),
  (()=>{ const a=pick([2,4,5]); let c; do{ c=ri(1,9); }while(c%a===0); return [a,c]; })(),
  (()=>{ const a=pick([2,4]); let c; do{ c=ri(10,50); }while(c%a===0); return [a,c]; })(),
  (()=>{ const s=ri(2,12); return [0.5, s/2]; })(),
  (()=>{ const a=pick([1.5,2.5]), s=ri(2,8)*2; return [a, r3(a*s)]; })()
];
const p14 = {d:ri(5,20), t:0, k:pick([3,4,5]), m:ri(20,90)*5, P:ri(9,30)*2}; p14.t = p14.d + ri(5,40);
const sib = pick([["Ali","sa sœur","sa sœur a","Il"],["Léa","son frère","son frère a","Elle"],["Tom","son cousin","son cousin a","Il"]]);
const T15 = (()=>{ const a=pick([2,4,5]), b=ri(1,9), n=ri(13,30); return {a,b,n,v:a*n+b}; })();
const secD = {t:"Équations", e:[
  {n:"Exercice 12", t:`Équations ${X("x")} + ${X("b")} = ${X("c")}`, w:"Sur ton cahier", h:`<p>Résous chaque équation et vérifie ta solution.</p><p>${items(e12.map(([e])=>e)," ",true)}</p>`,
   c:`<p>${items(e12.map(([e,r])=>`${e} donc ${r}`),"</p><p>",true)}</p>`},
  {n:"Exercice 13", t:`Équations ${X("a")}${X("x")} = ${X("c")}`, w:"Sur ton cahier", h:`<p>Résous chaque équation et vérifie ta solution.</p><p>${items(e13.map(([a,c])=>`${mono(a)} = ${F(c)}`)," ",true)}</p>`,
   c:`<p>${items(e13.map(([a,c])=>`${mono(a)} = ${F(c)} donc ${X("x")} = ${F(c)} ÷ ${F(a)} = <b>${F(c/a)}</b>`),"</p><p>",true)}</p>`},
  {n:"Exercice 14", t:"Mettre en équation", w:"Sur ton cahier", h:`<p>Pour chaque problème, écris une équation, résous-la, puis réponds par une phrase.</p><p>a) ${sib[0]} a ${p14.d} € de plus que ${sib[1]}. ${sib[3]} a ${p14.t} €. Combien a ${sib[1]} ?</p><p>b) ${NB[p14.k][0].toUpperCase()+NB[p14.k].slice(1)} paquets identiques de billes pèsent ${F(p14.k*p14.m)} g en tout. Combien pèse un paquet ?</p><p>c) Le périmètre d'un carré est de ${p14.P} cm. Quelle est la longueur de son côté ?</p>`,
   c:`<p>a) ${X("x")} + ${p14.d} = ${p14.t} donc ${X("x")} = ${p14.t} − ${p14.d} = ${p14.t-p14.d} : ${sib[2]} <b>${p14.t-p14.d} €</b>.</p><p>b) ${p14.k}${X("x")} = ${F(p14.k*p14.m)} donc ${X("x")} = ${F(p14.k*p14.m)} ÷ ${p14.k} = ${F(p14.m)} : un paquet pèse <b>${F(p14.m)} g</b>.</p><p>c) 4${X("x")} = ${p14.P} donc ${X("x")} = ${p14.P} ÷ 4 = ${F(p14.P/4)} : le côté mesure <b>${F(p14.P/4)} cm</b>.</p>`},
  {n:"Exercice 15", t:"Le tableur", w:"En salle informatique", h:`<p><b>1)</b> Dans la cellule A2, écris 1, puis dans A3 la formule <b>=A2+1</b>. Recopie vers le bas.</p><p><b>2)</b> Dans la cellule B2, écris la formule <b>=${T15.a}*A2+${T15.b}</b> et recopie-la vers le bas. Quelle expression en ${X("n")} calcule la colonne B ?</p><p><b>3)</b> Trouve la valeur de ${X("n")} pour laquelle ${lin(T15.a,T15.b,"n")} = ${T15.v}. Dans quelle ligne la lis-tu ?</p>`,
   c:`<p><b>1)</b> La colonne A affiche les nombres entiers 1, 2, 3…</p><p><b>2)</b> Si ${X("n")} est le nombre de la colonne A, la colonne B calcule <b>${lin(T15.a,T15.b,"n")}</b>.</p><p><b>3)</b> ${lin(T15.a,T15.b,"n")} = ${T15.v} donc ${mono(T15.a,"n")} = ${T15.v-T15.b} et ${X("n")} = ${T15.v-T15.b} ÷ ${T15.a} = <b>${T15.n}</b>.</p><p>On le lit à la ligne ${T15.n+1} : A${T15.n+1} contient ${T15.n} et B${T15.n+1} contient ${T15.v}.</p>`}
 ]};

return [secA, secB, secC, secD];
};
