/* 3e — Chapitre 19 : Fonctions affines et linéaires
   Sources : « Cours » (Fonctions linéaires et affines) et fiche « Exercices » de M. Staal (activités 1 et 2, exercices 1 à 9),
   « Correction exo brevet » pour les exercices 8 et 9. Corrections des autres exercices calculées et rédigées pour le site.
   Toutes les droites sont dessinées en SVG à partir de leur expression exacte. */
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

const nz=(a,b)=>{ let v; do{ v=ri(a,b); }while(v===0); return v; };
const RED="#d0342c", BLUE="#1e5aa8", GRN="#1e8a4c";
function plot(o){ const [x0,x1]=o.x, [y0,y1]=o.y, u=o.u||40, v=o.v||u, ml=34, mr=30, mt=o.title?44:26, mb=30;
  const W=Math.round((x1-x0)*u+ml+mr), H=Math.round((y1-y0)*v+mt+mb), X=x=>ml+(x-x0)*u, Y=y=>mt+(y1-y)*v, f1=t=>t.toFixed(1);
  const T=(x,y,t,st="",a="middle")=>`<text x="${f1(x)}" y="${f1(y)}" text-anchor="${a}" style="font-size:14px;fill:var(--ink);${st}">${String(t).replace(/<i>/g,'<tspan style="font-style:italic">').replace(/<\/i>/g,'</tspan>').replace(/<(?!\/?tspan)[^>]*>/g,'')}</text>`;
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${Math.min(W,o.w||W)}" role="img" aria-label="${o.alt||"Courbe dans un repère"}">`;
  if(o.title) s+=T(W/2,20,o.title,"font-weight:700;font-size:15px");
  const gs=o.gs||1;
  for(let k=Math.ceil(x0/gs)*gs;k<=x1+1e-9;k+=gs) s+=`<line x1="${f1(X(k))}" y1="${f1(Y(y0))}" x2="${f1(X(k))}" y2="${f1(Y(y1))}" class="gridl"/>`;
  for(let k=Math.ceil(y0/(o.gy||gs))*(o.gy||gs);k<=y1+1e-9;k+=(o.gy||gs)) s+=`<line x1="${f1(X(x0))}" y1="${f1(Y(k))}" x2="${f1(X(x1))}" y2="${f1(Y(k))}" class="gridl"/>`;
  const ax=Math.min(Math.max(0,x0),x1), ay=Math.min(Math.max(0,y0),y1);
  s+=`<line x1="${f1(X(x0))}" y1="${f1(Y(ay))}" x2="${f1(X(x1)+14)}" y2="${f1(Y(ay))}" class="axe2"/><path d="M${f1(X(x1)+6)} ${f1(Y(ay)-5)} L${f1(X(x1)+14)} ${f1(Y(ay))} L${f1(X(x1)+6)} ${f1(Y(ay)+5)}" class="ln"/>`;
  s+=`<line x1="${f1(X(ax))}" y1="${f1(Y(y0))}" x2="${f1(X(ax))}" y2="${f1(Y(y1)-14)}" class="axe2"/><path d="M${f1(X(ax)-5)} ${f1(Y(y1)-6)} L${f1(X(ax))} ${f1(Y(y1)-14)} L${f1(X(ax)+5)} ${f1(Y(y1)-6)}" class="ln"/>`;
  const xs=o.xs||1, ys=o.ys||1;
  for(let k=Math.ceil(x0/xs)*xs;k<=x1+1e-9;k+=xs){ const kk=r6(k); if(kk===0&&ax===0&&ay===0) continue; s+=`<line x1="${f1(X(kk))}" y1="${f1(Y(ay)-4)}" x2="${f1(X(kk))}" y2="${f1(Y(ay)+4)}" class="axe2"/>`+T(X(kk),Y(ay)+18,F(kk)); }
  for(let k=Math.ceil(y0/ys)*ys;k<=y1+1e-9;k+=ys){ const kk=r6(k); if(kk===0) continue; s+=`<line x1="${f1(X(ax)-4)}" y1="${f1(Y(kk))}" x2="${f1(X(ax)+4)}" y2="${f1(Y(kk))}" class="axe2"/>`+T(X(ax)-7,Y(kk)+5,F(kk),"","end"); }
  if(ax===0&&ay===0) s+=T(X(0)-7,Y(0)+18,"0","","end");
  if(o.xl) s+=T(X(x1)+12,Y(ay)-10,o.xl,"font-style:italic","end"); if(o.yl) s+=T(X(ax)+8,Y(y1)-4,o.yl,"","start");
  (o.proj||[]).forEach(([a,b])=>{ s+=`<path d="M${f1(X(a))} ${f1(Y(ay))} L${f1(X(a))} ${f1(Y(b))} L${f1(X(ax))} ${f1(Y(b))}" style="fill:none;stroke:${BLUE};stroke-width:1.6;stroke-dasharray:5 4"/>`; });
  (o.c||[]).forEach(c=>{ const a=c.a??x0, b=c.b??x1, N=c.n||400; let d="", pen=false;
    for(let i=0;i<=N;i++){ const x=a+(b-a)*i/N, y=c.f(x); if(!isFinite(y)||y<y0-0.02||y>y1+0.02){ pen=false; continue; } d+=(pen?"L":"M")+f1(X(x))+" "+f1(Y(y)); pen=true; }
    s+=`<path d="${d}" style="fill:none;stroke:${c.col||RED};stroke-width:2.6;stroke-linejoin:round;stroke-linecap:round"/>`;
    if(c.ends) [a,b].forEach(x=>{ const y=c.f(x); if(isFinite(y)&&y>=y0&&y<=y1) s+=`<circle cx="${f1(X(x))}" cy="${f1(Y(y))}" r="4" style="fill:${c.col||RED}"/>`; }); });
  (o.p||[]).forEach(q=>{ const px=X(q.x), py=Y(q.y), col=q.col||"var(--ink)"; s+=`<path d="M${f1(px-6)} ${f1(py-6)} L${f1(px+6)} ${f1(py+6)} M${f1(px+6)} ${f1(py-6)} L${f1(px-6)} ${f1(py+6)}" style="stroke:${col};stroke-width:2.4"/>`;
    if(q.t) s+=T(px+(q.dx??10),py+(q.dy??-8),q.t,`font-weight:700;fill:${col}`,"start"); });
  (o.lab||[]).forEach(q=>{ s+=T(X(q.x),Y(q.y),q.t,`font-weight:700;fill:${q.col||"var(--ink)"}`); });
  return s+"</svg>"; }

const $a=X("a"), $b=X("b"), $d=X("d"), $p=X("p"), $i=X("i");
/* une droite y = a x + b, en couleur, étiquetée */
const D=(a,b,o={})=>({f:x=>a*x+b, a:o.a, b:o.b, col:o.col});
const pts=L=>L.map(([x,y,t])=>({x,y,t,dx:8,dy:-8}));

/* ===================== FIGURES DU COURS ===================== */
const G_C1=plot({x:[-3,4],y:[-10,7],u:34,v:16,gy:1,ys:2,c:[D(-3,0,{a:-2.3,b:3.3})],p:pts([[-2,6],[1,-3],[3,-9]]),xl:"x",yl:fx("f"),title:"Représentation graphique de f",alt:"Droite passant par l'origine et par les points (−2 ; 6), (1 ; −3) et (3 ; −9)"});
const G_C2=plot({x:[0,7],y:[0,10],u:48,v:26,c:[D(1.5,0,{a:0,b:6.6,col:BLUE})],p:pts([[1,1.5],[5,7.5],[6,9]]),xl:"x",yl:fx("g"),title:"Représentation graphique de g",alt:"Droite passant par l'origine et par les points (1 ; 1,5), (5 ; 7,5) et (6 ; 9)"});
const G_C3=plot({x:[-2,3],y:[-5,7],u:46,v:22,c:[D(3,-2,{a:-1,b:3})],p:pts([[0,-2],[1,1]]),xl:"x",yl:fx("f"),title:"f(x) = 3x − 2",w:260,alt:"Droite de f(x) = 3x − 2 passant par (0 ; −2) et (1 ; 1)"});
const G_C4=plot({x:[-2,3],y:[-1,6],u:46,v:30,c:[D(0,4,{col:GRN})],p:pts([[0,4]]),xl:"x",yl:fx("g"),title:"g(x) = 4",w:260,alt:"Droite horizontale passant par (0 ; 4)"});
const G_C5=plot({x:[-2,3],y:[-4,5],u:46,v:28,c:[D(-1.5,1,{a:-2,b:3,col:BLUE})],p:pts([[0,1],[1,-0.5]]),xl:"x",yl:fx("h"),title:"h(x) = −1,5x + 1",w:260,alt:"Droite de h(x) = −1,5x + 1 passant par (0 ; 1) et (1 ; −0,5)"});
const G_C6=plot({x:[-2,4],y:[-5,8],u:46,v:24,c:[D(-2,3,{a:-2,b:4})],p:pts([[0,3],[1,1]]),xl:"x",yl:fx("f"),title:"f(x) = −2x + 3",alt:"Droite de f(x) = −2x + 3 qui coupe l'axe des ordonnées en 3"});
const G_C7=plot({x:[0,6],y:[0,26],u:52,v:11,gy:2,ys:4,c:[D(4,2,{a:0,b:6,col:BLUE})],p:pts([[0,2],[1,6],[3,14],[5,22]]),xl:"x",yl:fx("g"),title:"g(x) = 4x + 2",alt:"Droite de g(x) = 4x + 2 qui coupe l'axe des ordonnées en 2"});

/* ===================== FIGURES DES EXERCICES ===================== */
const G_A1f=plot({x:[-4,4],y:[-10,6],u:34,v:16,gy:1,ys:2,xs:1,c:[D(-3,0)],p:pts([[-2,6],[1,-3],[3,-9]]),xl:"x",yl:fx("f"),alt:"Droite de f(x) = −3x passant par (−2 ; 6), (1 ; −3) et (3 ; −9)"});
const G_A1g=plot({x:[0,7],y:[0,10],u:48,v:26,c:[D(1.5,0,{a:0,b:6.6,col:BLUE})],p:pts([[1,1.5],[5,7.5],[6,9]]),xl:"x",yl:fx("g"),alt:"Droite de g(x) = 1,5x passant par (1 ; 1,5), (5 ; 7,5) et (6 ; 9)"});
const G_E3a=plot({x:[0,2.2],y:[0,3.5],u:150,v:80,gs:0.25,gy:0.25,xs:0.5,ys:0.5,c:[D(1.6,0,{a:0,b:2.1875})],p:pts([[1,1.6],[2,3.2]]),xl:"x",yl:fx("d"),alt:"Droite de d(x) = 1,6x passant par l'origine, par (1 ; 1,6) et par (2 ; 3,2)"});
const G_E3b=plot({x:[-3,3],y:[-6,6],u:40,v:22,c:[D(-2,0,{col:BLUE})],p:pts([[0,0],[1,-2]]),xl:"x",yl:fx("f"),alt:"Droite de f(x) = −2x passant par l'origine et par (1 ; −2)"});
const G_A2f=plot({x:[-2,3],y:[0,7],u:56,v:40,gs:0.5,gy:0.5,xs:1,ys:1,c:[D(-2,3,{a:-2,b:1.5})],p:pts([[-2,7],[0,3],[1,1]]),xl:"x",yl:fx("f"),alt:"Droite de f(x) = −2x + 3 passant par (−2 ; 7), (0 ; 3) et (1 ; 1)"});
const G_A2g=plot({x:[0,5.5],y:[0,25],u:70,v:12,gs:0.5,gy:1,ys:5,c:[D(4,2,{a:0,b:5.5,col:BLUE})],p:pts([[1,6],[3,14],[5,22]]),xl:"x",yl:fx("g"),alt:"Droite de g(x) = 4x + 2 passant par (1 ; 6), (3 ; 14) et (5 ; 22)"});
/* Brevet Polynésie 2018 : A = 3,75x (D2) ; B = 130 (D3) ; C = 30 + 2,25x (D1) */
const polyLab=[{x:38,y:108,t:"(D1)",col:RED},{x:30,y:126,t:"(D2)",col:BLUE},{x:6,y:136,t:"(D3)",col:GRN}];
const G_POLY=o=>plot({x:[0,48],y:[0,145],u:11,v:2.4,gs:2,gy:10,xs:4,ys:20,c:[D(2.25,30,{col:RED}),D(3.75,0,{a:0,b:145/3.75,col:BLUE}),D(0,130,{col:GRN})],lab:polyLab,proj:o?[[16,60],[40,120],[31.11,100]]:[],xl:"Nombre de magazines",yl:"Coût en euros",alt:"Trois droites : (D1) part de 30 et monte doucement, (D2) part de l'origine et monte plus vite, (D3) est horizontale à 130"+(o?", avec les traits de lecture":"")});
/* Brevet Nouvelle-Calédonie 2017 : f(x) = 2x + 1 */
const G_NC=o=>plot({x:[-10,9],y:[-8,9],u:22,v:20,xs:2,ys:2,c:o?[D(2,1,{a:-4.5,b:4})]:[],p:o?pts([[0,1],[2,5]]):[],proj:o?[[-3,-5]]:[],xl:"x",yl:"y",alt:o?"Droite de f(x) = 2x + 1 passant par (0 ; 1) et (2 ; 5), avec la lecture de l'image de −3 : −5":"Repère vide"});

/* ===================== SCHÉMAS DU QCM ===================== */
const S_LIN=sch("Fonction linéaire",`<p>${fx("f")} = ${$a}${$x} : pas de nombre ajouté.</p><p class="schN">${$a} est le coefficient. Le tableau de valeurs est un tableau de proportionnalité.</p>`);
const S_AFF=sch("Fonction affine",`<p>${fx("f")} = ${$a}${$x} + ${$b}</p><p class="schN">${$a} : coefficient directeur · ${$b} : ordonnée à l'origine.<br>${$b} = 0 : fonction linéaire · ${$a} = 0 : fonction constante.</p>`);
const S_IMG=sch("Calculer une image",`<p>On remplace ${$x} par le nombre.</p><p class="schN">${fx("f")} = 3${$x} − 2 donc ${fx("f","4")} = 3 × 4 − 2 = 10. L'image de 4 est 10.</p>`);
const S_ANT=sch("Calculer un antécédent",`<p>On résout l'équation ${fx("f")} = le nombre.</p><p class="schN">${fx("f")} = 3${$x} − 2. Antécédent de 13 : 3${$x} − 2 = 13, donc 3${$x} = 15 et ${$x} = 5.</p>`);
const S_GR=sch("Représentation graphique",`<p>C'est une droite.</p><p class="schN">Elle passe par le point (0 ; ${$b}).<br>${$a} &gt; 0 : la droite « monte » · ${$a} &lt; 0 : elle « descend » · ${$a} = 0 : elle est parallèle à l'axe des abscisses.<br>Fonction linéaire : la droite passe par l'origine.</p>`);

CH["3e-19"] = {
intro:"Reconnaître une fonction linéaire ou affine, calculer des images et des antécédents, et tracer sa représentation graphique : une droite.",
savoir:[
  "reconnaître une fonction linéaire et donner son coefficient ;",
  "associer une situation de proportionnalité à une fonction linéaire ;",
  `reconnaître une fonction affine et donner ${$a} (coefficient directeur) et ${$b} (ordonnée à l'origine) ;`,
  "calculer l'image et l'antécédent d'un nombre par une fonction linéaire ou affine ;",
  "tracer la représentation graphique d'une fonction linéaire ou affine ;",
  "associer une droite à l'expression de sa fonction."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Fonctions linéaires", h:`
<div class="retenir" data-l="Définition"><p>Une <b>fonction linéaire</b> de coefficient ${$a} est une fonction qui, à un nombre ${$x}, associe ${$a} × ${$x}, où ${$a} est un nombre donné.</p>
<p>Autrement dit, une fonction linéaire ${$f} est une fonction de la forme ${$f} : ${$x} ↦ ${$a}${$x} (ou ${fx("f")} = ${$a}${$x}).</p></div>
<div class="retenir" data-l="Propriété"><p>À toute situation de proportionnalité, on peut associer une fonction linéaire.</p>
<p>${$a} est le coefficient de la fonction linéaire, mais il est également le <b>coefficient de proportionnalité</b>.</p></div>
<p><b>Exemple – Fonction linéaire n°1 :</b> la fonction ${$f} telle que ${fx("f")} = −3${$x}.</p>
${vt(`${$x} (antécédents)`,[-2,1,3],`${fx("f")} (images)`,[6,-3,-9])}
${calc([`${fx("f","−2")} = −3 × (−2)`,`${fx("f","−2")} = 6`])}
<p>L'image de −2 est 6.</p>
<p>Le tableau de valeurs est un tableau de proportionnalité. Le coefficient de proportionnalité est égal à −3.</p>
<p><b>Exemple – Fonction linéaire n°2 :</b> un service de transports urbains propose le ticket à l'unité au prix de 1,50 €.</p>
<p>${$g} est la fonction qui, à un nombre ${$x} de tickets achetés, associe le prix payé en €.</p>
<p>Donc ${fx("g")} = 1,5${$x}.</p>
${vt("Nombre de tickets achetés",[1,5,6],"Prix payé (en €)",["1,50","7,50","9"])}
<p>Le coefficient de proportionnalité est égal à 1,5.</p>`},
{k:"II", t:"Représentation graphique d'une fonction linéaire", h:`
<div class="retenir" data-l="Définition – propriété"><p>Dans un repère, la représentation graphique de la fonction linéaire ${$f} : ${$x} ↦ ${$a}${$x} est constituée de tous les points de coordonnées (${$x} ; ${$a}${$x}).</p>
<p>La représentation graphique d'une fonction linéaire est une <b>droite qui passe par l'origine</b> du repère (car ${fx("f","0")} = 0).</p></div>
<p><b>Exemple :</b> la représentation graphique d'une fonction linéaire est la droite (OA), où O est l'origine du repère et A est le point de coordonnées (1 ; ${$a}).</p>
<p>On dit que ${$a} est le <b>coefficient directeur</b> de la droite (OA) car il indique la direction de la droite.</p>
${img("3k19co/oa.png","Trois repères : si a > 0 la droite (OA) monte ; si a = 0 la droite est confondue avec l'axe des abscisses ; si a < 0 la droite (OA) descend",620)}
<p><b>Fonction n°1 :</b> trace la représentation graphique de la fonction ${$f} (${fx("f")} = −3${$x}).</p>
<p>En s'aidant du tableau de valeurs, je peux placer les points de coordonnées (−2 ; 6), (1 ; −3) et (3 ; −9).</p>
${G_C1}
<p>Le coefficient de la fonction linéaire est −3, donc négatif. La droite « descend » bien de gauche à droite.</p>
<p><b>Fonction n°2 :</b> trace la représentation graphique de la fonction ${$g} (${fx("g")} = 1,5${$x}).</p>
<p>En s'aidant du tableau de valeurs, je peux placer les points de coordonnées (1 ; 1,5), (5 ; 7,5) et (6 ; 9).</p>
${G_C2}
<p>Le coefficient de la fonction linéaire est 1,5, donc positif. La droite « monte » bien de gauche à droite.</p>`},
{k:"III", t:"Fonctions affines", h:`
<div class="retenir" data-l="Définition"><p>Une <b>fonction affine</b> est une fonction qui, à un nombre ${$x}, associe ${$a} × ${$x} + ${$b}, où ${$a} et ${$b} sont des nombres donnés.</p>
<p>Autrement dit, une fonction affine ${$f} est une fonction de la forme ${$f} : ${$x} ↦ ${$a}${$x} + ${$b} (${fx("f")} = ${$a}${$x} + ${$b}).</p></div>
<p><b>Exemples :</b></p>
<ul><li>La fonction ${$h} telle que ${fx("h")} = −3${$x} + 5 est une fonction affine avec ${$a} = −3 et ${$b} = 5.</li>
<li>La fonction ${$i} telle que ${fx("i")} = {4/3}${$x} − 6 est une fonction affine avec ${$a} = {4/3} et ${$b} = −6.</li></ul>
<p><b>Contre-exemple :</b> la fonction ${X("j")} telle que ${fx("j")} = 4${sq($x)} + 6 n'est pas une fonction affine.</p>
<div class="retenir" data-l="Cas particuliers des fonctions affines"><p>Les fonctions de la forme ${fx("f")} = ${$a}${$x} (donc ${$b} = 0) sont des fonctions affines particulières : ce sont des <b>fonctions linéaires</b>.</p>
<p>Les fonctions de la forme ${fx("f")} = ${$b} (donc ${$a} = 0) sont des fonctions affines particulières : ce sont des <b>fonctions constantes</b>.</p></div>`},
{k:"IV", t:"Représentation graphique d'une fonction affine", h:`
<div class="retenir" data-l="Définition – propriété"><p>Dans un repère, la représentation graphique de la fonction affine ${$f} : ${$x} ↦ ${$a}${$x} + ${$b} est constituée de tous les points de coordonnées (${$x} ; ${$a}${$x} + ${$b}).</p>
<p>La représentation graphique d'une fonction affine est une <b>droite</b> :</p>
<ul><li>qui passe par le point de coordonnées (0 ; ${$b}) car ${fx("f","0")} = ${$a} × 0 + ${$b} = ${$b}. On dit donc que ${$b} est l'<b>ordonnée à l'origine</b> ;</li>
<li>et ${$a} est le <b>coefficient directeur</b> car il indique la direction de la droite.</li></ul></div>
<p><b>Exemples :</b></p>
<div class="schRow">
<div><p><b>Si ${$a} &gt; 0 – fonction affine :</b> ${fx("f")} = 3${$x} − 2 (${$a} = 3 et ${$b} = −2)</p>
${calc([`${fx("f","0")} = 3 × 0 − 2`,`${fx("f","0")} = −2`])}<p>−2 est l'ordonnée à l'origine : la droite passe par le point de coordonnées (0 ; −2).</p>
${calc([`${fx("f","1")} = 3 × 1 − 2`,`${fx("f","1")} = 1`])}<p>Donc la droite passe par le point de coordonnées (1 ; 1).</p>${G_C3}
<p>Quand ${$x} augmente de 1, ${fx("f")} augmente de 3. La droite « monte ».</p></div>
<div><p><b>Si ${$a} = 0 – fonction constante :</b> ${fx("g")} = 4 (${$a} = 0 et ${$b} = 4)</p>
<p>L'image de chaque antécédent est égale à 4.</p>${G_C4}
<p>La droite est parallèle à l'axe des abscisses.</p></div>
<div><p><b>Si ${$a} &lt; 0 – fonction affine :</b> ${fx("h")} = −1,5${$x} + 1 (${$a} = −1,5 et ${$b} = 1)</p>
${calc([`${fx("h","0")} = −1,5 × 0 + 1`,`${fx("h","0")} = 1`])}<p>1 est l'ordonnée à l'origine : la droite passe par le point de coordonnées (0 ; 1).</p>
${calc([`${fx("h","1")} = −1,5 × 1 + 1`,`${fx("h","1")} = −0,5`])}<p>Donc la droite passe par le point de coordonnées (1 ; −0,5).</p>${G_C5}
<p>Quand ${$x} augmente de 1, ${fx("h")} baisse de 1,5. La droite « descend ».</p></div>
</div>
<div class="retenir" data-l="À retenir"><p>En fonction du coefficient directeur ${$a}, la représentation graphique d'une fonction affine est :</p>
<ul><li><b>croissante</b> (elle « monte ») si et seulement si ${$a} est positif (${$a} &gt; 0) ;</li>
<li><b>décroissante</b> (elle « descend ») si et seulement si ${$a} est négatif (${$a} &lt; 0) ;</li>
<li><b>constante</b> si et seulement si ${$a} est nul (${$a} = 0).</li></ul>
<p>${$b} est l'ordonnée du point d'intersection de la droite et de l'axe des ordonnées.</p></div>
${img("3k19co/signe.png","Trois droites : si a > 0 elle monte, si a < 0 elle descend, si a = 0 elle est horizontale ; chacune coupe l'axe des ordonnées en b",600)}
<p><b>Fonction n°1 :</b> soit ${$f} la fonction telle que ${fx("f")} = −2${$x} + 3.</p>
${G_C6}
<p>Le coefficient directeur ${$a} est négatif : il vaut −2. On constate effectivement que la droite « descend ».</p>
<p>${fx("f","0")} = 3, donc l'ordonnée à l'origine ${$b} vaut 3. Sur le graphique, on remarque que la droite coupe l'axe des ordonnées à 3.</p>
<p><b>Fonction n°2 :</b> un site internet vend des livres à 4 € l'unité. Quel que soit le nombre de livres achetés, les frais de port s'élèvent à 2 €.</p>
<p>${$g} est la fonction qui, à un nombre ${$x} de livres achetés, associe le prix payé en €. Donc ${fx("g")} = 4${$x} + 2.</p>
${G_C7}
<p>Le coefficient directeur ${$a} est positif : il vaut 4. On constate effectivement que la droite « monte ».</p>
<p>${fx("g","0")} = 2, donc l'ordonnée à l'origine ${$b} vaut 2. Sur le graphique, on remarque que la droite coupe l'axe des ordonnées à 2.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Fonctions linéaires", e:[
  {n:"Activité 1", t:"Les fonctions linéaires", w:"Sur ta feuille", h:`<p><b>Fonction n°1 :</b> soit ${$f} la fonction telle que ${$f} : ${$x} ↦ −3${$x}.</p>
<p><b>1 –</b> Complète le tableau de valeurs suivant :</p>${vt(`${$x} (antécédents)`,[-2,1,3],`${fx("f")} (images)`,["","",""])}
<p><b>2 –</b> Trace la représentation graphique de la fonction ${$f} dans un repère (${$x} de −4 à 4, ${fx("f")} de −10 à 6).</p>
<p><b>Fonction n°2 :</b> un service de transports urbains propose le ticket à l'unité au prix de 1,50 €.</p>
<p><b>1 –</b> Complète le tableau suivant :</p>${vt("Nombre de tickets achetés",[1,5,6],"Prix payé (en €)",["","",""])}
<p><b>2 –</b> ${$g} est la fonction qui, à un nombre ${$x} de tickets achetés, associe le prix payé en €. Donne la relation algébrique de cette fonction : ${$g} : ${$x} ↦ …</p>
<p><b>3 –</b> Trace la représentation graphique de la fonction ${$g} (${$x} de 0 à 7, ${fx("g")} de 0 à 10).</p>
<p><b>4 –</b> Note les points communs entre ces deux fonctions (sur leur relation algébrique, leur représentation graphique…).</p>`,
   c:`<p><b>Fonction n°1</b></p><p><b>1 –</b></p>${vt(`${$x} (antécédents)`,[-2,1,3],`${fx("f")} (images)`,[6,-3,-9])}<div class="calcs"><p class="calc">${fx("f","−2")} = −3 × (−2)<br>${fx("f","−2")} = 6</p><p class="calc">${fx("f","1")} = −3 × 1<br>${fx("f","1")} = −3</p><p class="calc">${fx("f","3")} = −3 × 3<br>${fx("f","3")} = −9</p></div>
<p><b>2 –</b> On place les points (−2 ; 6), (1 ; −3) et (3 ; −9), puis on trace la droite.</p>${G_A1f}
<p><b>Fonction n°2</b></p><p><b>1 –</b></p>${vt("Nombre de tickets achetés",[1,5,6],"Prix payé (en €)",["1,50","7,50","9"])}
<p><b>2 –</b> ${$g} : ${$x} ↦ 1,5${$x}</p><p><b>3 –</b> On place les points (1 ; 1,5), (5 ; 7,5) et (6 ; 9), puis on trace la droite.</p>${G_A1g}
<p><b>4 –</b> Points communs :</p><ul><li>les deux fonctions sont de la forme ${$x} ↦ ${$a}${$x} (on multiplie ${$x} par un nombre) ;</li><li>leurs tableaux de valeurs sont des tableaux de proportionnalité ;</li><li>leurs représentations graphiques sont des droites qui passent par l'origine du repère.</li></ul><p>Ce sont des <b>fonctions linéaires</b>.</p>`},
  {n:"Exercice 1", t:"Reconnaître des fonctions linéaires", w:"Sur ta feuille", h:`<p>Entoure les fonctions linéaires et, pour celles-ci, indique leur coefficient.</p>
${cols([`${fx("f")} = 5${$x}`,`${fx("g")} = ${$x} × 4,2`,`${fx("h")} = 2${$x} + 1`,`${fx("i")} = −1,4${$x}`,`${fx("j")} = {2/3}${$x}`,`${fx("k")} = 1 + ${$x}`])}`,
   c:tabH(["Fonction","Linéaire ?","Coefficient"],[[`${fx("f")} = 5${$x}`,"Oui","5"],[`${fx("g")} = ${$x} × 4,2`,"Oui","4,2"],[`${fx("h")} = 2${$x} + 1`,"Non (on ajoute 1)","—"],[`${fx("i")} = −1,4${$x}`,"Oui","−1,4"],[`${fx("j")} = {2/3}${$x}`,"Oui","{2/3}"],[`${fx("k")} = 1 + ${$x}`,"Non (on ajoute 1)","—"]])},
  {n:"Exercice 2", t:"Calcul d'images et d'antécédents", w:"Sur ton cahier", h:`<p><b>Situation 1 :</b> des cerises sont vendues à 4,35 € le kilo. On note ${$p} la fonction qui, à la masse ${$x} de cerises (en kg), associe le prix à payer (en €).</p>
<p><b>1 –</b> Complète le tableau suivant sans justifier.</p>${vt($x,[0,1,"2,4","",""],fx("p"),["","","","21,75","29,58"])}
<p><b>2 –</b> Vérifie que ${fx("p","3,6")} = 15,66. Interprète cette valeur (ce que signifie cette égalité pour la situation).</p>
<p><b>3 –</b> a) Donne la relation algébrique de la fonction ${$p}.</p><p>b) La fonction ${$p} est-elle une fonction linéaire ? Si oui, indique son coefficient.</p>
<p><b>Situation 2 :</b> on note ${$f} la fonction linéaire telle que ${fx("f")} = −2,4${$x}.</p>
<p><b>1 –</b> Calcule l'image de 1,7 par la fonction ${$f}. (Rédige tes calculs avec le langage des fonctions.)</p>
<p><b>2 –</b> Calcule l'antécédent de −3,6 par la fonction ${$f}. (Rédige tes calculs avec le langage des fonctions.)</p>`,
   c:`<p><b>Situation 1</b></p><p><b>1 –</b></p>${vt($x,[0,1,"2,4",5,"6,8"],fx("p"),[0,"4,35","10,44","21,75","29,58"])}
<p>4,35 × 2,4 = 10,44 · 21,75 ÷ 4,35 = 5 · 29,58 ÷ 4,35 = 6,8</p>
<p><b>2 –</b></p><p class="calc">${fx("p","3,6")} = 4,35 × 3,6<br>${fx("p","3,6")} = 15,66</p><p>3,6 kg de cerises coûtent 15,66 €.</p>
<p><b>3 –</b> a) ${fx("p")} = 4,35${$x} · b) Oui, ${$p} est une fonction linéaire de coefficient 4,35.</p>
<p><b>Situation 2</b></p><p><b>1 –</b></p>${calc([`${fx("f","1,7")} = −2,4 × 1,7`,`${fx("f","1,7")} = −4,08`])}<p>L'image de 1,7 par ${$f} est −4,08.</p>
<p><b>2 –</b> On cherche ${$x} tel que ${fx("f")} = −3,6.</p>${calc([`−2,4${$x} = −3,6`,[`${$x} = −3,6 ÷ (−2,4)`,"÷ (−2,4)"],`${$x} = 1,5`])}<p>L'antécédent de −3,6 par ${$f} est 1,5.</p>`},
  {n:"Exercice 3", t:"Représentation graphique d'une fonction linéaire", w:"Sur ta feuille", h:`<p><b>Partie 1 :</b> aux États-Unis, les distances sont mesurées en miles. 1 mile représente environ 1,6 km.</p>
<p>${$d} est la fonction qui, à une distance ${$x} en miles, associe la distance en km. Donc ${$d} est une fonction linéaire telle que ${fx("d")} = 1,6${$x}.</p>
<p>Trace la représentation graphique de la fonction ${$d} (${$x} de 0 à 2, ${fx("d")} de 0 à 3,5).</p>
<p><b>Partie 2 :</b> sur ton cahier, représente graphiquement la fonction ${fx("f")} = −2${$x}.</p>`,
   c:`<p><b>Partie 1 :</b> ${$d} est linéaire : sa droite passe par l'origine. ${fx("d","1")} = 1,6 et ${fx("d","2")} = 3,2 : on place (1 ; 1,6) et (2 ; 3,2).</p>${G_E3a}
<p><b>Partie 2 :</b> ${$f} est linéaire : sa droite passe par l'origine.</p><p class="calc">${fx("f","1")} = −2 × 1<br>${fx("f","1")} = −2</p><p>On place (1 ; −2).</p>${G_E3b}`},
  {n:"Exercice 4", t:"Reconnaître graphiquement une fonction linéaire", w:"Sur ta feuille", h:`<p>Voici les représentations graphiques de 5 fonctions : ${$f}, ${$g}, ${$h}, ${$i} et ${X("j")}.</p>
<div class="schRow">${img("3k19ex/e4a.png","Repère avec deux droites : i coupe l'axe des ordonnées au-dessus de 0 et monte ; j passe par l'origine et descend",300)}${img("3k19ex/e4b.png","Repère avec trois droites passant par l'origine : f et g montent (f plus vite que g), h descend",360)}</div>
<p>Pour chaque fonction, dis si c'est une fonction linéaire (oui ou non). Pour les fonctions linéaires, donne le signe de leur coefficient.</p>
<p><i>Pour aller plus loin (pas au programme de 3<sup>e</sup>) : tu peux indiquer la relation algébrique de chaque fonction.</i></p>`,
   c:`${tabH(["Fonction","Linéaire ?","Signe du coefficient"],[[$f,"Oui : la droite passe par l'origine","positif (la droite monte)"],[$g,"Oui : la droite passe par l'origine","positif (la droite monte)"],[$h,"Oui : la droite passe par l'origine","négatif (la droite descend)"],[$i,"Non : la droite ne passe pas par l'origine","—"],[X("j"),"Oui : la droite passe par l'origine","négatif (la droite descend)"]])}
<p><i>Pour aller plus loin :</i> la droite de ${$f} passe par (1 ; 3), donc ${fx("f")} = 3${$x} · celle de ${$g} par (2 ; 3), donc ${fx("g")} = 1,5${$x} · celle de ${$h} par (1 ; −1), donc ${fx("h")} = −${$x}.</p>`},
  {n:"Exercice 4 bis", t:"Modéliser une situation et reconnaître une fonction linéaire", w:"Sur ta feuille", h:`<p>Pour chaque situation, écris la fonction ${$p}, puis dis si c'est une fonction linéaire (oui ou non).</p>
<p><b>1 –</b> Des abricots sont vendus à 2,50 € le kg. On note ${$p} la fonction qui, à la masse ${$x} d'abricots (en kg), associe le prix à payer (en €).</p>
<p><b>2 –</b> Sur internet, Joanna commande des DVD au prix de 9,95 € l'un. Elle paye en plus 3,90 € de frais de port. On note ${$p} la fonction qui, au nombre ${$x} de DVD achetés, associe le prix à payer (en €).</p>
<p><b>3 –</b> On considère un carré de côté ${$x}. On note ${$p} la fonction qui, au côté ${$x} du carré, associe son périmètre.</p>`,
   c:`<p><b>1 –</b> ${fx("p")} = 2,5${$x} : <b>oui</b>, fonction linéaire (de coefficient 2,5).</p><p><b>2 –</b> ${fx("p")} = 9,95${$x} + 3,90 : <b>non</b>, on ajoute les frais de port.</p><p><b>3 –</b> ${fx("p")} = 4${$x} : <b>oui</b>, fonction linéaire (de coefficient 4).</p>`}
]},
{t:"Fonctions affines", e:[
  {n:"Activité 2", t:"Les fonctions affines", w:"Sur ta feuille", h:`<p><b>Fonction n°1 :</b> soit ${$f} la fonction telle que ${fx("f")} = −2${$x} + 3.</p>
<p><b>1 –</b> Complète le tableau de valeurs suivant :</p>${vt($x,[-2,0,1],fx("f"),["","",""])}
<p><b>2 –</b> Trace la représentation graphique de la fonction ${$f} (${$x} de −2 à 3, ${fx("f")} de 0 à 7).</p>
<p><b>Fonction n°2 :</b> un site internet vend des livres à 4 € l'unité. Quel que soit le nombre de livres achetés, les frais de port s'élèvent à 2 €.</p>
<p><b>1 –</b> Complète le tableau suivant :</p>${vt("Nombre de livres achetés",[1,3,5],"Prix payé (en €)",["","",""])}
<p><b>2 –</b> ${$g} est la fonction qui, à un nombre ${$x} de livres achetés, associe le prix payé en €. Donne la relation algébrique de cette fonction : ${fx("g")} = …</p>
<p><b>3 –</b> Trace la représentation graphique de la fonction ${$g} (${$x} de 0 à 5,5, ${fx("g")} de 0 à 25).</p>
<p><b>4 –</b> Ces deux fonctions sont-elles linéaires ? Pourquoi ?</p><p><b>5 –</b> Quels sont les points communs de ces deux fonctions ?</p>`,
   c:`<p><b>Fonction n°1</b></p><p><b>1 –</b></p>${vt($x,[-2,0,1],fx("f"),[7,3,1])}<div class="calcs"><p class="calc">${fx("f","−2")} = −2 × (−2) + 3<br>${fx("f","−2")} = 7</p><p class="calc">${fx("f","0")} = −2 × 0 + 3<br>${fx("f","0")} = 3</p><p class="calc">${fx("f","1")} = −2 × 1 + 3<br>${fx("f","1")} = 1</p></div>
<p><b>2 –</b></p>${G_A2f}
<p><b>Fonction n°2</b></p><p><b>1 –</b></p>${vt("Nombre de livres achetés",[1,3,5],"Prix payé (en €)",[6,14,22])}<p>4 × 1 + 2 = 6 · 4 × 3 + 2 = 14 · 4 × 5 + 2 = 22</p>
<p><b>2 –</b> ${fx("g")} = 4${$x} + 2</p><p><b>3 –</b></p>${G_A2g}
<p><b>4 –</b> Non : elles ne sont pas de la forme ${$a}${$x} (on ajoute un nombre), leurs tableaux ne sont pas des tableaux de proportionnalité et leurs droites ne passent pas par l'origine.</p>
<p><b>5 –</b> Elles sont de la forme ${$a}${$x} + ${$b} et leurs représentations graphiques sont des droites. Ce sont des <b>fonctions affines</b>.</p>`},
  {n:"Exercice 5", t:"Reconnaître des fonctions affines", w:"Sur ta feuille", h:`<p>Entoure les fonctions affines et, pour celles-ci, indique la valeur de ${$a} (le coefficient directeur) et la valeur de ${$b} (l'ordonnée à l'origine).</p>
${cols([`${fx("f")} = 3${$x} + 9`,`${fx("g")} = 2,4${$x} − 6`,`${fx("h")} = 2${sq($x)} + 3`,`${fx("i")} = <span class="fr"><span>1</span><span>${$x}</span></span> + 7`,`${fx("j")} = {2/3}${$x} − 3`,`${fx("k")} = 5 + 7${$x}`,`${fx("l")} = −2${$x}`,`${fx("m")} = 5`])}`,
   c:tabH(["Fonction","Affine ?",`${$a}`,`${$b}`],[[`${fx("f")} = 3${$x} + 9`,"Oui","3","9"],[`${fx("g")} = 2,4${$x} − 6`,"Oui","2,4","−6"],[`${fx("h")} = 2${sq($x)} + 3`,`Non (il y a ${sq($x)})`,"—","—"],[`${fx("i")} = <span class="fr"><span>1</span><span>${$x}</span></span> + 7`,`Non (${$x} est au dénominateur)`,"—","—"],[`${fx("j")} = {2/3}${$x} − 3`,"Oui","{2/3}","−3"],[`${fx("k")} = 5 + 7${$x}`,"Oui","7","5"],[`${fx("l")} = −2${$x}`,"Oui (linéaire)","−2","0"],[`${fx("m")} = 5`,"Oui (constante)","0","5"]])},
  {n:"Exercice 6", t:"Calcul d'images et d'antécédents", w:"Sur ton cahier", h:`<p><b>Situation 1 :</b> on a le programme de calcul suivant.</p>${prog("",["Choisir un nombre","Multiplier le nombre par −4","Soustraire 3"])}
<p>On note ${$h} la fonction qui, au nombre choisi, associe le résultat du programme.</p>
<p><b>1 –</b> Donne l'expression algébrique de la fonction affine ${$h}.</p><p><b>2 –</b> Quelle est l'image de −6 par la fonction ${$h} ?</p><p><b>3 –</b> Quel est l'antécédent de 10 par la fonction ${$h} ?</p>
<p><b>Situation 2 :</b> on a la fonction affine ${$g} telle que ${fx("g")} = 2 + 3${$x}.</p>
<p><b>1 –</b> Quelle est l'image de {4/5} par la fonction ${$g} ?</p><p><b>2 –</b> Quel est l'antécédent de 12 par la fonction ${$g} ?</p>`,
   c:`<p><b>Situation 1</b></p><p><b>1 –</b> ${$x} → −4${$x} → −4${$x} − 3. Donc ${fx("h")} = −4${$x} − 3.</p>
<p><b>2 –</b></p>${calc([`${fx("h","−6")} = −4 × (−6) − 3`,`${fx("h","−6")} = 24 − 3`,`${fx("h","−6")} = 21`])}<p>L'image de −6 par ${$h} est 21.</p>
<p><b>3 –</b> On résout ${fx("h")} = 10.</p>${calc([`−4${$x} − 3 = 10`,[`−4${$x} = 13`,"+ 3"],[`${$x} = 13 ÷ (−4) = −3,25`,"÷ (−4)"]])}<p>L'antécédent de 10 par ${$h} est −3,25.</p>
<p><b>Situation 2</b></p><p><b>1 –</b></p>${calc([`${fx("g","{4/5}")} = 2 + 3 × {4/5}`,`${fx("g","{4/5}")} = {10/5} + {12/5}`,`${fx("g","{4/5}")} = {22/5}`,`${fx("g","{4/5}")} = 4,4`])}<p>L'image de {4/5} par ${$g} est {22/5}, c'est-à-dire 4,4.</p>
<p><b>2 –</b> On résout ${fx("g")} = 12.</p>${calc([`2 + 3${$x} = 12`,[`3${$x} = 10`,"− 2"],[`${$x} = {10/3}`,"÷ 3"]])}<p>L'antécédent de 12 par ${$g} est {10/3}.</p>`},
  {n:"Exercice 7", t:"De la représentation graphique à l'expression algébrique", w:"Sur ta feuille", h:`${img("3k19ex/e7.png","Repère avec quatre droites nommées m, n, p et q",420)}
<p>Chacune des droites représente une des quatre fonctions ci-dessous. Écris le nom de la droite qui représente chaque fonction.</p>
${cols([`${fx("f")} = −5${$x} + 3`,`${fx("g")} = 3${$x} − 2`,`${fx("h")} = −0,8${$x}`,`${fx("j")} = 2${$x}`])}`,
   c:`${tabH(["Fonction","Droite","Pourquoi"],[[`${fx("f")} = −5${$x} + 3`,"(m)",`${$a} = −5 &lt; 0 : elle descend ; elle coupe l'axe des ordonnées en 3`],[`${fx("g")} = 3${$x} − 2`,"(p)",`${$a} = 3 &gt; 0 : elle monte ; elle coupe l'axe des ordonnées en −2`],[`${fx("h")} = −0,8${$x}`,"(n)","linéaire : elle passe par l'origine et descend"],[`${fx("j")} = 2${$x}`,"(q)","linéaire : elle passe par l'origine et monte"]])}`}
]},
{t:"Vu au brevet", e:[
  {n:"Exercice 8", t:"Polynésie, septembre 2018", w:"Sur ton cahier", h:`<p>Une personne s'intéresse à un magazine sportif qui paraît une fois par semaine. Elle étudie plusieurs formules d'achat de ces magazines, détaillées ci-après.</p>
<ul><li>Formule A : prix du magazine à l'unité : 3,75 € ;</li><li>Formule B : abonnement pour l'année : 130 € ;</li><li>Formule C : forfait de 30 € pour l'année et 2,25 € par magazine.</li></ul>
<p>On donne ci-dessous les représentations graphiques qui correspondent à ces trois formules.</p>${G_POLY(0)}
<p><b>1.</b> Relie chaque formule d'achat à sa représentation graphique (D1), (D2) ou (D3).</p>
<p><b>2.</b> En utilisant le graphique, réponds aux questions suivantes (les traits de construction doivent apparaître).</p>
<p>a) En choisissant la formule A, quelle somme dépense-t-on pour acheter 16 magazines dans l'année ?</p>
<p>b) Avec 120 €, combien peut-on acheter de magazines au maximum dans une année avec la formule C ?</p>
<p>c) Si on décide de ne pas dépasser un budget de 100 € pour l'année, quelle est alors la formule qui permet d'acheter le plus grand nombre de magazines ?</p>
<p><b>3.</b> Indique la formule la plus avantageuse selon le nombre de magazines achetés dans l'année.</p>`,
   c:`<p><b>1.</b> La formule A est représentée par la droite (D2) · la formule B par la droite (D3) · la formule C par la droite (D1).</p>${G_POLY(1)}
<p><b>2.</b> a) On lit 60 € (3,75 × 16 = 60).</p><p>b) On lit 40 magazines ((120 − 30) ÷ 2,25 = 40).</p><p>c) On lit un peu plus de 31 magazines, mais pas 32, avec la formule C. C'est la formule C (avec la formule A, on n'en achète que 26 ; la formule B coûte 130 €).</p>
<p><b>3.</b> On cherche, pour chaque nombre de magazines, la droite la plus basse :</p><ul><li>de 0 à 19 magazines, la formule la plus avantageuse est la formule A ;</li><li>pour 20 magazines, les formules A et C sont les plus avantageuses (75 €) ;</li><li>de 21 à 44 magazines, la formule la plus avantageuse est la formule C ;</li><li>de 45 à 52 magazines, c'est la formule B.</li></ul>`},
  {n:"Exercice 9", t:"Nouvelle-Calédonie, décembre 2017", w:"Sur ton cahier", h:`<p>Voici un programme de calcul :</p>${prog("",["Choisir un nombre","Ajouter 1 à ce nombre","Calculer le carré du résultat","Soustraire le carré du nombre de départ au résultat précédent","Écrire le résultat"])}
<p><b>1.</b> On choisit 4 comme nombre de départ. Prouve par le calcul que le résultat obtenu avec le programme est 9.</p>
<p><b>2.</b> On note ${$x} le nombre choisi.</p><p>a) Exprime le résultat du programme en fonction de ${$x}.</p><p>b) Prouve que ce résultat est égal à 2${$x} + 1.</p>
<p><b>3.</b> Soit ${$f} la fonction définie par ${fx("f")} = 2${$x} + 1.</p><p>a) Calcule l'image de 0 par ${$f}.</p><p>b) Détermine par le calcul l'antécédent de 5 par ${$f}.</p><p>c) Dans le repère ci-dessous, trace la droite représentative de la fonction ${$f}.</p>${G_NC(0)}
<p>d) Par lecture graphique, détermine le résultat obtenu en choisissant −3 comme nombre de départ dans le programme de calcul. Laisse les traits de construction apparents.</p>`,
   c:`<p><b>1.</b> 4 → 4 + 1 = 5 → 5<sup>2</sup> = 25 → 25 − 4<sup>2</sup> = 25 − 16 = 9.</p>
<p><b>2.</b> a) ${$x} → ${$x} + 1 → (${$x} + 1)<sup>2</sup> → (${$x} + 1)<sup>2</sup> − ${sq($x)}.</p>
<p>b) On note R le résultat.</p>${calc([`R = (${$x} + 1)<sup>2</sup> − ${sq($x)}`,`R = (${$x} + 1)(${$x} + 1) − ${sq($x)}`,`R = ${sq($x)} + ${$x} + ${$x} + 1 − ${sq($x)}`,`R = 2${$x} + 1`])}
<p><b>3.</b> a)</p><p class="calc">${fx("f","0")} = 2 × 0 + 1<br>${fx("f","0")} = 1</p><p>L'image de 0 est égale à 1.</p>
<p>b) On cherche ${$x} tel que ${fx("f")} = 5.</p>${calc([`2${$x} + 1 = 5`,[`2${$x} = 4`,"− 1"],[`${$x} = 2`,"÷ 2"]])}<p>L'antécédent de 5 par ${$f} est 2.</p>
<p>c) ${$f} est affine : on place (0 ; 1) et (2 ; 5) (car ${fx("f","2")} = 5), puis on trace la droite.</p>${G_NC(1)}
<p>d) La verticale passant par le point d'abscisse −3 coupe la droite en un point d'ordonnée −5. En choisissant −3 comme nombre de départ, on obtient −5.</p>`}
]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Reconnaître une fonction linéaire ou affine", schema:S_AFF, q:{
 1:[ {g:()=>{ const a=nz(-9,9), b=nz(-9,9); const good=`${fx("f")} = ${mono(a)}`;
       return {q:"Laquelle de ces fonctions est une fonction linéaire ?", c:ch4(good,[`${fx("f")} = ${lin(a,b)}`,`${fx("f")} = ${a===1?"":a===-1?"−":F(a)}${sq($x)}`,`${fx("f")} = ${F(b)}`]), rep:good, ex:`Une fonction linéaire est de la forme ${fx("f")} = ${$a}${$x}.`, sx:S_LIN}; }} ],
 2:[ {g:()=>{ const a=nz(-9,9), b=nz(-9,9); const good=`${$a} = ${F(a)} et ${$b} = ${F(b)}`;
       return {q:`${fx("f")} = ${lin(a,b)}. Quelles sont les valeurs de ${$a} et de ${$b} ?`, c:ch4(good,[`${$a} = ${F(b)} et ${$b} = ${F(a)}`,`${$a} = ${F(a)} et ${$b} = ${F(-b)}`,`${$a} = ${F(-a)} et ${$b} = ${F(b)}`]), rep:good, ex:`${fx("f")} = ${$a}${$x} + ${$b} : ${$a} est le nombre devant ${$x}, ${$b} est le nombre ajouté.`, sx:S_AFF}; }},
     {g:()=>{ const b=nz(-9,9), a=nz(-9,9); const good=`${$a} = ${F(a)} et ${$b} = ${F(b)}`;
       return {q:`${fx("f")} = ${F(b)} ${a<0?"−":"+"} ${mono(Math.abs(a))}. Quelles sont les valeurs de ${$a} et de ${$b} ?`, c:ch4(good,[`${$a} = ${F(b)} et ${$b} = ${F(a)}`,`${$a} = ${F(-a)} et ${$b} = ${F(b)}`,`${$a} = ${F(a)} et ${$b} = 0`]), rep:good, ex:`${$a} est toujours le nombre qui multiplie ${$x}, même s'il est écrit en second.`, sx:S_AFF}; }} ],
 3:[ {g:()=>{ const b=nz(-9,9), k=ri(2,9); const T=shuf([["constante",`${fx("f")} = ${F(b)}`],["linéaire",`${fx("f")} = ${mono(k)}`],["ni affine, ni linéaire",`${fx("f")} = ${F(k)}${sq($x)} + ${ri(1,9)}`]]); const [good,e]=T[0];
       return {q:`${e}. Cette fonction est…`, c:ch4(good,["constante","linéaire","ni affine, ni linéaire","affine mais pas linéaire"]), rep:good, ex:good==="constante"?`${$a} = 0 : c'est une fonction constante (une fonction affine particulière).`:good==="linéaire"?`${$b} = 0 : c'est une fonction linéaire (une fonction affine particulière).`:`Il y a ${sq($x)} : ce n'est pas une fonction affine.`, sx:S_AFF}; }},
     {q:"Vrai ou faux : une fonction linéaire est une fonction affine particulière.", c:VF, rep:"Vrai", ex:`C'est une fonction affine avec ${$b} = 0.`, sx:S_AFF} ]
}},
{nom:"Calculer une image", schema:S_IMG, q:{
 1:[ {g:()=>{ const a=nz(-9,9), x=nz(-9,9), good=F(a*x); return {q:`${fx("f")} = ${mono(a)}. Quelle est l'image de ${F(x)} ?`, c:ch4(good,[F(a+x),F(-a*x),F(x/a===Math.round(x/a)?x/a:a*x+1)]), rep:good, ex:`<br>${fx("f",F(x))} = ${F(a)} × ${P(x)}<br>${fx("f",F(x))} = ${good}`, sx:S_IMG}; }} ],
 2:[ {g:()=>{ const a=nz(-9,9), b=nz(-9,9), x=nz(-9,9), good=F(a*x+b); return {q:`${fx("f")} = ${lin(a,b)}. Quelle est l'image de ${F(x)} ?`, c:ch4(good,[F(a*x-b),F(a*(x+b)),F(-a*x+b)]), rep:good, ex:`<br>${fx("f",F(x))} = ${F(a)} × ${P(x)} ${b<0?"−":"+"} ${F(Math.abs(b))}<br>${fx("f",F(x))} = ${F(a*x)} ${b<0?"−":"+"} ${F(Math.abs(b))}<br>${fx("f",F(x))} = ${good}`, sx:S_IMG}; }} ],
 3:[ {g:()=>{ const a=ri(2,9)*pick([1,-1]), b=nz(-9,9), q=pick([2,3,5]), p=ri(1,q-1)*pick([1,-1]); const num=a*p+b*q; const good=FR(num,q);
       return {q:`${fx("g")} = ${lin(a,b)}. Quelle est l'image de ${FR(p,q)} ?`, c:ch4(good,[FR(a*p+b,q),FR(a*p,q),FR(a*p-b*q,q)]), rep:good, ex:`<br>${fx("g",FR(p,q))} = ${F(a)} × ${p<0?"("+FR(p,q)+")":FR(p,q)} ${b<0?"−":"+"} ${F(Math.abs(b))}<br>${fx("g",FR(p,q))} = ${FR(a*p,q)} ${b<0?"−":"+"} {${Math.abs(b*q)}/${q}}<br>${fx("g",FR(p,q))} = ${good}`, sx:S_IMG}; }},
     {g:()=>{ const a=ri(2,9), x=ri(11,49)/10, good=F(r6(a*x)); return {q:`${fx("p")} = ${F(a)}${$x} (prix en € de ${$x} kg de fruits). Combien coûtent ${F(x)} kg ?`, c:ch4(good+" €",[F(r6(a+x))+" €",F(Math.round(x/a*100)/100)+" €",F(r6(a*x+1))+" €"]), rep:good+" €", ex:`<br>${fx("p",F(x))} = ${F(a)} × ${F(x)}<br>${fx("p",F(x))} = ${good}`, sx:S_IMG}; }} ]
}},
{nom:"Calculer un antécédent", schema:S_ANT, q:{
 1:[ {g:()=>{ const a=ri(2,9)*pick([1,-1]), x=nz(-9,9), y=a*x; return {q:`${fx("f")} = ${mono(a)}. Quel est l'antécédent de ${F(y)} ?`, c:ch4(F(x),[F(-x),F(a*y),F(y+a)]), rep:F(x), ex:`On résout ${mono(a)} = ${F(y)} : ${$x} = ${F(y)} ÷ ${P(a)} = ${F(x)}.`, sx:S_ANT}; }} ],
 2:[ {g:()=>{ const a=ri(2,9)*pick([1,-1]), b=nz(-9,9), x=nz(-9,9), y=a*x+b; return {q:`${fx("f")} = ${lin(a,b)}. Quel est l'antécédent de ${F(y)} ?`, c:ch4(F(x),[F(a*y+b),SV(y+b,a),F(-x)]), rep:F(x), ex:`${lin(a,b)} = ${F(y)}, donc ${mono(a)} = ${F(y-b)}, donc ${$x} = ${F(x)}.`, sx:S_ANT}; }} ],
 3:[ {g:()=>{ let a,b,y; do{ a=ri(2,9)*pick([1,-1]); b=nz(-9,9); y=nz(-20,20); }while((y-b)%a===0); const good=SV(y-b,a);
       return {q:`${fx("g")} = ${lin(a,b)}. Quel est l'antécédent de ${F(y)} ?`, c:ch4(good,[SV(y+b,a),SV(a,y-b),F(a*y+b)]), rep:good, ex:`${mono(a)} = ${F(y)} ${b<0?"+":"−"} ${F(Math.abs(b))} = ${F(y-b)}, donc ${$x} = ${good}.`, sx:S_ANT}; }} ]
}},
{nom:"Représentation graphique", schema:S_GR, q:{
 1:[ {q:"La représentation graphique d'une fonction linéaire est…", c:["une droite qui passe par l'origine","une droite qui ne passe jamais par l'origine","une courbe","une droite parallèle à l'axe des abscisses"], rep:"une droite qui passe par l'origine", ex:"f(0) = 0, donc la droite passe par l'origine du repère.", sx:S_GR},
     {g:()=>{ const a=nz(-9,9), b=nz(-9,9); const good=`(0 ; ${F(b)})`; return {q:`La droite qui représente ${fx("f")} = ${lin(a,b)} coupe l'axe des ordonnées au point…`, c:ch4(good,[`(0 ; ${F(a)})`,`(${F(b)} ; 0)`,`(1 ; ${F(b)})`]), rep:good, ex:`${fx("f","0")} = ${F(b)} : ${$b} = ${F(b)} est l'ordonnée à l'origine.`, sx:S_GR}; }} ],
 2:[ {g:()=>{ const a=nz(-9,9), b=nz(-9,9); const good=a>0?"elle « monte »":"elle « descend »"; return {q:`La droite qui représente ${fx("f")} = ${lin(a,b)}…`, c:["elle « monte »","elle « descend »","elle est parallèle à l'axe des abscisses"], rep:good, ex:`${$a} = ${F(a)} ${a>0?"&gt;":"&lt;"} 0.`, sx:S_GR}; }},
     {g:()=>{ const b=nz(-9,9); return {q:`Comment est la droite qui représente ${fx("f")} = ${F(b)} ?`, c:["parallèle à l'axe des abscisses","parallèle à l'axe des ordonnées","elle passe par l'origine"], rep:"parallèle à l'axe des abscisses", ex:`${$a} = 0 : la fonction est constante, toutes les images valent ${F(b)}.`, sx:S_GR}; }} ],
 3:[ {g:()=>{ const a=nz(-3,3), b=nz(-3,3); const fig=plot({x:[-3,3],y:[-6,6],u:30,v:16,ys:2,c:[D(a,b)],xl:"x",yl:"y",w:220,alt:"Une droite dans un repère"});
       const good=`${fx("f")} = ${lin(a,b)}`; return {q:"Quelle fonction est représentée par cette droite ?", fig, c:ch4(good,[`${fx("f")} = ${lin(b,a)}`,`${fx("f")} = ${lin(-a,b)}`,`${fx("f")} = ${lin(a,-b)}`]), rep:good, ex:`La droite coupe l'axe des ordonnées en ${F(b)} (${$b} = ${F(b)}). Quand ${$x} augmente de 1, l'ordonnée ${a>0?"augmente":"baisse"} de ${F(Math.abs(a))} (${$a} = ${F(a)}).`, sx:S_GR}; }},
     {g:()=>{ const a=nz(-9,9), b=nz(-9,9), x=nz(-5,5); const y=a*x+b, good="Oui", wrong=pick([1,-1]); const yy=pick([y,y+wrong]); return {q:`Le point de coordonnées (${F(x)} ; ${F(yy)}) est-il sur la droite qui représente ${fx("f")} = ${lin(a,b)} ?`, c:["Oui","Non"], rep:yy===y?"Oui":"Non", ex:`<br>${fx("f",F(x))} = ${F(a)} × ${P(x)} ${b<0?"−":"+"} ${F(Math.abs(b))}<br>${fx("f",F(x))} = ${F(y)}${yy===y?"":` ≠ ${F(yy)}`}`, sx:S_GR}; }} ]
}},
{nom:"Modéliser une situation", schema:S_LIN, q:{
 1:[ {g:()=>{ const p=ri(11,59)/10; const good=`${fx("p")} = ${F(p)}${$x}`; return {q:`Des pommes sont vendues ${F(p)} € le kg. ${$p} associe, à la masse ${$x} (en kg), le prix à payer (en €). Quelle est l'expression de ${$p} ?`, c:ch4(good,[`${fx("p")} = ${$x} + ${F(p)}`,`${fx("p")} = ${F(r6(p*10))}${$x}`,`${fx("p")} = ${F(p)}`]), rep:good, ex:`Le prix est proportionnel à la masse : on multiplie par ${F(p)}.`, sx:S_LIN}; }} ],
 2:[ {g:()=>{ const u=ri(3,15), fr=ri(2,9); const good=`${fx("p")} = ${u}${$x} + ${fr}`; return {q:`Un livre coûte ${u} € et les frais de port sont de ${fr} €, quel que soit le nombre de livres. ${$p} associe, au nombre ${$x} de livres, le prix payé (en €). Quelle est l'expression de ${$p} ?`, c:ch4(good,[`${fx("p")} = ${fr}${$x} + ${u}`,`${fx("p")} = ${u+fr}${$x}`,`${fx("p")} = ${u}${$x}`]), rep:good, ex:`${u} € par livre (${u}${$x}), plus ${fr} € de frais de port une seule fois.`, sx:S_AFF}; }} ],
 3:[ {g:()=>{ const u=ri(3,15), fr=ri(2,9); return {q:`Un livre coûte ${u} € et les frais de port sont de ${fr} €. La fonction qui donne le prix payé est-elle linéaire ?`, c:["Non, elle est affine mais pas linéaire","Oui","Non, elle est constante"], rep:"Non, elle est affine mais pas linéaire", ex:`${fx("p")} = ${u}${$x} + ${fr} : on ajoute ${fr}, le prix n'est pas proportionnel au nombre de livres.`, sx:S_AFF}; }},
     {q:"On considère un carré de côté x. La fonction qui donne son périmètre est…", c:["linéaire, de coefficient 4","affine, avec a = 1 et b = 4","constante","ni affine, ni linéaire"], rep:"linéaire, de coefficient 4", ex:"Périmètre = 4x : c'est une fonction linéaire de coefficient 4.", sx:S_LIN} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 19", duree:50, info:"Durée : 50 min · Calculatrice autorisée · Matériel : règle, crayon à papier",
comp:[
  ["CHERCHER","Je reconnais une fonction linéaire, affine ou constante.","Ex. 1 (3 points)"],
  ["MODÉLISER","J'associe une situation de proportionnalité à une fonction linéaire.","Ex. 2 (4 points)"],
  ["CALCULER","Je calcule des images et des antécédents.","Ex. 3 et 4 (7 points)"],
  ["REPRÉSENTER","J'associe une droite à l'expression de sa fonction.","Ex. 5 (3 points)"],
  ["RAISONNER","J'utilise un graphique pour comparer deux tarifs.","Ex. 6 (3 points)"]
],
exos:[
{t:"Reconnaître des fonctions", p:3, h:`<p>Pour chaque fonction, dis si elle est linéaire, affine (mais pas linéaire), constante, ou ni l'une ni l'autre. Si elle est affine, donne ${$a} et ${$b}.</p>
${cols([`${fx("f")} = −7${$x} + 2`,`${fx("g")} = 0,6${$x}`,`${fx("h")} = 3${sq($x)} − 1`,`${fx("k")} = −4`,`${fx("l")} = 8 − {1/2}${$x}`,`${fx("m")} = <span class="fr"><span>5</span><span>${$x}</span></span>`])}`,
 c:`${tabH(["Fonction","Nature",`${$a}`,`${$b}`],[[`${fx("f")} = −7${$x} + 2`,"affine","−7","2"],[`${fx("g")} = 0,6${$x}`,"linéaire","0,6","0"],[`${fx("h")} = 3${sq($x)} − 1`,"ni l'une ni l'autre","—","—"],[`${fx("k")} = −4`,"constante","0","−4"],[`${fx("l")} = 8 − {1/2}${$x}`,"affine",`−{1/2}`,"8"],[`${fx("m")} = <span class="fr"><span>5</span><span>${$x}</span></span>`,"ni l'une ni l'autre","—","—"]])}<p><i>(0,5 point par fonction)</i></p>`},
{t:"Une situation de proportionnalité", p:4, h:`<p>Des poires sont vendues 2,80 € le kilo. On note ${$p} la fonction qui, à la masse ${$x} de poires (en kg), associe le prix à payer (en €).</p>
<p>1) Donne l'expression de ${fx("p")}. La fonction ${$p} est-elle linéaire ? Justifie.</p>
<p>2) Calcule ${fx("p","3,5")}. Interprète ce résultat.</p>
<p>3) Calcule l'antécédent de 15,40 par ${$p}. Interprète ce résultat.</p>`,
 c:`<p>1) ${fx("p")} = 2,8${$x}. Oui : elle est de la forme ${$a}${$x}, de coefficient 2,8 (le prix est proportionnel à la masse). <i>(1 point)</i></p>
<p>2)</p><p class="calc">${fx("p","3,5")} = 2,8 × 3,5<br>${fx("p","3,5")} = 9,8</p><p>3,5 kg de poires coûtent 9,80 €. <i>(1,5 point)</i></p>
<p>3) On résout 2,8${$x} = 15,4 :</p><p class="calc">${$x} = 15,4 ÷ 2,8<br>${$x} = 5,5</p><p>Avec 15,40 €, on achète 5,5 kg de poires. <i>(1,5 point)</i></p>`},
{t:"Images et antécédents", p:4, h:`<p>Soit ${$f} la fonction affine définie par ${fx("f")} = −3${$x} + 7.</p>
<p>1) Calcule l'image de −2 par ${$f}.</p><p>2) Calcule ${fx("f","{2/3}")}.</p><p>3) Calcule l'antécédent de −8 par ${$f}.</p>`,
 c:`<p>1)</p>${calc([`${fx("f","−2")} = −3 × (−2) + 7`,`${fx("f","−2")} = 6 + 7`,`${fx("f","−2")} = 13`])}<p>L'image de −2 est 13. <i>(1 point)</i></p>
<p>2)</p>${calc([`${fx("f","{2/3}")} = −3 × {2/3} + 7`,`${fx("f","{2/3}")} = −2 + 7`,`${fx("f","{2/3}")} = 5`])}<p>L'image de {2/3} est 5. <i>(1,5 point)</i></p>
<p>3)</p>${calc([`−3${$x} + 7 = −8`,[`−3${$x} = −15`,"− 7"],[`${$x} = 5`,"÷ (−3)"]])}<p>L'antécédent de −8 est 5. <i>(1,5 point)</i></p>`},
{t:"Un programme de calcul", p:3, h:`${prog("",["Choisir un nombre","Multiplier ce nombre par 5","Soustraire 4"])}<p>On note ${$h} la fonction qui, au nombre choisi, associe le résultat du programme.</p>
<p>1) Donne l'expression de ${fx("h")}. Quelle est la nature de la fonction ${$h} ?</p><p>2) Quel résultat obtient-on en choisissant −3 ?</p><p>3) Quel nombre faut-il choisir pour obtenir 21 ?</p>`,
 c:`<p>1) ${fx("h")} = 5${$x} − 4 : c'est une fonction affine (${$a} = 5 et ${$b} = −4). <i>(1 point)</i></p>
<p>2)</p>${calc([`${fx("h","−3")} = 5 × (−3) − 4`,`${fx("h","−3")} = −15 − 4`,`${fx("h","−3")} = −19`])}<p>On obtient −19. <i>(1 point)</i></p>
<p>3) 5${$x} − 4 = 21, donc 5${$x} = 25, donc ${$x} = 5. Il faut choisir 5. <i>(1 point)</i></p>`},
{t:"Associer droites et fonctions", p:3, h:`${plot({x:[-3,4],y:[-4,5],u:40,v:30,c:[D(2,-1,{col:RED}),D(-1,3,{col:BLUE}),D(0.5,0,{col:GRN})],lab:[{x:2,y:4.6,t:"(d1)",col:RED},{x:-1.2,y:4.7,t:"(d2)",col:BLUE},{x:3.4,y:2.3,t:"(d3)",col:GRN}],xl:"x",yl:"y",alt:"Trois droites : (d1) monte vite et coupe l'axe des ordonnées en −1 ; (d2) descend et le coupe en 3 ; (d3) passe par l'origine et monte doucement"})}
<p>Associe chaque fonction à sa droite. Justifie à chaque fois.</p>${cols([`${fx("f")} = −${$x} + 3`,`${fx("g")} = 0,5${$x}`,`${fx("h")} = 2${$x} − 1`])}`,
 c:`<p>${$f} → (d2) : ${$a} = −1 &lt; 0, la droite descend, et elle coupe l'axe des ordonnées en 3. <i>(1 point)</i></p>
<p>${$g} → (d3) : fonction linéaire, la droite passe par l'origine. <i>(1 point)</i></p>
<p>${$h} → (d1) : ${$a} = 2 &gt; 0, la droite monte, et elle coupe l'axe des ordonnées en −1. <i>(1 point)</i></p>`},
{t:"Comparer deux tarifs", p:3, h:`<p>À la piscine, le tarif A coûte 6 € l'entrée. Le tarif B coûte 40 € d'abonnement pour l'année, puis 2 € l'entrée.</p>
<p>On note ${$x} le nombre d'entrées, ${fx("f")} le prix avec le tarif A et ${fx("g")} le prix avec le tarif B.</p>
${plot({x:[0,16],y:[0,100],u:30,v:2.6,gy:10,ys:20,xs:2,c:[D(6,0,{a:0,b:100/6,col:RED}),D(2,40,{col:BLUE})],lab:[{x:13.5,y:92,t:"(D1)",col:RED},{x:15,y:62,t:"(D2)",col:BLUE}],xl:"Nombre d'entrées",yl:"Prix (en €)",alt:"Deux droites : (D1) part de l'origine et monte vite ; (D2) part de 40 et monte doucement ; elles se coupent au point (10 ; 60)"})}
<p>1) Donne ${fx("f")} et ${fx("g")}. Quelle droite représente chaque tarif ?</p><p>2) Avec 8 entrées, quel tarif est le plus avantageux ?</p><p>3) À partir de combien d'entrées le tarif B est-il le plus avantageux ?</p>`,
 c:`<p>1) ${fx("f")} = 6${$x} (droite (D1), elle passe par l'origine) et ${fx("g")} = 2${$x} + 40 (droite (D2), elle coupe l'axe des ordonnées en 40). <i>(1 point)</i></p>
<p>2)</p><div class="calcs"><p class="calc">${fx("f","8")} = 6 × 8<br>${fx("f","8")} = 48 €</p><p class="calc">${fx("g","8")} = 2 × 8 + 40<br>${fx("g","8")} = 56 €</p></div><p>Le tarif A est le plus avantageux. <i>(1 point)</i></p>
<p>3) Les droites se coupent au point (10 ; 60) : pour 10 entrées, les deux tarifs coûtent 60 €. Après, la droite (D2) est en dessous : le tarif B est le plus avantageux à partir de 11 entrées. <i>(1 point)</i></p>`}
]}
};
window.FN19={F,P,X,fx,FR,SV,mono,lin,calc,cols,prog,sq,vt,tabH,plot,red,isDec,gcd,RED,BLUE,GRN,D,nz,r6};
})();
