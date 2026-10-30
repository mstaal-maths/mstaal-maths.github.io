/* 3e · chapitre 10 — fiche d'entraînement : les exercices de M. Staal (agrandissement, réduction, triangles semblables)
   avec d'autres nombres. Triangles dessinés à partir des longueurs (window.G3k10). */
TRAIN["3e-10"] = function(){
const {ri, pick, shuf} = TR;
const {F, ang, fig, triSVG, NOMS3, Fr} = window.G3k10;
const r3=x=>Math.round(x*1000)/1000;

/* 1. agrandir / réduire */
const T1=(()=>{ const s=pick([[2,3,4],[3,4,5],[2.5,3,4.5],[1.5,2,3]]), k=pick([2,3,1.5,2.5]), k2=pick([0.5,0.4,0.6]); return {s,k,k2}; })();
const R2=(()=>{ const L=ri(6,15), l=ri(3,L-1), k=pick([0.5,0.6,0.4,0.8,1.5,2.5]); return {L,l,k,L2:r3(k*L),l2:r3(k*l)}; })();
const P3=(()=>{ const ord=pick([[3,4.5,6],[2,3,4],[4,5,8]]), big=pick([84,105,120,90,150]); const k=r3(big/ord[2]); return {ord,big,k}; })();
const M4=(()=>{ const c=ri(200,450)/10, h=ri(150,300)/10, k=pick([0.01,0.008,0.005,0.02]); return {c,h,k}; })();
const Fo=(()=>{ const reel=pick([2,4,5,8]), des=pick([3,4,5,6,8,10]); return {reel, des, k:r3(des*10/reel)}; })();

/* 2. aires et volumes */
const AV=[(()=>{ const A=ri(2,15)*10, k=pick([0.6,0.5,0.4,1.5,2]); return {A,k}; })(), (()=>{ const V0=pick([1.2,2.4,3,4.8,0.8]), k=pick([2,2.5,3,1.5]); return {V0,k}; })(), (()=>{ const a=pick([1,4,9,2,3]), k=pick([3,4,5,6,10]); return {a,k}; })(), (()=>{ const V0=pick([40,60,80,120]), n=pick([10,20,25,50]); return {V0,n}; })()];

/* 3. triangles semblables : longueurs */
const SL=[0,1].map(i=>{ const base=pick([[2,3,4],[3,4,5],[4,5,6],[2,2.5,4],[3,5,7],[1.4,2,3.2]]), k=pick([1.5,1.7,2,2.5,0.4,1.2]); const yes=i===0?Math.random()<0.5:Math.random()<0.5; const s2=base.map(x=>r3(x*k)); if(!yes) s2[1]=r3(s2[1]+pick([0.1,0.2,-0.1,0.25])); return {base,s2,yes,n:shuf(NOMS3).slice(0,2)}; });
const CL=(()=>{ const s=pick([[3.5,6.5,4],[2,5,4],[3,6,7.5],[2.4,3.2,4]]), k=pick([2.5,1.5,2,0.5]); return {s,k}; })();

/* 4. triangles semblables : angles */
const AN=(()=>{ const a=ri(30,80), b=ri(25,70), c=180-a-b; return {a,b,c}; })();
const AI=(()=>{ const t=ri(35,75), base=(180-t)/2; const side=ri(15,35)/10, k=pick([0.5,0.6,0.7,0.8,1.5,2]); return {t,base,side,k,s2:r3(side*k)}; })();

const [nA,nB]=shuf(NOMS3).slice(0,2);
return [
 {t:"Agrandir ou réduire", e:[
  {n:"Exercice 1", t:"Calculer des longueurs", w:"Sur ton cahier", h:`<p>Le triangle TIN a pour côtés TN = ${F(T1.s[0])} cm, TI = ${F(T1.s[1])} cm et NI = ${F(T1.s[2])} cm.</p><p><b>a)</b> Le triangle ZOP est un agrandissement de TIN de rapport ${F(T1.k)}. Calcule ses côtés.</p><p><b>b)</b> Le triangle SUR est une réduction de TIN de rapport ${F(T1.k2)}. Calcule ses côtés.</p>`,
   c:`<p><b>a)</b></p><div class="calcs">${T1.s.map((x,i)=>`<p class="calc">${["ZP","ZO","PO"][i]} = ${F(T1.k)} × ${F(x)}<br>${["ZP","ZO","PO"][i]} = ${F(r3(T1.k*x))} cm</p>`).join("")}</div><p><b>b)</b></p><div class="calcs">${T1.s.map((x,i)=>`<p class="calc">${["SR","SU","RU"][i]} = ${F(T1.k2)} × ${F(x)}<br>${["SR","SU","RU"][i]} = ${F(r3(T1.k2*x))} cm</p>`).join("")}</div>`},
  {n:"Exercice 2", t:"Retrouver le rapport", w:"Sur ton cahier", h:`<p>Le rectangle LOIN (${F(R2.L2)} cm sur ${F(R2.l2)} cm) est ${R2.k>1?"un agrandissement":"une réduction"} du rectangle EFGH (${R2.L} cm sur ${R2.l} cm).</p><p>Calcule le rapport ${R2.k>1?"d'agrandissement":"de réduction"}.</p>`,
   c:`<p class="calc">k = ${Fr(F(R2.L2),R2.L)}<br>k = ${F(R2.k)}</p><p class="calc">${Fr(F(R2.l2),R2.l)} = ${F(R2.k)}</p><p>Le rapport est <b>${F(R2.k)}</b>.</p>`},
  {n:"Exercice 3", t:"Projection au tableau", w:"Sur ton cahier", h:`<p>Sur l'ordinateur, le triangle FGH est tel que FG = ${F(P3.ord[0])} cm, FH = ${F(P3.ord[1])} cm et GH = ${F(P3.ord[2])} cm.</p><p>Sur le tableau, GH = ${P3.big} cm.</p><p><b>a)</b> Quel est le rapport d'agrandissement ?</p><p><b>b)</b> Calcule FH et FG sur le tableau.</p>`,
   c:`<p><b>a)</b></p><p class="calc">k = ${Fr(P3.big,F(P3.ord[2]))}<br>k = <b>${F(P3.k)}</b></p><p><b>b)</b></p><div class="calcs"><p class="calc">FH = ${F(P3.k)} × ${F(P3.ord[1])}<br>FH = <b>${F(r3(P3.k*P3.ord[1]))} cm</b></p><p class="calc">FG = ${F(P3.k)} × ${F(P3.ord[0])}<br>FG = <b>${F(r3(P3.k*P3.ord[0]))} cm</b></p></div>`},
  {n:"Exercice 4", t:"Maquette", w:"Sur ton cahier", h:`<p>Une pyramide régulière à base carrée a pour côté ${F(M4.c)} m et pour hauteur ${F(M4.h)} m.</p><p>On réalise une maquette de rapport ${F(M4.k)}.</p><p>Calcule le côté et la hauteur de la maquette, en cm.</p>`,
   c:`<p>Côté c de la maquette :</p><p class="calc">c = ${F(M4.k)} × ${F(M4.c)}<br>c = ${F(M4.k*M4.c,6)} m<br>c = <b>${F(r3(M4.k*M4.c*100),3)} cm</b></p><p>Hauteur h de la maquette :</p><p class="calc">h = ${F(M4.k)} × ${F(M4.h)}<br>h = ${F(M4.k*M4.h,6)} m<br>h = <b>${F(r3(M4.k*M4.h*100),3)} cm</b></p>`},
  {n:"Exercice 5", t:"Image agrandie", w:"Sur ton cahier", h:`<p>Sur un dessin, un insecte mesure ${Fo.des} cm. En réalité, il mesure ${Fo.reel} mm.</p><p>Quel est le rapport d'agrandissement du dessin ?</p>`,
   c:`<p>${Fo.des} cm = ${Fo.des*10} mm.</p><p class="calc">k = ${Fr(Fo.des*10,Fo.reel)}<br>k = ${F(Fo.k)}</p>`}
 ]},
 {t:"Effets sur les aires et les volumes", e:[
  {n:"Exercice 6", t:"Quatre problèmes", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> un rectangle a une aire de ${AV[0].A} cm². On ${AV[0].k>1?"l'agrandit":"le réduit"} avec le rapport ${F(AV[0].k)}. Quelle est l'aire du nouveau rectangle ?</p>
   <p><b>Problème 2 :</b> une pyramide a un volume de ${F(AV[1].V0)} dm³. On l'agrandit avec le rapport ${F(AV[1].k)}. Quel est le volume de la pyramide agrandie ?</p>
   <p><b>Problème 3 :</b> un disque a une aire de ${AV[2].a===1?"":AV[2].a}π cm². Donne la valeur exacte de l'aire de son agrandissement de rapport ${AV[2].k}.</p>
   <p><b>Problème 4 :</b> un camion a un volume de ${AV[3].V0} m³. Son jouet est une réduction de rapport ${Fr(1,AV[3].n)}. Quel est le volume du jouet, en dm³ ?</p>`,
   c:`<p><b>1)</b></p><p class="calc">A = ${AV[0].A} × ${F(AV[0].k)}²<br>A = ${AV[0].A} × ${F(r3(AV[0].k**2))}<br>A = <b>${F(r3(AV[0].A*AV[0].k**2))} cm²</b></p>
   <p><b>2)</b></p><p class="calc">V = ${F(AV[1].V0)} × ${F(AV[1].k)}³<br>V = ${F(AV[1].V0)} × ${F(r3(AV[1].k**3))}<br>V = <b>${F(r3(AV[1].V0*AV[1].k**3))} dm³</b></p>
   <p><b>3)</b> ${AV[2].a===1?"":AV[2].a}π × ${AV[2].k}² = <b>${AV[2].a*AV[2].k**2}π cm²</b>.</p>
   <p><b>4)</b></p><p class="calc">V = ${AV[3].V0} × (${Fr(1,AV[3].n)})³<br>V = ${Fr(AV[3].V0,TR.sp(AV[3].n**3))} m³<br>V = ${F(AV[3].V0/AV[3].n**3,8)} m³<br>V = <b>${F(r3(AV[3].V0*1000/AV[3].n**3),6)} dm³</b></p>`}
 ]},
 {t:"Triangles semblables : longueurs", e:[
  {n:"Exercice 7", t:"Semblables ou pas ?", w:"Sur ton cahier", h:SL.map((x,i)=>`<p><b>${"ab"[i]})</b> Le triangle ${x.n[0]} a pour côtés ${x.base.map(v=>F(v)).join(" cm ; ")} cm et le triangle ${x.n[1]} a pour côtés ${x.s2.map(v=>F(v)).join(" cm ; ")} cm. Sont-ils semblables ? Justifie.</p>`).join(""),
   c:SL.map((x,i)=>{ const q=x.s2.map((y,j)=>r3(y/x.base[j])); return `<p><b>${"ab"[i]})</b> ${x.s2.map((y,j)=>`${Fr(F(y),F(x.base[j]))} ${Math.abs(y/x.base[j]-q[j])<1e-9?"=":"≈"} ${F(q[j])}`).join(" ; ")}. ${x.yes?"Les quotients sont égaux : <b>les triangles sont semblables</b>.":"Les quotients ne sont pas tous égaux : <b>les triangles ne sont pas semblables</b>."}</p>`; }).join("")},
  {n:"Exercice 8", t:"Calculer une longueur", w:"Sur ton cahier", h:`<p>Les triangles MER et CLA sont semblables. Sommets homologues : M et C ; E et L ; R et A.</p><p>On donne ME = ${F(r3(CL.s[0]*CL.k))} cm, ER = ${F(r3(CL.s[1]*CL.k))} cm, CL = ${F(CL.s[0])} cm et CA = ${F(CL.s[2])} cm.</p><p><b>a)</b> Écris trois rapports de longueurs égaux.</p><p><b>b)</b> Calcule MR et LA.</p>`,
   c:`<p><b>a)</b> ${Fr("ME","CL")} = ${Fr("ER","LA")} = ${Fr("MR","CA")}</p><p><b>b)</b></p><p class="calc">k = ${Fr("ME","CL")}<br>k = ${Fr(F(r3(CL.s[0]*CL.k)),F(CL.s[0]))}<br>k = ${F(CL.k)}</p><p>Donc :</p><div class="calcs"><p class="calc">MR = ${F(CL.k)} × ${F(CL.s[2])}<br>MR = <b>${F(r3(CL.k*CL.s[2]))} cm</b></p><p class="calc">LA = ${F(r3(CL.s[1]*CL.k))} ÷ ${F(CL.k)}<br>LA = <b>${F(CL.s[1])} cm</b></p></div>`}
 ]},
 {t:"Triangles semblables : angles", e:[
  {n:"Exercice 9", t:"Prouver avec les angles", w:"Sur ton cahier", h:`<p>Dans le triangle ${nA}, ${ang(nA[1]+nA[0]+nA[2])} = ${AN.a}° et ${ang(nA[0]+nA[1]+nA[2])} = ${AN.b}°.</p><p>Dans le triangle ${nB}, ${ang(nB[1]+nB[0]+nB[2])} = ${AN.a}° et ${ang(nB[0]+nB[2]+nB[1])} = ${AN.c}°.</p><p>Prouve que ces deux triangles sont semblables.</p>`,
   c:`<p>Dans ${nA} :</p><p class="calc">${ang(nA[0]+nA[2]+nA[1])} = 180° − ${AN.a}° − ${AN.b}°<br>${ang(nA[0]+nA[2]+nA[1])} = ${AN.c}°</p><p>Donc ${ang(nA[1]+nA[0]+nA[2])} = ${ang(nB[1]+nB[0]+nB[2])} = ${AN.a}° et ${ang(nA[0]+nA[2]+nA[1])} = ${ang(nB[0]+nB[2]+nB[1])} = ${AN.c}° : les deux triangles ont deux angles deux à deux de même mesure, <b>ils sont semblables</b>.</p>`},
  {n:"Exercice 10", t:"Triangles isocèles", w:"Sur ton cahier", h:`<p>ABC est un triangle tel que ${ang("BAC")} = ${ang("BCA")} = ${F(AI.base)}° et AB = ${F(AI.side)} cm.</p><p>DEF est un triangle isocèle en E tel que ${ang("DEF")} = ${AI.t}° et DE = ${F(AI.s2)} cm.</p><p><b>a)</b> Explique pourquoi les triangles ABC et DEF sont semblables.</p><p><b>b)</b> Donne le rapport qui permet de passer du triangle ABC au triangle DEF.</p>`,
   c:`<p><b>a)</b> Dans ABC :</p><p class="calc">${ang("ABC")} = 180° − 2 × ${F(AI.base)}°<br>${ang("ABC")} = ${AI.t}°</p><p>DEF est isocèle en E, donc ${ang("EDF")} = ${ang("EFD")}.</p><p class="calc">${ang("EDF")} = (180° − ${AI.t}°) ÷ 2<br>${ang("EDF")} = ${F(AI.base)}°</p><p>Les angles sont deux à deux de même mesure : <b>les triangles sont semblables</b>.</p><p><b>b)</b> B et E sont homologues, A et D aussi :</p><p class="calc">k = ${Fr("DE","AB")}<br>k = ${Fr(F(AI.s2),F(AI.side))}<br>k = <b>${F(AI.k)}</b></p>`}
 ]}
];
};
