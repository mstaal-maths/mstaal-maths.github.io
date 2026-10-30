/* 4e — Chapitre 6 : La réciproque du théorème de Pythagore
   (« Utiliser l'égalité de Pythagore pour démontrer qu'un triangle est rectangle ou non » : cours, activité 1, exercices 1 à 8 et problème ouvert de M. Staal)
   Images du cours et de la fiche : documents Word (img/4k6co, 4k6ex). Les triangles avec leurs carrés et le quadrillage de l'exercice 2 sont dessinés en SVG. */
(function(){
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const co=(p,alt,w)=>img("4k6co/"+p+".png",alt,w), ex=(p,alt,w)=>img("4k6ex/"+p+".png",alt,w);
const fig=(cap,body)=>{ const m=/^<img[^>]*width:(\d+)px/.exec(body); return `<figure${m?` style="max-width:${Math.max(+m[1],150)}px"`:""}>${body}${cap?`<figcaption>${cap}</figcaption>`:""}</figure>`; };
const r4=x=>Math.round(x*10000)/10000;
const F=x=>{ const r=r4(x); const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const sq=x=>r4(x*x);

/* ------------------------------------------------------------------
   Triangle avec les carrés construits sur ses côtés (y vers le haut)
   sides : BC = a (posé à l'horizontale), CA = b, AB = c · labels des aires écrites dans les carrés
------------------------------------------------------------------ */
const COL=["#4a86c5","#6aaa3a","#d6457a"];
function sqFig(a,b,c,o={}){
  const x=(c*c-b*b+a*a)/(2*a), P={B:[0,0],C:[a,0],A:[x,Math.sqrt(Math.max(0,c*c-x*x))]};
  const nm=o.names||{A:"A",B:"B",C:"C"}, G=[(P.A[0]+P.B[0]+P.C[0])/3,(P.A[1]+P.B[1]+P.C[1])/3];
  const squares=[["B","C"],["C","A"],["A","B"]].map(([p,q],i)=>{ const u=[P[q][0]-P[p][0],P[q][1]-P[p][1]]; let n=[-u[1],u[0]];
    const m=[(P[p][0]+P[q][0])/2,(P[p][1]+P[q][1])/2]; if((G[0]-m[0])*n[0]+(G[1]-m[1])*n[1]>0) n=[-n[0],-n[1]];
    return {pts:[P[p],P[q],[P[q][0]+n[0],P[q][1]+n[1]],[P[p][0]+n[0],P[p][1]+n[1]]], c:[m[0]+n[0]/2,m[1]+n[1]/2], col:COL[i]}; });
  const all=[...Object.values(P),...squares.flatMap(s=>s.pts)], mx=Math.min(...all.map(p=>p[0])), Mx=Math.max(...all.map(p=>p[0])), my=Math.min(...all.map(p=>p[1])), My=Math.max(...all.map(p=>p[1]));
  const k=o.k||Math.min(300/(Mx-mx), 280/(My-my)), pad=24, X=v=>pad+(v-mx)*k, Y=v=>pad+(My-v)*k, f=v=>v.toFixed(1);
  const W=Math.round((Mx-mx)*k+2*pad), H=Math.round((My-my)*k+2*pad);
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${Math.min(o.w||320,W)}" role="img" aria-label="${o.alt||"Triangle et les carrés construits sur ses côtés"}">`;
  squares.forEach(q=>{ s+=`<polygon points="${q.pts.map(p=>f(X(p[0]))+","+f(Y(p[1]))).join(" ")}" style="fill:${q.col}55;stroke:${q.col};stroke-width:2;stroke-linejoin:round"/>`; });
  s+=`<polygon points="${["A","B","C"].map(n=>f(X(P[n][0]))+","+f(Y(P[n][1]))).join(" ")}" style="fill:#f6e27a;stroke:var(--ink);stroke-width:2.2;stroke-linejoin:round"/>`;
  if(o.areas) squares.forEach((q,i)=>{ s+=`<text x="${f(X(q.c[0]))}" y="${f(Y(q.c[1])+6)}" text-anchor="middle" style="font-size:15px;font-weight:700;fill:#1a1a1a">${o.areas[i]}</text>`; });
  ["A","B","C"].forEach(n=>{ let u=[P[n][0]-G[0],P[n][1]-G[1]]; const L=Math.hypot(...u)||1; u=[u[0]/L,u[1]/L];
    s+=`<text x="${f(X(P[n][0])+u[0]*16)}" y="${f(Y(P[n][1])-u[1]*16+6)}" text-anchor="middle" style="font-weight:700;font-size:16px;fill:var(--ink)">${nm[n]}</text>`; });
  return s+"</svg>";
}
/* triangle seul, côtés écrits (y vers le haut) */
function triFig(a,b,c,o={}){
  const x=(c*c-b*b+a*a)/(2*a), P={B:[0,0],C:[a,0],A:[x,Math.sqrt(Math.max(0,c*c-x*x))]}, nm=o.names||{A:"A",B:"B",C:"C"};
  const xs=Object.values(P).map(p=>p[0]), ys=Object.values(P).map(p=>p[1]), mx=Math.min(...xs), Mx=Math.max(...xs), My=Math.max(...ys);
  const k=Math.min(40, 260/(Mx-mx), 180/(My||1)), pad=40, X=v=>pad+(v-mx)*k, Y=v=>pad+(My-v)*k, f=v=>v.toFixed(1), G=[(P.A[0]+a)/3,P.A[1]/3];
  const W=Math.round((Mx-mx)*k+2*pad), H=Math.round(My*k+2*pad);
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${Math.min(o.w||300,W)}" role="img" aria-label="${o.alt||"Triangle"}"><polygon points="${["A","B","C"].map(n=>f(X(P[n][0]))+","+f(Y(P[n][1]))).join(" ")}" style="fill:none;stroke:var(--ink);stroke-width:2.2;stroke-linejoin:round"/>`;
  ["A","B","C"].forEach(n=>{ let u=[P[n][0]-G[0],P[n][1]-G[1]]; const L=Math.hypot(...u)||1; u=[u[0]/L,u[1]/L]; s+=`<text x="${f(X(P[n][0])+u[0]*16)}" y="${f(Y(P[n][1])-u[1]*16+6)}" text-anchor="middle" style="font-weight:700;font-size:16px;fill:var(--ink)">${nm[n]}</text>`; });
  (o.len||[]).forEach(([p,q,t])=>{ const m=[(P[p][0]+P[q][0])/2,(P[p][1]+P[q][1])/2]; let u=[m[0]-G[0],m[1]-G[1]]; const L=Math.hypot(...u)||1; u=[u[0]/L,u[1]/L];
    s+=`<text x="${f(X(m[0])+u[0]*(14+Math.abs(u[0])*18))}" y="${f(Y(m[1])-u[1]*16+5)}" text-anchor="middle" style="font-size:15px;font-weight:600;fill:var(--ink)">${t}</text>`; });
  return s+"</svg>";
}

/* ------------------------------------------------------------------
   Rédaction : le triangle est-il rectangle ?
   nom "IJK", côtés {IJ:15, IK:7, KJ:12}, unité
------------------------------------------------------------------ */
function redac(nom, L, u="cm"){
  const ks=Object.keys(L).sort((p,q)=>L[q]-L[p]), [g,s1,s2]=ks, G2=sq(L[g]), S=r4(sq(L[s1])+sq(L[s2])), ok=Math.abs(G2-S)<1e-9;
  const som=[...nom].find(ch=>!g.includes(ch));
  const h=`<p>Dans le triangle ${nom}, le plus grand côté est [${g}].</p>
   <p class="calc">D'une part : ${g}² = ${F(L[g])} × ${F(L[g])} = ${F(G2)}</p>
   <p class="calc">D'autre part : ${s1}² + ${s2}² = ${F(L[s1])} × ${F(L[s1])} + ${F(L[s2])} × ${F(L[s2])} = ${F(sq(L[s1]))} + ${F(sq(L[s2]))} = ${F(S)}</p>
   <p>On constate que ${g}² ${ok?"=":"≠"} ${s1}² + ${s2}².</p>
   <p>${ok?`L'égalité de Pythagore est vérifiée. Donc, d'après la réciproque du théorème de Pythagore, <b>le triangle ${nom} est rectangle en ${som}</b>.`:`L'égalité de Pythagore n'est pas vérifiée. Donc <b>le triangle ${nom} n'est pas rectangle</b>.`}</p>`;
  return {h, ok, som, g, s1, s2, G2, S};
}
window.R46={sqFig, triFig, redac, F, sq, r4};

/* ===================== schémas ===================== */
const S_SQ=sch("Aire et périmètre d'un carré", `<p class="calc">Périmètre = 4 × côté &nbsp; · &nbsp; Aire = côté × côté</p><p class="schN">Carré de côté 5 cm : périmètre 4 × 5 = 20 cm ; aire 5 × 5 = 25 cm².</p><p class="schN">Aire 36 cm² : le côté est le nombre qui multiplié par lui-même donne 36, c'est 6 cm.</p>`);
const S_OUI=sch("L'égalité est vérifiée", `<div class="figs">${sqFig(4,3,5,{areas:["16","9","25"],k:22,w:220,names:{A:"B",B:"C",C:"A"}})}</div><p class="schN">Le plus grand côté est [BC]. Si BC² = AB² + AC², alors le triangle ABC est rectangle en A.</p><p class="schN">Ici : 9 + 16 = 25.</p>`);
const S_NON=sch("L'égalité n'est pas vérifiée", `<p class="schN">Le plus grand côté est [BC]. Si BC² ≠ AB² + AC², alors le triangle ABC n'est pas rectangle.</p><p class="calc">IJ = 15 ; IK = 7 ; KJ = 12<br>15² = 225 &nbsp; et &nbsp; 7² + 12² = 49 + 144 = 193</p><p class="schN">225 ≠ 193 : IJK n'est pas rectangle.</p>`);
const S_RED=sch("Rédiger", `<p class="schN">1. Je repère le plus grand côté.</p><p class="schN">2. D'une part, je calcule son carré.</p><p class="schN">3. D'autre part, je calcule la somme des carrés des deux autres côtés.</p><p class="schN">4. Je compare et je conclus : égalité → rectangle (l'angle droit est en face du plus grand côté) ; pas égalité → pas rectangle.</p>`);

/* ---------- générateurs ---------- */
const TRIP=[[3,4,5],[6,8,10],[5,12,13],[8,15,17],[9,12,15],[7,24,25],[20,21,29],[12,16,20],[15,20,25],[28,45,53],[11,60,61],[33,56,65],[16,63,65],[36,77,85],[39,80,89],[48,55,73],[13,84,85],[65,72,97]];
const NOMS=["ABC","DEF","IJK","MNP","RST","UVW","EFG","KLM","GHI","XYZ","OPQ"];
/* un triangle : rectangle (ok) ou pas, côtés écrits avec k décimales possibles */
function triGen(ok, dec){
  for(let g=0;g<500;g++){ let [a,b,c]=pick(TRIP), k=dec?pick([0.1,0.1,0.2,0.3,0.5,0.01*pick([10,20])]):pick([1,1,2,3]);
    a=r4(a*k); b=r4(b*k); c=r4(c*k);
    if(!ok){ const d=dec?pick([0.1,0.2,-0.1,-0.2,0.3]):pick([1,-1,2]); c=r4(c+d); if(c<=Math.max(a,b)||c>=a+b) continue; }
    if(Math.max(a,b,c)>200) continue; return [a,b,c]; }
  return ok?[3,4,5]:[3,4,6];
}
const SIDES=n=>{ const [p,q,r]=n.split(""); return [p+q,q+r,p+r]; };
const assign=(nom,[a,b,c])=>{ const S=shuf(SIDES(nom)), v=shuf([a,b,c]); return Object.fromEntries(S.map((s,i)=>[s,v[i]])); };
const et=a=>a.length>1?a.slice(0,-1).join(" ; ")+" et "+a[a.length-1]:a.join("");
const listL=(L,u="cm")=>et(Object.entries(L).map(([s,v])=>`${s} = ${F(v)} ${u}`));

CH["4e-6"] = {
intro:"Utiliser l'égalité de Pythagore pour démontrer qu'un triangle est rectangle… ou qu'il ne l'est pas : on compare le carré du plus grand côté et la somme des carrés des deux autres.",
savoir:[
  "calculer le périmètre et l'aire d'un carré, retrouver son côté à partir de son aire ;",
  "repérer le plus grand côté d'un triangle ;",
  "démontrer qu'un triangle est rectangle avec la réciproque du théorème de Pythagore ;",
  "démontrer qu'un triangle n'est pas rectangle ;",
  "utiliser cette propriété pour résoudre un problème (étagère, bureau, potager…)."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Si l'égalité de Pythagore est vérifiée", h:`
  <div class="retenir" data-l="Propriété"><p>Dans un triangle, <b>si</b> l'aire du grand carré <b>est égale</b> à la somme des aires des deux petits carrés, <b>alors</b> le triangle <b>est rectangle</b>.</p></div>
  <div class="figs">${fig("Les trois carrés construits sur les côtés",co("carres1","Triangle ABC et les carrés construits sur ses côtés",280))}${fig("Le triangle ABC est rectangle en A",co("tri1","Triangle ABC rectangle en A",150))}</div>
  <div class="retenir" data-l="Propriété"><p>Autrement dit, on considère un triangle ABC avec [BC] le plus grand côté du triangle.</p><p><b>Si</b> BC² = AB² + AC², <b>alors</b> le triangle ABC est rectangle en A.</p></div>`},
{k:"II", t:"Si l'égalité de Pythagore n'est pas vérifiée", h:`
  <div class="retenir" data-l="Propriété"><p>Dans un triangle, <b>si</b> l'aire du grand carré <b>n'est pas égale</b> à la somme des aires des deux petits carrés, <b>alors</b> le triangle <b>n'est pas rectangle</b>.</p></div>
  <div class="figs">${fig("Les trois carrés construits sur les côtés",co("carres2","Triangle ABC et les carrés construits sur ses côtés",280))}${fig("Le triangle ABC n'est pas rectangle",co("tri2","Triangle ABC non rectangle",180))}</div>
  <div class="retenir" data-l="Propriété"><p>Autrement dit, on considère un triangle ABC avec [BC] le plus grand côté du triangle.</p><p><b>Si</b> BC² ≠ AB² + AC², <b>alors</b> le triangle ABC n'est pas rectangle.</p></div>`},
{k:"III", t:"Démontrer qu'un triangle est rectangle ou non", h:`
  <p>Ce théorème (la réciproque du théorème de Pythagore) nous permet de démontrer qu'un triangle est rectangle ou non.</p>
  <div class="retenir" data-l="Méthode"><p><b>1)</b> Je repère le plus grand côté du triangle.</p><p><b>2)</b> D'une part, je calcule le carré du plus grand côté.</p><p><b>3)</b> D'autre part, je calcule la somme des carrés des deux autres côtés.</p><p><b>4)</b> Je compare les deux résultats et je conclus.</p></div>
  <h4>Exemple 1</h4>
  <p>Lucas vient d'installer un bureau dans sa chambre. Est-il vraiment horizontal ?</p>
  ${co("bureau","Le bureau de Lucas : 80 cm sur le mur, 60 cm pour le bureau, 1 m pour la planche oblique",300)}
  <p>Le mur est vertical. Le bureau est horizontal s'il est perpendiculaire au mur, c'est-à-dire si le triangle formé est rectangle.</p>
  <p>Les longueurs doivent être dans la même unité : 1 m = 100 cm.</p>
  <p>Le plus grand côté mesure 100 cm.</p>
  <p class="calc">D'une part : 100² = 100 × 100 = 10 000</p>
  <p class="calc">D'autre part : 80² + 60² = 80 × 80 + 60 × 60 = 6 400 + 3 600 = 10 000</p>
  <p>On constate que 100² = 80² + 60². L'égalité de Pythagore est vérifiée.</p>
  <p>Donc, d'après la réciproque du théorème de Pythagore, le triangle est rectangle : le bureau est perpendiculaire au mur. <b>Le bureau est bien horizontal.</b></p>
  <h4>Exemple 2</h4>
  <p>Est-ce que le triangle IJK ayant pour longueurs IK = 7 cm, IJ = 15 cm et KJ = 12 cm est un triangle rectangle ?</p>
  ${redac("IJK",{IJ:15,IK:7,KJ:12}).h}`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Rappels : périmètre et aire d'un carré", e:[
  {n:"Exercice 1", t:"Différence entre périmètre et aire", w:"Sur ton cahier", h:`<p><b>Partie 1 :</b> l'unité d'aire est l'aire d'un carreau.</p><p><b>1)</b> En t'aidant du quadrillage, dessine deux figures de <b>même aire</b> mais de <b>périmètres différents</b>.</p><p><b>2)</b> En t'aidant du quadrillage, dessine deux figures de <b>même périmètre</b> mais d'<b>aires différentes</b>.</p>
   <p><b>Partie 2 :</b> écris le calcul qui t'a permis de répondre, puis la réponse.</p>
   <p><b>1) a)</b> Quel est le périmètre d'un carré de 5 cm de côté ?</p><p><b>b)</b> Quelle est l'aire d'un carré de 5 cm de côté ?</p>
   <p><b>2) a)</b> Quel est le périmètre d'un carré de 8 dm de côté ?</p><p><b>b)</b> Quelle est l'aire d'un carré de 8 dm de côté ?</p>
   <p><b>3) a)</b> Le périmètre d'un carré vaut 36 cm. Quelle est la longueur de son côté ?</p><p><b>b)</b> L'aire d'un carré vaut 36 cm². Quelle est la longueur de son côté ?</p>
   <p><b>4) a)</b> Le périmètre d'un carré vaut 100 cm. Quelle est la longueur de son côté ?</p><p><b>b)</b> L'aire d'un carré vaut 100 cm². Quelle est la longueur de son côté ?</p>
   <p><b>5)</b> Je suis un carré. Mon aire est comprise entre 40 cm² et 50 cm². La longueur de mon côté est un nombre entier. Quelle est la longueur de mes côtés ?</p>`,
   c:`<p><b>Partie 1 (un exemple parmi d'autres) :</b></p><p><b>1)</b> Un rectangle de 2 carreaux sur 6 et un rectangle de 3 carreaux sur 4 : même aire (12 carreaux), mais périmètres 16 et 14.</p><p><b>2)</b> Un rectangle de 1 carreau sur 5 et un carré de 3 carreaux sur 3 : même périmètre (12), mais aires 5 et 9 carreaux.</p>${(()=>{ const k=24, X=x=>8+x*k, Y=y=>8+y*k, W=25, H=8; let s=`<svg class="fig" viewBox="0 0 ${X(W)+8} ${Y(H)+8}" width="${X(W)+8}" role="img" aria-label="Sur quadrillage : un rectangle de 2 sur 6 et un rectangle de 3 sur 4 (même aire) ; un rectangle de 1 sur 5 et un carré de 3 sur 3 (même périmètre)">`;
     for(let x=0;x<=W;x++) s+=`<line x1="${X(x)}" y1="${Y(0)}" x2="${X(x)}" y2="${Y(H)}" class="gridl"/>`; for(let y=0;y<=H;y++) s+=`<line x1="${X(0)}" y1="${Y(y)}" x2="${X(W)}" y2="${Y(y)}" class="gridl"/>`;
     const R=(x,y,w,h,c)=>`<rect x="${X(x)}" y="${Y(y)}" width="${w*k}" height="${h*k}" style="fill:${c}55;stroke:${c};stroke-width:2.2"/>`, T=(x,y,t)=>`<text x="${X(x)}" y="${Y(y)}" text-anchor="middle" style="font-size:14px;font-weight:700;fill:var(--ink)">${t}</text>`;
     s+=R(1,1,2,6,"#4a86c5")+R(4,1,4,3,"#4a86c5")+T(4.5,7.75,"1)")+R(14,1,5,1,"#d6457a")+R(14,3,3,3,"#d6457a")+T(16.5,7.75,"2)");
     return s+"</svg>"; })()}
   <p><b>Partie 2 :</b></p>
   <p><b>1) a)</b> 4 × 5 = <b>20 cm</b> · <b>b)</b> 5 × 5 = <b>25 cm²</b></p>
   <p><b>2) a)</b> 4 × 8 = <b>32 dm</b> · <b>b)</b> 8 × 8 = <b>64 dm²</b></p>
   <p><b>3) a)</b> 36 ÷ 4 = <b>9 cm</b> · <b>b)</b> 6 × 6 = 36, donc le côté mesure <b>6 cm</b>.</p>
   <p><b>4) a)</b> 100 ÷ 4 = <b>25 cm</b> · <b>b)</b> 10 × 10 = 100, donc le côté mesure <b>10 cm</b>.</p>
   <p><b>5)</b> 6 × 6 = 36 (trop petit), 7 × 7 = 49 (entre 40 et 50), 8 × 8 = 64 (trop grand). Le côté mesure <b>7 cm</b>.</p>`},
  {n:"Exercice 2", t:"Calculs d'aires", w:"Sur ta feuille", h:`<p>L'unité d'aire est l'aire d'un carreau.</p><p>Indique l'aire de chaque figure.</p>${(()=>{ const k=30, X=x=>8+x*k, Y=y=>8+y*k; let s=`<svg class="fig" viewBox="0 0 ${Math.round(X(20)+8)} ${Math.round(Y(6)+8)}" width="${Math.round(X(20)+8)}" role="img" aria-label="Quatre figures sur quadrillage : un rectangle, un triangle, un losange et un carré penché">`;
     for(let x=0;x<=20;x++) s+=`<line x1="${X(x)}" y1="${Y(0)}" x2="${X(x)}" y2="${Y(6)}" class="gridl"/>`; for(let y=0;y<=6;y++) s+=`<line x1="${X(0)}" y1="${Y(y)}" x2="${X(20)}" y2="${Y(y)}" class="gridl"/>`;
     const pg=(P,c)=>`<polygon points="${P.map(([x,y])=>X(x)+","+Y(y)).join(" ")}" style="fill:${c}66;stroke:${c};stroke-width:2;stroke-linejoin:round"/>`, dl=(a,b)=>`<line x1="${X(a[0])}" y1="${Y(a[1])}" x2="${X(b[0])}" y2="${Y(b[1])}" style="stroke:var(--ink);stroke-width:1.4;stroke-dasharray:5 4"/>`;
     s+=pg([[1,2],[4,2],[4,4],[1,4]],"#6aaa3a")+pg([[6,2],[6,4],[9,4]],"#4a86c5")+dl([6,2],[9,2])+dl([9,2],[9,4])+pg([[12,2],[13,3],[12,4],[11,3]],"#d6457a")+dl([11,3],[13,3])+dl([12,2],[12,4])+pg([[16,1],[19,2],[18,5],[15,4]],"#e0b400")+dl([16,1],[16,4])+dl([16,2],[19,2])+dl([18,2],[18,5])+dl([15,4],[18,4]);
     ["①","②","③","④"].forEach((t,i)=>{ s+=`<text x="${X([2.5,7.5,12,17][i])}" y="${Y(5.7)}" text-anchor="middle" style="font-size:16px;font-weight:700;fill:var(--ink)">${t}</text>`; }); return s+"</svg>"; })()}`,
   c:`<p><b>①</b> Rectangle de 3 carreaux sur 2 : 3 × 2 = <b>6 carreaux</b>.</p><p><b>②</b> Triangle : la moitié du rectangle de 3 sur 2 : 6 ÷ 2 = <b>3 carreaux</b>.</p><p><b>③</b> Losange : 4 demi-carreaux, soit <b>2 carreaux</b>.</p><p><b>④</b> Carré penché : le carré de 2 sur 2 au centre (4 carreaux) et 4 triangles de 3 sur 1 (1,5 carreau chacun) : 4 + 4 × 1,5 = <b>10 carreaux</b>.</p>`}
 ]},
{t:"Découvrir la propriété", e:[
  {n:"Activité 1", t:"À quelles conditions le triangle ABC est-il rectangle ?", w:"Sur ton cahier", h:`<p>Dans chacun des cas, on cherche à savoir si le triangle ABC est rectangle.</p><p><b>1)</b> À vue d'œil, tu as peut-être déjà une idée. Indique les cas où tu penses que le triangle ABC est rectangle.</p><p>Cependant, une simple observation ne suffit pas ! Il faut le prouver par le calcul. Pour cela, on a construit, sur les côtés de chaque triangle, trois carrés (bleu, vert et rose).</p><p><b>2)</b> Dans chaque cas, détermine l'aire de chaque carré (l'unité d'aire est l'aire d'un carreau).</p>${ex("act1","Six triangles ABC avec les carrés bleu, vert et rose construits sur leurs côtés",560)}<p><b>3)</b> Dans quel cas le triangle ABC est-il rectangle ? Comment peux-tu le démontrer par le calcul ?</p>`,
   c:`<p><b>2)</b> Aires des carrés (en carreaux) :</p>
   <div class="scroll"><table class="std"><thead><tr><th>Cas</th><th>Bleu</th><th>Rose</th><th>Vert</th><th>Somme des deux petits</th><th>Grand carré</th></tr></thead><tbody>
   <tr><th>①</th><td>4</td><td>16</td><td>20</td><td>4 + 16 = 20</td><td>20 (vert)</td></tr>
   <tr><th>②</th><td>4</td><td>10</td><td>18</td><td>4 + 10 = 14</td><td>18 (vert)</td></tr>
   <tr><th>③</th><td>16</td><td>8</td><td>8</td><td>8 + 8 = 16</td><td>16 (bleu)</td></tr>
   <tr><th>④</th><td>25</td><td>5</td><td>20</td><td>5 + 20 = 25</td><td>25 (bleu)</td></tr>
   <tr><th>⑤</th><td>4</td><td>9</td><td>13</td><td>4 + 9 = 13</td><td>13 (vert)</td></tr>
   <tr><th>⑥</th><td>13</td><td>10</td><td>9</td><td>9 + 10 = 19</td><td>13 (bleu)</td></tr></tbody></table></div>
   <p>Pour un carré penché, on compte le carré du centre et les triangles autour (comme dans l'exercice 2).</p>
   <p><b>3)</b> Le triangle ABC est rectangle dans les cas <b>①, ③, ④ et ⑤</b> : l'aire du grand carré est égale à la somme des aires des deux petits carrés.</p><p>Dans les cas ② et ⑥, ce n'est pas égal : le triangle n'est pas rectangle.</p>`}
 ]},
{t:"Le triangle est-il rectangle ?", e:[
  {n:"Exercice 3", t:"Le triangle est-il rectangle ?", w:"Sur ton cahier", h:`<div class="figs">${fig("a) Le triangle EFG est-il rectangle ? Justifie.",ex("e3a","Triangle EFG : carrés de 92,16 cm², 16 cm² et 108,16 cm²",300))}${fig("b) Le triangle OEA est-il rectangle ? Justifie.",ex("e3b","Triangle OEA : carrés de 100 cm², 60,84 cm² et 43,56 cm²",260))}</div>`,
   c:`<p><b>a)</b> Le grand carré a pour aire 108,16 cm².</p><p class="calc">92,16 + 16 = 108,16</p><p>L'aire du grand carré est égale à la somme des aires des deux petits carrés. Donc <b>le triangle EFG est rectangle en E</b>.</p>
   <p><b>b)</b> Le grand carré a pour aire 100 cm².</p><p class="calc">60,84 + 43,56 = 104,4</p><p>104,4 ≠ 100 : l'aire du grand carré n'est pas égale à la somme des aires des deux petits carrés. Donc <b>le triangle OEA n'est pas rectangle</b>.</p>`},
  {n:"Exercice 4", t:"Le triangle est-il rectangle ?", w:"Sur ton cahier", h:`<p><b>a)</b> On considère un triangle dont les côtés mesurent 6 cm, 8 cm et 10 cm. Est-ce que ce triangle est rectangle ? Justifie.</p><p><b>b)</b> On considère un triangle dont les côtés mesurent 6 cm, 2 cm et 5 cm. Est-ce que ce triangle est rectangle ? Justifie.</p>`,
   c:`<p><b>a)</b> Le plus grand côté mesure 10 cm.</p><p class="calc">D'une part : 10² = 100<br>D'autre part : 6² + 8² = 36 + 64 = 100</p><p>L'égalité de Pythagore est vérifiée : <b>le triangle est rectangle</b> (l'angle droit est en face du côté de 10 cm).</p>
   <p><b>b)</b> Le plus grand côté mesure 6 cm.</p><p class="calc">D'une part : 6² = 36<br>D'autre part : 2² + 5² = 4 + 25 = 29</p><p>36 ≠ 29 : l'égalité de Pythagore n'est pas vérifiée. <b>Le triangle n'est pas rectangle.</b></p>`},
  {n:"Exercice 5", t:"Triangles rectangles ?", w:"Sur ton cahier", h:`<p>Ces triangles sont-ils rectangles ? Justifie.</p><p><b>a)</b> Le triangle ABC tel que : AB = 10,8 cm, BC = 14,4 cm et AC = 18 cm.</p><p><b>b)</b> Le triangle DEF tel que : DF = 177 cm, DE = 78 cm et EF = 160 cm.</p><p><b>c)</b> Le triangle STU tel que : TU = 20,9 m, SU = 24,1 m et ST = 12 m.</p>`,
   c:`<p><b>a)</b></p>${redac("ABC",{AC:18,AB:10.8,BC:14.4}).h}<p><b>b)</b></p>${redac("DEF",{DF:177,DE:78,EF:160}).h}<p><b>c)</b></p>${redac("STU",{SU:24.1,TU:20.9,ST:12},"m").h}`}
 ]},
{t:"Problèmes", e:[
  {n:"Exercice 6", t:"Installation d'une étagère", w:"Sur ton cahier", h:`<p>Sur un mur vertical, Jules a posé une étagère.</p>${ex("e6","Étagère : AE = 27 cm sur le mur, ET = 36 cm, AT = 45 cm",220)}<p>L'étagère est-elle horizontale ?</p>`,
   c:`<p>Le mur est vertical : l'étagère est horizontale si l'angle ${'<span class="ang">AET</span>'} est droit, c'est-à-dire si le triangle AET est rectangle en E.</p>${redac("AET",{AT:45,AE:27,ET:36}).h}<p>L'étagère est perpendiculaire au mur : <b>elle est horizontale</b>.</p>`},
  {n:"Exercice 7", t:"Son bureau", w:"Sur ton cahier", h:`${ex("e7","Bureau : 12 sur la paroi, 16 sur le plateau et 21 pour la diagonale",300)}<p>Lucie est perplexe. Ses parents lui ont acheté un bureau et ses stylos roulent et tombent.</p><p>Explique pourquoi.</p>`,
   c:`<p>On regarde le triangle formé par la paroi (12), le plateau (16) et la diagonale (21). Le plus grand côté mesure 21.</p><p class="calc">D'une part : 21² = 441<br>D'autre part : 12² + 16² = 144 + 256 = 400</p><p>441 ≠ 400 : l'égalité de Pythagore n'est pas vérifiée. Le triangle n'est pas rectangle.</p><p>Le plateau n'est donc pas perpendiculaire à la paroi verticale : <b>le bureau n'est pas horizontal</b>, il penche. C'est pour ça que les stylos roulent et tombent.</p>`},
  {n:"Exercice 8", t:"Forme de potager", w:"Sur ton cahier", h:`<p>Nathan prétend que son potager est de forme rectangulaire.</p><p>Émilie veut le vérifier. Elle mesure la longueur de deux côtés consécutifs du potager et obtient 3,3 m pour l'un et 5,6 m pour l'autre.</p><p>La diagonale mesure 6,6 m.</p><p>Émilie affirme à Nathan que son potager n'est pas de forme rectangulaire.</p><p>En supposant que les mesures d'Émilie sont exactes, explique son raisonnement.</p>`,
   c:`<p>Si le potager était un rectangle, ses angles seraient droits : le triangle formé par les deux côtés et la diagonale serait rectangle.</p><p>Le plus grand côté de ce triangle est la diagonale : 6,6 m.</p><p class="calc">D'une part : 6,6² = 6,6 × 6,6 = 43,56<br>D'autre part : 3,3² + 5,6² = 10,89 + 31,36 = 42,25</p><p>43,56 ≠ 42,25 : l'égalité de Pythagore n'est pas vérifiée. Le triangle n'est pas rectangle : l'angle entre les deux côtés n'est pas droit.</p><p><b>Le potager n'est donc pas de forme rectangulaire.</b> Émilie a raison.</p>`}
 ]},
{t:"Problème ouvert", e:[
  {n:"Exercice 9", t:"Recherche des carrés parfaits", w:"Sur ton cahier", h:`<p>Je suis un triangle rectangle dont les mesures des côtés sont des nombres entiers compris entre 1 et 15.</p><p>Quelles peuvent être les mesures de mes côtés ? Suis-je unique ?</p>`,
   c:`<p>On cherche trois nombres entiers entre 1 et 15 tels que le carré du plus grand soit égal à la somme des carrés des deux autres.</p><p>Carrés parfaits : 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225.</p>
   <p class="calc">3² + 4² = 9 + 16 = 25 = 5²<br>6² + 8² = 36 + 64 = 100 = 10²<br>5² + 12² = 25 + 144 = 169 = 13²<br>9² + 12² = 81 + 144 = 225 = 15²</p>
   <p>Les côtés peuvent mesurer <b>3, 4 et 5</b> ; <b>6, 8 et 10</b> ; <b>5, 12 et 13</b> ou <b>9, 12 et 15</b>. Le triangle n'est donc <b>pas unique</b> : il y a 4 possibilités.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Aire et périmètre d'un carré", schema:S_SQ, q:{
 1:[ {g:()=>{ const c=ri(3,12); return {q:`Quelle est l'aire d'un carré de ${c} cm de côté (en cm²) ?`, rep:[String(c*c),c*c+" cm²"], ex:`${c} × ${c} = ${c*c} cm².`, sx:S_SQ}; }},
     {g:()=>{ const c=ri(3,25); return {q:`Quel est le périmètre d'un carré de ${c} cm de côté (en cm) ?`, rep:[String(4*c),4*c+" cm"], ex:`4 × ${c} = ${4*c} cm.`, sx:S_SQ}; }} ],
 2:[ {g:()=>{ const c=ri(2,12); return {q:`L'aire d'un carré vaut ${c*c} cm². Quelle est la longueur de son côté (en cm) ?`, c:uniq(c+" cm",[F(c*c/4)+" cm",F(c*c/2)+" cm",(c+1)+" cm"]), rep:c+" cm", ex:`${c} × ${c} = ${c*c} : le côté mesure ${c} cm.`, sx:S_SQ}; }},
     {g:()=>{ const c=ri(3,30); return {q:`Le périmètre d'un carré vaut ${4*c} cm. Quelle est la longueur de son côté (en cm) ?`, rep:[String(c),c+" cm"], ex:`${4*c} ÷ 4 = ${c} cm.`, sx:S_SQ}; }} ],
 3:[ {g:()=>{ const c=ri(4,11), lo=c*c-ri(1,2*c-2), hi=c*c+ri(1,2*c); return {q:`Je suis un carré. Mon aire est comprise entre ${lo} cm² et ${hi} cm². La longueur de mon côté est un nombre entier. Combien mesure mon côté (en cm) ?`, rep:[String(c),c+" cm"], ex:`${c-1} × ${c-1} = ${(c-1)*(c-1)} et ${c+1} × ${c+1} = ${(c+1)*(c+1)} ne conviennent pas ; ${c} × ${c} = ${c*c} convient.`, sx:S_SQ}; }} ]
}},
{nom:"L'égalité est vérifiée", schema:S_OUI, q:{
 1:[ {g:()=>{ const [a,b,c]=pick(TRIP.slice(0,6)), ok=Math.random()<0.6, C=ok?c*c:c*c+pick([-3,-2,2,3,5]); return {q:`On construit trois carrés sur les côtés d'un triangle. Leurs aires sont ${a*a} cm², ${b*b} cm² et ${C} cm². Le triangle est-il rectangle ?`, c:["Oui","Non"], rep:ok?"Oui":"Non", ex:`${a*a} + ${b*b} = ${a*a+b*b}${ok?` : c'est l'aire du grand carré, le triangle est rectangle.`:` ≠ ${C} : le triangle n'est pas rectangle.`}`, sx:ok?S_OUI:S_NON}; }} ],
 2:[ {g:()=>{ const n=pick(NOMS), L=assign(n,triGen(true,false)), R=redac(n,L); return {q:`Le triangle ${n} est tel que ${listL(L)}. Ce triangle est rectangle. En quel sommet ?`, c:uniq(R.som,[...n].filter(x=>x!==R.som)), rep:R.som, ex:`Le plus grand côté est [${R.g}] : ${R.g}² = ${F(R.G2)} et ${R.s1}² + ${R.s2}² = ${F(R.S)}. L'angle droit est en face du plus grand côté, en ${R.som}.`, sx:S_OUI}; }} ],
 3:[ {g:()=>{ const n=pick(NOMS), L=assign(n,triGen(true,true)), R=redac(n,L); return {q:`Le triangle ${n} est tel que ${listL(L)}. Ce triangle est-il rectangle ?`, c:[`Oui, en ${R.som}`,...[...n].filter(x=>x!==R.som).map(x=>`Oui, en ${x}`),"Non"], rep:`Oui, en ${R.som}`, ex:`${R.g}² = ${F(R.G2)} et ${R.s1}² + ${R.s2}² = ${F(sq(L[R.s1]))} + ${F(sq(L[R.s2]))} = ${F(R.S)} : l'égalité est vérifiée, le triangle est rectangle en ${R.som}.`, sx:S_OUI}; }} ]
}},
{nom:"L'égalité n'est pas vérifiée", schema:S_NON, q:{
 1:[ {q:"Dans un triangle, le carré du plus grand côté n'est pas égal à la somme des carrés des deux autres côtés. Alors…", c:["le triangle n'est pas rectangle","le triangle est rectangle","on ne peut pas savoir"], rep:"le triangle n'est pas rectangle", sx:S_NON} ],
 2:[ {g:()=>{ const ok=Math.random()<0.4, n=pick(NOMS), L=assign(n,triGen(ok,false)), R=redac(n,L); return {q:`Le triangle ${n} est tel que ${listL(L)}. Ce triangle est-il rectangle ?`, c:["Oui","Non"], rep:R.ok?"Oui":"Non", ex:`${R.g}² = ${F(R.G2)} et ${R.s1}² + ${R.s2}² = ${F(R.S)}${R.ok?` : égalité, rectangle en ${R.som}.`:` : ${F(R.G2)} ≠ ${F(R.S)}, pas rectangle.`}`, sx:R.ok?S_OUI:S_NON}; }} ],
 3:[ {g:()=>{ const ok=Math.random()<0.4, n=pick(NOMS), L=assign(n,triGen(ok,true)), R=redac(n,L); return {q:`Le triangle ${n} est tel que ${listL(L)}. Ce triangle est-il rectangle ?`, c:["Oui","Non"], rep:R.ok?"Oui":"Non", ex:`${R.g}² = ${F(R.G2)} et ${R.s1}² + ${R.s2}² = ${F(R.S)}${R.ok?` : égalité, rectangle en ${R.som}.`:` : ${F(R.G2)} ≠ ${F(R.S)}, pas rectangle.`}`, sx:R.ok?S_OUI:S_NON}; }} ]
}},
{nom:"Rédiger et résoudre un problème", schema:S_RED, q:{
 1:[ {g:()=>{ const n=pick(NOMS), L=assign(n,triGen(Math.random()<0.5,false)), R=redac(n,L); return {q:`Le triangle ${n} est tel que ${listL(L)}. Quel est son plus grand côté ?`, c:Object.keys(L).map(s=>`[${s}]`), rep:`[${R.g}]`, ex:`${F(L[R.g])} cm est la plus grande longueur.`, sx:S_RED}; }} ],
 2:[ {g:()=>{ const n=pick(NOMS), L=assign(n,triGen(Math.random()<0.5,false)), R=redac(n,L); return {q:`Le triangle ${n} est tel que ${listL(L)}. Quelle égalité faut-il tester ?`, c:uniq(`${R.g}² = ${R.s1}² + ${R.s2}²`,[`${R.s1}² = ${R.g}² + ${R.s2}²`,`${R.s2}² = ${R.g}² + ${R.s1}²`]), rep:`${R.g}² = ${R.s1}² + ${R.s2}²`, ex:`On compare le carré du plus grand côté [${R.g}] à la somme des carrés des deux autres.`, sx:S_RED}; }} ],
 3:[ {g:()=>{ const ok=Math.random()<0.5, [a,b,c]=triGen(ok,false), k=pick([1,2,3,5]); const m=a*k, e=b*k, d=c*k; return {q:`Sur un mur vertical, une étagère est fixée : ${m} cm sur le mur, ${e} cm pour l'étagère et ${d} cm pour le support en diagonale. L'étagère est-elle horizontale ?`, c:["Oui","Non"], rep:ok?"Oui":"Non", ex:`${d}² = ${F(d*d)} et ${m}² + ${e}² = ${F(m*m)} + ${F(e*e)} = ${F(m*m+e*e)}${ok?" : égalité, le triangle est rectangle, l'étagère est perpendiculaire au mur, donc horizontale.":" : pas d'égalité, le triangle n'est pas rectangle, l'étagère n'est pas horizontale."}`, sx:S_RED}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 6", duree:50, info:"Durée : 50 min · Calculatrice autorisée · Règle",
comp:[
  ["CALCULER","Je calcule le périmètre et l'aire d'un carré, et son côté à partir de son aire.","Ex. 1 (3 points)"],
  ["RAISONNER","Je démontre qu'un triangle est rectangle ou qu'il ne l'est pas.","Ex. 2 et 3 (9 points)"],
  ["MODÉLISER","J'utilise la réciproque du théorème de Pythagore pour résoudre un problème.","Ex. 4 et 5 (8 points)"]
],
exos:[
{t:"Des carrés", p:3, h:`<p><b>a)</b> Calcule le périmètre et l'aire d'un carré de 7 cm de côté.</p><p><b>b)</b> L'aire d'un carré vaut 81 cm². Quelle est la longueur de son côté ?</p><p><b>c)</b> Le périmètre d'un carré vaut 26 cm. Quelle est la longueur de son côté ?</p>`,
 c:`<p><b>a)</b> Périmètre : 4 × 7 = 28 cm · Aire : 7 × 7 = 49 cm² <i>(1 point)</i></p><p><b>b)</b> 9 × 9 = 81, donc le côté mesure 9 cm. <i>(1 point)</i></p><p><b>c)</b> 26 ÷ 4 = 6,5 cm. <i>(1 point)</i></p>`},
{t:"Avec les aires des carrés", p:3, h:`<p>On a construit des carrés sur les côtés de deux triangles. Chaque triangle est-il rectangle ? Justifie.</p><div class="figs">${fig("a) Le triangle RST",sqFig(5.5,6.8,Math.sqrt(76.49),{areas:["30,25 cm²","46,24 cm²","76,49 cm²"],names:{A:"T",B:"R",C:"S"},w:300,alt:"Triangle RST : carrés de 30,25 cm², 46,24 cm² et 76,49 cm²"}))}${fig("b) Le triangle KLM",sqFig(4.5,6,7.6,{areas:["20,25 cm²","36 cm²","57,76 cm²"],names:{A:"L",B:"K",C:"M"},w:300,alt:"Triangle KLM : carrés de 20,25 cm², 36 cm² et 57,76 cm²"}))}</div>`,
 c:`<p><b>a)</b> 30,25 + 46,24 = 76,49 : l'aire du grand carré est égale à la somme des aires des deux petits. Le triangle RST est rectangle en S. <i>(1,5 point)</i></p><p><b>b)</b> 20,25 + 36 = 56,25 et 56,25 ≠ 57,76 : le triangle KLM n'est pas rectangle. <i>(1,5 point)</i></p>`},
{t:"Rectangle ou pas ?", p:6, h:`<p>Les triangles suivants sont-ils rectangles ? Justifie en rédigeant.</p><p><b>a)</b> Le triangle GHI tel que GH = 9 cm, HI = 12 cm et GI = 15 cm.</p><p><b>b)</b> Le triangle NOP tel que NO = 7 cm, OP = 9 cm et NP = 11,4 cm.</p><p><b>c)</b> Le triangle UVW tel que UV = 2,8 cm, VW = 4,5 cm et UW = 5,3 cm.</p>`,
 c:`<p><b>a)</b></p>${redac("GHI",{GI:15,GH:9,HI:12}).h}<p><i>(2 points)</i></p><p><b>b)</b></p>${redac("NOP",{NP:11.4,NO:7,OP:9}).h}<p>Attention : 129,96 est très proche de 130, mais ce n'est pas égal. <i>(2 points)</i></p><p><b>c)</b></p>${redac("UVW",{UW:5.3,UV:2.8,VW:4.5}).h}<p><i>(2 points)</i></p>`},
{t:"Le cadre de fenêtre", p:4, h:`<p>Un menuisier fabrique un cadre de fenêtre. Il mesure : largeur 80 cm, hauteur 1,5 m et diagonale 1,7 m.</p><p>Le cadre a-t-il bien un angle droit ? Justifie.</p>`,
 c:`<p>Même unité : 80 cm = 0,8 m. <i>(1 point)</i></p><p>Le plus grand côté du triangle formé par la largeur, la hauteur et la diagonale est la diagonale.</p><p class="calc">D'une part : 1,7² = 2,89<br>D'autre part : 0,8² + 1,5² = 0,64 + 2,25 = 2,89</p><p><i>(2 points)</i></p><p>L'égalité de Pythagore est vérifiée : d'après la réciproque du théorème de Pythagore, le triangle est rectangle. Le cadre a bien un angle droit. <i>(1 point)</i></p>`},
{t:"Le piquet", p:4, h:`<p>Paul plante un piquet dans un sol horizontal. Pour vérifier qu'il est vertical, il tend une corde de 2,1 m entre un point du piquet situé à 1,6 m du sol et un point du sol situé à 1,2 m du pied du piquet.</p><p>Le piquet est-il vertical ? Justifie.</p>`,
 c:`<p>Le piquet est vertical s'il est perpendiculaire au sol, c'est-à-dire si le triangle formé par le piquet, le sol et la corde est rectangle. <i>(1 point)</i></p><p>Le plus grand côté est la corde : 2,1 m.</p><p class="calc">D'une part : 2,1² = 4,41<br>D'autre part : 1,6² + 1,2² = 2,56 + 1,44 = 4</p><p><i>(2 points)</i></p><p>4,41 ≠ 4 : l'égalité de Pythagore n'est pas vérifiée. Le triangle n'est pas rectangle : le piquet n'est pas vertical. <i>(1 point)</i></p>`}
]}
};
})();
