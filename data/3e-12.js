/* 3e — Chapitre 12 : Généralités sur les fonctions
   Sources : « Cours complété » (Notion de fonction, D6) et la fiche « Progression » de M. Staal (version la plus récente et la plus complète).
   Toutes les courbes sont dessinées en SVG à partir de formules exactes (droites, paraboles, polynômes,
   lignes brisées ou splines monotones passant par des points choisis) : les lectures demandées tombent sur des points exacts. */
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
/* calcul en chaîne : chaque étape sur une nouvelle ligne qui commence par « f(2) = » */
const ch=(lhs,steps)=>`<p class="calc">${steps.map(s=>lhs+" = "+s).join("<br>")}</p>`;
const prog=(titre,L)=>`<div class="pgc">${titre?`<b>${titre}</b>`:""}<ul>${L.map(s=>`<li>${s}</li>`).join("")}</ul></div>`;
const sq=v=>`${v}<sup>2</sup>`;
/* tableau de valeurs : en-tête de ligne + valeurs */
const vt=(h1,xs,h2,ys)=>`<div class="scroll"><table class="std"><tbody><tr><th>${h1}</th>${xs.map(v=>`<td>${typeof v==="number"?F(v):v}</td>`).join("")}</tr><tr><th>${h2}</th>${ys.map(v=>`<td>${typeof v==="number"?F(v):v}</td>`).join("")}</tr></tbody></table></div>`;
const tabH=(head,rows)=>`<div class="scroll"><table class="std"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;

/* ------------------------------------------------------------------
   Fonctions définies par des points : ligne brisée, spline monotone (Fritsch–Carlson)
------------------------------------------------------------------ */
function brk(K){ return x=>{ for(let i=0;i<K.length-1;i++){ const [a,u]=K[i],[b,v]=K[i+1]; if(x>=a-1e-12&&x<=b+1e-12) return u+(v-u)*(x-a)/(b-a); } return NaN; }; }
function spline(K){ const n=K.length, xs=K.map(k=>k[0]), ys=K.map(k=>k[1]), d=[], m=[];
  for(let i=0;i<n-1;i++) d.push((ys[i+1]-ys[i])/(xs[i+1]-xs[i]));
  m[0]=d[0]; m[n-1]=d[n-2]; for(let i=1;i<n-1;i++) m[i]= d[i-1]*d[i]<=0 ? 0 : (d[i-1]+d[i])/2;
  for(let i=0;i<n-1;i++){ if(d[i]===0){ m[i]=0; m[i+1]=0; continue; } const a=m[i]/d[i], b=m[i+1]/d[i], s=a*a+b*b; if(s>9){ const t=3/Math.sqrt(s); m[i]=t*a*d[i]; m[i+1]=t*b*d[i]; } }
  return x=>{ if(x<xs[0]-1e-9||x>xs[n-1]+1e-9) return NaN; let i=0; while(i<n-2&&x>xs[i+1]) i++; const h=xs[i+1]-xs[i], t=(x-xs[i])/h, t2=t*t, t3=t2*t;
    return (2*t3-3*t2+1)*ys[i]+(t3-2*t2+t)*h*m[i]+(-2*t3+3*t2)*ys[i+1]+(t3-t2)*h*m[i+1]; }; }
/* nombre de solutions de f(x) = y sur [a ; b] (balayage fin) et valeurs approchées */
function sols(f,a,b,y,N=4000){ const r=[]; let px=a, pv=f(a)-y; if(Math.abs(pv)<1e-9) r.push(a);
  for(let i=1;i<=N;i++){ const x=a+(b-a)*i/N, v=f(x)-y; if(Math.abs(v)<1e-9){ if(!r.length||x-r[r.length-1]>(b-a)/200) r.push(x); }
    else if(pv*v<0 && Math.abs(pv)>1e-9){ r.push(px+(x-px)*pv/(pv-v)); } px=x; pv=v; }
  return r.map(v=>Math.round(v*1000)/1000).filter((v,i,A)=>i===0||Math.abs(v-A[i-1])>(b-a)/200); }

/* ------------------------------------------------------------------
   Repère avec quadrillage et courbes
   o.x=[xmin,xmax], o.y=[ymin,ymax], o.u = px par unité (x), o.v = px par unité (y)
   o.c = [{f, a, b, col}] courbes · o.p = [{x,y,t,col,dx,dy}] points (croix) · o.proj = [[x,y]] pointillés vers les axes
   o.xs, o.ys = pas des nombres écrits · o.xl, o.yl = noms des axes · o.title
------------------------------------------------------------------ */
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
  return s+"</svg>"; }
window.FN12={F,P,X,fx,FR,SV,quo,mono,lin,OP,calc,ch,cols,prog,sq,vt,tabH,brk,spline,sols,plot,red,isDec,gcd,RED,BLUE,GRN};

/* ===================== fonctions des documents ===================== */
const fC=x=>2*x-3;                                   /* cours : f(x) = 2x − 3 */
const gC=x=>1+x*(x+1)*(x-2)*(103/252-41*x/378);       /* cours : g(−1,5) = −0,5 ; g(−1) = g(0) = g(2) = 1 ; g(3) = 2 */
const fA3=spline([[-7,-2.5],[-6.5,0],[-5.5,2.5],[-5,2],[-4,0],[-2,-4],[0,-2.5],[1,0],[2,3]]);
const gE5=spline([[-4.5,2.5],[-3,0],[-2,-1],[-1,0],[0,2],[0.6,2.2],[2,1],[2.5,0],[3,-1],[3.3,-1.6]]);
const pE6=spline([[-7,-2],[-5.5,2.5],[-4,0],[-3,1],[-2,2],[-1,0],[0,-0.5],[1,-1],[2,-2],[3,2],[4,1]]);
const gE7K=[[-1.5,1],[-1,3],[0,3]], gE7S=spline([[0,3],[0.5,0],[1,-1],[1.5,2]]);
const gE7=x=>x<=0?brk(gE7K)(x):gE7S(x);
const fE12K=[[-5,-3],[-3,-2],[-1,0],[0,1],[2,2],[3,1],[4,-1],[6,0]], fE12=brk(fE12K);
window.FN12.fns={fC,gC,fA3,gE5,pE6,gE7,fE12};

const G_COURS_F=plot({x:[-2,4],y:[-5,4],u:42,v:34,c:[{f:fC,a:-1,b:3.5}],p:[{x:-1,y:-5,t:"A",dx:-22,dy:4},{x:2,y:1,t:"B",dx:10,dy:16}],xl:"x",yl:`${fx("f")}`,title:"Courbe représentative de la fonction f",alt:"Droite représentant f(x) = 2x − 3, passant par A(−1 ; −5) et B(2 ; 1)"});
const G_COURS_G=o=>plot({x:[-2,3.5],y:[-1,2.5],u:70,v:60,gs:0.5,xs:1,ys:1,c:[{f:gC,a:-1.5,b:3,ends:1}],p:o?[{x:1,y:2,t:"A",col:BLUE},{x:0,y:1,t:"B",col:BLUE,dx:8,dy:-10}]:[],proj:o?[[-1.5,-0.5],[3,2]]:[],xl:"x",yl:"",alt:"Courbe de la fonction g"});
const G_A3=(pts)=>plot({x:[-7.5,3],y:[-4.5,4],u:38,v:34,c:[{f:fA3,a:-7,b:2,ends:1}],p:pts||[],xl:"x",yl:"image de x",alt:"Courbe représentative de la fonction f de l'activité 3"});
const G_E5=plot({x:[-5,3.5],y:[-2,3],u:46,v:46,gs:0.5,xs:1,ys:1,c:[{f:gE5,a:-4.5,b:3.3}],xl:"x",yl:"image de x",alt:"Courbe représentative de la fonction g de l'exercice 5"});
const G_E6=plot({x:[-7.5,4.5],y:[-2.5,3],u:40,v:40,c:[{f:pE6,a:-7,b:4,ends:1}],xl:"x",yl:"",alt:"Courbe représentative de la fonction p"});
const G_E7=plot({x:[-2,2],y:[-1.5,3.5],u:80,v:50,gs:0.5,gy:1,xs:1,ys:1,c:[{f:gE7,a:-1.5,b:1.5,ends:1}],p:[[-1.5,1],[-1,3],[0,3],[0.5,0],[1,-1],[1.5,2]].map(([x,y])=>({x,y})),xl:"x",yl:"image de x",alt:"Courbe de la fonction g de l'exercice 7"});
const G_E12=plot({x:[-5.5,6.5],y:[-3.5,2.5],u:40,v:40,c:[{f:fE12,a:-5,b:6}],p:fE12K.map(([x,y])=>({x,y})),xl:"x",yl:fx("f"),title:"Courbe représentative de la fonction f",alt:"Ligne brisée représentant la fonction f de l'exercice 8"});
const T1=[[0,3],[2,3.8],[5,6.4],[8,7]];
const G_T1=plot({x:[0,8.5],y:[0,8],u:42,v:32,c:[{f:brk(T1),a:0,b:8}],p:T1.map(([x,y])=>({x,y})),xl:"Âge (mois)",yl:"Poids (kg)",title:"Le poids d'un bébé en fonction de son âge",alt:"Graphique du tableau 1"});
const G_T2=plot({x:[-2.5,8.5],y:[-10,26],u:40,v:7,gy:5,ys:5,c:[{f:x=>3*x,a:-2,b:8}],p:[[-2,-6],[4,12],[5,15],[8,24]].map(([x,y])=>({x,y})),xl:"Nombre",yl:"Son triple",title:"Le triple d'un nombre",alt:"Graphique du tableau 2"});
const G_T3=plot({x:[-3.5,3.5],y:[-5,7],u:52,v:30,c:[{f:x=>x*x-4,a:-3.3,b:3.3}],p:[[-3,5],[0,-4],[1,-3],[3,5],[-2,0],[-1,-3],[2,0]].map(([x,y])=>({x,y})),xl:"Départ",yl:"Résultat",title:"Résultat du programme",alt:"Graphique du tableau 3 : courbe de x² − 4"});
const G_A2=plot({x:[-4,4],y:[-4.5,7.5],u:44,v:28,c:[{f:x=>x*x-4,a:-3.4,b:3.4}],xl:"x",yl:"",alt:"Courbe de la fonction h : x ↦ x² − 4"});
const G_E1f=plot({x:[-3.5,3.5],y:[-5,10],u:46,v:24,c:[{f:x=>-2*x+3,a:-3.5,b:3.5}],p:[[-3,9],[-2,7],[0,3],[3,-3]].map(([x,y])=>({x,y})),xl:"Départ",yl:"Résultat",title:"Courbe représentative de f",alt:"Droite représentant f(x) = −2x + 3"});
const G_E1g=plot({x:[-5.5,2],y:[-4,7],u:48,v:30,c:[{f:x=>(x+2)**2-3,a:-5.2,b:1.2}],p:[[-5,6],[-2,-3],[0,1],[1,6],[-4,1],[-3,-2],[-1,-2]].map(([x,y])=>({x,y})),xl:"Départ",yl:"Résultat",title:"Courbe représentative de g",alt:"Parabole représentant g(x) = (x + 2)² − 3"});
const G_E1h=plot({x:[0,6.5],y:[0,26],u:52,v:9,gy:2,ys:4,c:[{f:x=>4*x,a:0,b:6.5}],p:[[2,8],[5,20],[6,24]].map(([x,y])=>({x,y})),xl:"Côté (cm)",yl:"Périmètre (cm)",title:"Périmètre du carré",alt:"Droite représentant h(x) = 4x"});
const ASSO=[x=>4*x, x=>2*x*x+1, x=>x**3-1].map((f,i)=>plot({x:[-3,4],y:[-3,4.5],u:28,v:28,c:[{f}],xl:"x",title:`Courbe ${i+1}`,alt:`Courbe ${i+1}`}));

/* ===================== schémas ===================== */
const S_VOC=sch("Image et antécédent",`<p class="calc">antécédent ${$x} → ${$f} → image ${fx("f")}</p><p class="calc">${fx("f","3")} = 7 : l'image de 3 est 7 ; 3 est un antécédent de 7.</p><p class="schN">Un nombre a <b>une seule</b> image, mais un nombre peut avoir plusieurs antécédents.</p>`);
const S_IMG=sch("Calculer une image",calc([`${fx("f")} = 2${$x} − 3`,`${fx("f","−8")} = 2 × (−8) − 3`,`${fx("f","−8")} = −16 − 3`,`${fx("f","−8")} = −19`])+`<p class="schN">Je remplace ${$x} par le nombre, entre parenthèses s'il est négatif.</p>`);
const S_TAB=sch("Lire un tableau de valeurs",vt($x,[-1,0,1,3],fx("f"),[-5,-3,-1,3])+`<p class="schN">1<sup>re</sup> ligne : les antécédents. 2<sup>e</sup> ligne : les images. Ici ${fx("f","1")} = −1.</p>`);
const S_CRB=sch("Lire une courbe",G_COURS_F.replace(/width="\d+"/,'width="260"')+`<p class="schN">Les antécédents se lisent sur l'axe des abscisses, les images sur l'axe des ordonnées. Le point B(2 ; 1) est sur la courbe : ${fx("f","2")} = 1.</p>`);
const S_ANT=sch("Calculer un antécédent",calc([`${fx("f","a")} = −8`,`2${X("a")} − 3 = −8`,[`2${X("a")} = −5`,"+ 3"],[`${X("a")} = −2,5`,"÷ 2"]])+`<p class="schN">Je cherche le nombre de départ : je résous une équation.</p>`);

const ex3T=[[-1,2],[0,5],[1,-1],[2,5],[3,0],[4,3]];
const e14=[-3,-2,-1,0,1,2,3];

CH["3e-12"] = {
intro:"Comprendre ce qu'est une fonction, passer d'une représentation à l'autre (formule, tableau de valeurs, courbe), lire et calculer des images et des antécédents, et utiliser la notation f(x).",
savoir:[
  "connaître le vocabulaire : fonction, image, antécédent ;",
  `utiliser les notations ${$f} : ${$x} ↦ … et ${fx("f")} = … ;`,
  "compléter et lire un tableau de valeurs ;",
  "construire et lire une courbe représentative (images et antécédents) ;",
  "calculer l'image d'un nombre ;",
  "calculer un antécédent en résolvant une équation."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Définition d'une fonction", h:`
  <div class="retenir" data-l="Définition"><p>Une <b>fonction</b> est un processus qui, à un <b>nombre</b>, fait correspondre un <b>unique autre nombre</b>.</p>
   ${tabH(["Nombre de départ","","Nombre correspondant"],[["<b>Antécédent</b>","→ Fonction →","<b>Image</b>"]])}</div>
  <p><b>Exemple :</b> on considère le programme de calcul suivant :</p>${prog("",["Choisir un nombre","Multiplier par 2","Soustraire 3"])}
  <p>On définit la fonction ${$f} qui, à tout nombre ${$x}, associe le résultat de ce programme de calcul.</p>`},
{k:"II", t:"Différentes représentations d'une fonction", h:`
  <div class="retenir" data-l="À retenir"><p>Quand deux grandeurs mesurables dépendent l'une de l'autre, il existe une <b>fonction</b> qui relie ces deux grandeurs. Elle peut être représentée par :</p>
   <p><b>une relation algébrique</b> (une formule) qui permet de passer d'une grandeur à l'autre ;</p><p><b>un tableau de valeurs</b> qui associe deux nombres de ces deux grandeurs ;</p><p><b>une courbe</b> qui relie ces deux grandeurs dans un graphique.</p></div>
  <h4>a) Représenter une fonction par une relation algébrique</h4>
  <div class="retenir" data-l="Notations"><p>Pour désigner la fonction ${$f}, on peut écrire :</p>
   <p class="calc">${$f} : ${$x} ↦ 2${$x} − 3 &emsp; se lit « la fonction ${$f} qui, à ${$x}, associe 2${$x} − 3 »</p>
   <p class="calc">ou &emsp;${fx("f")} = 2${$x} − 3 &emsp; se lit « ${$f} de ${$x} est égal à 2${$x} − 3 »</p>
   <p class="calc">antécédent ${$x} → ${$f} → image ${fx("f")}</p></div>
  <div class="attention"><b>Remarque :</b> ${fx("f")} désigne un <b>nombre</b> (l'image de ${$x}) mais ${$f} désigne une <b>fonction</b> : ${$f} n'est pas un nombre.</div>
  <h4>b) Représenter une fonction par un tableau de valeurs</h4>
  <div class="retenir" data-l="Définition"><p>Les correspondances entre antécédents et images par la fonction ${$f} peuvent être résumées dans un tableau appelé <b>tableau de valeurs</b>.</p></div>
  <p><b>Exemple :</b></p>${vt($x+" (les antécédents)",[-1,0,1,3],`Image de ${$x} par la fonction ${$f} (les images)`,[-5,-3,-1,3])}
  ${cols([`<b>Calcul de l'image de −1 :</b><br>${fx("f","−1")} = 2 × (−1) − 3<br>${fx("f","−1")} = −2 − 3<br>${fx("f","−1")} = −5`,`<b>Calcul de l'image de 0 :</b><br>${fx("f","0")} = 2 × 0 − 3<br>${fx("f","0")} = 0 − 3<br>${fx("f","0")} = −3`])}
  <h4>c) Représenter une fonction par une courbe</h4>
  <div class="retenir" data-l="Définition"><p>L'ensemble des points de coordonnées (${$x} ; image de ${$x}) forme une courbe appelée <b>courbe représentative de la fonction ${$f}</b>.</p><p>Les <b>antécédents</b> se lisent sur <b>l'axe des abscisses</b>.</p><p>Les <b>images</b> se lisent sur <b>l'axe des ordonnées</b>.</p></div>
  ${G_COURS_F}
  <p><b>Exemples :</b></p><p>L'image de 2 est 1.</p><p>L'image de 0 est −3.</p><p>L'antécédent de 1 est 2.</p><p>L'antécédent de −5 est −1.</p><p>Les points A(−1 ; −5) et B(2 ; 1) appartiennent à la courbe.</p>
  <p><b>Exercice :</b> voici la courbe représentative de la fonction ${$g}.</p>${G_COURS_G(0)}
  <p><b>a)</b> L'image de −1,5 est …</p><p><b>b)</b> L'image de 0 est …</p><p><b>c)</b> L'image de 2 est …</p><p><b>d)</b> L'antécédent de 2 est …</p><p><b>e)</b> 1 possède … antécédents qui sont …</p><p><b>f)</b> Le point A(1 ; 2) appartient-il à la courbe représentative de ${$g} ?</p><p><b>g)</b> Le point B(0 ; 1) appartient-il à la courbe représentative de ${$g} ?</p>
  <details><summary>Voir la correction</summary><div class="corr"><p><b>a)</b> L'image de −1,5 est −0,5.</p><p><b>b)</b> L'image de 0 est 1.</p><p><b>c)</b> L'image de 2 est 1.</p><p><b>d)</b> L'antécédent de 2 est 3.</p><p><b>e)</b> 1 possède 3 antécédents qui sont −1, 0 et 2.</p><p><b>f)</b> Non : l'image de 1 n'est pas 2.</p><p><b>g)</b> Oui : l'image de 0 est 1.</p>${G_COURS_G(1)}</div></details>`},
{k:"III", t:"Calculs d'images et d'antécédents", h:`
  <p><b>Exemple :</b> ${fx("f")} = 2${$x} − 3.</p>
  <div class="retenir" data-l="Méthode"><p><b>Calculer l'image de −8 par la fonction ${$f}</b> : on remplace ${$x} par −8.</p>
   <p class="calc">${fx("f","−8")} = 2 × (−8) − 3<br>${fx("f","−8")} = −16 − 3<br>${fx("f","−8")} = −19</p><p>L'image de −8 par la fonction ${$f} est −19.</p></div>
  <div class="retenir" data-l="Méthode"><p><b>Calculer l'antécédent de −8 par la fonction ${$f}</b> : je note « ${X("a")} » l'antécédent de −8. Donc ${fx("f","<i>a</i>")} = −8 : on résout une équation.</p>
   ${calc([`2 × ${X("a")} − 3 = −8`,[`2 × ${X("a")} = −5`,"+ 3"],[`${X("a")} = −2,5`,"÷ 2"]])}<p>L'antécédent de −8 par la fonction ${$f} est −2,5.</p></div>
  <p><i>Vérification : 2 × (−2,5) − 3 = −8.</i></p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Tableaux de valeurs, formules et courbes", e:[
  {n:"Activité 1", t:"Tableaux de valeurs", w:"Sur ton cahier", h:`<p>Cinq tableaux sont représentés ci-dessous. Deux d'entre eux sont déjà complétés.</p><p>Complète les tableaux 2, 3 et 4. Note chaque calcul en détaillant les étapes. <i>(Calculatrice autorisée)</i></p>
   <p><b>Tableau 1 : le poids (en kg) d'un bébé en fonction de son âge (en mois)</b></p>${vt("Âge (en mois)",[0,2,5,8],"Poids (en kg)",[3,3.8,6.4,7])}
   <p><b>Tableau 2 : la valeur du triple en fonction du nombre choisi</b></p>${vt("Nombre choisi",[-2,4,5,8],"Son triple",["","","",""])}
   <p><b>Tableau 3 : le résultat d'un programme de calcul en fonction du nombre de départ</b></p>${prog("Programme de calcul",["Choisir un nombre","Élever ce nombre au carré","Soustraire 4"])}${vt("Nombre de départ",[-3,0,1,3],"Résultat du programme",["","","",""])}
   <p><b>Tableau 4 : l'aire d'un carré (en cm²) en fonction de la longueur de son côté (en cm)</b></p>${vt("Longueur du côté (en cm)",[3,4,5,6],"Aire du carré (en cm²)",["","","",""])}
   <p><b>Tableau 5 : la distance parcourue (en km) lors d'une randonnée en fonction du temps (en h)</b></p>${vt("Temps (en h)",[1,2,4,6],"Distance parcourue (en km)",[4,6,5,18])}
   <p><b>Suite de l'activité – Courbe :</b> pour les tableaux 1, 2 et 3, construis, au crayon de bois, la courbe correspondante.</p>
   <div class="retenir" data-l="Méthode"><p>Placer le nom des axes au bon endroit : les <b>antécédents</b> sont toujours sur l'<b>axe des abscisses</b>, les <b>images</b> toujours sur l'<b>axe des ordonnées</b>.</p><p>Placer les points de coordonnées (antécédent ; image).</p><p>Relier les points. Dans certains cas, on peut calculer des points supplémentaires pour avoir un tracé plus précis.</p><p>Donner un nom au graphique.</p></div>`,
   c:`<p><b>Tableau 2 :</b> 3 × (−2) = −6 · 3 × 4 = 12 · 3 × 5 = 15 · 3 × 8 = 24</p>${vt("Nombre choisi",[-2,4,5,8],"Son triple",[-6,12,15,24])}
   <p><b>Tableau 3 :</b></p>${cols([calc(["A = (−3)² − 4","A = 9 − 4","A = 5"]),calc(["B = 0² − 4","B = −4"]),calc(["C = 1² − 4","C = 1 − 4","C = −3"]),calc(["D = 3² − 4","D = 9 − 4","D = 5"])])}${vt("Nombre de départ",[-3,0,1,3],"Résultat du programme",[5,-4,-3,5])}
   <p><b>Tableau 4 :</b> 3² = 9 · 4² = 16 · 5² = 25 · 6² = 36</p>${vt("Longueur du côté (en cm)",[3,4,5,6],"Aire du carré (en cm²)",[9,16,25,36])}
   <p><b>Courbes :</b></p><div class="figs">${G_T1}${G_T2}</div><p>Pour le tableau 3, on a ajouté les points (−2 ; 0), (−1 ; −3) et (2 ; 0) pour un tracé plus précis : la courbe n'est pas une droite.</p>${G_T3}`},
  {n:"Exercice 1", t:"Représenter des fonctions sous ces 3 aspects", w:"Sur ton cahier", h:`<p>Voici les fonctions ${$f}, ${$g} et ${$h}. Pour chacune d'elles, écris la formule, complète le tableau et construis sa courbe. <i>(Calculatrice autorisée)</i></p>
   <p><b>1)</b> ${$f} est la fonction qui, à tout nombre ${$x}, fait correspondre le résultat de ce programme de calcul :</p>${prog("Programme de calcul",["Choisir un nombre","Le multiplier par (−2)","Ajouter 3"])}
   <p><b>a)</b> Donne la formule (la relation algébrique) de cette fonction : ${$f} : ${$x} ↦ …</p><p><b>b)</b> Complète le tableau de valeurs.</p>${vt("Nombre de départ",[-3,-2,0,3],"Résultat du programme",["","","",""])}<p><b>c)</b> Construis la courbe représentative de la fonction ${$f} (donne un nom aux axes). Écris le calcul détaillé pour trouver le résultat du programme avec −3.</p>
   <p><b>2)</b> ${$g} est la fonction qui, à tout nombre ${$x}, fait correspondre le résultat de ce programme de calcul :</p>${prog("Programme de calcul",["Choisir un nombre","Lui ajouter 2","Élever le résultat au carré","Soustraire 3"])}
   <p><b>a)</b> Donne la formule de cette fonction.</p><p><b>b)</b> Complète le tableau de valeurs.</p>${vt("Nombre de départ",[-5,-2,0,1],"Résultat du programme",["","","",""])}<p><b>c)</b> Construis la courbe représentative de la fonction ${$g}. Écris le calcul détaillé pour trouver le résultat du programme avec −5.</p>
   <p><b>3)</b> ${$h} est la fonction qui, à la longueur ${$x} du côté d'un carré, associe son périmètre.</p><p><b>a)</b> Donne la relation algébrique de cette fonction.</p><p><b>b)</b> Complète le tableau de valeurs.</p>${vt("Côté du carré (en cm)",[2,5,6],"Périmètre (en cm)",["","",""])}<p>Écris le calcul détaillé pour trouver le périmètre d'un carré de côté 2.</p><p><b>c)</b> Construis, au crayon de bois, la courbe représentative de la fonction ${$h}.</p>`,
   c:`<p><b>1) a)</b> ${$f} : ${$x} ↦ −2${$x} + 3</p><p><b>b)</b></p>${vt("Nombre de départ",[-3,-2,0,3],"Résultat du programme",[9,7,3,-3])}<p class="calc">A = −3 × (−2) + 3<br>A = 6 + 3<br>A = 9</p><p>Le résultat du programme avec −3 est 9.</p><p><b>c)</b> Les points sont alignés : la courbe est une droite.</p>${G_E1f}
   <p><b>2) a)</b> ${$g} : ${$x} ↦ ${sq("("+$x+" + 2)")} − 3</p><p><b>b)</b></p>${vt("Nombre de départ",[-5,-2,0,1],"Résultat du programme",[6,-3,1,6])}<p class="calc">B = (−5 + 2)² − 3<br>B = (−3)² − 3<br>B = 9 − 3<br>B = 6</p><p>Le résultat du programme avec −5 est 6.</p><p><b>c)</b> On a ajouté les points (−4 ; 1), (−3 ; −2) et (−1 ; −2) pour un tracé plus précis.</p>${G_E1g}
   <p><b>3) a)</b> ${$h} : ${$x} ↦ 4${$x}</p><p><b>b)</b></p>${vt("Côté du carré (en cm)",[2,5,6],"Périmètre (en cm)",[8,20,24])}<p class="calc">C = 4 × 2<br>C = 8</p><p>Le périmètre d'un carré de côté 2 cm est 8 cm.</p><p><b>c)</b></p>${G_E1h}
   <p><b>BILAN :</b> une fonction peut être représentée par un tableau de valeurs, par une courbe ou par une formule.</p>`}
 ]},
{t:"Lire des images et des antécédents dans un tableau", e:[
  {n:"Activité 2", t:"Lecture d'antécédents et d'images", w:"Sur ton cahier", h:`<p><b>1)</b> Revenons au tableau 3 de l'activité 1. ${$h} est la fonction qui, à un nombre, associe le résultat du programme : ${$h} : ${$x} ↦ ${sq($x)} − 4.</p>
   ${vt("Nombre de départ",[-3,0,1,3],"Résultat du programme",[5,-4,-3,5])}${G_A2}
   <p>À l'aide du tableau, complète les phrases suivantes :</p><p><b>a)</b> L'image de 0 est …</p><p><b>b)</b> L'antécédent de −4 est …</p><p><b>c)</b> L'image de −3 est …</p><p><b>d)</b> L'antécédent de −3 est …</p><p><b>e)</b> L'image de 3 est …</p><p><b>f)</b> 5 a pour antécédent(s) …</p>
   <p><b>2)</b> Réponds à ces deux questions :</p><p><b>a)</b> À un antécédent, peut-on associer une ou plusieurs images ?</p><p><b>b)</b> À une image, peut-on associer un ou plusieurs antécédents ?</p>`,
   c:`<p><b>1) a)</b> L'image de 0 est −4.</p><p><b>b)</b> L'antécédent de −4 est 0.</p><p><b>c)</b> L'image de −3 est 5.</p><p><b>d)</b> L'antécédent de −3 est 1 (dans le tableau).</p><p><b>e)</b> L'image de 3 est 5.</p><p><b>f)</b> 5 a pour antécédents −3 et 3.</p>
   <p><b>2) a)</b> À un antécédent, on associe <b>une seule</b> image. · <b>b)</b> À une image, on peut associer <b>un ou plusieurs</b> antécédents (5 en a deux : −3 et 3).</p><p><i>Remarque : sur la courbe, on voit que −3 a aussi pour antécédent −1, car (−1)² − 4 = −3.</i></p>`},
  {n:"Exercice 2", t:"Lectures d'antécédents et d'images", w:"Sur ton cahier", h:`<p>Revenons au tableau 5 de l'activité 1 : la distance parcourue (en km) lors d'une randonnée en fonction du temps (en h).</p>${vt("Temps (en h)",[1,2,4,6],"Distance parcourue (en km)",[4,6,5,18])}
   <p>À l'aide du tableau, complète les phrases suivantes :</p><p><b>a)</b> L'image de 1 est …</p><p><b>b)</b> L'antécédent de 18 est …</p><p><b>c)</b> L'image de 4 est …</p><p><b>d)</b> L'antécédent de 4 est …</p><p><b>e)</b> L'image de 6 est …</p><p><b>f)</b> L'antécédent de 6 est …</p>`,
   c:`<p>On lit le tableau : la 1<sup>re</sup> ligne donne les antécédents, la 2<sup>e</sup> ligne les images.</p><p><b>a)</b> L'image de 1 est 4.</p><p><b>b)</b> L'antécédent de 18 est 6.</p><p><b>c)</b> L'image de 4 est 5.</p><p><b>d)</b> L'antécédent de 4 est 1.</p><p><b>e)</b> L'image de 6 est 18.</p><p><b>f)</b> L'antécédent de 6 est 2.</p>`},
  {n:"Exercice 3", t:"Lectures d'antécédents et d'images", w:"Sur ton cahier", h:`<p>${$g} est la fonction définie par le tableau suivant :</p>${vt($x,ex3T.map(t=>t[0]),`Image de ${$x} par ${$g}`,ex3T.map(t=>t[1]))}
   <p>Complète les phrases suivantes :</p><p><b>a)</b> L'image de 3 est …</p><p><b>b)</b> L'antécédent de 3 est …</p><p><b>c)</b> L'antécédent de 0 est …</p><p><b>d)</b> L'image de 0 est …</p><p><b>e)</b> L'antécédent de −1 est …</p><p><b>f)</b> L'image de 2 est …</p><p><b>g)</b> … possède deux antécédents qui sont … et …</p>`,
   c:`<p><b>a)</b> L'image de 3 est 0.</p><p><b>b)</b> L'antécédent de 3 est 4.</p><p><b>c)</b> L'antécédent de 0 est 3.</p><p><b>d)</b> L'image de 0 est 5.</p><p><b>e)</b> L'antécédent de −1 est 1.</p><p><b>f)</b> L'image de 2 est 5.</p><p><b>g)</b> 5 possède deux antécédents qui sont 0 et 2.</p>`}
 ]},
{t:"Calculer des images", e:[
  {n:"Exercice 4", t:"Relation algébrique et calculs d'image (sans calculatrice)", w:"Sur ton cahier", h:`<p><b>1 –</b> La fonction ${$h} est définie par ${$h} : ${$x} ↦ 3${$x} + 5.</p><p><b>a)</b> Calcule l'image de 2. Tu détailleras tes calculs.</p><p><b>b)</b> Calcule l'image de −4.</p>
   <p><b>2 –</b> Soit ${X("u")} la fonction définie par ${X("u")} : ${$x} ↦ 2${sq($x)} + 1.</p><p><b>a)</b> Calcule l'image de 3.</p><p><b>b)</b> Calcule l'image de −4.</p>
   <p><b>3 –</b> On définit une fonction ${$g} qui, au nombre de départ, associe le résultat de ce programme de calcul :</p>${prog("Programme de calcul",["Choisir un nombre","Lui soustraire 1","Élever au carré","Multiplier par 2"])}
   <p><b>a)</b> Écris la relation algébrique de cette fonction ${$g}.</p><p><b>b)</b> Calcule l'image de 4.</p><p><b>c)</b> Calcule l'image de −3.</p>
   <p><b>4 –</b> On définit une fonction ${$h} qui, au nombre de départ, associe le résultat de ce programme Scratch :</p>${prog("Programme Scratch",["demander « Choisis un nombre » et attendre","mettre a à réponse + 3","mettre Résultat à a * 5","dire Résultat"])}
   <p><b>a)</b> Écris la relation algébrique de cette fonction ${$h}.</p><p><b>b)</b> Calcule l'image de 4.</p><p><b>c)</b> Calcule l'image de −7.</p>`,
   c:`<p><b>1 – a)</b></p>${ch(fx("h","2"),["3 × 2 + 5","6 + 5","11"])}<p><b>b)</b></p>${ch(fx("h","−4"),["3 × (−4) + 5","−12 + 5","−7"])}
   <p><b>2 – a)</b></p>${ch(fx("u","3"),[`2 × ${sq("3")} + 1`,"2 × 9 + 1","18 + 1","19"])}<p><b>b)</b></p>${ch(fx("u","−4"),[`2 × ${sq("(−4)")} + 1`,"2 × 16 + 1","32 + 1","33"])}
   <p><b>3 – a)</b> ${$g} : ${$x} ↦ 2${sq("("+$x+" − 1)")}</p><p><b>b)</b></p>${ch(fx("g","4"),[`2 × ${sq("(4 − 1)")}`,`2 × ${sq("3")}`,"2 × 9","18"])}<p><b>c)</b></p>${ch(fx("g","−3"),[`2 × ${sq("(−3 − 1)")}`,`2 × ${sq("(−4)")}`,"2 × 16","32"])}
   <p><b>4 – a)</b> ${$h} : ${$x} ↦ 5(${$x} + 3)</p><p><b>b)</b></p>${ch(fx("h","4"),["5 × (4 + 3)","5 × 7","35"])}<p><b>c)</b></p>${ch(fx("h","−7"),["5 × (−7 + 3)","5 × (−4)","−20"])}`}
 ]},
{t:"Lire des images et des antécédents sur une courbe", e:[
  {n:"Activité 3", t:"Lecture d'antécédents et d'images sur une courbe", w:"Sur ton cahier", h:`<p>Voici la courbe représentative de la fonction ${$f}.</p>${G_A3()}
   <p><b>1 –</b> Complète les phrases suivantes :</p><p><b>a)</b> L'image de 2 par la fonction ${$f} est …</p><p><b>b)</b> L'image de −5 par la fonction ${$f} est …</p><p><b>c)</b> L'image de −2 par ${$f} est …</p><p><b>d)</b> L'image de −4 par ${$f} est …</p><p><b>e)</b> 3 a pour antécédent(s) …</p><p><b>f)</b> −4 a pour antécédent(s) …</p><p><b>g)</b> 0 a pour antécédent(s) …</p>
   <p><b>2 – a)</b> Donne un nombre qui n'a aucun antécédent.</p><p><b>b)</b> Donne un nombre qui n'a qu'un seul antécédent.</p><p><b>c)</b> Donne un nombre qui a 2 antécédents.</p><p><b>d)</b> Donne un nombre qui a 3 antécédents.</p>
   <p><b>3 –</b> Sur le graphique, place les points A(3 ; 2), B(−2 ; −4) et C(1 ; 0). Quels points appartiennent à la courbe ?</p>`,
   c:`<p><b>1 –</b> Les images se lisent sur l'axe des ordonnées, les antécédents sur l'axe des abscisses.</p><p><b>a)</b> L'image de 2 par la fonction ${$f} est 3.</p><p><b>b)</b> L'image de −5 par la fonction ${$f} est 2.</p><p><b>c)</b> L'image de −2 par ${$f} est −4.</p><p><b>d)</b> L'image de −4 par ${$f} est 0.</p><p><b>e)</b> 3 a pour antécédent 2.</p><p><b>f)</b> −4 a pour antécédent −2.</p><p><b>g)</b> 0 a pour antécédents −6,5 ; −4 et 1.</p>
   <p><b>2 –</b> (plusieurs réponses possibles) <b>a)</b> 4 (aucun point de la courbe n'a pour ordonnée 4) · <b>b)</b> 3 · <b>c)</b> −3 · <b>d)</b> 0 (ou 1, ou 2)</p>
   <p><b>3 –</b> B et C appartiennent à la courbe. A n'est pas sur la courbe (A n'est même pas dans la zone où la courbe est tracée : la courbe s'arrête à ${$x} = 2).</p>${G_A3([{x:3,y:2,t:"A",col:BLUE},{x:-2,y:-4,t:"B",col:BLUE},{x:1,y:0,t:"C",col:BLUE}])}`},
  {n:"En +", t:"Associations", w:"Sur ton cahier", h:`<p>Voici trois fonctions et trois courbes représentatives de fonctions. Associe chaque fonction à la courbe qui lui convient.</p>${cols([`${$f} : ${$x} ↦ 2${sq($x)} + 1`,`${$g} : ${$x} ↦ ${$x}<sup>3</sup> − 1`,`${$h} : ${$x} ↦ 4${$x}`])}<div class="figs">${ASSO.join("")}</div>`,
   c:`<p>On calcule quelques images : ${fx("f","0")} = 1, ${fx("g","0")} = −1, ${fx("h","0")} = 0 ; ${fx("h","1")} = 4.</p><p>${$f} → courbe 2 (elle passe par (0 ; 1)) · ${$g} → courbe 3 (elle passe par (0 ; −1)) · ${$h} → courbe 1 (une droite qui passe par l'origine)</p>`},
  {n:"Exercice 5", t:"Lecture d'antécédents et d'images sur une courbe", w:"Sur ton cahier", h:`<p>Voici la courbe représentative de la fonction ${$g}.</p>${G_E5}
   <p><b>1 –</b> Complète les phrases suivantes :</p><p><b>a)</b> L'image de 2 par la fonction ${$g} est …</p><p><b>b)</b> L'image de −2 par ${$g} est …</p><p><b>c)</b> L'image de −1 par ${$g} est …</p><p><b>d)</b> L'image de 0 par ${$g} est …</p><p><b>e)</b> −1 a pour antécédent(s) …</p><p><b>f)</b> 0 a pour antécédent(s) …</p>
   <p><b>2 –</b> Les affirmations suivantes sont-elles vraies ou fausses ?</p><p><b>a)</b> Le point de coordonnées (2 ; 1) appartient à la courbe.</p><p><b>b)</b> Le point de coordonnées (−1 ; 3) appartient à la courbe.</p><p><b>c)</b> Le point de coordonnées (0 ; 2) appartient à la courbe.</p><p><b>d)</b> Le point de coordonnées (−3 ; 0) appartient à la courbe.</p>`,
   c:`<p><b>1 – a)</b> L'image de 2 par la fonction ${$g} est 1.</p><p><b>b)</b> L'image de −2 par ${$g} est −1.</p><p><b>c)</b> L'image de −1 par ${$g} est 0.</p><p><b>d)</b> L'image de 0 par ${$g} est 2.</p><p><b>e)</b> −1 a pour antécédents −2 et 3.</p><p><b>f)</b> 0 a pour antécédents −3 ; −1 et 2,5.</p><p><b>2 – a)</b> Vrai (${fx("g","2")} = 1) · <b>b)</b> Faux (${fx("g","−1")} = 0) · <b>c)</b> Vrai (${fx("g","0")} = 2) · <b>d)</b> Vrai (${fx("g","−3")} = 0)</p>`},
  {n:"Exercice 6", t:"Lecture d'antécédents et d'images sur une courbe", w:"Sur ton cahier", h:`<p>Voici la représentation graphique de la fonction ${X("p")}.</p>${G_E6}
   <p><b>1 –</b> Complète les phrases suivantes :</p><p><b>a)</b> L'image de −7 par ${X("p")} est …</p><p><b>b)</b> L'image de −2 par ${X("p")} est …</p><p><b>c)</b> L'image de 2 par ${X("p")} est …</p><p><b>d)</b> L'image de 3 par ${X("p")} est …</p>
   <p><b>2 – a)</b> Donne un nombre qui n'a aucun antécédent.</p><p><b>b)</b> Donne un nombre qui a 3 antécédents.</p><p><b>c)</b> Donne un nombre qui a 4 antécédents.</p><p><b>d)</b> Donne un nombre qui a 5 antécédents.</p><p><b>e)</b> Donne un nombre qui a 6 antécédents.</p>`,
   c:`<p><b>1 – a)</b> L'image de −7 par ${X("p")} est −2.</p><p><b>b)</b> L'image de −2 par ${X("p")} est 2.</p><p><b>c)</b> L'image de 2 par ${X("p")} est −2.</p><p><b>d)</b> L'image de 3 par ${X("p")} est 2.</p><p><b>2 –</b> (plusieurs réponses possibles ; trace la droite horizontale correspondante et compte les points d'intersection) <b>a)</b> 3 · <b>b)</b> −0,5 · <b>c)</b> 0 · <b>d)</b> 0,5 · <b>e)</b> 1</p>`},
  {n:"Exercice 7", t:"Lecture d'antécédents et d'images sur une courbe", w:"Sur ton cahier", h:`<p>${$g} est la fonction définie par ce graphique.</p>${G_E7}<p>Complète le tableau suivant :</p>${vt($x,[-1.5,0.5,"",0,-1,1.5],`Image de ${$x} par ${$g}`,["","",-1,"","",""])}`,
   c:`${vt($x,[-1.5,0.5,1,0,-1,1.5],`Image de ${$x} par ${$g}`,[1,0,-1,3,3,2])}`},
  {n:"Exercice 8", t:"Nouvelles notations et graphique", w:"Sur ton cahier", h:`<p>${$f} est la fonction définie par la courbe ci-dessous.</p>${G_E12}<p>Réponds par des phrases en français ou par des notations mathématiques. À l'aide du graphique, lis avec la précision permise :</p>
   <p><b>a)</b> l'image de 0 ;</p><p><b>b)</b> le (ou les) antécédent(s) de 0 ;</p><p><b>c)</b> ${fx("f","−3")} ;</p><p><b>d)</b> ${fx("f","1")} ;</p><p><b>e)</b> le (ou les) nombre(s) ${$x} tel(s) que ${fx("f")} = −3 ;</p><p><b>f)</b> le (ou les) nombre(s) ${$x} tel(s) que ${fx("f")} = 1.</p>`,
   c:`<p><b>a)</b> L'image de 0 est 1 : ${fx("f","0")} = 1.</p><p><b>b)</b> Les antécédents de 0 sont −1 ; 3,5 et 6.</p><p><b>c)</b> ${fx("f","−3")} = −2.</p><p><b>d)</b> ${fx("f","1")} = 1,5.</p><p><b>e)</b> ${fx("f")} = −3 pour ${$x} = −5.</p><p><b>f)</b> ${fx("f")} = 1 pour ${$x} = 0 ou ${$x} = 3.</p>`}
 ]},
{t:"Notations, calculs d'images et d'antécédents", e:[
  {n:"Exercice 9", t:"Calcul d'image avec la nouvelle notation", w:"Sur ton cahier", h:`<p>On considère la fonction ${$f} telle que ${fx("f")} = 2${$x} − 8.</p><p><b>1 –</b> Calcule ${fx("f","−3")}.</p><p><b>2 –</b> Avec la réponse trouvée, écris deux phrases : une avec le mot « image » et l'autre avec le mot « antécédent ».</p>`,
   c:`<p><b>1 –</b></p>${ch(fx("f","−3"),["2 × (−3) − 8","−6 − 8","−14"])}<p><b>2 –</b> L'image de −3 par ${$f} est −14.</p><p>−3 est un antécédent de −14 par ${$f}.</p>`},
  {n:"Exercice 10", t:"Traduire une notation mathématique", w:"Sur ton cahier", h:`<p>On sait que ${fx("g","−5")} = 6.</p><p><b>a)</b> Traduis cette égalité par une phrase où intervient le mot « image ».</p><p><b>b)</b> Traduis cette égalité par une phrase où intervient le mot « antécédent ».</p>`,
   c:`<p><b>a)</b> L'image de −5 par la fonction ${$g} est 6.</p><p><b>b)</b> −5 est un antécédent de 6 par la fonction ${$g}.</p>`},
  {n:"Exercice 11", t:"Traduire une notation mathématique", w:"Sur ton cahier", h:`<p>Complète le tableau suivant :</p>${tabH(["Notation mathématique","En français"],[[`${fx("f","7")} = 2`,"L'image de … est …"],[`${fx("f","8")} = −3`,"Un antécédent de … est …"],[`${fx("f","…")} = …`,"4 a pour image 5."],[`${fx("f","…")} = …`,"1 a pour antécédent −6."]])}`,
   c:tabH(["Notation mathématique","En français"],[[`${fx("f","7")} = 2`,"L'image de 7 est 2."],[`${fx("f","8")} = −3`,"Un antécédent de −3 est 8."],[`${fx("f","4")} = 5`,"4 a pour image 5."],[`${fx("f","−6")} = 1`,"1 a pour antécédent −6."]])},
  {n:"Exercice 12", t:"Nouvelles notations et tableau", w:"Sur ton cahier", h:`<p>${$g} est la fonction définie par le tableau suivant :</p>${vt($x,[-3,-2,-1,2,5,10],fx("g"),[10,5,2,-2,10,12])}
   <p><b>1 – a)</b> L'image de −2 par la fonction ${$g} est …</p><p><b>b)</b> L'antécédent de −2 par la fonction ${$g} est …</p><p><b>2 –</b> Léa affirme : « ${fx("g","10")} = −3 ». A-t-elle raison ? Si non, explique.</p><p><b>3 – a)</b> Lis ${fx("g","2")}.</p><p><b>b)</b> On recherche un nombre ${X("a")} tel que ${fx("g","<i>a</i>")} = 10. Indique une (ou des) valeur(s) possible(s) de ${X("a")}.</p>`,
   c:`<p><b>1 – a)</b> L'image de −2 par la fonction ${$g} est 5.</p><p><b>b)</b> L'antécédent de −2 par la fonction ${$g} est 2.</p><p><b>2 –</b> Non : ${fx("g","10")} = 12. L'image de 10 est 12 (c'est −3 qui a pour image 10 : ${fx("g","−3")} = 10).</p><p><b>3 – a)</b> ${fx("g","2")} = −2 · <b>b)</b> ${X("a")} = −3 ou ${X("a")} = 5.</p>`},
  {n:"Activité 4", t:"Calcul d'images et d'antécédents", w:"Sur ton cahier", h:`<p>On considère la fonction ${X("d")} telle que ${fx("d")} = 3${$x} − 8.</p><p><b>1 –</b> Calcule l'image de −4 par la fonction ${X("d")}.</p><p><b>2 –</b> Quel est l'antécédent de 12 par la fonction ${X("d")} ?</p>`,
   c:`<p><b>1 –</b></p>${ch(fx("d","−4"),["3 × (−4) − 8","−12 − 8","−20"])}<p>L'image de −4 est −20.</p><p><b>2 –</b> Je note ${X("a")} l'antécédent de 12 : ${fx("d","<i>a</i>")} = 12.</p>${calc([`3${X("a")} − 8 = 12`,[`3${X("a")} = 20`,"+ 8"],[`${X("a")} = {20/3}`,"÷ 3"]])}<p>L'antécédent de 12 par ${X("d")} est {20/3}.</p>`},
  {n:"Exercice 13", t:"Calculs d'antécédents et d'images", w:"Sur ton cahier", h:`<p>On considère les fonctions ${X("d")} et ${X("e")} telles que :</p><p class="calc">${fx("d")} = −2${$x} + 5 &emsp; et &emsp; ${fx("e")} = 3(2${$x} − 1)</p><p>Réponds en justifiant à l'aide de calculs.</p>
   <p><b>1 – a)</b> Calcule l'image de −3 par la fonction ${X("d")}.</p><p><b>b)</b> Calcule l'image de −3 par la fonction ${X("e")}.</p><p><b>2 – a)</b> Quel est l'antécédent de 10 par la fonction ${X("d")} ?</p><p><b>b)</b> Quel est l'antécédent de 15 par la fonction ${X("e")} ?</p><p><b>3 –</b> Quel même antécédent doit-on choisir pour ces deux fonctions pour obtenir la même image ?</p>`,
   c:`<p><b>1 – a)</b></p>${ch(fx("d","−3"),["−2 × (−3) + 5","6 + 5","11"])}<p>L'image de −3 par ${X("d")} est 11.</p><p><b>b)</b></p>${ch(fx("e","−3"),["3 × (2 × (−3) − 1)","3 × (−6 − 1)","3 × (−7)","−21"])}<p>L'image de −3 par ${X("e")} est −21.</p>
   <p><b>2 – a)</b></p>${calc([`−2${$x} + 5 = 10`,[`−2${$x} = 5`,"− 5"],[`${$x} = −2,5`,"÷ (−2)"]])}<p>L'antécédent de 10 par ${X("d")} est −2,5.</p><p><b>b)</b></p>${calc([`3(2${$x} − 1) = 15`,`6${$x} − 3 = 15`,[`6${$x} = 18`,"+ 3"],[`${$x} = 3`,"÷ 6"]])}<p>L'antécédent de 15 par ${X("e")} est 3.</p>
   <p><b>3 –</b> On cherche ${$x} tel que ${fx("d")} = ${fx("e")}.</p>${calc([`−2${$x} + 5 = 6${$x} − 3`,[`5 = 8${$x} − 3`,"+ 2"+$x],[`8 = 8${$x}`,"+ 3"],[`${$x} = 1`,"÷ 8"]])}<p>Il faut choisir 1. Vérification :</p><div class="calcs"><p class="calc">${fx("d","1")} = −2 × 1 + 5<br>${fx("d","1")} = 3</p><p class="calc">${fx("e","1")} = 3 × (2 × 1 − 1)<br>${fx("e","1")} = 3</p></div>`},
  {n:"Exercice 14", t:"Fonction et tableur", w:"Sur ton cahier", h:`<p>Soient les fonctions ${$f}, ${$g} et ${$h} définies par ${fx("f")} = 6${$x}, ${fx("g")} = 3${sq($x)} − 9${$x} − 7 et ${fx("h")} = 5${$x} − 7.</p><p>À l'aide d'un tableur, Pauline obtient (dans la cellule B3, elle a saisi =3*B1*B1-9*B1-7) :</p>
   ${tabH(["","A",..."BCDEFGH"],[["1",$x,...e14.map(F)],["2",`${fx("f")} = 6${$x}`,...e14.map(v=>F(6*v))],["3",`${fx("g")} = 3${sq($x)} − 9${$x} − 7`,...e14.map(v=>F(3*v*v-9*v-7))],["4",`${fx("h")} = 5${$x} − 7`,...e14.map(v=>F(5*v-7))]])}
   <p><b>1.</b> Quelle est la valeur de ${fx("h","−2")} ?</p><p><b>2.</b> Montre par le calcul que ${fx("g","−3")} = 47.</p><p><b>3.</b> Traduis l'égalité ${fx("g","−3")} = 47 par une phrase.</p><p><b>4.</b> Quelle formule Pauline a-t-elle saisie dans la cellule B4 ?</p><p><b>5.</b> Trouve une solution de l'équation 3${sq($x)} − 9${$x} − 7 = 5${$x} − 7 à l'aide du tableau.</p>`,
   c:`<p><b>1.</b> ${fx("h","−2")} = −17 (cellule C4).</p><p><b>2.</b></p>${ch(fx("g","−3"),[`3 × ${sq("(−3)")} − 9 × (−3) − 7`,"3 × 9 + 27 − 7","27 + 27 − 7","47"])}<p><b>3.</b> L'image de −3 par la fonction ${$g} est 47.</p><p><b>4.</b> =5*B1-7</p><p><b>5.</b> Dans la colonne E, pour ${$x} = 0 : ${fx("g","0")} = −7 et ${fx("h","0")} = −7. Donc 0 est une solution de l'équation.</p>`},
  {n:"Exercice 15", t:"Même image ?", w:"Sur ton cahier", h:`<p>On considère les deux fonctions ${$h} et ${X("i")} suivantes :</p><p class="calc">${fx("h")} = ${sq("(3"+$x+" − 5)")} &emsp; et &emsp; ${fx("i")} = (${$x} − 2)(9${$x} + 3)</p><p>En choisissant le même antécédent, peut-on obtenir la même image ?</p><p>Si cela est possible, précise l'antécédent et l'image communs.</p>`,
   c:`<p>On développe :</p>${ch(fx("h"),[sq("(3"+$x+" − 5)"),`(3${$x} − 5)(3${$x} − 5)`,`9${sq($x)} − 15${$x} − 15${$x} + 25`,`9${sq($x)} − 30${$x} + 25`])}${ch(fx("i"),[`(${$x} − 2)(9${$x} + 3)`,`9${sq($x)} + 3${$x} − 18${$x} − 6`,`9${sq($x)} − 15${$x} − 6`])}
   ${calc([`9${sq($x)} − 30${$x} + 25 = 9${sq($x)} − 15${$x} − 6`,[`−30${$x} + 25 = −15${$x} − 6`,"− 9"+sq($x)],[`25 = 15${$x} − 6`,"+ 30"+$x],[`31 = 15${$x}`,"+ 6"],[`${$x} = {31/15}`,"÷ 15"]])}
   <p>Oui : l'antécédent commun est {31/15}.</p>${ch(fx("h","<span class=\"fr\"><span>31</span><span>15</span></span>"),[sq("(3 × {31/15} − 5)"),sq("({93/15} − {75/15})"),sq("({18/15})"),sq("({6/5})"),"{36/25}","1,44"])}<p>L'image commune est {36/25} = 1,44.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Image et antécédent", schema:S_VOC, q:{
 1:[ {g:()=>{ let a,b; do{ a=ri(-9,9); b=ri(-9,9); }while(a===b); const n=pick(["f","g","h"]); const good=`L'image de ${F(a)} est ${F(b)}.`; return {q:`On sait que ${fx(n,F(a))} = ${F(b)}. Quelle phrase est correcte ?`, c:ch4(good,[`L'image de ${F(b)} est ${F(a)}.`,`${F(b)} est un antécédent de ${F(a)}.`,`L'antécédent de ${F(a)} est ${F(b)}.`]), rep:good, ex:`Dans ${fx(n,"a")} = b, a est l'antécédent et b est l'image.`, sx:S_VOC}; }} ],
 2:[ {g:()=>{ let a,b; do{ a=ri(-9,9); b=ri(-9,9); }while(a===b); const good=`${fx("f",F(a))} = ${F(b)}`; return {q:`Comment écrit-on « ${F(a)} est un antécédent de ${F(b)} par ${$f} » ?`, c:ch4(good,[`${fx("f",F(b))} = ${F(a)}`,`${$f} = ${F(b)}`,`${fx("f",F(a)+" ; "+F(b))}`]), rep:good, ex:`L'antécédent est entre les parenthèses, l'image est après le signe =.`, sx:S_VOC}; }} ],
 3:[ {q:"Vrai ou faux : un nombre peut avoir plusieurs images par une même fonction.", c:VF, rep:"Faux", ex:"Une fonction associe à un nombre un <b>unique</b> autre nombre : son image.", sx:S_VOC},
     {q:"Vrai ou faux : un nombre peut avoir plusieurs antécédents par une même fonction.", c:VF, rep:"Vrai", ex:"Par exemple avec x ↦ x² − 4, le nombre 5 a deux antécédents : −3 et 3.", sx:S_VOC} ]
}},
{nom:"Calculer une image", schema:S_IMG, q:{
 1:[ {g:()=>{ const a=pick([-5,-4,-3,-2,2,3,4,5]), b=ri(-9,9), x=ri(-6,6); return {q:`${fx("f")} = ${lin(a,b)}. Calcule ${fx("f",F(x))}.`, rep:F(a*x+b), ex:`<br>${fx("f",F(x))} = ${F(a)} × ${P(x)} ${b<0?"−":"+"} ${Math.abs(b)}<br>${fx("f",F(x))} = ${F(a*x)} ${b<0?"−":"+"} ${Math.abs(b)}<br>${fx("f",F(x))} = ${F(a*x+b)}`, sx:S_IMG}; }} ],
 2:[ {g:()=>{ const a=ri(1,4), b=ri(-9,9), x=-ri(1,5); return {q:`${fx("u")} = ${a===1?"":a}${sq($x)} ${b<0?"−":"+"} ${Math.abs(b)}. Calcule ${fx("u",F(x))}.`, rep:F(a*x*x+b), ex:`<br>${fx("u",F(x))} = ${a===1?"":a+" × "}${sq("("+F(x)+")")} ${b<0?"−":"+"} ${Math.abs(b)}<br>${fx("u",F(x))} = ${a===1?"":a+" × "}${x*x} ${b<0?"−":"+"} ${Math.abs(b)}<br>${fx("u",F(x))} = ${F(a*x*x+b)}`, sx:S_IMG}; }} ],
 3:[ {g:()=>{ const p=ri(1,5), k=ri(2,5), x=-ri(1,6); const v=k*(x-p)**2; return {q:`Programme : « choisir un nombre ; lui soustraire ${p} ; élever au carré ; multiplier par ${k} ». ${$g} associe au nombre de départ le résultat. Calcule ${fx("g",F(x))}.`, rep:F(v), ex:`${fx("g")} = ${k}${sq("("+$x+" − "+p+")")} donc :<br>${fx("g",F(x))} = ${k} × ${sq("("+F(x-p)+")")}<br>${fx("g",F(x))} = ${k} × ${(x-p)**2}<br>${fx("g",F(x))} = ${F(v)}`, sx:S_IMG}; }},
     {g:()=>{ const a=ri(2,6), b=ri(1,6), x=-ri(2,8); const v=a*(x+b); return {q:`Programme Scratch : « mettre a à réponse + ${b} ; mettre Résultat à a * ${a} ». Quelle est l'image de ${F(x)} ?`, rep:F(v), ex:`${fx("h")} = ${a}(${$x} + ${b}) donc :<br>${fx("h",F(x))} = ${a} × ${P(x+b)}<br>${fx("h",F(x))} = ${F(v)}`, sx:S_IMG}; }} ]
}},
{nom:"Lire un tableau de valeurs", schema:S_TAB, q:{
 1:[ {g:()=>{ const xs=shuf([-3,-2,-1,0,1,2,3,4]).slice(0,5).sort((a,b)=>a-b), ys=xs.map(()=>ri(-6,9)), i=ri(0,4); return {q:`Voici un tableau de valeurs de la fonction ${$g}. Quelle est l'image de ${F(xs[i])} ?`, fig:vt($x,xs,fx("g"),ys), rep:F(ys[i]), ex:`Sous ${F(xs[i])}, on lit ${F(ys[i])}.`, sx:S_TAB}; }} ],
 2:[ {g:()=>{ let xs,ys,i; do{ xs=shuf([-3,-2,-1,0,1,2,3,4]).slice(0,5).sort((a,b)=>a-b); ys=xs.map(()=>ri(-6,9)); i=ri(0,4); }while(ys.filter(y=>y===ys[i]).length>1); return {q:`Voici un tableau de valeurs de la fonction ${$g}. Quel est l'antécédent de ${F(ys[i])} ?`, fig:vt($x,xs,fx("g"),ys), rep:F(xs[i]), ex:`${F(ys[i])} est dans la 2<sup>e</sup> ligne, sous ${F(xs[i])}.`, sx:S_TAB}; }} ],
 3:[ {g:()=>{ const xs=[-3,-1,0,2,5], ys=xs.map(()=>ri(-5,9)); const j=ri(0,3); ys[4]=ys[j]; const ants=xs.filter((x,k)=>ys[k]===ys[j]).map(F); const good=ants.join(" et ");
       return {q:`Voici un tableau de valeurs de la fonction ${$g}. Quels sont les antécédents de ${F(ys[j])} ?`, fig:vt($x,xs,fx("g"),ys), c:ch4(good,[ants[0],`${F(ys[j])}`,xs.filter((x,k)=>ys[k]!==ys[j]).slice(0,2).map(F).join(" et ")]), rep:good, ex:`On cherche ${F(ys[j])} dans la ligne des images.`, sx:S_TAB}; }} ]
}},
{nom:"Lire une courbe", schema:S_CRB, q:{
 1:[ {g:()=>{ const K=[]; let y=ri(-3,3); for(let x=-4;x<=4;x+=2){ K.push([x,y]); y=Math.max(-4,Math.min(4,y+pick([-3,-2,-1,1,2,3]))); } const i=ri(0,4);
       return {q:`Voici la courbe d'une fonction ${$f}. Quelle est l'image de ${F(K[i][0])} ?`, fig:plot({x:[-4.5,4.5],y:[-4.5,4.5],u:32,c:[{f:brk(K),a:-4,b:4}],xl:"x"}), rep:F(K[i][1]), ex:`Le point de la courbe d'abscisse ${F(K[i][0])} a pour ordonnée ${F(K[i][1])}.`, sx:S_CRB}; }} ],
 2:[ {g:()=>{ const K=[]; for(let x=-4;x<=4;x+=2) K.push([x,ri(-4,4)]); let y; do{ y=ri(-3,3); }while(K.some(k=>k[1]===y));
       const s=sols(brk(K),-4,4,y), n=String(s.length);
       return {q:`Voici la courbe d'une fonction ${$f}. Combien le nombre ${F(y)} a-t-il d'antécédents ?`, fig:plot({x:[-4.5,4.5],y:[-4.5,4.5],u:32,c:[{f:brk(K),a:-4,b:4}],xl:"x"}), c:shuf(["0","1","2","3","4"].filter(v=>v!==n).slice(0,3).concat(n)), rep:n, ex:`La droite horizontale d'ordonnée ${F(y)} coupe la courbe en ${s.length} point${s.length>1?"s":""}.`, sx:S_CRB}; }} ],
 3:[ {g:()=>{ const K=[]; for(let x=-4;x<=4;x+=2) K.push([x,ri(-4,4)]); const i=ri(0,4), dy=pick([0,0,1,-1]), on=dy===0; const Y=K[i][1]+dy;
       return {q:`Le point (${F(K[i][0])} ; ${F(Y)}) appartient-il à la courbe de ${$f} ?`, fig:plot({x:[-4.5,4.5],y:[-5.5,5.5],u:30,c:[{f:brk(K),a:-4,b:4}],xl:"x"}), c:["Oui","Non"], rep:on?"Oui":"Non", ex:`L'image de ${F(K[i][0])} est ${F(K[i][1])}${on?" : le point est sur la courbe.":`, pas ${F(Y)}.`}`, sx:S_CRB}; }} ]
}},
{nom:"Calculer un antécédent", schema:S_ANT, q:{
 1:[ {g:()=>{ const a=ri(2,9), b=ri(-9,9), s=ri(-6,6); return {q:`${fx("f")} = ${lin(a,b)}. Quel est l'antécédent de ${F(a*s+b)} ?`, rep:F(s), ex:`${b===0?"":`${lin(a,b)} = ${F(a*s+b)} donc `}${mono(a)} = ${F(a*s)} et ${$x} = ${F(s)}.`, sx:S_ANT}; }} ],
 2:[ {g:()=>{ const a=-ri(2,6), b=ri(-9,9), s=ri(-6,6); return {q:`${fx("d")} = ${lin(a,b)}. Quel est l'antécédent de ${F(a*s+b)} ?`, rep:F(s), ex:`${b===0?"":`${lin(a,b)} = ${F(a*s+b)} donc `}${mono(a)} = ${F(a*s)} et ${$x} = ${F(a*s)} ÷ (${F(a)}) = ${F(s)}.`, sx:S_ANT}; }} ],
 3:[ {g:()=>{ let a,b,c; do{ a=ri(2,9); b=ri(-9,9); c=ri(-20,20); }while((c-b)%a===0); const good=FR(c-b,a); return {q:`${fx("f")} = ${lin(a,b)}. Quel est l'antécédent de ${F(c)} ?`, c:ch4(good,[FR(c+b,a),FR(a,c-b),F(a*c+b),FR(b-c,a),F(c-b)]), rep:good, ex:`${mono(a)} = ${F(c-b)} donc ${$x} = ${good}.`, sx:S_ANT}; }},
     {g:()=>{ let a,b,c,d; do{ a=ri(-5,5); c=ri(-5,5); b=ri(-9,9); d=ri(-9,9); }while(a===c||a===0||c===0||(d-b)%(a-c)!==0); const s=(d-b)/(a-c); return {q:`${fx("d")} = ${lin(a,b)} et ${fx("e")} = ${lin(c,d)}. Quel nombre a la même image par ${X("d")} et par ${X("e")} ?`, rep:F(s), ex:`${lin(a,b)} = ${lin(c,d)} donc ${a-c===1?"":`${mono(a-c)} = ${F(d-b)} et `}${$x} = ${F(s)}.`, sx:S_ANT}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{ const qK=[[-4,2],[-2,-2],[0,-1],[1,1],[3,3],[5,1]], q=brk(qK);
 return {
titre:"Évaluation d'entraînement · chapitre 12", duree:50, info:"Durée : 50 min · Calculatrice autorisée · Règle et crayon",
comp:[
  ["CONNAÎTRE","Je connais le vocabulaire (image, antécédent) et la notation f(x).","Ex. 1 (3 points)"],
  ["REPRÉSENTER","Je lis des images et des antécédents dans un tableau de valeurs et sur une courbe.","Ex. 2, 3 et 6 (10 points)"],
  ["CALCULER","Je calcule des images et des antécédents.","Ex. 4 et 5 (7 points)"]
],
exos:[
{t:"Vocabulaire et notations", p:3, h:`<p>On sait que ${fx("k","4")} = −1.</p><p>a) Traduis cette égalité par une phrase avec le mot « image ».</p><p>b) Traduis-la par une phrase avec le mot « antécédent ».</p><p>c) Écris avec une notation : « l'image de −2 par ${X("k")} est 7 ».</p><p>d) Écris avec une notation : « 0 a pour antécédent 3 par ${X("k")} ».</p>`,
 c:`<p>a) L'image de 4 par ${X("k")} est −1. <i>(0,75 point)</i></p><p>b) 4 est un antécédent de −1 par ${X("k")}. <i>(0,75 point)</i></p><p>c) ${fx("k","−2")} = 7 <i>(0,75 point)</i></p><p>d) ${fx("k","3")} = 0 <i>(0,75 point)</i></p>`},
{t:"Un tableau de valeurs", p:3, h:`<p>La fonction ${X("m")} est définie par le tableau suivant :</p>${vt($x,[-4,-1,0,2,3,6],fx("m"),[3,0,-2,3,7,0])}<p>a) Quelle est l'image de 2 ?</p><p>b) Quels sont les antécédents de 3 ?</p><p>c) Donne ${fx("m","0")}.</p><p>d) Quels sont les antécédents de 0 ?</p><p>e) Quelle est l'image de 6 ?</p><p>f) Quel nombre a pour image 7 ?</p>`,
 c:`<p>a) 3 · b) −4 et 2 · c) ${fx("m","0")} = −2 · d) −1 et 6 · e) 0 · f) 3</p><p><i>(0,5 point par réponse)</i></p>`},
{t:"Une courbe", p:5, h:`<p>Voici la courbe représentative d'une fonction ${X("q")}.</p>${plot({x:[-4.5,5.5],y:[-2.5,3.5],u:40,c:[{f:q,a:-4,b:5,ends:1}],xl:"x",alt:"Ligne brisée représentant la fonction q"})}
  <p>a) Lis ${fx("q","−2")}, ${fx("q","3")} et ${fx("q","0")}.</p><p>b) Quels sont les antécédents de 0 ?</p><p>c) Quels sont les antécédents de 2 ?</p><p>d) Le point (1 ; 1) appartient-il à la courbe ? Et le point (−1 ; 0) ?</p><p>e) Donne un nombre qui n'a aucun antécédent.</p>`,
 c:`<p>a) ${fx("q","−2")} = −2 · ${fx("q","3")} = 3 · ${fx("q","0")} = −1 <i>(1,5 point)</i></p><p>b) −3 et 0,5 <i>(1,5 point)</i></p><p>c) −4 ; 2 et 4 <i>(1 point)</i></p><p>d) (1 ; 1) : oui, car ${fx("q","1")} = 1. (−1 ; 0) : non, car ${fx("q","−1")} = −1,5. <i>(0,5 point)</i></p><p>e) Par exemple 4 (la courbe ne monte pas au-dessus de 3). <i>(0,5 point)</i></p>`},
{t:"Calculer des images", p:4, h:`<p>a) ${fx("f")} = −3${$x} + 7. Calcule ${fx("f","2")} et ${fx("f","−4")}.</p><p>b) ${fx("g")} = ${sq($x)} − 2${$x}. Calcule ${fx("g","−3")}.</p><p>c) La fonction ${$h} associe à un nombre le résultat du programme : « choisir un nombre ; lui ajouter 4 ; multiplier le résultat par le nombre de départ ». Écris ${fx("h")}, puis calcule l'image de −6.</p>`,
 c:`<p>a)</p>${ch(fx("f","2"),["−3 × 2 + 7","−6 + 7","1"])}${ch(fx("f","−4"),["−3 × (−4) + 7","12 + 7","19"])}<p><i>(2 points)</i></p><p>b)</p>${ch(fx("g","−3"),[`${sq("(−3)")} − 2 × (−3)`,"9 + 6","15"])}<p><i>(1 point)</i></p><p>c) ${fx("h")} = (${$x} + 4) × ${$x}</p>${ch(fx("h","−6"),["(−6 + 4) × (−6)","(−2) × (−6)","12"])}<p><i>(1 point)</i></p>`},
{t:"Calculer des antécédents", p:3, h:`<p>${fx("k")} = 4${$x} − 9.</p><p>a) Calcule l'antécédent de 11 par ${X("k")}.</p><p>b) Calcule l'antécédent de −3 par ${X("k")}.</p>`,
 c:`<p>a)</p>${calc([`4${$x} − 9 = 11`,[`4${$x} = 20`,"+ 9"],[`${$x} = 5`,"÷ 4"]])}<p>L'antécédent de 11 est 5. <i>(1,5 point)</i></p><p>b)</p>${calc([`4${$x} − 9 = −3`,[`4${$x} = 6`,"+ 9"],[`${$x} = 1,5`,"÷ 4"]])}<p>L'antécédent de −3 est 1,5. <i>(1,5 point)</i></p>`},
{t:"Fonctions et tableur", p:2, h:`<p>On considère ${fx("f")} = ${sq($x)} + 1 et ${fx("g")} = 2${$x} + 1. On obtient la feuille de calcul suivante :</p>${tabH(["","A","B","C","D","E","F","G"],[["1",$x,...[-2,-1,0,1,2,3].map(F)],["2",fx("f"),...[-2,-1,0,1,2,3].map(v=>F(v*v+1))],["3",fx("g"),...[-2,-1,0,1,2,3].map(v=>F(2*v+1))]])}
  <p>a) Quelle formule a-t-on saisie dans la cellule B3, avant de l'étirer ?</p><p>b) À l'aide du tableau, donne deux nombres qui ont la même image par ${$f} et par ${$g}.</p>`,
 c:`<p>a) =2*B1+1 <i>(1 point)</i></p><p>b) 0 (${fx("f","0")} = ${fx("g","0")} = 1) et 2 (${fx("f","2")} = ${fx("g","2")} = 5). <i>(1 point)</i></p>`}
]}; })()
};

/* réponses tapées : clavier texte (signe −) */
CH["3e-12"].quiz.forEach(N=>Object.values(N.q).forEach(list=>list.forEach((it,i)=>{
  if(it.g){ const g=it.g; list[i]={g:()=>Object.assign(g(),{kb:"text"})}; } else it.kb="text";
})));
})();
