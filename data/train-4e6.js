/* 4e · chapitre 6 — fiche d'entraînement : les exercices de la fiche de M. Staal avec d'autres nombres (outils window.R46 de data/4e-6.js). */
TRAIN["4e-6"] = function(){
const {ri, pick, shuf} = TR;
const {sqFig, redac, F, sq, r4} = window.R46;
const fig=(cap,body)=>`<figure>${body}${cap?`<figcaption>${cap}</figcaption>`:""}</figure>`;
const TRIP=[[3,4,5],[6,8,10],[5,12,13],[8,15,17],[9,12,15],[7,24,25],[20,21,29],[12,16,20],[15,20,25],[28,45,53],[11,60,61],[33,56,65],[16,63,65],[48,55,73]];
const NOMS=shuf(["ABC","DEF","IJK","MNP","RST","UVW","EFG","KLM","GHI","XYZ","OPQ"]);
function tri(ok, dec){
  for(let g=0;g<500;g++){ let [a,b,c]=pick(TRIP), k=dec?pick([0.1,0.2,0.3,0.5]):pick([1,2,3]);
    a=r4(a*k); b=r4(b*k); c=r4(c*k);
    if(!ok){ const d=dec?pick([0.1,0.2,-0.1,0.3]):pick([1,-1,2]); c=r4(c+d); if(c<=Math.max(a,b)||c>=a+b) continue; }
    if(Math.max(a,b,c)>150) continue; return [a,b,c]; }
  return ok?[3,4,5]:[3,4,6];
}
const SIDES=n=>{ const [p,q,r]=n.split(""); return [p+q,q+r,p+r]; };
const assign=(nom,v)=>{ const S=shuf(SIDES(nom)), w=shuf(v); return Object.fromEntries(S.map((s,i)=>[s,w[i]])); };
const et=a=>a.length>1?a.slice(0,-1).join(" ; ")+" et "+a[a.length-1]:a.join("");
const listL=(L,u="cm")=>et(Object.entries(L).map(([s,v])=>`${s} = ${F(v)} ${u}`));

/* ================= 1. Rappels ================= */
const c1=ri(3,15), c2=ri(4,12), p3=4*ri(5,20), a3=pick([16,25,49,64,81,121,144]), p4=4*ri(10,40)+pick([0,2]), a4=pick([169,196,225,400,900]);
const c5=ri(5,12), lo5=c5*c5-ri(1,2*c5-2), hi5=c5*c5+ri(1,2*c5);
/* aires sur quadrillage */
const rw=ri(2,4), rh=ri(1,3), tw=ri(2,4), th=ri(2,3), dd=pick([2,4]), [tp,tq]=pick([[1,2],[2,1],[1,3],[3,1],[2,3],[1,1]]);
const grid=(()=>{ const k=28, X=x=>8+x*k, Y=y=>8+y*k, W=20, H=7; let s=`<svg class="fig" viewBox="0 0 ${X(W)+8} ${Y(H)+8}" width="${X(W)+8}" role="img" aria-label="Quatre figures sur quadrillage">`;
  for(let x=0;x<=W;x++) s+=`<line x1="${X(x)}" y1="${Y(0)}" x2="${X(x)}" y2="${Y(H)}" class="gridl"/>`; for(let y=0;y<=H;y++) s+=`<line x1="${X(0)}" y1="${Y(y)}" x2="${X(W)}" y2="${Y(y)}" class="gridl"/>`;
  const pg=(P,c)=>`<polygon points="${P.map(([x,y])=>X(x)+","+Y(y)).join(" ")}" style="fill:${c}66;stroke:${c};stroke-width:2;stroke-linejoin:round"/>`;
  const y0=1; s+=pg([[1,y0],[1+rw,y0],[1+rw,y0+rh],[1,y0+rh]],"#6aaa3a");
  s+=pg([[6,y0],[6,y0+th],[6+tw,y0+th]],"#4a86c5");
  const cx=13, cy=y0+dd/2; s+=pg([[cx,cy-dd/2],[cx+dd/2,cy],[cx,cy+dd/2],[cx-dd/2,cy]],"#d6457a");
  const ox=16+tq, oy=y0; s+=pg([[ox,oy],[ox+tp,oy+tq],[ox+tp-tq,oy+tq+tp],[ox-tq,oy+tp]],"#e0b400");
  ["①","②","③","④"].forEach((t,i)=>{ s+=`<text x="${X([1+rw/2,6+tw/2,13,ox+(tp-tq)/2][i])}" y="${Y(6.6)}" text-anchor="middle" style="font-size:16px;font-weight:700;fill:var(--ink)">${t}</text>`; });
  return s+"</svg>"; })();

/* ================= 2. Aires des carrés ================= */
const BAL=[[3,4,5],[6,8,10],[9,12,15],[12,16,20],[15,20,25],[20,21,29]];
const sqEx=[true,false].map(ok=>{ const k=pick([0.1,0.2,0.3,0.5,1]); let [a,b,c]=pick(BAL).map(v=>r4(v*k)); if(!ok){ c=r4(c+k*pick([1,2])*Math.max(1,Math.round(c/k/6))); while(c>=a+b-k*0.5) c=r4(c-k); } const A=[sq(a),sq(b),sq(c)]; return {ok, A, svg:sqFig(a,b,c,{areas:A.map(v=>F(v)+" cm²"),w:280})}; });
const sqOrd=shuf([0,1]);

/* ================= 3. Le triangle est-il rectangle ? ================= */
const okI=shuf([true,false]), okD=shuf([true,false,Math.random()<0.5]);
const T4=okI.map((ok,i)=>tri(ok,false)), T5=okD.map((ok,i)=>{ const n=NOMS[i]; const L=assign(n,tri(ok,true)); return {n,L,R:redac(n,L)}; });

/* ================= 4. Problèmes ================= */
const shOk=Math.random()<0.6, [sa,sb,sc]=tri(shOk,false);
const sk=[6,5,4,3,2,1].find(k=>sc*k<=120&&sc*k>=30)||1; const E={mur:sa*sk, eta:sb*sk, sup:sc*sk};
const buOk=Math.random()<0.3, [ba,bb,bc]=tri(buOk,false);
const poOk=Math.random()<0.4, [pa,pb,pc]=tri(poOk,true);

/* ================= 5. Problème ouvert ================= */
const N=pick([17,20,25,26,30]); const sol=[]; for(let c=1;c<=N;c++) for(let a=1;a<c;a++) for(let b=a;b<c;b++) if(a*a+b*b===c*c) sol.push([a,b,c]);

const concl=(R,u="cm")=>R.h;
return [
 {t:"Rappels : périmètre et aire d'un carré", e:[
  {n:"Exercice 1", t:"Périmètre ou aire ?", w:"Sur ton cahier", h:`<p>Écris le calcul, puis la réponse.</p><p><b>a)</b> Quel est le périmètre d'un carré de ${c1} cm de côté ? Et son aire ?</p><p><b>b)</b> Quelle est l'aire d'un carré de ${c2} dm de côté ?</p><p><b>c)</b> Le périmètre d'un carré vaut ${p3} cm. Quelle est la longueur de son côté ?</p><p><b>d)</b> L'aire d'un carré vaut ${a3} cm². Quelle est la longueur de son côté ?</p><p><b>e)</b> Le périmètre d'un carré vaut ${p4} m. Quelle est la longueur de son côté ?</p><p><b>f)</b> L'aire d'un carré vaut ${a4} cm². Quelle est la longueur de son côté ?</p><p><b>g)</b> Je suis un carré. Mon aire est comprise entre ${lo5} cm² et ${hi5} cm². La longueur de mon côté est un nombre entier. Quelle est la longueur de mes côtés ?</p>`,
   c:`<p><b>a)</b> 4 × ${c1} = <b>${4*c1} cm</b> ; ${c1} × ${c1} = <b>${c1*c1} cm²</b></p><p><b>b)</b> ${c2} × ${c2} = <b>${c2*c2} dm²</b></p><p><b>c)</b> ${p3} ÷ 4 = <b>${p3/4} cm</b></p><p><b>d)</b> ${Math.sqrt(a3)} × ${Math.sqrt(a3)} = ${a3}, donc <b>${Math.sqrt(a3)} cm</b></p><p><b>e)</b> ${p4} ÷ 4 = <b>${F(p4/4)} m</b></p><p><b>f)</b> ${Math.sqrt(a4)} × ${Math.sqrt(a4)} = ${a4}, donc <b>${Math.sqrt(a4)} cm</b></p><p><b>g)</b> ${c5-1} × ${c5-1} = ${(c5-1)**2} et ${c5+1} × ${c5+1} = ${(c5+1)**2} ne conviennent pas ; ${c5} × ${c5} = ${c5*c5} convient : <b>${c5} cm</b>.</p>`},
  {n:"Exercice 2", t:"Calculs d'aires", w:"Sur ta feuille", h:`<p>L'unité d'aire est l'aire d'un carreau. Donne l'aire de chaque figure.</p>${grid}`,
   c:`<p><b>①</b> ${rw} × ${rh} = <b>${rw*rh} carreaux</b></p><p><b>②</b> la moitié d'un rectangle de ${tw} sur ${th} : ${tw} × ${th} ÷ 2 = <b>${F(tw*th/2)} carreaux</b></p><p><b>③</b> ses diagonales mesurent ${dd} carreaux : c'est la moitié d'un carré de ${dd} sur ${dd}, soit ${dd*dd} ÷ 2 = <b>${dd*dd/2} carreaux</b></p><p><b>④</b> le grand carré qui l'entoure (${tp+tq} sur ${tp+tq}) moins 4 triangles de ${tp} sur ${tq} : ${(tp+tq)**2} − 4 × ${F(tp*tq/2)} = <b>${tp*tp+tq*tq} carreaux</b></p>`}
 ]},
 {t:"Avec les aires des carrés", e:[
  {n:"Exercice 3", t:"Le triangle est-il rectangle ?", w:"Sur ton cahier", h:`<p>On a construit des carrés sur les côtés de deux triangles. Chaque triangle est-il rectangle ? Justifie.</p><div class="figs">${sqOrd.map((j,i)=>fig(`${"ab"[i]})`,sqEx[j].svg)).join("")}</div>`,
   c:sqOrd.map((j,i)=>{ const X=sqEx[j], A=[...X.A].sort((p,q)=>p-q), s=r4(A[0]+A[1]); return `<p><b>${"ab"[i]})</b> Le grand carré a pour aire ${F(A[2])} cm². ${F(A[0])} + ${F(A[1])} = ${F(s)}. ${X.ok?"C'est égal à l'aire du grand carré : <b>le triangle est rectangle</b>.":`${F(s)} ≠ ${F(A[2])} : <b>le triangle n'est pas rectangle</b>.`}</p>`; }).join("")}
 ]},
 {t:"Le triangle est-il rectangle ?", e:[
  {n:"Exercice 4", t:"Avec des nombres entiers", w:"Sur ton cahier", h:T4.map((t,i)=>`<p><b>${"ab"[i]})</b> Un triangle a des côtés qui mesurent ${et(shuf(t).map(v=>F(v)+" cm"))}. Est-il rectangle ? Justifie.</p>`).join(""),
   c:T4.map((t,i)=>{ const [a,b,c]=[...t].sort((p,q)=>p-q), ok=sq(c)===r4(sq(a)+sq(b)); return `<p><b>${"ab"[i]})</b> Le plus grand côté mesure ${F(c)} cm.</p><p class="calc">D'une part : ${F(c)}² = ${F(sq(c))}<br>D'autre part : ${F(a)}² + ${F(b)}² = ${F(sq(a))} + ${F(sq(b))} = ${F(r4(sq(a)+sq(b)))}</p><p>${ok?"L'égalité de Pythagore est vérifiée : <b>le triangle est rectangle</b>.":"L'égalité de Pythagore n'est pas vérifiée : <b>le triangle n'est pas rectangle</b>."}</p>`; }).join("")},
  {n:"Exercice 5", t:"Avec des nombres décimaux", w:"Sur ton cahier", h:`<p>Ces triangles sont-ils rectangles ? Justifie.</p>`+T5.map((t,i)=>`<p><b>${"abc"[i]})</b> Le triangle ${t.n} tel que : ${listL(t.L)}.</p>`).join(""),
   c:T5.map((t,i)=>`<p><b>${"abc"[i]})</b></p>${t.R.h}`).join("")}
 ]},
 {t:"Problèmes", e:[
  {n:"Exercice 6", t:"Installation d'une étagère", w:"Sur ton cahier", h:`<p>Sur un mur vertical, Jules a posé une étagère [ET] et un support [AT].</p><p>AE = ${E.mur} cm (sur le mur), ET = ${E.eta} cm et AT = ${E.sup} cm.</p><p>L'étagère est-elle horizontale ?</p>`,
   c:`<p>L'étagère est horizontale si elle est perpendiculaire au mur, c'est-à-dire si le triangle AET est rectangle en E.</p>${redac("AET",{AT:E.sup,AE:E.mur,ET:E.eta}).h}<p>${shOk?"<b>L'étagère est horizontale.</b>":"<b>L'étagère n'est pas horizontale.</b>"}</p>`},
  {n:"Exercice 7", t:"Le bureau", w:"Sur ton cahier", h:`<p>Sur un bureau, on mesure ${ba} cm sur la paroi verticale, ${bb} cm sur le plateau et ${bc} cm entre les deux points mesurés.</p><p>Le plateau est-il horizontal ? Explique.</p>`,
   c:`<p>Le plus grand côté mesure ${bc} cm.</p><p class="calc">D'une part : ${bc}² = ${F(bc*bc)}<br>D'autre part : ${ba}² + ${bb}² = ${F(ba*ba)} + ${F(bb*bb)} = ${F(ba*ba+bb*bb)}</p><p>${buOk?"L'égalité de Pythagore est vérifiée : le triangle est rectangle, le plateau est perpendiculaire à la paroi. <b>Le plateau est horizontal.</b>":"L'égalité de Pythagore n'est pas vérifiée : le triangle n'est pas rectangle. <b>Le plateau n'est pas horizontal</b> : les stylos roulent."}</p>`},
  {n:"Exercice 8", t:"Forme de potager", w:"Sur ton cahier", h:`<p>Nathan prétend que son potager est de forme rectangulaire.</p><p>Émilie mesure deux côtés consécutifs : ${F(pa)} m et ${F(pb)} m. La diagonale mesure ${F(pc)} m.</p><p>Le potager peut-il être rectangulaire ? Explique.</p>`,
   c:`<p>Le plus grand côté du triangle formé par les deux côtés et la diagonale est la diagonale.</p><p class="calc">D'une part : ${F(pc)}² = ${F(sq(pc))}<br>D'autre part : ${F(pa)}² + ${F(pb)}² = ${F(sq(pa))} + ${F(sq(pb))} = ${F(r4(sq(pa)+sq(pb)))}</p><p>${poOk?"L'égalité de Pythagore est vérifiée : l'angle entre les deux côtés est droit. <b>Le potager peut être rectangulaire.</b>":"L'égalité de Pythagore n'est pas vérifiée : l'angle entre les deux côtés n'est pas droit. <b>Le potager n'est pas rectangulaire.</b>"}</p>`}
 ]},
 {t:"Problème ouvert", e:[
  {n:"Exercice 9", t:"Recherche des carrés parfaits", w:"Sur ton cahier", h:`<p>Je suis un triangle rectangle dont les mesures des côtés sont des nombres entiers compris entre 1 et ${N}.</p><p>Quelles peuvent être les mesures de mes côtés ? Suis-je unique ?</p>`,
   c:`<p>On cherche trois entiers tels que le carré du plus grand soit égal à la somme des carrés des deux autres.</p><p class="calc">${sol.map(([a,b,c])=>`${a}² + ${b}² = ${a*a} + ${b*b} = ${c*c} = ${c}²`).join("<br>")}</p><p>Il y a <b>${sol.length} possibilités</b> : le triangle n'est pas unique.</p>`}
 ]}
];
};
