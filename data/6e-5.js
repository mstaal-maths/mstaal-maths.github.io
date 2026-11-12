/* 6e — Chapitre 5 : Les nombres décimaux (cours et fiche d'exercices de M. Staal)
   Figures : images tirées de ses fiches ; figures du QCM et des corrections : SVG calculés. */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g," ");
/* nombre décimal écrit à partir d'un entier n et de k chiffres après la virgule : D(2473,3) = "2,473" */
const D = (n,k) => { if(!k) return sp(n); const s=String(n).padStart(k+1,"0"); return sp(+s.slice(0,-k))+","+s.slice(-k); };
const T = s => s.includes(",") ? s.replace(/0+$/,"").replace(/,$/,"") : s;      /* enlève les zéros inutiles à droite */
const co = (p,alt,w) => img("c65co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("c65ex/"+p+".png", alt, w);
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const RED="#d0342c", BLUE="#1e5aa8";
const RANGS = ["unités","dixièmes","centièmes","millièmes"];
/* tableau de numération d'un nombre décimal */
const tabNum = (ent, dec) => `<div class="scroll"><table class="num"><thead><tr><th colspan="3">Partie entière</th><th></th><th colspan="3">Partie décimale</th></tr><tr><th>centaines</th><th>dizaines</th><th>unités</th><th>,</th><th>dixièmes</th><th>centièmes</th><th>millièmes</th></tr></thead><tbody><tr>${String(ent).padStart(3," ").split("").map(d=>`<td>${d.trim()}</td>`).join("")}<td><b>,</b></td>${String(dec).padEnd(3," ").split("").map(d=>`<td>${d.trim()}</td>`).join("")}</tr></tbody></table></div>`;
/* demi-droite graduée en dixièmes : de a à b unités, points [[nom, valeur en dixièmes]] */
const dix = (a,b,pts=[]) => axis({n:(b-a)*10, lab:[...Array(b-a+1)].map((_,i)=>[10*i, String(a+i)]), major:[...Array(b-a+1)].map((_,i)=>10*i), pts:pts.map(([L,v])=>[L, v-10*a])});
/* demi-droite graduée en centièmes entre deux dixièmes (d en dixièmes) */
const cent = (d,pts=[]) => axis({n:10, lab:[[0,D(d,1)],[10,D(d+1,1)]], major:[5], pts:pts.map(([L,v])=>[L, v-10*d])});

/* ===================== schémas (rappels en image) ===================== */
const S_FRAC = sch("Nombre décimal = fraction décimale", `<p class="schN">Le dénominateur est 10, 100, 1 000… et il y a autant de zéros que de chiffres après la virgule :</p><p class="calc">3,07 = {307/100} &nbsp;(2 chiffres après la virgule → 100)<br>14,8 = {148/10} &nbsp;(1 chiffre → 10)<br>1,309 = {1 309/1 000} &nbsp;(3 chiffres → 1 000)</p>`);
const S_TAB = sch("Le tableau de numération", tabNum(207,"045")+`<p class="schN">Dans 207,045 : chiffre des dixièmes 0, des centièmes 4, des millièmes 5. Le <b>nombre</b> de dixièmes est 2 070 (on garde tous les chiffres jusqu'aux dixièmes).</p>`);
const S_ZERO = sch("Zéro inutile ou pas ?", `<p class="schN">Un zéro est inutile s'il est <b>tout à gauche</b> de la partie entière ou <b>tout à droite</b> de la partie décimale :</p><p class="calc">0̶5,30̶ = 5,3 &nbsp;&nbsp; 12,40̶0̶ = 12,4 &nbsp;&nbsp; 0̶70 = 70</p><p class="schN">Mais dans 3,07 ou dans 70, le zéro est utile : il tient une place.</p>`);
const S_AXE = sch("Lire une demi-droite graduée", dix(0,3,[["A",4],["B",17],["C",23]])+`<p class="schN">Chaque unité est partagée en 10 : une petite graduation vaut un dixième (0,1). A(0,4) · B(1,7) · C(2,3).</p>`);
const S_CMP = sch("Comparer deux décimaux", `<p class="schN">1) On compare les parties entières. 2) Si elles sont égales, on compare les dixièmes, puis les centièmes…</p><p class="calc">5,8 = 5,80 et 5,17 : 80 centièmes &gt; 17 centièmes, donc 5,8 &gt; 5,17</p><p class="schN">Astuce : on ajoute des zéros pour avoir autant de chiffres après la virgule.</p>`);
const S_ENC = sch("Encadrer", `<div class="scroll"><table class="std"><tbody><tr><th>à l'unité</th><td>2 &lt; 2,473 &lt; 3</td></tr><tr><th>au dixième</th><td>2,4 &lt; 2,473 &lt; 2,5</td></tr><tr><th>au centième</th><td>2,47 &lt; 2,473 &lt; 2,48</td></tr></tbody></table></div><p class="schN">Pour intercaler un nombre entre 1,57 et 1,58, on ajoute un chiffre : 1,571 ; 1,575…</p>`);
const S_ARR = sch("Arrondir", `<p class="schN">J'encadre, puis je garde la borne la plus proche. Au milieu, je prends la borne supérieure.</p><p class="calc">2,4 &lt; 2,473 &lt; 2,5 → 2,473 est plus proche de 2,5 : l'arrondi au dixième est 2,5.</p><p class="schN">Il suffit de regarder le chiffre juste après : 0, 1, 2, 3 ou 4 → je garde ; 5, 6, 7, 8 ou 9 → j'augmente.</p>`);

/* ===================== schémas dessinés du cours (SVG, couleurs lisibles en mode clair et sombre) ===================== */
const GREEN="#2e8b3a", ORNG="#d97a00";
const sv = (W,H,lab,body) => `<svg class="fig f65 fsch" viewBox="0 0 ${W} ${H}" width="${W}" style="margin:10px auto" role="img" aria-label="${esc(lab)}">${body}</svg>`;
const tx = (x,y,t,o={}) => `<text x="${x}" y="${y}" style="text-anchor:${o.a||"middle"};font-size:${o.s||16}px;${o.b?"font-weight:700;":""}${o.c?"fill:"+o.c+";":""}${o.o?"opacity:"+o.o+";":""}">${t}</text>`;
const ts = (t,c,b) => `<tspan style="${c?"fill:"+c+";":""}${b?"font-weight:700;":""}">${t}</tspan>`;
const ln = (x1,y1,x2,y2,o={}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${o.c||"currentColor"};stroke-width:${o.w||2};${o.d?"stroke-dasharray:"+o.d+";":""}${o.o?"opacity:"+o.o+";":""}stroke-linecap:round"/>`;
const arw = (x1,y1,x2,y2,o={}) => { const a=Math.atan2(y2-y1,x2-x1), k=o.k||9, c=o.c||"currentColor";
  const p=(t)=>`${(x2-k*Math.cos(a+t)).toFixed(1)},${(y2-k*Math.sin(a+t)).toFixed(1)}`;
  return ln(x1,y1,x2,y2,o)+`<polygon points="${x2},${y2} ${p(.45)} ${p(-.45)}" style="fill:${c};stroke:none"/>`; };
/* accolade horizontale de x1 à x2, posée en y, pointe vers le bas (d=1) ou le haut (d=-1) */
const brace = (x1,x2,y,o={}) => { const d=o.d||1, h=8*d, m=(x1+x2)/2;
  return `<path d="M${x1} ${y} Q${x1} ${y+h} ${x1+8} ${y+h} L${m-8} ${y+h} Q${m} ${y+h} ${m} ${y+2*h} Q${m} ${y+h} ${m+8} ${y+h} L${x2-8} ${y+h} Q${x2} ${y+h} ${x2} ${y}" style="fill:none;stroke:${o.c||"currentColor"};stroke-width:2"/>`; };
/* fraction dessinée (trait horizontal) centrée en x ; y = ligne de base du numérateur */
const frS = (x,y,a,b,o={}) => { const s=o.s||20, w=Math.max(String(a).length,String(b).length)*s*.62+8;
  return tx(x,y,a,{s,c:o.c,b:o.b})+ln(x-w/2,y+s*.32,x+w/2,y+s*.32,{c:o.c,w:1.8})+tx(x,y+s*1.25,b,{s,c:o.c,b:o.b}); };
/* nombre écrit chiffre par chiffre : renvoie {svg, x:[centres]} ; st(i) -> options du caractère i */
const strip = (str,x,y,s,st=()=>({})) => { const X=[]; let cx=x, out="";
  [...str].forEach((ch,i)=>{ const w=ch===","?s*.34:ch===" "?s*.28:s*.62; X.push(cx+w/2); out+=tx(cx+w/2,y,ch,Object.assign({s,b:1},st(i))); cx+=w; });
  return {svg:out, x:X, end:cx}; };
const barre = (X,i,y,s) => ln(X[i]-s*.3,y-s*.3,X[i]+s*.3,y-s*.3,{c:RED,w:3});
/* axe horizontal de valeurs v0 à v1 (entre x0 et x1), graduations tous les pas p (grandes tous les P) */
const axe = (v0,v1,x0,x1,y,p,P,o={}) => { const X=v=>x0+(v-v0)*(x1-x0)/(v1-v0); let s=ln(x0-6,y,x1+(o.fl?28:6),y,{w:2});
  if(o.fl) s+=`<path d="M${x1+20} ${y-6} L${x1+30} ${y} L${x1+20} ${y+6}" style="fill:none;stroke:currentColor;stroke-width:2"/>`;
  const n=Math.round((v1-v0)/p); for(let k=0;k<=n;k++){ const v=v0+k*p, big=Math.abs(v/P-Math.round(v/P))<1e-6; s+=ln(X(v),y-(big?11:6),X(v),y+(big?11:6),{w:big?2:1.4}); }
  return {svg:s, X}; };
const croix = (x,y,c=RED) => ln(x-6,y-6,x+6,y+6,{c,w:2.6})+ln(x+6,y-6,x-6,y+6,{c,w:2.6});

/* I.1 — 3,07 = 307/100 : autant de zéros que de chiffres après la virgule */
const F_FRAC = (()=>{ const N=strip("3,07",40,78,42,i=>i>=2?{c:BLUE}:{});
  let s=N.svg+ln(N.x[2]-14,92,N.x[3]+14,92,{c:BLUE,w:3})+tx((N.x[2]+N.x[3])/2,116,"2 chiffres",{s:15,c:BLUE,b:1})+tx((N.x[2]+N.x[3])/2,134,"après la virgule",{s:14,c:BLUE});
  s+=tx(172,74,"=",{s:36,b:1});
  s+=tx(262,58,"307",{s:34,b:1})+ln(222,70,302,70,{w:2.4})+`<text x="262" y="104" style="text-anchor:middle;font-size:34px;font-weight:700">1${ts("00",BLUE)}</text>`;
  s+=arw(146,112,226,123,{c:BLUE,w:1.8})+tx(278,130,"2 zéros",{s:15,c:BLUE,b:1});
  return sv(340,145,"3,07 est égal à 307 sur 100 : 2 chiffres après la virgule, 2 zéros au dénominateur",s); })();

/* I.2 — partie entière / partie décimale */
const F_PART = (()=>{ const N=strip("3,07",70,66,46,i=>i===0?{c:RED}:i>=2?{c:BLUE}:{});
  let s=N.svg+brace(N.x[0]-14,N.x[0]+14,80,{c:RED})+brace(N.x[2]-14,N.x[3]+14,80,{c:BLUE});
  s+=tx(N.x[0]-4,124,"partie entière",{s:15,c:RED,b:1})+tx(N.x[0]-4,144,"3",{s:18,c:RED,b:1});
  s+=tx((N.x[2]+N.x[3])/2+60,124,"partie décimale",{s:15,c:BLUE,b:1})+tx((N.x[2]+N.x[3])/2+60,144,"0,07",{s:18,c:BLUE,b:1});
  s+=`<text x="230" y="64" style="text-anchor:start;font-size:30px;font-weight:700">= ${ts("3",RED)} + ${ts("0,07",BLUE)}</text>`;
  return sv(420,154,"3,07 = 3 + 0,07 : la partie entière est 3, la partie décimale est 0,07",s); })();

/* I.3 — les entiers sont dans les décimaux */
const F_VENN = (()=>{ let s=`<ellipse cx="225" cy="112" rx="215" ry="100" style="fill:${BLUE};fill-opacity:.07;stroke:${BLUE};stroke-width:2.5"/>`;
  s+=`<ellipse cx="150" cy="128" rx="104" ry="62" style="fill:${RED};fill-opacity:.08;stroke:${RED};stroke-width:2.5"/>`;
  s+=tx(225,34,"les nombres décimaux",{s:17,c:BLUE,b:1})+tx(150,96,"les nombres entiers",{s:16,c:RED,b:1});
  s+=tx(105,136,"5",{s:22,b:1})+tx(150,136,"12",{s:22,b:1})+tx(195,136,"0",{s:22,b:1})+tx(150,168,"2&#160;070",{s:22,b:1});
  s+=tx(320,92,"3,07",{s:22,b:1})+tx(360,140,"0,5",{s:22,b:1})+tx(300,180,"14,8",{s:22,b:1});
  return sv(450,222,"Les nombres entiers (5, 12, 0, 2 070) sont à l'intérieur des nombres décimaux (3,07 ; 0,5 ; 14,8)",s); })();

/* II.1 — chiffre des dixièmes / nombre de dixièmes */
const F_DIX = (()=>{ const N=strip("207,045",40,104,44,i=>i===4?{c:BLUE}:i>4?{o:.35}:{});
  let s=N.svg+`<ellipse cx="${N.x[4]}" cy="89" rx="17" ry="24" style="fill:none;stroke:${BLUE};stroke-width:2.5"/>`;
  s+=arw(N.x[4]+70,34,N.x[4]+18,66,{c:BLUE,w:2})+tx(N.x[4]+76,30,"le chiffre des dixièmes : 0",{s:16,c:BLUE,b:1,a:"start"});
  const a=N.x[0]-16, b=N.x[4]+16;
  s+=`<path d="M${a} 120 L${a} 132 L${b} 132 L${b} 120" style="fill:none;stroke:${RED};stroke-width:2.5"/>`;
  s+=tx(a,160,"le nombre de dixièmes : 2&#160;070",{s:16,c:RED,b:1,a:"start"});
  return sv(470,172,"Dans 207,045, le chiffre des dixièmes est 0, mais le nombre de dixièmes est 2 070",s); })();

/* II.2 — les écritures de 3,07 autour du nombre */
const F_HUB = (()=>{ let s=`<rect x="262" y="104" width="116" height="56" rx="12" style="fill:${BLUE};fill-opacity:.1;stroke:${BLUE};stroke-width:2.5"/>`;
  s+=tx(320,143,"3,07",{s:32,b:1})+tx(320,96,"écriture décimale",{s:14,c:BLUE,b:1});
  s+=ln(262,114,200,78,{w:1.8,o:.6})+ln(378,114,440,78,{w:1.8,o:.6})+ln(262,152,200,186,{w:1.8,o:.6})+ln(378,152,440,186,{w:1.8,o:.6});
  s+=tx(110,22,"fraction décimale",{s:14,c:BLUE,b:1})+frS(110,52,"307","100",{s:24});
  s+=tx(530,22,"écriture décomposée",{s:14,c:BLUE,b:1})+tx(530,66,"3 + 0,07",{s:24,b:1});
  s+=tx(530,190,"écriture décomposée",{s:14,c:BLUE,b:1})+tx(510,232,"3 +",{s:24,b:1,a:"end"})+frS(546,218,"7","100",{s:24});
  s+=tx(110,190,"en lettres",{s:14,c:BLUE,b:1})+tx(110,220,"trois unités",{s:18,b:1})+tx(110,244,"et sept centièmes",{s:18,b:1});
  return sv(640,268,"Le nombre 3,07 s'écrit aussi 307 sur 100, 3 + 0,07, 3 + 7 sur 100, trois unités et sept centièmes",s); })();

/* II.2 — 3,07 en carrés : 3 unités, 0 dixième, 7 centièmes */
const F_CARRES = (()=>{ const c=10, Q=(x0,y0,fill,k)=>{ let s=`<rect x="${x0}" y="${y0}" width="${10*c}" height="${10*c}" style="fill:${fill?BLUE:"none"};fill-opacity:${fill?.4:0}"/>`;
    for(let i=0;i<k;i++) s+=`<rect x="${x0}" y="${y0+i*c}" width="${c}" height="${c}" style="fill:${RED};fill-opacity:.75"/>`;
    for(let i=1;i<10;i++) s+=ln(x0+i*c,y0,x0+i*c,y0+10*c,{w:.8,o:.45})+ln(x0,y0+i*c,x0+10*c,y0+i*c,{w:.8,o:.45});
    return s+`<rect x="${x0}" y="${y0}" width="${10*c}" height="${10*c}" style="fill:none;stroke:currentColor;stroke-width:2"/>`; };
  let s=Q(10,10,1,0)+Q(122,10,1,0)+Q(234,10,1,0)+tx(363,68,"+",{s:30,b:1})+Q(392,10,0,7);
  s+=brace(10,334,118,{c:BLUE})+tx(172,152,"3 unités",{s:17,c:BLUE,b:1});
  s+=tx(442,136,"7 centièmes",{s:17,c:RED,b:1})+tx(470,176,"0,07 =",{s:18,b:1,a:"end"})+frS(500,164,"7","100",{s:20,c:RED});
  s+=tx(506,30,"1 colonne",{s:14,a:"start"})+tx(506,48,"= 1 dixième",{s:14,a:"start",b:1})+tx(506,80,"1 petit carré",{s:14,a:"start"})+tx(506,98,"= 1 centième",{s:14,a:"start",b:1,c:RED});
  return sv(620,212,"3,07 : trois carrés unités entièrement coloriés et 7 petits carrés (7 centièmes) dans un quatrième carré",s); })();

/* II.3 — zéros inutiles barrés, zéro utile entouré */
const F_ZERO = (()=>{ let s="";
  const A=strip("05,30",14,48,30); s+=A.svg+barre(A.x,0,48,30)+barre(A.x,4,48,30)+tx(A.end+10,48,"= 5,3",{s:26,b:1,a:"start"});
  const B=strip("12,400",224,48,30); s+=B.svg+barre(B.x,4,48,30)+barre(B.x,5,48,30)+tx(B.end+10,48,"= 12,4",{s:26,b:1,a:"start"});
  const C=strip("070",462,48,30); s+=C.svg+barre(C.x,0,48,30)+tx(C.end+10,48,"= 70",{s:26,b:1,a:"start"});
  s+=tx(14,80,"zéros inutiles : tout à gauche ou tout à droite",{s:15,c:RED,b:1,a:"start"});
  const D3=strip("3,07",14,140,30,i=>i===2?{c:GREEN}:{}); s+=D3.svg+`<ellipse cx="${D3.x[2]}" cy="130" rx="12" ry="18" style="fill:none;stroke:${GREEN};stroke-width:2.5"/>`;
  s+=tx(D3.end+12,140,"≠ 3,7",{s:26,b:1,a:"start"})+tx(D3.end+100,128,"zéro utile : il tient",{s:15,c:GREEN,b:1,a:"start"})+tx(D3.end+100,148,"la place des dixièmes",{s:15,c:GREEN,b:1,a:"start"});
  return sv(600,160,"05,30 = 5,3 ; 12,400 = 12,4 ; 070 = 70 ; mais dans 3,07 le zéro est utile",s); })();

/* III — demi-droite graduée en dixièmes */
const F_AXE = (()=>{ const A=axe(0,3,40,550,64,.1,1,{fl:1}); let s=A.svg;
  s+=ln(A.X(0),64,A.X(.1),64,{c:ORNG,w:6});
  [["0",0],["1",1],["2",2],["3",3]].forEach(([t,v])=>s+=tx(A.X(v),96,t,{s:18,b:1}));
  [["A",.4,"0,4"],["B",1.7,"1,7"],["C",2.3,"2,3"]].forEach(([L,v,t])=>s+=croix(A.X(v),64)+tx(A.X(v),40,L,{s:18,c:RED,b:1})+tx(A.X(v),96,t,{s:16,c:RED,b:1}));
  s+=brace(A.X(0),A.X(1),108,{c:BLUE})+tx(A.X(.5),142,"1 unité = 10 graduations",{s:15,c:BLUE,b:1});
  s+=arw(A.X(.05)+4,22,A.X(.05)+2,54,{c:ORNG,w:1.8})+tx(A.X(.05)+12,18,"1 graduation = 0,1",{s:15,c:ORNG,b:1,a:"start"});
  return sv(600,152,"Demi-droite graduée en dixièmes : A(0,4), B(1,7), C(2,3) ; une graduation vaut 0,1",s); })();

/* III — zoom entre 1,6 et 1,7 : graduation en centièmes */
const F_ZOOM = (()=>{ const T=axe(1,2,40,560,46,.1,1), B=axe(1.6,1.7,40,560,176,.01,.1); let s="";
  s+=`<polygon points="${T.X(1.6)},50 ${T.X(1.7)},50 560,170 40,170" style="fill:${BLUE};fill-opacity:.07"/>`;
  s+=ln(T.X(1.6),50,40,170,{c:BLUE,w:1.4,d:"5 5"})+ln(T.X(1.7),50,560,170,{c:BLUE,w:1.4,d:"5 5"});
  s+=T.svg+ln(T.X(1.6),46,T.X(1.7),46,{c:BLUE,w:6})+B.svg;
  s+=tx(T.X(1),24,"1",{s:16,b:1})+tx(T.X(2),24,"2",{s:16,b:1})+tx(T.X(1.6),24,"1,6",{s:15,c:BLUE,b:1})+tx(T.X(1.7),24,"1,7",{s:15,c:BLUE,b:1});
  s+=tx(320,122,"je partage encore en 10",{s:15,c:BLUE,b:1})+tx(340,142,"1 graduation = 0,01",{s:15,c:BLUE,b:1});
  s+=tx(40,206,"1,6",{s:17,b:1})+tx(560,206,"1,7",{s:17,b:1})+croix(B.X(1.63),176)+tx(B.X(1.63),154,"M",{s:18,c:RED,b:1})+tx(B.X(1.63),206,"1,63",{s:17,c:RED,b:1});
  return sv(600,216,"Zoom entre 1,6 et 1,7 : chaque dixième est partagé en 10 centièmes ; M a pour abscisse 1,63",s); })();

/* IV.1 — comparer 5,8 et 5,17 chiffre par chiffre */
const F_CMP = (()=>{ const cx=[60,92,130,206]; let s="";
  s+=`<rect x="${cx[0]-22}" y="40" width="44" height="100" rx="8" style="fill:${GREEN};fill-opacity:.13;stroke:${GREEN};stroke-width:2"/>`;
  s+=`<rect x="${cx[2]-22}" y="40" width="44" height="100" rx="8" style="fill:${RED};fill-opacity:.12;stroke:${RED};stroke-width:2"/>`;
  s+=tx(cx[0],30,"unités",{s:13,c:GREEN,b:1})+tx(cx[2],30,"dixièmes",{s:13,c:RED,b:1})+tx(cx[3],30,"centièmes",{s:13,o:.75});
  ["5",",","8","0"].forEach((d,i)=>s+=tx(cx[i],80,d,{s:34,b:1,o:i===3?.4:1}));
  ["5",",","1","7"].forEach((d,i)=>s+=tx(cx[i],128,d,{s:34,b:1}));
  s+=tx(cx[3]+22,80,"← j'ajoute un 0",{s:13,a:"start",o:.8});
  s+=tx(350,62,"① unités : 5 = 5",{s:17,c:GREEN,b:1,a:"start"})+tx(350,96,"② dixièmes : 8 > 1",{s:17,c:RED,b:1,a:"start"})+tx(350,136,"donc 5,8 > 5,17",{s:20,b:1,a:"start"});
  return sv(580,150,"Comparer 5,80 et 5,17 : les unités sont égales, 8 dixièmes est plus grand que 1 dixième, donc 5,8 > 5,17",s); })();

/* IV.2 — ranger : ordre croissant sur la demi-droite */
const F_RANG = (()=>{ const A=axe(33.5,35,40,560,70,.1,.5,{fl:1}); let s=A.svg;
  s+=tx(A.X(33.5),98,"33,5",{s:14,o:.8})+tx(A.X(34),98,"34",{s:15,b:1})+tx(A.X(34.5),98,"34,5",{s:14,o:.8})+tx(A.X(35),98,"35",{s:15,b:1});
  [["33,68",33.68,22],["33,8",33.8,44],["34",34,44],["34,2",34.2,44],["34,75",34.75,44]].forEach(([t,v,y])=>s+=croix(A.X(v),70)+tx(A.X(v),y,t,{s:15,c:RED,b:1}));
  s+=arw(60,122,520,122,{c:BLUE,w:2.4})+tx(290,116,"ordre croissant : du plus petit au plus grand",{s:15,c:BLUE,b:1});
  s+=arw(520,150,60,150,{c:ORNG,w:2.4})+tx(290,144,"ordre décroissant : du plus grand au plus petit",{s:15,c:ORNG,b:1});
  return sv(600,160,"33,68 < 33,8 < 34 < 34,2 < 34,75 placés sur une demi-droite : ordre croissant de gauche à droite",s); })();

/* IV.3 — encadrer 2,473 : trois zooms */
const F_ENC = (()=>{ const R=[[2,3,.1,40,"2","3","à l'unité","2 < 2,473 < 3"],[2.4,2.5,.01,124,"2,4","2,5","au dixième","2,4 < 2,473 < 2,5"],[2.47,2.48,.001,208,"2,47","2,48","au centième","2,47 < 2,473 < 2,48"]];
  let s=""; R.forEach(([a,b,p,y,la,lb,nom,ineq],k)=>{ const A=axe(a,b,40,400,y,p,b-a);
    if(k<2){ const [a2,b2]=[R[k+1][0],R[k+1][1]], y2=R[k+1][3];
      s+=`<polygon points="${A.X(a2)},${y+4} ${A.X(b2)},${y+4} 400,${y2-4} 40,${y2-4}" style="fill:${BLUE};fill-opacity:.07"/>`+ln(A.X(a2),y+4,40,y2-4,{c:BLUE,w:1.2,d:"5 5"})+ln(A.X(b2),y+4,400,y2-4,{c:BLUE,w:1.2,d:"5 5"}); }
    s+=A.svg; if(k<2) s+=ln(A.X(R[k+1][0]),y,A.X(R[k+1][1]),y,{c:BLUE,w:5});
    s+=tx(40,y+30,la,{s:16,b:1})+tx(400,y+30,lb,{s:16,b:1})+croix(A.X(2.473),y)+tx(A.X(2.473),y-16,"2,473",{s:14,c:RED,b:1});
    s+=tx(440,y-6,nom,{s:14,c:BLUE,b:1,a:"start"})+tx(440,y+18,ineq,{s:17,b:1,a:"start"}); });
  return sv(630,246,"Encadrer 2,473 : 2 < 2,473 < 3 ; 2,4 < 2,473 < 2,5 ; 2,47 < 2,473 < 2,48",s); })();

/* IV.4 — intercaler entre 1,57 et 1,58 */
const F_INT = (()=>{ const A=axe(1.57,1.58,40,520,54,.001,.01); let s=A.svg;
  s+=tx(40,84,"1,57",{s:16,b:1})+tx(520,84,"1,58",{s:16,b:1})+tx(40,104,"= 1,570",{s:13,o:.75})+tx(520,104,"= 1,580",{s:13,o:.75});
  [1.571,1.572,1.573,1.574,1.575,1.576,1.577,1.578,1.579].forEach(v=>s+=`<circle cx="${A.X(v)}" cy="54" r="4.5" style="fill:${BLUE}"/>`);
  s+=croix(A.X(1.573),54)+tx(A.X(1.573),32,"1,573",{s:16,c:RED,b:1})+tx(A.X(1.578),32,"1,578",{s:15,c:BLUE,b:1});
  s+=tx(280,100,"j'ajoute un chiffre : 1,571 ; 1,572 ; … ; 1,579",{s:15,c:BLUE,b:1});
  return sv(560,112,"Entre 1,57 et 1,58 on peut intercaler 1,571 ; 1,572 ; … ; 1,579",s); })();

/* V — arrondir 2,473 au dixième : la borne la plus proche */
const F_ARR = (()=>{ const A=axe(2.4,2.5,40,560,92,.01,.05); let s=A.svg;
  s+=tx(40,124,"2,4",{s:18,b:1})+`<circle cx="560" cy="118" r="24" style="fill:${GREEN};fill-opacity:.12;stroke:${GREEN};stroke-width:2.5"/>`+tx(560,124,"2,5",{s:18,b:1,c:GREEN});
  s+=tx(A.X(2.45),124,"2,45",{s:14,o:.7})+tx(A.X(2.45),142,"(milieu)",{s:13,o:.7});
  s+=croix(A.X(2.473),92)+tx(A.X(2.473),124,"2,473",{s:16,c:RED,b:1});
  s+=arw(A.X(2.473)-6,60,46,60,{w:2,o:.45})+tx((A.X(2.473)+40)/2,50,"loin",{s:15,o:.6,b:1});
  s+=arw(A.X(2.473)+6,60,554,60,{c:GREEN,w:2.6})+tx((A.X(2.473)+560)/2,50,"plus proche",{s:15,c:GREEN,b:1});
  s+=tx(300,24,"l'arrondi au dixième de 2,473 est 2,5",{s:18,b:1});
  return sv(600,152,"2,473 est entre 2,4 et 2,5, plus proche de 2,5 : son arrondi au dixième est 2,5",s); })();

/* V — la règle du chiffre suivant */
const F_REGLE = (()=>{ let s="";
  for(let d=0;d<10;d++){ const x=20+d*46, c=d<5?BLUE:RED; s+=`<rect x="${x}" y="14" width="40" height="40" rx="7" style="fill:${c};fill-opacity:.13;stroke:${c};stroke-width:2"/>`+tx(x+20,42,String(d),{s:22,b:1,c}); }
  s+=brace(20,244,62,{c:BLUE})+tx(132,98,"je garde",{s:17,c:BLUE,b:1});
  s+=brace(250,474,62,{c:RED})+tx(362,98,"j'augmente de 1",{s:17,c:RED,b:1});
  return sv(500,108,"Chiffre suivant 0, 1, 2, 3 ou 4 : je garde ; 5, 6, 7, 8 ou 9 : j'augmente",s); })();

CH["6e-5"] = {
intro:"Reconnaître un nombre décimal et ses différentes écritures, la valeur des chiffres, les zéros inutiles, la demi-droite graduée, comparer, ranger, encadrer, intercaler et arrondir.",
savoir:[
  "reconnaître un nombre décimal et passer d'une écriture à une autre ;",
  "connaître la valeur de chaque chiffre : dixièmes, centièmes, millièmes ;",
  "supprimer les zéros inutiles dans l'écriture d'un nombre ;",
  "repérer et placer un nombre décimal sur une demi-droite graduée ;",
  "comparer, ranger, encadrer, intercaler et arrondir des nombres décimaux."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Qu'est-ce qu'un nombre décimal ?", h:`
  <div class="keep"><h4>1. Définition</h4>
  <div class="retenir" data-l="Définition"><p>Un <b>nombre décimal</b> peut s'écrire avec une <b>fraction décimale</b> : une fraction dont le dénominateur est 1, 10, 100, 1 000, …</p></div>
  ${F_FRAC}
  <p class="calc">14,8 = {148/10} &nbsp;&nbsp; 0,64 = {64/100} &nbsp;&nbsp; 1,309 = {1 309/1 000} &nbsp;&nbsp; 5 = {5/1}</p></div>
  <p><b>Remarque :</b> après la virgule, il y a un nombre fini de chiffres.</p>
  <div class="keep"><h4>2. Partie entière et partie décimale</h4>
  <div class="retenir" data-l="Définition"><p>Un nombre décimal = sa <b>partie entière</b> (à gauche de la virgule) + sa <b>partie décimale</b> (à droite de la virgule).</p></div>
  ${F_PART}</div>
  <div class="keep"><h4>3. Les nombres entiers</h4>
  <div class="retenir" data-l="Définition"><p>Un <b>nombre entier</b> est un nombre décimal dont la partie décimale est 0.</p></div>
  ${F_VENN}
  <p class="attention"><b>ATTENTION :</b> tous les entiers sont des décimaux, mais tous les décimaux ne sont pas des entiers.</p></div>`},
{k:"II", t:"Les différentes écritures d'un nombre décimal", h:`
  <div class="keep"><h4>1. Le tableau de numération</h4>
  ${tabNum(207,"045")}
  ${F_DIX}
  <p class="attention"><b>ATTENTION :</b> ne pas confondre le <b>chiffre</b> des dixièmes et le <b>nombre</b> de dixièmes.</p></div>
  <div class="keep"><h4>2. Écrire un même nombre de plusieurs façons</h4>
  ${F_HUB}</div>
  ${F_CARRES}
  <div class="keep"><h4>3. Les zéros inutiles</h4>
  <div class="retenir" data-l="Définition"><p>Un zéro est <b>inutile</b> si on peut l'enlever sans changer la place des autres chiffres.</p></div>
  ${F_ZERO}</div>`},
{k:"III", t:"Repérer un nombre décimal sur une demi-droite graduée", h:`
  <div class="keep"><p>On reporte une <b>unité</b> à partir de l'origine, puis on partage chaque unité en 10 : on obtient les <b>dixièmes</b>.</p>
  ${F_AXE}</div>
  <div class="keep"><p>Pour placer un nombre au centième, on « zoome » entre deux dixièmes et on partage à nouveau en 10.</p>
  ${F_ZOOM}
  <p class="calc"><b>M(1,63)</b> : 1 unité, 6 dixièmes et 3 centièmes.</p></div>`},
{k:"IV", t:"Comparer, ranger, encadrer et intercaler", h:`
  <div class="keep"><h4>1. Comparer deux nombres décimaux</h4>
  <div class="retenir" data-l="Méthode"><ol><li>Je compare les <b>parties entières</b>.</li><li>Si elles sont égales, je compare les <b>dixièmes</b>, puis les <b>centièmes</b>, …</li></ol></div>
  ${F_CMP}
  <p class="calc">9,6 &gt; 2,73 &nbsp;&nbsp; 13,9 &gt; 13,27 &nbsp;&nbsp; 5,17 &lt; 5,8</p></div>
  <div class="keep"><h4>2. Ranger des nombres décimaux</h4>
  ${F_RANG}
  <p class="calc">Ordre croissant : 33,68 &lt; 33,8 &lt; 34 &lt; 34,2 &lt; 34,75</p></div>
  <div class="keep"><h4>3. Encadrer un nombre décimal</h4>
  <div class="retenir" data-l="Définition"><p><b>Encadrer</b> un nombre, c'est trouver un nombre plus petit et un nombre plus grand que lui. À l'unité, au dixième ou au centième près : on prend les deux plus proches.</p></div>
  ${F_ENC}</div>
  <div class="keep"><h4>4. Intercaler un nombre décimal</h4>
  <div class="retenir" data-l="Définition"><p><b>Intercaler</b> un nombre entre deux autres, c'est trouver un nombre compris entre les deux.</p></div>
  ${F_INT}
  <p class="calc">6 &lt; 6,5 &lt; 7 &nbsp;&nbsp; 13,5 &lt; 13,57 &lt; 13,6 &nbsp;&nbsp; 1,57 &lt; 1,573 &lt; 1,58</p></div>`},
{k:"V", t:"Donner un arrondi (valeur approchée)", h:`
  <div class="keep"><div class="retenir" data-l="Définition"><p>L'<b>arrondi</b> d'un nombre est la borne de son encadrement <b>la plus proche</b>. Au milieu exact, on prend la borne supérieure.</p></div>
  ${F_ARR}</div>
  <div class="keep"><p><b>Astuce :</b> je regarde le chiffre juste après la précision demandée.</p>
  ${F_REGLE}
  <div class="scroll"><table class="std"><thead><tr><th colspan="3">Arrondis de 2,473</th></tr><tr><th>à l'unité</th><th>au dixième</th><th>au centième</th></tr></thead><tbody><tr><td>2</td><td>2,5</td><td>2,47</td></tr></tbody></table></div></div>`}
],

/* ===================== EXERCICES (dans l'ordre de la fiche) ===================== */
exos:[
{t:"Reconnaître un nombre décimal", e:[
  {n:"Activité 1", t:"Qu'est-ce qu'un nombre décimal ?", w:"Sur ta feuille", h:`<p>On donne les nombres suivants : 3,07 ; 14,8 ; 1,309 ; 0,64 ; 5</p><p>1) Écris chacun de ces nombres sous la forme d'une fraction décimale.</p><p>2) Un nombre décimal est un nombre qui peut s'écrire sous la forme d'une fraction décimale. Parmi les cinq nombres, lesquels sont des nombres décimaux ?</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 1", t:"Partie entière et partie décimale", w:"Sur ta feuille", h:`<p>Écris chaque nombre comme la somme de sa partie entière et de sa partie décimale. Exemple : 3,07 = 3 + 0,07</p><p>a) 12,3 · b) 85,08 · c) 2,485 · d) 0,85 · e) 12 · f) 6,007</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 2", t:"Vrai ou faux ?", w:"Sur ta feuille", h:`<p>Indique si chaque phrase est vraie ou fausse, puis donne un exemple qui le prouve.</p><p>a) Tous les nombres entiers sont des nombres décimaux.</p><p>b) Tous les nombres décimaux sont des nombres entiers.</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Activité 2", t:"Le jeu des étiquettes", w:"Sur ta feuille", h:`<p>On dispose des quatre étiquettes suivantes : <b>3</b> · <b>0</b> · <b>,</b> · <b>5</b></p><p>Avec ces quatre étiquettes, on forme des nombres en utilisant chaque étiquette une seule fois. Par exemple, on peut former 5,03.</p><p>1) Trouve tous les nombres possibles. Il y en a 12 !</p><p>2) Parmi eux, y a-t-il des nombres entiers ? Si oui, écris-les.</p><p>3) Y a-t-il des nombres égaux entre eux ? Si oui, écris ces égalités.</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."}
 ]},
{t:"Les différentes écritures d'un nombre décimal", e:[
  {n:"Exercice 3", t:"Le tableau de numération", w:"Sur ta feuille", h:`<p>On considère le nombre 306,27.</p><p>a) Le chiffre des dixièmes est …… · b) Le chiffre des centièmes est …… · c) Le chiffre des unités est …… · d) Le chiffre des dizaines est …… · e) Combien y a-t-il de centièmes en tout dans 306,27 ?</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 4", t:"Passer d'une écriture à une autre", w:"Sur ta feuille", h:`<p>Complète le tableau.</p><div class="scroll"><table class="std"><thead><tr><th>Écriture décimale</th><th>Fraction décimale</th><th>Écriture décomposée</th><th>Écriture en lettres</th></tr></thead><tbody><tr><td>7,4</td><td>……</td><td>……</td><td>……</td></tr><tr><td>……</td><td>{53/100}</td><td>……</td><td>……</td></tr><tr><td>……</td><td>……</td><td>2 + 0,9</td><td>……</td></tr><tr><td>……</td><td>……</td><td>……</td><td>quatre unités et six centièmes</td></tr></tbody></table></div>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 5", t:"Les zéros inutiles", w:"Sur ta feuille", h:`<p>Complète le tableau, comme dans l'exemple. Attention : certains zéros ne sont pas inutiles !</p><div class="scroll"><table class="std"><thead><tr><th>Nombre</th><th>Décomposition (en lettres)</th><th>Nombre sans les zéros inutiles</th></tr></thead><tbody><tr><td>5,30</td><td>5 unités et 3 dixièmes</td><td>5,3</td></tr><tr><td>02,600</td><td>……</td><td>……</td></tr><tr><td>309,70</td><td>……</td><td>……</td></tr><tr><td>40,8</td><td>……</td><td>……</td></tr><tr><td>0,8</td><td>……</td><td>……</td></tr><tr><td>050</td><td>……</td><td>……</td></tr></tbody></table></div>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 6", t:"Barrer, comparer", w:"Sur ta feuille", h:`<p>1) Lorsque c'est possible, barre les zéros inutiles : 0502,70 · 200,500 · 30,00 · 450 · 0,501 · 0102,030</p><p>2) Complète avec le signe = ou ≠ : 0408 …… 408,00 · 3,807 …… 03,87 · 009 …… 9,00 · 0304,20 …… 304,200</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."}
 ]},
{t:"Repérer un nombre décimal sur une demi-droite graduée", e:[
  {n:"Activité 3", t:"Placer des nombres décimaux", w:"Sur ta feuille", h:`<p>Place sur la demi-droite graduée ci-dessous les nombres : 0,8 ; 1,2 ; 2,5 ; 0,35</p>${ex("act3","Demi-droite graduée de 0 à 3",440)}<p>Que remarques-tu pour 0,35 ?</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 7", t:"Lire une abscisse", w:"Sur ta feuille", h:`<p>Donne l'abscisse de chacun des points, en écriture décimale.</p>${ex("e7","Demi-droite graduée de 0 à 4 avec les points A à E",470)}<p>A(……) B(……) C(……) D(……) E(……)</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 8", t:"Le zoom au centième", w:"Sur ta feuille", h:`<p>1) Cette demi-droite est graduée en centièmes. Place les nombres 1,63 et 1,68.</p>${ex("e8a","Demi-droite de 1,6 à 1,7",440)}<p>2) Donne l'abscisse des points F et G.</p>${ex("e8b","Demi-droite de 2,3 à 2,4 avec F et G",440)}`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."}
 ]},
{t:"Comparer et ranger", e:[
  {n:"Exercice 9", t:"Comparer deux nombres décimaux", w:"Sur ta feuille", h:`<p>Complète avec &lt; , &gt; ou =.</p><p>a) 9,6 …… 2,73 · b) 5,17 …… 5,8 · c) 13,9 …… 13,27 · d) 0,7 …… 0,70 · e) 4,09 …… 4,9 · f) 12,30 …… 12,3 · g) 8,125 …… 8,2 · h) 0,99 …… 1 · i) 6,4 …… 6,40</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Activité 4", t:"La famille", w:"Sur ta feuille", h:`<p>Voici la taille des personnes d'une famille : Maman : 1,73 m · Léo : 0,75 m · Lila : 1,09 m · Tom : 1,2 m · Papa : 1,8 m · Clara : 1,27 m</p><p>1) Range les tailles dans l'ordre croissant.</p><p>2) Range les prénoms dans le même ordre.</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 10", t:"Les moyennes du trimestre", w:"Sur ta feuille", h:`<p>Voici les moyennes de Chloé : Maths : 16,82 · EPS : 15,3 · Histoire-Géo : 12,41 · Français : 12,6 · Anglais : 16,7 · Musique : 15,09 · Sciences : 16,08 · Arts plastiques : 12,4</p><p>1) Range les moyennes dans l'ordre décroissant.</p><p>2) Dans quelle matière Chloé réussit-elle le mieux ? Le moins bien ?</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 11", t:"Le prix des fruits", w:"Sur ta feuille", h:`<p>Au marché, voici le prix au kilo de huit fruits : Cerises : 4,5 € · Pêches : 4,07 € · Poires : 2,6 € · Pommes : 2,27 € · Framboises : 4,72 € · Fraises : 4,12 € · Myrtilles : 4,7 € · Kiwis : 2,06 €</p><p>1) Range les prix dans l'ordre croissant.</p><p>2) Quel est le fruit le moins cher ? Le plus cher ?</p><p>3) Léa affirme : « Les fraises sont plus chères que les cerises, car 12 est plus grand que 5. » A-t-elle raison ? Explique.</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 12", t:"Des écritures différentes", w:"Sur ta feuille", h:`<p>Voici six nombres écrits de façons différentes :</p><p>A = {37/10} · B = 3 + {7/100} · C = 377 centièmes · D = 3,707 · E = 3 + {7/1 000} · F = {3 077/1 000}</p><p>1) Écris chacun de ces nombres en écriture décimale.</p><p>2) Range les lettres dans l'ordre croissant des nombres.</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 13", t:"Comparer : attention aux pièges !", w:"Sur ta feuille", h:`<p>Complète avec &lt; , &gt; ou =.</p><p>a) 31,11 …… 31,011 · b) 10,001 …… 10,01 · c) 5,00 …… 5 · d) 4 + {49/100} …… 4,5 · e) {72/10} …… 7,02 · f) 0,3 …… {30/100} · g) 8,9 …… 8,10 · h) 12 …… 11,999 · i) 6 + {3/10} …… {603/100}</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."}
 ]},
{t:"Encadrer et intercaler", e:[
  {n:"Exercice 14", t:"Entre deux entiers consécutifs", w:"Sur ta feuille", h:`<p>Pour chaque nombre, écris les deux nombres entiers consécutifs qui l'encadrent, comme dans l'exemple : 4 &lt; 4,6 &lt; 5.</p><p>a) …… &lt; 1,4 &lt; …… · b) …… &lt; 12,7 &lt; …… · c) …… &lt; 3,28 &lt; …… · d) …… &lt; 10,671 &lt; …… · e) …… &lt; 0,59 &lt; …… · f) …… &lt; 99,9 &lt; ……</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 15", t:"Entre deux dixièmes consécutifs", w:"Sur ta feuille", h:`<p>Même consigne avec deux dixièmes consécutifs, comme dans l'exemple : 2,3 &lt; 2,38 &lt; 2,4.</p><p>a) …… &lt; 2,15 &lt; …… · b) …… &lt; 2,07 &lt; …… · c) …… &lt; 2,98 &lt; …… · d) …… &lt; 5,402 &lt; …… · e) …… &lt; 0,06 &lt; …… · f) …… &lt; 7,99 &lt; ……</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 16", t:"Qui est entre les deux ?", w:"Sur ta feuille", h:`<p>1) Entoure les nombres compris entre 3,7 et 3,8 (sans être égaux à 3,7 ni à 3,8).</p><p>3,75 · 3,08 · {374/100} · 3 + {78/100} · 3,8 · 3,709 · {38/10} · 3,07 · 37,5</p><p>2) Même consigne : entoure les nombres compris entre 7,2 et 7,3.</p><p>7,25 · 5 + {228/100} · {723/100} · 7,03 · 7 + {3/10} · 7,209 · {73/10} · 72,5</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 17", t:"À toi de choisir", w:"Sur ta feuille", h:`<p>1) Intercale un nombre de ton choix : a) 3 &lt; …… &lt; 4 · b) 4,2 &lt; …… &lt; 4,3 · c) 2,38 &lt; …… &lt; 2,39</p><p>2) Intercale deux nombres de ton choix, dans l'ordre croissant : a) 12 &lt; …… &lt; …… &lt; 13 · b) 8,7 &lt; …… &lt; …… &lt; 8,8 · c) 6,44 &lt; …… &lt; …… &lt; 6,45</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 18", t:"Le zoom", w:"Sur ta feuille", h:`<p>On veut placer le nombre 4,536 en « zoomant » sur une demi-droite graduée.</p><p>1) Cette demi-droite est graduée en dixièmes. Entre quelles graduations se trouve 4,536 ? Marque-le à peu près d'une croix.</p>${axis({n:10, lab:[[0,"4"],[10,"5"]], major:[5]})}<p>4,…… &lt; 4,536 &lt; 4,……</p><p>2) On zoome entre ces deux graduations : la demi-droite est graduée en centièmes. Complète, puis marque 4,536 à peu près.</p>${axis({n:10, lab:[[0,"4,5"],[10,"4,6"]], major:[5]})}<p>4,5…… &lt; 4,536 &lt; 4,5……</p><p>3) On zoome encore : la demi-droite est graduée en millièmes. Place exactement 4,536.</p>${axis({n:10, lab:[[0,"4,53"],[10,"4,54"]], major:[5]})}<p>4) Complète les encadrements de 4,536 :</p><p>à l'unité près : …… &lt; 4,536 &lt; ……</p><p>au dixième près : …… &lt; 4,536 &lt; ……</p><p>au centième près : …… &lt; 4,536 &lt; ……</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 19", t:"Encadrer un nombre décimal", w:"Sur ta feuille", h:`<p>Complète le tableau, comme dans l'exemple. Pour les deux derniers nombres, commence par trouver leur écriture décimale.</p><div class="scroll"><table class="std"><thead><tr><th>Nombre</th><th>à l'unité près</th><th>au dixième près</th><th>au centième près</th></tr></thead><tbody><tr><td>2,473</td><td>2 &lt; 2,473 &lt; 3</td><td>2,4 &lt; 2,473 &lt; 2,5</td><td>2,47 &lt; 2,473 &lt; 2,48</td></tr><tr><td>3,268</td><td>……</td><td>……</td><td>……</td></tr><tr><td>9,25</td><td>……</td><td>……</td><td>……</td></tr><tr><td>17,504</td><td>……</td><td>……</td><td>……</td></tr><tr><td>0,357</td><td>……</td><td>……</td><td>……</td></tr><tr><td>{7 924/1 000}</td><td>……</td><td>……</td><td>……</td></tr><tr><td>26 + {71/100}</td><td>……</td><td>……</td><td>……</td></tr></tbody></table></div>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."}
 ]},
{t:"Donner un arrondi", e:[
  {n:"Exercice 20", t:"Trouver l'arrondi", w:"Sur ta feuille", h:`<p>Complète le tableau.</p><div class="scroll"><table class="std"><thead><tr><th>Nombre</th><th>arrondi à l'unité</th><th>arrondi au dixième</th><th>arrondi au centième</th></tr></thead><tbody><tr><td>2,473</td><td>2</td><td>2,5</td><td>2,47</td></tr><tr><td>7,186</td><td>……</td><td>……</td><td>……</td></tr><tr><td>0,849</td><td>……</td><td>……</td><td>……</td></tr><tr><td>15,952</td><td>……</td><td>……</td><td>……</td></tr><tr><td>3,505</td><td>……</td><td>……</td><td>……</td></tr><tr><td>12 + {463/1 000}</td><td>……</td><td>……</td><td>……</td></tr><tr><td>{9 996/1 000}</td><td>……</td><td>……</td><td>……</td></tr></tbody></table></div>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 21", t:"L'écran de la calculatrice", w:"Sur ta feuille", h:`<p>Je tape une division sur ma calculatrice. Le résultat n'est pas un nombre décimal : il est égal à 30,666666666666…</p><p>L'écran ne peut afficher que 11 chiffres et une virgule, et la calculatrice affiche toujours un arrondi. Écris exactement le nombre affiché par la calculatrice.</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 22", t:"Au restaurant", w:"Sur ta feuille", h:`<p>Elsa, Eliott et Mathieu vont au restaurant. L'addition est de 53 €. Ils décident de partager la somme le plus équitablement possible. La calculatrice affiche 17,666666667 pour la part de chacun.</p><p>1) Quelle somme chacun va-t-il payer, au centime près ?</p><p>2) Explique pourquoi le compte ne tombe pas juste.</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."}
 ]},
{t:"Pour s'entraîner : les différentes écritures", e:[
  {n:"Exercice 23", t:"Dixièmes, centièmes, millièmes", w:"Sur ta feuille", h:`<p>Complète.</p><p>a) 4,7 = …… dixièmes · b) 2,05 = …… centièmes · c) 38 dixièmes = …… · d) 506 centièmes = …… · e) 3 = …… dixièmes = …… centièmes · f) 0,4 = …… centièmes · g) 1 250 millièmes = ……</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 24", t:"Des écritures décomposées", w:"Sur ta feuille", h:`<p>Écris chaque nombre en écriture décimale.</p><p>a) 5 + {3/10} + {8/100} · b) 12 + {6/100} · c) 7 + {4/1 000} · d) {9/10} + {2/1 000} · e) 20 + {15/100} · f) 3 + {25/10}</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."},
  {n:"Exercice 25", t:"L'intrus", w:"Sur ta feuille", h:`<p>Dans chaque liste, tous les nombres sont égaux, sauf un : barre l'intrus.</p><p>a) 2,5 · {25/10} · 2 + {5/10} · {25/100} · 2,50</p><p>b) 0,07 · {7/100} · 7 centièmes · 0,7 · 0,070</p><p>c) 13,04 · {1 304/100} · 13 + {4/100} · 1 304 centièmes · 13 + {4/10}</p><p>d) 6 · 6,00 · {60/10} · {6/10} · 600 centièmes</p>`,
   c:"\u2063\ud83d\udd12 Correction prot\u00e9g\u00e9e par un code."}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Fractions décimales", schema:S_FRAC, q:{
 1:[ {g:()=>{ const n=ri(101,999), k=pick([1,2]); const s=D(n,k); return {q:`Quelle fraction décimale est égale à ${s} ?`, c:uniq(`{${n}/${k===1?10:100}}`,[`{${n}/${k===1?100:10}}`,`{${n}/1 000}`]), rep:`{${n}/${k===1?10:100}}`, ex:`${k} chiffre${k>1?"s":""} après la virgule → dénominateur ${k===1?10:100}.`, sx:S_FRAC}; }},
     {q:"Un nombre décimal est un nombre qui peut s'écrire…", c:["avec une fraction décimale (dénominateur 10, 100, 1 000…)","avec une virgule obligatoirement","seulement avec des chiffres après la virgule"], rep:"avec une fraction décimale (dénominateur 10, 100, 1 000…)", sx:S_FRAC} ],
 2:[ {g:()=>{ const n=ri(11,99); return {q:`Écris 0,${String(n).padStart(2,"0")} sous la forme d'une fraction décimale.`, rep:[`${n}/100`], ex:`Deux chiffres après la virgule : 0,${String(n).padStart(2,"0")} = ${n} centièmes = {${n}/100}.`, sx:S_FRAC}; }},
     {g:()=>{ const n=ri(1001,9999); return {q:`Écris {${sp(n)}/1 000} en écriture décimale.`, rep:D(n,3), ex:`${sp(n)} millièmes : 3 chiffres après la virgule, ${D(n,3)}.`, sx:S_FRAC}; }} ],
 3:[ {g:()=>{ const n=ri(1,9)*1000+ri(0,9)*10+ri(1,9); return {q:`Écris {${sp(n)}/1 000} en écriture décimale.`, rep:D(n,3), ex:`3 chiffres après la virgule : ${D(n,3)}. Attention au zéro des dixièmes ou des centièmes !`, sx:S_FRAC}; }},
     {q:"Vrai ou faux : tous les nombres décimaux sont des nombres entiers.", c:VF, rep:"Faux", ex:"3,07 est décimal mais pas entier. En revanche, tous les entiers sont décimaux (5 = 5/1)."} ]
}},
{nom:"Valeur des chiffres", schema:S_TAB, q:{
 1:[ {g:()=>{ const e=ri(10,999), d=String(ri(100,999)), r=ri(1,3); return {q:`Dans ${sp(e)},${d}, quel est le chiffre des ${RANGS[r]} ?`, rep:d[r-1], ex:`Après la virgule : dixièmes, puis centièmes, puis millièmes. Le chiffre des ${RANGS[r]} est ${d[r-1]}.`, sx:S_TAB}; }},
     {g:()=>{ const e=ri(1,99), d=ri(11,99); return {q:`Quelle est la partie entière de ${e},${d} ?`, rep:String(e), ex:`La partie entière est à gauche de la virgule : ${e}.`, sx:S_TAB}; }} ],
 2:[ {g:()=>{ const e=ri(1,9), a=ri(1,9), b=ri(1,9); return {q:`Écris le nombre : ${e} unité${e>1?"s":""}, ${a} dixième${a>1?"s":""} et ${b} millième${b>1?"s":""}.`, rep:`${e},${a}0${b}`, ex:`Pas de centièmes : on écrit un 0 à leur place. ${e},${a}0${b}.`, sx:S_TAB}; }},
     {g:()=>{ const e=ri(1,9), b=ri(1,9); return {q:`Comment écrit-on « ${e} unité${e>1?"s":""} et ${b} centième${b>1?"s":""} » ?`, c:uniq(`${e},0${b}`,[`${e},${b}`,`${e},00${b}`,`${e}0,${b}`]), rep:`${e},0${b}`, ex:`Pas de dixièmes : on met un 0, puis ${b>1?`les ${b} centièmes`:"le centième"}.`, sx:S_TAB}; }} ],
 3:[ {g:()=>{ const e=ri(10,999), d=ri(10,99); return {q:`Combien y a-t-il de dixièmes en tout dans ${e},${d} ?`, rep:sp(e*10+Math.floor(d/10)), ex:`On garde tous les chiffres jusqu'aux dixièmes : ${sp(e*10+Math.floor(d/10))}. Ne pas confondre avec le chiffre des dixièmes (${Math.floor(d/10)}).`, sx:S_TAB}; }},
     {g:()=>{ const e=ri(10,99), d=ri(10,99); return {q:`Combien y a-t-il de centièmes en tout dans ${e},${d} ?`, rep:sp(e*100+d), ex:`${e},${d} = {${sp(e*100+d)}/100} : ${sp(e*100+d)} centièmes.`, sx:S_TAB}; }} ]
}},
{nom:"Zéros inutiles", schema:S_ZERO, q:{
 1:[ {g:()=>{ const a=ri(1,9), b=ri(1,9); return {q:`Écris 0${a},${b}0 sans les zéros inutiles.`, rep:`${a},${b}`, ex:`Le 0 à gauche et le 0 à droite sont inutiles : ${a},${b}.`, sx:S_ZERO}; }},
     {q:"Dans 3,07, le zéro est-il inutile ?", c:["Non","Oui"], rep:"Non", ex:"Sans lui, on obtient 3,7 : un autre nombre. Il tient la place des dixièmes.", sx:S_ZERO} ],
 2:[ {g:()=>{ const a=ri(11,99), b=ri(1,9); return {q:`Complète avec = ou ≠ : 0${a},${b}00 … ${a},${b}`, c:["=","≠"], rep:"=", ex:`Les zéros enlevés sont inutiles : les deux nombres valent ${a},${b}.`, sx:S_ZERO}; }},
     {g:()=>{ const a=ri(1,9), b=ri(1,9), c=ri(1,9); return {q:`Complète avec = ou ≠ : ${a},${b}0${c} … ${a},${b}${c}`, c:["≠","="], rep:"≠", ex:`Le 0 de ${a},${b}0${c} n'est pas inutile (il tient la place des centièmes).`, sx:S_ZERO}; }} ],
 3:[ {g:()=>{ const a=ri(1,9), b=ri(1,9); const s=`0${a}0${b},${b}0`; return {q:`Écris ${s} sans les zéros inutiles.`, rep:`${a}0${b},${b}`, ex:`Seuls le premier 0 (à gauche) et le dernier 0 (à droite) sont inutiles : ${a}0${b},${b}.`, sx:S_ZERO}; }} ]
}},
{nom:"Demi-droite graduée", schema:S_AXE, q:{
 1:[ {g:()=>{ const v=ri(1,29); return {q:"Quelle est l'abscisse du point A ?", fig:dix(0,3,[["A",v]]), rep:[T(D(v,1)),D(v,1)], ex:`Une petite graduation vaut 0,1 : A est ${v} graduation${v>1?"s":""} après 0, donc A(${T(D(v,1))}).`, sx:S_AXE}; }} ],
 2:[ {g:()=>{ const a=ri(2,8), v=10*a+ri(1,9); return {q:"Quelle est l'abscisse du point B ?", fig:dix(a,a+2,[["B",v]]), rep:D(v,1), ex:`Une graduation vaut 0,1 : B(${D(v,1)}).`, sx:S_AXE}; }},
     {g:()=>{ const d=ri(11,39), v=10*d+ri(1,9); return {q:"Cette demi-droite est graduée en centièmes. Quelle est l'abscisse du point M ?", fig:cent(d,[["M",v]]), rep:D(v,2), ex:`Entre ${D(d,1)} et ${D(d+1,1)}, une graduation vaut 0,01 : M(${D(v,2)}).`, sx:S_AXE}; }} ],
 3:[ {g:()=>{ const v=ri(1,9)*10+5; return {q:`Sur une demi-droite graduée en dixièmes, où se trouve le nombre ${D(v,2)} ?`, c:uniq(`au milieu entre ${D(v-5,2).replace(/0$/,"")} et ${D(v+5,2).replace(/0$/,"")}`,[`sur la graduation ${D(v-5,2).replace(/0$/,"")}`,`sur la graduation ${D(v+5,2).replace(/0$/,"")}`]), rep:`au milieu entre ${D(v-5,2).replace(/0$/,"")} et ${D(v+5,2).replace(/0$/,"")}`, ex:`${D(v,2)} = ${D(v-5,2)} + 0,05 : c'est la moitié d'un dixième.`, sx:S_AXE}; }} ]
}},
{nom:"Comparer et ranger", schema:S_CMP, q:{
 1:[ {g:()=>{ const a=ri(1,9), x=ri(1,9), y=ri(10,99); const A=`${a},${x}`, B=`${a},${y}`; const s=10*x>y?"&gt;":10*x<y?"&lt;":"="; return {q:`Complète : ${A} … ${B}`, c:["&lt;","&gt;","="], rep:s, ex:`On écrit ${A} = ${a},${x}0 et on compare ${x}0 et ${y} centièmes.`, sx:S_CMP}; }},
     {q:"Ranger dans l'ordre décroissant, c'est ranger…", c:["du plus grand au plus petit","du plus petit au plus grand"], rep:"du plus grand au plus petit"} ],
 2:[ {g:()=>{ const e=ri(1,20); const v=shuf([ri(10,99), ri(1,9)*10, ri(100,999)/10|0]).map(x=>x); const nums=[`${e},${ri(1,9)}`, `${e},0${ri(1,9)}`, `${e},${(x=>x%10?x:x+1)(ri(11,98))}`, `${e+1}`]; const val=s=>parseFloat(s.replace(",",".")); const sorted=[...nums].sort((p,q)=>val(p)-val(q)); return {q:`Quel est le plus petit de ces nombres : ${shuf(nums).join(" ; ")} ?`, c:shuf(nums), rep:sorted[0], ex:`${e+1} est le plus grand. Parmi les nombres de partie entière ${e}, on compare les dixièmes : ${sorted[0]} a le plus petit chiffre des dixièmes.`, sx:S_CMP}; }},
     {g:()=>{ const a=ri(2,9); return {q:`Complète : 0,99 … ${a-1}`, c:["&lt;","&gt;","="], rep:a-1>=1?"&lt;":"&gt;", ex:`On compare d'abord les parties entières : 0 &lt; ${a-1}.`, sx:S_CMP}; }} ],
 3:[ {g:()=>{ const e=ri(1,9), a=ri(1,8); const A=`${e},${a}`, B=`${e},${a}${ri(1,9)}${ri(1,9)}`; return {q:`Complète : ${A} … ${B}`, c:["&lt;","&gt;","="], rep:"&lt;", ex:`${A} = ${e},${a}00 et ${B} a plus de millièmes : ${A} &lt; ${B}. Le nombre qui a le plus de chiffres n'est pas forcément le plus grand !`, sx:S_CMP}; }},
     {g:()=>{ const e=ri(1,9), a=ri(2,9), b=ri(10,a*10-1); const A=`${e},${a}`, B=`${e},${String(b).padStart(2,"0")}`; return {q:`Vrai ou faux : ${B} &gt; ${A}, car ${b} &gt; ${a}.`, c:VF, rep:"Faux", ex:`${A} = ${e},${a}0 et ${a}0 &gt; ${b} : donc ${A} &gt; ${B}.`, sx:S_CMP}; }} ]
}},
{nom:"Encadrer et intercaler", schema:S_ENC, q:{
 1:[ {g:()=>{ const n=ri(1001,9999); const e=Math.floor(n/1000); return {q:`Encadre ${D(n,3)} à l'unité près : □ &lt; ${D(n,3)} &lt; □`, t:`□ &lt; ${D(n,3)} &lt; □`, r:[String(e),String(e+1)], ex:`${e} &lt; ${D(n,3)} &lt; ${e+1}.`, sx:S_ENC}; }} ],
 2:[ {g:()=>{ let n; do{ n=ri(1001,9999); }while(n%100===0); const d=Math.floor(n/100); return {q:`Encadre ${D(n,3)} au dixième près.`, t:`□ &lt; ${D(n,3)} &lt; □`, r:[T(D(d,1)),T(D(d+1,1))], ex:`${T(D(d,1))} &lt; ${D(n,3)} &lt; ${T(D(d+1,1))}.`, sx:S_ENC}; }},
     {g:()=>{ const a=ri(11,98); return {q:`Quel nombre est compris entre ${D(a,1)} et ${D(a+1,1)} ?`, c:uniq(D(10*a+5,2),[D(a+2,1),D(a,2),D(10*a-5,2)]), rep:D(10*a+5,2), ex:`On ajoute un chiffre après la virgule : ${D(a,1)} &lt; ${D(10*a+5,2)} &lt; ${D(a+1,1)}.`, sx:S_ENC}; }} ],
 3:[ {g:()=>{ let n; do{ n=ri(10001,99999); }while(n%10===0); const c=Math.floor(n/10); return {q:`Encadre ${D(n,3)} au centième près.`, t:`□ &lt; ${D(n,3)} &lt; □`, r:[D(c,2),D(c+1,2)].map(s=>[s,T(s)]), ex:`${D(c,2)} &lt; ${D(n,3)} &lt; ${D(c+1,2)}.`, sx:S_ENC}; }},
     {q:"Combien de nombres décimaux peut-on intercaler entre 1,57 et 1,58 ?", c:["une infinité","9","aucun","10"], rep:"une infinité", ex:"1,571 ; 1,5711 ; 1,57111… On peut toujours ajouter des chiffres.", sx:S_ENC} ]
}},
{nom:"Arrondir", schema:S_ARR, q:{
 1:[ {g:()=>{ const n=ri(101,999); const e=Math.round(n/100+1e-9); const up=n%100>=50; return {q:`Quel est l'arrondi à l'unité de ${D(n,2)} ?`, rep:String(Math.floor(n/100)+(up?1:0)), ex:`${Math.floor(n/100)} &lt; ${D(n,2)} &lt; ${Math.floor(n/100)+1}, et le chiffre des dixièmes est ${Math.floor(n/10)%10} : ${up?"on augmente":"on garde"}.`, sx:S_ARR}; }} ],
 2:[ {g:()=>{ let n; do{ n=ri(1001,9999); }while(n%100===50); const d=Math.floor(n/100)+(n%100>=50?1:0); return {q:`Quel est l'arrondi au dixième de ${D(n,3)} ?`, rep:[D(d,1), T(D(d,1))], ex:`Le chiffre des centièmes est ${Math.floor(n/10)%10} : ${n%100>=50?"on augmente le chiffre des dixièmes":"on garde le chiffre des dixièmes"}. Arrondi : ${D(d,1)}.`, sx:S_ARR}; }} ],
 3:[ {g:()=>{ const n=ri(101,999)*10+5; const c=Math.floor(n/10)+1; return {q:`Quel est l'arrondi au centième de ${D(n,3)} ?`, rep:[D(c,2),T(D(c,2))], ex:`${D(n,3)} est exactement au milieu entre ${D(c-1,2)} et ${D(c,2)} : on prend la borne supérieure, ${D(c,2)}.`, sx:S_ARR}; }},
     {g:()=>{ const n=ri(10,98)*100+ri(96,99); const u=Math.floor(n/100); return {q:`Quel est l'arrondi au dixième de ${D(n,2)} ?`, c:uniq(`${u+1},0`,[`${u},9`,`${u},10`,`${u+1}`].filter(x=>x!==`${u+1}`)), rep:`${u+1},0`, ex:`${u},9 &lt; ${D(n,2)} &lt; ${u+1},0 et ${D(n,2)} est plus proche de ${u+1},0 (on peut aussi écrire ${u+1}).`, sx:S_ARR}; }} ]
}}
],

/* ===================== ÉVAL D'ENTRAÎNEMENT (+ version aménagée pour les élèves à besoins particuliers) ===================== */
eval:{
titre:"Évaluation d'entraînement — Chapitre 5", duree:25, info:"Durée : 25 min · Calculatrice non autorisée",
comp:[
  ["RAISONNER","Je compare des nombres décimaux et je les range dans l'ordre.","Ex. 1 (3 points)"],
  ["CALCULER","Je trouve un encadrement, un nombre intercalé ou un arrondi.","Ex. 2 (2 points)"],
  ["REPRÉSENTER","J'écris un nombre décimal de plusieurs façons : écriture décimale, fraction décimale, en lettres.","Ex. 3 (3 points)"],
  ["REPRÉSENTER","Je repère et je place un nombre décimal sur une demi-droite graduée.","Ex. 4 (2 points)"]
],
exos:[
{t:"Le concours de saut en longueur", p:3, h:`<p>1) Vrai ou faux ? Corrige les phrases fausses. a) 15,3 est plus petit que 15,29. b) 6,07 est plus grand que 6,7. c) 0,9 et 0,90 sont égaux.</p>
  <p>2) Voici les sauts de cinq élèves : Léo 3,8 m · Ana 3,75 m · Tim 3,08 m · Lou 3,805 m · Sam 3,5 m.</p><p>Range ces longueurs dans l'ordre décroissant, puis donne le nom du gagnant.</p>`,
 c:`<p>1) a) Faux : 15,3 &gt; 15,29 (même partie entière ; 3 dixièmes &gt; 2 dixièmes). b) Faux : 6,07 &lt; 6,7 (0 dixième &lt; 7 dixièmes). c) Vrai : 0,90 = 0,9 (le zéro à droite est inutile). <i>(0,5 point chacun)</i></p>
  <p>2) J'écris tous les nombres avec trois chiffres après la virgule : 3,800 · 3,750 · 3,080 · 3,805 · 3,500.</p><p class="calc">3,805 &gt; 3,8 &gt; 3,75 &gt; 3,5 &gt; 3,08</p><p>Le gagnant est Lou. <i>(1 point pour le rangement, 0,5 point pour le gagnant)</i></p>`},
{t:"Encadrements et arrondis", p:2, h:`<p>a) Encadre 12,58 au dixième près : …… &lt; 12,58 &lt; ……</p><p>b) Trouve un nombre compris entre 7,4 et 7,41.</p><p>c) Arrondis 9,357 à l'unité, puis au centième.</p>`,
 c:`<p>a) 12,5 &lt; 12,58 &lt; 12,6 <i>(0,5 point)</i></p>
  <p>b) J'écris 7,4 = 7,400 et 7,41 = 7,410 : par exemple <b>7,405</b> (7,401 ; 7,402… conviennent aussi). <i>(0,5 point)</i></p>
  <p>c) À l'unité : 9 &lt; 9,357 &lt; 10, et 9,357 est plus proche de 9 : l'arrondi est <b>9</b>. Au centième : 9,35 &lt; 9,357 &lt; 9,36 ; le chiffre des millièmes est 7, donc l'arrondi est <b>9,36</b>. <i>(0,5 point chacun)</i></p>`},
{t:"Un nombre, plusieurs écritures", p:3, h:`<p>a) Donne l'écriture décimale de {2 053/100}.</p><p>b) Quelle fraction décimale est égale à 0,407 ?</p><p>c) Pour le nombre 618,294 : donne son chiffre des dixièmes, puis son nombre de dixièmes.</p><p>d) Écris 4,06 en lettres, avec les mots «&nbsp;unités&nbsp;» et «&nbsp;centièmes&nbsp;».</p><p>e) Écris 030,500 sans les zéros inutiles.</p>`,
 c:`<p>a) {2 053/100} = <b>20,53</b> (100 : deux chiffres après la virgule) <i>(0,5 point)</i></p>
  <p>b) 0,407 = <b>{407/1 000}</b> (trois chiffres après la virgule : 1 000) <i>(0,5 point)</i></p>
  <p>c) Le chiffre des dixièmes est <b>2</b>. Le nombre de dixièmes est <b>6 182</b> (je garde tous les chiffres jusqu'aux dixièmes). <i>(0,5 point chacun)</i></p>
  <p>d) quatre unités et six centièmes <i>(0,5 point)</i></p><p>e) 030,500 = <b>30,5</b> <i>(0,5 point)</i></p>`},
{t:"Zoom au centième", p:2, h:`${cent(48,[["A",482],["B",487]])}<p>a) Combien vaut une petite graduation ?</p><p>b) Donne l'abscisse de A et celle de B.</p><p>c) Place le point C(4,84).</p>`,
 c:`<p>a) Entre 4,8 et 4,9, il y a 10 intervalles : 0,1 ÷ 10 = <b>0,01</b> (un centième). <i>(0,5 point)</i></p><p>b) A(4,82) ; B(4,87) <i>(0,5 point chacun)</i></p>
  <p>c) C est à la 4<sup>e</sup> graduation après 4,8. <i>(0,5 point)</i></p>${cent(48,[["A",482],["C",484],["B",487]])}`}
],

/* ---------- version aménagée (tiers-temps) : le même sujet, environ un quart des questions en moins ---------- */
bep:{
titre:"Évaluation d'entraînement — Chapitre 5 · version aménagée", duree:25, info:"Version aménagée (tiers-temps) · Durée : 25 min · Calculatrice non autorisée",
note:"Le même sujet avec 4 questions en moins, à faire dans le même temps. Le total reste sur 10 points.",
comp:[
  ["RAISONNER","Je compare des nombres décimaux et je les range dans l'ordre.","Ex. 1 (3 points)"],
  ["CALCULER","Je trouve un encadrement, un nombre intercalé ou un arrondi.","Ex. 2 (2 points)"],
  ["REPRÉSENTER","J'écris un nombre décimal de plusieurs façons : écriture décimale, fraction décimale, en lettres.","Ex. 3 (3 points)"],
  ["REPRÉSENTER","Je repère et je place un nombre décimal sur une demi-droite graduée.","Ex. 4 (2 points)"]
],
exos:[
{t:"Le concours de saut en longueur", p:3, h:`<p>1) Vrai ou faux ? Corrige les phrases fausses. a) 15,3 est plus petit que 15,29. b) 6,07 est plus grand que 6,7.</p>
  <p>2) Voici les sauts de cinq élèves : Léo 3,8 m · Ana 3,75 m · Tim 3,08 m · Lou 3,805 m · Sam 3,5 m.</p><p>Range ces longueurs dans l'ordre décroissant, puis donne le nom du gagnant.</p>`,
 c:`<p>1) a) Faux : 15,3 &gt; 15,29 (même partie entière ; 3 dixièmes &gt; 2 dixièmes). b) Faux : 6,07 &lt; 6,7 (0 dixième &lt; 7 dixièmes). <i>(0,5 point chacun)</i></p>
  <p>2) J'écris tous les nombres avec trois chiffres après la virgule : 3,800 · 3,750 · 3,080 · 3,805 · 3,500.</p><p class="calc">3,805 &gt; 3,8 &gt; 3,75 &gt; 3,5 &gt; 3,08</p><p>Le gagnant est Lou. <i>(1,5 point pour le rangement, 0,5 point pour le gagnant)</i></p>`},
{t:"Encadrements et arrondis", p:2, h:`<p>a) Encadre 12,58 au dixième près : …… &lt; 12,58 &lt; ……</p><p>b) Arrondis 9,357 à l'unité, puis au centième.</p>`,
 c:`<p>a) 12,5 &lt; 12,58 &lt; 12,6 <i>(1 point)</i></p>
  <p>b) À l'unité : 9 &lt; 9,357 &lt; 10, et 9,357 est plus proche de 9 : l'arrondi est <b>9</b>. Au centième : 9,35 &lt; 9,357 &lt; 9,36 ; le chiffre des millièmes est 7, donc l'arrondi est <b>9,36</b>. <i>(0,5 point chacun)</i></p>`},
{t:"Un nombre, plusieurs écritures", p:3, h:`<p>a) Donne l'écriture décimale de {2 053/100}.</p><p>b) Pour le nombre 618,294 : donne son chiffre des dixièmes, puis son nombre de dixièmes.</p><p>c) Écris 4,06 en lettres, avec les mots «&nbsp;unités&nbsp;» et «&nbsp;centièmes&nbsp;».</p>`,
 c:`<p>a) {2 053/100} = <b>20,53</b> (100 : deux chiffres après la virgule) <i>(1 point)</i></p>
  <p>b) Le chiffre des dixièmes est <b>2</b>. Le nombre de dixièmes est <b>6 182</b> (je garde tous les chiffres jusqu'aux dixièmes). <i>(0,5 point chacun)</i></p>
  <p>c) quatre unités et six centièmes <i>(1 point)</i></p>`},
{t:"Zoom au centième", p:2, h:`${cent(48,[["A",482],["B",487]])}<p>a) Combien vaut une petite graduation ?</p><p>b) Donne l'abscisse de A et celle de B.</p><p>c) Place le point C(4,84).</p>`,
 c:`<p>a) Entre 4,8 et 4,9, il y a 10 intervalles : 0,1 ÷ 10 = <b>0,01</b> (un centième). <i>(0,5 point)</i></p><p>b) A(4,82) ; B(4,87) <i>(0,5 point chacun)</i></p>
  <p>c) C est à la 4<sup>e</sup> graduation après 4,8. <i>(0,5 point)</i></p>${cent(48,[["A",482],["C",484],["B",487]])}`}
]}
}
};
})();
;(function(k){var D=typeof CH!=="undefined"&&CH[k],L=[];if(D&&D.exos)D.exos.forEach(function(S){(S.e||[]).forEach(function(e){L.push(e);});});(window.LOCKS=window.LOCKS||{})[k]={D:D,e:L};})("6e-5");
