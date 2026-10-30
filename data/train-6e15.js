/* 6e · chapitre 15 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres mesures */
TRAIN["6e-15"] = function(){
const {ri, pick, shuf, distinct, items} = TR;
const {rays} = window.FIG15;
const A = n => `<span class="ang">${n}</span>`;
const fr = x => String(x).replace(".",",");
/* calculs en chaîne : une étape par ligne, chaque ligne commence par le nom de l'angle suivi de « = » */
const KC = (nm, st, lab) => `<p class="calc">${st.map((t,i)=>(i===0&&lab?lab+" ":"")+nm+" = "+t).join("<br>")}</p>`;
const KCS = arr => `<div class="calcs">${arr.map(x=>`<div>${x}</div>`).join("")}</div>`;

/* ---------- A. Adjacents ---------- */
const a1=ri(20,45), b1=ri(30,60), t1=a1+b1+ri(25,60);
const secA = {t:"Angles adjacents", e:[
  {n:"Exercice 1", t:"Ajouter des angles adjacents", w:"Sur ton cahier", h:`${rays([{a:0,n:"A"},{a:a1,n:"B"},{a:a1+b1,n:"C"},{a:t1,n:"D"}],{arcs:[{a0:0,a1:a1,t:a1+"°"},{a0:a1,a1:a1+b1,t:b1+"°",c:"o",r:36}],O:"O",w:280,cx:120,h:180})}<p>Sur cette figure à main levée, ${A("AOB")} = ${a1}°, ${A("BOC")} = ${b1}° et ${A("AOD")} = ${t1}°.</p><p>1) Calcule ${A("AOC")}. 2) Calcule ${A("COD")}. 3) Nomme deux angles adjacents à ${A("BOC")}.</p>`,
   c:`<p>1) ${A("AOB")} et ${A("BOC")} sont adjacents :</p>${KC(A("AOC"),[`${a1}° + ${b1}°`,`<b>${a1+b1}°</b>`])}<p>2) ${A("AOC")} et ${A("COD")} sont adjacents :</p>${KC(A("COD"),[`${A("AOD")} − ${A("AOC")}`,`${t1}° − ${a1+b1}°`,`<b>${t1-a1-b1}°</b>`])}<p>3) ${A("AOB")} et ${A("COD")}.</p>`}
 ]};

/* ---------- B. Complémentaires, supplémentaires ---------- */
const tb = shuf([ri(5,85), ri(5,85), ri(91,175), ri(10,80)+0.5, ri(91,175), ri(5,85)]);
const cA = ri(30,150), cB = ri(20,70), cC = ri(15,70);
const secB = {t:"Complémentaires et supplémentaires", e:[
  {n:"Exercice 2", t:"Compléter un tableau", w:"Sur ton cahier", h:`<p>Complète le tableau. Si ce n'est pas possible, écris une croix.</p><div class="scroll"><table class="std"><thead><tr><th>Mesure de l'angle</th>${tb.map(x=>`<th>${fr(x)}°</th>`).join("")}</tr></thead><tbody><tr><th>Angle complémentaire</th>${tb.map(()=>`<td style="height:2.6em;min-width:3.6em"></td>`).join("")}</tr><tr><th>Angle supplémentaire</th>${tb.map(()=>`<td style="height:2.6em;min-width:3.6em"></td>`).join("")}</tr></tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Mesure de l'angle</th>${tb.map(x=>`<th>${fr(x)}°</th>`).join("")}</tr></thead><tbody><tr><th>Angle complémentaire</th>${tb.map(x=>`<td>${x<90?fr(90-x)+"°":"✗"}</td>`).join("")}</tr><tr><th>Angle supplémentaire</th>${tb.map(x=>`<td>${fr(180-x)}°</td>`).join("")}</tr></tbody></table></div><p>Un angle de plus de 90° n'a pas de complémentaire.</p>`},
  {n:"Exercice 3", t:"Calculer un angle", w:"Sur ton cahier", h:`<div class="figs"><figure><figcaption>a) A, O et B alignés</figcaption>${rays([{a:0,n:"B"},{a:180,n:"A"},{a:180-cA,n:"C"}],{arcs:[{a0:180-cA,a1:180,t:cA+"°"},{a0:0,a1:180-cA,t:"?",c:"r",r:22}],O:"O",w:260,cx:130})}</figure><figure><figcaption>b) ${A("xOz")} droit</figcaption>${rays([{a:0,n:"x"},{a:cB,n:"y"},{a:90,n:"z"}],{arcs:[{a0:0,a1:cB,t:cB+"°"},{a0:cB,a1:90,t:"?",c:"r",r:36}],right:[0],O:"O",w:200,cx:40,h:160})}</figure><figure><figcaption>c) A, O et B alignés</figcaption>${rays([{a:0,n:"B"},{a:180,n:"A"},{a:180-cC,n:"C"},{a:90-cC,n:"D"}],{arcs:[{a0:180-cC,a1:180,t:cC+"°"},{a0:0,a1:90-cC,t:"?",c:"r",r:24}],right:[90-cC],O:"O",w:260,cx:130})}</figure></div><p>Les figures sont à main levée. Calcule les angles marqués « ? » en justifiant.</p>`,
   c:`<p>a) Les angles sont supplémentaires :</p>${KC(A("COB"),[`180° − ${cA}°`,`<b>${180-cA}°</b>`])}<p>b) Les angles sont complémentaires :</p>${KC(A("yOz"),[`90° − ${cB}°`,`<b>${90-cB}°</b>`])}<p>c) Les trois angles forment un angle plat :</p>${KC(A("DOB"),[`180° − (${cC}° + 90°)`,`180° − ${cC+90}°`,`<b>${90-cC}°</b>`])}`}
 ]};

/* ---------- C. Opposés par le sommet ---------- */
const o1 = ri(25,155), o2a = ri(25,60), o2b = ri(40,80);
const secC = {t:"Angles opposés par le sommet", e:[
  {n:"Exercice 4", t:"Deux droites sécantes", w:"Sur ton cahier", h:`<p>Les droites (AC) et (BD) se coupent en O, et ${A("AOB")} = ${o1}°. Calcule ${A("COD")}, ${A("BOC")} et ${A("DOA")} en justifiant.</p>`,
   c:`${rays([{a:90-o1/2+o1,n:"A"},{a:90-o1/2,n:"B"},{a:270-o1/2+o1,n:"C"},{a:270-o1/2,n:"D"}],{arcs:[{a0:90-o1/2,a1:90+o1/2,t:o1+"°"},{a0:270-o1/2,a1:270+o1/2,t:o1+"°"}],O:"O",w:240,h:240,cy:120,L:95})}<p>${A("COD")} = <b>${o1}°</b> (opposé par le sommet à ${A("AOB")}).</p><p>${A("AOB")} et ${A("BOC")} sont supplémentaires :</p>${KC(A("BOC"),[`180° − ${o1}°`,`<b>${180-o1}°</b>`])}<p>${A("DOA")} = <b>${180-o1}°</b> (opposé par le sommet à ${A("BOC")}).</p>`},
  {n:"Exercice 5", t:"Trois droites", w:"Sur ton cahier", h:`<p>Les droites (AD), (BE) et (CF) se coupent en O, avec ${A("AOB")} = ${o2a}° et ${A("BOC")} = ${o2b}° (les demi-droites [OA), [OB), [OC), [OD) se suivent dans cet ordre). Calcule ${A("COD")}, ${A("DOE")}, ${A("EOF")} et ${A("FOA")}.</p>`,
   c:`<p>A, O et D sont alignés : ${A("AOB")}, ${A("BOC")} et ${A("COD")} forment un angle plat.</p>${KC(A("COD"),[`180° − (${o2a}° + ${o2b}°)`,`180° − ${o2a+o2b}°`,`<b>${180-o2a-o2b}°</b>`])}<p>${A("DOE")} = <b>${o2a}°</b> ; ${A("EOF")} = <b>${o2b}°</b> ; ${A("FOA")} = <b>${180-o2a-o2b}°</b> (angles opposés par le sommet).</p>`}
 ]};

/* ---------- D. Bissectrice ---------- */
const bz = ri(15,80), by = 2*ri(20,85)+1, bang = 2*ri(20,70);
const secD = {t:"La bissectrice", e:[
  {n:"Exercice 6", t:"Calculer avec la bissectrice", w:"Sur ton cahier", h:`<p>[Oz) est la bissectrice de ${A("xOy")}.</p><p>1) ${A("xOz")} = ${bz}°. Calcule ${A("xOy")}. 2) ${A("xOy")} = ${by}°. Calcule ${A("zOy")}.</p>`,
   c:`${KCS([KC(A("xOy"),[`2 × ${bz}°`,`<b>${2*bz}°</b>`],"1)"), KC(A("zOy"),[`${by}° ÷ 2`,`<b>${fr(by/2)}°</b>`],"2)")])}`},
  {n:"Exercice 7", t:"Construire une bissectrice", w:"Sur ton cahier", h:`<p>Construis un angle ${A("xOy")} de ${bang}°, puis sa bissectrice [Oz) : d'abord avec le rapporteur, puis vérifie au compas.</p>`,
   c:`${rays([{a:0,n:"x"},{a:bang,n:"y"},{a:bang/2,n:"z",c:"r"}],{arcs:[{a0:0,a1:bang/2,t:bang/2+"°"},{a0:bang/2,a1:bang,t:bang/2+"°",r:40}],O:"O",w:260,cx:bang>90?125:60,h:170})}<p>${bang}° ÷ 2 = ${bang/2}° : je trace [Oz) telle que ${A("xOz")} = <b>${bang/2}°</b>.</p>`}
 ]};

return [secA, secB, secC, secD];
};
