/* Schémas explicatifs pour « Je m'entraîne »
   - un « rappel en image » par notion (bouton pendant la question, et affiché après une erreur)
   - un schéma calculé avec les nombres de la question, quand c'est possible (SX.auto) */
(function(){
const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g," ");
const num = s => +String(s).replace(/[\s ]/g,"");
const gcd = (a,b) => b ? gcd(b, a%b) : a;
const SX = window.SX = {};

/* ---------- briques ---------- */
SX.box = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
SX.row = (...items) => `<div class="schRow">${items.join("")}</div>`;
SX.cap = (fig, txt) => `<figure class="schFig">${fig}<figcaption>${txt}</figcaption></figure>`;
SX.steps = lines => `<ol class="steps">${lines.map(l=>`<li>${l}</li>`).join("")}</ol>`;
const img2 = (p, alt, w) => `<img class="figimg" ${imgSrc(p)} alt="${alt}" style="width:${w}px">`;

/* tableau de numération, avec une colonne surlignée */
SX.numTable = (n, hi=-1) => { const s=String(n).padStart(9," ").slice(-9);
  return `<div class="scroll"><table class="num sm"><thead><tr><th colspan="3">Millions</th><th colspan="3">Mille</th><th colspan="3">Unités</th></tr><tr>${"<th>c</th><th>d</th><th>u</th>".repeat(3)}</tr></thead><tbody><tr>${s.split("").map((ch,i)=>`<td class="${8-i===hi?"hi":""}">${ch===" "?"":ch}</td>`).join("")}</tr></tbody></table></div>`; };

/* un nombre découpé en classes, avec les mots */
SX.classes = n => { const m=Math.floor(n/1e6), k=Math.floor(n/1000)%1000, u=n%1000, parts=[];
  if(m) parts.push([String(m), lettres(m*1e6), "millions"]);
  if(k) parts.push([m?String(k).padStart(3,"0"):String(k), lettres(k*1000), "mille"]);
  if(u) parts.push([(m||k)?String(u).padStart(3,"0"):String(u), lettres(u), "unités"]);
  return `<div class="cls3">${parts.map(([d,w,c])=>`<div><span class="cd">${d}</span><span class="cc">classe des ${c}</span><span class="cw">${w}</span></div>`).join("")}</div>
    <p class="schN">${sp(n)} s'écrit : <b>${lettres(n)}</b></p>`; };

/* deux fractions égales avec les flèches × k ou ÷ k */
SX.frEq = (a,b,c,d,k,op) => `<svg class="fig freq" viewBox="0 0 260 160" width="240" role="img" aria-label="${a}/${b} = ${c}/${d}">
  <defs><marker id="ahc" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--c)"/></marker></defs>
  <path d="M82 40 Q130 6 176 40" class="arrw" marker-end="url(#ahc)"/><text x="129" y="20" class="alab">${op} ${k}</text>
  <path d="M82 122 Q130 156 176 122" class="arrw" marker-end="url(#ahc)"/><text x="129" y="154" class="alab">${op} ${k}</text>
  <text x="68" y="70" class="fbig">${a}</text><line x1="40" y1="82" x2="96" y2="82" class="ln"/><text x="68" y="110" class="fbig">${b}</text>
  <text x="130" y="90" class="fbig">=</text>
  <text x="192" y="70" class="fbig">${c}</text><line x1="164" y1="82" x2="220" y2="82" class="ln"/><text x="192" y="110" class="fbig">${d}</text></svg>`;

/* zoom sur une demi-droite entre deux entiers consécutifs */
SX.zoom = (n,d) => { const e=Math.floor(n/d), r=n%d;
  return SX.cap(axis({n:d, lab:[[0,String(e)],[d,String(e+1)]], major:[0,d], pts:[["★",r]]}), `Entre ${e} et ${e+1}, l'unité est partagée en ${d} : {${n}/${d}} (★) est à ${r} graduation${r>1?"s":""} après ${e}.`); };

/* division posée + formule colorée */
SX.div = (N,d) => { const q=Math.floor(N/d), r=N%d;
  return SX.row(potence(N,d), `<div class="formula"><span><b>${d}</b><i>diviseur</i></span>×<span><b>${q}</b><i>quotient</i></span>+<span><b>${r}</b><i>reste</i></span>=<span><b>${sp(N)}</b><i>dividende</i></span></div>`)
    + `<p class="schN">Le reste (${r}) est toujours plus petit que le diviseur (${d}).</p>`; };

/* étapes d'un calcul avec priorités : ce qu'on calcule est surligné */
SX.prio = expr => {
  let t = expr.replace(/\s+/g,"").match(/\d+|[×÷+−()]/g); if(!t) return "";
  const render = (toks, a=-1, b=-1) => toks.map((x,i)=>(i===a?"<mark>":"")+x+(i===b?"</mark>":"")).join(" ").replace(/\( /g,"(").replace(/ \)/g,")").replace(/<mark>\( /g,"<mark>(");
  const lines=[]; let guard=0;
  while(t.length>1 && guard++<30){
    let lo=0, hi=t.length, open=-1;
    for(let i=0;i<t.length;i++){ if(t[i]==="(") open=i; if(t[i]===")"){ lo=open+1; hi=i; break; } }
    if(lo>0 && hi-lo===1){ t.splice(lo-1,3,t[lo]); continue; }
    const seg=t.slice(lo,hi); let j=seg.findIndex(x=>x==="×"||x==="÷"); if(j<0) j=seg.findIndex(x=>x==="+"||x==="−"); if(j<1) break;
    const A=+seg[j-1], B=+seg[j+1], op=seg[j], v= op==="×"?A*B: op==="÷"?A/B: op==="+"?A+B:A-B;
    lines.push(render(t, lo+j-1, lo+j+1)); t.splice(lo+j-1,3,String(v));
  }
  lines.push(render(t));
  return `<p class="calc prio">${lines.map((l,i)=>`<span>${i?"= ":""}${l}</span>`).join("<br>")}</p><p class="schN">À chaque ligne, le calcul surligné est celui qu'on fait en premier.</p>`; };

/* critères de divisibilité */
SX.digits = (n, d) => { const ds=String(n).split(""), s=ds.reduce((a,c)=>a+ +c,0);
  if(d===3||d===9) return `<div class="digits">${ds.map(x=>`<span>${x}</span>`).join("<i>+</i>")}<i>=</i><b>${s}</b></div><p class="schN">${s} ${s%d===0?"est":"n'est pas"} un multiple de ${d}, donc ${sp(n)} ${s%d===0?"est":"n'est pas"} divisible par ${d}.</p>`;
  return `<div class="digits">${ds.map((x,i)=>`<span class="${i===ds.length-1?"hi":""}">${x}</span>`).join("")}</div><p class="schN">On regarde seulement le chiffre des unités : <b>${ds[ds.length-1]}</b>. ${d===2?"Divisible par 2 s'il est 0, 2, 4, 6 ou 8.":d===5?"Divisible par 5 s'il est 0 ou 5.":"Divisible par 10 s'il est 0."}</p>`; };

/* diviseurs trouvés par paires */
SX.pairs = N => { const P=[]; for(let p=1;p*p<=N;p++) if(N%p===0) P.push([p,N/p]);
  const all=[...new Set(P.flat())].sort((a,b)=>a-b);
  return `<div class="pairs">${P.map(([p,q])=>`<span>${p} × ${q}</span>`).join("")}</div><p class="schN">On cherche les multiplications qui donnent ${N}. Diviseurs de ${N} : <b>${all.join(", ")}</b> (${all.length} diviseurs).</p>`; };

/* table de multiplication */
SX.mult = (n, hi) => `<div class="pairs mult">${[...Array(11)].map((_,k)=>`<span class="${n*k===hi?"hi":""}">${n} × ${k} = ${n*k}</span>`).join("")}</div><p class="schN">Les multiples de ${n} sont les résultats de la table de ${n} (et on continue après 10).</p>`;

/* crible d'Ératosthène jusqu'à 50 */
SX.crible = hi => { const isP=n=>{ if(n<2) return false; for(let d=2;d*d<=n;d++) if(n%d===0) return false; return true; };
  return `<div class="crible">${[...Array(50)].map((_,i)=>`<span class="${isP(i+1)?"p":""}${i+1===hi?" hi":""}">${i+1}</span>`).join("")}</div><p class="schN">En couleur : les nombres premiers jusqu'à 50. Ils n'ont que deux diviseurs, 1 et eux-mêmes.</p>`; };

/* quadrillage 10 × 10 pour les pourcentages */
SX.pct = p => SX.cap(grids(10,10,p,1,13), `${p} carreaux coloriés sur 100 : {${p}/100} = ${p} %.`);

/* demi-tour sur quadrillage */
SX.symGrid = (A,O) => { const P=[2*O[0]-A[0],2*O[1]-A[1]]; const c=Math.max(A[0],O[0],P[0])+1, r=Math.max(A[1],O[1],P[1])+1;
  return SX.cap(geo({pts:{A,O,"A'":P}, cons:[["A","O","A'",1]], marks:["A","O","A'"], grid:{c,r}, s:40, w:Math.min(360,c*40+50)}), `Même déplacement de A à O, puis de O à A'. O est le milieu de [AA'].`); };

/* ---------- schéma calculé à partir de la question ---------- */
SX.auto = Q => { try{
  const q=Q.q||"", t=Q.t||""; let m;
  if((m=q.match(/^Calcule : ([\d\s×÷+−()]+)$/))) return SX.prio(m[1]);
  if((m=t.match(/^(\d+) × □ \+ □ = ([\d ]+)$/))) return SX.div(num(m[2]), +m[1]);
  if((m=q.match(/reste de la division euclidienne de ([\d ]+) par (\d+)/))) return SX.div(num(m[1]), +m[2]);
  if((m=q.match(/^([\d ]+) élèves (?:sont répartis )?en équipes de (\d+)/))) return SX.div(num(m[1]), +m[2]);
  if((m=q.match(/^(\d+) élèves en équipes de (\d+)/))) return SX.div(+m[1], +m[2]);
  if((m=t.match(/^□ &lt; \{(\d+)\/(\d+)\} &lt; □$/))) return SX.zoom(+m[1], +m[2]);
  if((m=t.match(/^\{(\d+)\/(\d+)\} = □ \+ \{□\/(\d+)\}$/))){ const n=+m[1], d=+m[2], e=Math.floor(n/d), r=n%d;
    return (n/d<=4 ? SX.cap(discs(d,n), `${e} disque${e>1?"s":""} entier${e>1?"s":""} (${e} × ${d} = ${e*d} parts) et encore ${r} part${r>1?"s":""}.`) : SX.zoom(n,d)) + `<p class="schN">{${n}/${d}} = {${e*d}/${d}} + {${r}/${d}} = <b>${e} + {${r}/${d}}</b></p>`; }
  if((m=t.match(/^\{(\d+)\/(\d+)\} = (\d+) \+ \{□\/(\d+)\}$/))){ const n=+m[1], d=+m[2], e=Math.floor(n/d), r=n%d;
    return SX.cap(discs(d,n), `${e} disque${e>1?"s":""} entier${e>1?"s":""} (${e*d} parts) et encore ${r} part${r>1?"s":""}.`) + `<p class="schN">{${n}/${d}} = {${e*d}/${d}} + {${r}/${d}} = <b>${e} + {${r}/${d}}</b></p>`; }
  if((m=q.match(/^(\d+) pièces d'or sont partagées équitablement entre (\d+)/))) return SX.div(+m[1], +m[2]);
  if((m=t.match(/^(\d+) \+ \{(\d+)\/(\d+)\} = \{□\/(\d+)\}$/))){ const e=+m[1], a=+m[2], d=+m[3], n=e*d+a;
    return (n/d<=4 ? SX.cap(discs(d,n), `${e} unité${e>1?"s":""} = ${e*d} parts de ${d}, plus ${a} : ${n} parts.`) : "") + `<p class="schN">${e} = {${e*d}/${d}}, donc ${e} + {${a}/${d}} = {${e*d}/${d}} + {${a}/${d}} = <b>{${n}/${d}}</b></p>`; }
  if((m=t.match(/^\{(\d+)\/(\d+)\} = □ %$/))){ const a=+m[1], b=+m[2], p=100*a/b; return SX.frEq(a,b,p,100,100/b,"×")+SX.pct(p); }
  if((m=t.match(/^(\d+) % = \{□\/100\}$/))) return SX.pct(+m[1]);
  if((m=t.match(/^\{1\/10\} = \{□\/100\} = □ %$/))) return SX.pct(10);
  if((m=t.match(/^\{(\d+)\/(\d+)\} = \{□\/(\d+)\}$/))){ const a=+m[1], b=+m[2], d=+m[3]; if(d%b===0) return SX.frEq(a,b,a*d/b,d,d/b,"×")+`<p class="schN">Ce qu'on fait en bas, on le fait aussi en haut.</p>`; }
  if((m=t.match(/^\{(\d+)\/(\d+)\} = \{(\d+)\/□\}$/))){ const a=+m[1], b=+m[2], c=+m[3]; if(a%c===0) return SX.frEq(a,b,c,b/(a/c),a/c,"÷")+`<p class="schN">Ce qu'on fait en haut, on le fait aussi en bas.</p>`; }
  if((m=t.match(/^\{(\d+)\/□\} = \{(\d+)\/(\d+)\}$/))){ const a=+m[1], c=+m[2], d=+m[3]; if(a%c===0) return SX.frEq(c,d,a,d*a/c,a/c,"×"); }
  if((m=q.match(/^Simplifie au maximum \{(\d+)\/(\d+)\}/))){ const a=+m[1], b=+m[2], g=gcd(a,b); return SX.frEq(a,b,a/g,b/g,g,"÷")+`<p class="schN">On divise en haut et en bas par le plus grand nombre possible : ${g}.</p>`; }
  if((m=q.match(/^Écris en chiffres : (.+)$/))){ const n=num(Array.isArray(Q.rep)?Q.rep[0]:Q.rep); if(n) return SX.classes(n); }
  if((m=q.match(/^Comment s'écrit ([\d ]+) en lettres/))) return SX.classes(num(m[1]));
  if((m=q.match(/^Dans ([\d ]+), quel est le (chiffre|nombre) des? (.+?) \?$/))){ const n=num(m[1]); const R=["unités","dizaines","centaines","unités de mille","dizaines de mille","centaines de mille","unités de millions","dizaines de millions","centaines de millions","dizaines de milliards"].indexOf(m[3].replace(/^s /,"")); if(n<1e9) return SX.numTable(n, m[2]==="chiffre"?R:-1)+(m[2]==="nombre"?`<p class="schN">« Le nombre de… » : on garde tous les chiffres jusqu'à cette colonne.</p>`:""); }
  if((m=q.match(/^Retrouve le nombre/))){ const n=num(Array.isArray(Q.rep)?Q.rep[0]:Q.rep); if(n) return SX.numTable(n)+`<p class="schN">Chaque morceau va dans sa colonne. Les colonnes vides reçoivent un 0.</p>`; }
  if((m=q.match(/^([\d ]+) est-il divisible par (\d+)/))) return SX.digits(num(m[1]), +m[2]);
  if((m=q.match(/^(\d+) est-il un nombre premier/))) return +m[1]<=50 ? SX.crible(+m[1]) : SX.pairs(+m[1]);
  if((m=q.match(/^(\d+) est-il un diviseur de (\d+)/))) return SX.pairs(+m[2]);
  if((m=q.match(/^Combien (\d+) a-t-il de diviseurs/))) return SX.pairs(+m[1]);
  if((m=q.match(/^Lequel de ces nombres est un multiple de (\d+)/))) return SX.mult(+m[1], num(Q.rep));
  if((m=t.match(/^(\d+) × □ = (\d+)$/))) return SX.mult(+m[1], +m[2]);
  return "";
}catch(e){ return ""; } };

/* ---------- rappel en image, par notion ---------- */
const objets = `<svg class="fig" viewBox="0 0 560 110" width="560" role="img" aria-label="Point, droite, demi-droite, segment">
  <path d="M30 50 L42 62 M42 50 L30 62" class="gx"/><text x="48" y="46" class="glab">A</text><text x="36" y="98" class="lab">le point A</text>
  <line x1="110" y1="64" x2="230" y2="44" class="ln"/><path d="M128 55 L138 65 M138 55 L128 65 M198 44 L208 54 M208 44 L198 54" class="gx"/><text x="122" y="44" class="glab">A</text><text x="202" y="36" class="glab">B</text><text x="170" y="98" class="lab">la droite (AB)</text>
  <line x1="270" y1="64" x2="390" y2="44" class="ln"/><path d="M265 59 L275 69 M275 59 L265 69 M350 45 L360 55 M360 45 L350 55" class="gx"/><text x="262" y="50" class="glab">A</text><text x="354" y="38" class="glab">B</text><text x="330" y="98" class="lab">la demi-droite [AB)</text>
  <line x1="430" y1="64" x2="530" y2="47" class="ln"/><path d="M425 59 L435 69 M435 59 L425 69 M525 42 L535 52 M535 42 L525 52" class="gx"/><text x="420" y="52" class="glab">A</text><text x="530" y="36" class="glab">B</text><text x="480" y="98" class="lab">le segment [AB]</text></svg>`;
const align = `<svg class="fig" viewBox="0 0 360 150" width="340" role="img" aria-label="Points alignés"><line x1="10" y1="120" x2="350" y2="30" class="ln"/>
  ${[[70,104,"E"],[170,77.6,"F"],[270,51.2,"G"]].map(([x,y,L])=>`<path d="M${x-6} ${y-6} L${x+6} ${y+6} M${x+6} ${y-6} L${x-6} ${y+6}" class="gx"/><text x="${x-4}" y="${y-12}" class="glab">${L}</text>`).join("")}
  <path d="M184 128 L196 140 M196 128 L184 140" class="pt"/><text x="200" y="128" class="ptl" style="text-anchor:start">H</text>
  <text x="300" y="70" class="glab" style="font-size:14px">(EF)</text></svg>`;
const pos3 = SX.row(
  SX.cap(`<svg class="fig" viewBox="0 0 160 110" width="150"><line x1="10" y1="20" x2="150" y2="95" class="ln"/><line x1="10" y1="95" x2="150" y2="25" class="ln"/></svg>`,"<b>sécantes</b> : elles se coupent"),
  SX.cap(`<svg class="fig" viewBox="0 0 160 110" width="150"><line x1="10" y1="70" x2="150" y2="70" class="ln"/><line x1="80" y1="8" x2="80" y2="104" class="ln"/><path d="M80 60 L90 60 L90 70" class="thin"/></svg>`,"<b>perpendiculaires</b> : angle droit, (d) ⊥ (d')"),
  SX.cap(`<svg class="fig" viewBox="0 0 160 110" width="150"><line x1="10" y1="35" x2="150" y2="20" class="ln"/><line x1="10" y1="85" x2="150" y2="70" class="ln"/></svg>`,"<b>parallèles</b> : jamais de croisement, (d) // (d')"));
const discEx = SX.row(SX.cap(discs(5,3), "Une tarte partagée en 5 parts égales, 3 parts coloriées."), `<div class="frlab"><div><span class="fr" style="font-size:2rem"><span>3</span><span>5</span></span></div><div><p>← <b>numérateur</b> : les parts coloriées</p><p>← <b>dénominateur</b> : le nombre de parts égales</p></div></div>`);
const C = {
"6e-1|Écrire les nombres": SX.box("On découpe le nombre en classes de 3 chiffres", SX.classes(4586213)+SX.steps(["Un <b>tiret</b> entre chaque mot.","<b>cent</b> et <b>quatre-vingt</b> prennent un s seulement s'il n'y a rien après : quatre-cents, mais quatre-cent-trois.","<b>mille</b> ne prend jamais de s."])),
"6e-1|Le tableau de numération": SX.box("Le tableau de numération", SX.numTable(72418965, 5)+`<p class="schN">Dans 72 418 965, le <b>chiffre</b> des centaines de mille est <b>4</b> (la case surlignée). Le <b>nombre</b> de milliers est <b>72 418</b> : on garde tous les chiffres jusqu'aux unités de mille.</p>`),
"6e-1|Décomposer un nombre": SX.box("Chaque chiffre a une valeur selon sa colonne", SX.numTable(3070402)+`<p class="calc">3 070 402 = 3 000 000 + 70 000 + 400 + 2<br>3 070 402 = 3 × 1 000 000 + 7 × 10 000 + 4 × 100 + 2 × 1</p>`),
"6e-1|Demi-droite graduée": SX.box("Lire une abscisse en deux étapes", axis({n:10, lab:[[0,"0"],[10,"2 000"]], pts:[["A",4]]})+SX.steps(["Je trouve l'écart entre deux graduations : 2 000 ÷ 10 = <b>200</b>.","Je compte les graduations depuis 0 : A est à la 4<sup>e</sup>, donc 4 × 200 = <b>800</b>. On écrit A(800)."])),
"6e-1|Priorités opératoires": SX.box("L'ordre des calculs", `<div class="prioOrder"><div><b>1</b>les parenthèses ( )</div><div><b>2</b>× et ÷</div><div><b>3</b>+ et −</div></div>`+SX.prio("18 − 2 × (3 + 4)")),
"6e-1|Placer les parenthèses": SX.box("Les parenthèses changent l'ordre", SX.row(`<div class="cmp"><b>Sans parenthèses</b>${SX.prio("6 + 4 × 2")}</div>`, `<div class="cmp"><b>Avec parenthèses</b>${SX.prio("(6 + 4) × 2")}</div>`)),
"6e-2|Notations": SX.box("Quatre objets, quatre notations", objets+`<p class="schN">Crochet [ : le trait s'arrête au point. Parenthèse ( ou ) : le trait continue.</p>`),
"6e-2|Appartenance et alignement": SX.box("∈ et ∉", align+`<p class="schN">E, F et G sont sur la même droite : ils sont <b>alignés</b>, et E ∈ (FG). H n'est pas sur la droite : H ∉ (EF). F est entre E et G : F ∈ [EG].</p>`),
"6e-2|Sécantes, perpendiculaires, parallèles": SX.box("Position de deux droites", pos3),
"6e-2|Les deux propriétés": SX.box("Les deux propriétés du cours", SX.row(SX.cap(img2("c2co/p5-15.png","Propriété 1",250),"<b>Propriété 1</b> : (d₁) ⊥ (d) et (d₂) ⊥ (d), donc (d₁) // (d₂)."), SX.cap(img2("c2co/p5-17.png","Propriété 2",250),"<b>Propriété 2</b> : (d₁) // (d₂) et (d₃) ⊥ (d₁), donc (d₃) ⊥ (d₂)."))),
"6e-2|Constructions": SX.box("Tracer une perpendiculaire, puis une parallèle", img2("c2co/p6-19.png","Méthode de la perpendiculaire",520)+SX.cap(img2("c2co/p7-27.png","Méthode de la parallèle",220),"Pour la parallèle : deux perpendiculaires à la suite.")),
"6e-3|Lire une fraction": SX.box("Lire une fraction", discEx),
"6e-3|Écrire une fraction": SX.box("Le vocabulaire", discEx+`<p class="calc">{3/5} = {1/5} + {1/5} + {1/5} = 3 × {1/5} : on lit « trois cinquièmes ».</p>`),
"6e-3|Fractions égales": SX.box("Ce qu'on fait en haut, on le fait en bas", SX.row(SX.frEq(3,5,12,20,4,"×"), SX.cap(grids(5,1,3,1,48)+"<br>"+grids(20,1,12,1,12),"{3/5} et {12/20} : la même part de la bande."))),
"6e-3|Demi-droite graduée": SX.box("Placer une fraction", SX.cap(fline(2,5,[["A",2],["B",8]]),"L'unité (de 0 à 1) est partagée en 5 : chaque graduation vaut {1/5}. A est à la 2<sup>e</sup> : A({2/5}). B est à la 8<sup>e</sup> : B({8/5}).")),
"6e-3|Comparer une fraction à 1": SX.box("Comparer à 1", SX.row(SX.cap(discs(4,3),"{3/4} &lt; 1 : 3 &lt; 4"), SX.cap(discs(4,4),"{4/4} = 1"), SX.cap(discs(4,5),"{5/4} &gt; 1 : 5 &gt; 4"))),
"6e-3|Entier + fraction inférieure à 1": SX.box("Des unités entières, puis le reste", SX.cap(discs(3,8),"8 tiers = 2 disques entiers (6 tiers) + 2 tiers.")+`<p class="calc">{8/3} = {6/3} + {2/3} = 2 + {2/3}</p>`),
"6e-3|Encadrer entre deux entiers consécutifs": SX.box("Deux entiers qui se suivent", SX.zoom(10,3)+`<p class="calc">{10/3} = 3 + {1/3}, donc 3 &lt; {10/3} &lt; 4</p>`),
"6e-3|Fractions décimales": SX.box("Dixièmes et centièmes", SX.row(SX.cap(grids(10,1,4,1,22),"{4/10} : 4 bandes sur 10"), SX.cap(grids(10,10,58,1,13),"{58/100} = {5/10} + {8/100} : 5 bandes et 8 carreaux"))),
"6e-3|Pourcentages": SX.box("Un pourcentage, c'est des centièmes", SX.pct(45)+`<p class="calc">45 % = {45/100} : 45 carreaux sur 100.</p>`),
"5e-1|Multiples": SX.box("Les multiples d'un nombre", SX.mult(11, 33)),
"5e-1|Critères de divisibilité": SX.box("Les critères", `<div class="scroll"><table class="std"><tbody>
  <tr><td><b>par 2</b></td><td>chiffre des unités 0, 2, 4, 6 ou 8</td></tr><tr><td><b>par 5</b></td><td>chiffre des unités 0 ou 5</td></tr><tr><td><b>par 10</b></td><td>chiffre des unités 0</td></tr>
  <tr><td><b>par 3</b></td><td>somme des chiffres multiple de 3</td></tr><tr><td><b>par 9</b></td><td>somme des chiffres multiple de 9</td></tr></tbody></table></div>`+SX.digits(738,9)),
"5e-1|Diviseurs": SX.box("Trouver tous les diviseurs par paires", SX.pairs(56)),
"5e-1|Multiple, diviseur, divisible": SX.box("Trois façons de dire la même chose", `<p class="calc big" style="text-align:center">4 × 9 = 36</p>`+SX.steps(["4 est un <b>diviseur</b> de 36.","36 est un <b>multiple</b> de 4.","36 est <b>divisible</b> par 4."])),
"5e-1|Division euclidienne": SX.box("Poser la division", SX.div(98,4)),
"5e-1|Problèmes de partage": SX.box("Partager sans reste", `<p class="schN">15 billes rouges et 20 billes bleues dans des sachets identiques : le nombre de sachets divise 15 <b>et</b> 20.</p>`+SX.row(`<div class="pairs"><span>Diviseurs de 15 : 1, 3, 5, 15</span><span>Diviseurs de 20 : 1, 2, 4, 5, 10, 20</span><span class="hi">Communs : 1 et 5</span></div>`)+`<p class="calc">5 sachets → 15 ÷ 5 = 3 rouges et 20 ÷ 5 = 4 bleues par sachet</p>`),
"5e-1|Nombres premiers": SX.box("Premier ou pas ? Je cherche ses diviseurs", SX.row(`<div class="cmp"><b>15</b>${SX.pairs(15)}</div>`, `<div class="cmp"><b>13</b>${SX.pairs(13)}</div>`)+`<p class="schN">15 a 4 diviseurs : il n'est <b>pas premier</b>. 13 n'a que 1 et 13 : il est <b>premier</b>.</p>`),
};
const F5 = () => window.FIG5 || {};
const C5 = () => ({
"5e-2|Symétrie axiale ou demi-tour ?": SX.box("Plier ou faire un demi-tour ?", SX.row(SX.cap(img2("5c2ex/p1-01.png","Pliage suivant une droite",230),"<b>Symétrie axiale</b> : on plie suivant une droite."), SX.cap(img2("5c2ex/p1-02.png","Demi-tour",230),"<b>Demi-tour</b> : on tourne d'un demi-tour autour d'un point."))),
"5e-2|Symétrique d'un point": SX.box("Le centre est le milieu", SX.symGrid([1,1],[3,2])),
"5e-2|Construire avec le compas": SX.box("Construire A' en 3 étapes", F5().methode||""),
"5e-2|Propriétés du demi-tour": SX.box("Le demi-tour conserve…", `<p class="schN">les <b>longueurs</b>, les <b>angles</b>, les <b>aires</b>, l'<b>alignement</b>. Et l'image d'une droite est une droite <b>parallèle</b>.</p>`+SX.row(SX.cap(img2("5c2co/p2-07.png","Segments symétriques",230),"Segments : parallèles et de même longueur."), SX.cap(img2("5c2co/p2-09.png","Droites symétriques",230),"Droites : parallèles."))),
"5e-2|Justifier une longueur ou un angle": SX.box("La rédaction en 3 lignes", `<div class="jod"><p><b>Je sais que</b> les deux figures sont symétriques par rapport au point O.</p><p><b>Or</b> le demi-tour conserve les longueurs (ou les mesures d'angles).</p><p><b>Donc</b> la longueur (ou l'angle) cherchée est égale à celle de la figure de départ.</p></div>`+(F5().dt?F5().dt({A:[30,40],B:[120,30],C:[60,110],O:[170,90]},["A","B","C"],"O",{w:360}):"")+`<p class="schN">Les sommets se correspondent dans l'ordre : A et A', B et B', C et C'.</p>`),
"5e-2|Centre et axes de symétrie d'une figure": SX.box("Axe : je plie. Centre : je fais un demi-tour", SX.cap(`<svg class="fig geo" viewBox="0 0 160 130" width="160"><polygon points="80,8 145,65 80,122 15,65" class="orig"/><line x1="80" y1="0" x2="80" y2="130" class="axe3"/><line x1="4" y1="65" x2="156" y2="65" class="axe3"/><path d="M75 60 L85 70 M85 60 L75 70" class="pt"/></svg>`, "Le losange : 2 axes (ses diagonales) et un centre (le point d'intersection des diagonales).")),
"5e-2|Centre et axes de symétrie d'une figure|fb": SX.box("Les figures usuelles", F5().usu ? `<div class="cgrid">${F5().USU.map(([n,k])=>`<figure><figcaption><b>${n}</b></figcaption>${F5().usu(k,true)}</figure>`).join("")}</div><p class="schN">En pointillés : les axes. La croix : le centre de symétrie.</p>` : ""),
"5e-2|Rappel : symétrie axiale": SX.box("L'axe est la médiatrice", F5().sa ? F5().sa({A:[30,50],B:[95,30],C:[60,120],d1:[165,0],d2:[178,160]},["A","B","C"],"d1","d2",{w:400}) : ""),
});
C["5e-1|Nombres premiers|fb"] = SX.box("Les nombres premiers jusqu'à 50", SX.crible(-1));
Object.entries({...C, ...C5()}).forEach(([k,html])=>{ const [key,nom,fb]=k.split("|"); const D=CH[key]; if(!D) return; const N=D.quiz.find(n=>n.nom===nom); if(N){ if(fb) N.schemaFb=html; else N.schema=html; } });

/* schéma « comment ça marche » pour l'écran d'accueil du quiz */
SX.howto = `<div class="howto" aria-label="Comment marche l'entraînement">
  <div class="hstep s1"><b>Niveau 1</b><span>facile</span></div><div class="harrow">juste<span>→</span></div>
  <div class="hstep s2"><b>Niveau 2</b><span>moyen</span></div><div class="harrow">juste<span>→</span></div>
  <div class="hstep s3"><b>Niveau 3</b><span>difficile</span></div><div class="harrow">juste<span>→</span></div>
  <div class="hstep goal"><b>✓</b><span>Notion maîtrisée</span></div></div>
  <p class="hback"><span>Erreur ?</span> Tu lis l'explication avec un schéma, tu redescends d'un niveau, puis tu remontes.</p>`;
})();
