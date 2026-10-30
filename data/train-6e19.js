/* 6e · chapitre 19 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres assemblages */
TRAIN["6e-19"] = function(){
const {ri, pick, shuf, distinct, items} = TR;
const {vue, vues, iso, patronPave} = window.FIG19;
const L = "abcdefgh";

/* ---------- A. Solides ---------- */
const obj = shuf([["Une brique","pavé droit"],["Un rouleau d'essuie-tout","cylindre"],["Une orange","boule"],["Un chapeau pointu de fête","cône"],["Un Rubik's Cube","cube"],["Une barre chocolatée triangulaire","prisme droit"],["Une boîte de mouchoirs","pavé droit"],["Une bille","boule"],["Une bougie ronde","cylindre"]]).slice(0,6);
const sol = shuf([["cube",6,12,8],["pavé droit",6,12,8],["prisme droit à base triangulaire",5,9,6],["pyramide à base carrée",5,8,5],["pyramide à base triangulaire",4,6,4]]).slice(0,3);
const secA = {t:"Les solides", e:[
  {n:"Exercice 1", t:"Des objets et des solides", w:"Sur ton cahier", h:`<p>À quel solide fait penser chaque objet ? ${items(obj.map(o=>o[0]),"  ·  ",true)}</p>`, c:items(obj.map(o=>`<b>${o[1]}</b>`),"  ·  ",true)},
  {n:"Exercice 2", t:"Faces, arêtes, sommets", w:"Sur ton cahier", h:`<p>Donne le nombre de faces, d'arêtes et de sommets : ${items(sol.map(s=>s[0]),"  ·  ",true)}</p>`,
   c:items(sol.map(s=>`${s[0]} : <b>${s[1]} faces, ${s[2]} arêtes, ${s[3]} sommets</b>`),"<br>",true)}
 ]};

/* ---------- B. Patrons ---------- */
const NETS = [ [[1,0],[0,1],[1,1],[2,1],[1,2],[1,3]], [[0,0],[0,1],[1,1],[2,1],[3,1],[3,2]], [[0,0],[0,1],[1,1],[2,1],[3,1],[1,2]], [[0,0],[1,0],[1,1],[2,1],[3,1],[1,2]], [[0,0],[1,0],[1,1],[2,1],[2,2],[3,2]], [[0,0],[1,0],[2,0],[2,1],[3,1],[4,1]], [[0,0],[1,0],[1,1],[2,1],[3,1],[2,2]] ];
const BAD = [ [[0,0],[1,0],[2,0],[3,0],[4,0],[2,1]], [[1,0],[2,0],[0,1],[1,1],[2,1],[3,1]], [[0,0],[1,0],[0,1],[1,1],[2,1],[3,1]], [[0,0],[1,0],[1,1],[1,2],[2,2],[3,2]], [[0,0],[0,1],[1,1],[2,1],[2,0],[1,2]].map(p=>p) ];
/* (la vérification de BAD : 5 en ligne ; deux carrés du même côté ; un carré 2 × 2 ; deux faces au même endroit ; un U fermé par le bas : 4 faces autour d'un carré) */
const pool = shuf([...shuf(NETS).slice(0,3).map(c=>[c,true]), ...shuf(BAD).slice(0,3).map(c=>[c,false])]);
const dice = (()=>{ const base=[[1,0],[0,1],[1,1],[2,1],[1,2],[1,3]]; const opp=[[0,4],[1,3],[2,5]]; /* indices opposés */ const nums=shuf([1,2,3,4,5,6]); const v=Array(6); const pairs=shuf([[1,6],[2,5],[3,4]]).map(p=>shuf(p)); opp.forEach(([i,j],k)=>{ v[i]=pairs[k][0]; v[j]=pairs[k][1]; }); const shown=shuf([0,1,2,3,4,5]).slice(0,3); while(new Set(shown.map(i=>opp.findIndex(p=>p.includes(i)))).size<3){ shown.splice(0,3,...shuf([0,1,2,3,4,5]).slice(0,3)); } return {base,v,shown}; })();
let pv; do{ pv = [ri(3,7), ri(2,5), ri(1,4)]; }while(pv[0]<=pv[1] || pv[1]<=pv[2]); /* trois dimensions différentes */
const secB = {t:"Patrons", e:[
  {n:"Exercice 3", t:"Patrons de cube ?", w:"Sur ton cahier", h:`<p>Lesquelles de ces figures sont des patrons de cube ?</p><div class="figs">${pool.map(([c],i)=>vue(c,L[i]+")",{c:20})).join("")}</div>`,
   c:`<p>Patrons de cube : <b>${pool.map((p,i)=>p[1]?L[i]:null).filter(Boolean).join(", ")}</b>.</p><p>Les autres ne se plient pas en cube : deux carrés viendraient au même endroit (ou il manquerait une face).</p>`},
  {n:"Exercice 4", t:"Le patron du dé", w:"Sur ton cahier", h:`<p>Sur un dé, deux faces opposées ont une somme égale à 7. Complète ce patron.</p><div class="figs">${vue(dice.base,"",{c:34,nums:dice.shown.map(i=>[...dice.base[i],dice.v[i]])})}</div>`,
   c:`<div class="figs">${vue(dice.base,"",{c:34,nums:dice.base.map((p,i)=>[...p,dice.v[i]])})}</div><p>Dans la colonne de 4 carrés, deux carrés séparés par un carré sont opposés ; les deux carrés de côté sont opposés.</p>`},
  {n:"Exercice 5", t:"Construire un patron", w:"Sur ton cahier", h:`<p>Construis un patron d'un pavé droit de ${pv[0]} cm sur ${pv[1]} cm sur ${pv[2]} cm.</p>`,
   c:`<p>Il faut 6 rectangles : deux de ${pv[0]} × ${pv[1]}, deux de ${pv[0]} × ${pv[2]} et deux de ${pv[1]} × ${pv[2]}. Par exemple, une bande ${pv[0]} × ${pv[1]}, ${pv[0]} × ${pv[2]}, ${pv[0]} × ${pv[1]}, ${pv[0]} × ${pv[2]}, avec deux rectangles ${pv[1]} × ${pv[2]} de part et d'autre (figure réduite) :</p>${patronPave(pv[0],pv[1],pv[2])}`}
 ]};

/* ---------- C. Volumes ---------- */
const randH = (R,C,max) => { for(;;){ const h=[...Array(R)].map(()=>[...Array(C)].map(()=>ri(0,max))); /* le devant n'est jamais vide, et un cube n'est jamais « en l'air » */ if(h[0].every(x=>x>0) && h.flat().some(x=>x>1) && (R<2 || h[1].every((x,c)=>x>=h[0][c]))) return h; } };
const asm = [randH(1,ri(3,4),3), randH(2,3,2), randH(2,3,3)];
const box = [ri(3,8), ri(2,5), ri(2,4)];
const gc = ri(2,4);
const secC = {t:"Volumes", e:[
  {n:"Exercice 6", t:"Compter les cubes", w:"Sur ton cahier", h:`<p>Chaque cube a un volume de 1 cm³. Les assemblages sont pleins (les cubes qui soutiennent les autres sont présents). Donne le volume de chacun.</p><div class="figs">${asm.map((h,i)=>`<figure><figcaption>${L[i]})</figcaption>${iso(h,{s:28})}</figure>`).join("")}</div>`,
   c:items(asm.map(h=>`${h.map((row,r)=>`${h.length>1?(r===0?"devant":"derrière")+" : ":""}${row.join(" + ")}`).join(" ; ")} = <b>${h.flat().reduce((s,x)=>s+x,0)} cm³</b>`),"<br>",true)},
  {n:"Exercice 7", t:"Couche par couche", w:"Sur ton cahier", h:`<p>Une boîte mesure ${box[0]} cm de long, ${box[1]} cm de large et ${box[2]} cm de haut. Combien de cubes de 1 cm³ peut-on y ranger ?</p><p>Un grand cube a ${gc} petits cubes de côté : combien de petits cubes contient-il ?</p>`,
   c:`<p>Une couche : ${box[0]} × ${box[1]} = ${box[0]*box[1]} cubes ; ${box[2]} couches : ${box[2]} × ${box[0]*box[1]} = <b>${box[0]*box[1]*box[2]} cubes</b>, soit ${box[0]*box[1]*box[2]} cm³.</p><p>${gc} × ${gc} × ${gc} = <b>${gc**3} petits cubes</b>.</p>`}
 ]};

/* ---------- D. Vues ---------- */
const hv = randH(2,3,3);
const V = vues(hv);
const cote = [[ri(0,3),ri(1,3),ri(0,3)],[ri(1,3),ri(1,3),ri(1,3)]];
const secD = {t:"Voir dans l'espace", e:[
  {n:"Exercice 8", t:"Dessiner les vues", w:"Sur ton cahier", h:`<p>Dessine les vues de dessus, de face et de droite de cet assemblage (2 rangées : devant et derrière ; l'assemblage est plein).</p>${iso(hv,{s:30})}<p class="note">Hauteurs : devant ${hv[0].join(", ")} ; derrière ${hv[1].join(", ")} (de gauche à droite).</p>`,
   c:`<div class="figs">${vue(V.top,"Vue de dessus")}${vue(V.face,"Vue de face")}${vue(V.droite,"Vue de droite")}</div><p><i>Vue de face : la plus grande hauteur de chaque colonne. Vue de droite : le devant est à gauche.</i></p>`},
  {n:"Exercice 9", t:"La vue de dessus cotée", w:"Sur ton cahier", h:`<p>Voici une vue de dessus cotée (le chiffre indique le nombre de cubes empilés).</p><div class="figs">${vue([0,1,2].flatMap(c=>[0,1].map(r=>[c,1-r])).filter(([c,y])=>cote[1-y][c]>0),"",{c:34,nums:[0,1,2].flatMap(c=>[0,1].map(r=>[c,1-r,cote[r][c]])).filter(([c,y,t])=>t>0)})}</div><p class="note">La ligne du bas est le devant.</p><p>Combien de cubes ? Dessine la vue de face.</p>`,
   c:(()=>{ const tot=cote.flat().reduce((s,x)=>s+x,0), hf=[0,1,2].map(c=>Math.max(cote[0][c],cote[1][c])), Hm=Math.max(...hf); const cells=[]; hf.forEach((m,c)=>{ for(let k=0;k<m;k++) cells.push([c,Hm-1-k]); }); return `<p>On additionne les nombres des cases : ${cote.flat().filter(x=>x>0).join(" + ")} = <b>${tot} cubes</b> (${tot} cm³).</p><div class="figs">${vue(cells,"Vue de face")}</div><p>Hauteurs vues de face : ${hf.join(", ")}.</p>`; })()}
 ]};

return [secA, secB, secC, secD];
};
