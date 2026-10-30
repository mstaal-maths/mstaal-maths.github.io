/* 3e · chapitre 15 — fiche d'entraînement : les exercices de la fiche de M. Staal (trigonométrie), avec d'autres nombres.
   Figures et corrections calculées à partir des mêmes valeurs (outils window.TRIG3 de data/3e-15.js). */
TRAIN["3e-15"] = function(){
const {ri, pick, shuf} = TR;
const {geo, trig, F, rd, ang, cosd, sind, tand, acosd, asind, atand, safe, lenCalc, angCalc, SIDES, val, NOMC, NOMS} = window.TRIG3;
const fig=(cap,body)=>`<figure>${body}${cap?`<figcaption>${cap}</figcaption>`:""}</figure>`;
const NM=()=>pick(NOMS).split("");
const tab=(head,rows)=>`<div class="scroll"><table class="std"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;
/* un nombre dont l'arrondi n'est pas ambigu */
const draw=(f,ok)=>{ for(let g=0;g<300;g++){ const v=f(); if(ok(v)) return v; } return f(); };
/* exercice de longueur : types imposés ou au hasard */
function L1(types, k){ return draw(()=>{ const n=NM(), a=ri(18,72), [kt,ut]=types||shuf(["adj","opp","hyp"]).slice(0,2), kv=ri(25,150)/10; return {n,a,kt,ut,kv,rot:ri(-30,30),c:lenCalc(n,a,kt,kv,ut,k)}; }, o=>safe(o.c.res,k) && o.c.res<80); }
function A1(types){ return draw(()=>{ const n=NM(), [t1,t2]=types||shuf(["adj","opp","hyp"]).slice(0,2); let v1=ri(15,80)/10, v2=ri(15,80)/10; if(t1==="hyp") v1=rd(v2+ri(5,50)/10); if(t2==="hyp") v2=rd(v1+ri(5,50)/10);
  return {n,t1,t2,v1,v2,rot:ri(-30,30),c:angCalc(n,t1,v1,t2,v2)}; }, o=>o.c.a>8 && o.c.a<82 && safe(o.c.a,0)); }
const figL=o=>trig(o.n,o.a,{[o.kt]:F(o.kv)+" cm",[o.ut]:"?"},{mark:o.a+"°", rot:o.rot, w:260});
const figA=o=>trig(o.n,o.c.a,{[o.t1]:F(o.v1)+" cm",[o.t2]:F(o.v2)+" cm"},{mark:"?", rot:o.rot, w:260});
/* même triangle, côtés colorés avec H, A, O */
const LET={hyp:"H",adj:"A",opp:"O"};
const haoL=o=>trig(o.n,o.a,{[o.kt]:LET[o.kt]+" : "+F(o.kv)+" cm",[o.ut]:LET[o.ut]+" : ?"},{mark:o.a+"°", rot:o.rot, w:300, colors:true});
const haoA=o=>{ const third=["hyp","adj","opp"].find(t=>t!==o.t1&&t!==o.t2); return trig(o.n,o.c.a,{[o.t1]:LET[o.t1]+" : "+F(o.v1)+" cm",[o.t2]:LET[o.t2]+" : "+F(o.v2)+" cm",[third]:LET[third]},{mark:"?", rot:o.rot, w:300, colors:true}); };
const nomA=n=>ang(n[2]+n[1]+n[0]);

/* ===== Activité 1 : tyrolienne ===== */
const ty=draw(()=>({a:ri(10,40), d:ri(20,60)}), o=>safe(o.d/cosd(o.a),2)); const tyL=ty.d/cosd(ty.a);
/* ===== Activité 2 ===== */
const a2=ri(20,70), a2c=ri(40,80)/10, a2h=a2c/cosd(a2);
/* ===== Exercice 1 ===== */
const e1=shuf([...Array(85).keys()].map(x=>x+3)).slice(0,9).sort((x,y)=>x-y);
/* ===== Exercice 2 : cosinus seulement ===== */
const e2=[0,1,2,3].map(i=>L1(i%2?["hyp","adj"]:["adj","hyp"],1));
/* ===== Exercice 3 : avion ===== */
const av=draw(()=>({a:ri(15,45), d:ri(20,80)/10}), o=>safe(o.d/cosd(o.a),1));
/* ===== Exercice 4 ===== */
const e4=shuf([...Array(85).keys()].map(x=>x+3)).slice(0,3);
/* ===== Exercice 5 : trois situations ===== */
const s1=draw(()=>({a:ri(40,75), h:ri(500,1500)}), o=>safe(o.h/cosd(o.a),0)), s1r=s1.h/cosd(s1.a);
const s2=draw(()=>({a:ri(60,85), L:ri(30,90)}), o=>safe(o.L*sind(o.a),1)), s2r=s2.L*sind(s2.a);
const s3=draw(()=>({a:ri(20,50), d:ri(6,20)}), o=>safe(o.d*tand(o.a),1)), s3r=s3.d*tand(s3.a);
/* ===== Exercice 6 : stade ===== */
const st=draw(()=>({a:ri(30,65), d:ri(15,40), y:pick([1.4,1.5,1.6,1.65,1.7])}), o=>safe(o.d*tand(o.a)+o.y,2)); const stK=st.d*tand(st.a);
/* ===== Exercice 7 : funiculaire ===== */
const fu=draw(()=>({a:ri(100,300)/10, L:ri(80,250)}), o=>safe(o.L*sind(o.a),2)), fuH=fu.L*sind(fu.a);
/* ===== Activité 4 : échelle ===== */
const ec=draw(()=>{ const L=ri(30,70)/10, h=ri(Math.round(L*10*0.7), Math.round(L*10)-2)/10; return {L,h,lim:pick([65,70,75])}; }, o=>safe(asind(o.h/o.L),0) && Math.round(asind(o.h/o.L))!==o.lim); const ecA=asind(ec.h/ec.L);
/* ===== Exercice 8 ===== */
const e8=["cos","sin","tan"].map(fn=>{ const a=ri(5,85); const x=draw(()=>fn==="tan"?ri(2,60)/10:ri(5,95)/100, x=>safe(fn==="cos"?acosd(x):fn==="sin"?asind(x):atand(x),0)); const b=fn==="cos"?acosd(x):fn==="sin"?asind(x):atand(x); return {fn,a,va:val(fn,a),x,b}; });
/* ===== Exercices 9, 10, 13 ===== */
const e9=[A1(), A1()], e10=[L1(null,1), A1()], e13=[L1(null,1), A1(), L1(null,2)];
/* ===== Exercice 11 : pente ===== */
const pc=ri(4,20), pA=draw(()=>ri(5,25),x=>x!==pc), pB=draw(()=>ri(3,12),x=>Math.abs(1/x*100-pA)>0.5);
const pAng=atand(pc/100);
/* ===== Exercice 12 : trottoir roulant ===== */
const tr=draw(()=>({h:ri(2,6), d:ri(15,40), m1:pick([10,12,15]), v1:pick([0.4,0.5,0.6]), m2:pick([5,6,7,8]), v2:pick([0.75,0.8,1])}), o=>{ const a=atand(o.h/o.d); return Math.abs(a-o.m1)>0.5 && Math.abs(a-o.m2)>0.5 && Math.abs(Math.hypot(o.h,o.d)/o.v1-60)>2 && Math.abs(Math.hypot(o.h,o.d)/o.v2-60)>2; });
const trA=atand(tr.h/tr.d), trL=Math.hypot(tr.h,tr.d), ok1=trA<=tr.m1, ok2=trA<=tr.m2, t1=trL/tr.v1, t2=trL/tr.v2;
const trOk=(m,ok,t,v,i)=>`<p><b>Modèle ${i} :</b> ${ok?`${F(trA,1)}° ≤ ${m}° : l'angle convient. Durée : {${F(trL,3)}/${F(v)}} ≈ ${F(t,1)} s. ${t<=60?`${F(t,1)} s &lt; 60 s : <b>le modèle ${i} convient</b>.`:`${F(t,1)} s &gt; 60 s : <b>le modèle ${i} ne convient pas</b> (trop lent).`}`:`${F(trA,1)}° &gt; ${m}° : <b>le modèle ${i} ne convient pas</b>, la pente est trop forte.`}</p>`;

return [
 {t:"Découvrir le cosinus d'un angle", e:[
  {n:"Activité 1", t:"Calculer une longueur", w:"Sur ton cahier", h:`<p>Une tyrolienne relie deux arbres distants de ${ty.d} m.</p><p>Le câble est incliné de ${ty.a}° par rapport à l'horizontale.</p><p>Quelle doit être la longueur du câble tendu ? Arrondi au centième près.</p>`,
   c:`${trig(["C","A","B"],ty.a,{adj:ty.d+" m",hyp:"?"},{mark:ty.a+"°",rot:0,w:280})}<p>Le triangle ABC est rectangle en C : [AC] (${ty.d} m) est le côté adjacent à l'angle de ${ty.a}°, le câble [AB] est l'hypoténuse.</p><p class="calc">cos(${ang("BAC")}) = {AC/AB}<br>cos(${ty.a}°) = {${ty.d}/AB}<br>AB = {${ty.d}/cos(${ty.a}°)} ≈ ${F(tyL,2)} m</p>`},
  {n:"Activité 2", t:"Construction de triangles", w:"Sur ton cahier", h:`<p><b>1 –</b> Construis un triangle ABC rectangle en C tel que ${ang("CAB")} = ${a2}° et AC = ${F(a2c)} cm.</p><p><b>2 –</b> Mesure AB et donne la valeur du quotient {AC/AB}, arrondie au centième.</p><p><b>3 –</b> Compare avec cos(${a2}°) donné par la calculatrice.</p>`,
   c:`${trig(["C","A","B"],a2,{adj:F(a2c)+" cm",hyp:"≈ "+F(a2h,1)+" cm"},{mark:a2+"°",rot:0,w:280})}<p>On mesure AB ≈ ${F(a2h,1)} cm.</p><p class="calc">{AC/AB} ≈ {${F(a2c)}/${F(a2h,1)}} ≈ ${F(cosd(a2),2)}</p><p>La calculatrice donne cos(${a2}°) ≈ ${F(cosd(a2),2)} : c'est la même valeur, quelle que soit la taille du triangle.</p>`},
  {n:"Exercice 1", t:"Calculer le cosinus d'un angle", w:"Sur ton cahier", h:`<p>À l'aide de la calculatrice, complète le tableau. Arrondis au centième près.</p>${tab(["Angle",...e1.map(a=>a+"°")],[["cos(angle)",...e1.map(()=>"")]])}`,
   c:tab(["Angle",...e1.map(a=>a+"°")],[["cos(angle)",...e1.map(a=>F(cosd(a),2))]])},
  {n:"Exercice 2", t:"Calculer une longueur avec le cosinus", w:"Sur ton cahier", h:`<p>Pour chaque triangle, repère l'hypoténuse (<b>H</b>) et le côté adjacent à l'angle donné (<b>A</b>), puis calcule la longueur du côté indiqué. Arrondis au dixième.</p><div class="figs">${e2.map((o,i)=>fig(`${"abcd"[i]}) ${o.n.join("")} rectangle en ${o.n[0]} : calcule ${o.c.X}.`,figL(o))).join("")}</div>`,
   c:`<p><b>H</b> : l'hypoténuse (en rouge) · <b>A</b> : le côté adjacent (en vert).</p>`+e2.map((o,i)=>`<p><b>${"abcd"[i]})</b></p>${haoL(o)}${o.c.h}`).join("")},
  {n:"Exercice 3", t:"Décollage d'un avion", w:"Sur ton cahier", h:`<p>Un avion décolle en ligne droite en faisant un angle de ${av.a}° par rapport au sol.</p><p>Il survole maintenant une ville qui se situe à ${F(av.d)} km de l'aéroport.</p><p>Quelle distance, en km, l'avion a-t-il parcourue ? Arrondis au dixième.</p>`,
   c:`<p>A : l'aéroport, V : la ville, P : l'avion. AVP est rectangle en V ; AV = ${F(av.d)} km est le côté adjacent à l'angle de ${av.a}°, AP l'hypoténuse.</p><p class="calc">cos(${ang("VAP")}) = {AV/AP}<br>cos(${av.a}°) = {${F(av.d)}/AP}<br>AP = {${F(av.d)}/cos(${av.a}°)} ≈ ${F(av.d/cosd(av.a),1)} km</p><p>L'avion a parcouru environ <b>${F(av.d/cosd(av.a),1)} km</b>.</p>`}
 ]},
 {t:"Cosinus, sinus et tangente : calculer une longueur", e:[
  {n:"Exercice 4", t:"Calculer le cosinus, le sinus et la tangente d'un angle", w:"Sur ton cahier", h:`<p>À l'aide de la calculatrice, complète le tableau. Arrondis au centième près.</p>${tab(["Angle",...e4.map(a=>a+"°")],["cos","sin","tan"].map(f=>[f+"(angle)","","",""]))}`,
   c:tab(["Angle",...e4.map(a=>a+"°")],["cos","sin","tan"].map(f=>[f+"(angle)",...e4.map(a=>F(val(f,a),2))]))},
  {n:"Exercice 5", t:"Calculer la longueur d'un côté d'un triangle rectangle", w:"Sur ton cahier", h:`<p>Dans chaque cas, indique H, A et O, choisis cos, sin ou tan, puis calcule. Arrondis au dixième (à l'unité pour le 1).</p>
   <p><b>1 –</b> Un avion A est à ${F(s1.h)} m d'altitude au-dessus du point B. Il descend vers le point C de la piste en suivant une droite qui fait un angle ${ang("BAC")} de ${s1.a}° avec la verticale [AB]. Calcule la distance AC.</p>
   <p><b>2 –</b> Une tyrolienne [NP] mesure ${s2.L} m. Elle fait un angle ${ang("MNP")} de ${s2.a}° avec le tronc vertical [NM] (le triangle NMP est rectangle en M). Calcule la distance MP entre les deux arbres.</p>
   <p><b>3 –</b> Le haut T d'un poteau [AT] est vu depuis le point S du sol, à ${s3.d} m du pied A, sous un angle ${ang("AST")} de ${s3.a}°. Calcule la longueur AT du poteau.</p>`,
   c:`<p><b>1 –</b> ABC rectangle en B : AB adjacent (A), AC hypoténuse (H) → <b>cosinus</b>.</p><p class="calc">cos(${ang("BAC")}) = {AB/AC}<br>cos(${s1.a}°) = {${F(s1.h)}/AC}<br>AC = {${F(s1.h)}/cos(${s1.a}°)} ≈ ${F(s1r,0)} m</p>
   <p><b>2 –</b> NMP rectangle en M : NP hypoténuse (H), MP opposé (O) → <b>sinus</b>.</p><p class="calc">sin(${ang("MNP")}) = {MP/NP}<br>sin(${s2.a}°) = {MP/${s2.L}}<br>MP = ${s2.L} × sin(${s2.a}°) ≈ ${F(s2r,1)} m</p>
   <p><b>3 –</b> TAS rectangle en A : AS adjacent (A), AT opposé (O) → <b>tangente</b>.</p><p class="calc">tan(${ang("AST")}) = {AT/AS}<br>tan(${s3.a}°) = {AT/${s3.d}}<br>AT = ${s3.d} × tan(${s3.a}°) ≈ ${F(s3r,1)} m</p>`},
  {n:"Exercice 6", t:"Au stade", w:"Sur ton cahier", h:`<p>Ivana, dont les yeux sont à ${F(st.y)} m du sol, observe un stade.</p><p>Elle est à ${st.d} m du stade et voit le haut du stade sous un angle de ${st.a}° avec l'horizontale.</p><p>Quelle est la hauteur du stade ? Arrondis au centième.</p>`,
   c:`<p>O : l'œil d'Ivana, K : le point du stade à la hauteur de ses yeux, S : le haut du stade. OKS est rectangle en K ; OK = ${st.d} m est adjacent à l'angle de ${st.a}°, KS est opposé → <b>tangente</b>.</p><p class="calc">tan(${ang("KOS")}) = {KS/OK}<br>tan(${st.a}°) = {KS/${st.d}}<br>KS = ${st.d} × tan(${st.a}°) ≈ ${F(stK,2)} m</p><p>On ajoute la hauteur des yeux d'Ivana : ${F(stK,2)} + ${F(st.y)} ≈ ${F(stK+st.y,2)}.</p><p>Le stade mesure environ <b>${F(stK+st.y,2)} m</b> de haut.</p>`},
  {n:"Exercice 7", t:"Funiculaire", w:"Sur ton cahier", h:`<p>La voie d'un funiculaire mesure ${fu.L} m.</p><p>Elle a un angle d'élévation de ${F(fu.a)}° par rapport à l'horizontale.</p><p>Donne une valeur approchée au centième de la différence d'altitude, en m, entre la gare d'arrivée et la gare de départ.</p>`,
   c:`<p>La voie (${fu.L} m) est l'hypoténuse ; la différence d'altitude est le côté opposé à l'angle de ${F(fu.a)}° → <b>sinus</b>.</p><p class="calc">sin(angle) = {côté opposé/hypoténuse}<br>sin(${F(fu.a)}°) = {h/${fu.L}}<br>h = ${fu.L} × sin(${F(fu.a)}°) ≈ ${F(fuH,2)} m</p><p>La différence d'altitude est d'environ <b>${F(fuH,2)} m</b>.</p>`}
 ]},
 {t:"Calculer la mesure d'un angle", e:[
  {n:"Activité 3", t:"Trouver l'angle d'inclinaison", w:"Sur ton cahier", h:`<p>Mattéo est perché sur une échelle [ES] de ${F(ec.L)} m appuyée contre un mur vertical [MS].</p><p>Le haut S de l'échelle est à ${F(ec.h)} m du sol (MS = ${F(ec.h)} m).</p><p>Pour être stable, l'échelle doit faire un angle avec le sol de ${ec.lim}° maximum.</p><p>L'échelle est-elle positionnée correctement ?</p>`,
   c:`<p>EMS est rectangle en M. Pour l'angle ${ang("SEM")} : MS est opposé, ES est l'hypoténuse → <b>sinus</b>.</p><p class="calc">sin(${ang("SEM")}) = {${F(ec.h)}/${F(ec.L)}}<br>${ang("SEM")} = sin<sup>−1</sup>({${F(ec.h)}/${F(ec.L)}}) ≈ ${Math.round(ecA)}°</p><p>${Math.round(ecA)<=ec.lim?`${Math.round(ecA)}° ≤ ${ec.lim}° : <b>l'échelle est bien positionnée</b>.`:`${Math.round(ecA)}° &gt; ${ec.lim}° : <b>l'échelle n'est pas bien positionnée</b>.`}</p>`},
  {n:"Exercice 8", t:"Savoir utiliser la bonne fonction avec la calculatrice", w:"Sur ton cahier", h:`<p>Complète les tableaux. Arrondis les angles au degré et les autres valeurs au centième.</p><div class="figs">${e8.map(o=>tab(["Angle",o.a+"°",""],[[o.fn+"(angle)","",F(o.x)]])).join("")}</div>`,
   c:`<div class="figs">${e8.map(o=>tab(["Angle",o.a+"°","<b>"+Math.round(o.b)+"°</b>"],[[o.fn+"(angle)","<b>"+F(o.va,2)+"</b>",F(o.x)]])).join("")}</div><p>${e8.map(o=>`${o.fn}<sup>−1</sup>(${F(o.x)}) ≈ ${Math.round(o.b)}°`).join(" ; ")} (touche SECONDE).</p>`},
  {n:"Exercice 9", t:"Déterminer la mesure d'un angle", w:"Sur ton cahier", h:`<p>Indique H, A et O par rapport à l'angle cherché, choisis cos, sin ou tan, puis calcule l'angle. Arrondi au degré.</p><div class="figs">${e9.map((o,i)=>fig(`${"ab"[i]}. ${o.n.join("")} rectangle en ${o.n[0]} : calcule ${nomA(o.n)}.`,figA(o))).join("")}</div>`,
   c:`<p><b>H</b> en rouge, <b>A</b> en vert, <b>O</b> en bleu.</p>`+e9.map((o,i)=>`<p><b>${"ab"[i]}.</b></p>${haoA(o)}${o.c.h}`).join("")},
  {n:"Exercice 10", t:"Une longueur ou un angle", w:"Sur ton cahier", h:`<p>Dans chaque cas, calcule la longueur du côté (au dixième) ou la mesure de l'angle (au degré) indiqué.</p><div class="figs">${fig(`a. Calcule ${e10[0].c.X}.`,figL(e10[0]))}${fig(`b. Calcule ${nomA(e10[1].n)}.`,figA(e10[1]))}</div>`,
   c:`<p><b>a.</b></p>${e10[0].c.h}<p><b>b.</b></p>${e10[1].c.h}`},
  {n:"Exercice 11", t:"Signalisation de pente", w:"Sur ton cahier", h:`<p>Un panneau routier indique une descente dont la pente est de ${pc} % : pour un déplacement horizontal de 100 m, le dénivelé est de ${pc} m.</p><p><b>1)</b> Détermine la mesure de l'angle que fait la route avec l'horizontale. Arrondis au degré près.</p><p><b>2)</b> Le panneau A indique ${pA} %. Le panneau B indique « 1 : ${pB} » (1 m de dénivelé pour ${pB} m de déplacement horizontal). Lequel indique la pente la plus forte ?</p>`,
   c:`<p><b>1)</b> Dans le triangle rectangle formé, le dénivelé (${pc} m) est opposé à l'angle et le déplacement horizontal (100 m) est adjacent → <b>tangente</b>.</p><p class="calc">tan(angle) = {${pc}/100} = ${F(pc/100)}<br>angle = tan<sup>−1</sup>(${F(pc/100)}) ≈ ${Math.round(pAng)}°</p>
   <p><b>2)</b> Panneau A : {${pA}/100} = ${F(pA/100)}. Panneau B : {1/${pB}} ≈ ${F(1/pB,3)}.</p><p>${pA/100>1/pB?`${F(pA/100)} &gt; ${F(1/pB,3)} : c'est le <b>panneau A</b>`:`${F(1/pB,3)} &gt; ${F(pA/100)} : c'est le <b>panneau B</b>`} qui indique la pente la plus forte.</p>`},
  {n:"Exercice 12", t:"Le trottoir roulant", w:"Sur ton cahier", h:`<p>Un trottoir roulant [PC] relie un parking au centre commercial.</p><p>Il monte de CH = ${tr.h} m pour un déplacement horizontal PH = ${tr.d} m (le triangle PHC est rectangle en H).</p><p>Les personnes ne doivent pas mettre plus de 1 minute pour accéder au centre commercial.</p>
   ${tab(["","Modèle 1","Modèle 2"],[["Angle d'inclinaison maximum",tr.m1+"°",tr.m2+"°"],["Vitesse",F(tr.v1)+" m/s",F(tr.v2)+" m/s"]])}<p>Lequel de ces deux modèles peut convenir ? Justifie.</p>`,
   c:`<p class="calc">tan(${ang("CPH")}) = {CH/PH} = {${tr.h}/${tr.d}}<br>${ang("CPH")} = tan<sup>−1</sup>({${tr.h}/${tr.d}}) ≈ ${F(trA,1)}°</p><p>Pythagore dans PHC : PC² = ${tr.h}² + ${tr.d}² = ${F(tr.h*tr.h+tr.d*tr.d)}, donc PC = √${F(tr.h*tr.h+tr.d*tr.d)} ≈ ${F(trL,3)} m.</p>${trOk(tr.m1,ok1,t1,tr.v1,1)}${trOk(tr.m2,ok2,t2,tr.v2,2)}`},
  {n:"Exercice 13", t:"Exercice mélangé : trouver une longueur ou trouver un angle", w:"Sur ton cahier", h:`<p>Calcule la longueur du côté ou la mesure de l'angle indiqué en rédigeant.</p><div class="figs">${fig(`a. Calcule ${e13[0].c.X} (au dixième).`,figL(e13[0]))}${fig(`b. Calcule ${nomA(e13[1].n)} (au degré).`,figA(e13[1]))}${fig(`c. Calcule ${e13[2].c.X} (au centième).`,figL(e13[2]))}</div>`,
   c:`<p><b>a.</b></p>${e13[0].c.h}<p><b>b.</b></p>${e13[1].c.h}<p><b>c.</b></p>${e13[2].c.h}`}
 ]}
];
};
