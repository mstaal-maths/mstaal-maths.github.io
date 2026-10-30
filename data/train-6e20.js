/* 6e · chapitre 20 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres */
TRAIN["6e-20"] = function(){
const {ri, pick, shuf, sp, distinct, items} = TR;
const {cent, D, F} = window.FIG20;
const L = "abcdef";
/* calculs en chaîne : une étape par ligne, chaque ligne commence par « A = » (ou « P = », « l = »…) */
const KC = (nm, st, lab) => `<p class="calc">${st.map((t,i)=>(i===0&&lab?lab+" ":"")+nm+(t[0]==="≈"?" ≈ "+t.slice(1).trim():" = "+t)).join("<br>")}</p>`;
const KCS = arr => `<div class="calcs">${arr.map(x=>`<div>${x}</div>`).join("")}</div>`;
const NM = "ABCDEF";

/* ---------- A. Sens ---------- */
const cs = distinct(3, ()=>ri(3,97), x=>x);
const col = distinct(3, ()=>5*ri(1,19), x=>x);
const vf = shuf([["50 % = 0,5",true,"50 % = "+F(50,100)+" = 0,5"],["25 %, c'est le quart",true,"25 % = "+F(25,100)+" = "+F(1,4)],["1 % = 0,1",false,"1 % = "+F(1,100)+" = 0,01"],["10 % = "+F(1,10),true,"10 % = "+F(10,100)+" = "+F(1,10)],["75 %, c'est les trois quarts",true,"75 % = "+F(75,100)+" = "+F(3,4)],["20 % = 0,02",false,"20 % = "+F(20,100)+" = 0,2"],["5 % = 0,05",true,"5 % = "+F(5,100)+" = 0,05"],["100 %, c'est la moitié",false,"100 %, c'est le tout ; la moitié, c'est 50 %"]]).slice(0,5);
const secA = {t:"Le sens d'un pourcentage", e:[
  {n:"Exercice 1", t:"Le carré de 100", w:"Sur ton cahier", h:`<p>Quel pourcentage de chaque carré est colorié ?</p><div class="figs">${cs.map((n,i)=>`<figure><figcaption>${L[i]})</figcaption>${cent(n,{c:12})}</figure>`).join("")}</div>`,
   c:items(cs.map(n=>`${F(n,100)} = <b>${n} %</b>`),"  ·  ",true)},
  {n:"Exercice 2", t:"À toi de colorier", w:"Sur ton cahier", h:`<p>Colorie le pourcentage demandé de chaque carré de 100 carreaux.</p><div class="figs">${col.map((n,i)=>`<figure><figcaption>${L[i]}) ${n} %</figcaption>${cent(0,{c:16}).replace("0 carreaux coloriés sur 100","Un carré de 100 carreaux à colorier")}</figure>`).join("")}</div>`,
   c:`<div class="figs">${col.map((n,i)=>`<figure><figcaption>${L[i]}) ${n} carreaux</figcaption>${cent(n,{c:11})}</figure>`).join("")}</div>`},
  {n:"Exercice 3", t:"Vrai ou faux ?", w:"Sur ton cahier", h:`<p>${items(vf.map(x=>x[0]),"  ·  ",true)}</p>`, c:items(vf.map(x=>`<b>${x[1]?"Vrai":"Faux"}</b> : ${x[2]}`),"<br>",true)}
 ]};

/* ---------- B. Proportions ---------- */
const pr = distinct(5, ()=>{ const t=pick([4,5,10,20,25,50,200]), k=100/t; const n = t===200 ? 2*ri(5,90) : ri(1,t-1); return [n,t]; }, x=>x.join());
const pc = ([n,t]) => n*100/t;
const sha = (()=>{ const t1=pick([20,25]), t2=t1*2; let a,b; do{ a=ri(Math.ceil(t1/2),t1-1); b=ri(Math.ceil(t2/2),t2-1); }while(a*100/t1===b*100/t2); return {t1,t2,a,b}; })();
const son = (()=>{ const tot=pick([20,25,50]); let v; do{ const a=ri(1,tot-3), b=ri(1,tot-a-2), c=ri(1,tot-a-b-1); v=[a,b,c,tot-a-b-c]; }while(v.some(x=>x<=0)); return {tot,v}; })();
const secB = {t:"Calculer une proportion", e:[
  {n:"Exercice 4", t:"Des proportions", w:"Sur ton cahier", h:`<p>Écris chaque proportion sous forme de fraction puis de pourcentage : ${items(pr.map(([n,t])=>`${n} sur ${t}`),"  ·  ",true)}</p>`,
   c:items(pr.map(([n,t])=>`${F(n,t)} = ${t===200?F(n/2,100):F(n*100/t,100)} = <b>${pc([n,t])} %</b>`),"  ·  ",true)},
  {n:"Exercice 5", t:"Qui est le plus adroit ?", w:"Sur ton cahier", h:`<p>Malo a réussi ${sha.a} tirs sur ${sha.t1}. Jade a réussi ${sha.b} tirs sur ${sha.t2}. Qui est le plus adroit ?</p>`,
   c:`<p>Malo : ${F(sha.a,sha.t1)} = ${F(sha.a*100/sha.t1,100)} = <b>${sha.a*100/sha.t1} %</b>.</p><p>Jade : ${F(sha.b,sha.t2)} = ${sha.t2===50?F(sha.b*2,100):`${sha.b} ÷ 40 = ${D(sha.b*25,3)}`} = <b>${D(sha.b*1000/sha.t2,1)} %</b>.</p><p>${sha.a*100/sha.t1>sha.b*100/sha.t2?"Le plus adroit est <b>Malo</b>":"La plus adroite est <b>Jade</b>"} (on compare les pourcentages, pas les nombres de tirs réussis).</p>`},
  {n:"Exercice 6", t:"Le sondage", w:"Sur ton cahier", h:`<p>${son.tot} élèves ont choisi leur dessert préféré : fruits ${son.v[0]}, glace ${son.v[1]}, gâteau ${son.v[2]}, yaourt ${son.v[3]}. Donne le pourcentage de chaque dessert.</p>`,
   c:`<p>${["fruits","glace","gâteau","yaourt"].map((n,i)=>`${n} : ${F(son.v[i],son.tot)} = ${F(son.v[i]*100/son.tot,100)} = <b>${son.v[i]*100/son.tot} %</b>`).join(" · ")}.</p><p>Total : 100 %.</p>`}
 ]};

/* ---------- C. Appliquer ---------- */
const N0 = pick([80,120,160,200,240,360]);
const ap = distinct(5, ()=>{ const p=ri(2,60), N=pick([ri(11,99)*5, ri(101,999), 10*ri(11,90)]); return [p,N]; }, x=>x.join());
/* b) des élèves : le résultat doit être un nombre entier */
ap[1] = (()=>{ let p,N; do{ p=ri(2,60); N=ri(101,999); }while((N*p)%100); return [p,N]; })();
const unit = ["€","élèves","kg","m","L"];
const og = shuf([[pick([48,49,51,52]),"la moitié",2],[pick([24,26]),"le quart",4],[pick([9,11]),"le dixième",10],[pick([74,76]),"les trois quarts",4/3]]);
const ogN = og.map(([p,_,d])=> d===10 ? 10*ri(10,60) : 20*ri(3,30));
const pull = 10*ri(3,12), rem = pick([10,20,25,30,50]);
const ch = pick([100,150,200,250]), cac = pick([40,55,70,85]);
const vil = 100*ri(15,60), jeu = pick([8,12,15,18]);
const secC = {t:"Appliquer un pourcentage", e:[
  {n:"Exercice 7", t:"Calcul mental", w:"Sur ton cahier", h:`<p>Calcule de tête : ${items([50,25,10,20,5,75].map(p=>`${p} % de ${N0}`),"  ·  ",true)}</p>`,
   c:items([50,25,10,20,5,75].map(p=>`${p} % de ${N0} = ${({50:`${N0} ÷ 2`,25:`${N0} ÷ 4`,10:`${N0} ÷ 10`,20:`2 × ${N0/10}`,5:`${N0/10} ÷ 2`,75:`3 × ${N0/4}`})[p]} = <b>${N0*p/100}</b>`),"  ·  ",true)},
  {n:"Exercice 8", t:"Calculer un pourcentage", w:"Sur ton cahier", h:`<p>Calcule en posant « N × p ÷ 100 » : ${items(ap.map(([p,N],i)=>`${NM[i]} = ${p} % de ${sp(N)} ${unit[i]}`),"  ·  ",true)}</p>`,
   c:KCS(ap.map(([p,N],i)=>KC(NM[i],[`${p} % de ${sp(N)} ${unit[i]}`,`${sp(N)} × ${p} ÷ 100`,`${sp(N*p)} ÷ 100`,`<b>${D(N*p,2)} ${unit[i]}</b>`],L[i]+")")))},
  {n:"Exercice 9", t:"Ordre de grandeur", w:"Sur ton cahier", h:`<p>Donne un ordre de grandeur : ${items(og.map(([p],i)=>`${p} % de ${sp(ogN[i]+ri(-3,3))}`),"  ·  ",true)}</p>`,
   c:items(og.map(([p,mot,d],i)=>`≈ ${mot} de ${sp(ogN[i])} : <b>environ ${sp(d===4/3? ogN[i]*3/4 : ogN[i]/d)}</b>`),"  ·  ",true)},
  {n:"Exercice 10", t:"Des problèmes", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> un pull coûte ${pull} €, avec une remise de ${rem} %. Montant de la remise ? Nouveau prix ?</p><p><b>Problème 2 :</b> une tablette de ${ch} g contient ${cac} % de cacao. Quelle masse de cacao ?</p><p><b>Problème 3 :</b> un village de ${sp(vil)} habitants compte ${jeu} % d'enfants de moins de 10 ans. Combien d'enfants ?</p>`,
   c:`<p><b>Problème 1 :</b> la remise R :</p>${KC("R",[`${rem} % de ${pull} €`,`${pull} × ${rem} ÷ 100`,`<b>${D(pull*rem,2)} €</b>`])}<p>Nouveau prix : ${pull} − ${D(pull*rem,2)} = <b>${D(pull*100-pull*rem,2)} €</b>.</p><p><b>Problème 2 :</b> la masse M de cacao :</p>${KC("M",[`${cac} % de ${ch} g`,`${ch} × ${cac} ÷ 100`,`<b>${D(ch*cac,2)} g</b>`])}<p><b>Problème 3 :</b> le nombre N d'enfants :</p>${KC("N",[`${jeu} % de ${sp(vil)}`,`${sp(vil)} × ${jeu} ÷ 100`,`<b>${sp(vil*jeu/100)} enfants</b>`])}`}
 ]};

return [secA, secB, secC];
};
