/* 4e · chapitre 2 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres figures et d'autres translations.
   Les figures des corrections sont calculées (outils window.T42 de data/4e-2.js). */
TRAIN["4e-2"] = function(){
const {ri, pick, shuf} = TR;
const {G, add, sub, trans, lab, F, vec, ang, latSVG, LP, LSEG, LTRI, LQUAD, latRows, imgFig, vOf, HX, HTRI, hxQuestion, pavage, blank, C_C} = window.T42;
const fig=(cap,body)=>`<figure>${body}${cap?`<figcaption>${cap}</figcaption>`:""}</figure>`;
const dirTxt=v=>{ const a=[]; if(v[0]) a.push(`${Math.abs(v[0])} carreau${Math.abs(v[0])>1?"x":""} vers la ${v[0]>0?"droite":"gauche"}`); if(v[1]) a.push(`${Math.abs(v[1])} carreau${Math.abs(v[1])>1?"x":""} vers le ${v[1]>0?"bas":"haut"}`); return a.join(" et "); };
const pair=()=>{ const L=shuf("ABCDEFGHKLMNPRSTUVWZ".split("")); return [L[0],L[1]]; };

/* banque de motifs sur quadrillage (coordonnées en carreaux, y vers le bas) */
const SHAPES=[
  {nom:"du motif en L", polys:[[[0,0],[1,0],[1,1],[2,1],[2,2],[0,2]]], lines:[]},
  {nom:"du triangle", polys:[[[0,0],[2,0],[2,2]]], lines:[]},
  {nom:"de la maison", polys:[[[0,2],[0,1],[1,0],[2,1],[2,2]]], lines:[]},
  {nom:"du drapeau", polys:[[[0,0],[2,1],[0,2]]], lines:[[[0,0],[0,4]]]},
  {nom:"de la flèche", polys:[[[0,1],[2,1],[2,0],[4,2],[2,4],[2,3],[0,3]]], lines:[]},
  {nom:"de l'avion", polys:[[[0,0],[1,1],[4,1],[5,2],[0,2]],[[2,2],[1,3],[3,2]]], lines:[]},
  {nom:"du canard", polys:[[[0,1],[2,1],[2,0],[3,0],[4,1],[3,1],[3,2],[0,2]]], lines:[[[1,2],[1,3]],[[2,2],[2,3]]]}
];
const bbox=S=>{ const P=[...S.polys.flat(), ...S.lines.flat()]; return [Math.max(...P.map(p=>p[0])), Math.max(...P.map(p=>p[1]))]; };
const place=(S,o)=>({nom:S.nom, polys:S.polys.map(p=>trans(p,o)), lines:S.lines.map(l=>trans(l,o))});
const shapeSVG=(S,grid,extra,imgs=[])=>{ const o={k:26, grid, polys:S.polys.map(p=>[p,"orig"]), lines:S.lines.map(l=>[...l,"ln"]), ...extra};
  o.polys=o.polys.concat(...imgs.map(I=>I.polys.map(p=>[p,"img"]))); o.lines=o.lines.concat(...imgs.map(I=>I.lines.map(l=>[...l,"li"]))); return G(o); };

/* ================= 1. Frises ================= */
function friseEx(not){
  for(let g=0;g<500;g++){ const S=pick(SHAPES.filter(x=>x!==not)), [w,h]=bbox(S), dx=pick([w+1,w+2,w+3]), dy=pick([0,0,0,1,-1]);
    const W=1+w+3*dx+1; if(W>20) continue; const y0=dy<0?3*Math.abs(dy)+1:1, H=y0+h+(dy>0?3*dy:0)+3; if(H>11) continue;
    const S0=place(S,[1,y0]), v=[dx,dy], [p,q]=pair(), P=[1,H-1], Q=add(P,v);
    const imgs=[1,2,3].map(i=>place(S,[1+i*dx,y0+i*dy]));
    const ext={pts:[[p,...P,0,-12],[q,...Q,0,-12]], vecs:[[P,Q]], w:520, alt:"Frise sur quadrillage"};
    return {S, v, p, q, svg:shapeSVG(S0,[0,0,W,H],ext), sol:shapeSVG(S0,[0,0,W,H],{...ext,alt:"La frise complétée"},imgs)}; }
}
const fr0=friseEx(), fr=[fr0, friseEx(fr0.S)];

/* ================= 2. Lire une figure ================= */
const rows=latRows(LP,[...LTRI,...LQUAD],4);
const rowTxt=(r,i)=>{ const tr=i%2?`de vecteur ${vec(r.p+r.q)}`:`qui transforme ${r.p} en ${r.q}`;
  if(i===2) return {h:`<tr><th>${"①②③④"[i]}</th><td>${tr}</td><td>……</td><td>${r.im}</td></tr>`, c:`${"①②③④"[i]} On fait le chemin inverse (de ${r.q} vers ${r.p}) : la figure initiale est <b>${r.fg}</b>.`};
  if(i===3) return {h:`<tr><th>${"①②③④"[i]}</th><td>qui transforme ${r.p} en ……</td><td>${r.fg}</td><td>${r.im}</td></tr>`, c:`${"①②③④"[i]} ${r.fg[r.fg[0]===r.p?1:0]} a pour image ${r.im[r.fg[0]===r.p?1:0]} : ${r.p} glisse de la même façon et arrive en <b>${r.q}</b>.`};
  return {h:`<tr><th>${"①②③④"[i]}</th><td>${tr}</td><td>${r.fg}</td><td>……</td></tr>`, c:`${"①②③④"[i]} ${r.fg.split("").map((n,j)=>`${n} → ${r.im[j]}`).join(" ; ")} : l'image est <b>${r.im}</b>.`}; };
const RT=rows.map(rowTxt);
const hx=[]; for(let g=0;g<400&&hx.length<4;g++){ const h=hxQuestion(); if(!hx.some(x=>x.t===h.t&&x.p===h.p&&x.q===h.q)) hx.push(h); }

/* ================= 3. Pavage ================= */
const V6=[[[2,2],[1,-1]],[[2,0],[0,2]],[[2,0],[1,2]],[[2,0],[2,2]],[[3,0],[2,1]],[[2,1],[1,-1]],[[0,2],[2,-1]]];
const [u6,w6]=shuf(pick(V6)).map(v=>Math.random()<0.5?v:[-v[0],-v[1]]);
const rect6=[[4,0],[10,9]], A6=[ri(5,7),ri(3,5)], T6=[A6,add(A6,[2,0]),add(A6,[2,2])];
const [n1,n2]=pair(), [n3,n4]=(()=>{ let x; do{ x=pair(); }while(x.includes(n1)||x.includes(n2)); return x; })();
const P1=[1-Math.min(0,u6[0]),1-Math.min(0,u6[1])], P2=add(P1,u6), P3=[1-Math.min(0,w6[0]),6-Math.min(0,w6[1])], P4=add(P3,w6);
const pv6=sol=>{ const T=sol?pavage(T6,u6,w6,rect6,10):[{t:T6,first:true}];
  return G({k:26, grid:[0,0,10,10], rect:[rect6], polys:T.map(x=>[x.t,x.first?"orig":"img"]), vecs:[[P1,P2],[P3,P4]], pts:[[n1,...P1,-12,-8],[n2,...P2,12,-8],[n3,...P3,-12,-8],[n4,...P4,12,-8]], w:340, alt:sol?"Le pavage construit":"Un triangle, deux vecteurs et un rectangle"}); };

/* ================= 4. Construire l'image d'une figure ================= */
function gridEx(){
  for(let g=0;g<800;g++){ const S=pick(SHAPES), [w,h]=bbox(S), v=[ri(-5,5),ri(-4,4)]; if(!v[0]||Math.abs(v[0])+Math.abs(v[1])<3) continue;
    const o=[ri(1,13-w),ri(1,9-h)], S0=place(S,o), S1=place(S,add(o,v)); const all=[...S1.polys.flat(),...S1.lines.flat()];
    if(all.some(p=>p[0]<0||p[0]>14||p[1]<0||p[1]>10)) continue;
    const [p,q]=pair(), P=[ri(0,14),ri(0,10)], Q=add(P,v); if(Q[0]<0||Q[0]>14||Q[1]<0||Q[1]>10) continue;
    const ext={pts:[[p,...P,-10,-10],[q,...Q,10,-10]], w:400, alt:"Une figure sur quadrillage et deux points"};
    return {S, v, p, q, svg:shapeSVG(S0,[0,0,14,10],ext), sol:shapeSVG(S0,[0,0,14,10],{...ext,lines:[[P,Q,"cons"]],alt:"La figure et son image"},[S1])}; }
}
const ge=gridEx();
function blankEx(){
  for(let g=0;g<800;g++){ const A=[ri(10,30)/10,ri(20,35)/10], B=[ri(5,25)/10,ri(55,75)/10], C=[ri(40,60)/10,ri(55,75)/10];
    const ar=Math.abs((B[0]-A[0])*(C[1]-A[1])-(C[0]-A[0])*(B[1]-A[1]))/2; if(ar<4) continue;
    const t=ri(-60,60)*Math.PI/180, L=ri(30,50)/10, v=[Math.round(L*Math.cos(t)*10)/10, Math.round(-L*Math.sin(t)*10)/10];
    const D=[ri(0,15)/10,ri(0,10)/10], E=add(D,v); if(E[0]<0) continue;
    const P={A,B,C,D,E}; if(Object.values(P).some((p,i,a)=>a.some((q,j)=>j>i&&Math.hypot(p[0]-q[0],p[1]-q[1])<1))) continue;
    const im=[A,B,C].map(p=>add(p,v)); if([...im,E].some(p=>[A,B,C].some(q=>Math.hypot(p[0]-q[0],p[1]-q[1])<0.8))) continue;
    return {P}; }
  return {P:{A:[2,3],B:[1,6],C:[5,7],D:[0.5,0.5],E:[4.5,1.5]}};
}
const be=blankEx();

/* ================= 5. Conservation ================= */
const NOMS=pick(["ABC","DEF","KLM","RST","UVW"]), [a1,b1,c1]=NOMS.split(""), pr=n=>n+"’";
const L1=ri(25,60)/10, L2=ri(30,70)/10, A1=ri(30,130), rad=A1*Math.PI/180, L3=Math.sqrt(L1*L1+L2*L2-2*L1*L2*Math.cos(rad)), S1=Math.round(L1*L2*Math.sin(rad)/2*10)/10, P1b=Math.round((L1+L2+L3)*10)/10;

return [
 {t:"Frises", e:[
  {n:"Exercice 1", t:"Reproduire des frises", w:"Sur ta feuille", h:`<p>Continue chaque frise en reproduisant 3 motifs de base.</p><p><b>a)</b> par la translation qui transforme ${fr[0].p} en ${fr[0].q}.</p>${fr[0].svg}<p><b>b)</b> par la translation qui transforme ${fr[1].p} en ${fr[1].q}.</p>${fr[1].svg}`,
   c:`<p><b>a)</b> De ${fr[0].p} à ${fr[0].q} : ${dirTxt(fr[0].v)}.</p>${fr[0].sol}<p><b>b)</b> De ${fr[1].p} à ${fr[1].q} : ${dirTxt(fr[1].v)}.</p>${fr[1].sol}`}
 ]},
 {t:"Reconnaître une translation", e:[
  {n:"Exercice 2", t:"Observation de frise", w:"Sur ton cahier", h:`<p>Observe la figure et complète le tableau.</p>${latSVG(LP,LSEG,{w:560})}<div class="scroll"><table class="std"><thead><tr><th></th><th>Translation</th><th>Figure initiale</th><th>Image obtenue</th></tr></thead><tbody>${RT.map(x=>x.h).join("")}</tbody></table></div>`,
   c:RT.map(x=>`<p>${x.c}</p>`).join("")},
  {n:"Exercice 3", t:"Dans un hexagone", w:"Sur ton cahier", h:`${img("4k2ex/e5.png","Hexagone ABCDEF de centre O",200)}<p>L'hexagone ABCDEF de centre O est composé de six triangles équilatéraux. Complète.</p>${hx.map((h,i)=>`<p><b>${"abcd"[i]})</b> L'image du triangle ${h.t} par la translation qui transforme ${h.p} en ${h.q} est ……</p>`).join("")}`,
   c:hx.map((h,i)=>`<p><b>${"abcd"[i]})</b> ${h.p} glisse vers ${h.q}, donc ${h.t.split("").map((n,j)=>`${n} → ${h.im[j]}`).join(" ; ")} : <b>${h.im}</b>.</p>`).join("")}
 ]},
 {t:"Construire un pavage", e:[
  {n:"Exercice 4", t:"Un pavage sur quadrillage", w:"Sur ta feuille", h:`<p>À l'intérieur du rectangle noir, construis un pavage en transformant chaque triangle par les translations de vecteur ${vec(n1+n2)} et de vecteur ${vec(n3+n4)}.</p>${pv6()}`,
   c:`<p>De ${n1} à ${n2} : ${dirTxt(u6)}. De ${n3} à ${n4} : ${dirTxt(w6)}.</p><p>On applique ces translations au triangle, puis aux nouveaux triangles, tant qu'ils restent dans le rectangle.</p>${pv6(true)}`}
 ]},
 {t:"Construire l'image d'une figure", e:[
  {n:"Exercice 5", t:"Sur quadrillage", w:"Sur ta feuille", h:`<p>Trace l'image ${ge.S.nom} par la translation qui transforme ${ge.p} en ${ge.q}.</p>${ge.svg}`,
   c:`<p>De ${ge.p} à ${ge.q} : ${dirTxt(ge.v)}. Chaque sommet glisse de la même façon.</p>${ge.sol}`},
  {n:"Exercice 6", t:"Sur feuille blanche", w:"Sur ta feuille", h:`<p>Reproduis la figure, puis construis l'image A’B’C’ du triangle ABC par la translation qui transforme D en E.</p><p>Laisse apparents tes traits de construction.</p>${blank(be.P,"ABC","D","E",{w:320})}`,
   c:`${blank(be.P,"ABC","D","E",{w:340,sol:true,altS:"Le triangle ABC et son image A’B’C’"})}<p>DEA’A, DEB’B et DEC’C sont des parallélogrammes.</p><p>Pour A’ : arc de centre A et de rayon DE, arc de centre E et de rayon DA ; A’ est leur point d'intersection, du même côté que E.</p>`}
 ]},
 {t:"Propriétés de conservation", e:[
  {n:"Exercice 7", t:"Ce que conserve une translation", w:"Sur ton cahier", h:`<p>Le triangle ${pr(a1)}${pr(b1)}${pr(c1)} est l'image du triangle ${NOMS} par une translation.</p><p>On sait que ${a1}${b1} = ${F(L1)} cm, ${ang(NOMS)} = ${A1}°, que l'aire de ${NOMS} est ${F(S1)} cm² et que son périmètre est ${F(P1b)} cm (valeurs arrondies au dixième).</p>
   <p><b>a)</b> Donne la longueur ${pr(a1)}${pr(b1)}.</p><p><b>b)</b> Donne la mesure de l'angle ${ang(pr(a1)+pr(b1)+pr(c1))}.</p><p><b>c)</b> Donne l'aire et le périmètre de ${pr(a1)}${pr(b1)}${pr(c1)}.</p><p><b>d)</b> Les points ${pr(a1)}, ${pr(b1)} et ${pr(c1)} peuvent-ils être alignés ?</p><p>Justifie chaque réponse.</p>`,
   c:`<p><b>a)</b> Une translation conserve les longueurs : ${pr(a1)}${pr(b1)} = <b>${F(L1)} cm</b>.</p><p><b>b)</b> Une translation conserve les mesures d'angles : ${ang(pr(a1)+pr(b1)+pr(c1))} = <b>${A1}°</b>.</p><p><b>c)</b> Une translation conserve les aires et les longueurs : aire = <b>${F(S1)} cm²</b> et périmètre = <b>${F(P1b)} cm</b>.</p><p><b>d)</b> Non : ${a1}, ${b1} et ${c1} ne sont pas alignés (ils forment un triangle), et une translation conserve l'alignement. Les images forment donc aussi un triangle.</p>`}
 ]}
];
};
