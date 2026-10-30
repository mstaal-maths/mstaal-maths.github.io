/* 3e · chapitre 19 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres.
   Toutes les corrections sont calculées par le code (outils window.FN19 du chapitre). */
TRAIN["3e-19"] = function(){
const {ri, pick, shuf, distinct} = TR;
const {F,P,X,fx,FR,SV,mono,lin,calc,cols,prog,sq,vt,tabH,plot,RED,BLUE,GRN,D,nz,r6} = window.FN19;
const $x=X("x"), $a=X("a"), $b=X("b"), $p=X("p");
const dec1=()=>ri(11,49)/10*pick([1,-1]);
const pts=L=>L.map(([x,y,t])=>({x,y,t,dx:8,dy:-8}));

/* ===== A : reconnaître des fonctions linéaires (exercice 1) ===== */
const NAMES=["f","g","h","i","j","k"];
const A=shuf([
  ()=>{ const a=nz(-9,9); return [mono(a),F(a)]; },
  ()=>{ const a=dec1(); return [`${$x} × ${P(a)}`,F(a)]; },
  ()=>{ const a=dec1(); return [mono(a),F(a)]; },
  ()=>{ const p=ri(1,8), q=pick([3,5,7,9].filter(v=>v!==p)); return [`{${p}/${q}}${$x}`,`{${p}/${q}}`]; },
  ()=>{ const a=ri(2,9), b=ri(1,9); return [lin(a,b),null]; },
  ()=>{ const b=ri(1,9); return [`${b} + ${$x}`,null]; },
  ()=>{ const a=ri(2,9); return [`${F(a)}${sq($x)}`,null]; }
]).slice(0,6).map((g,i)=>{ const [e,c]=g(); return [`${fx(NAMES[i])} = ${e}`,c]; });

/* ===== B : une situation de proportionnalité (exercice 2, situation 1) ===== */
const B=(()=>{ const pc=ri(201,699), p=pc/100, u=ri(11,39)/10; const m1=ri(3,9), m2=ri(51,99)/10, v=ri(21,49)/10;
  return {p, u, m1, m2, v, P1:r6(p*m1), P2:r6(p*m2), Pv:r6(p*v), Pu:r6(p*u)}; })();
const FRUIT=pick(["cerises","fraises","abricots","pêches","pommes"]);

/* ===== C : image et antécédent par une fonction linéaire (exercice 2, situation 2) ===== */
const C=(()=>{ const a=dec1(), x=dec1(), x2=ri(11,49)/10*pick([1,-1]); return {a,x,y:r6(a*x),x2,y2:r6(a*x2)}; })();

/* ===== D : représenter une fonction linéaire (exercice 3) ===== */
const Dk=pick([-3,-2,-1.5,-0.5,0.5,1.5,2,3]);

/* ===== E : reconnaître des fonctions affines (exercice 5) ===== */
const EN=["f","g","h","i","j","k","l","m"];
const E=shuf([
  ()=>{ const a=nz(-9,9), b=nz(-9,9); return [lin(a,b),"Oui",F(a),F(b)]; },
  ()=>{ const a=dec1(), b=nz(-9,9); return [lin(a,b),"Oui",F(a),F(b)]; },
  ()=>{ const a=ri(2,9), b=ri(1,9); return [`${b} + ${mono(a)}`,"Oui",F(a),F(b)]; },
  ()=>{ const a=ri(2,9), b=ri(1,9); return [`${F(a)}${sq($x)} + ${b}`,`Non (il y a ${sq($x)})`,"—","—"]; },
  ()=>{ const b=ri(1,9); return [`<span class="fr"><span>1</span><span>${$x}</span></span> + ${b}`,`Non (${$x} est au dénominateur)`,"—","—"]; },
  ()=>{ const p=ri(1,8), q=pick([3,5,7,9].filter(v=>v!==p)), b=ri(1,9); return [`{${p}/${q}}${$x} − ${b}`,"Oui",`{${p}/${q}}`,F(-b)]; },
  ()=>{ const a=nz(-9,9); return [mono(a),"Oui (linéaire)",F(a),"0"]; },
  ()=>{ const b=nz(-9,9); return [F(b),"Oui (constante)","0",F(b)]; }
]).map((g,i)=>{ const [e,...r]=g(); return [`${fx(EN[i])} = ${e}`,...r]; });

/* ===== F : programme de calcul (exercice 6, situation 1) ===== */
const Fp=(()=>{ const m=pick([-9,-8,-7,-6,-5,-4,-3,-2,-1,2,3,4,5,6,7,8,9]), n=ri(1,9), s=pick([1,-1]); const b=s*n, x0=nz(-9,9); let y; do{ y=nz(-20,20); }while(m===0||y===b);
  return {m, n, s, b, x0, y0:m*x0+b, y, ant:SV(y-b,m), ok:(y-b)%m===0}; })();
/* ===== G : image d'une fraction, antécédent (exercice 6, situation 2) ===== */
const G=(()=>{ const a=ri(2,9)*pick([1,-1]), b=nz(-9,9), q=pick([2,3,4,5,7]); let p; do{ p=ri(1,q*2); }while(p%q===0);
  let y; do{ y=nz(-20,20); }while(y===b); return {a,b,p,q,y}; })();
/* ===== H : tableau de valeurs et représentation (activité 2) ===== */
const H=(()=>{ const a=pick([-3,-2,-1,1,2,3]), b=nz(-4,4); return {a,b,xs:[-2,0,1]}; })();

/* ===== I : de la représentation graphique à l'expression (exercice 7) ===== */
const LN=["(d1)","(d2)","(d3)","(d4)"], COL=[RED,BLUE,GRN,"#8a4fbf"];
const I=distinct(4,()=>{ const lin0=Math.random()<0.4; return [nz(-3,3), lin0?0:nz(-3,3)]; },v=>v.join(","));
const Iorder=shuf([0,1,2,3]);           /* Iorder[k] = indice de la fonction tracée sous le nom LN[k] */
const Ifig=plot({x:[-3,3],y:[-7,7],u:46,v:20,ys:2,c:Iorder.map((fi,k)=>D(I[fi][0],I[fi][1],{col:COL[k]})),
  lab:(()=>{ const placed=[], PX=46, PY=20; return Iorder.map((fi,k)=>{ const [a,b]=I[fi]; let best=[0,b+0.9], bs=-1;
    for(let x=-2.7;x<=2.71;x+=0.1){ const y=a*x+b; if(Math.abs(y)>5.9) continue; const lx=x, ly=y+0.9; let d=1e9;
      Iorder.forEach((fj,j)=>{ if(j===k) return; const [c,e]=I[fj]; for(let t=-3;t<=3.001;t+=0.05){ const dd=Math.hypot((t-lx)*PX,(c*t+e-ly-0.4)*PY); if(dd<d) d=dd; } });
      placed.forEach(([px,py])=>{ const dd=Math.hypot((px-lx)*PX,(py-ly)*PY)/1.5; if(dd<d) d=dd; });
      d=Math.min(d, Math.abs(lx)*PX+4);
      if(d>bs){ bs=d; best=[lx,ly]; } }
    placed.push(best); return {x:best[0],y:best[1],t:LN[k],col:COL[k]}; }); })(),
  xl:"x",yl:"y",alt:"Quatre droites nommées (d1), (d2), (d3) et (d4)"});
const IN=["f","g","h","j"];

return [
 {t:"Fonctions linéaires", e:[
  {n:"Exercice 1", t:"Reconnaître des fonctions linéaires", w:"Sur ta feuille", h:`<p>Entoure les fonctions linéaires et, pour celles-ci, indique leur coefficient.</p>${cols(A.map(r=>r[0]))}`,
   c:tabH(["Fonction","Linéaire ?","Coefficient"],A.map(([e,c])=>[e,c===null?"Non":"Oui",c===null?"—":c]))},
  {n:"Exercice 2", t:"Une situation de proportionnalité", w:"Sur ton cahier", h:`<p>Des ${FRUIT} sont vendu${FRUIT==="cerises"||FRUIT==="fraises"||FRUIT==="pêches"||FRUIT==="pommes"?"e":""}s à ${F(B.p)} € le kilo. On note ${$p} la fonction qui, à la masse ${$x} (en kg), associe le prix à payer (en €).</p>
<p><b>1 –</b> Complète le tableau suivant.</p>${vt($x,[0,1,B.u,"",""],fx("p"),["","","",F(B.P1),F(B.P2)])}
<p><b>2 –</b> Vérifie que ${fx("p",F(B.v))} = ${F(B.Pv)}. Interprète cette valeur.</p>
<p><b>3 –</b> a) Donne la relation algébrique de la fonction ${$p}. b) La fonction ${$p} est-elle linéaire ? Si oui, indique son coefficient.</p>`,
   c:`<p><b>1 –</b></p>${vt($x,[0,1,B.u,B.m1,B.m2],fx("p"),[0,F(B.p),F(B.Pu),F(B.P1),F(B.P2)])}<p class="calc">${F(B.p)} × ${F(B.u)} = ${F(B.Pu)}<br>${F(B.P1)} ÷ ${F(B.p)} = ${F(B.m1)}<br>${F(B.P2)} ÷ ${F(B.p)} = ${F(B.m2)}</p>
<p><b>2 –</b></p><p class="calc">${fx("p",F(B.v))} = ${F(B.p)} × ${F(B.v)}<br>${fx("p",F(B.v))} = ${F(B.Pv)}</p><p>${F(B.v)} kg coûtent ${F(B.Pv)} €${Math.abs(B.Pv*100-Math.round(B.Pv*100))>1e-6?` (environ ${F(Math.round(B.Pv*100)/100)} €)`:""}.</p>
<p><b>3 –</b> a) ${fx("p")} = ${F(B.p)}${$x}</p><p>b) Oui, ${$p} est une fonction linéaire de coefficient ${F(B.p)}.</p>`},
  {n:"Exercice 3", t:"Image et antécédent", w:"Sur ton cahier", h:`<p>On note ${X("f")} la fonction linéaire telle que ${fx("f")} = ${mono(C.a)}.</p>
<p><b>1 –</b> Calcule l'image de ${F(C.x)} par la fonction ${X("f")}.</p><p><b>2 –</b> Calcule l'antécédent de ${F(C.y2)} par la fonction ${X("f")}.</p>`,
   c:`<p><b>1 –</b></p>${calc([`${fx("f",F(C.x))} = ${F(C.a)} × ${P(C.x)}`,`${fx("f",F(C.x))} = ${F(C.y)}`])}<p>L'image de ${F(C.x)} est ${F(C.y)}.</p>
<p><b>2 –</b> On cherche ${$x} tel que ${fx("f")} = ${F(C.y2)}.</p>${calc([`${mono(C.a)} = ${F(C.y2)}`,[`${$x} = ${F(C.y2)} ÷ ${P(C.a)}`,"÷ "+P(C.a)],`${$x} = ${F(C.x2)}`])}<p>L'antécédent de ${F(C.y2)} est ${F(C.x2)}.</p>`},
  {n:"Exercice 4", t:"Représenter une fonction linéaire", w:"Sur ton cahier", h:`<p>Représente graphiquement la fonction ${fx("f")} = ${mono(Dk)} (${$x} de −3 à 3).</p>`,
   c:`<p>${X("f")} est linéaire : sa droite passe par l'origine.</p><p class="calc">${fx("f","2")} = ${F(Dk)} × 2<br>${fx("f","2")} = ${F(2*Dk)}</p><p>On place (0 ; 0) et (2 ; ${F(2*Dk)}).</p>
${plot({x:[-3,3],y:[-9,9],u:40,v:14,ys:2,gy:1,c:[D(Dk,0)],p:pts([[0,0],[2,2*Dk]]),xl:"x",yl:fx("f"),alt:`Droite de f(x) = ${F(Dk)}x passant par l'origine et par (2 ; ${F(2*Dk)})`})}
<p>${Dk>0?"Le coefficient est positif : la droite « monte ».":"Le coefficient est négatif : la droite « descend »."}</p>`}
 ]},
 {t:"Fonctions affines", e:[
  {n:"Exercice 5", t:"Reconnaître des fonctions affines", w:"Sur ta feuille", h:`<p>Entoure les fonctions affines et, pour celles-ci, indique la valeur de ${$a} (le coefficient directeur) et la valeur de ${$b} (l'ordonnée à l'origine).</p>${cols(E.map(r=>r[0]))}`,
   c:tabH(["Fonction","Affine ?",$a,$b],E)},
  {n:"Exercice 6", t:"Un programme de calcul", w:"Sur ton cahier", h:`${prog("",["Choisir un nombre",`Multiplier le nombre par ${F(Fp.m)}`,Fp.s>0?`Ajouter ${Fp.n}`:`Soustraire ${Fp.n}`])}
<p>On note ${X("h")} la fonction qui, au nombre choisi, associe le résultat du programme.</p>
<p><b>1 –</b> Donne l'expression algébrique de la fonction affine ${X("h")}.</p><p><b>2 –</b> Quelle est l'image de ${F(Fp.x0)} par ${X("h")} ?</p><p><b>3 –</b> Quel est l'antécédent de ${F(Fp.y)} par ${X("h")} ?</p>`,
   c:`<p><b>1 –</b> ${$x} → ${mono(Fp.m)} → ${lin(Fp.m,Fp.b)}. Donc ${fx("h")} = ${lin(Fp.m,Fp.b)}.</p>
<p><b>2 –</b></p>${calc([`${fx("h",F(Fp.x0))} = ${F(Fp.m)} × ${P(Fp.x0)} ${Fp.b<0?"−":"+"} ${Fp.n}`,`${fx("h",F(Fp.x0))} = ${F(Fp.m*Fp.x0)} ${Fp.b<0?"−":"+"} ${Fp.n}`,`${fx("h",F(Fp.x0))} = ${F(Fp.y0)}`])}
<p><b>3 –</b> On résout ${fx("h")} = ${F(Fp.y)}.</p>${calc([`${lin(Fp.m,Fp.b)} = ${F(Fp.y)}`,[`${mono(Fp.m)} = ${F(Fp.y-Fp.b)}`,(Fp.b>0?"− ":"+ ")+Fp.n],...(Fp.m===1?[]:[[`${$x} = ${Fp.ok?F((Fp.y-Fp.b)/Fp.m):Fp.ant}`,"÷ "+P(Fp.m)]])])}<p>L'antécédent de ${F(Fp.y)} est ${Fp.ant}.</p>`},
  {n:"Exercice 7", t:"Image d'une fraction et antécédent", w:"Sur ton cahier", h:`<p>On a la fonction affine ${X("g")} telle que ${fx("g")} = ${F(G.b)} ${G.a<0?"−":"+"} ${mono(Math.abs(G.a))}.</p>
<p><b>1 –</b> Quelle est l'image de {${G.p}/${G.q}} par la fonction ${X("g")} ?</p><p><b>2 –</b> Quel est l'antécédent de ${F(G.y)} par la fonction ${X("g")} ?</p>`,
   c:`<p><b>1 –</b></p>${calc([`${fx("g",`{${G.p}/${G.q}}`)} = ${F(G.b)} ${G.a<0?"−":"+"} ${Math.abs(G.a)} × {${G.p}/${G.q}}`,`${fx("g",`{${G.p}/${G.q}}`)} = ${G.b<0?"−":""}{${Math.abs(G.b*G.q)}/${G.q}} ${G.a<0?"−":"+"} {${Math.abs(G.a)*G.p}/${G.q}}`,...(()=>{ const n=G.b*G.q+G.a*G.p, raw=(n<0?"−":"")+`{${Math.abs(n)}/${G.q}}`; return FR(n,G.q)===raw?[]:[`${fx("g",`{${G.p}/${G.q}}`)} = ${raw}`]; })(),`${fx("g",`{${G.p}/${G.q}}`)} = ${FR(G.b*G.q+G.a*G.p,G.q)}`])}<p>L'image de {${G.p}/${G.q}} est ${SV(G.b*G.q+G.a*G.p,G.q)}.</p>
<p><b>2 –</b> On résout ${fx("g")} = ${F(G.y)}.</p>${calc([`${F(G.b)} ${G.a<0?"−":"+"} ${mono(Math.abs(G.a))} = ${F(G.y)}`,[`${mono(G.a)} = ${F(G.y-G.b)}`,(G.b>0?"− ":"+ ")+F(Math.abs(G.b))],[`${$x} = ${SV(G.y-G.b,G.a)}`,"÷ "+P(G.a)]])}<p>L'antécédent de ${F(G.y)} est ${SV(G.y-G.b,G.a)}.</p>`},
  {n:"Exercice 8", t:"Tableau de valeurs et représentation graphique", w:"Sur ton cahier", h:`<p>Soit ${X("f")} la fonction telle que ${fx("f")} = ${lin(H.a,H.b)}.</p>
<p><b>1 –</b> Complète le tableau de valeurs.</p>${vt($x,H.xs,fx("f"),["","",""])}<p><b>2 –</b> Trace la représentation graphique de la fonction ${X("f")}.</p>`,
   c:`<p><b>1 –</b></p>${vt($x,H.xs,fx("f"),H.xs.map(x=>H.a*x+H.b))}<div class="calcs">${H.xs.map(x=>`<p class="calc">${fx("f",F(x))} = ${H.a===1?F(x):`${F(H.a)} × ${P(x)}`} ${H.b<0?"−":"+"} ${F(Math.abs(H.b))}<br>${fx("f",F(x))} = ${F(H.a*x+H.b)}</p>`).join("")}</div>
<p><b>2 –</b> On place les points du tableau et on trace la droite. Elle coupe l'axe des ordonnées en ${F(H.b)} (l'ordonnée à l'origine) et elle ${H.a>0?"« monte » (a &gt; 0)":"« descend » (a &lt; 0)"}.</p>
${plot({x:[-3,3],y:[-11,11],u:40,v:12,ys:2,gy:1,c:[D(H.a,H.b)],p:pts(H.xs.map(x=>[x,H.a*x+H.b])),xl:"x",yl:fx("f"),alt:`Droite de f(x) = ${F(H.a)}x + ${F(H.b)}`})}`}
 ]},
 {t:"De la droite à l'expression", e:[
  {n:"Exercice 9", t:"De la représentation graphique à l'expression algébrique", w:"Sur ta feuille", h:`${Ifig}<p>Chacune des droites représente une des quatre fonctions ci-dessous. Écris le nom de la droite qui représente chaque fonction.</p>${cols(I.map(([a,b],i)=>`${fx(IN[i])} = ${lin(a,b)}`))}`,
   c:tabH(["Fonction","Droite","Pourquoi"],I.map(([a,b],i)=>[`${fx(IN[i])} = ${lin(a,b)}`,LN[Iorder.indexOf(i)],
     `${b===0?"elle passe par l'origine":`elle coupe l'axe des ordonnées en ${F(b)}`} ; ${a>0?"elle monte":"elle descend"} de ${F(Math.abs(a))} quand ${$x} augmente de 1`]))}
 ]}
];
};
