/* 6e · chapitre 3 — fiche d'entraînement : mêmes exercices que la fiche de classe, autres nombres */
TRAIN["6e-3"] = function(){
const {ri, pick, shuf, sp, gcd, distinct, items, frName} = TR;
const {verre, segment, pendule, rectN} = window.FIG3;
const F = (a,b) => `{${a}/${b===1000?"1 000":b}}`;
const LES = (a,b) => a===1?(b===2?"la":"le"):"les";
const cg = it => `<div class="cgrid">${it.map(([l,f,t])=>`<figure><figcaption><b>${l}</b> ${t||""}</figcaption>${f}</figure>`).join("")}</div>`;
const lab = (l,f) => `<figure>${f}<figcaption>${l}</figcaption></figure>`;
const LT = "abcdefghij";
const unequal = (n) => { let w; do{ w=[...Array(n)].map(()=>ri(30,110)); }while(Math.max(...w)-Math.min(...w)<35); const s=w.reduce((a,b)=>a+b,0); return w.map(x=>Math.round(x*240/s)); };

/* ======= A. Lire et représenter ======= */
const f1 = shuf([ ()=>{ const d=pick([5,6,8]), k=ri(1,d-1); return [discs(d,k), k, d]; },
  ()=>{ const d=pick([3,4,6]), k=ri(1,d-1); return [discs(d,k), k, d]; },
  ()=>{ const d=pick([5,6,7,8]), k=ri(1,d-1); return [grids(d,1,k,1,30), k, d]; },
  ()=>{ const c=pick([3,4]), r=pick([2,3]), k=ri(1,c*r-1); return [grids(c,r,k,1,30), k, c*r]; },
  ()=>{ const d=pick([2,3,4]), k=ri(1,d-1); return [grids(1,d,k,1,30), k, d]; },
  ()=>{ const d=pick([9,10]), k=ri(1,d-1); return [discs(d,k), k, d]; } ]).map(f=>f());
const a2=ri(2,9), b2=a2+ri(1,6);
const f2b = distinct(3, ()=>{ const b=pick([2,3,4,5,6,8,10]); return [ri(1,b-1), b]; });
const f2c = distinct(3, ()=>{ const b=pick([3,4,5,6,7,9]); return [ri(1,2*b), b]; });
const f2d = distinct(3, ()=>{ const b=pick([3,4,5,7]); return [ri(2,b+2), b]; });
const dec = (a,b) => `${F(a,b)} = ${Array(a).fill(F(1,b)).join(" + ")} = ${a} × ${F(1,b)}`;
/* Ex 3 : QCM */
const b3=pick([3,4,5]), a3=ri(1,b3-1);
const q3 = shuf([
  {f:rectN(b3,a3), ok:true, why:`${b3} parts égales, ${a3} coloriée${a3>1?"s":""}`},
  {f:rectN(2*b3,2*a3), ok:true, why:`${2*a3} parts sur ${2*b3}, et ${F(2*a3,2*b3)} = ${F(a3,b3)}`},
  {f:parts(unequal(b3),[...Array(a3)].map((_,i)=>i)), ok:false, why:"les parts ne sont pas égales"},
  {f:rectN(b3+1,a3), ok:false, why:`c'est ${F(a3,b3+1)}`} ]);
/* Ex 4 : représenter */
const t4=[pick([3,4,6,8]),0], v4=[pick([3,4,5]),0], s4=pick([3,4,5]), h4=ri(1,3), r4=[pick([5,6,8]),0], k4=[pick([6,8,10]),0];
t4[1]=ri(1,t4[0]-1); v4[1]=ri(1,v4[0]-1); r4[1]=ri(1,r4[0]-1); k4[1]=ri(1,k4[0]-1);
const hTxt = ["","un quart d'heure","une demi-heure","trois quarts d'heure"][h4], hFr=["",F(1,4),F(2,4),F(3,4)][h4];
/* Ex 5 : partage ≠ dénominateur */
const [a5,b5]=pick([[2,3],[3,4],[5,6],[1,2],[1,3],[1,4],[5,12],[7,12]]), [c5,d5]=pick([[3,4],[1,2],[1,4],[5,8]]), [e5,g5]=pick([[1,2],[2,3],[1,3],[5,6]]), [h5,i5]=pick([[2,5],[1,2],[3,5],[4,5],[3,10]]);
const eq = (a,b,N) => { const k=N/b; return k===1?`${F(a,b)}`:`${F(a,b)} = ${F(`${a} × ${k}`,`${b} × ${k}`)} = ${F(a*k,N)}`; };
const secA = {t:"Lire et représenter une fraction", e:[
  {n:"Exercice 1", t:"Quelle fraction a été coloriée ?", w:"Sur ton cahier", h:`<p>Dans chaque cas, écris la fraction de la surface de la figure qui a été coloriée.</p><div class="figs">${f1.map(([f],i)=>lab(LT[i],f)).join("")}</div>`,
   c:`<p>Je compte les parts égales (le dénominateur), puis les parts coloriées (le numérateur).</p><p>${items(f1.map(([,k,d])=>`${d} parts égales, ${k} coloriée${k>1?"s":""} : ${F(k,d)}`))}</p>`},
  {n:"Exercice 2", t:"Lire et écrire une fraction", w:"Sur ton cahier", h:`<p>a) Dans la fraction ${F(a2,b2)}, quel est le numérateur ? le dénominateur ?</p><p>b) Écris en lettres : ${f2b.map(([a,b])=>F(a,b)).join(" · ")}</p><p>c) Écris en chiffres : ${f2c.map(([a,b])=>frName(a,b)).join(" · ")}</p><p>d) Complète comme dans l'exemple ${dec(3,4)} : &nbsp; ${f2d.map(([a,b])=>F(a,b)).join(" · ")}</p>`,
   c:`<p>a) Numérateur : ${a2} ; dénominateur : ${b2}.</p><p>b) ${f2b.map(([a,b])=>frName(a,b)).join(" · ")}</p><p>c) ${f2c.map(([a,b])=>F(a,b)).join(" · ")}</p><p>d) ${f2d.map(([a,b])=>dec(a,b)).join(" · ")}</p>`},
  {n:"Exercice 3", t:"QCM", w:"Sur ton cahier", h:`<p>Dans quels cas a-t-on colorié les ${F(a3,b3)} de la surface du rectangle ?</p><div class="figs">${q3.map((x,i)=>lab(LT[i],x.f)).join("")}</div>`,
   c:`<p>Les cas ${q3.map((x,i)=>x.ok?LT[i]:"").filter(Boolean).join(" et ")}.</p><p>${q3.map((x,i)=>`${LT[i]}) ${x.ok?"oui":"non"} : ${x.why}`).join(" · ")}</p>`},
  {n:"Exercice 4", t:"Représenter la fraction d'une quantité", w:"Sur ton cahier", h:`
   <div class="retenir" data-l="Comment faire ?"><ol><li>Je regarde le nombre du <b>bas</b> : je partage la figure en autant de <b>parts égales</b>.</li><li>Je regarde le nombre du <b>haut</b> : je hachure autant de parts.</li></ol></div>
   ${cg([["a)",discs(1,0),`Hachure ${LES(t4[1],t4[0])} ${F(t4[1],t4[0])} de la tarte.`],["b)",verre(1,0),`Le verre est rempli ${v4[1]===1?"au":"aux"} ${F(v4[1],v4[0])}. Hachure l'eau.`],["c)",segment(1,0),`Repasse en couleur le ${F(1,s4)} du segment [AB].`],["d)",pendule(0),`Hachure ${hTxt} sur la pendule.`],["e)",rectN(1,0),`Hachure ${LES(r4[1],r4[0])} ${F(r4[1],r4[0])} du rectangle.`],["f)",discs(1,0),`Hachure ${LES(k4[1],k4[0])} ${F(k4[1],k4[0])} de la quiche.`]])}`,
   c:cg([["a)",discs(t4[0],t4[1]),`${t4[0]} parts égales, j'en hachure ${t4[1]}.`],["b)",verre(v4[0],v4[1]),`${v4[0]} parts égales sur la hauteur, l'eau occupe ${v4[1]===1?"la part":"les "+v4[1]} du bas.`],["c)",segment(s4,1),`${s4} parts égales, je repasse la première.`],["d)",pendule(h4),`Une heure en 4 parts : ${hTxt} = ${hFr} d'heure.`],["e)",rectN(r4[0],r4[1]),`${r4[0]} parts égales, j'en hachure ${r4[1]}.`],["f)",discs(k4[0],k4[1]),`${k4[0]} parts égales, j'en hachure ${k4[1]}.`]])},
  {n:"Exercice 5", t:"Quand le partage ne correspond pas au dénominateur", w:"Sur ton cahier", h:`<p>Colorie : a) ${LES(a5,b5)} ${F(a5,b5)} du rectangle · b) ${LES(c5,d5)} ${F(c5,d5)} du rectangle · c) ${LES(e5,g5)} ${F(e5,g5)} du disque · d) ${LES(h5,i5)} ${F(h5,i5)} de la bande.</p>
   <div class="figs">${lab("a",grids(4,3,0))}${lab("b",grids(4,2,0))}${lab("c",discs(6,0))}${lab("d",grids(10,1,0,1,22))}</div>`,
   c:`<p>La figure n'a pas le bon nombre de parts : on cherche une fraction égale avec le bon dénominateur.</p>${cg([["a)",grids(4,3,a5*12/b5),`${eq(a5,b5,12)} : ${a5*12/b5} carreaux sur 12.`],["b)",grids(4,2,c5*8/d5),`${eq(c5,d5,8)} : ${c5*8/d5} carreaux sur 8.`],["c)",discs(6,e5*6/g5),`${eq(e5,g5,6)} : ${e5*6/g5} parts sur 6.`],["d)",grids(10,1,h5*10/i5,1,22),`${eq(h5,i5,10)} : ${h5*10/i5} cases sur 10.`]])}`}
]};

/* ======= B. Plus d'une unité ======= */
const f6 = shuf([()=>{ const d=pick([4,6]), k=ri(d+1,2*d-1); return [discs(d,k), k, d]; }, ()=>{ const d=pick([3,5]), k=ri(d+1,2*d); return [grids(d,1,k,2,30), k, d]; }, ()=>{ const d=pick([2,4]), k=ri(d+1,3*d-1); return [grids(d,1,k,3,30), k, d]; }, ()=>{ const d=pick([3,8]), k=ri(d+1,2*d-1); return [discs(d,k), k, d]; }]).map(f=>f());
const f7 = [pick([6,8]),pick([3,4]),pick([3,5]),pick([4,6])].map(d=>[ri(d+1,3*d-1), d]);
const ub = (k,d) => Math.ceil(k/d);
const b8=pick([5,6,8]), a8=ri(2,b8-1);
const q8 = shuf([{f:discs(b8,a8), ok:true, why:`${b8} parts égales dans un disque, ${a8} coloriées`},{f:discs(a8,b8), ok:false, why:`les disques sont partagés en ${a8} : on a colorié ${F(b8,a8)}`},{f:discs(2*b8,2*a8), ok:true, why:`${F(2*a8,2*b8)} = ${F(a8,b8)}`}]);
const secB = {t:"Plus d'une unité", e:[
  {n:"Exercice 6", t:"Quelle fraction a été coloriée ?", w:"Sur ton cahier", h:`<p>Chaque figure entière est une unité. Écris la fraction d'unité coloriée.</p><div class="figs">${f6.map(([f],i)=>lab(LT[i],f)).join("")}</div>`,
   c:items(f6.map(([,k,d])=>{ const e=Math.floor(k/d), r=k%d; return r ? `${F(k,d)} : ${e} unité${e>1?"s":""} entière${e>1?"s":""} et ${F(r,d)}` : `${F(k,d)} = ${e}`; }))},
  {n:"Exercice 7", t:"Représenter une fraction plus grande que 1", w:"Sur ton cahier", h:`
   <div class="retenir" data-l="Exemple"><p>Pour ${F(5,4)} d'une pizza : chaque pizza est partagée en <b>4</b> et il faut hachurer <b>5</b> parts. Une pizza ne suffit pas : je dessine une deuxième pizza.</p><div class="figs" style="margin-top:8px">${discs(4,5)}</div></div>
   <p>Dessine et hachure : ${items([`les ${F(...f7[0])} d'un disque`,`les ${F(...f7[1])} d'un rectangle`,`les ${F(...f7[2])} d'une bande`,`les ${F(...f7[3])} d'un disque`],"  ·  ",true)}</p>`,
   c:cg([["a)",discs(f7[0][1],f7[0][0]),""],["b)",grids(f7[1][1],1,f7[1][0],ub(...f7[1]),26),""],["c)",grids(f7[2][1],1,f7[2][0],ub(...f7[2]),22),""],["d)",discs(f7[3][1],f7[3][0]),""]].map(([l,f],i)=>{ const [k,d]=f7[i]; return [l,f,`${F(k,d)} = ${Math.floor(k/d)} unité${Math.floor(k/d)>1?"s":""}${k%d?` et ${F(k%d,d)}`:""}.`]; }))},
  {n:"Exercice 8", t:"Attention aux pièges !", w:"Sur ton cahier", h:`<p>Dans quelle(s) situation(s) a-t-on colorié les ${F(a8,b8)} d'un disque ?</p><div class="figs">${q8.map((x,i)=>lab(LT[i],x.f)).join("")}</div>`,
   c:`<p>${q8.map((x,i)=>`${LT[i]}) ${x.ok?"oui":"non"} : ${x.why}`).join(" · ")}</p>`}
]};

/* ======= C. Fractions égales ======= */
const f9 = distinct(9, ()=>{ const t=ri(0,2); let a, b; do{ b=ri(2,9); a=ri(1,b+3); const g=gcd(a,b); a/=g; b/=g; }while(b<2); const k=ri(2,9);
  if(t===0) return {h:`${F(a,b)} = ${F("…",b*k)}`, c:`${F(a,b)} = ${F(`${a} × ${k}`,`${b} × ${k}`)} = ${F(a*k,b*k)}`};
  if(t===1) return {h:`${F(a*k,b*k)} = ${F("…",b)}`, c:`${F(a*k,b*k)} = ${F(`${a*k} ÷ ${k}`,`${b*k} ÷ ${k}`)} = ${F(a,b)}`};
  return {h:`${F(a,b)} = ${F(a*k,"…")}`, c:`${F(a,b)} = ${F(`${a} × ${k}`,`${b} × ${k}`)} = ${F(a*k,b*k)}`}; }, x=>x.h);
const f10 = distinct(8, ()=>{ let b=ri(3,10), a=ri(1,b-1); const g0=gcd(a,b); a/=g0; b/=g0; const g=ri(2,12); return [a*g,b*g,a,b,g]; }, x=>x[0]+"/"+x[1]);
const T11 = shuf([[1,2],[2,3],[3,4],[2,5],[3,5],[4,5],[5,6]]).slice(0,3);
const f11 = T11.map(([a,b])=>[[a,b], shuf([2,3,4,5,6,7]).slice(0,ri(2,3)).map(k=>[a*k,b*k])]);
const all11 = shuf(f11.flatMap(([,l])=>l));
const [a12,b12]=pick([[3,4],[2,3],[2,5],[3,5],[1,2]]), k12=ri(2,4);
const secC = {t:"Fractions égales", e:[
  {n:"Exercice 9", t:"Compléter des égalités", w:"Sur ton cahier", h:`<p>Complète : ${items(f9.map(x=>x.h),"  ·  ",true)}</p>`, c:items(f9.map(x=>x.c),"  ·  ",true)},
  {n:"Exercice 10", t:"Simplifier au maximum", w:"Sur ton cahier", h:`<p>Exemple : ${F(18,24)} = ${F(9,12)} = ${F(3,4)}</p><p>${items(f10.map(([x,y])=>F(x,y)),"  ·  ",true)}</p>`,
   c:items(f10.map(([x,y,a,b,g])=>`${F(x,y)} = ${F(`${x} ÷ ${g}`,`${y} ÷ ${g}`)} = ${F(a,b)} (on divise par ${g})`),"  ·  ",true)},
  {n:"Exercice 11", t:"Ranger des fractions égales", w:"Sur ton cahier", h:`<p>Range ces fractions dans trois groupes : égales à ${f11.map(([[a,b]])=>F(a,b)).join(", égales à ")}.</p><p>${all11.map(([a,b])=>F(a,b)).join(" · ")}</p>`,
   c:`<p>Je simplifie chaque fraction.</p>${f11.map(([[a,b],l])=>`<p>${l.map(([x,y])=>`${F(x,y)} = ${F(a,b)} (÷ ${x/a})`).join(" · ")}</p>`).join("")}${f11.map(([[a,b],l])=>`<p><b>Égales à ${F(a,b)} :</b> ${l.map(([x,y])=>F(x,y)).join(", ")}.</p>`).join("")}`},
  {n:"Exercice 12", t:"Qui a raison ?", w:"Sur ton cahier", h:`<p>Léa a mangé les ${F(a12*k12,b12*k12)} d'une tarte. Hugo a mangé les ${F(a12,b12)} d'une tarte identique. Hugo affirme : « J'ai mangé moins que Léa, car ${a12} est plus petit que ${a12*k12}. » A-t-il raison ? Justifie à l'aide d'une propriété du cours.</p>`,
   c:`Non. ${F(a12,b12)} = ${F(`${a12} × ${k12}`,`${b12} × ${k12}`)} = ${F(a12*k12,b12*k12)} : une fraction ne change pas si on multiplie son numérateur et son dénominateur par un même nombre. Léa et Hugo ont mangé la même quantité de tarte.`}
]};

/* ======= D. Demi-droite graduée ======= */
const d13a=pick([3,4,5]), p13a=shuf([...Array(2*d13a-1)].map((_,i)=>i+1).filter(i=>i%d13a)).slice(0,3).sort((a,b)=>a-b);
const d13b=pick([6,8]), p13b=shuf([...Array(4*d13b-1)].map((_,i)=>i+1).filter(i=>i%d13b)).slice(0,3).sort((a,b)=>a-b);
const D14=pick([6,10,12]), dens14={6:[2,3],10:[2,5],12:[2,3,4,6]}[D14];
const f14 = distinct(3, ()=>{ const b=pick(dens14); let a; do{ a=ri(1,2*b-1); }while(a===b); return [a,b]; }, x=>x[0]*D14/x[1]);
let k14; do{ k14=ri(1,2*D14-1); }while(k14===D14);
const g14=gcd(k14,D14), A14=[...(g14>1?[[k14/g14,D14/g14]]:[]), [2*k14,2*D14], [3*k14,3*D14], [4*k14,4*D14]].slice(0,3);
const name14={6:"sixièmes",10:"dixièmes",12:"douzièmes"}[D14];
const d15 = shuf([3,4,5,6,8,10]).slice(0,4), p15 = d15.map(d=>{ let p; do{ p=ri(1,2*d-1); }while(p===d); return p; });
const NL=["A","B","C"], NL4=["A","B","C","D"];
const secD = {t:"Placer une fraction sur une demi-droite graduée", e:[
  {n:"Exercice 13", t:"Placer des fractions", w:"Sur ton cahier", h:`<p>Reproduis chaque demi-droite et place les nombres.</p><p>a) ${p13a.map(k=>F(k,d13a)).join(" ; ")}</p>${fline(2,d13a)}<p>b) ${p13b.map(k=>F(k,d13b)).join(" ; ")}</p>${fline(4,d13b)}`,
   c:`<p>a) L'unité est partagée en ${d13a} : ${p13a.map((k,i)=>`${NL[i]}(${F(k,d13a)}) à la ${k}<sup>${k===1?"re":"e"}</sup> graduation`).join(", ")}.</p>${fline(2,d13a,p13a.map((k,i)=>[NL[i],k]))}<p>b) L'unité est partagée en ${d13b} : ${p13b.map((k,i)=>`${NL[i]}(${F(k,d13b)}) à la ${k}<sup>${k===1?"re":"e"}</sup> graduation`).join(", ")}.</p>${fline(4,d13b,p13b.map((k,i)=>[NL[i],k]))}`},
  {n:"Exercice 14", t:"Quand la graduation ne correspond pas au dénominateur", w:"Sur ton cahier", h:`<p>a) Cette demi-droite est graduée en ${name14}. Place les nombres ${f14.map(([a,b])=>F(a,b)).join(" ; ")}. Transforme d'abord les fractions.</p>${fline(2,D14)}<p>b) Écris trois fractions égales à l'abscisse du point A.</p>${fline(2,D14,[["A",k14]])}`,
   c:`<p>a) ${f14.map(([a,b])=>`${F(a,b)} = ${F(a*D14/b,D14)} : graduation ${a*D14/b}`).join(" · ")}</p>${fline(2,D14,f14.map(([a,b],i)=>[NL[i],a*D14/b]))}<p>b) A(${F(k14,D14)}). Par exemple : ${A14.map(([a,b])=>F(a,b)).join(", ")}.</p>`},
  {n:"Exercice 15", t:"Lire l'abscisse d'un point", w:"Sur ton cahier", h:`<p>Écris l'abscisse de chacun des points A, B, C et D sous forme de fraction.</p>${d15.map((d,i)=>fline(2,d,[[NL4[i],p15[i]]])).join("")}`,
   c:items(d15.map((d,i)=>`l'unité est partagée en ${d} parts égales, ${NL4[i]} est à la ${p15[i]}<sup>${p15[i]===1?"re":"e"}</sup> graduation : ${NL4[i]}(${F(p15[i],d)})`))}
]};

/* ======= E. Comparer à 1 et nombre mixte ======= */
const f16 = shuf([...distinct(6, ()=>{ const d=ri(2,10), e=ri(1,6), r=ri(1,d-1); return [e*d+r,d]; }, x=>x.join("/")), ...distinct(2, ()=>{ const d=ri(3,12); return [ri(1,d-1),d]; }, x=>x.join("/"))]);
const mix = ([n,d]) => `${F(n,d)} = ${F(n-n%d,d)} + ${F(n%d,d)} = ${Math.floor(n/d)} + ${F(n%d,d)}, donc ${Math.floor(n/d)} &lt; ${F(n,d)} &lt; ${Math.floor(n/d)+1}`;
const f17 = distinct(4, ()=>{ const d=ri(2,10), e=ri(1,9), r=ri(1,d-1); return [e*d+r,d]; }, x=>x.join("/"));
const f18 = distinct(4, ()=>{ const d=ri(2,9), e=ri(1,4); return [e, ri(1,d-1), d]; }, x=>x.join("/"));
const secE = {t:"Comparer à 1 et nombre mixte", note:`Exemple : ${F(7,4)} = 1 + ${F(3,4)}, donc 1 &lt; ${F(7,4)} &lt; 2.`, e:[
  {n:"Exercice 16", t:"Des fractions supérieures à 1", w:"Sur ton cahier", h:`<p>${f16.map(([a,b])=>F(a,b)).join(" · ")}</p><p>a) Quelles fractions sont supérieures à 1 ? b) Écris chacune comme la somme d'un entier et d'une fraction inférieure à 1, puis encadre-la entre deux entiers consécutifs.</p>`,
   c:`<p>a) ${f16.filter(([a,b])=>a>b).map(([a,b])=>F(a,b)).join(", ")} (le numérateur est plus grand que le dénominateur).</p><p>b) ${f16.filter(([a,b])=>a>b).map(mix).join(" · ")}</p>`},
  {n:"Exercice 17", t:"Encadrer entre deux entiers consécutifs", w:"Sur ton cahier", h:`<p>${items(f17.map(([a,b])=>`…… &lt; ${F(a,b)} &lt; ……`),"  ·  ",true)}</p>`,
   c:items(f17.map(([a,b])=>`${F(a,b)} = ${F(a-a%b,b)} + ${F(a%b,b)} = ${Math.floor(a/b)} + ${F(a%b,b)}, donc ${Math.floor(a/b)} &lt; ${F(a,b)} &lt; ${Math.floor(a/b)+1}`),"  ·  ",true)},
  {n:"Exercice 18", t:"Du nombre mixte à la fraction", w:"Sur ton cahier", h:`<div class="retenir" data-l="Comment faire ?"><p>2 + ${F(1,3)} : 2 unités, c'est ${F(6,3)} (car 2 × 3 = 6). Donc 2 + ${F(1,3)} = ${F(6,3)} + ${F(1,3)} = ${F(7,3)}.</p></div>
   <p>Écris chaque nombre sous la forme d'une seule fraction : ${items(f18.map(([e,a,d])=>`${e} + ${F(a,d)}`),"  ·  ",true)}</p>`,
   c:items(f18.map(([e,a,d])=>`${e} = ${F(e*d,d)} (${e} × ${d} = ${e*d}), donc ${e} + ${F(a,d)} = ${F(e*d,d)} + ${F(a,d)} = ${F(e*d+a,d)}`),"  ·  ",true)}
]};

/* ======= F. Fractions décimales ======= */
const f19a = shuf([[ri(1,9),10],[ri(11,99),100],[ri(1,999),1000],[ri(11,19),10],[ri(2,9),pick([3,4,7])],[10,pick([3,7,9])],[ri(1,9),pick([20,25,50])]]);
const f19b = [[ri(2,9),10],[ri(11,99),100],[ri(2,9),1000]], f19c = [[ri(2,9),10],[ri(11,19),100],[ri(2,9),1000]];
const name = ([a,b]) => `${lettres(a)} ${a>1?TR.DEN[b][1]:TR.DEN[b][0]}`;
const t20 = [ri(1,9),ri(1,9)], t20b=ri(11,99); let t20c; do{ t20c=ri(11,99); }while(t20c===t20b || t20c%10===0); const t20d=ri(101,999), t20e=[ri(1,9),ri(1,9)];
const f21 = [...distinct(2,()=>ri(11,99)).map(n=>[n,10]), ...distinct(3,()=>ri(101,999)).map(n=>[n,100]), [ri(1001,9999),1000]];
const decomp = (n,b) => { const s=[]; const e=Math.floor(n/b); let r=n%b; if(e) s.push(String(e)); const parts=b===10?[10]:b===100?[10,100]:[10,100,1000]; parts.forEach(p=>{ const q=Math.floor(r*p/b); r-=q*b/p; s.push(F(q,p)); }); return `${F(n,b)} = ${s.join(" + ")}`; };
/* décomposition détaillée en trois lignes : découpage, conversions (« Or … »), résultat (« Donc … ») */
const FS = (a,b) => F(sp(a),b);
const NOMS = {10:"dixièmes",100:"centièmes",1000:"millièmes"};
const decSteps = (n,b) => { const e=Math.floor(n/b), ps=b===10?[10]:b===100?[10,100]:[10,100,1000]; let r=n%b;
  const dg=ps.map(p=>{ const q=Math.floor(r*p/b); r-=q*b/p; return [q,p]; });
  const cut=[...(e?[FS(e*b,b)]:[]), ...dg.filter(([q])=>q).map(([q,p])=>FS(q*b/p,b))];
  const or=[...(e?[`${FS(e*b,b)} = ${e}`]:[]), ...dg.filter(([q,p])=>q && p!==b).map(([q,p])=>`${FS(q*b/p,b)} = ${F(q,p)}`)];
  const zero=dg.filter(([q])=>!q).map(([,p])=>p);
  const fin=`${FS(n,b)} = ${[...(e?[String(e)]:[]), ...dg.map(([q,p])=>F(q,p))].join(" + ")}`;
  const l=(cut.length===1&&cut[0]===FS(n,b))?[]:[`${FS(n,b)} = ${cut.join(" + ")}.`];
  const l2=(or.length?`${l.length?"Or ":""}${or.length>1?or.slice(0,-1).join(", ")+" et "+or[or.length-1]:or[0]}.`:"")+(zero.length?`${or.length?" ":""}Il n'y a pas de ${zero.map(p=>NOMS[p]).join(" ni de ")} : on écrit ${zero.map(p=>F(0,p)).join(" et ")}.`:"");
  if(l2) l.push(l2);
  l.push(`Donc ${fin}.`);
  return l.join("<br>"); };
const secF = {t:"Fractions décimales", e:[
  {n:"Exercice 19", t:"Reconnaître une fraction décimale", w:"Sur ton cahier", h:`<p>a) Lesquelles sont des fractions décimales ? ${f19a.map(([a,b])=>F(a,b)).join(" · ")}</p><p>b) Écris en lettres : ${f19b.map(([a,b])=>F(a,b)).join(" · ")}</p><p>c) Écris en fraction : ${f19c.map(name).join(" · ")}</p>`,
   c:`<p>a) ${f19a.filter(([,b])=>[10,100,1000].includes(b)).map(([a,b])=>F(a,b)).join(", ")} (dénominateur 10, 100 ou 1 000)</p><p>b) ${f19b.map(name).join(" · ")}</p><p>c) ${f19c.map(([a,b])=>F(a,b)).join(" · ")}</p>`},
  {n:"Exercice 20", t:"Décomposer une fraction décimale", w:"Sur ton cahier", h:`<p>Complète : ${items([`${F(t20[0],10)} + ${F(t20[1],100)} = ${F("……",100)}`, `${F(t20b,100)} = ${F("…",10)} + ${F("…",100)}`, `${F(t20c,100)} = ${F("…",10)} + ${F("…",100)}`, `${F(t20d,1000)} = ${F("…",10)} + ${F("…",100)} + ${F("…",1000)}`, `${F(t20e[0],10)} + ${F(t20e[1],1000)} = ${F("……",1000)}`],"  ·  ",true)}</p>`,
   c:`<p>À retenir : ${F(1,10)} = ${F(10,100)} = ${F(100,1000)} et ${F(1,100)} = ${F(10,1000)}.</p>`+[`J'écris les dixièmes en centièmes : ${F(t20[0],10)} = ${F(`${t20[0]} × 10`,`10 × 10`)} = ${F(t20[0]*10,100)}.<br>Donc ${F(t20[0],10)} + ${F(t20[1],100)} = ${F(t20[0]*10,100)} + ${F(t20[1],100)} = ${F(t20[0]*10+t20[1],100)}.`, decSteps(t20b,100), decSteps(t20c,100), decSteps(t20d,1000), `J'écris les dixièmes en millièmes : ${F(t20e[0],10)} = ${F(`${t20e[0]} × 100`,`10 × 100`)} = ${F(t20e[0]*100,1000)}.<br>Donc ${F(t20e[0],10)} + ${F(t20e[1],1000)} = ${F(t20e[0]*100,1000)} + ${F(t20e[1],1000)} = ${F(t20e[0]*100+t20e[1],1000)}.`].map((x,i)=>`<p>${LT[i]}) ${x}</p>`).join("")},
  {n:"Exercice 21", t:"Fractions décimales supérieures à 1", w:"Sur ton cahier", h:`<p>Exemple : ${F(235,100)} = 2 + ${F(3,10)} + ${F(5,100)}</p><p>${items(f21.map(([a,b])=>F(sp(a),sp(b))),"  ·  ",true)}</p>`,
   c:`<p>À retenir : ${F(10,10)} = 1, ${F(100,100)} = 1 et ${F("1 000",1000)} = 1.</p>`+f21.map(([a,b],i)=>`<p>${LT[i]}) ${decSteps(a,b)}</p>`).join("")}
]};

/* ======= G. Pourcentages ======= */
const p22 = distinct(3, ()=>ri(3,97)), c22 = pick([20,30,40,60,70]);
const f23 = distinct(6, ()=>pick([[1,2],[1,4],[3,4],[1,5],[2,5],[3,5],[4,5],[1,10],[3,10],[7,10],[9,10],[1,20],[3,20],[1,25],[2,25],[1,50]]), x=>x.join("/"));
const secG = {t:"Pourcentages", e:[
  {n:"Exercice 22", t:"Pourcentages et quadrillages", w:"Sur ton cahier", h:`<p>Pour les trois premiers quadrillages, écris la part coloriée sous forme de fraction, puis de pourcentage. Dans le dernier, colorie ${c22} %.</p><div class="figs">${p22.map((p,i)=>lab(LT[i],grids(10,10,p,1,13))).join("")}${lab("d",grids(10,10,0,1,13))}</div>`,
   c:`<p>${p22.map((p,i)=>`${LT[i]}) ${p} carreaux sur 100 : ${F(p,100)} = ${p} %`).join(" · ")}</p><p>d) ${c22} % = ${F(c22,100)} : je colorie ${c22} carreaux sur 100, par exemple ${c22/10} lignes de 10.</p>${grids(10,10,c22,1,14)}`},
  {n:"Exercice 23", t:"D'une fraction à un pourcentage", w:"Sur ton cahier", h:`<p>Exemple : ${F(1,2)} = ${F(50,100)} = 50 %</p><p>${items(f23.map(([a,b])=>F(a,b)),"  ·  ",true)}</p>`,
   c:items(f23.map(([a,b])=>`${F(a,b)} = ${F(`${a} × ${100/b}`,`${b} × ${100/b}`)} = ${F(100*a/b,100)} = ${100*a/b} %`),"  ·  ",true)}
]};
return [secA, secB, secC, secD, secE, secF, secG];
};
