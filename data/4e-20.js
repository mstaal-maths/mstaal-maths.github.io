/* 4e — Chapitre 20 : Le théorème de Pythagore (cours E1 « Le théorème de Pythagore », cours A7 « La racine carrée »,
   feuille d'exercices et feuille de corrections de M. Staal). Images : documents Word (img/4k20co, 4k20ex, 4k20cr).
   Les triangles du QCM, de l'entraînement et de l'évaluation sont dessinés en SVG à partir des longueurs. */
(function(){
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const co=(p,alt,w)=>img("4k20co/"+p+".png",alt,w), ex=(p,alt,w)=>img("4k20ex/"+p+".png",alt,w), cr=(p,alt,w)=>img("4k20cr/"+p+".png",alt,w);
const fig=(cap,body)=>{ const m=/^<img[^>]*width:(\d+)px/.exec(body); return `<figure${m?` style="max-width:${Math.max(+m[1],150)}px"`:""}>${body}${cap?`<figcaption>${cap}</figcaption>`:""}</figure>`; };
const r4=x=>Math.round(x*10000)/10000;
const F=x=>{ const r=r4(x); const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const sq=x=>r4(x*x);
/* racine carrée : √ avec la barre au-dessus du nombre */
const rac=x=>`<span style="white-space:nowrap">√<span style="border-top:1.5px solid currentColor;padding:0 .12em">${x}</span></span>`;
const rnd=(x,d)=>Math.round(x*10**d)/10**d;
const padR=(v,d,u)=>{ const z=v.toFixed(d).replace(".",","); return z===F(v)?[]:[z,z+" "+u]; }; /* « 15,0 » accepté pour un arrondi au dixième */

/* ------------------------------------------------------------------
   Triangle rectangle : angle droit en R, côtés de l'angle droit p (horizontal) et q (vertical)
   names {R,X,Y} · labels {RX, RY, XY} (texte ou « ? ») · flip : miroir horizontal
------------------------------------------------------------------ */
function rtri(p,q,names,labels={},o={}){
  const s=o.flip?-1:1, P={R:[0,0],X:[s*p,0],Y:[0,q]}, rot=o.rot||0, c=Math.cos(rot*Math.PI/180), sn=Math.sin(rot*Math.PI/180);
  Object.keys(P).forEach(n=>{ const [x,y]=P[n]; P[n]=[x*c-y*sn, x*sn+y*c]; });
  const xs=Object.values(P).map(v=>v[0]), ys=Object.values(P).map(v=>v[1]), mx=Math.min(...xs), Mx=Math.max(...xs), my=Math.min(...ys), My=Math.max(...ys);
  const k=o.k||Math.min(230/(Mx-mx), 160/(My-my)), pad=66, X=v=>pad+(v-mx)*k, Y=v=>pad+(My-v)*k, f=v=>v.toFixed(1);
  const W=Math.round((Mx-mx)*k+2*pad), H=Math.round((My-my)*k+2*pad), G=[(P.R[0]+P.X[0]+P.Y[0])/3,(P.R[1]+P.X[1]+P.Y[1])/3];
  let s2=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${Math.min(o.w||260,W)}" role="img" aria-label="${o.alt||`Triangle ${names.R}${names.X}${names.Y} rectangle en ${names.R}`}">`;
  s2+=`<polygon points="${["R","X","Y"].map(n=>f(X(P[n][0]))+","+f(Y(P[n][1]))).join(" ")}" style="fill:none;stroke:var(--ink);stroke-width:2.2;stroke-linejoin:round"/>`;
  const u=n=>{ const d=[P[n][0]-P.R[0],P[n][1]-P.R[1]], L=Math.hypot(...d); return [d[0]/L,d[1]/L]; }, z=12/k, a=u("X"), b=u("Y");
  const q1=[P.R[0]+a[0]*z,P.R[1]+a[1]*z], q2=[q1[0]+b[0]*z,q1[1]+b[1]*z], q3=[P.R[0]+b[0]*z,P.R[1]+b[1]*z];
  s2+=`<path d="M${f(X(q1[0]))} ${f(Y(q1[1]))} L${f(X(q2[0]))} ${f(Y(q2[1]))} L${f(X(q3[0]))} ${f(Y(q3[1]))}" style="fill:none;stroke:#d0342c;stroke-width:1.8"/>`;
  ["R","X","Y"].forEach(n=>{ let d=[P[n][0]-G[0],P[n][1]-G[1]]; const L=Math.hypot(...d)||1; d=[d[0]/L,d[1]/L]; s2+=`<text x="${f(X(P[n][0])+d[0]*17)}" y="${f(Y(P[n][1])-d[1]*17+6)}" text-anchor="middle" style="font-weight:700;font-size:17px;fill:var(--ink)">${names[n]}</text>`; });
  /* longueur écrite à côté du milieu du côté, vers l'extérieur du triangle (perpendiculaire au côté) */
  [["R","X","RX","Y"],["R","Y","RY","X"],["X","Y","XY","R"]].forEach(([m,n,key,o3])=>{ const t=labels[key]; if(!t) return;
    const A=[X(P[m][0]),Y(P[m][1])], B=[X(P[n][0]),Y(P[n][1])], C=[X(P[o3][0]),Y(P[o3][1])], M=[(A[0]+B[0])/2,(A[1]+B[1])/2];
    let nv=[-(B[1]-A[1]), B[0]-A[0]]; const L=Math.hypot(...nv)||1; nv=[nv[0]/L,nv[1]/L]; if(nv[0]*(C[0]-M[0])+nv[1]*(C[1]-M[1])>0) nv=[-nv[0],-nv[1]];
    const sl=Math.hypot(B[0]-A[0],B[1]-A[1]), off=sl<String(t).length*8+34?24:9; /* côté court : on écarte la longueur des noms des sommets */
    const anc=nv[0]>0.45?"start":nv[0]<-0.45?"end":"middle", tx=M[0]+nv[0]*off, ty=M[1]+nv[1]*off+(nv[1]>0.45?13:nv[1]<-0.45?-3:5);
    s2+=`<text x="${f(tx)}" y="${f(ty)}" text-anchor="${anc}" style="font-size:15px;font-weight:600;fill:${t==="?"?"#d0342c":"var(--ink)"}">${t}</text>`; });
  return s2+"</svg>";
}

/* ------------------------------------------------------------------
   Rédaction courte (paragraphe 3 du cours)
   nom "PIN", r "I" (angle droit), L {PI:4.8, IN:6.4} les deux longueurs connues, find "PN", unité, d (arrondi : décimales) ou null
------------------------------------------------------------------ */
const side=(a,b,nom)=>{ const s=[a,b].sort((x,y)=>nom.indexOf(x)-nom.indexOf(y)); return s.join(""); };
const fmtSide=(s,L)=>Object.keys(L).find(k=>k===s||k===s[1]+s[0]);
function pyth(nom, r, L, find, u="cm", d=null){
  const others=[...nom].filter(c=>c!==r), hyp=side(others[0],others[1],nom);
  const kn=Object.keys(L), isH=kn.every(k=>k.includes(r)), legs=isH?kn:[...kn.filter(k=>k.includes(r)), find];
  const H=isH?find:kn.find(k=>!k.includes(r));
  const eq=`${legs[0]}² + ${legs[1]}² = ${H}²`;
  let h=`<p>${nom} est un triangle rectangle en ${r}.</p><p>Donc, d'après le théorème de Pythagore, on sait que :</p><p class="calc"><b>${eq}</b></p>`, v2;
  if(isH){ const a=sq(L[legs[0]]), b=sq(L[legs[1]]); v2=r4(a+b);
    h+=`<p class="calc">${legs[0]}² = ${F(L[legs[0]])} × ${F(L[legs[0]])} = ${F(a)} et ${legs[1]}² = ${F(L[legs[1]])} × ${F(L[legs[1]])} = ${F(b)}</p><p class="calc">Donc ${find}² = ${F(a)} + ${F(b)} = ${F(v2)}</p>`; }
  else { const known=legs[0], a=sq(L[known]), c=sq(L[H]); v2=r4(c-a);
    h+=`<p class="calc">${known}² = ${F(L[known])} × ${F(L[known])} = ${F(a)} et ${H}² = ${F(L[H])} × ${F(L[H])} = ${F(c)}</p><p class="calc">Donc ${find}² + ${F(a)} = ${F(c)}</p><p class="calc">Donc ${find}² = ${F(c)} − ${F(a)} = ${F(v2)}</p>`; }
  const root=Math.sqrt(v2), exact=Math.abs(rnd(root,2)-root)<1e-9, val=exact?rnd(root,2):rnd(root,d??1);
  h+=`<p>Pour trouver la longueur ${find}, il faut trouver le nombre tel que … × … = ${F(v2)}.</p>`;
  if(exact&&Number.isInteger(root)) h+=`<p>On sait que : ${F(root)} × ${F(root)} = ${F(v2)}.</p><p>La longueur ${find} est donc égale à <b>${F(root)} ${u}</b>.</p>`;
  else if(exact) h+=`<p>Ce nombre est ${rac(F(v2))} = ${F(val)} (valeur exacte).</p><p>Donc <b>${find} = ${F(val)} ${u}</b>.</p>`;
  else h+=`<p>Ce nombre est ${rac(F(v2))} ≈ ${F(val)}.</p><p>Donc <b>${find} ≈ ${F(val)} ${u}</b>.</p>`;
  return {h, v2, val, exact, eq};
}
window.P420={rtri, pyth, rac, F, sq, r4, rnd};

/* ===================== schémas ===================== */
const S_RAC=sch("La racine carrée", `<p class="calc">${rac("25")} = 5 car 5 × 5 = 25</p><p class="schN">${rac("b")} est le nombre positif qui, multiplié par lui-même, donne b. Si c'est un nombre entier, b est un <b>carré parfait</b>.</p><p class="calc">${rac("18")} ≈ 4,24 (à la calculatrice)</p>`);
const S_TH=sch("Le théorème de Pythagore", `${rtri(4,3,{R:"A",X:"B",Y:"C"},{RX:"",RY:"",XY:""},{w:180})}<p class="calc">ABC rectangle en A : AB² + AC² = BC²</p><p class="schN">L'hypoténuse [BC] est le côté opposé à l'angle droit : c'est le plus grand côté.</p>`);
const S_HYP=sch("Calculer l'hypoténuse", `<p class="calc">PI² + IN² = PN²<br>4,8² + 6,4² = 23,04 + 40,96 = 64<br>PN = ${rac("64")} = 8 cm</p><p class="schN">On <b>additionne</b> les carrés des côtés de l'angle droit.</p>`);
const S_COTE=sch("Calculer un côté de l'angle droit", `<p class="calc">RA² + AT² = RT²<br>RA² + 20,25 = 56,25<br>RA² = 56,25 − 20,25 = 36<br>RA = ${rac("36")} = 6 cm</p><p class="schN">On <b>soustrait</b> : carré de l'hypoténuse moins carré du côté connu.</p>`);
const S_PB=sch("Résoudre un problème", `<p class="schN">1. Je repère le triangle rectangle et l'angle droit.</p><p class="schN">2. J'écris l'égalité de Pythagore.</p><p class="schN">3. Je calcule, puis je prends la racine carrée (arrondie si besoin).</p><p class="schN">4. Je réponds à la question avec l'unité.</p>`);

/* ---------- générateurs ---------- */
const TRIP=[[3,4,5],[6,8,10],[5,12,13],[8,15,17],[9,12,15],[20,21,29],[12,16,20],[15,20,25],[28,45,53],[33,56,65],[48,55,73]];
const NOMS=["ABC","DEF","IJK","MNP","RST","UVW","EFG","KLM","GHI","PIN","RAT","LIN","TER","XYZ"];
/* un triangle rectangle : [p, q, h] et le nom des sommets (angle droit au milieu du nom tiré au sort) */
function trGen(exact){
  for(let g=0;g<300;g++){ let p,q;
    if(exact){ const [a,b]=pick(TRIP), k=pick([0.1,0.2,0.3,0.4,0.5,1,2]); [p,q]=shuf([r4(a*k),r4(b*k)]); }
    else { p=ri(2,15)+pick([0,0,0.5]); q=ri(2,15)+pick([0,0,0.5]); }
    const h=Math.sqrt(p*p+q*q); if(!exact&&Math.abs(h-Math.round(h*100)/100)<1e-9) continue; if(Math.max(p,q,h)>80) continue;
    const n=pick(NOMS).split(""), r=n[ri(0,2)], [x,y]=n.filter(c=>c!==r);
    return {p,q,h,nom:n.join(""),r,x,y}; }
}
const sd=(a,b,nom)=>side(a,b,nom);

CH["4e-20"] = {
intro:"Dans un triangle rectangle, la somme des carrés des côtés de l'angle droit est égale au carré de l'hypoténuse : on s'en sert pour calculer une longueur, avec la racine carrée.",
savoir:[
  "connaître et écrire l'égalité de Pythagore dans un triangle rectangle ;",
  "calculer la longueur de l'hypoténuse ;",
  "calculer la longueur d'un côté de l'angle droit ;",
  "connaître les carrés parfaits et utiliser la racine carrée (valeur exacte ou valeur approchée) ;",
  "résoudre un problème avec le théorème de Pythagore."
],

/* ===================== COURS ===================== */
cours:[
{k:"1", t:"Énoncé du théorème de Pythagore", h:`
  <div class="retenir" data-l="Théorème de Pythagore · propriété 1"><p><b>Si</b> le triangle <b>est rectangle en A</b>, <b>alors</b> la somme des aires des deux petits carrés <b>est égale</b> à l'aire du grand carré.</p><p>Autrement dit : <b>si</b> le triangle ABC est rectangle en A, <b>alors</b> AC² + AB² = BC².</p></div>
  <div class="figs">${fig("ABC est rectangle en A",co("tri1","Triangle ABC rectangle en A",130))}${fig("Les carrés construits sur les côtés",co("carres1","Les trois carrés construits sur les côtés",260))}</div>
  <div class="retenir" data-l="Théorème de Pythagore · propriété 2"><p><b>Si</b> le triangle <b>n'est pas rectangle</b>, <b>alors</b> la somme des aires des deux petits carrés <b>n'est pas égale</b> à l'aire du grand carré.</p><p>Autrement dit : <b>si</b> le triangle ABC n'est pas rectangle, <b>alors</b> AC² + AB² ≠ BC².</p></div>
  <div class="figs">${fig("ABC n'est pas rectangle",co("tri2","Triangle ABC non rectangle",130))}${fig("Les carrés construits sur les côtés",co("carres2","Les trois carrés construits sur les côtés",200))}</div>
  <div class="attention"><b>Rappel :</b> l'hypoténuse est le côté opposé à l'angle droit. C'est le plus grand côté du triangle rectangle.</div>`},
{k:"2", t:"Rédaction d'un exercice", h:`
  <p>Ce théorème nous permet de calculer la longueur d'un côté du triangle rectangle.</p>
  <h4>a) Calcul de la longueur de l'hypoténuse</h4>
  <p><b>Exercice 1 :</b> calcule la longueur du côté manquant.</p>${co("pin","Triangle PIN rectangle en I : PI = 4,8 cm, IN = 6,4 cm, PN = ?",280)}
  <p>PIN est un triangle rectangle en I.</p><p>Donc, d'après le théorème de Pythagore, on sait que la somme de l'aire du petit carré et de l'aire du moyen carré est égale à l'aire du grand carré.</p>
  <p class="calc">4,8 × 4,8 = 23,04</p><p>L'aire du petit carré est égale à 23,04 cm².</p>
  <p class="calc">6,4 × 6,4 = 40,96</p><p>L'aire du moyen carré est égale à 40,96 cm².</p>
  <p class="calc">23,04 + 40,96 = 64</p><p>L'aire du grand carré est donc égale à 64 cm².</p>
  <p>Pour trouver la longueur PN, il faut trouver le nombre tel que 8 × 8 = 64.</p><p>La longueur PN est donc égale à <b>8 cm</b>.</p>
  <h4>b) Calcul de la longueur d'un côté de l'angle droit</h4>
  <p><b>Exercice 2 :</b> calcule la longueur du côté manquant.</p><div class="figs">${co("rat","Triangle RAT rectangle en A : AT = 4,5 cm, RT = 7,5 cm",260)}${co("ratc","Les carrés du triangle RAT : petit carré 20,25 cm², grand carré 56,25 cm², moyen carré ?",200)}</div>
  <p>RAT est un triangle rectangle en A.</p><p>Donc, d'après le théorème de Pythagore, on sait que la somme de l'aire du petit carré et de l'aire du moyen carré est égale à l'aire du grand carré.</p>
  <p class="calc">4,5 × 4,5 = 20,25</p><p><b>L'aire du petit carré</b> est égale à 20,25 cm².</p>
  <p class="calc">7,5 × 7,5 = 56,25</p><p><b>L'aire du grand carré</b> est égale à 56,25 cm².</p>
  <div class="attention"><b>Attention :</b> on a donc 20,25 + 36 = 56,25. Pour trouver l'aire du moyen carré, on doit faire une soustraction.</div>
  <p class="calc">56,25 − 20,25 = 36</p><p><b>L'aire du moyen carré</b> est donc égale à 36 cm².</p>
  <p>Pour trouver la longueur RA, il faut trouver le nombre tel que 6 × 6 = 36.</p><p>La longueur RA est donc égale à <b>6 cm</b>.</p>`},
{k:"3", t:"Rédaction plus courte d'un exercice", h:`
  <h4>a) Calcul de la longueur de l'hypoténuse</h4>
  <div class="retenir" data-l="Méthode"><p>PIN est un triangle rectangle en I.</p><p>Donc, d'après le théorème de Pythagore, on sait que : <b>PI² + IN² = PN²</b></p><p>PI² = 4,8 × 4,8 = 23,04 et IN² = 6,4 × 6,4 = 40,96</p><p>Donc PN² = 23,04 + 40,96 = 64</p><p>Pour trouver la longueur PN, il faut trouver le nombre tel que 8 × 8 = 64.</p><p>La longueur PN est donc égale à 8 cm.</p></div>
  <h4>b) Calcul de la longueur d'un côté de l'angle droit</h4>
  <div class="retenir" data-l="Méthode"><p>RAT est un triangle rectangle en A.</p><p>Donc, d'après le théorème de Pythagore, on sait que : <b>RA² + AT² = RT²</b></p><p>AT² = 4,5 × 4,5 = 20,25 et RT² = 7,5 × 7,5 = 56,25</p><p>Donc RA² + 20,25 = 56,25</p><p>Donc RA² = 56,25 − 20,25 = 36</p><p>Pour trouver la longueur RA, il faut trouver le nombre tel que 6 × 6 = 36.</p><p>La longueur RA est donc égale à 6 cm.</p></div>`},
{k:"4", t:"La racine carrée", h:`
  <div class="retenir" data-l="Définition"><p>Soit <i>b</i> un nombre positif. La « <b>racine carrée de <i>b</i></b> », que l'on note ${rac("<i>b</i>")}, est le nombre positif qui vérifie ${rac("<i>b</i>")} × ${rac("<i>b</i>")} = <i>b</i>.</p></div>
  <p><b>Sur la calculatrice :</b> touche SECONDE, puis la touche x² (au-dessus de laquelle est écrit √).</p>
  <p><b>Exemples :</b></p>
  <ul><li>La « racine carrée de 25 », que l'on note ${rac("25")}, est le nombre positif qui vérifie ${rac("25")} × ${rac("25")} = 25. ${rac("25")} a une valeur exacte : ${rac("25")} = 5 car 5 × 5 = 25.</li></ul>
  <p>Comme ${rac("25")} est égale à un nombre entier, on dit que <b>25 est un carré parfait</b>.</p>
  <ul><li>La « racine carrée de 18 », que l'on note ${rac("18")}, est le nombre positif qui vérifie ${rac("18")} × ${rac("18")} = 18. ${rac("18")} n'a pas de valeur exacte. À la calculatrice, on trouve que ${rac("18")} ≈ 4,24.</li></ul>
  <p>18 n'est donc pas un carré parfait.</p>
  <div class="retenir" data-l="À retenir"><p><b>Carrés parfaits à connaître :</b></p>
  <p>${rac("1")} = 1 car 1 × 1 = 1 ; ${rac("4")} = 2 car 2 × 2 = 4 ; ${rac("9")} = 3 car 3 × 3 = 9.</p><p>De la même façon, on trouve les autres carrés parfaits :</p>
  <div class="scroll"><table class="std"><tbody><tr><th>Nombre</th>${[1,4,9,16,25,36,49,64,81,100,121,144].map(n=>`<td>${n}</td>`).join("")}</tr><tr><th>Racine carrée</th>${[1,2,3,4,5,6,7,8,9,10,11,12].map(n=>`<td>${n}</td>`).join("")}</tr></tbody></table></div></p></div>`},
{k:"5", t:"Problèmes faisant intervenir la racine carrée", h:`
  <p><b>Exercice 1 :</b> le cadre de ce BMX est un triangle ABC rectangle en B avec AB = 50 cm et BC = 20 cm.</p><p>Calcule la longueur du tube inférieur [AC], en cm. Donne une valeur approchée au dixième près.</p>${co("bmx","Le cadre du BMX : triangle ABC rectangle en B",230)}
  ${pyth("ABC","B",{BA:50,BC:20},"AC","cm",1).h.replace("BA² + BC² = AC²","BA² + BC² = AC²")}
  <p>Le tube inférieur [AC] du cadre du BMX mesure environ 53,9 cm.</p>
  <p><b>Exercice 2 :</b> cet escabeau de piste permet d'atteindre la porte de l'avion, qui se trouve à 4,8 m de hauteur. Pour y monter, chaque passager doit parcourir 5,2 m.</p><p>Pour sécuriser la montée des passagers, le personnel de l'aéroport a besoin de connaître la longueur nécessaire au sol pour placer l'escabeau. Aide-le à la calculer.</p>
  <div class="figs">${co("esc","L'escabeau de piste et la porte de l'avion",260)}${co("escd","Le triangle ECS rectangle en S : CE = 5,2 m, CS = 4,8 m",180)}</div>
  ${pyth("ECS","S",{CS:4.8,CE:5.2},"ES","m").h}
  <p>On a besoin de 2 m au sol pour placer l'escabeau.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Découvrir le théorème de Pythagore", e:[
  {n:"Activité 1", t:"L'armoire de Julia", w:"Sur ton cahier", h:`<p>Julia monte une armoire qu'elle veut placer sur sa mezzanine, qui a une hauteur de plafond de 1,60 m.</p>${ex("a1","Julia monte l'armoire à plat ; notice : 144 cm de haut et 60 cm de profondeur",420)}<p>Elle commence à monter l'armoire sur le sol, à plat. Une fois construite, Julia va-t-elle avoir un problème pour relever son armoire ? Explique.</p>`,
   c:`<div class="figs">${cr("a1tri","Le triangle ABC rectangle en C : AC = 144 cm, CB = 60 cm, AB = ?",90)}${cr("a1carres","Les carrés construits sur les côtés",250)}</div>
   <p>Pour savoir si Julia va pouvoir relever son armoire, il faut connaître la longueur <b>AB</b> (la diagonale de l'armoire).</p><ul><li>Si AB mesure moins de 1,60 m, alors Julia pourra relever son armoire.</li><li>Si AB mesure plus de 1,60 m, alors Julia ne pourra pas la relever.</li></ul>
   <p>ABC est un triangle rectangle en C, avec AC = 144 cm et CB = 60 cm.</p><p>Donc, d'après le théorème de Pythagore, la somme de l'aire du petit carré et de l'aire du moyen carré est égale à l'aire du grand carré.</p>
   <p class="calc">60 × 60 = 3 600 : l'aire du petit carré est 3 600 cm².<br>144 × 144 = 20 736 : l'aire du moyen carré est 20 736 cm².<br>20 736 + 3 600 = 24 336 : l'aire du grand carré est 24 336 cm².</p>
   <p>On cherche le nombre tel que … × … = 24 336. Après plusieurs essais à la calculatrice : 156 × 156 = 24 336.</p><p>La longueur AB est donc égale à 156 cm.</p>
   <p>156 cm est plus petit que 1,60 m (160 cm) : <b>Julia arrivera à relever son armoire.</b></p>`},
  {n:"Exercice 1", t:"Aires et longueurs", w:"Sur ta feuille", h:`<p>Dans chacun des cas, complète les pointillés (aires et longueurs). Tu n'es pas obligé d'écrire tes calculs.</p>${ex("e1","Trois triangles rectangles avec les carrés construits sur leurs côtés",620)}`,
   c:`${cr("e1","Les trois cas complétés",620)}
   <p><b>Cas n°1 :</b> aire du moyen carré : 4 × 4 = 16 cm². Aire du grand carré : 16 + 9 = 25 cm². On cherche … × … = 25 : 5 × 5 = 25, donc RT = <b>5 cm</b>.</p>
   <p><b>Cas n°2 :</b> aire du petit carré : 6 × 6 = 36 cm². Aire du moyen carré : 8 × 8 = 64 cm². Aire du grand carré : 36 + 64 = 100 cm². 10 × 10 = 100, donc ZI = <b>10 cm</b>.</p>
   <p><b>Cas n°3 :</b> aire du petit carré : 5 × 5 = 25 cm². Aire du <b>grand</b> carré : 13 × 13 = 169 cm². Aire du moyen carré : 25 + … = 169, donc 169 − 25 = 144 cm². 12 × 12 = 144, donc NI = <b>12 cm</b>.</p>`}
 ]},
{t:"Calculer une longueur", e:[
  {n:"Exercice 2", t:"Le côté manquant", w:"Sur ton cahier", h:`<p>Dans chacun de ces triangles, calcule la longueur du côté manquant.</p><p>Cette fois, tu rédigeras tes réponses comme indiqué dans le cours.</p>
   <div class="figs">${fig("a.",ex("e2a","Triangle MJX rectangle en M : MJ = 4,2 ; MX = 5,6 ; JX = ?",220))}${fig("b.",ex("e2b","Triangle PIF rectangle en I : IF = 4,2 cm ; PF = 5,8 cm",280))}</div>
   <p><b>c.</b> LIN est un triangle rectangle en L tel que IL = 2,8 cm et LN = 9,6 cm.</p><p><b>d.</b> TER est un triangle rectangle en R tel que ER = 4,8 cm et TE = 5,2 cm.</p>`,
   c:`<p><b>a.</b></p>${pyth("MJX","M",{MJ:4.2,MX:5.6},"JX").h}<p><b>b.</b></p>${pyth("PIF","I",{IF:4.2,PF:5.8},"PI").h.replace("Donc PI² + 17,64","Donc PI² + 17,64")}
   <p><b>c.</b></p><div class="figs">${cr("e2c","Triangle LIN rectangle en L",220)}</div>${pyth("LIN","L",{IL:2.8,LN:9.6},"NI").h}
   <p><b>d.</b></p><div class="figs">${cr("e2d","Triangle TER rectangle en R",200)}</div>${pyth("TER","R",{ER:4.8,TE:5.2},"TR").h}`}
 ]},
{t:"Problèmes", e:[
  {n:"Exercice 3", t:"L'échelle n°1", w:"Sur ton cahier", h:`${ex("echelle","Une échelle [HB] posée contre un mur [HC]",100)}<p>Combien mesure l'échelle n°1, sachant que le bas de l'échelle est situé à 1,4 m du mur et que le haut de l'échelle permet d'atteindre 4,8 m de hauteur ?</p>`,
   c:`${cr("e3","Le triangle HBC rectangle en C : BC = 1,4 m, HC = 4,8 m",130)}${pyth("HBC","C",{BC:1.4,HC:4.8},"HB","m").h}<p>L'échelle mesure donc 5 m.</p>`},
  {n:"Activité 2", t:"L'échelle n°2", w:"Sur ton cahier", h:`${ex("echelle","Une échelle [HB] posée contre un mur [HC]",100)}<p>Combien mesure l'échelle n°2, sachant que le bas de l'échelle est situé à 2 m du mur et que le haut de l'échelle permet d'atteindre 4 m de hauteur ?</p>`,
   c:`${cr("a2","Le triangle HBC rectangle en C : BC = 2 m, HC = 4 m",120)}<p>HBC est un triangle rectangle en C.</p><p>Donc, d'après le théorème de Pythagore, on sait que : <b>BC² + HC² = HB²</b></p><p class="calc">BC² = 2 × 2 = 4 et HC² = 4 × 4 = 16<br>Donc HB² = 4 + 16 = 20</p>
   <p>Pour trouver la longueur HB, il faut trouver le nombre tel que … × … = 20. Avec la calculatrice, je fais plusieurs essais (je tâtonne) :</p>
   <p class="calc">5 × 5 = 25 (je prends un nombre plus petit que 5)<br>4,5 × 4,5 = 20,25 (plus petit que 4,5)<br>4,4 × 4,4 = 19,36 (plus grand que 4,4)<br>4,45 × 4,45 = 19,802 5 (plus grand que 4,45)<br>4,47 × 4,47 = 19,980 9 (plus grand que 4,47)<br>4,48 × 4,48 = 20,070 4 (plus petit que 4,48)<br>4,475 × 4,475 = 20,025 625 (plus petit que 4,475)…</p>
   <p>Cela peut durer très longtemps… On ne trouve pas de nombre tel que … × … = 20 exactement.</p><p>Mais ce nombre existe bien ! C'est ${rac("20")}, qui se lit « racine de 20 » : ${rac("20")} × ${rac("20")} = 20.</p>
   <p>Donc HB = ${rac("20")}. À la calculatrice, on trouve ${rac("20")} ≈ 4,472 135 955… On dira que HB ≈ 4,47.</p><p><b>L'échelle mesure environ 4,47 m.</b></p>`},
  {n:"Exercice 4", t:"Échauffement de foot", w:"Sur ton cahier", h:`<p>Le terrain de football du village de Romain est un rectangle de dimensions 110 m sur 80 m.</p><p>Pour s'échauffer, l'entraîneur de Romain demande aux joueurs de faire un sprint sur la diagonale du terrain.</p><p>Quelle distance les joueurs parcourent-ils ? <i>Donne un arrondi à l'unité près.</i></p>`,
   c:`${cr("e4","Le terrain FOUT : FO = 110 m, OU = 80 m, diagonale [FU]",300)}${pyth("FOU","O",{FO:110,OU:80},"FU","m",0).h}<p>Les joueurs parcourent environ <b>136 m</b> pour faire leur sprint.</p>`},
  {n:"Exercice 5", t:"Rampe d'accès", w:"Sur ton cahier", h:`${ex("rampe","Pictogramme d'une rampe d'accès",120)}<p>Une rampe d'accès pour les personnes à mobilité réduite mesure 2,50 m de long et la porte d'accès est à une hauteur de 0,80 m.</p><p>De quelle longueur au sol doit-on disposer pour pouvoir poser cette rampe ? <i>Donne un arrondi au centième près.</i></p>`,
   c:`${cr("e5","Le triangle RAM rectangle en M : RA = 2,50 m, AM = 0,80 m",160)}${pyth("RAM","M",{AM:0.8,RA:2.5},"RM","m",2).h}<p>Pour poser la rampe, on aura besoin d'environ <b>2,37 m</b> au sol.</p>`},
  {n:"Exercice 6", t:"Le théorème de Pythagore dans l'architecture", w:"Sur ton cahier", h:`${ex("maison","Schéma de la maison : hauteur 450 cm au faîte, 300 cm au mur, largeur 700 cm, longueur 1 000 cm",340)}<p>Voici le schéma d'une maison de plain-pied. L'architecte souhaite connaître les dimensions de la toiture de cette maison, qui n'existe que sur papier.</p><p>Comment peut-il faire ? À toi de l'aider.</p>`,
   c:`${cr("e6","Le triangle TOI rectangle en O sous le toit",300)}<p>On connaît déjà une mesure du toit : la longueur IU, qui mesure 1 000 cm, soit 10 m.</p><p>Il faut maintenant connaître la longueur IT. Pour cela, on utilise le théorème de Pythagore dans le triangle TOI rectangle en O. Il faut d'abord connaître TO et OI.</p>
   <p class="calc">450 − 300 = 150 : la longueur TO est égale à 150 cm.<br>700 ÷ 2 = 350 : la longueur OI est égale à 350 cm.</p>${pyth("TOI","O",{TO:150,OI:350},"TI","cm",0).h}<p>Les dimensions de chaque pan de la toiture sont donc d'environ <b>381 cm (soit 3,81 m) sur 10 m</b>.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"La racine carrée", schema:S_RAC, q:{
 1:[ {g:()=>{ const n=ri(1,12); return {q:`Combien vaut ${rac(n*n)} ?`, rep:[String(n)], ex:`${n} × ${n} = ${n*n}, donc ${rac(n*n)} = ${n}.`, sx:S_RAC}; }} ],
 2:[ {g:()=>{ const sqr=Math.random()<0.5, n=sqr?pick([16,25,36,49,64,81,100,121,144,169,196,225]):pick([18,20,27,32,45,50,72,90,110,130]); return {q:`${n} est-il un carré parfait ?`, c:["Oui","Non"], rep:sqr?"Oui":"Non", ex:sqr?`${Math.sqrt(n)} × ${Math.sqrt(n)} = ${n} : ${rac(n)} est un nombre entier.`:`${Math.floor(Math.sqrt(n))} × ${Math.floor(Math.sqrt(n))} = ${Math.floor(Math.sqrt(n))**2} et ${Math.ceil(Math.sqrt(n))} × ${Math.ceil(Math.sqrt(n))} = ${Math.ceil(Math.sqrt(n))**2} : ${rac(n)} n'est pas un nombre entier.`, sx:S_RAC}; }} ],
 3:[ {g:()=>{ let n; do{ n=ri(5,150); }while(Number.isInteger(Math.sqrt(n))); const v=rnd(Math.sqrt(n),1); return {q:`À la calculatrice, quelle est la valeur approchée de ${rac(n)} au dixième près ?`, c:uniq(F(v),[F(rnd(n/2,1)),F(rnd(v+0.3,1)),F(rnd(v-0.2,1))]), rep:F(v), ex:`${rac(n)} ≈ ${F(rnd(Math.sqrt(n),4))}… ≈ ${F(v)}. Vérification : ${F(v)} × ${F(v)} = ${F(sq(v))}, proche de ${n}.`, sx:S_RAC}; }},
     {g:()=>{ const a=pick([[0.64,0.8],[1.44,1.2],[12.96,3.6],[0.25,0.5],[2.25,1.5],[6.25,2.5]]); return {q:`Combien vaut ${rac(F(a[0]))} ?`, c:uniq(F(a[1]),[F(a[0]/2),F(a[1]*10),F(rnd(a[1]+0.1,1))]), rep:F(a[1]), ex:`${F(a[1])} × ${F(a[1])} = ${F(a[0])}.`, sx:S_RAC}; }} ]
}},
{nom:"L'égalité de Pythagore", schema:S_TH, q:{
 1:[ {g:()=>{ const t=trGen(true), hyp=sd(t.x,t.y,t.nom); return {q:`Le triangle ${t.nom} est rectangle en ${t.r}. Quelle est son hypoténuse ?`, c:uniq(`[${hyp}]`,[`[${sd(t.r,t.x,t.nom)}]`,`[${sd(t.r,t.y,t.nom)}]`]), rep:`[${hyp}]`, ex:`L'hypoténuse est le côté opposé à l'angle droit ${t.r}.`, sx:S_TH}; }} ],
 2:[ {g:()=>{ const t=trGen(true), a=sd(t.r,t.x,t.nom), b=sd(t.r,t.y,t.nom), h=sd(t.x,t.y,t.nom); return {q:`Le triangle ${t.nom} est rectangle en ${t.r}. Quelle égalité peut-on écrire ?`, c:uniq(`${a}² + ${b}² = ${h}²`,[`${a}² + ${h}² = ${b}²`,`${h}² + ${b}² = ${a}²`]), rep:`${a}² + ${b}² = ${h}²`, ex:`La somme des carrés des côtés de l'angle droit est égale au carré de l'hypoténuse [${h}].`, sx:S_TH}; }} ],
 3:[ {q:"Le théorème de Pythagore permet de…", c:["calculer la longueur d'un côté d'un triangle rectangle","calculer la mesure d'un angle","calculer l'aire d'un cercle"], rep:"calculer la longueur d'un côté d'un triangle rectangle", sx:S_TH},
     {g:()=>{ const t=trGen(true); return {q:`Le triangle ${t.nom} n'est pas rectangle. Peut-on utiliser le théorème de Pythagore pour calculer une longueur ?`, c:["Non","Oui"], rep:"Non", ex:"Le théorème de Pythagore ne s'utilise que dans un triangle rectangle.", sx:S_TH}; }} ]
}},
{nom:"Calculer l'hypoténuse", schema:S_HYP, q:{
 1:[ {g:()=>{ const [a,b,c]=pick(TRIP.slice(0,5)); const n=pick(NOMS).split(""), r=n[1]; return {q:`${n.join("")} est rectangle en ${r}. Les côtés de l'angle droit mesurent ${a} cm et ${b} cm. Combien mesure l'hypoténuse (en cm) ?`, fig:rtri(a,b,{R:r,X:n[0],Y:n[2]},{RX:a+" cm",RY:b+" cm",XY:"?"}), rep:[String(c),c+" cm"], ex:`${a}² + ${b}² = ${a*a} + ${b*b} = ${c*c} et ${c} × ${c} = ${c*c}.`, sx:S_HYP}; }} ],
 2:[ {g:()=>{ const t=trGen(true), h=sd(t.x,t.y,t.nom); return {q:`${t.nom} est rectangle en ${t.r} avec ${sd(t.r,t.x,t.nom)} = ${F(t.p)} cm et ${sd(t.r,t.y,t.nom)} = ${F(t.q)} cm. Calcule ${h} (en cm).`, fig:rtri(t.p,t.q,{R:t.r,X:t.x,Y:t.y},{RX:F(t.p)+" cm",RY:F(t.q)+" cm",XY:"?"}), rep:[F(t.h),F(t.h)+" cm"], ex:`${h}² = ${F(sq(t.p))} + ${F(sq(t.q))} = ${F(sq(t.p)+sq(t.q))}, donc ${h} = ${rac(F(r4(sq(t.p)+sq(t.q))))} = ${F(t.h)} cm.`, sx:S_HYP}; }} ],
 3:[ {g:()=>{ const t=trGen(false), h=sd(t.x,t.y,t.nom), v=rnd(t.h,1); return {q:`${t.nom} est rectangle en ${t.r} avec ${sd(t.r,t.x,t.nom)} = ${F(t.p)} cm et ${sd(t.r,t.y,t.nom)} = ${F(t.q)} cm. Calcule ${h}, arrondi au dixième (en cm).`, fig:rtri(t.p,t.q,{R:t.r,X:t.x,Y:t.y},{RX:F(t.p)+" cm",RY:F(t.q)+" cm",XY:"?"}), rep:[F(v),F(v)+" cm",...padR(v,1,"cm")], ex:`${h}² = ${F(sq(t.p))} + ${F(sq(t.q))} = ${F(r4(sq(t.p)+sq(t.q)))}, donc ${h} = ${rac(F(r4(sq(t.p)+sq(t.q))))} ≈ ${F(v)} cm.`, sx:S_HYP}; }} ]
}},
{nom:"Calculer un côté de l'angle droit", schema:S_COTE, q:{
 1:[ {g:()=>{ const [a,b,c]=pick(TRIP.slice(0,5)); return {q:`Dans un triangle rectangle, l'hypoténuse mesure ${c} cm et un côté de l'angle droit mesure ${a} cm. Combien mesure l'autre côté de l'angle droit (en cm) ?`, rep:[String(b),b+" cm"], ex:`${c}² − ${a}² = ${c*c} − ${a*a} = ${b*b} et ${b} × ${b} = ${b*b}.`, sx:S_COTE}; }} ],
 2:[ {g:()=>{ const t=trGen(true), h=sd(t.x,t.y,t.nom), a=sd(t.r,t.x,t.nom), b=sd(t.r,t.y,t.nom); return {q:`${t.nom} est rectangle en ${t.r} avec ${h} = ${F(t.h)} cm et ${a} = ${F(t.p)} cm. Calcule ${b} (en cm).`, fig:rtri(t.p,t.q,{R:t.r,X:t.x,Y:t.y},{RX:F(t.p)+" cm",RY:"?",XY:F(t.h)+" cm"}), rep:[F(t.q),F(t.q)+" cm"], ex:`${b}² = ${F(sq(t.h))} − ${F(sq(t.p))} = ${F(r4(sq(t.h)-sq(t.p)))}, donc ${b} = ${F(t.q)} cm.`, sx:S_COTE}; }} ],
 3:[ {g:()=>{ let t; do{ t=trGen(false); }while(!t||rnd(t.h,1)<=t.p); const H=rnd(t.h,1), h=sd(t.x,t.y,t.nom), a=sd(t.r,t.x,t.nom), b=sd(t.r,t.y,t.nom), v2=r4(sq(H)-sq(t.p)), v=rnd(Math.sqrt(v2),1); return {q:`${t.nom} est rectangle en ${t.r} avec ${h} = ${F(H)} cm et ${a} = ${F(t.p)} cm. Calcule ${b}, arrondi au dixième (en cm).`, rep:[F(v),F(v)+" cm",...padR(v,1,"cm")], ex:`${b}² = ${F(sq(H))} − ${F(sq(t.p))} = ${F(v2)}, donc ${b} = ${rac(F(v2))} ≈ ${F(v)} cm.`, sx:S_COTE}; }} ]
}},
{nom:"Résoudre un problème", schema:S_PB, q:{
 1:[ {g:()=>{ const [a,b,c]=pick([[3,4,5],[6,8,10],[1.2,1.6,2],[1.5,2,2.5],[2.4,3.2,4]]); return {q:`Le pied d'une échelle est à ${F(a)} m du mur et son sommet atteint ${F(b)} m de hauteur. Combien mesure l'échelle (en m) ?`, rep:[F(c),F(c)+" m"], ex:`${F(a)}² + ${F(b)}² = ${F(sq(a))} + ${F(sq(b))} = ${F(sq(c))}, donc l'échelle mesure ${rac(F(sq(c)))} = ${F(c)} m.`, sx:S_PB}; }} ],
 2:[ {g:()=>{ const L=ri(60,120), l=ri(40,L-10), d=Math.round(Math.sqrt(L*L+l*l)); return {q:`Un terrain rectangulaire mesure ${L} m sur ${l} m. Quelle est la longueur de sa diagonale, arrondie au mètre ?`, c:uniq(d+" m",[(L+l)+" m",Math.round(Math.sqrt(L*L-l*l))+" m",(d+3)+" m"]), rep:d+" m", ex:`${L}² + ${l}² = ${F(L*L+l*l)}, donc la diagonale mesure ${rac(F(L*L+l*l))} ≈ ${d} m.`, sx:S_PB}; }} ],
 3:[ {g:()=>{ const L=ri(20,35)/10, h=ri(4,12)/10, g2=r4(sq(L)-sq(h)), v=rnd(Math.sqrt(g2),2); return {q:`Une rampe d'accès mesure ${F(L)} m de long et la porte est à ${F(h)} m de hauteur. Quelle longueur au sol faut-il, arrondie au centième (en m) ?`, rep:[F(v),F(v)+" m",...padR(v,2,"m")], ex:`La rampe est l'hypoténuse : sol² = ${F(sq(L))} − ${F(sq(h))} = ${F(g2)}, donc sol = ${rac(F(g2))} ≈ ${F(v)} m.`, sx:S_PB}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 20", duree:50, info:"Durée : 50 min · Calculatrice autorisée · Règle",
comp:[
  ["CALCULER","Je connais les carrés parfaits et j'utilise la racine carrée.","Ex. 1 (3 points)"],
  ["CONNAÎTRE","J'écris l'égalité de Pythagore dans un triangle rectangle.","Ex. 2 (3 points)"],
  ["RAISONNER","Je calcule la longueur d'un côté d'un triangle rectangle en rédigeant.","Ex. 3 (6 points)"],
  ["MODÉLISER","J'utilise le théorème de Pythagore pour résoudre un problème.","Ex. 4 et 5 (8 points)"]
],
exos:[
{t:"Racines carrées", p:3, h:`<p><b>a)</b> Donne la valeur exacte de ${rac("49")}, ${rac("121")} et ${rac("0,64")}.</p><p><b>b)</b> 50 est-il un carré parfait ? Justifie.</p><p><b>c)</b> À la calculatrice, donne la valeur approchée de ${rac("30")} au dixième près.</p>`,
 c:`<p><b>a)</b> ${rac("49")} = 7 car 7 × 7 = 49.</p><p>${rac("121")} = 11 car 11 × 11 = 121.</p><p>${rac("0,64")} = 0,8 car 0,8 × 0,8 = 0,64. <i>(1,5 point)</i></p><p><b>b)</b> 7 × 7 = 49 et 8 × 8 = 64 : aucun nombre entier multiplié par lui-même ne donne 50. 50 n'est pas un carré parfait. <i>(1 point)</i></p><p><b>c)</b> À la calculatrice : ${rac("30")} ≈ 5,477… donc ${rac("30")} ≈ 5,5 au dixième près. <i>(0,5 point)</i></p>`},
{t:"Écrire l'égalité de Pythagore", p:3, h:`<p>Pour chaque triangle rectangle, écris l'égalité de Pythagore.</p><div class="figs">${fig("a)",rtri(3,2,{R:"L",X:"K",Y:"M"},{},{w:240,k:30}))}${fig("b)",rtri(2.5,3,{R:"V",X:"U",Y:"W"},{},{w:240,k:30,flip:true}))}${fig("c)",rtri(3.2,2.2,{R:"E",X:"F",Y:"G"},{},{w:240,k:30,rot:180}))}</div>`,
 c:`<p><b>a)</b> KLM est rectangle en L : LK² + LM² = KM². <i>(1 point)</i></p><p><b>b)</b> UVW est rectangle en V : VU² + VW² = UW². <i>(1 point)</i></p><p><b>c)</b> EFG est rectangle en E : EF² + EG² = FG². <i>(1 point)</i></p>`},
{t:"Calculer des longueurs", p:6, h:`<p>Calcule la longueur demandée en rédigeant comme dans le cours.</p><p><b>a)</b> DEF est rectangle en E, DE = 3,6 cm et EF = 4,8 cm. Calcule DF.</p><p><b>b)</b> GHI est rectangle en H, GI = 8,5 cm et GH = 4 cm. Calcule HI.</p><p><b>c)</b> RST est rectangle en S, RS = 5 cm et ST = 7 cm. Calcule RT, arrondi au dixième.</p>`,
 c:`<p><b>a)</b></p>${pyth("DEF","E",{DE:3.6,EF:4.8},"DF").h}<p><i>(2 points)</i></p><p><b>b)</b></p>${pyth("GHI","H",{GH:4,GI:8.5},"HI").h}<p><i>(2 points)</i></p><p><b>c)</b></p>${pyth("RST","S",{RS:5,ST:7},"RT","cm",1).h}<p><i>(2 points)</i></p>`},
{t:"L'écran de télévision", p:4, h:`<p>Un écran de télévision rectangulaire mesure 88 cm de large et 66 cm de haut.</p><p>Le vendeur affirme que sa diagonale mesure plus d'un mètre. A-t-il raison ? Justifie.</p>`,
 c:`<p>La largeur, la hauteur et la diagonale forment un triangle rectangle : la diagonale est l'hypoténuse. <i>(1 point)</i></p><p class="calc">diagonale² = 88² + 66² = 7 744 + 4 356 = 12 100</p><p class="calc">diagonale = ${rac("12 100")} = 110 cm (car 110 × 110 = 12 100)</p><p><i>(2 points)</i></p><p>110 cm = 1,10 m : la diagonale mesure plus d'un mètre. Le vendeur a raison. <i>(1 point)</i></p>`},
{t:"Le cerf-volant", p:4, h:`<p>Léo fait voler un cerf-volant. Le fil, bien tendu, mesure 25 m.</p><p>Le cerf-volant est exactement au-dessus d'un arbre situé à 15 m de Léo. Léo tient le fil à 1 m du sol.</p><p>À quelle hauteur du sol se trouve le cerf-volant ? Justifie.</p>`,
 c:`<p>À partir de la main de Léo, le fil (25 m), la distance horizontale (15 m) et la verticale du cerf-volant forment un triangle rectangle : le fil est l'hypoténuse. <i>(1 point)</i></p><p class="calc">hauteur² + 15² = 25²<br>hauteur² = 625 − 225 = 400<br>hauteur = ${rac("400")} = 20 m</p><p><i>(2 points)</i></p><p>Il faut ajouter 1 m (la hauteur de la main) : 20 + 1 = 21. Le cerf-volant est à 21 m du sol. <i>(1 point)</i></p>`}
]}
};
})();
