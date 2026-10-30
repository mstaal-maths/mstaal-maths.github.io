/* 5e · chapitre 9 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres.
   Toutes les corrections sont calculées à partir des nombres tirés. */
TRAIN["5e-9"] = function(){
const {ri, pick, shuf} = TR;
const {F, Fs, cols} = window.REL;
const {P, R, suite, addEx, sgn, addWhy, NL, addL} = window.REL9;
const UP="ABCDEFGHIJKL";
const r3=x=>Math.round(x*1000)/1000;
const L="abcdefghijkl";
const nz=(a,b)=>{ let x; do{ x=ri(a,b); }while(!x); return x; };
const dec=()=>r3(ri(1,99)/10*pick([1,-1]));                  /* décimal à un chiffre après la virgule */
const money=x=>{ const s=(Math.round(Math.abs(x)*100)/100).toFixed(2).replace(".",","); const t=s.endsWith(",00")?s.slice(0,-3):s; return (x<0?"−":"")+t.replace(/\B(?=(\d{3})+(?!\d))/g," "); };

/* ===== Activité 1 : le jeu ===== */
const v1=ri(3,9)*pick([1,-1]), v2=-Math.sign(v1)*(Math.abs(v1)+ri(1,8)), s2=v1+v2, v3=Math.sign(s2)*ri(2,8), s3=s2+v3, v4=-Math.sign(s3)*(Math.abs(s3)+ri(1,8));
const man=[[0,v1],[v1,v2],[s2,v3],[s3,v4]];
const actTab=c=>`<div class="scroll"><table class="std"><thead><tr><th>Manche</th><th>Score avant</th><th>Variation</th><th>Calcul</th><th>Score après</th></tr></thead><tbody>${man.map(([a,v],i)=>`<tr><td>${i+1}</td><td>${F(a)}</td><td>${Fs(v)}</td><td>${c?`(${a===0?"0":Fs(a)}) + ${P(v)} = ${R(a+v)}`:""}</td><td>${c?F(a+v):""}</td></tr>`).join("")}</tbody></table></div>`;

/* ===== Exercices 1 à 4 : additions ===== */
const e1=[ [ri(2,15),ri(2,15)], [-ri(2,15),-ri(2,15)], [-r3(ri(11,99)/10),-ri(1,9)], [r3(ri(11,99)/10),r3(ri(1,9)/10)], [-ri(10,30),-ri(10,30)], [-r3(ri(1,9)/10),-r3(ri(1,9)/10)] ];
const opp=()=>{ let a,b; do{ a=nz(-20,20); b=-Math.sign(a)*ri(1,20); }while(a===-b); return [a,b]; };
const oppD=()=>{ let a,b; do{ a=dec(); b=r3(-Math.sign(a)*ri(1,99)/10); }while(a===-b); return [a,b]; };
const e2=shuf([opp(),opp(),opp(),(()=>{ const a=nz(-20,20); return [a,-a]; })(),oppD(),oppD(),(()=>{ const a=ri(1,9); return pick([[a,-r3(a+ri(1,9)/10)],[-r3(a+ri(1,9)/10),a]]); })(),opp()]);
const e3=shuf([opp(),opp(),opp(),(()=>{ const a=nz(-15,15); return [a,-a]; })(),[-r3(ri(1,9)/10),-ri(1,9)],[ri(1,20),ri(1,20)]]);
const sg=s=>s>0?0:s<0?1:2;
const e3Tab=c=>`<div class="scroll"><table class="std"><thead><tr><th>Somme</th><th>positive</th><th>négative</th><th>nulle</th></tr></thead><tbody>${e3.map(([a,b])=>{ const k=sg(r3(a+b)); return `<tr><td>${P(a)} + ${P(b)}</td>${[0,1,2].map(j=>`<td>${c?(j===k?"☒":"☐"):"☐"}</td>`).join("")}</tr>`; }).join("")}</tbody></table></div>`;
const e4=Array.from({length:6},(_,i)=>{ let a,s; if(i===4){ do{ a=-r3(ri(11,49)/10); s=-r3(ri(20,60)/10); }while(a===s); }
  else if(i===5){ do{ a=r3(ri(11,49)/10); s=r3(ri(-30,30)/10); }while(a===s||!s); }
  else { do{ a=nz(-12,12); s=i===3?0:nz(-12,12); }while(a===s); }
  return {a, x:r3(s-a), s, first:i%2===0}; });
const trou=(o,sol)=>{ const t=sol?`(<b>${Fs(o.x)}</b>)`:"(……)"; return o.first ? `${t} + ${P(o.a)} = ${R(o.s)}` : `${P(o.a)} + ${t} = ${R(o.s)}`; };

/* ===== Exercices 5 et 6 : soustractions ===== */
const e5=[[nz(1,12),ri(1,12)+12],[-ri(1,12),-ri(1,12)],[ri(1,12),-ri(1,12)],[-ri(1,12),ri(1,12)],[dec(),dec()],[dec(),dec()]].map(([a,b])=>[a,b]);
const e5Tab=c=>`<div class="scroll"><table class="std"><thead><tr><th>Soustraction</th><th>Addition</th><th>Résultat</th></tr></thead><tbody>${e5.map(([a,b])=>`<tr><td>${P(a)} − ${P(b)}</td><td>${c?`${P(a)} + ${P(-b)}`:""}</td><td>${c?R(a-b):""}</td></tr>`).join("")}</tbody></table></div>`;
const t6a=-ri(2,12), t6b=ri(3,18), n6a=-ri(1,4), n6b=ri(2,12);
const HAUT=pick([["le sommet du mont Blanc",4800],["le sommet du puy de Dôme",1465],["le sommet de l'Everest",8849],["le sommet du Vignemale",3298]]), BAS=pick([["le bord de la mer Morte",-430],["le lac Assal",-155],["le fond d'une mine",-ri(2,9)*100]]);

/* ===== Exercice 7 : parenthèses ===== */
const e7=Array.from({length:4},()=>{ const t=[nz(-9,9), nz(-9,9), nz(-9,9)], op=[pick(["+","−"]),pick(["+","−"])]; if(Math.random()<0.3){ t[0]=r3(ri(11,49)/10*pick([1,-1])); t[1]=r3(ri(11,49)/10*pick([1,-1])); }
  const eff=[t[0], op[0]==="+"?t[1]:-t[1], op[1]==="+"?t[2]:-t[2]].map(r3); return {t, op, eff, s:r3(eff.reduce((x,y)=>x+y,0))}; });
const avec=e=>`${P(e.t[0])} ${e.op[0]} ${P(e.t[1])} ${e.op[1]} ${P(e.t[2])}`;
const NOMS7="ABCD";

/* ===== Exercice 8 : suites ===== */
const e8=Array.from({length:6},(_,i)=>{ const n=i%3===2?5:4, half=i>=3; let t;
  do{ t=Array.from({length:n},()=>half? r3(ri(1,20)/2)*pick([1,-1]) : nz(-15,15)); }while(!t.some(x=>x>0)||!t.some(x=>x<0));
  const ps=r3(t.filter(x=>x>0).reduce((a,b)=>a+b,0)), ns=r3(-t.filter(x=>x<0).reduce((a,b)=>a+b,0)); return {t, ps, ns, s:r3(ps-ns), pos:t.filter(x=>x>0), neg:t.filter(x=>x<0).map(x=>-x)}; });
const grp=a=>a.length>1?`(${a.map(F).join(" + ")})`:F(a[0]);
const NOMS8="FGHIJK";

/* ===== Exercice 9 : trouver l'erreur ===== */
const e9a=ri(4,12), e9b=ri(1,e9a-1), e9c=ri(1,9), e9d=e9c+ri(1,9), e9e=ri(3,12), e9f=ri(1,9);

/* ===== Exercice 10 : problèmes ===== */
let c0,c1,c2,c3,cS; do{ c0=-ri(2,15)*5; c1=ri(8,20)*10; c2=r3(ri(10,60)+pick([0.5,0.2,0.8,0])); c3=ri(20,90); cS=[c0, c0+c1, r3(c0+c1-c2), r3(c0+c1-c2-c3)]; }while(!(cS[2]>0&&cS[3]<0));
const tm=-ri(2,10), tu=ri(4,15), tb=ri(8,20);

/* ===== Exercice 11 : carré magique ===== */
let mx, my; do{ mx=nz(-5,5); my=nz(-5,5); }while(new Set([-my,mx+my,-mx,-mx+my,mx-my,mx,-mx-my,my,0]).size<9);
const MG=[[-my, mx+my, -mx],[-mx+my, 0, mx-my],[mx, -mx-my, my]];
const carre=g=>`<table class="std" style="width:auto;justify-self:start;text-align:center"><tbody>${g.map(r=>`<tr>${r.map(x=>`<td style="width:58px;height:46px;text-align:center;font-weight:700">${x===null?"":F(x)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
const MGh=MG.map((r,i)=>r.map((x,j)=>(i+j)%2===0?x:null));

/* ===== Exercice 12 ===== */
const n12=ri(4,9), n12b=ri(4,8), t12=[]; for(let k=2*n12b;k>=1;k--) t12.push(k%2===0?-k:k);
const s12=Array.from({length:2*n12+1},(_,i)=>i-n12);

return [
 {t:"Additionner des nombres relatifs", e:[
  {n:"Activité 1", t:"Le jeu des gains et des pertes", w:"Sur ton cahier", h:`<p>Noé commence un jeu avec un score de 0 point. À chaque manche, il gagne des points (nombre positif) ou il en perd (nombre négatif).</p><p>Recopie et complète le tableau.</p>${actTab(false)}<p><b>1)</b> Quelle règle permet de trouver le score après la manche 2 ?</p><p><b>2)</b> Quel est le score final de Noé ?</p>`,
   c:`${actTab(true)}<p><b>1)</b> ${addEx(v1,v2)} ${P(v1)} + ${P(v2)} = ${R(s2)}.</p><p><b>2)</b> Le score final de Noé est de <b>${R(s3+v4)} points</b>.</p>`},
  {n:"Exercice 1", t:"Même signe", w:"Sur ton cahier", h:`<p>Calcule.</p>${cols(e1.map(([a,b],i)=>`${L[i]}) ${UP[i]} = ${P(a)} + ${P(b)}`))}`,
   c:`<p>On garde le signe commun et on additionne les valeurs absolues.</p><div class="calcs">${e1.map(([a,b],i)=>`<div>${addL(L[i],UP[i],a,b)}</div>`).join("")}</div>`},
  {n:"Exercice 2", t:"Signes contraires", w:"Sur ton cahier", h:`<p>Calcule.</p>${cols(e2.map(([a,b],i)=>`${L[i]}) ${UP[i]} = ${P(a)} + ${P(b)}`))}`,
   c:`<p>On soustrait les valeurs absolues et on garde le signe du nombre qui a la plus grande valeur absolue.</p><div class="calcs">${e2.map(([a,b],i)=>`<div>${addL(L[i],UP[i],a,b)}</div>`).join("")}</div>`},
  {n:"Exercice 3", t:"Le signe du résultat", w:"Sur ton cahier", h:`<p>Sans calculer, donne le signe de chaque somme : positive, négative ou nulle.</p>${e3Tab(false)}`,
   c:`${e3Tab(true)}<p>Le résultat a le signe du nombre qui a la plus grande valeur absolue (quand les deux nombres ont le même signe, c'est ce signe). Il vaut 0 si les nombres sont opposés.</p>`},
  {n:"Exercice 4", t:"Additions à trous", w:"Sur ton cahier", h:`<p>Complète par le nombre relatif qui convient.</p>${cols(e4.map((o,i)=>`${L[i]}) ${trou(o,false)}`))}`,
   c:`<p>On peut s'aider d'une droite graduée : de combien faut-il avancer (+) ou reculer (−) ?</p>${e4.map((o,i)=>`<p>${L[i]}) ${trou(o,true)} &nbsp; <i>(de ${Fs(o.a)} à ${Fs(o.s)}, on ${o.x>0?"avance":"recule"} de ${F(Math.abs(o.x))})</i></p>`).join("")}`}
 ]},
 {t:"Soustraire un nombre relatif", e:[
  {n:"Exercice 5", t:"Soustraire, c'est ajouter l'opposé", w:"Sur ton cahier", h:`<p>Transforme chaque soustraction en addition, puis calcule.</p>${e5Tab(false)}`,
   c:`${e5Tab(true)}<p>On remplace « − (nombre) » par « + (son opposé) ».</p>`},
  {n:"Exercice 6", t:"Calculer un écart", w:"Sur ton cahier", h:`<p>Écris la soustraction qui permet de trouver l'écart, puis calcule.</p><p><b>a)</b> À 6 h, il fait ${F(t6a)} °C. À 14 h, il fait +${t6b} °C. De combien la température a-t-elle augmenté ?</p><p><b>b)</b> Un ascenseur est au niveau ${F(n6a)} (parking). Il monte jusqu'au niveau +${n6b}. Combien d'étages a-t-il montés ?</p><p><b>c)</b> ${HAUT[0][0].toUpperCase()+HAUT[0].slice(1)} est à +${F(HAUT[1])} m d'altitude et ${BAS[0]} à ${F(BAS[1])} m. Quelle est la différence d'altitude ?</p>`,
   c:`<p><b>a)</b> (+${t6b}) − ${P(t6a)} = (+${t6b}) + (+${-t6a}) = +${t6b-t6a} : la température a augmenté de <b>${t6b-t6a} °C</b>.</p><p><b>b)</b> (+${n6b}) − ${P(n6a)} = (+${n6b}) + (+${-n6a}) = +${n6b-n6a} : l'ascenseur a monté <b>${n6b-n6a} étages</b>.</p><p><b>c)</b> (+${F(HAUT[1])}) − ${P(BAS[1])} = ${F(HAUT[1])} + ${F(-BAS[1])} = ${F(HAUT[1]-BAS[1])} : la différence d'altitude est de <b>${F(HAUT[1]-BAS[1])} m</b>.</p>`}
 ]},
 {t:"Enchaîner des calculs et simplifier l'écriture", e:[
  {n:"Exercice 7", t:"Supprimer les parenthèses", w:"Sur ton cahier", h:`<p>Écris chaque expression sans parenthèses, puis calcule.</p>${cols(e7.map((e,i)=>`${NOMS7[i]} = ${avec(e)}`))}`,
   c:`<p>+ (+b) devient + b ; + (−b) devient − b ; − (+b) devient − b ; − (−b) devient + b.</p><div class="calcs">${e7.map((e,i)=>`<div>${NL(NOMS7[i],`${avec(e)} = ${suite(e.eff)} = <b>${F(e.s)}</b>`)}</div>`).join("")}</div>`},
  {n:"Exercice 8", t:"Suites d'additions et de soustractions", w:"Sur ton cahier", h:`<p>Calcule en regroupant astucieusement les nombres.</p>${cols(e8.map((e,i)=>`${NOMS8[i]} = ${suite(e.t)}`))}`,
   c:`<p>On regroupe les nombres positifs d'un côté, les nombres négatifs de l'autre.</p><div class="calcs">${e8.map((e,i)=>`<div>${NL(NOMS8[i],`${suite(e.t)} = ${grp(e.pos)} − ${grp(e.neg)}${e.pos.length>1||e.neg.length>1?` = ${F(e.ps)} − ${F(e.ns)}`:""} = <b>${F(e.s)}</b>`)}</div>`).join("")}</div>`},
  {n:"Exercice 9", t:"Trouver l'erreur", w:"Sur ton cahier", h:`<p>Chaque élève a fait une erreur. Explique laquelle et donne le bon résultat.</p><p><b>1)</b> Léa a écrit : −${e9a} + ${e9b} = −${e9a+e9b}.</p><p><b>2)</b> Karim a écrit : (+${e9c}) − (+${e9d}) = +${e9d-e9c}.</p><p><b>3)</b> Inès a écrit : ${e9e} − (−${e9f}) = ${F(e9e-e9f)}.</p>`,
   c:`<p><b>1)</b> Léa a additionné les valeurs absolues alors que les signes sont contraires. On soustrait ${e9a} − ${e9b} = ${e9a-e9b} et on garde le signe de −${e9a}.</p>${NL("A",`−${e9a} + ${e9b} = <b>${F(e9b-e9a)}</b>`)}<p><b>2)</b> Karim a oublié que soustraire +${e9d}, c'est ajouter −${e9d}. On soustrait ${e9d} − ${e9c} = ${e9d-e9c} et on garde le signe −.</p>${NL("B",`(+${e9c}) − (+${e9d}) = (+${e9c}) + (−${e9d}) = <b>−${e9d-e9c}</b>`)}<p><b>3)</b> Inès n'a pas ajouté l'opposé de −${e9f}.</p>${NL("C",`${e9e} − (−${e9f}) = ${e9e} + ${e9f} = <b>${e9e+e9f}</b>`)}`},
  {n:"Exercice 10", t:"Problèmes", w:"Sur ton cahier", h:`<p>Écris le calcul, puis réponds.</p><p><b>1)</b> Au début du mois, le compte de Mme Martin affiche ${money(c0)} €. Elle reçoit ${money(c1)} €, puis elle paie une facture de ${money(c2)} €, puis une facture de ${money(c3)} €. Quel est son solde à la fin ?</p><p><b>2)</b> Il fait ${F(tm)} °C à 6 h. À midi, la température a monté de ${tu} °C. Le soir, elle a baissé de ${tb} °C par rapport à midi. Quelle est la température le soir ?</p>`,
   c:`<p><b>1)</b></p><p class="calc">${money(c0)} + ${money(c1)} − ${money(c2)} − ${money(c3)} = ${money(cS[1])} − ${money(c2)} − ${money(c3)} = ${money(cS[2])} − ${money(c3)} = ${money(cS[3])}</p><p>Le solde est de <b>${money(cS[3])} €</b>.</p><p><b>2)</b></p><p class="calc">${F(tm)} + ${tu} − ${tb} = ${F(tm+tu)} − ${tb} = ${F(tm+tu-tb)}</p><p>La température le soir est de <b>${F(tm+tu-tb)} °C</b>.</p>`},
  {n:"Exercice 11", t:"Carré magique", w:"Sur ton cahier", h:`<p>Recopie et complète ce carré magique : la somme de chaque ligne, de chaque colonne et de chaque diagonale doit être égale à 0.</p>${carre(MGh)}`,
   c:`${carre(MG)}<p>Ligne 1 : ${F(MG[0][0])} + … + ${P(MG[0][2])} = 0, donc ${F(MG[0][1])}.</p><p>Colonne 1 : ${F(MG[0][0])} + … + ${P(MG[2][0])} = 0, donc ${F(MG[1][0])}.</p><p>Colonne 3 : ${F(MG[0][2])} + … + ${P(MG[2][2])} = 0, donc ${F(MG[1][2])}.</p><p>Ligne 3 : ${F(MG[2][0])} + … + ${P(MG[2][2])} = 0, donc ${F(MG[2][1])}.</p><p><b>Vérification :</b> diagonales ${F(MG[0][0])} + 0 + ${P(MG[2][2])} = 0 et ${F(MG[0][2])} + 0 + ${P(MG[2][0])} = 0.</p>`},
  {n:"Exercice 12", t:"Pour aller plus loin : calcul astucieux", w:"Sur ton cahier", h:`<p>Calcule le plus intelligemment possible.</p><p><b>a)</b> A = ${s12.map(x=>x<0?P(x):F(x)).join(" + ")}</p><p><b>b)</b> B = ${suite(t12)}</p>`,
   c:`<p><b>a)</b> On associe chaque nombre à son opposé : (−${n12}) + ${n12} = 0, (−${n12-1}) + ${n12-1} = 0, …</p>${NL("A",`${s12.map(x=>x<0?P(x):F(x)).join(" + ")} = <b>0</b>`)}<p><b>b)</b> On regroupe par deux :</p>${NL("B",`${suite(t12)} = ${Array.from({length:n12b},(_,k)=>`(−${2*n12b-2*k} + ${2*n12b-2*k-1})`).join(" + ")} = ${n12b} × (−1) = <b>−${n12b}</b>`)}`}
 ]}
];
};
