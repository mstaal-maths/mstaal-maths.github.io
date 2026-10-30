/* 6e · chapitre 18 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres situations */
TRAIN["6e-18"] = function(){
const {ri, pick, shuf, distinct, items} = TR;
const {echelle, sac, roue, P, F} = window.FIG18;

/* ---------- A. Vocabulaire ---------- */
const sacA = [["rouge",ri(2,6)],["bleue",ri(1,4)]];
const evA = shuf([["Tirer une boule rouge","possible","il y a des boules rouges, mais aussi des bleues"],["Tirer une boule jaune","impossible","il n'y a aucune boule jaune"],["Tirer une boule rouge ou bleue","certain","toutes les boules sont rouges ou bleues"],["Tirer une boule bleue","possible","il y a des boules bleues, mais aussi des rouges"],["Tirer une boule qui n'est pas verte","certain","il n'y a aucune boule verte"]]).slice(0,4);
const mot = pick(["TABLE","POMME","SOLEIL","CAHIER","MAISON"]);
const ev = shuf([["un nombre pair",[2,4,6]],["un multiple de 3",[3,6]],["plus de 3",[4,5,6]],["moins de 3",[1,2]],["un nombre impair",[1,3,5]],["8",[]],["un nombre entre 1 et 6",[1,2,3,4,5,6]]]).slice(0,5);
const secA = {t:"Vocabulaire", e:[
  {n:"Exercice 1", t:"Issues et événements", w:"Sur ton cahier", h:`<p>1) Écris les issues quand on tire une lettre au hasard du mot ${mot}.</p><p>2) On lance un dé à 6 faces. Écris les issues qui réalisent chaque événement : ${items(ev.map(e=>`« obtenir ${e[0]} »`),"  ·  ",true)}</p>`,
   c:`<p>1) ${[...new Set(mot.split(""))].join(", ")}${(()=>{ const dbl=[...new Set(mot.split(""))].filter(l=>mot.split(l).length>2); return dbl.length?` (${dbl.length>1?"les lettres "+dbl.join(" et ")+" sont présentes":"la lettre "+dbl[0]+" est présente"} deux fois, sur deux cartons)`:""; })()}.</p><p>2) ${items(ev.map(e=>e[1].length?e[1].join(", ")+(e[1].length===6?" : <b>certain</b>":""):"aucune : <b>impossible</b>"),"  ·  ",true)}</p>`},
  {n:"Exercice 2", t:"Impossible, possible ou certain ?", w:"Sur ton cahier", h:`<div class="cpt"><div><p>On tire une boule au hasard dans ce sac.</p><p>${items(evA.map(e=>e[0]),"<br>",true)}</p></div>${sac(sacA)}</div>`,
   c:items(evA.map(e=>`<b>${e[1]}</b> : ${e[2]}.`),"<br>",true)},
  {n:"Exercice 3", t:"L'échelle des probabilités", w:"Sur ton cahier", h:(()=>{ const s=shuf([["A","Obtenir face avec une pièce",0.5],["B","Obtenir 0 avec un dé",0],["C","Obtenir moins de 5 avec un dé",4/6],["D","Obtenir 6 avec un dé",1/6],["E","Obtenir un nombre entier avec un dé",1]]); secA_e = s; return `<p>Place chaque événement sur l'échelle de 0 à 1 :</p><p>${s.map(x=>`${x[0]} : « ${x[1]} »`).join("<br>")}</p>${echelle([])}`; })(), c:""}
 ]};
var secA_e; secA.e[2].c = `${echelle(secA_e.map(x=>[x[0],x[2]]))}<p>${secA_e.map(x=>`${x[0]} : ${x[2]===0?"0 (impossible)":x[2]===1?"1 (certain)":x[2]===0.5?"½ (une chance sur deux)":x[2]===4/6?F(4,6)+" = "+F(2,3)+" (4 issues sur 6 : 1, 2, 3, 4)":F(1,6)+" (une issue sur 6)"}`).join(" · ")}</p>`;

/* ---------- B. Calculer des probabilités ---------- */
const r=ri(2,7), b=ri(1,5), v=ri(1,4), tot=r+b+v;
const N = pick([10,12,15,20,30]);
const evN = shuf([["un nombre pair",x=>x%2===0],["un multiple de 5",x=>x%5===0],["un multiple de 3",x=>x%3===0],["un nombre à deux chiffres",x=>x>=10],["un nombre plus petit que 5",x=>x<5],["le nombre 7",x=>x===7]]).slice(0,4);
const cnt = f => [...Array(N)].map((_,i)=>i+1).filter(f).length;
const lst = f => { const a=[...Array(N)].map((_,i)=>i+1).filter(f); return a.length<=7 ? a.join(", ") : `${a[0]}, ${a[1]}, …, ${a[a.length-1]} (${a.length} nombres)`; };
const wcols = shuf(["rouge","rouge","rouge","bleue","bleue","jaune","verte","rouge"]);
const nc = c => wcols.filter(x=>x===c).length;
const wn = c => wcols.map((x,i)=>x===c?i+1:0).filter(Boolean).join(", ");
const mot2 = pick(["MATHEMATIQUES","GEOMETRIE","ADDITION","FRACTION","PROBABILITE"]);
const voy = mot2.split("").filter(c=>"AEIOUY".includes(c)).length;
const lt = pick([...new Set(mot2.split(""))]);
const secB = {t:"Calculer des probabilités", e:[
  {n:"Exercice 4", t:"Le sac de boules", w:"Sur ton cahier", h:`<div class="cpt"><div><p>Un sac contient ${r} boules rouges, ${b} bleue${b>1?"s":""} et ${v} verte${v>1?"s":""}. On tire une boule au hasard.</p><p>a) Probabilité de tirer une rouge ? une bleue ? une verte ? b) Que vaut la somme A de ces trois probabilités ?</p></div>${sac([["rouge",r],["bleue",b],["verte",v]])}</div>`,
   c:`<p>a) ${tot} boules : rouge <b>${P(r,tot)}</b> ; bleue <b>${P(b,tot)}</b> ; verte <b>${P(v,tot)}</b>.</p><p class="calc">b) A = ${F(r,tot)} + ${F(b,tot)} + ${F(v,tot)}<br>A = ${F(tot,tot)}<br>A = <b>1</b></p>`},
  {n:"Exercice 5", t:"L'urne", w:"Sur ton cahier", h:`<p>Une urne contient ${N} étiquettes numérotées de 1 à ${N}. Probabilité de tirer : ${items(evN.map(e=>e[0]),"  ·  ",true)}</p>`,
   c:`<p>Il y a ${N} issues équiprobables.</p><p>${items(evN.map(e=>`${lst(e[1])} : <b>${P(cnt(e[1]),N)}</b>`),"<br>",true)}</p>`},
  {n:"Exercice 6", t:"La roue", w:"Sur ton cahier", h:`<div class="cpt"><div><p>La roue a 8 secteurs égaux, numérotés de 1 à 8. Probabilité de tomber : a) sur le rouge ; b) sur le bleu ; c) sur un nombre pair ; d) sur un nombre plus grand que 5 ; e) sur le violet.</p></div>${roue(wcols,true)}</div>`,
   c:`<p>Il y a 8 secteurs égaux : 8 issues équiprobables.</p><p>a) rouge (${wn("rouge")}) : <b>${P(nc("rouge"),8)}</b> · b) bleu (${wn("bleue")}) : <b>${P(nc("bleue"),8)}</b> · c) pair (2, 4, 6, 8) : <b>${P(4,8)}</b> · d) 6, 7, 8 : <b>${F(3,8)}</b> · e) aucun secteur violet : <b>0</b></p>`},
  {n:"Exercice 7", t:"Une lettre au hasard", w:"Sur ton cahier", h:`<p>On écrit chaque lettre du mot ${mot2} sur un carton et on tire un carton au hasard. Probabilité de tirer : a) la lettre ${lt} ; b) une voyelle ; c) la lettre W.</p>`,
   c:(()=>{ const nl=mot2.split("").filter(c=>c===lt).length, vv=mot2.split("").filter(c=>"AEIOUY".includes(c)); return `<p>Le mot a ${mot2.length} lettres, donc ${mot2.length} cartons.</p><p>a) ${nl===1?"une seule lettre "+lt:nl+" lettres "+lt} : <b>${P(nl, mot2.length)}</b> · b) ${vv.join(", ")} (${voy} voyelles) : <b>${P(voy, mot2.length)}</b> · c) aucune lettre W : <b>0</b></p>`; })()}
 ]};

/* ---------- C. Fréquence ---------- */
const n = pick([20,50,100,200]), k = Math.round(n*(0.4+Math.random()*0.2));
const truq = pick([1,2,3,4,5,6]);
const lancers = [1,2,3,4,5,6].map(f=>f===truq? ri(280,320) : ri(50,70));
const totL = lancers.reduce((s,x)=>s+x,0);
const secC = {t:"Fréquence et probabilité", e:[
  {n:"Exercice 8", t:"Pile ou face", w:"Sur ton cahier", h:`<p>Sur ${n} lancers d'une pièce, Noé a obtenu ${k} fois « pile ». Calcule la fréquence de « pile ». Est-elle proche de la probabilité ?</p>`,
   c:`<p>Fréquence : ${k} ÷ ${n} = <b>${String(k/n).replace(".",",")}</b>. La probabilité est 0,5 : ${Math.abs(k/n-0.5)<=0.06?"c'est proche":"il y a un petit écart, normal avec peu de lancers"}.</p>`},
  {n:"Exercice 9", t:"Un dé truqué ?", w:"Sur ton cahier", h:`<p>Un dé a été lancé ${totL} fois.</p><div class="scroll"><table class="std"><thead><tr><th>Face</th>${[1,2,3,4,5,6].map(f=>`<th>${f}</th>`).join("")}</tr></thead><tbody><tr><th>Nombre de fois</th>${lancers.map(x=>`<td>${x}</td>`).join("")}</tr></tbody></table></div><p>Ce dé est-il équilibré ? Explique.</p>`,
   c:`<p>Avec un dé équilibré, chaque face sortirait environ ${totL} ÷ 6 ${totL%6===0?"=":"≈"} ${Math.round(totL/6)} fois. Ici la face ${truq} sort ${lancers[truq-1]} fois (fréquence ≈ ${String(Math.round(lancers[truq-1]/totL*100)/100).replace(".",",")}) : <b>le dé est sûrement truqué</b>.</p>`}
 ]};

return [secA, secB, secC];
};
