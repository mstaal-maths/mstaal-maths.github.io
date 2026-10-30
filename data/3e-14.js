/* 3e — Chapitre 14 : Les puissances
   Sources : « Cours A4 – Puissance (en entier) », « Feuille d'exercices puissance » et « Feuille de corrections puissance » de M. Staal.
   La feuille de corrections ne couvre que les exercices 1 à 3 et l'activité 3 : les autres corrections ont été calculées et rédigées pour le site. */
(function(){
const VF=["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const ch4=(good,bads)=>shuf(uniq(good,bads).slice(0,4));
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const X=v=>`<i>${v}</i>`, $x=X("x"), $f=X("f"), $g=X("g"), $h=X("h");
const fx=(n,a=$x)=>`${X(n)}(${a})`;
const r6=v=>Math.round(v*1e6)/1e6;
const F=v=>{ const r=r6(v); const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const P=v=>v<0?`(${F(v)})`:F(v);
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const red=(p,q)=>{ if(q<0){ p=-p; q=-q; } const g=gcd(Math.abs(p),q)||1; return [p/g,q/g]; };
const isDec=q=>{ q=Math.abs(q); while(q%2===0) q/=2; while(q%5===0) q/=5; return q===1; };
const FR=(p,q)=>{ [p,q]=red(p,q); return q===1?F(p):(p<0?"−":"")+`{${Math.abs(p)}/${q}}`; };
const SV=(p,q)=>{ [p,q]=red(p,q); return q===1?F(p):isDec(q)?F(p/q):FR(p,q); };
const quo=(p,q)=>{ if(p%q===0) return F(p/q); const raw=q>0?(p<0?"−":"")+`{${Math.abs(p)}/${q}}`:`{${F(p)}/${F(q)}}`; const rd=FR(p,q); let s=raw; if(rd!==raw) s+=" = "+rd; const [A,B]=red(p,q); if(isDec(B)) s+=" = "+F(A/B); return s; };
const mono=(a,v="x")=>a===0?"0":a===1?X(v):a===-1?"−"+X(v):F(a)+X(v);
const lin=(a,b,v="x")=>a===0?F(b):mono(a,v)+(b>0?` + ${F(b)}`:b<0?` − ${F(-b)}`:"");
const OP=t=>`<span style="color:var(--c);font-weight:700">&emsp;(${t})</span>`;
const calc=L=>`<p class="calc">${L.map(l=>Array.isArray(l)?l[0]+OP(l[1]):l).join("<br>")}</p>`;
const cols=arr=>`<div class="calcs">${arr.map(s=>`<span>${s}</span>`).join("")}</div>`;
const prog=(titre,L)=>`<div class="pgc">${titre?`<b>${titre}</b>`:""}<ul>${L.map(s=>`<li>${s}</li>`).join("")}</ul></div>`;
const sq=v=>`${v}<sup>2</sup>`;
/* tableau de valeurs : en-tête de ligne + valeurs */
const vt=(h1,xs,h2,ys)=>`<div class="scroll"><table class="std"><tbody><tr><th>${h1}</th>${xs.map(v=>`<td>${typeof v==="number"?F(v):v}</td>`).join("")}</tr><tr><th>${h2}</th>${ys.map(v=>`<td>${typeof v==="number"?F(v):v}</td>`).join("")}</tr></tbody></table></div>`;
const tabH=(head,rows)=>`<div class="scroll"><table class="std"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;


const $a=X("a"), $n=X("n"), $p=X("p");
/* colonnes si les éléments sont courts ; une ligne par élément sinon (évite les débordements) */
const colz=arr=>{ const long=arr.some(t=>!/class="calc"/.test(t) && String(t).replace(/<[^>]+>/g,"").length>26);
  return long?`<div class="calcs" style="grid-template-columns:1fr">${arr.map(t=>`<span style="white-space:normal">${t}</span>`).join("")}</div>`:cols(arr); };
const nz=(a,b)=>{ let v; do{ v=ri(a,b); }while(v===0); return v; };
/* calcul en chaîne : chaque ligne commence par « A = » (lab = « a) » éventuel devant la 1re ligne) */
const nm=(N,L,lab)=>calc(L.map((t,i)=>(i===0&&lab?lab+" ":"")+N+" = "+t));
const E=e=>e<0?"−"+(-e):String(e);                       /* exposant écrit avec le vrai signe moins */
const pw=(b,e)=>`${b}<sup>${E(e)}</sup>`;                 /* b est déjà écrit (ex. "(−2)") */
const bs=b=>b<0?`(${F(b)})`:F(b);                         /* base entre parenthèses si négative */
const P10=e=>pw("10",e);
const FRH=(a,b)=>`<span class="fr"><span>${a}</span><span>${b}</span></span>`;   /* fraction avec balises */
const prod=(b,n)=>Array(n).fill(bs(b)).join(" × ");
/* écriture décimale exacte de M × 10^p (M entier) */
function dec(M,p){ const neg=M<0; let d=String(Math.abs(M)); let s;
  if(p>=0) s=d+"0".repeat(p); else { const k=-p; if(d.length<=k) d="0".repeat(k-d.length+1)+d; s=d.slice(0,d.length-k)+","+d.slice(d.length-k); s=s.replace(/,?0+$/,""); }
  let [i,f]=s.split(","); i=i.replace(/^0+(?=\d)/,"").replace(/\B(?=(\d{3})+(?!\d))/g," "); if(f) f=f.replace(/(\d{3})(?=\d)/g,"$1 ");
  return (neg?"−":"")+i+(f?","+f:""); }
/* notation scientifique de M × 10^p */
function sciOf(M,p){ let m=Math.abs(M); while(m%10===0&&m>0){ m/=10; p++; } const d=String(m).length; return {M:(M<0?-m:m), q:-(d-1), e:p+d-1}; }
const sci=(M,p)=>{ const s=sciOf(M,p); return `${dec(s.M,s.q)} × ${P10(s.e)}`; };
const isSci=(M,q)=>{ const a=Math.abs(M)*Math.pow(10,q); return a>=1-1e-12 && a<10-1e-12; };

/* ===================== SCHÉMAS DU QCM ===================== */
const S_DEF=sch("Puissance d'un nombre",`<p>${pw($a,"<i>n</i>")} = ${$a} × ${$a} × … × ${$a} (${$n} facteurs)</p><p class="schN">−3<sup>2</sup> = −(3 × 3) = −9 mais (−3)<sup>2</sup> = (−3) × (−3) = 9.<br>${pw($a,"0")} = 1 · ${pw($a,"1")} = ${$a}</p>`);
const S_PRI=sch("Priorités opératoires",`<ol><li>les parenthèses</li><li>les puissances</li><li>× et ÷</li><li>+ et −</li></ol>`);
const S_NEG=sch("Exposant négatif",`<p>${pw($a,"−<i>n</i>")} = ${FRH("1",pw($a,"<i>n</i>"))}</p><p class="schN">${P10(-3)} = ${FRH("1",P10(3))} = 0,001 (3 zéros)</p>`);
const S_REG=sch("Calculer avec des puissances",`<p>${pw($a,"<i>n</i>")} × ${pw($a,"<i>p</i>")} = ${pw($a,"<i>n</i> + <i>p</i>")}</p><p>${FRH(pw($a,"<i>n</i>"),pw($a,"<i>p</i>"))} = ${pw($a,"<i>n</i> − <i>p</i>")}</p><p>(${pw($a,"<i>n</i>")})<sup><i>p</i></sup> = ${pw($a,"<i>n</i> × <i>p</i>")}</p>`);
const S_PRE=sch("Préfixes scientifiques",`<p class="schN">G = 10<sup>9</sup> · M = 10<sup>6</sup> · k = 10<sup>3</sup> · m = 10<sup>−3</sup> · μ = 10<sup>−6</sup> · n = 10<sup>−9</sup></p>`);
const S_SCI=sch("Notation scientifique",`<p>${$a} × 10<sup><i>n</i></sup> avec un seul chiffre, autre que 0, avant la virgule.</p><p class="schN">149 600 000 000 = 1,496 × 10<sup>11</sup> · 0,000 005 = 5 × 10<sup>−6</sup></p>`);

const PRE=[["G","Giga","10<sup>9</sup>"],["","",""],["","",""],["M","Méga","10<sup>6</sup>"],["","",""],["","",""],["k","kilo","10<sup>3</sup>"],["h","hecto","10<sup>2</sup>"],["da","déca","10<sup>1</sup>"],["UNITÉ","","10<sup>0</sup>"],["d","déci","10<sup>−1</sup>"],["c","centi","10<sup>−2</sup>"],["m","milli","10<sup>−3</sup>"],["","",""],["","",""],["μ","micro","10<sup>−6</sup>"],["","",""],["","",""],["n","nano","10<sup>−9</sup>"]];
const PC='style="padding:3px 2px;text-align:center"';
const T_PRE=`<div class="scroll"><table class="std" style="font-size:.72em;width:auto"><tbody><tr>${PRE.map(c=>`<th ${PC}>${c[0]}</th>`).join("")}</tr><tr>${PRE.map(c=>`<td ${PC}>${c[2]}</td>`).join("")}</tr><tr>${PRE.map(c=>`<td ${PC}>${c[1]}</td>`).join("")}</tr></tbody></table></div>`;

CH["3e-14"] = {
intro:"Calculer avec des puissances d'exposant positif ou négatif, utiliser les puissances de 10, les préfixes scientifiques et la notation scientifique.",
savoir:[
  "écrire un produit de facteurs égaux sous la forme d'une puissance, et calculer une puissance ;",
  "appliquer les priorités opératoires avec des puissances ;",
  "calculer une puissance d'exposant négatif ;",
  "écrire en écriture décimale une puissance de 10 et un produit par une puissance de 10 ;",
  "calculer avec des puissances d'un même nombre (produit, quotient, puissance d'une puissance) ;",
  "convertir des unités avec les préfixes scientifiques (de nano à Giga) ;",
  "écrire un nombre en notation scientifique et calculer avec des écritures scientifiques."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Puissances d'exposant positif", h:`
<p><b>a) Définition</b></p>
<div class="retenir" data-l="Définition"><p>Pour tout nombre entier ${$n} positif non nul et pour tout nombre relatif ${$a} :</p>
<p class="calc">${pw($a,"<i>n</i>")} = ${$a} × ${$a} × … × ${$a} &emsp;(${$n} facteurs)</p>
<p>${pw($a,"<i>n</i>")} se lit « ${$a} exposant ${$n} ».</p></div>
<p><b>Exemples :</b></p>
<ul><li>${pw("9",4)} = 9 × 9 × 9 × 9 et ${pw("9",4)} se lit « 9 exposant 4 ».</li>
<li>${pw("(−2)",5)} = (−2) × (−2) × (−2) × (−2) × (−2) et ${pw("(−2)",5)} se lit « −2 exposant 5 ».</li></ul>
<div class="attention">${colz([nm("A",[`−${pw("3",4)}`,"−3 × 3 × 3 × 3","−81"]),nm("B",[pw("(−3)",4),"(−3) × (−3) × (−3) × (−3)","81"])])}<p>Donc −${pw("3",4)} ≠ ${pw("(−3)",4)}.</p></div>
<div class="retenir" data-l="Convention"><p>Pour tout nombre ${$a} non nul, ${pw($a,0)} = 1.</p><p>Pour tout nombre ${$a}, ${pw($a,1)} = ${$a}.</p></div>
<p><b>Exemples :</b> ${pw("6",0)} = 1 · ${pw("(−3)",0)} = 1 · ${pw("8",1)} = 8 · ${pw("(−7)",1)} = −7</p>
<p><b>b) Puissances de 10</b></p>
<div class="retenir" data-l="À retenir"><p>Lorsqu'on calcule une puissance de 10, on observe que le nombre de zéros correspond à l'exposant :</p>
<p class="calc">${pw("10","<i>n</i>")} = 10…0 &emsp;(${$n} zéros)</p></div>
<p><b>Exemples :</b> ${P10(4)} = 10 000 · ${P10(7)} = 10 000 000</p>
<p><b>c) Priorités opératoires dans un enchaînement d'opérations</b></p>
<div class="retenir" data-l="Propriété"><p>Dans un enchaînement de calculs, on effectue :</p><ol><li>les calculs entre parenthèses ;</li><li>les puissances ;</li><li>les multiplications et les divisions ;</li><li>et enfin les additions et les soustractions.</li></ol></div>
<p><b>Exemples :</b></p>
${colz([calc(["A = 4 − "+pw("8",2),"A = 4 − 64","A = −60"]),calc([`B = ${pw("(−8 + 6)",4)} × 3`,`B = ${pw("(−2)",4)} × 3`,"B = 16 × 3","B = 48"]),calc([`C = ${pw("(−5<sup>2</sup> + 27)",3)}`,`C = ${pw("(−25 + 27)",3)}`,`C = ${pw("2",3)}`,"C = 8"])])}`},
{k:"II", t:"Puissances d'exposant négatif", h:`
<p><b>a) Puissances d'un nombre quelconque</b></p>
<p>${$a} désigne un nombre relatif non nul et ${$n} est un entier positif non nul.</p>
<div class="retenir" data-l="Définition"><p>${pw($a,"−<i>n</i>")} désigne l'inverse de ${pw($a,"<i>n</i>")} :</p><p class="calc">${pw($a,"−<i>n</i>")} = ${FRH("1",pw($a,"<i>n</i>"))}</p></div>
<p><b>Exemples :</b></p>
${colz([nm("A",[pw("2",-3),FRH("1",pw("2",3)),FRH("1","2 × 2 × 2"),"{1/8}"]),nm("B",[pw("(−5)",-2),FRH("1",pw("(−5)",2)),FRH("1","(−5) × (−5)"),"{1/25}"]),nm("C",[pw("(−4)",-1),FRH("1",pw("(−4)",1)),FRH("1","−4"),"−{1/4}"])])}
<p><b>b) Cas particulier : les puissances de 10</b></p>
<div class="retenir" data-l="Propriété"><p class="calc">${pw("10","−<i>n</i>")} = ${FRH("1",pw("10","<i>n</i>"))} = ${FRH("1","10…0")} = 0,0…01 &emsp;(${$n} zéros)</p></div>
<p><b>Exemples :</b></p>${colz([nm("D",[P10(-3),FRH("1",P10(3)),"{1/1000}","0,001 (3 zéros)"]),nm("E",[P10(-7),"0,000 000 1 (7 zéros)"])])}`},
{k:"III", t:"Calculer avec des puissances", h:`
<p><b>Exercice :</b> donne le résultat sous la forme d'une puissance.</p>
${nm("A",[`${P10(3)} × ${P10(2)}`,`10 × 10 × 10 × 10 × 10`,`${P10(5)}`],"a)")}
${nm("B",[`${pw("7",5)} × ${pw("7",-2)}`,`${pw("7",5)} × ${FRH("1",pw("7",2))}`,`${FRH(pw("7",5),pw("7",2))}`,`${FRH("7 × 7 × 7 × 7 × 7","7 × 7")}`,`7 × 7 × 7`,`${pw("7",3)}`],"b)")}
<div class="retenir" data-l="Règle"><p class="calc">${pw($a,"<i>n</i>")} × ${pw($a,"<i>p</i>")} = ${pw($a,"<i>n</i> + <i>p</i>")}</p></div>
${nm("C",[`${FRH(pw("6",4),pw("6",7))}`,`${FRH("6 × 6 × 6 × 6","6 × 6 × 6 × 6 × 6 × 6 × 6")}`,`${FRH("1","6 × 6 × 6")}`,`${FRH("1",pw("6",3))}`,`${pw("6",-3)}`],"c)")}
${nm("D",[`${FRH(pw("6",5),pw("6",-3))}`,`${FRH(pw("6",5),FRH("1",pw("6",3)))}`,`${pw("6",5)} ÷ ${FRH("1",pw("6",3))}`,`${pw("6",5)} × ${FRH(pw("6",3),"1")}`,`${pw("6",5)} × ${pw("6",3)}`,`${pw("6",8)}`],"d)")}
<div class="retenir" data-l="Règle"><p class="calc">${FRH(pw($a,"<i>n</i>"),pw($a,"<i>p</i>"))} = ${pw($a,"<i>n</i> − <i>p</i>")}</p></div>
${nm("E",[`${pw("("+P10(2)+")",3)}`,`${pw("(10 × 10)",3)}`,`10 × 10 × 10 × 10 × 10 × 10`,`${P10(6)}`],"e)")}
<div class="retenir" data-l="Règle"><p class="calc">${pw("("+pw($a,"<i>n</i>")+")","<i>p</i>")} = ${pw($a,"<i>n</i> × <i>p</i>")}</p></div>`},
{k:"IV", t:"Préfixes scientifiques et notation scientifique", h:`
<p><b>a) Conversion d'unités avec les préfixes, et lien avec les puissances de 10</b></p>
<div class="retenir" data-l="À retenir"><p>Pour donner de grands ou de très petits nombres avec une unité donnée, on peut utiliser les préfixes, comme l'indique le tableau ci-dessous.</p>${T_PRE}</div>
<p><b>Exercice :</b> convertis chacune des informations dans l'unité demandée.</p>
<ul><li>Diamètre d'un cheveu : 5 μm = 5 × ${P10(-6)} m = 0,000 005 m</li><li>Distance Terre-Soleil : 149 600 000 000 m = 149,6 × ${P10(9)} m = 149,6 Gm (gigamètres)</li></ul>
<p><b>b) Notation scientifique</b></p>
<p>Lorsque des nombres sont composés d'un grand nombre de chiffres, on les écrit en notation scientifique. Teste avec ta calculatrice :</p>
<ul><li>écris 149 600 000 000 sur la calculatrice et appuie sur « = » ;</li><li>la calculatrice donne 1,496 × ${P10(11)} : c'est la notation scientifique.</li></ul>
<div class="retenir" data-l="Définition"><p>La <b>notation scientifique</b> d'un nombre décimal relatif est la seule écriture de la forme ${$a} × 10<sup><i>n</i></sup> où :</p>
<ul><li>${$a} est un nombre décimal relatif écrit avec un seul chiffre, autre que 0, avant la virgule ;</li><li>et ${$n} est un nombre entier relatif.</li></ul></div>
<p><b>Exercice :</b> donne l'écriture scientifique des nombres suivants.</p>
${colz([`a) 149 600 000 000 = 1,496 × ${P10(11)}`,`b) 0,000 005 = 5 × ${P10(-6)}`,`c) 150 × ${P10(8)} = 1,5 × ${P10(10)}`,`d) 38,1 × ${P10(-3)} = 3,81 × ${P10(-2)}`,`e) 0,085 × ${P10(5)} = 8,5 × ${P10(3)}`,`f) 0,45 × ${P10(-3)} = 4,5 × ${P10(-4)}`])}
<p><b>c) Calculer un quotient avec des puissances de 10</b></p>
<p><b>Exercice :</b> exprime le résultat de chaque calcul en notation scientifique.</p>
${nm("A",[`${FRH("35 × "+P10(12),"7 × "+P10(9))}`,`{35/7} × ${FRH(P10(12),P10(9))}`,`5 × ${P10(3)}`],"a)")}
${nm("B",[`${FRH("3 × "+P10(-6)+" × 6 × "+P10(2),"2 × "+P10(3))}`,`${FRH("18 × "+P10(-4),"2 × "+P10(3))}`,`{18/2} × ${FRH(P10(-4),P10(3))}`,`9 × ${P10(-7)}`],"b)")}`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Puissances d'exposant positif", e:[
  {n:"Exercice 1", t:"Vocabulaire (sans calculatrice)", w:"Sur ta feuille", h:`<p><b>Partie 1 :</b> complète le tableau ci-dessous.</p>
${tabH(["Produit","Notation puissance","Se lit"],[["5 × 5 × 5 × 5","",""],["8 × 8 × 8 × 8 × 8 × 8","",""],["",pw("6",3),""],["","","2 exposant 6"]])}
<p><b>Partie 2 :</b> décompose chaque puissance sous la forme d'un produit et donne le résultat, sans calculatrice.</p>
${colz([`a) A = ${pw("3",4)}`,`b) B = ${pw("4",3)}`,`c) C = ${pw("(−2)",4)}`,`d) D = −${pw("2",4)}`,`e) E = ${pw("(−2)",3)}`,`f) F = −${pw("2",3)}`,`g) G = ${pw("(−5)",2)}`,`h) H = ${P10(3)}`,`i) I = ${P10(7)}`,`j) J = ${pw("5",0)}`,`k) K = ${pw("(−6)",1)}`])}`,
   c:`<p><b>Partie 1</b></p>${tabH(["Produit","Notation puissance","Se lit"],[["5 × 5 × 5 × 5",pw("5",4),"5 exposant 4"],["8 × 8 × 8 × 8 × 8 × 8",pw("8",6),"8 exposant 6"],["6 × 6 × 6",pw("6",3),"6 exposant 3"],["2 × 2 × 2 × 2 × 2 × 2",pw("2",6),"2 exposant 6"]])}
<p><b>Partie 2</b></p>${colz([nm("A",[`${pw("3",4)}`,`3 × 3 × 3 × 3`,`81`],"a)"),nm("B",[`${pw("4",3)}`,`4 × 4 × 4`,`64`],"b)"),nm("C",[`${pw("(−2)",4)}`,`(−2) × (−2) × (−2) × (−2)`,`16`],"c)"),nm("D",[`−${pw("2",4)}`,`−2 × 2 × 2 × 2`,`−16`],"d)"),nm("E",[`${pw("(−2)",3)}`,`(−2) × (−2) × (−2)`,`−8`],"e)"),nm("F",[`−${pw("2",3)}`,`−2 × 2 × 2`,`−8`],"f)"),nm("G",[`${pw("(−5)",2)}`,`(−5) × (−5)`,`25`],"g)"),nm("H",[`${P10(3)}`,`1 000`],"h)"),nm("I",[`${P10(7)}`,`10 000 000`],"i)"),nm("J",[`${pw("5",0)}`,`1`],"j)"),nm("K",[`${pw("(−6)",1)}`,`−6`],"k)")])}`},
  {n:"Exercice 2", t:"Priorités opératoires (sans calculatrice)", w:"Sur ton cahier", h:`<p>Recopie le calcul et calcule en tenant compte des priorités opératoires.</p>${colz([`A = ${pw("(2 − 5)",2)}`,`B = 2 − ${pw("5",2)}`,`C = 7 × ${pw("3",2)}`,`D = ${pw("(−2)",3)} × 5`,`E = ${pw("(4 × 5 − 4<sup>2</sup>)",3)}`])}`,
   c:colz([calc([`A = ${pw("(2 − 5)",2)}`,`A = ${pw("(−3)",2)}`,"A = 9"]),calc([`B = 2 − ${pw("5",2)}`,"B = 2 − 25","B = −23"]),calc([`C = 7 × ${pw("3",2)}`,"C = 7 × 9","C = 63"]),calc([`D = ${pw("(−2)",3)} × 5`,"D = −8 × 5","D = −40"]),calc([`E = ${pw("(4 × 5 − 4<sup>2</sup>)",3)}`,`E = ${pw("(20 − 16)",3)}`,`E = ${pw("4",3)}`,"E = 64"])])},
  {n:"Exercice 3", t:"Jeu du « quitte ou double »", w:"Sur ton cahier", h:`<p>Lors du jeu « Le quitte ou double », la première bonne réponse rapporte 1 €, et ensuite chaque bonne réponse permet de doubler son gain.</p>
<p>Réponds aux questions suivantes en expliquant ta démarche.</p><p><b>1)</b> Gilles a répondu correctement à une série de sept questions. Quel est son gain ?</p><p><b>2)</b> Combien de bonnes réponses consécutives, au minimum, lui faudra-t-il pour gagner plus de 5 000 euros ?</p>`,
   c:`<p><b>1)</b> À la 1<sup>re</sup> bonne réponse, il a 1 € et 1 = ${pw("2",0)}.</p><p>À la 2<sup>e</sup> bonne réponse, il a 2 × 1 = 2 € et 2 = ${pw("2",1)}.</p><p>À la 3<sup>e</sup> bonne réponse, il a 2 × 2 = 4 € et 4 = ${pw("2",2)}.</p><p>À la 4<sup>e</sup> bonne réponse, il a 4 × 2 = 8 € et 8 = ${pw("2",3)}.</p>
<p>On remarque qu'après ${$n} bonnes réponses, il gagne ${pw("2","<i>n</i> − 1")} €.</p><p>Après 7 bonnes réponses, il gagne ${pw("2","7 − 1")} = ${pw("2",6)} = <b>64 €</b>.</p>
<p><b>2)</b> Après 13 bonnes réponses : ${pw("2",12)} = 4 096 € (moins de 5 000 €).</p><p>Après 14 bonnes réponses : ${pw("2",13)} = 8 192 € (plus de 5 000 €).</p><p>Il faut au minimum <b>14 bonnes réponses</b>.</p>`},
  {n:"Exercice 4", t:"Nombre de bactéries", w:"Sur ton cahier", h:`<p>Une bactérie « se divise » en deux bactéries. Chacune des deux bactéries obtenues « se partage » en deux nouvelles bactéries, et ainsi de suite.</p>
<p>Lorsque les conditions sont favorables, le nombre de bactéries peut être multiplié par deux toutes les trente minutes.</p><p>Un chercheur place une bactérie en conditions favorables.</p>
<p>Combien obtient-il de millions de bactéries au bout de 13 h ? Arrondis au dixième.</p>`,
   c:`<p>En 13 h, il y a 13 × 2 = 26 périodes de 30 minutes.</p><p>Le nombre de bactéries est multiplié 26 fois par 2 : 1 × ${pw("2",26)} = 67 108 864 bactéries.</p><p>Au bout de 13 h, il obtient environ <b>67,1 millions</b> de bactéries.</p>`}
]},
{t:"Exposants négatifs et puissances de 10", e:[
  {n:"Exercice 5", t:"Les puissances d'exposants positifs et négatifs", w:"Sur ta feuille", h:`<p>Donne le résultat sous la forme d'une écriture décimale ou d'une fraction réduite.</p><p>Si besoin, tu peux décomposer les puissances sous la forme d'un produit.</p>
${colz([`a) A = ${pw("5",2)}`,`b) B = ${pw("5",-2)}`,`c) C = ${pw("2",3)}`,`d) D = ${pw("2",-3)}`,`e) E = ${P10(4)}`,`f) F = ${P10(-4)}`,`g) G = ${pw("(−6)",2)}`,`h) H = ${pw("(−6)",-2)}`,`i) I = ${pw("8",1)}`,`j) J = ${pw("8",-1)}`,`k) K = ${pw("(−7)",1)}`,`l) L = ${pw("(−7)",-1)}`])}`,
   c:colz([nm("A",[`${pw("5",2)}`,`5 × 5`,`25`],"a)"),nm("B",[`${pw("5",-2)}`,`${FRH("1",pw("5",2))}`,`{1/25}`,`0,04`],"b)"),nm("C",[`${pw("2",3)}`,`2 × 2 × 2`,`8`],"c)"),nm("D",[`${pw("2",-3)}`,`${FRH("1",pw("2",3))}`,`{1/8}`,`0,125`],"d)"),nm("E",[`${P10(4)}`,`10 000`],"e)"),nm("F",[`${P10(-4)}`,`0,000 1`],"f)"),nm("G",[`${pw("(−6)",2)}`,`(−6) × (−6)`,`36`],"g)"),nm("H",[`${pw("(−6)",-2)}`,`${FRH("1",pw("(−6)",2))}`,`{1/36}`],"h)"),nm("I",[`${pw("8",1)}`,`8`],"i)"),nm("J",[`${pw("8",-1)}`,`{1/8}`,`0,125`],"j)"),nm("K",[`${pw("(−7)",1)}`,`−7`],"k)"),nm("L",[`${pw("(−7)",-1)}`,`${FRH("1","−7")}`,`−{1/7}`],"l)")])},
  {n:"Exercice 6", t:"Les puissances de 10 d'exposants négatifs", w:"Sur ta feuille", h:`<p>Donne directement le résultat en écriture décimale.</p>${colz([`a) ${P10(1)}`,`b) ${P10(-1)}`,`c) ${P10(6)}`,`d) ${P10(-2)}`,`e) ${P10(-5)}`,`f) ${P10(3)}`])}`,
   c:colz([`a) ${P10(1)} = 10`,`b) ${P10(-1)} = 0,1`,`c) ${P10(6)} = 1 000 000`,`d) ${P10(-2)} = 0,01`,`e) ${P10(-5)} = 0,000 01`,`f) ${P10(3)} = 1 000`])},
  {n:"Exercice 7", t:"Multiplication par 10 ; 100 ; 1 000 ; 0,1 ; 0,01 ; 0,001…", w:"Sur ta feuille", h:`<p><b>1 –</b> Donne le résultat de chaque multiplication.</p>${colz(["a) 25,6 × 100","b) 36,72 × 10","c) 4,8 × 1 000","d) 23,7 × 0,1","e) 9 × 0,001","f) 3,67 × 0,01"])}<p><b>2 –</b> Vérifie tes résultats à la calculatrice.</p>`,
   c:colz(["a) 25,6 × 100 = 2 560","b) 36,72 × 10 = 367,2","c) 4,8 × 1 000 = 4 800","d) 23,7 × 0,1 = 2,37","e) 9 × 0,001 = 0,009","f) 3,67 × 0,01 = 0,036 7"])},
  {n:"Exercice 8", t:"Multiplier un nombre par une puissance de 10", w:"Sur ta feuille", h:`<p>Donne l'écriture décimale de chaque expression.</p>${colz([`A = 85 × ${P10(3)}`,`B = 17,9 × ${P10(3)}`,`C = 0,012 × ${P10(2)}`,`D = 0,08 × ${P10(5)}`,`E = 85 × ${P10(-3)}`,`F = 1 584,5 × ${P10(-3)}`,`G = 0,026 × ${P10(-2)}`,`H = 580 × ${P10(-5)}`])}`,
   c:colz([calc([`A = 85 × ${P10(3)}`,"A = 85 × 1 000","A = 85 000"]),calc([`B = 17,9 × ${P10(3)}`,"B = 17,9 × 1 000","B = 17 900"]),calc([`C = 0,012 × ${P10(2)}`,"C = 0,012 × 100","C = 1,2"]),calc([`D = 0,08 × ${P10(5)}`,"D = 0,08 × 100 000","D = 8 000"]),calc([`E = 85 × ${P10(-3)}`,"E = 85 × 0,001","E = 0,085"]),calc([`F = 1 584,5 × ${P10(-3)}`,"F = 1 584,5 × 0,001","F = 1,584 5"]),calc([`G = 0,026 × ${P10(-2)}`,"G = 0,026 × 0,01","G = 0,000 26"]),calc([`H = 580 × ${P10(-5)}`,"H = 580 × 0,000 01","H = 0,005 8"])])+`<p>Multiplier par ${pw("10","<i>n</i>")} décale la virgule de ${$n} rangs vers la droite ; multiplier par ${pw("10","−<i>n</i>")} la décale de ${$n} rangs vers la gauche.</p>`}
]},
{t:"Préfixes scientifiques", e:[
  {n:"Activité 3", t:"Découverte des préfixes scientifiques", w:"Sur ta feuille", h:`<p>Voici les informations suivantes :</p><ul><li>La distance entre la Terre et le Soleil est d'environ 149 600 000 000 mètres.</li><li>La distance entre la Terre et la Lune est de 384 400 000 mètres.</li><li>La distance entre Les Sables et Strasbourg est de 942 000 mètres.</li><li>La hauteur de la tour Eiffel est de 324 mètres.</li><li>La taille d'une fourmi est de 0,007 mètre.</li><li>Le diamètre d'un cheveu est de 0,000 005 mètre.</li><li>La taille du virus de la grippe est de 0,000 000 1 mètre.</li></ul>
<p>Pour simplifier l'écriture de ces nombres, des <b>préfixes scientifiques</b> ont été créés. Tu connais déjà kilo, hecto, déca, déci, centi et milli. Quatre préfixes sont nouveaux : le giga (G), le méga (M), le micro (μ) et le nano (n).</p>${T_PRE}
<p><b>1 – a)</b> Complète : 1 km = 1 000 m · 1 hm = … m · 1 dam = … m · 1 dm = … m · 1 cm = … m · 1 mm = … m</p>
<p><b>b)</b> En t'aidant du tableau, complète (même si une colonne n'a pas de nom, elle existe quand même) : 1 Gm = … m · 1 Mm = … m · 1 μm = … m · 1 nm = … m</p>
<p><b>2 –</b> Utilise les puissances de 10 pour écrire ces conversions plus simplement : 1 Gm = … m ; 1 Mm = … m ; 1 km = ${P10(3)} m ; 1 hm = … m ; 1 dam = … m ; 1 dm = … m ; 1 cm = … m ; 1 mm = … m ; 1 μm = … m ; 1 nm = … m.</p>
<p><b>3 –</b> La distance entre la Terre et le Soleil est d'environ 149 600 000 000 m. Quelle est l'unité la plus adaptée (celle qui permet d'écrire le nombre avec le moins de chiffres possible) ? Complète : 149 600 000 000 m = …</p>
<p><b>4 –</b> Avec la même méthode, choisis l'unité adaptée pour les autres informations (la hauteur de la tour Eiffel, 324 m, est déjà dans la bonne unité).</p>`,
   c:`<p><b>1 – a)</b> 1 km = 1 000 m · 1 hm = 100 m · 1 dam = 10 m · 1 dm = 0,1 m · 1 cm = 0,01 m · 1 mm = 0,001 m</p>
<p><b>b)</b> 1 Gm = 1 000 000 000 m · 1 Mm = 1 000 000 m · 1 μm = 0,000 001 m · 1 nm = 0,000 000 001 m</p>
<p><b>2 –</b></p>${colz([`1 Gm = ${P10(9)} m`,`1 Mm = ${P10(6)} m`,`1 km = ${P10(3)} m`,`1 hm = ${P10(2)} m`,`1 dam = ${P10(1)} m`,`1 dm = ${P10(-1)} m`,`1 cm = ${P10(-2)} m`,`1 mm = ${P10(-3)} m`,`1 μm = ${P10(-6)} m`,`1 nm = ${P10(-9)} m`])}<p>Les 4 nouvelles conversions (Gm, Mm, μm et nm) sont à connaître par cœur.</p>
<p><b>3 –</b> L'unité la plus adaptée est le gigamètre : 149 600 000 000 m = 149,6 Gm.</p>
<p><b>4 –</b> Terre-Lune : 384 400 000 m = 384,4 Mm · Les Sables-Strasbourg : 942 000 m = 942 km · Fourmi : 0,007 m = 7 mm · Cheveu : 0,000 005 m = 5 μm · Virus de la grippe : 0,000 000 1 m = 100 nm (ou 0,1 μm)</p>`},
  {n:"Activité 3 (suite)", t:"Conversion d'unités avec les préfixes scientifiques", w:"Sur ta feuille", h:`<p>Convertis dans l'unité demandée.</p><ul><li>Distance Terre-Mars : 62 Gm = … m</li><li>Diamètre du coronavirus : 0,09 μm = … m</li><li>Distance Terre-Soleil : 149 600 000 000 m = … Mm</li><li>Diamètre du virus de la grippe : 0,000 000 1 m = … μm</li></ul>`,
   c:`<ul><li>62 Gm = 62 × ${P10(9)} m = 62 000 000 000 m</li><li>0,09 μm = 0,09 × ${P10(-6)} m = 0,000 000 09 m</li><li>149 600 000 000 m = 149 600 Mm</li><li>0,000 000 1 m = 0,1 μm</li></ul>`},
  {n:"Exercice 9", t:"Conversion d'unités avec les préfixes scientifiques", w:"Sur ton cahier", h:`<p>Convertis les données suivantes dans l'unité demandée. Donne la conversion :</p><ul><li>en écriture décimale ;</li><li>et sous la forme ${$a} × 10<sup><i>n</i></sup>.</li></ul>
<p><b>a)</b> Ma consommation d'internet est de 50 Go (gigaoctets). Convertis-la en octets (o).</p><p><b>b)</b> Le diamètre d'un fil de toile d'araignée est de 6 690 nm. Convertis-le en m.</p><p><b>c)</b> Le poids d'un moustique est de 0,000 001 5 kg. Convertis-le en g, puis en mg.</p><p><b>d)</b> Le poids record d'une baleine bleue est de 177 500 000 g. Convertis-le en Mg.</p><p><b>e)</b> La taille d'un acarien est de 0,000 012 5 m. Convertis-la en mm, puis en μm.</p>`,
   c:`<p><b>a)</b> 50 Go = 50 × ${P10(9)} o = 50 000 000 000 o = 5 × ${P10(10)} o</p><p><b>b)</b> 6 690 nm = 6 690 × ${P10(-9)} m = 0,000 006 69 m = 6,69 × ${P10(-6)} m</p>
<p><b>c)</b> 0,000 001 5 kg = 0,001 5 g = 1,5 × ${P10(-3)} g · 0,001 5 g = 1,5 mg = 1,5 × ${P10(0)} mg</p><p><b>d)</b> 177 500 000 g = 177,5 Mg = 1,775 × ${P10(2)} Mg</p>
<p><b>e)</b> 0,000 012 5 m = 0,012 5 mm = 1,25 × ${P10(-2)} mm · 0,000 012 5 m = 12,5 μm = 1,25 × ${P10(1)} μm</p><p><i>D'autres écritures ${$a} × 10<sup><i>n</i></sup> sont justes, par exemple 50 × ${P10(9)} o ou 6 690 × ${P10(-9)} m.</i></p>`}
]},
{t:"Calculer avec des puissances", e:[
  {n:"Activité 4", t:"Calculer avec des puissances", w:"Sur ton cahier", h:`<p>À l'aide des définitions des puissances positives et négatives, exprime le résultat de ces calculs sous la forme d'une puissance. Détaille les étapes de calcul.</p>${colz([`a) A = ${P10(3)} × ${P10(2)}`,`b) B = ${pw("7",2)} × ${pw("7",-5)}`,`c) C = ${FRH(pw("3",6),pw("3",4))}`,`d) D = ${FRH(pw("6",5),pw("6",-3))}`,`e) E = ${pw("("+P10(2)+")",3)}`])}`,
   c:`${colz([nm("A",[`${P10(3)} × ${P10(2)}`,`10 × 10 × 10 × 10 × 10`,`${P10(5)}`],"a)"),nm("B",[`${pw("7",2)} × ${pw("7",-5)}`,`${pw("7",2)} × ${FRH("1",pw("7",5))}`,`${FRH("7 × 7","7 × 7 × 7 × 7 × 7")}`,`${FRH("1","7 × 7 × 7")}`,`${pw("7",-3)}`],"b)"),nm("C",[`${FRH(pw("3",6),pw("3",4))}`,`${FRH("3 × 3 × 3 × 3 × 3 × 3","3 × 3 × 3 × 3")}`,`3 × 3`,`${pw("3",2)}`],"c)"),nm("D",[`${FRH(pw("6",5),pw("6",-3))}`,`${pw("6",5)} ÷ ${FRH("1",pw("6",3))}`,`${pw("6",5)} × ${pw("6",3)}`,`${pw("6",8)}`],"d)"),nm("E",[`${pw("("+P10(2)+")",3)}`,`${P10(2)} × ${P10(2)} × ${P10(2)}`,`${P10(6)}`],"e)")])}
<p>On retrouve les règles : ${pw($a,"<i>n</i>")} × ${pw($a,"<i>p</i>")} = ${pw($a,"<i>n</i> + <i>p</i>")} · ${FRH(pw($a,"<i>n</i>"),pw($a,"<i>p</i>"))} = ${pw($a,"<i>n</i> − <i>p</i>")} · ${pw("("+pw($a,"<i>n</i>")+")","<i>p</i>")} = ${pw($a,"<i>n</i> × <i>p</i>")}</p>`},
  {n:"Exercice 10", t:"Calculs avec des puissances", w:"Sur ton cahier", h:`<p>Exprime le résultat sous la forme d'une puissance.</p><div class="attention"><p>Ne va pas trop vite : donne du sens à tes calculs.</p></div>
${colz([`a) A = ${P10(3)} × ${P10(2)}`,`b) B = ${pw("6",4)} × ${pw("6",3)} × 6`,`c) C = ${FRH(pw("4",5),pw("4",3))}`,`d) D = ${FRH(P10(2),P10(2))}`,`e) E = ${FRH(pw("5",2),pw("5",5))}`,`f) F = ${FRH(P10(4),P10(-2))}`,`g) G = ${pw("4",5)} × ${pw("4",-2)}`,`h) H = ${P10(-3)} × ${P10(3)}`,`i) I = ${P10(3)} × ${P10(-1)} × ${P10(2)}`,`j) J = ${P10(-2)} × ${P10(-4)} × ${P10(3)}`,`k) K = ${FRH(P10(8)+" × "+P10(-3),P10(2))}`,`l) L = ${FRH("10 × "+P10(3),P10(2)+" × "+P10(-5))}`])}`,
   c:colz([nm("A",[`${P10(3)} × ${P10(2)}`,`${pw("10","3 + 2")}`,`${P10(5)}`],"a)"),nm("B",[`${pw("6",4)} × ${pw("6",3)} × 6`,`${pw("6","4 + 3 + 1")}`,`${pw("6",8)}`],"b)"),nm("C",[`${FRH(pw("4",5),pw("4",3))}`,`${pw("4","5 − 3")}`,`${pw("4",2)}`],"c)"),nm("D",[`${FRH(P10(2),P10(2))}`,`${pw("10","2 − 2")}`,`${P10(0)} (= 1)`],"d)"),nm("E",[`${FRH(pw("5",2),pw("5",5))}`,`${pw("5","2 − 5")}`,`${pw("5",-3)}`],"e)"),nm("F",[`${FRH(P10(4),P10(-2))}`,`${pw("10","4 − (−2)")}`,`${P10(6)}`],"f)"),nm("G",[`${pw("4",5)} × ${pw("4",-2)}`,`${pw("4","5 + (−2)")}`,`${pw("4",3)}`],"g)"),nm("H",[`${P10(-3)} × ${P10(3)}`,`${pw("10","−3 + 3")}`,`${P10(0)} (= 1)`],"h)"),nm("I",[`${P10(3)} × ${P10(-1)} × ${P10(2)}`,`${pw("10","3 − 1 + 2")}`,`${P10(4)}`],"i)"),nm("J",[`${P10(-2)} × ${P10(-4)} × ${P10(3)}`,`${pw("10","−2 − 4 + 3")}`,`${P10(-3)}`],"j)"),nm("K",[`${FRH(P10(8)+" × "+P10(-3),P10(2))}`,`${FRH(pw("10","8 − 3"),P10(2))}`,`${FRH(P10(5),P10(2))}`,`${P10(3)}`],"k)"),nm("L",[`${FRH("10 × "+P10(3),P10(2)+" × "+P10(-5))}`,`${FRH(pw("10","1 + 3"),pw("10","2 − 5"))}`,`${FRH(P10(4),P10(-3))}`,`${P10(7)}`],"l)")])},
]},
{t:"Notation scientifique", e:[
  {n:"Activité 5", t:"Quelle est la meilleure écriture pour comparer des nombres ?", w:"Sur ta feuille", h:`<p>Les deux tableaux suivants donnent la superficie, en m², des cinq plus grandes îles de la Méditerranée.</p>
<div class="schRow">${tabH(["Tableau 1","Superficie (m²)"],[["La Corse",`0,868 × ${P10(10)}`],["La Sardaigne",`238,13 × ${P10(8)}`],["La Sicile",`0,25 × ${P10(11)}`],["La Crète",`8 261 × ${P10(6)}`],["Chypre",`0,009 25 × ${P10(12)}`]])}${tabH(["Tableau 2","Superficie (m²)"],[["La Corse",`8,68 × ${P10(9)}`],["La Sardaigne",`2,381 3 × ${P10(10)}`],["La Sicile",`2,5 × ${P10(10)}`],["La Crète",`8,261 × ${P10(9)}`],["Chypre",`9,25 × ${P10(9)}`]])}</div>
<p>Dans ces deux tableaux, la superficie de chaque île n'est pas écrite de la même façon.</p><p>Choisis le tableau qui te permet de ranger les îles dans l'ordre décroissant de leur superficie (de la plus grande à la plus petite). Numérote les îles de 1 à 5.</p>`,
   c:`<p>On choisit le <b>tableau 2</b> : toutes les superficies sont écrites en notation scientifique. On compare d'abord les exposants, puis les nombres devant ${P10("<i>n</i>")}.</p>
${tabH(["Rang","Île","Superficie (m²)"],[["1","La Sicile",`2,5 × ${P10(10)}`],["2","La Sardaigne",`2,381 3 × ${P10(10)}`],["3","Chypre",`9,25 × ${P10(9)}`],["4","La Corse",`8,68 × ${P10(9)}`],["5","La Crète",`8,261 × ${P10(9)}`]])}`},
  {n:"Exercice 11", t:"Notation scientifique ?", w:"Sur ta feuille", h:`<p>Parmi les nombres suivants, entoure ceux qui sont écrits en notation scientifique.</p>${colz([`a) 5,23 × ${P10(12)}`,`b) 72,43 × ${P10(-8)}`,`c) 2,45 × ${P10(-7)}`,`d) 10,47 × ${P10(6)}`,`e) 0,251 × ${P10(3)}`,`f) −3,6 × ${P10(4)}`])}`,
   c:`<p>Sont en notation scientifique : <b>a)</b>, <b>c)</b> et <b>f)</b> (un seul chiffre, autre que 0, avant la virgule).</p><p>b) 72,43 : deux chiffres avant la virgule · d) 10,47 : deux chiffres avant la virgule · e) 0,251 : le chiffre avant la virgule est 0.</p>`},
  {n:"Exercice 12", t:"De l'écriture décimale à la notation scientifique", w:"Sur ton cahier", h:`<p><b>Partie 1 :</b> écris chacun de ces nombres en notation scientifique.</p>${colz(["a) 545","b) 0,7","c) 71 000","d) 125,6","e) 94 600 000","f) 0,000 85"])}
<p><b>Partie 2 :</b> écris le résultat de chaque produit en notation scientifique.</p>${colz([`a) A = 84,52 × ${P10(5)}`,`b) B = 0,065 × ${P10(4)}`,`c) C = 84,52 × ${P10(-5)}`,`d) D = 0,065 × ${P10(-4)}`])}<p>Vérifie ensuite tes résultats à la calculatrice.</p>`,
   c:`<p><b>Partie 1</b></p>${colz([`a) 545 = 5,45 × ${P10(2)}`,`b) 0,7 = 7 × ${P10(-1)}`,`c) 71 000 = 7,1 × ${P10(4)}`,`d) 125,6 = 1,256 × ${P10(2)}`,`e) 94 600 000 = 9,46 × ${P10(7)}`,`f) 0,000 85 = 8,5 × ${P10(-4)}`])}
<p><b>Partie 2</b></p>${colz([nm("A",[`84,52 × ${P10(5)}`,`8,452 × 10 × ${P10(5)}`,`8,452 × ${P10(6)}`],"a)"),nm("B",[`0,065 × ${P10(4)}`,`6,5 × ${P10(-2)} × ${P10(4)}`,`6,5 × ${P10(2)}`],"b)"),nm("C",[`84,52 × ${P10(-5)}`,`8,452 × 10 × ${P10(-5)}`,`8,452 × ${P10(-4)}`],"c)"),nm("D",[`0,065 × ${P10(-4)}`,`6,5 × ${P10(-2)} × ${P10(-4)}`,`6,5 × ${P10(-6)}`],"d)")])}`},
  {n:"Exercice 13", t:"Écrire un produit en notation scientifique", w:"Sur ton cahier", h:`<p>Écris le résultat de chaque produit en notation scientifique.</p>${colz([`a) A = 157,6 × ${P10(4)}`,`b) B = 65 × ${P10(-3)}`,`c) C = 0,008 6 × ${P10(5)}`,`d) D = 0,17 × ${P10(-4)}`])}`,
   c:colz([nm("A",[`157,6 × ${P10(4)}`,`1,576 × ${P10(2)} × ${P10(4)}`,`1,576 × ${P10(6)}`],"a)"),nm("B",[`65 × ${P10(-3)}`,`6,5 × 10 × ${P10(-3)}`,`6,5 × ${P10(-2)}`],"b)"),nm("C",[`0,008 6 × ${P10(5)}`,`8,6 × ${P10(-3)} × ${P10(5)}`,`8,6 × ${P10(2)}`],"c)"),nm("D",[`0,17 × ${P10(-4)}`,`1,7 × ${P10(-1)} × ${P10(-4)}`,`1,7 × ${P10(-5)}`],"d)")])},
  {n:"Exercice 14", t:"Calculer un quotient d'écritures scientifiques", w:"Sur ton cahier", h:`<p>Exprime le résultat de chaque calcul en notation scientifique.</p>${colz([`A = ${FRH("3 × "+P10(8)+" × 5 × "+P10(-3),"2 × "+P10(2))}`,`B = ${FRH("36 × "+P10(4),"4 × "+P10(6))}`,`C = ${FRH("14 × "+P10(7),"2 × "+P10(-2))}`,`D = ${FRH("4 × "+P10(-5)+" × 0,6 × "+P10(3),"2 × "+P10(4))}`])}`,
   c:colz([calc([`A = ${FRH("3 × "+P10(8)+" × 5 × "+P10(-3),"2 × "+P10(2))}`,`A = ${FRH("3 × 5","2")} × ${FRH(P10(8)+" × "+P10(-3),P10(2))}`,`A = {15/2} × ${FRH(P10(5),P10(2))}`,`A = 7,5 × ${P10(3)}`]),calc([`B = ${FRH("36 × "+P10(4),"4 × "+P10(6))}`,`B = {36/4} × ${FRH(P10(4),P10(6))}`,`B = 9 × ${P10(-2)}`]),calc([`C = ${FRH("14 × "+P10(7),"2 × "+P10(-2))}`,`C = {14/2} × ${FRH(P10(7),P10(-2))}`,`C = 7 × ${P10(9)}`]),calc([`D = ${FRH("4 × "+P10(-5)+" × 0,6 × "+P10(3),"2 × "+P10(4))}`,`D = ${FRH("4 × 0,6","2")} × ${FRH(P10(-5)+" × "+P10(3),P10(4))}`,`D = ${FRH("2,4","2")} × ${FRH(P10(-2),P10(4))}`,`D = 1,2 × ${P10(-6)}`])])}
]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Calculer une puissance", schema:S_DEF, q:{
 1:[ {g:()=>{ const b=ri(2,9), n=ri(2,4), v=Math.pow(b,n); return {q:`Combien vaut ${pw(b,n)} ?`, c:ch4(F(v),[F(b*n),F(Math.pow(b,n-1)),F(v+b)]), rep:F(v), ex:`${pw(b,n)} = ${prod(b,n)} = ${F(v)}.`, sx:S_DEF}; }},
     {g:()=>{ const b=ri(2,9), n=ri(3,6); const good=pw(b,n); return {q:`Comment écrit-on ${prod(b,n)} ?`, c:ch4(good,[pw(n,b),`${b} × ${n}`,pw(b,n+1)]), rep:good, ex:`${n} facteurs égaux à ${b} : ${good}.`, sx:S_DEF}; }} ],
 2:[ {g:()=>{ const b=ri(2,5), n=ri(2,4), v=Math.pow(b,n); const s=pick([0,1]); const q=s?`−${pw(b,n)}`:pw(`(−${b})`,n), val=s?-v:Math.pow(-b,n);
       return {q:`Combien vaut ${q} ?`, c:ch4(F(val),[F(-val),F(-b*n),F(b*n),F(b**(n+1)),F(-(b**(n+1)))]), rep:F(val), ex:s?`−${pw(b,n)} = −(${prod(b,n)}) = ${F(val)}.`:`${q} = ${prod(-b,n)} = ${F(val)} (${n%2?"nombre impair":"nombre pair"} de facteurs négatifs).`, sx:S_DEF}; }} ],
 3:[ {g:()=>{ const b=nz(-9,9); const e=pick([0,1]); const val=e?b:1; return {q:`Combien vaut ${pw(bs(b),e)} ?`, c:ch4(F(val),e?[F(1),F(0),F(-b)]:[F(b),F(0),F(-1)]), rep:F(val), ex:e?`Pour tout nombre ${$a}, ${pw($a,1)} = ${$a}.`:`Pour tout nombre ${$a} non nul, ${pw($a,0)} = 1.`, sx:S_DEF}; }},
     {g:()=>{ const n=ri(3,9); const good=dec(1,n); return {q:`Combien vaut ${P10(n)} ?`, c:ch4(good,[dec(1,n-1),dec(1,n+1),F(10*n)]), rep:good, ex:`L'exposant ${n} donne ${n} zéros.`, sx:S_DEF}; }} ]
}},
{nom:"Priorités opératoires", schema:S_PRI, q:{
 1:[ {g:()=>{ const a=ri(2,9), b=ri(2,5), v=a*b*b; return {q:`Combien vaut ${a} × ${pw(b,2)} ?`, c:ch4(F(v),[F((a*b)**2),F(a*b*2),F(a+b*b)]), rep:F(v), ex:`On calcule d'abord la puissance : ${pw(b,2)} = ${b*b}, puis ${a} × ${b*b} = ${F(v)}.`, sx:S_PRI}; }} ],
 2:[ {g:()=>{ const a=ri(1,9), b=ri(2,7), v=a-b*b; return {q:`Combien vaut ${a} − ${pw(b,2)} ?`, c:ch4(F(v),[F((a-b)**2),F(a+b*b),F(a-2*b),F(b*b-a),F(2*(a-b)),F(-(a+b*b))]), rep:F(v), ex:`La puissance d'abord : ${pw(b,2)} = ${b*b}, puis ${a} − ${b*b} = ${F(v)}.`, sx:S_PRI}; }} ],
 3:[ {g:()=>{ const a=ri(1,6), b=ri(a+1,a+4), n=pick([2,3]), k=ri(2,5), v=Math.pow(a-b,n)*k; return {q:`Combien vaut ${pw(`(${a} − ${b})`,n)} × ${k} ?`, c:ch4(F(v),[F(-v),F(Math.pow(a-b,n*k)),F((a-b)*n*k)]), rep:F(v), ex:`Parenthèses : ${a} − ${b} = ${F(a-b)} ; puissance : ${pw(bs(a-b),n)} = ${F(Math.pow(a-b,n))} ; produit : ${F(v)}.`, sx:S_PRI}; }} ]
}},
{nom:"Exposants négatifs et puissances de 10", schema:S_NEG, q:{
 1:[ {g:()=>{ const n=ri(1,6); const good=dec(1,-n); return {q:`Combien vaut ${P10(-n)} ?`, c:ch4(good,[dec(1,-n-1),"−"+dec(1,n),dec(1,-n+1)]), rep:good, ex:`${P10(-n)} = ${FRH("1",P10(n))} = ${good} (${n} zéro${n>1?"s":""}).`, sx:S_NEG}; }} ],
 2:[ {g:()=>{ const b=ri(2,6), n=ri(1,3); const d=Math.pow(b,n), good=`{1/${d}}`; return {q:`Combien vaut ${pw(b,-n)} ?`, c:ch4(good,[F(-d),`−{1/${d}}`,F(-b*n)]), rep:good, ex:`${pw(b,-n)} = ${FRH("1",pw(b,n))} = {1/${d}}.`, sx:S_NEG}; }},
     {g:()=>{ const M=ri(11,999), n=ri(1,5)*pick([1,-1]); const good=dec(M,n); return {q:`Quelle est l'écriture décimale de ${F(M)} × ${P10(n)} ?`, c:ch4(good,[dec(M,-n),dec(M,n+1),dec(M,n-1)]), rep:good, ex:`On décale la virgule de ${Math.abs(n)} rang${Math.abs(n)>1?"s":""} vers la ${n>0?"droite":"gauche"}.`, sx:S_NEG}; }} ],
 3:[ {g:()=>{ const b=ri(2,5), n=pick([1,3]); const d=Math.pow(b,n); return {q:`Combien vaut ${pw(`(−${b})`,-n)} ?`, c:ch4(`−{1/${d}}`,[`{1/${d}}`,F(-d),F(d)]), rep:`−{1/${d}}`, ex:`${pw(`(−${b})`,-n)} = ${FRH("1",pw(`(−${b})`,n))} = ${FRH("1",F(-d))} = −{1/${d}}.`, sx:S_NEG}; }},
     {g:()=>{ const M=ri(11,99), q=-ri(1,3), n=-ri(2,4); const good=dec(M,q+n); return {q:`Quelle est l'écriture décimale de ${dec(M,q)} × ${P10(n)} ?`, c:ch4(good,[dec(M,q-n),dec(M,q+n+1),dec(M,q+n-1)]), rep:good, ex:`On décale la virgule de ${-n} rangs vers la gauche.`, sx:S_NEG}; }} ]
}},
{nom:"Calculer avec des puissances", schema:S_REG, q:{
 1:[ {g:()=>{ const b=pick([2,3,5,7,10]), n=ri(2,9), p=ri(2,9); const good=pw(b,n+p); return {q:`Écris ${pw(b,n)} × ${pw(b,p)} sous la forme d'une puissance.`, c:ch4(good,[pw(b,n*p),pw(b*b,n+p),pw(b,n-p),pw(b,n+p+1)]), rep:good, ex:`${pw($a,"<i>n</i>")} × ${pw($a,"<i>p</i>")} = ${pw($a,"<i>n</i> + <i>p</i>")} : ${n} + ${p} = ${n+p}.`, sx:S_REG}; }} ],
 2:[ {g:()=>{ const b=pick([2,3,5,7,10]); let n,p; do{ n=ri(1,9); p=ri(1,9); }while(n===p); const good=pw(b,n-p); return {q:`Écris ${FRH(pw(b,n),pw(b,p))} sous la forme d'une puissance.`, c:ch4(good,[pw(b,p-n),pw(b,n+p),pw(1,n-p)]), rep:good, ex:`${FRH(pw($a,"<i>n</i>"),pw($a,"<i>p</i>"))} = ${pw($a,"<i>n</i> − <i>p</i>")} : ${n} − ${p} = ${E(n-p)}.`, sx:S_REG}; }},
     {g:()=>{ const b=pick([2,3,5,10]), n=ri(2,5), p=ri(2,4); const good=pw(b,n*p); return {q:`Écris ${pw("("+pw(b,n)+")",p)} sous la forme d'une puissance.`, c:ch4(good,[pw(b,n+p),pw(b,Math.pow(n,p)),pw(b*p,n),pw(b,n*p+n),pw(b,n*p-1)]), rep:good, ex:`${pw("("+pw($a,"<i>n</i>")+")","<i>p</i>")} = ${pw($a,"<i>n</i> × <i>p</i>")} : ${n} × ${p} = ${n*p}.`, sx:S_REG}; }} ],
 3:[ {g:()=>{ const n=nz(-6,6), p=nz(-6,6), r=ri(1,6)*pick([1,-1]); const good=P10(n+p-r); return {q:`Écris ${FRH(P10(n)+" × "+P10(p),P10(r))} sous la forme d'une puissance de 10.`, c:ch4(good,[P10(n+p+r),P10(n*p-r),P10(n-p-r)]), rep:good, ex:`${E(n)} + ${p<0?"(":""}${E(p)}${p<0?")":""} = ${E(n+p)}, puis ${E(n+p)} − ${r<0?"(":""}${E(r)}${r<0?")":""} = ${E(n+p-r)}.`, sx:S_REG}; }} ]
}},
{nom:"Préfixes scientifiques", schema:S_PRE, q:{
 1:[ {g:()=>{ const L=[["G",9],["M",6],["k",3],["m",-3],["μ",-6],["n",-9]]; const [u,e]=pick(L); const good=`${P10(e)} m`; return {q:`1 ${u}m = …`, c:ch4(good,[`${P10(-e)} m`,`${P10(e>0?e+3:e-3)} m`,`${P10(e>0?e-1:e+1)} m`]), rep:good, ex:`Le préfixe ${u} correspond à ${P10(e)}.`, sx:S_PRE}; }} ],
 2:[ {g:()=>{ const L=[["G",9],["M",6],["μ",-6],["n",-9]]; const [u,e]=pick(L), M=ri(2,99); const good=`${dec(M,e)} m`; return {q:`${F(M)} ${u}m = … m`, c:ch4(good,[`${dec(M,-e)} m`,`${dec(M,e+3)} m`,`${dec(M,e-3)} m`]), rep:good, ex:`${F(M)} ${u}m = ${F(M)} × ${P10(e)} m = ${good}.`, sx:S_PRE}; }} ],
 3:[ {g:()=>{ const C=[["Gm",9],["Mm",6],["km",3],["mm",-3],["μm",-6],["nm",-9]]; const [u,e]=pick(C); let M; do{ M=ri(2,999); }while(M%10===0); const d=dec(M,e);
       return {q:`Quelle unité est la plus adaptée pour écrire ${d} m avec le moins de chiffres possible ?`, c:ch4(`${F(M)} ${u}`,shuf(C.filter(c=>c[0]!==u)).slice(0,3).map(c=>`${dec(M,e-c[1])} ${c[0]}`)), rep:`${F(M)} ${u}`, ex:`${d} m = ${F(M)} × ${P10(e)} m = ${F(M)} ${u}.`, sx:S_PRE}; }} ]
}},
{nom:"Notation scientifique", schema:S_SCI, q:{
 1:[ {g:()=>{ let M; do{ M=ri(11,999); }while(M%10===0); M*=pick([1,1,-1]); const s=sciOf(M,0), e=nz(-9,9); const good=`${dec(s.M,s.q)} × ${P10(e)}`;
       return {q:"Lequel de ces nombres est écrit en notation scientifique ?", c:ch4(good,[`${dec(M,0)} × ${P10(e)}`,`${dec(s.M,s.q-1)} × ${P10(e+1)}`,`${dec(s.M,s.q+1)} × ${P10(e-1)}`]), rep:good, ex:"Un seul chiffre, autre que 0, avant la virgule.", sx:S_SCI}; }} ],
 2:[ {g:()=>{ const M=ri(11,999), p=ri(-9,9); const d=dec(M,p), good=sci(M,p), s=sciOf(M,p); return {q:`Quelle est la notation scientifique de ${d} ?`, c:ch4(good,[`${dec(s.M,s.q)} × ${P10(-s.e)}`,`${dec(s.M,s.q)} × ${P10(s.e+1)}`,`${dec(s.M,s.q+1)} × ${P10(s.e-1)}`,`${dec(s.M,s.q)} × ${P10(s.e+2)}`]), rep:good, ex:`${d} = ${good}.`, sx:S_SCI}; }} ],
 3:[ {g:()=>{ let M,q; do{ M=ri(11,9999); q=ri(-5,2); }while(sciOf(M,q).e===0); const n=nz(-7,7); const s=sciOf(M,q+n), good=`${dec(s.M,s.q)} × ${P10(s.e)}`; return {q:`Quelle est la notation scientifique de ${dec(M,q)} × ${P10(n)} ?`, c:ch4(good,[`${dec(s.M,s.q)} × ${P10(n)}`,`${dec(s.M,s.q)} × ${P10(-s.e)}`,`${dec(s.M,s.q)} × ${P10(s.e+2)}`,`${dec(s.M,s.q)} × ${P10(s.e-1)}`]), rep:good, ex:`${dec(M,q)} = ${sci(M,q)}, donc ${dec(M,q)} × ${P10(n)} = ${good}.`, sx:S_SCI}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 14", duree:50, info:"Durée : 50 min · Calculatrice non autorisée · Détaille tes calculs",
comp:[
  ["CALCULER","Je calcule une puissance d'exposant positif.","Ex. 1 (4 points)"],
  ["CALCULER","J'applique les priorités opératoires avec des puissances.","Ex. 2 (3 points)"],
  ["CALCULER","Je calcule avec des exposants négatifs et des puissances de 10.","Ex. 3 (3 points)"],
  ["RAISONNER","J'utilise les règles de calcul sur les puissances.","Ex. 4 (4 points)"],
  ["MODÉLISER","Je convertis des unités avec les préfixes scientifiques.","Ex. 5 (3 points)"],
  ["CALCULER","J'utilise la notation scientifique.","Ex. 6 (3 points)"]
],
exos:[
{t:"Calculer des puissances", p:4, h:`<p>Calcule sans calculatrice.</p>${colz([`a) A = ${pw("2",5)}`,`b) B = ${pw("(−3)",2)}`,`c) C = −${pw("3",2)}`,`d) D = ${pw("(−1)",7)}`,`e) E = ${pw("7",0)}`,`f) F = ${pw("(−4)",3)}`,`g) G = ${P10(4)}`,`h) H = ${pw("12",1)}`])}`,
 c:`${colz([nm("A",[`${pw("2",5)}`,`2 × 2 × 2 × 2 × 2`,`32`],"a)"),nm("B",[`${pw("(−3)",2)}`,`(−3) × (−3)`,`9`],"b)"),nm("C",[`−${pw("3",2)}`,`−3 × 3`,`−9`],"c)"),nm("D",[`${pw("(−1)",7)}`,`−1 (7 facteurs négatifs)`],"d)"),nm("E",[`${pw("7",0)}`,`1`],"e)"),nm("F",[`${pw("(−4)",3)}`,`(−4) × (−4) × (−4)`,`−64`],"f)"),nm("G",[`${P10(4)}`,`10 000`],"g)"),nm("H",[`${pw("12",1)}`,`12`],"h)")])}<p><i>(0,5 point par calcul)</i></p>`},
{t:"Priorités opératoires", p:3, h:`<p>Calcule en détaillant les étapes.</p>${colz([`A = 3 − ${pw("4",2)}`,`B = ${pw("(5 − 7)",3)} × 2`,`C = ${pw("(2 × 3 − 2<sup>2</sup>)",4)}`])}`,
 c:`${colz([calc([`A = 3 − ${pw("4",2)}`,"A = 3 − 16","A = −13"]),calc([`B = ${pw("(5 − 7)",3)} × 2`,`B = ${pw("(−2)",3)} × 2`,"B = −8 × 2","B = −16"]),calc([`C = ${pw("(2 × 3 − 2<sup>2</sup>)",4)}`,`C = ${pw("(6 − 4)",4)}`,`C = ${pw("2",4)}`,"C = 16"])])}<p><i>(1 point par calcul)</i></p>`},
{t:"Exposants négatifs et puissances de 10", p:3, h:`<p>Donne l'écriture décimale ou une fraction.</p>${colz([`a) A = ${P10(-3)}`,`b) B = ${pw("3",-2)}`,`c) C = ${pw("(−2)",-3)}`,`d) D = 2,7 × ${P10(4)}`,`e) E = 56 × ${P10(-2)}`,`f) F = 4,1 × ${P10(-3)}`])}`,
 c:`${colz([nm("A",[`${P10(-3)}`,`0,001`],"a)"),nm("B",[`${pw("3",-2)}`,`${FRH("1",pw("3",2))}`,`{1/9}`],"b)"),nm("C",[`${pw("(−2)",-3)}`,`${FRH("1",pw("(−2)",3))}`,`−{1/8}`],"c)"),nm("D",[`2,7 × ${P10(4)}`,`27 000`],"d)"),nm("E",[`56 × ${P10(-2)}`,`0,56`],"e)"),nm("F",[`4,1 × ${P10(-3)}`,`0,004 1`],"f)")])}<p><i>(0,5 point par calcul)</i></p>`},
{t:"Calculer avec des puissances", p:4, h:`<p>Écris chaque résultat sous la forme d'une puissance.</p>${colz([`a) A = ${pw("5",3)} × ${pw("5",4)}`,`b) B = ${pw("7",4)} × ${pw("7",-6)}`,`c) C = ${FRH(P10(6),P10(2))}`,`d) D = ${FRH(pw("2",3),pw("2",7))}`,`e) E = ${pw("("+pw("3",2)+")",4)}`,`f) F = ${P10(-2)} × ${P10(5)} × 10`,`g) G = ${FRH(P10(5)+" × "+P10(-1),P10(-3))}`,`h) H = ${FRH(pw("("+P10(3)+")",2),P10(4))}`])}`,
 c:`${colz([nm("A",[`${pw("5",3)} × ${pw("5",4)}`,`${pw("5","3 + 4")}`,`${pw("5",7)}`],"a)"),nm("B",[`${pw("7",4)} × ${pw("7",-6)}`,`${pw("7","4 + (−6)")}`,`${pw("7",-2)}`],"b)"),nm("C",[`${FRH(P10(6),P10(2))}`,`${pw("10","6 − 2")}`,`${P10(4)}`],"c)"),nm("D",[`${FRH(pw("2",3),pw("2",7))}`,`${pw("2","3 − 7")}`,`${pw("2",-4)}`],"d)"),nm("E",[`${pw("("+pw("3",2)+")",4)}`,`${pw("3","2 × 4")}`,`${pw("3",8)}`],"e)"),nm("F",[`${P10(-2)} × ${P10(5)} × 10`,`${pw("10","−2 + 5 + 1")}`,`${P10(4)}`],"f)"),nm("G",[`${FRH(P10(5)+" × "+P10(-1),P10(-3))}`,`${FRH(P10(4),P10(-3))}`,`${pw("10","4 − (−3)")}`,`${P10(7)}`],"g)"),nm("H",[`${FRH(pw("("+P10(3)+")",2),P10(4))}`,`${FRH(P10(6),P10(4))}`,`${pw("10","6 − 4")}`,`${P10(2)}`],"h)")])}<p><i>(0,5 point par calcul)</i></p>`},
{t:"Préfixes scientifiques", p:3, h:`<p>Convertis dans l'unité demandée. Donne l'écriture décimale et une écriture de la forme ${$a} × 10<sup><i>n</i></sup>.</p>
<p>a) La distance moyenne entre la Terre et Vénus est d'environ 3,2 Gm. Convertis-la en m.</p><p>b) La longueur d'onde d'une lumière bleue est de 450 nm. Convertis-la en m.</p><p>c) Un grain de pollen mesure 0,000 08 m. Convertis cette longueur en μm.</p>`,
 c:`<p>a) 3,2 Gm = 3,2 × ${P10(9)} m = 3 200 000 000 m <i>(1 point)</i></p><p>b) 450 nm = 450 × ${P10(-9)} m = 0,000 000 45 m = 4,5 × ${P10(-7)} m <i>(1 point)</i></p><p>c) 0,000 08 m = 8 × ${P10(-5)} m = 80 × ${P10(-6)} m = 80 μm <i>(1 point)</i></p>`},
{t:"Notation scientifique", p:3, h:`<p>1) Écris en notation scientifique : a) 4 560 000 · b) 0,000 72 · c) C = 35,8 × ${P10(-4)}</p><p>2) Calcule et donne le résultat en notation scientifique : D = ${FRH("6 × "+P10(5)+" × 4 × "+P10(-2),"8 × "+P10(7))}</p>`,
 c:`<p>1) a) 4 560 000 = 4,56 × ${P10(6)} · b) 0,000 72 = 7,2 × ${P10(-4)}</p>${nm("C",[`35,8 × ${P10(-4)}`,`3,58 × 10 × ${P10(-4)}`,`3,58 × ${P10(-3)}`],"c)")}<p><i>(0,5 point par nombre)</i></p>
<p>2)</p>${calc([`D = ${FRH("6 × "+P10(5)+" × 4 × "+P10(-2),"8 × "+P10(7))}`,`D = ${FRH("6 × 4","8")} × ${FRH(P10(5)+" × "+P10(-2),P10(7))}`,`D = {24/8} × ${FRH(P10(3),P10(7))}`,`D = 3 × ${P10(-4)}`])}<p><i>(1,5 point)</i></p>`}
]}
};
window.PW14={F,P,X,FR,SV,calc,cols:colz,tabH,vt,E,pw,bs,P10,FRH,prod,dec,sciOf,sci,isSci,nz,T_PRE};
})();
