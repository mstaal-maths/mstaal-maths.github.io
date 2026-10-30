/* 3e · chapitre 18 — fiche d'entraînement : les exercices de M. Staal sur la réciproque du théorème de Thalès,
   avec d'autres nombres. Figures calculées à partir des longueurs (window.G3k18). */
TRAIN["3e-18"] = function(){
const {ri, pick, shuf} = TR;
const {F, Fr, sec, randRec, recFig, recCorr} = window.G3k18;
const r3=x=>Math.round(x*1000)/1000;
const eqs=(a,b)=>Math.abs(a-b)<1e-9;
const ap=x=>eqs(x,r3(x))?"=":"≈";
const gcd=(a,b)=>b?gcd(b,a%b):a;
/* quotient a/b : « = décimal » s'il est exact, sinon « = fraction irréductible ≈ décimal » (on ne conclut jamais l'égalité sur des valeurs arrondies) */
const qv=(a,b)=>{ const q=a/b; if(eqs(q,r3(q))) return `= ${F(q)}`; const p=Math.round(a*1000), d=Math.round(b*1000), g=gcd(p,d); return `= ${Fr(p/g,d/g)} ≈ ${F(q)}`; };

/* 1. rappel : calcul d'une longueur avec le théorème de Thalès */
const RP=(()=>{ let ad,ab,bc; do{ ab=pick([10,12,15,16,20]); ad=pick([4,6,8,9,12]); bc=pick([6,7.5,8,9,10]); }while(ad>=ab||!eqs(ad*bc/ab*100,Math.round(ad*bc/ab*100))); return {ad,ab,bc,ed:r3(ad*bc/ab)}; })();
/* 2. trois situations */
const R=[randRec(),randRec(),randRec()];
/* 3. étagère (mur AB, toit AC) */
const ET=(()=>{ const ad=pick([1.5,1.6,1.8,2]), db=pick([0.4,0.5,0.6]), ab=r3(ad+db), k=ad/ab; const ac=pick([2.5,3,3.2,3.5]); const par=Math.random()<0.5; let ae=r3(k*ac); if(!par||!eqs(ae*100,Math.round(ae*100))) ae=r3(Math.round(k*ac*10)/10+0.1); return {ad,db,ab,ac,ae,ec:r3(ac-ae)}; })();
/* 4. piano / table */
const PI=(()=>{ const ok=x=>eqs(x*2,Math.round(x*2)); let k,ge,gf; do{ k=pick([2/3,0.75,0.6,0.8]); ge=pick([30,36,40,45,48]); gf=pick([40,45,48,50,60]); }while(!ok(ge/k)||!ok(gf/k)||ge===gf); const gd=r3(ge/k), par=Math.random()<0.5; const gc=par?r3(gf/k):r3(gf/k+pick([-6,6])); return {ge,gd,gf,gc}; })();
/* 5. voile : Thalès puis réciproque */
const VO=(()=>{ const pm=pick([4,4.2,4.5,5]), k=pick([0.8,0.85,0.9]), mw=pick([3,3.2,3.4,3.6]); const pc=r3(k*pm), ct=r3(k*mw); const fil=pick([5,6,7]); const pw=pick([2.2,2.3,2.5]), pt=r3(pw*(k-0.06)); return {pm,pc,mw,ct,fil,pw,pt,k}; })();

return [
 {t:"Rappel : calculer une longueur", e:[
  {n:"Exercice 1", t:"Calcul d'une longueur", w:"Sur ton cahier", h:`<p>A, D, B sont alignés et A, E, C sont alignés. Sachant que (ED) // (BC), AD = ${F(RP.ad)} cm, AB = ${F(RP.ab)} cm et BC = ${F(RP.bc)} cm, calcule ED.</p>`,
   c:`<p>A, D, B sont alignés ; A, E, C sont alignés ; (ED) // (BC).</p><p>D'après le théorème de Thalès : ${Fr("AD","AB")} = ${Fr("ED","BC")} donc ED = ${Fr(`${F(RP.ad)} × ${F(RP.bc)}`,F(RP.ab))} = ${F(RP.ed)} cm.</p>`}
 ]},
 {t:"Utiliser la réciproque", e:[
  {n:"Exercice 2", t:"Droites parallèles ?", w:"Sur ton cahier", h:`<p>Dans chaque cas, les points sont alignés dans le même ordre (longueurs en cm). Les droites sont-elles parallèles ?</p>${R.map((x,i)=>`<p><b>${"abc"[i]})</b> ${x.A}${x.M} = ${F(x.am)} ; ${x.A}${x.B} = ${F(x.ab)} ; ${x.A}${x.N} = ${F(x.an)} ; ${x.A}${x.C} = ${F(x.ac)}. (${x.M}${x.N}) et (${x.B}${x.C}) ?</p>${recFig(x)}`).join("")}`,
   c:R.map((x,i)=>`<p><b>${"abc"[i]})</b></p>${recCorr(x)}`).join("")},
  {n:"Exercice 3", t:"Les étagères", w:"Sur ton cahier", h:`<p>Dans une chambre mansardée, le mur (AB) est perpendiculaire au sol (BC). L'étagère [DE] relie D sur [AB] et E sur [AC].</p><p>AD = ${F(ET.ad)} m ; DB = ${F(ET.db)} m ; AE = ${F(ET.ae)} m ; EC = ${F(ET.ec)} m.</p><p>L'étagère est-elle parallèle au sol ?</p>`,
   c:`<p>A, D, B et A, E, C sont alignés dans le même ordre. AB = ${F(ET.ab)} m et AC = ${F(ET.ac)} m.</p><p class="calc">${Fr("AD","AB")} = ${Fr(F(ET.ad),F(ET.ab))} ${qv(ET.ad,ET.ab)} et ${Fr("AE","AC")} = ${Fr(F(ET.ae),F(ET.ac))} ${qv(ET.ae,ET.ac)}</p><p>${eqs(ET.ad/ET.ab,ET.ae/ET.ac)?"Les quotients sont égaux : d'après la réciproque du théorème de Thalès, <b>l'étagère est parallèle au sol</b>.":"Les quotients ne sont pas égaux : d'après la propriété 2, <b>l'étagère n'est pas parallèle au sol</b>."}</p>`},
  {n:"Exercice 4", t:"Piano", w:"Sur ton cahier", h:`<p>Les pieds [ED] et [FC] d'un support de piano se croisent en G. GE = ${F(PI.ge)} cm ; GD = ${F(PI.gd)} cm ; GF = ${F(PI.gf)} cm et GC = ${F(PI.gc)} cm. Le sol est représenté par (CD).</p><p>Le clavier (EF) est-il parallèle au sol ?</p>`,
   c:`<p>E, G, D et F, G, C sont alignés dans le même ordre.</p><p class="calc">${Fr("GE","GD")} = ${Fr(F(PI.ge),F(PI.gd))} ${qv(PI.ge,PI.gd)} et ${Fr("GF","GC")} = ${Fr(F(PI.gf),F(PI.gc))} ${qv(PI.gf,PI.gc)}</p><p>${eqs(PI.ge/PI.gd,PI.gf/PI.gc)?"Les quotients sont égaux : d'après la réciproque du théorème de Thalès, <b>(EF) // (CD)</b>.":"Les quotients ne sont pas égaux : d'après la propriété 2, <b>le clavier n'est pas parallèle au sol</b>."}</p>`},
  {n:"Exercice 5", t:"Réparation d'une voile", w:"Sur ton cahier", h:`<p>La voile a la forme du triangle PMW. On fait une couture [CT] avec C sur [PM] et T sur [PW]. PM = ${F(VO.pm)} m ; PC = ${F(VO.pc)} m ; MW = ${F(VO.mw)} m.</p><p><b>1)</b> On suppose (CT) // (MW). Il faut deux fois la longueur de la couture en fil. ${VO.fil} m de fil suffiront-ils ?</p><p><b>2)</b> Après la couture, on mesure PT = ${F(VO.pt)} m et PW = ${F(VO.pw)} m. La couture est-elle parallèle à (MW) ?</p>`,
   c:`<p><b>1)</b> P, C, M sont alignés ; P, T, W sont alignés ; (CT) // (MW).</p><p>D'après le théorème de Thalès : ${Fr("PC","PM")} = ${Fr("CT","MW")} donc CT = ${Fr(`${F(VO.pc)} × ${F(VO.mw)}`,F(VO.pm))} = ${F(VO.ct)} m.</p><p>Il faut 2 × ${F(VO.ct)} = ${F(2*VO.ct)} m de fil : ${2*VO.ct<=VO.fil?`<b>${VO.fil} m suffiront</b>`:`<b>${VO.fil} m ne suffiront pas</b>`}.</p><p><b>2)</b> P, C, M et P, T, W sont alignés dans le même ordre.</p><p class="calc">${Fr("PC","PM")} = ${Fr(F(VO.pc),F(VO.pm))} ${qv(VO.pc,VO.pm)} et ${Fr("PT","PW")} = ${Fr(F(VO.pt),F(VO.pw))} ${qv(VO.pt,VO.pw)}</p><p>Les quotients ne sont pas égaux : d'après la propriété 2, <b>la couture n'est pas parallèle à (MW)</b>.</p>`}
 ]}
];
};
