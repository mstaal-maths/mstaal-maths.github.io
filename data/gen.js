/* Questions générées : de nouveaux nombres à chaque fois.
   Elles s'ajoutent à la fin des questions existantes de chaque notion (le contenu existant n'est pas modifié). */
(function(){
const ri = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const pick = a => a[Math.floor(Math.random()*a.length)];
const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g," ");
const gcd = (a,b) => b ? gcd(b, a%b) : a;
const ON = ["Oui","Non"];
const uniq = (good, bads) => { const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
function addG(key, nom, lv){
  const D=CH[key]; if(!D) return; const N=D.quiz.find(n=>n.nom===nom); if(!N) return;
  for(const l in lv) lv[l].forEach(g=>N.q[l].push({g}));
}

/* ----- nombres en lettres, avec les règles du cours (tirets partout, cent/vingt, mille invariable) ----- */
const U=["zéro","un","deux","trois","quatre","cinq","six","sept","huit","neuf","dix","onze","douze","treize","quatorze","quinze","seize"];
const T=["","","vingt","trente","quarante","cinquante","soixante"];
function b100(n, fin){
  if(n<17) return U[n]; if(n<20) return "dix-"+U[n-10];
  const t=Math.floor(n/10), u=n%10;
  if(t<=6) return T[t]+(u===0?"":u===1?"-et-un":"-"+U[u]);
  if(t===7) return u===1?"soixante-et-onze":"soixante-"+b100(10+u);
  if(t===8) return u===0?(fin?"quatre-vingts":"quatre-vingt"):"quatre-vingt-"+U[u];
  return "quatre-vingt-"+b100(10+u);
}
function b1000(n, fin){
  const h=Math.floor(n/100), r=n%100, p=[];
  if(h===1) p.push("cent"); else if(h>1) p.push(U[h]+"-cent"+(r===0&&fin?"s":""));
  if(r) p.push(b100(r, fin));
  return p.join("-");
}
function lettres(n){
  if(n===0) return "zéro";
  const g=Math.floor(n/1e9), m=Math.floor(n/1e6)%1000, k=Math.floor(n/1000)%1000, u=n%1000, p=[];
  if(g) p.push(g===1?"un-milliard":b1000(g,true)+"-milliards");
  if(m) p.push(m===1?"un-million":b1000(m,true)+"-millions");
  if(k) p.push(k===1?"mille":b1000(k,false)+"-mille");
  if(u) p.push(b1000(u,true));
  return p.join("-");
}
window.lettres = lettres;

/* ======================= 6e · chapitre 1 ======================= */
const zeros = (d) => { let s=""; for(let i=0;i<d;i++) s+= (i===0?ri(1,9):(Math.random()<0.35?0:ri(0,9))); return +s; };
addG("6e-1","Écrire les nombres",{
  1:[()=>{ const n=ri(101,999); return {q:`Écris en chiffres : ${lettres(n)}`, rep:String(n)}; }],
  2:[()=>{ const n=zeros(ri(4,5)); return {q:`Écris en chiffres : ${lettres(n)}`, rep:sp(n), ex:`${lettres(n)} = ${sp(n)}.`}; }],
  3:[()=>{ const n=zeros(ri(6,7)); return {q:`Écris en chiffres : ${lettres(n)}`, rep:sp(n), ex:`On complète les rangs vides avec des zéros : ${sp(n)}.`}; },
     ()=>{ const a=ri(2,9), mil=Math.random()<0.5, n=a*100*(mil?1000:1), w=lettres(n);
       const bad = mil ? [U[a]+"-cents-mille", U[a]+"-cent-milles", U[a]+" cent mille"] : [U[a]+"-cent", U[a]+"s-cents", U[a]+" cents"];
       return {q:`Comment s'écrit ${sp(n)} en lettres ?`, c:uniq(w,bad), rep:w, ex: mil?"« cent » est suivi de « mille » : pas de s. « mille » ne prend jamais de s.":"Rien après « cent » : il prend un s."}; }]
});
const RANGS=["unités","dizaines","centaines","unités de mille","dizaines de mille","centaines de mille","unités de millions","dizaines de millions","centaines de millions"];
const chiffreDe = (n, r) => Math.floor(n/Math.pow(10,r))%10;
addG("6e-1","Le tableau de numération",{
  1:[()=>{ const n=ri(1000,99999), r=ri(0,Math.min(4,String(n).length-1)); return {q:`Dans ${sp(n)}, quel est le chiffre des ${RANGS[r]} ?`, rep:String(chiffreDe(n,r))}; }],
  2:[()=>{ const n=ri(1000000,99999999), r=ri(3,Math.min(7,String(n).length-1)); return {q:`Dans ${sp(n)}, quel est le chiffre des ${RANGS[r]} ?`, rep:String(chiffreDe(n,r)), ex:`On découpe en classes de trois chiffres : ${sp(n)}.`}; }],
  3:[()=>{ const rs=[8,6,4,3,0].filter(()=>Math.random()<0.75); if(!rs.length) rs.push(8); let n=0; const parts=rs.map(r=>{ const d=ri(1,9); n+=d*Math.pow(10,r); return `${d} ${d>1?RANGS[r]:RANGS[r].replace(/^(\S+)s/,"$1")}`; });
       return {q:`Écris le nombre qui a ${parts.join(", ")}.`, rep:sp(n), ex:`On complète les rangs vides avec des zéros : ${sp(n)}.`}; }]
});
addG("6e-1","Décomposer un nombre",{
  1:[()=>{ const n=zeros(4); const parts=[3,2,1,0].map(r=>chiffreDe(n,r)*Math.pow(10,r)).filter(x=>x); return {q:`Retrouve le nombre : ${parts.map(sp).join(" + ")}`, rep:sp(n)}; }],
  2:[()=>{ const n=zeros(ri(5,6)); const parts=[5,4,3,2,1,0].map(r=>[chiffreDe(n,r),r]).filter(([d,r])=>d&&Math.pow(10,r)<=n); return {q:`Retrouve le nombre : ${parts.map(([d,r])=>`${d} × ${sp(Math.pow(10,r))}`).join(" + ")}`, rep:sp(n)}; }],
  3:[()=>{ const n=zeros(ri(7,8)); const parts=[7,6,5,4,3,2,1,0].map(r=>chiffreDe(n,r)*Math.pow(10,r)).filter(x=>x); return {q:`Retrouve le nombre : ${parts.map(sp).join(" + ")}`, rep:sp(n), ex:`Attention aux rangs vides : ${sp(n)}.`}; }]
});
addG("6e-1","Demi-droite graduée",{
  1:[()=>{ const s=pick([1,2,5,10,100]), r=ri(2,9); return {q:"Quelle est l'abscisse du point A ?", fig:axis({n:10, lab:[[0,"0"],[1,sp(s)]], pts:[["A",r]]}), rep:sp(r*s), ex:`Une graduation vaut ${sp(s)}, et A est à la ${r}e graduation : ${r} × ${sp(s)} = ${sp(r*s)}.`}; }],
  2:[()=>{ const s=pick([3,5,20,50,200,500]), r=ri(2,9); return {q:"Quelle est l'abscisse du point B ?", fig:axis({n:10, lab:[[0,"0"],[10,sp(10*s)]], pts:[["B",r]]}), rep:sp(r*s), ex:`Écart = ${sp(10*s)} ÷ 10 = ${sp(s)}, et ${r} × ${sp(s)} = ${sp(r*s)}.`}; }],
  3:[()=>{ const n=pick([8,9,12]), s=pick([3,25,150,300,2000,200000]), r=ri(2,n-1); return {q:"Quelle est l'abscisse du point C ?", fig:axis({n, lab:[[0,"0"],[n,sp(n*s)]], pts:[["C",r]]}), rep:sp(r*s), ex:`Écart = ${sp(n*s)} ÷ ${n} = ${sp(s)}, et ${r} × ${sp(s)} = ${sp(r*s)}.`}; }]
});
addG("6e-1","Priorités opératoires",{
  1:[()=>{ const a=ri(2,20), b=ri(2,9), c=ri(2,9); return {q:`Calcule : ${a} + ${b} × ${c}`, rep:String(a+b*c), ex:`La multiplication d'abord : ${a} + ${b*c} = ${a+b*c}.`}; },
     ()=>{ const b=ri(2,9), c=ri(2,9), a=b*c+ri(1,30); return {q:`Calcule : ${a} − ${b} × ${c}`, rep:String(a-b*c), ex:`${a} − ${b*c} = ${a-b*c}.`}; }],
  2:[()=>{ const a=ri(2,9), b=ri(2,12), c=ri(2,12); return {q:`Calcule : ${a} × (${b} + ${c})`, rep:String(a*(b+c)), ex:`Les parenthèses d'abord : ${a} × ${b+c} = ${a*(b+c)}.`}; },
     ()=>{ const b=ri(2,9), q=ri(2,9), a=b*q, c=ri(2,9), d=ri(2,9); return {q:`Calcule : ${a} ÷ ${b} + ${c} × ${d}`, rep:String(q+c*d), ex:`${q} + ${c*d} = ${q+c*d}.`}; }],
  3:[()=>{ const c=ri(2,6), d=ri(2,6), b=ri(1,9), a=b+c*d+ri(1,40); return {q:`Calcule : ${a} − (${b} + ${c} × ${d})`, rep:String(a-(b+c*d)), ex:`Dans la parenthèse : ${b} + ${c*d} = ${b+c*d}, puis ${a} − ${b+c*d} = ${a-b-c*d}.`}; },
     ()=>{ const a=ri(2,9), b=ri(2,9), d=ri(1,8), c=d+ri(1,6); return {q:`Calcule : (${a} + ${b}) × (${c} − ${d})`, rep:String((a+b)*(c-d)), ex:`${a+b} × ${c-d} = ${(a+b)*(c-d)}.`}; }]
});
addG("6e-1","Placer les parenthèses",{
  2:[()=>{ const a=ri(2,9), b=ri(2,9), c=ri(2,6), v=(a+b)*c; return {q:`Où placer les parenthèses pour que ${a} + ${b} × ${c} = ${v} ?`, c:[`(${a} + ${b}) × ${c}`,`${a} + (${b} × ${c})`,"Aucune parenthèse n'est utile"], rep:`(${a} + ${b}) × ${c}`, ex:`${a+b} × ${c} = ${v}.`}; }],
  3:[()=>{ const b=ri(5,20), c=ri(2,9), a=b+c+ri(5,30), v=a-(b+c); return {q:`Où placer les parenthèses pour que ${a} − ${b} + ${c} = ${v} ?`, c:[`${a} − (${b} + ${c})`,`(${a} − ${b}) + ${c}`,"Aucune parenthèse n'est utile"], rep:`${a} − (${b} + ${c})`, ex:`${a} − ${b+c} = ${v}. Sans parenthèses, on trouverait ${a-b+c}.`}; }]
});

/* ======================= 6e · chapitre 3 ======================= */
const fr2 = (a,b)=>{ const g=gcd(a,b); return g>1?[`${a}/${b}`,`${a/g}/${b/g}`]:`${a}/${b}`; };
addG("6e-3","Lire une fraction",{
  1:[()=>{ const d=pick([3,4,5,6,8]), k=ri(1,d-1); return {q:"Quelle fraction du disque est coloriée ?", fig:discs(d,k), rep:fr2(k,d)}; }],
  2:[()=>{ const c=pick([3,4,5]), r=pick([2,3]), k=ri(1,c*r-1); return {q:"Quelle fraction du rectangle est coloriée ?", fig:grids(c,r,k), rep:fr2(k,c*r), ex:`${k} carreau${k>1?"x":""} sur ${c*r}.`}; }],
  3:[()=>{ const d=pick([3,4,5,6]), k=ri(d+1,2*d-1); return {q:"Chaque disque est une unité. Quelle fraction d'unité est coloriée ?", fig:discs(d,k), rep:fr2(k,d), ex:`${d} parts dans le premier disque et ${k-d} dans le second : {${k}/${d}}.`}; }]
});
addG("6e-3","Fractions égales",{
  1:[()=>{ const b=ri(2,9), a=ri(1,b-1), k=ri(2,6); return {q:"Complète.", t:`{${a}/${b}} = {□/${b*k}}`, r:[String(a*k)], ex:`${b} × ${k} = ${b*k}, donc ${a} × ${k} = ${a*k}.`}; }],
  2:[()=>{ let b=ri(2,9), a=ri(1,b+3); const g=gcd(a,b); a/=g; b/=g; const k=ri(2,9); return {q:"Complète.", t:`{${a*k}/${b*k}} = {${a}/□}`, r:[String(b)], ex:`On a divisé le numérateur par ${k}, donc le dénominateur aussi : ${b*k} ÷ ${k} = ${b}.`}; }],
  3:[()=>{ let b=ri(3,9), a=ri(1,b-1); const g=gcd(a,b); a/=g; b/=g; const k=pick([4,6,8,9,12]); return {q:`Simplifie au maximum {${a*k}/${b*k}}.`, rep:`${a}/${b}`, ex:`On divise le numérateur et le dénominateur par ${k} : {${a}/${b}}.`}; }]
});
addG("6e-3","Demi-droite graduée",{
  1:[()=>{ const d=pick([2,3,4,5]), r=ri(1,d-1); return {q:"Quelle est l'abscisse du point A ?", fig:fline(2,d,[["A",r]]), rep:fr2(r,d)}; }],
  2:[()=>{ const d=pick([3,4,5,6]), r=ri(d+1,2*d-1); return {q:"Quelle est l'abscisse du point B ?", fig:fline(2,d,[["B",r]]), rep:fr2(r,d), ex:`L'unité est partagée en ${d}, et B est à la ${r}e graduation.`}; }],
  3:[()=>{ const [D,b]=pick([[6,2],[6,3],[10,2],[10,5],[12,3],[12,4],[12,6]]), a=ri(1,2*b-1); return {q:`Sur une demi-droite graduée en ${D===6?"sixièmes":D===10?"dixièmes":"douzièmes"}, à quelle graduation après 0 place-t-on {${a}/${b}} ?`, rep:String(a*D/b), ex:`{${a}/${b}} = {${a*D/b}/${D}}.`}; }]
});
addG("6e-3","Comparer une fraction à 1",{
  2:[()=>{ const b=ri(3,15), a=pick([ri(1,b-1), b, ri(b+1,2*b)]); const r=a<b?"inférieure à 1":a===b?"égale à 1":"supérieure à 1"; return {q:`{${a}/${b}} est :`, c:["inférieure à 1","égale à 1","supérieure à 1"], rep:r, ex:a<b?`${a} est plus petit que ${b}.`:a===b?"Le numérateur et le dénominateur sont égaux.":`${a} est plus grand que ${b}.`}; }]
});
addG("6e-3","Entier + fraction inférieure à 1",{
  2:[()=>{ const d=ri(2,6), e=ri(1,3), r=ri(1,d-1), n=e*d+r; return {q:"Complète.", t:`{${n}/${d}} = □ + {□/${d}}`, r:[String(e),String(r)], ex:`${e} × ${d} = ${e*d}, et il reste ${r} : {${n}/${d}} = ${e} + {${r}/${d}}.`}; }],
  3:[()=>{ const d=ri(3,10), e=ri(3,9), r=ri(1,d-1), n=e*d+r; return pick([
       {q:"Complète.", t:`{${n}/${d}} = □ + {□/${d}}`, r:[String(e),String(r)], ex:`${e} × ${d} = ${e*d}, et ${n} − ${e*d} = ${r}.`},
       {q:"Écris sous la forme d'une seule fraction.", t:`${e} + {${r}/${d}} = {□/${d}}`, r:[String(n)], ex:`${e} = {${e*d}/${d}}, et ${e*d} + ${r} = ${n}.`}]); }]
});
addG("6e-3","Encadrer entre deux entiers consécutifs",{
  1:[()=>{ const d=ri(2,5), r=ri(1,d-1), n=d+r; return {q:"Encadre entre deux entiers consécutifs.", t:`□ &lt; {${n}/${d}} &lt; □`, r:["1","2"], ex:`{${n}/${d}} = 1 + {${r}/${d}}.`}; }],
  2:[()=>{ const d=ri(2,8), e=ri(2,5), r=ri(1,d-1), n=e*d+r; return {q:"Encadre entre deux entiers consécutifs.", t:`□ &lt; {${n}/${d}} &lt; □`, r:[String(e),String(e+1)], ex:`{${n}/${d}} = ${e} + {${r}/${d}}.`}; }],
  3:[()=>{ const d=ri(3,12), e=ri(5,12), r=ri(1,d-1), n=e*d+r; return {q:"Encadre entre deux entiers consécutifs.", t:`□ &lt; {${n}/${d}} &lt; □`, r:[String(e),String(e+1)], ex:`${e} × ${d} = ${e*d} et ${e+1} × ${d} = ${(e+1)*d} : ${e} &lt; {${n}/${d}} &lt; ${e+1}.`}; }]
});
addG("6e-3","Fractions décimales",{
  1:[()=>{ const a=ri(1,9); return {q:"Complète.", t:`{${a}/10} = {□/100}`, r:[String(a*10)]}; }],
  2:[()=>{ const a=ri(1,9), b=ri(1,9); return {q:"Complète.", t:`{${a}/10} + {${b}/100} = {□/100}`, r:[String(a*10+b)], ex:`{${a}/10} = {${a*10}/100}, et ${a*10} + ${b} = ${a*10+b}.`}; }],
  3:[()=>{ let n; do{ n=ri(101,999); }while(n%100===0); if(n%10===0||Math.floor(n/10)%10===0) return {q:"Complète.", t:`{${n}/100} = □ + {□/100}`, r:[String(Math.floor(n/100)),String(n%100)]};
       return {q:"Complète.", t:`{${n}/100} = □ + {□/10} + {□/100}`, r:[String(Math.floor(n/100)),String(Math.floor(n/10)%10),String(n%10)]}; }]
});
addG("6e-3","Pourcentages",{
  1:[()=>{ const p=ri(1,99); return {q:"Complète.", t:`${p} % = {□/100}`, r:[String(p)]}; }],
  2:[()=>{ const [a,b]=pick([[1,2],[1,4],[3,4],[1,5],[2,5],[3,5],[4,5],[1,10],[3,10],[7,10],[9,10]]); return {q:"Complète.", t:`{${a}/${b}} = □ %`, r:[String(100*a/b)], ex:`{${a}/${b}} = {${100*a/b}/100} = ${100*a/b} %.`}; }],
  3:[()=>{ const [a,b]=pick([[1,20],[3,20],[7,20],[1,25],[4,25],[1,50],[9,50],[13,20]]); return {q:"Complète.", t:`{${a}/${b}} = □ %`, r:[String(100*a/b)], ex:`On multiplie par ${100/b} : {${a}/${b}} = {${100*a/b}/100} = ${100*a/b} %.`}; }]
});

/* ======================= 5e · chapitre 1 ======================= */
const isPrime = n => { if(n<2) return false; for(let d=2;d*d<=n;d++) if(n%d===0) return false; return true; };
const divs = n => { const a=[]; for(let d=1;d<=n;d++) if(n%d===0) a.push(d); return a; };
const sumDig = n => String(n).split("").reduce((a,c)=>a+ +c,0);
addG("5e-1","Multiples",{
  1:[()=>{ const n=ri(3,9), k=ri(3,11), m=n*k; return {q:`Lequel de ces nombres est un multiple de ${n} ?`, c:uniq(String(m),[String(m+1),String(m-1),String(m+2)]), rep:String(m), ex:`${n} × ${k} = ${m}.`}; }],
  2:[()=>{ const n=ri(6,15), k=ri(3,12); return {q:"Complète.", t:`${n} × □ = ${n*k}`, r:[String(k)], ex:`${n*k} est un multiple de ${n} : ${n} × ${k} = ${n*k}.`}; }],
  3:[()=>{ const n=ri(6,15), X=ri(80,200), m=(Math.floor(X/n)+1)*n; return {q:`Quel est le plus petit multiple de ${n} supérieur à ${X} ?`, rep:String(m), ex:`${n} × ${m/n} = ${m}.`}; }]
});
addG("5e-1","Critères de divisibilité",{
  1:[()=>{ const d=pick([2,5,10]), n=ri(100,9999); const ok=n%d===0; return {q:`${sp(n)} est-il divisible par ${d} ?`, c:ON, rep:ok?"Oui":"Non", ex:d===2?`Son chiffre des unités est ${n%10} : ${ok?"pair":"impair"}.`:`Son chiffre des unités est ${n%10}.`}; }],
  2:[()=>{ const d=pick([3,9]), n=ri(100,9999), s=sumDig(n), ok=n%d===0; return {q:`${sp(n)} est-il divisible par ${d} ?`, c:ON, rep:ok?"Oui":"Non", ex:`Somme des chiffres : ${String(n).split("").join(" + ")} = ${s}, ${ok?"":"qui n'est pas "}un multiple de ${d}.`}; }],
  3:[()=>{ let a,b,s; do{ a=ri(1,9); b=ri(0,9); s=a+b; }while(s%9===0); const x=(9-s%9)%9; return {q:`Quel chiffre faut-il écrire à la place de ★ pour que ${a}★${b} soit divisible par 9 ?`, rep:String(x), ex:`${a} + ${x} + ${b} = ${a+x+b}, un multiple de 9.`}; }]
});
addG("5e-1","Diviseurs",{
  1:[()=>{ const N=pick([12,18,20,24,28,30,36,40,42,45,48,60]), d=ri(2,9), ok=N%d===0; return {q:`${d} est-il un diviseur de ${N} ?`, c:ON, rep:ok?"Oui":"Non", ex:ok?`${N} ÷ ${d} = ${N/d}.`:`${N} ÷ ${d} ne tombe pas juste.`}; }],
  2:[()=>{ const N=pick([12,16,18,20,24,28,30,32,36,40,42,45,48,50,54,60]), D=divs(N); return {q:`Combien ${N} a-t-il de diviseurs ?`, rep:String(D.length), ex:`${D.join(", ")}.`}; }],
  3:[()=>{ const [a,b]=pick([[12,18],[16,24],[18,24],[20,30],[24,36],[28,42],[30,45],[36,48],[40,60],[42,56]]); return {q:`Quel est le plus grand diviseur commun à ${a} et ${b} ?`, rep:String(gcd(a,b)), ex:`Diviseurs communs : ${divs(gcd(a,b)).join(", ")}.`}; }]
});
const divQ = (lo,hi,dlo,dhi) => { const d=ri(dlo,dhi), N=ri(lo,hi), q=Math.floor(N/d), r=N%d; return {q:`Complète l'égalité de la division euclidienne de ${sp(N)} par ${d}.`, t:`${d} × □ + □ = ${sp(N)}`, r:[String(q),String(r)], ex:`${d} × ${q} = ${sp(d*q)}, et il reste ${r} (plus petit que ${d}).`}; };
addG("5e-1","Division euclidienne",{
  1:[()=>divQ(20,99,2,9)], 2:[()=>divQ(100,999,3,12)], 3:[()=>divQ(1000,9999,12,25)]
});
addG("5e-1","Problèmes de partage",{
  2:[()=>{ const d=ri(8,16), N=ri(100,400); return {q:`${N} élèves sont répartis en équipes de ${d}. Combien d'équipes complètes peut-on former ?`, rep:String(Math.floor(N/d)), ex:`${d} × ${Math.floor(N/d)} + ${N%d} = ${N}.`}; }],
  3:[()=>{ let d,N; do{ d=ri(8,16); N=ri(100,400); }while(N%d===0); const r=N%d; return {q:`${N} élèves sont répartis en équipes de ${d}. Combien d'élèves manque-t-il pour former une équipe de plus ?`, rep:String(d-r), ex:`${d} × ${Math.floor(N/d)} + ${r} = ${N} : il reste ${r} élève${r>1?"s":""}, il en manque ${d} − ${r} = ${d-r}.`}; }]
});
addG("5e-1","Nombres premiers",{
  1:[()=>{ const n=ri(2,30), p=isPrime(n); return {q:`${n} est-il un nombre premier ?`, c:ON, rep:p?"Oui":"Non", ex:`Diviseurs de ${n} : ${divs(n).join(", ")}.`}; }],
  2:[()=>{ const n=ri(31,99), p=isPrime(n); return {q:`${n} est-il un nombre premier ?`, c:ON, rep:p?"Oui":"Non", ex:p?`Ses seuls diviseurs sont 1 et ${n}.`:`${n} = ${divs(n)[1]} × ${n/divs(n)[1]}.`}; }]
});

/* ======================= 5e · chapitre 2 ======================= */
addG("5e-2","Symétrique d'un point",{
  2:[()=>{ for(;;){ let A,O,P; do{ A=[ri(0,8),ri(0,6)]; O=[ri(1,7),ri(1,5)]; P=[2*O[0]-A[0],2*O[1]-A[1]]; }while(P[0]<0||P[0]>8||P[1]<0||P[1]>6||(A[0]===O[0]&&A[1]===O[1]));
       const cand=[P,[2*O[0]-A[0],A[1]],[A[0],2*O[1]-A[1]],[O[0]+Math.sign(O[0]-A[0]),O[1]+Math.sign(O[1]-A[1])]];
       const L=shuffle(["B","C","D","E"]), pts={A,O}, used=[]; let good=null; cand.forEach((p,i)=>{ if(p[0]>=0&&p[0]<=8&&p[1]>=0&&p[1]<=6&&!used.some(u=>u[0]===p[0]&&u[1]===p[1])&&!(p[0]===A[0]&&p[1]===A[1])&&!(p[0]===O[0]&&p[1]===O[1])){ pts[L[i]]=p; used.push(p); if(i===0) good=L[i]; } });
       const names=Object.keys(pts).filter(k=>k!=="A"&&k!=="O").sort();
       if(names.length<3) continue;   /* au moins 3 choix */
       return {q:"Quel point est le symétrique de A par rapport à O ?", fig:geo({pts, marks:Object.keys(pts), grid:{c:8,r:6}, s:34, w:300}), c:names, rep:good, ex:`De A à O : ${Math.abs(O[0]-A[0])} carreau(x) en largeur et ${Math.abs(O[1]-A[1])} en hauteur. On refait le même déplacement à partir de O.`}; } }],
  3:[()=>{ let A,O,P; do{ A=[ri(0,9),ri(0,7)]; O=[ri(2,7),ri(2,5)]; P=[2*O[0]-A[0],2*O[1]-A[1]]; }while(P[0]<1||P[0]>8||P[1]<1||P[1]>6||Math.abs(O[0]-A[0])<2||Math.abs(O[1]-A[1])<1);
       const cand=[P,[P[0]+1,P[1]],[P[0],P[1]-1],[2*O[0]-A[0],A[1]]];
       const L=shuffle(["B","C","D","E"]), pts={A,O}, used=[]; let good=null;
       cand.forEach((p,i)=>{ if(p[0]>=0&&p[0]<=9&&p[1]>=0&&p[1]<=7&&!used.some(u=>u[0]===p[0]&&u[1]===p[1])&&!(p[0]===A[0]&&p[1]===A[1])&&!(p[0]===O[0]&&p[1]===O[1])){ pts[L[i]]=p; used.push(p); if(i===0) good=L[i]; } });
       const names=Object.keys(pts).filter(k=>k!=="A"&&k!=="O").sort();
       const h=Math.abs(O[0]-A[0]), v=Math.abs(O[1]-A[1]), dh=O[0]>A[0]?"vers la droite":"vers la gauche", dv=O[1]>A[1]?"vers le bas":"vers le haut";
       return {q:"Attention aux pièges : quel point est le symétrique de A par rapport à O ?", fig:geo({pts, marks:Object.keys(pts), grid:{c:9,r:7}, s:34, w:340}), c:names, rep:good,
         ex:`De A à O : ${h} carreau${h>1?"x":""} ${dh} et ${v} carreau${v>1?"x":""} ${dv}. On refait exactement le même déplacement à partir de O pour trouver A'.`,
         sx:`<figure class="schFig">${geo({pts:{A,O,"A'":P}, cons:[["A","O","A'",1]], marks:["A","O","A'"], grid:{c:9,r:7}, s:34, w:340})}<figcaption>Même déplacement de A à O, puis de O à A' : O est le milieu de [AA'].</figcaption></figure>`}; }]
});
addG("5e-2","Justifier une longueur ou un angle",{
  1:[()=>{ const l=ri(2,12)+(Math.random()<0.5?0.5:0), s=String(l).replace(".",","); return {q:`Les triangles ABC et DEF sont symétriques par rapport à O (A et D, B et E, C et F se correspondent). AB = ${s} cm.`, t:"DE = □ cm", r:[[s,String(l)]], ex:"Le demi-tour conserve les longueurs."}; }],
  2:[()=>{ const a=ri(20,140); return {q:`Les triangles ABC et MNP sont symétriques par rapport à O (A et M, B et N, C et P se correspondent). L'angle en B mesure ${a}°.`, t:"L'angle en N mesure □°", r:[String(a)], ex:"Le demi-tour conserve les mesures d'angles."}; }],
  3:[()=>{ const a=ri(30,100), b=ri(20,150-a), c=180-a-b; return {q:`KLM et XYZ sont symétriques par rapport à O (K et X, L et Y, M et Z). Dans KLM, les angles en K et en L mesurent ${a}° et ${b}°. Combien mesure l'angle en Z ?`, t:"□°", r:[String(c)], ex:`Dans KLM, l'angle en M mesure 180 − ${a} − ${b} = ${c}°, et l'angle en Z est son symétrique.`}; }]
});
/* révision mixte des deux chapitres évalués ensemble en 5e */
["5e-1","5e-2"].forEach(k=>{ if(CH[k]) CH[k].mix=["5e-1","5e-2"]; });
})();
