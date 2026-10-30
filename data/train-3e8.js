/* 3e · chapitre 8 — fiche d'entraînement : les exercices de la fiche de M. Staal (Pythagore et sa réciproque), avec d'autres nombres.
   Les figures et les corrections sont calculées à partir des mêmes longueurs (outils window.PY3 de data/3e-8.js). */
TRAIN["3e-8"] = function(){
const {ri, pick, shuf} = TR;
const {geo, F, rd, rac, ang, rtFig, triFig, TRIP, sq} = window.PY3;
const fig=(cap,body)=>`<figure>${body}${cap?`<figcaption>${cap}</figcaption>`:""}</figure>`;
const r1=x=>F(x,1), r2=x=>F(x,2), eur=x=>{ const c=Math.round(x*100+1e-6); return F(Math.floor(c/100))+","+String(c%100).padStart(2,"0"); };

/* côtés d'un triangle rectangle : triplet × k */
function rt(ks, maxC){ for(let g=0;g<500;g++){ const [a,b,c]=pick(TRIP), k=pick(ks), s=[rd(a*k),rd(b*k),rd(c*k)]; if(s[0]>=1 && s[2]<=maxC) return s; } return [3,4,5]; }
/* on change un peu le plus grand côté */
function nrt(ks, maxC, dv){ for(let g=0;g<500;g++){ const [a,b,c]=rt(ks,maxC), c2=rd(c+pick([-1,1])*pick(dv)); if(c2>Math.max(a,b) && c2<a+b-0.3) return [a,b,c2]; } return [6,8,11]; }
/* rédaction de la réciproque : big = nom du plus grand côté, p, q = les deux autres ; v = valeurs ; R = sommet opposé */
function recC(T, big, p, q, vb, vp, vq, R){
  const B2=rd(vb*vb), S=rd(vp*vp+vq*vq), ok=Math.abs(B2-S)<1e-6;
  return {ok, h:`<p>Dans le triangle ${T}, le plus grand côté est [${big}].</p><div class="figs"><p class="calc">${big}² = ${sq(vb)}<br>${big}² = ${F(B2)}</p><p class="calc">${p}² + ${q}² = ${sq(vp)} + ${sq(vq)}<br>${p}² + ${q}² = ${F(vp*vp)} + ${F(vq*vq)}<br>${p}² + ${q}² = ${F(S)}</p></div>`
   +(ok?`<p>${big}² = ${p}² + ${q}² : l'égalité de Pythagore est vérifiée, donc <b>${T} est rectangle en ${R}</b>.</p>`:`<p>${big}² ≠ ${p}² + ${q}² : l'égalité de Pythagore n'est pas vérifiée, donc <b>${T} n'est pas rectangle</b>.</p>`)};
}

/* ===== Activité 1 ===== */
const a1ok=Math.random()<0.5;
const A1a=a1ok?rt([0.2,0.4,0.5,0.8,1.2],12):nrt([0.2,0.4,0.5,0.8,1.2],12,[0.2,0.3,0.4]);   /* EFG : GE, EF, GF */
const A1b=a1ok?nrt([0.2,0.4,0.5,0.8,1.2],12,[0.2,0.3,0.4]):rt([0.2,0.4,0.5,0.8,1.2],12);   /* OEA : EA, OA, OE */
const f1a=triFig(["E","F","G"], A1a[2], A1a[0], A1a[1], {GE:F(A1a[0])+" cm",EF:F(A1a[1])+" cm",FG:F(A1a[2])+" cm"}, 280);
const f1b=triFig(["A","O","E"], A1b[2], A1b[0], A1b[1], {EA:F(A1b[0])+" cm",AO:F(A1b[1])+" cm",OE:F(A1b[2])+" cm"}, 280);
const c1a=recC("EFG","GF","GE","EF",A1a[2],A1a[0],A1a[1],"E"), c1b=recC("OEA","OE","EA","OA",A1b[2],A1b[0],A1b[1],"A");

/* ===== Exercice 1 : les murs ===== */
const m1ok=Math.random()<0.5, M1=m1ok?rt([4,6,8,10,12],160):nrt([4,6,8,10,12],160,[2,3,4,5]);
const c1=recC("MUR","MR","MU","UR",M1[2],M1[0],M1[1],"U");

/* ===== Exercice 2 : l'étagère ===== */
const e2ok=Math.random()<0.5, E2=e2ok?rt([3,4,5,6,9],60):nrt([3,4,5,6,9],60,[1,2]);   /* EA, ET, AT */
const c2=recC("AET","AT","EA","ET",E2[2],E2[0],E2[1],"E");
const f2T=(()=>{ const [ea,et,at]=E2, y=(ea*ea-et*et+at*at)/(2*ea); return [Math.sqrt(Math.max(0,at*at-y*y)), y]; })();
const f2=geo({P:{E:[0,E2[0]],A:[0,0],T:f2T}, poly:[["E","A","T"]], len:[["E","A",F(E2[0])+" cm"],["E","T",F(E2[1])+" cm"],["A","T",F(E2[2])+" cm"]], k:170/Math.max(E2[0],E2[1]), alt:"Mur [EA], étagère [ET] et support [AT]"});

/* ===== Exercice 3 ===== */
const e3=[Math.random()<0.5, Math.random()<0.5].map(ok=>ok?rt([0.3,0.6,1.2,1.5,1.8],40):nrt([0.3,0.6,1.2,1.5,1.8],40,[0.1,0.2,0.3]));
const c3a=recC("ABC","AC","AB","BC",e3[0][2],e3[0][0],e3[0][1],"B"), c3b=recC("STU","SU","TU","ST",e3[1][2],e3[1][0],e3[1][1],"T");

/* ===== Activité rapide ===== */
let ar1a, ar1b; do{ ar1a=ri(12,40); ar1b=ri(12,45); }while(Number.isInteger(Math.hypot(ar1a,ar1b)) || ar1a===ar1b);
const ar1h=Math.hypot(ar1a,ar1b);
let ar2h, ar2l; do{ ar2h=ri(50,99)/10; ar2l=ri(20,Math.round(ar2h*10)-15)/10; }while(Number.isInteger(Math.sqrt(rd(ar2h*ar2h-ar2l*ar2l))));
const ar2s=rd(ar2h*ar2h-ar2l*ar2l), ar2x=Math.sqrt(ar2s);
const fAr1=rtFig(["S","M","E"], ar1b/10, ar1a/10, {SE:ar1a+" m",SM:ar1b+" m"}, 0, 280);
const fAr2=rtFig(["N","K","L"], ar2x, ar2l, {NL:F(ar2l)+" cm",KL:F(ar2h)+" cm"}, 0, 280);

/* ===== Activité 2 ===== */
const tvH=ri(250,450)/10, tvL=rd(tvH*pick([1.6,1.7,1.75,1.78]),1), tvD2=rd(tvH*tvH+tvL*tvL), tvD=Math.sqrt(tvD2);
const [va,vb,vc]=rt([0.1,0.2,0.3],6); /* MA, AT, MT */

/* ===== Exercice 4 : la remorque ===== */
const rL=ri(14,22)*100, rl=ri(Math.round(rL*0.5/50),Math.round(rL*0.85/50))*50, rD=Math.hypot(rL,rl), fus=Math.round(rD/50)*50+pick([-150,-100,100,150]);
const fits=fus<=rD;

/* ===== Exercice 5 : la rampe ===== */
const rpL=ri(20,40)/10, rpH=ri(4,12)/10, rpS=rd(rpL*rpL-rpH*rpH), rpX=Math.sqrt(rpS);

/* ===== Exercice 6 : la tour ===== */
const tr=pick([1.5,2,2.5,3]), tg=rd(tr+pick([1,1.5,2,2.5])), tH=ri(6,15), th2=rd(tg*tg-tr*tr), th=Math.sqrt(th2);
const Vco=Math.PI*tr*tr*th/3, Vcy=Math.PI*tr*tr*tH;

/* ===== Exercice 7 : l'abri ===== */
const ab1=ri(45,60)/10, ab2=ri(22,30)/10, abl=ri(30,50)/10, abL=ri(4,8), abP=pick([7.5,8.2,9.3,10.4,11.9]);
const abV=rd(ab1-ab2), abS=rd(abV*abV+abl*abl), abW=Math.sqrt(abS), abA=abW*abL;

/* ===== Exercice 8 : quatre triangles ===== */
const T8=[rt([0.2,0.4,0.6,0.8,1.2],14), rt([0.2,0.4,0.6,0.8,1.2],14), rt([0.2,0.4,0.6,0.8,1.2],14), rt([0.2,0.4,0.6,0.8,1.2],14)];
const f8a=rtFig(["M","J","X"], T8[0][0], T8[0][1], {MJ:F(T8[0][0]),MX:F(T8[0][1])}, 0, 260);
const f8b=rtFig(["I","P","F"], T8[1][0], T8[1][1], {IF:F(T8[1][1])+" cm",PF:F(T8[1][2])+" cm"}, 0, 260);

return [
 {t:"Démontrer qu'un triangle est rectangle ou non", e:[
  {n:"Activité 1", t:"Prouver qu'un triangle est rectangle ou non", w:"Sur ton cahier", h:`<div class="figs">${fig("a) Le triangle EFG est-il rectangle ?",f1a)}${fig("b) Le triangle OEA est-il rectangle ?",f1b)}</div><p>Justifie chaque réponse.</p>`,
   c:`<p><b>a)</b></p>${c1a.h}<p><b>b)</b></p>${c1b.h}`},
  {n:"Exercice 1", t:"Deux murs perpendiculaires ?", w:"Sur ton cahier", h:`<p>Nathan a construit deux murs autour de sa piscine : [MU] et [UR].</p><p>Un ami pense que ses murs ne sont pas perpendiculaires.</p><p>Ils mesurent : MU = ${F(M1[0])} cm, UR = ${F(M1[1])} cm et MR = ${F(M1[2])} cm.</p><p>Qui a raison ?</p>`,
   c:`${c1.h}<p>${c1.ok?`L'angle ${ang("MUR")} est droit : les murs sont perpendiculaires. <b>C'est Nathan qui a raison.</b>`:`L'angle ${ang("MUR")} n'est pas droit : les murs ne sont pas perpendiculaires. <b>C'est l'ami qui a raison.</b>`}</p>`},
  {n:"Exercice 2", t:"Installation d'une étagère", w:"Sur ton cahier", h:`<p>Sur un mur vertical [EA], Jules a posé une étagère [ET], tenue par un support [AT].</p>${f2}<p>L'étagère est-elle horizontale ?</p>`,
   c:`${c2.h}<p>${c2.ok?"L'étagère est perpendiculaire au mur vertical : <b>elle est horizontale</b>.":"L'étagère n'est pas perpendiculaire au mur vertical : <b>elle n'est pas horizontale</b>."}</p>`},
  {n:"Exercice 3", t:"Triangles rectangles ?", w:"Sur ton cahier", h:`<p><b>a)</b> On considère le triangle ABC tel que : AB = ${F(e3[0][0])} cm, BC = ${F(e3[0][1])} cm et AC = ${F(e3[0][2])} cm.</p><p><b>b)</b> On considère le triangle STU tel que : TU = ${F(e3[1][0])} m, SU = ${F(e3[1][2])} m et ST = ${F(e3[1][1])} m.</p><p>Ces triangles sont-ils rectangles ? Justifie.</p>`,
   c:`<p><b>a)</b></p>${c3a.h}<p><b>b)</b></p>${c3b.h}`}
 ]},
 {t:"Calculer la longueur d'un côté d'un triangle rectangle", e:[
  {n:"Activité rapide", t:"Calculer la longueur d'un côté d'un triangle rectangle", w:"Sur ton cahier", h:`<p>Dans ces deux triangles, calcule la longueur du côté manquant. Donne l'arrondi au dixième.</p><div class="figs">${fig("1. ESM rectangle en S : calcule EM.",fAr1)}${fig("2. KNL rectangle en N : calcule KN.",fAr2)}</div>`,
   c:`<p><b>1.</b> ESM est rectangle en S. D'après le théorème de Pythagore :</p><p class="calc">EM² = ES² + SM²<br>EM² = ${ar1a}² + ${ar1b}²<br>EM² = ${F(ar1a*ar1a)} + ${F(ar1b*ar1b)}<br>EM² = ${F(ar1a*ar1a+ar1b*ar1b)}<br>EM = ${rac(F(ar1a*ar1a+ar1b*ar1b))}<br>EM ≈ ${r1(ar1h)} m</p>
   <p><b>2.</b> KNL est rectangle en N : l'hypoténuse est [KL].</p><p class="calc">KL² = KN² + NL²<br>KN² = KL² − NL²<br>KN² = ${sq(ar2h)} − ${sq(ar2l)}<br>KN² = ${F(ar2h*ar2h)} − ${F(ar2l*ar2l)}<br>KN² = ${F(ar2s)}<br>KN = ${rac(F(ar2s))}<br>KN ≈ ${r1(ar2x)} cm</p>`},
  {n:"Activité 2", t:"Calculer la longueur d'un côté dans un triangle rectangle", w:"Sur ton cahier", h:`<p><b>Problème 1 : Taille d'une télévision.</b> L'écran rectangulaire ABCD d'une télévision mesure AD = ${F(tvH)} cm de haut et DC = ${F(tvL)} cm de large.</p><p>La taille d'une télévision correspond à la longueur de la diagonale de l'écran. Détermine la taille de cette télévision (arrondie au centimètre).</p>
   <p><b>Problème 2 : Hauteur de la voile.</b> La voile MAT d'un bateau peut être assimilée à un triangle rectangle en A, tel que : MT = ${F(vc)} m et MA = ${F(va)} m.</p><p>Calcule la hauteur [AT] de cette voile.</p>`,
   c:`<p><b>Problème 1 :</b> le triangle ADC est rectangle en D. D'après le théorème de Pythagore :</p><p class="calc">AC² = AD² + DC²<br>AC² = ${sq(tvH)} + ${sq(tvL)}<br>AC² = ${F(tvH*tvH,4)} + ${F(tvL*tvL,4)}<br>AC² = ${F(tvD2,4)}<br>AC = ${rac(F(tvD2,4))}<br>AC ≈ ${F(tvD,0)} cm</p><p>La taille de la télévision est d'environ <b>${F(tvD,0)} cm</b>.</p>
   <p><b>Problème 2 :</b> le triangle MAT est rectangle en A. D'après le théorème de Pythagore :</p><p class="calc">MT² = AT² + MA²<br>${sq(vc)} = AT² + ${sq(va)}<br>${F(vc*vc)} = AT² + ${F(va*va)}<br>AT² = ${F(vc*vc)} − ${F(va*va)}<br>AT² = ${F(vb*vb)}<br>AT = ${rac(F(vb*vb))}<br>AT = ${F(vb)} m</p><p>La hauteur de la voile est de <b>${F(vb)} m</b>.</p>`},
  {n:"Exercice 4", t:"Le fusil sous-marin", w:"Sur ton cahier", h:`<p>Le fond d'une remorque est un rectangle de ${F(rL)} mm sur ${F(rl)} mm.</p><p>Un fusil sous-marin mesure ${F(fus)} mm.</p><p>Le fusil peut-il être placé « à plat » dans la remorque ? Justifie ta réponse.</p>`,
   c:`<p>La plus grande longueur « à plat » est la diagonale d du fond. C'est l'hypoténuse d'un triangle rectangle de côtés ${F(rL)} mm et ${F(rl)} mm :</p><p class="calc">d² = ${F(rL)}² + ${F(rl)}²<br>d² = ${F(rL*rL)} + ${F(rl*rl)}<br>d² = ${F(rL*rL+rl*rl)}<br>d = ${rac(F(rL*rL+rl*rl))}<br>d ≈ ${F(rD,0)} mm</p>
   <p>${fits?`${F(fus)} mm &lt; ${F(rD,0)} mm : <b>oui, le fusil peut être placé à plat</b> (en diagonale).`:`${F(fus)} mm &gt; ${F(rD,0)} mm : <b>non, le fusil ne peut pas être placé à plat</b>.`}</p>`},
  {n:"Exercice 5", t:"Rampe d'accès", w:"Sur ton cahier", h:`<p>Une rampe d'accès pour les personnes à mobilité réduite mesure ${r2(rpL)} m de long.</p><p>La porte d'accès est située à ${r2(rpH)} m du sol.</p><p>De quelle longueur doit-on disposer, au sol, pour pouvoir poser cette rampe ? Arrondis au centième.</p>`,
   c:`<p>La rampe est l'hypoténuse d'un triangle rectangle (le mur est perpendiculaire au sol). D'après le théorème de Pythagore :</p><p class="calc">${sq(rpL)} = ${sq(rpH)} + x²<br>x² = ${F(rpL*rpL)} − ${F(rpH*rpH)}<br>x² = ${F(rpS)}<br>x = ${rac(F(rpS))}<br>x ≈ ${r2(rpX)} m</p><p>Il faut environ <b>${r2(rpX)} m</b> au sol.</p>`},
  {n:"Exercice 6", t:"Une tour", w:"Sur ton cahier", h:`<p>Une tour cylindrique de rayon ${F(tr)} m et de hauteur ${tH} m est surmontée d'un toit conique de même rayon.</p><p>La génératrice du cône (du sommet du toit au bord du cylindre) mesure ${F(tg)} m.</p><p><b>a)</b> Calcule la hauteur du toit conique, puis son volume (arrondi au centième).</p><p><b>b)</b> Calcule le volume total, en m³, de cette tour. Donne un arrondi au centième près.</p>`,
   c:`<p><b>a)</b> Le rayon, la hauteur h du cône et la génératrice forment un triangle rectangle dont l'hypoténuse est la génératrice :</p><p class="calc">${sq(tg)} = ${sq(tr)} + h²<br>h² = ${F(tg*tg)} − ${F(tr*tr)}<br>h² = ${F(th2)}<br>h = ${rac(F(th2))} ≈ ${r2(th)} m</p>
   <p class="calc">V<sub>cône</sub> = {π × r² × h/3}<br>V<sub>cône</sub> = <span class="fr"><span>π × ${sq(tr)} × ${rac(F(th2))}</span><span>3</span></span><br>V<sub>cône</sub> ≈ ${r2(Vco)} m³</p>
   <p><b>b)</b></p><p class="calc">V<sub>cylindre</sub> = π × ${sq(tr)} × ${tH}<br>V<sub>cylindre</sub> ≈ ${r2(Vcy)} m³</p><p class="calc">V<sub>total</sub> = V<sub>cylindre</sub> + V<sub>cône</sub><br>V<sub>total</sub> ≈ ${r2(Vcy+Vco)} m³</p><p>Le volume total de la tour est d'environ <b>${r2(Vcy+Vco)} m³</b>.</p>`},
  {n:"Exercice 7", t:"Abri de jardin", w:"Sur ton cahier", h:`<p>Mme Dubois a fait construire un abri (un appentis) contre un mur.</p><p>Le toit est un rectangle de longueur ${abL} m.</p><p>Le haut du toit est à ${r2(ab1)} m du sol, le bas du toit à ${r2(ab2)} m. Au sol, l'abri a une profondeur de ${r2(abl)} m.</p>
   <p>Elle veut le recouvrir de shingles vendus ${eur(abP)} € le m².</p><p><b>a)</b> Calcule l'aire du toit, arrondie au dixième de m².</p><p><b>b)</b> Quelle somme Mme Dubois devra-t-elle dépenser pour recouvrir son abri ?</p>`,
   c:`<p><b>a)</b> La largeur ℓ du toit est l'hypoténuse d'un triangle rectangle de côtés ${r2(ab1)} − ${r2(ab2)} = ${r2(abV)} m (vertical) et ${r2(abl)} m (horizontal) :</p><p class="calc">ℓ² = ${sq(abV)} + ${sq(abl)}<br>ℓ² = ${F(abV*abV)} + ${F(abl*abl)}<br>ℓ² = ${F(abS)}<br>ℓ = ${rac(F(abS))} ≈ ${r2(abW)} m</p><p>Aire A du toit :</p><p class="calc">A = ${abL} × ${rac(F(abS))}<br>A ≈ ${r1(abA)} m²</p>
   <p class="calc"><b>b)</b> ${r1(abA)} × ${eur(abP)} ≈ ${eur(rd(abA,1)*abP)} €</p><p>Mme Dubois devra dépenser environ <b>${eur(rd(abA,1)*abP)} €</b>.</p>`},
  {n:"Exercice 8", t:"Calculer le côté manquant", w:"Sur ton cahier", h:`<p>Dans chacun de ces triangles, calcule la longueur du côté manquant.</p><div class="figs">${fig("a. JMX rectangle en M : calcule JX.",f8a)}${fig("b. PIF rectangle en I : calcule PI.",f8b)}</div>
   <p><b>c.</b> LIN est un triangle rectangle en L tel que : IL = ${F(T8[2][0])} cm et LN = ${F(T8[2][1])} cm. Calcule IN.</p><p><b>d.</b> TER est un triangle rectangle en R tel que : ER = ${F(T8[3][1])} cm et TE = ${F(T8[3][2])} cm. Calcule TR.</p>`,
   c:`<p><b>a.</b> JMX est rectangle en M : l'hypoténuse est [JX]. D'après le théorème de Pythagore :</p><p class="calc">JX² = JM² + MX²<br>JX² = ${sq(T8[0][0])} + ${sq(T8[0][1])}<br>JX² = ${F(T8[0][0]**2)} + ${F(T8[0][1]**2)}<br>JX² = ${F(T8[0][2]**2)}<br>JX = ${rac(F(T8[0][2]**2))}<br>JX = ${F(T8[0][2])}</p><p>JX mesure <b>${F(T8[0][2])}</b>.</p>
   <p><b>b.</b> PIF est rectangle en I : l'hypoténuse est [PF]. D'après le théorème de Pythagore :</p><p class="calc">PF² = PI² + IF²<br>PI² = PF² − IF²<br>PI² = ${sq(T8[1][2])} − ${sq(T8[1][1])}<br>PI² = ${F(T8[1][2]**2)} − ${F(T8[1][1]**2)}<br>PI² = ${F(T8[1][0]**2)}<br>PI = ${rac(F(T8[1][0]**2))}<br>PI = ${F(T8[1][0])}</p><p>PI mesure <b>${F(T8[1][0])} cm</b>.</p>
   <p><b>c.</b> LIN est rectangle en L : l'hypoténuse est [IN]. D'après le théorème de Pythagore :</p><p class="calc">IN² = IL² + LN²<br>IN² = ${sq(T8[2][0])} + ${sq(T8[2][1])}<br>IN² = ${F(T8[2][0]**2)} + ${F(T8[2][1]**2)}<br>IN² = ${F(T8[2][2]**2)}<br>IN = ${rac(F(T8[2][2]**2))}<br>IN = ${F(T8[2][2])}</p><p>IN mesure <b>${F(T8[2][2])} cm</b>.</p>
   <p><b>d.</b> TER est rectangle en R : l'hypoténuse est [TE]. D'après le théorème de Pythagore :</p><p class="calc">TE² = TR² + ER²<br>TR² = TE² − ER²<br>TR² = ${sq(T8[3][2])} − ${sq(T8[3][1])}<br>TR² = ${F(T8[3][2]**2)} − ${F(T8[3][1]**2)}<br>TR² = ${F(T8[3][0]**2)}<br>TR = ${rac(F(T8[3][0]**2))}<br>TR = ${F(T8[3][0])}</p><p>TR mesure <b>${F(T8[3][0])} cm</b>.</p>`}
 ]}
];
};
