/* 3e · chapitre 22 — fiche d'entraînement : les exercices de la fiche de M. Staal (repérage et sections), avec d'autres valeurs.
   Globes, planisphères et pavés dessinés à partir des mêmes coordonnées (outils window.ESP3 de data/3e-22.js). */
TRAIN["3e-22"] = function(){
const {ri, pick, shuf, distinct} = TR;
const {globe, plani, pave, rectVG, GEO, LAT, LON, P3, F, rd} = window.ESP3;
const RED="#d0342c", GRN="#1e8a4c", BLUE="#1e5aa8";
const draw=(f,ok)=>{ for(let g=0;g<400;g++){ const v=f(); if(ok(v)) return v; } return f(); };

/* ===== Activité 1 : pavé ===== */
const NAMES=shuf([["O","A","C","D","E","F","G","H"],["R","S","U","V","T","W","X","Y"],["A","B","D","E","C","F","G","H"]])[0];
const [o,a,c,d,e,f,g,h]=NAMES;
const VX={"000":o,"100":a,"010":c,"001":d,"110":e,"101":f,"111":g,"011":h};
const MIDS=[["le milieu de ["+a+f+"]",[1,0,0.5]],["le milieu de ["+o+a+"]",[0.5,0,0]],["le milieu de ["+d+h+"]",[0,0.5,1]],["le milieu de ["+e+g+"]",[1,1,0.5]],["le centre de la face "+d+f+g+h,[0.5,0.5,1]],["le centre de la face "+o+a+e+c,[0.5,0.5,0]]];
const [m1,m2]=shuf(MIDS).slice(0,2);
const ask=shuf(["110","101","111","011"]).slice(0,3);
const pv=(names,pts)=>pave({L:1.6,P:1,H:1,k:120,names,axes:[["000","100",RED],["000","010",GRN],["000","001",BLUE]],pts});

/* ===== Exercice 1 : globe ===== */
const gpt=()=>[10*ri(-3,5),10*ri(-5,7)];
const G1=distinct(3,gpt,x=>x.join()).filter(p=>!(p[0]===0&&p[1]===0)).slice(0,3);
while(G1.length<3) G1.push([10*G1.length+10,-20]);
const N1=["M","N","P"].map((n,i)=>[n,...G1[i]]);
const Rl=draw(()=>10*ri(-6,7),x=>x!==N1[0][2]), Sl=draw(()=>10*ri(-3,5),x=>x!==N1[0][1]);

/* ===== Exercice 2 : globe sans graduations colorées ===== */
const sameLat=10*ri(-2,4), sameLon=10*ri(-4,6);
const G2=(()=>{ for(let t=0;t<300;t++){ const pts=[[sameLat,10*ri(-6,-1)],[sameLat,10*ri(1,7)],[10*ri(-3,5),sameLon],[10*ri(-3,5),sameLon],[10*ri(-3,5),10*ri(-6,7)]];
  const keys=pts.map(p=>p.join()); if(new Set(keys).size<5) continue;
  /* exactement les paires voulues */
  const lats=pts.map(p=>p[0]), lons=pts.map(p=>p[1]);
  if(lats.filter(x=>x===sameLat).length!==2 || lons.filter(x=>x===sameLon).length!==2) continue;
  if(new Set(lats).size!==4 || new Set(lons).size!==4) continue;
  return pts; } return [[20,-30],[20,40],[-10,10],[30,10],[50,-50]]; })();
const L2=shuf(["A","B","C","D","E"]).map((n,i)=>[n,...G2[i]]);
const latPair=L2.filter(p=>p[1]===sameLat).map(p=>p[0]).sort(), lonPair=L2.filter(p=>p[2]===sameLon).map(p=>p[0]).sort();

/* ===== Exercice 3 : planisphère ===== */
const P3pts=distinct(5,()=>[10*ri(-5,7),10*ri(-17,17)],x=>x.join()).map((p,i)=>["ABCDE"[i],...p]);

/* ===== Sections ===== */
const NAT=[["un pavé droit","parallèle à une face","un rectangle de mêmes dimensions que la face"],["un pavé droit","parallèle à une arête","un rectangle"],["un cylindre","parallèle à sa base","un disque de même rayon que la base"],["un cylindre","parallèle à son axe","un rectangle"],["un cône","parallèle à sa base","un disque, réduction du disque de base"],["une pyramide à base carrée","parallèle à sa base","un carré, réduction de la base"],["une sphère","qui ne passe pas par son centre","un cercle"],["une sphère","qui passe par son centre","un grand cercle"]];
const N4=shuf(NAT).slice(0,4);
const SP=draw(()=>{ const [x,y,z]=pick([[3,4,5],[6,8,10],[5,12,13],[9,12,15],[8,15,17],[12,16,20],[7,24,25]]); return {d:x,r:y,R:z}; },()=>true);
const CO=draw(()=>({SO:ri(8,16), OA:ri(3,9), k:pick([0.25,0.4,0.5,0.6,0.75,0.8])}),o=>Number.isInteger(o.SO*o.k*10));
/* « = 4 » si la valeur est exacte à k décimales, sinon « ≈ 4,23 » */
const eqA=(x,k)=>(Math.abs(x*10**k-Math.round(x*10**k))<1e-6?"= ":"≈ ")+F(x,k);
const PY=draw(()=>({c:ri(4,9), h:ri(6,12), k:pick([0.3,0.4,0.5,0.6])}),()=>true);
const GE=draw(()=>({D:2*ri(10,25), hc:0}),()=>true); GE.hc=ri(GE.D/2+2,GE.D-2);
const HJ=draw(()=>({AB:ri(3,8), AD:ri(2,5), AE:ri(3,6), IC:0}),()=>true); HJ.IC=ri(1,HJ.AE-1);
const T1=draw(()=>({R:ri(6,15), d:0}),()=>true); T1.d=ri(2,T1.R-2);
const T2=draw(()=>({R:ri(8,25), r:0}),()=>true); T2.r=ri(3,T2.R-2);
const T3=draw(()=>({SH:ri(2,5), HO:ri(5,10), OA:ri(3,8)}),()=>true);
const T5=draw(()=>({R:ri(4,9), d:0}),()=>true); T5.d=ri(10,10*T5.R-10)/10;
const T6=draw(()=>({R:ri(5,10), c:0}),()=>true); T6.c=2*ri(2,T6.R-1);

const sq=x=>F(x)+"²";
return [
 {t:"Se repérer dans un pavé droit", e:[
  {n:"Activité 1", t:"Se repérer dans un pavé droit", w:"Sur ton cahier", h:`<p>Voici un pavé droit et le repère (${o} ; ${a}, ${c}, ${d}).</p>${pv({"000":o,"100":a,"010":c,"001":d})}<p><b>1)</b> Donne les coordonnées des points ${o}, ${a}, ${c} et ${d}.</p><p><b>2)</b> ${ask.map((k,i)=>`${i?"nomme":"Nomme"} ${VX[k]} le sommet de coordonnées ${P3(...k.split("").map(Number))}`).join(" ; ")}.</p><p><b>3)</b> Donne les coordonnées de K, ${m1[0]}, et de L, ${m2[0]}.</p>`,
   c:`${pv(VX,[["K",m1[1][0]*1.6,m1[1][1],m1[1][2],0,-10],["L",m2[1][0]*1.6,m2[1][1],m2[1][2],14,4]])}<p><b>1)</b> ${o}(0 ; 0 ; 0), ${a}(1 ; 0 ; 0), ${c}(0 ; 1 ; 0), ${d}(0 ; 0 ; 1).</p><p><b>2)</b> Voir la figure.</p><p><b>3)</b> K${P3(...m1[1])} et L${P3(...m2[1])}.</p>`}
 ]},
 {t:"Se repérer sur une sphère", e:[
  {n:"Exercice 1", t:"Lire et placer des points sur le globe", w:"Sur ton cahier", h:`${globe({pts:N1,lat0:20,lon0:10})}<p><b>1)</b> Donne les coordonnées des points M, N et P.</p><p><b>2) a)</b> Place un point R qui a la même latitude que M.</p><p><b>b)</b> Place un point S qui a la même longitude que M.</p><p><b>c)</b> Complète : « Tous les points situés sur un même parallèle ont la même ……… » et « Tous les points situés sur un même méridien ont la même ……… ».</p>`,
   c:`<p><b>1)</b> ${N1.map(([n,la,lo])=>n+GEO(la,lo)).join(" ; ")}.</p>${globe({pts:[...N1,["R",N1[0][1],Rl],["S",Sl,N1[0][2]]],lat0:20,lon0:10})}<p><b>2) a)</b> Par exemple R${GEO(N1[0][1],Rl)} (sur le parallèle ${LAT(N1[0][1])}).</p><p><b>b)</b> Par exemple S${GEO(Sl,N1[0][2])} (sur le méridien ${LON(N1[0][2])}).</p><p><b>c)</b> Même parallèle : même <b>latitude</b>. Même méridien : même <b>longitude</b>.</p>`},
  {n:"Exercice 2", t:"Lire des coordonnées géographiques", w:"Sur ton cahier", h:`<p>Les lignes sont tracées tous les 10°.</p>${globe({pts:[["O",0,0],...L2],lat0:15,lon0:5,color:false,eqLab:0})}<p><b>a)</b> Donne les coordonnées des points A, B, C, D, E et O.</p><p><b>b)</b> Cite deux points qui ont la même latitude.</p><p><b>c)</b> Cite deux points qui ont la même longitude.</p>`,
   c:`<p><b>a)</b> ${[...L2].sort((x,y)=>x[0]<y[0]?-1:1).map(([n,la,lo])=>n+GEO(la,lo)).join(" ; ")} ; O(0° ; 0°).</p><p><b>b)</b> ${latPair.join(" et ")} ont la même latitude (${LAT(sameLat)}).</p><p><b>c)</b> ${lonPair.join(" et ")} ont la même longitude (${LON(sameLon)}).</p>`},
  {n:"Exercice 3", t:"Le planisphère", w:"Sur ton cahier", h:`<p>Les lignes sont tracées tous les 10°.</p>${plani({pts:P3pts})}<p><b>a)</b> Repasse en rouge l'équateur et en vert le méridien de Greenwich.</p><p><b>b)</b> Détermine les coordonnées géographiques des points A, B, C, D et E.</p>`,
   c:`<p><b>a)</b> Sur la figure : l'équateur (0°) est en rouge et le méridien de Greenwich (0°) est en vert.</p>${plani({pts:P3pts,color:true})}<p><b>b)</b> ${P3pts.map(([n,la,lo])=>n+GEO(la,lo)).join(" ; ")}.</p>`}
 ]},
 {t:"Sections planes de solides", e:[
  {n:"Exercice 4", t:"Donner la nature d'une section", w:"Sur ton cahier", h:N4.map((s,i)=>`<p><b>${"abcd"[i]})</b> On coupe ${s[0]} par un plan ${s[1]}.</p>`).join("")+"<p>Donne la nature de chaque section.</p>",
   c:N4.map((s,i)=>`<p><b>${"abcd"[i]})</b> ${s[2][0].toUpperCase()+s[2].slice(1)}.</p>`).join("")},
  {n:"Exercice 6", t:"Section d'une sphère", w:"Sur ton cahier", h:`<p>Une sphère de centre O a pour rayon ${SP.R} cm.</p><p>Un plan coupe la sphère selon un cercle de centre A tel que OA = ${SP.d} cm. B est un point de ce cercle.</p><p>Calcule le rayon [AB] de ce cercle.</p>`,
   c:`<p>OAB est rectangle en A et OB = ${SP.R} cm :</p><p class="calc">AB² = ${SP.R}² − ${SP.d}² = ${SP.R**2} − ${SP.d**2} = ${SP.r**2}<br>AB = √${SP.r**2} = ${SP.r} cm</p>`},
  {n:"Exercice 7", t:"Section d'un cône", w:"Sur ton cahier", h:`<p>Un cône de sommet S a pour hauteur SO = ${CO.SO} cm et pour rayon de base OA = ${CO.OA} cm.</p><p>Il est coupé par un plan parallèle à sa base, en I sur [SO], avec SI = ${F(CO.SO*CO.k)} cm. La section est le cercle de centre I passant par B, sur [SA].</p><p>Calcule le rayon IB de la section.</p>`,
   c:`<p class="calc">{SI/SO} = {IB/OA}<br>{${F(CO.SO*CO.k)}/${CO.SO}} = {IB/${CO.OA}}<br>IB = {${F(CO.SO*CO.k)} × ${CO.OA}/${CO.SO}} = ${F(CO.OA*CO.k)} cm</p><p>Coefficient de réduction : k = ${F(CO.k)}.</p>`},
  {n:"Exercice 8", t:"Section d'une pyramide", w:"Sur ton cahier", h:`<p>SABCD est une pyramide à base carrée de côté ${PY.c} cm et de hauteur SO = ${PY.h} cm.</p><p>Un plan parallèle à la base coupe [SO] en I avec SI = ${F(PY.h*PY.k)} cm. La section est MNPQ.</p><p><b>1)</b> Calcule le volume V de la pyramide SABCD.</p><p><b>2) a)</b> Exprime le volume V' de SMNPQ en fonction de V.</p><p><b>b)</b> Donne une valeur approchée de V' au centième.</p>`,
   c:(()=>{ const n=PY.c**2*PY.h, V=n/3, k3=PY.k**3, Vp=k3*V, Vs=n%3===0?F(V):`{${n}/3}`;
     return `<p><b>1)</b></p><p class="calc">V = {${PY.c} × ${PY.c} × ${PY.h}/3}<br>V = {${n}/3}<br>V ${n%3===0?`= ${F(V)}`:`≈ ${F(V,2)}`} cm³</p><p><b>2) a)</b> SMNPQ est une réduction de SABCD de coefficient k :</p><p class="calc">k = {SI/SO}<br>k = {${F(PY.h*PY.k)}/${PY.h}}<br>k = ${F(PY.k)}</p><p>Les volumes sont multipliés par k³ :</p><p class="calc">V' = ${F(PY.k)}³ × V<br>V' = ${F(k3)} × V</p><p><b>b)</b></p><p class="calc">V' = ${F(k3)} × ${Vs}<br>V' ${eqA(Vp,2)} cm³</p>`; })()},
  {n:"Exercice 9", t:"Une sphère posée sur le sol", w:"Sur ton cahier", h:`<p>Un bâtiment est une sphère de ${GE.D} m de diamètre.</p><p>La partie visible au-dessus du sol est une calotte sphérique de ${GE.hc} m de hauteur.</p><p>Calcule la surface au sol de ce bâtiment (arrondie au m²).</p>`,
   c:`<p>Rayon : ${GE.D} ÷ 2 = ${GE.D/2} m. Distance du centre au sol : ${GE.hc} − ${GE.D/2} = ${GE.hc-GE.D/2} m.</p><p>Le sol coupe la sphère selon un disque de rayon r. D'après le théorème de Pythagore :</p><p class="calc">${GE.D/2}² = ${GE.hc-GE.D/2}² + r²<br>r² = ${(GE.D/2)**2} − ${(GE.hc-GE.D/2)**2} = ${(GE.D/2)**2-(GE.hc-GE.D/2)**2}</p><p>Surface S au sol :</p><p class="calc">S = π × r²<br>S = ${(GE.D/2)**2-(GE.hc-GE.D/2)**2}π<br>S ≈ ${F(Math.PI*((GE.D/2)**2-(GE.hc-GE.D/2)**2),0)} m²</p>`},
  {n:"Exercice 10", t:"Section de pavé", w:"Sur ton cahier", h:`<p>ABCDEFGH est un pavé droit (E au-dessus de A, F au-dessus de B, G au-dessus de C, H au-dessus de D) avec AB = ${HJ.AB} cm, AD = ${HJ.AD} cm et AE = ${HJ.AE} cm.</p><p>HEJI est la section de ce pavé par un plan parallèle à l'arête [GF], avec I sur [CG], J sur [BF] et IC = ${HJ.IC} cm.</p><p><b>1)</b> Quelle est la nature de la section HEJI ?</p><p><b>2)</b> Calcule ses dimensions (arrondies au dixième), puis représente-la en vraie grandeur.</p>`,
   c:(()=>{ const fj=HJ.AE-HJ.IC, s2=HJ.AB**2+fj**2, r=Math.sqrt(s2), ex=Number.isInteger(r), v=ex?F(r):F(r,1), t=ex?`${v} cm`:`√${s2} ≈ ${v} cm`;
     return `<p><b>1)</b> Le plan est parallèle à l'arête [GF] : la section est un <b>rectangle</b>, avec HE = AD = ${HJ.AD} cm.</p><p><b>2)</b> J est sur [BF] avec BJ = IC = ${HJ.IC} cm, donc FJ = ${HJ.AE} − ${HJ.IC} = ${fj} cm. EF = AB = ${HJ.AB} cm.</p><p>Le triangle EFJ est rectangle en F. D'après le théorème de Pythagore :</p><p class="calc">EJ² = EF² + FJ²<br>EJ² = ${HJ.AB}² + ${fj}² = ${HJ.AB**2} + ${fj**2} = ${s2}<br>EJ = √${s2} ${ex?"=":"≈"} ${v} cm</p><p>Le rectangle mesure ${HJ.AD} cm sur ${ex?"":"environ "}${v} cm :</p>${rectVG(r,HJ.AD,t,`${HJ.AD} cm`)}`; })()},
  {n:"Exercice 11", t:"Exercices d'entraînement", w:"Sur ton cahier", h:`<p><b>1.</b> Une sphère de centre A a pour rayon ${T1.R} cm. Un plan la coupe selon un cercle de centre H avec AH = ${T1.d} cm. Calcule le rayon HB du cercle (au centième).</p><p><b>2.</b> Une sphère de centre A a pour rayon ${T2.R} cm. Un plan la coupe selon un cercle de rayon HB = ${T2.r} cm. Calcule la distance HA (au centième).</p><p><b>3.</b> Un cône de sommet S a une base de rayon OA = ${T3.OA} cm. Il est coupé parallèlement à sa base en H, avec SH = ${T3.SH} cm et HO = ${T3.HO} cm. Calcule l'aire du disque de section (au centième).</p><p><b>4.</b> Un cylindre de rayon ${T5.R} cm est coupé parallèlement à son axe, à ${F(T5.d)} cm de l'axe. Calcule la largeur DE de la section rectangulaire (au centième).</p><p><b>5.</b> Un cylindre de rayon ${T6.R} cm est coupé parallèlement à son axe ; la section a pour largeur ${T6.c} cm. À quelle distance HB de l'axe est le plan (au centième) ?</p>`,
   c:`<p>Dans 1., 2., 4. et 5., on utilise le théorème de Pythagore dans un triangle rectangle en H.</p><p><b>1.</b> HB² = ${T1.R}² − ${T1.d}² = ${T1.R**2} − ${T1.d**2} = ${T1.R**2-T1.d**2}, HB ${Number.isInteger(Math.sqrt(T1.R**2-T1.d**2))?"=":"≈"} ${F(Math.sqrt(T1.R**2-T1.d**2),2)} cm.</p><p><b>2.</b> HA² = ${T2.R}² − ${T2.r}² = ${T2.R**2} − ${T2.r**2} = ${T2.R**2-T2.r**2}, HA ${Number.isInteger(Math.sqrt(T2.R**2-T2.r**2))?"=":"≈"} ${F(Math.sqrt(T2.R**2-T2.r**2),2)} cm.</p>
   <p><b>3.</b> SO = ${T3.SH+T3.HO} cm ; k = {${T3.SH}/${T3.SH+T3.HO}}.</p><p class="calc">r = {${T3.SH} × ${T3.OA}/${T3.SH+T3.HO}}<br>r ${eqA(T3.SH*T3.OA/(T3.SH+T3.HO),3)} cm</p><p class="calc">A = π × r²<br>A ≈ ${F(Math.PI*(T3.SH*T3.OA/(T3.SH+T3.HO))**2,2)} cm²</p>
   <p><b>4.</b> Demi-largeur : √(${T5.R}² − ${sq(T5.d)}) = √${F(T5.R**2-T5.d**2)} ${eqA(Math.sqrt(T5.R**2-T5.d**2),3)} cm, donc DE ${eqA(2*Math.sqrt(T5.R**2-T5.d**2),2)} cm.</p>
   <p><b>5.</b> Demi-largeur : ${T6.c/2} cm ; HB² = ${T6.R}² − ${T6.c/2}² = ${T6.R**2-(T6.c/2)**2}, HB ${Number.isInteger(Math.sqrt(T6.R**2-(T6.c/2)**2))?"=":"≈"} ${F(Math.sqrt(T6.R**2-(T6.c/2)**2),2)} cm.</p>`}
 ]}
];
};
