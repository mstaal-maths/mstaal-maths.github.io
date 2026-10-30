/* 6e · chapitre 21 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres données */
TRAIN["6e-21"] = function(){
const {ri, pick, shuf, distinct, items} = TR;
const {barres, repere} = window.FIG21;

/* ---------- A. Tableaux ---------- */
const cats = pick([["pomme","banane","fraise","kiwi"],["rouge","bleu","vert","jaune"],["foot","basket","danse","natation"]]);
const data = shuf(cats.flatMap(c=>Array(ri(2,7)).fill(c)));
const eff = cats.map(c=>data.filter(x=>x===c).length);
const T = [0,1,2].map(()=>[ri(2,12),ri(2,12),ri(2,12)]);
const lig = ["6e A","6e B","6e C"], colN = ["Cantine","Maison","Autre"];
const rowT = T.map(r=>r.reduce((s,x)=>s+x,0)), colT=[0,1,2].map(j=>T.reduce((s,r)=>s+r[j],0)), tot=rowT.reduce((s,x)=>s+x,0);
const mx = (arr) => arr.indexOf(Math.max(...arr));
const secA = {t:"Tableaux", e:[
  {n:"Exercice 1", t:"Le tableau d'effectifs", w:"Sur ton cahier", h:`<p>On a demandé à ${data.length} élèves leur choix préféré : ${data.join(", ")}.</p><p>Range les données dans un tableau d'effectifs et vérifie le total.</p>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Choix</th>${cats.map(c=>`<th>${c}</th>`).join("")}<th>Total</th></tr></thead><tbody><tr><th>Effectif</th>${eff.map(e=>`<td>${e}</td>`).join("")}<td>${data.length}</td></tr></tbody></table></div><p>${eff.join(" + ")} = ${data.length}.</p>`},
  {n:"Exercice 2", t:"Le tableau à double entrée", w:"Sur ton cahier", h:`<p>Où déjeunent les élèves de trois classes ?</p><div class="scroll"><table class="std"><thead><tr><th></th>${colN.map(c=>`<th>${c}</th>`).join("")}<th>Total</th></tr></thead><tbody>${T.map((r,i)=>`<tr><th>${lig[i]}</th>${r.map(x=>`<td>${x}</td>`).join("")}<td></td></tr>`).join("")}<tr><th>Total</th><td></td><td></td><td></td><td></td></tr></tbody></table></div><p>a) Complète les totaux. b) Combien d'élèves de ${lig[1]} déjeunent à la maison ? c) Quelle classe a le plus d'élèves ? d) Quel lieu est le plus fréquent ?</p>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th></th>${colN.map(c=>`<th>${c}</th>`).join("")}<th>Total</th></tr></thead><tbody>${T.map((r,i)=>`<tr><th>${lig[i]}</th>${r.map(x=>`<td>${x}</td>`).join("")}<td><b>${rowT[i]}</b></td></tr>`).join("")}<tr><th>Total</th>${colT.map(x=>`<td><b>${x}</b></td>`).join("")}<td><b>${tot}</b></td></tr></tbody></table></div><p>b) Ligne « ${lig[1]} », colonne « Maison » : <b>${T[1][1]}</b>.</p><p>c) Totaux des lignes : ${rowT.join(", ")}. ${rowT.filter(x=>x===Math.max(...rowT)).length>1?"plusieurs classes à égalité : "+lig.filter((_,i)=>rowT[i]===Math.max(...rowT)).join(" et "):`<b>${lig[mx(rowT)]}</b>`} (${Math.max(...rowT)} élèves).</p><p>d) Totaux des colonnes : ${colT.join(", ")}. ${colT.filter(x=>x===Math.max(...colT)).length>1?"égalité : "+colN.filter((_,i)=>colT[i]===Math.max(...colT)).join(" et "):`<b>${colN[mx(colT)]}</b>`} (${Math.max(...colT)} élèves).</p>`}
 ]};

/* ---------- B. Sélectionner ---------- */
const villes = shuf([["Lille",233000,"Nord"],["Nantes",323000,"Ouest"],["Brest",140000,"Ouest"],["Lyon",522000,"Est"],["Rennes",225000,"Ouest"],["Nancy",104000,"Est"],["Rouen",114000,"Nord"],["Dijon",160000,"Est"]]).slice(0,6);
const seuil = pick([150000,200000]);
const zone = pick(["Ouest","Est","Nord"]);
const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g," ");
const secB = {t:"Sélectionner des données", e:[
  {n:"Exercice 3", t:"Des villes", w:"Sur ton cahier", h:`<p>Voici des villes (nombre d'habitants arrondi) et leur région :</p><div class="scroll"><table class="std"><thead><tr><th>Ville</th><th>Habitants</th><th>Région</th></tr></thead><tbody>${villes.map(v=>`<tr><td>${v[0]}</td><td>${sp(v[1])}</td><td>${v[2]}</td></tr>`).join("")}</tbody></table></div><p>a) Cite les villes de plus de ${sp(seuil)} habitants. b) Cite les villes de la région ${zone}. c) Range les villes de la moins peuplée à la plus peuplée.</p>`,
   c:`<p>a) ${villes.filter(v=>v[1]>seuil).map(v=>`${v[0]} (${sp(v[1])})`).join(", ")||"aucune"}.</p><p>b) ${villes.filter(v=>v[2]===zone).map(v=>v[0]).join(", ")||"aucune ville de cette région dans le tableau"}.</p><p>c) ${[...villes].sort((a,b)=>a[1]-b[1]).map(v=>`${v[0]} (${sp(v[1])})`).join(" &lt; ")}.</p>`}
 ]};

/* ---------- C. Représentations ---------- */
const Lb = shuf(["Foot","Basket","Tennis","Danse","Judo","Rugby"]).slice(0,5);
const vb = (()=>{ for(;;){ const v=Lb.map(()=>ri(1,12)); if(new Set(v).size===5) return v; } })();
const pts = distinct(5, ()=>[ri(0,11), ri(0,8)], x=>x.join()).map((p,i)=>["ABCDE"[i],...p]);
const newp = distinct(2, ()=>[ri(1,11), ri(1,8)], x=>x.join()).filter(p=>!pts.some(q=>q[1]===p[0]&&q[2]===p[1])).map((p,i)=>["GH"[i],...p]);
const jour = (()=>{ const s=ri(8,10), c=pick([6,7,8]), l=ri(2,Math.min(5,20-s-c)), r=2, t=1, d=24-s-c-l-r-t; return {s,c,l,r,t,d}; })();
const secC = {t:"Lire des représentations", e:[
  {n:"Exercice 4", t:"Le diagramme en barres", w:"Sur ton cahier", h:`${barres(Lb,vb,{step:1,title:"Sport préféré"})}<p>a) Combien d'élèves préfèrent « ${Lb[2]} » ? b) Quel sport est le plus choisi ? le moins choisi ? c) Combien d'élèves ont répondu ?</p>`,
   c:`<p>a) la barre « ${Lb[2]} » monte à ${vb[2]} : <b>${vb[2]}</b> · b) le plus : <b>${Lb[mx(vb)]}</b> (${Math.max(...vb)}) ; le moins : <b>${Lb[vb.indexOf(Math.min(...vb))]}</b> (${Math.min(...vb)}) · c) j'additionne les hauteurs des barres : ${vb.join(" + ")} = <b>${vb.reduce((s,x)=>s+x,0)}</b></p>`},
  {n:"Exercice 5", t:"Une journée", w:"Sur ton cahier", h:`<p>Sur une journée de 24 h, Noam dort ${jour.s} h, passe ${jour.c} h au collège, ${jour.l} h en loisirs, ${jour.r} h à table et ${jour.t} h dans les trajets. Le reste du temps, il fait ses devoirs.</p><p>a) Combien de temps durent ses devoirs ? b) Dort-il plus ou moins d'un tiers de la journée ? c) Le collège occupe-t-il plus ou moins d'un quart de la journée ?</p>`,
   c:`<p>a) 24 − (${jour.s} + ${jour.c} + ${jour.l} + ${jour.r} + ${jour.t}) = <b>${jour.d} h</b>.</p><p>b) Un tiers : 24 ÷ 3 = 8 h. ${jour.s} h est ${jour.s>8?"<b>plus</b> qu'un tiers":jour.s<8?"<b>moins</b> qu'un tiers":"<b>exactement</b> un tiers"}.</p><p>c) Un quart : 24 ÷ 4 = 6 h. ${jour.c} h est ${jour.c>6?"<b>plus</b> qu'un quart":jour.c<6?"<b>moins</b> qu'un quart":"<b>exactement</b> un quart"}.</p>`},
  {n:"Exercice 6", t:"Des points dans un repère", w:"Sur ton cahier", h:`${repere(pts,{c:22})}<p>a) Donne les coordonnées des points A, B, C, D et E. b) Place ${newp.map(p=>`${p[0]}(${p[1]} ; ${p[2]})`).join(" et ")}.</p>`,
   c:`<p>a) ${pts.map(p=>`<b>${p[0]}(${p[1]} ; ${p[2]})</b>`).join(" · ")}</p>${repere([...pts, ...newp.map(p=>[...p,"#d0342c"])],{c:22})}`}
 ]};

return [secA, secB, secC];
};
