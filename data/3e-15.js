/* 3e — Chapitre 15 : Trigonométrie
   Cours « Cours E5 », fiche « Exercices » (= Progression) et « Exercice mélangé » de M. Staal (dossier « 16 - Trigonométrie »).
   Les figures du cours, du QCM, de la fiche d'entraînement et de l'évaluation sont dessinées en SVG à partir des valeurs exactes (outils window.TRIG3).
   Les images des situations (tyrolienne, stade, funiculaire, panneaux…) viennent de la fiche de M. Staal (img/3k15ex, 3k15cr). */
(function(){
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const ex=(p,alt,w)=>img("3k15ex/"+p,alt,w), cr=(p,alt,w)=>img("3k15cr/"+p,alt,w);
const fig=(cap,body)=>`<figure>${body}${cap?`<figcaption>${cap}</figcaption>`:""}</figure>`;
const ang=s=>`<span class="ang">${s}</span>`;
const rd=(x,k=3)=>Math.round(x*10**k+1e-9)/10**k;
const F=(x,k=3)=>{ const r=rd(x,k); const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const RAD=Math.PI/180, cosd=a=>Math.cos(a*RAD), sind=a=>Math.sin(a*RAD), tand=a=>Math.tan(a*RAD);
const acosd=x=>Math.acos(x)/RAD, asind=x=>Math.asin(x)/RAD, atand=x=>Math.atan(x)/RAD;
/* arrondi « sûr » : le nombre n'est pas trop près d'une demi-unité (pas d'ambiguïté d'arrondi) */
const safe=(x,k)=>{ const t=x*10**k; return Math.abs(t-Math.floor(t)-0.5)>0.03; };

/* ------------------------------------------------------------------ géométrie */
const V={ sub:(a,b)=>[a[0]-b[0],a[1]-b[1]], add:(a,b)=>[a[0]+b[0],a[1]+b[1]], mul:(a,k)=>[a[0]*k,a[1]*k], dot:(a,b)=>a[0]*b[0]+a[1]*b[1],
  perp:u=>[-u[1],u[0]], unit:u=>{ const n=Math.hypot(u[0],u[1]); return [u[0]/n,u[1]/n]; },
  rot:(P,deg)=>{ const t=deg*RAD, c=Math.cos(t), s=Math.sin(t), o={}; Object.entries(P).forEach(([k,[x,y]])=>o[k]=[x*c-y*s,x*s+y*c]); return o; } };
const COL={adj:"#1e8a4c", opp:"#1e5aa8", hyp:"#d0342c"};
/* P {nom:[x,y]} · poly · seg [[a,b,couleur,largeur,pointillés]] · right [[sommet,a,b]] · angs [[sommet,a,b,texte]] · len [[a,b,texte,couleur]] · txt [[texte,[x,y] ou nom,dx,dy,couleur]] */
function geo(o){
  const P=o.P, g=a=>typeof a==="string"?P[a]:a, pad=o.pad??76;
  const all=Object.values(P), mx=Math.min(...all.map(p=>p[0])), Mx=Math.max(...all.map(p=>p[0])), my=Math.min(...all.map(p=>p[1])), My=Math.max(...all.map(p=>p[1]));
  const w=o.w||300, k=o.k||Math.min(400,(w-2*pad)/Math.max(Mx-mx,0.6*(My-my),0.1));
  const X=x=>pad+(x-mx)*k, Y=y=>pad+(My-y)*k, f=v=>v.toFixed(1), S=p=>[X(g(p)[0]),Y(g(p)[1])];
  const W=Math.round((Mx-mx)*k+2*pad), H=Math.round((My-my)*k+2*pad);
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${Math.min(W,w+40)}" role="img" aria-label="${o.alt||"Figure de géométrie"}">`;
  (o.poly||[]).forEach(N=>{ s+=`<polygon points="${N.map(n=>S(n).map(f).join(",")).join(" ")}" style="fill:none;stroke:var(--ink);stroke-width:2.2;stroke-linejoin:round"/>`; });
  (o.seg||[]).forEach(([a,b,c,wd,da])=>{ const A=S(a), B=S(b); s+=`<line x1="${f(A[0])}" y1="${f(A[1])}" x2="${f(B[0])}" y2="${f(B[1])}" style="stroke:${c||"var(--ink)"};stroke-width:${wd||2.2};${da?"stroke-dasharray:7 5;":""}stroke-linecap:round"/>`; });
  (o.right||[]).forEach(([v,a,b])=>{ const p=S(v), da=V.unit(V.sub(S(a),p)), db=V.unit(V.sub(S(b),p)), z=12;
    s+=`<path d="M${f(p[0]+da[0]*z)} ${f(p[1]+da[1]*z)} L${f(p[0]+da[0]*z+db[0]*z)} ${f(p[1]+da[1]*z+db[1]*z)} L${f(p[0]+db[0]*z)} ${f(p[1]+db[1]*z)}" style="fill:none;stroke:var(--ink);stroke-width:1.8"/>`; });
  (o.angs||[]).forEach(([v,a,b,t,c])=>{ const p=S(v), da=V.unit(V.sub(S(a),p)), db=V.unit(V.sub(S(b),p)), r=26;
    const crs=da[0]*db[1]-da[1]*db[0], A0=V.add(p,V.mul(da,r)), B0=V.add(p,V.mul(db,r));
    s+=`<path d="M${f(A0[0])} ${f(A0[1])} A${r} ${r} 0 0 ${crs>0?1:0} ${f(B0[0])} ${f(B0[1])}" style="fill:none;stroke:${c||"#d9730d"};stroke-width:2.4"/>`;
    if(t){ const bi=V.unit(V.add(da,db)), op=Math.acos(Math.max(-1,Math.min(1,V.dot(da,db))))/RAD, q=V.add(p,V.mul(bi,r+22+(op<35?(35-op)*1.2:0))); s+=`<text x="${f(q[0])}" y="${f(q[1]+6)}" text-anchor="middle" style="font-size:16px;font-weight:700;fill:${c||"#d9730d"}">${t}</text>`; } });
  const cen=(()=>{ const T=(o.poly&&o.poly[0]?o.poly[0]:Object.keys(P)).map(n=>S(n)); return [T.reduce((a,p)=>a+p[0],0)/T.length, T.reduce((a,p)=>a+p[1],0)/T.length]; })();
  (o.lab||Object.keys(P)).forEach(n=>{ const p=S(n); let d=o.off&&o.off[n]; if(!d){ let u=V.sub(p,cen); if(Math.hypot(...u)<1) u=[0,-1]; u=V.unit(u); d=[u[0]*18,u[1]*18]; }
    s+=`<text x="${f(p[0]+d[0])}" y="${f(p[1]+d[1]+6)}" text-anchor="middle" style="font-weight:700;font-size:17px;fill:var(--ink)">${n}</text>`; });
  (o.len||[]).forEach(([a,b,t,c])=>{ const A=S(a), B=S(b), m=[(A[0]+B[0])/2,(A[1]+B[1])/2]; let nr=V.unit(V.perp(V.sub(B,A))); if(V.dot(nr,V.sub(m,cen))<0) nr=V.mul(nr,-1);
    const tw=String(t).replace(/<[^>]+>/g,"").length*8.4, dd=14+Math.abs(nr[0])*tw/2+Math.abs(nr[1])*4, q=[m[0]+nr[0]*dd, m[1]+nr[1]*dd+5];
    s+=`<text x="${f(q[0])}" y="${f(q[1])}" text-anchor="middle" style="font-size:15px;font-weight:700;fill:${c||"var(--ink)"}">${t}</text>`; });
  (o.txt||[]).forEach(([t,p,dx=0,dy=0,c])=>{ const q=S(p); s+=`<text x="${f(q[0]+dx)}" y="${f(q[1]+dy+5)}" text-anchor="middle" style="font-size:14px;font-weight:700;fill:${c||"var(--ink)"}">${t}</text>`; });
  return s+"</svg>";
}
/* triangle n = [R, P, Q] rectangle en R ; α = angle en P ; on donne l'hypoténuse PQ = h (unité quelconque, la figure est mise à l'échelle)
   mark : texte de l'angle en P (« 35° » ou « ? ») ; L = {adj, opp, hyp} : textes écrits sur les côtés ; colors : colorer les côtés */
function trig(n, alpha, L={}, o={}){
  const [R,P,Q]=n, h=1, adj=h*cosd(alpha), opp=h*sind(alpha);
  let pts={[P]:[0,0],[R]:[adj,0],[Q]:[adj,opp]}; if(o.flip) pts[Q]=[adj,-opp];
  pts=V.rot(pts, o.rot??ri(-30,30));
  const c=o.colors, len=[]; if(L.adj) len.push([P,R,L.adj,c&&COL.adj]); if(L.opp) len.push([R,Q,L.opp,c&&COL.opp]); if(L.hyp) len.push([P,Q,L.hyp,c&&COL.hyp]);
  return geo({P:pts, poly:[[R,P,Q]], seg:c?[[P,R,COL.adj,3.4],[R,Q,COL.opp,3.4],[P,Q,COL.hyp,3.4]]:[], right:[[R,P,Q]], angs:o.mark===null?[]:[[P,R,Q,o.mark??""]], len, w:o.w||300, alt:o.alt||`Triangle ${R}${P}${Q} rectangle en ${R}`});
}
const NOMS=["ABC","DEF","MNP","RST","IJK","EFG","KLM","UVW","LUM","GHI","TAN","OCW"];
const NM=()=>pick(NOMS).split("");
/* noms des côtés : R sommet de l'angle droit, P sommet de l'angle, Q troisième sommet */
const SIDES=(R,P,Q)=>({adj:P+R, opp:R+Q, hyp:P+Q});
const FN={cos:["adj","hyp"], sin:["opp","hyp"], tan:["opp","adj"]};
const fnOf=(a,b)=>Object.keys(FN).find(k=>FN[k].includes(a)&&FN[k].includes(b));
const val=(fn,a)=>fn==="cos"?cosd(a):fn==="sin"?sind(a):tand(a);
const inv=(fn,x)=>fn==="cos"?acosd(x):fn==="sin"?asind(x):atand(x);
const NOMC={adj:"côté adjacent", opp:"côté opposé", hyp:"hypoténuse"}, ART={adj:"le côté adjacent", opp:"le côté opposé", hyp:"l'hypoténuse"};
const USE=fn=>fn==="cos"?"le <b>cosinus</b>":fn==="sin"?"le <b>sinus</b>":"la <b>tangente</b>";
/* calcul d'une longueur : connu (type kt, valeur kv), inconnu ut ; angle α en P ; k = nombre de décimales */
function lenCalc(n, alpha, kt, kv, ut, k, u="cm"){
  const [R,P,Q]=n, Sd=SIDES(R,P,Q), fn=fnOf(kt,ut), [nu,de]=FN[fn], A=ang(Q+P+R);
  const len={adj:alpha, opp:0, hyp:0}; const hyp=kt==="hyp"?kv:kt==="adj"?kv/cosd(alpha):kv/sind(alpha);
  const vals={hyp, adj:hyp*cosd(alpha), opp:hyp*sind(alpha)}, res=vals[ut];
  const X=Sd[ut], top=nu===ut, line2=`${fn}(${alpha}°) = {${nu===kt?F(kv):Sd[nu]}/${de===kt?F(kv):Sd[de]}}`;
  const last=top?`${X} = ${F(kv)} × ${fn}(${alpha}°)`:`${X} = {${F(kv)}/${fn}(${alpha}°)}`;
  const h=`<p>Dans le triangle ${R}${P}${Q} rectangle en ${R}, on connaît ${ART[kt]} et on cherche ${ART[ut]} : on utilise ${USE(fn)}.</p><p class="calc">${fn}(${A}) = {${Sd[nu]}/${Sd[de]}}<br>${line2}<br>${last}<br>${X} ≈ ${F(res,k)} ${u}</p>`;
  return {fn, res, X, h, vals};
}
/* calcul d'un angle à partir de deux côtés connus */
function angCalc(n, t1, v1, t2, v2){
  const [R,P,Q]=n, Sd=SIDES(R,P,Q), fn=fnOf(t1,t2), [nu,de]=FN[fn], A=ang(Q+P+R), vv={[t1]:v1,[t2]:v2}, x=vv[nu]/vv[de], a=inv(fn,x);
  const h=`<p>Dans le triangle ${R}${P}${Q} rectangle en ${R}, on connaît ${ART[t1]} et ${ART[t2]} : on utilise ${USE(fn)}.</p><p class="calc">${fn}(${A}) = {${Sd[nu]}/${Sd[de]}}<br>${fn}(${A}) = {${F(vv[nu])}/${F(vv[de])}}<br>${A} = ${fn}<sup>−1</sup>({${F(vv[nu])}/${F(vv[de])}}) ≈ ${Math.round(a)}°</p>`;
  return {fn, a, deg:Math.round(a), h, x};
}
window.TRIG3={V, geo, trig, F, rd, ang, cosd, sind, tand, acosd, asind, atand, safe, lenCalc, angCalc, SIDES, fnOf, val, inv, NOMC, COL, NOMS};

/* ===================== figures du cours ===================== */
const ACB=(()=>{ const P={A:[0,0],C:[8,0]}, a=25*RAD, cb=8*Math.cos(a); P.B=[8-cb*Math.cos(a), cb*Math.sin(a)];
  return geo({P, poly:[["A","B","C"]], seg:[["A","B",COL.opp,3.4],["B","C",COL.adj,3.4],["A","C",COL.hyp,3.4]], right:[["B","A","C"]], angs:[["C","A","B",""]], w:440, pad:110,
   txt:[["côté opposé",[0.35,1.6],-60,0,COL.opp],["à l'angle en C",[0.35,1.6],-60,18,COL.opp],["côté adjacent à l'angle en C",[5.2,2.4],30,-14,COL.adj],["hypoténuse",[4,0],0,22,COL.hyp]], alt:"Triangle ACB rectangle en B : côté opposé [AB], côté adjacent [BC], hypoténuse [AC]"}); })();
const fbcA=atand(3.7/5.5);
const FBC=trig(["F","B","C"], fbcA, {adj:"5,5 cm", opp:"3,7 cm"}, {mark:"?", rot:-15, w:300, alt:"Triangle FBC rectangle en F : FB = 5,5 cm, FC = 3,7 cm"});
const MAD=trig(["M","A","D"], 35, {hyp:"6,2 cm", opp:"?"}, {mark:"35°", rot:160, w:300, alt:"Triangle MAD rectangle en M : angle en A de 35°, DA = 6,2 cm"});
const LUM=trig(["M","U","L"], 52, {adj:"3,8 cm", hyp:"?"}, {mark:"52°", rot:200, flip:true, w:300, alt:"Triangle LUM rectangle en M : angle en U de 52°, MU = 3,8 cm"});

/* ===================== schémas ===================== */
const S_VOC=sch("Les côtés d'un triangle rectangle", `${trig(["R","P","Q"],35,{adj:"adjacent",opp:"opposé",hyp:"hypoténuse"},{mark:"",rot:0,colors:true,w:260})}<p class="schN">Pour l'angle marqué en P : l'<b>hypoténuse</b> est en face de l'angle droit, le <b>côté adjacent</b> touche l'angle, le <b>côté opposé</b> est en face de l'angle.</p>`);
const S_CAH=sch("CAH · SOH · TOA", `<p class="calc">cos = {Adjacent/Hypoténuse} &nbsp; sin = {Opposé/Hypoténuse} &nbsp; tan = {Opposé/Adjacent}</p><p class="schN">On choisit le rapport qui utilise le côté connu et le côté cherché.</p>`);
const S_LEN=sch("Calculer une longueur", `<p class="calc">sin(${ang("MAD")}) = {MD/DA}<br>sin(35°) = {MD/6,2}<br>MD = 6,2 × sin(35°) ≈ 3,56 cm</p><p class="calc">cos(${ang("LUM")}) = {MU/LU}<br>cos(52°) = {3,8/LU}<br>LU = {3,8/cos(52°)} ≈ 6,17 cm</p><p class="schN">Si la longueur cherchée est en bas du quotient, on <b>divise</b>.</p>`);
const S_ANG=sch("Calculer un angle", `<p class="calc">tan(${ang("FBC")}) = {FC/BF} = {3,7/5,5}<br>${ang("FBC")} = tan<sup>−1</sup>({3,7/5,5}) ≈ 34°</p><p class="schN">À la calculatrice : touche SECONDE (ou 2nde), puis cos, sin ou tan.</p>`);
const S_VAL=sch("Cosinus et sinus à la calculatrice", `<p class="calc">cos(35°) ≈ 0,82 &nbsp; sin(35°) ≈ 0,57 &nbsp; tan(35°) ≈ 0,70</p><p class="schN">La calculatrice doit être réglée en degrés. Le cosinus et le sinus d'un angle aigu sont toujours compris entre 0 et 1.</p>`);

/* ---------- générateurs du QCM ---------- */
const TYPES=["adj","opp","hyp"];
function genLen(k){ for(let g=0;g<200;g++){ const n=NM(), a=ri(15,75), [kt,ut]=shuf(TYPES).slice(0,2), kv=ri(20,120)/10, c=lenCalc(n,a,kt,kv,ut,k); if(safe(c.res,k) && c.res<60) return {n,a,kt,ut,kv,c}; } const n=["M","A","D"]; return {n,a:35,kt:"hyp",ut:"opp",kv:6.2,c:lenCalc(n,35,"hyp",6.2,"opp",k)}; }
function genAng(){ for(let g=0;g<200;g++){ const n=NM(), [t1,t2]=shuf(TYPES).slice(0,2); let v1=ri(15,80)/10, v2=ri(15,80)/10;
    if(t1==="hyp") v1=rd(v2+ri(5,50)/10); if(t2==="hyp") v2=rd(v1+ri(5,50)/10);
    const c=angCalc(n,t1,v1,t2,v2); if(c.a>8 && c.a<82 && safe(c.a,0)) return {n,t1,t2,v1,v2,c}; } const n=["F","B","C"]; return {n,t1:"adj",t2:"opp",v1:5.5,v2:3.7,c:angCalc(n,"adj",5.5,"opp",3.7)}; }
const labFor=(t,v,u="cm")=>v==null?"?":F(v)+" "+u;
/* triangle de correction : côtés colorés avec H, A, O (hypoténuse, côté adjacent, côté opposé) */
const hao=(cap,n,alpha,L,o={})=>fig(cap,trig(n,alpha,L,{w:330,...o,colors:true}));

CH["3e-15"] = {
intro:"Le cosinus, le sinus et la tangente d'un angle aigu dans un triangle rectangle : pour calculer une longueur ou la mesure d'un angle.",
savoir:[
  "repérer l'hypoténuse, le côté adjacent et le côté opposé à un angle aigu d'un triangle rectangle ;",
  "connaître les définitions du cosinus, du sinus et de la tangente (CAH, SOH, TOA) ;",
  "utiliser la calculatrice (en degrés) pour obtenir un cosinus, un sinus, une tangente ou un angle ;",
  "calculer la longueur d'un côté d'un triangle rectangle connaissant un côté et un angle aigu ;",
  "calculer la mesure d'un angle aigu d'un triangle rectangle connaissant deux côtés ;",
  "résoudre des problèmes avec la trigonométrie."
],

/* ===================== COURS ===================== */
cours:[
{k:"1", t:"Cosinus, sinus et tangente", h:`
  <div class="retenir" data-l="Définition"><p>Dans un triangle rectangle, pour un angle aigu donné, on définit trois rapports de longueurs :</p>
   <ul><li>le <b>cosinus</b> de cet angle : cos(angle) = {côté Adjacent à cet angle/Hypoténuse} &nbsp; <b>CAH</b></li>
   <li>le <b>sinus</b> de cet angle : sin(angle) = {côté Opposé à cet angle/Hypoténuse} &nbsp; <b>SOH</b></li>
   <li>la <b>tangente</b> de cet angle : tan(angle) = {côté Opposé à cet angle/côté Adjacent à cet angle} &nbsp; <b>TOA</b></li></ul></div>
  <p><b>Exemple :</b> dans ce triangle ACB rectangle en B, pour l'angle ${ang("ACB")} :</p>
  ${ACB}
  <ul><li>[AB] est le côté opposé à l'angle ${ang("ACB")} ;</li><li>[BC] est le côté adjacent à l'angle ${ang("ACB")} ;</li><li>[AC] est l'hypoténuse.</li></ul>
  <p>On a donc :</p>
  <p class="calc">cos(${ang("ACB")}) = {CB/AC} &nbsp;&nbsp; sin(${ang("ACB")}) = {AB/AC} &nbsp;&nbsp; tan(${ang("ACB")}) = {AB/BC}</p>
  <div class="retenir" data-l="Propriété"><p>Dans un triangle rectangle, le cosinus et le sinus d'un angle aigu <b>sont toujours compris entre 0 et 1</b>.</p></div>`},
{k:"2", t:"Déterminer la mesure d'un angle aigu d'un triangle rectangle", h:`
  <div class="retenir" data-l="À retenir"><p>Pour déterminer la mesure d'un angle aigu d'un triangle rectangle, <b>il faut connaître les longueurs de deux côtés</b>.</p></div>
  <div class="retenir" data-l="Méthode"><p><b>①</b> On nomme les côtés avec le bon vocabulaire (adjacent, opposé, hypoténuse).</p><p><b>②</b> On choisit le bon rapport trigonométrique (cos, sin ou tan).</p><p><b>③</b> Avec la calculatrice, on détermine le quotient puis l'angle correspondant.</p></div>
  <p><b>Exemple :</b> calcule la mesure de l'angle ${ang("FBC")}. Arrondi à l'unité.</p>
  ${FBC}
  <p>Pour l'angle ${ang("FBC")} : [FC] est le côté <b>opposé</b> et [BF] est le côté <b>adjacent</b>. On utilise <b>TOA</b> : la tangente.</p>
  <p>Dans le triangle FCB rectangle en F, on a :</p>
  <p class="calc">tan(${ang("FBC")}) = {FC/BF}<br>tan(${ang("FBC")}) = {3,7/5,5}<br>${ang("FBC")} = tan<sup>−1</sup>({3,7/5,5}) ≈ 34°</p>
  <div class="attention"><b>Avec la calculatrice :</b> touche SECONDE (ou 2nde), puis tan, puis 3,7 ÷ 5,5, puis EXE (ou =). La calculatrice doit être réglée en degrés.</div>`},
{k:"3", t:"Calculer la longueur d'un côté d'un triangle rectangle", h:`
  <div class="retenir" data-l="À retenir"><p>Pour calculer la longueur d'un côté d'un triangle rectangle, <b>il faut connaître la longueur d'un côté et la mesure d'un de ses angles aigus</b>.</p></div>
  <div class="retenir" data-l="Méthode"><p><b>①</b> On nomme les côtés avec le bon vocabulaire (adjacent, opposé, hypoténuse).</p><p><b>②</b> On choisit le bon rapport trigonométrique (cos, sin ou tan).</p><p><b>③</b> Avec la calculatrice, on donne la valeur approchée de la longueur.</p></div>
  <p><b>Exercice :</b> calcule les longueurs MD et LU. Tu donneras un arrondi au centième près.</p>
  <div class="figs">${fig("Calcul de la longueur MD",MAD)}${fig("Calcul de la longueur LU",LUM)}</div>
  <h4>Calcul de la longueur MD</h4>
  <p>Pour l'angle ${ang("MAD")} : [MD] est le côté <b>opposé</b> et [DA] est l'<b>hypoténuse</b>. <b>SOH</b> : on utilise le sinus.</p>
  <p>Dans le triangle MAD rectangle en M, on a :</p>
  <p class="calc">sin(${ang("MAD")}) = {MD/DA}<br>{sin(35°)/1} = {MD/6,2}<br>MD = {6,2 × sin(35°)/1}<br>MD ≈ 3,56 cm</p>
  <h4>Calcul de la longueur LU</h4>
  <p>Pour l'angle ${ang("LUM")} : [MU] est le côté <b>adjacent</b> et [LU] est l'<b>hypoténuse</b>. <b>CAH</b> : on utilise le cosinus.</p>
  <p>Dans le triangle MLU rectangle en M, on a :</p>
  <p class="calc">cos(${ang("LUM")}) = {MU/LU}<br>{cos(52°)/1} = {3,8/LU}<br>LU = {3,8 × 1/cos(52°)}<br>LU ≈ 6,17 cm</p>
  <div class="attention"><b>Avec la calculatrice :</b> on tape 6,2 × sin(35) puis 3,8 ÷ cos(52).</div>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Découvrir le cosinus d'un angle", e:[
  {n:"Activité 1", t:"Calculer une longueur", w:"Sur ton cahier", h:`${ex("a1.jpg","Tyrolienne entre deux arbres : le câble [AB] fait un angle de 35° avec l'horizontale [AC], AC = 30 m",300)}
   <p>Dans un parc de loisirs accrobranche, une attraction consiste à se déplacer entre deux arbres avec une tyrolienne.</p>
   <p>Quelle doit être la longueur du câble tendu sachant qu'il est incliné de 35° par rapport à l'horizontale et que la distance entre les deux arbres est de 30 m ?</p><p>Arrondi au centième près.</p>`,
   c:`<p>Le triangle ABC est rectangle en C. Pour l'angle ${ang("BAC")} = 35° : [AC] est le côté adjacent (30 m) et le câble [AB] est l'hypoténuse.</p>
   <p class="calc">cos(${ang("BAC")}) = {AC/AB}<br>cos(35°) = {30/AB}<br>AB = {30/cos(35°)}<br>AB ≈ 36,62 m</p><p>Le câble doit mesurer environ <b>36,62 m</b>.</p><p><i>(Cette activité se résout avec le cosinus, découvert à l'activité 2.)</i></p>`},
  {n:"Activité 2", t:"Construction de triangles", w:"Sur ton cahier", h:`<p><b>1 –</b> Construis, en vraie grandeur, un triangle ABC rectangle en C tel que ${ang("CAB")} = 35°.</p><p><b>2 –</b> Mesure les longueurs AC et AB et donne la valeur du quotient {AC/AB}. Arrondi au centième.</p>`,
   c:`${cr("a2.png","Deux triangles rectangles avec un angle de 35° : ABC (AC = 6,77 ; AB = 8,264) et A'B'C' (A'C' = 4,319 ; A'B' = 5,272)",260)}
   <p><b>Retour à l'activité 2 :</b> on a construit deux triangles rectangles avec un angle de 35° :</p><ul><li>un triangle ABC rectangle en C tel que ${ang("CAB")} = 35° : {AC/AB} = {6,77/8,264} ≈ 0,82 ;</li><li>un triangle A'B'C' rectangle en C' tel que ${ang("C'A'B'")} = 35° : {A'C'/A'B'} = {4,319/5,272} ≈ 0,82.</li></ul>
   <p>Quelle que soit la taille du triangle, on trouve la même valeur (≈ 0,82), que l'on associe à 35°.</p><p>Cette valeur s'appelle le <b>cosinus</b> de 35° : <b>cos(35°) ≈ 0,82</b>.</p>`},
  {n:"Exercice 1", t:"Calculer le cosinus d'un angle", w:"Sur ton cahier", h:`<p>À l'aide de la calculatrice, complète le tableau suivant. Arrondis au centième près.</p>
   <div class="scroll"><table class="std"><thead><tr><th>Angle</th>${[6,17,35,45,50,60,70,80,88].map(a=>`<th>${a}°</th>`).join("")}</tr></thead><tbody><tr><th>cos(angle)</th>${"<td></td>".repeat(9)}</tr></tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Angle</th>${[6,17,35,45,50,60,70,80,88].map(a=>`<th>${a}°</th>`).join("")}</tr></thead><tbody><tr><th>cos(angle)</th>${[6,17,35,45,50,60,70,80,88].map(a=>`<td>${F(cosd(a),2)}</td>`).join("")}</tr></tbody></table></div><p>Plus l'angle est grand, plus son cosinus est petit (et il reste entre 0 et 1).</p>`},
  {n:"Exercice 2", t:"Calculer une longueur", w:"Sur ton cahier", h:`<p><b>1 –</b> Pour chaque triangle, repère, sur la figure, l'hypoténuse en écrivant <b>H</b> et le côté adjacent à l'angle donné en écrivant <b>A</b>.</p><p><b>2 –</b> Calcule la longueur du côté indiqué avec la rédaction de l'activité 1. Arrondis au dixième.</p>${ex("e2.png","a) MNP rectangle en N, angle en M de 27°, MP = 12,6 cm ; b) RYA rectangle en Y, angle en R de 30°, RA = 7 cm ; c) HDJ rectangle en D, angle en J de 34°, DJ = 15 cm ; d) EGF rectangle en G, angle en E de 30°, EG = 5 cm",500)}`,
   c:`<p><b>1 –</b> Sur chaque triangle : <b>H</b> l'hypoténuse (en rouge), <b>A</b> le côté adjacent à l'angle donné (en vert).</p><div class="figs">${hao("a) MNP",["N","M","P"],27,{hyp:"H : 12,6 cm",adj:"A : ?"},{mark:"27°",flip:true,rot:27})}${hao("b) RYA",["Y","R","A"],30,{hyp:"H : 7 cm",adj:"A : ?"},{mark:"30°",rot:0})}${hao("c) HDJ",["D","J","H"],34,{adj:"A : 15 cm",hyp:"H : ?"},{mark:"34°",flip:true,rot:180})}${hao("d) EGF",["G","E","F"],30,{adj:"A : 5 cm",hyp:"H : ?"},{mark:"30°",flip:true,rot:30})}</div>
   <p><b>2 – a)</b> MNP est rectangle en N : MP = 12,6 cm est l'hypoténuse (H) et [MN] est le côté adjacent (A) à l'angle de 27°.</p><p class="calc">cos(${ang("NMP")}) = {MN/MP}<br>cos(27°) = {MN/12,6}<br>MN = 12,6 × cos(27°) ≈ 11,2 cm</p>
   <p><b>b)</b> RYA est rectangle en Y : RA = 7 cm est l'hypoténuse et [RY] le côté adjacent à l'angle de 30°.</p><p class="calc">cos(${ang("ARY")}) = {RY/RA}<br>cos(30°) = {RY/7}<br>RY = 7 × cos(30°) ≈ 6,1 cm</p>
   <p><b>c)</b> HDJ est rectangle en D : DJ = 15 cm est le côté adjacent à l'angle de 34° et [HJ] l'hypoténuse.</p><p class="calc">cos(${ang("DJH")}) = {DJ/HJ}<br>cos(34°) = {15/HJ}<br>HJ = {15/cos(34°)} ≈ 18,1 cm</p>
   <p><b>d)</b> EGF est rectangle en G : EG = 5 cm est le côté adjacent à l'angle de 30° et [EF] l'hypoténuse.</p><p class="calc">cos(${ang("GEF")}) = {EG/EF}<br>cos(30°) = {5/EF}<br>EF = {5/cos(30°)} ≈ 5,8 cm</p>`},
  {n:"Exercice 3", t:"Décollage d'un avion", w:"Sur ton cahier", h:`<p>Un avion décolle en ligne droite en faisant un angle de 40° par rapport au sol.</p><p>Il survole maintenant une ville qui se situe à 3,5 km de l'aéroport.</p><p>Quelle distance, en km, l'avion a-t-il parcourue ? Arrondis au dixième.</p>`,
   c:`${trig(["V","A","P"],40,{adj:"3,5 km",hyp:"?"},{mark:"40°",rot:0,w:300,alt:"Aéroport A, ville V, avion P au-dessus de la ville"})}<p>A est l'aéroport, V la ville et P l'avion au-dessus de la ville. Le triangle AVP est rectangle en V.</p><p>AV = 3,5 km est le côté adjacent à l'angle de 40° ; la distance parcourue AP est l'hypoténuse.</p>
   <p class="calc">cos(${ang("VAP")}) = {AV/AP}<br>cos(40°) = {3,5/AP}<br>AP = {3,5/cos(40°)} ≈ 4,6 km</p><p>L'avion a parcouru environ <b>4,6 km</b>.</p>`}
 ]},
{t:"Cosinus, sinus et tangente : calculer une longueur", e:[
  {n:"Exercice 4", t:"Calculer le cosinus, le sinus et la tangente d'un angle", w:"Sur ton cahier", h:`<p>À l'aide de la calculatrice, complète les tableaux suivants. Arrondis au centième près.</p>
   <div class="scroll"><table class="std"><thead><tr><th>Angle</th><th>35°</th><th>6°</th><th>80°</th></tr></thead><tbody><tr><th>cos(angle)</th><td></td><td></td><td></td></tr><tr><th>sin(angle)</th><td></td><td></td><td></td></tr><tr><th>tan(angle)</th><td></td><td></td><td></td></tr></tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Angle</th><th>35°</th><th>6°</th><th>80°</th></tr></thead><tbody>${["cos","sin","tan"].map(fn=>`<tr><th>${fn}(angle)</th>${[35,6,80].map(a=>`<td>${F(val(fn,a),2)}</td>`).join("")}</tr>`).join("")}</tbody></table></div><p>La tangente peut être plus grande que 1 (tan(80°) ≈ 5,67), mais pas le cosinus ni le sinus.</p>`},
  {n:"Exercice 5", t:"Calculer la longueur d'un côté d'un triangle rectangle", w:"Sur ton cahier", h:`<p>Dans chaque cas, calcule la longueur demandée. Arrondi au dixième.</p>${ex("e5.png","1 : avion en A à 1 058 m au-dessus de B, angle BAC de 60° ; 2 : tyrolienne NP de 70 m, angle MNP de 75° ; 3 : poteau AT, AS = 10 m, angle en S de 30°",720)}
   <p><b>1 –</b> Calcule la distance AC qu'il reste à parcourir à cet avion avant de toucher la piste.</p><p><b>2 –</b> Calcule la distance MP entre les deux arbres.</p><p><b>3 –</b> Calcule la longueur AT de ce poteau.</p>
   <p>Avant de commencer la rédaction, il t'est demandé :</p><p><b>a)</b> d'indiquer sur chaque triangle la nature de chaque côté par rapport à l'angle indiqué : <b>H</b> pour hypoténuse, <b>A</b> pour le côté adjacent et <b>O</b> pour le côté opposé ;</p><p><b>b)</b> ensuite, d'écrire en dessous de chaque dessin si tu vas utiliser le <b>cosinus</b>, le <b>sinus</b> ou la <b>tangente</b> ;</p><p><b>c)</b> enfin, de rédiger ton raisonnement.</p>`,
   c:`<p><b>a) et b)</b> Sur chaque triangle : <b>H</b> en rouge, <b>A</b> en vert, <b>O</b> en bleu.</p><div class="figs">${hao("1 – On utilise le cosinus.",["B","A","C"],60,{adj:"A : 1 058 m",hyp:"H : ?",opp:"O"},{mark:"60°",rot:-90})}${hao("2 – On utilise le sinus.",["M","N","P"],75,{hyp:"H : 70 m",opp:"O : ?",adj:"A"},{mark:"75°",rot:-90})}${hao("3 – On utilise la tangente.",["A","S","T"],30,{adj:"A : 10 m",opp:"O : ?",hyp:"H"},{mark:"30°",flip:true,rot:180})}</div>
   <p><b>c)</b></p><p><b>1 –</b> ABC est rectangle en B. Pour l'angle ${ang("BAC")} = 60° : AB = 1 058 m est le côté adjacent (A), AC est l'hypoténuse (H). On utilise le <b>cosinus</b>.</p><p class="calc">cos(${ang("BAC")}) = {AB/AC}<br>cos(60°) = {1 058/AC}<br>AC = {1 058/cos(60°)} = 2 116 m</p><p>Il reste <b>2 116 m</b> à parcourir.</p>
   <p><b>2 –</b> NMP est rectangle en M. Pour l'angle ${ang("MNP")} = 75° : NP = 70 m est l'hypoténuse (H), MP est le côté opposé (O). On utilise le <b>sinus</b>.</p><p class="calc">sin(${ang("MNP")}) = {MP/NP}<br>sin(75°) = {MP/70}<br>MP = 70 × sin(75°) ≈ 67,6 m</p><p>Les deux arbres sont à environ <b>67,6 m</b> l'un de l'autre.</p>
   <p><b>3 –</b> TAS est rectangle en A. Pour l'angle ${ang("AST")} = 30° : AS = 10 m est le côté adjacent (A), AT est le côté opposé (O). On utilise la <b>tangente</b>.</p><p class="calc">tan(${ang("AST")}) = {AT/AS}<br>tan(30°) = {AT/10}<br>AT = 10 × tan(30°) ≈ 5,8 m</p><p>Le poteau mesure environ <b>5,8 m</b>.</p>`},
  {n:"Exercice 6", t:"Au stade", w:"Sur ton cahier", h:`${ex("e6.png","Ivana (1,40 m) regarde le haut du stade sous un angle de 55° ; elle est à 25 m du stade",460)}<p>Ivana, qui mesure 1,40 m, observe le nouveau stade de Bordeaux.</p><p>Quelle est la hauteur du stade ? Arrondis au centième.</p>`,
   c:`<p>On note O l'œil d'Ivana, K le point du stade à la hauteur de ses yeux et S le haut du stade. Le triangle OKS est rectangle en K, avec OK = 25 m et ${ang("KOS")} = 55°.</p><p>OK est le côté adjacent à l'angle de 55° et KS le côté opposé : on utilise la <b>tangente</b>.</p>
   <p class="calc">tan(${ang("KOS")}) = {KS/OK}<br>tan(55°) = {KS/25}<br>KS = 25 × tan(55°) ≈ 35,70 m</p><p>On ajoute la taille d'Ivana : 35,70 + 1,40 = 37,10.</p><p>Le stade mesure environ <b>37,10 m</b> de haut.</p>`},
  {n:"Exercice 7", t:"Funiculaire à Montmartre", w:"Sur ton cahier", h:`${ex("e7.jpg","Le funiculaire de Montmartre",150)}<p>Un funiculaire permet de monter au sommet de la butte Montmartre à Paris.</p><p>D'une longueur de 108 m, la voie a un angle d'élévation de 19,5° par rapport à l'horizontale.</p><p>Donne une valeur approchée au centième près de la différence d'altitude, en m, entre la gare d'arrivée et la gare de départ.</p>`,
   c:`${trig(["H","D","A"],19.5,{hyp:"108 m",opp:"?"},{mark:"19,5°",rot:0,w:320,alt:"Voie [DA] de 108 m, gare de départ D, gare d'arrivée A"})}<p>D est la gare de départ, A la gare d'arrivée, H le point à la verticale de A au niveau de D. Le triangle DHA est rectangle en H.</p><p>La voie DA = 108 m est l'hypoténuse ; la différence d'altitude AH est le côté opposé à l'angle de 19,5° : on utilise le <b>sinus</b>.</p>
   <p class="calc">sin(${ang("HDA")}) = {AH/DA}<br>sin(19,5°) = {AH/108}<br>AH = 108 × sin(19,5°) ≈ 36,05 m</p><p>La différence d'altitude est d'environ <b>36,05 m</b>.</p>`}
 ]},
{t:"Calculer la mesure d'un angle", e:[
  {n:"Activité 3", t:"Trouver l'angle d'inclinaison", w:"Sur ton cahier", h:`${geo({P:{E:[0,0],M:[2.3749,0],S:[2.3749,4.4]}, poly:[["E","M","S"]], right:[["M","E","S"]], len:[["E","S","5 m"],["M","S","4,4 m"]], w:200, alt:"Échelle [ES] de 5 m contre le mur [MS] de 4,4 m"})}
   <p>Mattéo veut repeindre le mur de la maison. Yasmine s'inquiète pour lui, il est perché sur une échelle de 5 m !</p>
   <p>« Tu es sûr d'avoir placé correctement ton échelle ? Pour être stable, elle doit faire un angle avec le sol de 70° maximum. »</p><p>« Je n'ai pas mon rapporteur, impossible de vérifier ! » s'exclame Mattéo.</p><p>« Ne t'inquiète pas, avec un peu de trigonométrie, on peut calculer la mesure d'un angle. »</p>
   <p>Sachant que la longueur MS mesure 4,4 m, l'échelle est-elle positionnée correctement ?</p>`,
   c:`<p>Le triangle EMS est rectangle en M. On cherche l'angle ${ang("SEM")} entre l'échelle et le sol.</p><p>Pour cet angle : MS = 4,4 m est le côté opposé et ES = 5 m est l'hypoténuse. On utilise le <b>sinus</b>.</p>
   <p class="calc">sin(${ang("SEM")}) = {MS/ES}<br>sin(${ang("SEM")}) = {4,4/5} = 0,88<br>${ang("SEM")} = sin<sup>−1</sup>(0,88) ≈ 62°</p><p>62° &lt; 70° : <b>l'échelle est positionnée correctement</b>.</p>`},
  {n:"Exercice 8", t:"Savoir utiliser la bonne fonction avec la calculatrice", w:"Sur ton cahier", h:`<p>À l'aide de la calculatrice, complète les tableaux suivants.</p><p>On arrondit les angles au degré près et les valeurs des deuxièmes lignes au centième près.</p>
   <div class="figs"><div class="scroll"><table class="std"><thead><tr><th>Angle</th><th>13°</th><th></th></tr></thead><tbody><tr><th>cos(angle)</th><td></td><td>0,70</td></tr></tbody></table></div>
   <div class="scroll"><table class="std"><thead><tr><th>Angle</th><th></th><th>23°</th></tr></thead><tbody><tr><th>sin(angle)</th><td>0,5</td><td></td></tr></tbody></table></div>
   <div class="scroll"><table class="std"><thead><tr><th>Angle</th><th>87°</th><th></th></tr></thead><tbody><tr><th>tan(angle)</th><td></td><td>3,2</td></tr></tbody></table></div></div>`,
   c:`<div class="figs"><div class="scroll"><table class="std"><thead><tr><th>Angle</th><th>13°</th><th><b>46°</b></th></tr></thead><tbody><tr><th>cos(angle)</th><td><b>0,97</b></td><td>0,70</td></tr></tbody></table></div>
   <div class="scroll"><table class="std"><thead><tr><th>Angle</th><th><b>30°</b></th><th>23°</th></tr></thead><tbody><tr><th>sin(angle)</th><td>0,5</td><td><b>0,39</b></td></tr></tbody></table></div>
   <div class="scroll"><table class="std"><thead><tr><th>Angle</th><th>87°</th><th><b>73°</b></th></tr></thead><tbody><tr><th>tan(angle)</th><td><b>19,08</b></td><td>3,2</td></tr></tbody></table></div></div>
   <p>Pour retrouver un angle : cos<sup>−1</sup>(0,70) ≈ 46° ; sin<sup>−1</sup>(0,5) = 30° ; tan<sup>−1</sup>(3,2) ≈ 73° (touche SECONDE).</p>`},
  {n:"Exercice 9", t:"Déterminer la mesure d'un angle d'un triangle rectangle", w:"Sur ton cahier", h:`<div class="figs">${fig("a. MOI rectangle en O",ex("e9a.png","Triangle MOI rectangle en O : MI = 6,2 et MO = 2,3 ; angle cherché en I",130))}${fig("b. TOI rectangle en T",ex("e9b.png","Triangle TOI rectangle en T : TO = 8,7 et TI = 5,3 ; angle cherché en I",130))}</div>
   <p><b>1 –</b> Indique sur chaque triangle la nature de chaque côté par rapport à l'angle que l'on cherche : <b>H</b> pour hypoténuse, <b>A</b> pour le côté adjacent et <b>O</b> pour le côté opposé.</p><p><b>2 –</b> Pour calculer la mesure de l'angle indiqué, écris si tu vas utiliser le <b>cosinus</b>, le <b>sinus</b> ou la <b>tangente</b>.</p><p><b>3 –</b> <b>Calcule</b> l'angle indiqué en rédigeant. Arrondi au degré près.</p>`,
   c:`<p><b>1 – et 2 –</b> <b>H</b> en rouge, <b>A</b> en vert, <b>O</b> en bleu.</p><div class="figs">${hao("a. MOI : on utilise le sinus.",["O","I","M"],asind(2.3/6.2),{hyp:"H : 6,2",opp:"O : 2,3",adj:"A"},{mark:"?",rot:90})}${hao("b. TOI : on utilise la tangente.",["T","I","O"],atand(8.7/5.3),{opp:"O : 8,7",adj:"A : 5,3",hyp:"H"},{mark:"?",rot:0})}</div>
   <p><b>3 –</b></p><p><b>a.</b> Pour l'angle ${ang("MIO")} : MI = 6,2 est l'hypoténuse (H), MO = 2,3 est le côté opposé (O), [OI] est le côté adjacent (A). On utilise le <b>sinus</b>.</p><p class="calc">sin(${ang("MIO")}) = {MO/MI}<br>sin(${ang("MIO")}) = {2,3/6,2}<br>${ang("MIO")} = sin<sup>−1</sup>({2,3/6,2}) ≈ 22°</p>
   <p><b>b.</b> Pour l'angle ${ang("TIO")} : TO = 8,7 est le côté opposé (O), TI = 5,3 est le côté adjacent (A), [OI] est l'hypoténuse (H). On utilise la <b>tangente</b>.</p><p class="calc">tan(${ang("TIO")}) = {TO/TI}<br>tan(${ang("TIO")}) = {8,7/5,3}<br>${ang("TIO")} = tan<sup>−1</sup>({8,7/5,3}) ≈ 59°</p>`},
  {n:"Exercice 10", t:"Déterminer la longueur d'un côté ou la mesure d'un angle", w:"Sur ton cahier", h:`<p>Dans chaque cas, calcule la longueur du côté ou la mesure de l'angle indiqué.</p><div class="figs">${fig("a. UZO rectangle en Z : calcule ZO.",ex("e10a.png","Triangle UZO rectangle en Z : UZ = 7 cm, angle ZUO de 24° ; on cherche ZO",130))}${fig("b. LUI rectangle en L : calcule l'angle en I.",ex("e10b.png","Triangle LUI rectangle en L : LI = 3,7 et UI = 4,1 ; angle cherché en I",130))}</div>`,
   c:`<p><b>a.</b> Pour l'angle ${ang("ZUO")} = 24° : UZ = 7 cm est le côté adjacent et ZO le côté opposé. On utilise la <b>tangente</b>.</p><p class="calc">tan(${ang("ZUO")}) = {ZO/UZ}<br>tan(24°) = {ZO/7}<br>ZO = 7 × tan(24°) ≈ 3,1 cm</p>
   <p><b>b.</b> Pour l'angle ${ang("LIU")} : LI = 3,7 est le côté adjacent et UI = 4,1 est l'hypoténuse. On utilise le <b>cosinus</b>.</p><p class="calc">cos(${ang("LIU")}) = {LI/UI}<br>cos(${ang("LIU")}) = {3,7/4,1}<br>${ang("LIU")} = cos<sup>−1</sup>({3,7/4,1}) ≈ 26°</p>`},
  {n:"Exercice 11", t:"Signalisation de pente (Brevet 2015)", w:"Sur ton cahier", h:`<div class="figs">${ex("e11a.png","Panneau de descente à 10 %",110)}${ex("e11b.png","Triangle ABC rectangle en B : dénivelé AB = 10 m, déplacement horizontal BC = 100 m",340)}</div>
   <p>Le panneau routier ci-dessus indique une descente dont la pente est de 10 %.</p><p>Cela signifie que pour un déplacement horizontal de 100 m, le dénivelé est de 10 m.</p>
   <p><b>1)</b> Détermine la mesure de l'angle ${ang("BCA")} que fait la route avec l'horizontale. Arrondis au degré près.</p>
   <p><b>2)</b> La pente d'une route peut aussi être donnée par une indication telle que « 1 : 5 », ce qui veut alors dire que pour un déplacement horizontal de 5 m, le dénivelé est de 1 m.</p>${ex("e11c.png","Panneau A : 15 % ; panneau B : 1 : 5",300)}<p>Lequel des deux panneaux suivants indique la pente la plus forte ?</p>`,
   c:`<p><b>1)</b> ABC est rectangle en B. Pour l'angle ${ang("BCA")} : AB = 10 m est le côté opposé et BC = 100 m le côté adjacent. On utilise la <b>tangente</b>.</p><p class="calc">tan(${ang("BCA")}) = {AB/BC} = {10/100} = 0,1<br>${ang("BCA")} = tan<sup>−1</sup>(0,1) ≈ 6°</p>
   <p><b>2)</b> Panneau A : 15 % signifie un dénivelé de 15 m pour 100 m, soit {15/100} = 0,15.</p><p>Panneau B : « 1 : 5 » signifie un dénivelé de 1 m pour 5 m, soit {1/5} = 0,2.</p><p>0,2 &gt; 0,15 : c'est le <b>panneau B</b> qui indique la pente la plus forte (tan<sup>−1</sup>(0,2) ≈ 11° contre tan<sup>−1</sup>(0,15) ≈ 9°).</p>`},
  {n:"Exercice 12", t:"Le trottoir roulant (d'après Brevet Asie, juin 2014)", w:"Sur ton cahier", h:`<p>Dans cet exercice, toute trace de recherche, même non aboutie, sera prise en compte.</p><p>Les gérants d'un centre commercial ont construit un parking souterrain et souhaitent installer un trottoir roulant pour accéder de ce parking au centre commercial.</p><p>Les personnes empruntant ce trottoir roulant ne doivent pas mettre plus de 1 minute pour accéder au centre commercial.</p><p>La situation est présentée par le schéma ci-dessous.</p>
   ${ex("e12.png","Trottoir roulant [PC] : PH = 25 m, CH = 4 m, triangle PHC rectangle en H",460)}
   <div class="scroll"><table class="std"><thead><tr><th>Modèle 1</th><th>Modèle 2</th></tr></thead><tbody><tr><td>Angle d'inclinaison maximum avec l'horizontale : 12°</td><td>Angle d'inclinaison maximum avec l'horizontale : 6°</td></tr><tr><td>Vitesse : 0,5 m/s</td><td>Vitesse : 0,75 m/s</td></tr></tbody></table></div>
   <p>Est-ce que l'un de ces deux modèles peut convenir pour équiper ce centre commercial ? Justifie.</p>`,
   c:`<p><b>L'angle :</b> le triangle CHP est rectangle en H. L'angle α du trottoir roulant avec l'horizontale est tel que :</p><p class="calc">tan(α) = {CH/PH} = {4/25} = 0,16<br>α = tan<sup>−1</sup>(0,16) ≈ 9,1°</p>
   <p>9,1° &lt; 12° : l'angle convient au modèle 1. Mais 9,1° &gt; 6° : le <b>modèle 2 ne convient pas</b>, la pente est trop forte.</p>
   <p><b>La durée avec le modèle 1 :</b> dans le triangle rectangle CHP, d'après le théorème de Pythagore :</p><p class="calc">CP² = 4² + 25² = 16 + 625 = 641<br>CP = √641 ≈ 25,318 m</p><p class="calc">Durée : {25,318/0,5} ≈ 50,6 s</p><p>50,6 s &lt; 1 min : <b>le modèle 1 convient</b>.</p>`},
  {n:"Exercice 13", t:"Exercice mélangé : trouver une longueur ou trouver un angle", w:"Sur ton cahier", h:`<p>Calcule la longueur du côté ou la mesure de l'angle indiqué en rédigeant.</p>
   <div class="figs">${fig("a. TAN rectangle en A : calcule AN.",ex("e13a.png","Triangle TAN rectangle en A : TA = 3,7 cm, angle TNA de 58°",200))}${fig("b. OCW rectangle en C : calcule l'angle en O.",ex("e13b.png","Triangle OCW rectangle en C : OW = 8,3 cm, CW = 2,4 cm",260))}${fig("c. LOW rectangle en O : calcule LW.",ex("e13c.png","Triangle LOW rectangle en O : OW = 1,7 cm, angle OLW de 32°",190))}</div>`,
   c:`<p><b>a.</b> Pour l'angle ${ang("TNA")} = 58° : TA = 3,7 cm est le côté opposé et AN le côté adjacent. On utilise la <b>tangente</b>.</p><p class="calc">tan(${ang("TNA")}) = {TA/AN}<br>tan(58°) = {3,7/AN}<br>AN = {3,7/tan(58°)} ≈ 2,3 cm</p>
   <p><b>b.</b> Pour l'angle ${ang("WOC")} : CW = 2,4 cm est le côté opposé et OW = 8,3 cm l'hypoténuse. On utilise le <b>sinus</b>.</p><p class="calc">sin(${ang("WOC")}) = {CW/OW} = {2,4/8,3}<br>${ang("WOC")} = sin<sup>−1</sup>({2,4/8,3}) ≈ 17°</p>
   <p><b>c.</b> Pour l'angle ${ang("OLW")} = 32° : OW = 1,7 cm est le côté opposé et LW l'hypoténuse. On utilise le <b>sinus</b>.</p><p class="calc">sin(${ang("OLW")}) = {OW/LW}<br>sin(32°) = {1,7/LW}<br>LW = {1,7/sin(32°)} ≈ 3,21 cm</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Hypoténuse, côté adjacent, côté opposé", schema:S_VOC, q:{
 1:[ {g:()=>{ const [R,P,Q]=NM(), a=ri(25,65), t=pick(TYPES), Sd=SIDES(R,P,Q);
       return {q:`Le triangle ${R}${P}${Q} est rectangle en ${R}. ${t==="hyp"?"Quelle est l'hypoténuse ?":`Quel est le ${NOMC[t]} à l'angle ${ang(Q+P+R)} ?`}`, fig:trig([R,P,Q],a,{},{mark:""}), c:[`[${Sd.adj}]`,`[${Sd.opp}]`,`[${Sd.hyp}]`], rep:`[${Sd[t]}]`,
         ex:`L'hypoténuse [${Sd.hyp}] est en face de l'angle droit ; [${Sd.adj}] touche l'angle ${ang(Q+P+R)} (adjacent) ; [${Sd.opp}] est en face de cet angle (opposé).`, sx:S_VOC}; }} ],
 2:[ {g:()=>{ const [R,P,Q]=NM(), Sd=SIDES(R,P,Q), t=pick(["adj","opp"]); return {q:`${R}${P}${Q} est rectangle en ${R}. Pour l'angle ${ang(R+Q+P)} (en ${Q}), quel est le ${NOMC[t]} ?`, c:[`[${Sd.adj}]`,`[${Sd.opp}]`,`[${Sd.hyp}]`], rep:t==="adj"?`[${Sd.opp}]`:`[${Sd.adj}]`,
       ex:`Attention : on change d'angle ! Pour l'angle en ${Q}, le côté adjacent est [${Sd.opp}] et le côté opposé est [${Sd.adj}].`, sx:S_VOC}; }} ],
 3:[ {g:()=>{ const [R,P,Q]=NM(), Sd=SIDES(R,P,Q); return {q:`${R}${P}${Q} est rectangle en ${R}. Quel côté est le côté opposé à l'angle ${ang(R+Q+P)} et le côté adjacent à l'angle ${ang(Q+P+R)} ?`, c:[`[${Sd.adj}]`,`[${Sd.opp}]`,`[${Sd.hyp}]`], rep:`[${Sd.adj}]`, ex:`[${Sd.adj}] touche l'angle en ${P} et il est en face de l'angle en ${Q}.`, sx:S_VOC}; }} ]
}},
{nom:"Choisir cos, sin ou tan", schema:S_CAH, q:{
 1:[ {q:"Le cosinus d'un angle aigu dans un triangle rectangle est égal à…", c:["{côté adjacent/hypoténuse}","{côté opposé/hypoténuse}","{côté opposé/côté adjacent}"], rep:"{côté adjacent/hypoténuse}", ex:"CAH : Cosinus = Adjacent ÷ Hypoténuse.", sx:S_CAH},
     {g:()=>{ const f=pick(["sin","tan"]); return {q:f==="sin"?"Le sinus d'un angle aigu est égal à…":"La tangente d'un angle aigu est égale à…", c:["{côté adjacent/hypoténuse}","{côté opposé/hypoténuse}","{côté opposé/côté adjacent}"], rep:f==="sin"?"{côté opposé/hypoténuse}":"{côté opposé/côté adjacent}", ex:f==="sin"?"SOH : Sinus = Opposé ÷ Hypoténuse.":"TOA : Tangente = Opposé ÷ Adjacent.", sx:S_CAH}; }} ],
 2:[ {g:()=>{ const [a,b]=shuf(TYPES).slice(0,2), f=fnOf(a,b); return {q:`On connaît l'angle et ${ART[a]}. On cherche ${ART[b]}. Quel rapport utilise-t-on ?`, c:["le cosinus","le sinus","la tangente"], rep:f==="cos"?"le cosinus":f==="sin"?"le sinus":"la tangente", ex:`${NOMC[a]} et ${NOMC[b]} : ${f==="cos"?"CAH, le cosinus":f==="sin"?"SOH, le sinus":"TOA, la tangente"}.`, sx:S_CAH}; }} ],
 3:[ {g:()=>{ const [R,P,Q]=NM(), Sd=SIDES(R,P,Q), [a,b]=shuf(TYPES).slice(0,2), f=fnOf(a,b), [nu,de]=FN[f];
       return {q:`${R}${P}${Q} est rectangle en ${R}. Quelle égalité est juste ?`, c:shuf([`${f}(${ang(Q+P+R)}) = {${Sd[nu]}/${Sd[de]}}`,`${f}(${ang(Q+P+R)}) = {${Sd[de]}/${Sd[nu]}}`,`${f==="cos"?"sin":"cos"}(${ang(Q+P+R)}) = {${Sd[nu]}/${Sd[de]}}`]), rep:`${f}(${ang(Q+P+R)}) = {${Sd[nu]}/${Sd[de]}}`,
         ex:`Pour l'angle en ${P} : [${Sd.adj}] adjacent, [${Sd.opp}] opposé, [${Sd.hyp}] hypoténuse. ${f}(${ang(Q+P+R)}) = {${Sd[nu]}/${Sd[de]}}.`, sx:S_CAH}; }} ]
}},
{nom:"Calculer une longueur", schema:S_LEN, q:{
 1:[ {g:()=>{ const a=ri(20,70), L=ri(3,12), f=pick(["cos","sin"]), r=L*val(f,a); return {q:`Dans un triangle rectangle, l'hypoténuse mesure ${L} cm et un angle aigu mesure ${a}°. Le côté ${f==="cos"?"adjacent":"opposé"} à cet angle mesure…`, c:uniq(`${L} × ${f}(${a}°)`,[`{${L}/${f}(${a}°)}`,`${L} × ${f==="cos"?"sin":"cos"}(${a}°)`]), rep:`${L} × ${f}(${a}°)`, ex:`${f}(${a}°) = {côté/${L}}, donc côté = ${L} × ${f}(${a}°) ≈ ${F(r,2)} cm.`, sx:S_LEN}; }} ],
 2:[ {g:()=>{ const G=genLen(1); const {n,a,kt,ut,kv,c}=G; const L={[kt]:F(kv)+" cm",[ut]:"?"};
       return {q:`Calcule la longueur ${c.X}, arrondie au dixième (en cm).`, fig:trig(n,a,L,{mark:a+"°"}), rep:[F(c.res,1),F(c.res,1)+" cm"], ex:c.h, sx:S_LEN}; }} ],
 3:[ {g:()=>{ const G=genLen(2); const {n,a,kt,ut,kv,c}=G, Sd=SIDES(...n);
       return {q:`${n.join("")} est rectangle en ${n[0]}, ${ang(n[2]+n[1]+n[0])} = ${a}° et ${Sd[kt]} = ${F(kv)} cm. Calcule ${c.X}, arrondie au centième (en cm).`, rep:[F(c.res,2),F(c.res,2)+" cm"], ex:c.h, sx:S_LEN}; }},
     {g:()=>{ let a,d,r; do{ a=ri(15,60); d=ri(10,40); r=d*tand(a)+1.5; }while(!safe(r,1)); return {q:`Un enfant dont les yeux sont à 1,5 m du sol regarde le haut d'un immeuble situé à ${d} m sous un angle de ${a}° avec l'horizontale. Quelle est la hauteur de l'immeuble, arrondie au dixième (en m) ?`, rep:[F(r,1),F(r,1)+" m"], ex:`tan(${a}°) = {h/${d}}, donc h = ${d} × tan(${a}°) ≈ ${F(d*tand(a),2)} m. On ajoute 1,5 m : ≈ ${F(r,1)} m.`, sx:S_LEN}; }} ]
}},
{nom:"Calculer un angle", schema:S_ANG, q:{
 1:[ {g:()=>{ const f=pick(["cos","sin","tan"]); let x,a; do{ x=ri(10,90)/100; a=inv(f,x); }while(!safe(a,0)); return {q:`${f}(x) = ${F(x)}. Quelle est la mesure de l'angle x, arrondie au degré (en °) ?`, rep:[String(Math.round(a)),Math.round(a)+"°"], ex:`x = ${f}<sup>−1</sup>(${F(x)}) ≈ ${Math.round(a)}° (touche SECONDE puis ${f}).`, sx:S_ANG}; }} ],
 2:[ {g:()=>{ const G=genAng(), {n,t1,t2,v1,v2,c}=G, L={[t1]:F(v1)+" cm",[t2]:F(v2)+" cm"}; return {q:`Calcule la mesure de l'angle ${ang(n[2]+n[1]+n[0])}, arrondie au degré (en °).`, fig:trig(n,c.a,L,{mark:"?"}), rep:[String(c.deg),c.deg+"°"], ex:c.h, sx:S_ANG}; }} ],
 3:[ {g:()=>{ const G=genAng(), {n,t1,t2,v1,v2,c}=G, Sd=SIDES(...n); return {q:`${n.join("")} est rectangle en ${n[0]}, ${Sd[t1]} = ${F(v1)} cm et ${Sd[t2]} = ${F(v2)} cm. Calcule ${ang(n[2]+n[1]+n[0])}, arrondi au degré (en °).`, rep:[String(c.deg),c.deg+"°"], ex:c.h, sx:S_ANG}; }},
     {g:()=>{ let L,h,a; do{ L=ri(30,60)/10; h=ri(20,Math.round(L*10)-3)/10; a=asind(h/L); }while(!safe(a,0)); const lim=pick([65,70,75]); return {q:`Une échelle de ${F(L)} m est appuyée contre un mur ; son haut est à ${F(h)} m du sol. Pour être stable, l'angle avec le sol doit être de ${lim}° maximum. L'échelle est-elle stable ?`, c:["Oui","Non"], rep:Math.round(a)<=lim?"Oui":"Non", ex:`sin(angle) = {${F(h)}/${F(L)}}, donc angle ≈ ${Math.round(a)}°. ${Math.round(a)<=lim?`${Math.round(a)}° ≤ ${lim}° : elle est stable.`:`${Math.round(a)}° &gt; ${lim}° : elle n'est pas stable.`}`, sx:S_ANG}; }} ]
}},
{nom:"Valeurs à la calculatrice", schema:S_VAL, q:{
 1:[ {g:()=>{ const f=pick(["cos","sin","tan"]); let a, v; do{ a=ri(5,85); v=val(f,a); }while(!safe(v,2)); return {q:`À la calculatrice, ${f}(${a}°) arrondi au centième vaut…`, rep:[F(v,2)], ex:`La calculatrice (en degrés) donne ${f}(${a}°) ≈ ${F(v,4)}, soit ${F(v,2)} au centième.`, sx:S_VAL}; }} ],
 2:[ {g:()=>{ const s=pick([["Le cosinus d'un angle aigu peut être égal à 1,2.","Faux","Le cosinus et le sinus d'un angle aigu sont toujours compris entre 0 et 1."],["Le sinus d'un angle aigu est toujours compris entre 0 et 1.","Vrai","C'est la propriété du cours."],["La tangente d'un angle aigu peut être plus grande que 1.","Vrai","Par exemple tan(80°) ≈ 5,67."],["cos(60°) = 0,5","Vrai","La calculatrice donne exactement 0,5."],["sin(30°) = 0,5","Vrai","La calculatrice donne exactement 0,5."],["Pour calculer un angle, il faut connaître un seul côté.","Faux","Il faut connaître les longueurs de deux côtés."]]); return {q:"Vrai ou faux : "+s[0], c:["Vrai","Faux"], rep:s[1], ex:s[2], sx:S_VAL}; }} ],
 3:[ {g:()=>{ const a=ri(10,80), b=ri(10,80); return a===b?{q:"Quand un angle aigu augmente, son cosinus…", c:["diminue","augmente","ne change pas"], rep:"diminue", ex:"cos(6°) ≈ 0,99 et cos(88°) ≈ 0,03.", sx:S_VAL}:{q:`Sans calculatrice : lequel est le plus grand, cos(${Math.min(a,b)}°) ou cos(${Math.max(a,b)}°) ?`, c:[`cos(${Math.min(a,b)}°)`,`cos(${Math.max(a,b)}°)`,"ils sont égaux"], rep:`cos(${Math.min(a,b)}°)`, ex:`Quand l'angle augmente, son cosinus diminue (voir l'exercice 1) : cos(${Math.min(a,b)}°) ≈ ${F(cosd(Math.min(a,b)),2)} et cos(${Math.max(a,b)}°) ≈ ${F(cosd(Math.max(a,b)),2)}.`, sx:S_VAL}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
  const f1=trig(["L","K","M"],40,{},{mark:"",rot:10,w:260,alt:"Triangle KLM rectangle en L, angle marqué en K"});
  const f2a=trig(["S","R","T"],42,{hyp:"9 cm",opp:"?"},{mark:"42°",rot:5,w:260}), f2b=trig(["E","F","D"],27,{adj:"5,4 cm",hyp:"?"},{mark:"27°",rot:180,w:260});
  const f3a=trig(["H","G","I"],atand(6/4.5),{adj:"4,5 cm",opp:"6 cm"},{mark:"?",rot:-10,w:240}), f3b=trig(["Q","P","R"],asind(0.34),{hyp:"10 cm",opp:"3,4 cm"},{mark:"?",rot:0,w:280});
  const kite=geo({P:{M:[0,0],H:[4.5,0],C:[4.5,5.36]}, poly:[["M","H","C"]], right:[["H","M","C"]], angs:[["M","H","C","50°"]], len:[["M","C","35 m"]], w:240, alt:"Fil [MC] de 35 m faisant un angle de 50° avec l'horizontale"});
  const skate=geo({P:{A:[0,0],B:[4,0],C:[4,1.5]}, poly:[["A","B","C"]], right:[["B","A","C"]], angs:[["A","B","C","?"]], len:[["A","B","4 m"],["B","C","1,5 m"]], w:300, alt:"Rampe [AC] : AB = 4 m au sol, BC = 1,5 m de haut"});
  return {
titre:"Évaluation d'entraînement · chapitre 15", duree:50, info:"Durée : 50 min · Calculatrice autorisée (en degrés) · Règle",
comp:[
  ["CONNAÎTRE","Je connais les définitions du cosinus, du sinus et de la tangente.","Ex. 1 (3 points)"],
  ["CALCULER","Je calcule une longueur avec la trigonométrie.","Ex. 2 (4 points)"],
  ["CALCULER","Je calcule la mesure d'un angle avec la trigonométrie.","Ex. 3 (4 points)"],
  ["MODÉLISER","Je résous un problème concret avec la trigonométrie.","Ex. 4 et 5 (9 points)"]
],
exos:[
{t:"Les bons rapports", p:3, h:`<p>Le triangle KLM est rectangle en L.</p>${f1}<p>Complète avec les bonnes longueurs (sans calcul) :</p><p>cos(${ang("MKL")}) = {……/……} &nbsp; sin(${ang("MKL")}) = {……/……} &nbsp; tan(${ang("MKL")}) = {……/……}</p>`,
 c:`<p>Pour l'angle ${ang("MKL")} : [KL] est le côté adjacent, [LM] le côté opposé et [KM] l'hypoténuse.</p><p class="calc">cos(${ang("MKL")}) = {KL/KM} &nbsp; sin(${ang("MKL")}) = {LM/KM} &nbsp; tan(${ang("MKL")}) = {LM/KL}</p><p><i>(1 point par rapport)</i></p>`},
{t:"Calculer des longueurs", p:4, h:`<p>Les figures ne sont pas en vraie grandeur. Arrondis au dixième.</p><div class="figs">${fig("a) RST rectangle en S : calcule ST.",f2a)}${fig("b) DEF rectangle en E : calcule DF.",f2b)}</div>`,
 c:`<p><b>a)</b> Pour l'angle ${ang("SRT")} = 42° : RT = 9 cm est l'hypoténuse et ST le côté opposé : sinus.</p><p class="calc">sin(${ang("SRT")}) = {ST/RT}<br>sin(42°) = {ST/9}<br>ST = 9 × sin(42°) ≈ 6,0 cm</p><p><i>(2 points)</i></p>
  <p><b>b)</b> Pour l'angle ${ang("EFD")} = 27° : EF = 5,4 cm est le côté adjacent et DF l'hypoténuse : cosinus.</p><p class="calc">cos(${ang("EFD")}) = {EF/DF}<br>cos(27°) = {5,4/DF}<br>DF = {5,4/cos(27°)} ≈ 6,1 cm</p><p><i>(2 points)</i></p>`},
{t:"Calculer des angles", p:4, h:`<p>Les figures ne sont pas en vraie grandeur. Arrondis au degré.</p><div class="figs">${fig("a) GHI rectangle en H : calcule l'angle en G.",f3a)}${fig("b) PQR rectangle en Q : calcule l'angle en P.",f3b)}</div>`,
 c:`<p><b>a)</b> Pour l'angle ${ang("HGI")} : HI = 6 cm est le côté opposé et GH = 4,5 cm le côté adjacent : tangente.</p><p class="calc">tan(${ang("HGI")}) = {HI/GH} = {6/4,5}<br>${ang("HGI")} = tan<sup>−1</sup>({6/4,5}) ≈ 53°</p><p><i>(2 points)</i></p>
  <p><b>b)</b> Pour l'angle ${ang("QPR")} : QR = 3,4 cm est le côté opposé et PR = 10 cm l'hypoténuse : sinus.</p><p class="calc">sin(${ang("QPR")}) = {QR/PR} = {3,4/10} = 0,34<br>${ang("QPR")} = sin<sup>−1</sup>(0,34) ≈ 20°</p><p><i>(2 points)</i></p>`},
{t:"Le cerf-volant", p:5, h:`<p>Zoé fait voler un cerf-volant. Le fil [MC], bien tendu, mesure 35 m et fait un angle de 50° avec l'horizontale.</p><p>Sa main M est à 1,2 m du sol.</p>${kite}<p><b>1)</b> Calcule la hauteur CH du cerf-volant au-dessus de la main de Zoé. Arrondis au centième.</p><p><b>2)</b> À quelle hauteur du sol se trouve le cerf-volant ?</p><p><b>3)</b> Le vent faiblit : le fil fait maintenant un angle de 40° avec l'horizontale. De combien de mètres le cerf-volant est-il descendu ? Arrondis au dixième.</p>`,
 c:`<p><b>1)</b> Le triangle MHC est rectangle en H. MC = 35 m est l'hypoténuse et CH le côté opposé à l'angle de 50° : sinus.</p><p class="calc">sin(${ang("HMC")}) = {CH/MC}<br>sin(50°) = {CH/35}<br>CH = 35 × sin(50°) ≈ 26,81 m</p><p><i>(2,5 points)</i></p>
  <p><b>2)</b> 26,81 + 1,2 = 28,01 : le cerf-volant est à environ <b>28,01 m</b> du sol. <i>(1 point)</i></p>
  <p><b>3)</b> Nouvelle hauteur au-dessus de la main : 35 × sin(40°) ≈ 22,50 m. Il est descendu de 26,81 − 22,50 ≈ <b>4,3 m</b>. <i>(1,5 point)</i></p>`},
{t:"La rampe de skate", p:4, h:`<p>Une rampe de skate [AC] monte de 1,5 m de haut pour 4 m au sol.</p>${skate}<p><b>1)</b> Calcule l'angle ${ang("BAC")} que fait la rampe avec le sol. Arrondis au degré.</p><p><b>2)</b> Pour les débutants, l'angle ne doit pas dépasser 25°. La rampe convient-elle aux débutants ?</p><p><b>3)</b> Calcule la longueur AC de la rampe. Arrondis au centième.</p>`,
 c:`<p><b>1)</b> Le triangle ABC est rectangle en B. BC = 1,5 m est le côté opposé et AB = 4 m le côté adjacent : tangente.</p><p class="calc">tan(${ang("BAC")}) = {BC/AB} = {1,5/4} = 0,375<br>${ang("BAC")} = tan<sup>−1</sup>(0,375) ≈ 21°</p><p><i>(2 points)</i></p>
  <p><b>2)</b> 21° &lt; 25° : <b>la rampe convient aux débutants</b>. <i>(0,5 point)</i></p>
  <p><b>3)</b> D'après le théorème de Pythagore : AC² = 4² + 1,5² = 16 + 2,25 = 18,25, donc AC = √18,25 ≈ <b>4,27 m</b>. <i>(1,5 point)</i></p>`}
]}; })()
};
})();
