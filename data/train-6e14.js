/* 6e · chapitre 14 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres */
TRAIN["6e-14"] = function(){
const {ri, pick, shuf, sp, distinct, items} = TR;
const {U, conv, D} = window.FIG14;
const fr = x => String(x).replace(".",",");
const r1 = (x,k) => fr((Math.round(x*10**k)/10**k).toFixed(k));
/* calculs en chaîne : une étape par ligne, chaque ligne commence par « P = » (« P ≈ » pour une valeur arrondie) */
const KC = (nm, st, lab) => `<p class="calc">${st.map((t,i)=>(i===0&&lab?lab+" ":"")+nm+(t[0]==="≈"?" ≈ "+t.slice(1).trim():" = "+t)).join("<br>")}</p>`;
const KCS = arr => `<div class="calcs">${arr.map(x=>`<div>${x}</div>`).join("")}</div>`;

/* ---------- A. Conversions ---------- */
const mk = (t, near) => { const i=ri(0,6); let j; do{ j=ri(0,6); }while(j===i || (near && Math.abs(i-j)>3)); const k=pick([0,0,1,2]), n=ri(2,k?999:950); return {t,i,j,n,k}; };
const why = c => { const d=c.j-c.i; return ` (${U[c.t][c.i]} → ${U[c.t][c.j]} : ${d>0?"× "+sp(10**d):"÷ "+sp(10**(-d))})`; };
const cL = distinct(8, ()=>mk("L",true), x=>[x.i,x.j,x.n].join());
const cMC = distinct(8, ()=>mk(pick(["M","C"]),true), x=>[x.t,x.i,x.j,x.n].join());
const lst = (() => { const base = distinct(5, ()=>ri(80,160), x=>x); /* en cm */ const unit = shuf([[3,2],[4,1],[5,0],[6,-1],[2,3]]); return base.map((v,q)=>{ const [j,e]=unit[q]; /* j = unité, e = décalage (cm→unité j) */ return {cm:v, txt: e>=0 ? D(v,e)+" "+U.L[j] : sp(v*10**(-e))+" "+U.L[j]}; }); })();
const verre = pick([20,25,30]), bout = verre*ri(4,8);
const sac = ri(2,5), rec = pick([150,250,300,350,400]);
const q2 = Math.floor(sac*1000/rec), r2 = sac*1000 - q2*rec;
const secA = {t:"Unités et conversions", e:[
  {n:"Exercice 1", t:"Convertir des longueurs", w:"Sur ton cahier", h:`<p>${items(cL.map(c=>`${D(c.n,c.k)} ${U[c.t][c.i]} = …… ${U[c.t][c.j]}`),"  ·  ",true)}</p>`,
   c:items(cL.map(c=>`${D(c.n,c.k)} ${U[c.t][c.i]} = <b>${conv(c.n,c.k,c.i,c.j)} ${U[c.t][c.j]}</b>${why(c)}`),"  ·  ",true)},
  {n:"Exercice 2", t:"Masses et contenances", w:"Sur ton cahier", h:`<p>${items(cMC.map(c=>`${D(c.n,c.k)} ${U[c.t][c.i]} = …… ${U[c.t][c.j]}`),"  ·  ",true)}</p>`,
   c:items(cMC.map(c=>`${D(c.n,c.k)} ${U[c.t][c.i]} = <b>${conv(c.n,c.k,c.i,c.j)} ${U[c.t][c.j]}</b>${why(c)}`),"  ·  ",true)},
  {n:"Exercice 3", t:"Ranger des longueurs", w:"Sur ton cahier", h:`<p>Range dans l'ordre croissant : ${lst.map(x=>x.txt).join(" ; ")}.</p>`,
   c:`<p>En cm : ${lst.map(x=>`${x.txt} = ${x.cm} cm`).join(" ; ")}.</p><p class="calc"><b>${[...lst].sort((a,b)=>a.cm-b.cm).map(x=>x.txt).join(" &lt; ")}</b></p>`},
  {n:"Exercice 4", t:"Problèmes", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> une bouteille contient ${D(bout,2)} L. Combien de verres de ${verre} cL peut-on remplir ?</p><p><b>Problème 2 :</b> un sac contient ${sac} kg de farine. Une recette utilise ${rec} g de farine. Combien de recettes peut-on faire ? Quelle masse reste-t-il ?</p>`,
   c:`<p><b>Problème 1 :</b> ${D(bout,2)} L = ${bout} cL. ${bout} ÷ ${verre} = ${bout/verre} : <b>${bout/verre} verres</b>.</p><p><b>Problème 2 :</b> ${sac} kg = ${sp(sac*1000)} g. ${sp(sac*1000)} = ${rec} × ${q2} + ${r2} : <b>${q2} recettes</b>, et ${r2?`il reste <b>${r2} g</b>`:"il ne reste <b>rien</b>"}.</p>`}
 ]};

/* ---------- B. Périmètres ---------- */
const sq = ri(25,95), rL = ri(15,40), rlcm = 10*ri(4,9);
let poly; do{ poly = distinct(5, ()=>ri(18,95), x=>x); }while(2*Math.max(...poly) >= poly.reduce((a,b)=>a+b,0)); /* le plus grand côté < somme des autres */ const pu = shuf(["cm","cm","mm","dm","cm"]);
const pv = poly.map((v,i)=>pu[i]==="cm"?{t:D(v,1)+" cm",cm:v}:pu[i]==="mm"?{t:sp(v)+" mm",cm:v}:{t:D(v,2)+" dm",cm:v});
/* valeurs en dixièmes de cm : cm→ v/10 ; mm → v mm = v/10 cm ; dm → v/100 dm = v/10 cm */
const pc = ri(12,30)*4+pick([1,2,3]), rp = ri(20,40), rlen = ri(6,Math.floor(rp/2)-1);
const ch = [ri(8,15)*10, ri(5,9)*10], rg = ri(2,4), rou = pick([200,250,300]);
const fil = 2*(ch[0]+ch[1])*rg, nr = Math.ceil(fil/rou);
const secB = {t:"Calculer des périmètres", e:[
  {n:"Exercice 5", t:"Carrés et rectangles", w:"Sur ton cahier", h:`<p>1) Périmètre d'un carré de ${D(sq,1)} m de côté ?</p><p>2) Périmètre d'un rectangle de ${D(rL,1)} m sur ${rlcm} cm ? Attention aux unités !</p>`,
   c:`${KC("P",[`4 × ${D(sq,1)}`,`<b>${D(4*sq,1)} m</b>`],"1)")}<p>2) ${rlcm} cm = ${D(rlcm,2)} m.</p>${KC("P",[`2 × (${D(rL,1)} + ${D(rlcm,2)})`,`2 × ${D(rL*10+rlcm,2)}`,`<b>${D(2*(rL*10+rlcm),2)} m</b>`])}`},
  {n:"Exercice 6", t:"Un polygone", w:"Sur ton cahier", h:`<p>Un pentagone a pour côtés : ${pv.map(x=>x.t).join(" ; ")}. Calcule son périmètre en cm.</p>`,
   c:`<p>En cm : ${pv.map(x=>`${x.t} = ${D(x.cm,1)} cm`).join(" ; ")}.</p><p class="calc">P = ${pv.map(x=>D(x.cm,1)).join(" + ")}<br>P = <b>${D(pv.reduce((s,x)=>s+x.cm,0),1)} cm</b></p>`},
  {n:"Exercice 7", t:"Retrouver une longueur", w:"Sur ton cahier", h:`<p>1) Un carré a un périmètre de ${pc} m. Longueur de son côté ?</p><p>2) Un rectangle a un périmètre de ${rp*2} cm et une longueur de ${rp-rlen} cm. Sa largeur ?</p>`,
   c:`<p>1) ${pc} ÷ 4 = <b>${D(pc*25,2)} m</b>.</p><p>2) ${rp*2} ÷ 2 = ${rp} ; ${rp} − ${rp-rlen} = <b>${rlen} cm</b>.</p>`},
  {n:"Exercice 8", t:"Clôturer un champ", w:"Sur ton cahier", h:`<p>Un champ rectangulaire mesure ${ch[0]} m sur ${ch[1]} m. On l'entoure avec ${rg} rangées de fil, vendu en rouleaux de ${rou} m. Combien de fil faut-il ? Combien de rouleaux ?</p>`,
   c:`<p>Périmètre : 2 × (${ch[0]} + ${ch[1]}) = ${2*(ch[0]+ch[1])} m. Avec ${rg} rangées : ${rg} × ${2*(ch[0]+ch[1])} = <b>${sp(fil)} m</b>.</p><p>${sp(fil)} = ${rou} × ${Math.floor(fil/rou)} + ${fil%rou}${fil%rou?` : il faut un rouleau de plus`:""}. Il faut <b>${nr} rouleaux</b>.</p>`}
 ]};

/* ---------- C. Cercles ---------- */
const cd = ri(3,25), crr = ri(2,15), cd2 = ri(11,99), roue = pick([50,60,66,70,71]), tours = pick([10,50,100]);
const dc = ri(4,12), pl = ri(60,100), pd = ri(50,80);
const secC = {t:"La longueur d'un cercle", e:[
  {n:"Exercice 9", t:"Ordre de grandeur et calcul", w:"Sur ton cahier", h:`<p>a) Un cercle a un diamètre de ${cd} cm. b) Un cercle a un rayon de ${crr} cm.</p><p>1) Donne un ordre de grandeur de leur longueur (π ≈ 3). 2) Calcule leur longueur, arrondie à l'unité.</p>`,
   c:`<p>1) a) environ 3 × ${cd} = <b>${3*cd} cm</b> ; b) le diamètre est ${2*crr} cm : environ 3 × ${2*crr} = <b>${6*crr} cm</b>.</p><p>2)</p>${KCS([KC("P",["π × d",`π × ${cd}`,`≈ ${r1(Math.PI*cd,2)}`,`≈ <b>${Math.round(Math.PI*cd)} cm</b>`],"a)"), KC("P",["2 × π × r",`2 × π × ${crr}`,`≈ ${r1(2*Math.PI*crr,2)}`,`≈ <b>${Math.round(2*Math.PI*crr)} cm</b>`],"b)")])}`},
  {n:"Exercice 10", t:"Des problèmes", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> un cadran rond a un diamètre de ${D(cd2,1)} cm. Sa longueur, arrondie au dixième ?</p><p><b>Problème 2 :</b> une roue a un diamètre de ${roue} cm. Quelle distance parcourt-elle en 1 tour ? En ${tours} tours ? (arrondis au dixième)</p>`,
   c:`<p><b>Problème 1 :</b> la longueur P du cadran :</p><p class="calc">P = π × ${D(cd2,1)}<br>P ≈ ${r1(Math.PI*cd2/10,3)}</p><p>Soit environ <b>${r1(Math.PI*cd2/10,1)} cm</b>.</p><p><b>Problème 2 :</b> en 1 tour, la longueur P de la roue :</p><p class="calc">P = π × ${roue}<br>P ≈ <b>${r1(Math.PI*roue,1)} cm</b></p><p>En ${tours} tours, la distance d :</p><p class="calc">d = ${tours} × π × ${roue}<br>d ≈ <b>${sp(r1(tours*Math.PI*roue,1).split(",")[0])},${r1(tours*Math.PI*roue,1).split(",")[1]} cm</b></p>`},
  {n:"Exercice 11", t:"Demi-cercle et piste", w:"Sur ton cahier", h:`<p>1) Une figure est formée d'un demi-cercle de diamètre [AB] et du segment [AB], avec AB = ${dc} cm. Son périmètre, arrondi au dixième ?</p><p>2) Une piste est formée de deux lignes droites de ${pl} m et de deux demi-cercles de ${pd} m de diamètre. Longueur d'un tour, arrondie au mètre ?</p>`,
   c:`<p>1) Demi-cercle : π × ${dc} ÷ 2 ≈ ${r1(Math.PI*dc/2,2)} cm. P ≈ ${r1(Math.PI*dc/2,2)} + ${dc} ≈ <b>${r1(Math.PI*dc/2+dc,1)} cm</b>.</p><p>2) Les deux demi-cercles font un cercle : π × ${pd} ≈ ${r1(Math.PI*pd,2)} m. Tour : ${r1(Math.PI*pd,2)} + 2 × ${pl} ≈ <b>${Math.round(Math.PI*pd+2*pl)} m</b>.</p>`}
 ]};

return [secA, secB, secC];
};
