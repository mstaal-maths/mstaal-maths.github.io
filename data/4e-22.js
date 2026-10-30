/* 4e — Chapitre 22 : Calcul littéral 4 — Résoudre une équation du 1er degré à une inconnue
   (cours B4, activités et feuilles d'exercices des semaines 11, 12, 13, feuille de corrections, exercice des balances,
   feuille d'exercices en classe). Lettres en italique ; les balances sont dessinées en SVG.
   Toutes les solutions sont calculées par le solveur EQ22 (équation a x + b = c x + d). */
(function(){
const {ri,pick,shuf,uniq,ch3,nz,F,X,E,R,prog,progs,tab}=window.CL7;
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const x=X("x"), n=X("n"), b=X("b");
const gcd=(p,q)=>q?gcd(q,p%q):Math.abs(p);

/* ------------------------------------------------------------------
   Nombres rationnels p/q (entiers) : écriture décimale si elle est finie, sinon fraction {p/q}
------------------------------------------------------------------ */
const Q=(p,q=1)=>{ p=Math.round(p*1000); q=Math.round(q*1000); if(q<0){p=-p;q=-q;} const g=gcd(p,q)||1; return [p/g,q/g]; };
const finite=q=>{ while(q%2===0) q/=2; while(q%5===0) q/=5; return q===1; };
const dec3=([p,q])=>finite(q)&&Math.abs(p*1000/q-Math.round(p*1000/q))<1e-9;   /* au plus 3 décimales */
const QS=([p,q])=>q===1?F(p):dec3([p,q])?F(p/q):(p<0?"−":"")+`{${Math.abs(p)}/${q}}`;
/* réponses acceptées au clavier : décimal, fraction */
const QR=([p,q])=>{ const r=[QS([p,q]).replace(/[{}]/g,"")]; if(q!==1){ r.push(`${p}/${q}`.replace("-","−")); if(dec3([p,q])) r.push(String(p/q).replace(".",",")); } return [...new Set(r)]; };

/* une expression a x + b (ordre : comme écrit) */
const ax=(a,v="x")=>E([[a,v]]);
const side=(a,c,first="x")=>first==="x"?E([[a,"x"],[c,""]]):E([[c,""],[a,"x"]]);
/* ------------------------------------------------------------------
   Résoudre a x + b = c x + d (écritures : order g/d = "x" (terme en x d'abord) ou "n" (nombre d'abord))
   étapes comme dans le cours : 1) éliminer x d'un membre ; 2) regrouper les nombres ; 3) diviser ; 4) conclure
------------------------------------------------------------------ */
function solve(a,bb,c,d,o={}){
  const v=o.v||"x", og=o.og||"x", od=o.od||"x";
  const S=(p,q,ord)=>{ const t=ord==="x"?[[p,v],[q,""]]:[[q,""],[p,v]]; return E(t); };
  const L=[]; let A=a, B=bb, C=c, D=d;
  const op=(t)=>`<span class="op">(${t})</span>`;
  L.push(`${S(a,bb,og)} = ${S(c,d,od)}`);
  let xl=true;                               /* x reste à gauche ? */
  if(c!==0 && a!==0){
    if(a>=c){ L.push(`${S(a-c,bb,og)} = ${F(d)} &nbsp; ${op(c<0?`on ajoute ${E([[-c,v]])} à chaque membre`:`on enlève ${E([[c,v]])} de chaque membre`)}`); A=a-c; C=0; }
    else { L.push(`${F(bb)} = ${S(c-a,d,od)} &nbsp; ${op(a<0?`on ajoute ${E([[-a,v]])} à chaque membre`:`on enlève ${E([[a,v]])} de chaque membre`)}`); C=c-a; A=0; xl=false; }
  } else if(a===0){ xl=false; }
  /* regrouper les nombres */
  if(xl){ if(B!==0){ L.push(`${E([[A,v]])} = ${F(D-B)} &nbsp; ${op(B>0?`on enlève ${F(B)} de chaque membre`:`on ajoute ${F(-B)} à chaque membre`)}`); D=D-B; B=0; } }
  else { if(D!==0){ L.push(`${F(B-D)} = ${E([[C,v]])} &nbsp; ${op(D>0?`on enlève ${F(D)} de chaque membre`:`on ajoute ${F(-D)} à chaque membre`)}`); B=B-D; D=0; } }
  const k=xl?A:C, r=xl?D:B, sol=Q(r,k);
  if(k!==1) L.push(xl?`${X(v)} = ${k<0?`${F(r)} ÷ (${F(k)})`:`${F(r)} ÷ ${F(k)}`} = ${QS(sol)} &nbsp; ${op(`on divise chaque membre par ${F(k)}`)}`:`${X(v)} = ${F(r)} ÷ ${k<0?`(${F(k)})`:F(k)} = ${QS(sol)} &nbsp; ${op(`on divise chaque membre par ${F(k)}`)}`);
  else if(!xl) L.push(`${X(v)} = ${F(r)}`);
  return {L, sol, s:QS(sol)};
}
/* vérification : valeur des deux membres pour la solution */
const val=(a,bb,[p,q])=>Q(a*p+bb*q,q);
window.EQ22={Q,QS,QR,solve,val,finite};

/* ------------------------------------------------------------------ balance (SVG)
   G, D : listes d'objets {b:nombre de boules} ou {w:masse} ; les masses empilées : {w, top:true} */
function balance(G,Dr,o={}){
  const W=420, cx=W/2, py=92, ball=o.ball||"●";
  let s=`<svg class="fig" viewBox="0 0 ${W} 150" width="${o.w||380}" role="img" aria-label="${o.alt||"Balance équilibrée"}">`;
  s+=`<path d="M${cx-24} 140 L${cx} 104 L${cx+24} 140 Z" style="fill:var(--surface);stroke:var(--ink);stroke-width:2"/><line x1="${cx}" y1="104" x2="${cx}" y2="${py+4}" class="ln"/>`;
  s+=`<line x1="40" y1="${py+4}" x2="${W-40}" y2="${py+4}" class="ln"/><path d="M20 ${py} Q100 ${py+16} 180 ${py}" class="ln"/><path d="M${W-180} ${py} Q${W-100} ${py+16} ${W-20} ${py}" class="ln"/>`;
  const draw=(items,x0)=>{ let xx=x0, px=x0, out=""; items.forEach(it=>{
      if(it.b){ const per=4, rows=Math.ceil(it.b/per); let k=0; for(let r=0;r<rows;r++){ const m=Math.min(per,it.b-r*per); for(let j=0;j<m;j++){ out+=`<circle cx="${xx+10+j*20+r*10}" cy="${py-10-r*17}" r="9" style="fill:var(--ink)"/>`; k++; } } xx+=Math.min(per,it.b)*20+8; }
      else { const w=it.w>=100?44:34, h=it.w>=100?26:20; const y0=py-h-(it.on?it.on:0); const X0=it.stack?px+5:xx; if(!it.stack) px=xx; out+=`<rect x="${X0}" y="${y0}" width="${w}" height="${h}" style="fill:var(--surface);stroke:var(--ink);stroke-width:1.6"/><text x="${X0+w/2}" y="${y0+h/2+5}" class="lab" style="font-size:14px">${it.w}</text>`; if(!it.stack) xx+=w+6; }
    }); return out; };
  s+=draw(G,30)+draw(Dr,W-170);
  return s+"</svg>";
}
window.EQ22.balance=balance;

/* ===================== schémas ===================== */
const S_VOC=sch("Le vocabulaire",`<p class="calc">5${x} + 2 = 10 + 3${x}</p><p class="schN">C'est une <b>équation</b> d'<b>inconnue</b> ${x}. Membre de gauche : 5${x} + 2. Membre de droite : 10 + 3${x}. La <b>solution</b> est la valeur de ${x} qui rend l'égalité vraie.</p>`);
const S_TEST=sch("Tester une solution",`<p class="calc">Pour ${x} = 4 : 5 × 4 + 2 = 22 et 10 + 3 × 4 = 22</p><p class="schN">Je calcule séparément les deux membres. S'ils sont égaux, le nombre est solution.</p>`);
const S_RES=sch("Résoudre une équation",`<p class="calc">5${x} + 2 = 10 + 3${x}<br>2${x} + 2 = 10 &nbsp;(− 3${x} de chaque côté)<br>2${x} = 8 &nbsp;(− 2 de chaque côté)<br>${x} = 4 &nbsp;(÷ 2 de chaque côté)</p><p class="schN">Ce que je fais à un membre, je le fais à l'autre : la balance reste équilibrée.</p>`);
const S_PB=sch("Mettre un problème en équation",`<p class="schN"><b>1)</b> Je choisis l'inconnue (${x} = …). <b>2)</b> J'écris l'égalité. <b>3)</b> Je résous. <b>4)</b> Je vérifie et je réponds par une phrase.</p><p class="calc">6 DVD + 55 € = 2 DVD + 85 € : 6${X("d")} + 55 = 2${X("d")} + 85</p>`);
const S_REM=sch("Remonter un programme",`<p class="calc">× 5 puis + 3 donne 24 : 24 − 3 = 21 et 21 ÷ 5 = 4,2</p><p class="schN">J'effectue les opérations inverses, dans l'ordre inverse.</p>`);

/* ===================== données ===================== */
/* exercice 1 : [a, b, c, d, ordre gauche, ordre droit] pour a x + b = c x + d */
const EX1=[["a",4,6,3,8],["b",5,8,1,18],["c",2,21,5,17],["d",8,0,3,6],["e",0,6,5,3,"n"],["f",5,0,0,15],["g",8,5,15,0,"n"],["h",13,1,9,15],["i",10,0,0,6],["j",9,4,0,8]];
const eqW=([l,a,bb,c,d,og="x",od="x"])=>`${og==="x"?E([[a,"x"],[bb,""]]):E([[bb,""],[a,"x"]])} = ${od==="x"?E([[c,"x"],[d,""]]):E([[d,""],[c,"x"]])}`;
const eqC=t=>{ const [l,a,bb,c,d,og="x",od="x"]=t, S=solve(a,bb,c,d,{og,od}); return `<p class="calc"><b>${l})</b> ${S.L.join("<br>")}</p><p>La solution est <b>${S.s}</b>.</p>`; };
const EX12=[["a",6,4,3,-8],["b",3,-5,2,4],["d",5,3,2,-4],["c",-2,3,3,18],["e",2,-3,-3,4]];
const EX13=[["21 a",5,3,2,6],["21 b",3,-4,-4,17],["21 c",2,-2,3,11],["21 d",3,1,-2,11],["22 a",4,3,2,6],["22 b",7,2,3,9],["22 c",5,-3,2,8],["22 d",5,3,-2,-3],["23 a",3,-1,2,1],["23 b",2,-1,4,-7],["23 c",5,6,2,9],["23 d",3,1,4,4]];
const lineEq=(l,t)=>`<p class="calc"><b>${l})</b> ${solve(...t).L.join("<br>")}</p><p>La solution est <b>${solve(...t).s}</b>.</p>`;
const BAL=[
  {G:[{b:1},{w:200}], D:[{w:500}], eq:`${b} + 200 = 500`, L:[`${b} = 500 − 200 &nbsp;<span class="op">(on enlève 200 g de chaque côté)</span>`,`${b} = 300`], r:"300"},
  {G:[{b:4}], D:[{w:500}], eq:`4${b} = 500`, L:[`${b} = 500 ÷ 4 &nbsp;<span class="op">(on partage chaque côté en 4)</span>`,`${b} = 125`], r:"125"},
  {G:[{b:2},{w:500},{w:200,on:26,stack:true}], D:[{b:3},{w:20}], eq:`2${b} + 700 = 3${b} + 20`, L:[`700 = ${b} + 20 &nbsp;<span class="op">(on enlève 2 boules de chaque côté)</span>`,`680 = ${b} &nbsp;<span class="op">(on enlève 20 g de chaque côté)</span>`], r:"680"},
  {G:[{b:7},{w:200}], D:[{w:500},{w:20,on:26,stack:true},{b:3}], eq:`7${b} + 200 = 520 + 3${b}`, L:[`4${b} + 200 = 520 &nbsp;<span class="op">(on enlève 3 boules de chaque côté)</span>`,`4${b} = 320 &nbsp;<span class="op">(on enlève 200 g de chaque côté)</span>`,`${b} = 80 &nbsp;<span class="op">(on partage chaque côté en 4)</span>`], r:"80"}
];
/* étapes dessinées de la résolution (activité 2 suite, question 1) : [gauche, droite, ce que l'on fait] */
const BSTEP=[
  [[[{b:1}],[{w:300}],"on enlève 200 g de chaque côté"]],
  [[[{b:1}],[{w:125}],"on partage chaque côté en 4"]],
  [[[{w:500},{w:200,on:26,stack:true}],[{b:1},{w:20}],"on enlève 2 boules de chaque côté"],[[{w:680}],[{b:1}],"on enlève 20 g de chaque côté : 700 − 20 = 680"]],
  [[[{b:4},{w:200}],[{w:500},{w:20,on:26,stack:true}],"on enlève 3 boules de chaque côté"],[[{b:4}],[{w:320}],"on enlève 200 g de chaque côté : 520 − 200 = 320"],[[{b:1}],[{w:80}],"on partage chaque côté en 4 : 320 ÷ 4 = 80"]]
];
const balAlt=i=>["Balance équilibrée : à gauche une boule et 200 g ; à droite 500 g","Balance équilibrée : à gauche 4 boules ; à droite 500 g","Balance équilibrée : à gauche 2 boules, 500 g et 200 g ; à droite 3 boules et 20 g","Balance équilibrée : à gauche 7 boules et 200 g ; à droite 500 g, 20 g et 3 boules"][i];
const say=(who,t)=>`<p><b>${who} :</b> « ${t} »</p>`;
const opl=t=>`<span class="op">(${t})</span>`;

CH["4e-22"]={
intro:"Comprendre ce qu'est une équation, retrouver un nombre de départ, résoudre une équation du premier degré à une inconnue (comme une balance qui reste équilibrée) et l'utiliser pour résoudre des problèmes.",
savoir:[
  "connaître le vocabulaire : équation, inconnue, membre, solution ;",
  "tester si un nombre est solution d'une équation ;",
  `résoudre une équation de la forme ${X("a")}${x} + ${X("b")} = ${X("c")}${x} + ${X("d")}, même avec des nombres négatifs ;`,
  "vérifier une solution ;",
  "mettre un problème en équation et le résoudre."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Définition", h:`
  <div class="retenir" data-l="Définition"><p>Une <b>équation</b> est une égalité qui comporte <b>un ou plusieurs nombres inconnus</b> désignés par une lettre.</p><p>On appelle ces nombres des <b>inconnues</b>.</p></div>
  <p><i>En 4<sup>e</sup>, nous travaillerons avec des équations à une inconnue.</i></p>
  <p><b>Exemple :</b> 5${x} + 2 = 10 + 3${x} est une équation d'<b>inconnue</b> ${x}.</p>
  <p>L'équation a deux membres : le <b>membre de gauche</b> (5${x} + 2) et le <b>membre de droite</b> (10 + 3${x}).</p>`},
{k:"II", t:"Résoudre une équation", h:`
  <div class="retenir" data-l="Définition"><p><b>Résoudre une équation d'inconnue ${x}</b>, c'est trouver la valeur que l'on peut donner à ${x} pour que l'égalité soit vraie.</p><p>Cette valeur est appelée la <b>solution de l'équation</b>.</p></div>
  <p><b>Exemple :</b> résoudre l'équation 5${x} + 2 = 10 + 3${x}.</p>
  <p>Je dois donc chercher la valeur de ${x} pour que l'égalité 5${x} + 2 = 10 + 3${x} soit vraie.</p>
  <div class="retenir" data-l="Méthode"><p><b>1)</b> On « élimine » les inconnues dans un membre.</p><p><b>2)</b> On regroupe les nombres dans l'autre membre.</p><p><b>3)</b> On trouve la valeur de l'inconnue.</p><p><b>4)</b> On conclut.</p><p>Ce que l'on fait à un membre, on le fait aussi à l'autre membre.</p></div>
  <p class="calc">5${x} + 2 = 10 + 3${x}<br>2${x} + 2 = 10 &nbsp; ${opl("étape 1 : − 3"+x+" dans chaque membre")}<br>2${x} = 8 &nbsp; ${opl("étape 2 : − 2 dans chaque membre")}<br>${x} = 4 &nbsp; ${opl("étape 3 : ÷ 2 dans chaque membre")}</p>
  <p><b>4)</b> La solution de l'équation est 4.</p>
  <p><b>Vérification :</b></p><p class="calc">5 × <b>4</b> + 2 = 22 : avec ${x} = 4, le membre de gauche est égal à 22.<br>10 + 3 × <b>4</b> = 22 : avec ${x} = 4, le membre de droite est égal à 22.</p>
  <p>Avec ${x} = 4, l'égalité est donc bien vérifiée. Donc notre résolution est correcte : 4 est bien la solution de l'équation 5${x} + 2 = 10 + 3${x}.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Retrouver le nombre choisi au départ", e:[
  {n:"Activité 1", t:"Trouve le nombre choisi au départ", w:"Sur ton cahier", h:`<p><b>PARTIE 1 : Lou</b></p>${say("Lou","Je multiplie mon nombre par 5, puis j'ajoute 3.")}<p><b>a)</b> Lou a trouvé 13 comme résultat. Quel nombre de départ a-t-elle choisi ? Explique.</p><p><b>b)</b> Lou a trouvé 24 comme résultat. Quel nombre de départ a-t-elle choisi ? Explique.</p><p><b>c)</b> Lou a trouvé −40 comme résultat. Quel nombre de départ a-t-elle choisi ? Explique.</p>
   <p><b>PARTIE 2 : Jules</b></p>${say("Jules","Eh bien moi, je multiplie mon nombre par 4, puis j'ajoute 9.")}<p><b>a)</b> Jules a trouvé 39,4 comme résultat. Quel nombre de départ a-t-il choisi ? Explique.</p><p><b>b)</b> Jules a trouvé 10 comme résultat. Quel nombre de départ a-t-il choisi ? Explique.</p>
   <p><b>PARTIE 3 : Lou et Jules</b></p><p>Lou (× 5, puis + 3) et Jules (× 4, puis + 9) choisissent un même nouveau nombre et trouvent le même résultat. Quel est le nombre qu'ils ont choisi au départ ?</p>
   <p><b>PARTIE 4 : deux nouveaux programmes</b></p>${say("Lou","Cette fois, je le multiplie par 7, puis j'ajoute 3.")}${say("Jules","Moi, je multiplie mon nombre par 2, puis j'ajoute 15.")}<p>Ils choisissent un même nouveau nombre et trouvent le même résultat. Quel est le nombre qu'ils ont choisi au départ ?</p>
   <p><b>PARTIE 5 : deux nouveaux programmes</b></p>${say("Lou","Je multiplie mon nombre par 8 et j'ajoute 7.")}${say("Jules","Je multiplie mon nombre par 5 et j'ajoute 12.")}<p>Ils choisissent un même nouveau nombre et trouvent le même résultat. Quel est le nombre qu'ils ont choisi au départ ?</p>`,
   c:`<p><b>PARTIE 1 a)</b> Facilement, on trouve que 2 × 5 + 3 = 13 : le nombre de départ est <b>2</b>.</p>
   <p><b>b) Méthode 1 – par tâtonnement :</b> avec la calculatrice, je teste différents nombres. 4 × 5 + 3 = 23 et 5 × 5 + 3 = 28 : le nombre est compris entre 4 et 5. Après plusieurs essais, je trouve 4,2 × 5 + 3 = 24.</p><p><b>Méthode 2 – remonter le programme :</b> je fais les opérations inverses : 24 − 3 = 21, puis 21 ÷ 5 = 4,2. Le nombre de départ est <b>4,2</b>.</p>
   <p><b>c)</b> Je remonte le programme : −40 − 3 = −43, puis −43 ÷ 5 = −8,6. Le nombre de départ est <b>−8,6</b>.</p>
   <p><b>PARTIE 2 a)</b> 39,4 − 9 = 30,4, puis 30,4 ÷ 4 = 7,6. Le nombre de départ est <b>7,6</b>.</p><p><b>b)</b> 10 − 9 = 1, puis 1 ÷ 4 = 0,25. Le nombre de départ est <b>0,25</b>.</p>
   <p><b>PARTIE 3</b> On ne peut pas remonter les programmes, car on n'a pas le résultat final. J'utilise la méthode 1, le tâtonnement. Après plusieurs essais : 6 × 5 + 3 = 33 et 6 × 4 + 9 = 33. Le nombre choisi au départ est <b>6</b>.</p>
   <p><b>PARTIE 4</b> Par tâtonnement : avec 1, Lou trouve 10 et Jules 17 ; avec 2, Lou trouve 17 et Jules 19 ; avec 3, Lou trouve 24 et Jules 21. À partir de 3, le résultat de Lou est devenu plus grand : les résultats ont été égaux pour un nombre compris entre 2 et 3.</p><p>Après plusieurs essais : 2,4 × 7 + 3 = 19,8 et 2,4 × 2 + 15 = 19,8. Le nombre choisi au départ est <b>2,4</b>.</p>
   <p><b>PARTIE 5</b> Le tâtonnement prend beaucoup de temps et on ne trouve pas de résultat exact. L'activité 2 (les balances) permet de résoudre ce problème :</p>
   <p>Si ${n} est le nombre choisi, je cherche ${n} pour que ${n} × 8 + 7 donne le même résultat que ${n} × 5 + 12 :</p><p class="calc">${solve(8,7,5,12,{v:"n"}).L.join("<br>")}</p><p>Le nombre choisi au départ est <b>{5/3}</b>.</p><p>Vérification à la calculatrice : {5/3} × 8 + 7 = {61/3} et {5/3} × 5 + 12 = {61/3}.</p>
   <div class="attention"><b>BILAN :</b> « 8${n} + 7 = 5${n} + 12 » est une <b>équation</b>. Tu viens de résoudre une équation !</div>`}
 ]},
{t:"Découvrir les équations avec des balances", e:[
  {n:"Activité 2", t:"Masse de la boule", w:"Sur ton cahier", h:`<p>Dans chacun des cas suivants, trouve la masse d'une boule et explique ta méthode.</p><p>Dans chaque cas, la balance est équilibrée et la masse de la boule est différente. Les masses sont en grammes.</p>
   ${BAL.map((B,i)=>`<p><b>Cas ${i+1}</b></p>${balance(B.G,B.D,{alt:balAlt(i)})}`).join("")}`,
   c:`<p><b>Cas 1 :</b> une boule et 200 g pèsent autant que 500 g. 500 − 200 = 300 : la boule pèse <b>300 g</b> (300 + 200 = 500).</p><p><b>Cas 2 :</b> 4 boules pèsent 500 g. 500 ÷ 4 = 125 : la boule pèse <b>125 g</b> (4 × 125 = 500).</p><p><b>Cas 3 :</b> j'enlève deux boules de chaque côté, la balance reste équilibrée : 200 g + 500 g d'un côté, une boule + 20 g de l'autre. J'enlève 20 g de chaque côté : la boule pèse 700 − 20 = <b>680 g</b>.</p><p><b>Cas 4 :</b> j'enlève trois boules de chaque côté : 4 boules + 200 g d'un côté, 520 g de l'autre. J'enlève 200 g de chaque côté : 4 boules pèsent 320 g. 4 × 80 = 320 : la boule pèse <b>80 g</b>.</p>`},
  {n:"Activité 2 (suite)", t:"Traduire les balances par des égalités", w:"Sur ton cahier", h:`<p>Reprends les quatre balances de l'activité 2.</p><p><b>1)</b> Retrouve la masse d'une boule en dessinant les étapes successives de résolution, en maintenant la balance équilibrée.</p><p><b>2)</b> Dans chaque cas, traduis mathématiquement le contenu des balances par une égalité d'expressions littérales.</p><p>Par exemple, on peut dire que ${b} est la masse d'une boule. Pour le premier cas, on a : ${b} + 200 = 500.</p>`,
   c:`<p><b>1)</b> On garde la balance équilibrée : ce que l'on enlève (ou partage) d'un côté, on le fait aussi de l'autre côté.</p>${BAL.map((B,i)=>`<p><b>Cas ${i+1} :</b></p><div class="figs" style="align-items:flex-start">${BSTEP[i].map(([G,D,t],k)=>`<figure>${balance(G,D,{w:330,alt:"Étape "+(k+1)+" : "+t})}<figcaption>Étape ${k+1} : ${t}</figcaption></figure>`).join("")}</div><p>La boule pèse <b>${B.r} g</b>.</p>`).join("")}<p><b>2)</b></p>${BAL.map((B,i)=>`<p><b>Cas ${i+1} :</b> si ${b} est la masse d'une boule :</p><p class="calc">${B.eq}<br>${B.L.join("<br>")}</p><p>La boule pèse <b>${B.r} g</b>.</p>`).join("")}`},
  {n:"Activité 3", t:"Masse d'un ballotin", w:"Sur ton cahier", h:`<p>Amélie utilise une balance pour préparer des ballotins de chocolats de même masse. Les masses sont indiquées en grammes.</p>${balance([{b:3},{w:20}],[{b:1},{w:100},{w:20},{w:20},{w:10,on:22,stack:true}],{alt:"Balance équilibrée : à gauche 3 ballotins et 20 g ; à droite 1 ballotin et 150 g (100 g, 20 g, 20 g et 10 g)"})}
   <p>À gauche : 3 ballotins et une masse de 20 g. À droite : 1 ballotin et des masses de 100 g, 20 g, 20 g et 10 g.</p><p><b>1)</b> Quelle est la masse d'un ballotin ?</p><p><b>2)</b> On appelle ${b} la masse d'un ballotin. Traduis mathématiquement chaque étape.</p>`,
   c:`<p>À droite, les masses font 100 + 20 + 20 + 10 = 150 g.</p><p class="calc">3${b} + 20 = ${b} + 150<br>2${b} + 20 = 150 &nbsp;${opl("− 1 ballotin de chaque côté")}<br>2${b} = 130 &nbsp;${opl("− 20 g de chaque côté")}<br>${b} = 65 &nbsp;${opl("÷ 2 de chaque côté")}</p><p>Un ballotin pèse <b>65 g</b>. Vérification : 3 × 65 + 20 = 215 et 65 + 150 = 215.</p>`}
 ]},
{t:"Résoudre des équations", e:[
  {n:"Exercice 1", t:"Résoudre des équations", w:"Sur ton cahier", h:`<p>Résous les équations suivantes.</p><div class="calcs">${EX1.map(t=>`<span>${t[0]}) ${eqW(t)}</span>`).join("")}</div>`,
   c:EX1.map(eqC).join("")}
 ]},
{t:"Résoudre des problèmes avec une équation", e:[
  {n:"Exercice 2", t:"Prix d'un DVD", w:"Sur ton cahier", h:`<p>Ces deux bons cadeaux ont la même valeur, et chaque DVD est au même prix.</p><div class="cgrid"><figure style="border:1.5px solid var(--line)"><p>6 DVD (au choix parmi 50)</p><p>1 skateboard (valeur 55 €)</p></figure><figure style="border:1.5px solid var(--line)"><p>2 DVD (au choix parmi 50)</p><p>1 trottinette (valeur 85 €)</p></figure></div><p>Quel est le prix d'un DVD ?</p>`,
   c:`<p>On appelle ${X("d")} le prix d'un DVD (en €). Les deux bons ont la même valeur :</p><p class="calc">${solve(6,55,2,85,{v:"d"}).L.join("<br>")}</p><p>Un DVD coûte <b>7,50 €</b>. Vérification : 6 × 7,5 + 55 = 100 et 2 × 7,5 + 85 = 100.</p>`},
  {n:"Exercice 3", t:"Largeur d'un rectangle", w:"Sur ton cahier", h:`<p>Un rectangle a pour longueur 9. Sa largeur est inconnue.</p><p>Quelle doit être la largeur du rectangle pour que son périmètre soit égal à 33 ?</p>`,
   c:`<p>On appelle ${x} la largeur. Le périmètre est 2 × (9 + ${x}) = 2${x} + 18.</p><p class="calc">${solve(2,18,0,33).L.join("<br>")}</p><p>La largeur doit être égale à <b>7,5</b>. Vérification : 2 × (9 + 7,5) = 2 × 16,5 = 33.</p>`},
  {n:"Exercice 4", t:"Retrouver le nombre de départ (1)", w:"Sur ton cahier", h:`${progs(prog("Programme 1",["Choisir un nombre","Multiplier par 4","Ajouter 6"]))}<p><b>a)</b> Le résultat trouvé avec ce programme est 38,8. Quel était le nombre choisi au départ ?</p><p><b>b)</b> Le résultat trouvé avec ce programme est 0. Quel était le nombre choisi au départ ?</p>`,
   c:`<p>Si ${x} est le nombre de départ, le résultat est 4${x} + 6.</p><p class="calc"><b>a)</b> ${solve(4,6,0,38.8).L.join("<br>")}</p><p>Le nombre de départ était <b>8,2</b>.</p><p class="calc"><b>b)</b> ${solve(4,6,0,0).L.join("<br>")}</p><p>Le nombre de départ était <b>−1,5</b>.</p>`},
  {n:"Exercice 5", t:"Retrouver le nombre de départ (2)", w:"Sur ton cahier", h:`${progs(prog("Programme 2",["Choisir un nombre","Ajouter 2","Multiplier par 7"]))}<p>Le résultat trouvé avec ce programme est 48. Quel était le nombre choisi au départ ?</p>`,
   c:`<p>Si ${x} est le nombre de départ, le résultat est (${x} + 2) × 7 = 7${x} + 14.</p><p class="calc">${solve(7,14,0,48).L.join("<br>")}</p><p>Le nombre de départ était <b>{34/7}</b>. Vérification : ({34/7} + 2) × 7 = {48/7} × 7 = 48.</p>`},
  {n:"Exercice 6", t:"Retrouver le nombre de départ (3)", w:"Sur ton cahier", h:`${progs(prog("Programme 3",["Choisir un nombre","Ajouter 4","Multiplier la somme par 7","Retirer 6"]))}<p><b>a)</b> Le résultat trouvé avec ce programme est 71. Quel était le nombre choisi au départ ?</p><p><b>b)</b> Le résultat trouvé avec ce programme est −22,8. Quel était le nombre choisi au départ ?</p>`,
   c:`<p>Si ${x} est le nombre de départ, le résultat est (${x} + 4) × 7 − 6 = 7${x} + 28 − 6 = 7${x} + 22.</p><p class="calc"><b>a)</b> ${solve(7,22,0,71).L.join("<br>")}</p><p>Le nombre de départ était <b>7</b>.</p><p class="calc"><b>b)</b> ${solve(7,22,0,-22.8).L.join("<br>")}</p><p>Le nombre de départ était <b>−6,4</b>.</p>`},
  {n:"Exercice 7", t:"Un rectangle qui devient un carré", w:"Sur ton cahier", h:`<p>${x} est une longueur. Un rectangle a pour longueur ${x} + 6 et pour largeur 3${x} − 4.</p>${window.CL12.rect({top:[["<i>x</i> + 6",200]], left:"3<i>x</i> − 4", H:80, alt:"Rectangle de longueur x + 6 et de largeur 3x − 4"}).replace(/viewBox="0 0 (\d+) (\d+)" width="(\d+)"/,(m,w,h,W)=>`viewBox="-40 0 ${+w+40} ${h}" width="${+W+40}"`).replace(/<text x="13" /,'<text x="-6" ')}<p><b>a)</b> Quelle doit être la valeur de ${x} pour que ce rectangle soit un carré ?</p><p><b>b)</b> Quelle est alors la longueur de son côté ?</p>`,
   c:`<p><b>a)</b> Pour que ce soit un carré, il faut que ses deux dimensions soient égales :</p><p class="calc">${solve(1,6,3,-4).L.join("<br>")}</p><p>Il faut ${x} = <b>5</b>.</p><p><b>b)</b> 5 + 6 = 11 et 3 × 5 − 4 = 11 : le côté du carré mesure <b>11</b>.</p>`},
  {n:"Exercice 8", t:"Retrouver le nombre de départ (4)", w:"Sur ton cahier", h:`${progs(prog("Programme 4",["Choisir un nombre","Ajouter 3","Multiplier la somme par 6","Retirer le double du nombre de départ"]))}<p><b>a)</b> Le résultat trouvé avec ce programme est 27. Quel était le nombre choisi au départ ?</p><p><b>b)</b> Le résultat trouvé avec ce programme est 0. Quel était le nombre choisi au départ ?</p>`,
   c:`<p>Si ${x} est le nombre de départ, le résultat est (${x} + 3) × 6 − 2${x} = 6${x} + 18 − 2${x} = 4${x} + 18.</p><p class="calc"><b>a)</b> ${solve(4,18,0,27).L.join("<br>")}</p><p>Le nombre de départ était <b>2,25</b>.</p><p class="calc"><b>b)</b> ${solve(4,18,0,0).L.join("<br>")}</p><p>Le nombre de départ était <b>−4,5</b>.</p>`},
  {n:"Exercice 9", t:"Même périmètre", w:"Sur ton cahier", h:`<p>${x} est une longueur. Un carré a pour côté ${x} + 2. Un triangle équilatéral a pour côté ${x} + 3.</p>${window.CL21.sqTri("<i>x</i> + 2","<i>x</i> + 3","<i>x</i> + 3")}<p>Quelle doit être la valeur de ${x} pour que le triangle et le carré aient le même périmètre ?</p>`,
   c:`<p>Périmètre du carré : 4(${x} + 2) = 4${x} + 8. Périmètre du triangle : 3(${x} + 3) = 3${x} + 9.</p><p class="calc">${solve(4,8,3,9).L.join("<br>")}</p><p>Il faut ${x} = <b>1</b>. Vérification : 4 × 3 = 12 et 3 × 4 = 12.</p>`},
  {n:"Exercice 10", t:"Les programmes de Mélanie", w:"Sur ton cahier", h:`${progs(prog("Programme 1",["Choisir un nombre","Multiplier par 5","Ajouter 3"]),prog("Programme 2",["Choisir un nombre","Soustraire 6","Multiplier par 3"]))}<p>Mélanie choisit un nombre de départ et l'applique au programme 1. Elle prend le même nombre de départ et l'applique au programme 2. Elle trouve le même résultat avec les deux programmes.</p><p>Quel était le nombre choisi au départ ?</p>`,
   c:`<p>Si ${x} est le nombre de départ : programme 1 → 5${x} + 3 ; programme 2 → (${x} − 6) × 3 = 3${x} − 18.</p><p class="calc">${solve(5,3,3,-18).L.join("<br>")}</p><p>Le nombre choisi au départ était <b>−10,5</b>. Vérification : 5 × (−10,5) + 3 = −49,5 et (−10,5 − 6) × 3 = −16,5 × 3 = −49,5.</p>`},
  {n:"Exercice 11", t:"Une histoire de périmètre", w:"Sur ton cahier", h:`<p>Le segment [AB] mesure 8,4 cm. Le point M est sur [AB]. On construit un triangle équilatéral de côté [AM] et un carré de côté [MB].</p><svg class="fig" viewBox="0 0 330 150" width="320" role="img" aria-label="Segment AB avec un point M : un triangle équilatéral sur AM et un carré sur MB"><polygon points="20,120 180,120 100,${(120-80*Math.sqrt(3)).toFixed(1)}" class="ln"/><rect x="180" y="20" width="100" height="100" class="ln"/><line x1="20" y1="120" x2="280" y2="120" class="ln"/><text x="20" y="142" class="lab">A</text><text x="180" y="142" class="lab">M</text><text x="280" y="142" class="lab">B</text></svg>
   <p>Où doit-on placer le point M sur le segment [AB] pour que le carré et le triangle équilatéral aient le même périmètre ?</p>`,
   c:`<p>On appelle ${x} la longueur AM (en cm). Alors MB = 8,4 − ${x}.</p><p>Périmètre du triangle : 3${x}. Périmètre du carré : 4 × (8,4 − ${x}) = 33,6 − 4${x}.</p><p class="calc">${solve(3,0,-4,33.6,{od:"n"}).L.join("<br>")}</p><p>Il faut placer M à <b>4,8 cm</b> de A (et donc à 3,6 cm de B). Vérification : 3 × 4,8 = 14,4 et 4 × 3,6 = 14,4.</p>`}
 ]},
{t:"Équations avec des nombres négatifs", e:[
  {n:"Exercice 12", t:"Résoudre des équations qui comportent un nombre négatif", w:"Sur ton cahier", h:`<p>Résous les équations suivantes, dans cet ordre : a), b), d), c), e).</p><div class="calcs">${EX12.map(([l,...t])=>`<span>${l}) ${eqW([l,...t])}</span>`).join("")}</div>`,
   c:EX12.map(([l,...t])=>lineEq(l,t)).join("")},
  {n:"Exercice 13", t:"Résoudre n'importe quelle équation", w:"Sur ton cahier", h:`<p>Résous les équations suivantes.</p><div class="calcs">${EX13.map(([l,...t])=>`<div><span><b>${l})</b> ${eqW([l,...t])}</span></div>`).join("")}</div>`,
   c:EX13.map(([l,...t])=>lineEq(l,t)).join("")}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Le vocabulaire", schema:S_VOC, q:{
 1:[ {q:`Dans l'équation 5${x} + 2 = 10 + 3${x}, comment appelle-t-on ${x} ?`, c:["l'inconnue","la solution","le membre"], rep:"l'inconnue", sx:S_VOC},
     {q:`Dans l'équation 5${x} + 2 = 10 + 3${x}, quel est le membre de droite ?`, c:[`10 + 3${x}`,`5${x} + 2`,`10`], rep:`10 + 3${x}`, sx:S_VOC} ],
 2:[ {q:"Résoudre une équation d'inconnue x, c'est…", c:["trouver la valeur de x qui rend l'égalité vraie","calculer les deux membres pour x = 0","réduire les deux membres"], rep:"trouver la valeur de x qui rend l'égalité vraie", sx:S_VOC} ],
 3:[ {q:"Laquelle de ces écritures est une équation ?", c:[`3${x} + 1 = 7`,`3${x} + 1`,`3 × 2 + 1 = 7`], rep:`3${x} + 1 = 7`, ex:"Une équation est une égalité qui comporte un nombre inconnu désigné par une lettre.", sx:S_VOC} ]
}},
{nom:"Tester une solution", schema:S_TEST, q:{
 1:[ {g:()=>{ const s=ri(1,9), a=ri(2,6), bb=ri(1,9), t=Math.random()<0.5?s:s+pick([-1,1,2]); const r=a*s+bb; return {q:`${t} est-il solution de l'équation ${a}${x} + ${bb} = ${r} ?`, c:["Oui","Non"], rep:t===s?"Oui":"Non", ex:`${a} × ${t} + ${bb} = ${a*t+bb}${t===s?` : on trouve bien ${r}.`:` et non ${r}.`}`, sx:S_TEST}; }} ],
 2:[ {g:()=>{ const s=ri(1,8), a=ri(3,7), c=ri(1,a-1), bb=ri(1,9), d=(a-c)*s+bb, t=Math.random()<0.5?s:s+pick([-1,1]); return {q:`${t} est-il solution de l'équation ${a}${x} + ${bb} = ${c===1?"":c}${x} + ${d} ?`, c:["Oui","Non"], rep:t===s?"Oui":"Non", ex:`Membre de gauche : ${a} × ${t} + ${bb} = ${a*t+bb}. Membre de droite : ${c} × ${t} + ${d} = ${c*t+d}.`, sx:S_TEST}; }} ],
 3:[ {g:()=>{ const s=-ri(1,6), a=ri(2,6), c=-ri(1,5), bb=ri(1,9), d=(a-c)*s+bb; const opts=uniq(String(F(s)),[F(-s),F(s-1),F(s+2)]).slice(0,3); return {q:`Parmi ces nombres, lequel est solution de ${a}${x} + ${bb} = ${E([[c,"x"],[d,""]])} ?`, c:shuf(opts), rep:F(s), ex:`Pour ${x} = ${F(s)} : ${a} × (${F(s)}) + ${bb} = ${F(a*s+bb)} et ${F(c)} × (${F(s)}) ${d<0?"−":"+"} ${F(Math.abs(d))} = ${F(c*s+d)}.`, sx:S_TEST}; }} ]
}},
{nom:"Résoudre a x + b = c", schema:S_RES, q:{
 1:[ {g:()=>{ const s=ri(-9,15), bb=ri(1,20); return {q:`Résous ${x} + ${bb} = ${s+bb}.`, rep:[F(s)], kb:"text", ex:`${x} = ${s+bb} − ${bb} = ${F(s)}.`, sx:S_RES}; }},
     {g:()=>{ const s=ri(2,12), a=ri(2,9); return {q:`Résous ${a}${x} = ${a*s}.`, rep:[F(s)], kb:"text", ex:`${x} = ${a*s} ÷ ${a} = ${s}.`, sx:S_RES}; }} ],
 2:[ {g:()=>{ const a=ri(2,9), s=ri(-6,10), bb=nz(-12,12); const S=solve(a,bb,0,a*s+bb); return {q:`Résous ${E([[a,"x"],[bb,""]])} = ${F(a*s+bb)}.`, rep:[F(s)], kb:"text", ex:S.L.join(" ; ").replace(/<span class="op">|<\/span>/g,""), sx:S_RES}; }} ],
 3:[ {g:()=>{ const a=pick([2,4,5,10]); let r; do{ r=nz(-30,30); }while(r%a===0); const bb=ri(1,9); const S=solve(a,bb,0,r+bb); return {q:`Résous ${E([[a,"x"],[bb,""]])} = ${F(r+bb)}.`, rep:QR(S.sol), kb:"text", ex:S.L.join(" ; ").replace(/<span class="op">|<\/span>/g,""), sx:S_RES}; }},
     {g:()=>{ const a=pick([3,6,7,9]); let r; do{ r=ri(1,20); }while(r%a===0||gcd(r,a)!==1); return {q:`Quelle est la solution de ${a}${x} = ${r} ?`, c:shuf(uniq(`{${r}/${a}}`,[`{${a}/${r}}`, F(r-a), F(Math.round(r/a*100)/100)]).slice(0,3)), rep:`{${r}/${a}}`, ex:`${x} = ${r} ÷ ${a} = {${r}/${a}} (la division ne tombe pas juste : on garde la fraction).`, sx:S_RES}; }} ]
}},
{nom:"Résoudre a x + b = c x + d", schema:S_RES, q:{
 1:[ {g:()=>{ const s=ri(1,9), c=ri(1,6), a=c+1, bb=ri(1,9), d=s+bb; const S=solve(a,bb,c,d); return {q:`Résous ${a}${x} + ${bb} = ${c===1?"":c}${x} + ${d}.`, rep:[S.s], kb:"text", ex:S.L.join(" ; ").replace(/<span class="op">|<\/span>/g,""), sx:S_RES}; }} ],
 2:[ {g:()=>{ const s=ri(-5,9), c=ri(1,5), a=c+ri(2,5), bb=nz(-9,9), d=(a-c)*s+bb; const S=solve(a,bb,c,d); return {q:`Résous ${E([[a,"x"],[bb,""]])} = ${E([[c,"x"],[d,""]])}.`, rep:[S.s], kb:"text", ex:S.L.join(" ; ").replace(/<span class="op">|<\/span>/g,""), sx:S_RES}; }} ],
 3:[ {g:()=>{ let a,c,bb,d; do{ a=nz(-5,8); c=nz(-5,8); bb=nz(-12,12); d=nz(-12,12); }while(a===c); const S=solve(a,bb,c,d); return {q:`Résous ${E([[a,"x"],[bb,""]])} = ${E([[c,"x"],[d,""]])}.`, rep:QR(S.sol), kb:"text", ex:S.L.join(" ; ").replace(/<span class="op">|<\/span>/g,""), sx:S_RES}; }} ]
}},
{nom:"Mettre un problème en équation", schema:S_PB, q:{
 1:[ {g:()=>{ const a=ri(2,6), bb=ri(1,9), s=ri(2,12); return {q:`« Je multiplie mon nombre par ${a}, puis j'ajoute ${bb}. » J'ai trouvé ${a*s+bb}. Quel était mon nombre de départ ?`, rep:[String(s)], kb:"text", ex:`Je remonte le programme : ${a*s+bb} − ${bb} = ${a*s}, puis ${a*s} ÷ ${a} = ${s}.`, sx:S_REM}; }} ],
 2:[ {g:()=>{ const p=ri(3,9), q=ri(1,p-2), d=ri(2,15), A=ri(10,40), B=A+(p-q)*d; return {q:`${p} DVD + un jeu à ${A} € coûtent autant que ${q} DVD + un jeu à ${B} €. Quelle équation traduit ce problème (${X("d")} = prix d'un DVD) ?`, c:shuf([`${p}${X("d")} + ${A} = ${q===1?"":q}${X("d")} + ${B}`,`${p}${X("d")} + ${B} = ${q===1?"":q}${X("d")} + ${A}`,`${p+q}${X("d")} = ${A+B}`]), rep:`${p}${X("d")} + ${A} = ${q===1?"":q}${X("d")} + ${B}`, ex:`Les deux achats coûtent la même somme. La solution est ${X("d")} = ${d} €.`, sx:S_PB}; }} ],
 3:[ {g:()=>{ const L=ri(5,15), l2=ri(2,9)*2+1; const P=2*L+l2; return {q:`Un rectangle a pour longueur ${L}. Quelle doit être sa largeur pour que son périmètre soit égal à ${P} ?`, rep:QR(Q(P-2*L,2)), kb:"text", ex:`2 × (${L} + ${x}) = ${P}, donc ${2*L} + 2${x} = ${P}, 2${x} = ${P-2*L} et ${x} = ${QS(Q(P-2*L,2))}.`, sx:S_PB}; }},
     {g:()=>{ let k,sv,p,m; do{ k=ri(2,4); sv=ri(2,8); p=ri(1,9); m=k*sv-p-sv; }while(m<=0); return {q:`Un rectangle a pour longueur ${x} + ${m} et pour largeur ${k}${x} − ${p}. Pour quelle valeur de ${x} est-ce un carré ?`, rep:[String(sv)], kb:"text", ex:`${x} + ${m} = ${k}${x} − ${p}, donc ${m+p} = ${k-1===1?"":k-1}${x} et ${x} = ${sv}.`, sx:S_PB}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 22", duree:50, info:"Durée : 50 min · Calculatrice autorisée · Règle et crayon",
comp:[
  ["CHERCHER","Je teste si un nombre est solution d'une équation.","Ex. 1 (3 points)"],
  ["CALCULER","Je résous une équation du premier degré.","Ex. 2 et 3 (11 points)"],
  ["MODÉLISER","Je mets un problème en équation et je le résous.","Ex. 4 et 5 (6 points)"]
],
exos:[
{t:"Est-ce une solution ?", p:3, h:`<p>Justifie chaque réponse par un calcul.</p><p><b>a)</b> 3 est-il solution de l'équation 4${x} − 5 = 2${x} + 1 ?</p><p><b>b)</b> −1 est-il solution de l'équation 3${x} + 7 = ${x} + 2 ?</p>`,
 c:`<p><b>a)</b> Je remplace ${x} par 3 dans chaque membre.</p><p class="calc">Membre de gauche : 4 × 3 − 5 = 12 − 5 = 7<br>Membre de droite : 2 × 3 + 1 = 6 + 1 = 7</p><p>Les deux membres sont égaux, donc <b>3 est solution</b>. <i>(1,5 point)</i></p><p><b>b)</b> Je remplace ${x} par −1 dans chaque membre.</p><p class="calc">Membre de gauche : 3 × (−1) + 7 = −3 + 7 = 4<br>Membre de droite : −1 + 2 = 1</p><p>4 ≠ 1, donc <b>−1 n'est pas solution</b>. <i>(1,5 point)</i></p>`},
{t:"Résoudre des équations", p:8, h:`<p>Résous les équations suivantes et vérifie tes solutions.</p><div class="calcs"><span>a) ${x} + 9 = 4</span><span>b) 6${x} = 21</span><span>c) 3${x} + 4 = 19</span><span>d) 7${x} − 2 = 4${x} + 10</span><span>e) 2${x} + 15 = 6${x} + 3</span><span>f) 5${x} + 8 = 2${x} − 7</span></div>`,
 c:[["a",1,9,0,4,"(1 point)"],["b",6,0,0,21,"(1 point)"],["c",3,4,0,19,"(1,5 point)"],["d",7,-2,4,10,"(1,5 point)"],["e",2,15,6,3,"(1,5 point)"],["f",5,8,2,-7,"(1,5 point)"]].map(([l,a,bb,c,d,p])=>{ const S=solve(a,bb,c,d); return `<p class="calc"><b>${l})</b> ${S.L.join("<br>")}</p><p>La solution est <b>${S.s}</b>. <i>${p}</i></p>`; }).join("")},
{t:"Le programme de Lina", p:3, h:`${progs(prog("Programme",["Choisir un nombre","Multiplier par 3","Ajouter 8"]))}<p><b>a)</b> Lina a obtenu 29. Quel nombre a-t-elle choisi au départ ?</p><p><b>b)</b> Elle obtient maintenant 2. Quel nombre a-t-elle choisi ?</p>`,
 c:`<p>Le résultat est 3${x} + 8, si ${x} est le nombre de départ.</p><p class="calc"><b>a)</b> ${solve(3,8,0,29).L.join("<br>")}</p><p>Lina a choisi <b>7</b>. <i>(1,5 point)</i></p><p class="calc"><b>b)</b> ${solve(3,8,0,2).L.join("<br>")}</p><p>Lina a choisi <b>−2</b>. <i>(1,5 point)</i></p>`},
{t:"La balance", p:3, h:`<p>La balance est équilibrée. Toutes les boules ont la même masse ${b} (en grammes).</p>${balance([{b:5},{w:30}],[{b:2},{w:100},{w:20}],{alt:"Balance équilibrée : à gauche 5 boules et 30 g ; à droite 2 boules, 100 g et 20 g"})}<p>À gauche : 5 boules et 30 g. À droite : 2 boules, 100 g et 20 g.</p><p><b>a)</b> Écris une équation qui traduit cette balance.</p><p><b>b)</b> Résous-la, puis donne la masse d'une boule.</p>`,
 c:`<p><b>a)</b> 5${b} + 30 = 2${b} + 120 <i>(1 point)</i></p><p class="calc"><b>b)</b> ${solve(5,30,2,120,{v:"b"}).L.join("<br>")}</p><p>Une boule pèse <b>30 g</b>. <i>(2 points)</i></p>`},
{t:"Les cahiers", p:3, h:`<p>Léa achète 4 cahiers et un stylo à 3 €. Tom achète 2 cahiers et un livre à 9 €. Tous les cahiers ont le même prix, et Léa et Tom paient la même somme.</p><p>Quel est le prix d'un cahier ? Écris une équation, résous-la, puis réponds par une phrase.</p>`,
 c:`<p>On appelle ${X("c")} le prix d'un cahier (en €) : 4${X("c")} + 3 = 2${X("c")} + 9. <i>(1 point)</i></p><p class="calc">${solve(4,3,2,9,{v:"c"}).L.join("<br>")}</p><p><i>(1,5 point)</i></p><p>Un cahier coûte <b>3 €</b>. Vérification : 4 × 3 + 3 = 15 et 2 × 3 + 9 = 15. <i>(0,5 point)</i></p>`}
]}
};
/* clavier texte pour toutes les réponses tapées (signe −, virgule, barre de fraction) */
CH["4e-22"].quiz.forEach(N=>Object.values(N.q).forEach(list=>list.forEach((it,i)=>{
  if(it.g){ const g=it.g; list[i]={g:()=>Object.assign(g(),{kb:"text"})}; } else it.kb="text";
})));
})();
