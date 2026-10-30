/* 4e — Chapitre 13 : Calcul littéral 3 — Développer à l'aide de la double distributivité
   (cours B3, activité découverte des consignes, feuille d'exercices « Double distributivité » et sa correction)
   Lettres en italique, 3<i>x</i> sans signe ×. Calculs : outils window.CL7 (4e-7.js) et window.CL12 (4e-12.js). */
(function(){
const {ri,pick,shuf,uniq,ch3,nz,F,X,T,E,red,R,fac,prod,svgT,tab}=window.CL7;
const {S,P,devK,rect}=window.CL12;
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const x=X("x"), a=X("a"), b=X("b"), c=X("c"), d=X("d");

/* écriture « (a + (−b)) » : la soustraction transformée en addition */
const PP=ts=>`(${ts.map((t,i)=>i===0?E([t]):(t[0]<0?` + (${E([t])})`:` + ${E([t])}`)).join("")})`;
/* étapes du développement de (t1 + t2)(t3 + t4) */
function dev2(A,B,opt={}){
  const L=[]; const neg=[...A.slice(1),...B.slice(1)].some(t=>t[0]<0);
  if(neg && opt.trans!==false) L.push(`${PP(A)}${PP(B)}`);
  L.push(A.flatMap((p,i)=>B.map((q,j)=>`${fac(p,i===0&&j===0)} × ${fac(q)}`)).join(" + "));
  const ps=A.flatMap(p=>B.map(q=>prod(p,q)));
  const l2=ps.map((p,i)=>i===0?E([p]):(p[0]<0?` + (${E([p])})`:` + ${E([p])}`)).join("");
  if(l2!==E(ps)) L.push(l2);
  L.push(E(ps));
  const r=R(ps); if(r!==E(ps)) L.push(r);
  return {L, r, ps};
}
window.CL13={PP,dev2};
const lines=(n,first,L)=>`<p class="calc">${[first,...L].map((l,i,arr)=>`${n} = ${i===arr.length-1?"<b>"+l+"</b>":l}`).join("<br>")}</p>`;
const w2=(A,B)=>`${P(A)}${P(B)}`;

/* rectangle partagé en quatre (activité découverte) */
function rect4(wx,wn,hx,hn,labs){ const X0=46,Y0=34, W=wx+wn, H=hx+hn;
  let s=`<svg class="fig" viewBox="0 0 ${W+X0+30} ${H+Y0+30}" width="${W+X0+30}" role="img" aria-label="${labs.alt}">`;
  const col=["color-mix(in srgb,var(--c) 25%,transparent)","color-mix(in srgb,#f4b183 45%,transparent)","color-mix(in srgb,#a9d18e 45%,transparent)","color-mix(in srgb,#c9a0dc 40%,transparent)"];
  s+=`<rect x="${X0}" y="${Y0}" width="${wx}" height="${hx}" style="fill:${col[0]}"/><rect x="${X0+wx}" y="${Y0}" width="${wn}" height="${hx}" style="fill:${col[1]}"/><rect x="${X0}" y="${Y0+hx}" width="${wx}" height="${hn}" style="fill:${col[2]}"/><rect x="${X0+wx}" y="${Y0+hx}" width="${wn}" height="${hn}" style="fill:${col[3]}"/>`;
  s+=`<rect x="${X0}" y="${Y0}" width="${W}" height="${H}" class="ln"/><line x1="${X0+wx}" y1="${Y0}" x2="${X0+wx}" y2="${Y0+H}" class="ln"/><line x1="${X0}" y1="${Y0+hx}" x2="${X0+W}" y2="${Y0+hx}" class="ln"/>`;
  const arH=(x1,x2,t)=>`<path d="M${x1+2} 20 H${x2-2} M${x1+8} 15 L${x1+2} 20 L${x1+8} 25 M${x2-8} 15 L${x2-2} 20 L${x2-8} 25" class="thin"/><text x="${(x1+x2)/2}" y="13" class="lab" style="font-size:17px">${svgT(t)}</text>`;
  const arV=(y1,y2,t)=>`<path d="M28 ${y1+2} V${y2-2} M23 ${y1+8} L28 ${y1+2} L33 ${y1+8} M23 ${y2-8} L28 ${y2-2} L33 ${y2-8}" class="thin"/><text x="13" y="${(y1+y2)/2+6}" class="lab" style="font-size:17px">${svgT(t)}</text>`;
  s+=arH(X0,X0+wx,labs.w[0])+arH(X0+wx,X0+W,labs.w[1])+arV(Y0,Y0+hx,labs.h[0])+arV(Y0+hx,Y0+H,labs.h[1]);
  if(labs.pts) s+=`<text x="${X0-8}" y="${Y0-6}" class="lab">A</text><text x="${X0+W+10}" y="${Y0-6}" class="lab">B</text><text x="${X0+W+10}" y="${Y0+H+18}" class="lab">C</text><text x="${X0-8}" y="${Y0+H+18}" class="lab">D</text>`;
  return s+"</svg>"; }
window.CL13.rect4=rect4;

/* ===================== schémas ===================== */
const S_DD=sch("La double distributivité",`<p class="calc">(${a} + ${b}) × (${c} + ${d}) = ${a} × ${c} + ${a} × ${d} + ${b} × ${c} + ${b} × ${d}</p><p class="calc">(${x} + 3)(${x} + 1) = ${x} × ${x} + ${x} × 1 + 3 × ${x} + 3 × 1 = ${x}<sup>2</sup> + 4${x} + 3</p><p class="schN">Chaque terme de la 1<sup>re</sup> parenthèse multiplie chaque terme de la 2<sup>e</sup> : 4 produits, puis je réduis.</p>`);
const S_DM=sch("Avec des soustractions",`<p class="calc">(8${x} − 2)(4 − 3${x}) = (8${x} + (−2))(4 + (−3${x}))<br>= 8${x} × 4 + 8${x} × (−3${x}) + (−2) × 4 + (−2) × (−3${x})<br>= 32${x} − 24${x}<sup>2</sup> − 8 + 6${x} = −24${x}<sup>2</sup> + 38${x} − 8</p><p class="schN">Je transforme les soustractions en additions, puis j'applique la règle des signes.</p>`);
const S_SD=sch("Simple ou double ?",`<p class="calc">4(3${x} + 2) : simple distributivité → 2 produits</p><p class="calc">(${x} − 5)(3${x} + 2) : double distributivité → 4 produits</p><p class="schN">Un facteur seul devant la parenthèse : simple. Deux parenthèses de deux termes : double.</p>`);

/* ===================== données ===================== */
const EX1=[["A",[[1,"x"],[4,""]],[[1,"x"],[3,""]]],["B",[[1,"y"],[3,""]],[[2,"y"],[8,""]]],["C",[[1,"x"],[1,""]],[[2,"x"],[5,""]]]];
const EX2=[["D",[[3,"z"],[4,""]],[[5,""],[-6,"z"]]],["E",[[-7,"t"],[8,""]],[[3,""],[-5,"t"]]],["F",[[7,""],[-3,"x"]],[[9,"x"],[-3,""]]],["G",[[-3,""],[-2,"x"]],[[1,"x"],[-1,""]]],["H",[[4,"a"],[6,""]],[[-3,""],[-5,"a"]]],
           ["I",[[-2,""],[-3,"y"]],[[4,""],[-8,"y"]]],["J",[[5,"z"],[-7,""]],[[8,"z"],[2,""]]],["K",[[-3,""],[-1,"t"]],[[1,"t"],[-7,""]]],["L",[[2,"x"],[-5,""]],[[2,""],[-1,"x"]]]];
const EX3=[["M",{K:[4,""],ts:[[3,"x"],[2,""]]}],["N",{K:[-5,"x"],ts:[[8,"x"],[7,""]],right:true}],["P",{A:[[1,"x"],[-5,""]],B:[[3,"x"],[2,""]]}],["Q",{A:[[5,"x"],[-4,""]],B:[[1,"x"],[-3,""]]}],["R",{A:[[5,""],[9,"x"]],B:[[5,""],[-9,"x"]]}],["S",{A:[[1,""],[-6,"x"]],B:[[1,""],[-6,"x"]]}]];
const w3=o=>o.K?(o.right?`${P(o.ts)} × (${E([o.K])})`:`${E([o.K])}${P(o.ts)}`):w2(o.A,o.B);
const c3=([n,o])=>o.K?lines(n,w3(o),[...devK(o.K,o.ts)]):lines(n,w3(o),dev2(o.A,o.B,{trans:false}).L);

CH["4e-13"]={
intro:"Développer et réduire un produit de deux parenthèses avec la double distributivité, même quand il y a des soustractions et des nombres négatifs.",
savoir:[
  "reconnaître un produit que l'on peut développer ;",
  `développer une expression de la forme (${a} + ${b}) × (${c} + ${d}) avec la double distributivité ;`,
  `transformer une expression pour qu'elle soit de la forme (${a} + ${b}) × (${c} + ${d}), puis la développer et la réduire ;`,
  "choisir entre la simple et la double distributivité pour développer tout type d'expressions."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Développer une expression littérale", h:`
  <div class="retenir" data-l="Définition"><p><b>Rappel :</b> <b>développer</b> une expression littérale, c'est <b>transformer un produit en une somme algébrique</b>.</p></div>
  <h4>a) Développer une expression littérale de la forme (${a} + ${b}) × (${c} + ${d})</h4>
  <p>Pour développer une expression littérale de la forme (${a} + ${b}) × (${c} + ${d}), on utilise la méthode de la <b>double distributivité</b>.</p>
  <div class="retenir" data-l="Propriété"><p><b>La double distributivité :</b> quels que soient les nombres ${a}, ${b}, ${c} et ${d}, on a :</p><p class="calc">(${a} + ${b}) × (${c} + ${d}) = ${a} × ${c} + ${a} × ${d} + ${b} × ${c} + ${b} × ${d}</p></div>
  <p><b>Exemple :</b> on entoure les expressions que l'on peut développer, puis on les développe et on les réduit. <b>Méthode : il faut avoir un produit.</b></p>
  <div class="calcs"><span>A = (6${x} + 3)(2 + 3${x}) : produit</span><span>B = (8${x} + 2) − (4 + 12${x}) : somme</span><span>C = (−6 + 4${x}) × (3${x} + 5) : produit</span><span>D = (−2${x} + 9)(−5${x} + 6) : produit</span><span>E = (10${x} + 7) + (${x} + 9) : somme</span></div>
  <div class="attention"><b>ATTENTION :</b> quand il n'y a pas de signe entre deux parenthèses, cela veut dire qu'il y a un signe multiplié « × ».<p>Donc (6${x} + 3)(2 + 3${x}) s\'écrit aussi (6${x} + 3) × (2 + 3${x}).</p></div>
  <p>On a bien (${a} + ${b}) × (${c} + ${d}) avec ${a} = 6${x} ; ${b} = 3 ; ${c} = 2 et ${d} = 3${x}.</p>
  <p class="calc">A = (6${x} + 3)(2 + 3${x})<br>A = 6${x} × 2 + 6${x} × 3${x} + 3 × 2 + 3 × 3${x}<br>A = 12${x} + 18${x}<sup>2</sup> + 6 + 9${x}<br>A = ${R([[12,"x"],[18,"x2"],[6,""],[9,"x"]])}</p><p>On regroupe les termes en ${x} : 12${x} + 9${x} = 21${x}.</p>
  <p>On a bien (${a} + ${b}) × (${c} + ${d}) avec ${a} = −6 ; ${b} = 4${x} ; ${c} = 3${x} et ${d} = 5.</p>
  <p class="calc">C = (−6 + 4${x}) × (3${x} + 5)<br>C = −6 × 3${x} + (−6) × 5 + 4${x} × 3${x} + 4${x} × 5<br>C = −18${x} + (−30) + 12${x}<sup>2</sup> + 20${x}<br>C = ${R([[-18,"x"],[-30,""],[12,"x2"],[20,"x"]])}</p>
  <p>On a bien (${a} + ${b}) × (${c} + ${d}) avec ${a} = −2${x} ; ${b} = 9 ; ${c} = −5${x} et ${d} = 6.</p>
  <p class="calc">D = (−2${x} + 9)(−5${x} + 6)<br>D = −2${x} × (−5${x}) + (−2${x}) × 6 + 9 × (−5${x}) + 9 × 6<br>D = 10${x}<sup>2</sup> + (−12${x}) + (−45${x}) + 54<br>D = ${R([[10,"x2"],[-12,"x"],[-45,"x"],[54,""]])}</p>
  <h4>b) Transformer une expression pour qu'elle soit de la forme (${a} + ${b}) × (${c} + ${d})</h4>
  <div class="retenir" data-l="Méthode"><p><b>1)</b> Je transforme chaque soustraction en addition : − 2 devient + (−2).</p><p><b>2)</b> J'utilise la double distributivité, puis la règle des signes, et je réduis.</p></div>
  <p><b>Exemple :</b> je dois développer et réduire A = (8${x} − 2)(4 − 3${x}).</p>
  <p><b>1)</b> Je la transforme pour qu'elle soit de la forme (${a} + ${b}) × (${c} + ${d}) :</p><p class="calc">A = (8${x} + (−2))(4 + (−3${x}))</p><p>avec ${a} = 8${x} ; ${b} = −2 ; ${c} = 4 et ${d} = −3${x}.</p>
  <p><b>2)</b> Je sais maintenant développer ce genre d'expressions :</p><p class="calc">A = 8${x} × 4 + 8${x} × (−3${x}) + (−2) × 4 + (−2) × (−3${x})<br>A = 32${x} + (−24${x}<sup>2</sup>) + (−8) + 6${x}<br>A = ${R([[32,"x"],[-24,"x2"],[-8,""],[6,"x"]])}</p>
  <p><b>Exemples :</b> développe et réduis les expressions suivantes.</p>
  <p>B = (4 + 2${x})(5${x} − 9) : je transforme la soustraction en addition, avec ${a} = 4 ; ${b} = 2${x} ; ${c} = 5${x} et ${d} = −9.</p>
  <p class="calc">B = (4 + 2${x})(5${x} − 9)<br>B = (4 + 2${x})(5${x} + (−9))<br>B = 4 × 5${x} + 4 × (−9) + 2${x} × 5${x} + 2${x} × (−9)<br>B = 20${x} + (−36) + 10${x}<sup>2</sup> + (−18${x})<br>B = ${R([[20,"x"],[-36,""],[10,"x2"],[-18,"x"]])}</p>
  <p>C = (−${x} − 1)(−6 + 3${x}) : je transforme la soustraction en addition, avec ${a} = −${x} ; ${b} = −1 ; ${c} = −6 et ${d} = 3${x}.</p>
  <p class="calc">C = (−${x} − 1)(−6 + 3${x})<br>C = (−${x} + (−1))(−6 + 3${x})<br>C = −${x} × (−6) + (−${x}) × 3${x} + (−1) × (−6) + (−1) × 3${x}<br>C = 6${x} + (−3${x}<sup>2</sup>) + 6 + (−3${x})<br>C = ${R([[6,"x"],[-3,"x2"],[6,""],[-3,"x"]])}</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Découvrir la double distributivité", e:[
  {n:"Activité 1", t:"L'aire d'un rectangle de deux façons", w:"Sur ton cahier", h:`<p>Si on te demande de développer le produit (4${x} + 5) × (2${x} + 8), tu voudrais commencer par les calculs entre parenthèses. Mais on ne peut pas réduire 4${x} + 5 ni 2${x} + 8 : on est bloqué !</p><p>Pour comprendre comment faire, calcule de deux façons différentes l'aire de ce rectangle ABCD.</p>
   ${rect4(120,90,120,30,{w:["<i>x</i>","3"],h:["<i>x</i>","1"],pts:true,alt:"Rectangle ABCD : AB = x + 3 et AD = x + 1, partagé en un carré de côté x et trois rectangles"})}
   <p><b>1)</b> Exprime l'aire de ABCD à l'aide des longueurs AB et AD.</p><p><b>2)</b> Exprime l'aire de ABCD en additionnant les aires du carré et des trois rectangles.</p><p><b>3)</b> Réduis l'expression obtenue.</p>`,
   c:`<p><b>1)</b> AB = ${x} + 3 et AD = ${x} + 1, donc aire de ABCD = <b>(${x} + 3) × (${x} + 1)</b>.</p><p><b>2)</b> Aire de ABCD = <b>${x} × ${x} + ${x} × 1 + 3 × ${x} + 3 × 1</b> (on décompose l'aire des trois rectangles et du carré).</p>
   <p><b>3)</b></p><p class="calc">Aire = ${x}<sup>2</sup> + ${x} + 3${x} + 3<br>Aire = <b>${R([[1,"x2"],[1,"x"],[3,"x"],[3,""]])}</b></p><p>On observe que pour développer (${x} + 3) × (${x} + 1), il faut multiplier chaque terme de la première parenthèse par chaque terme de la seconde :</p><p class="calc">A = (${x} + 3) × (${x} + 1)<br>A = ${x} × ${x} + ${x} × 1 + 3 × ${x} + 3 × 1<br>A = ${x}<sup>2</sup> + 4${x} + 3</p>`}
 ]},
{t:"Développer avec la double distributivité", e:[
  {n:"Exercice 1", t:"Développer avec la double distributivité", w:"Sur ton cahier", h:`<p>Recopie les expressions littérales suivantes, puis développe-les et réduis-les.</p><div class="calcs">${EX1.map(([n,A,B])=>`<span>${n} = ${w2(A,B)}</span>`).join("")}</div>`,
   c:EX1.map(([n,A,B])=>lines(n,w2(A,B),dev2(A,B).L)).join("")},
  {n:"Exercice 2", t:"Développer avec la double distributivité (avec des soustractions)", w:"Sur ton cahier", h:`<p>Recopie les expressions littérales suivantes, puis développe-les et réduis-les.</p><div class="calcs">${EX2.map(([n,A,B])=>`<span>${n} = ${w2(A,B)}</span>`).join("")}</div>`,
   c:EX2.map(([n,A,B])=>lines(n,w2(A,B),dev2(A,B).L)).join("")+`<p><i>Rappel : −${x} = −1${x}, donc (−${x}) × ${x} = −${x}<sup>2</sup>.</i></p>`}
 ]},
{t:"Développer tous types d'expressions", e:[
  {n:"Exercice 3", t:"Simple ou double distributivité ?", w:"Sur ton cahier", h:`<p>Recopie les expressions littérales suivantes, puis développe-les et réduis-les.</p><div class="calcs">${EX3.map(([n,o])=>`<span>${n} = ${w3(o)}</span>`).join("")}</div>`,
   c:`<p>M et N : <b>simple</b> distributivité (un seul facteur devant ou derrière la parenthèse). P, Q, R et S : <b>double</b> distributivité.</p>`+EX3.map(c3).join("")}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Peut-on développer ?", schema:S_SD, q:{
 1:[ {g:()=>{ const p=ri(1,9), q=ri(1,9), r=ri(2,9), s=ri(1,9); const L=[[`(${x} + ${p})(${x} + ${q})`,"produit"],[`(${r}${x} + ${p}) − (${x} + ${q})`,"somme"],[`(${r}${x} + ${p}) × (${q} + ${x})`,"produit"],[`(${r}${x} + ${p}) + (${s===1?"":s}${x} + ${q})`,"somme"]]; const [e,t]=pick(L);
       return {q:`${e} est-elle une somme ou un produit ?`, c:["une somme","un produit"], rep:t==="somme"?"une somme":"un produit", ex:t==="somme"?"La dernière opération est une addition ou une soustraction : on ne peut pas la développer.":"Il y a un « × » (parfois caché) entre les deux parenthèses : c'est un produit, on peut le développer.", sx:S_SD}; }} ],
 2:[ {g:()=>{ const p=ri(1,9), q=ri(1,9), r=ri(2,9); const L=[[`${r}(${x} + ${p})`,"la simple distributivité"],[`(${x} + ${p})(${r}${x} − ${q})`,"la double distributivité"],[`(${r}${x} − ${p}) × ${q===1?"":q}${x}`,"la simple distributivité"],[`(${p} − ${x})(${x} + ${q})`,"la double distributivité"]]; const [e,t]=pick(L);
       return {q:`Pour développer ${e}, on utilise…`, c:["la simple distributivité","la double distributivité"], rep:t, ex:t==="la simple distributivité"?"Un seul facteur multiplie la parenthèse : 2 produits.":"Deux parenthèses de deux termes : 4 produits.", sx:S_SD}; }} ],
 3:[ {q:`Quand on développe (${a} + ${b})(${c} + ${d}), combien de produits obtient-on avant de réduire ?`, c:["4","2","3"], rep:"4", ex:`${a} × ${c} + ${a} × ${d} + ${b} × ${c} + ${b} × ${d}.`, sx:S_DD},
     {q:`(6${x} + 3)(2 + 3${x}) s'écrit aussi…`, c:[`(6${x} + 3) × (2 + 3${x})`,`(6${x} + 3) + (2 + 3${x})`,`6${x} + 3 × 2 + 3${x}`], rep:`(6${x} + 3) × (2 + 3${x})`, ex:"Entre deux parenthèses sans signe, il y a un signe « × ».", sx:S_DD} ]
}},
{nom:"La double distributivité", schema:S_DD, q:{
 1:[ {g:()=>{ const p=ri(1,9), q=ri(1,9); const A=[[1,"x"],[p,""]], B=[[1,"x"],[q,""]], r=dev2(A,B).r; return {q:`Développe et réduis (${x} + ${p})(${x} + ${q}).`, c:ch3(r,[R([[1,"x2"],[p*q,""]]), R([[1,"x2"],[p+q,"x"],[p+q,""]]), R([[2,"x"],[p*q,""]])]), rep:r, ex:`${x} × ${x} + ${x} × ${q} + ${p} × ${x} + ${p} × ${q} = ${r}.`, sx:S_DD}; }} ],
 2:[ {g:()=>{ const m=ri(2,6), p=ri(1,9), q=ri(1,9); const A=[[1,"x"],[p,""]], B=[[m,"x"],[q,""]], D=dev2(A,B); return {q:`Développe et réduis (${x} + ${p})(${m}${x} + ${q}).`, c:ch3(D.r,[R([[m,"x2"],[p*q,""]]), R([[m,"x2"],[p+q,"x"],[p*q,""]]), R([[m,"x2"],[q+m*p,"x"],[p+q,""]])]), rep:D.r, ex:`${D.L.join(" = ")}.`, sx:S_DD}; }} ],
 3:[ {g:()=>{ const m=ri(2,5), n=ri(2,5), p=ri(1,9), q=ri(1,9); const A=[[m,"x"],[p,""]], B=[[n,"x"],[q,""]], D=dev2(A,B); return {q:`Développe et réduis (${m}${x} + ${p})(${n}${x} + ${q}).`, c:ch3(D.r,[R([[m*n,"x2"],[p*q,""]]), R([[m*n,"x"],[m*q+n*p,"x"],[p*q,""]]), R([[m*n,"x2"],[m+n+p+q,"x"],[p*q,""]])]), rep:D.r, ex:`${D.L.join(" = ")}.`, sx:S_DD}; }} ]
}},
{nom:"Avec des soustractions", schema:S_DM, q:{
 1:[ {g:()=>{ const p=ri(1,9), q=ri(1,9); const A=[[1,"x"],[-p,""]], B=[[1,"x"],[q,""]], D=dev2(A,B); return {q:`Développe et réduis (${x} − ${p})(${x} + ${q}).`, c:ch3(D.r,[R([[1,"x2"],[q+p,"x"],[-p*q,""]]), R([[1,"x2"],[q-p,"x"],[p*q,""]]), R([[1,"x2"],[-p*q,""]])]), rep:D.r, ex:`${D.L.join(" = ")}.`, sx:S_DM}; }} ],
 2:[ {g:()=>{ const p=ri(1,9), q=ri(1,9), m=ri(2,6); const A=[[m,"x"],[-p,""]], B=[[1,"x"],[-q,""]], D=dev2(A,B); return {q:`Développe et réduis (${m}${x} − ${p})(${x} − ${q}).`, c:ch3(D.r,[R([[m,"x2"],[-(m*q+p),"x"],[-p*q,""]]), R([[m,"x2"],[m*q+p,"x"],[p*q,""]]), R([[m,"x2"],[p*q,""]])]), rep:D.r, ex:`${D.L.join(" = ")}. Moins par moins donne plus.`, sx:S_DM}; }} ],
 3:[ {g:()=>{ const A=[[nz(-6,6),""],[-ri(1,6),"x"]], B=[[ri(1,6),"x"],[-ri(1,9),""]], D=dev2(A,B); const ps=D.ps;
       return {q:`Développe et réduis ${w2(A,B)}.`, c:ch3(D.r,[R([ps[0],[-ps[1][0],ps[1][1]],ps[2],ps[3]]), R([ps[0],ps[1],[-ps[2][0],ps[2][1]],ps[3]]), R([ps[0],ps[1],ps[2],[-ps[3][0],ps[3][1]]])]), rep:D.r, ex:`${D.L.join(" = ")}.`, sx:S_DM}; }},
     {g:()=>{ const p=ri(1,9), m=ri(2,9); const A=[[p,""],[m,"x"]], B=[[p,""],[-m,"x"]], D=dev2(A,B); return {q:`Développe et réduis (${p} + ${m}${x})(${p} − ${m}${x}).`, c:ch3(D.r,[R([[p*p,""],[m*m,"x2"]]), R([[p*p,""],[-2*p*m,"x"],[-m*m,"x2"]]), R([[p*p,""],[-m*m,"x"]])]), rep:D.r, ex:`${D.L.join(" = ")} : les termes en ${x} s'annulent.`, sx:S_DM}; }} ]
}},
{nom:"Tous types d'expressions", schema:S_SD, q:{
 1:[ {g:()=>{ const K=ri(2,9), p=ri(1,9), q=ri(1,9); const r=S([[K*p,"x"],[K*q,""]]); return {q:`Développe ${K}(${p===1?"":p}${x} + ${q}).`, c:ch3(r,[S([[K*p,"x"],[q,""]]), S([[K*p,"x2"],[K*q,""]]), S([[p,"x"],[K*q,""]])]), rep:r, ex:`Simple distributivité : ${K} × ${p===1?"":p}${x} + ${K} × ${q} = ${r}.`, sx:S_SD}; }} ],
 2:[ {g:()=>{ const K=-ri(2,7), p=ri(2,9), q=ri(1,9); const r=S([[K*p,"x2"],[K*q,"x"]]); return {q:`Développe (${p}${x} + ${q}) × (${E([[K,"x"]])}).`, c:ch3(r,[S([[K*p,"x2"],[q,""]]), S([[-K*p,"x2"],[-K*q,"x"]]), S([[K*p,"x"],[K*q,"x"]])]), rep:r, ex:`Simple distributivité : ${devK([K,"x"],[[p,"x"],[q,""]]).join(" = ")}.`, sx:S_SD}; }} ],
 3:[ {g:()=>{ const p=ri(1,9); const A=[[1,""],[-p,"x"]], D=dev2(A,A); return {q:`Développe et réduis (1 − ${p===1?"":p}${x})(1 − ${p===1?"":p}${x}).`, c:ch3(D.r,[R([[1,""],[p*p,"x2"]]), R([[1,""],[-p*p,"x2"]]), R([[1,""],[-2*p,"x"],[-p*p,"x2"]])]), rep:D.r, ex:`${D.L.join(" = ")}.`, sx:S_DD}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 13", duree:50, info:"Durée : 50 min · Calculatrice non autorisée · Règle et crayon",
comp:[
  ["CHERCHER","Je reconnais un produit et je choisis la simple ou la double distributivité.","Ex. 1 (3 points)"],
  ["CALCULER","Je développe et je réduis avec la double distributivité.","Ex. 2 et 3 (11 points)"],
  ["RAISONNER","Je repère et je corrige une erreur de calcul.","Ex. 4 (3 points)"],
  ["MODÉLISER","J'exprime une aire de deux façons.","Ex. 5 (3 points)"]
],
exos:[
{t:"Simple ou double ?", p:3, h:`<p>Pour chaque expression, écris si c'est une somme ou un produit.</p><p>Pour les produits, indique s'il faut utiliser la simple ou la double distributivité pour le développer.</p><div class="calcs"><span>A = (${x} + 2)(${x} + 7)</span><span>B = (3${x} + 1) + (2${x} − 5)</span><span>C = 4(${x} − 6)</span><span>D = (2${x} − 3)(${x} + 4)</span><span>E = (5 − ${x}) − (${x} + 2)</span><span>F = 3${x}(2${x} + 1)</span></div>`,
 c:`<p>On regarde la dernière opération : + ou − → somme ; × → produit. Un seul facteur devant la parenthèse → simple distributivité ; deux parenthèses de deux termes → double distributivité.</p><p>A : produit, double · B : somme · C : produit, simple · D : produit, double · E : somme · F : produit, simple</p><p><i>(0,5 point par expression)</i></p>`},
{t:"Développer", p:5, h:`<p>Développe et réduis.</p><div class="calcs"><span>A = (${x} + 5)(${x} + 2)</span><span>B = (2${X("y")} + 3)(${X("y")} + 4)</span><span>C = (3${x} + 1)(4${x} + 2)</span></div>`,
 c:lines("A",`(${x} + 5)(${x} + 2)`,dev2([[1,"x"],[5,""]],[[1,"x"],[2,""]]).L).replace("</p>"," <i>(1,5 point)</i></p>")+lines("B",`(2${X("y")} + 3)(${X("y")} + 4)`,dev2([[2,"y"],[3,""]],[[1,"y"],[4,""]]).L).replace("</p>"," <i>(1,5 point)</i></p>")+lines("C",`(3${x} + 1)(4${x} + 2)`,dev2([[3,"x"],[1,""]],[[4,"x"],[2,""]]).L).replace("</p>"," <i>(2 points)</i></p>")},
{t:"Avec des soustractions", p:6, h:`<p>Développe et réduis.</p><div class="calcs"><span>D = (${x} − 3)(${x} + 6)</span><span>E = (2${x} − 5)(3 − ${x})</span><span>F = (−4 − ${x})(2${x} − 1)</span></div>`,
 c:[["D",[[1,"x"],[-3,""]],[[1,"x"],[6,""]]],["E",[[2,"x"],[-5,""]],[[3,""],[-1,"x"]]],["F",[[-4,""],[-1,"x"]],[[2,"x"],[-1,""]]]].map(([n,A,B])=>lines(n,w2(A,B),dev2(A,B).L).replace("</p>"," <i>(2 points)</i></p>")).join("")},
{t:"C'est toi le prof", p:3, h:`<p>Voici la copie de Léo. Chaque développement contient une erreur.</p><p><b>a)</b> (${x} + 4)(${x} − 2) = ${x}<sup>2</sup> − 8</p><p><b>b)</b> (3${x} − 1)(${x} + 5) = 3${x}<sup>2</sup> + 15${x} − ${x} + 5 = 3${x}<sup>2</sup> + 14${x} + 5</p><p>Explique chaque erreur, puis écris le bon développement.</p>`,
 c:`<p><b>a)</b> Léo a oublié deux produits : ${x} × (−2) et 4 × ${x}. <i>(0,5 point)</i></p><p class="calc">(${x} + 4)(${x} − 2) = ${x} × ${x} + ${x} × (−2) + 4 × ${x} + 4 × (−2)<br>= ${x}<sup>2</sup> − 2${x} + 4${x} − 8<br>= <b>${R([[1,"x2"],[-2,"x"],[4,"x"],[-8,""]])}</b></p><p><i>(1 point)</i></p>
  <p><b>b)</b> Léo s'est trompé de signe : (−1) × 5 = −5, et non + 5. <i>(0,5 point)</i></p><p class="calc">(3${x} − 1)(${x} + 5) = 3${x} × ${x} + 3${x} × 5 + (−1) × ${x} + (−1) × 5<br>= 3${x}<sup>2</sup> + 15${x} − ${x} − 5<br>= <b>${R([[3,"x2"],[15,"x"],[-1,"x"],[-5,""]])}</b></p><p><i>(1 point)</i></p>`},
{t:"Le potager", p:3, h:`<p>${x} désigne un nombre positif. Un potager rectangulaire mesure ${x} + 4 mètres de long et ${x} + 2 mètres de large.</p>${rect4(120,96,120,48,{w:["<i>x</i>","4"],h:["<i>x</i>","2"],alt:"Rectangle de longueur x + 4 et de largeur x + 2, partagé en quatre parties"})}
  <p><b>a)</b> Exprime l'aire du potager sous la forme d'un produit.</p><p><b>b)</b> Développe et réduis cette expression.</p><p><b>c)</b> Calcule l'aire du potager pour ${x} = 3, avec chacune des deux expressions.</p>`,
 c:`<p><b>a)</b> Aire = (${x} + 4)(${x} + 2) <i>(0,5 point)</i></p><p><b>b)</b></p><p class="calc">Aire = (${x} + 4)(${x} + 2)<br>Aire = ${x} × ${x} + ${x} × 2 + 4 × ${x} + 4 × 2<br>Aire = ${x}<sup>2</sup> + 2${x} + 4${x} + 8<br>Aire = <b>${R([[1,"x2"],[6,"x"],[8,""]])}</b> <i>(1,5 point)</i></p><p><b>c)</b> Pour ${x} = 3 :</p><p class="calc">avec le produit : (3 + 4)(3 + 2) = 7 × 5 = 35<br>avec la forme développée : 3<sup>2</sup> + 6 × 3 + 8 = 9 + 18 + 8 = 35</p><p>L'aire est 35 m<sup>2</sup>. <i>(1 point)</i></p>`}
]}
};
/* calculs en chaîne « A = … » dans les explications du QCM (outil défini dans 4e-1.js) */
CH["4e-13"].quiz.forEach(N=>Object.values(N.q).forEach(list=>list.forEach((it,i)=>{ if(it.g){ const g=it.g; list[i]={g:()=>window.CHN4.qChain(g())}; } else list[i]=window.CHN4.qChain(it); })));
})();
