/* 4e — Chapitre 11 : Nombres en écriture fractionnaire (1) — égalité de quotients, simplification, comparaison,
   addition et soustraction (cours complété, activité, fiche d'exercices, entraînement et exercices pour les plus rapides de M. Staal).
   M. Staal n'a pas de feuille de corrections pour ce chapitre : toutes les corrections sont calculées (et vérifiées).
   Les figures de partage (bandes, disques, carré divisé) sont dessinées en SVG. */
(function(){
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const ex=(p,alt,w)=>img("4k11ex/"+p,alt,w);
const fig=(cap,body)=>`<figure>${body}${cap?`<figcaption>${cap}</figcaption>`:""}</figure>`;
const LT="&lt;", GT="&gt;";

/* ------------------------------------------------------------------
   Outils de calcul sur les fractions (toujours avec des entiers)
------------------------------------------------------------------ */
const gcd=(a,b)=>{ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b,a%b]; } return a; };
const lcm=(a,b)=>a/gcd(a,b)*b;
const M=n=>(n<0?"−":"")+Math.abs(n);                                  /* entier avec le signe − */
const F=(n,d)=>d===1?M(n):`{${M(n)}/${d}}`;                            /* fraction écrite telle quelle */
const R=(n,d)=>{ const g=gcd(n,d)||1; return F(n/g,d/g); };            /* fraction irréductible (ou entier) */
const TY=(n,d)=>{ const g=gcd(n,d)||1; return d/g===1?M(n/g):M(n/g)+"/"+(d/g); };   /* réponse tapée : « 5/6 », « −7/15 », « 2 » */
const TYs=(n,d)=>{ const t=TY(n,d); return t.includes("/")?[t]:[t, t+"/1"]; };
/* étapes de la simplification : {21/56} = {21 ÷ 7/56 ÷ 7} = {3/8} */
const simp=(n,d)=>{ const g=gcd(n,d); if(g===1) return [F(n,d)]; return [F(n,d), `{${M(n)} ÷ ${g}/${d} ÷ ${g}}`, R(n,d)]; };
/* étapes d'une somme ou d'une différence : a/b ± c/d */
function addSteps(a,b,c,d,op){
  const m=lcm(b,d), k1=m/b, k2=m/d, L=[`${F(a,b)} ${op} ${F(c,d)}`];
  if(k1!==1||k2!==1){
    L.push(`${k1>1?`{${M(a)} × ${k1}/${b} × ${k1}}`:F(a,b)} ${op} ${k2>1?`{${M(c)} × ${k2}/${d} × ${k2}}`:F(c,d)}`);
    L.push(`${F(a*k1,m)} ${op} ${F(c*k2,m)}`); }
  const n = op==="+" ? a*k1+c*k2 : a*k1-c*k2, g=gcd(n,m)||1;
  L.push(F(n,m));
  if(g>1 && n!==0){ if(m/g>1) L.push(`{${M(n)} ÷ ${g}/${m} ÷ ${g}}`); L.push(R(n,m)); }
  if(n===0) L.push("0");
  return {L, n, m};
}
/* calculs en chaîne « A = … » (outils définis dans 4e-1.js) */
const {chn,chns,qChain}=window.CHN4;
const calc=(name,L)=>`<p class="calc">${L.map(x=>`${name} = ${x}`).join("<br>")}</p>`;
const line=L=>L.join(" = ");
/* comparaison de a/b et c/d en les réduisant au même dénominateur */
function cmpSteps(a,b,c,d){
  const m=lcm(b,d), A=a*m/b, C=c*m/d, s=A<C?LT:A>C?GT:"=";
  const conv=(x,y,X)=>y===m?F(x,y):`${F(x,y)} = {${M(x)} × ${m/y}/${y} × ${m/y}} = ${F(X,m)}`;
  return {s, m, A, C, txt:`${conv(a,b,A)} et ${conv(c,d,C)}.`, txt2:`${F(A,m)} ${s} ${F(C,m)} donc ${F(a,b)} ${s} ${F(c,d)}.`};
}

/* ------------------------------------------------------------------
   Figures de partage
------------------------------------------------------------------ */
const COL="color-mix(in srgb,var(--c) 45%,transparent)";
function bar(n,k,w=180,col=COL){ const h=36, u=(w-4)/n; let s=`<svg class="fig" viewBox="0 0 ${w} ${h+4}" width="${w}" role="img" aria-label="Bande partagée en ${n} parts égales, ${k} coloriée${k>1?"s":""}">`;
  for(let i=0;i<n;i++) s+=`<rect x="${(2+i*u).toFixed(1)}" y="2" width="${u.toFixed(1)}" height="${h}" style="fill:${i<k?col:"var(--surface)"};stroke:var(--ink);stroke-width:1.6"/>`;
  return s+"</svg>"; }
function disk(n,k,r=52,col=COL){ const c=r+4, W=2*c; let s=`<svg class="fig" viewBox="0 0 ${W} ${W}" width="${W}" role="img" aria-label="Disque partagé en ${n} parts égales, ${k} coloriée${k>1?"s":""}">`;
  const P=a=>[c+r*Math.cos((a-90)*Math.PI/180), c+r*Math.sin((a-90)*Math.PI/180)];
  for(let i=0;i<n;i++){ const [x0,y0]=P(i*360/n), [x1,y1]=P((i+1)*360/n);
    s+= n===1 ? `<circle cx="${c}" cy="${c}" r="${r}" style="fill:${i<k?col:"var(--surface)"};stroke:var(--ink);stroke-width:1.6"/>`
      : `<path d="M${c} ${c} L${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${360/n>180?1:0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" style="fill:${i<k?col:"var(--surface)"};stroke:var(--ink);stroke-width:1.6"/>`; }
  return s+"</svg>"; }
/* « Part d'Alice + Part de Benoît = Part totale » avec les figures */
const op3=(f1,c1,o,f2,c2,f3,c3)=>`<div class="figs" style="align-items:center">${fig(c1,f1)}<b style="font-size:24px">${o}</b>${fig(c2,f2)}<b style="font-size:24px">=</b>${fig(c3,f3)}</div>`;
/* carré divisé (exercice pour les plus rapides) : carré de 4 × 4 unités */
const CARRE=(()=>{ const k=50, p=([x,y])=>`${(6+x*k)},${(6+y*k)}`, poly=(pts,col)=>`<polygon points="${pts.map(p).join(" ")}" style="fill:${col};stroke:#333;stroke-width:1.6;stroke-linejoin:round"/>`;
  const O="#f5a623", V="#6a35a0", Rr="#ef3340", N="#2b2b2b";
  let s=`<svg class="fig" viewBox="0 0 212 212" width="212" role="img" aria-label="Carré divisé en parties violette, orange, rouge et noire">`;
  s+=poly([[0,0],[1,0],[1,2],[0,2]],O)+poly([[1,0],[2,0],[2,2],[1,2]],O)+poly([[0,2],[1,2],[1,4],[0,4]],O);
  s+=poly([[2,0],[4,0],[4,2],[3,3],[2,2]],V);
  s+=poly([[1,2],[2,2],[1,3]],Rr)+poly([[2,2],[3,3],[2,4],[1,3]],Rr)+poly([[1,3],[2,4],[1,4]],N);
  s+=poly([[3,3],[4,2],[4,4]],O)+poly([[3,3],[4,4],[2,4]],O);
  s+=`<line x1="${6+2*k}" y1="${6+2*k}" x2="${6+2*k}" y2="${6+4*k}" style="stroke:#333;stroke-width:1.6"/>`;
  return s+"</svg>"; })();
/* grille « Observer » (en douzièmes) */
const GRILLE=[[2,5,2,5,4,4],[4,2,4,1,3,1],[3,3,6,4,2,5],[1,2,1,1,5,1]];
const grid=(G,hl=[])=>`<div class="scroll"><table class="std" style="text-align:center">${G.map((r,i)=>`<tr>${r.map((v,j)=>`<td style="padding:8px 12px;${hl.some(([a,b])=>i>=a&&i<=a+1&&j>=b&&j<=b+1)?"background:color-mix(in srgb,var(--c) 22%,transparent)":""}">${R(v,12)}</td>`).join("")}</tr>`).join("")}</table></div>`;
const squares=G=>{ const out=[]; for(let i=0;i<G.length-1;i++) for(let j=0;j<G[0].length-1;j++) if(G[i][j]+G[i][j+1]+G[i+1][j]+G[i+1][j+1]===12) out.push([i,j]); return out; };

/* outils réutilisés par la fiche d'entraînement */
window.FR11={gcd,lcm,M,F,R,TY,simp,addSteps,calc,line,cmpSteps,bar,disk,op3,fig,ex,grid,squares,COL};

/* ===================== schémas (rappels en image) ===================== */
const S_EG=sch("Égalité de quotients",`${chn("A",["{5/8}","{5 × 4/8 × 4}","{20/32}"])}<p class="schN">On multiplie (ou on divise) le numérateur <b>et</b> le dénominateur par le <b>même nombre</b> (différent de 0).</p>`);
const S_SIMP=sch("Simplifier une fraction",`${chn("A",["{21/56}","{21 ÷ 7/56 ÷ 7}","{3/8}"])}<p class="schN">On cherche un diviseur commun (tables, critères de divisibilité par 2, 3, 5, 9, 10).</p>`);
const S_CMP=sch("Comparer deux fractions",`<p class="calc">{9/5} = {27/15} et {27/15} &gt; {26/15}</p><p class="schN">On les écrit avec le <b>même dénominateur</b>, puis on compare les numérateurs.</p>`);
const S_ADD=sch("Additionner, soustraire",`${chn("C",["{1/5} − {4/6}","{6/30} − {20/30}","{−14/30}","{−7/15}"])}<p class="schN">1) même dénominateur ; 2) on additionne (ou soustrait) les numérateurs ; 3) on simplifie.</p>`);
const S_PB=sch("Problèmes de partage",`<div class="figs">${disk(2,1,34)}${disk(5,2,34)}${disk(10,9,34)}</div><p class="calc">{1/2} + {2/5} = {5/10} + {4/10} = {9/10}</p><p class="schN">Le tout (le gâteau entier) correspond à 1.</p>`);

/* ---------- générateurs du QCM ---------- */
const DEN=[2,3,4,5,6,7,8,9,10,11,12];
const fr=(dmax=12)=>{ const d=ri(2,dmax), n=ri(1,d*2); return [n,d]; };
function genAdd(kind,neg=false){ /* kind : "meme" | "mult" | "quel" */
  for(let g=0;g<500;g++){ let b=pick([3,4,5,6,7,8,9,10,12]), d;
    if(kind==="meme") d=b; else if(kind==="mult"){ const k=pick([2,3,4]); if(b*k>30) continue; d=b*k; if(Math.random()<0.5) [b,d]=[d,b]; } else { d=pick([3,4,5,6,7,8,9,10,12]); if(d===b||d%b===0||b%d===0) continue; if(lcm(b,d)>60) continue; }
    const a=ri(1,2*b-1)*(neg&&Math.random()<0.4?-1:1), c=ri(1,2*d-1), op=pick(["+","−"]); if(gcd(Math.abs(a),b)!==1||gcd(c,d)!==1) continue;
    const S=addSteps(a,b,c,d,op); if(S.n===0) continue; return {a,b,c,d,op,S}; }
  return {a:1,b:5,c:4,d:6,op:"−",S:addSteps(1,5,4,6,"−")}; }

CH["4e-11"] = {
intro:"Écrire des fractions égales, simplifier une fraction, comparer des fractions, puis additionner et soustraire des fractions.",
savoir:[
  "écrire des fractions égales en multipliant ou en divisant le numérateur et le dénominateur par un même nombre ;",
  "simplifier une fraction en utilisant les tables et les critères de divisibilité ;",
  "comparer deux fractions en les écrivant avec le même dénominateur ;",
  "additionner et soustraire des fractions ;",
  "résoudre des problèmes avec des fractions."
],

/* ===================== COURS ===================== */
cours:[
{k:"1", t:"Égalité de quotients", h:`
  <div class="retenir" data-l="Propriété"><p>Un quotient (ou une fraction) ne change pas lorsqu'on <b>multiplie</b> ou lorsqu'on <b>divise</b> son <b>numérateur</b> et son <b>dénominateur</b> par un <b>même nombre</b> différent de 0.</p></div>
  <p><b>Exemples :</b></p>
  ${chns([["A",["{5/8}","{5 × 4/8 × 4}","{20/32}"]],["B",["{11/9}","{11 × 3/9 × 3}","{33/27}"]],["C",["2","{2/1}","{2 × 7/1 × 7}","{14/7}"]]])}`},
{k:"2", t:"Simplifier une fraction", h:`
  <div class="retenir" data-l="Définition"><p><b>Simplifier</b> une fraction, c'est écrire une fraction qui lui est égale avec un <b>numérateur</b> et un <b>dénominateur plus petits</b>.</p></div>
  <div class="retenir" data-l="Méthode"><p>Il faut trouver un diviseur commun au numérateur et au dénominateur.</p><p>Pour cela, on peut s'aider des tables de multiplication ou des critères de divisibilité.</p></div>
  <div class="retenir" data-l="Critères de divisibilité"><div class="scroll"><table class="std"><tbody>
   <tr><th>Par 2</th><td><p>Un nombre est <b>divisible par 2</b> s'il est pair. Autrement dit, s'il se termine par 0, 2, 4, 6 ou 8.</p><p><i>Exemple : 276 est divisible par 2 car il se termine par 6.</i></p></td></tr>
   <tr><th>Par 5</th><td><p>Un nombre est <b>divisible par 5</b> s'il se termine par 0 ou 5.</p><p><i>Exemple : 845 est un multiple de 5 car il se termine par 5.</i></p></td></tr>
   <tr><th>Par 10</th><td><p>Un nombre est <b>divisible par 10</b> s'il se termine par 0.</p><p><i>Exemple : 840 est un multiple de 10 car il se termine par 0.</i></p></td></tr>
   <tr><th>Par 3</th><td><p>Un nombre est <b>divisible par 3</b> si la somme de ses chiffres est un multiple de 3.</p><p><i>Exemple : 276 est divisible par 3 car 2 + 7 + 6 = 15 et 15 est un multiple de 3.</i></p></td></tr>
   <tr><th>Par 9</th><td><p>Un nombre est <b>divisible par 9</b> si la somme de ses chiffres est un multiple de 9.</p><p><i>Exemple : 576 est divisible par 9 car 5 + 7 + 6 = 18 et 18 est un multiple de 9.</i></p></td></tr>
  </tbody></table></div></div>
  <p><b>Exemples :</b> simplifier les fractions suivantes.</p>
  ${calc("A",["{21/56}","{21 ÷ 7/56 ÷ 7}","{3/8}"])}
  ${calc("B",["{36/24}","{36 ÷ 6/24 ÷ 6}","{6/4}","{6 ÷ 2/4 ÷ 2}","{3/2}"])}
  ${calc("C",["{147/42}","{147 ÷ 3/42 ÷ 3}","{49/14}","{49 ÷ 7/14 ÷ 7}","{7/2}"])}`},
{k:"3", t:"Additionner et soustraire des fractions", h:`
  <div class="retenir" data-l="Propriété"><p>Pour additionner (ou soustraire) des fractions :</p><p><b>1)</b> tout d'abord, on réduit ces nombres au <b>même dénominateur</b> ;</p><p><b>2)</b> ensuite, on additionne (ou on soustrait) les <b>numérateurs</b> et on garde le dénominateur commun ;</p><p><b>3)</b> enfin, on <b>simplifie</b> le quotient, si possible.</p></div>
  <p><b>Exemples :</b> il y a 4 types de calculs.</p>
  <p><b>1) Les dénominateurs sont les mêmes.</b></p>
  ${calc("A",["{4/7} + {10/7}","{14/7}","{14 ÷ 7/7 ÷ 7}","{2/1}","2"])}
  <p><b>2) Un dénominateur est un multiple de l'autre.</b> Ici, 24 est un multiple de 8 car 24 = 3 × 8.</p>
  ${calc("B",["{25/24} + {−5/8}","{25/24} + {−5 × 3/8 × 3}","{25/24} + {−15/24}","{10/24}","{10 ÷ 2/24 ÷ 2}","{5/12}"])}
  <p><b>3) Les dénominateurs ne sont pas multiples l'un de l'autre :</b> on multiplie les dénominateurs entre eux. Ici, 30 sera notre dénominateur car 5 × 6 = 30.</p>
  ${calc("C",["{1/5} − {4/6}","{1 × 6/5 × 6} − {4 × 5/6 × 5}","{6/30} − {20/30}","{−14/30}","{−14 ÷ 2/30 ÷ 2}","{−7/15}"])}
  <p><b>4) On cherche un dénominateur plus petit.</b> On pourrait prendre comme dénominateur 9 × 12 = 108, mais on préfère prendre un dénominateur plus petit : 36, car 9 × 4 = 36 et 12 × 3 = 36.</p>
  ${calc("D",["{4/9} + {1/12}","{4 × 4/9 × 4} + {1 × 3/12 × 3}","{16/36} + {3/36}","{19/36}"])}
  <div class="attention"><b>ATTENTION :</b> on n'additionne jamais les dénominateurs. Par exemple, {1/2} + {2/5} n'est pas égal à {3/7} :</div>${chn("E",["{1/2} + {2/5}","{5/10} + {4/10}","{9/10}"])}`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Comparer des fractions", e:[
  {n:"Activité 1", t:"Devoir d'anglais", w:"Sur ton cahier", h:`<p>Mathilde a fait deux devoirs d'anglais en février.</p><p>Elle a obtenu {7/20} et ensuite {6/10}.</p><p>Sans utiliser la calculatrice, mais en notant ton raisonnement, détermine la meilleure des deux notes.</p>`,
   c:`<p>On écrit les deux notes sur 20 :</p><p class="calc">{6/10} = {6 × 2/10 × 2} = {12/20}</p><p>{12/20} &gt; {7/20} : la meilleure note est la deuxième, <b>{6/10}</b> (c'est-à-dire 12 sur 20).</p>`},
  {n:"Exercice 1", t:"Quel est le meilleur buteur ?", w:"Sur ton cahier", h:`<p>Sur 6 tirs au but, Lilian en a réussi 4. On dira que sa proportion de réussite est de {4/6}.</p><p>Sur 12 tirs au but, Guénolé en a réussi 7. Sa proportion de réussite est de {7/12}.</p><p>Quel joueur a la plus grande proportion de réussite ?</p>`,
   c:`<p class="calc">{4/6} = {4 × 2/6 × 2} = {8/12}</p><p>{8/12} &gt; {7/12} : c'est <b>Lilian</b> qui a la plus grande proportion de réussite.</p>`},
  {n:"Exercice 2", t:"Cake aux olives", w:"Sur ton cahier", h:`<p>Mathilde a mangé {2/5} du cake et Thomas a mangé {3/10} du cake.</p><p>Qui a mangé la plus grande part du cake ?</p>`,
   c:`<p class="calc">{2/5} = {2 × 2/5 × 2} = {4/10}</p><p>{4/10} &gt; {3/10} : c'est <b>Mathilde</b> qui a mangé la plus grande part.</p>`},
  {n:"Exercice 3", t:"Tableau d'honneur", w:"Sur ton cahier", h:`<p>Durant l'année 2017, Claire a gagné 3 matchs sur 5 alors que Karim a gagné 2 matchs sur 3.</p><p>Quel joueur a la plus grande proportion de réussite ?</p>`,
   c:`<p>Claire : {3/5} ; Karim : {2/3}. Le dénominateur commun est 5 × 3 = 15.</p><p class="calc">{3/5} = {3 × 3/5 × 3} = {9/15} &nbsp;et&nbsp; {2/3} = {2 × 5/3 × 5} = {10/15}</p><p>{10/15} &gt; {9/15} : c'est <b>Karim</b> qui a la plus grande proportion de réussite.</p>`},
  {n:"Exercice 4", t:"Comparer deux fractions", w:"Sur ton cahier", h:`<p>Compare les deux fractions. Explique tes choix sur ton cahier.</p><p>a) {9/5} et {26/15}</p><p>b) {7/4} et {12/8}</p><p>c) {2/3} et {8/12}</p><p>d) {5/7} et {2/3}</p><p>e) {11/5} et {10/4}</p><p>f) 3 et {13/4}</p>`,
   c:`<p>On écrit les deux fractions avec le même dénominateur, puis on compare les numérateurs.</p><p>a) {9/5} = {9 × 3/5 × 3} = {27/15} et {27/15} &gt; {26/15}, donc <b>{9/5} &gt; {26/15}</b>.</p><p>b) {7/4} = {7 × 2/4 × 2} = {14/8} et {14/8} &gt; {12/8}, donc <b>{7/4} &gt; {12/8}</b>.</p><p>c) {2/3} = {2 × 4/3 × 4} = {8/12}, donc <b>{2/3} = {8/12}</b>.</p>
   <p>d) {5/7} = {5 × 3/7 × 3} = {15/21} et {2/3} = {2 × 7/3 × 7} = {14/21}.</p><p>{15/21} &gt; {14/21}, donc <b>{5/7} &gt; {2/3}</b>.</p><p>e) {11/5} = {11 × 4/5 × 4} = {44/20} et {10/4} = {10 × 5/4 × 5} = {50/20}.</p><p>{44/20} &lt; {50/20}, donc <b>{11/5} &lt; {10/4}</b>.</p><p>f) 3 = {3 × 4/1 × 4} = {12/4} et {12/4} &lt; {13/4}, donc <b>3 &lt; {13/4}</b>.</p>`}
 ]},
{t:"Additionner et soustraire des fractions", e:[
  {n:"Activité 2", t:"Somme et différence de fractions", w:"Sur ta feuille et sur ton cahier", h:`
   <p><b>1) Partage de pain d'épices</b></p>${ex("pain.png","Pain d'épices",90)}<p>Un frère et une sœur se partagent un pain d'épices pour le goûter. Alice prend un tiers du gâteau et Benoît prend {1/6} du gâteau.</p><p>Quelle fraction du gâteau a été mangée par ces deux enfants ? <i>Ta réponse devra être accompagnée de calculs.</i></p>
   ${op3(bar(3,0,150),"Part d'Alice","+",bar(6,0,180),"Part de Benoît",bar(6,0,180),"Part totale mangée par les 2")}
   <p><b>2) Partage de la tarte aux pommes</b></p>${ex("tarte.jpg","Tarte aux pommes",150)}<p>Au goûter suivant, Alice et Benoît doivent se partager une tarte aux pommes. Alice a très faim et a mangé la moitié du gâteau. Benoît a pris {2/5} du gâteau.</p><p>Quelle fraction du gâteau a été mangée par ces deux enfants ? <i>Ta réponse devra être accompagnée de calculs.</i></p>
   ${op3(disk(2,0),"Part d'Alice","+",disk(5,0),"Part de Benoît",disk(10,0),"Part totale mangée par les 2")}
   <p><b>3) Partage de la pizza</b></p>${ex("pizza.png","Pizza",130)}<p>Au dîner, Arnaud et Jules ont mangé à tous les deux la moitié de la pizza. Arnaud a mangé les {2/5} de la pizza.</p><p>Quelle fraction de la pizza a mangé Jules ?</p>
   ${op3(disk(2,0),"Part mangée au total","−",disk(5,0),"Part d'Arnaud",disk(10,0),"Part de Jules")}`,
   c:`<p><b>1)</b> Un tiers = {1/3} = {2/6}.</p>${op3(bar(3,1,150),"{1/3}","+",bar(6,1,180),"{1/6}",bar(6,3,180),"{3/6}")}
   <p class="calc">{1/3} + {1/6} = {1 × 2/3 × 2} + {1/6} = {2/6} + {1/6} = {3/6} = {1/2}</p><p>Les deux enfants ont mangé <b>la moitié</b> du pain d'épices.</p>
   <p><b>2)</b> La moitié = {1/2} = {5/10} et {2/5} = {4/10}.</p>${op3(disk(2,1),"{1/2}","+",disk(5,2),"{2/5}",disk(10,9),"{9/10}")}
   <p class="calc">{1/2} + {2/5} = {1 × 5/2 × 5} + {2 × 2/5 × 2} = {5/10} + {4/10} = {9/10}</p><p>Ils ont mangé <b>{9/10}</b> de la tarte.</p>
   <p><b>3)</b></p>${op3(disk(2,1),"{1/2}","−",disk(5,2),"{2/5}",disk(10,1),"{1/10}")}
   <p class="calc">{1/2} − {2/5} = {5/10} − {4/10} = {1/10}</p><p>Jules a mangé <b>{1/10}</b> de la pizza.</p>`},
  {n:"Exercice 5", t:"Le cocktail", w:"Sur ton cahier", h:`${ex("cocktail.jpg","Cocktail",140)}<p>Maya prépare un cocktail pour son anniversaire. Dans une carafe ayant une contenance d'un litre, elle verse :</p><p>{1/3} L de jus d'orange, {1/4} L de jus de mangue et {2/12} L de jus d'ananas.</p><p>Son copain Achille lui crie : « Stop, ça va déborder ! »</p><p>A-t-il raison ?</p>`,
   c:`<p>Le dénominateur commun est 12.</p><p class="calc">{1/3} + {1/4} + {2/12} = {4/12} + {3/12} + {2/12} = {9/12} = {3/4}</p><p>{3/4} L est moins que 1 L ({3/4} &lt; 1) : <b>non</b>, Achille a tort, ça ne va pas déborder.</p>`},
  {n:"Exercice 6", t:"Voyage en Espagne", w:"Sur ton cahier", h:`<p>Deux classes de 4<sup>e</sup> partent en voyage en Espagne. Pour financer le voyage, les élèves d'une classe décident de vendre des cartes de vœux.</p><p>Ils récoltent ainsi les trois cinquièmes de la somme nécessaire.</p><p>Les élèves de l'autre classe décident de vendre des tickets de tombola, ce qui leur permet d'obtenir les trois huitièmes de la somme totale.</p><p>Les élèves ont-ils suffisamment d'argent pour payer la totalité du voyage ?</p>`,
   c:`<p class="calc">{3/5} + {3/8} = {3 × 8/5 × 8} + {3 × 5/8 × 5} = {24/40} + {15/40} = {39/40}</p><p>{39/40} &lt; {40/40} = 1 : <b>non</b>, il leur manque {1/40} de la somme totale.</p>`},
  {n:"Exercice 7", t:"Tapisserie", w:"Sur ton cahier", h:`<p>Maxime refait la tapisserie de son salon.</p><p>Il pose {4/15} du papier peint le premier jour, {2/5} le deuxième jour et {1/6} le troisième jour.</p><p>A-t-il fini ?</p>`,
   c:`<p>Le dénominateur commun est 30 (15 × 2 = 30 ; 5 × 6 = 30 ; 6 × 5 = 30).</p><p class="calc">{4/15} + {2/5} + {1/6} = {8/30} + {12/30} + {5/30} = {25/30} = {5/6}</p><p>{5/6} &lt; 1 : <b>non</b>, il n'a pas fini. Il lui reste {1/6} du papier peint à poser.</p>`},
  {n:"Exercice 8", t:"Élections", w:"Sur ton cahier", h:`<p>Lors des élections des délégués de classe, il y avait trois candidats : Axelle, Marc et Léa.</p><p>Axelle a obtenu {5/12} des voix, Marc {1/4} des voix et Léa le reste.</p><p>Quel élève a obtenu le plus de voix ?</p>`,
   c:`<p>Marc : {1/4} = {3/12}.</p><p class="calc">Léa : 1 − {5/12} − {3/12} = {12/12} − {5/12} − {3/12} = {4/12} = {1/3}</p><p>Axelle {5/12}, Marc {3/12}, Léa {4/12} : c'est <b>Axelle</b> qui a obtenu le plus de voix.</p>`},
  {n:"Exercice 9", t:"Utilisation de l'eau sur Terre", w:"Sur ton cahier", h:`<p>Sept dixièmes de l'eau utilisée sur la Terre servent à l'agriculture ; l'industrie en utilise le cinquième.</p><p>Le reste est pour la consommation domestique (boisson, cuisine, hygiène).</p><p>Quelle fraction de la consommation totale représente la consommation domestique ?</p>`,
   c:`<p class="calc">Agriculture et industrie : {7/10} + {1/5} = {7/10} + {2/10} = {9/10}<br>Consommation domestique : 1 − {9/10} = {10/10} − {9/10} = {1/10}</p><p>La consommation domestique représente <b>{1/10}</b> de la consommation totale.</p>`},
  {n:"Exercice 10", t:"Le TGV", w:"Sur ton cahier", h:`<p>Un TGV vient de quitter Paris en direction de Bordeaux. Il roule jusqu'à Poitiers sans arrêt.</p><p>Au départ de Paris, le tiers des places de la voiture n° 16 sont occupées.</p><p>Lors de son arrêt à Poitiers, aucun passager ne descend mais des passagers montent à bord. Les {5/7} des places de la voiture n° 16 sont maintenant occupées.</p><p>Quelle fraction du nombre de places de la voiture n° 16 représentent les places prises par les passagers montés à Poitiers ?</p>`,
   c:`<p class="calc">{5/7} − {1/3} = {5 × 3/7 × 3} − {1 × 7/3 × 7} = {15/21} − {7/21} = {8/21}</p><p>Les passagers montés à Poitiers occupent <b>{8/21}</b> des places de la voiture n° 16.</p>`}
 ]},
{t:"Entraînement aux calculs", e:[
  {n:"Exercice 11", t:"Entraînement aux calculs", w:"Sur ton cahier", h:`<p><b>1)</b> Calcule ces 5 expressions.</p><p>A = {1/3} + {2/4}</p><p>B = {8/5} + {3/7}</p><p>C = {3/8} + {2/6}</p><p>D = {7/18} + {2/9}</p><p>E = 4 + {3/5}</p>
   <p><b>2)</b> Simplifie ces fractions en indiquant tes calculs.</p><p>A = {12/10}</p><p>B = {28/35}</p><p>C = {−40/48}</p><p>D = {−16/−24}</p><p>E = {108/72}</p>`,
   c:`<p><b>1)</b></p>${calc("A",["{1/3} + {2/4}","{1 × 4/3 × 4} + {2 × 3/4 × 3}","{4/12} + {6/12}","{10/12}","{10 ÷ 2/12 ÷ 2}","{5/6}"])}
   ${calc("B",["{8/5} + {3/7}","{8 × 7/5 × 7} + {3 × 5/7 × 5}","{56/35} + {15/35}","{71/35}"])}
   ${calc("C",["{3/8} + {2/6}","{3 × 3/8 × 3} + {2 × 4/6 × 4}","{9/24} + {8/24}","{17/24}"])}
   ${calc("D",["{7/18} + {2/9}","{7/18} + {2 × 2/9 × 2}","{7/18} + {4/18}","{11/18}"])}
   ${calc("E",["4 + {3/5}","{4 × 5/1 × 5} + {3/5}","{20/5} + {3/5}","{23/5}"])}
   <p><b>2)</b></p>${calc("A",["{12/10}","{12 ÷ 2/10 ÷ 2}","{6/5}"])}${calc("B",["{28/35}","{28 ÷ 7/35 ÷ 7}","{4/5}"])}${calc("C",["{−40/48}","{−40 ÷ 8/48 ÷ 8}","{−5/6}"])}
   ${calc("D",["{−16/−24}","{16/24}","{16 ÷ 8/24 ÷ 8}","{2/3}"])}<p>(Le quotient de deux nombres négatifs est positif.)</p>${calc("E",["{108/72}","{108 ÷ 36/72 ÷ 36}","{3/2}"])}<p>(On peut aussi simplifier en plusieurs étapes : par 9 puis par 4, ou par 4 puis par 9.)</p>`}
 ]},
{t:"Pour les plus rapides", e:[
  {n:"Exercice 12", t:"Défi", w:"Sur ton cahier", h:`<p>Avec deux des quatre nombres suivants :</p><p class="calc">{2/5} &nbsp;&nbsp; {−3/5} &nbsp;&nbsp; −{7/10} &nbsp;&nbsp; {11/20}</p><p>a) calcule la plus grande somme possible A ;</p><p>b) calcule la plus petite somme possible B ;</p><p>c) calcule la plus grande différence possible C ;</p><p>d) calcule la plus petite différence possible D.</p>`,
   c:`<p>On écrit les quatre nombres en vingtièmes : {2/5} = {8/20} ; {−3/5} = {−12/20} ; −{7/10} = {−14/20} ; {11/20}.</p><p>Rangés : {−14/20} &lt; {−12/20} &lt; {8/20} &lt; {11/20}.</p>
   <p>a) On ajoute les deux plus grands. b) On ajoute les deux plus petits.</p>${chns([["A",["{2/5} + {11/20}","{8/20} + {11/20}","<b>{19/20}</b>"]],["B",["{−3/5} + (−{7/10})","{−12/20} + {−14/20}","{−26/20}","<b>{−13/10}</b>"]]])}
   <p>c) Le plus grand moins le plus petit. d) Le plus petit moins le plus grand.</p>${chns([["C",["{11/20} − (−{7/10})","{11/20} + {14/20}","{25/20}","<b>{5/4}</b>"]],["D",["−{7/10} − {11/20}","{−14/20} − {11/20}","{−25/20}","<b>{−5/4}</b>"]]])}`},
  {n:"Exercice 13", t:"À vélo", w:"Sur ton cahier", h:`${ex("velo.jpg","Vélo",130)}<p>Coline part du collège à vélo pour rentrer chez elle.</p><p>Elle parcourt les deux cinquièmes de son trajet quand elle s'aperçoit que son cartable est tombé de son porte-bagages.</p><p>Elle fait donc demi-tour et roule en sens inverse sur un sixième du parcours total, ramasse son cartable et remonte sur son vélo.</p><p>Il lui reste 2,3 km à parcourir jusque chez elle.</p><p>Quelle est la distance entre chez elle et son collège ?</p>`,
   c:`<p>Après le demi-tour, Coline se trouve à :</p><p class="calc">{2/5} − {1/6} = {12/30} − {5/30} = {7/30} du trajet</p><p>Il lui reste donc 1 − {7/30} = {23/30} du trajet, qui correspondent à 2,3 km.</p><p class="calc">{1/30} du trajet : 2,3 ÷ 23 = 0,1 km<br>Le trajet entier : 30 × 0,1 = 3 km</p><p>La distance entre chez elle et le collège est <b>3 km</b>.</p>`},
  {n:"Exercice 14", t:"Sommeil", w:"Sur ton cahier", h:`<p>Notre nuit de sommeil se divise en quatre phases : le temps d'endormissement, le sommeil léger, le sommeil lent profond et le sommeil paradoxal.</p><p>Dans un hôpital, on a enregistré les durées des différents types de sommeil d'un patient, en fraction de la durée totale :</p><p>• temps d'endormissement : {1/48} ;</p><p>• sommeil profond : {7/24} ;</p><p>• la phase de sommeil léger est plus longue que celle de sommeil profond ;</p><p>• la différence entre la phase de sommeil léger et celle de sommeil profond représente {1/8} de la durée totale de sommeil.</p><p>Quelle est la part de la phase de sommeil paradoxal ?</p>`,
   c:`<p class="calc">Sommeil léger : {7/24} + {1/8} = {7/24} + {3/24} = {10/24}</p><p>On écrit tout en quarante-huitièmes : {1/48} ; {7/24} = {14/48} ; {10/24} = {20/48}.</p><p class="calc">Sommeil paradoxal : 1 − {1/48} − {14/48} − {20/48} = {48/48} − {35/48} = {13/48}</p><p>Le sommeil paradoxal représente <b>{13/48}</b> de la durée totale de sommeil.</p>`},
  {n:"Exercice 15", t:"Carré divisé", w:"Sur ton cahier", h:`${CARRE}<p><b>1)</b> Quelle fraction du carré est :</p><p>a) violette ?</p><p>b) orange ?</p><p>c) rouge ?</p><p>d) noire ?</p><p><b>2)</b> Calcule la somme de ces fractions.</p>`,
   c:`<p>On partage le carré en 16 petits carrés (4 × 4). Un petit carré = {1/16} du carré.</p>
   <p><b>1)</b> a) Violette : un carré de 2 × 2 = 4 petits carrés, plus un triangle de 1 petit carré : 5 petits carrés, soit <b>{5/16}</b>.</p><p>b) Orange : trois rectangles de 2 petits carrés et deux triangles de 1 petit carré : 8 petits carrés, soit {8/16} = <b>{1/2}</b>.</p>
   <p>c) Rouge : le carré penché vaut 2 petits carrés (4 moitiés) et le petit triangle vaut une moitié de petit carré : 5 moitiés de petit carré.</p><p>Le grand carré contient 16 × 2 = 32 moitiés de petit carré : la partie rouge est <b>{5/32}</b> du carré.</p><p>d) Noire : une moitié de petit carré, soit <b>{1/32}</b> du carré.</p>
   <p><b>2)</b></p><p class="calc">{5/16} + {1/2} + {5/32} + {1/32} = {10/32} + {16/32} + {5/32} + {1/32} = {32/32} = 1</p><p>La somme vaut 1 : les quatre couleurs recouvrent tout le carré.</p>`},
  {n:"Exercice 16", t:"Observer", w:"Sur ton cahier", h:`<p>Dans cette grille, retrouve six carrés de 4 cases où figurent des nombres dont la somme est 1.</p>${grid(GRILLE)}`,
   c:`<p>On écrit tous les nombres en douzièmes ({1/6} = {2/12} ; {1/3} = {4/12} ; {1/4} = {3/12} ; {1/2} = {6/12}) : il faut que les 4 numérateurs fassent 12.</p>
   <p>Les six carrés (lignes ; colonnes) :</p><p>lignes 1-2 et colonnes 3-4 : 2 + 5 + 4 + 1 = 12</p><p>lignes 1-2 et colonnes 5-6 : 4 + 4 + 3 + 1 = 12</p><p>lignes 2-3 et colonnes 1-2 : 4 + 2 + 3 + 3 = 12</p><p>lignes 3-4 et colonnes 2-3 : 3 + 6 + 2 + 1 = 12</p><p>lignes 3-4 et colonnes 3-4 : 6 + 4 + 1 + 1 = 12</p><p>lignes 3-4 et colonnes 4-5 : 4 + 2 + 1 + 5 = 12</p>${grid(GRILLE,squares(GRILLE))}`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Égalité de quotients", schema:S_EG, q:{
 1:[ {g:()=>{ const d=ri(2,9), n=ri(1,d*2), k=ri(2,6); return {q:`Complète : ${F(n,d)} = {…/${d*k}}`, rep:[String(n*k)], ex:`${d} × ${k} = ${d*k}, donc on multiplie aussi le numérateur par ${k} : ${n} × ${k} = ${n*k}.`, sx:S_EG}; }} ],
 2:[ {g:()=>{ let n,d; do{ d=ri(3,9); n=ri(1,d*2); }while(gcd(n,d)!==1); const k=ri(2,5);
       return {q:`Quelle fraction est égale à ${F(n,d)} ?`, c:shuf(uniq(F(n*k,d*k),[F(n+k,d+k),F(n*k,d),F(n,d*k)])), rep:F(n*k,d*k), ex:`${F(n,d)} = {${n} × ${k}/${d} × ${k}} = ${F(n*k,d*k)}. Ajouter le même nombre en haut et en bas ne donne pas une fraction égale.`, sx:S_EG}; }} ],
 3:[ {g:()=>{ const a=ri(2,9), d=ri(2,9); return {q:`Écris ${a} sous forme d'une fraction de dénominateur ${d} : ${a} = {…/${d}}`, rep:[String(a*d)], ex:`${a} = {${a}/1} = {${a} × ${d}/1 × ${d}} = ${F(a*d,d)}.`, sx:S_EG}; }},
     {q:"Vrai ou faux : on obtient une fraction égale en ajoutant le même nombre au numérateur et au dénominateur.", c:["Vrai","Faux"], rep:"Faux", ex:"Par exemple {1/2} = {2/4}, mais {1 + 1/2 + 1} = {2/3}, qui n'est pas égal à {1/2}. On doit multiplier ou diviser.", sx:S_EG} ]
}},
{nom:"Simplifier une fraction", schema:S_SIMP, q:{
 1:[ {g:()=>{ let n,d; do{ d=ri(2,9); n=ri(1,9); }while(gcd(n,d)!==1||n===d); const k=pick([2,3,5,10]); return {q:`Simplifie la fraction ${F(n*k,d*k)} (écris une fraction irréductible).`, rep:TYs(n,d), ex:`${F(n*k,d*k)} = {${n*k} ÷ ${k}/${d*k} ÷ ${k}} = ${R(n,d)}.`, sx:S_SIMP}; }} ],
 2:[ {g:()=>{ let n,d; do{ d=ri(2,12); n=ri(1,15); }while(gcd(n,d)!==1||n===d); const k=pick([6,7,8,9,12,14,15]); return {q:`Simplifie la fraction ${F(n*k,d*k)} au maximum.`, rep:TYs(n,d), ex:`On divise par ${k} : ${F(n*k,d*k)} = {${n*k} ÷ ${k}/${d*k} ÷ ${k}} = ${R(n,d)}.`, sx:S_SIMP}; }} ],
 3:[ {g:()=>{ const by=pick([3,9]); let good; do{ good=ri(100,999); }while(good%by!==0||(by===3&&good%9===0)); const bad=[]; while(bad.length<3){ const x=ri(100,999); if(x%3!==0&&!bad.includes(x)) bad.push(x); }
       const s=String(good).split("").map(Number); return {q:`Lequel de ces nombres est divisible par ${by} ?`, c:shuf([good,...bad].map(String)), rep:String(good), ex:`${s.join(" + ")} = ${s.reduce((a,b)=>a+b,0)}, qui est un multiple de ${by}.`, sx:S_SIMP}; }},
     {g:()=>{ const n=pick([[-40,48],[-16,-24],[18,-27],[-35,-49]]), [a,b]=n, g=gcd(a,b), s=(a<0)!==(b<0)?-1:1; const ans=s*Math.abs(a)/g, den=Math.abs(b)/g;
       return {q:`Simplifie : {${M(a)}/${M(b)}}`, rep:[TY(ans,den)], ex:`${s>0?"Deux nombres de même signe : le quotient est positif.":"Deux nombres de signes contraires : le quotient est négatif."} On divise par ${g} : ${F(ans,den)}.`, sx:S_SIMP, kb:"text"}; }} ]
}},
{nom:"Comparer des fractions", schema:S_CMP, q:{
 1:[ {g:()=>{ const d=ri(3,15); let a,c; do{ a=ri(1,2*d); c=ri(1,2*d); }while(a===c); const s=a<c?LT:GT; return {q:`Compare : ${F(a,d)} … ${F(c,d)}`, c:[LT,GT,"="], rep:s, ex:`Même dénominateur : on compare les numérateurs, ${a} ${s} ${c}.`, sx:S_CMP}; }} ],
 2:[ {g:()=>{ const b=ri(2,7), k=ri(2,4), d=b*k; let a,c; do{ a=ri(1,2*b); c=ri(1,2*d); }while(gcd(a,b)!==1); const C=cmpSteps(a,b,c,d); return {q:`Compare : ${F(a,b)} … ${F(c,d)}`, c:[LT,GT,"="], rep:C.s, ex:`${C.txt} ${C.txt2}`, sx:S_CMP}; }} ],
 3:[ {g:()=>{ let b,d,a,c,C; do{ b=ri(2,9); d=ri(2,9); a=ri(1,2*b); c=ri(1,2*d); C=cmpSteps(a,b,c,d); }while(b===d||lcm(b,d)===Math.max(b,d)||Math.abs(C.A-C.C)>3||C.A===C.C); return {q:`Compare : ${F(a,b)} … ${F(c,d)}`, c:[LT,GT,"="], rep:C.s, ex:`Dénominateur commun : ${C.m}. ${C.txt} ${C.txt2}`, sx:S_CMP}; }},
     {g:()=>{ const n=ri(1,4), d=ri(2,6), m=pick([-1,1]), num=n*d+m; const s=num<n*d?LT:GT; return {q:`Compare : ${n} … ${F(num,d)}`, c:[LT,GT,"="], rep:s===LT?GT:LT, ex:`${n} = ${F(n*d,d)} et ${n*d} ${s===LT?GT:LT} ${num}.`, sx:S_CMP}; }} ]
}},
{nom:"Additionner et soustraire", schema:S_ADD, q:{
 1:[ {g:()=>{ const P=genAdd("meme"); return {q:`Calcule et simplifie si possible : ${F(P.a,P.b)} ${P.op} ${F(P.c,P.d)}`, rep:TYs(P.S.n,P.S.m), ex:line(P.S.L)+".", sx:S_ADD, kb:"text"}; }} ],
 2:[ {g:()=>{ const P=genAdd("mult"); return {q:`Calcule et simplifie si possible : ${F(P.a,P.b)} ${P.op} ${F(P.c,P.d)}`, rep:TYs(P.S.n,P.S.m), ex:line(P.S.L)+".", sx:S_ADD, kb:"text"}; }},
     {g:()=>{ const P=genAdd("mult"), good=R(P.S.n,P.S.m); return {q:`${F(P.a,P.b)} ${P.op} ${F(P.c,P.d)} = ?`, c:shuf(uniq(good,[F(P.op==="+"?P.a+P.c:P.a-P.c,P.b+P.d), F(P.op==="+"?P.a+P.c:P.a-P.c,Math.max(P.b,P.d)), R(P.S.n+1,P.S.m)])), rep:good, ex:`On n'additionne pas les dénominateurs : ${line(P.S.L)}.`, sx:S_ADD}; }} ],
 3:[ {g:()=>{ const P=genAdd("quel",true); return {q:`Calcule et simplifie si possible : ${F(P.a,P.b)} ${P.op} ${F(P.c,P.d)}`, rep:TYs(P.S.n,P.S.m), ex:line(P.S.L)+".", sx:S_ADD, kb:"text"}; }},
     {g:()=>{ const a=ri(1,5), d=ri(2,9), c=ri(1,d-1), op=pick(["+","−"]), S=addSteps(a,1,c,d,op); return {q:`Calcule : ${a} ${op} ${F(c,d)}`, rep:TYs(S.n,S.m), ex:line(S.L)+".", sx:S_ADD, kb:"text"}; }} ]
}},
{nom:"Problèmes", schema:S_PB, q:{
 1:[ {g:()=>{ const [b,d]=pick([[3,6],[2,4],[2,6],[4,8],[3,9],[5,10],[2,8]]); const S=addSteps(1,b,1,d,"+"); return {q:`Alice mange {1/${b}} d'un gâteau et Benoît {1/${d}}. Quelle fraction du gâteau ont-ils mangée ensemble ?`, rep:TYs(S.n,S.m), ex:line(S.L)+".", sx:S_PB}; }} ],
 2:[ {g:()=>{ for(;;){ const b=pick([3,4,5,6,8,10,12]), d=pick([3,4,5,6,8,10,12]); if(b===d) continue; const a=ri(1,b-1), c=ri(1,d-1); if(gcd(a,b)>1||gcd(c,d)>1) continue; const m=lcm(b,d); const n=m-a*m/b-c*m/d; if(n<=0||m>40) continue;
       return {q:`Dans un sondage, {${a}/${b}} des élèves préfèrent le foot, {${c}/${d}} le basket et les autres le tennis. Quelle fraction des élèves préfère le tennis ?`, rep:TYs(n,m), ex:`1 − ${F(a,b)} − ${F(c,d)} = ${F(m,m)} − ${F(a*m/b,m)} − ${F(c*m/d,m)} = ${F(n,m)}${gcd(n,m)>1?" = "+R(n,m):""}.`, sx:S_PB}; } }} ],
 3:[ {g:()=>{ const [p,q]=pick([[2,5],[1,3],[3,4],[2,3],[3,5],[1,4]]), k=ri(1,6), rest=(q-p)*k, T=q*k; return {q:`Léo a parcouru {${p}/${q}} de son trajet. Il lui reste ${rest} km à faire. Quelle est la longueur totale du trajet (en km) ?`, rep:[String(T), T+" km"], ex:`Il reste 1 − ${F(p,q)} = ${F(q-p,q)} du trajet, soit ${rest} km. Donc {1/${q}} du trajet = ${rest} ÷ ${q-p} = ${k} km, et le trajet entier = ${q} × ${k} = ${T} km.`, sx:S_PB}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 11", duree:45, info:"Durée : 45 min · Calculatrice non autorisée · Les calculs doivent être détaillés",
comp:[
  ["CALCULER","J'écris des fractions égales et je simplifie une fraction.","Ex. 1 (4 points)"],
  ["RAISONNER","Je compare deux fractions en les écrivant avec le même dénominateur.","Ex. 2 (4 points)"],
  ["CALCULER","J'additionne et je soustrais des fractions, puis je simplifie le résultat.","Ex. 3 (6 points)"],
  ["MODÉLISER","Je résous un problème avec des fractions.","Ex. 4 et 5 (6 points)"]
],
exos:[
{t:"Fractions égales et simplification", p:4, h:`<p><b>1)</b> Complète.</p><p>a) {3/7} = {…/21} &nbsp;&nbsp; b) 5 = {…/3}</p><p><b>2)</b> Simplifie au maximum en détaillant les calculs.</p><p>A = {18/24} &nbsp;&nbsp; B = {45/60} &nbsp;&nbsp; C = {56/42}</p>`,
 c:`<p><b>1)</b> a) {3/7} = {3 × 3/7 × 3} = {9/21} · b) 5 = {5 × 3/1 × 3} = {15/3} <i>(0,5 point chacun)</i></p>
 <p><b>2)</b></p>${chns([["A",["{18/24}","{18 ÷ 6/24 ÷ 6}","{3/4}"]],["B",["{45/60}","{45 ÷ 15/60 ÷ 15}","{3/4}"]],["C",["{56/42}","{56 ÷ 14/42 ÷ 14}","{4/3}"]]])}<p><i>(1 point chacune ; on peut simplifier en plusieurs étapes)</i></p>`},
{t:"Comparer", p:4, h:`<p>Compare les deux nombres. Justifie.</p><p>a) {4/9} et {13/27} &nbsp;&nbsp; b) {7/6} et {11/9} &nbsp;&nbsp; c) {3/4} et {15/20} &nbsp;&nbsp; d) 2 et {9/4}</p>`,
 c:`<p>a) {4/9} = {4 × 3/9 × 3} = {12/27} et {12/27} &lt; {13/27}, donc {4/9} &lt; {13/27}. · b) {7/6} = {7 × 3/6 × 3} = {21/18} et {11/9} = {11 × 2/9 × 2} = {22/18}, donc {7/6} &lt; {11/9}. · c) {3/4} = {3 × 5/4 × 5} = {15/20}, donc {3/4} = {15/20}. · d) 2 = {2 × 4/1 × 4} = {8/4} et {8/4} &lt; {9/4}, donc 2 &lt; {9/4}.</p><p><i>(1 point par comparaison justifiée)</i></p>`},
{t:"Calculer", p:6, h:`<p>Calcule et donne le résultat sous forme d'une fraction la plus simple possible.</p><p>A = {5/9} + {2/9} &nbsp;&nbsp; B = {7/12} − {1/4} &nbsp;&nbsp; C = {3/5} + {1/15}</p><p>D = {2/3} + {3/4} &nbsp;&nbsp; E = {5/6} − {4/9} &nbsp;&nbsp; F = 3 − {5/7}</p>`,
 c:`${calc("A",["{5/9} + {2/9}","{7/9}"])}${calc("B",["{7/12} − {1/4}","{7/12} − {1 × 3/4 × 3}","{7/12} − {3/12}","{4/12}","{4 ÷ 4/12 ÷ 4}","{1/3}"])}${calc("C",["{3/5} + {1/15}","{3 × 3/5 × 3} + {1/15}","{9/15} + {1/15}","{10/15}","{10 ÷ 5/15 ÷ 5}","{2/3}"])}
 ${calc("D",["{2/3} + {3/4}","{2 × 4/3 × 4} + {3 × 3/4 × 3}","{8/12} + {9/12}","{17/12}"])}${calc("E",["{5/6} − {4/9}","{5 × 3/6 × 3} − {4 × 2/9 × 2}","{15/18} − {8/18}","{7/18}"])}${calc("F",["3 − {5/7}","{3 × 7/1 × 7} − {5/7}","{21/7} − {5/7}","{16/7}"])}<p><i>(1 point par calcul juste et simplifié)</i></p>`},
{t:"La randonnée", p:3, h:`<p>Inès fait une randonnée en deux jours.</p><p>Le premier jour, elle parcourt les {2/7} du trajet.</p><p>Le deuxième jour, elle parcourt le tiers du trajet.</p><p>a) Quelle fraction du trajet a-t-elle parcourue en deux jours ?</p><p>b) Quelle fraction du trajet lui reste-t-il à parcourir ?</p>`,
 c:`<p>a) {2/7} + {1/3} = {6/21} + {7/21} = {13/21} <i>(1,5 point)</i></p><p>b) 1 − {13/21} = {21/21} − {13/21} = {8/21} : il lui reste {8/21} du trajet. <i>(1,5 point)</i></p>`},
{t:"Le jardin", p:3, h:`<p>Dans son jardin, Paul a planté des légumes sur {1/4} de la surface et des fleurs sur {3/8} de la surface.</p><p>Le reste du jardin est de la pelouse.</p><p>a) Quelle fraction du jardin est occupée par la pelouse ?</p><p>b) Quelle partie du jardin est la plus grande ? Justifie.</p>`,
 c:`<p>a) {1/4} = {2/8}. Pelouse : 1 − {2/8} − {3/8} = {8/8} − {5/8} = {3/8} <i>(2 points)</i></p><p>b) Légumes {2/8}, fleurs {3/8}, pelouse {3/8} : les fleurs et la pelouse occupent la même surface, la plus grande ({3/8} chacune). <i>(1 point)</i></p>`}
]}
};
/* calculs en chaîne « A = … » dans les explications du QCM (simplifier, additionner et soustraire) */
CH["4e-11"].quiz.forEach((N,ni)=>{ if(ni!==1 && ni!==3) return; Object.values(N.q).forEach(list=>list.forEach((it,i)=>{ if(it.g){ const g=it.g; list[i]={g:()=>qChain(g())}; } else list[i]=qChain(it); })); });
})();
