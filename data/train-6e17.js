/* 6e · chapitre 17 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres */
TRAIN["6e-17"] = function(){
const {ri, pick, shuf, sp, distinct, items} = TR;
const {UA, convA, D, gridFig, perim, randCells} = window.FIG17;
const L = "abcdefgh";
/* calculs en chaîne : une étape par ligne, chaque ligne commence par « A = » (ou « P = », « l = »…) */
const KC = (nm, st, lab) => `<p class="calc">${st.map((t,i)=>(i===0&&lab?lab+" ":"")+nm+(t[0]==="≈"?" ≈ "+t.slice(1).trim():" = "+t)).join("<br>")}</p>`;
const KCS = arr => `<div class="calcs">${arr.map(x=>`<div>${x}</div>`).join("")}</div>`;

/* ---------- A. Aire et périmètre ---------- */
const figs = distinct(3, ()=>randCells(ri(7,12),7,5), x=>x.map(p=>p.join()).sort().join("|"));
const cols = ["#1f6db0","#e07a00","#1d7a46"], fills=["rgba(31,109,176,.22)","rgba(224,122,0,.22)","rgba(29,122,70,.22)"];
const sit = shuf([["Carreler une salle de bains","aire"],["Mettre une clôture autour d'un jardin","périmètre"],["Coller une frise autour d'une chambre","périmètre"],["Peindre un plafond","aire"],["Poser du gazon","aire"],["Faire le tour d'un stade en courant","périmètre"],["Couvrir un livre","aire"],["Poser des plinthes","périmètre"]]).slice(0,6);
const ar = pick([12,16,18,20]);   /* au moins trois rectangles différents */
const secA = {t:"Aire et périmètre", e:[
  {n:"Exercice 1", t:"Compter des carreaux", w:"Sur ton cahier", h:`<p>Donne l'aire (en carreaux) et le périmètre (en côtés de carreau) de chaque figure.</p><div class="figs">${figs.map((f,i)=>`<figure><figcaption>${L[i]})</figcaption>${gridFig(f,{n:7,m:5,c:20,col:cols[i],fill:fills[i]})}</figure>`).join("")}</div>`,
   c:items(figs.map(f=>`aire <b>${f.length} carreaux</b> ; périmètre <b>${perim(f)}</b> côtés de carreau`),"<br>",true)},
  {n:"Exercice 2", t:"Aire ou périmètre ?", w:"Sur ton cahier", h:`<p>${items(sit.map(s=>s[0]),"  ·  ",true)}</p>`,
   c:items(sit.map(s=>`<b>${s[1]}</b>`),"  ·  ",true)},
  {n:"Exercice 3", t:"Même aire", w:"Sur ton cahier", h:`<p>Trace trois rectangles différents d'aire ${ar} carreaux. Lequel a le plus petit périmètre ?</p>`,
   c:(()=>{ const r=[]; for(let l=1;l*l<=ar;l++) if(ar%l===0) r.push([ar/l,l]); return `<div class="figs">${r.map(([a,b])=>gridFig([...Array(ar)].map((_,i)=>[i%a,Math.floor(i/a)]),{n:a,m:b,c:12,alt:`rectangle ${a} × ${b}`})).join("")}</div><p>${r.map(([a,b])=>`${a} × ${b} : périmètre ${a} + ${b} + ${a} + ${b} = <b>${2*(a+b)}</b>`).join(" · ")}.</p><p>Le plus petit périmètre : <b>${r[r.length-1][0]} × ${r[r.length-1][1]}</b> (le plus proche d'un carré).</p>`; })()}
 ]};

/* ---------- B. Conversions ---------- */
const cv = distinct(8, ()=>{ const i=ri(2,6); let j; do{ j=ri(2,6); }while(j===i||Math.abs(i-j)>2); const k=pick([0,0,1,2]), n=ri(2,k?999:450); return [n,k,i,j]; }, x=>x.join());
const RG = distinct(5, ()=>{ const v=ri(5,60); return v; }, x=>x).map((v,q)=>{ const i=[3,4,5,6,3][q]; return {v, i, txt: convA(v,1,3,i)+" "+UA[i]}; });
const secB = {t:"Unités d'aire", e:[
  {n:"Exercice 4", t:"Convertir", w:"Sur ton cahier", h:`<p>${items(cv.map(([n,k,i,j])=>`${D(n,k)} ${UA[i]} = …… ${UA[j]}`),"  ·  ",true)}</p>`,
   c:items(cv.map(([n,k,i,j])=>`${D(n,k)} ${UA[i]} = (${D(n,k)} ${i<j?"×":"÷"} ${sp(100**Math.abs(i-j))}) ${UA[j]} = <b>${convA(n,k,i,j)} ${UA[j]}</b>`),"<br>",true)},
  {n:"Exercice 5", t:"Ranger des aires", w:"Sur ton cahier", h:`<p>Range dans l'ordre croissant : ${shuf(RG).map(x=>x.txt).join(" ; ")}</p>`,
   c:`<p>En m² : ${RG.map(x=>x.i===3?x.txt:`${x.txt} = ${D(x.v,1)} m²`).join(" ; ")}.</p><p class="calc"><b>${[...RG].sort((a,b)=>a.v-b.v).map(x=>x.txt).join(" &lt; ")}</b></p>`}
 ]};

/* ---------- C. Formules ---------- */
const r9 = shuf([ (()=>{ const c=ri(3,15); return {t:`un carré de côté ${c} cm`, c:KC("A",[`${c} × ${c}`,`<b>${c*c} cm²</b>`])}; })(),
  (()=>{ const a=ri(5,15), b=ri(2,a-1); return {t:`un rectangle de ${a} m sur ${b} m`, c:KC("A",[`${a} × ${b}`,`<b>${a*b} m²</b>`])}; })(),
  (()=>{ const c=ri(11,39); return {t:`un carré de côté ${D(c,1)} m`, c:KC("A",[`${D(c,1)} × ${D(c,1)}`,`<b>${D(c*c,2)} m²</b>`])}; })(),
  (()=>{ const a=ri(1,3), b=10*ri(2,9); return {t:`un rectangle de ${a} m sur ${b} cm (en cm²)`, c:`<p>${a} m = ${100*a} cm</p>`+KC("A",[`${100*a} × ${b}`,`<b>${sp(100*a*b)} cm²</b>`])}; })() ]);
const rows = [ (()=>{ const L=ri(5,12), l=ri(2,L-1); return [L,l,null,null,"cm"]; })(), (()=>{ const L=ri(8,15), l=ri(3,L-1); return [L,null,null,L*l,"dm"]; })(), (()=>{ const L=ri(6,12), l=ri(2,L-1); return [L,null,2*(L+l),null,"m",l]; })() ];
const ch = ri(3,6)*2, cl = ri(2,4)*2, prixM = ri(12,30);
const terr = pick([2,3,4]), carr = pick([20,25,50]);
const secC = {t:"Aire du carré et du rectangle", e:[
  {n:"Exercice 6", t:"Calculer des aires", w:"Sur ton cahier", h:`<p>${items(r9.map(x=>x.t),"  ·  ",true)}</p>`, c:KCS(r9.map((x,i)=>`<p><b>${L[i]})</b></p>${x.c}`))},
  {n:"Exercice 7", t:"Compléter le tableau", w:"Sur ton cahier", h:`<div class="scroll"><table class="std"><thead><tr><th>Longueur</th><th>Largeur</th><th>Périmètre</th><th>Aire</th></tr></thead><tbody>${rows.map(([L,l,P,A,u])=>`<tr><td>${L} ${u}</td><td>${l?l+" "+u:""}</td><td>${P?P+" "+u:""}</td><td>${A?A+" "+u+"²":""}</td></tr>`).join("")}</tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Longueur</th><th>Largeur</th><th>Périmètre</th><th>Aire</th></tr></thead><tbody>${rows.map(([L,l,P,A,u,l2])=>{ const ll = l || (A? A/L : l2); return `<tr><td>${L} ${u}</td><td>${l?l+" "+u:`<b>${ll} ${u}</b>`}</td><td>${P?P+" "+u:`<b>${2*(L+ll)} ${u}</b>`}</td><td>${A?A+" "+u+"²":`<b>${L*ll} ${u}²</b>`}</td></tr>`; }).join("")}</tbody></table></div>${rows.map(([L,l,P,A,u,l2],q)=>{ const ll = l || (A? A/L : l2); const lg=`Ligne ${q+1} : `;
     const kP = KC("P",[`2 × (${L} + ${ll})`,`2 × ${L+ll}`,`${2*(L+ll)} ${u}`]), kA = KC("A",[`${L} × ${ll}`,`${L*ll} ${u}²`]);
     if(l) return `<p><b>${lg}</b></p>${KCS([kP, kA])}`;
     if(A) return `<p><b>${lg}</b> pour trouver la largeur l, on divise l'aire par la longueur.</p>${KCS([KC("l",[`${A} ÷ ${L}`,`${ll} ${u}`]), kP])}`;
     return `<p><b>${lg}</b> la longueur et la largeur font la moitié du périmètre : ${P} ÷ 2 = ${P/2} ${u}.</p>${KCS([KC("l",[`${P/2} − ${L}`,`${ll} ${u}`]), kA])}`; }).join("")}`},
  {n:"Exercice 8", t:"Des problèmes", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> une chambre mesure ${D(ch*5,1)} m sur ${D(cl*5,1)} m. La moquette coûte ${prixM} € le m². Quel est le prix ?</p><p><b>Problème 2 :</b> une terrasse carrée de ${terr} m de côté est couverte de carreaux carrés de ${carr} cm de côté. Combien faut-il de carreaux ?</p>`,
   c:`<p><b>Problème 1 :</b> A = ${D(ch*5,1)} × ${D(cl*5,1)} = ${D(ch*cl*25,2)} m². Prix : ${D(ch*cl*25,2)} × ${prixM} = <b>${D(ch*cl*25*prixM,2)} €</b>.</p><p><b>Problème 2 :</b> ${terr} m = ${terr*100} cm ; ${terr*100} ÷ ${carr} = ${terr*100/carr} carreaux par rangée. ${terr*100/carr} × ${terr*100/carr} = <b>${(terr*100/carr)**2} carreaux</b>.</p>`}
 ]};

/* ---------- D. Figures complexes ---------- */
const sq = ri(6,12), ec = ri(2,sq-3), cg = ri(2,sq-3);
const ph = [ri(10,20), ri(6,12)], ep = pick([1,2,3]);
const Tb = [ri(8,14), ri(2,4)], Tp = [ri(2,4), ri(5,9)];
const secD = {t:"Aire d'une figure complexe", e:[
  {n:"Exercice 9", t:"Un carré entaillé", w:"Sur ton cahier", h:`<p>ABCD est un carré de côté ${sq} cm. Dans le coin C, on enlève un rectangle de ${ec} cm sur ${cg} cm. Calcule l'aire de la figure restante.</p>`,
   c:`<p>Le carré moins le rectangle enlevé.</p>${KC("A",[`${sq} × ${sq} − ${ec} × ${cg}`,`${sq*sq} − ${ec*cg}`,`<b>${sq*sq-ec*cg} cm²</b>`])}`},
  {n:"Exercice 10", t:"Une figure en T", w:"Sur ton cahier", h:`<p>Une figure en forme de T est formée d'une barre de ${Tb[0]} m sur ${Tb[1]} m et d'un pied de ${Tp[0]} m de large sur ${Tp[1]} m de haut (sous la barre). Calcule son aire.</p>`,
   c:`<p>La barre plus le pied.</p>${KC("A",[`${Tb[0]} × ${Tb[1]} + ${Tp[0]} × ${Tp[1]}`,`${Tb[0]*Tb[1]} + ${Tp[0]*Tp[1]}`,`<b>${Tb[0]*Tb[1]+Tp[0]*Tp[1]} m²</b>`])}`},
  {n:"Exercice 11", t:"Le cadre photo", w:"Sur ton cahier", h:`<p>Une photo de ${ph[0]} cm sur ${ph[1]} cm est entourée d'un cadre de ${ep} cm de large tout autour. Calcule l'aire du cadre.</p>`,
   c:`<p>Grand rectangle : ${ph[0]+2*ep} × ${ph[1]+2*ep} = ${(ph[0]+2*ep)*(ph[1]+2*ep)} cm². Photo : ${ph[0]} × ${ph[1]} = ${ph[0]*ph[1]} cm². Cadre : ${(ph[0]+2*ep)*(ph[1]+2*ep)} − ${ph[0]*ph[1]} = <b>${(ph[0]+2*ep)*(ph[1]+2*ep)-ph[0]*ph[1]} cm²</b>.</p>`}
 ]};

return [secA, secB, secC, secD];
};
