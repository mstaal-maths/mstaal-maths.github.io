/* 3e · chapitre 12 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres.
   Courbes tracées à partir des formules ; images et antécédents calculés par le code (outils window.FN12). */
TRAIN["3e-12"] = function(){
const {ri, pick, shuf, distinct} = TR;
const {F,P,X,fx,FR,SV,mono,lin,calc,ch,cols,prog,sq,vt,tabH,brk,sols,plot} = window.FN12;
const $x=X("x"), $f=X("f"), $g=X("g"), $h=X("h");
const nz=(a,b)=>{ let v; do{ v=ri(a,b); }while(v===0); return v; };
const L="abcdefgh";
const sg=b=>b<0?"−":"+";
const pts=(K)=>K.map(([x,y])=>({x,y}));

/* ===== Activité 1 : tableaux de valeurs ===== */
const k1=ri(2,7), c1=ri(1,9), x2=distinct(4,()=>ri(-6,9),v=>v).sort((a,b)=>a-b), x3=distinct(4,()=>ri(-4,4),v=>v).sort((a,b)=>a-b), x4=distinct(4,()=>ri(2,12),v=>v).sort((a,b)=>a-b);
const nomK=["","","double","triple","quadruple","quintuple","sextuple","septuple"][k1];

/* ===== Exercice 1 : trois fonctions sous trois aspects ===== */
const a1=-ri(2,4), b1=ri(1,6), xf=distinct(4,()=>ri(-3,3),v=>v).sort((a,b)=>a-b);
const p1=ri(1,3), q1=ri(1,5), xg=[-p1-3,-p1,0,1].filter((v,i,A)=>A.indexOf(v)===i);
const xh=distinct(3,()=>ri(1,9),v=>v).sort((a,b)=>a-b);
const fE1=x=>a1*x+b1, gE1=x=>(x+p1)**2-q1;
const yfs=[...xf.map(fE1)], ygs=[...xg.map(gE1)];

/* ===== Exercices 2 et 3 : lire dans un tableau ===== */
const E2=(()=>{ const t=[1,2,4,6], d=[ri(3,5)]; d.push(d[0]+ri(2,3)); d.push(d[1]-ri(1,d[1]-d[0]-1)); d.push(ri(12,20)); return {t,d}; })();
const E3=(()=>{ for(let g=0; g<500; g++){ const xs=[-1,0,1,2,3,4], ys=xs.map(()=>ri(-3,6)); const cnt=v=>ys.filter(y=>y===v).length;
    const dbl=ys.filter(y=>cnt(y)===2), uni=ys.filter(y=>cnt(y)===1); if(new Set(dbl).size===1 && uni.length===4) return {xs,ys,d:dbl[0],u:uni}; }
  return {xs:[-1,0,1,2,3,4], ys:[2,5,-1,5,0,3], d:5, u:[2,-1,0,3]}; })();

/* ===== Exercice 4 : calculs d'images ===== */
const E4=(()=>{ const a=ri(2,6), b=nz(-9,9), u=ri(1,4), v=nz(-5,9), p=ri(1,4), k=ri(2,4), s=ri(2,6), m=ri(2,6); return {a,b,u,v,p,k,s,m, x1:ri(2,5), x2:-ri(2,6), x3:ri(2,4), x4:-ri(2,5), x5:ri(3,6), x6:-ri(2,5), x7:-ri(5,9)}; })();

/* ===== Lecture sur une courbe : ligne brisée (x de −4 à 4, y entiers, pas de ±1 ou ±2) ===== */
function broken(){ for(let g=0; g<500; g++){ const K=[]; let y=ri(-2,2); for(let x=-4;x<=4;x++){ K.push([x,y]); y+=pick([-2,-1,1,2]); if(y>4) y-=3; if(y<-4) y+=3; }
    if(K.some((k,i)=>i&&Math.abs(k[1]-K[i-1][1])>2)) continue; const ys=K.map(k=>k[1]); let yq=null;
    for(const t of shuf([-3,-2,-1,0,1,2,3])){ if(!ys.includes(t)){ const s=sols(brk(K),-4,4,t); if(s.length>=2){ yq=t; break; } } }
    if(yq===null) continue; return {K, f:brk(K), yq, s:sols(brk(K),-4,4,yq)}; } return null; }
const C12=broken(), C7=broken();
const qx=shuf([0,1,2,3,4,5,6,7,8]).slice(0,3).map(i=>C12.K[i][0]);
const pl=(C,t)=>plot({x:[-4.5,4.5],y:[-4.5,4.5],u:40,c:[{f:C.f,a:-4,b:4,ends:1}],p:pts(C.K),xl:"x",yl:fx("f"),title:t});
const kx=shuf([0,1,2,3,4,5,6,7,8]).slice(0,5).sort((a,b)=>a-b);
const yU=(()=>{ const ys=C7.K.map(k=>k[1]); const c=v=>ys.filter(y=>y===v).length; const u=kx.filter(i=>c(C7.K[i][1])===1 && !C7.K.some(k=>k[1]===C7.K[i][1]&&k!==C7.K[i]));
  return u.length? u[0] : null; })();

/* ===== Notations ===== */
const N8=(()=>{ const a=ri(2,6), b=nz(-9,9), x=-ri(2,6); return {a,b,x,y:a*x+b}; })();
const N9=(()=>{ return {n:pick(["g","h","k"]), a:nz(-9,9), b:nz(-9,9)}; })();
const N10=(()=>{ const v=distinct(8,()=>nz(-9,9),x=>x); return v; })();
const N11=(()=>{ for(let g=0; g<500; g++){ const xs=distinct(6,()=>ri(-5,12),v=>v).sort((a,b)=>a-b), ys=xs.map(()=>ri(-5,15)); const c=v=>ys.filter(y=>y===v).length;
    const dbl=ys.filter(y=>c(y)===2); if(new Set(dbl).size===1 && ys.filter(y=>c(y)>2).length===0){ const i=ys.findIndex(y=>c(y)===1), j=ys.findIndex((y,k)=>c(y)===1&&k!==i); if(j>=0) return {xs,ys,d:dbl[0],i,j}; } }
  return {xs:[-3,-2,-1,2,5,10], ys:[10,5,2,-2,10,12], d:10, i:1, j:3}; })();
const A4=(()=>{ let a,b,c; do{ a=ri(2,7); b=nz(-9,9); c=nz(-15,20); }while((c-b)%a===0); return {a,b,x:-ri(2,6),c}; })();
const E13=(()=>{ for(let g=0; g<500; g++){ const a=-ri(2,5), b=ri(1,9), k=ri(2,4), m=ri(2,4), n=ri(1,5); const c=k*m, d=-k*n; /* e(x) = k(mx − n) */
    if((d-b)%(a-c)!==0) continue; const s=(d-b)/(a-c); const y1=ri(5,15); if((y1-b)%a!==0) continue; return {a,b,k,m,n,c,d,s,y1,x0:-ri(2,5), y2:k*(m*ri(1,4)-n)}; } return null; })();
const E15=(()=>{ for(let g=0; g<500; g++){ const p=ri(2,4), q=ri(1,6), r=ri(1,4), t=ri(1,5); /* h = (p x − q)², i = (x − r)(p² x + t) */
    const A=-2*p*q, B=q*q, C=t-p*p*r, D=-r*t; if(A===C) continue; return {p,q,r,t,A,B,C,D}; } })();

return [
 {t:"Tableaux de valeurs, formules et courbes", e:[
  {n:"Activité 1", t:"Tableaux de valeurs", w:"Sur ton cahier", h:`<p>Complète les tableaux suivants. Note chaque calcul.</p>
   <p><b>Tableau 1 : le ${nomK} d'un nombre</b></p>${vt("Nombre choisi",x2,`Son ${nomK}`,x2.map(()=>""))}
   <p><b>Tableau 2 : le résultat d'un programme de calcul</b></p>${prog("Programme de calcul",["Choisir un nombre","Élever ce nombre au carré",`Soustraire ${c1}`])}${vt("Nombre de départ",x3,"Résultat",x3.map(()=>""))}
   <p><b>Tableau 3 : l'aire d'un carré (en cm²) en fonction de la longueur de son côté (en cm)</b></p>${vt("Côté (en cm)",x4,"Aire (en cm²)",x4.map(()=>""))}
   <p>Construis la courbe correspondant aux tableaux 1 et 2 (antécédents sur l'axe des abscisses, images sur l'axe des ordonnées).</p>`,
   c:`<p><b>Tableau 1 :</b> ${x2.map(v=>`${k1} × ${P(v)} = ${F(k1*v)}`).join(" · ")}</p>${vt("Nombre choisi",x2,`Son ${nomK}`,x2.map(v=>k1*v))}
   <p><b>Tableau 2 :</b> ${x3.map(v=>`${sq(P(v))} − ${c1} = ${F(v*v-c1)}`).join(" · ")}</p>${vt("Nombre de départ",x3,"Résultat",x3.map(v=>v*v-c1))}
   <p><b>Tableau 3 :</b> ${x4.map(v=>`${sq(v)} = ${v*v}`).join(" · ")}</p>${vt("Côté (en cm)",x4,"Aire (en cm²)",x4.map(v=>v*v))}
   <div class="figs">${plot({x:[Math.min(-1,x2[0])-0.5,x2[3]+0.5],y:[Math.min(0,k1*x2[0])-2,k1*x2[3]+2],u:Math.max(18,Math.round(380/(x2[3]-Math.min(-1,x2[0])+1))),v:Math.max(3,Math.round(300/(k1*x2[3]-Math.min(0,k1*x2[0])+4))),gs:1,gy:5,ys:5,xs:x2[3]-x2[0]>10?2:1,c:[{f:x=>k1*x}],p:x2.map(v=>({x:v,y:k1*v})),xl:"x",title:"Tableau 1"})}
   ${plot({x:[-4.5,4.5],y:[-c1-1,16-c1+1],u:40,v:Math.max(10,Math.round(320/(18))),gy:1,ys:2,c:[{f:x=>x*x-c1,a:-4.2,b:4.2}],p:x3.map(v=>({x:v,y:v*v-c1})),xl:"x",title:"Tableau 2"})}</div>`},
  {n:"Exercice 1", t:"Représenter des fonctions sous ces 3 aspects", w:"Sur ton cahier", h:`<p><b>1)</b> ${$f} associe à tout nombre ${$x} le résultat du programme :</p>${prog("",["Choisir un nombre",`Le multiplier par (${F(a1)})`,`Ajouter ${b1}`])}<p><b>a)</b> Donne la formule de ${$f}. <b>b)</b> Complète le tableau. <b>c)</b> Construis la courbe de ${$f}.</p>${vt("Nombre de départ",xf,"Résultat",xf.map(()=>""))}
   <p><b>2)</b> ${$g} associe à tout nombre ${$x} le résultat du programme :</p>${prog("",["Choisir un nombre",`Lui ajouter ${p1}`,"Élever le résultat au carré",`Soustraire ${q1}`])}<p><b>a)</b> Donne la formule de ${$g}. <b>b)</b> Complète le tableau. <b>c)</b> Construis la courbe de ${$g}.</p>${vt("Nombre de départ",xg,"Résultat",xg.map(()=>""))}
   <p><b>3)</b> ${$h} associe à la longueur ${$x} du côté d'un carré son périmètre. <b>a)</b> Donne la formule de ${$h}. <b>b)</b> Complète le tableau.</p>${vt("Côté (en cm)",xh,"Périmètre (en cm)",xh.map(()=>""))}`,
   c:`<p><b>1) a)</b> ${$f} : ${$x} ↦ ${lin(a1,b1)} <b>b)</b></p>${vt("Nombre de départ",xf,"Résultat",yfs)}${cols(xf.map(v=>ch(fx("f",F(v)),[`${P(v)} × (${F(a1)}) + ${b1}`,`${F(v*a1)} + ${b1}`,F(fE1(v))])))}
   ${plot({x:[-3.5,3.5],y:[Math.min(...[-3,3].map(fE1))-1,Math.max(...[-3,3].map(fE1))+1],u:44,v:Math.max(10,Math.round(320/(Math.abs(a1)*6+2))),gy:1,ys:2,c:[{f:fE1}],p:xf.map(v=>({x:v,y:fE1(v)})),xl:"x",title:"Courbe de f"})}
   <p><b>2) a)</b> ${$g} : ${$x} ↦ ${sq("("+$x+" + "+p1+")")} − ${q1} <b>b)</b></p>${vt("Nombre de départ",xg,"Résultat",ygs)}${cols(xg.map(v=>ch(fx("g",F(v)),[`${sq("("+F(v)+" + "+p1+")")} − ${q1}`,`${sq(P(v+p1))} − ${q1}`,`${(v+p1)**2} − ${q1}`,F(gE1(v))])))}
   ${plot({x:[-p1-4,2],y:[-q1-1,Math.max(...xg.map(gE1))+2],u:44,v:Math.max(8,Math.round(300/(Math.max(...xg.map(gE1))+q1+3))),gy:1,ys:2,c:[{f:gE1,a:-p1-3.6,b:1.6}],p:xg.map(v=>({x:v,y:gE1(v)})),xl:"x",title:"Courbe de g"})}
   <p><b>3) a)</b> ${$h} : ${$x} ↦ 4${$x} <b>b)</b> ${xh.map(v=>`4 × ${v} = ${4*v}`).join(" · ")}</p>${vt("Côté (en cm)",xh,"Périmètre (en cm)",xh.map(v=>4*v))}`}
 ]},
 {t:"Lire des images et des antécédents dans un tableau", e:[
  {n:"Exercice 2", t:"Lectures d'antécédents et d'images", w:"Sur ton cahier", h:`<p>Distance parcourue lors d'une randonnée en fonction du temps :</p>${vt("Temps (en h)",E2.t,"Distance (en km)",E2.d)}
   <p><b>a)</b> L'image de 1 est … <b>b)</b> L'antécédent de ${E2.d[3]} est … <b>c)</b> L'image de 4 est … <b>d)</b> L'antécédent de ${E2.d[0]} est … <b>e)</b> L'image de 2 est … <b>f)</b> L'antécédent de ${E2.d[1]} est …</p>`,
   c:`<p><b>a)</b> L'image de 1 est ${E2.d[0]}.</p><p><b>b)</b> L'antécédent de ${E2.d[3]} est 6.</p><p><b>c)</b> L'image de 4 est ${E2.d[2]}.</p><p><b>d)</b> L'antécédent de ${E2.d[0]} est 1.</p><p><b>e)</b> L'image de 2 est ${E2.d[1]}.</p><p><b>f)</b> L'antécédent de ${E2.d[1]} est 2.</p>`},
  {n:"Exercice 3", t:"Lectures d'antécédents et d'images", w:"Sur ton cahier", h:`<p>${$g} est la fonction définie par le tableau suivant :</p>${vt($x,E3.xs,`Image de ${$x} par ${$g}`,E3.ys)}
   <p><b>a)</b> L'image de 3 est … <b>b)</b> L'antécédent de ${F(E3.u[0])} est … <b>c)</b> L'image de 0 est … <b>d)</b> L'antécédent de ${F(E3.u[1])} est … <b>e)</b> L'image de −1 est … <b>f)</b> … possède deux antécédents qui sont … et …</p>`,
   c:`<p><b>a)</b> L'image de 3 est ${F(E3.ys[4])}.</p><p><b>b)</b> L'antécédent de ${F(E3.u[0])} est ${F(E3.xs[E3.ys.indexOf(E3.u[0])])}.</p><p><b>c)</b> L'image de 0 est ${F(E3.ys[1])}.</p><p><b>d)</b> L'antécédent de ${F(E3.u[1])} est ${F(E3.xs[E3.ys.indexOf(E3.u[1])])}.</p><p><b>e)</b> L'image de −1 est ${F(E3.ys[0])}.</p><p><b>f)</b> ${F(E3.d)} possède deux antécédents qui sont ${E3.xs.filter((x,i)=>E3.ys[i]===E3.d).map(F).join(" et ")}.</p>`}
 ]},
 {t:"Calculer des images", e:[
  {n:"Exercice 4", t:"Relation algébrique et calculs d'image", w:"Sur ton cahier", h:`<p><b>1 –</b> ${$h} : ${$x} ↦ ${lin(E4.a,E4.b)}. Calcule l'image de ${E4.x1}, puis celle de ${F(E4.x2)}.</p>
   <p><b>2 –</b> ${X("u")} : ${$x} ↦ ${E4.u===1?"":E4.u}${sq($x)} ${E4.v<0?"−":"+"} ${Math.abs(E4.v)}. Calcule l'image de ${E4.x3}, puis celle de ${F(E4.x4)}.</p>
   <p><b>3 –</b> ${$g} associe au nombre de départ le résultat du programme :</p>${prog("",["Choisir un nombre",`Lui soustraire ${E4.p}`,"Élever au carré",`Multiplier par ${E4.k}`])}<p><b>a)</b> Écris la relation algébrique de ${$g}. <b>b)</b> Calcule l'image de ${E4.x5}. <b>c)</b> Calcule l'image de ${F(E4.x6)}.</p>
   <p><b>4 –</b> ${$h} associe au nombre de départ le résultat de ce programme Scratch :</p>${prog("Programme Scratch",["demander « Choisis un nombre » et attendre",`mettre a à réponse + ${E4.s}`,`mettre Résultat à a * ${E4.m}`,"dire Résultat"])}<p><b>a)</b> Écris la relation algébrique de ${$h}. <b>b)</b> Calcule l'image de ${F(E4.x7)}.</p>`,
   c:`<p><b>1 –</b></p>${ch(fx("h",E4.x1),[`${E4.a} × ${E4.x1} ${sg(E4.b)} ${Math.abs(E4.b)}`,`${F(E4.a*E4.x1)} ${sg(E4.b)} ${Math.abs(E4.b)}`,F(E4.a*E4.x1+E4.b)])}${ch(fx("h",F(E4.x2)),[`${E4.a} × (${F(E4.x2)}) ${sg(E4.b)} ${Math.abs(E4.b)}`,`${F(E4.a*E4.x2)} ${sg(E4.b)} ${Math.abs(E4.b)}`,F(E4.a*E4.x2+E4.b)])}
   <p><b>2 –</b></p>${ch(fx("u",E4.x3),[`${E4.u} × ${sq(E4.x3)} ${sg(E4.v)} ${Math.abs(E4.v)}`,`${E4.u} × ${E4.x3**2} ${sg(E4.v)} ${Math.abs(E4.v)}`,F(E4.u*E4.x3**2+E4.v)])}${ch(fx("u",F(E4.x4)),[`${E4.u} × ${sq("("+F(E4.x4)+")")} ${sg(E4.v)} ${Math.abs(E4.v)}`,`${E4.u} × ${E4.x4**2} ${sg(E4.v)} ${Math.abs(E4.v)}`,F(E4.u*E4.x4**2+E4.v)])}
   <p><b>3 – a)</b> ${$g} : ${$x} ↦ ${E4.k}${sq("("+$x+" − "+E4.p+")")}</p>${ch(fx("g",E4.x5),[`${E4.k} × ${sq("("+E4.x5+" − "+E4.p+")")}`,`${E4.k} × ${sq(P(E4.x5-E4.p))}`,`${E4.k} × ${(E4.x5-E4.p)**2}`,String(E4.k*(E4.x5-E4.p)**2)])}${ch(fx("g",F(E4.x6)),[`${E4.k} × ${sq("("+F(E4.x6)+" − "+E4.p+")")}`,`${E4.k} × ${sq(P(E4.x6-E4.p))}`,`${E4.k} × ${(E4.x6-E4.p)**2}`,String(E4.k*(E4.x6-E4.p)**2)])}
   <p><b>4 – a)</b> ${$h} : ${$x} ↦ ${E4.m}(${$x} + ${E4.s})</p>${ch(fx("h",F(E4.x7)),[`${E4.m} × (${F(E4.x7)} + ${E4.s})`,`${E4.m} × ${P(E4.x7+E4.s)}`,F(E4.m*(E4.x7+E4.s))])}`}
 ]},
 {t:"Lire des images et des antécédents sur une courbe", e:[
  {n:"Exercice 7", t:"Compléter un tableau à l'aide d'une courbe", w:"Sur ton cahier", h:`<p>${$g} est la fonction définie par ce graphique.</p>${plot({x:[-4.5,4.5],y:[-4.5,4.5],u:40,c:[{f:C7.f,a:-4,b:4,ends:1}],p:pts(C7.K),xl:"x",yl:fx("g")})}<p>Complète le tableau :</p>
   ${vt($x,kx.map(i=>i===yU?"":C7.K[i][0]),fx("g"),kx.map(i=>i===yU?C7.K[i][1]:""))}`,
   c:vt($x,kx.map(i=>C7.K[i][0]),fx("g"),kx.map(i=>C7.K[i][1]))},
  {n:"Exercice 8", t:"Lire sur une courbe", w:"Sur ton cahier", h:`<p>${$f} est la fonction définie par la courbe ci-dessous.</p>${pl(C12,"Courbe représentative de f")}
   <p><b>a)</b> ${fx("f",F(qx[0]))} = … <b>b)</b> ${fx("f",F(qx[1]))} = … <b>c)</b> L'image de ${F(qx[2])} est … <b>d)</b> Le (ou les) antécédent(s) de ${F(C12.yq)} : … <b>e)</b> Le point (${F(qx[0])} ; ${F(C12.f(qx[0])+1)}) appartient-il à la courbe ?</p>`,
   c:`<p><b>a)</b> ${fx("f",F(qx[0]))} = ${F(C12.f(qx[0]))}</p><p><b>b)</b> ${fx("f",F(qx[1]))} = ${F(C12.f(qx[1]))}</p><p><b>c)</b> L'image de ${F(qx[2])} est ${F(C12.f(qx[2]))}.</p><p><b>d)</b> Les antécédents de ${F(C12.yq)} sont ${C12.s.map(F).join(" ; ")}.</p><p><b>e)</b> Non : ${fx("f",F(qx[0]))} = ${F(C12.f(qx[0]))}, et pas ${F(C12.f(qx[0])+1)}.</p>`}
 ]},
 {t:"Notations, calculs d'images et d'antécédents", e:[
  {n:"Exercice 9", t:"Calcul d'image avec la notation f(x)", w:"Sur ton cahier", h:`<p>${fx("f")} = ${lin(N8.a,N8.b)}.</p><p><b>1 –</b> Calcule ${fx("f",F(N8.x))}.</p><p><b>2 –</b> Écris deux phrases : une avec le mot « image », l'autre avec le mot « antécédent ».</p>`,
   c:`<p><b>1 –</b></p>${ch(fx("f",F(N8.x)),[`${N8.a} × (${F(N8.x)}) ${sg(N8.b)} ${Math.abs(N8.b)}`,`${F(N8.a*N8.x)} ${sg(N8.b)} ${Math.abs(N8.b)}`,F(N8.y)])}<p><b>2 –</b> L'image de ${F(N8.x)} par ${$f} est ${F(N8.y)}.</p><p>${F(N8.x)} est un antécédent de ${F(N8.y)} par ${$f}.</p>`},
  {n:"Exercice 10", t:"Traduire une notation", w:"Sur ton cahier", h:`<p>On sait que ${fx(N9.n,F(N9.a))} = ${F(N9.b)}. Traduis cette égalité par une phrase avec le mot « image », puis avec le mot « antécédent ».</p>`,
   c:`<p>L'image de ${F(N9.a)} par ${X(N9.n)} est ${F(N9.b)}.</p><p>${F(N9.a)} est un antécédent de ${F(N9.b)} par ${X(N9.n)}.</p>`},
  {n:"Exercice 11", t:"Traduire une notation", w:"Sur ton cahier", h:`${tabH(["Notation mathématique","En français"],[[`${fx("f",F(N10[0]))} = ${F(N10[1])}`,"L'image de … est …"],[`${fx("f",F(N10[2]))} = ${F(N10[3])}`,"Un antécédent de … est …"],[`${fx("f","…")} = …`,`${F(N10[4])} a pour image ${F(N10[5])}.`],[`${fx("f","…")} = …`,`${F(N10[6])} a pour antécédent ${F(N10[7])}.`]])}`,
   c:tabH(["Notation mathématique","En français"],[[`${fx("f",F(N10[0]))} = ${F(N10[1])}`,`L'image de ${F(N10[0])} est ${F(N10[1])}.`],[`${fx("f",F(N10[2]))} = ${F(N10[3])}`,`Un antécédent de ${F(N10[3])} est ${F(N10[2])}.`],[`${fx("f",F(N10[4]))} = ${F(N10[5])}`,`${F(N10[4])} a pour image ${F(N10[5])}.`],[`${fx("f",F(N10[7]))} = ${F(N10[6])}`,`${F(N10[6])} a pour antécédent ${F(N10[7])}.`]])},
  {n:"Exercice 12", t:"Nouvelles notations et tableau", w:"Sur ton cahier", h:`${vt($x,N11.xs,fx("g"),N11.ys)}<p><b>1 – a)</b> L'image de ${F(N11.xs[N11.i])} est … <b>b)</b> L'antécédent de ${F(N11.ys[N11.j])} est …</p><p><b>2 –</b> Léa affirme : « ${fx("g",F(N11.ys[N11.i]))} = ${F(N11.xs[N11.i])} ». A-t-elle raison ?</p><p><b>3 – a)</b> Lis ${fx("g",F(N11.xs[N11.j]))}. <b>b)</b> On cherche ${X("a")} tel que ${fx("g","<i>a</i>")} = ${F(N11.d)}. Donne les valeurs possibles de ${X("a")}.</p>`,
   c:`<p><b>1 – a)</b> L'image de ${F(N11.xs[N11.i])} est ${F(N11.ys[N11.i])}.</p><p><b>b)</b> L'antécédent de ${F(N11.ys[N11.j])} est ${F(N11.xs[N11.j])}.</p><p><b>2 –</b> ${N11.xs.includes(N11.ys[N11.i]) && N11.ys[N11.xs.indexOf(N11.ys[N11.i])]===N11.xs[N11.i] ? "Oui." : `Non : Léa a inversé l'antécédent et l'image. On a ${fx("g",F(N11.xs[N11.i]))} = ${F(N11.ys[N11.i])}.`}</p><p><b>3 – a)</b> ${fx("g",F(N11.xs[N11.j]))} = ${F(N11.ys[N11.j])} · <b>b)</b> ${X("a")} = ${N11.xs.filter((x,k)=>N11.ys[k]===N11.d).map(F).join(" ou ")}</p>`},
  {n:"Activité 4", t:"Calcul d'images et d'antécédents", w:"Sur ton cahier", h:`<p>${fx("d")} = ${lin(A4.a,A4.b)}.</p><p><b>1 –</b> Calcule l'image de ${F(A4.x)}.</p><p><b>2 –</b> Quel est l'antécédent de ${F(A4.c)} ?</p>`,
   c:`<p><b>1 –</b></p>${ch(fx("d",F(A4.x)),[`${A4.a} × (${F(A4.x)}) ${sg(A4.b)} ${Math.abs(A4.b)}`,`${F(A4.a*A4.x)} ${sg(A4.b)} ${Math.abs(A4.b)}`,F(A4.a*A4.x+A4.b)])}<p>L'image de ${F(A4.x)} est ${F(A4.a*A4.x+A4.b)}.</p><p><b>2 –</b> On cherche ${$x} tel que ${fx("d")} = ${F(A4.c)} : on résout une équation.</p>${calc([`${lin(A4.a,A4.b)} = ${F(A4.c)}`,[`${mono(A4.a)} = ${F(A4.c-A4.b)}`,(A4.b>0?"− ":"+ ")+Math.abs(A4.b)],[`${$x} = ${SV(A4.c-A4.b,A4.a)}`,"÷ "+A4.a]])}<p>L'antécédent de ${F(A4.c)} est ${SV(A4.c-A4.b,A4.a)}.</p>`},
  {n:"Exercice 13", t:"Calculs d'antécédents et d'images", w:"Sur ton cahier", h:`<p class="calc">${fx("d")} = ${lin(E13.a,E13.b)} &emsp; et &emsp; ${fx("e")} = ${E13.k}(${lin(E13.m,-E13.n)})</p><p><b>1 –</b> Calcule l'image de ${F(E13.x0)} par ${X("d")}, puis par ${X("e")}.</p><p><b>2 – a)</b> Quel est l'antécédent de ${E13.y1} par ${X("d")} ? <b>b)</b> Quel est l'antécédent de ${F(E13.y2)} par ${X("e")} ?</p><p><b>3 –</b> Quel même antécédent faut-il choisir pour obtenir la même image par les deux fonctions ?</p>`,
   c:`<p><b>1 –</b></p>${ch(fx("d",F(E13.x0)),[`${F(E13.a)} × (${F(E13.x0)}) + ${E13.b}`,`${F(E13.a*E13.x0)} + ${E13.b}`,F(E13.a*E13.x0+E13.b)])}${ch(fx("e",F(E13.x0)),[`${E13.k} × (${E13.m} × (${F(E13.x0)}) − ${E13.n})`,`${E13.k} × (${F(E13.m*E13.x0)} − ${E13.n})`,`${E13.k} × (${F(E13.m*E13.x0-E13.n)})`,F(E13.k*(E13.m*E13.x0-E13.n))])}
   <p><b>2 – a)</b> On cherche ${$x} tel que ${fx("d")} = ${E13.y1}.</p>${calc([`${lin(E13.a,E13.b)} = ${E13.y1}`,[`${mono(E13.a)} = ${F(E13.y1-E13.b)}`,"− "+E13.b],[`${$x} = ${F((E13.y1-E13.b)/E13.a)}`,"÷ ("+F(E13.a)+")"]])}<p>L'antécédent de ${E13.y1} par ${X("d")} est ${F((E13.y1-E13.b)/E13.a)}.</p>
   <p><b>b)</b> On développe : ${fx("e")} = ${lin(E13.c,E13.d)}. On cherche ${$x} tel que ${fx("e")} = ${F(E13.y2)}.</p>${calc([`${lin(E13.c,E13.d)} = ${F(E13.y2)}`,[`${mono(E13.c)} = ${F(E13.y2-E13.d)}`,"+ "+(-E13.d)],[`${$x} = ${F((E13.y2-E13.d)/E13.c)}`,"÷ "+E13.c]])}<p>L'antécédent de ${F(E13.y2)} par ${X("e")} est ${F((E13.y2-E13.d)/E13.c)}.</p>
   <p><b>3 –</b> On cherche ${$x} tel que ${fx("d")} = ${fx("e")}.</p>${calc([`${lin(E13.a,E13.b)} = ${lin(E13.c,E13.d)}`,[`${mono(E13.a-E13.c)} + ${E13.b} = ${F(E13.d)}`,"− "+mono(E13.c)],[`${mono(E13.a-E13.c)} = ${F(E13.d-E13.b)}`,"− "+E13.b],[`${$x} = ${F(E13.s)}`,"÷ ("+F(E13.a-E13.c)+")"]])}<p>Il faut choisir ${F(E13.s)} (image commune : ${F(E13.a*E13.s+E13.b)}).</p>`},
  {n:"Exercice 15", t:"Même image ?", w:"Sur ton cahier", h:`<p class="calc">${fx("h")} = ${sq("("+E15.p+$x+" − "+E15.q+")")} &emsp; et &emsp; ${fx("i")} = (${$x} − ${E15.r})(${E15.p*E15.p}${$x} + ${E15.t})</p><p>En choisissant le même antécédent, peut-on obtenir la même image ? Si oui, précise l'antécédent et l'image communs.</p>`,
   c:(()=>{ const {p,q,r,t,A,B,C,D}=E15, H=x=>(p*x-q)**2; const num=D-B, den=A-C; const [n,d]=[num,den];
     const xv=n/d, hv=H(xv); const g=(a,b)=>b?g(b,a%b):Math.abs(a); const [rn,rd]=(()=>{ let N=n, M=d; if(M<0){N=-N;M=-M;} const k=g(Math.abs(N),M)||1; return [N/k,M/k]; })();
     const img=(()=>{ const a=p*rn-q*rd; const N=a*a, M=rd*rd; const k=g(N,M)||1; return [N/k,M/k]; })();
     const P2=`${p*p}${sq($x)}`, Ct=C===0?"":` ${C<0?"−":"+"} ${mono(Math.abs(C))}`;
     return `<p>On développe chaque expression :</p>${ch(fx("h"),[sq("("+p+$x+" − "+q+")"),`(${p}${$x} − ${q})(${p}${$x} − ${q})`,`${P2} − ${mono(p*q)} − ${mono(p*q)} + ${q*q}`,`${P2} − ${mono(2*p*q)} + ${q*q}`])}${ch(fx("i"),[`(${$x} − ${r})(${P2.replace(sq($x),$x)} + ${t})`,`${P2} + ${mono(t)} − ${mono(p*p*r)} − ${r*t}`,`${P2}${Ct} − ${r*t}`])}
     <p>On cherche ${$x} tel que ${fx("h")} = ${fx("i")} :</p>${calc([`${P2} − ${mono(2*p*q)} + ${q*q} = ${P2}${Ct} − ${r*t}`,[`${lin(A,B)} = ${lin(C,D)}`,"− "+p*p+$x+"²"],...(C===0?[]:[[`${mono(A-C)} + ${B} = ${F(D)}`,(C<0?"+ ":"− ")+mono(Math.abs(C))]]),[`${mono(A-C)} = ${F(D-B)}`,"− "+B],[`${$x} = ${FR(D-B,A-C)}`,"÷ "+(A-C<0?"("+F(A-C)+")":F(A-C))]])}
     <p>On calcule l'image de ${FR(rn,rd)} avec ${$h} :</p><p class="calc">${fx("h",FR(rn,rd))} = (${p} × ${rn<0?"("+FR(rn,rd)+")":FR(rn,rd)} − ${q})²<br>${fx("h",FR(rn,rd))} = ${FR(img[0],img[1])}${img[1]!==1&&Number.isInteger(img[0]/img[1]*1000)?`<br>${fx("h",FR(rn,rd))} = ${F(img[0]/img[1])}`:""}</p><p>Oui : l'antécédent commun est ${FR(rn,rd)} et l'image commune est ${FR(img[0],img[1])}${img[1]!==1&&Number.isInteger(img[0]/img[1]*1000)?" = "+F(img[0]/img[1]):""}.</p>`; })()}
 ]}
];
};
