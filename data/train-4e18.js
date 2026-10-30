/* 4e · chapitre 18 — fiche d'entraînement : les exercices de M. Staal (expérience aléatoire, probabilités, arbres,
   évènements impossible, certain, contraire) avec d'autres données. Corrections calculées (outils window.PR18). */
TRAIN["4e-18"] = function(){
const {ri, pick, shuf} = TR;
const {F,P,bar,tree1,tree2,sac,gcd,sum} = window.PR18;
const pl=(n,s,p)=>n>1?p:s;
/* probabilité en chaîne : « p(…) = {a/b} » puis la fraction simplifiée sur la ligne suivante */
const PC=(nm,a,b)=>P(a,b).split(" = ").map(x=>`${nm} = ${x}`).join("<br>");

/* ===== A ===== */
const U1=(()=>{ const [c1,c2]=pick([["rouge","noire"],["verte","jaune"],["bleue","rouge"]]); return {c1,c2,a:ri(1,6),b:ri(1,6)}; })();
const DE=pick([1,2,3,4,5,6]);
const TS=(()=>{ let c; do{ c=[ri(1,9),ri(1,9),ri(1,9),ri(1,9)]; }while(new Set(c).size<4); return {c,t:sum(c)}; })();
const COLT=["orange","rose","bleu","jaune"], COLP=["orange","roses","bleus","jaunes"];
const iMax=TS.c.indexOf(Math.max(...TS.c)), iMin=TS.c.indexOf(Math.min(...TS.c));

/* ===== B ===== */
const SAC=(()=>{ const no=ri(3,6), nb=ri(2,4); const balls=[...Array.from({length:no},(_,i)=>["orange",i+1]), ...Array.from({length:nb},(_,i)=>["bleue",i+1])]; return {no,nb,balls,t:no+nb}; })();
const cntB=f=>SAC.balls.filter(f).length;
const k2=ri(1,Math.min(SAC.no,SAC.nb)), kb=SAC.nb+ri(1,2); /* « numéro k2 » ; « bleue avec un kb » (impossible) */
const CARTES=[["une dame",4],["un as",4],["un « 8 »",4],["un « 10 »",4],["un cœur",8],["un carreau",8],["un pique",8],["une carte rouge",16],["une carte noire",16],["le roi de cœur",1],["le 7 de pique",1],["un roi rouge",2],["une figure (valet, dame ou roi)",12]];
const C5=shuf(CARTES).slice(0,5);
const URN=(()=>{ const N=pick([20,24,30,36,40]), x=ri(1,N), [k,m]=shuf([3,4,5,6,7]).slice(0,2); return {N,x,k,m}; })();
const mult=(N,k)=>Array.from({length:Math.floor(N/k)},(_,i)=>(i+1)*k);

/* ===== C ===== */
const GEN=["variété française","électro","rap","punk","pop internationale","jazz"];
const ART=["de la ","de l'","du ","du ","de la ","du "];
const KZ=(()=>{ const c=GEN.map(()=>ri(8,50)); const j=ri(0,5); return {c,t:sum(c),j}; })();
const C8=shuf(CARTES.filter(x=>x[1]<16)).slice(0,2);
const MENU=(()=>{ const E=shuf([["Saumon",1],["Velouté",0],["Salade",0],["Crevettes",1]]).slice(0,ri(2,3)), Pl=shuf([["Turbot",1],["Veau",0],["Agneau",0],["Cabillaud",1],["Poulet",0]]).slice(0,ri(2,3));
  if(!E.some(x=>x[1])) E[0]=["Saumon",1]; if(!Pl.some(x=>x[1])) Pl[0]=["Turbot",1]; if(!E.some(x=>!x[1])) E[E.length-1]=["Velouté",0]; if(!Pl.some(x=>!x[1])) Pl[Pl.length-1]=["Veau",0];
  const all=E.flatMap(e=>Pl.map(p=>[e,p])); return {E,Pl,all,n:all.length}; })();
const mn=([e,p])=>`${e[0]} – ${p[0]}`;
const both=MENU.all.filter(([e,p])=>e[1]&&p[1]), none=MENU.all.filter(([e,p])=>!e[1]&&!p[1]), one=MENU.all.filter(([e,p])=>e[1]||p[1]);

/* ===== D ===== */
const LAN=Array.from({length:pick([6,8,10])},()=>ri(1,6));
const fq=k=>LAN.filter(x=>x===k).length;
const abs=[1,2,3,4,5,6].filter(k=>fq(k)===0);

return [
 {t:"Expérience aléatoire, issues et arbres", e:[
  {n:"Exercice 1", t:"Une urne", w:"Sur ton cahier", h:`${sac([...Array(U1.a).fill([U1.c1]),...Array(U1.b).fill([U1.c2])])}<p>Une urne contient ${U1.a} ${pl(U1.a,"boule "+U1.c1,"boules "+U1.c1+"s")} et ${U1.b} ${pl(U1.b,"boule "+U1.c2,"boules "+U1.c2+"s")}. On tire une boule au hasard et on regarde sa couleur.</p><p><b>1)</b> Est-ce une expérience aléatoire ? Justifie.</p><p><b>2)</b> Quelles sont les issues possibles ?</p><p><b>3)</b> Calcule la probabilité de chaque issue.</p><p><b>4)</b> Construis l'arbre des possibles.</p>`,
   c:`<p><b>1)</b> Oui : on connaît les issues, le résultat n'est pas prévisible et on peut recommencer.</p><p><b>2)</b> « Tirer une boule ${U1.c1} » et « Tirer une boule ${U1.c2} ».</p><p><b>3)</b> ${U1.a} + ${U1.b} = ${U1.a+U1.b} boules.</p><p class="calc">${PC("p("+U1.c1+")",U1.a,U1.a+U1.b)}</p><p class="calc">${PC("p("+U1.c2+")",U1.b,U1.a+U1.b)}</p>
   <p><b>4)</b></p>${tree1([[F(U1.a,U1.a+U1.b),"Tirer une boule "+U1.c1],[F(U1.b,U1.a+U1.b),"Tirer une boule "+U1.c2]])}<p>Vérification, avec la somme S des probabilités :</p><p class="calc">S = ${F(U1.a,U1.a+U1.b)} + ${F(U1.b,U1.a+U1.b)}<br>S = ${F(U1.a+U1.b,U1.a+U1.b)}<br>S = 1</p>`},
  {n:"Exercice 2", t:"Un dé truqué", w:"Sur ton cahier", h:`<p>Le dé de Léo est truqué : il tombe toujours sur le ${DE}. Léo lance ce dé et regarde sur quelle face il tombe.</p><p><b>1)</b> Est-ce une expérience aléatoire ?</p><p><b>2)</b> Quelles sont les issues possibles ?</p>`,
   c:`<p><b>1)</b> Non : le résultat est prévisible, le dé tombe toujours sur le ${DE}.</p><p><b>2)</b> Les 6 issues sont quand même : tomber sur 1, 2, 3, 4, 5 ou 6.</p>`},
  {n:"Exercice 3", t:"Les tee-shirts", w:"Sur ton cahier", h:`<p>Hugo a ${TS.c[0]} tee-shirt${TS.c[0]>1?"s":""} orange, ${TS.c[1]} rose${TS.c[1]>1?"s":""}, ${TS.c[2]} bleu${TS.c[2]>1?"s":""} et ${TS.c[3]} jaune${TS.c[3]>1?"s":""}. Il en prend un au hasard.</p><p><b>1)</b> Quelles sont les issues possibles ?</p><p><b>2)</b> Quelle couleur a le plus de chances de sortir ? le moins de chances ?</p><p><b>3)</b> Calcule la probabilité de chaque issue.</p><p><b>4)</b> Construis l'arbre des possibles.</p>`,
   c:`<p><b>1)</b> Prendre un tee-shirt orange, rose, bleu ou jaune.</p><p><b>2)</b> Le plus de chances : ${COLT[iMax]} (${TS.c[iMax]} tee-shirts). Le moins : ${COLT[iMin]} (${TS.c[iMin]} tee-shirt${TS.c[iMin]>1?"s":""}).</p><p><b>3)</b> ${TS.c.join(" + ")} = ${TS.t}. ${TS.c.map((n,i)=>`p(${COLT[i]}) = ${F(n,TS.t)}`).join(" ; ")}.</p>
   <p><b>4)</b></p>${tree1(TS.c.map((n,i)=>[F(n,TS.t),"Tee-shirt "+COLT[i]]))}<p>Vérification : ${TS.c.map(n=>F(n,TS.t)).join(" + ")} = 1.</p>`}
 ]},
 {t:"Évènements : probabilité, évènement impossible, évènement certain", e:[
  {n:"Exercice 4", t:"Le sac de boules", w:"Sur ton cahier", h:`<p>Un sac contient ${SAC.no} boules orange numérotées de 1 à ${SAC.no} et ${SAC.nb} boules bleues numérotées de 1 à ${SAC.nb}.</p>${sac(SAC.balls)}<p>On tire une boule au hasard. Calcule la probabilité de tirer :</p><p><b>1)</b> une boule orange ;</p><p><b>2)</b> une boule numérotée « ${k2} » ;</p><p><b>3)</b> une boule avec un numéro impair ;</p><p><b>4)</b> une boule orange avec un numéro pair ;</p><p><b>5)</b> une boule bleue avec un ${kb}.</p><p><b>6)</b> Donne un évènement impossible et un évènement certain.</p>`,
   c:`<p>Il y a ${SAC.t} boules.</p><p><b>1)</b> ${SAC.no} boules orange sur ${SAC.t} : ${P(SAC.no,SAC.t)}</p><p><b>2)</b> ${cntB(b=>b[1]===k2)} boules portent le ${k2} : ${P(cntB(b=>b[1]===k2),SAC.t)}</p><p><b>3)</b> ${cntB(b=>b[1]%2===1)} boules ont un numéro impair : ${P(cntB(b=>b[1]%2===1),SAC.t)}</p><p><b>4)</b> ${cntB(b=>b[0]==="orange"&&b[1]%2===0)} ${cntB(b=>b[0]==="orange"&&b[1]%2===0)>1?"boules orange ont":"boule orange a"} un numéro pair : ${P(cntB(b=>b[0]==="orange"&&b[1]%2===0),SAC.t)}</p><p><b>5)</b> Aucune boule bleue ne porte le ${kb} : la probabilité est 0 (évènement impossible).</p><p><b>6)</b> Par exemple : « obtenir une boule verte » est impossible ; « obtenir une boule orange ou bleue » est certain.</p>`},
  {n:"Exercice 5", t:"Un jeu de 32 cartes", w:"Sur ton cahier", h:`<p>On tire une carte au hasard dans un jeu de 32 cartes (du 7 à l'as, dans les 4 couleurs).</p><p>Calcule la probabilité de tirer :</p>${C5.map(([e],i)=>`<p>${"abcde"[i]}) ${e}${i===4?".":" ;"}</p>`).join("")}`,
   c:C5.map(([e,n],i)=>`<p>${"abcde"[i]}) Il y a ${n} carte${n>1?"s":""} qui ${n>1?"conviennent":"convient"} sur 32 : ${P(n,32)}.</p>`).join("")},
  {n:"Exercice 6", t:"Une urne numérotée", w:"Sur ton cahier", h:`<p>Une urne contient ${URN.N} boules numérotées de 1 à ${URN.N}. On tire une boule au hasard.</p><p><b>1)</b> Combien y a-t-il d'issues ?</p><p><b>2)</b> Calcule la probabilité de tirer : a) la boule n° ${URN.x} ; b) un numéro pair ; c) un multiple de ${URN.k} ; d) un multiple de ${URN.m}.</p>`,
   c:`<p><b>1)</b> ${URN.N} issues.</p><p><b>2)</b> a) ${P(1,URN.N)} · b) ${URN.N/2} numéros pairs : ${P(URN.N/2,URN.N)} · c) ${mult(URN.N,URN.k).join(", ")} : ${P(mult(URN.N,URN.k).length,URN.N)} · d) ${mult(URN.N,URN.m).join(", ")} : ${P(mult(URN.N,URN.m).length,URN.N)}</p>`}
 ]},
 {t:"Évènements contraires", e:[
  {n:"Exercice 7", t:"La playlist", w:"Sur ton cahier", h:`<p>Kenza a sur son téléphone :</p>${GEN.map((g,i)=>`<p>– ${KZ.c[i]} titres ${/^[aeiouéè]/.test(g)?"d'":"de "}${g}${i===GEN.length-1?".":" ;"}</p>`).join("")}<p>Le téléphone choisit un titre au hasard parmi les ${KZ.t} titres.</p><p>a) Quelle est la probabilité que le titre soit ${ART[KZ.j]}${GEN[KZ.j]} ?</p><p>b) Quelle est la probabilité que le titre ne soit pas ${ART[KZ.j]}${GEN[KZ.j]} ?</p>`,
   c:`<p>a) ${KZ.c[KZ.j]} titres sur ${KZ.t} : ${P(KZ.c[KZ.j],KZ.t)}.</p><p>b) C'est l'évènement contraire : ${KZ.t} − ${KZ.c[KZ.j]} = ${KZ.t-KZ.c[KZ.j]}, donc ${P(KZ.t-KZ.c[KZ.j],KZ.t)}.</p><p class="calc">Vérification : ${F(KZ.c[KZ.j],KZ.t)} + ${F(KZ.t-KZ.c[KZ.j],KZ.t)} = 1</p>`},
  {n:"Exercice 8", t:"Encore des cartes", w:"Sur ton cahier", h:`<p>Dans un jeu de 32 cartes, on tire une carte au hasard. Donne la probabilité de chaque évènement en justifiant.</p><p>A : « Obtenir une carte qui n'est pas ${C8[0][0]} »</p><p>B : « Obtenir une carte qui n'est pas ${C8[1][0]} »</p><p>C : « Obtenir une carte rouge ou une carte noire »</p>`,
   c:`<p><b>A :</b> ${bar("A")} : « obtenir ${C8[0][0]} », p(${bar("A")}) = ${F(C8[0][1],32)}. Donc :</p><p class="calc">p(A) = 1 − ${F(C8[0][1],32)}<br>${PC("p(A)",32-C8[0][1],32)}</p><p><b>B :</b> ${bar("B")} : « obtenir ${C8[1][0]} », p(${bar("B")}) = ${F(C8[1][1],32)}. Donc :</p><p class="calc">${PC("p(B)",32-C8[1][1],32)}</p><p><b>C :</b> évènement certain : p(C) = 1.</p>`},
  {n:"Exercice 9", t:"Au restaurant", w:"Sur ton cahier", h:`<p>Un menu comprend une entrée et un plat, choisis au hasard.</p><p>Entrées : ${MENU.E.map(x=>x[0]).join(", ")}. Plats : ${MENU.Pl.map(x=>x[0]).join(", ")}.</p><p>Les plats de poisson ou de fruits de mer sont : ${[...MENU.E,...MENU.Pl].filter(x=>x[1]).map(x=>x[0]).join(", ")}.</p><p>a) Combien y a-t-il de menus possibles ?</p><p>b) Quelle est la probabilité de manger du poisson en entrée et en plat ?</p><p>c) Quelle est la probabilité de ne pas manger de poisson ?</p><p>d) Quelle est la probabilité de manger au moins une fois du poisson ?</p>`,
   c:`<p>a)</p>${tree2(MENU.E.map(x=>x[0]),MENU.Pl.map(x=>x[0]))}<p>${MENU.E.length} × ${MENU.Pl.length} = ${MENU.n} menus.</p><p>b) ${both.map(mn).join(" ; ")} : ${P(both.length,MENU.n)}.</p><p>c) ${none.map(mn).join(" ; ")} : ${P(none.length,MENU.n)}.</p><p>d) C'est l'évènement contraire de c) :</p><p class="calc">p = 1 − ${F(none.length,MENU.n)}<br>${PC("p",one.length,MENU.n)}</p>`}
 ]},
 {t:"Pour plus tard : fréquence et probabilité", e:[
  {n:"Exercice 10", t:"Activité : lancers de dés", w:"Sur ton cahier", h:`<p>On a lancé ${LAN.length} fois un dé équilibré à 6 faces et on a obtenu :</p><p class="calc">${LAN.join(" – ")}</p><p><b>1)</b> Donne la fréquence d'apparition de chaque chiffre de 1 à 6.</p><p><b>2)</b> La probabilité de chaque issue est {1/6}. Pourquoi les fréquences sont-elles différentes des probabilités ?</p>${abs.length?`<p><b>3)</b> Comme ${abs.join(" et ")} ${abs.length>1?"ne sont":"n'est"} pas encore apparu${abs.length>1?"s":""}, a-t-on plus de chances de ${abs.length>1?"les ":"l'"}obtenir au lancer suivant ?</p>`:""}`,
   c:`<p><b>1)</b> ${[1,2,3,4,5,6].map(k=>`${k} : ${F(fq(k),LAN.length)}`).join(" · ")}</p><p><b>2)</b> Avec peu de lancers, le hasard fait que les fréquences s'éloignent de {1/6}. Plus on fait de lancers, plus les fréquences se rapprochent de la probabilité.</p>${abs.length?`<p><b>3)</b> Non : le dé n'a pas de mémoire, la probabilité reste {1/6} à chaque lancer.</p>`:""}`}
 ]}
];
};
