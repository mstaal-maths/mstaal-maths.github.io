/* 4e — Chapitre 7 : Calcul littéral 1 — Produire et réduire des expressions littérales
   (cours B1, activités, progression d'exercices, activités rapides et « Puissance 4 » de M. Staal)
   Les lettres sont en italique (<i>x</i>) et on écrit 3<i>x</i> sans signe ×, comme dans le cours.
   Toutes les réductions des corrections sont calculées par l'outil CL7 (termes [coefficient, lettres]). */
(function(){
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const ch3=(good,bads)=>shuf(uniq(good,bads).slice(0,3));
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const ex=(p,alt,w)=>img("4k7ex/"+p+".png",alt,w);
const nz=(a,b)=>{ let v; do{ v=ri(a,b); }while(v===0); return v; };

/* ------------------------------------------------------------------
   Outil de calcul littéral
   un terme = [coefficient, lettres] ; lettres : "" (nombre), "x", "x2" (x²), "xy", "a2"…
------------------------------------------------------------------ */
const r3=x=>Math.round(x*1000)/1000;
const F=x=>{ const r=r3(x); const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const X=v=>`<i>${v}</i>`;
const V=v=>v.replace(/([a-zA-Z])(\d)?/g,(m,l,p)=>X(l)+(p&&p!=="1"?`<sup>${p}</sup>`:""));
/* lettres → {x:2,y:1} et retour (ordre alphabétique) */
const pv=v=>{ const o={}; v.replace(/([a-zA-Z])(\d)?/g,(m,l,p)=>{ o[l]=(o[l]||0)+(p?+p:1); }); return o; };
const tv=o=>Object.keys(o).sort().map(l=>l+(o[l]>1?o[l]:"")).join("");
const mulV=(a,b)=>{ const A=pv(a), B=pv(b); Object.entries(B).forEach(([l,e])=>A[l]=(A[l]||0)+e); return tv(A); };
const deg=v=>Object.values(pv(v)).reduce((s,e)=>s+e,0);
/* un terme écrit seul (first) ou à la suite d'autres (avec « + » ou « − ») */
const T=(c,v,first)=>{ const a=Math.abs(c), body=v?(a===1?"":F(a))+V(v):F(a); return first?(c<0?"−":"")+body:(c<0?" − ":" + ")+body; };
/* une somme de termes, sans rien changer */
const E=ts=>{ const t=ts.filter(([c])=>c!==0); return t.length?t.map(([c,v],i)=>T(c,v,i===0)).join(""):"0"; };
/* réduire : on regroupe les termes semblables (ordre d'apparition), puis on enlève les zéros */
const red=ts=>{ const m=new Map(); ts.forEach(([c,v])=>m.set(v,r3((m.get(v)||0)+c))); return [...m].map(([v,c])=>[c,v]).filter(([c])=>c!==0); };
/* ordre usuel : x² d'abord, puis x, puis les autres lettres, puis le nombre */
const ord=ts=>[...ts].sort((p,q)=>(deg(q[1])-deg(p[1]))||(p[1]<q[1]?-1:p[1]>q[1]?1:0));
const R=ts=>E(ord(red(ts)));
/* facteur dans un produit : entre parenthèses s'il est négatif (sauf en tête) */
const fac=([c,v],first)=>c<0&&!first?`(${E([[c,v]])})`:E([[c,v]]);
const prod=(p,q)=>[r3(p[0]*q[0]), mulV(p[1],q[1])];
const opp=ts=>ts.map(([c,v])=>[-c,v]);
const nb=ts=>ts.filter(([c])=>c!==0).length;
window.CL7={ri,pick,shuf,uniq,ch3,nz,r3,F,X,V,T,E,red,ord,R,fac,prod,opp,nb,mulV};
/* calculs en chaîne « A = … » (outils définis dans 4e-1.js) */
const {chn,chns,qChain}=window.CHN4;

/* ===================== figures dessinées (SVG) ===================== */
/* frise de Sophie : n carrés, chacun avec un « V » renversé */
function frise(n,s=46){ let d=""; for(let i=0;i<n;i++){ const x=10+i*s; d+=`<rect x="${x}" y="10" width="${s}" height="${s}" class="ln"/><path d="M${x} ${10+s} L${x+s/2} 14 L${x+s} ${10+s}" class="ln"/>`; }
  return `<svg class="fig" viewBox="0 0 ${20+n*s} ${20+s}" width="${20+n*s}" role="img" aria-label="${n} motif${n>1?"s":""} : des carrés avec un triangle dans chacun">${d}</svg>`; }
/* exercice 3 bis : une colonne de n carrés et une ligne de n − 1 carrés à droite */
function equerre(n,s=18){ let d=""; const H=4*s+4; for(let i=0;i<n;i++) d+=`<rect x="2" y="${H-(i+1)*s}" width="${s}" height="${s}" class="ln"/>`; for(let j=1;j<n;j++) d+=`<rect x="${2+j*s}" y="${H-s}" width="${s}" height="${s}" class="ln"/>`;
  return `<svg class="fig" viewBox="0 0 ${4+4*s} ${H+26}" width="${4+4*s}" role="img" aria-label="Étape ${n}">${d}<text x="${2+2*s}" y="${H+20}" class="lab">Étape ${n}</text></svg>`; }
/* exercice 8 : le rectangle ABCD et le petit rectangle DEFG */
const RCT=`<svg class="fig" viewBox="0 0 470 250" width="440" role="img" aria-label="Rectangle ABCD ; dans le coin D, le rectangle DEFG ; DG = 4, DE = x, GC = b, BC = a">
 <rect x="40" y="30" width="380" height="160" style="fill:color-mix(in srgb,var(--c) 18%,transparent);stroke:var(--ink);stroke-width:2"/>
 <rect x="40" y="135" width="110" height="55" style="fill:var(--surface);stroke:var(--ink);stroke-width:2"/>
 <path d="M40 45 h12 v-15 M408 30 v12 h12 M420 178 h-12 v12 M52 190 v-12 h-12 M40 147 h12 v-12 M138 135 v12 h12 M150 178 h-12 v12" class="thin"/>
 <text x="28" y="26" class="lab">A</text><text x="432" y="26" class="lab">B</text><text x="432" y="206" class="lab">C</text><text x="28" y="206" class="lab">D</text><text x="28" y="134" class="lab">E</text><text x="160" y="128" class="lab">F</text><text x="150" y="208" class="lab">G</text>
 <path d="M40 222 H150 M150 222 H420" class="thin"/><path d="M46 217 L40 222 L46 227 M144 217 L150 222 L144 227 M156 217 L150 222 L156 227 M414 217 L420 222 L414 227" class="thin"/>
 <text x="95" y="244" class="lab"><tspan font-style="normal">4</tspan></text><text x="285" y="244" class="lab" font-style="italic">b</text>
 <path d="M20 135 V190 M15 141 L20 135 L25 141 M15 184 L20 190 L25 184" class="thin"/><text x="10" y="168" class="lab" font-style="italic">x</text>
 <path d="M448 30 V190 M443 36 L448 30 L453 36 M443 184 L448 190 L453 184" class="thin"/><text x="462" y="115" class="lab" font-style="italic">a</text>
</svg>`;
/* texte HTML (<i>, <sup>) → texte SVG (tspan) */
const svgT=h=>String(h).replace(/<i>(.*?)<\/i>/g,'<tspan font-style="italic">$1</tspan>').replace(/<sup>(.*?)<\/sup>/g,'<tspan dy="-6" font-size="11">$1</tspan><tspan dy="6"></tspan>');
/* exercice 9 : la figure en forme de flèche (côtés codés) */
function fleche(top,side){ const P=[[30,30],[210,30],[280,110],[210,190],[30,190],[100,110]];
  const tk=(a,b,n)=>{ const mx=(a[0]+b[0])/2, my=(a[1]+b[1])/2, dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy), ux=-dy/L*7, uy=dx/L*7, tx=dx/L*3, ty=dy/L*3; let s="";
    for(let k=0;k<n;k++){ const o=(k-(n-1)/2)*2; s+=`<line x1="${(mx-ux+o*tx).toFixed(1)}" y1="${(my-uy+o*ty).toFixed(1)}" x2="${(mx+ux+o*tx).toFixed(1)}" y2="${(my+uy+o*ty).toFixed(1)}" class="pt" style="stroke-width:2"/>`; } return s; };
  let s=`<svg class="fig" viewBox="0 0 330 220" width="300" role="img" aria-label="Figure à six côtés : deux côtés de longueur ${top.replace(/<[^>]*>/g,"")} et quatre côtés de longueur ${side.replace(/<[^>]*>/g,"")}"><polygon points="${P.map(p=>p.join(",")).join(" ")}" class="ln" style="stroke-linejoin:round"/>`;
  s+=tk(P[0],P[1],2)+tk(P[3],P[4],2)+tk(P[1],P[2],1)+tk(P[2],P[3],1)+tk(P[4],P[5],1)+tk(P[5],P[0],1);
  return s+`<text x="120" y="20" class="lab" style="font-size:17px">${svgT(top)}</text><text x="272" y="62" class="lab" style="font-size:17px">${svgT(side)}</text></svg>`; }
window.CL7.frise=frise; window.CL7.fleche=fleche; window.CL7.svgT=svgT;

/* programmes de calcul (encadrés) */
const prog=(nom,steps)=>`<figure style="border:1.5px solid var(--line)"><figcaption><b>${nom} :</b></figcaption><ol class="steps">${steps.map(s=>`<li>${s}</li>`).join("")}</ol></figure>`;
const progs=(...p)=>`<div class="cgrid">${p.join("")}</div>`;
window.CL7.prog=prog; window.CL7.progs=progs;
const tab=(head,rows)=>`<div class="scroll"><table class="std"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;
window.CL7.tab=tab;

const x=X("x"), a=X("a"), b=X("b"), y=X("y"), s=X("s"), n=X("n");
const L=(...ts)=>E(ts);      /* écriture rapide d'une somme de termes */

/* ===================== Puissance 4 (tables de M. Staal) ===================== */
const P4A_R=[[[3,"x"],[-7,""]],[[-10,""]],[[-3,"x"],[8,""]],[[5,""],[-1,"x"]],[[2,"x"]]];
const P4A_C=[[[4,""]],[[1,"x"],[5,""]],[[3,""],[-1,"x"]],[[-4,"x"],[-8,""]],[[7,""]],[[5,"x"]]];
const P4B_R=[[-7,"x"],[-3,"a"],[6,""],[-8,""],[2,"x"]];
const P4B_C=[[4,""],[-3,"x"],[-6,""],[4,"a"],[1,"y"],[5,"x"]];
const p4add=(withC)=>tab(["+",...P4A_C.map(E)], P4A_R.map(r=>[E(r),...P4A_C.map(c=>withC?R([...r,...c]):"")]));
const p4mul=(withC)=>tab(["×",...P4B_C.map(t=>E([t]))], P4B_R.map(r=>[E([r]),...P4B_C.map(c=>withC?E([prod(r,c)]):"")]));

/* ===================== schémas (rappels en image) ===================== */
const S_MOD=sch("Modéliser par une expression",`${progs(prog("Programme",["Choisir un nombre","Ajouter 3","Multiplier par 2"]))}<p class="calc">Nombre choisi ${a} : (${a} + 3) × 2</p><p class="schN">Je remplace « le nombre choisi » par une lettre et j'écris les calculs dans l'ordre. Les parenthèses montrent ce qu'on calcule d'abord.</p>`);
const S_PROD=sch("Réduire un produit",`${chns([["A",[`${x} × 2`,`2${x}`]],["B",[`3${x} × (−4${y})`,`−12${x}${y}`]],["C",[`${x} × 3${x}`,`3${x}<sup>2</sup>`]]])}<p class="schN">Je multiplie les nombres entre eux (règle des signes), puis j'écris les lettres après le nombre.</p>`);
const S_SOM=sch("Réduire une somme",`${chns([["A",[`3${a} − 2 + ${a}`,`4${a} − 2`]],["B",[`4 + 5${x} : non réductible`]]])}<p class="schN">Je regroupe les termes semblables : les nombres ensemble, les ${x} ensemble, les ${x}<sup>2</sup> ensemble.</p>`);
const S_PAR=sch("Un « + » ou un « − » devant une parenthèse",`${chns([["A",[`7 + (−2${x} + 3)`,`7 − 2${x} + 3`,`−2${x} + 10`]],["B",[`5 − (3${y} − 4)`,`5 − 3${y} + 4`,`−3${y} + 9`]]])}<p class="schN">« + » devant : j'ajoute chaque terme, les signes ne changent pas. « − » devant : je soustrais chaque terme, tous les signes changent.</p>`);

CH["4e-7"]={
intro:"Produire une expression littérale pour modéliser un programme de calcul ou une formule, puis la réduire : produits, sommes, et parenthèses précédées d'un « + » ou d'un « − ».",
savoir:[
  "produire une expression littérale pour modéliser un programme de calcul ou exprimer une formule ;",
  "réduire un produit : le nombre devant, les lettres après ;",
  "réduire une somme en regroupant les termes semblables ;",
  "réduire une expression avec un « + » ou un « − » devant une parenthèse."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Expression littérale", h:`
  <div class="retenir" data-l="Définition"><p>Une <b>expression littérale</b> est un calcul contenant <b>une ou plusieurs lettres</b> qui désignent des nombres.</p><p>Si une même lettre apparaît plusieurs fois dans l'expression, elle désigne le même nombre.</p></div>
  <p><b>Exemples :</b></p>
  <p>On peut utiliser une expression littérale pour <b>modéliser un programme de calcul</b> :</p>
  ${progs(prog("Programme 1",["Choisir un nombre","Ajouter 3","Multiplier par 2"]), prog("Programme 2",["Choisir un nombre","Multiplier par 5","Soustraire 4"]))}
  <p>Soit ${a} le nombre choisi au départ. Le résultat du programme 1 est :</p><p class="calc">(${a} + 3) × 2</p>
  <p>Soit ${b} le nombre choisi au départ. Le résultat du programme 2 est :</p><p class="calc">${b} × 5 − 4</p>
  <p>On peut utiliser une expression littérale pour <b>exprimer une formule</b> :</p>
  <p>L'aire d'un carré de côté ${x} est donnée par la formule :</p><p class="calc">${x} × ${x} = ${x}<sup>2</sup></p>`},
{k:"II", t:"Réduire une expression littérale", h:`
  <div class="retenir" data-l="Définition"><p><b>Réduire</b> une expression littérale, c'est l'écrire sous une forme plus réduite :</p><p>avec le moins de termes possible et sans parenthèse.</p></div>
  <h4>a) Réduire une somme ou un produit sans parenthèse</h4>
  <div class="retenir" data-l="Méthodes"><p>Toute <b>multiplication</b> peut être réduite : le nombre devant, les lettres après.</p><p>Pour réduire une <b>somme</b>, on regroupe et on additionne les <b>termes semblables</b> : les nombres ensemble, les « ${x} » ensemble, les « ${a} » ensemble, les « ${x}<sup>2</sup> » ensemble…</p></div>
  <p><b>Exemple :</b> réduis les expressions suivantes.</p>
  <div class="calcs"><span>5 × ${a} = 5${a}</span><span>${x} × 2 = 2${x}</span><span>(−3) × ${x} = −3${x}</span><span>${x} × (−3) = −3${x}</span><span>3${x} × (−2) = −6${x}</span><span>3${x} × (−4${y}) = −12${x}${y}</span><span>${x} × 3${x} = 3${x}<sup>2</sup></span><span>4 + 5${x} : non réductible</span><span>3${a} − 2 + ${a} = 4${a} − 2</span></div>
  <p class="calc">5${x} − 3${y} − 2${x} + 3${x}<sup>2</sup> + 7 − 8${x}<sup>2</sup> = 3${x} − 5${x}<sup>2</sup> − 3${y} + 7</p>
  <h4>b) Réduire une expression avec un « + » ou un « − » devant une parenthèse</h4>
  <div class="retenir" data-l="Méthodes"><p>Quand on a un « <b>+</b> » devant une parenthèse, on <b>ajoute chaque membre</b> de la parenthèse.</p><p>Quand on a un « <b>−</b> » devant une parenthèse, on <b>soustrait chaque membre</b> de la parenthèse.</p></div>
  <p><b>Exemple :</b> réduis les expressions suivantes.</p>
  <p class="calc">A = 5${a} + (8${a} − 5)<br>A = 5${a} + 8${a} − 5<br>A = 13${a} − 5</p>
  <p class="calc">B = 7 + (−2${x} + 3)<br>B = 7 − 2${x} + 3<br>B = −2${x} + 10</p>
  <p class="calc">C = 5 − (3${y} − 4)<br>C = 5 − 3${y} + 4<br>C = −3${y} + 9</p>
  <p class="calc">D = 5${a} − (−8${a} + 5)<br>D = 5${a} + 8${a} − 5<br>D = 13${a} − 5</p>
  <div class="attention"><b>ATTENTION :</b> avec un « − » devant la parenthèse, <b>tous</b> les signes de la parenthèse changent : −(3${y} − 4) = −3${y} + 4.</div>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Produire une expression littérale", e:[
  {n:"Activité 1", t:"Lien entre le nombre de tables et le nombre de chaises", w:"Sur ta feuille et sur ton cahier", h:`<p>On dispose côte à côte des petites tables carrées pour former une table rectangulaire.</p><p>On dispose alors une chaise sur chaque côté accessible des tables carrées.</p>
   <div class="figs">${ex("t1","Une table carrée avec une chaise de chaque côté",130)}${ex("t2","Deux tables carrées côte à côte et leurs chaises",165)}${ex("t3","Trois tables carrées côte à côte et leurs chaises",205)}</div><p>Avec une table, avec deux tables, avec trois tables.</p>
   <p><b>a)</b> Combien de chaises peut-on disposer quand on a une table, deux tables et trois tables ? Indique ta réponse sous chaque dessin.</p><p><b>b)</b> Combien de chaises peut-on disposer quand on a 10 tables ? Explique sur ton cahier.</p><p><b>c)</b> Combien de chaises peut-on disposer quand on a 50 tables ? Explique sur ton cahier.</p><p><b>d)</b> Combien de chaises peut-on disposer quand on utilise ${n} tables carrées (${n} nombre entier supérieur à 1) ?</p>`,
   c:`<p><b>a)</b> 1 table : 4 chaises · 2 tables : 6 chaises · 3 tables : 8 chaises.</p><p><b>b)</b> Il y a 10 chaises d'un côté, 10 chaises de l'autre côté et 2 chaises aux bouts : 10 + 10 + 2 = <b>22 chaises</b>.</p><p><b>c)</b> 50 + 50 + 2 = <b>102 chaises</b>.</p><p><b>d)</b> ${n} + ${n} + 2 = <b>2${n} + 2</b> chaises.</p>`},
  {n:"Exercice 1", t:"Le nombre de carrés en fonction du numéro de l'étape", w:"Sur ta feuille", h:`${ex("e1","Étape 1 : 1 carré. Étape 2 : une ligne de 3 carrés et 1 carré au-dessus du milieu. Étape 3 : une ligne de 5 carrés et 2 carrés au-dessus du milieu. Étape 4 : une ligne de 7 carrés et 3 carrés au-dessus du milieu.",560)}
   <p><b>a)</b> Indique, sous chaque dessin, le nombre de carrés à chaque étape.</p><p><b>b)</b> Combien y aura-t-il de carrés à l'étape 50 ?</p><p><b>c)</b> Donne une expression qui calcule le nombre de carrés pour n'importe quelle étape.</p>`,
   c:`<p><b>a)</b> Étape 1 : 1 · Étape 2 : 4 · Étape 3 : 7 · Étape 4 : 10.</p><p>À chaque étape, on ajoute 3 carrés.</p><p><b>b)</b> À l'étape 50 : une ligne de 2 × 50 − 1 = 99 carrés et une colonne de 50 − 1 = 49 carrés au-dessus : 99 + 49 = <b>148 carrés</b>.</p><p><b>c)</b> À l'étape ${n} : (2${n} − 1) + (${n} − 1) = <b>3${n} − 2</b> carrés.</p><p>Vérification : à l'étape 4, 3 × 4 − 2 = 10.</p>`},
  {n:"Exercice 2", t:"Le nombre de petits carrés en fonction de la taille", w:"Sur ta feuille", h:`${ex("e2","Carré taille 1 : 3 × 3 petits carrés dont le centre est blanc. Taille 2 : 4 × 4 petits carrés dont les 2 × 2 du centre sont clairs. Taille 3 : 5 × 5 petits carrés dont les 3 × 3 du centre sont clairs.",460)}
   <p>On compte les petits carrés gris du contour.</p><p><b>a)</b> Indique, sous chaque dessin, le nombre de petits carrés gris à chaque étape.</p><p><b>b)</b> Combien y en aura-t-il pour le carré de taille 50 ?</p><p><b>c)</b> Donne une expression qui calcule le nombre de petits carrés gris pour n'importe quelle taille de carré.</p>`,
   c:`<p><b>a)</b> Taille 1 : 8 · Taille 2 : 12 · Taille 3 : 16.</p><p>À chaque taille, on ajoute 4 petits carrés.</p><p><b>b)</b> Pour la taille 50 : 4 côtés de 50 petits carrés, plus les 4 coins : 4 × 50 + 4 = <b>204</b>.</p><p><b>c)</b> Pour la taille ${n} : <b>4${n} + 4</b> petits carrés gris.</p><p>Vérification : pour la taille 3, 4 × 3 + 4 = 16.</p>`},
  {n:"Exercice 3", t:"Le nombre de segments en fonction du nombre de motifs", w:"Sur ton cahier", h:`<p>Sophie dessine une frise sur son cahier à partir de ce motif, qui est constitué de 6 segments :</p>${frise(1)}<p>Elle reproduit ensuite plusieurs motifs de la façon suivante :</p><div class="figs">${frise(2)}${frise(3)}</div>
   <p><b>a)</b> Combien de segments aura-t-elle tracés pour dessiner 50 motifs ?</p><p><b>b)</b> Donne une expression qui calcule le nombre de segments pour n'importe quel nombre de motifs dessinés.</p>`,
   c:`<p>1 motif : 6 segments · 2 motifs : 11 segments · 3 motifs : 16 segments.</p><p>Chaque nouveau motif utilise le côté du motif précédent : il ajoute 5 segments.</p><p><b>a)</b> 6 + 49 × 5 = 6 + 245 = <b>251 segments</b>.</p><p><b>b)</b> Avec ${n} motifs : le premier côté, puis 5 segments par motif : <b>5${n} + 1</b> segments.</p><p>Vérification : 5 × 50 + 1 = 251.</p>`},
  {n:"Exercice 3 bis", t:"Élaborer une formule", w:"Sur ton cahier", h:`<p>Élabore une formule permettant de calculer le nombre de carrés à partir du numéro de l'étape :</p><div class="figs">${[1,2,3,4].map(k=>equerre(k)).join("")}</div>`,
   c:`<p>Étape 1 : 1 · Étape 2 : 3 · Étape 3 : 5 · Étape 4 : 7 carrés.</p><p>À l'étape ${n} : une colonne de ${n} carrés et une ligne de ${n} − 1 carrés à droite.</p><p class="calc">${n} + (${n} − 1) = <b>2${n} − 1</b></p><p>Vérification : à l'étape 4, 2 × 4 − 1 = 7.</p>`},
  {n:"Exercice 4", t:"Programme de calcul", w:"Sur ton cahier", h:`<p>Voici deux programmes de calcul :</p>${progs(prog("Programme 1",["Choisir un nombre","Multiplier par 4","Soustraire 3"]),prog("Programme 2",["Choisir un nombre","Ajouter 5","Multiplier par 2"]))}
   <p><b>1)</b> Teste le programme 1 avec le nombre de ton choix et note ton (tes) calcul(s).</p><p><b>2)</b> Écris une expression littérale qui donne le résultat du programme 1 avec n'importe quel nombre choisi au départ.</p><p><b>3)</b> Réponds aux questions 1 et 2 pour le programme 2.</p>`,
   c:`<p><b>1)</b> Par exemple avec 5 : 5 × 4 = 20 ; 20 − 3 = <b>17</b>.</p><p><b>2)</b> Soit ${x} le nombre choisi : ${x} × 4 − 3 = <b>4${x} − 3</b>.</p><p><b>3)</b> Avec 5 : 5 + 5 = 10 ; 10 × 2 = <b>20</b>.</p><p>Soit ${x} le nombre choisi : <b>(${x} + 5) × 2</b>.</p><p><i>Le nombre choisi au départ est libre : vérifie ton résultat avec l'expression.</i></p>`},
  {n:"Exercice 5", t:"Modéliser par une expression littérale", w:"Sur ta feuille", h:`<p>Modélise chaque situation par une expression littérale.</p>
   <p><b>1)</b> Soit ${a} le nombre choisi au départ. Modélise le résultat par une expression littérale : A = ……</p>${progs(prog("Programme 3",["Choisir un nombre","Élever ce nombre au carré","Soustraire 3"]))}
   <p><b>2)</b> Soit ${b} le nombre choisi au départ. Modélise le résultat : B = ……</p>${progs(prog("Programme 4",["Choisir un nombre","Multiplier par 8","Ajouter 9"]))}
   <p><b>3)</b> Soit ${x} le nombre choisi au départ. Modélise le résultat : C = ……</p>${progs(prog("Programme 5",["Choisir un nombre","Soustraire 4","Multiplier par le nombre de départ","Ajouter 5"]))}
   <p><b>4)</b> Mia veut acheter deux jeux au même prix et un DVD à 16 €. On note ${X("p")} le prix, en €, d'un jeu.</p><p>Exprime, en fonction de ${X("p")}, la dépense totale de Mia : D = ……</p>
   <p><b>5)</b> Pour une location de voiture, on paye 50 € pour le véhicule et 0,05 € par kilomètre parcouru. On note ${X("k")} le nombre de kilomètres parcourus.</p><p>Exprime, en fonction de ${X("k")}, le coût de la location : E = ……</p>
   <p><b>6)</b> Ce quadrilatère a un côté variable. ${x} est un nombre positif.</p>${ex("e5q","Quadrilatère de côtés x, 2, 3 et 4",150)}<p>Exprime son périmètre F en fonction de ${x}.</p>
   <p><b>7)</b> Ce carré a ses côtés variables. ${x} est un nombre positif.</p>${ex("e5c","Carré de côté x",140)}<p>Exprime son périmètre G et son aire H en fonction de ${x}.</p>
   <p><b>8)</b> Ce rectangle a ses côtés variables. ${x} est un nombre positif. Sa largeur mesure ${x} et sa longueur est formée de deux segments codés de longueur ${x}.</p>${ex("e5r","Rectangle de largeur x ; sa longueur est formée de deux segments de longueur x",170)}<p>Exprime son périmètre I et son aire J en fonction de ${x}.</p>
   <p><b>9)</b> Ce rectangle a pour côtés 3 et ${x}. ${x} est un nombre positif.</p>${ex("e5g","Rectangle de côtés 3 et x",150)}<p>Exprime le périmètre K et l'aire L de ce rectangle de côtés 3 et ${x}, en fonction de ${x}.</p>`,
   c:`<p><b>1) à 5)</b></p>${chns([["A",[`${a} × ${a} − 3`,`<b>${a}<sup>2</sup> − 3</b>`]],["B",[`${b} × 8 + 9`,`<b>8${b} + 9</b>`]],["C",[`<b>(${x} − 4) × ${x} + 5</b>`]],["D",[`${X("p")} × 2 + 16`,`<b>2${X("p")} + 16</b>`]],["E",[`${X("k")} × 0,05 + 50`,`<b>0,05${X("k")} + 50</b>`]]])}
   <p><b>6) à 9)</b> On peut ensuite réduire les expressions :</p>${chns([["F",[`<b>${x} + 2 + 3 + 4</b>`,`${x} + 9`]],["G",[`${x} + ${x} + ${x} + ${x}`,`<b>4${x}</b>`]],["H",[`${x} × ${x}`,`<b>${x}<sup>2</sup></b>`]],["I",[`<b>${x} + ${x} + ${x} + ${x} + ${x} + ${x}</b>`,`6${x}`]],["J",[`<b>${x} × (${x} + ${x})</b>`,`${x} × 2${x}`,`2${x}<sup>2</sup>`]],["K",[`<b>${x} + 3 + ${x} + 3</b>`,`2${x} + 6`]],["L",[`${x} × 3`,`<b>3${x}</b>`]]])}`},
  {n:"Activité rapide 1", t:"Modélisation", w:"Sur ta feuille", h:`<p>Modéliser une situation, c'est la traduire, la représenter par des expressions mathématiques.</p>
   <p><b>1)</b> Soit ${x} le nombre choisi au départ. Modélise le résultat de ce programme par une expression littérale : A = ……</p>${progs(prog("Programme",["Choisir un nombre","Multiplier par 6","Ajouter 9"]))}
   <p><b>2)</b> Soit ${y} le nombre choisi au départ. Modélise le résultat de ce programme : B = ……</p>${progs(prog("Programme",["Choisir un nombre","Soustraire 8","Multiplier par 2"]))}
   <p><b>3)</b> Comme je vais régulièrement au cinéma, j'ai choisi un abonnement à l'année de 48 € qui me permet d'acheter une place à seulement 4 €.</p><p>On note ${X("f")} le nombre de fois où je suis allé au cinéma cette année.</p><p>Exprime, en fonction de ${X("f")}, l'argent que j'aurai dépensé au cinéma cette année : C = ……</p>
   <p><b>4)</b> Soit ${x} un nombre positif. Exprime les longueurs CH et CA en fonction de ${x}.</p>${ex("ar1","Rectangle ABHC. Sur le côté CH : trois segments codés de longueur x, puis un segment de longueur 6. Sur le côté CA : deux segments codés de longueur x, puis un segment de longueur 2.",240)}`,
   c:`${chns([["A",[`${x} × 6 + 9`,`<b>6${x} + 9</b>`]],["B",[`<b>(${y} − 8) × 2</b>`]],["C",[`48 + 4 × ${X("f")}`,`<b>48 + 4${X("f")}</b>`]],["CH",[`${x} + ${x} + ${x} + 6`,`<b>3${x} + 6</b>`]],["CA",[`${x} + ${x} + 2`,`<b>2${x} + 2</b>`]]])}`}
 ]},
{t:"Réduire une expression littérale", e:[
  {n:"Exercice 6", t:"Entraînement à la réduction d'expressions littérales", w:"Sur ta feuille", h:`<p>Réduis les expressions littérales suivantes lorsque c'est possible.</p>
   <div class="calcs"><span>A = 2 × ${x}</span><span>B = ${x} × 3</span><span>C = −4 × ${x}</span><span>D = 6${x} + 2</span><span>E = 4 − 3${x}</span><span>F = 3${x} − 2 + ${x}</span><span>G = 8 + 6${x} + 5</span><span>H = 8 + 6${x} − 5</span><span>I = −9 + 6${x} + 5 − 2${x}</span><span>J = 9 + 4${x} − 5${x}<sup>2</sup> − 2${x}<sup>2</sup></span><span>K = 4 × 3${x}</span><span>L = −2 × 5${x}</span><span>M = 4${x} × ${x}</span><span>N = 2${x} × 3${y}</span></div>`,
   c:`${chns([["A",[`2 × ${x}`,E([prod([2,""],[1,"x"])])]],["B",[`${x} × 3`,E([prod([1,"x"],[3,""])])]],["C",[`−4 × ${x}`,E([prod([-4,""],[1,"x"])])]],["D",[`6${x} + 2 : non réductible`]],["E",[`4 − 3${x} : non réductible`]],["F",[`3${x} − 2 + ${x}`,R([[3,"x"],[-2,""],[1,"x"]])]],["G",[`8 + 6${x} + 5`,R([[8,""],[6,"x"],[5,""]])]],
   ["H",[`8 + 6${x} − 5`,R([[8,""],[6,"x"],[-5,""]])]],["I",[`−9 + 6${x} + 5 − 2${x}`,R([[-9,""],[6,"x"],[5,""],[-2,"x"]])]],["J",[`9 + 4${x} − 5${x}<sup>2</sup> − 2${x}<sup>2</sup>`,R([[9,""],[4,"x"],[-5,"x2"],[-2,"x2"]])]],["K",[`4 × 3${x}`,E([prod([4,""],[3,"x"])])]],["L",[`−2 × 5${x}`,E([prod([-2,""],[5,"x"])])]],["M",[`4${x} × ${x}`,E([prod([4,"x"],[1,"x"])])]],["N",[`2${x} × 3${y}`,E([prod([2,"x"],[3,"y"])])]]])}`},
  {n:"Activité rapide 2", t:"Entraînement à la réduction d'expressions littérales", w:"Sur ta feuille", h:`<p>Réduis les expressions littérales suivantes lorsque c'est possible.</p>
   <div class="calcs"><span>A = 5${x} + 3${x}</span><span>B = −2${x}<sup>2</sup> + 6${x}<sup>2</sup></span><span>C = 5${x} + 3</span><span>D = 3${x} − 6 + 4${x}</span><span>E = −3 + 6${y} − 3${y} − 5</span><span>F = −3 + 6${x} − 5${x}<sup>2</sup></span><span>G = 5${x} × 3</span><span>H = −4 × 2${x}</span><span>I = 2${x} × 5${y}</span><span>J = 3${x} × ${x}</span></div>`,
   c:`${chns([["A",[`5${x} + 3${x}`,R([[5,"x"],[3,"x"]])]],["B",[`−2${x}<sup>2</sup> + 6${x}<sup>2</sup>`,R([[-2,"x2"],[6,"x2"]])]],["C",[`5${x} + 3 : non réductible`]],["D",[`3${x} − 6 + 4${x}`,R([[3,"x"],[-6,""],[4,"x"]])]],["E",[`−3 + 6${y} − 3${y} − 5`,R([[-3,""],[6,"y"],[-3,"y"],[-5,""]])]],
   ["F",[`−3 + 6${x} − 5${x}<sup>2</sup> : non réductible`]],["G",[`5${x} × 3`,E([prod([5,"x"],[3,""])])]],["H",[`−4 × 2${x}`,E([prod([-4,""],[2,"x"])])]],["I",[`2${x} × 5${y}`,E([prod([2,"x"],[5,"y"])])]],["J",[`3${x} × ${x}`,E([prod([3,"x"],[1,"x"])])]]])}<p>F n'est pas réductible, mais on peut ranger ses termes : F = ${R([[-3,""],[6,"x"],[-5,"x2"]])}.</p>`},
  {n:"Puissance 4", t:"Réduction d'écritures littérales", w:"Sur ta feuille", h:`<p>Dans chaque case, écris l'expression <b>réduite</b> obtenue avec l'expression de la ligne et celle de la colonne.</p><p>En classe, on joue à deux : une case juste est coloriée ; le premier qui aligne 4 cases a gagné.</p>
   <p><b>Puissance 4 n° 1 :</b> la <b>somme</b> de l'expression de la ligne et de celle de la colonne.</p>${p4add(false)}
   <p><b>Puissance 4 n° 2 :</b> le <b>produit</b> de l'expression de la ligne et de celle de la colonne.</p>${p4mul(false)}`,
   c:`<p><b>Puissance 4 n° 1</b> , par exemple :</p>${chn("A",[`(3${x} − 7) + (${x} + 5)`,`3${x} − 7 + ${x} + 5`,`4${x} − 2`])}${p4add(true)}<p><b>Puissance 4 n° 2</b> (par exemple : −7${x} × (−3${x}) = 21${x}<sup>2</sup>) :</p>${p4mul(true)}`},
  {n:"Activité 2", t:"Réduire des expressions avec un « + » ou un « − » devant une parenthèse", w:"Sur ta feuille", h:`<p>Réduis chaque expression. Dans chaque cas, ${s} représente une somme d'argent en €.</p>
   <p><b>Cas n° 1 :</b> lundi, au casino, Léo a gagné 15 € et le mardi, il a gagné 2 fois ${s} € et 20 €.</p><p>L'expression A représente le total de ses gains : A = 15 + (2${s} + 20).</p>
   <p><b>Cas n° 2 :</b> lundi, Léo a gagné 15 € et le mardi, il a gagné 2 fois ${s} € mais il a perdu ensuite 20 €.</p><p>L'expression B représente le total de ses gains : B = 15 + (2${s} − 20).</p>
   <p><b>Cas n° 3 :</b> lundi, Léo a gagné 15 € et le mardi, il a perdu 2 fois ${s} € et aussi 20 €.</p><p>L'expression C représente le total de ses gains : C = 15 − (2${s} + 20).</p>
   <p><b>Cas n° 4 :</b> D = 15 − (2${s} − 20).</p>`,
   c:`<p class="calc">A = 15 + (2${s} + 20)<br>A = 15 + 2${s} + 20<br>A = <b>${R([[15,""],[2,"s"],[20,""]])}</b></p><p class="calc">B = 15 + (2${s} − 20)<br>B = 15 + 2${s} − 20<br>B = <b>${R([[15,""],[2,"s"],[-20,""]])}</b></p>
   <p class="calc">C = 15 − (2${s} + 20)<br>C = 15 − 2${s} − 20<br>C = <b>${R([[15,""],[-2,"s"],[-20,""]])}</b></p><p class="calc">D = 15 − (2${s} − 20)<br>D = 15 − 2${s} + 20<br>D = <b>${R([[15,""],[-2,"s"],[20,""]])}</b></p>`},
  {n:"Exercice 7", t:"Réductions de toutes sortes d'expressions", w:"Sur ton cahier", h:`<p>Réduis chaque expression.</p>
   <div class="calcs"><span>A = 5 + (2${a} + 8)</span><span>B = 5${a} − (2${a} + 8)</span><span>C = 4 − (3${x} − 7)</span><span>D = 12${x}<sup>2</sup> + (−3${x} − 7)</span><span>E = 10${x}<sup>2</sup> + 4${x}<sup>2</sup> + 3 − 5${x} + 6${x} − 4</span><span>F = 9 − 10${X("t")} − 5${X("t")}<sup>2</sup> + 3${X("t")}<sup>2</sup> − 7</span><span>G = 4${x}<sup>2</sup> + 8 − (2${x} − 6)</span><span>H = (5${x} − 7) + 3${x}</span><span>I = 9${a}<sup>2</sup> + 4${a} × (−5) + 5${a} × 8${a}</span><span>J = 5${y} × 2${x} − 8${y} + 5 + 3${y}</span></div>`,
   c:`<div class="figs" style="gap:28px"><p class="calc">A = 5 + (2${a} + 8)<br>A = 5 + 2${a} + 8<br>A = <b>${R([[5,""],[2,"a"],[8,""]])}</b></p><p class="calc">B = 5${a} − (2${a} + 8)<br>B = 5${a} − 2${a} − 8<br>B = <b>${R([[5,"a"],[-2,"a"],[-8,""]])}</b></p><p class="calc">C = 4 − (3${x} − 7)<br>C = 4 − 3${x} + 7<br>C = <b>${R([[4,""],[-3,"x"],[7,""]])}</b></p><p class="calc">D = 12${x}<sup>2</sup> + (−3${x} − 7)<br>D = <b>${R([[12,"x2"],[-3,"x"],[-7,""]])}</b></p>
   <p class="calc">E = 10${x}<sup>2</sup> + 4${x}<sup>2</sup> + 3 − 5${x} + 6${x} − 4<br>E = <b>${R([[10,"x2"],[4,"x2"],[3,""],[-5,"x"],[6,"x"],[-4,""]])}</b></p>
   <p class="calc">F = 9 − 10${X("t")} − 5${X("t")}<sup>2</sup> + 3${X("t")}<sup>2</sup> − 7<br>F = <b>${R([[9,""],[-10,"t"],[-5,"t2"],[3,"t2"],[-7,""]])}</b></p><p class="calc">G = 4${x}<sup>2</sup> + 8 − (2${x} − 6)<br>G = 4${x}<sup>2</sup> + 8 − 2${x} + 6<br>G = <b>${R([[4,"x2"],[8,""],[-2,"x"],[6,""]])}</b></p><p class="calc">H = (5${x} − 7) + 3${x}<br>H = 5${x} − 7 + 3${x}<br>H = <b>${R([[5,"x"],[-7,""],[3,"x"]])}</b></p>
   <p class="calc">I = 9${a}<sup>2</sup> + 4${a} × (−5) + 5${a} × 8${a}<br>I = 9${a}<sup>2</sup> − 20${a} + 40${a}<sup>2</sup><br>I = <b>${R([[9,"a2"],prod([4,"a"],[-5,""]),prod([5,"a"],[8,"a"])])}</b></p><p class="calc">J = 5${y} × 2${x} − 8${y} + 5 + 3${y}<br>J = 10${x}${y} − 8${y} + 5 + 3${y}<br>J = <b>${R([prod([5,"y"],[2,"x"]),[-8,"y"],[5,""],[3,"y"]])}</b></p></div>
   <p>Pour E : 10 + 4 = 14 ; −5 + 6 = 1 ; 3 − 4 = −1. Pour F : −5 + 3 = −2 et 9 − 7 = 2.</p>`}
 ]},
{t:"Pour aller plus loin : expressions et figures", e:[
  {n:"Exercice 8", t:"Que représente chaque expression ?", w:"Sur ton cahier", h:`<p>Observe la figure.</p>${RCT}<p><b>1)</b> Relie chaque expression littérale (colonne de gauche) à ce qu'elle représente (colonne de droite).</p>
   ${tab(["Expression","Ce qu'elle représente"],[[`${b} + 4`,"Aire de DEFG"],[`4 × ${x}`,"Longueur AE"],[`(${a} + ${b} + 4) × 2`,"Aire de ABCD"],[`${a} − ${x}`,"Longueur CD"],[`(4 + ${x}) × 2`,"Périmètre de ABCD"],[`${a} × (${b} + 4)`,"Aire de ABCGFE"],[`${a} × (${b} + 4) − 4 × ${x}`,"Périmètre de DEFG"]])}
   <p><b>2)</b> Quelle est l'aire du domaine coloré ABCGFE lorsque ${a} = 5, ${x} = 2 et ${b} = 6 ?</p>`,
   c:`<p><b>1)</b> ${b} + 4 → longueur CD · 4 × ${x} → aire de DEFG · (${a} + ${b} + 4) × 2 → périmètre de ABCD · ${a} − ${x} → longueur AE · (4 + ${x}) × 2 → périmètre de DEFG · ${a} × (${b} + 4) → aire de ABCD · ${a} × (${b} + 4) − 4 × ${x} → aire de ABCGFE</p>
   <p><b>2)</b> On remplace ${a} par 5, ${x} par 2 et ${b} par 6 dans l'expression de l'aire de ABCGFE :</p>${chn("A",["5 × (6 + 4) − 4 × 2","5 × 10 − 8","50 − 8","<b>42</b>"])}<p>L'aire du domaine coloré est 42 (dans l'unité d'aire de la figure).</p>`},
  {n:"Exercice 9", t:"Périmètre d'une figure", w:"Sur ton cahier", h:`${fleche(`${x} + 3`,`2${x}`)}<p>Exprime en fonction de ${x} le périmètre de la figure. Simplifie l'expression si possible.</p><p>Les côtés codés de la même façon ont la même longueur.</p>`,
   c:`<p>La figure a 2 côtés de longueur ${x} + 3 et 4 côtés de longueur 2${x}.</p><p>On note P le périmètre.</p><p class="calc">P = (${x} + 3) + (${x} + 3) + 2${x} + 2${x} + 2${x} + 2${x}<br>P = ${x} + 3 + ${x} + 3 + 2${x} + 2${x} + 2${x} + 2${x}<br>P = <b>${R([[1,"x"],[3,""],[1,"x"],[3,""],[2,"x"],[2,"x"],[2,"x"],[2,"x"]])}</b></p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Modéliser par une expression", schema:S_MOD, q:{
 1:[ {g:()=>{ const k=ri(2,9), c=ri(1,9); return {q:`Programme : « Choisir un nombre ; multiplier par ${k} ; ajouter ${c} ». Soit ${x} le nombre choisi. Quel est le résultat ?`, c:ch3(L([k,"x"],[c,""]),[`(${x} + ${c}) × ${k}`, `${x} × (${k} + ${c})`]), rep:L([k,"x"],[c,""]), ex:`${x} × ${k} + ${c} = ${L([k,"x"],[c,""])}.`, sx:S_MOD}; }},
     {q:`Quelle formule donne l'aire d'un carré de côté ${x} ?`, c:[`${x} × ${x} = ${x}<sup>2</sup>`,`4${x}`,`2${x}`], rep:`${x} × ${x} = ${x}<sup>2</sup>`, ex:`Aire = côté × côté.`, sx:S_MOD} ],
 2:[ {g:()=>{ const k=ri(2,9), c=ri(1,9); return {q:`Programme : « Choisir un nombre ; ajouter ${c} ; multiplier par ${k} ». Soit ${a} le nombre choisi. Quel est le résultat ?`, c:ch3(`(${a} + ${c}) × ${k}`,[`${a} + ${c} × ${k}`, L([k,"a"],[c,""])]), rep:`(${a} + ${c}) × ${k}`, ex:`On ajoute d'abord ${c}, donc il faut des parenthèses : (${a} + ${c}) × ${k}.`, sx:S_MOD}; }},
     {g:()=>{ const k=pick([2,3,4]), d=ri(5,30); return {q:`Mia achète ${["","","deux","trois","quatre"][k]} jeux au même prix ${X("p")} (en €) et un DVD à ${d} €. Quelle est sa dépense totale ?`, c:ch3(L([k,"p"],[d,""]),[L([1,"p"],[d,""]), L([k+d,"p"]), `(${X("p")} + ${d}) × ${k}`]), rep:L([k,"p"],[d,""]), ex:`${X("p")} × ${k} + ${d} = ${L([k,"p"],[d,""])}.`, sx:S_MOD}; }} ],
 3:[ {g:()=>{ const c=ri(2,9), d=ri(1,9); return {q:`Programme : « Choisir un nombre ; soustraire ${c} ; multiplier par le nombre de départ ; ajouter ${d} ». Soit ${x} le nombre choisi. Quel est le résultat ?`, c:ch3(`(${x} − ${c}) × ${x} + ${d}`,[`(${x} × ${c}) × ${x} + ${d}`, `${x} − ${c} × ${x} + ${d}`]), rep:`(${x} − ${c}) × ${x} + ${d}`, ex:`On soustrait ${c} au nombre ${x}, puis on multiplie le résultat par ${x} : (${x} − ${c}) × ${x}, puis on ajoute ${d}.`, sx:S_MOD}; }},
     {g:()=>{ const f=pick([30,40,50,60]), p=pick([0.05,0.1,0.15,0.2]); return {q:`Une location coûte ${f} € pour le véhicule et ${F(p)} € par kilomètre parcouru. On note ${X("k")} le nombre de kilomètres. Quel est le coût de la location ?`, c:ch3(L([p,"k"],[f,""]),[L([f,"k"],[p,""]), L([r3(f+p),"k"]), L([p,"k"])]), rep:L([p,"k"],[f,""]), ex:`${X("k")} × ${F(p)} + ${f} = ${L([p,"k"],[f,""])}.`, sx:S_MOD}; }},
     {g:()=>{ const k=ri(2,4), c=ri(2,9); return {q:`Sur un côté d'un rectangle, on lit ${k} segments codés de longueur ${x}, puis un segment de longueur ${c}. Quelle est la longueur de ce côté ?`, c:ch3(L([k,"x"],[c,""]),[L([k+c,"x"]), L([1,"x"],[c,""]), L([k,"x"],[k*c,""])]), rep:L([k,"x"],[c,""]), ex:`${Array(k).fill(x).join(" + ")} + ${c} = ${L([k,"x"],[c,""])}.`, sx:S_MOD}; }} ]
}},
{nom:"Réduire un produit", schema:S_PROD, q:{
 1:[ {g:()=>{ const k=ri(2,9), v=pick(["x","a","y"]), first=Math.random()<0.5; const q=first?`${k} × ${X(v)}`:`${X(v)} × ${k}`, r=E([[k,v]]);
       return {q:`Réduis ${q}.`, c:ch3(r,[`${X(v)}${k}`, E([[k,""],[1,v]]), E([[k+1,v]])]), rep:r, ex:`Le nombre devant, la lettre après : ${r}.`, sx:S_PROD}; }} ],
 2:[ {g:()=>{ const p=[nz(-9,9),"x"], q=[nz(-9,9),""]; if(p[0]>0&&q[0]>0) q[0]=-q[0]; const r=E([prod(p,q)]);
       return {q:`Réduis ${fac(p,true)} × ${fac(q)}.`, c:ch3(r,[E([[-r3(p[0]*q[0]),"x"]]), E([[p[0]+q[0],"x"]]), E([[r3(p[0]*q[0]),"x2"]])]), rep:r, ex:`${F(p[0])} × ${fac(q)} = ${F(p[0]*q[0])} : ${r}.`, sx:S_PROD}; }},
     {g:()=>{ const k=ri(2,9); return {q:`Réduis ${X("x")} × ${k}${X("x")}.`, c:ch3(E([[k,"x2"]]),[E([[k,"x"]]), E([[k+1,"x"]]), E([[2*k,"x"]])]), rep:E([[k,"x2"]]), ex:`${X("x")} × ${X("x")} = ${X("x")}<sup>2</sup> : ${E([[k,"x2"]])}.`, sx:S_PROD}; }} ],
 3:[ {g:()=>{ const p=[nz(-6,6),"x"], q=[nz(-6,6),"y"]; if(Math.abs(p[0])===1) p[0]*=3; const r=E([prod(p,q)]);
       return {q:`Réduis ${fac(p,true)} × ${fac(q)}.`, c:ch3(r,[E([[-p[0]*q[0],"xy"]]), E([[p[0]*q[0],"x2"]]), E([p,q])]), rep:r, ex:`${F(p[0])} × ${q[0]<0?"("+F(q[0])+")":F(q[0])} = ${F(p[0]*q[0])} et ${X("x")} × ${X("y")} = ${X("x")}${X("y")}.`, sx:S_PROD}; }},
     {g:()=>{ const p=[nz(-7,7),"x"], q=[nz(-7,7),"x"]; if(Math.abs(p[0])===1) p[0]*=2; if(Math.abs(q[0])===1) q[0]*=4; const r=E([prod(p,q)]);
       return {q:`Réduis ${fac(p,true)} × ${fac(q)}.`, c:ch3(r,[E([[p[0]*q[0],"x"]]), E([[-p[0]*q[0],"x2"]]), E([[p[0]+q[0],"x2"]])]), rep:r, ex:`${F(p[0])} × ${q[0]<0?"("+F(q[0])+")":F(q[0])} = ${F(p[0]*q[0])} et ${X("x")} × ${X("x")} = ${X("x")}<sup>2</sup>.`, sx:S_PROD}; }} ]
}},
{nom:"Réduire une somme", schema:S_SOM, q:{
 1:[ {g:()=>{ const p=ri(2,9), q=ri(2,9); return {q:`Réduis ${L([p,"x"],[q,"x"])}.`, c:ch3(E([[p+q,"x"]]),[E([[p*q,"x"]]), E([[p+q,"x2"]]), E([[p,"x"],[q,""]])]), rep:E([[p+q,"x"]]), ex:`${p} + ${q} = ${p+q} : ${E([[p+q,"x"]])}.`, sx:S_SOM}; }},
     {g:()=>{ const p=ri(2,9), q=ri(2,9); return {q:`Peut-on réduire ${L([q,""],[p,"x"])} ?`, c:["Non : elle est non réductible",`Oui : ${E([[p+q,"x"]])}`], rep:"Non : elle est non réductible", ex:`${q} est un nombre et ${p}${X("x")} un terme en ${X("x")} : ils ne sont pas semblables.`, sx:S_SOM}; }} ],
 2:[ {g:()=>{ const t=[[ri(2,9),"x"],[nz(-9,9),""],[nz(-9,9),"x"]]; const r=R(t);
       return {q:`Réduis ${E(t)}.`, c:ch3(r,[R([t[0],[-t[1][0],""],t[2]]), R([t[0],t[1],[-t[2][0],"x"]]), E([[t[0][0]+t[1][0]+t[2][0],"x"]])]), rep:r, ex:`Termes en ${X("x")} : ${F(t[0][0])} + ${t[2][0]<0?`(${F(t[2][0])})`:F(t[2][0])} = ${F(t[0][0]+t[2][0])}. Nombres : ${F(t[1][0])}.`, sx:S_SOM}; }},
     {g:()=>{ const t=[[nz(-9,9),""],[ri(2,9),"y"],[-ri(1,9),"y"],[nz(-9,9),""]]; const r=R(t);
       return {q:`Réduis ${E(t)}.`, c:ch3(r,[R([t[0],t[1],[-t[2][0],"y"],t[3]]), R([[-t[0][0],""],t[1],t[2],t[3]]), E([[t[1][0]+t[2][0],"y2"],[t[0][0]+t[3][0],""]])]), rep:r, ex:`Termes en ${X("y")} : ${F(t[1][0])} − ${F(-t[2][0])} = ${F(t[1][0]+t[2][0])}. Nombres : ${F(t[0][0])} + ${t[3][0]<0?`(${F(t[3][0])})`:F(t[3][0])} = ${F(t[0][0]+t[3][0])}.`, sx:S_SOM}; }} ],
 3:[ {g:()=>{ const t=[[nz(-9,9),""],[nz(-9,9),"x"],[nz(-9,9),"x2"],[nz(-9,9),"x2"]]; if(t[2][0]+t[3][0]===0) t[3][0]+=1; if(t[3][0]===0) t[3][0]=2; const r=R(t);
       return {q:`Réduis ${E(t)}.`, c:ch3(r,[E([[t[2][0]+t[3][0]+t[1][0],"x2"],[t[0][0],""]]), R([t[0],t[1],[-t[2][0],"x2"],t[3]]), R([t[0],[t[1][0],"x2"],t[2],t[3]])]), rep:r, ex:`On regroupe les ${X("x")}<sup>2</sup> : ${F(t[2][0])} + ${t[3][0]<0?`(${F(t[3][0])})`:F(t[3][0])} = ${F(t[2][0]+t[3][0])}. Les ${X("x")} et les nombres restent seuls.`, sx:S_SOM}; }},
     {q:`Vrai ou faux : 4 + 5${X("x")} = 9${X("x")}.`, c:["Faux","Vrai"], rep:"Faux", ex:`4 + 5${X("x")} est non réductible (pour ${X("x")} = 2 : 4 + 10 = 14 et 9 × 2 = 18).`, sx:S_SOM} ]
}},
{nom:"Un « + » ou un « − » devant une parenthèse", schema:S_PAR, q:{
 1:[ {g:()=>{ const c=ri(2,15), p=[nz(-9,9),"x"], q=[nz(-9,9),""]; const r=R([[c,""],p,q]);
       return {q:`Réduis ${c} + (${E([p,q])}).`, c:ch3(r,[R([[c,""],p,[-q[0],""]]), R([[c,""],[-p[0],"x"],[-q[0],""]]), E([[c+p[0]+q[0],"x"]])]), rep:r, ex:`« + » devant la parenthèse : on ajoute chaque terme : ${c} + (${E([p,q])}) = ${E([[c,""],p,q])} = ${r}.`, sx:S_PAR}; }} ],
 2:[ {g:()=>{ const c=ri(2,15), p=[ri(2,9),"x"], q=[nz(-9,9),""]; const r=R([[c,""],opp([p,q])[0],opp([p,q])[1]]);
       return {q:`Réduis ${c} − (${E([p,q])}).`, c:ch3(r,[R([[c,""],[-p[0],"x"],q]), R([[c,""],p,[-q[0],""]]), R([[c,""],p,q])]), rep:r, ex:`« − » devant la parenthèse : tous les signes changent : ${c} − (${E([p,q])}) = ${E([[c,""],...opp([p,q])])} = ${r}.`, sx:S_PAR}; }} ],
 3:[ {g:()=>{ const u=[ri(2,9),"a"], p=[-ri(2,9),"a"], q=[nz(-9,9),""]; const r=R([u,...opp([p,q])]);
       return {q:`Réduis ${E([u])} − (${E([p,q])}).`, c:ch3(r,[R([u,[-p[0],"a"],q]), R([u,p,[-q[0],""]]), R([u,p,q])]), rep:r, ex:`Tous les signes de la parenthèse changent : ${E([u])} − (${E([p,q])}) = ${E([u,...opp([p,q])])} = ${r}.`, sx:S_PAR}; }},
     {g:()=>{ const u=[ri(2,9),"x2"], p=[ri(2,9),"x2"], q=[nz(-9,9),"x"], w=[nz(-9,9),""]; if(p[0]===u[0]) p[0]++; const r=R([u,...opp([p,q,w])]);
       return {q:`Réduis ${E([u])} − (${E([p,q,w])}).`, c:ch3(r,[R([u,[-p[0],"x2"],q,w]), R([u,p,q,w]), R([u,[-p[0],"x2"],[-q[0],"x"],w])]), rep:r, ex:`Tous les signes de la parenthèse changent : ${E([u])} − (${E([p,q,w])}) = ${E([u,...opp([p,q,w])])} = ${r}.`, sx:S_PAR}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 7", duree:50, info:"Durée : 50 min · Calculatrice non autorisée · Règle et crayon",
comp:[
  ["MODÉLISER","Je traduis un programme de calcul ou une situation par une expression littérale.","Ex. 1 (question 1), 2 et 3 (8 points)"],
  ["CALCULER","Je réduis un produit et une somme.","Ex. 1 (questions 2 et 3) et 4 (7 points)"],
  ["CALCULER","Je réduis une expression avec un « + » ou un « − » devant une parenthèse.","Ex. 1 (question 4) et 5 (5 points)"]
],
exos:[
{t:"QCM", p:4, h:`<p>Pour chaque question, entoure la bonne réponse. Aucune justification n'est demandée.</p>
  ${tab(["Question","Réponse A","Réponse B","Réponse C"],[[`1) « Choisir un nombre ${x} ; multiplier par 7 ; soustraire 2 » donne :`,`7(${x} − 2)`,`7${x} − 2`,`5${x}`],[`2) −5 × 3${x} =`,`−15${x}`,`−2${x}`,`15${x}`],[`3) 4${x} + 3${x}<sup>2</sup> =`,`7${x}<sup>3</sup>`,`7${x}<sup>2</sup>`,"non réductible"],[`4) 8 − (2${x} − 5) =`,`3 − 2${x}`,`13 − 2${x}`,`3 + 2${x}`]])}`,
 c:`<p>1) Réponse B : ${x} × 7 − 2 = 7${x} − 2 · 2) Réponse A : −5 × 3 = −15 · 3) Réponse C : ${x} et ${x}<sup>2</sup> ne sont pas des termes semblables · 4) Réponse B : 8 − 2${x} + 5 = 13 − 2${x}</p><p><i>(1 point par bonne réponse)</i></p>`},
{t:"Modéliser", p:4, h:`<p><b>a)</b> Soit ${x} le nombre choisi au départ. Écris le résultat de ce programme avec une expression littérale.</p>${progs(prog("Programme",["Choisir un nombre","Ajouter 6","Multiplier par le nombre de départ"]))}
  <p><b>b)</b> À la piscine, Nora paye un abonnement de 15 € par mois, puis 3 € par séance. On note ${X("p")} le nombre de séances dans le mois. Exprime, en fonction de ${X("p")}, ce que Nora paye dans le mois.</p>
  <p><b>c)</b> Un rectangle a pour longueur 2${x} et pour largeur 5. Exprime son périmètre, puis son aire, en fonction de ${x}. Réduis chaque expression.</p>`,
 c:`<p><b>a)</b> (${x} + 6) × ${x} <i>(1 point)</i></p><p><b>b)</b> 15 + 3 × ${X("p")} = 15 + 3${X("p")} <i>(1 point)</i></p><p><b>c)</b> Périmètre : 2${x} + 5 + 2${x} + 5 = ${R([[2,"x"],[5,""],[2,"x"],[5,""]])} <i>(1 point)</i></p><p>Aire : 2${x} × 5 = ${E([prod([2,"x"],[5,""])])} <i>(1 point)</i></p>`},
{t:"Des triangles d'allumettes", p:3, h:`<p>Avec des allumettes, Hugo construit une frise de triangles :</p>
  <div class="figs">${[1,2,3].map(k=>{ const Z=j=>[10+30*j, j%2?18:70], w=30*(k+1)+20; let d="";
    for(let j=0;j<=k;j++) d+=`<line x1="${Z(j)[0]}" y1="${Z(j)[1]}" x2="${Z(j+1)[0]}" y2="${Z(j+1)[1]}" class="ln"/>`;
    for(let i=0;i<k;i++) d+=`<line x1="${Z(i)[0]}" y1="${Z(i)[1]}" x2="${Z(i+2)[0]}" y2="${Z(i+2)[1]}" class="ln"/>`;
    return `<figure><svg class="fig" viewBox="0 0 ${w} 80" width="${w}" role="img" aria-label="Étape ${k} : ${k} triangle${k>1?"s":""}">${d}</svg><figcaption>Étape ${k} : ${k} triangle${k>1?"s":""}</figure>`; }).join("")}</div>
  <p>Étape 1 : 3 allumettes · Étape 2 : 5 allumettes · Étape 3 : 7 allumettes.</p>
  <p><b>a)</b> Combien faut-il d'allumettes à l'étape 4 ? à l'étape 10 ?</p><p><b>b)</b> Combien faut-il d'allumettes à l'étape 50 ?</p><p><b>c)</b> Donne une expression qui calcule le nombre d'allumettes à l'étape ${n}.</p>`,
 c:`<p>À chaque étape, on ajoute un triangle avec 2 allumettes.</p><p><b>a)</b> Étape 4 : 7 + 2 = 9 allumettes. Étape 10 : 2 × 10 + 1 = 21 allumettes. <i>(1 point)</i></p><p><b>b)</b> 2 × 50 + 1 = 101 allumettes. <i>(1 point)</i></p><p><b>c)</b> 1 allumette au départ, puis 2 par triangle : 2${n} + 1. <i>(1 point)</i></p>`},
{t:"Réduire", p:5, h:`<p>Réduis chaque expression lorsque c'est possible.</p>
  <div class="calcs"><span>A = 6 × ${x}</span><span>B = ${x} × (−9)</span><span>C = −2${x} × 7${y}</span><span>D = 3${x} × 4${x}</span><span>E = 9${x} − 4${x}</span><span>F = 5 + 2${x} − 8</span><span>G = 7${a} + 3 − ${a} + 6</span><span>H = 2${x}<sup>2</sup> + 5${x} − 7${x}<sup>2</sup> − ${x}</span><span>I = 6${x} + 1</span><span>J = −3 + 4${y} − 9${y} + 10</span></div>`,
 c:`${chns([["A",[`6 × ${x}`,E([prod([6,""],[1,"x"])])]],["B",[`${x} × (−9)`,E([prod([1,"x"],[-9,""])])]],["C",[`−2${x} × 7${y}`,E([prod([-2,"x"],[7,"y"])])]],["D",[`3${x} × 4${x}`,E([prod([3,"x"],[4,"x"])])]],["E",[`9${x} − 4${x}`,R([[9,"x"],[-4,"x"]])]],["F",[`5 + 2${x} − 8`,R([[5,""],[2,"x"],[-8,""]])]],["G",[`7${a} + 3 − ${a} + 6`,R([[7,"a"],[3,""],[-1,"a"],[6,""]])]],["H",[`2${x}<sup>2</sup> + 5${x} − 7${x}<sup>2</sup> − ${x}`,R([[2,"x2"],[5,"x"],[-7,"x2"],[-1,"x"]])]],["I",[`6${x} + 1 : non réductible`]],["J",[`−3 + 4${y} − 9${y} + 10`,R([[-3,""],[4,"y"],[-9,"y"],[10,""]])]]])}<p><i>(0,5 point par réponse)</i></p>`},
{t:"Des parenthèses", p:4, h:`<p>Réduis chaque expression en écrivant les étapes.</p><div class="calcs"><span>A = 9 + (4${x} − 2)</span><span>B = 3${x} − (${x} + 5)</span><span>C = 12 − (−5${y} + 8)</span><span>D = 2${x}<sup>2</sup> − (3${x}<sup>2</sup> − 4${x} + 1)</span></div>`,
 c:`<div class="figs" style="gap:28px"><p class="calc">A = 9 + (4${x} − 2)<br>A = 9 + 4${x} − 2<br>A = ${R([[9,""],[4,"x"],[-2,""]])} <i>(1 point)</i></p><p class="calc">B = 3${x} − (${x} + 5)<br>B = 3${x} − ${x} − 5<br>B = ${R([[3,"x"],[-1,"x"],[-5,""]])} <i>(1 point)</i></p><p class="calc">C = 12 − (−5${y} + 8)<br>C = 12 + 5${y} − 8<br>C = ${R([[12,""],[5,"y"],[-8,""]])} <i>(1 point)</i></p><p class="calc">D = 2${x}<sup>2</sup> − (3${x}<sup>2</sup> − 4${x} + 1)<br>D = 2${x}<sup>2</sup> − 3${x}<sup>2</sup> + 4${x} − 1<br>D = ${R([[2,"x2"],[-3,"x2"],[4,"x"],[-1,""]])} <i>(1 point)</i></p></div>`}
]}
};
/* calculs en chaîne « A = … » dans les explications du QCM */
CH["4e-7"].quiz.forEach(N=>Object.values(N.q).forEach(list=>list.forEach((it,i)=>{ if(it.g){ const g=it.g; list[i]={g:()=>qChain(g())}; } else list[i]=qChain(it); })));
})();
