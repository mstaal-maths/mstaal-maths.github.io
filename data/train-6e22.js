/* 6e · chapitre 22 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres */
TRAIN["6e-22"] = function(){
const {ri, pick, shuf, distinct, items} = TR;
const {quad, D} = window.FIG22;
const F = (a,b) => `{${a}/${b}}`;
const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g," ");

/* ---------- A. Agrandir, réduire ---------- */
const tri = (()=>{ let t; do{ t = distinct(3, ()=>2*ri(1,6), x=>x).sort((a,b)=>a-b); }while(t[0]+t[1]<=t[2]); return t; })(); /* un vrai triangle */
const k1 = pick([1.5,2,3]), k2 = pick([2,4]);
const P = tri.reduce((s,x)=>s+x,0);
/* figure sur quadrillage à agrandir × 2 */
const L = pick([ [[0,0],[3,0],[3,1],[1,1],[1,2],[0,2]], [[0,0],[2,0],[2,1],[3,1],[3,2],[0,2]], [[1,0],[2,0],[2,1],[3,1],[3,2],[0,2],[0,1],[1,1]], [[0,0],[3,0],[3,2],[2,2],[2,1],[0,1]] ]);
const vf = shuf([["Les angles sont multipliés par 2.",false,"les angles gardent la même mesure"],["Le périmètre est multiplié par 2.",true,"chaque côté est multiplié par 2, donc leur somme aussi"],["Un rectangle reste un rectangle.",true,"la forme est conservée"],["Deux droites perpendiculaires restent perpendiculaires.",true,"les angles droits restent droits"],["On ajoute 2 cm à chaque longueur.",false,"on multiplie chaque longueur par 2"]]).slice(0,4);
const secA = {t:"Agrandir ou réduire", e:[
  {n:"Exercice 1", t:"Compléter le tableau", w:"Sur ton cahier", h:`<p>Un triangle a des côtés de ${tri.join(" cm, ")} cm. Complète le tableau.</p><div class="scroll"><table class="std"><thead><tr><th></th><th>Côté 1</th><th>Côté 2</th><th>Côté 3</th><th>Périmètre</th></tr></thead><tbody><tr><th>Départ</th>${tri.map(x=>`<td>${x} cm</td>`).join("")}<td></td></tr><tr><th>Agrandi × ${String(k1).replace(".",",")}</th><td></td><td></td><td></td><td></td></tr><tr><th>Réduit (÷ ${k2})</th><td></td><td></td><td></td><td></td></tr></tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th></th><th>Côté 1</th><th>Côté 2</th><th>Côté 3</th><th>Périmètre</th></tr></thead><tbody><tr><th>Départ</th>${tri.map(x=>`<td>${x} cm</td>`).join("")}<td><b>${P} cm</b></td></tr><tr><th>Agrandi × ${String(k1).replace(".",",")}</th>${tri.map(x=>`<td><b>${D(x*k1*10,1)} cm</b></td>`).join("")}<td><b>${D(P*k1*10,1)} cm</b></td></tr><tr><th>Réduit (÷ ${k2})</th>${tri.map(x=>`<td><b>${D(x*100/k2,2)} cm</b></td>`).join("")}<td><b>${D(P*100/k2,2)} cm</b></td></tr></tbody></table></div><p>Périmètre de départ : ${tri.join(" + ")} = ${P} cm.</p><p>Agrandi : ${tri.map(x=>`${x} × ${String(k1).replace(".",",")} = ${D(x*k1*10,1)}`).join(" ; ")}.</p><p>Réduit : ${tri.map(x=>`${x} ÷ ${k2} = ${D(x*100/k2,2)}`).join(" ; ")}.</p><p>Le périmètre est lui aussi multiplié par ${String(k1).replace(".",",")} (${P} × ${String(k1).replace(".",",")} = ${D(P*k1*10,1)}) ou divisé par ${k2} (${P} ÷ ${k2} = ${D(P*100/k2,2)}).</p>`},
  {n:"Exercice 2", t:"Agrandir sur quadrillage", w:"Sur ton cahier (quadrillage)", h:`<p>Reproduis cette figure en multipliant toutes ses longueurs par 2.</p>${quad([[L,"#1e5aa8","rgba(30,90,168,.15)"]],{n:4,m:3,c:22})}`,
   c:`${quad([[L.map(([x,y])=>[2*x,2*y]),"#e07a00","rgba(224,122,0,.18)"]],{n:7,m:5,c:22})}<p>Chaque segment a deux fois plus de carreaux.</p>`},
  {n:"Exercice 3", t:"Vrai ou faux ?", w:"Sur ton cahier", h:`<p>On agrandit une figure 2 fois.</p><p>${items(vf.map(x=>x[0]),"<br>",true)}</p>`, c:items(vf.map(x=>`<b>${x[1]?"Vrai":"Faux"}</b> : ${x[2]}.`),"<br>",true)}
 ]};

/* ---------- B. Échelles ---------- */
const pl = [ri(3,9), ri(2,6)+pick([0,0.5])];
const carte = ri(2,9)+pick([0,0.5]), dist = ri(5,25);
const ech2 = pick([25000,50000]), cm2 = ri(2,8);
const maq = pick([[18,25],[24,15],[43,10],[87,5]]);
const tour = pick([["d'une tour de 120 m",12000,1000,"Hauteur"],["d'un immeuble de 45 m",4500,500,"Hauteur"],["d'un pont de 300 m",30000,1000,"Longueur"]]);
const ins = pick([[5,3],[10,2],[4,5]]);
const secB = {t:"Plans et cartes", e:[
  {n:"Exercice 4", t:"Le plan au 1/100", w:"Sur ton cahier", h:`<p>Sur un plan à l'échelle ${F(1,100)}, une pièce mesure ${D(pl[0]*10,1)} cm sur ${D(pl[1]*10,1)} cm. Quelles sont ses dimensions réelles ? Un couloir mesure ${D(pl[0]*10+5,1)} m en réalité : combien mesure-t-il sur le plan ?</p>`,
   c:`<p>1 cm représente 1 m : la pièce mesure <b>${D(pl[0]*10,1)} m sur ${D(pl[1]*10,1)} m</b>. Le couloir : ${D(pl[0]*10+5,1)} m = ${pl[0]*100+50} cm ; ${pl[0]*100+50} ÷ 100 = <b>${D(pl[0]*10+5,1)} cm</b> sur le plan.</p>`},
  {n:"Exercice 5", t:"La carte", w:"Sur ton cahier", h:`<p>a) Sur une carte au ${F(1,"100 000")}, deux villes sont à ${D(carte*10,1)} cm. Distance réelle ? Deux autres villes sont à ${dist} km : distance sur la carte ?</p><p>b) Sur une carte au ${F(1,sp(ech2))}, un chemin mesure ${cm2} cm. Quelle est sa longueur réelle, en m puis en km ?</p>`,
   c:`<p>a) 1 cm représente 1 km : ${D(carte*10,1)} × 1 km = <b>${D(carte*10,1)} km</b>. Et ${dist} km sont représentés par <b>${dist} cm</b> sur la carte.</p><p>b) La longueur réelle L :</p><p class="calc">L = ${cm2} × ${sp(ech2)}<br>L = ${sp(cm2*ech2)} cm<br>L = <b>${sp(cm2*ech2/100)} m</b><br>L = <b>${D(cm2*ech2/100,3)} km</b></p>`},
  {n:"Exercice 6", t:"Maquettes et dessins", w:"Sur ton cahier", h:`<p>a) Une maquette au ${F(1,maq[0])} mesure ${maq[1]} cm. Longueur réelle (en m) ?</p><p>b) ${tour[3]} ${tour[0]} sur une maquette au ${F(1,sp(tour[2]))} ?</p><p>c) Sur un dessin agrandi ${ins[0]} fois, un insecte mesure ${ins[0]*ins[1]} cm. Sa longueur réelle ?</p>`,
   c:`<p>a) La longueur réelle L :</p><p class="calc">L = ${maq[1]} × ${maq[0]}<br>L = ${maq[0]*maq[1]} cm<br>L = <b>${D(maq[0]*maq[1],2)} m</b></p><p>b) ${tour[1]/100} m = ${sp(tour[1])} cm ; ${sp(tour[1])} ÷ ${sp(tour[2])} = <b>${tour[1]/tour[2]} cm</b>.</p><p>c) ${ins[0]*ins[1]} ÷ ${ins[0]} = <b>${ins[1]} cm</b>.</p>`}
 ]};

return [secA, secB];
};
