/* 6e · chapitre 1 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres */
TRAIN["6e-1"] = function(){
const {ri, pick, shuf, sp, distinct, items, prioSteps} = TR;
const L = n => lettres(n);
const RANG = ["unités","dizaines","centaines","unités de mille","dizaines de mille","centaines de mille","unités de millions","dizaines de millions","centaines de millions","unités de milliards","dizaines de milliards","centaines de milliards"];
const dig = (n,r) => Math.floor(n/Math.pow(10,r))%10;
const P10 = r => Math.pow(10,r);
const add = n => { const p=[]; for(let r=String(n).length-1;r>=0;r--){ const d=dig(n,r); if(d) p.push(sp(d*P10(r))); } return p.join(" + "); };
const mul = n => { const p=[]; for(let r=String(n).length-1;r>=0;r--){ const d=dig(n,r); if(d) p.push(r?`(${d} × ${sp(P10(r))})`:String(d)); } return p.join(" + "); };
const withZeros = d => { let s=""+ri(1,9); for(let i=1;i<d;i++) s+= Math.random()<0.4?0:ri(0,9); return +s; };
const big = () => { let s=""+ri(1,9); for(let i=1;i<11;i++) s+=ri(0,9); return s; };   /* 11 chiffres, en texte */
const digS = (s,r) => +s[s.length-1-r];
const spS = s => s.replace(/\B(?=(\d{3})+(?!\d))/g," ");
/* découpage d'un nombre en classes, pour les corrections : « 7 milliards, 559 millions, 288 mille et 300 unités » */
const classes = n => { const g=Math.floor(n/1e9), m=Math.floor(n/1e6)%1000, k=Math.floor(n/1000)%1000, u=n%1000, p=[];
  if(g) p.push(`${g} milliard${g>1?"s":""}`); if(m) p.push(`${m} million${m>1?"s":""}`); if(k) p.push(`${k} mille`); if(u) p.push(`${u} unité${u>1?"s":""}`);
  return p.length>1 ? p.slice(0,-1).join(", ")+" et "+p[p.length-1] : p[0]; };
/* raison d'une comparaison */
const RG = ["unités","dizaines","centaines","unités de mille","dizaines de mille","centaines de mille","unités de millions","dizaines de millions","centaines de millions"];
const cmpWhy = (a,b) => { const la=String(a).length, lb=String(b).length; if(la!==lb) return `${la} chiffres contre ${lb}`;
  for(let r=la-1;r>=0;r--){ const x=Math.floor(a/10**r)%10, y=Math.floor(b/10**r)%10; if(x!==y) return `même nombre de chiffres ; on compare les ${RG[r]} : ${x} ${x<y?"&lt;":"&gt;"} ${y}`; } return "ce sont les mêmes chiffres, dans le même ordre"; };

/* ---------- A. La numération décimale ---------- */
const n1=big(), r1=shuf([2,7,5,9,4,6,8]).slice(0,4);
const n2=ri(100000,999999), r2=pick([3,4,5]), t2=Math.random()<.5, d2=t2?dig(n2,r2):(dig(n2,r2)+ri(1,8))%10;
const n2b=ri(10000000,99999999), t2b=Math.random()<.5, d2b=t2b?dig(n2b,5):(dig(n2b,5)+ri(1,8))%10;
const q3={dm:ri(1,9), um:0, c:ri(1,9), d:ri(1,9)}; q3.u=Math.min(9,2*q3.dm); if(2*q3.dm>9){ q3.dm=ri(1,4); q3.u=2*q3.dm; }
const ref3=ri(10,99)*1000+q3.c*100+ri(10,99), sol3=q3.dm*10000+q3.c*100+q3.d*10+q3.u;
const secA = {t:"La numération décimale", e:[
  {n:"Exercice 1", t:"La position des chiffres", w:"Sur ton cahier", h:`<p>Dans le nombre ${spS(n1)}, quel est le chiffre : ${items(r1.map(r=>`des ${RANG[r]} ?`)," ",true)}</p>`, c:`<p>Je sépare le nombre en classes de trois chiffres : ${spS(n1)}.</p><p>${items(r1.map(r=>`le chiffre des ${RANG[r]} est <b>${digS(n1,r)}</b>`)," · ",true)}</p>`},
  {n:"Exercice 2", t:"Vrai ou faux ?", w:"Sur ton cahier", h:`<p>${items([`Dans ${sp(n2)}, le chiffre ${d2} est le chiffre des ${RANG[r2]}.`, `Dans ${sp(n2b)}, le chiffre des centaines de mille est ${d2b}.`, `Dans « trois-cent-cinq-millions », on met un « s » à millions.`])}</p>`,
   c:items([t2?`Vrai : le chiffre des ${RANG[r2]} de ${sp(n2)} est bien ${d2}.`:`Faux : le chiffre des ${RANG[r2]} de ${sp(n2)} est ${dig(n2,r2)}.`, t2b?`Vrai : c'est bien ${d2b}.`:`Faux : c'est ${dig(n2b,5)}.`, "Vrai : « million » est un nom, il prend un « s » au pluriel."])},
  {n:"Exercice 3", t:"Qui suis-je ?", w:"Sur ton cahier", h:`<p>Je suis un nombre de cinq chiffres. Mon chiffre des dizaines est ${q3.d}. Mon chiffre des centaines est le même que celui de ${sp(ref3)}. Mon chiffre des dizaines de mille est ${q3.dm}. Mon chiffre des unités est le double de mon chiffre des dizaines de mille. Mon chiffre des unités de mille est 0. Qui suis-je ?</p>`,
   c:`Dizaines de mille : ${q3.dm} · unités de mille : 0 · centaines : ${q3.c} · dizaines : ${q3.d} · unités : 2 × ${q3.dm} = ${q3.u}. Je suis <b>${sp(sol3)}</b>.`}
]};

/* ---------- B. Lire et écrire les grands nombres ---------- */
const a4 = [ri(1,9)*1000000000+ri(100,999)*1000000+ri(100,999)*1000+ri(1,9)*100, ri(100,999)*1000000+ri(10,99)*1000, ri(10,99)*1000000+ri(100,999)*1000];
const e4 = [80, 80+ri(1,9), ri(2,9)*100+80, ri(2,9)*100+ri(1,9), 1000+ri(11,99), ri(11,99)*1000+ri(1,9)*100+ri(1,9)*10, ri(2,9)*1000000+ri(100,999)*1000+ri(11,19)];
const e5 = [ri(2,9)*1000000000+ri(100,999)*1000000+ri(100,999)*1000+ri(1,9)*100, ri(11,99)*1000+ri(11,99), ri(101,999)*1000, ri(101,999)*1000000+ri(11,99)*1000+ri(1,9)*100];
const p1=80+ri(1,9), p2=ri(2,9)*100+ri(1,9), p3=ri(2,9)*1000, p4=ri(2,9)*1000000;
const pieges = [
  [L(p1).replace("quatre-vingt-","quatre-vingts-"), p1, "« vingt » est suivi d'un autre nombre : pas de « s »"],
  [L(p2).replace(/-cent-/,"-cents-"), p2, "« cent » est suivi d'un autre nombre : pas de « s »"],
  [L(p3).replace("mille","milles"), p3, "« mille » ne prend jamais de « s »"],
  [L(p4).replace("millions","million"), p4, "« million » est un nom : il prend un « s » au pluriel"]];
const secB = {t:"Lire et écrire les grands nombres", note:"<b>Rappels :</b> un trait d'union entre tous les mots ; « cent » et « vingt » prennent un « s » quand ils sont multipliés et que rien ne les suit ; « mille » ne prend jamais de « s » ; « million » et « milliard » prennent un « s » au pluriel.", e:[
  {n:"Activité 2", t:"Séparer les classes", w:"Sur ton cahier", h:`<p>Réécris chaque nombre en séparant les classes, puis écris-le en lettres : ${items(a4.map(String))}</p>`, c:items(a4.map(n=>`<b>${sp(n)}</b> : ${L(n)}`))},
  {n:"Exercice 4", t:"Écrire en lettres", w:"Sur ton cahier", h:`<p>Écris ces nombres en lettres : ${items(e4.map(sp),"  ·  ",true)}</p>`, c:items(e4.map(L),"  ·  ",true)},
  {n:"Exercice 5", t:"Écrire en chiffres", w:"Sur ton cahier", h:`<p>Écris ces nombres en chiffres : ${items(e5.map(L),"  ·  ",true)}</p>`, c:`<p>Je repère chaque classe (milliards, millions, mille, unités). Chaque classe s'écrit avec 3 chiffres : je complète avec des zéros si besoin.</p><p>${items(e5.map(n=>`${classes(n)} : <b>${sp(n)}</b>`),"  ·  ",true)}</p>`},
  {n:"Exercice 6", t:"Corrige l'erreur", w:"Sur ton cahier", h:`<p>${items(pieges.map(([w,n])=>`« ${w} » (${sp(n)})`),"  ·  ",true)}</p>`, c:items(pieges.map(([,n,why])=>`${L(n)} : ${why}.`),"  ·  ",true)}
]};

/* ---------- C. Décomposer ---------- */
const e7 = [withZeros(5), withZeros(6), withZeros(9)];
const n8 = withZeros(6), n8b = withZeros(7);
const n9 = ri(10000,99999);
const c10a=ri(101,999), c10b=ri(1001,9999), c10c=ri(10101,99999);
const secC = {t:"Décomposer un nombre", e:[
  {n:"Exercice 7", t:"Décomposer", w:"Sur ton cahier", h:`<p>Décompose ces nombres de deux façons (avec des additions, puis avec des multiplications) : ${items(e7.map(sp),"  ·  ",true)}</p>`,
   c:`<p>${e7.map((n,i)=>`${"abc"[i]}) ${sp(n)} = ${add(n)}<br>${sp(n)} = ${mul(n)}`).join("</p><p>")}</p>`},
  {n:"Exercice 8", t:"Retrouver le nombre", w:"Sur ton cahier", h:`<p>a) ${mul(n8)} = …… En lettres : …… · b) ${add(n8b)} = ……</p>`, c:`a) ${add(n8)} = <b>${sp(n8)}</b> : ${L(n8)} · b) ${add(n8b)} = <b>${sp(n8b)}</b> (${classes(n8b)})`},
  {n:"Exercice 9", t:"Chiffre des… ou nombre de… ?", w:"Sur ton cahier", h:`<p>Pour le nombre ${sp(n9)}, donne le chiffre et le nombre de dizaines, de centaines et d'unités de mille.</p>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Dans ${sp(n9)}</th><th>le chiffre des…</th><th>le nombre de…</th></tr></thead><tbody>${[[1,"dizaines"],[2,"centaines"],[3,"unités de mille"]].map(([r,nm])=>`<tr><th>${nm}</th><td>${dig(n9,r)}</td><td>${sp(Math.floor(n9/P10(r)))}</td></tr>`).join("")}</tbody></table></div>`},
  {n:"Exercice 10", t:"Des problèmes", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> un jardinier plante ${c10a} salades en rangées de 10. Combien de rangées complètes fait-il ?</p><p><b>Problème 2 :</b> on range ${sp(c10b)} feuilles. Combien de paquets complets de 1 000 feuilles peut-on faire ? Et de paquets de 100 ?</p><p><b>Problème 3 :</b> un chocolatier a fabriqué ${sp(c10c)} bonbons. Il remplit d'abord le plus de cartons de 1 000 possible, puis des boîtes de 100 avec le reste, puis des sachets de 10. Combien de cartons, de boîtes et de sachets prépare-t-il ? Reste-t-il des bonbons ?</p>`,
   c:`<p><b>Problème 1 :</b> nombre de dizaines de ${c10a} : <b>${Math.floor(c10a/10)} rangées</b> (il reste ${c10a%10} salade${c10a%10>1?"s":""}).</p><p><b>Problème 2 :</b> <b>${Math.floor(c10b/1000)} paquet${Math.floor(c10b/1000)>1?"s":""} de 1 000</b> et <b>${Math.floor(c10b/100)} paquets de 100</b>.</p><p><b>Problème 3 :</b> <b>${Math.floor(c10c/1000)} cartons</b>, <b>${dig(c10c,2)} boîte${dig(c10c,2)>1?"s":""}</b> et <b>${dig(c10c,1)} sachet${dig(c10c,1)>1?"s":""}</b> ; il reste ${dig(c10c,0)} bonbon${dig(c10c,0)>1?"s":""}. On retrouve les chiffres de ${sp(c10c)}.</p>`}
]};

/* ---------- D. Comparer et ranger ---------- */
const villes = shuf([["Lyon",ri(500,530)*1000+ri(100,999)],["Toulouse",ri(480,510)*1000+ri(100,999)],["Nantes",ri(300,330)*1000+ri(100,999)],["Nice",ri(340,350)*1000+ri(100,999)],["Rennes",ri(210,230)*1000+ri(100,999)],["Brest",ri(130,145)*1000+ri(100,999)],["Angers",ri(150,159)*1000+ri(100,999)],["Le Mans",ri(140,149)*1000+ri(100,999)]]);
const dec = [...villes].sort((a,b)=>b[1]-a[1]);
const c12 = distinct(6, ()=>{ const t=ri(0,2); const a=ri(10000,999999);
  if(t===0){ const b=a+pick([-1,1])*ri(1,9)*pick([1,10,100]); return [a,b]; }
  if(t===1) return [a, ri(1000,9999)]; const s=String(a); const i=ri(0,s.length-2); const b=+(s.slice(0,i)+s[i+1]+s[i]+s.slice(i+2)); return [a,b]; }, x=>x.join());
const cmp = (a,b) => a<b?"&lt;":a>b?"&gt;":"=";
const tags = distinct(5, ()=>String(ri(1,9)*Math.pow(10,ri(0,2))+(Math.random()<.5?ri(0,9):0)), x=>x);
const perm=a=>a.length<=1?[a]:a.flatMap((x,i)=>perm([...a.slice(0,i),...a.slice(i+1)]).map(r=>[x,...r]));
const P13 = perm(tags).sort((x,y)=>x.join("")<y.join("")?-1:1); const mn13=P13[0].join(""), mx13=P13[P13.length-1].join("");
const e14 = [ri(11,99)*10, ri(2,9)*100-1, ri(11,99)*1000-1, ri(2,9)*100000, ri(100,999)*1000+99];
const secD = {t:"Comparer et ranger", e:[
  {n:"Activité 3", t:"Des villes de France", w:"Sur ton cahier", h:`<p>Range ces villes de la plus peuplée à la moins peuplée.</p><div class="scroll"><table class="std"><thead><tr><th>Ville</th><th>Habitants</th></tr></thead><tbody>${villes.map(([v,n])=>`<tr><td>${v}</td><td>${sp(n)}</td></tr>`).join("")}</tbody></table></div><p><i>(nombres inventés pour l'exercice)</i></p>`,
   c:dec.map(([v,n])=>`<b>${v}</b> (${sp(n)})`).join(" &gt; ")},
  {n:"Exercice 12", t:"Comparer", w:"Sur ton cahier", h:`<p>Complète par &lt;, &gt; ou = : ${items(c12.map(([a,b])=>`${sp(a)} …… ${sp(b)}`),"  ·  ",true)}</p>`, c:items(c12.map(([a,b])=>`${sp(a)} ${cmp(a,b)} ${sp(b)} (${cmpWhy(a,b)})`),"  ·  ",true)},
  {n:"Exercice 13", t:"Les étiquettes", w:"Sur ton cahier", h:`<p>Voici cinq étiquettes : <b>${tags.join(" · ")}</b>. En les mettant toutes bout à bout, écris : a) le plus petit nombre possible ; b) le plus grand nombre possible.</p>`,
   c:`<p>Les étiquettes donnent toujours un nombre de ${mn13.length} chiffres : on compare les chiffres de gauche à droite.</p><p>a) On commence par les étiquettes qui donnent les plus petits chiffres : ${P13[0].join(" | ")}, soit <b>${spS(mn13)}</b>.</p><p>b) On commence par les étiquettes qui donnent les plus grands chiffres : ${P13[P13.length-1].join(" | ")}, soit <b>${spS(mx13)}</b>.</p>`},
  {n:"Exercice 14", t:"Avant et après", w:"Sur ton cahier", h:`<p>Écris l'entier précédent et l'entier suivant de : ${items(e14.map(sp),"  ·  ",true)}</p>`, c:items(e14.map(n=>`${sp(n-1)} &lt; ${sp(n)} &lt; ${sp(n+1)}`),"  ·  ",true)}
]};

/* ---------- E. Demi-droites graduées ---------- */
const g15 = [[pick([4,5]), pick([2,3,4,5])], [pick([6,7]), pick([5,10,20])], [pick([7,8]), pick([100,200,500])]];
const axe15 = ([n,s],k) => axis({n, lab:[...Array(n+1)].map((_,i)=>[i, i===0?"0":i===k?sp(i*s):(i===n&&k===n?sp(n*s):"…")])});
const k15 = [g15[0][0], 2, 3];
const s16 = [[10,pick([100,200,500])],[10,pick([3,4,6])],[12,pick([5,7,8])]];
const p16 = s16.map(([n])=>shuf([...Array(n-1)].map((_,i)=>i+1)).slice(0,3).sort((a,b)=>a-b));
const s17 = pick([5,10]), p17 = shuf([1,2,3,4,5,6,7,8,9,10,11]).slice(0,3).sort((a,b)=>a-b);
const s17b = pick([200,300,500]), p17b = shuf([1,2,3,4,5,6,7]).slice(0,3).sort((a,b)=>a-b);
const s18 = pick([100000,300000,500000]), p18 = shuf([1,2,3,4,5,6,7,8]).slice(0,3).sort((a,b)=>a-b);
const LT=["A","B","C","D"], LG=["G","H","I"];
const secE = {t:"Les demi-droites graduées", note:"<b>Rappel :</b> si un point A a pour abscisse 12, on écrit A(12).", e:[
  {n:"Exercice 15", t:"Compléter les graduations", w:"Sur ton cahier", h:`<p>Écris les nombres qui manquent sous les graduations.</p>${g15.map((g,i)=>axe15(g,k15[i])).join("")}`,
   c:items(g15.map(([n,s],i)=>`${sp(k15[i]*s)} est ${k15[i]} graduation${k15[i]>1?"s":""} après 0, donc l'écart est ${sp(k15[i]*s)} ÷ ${k15[i]} = ${s} : ${[...Array(n+1)].map((_,j)=>sp(j*s)).join(", ")}`),"<br>",true)},
  {n:"Exercice 16", t:"Lire des abscisses", w:"Sur ton cahier", h:`<p>Pour chaque demi-droite graduée, calcule l'écart entre deux graduations, puis écris l'abscisse de chaque point.</p>${s16.map(([n,s],i)=>axis({n, lab:[[0,"0"],[n,sp(n*s)]], pts:p16[i].map((k,j)=>[LT[j],k])})).join("")}`,
   c:items(s16.map(([n,s],i)=>`écart = ${sp(n*s)} ÷ ${n} = ${s} : ${p16[i].map((k,j)=>`${LT[j]}(${sp(k*s)})`).join(" ; ")}`),"<br>",true)},
  {n:"Exercice 17", t:"Placer des points", w:"Sur ton cahier", h:`<p>a) Reproduis la demi-droite et place ${p17.map((k,j)=>`${LT[j]}(${sp(k*s17)})`).join(", ")}.</p>${axis({n:12, lab:[[0,"0"],[12,sp(12*s17)]]})}<p>b) Reproduis la demi-droite et place ${p17b.map((k,j)=>`${LG[j]}(${sp(k*s17b)})`).join(", ")}.</p>${axis({n:8, lab:[[0,"0"],[8,sp(8*s17b)]]})}`,
   c:`<p>a) écart = ${sp(12*s17)} ÷ 12 = ${s17}.</p>${axis({n:12, lab:[[0,"0"],[12,sp(12*s17)]], pts:p17.map((k,j)=>[LT[j],k])})}<p>b) écart = ${sp(8*s17b)} ÷ 8 = ${s17b}.</p>${axis({n:8, lab:[[0,"0"],[8,sp(8*s17b)]], pts:p17b.map((k,j)=>[LG[j],k])})}`},
  {n:"Exercice 18", t:"Défi — très grands nombres", w:"Sur ton cahier", h:`${axis({n:9, lab:[[0,"0"],[9,sp(9*s18)]], pts:p18.map((k,j)=>[LT[j],k])})}<p>Calcule l'écart entre deux graduations, puis écris l'abscisse des points A, B et C.</p>`,
   c:`écart = ${sp(9*s18)} ÷ 9 = ${sp(s18)} : ${p18.map((k,j)=>`${LT[j]}(${sp(k*s18)})`).join(" ; ")}`}
]};

/* ---------- F. Priorités opératoires ---------- */
const steps = e => prioSteps(e).join(" = ");
const f1 = distinct(10, ()=>{ const t=ri(0,5), a=ri(2,9), b=ri(2,9), c=ri(2,9);
  if(t===0) return `${ri(2,20)} + ${a} × ${b}`;
  if(t===1) return `${a*b+ri(1,20)} − ${a} × ${b}`;
  if(t===2) return `${a} × ${b} + ${ri(2,20)}`;
  if(t===3) return `${a*b} ÷ ${a} + ${c}`;
  if(t===4) return `${ri(2,20)} + ${a*b} ÷ ${b}`;
  return `${a} × ${b} − ${c*ri(1,3)} ÷ ${c}`; }, x=>x);
const f2 = distinct(10, ()=>{ const t=ri(0,4), a=ri(2,9), b=ri(2,9), c=ri(2,9);
  if(t===0) return `(${a} + ${b}) × ${c}`;
  if(t===1) return `${a} × (${b} + ${c})`;
  if(t===2) return `(${a*c+b*c} − ${b*c}) ÷ ${c}`;
  if(t===3) return `${a*(b+c)+ri(1,20)} − ${a} × (${b} + ${c})`;
  return `(${a} + ${b}) × (${c+ri(1,6)} − ${c})`; }, x=>x);
const f3 = distinct(6, ()=>{ const t=ri(0,5), a=ri(2,9), b=ri(2,9), c=ri(2,9), d=ri(2,6);
  if(t===0) return `${ri(5,20)} + ${a} × (${b+c} − ${c})`;
  if(t===1) return `(${a*d+d} − ${d}) ÷ ${d} + ${b}`;
  if(t===2) return a*b>c*d ? `${a} × ${b} − ${c} × ${d}` : `${c} × ${d} + ${a} × ${b}`;
  if(t===3) return `${a+b*c+ri(1,30)} − (${a} + ${b} × ${c})`;
  if(t===4) return `(${a*d+b} − ${b}) × ${c}`;
  return `${a} × (${b} + ${c}) − ${d*2} ÷ ${d}`; }, x=>x);
const NOMS="ABCDEFGHIJ";
/* calculs nommés : une étape par ligne, chaque ligne commence par « A = » */
const CHN = (X, st) => `<p class="calc">${st.map((l,k)=>`${X} = ${k===st.length-1?`<b>${l}</b>`:l}`).join("<br>")}</p>`;
const CALCS = arr => `<div class="calcs" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr))">${arr.map((st,i)=>`<div>${CHN(NOMS[i],st)}</div>`).join("")}</div>`;
const ENO = (arr, noms=NOMS) => `<div class="calcs">${arr.map((e,i)=>`<span>${noms[i]} = ${e}</span>`).join("")}</div>`;
const f4 = distinct(6, ()=>{ const t=ri(0,4), a=ri(2,9), b=ri(2,9), c=ri(2,9);
  if(t===0) return [`${a} + ${b} × ${c}`, `(${a} + ${b}) × ${c}`];
  if(t===1){ const x=b+ri(2,8); return [`${x} − ${b} × ${c}`, `(${x} − ${b}) × ${c}`]; }
  if(t===2){ const s=b+c; return [`${a*s} ÷ ${b} + ${c}`, `${a*s} ÷ (${b} + ${c})`]; }
  if(t===3){ const x=b+c+ri(2,20); return [`${x} − ${b} + ${c}`, `${x} − (${b} + ${c})`]; }
  const y=c+ri(1,6); return [`${a} × ${y} − ${c}`, `${a} × (${y} − ${c})`]; }, x=>x[0]);
const b5=ri(11,29), c5=ri(3,9), d5=ri(21,49), e5b=ri(11,19), m5=ri(3,9), g5=ri(12,49);
const f5 = [
  [`${b5} × 9 + ${b5} × 1`, [`${b5} × (9 + 1)`, `${b5} × 10`, `${sp(b5*10)}`]],
  [`${d5} × ${m5} − ${d5-10} × ${m5}`, [`(${d5} − ${d5-10}) × ${m5}`, `10 × ${m5}`, `${10*m5}`]],
  [`${c5} × 102`, [`${c5} × 100 + ${c5} × 2`, `${100*c5} + ${2*c5}`, `${sp(102*c5)}`]],
  [`${e5b} × 99`, [`${e5b} × 100 − ${e5b} × 1`, `${sp(100*e5b)} − ${e5b}`, `${sp(99*e5b)}`]],
  [`25 × ${c5} × 4`, [`(25 × 4) × ${c5}`, `100 × ${c5}`, `${sp(100*c5)}`]],
  [`${g5} × 11`, [`${g5} × 10 + ${g5} × 1`, `${10*g5} + ${g5}`, `${sp(11*g5)}`]]];
const OPS=["+","−","×","÷"];
const f6 = distinct(4, ()=>{ let g=0; while(g++<300){ const a=ri(2,20), b=ri(2,9), c=ri(2,9), o1=pick(OPS), o2=pick(OPS); const e=`${a} ${o1} ${b} ${o2} ${c}`;
  if(o1==="÷"&&(a%b)) continue; const st=prioSteps(e); const v=+st[st.length-1]; if(!Number.isInteger(v)||v<0) continue;
  if(o2==="÷"){ const first = (o1==="×"||o1==="÷") ? (o1==="×"?a*b:a/b) : b; if(first%c) continue; }
  return [`${a} ? ${b} ? ${c} = ${v}`, `${e} = ${v}`]; } return ["2 ? 3 ? 4 = 14","2 + 3 × 4 = 14"]; }, x=>x[0]);
const secF = {t:"Les priorités opératoires", note:"<b>Rappel :</b> les parenthèses d'abord, puis × et ÷, puis + et −. À priorité égale, de gauche à droite.", e:[
  {n:"Exercice 19", t:"Sans parenthèses", w:"Sur ton cahier", h:`<p>Calcule en écrivant une étape par ligne.</p>${ENO(f1)}`, c:`<p>Je calcule d'abord les multiplications et les divisions, puis les additions et les soustractions.</p>${CALCS(f1.map(prioSteps))}`},
  {n:"Exercice 20", t:"Avec des parenthèses", w:"Sur ton cahier", h:`<p>Calcule en écrivant une étape par ligne.</p>${ENO(f2)}`, c:`<p>Je calcule d'abord dans les parenthèses, puis les multiplications et les divisions, puis les additions et les soustractions.</p>${CALCS(f2.map(prioSteps))}`},
  {n:"Exercice 21", t:"En détaillant les étapes", w:"Sur ton cahier", h:`<p>Calcule en écrivant une étape par ligne.</p>${ENO(f3)}`,
   c:CALCS(f3.map(prioSteps))},
  {n:"Exercice 22", t:"Placer des parenthèses", w:"Sur ton cahier", h:`<p>Recopie et place des parenthèses pour que l'égalité soit vraie : ${items(f4.map(([s,w])=>`${s} = ${TR.evalExpr(w)}`),"  ·  ",true)}</p>`,
   c:items(f4.map(([,w])=>steps(w)),"  ·  ",true)},
  {n:"Exercice 23", t:"Calculer astucieusement", w:"Sur ton cahier", h:`<p><b>Exemple :</b></p><p class="calc">A = 13 × 7 + 13 × 3<br>A = 13 × (7 + 3)<br>A = 13 × 10<br>A = 130</p><p>Calcule de la même façon, en écrivant une étape par ligne.</p>${ENO(f5.map(x=>x[0]),"BCDEFG")}`,
   c:`<div class="calcs">${f5.map((x,i)=>`<div>${CHN("BCDEFG"[i],[x[0],...x[1]])}</div>`).join("")}</div>`},
  {n:"Exercice 24", t:"Les signes manquants", w:"Sur ton cahier", h:`<p>Remplace chaque ? par +, −, × ou ÷ : ${items(f6.map(x=>x[0]),"  ·  ",true)}</p>`, c:items(f6.map(x=>x[1]+" (une solution possible)"),"  ·  ",true)}
]};
return [secA, secB, secC, secD, secE, secF];
};
