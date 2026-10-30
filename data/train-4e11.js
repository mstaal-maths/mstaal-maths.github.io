/* 4e · chapitre 11 — fiche d'entraînement : les exercices de M. Staal (comparer, additionner, soustraire des fractions)
   avec d'autres nombres. Toutes les corrections sont calculées avec des entiers (outils window.FR11 de data/4e-11.js). */
TRAIN["4e-11"] = function(){
const {ri, pick, shuf, distinct} = TR;
const {gcd,lcm,M,F,R,simp,addSteps,calc,line,cmpSteps,bar,disk,op3,grid,squares} = window.FR11;
const LT="&lt;", GT="&gt;";
const cop=(n,d)=>gcd(n,d)===1;
/* fraction irréductible a/b avec b dans L */
const frac=(L,max=1)=>{ for(;;){ const b=pick(L), a=ri(1,Math.max(1,Math.floor(b*max))); if(cop(a,b)&&a!==b) return [a,b]; } };
const cmpTxt=(a,b,c,d)=>{ const C=cmpSteps(a,b,c,d); return C; };
/* somme de plusieurs fractions au même dénominateur */
function sumList(L){ const m=L.reduce((x,[a,b])=>lcm(x,b),1), conv=L.map(([a,b])=>a*m/b), n=conv.reduce((x,y)=>x+y,0);
  return {m,n, txt:`${L.map(([a,b])=>F(a,b)).join(" + ")} = ${conv.map(x=>F(x,m)).join(" + ")} = ${F(n,m)}${gcd(n,m)>1?" = "+R(n,m):""}`}; }

/* ===== A. Comparer ===== */
const A1=(()=>{ const n1=ri(4,19), n2=ri(2,9); return {n1,n2,N2:2*n2}; })();
const E1=(()=>{ let a,b,c,d; do{ b=pick([4,5,6,8]); a=ri(1,b-1); d=2*b; c=ri(1,d-1); }while(c===2*a); return {a,b,c,d,C:cmpSteps(a,b,c,d)}; })();
const NOMS=[["Mathilde","Thomas"],["Lina","Hugo"],["Zoé","Adam"],["Emma","Nathan"]];
const E2=(()=>{ const [p1,p2]=pick(NOMS); let a,b,c,d; do{ b=pick([3,4,5,6]); d=b*pick([2,3]); a=ri(1,b-1); c=ri(1,d-1); }while(!cop(a,b)||c*b===a*d); return {p1,p2,a,b,c,d,C:cmpSteps(a,b,c,d)}; })();
const E3=(()=>{ let a,b,c,d,C; do{ b=pick([3,4,5,7]); d=pick([3,4,5,7]); a=ri(1,b-1); c=ri(1,d-1); C=cmpSteps(a,b,c,d); }while(b===d||C.A===C.C); return {a,b,c,d,C}; })();
const E4=(()=>{ const out=[];
  { const b=ri(2,6), k=ri(2,4), a=ri(b+1,3*b); let c; do{ c=ri(a*k-3,a*k+3); }while(c===a*k||c<1); out.push([a,b,c,b*k]); }
  { const b=ri(3,6), a=ri(b+1,2*b); let c; do{ c=ri(2*a-3,2*a+3); }while(c===2*a); out.push([a,b,c,2*b]); }
  { const b=ri(2,5), a=ri(1,b-1), k=ri(2,5); out.push([a,b,a*k,b*k]); }
  { let a,b,c,d,C; do{ b=ri(3,8); d=ri(3,8); a=ri(1,b-1); c=ri(1,d-1); C=cmpSteps(a,b,c,d); }while(lcm(b,d)===Math.max(b,d)||C.A===C.C); out.push([a,b,c,d]); }
  { let a,b,c,d,C; do{ b=ri(3,6); d=ri(3,6); a=ri(b+1,3*b); c=ri(d+1,3*d); C=cmpSteps(a,b,c,d); }while(lcm(b,d)===Math.max(b,d)||C.A===C.C||!cop(a,b)||!cop(c,d)); out.push([a,b,c,d]); }
  { const n=ri(2,5), d=ri(2,6), num=n*d+pick([-1,1,-2,2]); out.push([n,1,num,d]); }
  return out; })();

/* ===== B. Additionner et soustraire ===== */
const ACT=(()=>{ /* 1) a/b + 1/(b·k) ; 2) 1/2 + c/5 ; 3) 1/2 − c/5 */
  const b=pick([2,3,4]), k=pick([2,3]), d=b*k, c2=pick([1,2]), c3=pick([1,2]);
  return {b,d,S1:addSteps(1,b,1,d,"+"),c2,S2:addSteps(1,2,c2,5,"+"),c3,S3:addSteps(1,2,c3,5,"−")}; })();
const E5=(()=>{ for(;;){ const L=[frac([2,3,4,6]),frac([3,4,6,12]),frac([6,12])]; const S=sumList(L); if(S.n!==S.m) return {L,S}; } })();
const E6=(()=>{ for(;;){ const L=[frac([3,4,5],1),frac([6,8,10],1)]; const S=sumList(L); if(S.n!==S.m&&lcm(L[0][1],L[1][1])<=40) return {L,S}; } })();
const E7=(()=>{ for(;;){ const L=[frac([10,15]),frac([3,5]),frac([6])]; const S=sumList(L); if(S.n<S.m) return {L,S}; } })();
const E8=(()=>{ for(;;){ const a=frac([12])[0], [c,d]=frac([3,4,6]); const m=12, A=a, C=c*m/d, L=m-A-C; if(L<=0||A===C||A===L||C===L) continue; return {a,c,d,A,C,L}; } })();
const E9=(()=>{ for(;;){ const [a,b]=frac([10]), [c,d]=frac([5]); const m=10, r=m-a-c*2; if(r>0) return {a,b,c,d,r}; } })();
const E10=(()=>{ for(;;){ const [a,b]=frac([3,4,5]), [c,d]=frac([7,9,11]); if(c*b>a*d && lcm(b,d)<=50) return {a,b,c,d,S:addSteps(c,d,a,b,"−")}; } })();

/* ===== C. Entraînement ===== */
const E11=distinct(5,()=>{ const t=ri(0,4); let a,b,c,d;
  if(t===4){ a=ri(1,5); b=1; [c,d]=frac([3,4,5,7]); } else { [a,b]=frac([3,4,5,6,8,9]); [c,d]=frac(t===0?[b]:t===1?[2*b,3*b]:[3,4,5,6,7,8,9]); if(t===0) d=b; }
  return [a,b,c,d]; }, x=>x.join(","));
const E11b=distinct(5,()=>{ let n,d; do{ d=ri(2,9); n=ri(1,12); }while(!cop(n,d)||n===d); const k=pick([2,3,4,6,7,8,9,12]), s=pick([1,1,1,-1]); return [s*n*k,d*k]; }, x=>x.join(","));
const LET="ABCDE";

/* ===== D. Pour les plus rapides ===== */
const DEF=(()=>{ for(;;){ const L=shuf([[ri(1,4),5],[-ri(1,4),5],[-ri(1,9),10],[ri(1,19),20]]).map(([a,b])=>[a,b]); if(L.some(([a,b])=>!cop(Math.abs(a),b))) continue; const v=L.map(([a,b])=>a*20/b); if(new Set(v).size<4) continue; return {L,v}; } })();
const dS=DEF.L.map((x,i)=>[x,DEF.v[i]]).sort((p,q)=>p[1]-q[1]);
const fx=([a,b])=>a<0?`(${F(a,b)})`:F(a,b);
const tw=v=>v<0?`(${F(v,20)})`:F(v,20);   /* en vingtièmes, entre parenthèses si négatif */
const eqR=v=>F(v,20)===R(v,20)?`<b>${R(v,20)}</b>`:`${F(v,20)} = <b>${R(v,20)}</b>`;
const {chns}=window.CHN4;   /* calculs en chaîne « A = … » */
const stR=v=>F(v,20)===R(v,20)?[`<b>${R(v,20)}</b>`]:[F(v,20),`<b>${R(v,20)}</b>`];
const VELO=(()=>{ for(;;){ const [p,q]=pick([[2,5],[1,2],[3,4],[3,5],[2,3]]), [r,s]=pick([[1,6],[1,8],[1,10],[1,4],[1,12]]); const m=lcm(q,s), pos=p*m/q-r*m/s; if(pos<=0) continue; const rest=m-pos, k=pick([0.1,0.2,0.5,1]); return {p,q,r,s,m,pos,rest,k,km:Math.round(rest*k*10)/10,T:Math.round(m*k*10)/10}; } })();
const N=x=>String(x).replace(".",",");
const SOM=(()=>{ const e=pick([1,2,3]), pr=pick([5,7,9,11]), dl=pick([2,3,4]); /* en 48e : endormissement e, profond 2·pr (en 24e pr), différence 6·dl/… */
  const P=pr*2, D=pick([6,4,3]); const Lg=P+D, par=48-e-P-Lg; return par>0 ? {e,pr,D,P,Lg,par} : {e:1,pr:7,D:6,P:14,Lg:20,par:13}; })();
const GR=(()=>{ for(;;){ const G=Array.from({length:4},()=>Array.from({length:6},()=>pick([1,1,2,2,3,3,4,4,5,6]))); const s=squares(G); if(s.length>=3&&s.length<=6) return {G,s}; } })();

return [
 {t:"Comparer des fractions", e:[
  {n:"Activité 1", t:"Devoir d'anglais", w:"Sur ton cahier", h:`<p>Mathilde a obtenu {${A1.n1}/20} à un devoir, puis {${A1.n2}/10} au devoir suivant.</p><p>Sans calculatrice, détermine la meilleure des deux notes.</p>`,
   c:`<p class="calc">{${A1.n2}/10} = {${A1.n2} × 2/10 × 2} = {${A1.N2}/20}</p><p>${A1.N2===A1.n1?`Les deux notes sont égales ({${A1.n1}/20}).`:A1.N2>A1.n1?`{${A1.N2}/20} &gt; {${A1.n1}/20} : la meilleure note est la deuxième.`:`{${A1.n1}/20} &gt; {${A1.N2}/20} : la meilleure note est la première.`}</p>`},
  {n:"Exercice 1", t:"Quel est le meilleur buteur ?", w:"Sur ton cahier", h:`<p>Sur ${E1.b} tirs au but, Lilian en a réussi ${E1.a} : sa proportion de réussite est {${E1.a}/${E1.b}}.</p><p>Sur ${E1.d} tirs au but, Guénolé en a réussi ${E1.c} : sa proportion de réussite est {${E1.c}/${E1.d}}.</p><p>Quel joueur a la plus grande proportion de réussite ?</p>`,
   c:`<p>${E1.C.txt}</p><p>${E1.C.txt2}</p><p>C'est <b>${E1.C.A>E1.C.C?"Lilian":"Guénolé"}</b>.</p>`},
  {n:"Exercice 2", t:"Le cake", w:"Sur ton cahier", h:`<p>${E2.p1} a mangé ${F(E2.a,E2.b)} du cake et ${E2.p2} a mangé ${F(E2.c,E2.d)} du cake.</p><p>Qui a mangé la plus grande part ?</p>`,
   c:`<p>${E2.C.txt}</p><p>${E2.C.txt2}</p><p>C'est <b>${E2.C.A>E2.C.C?E2.p1:E2.p2}</b>.</p>`},
  {n:"Exercice 3", t:"Tableau d'honneur", w:"Sur ton cahier", h:`<p>Claire a gagné ${E3.a} match${E3.a>1?"s":""} sur ${E3.b} alors que Karim a gagné ${E3.c} match${E3.c>1?"s":""} sur ${E3.d}.</p><p>Quel joueur a la plus grande proportion de réussite ?</p>`,
   c:`<p>Claire : ${F(E3.a,E3.b)} ; Karim : ${F(E3.c,E3.d)}. Dénominateur commun : ${E3.C.m}.</p><p>${E3.C.txt}</p><p>${E3.C.txt2}</p><p>C'est <b>${E3.C.A>E3.C.C?"Claire":"Karim"}</b>.</p>`},
  {n:"Exercice 4", t:"Comparer deux fractions", w:"Sur ton cahier", h:`<p>Compare les deux nombres. Explique tes choix.</p>${E4.map(([a,b,c,d],i)=>`<p>${"abcdef"[i]}) ${F(a,b)} et ${F(c,d)}</p>`).join("")}`,
   c:E4.map(([a,b,c,d],i)=>{ const C=cmpSteps(a,b,c,d); return `<p>${"abcdef"[i]}) ${C.txt} ${C.txt2}</p>`; }).join("")}
 ]},
 {t:"Additionner et soustraire des fractions", e:[
  {n:"Activité 2", t:"Somme et différence de fractions", w:"Sur ton cahier", h:`<p><b>1)</b> Alice prend {1/${ACT.b}} d'un pain d'épices et Benoît prend {1/${ACT.d}} du pain d'épices. Quelle fraction du pain d'épices ont-ils mangée ?</p>
   <p><b>2)</b> Alice mange la moitié d'une tarte et Benoît en prend ${F(ACT.c2,5)}. Quelle fraction de la tarte ont-ils mangée ?</p><p><b>3)</b> Arnaud et Jules ont mangé à eux deux la moitié d'une pizza. Arnaud en a mangé ${F(ACT.c3,5)}. Quelle fraction de la pizza a mangé Jules ?</p>`,
   c:`<p><b>1)</b></p>${op3(bar(ACT.b,1,150),`{1/${ACT.b}}`,"+",bar(ACT.d,1,180),`{1/${ACT.d}}`,bar(ACT.d,ACT.S1.n*ACT.d/ACT.S1.m,180),F(ACT.S1.n*ACT.d/ACT.S1.m,ACT.d))}<p class="calc">${line(ACT.S1.L)}</p>
   <p><b>2)</b></p>${op3(disk(2,1),"{1/2}","+",disk(5,ACT.c2),F(ACT.c2,5),disk(10,ACT.S2.n),F(ACT.S2.n,10))}<p class="calc">${line(ACT.S2.L)}</p>
   <p><b>3)</b></p>${op3(disk(2,1),"{1/2}","−",disk(5,ACT.c3),F(ACT.c3,5),disk(10,ACT.S3.n),F(ACT.S3.n,10))}<p class="calc">${line(ACT.S3.L)}</p><p>Jules a mangé <b>${R(ACT.S3.n,ACT.S3.m)}</b> de la pizza.</p>`},
  {n:"Exercice 5", t:"Le cocktail", w:"Sur ton cahier", h:`<p>Dans une carafe d'un litre, Maya verse ${F(...E5.L[0])} L de jus d'orange, ${F(...E5.L[1])} L de jus de mangue et ${F(...E5.L[2])} L de jus d'ananas.</p><p>Son copain lui crie : « Stop, ça va déborder ! » A-t-il raison ?</p>`,
   c:`<p class="calc">${E5.S.txt}</p><p>${E5.S.n>E5.S.m?`${R(E5.S.n,E5.S.m)} L &gt; 1 L : <b>oui</b>, ça va déborder.`:`${R(E5.S.n,E5.S.m)} L &lt; 1 L : <b>non</b>, ça ne va pas déborder.`}</p>`},
  {n:"Exercice 6", t:"Voyage en Espagne", w:"Sur ton cahier", h:`<p>Pour financer un voyage, une classe récolte ${F(...E6.L[0])} de la somme nécessaire et l'autre classe ${F(...E6.L[1])} de la somme.</p><p>Ont-ils suffisamment d'argent pour payer la totalité du voyage ?</p>`,
   c:`<p class="calc">${E6.S.txt}</p><p>${E6.S.n>E6.S.m?`C'est plus que 1 : <b>oui</b>, ils ont assez d'argent (il y a même ${R(E6.S.n-E6.S.m,E6.S.m)} de la somme en trop).`:`C'est moins que 1 : <b>non</b>, il leur manque ${R(E6.S.m-E6.S.n,E6.S.m)} de la somme.`}</p>`},
  {n:"Exercice 7", t:"Tapisserie", w:"Sur ton cahier", h:`<p>Maxime pose ${F(...E7.L[0])} du papier peint le premier jour, ${F(...E7.L[1])} le deuxième jour et ${F(...E7.L[2])} le troisième jour.</p><p>A-t-il fini ?</p>`,
   c:`<p class="calc">${E7.S.txt}</p><p>${E7.S.n<E7.S.m?`C'est moins que 1 : <b>non</b>, il lui reste ${R(E7.S.m-E7.S.n,E7.S.m)} du papier peint à poser.`:`C'est 1 : oui, il a fini.`}</p>`},
  {n:"Exercice 8", t:"Élections", w:"Sur ton cahier", h:`<p>Axelle a obtenu ${F(E8.a,12)} des voix, Marc ${F(E8.c,E8.d)} des voix et Léa le reste.</p><p>Quel élève a obtenu le plus de voix ?</p>`,
   c:`<p>Marc : ${F(E8.c,E8.d)} = ${F(E8.C,12)}.</p><p class="calc">Léa : 1 − ${F(E8.A,12)} − ${F(E8.C,12)} = {12/12} − ${F(E8.A+E8.C,12)} = ${F(E8.L,12)}</p><p>Le plus grand numérateur est ${Math.max(E8.A,E8.C,E8.L)} : c'est <b>${E8.A>E8.C&&E8.A>E8.L?"Axelle":E8.C>E8.L?"Marc":"Léa"}</b>.</p>`},
  {n:"Exercice 9", t:"Utilisation de l'eau", w:"Sur ton cahier", h:`<p>Dans un pays, ${F(E9.a,10)} de l'eau sert à l'agriculture et ${F(E9.c,5)} à l'industrie. Le reste est pour la consommation domestique.</p><p>Quelle fraction représente la consommation domestique ?</p>`,
   c:`<p class="calc">${F(E9.a,10)} + ${F(E9.c,5)} = ${F(E9.a,10)} + ${F(2*E9.c,10)} = ${F(E9.a+2*E9.c,10)}<br>1 − ${F(E9.a+2*E9.c,10)} = ${F(E9.r,10)}${gcd(E9.r,10)>1?" = "+R(E9.r,10):""}</p><p>La consommation domestique représente <b>${R(E9.r,10)}</b> de l'eau utilisée.</p>`},
  {n:"Exercice 10", t:"Le TGV", w:"Sur ton cahier", h:`<p>Au départ de Paris, ${F(E10.a,E10.b)} des places d'une voiture de TGV sont occupées.</p><p>À Poitiers, personne ne descend mais des passagers montent : ${F(E10.c,E10.d)} des places sont maintenant occupées.</p><p>Quelle fraction des places ont prise les passagers montés à Poitiers ?</p>`,
   c:`<p class="calc">${line(E10.S.L)}</p><p>Les passagers montés à Poitiers occupent <b>${R(E10.S.n,E10.S.m)}</b> des places.</p>`}
 ]},
 {t:"Entraînement aux calculs", e:[
  {n:"Exercice 11", t:"Entraînement aux calculs", w:"Sur ton cahier", h:`<p><b>1)</b> Calcule ces 5 expressions.</p>${E11.map(([a,b,c,d],i)=>`<p>${LET[i]} = ${F(a,b)} + ${F(c,d)}</p>`).join("")}<p><b>2)</b> Simplifie ces fractions en indiquant tes calculs.</p>${E11b.map(([n,d],i)=>`<p>${LET[i]} = ${F(n,d)}</p>`).join("")}`,
   c:`<p><b>1)</b></p>${E11.map(([a,b,c,d],i)=>calc(LET[i],addSteps(a,b,c,d,"+").L)).join("")}<p><b>2)</b></p>${E11b.map(([n,d],i)=>calc(LET[i],simp(n,d).slice(0))).join("")}`}
 ]},
 {t:"Pour les plus rapides", e:[
  {n:"Exercice 12", t:"Défi", w:"Sur ton cahier", h:`<p>Avec deux des quatre nombres suivants :</p><p class="calc">${DEF.L.map(([a,b])=>F(a,b)).join(" &nbsp;&nbsp; ")}</p><p>a) calcule la plus grande somme possible A ;</p><p>b) calcule la plus petite somme possible B ;</p><p>c) calcule la plus grande différence possible C ;</p><p>d) calcule la plus petite différence possible D.</p>`,
   c:`<p>En vingtièmes : ${DEF.L.map(([a,b],i)=>`${F(a,b)} = ${F(DEF.v[i],20)}`).join(" ; ")}.</p><p>Rangés : ${dS.map(x=>F(x[1],20)).join(" &lt; ")}.</p>
   <p>a) On ajoute les deux plus grands. b) On ajoute les deux plus petits. c) Le plus grand moins le plus petit. d) Le plus petit moins le plus grand.</p>
   ${chns([["A",[`${fx(dS[2][0])} + ${fx(dS[3][0])}`,`${tw(dS[2][1])} + ${tw(dS[3][1])}`,...stR(dS[2][1]+dS[3][1])]],["B",[`${fx(dS[0][0])} + ${fx(dS[1][0])}`,`${tw(dS[0][1])} + ${tw(dS[1][1])}`,...stR(dS[0][1]+dS[1][1])]],
     ["C",[`${fx(dS[3][0])} − ${fx(dS[0][0])}`,`${tw(dS[3][1])} − ${tw(dS[0][1])}`,...stR(dS[3][1]-dS[0][1])]],["D",[`${fx(dS[0][0])} − ${fx(dS[3][0])}`,`${tw(dS[0][1])} − ${tw(dS[3][1])}`,...stR(dS[0][1]-dS[3][1])]]])}`},
  {n:"Exercice 13", t:"À vélo", w:"Sur ton cahier", h:`<p>Coline part du collège à vélo pour rentrer chez elle.</p><p>Elle parcourt ${F(VELO.p,VELO.q)} de son trajet, puis elle fait demi-tour sur ${F(VELO.r,VELO.s)} du parcours total pour ramasser son cartable.</p><p>Il lui reste alors ${N(VELO.km)} km à parcourir jusque chez elle.</p><p>Quelle est la distance entre chez elle et son collège ?</p>`,
   c:`<p class="calc">${F(VELO.p,VELO.q)} − ${F(VELO.r,VELO.s)} = ${F(VELO.p*VELO.m/VELO.q,VELO.m)} − ${F(VELO.r*VELO.m/VELO.s,VELO.m)} = ${F(VELO.pos,VELO.m)} du trajet</p><p>Il lui reste 1 − ${F(VELO.pos,VELO.m)} = ${F(VELO.rest,VELO.m)} du trajet, soit ${N(VELO.km)} km.</p><p class="calc">{1/${VELO.m}} du trajet : ${N(VELO.km)} ÷ ${VELO.rest} = ${N(VELO.k)} km<br>Trajet entier : ${VELO.m} × ${N(VELO.k)} = ${N(VELO.T)} km</p><p>La distance est <b>${N(VELO.T)} km</b>.</p>`},
  {n:"Exercice 14", t:"Sommeil", w:"Sur ton cahier", h:`<p>On a enregistré les phases de sommeil d'un patient, en fraction de la durée totale :</p><p>• temps d'endormissement : ${F(SOM.e,48)} ;</p><p>• sommeil profond : ${R(SOM.pr,24)} ;</p><p>• le sommeil léger dure ${R(SOM.D,48)} de plus que le sommeil profond.</p><p>Quelle est la part du sommeil paradoxal ?</p>`,
   c:`<p>En quarante-huitièmes : ${R(SOM.pr,24)} = ${F(SOM.P,48)} ; ${R(SOM.D,48)} = ${F(SOM.D,48)}.</p><p class="calc">Sommeil léger : ${F(SOM.P,48)} + ${F(SOM.D,48)} = ${F(SOM.Lg,48)}<br>Sommeil paradoxal : 1 − ${F(SOM.e,48)} − ${F(SOM.P,48)} − ${F(SOM.Lg,48)} = ${F(SOM.par,48)}${gcd(SOM.par,48)>1?" = "+R(SOM.par,48):""}</p>`},
  {n:"Exercice 15", t:"Observer", w:"Sur ton cahier", h:`<p>Dans cette grille, retrouve tous les carrés de 4 cases où figurent des nombres dont la somme est 1.</p>${grid(GR.G)}`,
   c:`<p>En douzièmes, il faut que les 4 numérateurs fassent 12. On trouve ${GR.s.length} carrés :</p>${GR.s.map(([i,j])=>`<p>lignes ${i+1}-${i+2} et colonnes ${j+1}-${j+2} : ${[GR.G[i][j],GR.G[i][j+1],GR.G[i+1][j],GR.G[i+1][j+1]].join(" + ")} = 12</p>`).join("")}${grid(GR.G,GR.s)}`}
 ]}
];
};
