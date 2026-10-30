/* 6e — Chapitre 2 : Premiers éléments de géométrie (pas d'évaluation) */
(function(){
const VF = ["Vrai","Faux"];
const co = (p,alt,w) => img("c2co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("c2ex/"+p+".png", alt, w);
const P = (x,y,L,dx=8,dy=-8) => cross(x,y,"ln")+`<text x="${x+dx}" y="${y+dy}" font-size="17">${L}</text>`;
/* A, B, C alignés sur une droite, D en dehors */
const figAlign = `<svg class="fig" viewBox="0 0 360 175" width="360" role="img" aria-label="Points A, B, C sur une droite, point D en dehors"><line x1="10" y1="130" x2="350" y2="40" class="ln"/>${P(70,114.1,"A",-4,-12)}${P(170,87.6,"B",-4,-12)}${P(270,61.2,"C",-4,-12)}${P(190,152,"D")}</svg>`;
/* deux droites sécantes quelconques */
const figSec = `<svg class="fig" viewBox="0 0 360 180" width="360" role="img" aria-label="Deux droites qui se coupent"><line x1="20" y1="30" x2="340" y2="150" class="ln"/><line x1="20" y1="150" x2="340" y2="40" class="ln"/><text x="300" y="168" font-size="16">(d)</text><text x="300" y="36" font-size="16">(d')</text></svg>`;
/* deux droites perpendiculaires, angle droit codé */
const figPerp = `<svg class="fig" viewBox="0 0 360 170" width="360" role="img" aria-label="Deux droites perpendiculaires"><line x1="20" y1="100" x2="340" y2="60" class="ln"/><line x1="170.7" y1="5.6" x2="189.3" y2="164.4" class="ln"/><path d="M189.9 78.8 L191.2 88.7 L181.2 89.9" class="thin"/><text x="300" y="56" font-size="16">(d)</text><text x="196" y="160" font-size="16">(d')</text></svg>`;
/* deux droites qui ne se coupent pas sur la figure mais sont sécantes */
const figLoin = `<svg class="fig" viewBox="0 0 360 170" width="360" role="img" aria-label="Deux droites qui se rapprochent sans se couper sur la figure"><line x1="20" y1="40" x2="250" y2="70" class="ln"/><line x1="20" y1="140" x2="250" y2="105" class="ln"/><text x="24" y="30" font-size="16">(d)</text><text x="24" y="164" font-size="16">(d')</text></svg>`;

/* ---------- dessins des corrections ----------
   Les figures des énoncés (images) sont reprises avec les mêmes coordonnées (divisées par 2),
   puis on ajoute ce que l'élève doit tracer : en couleur ; traits de construction en pointillés gris. */
const KC = "var(--c)";
const f1 = n => (+n).toFixed(1);
const vadd = (a,u,t=1) => [a[0]+u[0]*t, a[1]+u[1]*t], vsub = (a,b) => [a[0]-b[0], a[1]-b[1]];
const vun = a => { const l=Math.hypot(a[0],a[1]); return [a[0]/l, a[1]/l]; }, vperp = u => [-u[1], u[0]];
const vfoot = (M,P,u) => { const w=vun(u), t=(M[0]-P[0])*w[0]+(M[1]-P[1])*w[1]; return vadd(P,w,t); };
const half = p => [p[0]/2, p[1]/2];
const txt = (x,y,t,k) => `<text x="${f1(x)}" y="${f1(y)}" font-size="16"${k==="n"?` style="fill:${KC};font-weight:700"`:""}>${t}</text>`;
/* B = [x0,y0,W,H] ; éléments :
   {d:[P,u]} droite passant par P, de direction u, coupée au bord du cadre · {s:[P,Q]} segment
   {x:P, n:"A", dx, dy} point (croix) et son nom · {r:[O,u,v]} angle droit codé en O, côtés de directions u et v
   {t:[x,y,"texte"]} étiquette · k : "n" = tracé par l'élève (couleur), "c" = trait de construction, "z" = zone surlignée */
function dessin(B, w, lab, items){
  const [x0,y0,W,H]=B, m=4;
  const st = k => k==="n" ? ` style="stroke:${KC};stroke-width:2.4"` : k==="z" ? ` style="stroke:${KC};stroke-width:7;stroke-opacity:.45"` : "";
  const clip = (P,u) => { const ts=[];
    if(Math.abs(u[0])>1e-9) ts.push((x0+m-P[0])/u[0], (x0+W-m-P[0])/u[0]);
    if(Math.abs(u[1])>1e-9) ts.push((y0+m-P[1])/u[1], (y0+H-m-P[1])/u[1]);
    const q=ts.map(t=>[t,vadd(P,u,t)]).filter(([,r])=>r[0]>=x0+m-1e-6&&r[0]<=x0+W-m+1e-6&&r[1]>=y0+m-1e-6&&r[1]<=y0+H-m+1e-6).sort((a,b)=>a[0]-b[0]);
    return [q[0][1], q[q.length-1][1]]; };
  const L = (a,b,k) => `<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" class="${k==="c"?"cons":"ln"}"${st(k)}/>`;
  let s=`<svg class="fig" viewBox="${x0} ${y0} ${W} ${H}" width="${w}" role="img" aria-label="${lab}">`;
  items.forEach(it=>{
    if(it.d){ const [a,b]=clip(it.d[0], it.d[1]); s+=L(a,b,it.k); }
    else if(it.s) s+=L(it.s[0], it.s[1], it.k);
    else if(it.r){ const [O,u,v]=it.r, q=11, a=vadd(O,vun(u),q), b=vadd(a,vun(v),q), c=vadd(O,vun(v),q);
      s+=`<path d="M${f1(a[0])} ${f1(a[1])} L${f1(b[0])} ${f1(b[1])} L${f1(c[0])} ${f1(c[1])}" class="thin"${st(it.k)}/>`; }
    else if(it.x){ const P=it.x;
      s+=`<path d="M${f1(P[0]-6)} ${f1(P[1]-6)} L${f1(P[0]+6)} ${f1(P[1]+6)} M${f1(P[0]+6)} ${f1(P[1]-6)} L${f1(P[0]-6)} ${f1(P[1]+6)}" class="ln"${st(it.k)}/>`;
      if(it.n) s+=txt(P[0]+(it.dx??8), P[1]+(it.dy??-8), it.n, it.k); }
    else if(it.t) s+=txt(it.t[0], it.t[1], it.t[2], it.k);
  });
  return s+"</svg>";
}

/* Exercice 2 : les trois dessins du tableau */
const d2 = [
  dessin([0,0,230,64],210,"Le point A sur le segment [CD]",[{s:[[20,40],[210,40]]},{x:[20,40],n:"C",dx:-5,dy:-12},{x:[210,40],n:"D",dx:-5,dy:-12},{x:[120,40],n:"A",dx:-5,dy:-12,k:"n"}]),
  dessin([0,0,230,74],210,"Le point B en dehors de la droite (EF)",[{d:[[60,56],[1,0]]},{x:[60,56],n:"E",dx:-5,dy:-12},{x:[160,56],n:"F",dx:-5,dy:-12},{x:[115,18],n:"B",dx:9,dy:5,k:"n"}]),
  dessin([0,0,230,64],210,"Le point H sur la droite (PL), à l'extérieur du segment [PL]",[{d:[[40,40],[1,0]]},{x:[40,40],n:"P",dx:-5,dy:-12},{x:[120,40],n:"L",dx:-5,dy:-12},{x:[190,40],n:"H",dx:-5,dy:-12,k:"n"}])
];

/* Exercice 3 : points de l'image c2ex/p2-02 (mêmes coordonnées) */
const A3=[102.5,89.5], B3=[30.5,175.5], C3=[234.5,42.5], D3=[313.5,56.5], E3=[197.5,203.5];
const inter = (P,Q,R,S) => { const u=vsub(Q,P), v=vsub(S,R), d=u[0]*v[1]-u[1]*v[0], t=((R[0]-P[0])*v[1]-(R[1]-P[1])*v[0])/d; return vadd(P,u,t); };
const I3=inter(A3,E3,B3,D3), L3=inter(A3,B3,C3,D3), G3=vadd(B3,vsub(E3,B3),0.5), H3=vadd(A3,vsub(E3,A3),-0.35), M3=vadd(C3,vsub(D3,C3),0.5);
const d3 = dessin([0,0,354,254],420,"Correction de l'exercice 3 : les points G, H, I, L et M",[
  {d:[A3,vsub(E3,A3)],k:"c"},{d:[B3,vsub(D3,B3)],k:"c"},{d:[A3,vsub(B3,A3)],k:"c"},{d:[C3,vsub(D3,C3)],k:"c"},{s:[B3,E3],k:"c"},
  {x:A3,n:"A",dx:9,dy:4},{x:B3,n:"B",dx:-18,dy:-4},{x:C3,n:"C",dx:2,dy:-10},{x:D3,n:"D",dx:4,dy:-10},{x:E3,n:"E",dx:10,dy:6},
  {x:G3,n:"G",dx:-4,dy:22,k:"n"},{x:H3,n:"H",dx:-22,dy:4,k:"n"},{x:I3,n:"I",dx:10,dy:6,k:"n"},{x:L3,n:"L",dx:-18,dy:-4,k:"n"},{x:M3,n:"M",dx:-5,dy:-11,k:"n"}]);

/* Exercice 4 : deux exemples (A du côté de C, A du côté de B) */
const u4=vun([1,-0.2]), P4=[20,128], at4=t=>vadd(P4,u4,t);
const d4 = A => dessin([0,0,300,150],280,"Points B et C sur une droite, A sur la droite en dehors du segment [BC], D en dehors de la droite",[
  {d:[P4,u4]},{x:at4(100),n:"B",dx:-5,dy:-13},{x:at4(180),n:"C",dx:-5,dy:-13},{x:at4(A),n:"A",dx:-5,dy:-13,k:"n"},{x:A>150?[110,40]:[205,135],n:"D",dx:9,dy:5,k:"n"}]);

/* Exercices 8 et 9 : droites et points des images c2ex/p6-09 … p7-19 (coordonnées divisées par 2) */
const cas = (P,Q,M,lm,ld,lt) => ({P:half(P), u:vsub(Q,P), Q:half(Q), M:half(M), lm, ld, lt});
const C8 = [cas([67.5,243.5],[461.5,126],[265,184.6],[7,-12],[232,55],-58), cas([67.5,254],[461.5,165],[294,80.5],[8,-6],[232,75],105), cas([313.5,65.5],[175.8,311.5],[422.5,223.5],[8,-6],[160,24],58)];
const C9 = [cas([67.5,243.5],[461.5,126],[224.5,65.5],[8,-6],[232,55]), cas([76.5,86],[462,248],[165.5,263.5],[8,-6],[232,116]), cas([67.5,87.7],[462.5,87.7],[244.5,224.5],[8,-6],[236,36])];
const B8 = [[0,0,265,165],[0,0,265,165],[0,0,265,180]];
function perpCase(c,i){
  const v=vperp(vun(c.u)), F=vfoot(c.M,c.P,c.u), w=Math.hypot(c.M[0]-F[0],c.M[1]-F[1])>1 ? vsub(c.M,F) : v;
  const lab = vadd(c.M, v, c.lt);   /* nom (d') placé sur la droite, à la distance lt de M */
  return dessin(B8[i],265,"Correction : la perpendiculaire (d') à (d) passant par M",[
    {s:[c.P,c.Q]},{d:[c.M,v],k:"n"},{r:[F,c.u,w],k:"n"},
    {x:c.M,n:"M",dx:c.lm[0],dy:c.lm[1]},{t:[c.ld[0],c.ld[1],"(d)"]},{t:[lab[0]+8,lab[1],"(d')"],k:"n"}]);
}
function parCase(c,i){
  const v=vperp(vun(c.u)), F=vfoot(c.M,c.P,c.u), w=vun(vsub(c.M,F)), lab=vadd(c.M,vun(c.u),-80);
  return dessin(B8[i],265,"Correction : la parallèle (d') à (d) passant par M, tracée avec la perpendiculaire (k)",[
    {s:[c.P,c.Q]},{d:[c.M,v],k:"c"},{d:[c.M,c.u],k:"n"},{r:[F,[-c.u[0],-c.u[1]],w]},{r:[c.M,[-c.u[0],-c.u[1]],[-w[0],-w[1]]]},
    {x:c.M,n:"M",dx:c.lm[0],dy:c.lm[1]},{t:[c.ld[0],c.ld[1],"(d)"]},{t:[lab[0]-10,lab[1]+(w[1]<0?-10:22),"(d')"],k:"n"}]);
}

/* Exercice 10 : image c2ex/p7-21 (coordonnées divisées par 2), cadre agrandi vers le haut */
const P10=half([65.5,278.5]), Q10=half([682.5,124.5]), u10=vsub(Q10,P10), A10=half([207,76.5]), B10=half([528,296.5]);
const F10=vfoot(B10,P10,u10), v10=vperp(vun(u10));
const d10 = dessin([0,-30,374,215],420,"Correction de l'exercice 10 : (d₁) parallèle à (d) passant par A, (d₂) perpendiculaire à (d) passant par B",[
  {s:[P10,Q10]},{d:[A10,u10],k:"n"},{d:[B10,v10],k:"n"},{r:[F10,vun(u10),vsub(B10,F10)],k:"n"},
  {x:A10,n:"A",dx:-6,dy:-12},{x:B10,n:"B",dx:10,dy:6},{t:[343,52,"(d)"]},{t:[22,46,"(d₁)"],k:"n"},{t:[184,-12,"(d₂)"],k:"n"}]);

/* Exercice 11, question 1 : deux perpendiculaires à (d) */
const u11=vun([1,-0.12]), P11=[20,150], M11=vadd(P11,u11,90), N11=vadd(P11,u11,220), v11=vperp(u11);
const d11 = dessin([0,0,320,190],300,"Correction : (d₁) et (d₂) perpendiculaires à (d) en M et en N",[
  {d:[P11,u11]},{x:M11,n:"M",dx:-20,dy:20},{x:N11,n:"N",dx:-20,dy:20},
  {d:[M11,v11],k:"n"},{d:[N11,v11],k:"n"},{r:[M11,u11,[-v11[0],-v11[1]]],k:"n"},{r:[N11,u11,[-v11[0],-v11[1]]],k:"n"},
  {t:[290,140,"(d)"]},{t:[M11[0]-108*v11[0]+8,M11[1]-108*v11[1]+10,"(d₁)"],k:"n"},{t:[N11[0]-108*v11[0]+8,N11[1]-108*v11[1]+10,"(d₂)"],k:"n"}]);

/* Défi de la partie A : où placer D */
const dDefA = dessin([0,0,340,100],320,"A, B, C alignés ; D se place sur la droite, avant A ou après C",[
  {d:[[90,50],[1,0]]},{s:[[8,50],[82,50]],k:"z"},{s:[[258,50],[332,50]],k:"z"},
  {x:[90,50],n:"A",dx:-5,dy:-13},{x:[170,50],n:"B",dx:-5,dy:-13},{x:[250,50],n:"C",dx:-5,dy:-13},
  {t:[26,82,"D ici"],k:"n"},{t:[272,82,"D ici"],k:"n"}]);

/* Défi de la partie C : (d₁) ⊥ (d) passant par A, puis (d₂) ⊥ (d₁) passant par A */
const uC=vun([1,-0.15]), PC=[20,150], AC=[150,50], FC=vfoot(AC,PC,uC), wC=vun(vsub(AC,FC));
const dDefC = dessin([0,0,320,180],300,"(d₁) perpendiculaire à (d) passant par A, (d₂) perpendiculaire à (d₁) passant par A",[
  {d:[PC,uC]},{x:AC,n:"A",dx:-22,dy:-8},{d:[AC,wC],k:"n"},{d:[AC,uC],k:"n"},{r:[FC,uC,wC],k:"n"},{r:[AC,uC,[-wC[0],-wC[1]]],k:"n"},
  {t:[284,124,"(d)"]},{t:[270,10,"(d₂)"],k:"n"},{t:[FC[0]+12,170,"(d₁)"],k:"n"}]);

CH["6e-2"] = {
intro: "Points, droites, demi-droites et segments ; appartenance et alignement ; droites sécantes, perpendiculaires et parallèles ; constructions à la règle et à l'équerre.",
savoir: [
  "nommer correctement un point, une droite, une demi-droite, un segment ;",
  "utiliser les symboles ∈, ∉, ⊥ et // ;",
  "reconnaître des points alignés et un point d'intersection ;",
  "reconnaître deux droites sécantes, perpendiculaires ou parallèles ;",
  "tracer une perpendiculaire et une parallèle à la règle et à l'équerre."
],

/* ===================== COURS ===================== */
cours: [
{k:"I", t:"Notations et vocabulaire", h:`
  <p>Quatre objets à connaître, avec leurs notations :</p>
  <div class="scroll"><table class="std"><thead><tr><th>Objet</th><th>Figure</th><th>Notation</th></tr></thead><tbody>
    <tr><td><b>Le point</b><br>Marqué par une croix, nommé par une lettre majuscule.</td><td>${co("p1-00","Un point A",56)}</td><td>le point A</td></tr>
    <tr><td><b>La droite</b><br>Illimitée des deux côtés : on ne peut jamais la mesurer.</td><td>${co("p1-02","La droite (d) passant par A et B",260)}</td><td>(AB) ou (BA), ou une lettre minuscule entre parenthèses : (d)</td></tr>
    <tr><td><b>La demi-droite</b><br>Limitée d'un seul côté par son origine, illimitée de l'autre.</td><td>${co("p1-04","La demi-droite d'origine A passant par B",260)}</td><td>[AB) : origine A, passant par B</td></tr>
    <tr><td><b>Le segment</b><br>Limité par deux points appelés extrémités. On peut le mesurer.</td><td>${co("p1-06","Le segment [AB]",160)}</td><td>[AB] ou [BA] ; sa longueur se note AB, sans crochets</td></tr>
  </tbody></table></div>
  <div class="retenir" data-l="Attention"><p>[AB) et [BA) ne désignent pas la même demi-droite : elles n'ont pas la même origine.</p></div>`},
{k:"II", t:"Alignement et appartenance", h:`
  <h4>1. Appartenir à une droite</h4>
  <div class="retenir" data-l="Définition"><p>Un point appartient à une droite lorsqu'il est situé sur cette droite.</p></div>
  <p>Notation : on écrit A ∈ (d), qui se lit « A appartient à (d) ». Si le point B n'est pas sur la droite, on écrit B ∉ (d), qui se lit « B n'appartient pas à (d) ».</p>
  <h4>2. Points alignés</h4>
  <div class="retenir" data-l="Définition"><p>Des points alignés sont des points qui appartiennent à une même droite.</p></div>
  <p>Remarque : deux points sont toujours alignés, on peut toujours tracer une droite qui passe par les deux. La question ne devient intéressante qu'à partir de trois points.</p>
  <h4>3. Point d'intersection</h4>
  <div class="retenir" data-l="Définition"><p>Si deux droites se coupent en un point, ce point est appelé point d'intersection des deux droites.</p></div>`},
{k:"III", t:"Position relative de deux droites", h:`
  <h4>1. Droites sécantes</h4>
  <div class="retenir" data-l="Définition"><p>Deux droites sont sécantes lorsqu'elles se coupent en un point.</p></div>
  ${co("p4-11","Deux droites sécantes (AB) et (CD)",330)}
  <p><b>Remarque importante :</b> deux droites peuvent sembler ne pas se couper sur la figure et être tout de même sécantes. Il suffit parfois de les prolonger pour s'en apercevoir.</p>
  ${co("p4-12","Deux droites (d) et (d') qui ne se coupent pas sur la figure",190)}
  <h4>2. Droites perpendiculaires</h4>
  <div class="retenir" data-l="Définition"><p>Deux droites sont perpendiculaires lorsqu'elles se coupent en formant un angle droit. On code cet angle droit par un petit carré.</p></div>
  ${co("p4-13","Deux droites perpendiculaires (f) et (g)",200)}
  <p>Notation : on écrit (f) ⊥ (g), qui se lit « (f) est perpendiculaire à (g) ». Remarque : deux droites perpendiculaires sont toujours sécantes.</p>
  <h4>3. Droites parallèles</h4>
  <div class="retenir" data-l="Définition"><p>Deux droites sont parallèles lorsqu'elles ne se coupent jamais, même si on les prolonge aussi loin que l'on veut.</p></div>
  ${co("p5-14","Deux droites parallèles (f) et (h)",170)}
  <p>Notation : on écrit (f) // (h), qui se lit « (f) est parallèle à (h) ».</p>
  <h4>4. Deux propriétés à connaître</h4>
  <div class="retenir" data-l="Propriété 1"><p>Si deux droites sont perpendiculaires à une même droite, alors elles sont parallèles entre elles.</p></div>
  ${co("p5-15","(d1) et (d2) perpendiculaires à (d)",330)}
  <p>Ici : (d₁) ⊥ (d) et (d₂) ⊥ (d), donc (d₁) // (d₂).</p>
  <div class="retenir" data-l="Propriété 2"><p>Si deux droites sont parallèles et si une troisième droite est perpendiculaire à l'une, alors elle est perpendiculaire à l'autre.</p></div>
  ${co("p5-17","(d1) // (d2) et (d3) perpendiculaire à (d1)",330)}
  <p>Ici : (d₁) // (d₂) et (d₃) ⊥ (d₁), donc (d₃) ⊥ (d₂).</p>`},
{k:"IV", t:"Constructions", h:`
  <h4>1. Tracer une perpendiculaire</h4>
  <p>Exemple : trace la perpendiculaire à (d) passant par le point M. Nomme-la (d').</p>
  ${co("p6-19","Méthode en trois étapes pour tracer une perpendiculaire à l'équerre",760)}
  <div class="anim" data-anim="6e2-perp-equerre"></div>
  <h4>2. Tracer une parallèle</h4>
  <p>Exemple : trace la parallèle à (d) passant par le point M. Nomme-la (d'). Méthode : on utilise deux fois la perpendiculaire.</p>
  <div class="figs">
    <figure>${co("p7-23","Étape 1",220)}<figcaption>Étape 1 : on repère la droite (d) et le point M.</figcaption></figure>
    <figure>${co("p7-25","Étape 2",220)}<figcaption>Étape 2 : on trace la perpendiculaire (k) à (d) passant par M.</figcaption></figure>
    <figure>${co("p7-27","Étape 3",220)}<figcaption>Étape 3 : on trace la perpendiculaire à (k) passant par M. C'est la droite (d') cherchée.</figcaption></figure>
  </div>
  <div class="anim" data-anim="6e2-parallele-perp"></div>
  <div class="retenir" data-l="Pourquoi ça marche"><p>(d) et (d') sont toutes les deux perpendiculaires à (k), donc elles sont parallèles (propriété 1).</p></div>
  <p><b>Autre méthode :</b> on peut aussi poser un côté de l'équerre sur (d), placer la règle contre l'autre côté, puis faire glisser l'équerre le long de la règle jusqu'au point M.</p>
  <div class="anim" data-anim="6e2-parallele-glissement"></div>`}
],

/* ===================== EXERCICES ===================== */
exos: [
{t:"Appartenance et alignement", e:[
  {n:"Exercice 1", t:"∈ ou ∉ ?", w:"Sur ton cahier", h:`${ex("p1-00","Figure de l'exercice 1",260)}<p>Recopie chaque ligne et complète avec le symbole ∈ ou ∉.</p>
   <p>1. B …… [AC] · 2. A …… [BC] · 3. A …… (BC) · 4. C …… (AB) · 5. D …… (AC) · 6. M …… (AD) · 7. M …… [AD] · 8. N …… [BD] · 9. N …… (AC) · 10. E …… (AD)</p>`,
   c:`1. B ∈ [AC] · 2. A ∉ [BC] · 3. A ∈ (BC) · 4. C ∈ (AB) · 5. D ∉ (AC) · 6. M ∈ (AD) · 7. M ∉ [AD] · 8. N ∈ [BD] · 9. N ∉ (AC) · 10. E ∉ (AD)`},
  {n:"Exercice 2", t:"Trois façons de dire la même chose", w:"Sur ta feuille", h:`<p>Complète le tableau : écris chaque phrase mathématique en français, puis fais un dessin.</p>
   <div class="scroll"><table class="std"><thead><tr><th style="width:22%">Phrase mathématique</th><th style="width:33%">Phrase en français</th><th style="width:45%">Dessin</th></tr></thead><tbody><tr><td style="height:140px">A ∈ [CD]</td><td></td><td></td></tr><tr><td style="height:140px">B ∉ (EF)</td><td></td><td></td></tr><tr><td style="height:140px">H ∈ (PL) mais H ∉ [PL]</td><td></td><td></td></tr></tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Phrase mathématique</th><th>Phrase en français</th><th>Dessin</th></tr></thead><tbody>
   <tr><td>A ∈ [CD]</td><td>Le point A appartient au segment [CD].</td><td style="min-width:215px">${d2[0]}</td></tr>
   <tr><td>B ∉ (EF)</td><td>Le point B n'appartient pas à la droite (EF).</td><td>${d2[1]}</td></tr>
   <tr><td>H ∈ (PL) mais H ∉ [PL]</td><td>Le point H appartient à la droite (PL), mais il n'appartient pas au segment [PL].</td><td>${d2[2]}</td></tr></tbody></table></div>
   <p>Ce n'est qu'un exemple de dessin. Tu peux placer les points ailleurs, si tu respectes la phrase. Pour H, tu peux aussi le placer avant P.</p>`},
  {n:"Exercice 3", t:"Placer des points", w:"Sur ta feuille", h:`${ex("p2-02","Points A, B, C, D, E de l'exercice 3",420)}<p>En t'aidant des points déjà placés, place les points G, H, I, L et M tels que :</p>
   <p>a) G ∈ (BE) et G ∈ [BE] · b) H ∈ (AE) et H ∉ [AE] · c) les points I, A et E sont alignés, et les points I, B et D le sont également · d) L ∈ (AB) et L ∈ (CD) · e) M ∈ (CD)</p>`,
   c:`<ul><li>a) G est un point du segment [BE], entre B et E.</li><li>b) H est sur la droite (AE), mais à l'extérieur du segment [AE].</li><li>c) I est le point d'intersection des droites (AE) et (BD) : trace les deux droites, I est là où elles se coupent.</li><li>d) L est le point d'intersection des droites (AB) et (CD).</li><li>e) M est n'importe quel point de la droite (CD) : il y a une infinité de réponses possibles.</li></ul>
   ${d3}<p>Les droites en pointillés servent à placer les points. G, H et M peuvent être placés ailleurs, s'ils respectent les conditions. I et L ont une seule position possible.</p>`},
  {n:"Exercice 4", t:"Une seule position ?", w:"Sur ton cahier", h:`<p>On sait que : A ∈ (BC) ; D ∉ (BC) et A ∉ [BC].</p><p>1 — Place les points A, B, C et D. 2 — Y a-t-il une seule position possible ? Dessine dans ton cahier toutes les autres possibilités que tu trouves.</p>`,
   c:`<p>A est sur la droite (BC) mais pas sur le segment [BC] : il est soit du côté de B (avant B), soit du côté de C (après C).</p><p>D est n'importe où en dehors de la droite (BC).</p><p>Il n'y a donc pas une seule position possible : il y en a une infinité. Deux exemples :</p><div class="figs"><figure>${d4(262)}<figcaption>A est du côté de C.</figcaption></figure><figure>${d4(28)}<figcaption>A est du côté de B.</figcaption></figure></div>`}
 ],
 aide:{t:"Pour démarrer", w:"Sur ton cahier", h:`${figAlign}<p>Complète avec ∈ ou ∉ : a. B …… (AC) · b. D …… (AC) · c. C …… [AB] · d. B …… [AC]</p>`,
  c:`a. B ∈ (AC) · b. D ∉ (AC) · c. C ∉ [AB] (C est après B) · d. B ∈ [AC] (B est entre A et C)`},
 defi:{t:"Où est D ?", w:"Sur ton cahier", h:`<p>Place trois points A, B, C alignés, avec B ∈ [AC]. Place ensuite un point D tel que D ∈ (AB) et D ∉ [AC]. De quel(s) côté(s) peut-on placer D ?</p>`,
  c:`<p>D est sur la droite (AC), mais pas entre A et C. On peut le placer du côté de A (avant A) ou du côté de C (après C) : deux côtés possibles, et une infinité de positions.</p>${dDefA}`}
},
{t:"Perpendiculaires, parallèles et justifications", note:`<b>Comment rédiger une justification :</b> Je sais que : (d₁) ⊥ (d) et (d₂) ⊥ (d). Or : si deux droites sont perpendiculaires à une même droite, alors elles sont parallèles entre elles. Donc : (d₁) // (d₂).`, e:[
  {n:"Exercice 5", t:"Quelle propriété ?", w:"Sur ton cahier", h:`<p>Pour chaque figure, réponds à la question puis cite la propriété que tu as utilisée.</p>
   <div class="figs"><figure>${ex("p3-03","Figure a de l'exercice 5",210)}<figcaption>a) Que peut-on dire des droites (AB) et (FE) ?</figcaption></figure>
   <figure>${ex("p3-04","Figure b de l'exercice 5",200)}<figcaption>b) Que peut-on dire des droites (AS) et (AB) ?</figcaption></figure></div>`,
   c:`<p>a) Je sais que (AB) ⊥ (DC) et (FE) ⊥ (DC). Or si deux droites sont perpendiculaires à une même droite, alors elles sont parallèles entre elles. Donc (AB) // (FE).</p>
   <p>b) Je sais que (AB) // (SR) et (AS) ⊥ (SR) (angle droit codé en S). Or si deux droites sont parallèles et si une troisième droite est perpendiculaire à l'une, alors elle est perpendiculaire à l'autre. Donc (AS) ⊥ (AB).</p>`},
  {n:"Exercice 6", t:"Repérer les droites utiles", w:"Sur ton cahier", h:`<div class="figs"><figure>${ex("p4-05","Figure a de l'exercice 6",300)}<figcaption>a) Que peut-on dire des droites (d₂) et (d₃) ?</figcaption></figure>
   <figure>${ex("p4-06","Figure b de l'exercice 6",260)}<figcaption>b) Que peut-on dire des droites (FY) et (GH) ?</figcaption></figure>
   <figure>${ex("p4-07","Figure c de l'exercice 6",200)}<figcaption>c) On sait que (NK) // (IC). Que peut-on dire des droites (NK) et (NI) ?</figcaption></figure></div>`,
   c:`<p>a) (d₂) ⊥ (d₄) et (d₃) ⊥ (d₄) (angles droits codés). Or si deux droites sont perpendiculaires à une même droite, alors elles sont parallèles entre elles. Donc (d₂) // (d₃).</p>
   <p>b) (FY) ⊥ (FG) et (GH) ⊥ (FG) (angles droits en F et en G). Même propriété : (FY) // (GH).</p>
   <p>c) (NK) // (IC) et (NI) ⊥ (IC) (angle droit en I, et N est sur [AI]). Or si deux droites sont parallèles et si une troisième droite est perpendiculaire à l'une, alors elle est perpendiculaire à l'autre. Donc (NK) ⊥ (NI).</p>`},
  {n:"Exercice 7", t:"Toute la partie B", w:"Sur ton cahier", h:`${ex("p5-08","Figure de l'exercice 7 avec sept droites",420)}<p>On donne : (d₁) // (d₂) et (d₄) // (d₆).</p>
   <p>a) Trouve tous les couples de droites perpendiculaires que tu peux justifier. b) Trouve des couples de droites parallèles, et justifie chacun par une propriété du cours. c) Quelles droites sont sécantes sans être perpendiculaires ?</p>`,
   c:`<p><b>Codés sur la figure :</b> (d₁) ⊥ (d₅), (d₃) ⊥ (d₅), (d₁) ⊥ (d₆).</p>
   <p>a) Avec la propriété 2 : (d₁) // (d₂) et (d₁) ⊥ (d₅), donc (d₂) ⊥ (d₅). De même (d₂) ⊥ (d₆). (d₄) // (d₆) et (d₁) ⊥ (d₆), donc (d₁) ⊥ (d₄), et de même (d₂) ⊥ (d₄). En continuant, chacune des droites (d₁), (d₂), (d₃) est perpendiculaire à chacune des droites (d₄), (d₅), (d₆).</p>
   <p>b) (d₁) // (d₃) : elles sont perpendiculaires à (d₅) (propriété 1). (d₅) // (d₆) : elles sont perpendiculaires à (d₁) (propriété 1). (d₄) // (d₅) : elles sont perpendiculaires à (d₁) (propriété 1). (d₂) // (d₃) : elles sont perpendiculaires à (d₅) (propriété 1).</p>
   <p>c) (d₇) coupe chacune des six autres droites (parfois en les prolongeant), sans former d'angle droit.</p>`}
 ],
 aide:{t:"Pour démarrer", w:"Sur ton cahier", h:`<p>On sait que (u) ⊥ (w) et (v) ⊥ (w). Recopie et complète : Je sais que …… Or …… Donc ……</p>`,
  c:`Je sais que (u) ⊥ (w) et (v) ⊥ (w). Or si deux droites sont perpendiculaires à une même droite, alors elles sont parallèles entre elles. Donc (u) // (v).`},
 defi:{t:"Une chaîne de droites", w:"Sur ton cahier", h:`<p>On sait que (d₁) ⊥ (d₂), (d₂) ⊥ (d₃) et (d₃) ⊥ (d₄). Que peut-on dire des droites (d₁) et (d₄) ? Justifie en deux étapes.</p>`,
  c:`<p>Étape 1 : (d₁) ⊥ (d₂) et (d₃) ⊥ (d₂), donc (d₁) // (d₃) (propriété 1).</p><p>Étape 2 : (d₁) // (d₃) et (d₄) ⊥ (d₃), donc (d₄) ⊥ (d₁) (propriété 2).</p>`}
},
{t:"Constructions", e:[
  {n:"Exercice 8", t:"Tracer des perpendiculaires", w:"Sur ta feuille", h:`<p>Dans chaque cas, trace la perpendiculaire à (d) passant par M. Nomme-la (d'). N'oublie pas de coder l'angle droit.</p>
   <div class="figs">${ex("p6-09","Cas a",300)}${ex("p6-11","Cas b",300)}${ex("p6-13","Cas c",250)}</div>`,
   c:`<div class="figs"><figure>${perpCase(C8[0],0)}<figcaption>Cas a : M est sur (d).</figcaption></figure><figure>${perpCase(C8[1],1)}<figcaption>Cas b</figcaption></figure><figure>${perpCase(C8[2],2)}<figcaption>Cas c</figcaption></figure></div>
   <p>Pour vérifier : pose ton équerre sur (d) et (d'), l'angle droit doit coller parfaitement, et (d') doit passer exactement par M. N'oublie pas le petit carré pour coder l'angle droit et le nom (d').</p>`},
  {n:"Exercice 9", t:"Tracer des parallèles", w:"Sur ta feuille", h:`<p>Dans chaque cas, trace la parallèle à (d) passant par M. Nomme-la (d').</p>
   <div class="figs">${ex("p7-15","Cas a",300)}${ex("p7-17","Cas b",300)}${ex("p7-19","Cas c",300)}</div>`,
   c:`<p>Méthode : trace d'abord la perpendiculaire (k) à (d) passant par M (en pointillés), puis la perpendiculaire à (k) passant par M : c'est (d').</p>
   <div class="figs"><figure>${parCase(C9[0],0)}<figcaption>Cas a : (d') // (d)</figcaption></figure><figure>${parCase(C9[1],1)}<figcaption>Cas b : (d') // (d)</figcaption></figure><figure>${parCase(C9[2],2)}<figcaption>Cas c : (d') // (d)</figcaption></figure></div>
   <p>Pour vérifier, l'écart entre (d) et (d') doit être le même partout.</p>`},
  {n:"Exercice 10", t:"Construire puis justifier", w:"Sur ta feuille", h:`${ex("p7-21","Figure de l'exercice 10",420)}<p>1 — Trace la droite (d₁) parallèle à (d) passant par A. 2 — Trace la droite (d₂) perpendiculaire à (d) passant par B. 3 — Que peut-on dire des droites (d₁) et (d₂) ? Justifie à l'aide d'une propriété du cours.</p>`,
   c:`<p>Questions 1 et 2 : la figure attendue.</p>${d10}<p>(d₁) // (d)</p><p>3 — Je sais que (d₁) // (d) et (d₂) ⊥ (d). Or si deux droites sont parallèles et si une troisième droite est perpendiculaire à l'une, alors elle est perpendiculaire à l'autre. Donc (d₂) ⊥ (d₁).</p>`},
  {n:"Exercice 11", t:"Programmes de construction", w:"Sur ton cahier", h:`<p>1 — Exécute ce programme de construction : trace une droite (d), puis place deux points M et N sur (d). Trace la droite (d₁) perpendiculaire à (d) passant par M. Trace la droite (d₂) perpendiculaire à (d) passant par N. Que peut-on dire des droites (d₁) et (d₂) ? Justifie.</p>
   <p>2 — Écris à ton tour le programme de construction de la figure ci-dessous.</p>${ex("p8-23","Figure de l'exercice 11",240)}`,
   c:`<p>1 — Voici la figure obtenue :</p>${d11}<p>Je sais que (d₁) ⊥ (d) et (d₂) ⊥ (d). Or si deux droites sont perpendiculaires à une même droite, alors elles sont parallèles entre elles. Donc (d₁) // (d₂).</p>
   <p>2 — Un programme possible : trace une droite (d) et place un point A sur (d). Trace la droite (d₁) perpendiculaire à (d) passant par A. Place un point B sur (d₁). Trace la droite (d₂) parallèle à (d) passant par B.</p>`}
 ],
 aide:{t:"Pour démarrer", w:"Sur ton cahier", h:`<p>Remets dans l'ordre les étapes pour tracer la perpendiculaire à (d) passant par M :</p><p>(1) On nomme la droite (d') et on code l'angle droit. (2) On pose un côté de l'angle droit de l'équerre sur (d), l'autre côté sur le point M. (3) On trace la droite le long du côté de l'équerre, puis on la prolonge à la règle.</p>`,
  c:`Ordre : (2), puis (3), puis (1).`},
 defi:{t:"Deux perpendiculaires", w:"Sur ton cahier", h:`<p>Trace une droite (d) et un point A qui n'appartient pas à (d). Trace (d₁) perpendiculaire à (d) passant par A, puis (d₂) perpendiculaire à (d₁) passant par A. Que peut-on dire de (d₂) et de (d) ? Justifie.</p>`,
  c:`${dDefC}<p>(d₂) // (d)</p><p>Je sais que (d) ⊥ (d₁) et (d₂) ⊥ (d₁). Or si deux droites sont perpendiculaires à une même droite, alors elles sont parallèles entre elles. Donc (d₂) // (d). C'est exactement la méthode du cours pour tracer une parallèle !</p>`}
}
],

/* ===================== QUIZ PROGRESSIF ===================== */
quiz: [
{nom:"Notations", q:{
 1:[ {q:"Comment note-t-on le segment d'extrémités A et B ?", c:["[AB]","(AB)","[AB)","AB"], rep:"[AB]", ex:"Un segment se note avec deux crochets."},
     {q:"Comment note-t-on la droite qui passe par E et F ?", c:["(EF)","[EF]","[EF)","EF"], rep:"(EF)", ex:"Une droite se note avec deux parenthèses."},
     {q:"Quelle notation désigne la longueur du segment [AB] ?", c:["AB","[AB]","(AB)","[AB)"], rep:"AB", ex:"La longueur se note sans crochets : AB."} ],
 2:[ {q:"Que désigne [AB) ?", c:["La demi-droite d'origine A passant par B","La demi-droite d'origine B passant par A","Le segment d'extrémités A et B","La droite passant par A et B"], rep:"La demi-droite d'origine A passant par B", ex:"Le crochet est du côté de l'origine : A."},
     {q:"Vrai ou faux : [AB) et [BA) désignent la même demi-droite.", c:VF, rep:"Faux", ex:"Elles n'ont pas la même origine."},
     {q:"Vrai ou faux : [AB] et [BA] désignent le même segment.", c:VF, rep:"Vrai", ex:"Un segment a deux extrémités, l'ordre ne compte pas."} ],
 3:[ {q:"Les points A, B et C sont dans cet ordre sur une droite. Le point C appartient-il à la demi-droite [BA) ?", fig:figAlign, c:["C ∉ [BA)","C ∈ [BA)"], rep:"C ∉ [BA)", ex:"[BA) part de B et va vers A : C est de l'autre côté."},
     {q:"Que peut-on mesurer ?", c:["Un segment","Une droite","Une demi-droite"], rep:"Un segment", ex:"La droite et la demi-droite sont illimitées."},
     {q:"A, B et C sont alignés. Combien de droites différentes passent par deux de ces points ?", c:["Une seule","Deux","Trois"], rep:"Une seule", ex:"(AB), (BC) et (AC) sont trois noms de la même droite."} ]
}},
{nom:"Appartenance et alignement", q:{
 1:[ {q:"Que signifie le symbole ∈ ?", c:["appartient à","n'appartient pas à","est parallèle à","est perpendiculaire à"], rep:"appartient à"},
     {q:"Quelle phrase est juste ?", fig:figAlign, c:["D ∉ (AB)","D ∈ (AB)"], rep:"D ∉ (AB)", ex:"D n'est pas sur la droite (AB)."},
     {q:"Quels points sont alignés ?", fig:figAlign, c:["A, B et C","A, B et D","B, C et D"], rep:"A, B et C"} ],
 2:[ {q:"Complète : B …… [AC]", fig:figAlign, c:["∈","∉"], rep:"∈", ex:"B est entre A et C : il est sur le segment."},
     {q:"Complète : A …… [BC]", fig:figAlign, c:["∈","∉"], rep:"∉", ex:"A n'est pas entre B et C."},
     {q:"Vrai ou faux : deux points sont toujours alignés.", c:VF, rep:"Vrai", ex:"On peut toujours tracer une droite qui passe par deux points."} ],
 3:[ {q:"Complète : C …… (AB) et C …… [AB]", fig:figAlign, c:["∈ et ∉","∈ et ∈","∉ et ∈","∉ et ∉"], rep:"∈ et ∉", ex:"C est sur la droite (AB), mais pas entre A et B."},
     {q:"Les droites (AD) et (CD) se coupent en un point. Lequel ?", fig:figAlign, c:["D","A","B","C"], rep:"D", ex:"D appartient aux deux droites : c'est leur point d'intersection."},
     {q:"Un point H vérifie H ∈ (PL) et H ∉ [PL]. Où est-il ?", c:["Sur la droite (PL), en dehors du segment","Entre P et L","En dehors de la droite (PL)"], rep:"Sur la droite (PL), en dehors du segment"} ]
}},
{nom:"Sécantes, perpendiculaires, parallèles", q:{
 1:[ {q:"Que signifie (d) // (d') ?", c:["(d) est parallèle à (d')","(d) est perpendiculaire à (d')","(d) coupe (d')"], rep:"(d) est parallèle à (d')"},
     {q:"Quel symbole signifie « est perpendiculaire à » ?", c:["⊥","//","∈","∉"], rep:"⊥"},
     {q:"Deux droites qui se coupent en formant un angle droit sont :", c:["perpendiculaires","parallèles","confondues"], rep:"perpendiculaires"} ],
 2:[ {q:"Ces deux droites sont :", fig:figSec, c:["sécantes, sans être perpendiculaires","parallèles","perpendiculaires"], rep:"sécantes, sans être perpendiculaires", ex:"Elles se coupent, mais l'angle n'est pas droit."},
     {q:"Ces deux droites sont :", fig:figPerp, c:["perpendiculaires","parallèles","ni sécantes ni parallèles"], rep:"perpendiculaires", ex:"L'angle droit est codé par le petit carré."},
     {q:"Vrai ou faux : deux droites perpendiculaires sont toujours sécantes.", c:VF, rep:"Vrai", ex:"Elles se coupent, en formant un angle droit."} ],
 3:[ {q:"Vrai ou faux : deux droites qui ne se coupent pas sur ma feuille sont forcément parallèles.", c:VF, rep:"Faux", ex:"En les prolongeant, elles peuvent se couper."},
     {q:"Ces deux droites sont :", fig:figLoin, c:["sécantes","parallèles"], rep:"sécantes", ex:"Elles se rapprochent : si on les prolonge vers la droite, elles se coupent."},
     {q:"Deux droites parallèles :", c:["ne se coupent jamais","se coupent en un seul point","forment un angle droit"], rep:"ne se coupent jamais"} ]
}},
{nom:"Les deux propriétés", q:{
 1:[ {q:"On sait que (a) ⊥ (c) et (b) ⊥ (c). Alors :", c:["(a) // (b)","(a) ⊥ (b)","On ne peut rien dire"], rep:"(a) // (b)", ex:"Deux droites perpendiculaires à une même droite sont parallèles."},
     {q:"On sait que (a) // (b) et (c) ⊥ (a). Alors :", c:["(c) ⊥ (b)","(c) // (b)","On ne peut rien dire"], rep:"(c) ⊥ (b)", ex:"Une droite perpendiculaire à l'une de deux parallèles est perpendiculaire à l'autre."} ],
 2:[ {q:"(d₁) ⊥ (d) et (d₂) ⊥ (d), donc (d₁) // (d₂). Quelle propriété a-t-on utilisée ?", c:["Si deux droites sont perpendiculaires à une même droite, alors elles sont parallèles entre elles.","Si deux droites sont parallèles et si une troisième droite est perpendiculaire à l'une, alors elle est perpendiculaire à l'autre."], rep:"Si deux droites sont perpendiculaires à une même droite, alors elles sont parallèles entre elles."},
     {q:"Dans un quadrilatère EFGH, (EH) ⊥ (EF) et (FG) ⊥ (EF). Que peut-on dire de (EH) et (FG) ?", c:["(EH) // (FG)","(EH) ⊥ (FG)","On ne peut rien dire"], rep:"(EH) // (FG)", ex:"Elles sont perpendiculaires à la même droite (EF)."},
     {q:"Dans une justification, que met-on après « Or » ?", c:["La propriété du cours","Ce que je sais d'après l'énoncé","La conclusion"], rep:"La propriété du cours", ex:"Je sais que (l'énoncé), Or (la propriété), Donc (la conclusion)."} ],
 3:[ {q:"On sait que (x) // (y) et (z) ⊥ (y). Que peut-on dire de (z) et (x), et avec quelle propriété ?", c:["(z) ⊥ (x), propriété 2","(z) ⊥ (x), propriété 1","(z) // (x), propriété 1","(z) // (x), propriété 2"], rep:"(z) ⊥ (x), propriété 2"},
     {q:"On sait que (d₁) ⊥ (d₃), (d₂) ⊥ (d₃) et (d₄) ⊥ (d₁). Que peut-on dire de (d₄) et (d₂) ?", c:["(d₄) ⊥ (d₂)","(d₄) // (d₂)","On ne peut rien dire"], rep:"(d₄) ⊥ (d₂)", ex:"D'abord (d₁) // (d₂) (propriété 1), puis (d₄) ⊥ (d₂) (propriété 2)."},
     {q:"On sait que (a) ⊥ (b) et (c) ⊥ (a). Que peut-on dire de (b) et (c) ?", c:["(b) // (c)","(b) ⊥ (c)","On ne peut rien dire"], rep:"(b) // (c)", ex:"(b) et (c) sont toutes les deux perpendiculaires à (a) : propriété 1."} ]
}},
{nom:"Constructions", q:{
 1:[ {q:"Pour tracer une perpendiculaire, de quels instruments as-tu besoin ?", c:["La règle et l'équerre","Le compas seul","La règle seule"], rep:"La règle et l'équerre"},
     {q:"Après avoir tracé une perpendiculaire, il ne faut pas oublier :", c:["de coder l'angle droit et de nommer la droite","d'effacer la droite de départ","de mesurer la droite"], rep:"de coder l'angle droit et de nommer la droite"} ],
 2:[ {q:"Avec la méthode du cours, pour tracer la parallèle à (d) passant par M, on trace d'abord :", c:["la perpendiculaire (k) à (d) passant par M","un cercle de centre M","la droite (dM)"], rep:"la perpendiculaire (k) à (d) passant par M"},
     {q:"Pour tracer la perpendiculaire à (d) passant par M, où pose-t-on l'équerre ?", c:["Un côté de l'angle droit sur (d), l'autre côté passant par M","L'angle droit sur le point M, sans toucher (d)","Le grand côté de l'équerre sur (d), n'importe où"], rep:"Un côté de l'angle droit sur (d), l'autre côté passant par M"} ],
 3:[ {q:"Pourquoi la méthode de la parallèle (deux perpendiculaires) fonctionne-t-elle ?", c:["(d) et (d') sont perpendiculaires à (k), donc parallèles (propriété 1)","(d) et (d') ont la même longueur","(k) est parallèle à (d)"], rep:"(d) et (d') sont perpendiculaires à (k), donc parallèles (propriété 1)"},
     {q:"Tu traces (d₁) // (d) passant par A, puis (d₂) ⊥ (d) passant par B. Que peux-tu dire de (d₁) et (d₂) ?", c:["(d₂) ⊥ (d₁)","(d₂) // (d₁)","On ne peut rien dire"], rep:"(d₂) ⊥ (d₁)", ex:"Propriété 2 : (d₂) est perpendiculaire à (d), donc aussi à sa parallèle (d₁)."} ]
}}
],

/* ===================== ÉVAL D'ENTRAÎNEMENT (+ version aménagée pour les élèves à besoins particuliers) ===================== */
eval:(()=>{
/* figures de l'évaluation (même outil «&nbsp;dessin&nbsp;» que les corrections du chapitre) */
const pq = k => dessin([0,0,300,70],280,"Les points P, Q et R alignés, Q en dehors du segment [PR]",[{d:[[40,40],[1,0]]},{x:[40,40],n:"P",dx:-5,dy:-13},{x:[150,40],n:"R",dx:-5,dy:-13}].concat(k?[{x:[240,40],n:"Q",dx:-5,dy:-13,k:"n"}]:[]));
/* exercice 2 : deux droites qui se coupent en B, et le point F */
const u1=vun([1,-0.3]), u2=vun([0.5,-1]), A2=[40,172], B2=vadd(A2,u1,135), C2=vadd(A2,u1,262), D2=vadd(B2,u2,-75), E2=vadd(B2,u2,100), F2=vadd(A2,vsub(E2,A2),0.55);
const fig2 = dessin([0,0,340,230],340,"Deux droites qui se coupent en B : A, B, C sur l'une, D, B, E sur l'autre, et un point F",[
  {d:[A2,u1]},{d:[B2,u2]},{x:A2,n:"A",dx:-6,dy:-12},{x:B2,n:"B",dx:10,dy:16},{x:C2,n:"C",dx:-4,dy:-12},{x:D2,n:"D",dx:10,dy:6},{x:E2,n:"E",dx:10,dy:4},{x:F2,n:"F",dx:-6,dy:-12}]);
/* exercice 3 : quatre points R, S, T, U */
const R3=[40,40], S3=[70,170], T3=[320,175], U3=[252,66], K3=inter(R3,T3,S3,U3), su=vsub(U3,S3), L3=vadd(S3,su,1.3), N3=vadd(S3,vsub(S3,R3),0.35), Z3=vadd(S3,su,1.57);
const P3 = [{x:R3,n:"R",dx:4,dy:-12},{x:S3,n:"S",dx:-20,dy:8},{x:T3,n:"T",dx:-4,dy:-12},{x:U3,n:"U",dx:-4,dy:-12}];
const fig3 = dessin([0,0,360,240],360,"Les points R, S, T et U",P3);
const cor3f = withN => dessin([0,0,360,240],360,"Correction : la droite (RT), la demi-droite [SU), les points K et L"+(withN?" et N":""),[
  {d:[R3,vsub(T3,R3)]},{s:[S3,Z3]},...(withN?[{d:[R3,vsub(S3,R3)],k:"c"}]:[]),...P3,
  {x:K3,n:"K",dx:-6,dy:22,k:"n"},{x:L3,n:"L",dx:-4,dy:-12,k:"n"},...(withN?[{x:N3,n:"N",dx:10,dy:6,k:"n"}]:[])]);
const cor3 = cor3f(1);
/* exercice 4 : plan du quartier */
const ua=vun([1,-0.08]), va=vperp(ua), Pa=[20,165], Pb=[20,62], Ra=vadd(Pa,ua,95), Sa=vadd(Pa,ua,225);
const plan = dessin([0,0,340,215],340,"Plan : l'avenue (a), le boulevard (b) parallèle à (a), les rues (r) et (s) perpendiculaires à (a)",[
  {d:[Pa,ua]},{d:[Pb,ua]},{d:[Ra,va]},{d:[Sa,va]},{r:[Ra,ua,[-va[0],-va[1]]]},{r:[Sa,ua,[-va[0],-va[1]]]},
  {t:[302,134,"(a)"]},{t:[302,30,"(b)"]},{t:[Ra[0]+8,205,"(r)"]},{t:[Sa[0]+8,205,"(s)"]}]);
/* exercice 5 : trois points A, B, C */
const A5=[60,195], B5=[265,160], C5=[165,55], ab=vsub(B5,A5), n5=vperp(vun(ab)), H5=vfoot(C5,A5,ab), bc=vsub(C5,B5), F5=vfoot(A5,B5,bc);
const P5 = [{x:A5,n:"A",dx:6,dy:22},{x:B5,n:"B",dx:-22,dy:22},{x:C5,n:"C",dx:10,dy:-6}];
const fig5 = dessin([0,0,360,270],340,"Les points A, B et C",P5);
const cor5 = dessin([0,0,360,270],420,"Correction : (x) et (y) perpendiculaires à (AB), (z) parallèle à (BC)",[
  {d:[A5,ab]},{d:[B5,bc]},{d:[C5,n5],k:"n"},{r:[H5,ab,vsub(C5,H5)],k:"n"},{d:[B5,n5],k:"n"},{r:[B5,[-ab[0],-ab[1]],vsub(C5,H5)],k:"n"},
  {d:[A5,vperp(vun(bc))],k:"c"},{r:[F5,bc,vsub(A5,F5)]},{r:[A5,[-bc[0],-bc[1]],vsub(F5,A5)]},{d:[A5,bc],k:"n"},...P5,
  {t:[207,262,"(x)"],k:"n"},{t:[290,262,"(y)"],k:"n"},{t:[78,262,"(z)"],k:"n"},{t:[318,140,"(AB)"]},{t:[96,40,"(BC)"]}]);
const CORR5 = `<p>a) et b) (x) passe par C, (y) passe par B ; les deux angles droits sont codés. <i>(1,5 point pour (x), 1 point pour (y))</i></p>
  <p>c) Pour la parallèle : je trace la perpendiculaire à (BC) passant par A (en pointillés), puis la perpendiculaire à cette droite passant par A : c'est (z). <i>(1,5 point)</i></p>${cor5}<p>(z) // (BC)</p>`;
return {
titre:"Évaluation d'entraînement — Chapitre 2", duree:45, info:"Durée : 45 min · Matériel : règle, équerre, crayon à papier",
comp:[
  ["COMMUNIQUER","Je traduis une phrase en symboles, et des symboles en phrase.","Ex. 1 (3 points)"],
  ["REPRÉSENTER","Je lis une figure avec ∈ et ∉, et je construis perpendiculaires et parallèles à l'équerre.","Ex. 2 et 5 (9 points)"],
  ["CHERCHER","Je trouve où placer un point quand on me donne plusieurs conditions.","Ex. 3 (4 points)"],
  ["RAISONNER","Je rédige une preuve : Je sais que… Or… Donc…","Ex. 4 (4 points)"]
],
exos:[
{t:"Des mots et des symboles", p:3, h:`<p>a) Recopie et complète le tableau.</p>
  <div class="scroll"><table class="std"><thead><tr><th>En français</th><th>Avec des symboles</th></tr></thead><tbody>
   <tr><td>La droite (d) est parallèle à la droite (e).</td><td>……………</td></tr>
   <tr><td>Le point K appartient à la demi-droite d'origine J qui passe par L.</td><td>……………</td></tr>
   <tr><td>……………………………………………</td><td>T ∈ [UV]</td></tr></tbody></table></div>
  <p>b) Fais un dessin qui respecte la phrase : «&nbsp;Les points P, Q et R sont alignés, et Q&nbsp;∉&nbsp;[PR].&nbsp;»</p>`,
 c:`<p>a)</p><div class="scroll"><table class="std"><thead><tr><th>En français</th><th>Avec des symboles</th></tr></thead><tbody>
   <tr><td>La droite (d) est parallèle à la droite (e).</td><td><b>(d) // (e)</b> <i>(0,5 point)</i></td></tr>
   <tr><td>Le point K appartient à la demi-droite d'origine J qui passe par L.</td><td><b>K ∈ [JL)</b> <i>(0,5 point)</i></td></tr>
   <tr><td><b>Le point T appartient au segment [UV].</b> <i>(1 point)</i></td><td>T ∈ [UV]</td></tr></tbody></table></div>
  <p>b) P, Q et R sont sur une même droite, mais Q n'est pas entre P et R. Par exemple :</p>${pq(1)}<p>Q peut aussi être placé avant P. <i>(1 point)</i></p>`},
{t:"∈ ou ∉ ?", p:4, h:`${fig2}<p>Recopie chaque ligne avec le bon symbole, ∈ ou ∉. Ta règle peut t'aider.</p>
  <p>1. B …… (AC) · 2. A …… [BC] · 3. C …… [BA) · 4. E …… [DB) · 5. D …… [BE] · 6. F …… (AE) · 7. B …… [DE] · 8. A …… [CB)</p>`,
 c:`<p>1. B ∈ (AC) · 2. A ∉ [BC] (A n'est pas entre B et C) · 3. C ∉ [BA) (la demi-droite part de B vers A, C est de l'autre côté) · 4. E ∈ [DB) (elle part de D, passe par B et continue jusqu'à E) · 5. D ∉ [BE] · 6. F ∈ (AE) (avec la règle : A, F et E sont alignés) · 7. B ∈ [DE] · 8. A ∈ [CB)</p><p><i>(0,5 point par réponse)</i></p>`},
{t:"Où sont K, L et N ?", p:4, h:`${fig3}<p>1) Trace la droite (RT) et la demi-droite [SU).</p><p>2) Elles se coupent en un point : nomme-le K.</p><p>3) Place un point L tel que L ∈ [SU) et L ∉ [SU].</p><p>4) Place un point N tel que S ∈ [RN].</p>`,
 c:`${cor3}<p>1) La droite (RT) dépasse R et T ; la demi-droite [SU) part de S, passe par U et continue. <i>(1 point)</i></p>
  <p>2) K est le point où (RT) et [SU) se coupent. Il n'y a qu'une seule position possible. <i>(1 point)</i></p>
  <p>3) L est sur la demi-droite [SU), plus loin que U (pas entre S et U). <i>(1 point)</i></p>
  <p>4) S doit être entre R et N : N est sur la droite (RS), de l'autre côté de S par rapport à R. <i>(1 point)</i></p><p>L et N peuvent être placés ailleurs, s'ils respectent les conditions.</p>`},
{t:"Le plan du quartier", p:4, h:`<p>Sur le plan d'un quartier, toutes les rues sont droites. On sait que :</p>
  <ul><li>la rue des Lilas (r) est perpendiculaire à l'avenue (a) ;</li><li>la rue des Roses (s) est perpendiculaire à l'avenue (a) ;</li><li>le boulevard (b) est parallèle à l'avenue (a).</li></ul>
  <p>a) Les rues (r) et (s) vont-elles se croiser ? Prouve ta réponse en citant une propriété du cours.</p><p>b) La rue (r) et le boulevard (b) forment-ils un angle droit ? Prouve-le.</p><p><i>Tu peux faire un dessin à main levée.</i></p>`,
 c:`${plan}<p>(a) // (b)</p>
  <p>a) Je sais que (r) ⊥ (a) et (s) ⊥ (a). Or, si deux droites sont perpendiculaires à une même droite, alors elles sont parallèles entre elles. Donc <b>(r) // (s)</b> : les deux rues ne se croiseront jamais. <i>(2 points : 0,5 point pour les données, 1 point pour la propriété, 0,5 point pour la conclusion)</i></p>
  <p>b) Je sais que (a) // (b) et (r) ⊥ (a). Or, si deux droites sont parallèles et si une troisième droite est perpendiculaire à l'une, alors elle est perpendiculaire à l'autre. Donc <b>(r) ⊥ (b)</b> : la rue et le boulevard forment un angle droit. <i>(2 points, même répartition)</i></p>`},
{t:"Perpendiculaires et parallèle", p:5, h:`${fig5}<p>Constructions à la règle et à l'équerre : ne gomme pas tes traits de construction.</p>
  <p>a) Trace la droite (AB), puis la droite (x) perpendiculaire à (AB) passant par C. N'oublie pas le codage de l'angle droit.</p>
  <p>b) Trace la droite (y) perpendiculaire à (AB) passant par B, avec le codage de l'angle droit.</p>
  <p>c) Trace la droite (BC), puis la droite (z) parallèle à (BC) passant par A.</p>
  <p>d) Les droites (x) et (y) sont-elles parallèles ? Prouve-le avec une propriété.</p>`,
 c:`${CORR5}<p>d) Je sais que (x) ⊥ (AB) et (y) ⊥ (AB). Or, si deux droites sont perpendiculaires à une même droite, alors elles sont parallèles entre elles. Donc <b>(x) // (y)</b> : oui, elles sont parallèles. <i>(1 point)</i></p>`}
],

/* ---------- version aménagée (tiers-temps) : le même sujet, environ un quart des questions en moins ---------- */
bep:{
titre:"Évaluation d'entraînement — Chapitre 2 · version aménagée", duree:45, info:"Version aménagée (tiers-temps) · Durée : 45 min · Matériel : règle, équerre, crayon à papier",
note:"Le même sujet avec 5 questions en moins, à faire dans le même temps. Le total reste sur 20 points.",
comp:[
  ["COMMUNIQUER","Je traduis une phrase en symboles, et des symboles en phrase.","Ex. 1 (3 points)"],
  ["REPRÉSENTER","Je lis une figure avec ∈ et ∉, et je construis perpendiculaires et parallèles à l'équerre.","Ex. 2 et 5 (9 points)"],
  ["CHERCHER","Je trouve où placer un point quand on me donne plusieurs conditions.","Ex. 3 (4 points)"],
  ["RAISONNER","Je rédige une preuve : Je sais que… Or… Donc…","Ex. 4 (4 points)"]
],
exos:[
{t:"Des mots et des symboles", p:3, h:`<p>Recopie et complète le tableau.</p>
  <div class="scroll"><table class="std"><thead><tr><th>En français</th><th>Avec des symboles</th></tr></thead><tbody>
   <tr><td>La droite (d) est parallèle à la droite (e).</td><td>……………</td></tr>
   <tr><td>Le point K appartient à la demi-droite d'origine J qui passe par L.</td><td>……………</td></tr>
   <tr><td>……………………………………………</td><td>T ∈ [UV]</td></tr></tbody></table></div>`,
 c:`<div class="scroll"><table class="std"><thead><tr><th>En français</th><th>Avec des symboles</th></tr></thead><tbody>
   <tr><td>La droite (d) est parallèle à la droite (e).</td><td><b>(d) // (e)</b> <i>(1 point)</i></td></tr>
   <tr><td>Le point K appartient à la demi-droite d'origine J qui passe par L.</td><td><b>K ∈ [JL)</b> <i>(1 point)</i></td></tr>
   <tr><td><b>Le point T appartient au segment [UV].</b> <i>(1 point)</i></td><td>T ∈ [UV]</td></tr></tbody></table></div>`},
{t:"∈ ou ∉ ?", p:3, h:`${fig2}<p>Recopie chaque ligne avec le bon symbole, ∈ ou ∉. Ta règle peut t'aider.</p>
  <p>1. B …… (AC) · 2. A …… [BC] · 3. C …… [BA) · 4. E …… [DB) · 5. D …… [BE] · 6. F …… (AE)</p>`,
 c:`<p>1. B ∈ (AC) · 2. A ∉ [BC] (A n'est pas entre B et C) · 3. C ∉ [BA) (la demi-droite part de B vers A, C est de l'autre côté) · 4. E ∈ [DB) (elle part de D, passe par B et continue jusqu'à E) · 5. D ∉ [BE] · 6. F ∈ (AE) (avec la règle : A, F et E sont alignés)</p><p><i>(0,5 point par réponse)</i></p>`},
{t:"Où sont K et L ?", p:4, h:`${fig3}<p>1) Trace la droite (RT) et la demi-droite [SU).</p><p>2) Elles se coupent en un point : nomme-le K.</p><p>3) Place un point L tel que L ∈ [SU) et L ∉ [SU].</p>`,
 c:`${cor3f(0)}<p>1) La droite (RT) dépasse R et T ; la demi-droite [SU) part de S, passe par U et continue. <i>(1,5 point)</i></p>
  <p>2) K est le point où (RT) et [SU) se coupent. Il n'y a qu'une seule position possible. <i>(1 point)</i></p>
  <p>3) L est sur la demi-droite [SU), plus loin que U (pas entre S et U). <i>(1,5 point)</i></p><p>L peut être placé ailleurs, s'il respecte les conditions.</p>`},
{t:"Le plan du quartier", p:4, h:`<p>Sur le plan d'un quartier, toutes les rues sont droites. On sait que :</p>
  <ul><li>la rue des Lilas (r) est perpendiculaire à l'avenue (a) ;</li><li>la rue des Roses (s) est perpendiculaire à l'avenue (a) ;</li><li>le boulevard (b) est parallèle à l'avenue (a).</li></ul>
  <p>a) Les rues (r) et (s) vont-elles se croiser ? Prouve ta réponse en citant une propriété du cours.</p><p>b) La rue (r) et le boulevard (b) forment-ils un angle droit ? Prouve-le.</p><p><i>Tu peux faire un dessin à main levée.</i></p>`,
 c:`${plan}<p>(a) // (b)</p>
  <p>a) Je sais que (r) ⊥ (a) et (s) ⊥ (a). Or, si deux droites sont perpendiculaires à une même droite, alors elles sont parallèles entre elles. Donc <b>(r) // (s)</b> : les deux rues ne se croiseront jamais. <i>(2 points : 0,5 point pour les données, 1 point pour la propriété, 0,5 point pour la conclusion)</i></p>
  <p>b) Je sais que (a) // (b) et (r) ⊥ (a). Or, si deux droites sont parallèles et si une troisième droite est perpendiculaire à l'une, alors elle est perpendiculaire à l'autre. Donc <b>(r) ⊥ (b)</b> : la rue et le boulevard forment un angle droit. <i>(2 points, même répartition)</i></p>`},
{t:"Perpendiculaires et parallèle", p:6, h:`${fig5}<p>Constructions à la règle et à l'équerre : ne gomme pas tes traits de construction.</p>
  <p>a) Trace la droite (AB), puis la droite (x) perpendiculaire à (AB) passant par C. N'oublie pas le codage de l'angle droit.</p>
  <p>b) Trace la droite (y) perpendiculaire à (AB) passant par B, avec le codage de l'angle droit.</p>
  <p>c) Trace la droite (BC), puis la droite (z) parallèle à (BC) passant par A.</p>`,
 c:`<p>a) et b) (x) passe par C, (y) passe par B ; les deux angles droits sont codés. <i>(2 points pour (x), 2 points pour (y))</i></p>
  <p>c) Pour la parallèle : je trace la perpendiculaire à (BC) passant par A (en pointillés), puis la perpendiculaire à cette droite passant par A : c'est (z). <i>(2 points)</i></p>${cor5}<p>(z) // (BC)</p>`}
]}
};
})()
};
})();
