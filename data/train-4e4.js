/* 4e · chapitre 4 — fiche d'entraînement : les exercices de la feuille de M. Staal, avec d'autres nombres. */
TRAIN["4e-4"] = function(){
const {ri, pick, shuf, distinct} = TR;
const {F, P, cols, tabH, nNeg, prod, prodTxt, prioQ} = window.REL4B;
const nz=(a,b)=>{ let v; do{ v=ri(a,b); }while(!v); return v; };
const sum=a=>a.reduce((x,y)=>x+y,0);
const r3=x=>Math.round(x*1000)/1000;
const L="ABCDEFGH";
const simpl=v=>v.map((x,i)=>i?(x<0?"− ":"+ ")+F(Math.abs(x)):F(x)).join(" ");
/* étapes après l'expression : positifs puis négatifs, puis « positifs − négatifs », puis le résultat */
const grpSt=v=>{ const p=v.filter(x=>x>0), n=v.filter(x=>x<0), st=[[...p,...n].map((x,i)=>i?(x<0?"− ":"+ ")+F(Math.abs(x)):F(x)).join(" ")];
  if(p.length && n.length && p.length+n.length>2) st.push(`${F(sum(p))} − ${F(-sum(n))}`); st.push(`<b>${F(sum(v))}</b>`); return st; };
const grp=v=>grpSt(v).join(" = ");
/* calcul en chaîne : une étape par ligne, chaque ligne commence par « A = » */
const chain=(nm,first,st)=>`<p class="calc">${[first,...st].map(x=>`${nm} = ${x}`).join("<br>")}</p>`;

/* ===== Activité 1 : cerceaux (division) ===== */
const CER=[["marron",10],["violet",-8],["jaune",7],["vert",5],["bleu clair",-6],["bleu foncé",3],["rouge",-12]];
const [c1]=shuf(CER.filter(c=>c[1]>0)), [c2,c3]=shuf(CER.filter(c=>c[1]<0));
const k1=ri(4,15), k2=ri(2,9), k3=ri(2,9);

/* ===== Activité 2 : fête foraine ===== */
const mise=pick([2,3,4,5]);
const J2=(()=>{ let a,b; do{ a=Array.from({length:5},()=>pick([1,0])); b=Array.from({length:5},()=>pick([1,0])); }while(a.filter(x=>!x).length<=b.filter(x=>!x).length || (5-a.filter(x=>x).length)%2===(5-b.filter(x=>x).length)%2); return [a,b]; })();
/* Medhi a plus de défaites que Anna ; leurs nombres de défaites n'ont pas la même parité */
const facteurs=r=>[mise,...r.map(x=>x?2:-2)];

/* ===== Exercice 1 : signe ===== */
const E1=Array.from({length:4},(_,i)=>Array.from({length:ri(4,4+2*i)},()=>nz(-20,20)));

/* ===== Exercice 2 : suite de multiplications ===== */
const E2a=[Array.from({length:6},()=>pick([1,-1,2,-2,3,-3,4])),Array.from({length:5},()=>pick([1,-1,2,-2,3,-3,5,-5]))];
const AST=[[4,25,100],[2.5,4,10],[50,-2,-100],[-4,25,-100],[0.5,-20,-10],[20,5,100],[-25,-4,100]];
const E2b=shuf(AST).slice(0,3).map(([a,b,c])=>{ const x=r3(nz(-999,999)/100); const ord=shuf([0,1,2]); const f=[a,x,b]; return {f:ord.map(i=>f[i]), a, b, c, x, p:r3(c*x)}; });

/* ===== Activité 3 : compte bancaire ===== */
const LIB=[["Argent de poche",1],["Achat d'un tee-shirt",-1],["Achat d'un cadeau",-1],["Babysitting",1],["Achat d'un livre",-1],["Cadeau d'anniversaire",1],["Achat de bonbons",-1]];
const A3=LIB.map(([l,s])=>[l,s*ri(5,35)]);
const A3t=sum(A3.map(x=>x[1]));

/* ===== Exercice 4 : suites d'additions ===== */
const E4=[Array.from({length:4},()=>nz(-30,30)),Array.from({length:5},()=>nz(-30,30)),Array.from({length:4},()=>nz(-15,15)),Array.from({length:6},()=>nz(-15,15))];
const affP=v=>v.map((x,i)=>i?(x<0?`+ (${F(x)})`:`+ ${x}`):F(x)).join(" ");

/* ===== Exercice 5 : jeu vidéo ===== */
const E5=(()=>{ let a,b; do{ a=Array.from({length:4},()=>nz(-45,45)); b=Array.from({length:4},()=>nz(-45,45)); }while(sum(a)===sum(b)); return [a,b]; })();
const gp=v=>`${v>0?"Gagne":"Perd"} ${Math.abs(v)} point${Math.abs(v)>1?"s":""}`;

/* ===== Exercice 6 : priorités ===== */
const E6=[prioQ(1),prioQ(1),prioQ(2),prioQ(2),prioQ(2),prioQ(3)];

/* ===== Exercice 7 : teste ! ===== */
const OPS={"+":(a,b)=>a+b,"−":(a,b)=>a-b,"×":(a,b)=>a*b,"÷":(a,b)=>b?a/b:NaN};
const E7=distinct(4,()=>{ for(let g=0;g<300;g++){ const a=nz(-15,15), b=ri(2,9), c=nz(-12,12), op=pick(Object.keys(OPS)), tpl=pick([0,1]);
    /* tpl 0 : a … b × c (priorité au ×) ; tpl 1 : a … b + c */
    const val=o=>{ if(o==="÷" && a%b) return null;
      if(tpl) return r3(OPS[o](a,b)+c);
      return o==="+"?a+b*c : o==="−"?a-b*c : o==="×"?a*b*c : (a/b)*c; };
    if(!tpl && op!=="+" && op!=="−") continue;
    const v=val(op); if(v===null) continue;
    const vals=Object.keys(OPS).map(val); if(vals.filter(x=>x===v).length!==1) continue;
    return {a,b,c,op,tpl,v};
  } return {a:8,b:4,c:3,op:"−",tpl:0,v:-4}; }, x=>JSON.stringify(x));
const e7=x=>x.tpl? `${F(x.a)} … ${x.b} + ${P(x.c)} = ${F(x.v)}` : `${F(x.a)} … ${x.b} × ${P(x.c)} = ${F(x.v)}`;
const e7c=x=>x.tpl? `${F(x.a)} <b>${x.op}</b> ${x.b} + ${P(x.c)} = ${F(r3(OPS[x.op](x.a,x.b)))} + ${P(x.c)} = ${F(x.v)}` : `${F(x.a)} <b>${x.op}</b> ${x.b} × ${P(x.c)} = ${F(x.a)} ${x.op} ${P(x.b*x.c)} = ${F(x.v)}`;

/* ===== Exercice 8 : fais des essais ===== */
const E8=distinct(3,()=>{ for(let g=0;g<300;g++){ const a=ri(2,20), b=ri(1,15), c=ri(2,12), d=ri(1,12);
    const tgt=(a-b)*(c-d), others=[a-b*c-d, (a-b)*c-d, a-(b*c-d), a-b*(c-d)];
    if(a!==b && c!==d && !others.includes(tgt)) return {a,b,c,d,t:tgt}; } return {a:14,b:4,c:6,d:1,t:50}; }, x=>JSON.stringify(x));

return [
 {t:"La division de nombres relatifs", e:[
  {n:"Activité 1", t:"Jeu du lancer de cerceaux", w:"Sur ton cahier", h:`<p>Cerceaux : marron +10 ; violet −8 ; jaune +7 ; vert +5 ; bleu clair −6 ; bleu foncé +3 ; rouge −12.</p><p>Pour chaque question, écris le calcul qui te permet de répondre.</p>
   <p><b>1)</b> Étienne a lancé ${k1} fois dans le même cerceau et a obtenu ${F(k1*c1[1])} points. Dans quel cerceau a-t-il lancé ?</p><p><b>2)</b> Marc a obtenu ${F(k2*c2[1])} points en lançant ${k2} fois dans le même cerceau. Quelle était la couleur de ce cerceau ?</p><p><b>3)</b> Julie a obtenu ${F(k3*c3[1])} points en ne lançant que dans le cerceau ${c3[0]}. Combien de balles ont atteint ce cerceau ?</p>`,
   c:`<p><b>1)</b> ${F(k1*c1[1])} ÷ ${k1} = ${F(c1[1])} : le cerceau <b>${c1[0]}</b>.</p><p><b>2)</b> ${P(k2*c2[1])} ÷ ${k2} = ${F(c2[1])} : le cerceau <b>${c2[0]}</b>.</p><p><b>3)</b> ${P(k3*c3[1])} ÷ ${P(c3[1])} = ${k3} : <b>${k3} balles</b> (même signe : quotient positif).</p>`}
 ]},
 {t:"Multiplications successives de nombres relatifs", e:[
  {n:"Activité 2", t:"À la fête foraine", w:"Sur ton cahier", h:`<p>À la roulette, si on gagne, la mise est multipliée par 2 ; si on perd, elle est multipliée par −2. Medhi et Anna misent chacun ${mise} € et jouent 5 parties.</p>${tabH(["","1<sup>re</sup>","2<sup>e</sup>","3<sup>e</sup>","4<sup>e</sup>","5<sup>e</sup>"],[["<b>Medhi</b>",...J2[0].map(x=>x?"Victoire":"Défaite")],["<b>Anna</b>",...J2[1].map(x=>x?"Victoire":"Défaite")]])}<p>Anna dit : « J'ai gagné car tu as plus de défaites que moi ! ». Es-tu d'accord ?</p>`,
   c:J2.map((r,i)=>{ const f=facteurs(r), k=nNeg(f); return `<p class="calc">${["Medhi","Anna"][i]} : ${prodTxt(f)} = ${F(prod(f))}</p><p>${k} facteur${k>1?"s":""} négatif${k>1?"s":""} : ${k%2?"résultat négatif":"résultat positif"}.</p>`; }).join("")+`<p>${prod(facteurs(J2[1]))>prod(facteurs(J2[0]))?"Anna a raison : elle a gagné, mais pas parce qu'elle a moins de défaites. Ce qui compte, c'est si le nombre de défaites est pair ou impair.":"Anna a tort : c'est Medhi qui a gagné. Ce qui compte, c'est si le nombre de défaites est pair ou impair."}</p>`},
  {n:"Exercice 1", t:"Le signe du résultat d'une suite de multiplications", w:"Sur ton cahier", h:`<p>Pour chaque calcul, indique le signe du résultat (« + » ou « − »).</p><p class="calc">${E1.map((f,i)=>`${L[i]} = ${prodTxt(f)}`).join("<br>")}</p>`,
   c:`<p class="calc">${E1.map((f,i)=>{ const k=nNeg(f); return `${L[i]} : ${k} facteur${k>1?"s":""} négatif${k>1?"s":""} (${k%2?"impair":"pair"}) → <b>${k%2?"−":"+"}</b>`; }).join("<br>")}</p>`},
  {n:"Exercice 2", t:"Suite de multiplications", w:"Sur ton cahier", h:`<p>Pour A et B, écris directement le résultat. Pour C, D et E, écris tes étapes.</p><p class="calc">A = ${prodTxt(E2a[0])}<br>B = ${prodTxt(E2a[1])}</p><p class="calc">${E2b.map((x,i)=>`${"CDE"[i]} = ${prodTxt(x.f)}`).join("<br>")}</p>`,
   c:`<p class="calc">${E2a.map((f,i)=>{ const k=nNeg(f); return `${"AB"[i]} = <b>${F(prod(f))}</b> &nbsp; (${k} facteur${k>1?"s":""} négatif${k>1?"s":""})`; }).join("<br>")}</p><div class="figs" style="gap:28px">${E2b.map((x,i)=>chain("CDE"[i],prodTxt(x.f),[`${P(x.a)} × ${P(x.b)} × ${P(x.x)}`,`${F(x.c)} × ${P(x.x)}`,`<b>${F(x.p)}</b>`])).join("")}</div>`}
 ]},
 {t:"Additions successives de nombres relatifs", e:[
  {n:"Activité 3", t:"Compte bancaire", w:"Sur ton cahier", h:`<p>Voici le compte bancaire de Lili pour le mois de décembre.</p>${tabH(["Libellé","Montant (en €)"],A3.map(([l,v])=>[l,(v>0?"+ ":"− ")+Math.abs(v)]))}<p>A-t-elle gagné ou perdu de l'argent ? Calcule la somme gagnée ou perdue.</p>`,
   c:`<p class="calc">${simpl(A3.map(x=>x[1]))}<br>= ${grp(A3.map(x=>x[1]))}</p><p>${A3t>0?`Lili a <b>gagné ${A3t} €</b>.`:A3t<0?`Lili a <b>perdu ${-A3t} €</b>.`:"Lili n'a ni gagné ni perdu d'argent."}</p>`},
  {n:"Exercice 4", t:"Suite d'additions de nombres relatifs", w:"Sur ton cahier", h:`<p>Sans calculatrice. Écris tes étapes.</p><p class="calc">A = ${affP(E4[0])}<br>B = ${affP(E4[1])}<br>C = ${simpl(E4[2])}<br>D = ${simpl(E4[3])}</p>`,
   c:`<div class="figs" style="gap:28px">${E4.map((v,i)=>chain("ABCD"[i],i<2?affP(v):simpl(v),grpSt(v))).join("")}</div>`},
  {n:"Exercice 5", t:"Jeu vidéo", w:"Sur ton cahier", h:`<p>Deux copains font 4 parties d'un jeu vidéo.</p>${tabH(["","Elie","Maxence"],[0,1,2,3].map(i=>[`<b>Partie ${i+1}</b>`,gp(E5[0][i]),gp(E5[1][i])]))}<p>Écris le calcul des points de chacun, puis dis lequel a le meilleur score.</p>`,
   c:`<p class="calc">Elie : ${simpl(E5[0])} = ${grp(E5[0])}<br>Maxence : ${simpl(E5[1])} = ${grp(E5[1])}</p><p>C'est <b>${sum(E5[0])>sum(E5[1])?"Elie":"Maxence"}</b> qui a le meilleur score.</p>`}
 ]},
 {t:"Enchaînements d'opérations et priorités opératoires", e:[
  {n:"Exercice 6", t:"Respecter les priorités !", w:"Sur ton cahier", h:`<p>Recopie les calculs et écris tes étapes.</p>${cols(E6.map((p,i)=>`${L[i]} = ${p.e}`))}`,
   c:`<div class="figs" style="gap:28px">${E6.map((p,i)=>chain(L[i],p.e,[...p.st,`<b>${F(p.v)}</b>`])).join("")}</div>`},
  {n:"Exercice 7", t:"Teste !", w:"Sur ton cahier", h:`<p>Complète les pointillés avec +, −, × ou ÷ pour que l'égalité soit vraie.</p><p class="calc">${E7.map((x,i)=>`${"abcd"[i]}. ${e7(x)}`).join("<br>")}</p>`,
   c:`<p class="calc">${E7.map((x,i)=>`${"abcd"[i]}. ${e7c(x)}`).join("<br>")}</p>`},
  {n:"Exercice 8", t:"Fais des essais", w:"Sur ton cahier", h:`<p>Place des parenthèses pour que l'égalité soit vraie.</p><p class="calc">${E8.map((x,i)=>`${"abc"[i]}. ${x.a} − ${x.b} × ${x.c} − ${x.d} = ${F(x.t)}`).join("<br>")}</p>`,
   c:`<p class="calc">${E8.map((x,i)=>`${"abc"[i]}. (${x.a} − ${x.b}) × (${x.c} − ${x.d}) = ${P(x.a-x.b)} × ${P(x.c-x.d)} = ${F(x.t)}`).join("<br>")}</p>`}
 ]}
];
};
