/* 4e — Chapitre 12 : Calcul littéral 2 — Développer et factoriser à l'aide de la simple distributivité
   (cours B2 complété, cours « Développement et factorisation » pour la partie 2, activités, feuille d'exercices et sa correction)
   Lettres en italique, 3<i>x</i> sans signe ×. Les calculs utilisent l'outil window.CL7 (défini dans 4e-7.js). */
(function(){
const {ri,pick,shuf,uniq,ch3,nz,r3,F,X,T,E,red,R,fac,prod,opp,svgT,prog,progs,tab}=window.CL7;
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const x=X("x"), y=X("y"), k=X("k"), a=X("a"), b=X("b");
const S=ts=>E(red(ts));
const gcd=(m,n)=>n?gcd(n,m%n):m;
/* deux entiers premiers entre eux (pour que le facteur commun soit le plus grand) */
const cop=(lo,hi)=>{ let p,q; do{ p=ri(lo,hi); q=ri(lo,hi); }while(gcd(p,q)!==1); return [p,q]; };                 /* réduit, dans l'ordre d'apparition (comme M. Staal) */
/* une expression entre parenthèses : (a + b) */
const P=ts=>`(${E(ts)})`;
/* étapes du développement de k × (t1 + t2) (ou (t1 + t2) × k) : lignes de calcul */
function devK(K, ts){
  const l1=ts.map((t,i)=>`${fac(K,i===0)} × ${fac(t)}`).join(" + ");
  const ps=ts.map(t=>prod(K,t));
  const l2=ps.map((p,i)=>i===0?E([p]):(p[0]<0?` + (${E([p])})`:` + ${E([p])}`)).join("");
  const l3=E(ps);
  return l2===l3?[l1,l3]:[l1,l2,l3];
}
window.CL12={S,P,devK};

/* rectangle coté (SVG) : top = [[texte, largeur]…], left = texte, inner = texte au centre */
function rect(o){
  const {top, left, inner="", H=90, fill="color-mix(in srgb,var(--c) 16%,transparent)"}=o;
  const W=top.reduce((s,t)=>s+t[1],0), x0=46, y0=40, w=W+x0+20, h=H+y0+14;
  let s=`<svg class="fig" viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="${o.alt||"Rectangle"}"><rect x="${x0}" y="${y0}" width="${W}" height="${H}" style="fill:${fill};stroke:var(--ink);stroke-width:2"/>`;
  let cx=x0;
  top.forEach(([t,wd],i)=>{ if(i>0) s+=`<line x1="${cx}" y1="${y0}" x2="${cx}" y2="${y0+H}" class="ln"/>`;
    s+=`<path d="M${cx+2} 24 H${cx+wd-2} M${cx+8} 19 L${cx+2} 24 L${cx+8} 29 M${cx+wd-8} 19 L${cx+wd-2} 24 L${cx+wd-8} 29" class="thin"/><text x="${cx+wd/2}" y="16" class="lab" style="font-size:17px">${svgT(t)}</text>`; cx+=wd; });
  s+=`<path d="M28 ${y0+2} V${y0+H-2} M23 ${y0+8} L28 ${y0+2} L33 ${y0+8} M23 ${y0+H-8} L28 ${y0+H-2} L33 ${y0+H-8}" class="thin"/><text x="13" y="${y0+H/2+6}" class="lab" style="font-size:17px">${svgT(left)}</text>`;
  if(inner) s+=`<text x="${x0+W/2}" y="${y0+H/2+6}" class="lab" style="font-size:18px">${svgT(inner)}</text>`;
  return s+"</svg>";
}
window.CL12.rect=rect;

/* ===================== schémas ===================== */
const S_SP=sch("Somme ou produit ?",`<p class="calc">3${x} + 2 : une <b>somme</b> &nbsp;&nbsp; −7 × (2${x} + 4) : un <b>produit</b></p><p class="calc">4 + (4${x} + 3) : une <b>somme</b> &nbsp;&nbsp; (${x} + 3) × 5 : un <b>produit</b></p><p class="schN">Je regarde la <b>dernière opération</b> à effectuer : une addition ou une soustraction → somme ; une multiplication → produit.</p>`);
const S_DEV=sch("Développer : la simple distributivité",`<p class="calc">${k} × (${a} + ${b}) = ${k} × ${a} + ${k} × ${b}</p><p class="calc">7 × (2${x} + 3) = 7 × 2${x} + 7 × 3 = 14${x} + 21</p><p class="schN">Je multiplie le facteur ${k} par <b>chaque</b> terme de la parenthèse.</p>`);
const S_MOINS=sch("Développer avec une soustraction",`<p class="calc">5 × (3${x} − 7) = 5 × (3${x} + (−7))<br>= 5 × 3${x} + 5 × (−7) = 15${x} − 35</p><p class="calc">−8(3${x} − 4) = −8 × 3${x} + (−8) × (−4) = −24${x} + 32</p><p class="schN">Je transforme la soustraction en addition, puis j'applique la règle des signes.</p>`);
const S_FAC=sch("Factoriser",`<p class="calc">${k} × ${a} + ${k} × ${b} = ${k} × (${a} + ${b})</p><p class="calc">5${x} + 15 = 5 × ${x} + 5 × 3 = 5(${x} + 3)</p><p class="schN">Je cherche un <b>facteur commun</b> aux deux termes, je le mets devant la parenthèse.</p>`);

/* ===================== données des exercices ===================== */
const ACT1=[["A",`3${x} + 2`,"S"],["B",`3${x} × (${x} + 2)`,"P"],["C",`5${x}<sup>2</sup> + 15`,"S"],["D",`−7 × (2${x} + 4)`,"P"],["E",`(${x} + 3) × 5`,"P"],["F",`4 + (4${x} + 3)`,"S"],["G",`8${x} − 4`,"S"],["H",`(2${x} + 4) + 3${x}`,"S"],["I",`8${x} + 6${x}<sup>2</sup>`,"S"],["J",`9 − 3${x}<sup>2</sup>`,"S"],["K",`−3 × (${x}<sup>2</sup> + 2${x} + 4)`,"P"]];
/* exercice 5 : [nom, écriture, facteur, termes de la parenthèse, facteur à droite ?] */
const EX5=[["A",[5,"x"],[[9,"x"],[8,""]]],["B",[3,""],[[1,"x"],[-4,""]]],["C",[5,"x"],[[-5,""],[2,"x"]]],["D",[4,""],[[5,"y"],[8,""]],true],["E",[-7,"x"],[[8,""],[-2,"x"]]],
           ["F",[3,"x"],[[-2,"y"],[-4,""]]],["G",[-3,""],[[5,""],[-3,"x"]],true],["H",[-2,"x"],[[9,""],[-7,"x"]]],["I",[-6,"x"],[[-9,""],[2,"y"]]],["J",[-5,""],[[-3,"y"],[-8,""]]]];
const w5=([n,K,ts,right])=>right?`${P(ts)} × ${fac(K)}`:`${E([K])}${P(ts)}`;
const c5=([n,K,ts,right])=>`<p class="calc">${n} = ${w5([n,K,ts,right])}<br>${devK(K,ts).map(l=>n+" = "+l).join("<br>")}</p>`;

CH["4e-12"]={
intro:"Reconnaître une somme et un produit, développer une expression avec la simple distributivité (même avec une soustraction ou des nombres négatifs), puis factoriser en cherchant un facteur commun.",
savoir:[
  "reconnaître une somme algébrique et un produit ;",
  `développer une expression de la forme ${k} × (${a} + ${b}) avec la simple distributivité ;`,
  `transformer une expression pour qu'elle soit de la forme ${k} × (${a} + ${b}), puis la développer ;`,
  "développer et réduire tout type d'expressions littérales ;",
  "factoriser une expression littérale avec la simple distributivité."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Développer une expression littérale", h:`
  <div class="retenir" data-l="Définition"><p><b>Développer</b> une expression littérale, c'est <b>transformer un produit en une somme algébrique</b>.</p></div>
  <h4>a) Développer une expression littérale de la forme ${k} × (${a} + ${b})</h4>
  <p>Pour développer une expression littérale de la forme ${k} × (${a} + ${b}), on utilise la méthode de la <b>simple distributivité</b>.</p>
  <div class="retenir" data-l="Propriété"><p><b>La simple distributivité :</b> quels que soient les nombres ${k}, ${a} et ${b}, on a :</p><p class="calc">${k} × (${a} + ${b}) = ${k} × ${a} + ${k} × ${b}</p><p>On dit que la multiplication est distributive par rapport à l'addition.</p></div>
  <p><b>Exemple :</b> on entoure les expressions que l'on peut développer, puis on les développe et on les réduit. <b>Méthode : il faut avoir un produit.</b></p>
  <div class="calcs"><span>A = 7 × (2${x} + 3) : produit</span><span>B = 8${x} + 5 : somme</span><span>C = 4${x} − (3${x} + 5) : somme</span><span>D = −5(4 + 6${x}) : produit</span><span>E = (5${x} + 1) × 8 : produit</span></div>
  <div class="attention"><b>ATTENTION :</b> quand il n'y a pas de signe entre un nombre et une parenthèse, cela veut dire qu'il y a un signe multiplié « × ».<p>Donc −5(4 + 6${x}) s\'écrit aussi −5 × (4 + 6${x}).</p></div>
  <p>On a bien ${k} × (${a} + ${b}) avec ${k} = 7 ; ${a} = 2${x} et ${b} = 3.</p>
  <p class="calc">A = 7 × (2${x} + 3)<br>A = 7 × 2${x} + 7 × 3<br>A = 14${x} + 21</p>
  <p>On a bien ${k} × (${a} + ${b}) avec ${k} = −5 ; ${a} = 4 et ${b} = 6${x}.</p>
  <p class="calc">D = −5(4 + 6${x})<br>D = −5 × 4 + (−5) × 6${x}<br>D = −20 + (−30${x})<br>D = −20 − 30${x}</p>
  <p>On a bien (${a} + ${b}) × ${k}, qui revient à ${k} × (${a} + ${b}) avec ${k} = 8 ; ${a} = 5${x} et ${b} = 1.</p>
  <p class="calc">E = (5${x} + 1) × 8<br>E = 8 × 5${x} + 8 × 1<br>E = 40${x} + 8</p>
  <h4>b) Transformer une expression littérale pour qu'elle soit de la forme ${k} × (${a} + ${b}) et la développer</h4>
  <div class="retenir" data-l="Méthode"><p>Pour développer ${k} × (${a} − ${b}) :</p><p><b>1)</b> je transforme la soustraction en addition : ${k} × (${a} + (−${b})) ;</p><p><b>2)</b> j'utilise la simple distributivité, puis la règle des signes.</p></div>
  <p><b>Exemple :</b> je dois développer et réduire A = 5 × (3${x} − 7).</p>
  <p><b>1)</b> Je la transforme pour qu'elle soit de la forme ${k} × (${a} + ${b}) :</p><p class="calc">A = 5 × (3${x} + (−7))</p><p>avec ${k} = 5 ; ${a} = 3${x} et ${b} = −7.</p>
  <p><b>2)</b> Je sais maintenant développer ce genre d'expressions :</p><p class="calc">A = 5 × 3${x} + 5 × (−7)<br>A = 15${x} + (−35)<br>A = 15${x} − 35</p>
  <p><b>Exemples :</b> développe et réduis les expressions suivantes.</p>
  <p>B = 4${x} × (6 − 5${x}) : je transforme la soustraction en addition, avec ${k} = 4${x} ; ${a} = 6 et ${b} = −5${x}.</p><p class="calc">B = 4${x} × (6 − 5${x})<br>B = 4${x} × (6 + (−5${x}))<br>B = 4${x} × 6 + 4${x} × (−5${x})<br>B = ${S([prod([4,"x"],[6,""]),prod([4,"x"],[-5,"x"])])}</p>
  <p>C = −8(3${x} − 4) : je transforme la soustraction en addition, avec ${k} = −8 ; ${a} = 3${x} et ${b} = −4.</p><p class="calc">C = −8(3${x} − 4)<br>C = −8(3${x} + (−4))<br>C = −8 × 3${x} + (−8) × (−4)<br>C = ${S([prod([-8,""],[3,"x"]),prod([-8,""],[-4,""])])}</p>
  <p>D = (7${x} − 3) × 2${x} : je transforme la soustraction en addition ; on a (${a} + ${b}) × ${k}, qui revient à ${k} × (${a} + ${b}), avec ${k} = 2${x} ; ${a} = 7${x} et ${b} = −3.</p><p class="calc">D = (7${x} − 3) × 2${x}<br>D = (7${x} + (−3)) × 2${x}<br>D = 2${x} × 7${x} + 2${x} × (−3)<br>D = 14${x}<sup>2</sup> + (−6${x})<br>D = ${S([prod([2,"x"],[7,"x"]),prod([2,"x"],[-3,""])])}</p>
  <p>E = 2(−8 − 5${x}) : je transforme la soustraction en addition, avec ${k} = 2 ; ${a} = −8 et ${b} = −5${x}.</p><p class="calc">E = 2(−8 − 5${x})<br>E = 2(−8 + (−5${x}))<br>E = 2 × (−8) + 2 × (−5${x})<br>E = −16 + (−10${x})<br>E = ${S([prod([2,""],[-8,""]),prod([2,""],[-5,"x"])])}</p>`},
{k:"II", t:"Factoriser une expression littérale", h:`
  <div class="retenir" data-l="Définition"><p><b>Factoriser</b> une expression littérale, c'est <b>transformer une somme algébrique en produit</b>.</p><p>Pour factoriser une expression littérale, on peut utiliser la <b>simple distributivité</b>.</p></div>
  <div class="retenir" data-l="Propriété"><p><b>La simple distributivité :</b> quels que soient les nombres ${k}, ${a} et ${b}, on a :</p><p class="calc">${k} × ${a} + ${k} × ${b} = ${k} × (${a} + ${b})</p><p><b>Remarque :</b> pour factoriser, on cherche un <b>facteur commun</b> ${k} aux deux termes de la somme.</p></div>
  <p><b>Exemple :</b> on entoure les expressions que l'on peut factoriser, puis on les factorise.</p>
  <div class="calcs"><span>H = 5${x} + 15</span><span>I = 3${x}(5 + 8)</span><span>J = 12${x} − 4${x}<sup>2</sup></span><span>K = 8${x} + 7</span><span>L = 20${x} + 5</span></div>
  <p class="calc">H = 5${x} + 15<br>H = 5 × ${x} + 5 × 3<br>H = 5(${x} + 3)</p>
  <p>I = 3${x}(5 + 8) est déjà un produit : on ne la factorise pas.</p>
  <p class="calc">J = 12${x} − 4${x}<sup>2</sup><br>J = 4${x} × 3 − 4${x} × ${x}<br>J = 4${x}(3 − ${x})</p>
  <p>K = 8${x} + 7 : 8${x} et 7 n'ont pas de facteur commun (autre que 1) : on ne peut pas la factoriser.</p>
  <p class="calc">L = 20${x} + 5<br>L = 5 × 4${x} + 5 × 1<br>L = 5(4${x} + 1)</p>
  <div class="attention"><b>ATTENTION :</b> on vérifie une factorisation en la développant : 5(4${x} + 1) = 20${x} + 5.</div>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Reconnaître une somme ou un produit", e:[
  {n:"Activité rapide", t:"Modéliser par une expression littérale", w:"Sur ta feuille", h:`<p>Quel sera le résultat de chaque programme de calcul si ${x} est le nombre choisi au départ ?</p>
   ${progs(prog("1) Programme 1",["Choisir un nombre","Multiplier par 7","Soustraire 3"]),prog("2) Programme 2",["Choisir un nombre","Ajouter 5","Multiplier par 3"]),prog("3) Programme 3",["Choisir un nombre","Multiplier par 8","Ajouter 5","Multiplier par 3"]))}<p>A = …… &nbsp; B = …… &nbsp; C = ……</p>`,
   c:`<p>1)</p><p class="calc">A = ${x} × 7 − 3<br>A = <b>7${x} − 3</b></p><p>2) B = <b>(${x} + 5) × 3</b> (développée : ${S([[3,"x"],[15,""]])})</p><p>3) C = <b>(8${x} + 5) × 3</b> (développée : ${S([prod([3,""],[8,"x"]),prod([3,""],[5,""])])})</p>`},
  {n:"Activité 1", t:"Reconnaître une somme algébrique et un produit", w:"Sur ta feuille", h:`<p>Parmi les expressions ci-dessous, entoure en rouge les sommes et en vert les produits.</p><div class="calcs">${ACT1.map(([n,e])=>`<span>${n} = ${e}</span>`).join("")}</div>`,
   c:`<p>On regarde la dernière opération à effectuer.</p><p><b>Sommes</b> (en rouge) : ${ACT1.filter(t=>t[2]==="S").map(t=>t[0]).join(", ")}.</p><p><b>Produits</b> (en vert) : ${ACT1.filter(t=>t[2]==="P").map(t=>t[0]).join(", ")}.</p><p>Par exemple, H = (2${x} + 4) + 3${x} est une somme : la dernière opération est l'addition « + 3${x} ».</p>`}
 ]},
{t:"Développer avec la simple distributivité", e:[
  {n:"Activité 2", t:"L'aire d'un rectangle de deux façons", w:"Sur ton cahier", h:`<p>On considère le rectangle suivant, et ${x} est un nombre positif.</p>${rect({top:[["5<i>x</i>",150],["3",80]], left:"4", alt:"Rectangle de hauteur 4, partagé en deux rectangles de largeurs 5x et 3"})}<p>Exprime, de deux façons, l'aire de ce rectangle en fonction de ${x}.</p>`,
   c:`<p><b>1<sup>re</sup> façon :</b> le grand rectangle a pour longueur 5${x} + 3 et pour largeur 4 : son aire est <b>4 × (5${x} + 3)</b>.</p><p><b>2<sup>e</sup> façon :</b> on additionne les aires des deux petits rectangles : <b>4 × 5${x} + 4 × 3</b> = ${S([prod([4,""],[5,"x"]),[12,""]])}.</p><p>Donc :</p><p class="calc">A = 4 × (5${x} + 3)<br>A = 4 × 5${x} + 4 × 3<br>A = 20${x} + 12</p><p>C'est la simple distributivité.</p>`},
  {n:"Exercice 1", t:`Développer des expressions de la forme ${k} × (${a} + ${b})`, w:"Sur ton cahier", h:`<p>Recopie les expressions sur ton cahier et développe-les.</p><div class="calcs"><span>A = 5 × (${x} + 6)</span><span>B = 3${x} × (2${x} + 7)</span><span>C = (5 + ${x}) × 8</span></div>`,
   c:`<p class="calc">A = 5 × (${x} + 6)<br>A = 5 × ${x} + 5 × 6<br>A = ${S([[5,"x"],[30,""]])}</p><p class="calc">B = 3${x} × (2${x} + 7)<br>B = 3${x} × 2${x} + 3${x} × 7<br>B = ${S([prod([3,"x"],[2,"x"]),prod([3,"x"],[7,""])])}</p><p class="calc">C = (5 + ${x}) × 8<br>C = 8 × 5 + 8 × ${x}<br>C = ${S([[40,""],[8,"x"]])}</p>`},
  {n:"Exercice 2", t:"Peut-on développer ?", w:"Sur ton cahier", h:`<div class="calcs"><span>A = 3 × (${x} + 4)</span><span>B = 5${x} × (5 + 2${x})</span><span>C = 4 + (8 + 2${x})</span><span>D = −2(5${y} + 8)</span><span>E = (${x} + 4) × 3${x}</span><span>F = 3${y}(5 + 2${x})</span><span>G = (5 + 2${x}) − 9</span><span>H = (5 + 2${x}) × (−4${y})</span></div>
   <p><b>1)</b> Entoure les lettres des expressions que tu peux développer.</p><p><b>2)</b> Ensuite, développe et réduis ces expressions entourées.</p>`,
   c:`<p><b>1)</b> On peut développer les <b>produits</b> : A, B, D, E, F et H. C et G sont des sommes.</p><p><b>2)</b></p>
   <p class="calc">A = 3 × (${x} + 4)<br>A = 3 × ${x} + 3 × 4<br>A = ${S([[3,"x"],[12,""]])}</p><p class="calc">B = 5${x} × (5 + 2${x})<br>B = 5${x} × 5 + 5${x} × 2${x}<br>B = ${S([prod([5,"x"],[5,""]),prod([5,"x"],[2,"x"])])}</p>
   <p class="calc">D = −2(5${y} + 8)<br>D = −2 × 5${y} + (−2) × 8<br>D = −10${y} + (−16)<br>D = ${S([prod([-2,""],[5,"y"]),prod([-2,""],[8,""])])}</p><p class="calc">E = (${x} + 4) × 3${x}<br>E = 3${x} × ${x} + 3${x} × 4<br>E = ${S([prod([3,"x"],[1,"x"]),prod([3,"x"],[4,""])])}</p>
   <p class="calc">F = 3${y}(5 + 2${x})<br>F = 3${y} × 5 + 3${y} × 2${x}<br>F = ${S([prod([3,"y"],[5,""]),prod([3,"y"],[2,"x"])])}</p><p class="calc">H = (5 + 2${x}) × (−4${y})<br>H = (−4${y}) × 5 + (−4${y}) × 2${x}<br>H = −20${y} + (−8${x}${y})<br>H = ${S([prod([-4,"y"],[5,""]),prod([-4,"y"],[2,"x"])])}</p>`},
  {n:"Exercice 3", t:`Développer des expressions de la forme ${k} × (${a} − ${b})`, w:"Sur ton cahier", h:`<p>Recopie les expressions sur ton cahier et développe-les.</p><div class="calcs"><span>A = 8 × (2${x} − 6)</span><span>B = 5${x} × (4 − 3${x})</span><span>C = (2${x} − 3) × 9</span><span>D = −5 × (3${x} − 6)</span><span>E = 6${x} × (−7 − 5${x})</span><span>F = (6 − 4${x}) × (−2)</span></div>`,
   c:`<p class="calc">A = 8 × (2${x} − 6)<br>A = 8 × (2${x} + (−6))<br>A = 8 × 2${x} + 8 × (−6)<br>A = 16${x} + (−48)<br>A = ${S([prod([8,""],[2,"x"]),prod([8,""],[-6,""])])}</p>
   <p class="calc">B = 5${x} × (4 − 3${x})<br>B = 5${x} × (4 + (−3${x}))<br>B = 5${x} × 4 + 5${x} × (−3${x})<br>B = 20${x} + (−15${x}<sup>2</sup>)<br>B = ${S([prod([5,"x"],[4,""]),prod([5,"x"],[-3,"x"])])}</p>
   <p class="calc">C = (2${x} − 3) × 9<br>C = (2${x} + (−3)) × 9<br>C = 9 × 2${x} + 9 × (−3)<br>C = 18${x} + (−27)<br>C = ${S([prod([9,""],[2,"x"]),prod([9,""],[-3,""])])}</p>
   <p class="calc">D = −5 × (3${x} − 6)<br>D = −5 × (3${x} + (−6))<br>D = −5 × 3${x} + (−5) × (−6)<br>D = ${S([prod([-5,""],[3,"x"]),prod([-5,""],[-6,""])])}</p>
   <p class="calc">E = 6${x} × (−7 − 5${x})<br>E = 6${x} × (−7 + (−5${x}))<br>E = 6${x} × (−7) + 6${x} × (−5${x})<br>E = −42${x} + (−30${x}<sup>2</sup>)<br>E = ${S([prod([6,"x"],[-7,""]),prod([6,"x"],[-5,"x"])])}</p>
   <p class="calc">F = (6 − 4${x}) × (−2)<br>F = (6 + (−4${x})) × (−2)<br>F = (−2) × 6 + (−2) × (−4${x})<br>F = ${S([prod([-2,""],[6,""]),prod([-2,""],[-4,"x"])])}</p>`},
  {n:"Exercice 4", t:"Développer tout type d'expressions littérales", w:"Sur ton cahier", h:`<p>Développe et réduis les expressions suivantes.</p><div class="calcs">${EX5.map(t=>`<span>${t[0]} = ${w5(t)}</span>`).join("")}</div>`,
   c:EX5.map(c5).join("")},
  {n:"Exercice 5", t:"Développer et réduire", w:"Sur ton cahier", h:`<p>Réduis chacune des expressions suivantes.</p><div class="calcs"><span>E = 5${x}(4 + 3${x}) − 8${x}</span><span>F = 3${x} + (4 − 8${x}) × 2</span><span>G = 7${x} − 5(3${x} − 4)</span></div>`,
   c:`<p class="calc">E = 5${x}(4 + 3${x}) − 8${x}<br>E = 5${x} × 4 + 5${x} × 3${x} − 8${x}<br>E = 20${x} + 15${x}<sup>2</sup> − 8${x}<br>E = ${S([[20,"x"],[15,"x2"],[-8,"x"]])}</p>
   <p class="calc">F = 3${x} + (4 − 8${x}) × 2<br>F = 3${x} + 2 × 4 + 2 × (−8${x})<br>F = 3${x} + 8 − 16${x}<br>F = ${S([[3,"x"],[8,""],[-16,"x"]])}</p>
   <p class="calc">G = 7${x} − 5(3${x} − 4)<br>G = 7${x} + (−5) × 3${x} + (−5) × (−4)<br>G = 7${x} − 15${x} + 20<br>G = ${S([[7,"x"],[-15,"x"],[20,""]])}</p>
   <p><i>Attention à G : le « − » devant 5 fait partie du facteur −5.</i></p>`}
 ]},
{t:"Factoriser avec la simple distributivité", e:[
  {n:"Activité 3", t:"Aire de rectangles", w:"Sur ton cahier", h:`<p><b>Partie 1 :</b> soit ${x} un nombre positif.</p>${rect({top:[["2<i>x</i> + 5",240]], left:"6<i>x</i>", H:80, fill:"color-mix(in srgb,#f4d03f 35%,transparent)", alt:"Rectangle de longueur 2x + 5 et de largeur 6x"})}<p>Donne l'expression développée et réduite de l'aire de ce rectangle en fonction de ${x}.</p>
   <p><b>Partie 2 :</b> soit ${x} un nombre positif.</p>${rect({top:[["?",240]], left:"?", inner:"2<i>x</i><sup>2</sup> + 6<i>x</i>", H:80, fill:"color-mix(in srgb,#f4d03f 35%,transparent)", alt:"Rectangle d'aire 2x² + 6x, de dimensions inconnues"})}<p>L'aire de ce rectangle est égale à 2${x}<sup>2</sup> + 6${x}.</p><p>Quelles peuvent être les dimensions (largeur et longueur) de ce rectangle ? Explique ta réponse.</p><p><i>Plusieurs réponses sont possibles.</i></p>`,
   c:`<p><b>Partie 1 :</b></p><p class="calc">Aire = 6${x} × (2${x} + 5)<br>Aire = 6${x} × 2${x} + 6${x} × 5<br>Aire = ${S([prod([6,"x"],[2,"x"]),prod([6,"x"],[5,""])])}</p>
   <p><b>Partie 2 :</b> on cherche à écrire 2${x}<sup>2</sup> + 6${x} sous la forme d'un produit : on <b>factorise</b>.</p><p class="calc">A = 2${x}<sup>2</sup> + 6${x}<br>A = 2${x} × ${x} + 2${x} × 3<br>A = 2${x}(${x} + 3)</p><p>Le rectangle peut mesurer 2${x} sur ${x} + 3.</p><p class="calc">A = 2${x}<sup>2</sup> + 6${x}<br>A = ${x} × 2${x} + ${x} × 6<br>A = ${x}(2${x} + 6)</p><p>Il peut aussi mesurer ${x} sur 2${x} + 6.</p><p>On vérifie en développant : 2${x}(${x} + 3) = ${S([prod([2,"x"],[1,"x"]),prod([2,"x"],[3,""])])}.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Somme ou produit ?", schema:S_SP, q:{
 1:[ {g:()=>{ const [n,e,t]=pick(ACT1); return {q:`L'expression ${e} est-elle une somme ou un produit ?`, c:["une somme","un produit"], rep:t==="S"?"une somme":"un produit", ex:t==="S"?"La dernière opération à effectuer est une addition ou une soustraction.":"La dernière opération à effectuer est une multiplication.", sx:S_SP}; }} ],
 2:[ {g:()=>{ const c=ri(2,9), p=ri(2,9), q=ri(1,9); const L=[[`${c} + (${p}${x} + ${q})`,"S"],[`(${p}${x} + ${q}) × ${c}`,"P"],[`−${c}(${p}${x} − ${q})`,"P"],[`(${p}${x} + ${q}) − ${c}`,"S"],[`${c}${y}(${p} + ${q}${x})`,"P"],[`${p}${x}<sup>2</sup> − ${c}${x}`,"S"]]; const [e,t]=pick(L);
       return {q:`L'expression ${e} est-elle une somme ou un produit ?`, c:["une somme","un produit"], rep:t==="S"?"une somme":"un produit", ex:t==="S"?"La dernière opération est une addition ou une soustraction : c'est une somme.":"La dernière opération est une multiplication (il y a un « × » caché devant la parenthèse) : c'est un produit.", sx:S_SP}; }} ],
 3:[ {q:"Développer une expression, c'est…", c:["transformer un produit en une somme","transformer une somme en un produit","réduire une somme"], rep:"transformer un produit en une somme", sx:S_SP},
     {q:"Factoriser une expression, c'est…", c:["transformer une somme en un produit","transformer un produit en une somme","supprimer les parenthèses"], rep:"transformer une somme en un produit", sx:S_FAC} ]
}},
{nom:"Développer k × (a + b)", schema:S_DEV, q:{
 1:[ {g:()=>{ const K=ri(2,9), p=ri(1,9), q=ri(1,9); const r=S([[K*p,"x"],[K*q,""]]); return {q:`Développe ${K} × (${E([[p,"x"],[q,""]])}).`, c:ch3(r,[S([[K*p,"x"],[q,""]]), S([[p,"x"],[K*q,""]]), E([[K*p+K*q,"x"]])]), rep:r, ex:`${K} × ${E([[p,"x"]])} + ${K} × ${q} = ${r}.`, sx:S_DEV}; }} ],
 2:[ {g:()=>{ const K=ri(2,9), p=ri(1,9), q=ri(1,9); const r=S([[K*p,"x"],[K*q,""]]); return {q:`Développe (${E([[p,"x"],[q,""]])}) × ${K}.`, c:ch3(r,[S([[K*p,"x"],[q,""]]), S([[p,"x"],[K*q,""]]), E([[K*p,"x2"],[K*q,""]])]), rep:r, ex:`On multiplie ${K} par chaque terme : ${K} × ${E([[p,"x"]])} + ${K} × ${q} = ${r}.`, sx:S_DEV}; }},
     {g:()=>{ const K=ri(2,6), p=ri(1,9), q=ri(1,9); const r=S([prod([K,"x"],[p,"x"]),prod([K,"x"],[q,""])]); return {q:`Développe ${K}${x}(${E([[p,"x"],[q,""]])}).`, c:ch3(r,[S([[K*p,"x"],[K*q,"x"]]), S([[K*p,"x2"],[K*q,""]]), S([[K*p+K*q,"x2"]])]), rep:r, ex:`${K}${x} × ${E([[p,"x"]])} + ${K}${x} × ${q} = ${r}.`, sx:S_DEV}; }} ],
 3:[ {g:()=>{ const K=-ri(2,9), p=ri(1,9), q=ri(1,9); const ts=[[q,""],[p,"x"]]; const r=S(ts.map(t=>prod([K,""],t))); return {q:`Développe ${K<0?"−"+(-K):K}(${E(ts)}).`, c:ch3(r,[S([[K*q,""],[-K*p,"x"]]), S([[-K*q,""],[-K*p,"x"]]), S([[K*q,""],[p,"x"]])]), rep:r, ex:`${devK([K,""],ts).join(" = ")}.`, sx:S_DEV}; }},
     {g:()=>{ const K=[-ri(2,6),"y"], ts=[[ri(1,9),""],[ri(1,9),"x"]]; const r=S(ts.map(t=>prod(K,t))); return {q:`Développe (${E(ts)}) × (${E([K])}).`, c:ch3(r,[S(ts.map(t=>prod([-K[0],"y"],t))), S([prod(K,ts[0]),ts[1]]), S([prod(K,ts[0]),prod([K[0],""],ts[1])])]), rep:r, ex:`${devK(K,ts).join(" = ")}.`, sx:S_DEV}; }} ]
}},
{nom:"Développer avec une soustraction", schema:S_MOINS, q:{
 1:[ {g:()=>{ const K=ri(2,9), p=ri(1,9), q=ri(1,9); const ts=[[p,"x"],[-q,""]], r=S(ts.map(t=>prod([K,""],t))); return {q:`Développe ${K} × (${E(ts)}).`, c:ch3(r,[S([[K*p,"x"],[K*q,""]]), S([[K*p,"x"],[-q,""]]), S([[p,"x"],[-K*q,""]])]), rep:r, ex:`${K} × (${E([[p,"x"]])} + (−${q})) = ${devK([K,""],ts).join(" = ")}.`, sx:S_MOINS}; }} ],
 2:[ {g:()=>{ const K=-ri(2,9), p=ri(1,9), q=ri(1,9); const ts=[[p,"x"],[-q,""]], r=S(ts.map(t=>prod([K,""],t))); return {q:`Développe ${E([[K,""]])}(${E(ts)}).`, c:ch3(r,[S([[K*p,"x"],[K*q,""]]), S([[-K*p,"x"],[K*q,""]]), S([[K*p,"x"],[-q,""]])]), rep:r, ex:`${devK([K,""],ts).join(" = ")}. Moins par moins donne plus.`, sx:S_MOINS}; }} ],
 3:[ {g:()=>{ const K=[pick([-1,1])*ri(2,7),"x"], ts=[[ri(1,9),""],[-ri(1,9),"x"]]; const r=S(ts.map(t=>prod(K,t))); return {q:`Développe ${E([K])}(${E(ts)}).`, c:ch3(r,[S([prod(K,ts[0]),prod([-K[0],"x"],ts[1])]), S([prod(K,ts[0]),ts[1]]), S([prod([K[0],""],ts[0]),prod(K,ts[1])])]), rep:r, ex:`${devK(K,ts).join(" = ")}.`, sx:S_MOINS}; }},
     {g:()=>{ const c=ri(2,9), K=ri(2,6), p=ri(1,9), q=ri(1,9); const ts=[[c,"x"],...[[p,"x"],[-q,""]].map(t=>prod([-K,""],t))]; const r=S(ts);
       return {q:`Développe et réduis ${c}${x} − ${K}(${E([[p,"x"],[-q,""]])}).`, c:ch3(r,[S([[c,"x"],[-K*p,"x"],[-K*q,""]]), S([[c,"x"],[K*p,"x"],[-K*q,""]]), S([[(c-K)*p,"x"],[K*q,""]])]), rep:r, ex:`${c}${x} + (−${K}) × ${E([[p,"x"]])} + (−${K}) × (−${q}) = ${E(ts)} = ${r}.`, sx:S_MOINS}; }} ]
}},
{nom:"Factoriser", schema:S_FAC, q:{
 1:[ {g:()=>{ const K=ri(2,9), [p,q]=cop(1,9); const e=S([[K*p,"x"],[K*q,""]]), r=`${K}(${E([[p,"x"],[q,""]])})`; return {q:`Factorise ${e}.`, c:ch3(r,[`${K}(${E([[p,"x"],[K*q,""]])})`, `${K}${x}(${p} + ${q})`, `${K*p}(${x} + ${q})`]), rep:r, ex:`${e} = ${K} × ${E([[p,"x"]])} + ${K} × ${q} = ${r}.`, sx:S_FAC}; }} ],
 2:[ {g:()=>{ const K=ri(2,9), [p,q]=cop(1,9); const e=S([[K*p,"x"],[-K*q,""]]), r=`${K}(${E([[p,"x"],[-q,""]])})`; return {q:`Factorise ${e}.`, c:ch3(r,[`${K}(${E([[p,"x"],[q,""]])})`, `${K}(${E([[p,"x"],[-K*q,""]])})`, `−${K}(${E([[p,"x"],[-q,""]])})`]), rep:r, ex:`${e} = ${K} × ${E([[p,"x"]])} − ${K} × ${q} = ${r}.`, sx:S_FAC}; }},
     {g:()=>{ const gcd=(m,n)=>n?gcd(n,m%n):m; let p,q; do{ p=ri(2,9); q=ri(2,9); }while(gcd(p,q)!==1); return {q:`Peut-on factoriser ${p}${x} + ${q} ?`, c:["Non : pas de facteur commun",`Oui : ${p}(${x} + ${q})`,`Oui : ${p+q}${x}`], rep:"Non : pas de facteur commun", ex:`${p}${x} et ${q} n'ont pas de facteur commun (autre que 1). Attention : ${p}(${x} + ${q}) = ${p}${x} + ${p*q}.`, sx:S_FAC}; }} ],
 3:[ {g:()=>{ const K=ri(2,6), [p,q]=cop(1,9); const e=S([[K*p,"x2"],[K*q,"x"]]), r=`${K}${x}(${E([[p,"x"],[q,""]])})`; return {q:`Factorise ${e} avec le plus grand facteur commun.`, c:ch3(r,[`${K}(${E([[p,"x2"],[q,"x"]])})`, `${x}(${E([[K*p,"x"],[K*q,""]])})`, `${K}${x}(${E([[p,"x"],[K*q,""]])})`]), rep:r, ex:`${e} = ${K}${x} × ${E([[p,"x"]])} + ${K}${x} × ${q} = ${r}.`, sx:S_FAC}; }},
     {q:`I = 3${x}(5 + 8). Peut-on factoriser I ?`, c:["Non : c'est déjà un produit","Oui : 3(5 + 8)"+x], rep:"Non : c'est déjà un produit", ex:"On ne factorise que des sommes.", sx:S_FAC} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 12", duree:50, info:"Durée : 50 min · Calculatrice non autorisée · Règle et crayon",
comp:[
  ["CHERCHER","Je reconnais une somme et un produit.","Ex. 1 (3 points)"],
  ["CALCULER","Je développe et je réduis avec la simple distributivité.","Ex. 2 et 3 (10 points)"],
  ["CALCULER","Je factorise une expression littérale.","Ex. 4 (4 points)"],
  ["MODÉLISER","J'exprime une aire de deux façons et je vérifie l'égalité.","Ex. 5 (3 points)"]
],
exos:[
{t:"Somme ou produit ?", p:3, h:`<p>Pour chaque expression, écris si c'est une somme ou un produit.</p><div class="calcs"><span>A = 4${x} − 7</span><span>B = 2(${x} + 9)</span><span>C = (3${x} − 1) × ${x}</span><span>D = 6 + (2${x} + 5)</span><span>E = −3 × (${x}<sup>2</sup> − 4)</span><span>F = 5${x}<sup>2</sup> + ${x}</span></div>`,
 c:`<p>On regarde la dernière opération à effectuer : une addition ou une soustraction → somme ; une multiplication → produit.</p><p>A : somme · B : produit · C : produit · D : somme · E : produit · F : somme</p><p><i>(0,5 point par réponse)</i></p>`},
{t:"Développer", p:6, h:`<p>Développe et réduis chaque expression.</p><div class="calcs"><span>A = 6(${x} + 4)</span><span>B = (2${x} + 3) × 5</span><span>C = 4${x}(3${x} + 2)</span><span>D = −3(5${x} − 2)</span><span>E = 2${x}(7 − 4${x})</span><span>F = (−${x} + 6) × (−7)</span></div>`,
 c:`<p class="calc">A = 6(${x} + 4)<br>A = 6 × ${x} + 6 × 4<br>A = ${S([[6,"x"],[24,""]])} <i>(1 point)</i></p><p class="calc">B = (2${x} + 3) × 5<br>B = 5 × 2${x} + 5 × 3<br>B = ${S([prod([5,""],[2,"x"]),[15,""]])} <i>(1 point)</i></p><p class="calc">C = 4${x}(3${x} + 2)<br>C = 4${x} × 3${x} + 4${x} × 2<br>C = ${S([prod([4,"x"],[3,"x"]),prod([4,"x"],[2,""])])} <i>(1 point)</i></p>
  <p class="calc">D = −3(5${x} − 2)<br>D = −3 × 5${x} + (−3) × (−2)<br>D = ${S([prod([-3,""],[5,"x"]),prod([-3,""],[-2,""])])} <i>(1 point)</i></p><p class="calc">E = 2${x}(7 − 4${x})<br>E = 2${x} × 7 + 2${x} × (−4${x})<br>E = ${S([prod([2,"x"],[7,""]),prod([2,"x"],[-4,"x"])])} <i>(1 point)</i></p><p class="calc">F = (−${x} + 6) × (−7)<br>F = (−7) × (−${x}) + (−7) × 6<br>F = ${S([prod([-7,""],[-1,"x"]),prod([-7,""],[6,""])])} <i>(1 point)</i></p>`},
{t:"Développer et réduire", p:4, h:`<div class="calcs"><span>G = 3(2${x} + 5) − 4${x}</span><span>H = 9 − 2(4${x} − 3)</span></div>`,
 c:`<p class="calc">G = 3(2${x} + 5) − 4${x}<br>G = 3 × 2${x} + 3 × 5 − 4${x}<br>G = 6${x} + 15 − 4${x}<br>G = ${S([[6,"x"],[15,""],[-4,"x"]])} <i>(2 points)</i></p><p class="calc">H = 9 − 2(4${x} − 3)<br>H = 9 + (−2) × 4${x} + (−2) × (−3)<br>H = 9 − 8${x} + 6<br>H = ${S([[9,""],[-8,"x"],[6,""]])} <i>(2 points)</i></p>`},
{t:"Factoriser", p:4, h:`<p>Factorise chaque expression lorsque c'est possible.</p><div class="calcs"><span>a) 7${x} + 21</span><span>b) 9${x} − 6</span><span>c) 5${x}<sup>2</sup> + 15${x}</span><span>d) 4${x} + 9</span></div>`,
 c:`<p class="calc">a) 7 × ${x} + 7 × 3 = 7(${x} + 3) <i>(1 point)</i></p><p class="calc">b) 3 × 3${x} − 3 × 2 = 3(3${x} − 2) <i>(1 point)</i></p><p class="calc">c) 5${x} × ${x} + 5${x} × 3 = 5${x}(${x} + 3) <i>(1 point)</i></p><p>d) 4${x} et 9 n'ont pas de facteur commun : on ne peut pas factoriser. <i>(1 point)</i></p>`},
{t:"Le jardin rectangulaire", p:3, h:`<p>${x} désigne un nombre positif. Un jardin rectangulaire est partagé en deux parties.</p>${rect({top:[["2<i>x</i>",150],["4",80]], left:"3<i>x</i>", alt:"Rectangle de hauteur 3x, partagé en deux rectangles de largeurs 2x et 4"})}
  <p><b>a)</b> Exprime l'aire du jardin sous la forme d'un produit.</p><p><b>b)</b> Exprime l'aire du jardin sous la forme d'une somme réduite.</p><p><b>c)</b> Calcule l'aire du jardin pour ${x} = 2 avec chacune des deux expressions.</p>`,
 c:`<p><b>a)</b> Aire = 3${x} × (2${x} + 4) <i>(1 point)</i></p><p><b>b)</b></p><p class="calc">Aire = 3${x} × 2${x} + 3${x} × 4<br>Aire = ${S([prod([3,"x"],[2,"x"]),prod([3,"x"],[4,""])])}</p><p><i>(1 point)</i></p><p><b>c)</b> Pour ${x} = 2 :</p><p class="calc">avec le produit : 3 × 2 × (2 × 2 + 4) = 6 × 8 = 48<br>avec la somme : 6 × 2<sup>2</sup> + 12 × 2 = 24 + 24 = 48</p><p>On trouve bien la même aire : 48. <i>(1 point)</i></p>`}
]}
};
/* calculs en chaîne « A = … » dans les explications du QCM (outil défini dans 4e-1.js) */
CH["4e-12"].quiz.forEach(N=>Object.values(N.q).forEach(list=>list.forEach((it,i)=>{ if(it.g){ const g=it.g; list[i]={g:()=>window.CHN4.qChain(g())}; } else list[i]=window.CHN4.qChain(it); })));
})();
