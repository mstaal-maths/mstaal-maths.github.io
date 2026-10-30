/* 3e · chapitre 9 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres.
   Chaque résolution est calculée par le code (outils window.EQ3 du chapitre). */
TRAIN["3e-9"] = function(){
const {ri, pick, shuf} = TR;
const {FX,F,P,X,FR,SOL,quo,mono,lin,linR,calc,steps,concl,prog,cols,carreTri,solveRow,sheet,range,RAPPEL} = window.EQ3;
const $x=X("x"), $n=X("n"), $y=X("y"), L8="abcdefgh";
const nz=(a,b)=>{ let v; do{ v=ri(a,b); }while(v===0); return v; };
const neg=()=>-ri(2,9);
const list=rows=>cols(rows.map((r,i)=>`<b>${L8[i]})</b> ${r[0]}`));
const corrL=rows=>rows.map((r,i)=>`<p><b>${L8[i]})</b></p>${r.div?divCorr(r):solveRow(r)}`).join("");
/* x / k = b */
const divRow=()=>{ const k=ri(2,9), b=nz(-9,9); return Object.assign([`${FX($x,k)} = ${F(b)}`],{div:k,b}); };
const divCorr=r=>calc([r[0],[`${$x} = ${F(r.b)} × ${r.div} = ${F(r.b*r.div)}`,"× "+r.div]])+`<p>La solution de l'équation est <b>${F(r.b*r.div)}</b>.</p>`;

/* ===== Activité 1 et exercice 1 : isoler l'inconnue ===== */
const A1=()=>{ const s=()=>nz(-12,12);
  let a=nz(2,12), v=s(); const r1=[`${lin(1,a)} = ${F(v+a)}`,1,a,0,v+a];
  a=-ri(2,12); v=s(); const r2=[`${lin(1,a)} = ${F(v+a)}`,1,a,0,v+a];
  a=-ri(2,12); v=s(); const r3=[`${linR(a,1)} = ${F(v+a)}`,1,a,0,v+a];
  a=nz(-9,9); v=s(); const r4=[`${F(v+a)} = ${lin(1,a)}`,1,a,0,v+a,{mir:1}];
  let k=neg(); v=nz(-9,9); const r5=[`${F(k)} × ${$x} = ${F(k*v)}`,k,0,0,k*v];
  k=ri(2,9); let b; do{ b=nz(-30,30); }while(b%k===0); const r6=[`${F(b)} = ${k} × ${$x}`,k,0,0,b,{mir:1}];
  k=ri(2,9); do{ b=nz(-20,20); }while(b%k===0); const r7=[`${mono(k)} = ${F(b)}`,k,0,0,b];
  return [r1,r2,r3,r4,r5,r6,r7,divRow()]; };
const ACT1=A1();
const EX1=(()=>{ const R=shuf(A1()).slice(0,7); const k=-ri(2,9), s=nz(-60,60)/10; R.splice(ri(0,6),0,[`${mono(k)} = ${F(k*s)}`,k,0,0,Math.round(k*s*10)/10]); return R; })();

/* ===== Activité 2 : un programme, résultat ou nombre de départ ===== */
const A2=(()=>{ const a=ri(2,9), b=ri(1,9), n1=-ri(2,9), n2=-ri(2,9), s=nz(11,79)/10; return {a,b,n1,n2,s,R:Math.round((a*s+b)*10)/10}; })();

/* ===== Exercice 2 : trouve le nombre choisi au départ ===== */
const E2=(()=>{ const a=ri(3,9), b=ri(2,9), s=ri(11,99)/100, R=Math.round((a*s-b)*100)/100;
  const c=pick([2,4,5,8]), d=ri(1,9); let T; do{ T=ri(-15,15); }while((T-d)%c===0); return {a,b,s,R,c,d,T}; })();

/* ===== Exercice 3 : a x + b = c ===== */
const E3=(()=>{ const sol=a=>ri(-6,9), off=a=>pick([0,0,ri(1,Math.abs(a)-1)]);
  const R=[]; let a,b,c,s;
  a=ri(2,9); b=ri(1,9); s=sol(); c=a*s+b+off(a); R.push([`${$n} × ${a} + ${b} = ${F(c)}`,a,b,0,c,{v:"n"}]);
  a=neg(); b=ri(1,9); s=sol(); c=a*s+b+off(a); R.push([`${lin(a,b)} = ${F(c)}`,a,b,0,c]);
  a=ri(2,9); b=-ri(2,15); s=sol(); c=a*s+b+off(a); R.push([`${lin(a,b,"n")} = ${F(c)}`,a,b,0,c,{v:"n"}]);
  a=ri(2,9); b=ri(2,15); s=sol(); c=a*s+b+off(a); R.push([`${linR(b,a)} = ${F(c)}`,a,b,0,c]);
  a=ri(2,9); b=-ri(2,9); s=sol(); c=a*s+b+off(a); R.push([`${linR(b,a,"y")} = ${F(c)}`,a,b,0,c,{v:"y"}]);
  a=ri(2,9); b=ri(1,12); s=sol(); c=a*s+b+off(a); R.push([`${F(c)} = ${lin(a,b)}`,a,b,0,c,{mir:1}]);
  a=neg(); b=-ri(2,9); s=sol(); c=a*s+b+off(a); R.push([`${lin(a,b)} = ${F(c)}`,a,b,0,c]);
  a=neg(); b=ri(2,12); s=sol(); c=a*s+b+off(a); R.push([`${linR(b,a)} = ${F(c)}`,a,b,0,c]);
  return R; })();

/* ===== Exercice 4 : développer avant de résoudre ===== */
const E4=(()=>{ const k=neg(), a=ri(2,5), b=-ri(1,7), c=nz(-20,20);
  const p=ri(5,12), q=ri(1,p-1), d=ri(1,9), e=nz(-9,12); return {k,a,b,c,p,q,d,e}; })();

/* ===== Activité 3 : deux programmes, même résultat ===== */
const A3=(()=>{ let a,b,c,d; do{ a=ri(4,9); c=ri(2,a-1); b=ri(1,9); d=ri(b+1,25); }while((d-b)%(a-c)===0 || (d-b)/(a-c)>6 || (d-b)/(a-c)<1); return {a,b,c,d,s:(d-b)/(a-c)}; })();
const xs3=range(0,7);

/* ===== Exercice 5 : a x + b = c x + d ===== */
const E5=(()=>{ const R=[]; for(let i=0;i<3;i++){ let a,b,c,d; do{ a=nz(-9,9); c=nz(-9,9); b=nz(-12,12); d=nz(-12,12); }while(a===c); R.push([`${lin(a,b)} = ${lin(c,d)}`,a,b,c,d]); }
  let k=ri(2,6), a, c, b, d; do{ a=nz(-8,8); c=nz(-8,8); b=nz(-9,12); d=nz(-9,12); }while(a===c); return {R, k,a,b,c,d}; })();
const sq=(k,a,b)=>`${k}${$x}² ${a<0?"−":"+"} ${mono(Math.abs(a))} ${b<0?"−":"+"} ${Math.abs(b)}`;

/* ===== Exercice 6 : le prix d'un lot ===== */
const E6=(()=>{ let n1,n2,d1,d2,p; do{ n1=ri(8,15); n2=n1+ri(2,6); p=ri(3,9); d2=ri(1,10); d1=d2+(n2-n1)*p; }while(d1>50); return {n1,n2,d1,d2,p}; })();

/* ===== Exercice 7 : deux programmes (x² − a x et x² − b) ===== */
const E7=(()=>{ const a=ri(2,9), b=ri(1,15), n=ri(a+1,a+6), m=-ri(2,6); return {a,b,n,m}; })();

/* ===== Exercice 8 : Mathilde et Paul, puis un programme ===== */
const E8=(()=>{ let a,b,c,d; do{ a=ri(5,9); b=ri(2,9); c=ri(2,4); d=ri(20,40); }while((d+b)%(a+c)===0 || (d+b)/(a+c)>8 || (d+b)/(a+c)<1);
  const p=ri(2,6), q=ri(2,5), r=ri(1,9), n=ri(3,9); let T; do{ T=ri(2,30); }while((T-(q*p-r))===0); return {a,b,c,d,s:(d+b)/(a+c),p,q,r,n,T}; })();
const xs8=range(0,10);

/* ===== Exercice 9 : équation ou égalité toujours vraie ===== */
const E9=(()=>{ let k,a,b,c,d; do{ k=ri(2,6); a=ri(2,5); b=ri(1,6); c=ri(1,9); d=ri(1,12); }while(k*a===c);
  const divs=[2,3,4,5,6].filter(t=>(k*b)%t===0 && t<k*a), k2=pick(divs), g=k*b/k2;   /* k divise toujours k·b et k < k·a */
  const f=ri(1,Math.floor((k*a-1)/k2)), e=k*a-k2*f;
  return {k,a,b,c,d,k2,g,f,e}; })();

/* ===== Exercice 10 : même périmètre ===== */
const E10=(()=>{ let a,s; do{ a=ri(1,6); s=ri(1,9); }while((4*a+s)%3); return {a,b:(4*a+s)/3,s}; })();

return [
 {t:"Trouver la valeur de l'inconnue", e:[
  {n:"Activité 1", t:"Trouver la valeur de x", w:"Sur ton cahier", h:`<p>Dans chaque cas, trouve la valeur de ${$x} en expliquant tes étapes de calcul.</p>${cols(ACT1.map((r,i)=>`<b>Cas n°${i+1} :</b> ${r[0]}`))}`,
   c:ACT1.map((r,i)=>`<p><b>Cas n°${i+1}</b></p>${r.div?divCorr(r):solveRow(r)}`).join("")},
  {n:"Exercice 1", t:"Résoudre des équations", w:"Sur ton cahier", h:`<p>Résous les équations suivantes.</p>${list(EX1)}`, c:corrL(EX1)}
 ]},
 {t:"Programmes de calcul et équations a<i>x</i> + b = c", e:[
  {n:"Activité 2", t:"Avec un programme, trouver le résultat ou le nombre de départ", w:"Sur ton cahier", h:`<p>On donne le programme de calcul suivant :</p>${prog("",["Choisir un nombre",`Multiplier par ${A2.a}`,`Ajouter ${A2.b}`])}
   <p><b>1 –</b> Louise choisit le nombre ${F(A2.n1)} et applique le programme. Montre qu'elle obtiendra ${F(A2.a*A2.n1+A2.b)}.</p><p><b>2 –</b> Paul choisit le nombre ${F(A2.n2)} et applique le programme. Quel résultat va-t-il obtenir ?</p><p><b>3 –</b> Timéo a choisi un nombre, a appliqué le programme et a trouvé ${F(A2.R)}. Quel était son nombre de départ ?</p>`,
   c:`<p><b>1 –</b> ${F(A2.n1)} × ${A2.a} = ${F(A2.a*A2.n1)} puis ${F(A2.a*A2.n1)} + ${A2.b} = ${F(A2.a*A2.n1+A2.b)}.</p><p><b>2 –</b> ${F(A2.n2)} × ${A2.a} = ${F(A2.a*A2.n2)} puis ${F(A2.a*A2.n2)} + ${A2.b} = <b>${F(A2.a*A2.n2+A2.b)}</b>.</p>
   <p><b>3 –</b> On note ${$x} le nombre de départ : ${lin(A2.a,A2.b)} = ${F(A2.R)}.</p>${calc(steps(A2.a,A2.b,0,A2.R))}<p>Le nombre de départ était <b>${F(A2.s)}</b>.</p>`},
  {n:"Exercice 2", t:"Trouve le nombre choisi au départ", w:"Sur ton cahier", h:`<p>Résous ces deux problèmes à l'aide d'équations.</p>
   <p><b>Problème 1 :</b></p>${prog("",["Choisir un nombre",`Multiplier par ${E2.a}`,`Soustraire ${E2.b}`])}<p>Léa a choisi un nombre, a appliqué le programme et a trouvé ${F(E2.R)}. Quel était son nombre de départ ?</p>
   <p><b>Problème 2 :</b></p>${prog("",["Choisir un nombre",`Multiplier par −${E2.c}`,`Ajouter ${E2.d}`])}<p>Quel nombre doit-on choisir pour obtenir ${F(E2.T)} avec ce programme ?</p>`,
   c:`<p><b>Problème 1 :</b> ${lin(E2.a,-E2.b)} = ${F(E2.R)}</p>${calc(steps(E2.a,-E2.b,0,E2.R))}<p>Le nombre de départ de Léa était <b>${F(E2.s)}</b>.</p>
   <p><b>Problème 2 :</b> ${lin(-E2.c,E2.d)} = ${F(E2.T)}</p>${calc(steps(-E2.c,E2.d,0,E2.T))}<p>Il faut choisir <b>${F((E2.T-E2.d)/(-E2.c))}</b>.</p>`},
  {n:"Exercice 3", t:"Entraînement : équations de la forme a<i>x</i> + b = c", w:"Sur ton cahier", h:`<p>Résous les équations suivantes.</p>${list(E3)}`, c:corrL(E3)},
  {n:"Exercice 4", t:"Penser à développer et à réduire chaque membre", w:"Sur ton cahier", h:`<p>Résous les équations suivantes, en développant et en réduisant d'abord chaque membre.</p>${cols([`<b>a)</b> ${F(E4.k)}(${lin(E4.a,E4.b)}) = ${F(E4.c)}`,`<b>b)</b> ${mono(E4.p)} − (${lin(E4.q,E4.d)}) = ${F(E4.e)}`])}`,
   c:`<p><b>a)</b></p>${calc([`${F(E4.k)}(${lin(E4.a,E4.b)}) = ${F(E4.c)}`,`${lin(E4.k*E4.a,E4.k*E4.b)} = ${F(E4.c)}`,...steps(E4.k*E4.a,E4.k*E4.b,0,E4.c).slice(1)])}${concl(E4.c-E4.k*E4.b,E4.k*E4.a)}
   <p><b>b)</b> Attention au signe « − » devant la parenthèse.</p>${calc([`${mono(E4.p)} − (${lin(E4.q,E4.d)}) = ${F(E4.e)}`,`${mono(E4.p)} − ${mono(E4.q)} − ${E4.d} = ${F(E4.e)}`,`${lin(E4.p-E4.q,-E4.d)} = ${F(E4.e)}`,...steps(E4.p-E4.q,-E4.d,0,E4.e).slice(1)])}${concl(E4.e+E4.d,E4.p-E4.q)}`}
 ]},
 {t:"Équations de la forme a<i>x</i> + b = c<i>x</i> + d", e:[
  {n:"Activité 3", t:"Même résultat avec deux programmes", w:"Sur ton cahier", h:`${prog("Programme A",["Choisir un nombre",`Multiplier par ${A3.a}`,`Ajouter ${A3.b}`])}${prog("Programme B",["Choisir un nombre",`Multiplier par ${A3.c}`,`Ajouter ${A3.d}`])}
   <p><b>1 – a)</b> Louise choisit le nombre −3 et applique le programme A. Montre qu'elle obtiendra ${F(-3*A3.a+A3.b)}.</p><p><b>b)</b> Elle reprend le nombre −3 et applique le programme B. Quel résultat va-t-elle obtenir ?</p>
   <p><b>2 –</b> Quelles formules faut-il saisir dans les cellules B2 et B3 (puis étirer) pour obtenir les résultats des programmes ?</p>${RAPPEL}
   <p>On obtient :</p>${sheet(xs3,[["Résultat du programme A",v=>A3.a*v+A3.b],["Résultat du programme B",v=>A3.c*v+A3.d]])}
   <p><b>3 –</b> Au vu du tableau, entre quels nombres entiers se trouve le nombre qui donne le même résultat ?</p><p><b>4 –</b> Trouve ce nombre par le calcul et vérifie la conjecture.</p>`,
   c:`<p><b>1 – a)</b> −3 × ${A3.a} = ${F(-3*A3.a)} puis ${F(-3*A3.a)} + ${A3.b} = ${F(-3*A3.a+A3.b)}.</p><p><b>b)</b> −3 × ${A3.c} = ${F(-3*A3.c)} puis ${F(-3*A3.c)} + ${A3.d} = <b>${F(-3*A3.c+A3.d)}</b>.</p>
   <p><b>2 –</b> B2 : <b>=B1*${A3.a}+${A3.b}</b> · B3 : <b>=B1*${A3.c}+${A3.d}</b></p>
   <p><b>3 –</b> Pour ${Math.floor(A3.s)} : A donne ${A3.a*Math.floor(A3.s)+A3.b} et B donne ${A3.c*Math.floor(A3.s)+A3.d} (A &lt; B). Pour ${Math.floor(A3.s)+1} : A donne ${A3.a*(Math.floor(A3.s)+1)+A3.b} et B donne ${A3.c*(Math.floor(A3.s)+1)+A3.d} (A &gt; B). Le nombre est compris entre ${Math.floor(A3.s)} et ${Math.floor(A3.s)+1}.</p>
   <p><b>4 –</b></p>${calc(steps(A3.a,A3.b,A3.c,A3.d))}<p>Le nombre cherché est <b>${SOL(A3.d-A3.b,A3.a-A3.c)}</b>${FR(A3.d-A3.b,A3.a-A3.c).includes("{")&&!/=/.test(SOL(A3.d-A3.b,A3.a-A3.c))?` ≈ ${F(Math.round(A3.s*100)/100)}`:""} : il est bien compris entre ${Math.floor(A3.s)} et ${Math.floor(A3.s)+1}.</p>`},
  {n:"Exercice 5", t:"Résoudre des équations de la forme a<i>x</i> + b = c<i>x</i> + d", w:"Sur ton cahier", h:`<p>Résous les équations suivantes.</p>${cols([...E5.R.map((r,i)=>`<b>${L8[i]})</b> ${r[0]}`),`<b>d)</b> ${sq(E5.k,E5.a,E5.b)} = ${sq(E5.k,E5.c,E5.d)}`])}`,
   c:`${corrL(E5.R)}<p><b>d)</b> On enlève ${E5.k}${$x}² dans les deux membres.</p>${calc([`${sq(E5.k,E5.a,E5.b)} = ${sq(E5.k,E5.c,E5.d)}`,[`${lin(E5.a,E5.b)} = ${lin(E5.c,E5.d)}`,"− "+E5.k+$x+"²"],...steps(E5.a,E5.b,E5.c,E5.d).slice(1)])}${concl(E5.d-E5.b,E5.a-E5.c)}`}
 ]},
 {t:"Résoudre des problèmes", e:[
  {n:"Exercice 6", t:"Le prix d'un lot de stylos", w:"Sur ton cahier", h:`<p>Lors d'une vente caritative, Damian a vendu ${E6.n1} lots de stylos et reçu ${E6.d1} € de dons.</p><p>Ruben a vendu ${E6.n2} lots et reçu ${E6.d2} € de dons.</p><p>Ils ont récolté la même somme.</p><p>Détermine le prix, en euros, d'un lot de stylos.</p>`,
   c:`<p>On note ${$x} le prix d'un lot : ${lin(E6.n1,E6.d1)} = ${lin(E6.n2,E6.d2)}.</p>${calc(steps(E6.n1,E6.d1,E6.n2,E6.d2))}<p>Un lot coûte <b>${E6.p} €</b>.</p><p><i>Vérification : ${E6.n1} × ${E6.p} + ${E6.d1} = ${E6.n1*E6.p+E6.d1} et ${E6.n2} × ${E6.p} + ${E6.d2} = ${E6.n2*E6.p+E6.d2}.</i></p>`},
  {n:"Exercice 7", t:"Deux programmes de calcul (brevet)", w:"Sur ton cahier", h:`${prog("Programme A",["Choisir un nombre",`Soustraire ${E7.a} à ce nombre`,"Multiplier le résultat par le nombre de départ"])}${prog("Programme B",["Choisir un nombre","Mettre ce nombre au carré",`Soustraire ${E7.b} au résultat`])}
   <p><b>1.</b> Alice choisit le nombre ${E7.n} et applique le programme A. Quel résultat obtient-elle ?</p><p><b>2.</b> Lucie choisit le nombre ${F(E7.m)} et applique le programme B. Quel résultat obtient-elle ?</p>
   <p><b>3.</b> Montre que le résultat du programme A peut s'écrire ${$x}² − ${mono(E7.a)}.</p><p><b>4.</b> Exprime en fonction de ${$x} le résultat du programme B.</p><p><b>5.</b> Quel nombre donne le même résultat avec les deux programmes ?</p>`,
   c:`<p><b>1.</b> ${E7.n} − ${E7.a} = ${E7.n-E7.a} puis ${E7.n-E7.a} × ${E7.n} = <b>${(E7.n-E7.a)*E7.n}</b>.</p><p><b>2.</b> (${F(E7.m)})² = ${E7.m*E7.m} puis ${E7.m*E7.m} − ${E7.b} = <b>${F(E7.m*E7.m-E7.b)}</b>.</p>
   <p><b>3.</b> On note A le résultat du programme A :</p><p class="calc">A = (${$x} − ${E7.a}) × ${$x}<br>A = ${$x} × ${$x} − ${E7.a} × ${$x}<br>A = ${$x}² − ${mono(E7.a)}</p><p><b>4.</b> ${$x}² − ${E7.b}.</p>
   <p><b>5.</b></p>${calc([`${$x}² − ${mono(E7.a)} = ${$x}² − ${E7.b}`,[`${mono(-E7.a)} = ${F(-E7.b)}`,"− "+$x+"²"],[`${$x} = ${quo(-E7.b,-E7.a)}`,"÷ "+P(-E7.a)]])}<p>Le nombre cherché est <b>${SOL(E7.b,E7.a)}</b>.</p>`},
  {n:"Exercice 8", t:"Tableur et programme (brevet)", w:"Sur ton cahier", h:`<p><b>Partie 1.</b> Mathilde et Paul saisissent un même nombre.</p>${prog("Programme de Mathilde",["Saisir un nombre",`Multiplier ce nombre par ${E8.a}`,`Soustraire ${E8.b} au résultat obtenu`])}${prog("Programme de Paul",["Saisir un nombre",`Multiplier ce nombre par −${E8.c}`,`Ajouter ${E8.d} au résultat obtenu`])}
   <p><b>1.</b> Quelles formules faut-il saisir dans les cellules B2 et B3, puis étirer, pour obtenir les résultats de Mathilde et de Paul ?</p>
   <p><b>2.</b> Voici la feuille de calcul obtenue :</p>${sheet(xs8,[["Mathilde",v=>E8.a*v-E8.b],["Paul",v=>-E8.c*v+E8.d]])}<p>Au vu du tableau, entre quels nombres entiers se trouve le nombre qui donne le même résultat ?</p>
   <p><b>3.</b> Détermine ce nombre par le calcul.</p>
   <p><b>Partie 2.</b> Voici un programme de calcul :</p>${prog("",["Choisir un nombre",`Ajouter ${E8.p}`,`Multiplier par ${E8.q}`,`Soustraire ${E8.r}`])}
   <p><b>a.</b> Si on choisit ${E8.n}, quel est le résultat ?</p><p><b>b.</b> Montre que, si on choisit ${$x}, le résultat est ${lin(E8.q,E8.q*E8.p-E8.r)}.</p><p><b>c.</b> Quel nombre faut-il choisir pour obtenir ${E8.T} ?</p>`,
   c:`<p><b>Partie 1. 1.</b> B2 : <b>=${E8.a}*B1-${E8.b}</b> · B3 : <b>=-${E8.c}*B1+${E8.d}</b></p>
   <p><b>2.</b> Pour ${Math.floor(E8.s)} : ${E8.a*Math.floor(E8.s)-E8.b} et ${-E8.c*Math.floor(E8.s)+E8.d} ; pour ${Math.floor(E8.s)+1} : ${E8.a*(Math.floor(E8.s)+1)-E8.b} et ${-E8.c*(Math.floor(E8.s)+1)+E8.d}. Le nombre est compris entre ${Math.floor(E8.s)} et ${Math.floor(E8.s)+1}.</p>
   <p><b>3.</b></p>${calc(steps(E8.a,-E8.b,-E8.c,E8.d))}<p>Le nombre cherché est <b>${SOL(E8.d+E8.b,E8.a+E8.c)}</b>.</p>
   <p><b>Partie 2. a.</b> ${E8.n} + ${E8.p} = ${E8.n+E8.p} ; ${E8.n+E8.p} × ${E8.q} = ${(E8.n+E8.p)*E8.q} ; ${(E8.n+E8.p)*E8.q} − ${E8.r} = <b>${(E8.n+E8.p)*E8.q-E8.r}</b>.</p>
   <p><b>b.</b> On note R le résultat :</p><p class="calc">R = (${$x} + ${E8.p}) × ${E8.q} − ${E8.r}<br>R = ${mono(E8.q)} + ${E8.q*E8.p} − ${E8.r}<br>R = ${lin(E8.q,E8.q*E8.p-E8.r)}</p><p><b>c.</b></p>${calc(steps(E8.q,E8.q*E8.p-E8.r,0,E8.T))}${concl(E8.T-(E8.q*E8.p-E8.r),E8.q)}`},
  {n:"Exercice 9", t:"Différence entre les deux énoncés", w:"Sur ton cahier", h:`<div class="attention"><b>ATTENTION :</b> ces deux questions sont souvent confondues !</div>
   <p><b>1 –</b> Trouve la valeur de ${$x} pour laquelle ${E9.k}(${lin(E9.a,-E9.b)}) = ${lin(E9.c,E9.d)}.</p><p><b>2 –</b> Montre que, pour toutes les valeurs de ${$x}, on a ${E9.k}(${lin(E9.a,-E9.b)}) = ${mono(E9.e)} + ${E9.k2}(${lin(E9.f,-E9.g)}).</p>`,
   c:`<p><b>1 –</b> C'est une équation.</p>${calc([`${E9.k}(${lin(E9.a,-E9.b)}) = ${lin(E9.c,E9.d)}`,`${lin(E9.k*E9.a,-E9.k*E9.b)} = ${lin(E9.c,E9.d)}`,...steps(E9.k*E9.a,-E9.k*E9.b,E9.c,E9.d).slice(1)])}${concl(E9.d+E9.k*E9.b,E9.k*E9.a-E9.c)}
   <p><b>2 –</b> On développe et on réduit chaque membre.</p><p class="calc">A = ${E9.k}(${lin(E9.a,-E9.b)})<br>A = ${lin(E9.k*E9.a,-E9.k*E9.b)}</p><p class="calc">B = ${mono(E9.e)} + ${E9.k2}(${lin(E9.f,-E9.g)})<br>B = ${mono(E9.e)} + ${lin(E9.k2*E9.f,-E9.k2*E9.g)}<br>B = ${lin(E9.e+E9.k2*E9.f,-E9.k2*E9.g)}</p><p>A et B sont égaux : l'égalité est vraie pour toutes les valeurs de ${$x}.</p>`},
  {n:"Exercice 10", t:"Même périmètre", w:"Sur ton cahier", h:`<p>${$x} est une longueur. Le triangle est équilatéral.</p>${carreTri(E10.a,E10.b)}<p>Quelle doit être la valeur de ${$x} pour que le triangle et le carré aient le même périmètre ?</p>`,
   c:`<p>Carré : 4 × (${$x} + ${E10.a}) = ${lin(4,4*E10.a)}. Triangle : 3 × (${$x} + ${E10.b}) = ${lin(3,3*E10.b)}.</p>${calc(steps(4,4*E10.a,3,3*E10.b))}<p>Pour ${$x} = <b>${E10.s}</b>, les deux périmètres sont égaux (${4*(E10.s+E10.a)}).</p>`}
 ]}
];
};
