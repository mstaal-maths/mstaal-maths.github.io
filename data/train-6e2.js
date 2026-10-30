/* 6e · chapitre 2 — fiche d'entraînement : mêmes exercices que la fiche de classe, avec de nouvelles figures */
TRAIN["6e-2"] = function(){
const {ri, pick, shuf, items} = TR;
const W=380, H=250;
const rad = a => a*Math.PI/180, dir = a => [Math.cos(rad(a)), -Math.sin(rad(a))];
const add = (p,u,t) => [p[0]+u[0]*t, p[1]+u[1]*t];
const cross = (u,v) => u[0]*v[1]-u[1]*v[0];
const sub = (a,b) => [a[0]-b[0], a[1]-b[1]];
const dot = (a,b) => a[0]*b[0]+a[1]*b[1];
const len = a => Math.hypot(a[0],a[1]);
const perp = u => [-u[1], u[0]];

/* droite infinie coupée au cadre */
function clip(p,u,x0=10,y0=10,x1=W-10,y1=H-10){
  const ts=[]; if(Math.abs(u[0])>1e-9) ts.push((x0-p[0])/u[0],(x1-p[0])/u[0]); if(Math.abs(u[1])>1e-9) ts.push((y0-p[1])/u[1],(y1-p[1])/u[1]);
  const q=ts.map(t=>[t,add(p,u,t)]).filter(([,r])=>r[0]>=x0-1e-6&&r[0]<=x1+1e-6&&r[1]>=y0-1e-6&&r[1]<=y1+1e-6).sort((a,b)=>a[0]-b[0]);
  return q.length ? [q[0][1], q[q.length-1][1]] : [p,p];
}
const X = (p,c="gx") => `<path d="M${p[0]-6} ${p[1]-6} L${p[0]+6} ${p[1]+6} M${p[0]+6} ${p[1]-6} L${p[0]-6} ${p[1]+6}" class="${c}"/>`;
/* figure : droites, points, angles droits */
/* quadrillage : 15 × 10 carreaux de 25 unités ; nœud (i, j) */
const NX=i=>2.5+25*i, NY=j=>25*j, N_=(i,j)=>[NX(i),NY(j)];
function fig({lines=[], pts=[], rights=[], segs=[], w=W, h=H, grid=false}){
  let s=`<svg class="fig geo" viewBox="0 0 ${W} ${H}" width="${w}" role="img" aria-label="Figure de géométrie">`;
  if(grid){ for(let i=0;i<=15;i++) s+=`<line x1="${NX(i)}" y1="0" x2="${NX(i)}" y2="${H}" class="gridl"/>`; for(let j=0;j<=10;j++) s+=`<line x1="${NX(0)}" y1="${NY(j)}" x2="${NX(15)}" y2="${NY(j)}" class="gridl"/>`; }
  lines.forEach(l=>{ const [a,b]=clip(l.p,l.u); s+=`<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" class="${l.k||"axe2"}"/>`;
    if(l.lab){ const t=l.at??0.9, q=[a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t], n=perp(l.u); s+=`<text x="${(q[0]+n[0]*16).toFixed(1)}" y="${(q[1]+n[1]*16+5).toFixed(1)}" class="glab${l.k==="img"||l.k==="axe3"?" gimg":""}" text-anchor="middle">${l.lab}</text>`; } });
  segs.forEach(([a,b,k])=>s+=`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" class="${k||"axe2"}"/>`);
  rights.forEach(({at,u,v})=>{ const q=9, a=add(at,u,q), b=add(a,v,q), c=add(at,v,q); s+=`<path d="M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${b[0].toFixed(1)} ${b[1].toFixed(1)} L${c[0].toFixed(1)} ${c[1].toFixed(1)}" class="thin"/>`; });
  pts.forEach(({p,n,k,dx=9,dy=-9})=>s+=X(p,k==="img"?"pt":"gx")+(n?`<text x="${(p[0]+dx).toFixed(1)}" y="${(p[1]+dy).toFixed(1)}" class="glab${k==="img"?" gimg":""}">${n}</text>`:""));
  return s+"</svg>";
}

/* ======= A. Appartenance et alignement ======= */
/* Ex 1 : A, B, C alignés ; A, D, M alignés ; N sur [BD] ; E ailleurs */
let A,B,C,D,M,N,E,u1,u2;
for(let g=0;g<3000;g++){
  A=[ri(40,80), ri(180,215)]; u1=dir(ri(8,24)); u2=dir(ri(58,80));
  B=add(A,u1,ri(110,150)); C=add(A,u1,ri(230,270)); D=add(A,u2,ri(85,110)); M=add(A,u2,ri(150,175));
  N=add(B,sub(D,B),ri(35,65)/100); E=[ri(230,330), ri(30,110)];
  const far = P => [[A,u1],[A,u2]].every(([p,u])=>Math.abs(cross(u,sub(P,p)))>45) && Math.abs(cross(sub(D,B),sub(P,B)))/len(sub(D,B))>45 && [A,B,C,D,M,N].every(Q=>len(sub(P,Q))>55);
  if(C[0]<W-25 && M[1]>20 && far(E)) break;
}
const P1={A,B,C,D,M,N,E};
const onLine=(P,X,Y)=>Math.abs(cross(sub(Y,X),sub(P,X)))/len(sub(Y,X))<0.5;
const onSeg=(P,X,Y)=>{ if(!onLine(P,X,Y)) return false; const t=dot(sub(P,X),sub(Y,X))/dot(sub(Y,X),sub(Y,X)); return t>=-1e-6&&t<=1+1e-6; };
const objs=[["A","C"],["B","C"],["A","B"],["A","D"],["A","M"],["D","M"],["B","D"]];
const cand=[]; "ABCDMNE".split("").forEach(p=>objs.forEach(([x,y])=>{ if(p===x||p===y) return; ["[","("].forEach(k=>{ const v = k==="[" ? onSeg(P1[p],P1[x],P1[y]) : onLine(P1[p],P1[x],P1[y]); cand.push({t:`${p} …… ${k==="["?`[${x}${y}]`:`(${x}${y})`}`, ans:`${p} ${v?"∈":"∉"} ${k==="["?`[${x}${y}]`:`(${x}${y})`}`, v}); }); }));
const yes=shuf(cand.filter(c=>c.v)).slice(0,5), no=shuf(cand.filter(c=>!c.v)).slice(0,5), s1=shuf([...yes,...no]);
const fig1 = fig({lines:[{p:A,u:u1},{p:A,u:u2}], segs:[[B,D]], pts:Object.entries(P1).map(([n,p])=>({p,n, dx:n==="A"?-18:9, dy:n==="A"?18:-9}))});

/* Ex 2 : trois phrases avec de nouvelles lettres */
const Lt = shuf("CDEFGKLPRSTUV".split(""));
const [a2,b2,c2,d2,e2,f2,g2,h2,i2]=Lt;
/* les points d'une droite sont dessinés SUR la droite (même ordonnée que le tracé) */
const mini = (kind)=>{ const y=48, P=[20,y], Q=[200,y], vb=s=>s.replace(`viewBox="0 0 ${W} ${H}"`,'viewBox="0 0 240 70"');
  if(kind===0) return vb(fig({w:225, segs:[[P,Q]], pts:[{p:P,n:b2,dx:-5,dy:-12},{p:Q,n:c2,dx:-5,dy:-12},{p:[110,y],n:a2,k:"img",dx:-5,dy:-12}]}));
  if(kind===1) return vb(fig({w:225, lines:[{p:P,u:[1,0]}], pts:[{p:[60,y],n:e2,dx:-5,dy:-12},{p:[170,y],n:f2,dx:-5,dy:-12},{p:[115,16],n:d2,k:"img",dx:10,dy:6}]}));
  return vb(fig({w:225, lines:[{p:P,u:[1,0]}], pts:[{p:[50,y],n:h2,dx:-5,dy:-12},{p:[130,y],n:i2,dx:-5,dy:-12},{p:[205,y],n:g2,k:"img",dx:-5,dy:-12}]}));
};

/* Ex 3 : placer des points */
let Q3, I3, L3;
for(let g=0;g<4000;g++){
  Q3={A:N_(ri(1,4),ri(1,3)), B:N_(ri(1,5),ri(6,9)), C:N_(ri(7,10),ri(1,2)), D:N_(ri(11,13),ri(2,4)), E:N_(ri(9,12),ri(7,9))};
  try{ I3=G.inter(Q3.A,Q3.E,Q3.B,Q3.D); L3=G.inter(Q3.A,Q3.B,Q3.C,Q3.D); }catch(e){ continue; }
  const ins=P=>P&&isFinite(P[0])&&P[0]>15&&P[0]<W-15&&P[1]>15&&P[1]<H-15;
  if(!ins(add(Q3.A,sub(Q3.E,Q3.A),1.22))) continue;
  const sep=Object.values(Q3).every((p,i,a)=>a.every((q,j)=>i===j||len(sub(p,q))>55));
  if(ins(I3)&&ins(L3)&&sep&&len(sub(I3,L3))>40&&Object.values(Q3).every(p=>len(sub(p,I3))>30&&len(sub(p,L3))>30)) break;
}
const G3=add(Q3.B,sub(Q3.E,Q3.B),0.45), H3=add(Q3.A,sub(Q3.E,Q3.A),1.22), M3=add(Q3.C,sub(Q3.D,Q3.C),0.5);
const nm3 = Object.entries(Q3).map(([n,p])=>({p,n}));
const fig3h = fig({pts:nm3, grid:true});
const fig3c = fig({lines:[{p:Q3.A,u:sub(Q3.E,Q3.A),k:"cons"},{p:Q3.B,u:sub(Q3.D,Q3.B),k:"cons"},{p:Q3.A,u:sub(Q3.B,Q3.A),k:"cons"},{p:Q3.C,u:sub(Q3.D,Q3.C),k:"cons"}], segs:[[Q3.B,Q3.E,"axe2"]],
  pts:[...nm3, {p:G3,n:"G",k:"img"}, {p:H3,n:"H",k:"img"}, {p:I3,n:"I",k:"img"}, {p:L3,n:"L",k:"img"}, {p:M3,n:"M",k:"img"}], grid:true});

/* Ex 4 : lettres */
const [r4,s4,t4,u4]=shuf("RSTUVWXYZ".split("")).slice(0,4);
const fig4 = fig({w:300, lines:[{p:[40,150],u:[1,-0.15]}], pts:[{p:[130,136.5],n:s4},{p:[230,121.5],n:t4},{p:[320,108],n:r4,k:"img"},{p:[170,60],n:u4,k:"img"}]});
const fig4b = fig({w:300, lines:[{p:[40,150],u:[1,-0.15]}], pts:[{p:[150,133.5],n:s4},{p:[250,118.5],n:t4},{p:[60,147],n:r4,k:"img"},{p:[260,200],n:u4,k:"img"}]});

const secA = {t:"Appartenance et alignement", e:[
  {n:"Exercice 1", t:"∈ ou ∉ ?", w:"Sur ton cahier", h:`${fig1}<p>Recopie chaque ligne et complète avec le symbole ∈ ou ∉.</p><p>${s1.map((c,i)=>`${i+1}. ${c.t}`).join(" · ")}</p>`,
   c:s1.map((c,i)=>`${i+1}. ${c.ans}`).join(" · ")},
  {n:"Exercice 2", t:"Trois façons de dire la même chose", w:"Sur ton cahier", h:`<p>Complète le tableau : écris chaque phrase mathématique en français, puis fais un dessin.</p>
   <div class="scroll"><table class="std"><thead><tr><th style="width:22%">Phrase mathématique</th><th style="width:33%">Phrase en français</th><th style="width:45%">Dessin</th></tr></thead><tbody><tr><td style="height:140px">${a2} ∈ [${b2}${c2}]</td><td></td><td></td></tr><tr><td style="height:140px">${d2} ∉ (${e2}${f2})</td><td></td><td></td></tr><tr><td style="height:140px">${g2} ∈ (${h2}${i2}) mais ${g2} ∉ [${h2}${i2}]</td><td></td><td></td></tr></tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Phrase mathématique</th><th>Phrase en français</th><th>Dessin</th></tr></thead><tbody>
   <tr><td>${a2} ∈ [${b2}${c2}]</td><td>Le point ${a2} appartient au segment [${b2}${c2}].</td><td style="min-width:240px">${mini(0)}</td></tr>
   <tr><td>${d2} ∉ (${e2}${f2})</td><td>Le point ${d2} n'appartient pas à la droite (${e2}${f2}).</td><td style="min-width:240px">${mini(1)}</td></tr>
   <tr><td>${g2} ∈ (${h2}${i2}) mais ${g2} ∉ [${h2}${i2}]</td><td>Le point ${g2} appartient à la droite (${h2}${i2}), mais il n'appartient pas au segment [${h2}${i2}].</td><td style="min-width:240px">${mini(2)}</td></tr></tbody></table></div>
   <p>Ce n'est qu'un exemple de dessin. Tu peux placer les points ailleurs, si tu respectes la phrase.</p>`},
  {n:"Exercice 3", t:"Placer des points", w:"Sur ton cahier", h:`${fig3h}<p>Reproduis les points sur ton cahier en comptant les carreaux (<b>un carreau de la figure = un carreau de ton cahier</b>), puis place les points G, H, I, L et M tels que : ${items(["G ∈ (BE) et G ∈ [BE]","H ∈ (AE) et H ∉ [AE]","les points I, A et E sont alignés, et les points I, B et D le sont également","L ∈ (AB) et L ∈ (CD)","M ∈ (CD)"],"  ·  ",true)}</p>`,
   c:`<p>a) G est sur le segment [BE] · b) H est sur la droite (AE), en dehors du segment [AE] · c) I est le point d'intersection des droites (AE) et (BD) · d) L est le point d'intersection des droites (AB) et (CD) · e) M est n'importe quel point de la droite (CD)</p>${fig3c}<p>Les droites tracées en pointillés t'aident à placer les points. G, H et M peuvent être placés ailleurs, tant qu'ils respectent les conditions.</p>`},
  {n:"Exercice 4", t:"Une seule position ?", w:"Sur ton cahier", h:`<p>On sait que : ${r4} ∈ (${s4}${t4}) ; ${u4} ∉ (${s4}${t4}) et ${r4} ∉ [${s4}${t4}].</p><p>1 — Place les points ${r4}, ${s4}, ${t4} et ${u4}. 2 — Y a-t-il une seule position possible ?</p>`,
   c:`<p>${r4} est sur la droite (${s4}${t4}) mais pas entre ${s4} et ${t4} : il est avant ${s4} ou après ${t4}. ${u4} est n'importe où en dehors de la droite. Il y a donc une infinité de positions possibles. Deux exemples :</p><div class="figs"><figure>${fig4}<figcaption>${r4} est du côté de ${t4}.</figcaption></figure><figure>${fig4b}<figcaption>${r4} est du côté de ${s4}.</figcaption></figure></div>`}
]};

/* ======= B. Perpendiculaires, parallèles et justifications ======= */
const NAMES = shuf(["(a)","(b)","(c)","(e)","(f)","(g)","(u)","(v)","(w)","(Δ)"]);
const P1txt = "si deux droites sont perpendiculaires à une même droite, alors elles sont parallèles entre elles";
const P2txt = "si deux droites sont parallèles et si une troisième droite est perpendiculaire à l'une, alors elle est perpendiculaire à l'autre";
function propFig(kind, names){
  const th=ri(-25,25), u=dir(th), v=perp(u), O=[W/2, H/2];
  if(kind===1){ const [b1,b2,b3]=names; const base={p:O,u}; const P=add(O,u,-75), Q=add(O,u,75);
    return fig({lines:[{...base,lab:b3,at:0.95},{p:P,u:v,lab:b1,at:0.05},{p:Q,u:v,lab:b2,at:0.05}], rights:[{at:P,u,v},{at:Q,u,v}]}); }
  const [b1,b2,b3]=names; const P=add(O,v,-50), Q=add(O,v,50);
  return fig({lines:[{p:P,u,lab:b1,at:0.95},{p:Q,u,lab:b2,at:0.95},{p:add(O,u,-20),u:v,lab:b3,at:0.06}], rights:[{at:add(P,u,-20),u,v}]});
}
const n5=NAMES.slice(0,3), n5b=NAMES.slice(3,6);
/* Ex 6 : une chaîne de relations */
const chainN = ["(d₁)","(d₂)","(d₃)","(d₄)"]; const rel=[pick(["⊥","//"]),"⊥",pick(["⊥","//"])];
const cls=[0]; rel.forEach((r,i)=>cls.push(r==="⊥"?1-cls[i]:cls[i]));
const facts = rel.map((r,i)=>`${chainN[i]} ${r} ${chainN[i+1]}`);
function justify(){ const st=[]; let curCls=cls[0];
  /* on relie (d₁) à (d₃) puis à (d₄) */
  const r13 = cls[0]===cls[2] ? "//" : "⊥";
  const why13 = (rel[0]==="⊥"&&rel[1]==="⊥") ? `${chainN[0]} ⊥ ${chainN[1]} et ${chainN[2]} ⊥ ${chainN[1]}, donc ${chainN[0]} // ${chainN[2]} (propriété 1)` :
    (rel[0]==="//"&&rel[1]==="⊥") ? `${chainN[0]} // ${chainN[1]} et ${chainN[2]} ⊥ ${chainN[1]}, donc ${chainN[2]} ⊥ ${chainN[0]} (propriété 2)` : "";
  const r14 = cls[0]===cls[3] ? "//" : "⊥";
  let why14;
  if(r13==="//" && rel[2]==="⊥") why14 = `${chainN[0]} // ${chainN[2]} et ${chainN[3]} ⊥ ${chainN[2]}, donc ${chainN[3]} ⊥ ${chainN[0]} (propriété 2)`;
  else if(r13==="⊥" && rel[2]==="⊥") why14 = `${chainN[0]} ⊥ ${chainN[2]} et ${chainN[3]} ⊥ ${chainN[2]}, donc ${chainN[0]} // ${chainN[3]} (propriété 1)`;
  else if(r13==="//" && rel[2]==="//") why14 = `${chainN[0]} // ${chainN[2]} et ${chainN[2]} // ${chainN[3]} : ${chainN[0]} et ${chainN[3]} sont parallèles à la même droite`;
  else why14 = `${chainN[0]} ⊥ ${chainN[2]} et ${chainN[3]} // ${chainN[2]}, donc ${chainN[0]} ⊥ ${chainN[3]} (propriété 2)`;
  return [`Étape 1 : ${why13}.`, `Étape 2 : ${why14}.`, `Conclusion : ${chainN[0]} ${r14} ${chainN[3]}.`];
}
/* la transitivité du parallélisme n'est pas au programme du cours : on évite (//, //) en fin de chaîne */
if(rel[2]==="//" && cls[0]===cls[2]) rel[2]="⊥";
cls.length=1; rel.forEach((r,i)=>cls.push(r==="⊥"?1-cls[i]:cls[i]));
const facts2 = rel.map((r,i)=>`${chainN[i]} ${r} ${chainN[i+1]}`);

const secB = {t:"Perpendiculaires, parallèles et justifications", note:`<b>Comment rédiger :</b> Je sais que … Or ${P1txt}. Donc …`, e:[
  {n:"Exercice 5", t:"Quelle propriété ?", w:"Sur ton cahier", h:`<p>Pour chaque figure, réponds à la question puis cite la propriété utilisée.</p>
   <div class="figs"><figure>${propFig(1,n5)}<figcaption>a) Que peut-on dire des droites ${n5[0]} et ${n5[1]} ?</figcaption></figure>
   <figure>${propFig(2,n5b)}<figcaption>b) On sait que ${n5b[0]} // ${n5b[1]}. Que peut-on dire des droites ${n5b[2]} et ${n5b[1]} ?</figcaption></figure></div>`,
   c:`<p>a) Je sais que ${n5[0]} ⊥ ${n5[2]} et ${n5[1]} ⊥ ${n5[2]}. Or ${P1txt}. Donc ${n5[0]} // ${n5[1]}.</p>
      <p>b) Je sais que ${n5b[0]} // ${n5b[1]} et ${n5b[2]} ⊥ ${n5b[0]}. Or ${P2txt}. Donc ${n5b[2]} ⊥ ${n5b[1]}.</p>`},
  {n:"Exercice 6", t:"En deux étapes", w:"Sur ton cahier", h:`<p>On sait que : ${facts2.join(" ; ")}. Que peut-on dire des droites ${chainN[0]} et ${chainN[3]} ? Justifie en deux étapes.</p>`,
   c:(()=>{ const j=justify(); return `<p>${j[0]}</p><p>${j[1]}</p><p><b>${j[2]}</b></p>`; })()}
]};

/* ======= C. Constructions ======= */
/* la droite (d) passe par des nœuds du quadrillage (pente oblique), M est un nœud */
const DIRS=[[3,1],[2,1],[1,2],[1,3],[3,2],[2,3],[4,1],[1,4]];
function caseLine(onLine){
  for(let g=0;g<2000;g++){
    const [p,q]=pick(DIRS), sg=pick([1,-1]), L=Math.hypot(p,q), u=[p/L, sg*q/L], Oi=[ri(5,10), ri(3,7)], O=N_(...Oi);
    if(onLine){ const k=pick([-2,-1,1,2]), Mi=[Oi[0]+k*p, Oi[1]+k*sg*q]; if(Mi[0]<3||Mi[0]>12||Mi[1]<2||Mi[1]>8) continue; return {u,O,M:N_(...Mi),o:Oi,v:[p,sg*q]}; }
    const Mi=[ri(3,12), ri(2,8)], M=N_(...Mi), dd=Math.abs(cross(u,sub(M,O)));
    if(dd<45||dd>95||len(sub(M,O))>150) continue; return {u,O,M,o:Oi,v:[p,sg*q]};
  }
  return {u:[0.894,0.447],O:N_(7,4),M:N_(6,8),o:[7,4],v:[2,1]};
}
const perpCases=[caseLine(true), caseLine(false), caseLine(false)], parCases=[caseLine(false), caseLine(false), caseLine(false)];
const drawStart = c => fig({w:310, grid:true, lines:[{p:c.O,u:c.u,lab:"(d)",at:0.92}], pts:[{p:c.M,n:"M"}]});
const drawPerp = c => { const v=perp(c.u), Hh=G.foot(c.M,c.O,add(c.O,c.u,1)); return fig({w:310, grid:true, lines:[{p:c.O,u:c.u,lab:"(d)",at:0.92},{p:c.M,u:v,lab:"(d')",at:0.08,k:"axe3"}], rights:[{at:Hh,u:c.u,v:sub(c.M,Hh)[0]||sub(c.M,Hh)[1]?[sub(c.M,Hh)[0]/(len(sub(c.M,Hh))||1),sub(c.M,Hh)[1]/(len(sub(c.M,Hh))||1)]:v}], pts:[{p:c.M,n:"M"}]}); };
const drawPar = c => { const v=perp(c.u), Hh=G.foot(c.M,c.O,add(c.O,c.u,1)), w=sub(c.M,Hh), wn=[w[0]/len(w),w[1]/len(w)];
  return fig({w:310, grid:true, lines:[{p:c.O,u:c.u,lab:"(d)",at:0.92},{p:c.M,u:c.u,lab:"(d')",at:0.92,k:"axe3"},{p:c.M,u:v,lab:"(k)",at:0.08,k:"cons"}], rights:[{at:Hh,u:c.u,v:wn},{at:c.M,u:c.u,v:[-wn[0],-wn[1]]}], pts:[{p:c.M,n:"M"}]}); };
/* Ex 10 */
/* A et B sur des nœuds, de part et d'autre de (d) */
let c10, A10, B10; const v10f=()=>perp(c10.u);
for(let g=0;g<3000;g++){ c10=caseLine(false); A10=c10.M; const side=Math.sign(cross(c10.u,sub(A10,c10.O)));
  B10=N_(ri(2,13),ri(2,8)); const db=cross(c10.u,sub(B10,c10.O)), along=Math.abs(dot(sub(B10,A10),c10.u));
  if(Math.sign(db)!==side && Math.abs(db)>=35 && Math.abs(db)<=75 && along>=70 && along<=150) break; }
const v10=v10f();
const H10=G.foot(B10,c10.O,add(c10.O,c10.u,1)), w10=sub(B10,H10), wn10=[w10[0]/len(w10),w10[1]/len(w10)], I10=G.inter(A10,add(A10,c10.u,1),B10,add(B10,v10,1));
const fig10h = fig({grid:true, lines:[{p:c10.O,u:c10.u,lab:"(d)",at:0.92}], pts:[{p:A10,n:"A"},{p:B10,n:"B"}]});
const fig10c = fig({grid:true, lines:[{p:c10.O,u:c10.u,lab:"(d)",at:0.92},{p:A10,u:c10.u,lab:"(d₁)",at:0.92,k:"axe3"},{p:B10,u:v10,lab:"(d₂)",at:0.06,k:"axe3"}], rights:[{at:H10,u:c10.u,v:wn10}], pts:[{p:A10,n:"A"},{p:B10,n:"B"}]});
/* Ex 11 : prog = (d₁) ⊥ (d) par M, puis (d₂) ⊥ (d₁) par N ; sinon (comme la fiche de classe) deux perpendiculaires à (d) en M et en N */
const prog = Math.random()<0.5;
const u11=dir(ri(-12,12)), v11=perp(u11), O11=[W/2,165];
const fig11 = prog
  ? (()=>{ const M=add(O11,v11,-120), N=add(O11,v11,-55); return fig({lines:[{p:O11,u:u11,lab:"(d)",at:0.95},{p:M,u:v11,lab:"(d₁)",at:0.06,k:"axe3"},{p:N,u:u11,lab:"(d₂)",at:0.95,k:"axe3"}], rights:[{at:O11,u:u11,v:[-v11[0],-v11[1]]},{at:N,u:u11,v:[-v11[0],-v11[1]]}], pts:[{p:M,n:"M"},{p:N,n:"N"}]}); })()
  : (()=>{ const M=add(O11,u11,-80), N=add(O11,u11,80); return fig({lines:[{p:O11,u:u11,lab:"(d)",at:0.95},{p:M,u:v11,lab:"(d₁)",at:0.06,k:"axe3"},{p:N,u:v11,lab:"(d₂)",at:0.06,k:"axe3"}], rights:[{at:M,u:u11,v:[-v11[0],-v11[1]]},{at:N,u:u11,v:[-v11[0],-v11[1]]}], pts:[{p:M,n:"M",dx:-22,dy:22},{p:N,n:"N",dx:-22,dy:22}]}); })();
const secC = {t:"Constructions", e:[
  {n:"Exercice 8", t:"Tracer des perpendiculaires", w:"Sur ton cahier", h:`<p>Reproduis chaque figure sur ton cahier en comptant les carreaux : la droite (d) passe par des nœuds du quadrillage, et M est sur un nœud. Puis trace, avec ton équerre, la perpendiculaire à (d) passant par M. Nomme-la (d'). N'oublie pas de coder l'angle droit.</p><div class="figs">${perpCases.map(drawStart).join("")}</div>`,
   c:`<p>(d') passe par M et forme un angle droit avec (d), codé par un petit carré.</p><div class="figs">${perpCases.map(drawPerp).join("")}</div>`},
  {n:"Exercice 9", t:"Tracer des parallèles", w:"Sur ton cahier", h:`<p>Reproduis chaque figure sur ton cahier en comptant les carreaux : la droite (d) passe par des nœuds du quadrillage, et M est sur un nœud. Puis trace, avec ton équerre, la parallèle à (d) passant par M. Nomme-la (d').</p><div class="figs">${parCases.map(drawStart).join("")}</div>`,
   c:`<p>Méthode : je trace la perpendiculaire (k) à (d) passant par M, puis la perpendiculaire à (k) passant par M : c'est (d').</p><div class="figs">${parCases.map(c=>`<figure>${drawPar(c)}<figcaption>(d') // (d)</figcaption></figure>`).join("")}</div>`},
  {n:"Exercice 10", t:"Construire puis justifier", w:"Sur ton cahier", h:`${fig10h}<p>Reproduis la figure sur ton cahier en comptant les carreaux. 1 — Trace la droite (d₁) parallèle à (d) passant par A. 2 — Trace la droite (d₂) perpendiculaire à (d) passant par B. 3 — Que peut-on dire des droites (d₁) et (d₂) ? Justifie à l'aide d'une propriété du cours.</p>`,
   c:`${fig10c}<p>(d₁) // (d)</p><p>3 — Je sais que (d₁) // (d) et (d₂) ⊥ (d). Or ${P2txt}. Donc (d₂) ⊥ (d₁).</p>`},
  {n:"Exercice 11", t:"Programme de construction", w:"Sur ton cahier", h: prog
     ? `<p>Exécute ce programme : trace une droite (d), puis place un point M qui n'appartient pas à (d). Trace la droite (d₁) perpendiculaire à (d) passant par M. Place un point N sur (d₁), différent de M, puis trace la droite (d₂) perpendiculaire à (d₁) passant par N. Que peut-on dire des droites (d₂) et (d) ? Justifie.</p>`
     : `<p>Exécute ce programme : trace une droite (d), puis place deux points M et N sur (d). Trace la droite (d₁) perpendiculaire à (d) passant par M. Trace la droite (d₂) perpendiculaire à (d) passant par N. Que peut-on dire des droites (d₁) et (d₂) ? Justifie.</p>`,
   c: prog ? `${fig11}<p>(d₂) // (d)</p><p>Je sais que (d) ⊥ (d₁) et (d₂) ⊥ (d₁). Or ${P1txt}. Donc (d₂) // (d).</p>` : `${fig11}<p>(d₁) // (d₂)</p><p>Je sais que (d₁) ⊥ (d) et (d₂) ⊥ (d). Or ${P1txt}. Donc (d₁) // (d₂).</p>`}
]};
return [secA, secB, secC];
};
