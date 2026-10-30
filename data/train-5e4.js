/* 5e · chapitre 4 — fiche d'entraînement : les exercices de la fiche de classe, avec d'autres figures et d'autres mesures.
   Les figures sont calculées : les longueurs et les angles annoncés sont ceux du dessin (à l'échelle). */
TRAIN["5e-4"] = function(){
const {ri, pick, shuf} = TR;
const {fq, P, add, sub, mul, dist, fourth, inter2, MAP} = window.FIG54;
const fr = x => String(Math.round(x*100)/100).replace(".",",");
const ov = t => `<span class="ang">${t}</span>`;
const d10 = (a,b) => ri(Math.ceil(a*10-1e-9), Math.floor(b*10+1e-9))/10;   /* bornes arrondies au dixième : jamais de longueur à 2 décimales */                         /* longueur au mm près */
const tri = (a,b,c) => a+b>c+0.6 && a+c>b+0.6 && b+c>a+0.6;     /* triangle bien formé */
const S4 = 26, FIT = 170;
const LET = "ABCDEFGHJKLMNPRSTUVXYZ";

/* ===== Exercice 1 : trois paires de droites parallèles colorées ===== */
const E1 = (()=>{ const W=480, H=300;
  for(let g=0; g<40000; g++){
    const fam = [["#e53935","rouges",ri(-8,8)],["#1e88e5","bleues",ri(105,130)],["#43a047","vertes",ri(22,38)]].map(([col,nom,a])=>{
      const u=[Math.cos(a*Math.PI/180), -Math.sin(a*Math.PI/180)], n=[-u[1],u[0]], c=[W/2+ri(-30,30), H/2+ri(-20,20)], gap=ri(70,110), o=ri(-100,100);
      return {col, nom, u, lines:[add(c,mul(n,o-gap/2)), add(c,mul(n,o+gap/2))]}; });
    const X=(p,u,q,v)=>{ const det=u[0]*v[1]-u[1]*v[0]; if(Math.abs(det)<0.2) return null; const t=((q[0]-p[0])*v[1]-(q[1]-p[1])*v[0])/det; return add(p,mul(u,t)); };
    const quads=[], pts=[]; let okk=true;
    [[0,1],[0,2],[1,2]].forEach(([i,j])=>{ const F=fam[i], G=fam[j], q=[X(F.lines[0],F.u,G.lines[0],G.u), X(F.lines[0],F.u,G.lines[1],G.u), X(F.lines[1],F.u,G.lines[1],G.u), X(F.lines[1],F.u,G.lines[0],G.u)];
      if(q.some(p=>!p||p[0]<30||p[0]>W-30||p[1]<26||p[1]>H-24)) okk=false; quads.push({i,j,q}); pts.push(...q); });
    if(!okk || !pts.every((p,a)=>pts.every((r,b)=>b<=a||dist(p,r)>=32))) continue;
    const names=shuf(LET.split("")).slice(0,12); let k=0; quads.forEach(Q=>Q.n=Q.q.map(()=>names[k++]));
    const clip=(p,u)=>{ const ts=[]; [[0,W],[1,H]].forEach(([ax,lim])=>{ if(Math.abs(u[ax])>1e-9){ ts.push((0-p[ax])/u[ax], (lim-p[ax])/u[ax]); } }); const inn=ts.map(t=>add(p,mul(u,t))).filter(r=>r[0]>=-0.1&&r[0]<=W+0.1&&r[1]>=-0.1&&r[1]<=H+0.1); return inn.length>=2?[inn[0],inn[inn.length-1]]:null; };
    let svg=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Trois paires de droites parallèles">`;
    for(const F of fam) for(const L of F.lines){ const c=clip(L,F.u); if(!c){ okk=false; break; } svg+=`<line x1="${c[0][0].toFixed(1)}" y1="${c[0][1].toFixed(1)}" x2="${c[1][0].toFixed(1)}" y2="${c[1][1].toFixed(1)}" style="stroke:${F.col};stroke-width:2.2"/>`; }
    if(!okk) continue;
    quads.forEach(Q=>Q.q.forEach((p,m)=>{ svg+=`<text x="${(p[0]+7).toFixed(1)}" y="${(p[1]-7).toFixed(1)}" class="glab" style="font-size:15px">${Q.n[m]}</text>`; }));
    return {svg:svg+"</svg>", quads, fam}; }
})();

/* ===== Exercice 2 : sur quadrillage ===== */
const G2 = (()=>{ for(let g=0; g<3000; g++){ const A=[ri(0,10),ri(0,7)], B=[ri(0,10),ri(0,7)], Cc=[ri(0,10),ri(0,7)], D=add(B,sub(Cc,A)), E=add(A,sub(B,Cc));
  const inG=p=>p[0]>=0&&p[0]<=10&&p[1]>=0&&p[1]<=7, cr=(sub(B,A)[0]*sub(Cc,A)[1]-sub(B,A)[1]*sub(Cc,A)[0]);
  const all=[A,B,Cc,D,E]; if(!inG(D)||!inG(E)||Math.abs(cr)<4||!all.every((p,i)=>all.every((q,j)=>j<=i||dist(p,q)>=2))) continue; if(dist(A,B)<3||dist(A,Cc)<3||dist(B,Cc)<3) continue; return {A,B,C:Cc,D,E}; } })();
const mv = (dx,dy) => [dx?`${Math.abs(dx)} carreau${Math.abs(dx)>1?"x":""} vers la ${dx>0?"droite":"gauche"}`:"", dy?`${Math.abs(dy)} carreau${Math.abs(dy)>1?"x":""} vers le ${dy>0?"bas":"haut"}`:""].filter(Boolean).join(" et ");
const gfig = (pts, extra={}) => geo({pts, grid:{c:10,r:7}, s:30, w:350, marks:Object.keys(pts), ...extra});

/* ===== Exercice 3 ===== */
const e3 = (()=>{ const ab=d10(4,6.5), bc=d10(2,4), ang=pick([50,55,60,65,70,75,110,115,120,125,130]);
  const A=[0,0], B=[ab,0], Cc=add(B,P(bc,180-ang)), D=fourth(A,B,Cc);
  let a,b,c; do{ a=d10(1.8,3.5); b=d10(1.8,3.5); c=d10(2.5,6); }while(!tri(a,b,c)||Math.abs(a-b)<0.4);
  const th=Math.acos((a*a+b*b-c*c)/(2*a*b))*180/Math.PI, O=[0,0], I=P(a,35), R=P(b,35-th);
  return {ab,bc,ang,P1:{A,B,C:Cc,D}, a,b,c, P2:{O,I,R,L:mul(R,-1),E:mul(I,-1)}}; })();
/* ===== Activité 2 ===== */
const a2 = (()=>{ let a,b,c; do{ a=d10(1.8,3.5); b=d10(2,4); c=d10(3,6); }while(!tri(a,b,c)||Math.abs(a-b)<0.4);
  const th=Math.acos((a*a+b*b-c*c)/(2*a*b))*180/Math.PI, E=[0,0], Cc=P(a,40), B=P(b,40-th); return {a,b,c, pts:{E,C:Cc,B,A:mul(Cc,-1),D:mul(B,-1)}}; })();

/* ===== Exercice 4 ===== */
const X4 = (()=>{ const o={};
  { const oi=d10(3,5), ol=d10(2,3), ang=ri(100,135); const O=[0,0], I=[oi,0], L=P(ol,-ang); o.a={oi,ol,ang,pts:{O,I,L,N:add(L,I)}}; }
  { let ij,jk,ik; do{ ij=d10(4.5,7); jk=d10(3,4.5); ik=d10(Math.max(ij,jk)+0.6, ij+jk-0.8); }while(!tri(ij,jk,ik)); const I=[0,0], J=[ij,0], K=inter2(I,J,ik,jk); o.b={ij,jk,ik,pts:{I,J,K,L:fourth(K,J,I)}}; }
  { const gs=d10(1.8,3), si=d10(4,6), ang=ri(40,70); const S=[0,0], I=[si,0], G=P(gs,ang); o.c={gs,si,ang,pts:{S,I,G,R:add(G,I)}}; }
  { let fg,fj,jg; do{ fg=d10(4.5,6.5); fj=d10(2.5,4.5); jg=d10(2,4); }while(!tri(fg,fj,jg)); const J=[0,0], F=P(fj,100), th=Math.acos((fj*fj+jg*jg-fg*fg)/(2*fj*jg))*180/Math.PI, G=P(jg,100-th); o.d={fg,fj,jg,pts:{J,F,G,H:mul(F,-1),I:mul(G,-1)}}; }
  { const de=d10(3.5,5), ec=d10(1.8,3), ang=ri(60,85); const E=[0,0], D=P(de,200), Cc=P(ec,200+ang); o.e={de,ec,ang,pts:{E,D,C:Cc,B:mul(D,-1),A:mul(Cc,-1)}}; }
  { let ro,rm,om; do{ ro=d10(3,5); om=d10(3.5,5.5); rm=d10(Math.max(ro,om)+0.5, ro+om-0.8); }while(!tri(ro,om,rm)); const R=[0,0], O=[ro,0], M=inter2(R,O,rm,om); o.f={ro,rm,om,pts:{R,O,M,E:fourth(R,O,M)}}; }
  { const lu=d10(2.5,4), un=d10(4.5,6), ang=ri(100,130); const U=[0,0], N=[un,0], L=P(lu,ang); o.g={lu,un,ang,pts:{U,N,L,E:add(L,N)}}; }
  return o; })();

/* ===== Activité 3 ===== */
const A3 = shuf([
 ["Si un quadrilatère a deux côtés opposés parallèles, alors c'est un parallélogramme.", false, "un trapèze a deux côtés opposés parallèles, mais ce n'est pas un parallélogramme."],
 ["Si un quadrilatère a ses côtés opposés parallèles, alors c'est un parallélogramme.", true, "c'est la définition."],
 ["Si un quadrilatère a deux côtés opposés de même longueur, alors c'est un parallélogramme.", false, "un trapèze peut avoir deux côtés opposés de même longueur sans être un parallélogramme."],
 ["Si un quadrilatère a ses côtés opposés de même longueur, alors c'est un parallélogramme.", true, "c'est la propriété 2 du cours."],
 ["Si un quadrilatère a deux côtés opposés parallèles et de même longueur, alors c'est un parallélogramme.", true, "c'est la propriété 3 du cours."],
 ["Si un quadrilatère a ses diagonales qui se coupent en leur milieu, alors c'est un parallélogramme.", true, "c'est la propriété 4 du cours."],
 ["Si un quadrilatère a des diagonales de même longueur, alors c'est un parallélogramme.", false, "il faut aussi que les diagonales se coupent en leur milieu."]
]).slice(0,6);

/* ===== Exercice 5 : six quadrilatères ===== */
const PG = () => { const b=d10(3,3.8), h=d10(1.4,1.9), s=d10(0.6,1.2); return {A:[0,0],B:[b,0],C:[b+s,h],D:[s,h]}; };
const K5 = {
 none:   ()=>({f:fq({pts:PG(), poly:["A","B","C","D"], hide:["A","B","C","D"], s:24, m:16}), ok:false, why:"Aucune information : on ne peut rien prouver, même s'il « a l'air » d'un parallélogramme."}),
 opp:    ()=>({f:fq({pts:PG(), poly:["A","B","C","D"], ticks:[["A","B",1],["D","C",1],["B","C",2],["A","D",2]], hide:["A","B","C","D"], s:24, m:16}), ok:true, why:"Ses côtés opposés sont de même longueur (codages). Or si un quadrilatère a ses côtés opposés de même longueur, alors c'est un parallélogramme."}),
 pareq:  ()=>{ const n=pick(["4","5","3,5","6"]); return {cap:"(LI) // (ER)", f:fq({pts:(()=>{ const p=PG(); return {L:p.D,I:p.C,R:p.B,E:p.A}; })(), poly:["L","I","R","E"], lens:[["L","I",n],["E","R",n]], s:24}), ok:true, why:`(LI) // (ER) et LI = ER = ${n}. Or si un quadrilatère a deux côtés opposés parallèles et de même longueur, alors c'est un parallélogramme.`}; },
 diag:   ()=>{ const p=PG(); p.O=mul(add(p.A,p.C),.5); return {f:fq({pts:p, poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], ticks:[["A","O",2],["O","C",2],["B","O",1],["O","D",1]], hide:["A","B","C","D","O"], s:24, m:16}), ok:true, why:"Ses diagonales se coupent en leur milieu (codages). Or si un quadrilatère a ses diagonales qui se coupent en leur milieu, alors c'est un parallélogramme."}; },
 consec: ()=>{ const n=pick(["5","4","6"]); return {f:fq({pts:{A:[0,0],B:[3.4,0],C:[2.8,1.7],D:[0,1.7]}, poly:["A","B","C","D"], lens:[["D","C",n],["A","D",n]], hide:["A","B","C","D"], s:24, m:20}), ok:false, why:"Deux côtés <b>consécutifs</b> de même longueur ne suffisent pas."}; },
 diageq: ()=>{ const n=pick(["8","7","6"]); return {f:fq({pts:{A:[0,0],B:[4,0],C:[3.1,1.7],D:[0.9,1.7]}, poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], lens:[["A","C",n,1,12,0.78],["B","D",n,-1,12,0.78]], hide:["A","B","C","D"], s:24, m:16}), ok:false, why:"Des diagonales de même longueur ne suffisent pas : il faut qu'elles se coupent en leur milieu."}; },
 onepar: ()=>({cap:"(AB) // (DC)", f:fq({pts:{A:[0,0],B:[4,0],C:[3,1.7],D:[0.7,1.7]}, poly:["A","B","C","D"], s:24}), ok:false, why:"Une seule paire de côtés parallèles ne suffit pas (c'est peut-être un trapèze, comme ici)."})
};
const k5 = shuf(["opp","pareq","diag", pick(["none","onepar"]), "consec","diageq"]);
const ex5 = k5.map(k=>K5[k]());
const L5 = "abcdef";

/* ===== Activité 4 ===== */
const A4 = shuf([["Un parallélogramme qui a un angle droit est un ……","rectangle"],["Un parallélogramme qui a des diagonales de même longueur est un ……","rectangle"],["Un parallélogramme qui a deux côtés consécutifs de même longueur est un ……","losange"],["Un parallélogramme qui a des diagonales perpendiculaires est un ……","losange"],["Un rectangle qui a des diagonales perpendiculaires est un ……","carré"],["Un losange qui a un angle droit est un ……","carré"],["Un rectangle qui a deux côtés consécutifs de même longueur est un ……","carré"],["Un losange qui a des diagonales de même longueur est un ……","carré"]]).slice(0,6);

/* ===== Exercice 6 : nature avec les côtés ===== */
const K6 = {
 r1:()=>{ const w=d10(2.6,3.4), h=d10(1.4,2); const p={A:[0,0],B:[w,0],C:[w,h],D:[0,h]}; return {nat:"rectangle", f:fq({pts:p, poly:["A","B","C","D"], rights:[["A","B","D"]], hide:Object.keys(p), s:26, m:12}), why:"est un parallélogramme qui a un angle droit (deux côtés consécutifs perpendiculaires). Or si un parallélogramme a deux côtés consécutifs perpendiculaires, alors c'est un rectangle."}; },
 r4:()=>{ const w=d10(2.6,3.4), h=d10(1.4,2); const p={A:[0,0],B:[w,0],C:[w,h],D:[0,h]}; return {nat:"rectangle", f:fq({pts:p, poly:["A","B","C","D"], rights:[["A","B","D"],["B","C","A"],["C","D","B"],["D","A","C"]], hide:Object.keys(p), s:26, m:12}), why:"est un parallélogramme qui a des angles droits. Or si un parallélogramme a deux côtés consécutifs perpendiculaires, alors c'est un rectangle."}; },
 l2:()=>{ const c=d10(2,2.6), a=ri(50,70); const p={A:[0,0],B:[c,0],D:P(c,a)}; p.C=add(p.B,p.D); return {nat:"losange", f:fq({pts:p, poly:["A","B","C","D"], ticks:[["A","B",1],["B","C",1]], hide:Object.keys(p), s:26, m:12}), why:"est un parallélogramme qui a deux côtés consécutifs de même longueur. Or si un parallélogramme a deux côtés consécutifs de même longueur, alors c'est un losange."}; },
 l4:()=>{ const c=d10(2,2.6), a=ri(50,70); const p={A:[0,0],B:[c,0],D:P(c,a)}; p.C=add(p.B,p.D); return {nat:"losange", f:fq({pts:p, poly:["A","B","C","D"], ticks:[["A","B",1],["B","C",1],["C","D",1],["D","A",1]], hide:Object.keys(p), s:26, m:12}), why:"est un parallélogramme qui a deux côtés consécutifs de même longueur. Or si un parallélogramme a deux côtés consécutifs de même longueur, alors c'est un losange."}; },
 c1:()=>{ const c=d10(1.8,2.2); const p={A:[0,0],B:[c,0],C:[c,c],D:[0,c]}; return {nat:"carré", f:fq({pts:p, poly:["A","B","C","D"], rights:[["A","B","D"]], ticks:[["A","B",1],["A","D",1]], hide:Object.keys(p), s:26, m:12}), why:"est un parallélogramme qui a un angle droit et deux côtés consécutifs de même longueur. Or si un parallélogramme a deux côtés consécutifs perpendiculaires et de même longueur, alors c'est un carré."}; },
 c4:()=>{ const c=d10(1.8,2.2); const p={A:[0,0],B:[c,0],C:[c,c],D:[0,c]}; return {nat:"carré", f:fq({pts:p, poly:["A","B","C","D"], rights:[["A","B","D"],["B","C","A"],["C","D","B"],["D","A","C"]], ticks:[["A","B",1],["B","C",1],["C","D",1],["D","A",1]], hide:Object.keys(p), s:26, m:12}), why:"est un parallélogramme qui a un angle droit et deux côtés consécutifs de même longueur. Or si un parallélogramme a deux côtés consécutifs perpendiculaires et de même longueur, alors c'est un carré."}; },
 q:()=>{ const p=PG(); return {nat:"parallélogramme (rien de plus)", f:fq({pts:p, poly:["A","B","C","D"], ticks:[["A","B",1],["D","C",1]], hide:Object.keys(p), s:26, m:12}), why:"n'a ni angle droit codé, ni deux côtés consécutifs de même longueur : on ne peut rien dire de plus."}; }
};
const ex6 = shuf([pick(["r1","r4"]), pick(["l2","l4"]), pick(["c1","c4"]), pick(["r1","r4"]), pick(["l2","l4"]), pick(["c1","c4","q"])]).map(k=>K6[k]());
const just6 = (()=>{ const i=ex6.findIndex(x=>x.nat==="rectangle"||x.nat==="losange"), j=ex6.findIndex(x=>x.nat==="carré"); return [i, j>=0?j:ex6.findIndex((x,k)=>k!==i&&x.nat!=="parallélogramme (rien de plus)")].filter(x=>x>=0); })();

/* ===== Exercice 7 : nature avec les diagonales ===== */
const diagFig = (kind, N) => { const L=2.1, th=kind==="los"||kind==="car"?90:ri(55,70), l1=L, l2=(kind==="rect"||kind==="car")?L:d10(1.1,1.5), a0=ri(20,35);
  const O=[0,0], A=P(l1,a0+180), Cc=P(l1,a0), B=P(l2,a0+180+th), D=P(l2,a0+th); const pts={[N[0]]:A,[N[1]]:B,[N[2]]:Cc,[N[3]]:D,O};
  const same=kind==="rect"||kind==="car"; const r = (kind==="los"||kind==="car") ? [["O",N[2],N[3]]] : [];
  return fq({pts, segs:[[N[0],N[2],"ln"],[N[1],N[3],"ln"]], ticks:[[N[0],"O",2],["O",N[2],2],[N[1],"O",same?2:1],["O",N[3],same?2:1]], rights:r, hide:["O"], s:30, m:22}); };
const NAT7 = {rect:"rectangle", los:"losange", car:"carré", par:"parallélogramme"};
const WHY7 = {rect:"ses diagonales se coupent en leur milieu, donc c'est un parallélogramme. De plus, ses diagonales ont la même longueur. Or si un parallélogramme a des diagonales de même longueur, alors c'est un rectangle.",
  los:"ses diagonales se coupent en leur milieu, donc c'est un parallélogramme. De plus, ses diagonales sont perpendiculaires. Or si un parallélogramme a des diagonales perpendiculaires, alors c'est un losange.",
  car:"ses diagonales se coupent en leur milieu, donc c'est un parallélogramme. De plus, ses diagonales sont de même longueur et perpendiculaires. Or si un parallélogramme a des diagonales de même longueur et perpendiculaires, alors c'est un carré.",
  par:"ses diagonales se coupent en leur milieu : c'est un parallélogramme. Elles n'ont pas la même longueur et ne sont pas perpendiculaires : on ne peut rien dire de plus."};
const k7 = shuf(["rect","los","car","par"]);
const N7 = shuf(["ABCD","EFGH","IJKL","MNPR","STUV"]).slice(0,4);
const ex7 = k7.map((k,i)=>({k, name:N7[i], f:diagFig(k, N7[i].split(""))}));
const just7 = shuf([0,1,2,3].filter(i=>ex7[i].k!=="par")).slice(0,2).sort();

/* ===== Exercices 8 et 9 ===== */
const x8a = (()=>{ const c=d10(3,5), a=ri(25,50); const K=[0,0], J=P(c,180-a/2), L=P(c,180+a/2); return {c,a,pts:{K,J,L,I:fourth(J,K,L)}}; })();
const x8b = (()=>{ const no=d10(3,4.5), ni=d10(no+0.8,no+2); const h=Math.sqrt(ni*ni-no*no); return {no,ni,pts:{N:[0,0],O:[no,0],I:[no,h],L:[0,h]}}; })();
const x9a = (()=>{ const a=d10(2.5,4), b=d10(1.5,2.5); return {a,b,pts:{E:[0,a],F:[-b,0],G:[0,-a],H:[b,0],O:[0,0]}}; })();
const x9b = (()=>{ const ad=d10(4.5,6.5), h2=d10(ad/2+0.5, ad/2+1.5); const h=Math.sqrt(4*h2*h2-ad*ad); return {ad,h2,pts:{A:[0,h],D:[ad,h],C:[ad,0],B:[0,0],O:[ad/2,h/2]}}; })();
const x9c = (()=>{ const d=2*d10(1.5,3);   /* PN pair en dixièmes : la moitié PK reste au mm près */ const c=d/Math.SQRT2; return {d,pts:{M:[0,c],N:[c,c],O:[c,0],P:[0,0],K:[c/2,c/2]}}; })();

return [
 {t:"Repérer et tracer des parallélogrammes", e:[
  {n:"Exercice 1", t:"Repérer des parallélogrammes", w:"Sur ton cahier", h:`${E1.svg}<p>Donne trois noms de parallélogrammes de la figure, sachant que deux droites de même couleur sont parallèles entre elles.</p>`,
   c:`<p>Chaque parallélogramme est formé par deux paires de droites parallèles.</p>${E1.quads.map(Q=>`<p>Droites ${E1.fam[Q.i].nom} et droites ${E1.fam[Q.j].nom} : <b>${Q.n.join("")}</b>.</p>`).join("")}<p><i>On peut partir de n'importe quel sommet et tourner dans un sens ou dans l'autre, mais les sommets doivent se suivre.</i></p>`},
  {n:"Exercice 2", t:"Tracer des parallélogrammes", w:"Sur ton cahier", h:`<p>Reproduis les points A, B et C sur ton cahier : <b>un carreau de la figure = un carreau de ton cahier</b>.</p>${gfig({A:G2.A,B:G2.B,C:G2.C})}<p>a) Place le point D tel que ABDC soit un parallélogramme. b) Place le point E tel que AEBC soit un parallélogramme.</p>`,
   c:`<p>a) ABDC est un parallélogramme : [AB] et [CD] sont des côtés opposés, donc ils sont parallèles et de même longueur. Pour aller de A à B : ${mv(G2.B[0]-G2.A[0],G2.B[1]-G2.A[1])}. Je fais le même déplacement à partir de C : j'arrive en D.</p>
   <p>b) AEBC est un parallélogramme : [AE] et [BC] sont des côtés opposés. Pour aller de C à B : ${mv(G2.B[0]-G2.C[0],G2.B[1]-G2.C[1])}. Je fais le même déplacement à partir de A : j'arrive en E.</p>
   ${gfig(G2,{polys:[{v:["A","B","D","C"]},{v:["A","E","B","C"],k:"img"}]})}`},
  {n:"Exercice 3", t:"Lire les informations sur un parallélogramme", w:"Sur ton cahier", h:`<p>ABCD et LIRE sont des parallélogrammes ; LIRE a pour centre O. Les longueurs sont en cm. <i>Les figures ne sont pas en vraie grandeur.</i></p>
   <div class="figs">${fq({pts:e3.P1, poly:["A","B","C","D"], arcs:[["B","A","C",e3.ang+"°"]], lens:[["A","B",fr(e3.ab)+" cm"],["B","C",fr(e3.bc)+" cm"]], s:30})}${fq({pts:e3.P2, poly:["L","I","R","E"], segs:[["L","R"],["I","E"]], marks:["O"], lens:[["O","I",fr(e3.a)],["O","R",fr(e3.b)],["I","R",fr(e3.c)]], s:30})}</div>
   <p>En t'aidant des propriétés du cours, recopie chaque figure et écris dessus le maximum d'informations.</p>`,
   c:`<p><b>ABCD :</b> (AB) // (DC) et (AD) // (BC) · DC = AB = ${fr(e3.ab)} cm et AD = BC = ${fr(e3.bc)} cm · ${ov("ADC")} = ${ov("ABC")} = ${e3.ang}°, et ${ov("DAB")} = ${ov("BCD")}.</p>
   <p><b>LIRE :</b> (LI) // (ER) et (LE) // (IR) · LE = IR = ${fr(e3.c)} cm · OE = OI = ${fr(e3.a)} cm et OL = OR = ${fr(e3.b)} cm, donc IE = 2 × ${fr(e3.a)} = ${fr(2*e3.a)} cm et LR = 2 × ${fr(e3.b)} = ${fr(2*e3.b)} cm.</p>
   ${fq({pts:e3.P2, poly:["L","I","R","E"], segs:[["L","R"],["I","E"]], marks:["O"], lens:[["O","I",fr(e3.a)],["O","R",fr(e3.b)],["I","R",fr(e3.c)],["O","E",fr(e3.a)],["O","L",fr(e3.b)],["L","E",fr(e3.c)]], ticks:[["O","I",1],["O","E",1],["O","R",2],["O","L",2]], s:44})}`},
  {n:"Activité 2", t:"Utiliser les propriétés pour démontrer et construire", w:"Sur ton cahier", h:`<p>ABCD est un parallélogramme de centre E. On donne : EC = ${fr(a2.a)} cm, EB = ${fr(a2.b)} cm et BC = ${fr(a2.c)} cm. <i>La figure n'est pas en vraie grandeur.</i></p>
   ${fq({pts:a2.pts, poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], marks:["E"], lens:[["E","C",fr(a2.a)],["E","B",fr(a2.b)],["B","C",fr(a2.c)]], s:30})}<p>1. Donne les longueurs DE et EA. Justifie. 2. Construis ce parallélogramme en vraie grandeur.</p>`,
   c:`<p>1. Je sais que ABCD est un parallélogramme de centre E. Or si un quadrilatère est un parallélogramme, alors ses diagonales se coupent en leur milieu. Donc DE = EB = ${fr(a2.b)} cm et EA = EC = ${fr(a2.a)} cm.</p>
   <p>2.</p><ol><li>Je trace [BC] de ${fr(a2.c)} cm.</li><li>Un arc de centre C et de rayon ${fr(a2.a)} cm, un arc de centre B et de rayon ${fr(a2.b)} cm : ils se coupent en E.</li><li>Sur la demi-droite [CE), je place A tel que EA = ${fr(a2.a)} cm.</li><li>Sur la demi-droite [BE), je place D tel que ED = ${fr(a2.b)} cm.</li><li>Je trace ABCD.</li></ol>
   ${fq({pts:a2.pts, poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], marks:["E"], ticks:[["E","C",1],["E","A",1],["E","B",2],["E","D",2]], s:30})}`},
  {n:"Exercice 4", t:"Tracés de parallélogrammes", w:"Sur ton cahier", h:`<p>Construis ces parallélogrammes en vraie grandeur sur ton cahier. Pour c), f) et g), fais un dessin à main levée avant de les tracer. <i>Les figures a), b), d) et e) ne sont pas en vraie grandeur.</i></p>
   <div class="cgrid">
    <figure><figcaption><b>a)</b> le parallélogramme OINL</figcaption>${fq({pts:X4.a.pts, poly:["O","I","N","L"], arcs:[["O","I","L",X4.a.ang+"°","#e57fb0"]], lens:[["O","I",fr(X4.a.oi)+" cm"],["O","L",fr(X4.a.ol)+" cm"]], s:S4, fit:FIT})}</figure>
    <figure><figcaption><b>b)</b> le parallélogramme LKJI</figcaption>${fq({pts:X4.b.pts, poly:["L","K","J","I"], segs:[["I","K","ln"]],  s:S4, fit:FIT})}<p class="dat">${"IJ = "+fr(X4.b.ij)+" cm"} · ${"JK = "+fr(X4.b.jk)+" cm"} · ${"IK = "+fr(X4.b.ik)+" cm"}</p></figure>
    <figure><figcaption><b>d)</b> le parallélogramme FGHI de centre J</figcaption>${fq({pts:X4.d.pts, poly:["F","G","H","I"], segs:[["F","H"],["G","I"]], marks:["J"],  s:S4, fit:FIT})}<p class="dat">${"FG = "+fr(X4.d.fg)+" cm"} · ${"FJ = "+fr(X4.d.fj)+" cm"} · ${"JG = "+fr(X4.d.jg)+" cm"}</p></figure>
    <figure><figcaption><b>e)</b> le parallélogramme ABCD de centre E</figcaption>${fq({pts:X4.e.pts, poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], marks:["E"], arcs:[["E","D","C",X4.e.ang+"°","#7fb2e5"]],  s:S4, fit:FIT})}<p class="dat">${"DE = "+fr(X4.e.de)+" cm"} · ${"EC = "+fr(X4.e.ec)+" cm"}</p></figure>
   </div>
   <p>c) Trace un parallélogramme GRIS tel que GS = ${fr(X4.c.gs)} cm, SI = ${fr(X4.c.si)} cm et ${ov("GSI")} = ${X4.c.ang}°.</p><p>f) Trace un parallélogramme ROME tel que RO = ${fr(X4.f.ro)} cm, RM = ${fr(X4.f.rm)} cm et OM = ${fr(X4.f.om)} cm.</p><p>g) Trace un parallélogramme LUNE tel que LU = ${fr(X4.g.lu)} cm, UN = ${fr(X4.g.un)} cm et ${ov("LUN")} = ${X4.g.ang}°.</p>`,
   c:`<p>Les figures ci-dessous sont à l'échelle, mais réduites : sur ton cahier, les longueurs doivent être celles de l'énoncé.</p>
   <div class="cgrid">
    <figure><figcaption><b>a)</b> [OI] de ${fr(X4.a.oi)} cm, angle de ${X4.a.ang}° en O, L à ${fr(X4.a.ol)} cm de O. N est à ${fr(X4.a.ol)} cm de I et à ${fr(X4.a.oi)} cm de L.</figcaption>${fq({pts:X4.a.pts, poly:["O","I","N","L"], arcs:[["O","I","L",X4.a.ang+"°","#e57fb0"]], s:S4, fit:FIT})}</figure>
    <figure><figcaption><b>b)</b> [IJ] de ${fr(X4.b.ij)} cm. K est à ${fr(X4.b.jk)} cm de J et à ${fr(X4.b.ik)} cm de I. L est à ${fr(X4.b.ij)} cm de K et à ${fr(X4.b.jk)} cm de I.</figcaption>${fq({pts:X4.b.pts, poly:["L","K","J","I"], segs:[["I","K","cons"]], s:S4, fit:FIT})}</figure>
    <figure><figcaption><b>c)</b> [SI] de ${fr(X4.c.si)} cm, angle de ${X4.c.ang}° en S, G à ${fr(X4.c.gs)} cm de S. R est à ${fr(X4.c.si)} cm de G et à ${fr(X4.c.gs)} cm de I.</figcaption>${fq({pts:X4.c.pts, poly:["G","R","I","S"], arcs:[["S","I","G",X4.c.ang+"°"]], s:S4, fit:FIT})}</figure>
    <figure><figcaption><b>d)</b> Triangle FJG (FG = ${fr(X4.d.fg)} cm, FJ = ${fr(X4.d.fj)} cm, JG = ${fr(X4.d.jg)} cm). Puis H sur [FJ) avec JH = ${fr(X4.d.fj)} cm, et I sur [GJ) avec JI = ${fr(X4.d.jg)} cm.</figcaption>${fq({pts:X4.d.pts, poly:["F","G","H","I"], segs:[["F","H"],["G","I"]], marks:["J"], s:S4, fit:FIT})}</figure>
    <figure><figcaption><b>e)</b> Les diagonales se coupent en leur milieu : DB = 2 × ${fr(X4.e.de)} = ${fr(2*X4.e.de)} cm et AC = 2 × ${fr(X4.e.ec)} = ${fr(2*X4.e.ec)} cm. Je trace [DB] et son milieu E, puis une droite qui fait un angle de ${X4.e.ang}° avec [ED] en E ; C et A sont à ${fr(X4.e.ec)} cm de E.</figcaption>${fq({pts:X4.e.pts, poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], marks:["E"], arcs:[["E","D","C",X4.e.ang+"°","#7fb2e5"]], s:S4, fit:FIT})}</figure>
    <figure><figcaption><b>f)</b> Triangle ROM (RO = ${fr(X4.f.ro)} cm, RM = ${fr(X4.f.rm)} cm, OM = ${fr(X4.f.om)} cm). E est à ${fr(X4.f.om)} cm de R et à ${fr(X4.f.ro)} cm de M.</figcaption>${fq({pts:X4.f.pts, poly:["R","O","M","E"], segs:[["R","M","cons"]], s:S4, fit:FIT})}</figure>
    <figure><figcaption><b>g)</b> [UN] de ${fr(X4.g.un)} cm, angle de ${X4.g.ang}° en U, L à ${fr(X4.g.lu)} cm de U. E est à ${fr(X4.g.un)} cm de L et à ${fr(X4.g.lu)} cm de N.</figcaption>${fq({pts:X4.g.pts, poly:["L","U","N","E"], arcs:[["U","N","L",X4.g.ang+"°","#e57fb0"]], s:S4, fit:FIT})}</figure>
   </div>`}
 ]},
 {t:"Prouver qu'un quadrilatère est un parallélogramme", e:[
  {n:"Activité 3", t:"Vraie ou fausse ?", w:"Sur ton cahier", h:`<p>Parmi ces propriétés, certaines sont vraies et d'autres sont fausses. Recopie les propriétés vraies.</p>${A3.map((x,i)=>`<p>${"abcdef"[i]}) ${x[0]}</p>`).join("")}`,
   c:A3.map((x,i)=>`<p>${"abcdef"[i]}) <b>${x[1]?"Vraie":"Fausse"}</b>${x[2]?" : "+x[2]:"."}</p>`).join("")},
  {n:"Exercice 5", t:"Prouver qu'un quadrilatère est un parallélogramme", w:"Sur ton cahier", h:`<p>a) Parmi les 6 quadrilatères ci-dessous, lesquels sont des parallélogrammes ? b) Justifie rigoureusement. <i>On ne peut utiliser que les codages et les informations écrites.</i></p>
   <div class="cgrid">${ex5.map((x,i)=>`<figure><figcaption><b>${L5[i]}.</b> ${x.cap||""}</figcaption>${x.f}</figure>`).join("")}</div>`,
   c:`<p>a) Les parallélogrammes sont : ${ex5.map((x,i)=>x.ok?L5[i]:null).filter(Boolean).join(", ")}.</p>${ex5.map((x,i)=>`<p><b>${L5[i]}.</b> ${x.ok?"C'est un parallélogramme. ":"On ne peut pas conclure. "}${x.why}</p>`).join("")}`}
 ]},
 {t:"Parallélogrammes particuliers", e:[
  {n:"Activité 4", t:"Propriétés des parallélogrammes particuliers", w:"Sur ton cahier", h:`<p>Recopie et complète chaque phrase avec <b>rectangle</b>, <b>losange</b> ou <b>carré</b>.</p>${A4.map((x,i)=>`<p>${"abcdef"[i]}) ${x[0]}</p>`).join("")}`,
   c:A4.map((x,i)=>`<p>${"abcdef"[i]}) ${x[1]}</p>`).join("")+MAP},
  {n:"Exercice 6", t:"Prouver la nature d'un parallélogramme avec ses côtés", w:"Sur ton cahier", h:`<p>Les quadrilatères suivants sont des parallélogrammes.</p><div class="cgrid">${ex6.map((x,i)=>`<figure><figcaption><b>${"①②③④⑤⑥"[i]}</b></figcaption>${x.f}</figure>`).join("")}</div><p>1. Donne la nature de chacun. 2. Justifie ton choix pour les parallélogrammes ${just6.map(i=>"①②③④⑤⑥"[i]).join(" et ")}.</p>`,
   c:`<p>1. ${ex6.map((x,i)=>`${"①②③④⑤⑥"[i]} ${x.nat}`).join(" · ")}</p>${just6.map(i=>`<p>2. <b>${"①②③④⑤⑥"[i]}</b> ${ex6[i].nat==="parallélogramme (rien de plus)"?"Ce parallélogramme "+ex6[i].why:"Je sais que ce quadrilatère "+ex6[i].why+` Donc c'est un ${ex6[i].nat}.`}</p>`).join("")}`},
  {n:"Exercice 7", t:"Prouver la nature d'un parallélogramme avec ses diagonales", w:"Sur ton cahier", h:`<div class="cgrid">${ex7.map((x,i)=>`<figure><figcaption><b>${"abcd"[i]}.</b> ${x.name}</figcaption>${x.f}</figure>`).join("")}</div><p>1. En observant les codages des diagonales de ces quatre quadrilatères, donne leur nature. 2. Justifie ton choix pour ${ex7[just7[0]].name} et pour ${ex7[just7[1]].name}.</p>`,
   c:`<p>1. ${ex7.map((x,i)=>`${"abcd"[i]}. ${x.name} : ${NAT7[x.k]}`).join(" · ")}</p>${just7.map(i=>`<p>2. <b>${ex7[i].name}</b> : ${WHY7[ex7[i].k]} Donc ${ex7[i].name} est un ${NAT7[ex7[i].k]}.</p>`).join("")}`},
  {n:"Exercice 8", t:"Construire avec les propriétés des côtés", w:"Sur ton cahier", h:`<p>Construis en vraie grandeur. <i>Les figures ne sont pas en vraie grandeur.</i></p>
   <div class="figs"><figure><figcaption>1. Le losange IJKL</figcaption>${fq({pts:x8a.pts, poly:["I","J","K","L"], arcs:[["K","J","L",x8a.a+"°","#e57fb0"]],  ticks:[["I","J",1],["J","K",1],["K","L",1],["L","I",1]], s:28, ar:36})}<p class="dat">${"IL = "+fr(x8a.c)+" cm"}</p></figure>
   <figure><figcaption>2. Le rectangle LION</figcaption>${fq({pts:x8b.pts, poly:["L","I","O","N"], segs:[["N","I","ln"]], rights:[["O","N","I"]],  s:34})}<p class="dat">${"NO = "+fr(x8b.no)+" cm"} · ${"NI = "+fr(x8b.ni)+" cm"}</p></figure></div>`,
   c:`<p><b>1.</b> Je trace l'angle ${ov("JKL")} de ${x8a.a}°, et je place J et L à ${fr(x8a.c)} cm de K. Puis I est à ${fr(x8a.c)} cm de J et de L (deux arcs de cercle).</p>${fq({pts:x8a.pts, poly:["I","J","K","L"], arcs:[["K","J","L",x8a.a+"°","#e57fb0"]], ticks:[["I","J",1],["J","K",1],["K","L",1],["L","I",1]], s:28, ar:36})}
   <p><b>2.</b> Je trace [NO] de ${fr(x8b.no)} cm, puis la perpendiculaire à (NO) en O. Un arc de centre N et de rayon ${fr(x8b.ni)} cm coupe cette perpendiculaire en I. Enfin, je place L pour avoir quatre angles droits.</p>${fq({pts:x8b.pts, poly:["L","I","O","N"], segs:[["N","I","cons"]], rights:[["O","N","I"],["N","L","O"],["L","I","N"],["I","O","L"]], s:34})}`},
  {n:"Exercice 9", t:"Construire avec les propriétés des diagonales", w:"Sur ton cahier", h:`<p>Construis en vraie grandeur. <i>Les figures ne sont pas en vraie grandeur.</i></p>
   <div class="figs"><figure><figcaption>1. Le losange EFGH de centre O</figcaption>${fq({pts:x9a.pts, poly:["E","F","G","H"], segs:[["E","G"],["F","H"]], marks:["O"], rights:[["O","H","E"]],  s:22})}<p class="dat">${"EO = "+fr(x9a.a)+" cm"} · ${"OH = "+fr(x9a.b)+" cm"}</p></figure>
   <figure><figcaption>2. Le rectangle ABCD de centre O</figcaption>${fq({pts:x9b.pts, poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], marks:["O"],  s:24})}<p class="dat">${"AD = "+fr(x9b.ad)+" cm"} · ${"AO = "+fr(x9b.h2)+" cm"}</p></figure>
   <figure><figcaption>3. Le carré MNOP</figcaption>${fq({pts:x9c.pts, poly:["M","N","O","P"], segs:[["P","N","ln"]],  hide:["K"], s:28})}<p class="dat">${"PN = "+fr(x9c.d)+" cm"}</p></figure></div>`,
   c:`<p><b>1.</b> Je trace [EG] de 2 × ${fr(x9a.a)} = ${fr(2*x9a.a)} cm et son milieu O, puis la perpendiculaire à (EG) en O. F et H sont sur cette perpendiculaire, à ${fr(x9a.b)} cm de O.</p>${fq({pts:x9a.pts, poly:["E","F","G","H"], segs:[["E","G"],["F","H"]], marks:["O"], rights:[["O","H","E"]], ticks:[["E","O",2],["O","G",2],["F","O",1],["O","H",1]], s:22})}
   <p><b>2.</b> Je trace [AD] de ${fr(x9b.ad)} cm. Deux arcs de rayon ${fr(x9b.h2)} cm, de centres A et D, se coupent en O. Je prolonge [AO) et [DO) de ${fr(x9b.h2)} cm : j'obtiens C et B.</p>${fq({pts:x9b.pts, poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], marks:["O"], ticks:[["A","O",1],["O","C",1],["B","O",1],["O","D",1]], s:24})}
   <p><b>3.</b> Je trace [PN] de ${fr(x9c.d)} cm et son milieu K, puis la perpendiculaire à (PN) en K. M et O sont sur cette perpendiculaire, à ${fr(x9c.d/2)} cm de K (MO = PN = ${fr(x9c.d)} cm, et ${fr(x9c.d)} ÷ 2 = ${fr(x9c.d/2)}).</p>${fq({pts:x9c.pts, poly:["M","N","O","P"], segs:[["P","N"],["M","O"]], marks:["K"], rights:[["K","N","M"]], ticks:[["P","K",1],["K","N",1],["M","K",1],["K","O",1]], s:28})}`}
 ]}
];
};
