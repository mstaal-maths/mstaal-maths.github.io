/* 6e · chapitre 5 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres.
   Tous les nombres décimaux sont manipulés comme des entiers (n, k chiffres après la virgule) : pas d'erreur d'arrondi. */
TRAIN["6e-5"] = function(){
const {ri, pick, shuf, sp, distinct, items} = TR;
const D = (n,k) => { if(!k) return sp(n); const s=String(n).padStart(k+1,"0"); return sp(+s.slice(0,-k))+","+s.slice(-k); };
const T = s => s.includes(",") ? s.replace(/0+$/,"").replace(/,$/,"") : s;
const P = k => Math.pow(10,k);
const RANGS = ["unités","dixièmes","centièmes","millièmes"], RG=["dizaines","unités","dixièmes","centièmes"];
const cmp = (a,b) => a<b?"&lt;":a>b?"&gt;":"=";
const dixAx = (a,b,pts=[]) => axis({n:(b-a)*10, lab:[...Array(b-a+1)].map((_,i)=>[10*i,String(a+i)]), major:[...Array(b-a+1)].map((_,i)=>10*i), pts:pts.map(([L,v])=>[L,v-10*a])});
const centAx = (d,pts=[]) => axis({n:10, lab:[[0,D(d,1)],[10,D(d+1,1)]], major:[5], pts:pts.map(([L,v])=>[L,v-10*d])});

/* ---------- A. Reconnaître ---------- */
const a1 = shuf([[ri(101,999),2],[ri(11,99),1],[ri(1001,9999),3],[ri(11,99),2],[ri(2,19),0]]);
const e1 = distinct(6, ()=>{ const k=ri(1,3), n=ri(1,999)*P(k)+ri(1,P(k)-1); return [n,k]; }, x=>x.join());
const dec = (n,k) => k? `${sp(Math.floor(n/P(k)))} + ${D(n%P(k),k)}` : `${sp(n)} + 0`;
const lab = shuf([...shuf([1,2,3,4,5,6,7,8,9]).slice(0,2), 0]).map(String);
const perm = a => a.length<=1?[a]:a.flatMap((x,i)=>perm([...a.slice(0,i),...a.slice(i+1)]).map(r=>[x,...r]));
const ecr = perm(lab).flatMap(p=>[`${p[0]},${p[1]}${p[2]}`, `${p[0]}${p[1]},${p[2]}`]);
const valE = s => parseFloat(s.replace(",","."));
const ent = ecr.filter(s=>/,0$/.test(s) && s[0]!=="0");
const pairs = []; ecr.forEach((x,i)=>ecr.forEach((y,j)=>{ if(i<j && valE(x)===valE(y)) pairs.push(`${x} = ${y}`); }));
const secA = {t:"Reconnaître un nombre décimal", e:[
  {n:"Activité 1", t:"Fractions décimales", w:"Sur ton cahier", h:`<p>Écris chacun de ces nombres sous la forme d'une fraction décimale : ${a1.map(([n,k])=>D(n,k)).join(" ; ")}</p>`,
   c:a1.map(([n,k])=>`${D(n,k)} = {${sp(n)}/${sp(P(k))}}`).join(" &nbsp; · &nbsp; ")},
  {n:"Exercice 1", t:"Partie entière et partie décimale", w:"Sur ton cahier", h:`<p>Écris chaque nombre comme la somme de sa partie entière et de sa partie décimale : ${items(e1.map(([n,k])=>D(n,k)),"  ·  ",true)}</p>`,
   c:items(e1.map(([n,k])=>`${D(n,k)} = ${dec(n,k)}`),"  ·  ",true)},
  {n:"Activité 2", t:"Le jeu des étiquettes", w:"Sur ton cahier", h:`<p>Avec les quatre étiquettes <b>${lab[0]}</b> · <b>${lab[1]}</b> · <b>${lab[2]}</b> · <b>,</b> on forme des nombres en utilisant chaque étiquette une seule fois.</p><p>1) Écris les 12 nombres possibles. 2) Lesquels sont des nombres entiers ? 3) Lesquels sont égaux entre eux ?</p>`,
   c:`<p>1) ${ecr.join(" ; ")}</p><p>2) ${ent.length?ent.map(s=>`${s} = ${s.replace(/,0$/,"")}`).join(" ; "):"aucun"}</p><p>3) ${pairs.length?pairs.join(" ; "):"aucun"}</p>`}
]};

/* ---------- B. Écritures ---------- */
const n3 = ri(100,999)*100+ri(10,99);
const e4 = [[ri(11,99),1],[ri(11,99),2],[ri(1,9)*100+ri(1,9),2],[ri(1,9)*10+ri(1,9),1]];
const z5 = shuf([`0${ri(1,9)},${ri(1,9)}00`, `${ri(1,9)}0${ri(1,9)},${ri(1,9)}0`, `${ri(1,9)}0,${ri(1,9)}`, `0,${ri(1,9)}`, `0${ri(1,9)}0`]);
const sans = s => { let t=s.replace(/^0+(?=\d)/,""); if(t.includes(",")) t=t.replace(/0+$/,"").replace(/,$/,""); return t; };
const e6 = distinct(4, ()=>{ const a=ri(1,99), b=ri(1,9), c=ri(1,9); return pick([[`0${a},${b}0`,`${a},${b}`],[`${a},${b}0${c}`,`0${a},${b}${c}`],[`00${a}`,`${a},00`],[`${a},${b}${c}`,`${a},${c}${b}`]]); }, x=>x.join());
const secB = {t:"Les différentes écritures d'un nombre décimal", e:[
  {n:"Exercice 3", t:"Le tableau de numération", w:"Sur ton cahier", h:`<p>On considère le nombre ${D(n3,2)}. Donne le chiffre des dixièmes, des centièmes, des unités, des dizaines, puis le nombre de centièmes en tout.</p>`,
   c:`dixièmes : ${Math.floor(n3/10)%10} · centièmes : ${n3%10} · unités : ${Math.floor(n3/100)%10} · dizaines : ${Math.floor(n3/1000)%10} · nombre de centièmes : <b>${sp(n3)}</b> (on garde tous les chiffres jusqu'aux centièmes : ${D(n3,2)} = {${sp(n3)}/100})`},
  {n:"Exercice 4", t:"Passer d'une écriture à une autre", w:"Sur ton cahier", h:`<p>Écris chaque nombre sous forme de fraction décimale et sous forme décomposée : ${items(e4.map(([n,k])=>D(n,k)),"  ·  ",true)}</p>`,
   c:items(e4.map(([n,k])=>`${D(n,k)} = {${n}/${P(k)}} = ${dec(n,k)}`),"  ·  ",true)},
  {n:"Exercice 5", t:"Les zéros inutiles", w:"Sur ton cahier", h:`<p>Écris ces nombres sans les zéros inutiles (attention, certains zéros sont utiles !) : ${items(z5,"  ·  ",true)}</p>`,
   c:items(z5.map(s=>`${s} → ${sans(s)}`),"  ·  ",true)},
  {n:"Exercice 6", t:"Égal ou différent ?", w:"Sur ton cahier", h:`<p>Complète avec = ou ≠ : ${items(e6.map(([x,y])=>`${x} …… ${y}`),"  ·  ",true)}</p>`,
   c:items(e6.map(([x,y])=>`${x} ${valE(x)===valE(y)?"=":"≠"} ${y}`),"  ·  ",true)}
]};

/* ---------- C. Demi-droite ---------- */
const pl = shuf([...Array(29)].map((_,i)=>i+1).filter(x=>x%10)).slice(0,3).sort((a,b)=>a-b);
const lu = shuf([...Array(39)].map((_,i)=>i+1).filter(x=>x%10)).slice(0,5).sort((a,b)=>a-b);
const zd = ri(11,49), zp = shuf([1,2,3,4,5,6,7,8,9]).slice(0,4);
const secC = {t:"Repérer un nombre décimal sur une demi-droite graduée", e:[
  {n:"Activité 3", t:"Placer des nombres décimaux", w:"Sur ton cahier", h:`<p>Reproduis la demi-droite et place les nombres : ${pl.map(v=>D(v,1)).join(" ; ")}</p>${dixAx(0,3)}`,
   c:dixAx(0,3,pl.map(v=>[D(v,1),v]))},
  {n:"Exercice 7", t:"Lire une abscisse", w:"Sur ton cahier", h:`<p>Donne l'abscisse de chacun des points, en écriture décimale.</p>${dixAx(0,4,lu.map((v,i)=>["ABCDE"[i],v]))}`,
   c:`<p>Une petite graduation vaut 0,1.</p><p>${lu.map((v,i)=>`${"ABCDE"[i]} est ${v%10} graduation${v%10>1?"s":""} après ${Math.floor(v/10)} : <b>${"ABCDE"[i]}(${D(v,1)})</b>.`).join("<br>")}</p>`},
  {n:"Exercice 8", t:"Le zoom au centième", w:"Sur ton cahier", h:`<p>Cette demi-droite est graduée en centièmes. 1) Place ${D(10*zd+zp[0],2)} et ${D(10*zd+zp[1],2)}. 2) Donne l'abscisse des points F et G.</p>${centAx(zd,[["F",10*zd+zp[2]],["G",10*zd+zp[3]]])}`,
   c:`<p>Une graduation vaut 0,01.</p>${centAx(zd,[[D(10*zd+zp[0],2),10*zd+zp[0]],[D(10*zd+zp[1],2),10*zd+zp[1]]])}<p>F est ${zp[2]} graduation${zp[2]>1?"s":""} après ${D(zd,1)} : <b>F(${D(10*zd+zp[2],2)})</b>.<br>G est ${zp[3]} graduation${zp[3]>1?"s":""} après ${D(zd,1)} : <b>G(${D(10*zd+zp[3],2)})</b>.</p>`}
]};

/* ---------- D. Comparer et ranger ---------- */
const c9 = distinct(9, ()=>{ const t=ri(0,4), e=ri(0,15);
  if(t===0) return [[e*10+ri(1,9),1],[e*100+ri(10,99),2]];
  if(t===1) return [[e*10+ri(1,9),1],[(e+ri(1,3))*100+ri(1,99),2]];
  if(t===2){ const x=e*10+ri(1,9); return [[x,1],[x*10,2]]; }
  if(t===3) return [[e*100+ri(1,9),2],[e*10+ri(1,9),1]];
  return [[e*1000+ri(100,999),3],[e*10+ri(1,9),1]]; }, x=>JSON.stringify(x));
const val = ([n,k]) => n*P(3-k);
const prenoms = shuf(["Inès","Noah","Jade","Louis","Emma","Hugo","Léa","Nathan"]).slice(0,6);
const tailles = distinct(6, ()=>pick([[ri(70,99),2],[ri(100,199),2],[ri(10,19),1]]), x=>val(x));
const mat = ["Maths","Français","Anglais","EPS","Musique","Histoire-Géo"];
const moy = distinct(6, ()=>pick([[ri(80,199),1],[ri(800,1999),2]]), x=>val(x));
const fr = ["cerises","pêches","poires","pommes","framboises","fraises"];
const prix = distinct(6, ()=>pick([[ri(15,59),1],[ri(150,599),2],[ri(1500,5999),3]]), x=>val(x));
const ord = (arr, names, desc) => arr.map((x,i)=>[x,names[i]]).sort((p,q)=>desc?val(q[0])-val(p[0]):val(p[0])-val(q[0]));
const ta=ord(tailles,prenoms), mo=ord(moy,mat,true), px=ord(prix,fr);
const Dt = (n,k) => T(D(n,k));
const secD = {t:"Comparer et ranger", e:[
  {n:"Exercice 9", t:"Comparer deux nombres décimaux", w:"Sur ton cahier", h:`<p>Complète avec &lt; , &gt; ou = : ${items(c9.map(([x,y])=>`${D(...x)} …… ${D(...y)}`),"  ·  ",true)}</p>`,
   c:items(c9.map(([x,y])=>{ const k=Math.max(x[1],y[1]), px=D(x[0]*P(k-x[1]),k), py=D(y[0]*P(k-y[1]),k); const ex_=Math.floor(x[0]/P(x[1])), ey=Math.floor(y[0]/P(y[1])); return `${D(...x)} ${cmp(val(x),val(y))} ${D(...y)}`+(ex_!==ey?` (parties entières : ${sp(ex_)} ${cmp(ex_,ey)} ${sp(ey)})`:px!==D(...x)||py!==D(...y)?` (on compare ${px} et ${py})`:""); }),"  ·  ",true)},
  {n:"Activité 4", t:"Les tailles", w:"Sur ton cahier", h:`<p>Voici la taille de six enfants : ${tailles.map((t,i)=>`${prenoms[i]} : ${Dt(...t)} m`).join(" · ")}</p><p>Range les tailles dans l'ordre croissant, puis les prénoms dans le même ordre.</p>`,
   c:`<p>${ta.map(([t])=>Dt(...t)).join(" &lt; ")}</p><p>${ta.map(([,p])=>p).join(", ")}</p>`},
  {n:"Exercice 10", t:"Les moyennes", w:"Sur ton cahier", h:`<p>Voici des moyennes : ${moy.map((t,i)=>`${mat[i]} : ${Dt(...t)}`).join(" · ")}</p><p>Range-les dans l'ordre décroissant. Quelle est la meilleure matière ?</p>`,
   c:`<p>${mo.map(([t])=>Dt(...t)).join(" &gt; ")}</p><p>La meilleure matière : <b>${mo[0][1]}</b>.</p>`},
  {n:"Exercice 11", t:"Le prix des fruits", w:"Sur ton cahier", h:`<p>Prix au kilo : ${prix.map((t,i)=>`${fr[i]} : ${Dt(...t)} €`).join(" · ")}</p><p>Range les prix dans l'ordre croissant. Quel est le fruit le moins cher ? le plus cher ?</p>`,
   c:`<p>${px.map(([t])=>Dt(...t)).join(" &lt; ")}</p><p>Le moins cher : les <b>${px[0][1]}</b> ; le plus cher : les <b>${px[5][1]}</b>.</p>`}
]};

/* ---------- E. Encadrer et intercaler ---------- */
const i12 = distinct(4, ()=>{ const k=ri(1,3); return [ri(0,15)*P(k)+ri(0,P(k-1)-1)*10+ri(1,9), k]; }, x=>x[0]*P(3-x[1]));
const u13 = ri(1,9), i13 = distinct(4, ()=>[u13*100+pick([0,1,2,3,4,5,6,7,8,9])*10+ri(1,9), 2], x=>Math.floor(x[0]/10));
const e15 = distinct(4, ()=>{ let n; do{ n=ri(1001,29999); }while(n%10===0||Math.floor(n/10)%10===0&&Math.random()<.5); return n; }, x=>x);
const enc = n => { const u=Math.floor(n/1000), d=Math.floor(n/100), c=Math.floor(n/10);
  return [`${sp(u)} &lt; ${D(n,3)} &lt; ${sp(u+1)}`, `${T(D(d,1))} &lt; ${D(n,3)} &lt; ${T(D(d+1,1))}`, `${D(c,2)} &lt; ${D(n,3)} &lt; ${D(c+1,2)}`]; };
const secE = {t:"Encadrer et intercaler", e:[
  {n:"Exercice 12", t:"Entre deux entiers consécutifs", w:"Sur ton cahier", h:`<p>Encadre chaque nombre entre deux entiers consécutifs : ${items(i12.map(x=>D(...x)),"  ·  ",true)}</p>`,
   c:items(i12.map(([n,k])=>`${sp(Math.floor(n/P(k)))} &lt; ${D(n,k)} &lt; ${sp(Math.floor(n/P(k))+1)}`),"  ·  ",true)},
  {n:"Exercice 13", t:"Entre deux dixièmes", w:"Sur ton cahier", h:`<p>Encadre chaque nombre entre deux dixièmes consécutifs : ${items(i13.map(x=>D(...x)),"  ·  ",true)}</p>`,
   c:items(i13.map(([n])=>`${T(D(Math.floor(n/10),1))} &lt; ${D(n,2)} &lt; ${T(D(Math.floor(n/10)+1,1))}`),"  ·  ",true)},
  {n:"Exercice 14", t:"À toi de choisir", w:"Sur ton cahier", h:`<p>Intercale un nombre : a) ${u13} &lt; …… &lt; ${u13+1} · b) ${D(10*u13+3,1)} &lt; …… &lt; ${D(10*u13+4,1)} · c) ${D(100*u13+57,2)} &lt; …… &lt; ${D(100*u13+58,2)}</p>`,
   c:`Exemples (il y a beaucoup de réponses) : a) ${D(10*u13+5,1)} · b) ${D(100*u13+35,2)} · c) ${D(1000*u13+575,3)}`},
  {n:"Exercice 15", t:"Encadrer un nombre décimal", w:"Sur ton cahier", h:`<p>Encadre à l'unité, au dixième et au centième près : ${items(e15.map(n=>D(n,3)),"  ·  ",true)}</p>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Nombre</th><th>à l'unité</th><th>au dixième</th><th>au centième</th></tr></thead><tbody>${e15.map(n=>`<tr><td>${D(n,3)}</td>${enc(n).map(x=>`<td>${x}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`}
]};

/* ---------- F. Arrondir ---------- */
const a16 = distinct(4, ()=>{ const t=ri(0,3); if(t===0) return ri(1,29)*1000+ri(1,999); if(t===1) return ri(1,29)*1000+ri(95,99)*10+ri(0,9); if(t===2) return ri(1,29)*1000+ri(10,99)*10+5; return ri(1,29)*1000+500+ri(0,9); }, x=>x);
const rnd = (n,p) => Math.floor(n/p) + ((n%p)*2>=p ? 1 : 0);      /* n entier, p = 10, 100 ou 1000 */
const arr = n => [sp(rnd(n,1000)), D(rnd(n,100),1), D(rnd(n,10),2)];
const div = pick([[7,3],[20,3],[10,7],[25,6],[50,7]]), q = div[0]/div[1];
/* chiffres exacts par division posée (pas d'erreur d'arrondi de l'ordinateur) */
const ip = Math.floor(div[0]/div[1]), nd = 11-String(ip).length;
const digs = n => { let r=div[0]%div[1], o=""; for(let i=0;i<n;i++){ r*=10; o+=Math.floor(r/div[1]); r%=div[1]; } return o; };
const qs = `${ip},${digs(12)}`; let dd=digs(nd+1), last=+dd[nd]; let aff=`${ip}${dd.slice(0,nd)}`;
if(last>=5){ aff=String(BigInt(aff)+1n); }
aff = aff.slice(0,aff.length-nd)+","+aff.slice(-nd);
const tot = pick([47,58,71,85,92]), parts = 3, cents = Math.round(tot*100/parts), rest = tot*100-3*Math.floor(tot*100/3);
const secF = {t:"Donner un arrondi", e:[
  {n:"Exercice 16", t:"Trouver l'arrondi", w:"Sur ton cahier", h:`<p>Donne l'arrondi à l'unité, au dixième et au centième de : ${items(a16.map(n=>D(n,3)),"  ·  ",true)}</p>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Nombre</th><th>à l'unité</th><th>au dixième</th><th>au centième</th></tr></thead><tbody>${a16.map(n=>`<tr><td>${D(n,3)}</td>${arr(n).map(x=>`<td>${x}</td>`).join("")}</tr>`).join("")}</tbody></table></div><p><i>Quand le nombre est exactement au milieu, on prend la borne supérieure.</i></p>`},
  {n:"Exercice 17", t:"L'écran de la calculatrice", w:"Sur ton cahier", h:`<p>Je tape ${div[0]} ÷ ${div[1]} sur ma calculatrice. Le résultat n'est pas un nombre décimal : il vaut ${qs}… L'écran affiche 11 chiffres (et la virgule), arrondis. Que lit-on sur l'écran ?</p>`,
   c:`${String(ip).length} chiffre${ip>9?"s":""} avant la virgule, donc ${nd} après : on arrondit au ${nd}<sup>e</sup> chiffre après la virgule. L'écran affiche <b>${aff}</b>.`},
  {n:"Exercice 18", t:"Au restaurant", w:"Sur ton cahier", h:`<p>Trois amis partagent une addition de ${tot} € le plus équitablement possible. 1) Combien chacun paie-t-il, au centime près ? 2) Pourquoi le compte ne tombe-t-il pas juste ?</p>`,
   c:`<p>1) ${tot} ÷ 3 = ${Math.floor(tot/3)},${(()=>{ let r=tot%3,o=""; for(let i=0;i<6;i++){ r*=10; o+=Math.floor(r/3); r%=3; } return o; })()}… Au centime près : <b>${D(cents,2)} €</b>.</p><p>2) ${tot} ÷ 3 ne tombe pas juste (${tot} n'est pas dans la table de 3). 3 × ${D(cents,2)} = ${D(3*cents,2)} € : ${3*cents>tot*100?`${3*cents-tot*100} centime${3*cents-tot*100>1?"s":""} de trop`:`il manque ${tot*100-3*cents} centime${tot*100-3*cents>1?"s":""}`}. Il faut qu'une des trois personnes paie un centime de ${3*cents>tot*100?"moins":"plus"}.</p>`}
]};
return [secA, secB, secC, secD, secE, secF];
};
